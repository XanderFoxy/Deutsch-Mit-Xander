#!/usr/bin/env node
/* =====================================================================
   FAHRZEUGE & VERKEHR (FASSUNG 852) — Bilderwelt neu: die Uferstraße
   ---------------------------------------------------------------------
   Früher 25 Kacheln, jetzt ein Ort, an dem man all das wirklich sieht:
   eine Uferstraße in einer deutschen Großstadt am Fluss.

   RECHERCHE (DIN EN 1789 / Ländererlasse zur Farbgebung von
   Rettungswagen; Straßenbahn-Oberleitung 3,8–5,5 m; Bauweise moderner
   Niederflur-Straßenbahnen aus Modulen):
   - Hinten der FLUSS mit Ausflugsschiff und Motorboot, am anderen Ufer
     die Bahnstrecke mit dem Zug (wie am Rhein) und die Altstadt.
   - Am diesseitigen Ufer eine BAUSTELLE: Turmdrehkran, Kettenbagger
     belädt einen Kipper, ein Traktor mit Kipp-Anhänger fährt Erde ab
     (in Deutschland auf Baustellen üblich).
   - Die Straße: hinten die Spur mit Straßenbahngleisen und Oberleitung
     (Fahrdraht ≈ 5,5 m), dort fahren auch Bus und Transporter; vorn die
     Gegenspur mit Feuerwehr (HLF, rot RAL 3000) und Rettungswagen
     (Aufbau leuchtrot RAL 3024 mit weißem Streifen unten, Blaulicht).
   - Ganz vorn der Parkstreifen (Pflaster) mit Trabant, Oldtimer (Käfer),
     Auto, Cabrio, Supersportwagen; auf dem Gehweg Motorrad, Moped
     (Simson) und Fahrrad am Fahrradbügel.
   - Am Himmel ein Rettungshubschrauber und ein startendes Flugzeug.
   Maßstab (Einheiten je Meter): anderes Ufer 1,8 · Fluss 2,4–2,8 ·
   Baustelle 3,6 · hintere Spur 5 · vordere Spur 6,2 · Parkstreifen 7,8 ·
   Gehweg 8,4. Alle Fahrzeuge sind in Metern gezeichnet und skaliert.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "fahrzeuge", titel: "Fahrzeuge & Verkehr", emoji: "🚗", thema: "Fahrzeuge", kuerzel: "b26b", fassung: 852 });
const rnd = zufall(1435);
/* Verläufe nur einmal anlegen, auch wenn ein Bauteil mehrfach gezeichnet wird (kleine Datei) */
{ const lg0 = S.lg, rg0 = S.rg, c = {}; S.lg = (n, ...a) => c[n] || (c[n] = lg0(n, ...a)); S.rg = (n, ...a) => c["r" + n] || (c["r" + n] = rg0(n, ...a)); }
const r = B.r;

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const FELGE = S.rg("felge", [[0, "#f2f4f6"], [0.55, "#c2c8ce"], [1, "#7d858c"]], 0.42, 0.38, 0.65);
const SCHEIBE = S.lg("scheibe", [[0, "#a9c8dc"], [0.45, "#4d6f88"], [1, "#22374a"]]);
const SCHEIBE_D = S.lg("scheibed", [[0, "#6f8ea4"], [0.5, "#2c4255"], [1, "#16222e"]]);
const CHROM = S.lg("chrom", [[0, "#ffffff"], [0.5, "#b9c0c6"], [1, "#eef1f3"]]);
const BLAU = S.rg("blaulicht", [[0, "#cfe6ff"], [0.5, "#2f7bff"], [1, "#1440a8"]], 0.4, 0.35, 0.7);
const lack = (name, hell, mitte, dunkel) => S.lg(name, [[0, hell], [0.45, mitte], [1, dunkel]]);

/* ---------- Bauteile in METERN (Fußpunkt y = 0, x = Mitte) ---------- */
const rad = (x, R, felge = FELGE, speichen = 5) => {
  let g = `<circle cx="${x}" cy="${-R}" r="${R}" fill="#1a1b1e"/><circle cx="${x}" cy="${-R}" r="${r(R * 0.9 * 100) / 100}" fill="none" stroke="#2e3034" stroke-width="${r(R * 0.06 * 100) / 100}"/>`;
  g += `<circle cx="${x}" cy="${-R}" r="${(R * 0.6).toFixed(3)}" fill="${felge}"/>`;
  for (let i = 0; i < speichen; i++) {
    const a = i * 2 * Math.PI / speichen;
    g += `<line x1="${x}" y1="${-R}" x2="${(x + Math.cos(a) * R * 0.55).toFixed(3)}" y2="${(-R + Math.sin(a) * R * 0.55).toFixed(3)}" stroke="#8a929a" stroke-width="${(R * 0.08).toFixed(3)}"/>`;
  }
  g += `<circle cx="${x}" cy="${-R}" r="${(R * 0.16).toFixed(3)}" fill="#5b636b"/>`;
  return g;
};
const radkasten = (x, R) => `<circle cx="${x}" cy="${-R}" r="${(R * 1.12).toFixed(3)}" fill="#141518"/>`;
const m = (s, inner) => `<g transform="scale(${s})">${inner}</g>`;
const spiegelX = (inner) => `<g transform="scale(-1 1)">${inner}</g>`;

/* =====================================================================
   KULISSE — Himmel, Altstadt am anderen Ufer, Fluss, Ufer, Straße
   ===================================================================== */
S.hinten(`<rect width="320" height="70" fill="${S.lg("himmel", [[0, "#5d9bd8"], [0.7, "#a9cfee"], [1, "#e4eff6"]])}"/>`);
{
  let w = "";
  for (const [x, y, s] of [[40, 22, 1], [150, 12, 0.8], [230, 34, 1.1], [300, 10, 0.7]]) {
    w += `<g opacity=".85"><ellipse cx="${x}" cy="${y}" rx="${18 * s}" ry="${4 * s}" fill="#fff"/><ellipse cx="${x - 7 * s}" cy="${y - 2.6 * s}" rx="${8 * s}" ry="${4 * s}" fill="#fff"/><ellipse cx="${x + 6 * s}" cy="${y - 3.4 * s}" rx="${9 * s}" ry="${5 * s}" fill="#fff"/></g>`;
  }
  S.hinten(w);
}
/* Altstadt am anderen Ufer (≈ 1,8 Einheiten je Meter) */
S.def(`<pattern id="${S.id("fenster")}" width="2.8" height="3.6" patternUnits="userSpaceOnUse"><rect x=".6" y=".6" width="1.1" height="1.6" fill="#5c6f82" opacity=".7"/></pattern>`);
{
  let k = `<path d="M0 50 Q60 40 120 48 Q200 38 260 46 Q300 42 320 46 L320 66 L0 66 Z" fill="#8fae8a"/>`;
  const farben = ["#e8d6b9", "#d9b48f", "#f1e4c8", "#c99f86", "#e6cfa6", "#d8c3a5", "#efe0bf", "#cfa88c"];
  let x = 2;
  let i = 0;
  while (x < 318) {
    const w = 9 + rnd() * 8, h = 12 + rnd() * 9, base = 64;
    const f = farben[i++ % farben.length];
    k += `<rect x="${r(x)}" y="${r(base - h)}" width="${r(w)}" height="${r(h)}" fill="${f}"/>`;
    k += `<path d="M${r(x - 0.6)} ${r(base - h)} L${r(x + w / 2)} ${r(base - h - w * 0.55)} L${r(x + w + 0.6)} ${r(base - h)} Z" fill="${rnd() < 0.7 ? "#a5503a" : "#5d6670"}"/>`;
    k += `<rect x="${r(x + 1)}" y="${r(base - h + 2.4)}" width="${r(w - 2)}" height="${r(h - 4.6)}" fill="url(#${S.id("fenster")})"/>`;
    x += w + 0.4;
    /* Kirchturm und Dom */
    if (i === 6) { k += `<rect x="${r(x)}" y="28" width="7" height="36" fill="#c9b79a"/><path d="M${r(x - 0.5)} 28 L${r(x + 3.5)} 12 L${r(x + 7.5)} 28 Z" fill="#4f7d6c"/><rect x="${r(x + 2.4)}" y="34" width="2.2" height="3.6" rx="1" fill="#3f4a55"/><circle cx="${r(x + 3.5)}" cy="31" r="1.4" fill="#f1e4c8"/>`; x += 7.4; }
    if (i === 18) { k += `<rect x="${r(x)}" y="36" width="5" height="28" fill="#b9a68a"/><path d="M${r(x)} 36 Q${r(x + 2.5)} 26 ${r(x + 5)} 36 Z" fill="#4f7d6c"/><rect x="${r(x + 2.2)}" y="30" width=".6" height="2.4" fill="#4f7d6c"/>`; x += 5.4; }
  }
  /* Bahndamm mit Oberleitung am anderen Ufer */
  k += `<path d="M0 64 L320 64 L320 69 L0 69 Z" fill="#9a8f80"/><rect x="0" y="65.6" width="320" height=".5" fill="#6d655b"/>`;
  k += `<line x1="0" y1="57.4" x2="320" y2="57.4" stroke="#4a4f55" stroke-width=".18"/>`;
  for (let mx = 6; mx < 320; mx += 34) k += `<line x1="${mx}" y1="56.6" x2="${mx}" y2="65" stroke="#5b6168" stroke-width=".4"/><line x1="${mx}" y1="57" x2="${mx + 2.4}" y2="57" stroke="#5b6168" stroke-width=".3"/>`;
  S.hinten(k);
}
/* Fluss */
{
  let k = `<rect x="0" y="69" width="320" height="33" fill="${S.lg("fluss", [[0, "#6f9fb8"], [0.5, "#4f839f"], [1, "#3c6d88"]])}"/>`;
  k += `<rect x="0" y="69" width="320" height="3" fill="#a5c4d4" opacity=".5"/>`;
  for (let i = 0; i < 55; i++) {
    const y = 72 + rnd() * 28, x = rnd() * 320, w = 4 + (y - 70) * 0.25;
    k += `<path d="M${r(x)} ${r(y)} q${r(w / 2)} -.6 ${r(w)} 0" stroke="#cfe3ee" stroke-width=".35" fill="none" opacity="${r(0.25 + rnd() * 0.35)}"/>`;
  }
  /* Ufermauer diesseits */
  k += `<rect x="0" y="100" width="320" height="4" fill="${S.lg("kai", [[0, "#b7ab98"], [1, "#8e8270"]])}"/>`;
  for (let x = 0; x < 320; x += 6) k += `<line x1="${x}" y1="100" x2="${x}" y2="104" stroke="#7d7262" stroke-width=".25"/>`;
  S.hinten(k);
}
/* Baustelle (links, Sand) und Uferpromenade (rechts) */
{
  let k = `<path d="M0 103 L164 103 L170 118 L0 118 Z" fill="${S.lg("sand", [[0, "#c8a874"], [1, "#a8875a"]])}"/>`;
  for (let i = 0; i < 60; i++) k += `<circle cx="${r(rnd() * 166)}" cy="${r(104 + rnd() * 13)}" r="${r(0.3 + rnd() * 0.5)}" fill="${rnd() < 0.5 ? "#8f7149" : "#dcc194"}" opacity=".7"/>`;
  /* Erdhaufen und Baugrube */
  k += `<path d="M30 112 Q44 104 58 112 Z" fill="#8a6a41"/><path d="M2 116 Q16 108 30 116 Z" fill="#97764a"/>`;
  /* Promenade mit Geländer */
  k += `<path d="M164 103 L320 103 L320 118 L170 118 Z" fill="${S.lg("prom", [[0, "#cfc6b8"], [1, "#b3a998"]])}"/>`;
  for (let x = 170; x < 320; x += 10) k += `<line x1="${x}" y1="103" x2="${x - 2}" y2="118" stroke="#9c9282" stroke-width=".3"/>`;
  k += `<line x1="165" y1="100.2" x2="320" y2="100.2" stroke="#4d5359" stroke-width=".5"/>`;
  for (let x = 168; x < 320; x += 5) k += `<line x1="${x}" y1="100.2" x2="${x}" y2="103.4" stroke="#4d5359" stroke-width=".35"/>`;
  /* Baustellen-Absperrung (rot-weiße Baken) */
  for (let x = 6; x < 162; x += 14) k += `<rect x="${x}" y="114" width="1.2" height="4" fill="#fff"/><rect x="${x}" y="114.6" width="1.2" height=".9" fill="#d8262e"/><rect x="${x}" y="116.4" width="1.2" height=".9" fill="#d8262e"/>`;
  k += `<line x1="6" y1="114.8" x2="162" y2="114.8" stroke="#d8262e" stroke-width=".4" stroke-dasharray="2 1.4"/>`;
  /* Laternen an der Promenade */
  for (const x of [190, 300]) k += `<rect x="${x - 0.4}" y="96" width=".8" height="22" fill="#3d4349"/><path d="M${x} 96 q0 -3 3.4 -3" stroke="#3d4349" stroke-width=".7" fill="none"/><rect x="${x + 2.2}" y="92.6" width="3" height="1.2" rx=".4" fill="#3d4349"/>`;
  S.hinten(k);
}
/* Straße: hintere Spur mit Gleisen, Mittellinie, vordere Spur, Parkstreifen, Gehweg */
{
  let k = `<rect x="0" y="118" width="320" height="2" fill="#9a9a96"/>`;     // Bordstein hinten
  k += `<rect x="0" y="120" width="320" height="43" fill="${S.lg("asphalt", [[0, "#6a6d71"], [1, "#55585c"]])}"/>`;
  for (let i = 0; i < 160; i++) k += `<circle cx="${r(rnd() * 320)}" cy="${r(120 + rnd() * 43)}" r="${r(0.2 + rnd() * 0.3)}" fill="${rnd() < 0.5 ? "#7d8084" : "#4a4c50"}" opacity=".6"/>`;
  /* Gleise der Straßenbahn (Rillenschienen im Asphalt) */
  k += `<rect x="0" y="133.6" width="320" height=".9" fill="#9da3a8"/><rect x="0" y="135.6" width="320" height=".9" fill="#b3b8bc"/>`;
  /* Mittellinie (gestrichelt) */
  k += `<line x1="0" y1="140.5" x2="320" y2="140.5" stroke="#f2f2ee" stroke-width=".9" stroke-dasharray="9 7"/>`;
  /* Parkstreifen (Pflaster) und Bordstein */
  k += `<rect x="0" y="163" width="320" height="1.6" fill="#a9a9a4"/>`;
  k += `<rect x="0" y="164.6" width="320" height="24" fill="${S.lg("pflaster", [[0, "#8f8d88"], [1, "#a29f99"]])}"/>`;
  for (let y = 167; y < 188; y += 3.2) k += `<line x1="0" y1="${r(y)}" x2="320" y2="${r(y)}" stroke="#77756f" stroke-width=".25" opacity=".7"/>`;
  for (let i = -16; i <= 16; i++) k += `<line x1="${r(160 + i * 9)}" y1="164.6" x2="${r(160 + i * 12)}" y2="188.6" stroke="#77756f" stroke-width=".25" opacity=".55"/>`;
  /* Gehweg (große Platten, Fugen zum Fluchtpunkt) */
  k += `<rect x="0" y="188.6" width="320" height="1.4" fill="#b9b8b2"/><rect x="0" y="190" width="320" height="10" fill="${S.lg("gehweg", [[0, "#c9c6bf"], [1, "#d8d5ce"]])}"/>`;
  for (let i = -10; i <= 10; i++) k += `<line x1="${r(160 + i * 16)}" y1="190" x2="${r(160 + i * 17.4)}" y2="200" stroke="#a9a69f" stroke-width=".3"/>`;
  k += `<line x1="0" y1="194.6" x2="320" y2="194.6" stroke="#a9a69f" stroke-width=".3"/>`;
  /* Oberleitung der Straßenbahn (Fahrdraht 5,5 m über der hinteren Spur) mit Masten am Bordstein */
  /* (liegt über der Baustelle, die weiter hinten ist → S.davor, fängt keinen Tipp ab) */
  let ol = `<line x1="0" y1="107.6" x2="320" y2="107.6" stroke="#2f3337" stroke-width=".35"/><line x1="0" y1="105.4" x2="320" y2="105.4" stroke="#2f3337" stroke-width=".22"/>`;
  for (let i = 0; i < 26; i++) { const x = 6 + i * 12.4; ol += `<line x1="${r(x)}" y1="105.4" x2="${r(x)}" y2="107.6" stroke="#2f3337" stroke-width=".15"/>`; }
  for (const x of [8, 168, 316]) ol += `<rect x="${x - 0.7}" y="100" width="1.4" height="19" fill="${S.lg("mast", [[0, "#5d646b"], [1, "#3a3f44"]], 0, 0, 1, 0)}"/><line x1="${x}" y1="105.4" x2="${x + 10}" y2="105.4" stroke="#3a3f44" stroke-width=".4"/>`;
  S.davor(ol);
  /* Ampel an der Ecke des Parkstreifens */
  k += `<rect x="227.4" y="150" width="1.2" height="41" fill="#4b5157"/><rect x="225.4" y="143" width="5.2" height="12" rx="1" fill="#2a2d31"/>`;
  k += `<circle cx="228" cy="145.6" r="1.3" fill="#4a2020"/><circle cx="228" cy="149" r="1.3" fill="#4a3e1c"/><circle cx="228" cy="152.4" r="1.3" fill="#3fe36a"/><circle cx="228" cy="152.4" r="2.4" fill="#3fe36a" opacity=".25"/>`;
  S.hinten(k);
}

/* =====================================================================
   1 — DAS FLUGZEUG (startet, steigt nach rechts) und 2 — DER HUBSCHRAUBER
   ===================================================================== */
{
  let g = `<path d="M-18 0.2 Q-19.4 -1.6 -17 -1.9 L14 -1.9 Q18.6 -1.6 19.6 -.2 Q18.6 1.4 14 1.6 L-16 1.6 Q-18 1.4 -18 .2 Z" fill="${S.lg("rumpf", [[0, "#ffffff"], [0.6, "#e9edf1"], [1, "#b7c0c8"]])}"/>`;
  g += `<path d="M-15 -1.8 L-19 -9 L-15.6 -9 L-10 -1.8 Z" fill="#1f4f9a"/><path d="M-16 .2 L-21 .8 L-20 1.6 L-14 .9 Z" fill="#c9d1d8"/>`;
  g += `<path d="M-3 .6 L-8 6.4 L-5.4 6.4 L4 .8 Z" fill="#cfd6dc"/><rect x="-5" y="1.4" width="5" height="1.8" rx=".9" fill="#9aa3ab"/>`;
  g += `<path d="M15.6 -1.6 Q18 -1.4 18.8 -.6 L16 -.6 Z" fill="#2c3e52"/>`;
  for (let i = 0; i < 16; i++) g += `<circle cx="${r(-12 + i * 1.6)}" cy="-.7" r=".28" fill="#2c3e52"/>`;
  g += `<rect x="-17" y=".7" width="34" height=".35" fill="#1f4f9a"/>`;
  const k = `<g transform="rotate(-9)">${m(0.78, g)}</g>`;
  S.teil({ id: "flugzeug", de: "das Flugzeug", syl: "FLUG-zeug", it: "l'aereo", itSyl: "a-E-re-o", en: "aeroplane", x: 266, y: 22, kunst: k,
    tipp: "Das Flugzeug ist gerade gestartet und steigt in den Himmel." });
}
{
  /* Rettungshubschrauber (Meter, Mitte = Kabine) */
  let g = `<path d="M-2.6 -.2 Q-3 -2.6 -1 -3 L2 -3 Q4 -2.8 4.6 -1 Q4.6 .6 2.6 .8 L-1.6 .8 Q-2.6 .6 -2.6 -.2 Z" fill="${lack("hubi", "#ff6a4a", "#e0321e", "#a81c10")}"/>`;
  g += `<path d="M-2.6 -1.2 L-8.4 -1.8 L-8.4 -1 L-2.4 .2 Z" fill="#e0321e"/><path d="M-8.6 -3.4 L-7.6 -3.4 L-7 -1.2 L-8.6 -1.2 Z" fill="#c42816"/>`;
  g += `<path d="M1.2 -2.7 L2.4 -2.7 Q3.8 -2.4 4.2 -1.1 L1.2 -1.1 Z" fill="${SCHEIBE}"/><rect x="-1.4" y="-2.5" width="2.2" height="1.4" rx=".3" fill="${SCHEIBE}"/>`;
  g += `<rect x="-2.4" y="-.6" width="6.6" height=".7" fill="#ffffff"/>`;
  g += `<path d="M-1.6 1.6 L3.4 1.6 M-.6 .8 L-1 1.6 M2.4 .8 L2.6 1.6" stroke="#3a3f44" stroke-width=".22" fill="none"/>`;
  g += `<rect x="-.6" y="-3.6" width="2" height=".7" rx=".2" fill="#5b636b"/><ellipse cx=".4" cy="-3.8" rx="5.6" ry=".35" fill="#2a2d31" opacity=".55"/><ellipse cx=".4" cy="-3.8" rx="5.6" ry=".9" fill="#b9c0c6" opacity=".18"/>`;
  g += `<circle cx="-8" cy="-2.4" r="1.1" fill="#b9c0c6" opacity=".35"/>`;
  g += `<text x=".8" y="-.05" font-size=".52" text-anchor="middle" fill="#c42816" font-family="Arial" font-weight="bold">Christoph 3</text>`;
  S.teil({ id: "hubschrauber", de: "der Hubschrauber", syl: "HUB-schrau-ber", it: "l'elicottero", itSyl: "e-li-COT-te-ro", en: "helicopter", x: 170, y: 34, kunst: m(2.1, g),
    tipp: "Rettungshubschrauber heißen in Deutschland „Christoph“." });
}

/* =====================================================================
   3 — DER ZUG am anderen Ufer (Hochgeschwindigkeitszug, fährt nach links)
   ===================================================================== */
{
  const s = 1.8;
  let g = "";
  const wagen = (x0, x1, kopf) => {
    let w = "";
    if (kopf) w += `<path d="M${x0} -.6 Q${x0 + 0.4} -2.6 ${x0 + 5} -3.7 L${x1} -3.7 L${x1} -.6 Z" fill="${S.lg("ice", [[0, "#ffffff"], [0.7, "#eef1f3"], [1, "#c5ccd2"]])}"/>`;
    else w += `<rect x="${x0}" y="-3.7" width="${x1 - x0}" height="3.1" rx=".3" fill="${S.lg("ice", [[0, "#ffffff"], [1, "#c5ccd2"]])}"/>`;
    w += `<rect x="${kopf ? x0 + 4.6 : x0 + 0.6}" y="-2.9" width="${kopf ? x1 - x0 - 5.2 : x1 - x0 - 1.2}" height="1" fill="#26313c"/>`;
    w += `<rect x="${kopf ? x0 + 1.2 : x0}" y="-1.3" width="${kopf ? x1 - x0 - 1.2 : x1 - x0}" height=".35" fill="#e2001a"/>`;
    if (kopf) w += `<path d="M${x0 + 1.4} -2.1 Q${x0 + 2.6} -3.2 ${x0 + 4.4} -3.3 L${x0 + 4.4} -2.3 Z" fill="#26313c"/>`;
    w += `<rect x="${x0 + 3}" y="-.6" width="2.6" height=".4" fill="#3a3f44"/><rect x="${x1 - 5.6}" y="-.6" width="2.6" height=".4" fill="#3a3f44"/>`;
    return w;
  };
  g += wagen(-38, -12.5, true) + wagen(-12.2, 12.8, false) + wagen(13.1, 38, false);
  g += `<path d="M-20 -3.7 L-18 -5.4 L-15 -5.4" stroke="#3a3f44" stroke-width=".25" fill="none"/>`;
  S.teil({ id: "zug", de: "der Zug", syl: "ZUG", it: "il treno", itSyl: "TRE-no", en: "train", x: 218, y: 65.6, kunst: m(s, g) + flaeche(-69, -8, 138, 8),
    tipp: "Am anderen Ufer fährt der Zug – wie am Rhein, wo die Bahn direkt am Fluss liegt." });
}

/* =====================================================================
   4 — DAS SCHIFF (Ausflugsschiff) und 5 — DAS BOOT (Motorboot)
   ===================================================================== */
{
  let g = `<path d="M-16 -2.6 L16.4 -2.6 Q15.6 -.6 14 0 L-14.6 0 Q-15.8 -.8 -16 -2.6 Z" fill="${S.lg("rumpf2", [[0, "#ffffff"], [1, "#d5dbe0"]])}"/>`;
  g += `<rect x="-15.4" y="-1.5" width="30.6" height=".6" fill="#1d4f8f"/><rect x="-14.6" y="-.4" width="28.6" height=".4" fill="#7a2a22"/>`;
  g += `<rect x="-13" y="-5" width="25" height="2.4" fill="#f6f7f8"/><rect x="-11" y="-7.2" width="19" height="2.2" fill="#f0f2f4"/>`;
  for (let x = -12.4; x < 11.4; x += 1.6) g += `<rect x="${r(x)}" y="-4.5" width="1.1" height="1.3" fill="${SCHEIBE}"/>`;
  for (let x = -10.4; x < 7.4; x += 1.6) g += `<rect x="${r(x)}" y="-6.8" width="1.1" height="1.2" fill="${SCHEIBE}"/>`;
  g += `<rect x="5" y="-9" width="3.6" height="1.8" rx=".2" fill="#ffffff"/><rect x="5.3" y="-8.7" width="3" height=".8" fill="${SCHEIBE}"/>`;
  g += `<path d="M-11 -7.2 L-11 -8.2 M-11 -8 L8 -8 M8 -8 L8 -7.2" stroke="#7d858c" stroke-width=".12" fill="none"/>`;
  for (let x = -10.6; x < 5; x += 0.8) g += `<line x1="${r(x)}" y1="-8" x2="${r(x)}" y2="-7.2" stroke="#7d858c" stroke-width=".07"/>`;
  g += `<rect x="-15" y="-6.6" width=".14" height="4" fill="#5b636b"/><path d="M-15 -6.6 l-1.6 .5 l1.6 .5 Z" fill="#d8262e"/><path d="M-15 -6.1 l-1.6 .5 l1.6 .5 Z" fill="#f2c230"/>`;
  g += `<text x="-2" y="-1.65" font-size=".72" text-anchor="middle" fill="#1d4f8f" font-family="Georgia,serif" font-style="italic">MS Helene</text>`;
  g += `<path d="M16 -.2 q2 .4 3.4 0 M15.2 .2 q3 .5 5.6 0" stroke="#e8f2f7" stroke-width=".18" fill="none" opacity=".8"/>`;
  const k = `<ellipse cx="0" cy=".4" rx="42" ry="1.4" fill="#2a5268" opacity=".35"/>` + m(2.4, g);
  S.teil({ id: "schiff", de: "das Schiff", syl: "SCHIFF", it: "la nave", itSyl: "NA-ve", en: "ship", x: 234, y: 90, kunst: k,
    tipp: "Das Ausflugsschiff fährt mit Gästen auf dem Fluss." });
}
{
  let g = `<path d="M-3.3 -.9 L3.2 -.9 Q2.6 -.2 1.6 0 L-2.6 0 Q-3.2 -.3 -3.3 -.9 Z" fill="#ffffff"/><rect x="-3.2" y="-.75" width="6" height=".22" fill="#1f6fb2"/>`;
  g += `<path d="M-1.6 -.9 L-.6 -1.7 L.6 -1.7 L.9 -.9 Z" fill="${SCHEIBE}" opacity=".85"/><rect x="1.4" y="-1.25" width="1.2" height=".35" rx=".1" fill="#e3e6e9"/>`;
  g += `<path d="M3.2 -.3 q2 .2 4.8 .4 M2.8 0 q2.6 .5 5.6 .6" stroke="#ffffff" stroke-width=".18" fill="none" opacity=".75"/>`;
  S.teil({ id: "boot", de: "das Boot", syl: "BOOT", it: "la barca", itSyl: "BAR-ca", en: "boat", x: 156, y: 97, kunst: m(2.8, g) + flaeche(-10, -6, 24, 7) });
}

/* =====================================================================
   6 — DER KRAN (Turmdrehkran der Baustelle, 3,6 Einheiten je Meter)
   ===================================================================== */
{
  const s = 3.6;
  let g = `<rect x="-1.8" y="-.8" width="3.6" height=".8" fill="#8f949a"/><rect x="-1.4" y="-1.8" width="2.8" height="1" fill="#a5aab0"/>`;
  /* Gitterturm */
  const T = 26;
  g += `<rect x="-.8" y="${-T}" width=".18" height="${T - 1.8}" fill="#d9aa00"/><rect x=".62" y="${-T}" width=".18" height="${T - 1.8}" fill="#d9aa00"/>`;
  let fach = "";
  for (let y = -1.8; y > -T; y -= 1.6) fach += `M-.7 ${r(y)} L.7 ${r(y - 1.6)} M.7 ${r(y)} L-.7 ${r(y - 1.6)} M-.7 ${r(y)} L.7 ${r(y)} `;
  g += `<path d="${fach}" stroke="#f2c400" stroke-width=".09" fill="none"/>`;
  /* Turmspitze, Ausleger nach rechts, Gegenausleger mit Ballast nach links */
  g += `<path d="M-.8 ${-T} L0 ${-T - 3.2} L.8 ${-T}" stroke="#d9aa00" stroke-width=".18" fill="none"/>`;
  g += `<path d="M0 ${-T - 3.2} L25.6 ${-T + 0.2} M0 ${-T - 3.2} L-6 ${-T + 0.2}" stroke="#7d858c" stroke-width=".07"/>`;
  g += `<rect x="-.8" y="${-T}" width="26.6" height=".22" fill="#e0b000"/><rect x="-.8" y="${-T + 1}" width="26.6" height=".14" fill="#e0b000"/>`;
  let aus = "";
  for (let x = 0; x < 25.6; x += 1.2) aus += `M${r(x)} ${-T + 0.2} L${r(x + 0.6)} ${-T + 1} L${r(x + 1.2)} ${-T + 0.2} `;
  g += `<path d="${aus}" stroke="#f2c400" stroke-width=".07" fill="none"/>`;
  g += `<rect x="-6" y="${-T}" width="5.4" height=".9" fill="#e0b000"/><rect x="-6" y="${-T + 0.9}" width="2.4" height="2.2" fill="#9ea3a8"/><rect x="-5.9" y="${-T + 1.8}" width="2.2" height=".08" fill="#7d858c"/>`;
  /* Führerhaus */
  g += `<rect x=".8" y="${-T - 0.2}" width="1.6" height="1.6" rx=".2" fill="#f2c400"/><rect x="1.5" y="${-T + 0.1}" width=".8" height=".8" fill="${SCHEIBE}"/>`;
  /* Laufkatze, Seil, Haken mit Betonkübel */
  const hx = 15;
  g += `<rect x="${hx - 0.5}" y="${-T + 1.1}" width="1" height=".4" fill="#5b636b"/><line x1="${hx}" y1="${-T + 1.5}" x2="${hx}" y2="-13.6" stroke="#2f3337" stroke-width=".06"/>`;
  g += `<path d="M${hx - 0.3} -13.6 h.6 l-.1 .5 h-.4 Z" fill="#d8262e"/><path d="M${hx} -13.1 q.3 .4 0 .7" stroke="#2f3337" stroke-width=".08" fill="none"/>`;
  g += `<path d="M${hx - 0.7} -12.3 L${hx + 0.7} -12.3 L${hx + 0.4} -10.6 L${hx - 0.4} -10.6 Z" fill="#8f949a"/><path d="M${hx - 0.7} -12.3 L${hx} -12.8 L${hx + 0.7} -12.3" stroke="#2f3337" stroke-width=".06" fill="none"/>`;
  g += `<text x="12" y="${-T + 0.82}" font-size=".62" fill="#2f3337" font-family="Arial" font-weight="bold">BAU · KRAUSE</text>`;
  S.teil({ id: "kran", de: "der Kran", syl: "KRAN", it: "la gru", itSyl: "GRU", en: "crane", x: 22, y: 108, kunst: schatten(0, 0, 8, 1, .3) + m(s, g),
    tipp: "Der Turmdrehkran hebt schwere Lasten auf der Baustelle." });
}

/* =====================================================================
   7 — DER BAGGER (Kettenbagger, belädt den Kipper)
   ===================================================================== */
{
  const s = 3.6;
  let g = `<rect x="-2.3" y="-.9" width="4.6" height=".9" rx=".45" fill="#2e3034"/>`;
  for (let i = 0; i < 7; i++) g += `<circle cx="${r(-1.9 + i * 0.63)}" cy="-.45" r=".24" fill="#4a4e54"/>`;
  g += `<rect x="-2.2" y="-.95" width="4.4" height=".16" fill="#1d1f22"/>`;
  g += `<rect x="-.5" y="-1.2" width="1" height=".35" fill="#3a3d42"/>`;
  /* Oberwagen: Heck (Gegengewicht) links, Kabine Mitte-rechts */
  g += `<path d="M-2.4 -1.2 L1.8 -1.2 L1.8 -2.2 L-1.9 -2.2 Q-2.4 -2.1 -2.4 -1.7 Z" fill="${lack("bagger", "#ffd24a", "#f2b705", "#b98600")}"/>`;
  g += `<path d="M.1 -2.2 L.1 -3.5 Q.1 -3.7 .3 -3.7 L1.4 -3.7 L1.8 -2.2 Z" fill="#f2b705"/><path d="M.3 -2.4 L.3 -3.5 L1.3 -3.5 L1.6 -2.4 Z" fill="${SCHEIBE}"/>`;
  g += `<rect x="-2" y="-2.5" width=".9" height=".3" fill="#2e3034"/>`;
  /* Ausleger und Stiel, Löffel über dem Kipper */
  g += `<path d="M1.6 -1.9 Q3.4 -4.8 4.6 -4.6 L5.0 -4.2 Q3.8 -4.2 2.2 -1.6 Z" fill="#f2b705"/>`;
  g += `<path d="M4.6 -4.6 L6.8 -3.4 L6.6 -3.1 L4.5 -4.1 Z" fill="#e0a800"/>`;
  g += `<path d="M6.4 -3.6 L7.6 -3.1 L7.4 -2.2 Q6.8 -1.9 6.3 -2.4 Z" fill="#5b5f64"/>`;
  g += `<path d="M6.6 -2.2 q.4 .5 .2 1 M7.1 -2.1 q.3 .6 0 1.1" stroke="#7a5a33" stroke-width=".12" fill="none"/>`;
  g += `<line x1="2.4" y1="-2.7" x2="4.4" y2="-4.2" stroke="#c9ced3" stroke-width=".14"/>`;
  S.teil({ id: "bagger", de: "der Bagger", syl: "BAG-ger", it: "l'escavatore", itSyl: "e-sca-va-TO-re", en: "excavator", x: 58, y: 110, kunst: schatten(0, 0, 9, 1, .3) + m(s, g),
    tipp: "Der Bagger lädt die Erde auf den Lastwagen." });
}

/* =====================================================================
   8 — DER LASTWAGEN (Dreiachs-Kipper, Führerhaus rechts)
   ===================================================================== */
{
  const s = 3.6;
  let g = "";
  g += `<rect x="-4" y="-1.25" width="8" height=".35" fill="#2e3034"/>`;
  /* Kippmulde mit Erde */
  g += `<path d="M-4 -1.2 L1.6 -1.2 L1.9 -2.9 L-4 -2.9 Z" fill="${lack("mulde", "#c9ced3", "#9aa2a9", "#6f777f")}"/>`;
  for (let x = -3.4; x < 1.6; x += 0.9) g += `<line x1="${r(x)}" y1="-2.9" x2="${r(x)}" y2="-1.2" stroke="#7d858c" stroke-width=".07"/>`;
  g += `<path d="M-3.8 -2.9 Q-2 -3.8 -.4 -3.3 Q.8 -3.6 1.7 -2.9 Z" fill="#7a5a33"/>`;
  /* Führerhaus */
  g += `<path d="M2.1 -1.0 L2.1 -3.3 Q2.1 -3.5 2.3 -3.5 L3.7 -3.5 Q4.0 -3.5 4.05 -3.2 L4.1 -1.0 Z" fill="${lack("lkwkab", "#ff9a3c", "#ef7d00", "#b45b00")}"/>`;
  g += `<path d="M2.4 -2.1 L2.4 -3.2 L3.85 -3.2 L3.95 -2.1 Z" fill="${SCHEIBE}"/><rect x="2.2" y="-1.6" width="1.8" height=".08" fill="#b45b00"/><rect x="3.1" y="-2.0" width=".3" height=".08" fill="#2e3034"/>`;
  g += `<rect x="3.95" y="-1.5" width=".2" height=".5" fill="#2e3034"/><rect x="4.0" y="-1.3" width=".12" height=".2" fill="#fff3c0"/>`;
  g += `<rect x="1.85" y="-2.9" width=".14" height="1.7" fill="#5b636b"/>`;
  g += radkasten(-2.9, .5) + radkasten(-1.75, .5) + radkasten(3.1, .5);
  g += rad(-2.9, .5) + rad(-1.75, .5) + rad(3.1, .5);
  S.teil({ id: "lkw", de: "der Lastwagen", syl: "LAST-wa-gen", it: "il camion", itSyl: "CA-mion", en: "lorry", x: 96, y: 112, kunst: schatten(0, 0, 15, 1.1, .3) + m(s, g),
    tipp: "Der Lastwagen – kurz Lkw – bringt die Erde von der Baustelle weg." });
}

/* =====================================================================
   9 — DER TRAKTOR (fährt nach links) und 10 — DER ANHÄNGER (Kipp-Anhänger)
   ===================================================================== */
{
  const s = 3.6;
  let g = "";
  /* Motorhaube vorne links, Kabine hinten rechts */
  g += `<path d="M-2.2 -1.0 L-2.2 -1.85 Q-2.2 -2.05 -2.0 -2.05 L.2 -2.05 L.2 -1.0 Z" fill="${lack("traktor", "#6fbf5a", "#3f8a3a", "#2a5e27")}"/>`;
  for (let i = 0; i < 4; i++) g += `<line x1="${-2.1 + i * 0.12}" y1="-1.9" x2="${-2.1 + i * 0.12}" y2="-1.2" stroke="#2a5e27" stroke-width=".05"/>`;
  g += `<rect x="-1.2" y="-2.6" width=".14" height=".6" fill="#3a3d42"/>`;
  g += `<path d="M.1 -1.0 L.1 -3.0 L1.6 -3.0 L1.8 -1.0 Z" fill="#3f8a3a"/><path d="M.25 -1.9 L.25 -2.85 L1.45 -2.85 L1.6 -1.9 Z" fill="${SCHEIBE}"/>`;
  g += `<rect x=".05" y="-3.15" width="1.85" height=".2" rx=".08" fill="#2a2d31"/><rect x="1.6" y="-1.4" width=".7" height=".3" fill="#2a2d31"/>`;
  g += `<rect x="-2.3" y="-1.7" width=".14" height=".2" fill="#fff3c0"/>`;
  g += rad(-1.5, .5, "#e0b000", 6) + rad(1.1, .82, "#e0b000", 8);
  S.teil({ id: "traktor", de: "der Traktor", syl: "TRAK-tor", it: "il trattore", itSyl: "trat-TO-re", en: "tractor", x: 126, y: 113, kunst: schatten(0, 0, 9, 1, .3) + m(s, g) });
}
{
  const s = 3.6;
  let g = `<line x1="-3.6" y1="-.9" x2="-2.6" y2="-.9" stroke="#2e3034" stroke-width=".12"/>`;
  g += `<rect x="-2.8" y="-1.15" width="5.8" height=".25" fill="#2e3034"/>`;
  g += `<path d="M-2.8 -1.1 L3 -1.1 L3 -2.4 L-2.8 -2.4 Z" fill="${lack("anh", "#e05a4a", "#c0392b", "#8a2318")}"/>`;
  for (let x = -2.2; x < 3; x += 0.95) g += `<line x1="${r(x)}" y1="-2.4" x2="${r(x)}" y2="-1.1" stroke="#8a2318" stroke-width=".06"/>`;
  g += `<path d="M-2.7 -2.4 Q-1 -3.1 .4 -2.7 Q1.8 -3.2 2.9 -2.4 Z" fill="#7a5a33"/>`;
  g += rad(-.9, .42, FELGE, 5) + rad(.25, .42, FELGE, 5);
  S.teil({ id: "anhaenger", de: "der Anhänger", syl: "AN-hän-ger", it: "il rimorchio", itSyl: "ri-MOR-chio", en: "trailer", x: 149, y: 113, kunst: schatten(0, 0, 10, 1, .25) + m(s, g),
    tipp: "Den Anhänger zieht der Traktor." });
}

/* =====================================================================
   HINTERE SPUR (5 Einheiten je Meter, fährt nach links):
   11 — DER BUS, 12 — DER TRANSPORTER, 13 — DIE STRASSENBAHN
   ===================================================================== */
{
  const s = 5;
  let g = `<path d="M-6 -.35 L-6 -2.75 Q-6 -3.05 -5.7 -3.05 L5.8 -3.05 Q6 -3.05 6 -2.8 L6 -.35 Z" fill="${lack("bus", "#ffd95a", "#f2c230", "#c29200")}"/>`;
  g += `<rect x="-6" y="-.6" width="12" height=".3" fill="#3a3d42"/>`;
  /* Frontscheibe, Zielanzeige */
  g += `<path d="M-6 -2.6 L-5.6 -2.6 L-5.6 -.9 L-6 -.9 Z" fill="${SCHEIBE_D}"/>`;
  g += `<rect x="-5.8" y="-2.98" width="2.6" height=".36" fill="#141518"/><text x="-4.5" y="-2.7" font-size=".26" text-anchor="middle" fill="#ffb300" font-family="Arial" font-weight="bold">42 Hauptbahnhof</text>`;
  /* Fensterband mit Holmen */
  g += `<rect x="-5.4" y="-2.55" width="11.1" height="1.2" fill="${SCHEIBE}"/>`;
  for (const x of [-4.1, -2.6, -1.1, 0.4, 1.9, 3.4, 4.6]) g += `<rect x="${x}" y="-2.55" width=".14" height="1.2" fill="#c29200"/>`;
  /* Türen (doppelflügelig, verglast) */
  for (const x of [-5.25, -0.85, 3.65]) g += `<rect x="${x}" y="-2.55" width="1.1" height="2.1" fill="${SCHEIBE_D}" stroke="#8a6a00" stroke-width=".06"/><line x1="${x + 0.55}" y1="-2.55" x2="${x + 0.55}" y2="-.45" stroke="#8a6a00" stroke-width=".06"/>`;
  g += `<rect x="-2.2" y="-3.3" width="3.4" height=".26" rx=".1" fill="#e6c34a"/>`;
  g += radkasten(-3.4, .5) + radkasten(2.6, .5) + rad(-3.4, .5) + rad(2.6, .5);
  g += `<rect x="-6.05" y="-.95" width=".2" height=".25" fill="#fff3c0"/>`;
  S.teil({ id: "bus", de: "der Bus", syl: "BUS", it: "l'autobus", itSyl: "AU-to-bus", en: "bus", x: 50, y: 136, kunst: schatten(0, 0, 31, 1.2, .3) + m(s, g),
    tipp: "Der Bus Nummer 42 fährt zum Hauptbahnhof." });
}
{
  const s = 5;
  let g = `<path d="M-2.95 -.4 L-2.95 -1.0 Q-2.9 -1.25 -2.4 -1.45 L-1.7 -2.35 Q-1.5 -2.6 -1.1 -2.6 L2.9 -2.6 Q2.95 -2.6 2.95 -2.5 L2.95 -.4 Z" fill="${lack("trans", "#ffffff", "#eef1f3", "#c5ccd2")}"/>`;
  g += `<path d="M-2.3 -1.5 L-1.65 -2.35 L-1.2 -2.35 L-1.2 -1.5 Z" fill="${SCHEIBE}"/><path d="M-1.05 -2.35 L-.3 -2.35 L-.3 -1.5 L-1.05 -1.5 Z" fill="${SCHEIBE}"/>`;
  g += `<rect x="-2.95" y="-.62" width="5.9" height=".22" fill="#5b636b"/><rect x="-2.98" y="-1.15" width=".18" height=".2" fill="#fff3c0"/>`;
  g += `<text x="1.1" y="-1.45" font-size=".36" text-anchor="middle" fill="#1d4f8f" font-family="Arial" font-weight="bold">Malerbetrieb</text><text x="1.1" y="-1.0" font-size=".36" text-anchor="middle" fill="#1d4f8f" font-family="Arial" font-weight="bold">Krause</text>`;
  g += `<rect x="-1.2" y="-2.6" width=".05" height="2" fill="#c5ccd2"/>`;
  g += radkasten(-1.9, .36) + radkasten(1.9, .36) + rad(-1.9, .36) + rad(1.9, .36);
  S.teil({ id: "transporter", de: "der Transporter", syl: "Trans-POR-ter", it: "il furgone", itSyl: "fur-GO-ne", en: "van", x: 112, y: 136, kunst: schatten(0, 0, 15, 1, .3) + m(s, g) });
}
{
  const s = 5, L = 28;
  let g = "";
  const mod = (x0, x1, kopf) => {
    let w = kopf
      ? `<path d="M${x0} -.4 L${x0} -2.2 Q${x0 + 0.2} -3.2 ${x0 + 1.4} -3.3 L${x1} -3.3 L${x1} -.4 Z" fill="${lack("tram", "#ffffff", "#f2f4f6", "#cdd3d8")}"/>`
      : `<rect x="${x0}" y="-3.3" width="${x1 - x0}" height="2.9" fill="${lack("tram", "#ffffff", "#f2f4f6", "#cdd3d8")}"/>`;
    w += `<rect x="${x0 + (kopf ? 1.5 : 0.3)}" y="-2.65" width="${x1 - x0 - (kopf ? 1.8 : 0.6)}" height="1.3" fill="${SCHEIBE}"/>`;
    w += `<rect x="${x0}" y="-1.05" width="${x1 - x0}" height=".42" fill="#2e8b57"/>`;
    w += `<rect x="${x0}" y="-.62" width="${x1 - x0}" height=".22" fill="#5b636b"/>`;
    if (kopf) w += `<path d="M${x0 + 0.15} -2.1 Q${x0 + 0.35} -3.0 ${x0 + 1.3} -3.1 L${x0 + 1.3} -1.4 L${x0 + 0.1} -1.4 Z" fill="${SCHEIBE_D}"/><rect x="${x0 + 0.1}" y="-3.2" width="1.6" height=".3" fill="#141518"/><text x="${x0 + 0.9}" y="-2.97" font-size=".22" text-anchor="middle" fill="#ffb300" font-family="Arial" font-weight="bold">7 Zoo</text><rect x="${x0 - 0.05}" y="-.95" width=".2" height=".22" fill="#fff3c0"/>`;
    return w;
  };
  const xs = [-L / 2, -L / 2 + 8.6, -L / 2 + 14.6, L / 2 - 8.6, L / 2];
  g += mod(xs[0], xs[1] - 0.2, true) + mod(xs[1] + 0.2, xs[2] - 0.2, false) + mod(xs[2] + 0.2, xs[3] - 0.2, false) + mod(xs[3] + 0.2, xs[4], false);
  for (const x of [xs[1], xs[2], xs[3]]) g += `<rect x="${x - 0.25}" y="-3.0" width=".5" height="2.5" fill="#3a3d42"/>`;
  /* Türen (Doppeltüren, bis zum Boden: Niederflur) */
  for (const x of [-11.6, -3.4, 4.4, 10.4]) g += `<rect x="${x}" y="-2.65" width="1.3" height="2.25" fill="${SCHEIBE_D}" stroke="#9aa2a9" stroke-width=".06"/><line x1="${x + 0.65}" y1="-2.65" x2="${x + 0.65}" y2="-.4" stroke="#9aa2a9" stroke-width=".06"/>`;
  /* Drehgestelle, kaum sichtbar hinter der Schürze */
  for (const x of [-10, 2.6, 10.8]) g += `<rect x="${x - 0.9}" y="-.42" width="1.8" height=".42" rx=".1" fill="#2a2d31"/><circle cx="${x - 0.5}" cy="-.2" r=".2" fill="#4a4e54"/><circle cx="${x + 0.5}" cy="-.2" r=".2" fill="#4a4e54"/>`;
  /* Dachaufbauten und Stromabnehmer (Pantograf) bis zum Fahrdraht (5,7 m) */
  g += `<rect x="-6" y="-3.6" width="3" height=".3" rx=".1" fill="#c5ccd2"/><rect x="1" y="-3.6" width="2.4" height=".3" rx=".1" fill="#c5ccd2"/>`;
  g += `<path d="M-2.4 -3.35 L-1.2 -4.6 L-2.2 -5.7 M-1.6 -3.35 L-1.2 -4.6" stroke="#2f3337" stroke-width=".09" fill="none"/><rect x="-2.9" y="-5.78" width="1.4" height=".1" fill="#2f3337"/>`;
  S.teil({ id: "strassenbahn", de: "die Straßenbahn", syl: "STRA-ßen-bahn", it: "il tram", itSyl: "TRAM", en: "tram", x: 222, y: 136, kunst: schatten(0, 0, 72, 1.2, .3) + m(s, g),
    tipp: "Die Straßenbahn bekommt ihren Strom von oben aus der Oberleitung." });
}

/* =====================================================================
   VORDERE SPUR (6,2 Einheiten je Meter, fährt nach rechts):
   14 — DAS FEUERWEHRAUTO, 15 — DER KRANKENWAGEN, 16 — DER SPORTWAGEN
   ===================================================================== */
{
  const s = 6.2;
  let g = "";
  const ROTF = lack("fw", "#ff4a3a", "#d0161e", "#8e0d12");
  /* Aufbau mit Geräteräumen (Rollläden) hinten links, Mannschaftskabine vorne rechts */
  g += `<rect x="-4.1" y="-3.1" width="5.6" height="2.7" rx=".1" fill="${ROTF}"/>`;
  for (const [x0, x1] of [[-3.9, -2.1], [-1.9, -0.1], [0.1, 1.3]]) {
    g += `<rect x="${x0}" y="-2.95" width="${r(x1 - x0)}" height="1.75" fill="${S.lg("rollo", [[0, "#e9edf0"], [1, "#a9b1b8"]], 0, 0, 1, 0)}"/>`;
    for (let y = -2.85; y < -1.25; y += 0.16) g += `<line x1="${x0}" y1="${r(y)}" x2="${x1}" y2="${r(y)}" stroke="#8d959c" stroke-width=".025"/>`;
  }
  g += `<rect x="-4.1" y="-1.1" width="5.6" height=".25" fill="#ffffff"/>`;
  /* Kabine */
  g += `<path d="M1.6 -.4 L1.6 -2.95 Q1.6 -3.15 1.8 -3.15 L3.75 -3.15 Q4.05 -3.1 4.1 -2.8 L4.15 -.4 Z" fill="${ROTF}"/>`;
  g += `<path d="M1.8 -2.0 L1.8 -2.95 L2.75 -2.95 L2.75 -2.0 Z M2.9 -2.0 L2.9 -2.95 L3.85 -2.95 L3.98 -2.0 Z" fill="${SCHEIBE}"/>`;
  g += `<rect x="1.6" y="-1.1" width="2.55" height=".25" fill="#ffffff"/><text x="2.85" y="-1.35" font-size=".34" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">FEUERWEHR</text>`;
  g += `<rect x="4.0" y="-.9" width=".2" height=".3" fill="#fff3c0"/>`;
  /* Leiter auf dem Dach, Blaulichtbalken */
  g += `<rect x="-3.8" y="-3.35" width="4.8" height=".12" fill="${CHROM}"/><rect x="-3.8" y="-3.18" width="4.8" height=".08" fill="${CHROM}"/>`;
  for (let x = -3.6; x < 1; x += 0.35) g += `<line x1="${r(x)}" y1="-3.3" x2="${r(x)}" y2="-3.12" stroke="#9aa2a9" stroke-width=".04"/>`;
  g += `<rect x="2.2" y="-3.38" width="1.4" height=".24" rx=".1" fill="${BLAU}"/><ellipse cx="2.9" cy="-3.3" rx="1.2" ry=".4" fill="#4d8dff" opacity=".35"/>`;
  g += `<rect x="-4.1" y="-3.1" width=".14" height=".8" fill="${BLAU}"/>`;
  /* Warnmarkierung hinten */
  for (let i = 0; i < 4; i++) g += `<rect x="-4.1" y="${r(-0.85 + 0)}" width=".12" height=".45" fill="${i % 2 ? "#fff" : "#d0161e"}" transform="translate(${r(i * 0.0)} 0)"/>`;
  g += radkasten(-2.3, .55) + radkasten(2.9, .55) + rad(-2.3, .55) + rad(2.9, .55);
  g += `<rect x="-4.1" y="-.42" width="8.25" height=".1" fill="#2a2d31"/>`;
  S.teil({ id: "feuerwehr", de: "das Feuerwehrauto", syl: "FEU-er-wehr-au-to", it: "l'autopompa", itSyl: "au-to-POM-pa", en: "fire engine", x: 50, y: 158, kunst: schatten(0, 0, 27, 1.4, .32) + m(s, g),
    tipp: "Die Notrufnummer der Feuerwehr ist 112." });
}
{
  const s = 6.2;
  let g = "";
  /* Kofferaufbau leuchtrot mit weißem Streifen unten, Kabine weiß */
  g += `<rect x="-3.5" y="-2.85" width="4.6" height="2.45" rx=".15" fill="${lack("rtw", "#ff7a52", "#ff3b1f", "#c92a12")}"/>`;
  g += `<rect x="-3.5" y="-.95" width="4.6" height=".55" fill="#ffffff"/>`;
  g += `<rect x="-1.9" y="-2.5" width="1.1" height="1.2" fill="${SCHEIBE}" opacity=".9"/>`;
  g += `<text x="-1.1" y="-1.06" font-size=".32" text-anchor="middle" fill="#ffffff" font-family="Arial" font-weight="bold">RETTUNGSDIENST</text>`;
  /* Star of Life */
  g += `<g transform="translate(.35 -1.95)"><path d="M-.06 -.38 h.12 v.26 l.22 -.13 .06 .1 -.22 .13 .22 .13 -.06 .1 -.22 -.13 v.26 h-.12 v-.26 l-.22 .13 -.06 -.1 .22 -.13 -.22 -.13 .06 -.1 .22 .13 Z" fill="#1d5fd6" transform="scale(1.6)"/></g>`;
  g += `<path d="M1.1 -.4 L1.1 -2.35 Q1.1 -2.5 1.3 -2.5 L2.2 -2.5 Q2.5 -2.45 2.8 -1.7 L3.4 -1.45 Q3.55 -1.38 3.55 -1.1 L3.55 -.4 Z" fill="${lack("rtwk", "#ffffff", "#f2f4f6", "#cdd3d8")}"/>`;
  g += `<path d="M1.3 -1.6 L1.3 -2.3 L2.15 -2.3 Q2.35 -2.25 2.6 -1.6 Z" fill="${SCHEIBE}"/>`;
  g += `<rect x="1.1" y="-1.0" width="2.45" height=".2" fill="#ff3b1f"/><rect x="3.42" y="-1.2" width=".16" height=".2" fill="#fff3c0"/>`;
  g += `<rect x="1.3" y="-2.62" width=".9" height=".16" rx=".06" fill="${BLAU}"/><rect x="-3.5" y="-3.0" width=".4" height=".16" fill="${BLAU}"/><ellipse cx="1.75" cy="-2.56" rx=".9" ry=".3" fill="#4d8dff" opacity=".35"/>`;
  g += radkasten(-2.2, .38) + radkasten(2.5, .38) + rad(-2.2, .38) + rad(2.5, .38);
  S.teil({ id: "krankenwagen", de: "der Krankenwagen", syl: "KRAN-ken-wa-gen", it: "l'ambulanza", itSyl: "am-bu-LAN-za", en: "ambulance", x: 118, y: 158, kunst: schatten(0, 0, 23, 1.3, .3) + m(s, g),
    tipp: "Mit Blaulicht und Martinshorn darf der Krankenwagen schneller fahren." });
}
/* Sportwagen-Formen (Meter): Front rechts */
const SPORT = "M-2.25 -.3 L-2.27 -.72 Q-2.2 -.86 -1.9 -.92 Q-1.2 -1.2 -.5 -1.22 Q.15 -1.22 .55 -.96 Q1.4 -.86 2.1 -.7 Q2.3 -.6 2.28 -.3 Z";
{
  const s = 6.2;
  let g = `<path d="${SPORT}" fill="${lack("sport", "#ff5a4a", "#d0161e", "#7e0c10")}"/>`;
  g += `<path d="M-1.55 -.95 Q-1 -1.14 -.45 -1.15 Q.05 -1.14 .4 -.95 Z" fill="${SCHEIBE_D}"/><line x1="-.5" y1="-1.15" x2="-.55" y2="-.95" stroke="#7e0c10" stroke-width=".05"/>`;
  g += `<path d="M-2.1 -.72 Q-1 -.82 0 -.8 Q1.2 -.76 2.15 -.62" stroke="#ff8a7a" stroke-width=".04" fill="none" opacity=".7"/>`;
  g += `<path d="M2.05 -.68 L2.25 -.6 L2.2 -.5 Z" fill="#fff3c0"/><rect x="-2.27" y="-.7" width=".12" height=".12" fill="#ff2a2a"/>`;
  g += radkasten(-1.45, .34) + radkasten(1.4, .34) + rad(-1.45, .34, CHROM, 10) + rad(1.4, .34, CHROM, 10);
  S.teil({ id: "ferrari", de: "der Sportwagen", syl: "SPORT-wa-gen", it: "l'auto sportiva", itSyl: "AU-to spor-TI-va", en: "sports car", x: 252, y: 158, kunst: schatten(0, 0, 15, 1, .3) + m(s, g) });
}

/* =====================================================================
   PARKSTREIFEN (7,8 Einheiten je Meter): 17 — DER TRABANT,
   18 — DER OLDTIMER, 19 — DAS AUTO (Lupe), 20 — DAS CABRIO,
   21 — DER SUPERSPORTWAGEN
   ===================================================================== */
const PARK = 186;
{
  const s = 7.8;
  let g = `<path d="M-1.78 -.32 L-1.8 -.86 Q-1.78 -.96 -1.6 -.98 L-1.2 -.99 L-.85 -1.42 L.35 -1.42 L.78 -.99 L1.7 -.92 Q1.8 -.86 1.8 -.7 L1.78 -.32 Z" fill="${lack("trabi", "#cfe1e5", "#a9c3c9", "#7c979e")}"/>`;
  g += `<path d="M-1.05 -1.0 L-.8 -1.34 L-.25 -1.34 L-.25 -1.0 Z M-.15 -1.0 L-.15 -1.34 L.3 -1.34 L.62 -1.0 Z" fill="${SCHEIBE}"/>`;
  g += `<rect x="-1.79" y="-.42" width="3.58" height=".1" fill="${CHROM}"/><circle cx="1.66" cy="-.74" r=".09" fill="#fff3c0"/><rect x="-1.8" y="-.78" width=".08" height=".14" fill="#e03a2a"/>`;
  g += `<line x1="-.2" y1="-1.0" x2="-.2" y2="-.42" stroke="#7c979e" stroke-width=".02"/><rect x="0" y="-.82" width=".16" height=".04" fill="#7c979e"/>`;
  g += `<rect x="-1.79" y="-.94" width="3.5" height=".02" fill="#ffffff" opacity=".5"/>`;
  g += radkasten(-1.15, .28) + radkasten(1.2, .28) + rad(-1.15, .28, "#e8e8e4", 4) + rad(1.2, .28, "#e8e8e4", 4);
  S.teil({ id: "trabant", de: "der Trabant", syl: "Tra-BANT", it: "la Trabant", itSyl: "tra-BANT", en: "Trabant", x: 26, y: PARK, kunst: schatten(0, 0, 14, 1, .3) + m(s, g),
    tipp: "Der Trabant war das bekannteste Auto der DDR – man nannte ihn „Trabi“." });
}
{
  const s = 7.8;
  let g = `<path d="M-2.04 -.36 Q-2.1 -.7 -1.85 -.95 Q-1.4 -1.45 -.6 -1.5 Q.2 -1.52 .55 -1.2 L.95 -.95 Q1.6 -.92 1.95 -.75 Q2.08 -.6 2.04 -.36 Z" fill="${lack("kaefer", "#b8d8c0", "#8fb59a", "#5f8a6c")}"/>`;
  /* runde Kotflügel */
  g += `<path d="M-1.8 -.36 Q-1.75 -.98 -1.2 -1.0 Q-.7 -.98 -.62 -.36 Z" fill="#7fa58a"/><path d="M.6 -.36 Q.65 -.95 1.15 -.98 Q1.7 -.95 1.75 -.36 Z" fill="#7fa58a"/>`;
  g += `<path d="M-1.3 -1.02 Q-.9 -1.38 -.3 -1.4 L-.3 -1.02 Z M-.2 -1.02 L-.2 -1.4 Q.2 -1.4 .45 -1.15 L.6 -1.02 Z" fill="${SCHEIBE}"/>`;
  g += `<rect x="-.62" y="-.42" width="1.22" height=".06" fill="#3a3d42"/><rect x="-2.0" y="-.46" width="4" height=".07" fill="${CHROM}"/>`;
  g += `<circle cx="1.48" cy="-.88" r=".12" fill="${CHROM}"/><circle cx="1.5" cy="-.88" r=".08" fill="#fff3c0"/><rect x="-1.95" y="-.86" width=".1" height=".16" rx=".04" fill="#e03a2a"/>`;
  g += `<rect x="-.1" y="-.88" width=".16" height=".04" fill="${CHROM}"/>`;
  g += radkasten(-1.2, .32) + radkasten(1.17, .32) + rad(-1.2, .32, CHROM, 0) + rad(1.17, .32, CHROM, 0);
  g += `<circle cx="-1.2" cy="-.32" r=".1" fill="#5b636b"/><circle cx="1.17" cy="-.32" r=".1" fill="#5b636b"/>`;
  S.teil({ id: "oldtimer", de: "der Oldtimer", syl: "OLD-ti-mer", it: "l'auto d'epoca", itSyl: "AU-to d'E-po-ca", en: "vintage car", x: 66, y: PARK, kunst: schatten(0, 0, 16, 1, .3) + m(s, g),
    tipp: "Ein Oldtimer ist ein Auto, das älter als 30 Jahre ist – mit H-Kennzeichen." });
}
{
  /* DAS AUTO — Kompaktwagen, mit Lupe: Reifen, Tür, Außenspiegel, Scheinwerfer, Lenkrad */
  const s = 7.8, X = 110;
  let g = `<path d="M-2.25 -.3 L-2.28 -.9 Q-2.25 -1.28 -2.02 -1.4 Q-1.8 -1.5 -1.5 -1.5 L.5 -1.5 Q.75 -1.48 .9 -1.35 L1.35 -1.02 Q2.0 -.96 2.2 -.86 Q2.3 -.75 2.3 -.5 L2.28 -.3 Z" fill="${lack("auto", "#5d8fc7", "#2f5d8f", "#1b3a5e")}"/>`;
  g += `<path d="M-1.9 -1.04 L-1.8 -1.36 L-.45 -1.4 L-.45 -1.04 Z" fill="${SCHEIBE}"/><path d="M-.32 -1.04 L-.32 -1.4 L.48 -1.4 Q.62 -1.38 .72 -1.3 L1.02 -1.04 Z" fill="${SCHEIBE}"/>`;
  /* Lenkrad hinter der Seitenscheibe */
  g += `<ellipse cx=".55" cy="-1.12" rx=".05" ry=".16" fill="none" stroke="#141518" stroke-width=".05" transform="rotate(-25 .55 -1.12)"/><line x1=".55" y1="-1.12" x2=".4" y2="-1.0" stroke="#141518" stroke-width=".04"/>`;
  /* Türfugen, Griffe */
  g += `<path d="M-.4 -1.04 L-.4 -.36 M1.05 -1.0 L1.05 -.4 Q.5 -.34 -.4 -.36" stroke="#16304d" stroke-width=".025" fill="none"/><path d="M-1.85 -1.0 L-1.85 -.38" stroke="#16304d" stroke-width=".025"/>`;
  g += `<rect x=".55" y="-.92" width=".22" height=".05" rx=".02" fill="#9fb3c8"/><rect x="-1.0" y="-.92" width=".22" height=".05" rx=".02" fill="#9fb3c8"/>`;
  g += `<path d="M-2.2 -.98 Q0 -1.0 2.15 -.84" stroke="#8fb6e0" stroke-width=".04" fill="none" opacity=".6"/>`;
  /* Außenspiegel */
  g += `<path d="M.92 -1.08 L1.2 -1.12 Q1.28 -1.1 1.26 -1.0 L.95 -.98 Z" fill="#244a73"/>`;
  /* Scheinwerfer */
  g += `<path d="M1.98 -.86 L2.26 -.8 Q2.3 -.72 2.27 -.66 L1.95 -.7 Z" fill="${S.lg("sw", [[0, "#ffffff"], [1, "#cfd8e0"]])}" stroke="#7d8a96" stroke-width=".015"/>`;
  g += `<rect x="-2.28" y="-.98" width=".1" height=".26" rx=".03" fill="#d02020"/>`;
  g += `<rect x="-2.28" y="-.45" width="4.56" height=".15" fill="#1d2329"/>`;
  g += radkasten(-1.42, .32) + radkasten(1.38, .32) + rad(-1.42, .32) + rad(1.38, .32);
  const k = schatten(0, 0, 18, 1.1, .3) + m(s, g);
  const u = (id, de, syl, it, itSyl, en, mx, my, w, h, tipp) => ({ id, de, syl, it, itSyl, en, tipp, x: X + mx * s, y: PARK + my * s, kunst: flaeche(-w / 2, -h / 2, w, h, 0.8) });
  S.teil({ id: "auto", de: "das Auto", syl: "AU-to", it: "la macchina", itSyl: "MAC-chi-na", en: "car", x: X, y: PARK, kunst: k,
    zoom: { x: X - 25, y: PARK - 22, w: 50, h: 33 },
    unter: [
      u("reifen", "der Reifen", "REI-fen", "la gomma", "GOM-ma", "tyre", 1.38, -.32, 5.6, 5.6, "Im Winter braucht das Auto Winterreifen."),
      u("tuer", "die Tür", "TÜR", "la portiera", "por-TIE-ra", "door", .2, -.66, 7.4, 3.4, null),
      u("aussenspiegel", "der Außenspiegel", "AU-ßen-spie-gel", "lo specchietto", "spec-CHIET-to", "wing mirror", 1.12, -1.05, 3.2, 2.2, null),
      u("scheinwerfer", "der Scheinwerfer", "SCHEIN-wer-fer", "il faro", "FA-ro", "headlight", 2.15, -.76, 3.2, 2.2, null),
      u("lenkrad", "das Lenkrad", "LENK-rad", "il volante", "vo-LAN-te", "steering wheel", .45, -1.17, 2.6, 2.6, null),
      u("ruecklicht", "das Rücklicht", "RÜCK-licht", "il fanale posteriore", "fa-NA-le po-ste-RIO-re", "rear light", -2.22, -.85, 2.4, 3, null),
    ],
    tipp: "Das Auto parkt am Straßenrand. Mit der Lupe siehst du Reifen, Tür und Spiegel." });
}
{
  const s = 7.8;
  let g = `<path d="M-2.15 -.3 L-2.17 -.82 Q-2.1 -.98 -1.9 -1.0 L-1.55 -1.0 Q-1.5 -1.1 -1.0 -1.1 L-.95 -1.0 L.62 -1.0 L1.2 -.92 Q2.0 -.86 2.15 -.7 L2.15 -.3 Z" fill="${lack("cabrio", "#4a73b8", "#1d3f7a", "#10244a")}"/>`;
  /* zusammengelegtes Verdeck, Kopfstützen, Frontscheibe */
  g += `<path d="M-1.6 -1.0 Q-1.5 -1.18 -1.0 -1.18 L-.9 -1.0 Z" fill="#1d1f22"/>`;
  g += `<rect x="-.75" y="-1.32" width=".22" height=".34" rx=".08" fill="#3a2a20"/><rect x="-.08" y="-1.32" width=".22" height=".34" rx=".08" fill="#3a2a20"/>`;
  g += `<path d="M.6 -1.0 L.32 -1.36" stroke="#1d1f22" stroke-width=".05"/><path d="M.62 -1.0 L.34 -1.34 L.2 -1.34 L.48 -1.0 Z" fill="${SCHEIBE}" opacity=".7"/>`;
  g += `<path d="M-.95 -1.0 L.6 -1.0" stroke="#7a5a3a" stroke-width=".06"/>`;
  g += `<path d="M-2.1 -.8 Q0 -.86 2.1 -.7" stroke="#8fa8d8" stroke-width=".04" fill="none" opacity=".6"/><path d="M-.4 -1.0 L-.4 -.36" stroke="#10244a" stroke-width=".025"/>`;
  g += `<path d="M1.9 -.78 L2.15 -.72 L2.12 -.62 L1.88 -.66 Z" fill="#fff3c0"/><rect x="-2.17" y="-.86" width=".08" height=".2" fill="#e03a2a"/>`;
  g += radkasten(-1.35, .32) + radkasten(1.35, .32) + rad(-1.35, .32, CHROM, 6) + rad(1.35, .32, CHROM, 6);
  S.teil({ id: "cabrio", de: "das Cabrio", syl: "CA-brio", it: "la decappottabile", itSyl: "de-cap-pot-TA-bi-le", en: "convertible", x: 155, y: PARK, kunst: schatten(0, 0, 17, 1, .3) + m(s, g),
    tipp: "Beim Cabrio kann man das Dach öffnen." });
}
{
  const s = 7.8;
  let g = `<path d="M-2.35 -.32 L-2.37 -.78 L-1.9 -.92 Q-.9 -1.13 -.2 -1.13 L.4 -1.05 L2.2 -.56 Q2.38 -.46 2.35 -.3 Z" fill="${lack("super", "#ffc84a", "#f2a516", "#b56f00")}"/>`;
  g += `<path d="M-1.3 -.92 Q-.8 -1.06 -.2 -1.06 L.32 -1.0 L.9 -.86 Z" fill="${SCHEIBE_D}"/>`;
  g += `<path d="M-1.2 -.7 L-.4 -.72 L-.6 -.48 L-1.25 -.5 Z" fill="#2a2d31"/>`;
  g += `<path d="M1.95 -.62 L2.28 -.52 L2.2 -.46 L1.9 -.55 Z" fill="#ffffff"/><rect x="-2.37" y="-.74" width=".14" height=".06" fill="#ff2a2a"/>`;
  g += `<path d="M-2.3 -.36 L2.3 -.36" stroke="#2a2d31" stroke-width=".06"/>`;
  g += radkasten(-1.55, .36) + radkasten(1.45, .34) + rad(-1.55, .36, "#2a2d31", 5) + rad(1.45, .34, "#2a2d31", 5);
  S.teil({ id: "lamborghini", de: "der Supersportwagen", syl: "SU-per-sport-wa-gen", it: "la supersportiva", itSyl: "su-per-spor-TI-va", en: "supercar", x: 201, y: PARK, kunst: schatten(0, 0, 19, 1, .3) + m(s, g),
    tipp: "Ein Supersportwagen fährt schneller als 300 km/h." });
}

/* =====================================================================
   GEHWEG (8,4 Einheiten je Meter): 22 — DAS MOTORRAD, 23 — DAS MOPED,
   24 — DAS FAHRRAD (am Fahrradbügel)
   ===================================================================== */
const WEG = 197.4;
const zweirad = (R) => (x) => `<circle cx="${x}" cy="${-R}" r="${R}" fill="none" stroke="#1a1b1e" stroke-width="${r(R * 0.22 * 100) / 100}"/><circle cx="${x}" cy="${-R}" r="${(R * 0.12).toFixed(3)}" fill="#7d858c"/>`;
{
  const s = 8.4, w = zweirad(.32);
  let g = w(-.72) + w(.72);
  g += `<circle cx="-.72" cy="-.32" r=".2" fill="none" stroke="#9aa2a9" stroke-width=".05"/><circle cx=".72" cy="-.32" r=".2" fill="none" stroke="#9aa2a9" stroke-width=".05"/>`;
  g += `<path d="M-.72 -.32 L-.1 -.5 L.3 -.55" stroke="#5b636b" stroke-width=".07" fill="none"/>`;
  g += `<path d="M-.3 -.45 L.35 -.45 L.42 -.72 L-.25 -.75 Z" fill="#3a3d42"/><rect x="-.18" y="-.68" width=".42" height=".18" fill="#9aa2a9"/>`;
  g += `<path d="M-.1 -.78 Q.1 -1.0 .45 -.95 L.55 -.78 Z" fill="${lack("moto", "#ff5a4a", "#c0141c", "#7e0c10")}"/>`;
  g += `<path d="M-.9 -.72 L-.1 -.8 L-.05 -.72 L-.9 -.66 Z" fill="#1d1f22"/>`;
  g += `<path d="M.5 -.86 L.72 -.32" stroke="${CHROM}" stroke-width=".06"/><path d="M.5 -.9 L.42 -1.05 L.58 -1.06" stroke="#1d1f22" stroke-width=".04" fill="none"/><circle cx=".66" cy="-.86" r=".07" fill="#fff3c0"/>`;
  g += `<path d="M-.95 -.66 L-.72 -.6" stroke="#c0141c" stroke-width=".06"/><path d="M-.2 -.38 L-1.0 -.36" stroke="${CHROM}" stroke-width=".06"/>`;
  g += `<path d="M-.86 -.28 L-1.0 -.1" stroke="#5b636b" stroke-width=".04"/>`;
  S.teil({ id: "motorrad", de: "das Motorrad", syl: "MO-tor-rad", it: "la moto", itSyl: "MO-to", en: "motorbike", x: 246, y: WEG, kunst: schatten(0, 0, 10, .8, .3) + m(s, g) + flaeche(-10, -10, 20, 10) });
}
{
  /* DAS MOPED (Simson-Form: Tank zwischen den Knien, Kotflügel, Gepäckträger) */
  const s = 8.4, w = zweirad(.27);
  let g = w(-.6) + w(.6);
  g += `<path d="M-.6 -.27 L-.1 -.45 L.3 -.45 L.6 -.27" stroke="#5b636b" stroke-width=".05" fill="none"/>`;
  g += `<path d="M-.15 -.62 Q.05 -.82 .32 -.74 L.35 -.6 L-.1 -.55 Z" fill="${lack("mop", "#5fa8e8", "#1f6fb2", "#124a7a")}"/>`;
  g += `<rect x="-.18" y="-.52" width=".34" height=".14" fill="#7d858c"/>`;
  g += `<path d="M-.75 -.66 L-.15 -.66 L-.15 -.6 L-.75 -.6 Z" fill="#1d1f22"/><path d="M-.95 -.6 L-.55 -.6 L-.55 -.56 L-.95 -.56 Z" fill="${CHROM}"/>`;
  g += `<path d="M.42 -.78 L.6 -.27" stroke="${CHROM}" stroke-width=".05"/><path d="M.4 -.8 L.3 -.88" stroke="#1d1f22" stroke-width=".04"/><circle cx=".5" cy="-.78" r=".07" fill="#fff3c0"/>`;
  g += `<path d="M-.86 -.4 Q-.6 -.62 -.34 -.4" stroke="#1f6fb2" stroke-width=".05" fill="none"/><path d="M.36 -.42 Q.6 -.62 .84 -.42" stroke="#1f6fb2" stroke-width=".05" fill="none"/>`;
  S.teil({ id: "moped", de: "das Moped", syl: "MO-ped", it: "il ciclomotore", itSyl: "ci-clo-mo-TO-re", en: "moped", x: 273, y: WEG, kunst: schatten(0, 0, 8, .7, .3) + m(s, g) + flaeche(-8, -8, 16, 8),
    tipp: "Mit einem Moped darf man höchstens 45 km/h fahren." });
}
{
  const s = 8.4, w = zweirad(.34);
  let g = `<path d="M-.95 0 L-.95 -.9 Q-.95 -1.0 -.85 -1.0 L.85 -1.0 Q.95 -1.0 .95 -.9 L.95 0" stroke="${CHROM}" stroke-width=".07" fill="none"/>`;
  g += w(-.55) + w(.55);
  g += `<path d="M-.55 -.34 L-.15 -.34 L.3 -.8 L-.25 -.8 Z M-.15 -.34 L-.3 -.9 M.3 -.8 L.55 -.34 M.3 -.8 L.36 -.98" stroke="#2e8b57" stroke-width=".05" fill="none"/>`;
  g += `<path d="M-.42 -.92 L-.16 -.92" stroke="#1d1f22" stroke-width=".07" stroke-linecap="round"/><path d="M.28 -.98 L.44 -1.0" stroke="#1d1f22" stroke-width=".05"/>`;
  g += `<circle cx="-.15" cy="-.34" r=".08" fill="none" stroke="#5b636b" stroke-width=".03"/><rect x="-.82" y="-.74" width=".42" height=".05" fill="#5b636b"/>`;
  g += `<path d="M.46 -.84 L.46 -.78" stroke="#fff3c0" stroke-width=".08"/>`;
  S.teil({ id: "fahrrad", de: "das Fahrrad", syl: "FAHR-rad", it: "la bicicletta", itSyl: "bi-ci-CLET-ta", en: "bicycle", x: 299, y: WEG, kunst: schatten(0, 0, 8, .7, .3) + m(s, g) + flaeche(-8, -9, 16, 9),
    tipp: "Das Fahrrad ist am Fahrradbügel angeschlossen." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/fahrzeuge.js"));
console.log(aus);
