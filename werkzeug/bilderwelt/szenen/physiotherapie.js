#!/usr/bin/env node
/* =====================================================================
   DIE PHYSIOTHERAPIE (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (Einrichtung von Physiotherapie-Praxen: Hersteller von
   Therapieliegen und Trainingsgeräten, Praxisplanung; Heilmittel-
   verordnung „Muster 13“ der Krankenkassen):
   - Ein heller BEHANDLUNGS- und ÜBUNGSRAUM mit Holzboden: an der Wand
     die SPROSSENWAND aus Holz, daran hängen THERABÄNDER in Stärke-
     farben (gelb leicht, rot mittel, grün stark, blau sehr stark);
     daneben ein großer SPIEGEL, damit Patienten ihre Haltung sehen.
   - Davor die GYMNASTIKMATTE mit Therapiebällen (Pezziball, kleiner
     Ball), Igelball und Faszienrolle; ein Ständer mit KURZHANTELN.
   - Die elektrisch höhenverstellbare BEHANDLUNGSLIEGE mit Kopfteil;
     der Patient liegt in Sportkleidung darauf, die Physiotherapeutin
     bewegt sein Knie (Mobilisation).
   - Die WÄRMELAMPE (Rotlicht) auf einem Rollstativ, ein SKELETTMODELL
     zum Erklären, ein Rollwagen mit Handtuch, Massageöl und der
     VERORDNUNG vom Arzt; Fenster, Uhr, Muskel-Lehrtafel an der Wand.
   Maßstab: Rückwand ≈ 46 Einheiten je Meter (Fuß bei y = 128), Liege
   ≈ 57 je Meter (y = 180), Mat­te vorn ≈ 60/m.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "physiotherapie", titel: "Die Physiotherapie", emoji: "🧘", thema: "Gesundheit", kuerzel: "b03e", fassung: 852 });
const rnd = zufall(6565);
const r = B.r;

/* ---------- eigene Haltungen --------------------------------------- */
B.mensch({}, 10);
const MP = globalThis.DMA_MENSCH.POSEN;
MP.b03e_knie = Object.assign({}, MP.liegen, {
  schulterL: { vor: -6, seit: 12 }, ellbogenL: 10, unterarmL: -75, handL: 0, fingerL: 0.35,
  schulterR: { vor: -8, seit: 14 }, ellbogenR: 14, unterarmR: -75, handR: 0, fingerR: 0.35,
  huefteL: { vor: 4, seit: 5, dreh: -10 }, knieL: 4, fussL: 18,
  huefteR: { vor: 72, seit: 4, dreh: -6 }, knieR: 92, fussR: 8 });
MP.b03e_halten = Object.assign({}, MP.stehen, { lende: 8, brust: 8, nacken: 10, kopf: 10,
  schulterL: { vor: 46, seit: 10 }, ellbogenL: 40, unterarmL: -30, handL: 0, fingerL: 0.55,
  schulterR: { vor: 40, seit: 12 }, ellbogenR: 56, unterarmR: -30, handR: 0, fingerR: 0.55 });

/* ---------- Grundfarben -------------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const WEISS = S.lg("weiss", [[0, "#ffffff"], [0.6, "#f2f4f4"], [1, "#d9dedf"]]);
const WEISS_H = S.lg("weissh", [[0, "#e3e7e8"], [0.35, "#ffffff"], [1, "#d3d9db"]], 0, 0, 1, 0);
const HOLZ = S.lg("holz", [[0, "#e2c08e"], [0.5, "#d1aa72"], [1, "#b98f58"]], 0, 0, 1, 0);
const HOLZ_H = S.lg("holzh", [[0, "#e7c995"], [1, "#c49a62"]]);
const STAHL = S.lg("stahl", [[0, "#eef1f3"], [0.45, "#c9cfd4"], [0.55, "#b5bcc2"], [1, "#e1e5e8"]], 0, 0, 1, 0);
const GLAS = S.lg("glas", [[0, "#ffffff", 0.3], [0.5, "#e8f4f7", 0.06], [1, "#ffffff", 0.16]], 0, 0, 1, 1);

/* =====================================================================
   KULISSE — Decke, weiße Wand mit grüner Akzentfläche, Parkett
   ===================================================================== */
const WAND_UNTEN = 128;
{
  let k = `<rect x="0" y="0" width="320" height="15" fill="${S.lg("decke", [[0, "#f4f3ef"], [1, "#e4e2dc"]])}"/>`;
  for (const x of [50, 160, 270]) k += `<ellipse cx="${x}" cy="7" rx="5" ry="1.4" fill="#fff8e6"/><ellipse cx="${x}" cy="7" rx="11" ry="3.2" fill="#fff3d0" opacity=".28"/>`;
  k += `<rect x="0" y="14.4" width="320" height="1.6" fill="#d6d2c6"/>`;
  k += `<rect x="0" y="16" width="320" height="${WAND_UNTEN - 16}" fill="${S.lg("wand", [[0, "#f7f6f1"], [1, "#e9e6dc"]])}"/>`;
  k += `<rect x="120" y="16" width="112" height="${WAND_UNTEN - 16}" fill="${S.lg("akzent", [[0, "#d6e8cf"], [1, "#c2dbb8"]])}"/>`;
  k += `<rect x="0" y="16" width="320" height="${WAND_UNTEN - 16}" fill="${S.rg("wandlicht", [[0, "#fffdf2", 0.6], [1, "#fffdf2", 0]], 0.8, 0.3, 0.6)}"/>`;
  /* Muskel-Lehrtafel an der Akzentwand */
  k += `<rect x="186" y="30" width="30" height="40" rx=".6" fill="#ffffff" stroke="#b9b29e" stroke-width=".4"/>`;
  k += `<text x="201" y="34.6" font-size="2.4" text-anchor="middle" fill="#3a3a3a" font-family="Arial" font-weight="bold">Die Muskeln</text>`;
  k += `<circle cx="201" cy="39.4" r="2.4" fill="#e8b49a"/><path d="M196 43 Q201 41.6 206 43 L205 54 L197 54 Z" fill="#c8574a"/><path d="M197 54 L199 67 M205 54 L203 67" stroke="#c8574a" stroke-width="2.2" stroke-linecap="round"/><path d="M196 44 L192.6 54 M206 44 L209.4 54" stroke="#c8574a" stroke-width="1.6" stroke-linecap="round"/>`;
  k += `<path d="M199 45 L203 45 M198.6 48 L203.4 48 M199 51 L203 51" stroke="#8a2f28" stroke-width=".25"/>`;
  k += `<rect x="0" y="${WAND_UNTEN - 3}" width="320" height="3" fill="#cfc8b6"/>`;
  /* Parkett in Fluchtperspektive */
  k += `<rect x="0" y="${WAND_UNTEN}" width="320" height="${200 - WAND_UNTEN}" fill="${S.lg("boden", [[0, "#d2ab76"], [1, "#b88e58"]])}"/>`;
  for (let i = -12; i <= 12; i++) k += `<line x1="${160 + i * 14}" y1="${WAND_UNTEN}" x2="${160 + i * 36}" y2="200" stroke="#9c7546" stroke-width=".3" opacity=".7"/>`;
  for (let i = -12; i < 12; i++) for (const [t, d] of [[0.15, 0], [0.38, 1], [0.62, 0], [0.88, 1]]) { if ((i + d + 20) % 2) continue; const y = WAND_UNTEN + t * 72, x = 160 + (i + 0.5) * (14 + 22 * t); k += `<line x1="${r(x - 7 - 11 * t)}" y1="${r(y)}" x2="${r(x + 7 + 11 * t)}" y2="${r(y)}" stroke="#9c7546" stroke-width=".3" opacity=".5"/>`; }
  k += `<rect x="0" y="${WAND_UNTEN}" width="320" height="${200 - WAND_UNTEN}" fill="${S.lg("bodenlicht", [[0, "#000", 0.12], [0.35, "#000", 0], [1, "#fff", 0.1]])}"/>`;
  S.hinten(k);
}

/* =====================================================================
   1 — DIE SPROSSENWAND (Holz, an der Wand) und 2 — DAS THERABAND
   ===================================================================== */
const SW = { x0: 6, x1: 44, y0: 20 };
{
  const W = SW.x1 - SW.x0, H = WAND_UNTEN - SW.y0;
  let k = schatten(0, 0, W / 2 + 2, 1, .2);
  for (const x of [-W / 2, W / 2 - 3]) k += `<rect x="${x}" y="${-H}" width="3" height="${H}" rx=".6" fill="${HOLZ}"/>`;
  for (let i = 0; i < 16; i++) {
    const y = -6 - i * 6.6;
    k += `<rect x="${-W / 2 + 2}" y="${r(y - 1)}" width="${W - 4}" height="2" rx="1" fill="${HOLZ_H}"/><rect x="${-W / 2 + 2}" y="${r(y - 0.9)}" width="${W - 4}" height=".5" fill="#fff" opacity=".35"/>`;
  }
  /* oberste Sprosse vorgewölbt (zum Hängen) */
  k += `<rect x="${-W / 2 - 1}" y="${-H}" width="${W + 2}" height="2.4" rx="1" fill="${HOLZ_H}"/>`;
  S.teil({ id: "ph_sprossenwand", de: "die Sprossenwand", syl: "SPROS-sen-wand", it: "la spalliera", itSyl: "spal-LIE-ra", en: "wall bars", x: (SW.x0 + SW.x1) / 2, y: WAND_UNTEN, steht: true, kunst: k,
    tipp: "An der Sprossenwand kann man sich dehnen und festhalten." });
}
{
  /* Therabänder in Stärkefarben, über eine Sprosse gehängt */
  let k = "";
  const f = [["#f2d24a", "#d9b52a"], ["#e2574c", "#b8473a"], ["#5cae5a", "#3e8a3e"], ["#3f7fd0", "#2a5fa8"]];
  f.forEach(([a, b], i) => {
    const x = -7.5 + i * 5, l = 22 + (i % 2) * 6;
    k += `<path d="M${x - 1.4} 0 Q${x - 2.2} ${l * 0.6} ${x - 1} ${l} L${x + 1.6} ${l - 0.6} Q${x + 0.8} ${l * 0.6} ${x + 1.4} 0 Z" fill="${S.lg("band" + i, [[0, a], [1, b]], 0, 0, 1, 0)}"/>`;
    k += `<path d="M${x - 1.4} 0 Q${x} -1.6 ${x + 1.4} 0" fill="${a}"/>`;
  });
  S.teil({ oben: true, id: "ph_theraband", de: "das Theraband", syl: "THE-ra-band", it: "l'elastico", itSyl: "e-LA-sti-co", en: "resistance band", x: (SW.x0 + SW.x1) / 2, y: WAND_UNTEN - 6 - 9 * 6.6 + 1, kunst: k + flaeche(-10, -1, 20, 30),
    tipp: "Die Farbe zeigt, wie stark das Band zieht: Gelb ist leicht, Blau ist schwer." });
}

/* =====================================================================
   3 — DER SPIEGEL (großer Wandspiegel neben der Sprossenwand)
   ===================================================================== */
{
  let k = `<rect x="-17" y="-94" width="34" height="92" rx="1" fill="#d9dcdc"/>`;
  k += `<rect x="-15.6" y="-92.6" width="31.2" height="89.2" fill="${S.lg("spiegel", [[0, "#dfe9ec"], [0.5, "#c7d6db"], [1, "#b3c4ca"]], 0, 0, 1, 1)}"/>`;
  /* Spiegelbild: die gegenüberliegende Wand, angedeutet */
  k += `<rect x="-15.6" y="-26" width="31.2" height="22.6" fill="#c9ab7e" opacity=".5"/><rect x="-15.6" y="-27" width="31.2" height="1" fill="#b5ad9a" opacity=".6"/>`;
  k += `<path d="M-14 -90 L-6 -90 L-14 -60 Z" fill="#fff" opacity=".45"/><path d="M2 -90 L6 -90 L-10 -20 L-14 -20 Z" fill="#fff" opacity=".2"/>`;
  S.teil({ id: "spiegel", de: "der Spiegel", syl: "SPIE-gel", it: "lo specchio", itSyl: "SPEC-chio", en: "mirror", x: 66, y: WAND_UNTEN, kunst: k,
    tipp: "Vor dem Spiegel sieht man, ob die Übung richtig ist." });
}

/* =====================================================================
   4 — DIE KURZHANTEL (Ständer mit Neopren-Kurzhanteln)
   ===================================================================== */
{
  let k = schatten(0, 0, 15, 1.2, .28);
  k += `<path d="M-13 0 L-11 -20 M13 0 L11 -20" stroke="#3a4045" stroke-width="1.4"/><path d="M-13 0 L13 0" stroke="#3a4045" stroke-width="1.4"/>`;
  const reihen = [[-18, ["#f2a65a", "#e2574c", "#9b59b6"]], [-9, ["#5cae5a", "#3f7fd0", "#2f353b"]]];
  for (const [y, farben] of reihen) {
    k += `<path d="M-12 ${y + 1.4} L12 ${y + 1.4}" stroke="#5a636b" stroke-width="1"/>`;
    farben.forEach((fb, i) => {
      const x = -8 + i * 8, d = 1.4 + i * 0.25 + (y > -12 ? 0.4 : 0);
      k += `<rect x="${x - 2.6}" y="${r(y - d * 0.6)}" width="5.2" height="1" rx=".4" fill="#8a949b"/>`;
      for (const s of [-1, 1]) k += `<rect x="${r(x + s * 2.6 - d / 2)}" y="${r(y - d)}" width="${r(d)}" height="${r(d * 1.4)}" rx="${r(d / 2.4)}" fill="${fb}"/>`;
    });
  }
  S.teil({ id: "ph_hantel_ph", de: "die Kurzhantel", syl: "KURZ-han-tel", it: "il manubrio", itSyl: "ma-NU-brio", en: "dumb-bell", x: 66, y: 146, kunst: k,
    tipp: "Mit Kurzhanteln trainiert man die Arme — erst leicht, dann schwerer." });
}

/* =====================================================================
   5 — DAS SKELETT (Lehrmodell auf Rollständer)
   ===================================================================== */
{
  const KN = "#f1ead6", KD = "#cdbf9c";
  let k = schatten(0, 0, 9, 1, .25);
  for (const [dx, dy] of [[-8, -.6], [8, -.6], [-4, 1], [4, 1]]) k += `<path d="M0 -2 L${dx} ${dy - 1}" stroke="#5a636b" stroke-width="1"/><circle cx="${dx}" cy="${dy - 0.4}" r=".9" fill="#2f353b"/>`;
  k += `<rect x="-.6" y="-80" width="1.2" height="78" fill="#7d868c"/><path d="M-.6 -80 Q0 -84 3 -83" stroke="#7d868c" stroke-width="1" fill="none"/>`;
  /* Schädel */
  k += `<ellipse cx="0" cy="-77" rx="4" ry="4.6" fill="${KN}" stroke="${KD}" stroke-width=".3"/><path d="M-2.6 -73.6 L2.6 -73.6 L2 -70.6 L-2 -70.6 Z" fill="${KN}" stroke="${KD}" stroke-width=".3"/>`;
  k += `<ellipse cx="-1.5" cy="-77" rx="1.1" ry="1.2" fill="#4a3f30"/><ellipse cx="1.5" cy="-77" rx="1.1" ry="1.2" fill="#4a3f30"/><path d="M0 -75.6 L-.5 -74.4 L.5 -74.4 Z" fill="#4a3f30"/>`;
  for (let i = 0; i < 5; i++) k += `<line x1="${-1.8 + i * 0.9}" y1="-73.4" x2="${-1.8 + i * 0.9}" y2="-72.2" stroke="${KD}" stroke-width=".2"/>`;
  /* Wirbelsäule, Brustkorb mit Rippen, Schlüsselbeine */
  for (let i = 0; i < 18; i++) k += `<rect x="-.8" y="${r(-69.6 + i * 1.95)}" width="1.6" height="1.5" rx=".4" fill="${KN}" stroke="${KD}" stroke-width=".15"/>`;
  k += `<path d="M-6.4 -66.4 L-1 -67.4 M6.4 -66.4 L1 -67.4" stroke="${KN}" stroke-width="1"/>`;
  for (let i = 0; i < 7; i++) { const y = -64.6 + i * 2.3, w = 5.4 - Math.abs(i - 2.4) * 0.32; k += `<path d="M-.8 ${y} Q${-w - 1} ${y + 0.4} ${-w + 0.6} ${y + 2.6} M.8 ${y} Q${w + 1} ${y + 0.4} ${w - 0.6} ${y + 2.6}" stroke="${KN}" stroke-width=".7" fill="none"/>`; }
  k += `<path d="M0 -66 L0 -56" stroke="${KN}" stroke-width="1.2"/>`;
  /* Becken */
  k += `<path d="M-6 -36 Q-7 -41 -2 -40 L0 -36 L2 -40 Q7 -41 6 -36 Q5 -31.6 2 -31.6 L-2 -31.6 Q-5 -31.6 -6 -36 Z" fill="${KN}" stroke="${KD}" stroke-width=".3"/><circle cx="-2.6" cy="-34.6" r="1" fill="#4a3f30" opacity=".5"/><circle cx="2.6" cy="-34.6" r="1" fill="#4a3f30" opacity=".5"/>`;
  /* Arme (Ober-, Unterarm, Hand) und Beine */
  for (const s of [-1, 1]) {
    k += `<circle cx="${s * 6.8}" cy="-66" r="1.2" fill="${KN}"/>`;
    k += `<path d="M${s * 7} -65 L${s * 8} -51" stroke="${KN}" stroke-width="1.1" stroke-linecap="round"/><path d="M${s * 8} -51 L${s * 8.6} -38 M${s * 7.4} -51 L${s * 8} -38.4" stroke="${KN}" stroke-width=".6" stroke-linecap="round"/>`;
    k += `<path d="M${s * 8.4} -37.6 l${s * 0.8} 4 M${s * 8.4} -37.6 l0 4.4 M${s * 8.4} -37.6 l${s * -0.8} 4" stroke="${KN}" stroke-width=".45" stroke-linecap="round"/>`;
    k += `<path d="M${s * 3.6} -33 L${s * 4.2} -17.4" stroke="${KN}" stroke-width="1.4" stroke-linecap="round"/><ellipse cx="${s * 4.2}" cy="-16.8" rx="1.3" ry="1" fill="${KN}"/>`;
    k += `<path d="M${s * 4.2} -16 L${s * 4.4} -3.4 M${s * 3.4} -16 L${s * 3.6} -3.6" stroke="${KN}" stroke-width=".7" stroke-linecap="round"/>`;
    k += `<path d="M${s * 4.4} -3.4 L${s * 6.4} -2.6 L${s * 6.4} -2 L${s * 3.4} -2.4 Z" fill="${KN}"/>`;
  }
  S.teil({ id: "skelett", de: "das Skelett", syl: "ske-LETT", it: "lo scheletro", itSyl: "SCHE-le-tro", en: "skeleton", x: 104, y: 136, kunst: k,
    tipp: "Am Skelett zeigt die Therapeutin, welcher Knochen wehtut." });
}

/* =====================================================================
   6 — DAS FENSTER (rechts) und 7 — DIE UHR
   ===================================================================== */
{
  let k = `<rect x="-36" y="-36" width="72" height="72" rx="1" fill="#eceeec"/>`;
  k += `<rect x="-33" y="-33" width="66" height="66" fill="${S.lg("himmel", [[0, "#a4d0ef"], [0.6, "#d6ecf6"], [1, "#eef6ec"]])}"/>`;
  k += `<path d="M-33 14 Q-20 -2 -6 10 Q6 -6 20 6 Q28 0 33 6 L33 33 L-33 33 Z" fill="#82b36c"/><path d="M-33 33 L-33 22 Q0 14 33 24 L33 33 Z" fill="#5f9150"/>`;
  k += `<rect x="-33" y="-33" width="66" height="66" fill="${GLAS}"/>`;
  k += `<rect x="-33" y="-33" width="66" height="66" fill="none" stroke="#f8f8f7" stroke-width="2.2"/><rect x="-1" y="-33" width="2" height="66" fill="#f8f8f7"/><rect x="3" y="-1" width="1.1" height="5" rx=".4" fill="#b8bfc2"/>`;
  k += `<path d="M-31 -31 L-20 -31 L-31 -12 Z" fill="#fff" opacity=".35"/>`;
  k += `<rect x="-38" y="34" width="76" height="2.6" rx=".5" fill="#f2f1ed"/><rect x="-38" y="36.4" width="76" height=".8" fill="#c4c0b4"/>`;
  /* Pflanze auf der Fensterbank */
  k += `<path d="M22 34 L23 27 L31 27 L32 34 Z" fill="#c96f4a"/>`;
  for (const [a, l] of [[-50, 9], [-20, 12], [10, 11], [40, 8]]) k += `<path d="M27 27 q${r(Math.sin(a * Math.PI / 180) * l * 0.4)} ${-l * 0.7} ${r(Math.sin(a * Math.PI / 180) * l)} ${-l}" stroke="#4f8a46" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  S.teil({ id: "fenster", de: "das Fenster", syl: "FENS-ter", it: "la finestra", itSyl: "fi-NE-stra", en: "window", x: 276, y: 60, kunst: k });
}
{
  let k = `<circle r="6.4" fill="#f3f1ea" stroke="#5b4630" stroke-width=".9"/><circle r="5.4" fill="#ffffff"/>`;
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; k += `<line x1="${r(Math.sin(a) * 4.8)}" y1="${r(-Math.cos(a) * 4.8)}" x2="${r(Math.sin(a) * (i % 3 ? 4.2 : 3.6))}" y2="${r(-Math.cos(a) * (i % 3 ? 4.2 : 3.6))}" stroke="#2b2b2b" stroke-width="${i % 3 ? 0.25 : 0.5}"/>`; }
  k += `<line x1="0" y1="0" x2="${r(Math.sin(4.5 * Math.PI / 6) * 2.8)}" y2="${r(-Math.cos(4.5 * Math.PI / 6) * 2.8)}" stroke="#1f1f1f" stroke-width=".7" stroke-linecap="round"/><line x1="0" y1="0" x2="0" y2="4.2" stroke="#1f1f1f" stroke-width=".45" stroke-linecap="round"/><circle r=".5" fill="#c0392b"/>`;
  S.teil({ id: "uhr", de: "die Uhr", syl: "UHR", it: "l'orologio", itSyl: "o-ro-LO-gio", en: "clock", x: 156, y: 30, kunst: k,
    tipp: "Eine Behandlung dauert meist 20 bis 25 Minuten." });
}

/* =====================================================================
   8 — DIE WÄRMELAMPE (Rotlicht auf Rollstativ, über der Schulter)
   ===================================================================== */
{
  let k = schatten(0, 0, 9, 1, .28);
  for (const [dx, dy] of [[-8, -.6], [8, -.6], [-4, 1], [4, 1]]) k += `<path d="M0 -2 L${dx} ${dy - 1}" stroke="#3a4045" stroke-width="1.1"/><circle cx="${dx}" cy="${dy - 0.4}" r="1" fill="#22272b"/>`;
  k += `<rect x="-.8" y="-70" width="1.6" height="68" fill="#9aa3aa"/><rect x="-1.4" y="-38" width="2.8" height="3" rx=".6" fill="#3a4045"/>`;
  k += `<path d="M0 -70 L8 -74" stroke="#9aa3aa" stroke-width="1.4"/><circle cx="8" cy="-74" r="1.4" fill="#3a4045"/>`;
  /* Reflektorschirm, schräg nach unten zur Liege */
  k += `<g transform="rotate(38 8 -74)"><path d="M0 -76 Q8 -86 16 -76 L14 -72 L2 -72 Z" fill="${S.lg("schirm", [[0, "#c9cfd2"], [1, "#7d868c"]], 0, 0, 1, 0)}"/>`;
  k += `<ellipse cx="8" cy="-72.4" rx="6.2" ry="1.6" fill="${S.rg("rot", [[0, "#ffd0a0"], [0.5, "#ff6a3a"], [1, "#b8271a"]])}"/></g>`;
  k += `<path d="M14 -70 L44 -46 L30 -36 L10 -64 Z" fill="${S.lg("rotlicht", [[0, "#ff6a3a", 0.25], [1, "#ff6a3a", 0]])}" pointer-events="none"/>`;
  S.teil({ id: "ph_waermelampe", de: "die Wärmelampe", syl: "WÄR-me-lam-pe", it: "la lampada a infrarossi", itSyl: "LAM-pa-da a in-fra-ROS-si", en: "heat lamp", x: 132, y: 176, kunst: k,
    tipp: "Das Rotlicht wärmt die Muskeln — so werden sie locker." });
}

/* =====================================================================
   9 — DIE PHYSIOTHERAPEUTIN (hinter der Liege, bewegt das Knie)
   ===================================================================== */
const LG = { x0: 152, x1: 262, top: 141, fuss: 180 };
const pat = B.mensch({ id: "b03e_pat", geschlecht: "m", pose: "b03e_knie", blick: 90, frisur: "kurz", haarfarbe: "schwarz", haut: "mittel",
  kleidung: { oberteil: { stueck: "tshirt", farbe: "#86898e" }, unterteil: { stueck: "hose", farbe: "#2f3035" }, schuhe: { stueck: "turnschuh" } } }, 102);
/* Patient so legen, dass Rücken und Gesäß auf dem Polster liegen */
const PAT = { x: 0, y: 0 };
{
  const P = pat.z.punkte, k = pat.k;
  const tief = Math.max(P.gesaess[1], P.schulterblatt[1], P.hinterkopf[1]) * k;
  PAT.x = LG.x0 + 12 - P.hinterkopf[0] * k;
  PAT.y = LG.top - 2.2 - tief;
}
const PP = (n) => [PAT.x + pat.z.punkte[n][0] * pat.k, PAT.y + pat.z.punkte[n][1] * pat.k];
{
  const m = B.mensch({ id: "b03e_ther", geschlecht: "w", pose: "b03e_halten", blick: -24, frisur: "zopf", haarfarbe: "rot", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "tshirt", farbe: "#3e8a6e" }, unterteil: { stueck: "hose", farbe: "weiss" }, schuhe: { stueck: "turnschuh" } } }, 88);
  /* die vordere Hand an die Kniekehle, die Figur steht hinter der Liege */
  const knie = PP("kniekehleR");
  const h = m.z.handL.x < m.z.handR.x ? m.z.handL : m.z.handR;
  const x = knie[0] - h.x * m.k, y = knie[1] - h.y * m.k;
  S.teil({ id: "ph_therapeutin", de: "die Physiotherapeutin", syl: "Phy-sio-the-ra-PEU-tin", it: "la fisioterapista", itSyl: "fi-sio-te-ra-PI-sta", en: "physiotherapist", x, y, kunst: m.svg,
    tipp: "Die Physiotherapeutin sagt: „Sagen Sie Bescheid, wenn es wehtut.“" });
  if (process.env.B03E_DEBUG) console.log("Therapeutin Fuß", r(x), r(y));
}

/* =====================================================================
   10 — DIE BEHANDLUNGSLIEGE (höhenverstellbar, Kopfteil, Kissen)
   ===================================================================== */
{
  const cx = (LG.x0 + LG.x1) / 2, W = LG.x1 - LG.x0, H = LG.fuss - LG.top;
  let k = schatten(0, 0, W / 2 + 4, 2, .3);
  /* Fahrgestell mit Rollen, Hub-Gestell, Rundum-Fußschalter */
  k += `<rect x="${-W / 2 + 8}" y="-6" width="${W - 16}" height="3" rx="1" fill="#5a636b"/>`;
  for (const x of [-W / 2 + 10, W / 2 - 10]) k += `<circle cx="${x}" cy="-2" r="2.2" fill="#22272b"/><circle cx="${x}" cy="-2" r=".8" fill="#9aa3aa"/>`;
  k += `<path d="M-30 -6 L22 ${-H + 8} M-30 ${-H + 8} L22 -6" stroke="#7d868c" stroke-width="2.2"/><circle cx="-4" cy="${-H / 2 - 1}" r="1.6" fill="#5a636b"/>`;
  k += `<path d="M${-W / 2 + 12} -8 L${W / 2 - 12} -8" stroke="#c9cfd4" stroke-width=".8"/>`;
  k += `<rect x="${-W / 2 + 4}" y="${-H + 5}" width="${W - 8}" height="3" rx="1" fill="#9aa3aa"/>`;
  /* Polster (dunkelblau-grau), Kopfteil mit Nasenschlitz-Andeutung */
  k += `<path d="M${-W / 2} ${-H + 5} L${-W / 2} ${-H + 1} Q${-W / 2} ${-H - 2} ${-W / 2 + 3} ${-H - 2} L${W / 2 - 3} ${-H - 2} Q${W / 2} ${-H - 2} ${W / 2} ${-H + 1} L${W / 2} ${-H + 5} Z" fill="${S.lg("polster", [[0, "#5b6f86"], [1, "#3c4d62"]])}"/>`;
  k += `<path d="M${-W / 2 + 26} ${-H - 2} L${-W / 2 + 26} ${-H + 5}" stroke="#2c3a4c" stroke-width=".6"/>`;
  k += `<path d="M${-W / 2 + 3} ${-H - 1.4} L${W / 2 - 3} ${-H - 1.4}" stroke="#8ea3bb" stroke-width=".6" opacity=".8"/>`;
  /* Laken/Papier-Auflage und gefaltetes Handtuch am Fußende */
  k += `<path d="M${-W / 2 + 26} ${-H - 2.2} L${W / 2 - 2} ${-H - 2.2} L${W / 2 - 2} ${-H + 1} L${-W / 2 + 26} ${-H + 1} Z" fill="#f4f2ea" opacity=".9"/>`;
  S.teil({ id: "ph_liege_ph", de: "die Behandlungsliege", syl: "Be-HAND-lungs-lie-ge", it: "il lettino da massaggio", itSyl: "let-TI-no da mas-SAG-gio", en: "treatment couch", x: cx, y: LG.fuss, steht: true, kunst: k,
    tipp: "Die Liege fährt elektrisch hoch — so arbeitet die Therapeutin rückenschonend." });
}
{
  /* DAS KISSEN unter dem Kopf */
  const hk = PP("hinterkopf");
  let k = `<path d="M-13 0 Q-14 -4.8 -9.6 -4.8 L7 -4.8 Q10.4 -4.8 9.4 0 Z" fill="${S.lg("kissen", [[0, "#ffffff"], [1, "#d8dde0"]])}" stroke="#c9d0d3" stroke-width=".3"/>`;
  k += `<path d="M-6 -3.6 Q0 -2.6 6 -3.6" stroke="#e7ebee" stroke-width=".5" fill="none"/>`;
  S.teil({ id: "kissen", de: "das Kissen", syl: "KIS-sen", it: "il cuscino", itSyl: "cu-SCI-no", en: "pillow", x: r(hk[0] + 1), y: LG.top - 1.6, kunst: k });
}

/* =====================================================================
   11 — DER PATIENT (Sportkleidung, liegt, das rechte Knie gebeugt)
   ===================================================================== */
S.teil({ id: "ph_patient", de: "der Patient", syl: "Pa-ti-ENT", it: "il paziente", itSyl: "pa-ZIEN-te", en: "patient", x: r(PAT.x), y: r(PAT.y), kunst: pat.svg,
  tipp: "Der Patient hat Knieschmerzen und bekommt Krankengymnastik." });

/* =====================================================================
   12 — DER ROLLWAGEN (Lupe: Verordnung, Massageöl, Handtuch)
   ===================================================================== */
const RW = { x: 290, y: 186, b: 26, h: 44 };
const wagenUnter = [];
{
  const W = RW.b, H = RW.h;
  let k = schatten(0, 0, W / 2 + 2, 1.2, .28);
  for (const x of [-W / 2 + 2, W / 2 - 2]) k += `<circle cx="${x}" cy="-1.6" r="1.6" fill="#2f353b"/><rect x="${x - 0.7}" y="${-H}" width="1.4" height="${H - 3}" fill="${STAHL}"/>`;
  for (const y of [-H, -H / 2 - 2, -6]) k += `<rect x="${-W / 2 - 0.6}" y="${y}" width="${W + 1.2}" height="2" rx=".6" fill="${WEISS}" stroke="#b9c1c5" stroke-width=".3"/>`;
  /* unten: Stapel Handtücher, Mitte: Kirschkernkissen */
  for (let i = 0; i < 3; i++) k += `<rect x="-9" y="${-9 - i * 2.4}" width="18" height="2.4" rx="1" fill="${["#f4f2ea", "#cfe2d6", "#f4f2ea"][i]}" stroke="#c9c3b4" stroke-width=".2"/>`;
  k += `<path d="M-8 ${-H / 2 - 2} Q-9 ${-H / 2 - 6} -4 ${-H / 2 - 6} L6 ${-H / 2 - 6} Q9 ${-H / 2 - 6} 8 ${-H / 2 - 2} Z" fill="#c96f4a"/><path d="M-6 ${-H / 2 - 4} L6 ${-H / 2 - 4}" stroke="#a8573a" stroke-width=".3" stroke-dasharray=".8 .6"/>`;
  const P = -H;
  const unter = (id, de, syl, it, itSyl, en, x, kunst, fl, tipp) => { k += `<g transform="translate(${x} ${P})">${kunst}</g>`; wagenUnter.push({ id, de, syl, it, itSyl, en, x: RW.x + x, y: RW.y + P, kunst: fl, tipp }); };
  /* DIE VERORDNUNG — Heilmittelverordnung vom Arzt (Muster 13) */
  unter("ph_rezept", "die Verordnung", "Ver-ORD-nung", "la prescrizione", "pre-scri-ZIO-ne", "prescription", -5,
    `<path d="M-6 0 L5 0 L4.2 -2.6 L-5.4 -2.6 Z" fill="#ffffff" stroke="#c9a3ab" stroke-width=".25"/><rect x="-5" y="-2.4" width="9" height=".7" fill="#e9b2bd"/><path d="M-4.4 -1.2 L3 -1.2 M-4.6 -.5 L3.6 -.5" stroke="#b07a86" stroke-width=".16"/>`,
    flaeche(-6.4, -4, 11.8, 4.4), "Auf der Verordnung steht, wie oft man zur Physiotherapie kommt — z. B. 6 × Krankengymnastik.");
  /* DAS MASSAGEÖL — Pumpflasche */
  unter("massageoel", "das Massageöl", "mas-SA-ge-öl", "l'olio da massaggio", "O-lio da mas-SAG-gio", "massage oil", 5,
    `<path d="M-1.8 0 L-1.8 -6.4 Q-1.8 -7.4 -.8 -7.4 L.8 -7.4 Q1.8 -7.4 1.8 -6.4 L1.8 0 Z" fill="${S.lg("oel", [[0, "#f2c66a"], [0.5, "#fbe3a6"], [1, "#d9a440"]], 0, 0, 1, 0)}" opacity=".95"/><rect x="-.5" y="-9.4" width="1" height="2" fill="#2f353b"/><path d="M-.5 -9.4 L2.4 -9.4" stroke="#2f353b" stroke-width=".7"/><rect x="-1.8" y="-4.4" width="3.6" height="2" fill="#fff" opacity=".85"/>`,
    flaeche(-2.4, -10, 5.4, 10.4), "Mit Massageöl gleiten die Hände bei der Massage besser.");
  /* DAS HANDTUCH — gerollt */
  unter("handtuch", "das Handtuch", "HAND-tuch", "l'asciugamano", "a-sciu-ga-MA-no", "towel", 10.4,
    `<rect x="-2.4" y="-3.2" width="4.8" height="3.2" rx="1.5" fill="#cfe2d6" stroke="#a9c4b2" stroke-width=".2"/><ellipse cx="2.4" cy="-1.6" rx=".8" ry="1.6" fill="#bcd6c5"/><path d="M2.4 -2.4 q-.6 .8 0 1.6" stroke="#9fbfab" stroke-width=".2" fill="none"/>`,
    flaeche(-2.8, -3.8, 6, 4.2));
  S.teil({ id: "rollwagen", de: "der Rollwagen", syl: "ROLL-wa-gen", it: "il carrello", itSyl: "car-REL-lo", en: "trolley", x: RW.x, y: RW.y, steht: true, kunst: k,
    zoom: { x: RW.x - 20, y: RW.y - RW.h - 16, w: 40, h: 26 },
    unter: wagenUnter });
}

/* =====================================================================
   13 — DIE MATTE (vorn links) mit Bällen, Igelball und Faszienrolle
   ===================================================================== */
{
  let k = `<path d="M-60 0 L58 0 L48 -20 L-52 -20 Z" fill="${S.lg("matte", [[0, "#4a86c6"], [1, "#3a6fa8"]])}"/>`;
  k += `<path d="M-60 0 L58 0 L57.4 1.6 L-60 1.6 Z" fill="#2c5684"/>`;
  for (let i = 1; i < 6; i++) k += `<line x1="${r(-60 + i * 19.6)}" y1="0" x2="${r(-52 + i * 16.6)}" y2="-20" stroke="#5b97d6" stroke-width=".3" opacity=".6"/>`;
  k += `<path d="M-50 -18.6 L46 -18.6" stroke="#7fb0e2" stroke-width=".4" opacity=".6"/>`;
  S.teil({ id: "ph_matte", de: "die Matte", syl: "MAT-te", it: "il materassino", itSyl: "ma-te-ras-SI-no", en: "mat", x: 66, y: 196, kunst: k,
    tipp: "Auf der Matte macht man Übungen im Liegen." });
}
{
  /* DER GYMNASTIKBALL — großer grüner Pezziball, daneben ein kleiner roter */
  let k = schatten(2, 0, 16, 2, .3);
  k += `<circle cx="0" cy="-17" r="17" fill="${S.rg("ball1", [[0, "#9fdc8a"], [0.6, "#4fa85a"], [1, "#2f7a3c"]], 0.35, 0.3, 0.8)}"/>`;
  k += `<path d="M-14 -24 Q-6 -33 6 -32" stroke="#d6f5c8" stroke-width="1.2" fill="none" opacity=".7"/><ellipse cx="-6" cy="-26" rx="4" ry="2.4" fill="#fff" opacity=".25"/>`;
  k += `<path d="M-17 -17 Q0 -10 17 -17" stroke="#3e8a48" stroke-width=".4" fill="none" opacity=".6"/>`;
  k += schatten(26, 0, 6, 1, .28) + `<circle cx="26" cy="-6.4" r="6.4" fill="${S.rg("ball2", [[0, "#ff9c8a"], [0.6, "#e2574c"], [1, "#a8352c"]], 0.35, 0.3, 0.8)}"/><ellipse cx="24" cy="-9" rx="2" ry="1.2" fill="#fff" opacity=".3"/>`;
  S.teil({ id: "ph_gymnastikball", de: "der Gymnastikball", syl: "Gym-NAS-tik-ball", it: "la palla da ginnastica", itSyl: "PAL-la da gin-NA-sti-ca", en: "exercise ball", x: 30, y: 190, kunst: k,
    tipp: "Auf dem großen Ball trainiert man Gleichgewicht und Rücken." });
}
{
  /* DER IGELBALL — kleiner Noppenball zur Massage */
  let k = schatten(0, 0, 3.6, .7, .3) + `<circle cx="0" cy="-3.4" r="3.4" fill="${S.rg("igel", [[0, "#ffe07a"], [1, "#e0a91e"]], 0.35, 0.3, 0.8)}"/>`;
  for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8; k += `<circle cx="${r(Math.cos(a) * 3.3)}" cy="${r(-3.4 + Math.sin(a) * 3.3)}" r=".55" fill="#f2c94c"/>`; }
  for (const [x, y] of [[-1, -4.4], [1.2, -3], [0, -1.6], [-1.6, -2.4], [1.4, -5]]) k += `<circle cx="${x}" cy="${y}" r=".45" fill="#e8b42a"/>`;
  S.teil({ oben: true, id: "igelball", de: "der Igelball", syl: "I-gel-ball", it: "la pallina massaggiante", itSyl: "pal-LI-na mas-sag-GIAN-te", en: "massage ball", x: 76, y: 189, kunst: k + flaeche(-4.4, -7.6, 8.8, 8.2),
    tipp: "Den Igelball rollt man über Hand oder Fuß — das regt die Durchblutung an." });
}
{
  /* DIE FASZIENROLLE — liegt quer auf der Matte */
  let k = schatten(0, 0, 10, 1, .3);
  k += `<rect x="-10" y="-6.6" width="20" height="6.6" rx="3.2" fill="${S.lg("rolle", [[0, "#3a3f44"], [0.4, "#6a737a"], [1, "#22272b"]])}"/>`;
  for (let i = 0; i < 6; i++) k += `<rect x="${-8 + i * 3}" y="-6.4" width="1.6" height="6.2" rx=".6" fill="#f2a65a" opacity=".8"/>`;
  k += `<ellipse cx="10" cy="-3.3" rx="1.6" ry="3.3" fill="#4a5258"/><ellipse cx="10" cy="-3.3" rx=".8" ry="1.6" fill="#2a2f33"/>`;
  S.teil({ oben: true, id: "faszienrolle", de: "die Faszienrolle", syl: "FAS-zi-en-rol-le", it: "il rullo per fasce", itSyl: "RUL-lo per FA-sce", en: "foam roller", x: 100, y: 190, kunst: k,
    tipp: "Auf der Faszienrolle rollt man die Muskeln locker." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/physiotherapie.js"));
console.log(aus);
