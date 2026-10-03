#!/usr/bin/env node
/* =====================================================================
   DIE AUSLÄNDERBEHÖRDE (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (Service-Seiten der Städte zum elektronischen Aufenthalts-
   titel, z. B. service.bremen.de „eAT“; § 61b AufenthV zur Erfassung der
   Fingerabdrücke) — so sieht ein Servicebereich der Ausländerbehörde
   (heute oft „Amt für Migration“ / „Welcome Center“) aus:
   - Man kommt mit TERMIN (Terminbestätigung, oft mit QR-Code) und zieht
     am WARTEMARKENAUTOMATEN (Touchscreen-Säule) eine Wartenummer.
   - Im WARTEBEREICH stehen Stuhlreihen (Traversenbänke aus Kunststoff);
     an der Wand die AUFRUFANZEIGE: „A 117 → Platz 3“, dazu ein Gong.
   - Am PLATZ sitzt die Sachbearbeiterin hinter einem Schalter-/Service-
     tresen mit SCHUTZSCHEIBE aus Glas; auf dem Tresen Bildschirm,
     Tastatur und der FINGERABDRUCKSCANNER: Beim eAT werden zwei flache
     Abdrücke der Zeigefinger erfasst (ab 6 Jahren persönlich).
   - Auf dem Tresen: Reisepass, Antrag, biometrisches Passfoto, Stempel,
     die neue Karte (eAT im Scheckkartenformat). Oft hilft eine
     Dolmetscherin.
   - Amtsflaggen (Deutschland, Europa) im Ständer, Rasterdecke mit LED-
     Panels, Linoleum, Aushänge (Termine online, Passfoto-Regeln).
   Maßstab: Rückwand ≈ 40 Einheiten je Meter (Raumhöhe 2,6 m),
   Tresen vorn ≈ 52 je Meter (Tresenhöhe 0,95 m), Menschen 1,65–1,80 m.
   Blick: leicht von rechts, Fluchtpunkt (176 | 70); links die
   Fensterwand, rechts hinten der Wartebereich mit Akzentwand (Petrol).
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "auslaenderbehoerde", titel: "Die Ausländerbehörde", emoji: "🛂", thema: "Behörden", kuerzel: "b08a", fassung: 852 });
const rnd = zufall(4711);
const r = B.r;

/* Menschen: Pfade auf halbe (bzw. ganze) Zentimeter runden — sieht man
   nicht, macht die Datei aber ein Drittel kleiner (Ladezeit). */
function figur(spec, hoehe) {
  const m = B.mensch(spec, hoehe);
  const schritt = m.k < 0.42 ? 1 : 2;
  m.svg = m.svg.replace(/ data-teil="[^"]*"/g, "").replace(/ d="([^"]*)"/g, (q, d) => ` d="${d.replace(/-?\d+\.\d+/g, (n) => String(Math.round(+n * schritt) / schritt))}"`);
  return m;
}
const B_POSE = (n) => { B.mensch({ id: "b08a_x" }, 1); return globalThis.DMA_MENSCH.POSEN[n]; };
const T = (x, y, s, txt, f = "#222", extra = "") => `<text x="${r(x)}" y="${r(y)}" font-size="${s}" fill="${f}" font-family="Arial,Helvetica,sans-serif" text-anchor="middle"${extra}>${txt}</text>`;

/* ---------- Farben und Stoffe ---------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const WAND = S.lg("wand", [[0, "#f1f2f0"], [1, "#e1e3e0"]]);
const PETROL = S.lg("petrol", [[0, "#2f6f78"], [1, "#245860"]]);
const BODEN = S.lg("boden", [[0, "#a9b3b6"], [1, "#8e999d"]]);
const STAHL = S.lg("stahl", [[0, "#eef1f3"], [0.45, "#c9cfd4"], [0.55, "#b5bcc2"], [1, "#e1e5e8"]], 0, 0, 1, 0);
const BIRKE = S.lg("birke", [[0, "#e6d3b3"], [1, "#cdb48e"]]);
const PLATTE = S.lg("platte", [[0, "#dcdfe0"], [1, "#c3c8ca"]]);
const SITZBLAU = S.lg("sitzblau", [[0, "#3c6ea8"], [1, "#24497a"]]);
const SCHWARZ = S.lg("geraet", [[0, "#3a3e44"], [1, "#1c1f23"]]);

/* =====================================================================
   KULISSE — Rasterdecke, Fensterwand links, Rückwand, Linoleum
   ===================================================================== */
const VP = { x: 176, y: 70 };
const WU = 112;           // Fuß der Rückwand
const WO = 16;            // Oberkante der Rückwand (Decke)
const LW = 34;            // linke Raumecke
{
  let k = `<rect x="0" y="0" width="320" height="${WO + 1}" fill="#e9eaea"/>`;
  /* Rasterdecke 62,5 cm: Linien zum Fluchtpunkt und quer */
  for (let i = -10; i <= 10; i++) {
    const xb = VP.x + i * 25, t = (0 - VP.y) / (WO - VP.y);
    k += `<line x1="${r(xb)}" y1="${WO}" x2="${r(VP.x + (xb - VP.x) * t)}" y2="0" stroke="#c9cbcb" stroke-width=".35"/>`;
  }
  for (const y of [11, 5]) k += `<line x1="0" y1="${y}" x2="320" y2="${y}" stroke="#c9cbcb" stroke-width=".35"/>`;
  for (const [x, y, w] of [[96, 6.4, 18], [238, 6.4, 20], [96, 12, 15], [238, 12, 16]]) k += `<rect x="${x - w / 2}" y="${y - 0.4}" width="${w}" height="${y < 10 ? 4.2 : 3.4}" fill="#fbfdff"/><rect x="${x - w / 2}" y="${y - 0.4}" width="${w}" height="${y < 10 ? 4.2 : 3.4}" fill="none" stroke="#d5d8da" stroke-width=".3"/>`;
  /* Rückwand */
  k += `<rect x="${LW}" y="${WO}" width="${320 - LW}" height="${WU - WO}" fill="${WAND}"/>`;
  k += `<rect x="${LW}" y="${WO}" width="${320 - LW}" height="${WU - WO}" fill="${S.rg("wandlicht", [[0, "#ffffff", 0.5], [1, "#ffffff", 0]], 0.45, 0.1, 0.7)}"/>`;
  /* Akzentwand Petrol im Wartebereich */
  k += `<rect x="196" y="${WO}" width="124" height="${WU - WO}" fill="${PETROL}"/>`;
  k += `<rect x="196" y="${WO}" width="124" height="${WU - WO}" fill="${S.lg("petrollicht", [[0, "#ffffff", 0.12], [1, "#000000", 0.08]])}"/>`;
  /* Wandschild über dem Wartebereich */
  k += `<text x="258" y="27" font-size="5.2" fill="#ffffff" font-family="Arial,Helvetica,sans-serif" text-anchor="middle" font-weight="bold" letter-spacing=".3">Ausländerbehörde</text>`;
  k += `<text x="258" y="32" font-size="2.6" fill="#cfe7ea" font-family="Arial,Helvetica,sans-serif" text-anchor="middle" letter-spacing=".4">SERVICEBEREICH · WARTEZONE A + B</text>`;
  /* Sockelleiste */
  k += `<rect x="${LW}" y="${WU - 3}" width="${320 - LW}" height="3" fill="#8c9497"/>`;
  /* linke Fensterwand (zum Fluchtpunkt) mit Fenster und Lamellen */
  const yo = (x) => WO + (x - LW) * (WO - VP.y) / (LW - VP.x), yu = (x) => WU + (x - LW) * (WU - VP.y) / (LW - VP.x);
  k += `<path d="M0 ${r(yo(0))} L${LW} ${WO} L${LW} ${WU} L0 ${r(yu(0))} Z" fill="${S.lg("seitenwand", [[0, "#d9dbd9"], [1, "#e8e9e7"]], 0, 0, 1, 0)}"/>`;
  const fx0 = 4, fx1 = 30, f = (x, t) => yo(x) + (yu(x) - yo(x)) * t;
  k += `<path d="M${fx0} ${r(f(fx0, 0.16))} L${fx1} ${r(f(fx1, 0.16))} L${fx1} ${r(f(fx1, 0.62))} L${fx0} ${r(f(fx0, 0.62))} Z" fill="${S.lg("himmel", [[0, "#bfe0f3"], [0.6, "#e3f1f7"], [1, "#b9d39a"]])}"/>`;
  for (let i = 0; i < 12; i++) {
    const x = fx0 + 1 + i * 2.2;
    k += `<line x1="${r(x)}" y1="${r(f(x, 0.16))}" x2="${r(x)}" y2="${r(f(x, 0.62))}" stroke="#f4f4f2" stroke-width="1.1" opacity=".75"/>`;
  }
  k += `<path d="M${fx0} ${r(f(fx0, 0.16))} L${fx1} ${r(f(fx1, 0.16))} L${fx1} ${r(f(fx1, 0.62))} L${fx0} ${r(f(fx0, 0.62))} Z" fill="none" stroke="#9aa1a4" stroke-width="1"/>`;
  k += `<path d="M${fx0 - 1} ${r(f(fx0, 0.63))} L${fx1 + 1} ${r(f(fx1, 0.63))}" stroke="#c4c7c7" stroke-width="1.4"/>`;
  /* Heizkörper unter dem Fenster */
  k += `<path d="M${fx0 + 2} ${r(f(fx0, 0.7))} L${fx1 - 2} ${r(f(fx1 - 2, 0.7))} L${fx1 - 2} ${r(f(fx1 - 2, 0.86))} L${fx0 + 2} ${r(f(fx0 + 2, 0.86))} Z" fill="#eef0f0" stroke="#c3c7c8" stroke-width=".3"/>`;
  /* Linoleum mit Fluchtlinien */
  k += `<path d="M0 ${r(yu(0))} L${LW} ${WU} L320 ${WU} L320 200 L0 200 Z" fill="${BODEN}"/>`;
  for (let i = -14; i <= 12; i++) {
    const xb = VP.x + i * 14, t = (200 - VP.y) / (WU - VP.y), x2 = VP.x + (xb - VP.x) * t;
    let x1 = xb, y1 = WU;
    if (xb < LW) { const tt = (LW - VP.x) / (xb - VP.x); if (tt <= 0) continue; x1 = VP.x + (xb - VP.x) * Math.min(1, tt); x1 = Math.max(0, xb); y1 = WU; }
    k += `<line x1="${r(x1)}" y1="${r(y1)}" x2="${r(x2)}" y2="200" stroke="#7d878b" stroke-width=".3" opacity=".55"/>`;
  }
  for (const y of [116, 121, 127.5, 135.5, 145.5, 158, 174, 194]) k += `<line x1="0" y1="${y}" x2="320" y2="${y}" stroke="#7d878b" stroke-width=".3" opacity=".45"/>`;
  let sp = "";
  for (let i = 0; i < 160; i++) { const y = WU + 2 + rnd() * 86, x = rnd() * 320; sp += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(0.2 + rnd() * 0.35)}" fill="${rnd() < 0.5 ? "#c7cfd2" : "#7a8488"}" opacity=".45"/>`; }
  k += sp;
  k += `<path d="M0 ${r(yu(0))} L${LW} ${WU} L320 ${WU} L320 200 L0 200 Z" fill="${S.lg("bodenlicht", [[0, "#000", 0.14], [0.35, "#000", 0], [1, "#fff", 0.07]])}"/>`;
  /* Lichtfleck vom Fenster auf dem Boden */
  k += `<path d="M0 132 L22 120 L70 128 L40 150 Z" fill="#fffbe8" opacity=".14"/>`;
  S.hinten(k);
}

/* =====================================================================
   1 — DIE UHR (Rückwand über dem Platz)
   ===================================================================== */
{
  let k = `<circle r="7.2" fill="#3a3f44"/><circle r="6.4" fill="${S.rg("zb", [[0, "#ffffff"], [1, "#eceeee"]])}"/>`;
  for (let i = 0; i < 12; i++) {
    const a = i * Math.PI / 6, l = i % 3 ? 0.7 : 1.4;
    k += `<line x1="${r(Math.sin(a) * 5.6)}" y1="${r(-Math.cos(a) * 5.6)}" x2="${r(Math.sin(a) * (5.6 - l))}" y2="${r(-Math.cos(a) * (5.6 - l))}" stroke="#1d2024" stroke-width="${i % 3 ? 0.35 : 0.6}"/>`;
  }
  /* zehn Uhr fünf */
  k += `<line x1="0" y1="0" x2="${r(Math.sin(10.08 * Math.PI / 6) * 3.2)}" y2="${r(-Math.cos(10.08 * Math.PI / 6) * 3.2)}" stroke="#1d2024" stroke-width=".8" stroke-linecap="round"/>`;
  k += `<line x1="0" y1="0" x2="${r(Math.sin(1 * Math.PI / 6) * 4.8)}" y2="${r(-Math.cos(1 * Math.PI / 6) * 4.8)}" stroke="#1d2024" stroke-width=".5" stroke-linecap="round"/>`;
  k += `<line x1="0" y1="1" x2="${r(Math.sin(8 * Math.PI / 6) * -1)}" y2="-5" stroke="#c0392b" stroke-width=".25"/><circle r=".6" fill="#c0392b"/>`;
  k += `<path d="M-4.4 -4.6 A6.4 6.4 0 0 1 3.4 -5.4" stroke="#fff" stroke-width=".7" opacity=".6" fill="none"/>`;
  S.teil({ id: "uhr", de: "die Uhr", syl: "UHR", it: "l'orologio", itSyl: "o-ro-LO-gio", en: "clock", x: 118, y: 36, kunst: k });
}

/* =====================================================================
   2 — DIE FLAGGEN (Amtsflaggen im Ständer, hinten links)
   ===================================================================== */
const flagge = (streifen, euro) => {
  /* Stange 2,3 m, Fahne mit Ausleger, leicht gewellt */
  let k = schatten(0, 0.2, 5, 0.9, 0.3);
  k += `<path d="M-4 0 L4 0 L2.6 -2.4 L-2.6 -2.4 Z" fill="#9aa2a8"/>`;
  k += `<rect x="-.55" y="-92" width="1.1" height="90" fill="${STAHL}"/>`;
  k += `<path d="M-1.4 -92 Q0 -96.6 1.4 -92 Z" fill="#d4b14a"/>`;
  k += `<rect x=".4" y="-90.4" width="17" height=".7" rx=".3" fill="#b9bfc4"/>`;
  const w = 17, h = 32, x0 = 0.6, y0 = -89.8;
  const welle = (y, t) => `${r(x0 + t * w)} ${r(y + Math.sin(t * 6) * 1.1 * t)}`;
  if (streifen) {
    streifen.forEach((c, i) => {
      const a = y0 + i * h / 3, b = y0 + (i + 1) * h / 3;
      let d = `M${welle(a, 0)}`;
      for (let t = 0.1; t <= 1.001; t += 0.1) d += ` L${welle(a, t)}`;
      for (let t = 1; t >= -0.001; t -= 0.1) d += ` L${welle(b, t)}`;
      k += `<path d="${d} Z" fill="${c}"/>`;
    });
  } else {
    let d = `M${welle(y0, 0)}`;
    for (let t = 0.1; t <= 1.001; t += 0.1) d += ` L${welle(y0, t)}`;
    for (let t = 1; t >= -0.001; t -= 0.1) d += ` L${welle(y0 + h, t)}`;
    k += `<path d="${d} Z" fill="#1f3f95"/>`;
    for (let i = 0; i < 12; i++) {
      const a = i * Math.PI / 6, cx = x0 + w / 2 + Math.sin(a) * 5.4, cy = y0 + h / 2 - Math.cos(a) * 5.4 + Math.sin((cx - x0) / w * 6) * (cx - x0) / w * 1.1;
      k += `<path d="M${r(cx)} ${r(cy - 0.9)} L${r(cx + 0.28)} ${r(cy - 0.25)} L${r(cx + 0.9)} ${r(cy - 0.25)} L${r(cx + 0.4)} ${r(cy + 0.15)} L${r(cx + 0.6)} ${r(cy + 0.8)} L${r(cx)} ${r(cy + 0.4)} L${r(cx - 0.6)} ${r(cy + 0.8)} L${r(cx - 0.4)} ${r(cy + 0.15)} L${r(cx - 0.9)} ${r(cy - 0.25)} L${r(cx - 0.28)} ${r(cy - 0.25)} Z" fill="#ffd617"/>`;
    }
  }
  /* Faltenschatten */
  for (const t of [0.22, 0.5, 0.78]) k += `<path d="M${r(x0 + t * w)} ${r(y0 + 0.5)} L${r(x0 + t * w)} ${r(y0 + h - 0.5)}" stroke="#000" stroke-width="1.6" opacity=".12"/><path d="M${r(x0 + t * w + 1.4)} ${r(y0 + 0.5)} L${r(x0 + t * w + 1.4)} ${r(y0 + h - 0.5)}" stroke="#fff" stroke-width=".9" opacity=".14"/>`;
  return k;
};
S.teil({ id: "ab_flagge", de: "die Flagge", syl: "FLAG-ge", it: "la bandiera", itSyl: "ban-DIE-ra", en: "flag", x: 40, y: 117, steht: true, kunst: flagge(["#1b1b1b", "#d81e1e", "#f2c200"]),
  tipp: "Schwarz, Rot, Gold — die Flagge der Bundesrepublik Deutschland." });
S.teil({ id: "ab_europaflagge", de: "die Europaflagge", syl: "eu-RO-pa-flag-ge", it: "la bandiera europea", itSyl: "ban-DIE-ra eu-ro-PE-a", en: "European flag", x: 62, y: 115, steht: true, kunst: flagge(null) });

/* =====================================================================
   3 — DIE TÜR zum Büro (Rückwand)
   ===================================================================== */
{
  let k = `<rect x="-19" y="-82" width="38" height="82" fill="#8a9396"/>`;
  k += `<rect x="-17" y="-80" width="34" height="80" fill="${S.lg("tuer", [[0, "#efe7d6"], [1, "#dccdb2"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-12" y="-72" width="24" height="26" rx=".6" fill="${S.lg("milchglas", [[0, "#f6f9fa"], [1, "#dfe7ea"]])}" stroke="#b9c0c3" stroke-width=".4"/>`;
  k += `<rect x="-9" y="-70" width="18" height="6" fill="#ffffff" stroke="#9aa3a6" stroke-width=".3"/>` + T(0, -66.6, 2.6, "Zimmer 0.14", "#2d3a40", ' font-weight="bold"');
  k += T(0, -61, 1.8, "Bitte warten —", "#4a5a60") + T(0, -58.6, 1.8, "Sie werden aufgerufen.", "#4a5a60");
  k += `<rect x="10.5" y="-42" width="5" height="1.2" rx=".6" fill="${STAHL}"/><rect x="11" y="-43" width="1.6" height="3.4" rx=".4" fill="#a7afb4"/>`;
  k += `<path d="M-17 -80 L-6 -80 L-17 -50 Z" fill="#fff" opacity=".12"/>`;
  S.teil({ id: "ab_tuer", de: "die Tür", syl: "TÜR", it: "la porta", itSyl: "POR-ta", en: "door", x: 174, y: WU, steht: true, kunst: k });
}

/* =====================================================================
   4 — DER AUSHANG (Pinnwand mit Info-Plakaten im Wartebereich)
   ===================================================================== */
{
  let k = `<rect x="-17" y="-13" width="34" height="26" rx=".8" fill="#b18a5a"/><rect x="-15.8" y="-11.8" width="31.6" height="23.6" fill="${S.lg("kork", [[0, "#c9a678"], [1, "#b28c5f"]])}"/>`;
  for (let i = 0; i < 50; i++) k += `<circle cx="${r(-15 + rnd() * 30)}" cy="${r(-11 + rnd() * 22)}" r=".22" fill="#8e6a40" opacity=".6"/>`;
  const plakat = (x, y, w, h, kopf, farbe, zeilen, dreh) => {
    let g = `<g transform="rotate(${dreh} ${x + w / 2} ${y})"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fdfdfb"/><rect x="${x}" y="${y}" width="${w}" height="${r(h * 0.26)}" fill="${farbe}"/>`;
    g += T(x + w / 2, y + h * 0.19, 1.5, kopf, "#fff", ' font-weight="bold"');
    zeilen.forEach((z, i) => { g += T(x + w / 2, y + h * 0.42 + i * 1.9, 1.15, z, "#3a3a3a"); });
    g += `<circle cx="${x + w / 2}" cy="${y + 0.6}" r=".55" fill="#d23b30"/></g>`;
    return g;
  };
  k += plakat(-14.6, -10.4, 10, 12, "Termine", "#2f6f78", ["nur online", "buchen", "▢▣ QR"], -2);
  k += plakat(-3.2, -10.8, 9.4, 13, "Passfoto", "#c0392b", ["biometrisch", "35 × 45 mm", "ohne Brille"], 1.5);
  k += plakat(7.4, -10.2, 7.6, 9.6, "Hinweis", "#e0a526", ["Handy", "lautlos", "bitte"], 3);
  k += plakat(-12, 2.4, 12, 8.4, "Welcome", "#3c6ea8", ["Willkommen · Hoş geldiniz", "Ласкаво просимо · أهلاً"], -1);
  k += plakat(2.6, 3.4, 12, 7.6, "Gebühren", "#5b6770", ["eAT 100 € · Verl. 93 €", "Zahlung mit Karte"], 1);
  S.teil({ id: "ab_aushang_ab", de: "der Aushang", syl: "AUS-hang", it: "l'avviso", itSyl: "av-VI-so", en: "notice", x: 216, y: 60, kunst: k,
    tipp: "Am Aushang stehen wichtige Hinweise: Termine, Passfoto, Gebühren." });
}

/* =====================================================================
   5 — DIE NUMMERNANZEIGE (Aufrufanzeige über dem Wartebereich)
   ===================================================================== */
{
  let k = `<rect x="-30" y="-15" width="60" height="30" rx="1.6" fill="#15181b"/>`;
  k += `<rect x="-28" y="-13" width="56" height="26" fill="${S.lg("anz", [[0, "#0b1c2a"], [1, "#071017"]])}"/>`;
  k += `<rect x="-28" y="-13" width="56" height="5.4" fill="#16384f"/>`;
  k += T(-14, -9, 2.8, "Nummer", "#cfe6f5", ' font-weight="bold"') + T(14, -9, 2.8, "Platz", "#cfe6f5", ' font-weight="bold"');
  const zeilen = [["A 117", "3", true], ["B 042", "1"], ["A 116", "5"]];
  zeilen.forEach(([n, p, neu], i) => {
    const y = -2.4 + i * 6.4;
    if (neu) k += `<rect x="-27" y="${y - 4.4}" width="54" height="6" fill="#f2c200" opacity=".18"/>`;
    k += `<text x="-14" y="${y}" font-size="4.4" fill="${neu ? "#ffd84a" : "#e9f3f8"}" font-family="'Courier New',monospace" font-weight="bold" text-anchor="middle">${n}</text>`;
    k += `<text x="1" y="${y}" font-size="3.4" fill="#7fb7d6" font-family="Arial" text-anchor="middle">→</text>`;
    k += `<text x="14" y="${y}" font-size="4.4" fill="${neu ? "#ffd84a" : "#e9f3f8"}" font-family="'Courier New',monospace" font-weight="bold" text-anchor="middle">${p}</text>`;
  });
  k += `<path d="M-28 -13 L-10 -13 L-28 4 Z" fill="#fff" opacity=".06"/>`;
  k += `<rect x="-3" y="15" width="6" height="2.2" fill="#2a2e33"/>`;
  S.teil({ id: "ab_anzeige_ab", de: "die Nummernanzeige", syl: "NUM-mern-an-zei-ge", it: "il display dei numeri", itSyl: "di-SPLAY dei NU-me-ri", en: "number display", x: 268, y: 52, kunst: k,
    tipp: "Wenn Ihre Nummer erscheint, gehen Sie zu dem Platz daneben." });
}

/* =====================================================================
   6 — DIE ZIMMERPFLANZE (Ecke hinten rechts)
   ===================================================================== */
{
  let k = schatten(0, 0.2, 7, 1.1, 0.3);
  k += `<path d="M-6 -14 L6 -14 L4.8 0 L-4.8 0 Z" fill="${S.lg("topf", [[0, "#e8e8e4"], [1, "#b9bab5"]], 0, 0, 1, 0)}"/><rect x="-6.3" y="-15" width="12.6" height="1.6" rx=".5" fill="#f2f2ee"/>`;
  const blatt = (x, y, l, a, c) => `<path d="M${r(x)} ${r(y)} q${r(Math.cos(a) * l * 0.4 - Math.sin(a) * 3)} ${r(Math.sin(a) * l * 0.4 + Math.cos(a) * 3 - 3)} ${r(Math.cos(a) * l)} ${r(Math.sin(a) * l)} q${r(-Math.cos(a) * l * 0.5 + Math.sin(a) * 2)} ${r(-Math.sin(a) * l * 0.5 - Math.cos(a) * 2)} ${r(-Math.cos(a) * l)} ${r(-Math.sin(a) * l)} Z" fill="${c}"/>`;
  for (let i = 0; i < 16; i++) {
    const a = -Math.PI / 2 + (rnd() - 0.5) * 2.6, l = 8 + rnd() * 9;
    k += `<line x1="0" y1="-14" x2="${r(Math.cos(a) * l * 0.5)}" y2="${r(-14 - l * 0.6 + Math.sin(a) * 2)}" stroke="#3d6b2f" stroke-width=".4"/>`;
    k += blatt(Math.cos(a) * l * 0.5, -14 - l * 0.6 + Math.sin(a) * 2, 6 + rnd() * 3, a, rnd() < 0.5 ? "#3f8a3a" : "#2f6e2c");
  }
  S.teil({ id: "ab_pflanze", de: "die Zimmerpflanze", syl: "ZIM-mer-pflan-ze", it: "la pianta d'appartamento", itSyl: "PIAN-ta d'ap-par-ta-MEN-to", en: "houseplant", x: 309, y: 120, steht: true, kunst: k });
}

/* =====================================================================
   7 — DIE STUHLREIHE (Traversenbank, vier Schalensitze) und
       DIE WARTENDE (sitzt auf dem zweiten Platz)
   ===================================================================== */
const schalensitz = (x, s, farbe = SITZBLAU) => {
  /* x = Mitte, Fußboden = 0, s = Einheiten je Meter */
  const sh = 0.45 * s, w = 0.46 * s;
  let g = `<path d="M${r(x - w / 2)} ${r(-sh - 0.42 * s)} Q${r(x - w / 2)} ${r(-sh - 0.47 * s)} ${r(x - w / 2 + 2)} ${r(-sh - 0.47 * s)} L${r(x + w / 2 - 2)} ${r(-sh - 0.47 * s)} Q${r(x + w / 2)} ${r(-sh - 0.47 * s)} ${r(x + w / 2)} ${r(-sh - 0.42 * s)} L${r(x + w / 2 - 1)} ${r(-sh - 0.06 * s)} L${r(x - w / 2 + 1)} ${r(-sh - 0.06 * s)} Z" fill="${farbe}"/>`;
  g += `<path d="M${r(x - w / 2 - 0.4)} ${r(-sh - 0.05 * s)} L${r(x + w / 2 + 0.4)} ${r(-sh - 0.05 * s)} L${r(x + w / 2 + 1.2)} ${r(-sh + 0.02 * s)} Q${r(x)} ${r(-sh + 0.06 * s)} ${r(x - w / 2 - 1.2)} ${r(-sh + 0.02 * s)} Z" fill="${farbe}"/>`;
  g += `<path d="M${r(x - w / 2 + 1.4)} ${r(-sh - 0.44 * s)} L${r(x - w / 2 + 3)} ${r(-sh - 0.44 * s)} L${r(x - w / 2 + 2.6)} ${r(-sh - 0.1 * s)} L${r(x - w / 2 + 1.6)} ${r(-sh - 0.1 * s)} Z" fill="#fff" opacity=".18"/>`;
  return g;
};
const REIHE = { x0: 222, x1: 300, y: 125, s: 41 };
{
  const { x0, x1, s } = REIHE, n = 4, dx = (x1 - x0) / n;
  let k = schatten(0, 0.3, (x1 - x0) / 2 + 2, 1.4, 0.3);
  const cx = (x0 + x1) / 2;
  /* Traverse und Beine */
  k += `<rect x="${r(x0 - cx)}" y="${r(-0.38 * s)}" width="${x1 - x0}" height="1.6" fill="#5d666c"/>`;
  for (const fx of [x0 - cx + 6, x1 - cx - 6]) k += `<path d="M${r(fx - 4)} 0 L${r(fx)} ${r(-0.38 * s)} L${r(fx + 4)} 0" stroke="#6c757b" stroke-width="1.2" fill="none"/><rect x="${r(fx - 5)}" y="-.8" width="2.2" height=".8" fill="#2a2e33"/><rect x="${r(fx + 2.8)}" y="-.8" width="2.2" height=".8" fill="#2a2e33"/>`;
  for (let i = 0; i < n; i++) k += schalensitz(x0 - cx + dx / 2 + i * dx, s);
  /* Armlehnen zwischen den Sitzen */
  for (let i = 0; i <= n; i++) { const ax = x0 - cx + i * dx; k += `<rect x="${r(ax - 0.6)}" y="${r(-0.66 * s)}" width="1.2" height="${r(0.22 * s)}" fill="#4b5359"/><rect x="${r(ax - 1.6)}" y="${r(-0.67 * s)}" width="3.2" height="1" rx=".4" fill="#2f3438"/>`; }
  S.teil({ id: "ab_stuhlreihe_ab", de: "die Stuhlreihe", syl: "STUHL-rei-he", it: "la fila di sedie", itSyl: "FI-la di SE-die", en: "row of chairs", x: cx, y: REIHE.y, steht: true, kunst: k });
}
{
  const m = figur({ id: "b08a_wart", geschlecht: "w", pose: "lesen", blick: 14, frisur: "dutt", haarfarbe: "schwarz", haut: "mittel",
    kleidung: { oberteil: { stueck: "pullover", farbe: "#7a5a8c" }, unterteil: { stueck: "hose", farbe: "#3a3f55" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" }, zubehoer: { stueck: "buch", farbe: "#c9a227" } } }, 64);
  /* Sitzhöhe 0,45 m auf dem zweiten Schalensitz */
  const sitz = 0.45 * REIHE.s, oy = REIHE.y - sitz + m.z.sitz.y * -m.k;
  /* Wartemarke in der Hand */
  S.teil({ id: "ab_wartende", de: "die Wartende", syl: "WAR-ten-de", it: "chi aspetta", itSyl: "chi a-SPET-ta", en: "person waiting", x: REIHE.x0 + (REIHE.x1 - REIHE.x0) / 8 * 3, y: r(oy), kunst: m.svg,
    tipp: "Sie hat eine Wartenummer gezogen und wartet, bis die Anzeige sie aufruft." });
}

/* =====================================================================
   8 — DER SCHALTER (Servicetresen mit Platznummer) — Teile hinten
   ===================================================================== */
const TR = { x0: 30, x1: 150, yb: 113, yf: 124, yu: 170 };   // Rückkante, Vorderkante, Boden vorn
/* Bürostuhl hinter dem Tresen (Lehne sichtbar neben der Sachbearbeiterin) */
{
  let k = `<path d="M-9 -44 Q-9 -50 -3 -50 L5 -50 Q11 -50 11 -44 L10 -22 L-8 -22 Z" fill="${SCHWARZ}"/>`;
  k += `<path d="M-7 -47 Q-6 -48.6 -2 -48.6 L4 -48.6" stroke="#5a6068" stroke-width=".8" fill="none"/>`;
  k += `<rect x="-10.5" y="-30" width="3" height="9" rx="1" fill="#2a2e33"/><rect x="9.5" y="-30" width="3" height="9" rx="1" fill="#2a2e33"/>`;
  k += `<rect x="-11" y="-31" width="4" height="1.4" rx=".6" fill="#3d4248"/><rect x="9" y="-31" width="4" height="1.4" rx=".6" fill="#3d4248"/>`;
  S.teil({ id: "ab_buerostuhl", de: "der Bürostuhl", syl: "BÜ-ro-stuhl", it: "la sedia da ufficio", itSyl: "SE-dia da uf-FI-cio", en: "office chair", x: 64, y: 150, kunst: k });
}
{
  const m = figur({ id: "b08a_sb", geschlecht: "w", pose: "sitzen", blick: 24, frisur: "zopf", haarfarbe: "braun", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "bluse", farbe: "#dfe9f2" }, jacke: { stueck: "jacke", farbe: "#3a4e6a" }, unterteil: { stueck: "hose", farbe: "grau" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" }, zubehoer: { stueck: "brille" } } }, 92);
  S.teil({ id: "ab_sachbearbeiterin", de: "die Sachbearbeiterin", syl: "SACH-be-ar-bei-te-rin", it: "l'impiegata", itSyl: "im-pie-GA-ta", en: "case worker", x: 82, y: 150, kunst: m.svg,
    tipp: "Die Sachbearbeiterin prüft den Antrag und erfasst die Fingerabdrücke." });
}
/* Bildschirm und Tastatur stehen auf dem Tresen (vor der Sachbearbeiterin) */
{
  let k = schatten(0, 0.3, 9, 1, 0.3);
  k += `<path d="M-4 0 L4 0 L3 -1.4 L-3 -1.4 Z" fill="#30353a"/><rect x="-1" y="-6" width="2" height="5" fill="#3a3f44"/>`;
  k += `<path d="M-13 -24 L11 -22.4 L11 -6.6 L-13 -5.6 Z" fill="#1c1f23"/>`;
  k += `<path d="M-12 -23 L10 -21.5 L10 -7.4 L-12 -6.6 Z" fill="${S.lg("bild", [[0, "#e9f1f6"], [1, "#cfdde6"]])}"/>`;
  /* Formularmaske mit Foto und Fingerabdruck-Feldern */
  k += `<path d="M-12 -23 L10 -21.5 L10 -19.8 L-12 -21.2 Z" fill="#2f6f78"/>`;
  k += `<rect x="-10.6" y="-19" width="5" height="6.4" fill="#b9c3c9"/><circle cx="-8.1" cy="-17" r="1.3" fill="#8a7563"/><path d="M-10.2 -12.8 Q-8.1 -15.6 -6 -12.8 Z" fill="#5a6a78"/>`;
  for (let i = 0; i < 4; i++) k += `<rect x="-4" y="${-18.6 + i * 1.8}" width="${8 - (i % 2) * 2}" height=".8" fill="#9aabb6"/>`;
  k += `<ellipse cx="-1.6" cy="-9.4" rx="1.4" ry="1.8" fill="none" stroke="#2f6f78" stroke-width=".35"/><ellipse cx="2.4" cy="-9.2" rx="1.4" ry="1.8" fill="none" stroke="#2f6f78" stroke-width=".35"/>`;
  k += `<rect x="5.4" y="-10.6" width="3.6" height="1.6" rx=".3" fill="#3ca35a"/>`;
  k += `<path d="M-12 -23 L-4 -22.4 L-12 -12 Z" fill="#fff" opacity=".14"/>`;
  S.teil({ oben: true, id: "ab_bildschirm", de: "der Bildschirm", syl: "BILD-schirm", it: "lo schermo", itSyl: "SCHER-mo", en: "screen", x: 45, y: 117, steht: true, kunst: k });
}

/* Der Tresen selbst mit den Dokumenten (Lupe) */
const tresenUnter = [];
{
  const cx = (TR.x0 + TR.x1) / 2, W = TR.x1 - TR.x0, H = TR.yu - TR.yb;
  let k = schatten(0, 0.5, W / 2 + 3, 2, 0.32);
  /* Platte (Draufsicht, leicht trapezförmig zum Fluchtpunkt) */
  k += `<path d="M${-W / 2 + 3} ${-H} L${W / 2 - 1} ${-H} L${W / 2 + 1} ${-(TR.yu - TR.yf)} L${-W / 2 - 1} ${-(TR.yu - TR.yf)} Z" fill="${PLATTE}"/>`;
  k += `<rect x="${-W / 2 - 1}" y="${-(TR.yu - TR.yf)}" width="${W + 2}" height="2" fill="#aeb4b7"/>`;
  /* Front: Birke mit Petrol-Band und Platznummer */
  const ft = -(TR.yu - TR.yf) + 2;
  k += `<rect x="${-W / 2}" y="${ft}" width="${W}" height="${-ft}" fill="${BIRKE}"/>`;
  for (let x = -W / 2 + 6; x < W / 2; x += 12) k += `<line x1="${x}" y1="${ft}" x2="${x}" y2="-3" stroke="#bfa47d" stroke-width=".35"/>`;
  k += `<rect x="${-W / 2}" y="${ft + 10}" width="${W}" height="5" fill="${PETROL}"/>`;
  k += `<rect x="${-W / 2}" y="-3" width="${W}" height="3" fill="#6d7478"/>`;
  k += `<rect x="${W / 2 - 22}" y="${ft + 18}" width="16" height="14" rx="1" fill="#ffffff" stroke="#2f6f78" stroke-width=".6"/>` + T(W / 2 - 14, ft + 25, 3, "Platz", "#2f6f78", ' font-weight="bold"') + T(W / 2 - 14, ft + 30.6, 5.6, "3", "#2f6f78", ' font-weight="bold"');
  k += `<rect x="${-W / 2}" y="${ft}" width="${W}" height="1.6" fill="#fff" opacity=".2"/>`;
  /* Tastatur und Maus (gehören zum Tresen, nicht eigens antippbar) */
  k += `<path d="M${-W / 2 + 9} ${-H + 5.6} L${-W / 2 + 29} ${-H + 5.6} L${-W / 2 + 30.4} ${-H + 8.4} L${-W / 2 + 8} ${-H + 8.4} Z" fill="#2a2e33"/>`;
  for (let i = 0; i < 9; i++) k += `<rect x="${r(-W / 2 + 10 + i * 2.2)}" y="${-H + 6.3}" width="1.6" height=".7" fill="#596068"/>`;
  /* Dokumente auf dem Tresen — einzeln in der Lupe */
  const yT = -(TR.yu - TR.yf);   // Vorderkante der Platte
  const dok = [];
  /* Reisepass (burgunderrot, aufgeklappt mit Datenseite) */
  {
    const x = -11, y = yT - 3.6;
    let g = `<path d="M${x - 6} ${y + 2.6} L${x + 6} ${y + 2.6} L${x + 5.2} ${y - 2.4} L${x - 5.2} ${y - 2.4} Z" fill="#6e1a26"/>`;
    g += `<path d="M${x - 5.4} ${y + 2.2} L${x - 0.2} ${y + 2.2} L${x - 0.4} ${y - 2} L${x - 4.8} ${y - 2} Z" fill="#f4efe2"/><rect x="${x - 4.6}" y="${y - 1.4}" width="1.8" height="2.2" fill="#a9958a"/>`;
    for (let i = 0; i < 3; i++) g += `<rect x="${x - 2.4}" y="${r(y - 1.2 + i * 1)}" width="2" height=".4" fill="#8a8f95"/>`;
    g += `<path d="M${x + 0.6} ${y + 2.2} L${x + 5.4} ${y + 2.2} L${x + 4.8} ${y - 2} L${x + 0.4} ${y - 2} Z" fill="#7c1f2c"/><circle cx="${x + 2.7}" cy="${y}" r=".9" fill="none" stroke="#d6b45a" stroke-width=".25"/>`;
    k += g;
    dok.push({ id: "ab_reisepass", de: "der Reisepass", syl: "REI-se-pass", it: "il passaporto", itSyl: "pas-sa-POR-to", en: "passport", x, y, w: 13, h: 7,
      tipp: "Der Reisepass muss gültig sein — sonst gibt es keinen Aufenthaltstitel." });
  }
  /* Aufenthaltstitel (eAT-Karte, Scheckkartenformat) */
  {
    const x = 18, y = yT - 2.6;
    let g = `<path d="M${x - 3.6} ${y + 1.8} L${x + 3.6} ${y + 1.8} L${x + 3.2} ${y - 1.8} L${x - 3.2} ${y - 1.8} Z" fill="${S.lg("eat", [[0, "#d7ecd6"], [0.5, "#f1e7c9"], [1, "#d4e3ef"]], 0, 0, 1, 0)}" stroke="#8aa08a" stroke-width=".15"/>`;
    g += `<rect x="${x - 3}" y="${y - 1.1}" width="1.6" height="2.1" fill="#a0897a"/><rect x="${x - 1}" y="${y - 1.4}" width="4" height=".5" fill="#4b6b4b"/>`;
    for (let i = 0; i < 3; i++) g += `<rect x="${x - 1}" y="${r(y - 0.4 + i * 0.7)}" width="${3.4 - i * 0.6}" height=".3" fill="#7a8a7a"/>`;
    k += g;
    dok.push({ id: "ab_aufenthaltstitel", de: "der Aufenthaltstitel", syl: "AUF-ent-halts-ti-tel", it: "il permesso di soggiorno", itSyl: "per-MES-so di sog-GIOR-no", en: "residence permit", x, y, w: 9, h: 6,
      tipp: "Der elektronische Aufenthaltstitel ist eine Karte mit Chip — wie ein Personalausweis." });
  }
  /* Antrag (Formular) */
  {
    const x = 4, y = yT - 3.2;
    let g = `<path d="M${x - 5} ${y + 2.8} L${x + 5} ${y + 2.8} L${x + 4.4} ${y - 3} L${x - 4.4} ${y - 3} Z" fill="#fcfcfa" stroke="#c9ccc9" stroke-width=".15"/>`;
    g += `<rect x="${x - 3.8}" y="${y - 2.6}" width="7.6" height=".8" fill="#2f6f78"/>`;
    for (let i = 0; i < 5; i++) g += `<rect x="${x - 3.6}" y="${r(y - 1.2 + i * 0.8)}" width="${i % 2 ? 5 : 7}" height=".28" fill="#9aa0a4"/>`;
    g += `<rect x="${x - 3.6}" y="${y + 1.6}" width=".6" height=".6" fill="none" stroke="#555" stroke-width=".12"/><path d="M${x - 3.5} ${y + 1.9} l.2 .2 l.4 -.5" stroke="#1f5fb3" stroke-width=".15" fill="none"/>`;
    k += g;
    dok.push({ id: "ab_antrag", de: "der Antrag", syl: "AN-trag", it: "la domanda", itSyl: "do-MAN-da", en: "application", x, y, w: 11, h: 7 });
  }
  /* Passfoto (biometrisch) */
  {
    const x = 11.5, y = yT - 4.4;
    let g = `<rect x="${x - 1.3}" y="${y - 1.7}" width="2.6" height="3.3" fill="#e9eef1" stroke="#c0c6ca" stroke-width=".12"/><circle cx="${x}" cy="${y - 0.4}" r=".75" fill="#9b7b63"/><path d="M${x - 1.1} ${y + 1.5} Q${x} ${y + 0.1} ${x + 1.1} ${y + 1.5} Z" fill="#3e4a5a"/>`;
    k += g;
    dok.push({ id: "ab_passfoto", de: "das Passfoto", syl: "PASS-fo-to", it: "la fototessera", itSyl: "fo-to-TES-se-ra", en: "passport photo", x, y, w: 5, h: 5,
      tipp: "Das Passfoto ist biometrisch: 35 × 45 mm, gerader Blick, neutraler Ausdruck." });
  }
  /* Terminbestätigung mit QR-Code */
  {
    const x = 27, y = yT - 3.4;
    let g = `<path d="M${x - 4} ${y + 2.8} L${x + 4} ${y + 2.8} L${x + 3.6} ${y - 2.8} L${x - 3.6} ${y - 2.8} Z" fill="#fbfbf8" stroke="#c9ccc9" stroke-width=".15"/>`;
    g += `<rect x="${x - 3}" y="${y - 2.2}" width="6" height=".6" fill="#3c6ea8"/>`;
    for (let i = 0; i < 9; i++) if ((i * 7) % 3) g += `<rect x="${r(x - 2.8 + (i % 3) * 0.8)}" y="${r(y - 1.2 + Math.floor(i / 3) * 0.8)}" width=".7" height=".7" fill="#222"/>`;
    g += `<rect x="${x - 2.8}" y="${y - 1.2}" width="2.4" height="2.4" fill="none" stroke="#222" stroke-width=".2"/>`;
    for (let i = 0; i < 3; i++) g += `<rect x="${x}" y="${r(y - 1 + i * 0.8)}" width="2.6" height=".26" fill="#9aa0a4"/>`;
    k += g;
    dok.push({ id: "ab_terminzettel", de: "die Terminbestätigung", syl: "Ter-MIN-be-stä-ti-gung", it: "la conferma dell'appuntamento", itSyl: "con-FER-ma dell'ap-pun-ta-MEN-to", en: "appointment confirmation", x, y, w: 9, h: 7,
      tipp: "Ohne Termin geht es meist nicht: Den Termin bucht man online." });
  }
  /* Stempel mit Stempelkissen (auf der Seite der Sachbearbeiterin) */
  {
    const x = -27, y = yT - 6.4;
    let g = `<path d="M${x + 1} ${y + 2.4} L${x + 7} ${y + 2.4} L${x + 6.6} ${y + 0.6} L${x + 1.4} ${y + 0.6} Z" fill="#2d3238"/><path d="M${x + 1.8} ${y + 1.9} L${x + 6.2} ${y + 1.9} L${x + 6} ${y + 1} L${x + 2} ${y + 1} Z" fill="#2c4f9e"/>`;
    g += `<rect x="${x - 2.2}" y="${y + 0.4}" width="4.4" height="2" rx=".4" fill="#3a3a3a"/><rect x="${x - 0.8}" y="${y - 3}" width="1.6" height="3.6" fill="#7a4e2a"/><ellipse cx="${x}" cy="${y - 3.4}" rx="1.6" ry="1.4" fill="${S.rg("knauf", [[0, "#b07a48"], [1, "#6b4322"]])}"/>`;
    k += g;
    dok.push({ id: "ab_stempel_ab", de: "der Stempel", syl: "STEM-pel", it: "il timbro", itSyl: "TIM-bro", en: "stamp", x: x + 2, y: y - 0.4, w: 11, h: 8 });
  }
  /* Kugelschreiber an der Kette (Kundenseite) */
  {
    const x = -50, y = yT - 1.2;
    let g = `<path d="M${x - 3.4} ${y + 0.8} L${x + 3} ${y - 0.6}" stroke="#2c4f9e" stroke-width=".8" stroke-linecap="round"/><path d="M${x + 3} ${y - 0.6} l.8 -.2" stroke="#c9cfd4" stroke-width=".5"/>`;
    g += `<path d="M${x - 3.4} ${y + 0.8} q-1 .8 -1.6 2.2" stroke="#9aa2a8" stroke-width=".2" fill="none" stroke-dasharray=".3 .2"/>`;
    k += g;
    dok.push({ id: "ab_kugelschreiber", de: "der Kugelschreiber", syl: "KU-gel-schrei-ber", it: "la penna a sfera", itSyl: "PEN-na a SFE-ra", en: "ballpoint pen", x, y, w: 9, h: 4.5 });
  }
  dok.forEach((d) => tresenUnter.push({ id: d.id, de: d.de, syl: d.syl, it: d.it, itSyl: d.itSyl, en: d.en, tipp: d.tipp, x: cx + d.x, y: TR.yu + d.y + d.h / 2,
    kunst: flaeche(-d.w / 2, -d.h, d.w, d.h, 0.6) }));
  S.teil({ id: "ab_schalter_ab", de: "der Schalter", syl: "SCHAL-ter", it: "lo sportello", itSyl: "spor-TEL-lo", en: "counter", x: cx, y: TR.yu, steht: true, kunst: k,
    zoom: { x: TR.x0 + 4, y: 98, w: 120, h: 80 * 0.66 + 8 }, unter: tresenUnter,
    tipp: "Am Schalter gibt man den Antrag ab. Über dem Platz steht eine Nummer." });
}

/* =====================================================================
   9 — DIE GLASSCHEIBE (Schutzscheibe auf dem Tresen, mit Durchreiche)
   ===================================================================== */
{
  const x0 = 70, x1 = 148, yo = 84, yu = TR.yf - 1;
  let k = "";
  /* Rahmen: nur Profile und Fuß — die Scheibe selbst fängt keinen Tipp (sie liegt in „davor“) */
  const cx = (x0 + x1) / 2;
  k += `<rect x="${x0 - cx - 1}" y="${yo - yu}" width="2" height="${yu - yo}" rx=".6" fill="${STAHL}"/><rect x="${x1 - cx - 1}" y="${yo - yu}" width="2" height="${yu - yo}" rx=".6" fill="${STAHL}"/>`;
  k += `<rect x="${x0 - cx - 1}" y="${yo - yu - 1}" width="${x1 - x0 + 2}" height="2" rx=".6" fill="${STAHL}"/>`;
  k += `<rect x="${x0 - cx - 3}" y="-2" width="6" height="2" rx=".5" fill="#9aa2a8"/><rect x="${x1 - cx - 3}" y="-2" width="6" height="2" rx=".5" fill="#9aa2a8"/>`;
  /* Durchreiche unten rechts (neben dem Scanner) */
  k += `<path d="M14 0 L30 0 L28.6 -3.4 L15.4 -3.4 Z" fill="${STAHL}" opacity=".9"/><path d="M15.4 -3.4 L28.6 -3.4" stroke="#7d868d" stroke-width=".5"/>`;
  /* Spiegelstreifen (Teil der Zeichnung: so trifft man die Scheibe) */
  k += `<path d="M${x0 - cx + 6} ${yo - yu + 2} L${x0 - cx + 12} ${yo - yu + 2} L${x0 - cx + 4} -6 L${x0 - cx + 2} -6 Z" fill="#ffffff" opacity=".35"/>`;
  k += `<path d="M${x1 - cx - 14} ${yo - yu + 2} L${x1 - cx - 9} ${yo - yu + 2} L${x1 - cx - 17} -6 L${x1 - cx - 20} -6 Z" fill="#ffffff" opacity=".3"/>`;
  k += `<rect x="${x0 - cx + 22}" y="${yo - yu + 2}" width="12" height="4.4" rx=".4" fill="#ffffff" opacity=".92"/>` + T(x0 - cx + 28, yo - yu + 5.3, 2.6, "Platz 3", "#2f6f78", ' font-weight="bold"');
  S.teil({ oben: false, id: "ab_glasscheibe_ab", de: "die Glasscheibe", syl: "GLAS-schei-be", it: "il vetro divisorio", itSyl: "VE-tro di-vi-SO-rio", en: "glass screen", x: cx, y: yu, kunst: k,
    tipp: "Die Glasscheibe schützt beide Seiten — Dokumente gehen durch die Durchreiche." });
  S.davor(`<rect x="${x0}" y="${yo}" width="${x1 - x0}" height="${yu - yo}" fill="${S.lg("scheibe", [[0, "#ffffff", 0.22], [0.5, "#e6f3f6", 0.08], [1, "#ffffff", 0.16]], 0, 0, 1, 1)}"/>`);
}

/* =====================================================================
   10 — DER FINGERABDRUCKSCANNER (auf dem Tresen, Kundenseite)
   ===================================================================== */
{
  let k = schatten(0, 0.2, 6, 0.8, 0.3);
  k += `<path d="M-6 0 L6 0 L5.4 -4.4 Q5.2 -5.4 4 -5.4 L-4 -5.4 Q-5.2 -5.4 -5.4 -4.4 Z" fill="${SCHWARZ}"/>`;
  k += `<path d="M-3.6 -4.8 L3.6 -4.8 L3.2 -2 L-3.2 -2 Z" fill="${S.lg("sensor", [[0, "#6fe08a"], [1, "#2aa04a"]])}" opacity=".9"/>`;
  k += `<path d="M-1.4 -3.9 q1.4 -1 2.8 0 M-1.8 -3.2 q1.8 -1.3 3.6 0 M-1 -2.5 q1 -.6 2 0" stroke="#e9fff0" stroke-width=".2" fill="none"/>`;
  k += `<circle cx="4.6" cy="-1" r=".45" fill="#62e07a"/><path d="M-6 -.6 Q-9 0 -10 2" stroke="#2a2e33" stroke-width=".5" fill="none"/>`;
  k += `<path d="M-3.6 -4.8 L3.6 -4.8 L3.2 -2 L-3.2 -2 Z" fill="#9dffb4" opacity=".25" filter="url(#bw_weich)"/>`;
  S.teil({ oben: true, id: "ab_fingerabdruckscanner", de: "der Fingerabdruckscanner", syl: "FIN-ger-ab-druck-scan-ner", it: "lo scanner per impronte digitali", itSyl: "SCAN-ner per im-PRON-te di-gi-TA-li", en: "fingerprint scanner", x: 140, y: TR.yf + 0.4, steht: true, kunst: k,
    tipp: "Für die Karte werden zwei Fingerabdrücke gescannt — meist von den Zeigefingern." });
}

/* =====================================================================
   11 — DER WARTEMARKENAUTOMAT (Touchscreen-Säule, rechts)
   ===================================================================== */
{
  let k = schatten(0, 0.4, 11, 1.8, 0.32);
  k += `<path d="M-9 0 L9 0 L8 -3 L-8 -3 Z" fill="#4a5258"/>`;
  k += `<rect x="-7" y="-80" width="14" height="78" rx="2" fill="${S.lg("saeule", [[0, "#f3f4f4"], [0.5, "#dfe2e3"], [1, "#b9bec1"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-7" y="-80" width="14" height="6" rx="2" fill="${PETROL}"/>` + T(0, -75.8, 2.6, "Wartemarke", "#fff", ' font-weight="bold"');
  /* schräger Touchscreen */
  k += `<path d="M-6 -71 L6 -71 L6.6 -52 L-6.6 -52 Z" fill="#1d2125"/>`;
  k += `<path d="M-5 -70 L5 -70 L5.5 -53 L-5.5 -53 Z" fill="${S.lg("ts", [[0, "#ffffff"], [1, "#dde8ee"]])}"/>`;
  k += T(0, -66.6, 1.7, "Bitte wählen:", "#2d3a40", ' font-weight="bold"');
  [["A  Aufenthaltstitel", "#2f6f78"], ["B  Abholung Karte", "#3c6ea8"], ["C  Information", "#7a8a92"]].forEach(([t, c], i) => {
    k += `<rect x="-4.4" y="${-64.6 + i * 3.6}" width="8.8" height="2.8" rx=".5" fill="${c}"/>` + T(0, -62.6 + i * 3.6, 1.35, t, "#fff");
  });
  k += `<path d="M-5 -70 L-1 -70 L-5.5 -60 Z" fill="#fff" opacity=".25"/>`;
  /* Ausgabeschlitz mit herausschauender Marke */
  k += `<rect x="-4.4" y="-46" width="8.8" height="1.6" rx=".6" fill="#2a2e33"/>`;
  k += `<rect x="-6" y="-24" width="12" height="7" rx="1" fill="#e3e6e7" stroke="#b9bec1" stroke-width=".3"/>` + T(0, -19.6, 1.6, "Stadt · Bürgerservice", "#5a656b");
  k += `<rect x="-7" y="-80" width="2" height="78" fill="#fff" opacity=".35"/>`;
  S.teil({ id: "ab_automat", de: "der Wartemarkenautomat", syl: "WAR-te-mar-ken-au-to-mat", it: "il distributore di numeri", itSyl: "di-stri-bu-TO-re di NU-me-ri", en: "ticket machine", x: 300, y: 176, steht: true, kunst: k,
    tipp: "Am Automaten wählt man sein Anliegen und bekommt eine Wartemarke." });
}
{
  /* DIE WARTEMARKE — kommt gerade aus dem Schlitz */
  let k = `<path d="M-3.4 0 L3.4 0 L3.6 6.4 L-3.2 6.6 Z" fill="#fffefa" stroke="#c9ccc9" stroke-width=".15"/>`;
  k += `<text x="0" y="4.6" font-size="2.4" fill="#111" font-family="'Courier New',monospace" font-weight="bold" text-anchor="middle">A 118</text>`;
  k += `<rect x="-2.4" y="1" width="4.8" height=".4" fill="#9aa0a4"/>`;
  S.teil({ oben: true, id: "ab_wartemarke", de: "die Wartemarke", syl: "WAR-te-mar-ke", it: "il biglietto con il numero", itSyl: "bi-GLIET-to con il NU-me-ro", en: "queue ticket", x: 300, y: 176 - 45, kunst: k + flaeche(-4.4, -0.6, 8.8, 8) });
}

/* =====================================================================
   12 — DER ANTRAGSTELLER (am Schalter, legt den Finger auf den Scanner)
        und DIE DOLMETSCHERIN (neben ihm, mit Mappe)
   ===================================================================== */
{
  const m = figur({ id: "b08a_at", geschlecht: "m", pose: Object.assign({}, B_POSE("zeigen"), { lende: 5, brust: 2, kopf: 6, schulterR: { vor: 57, seit: 6, dreh: 0 }, ellbogenR: 12, handR: -6 }), blick: -66, frisur: "kurz", haarfarbe: "schwarz", haut: "dunkel", bart: true,
    kleidung: { oberteil: { stueck: "hemd", farbe: "hellblau" }, jacke: { stueck: "jacke", farbe: "#5b4a3a" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "halbschuh", farbe: "braun" } } }, 100);
  /* Fingerspitze genau auf die Glasfläche des Scanners setzen */
  const fs = m.z.punkte.fingerR, ax = 140 - fs[0] * m.k;
  S.teil({ id: "ab_antragsteller", de: "der Antragsteller", syl: "AN-trag-stel-ler", it: "il richiedente", itSyl: "ri-chie-DEN-te", en: "applicant", x: r(ax), y: 178, kunst: m.svg,
    tipp: "Er beantragt einen Aufenthaltstitel und legt den Finger auf den Scanner." });
}
{
  const m = figur({ id: "b08a_dol", geschlecht: "w", pose: "halten", blick: -42, frisur: "lang", haarfarbe: "dunkelbraun", haut: "oliv",
    kleidung: { oberteil: { stueck: "bluse", farbe: "creme" }, jacke: { stueck: "jacke", farbe: "#7a3b3b" }, unterteil: { stueck: "hose", farbe: "schwarz" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" }, zubehoer: { stueck: "buch", farbe: "#2f5f95" } } }, 94);
  S.teil({ id: "ab_dolmetscherin", de: "die Dolmetscherin", syl: "DOL-met-sche-rin", it: "l'interprete", itSyl: "in-TER-pre-te", en: "interpreter", x: 218, y: 170, kunst: m.svg,
    tipp: "Die Dolmetscherin übersetzt, was die Sachbearbeiterin fragt." });
}

/* =====================================================================
   13 — DER WARTESTUHL (einzeln, vorne rechts, frei)
   ===================================================================== */
{
  let k = schatten(0, 0.4, 13, 1.6, 0.3);
  const s = 58;
  /* vier Beine aus Stahlrohr */
  for (const [x, y] of [[-10, 0], [10, 0], [-8, -4], [8, -4]]) k += `<line x1="${x}" y1="${y}" x2="${x * 0.9}" y2="${r(-0.45 * s + 2)}" stroke="#6c757b" stroke-width="1.2" stroke-linecap="round"/>`;
  k += schalensitz(0, s);
  S.teil({ id: "ab_stuhl_ab", de: "der Wartestuhl", syl: "WAR-te-stuhl", it: "la sedia d'attesa", itSyl: "SE-dia d'at-TE-sa", en: "waiting chair", x: 252, y: 192, steht: true, kunst: k });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/auslaenderbehoerde.js"));
console.log(aus);
