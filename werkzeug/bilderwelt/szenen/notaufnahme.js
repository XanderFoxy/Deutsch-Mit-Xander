#!/usr/bin/env node
/* =====================================================================
   DIE NOTAUFNAHME (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (Infobroschüren zentraler Notaufnahmen für den Rettungs-
   dienst, z. B. Klinikverbund Allgäu; Flyer Manchester-Triage-System
   der Sana-Kliniken; Fachartikel Schockraum, Thieme):
   - Der Rettungswagen fährt rückwärts in die überdachte LIEGEND-
     ANFAHRT; durch eine automatische SCHIEBETÜR kommt die Trage direkt
     in den Schockraum bzw. zur Übergabe. Der Notarzt trägt die rot-
     gelbe Einsatzjacke mit Reflexstreifen und der Aufschrift NOTARZT.
   - Im SCHOCKRAUM: die Schockraumtrage, ein Monitor am Wandarm,
     Sauerstoff (Wandanschluss und weiße O2-Flasche), der rote
     NOTFALLWAGEN (Reanimationswagen) mit Schubladen und dem
     DEFIBRILLATOR obenauf, daneben Beatmungsbeutel, Halskrause,
     Verbandmaterial, Schere und Spritzen; eine große Uhr für die Zeit.
   - Für Patienten, die selbst kommen: die ANMELDUNG mit Glasscheibe,
     dort liegt die Einweisung vom Hausarzt; an der Wand die Tafel der
     ERSTEINSCHÄTZUNG (Manchester-Triage: Rot sofort, Orange 10 min,
     Gelb 30 min, Grün 90 min, Blau 120 min) und der WARTEBEREICH.
   Maßstab: Rückwand ≈ 46 Einheiten je Meter (Fuß bei y = 126), Trage
   ≈ 56 je Meter (y = 180), Notarzt vorn 1,82 m ≈ 58/m; der Rettungs-
   wagen steht draußen weiter weg (≈ 29/m).
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "notaufnahme", titel: "Die Notaufnahme", emoji: "🚑", thema: "Gesundheit", kuerzel: "b03d", fassung: 852 });
const rnd = zufall(112);
const r = B.r;

/* ---------- Grundfarben -------------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const WEISS = S.lg("weiss", [[0, "#ffffff"], [0.6, "#f2f4f4"], [1, "#d9dedf"]]);
const WEISS_H = S.lg("weissh", [[0, "#e3e7e8"], [0.35, "#ffffff"], [1, "#d3d9db"]], 0, 0, 1, 0);
const STAHL = S.lg("stahl", [[0, "#eef1f3"], [0.45, "#c9cfd4"], [0.55, "#b5bcc2"], [1, "#e1e5e8"]], 0, 0, 1, 0);
const ROT = S.lg("rot", [[0, "#e04a3b"], [0.6, "#c8352b"], [1, "#9e2a22"]]);
const GLAS = S.lg("glas", [[0, "#ffffff", 0.3], [0.5, "#e8f4f7", 0.06], [1, "#ffffff", 0.16]], 0, 0, 1, 1);

/* =====================================================================
   KULISSE — Decke mit Leuchten, Wand mit blauem Band, Boden, Türöffnung
   ===================================================================== */
const WAND_UNTEN = 126;
const TUER = { x0: 222, x1: 312, y0: 30 };
{
  let k = `<rect x="0" y="0" width="320" height="15" fill="${S.lg("decke", [[0, "#f1f2f1"], [1, "#e0e2e0"]])}"/>`;
  for (let x = 0; x <= 320; x += 40) k += `<line x1="${x}" y1="0" x2="${r(160 + (x - 160) * 1.04)}" y2="15" stroke="#c9ccc8" stroke-width=".4"/>`;
  for (const x of [20, 100, 180]) k += `<rect x="${x + 3}" y="7.8" width="34" height="5.6" rx=".4" fill="${S.lg("panel", [[0, "#ffffff"], [1, "#e6eef3"]])}"/>`;
  k += `<rect x="0" y="14.4" width="320" height="1.6" fill="#cfd3cf"/>`;
  k += `<rect x="0" y="16" width="320" height="${WAND_UNTEN - 16}" fill="${S.lg("wand", [[0, "#f5f6f5"], [1, "#e3e7e7"]])}"/>`;
  /* blaues Leitband und Stoßschutz */
  k += `<rect x="0" y="94" width="320" height="5" fill="#2f6db5"/><rect x="0" y="99" width="320" height="1" fill="#24568f"/>`;
  k += `<rect x="0" y="${WAND_UNTEN - 3}" width="320" height="3" fill="#a9b0b4"/>`;
  /* Wandversorgung Schockraum: O2 (weiß/blau), Druckluft, Vakuum (gelb) */
  k += `<rect x="134" y="80" width="40" height="11" rx="1.2" fill="${WEISS}" stroke="#c3cacc" stroke-width=".3"/>`;
  for (const [x, f, t] of [[138, "#2f6db5", "O₂"], [148, "#2a2a2a", "AIR"], [158, "#e3c13a", "VAC"]]) k += `<rect x="${x}" y="82.4" width="7" height="6.4" rx=".8" fill="#f4f5f4" stroke="${f}" stroke-width=".5"/><text x="${x + 3.5}" y="86.8" font-size="1.8" text-anchor="middle" fill="${f}" font-family="Arial" font-weight="bold">${t}</text>`;
  k += `<rect x="168" y="82.4" width="4" height="6.4" rx=".6" fill="#f4f5f4" stroke="#b9c0c2" stroke-width=".3"/>`;
  /* Boden: blaugrauer Vinyl mit Fugen */
  k += `<rect x="0" y="${WAND_UNTEN}" width="320" height="${200 - WAND_UNTEN}" fill="${S.lg("boden", [[0, "#bcc4c9"], [1, "#9faab1"]])}"/>`;
  for (let i = -8; i <= 8; i++) k += `<line x1="${160 + i * 24}" y1="${WAND_UNTEN}" x2="${160 + i * 62}" y2="200" stroke="#8c979e" stroke-width=".3" opacity=".7"/>`;
  for (const y of [WAND_UNTEN + 9, WAND_UNTEN + 22, WAND_UNTEN + 40, WAND_UNTEN + 63]) k += `<line x1="0" y1="${y}" x2="320" y2="${y}" stroke="#8c979e" stroke-width=".3" opacity=".5"/>`;
  /* gelbe Bodenmarkierung: Fahrweg der Trage von der Tür */
  k += `<path d="M${TUER.x0 + 4} ${WAND_UNTEN} L${TUER.x1 - 4} ${WAND_UNTEN} L${TUER.x1 + 30} 200 L${TUER.x0 - 40} 200 Z" fill="#f2d24a" opacity=".12"/>`;
  k += `<rect x="0" y="${WAND_UNTEN}" width="320" height="${200 - WAND_UNTEN}" fill="${S.lg("bodenlicht", [[0, "#000", 0.14], [0.35, "#000", 0], [1, "#fff", 0.08]])}"/>`;
  /* Türöffnung: draußen die überdachte Liegendanfahrt am Abend */
  const { x0, x1, y0 } = TUER;
  k += `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${WAND_UNTEN - y0}" fill="${S.lg("draussen", [[0, "#3f5f86"], [0.5, "#7a93ad"], [1, "#b7b0a2"]])}"/>`;
  k += `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="12" fill="#5d6770"/><rect x="${x0}" y="${y0 + 12}" width="${x1 - x0}" height="1.4" fill="#3f474e"/>`;
  for (const x of [x0 + 18, x0 + 48, x0 + 78]) k += `<rect x="${x}" y="${y0 + 12.6}" width="8" height="1.4" rx=".4" fill="#fff6cf"/>`;
  k += `<path d="M${x0} 112 L${x1} 112 L${x1} ${WAND_UNTEN} L${x0} ${WAND_UNTEN} Z" fill="${S.lg("asphalt", [[0, "#6e7176"], [1, "#55585c"]])}"/>`;
  k += `<path d="M${x0 + 8} 126 L${x0 + 26} 112 M${x1 - 8} 126 L${x1 - 26} 112" stroke="#e8e2c8" stroke-width=".6" opacity=".8"/>`;
  k += `<rect x="${x0}" y="104" width="${x1 - x0}" height="8" fill="#8d8a83"/><rect x="${x0 + 60}" y="70" width="3" height="42" fill="#9aa1a6"/>`;
  S.hinten(k);
}

/* =====================================================================
   1 — DIE SCHIEBETÜR (Glasflügel aufgefahren, Rahmen, Schild darüber)
   ===================================================================== */
{
  const { x0, x1, y0 } = TUER, W = x1 - x0, cx = (x0 + x1) / 2, H = WAND_UNTEN - y0;
  let k = "";
  /* Rahmen */
  k += `<rect x="${-W / 2 - 3}" y="${-H - 3}" width="${W + 6}" height="3" fill="#9aa3aa"/><rect x="${-W / 2 - 3}" y="${-H}" width="3" height="${H}" fill="#b5bcc2"/><rect x="${W / 2}" y="${-H}" width="3" height="${H}" fill="#b5bcc2"/>`;
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="5" fill="#d7dcdd"/><circle cx="0" cy="${-H + 2.5}" r="1" fill="#5cd68a"/>`;
  /* aufgefahrene Glasflügel links und rechts */
  for (const [a, b] of [[-W / 2, -W / 2 + 14], [W / 2 - 14, W / 2]]) {
    k += `<rect x="${a}" y="${-H + 5}" width="${b - a}" height="${H - 5}" fill="#dff0f4" opacity=".35" stroke="#9aa3aa" stroke-width=".8"/>`;
    k += `<path d="M${a + 2} ${-H + 8} L${a + 8} ${-H + 8} L${a + 2} ${-H + 40} Z" fill="#fff" opacity=".35"/>`;
    k += `<rect x="${a}" y="-46" width="${b - a}" height="2" fill="#2f6db5" opacity=".7"/>`;
  }
  /* Schild über der Tür */
  k += `<rect x="-26" y="${-H - 15}" width="52" height="10" rx="1" fill="#c8352b"/><text x="4" y="${-H - 8}" font-size="5" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">NOTAUFNAHME</text>`;
  k += `<rect x="-24" y="${-H - 13.4}" width="6.8" height="6.8" fill="#fff"/><rect x="-21.4" y="${-H - 12.6}" width="1.6" height="5.2" fill="#c8352b"/><rect x="-23.2" y="${-H - 10.8}" width="5.2" height="1.6" fill="#c8352b"/>`;
  S.teil({ id: "schiebetuer", de: "die Schiebetür", syl: "SCHIE-be-tür", it: "la porta scorrevole", itSyl: "POR-ta scor-RE-vo-le", en: "sliding door", x: cx, y: WAND_UNTEN, kunst: k,
    tipp: "Die Schiebetür geht von selbst auf — die Trage passt gut hindurch." });
}

/* =====================================================================
   2 — DER RETTUNGSWAGEN (draußen, rückwärts angefahren, Hecktüren offen)
   ===================================================================== */
{
  let k = schatten(0, 0, 38, 2, .35);
  /* Kofferaufbau von hinten */
  k += `<rect x="-34" y="-78" width="68" height="70" rx="3" fill="${S.lg("rtw", [[0, "#ffffff"], [0.7, "#f1f1ee"], [1, "#d5d7d6"]], 0, 0, 1, 0)}"/>`;
  /* Innenraum durch die offenen Hecktüren: Trage-Tisch, Schränke, Licht */
  k += `<rect x="-22" y="-70" width="44" height="58" fill="${S.lg("innen", [[0, "#f6f9fb"], [1, "#c8d6de"]])}"/>`;
  k += `<rect x="-20" y="-68" width="40" height="16" fill="#e6eef2" stroke="#b5c4cc" stroke-width=".3"/>`;
  for (let i = 0; i < 4; i++) k += `<rect x="${-19 + i * 10}" y="-66" width="8.6" height="12" rx=".5" fill="#fff" stroke="#c3cfd5" stroke-width=".25"/>`;
  k += `<rect x="-14" y="-30" width="28" height="4" rx="1" fill="#2f353b"/><rect x="-12" y="-34" width="24" height="4.4" rx="1.6" fill="#f2a65a"/>`;
  k += `<rect x="-22" y="-14" width="44" height="2.4" fill="#9aa3aa"/>`;
  /* geöffnete Hecktüren links und rechts */
  for (const s of [-1, 1]) {
    const a = s * 22, b = s * 36;
    k += `<path d="M${a} -72 L${b} -76 L${b} -10 L${a} -12 Z" fill="${S.lg("hecktuer", [[0, "#ffffff"], [1, "#dcdedd"]])}" stroke="#b9bdbd" stroke-width=".3"/>`;
    k += `<path d="M${a} -34 L${b} -35 L${b} -27 L${a} -26 Z" fill="#e85a1f"/><path d="M${a} -26 L${b} -27 L${b} -23 L${a} -22 Z" fill="#d6332b"/>`;
    k += `<path d="M${a + s * 2} -66 L${b - s * 2} -69 L${b - s * 2} -50 L${a + s * 2} -48 Z" fill="#9fb6c4" opacity=".8"/>`;
  }
  /* Leuchtstreifen am Koffer, Blaulichter, Rückleuchten, Stoßfänger, Räder */
  k += `<rect x="-34" y="-80" width="68" height="3" rx="1.4" fill="#e9eaea"/>`;
  k += `<text x="0" y="-73" font-size="3.4" text-anchor="middle" fill="#c8352b" font-family="Arial" font-weight="bold">RETTUNGSDIENST</text>`;
  for (const x of [-30, 26]) k += `<rect x="${x}" y="-20" width="4" height="7" rx=".8" fill="#c0392b"/><rect x="${x}" y="-13" width="4" height="2.4" rx=".6" fill="#f2b233"/>`;
  k += `<rect x="-35" y="-9" width="70" height="4" rx="1" fill="#3a3f44"/><rect x="-8" y="-9" width="16" height="2" fill="#5a6066"/>`;
  for (const x of [-26, 26]) k += `<rect x="${x - 5}" y="-6" width="10" height="6" rx="2.4" fill="#1f2326"/>`;
  S.teil({ id: "na_rettungswagen", de: "der Rettungswagen", syl: "RET-tungs-wa-gen", it: "l'ambulanza", itSyl: "am-bu-LAN-za", en: "ambulance", x: 258, y: 118, kunst: k,
    tipp: "Der Rettungswagen (RTW) bringt Notfälle direkt an die Notaufnahme." });
}
{
  /* DAS BLAULICHT — zwei blaue Rundumleuchten auf dem Dach (blinkend) */
  let k = "";
  for (const x of [-28, 28]) {
    k += `<rect x="${x - 4}" y="-1.6" width="8" height="1.6" rx=".4" fill="#4a5258"/>`;
    k += `<path d="M${x - 3.4} -1.6 L${x - 3} -5.4 Q${x} -6.6 ${x + 3} -5.4 L${x + 3.4} -1.6 Z" fill="${S.lg("blau", [[0, "#7fb6ff"], [1, "#1e5fd6"]], 0, 0, 1, 0)}"/>`;
    k += `<ellipse cx="${x}" cy="-3.6" rx="7" ry="3" fill="#5aa0ff" opacity=".28" pointer-events="none"><animate attributeName="opacity" values=".05;.45;.05" dur="1s" begin="${x < 0 ? 0 : 0.5}s" repeatCount="indefinite"/></ellipse>`;
  }
  S.teil({ oben: true, id: "blaulicht", de: "das Blaulicht", syl: "BLAU-licht", it: "il lampeggiante blu", itSyl: "lam-peg-GIAN-te BLU", en: "blue light", x: 258, y: 38.4, kunst: k + flaeche(-33, -7, 66, 7.4),
    tipp: "Mit Blaulicht und Martinshorn haben Rettungswagen Vorfahrt." });
}

/* =====================================================================
   3 — DIE UHR (große Wanduhr mit Sekundenzeiger)
   ===================================================================== */
{
  let k = `<circle r="8" fill="#e8ecec" stroke="#5a636b" stroke-width="1"/><circle r="7" fill="#ffffff"/>`;
  for (let i = 0; i < 60; i++) { const a = i * Math.PI / 30, l = i % 5 ? 0.5 : 1.3; k += `<line x1="${r(Math.sin(a) * 6.6)}" y1="${r(-Math.cos(a) * 6.6)}" x2="${r(Math.sin(a) * (6.6 - l))}" y2="${r(-Math.cos(a) * (6.6 - l))}" stroke="#222" stroke-width="${i % 5 ? 0.12 : 0.4}"/>`; }
  k += `<line x1="0" y1="0" x2="${r(Math.sin(8.75 * Math.PI / 6) * 3.6)}" y2="${r(-Math.cos(8.75 * Math.PI / 6) * 3.6)}" stroke="#111" stroke-width=".9" stroke-linecap="round"/>`;
  k += `<line x1="0" y1="0" x2="${r(Math.sin(45 * Math.PI / 30) * 5.4)}" y2="${r(-Math.cos(45 * Math.PI / 30) * 5.4)}" stroke="#111" stroke-width=".6" stroke-linecap="round"/>`;
  k += `<line x1="0" y1="1.4" x2="0" y2="-5.8" stroke="#c8352b" stroke-width=".25"><animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="60s" repeatCount="indefinite"/></line><circle r=".6" fill="#c8352b"/>`;
  S.teil({ id: "uhr", de: "die Uhr", syl: "UHR", it: "l'orologio", itSyl: "o-ro-LO-gio", en: "clock", x: 154, y: 32, kunst: k,
    tipp: "Im Notfall zählt jede Minute — die Uhr hat einen Sekundenzeiger." });
}

/* =====================================================================
   4 — DER NOTRUF (Schild „Notruf 112“) und 5 — DIE ERSTEINSCHÄTZUNG
   ===================================================================== */
{
  let k = `<rect x="-14" y="-8" width="28" height="16" rx="1.4" fill="#c8352b"/><rect x="-13" y="-7" width="26" height="14" rx="1" fill="none" stroke="#fff" stroke-width=".4"/>`;
  k += `<path d="M-10 -3 q1.2 -2.6 3 -1 l-.8 1.4 q.4 1.8 2 2.6 l1.2 -1 q1.8 1.4 -.6 3 q-4.6 -.4 -4.8 -5 Z" fill="#fff"/>`;
  k += `<text x="3.4" y="-1.2" font-size="3" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">NOTRUF</text><text x="3.4" y="4.6" font-size="6" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">112</text>`;
  S.teil({ id: "na_notruf_na", de: "der Notruf", syl: "NOT-ruf", it: "la chiamata d'emergenza", itSyl: "chia-MA-ta d'e-mer-GEN-za", en: "emergency call", x: 196, y: 36, kunst: k,
    tipp: "Die Notrufnummer 112 gilt in ganz Europa — kostenlos." });
}
{
  const st = [["#d6332b", "ROT", "sofort"], ["#ee8a2a", "ORANGE", "10 Min."], ["#f2cf3a", "GELB", "30 Min."], ["#4fa85a", "GRÜN", "90 Min."], ["#3a7cc8", "BLAU", "120 Min."]];
  let k = `<rect x="-14" y="-20" width="28" height="40" rx="1" fill="#ffffff" stroke="#b9c1c5" stroke-width=".4"/>`;
  k += `<text x="0" y="-15.6" font-size="2.6" text-anchor="middle" fill="#1f2a33" font-family="Arial" font-weight="bold">Ersteinschätzung</text>`;
  k += `<text x="0" y="-12.6" font-size="1.6" text-anchor="middle" fill="#55626c" font-family="Arial">Wer zuerst dran ist</text>`;
  st.forEach(([f, n, t], i) => {
    const y = -10.4 + i * 5.8;
    k += `<rect x="-12" y="${r(y)}" width="24" height="5" rx=".6" fill="${f}"/><text x="-10.6" y="${r(y + 3.4)}" font-size="2.2" fill="${i === 2 ? "#3a3000" : "#fff"}" font-family="Arial" font-weight="bold">${n}</text><text x="10.6" y="${r(y + 3.4)}" font-size="2.2" text-anchor="end" fill="${i === 2 ? "#3a3000" : "#fff"}" font-family="Arial">${t}</text>`;
  });
  S.teil({ id: "na_ersteinschaetzung", de: "die Ersteinschätzung", syl: "ERST-ein-schät-zung", it: "il triage", itSyl: "TRI-age", en: "triage", x: 106, y: 60, kunst: k,
    tipp: "Nicht wer zuerst kommt, ist zuerst dran — sondern wer am kränksten ist." });
}

/* =====================================================================
   6 — DER MONITOR (Wandarm über dem Kopfende der Trage)
   ===================================================================== */
{
  let k = `<rect x="-3" y="-20" width="6" height="8" rx=".8" fill="#d7dcdd"/><path d="M0 -12 L0 -9" stroke="#b5bcc2" stroke-width="2"/>`;
  k += `<rect x="-17" y="-9" width="34" height="23" rx="1.6" fill="${S.lg("monr", [[0, "#3a4045"], [1, "#1c2024"]])}"/><rect x="-15.4" y="-7.4" width="26" height="19.4" fill="#06090b"/>`;
  let ekg = "M-15 -2"; for (let i = 0; i < 4; i++) { const x = -15 + i * 6.4; ekg += ` L${r(x + 2)} -2 L${r(x + 2.6)} -3 L${r(x + 3.1)} -2 L${r(x + 3.6)} -6.4 L${r(x + 4.1)} -.4 L${r(x + 4.6)} -2 L${r(x + 6.4)} -2`; }
  k += `<path d="${ekg}" stroke="#5cf07a" stroke-width=".4" fill="none"/>`;
  let ple = "M-15 5"; for (let i = 0; i < 8; i++) ple += ` q1.6 -2.4 3.2 0`;
  k += `<path d="${ple}" stroke="#54c6f0" stroke-width=".4" fill="none"/>`;
  k += `<text x="10" y="-2" font-size="3.4" text-anchor="end" fill="#5cf07a" font-family="Arial" font-weight="bold">88</text><text x="10" y="6" font-size="3" text-anchor="end" fill="#54c6f0" font-family="Arial" font-weight="bold">95</text><text x="-15" y="11" font-size="2" fill="#f0f0f0" font-family="Arial">NIBP 110/70</text>`;
  k += `<rect x="11.4" y="-7.4" width="4" height="19.4" fill="#2a3036"/>`;
  for (let i = 0; i < 4; i++) k += `<rect x="12" y="${-6.6 + i * 4.6}" width="2.8" height="3.4" rx=".4" fill="#4a5258"/>`;
  k += `<rect x="12" y="-6.6" width="2.8" height="3.4" rx=".4" fill="#d6332b"/>`;
  S.teil({ id: "na_monitor_na", de: "der Monitor", syl: "MO-ni-tor", it: "il monitor", itSyl: "MO-ni-tor", en: "monitor", x: 156, y: 62, kunst: k,
    tipp: "Der Monitor piept, wenn Herzschlag oder Sauerstoff nicht stimmen." });
}

/* =====================================================================
   7 — DIE ANMELDUNG (Tresen mit Glasscheibe) und 8 — DIE PFLEGERIN
   ===================================================================== */
const AN = { x0: 4, x1: 86, top: 92, fuss: 140 };
{
  /* Die Pflegerin steht hinter dem Tresen (zuerst, damit der Tresen sie unten verdeckt) */
  const m = B.mensch({ id: "b03d_pfl", geschlecht: "w", pose: "halten", blick: 22, frisur: "zopf", haarfarbe: "schwarz", haut: "oliv", laecheln: true,
    kleidung: { oberteil: { stueck: "tshirt", farbe: "#2f5f95" }, unterteil: { stueck: "hose", farbe: "#2f5f95" }, schuhe: { stueck: "turnschuh" } } }, 78);
  const P = m.z.punkte, k2 = m.k, br = [P.brust[0] * k2, P.brust[1] * k2];
  let ex = `<rect x="${r(br[0] + 1)}" y="${r(br[1] - 1.4)}" width="3.4" height="1.4" rx=".2" fill="#fff"/><rect x="${r(br[0] + 1.2)}" y="${r(br[1] - 1.2)}" width="1" height="1" fill="#c8352b"/>`;
  S.teil({ id: "na_pflegerin", de: "die Krankenpflegerin", syl: "KRAN-ken-pfle-ge-rin", it: "l'infermiera", itSyl: "in-fer-MIE-ra", en: "nurse", x: 26, y: 128, kunst: m.svg + ex,
    tipp: "Die Pflegerin fragt: „Was ist passiert? Wo tut es weh?“" });
}
{
  const cx = (AN.x0 + AN.x1) / 2, W = AN.x1 - AN.x0, H = AN.fuss - AN.top;
  let k = schatten(0, 0, W / 2 + 2, 1.4, .28);
  /* Tresen: weiße Front mit blauem Band, Ablage oben, Glasscheibe mit Durchreiche */
  k += `<rect x="${-W / 2}" y="${-H + 4}" width="${W}" height="${H - 4}" fill="${WEISS}"/>`;
  k += `<rect x="${-W / 2}" y="${-H + 16}" width="${W}" height="5" fill="#2f6db5"/>`;
  k += `<text x="0" y="${-H + 31}" font-size="5" text-anchor="middle" fill="#2f6db5" font-family="Arial" font-weight="bold">Anmeldung</text>`;
  k += `<text x="0" y="${-H + 36}" font-size="2.4" text-anchor="middle" fill="#55626c" font-family="Arial">Bitte hier melden</text>`;
  k += `<rect x="${-W / 2}" y="-3" width="${W}" height="3" fill="#a9b0b4"/>`;
  k += `<rect x="${-W / 2 - 1}" y="${-H}" width="${W + 2}" height="4" rx="1" fill="${S.lg("ablage", [[0, "#e6e9ea"], [1, "#b9c1c5"]])}"/>`;
  /* Rahmen der Glasscheibe (Glas selbst liegt vorn) */
  k += `<rect x="${-W / 2}" y="${-H - 50}" width="2" height="50" fill="#b5bcc2"/><rect x="${W / 2 - 2}" y="${-H - 50}" width="2" height="50" fill="#b5bcc2"/><rect x="${-W / 2}" y="${-H - 52}" width="${W}" height="2.4" fill="#b5bcc2"/>`;
  k += `<rect x="9" y="${-H - 50}" width="2" height="44" fill="#b5bcc2"/>`;
  k += `<path d="M-14 -${H} L-14 -${H - 0.01}" stroke="none"/><rect x="-16" y="${-H - 4}" width="16" height="4" rx="1" fill="#d7dcdd"/><path d="M-15 ${-H - 4} Q-8 ${-H - 9} -1 ${-H - 4} Z" fill="#c9cfd2"/>`;
  S.teil({ id: "na_anmeldung", de: "die Anmeldung", syl: "AN-mel-dung", it: "l'accettazione", itSyl: "ac-cet-ta-ZIO-ne", en: "reception desk", x: cx, y: AN.fuss, steht: true, kunst: k,
    tipp: "An der Anmeldung zeigt man die Versichertenkarte." });
  S.davor(`<rect x="${AN.x0 + 2}" y="${AN.top - 50}" width="${W - 4}" height="44" fill="${GLAS}" pointer-events="none"/><path d="M${AN.x0 + 50} ${AN.top - 48} L${AN.x0 + 62} ${AN.top - 48} L${AN.x0 + 50} ${AN.top - 26} Z" fill="#fff" opacity=".2" pointer-events="none"/>`);
}
{
  /* DIE EINWEISUNG — rosa Formular (Muster 2) auf der Ablage */
  let k = `<path d="M-6 0 L6 0 L5 -2.4 L-5.4 -2.4 Z" fill="#f4c9cf" stroke="#d48a96" stroke-width=".2"/>`;
  k += `<path d="M-4.6 -1.6 L3 -1.6 M-4.8 -.8 L4.2 -.8" stroke="#b05a68" stroke-width=".18"/>`;
  k += `<path d="M2 -2.6 L6 -3.4" stroke="#2f353b" stroke-width=".5" stroke-linecap="round"/>`;
  S.teil({ oben: true, id: "na_einweisung", de: "die Einweisung", syl: "EIN-wei-sung", it: "l'impegnativa", itSyl: "im-pe-GNA-ti-va", en: "referral note", x: 66, y: AN.top - 0.2, kunst: k + flaeche(-6.4, -4, 12.8, 4.4),
    tipp: "Mit der Einweisung schickt der Hausarzt den Patienten ins Krankenhaus." });
}

/* =====================================================================
   9 — DIE SAUERSTOFFFLASCHE (weiß, mit Druckminderer, im Wandhalter)
   ===================================================================== */
{
  let k = schatten(0, 0, 4.6, .7, .3);
  k += `<rect x="-3.6" y="-36" width="7.2" height="36" rx="3.4" fill="${S.lg("o2", [[0, "#d9dedf"], [0.35, "#ffffff"], [1, "#c9cfd2"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-3.6 -32 Q-3.6 -38 0 -38 Q3.6 -38 3.6 -32 Z" fill="#ffffff"/>`;
  k += `<text x="0" y="-20" font-size="2.6" text-anchor="middle" fill="#2f6db5" font-family="Arial" font-weight="bold">O₂</text><rect x="-3.4" y="-17" width="6.8" height="1" fill="#2f6db5"/>`;
  /* Druckminderer mit Manometer und Schlauch */
  k += `<rect x="-1.2" y="-42" width="2.4" height="4.4" fill="#b5bcc2"/><circle cx="2.6" cy="-42" r="2" fill="#f4f5f4" stroke="#5a636b" stroke-width=".35"/><line x1="2.6" y1="-42" x2="3.6" y2="-43.2" stroke="#c8352b" stroke-width=".25"/>`;
  k += `<path d="M-1.4 -40 Q-6 -36 -5 -26" stroke="#5aa0d6" stroke-width=".6" fill="none"/>`;
  k += `<rect x="-4.4" y="-24" width="8.8" height="2" rx=".5" fill="#5a636b"/>`;
  S.teil({ id: "sauerstoffflasche", de: "die Sauerstoffflasche", syl: "SAU-er-stoff-fla-sche", it: "la bombola di ossigeno", itSyl: "BOM-bo-la di os-SI-ge-no", en: "oxygen cylinder", x: 132, y: 150, kunst: k,
    tipp: "Medizinischer Sauerstoff kommt aus Flaschen mit weißer Schulter." });
}

/* =====================================================================
   10 — DER NOTFALLWAGEN (Lupe: Verband, Schere, Spritze, Beatmungsbeutel,
        Halskrause) und 11 — DER DEFIBRILLATOR obenauf
   ===================================================================== */
const NW = { x: 108, y: 160, b: 32, h: 46 };
const wagenUnter = [];
{
  const W = NW.b, H = NW.h;
  let k = schatten(0, 0, W / 2 + 2, 1.3, .3);
  for (const x of [-W / 2 + 2, W / 2 - 2]) k += `<circle cx="${x}" cy="-1.6" r="1.6" fill="#2f353b"/>`;
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="${H - 3}" rx="1.4" fill="${ROT}"/>`;
  const laden = [["Atemwege", 7], ["Kreislauf", 7], ["Medikamente", 7], ["Infusion", 9], ["Verband", 9]];
  let y = -H + 4;
  for (const [t, h] of laden) {
    k += `<rect x="${-W / 2 + 1.4}" y="${y}" width="${W - 2.8}" height="${h - 0.8}" rx=".6" fill="${S.lg("lade", [[0, "#e65a4a"], [1, "#c23a2e"]])}" stroke="#9e2a22" stroke-width=".3"/>`;
    k += `<rect x="-5" y="${y + 1}" width="10" height="2.2" rx=".3" fill="#fff"/><text x="0" y="${y + 2.7}" font-size="1.5" text-anchor="middle" fill="#9e2a22" font-family="Arial" font-weight="bold">${t}</text>`;
    k += `<rect x="-6" y="${y + h - 3}" width="12" height=".9" rx=".4" fill="#f2d0cb"/>`;
    y += h;
  }
  k += `<rect x="${-W / 2 - 1}" y="${-H - 1.6}" width="${W + 2}" height="2.4" rx=".8" fill="#e8ecee"/>`;
  k += `<path d="M${W / 2} ${-H + 2} l2.4 0 l0 10 l-2.4 0" stroke="#b5bcc2" stroke-width="1" fill="none"/>`;
  const P = -H - 1.6;
  const unter = (id, de, syl, it, itSyl, en, x, y, kunst, fl, tipp) => { k += `<g transform="translate(${x} ${y})">${kunst}</g>`; wagenUnter.push({ id, de, syl, it, itSyl, en, x: NW.x + x, y: NW.y + y, kunst: fl, tipp }); };
  /* DER VERBAND — Mullbinden-Rollen */
  unter("na_verband", "der Verband", "Ver-BAND", "la benda", "BEN-da", "bandage", 5, P,
    `<rect x="-2.4" y="-3.6" width="4.8" height="3.6" rx="1.6" fill="#ffffff" stroke="#d6d9d6" stroke-width=".2"/><ellipse cx="2.4" cy="-1.8" rx=".7" ry="1.8" fill="#eef0ee"/><rect x="-.6" y="-6.4" width="4.6" height="2.8" rx="1.3" fill="#fbfbf8" stroke="#d6d9d6" stroke-width=".2"/><path d="M2.2 -2 q2 1.6 3.8 1.8" stroke="#ffffff" stroke-width="1.2" fill="none"/>`,
    flaeche(-3, -7, 9, 7.4), "Mit dem Verband wird eine Wunde abgedeckt.");
  /* DIE SCHERE — Verbandschere mit abgewinkelter Spitze */
  unter("schere", "die Schere", "SCHE-re", "le forbici", "FOR-bi-ci", "scissors", 12, P,
    `<circle cx="-2" cy="-1" r="1" fill="none" stroke="#2f6db5" stroke-width=".6"/><circle cx="-2" cy="-3" r="1" fill="none" stroke="#2f6db5" stroke-width=".6"/><path d="M-1 -1.4 L3 -2.6 L3.8 -2 M-1 -2.6 L3 -2.2" stroke="#b5bcc2" stroke-width=".55" fill="none"/>`,
    flaeche(-3.4, -4.6, 7.8, 4.8));
  /* DER BEATMUNGSBEUTEL — hängt seitlich */
  unter("beatmungsbeutel", "der Beatmungsbeutel", "be-AT-mungs-beu-tel", "il pallone ambu", "pal-LO-ne AM-bu", "bag valve mask", W / 2 + 4, -H + 16,
    `<ellipse cx="0" cy="0" rx="2.6" ry="5" fill="${S.lg("beutel", [[0, "#f6e6a2"], [1, "#d8bf5a"]], 0, 0, 1, 0)}"/><rect x="-1.2" y="-7" width="2.4" height="2.4" fill="#5a636b"/><path d="M-2.6 -9.6 Q0 -11 2.6 -9.6 L1.6 -7 L-1.6 -7 Z" fill="#cfe7ef" opacity=".85" stroke="#7fb3c4" stroke-width=".25"/><path d="M0 5 L0 9" stroke="#9fc8de" stroke-width="1"/>`,
    flaeche(-3, -11, 6, 20.4), "Mit dem Beatmungsbeutel gibt man Luft, wenn jemand nicht atmet.");
  /* DIE SPRITZE */
  unter("na_spritze", "die Spritze", "SPRIT-ze", "la siringa", "si-RIN-ga", "syringe", -12, P,
    `<rect x="-3" y="-1.6" width="5.4" height="1.6" rx=".3" fill="#f2f5f6" stroke="#8a949b" stroke-width=".18"/><rect x="-2.2" y="-1.3" width="3" height="1" fill="#f6c25a"/><path d="M2.4 -.8 L4.8 -.8" stroke="#7d868d" stroke-width=".2"/><path d="M-3 -.8 L-4.2 -.8 M-4.2 -1.6 L-4.2 0" stroke="#8a949b" stroke-width=".35"/>`,
    flaeche(-4.6, -3, 9.6, 3.4), "Mit der Spritze bekommt der Patient ein Medikament.");
  /* DIE HALSKRAUSE — Stifneck, liegt hinten auf dem Wagen */
  unter("halskrause", "die Halskrause", "HALS-krau-se", "il collare cervicale", "col-LA-re cer-vi-CA-le", "neck brace", -3, P,
    `<path d="M-4.6 0 Q-5.4 -4.6 -2 -5 L2.6 -5 Q4.8 -4.6 4.2 0 Z" fill="#f2b233" stroke="#c98d1e" stroke-width=".2"/><path d="M-3 -1.4 Q0 -3 3 -1.4" stroke="#2f353b" stroke-width=".9" fill="none"/><circle cx="-1.4" cy="-3.8" r=".5" fill="#2f353b"/><circle cx="1.6" cy="-3.8" r=".5" fill="#2f353b"/>`,
    flaeche(-5, -5.6, 9.6, 6), "Die Halskrause hält den Kopf ruhig, wenn der Hals verletzt sein kann.");
  S.teil({ id: "notfallwagen", de: "der Notfallwagen", syl: "NOT-fall-wa-gen", it: "il carrello d'emergenza", itSyl: "car-REL-lo d'e-mer-GEN-za", en: "crash cart", x: NW.x, y: NW.y, steht: true, kunst: k,
    zoom: { x: NW.x - 22, y: NW.y - NW.h - 22, w: 48, h: 32 },
    unter: wagenUnter,
    tipp: "Im roten Notfallwagen ist alles für die Wiederbelebung." });
}
{
  /* DER DEFIBRILLATOR — auf dem Notfallwagen, mit Paddles und Display */
  let k = `<rect x="-9" y="-12" width="15" height="12" rx="1.4" fill="${S.lg("defi", [[0, "#f6d43a"], [1, "#d9b21e"]])}" stroke="#a88a12" stroke-width=".3"/>`;
  k += `<rect x="-7.6" y="-10.6" width="8" height="5.6" rx=".4" fill="#0b0f12"/><path d="M-7.2 -7.6 L-5.6 -7.6 L-5 -9.6 L-4.4 -6 L-3.8 -7.6 L.2 -7.6" stroke="#5cf07a" stroke-width=".3" fill="none"/>`;
  k += `<circle cx="3.4" cy="-8.6" r="1.4" fill="#d6332b"/><circle cx="3.4" cy="-4.4" r="1" fill="#2f353b"/><text x="-3.6" y="-2" font-size="1.4" text-anchor="middle" fill="#2f353b" font-family="Arial" font-weight="bold">DEFI</text>`;
  k += `<path d="M5 -3 Q8 0 8.6 -4" stroke="#2f353b" stroke-width=".5" fill="none"/><rect x="6.6" y="-8" width="3" height="4" rx=".8" fill="#2f353b"/><rect x="6.6" y="-12" width="3" height="4" rx=".8" fill="#2f353b"/>`;
  S.teil({ oben: true, id: "defibrillator", de: "der Defibrillator", syl: "de-fi-bril-LA-tor", it: "il defibrillatore", itSyl: "de-fi-bril-la-TO-re", en: "defibrillator", x: NW.x - 6, y: NW.y - NW.h - 1.6, kunst: k,
    tipp: "Der Defibrillator gibt dem Herzen einen Stromstoß, damit es wieder richtig schlägt." });
}

/* =====================================================================
   12 — DIE TRAGE (Schockraumtrage, auf Rollen, mit Laken)
   ===================================================================== */
{
  let k = schatten(0, 0, 44, 2.2, .32);
  for (const x of [-34, 34]) k += `<path d="M${x} -10 L${x} -4" stroke="#7d868c" stroke-width="1.6"/><circle cx="${x}" cy="-2.4" r="2.4" fill="#2f353b"/><circle cx="${x}" cy="-2.4" r=".9" fill="#9aa3aa"/>`;
  k += `<rect x="-38" y="-12" width="76" height="3" rx="1" fill="#9aa3aa"/>`;
  /* Scherenhubgestell */
  k += `<path d="M-20 -11 L14 -32 M-20 -32 L14 -11" stroke="#b5bcc2" stroke-width="1.8"/><circle cx="-3" cy="-21.5" r="1.4" fill="#7d868c"/>`;
  /* Liegefläche, Rückenteil leicht hoch, Laken, Kissen */
  k += `<rect x="-42" y="-35" width="84" height="3.4" rx="1" fill="${S.lg("rahmen", [[0, "#d9dfe2"], [1, "#a9b2b7"]])}"/>`;
  k += `<path d="M-40 -35 L-40 -41 Q-40 -43 -38 -43.4 L-24 -45 L-18 -39.6 L40 -39.6 Q42 -39.6 42 -37.6 L42 -35 Z" fill="${S.lg("matte", [[0, "#3e4a59"], [1, "#2a3340"]])}"/>`;
  k += `<path d="M-38 -43 L-24 -44.6 L-18 -39.2 L40 -39.2 L40 -37.4 L-18 -37.4 L-24 -42.6 L-38 -41 Z" fill="#fbfbf8"/>`;
  k += `<path d="M-38 -43.6 Q-36 -47 -30 -46.8 Q-25 -46.4 -25.4 -44.2 L-37 -42.4 Z" fill="${S.lg("kissen", [[0, "#ffffff"], [1, "#dfe5e8"]])}" stroke="#c9d0d3" stroke-width=".25"/>`;
  /* zusammengelegte Decke am Fußende */
  k += `<path d="M22 -39.4 L38 -39.4 L38 -43 Q30 -44.4 22 -43 Z" fill="#7fa9cf"/><path d="M22 -41.2 L38 -41.2" stroke="#a9c8e2" stroke-width=".4"/>`;
  /* Seitengitter (unten) und Schiebegriff */
  k += `<rect x="-14" y="-34" width="40" height="3.4" rx="1.4" fill="none" stroke="#c3cacd" stroke-width=".9"/>`;
  k += `<path d="M42 -36 L46 -48 L48 -48" stroke="${STAHL}" stroke-width="1.4" fill="none"/>`;
  S.teil({ id: "na_trage", de: "die Trage", syl: "TRA-ge", it: "la barella", itSyl: "ba-REL-la", en: "stretcher", x: 176, y: 182, steht: true, kunst: k,
    tipp: "Auf der Trage wird der Patient vom Rettungswagen hereingebracht." });
}

/* =====================================================================
   13 — DER NOTARZT (Einsatzjacke rot-gelb, Reflexstreifen)
   ===================================================================== */
{
  const m = B.mensch({ id: "b03d_notarzt", geschlecht: "m", pose: "kontrapost", blick: -34, frisur: "kurz", haarfarbe: "blond", haut: "hell",
    kleidung: { oberteil: { stueck: "feuerwehrjacke", farbe: "#d23a2c" }, unterteil: { stueck: "arbeitshose", farbe: "#2a3b55" }, schuhe: { stueck: "stiefel", farbe: "#1f2326" } } }, 104);
  const P = m.z.punkte, k = m.k, br = [P.brust[0] * k, P.brust[1] * k];
  let ex = `<rect x="${r(br[0] - 5.4)}" y="${r(br[1] - 2.8)}" width="7.6" height="2.4" rx=".3" fill="#ffffff"/><text x="${r(br[0] - 1.6)}" y="${r(br[1] - 1)}" font-size="1.6" text-anchor="middle" fill="#c8352b" font-family="Arial" font-weight="bold">NOTARZT</text>`;
  S.teil({ id: "na_notarzt", de: "der Notarzt", syl: "NOT-arzt", it: "il medico d'urgenza", itSyl: "ME-di-co d'ur-GEN-za", en: "emergency doctor", x: 302, y: 188, kunst: m.svg + ex,
    tipp: "Der Notarzt kommt bei schweren Notfällen mit — und übergibt den Patienten." });
}

/* =====================================================================
   14 — DIE WARTEZONE (Sitzreihe vorn links, Schild)
   ===================================================================== */
{
  let k = schatten(0, 0, 32, 1.6, .28);
  /* Traverse mit drei Schalensitzen */
  k += `<rect x="-30" y="-24" width="62" height="2" rx=".8" fill="#5a636b"/>`;
  for (const x of [-26, 28]) k += `<path d="M${x} -22 L${x - 2} 0 M${x} -22 L${x + 2} 0" stroke="#5a636b" stroke-width="1.4"/>`;
  for (let i = 0; i < 3; i++) {
    const x = -20 + i * 21;
    k += `<path d="M${x - 9} -24 Q${x - 9} -27 ${x - 6} -27 L${x + 7} -27 Q${x + 10} -27 ${x + 10} -24 Z" fill="${S.lg("schale", [[0, "#4f8fd6"], [1, "#2f6db5"]])}"/>`;
    k += `<path d="M${x - 8} -27 L${x - 9} -46 Q${x - 9} -48 ${x - 6} -48 L${x + 6} -48 Q${x + 9} -48 ${x + 9} -46 L${x + 8} -27 Z" fill="${S.lg("schale2", [[0, "#5b9ae0"], [1, "#3a77bf"]], 0, 0, 1, 0)}"/>`;
    k += `<path d="M${x - 6} -45 L${x - 6} -30" stroke="#a9cdf2" stroke-width=".7" opacity=".6"/>`;
  }
  /* liegengebliebene Zeitschrift */
  k += `<path d="M14 -27.2 L24 -27.6 L23 -28.8 L13.6 -28.4 Z" fill="#f2c94c"/>`;
  /* Schild „Wartebereich“ an der Lehne */
  k += `<rect x="-42" y="-58" width="20" height="7" rx=".8" fill="#2f6db5"/><text x="-32" y="-53.4" font-size="2.4" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">Wartebereich</text><rect x="-33" y="-51" width="2" height="51" fill="#9aa3aa"/><ellipse cx="-32" cy="0" rx="4" ry="1" fill="#5a636b"/>`;
  S.teil({ id: "na_wartezone", de: "die Wartezone", syl: "WAR-te-zo-ne", it: "la sala d'attesa", itSyl: "SA-la d'at-TE-sa", en: "waiting area", x: 50, y: 196, kunst: k,
    tipp: "In der Wartezone wartet man, bis man aufgerufen wird." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/notaufnahme.js"));
console.log(aus);
