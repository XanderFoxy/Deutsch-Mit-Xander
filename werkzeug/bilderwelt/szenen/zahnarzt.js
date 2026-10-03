#!/usr/bin/env node
/* =====================================================================
   BEIM ZAHNARZT (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (Hersteller-Beschreibungen von Behandlungseinheiten, z. B.
   KaVo/Dentsply Sirona/Morita; Praxisplanung; Fachartikel ZWP/zm):
   - Im Mittelpunkt die BEHANDLUNGSEINHEIT: der Patientenstuhl (Hubsäule
     auf einer Bodenplatte, Kontur-Polster mit Kopfstütze, die Beinauflage
     leicht angehoben). Behandelt wird im Liegen.
   - Am Fußende auf einem Schwenkarm das ARZTELEMENT mit dem Instrumenten-
     tablett (Mundspiegel, Sonde, Pinzette, Zange, Karpulenspritze,
     Watterollen) und den Handstücken an Schläuchen (Turbine, Winkelstück
     = „der Bohrer“).
   - An der Kopfseite gegenüber die WASSEREINHEIT mit der SPEISCHALE und
     dem Becherfüller; davor das Helferinnen-Element mit den Saugschläuchen
     (großer Sauger, Speichelsauger).
   - Über dem Mund die OP-/Behandlungsleuchte (LED) an der Decke, daneben
     ein MONITOR am Schwenkarm: dort zeigt die Praxis das Röntgenbild
     (Panoramaaufnahme, OPG) und erklärt es der Patientin.
   - Der Zahnarzt sitzt auf einem rollbaren Hocker hinter dem Kopf, die
     Zahnmedizinische Fachangestellte (Helferin) gegenüber; beide mit
     Mundschutz. Am Boden der Fußschalter, mit dem der Bohrer läuft.
   - An der Wand die Zeile aus Praxisschränken (weiß, grifflos) mit
     Waschbecken, Desinfektionsspender, Handschuh- und Maskenboxen,
     Zahnmodell und Recall-/Terminkarten.
   Maßstab: Rückwand ≈ 46 Einheiten je Meter (Fuß bei y = 130), Stuhl
   ≈ 57 je Meter (Bodenplatte bei y = 182), Zahnarzt 1,80 m vorn ≈ 58/m.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "zahnarzt", titel: "Beim Zahnarzt", emoji: "🦷", thema: "Gesundheit", kuerzel: "b03a", fassung: 852 });
const rnd = zufall(4711);
const r = B.r;

/* ---------- eigene Haltungen (nur in dieser Bau-Datei) --------------- */
B.mensch({}, 10);
const MP = globalThis.DMA_MENSCH.POSEN;
MP.b03a_liegen = { kipp: -69, lende: -2, brust: 0, nacken: 6, kopf: 2,
  schulterL: { vor: 2, seit: 10 }, ellbogenL: 22, unterarmL: -75, handL: 4, fingerL: 0.35,
  schulterR: { vor: 4, seit: 12 }, ellbogenR: 26, unterarmR: -75, handR: 4, fingerR: 0.35,
  huefteL: { vor: 14, seit: 4, dreh: -8 }, knieL: 6, fussL: 14,
  huefteR: { vor: 16, seit: 4, dreh: -8 }, knieR: 10, fussR: 14 };
MP.b03a_behandeln = Object.assign({}, MP.sitzen, { lende: 12, brust: 14, nacken: 6, kopf: 14,
  schulterL: { vor: 62, seit: 10 }, ellbogenL: 66, unterarmL: -40, handL: 0, fingerL: 0.4,
  schulterR: { vor: 56, seit: 12 }, ellbogenR: 78, unterarmR: -40, handR: 0, fingerR: 0.4 });
MP.b03a_reichen = Object.assign({}, MP.sitzen, { lende: 8, brust: 10, nacken: 4, kopf: 8,
  schulterL: { vor: 40, seit: 10 }, ellbogenL: 60, unterarmL: -40, handL: 0, fingerL: 0.45,
  schulterR: { vor: 58, seit: 12 }, ellbogenR: 30, unterarmR: -40, handR: 0, fingerR: 0.5 });

/* Mundschutz (OP-Maske) auf ein Gesicht im Halbprofil legen */
function maske(m, farbe) {
  const P = m.z.punkte, k = m.k, p = (n) => [P[n][0] * k, P[n][1] * k];
  const [nx, ny] = p("nase"), [kx, ky] = p("kinn"), [ox, oy] = p("ohr"), [wx, wy] = p("wange");
  const dir = Math.sign(nx - ox) || 1;
  const top = ny + 0.25, bot = ky + 1.2;
  let s = `<path d="M${r(ox + dir * 1.2)} ${r(top - 0.6)} L${r(nx + dir * 0.9)} ${r(top)} Q${r(nx + dir * 1.6)} ${r((top + bot) / 2)} ${r(kx + dir * 0.6)} ${r(bot)} Q${r((kx + ox) / 2)} ${r(bot + 0.8)} ${r(ox + dir * 1.4)} ${r(oy + 2.4)} Z" fill="${farbe}" stroke="#7fa9bd" stroke-width=".18"/>`;
  s += `<path d="M${r(ox + dir * 1.6)} ${r(top + 1)} L${r(nx + dir * 0.9)} ${r(top + 1.3)} M${r(ox + dir * 1.6)} ${r(top + 2.1)} L${r(nx + dir * 1.2)} ${r(top + 2.5)}" stroke="#a9cbd9" stroke-width=".16"/>`;
  s += `<path d="M${r(ox + dir * 1.2)} ${r(top - 0.4)} L${r(ox - dir * 0.3)} ${r(oy - 0.4)} M${r(ox + dir * 1.4)} ${r(oy + 2.2)} L${r(ox - dir * 0.3)} ${r(oy + 0.6)}" stroke="#e8f1f4" stroke-width=".3"/>`;
  void wx; void wy;
  return s;
}

/* ---------- Grundfarben und Stoffe ---------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const WAND = S.lg("wand", [[0, "#f4f6f4"], [0.6, "#eaefec"], [1, "#dfe6e2"]]);
const DECKE = S.lg("decke", [[0, "#f0f1ef"], [1, "#e1e3e0"]]);
const WEISS = S.lg("weiss", [[0, "#ffffff"], [0.6, "#f1f3f3"], [1, "#d9dedf"]]);
const WEISS_H = S.lg("weissh", [[0, "#e3e7e8"], [0.35, "#ffffff"], [1, "#d3d9db"]], 0, 0, 1, 0);
const POLSTER = S.lg("polster", [[0, "#3f8fae"], [0.5, "#2c7393"], [1, "#1d5670"]]);
const STAHL = S.lg("stahl", [[0, "#eef1f3"], [0.45, "#c9cfd4"], [0.55, "#b5bcc2"], [1, "#e1e5e8"]], 0, 0, 1, 0);
const GRAU_D = S.lg("graud", [[0, "#5a636b"], [1, "#2f353b"]]);
const GLAS = S.lg("glas", [[0, "#ffffff", 0.3], [0.5, "#e8f4f7", 0.06], [1, "#ffffff", 0.16]], 0, 0, 1, 1);

/* =====================================================================
   KULISSE — Decke (Rasterdecke mit LED-Panels), Wand, Fenster, Boden
   ===================================================================== */
const WAND_UNTEN = 130;
{
  let k = `<rect x="0" y="0" width="320" height="15" fill="${DECKE}"/>`;
  for (let x = 0; x <= 320; x += 40) k += `<line x1="${x}" y1="0" x2="${r(160 + (x - 160) * 1.04)}" y2="15" stroke="#c9ccc8" stroke-width=".4"/>`;
  k += `<line x1="0" y1="7" x2="320" y2="7" stroke="#c9ccc8" stroke-width=".35"/>`;
  for (const x of [40, 200]) k += `<rect x="${x + 3}" y="7.8" width="34" height="5.6" rx=".4" fill="#fbfdff"/><rect x="${x + 3}" y="7.8" width="34" height="5.6" fill="${S.lg("panel", [[0, "#ffffff"], [1, "#e6eef3"]])}"/>`;
  k += `<rect x="0" y="14.4" width="320" height="1.6" fill="#cfd3cf"/>`;
  /* Rückwand mit weichem Licht */
  k += `<rect x="0" y="16" width="320" height="${WAND_UNTEN - 16}" fill="${WAND}"/>`;
  k += `<rect x="0" y="16" width="320" height="${WAND_UNTEN - 16}" fill="${S.rg("wandlicht", [[0, "#ffffff", 0.6], [1, "#ffffff", 0]], 0.3, 0.3, 0.7)}"/>`;
  /* Akzentfläche in Petrol hinter dem Stuhl (Praxis-Farbkonzept) */
  k += `<rect x="70" y="16" width="150" height="${WAND_UNTEN - 16}" fill="${S.lg("akzent", [[0, "#cfe6e6"], [1, "#b9d8d9"]])}"/>`;
  k += `<rect x="70" y="16" width="1" height="${WAND_UNTEN - 16}" fill="#a9c9ca"/><rect x="219" y="16" width="1" height="${WAND_UNTEN - 16}" fill="#a9c9ca"/>`;
  /* Sockelleiste */
  k += `<rect x="0" y="${WAND_UNTEN - 3}" width="320" height="3" fill="#c7ccca"/>`;
  /* Boden: hellgrauer Praxis-Vinylboden mit Bahnen in Fluchtperspektive */
  k += `<rect x="0" y="${WAND_UNTEN}" width="320" height="${200 - WAND_UNTEN}" fill="${S.lg("boden", [[0, "#c8cdcc"], [1, "#aeb5b4"]])}"/>`;
  for (let i = -8; i <= 8; i++) k += `<line x1="${160 + i * 24}" y1="${WAND_UNTEN}" x2="${160 + i * 62}" y2="200" stroke="#98a09f" stroke-width=".3" opacity=".7"/>`;
  let sp = "";
  for (let i = 0; i < 70; i++) { const y = WAND_UNTEN + 1 + rnd() * 69; sp += `<circle cx="${r(rnd() * 320)}" cy="${r(y)}" r="${r(0.15 + rnd() * 0.25)}" fill="${rnd() < 0.5 ? "#8e9796" : "#e4e8e7"}" opacity=".35"/>`; }
  k += sp;
  k += `<rect x="0" y="${WAND_UNTEN}" width="320" height="${200 - WAND_UNTEN}" fill="${S.lg("bodenlicht", [[0, "#000", 0.14], [0.35, "#000", 0], [1, "#fff", 0.08]])}"/>`;
  S.hinten(k);
}

/* =====================================================================
   1 — DAS FENSTER (links, mit Lamellen, dahinter Bäume)
   ===================================================================== */
{
  let k = `<rect x="-26" y="-33" width="52" height="66" rx="1" fill="#e9ecea"/>`;
  k += `<rect x="-23" y="-30" width="46" height="60" fill="${S.lg("himmel", [[0, "#a9d2ef"], [0.6, "#d7ecf6"], [1, "#eef6ee"]])}"/>`;
  /* Bäume und Haus gegenüber */
  k += `<path d="M-23 18 Q-18 4 -10 10 Q-6 0 2 8 Q8 2 12 10 Q18 6 23 12 L23 30 L-23 30 Z" fill="#7fb06a"/>`;
  k += `<path d="M-23 22 Q-14 14 -4 20 Q6 14 23 20 L23 30 L-23 30 Z" fill="#5f9150"/>`;
  k += `<rect x="6" y="-2" width="15" height="14" fill="#e9d9c0"/><path d="M4 -2 L13.5 -9 L23 -2 Z" fill="#b5553f"/>`;
  for (const [x, y] of [[9, 2], [15, 2], [9, 7], [15, 7]]) k += `<rect x="${x}" y="${y}" width="3" height="3" fill="#7d9bb0"/>`;
  /* Fensterflügel: Rahmen, Griff, Spiegelung */
  k += `<rect x="-23" y="-30" width="46" height="60" fill="${GLAS}"/>`;
  k += `<rect x="-23" y="-30" width="46" height="60" fill="none" stroke="#f7f8f7" stroke-width="2.2"/>`;
  k += `<rect x="-1" y="-30" width="2" height="60" fill="#f7f8f7"/><rect x="2" y="-2" width="1" height="5" rx=".4" fill="#b8bfc2"/>`;
  k += `<path d="M-21 -28 L-12 -28 L-21 -10 Z" fill="#fff" opacity=".35"/>`;
  /* Lamellenvorhang oben halb heruntergelassen */
  for (let y = -30; y < -12; y += 2) k += `<rect x="-24" y="${y}" width="48" height="1.6" rx=".3" fill="${S.lg("lamelle", [[0, "#fbfbf8"], [1, "#dcdcd6"]])}"/>`;
  k += `<rect x="-25" y="-32" width="50" height="2.4" rx=".6" fill="#d8dcd9"/>`;
  k += `<line x1="20" y1="-30" x2="20" y2="-6" stroke="#bfc4c2" stroke-width=".3"/>`;
  /* Fensterbank */
  k += `<rect x="-28" y="31" width="56" height="2.6" rx=".5" fill="#f4f4f1"/><rect x="-28" y="33.4" width="56" height=".8" fill="#c6cbc8"/>`;
  /* Pflanze auf der Fensterbank */
  k += `<path d="M-19 31 L-18 25 L-12 25 L-11 31 Z" fill="#d8d3c8"/>`;
  for (const [a, l] of [[-40, 7], [-15, 9], [10, 8], [35, 6]]) k += `<path d="M-15 25 q${r(Math.sin(a * Math.PI / 180) * l * 0.5)} ${-l * 0.6} ${r(Math.sin(a * Math.PI / 180) * l)} ${-l}" stroke="#4f8a46" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
  S.teil({ id: "fenster", de: "das Fenster", syl: "FENS-ter", it: "la finestra", itSyl: "fi-NE-stra", en: "window", x: 32, y: 60, kunst: k });
}

/* =====================================================================
   2 — DIE UHR (Wand, zwischen Monitor und Schränken)
   ===================================================================== */
{
  let k = `<circle r="7" fill="#e8ecec" stroke="#9aa5a8" stroke-width=".8"/><circle r="6" fill="${S.rg("ziffer", [[0, "#ffffff"], [1, "#eef1f1"]])}"/>`;
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; k += `<line x1="${r(Math.sin(a) * 5.2)}" y1="${r(-Math.cos(a) * 5.2)}" x2="${r(Math.sin(a) * (i % 3 ? 4.6 : 4))}" y2="${r(-Math.cos(a) * (i % 3 ? 4.6 : 4))}" stroke="#2b3236" stroke-width="${i % 3 ? 0.3 : 0.6}"/>`; }
  /* halb elf */
  k += `<line x1="0" y1="0" x2="${r(Math.sin(10.5 * Math.PI / 6) * 3)}" y2="${r(-Math.cos(10.5 * Math.PI / 6) * 3)}" stroke="#1f2427" stroke-width=".8" stroke-linecap="round"/>`;
  k += `<line x1="0" y1="0" x2="0" y2="4.4" stroke="#1f2427" stroke-width=".5" stroke-linecap="round"/><circle r=".6" fill="#c0392b"/>`;
  S.teil({ id: "uhr", de: "die Uhr", syl: "UHR", it: "l'orologio", itSyl: "o-ro-LO-gio", en: "clock", x: 222, y: 30, kunst: k });
}

/* =====================================================================
   3 — DER SCHRANK (Praxiszeile rechts) — Lupe mit den Dingen darauf
   ===================================================================== */
const SCH = { x0: 228, x1: 320, plat: 92, fuss: 134 };
const schrankUnter = [];
{
  const cx = (SCH.x0 + SCH.x1) / 2, W = SCH.x1 - SCH.x0;
  const L = (x) => r(x - cx), T = (y) => r(y - SCH.fuss);
  let k = "";
  /* Hängeschränke oben, weiß hochglänzend, grifflos */
  k += `<rect x="${L(SCH.x0 + 10)}" y="${T(20)}" width="${W - 10}" height="34" fill="${WEISS}"/>`;
  for (let i = 0; i < 3; i++) {
    const x = SCH.x0 + 11 + i * 27;
    k += `<rect x="${L(x)}" y="${T(21)}" width="26" height="32" rx=".5" fill="${S.lg("front", [[0, "#ffffff"], [1, "#eceff0"]])}" stroke="#d6dbdc" stroke-width=".3"/>`;
    k += `<rect x="${L(x + 2)}" y="${T(51.2)}" width="22" height=".8" rx=".3" fill="#c5ccce"/>`;
  }
  k += `<path d="M${L(SCH.x0 + 13)} ${T(23)} L${L(SCH.x0 + 22)} ${T(23)} L${L(SCH.x0 + 13)} ${T(40)} Z" fill="#fff" opacity=".7"/>`;
  k += `<rect x="${L(SCH.x0 + 10)}" y="${T(54)}" width="${W - 10}" height="1.2" fill="#fff6d8" opacity=".9"/>`;
  /* Glasrückwand zwischen Ober- und Unterschrank */
  k += `<rect x="${L(SCH.x0)}" y="${T(55)}" width="${W}" height="${SCH.plat - 55}" fill="${S.lg("glasrueck", [[0, "#e7f0f0"], [1, "#d3e0e0"]])}"/>`;
  k += `<rect x="${L(SCH.x0)}" y="${T(55)}" width="${W}" height="${SCH.plat - 55}" fill="${S.lg("unterlicht", [[0, "#fff8e0", 0.5], [0.5, "#fff8e0", 0]])}"/>`;
  /* Arbeitsplatte (Mineralwerkstoff) */
  k += `<path d="M${L(SCH.x0 - 1)} ${T(SCH.plat)} L${L(SCH.x1)} ${T(SCH.plat)} L${L(SCH.x1)} ${T(SCH.plat + 4)} L${L(SCH.x0 - 2)} ${T(SCH.plat + 4)} Z" fill="${S.lg("platte", [[0, "#f6f7f6"], [1, "#d9dedd"]])}"/>`;
  k += `<rect x="${L(SCH.x0 - 2)}" y="${T(SCH.plat + 4)}" width="${W + 2}" height="1.6" fill="#c5cccb"/>`;
  /* Unterschränke mit Schubladen, Sockel */
  k += `<rect x="${L(SCH.x0)}" y="${T(SCH.plat + 5.6)}" width="${W}" height="${SCH.fuss - SCH.plat - 9.6}" fill="${WEISS}"/>`;
  const sp = [SCH.x0, SCH.x0 + 30, SCH.x0 + 60, SCH.x1];
  for (let i = 0; i < 3; i++) {
    const a = sp[i] + 0.8, b = sp[i + 1] - 0.8;
    if (i < 2) {
      for (const [y0, h] of [[SCH.plat + 6.6, 8], [SCH.plat + 15.4, 10], [SCH.plat + 26.2, 11]]) {
        k += `<rect x="${L(a)}" y="${T(y0)}" width="${r(b - a)}" height="${h}" rx=".5" fill="${S.lg("lade", [[0, "#ffffff"], [1, "#e9edee"]])}" stroke="#d3d9da" stroke-width=".3"/>`;
        k += `<rect x="${L(a + 2)}" y="${T(y0 + 0.4)}" width="${r(b - a - 4)}" height=".7" rx=".3" fill="#b9c2c4"/>`;
      }
    } else {
      /* Tür unter dem Waschbecken */
      k += `<rect x="${L(a)}" y="${T(SCH.plat + 6.6)}" width="${r(b - a)}" height="30.6" rx=".5" fill="${S.lg("lade", [[0, "#ffffff"], [1, "#e9edee"]])}" stroke="#d3d9da" stroke-width=".3"/>`;
      k += `<rect x="${L(a + 2)}" y="${T(SCH.plat + 7)}" width="${r(b - a - 4)}" height=".7" rx=".3" fill="#b9c2c4"/>`;
    }
  }
  k += `<rect x="${L(SCH.x0)}" y="${T(SCH.fuss - 4)}" width="${W}" height="4" fill="#9aa3a4"/>`;
  k += `<rect x="${L(SCH.x0)}" y="${T(SCH.plat + 5.6)}" width="${W}" height="2.2" fill="#000" opacity=".06"/>`;

  /* --- die Dinge (unter-Teile): Zahnmodell, Zahnbürste, Terminkarte,
         Maskenbox, Handschuhbox, Desinfektionsspender --- */
  const P = SCH.plat + 0.6;
  const unter = (id, de, syl, it, itSyl, en, x, y, kunst, fl, tipp) => {
    k += `<g transform="translate(${L(x)} ${T(y)})">${kunst}</g>`;
    schrankUnter.push({ id, de, syl, it, itSyl, en, x, y, kunst: fl, tipp });
  };
  /* DAS ZAHNMODELL — Ober- und Unterkiefer mit Gelenk */
  {
    let g = schatten(0, 0, 7, .8, .25);
    g += `<rect x="-6" y="-2" width="12" height="2" rx=".6" fill="#3f6f8a"/>`;
    g += `<path d="M-5.6 -2 Q-5.6 -5.6 0 -5.8 Q5.6 -5.6 5.6 -2 Z" fill="#e88d8d"/>`;
    for (let i = 0; i < 8; i++) g += `<rect x="${r(-5 + i * 1.28)}" y="${r(-7.4 + Math.abs(i - 3.5) * 0.18)}" width="1.1" height="2.2" rx=".45" fill="#fbf8f0" stroke="#d7d0c0" stroke-width=".1"/>`;
    g += `<path d="M-5.6 -11 Q-5.6 -7.6 0 -7.4 Q5.6 -7.6 5.6 -11 Z" fill="#e88d8d"/>`;
    for (let i = 0; i < 8; i++) g += `<rect x="${r(-5 + i * 1.28)}" y="-9.4" width="1.1" height="2.1" rx=".45" fill="#fffdf6" stroke="#d7d0c0" stroke-width=".1"/>`;
    g += `<rect x="-6" y="-13" width="12" height="2" rx=".6" fill="#3f6f8a"/><circle cx="5.6" cy="-7" r="1" fill="#9aa3aa"/>`;
    unter("za_zahnmodell", "das Zahnmodell", "ZAHN-mo-dell", "il modello dei denti", "mo-DEL-lo dei DEN-ti", "tooth model", SCH.x0 + 9, P, g,
      flaeche(-7, -14, 14, 15), "Am Zahnmodell zeigt die Zahnärztin, wie man richtig putzt.");
  }
  /* DIE ZAHNBÜRSTE — liegt vor dem Modell (zum Vorführen) */
  {
    let g = `<path d="M-6 -.6 L5 -1.2 L5.4 -.2 L-6 .3 Z" fill="#2f86c7"/><path d="M4.6 -1.6 L8.4 -1.8 L8.6 -.6 L4.8 -.4 Z" fill="#f1f3f4"/>`;
    for (let i = 0; i < 5; i++) g += `<line x1="${r(5 + i * 0.75)}" y1="${r(-1.7)}" x2="${r(5 + i * 0.75)}" y2="-2.8" stroke="${i % 2 ? "#ffffff" : "#5cc2e8"}" stroke-width=".45"/>`;
    g += `<path d="M-5 -.4 L-1 -.6" stroke="#fff" stroke-width=".3" opacity=".6"/>`;
    unter("zahnbuerste", "die Zahnbürste", "ZAHN-bürs-te", "lo spazzolino", "spaz-zo-LI-no", "toothbrush", SCH.x0 + 21, P + 0.2, g,
      flaeche(-6.5, -6, 15.5, 7), "Zweimal am Tag Zähne putzen, je zwei Minuten.");
  }
  /* DER TERMIN — Terminkarte im Aufsteller */
  {
    let g = schatten(0, 0, 4.5, .6, .2);
    g += `<path d="M-4.4 0 L-3.6 -9 L4.4 -9 L3.6 0 Z" fill="#c9d4d6" opacity=".6"/>`;
    g += `<rect x="-4" y="-9.6" width="8" height="5.6" rx=".3" fill="#ffffff" stroke="#9fb6bc" stroke-width=".2"/>`;
    g += `<rect x="-4" y="-9.6" width="8" height="1.5" rx=".3" fill="#2c7393"/>`;
    g += `<text x="0" y="-8.4" font-size="1.05" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">Ihr Termin</text>`;
    g += `<text x="0" y="-6.4" font-size="1" text-anchor="middle" fill="#28414a" font-family="Arial">Di 14.10.</text><text x="0" y="-4.9" font-size="1" text-anchor="middle" fill="#28414a" font-family="Arial">9:30 Uhr</text>`;
    for (let i = 0; i < 4; i++) g += `<rect x="${r(-3.6 + i * 0.25)}" y="${r(-3.6 + i * 0.6)}" width="7.2" height="1" fill="#fff" stroke="#c2ced1" stroke-width=".12"/>`;
    unter("za_termin", "der Termin", "Ter-MIN", "l'appuntamento", "ap-pun-ta-MEN-to", "appointment", SCH.x0 + 33, P, g,
      flaeche(-5, -10.5, 10, 11), "Auf der Karte steht der nächste Termin zur Kontrolle.");
  }
  /* DER MUNDSCHUTZ — Spenderbox mit OP-Masken */
  {
    let g = schatten(0, 0, 7, .7, .25);
    g += `<rect x="-6.4" y="-7.4" width="12.8" height="7.4" rx=".4" fill="${S.lg("box1", [[0, "#ffffff"], [1, "#dfe7ea"]])}" stroke="#b6c4c9" stroke-width=".2"/>`;
    g += `<rect x="-6.4" y="-3.4" width="12.8" height="1.4" fill="#5aa6c8"/><text x="0" y="-1" font-size="1.2" text-anchor="middle" fill="#2b5566" font-family="Arial">50 Masken</text>`;
    g += `<path d="M-4 -7.4 Q-3.6 -10 -1 -10.4 L2.6 -10.4 Q4.4 -10 4.2 -7.4 Z" fill="#8fd0ea"/>`;
    for (let i = 0; i < 3; i++) g += `<line x1="-2.6" y1="${r(-9.6 + i * 0.7)}" x2="3" y2="${r(-9.6 + i * 0.7)}" stroke="#6bb6d6" stroke-width=".18"/>`;
    g += `<path d="M-1 -10.4 q-2.6 -1 -3.4 1" stroke="#e8f2f5" stroke-width=".3" fill="none"/>`;
    unter("za_mundschutz", "der Mundschutz", "MUND-schutz", "la mascherina", "ma-sche-RI-na", "face mask", SCH.x0 + 46, P, g,
      flaeche(-7, -11, 14, 11.5));
  }
  /* DER HANDSCHUH — Box mit Einmal-Handschuhen (Nitril, blau) */
  {
    let g = schatten(0, 0, 7, .7, .25);
    g += `<rect x="-6.4" y="-7.4" width="12.8" height="7.4" rx=".4" fill="${S.lg("box2", [[0, "#3b6fb6"], [1, "#2a5390"]])}"/>`;
    g += `<text x="0" y="-2.6" font-size="1.4" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">NITRIL · M</text>`;
    g += `<path d="M-2.6 -7.4 q.4 -2.4 2 -2.6 q.6 -1.6 1.4 -.3 q1 -.6 1.4 .6 q.8 .2 .6 2.3 Z" fill="#8ab8e6"/>`;
    g += `<path d="M-1.2 -9.4 l0 -1.2 M.4 -10 l.2 -1.2" stroke="#8ab8e6" stroke-width=".7" stroke-linecap="round"/>`;
    unter("handschuh", "der Handschuh", "HAND-schuh", "il guanto", "GUAN-to", "glove", SCH.x0 + 60, P, g,
      flaeche(-7, -11.5, 14, 12), "Für jeden Patienten neue Handschuhe — wegen der Hygiene.");
  }
  /* DAS DESINFEKTIONSMITTEL — Wandspender über dem Waschbecken */
  {
    let g = `<rect x="-3.6" y="-15" width="7.2" height="15" rx="1" fill="${WEISS_H}" stroke="#b9c3c5" stroke-width=".25"/>`;
    g += `<rect x="-2.6" y="-12" width="5.2" height="6.4" rx=".4" fill="#e9f2f4" stroke="#c6d3d6" stroke-width=".2"/>`;
    g += `<rect x="-2.6" y="-9" width="5.2" height="3.4" fill="#9fd3e6" opacity=".8"/>`;
    g += `<path d="M-3.4 -3 L3.4 -3 L4.6 -1.4 L1.8 -1.4 L1 .2 L-1 .2 L-1.8 -1.4 L-4.6 -1.4 Z" fill="#7f8b90"/>`;
    g += `<text x="0" y="-13" font-size="1" text-anchor="middle" fill="#2c7393" font-family="Arial" font-weight="bold">DESINFEKTION</text>`;
    unter("desinfektionsmittel", "das Desinfektionsmittel", "des-in-fek-TI-ons-mit-tel", "il disinfettante", "di-sin-fet-TAN-te", "disinfectant", SCH.x0 + 80, 76, g,
      flaeche(-4.6, -15.5, 9.2, 16), "Vor jeder Behandlung desinfiziert man die Hände.");
  }
  S.teil({ id: "schrank", de: "der Schrank", syl: "SCHRANK", it: "l'armadio", itSyl: "ar-MA-dio", en: "cabinet", x: cx, y: SCH.fuss, steht: true, kunst: k,
    zoom: { x: SCH.x0 - 4, y: 52, w: 96, h: 64 },
    unter: schrankUnter,
    tipp: "In den Schubladen liegen Instrumente, Watte und Masken." });
}

/* =====================================================================
   4 — DAS WASCHBECKEN (in der Arbeitsplatte, mit Sensor-Armatur)
   ===================================================================== */
{
  let k = `<path d="M-11 0 L11 0 L10 3.2 Q0 5.2 -10 3.2 Z" fill="${S.lg("becken", [[0, "#ffffff"], [1, "#cfd8da"]])}"/>`;
  k += `<ellipse cx="0" cy=".5" rx="10" ry="1.2" fill="#c3ced1"/><ellipse cx="0" cy=".5" rx="8.6" ry=".8" fill="#dfe7e9"/>`;
  k += `<path d="M5 0 L5 -9 Q5 -11 3 -11 L-1 -11 L-1 -9.8 L3 -9.8 Q3.8 -9.8 3.8 -9 L3.8 0 Z" fill="${STAHL}"/>`;
  k += `<rect x="-1.4" y="-10.4" width="1.4" height="1.6" rx=".3" fill="#9aa3aa"/><circle cx="4.4" cy="-6" r=".5" fill="#2c3539"/>`;
  k += `<path d="M-.7 -8.8 L-.7 -1" stroke="#cfeaf5" stroke-width=".5" opacity=".7"/>`;
  S.teil({ oben: true, id: "waschbecken", de: "das Waschbecken", syl: "WASCH-be-cken", it: "il lavandino", itSyl: "la-van-DI-no", en: "sink", x: 302, y: SCH.plat, kunst: k + flaeche(-11, -12, 22, 16),
    tipp: "Das Wasser kommt ohne Anfassen — ein Sensor schaltet es ein." });
}

/* =====================================================================
   5 — DER BILDSCHIRM (am Deckenarm) und 6 — DAS RÖNTGENBILD darauf
   ===================================================================== */
const MON = { x: 168, y: 52 };
{
  let k = `<rect x="-1" y="-52" width="2" height="22" fill="${STAHL}"/><rect x="-5" y="-53" width="10" height="2" rx=".6" fill="#d7dcdd"/>`;
  k += `<path d="M-1 -31 L-1 -26 L1 -26 L1 -31 Z" fill="#9aa3aa"/><circle cy="-29" r="1.6" fill="#c9cfd4"/>`;
  k += `<rect x="-24" y="-16" width="48" height="30" rx="1.6" fill="${S.lg("monrahmen", [[0, "#3a4045"], [1, "#1c2024"]])}"/>`;
  k += `<rect x="-22.4" y="-14.4" width="44.8" height="25" fill="#0c0f11"/>`;
  k += `<rect x="-24" y="12" width="48" height="2" rx=".8" fill="#2a2f33"/><circle cx="20" cy="13" r=".4" fill="#5cd68a"/>`;
  k += flaeche(-24, -16, 48, 3) + flaeche(-24, 11, 48, 3);
  S.teil({ id: "bildschirm", de: "der Bildschirm", syl: "BILD-schirm", it: "lo schermo", itSyl: "SCHER-mo", en: "screen", x: MON.x, y: MON.y, kunst: k });
}
{
  /* Panoramaaufnahme (OPG): beide Kiefer, Zähne hell, Wurzeln, ein Füllungs-Fleck */
  let k = `<rect x="-22.4" y="-14.4" width="44.8" height="25" fill="${S.rg("roe", [[0, "#3b4248"], [0.7, "#1c2125"], [1, "#0d1012"]], 0.5, 0.45, 0.65)}"/>`;
  k += `<path d="M-19 -9 Q0 -1 19 -9" stroke="#55606a" stroke-width="3" fill="none" opacity=".7"/>`;
  k += `<path d="M-18 6 Q0 -3 18 6" stroke="#55606a" stroke-width="3" fill="none" opacity=".7"/>`;
  for (let i = 0; i < 14; i++) {
    const t = -1 + (i + 0.5) * (2 / 14), x = t * 17, yo = -6.6 + t * t * 4.6, yu = 0.6 + t * t * -2.2 + 2.4;
    const w = Math.abs(t) > 0.55 ? 2.2 : 1.6;
    k += `<path d="M${r(x - w / 2)} ${r(yo + 1.4)} L${r(x - w / 2 + 0.2)} ${r(yo - 3.6)} Q${r(x)} ${r(yo - 5)} ${r(x + w / 2 - 0.2)} ${r(yo - 3.6)} L${r(x + w / 2)} ${r(yo + 1.4)} Z" fill="#e8ecee" opacity=".88"/>`;
    k += `<path d="M${r(x - w / 2)} ${r(yu - 1)} L${r(x - w / 2 + 0.2)} ${r(yu + 3.4)} Q${r(x)} ${r(yu + 4.8)} ${r(x + w / 2 - 0.2)} ${r(yu + 3.4)} L${r(x + w / 2)} ${r(yu - 1)} Z" fill="#e2e7ea" opacity=".85"/>`;
  }
  k += `<rect x="9.6" y="-6.4" width="1.6" height="1.2" fill="#ffffff"/><circle cx="-11" cy="1.4" r=".7" fill="#fff"/>`;
  k += `<rect x="-22.4" y="-14.4" width="44.8" height="2.4" fill="#2b3338"/><text x="-21" y="-12.6" font-size="1.5" fill="#b8c7cf" font-family="Arial">OPG · Patientin M. · 03.10.</text>`;
  k += `<path d="M-22 -14 L-8 -14 L-22 2 Z" fill="#fff" opacity=".06"/>`;
  S.teil({ oben: true, id: "za_roentgenbild", de: "das Röntgenbild", syl: "RÖNT-gen-bild", it: "la radiografia", itSyl: "ra-dio-gra-FI-a", en: "X-ray", x: MON.x, y: MON.y, kunst: k,
    tipp: "Auf dem Röntgenbild sieht man auch die Wurzeln der Zähne." });
}

/* =====================================================================
   6b — DAS RÖNTGENGERÄT (Dentalröntgen an der Wand, Scherenarm, Tubus)
   ===================================================================== */
{
  let k = `<rect x="-6" y="-14" width="12" height="18" rx="1.2" fill="${WEISS}" stroke="#c3cacc" stroke-width=".3"/>`;
  k += `<rect x="-3.6" y="-10" width="7.2" height="3.6" rx=".4" fill="#1d2a30"/><text x="0" y="-7.6" font-size="1.6" text-anchor="middle" fill="#7cff8a" font-family="monospace">0.08s</text>`;
  k += `<circle cx="-2" cy="-2" r=".9" fill="#f2b233"/><circle cx="2" cy="-2" r=".9" fill="#9aa3aa"/>`;
  k += `<path d="M5 0 L16 8 L6 16 L14 22" stroke="${WEISS_H}" stroke-width="2.6" fill="none" stroke-linejoin="round"/>`;
  k += `<path d="M5 0 L16 8 L6 16 L14 22" stroke="#c3cacc" stroke-width=".4" fill="none" transform="translate(.8 .8)"/>`;
  for (const [x, y] of [[16, 8], [6, 16]]) k += `<circle cx="${x}" cy="${y}" r="1.6" fill="#e1e5e6" stroke="#b9c1c3" stroke-width=".3"/>`;
  /* Strahlerkopf mit Tubus, schräg nach unten */
  k += `<g transform="rotate(28 14 24)"><rect x="8" y="20" width="12" height="9" rx="3" fill="${WEISS}" stroke="#c3cacc" stroke-width=".3"/>`;
  k += `<rect x="11" y="29" width="6" height="7" rx=".8" fill="${S.lg("tubus", [[0, "#d9dfe1"], [1, "#9aa3aa"]], 0, 0, 1, 0)}"/><rect x="11" y="35" width="6" height="1.2" fill="#30363b"/>`;
  k += `<circle cx="14" cy="24.4" r="1.4" fill="none" stroke="#f2b233" stroke-width=".4"/></g>`;
  S.teil({ id: "roentgengeraet", de: "das Röntgengerät", syl: "RÖNT-gen-ge-rät", it: "l'apparecchio radiografico", itSyl: "ap-pa-REC-chio ra-dio-GRA-fi-co", en: "X-ray machine", x: 202, y: 74, kunst: k,
    tipp: "Beim Röntgen trägt man oft eine Schutzschürze aus Blei." });
}

/* =====================================================================
   7 — DIE LAMPE (Behandlungsleuchte am Deckenarm)
   ===================================================================== */
const MUND = { x: 80, y: 136 };   // Mund der Patientin (Ziel von Licht und Händen)
{
  let k = `<rect x="22" y="-75" width="12" height="2.4" rx=".8" fill="#d7dcdd"/><rect x="26.6" y="-73" width="2.8" height="26" fill="${WEISS_H}"/>`;
  k += `<circle cx="28" cy="-46" r="2.4" fill="#e1e5e6" stroke="#b9c1c3" stroke-width=".3"/>`;
  k += `<path d="M28 -46 L6 -12" stroke="#e9edee" stroke-width="3.2" stroke-linecap="round"/><path d="M28 -46 L6 -12" stroke="#c4cbcd" stroke-width=".5" transform="translate(1.2 .4)"/>`;
  k += `<circle cx="6" cy="-12" r="2" fill="#d7dcdd"/>`;
  /* Leuchtenkopf, leicht zur Patientin geneigt */
  k += `<g transform="rotate(-12 0 -4)">`;
  k += `<rect x="-13" y="-9" width="26" height="9" rx="4.4" fill="${S.lg("lampkopf", [[0, "#ffffff"], [0.6, "#e7ebec"], [1, "#c3cacc"]])}"/>`;
  k += `<rect x="-11" y="-1.6" width="22" height="2.4" rx="1.2" fill="#fffbe8"/>`;
  for (let i = 0; i < 5; i++) k += `<circle cx="${-8 + i * 4}" cy="-.4" r=".9" fill="#ffffff"/>`;
  k += `<rect x="-2.6" y="-11.4" width="5.2" height="2.6" rx="1" fill="#c9d0d2"/><rect x="11" y="-6" width="3.4" height="1.6" rx=".8" fill="#3f8fae"/>`;
  k += `</g>`;
  /* Lichtkegel zum Mund (fängt keine Tipps) */
  const dx = MUND.x - 72, dy = MUND.y - 90;
  k += `<path d="M-10 2 L${dx - 8} ${dy - 2} L${dx + 9} ${dy - 2} L11 -2 Z" fill="${S.lg("kegel", [[0, "#fff6d0", 0.32], [1, "#fff6d0", 0.04]])}" pointer-events="none"/>`;
  S.teil({ id: "lampe", de: "die Lampe", syl: "LAM-pe", it: "la lampada", itSyl: "LAM-pa-da", en: "lamp", x: 72, y: 90, kunst: k,
    tipp: "Die helle Lampe leuchtet in den Mund — ohne zu blenden." });
}

/* =====================================================================
   8 — DIE SPEISCHALE (Wassereinheit an der Kopfseite) und DER BECHER
   ===================================================================== */
{
  let k = schatten(0, 0, 9, 1.2, .25);
  /* Säule der Wassereinheit (hinter dem Stuhl) */
  k += `<path d="M-4 0 L-4 -30 Q-4 -33 -1 -33 L4 -33 L4 0 Z" fill="${WEISS_H}"/>`;
  k += `<rect x="-4" y="-22" width="8" height=".6" fill="#c9d0d2"/>`;
  /* Schale aus Glas/Keramik */
  k += `<path d="M-10 -41 Q-10 -33 0 -33 Q10 -33 10 -41 Z" fill="${S.lg("schale", [[0, "#e9f4f7"], [0.5, "#bfdde6"], [1, "#8fbccb"]], 0, 0, 1, 0)}"/>`;
  k += `<ellipse cx="0" cy="-41" rx="10" ry="1.8" fill="#f4fafb" stroke="#a9c8d2" stroke-width=".3"/>`;
  k += `<ellipse cx="0" cy="-40.6" rx="7.6" ry="1" fill="#cfe5ec"/><ellipse cx="0" cy="-40.4" rx="1.2" ry=".4" fill="#6f8f9a"/>`;
  k += `<path d="M-8 -39.6 Q-8 -35 -3 -34" stroke="#fff" stroke-width=".6" opacity=".7" fill="none"/>`;
  /* Spülauslauf in die Schale */
  k += `<path d="M7 -41 L7 -45 Q7 -46.6 5.2 -46.6 L2.6 -46.6" stroke="${STAHL}" stroke-width="1.1" fill="none"/>`;
  k += `<path d="M2.4 -46 q-.4 2 .2 4" stroke="#bfe6f5" stroke-width=".5" opacity=".8" fill="none"/>`;
  /* Becherfüller (Arm) rechts */
  k += `<rect x="10" y="-43" width="6.4" height="2" rx=".8" fill="${WEISS_H}"/><rect x="14.2" y="-42" width="1.2" height="1.4" fill="#9aa3aa"/>`;
  k += `<rect x="10.2" y="-33.6" width="6" height="1.4" rx=".5" fill="#d5dbdc"/>`;
  S.teil({ id: "za_speischale", de: "die Speischale", syl: "SPEI-scha-le", it: "la bacinella", itSyl: "ba-ci-NEL-la", en: "spittoon", x: 98, y: 166, steht: true, kunst: k,
    tipp: "In die Speischale spuckt man das Wasser nach dem Ausspülen." });
}
{
  let k = `<path d="M-2.2 -6.4 L2.2 -6.4 L1.7 0 L-1.7 0 Z" fill="${S.lg("becher", [[0, "#ffffff"], [0.6, "#eef3f4"], [1, "#c9d3d6"]], 0, 0, 1, 0)}" stroke="#b6c2c5" stroke-width=".15"/>`;
  k += `<ellipse cx="0" cy="-6.4" rx="2.2" ry=".5" fill="#d9eef5"/><path d="M-1.6 -5.6 L-1.2 -.6" stroke="#fff" stroke-width=".35"/>`;
  S.teil({ oben: true, id: "becher", de: "der Becher", syl: "BE-cher", it: "il bicchiere", itSyl: "bic-CHIE-re", en: "cup", x: 111.2, y: 166 - 34.2, kunst: k + flaeche(-3, -7.6, 6, 8),
    tipp: "Mit dem Wasser aus dem Becher spült man den Mund aus." });
}

/* =====================================================================
   9 — DIE ZAHNARZTHELFERIN (gegenüber, hinter dem Stuhl, sitzt)
   ===================================================================== */
const HELF_HAND = { x: 133, y: 121 };
/* Assistenzhocker unter der Helferin (gehört zu ihrer Zeichnung, steht hinter dem Stuhl) */
function hocker2(m) {
  const sx = m.z.sitz.x * m.k, sy = m.z.sitz.y * m.k + 1;
  let g = schatten(sx, 0, 10, 1, .25);
  for (const dx of [-9, 9, -5, 5]) g += `<path d="M${r(sx)} -2.6 L${r(sx + dx)} -.6" stroke="#3a4045" stroke-width="1.3" stroke-linecap="round"/><circle cx="${r(sx + dx)}" cy="-.3" r="1" fill="#22272b"/>`;
  g += `<rect x="${r(sx - 1.2)}" y="${r(sy)}" width="2.4" height="${r(-sy - 2)}" fill="${STAHL}"/>`;
  g += `<rect x="${r(sx - 6)}" y="${r(sy + 8)}" width="12" height="1" rx=".5" fill="#9aa3aa"/>`;
  g += `<path d="M${r(sx - 8)} ${r(sy + 1)} Q${r(sx - 8)} ${r(sy - 2)} ${r(sx - 4)} ${r(sy - 2)} L${r(sx + 5)} ${r(sy - 2)} Q${r(sx + 8)} ${r(sy - 2)} ${r(sx + 8)} ${r(sy + 1)} Z" fill="${POLSTER}"/>`;
  return g;
}
{
  const m = B.mensch({ id: "b03a_helf", geschlecht: "w", pose: "b03a_reichen", blick: -72, frisur: "dutt", haarfarbe: "blond", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "tshirt", farbe: "#5aa6b8" }, unterteil: { stueck: "hose", farbe: "weiss" }, schuhe: { stueck: "turnschuh" } } }, 86);
  const h = m.z.handR.y < m.z.handL.y ? m.z.handR : m.z.handL;
  const x = HELF_HAND.x - h.x * m.k, y = HELF_HAND.y - h.y * m.k;
  S.teil({ id: "za_helferin", de: "die Zahnarzthelferin", syl: "ZAHN-arzt-hel-fe-rin", it: "l'assistente dentale", itSyl: "as-si-STEN-te den-TA-le", en: "dental assistant", x, y,
    kunst: hocker2(m) + m.svg + maske(m, "#9fd6ea"),
    tipp: "Heute heißt der Beruf „Zahnmedizinische Fachangestellte“ (ZFA)." });
}

/* =====================================================================
   10 — DER SAUGER (Helferinnen-Element mit den Saugschläuchen)
   ===================================================================== */
{
  let k = `<path d="M-6 3 L-18 6 L-25 14" stroke="${WEISS_H}" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="-18" cy="6" r="1.4" fill="#d5dbdc"/>`;
  k += `<rect x="-8" y="-1" width="15" height="6" rx="1.6" fill="${WEISS_H}" stroke="#c3cacc" stroke-width=".25"/>`;
  /* drei Halter mit Schläuchen: großer Sauger, Speichelsauger, Luft-Wasser-Spritze */
  const sch = [[-5, "#9aa3aa", 2, "#2f86c7", 6.5], [-0.5, "#c8ced1", 1.3, "#e9eef0", 5], [3.8, "#7d868d", 1.1, "#d5dadc", 4.6]];
  sch.forEach(([x, f, d, kan, l]) => {
    k += `<path d="M${x} 5 Q${x - 1} 14 ${x + 4} 17" stroke="${f}" stroke-width="${d}" fill="none" stroke-linecap="round"/>`;
    k += `<rect x="${x - d / 2}" y="${-l}" width="${d}" height="${l}" rx="${d / 2}" fill="${kan}" stroke="#7d868d" stroke-width=".15"/>`;
  });
  k += `<path d="M-6.6 -.4 L-6.6 4" stroke="#fff" stroke-width=".4" opacity=".7"/>`;
  S.teil({ oben: true, id: "sauger", de: "der Sauger", syl: "SAU-ger", it: "l'aspiratore", itSyl: "a-spi-ra-TO-re", en: "suction", x: 128, y: 124, kunst: k,
    tipp: "Der Sauger saugt Wasser und Speichel aus dem Mund." });
}

/* =====================================================================
   11 — DER HOCKER des Zahnarztes (rollbar, vorne links)
   ===================================================================== */
const HOCKER = { x: 34, y: 192, sitz: 160 };
{
  let k = schatten(0, 0, 16, 1.6, .3);
  /* Fünfstern mit Rollen */
  for (const [dx, dy] of [[-14, -1], [14, -1], [-8, 1.2], [8, 1.2], [0, -2.4]]) {
    k += `<path d="M0 -4 L${dx} ${dy - 2}" stroke="${GRAU_D}" stroke-width="1.8" stroke-linecap="round"/>`;
    k += `<circle cx="${dx}" cy="${dy - 0.6}" r="1.5" fill="#22272b"/>`;
  }
  /* Gasfeder */
  k += `<rect x="-1.6" y="${-(HOCKER.y - HOCKER.sitz) + 3}" width="3.2" height="${HOCKER.y - HOCKER.sitz - 6}" fill="${STAHL}"/>`;
  k += `<rect x="-2.4" y="-12" width="4.8" height="8" rx="1" fill="#30363b"/>`;
  /* Sitzpolster (Sattelform) und Hebel */
  const sy = -(HOCKER.y - HOCKER.sitz);
  k += `<path d="M-12 ${sy} Q-12 ${sy - 4} -6 ${sy - 4} L8 ${sy - 4.6} Q13 ${sy - 4.6} 13 ${sy - 0.6} Q13 ${sy + 1.6} 9 ${sy + 1.6} L-9 ${sy + 1.6} Q-12 ${sy + 1.6} -12 ${sy} Z" fill="${POLSTER}"/>`;
  k += `<path d="M-10 ${sy - 3} L9 ${sy - 3.6}" stroke="#7cc1da" stroke-width=".6" opacity=".6"/>`;
  k += `<path d="M5 ${sy + 2} L12 ${sy + 4}" stroke="#30363b" stroke-width=".8" stroke-linecap="round"/>`;
  S.teil({ id: "hocker", de: "der Hocker", syl: "HO-cker", it: "lo sgabello", itSyl: "sga-BEL-lo", en: "stool", x: HOCKER.x, y: HOCKER.y, kunst: k });
}

/* =====================================================================
   12 — DER BEHANDLUNGSSTUHL (Patientenstuhl, Seitenansicht)
   ===================================================================== */
const STUHL = { x: 128, y: 182 };
/* Oberkante der Polster (lokal): Kopfstütze → Rücken → Sitz → Beinauflage.
   Abgenommen an der liegenden Patientin (Hinterkopf, Schulterblatt, Lende,
   Gesäß, Kniekehle, Wade, Ferse), damit sie wirklich aufliegt. */
const KONTUR = [[-70, -40.4], [-55, -40.4], [-51, -37.4], [-39, -33.2], [-26, -28.2], [-18, -23.6], [4, -24.4], [10, -22.6], [30, -18.6], [48, -17.4]];
{
  let k = schatten(-6, 0, 44, 2.4, .32);
  /* Bodenplatte */
  k += `<path d="M-34 0 L30 0 Q32 0 31 -2.4 L29 -4 L-30 -4 Q-35 -4 -34 0 Z" fill="${WEISS}"/>`;
  k += `<rect x="-30" y="-4" width="59" height="1" fill="#fff"/>`;
  /* Hubsäule (schräg, wie bei modernen Einheiten) */
  k += `<path d="M-16 -4 L4 -4 L10 -15 L-8 -15 Z" fill="${WEISS_H}"/>`;
  k += `<path d="M-12 -4 L-5 -15" stroke="#c7cecf" stroke-width=".5"/>`;
  /* Unterschale unter dem Polster, Polster, Lichtkante */
  const linie = (dy, umk) => (umk ? KONTUR.slice().reverse() : KONTUR).map(([x, y], i) => `${i ? "L" : ""}${x} ${r(y + dy)}`).join(" ");
  k += `<path d="M${linie(4).slice(0)} L48 -11 Q30 -11 10 -15.6 L-18 -15.6 L-51 -30 L-55 -33 L-68 -33.4 Q-70 -33.6 -70 -35 Z" fill="${WEISS_H}" stroke="#c3cacc" stroke-width=".3"/>`;
  k += `<path d="M${linie(-0.8)} Q51 -17.6 50.6 -14.4 ${"L" + linie(4.2, true)} Q-72.4 -38 -70 -41.2 Z" fill="${POLSTER}"/>`;
  k += `<path d="M${KONTUR[0][0] + 2} ${KONTUR[0][1] - 0.3} ${KONTUR.slice(1).map(([x, y]) => `L${x} ${r(y - 0.3)}`).join(" ")}" stroke="#7cc1da" stroke-width=".7" fill="none" opacity=".75"/>`;
  /* Fugen: Kopfstütze | Rücken | Sitz | Beinteil */
  for (const x of [-53, -18, 4]) { const y = KONTUR.find((p) => p[0] >= x)[1]; k += `<path d="M${x} ${r(y - 0.6)} L${x + 0.4} ${r(y + 4)}" stroke="#14465c" stroke-width=".6"/>`; }
  /* Kopfstützen-Bügel */
  k += `<path d="M-60 -35 L-52 -31" stroke="#9aa3aa" stroke-width="1.4"/>`;
  /* Fußauflage-Schutz (Folie) */
  k += `<path d="M36 -18.6 L48 -18.2 L48 -14 L36 -14.4 Z" fill="#e9eff1" opacity=".55"/>`;
  S.teil({ id: "za_behandlungsstuhl", de: "der Behandlungsstuhl", syl: "Be-HAND-lungs-stuhl", it: "la poltrona odontoiatrica", itSyl: "pol-TRO-na o-don-to-IA-tri-ca", en: "dental chair", x: STUHL.x, y: STUHL.y, steht: true, kunst: k,
    tipp: "Der Stuhl fährt hoch und kippt nach hinten — so liegt man bequem." });
}

/* =====================================================================
   13 — DIE PATIENTIN (liegt auf dem Stuhl, bekleidet, mit Serviette)
   ===================================================================== */
{
  const m = B.mensch({ id: "b03a_pat", geschlecht: "w", pose: "b03a_liegen", blick: 90, frisur: "pony", haarfarbe: "dunkelbraun", haut: "mittel",
    kleidung: { oberteil: { stueck: "pullover", farbe: "#c9667a" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" } } }, 94);
  /* Gesäß auf den Sitz, Kopf auf die Kopfstütze */
  const sx = STUHL.x - 14, sy = STUHL.y - 27.6;
  const x = sx - m.z.sitz.x * m.k, y = sy - m.z.sitz.y * m.k;
  const P = m.z.punkte;
  if (process.env.B03A_DEBUG) for (const n of ["hinterkopf", "nacken", "schulterblatt", "ruecken", "lende", "gesaess", "kniekehleL", "wadeL", "ferseL", "kniekehleR", "wadeR", "ferseR", "handL", "handR"]) console.log(n, r(x + P[n][0] * m.k - STUHL.x), r(y + P[n][1] * m.k - STUHL.y));
  S.teil({ id: "za_patient", de: "die Patientin", syl: "Pa-ti-EN-tin", it: "la paziente", itSyl: "pa-ZIEN-te", en: "patient", x, y, kunst: m.svg,
    tipp: "Die Patientin sagt: „Mein Zahn tut weh.“" });
  if (process.env.B03A_DEBUG) console.log("Mund", r(x + P.mund[0] * m.k), r(y + P.mund[1] * m.k));
}

/* =====================================================================
   14 — DAS TABLETT auf dem Arztelement (Lupe) und 15 — DER BOHRER
   ===================================================================== */
const EL = { x: 196, y: 123 };   // Oberkante Arztelement
const tablettUnter = [];
{
  let k = "";
  /* Schwenkarm vom Stuhlfuß hinauf zum Element */
  /* Schwenkarm: vom Fuß der Hubsäule schräg hinauf, Gelenk, dann zum Element */
  const ax = STUHL.x + 28 - EL.x, ay = STUHL.y - 4 - EL.y;
  k += `<path d="M${ax} ${ay} L${ax + 10} ${ay - 22} L4 11" stroke="${WEISS_H}" stroke-width="3.4" fill="none" stroke-linejoin="round" stroke-linecap="round"/>`;
  k += `<path d="M${ax + 1} ${ay} L${ax + 11} ${ay - 22}" stroke="#c3cacc" stroke-width=".5"/><circle cx="${ax + 10}" cy="${ay - 22}" r="2.2" fill="#e1e5e6" stroke="#b9c1c3" stroke-width=".3"/>`;
  /* Element: Gehäuse mit Bedienfeld */
  k += `<path d="M-20 0 L22 0 L21 9 Q20 11 17 11 L-17 11 Q-20 11 -20 8 Z" fill="${WEISS}" stroke="#c3cacc" stroke-width=".3"/>`;
  k += `<rect x="12" y="3" width="7" height="4.4" rx=".6" fill="#1d2a30"/><rect x="12.8" y="3.6" width="5.4" height="2.6" rx=".3" fill="#4fb6d8"/>`;
  k += `<text x="15.5" y="5.6" font-size="1.4" text-anchor="middle" fill="#fff" font-family="Arial">40k</text>`;
  /* Tablett obenauf (leicht von oben gesehen) */
  k += `<path d="M-19 0 L17 0 L15 -5 L-17 -5 Z" fill="${S.lg("tabl", [[0, "#dfe5e7"], [1, "#b8c1c4"]])}" stroke="#9aa3aa" stroke-width=".25"/>`;
  k += `<path d="M-18 -.6 L16.4 -.6 L14.6 -4.4 L-16.4 -4.4 Z" fill="${S.lg("tabli", [[0, "#cfe7ee"], [1, "#e9f3f6"]])}"/>`;
  /* Instrumente auf dem Tablett (liegen quer) */
  const T = -4.2;
  const inst = [
    ["za_mundspiegel", "der Mundspiegel", "MUND-spie-gel", "lo specchietto", "spec-CHIET-to", "mouth mirror", -13.6,
      `<path d="M-3.4 .2 L1.6 -.6" stroke="#aeb6bd" stroke-width=".55" stroke-linecap="round"/><ellipse cx="2.4" cy="-.8" rx="1.1" ry=".7" fill="#dfeef4" stroke="#7d868d" stroke-width=".25"/>`,
      "Mit dem Mundspiegel sieht die Zahnärztin auch die Rückseite der Zähne."],
    ["sonde", "die Sonde", "SON-de", "la sonda", "SON-da", "dental probe", -8,
      `<path d="M-3 .2 L2 -.4 Q3 -.6 3 -1.4" stroke="#aeb6bd" stroke-width=".5" fill="none" stroke-linecap="round"/><path d="M-1.6 0 L.4 -.2" stroke="#7d868d" stroke-width=".8"/>`, null],
    ["pinzette", "die Pinzette", "pin-ZET-te", "la pinzetta", "pin-ZET-ta", "tweezers", -2.6,
      `<path d="M-3 0 L2.8 -.8 M-3 0 L2.8 .1" stroke="#c9cfd4" stroke-width=".45" stroke-linecap="round"/>`, null],
    ["za_zahnzange", "die Zahnzange", "ZAHN-zan-ge", "la pinza", "PIN-za", "forceps", 2.8,
      `<path d="M-3 -.4 Q0 -.6 1.6 -.2 L3 -1.2 M-3 .4 Q0 .5 1.6 .1 L3 -.6" stroke="#b5bcc2" stroke-width=".55" fill="none" stroke-linecap="round"/>`, null],
    ["za_spritze", "die Spritze", "SPRIT-ze", "la siringa", "si-RIN-ga", "syringe", 8.4,
      `<rect x="-3" y="-.9" width="4.6" height="1.6" rx=".4" fill="#dfe5e8" stroke="#8a949b" stroke-width=".2"/><rect x="-2.2" y="-.6" width="2.4" height="1" fill="#f1c9cf" opacity=".9"/><path d="M1.6 -.1 L3.6 -.1" stroke="#7d868d" stroke-width=".25"/><path d="M-3 -.1 L-4 -.1 M-4 -.8 L-4 .6" stroke="#8a949b" stroke-width=".4"/>`,
      "Mit der Spritze wird der Zahn betäubt — dann tut es nicht weh."],
    ["watterolle", "die Watterolle", "WAT-te-rol-le", "il rotolino di cotone", "ro-to-LI-no di co-TO-ne", "cotton roll", 13.2,
      `<rect x="-2.2" y="-1.1" width="3.4" height="1.2" rx=".6" fill="#ffffff" stroke="#d8dcdf" stroke-width=".12"/><rect x="-1.6" y="-.4" width="3.4" height="1.2" rx=".6" fill="#fbfbfb" stroke="#d8dcdf" stroke-width=".12"/>`, null],
  ];
  inst.forEach(([id, de, syl, it, itSyl, en, x, svg, tipp]) => {
    k += `<g transform="translate(${x} ${T + 1.6})">${svg}</g>`;
    tablettUnter.push({ id, de, syl, it, itSyl, en, tipp, x: EL.x + x, y: EL.y + T + 2.6, kunst: flaeche(-2.7, -3.4, 5.4, 4.6, 0.8) });
  });
  S.teil({ id: "tablett", de: "das Tablett", syl: "tab-LETT", it: "il vassoio", itSyl: "vas-SO-io", en: "tray", x: EL.x, y: EL.y, kunst: k,
    zoom: { x: EL.x - 22, y: EL.y - 12, w: 45, h: 30 },
    unter: tablettUnter,
    tipp: "Auf dem Tablett liegen die Instrumente bereit." });
}
{
  /* Handstücke in ihren Köchern an der Vorderkante, Schläuche hängen in Bögen */
  let k = "";
  const hs = [[-8, "#c9cfd4", "#2f86c7"], [-3, "#d4d9dd", "#d23b30"], [2, "#b5bcc2", "#3ca35a"]];
  hs.forEach(([x, f, ring], i) => {
    k += `<path d="M${x} 10 Q${x - 2} ${20 + i * 1.5} ${x + 6} ${22 + i}" stroke="#4a5257" stroke-width=".9" fill="none" stroke-linecap="round"/>`;
    k += `<path d="M${x - 0.8} 10.4 L${x - 0.8} 3 Q${x - 0.8} 1.4 ${x} 1 L${x + 1} 1.6 L${x + 0.9} 10.4 Z" fill="${f}" stroke="#8a949b" stroke-width=".15"/>`;
    k += `<rect x="${x - 0.85}" y="7" width="1.75" height=".8" fill="${ring}"/>`;
    if (i === 0) k += `<path d="M${x + 0.6} 1.2 L${x + 2.4} -.4 M${x + 2.4} -.4 L${x + 2.8} -.8" stroke="#8a949b" stroke-width=".35"/>`;
    k += `<path d="M${x - 0.4} 2.6 L${x - 0.4} 9" stroke="#fff" stroke-width=".25" opacity=".7"/>`;
  });
  S.teil({ oben: true, id: "za_bohrer", de: "der Bohrer", syl: "BOH-rer", it: "il trapano", itSyl: "TRA-pa-no", en: "drill", x: EL.x - 8, y: EL.y + 1, kunst: k,
    tipp: "Der Bohrer dreht sich bis zu 400 000 Mal pro Minute." });
}

/* =====================================================================
   16 — DER ZAHNARZT (sitzt hinter dem Kopf der Patientin, mit Mundschutz)
   ===================================================================== */
{
  const m = B.mensch({ id: "b03a_arzt", geschlecht: "m", pose: "b03a_behandeln", blick: 78, frisur: "kurz", haarfarbe: "grau", haut: "hell",
    kleidung: { oberteil: { stueck: "arztkittel" }, unterteil: { stueck: "hose", farbe: "weiss" }, schuhe: { stueck: "turnschuh" } } }, 104);
  /* Er sitzt auf dem Hocker: Sitzpunkt auf das Polster */
  const x = HOCKER.x - m.z.sitz.x * m.k, y = HOCKER.sitz - 3 - m.z.sitz.y * m.k;
  /* Mundspiegel in der vorderen Hand */
  const h = m.z.handR.x > m.z.handL.x ? m.z.handR : m.z.handL;
  const hx = h.x * m.k, hy = h.y * m.k;
  const mx = MUND.x - x, my = MUND.y - y;
  const spiegel = `<path d="M${r(hx)} ${r(hy)} L${r(mx)} ${r(my)}" stroke="#aeb6bd" stroke-width=".5" stroke-linecap="round"/><ellipse cx="${r(mx)}" cy="${r(my)}" rx=".8" ry=".5" fill="#dfeef4" stroke="#7d868d" stroke-width=".2"/>`;
  S.teil({ id: "za_zahnarzt", de: "der Zahnarzt", syl: "ZAHN-arzt", it: "il dentista", itSyl: "den-TI-sta", en: "dentist", x: x, y: y + (HOCKER.y - HOCKER.sitz) * 0, kunst: m.svg + maske(m, "#cfe8f1") + spiegel,
    tipp: "Der Zahnarzt sagt: „Bitte den Mund weit öffnen!“" });
  if (process.env.B03A_DEBUG) console.log("Hand Arzt", r(x + hx), r(y + hy), "Fuß", r(y));
}

/* =====================================================================
   17 — DER FUSSSCHALTER (am Boden, mit Kabel zum Stuhl)
   ===================================================================== */
{
  let k = schatten(0, 0, 8, 1, .3);
  k += `<path d="M-7 0 Q-8 -3.6 -4 -4.6 L4 -4.6 Q8 -3.6 7 0 Z" fill="${S.lg("fuss", [[0, "#6a737a"], [1, "#2f353b"]])}"/>`;
  k += `<ellipse cx="0" cy="-4.4" rx="4.6" ry="1.2" fill="#9aa3aa"/><ellipse cx="0" cy="-4.6" rx="3" ry=".7" fill="#c9cfd4"/>`;
  k += `<path d="M-6 -4.2 q0 -3 3 -3.6 L3 -7.8 q3 .6 3 3.6" stroke="#4a5257" stroke-width="1" fill="none"/>`;
  k += `<path d="M7 -1 Q16 -2 22 -4" stroke="#3a4045" stroke-width=".6" fill="none"/>`;
  S.teil({ id: "fussschalter", de: "der Fußschalter", syl: "FUSS-schal-ter", it: "il pedale", itSyl: "pe-DA-le", en: "foot control", x: 100, y: 195, kunst: k,
    tipp: "Mit dem Fuß steuert der Zahnarzt den Bohrer." });
}

/* =====================================================================
   18 — DER MÜLLEIMER (Treteimer aus Edelstahl, vorne rechts)
   ===================================================================== */
{
  let k = schatten(0, 0, 10, 1.3, .3);
  k += `<path d="M-8 0 L-8.6 -24 L8.6 -24 L8 0 Z" fill="${S.lg("eimer", [[0, "#8f989e"], [0.25, "#e8ecee"], [0.5, "#c3cacd"], [0.8, "#f2f4f5"], [1, "#9aa3a8"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-9 -24 Q-9 -28 0 -28.4 Q9 -28 9 -24 Z" fill="${S.lg("deckel", [[0, "#f4f6f7"], [1, "#b5bcc0"]])}"/>`;
  k += `<rect x="-9.2" y="-24.4" width="18.4" height="1" rx=".5" fill="#7d868b"/>`;
  k += `<rect x="-5" y="-1.4" width="10" height="2" rx=".8" fill="#2f353b"/>`;
  k += `<path d="M-6 -22 L-6.4 -2" stroke="#fff" stroke-width=".7" opacity=".6"/>`;
  S.teil({ id: "muelleimer", de: "der Mülleimer", syl: "MÜLL-ei-mer", it: "il cestino", itSyl: "ce-STI-no", en: "bin", x: 296, y: 190, kunst: k,
    tipp: "Den Treteimer öffnet man mit dem Fuß — die Hände bleiben sauber." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/zahnarzt.js"));
console.log(aus);
