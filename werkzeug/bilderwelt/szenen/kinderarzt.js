#!/usr/bin/env node
/* =====================================================================
   BEIM KINDERARZT (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (Praxisausstattung Kinderarztpraxis, z. B. medizinio
   „Praxiseinrichtung Kinderarzt“; Ratgeber Wärmestrahler am Wickeltisch;
   Vorsorgeheft „gelbes Heft“ der U-Untersuchungen U1–U9):
   - Der UNTERSUCHUNGSRAUM einer deutschen Kinderarztpraxis: freundliche
     Pastellwände mit Tier- und Wolkenbildern, eine Messlatte als Giraffe.
   - Die WICKELKOMMODE mit weicher Wickelauflage und der SÄUGLINGSWAAGE
     (Wiegeschale, Digitalanzeige); darüber an der Wand der Infrarot-
     WÄRMESTRAHLER, damit Babys beim Ausziehen nicht frieren.
   - Die UNTERSUCHUNGSLIEGE mit Einmal-Papier von der PAPIERROLLE am
     Kopfende; an der Wand das Diagnostik-Set (Otoskop für die Ohren).
   - Der Schreibtisch mit Computer; dort liegen das gelbe U-HEFT
     (Vorsorge-Untersuchungen), der IMPFPASS, die Spritze in der
     Nierenschale, bunte Kinderpflaster und das Fieberthermometer.
   - Eine SPIELECKE mit Teppich, Motorikschleife und Spielzeugkiste
     (Teddy, Ball, Bauklötze, Auto); ein Stuhl für die Begleitperson.
   - Die Kinderärztin hört das Kind mit dem Stethoskop ab, die Mutter
     steht daneben.
   Maßstab: Rückwand ≈ 46 Einheiten je Meter (Fuß bei y = 130), Liege
   ≈ 55 je Meter (y = 170), Ärztin vorn 1,68 m ≈ 57/m.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "kinderarzt", titel: "Beim Kinderarzt", emoji: "🧸", thema: "Gesundheit", kuerzel: "b03c", fassung: 852 });
const rnd = zufall(2207);
const r = B.r;

/* ---------- eigene Haltungen --------------------------------------- */
B.mensch({}, 10);
const MP = globalThis.DMA_MENSCH.POSEN;
MP.b03c_abhoeren = Object.assign({}, MP.stehen, { nacken: 12, kopf: 10, lende: 4, brust: 6,
  schulterL: { vor: 52, seit: 10 }, ellbogenL: 40, unterarmL: -20, handL: 0, fingerL: 0.4,
  schulterR: { vor: 10, seit: 9 }, ellbogenR: 30, unterarmR: 20, handR: 4, fingerR: 0.4 });
MP.b03c_kantesitz = Object.assign({}, MP.sitzen, { lende: -2, brust: 0, nacken: 2, kopf: -4,
  schulterL: { vor: 6, seit: 14 }, ellbogenL: 30, unterarmL: -60, handL: -20, fingerL: 0.3,
  schulterR: { vor: 4, seit: 16 }, ellbogenR: 26, unterarmR: -60, handR: -20, fingerR: 0.3,
  huefteL: { vor: 84, seit: 8, dreh: -4 }, knieL: 70, fussL: 6,
  huefteR: { vor: 86, seit: 9, dreh: -6 }, knieR: 82, fussR: 6 });

/* ---------- Grundfarben -------------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const WEISS = S.lg("weiss", [[0, "#ffffff"], [0.6, "#f2f4f4"], [1, "#d9dedf"]]);
const WEISS_H = S.lg("weissh", [[0, "#e3e7e8"], [0.35, "#ffffff"], [1, "#d3d9db"]], 0, 0, 1, 0);
const HOLZ = S.lg("holz", [[0, "#e6cfa8"], [0.5, "#d8bb8c"], [1, "#c4a272"]], 0, 0, 1, 0);
const STAHL = S.lg("stahl", [[0, "#eef1f3"], [0.45, "#c9cfd4"], [0.55, "#b5bcc2"], [1, "#e1e5e8"]], 0, 0, 1, 0);
const anker = (kunst, ax, ay) => `<g transform="translate(${r(-ax)} ${r(-ay)})">${kunst}</g>`;

/* =====================================================================
   KULISSE — Decke, Pastellwand mit Wolken, Holzoptik-Boden
   ===================================================================== */
const WAND_UNTEN = 130;
{
  let k = `<rect x="0" y="0" width="320" height="15" fill="${S.lg("decke", [[0, "#f6f4ee"], [1, "#e8e4da"]])}"/>`;
  for (const x of [60, 160, 260]) k += `<ellipse cx="${x}" cy="7.5" rx="12" ry="2.6" fill="#fffbe9"/><ellipse cx="${x}" cy="7.5" rx="20" ry="5" fill="#fff6d6" opacity=".3"/>`;
  k += `<rect x="0" y="14.4" width="320" height="1.6" fill="#d9d3c4"/>`;
  /* Wand: oben zartes Gelb, unten Mint mit Bordüre */
  k += `<rect x="0" y="16" width="320" height="${WAND_UNTEN - 16}" fill="${S.lg("wand", [[0, "#fbf3dc"], [1, "#f4e8c6"]])}"/>`;
  k += `<rect x="0" y="88" width="320" height="${WAND_UNTEN - 88}" fill="${S.lg("wandunten", [[0, "#cfe9df"], [1, "#b8ddd0"]])}"/>`;
  let bord = `<rect x="0" y="86" width="320" height="2.4" fill="#f2a65a"/>`;
  for (let x = 2; x < 320; x += 8) bord += `<circle cx="${x}" cy="90.4" r="1" fill="${["#e2574c", "#f2c94c", "#4f9fd6", "#6bbf73"][(x / 8 | 0) % 4]}"/>`;
  k += bord;
  k += `<rect x="0" y="16" width="320" height="${WAND_UNTEN - 16}" fill="${S.rg("wandlicht", [[0, "#ffffff", 0.45], [1, "#ffffff", 0]], 0.5, 0.2, 0.7)}"/>`;
  /* Wandtattoos: Sonne, Wolken, Regenbogen, Vögel (Kulisse) */
  k += `<g opacity=".9"><circle cx="292" cy="34" r="7" fill="#f7cf5a"/>`;
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; k += `<line x1="${r(292 + Math.cos(a) * 9)}" y1="${r(34 + Math.sin(a) * 9)}" x2="${r(292 + Math.cos(a) * 12)}" y2="${r(34 + Math.sin(a) * 12)}" stroke="#f7cf5a" stroke-width="1.2" stroke-linecap="round"/>`; }
  k += `</g>`;
  const wolke = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" opacity=".95"><ellipse cx="0" cy="0" rx="9" ry="4" fill="#ffffff"/><circle cx="-4" cy="-2.6" r="4" fill="#ffffff"/><circle cx="2.6" cy="-4" r="5" fill="#ffffff"/></g>`;
  k += wolke(118, 30, 1) + wolke(196, 22, 0.8) + wolke(256, 52, 0.7);
  for (const [i, f] of ["#e2574c", "#f2a65a", "#f2c94c", "#6bbf73", "#4f9fd6"].entries()) k += `<path d="M${84 + i * 2} 78 A${26 - i * 2} ${22 - i * 2} 0 0 1 ${136 - i * 2} 78" stroke="${f}" stroke-width="2" fill="none" opacity=".55"/>`;
  for (const [x, y] of [[160, 40], [168, 36], [230, 30]]) k += `<path d="M${x - 3} ${y} q1.5 -1.6 3 0 q1.5 -1.6 3 0" stroke="#4a6b84" stroke-width=".5" fill="none"/>`;
  k += `<rect x="0" y="${WAND_UNTEN - 3}" width="320" height="3" fill="#f2f0ea"/>`;
  /* Boden in Holzoptik (Vinyl), Dielen in Fluchtperspektive */
  k += `<rect x="0" y="${WAND_UNTEN}" width="320" height="${200 - WAND_UNTEN}" fill="${S.lg("boden", [[0, "#d7bf98"], [1, "#c2a47a"]])}"/>`;
  for (let i = -10; i <= 10; i++) k += `<line x1="${160 + i * 18}" y1="${WAND_UNTEN}" x2="${160 + i * 46}" y2="200" stroke="#a88a62" stroke-width=".35" opacity=".7"/>`;
  for (let i = -10; i < 10; i++) for (const [t, d] of [[0.2, 0], [0.45, 1], [0.75, 0]]) { if ((i + d) % 2) continue; const y = WAND_UNTEN + t * 70, x = 160 + (i + 0.5) * (18 + 28 * t); k += `<line x1="${r(x - 9 - 14 * t)}" y1="${r(y)}" x2="${r(x + 9 + 14 * t)}" y2="${r(y)}" stroke="#a88a62" stroke-width=".3" opacity=".5"/>`; }
  k += `<rect x="0" y="${WAND_UNTEN}" width="320" height="${200 - WAND_UNTEN}" fill="${S.lg("bodenlicht", [[0, "#000", 0.12], [0.35, "#000", 0], [1, "#fff", 0.08]])}"/>`;
  S.hinten(k);
}

/* =====================================================================
   1 — DER WÄRMESTRAHLER (an der Wand über dem Wickeltisch)
   ===================================================================== */
{
  let k = `<rect x="-2" y="-6" width="4" height="8" rx=".6" fill="#e9ecec"/><path d="M0 0 L0 6" stroke="#c9cfd4" stroke-width="1.6"/>`;
  k += `<g transform="rotate(14 0 8)"><rect x="-14" y="6" width="28" height="7" rx="2.4" fill="${WEISS}" stroke="#c3cacc" stroke-width=".3"/>`;
  k += `<rect x="-12" y="11" width="24" height="2.4" rx="1" fill="${S.lg("glut", [[0, "#ffb15c"], [1, "#e0542f"]])}"/>`;
  for (let i = 0; i < 6; i++) k += `<line x1="${-11 + i * 4.4}" y1="11" x2="${-11 + i * 4.4}" y2="13.4" stroke="#fff" stroke-width=".3" opacity=".6"/>`;
  k += `<circle cx="10" cy="8.6" r=".7" fill="#5cd68a"/></g>`;
  k += `<path d="M-12 14 L-20 40 L22 40 L12 16 Z" fill="${S.lg("waerme", [[0, "#ffb15c", 0.22], [1, "#ffb15c", 0]])}" pointer-events="none"/>`;
  S.teil({ id: "waermestrahler", de: "der Wärmestrahler", syl: "WÄR-me-strah-ler", it: "la lampada riscaldante", itSyl: "LAM-pa-da ri-scal-DAN-te", en: "radiant heater", x: 24, y: 40, kunst: k,
    tipp: "Der Wärmestrahler hält das Baby beim Wickeln warm." });
}

/* =====================================================================
   2 — DAS OTOSKOP (Diagnostik-Set an der Wand)
   ===================================================================== */
{
  let k = `<rect x="-9" y="-9" width="18" height="12" rx="1.4" fill="${WEISS}" stroke="#c3cacc" stroke-width=".3"/>`;
  k += `<rect x="-6" y="-7" width="12" height="2" rx=".5" fill="#2f353b"/><circle cx="-4" cy="-1.6" r=".8" fill="#5cd68a"/>`;
  /* zwei Griffe in Haltern: Otoskop (mit Trichter) und Ophthalmoskop */
  for (const [x, oto] of [[-3, true], [4, false]]) {
    k += `<rect x="${x - 1.4}" y="-3" width="2.8" height="16" rx="1.2" fill="#3a4045"/><rect x="${x - 1.4}" y="5" width="2.8" height=".6" fill="#7d868c"/>`;
    if (oto) k += `<path d="M${x - 2} -3 L${x + 2} -3 L${x + 1} -8 L${x - 1} -8 Z" fill="#2f353b"/><path d="M${x - 0.6} -8 L${x + 0.6} -8 L${x + 0.3} -11 L${x - 0.3} -11 Z" fill="#f2f2f0"/>`;
    else k += `<rect x="${x - 2}" y="-8" width="4" height="5" rx="1" fill="#2f353b"/><circle cx="${x}" cy="-5.4" r=".8" fill="#9fd3e6"/>`;
  }
  k += `<path d="M-3 13 Q-3 20 3 22 Q8 20 4 13" stroke="#2f353b" stroke-width=".5" fill="none"/>`;
  S.teil({ id: "otoskop", de: "das Otoskop", syl: "o-to-SKOP", it: "l'otoscopio", itSyl: "o-to-SCO-pio", en: "otoscope", x: 82, y: 62, kunst: k,
    tipp: "Mit dem Otoskop schaut die Ärztin ins Ohr." });
}

/* =====================================================================
   3 — DAS WANDBILD (gerahmt: Elefant mit Luftballon)
   ===================================================================== */
{
  let k = `<rect x="-13" y="-10" width="26" height="20" rx=".8" fill="#f2a65a"/><rect x="-11.6" y="-8.6" width="23.2" height="17.2" fill="#eaf6fb"/>`;
  k += `<rect x="-11.6" y="3" width="23.2" height="5.6" fill="#bfe3b0"/>`;
  k += `<ellipse cx="-1" cy="1.6" rx="6" ry="4" fill="#9fb3c4"/><circle cx="-6.4" cy="-.6" r="3.2" fill="#9fb3c4"/><path d="M-8.6 .8 Q-10.6 4 -9 6.4" stroke="#9fb3c4" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
  k += `<ellipse cx="-5.4" cy="-.6" rx="1.4" ry="2" fill="#b6c7d5"/><circle cx="-7.2" cy="-1.4" r=".4" fill="#2f353b"/>`;
  for (const x of [-4.6, -1.6, 1.6, 4]) k += `<rect x="${x - 0.9}" y="4" width="1.8" height="3" rx=".5" fill="#8fa5b8"/>`;
  k += `<path d="M5 0 Q8 -4 7 -6" stroke="#666" stroke-width=".25" fill="none"/><ellipse cx="7" cy="-7.4" rx="2" ry="2.4" fill="#e2574c"/><path d="M6.2 -8.4 q.6 -.6 1.2 -.4" stroke="#fff" stroke-width=".4" fill="none"/>`;
  S.teil({ id: "wandbild", de: "das Wandbild", syl: "WAND-bild", it: "il quadro", itSyl: "QUA-dro", en: "wall picture", x: 150, y: 50, kunst: k });
}

/* =====================================================================
   4 — DIE MESSLATTE (Giraffe mit Zentimeter-Skala)
   ===================================================================== */
{
  const cm = 46 / 100;   // an der Wand: 46 Einheiten je Meter, Fuß bei y = 130
  let k = `<rect x="-3" y="${r(-160 * cm)}" width="6" height="${r(160 * cm)}" rx="1" fill="#fbfaf4" stroke="#d9cfae" stroke-width=".3"/>`;
  for (let c = 0; c <= 160; c += 5) {
    const y = -c * cm, lang = c % 10 === 0;
    k += `<line x1="-3" y1="${r(y)}" x2="${lang ? -0.6 : -1.8}" y2="${r(y)}" stroke="#555" stroke-width="${lang ? 0.25 : 0.15}"/>`;
    if (lang && c >= 50) k += `<text x="1.6" y="${r(y + 0.6)}" font-size="1.6" text-anchor="middle" fill="#3a3a3a" font-family="Arial">${c}</text>`;
  }
  /* Giraffe daneben, ihr Kopf oben an der Latte */
  const G = S.lg("giraffe", [[0, "#f7c55a"], [1, "#eaa93a"]]);
  k += `<path d="M5 -2 L5 -18 Q5 -24 10 -24 L16 -24 Q20 -24 20 -18 L20 -2 L18 -2 L18 -12 L16 -12 L16 -2 L13 -2 L13 -12 L8 -12 L8 -2 Z" fill="${G}"/>`;
  k += `<path d="M14 -24 L10 -66 Q9 -70 12 -71 L14 -60 L18 -24 Z" fill="${G}"/>`;
  k += `<path d="M7 -70 Q8 -74 13 -74 Q18 -73 18 -70 Q16 -67 11 -67 Q7 -67 7 -70 Z" fill="${G}"/><circle cx="10" cy="-71" r=".6" fill="#3a2a1a"/>`;
  k += `<path d="M13 -74 l-.4 -3 M15 -74 l.4 -3" stroke="#c98a2a" stroke-width=".7" stroke-linecap="round"/>`;
  for (const [x, y, rr] of [[9, -20, 1.6], [14, -18, 1.3], [17, -21, 1.2], [12, -30, 1.2], [13, -40, 1], [12, -50, 1], [12, -60, .9], [10, -9, 1], [17, -9, 1]]) k += `<circle cx="${x}" cy="${y}" r="${rr}" fill="#b9732f" opacity=".75"/>`;
  k += `<path d="M5 -10 q-2 2 -1 5" stroke="${G}" stroke-width="1" fill="none"/>`;
  S.teil({ id: "ka_messlatte", de: "die Messlatte", syl: "MESS-lat-te", it: "il metro da parete", itSyl: "ME-tro da pa-RE-te", en: "height chart", x: 196, y: WAND_UNTEN - 1, kunst: k,
    tipp: "An der Messlatte sieht man, wie groß das Kind schon ist." });
}

/* =====================================================================
   5 — DER WICKELTISCH (Kommode mit Wickelauflage) und 6 — DIE WAAGE
   ===================================================================== */
const WT = { x0: 4, x1: 66, top: 96, fuss: 138 };
{
  const cx = (WT.x0 + WT.x1) / 2, W = WT.x1 - WT.x0, H = WT.fuss - WT.top;
  let k = schatten(0, 0, W / 2 + 2, 1.4, .28);
  k += `<rect x="${-W / 2}" y="${-H + 3}" width="${W}" height="${H - 5}" fill="${WEISS}"/>`;
  for (const [y, h] of [[-H + 5, 10], [-H + 16.4, 10], [-H + 27.8, 10]]) {
    k += `<rect x="${-W / 2 + 1.4}" y="${y}" width="${W - 2.8}" height="${h}" rx=".6" fill="${S.lg("lade", [[0, "#ffffff"], [1, "#e9edee"]])}" stroke="#d3d9da" stroke-width=".3"/>`;
    k += `<circle cx="-8" cy="${y + h / 2}" r="1.3" fill="#6bbf73"/><circle cx="8" cy="${y + h / 2}" r="1.3" fill="#4f9fd6"/>`;
  }
  k += `<rect x="${-W / 2}" y="-2.4" width="${W}" height="2.4" fill="#c9c3b4"/>`;
  k += `<rect x="${-W / 2 - 1}" y="${-H}" width="${W + 2}" height="3.6" rx="1" fill="${HOLZ}"/>`;
  /* Wickelauflage (weich, gesteppt, mit Tierdruck) links */
  k += `<path d="M${-W / 2 + 1} ${-H} L${-W / 2 + 1} ${-H - 4} Q${-W / 2 + 1} ${-H - 6} ${-W / 2 + 3} ${-H - 6} L-3 ${-H - 6} Q-1 ${-H - 6} -1 ${-H - 4} L-1 ${-H} Z" fill="${S.lg("auflage", [[0, "#cfe6f2"], [1, "#9fc8de"]])}"/>`;
  k += `<path d="M${-W / 2 + 5} ${-H - 3} L-5 ${-H - 3}" stroke="#ffffff" stroke-width=".8" opacity=".7"/>`;
  for (const x of [-24, -16, -8]) k += `<circle cx="${x}" cy="${-H - 1.6}" r=".8" fill="#f2c94c"/>`;
  S.teil({ id: "wickeltisch", de: "der Wickeltisch", syl: "WI-ckel-tisch", it: "il fasciatoio", itSyl: "fa-scia-TO-io", en: "changing table", x: cx, y: WT.fuss, steht: true, kunst: k });
}
{
  /* Säuglingswaage: Sockel mit Display, Wiegeschale, Papierunterlage */
  let k = schatten(0, 0, 14, 1, .25);
  k += `<path d="M-13 0 L13 0 L12 -4 L-12 -4 Z" fill="${WEISS_H}" stroke="#c3cacc" stroke-width=".3"/>`;
  k += `<rect x="4" y="-3.4" width="7" height="2.8" rx=".4" fill="#1d2a30"/><text x="7.5" y="-1.3" font-size="2" text-anchor="middle" fill="#7cff8a" font-family="monospace">0,000</text>`;
  k += `<circle cx="-9" cy="-2" r=".7" fill="#4f9fd6"/><circle cx="-6.6" cy="-2" r=".7" fill="#e2574c"/>`;
  k += `<path d="M-14 -4.6 Q-14 -9 -10 -9 L10 -9 Q14 -9 14 -4.6 Z" fill="${S.lg("schale", [[0, "#f6fbfd"], [1, "#cfe2ea"]])}" stroke="#a9c3cd" stroke-width=".3"/>`;
  k += `<path d="M-12 -8.4 Q0 -6.4 12 -8.4" stroke="#ffffff" stroke-width=".6" fill="none"/><path d="M-11 -8.6 L11 -8.6 L10 -7.6 L-10 -7.6 Z" fill="#fdfdfb" opacity=".9"/>`;
  S.teil({ oben: true, id: "ka_waage_ka", de: "die Waage", syl: "WAA-ge", it: "la bilancia", itSyl: "bi-LAN-cia", en: "scales", x: 50, y: WT.top, kunst: k,
    tipp: "Auf der Säuglingswaage wird das Baby gewogen — auf das Gramm genau." });
}

/* =====================================================================
   7 — DER SCHREIBTISCH (Lupe: U-Heft, Impfpass, Spritze, Pflaster,
       Fieberthermometer) und 8 — DER COMPUTER
   ===================================================================== */
const ST = { x0: 226, x1: 300, top: 100, fuss: 136 };
const tischUnter = [];
{
  const cx = (ST.x0 + ST.x1) / 2, W = ST.x1 - ST.x0, H = ST.fuss - ST.top;
  let k = schatten(0, 0, W / 2 + 2, 1.4, .28);
  /* Platte, Wange links, Rollcontainer rechts */
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="3.2" rx=".8" fill="${HOLZ}"/><rect x="${-W / 2}" y="${-H + 3.2}" width="${W}" height=".8" fill="#a98a5e"/>`;
  k += `<rect x="${-W / 2 + 2}" y="${-H + 4}" width="3" height="${H - 4}" fill="${WEISS_H}"/>`;
  k += `<rect x="${W / 2 - 22}" y="${-H + 5}" width="20" height="${H - 7}" rx=".8" fill="${WEISS}" stroke="#c9cfd2" stroke-width=".3"/>`;
  for (let i = 0; i < 3; i++) k += `<rect x="${W / 2 - 21}" y="${-H + 6 + i * 9.6}" width="18" height="8.8" rx=".5" fill="none" stroke="#d3d9da" stroke-width=".3"/><rect x="${W / 2 - 15}" y="${-H + 7.4 + i * 9.6}" width="6" height="1" rx=".5" fill="#f2a65a"/>`;
  for (const x of [W / 2 - 20, W / 2 - 4]) k += `<circle cx="${x}" cy="-1" r="1" fill="#555"/>`;
  /* Tastatur und Maus */
  k += `<path d="M${-W / 2 + 14} ${-H - 0.4} L${-W / 2 + 34} ${-H - 0.4} L${-W / 2 + 33} ${-H - 1.8} L${-W / 2 + 15} ${-H - 1.8} Z" fill="#3a4045"/><ellipse cx="${-W / 2 + 38}" cy="${-H - 0.9}" rx="1.4" ry=".8" fill="#3a4045"/>`;
  const P = -H;
  const unter = (id, de, syl, it, itSyl, en, x, kunst, fl, tipp) => {
    k += `<g transform="translate(${x} ${P})">${kunst}</g>`;
    tischUnter.push({ id, de, syl, it, itSyl, en, x: cx + x, y: ST.fuss + P, kunst: fl, tipp });
  };
  /* DAS U-HEFT — das gelbe Kinder-Untersuchungsheft */
  unter("ka_uheft", "das U-Heft", "U-Heft", "il libretto pediatrico", "li-BRET-to pe-dia-TRI-co", "child health record", 2,
    `<path d="M-5 0 L5 0 L4 -2.2 L-4.4 -2.2 Z" fill="#f4cf2e" stroke="#c9a51c" stroke-width=".2"/><path d="M-4.4 -2.2 L4 -2.2 L3.6 -3 L-4 -3 Z" fill="#f7dc5a"/><text x="0" y="-.6" font-size="1" text-anchor="middle" fill="#3a3a3a" font-family="Arial" font-weight="bold">Kinder-Untersuchungsheft</text>`,
    flaeche(-5.4, -4, 10.8, 4.4), "Im gelben U-Heft stehen alle Vorsorge-Untersuchungen von U1 bis U9.");
  /* DER IMPFPASS */
  unter("ka_impfpass", "der Impfpass", "IMPF-pass", "il libretto delle vaccinazioni", "li-BRET-to delle vac-ci-na-ZIO-ni", "vaccination card", 11.6,
    `<path d="M-3.4 0 L3.4 0 L3 -1.6 L-3 -1.6 Z" fill="#f2d55a" stroke="#c9a51c" stroke-width=".2"/><path d="M-3 -1.6 L3 -1.6 L2.8 -2.2 L-2.8 -2.2 Z" fill="#f6e48c"/><circle cx="0" cy="-.8" r=".5" fill="#4f7fbf"/>`,
    flaeche(-4, -3, 8, 3.4), "Im Impfpass trägt die Ärztin jede Impfung ein.");
  /* DIE SPRITZE in der Nierenschale */
  unter("ka_spritze", "die Spritze", "SPRIT-ze", "la siringa", "si-RIN-ga", "syringe", 20,
    `<path d="M-4.4 0 Q-5 -2.2 -3 -2.2 Q0 -1.2 3 -2.2 Q5 -2.2 4.4 0 Z" fill="${STAHL}" stroke="#8a949b" stroke-width=".2"/><rect x="-2.8" y="-3.4" width="4.4" height="1.2" rx=".3" fill="#eef2f4" stroke="#8a949b" stroke-width=".15"/><rect x="-2.2" y="-3.2" width="2.4" height=".8" fill="#c4e3f2"/><path d="M1.6 -2.8 L3.8 -2.8" stroke="#7d868d" stroke-width=".2"/><path d="M-2.8 -2.8 L-3.8 -2.8 M-3.8 -3.4 L-3.8 -2.2" stroke="#8a949b" stroke-width=".3"/>`,
    flaeche(-4.8, -4.2, 9.6, 4.6), "Eine Impfung ist nur ein kleiner Piks.");
  /* DAS PFLASTER — Kinderpflaster mit bunten Motiven */
  unter("ka_pflaster", "das Pflaster", "PFLAS-ter", "il cerotto", "ce-ROT-to", "plaster", -10,
    `<rect x="-3" y="-3.4" width="6" height="3.4" rx=".3" fill="#e2574c"/><text x="0" y="-1.2" font-size="1" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">Kinder</text><g transform="rotate(-12 0 -4)"><rect x="-2.6" y="-5.4" width="5.2" height="1.4" rx=".7" fill="#f6d2b0"/><rect x="-.8" y="-5.3" width="1.6" height="1.2" fill="#fff"/><circle cx="-1.8" cy="-4.7" r=".3" fill="#4f9fd6"/><circle cx="1.8" cy="-4.7" r=".3" fill="#6bbf73"/></g>`,
    flaeche(-3.4, -6.4, 6.8, 6.8), "Nach dem Piks gibt es ein buntes Pflaster.");
  /* DAS FIEBERTHERMOMETER — Ohrthermometer */
  unter("fieberthermometer", "das Fieberthermometer", "FIE-ber-ther-mo-me-ter", "il termometro", "ter-MO-me-tro", "thermometer", -18,
    `<path d="M-2.2 0 Q-2.8 -3 -1.6 -4.6 L1.4 -5.4 Q2.6 -5.4 2.4 -4 L1.6 0 Z" fill="${WEISS}" stroke="#a9b2b7" stroke-width=".2"/><rect x="-1.2" y="-3.4" width="2.4" height="1.2" rx=".2" fill="#9fe0c4"/><text x="0" y="-2.5" font-size=".8" text-anchor="middle" fill="#1d3a2e" font-family="monospace">37,2</text><path d="M1.4 -5.4 L2.8 -6.4" stroke="#c9cfd4" stroke-width="1" stroke-linecap="round"/>`,
    flaeche(-3, -7, 6.4, 7.4), "Ab 38 Grad hat man Fieber.");
  S.teil({ id: "schreibtisch", de: "der Schreibtisch", syl: "SCHREIB-tisch", it: "la scrivania", itSyl: "scri-va-NI-a", en: "desk", x: cx, y: ST.fuss, steht: true, kunst: k,
    zoom: { x: ST.x0 + 4, y: ST.top - 14, w: 54, h: 36 },
    unter: tischUnter,
    tipp: "Am Schreibtisch schreibt die Ärztin alles in den Computer." });
}
{
  let k = schatten(0, 0, 8, .8, .25);
  k += `<rect x="-5" y="-1" width="10" height="1" rx=".4" fill="#3a4045"/><rect x="-1" y="-6" width="2" height="5" fill="#4a5257"/>`;
  k += `<rect x="-13" y="-22" width="26" height="16.4" rx="1" fill="#1f2428"/><rect x="-12" y="-21" width="24" height="13.6" fill="${S.lg("bild", [[0, "#eef4f8"], [1, "#d5e3ec"]])}"/>`;
  k += `<rect x="-12" y="-21" width="24" height="2.2" fill="#4f9fd6"/><text x="-11" y="-19.4" font-size="1.4" fill="#fff" font-family="Arial">Praxis · U7 · Lena, 2 J.</text>`;
  k += `<path d="M-10 -10 L-6 -12 L-2 -11.4 L2 -14 L6 -14.6 L10 -16" stroke="#e2574c" stroke-width=".4" fill="none"/>`;
  for (let i = 0; i < 4; i++) k += `<line x1="-10" y1="${-17.4 + i * 1.2}" x2="${i % 2 ? -1 : 2}" y2="${-17.4 + i * 1.2}" stroke="#8aa1b1" stroke-width=".3"/>`;
  k += `<path d="M-12 -21 L-6 -21 L-12 -12 Z" fill="#fff" opacity=".12"/>`;
  S.teil({ oben: true, id: "computer", de: "der Computer", syl: "com-PU-ter", it: "il computer", itSyl: "com-PU-ter", en: "computer", x: 280, y: ST.top - 0.4, kunst: k });
}

/* =====================================================================
   9 — DIE MUTTER (steht hinter der Liege, Hand an der Schulter des Kindes)
   ===================================================================== */
{
  const m = B.mensch({ id: "b03c_mutter", geschlecht: "w", pose: "kontrapost", blick: 34, frisur: "lang", haarfarbe: "hellbraun", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "pullover", farbe: "#c95f6e" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "halbschuh" } } }, 86);
  S.teil({ id: "ka_mutter", de: "die Mutter", syl: "MUT-ter", it: "la madre", itSyl: "MA-dre", en: "mother", x: 120, y: 152, kunst: m.svg,
    tipp: "Die Mutter fragt: „Ist alles in Ordnung?“" });
}

/* =====================================================================
   10 — DIE UNTERSUCHUNGSLIEGE (mit Papier) und 11 — DIE PAPIERROLLE
   ===================================================================== */
const LI = { x0: 78, x1: 176, top: 132, fuss: 170 };
{
  const cx = (LI.x0 + LI.x1) / 2, W = LI.x1 - LI.x0, H = LI.fuss - LI.top;
  let k = schatten(0, 0, W / 2 + 2, 1.8, .3);
  /* Untergestell: Holzoptik-Schrank mit Fächern (typisch Praxisliege) */
  k += `<rect x="${-W / 2 + 6}" y="${-H + 6}" width="${W - 12}" height="${H - 7}" rx="1" fill="${HOLZ}"/>`;
  k += `<rect x="${-W / 2 + 9}" y="${-H + 9}" width="${(W - 18) / 2 - 1}" height="${H - 12}" rx=".6" fill="${S.lg("ligefach", [[0, "#8c7149"], [1, "#b8976a"]])}"/>`;
  k += `<rect x="${1}" y="${-H + 9}" width="${(W - 18) / 2 - 1}" height="${H - 12}" rx=".6" fill="#efe6d4" stroke="#c4a272" stroke-width=".3"/><rect x="${(W - 18) / 4 - 2}" y="${-H / 2}" width="5" height="1" rx=".5" fill="#8a9398"/>`;
  /* Handtuchrollen im offenen Fach */
  for (let i = 0; i < 3; i++) k += `<ellipse cx="${-W / 2 + 15 + i * 9}" cy="-6" rx="4" ry="3" fill="${["#9fd3e6", "#f2c94c", "#f6b8c4"][i]}"/>`;
  k += `<rect x="${-W / 2 + 6}" y="-2" width="${W - 12}" height="2" fill="#a88a62"/>`;
  /* Polster (mintgrün) mit leicht angehobenem Kopfteil links */
  k += `<path d="M${-W / 2} ${-H + 1} L${-W / 2} ${-H - 3} Q${-W / 2} ${-H - 8} ${-W / 2 + 4} ${-H - 8} L${-W / 2 + 20} ${-H - 3.4} L${W / 2 - 2} ${-H - 3.4} Q${W / 2} ${-H - 3.4} ${W / 2} ${-H - 1} L${W / 2} ${-H + 3} Q${W / 2} ${-H + 6} ${W / 2 - 3} ${-H + 6} L${-W / 2 + 3} ${-H + 6} Q${-W / 2} ${-H + 6} ${-W / 2} ${-H + 1} Z" fill="${S.lg("polster", [[0, "#7ccbb4"], [1, "#4ea58c"]])}"/>`;
  /* Einmal-Papier über die ganze Länge */
  k += `<path d="M${-W / 2 + 2} ${-H - 7.2} L${-W / 2 + 20} ${-H - 3} L${W / 2 - 1} ${-H - 3} L${W / 2 - 1} ${-H + 1.4} L${-W / 2 + 20} ${-H + 1.4} L${-W / 2 + 2} ${-H - 2} Z" fill="#fbfbf6" opacity=".95"/>`;
  k += `<path d="M${W / 2 - 1} ${-H + 1.4} L${W / 2 - 1} ${-H + 4} L${W / 2 - 4} ${-H + 4.4}" fill="#f4f4ec" stroke="#dcdcd0" stroke-width=".2"/>`;
  k += `<path d="M${-W / 2 + 22} ${-H - 2.6} L${W / 2 - 3} ${-H - 2.6}" stroke="#fff" stroke-width=".6"/>`;
  S.teil({ id: "ka_liege_ka", de: "die Untersuchungsliege", syl: "UN-ter-su-chungs-lie-ge", it: "il lettino", itSyl: "let-TI-no", en: "examination couch", x: cx, y: LI.fuss, steht: true, kunst: k,
    tipp: "Für jedes Kind kommt frisches Papier auf die Liege." });
}
{
  /* Papierrolle in der Halterung am Kopfende */
  let k = `<path d="M-2 -8 L-2 4" stroke="#9aa3aa" stroke-width=".8"/>`;
  k += `<rect x="-5.6" y="-6.6" width="7" height="9" rx="3.5" fill="${S.lg("rolle", [[0, "#ffffff"], [0.6, "#f1f1ea"], [1, "#cfcfc4"]], 0, 0, 1, 0)}" stroke="#c9c9bd" stroke-width=".25"/>`;
  k += `<ellipse cx="-2.1" cy="-2.1" rx="1.2" ry="1.4" fill="#a98a5e"/><path d="M1.4 -2 Q2.4 0 3 3" stroke="#e9e9e0" stroke-width="1.4" fill="none"/>`;
  S.teil({ oben: true, id: "papierrolle", de: "die Papierrolle", syl: "pa-PIER-rol-le", it: "il rotolo di carta", itSyl: "RO-to-lo di CAR-ta", en: "paper roll", x: LI.x0 - 1, y: LI.top - 5, kunst: k,
    tipp: "Das Papier wird nach jedem Kind abgerissen und neu ausgerollt." });
}

/* =====================================================================
   12 — DAS KIND (sitzt auf der Liege, bekleidet)
   ===================================================================== */
const kind = B.mensch({ id: "b03c_kind", alter: "kind", geschlecht: "w", pose: "b03c_kantesitz", blick: 64, frisur: "zopf", haarfarbe: "blond", haut: "hell", laecheln: true,
  kleidung: { oberteil: { stueck: "tshirt", farbe: "#f2c94c" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" } } }, 70);
const KIND = { x: 150 - kind.z.sitz.x * kind.k, y: LI.top - 5 - kind.z.sitz.y * kind.k };
{
  S.teil({ id: "ka_kind_ka", de: "das Kind", syl: "KIND", it: "il bambino", itSyl: "bam-BI-no", en: "child", x: KIND.x, y: KIND.y, kunst: kind.svg,
    tipp: "Das Kind sagt: „Das kitzelt!“" });
}

/* =====================================================================
   13 — DIE KINDERÄRZTIN (hört das Kind ab) und 14 — DAS STETHOSKOP
   ===================================================================== */
{
  const brust = [KIND.x + kind.z.punkte.brust[0] * kind.k + 1.2, KIND.y + kind.z.punkte.brust[1] * kind.k];
  const m = B.mensch({ id: "b03c_aerztin", geschlecht: "w", pose: "b03c_abhoeren", blick: -62, frisur: "dutt", haarfarbe: "dunkelbraun", haut: "mittel",
    kleidung: { oberteil: { stueck: "arztkittel" }, unterteil: { stueck: "hose", farbe: "#2a3b55" }, schuhe: { stueck: "turnschuh" } } }, 96);
  const h = m.z.handL.x < m.z.handR.x ? m.z.handL : m.z.handR;
  const x = brust[0] - h.x * m.k, y = brust[1] - h.y * m.k;
  /* Bodenhöhe prüfen: die Ärztin steht vor der Liege */
  const AY = Math.max(y, 178), AX = x + 0 * (AY - y);
  const dy = AY - y;
  S.teil({ id: "ka_kinderaerztin", de: "die Kinderärztin", syl: "KIN-der-ärz-tin", it: "la pediatra",
    itSyl: "pe-DIA-tra",   /* korrigiert: im Italienischen betont man pe-DIA-tra (alt: pe-dia-TRA) */
    en: "paediatrician", x: AX, y: AY, kunst: m.svg,
    tipp: "Die Kinderärztin sagt: „Jetzt einmal tief einatmen!“" });
  /* Stethoskop: Ohrbügel am Kopf, Schlauch über den Nacken zur Hand am Brustkorb */
  const P = m.z.punkte, k = m.k;
  const ohr = [AX + P.ohr[0] * k, AY + P.ohr[1] * k], hals = [AX + P.hals[0] * k, AY + P.hals[1] * k], hd = [AX + h.x * k, AY + h.y * k - dy];
  const ax = r(hals[0]), ay = r(hals[1] + 2);
  let s = `<path d="M${r(ohr[0] - ax)} ${r(ohr[1] - ay)} Q${r(ohr[0] - ax - 1)} ${r(ohr[1] - ay + 4)} 0 0" stroke="#c9cfd4" stroke-width=".45" fill="none"/>`;
  s += `<path d="M0 0 Q${r((hd[0] - ax) * 0.3)} ${r((hd[1] - ay) + 8)} ${r(hd[0] - ax + 1.6)} ${r(hd[1] - ay + 0.4)}" stroke="#2f5a8a" stroke-width=".7" fill="none"/>`;
  s += `<circle cx="${r(hd[0] - ax + 0.6)}" cy="${r(hd[1] - ay)}" r="1.3" fill="${STAHL}" stroke="#7d868c" stroke-width=".25"/>`;
  s += flaeche(-2.6, -2, 5.2, 7);
  S.teil({ oben: true, id: "ka_stethoskop", de: "das Stethoskop", syl: "Ste-tho-SKOP", it: "lo stetoscopio", itSyl: "ste-to-SCO-pio", en: "stethoscope", x: ax, y: ay, kunst: s,
    tipp: "Mit dem Stethoskop hört man Herz und Lunge." });
}

/* =====================================================================
   15 — DER WARTESTUHL (für die Begleitperson, mit Handtasche)
   ===================================================================== */
{
  let k = schatten(0, 0, 11, 1.2, .28);
  for (const x of [-9, 8]) k += `<path d="M${x} 0 L${x + 0.6} -21" stroke="#3a4045" stroke-width="1.2"/>`;
  k += `<path d="M-5 -1 L-4.6 -20" stroke="#2f353b" stroke-width="1"/><path d="M11 -1 L10.6 -20" stroke="#2f353b" stroke-width="1"/>`;
  k += `<path d="M-11 -24 L12 -24 Q13 -24 12.6 -21.6 L-10.6 -21 Q-11.6 -21.4 -11 -24 Z" fill="${S.lg("sitz", [[0, "#f2a65a"], [1, "#d9853a"]])}"/>`;
  k += `<path d="M-11 -24 L-12 -44 Q-12 -46 -9.6 -46 L-7 -46 L-6.4 -24 Z" fill="${S.lg("lehne", [[0, "#f2a65a"], [1, "#d9853a"]], 0, 0, 1, 0)}"/>`;
  /* Handtasche der Mutter auf dem Sitz */
  k += `<path d="M-2 -24 L-1 -32 L9 -32 L10 -24 Z" fill="#7d4a2c"/><path d="M1 -32 Q4 -38 7 -32" stroke="#5a341e" stroke-width=".8" fill="none"/><rect x="3" y="-29.4" width="2" height="1" fill="#d6b56a"/>`;
  S.teil({ id: "ka_wartestuhl_ka", de: "der Wartestuhl", syl: "WAR-te-stuhl", it: "la sedia d'attesa", itSyl: "SE-dia d'at-TE-sa", en: "waiting chair", x: 302, y: 166, kunst: k });
}

/* =====================================================================
   16 — DIE SPIELECKE (Teppich mit Straßen, Motorikschleife)
   ===================================================================== */
{
  let k = `<path d="M-46 0 L50 0 L40 -22 L-30 -22 Z" fill="${S.lg("teppich", [[0, "#9fd3a8"], [1, "#7cc08a"]])}"/>`;
  k += `<path d="M-40 -2 Q0 -14 44 -4" stroke="#8a9398" stroke-width="2.4" fill="none"/><path d="M-40 -2 Q0 -14 44 -4" stroke="#fff" stroke-width=".3" stroke-dasharray="1.4 1" fill="none"/>`;
  k += `<rect x="-22" y="-19" width="6" height="4" fill="#e2574c"/><path d="M-23 -19 L-19 -22 L-15 -19 Z" fill="#b8473a"/><circle cx="20" cy="-16" r="3" fill="#4f9fd6" opacity=".7"/>`;
  k += `<path d="M-46 0 L50 0" stroke="#5e9e6a" stroke-width=".8"/>`;
  /* Motorikschleife: Holzsockel, bunte Drahtbügel mit Perlen */
  const mx = -28, my = -6;
  k += schatten(mx, my, 9, 1, .25) + `<rect x="${mx - 9}" y="${my - 3}" width="18" height="3" rx=".6" fill="${HOLZ}"/>`;
  const draht = [[-7, 7, -18, "#e2574c"], [-5, 5, -24, "#4f9fd6"], [-8, 3, -14, "#6bbf73"]];
  for (const [a, b, h, f] of draht) {
    k += `<path d="M${mx + a} ${my - 3} C${mx + a} ${my + h} ${mx + b} ${my + h} ${mx + b} ${my - 3}" stroke="${f}" stroke-width=".8" fill="none"/>`;
    for (let i = 0; i < 4; i++) { const t = 0.25 + i * 0.15; const x = (1 - t) ** 3 * a + 3 * (1 - t) ** 2 * t * a + 3 * (1 - t) * t * t * b + t ** 3 * b; const y = (1 - t) ** 3 * -3 + 3 * (1 - t) ** 2 * t * h + 3 * (1 - t) * t * t * h + t ** 3 * -3; k += `<circle cx="${r(mx + x)}" cy="${r(my + y)}" r="1.2" fill="${["#f2c94c", "#e2574c", "#4f9fd6", "#f2a65a"][i]}"/>`; }
  }
  S.teil({ id: "ka_spielecke", de: "die Spielecke", syl: "SPIEL-ecke", it: "l'angolo giochi", itSyl: "AN-go-lo GIO-chi", en: "play corner", x: 262, y: 200, kunst: k,
    tipp: "In der Spielecke dürfen Kinder spielen, bis sie dran sind." });
}

/* =====================================================================
   17 — DIE SPIELZEUGKISTE (Lupe: Teddybär, Ball, Bauklotz, Auto)
   ===================================================================== */
const KI = { x: 284, y: 196 };
const kisteUnter = [];
{
  let k = schatten(0, 0, 15, 1.4, .3);
  /* Rückwand der Kiste (innen) */
  k += `<path d="M-13 -16 L13 -16 L12 -20 L-12 -20 Z" fill="#c4935a"/>`;
  const unter = (id, de, syl, it, itSyl, en, x, y, kunst, fl, tipp) => { k += `<g transform="translate(${x} ${y})">${kunst}</g>`; kisteUnter.push({ id, de, syl, it, itSyl, en, x: KI.x + x, y: KI.y + y, kunst: fl, tipp }); };
  /* DER TEDDYBÄR sitzt in der Kiste und schaut heraus */
  unter("teddybaer", "der Teddybär", "TED-dy-bär", "l'orsacchiotto", "or-sac-CHIOT-to", "teddy bear", -6, -15,
    `<ellipse cx="0" cy="-2" rx="4.6" ry="4" fill="#b98250"/><circle cx="0" cy="-8.6" r="3.6" fill="#c48d5a"/><circle cx="-2.8" cy="-11.4" r="1.4" fill="#b98250"/><circle cx="2.8" cy="-11.4" r="1.4" fill="#b98250"/><circle cx="-2.8" cy="-11.4" r=".7" fill="#e2b48a"/><circle cx="2.8" cy="-11.4" r=".7" fill="#e2b48a"/><ellipse cx="0" cy="-7.6" rx="1.6" ry="1.2" fill="#e2b48a"/><circle cx="0" cy="-8" r=".5" fill="#2a1a10"/><circle cx="-1.2" cy="-9.6" r=".45" fill="#2a1a10"/><circle cx="1.2" cy="-9.6" r=".45" fill="#2a1a10"/><path d="M-1.6 -5 L1.6 -5 L0 -4 Z" fill="#e2574c"/><ellipse cx="-4.4" cy="-3" rx="1.4" ry="2.2" fill="#b98250"/><ellipse cx="4.4" cy="-3" rx="1.4" ry="2.2" fill="#b98250"/>`,
    flaeche(-5, -13.4, 10, 13.4), "Der Teddy darf mit zur Untersuchung.");
  /* DER BALL */
  unter("ball", "der Ball", "BALL", "la palla", "PAL-la", "ball", 5, -15.4,
    `<circle cx="0" cy="-3.6" r="3.6" fill="#e2574c"/><path d="M-3.6 -3.6 Q0 -1.4 3.6 -3.6" stroke="#f2c94c" stroke-width="1" fill="none"/><path d="M0 -7.2 Q-1.6 -3.6 0 0" stroke="#4f9fd6" stroke-width="1" fill="none"/><circle cx="-1.4" cy="-5" r=".8" fill="#fff" opacity=".5"/>`,
    flaeche(-3.8, -7.6, 7.6, 7.8));
  /* Vorderwand der Kiste mit Griff und Tierbild */
  k += `<path d="M-14 0 L14 0 L13.4 -16 L-13.4 -16 Z" fill="${S.lg("kiste", [[0, "#e7b679"], [1, "#c9955a"]])}" stroke="#a87a44" stroke-width=".3"/>`;
  k += `<rect x="-3" y="-13" width="6" height="1.6" rx=".8" fill="#8a5f30"/>`;
  k += `<text x="0" y="-5" font-size="3.4" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold" opacity=".9">SPIEL</text>`;
  for (const [x, f] of [[-9, "#e2574c"], [9, "#4f9fd6"]]) k += `<circle cx="${x}" cy="-6" r="2.2" fill="${f}" opacity=".8"/>`;
  /* DER BAUKLOTZ und DAS SPIELZEUGAUTO liegen vor der Kiste auf dem Teppich */
  unter("bauklotz", "der Bauklotz", "BAU-klotz", "il cubo di legno", "CU-bo di LE-gno", "building block", -20, 2,
    `<rect x="-3" y="-3.4" width="3.4" height="3.4" fill="#f2c94c" stroke="#c9a51c" stroke-width=".2"/><rect x=".6" y="-3.4" width="3.4" height="3.4" fill="#4f9fd6" stroke="#2f6db5" stroke-width=".2"/><rect x="-1.2" y="-6.8" width="3.4" height="3.4" fill="#e2574c" stroke="#b8473a" stroke-width=".2"/><text x=".5" y="-4.3" font-size="2.2" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">A</text>`,
    flaeche(-3.4, -7.2, 7.8, 7.6));
  unter("spielzeugauto", "das Spielzeugauto", "SPIEL-zeug-au-to", "la macchinina", "mac-chi-NI-na", "toy car", 20, 2.6,
    `<path d="M-5 -1 L-5 -3 L-2.6 -3.4 L-1.2 -5.6 L2.6 -5.6 L4 -3.4 L5.4 -3 L5.4 -1 Z" fill="#e2574c"/><path d="M-.8 -5.2 L2.2 -5.2 L3.2 -3.6 L-1.8 -3.6 Z" fill="#cfe8f5"/><circle cx="-2.8" cy="-1" r="1.2" fill="#2f353b"/><circle cx="3" cy="-1" r="1.2" fill="#2f353b"/>`,
    flaeche(-5.4, -6.2, 11, 6.6));
  S.teil({ id: "spielzeugkiste", de: "die Spielzeugkiste", syl: "SPIEL-zeug-kis-te", it: "la cassa dei giocattoli", itSyl: "CAS-sa dei gio-CAT-to-li", en: "toy box", x: KI.x, y: KI.y, kunst: k,
    zoom: { x: KI.x - 26, y: KI.y - 30, w: 50, h: 33 },
    unter: kisteUnter });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/kinderarzt.js"));
console.log(aus);
