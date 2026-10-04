#!/usr/bin/env node
/* =====================================================================
   DRESDEN (FASSUNG 852) — Bilderwelt neu: eine echte Stadtansicht
   ---------------------------------------------------------------------
   RECHERCHE (dresden.de „Canaletto-Blick“, Stiftung Frauenkirche,
   Sächsische Dampfschiffahrt, Schutzverband Dresdner Stollen):
   - STANDORT: der „Canaletto-Blick“ vom Neustädter Elbufer (Königsufer)
     gleich unterhalb der Augustusbrücke, Blick nach Süden über die Elbe
     und die Elbwiesen auf die Altstadt — so hat Bellotto (Canaletto)
     Dresden 1748 gemalt. Echte Reihenfolge von links (Osten) nach rechts
     (Westen): Brühlsche Terrasse mit der Kunstakademie (gläserne Kuppel,
     „Zitronenpresse“, oben die goldene Fama), dahinter die Frauenkirche,
     der Hausmannsturm des Residenzschlosses, die Hofkirche, die
     Augustusbrücke (rechts, sie führt zu uns herüber), dahinter die
     Semperoper und ganz rechts der Zwinger (Semperbau der Galerie mit
     der Kuppel über der Durchfahrt).
   - FRAUENKIRCHE: „Steinerne Glocke“: die Kuppel schwingt unten aus wie
     eine Glocke, vier Ecktürme, oben die Laterne mit goldenem Kreuz;
     heller Sandstein mit vielen dunklen alten Steinen (Wiederaufbau 2005).
   - HOFKIRCHE: langes Schiff mit Balustrade und vielen Heiligenfiguren,
     Turm mit durchbrochenen Geschossen (Säulen), oben eine Zwiebelhaube.
   - SEMPEROPER: halbrunde Fassade mit zwei Arkadengeschossen, in der
     Mitte die hohe Exedra mit der Pantherquadriga, dahinter das Bühnenhaus.
   - DAMPFSCHIFF: die älteste Raddampferflotte der Welt; weißer Rumpf,
     seitliche Radkästen mit Namen, hoher Schornstein; Anleger am
     Terrassenufer unter der Brühlschen Terrasse.
   - STOLLEN: Dresdner Christstollen mit Puderzucker; im Advent auf den
     Weihnachtsmärkten (Augustusmarkt in der Neustadt) an Buden, dazu
     Kinderpunsch in der Tasse (FASSUNG 879, alkoholfrei).
   Maßstab: Augenhöhe y = 100 (man steht oben auf der Uferpromenade).
   Vorne gilt: Einheiten je Meter = (y − 100) · 0,36.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "dresden", titel: "Dresden", emoji: "🎭", thema: "Deutschland", kuerzel: "b21e", fassung: 852 });
const rnd = zufall(1206);
const r = B.r;
const HOR = 100;
const km = (y) => (y - HOR) * 0.36;

S.def(`<filter color-interpolation-filters="sRGB" id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter color-interpolation-filters="sRGB" id="${S.id("wolke")}" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="2.2"/></filter>`);
S.def(`<filter color-interpolation-filters="sRGB" id="${S.id("spiegel")}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="1 .45"/></filter>`);
/* Elbsandstein: hell, mit dunkler Patina */
const SAND = S.lg("sand", [[0, "#cdbf9f"], [0.5, "#e2d6ba"], [1, "#b3a483"]], 0, 0, 1, 0);
const SAND_D = S.lg("sandd", [[0, "#7c7360"], [0.5, "#a39881"], [1, "#6b6352"]], 0, 0, 1, 0);
const KUPFER = S.lg("kupfer", [[0, "#4f8a72"], [0.4, "#8cc3aa"], [0.7, "#6aa58b"], [1, "#3e6f5c"]], 0, 0, 1, 0);
const SCHIEFER = S.lg("schiefer", [[0, "#5a626b"], [1, "#3c434a"]]);
const GOLD = S.lg("gold", [[0, "#fff1a8"], [0.4, "#f1c74a"], [1, "#a8770f"]], 0, 0, 1, 1);
const FERNE = 1;   /* Landmarken: Fuß auf der Terrassenhöhe */
const TERR = 97;   /* Oberkante Brühlsche Terrasse / Gelände der Altstadt */

/* =====================================================================
   KULISSE — Winterhimmel am Nachmittag, Dächer der Altstadt, Promenade
   ===================================================================== */
S.hinten(`<rect width="320" height="${HOR + 10}" fill="${S.lg("himmel", [[0, "#6c9ccc"], [0.6, "#b7cfe2"], [1, "#f1e2c8"]])}"/>`);
{
  let w = "";
  for (const [x, y, s] of [[60, 16, 1], [190, 24, 1.2], [290, 12, 0.8]]) {
    w += `<g filter="url(#${S.id("wolke")})" opacity=".85">`;
    for (const [dx, dy, rx, ry] of [[0, 0, 18, 4.4], [-12, 1.5, 11, 3.4], [12, 1, 12, 3.8], [-3, -2.8, 9, 4]]) w += `<ellipse cx="${r(x + dx * s)}" cy="${r(y + dy * s)}" rx="${r(rx * s)}" ry="${r(ry * s)}" fill="#fff"/>`;
    w += `</g>`;
  }
  S.hinten(w);
  /* Dächer der Altstadt, Kreuzkirchturm, Ständehausturm im Dunst */
  let c = "";
  let x = 20;
  while (x < 320) {
    const w2 = 6 + rnd() * 8, h = 3 + rnd() * 4;
    c += `<path d="M${r(x)} ${TERR} L${r(x)} ${r(TERR - h)} L${r(x + 2)} ${r(TERR - h - 3)} L${r(x + w2 - 2)} ${r(TERR - h - 3)} L${r(x + w2)} ${r(TERR - h)} L${r(x + w2)} ${TERR} Z" fill="${rnd() < 0.5 ? "#c7bba5" : "#b9ae9a"}"/>`;
    c += `<path d="M${r(x)} ${r(TERR - h)} L${r(x + 2)} ${r(TERR - h - 3)} L${r(x + w2 - 2)} ${r(TERR - h - 3)} L${r(x + w2)} ${r(TERR - h)} Z" fill="#7d6f66" opacity=".8"/>`;
    x += w2;
  }
  c += `<rect x="114" y="62" width="4" height="35" fill="#b9ae9a"/><path d="M113.4 62 Q116 55 118.6 62 Z" fill="#6f8f80"/><line x1="116" y1="56" x2="116" y2="52" stroke="#6f8f80" stroke-width=".4"/>`;
  c += `<rect x="0" y="${TERR - 12}" width="320" height="12" fill="#e3e8ec" opacity=".25"/>`;
  S.hinten(c);
}
/* Elbwiesen-Ufer hier, Balustrade der Promenade und Pflaster */
{
  let f = `<rect x="0" y="160" width="320" height="40" fill="${S.lg("pflaster", [[0, "#bdb4a3"], [1, "#a0978a"]])}"/>`;
  for (let i = -12; i <= 12; i++) f += `<line x1="${r(160 + i * 16)}" y1="160" x2="${r(160 + i * 34)}" y2="200" stroke="#857d70" stroke-width=".3" opacity=".6"/>`;
  for (const y of [163, 167, 172, 178, 185, 193]) f += `<line x1="0" y1="${y}" x2="320" y2="${y}" stroke="#857d70" stroke-width=".3" opacity=".55"/>`;
  /* Sandstein-Balustrade an der Kante der Promenade */
  f += `<rect x="0" y="152.6" width="320" height="2" rx=".6" fill="${S.lg("brust", [[0, "#e6dbc2"], [1, "#b8aa8a"]])}"/>`;
  for (let x = 2; x < 320; x += 4.2) f += `<path d="M${x} 154.6 Q${r(x - 0.9)} 157 ${x} 159.4 L${r(x + 1.8)} 159.4 Q${r(x + 2.7)} 157 ${r(x + 1.8)} 154.6 Z" fill="${SAND}"/>`;
  f += `<rect x="0" y="159.4" width="320" height="1.4" fill="#9c8f74"/>`;
  f += `<rect x="0" y="160" width="320" height="40" fill="${S.lg("pfl", [[0, "#000", 0.1], [0.3, "#000", 0], [1, "#000", 0.1]])}"/>`;
  S.hinten(f);
}

/* =====================================================================
   1 — DIE BRÜHLSCHE TERRASSE mit der Kunstakademie
   ===================================================================== */
{
  let k = "";
  /* Terrassenmauer aus Sandstein, darauf Linden, die Akademie, die Glaskuppel */
  k += `<rect x="-40" y="0" width="92" height="10" fill="${SAND_D}"/>`;
  for (let y = 2; y < 10; y += 2) k += `<line x1="-40" y1="${y}" x2="52" y2="${y}" stroke="#5e5646" stroke-width=".2"/>`;
  k += `<rect x="-40" y="-.8" width="92" height="1" fill="#d8cdb2"/>`;
  for (let x = -38; x < 50; x += 6) k += `<circle cx="${x}" cy="-2.6" r="${r(2.6 + rnd())}" fill="${S.rg("linde", [[0, "#9a8a5a"], [1, "#5e5a3a"]], 0.6, 0.35, 0.7)}" opacity=".9"/>`;
  k += `<rect x="-26" y="-14" width="44" height="13" fill="${SAND}"/>`;
  for (let i = 0; i < 9; i++) k += `<path d="M${-24 + i * 4.8} -3 L${-24 + i * 4.8} -8 Q${-23.2 + i * 4.8} -9.4 ${-22.4 + i * 4.8} -8 L${-22.4 + i * 4.8} -3 Z" fill="#4a4438"/>`;
  k += `<rect x="-27" y="-15.4" width="46" height="1.6" fill="#ece3cc"/>`;
  /* Glaskuppel „Zitronenpresse“ mit Rippen und goldener Fama */
  k += `<rect x="-10" y="-19" width="20" height="3.8" fill="${SAND}"/>`;
  k += `<path d="M-9 -19 C-9 -26 -4 -31.4 0 -32.4 C4 -31.4 9 -26 9 -19 Z" fill="${S.lg("glaskuppel", [[0, "#9db6c6"], [0.5, "#dbe8ef"], [1, "#7f98aa"]], 0, 0, 1, 0)}"/>`;
  for (const t of [-6, -3, 0, 3, 6]) k += `<path d="M${t * 1.4} -19 Q${t * 1.1} -27 0 -32.4" stroke="#5e6f7a" stroke-width=".3" fill="none"/>`;
  k += `<rect x="-.6" y="-35" width="1.2" height="2.8" fill="#5e6f7a"/>`;
  k += `<path d="M-.4 -35 L-.5 -38.6 Q0 -39.6 .5 -38.6 L.4 -35 Z M-.3 -38 L-2.8 -39.8 L-.2 -38.8 Z M.3 -38 L2.8 -40.6 L.6 -38.6 Z" fill="${GOLD}"/><line x1=".4" y1="-38.8" x2="2.6" y2="-37" stroke="#e8b83a" stroke-width=".35"/>`;
  /* Freitreppe zum Schlossplatz (rechts) */
  k += `<path d="M44 10 L52 10 L52 -1 L48 -1 Z" fill="${SAND}"/>`;
  for (let i = 0; i < 6; i++) k += `<line x1="${r(44.6 + i * 0.6)}" y1="${r(9 - i * 1.7)}" x2="52" y2="${r(9 - i * 1.7)}" stroke="#8f8468" stroke-width=".25"/>`;
  S.teil({ id: "terrasse", de: "die Brühlsche Terrasse", syl: "BRÜHL-sche ter-RAS-se", it: "la Terrazza di Brühl", itSyl: "ter-RAZ-za di BRÜHL", en: "Brühl's Terrace",
    x: 46, y: TERR, kunst: k, tipp: "Die Brühlsche Terrasse heißt auch „Balkon Europas“." });
}

/* =====================================================================
   2 — DIE FRAUENKIRCHE (Steinerne Glocke)
   ===================================================================== */
{
  let k = "";
  const fleck = (x0, y0, w, h, n) => { let g = ""; for (let i = 0; i < n; i++) g += `<rect x="${r(x0 + rnd() * w)}" y="${r(y0 + rnd() * h)}" width="${r(0.8 + rnd() * 1.6)}" height="${r(0.6 + rnd() * 0.8)}" fill="#6b6354" opacity="${r(0.35 + rnd() * 0.3)}"/>`; return g; };
  /* Kirchenkörper (unten von der Akademie verdeckt) */
  k += `<rect x="-15" y="-26" width="30" height="32" fill="${SAND}"/>`;
  k += fleck(-15, -26, 28, 25, 14);
  for (const x of [-9, 0, 9]) k += `<path d="M${x - 1.6} -6 L${x - 1.6} -17 Q${x} -20 ${x + 1.6} -17 L${x + 1.6} -6 Z" fill="#3d3a33"/>`;
  k += `<rect x="-16" y="-27.4" width="32" height="1.6" fill="#efe6d0"/>`;
  /* vier Ecktürme (Treppentürme) mit kleinen Hauben */
  for (const x of [-15, 15]) {
    k += `<rect x="${x - 2.8}" y="-44" width="5.6" height="18" fill="${SAND}"/>`;
    k += fleck(x - 2.8, -44, 4.4, 17, 3);
    k += `<path d="M${x - 1} -30 L${x - 1} -38 Q${x} -39.4 ${x + 1} -38 L${x + 1} -30 Z" fill="#3d3a33"/>`;
    k += `<path d="M${x - 3.2} -44 Q${x} -50 ${x + 3.2} -44 Z" fill="${SAND}"/><path d="M${x - 1} -48.4 L${x} -53.4 L${x + 1} -48.4 Z" fill="${SAND_D}"/>`;
  }
  /* Tambour und die glockenförmige Kuppel */
  k += `<rect x="-12" y="-33" width="24" height="6" fill="${SAND}"/>`;
  for (let i = 0; i < 7; i++) k += `<rect x="${-10.6 + i * 3.4}" y="-32" width="1.2" height="3.6" rx=".5" fill="#3d3a33"/>`;
  k += `<path d="M-16.4 -33 C-12.6 -35 -11.6 -39 -11.6 -45 C-11.6 -56 -6.4 -62 -3.4 -63 L3.4 -63 C6.4 -62 11.6 -56 11.6 -45 C11.6 -39 12.6 -35 16.4 -33 Z" fill="${S.lg("glocke", [[0, "#b5a787"], [0.35, "#e8dec6"], [0.65, "#d7caa9"], [1, "#a29473"]], 0, 0, 1, 0)}"/>`;
  k += fleck(-10, -58, 20, 24, 12);
  k += `<path d="M-10.8 -45 C-10.8 -55 -5.6 -61 -3.4 -62" stroke="#fff" stroke-width=".8" opacity=".35" fill="none"/>`;
  /* Laterne mit Säulen, Haube, Kugel und goldenem Kreuz */
  k += `<rect x="-3.6" y="-71" width="7.2" height="9" fill="${SAND}"/>`;
  for (const x of [-2.4, 0, 2.4]) k += `<rect x="${x - 0.45}" y="-70" width=".9" height="7" fill="#3d3a33"/>`;
  k += `<path d="M-4 -71 Q0 -77 4 -71 Z" fill="${SAND}"/><rect x="-1" y="-79" width="2" height="3.4" fill="${SAND}"/>`;
  k += `<circle cx="0" cy="-80.2" r="1.1" fill="${GOLD}"/><path d="M0 -81.2 L0 -86 M-1.6 -84.4 L1.6 -84.4" stroke="#e8b83a" stroke-width=".7"/>`;
  S.teil({ id: "frauenkirche", de: "die Frauenkirche", syl: "FRAU-en-kir-che", it: "la Frauenkirche", itSyl: "FRAU-en-kir-che", en: "Church of Our Lady",
    x: 86, y: TERR - 6, kunst: k, tipp: "Die Frauenkirche wurde 1945 zerstört und bis 2005 wieder aufgebaut. Die dunklen Steine sind alt.",
    zoom: { x: 86 - 30, y: TERR - 96, w: 60, h: 66 },
    unter: [
      { id: "kuppel", de: "die Kuppel", syl: "KUP-pel", it: "la cupola", itSyl: "CU-po-la", en: "dome", x: 86, y: TERR - 39, kunst: flaeche(-12, -30, 24, 30),
        tipp: "Die Kuppel ist ganz aus Stein. Man nennt sie „Steinerne Glocke“." },
      { id: "kreuz", de: "das Kreuz", syl: "KREUZ", it: "la croce", itSyl: "CRO-ce", en: "cross", x: 86, y: TERR - 85, kunst: flaeche(-2.4, -7.4, 4.8, 7.4, 0.5),
        tipp: "Das goldene Turmkreuz hat ein Schmied aus London gemacht — als Zeichen der Versöhnung." },
    ] });
}

/* =====================================================================
   3 — DAS SCHLOSS (Residenzschloss mit dem Hausmannsturm)
   ===================================================================== */
{
  let k = "";
  k += `<rect x="-20" y="-14" width="40" height="14" fill="${SAND}"/>`;
  k += `<path d="M-21 -14 L-18 -21 L18 -21 L21 -14 Z" fill="${SCHIEFER}"/>`;
  for (const x of [-14, -6, 6, 14]) k += `<path d="M${x - 2} -14 L${x - 2} -19 L${x} -23 L${x + 2} -19 L${x + 2} -14 Z" fill="${SAND}"/>`;
  for (let i = 0; i < 9; i++) k += `<rect x="${-18 + i * 4.4}" y="-10" width="1.6" height="2.6" fill="#3d3a33"/><rect x="${-18 + i * 4.4}" y="-5" width="1.6" height="2.6" fill="#3d3a33"/>`;
  /* Hausmannsturm mit Uhr und Barockhaube */
  k += `<rect x="-4" y="-50" width="8" height="36" fill="${SAND_D}"/>`;
  k += `<rect x="-4" y="-50" width="8" height="36" fill="${SAND}" opacity=".55"/>`;
  k += `<circle cx="0" cy="-44" r="2" fill="#f2ead8" stroke="#3d3a33" stroke-width=".3"/><path d="M0 -44 L0 -45.4 M0 -44 L1 -43.6" stroke="#2a1d12" stroke-width=".3"/>`;
  k += `<rect x="-4.6" y="-51" width="9.2" height="1.2" fill="#e6dbc2"/>`;
  k += `<path d="M-4.6 -51 Q-4.6 -55 -2.6 -56 Q-1 -57 -1.2 -59 L1.2 -59 Q1 -57 2.6 -56 Q4.6 -55 4.6 -51 Z" fill="${KUPFER}"/>`;
  k += `<rect x="-1.6" y="-63" width="3.2" height="4" fill="${KUPFER}"/><rect x="-.6" y="-62.4" width="1.2" height="2.6" fill="#2f4a3e"/>`;
  k += `<path d="M-1.8 -63 Q0 -66 1.8 -63 Z" fill="${KUPFER}"/><path d="M0 -66 L0 -71" stroke="#3e6f5c" stroke-width=".5"/><circle cx="0" cy="-69" r=".5" fill="${GOLD}"/>`;
  S.teil({ id: "schloss", de: "das Schloss", syl: "SCHLOSS", it: "il castello", itSyl: "ca-STEL-lo", en: "palace",
    x: 140, y: TERR, kunst: k, tipp: "Im Residenzschloss wohnten die Könige von Sachsen. Heute ist es ein Museum." });
}

/* =====================================================================
   4 — DIE HOFKIRCHE (Kathedrale mit Figuren und Turm)
   ===================================================================== */
{
  let k = "";
  k += `<rect x="-26" y="-16" width="40" height="16" fill="${SAND}"/>`;
  k += `<rect x="-26" y="-16" width="40" height="16" fill="${SAND_D}" opacity=".35"/>`;
  for (let i = 0; i < 7; i++) k += `<path d="M${-24 + i * 5.4} -3 L${-24 + i * 5.4} -11 Q${-23 + i * 5.4} -12.6 ${-22 + i * 5.4} -11 L${-22 + i * 5.4} -3 Z" fill="#3d3a33"/>`;
  /* Balustrade mit Heiligenfiguren */
  k += `<rect x="-27" y="-17.4" width="42" height="1.6" fill="#e6dbc2"/>`;
  for (let x = -25.6; x < 14; x += 2.6) k += `<path d="M${r(x - 0.5)} -17.4 L${r(x - 0.4)} -20 Q${r(x)} -21.4 ${r(x + 0.4)} -20 L${r(x + 0.5)} -17.4 Z" fill="#6b6352"/>`;
  /* Obergaden mit zweiter Figurenreihe */
  k += `<rect x="-20" y="-25" width="30" height="7.6" fill="${SAND}"/>`;
  for (let i = 0; i < 5; i++) k += `<rect x="${-18 + i * 6}" y="-23.4" width="2" height="4" rx="1" fill="#3d3a33"/>`;
  for (let x = -19; x < 10; x += 3) k += `<path d="M${r(x - 0.45)} -25 L${r(x - 0.35)} -27.4 Q${r(x)} -28.6 ${r(x + 0.35)} -27.4 L${r(x + 0.45)} -25 Z" fill="#6b6352"/>`;
  /* Turm: Unterbau, drei durchbrochene Geschosse, Haube, Kreuz */
  k += `<rect x="12" y="-30" width="11" height="30" fill="${SAND}"/>`;
  k += `<path d="M14.6 -2 L14.6 -12 Q17.5 -16 20.4 -12 L20.4 -2 Z" fill="#3d3a33"/>`;
  k += `<rect x="11.4" y="-31" width="12.2" height="1.4" fill="#e6dbc2"/>`;
  const stufe = (y, w, h) => {
    let g = `<rect x="${r(17.5 - w / 2)}" y="${r(y - h)}" width="${r(w)}" height="${r(h)}" fill="#3a3a38"/>`;
    for (let i = 0; i <= 3; i++) g += `<rect x="${r(17.5 - w / 2 + i * (w - 1) / 3)}" y="${r(y - h)}" width="1" height="${r(h)}" fill="${SAND}"/>`;
    g += `<rect x="${r(17.5 - w / 2 - 0.6)}" y="${r(y - h - 1.2)}" width="${r(w + 1.2)}" height="1.2" fill="#e6dbc2"/>`;
    for (const sx of [-1, 1]) g += `<path d="M${r(17.5 + sx * (w / 2 + 0.2) - 0.4)} ${r(y - h - 1.2)} l.4 -1.8 .4 1.8 Z" fill="#6b6352"/>`;
    return g;
  };
  k += stufe(-31, 10, 10) + stufe(-42.2, 8, 8) + stufe(-51.4, 6, 6);
  k += `<path d="M14.6 -58.6 Q14.4 -62 17.5 -64 Q20.6 -62 20.4 -58.6 Z" fill="${KUPFER}"/>`;
  k += `<rect x="16.7" y="-67" width="1.6" height="3" fill="${KUPFER}"/><path d="M17.5 -67 L17.5 -71.6 M16.3 -70.2 L18.7 -70.2" stroke="#e8b83a" stroke-width=".5"/>`;
  S.teil({ id: "hofkirche", de: "die Hofkirche", syl: "HOF-kir-che", it: "la chiesa di corte", itSyl: "CHIE-sa di COR-te", en: "Court Church",
    x: 166, y: TERR, kunst: k, tipp: "Auf dem Dach der Hofkirche stehen 78 Heiligenfiguren aus Stein." });
}

/* =====================================================================
   5 — DER ZWINGER (Semperbau der Galerie mit Kuppel) und
   6 — DIE SEMPEROPER (halbrunde Fassade, Pantherquadriga)
   ===================================================================== */
{
  let k = "";
  k += `<rect x="-26" y="-12" width="52" height="12" fill="${SAND}"/>`;
  for (let i = 0; i < 11; i++) k += `<path d="M${-24.6 + i * 4.8} -1 L${-24.6 + i * 4.8} -6 Q${-23.4 + i * 4.8} -8 ${-22.2 + i * 4.8} -6 L${-22.2 + i * 4.8} -1 Z" fill="#3d3a33"/>`;
  for (let i = 0; i < 11; i++) k += `<rect x="${-24.4 + i * 4.8}" y="-10.6" width="2" height="2" fill="#4a4438"/>`;
  k += `<rect x="-26.6" y="-13" width="53.2" height="1.2" fill="#e6dbc2"/><path d="M-26 -13 L-23 -16 L23 -16 L26 -13 Z" fill="${SCHIEFER}"/>`;
  /* Mittelbau mit Durchfahrt und achteckiger Kuppel */
  k += `<rect x="-7" y="-20" width="14" height="20" fill="${SAND}"/><path d="M-3.4 0 L-3.4 -8 Q0 -12 3.4 -8 L3.4 0 Z" fill="#2f2c27"/>`;
  k += `<rect x="-7.6" y="-21" width="15.2" height="1.2" fill="#e6dbc2"/>`;
  k += `<rect x="-5" y="-25" width="10" height="4" fill="${SAND}"/>`;
  k += `<path d="M-5.4 -25 Q-5 -31.4 0 -32.4 Q5 -31.4 5.4 -25 Z" fill="${KUPFER}"/><path d="M-3 -26 Q-2.6 -30 0 -31.4" stroke="#b6e0cb" stroke-width=".4" fill="none" opacity=".7"/>`;
  k += `<rect x="-.8" y="-35" width="1.6" height="2.8" fill="${KUPFER}"/><circle cx="0" cy="-35.6" r=".7" fill="${GOLD}"/>`;
  S.teil({ id: "zwinger", de: "der Zwinger", syl: "ZWIN-ger", it: "lo Zwinger", itSyl: "ZWIN-ger", en: "Zwinger",
    x: 294, y: TERR + 1, kunst: k, tipp: "Hinter diesem Bau liegt der Hof des Zwingers mit Pavillons, Brunnen und der Galerie „Alte Meister“." });
}
{
  let k = "";
  /* Bühnenhaus mit Satteldach (hinten) */
  k += `<rect x="-14" y="-34" width="28" height="22" fill="${SAND}"/>`;
  k += `<path d="M-15 -34 L0 -42 L15 -34 Z" fill="${S.lg("opergiebel", [[0, "#efe6d0"], [1, "#c9bb9b"]])}"/><path d="M-15 -34 L0 -42 L15 -34" stroke="#8f8468" stroke-width=".4" fill="none"/>`;
  k += `<rect x="-14" y="-34" width="28" height="22" fill="${S.lg("schatten", [[0, "#000", 0.12], [1, "#000", 0]], 0, 0, 1, 0)}"/>`;
  /* halbrunder Zuschauerhausbau: zwei Arkadengeschosse */
  k += `<path d="M-30 0 L-30 -20 Q0 -26 30 -20 L30 0 Z" fill="${SAND}"/>`;
  for (let row = 0; row < 2; row++) for (let i = 0; i < 13; i++) {
    const x = -27 + i * 4.5, y = row ? -10.6 : -1, h = 7.6;
    if (Math.abs(x + 0.3) < 6) continue;
    k += `<path d="M${r(x - 1.2)} ${y} L${r(x - 1.2)} ${r(y - h + 1.2)} Q${r(x)} ${r(y - h - 0.4)} ${r(x + 1.2)} ${r(y - h + 1.2)} L${r(x + 1.2)} ${y} Z" fill="#3a3630"/>`;
  }
  k += `<path d="M-30 -10 Q0 -14.6 30 -10" stroke="#e6dbc2" stroke-width="1" fill="none"/><path d="M-30.6 -20 Q0 -26.4 30.6 -20" stroke="#efe6d0" stroke-width="1.2" fill="none"/>`;
  k += `<path d="M-29 -21 Q0 -30 29 -21" stroke="${SCHIEFER}" stroke-width="2.2" fill="none"/>`;
  /* Exedra: hohes Bogenportal, oben die Pantherquadriga */
  k += `<rect x="-7" y="-30" width="14" height="30" fill="${SAND}"/><path d="M-5 0 L-5 -18 Q0 -26 5 -18 L5 0 Z" fill="#2f2c27"/>`;
  for (const x of [-6.2, 6.2]) k += `<rect x="${x - 0.6}" y="-28" width="1.2" height="28" fill="#efe6d0"/>`;
  k += `<rect x="-7.6" y="-31.4" width="15.2" height="1.6" fill="#efe6d0"/>`;
  k += `<path d="M-4.6 -31.4 L-4.4 -33 Q-3 -34.4 -2 -33.2 L-.6 -34.6 L.6 -34.6 L2 -33.2 Q3 -34.4 4.4 -33 L4.6 -31.4 Z" fill="#3f4a46"/><path d="M-.6 -34.6 L-.4 -37.4 Q0 -38.2 .4 -37.4 L.6 -34.6 Z" fill="#3f4a46"/>`;
  S.teil({ id: "semperoper", de: "die Semperoper", syl: "SEM-per-o-per", it: "la Semperoper", itSyl: "SEM-per-o-per", en: "Semper Opera",
    x: 240, y: TERR + 1, kunst: k, tipp: "In der Semperoper gibt es Opern, Ballett und Konzerte. Oben fährt Dionysos mit vier Panthern." });
}

/* =====================================================================
   7 — DIE ELBE
   ===================================================================== */
{
  const Y0 = TERR + 10, Y1 = 132;
  let k = `<rect x="0" y="${Y0}" width="320" height="${Y1 - Y0}" fill="${S.lg("wasser", [[0, "#9db2bd"], [0.45, "#7a929e"], [1, "#56707c"]])}"/>`;
  k += `<g filter="url(#${S.id("spiegel")})" opacity=".32"><rect x="74" y="${Y0}" width="26" height="16" fill="#e2d6ba"/><rect x="6" y="${Y0}" width="92" height="5" fill="#7c7360"/><rect x="126" y="${Y0}" width="64" height="7" fill="#d6caa9"/><rect x="210" y="${Y0}" width="60" height="6" fill="#e2d6ba"/></g>`;
  for (let i = 0; i < 130; i++) {
    const y = Y0 + 1 + Math.pow(rnd(), 0.8) * (Y1 - Y0 - 2), w = 1.2 + (y - Y0) * 0.2 * rnd() + 1;
    k += `<path d="M${r(rnd() * 320)} ${r(y)} q${r(w / 2)} -.5 ${r(w)} 0" stroke="${rnd() < 0.55 ? "#eef3f5" : "#3f5660"}" stroke-width="${r(0.15 + (y - Y0) * 0.01)}" fill="none" opacity="${r(0.3 + rnd() * 0.4)}"/>`;
  }
  S.teil({ id: "elbe", de: "die Elbe", syl: "EL-be", it: "l'Elba", itSyl: "EL-ba", en: "the Elbe", x: 0, y: 0, kunst: k,
    tipp: "Die Elbe fließt mitten durch Dresden — an beiden Ufern liegen grüne Elbwiesen." });
}

/* =====================================================================
   8 — DAS DAMPFSCHIFF (Raddampfer) — Lupe: Schaufelrad, Schornstein
   ===================================================================== */
{
  const SX = 150, SY = 124;
  let k = schatten(0, 0, 32, 1.2, 0.25);
  k += `<path d="M-36 .2 q-5 .6 -9 0 M32 .4 q5 .7 10 0" stroke="#eef3f5" stroke-width=".5" fill="none" opacity=".8"/>`;
  /* Rumpf, weiß mit schwarzem Wasserpass, spitzer Bug links */
  k += `<path d="M-35 -5 L31 -5 L32 -1.6 Q31 .4 28 .4 L-29 .4 Q-33 .2 -35 -5 Z" fill="${S.lg("rumpf", [[0, "#ffffff"], [0.7, "#e9ecee"], [0.71, "#1d1d1d"], [1, "#1d1d1d"]])}"/>`;
  k += `<rect x="-33" y="-5.6" width="64" height=".8" fill="#c7a24a"/>`;
  /* Aufbauten: Salon mit Fenstern, Oberdeck mit Reling */
  k += `<rect x="-24" y="-10.4" width="48" height="5" fill="#fbfbf8"/>`;
  for (let x = -22; x < 23; x += 3) if (Math.abs(x) > 6) k += `<rect x="${x}" y="-9.6" width="2.2" height="2.8" rx=".4" fill="#3d5566"/>`;
  k += `<rect x="-25" y="-11.2" width="50" height=".8" fill="#e9ecee"/>`;
  k += `<path d="M-24 -11.2 L-24 -13.4 L24 -13.4 L24 -11.2" stroke="#9aa3aa" stroke-width=".25" fill="none"/>`;
  for (let x = -22; x < 24; x += 2.6) k += `<line x1="${x}" y1="-11.2" x2="${x}" y2="-13.4" stroke="#9aa3aa" stroke-width=".15"/>`;
  k += `<rect x="-14" y="-15" width="7" height="3.8" fill="#fbfbf8"/><rect x="-13.4" y="-14.4" width="5.8" height="1.6" fill="#2e4658"/>`;
  /* Schornstein: hoch, ockergelb mit schwarzem Rand, etwas Dampf */
  k += `<rect x="1.6" y="-24" width="3.4" height="12.8" fill="${S.lg("schorn", [[0, "#c99a3a"], [0.5, "#f2c46a"], [1, "#b8862a"]], 0, 0, 1, 0)}"/><rect x="1.4" y="-25" width="3.8" height="1.6" fill="#1d1d1d"/>`;
  k += `<path d="M3.3 -25.4 q-1.4 -3 1 -5 q2.6 -2 1 -5" stroke="#fff" stroke-width="1.6" opacity=".55" fill="none" stroke-linecap="round"/>`;
  /* Radkasten mit Namen und Strahlen */
  k += `<path d="M-6 -4.6 L-6 -9 Q0 -16 6 -9 L6 -4.6 Z" fill="#fbfbf8" stroke="#c7a24a" stroke-width=".4"/>`;
  for (let i = 0; i < 9; i++) { const a = Math.PI + i * Math.PI / 8; k += `<line x1="0" y1="-5" x2="${r(Math.cos(a) * 5.2)}" y2="${r(-5 + Math.sin(a) * 5.8)}" stroke="#c7a24a" stroke-width=".25"/>`; }
  k += `<path d="M-6 -5.2 L6 -5.2" stroke="#c7a24a" stroke-width=".4"/>`;
  k += `<text x="0" y="-6" font-size="1.7" text-anchor="middle" fill="#1f3f78" font-family="Georgia,serif" font-weight="bold">DRESDEN</text>`;
  /* Flaggen */
  k += `<line x1="-33" y1="-5" x2="-33" y2="-12" stroke="#8a8f94" stroke-width=".3"/><rect x="-33" y="-12" width="3.2" height="1" fill="#f6f6f2"/><rect x="-33" y="-11" width="3.2" height="1" fill="#3c8f5a"/>`;
  S.teil({ id: "dampfschiff", de: "das Dampfschiff", syl: "DAMPF-schiff", it: "il battello a vapore", itSyl: "bat-TEL-lo a va-PO-re", en: "steamboat",
    x: SX, y: SY, kunst: k, tipp: "Dresden hat die älteste Flotte von Raddampfern der Welt.",
    zoom: { x: SX - 38, y: SY - 34, w: 74, h: 38 },
    unter: [
      { id: "schaufelrad", de: "das Schaufelrad", syl: "SCHAU-fel-rad", it: "la ruota a pale", itSyl: "RUO-ta a PA-le", en: "paddle wheel", x: SX, y: SY - 4.6, kunst: flaeche(-6, -8, 12, 8),
        tipp: "Im Radkasten dreht sich das Schaufelrad und schiebt das Schiff voran." },
      { id: "schornstein", de: "der Schornstein", syl: "SCHORN-stein", it: "il fumaiolo", itSyl: "fu-MA-io-lo", en: "funnel", x: SX + 3.3, y: SY - 11.2, kunst: flaeche(-2, -14, 4, 14, 0.5) },
    ] });
}

/* =====================================================================
   9 — DIE BRÜCKE (Augustusbrücke, führt von rechts vorn zur Altstadt)
   ===================================================================== */
{
  const u = (s) => 2.4 * s / (1 + 1.4 * s);
  const bx = (s) => 192 + 128 * u(s);
  const deck = (s) => TERR - 1 - 9 * u(s);
  const wasser = (s) => TERR + 10 + 34 * u(s);
  const dick = (s) => 2 + 5 * u(s);
  let k = "";
  /* Brückenkörper mit Bögen (9 Bögen sichtbar) */
  const N = 9;
  let ober = [], unter = [];
  for (let i = 0; i <= 40; i++) { const s = i / 40; ober.push(`${r(bx(s))} ${r(deck(s))}`); unter.push(`${r(bx(s))} ${r(wasser(s))}`); }
  k += `<path d="M${ober.join(" L")} L${unter.reverse().join(" L")} Z" fill="${SAND}"/>`;
  k += `<path d="M${ober.join(" L")}" stroke="#6b6352" stroke-width=".3" fill="none"/>`;
  for (let j = 0; j < N; j++) {
    const a = (j + 0.16) / N, b = (j + 0.84) / N, m = (a + b) / 2;
    const xa = bx(a), xb = bx(b), xm = bx(m), yw = wasser(m), yk = deck(m) + dick(m);
    k += `<path d="M${r(xa)} ${r(wasser(a))} L${r(xa)} ${r(yk + (yw - yk) * 0.45)} Q${r(xm)} ${r(yk - 0.5)} ${r(xb)} ${r(yk + (yw - yk) * 0.45)} L${r(xb)} ${r(wasser(b))} Z" fill="${S.lg("bogen", [[0, "#3b3f3d"], [1, "#55605c"]])}"/>`;
    k += `<path d="M${r(xa)} ${r(yk + (yw - yk) * 0.45)} Q${r(xm)} ${r(yk - 0.5)} ${r(xb)} ${r(yk + (yw - yk) * 0.45)}" stroke="#efe6d0" stroke-width="${r(0.3 + 0.6 * u(m))}" fill="none"/>`;
    /* Pfeilervorkopf (spitz) */
    const xp = bx((j + 1) / N);
    if (j < N - 1) k += `<path d="M${r(xp - 0.6 * dick((j + 1) / N))} ${r(wasser((j + 1) / N))} L${r(xp)} ${r(wasser((j + 1) / N) - 3 * u((j + 1) / N) - 1)} L${r(xp + 0.6 * dick((j + 1) / N))} ${r(wasser((j + 1) / N))} Z" fill="${SAND_D}"/>`;
  }
  /* Brüstung mit Kandelabern */
  for (let i = 0; i < 8; i++) {
    const s = (i + 0.5) / 8, x = bx(s), y = deck(s), h = 2 + 6 * u(s);
    k += `<line x1="${r(x)}" y1="${r(y)}" x2="${r(x)}" y2="${r(y - h)}" stroke="#2f3a35" stroke-width="${r(0.25 + 0.4 * u(s))}"/><circle cx="${r(x)}" cy="${r(y - h)}" r="${r(0.4 + 0.7 * u(s))}" fill="#f4ecd0" stroke="#2f3a35" stroke-width=".2"/>`;
  }
  S.teil({ id: "bruecke", de: "die Brücke", syl: "BRÜ-cke", it: "il ponte", itSyl: "PON-te", en: "bridge", x: 0, y: 0, kunst: k,
    tipp: "Die Augustusbrücke ist die älteste Brücke Dresdens. Sie hat steinerne Bögen." });
}

/* =====================================================================
   10 — DIE ELBWIESE (hier am Neustädter Ufer)
   ===================================================================== */
{
  let k = `<path d="M0 132 L320 132 L320 153 L0 153 Z" fill="${S.lg("wiese", [[0, "#8a9a5a"], [1, "#6f8a48"]])}"/>`;
  k += `<path d="M0 131 Q160 129.6 320 131 L320 133 L0 133 Z" fill="#9a8a6a"/>`;
  for (let i = 0; i < 260; i++) { const x = rnd() * 320, y = 133 + Math.pow(rnd(), 0.8) * 20; k += `<line x1="${r(x)}" y1="${r(y)}" x2="${r(x + rnd() - 0.5)}" y2="${r(y - 0.6 - (y - 130) * 0.04)}" stroke="${rnd() < 0.5 ? "#a8b56e" : "#5e7a3e"}" stroke-width=".25"/>`; }
  /* Fußweg (Elberadweg) durch die Wiese */
  k += `<path d="M0 141 Q160 138 320 140 L320 143 Q160 141 0 144.4 Z" fill="#cdbf9f"/>`;
  for (let i = 0; i < 6; i++) { const x = 20 + i * 52; k += `<ellipse cx="${x}" cy="${r(147 + (i % 2) * 3)}" rx="${3 + (i % 3)}" ry="1" fill="#b5c27a" opacity=".55"/>`; }
  S.teil({ id: "wiese", de: "die Elbwiese", syl: "ELB-wie-se", it: "il prato sull'Elba", itSyl: "PRA-to sul-LEL-ba", en: "Elbe meadow", x: 0, y: 0, kunst: k,
    tipp: "Auf den Elbwiesen gehen die Dresdner spazieren und fahren Fahrrad." });
}

/* =====================================================================
   11 — DAS PAAR auf der Bank (von hinten, mit Blick auf die Altstadt)
   ===================================================================== */
{
  const Y = 179, s = km(Y);
  const frau = B.mensch({ id: "b21e_frau", geschlecht: "w", pose: "sitzen", blick: 186, frisur: "lang", haarfarbe: "blond", haut: "hell",
    kleidung: { oberteil: { stueck: "pullover", farbe: "creme" }, unterteil: { stueck: "jeans" }, jacke: { stueck: "mantel", farbe: "rot" }, schuhe: { stueck: "stiefel", farbe: "braun" }, zubehoer: { stueck: "schal", farbe: "weiss" } } }, 1.66 * s);
  const mann = B.mensch({ id: "b21e_mann", geschlecht: "m", pose: "sitzen", blick: 174, frisur: "kurz", haarfarbe: "dunkelbraun", haut: "hell",
    kleidung: { oberteil: { stueck: "pullover", farbe: "grau" }, unterteil: { stueck: "jeans" }, jacke: { stueck: "jacke", farbe: "blau" }, schuhe: { stueck: "stiefel", farbe: "braun" }, kopf: { stueck: "muetze", farbe: "grau" } } }, 1.8 * s);
  const sitzY = Math.max(frau.z.sitz.y * frau.k, mann.z.sitz.y * mann.k);
  S.def(`<clipPath id="${S.id("bank")}"><rect x="-40" y="-80" width="80" height="${r(80 + sitzY + 0.8)}"/></clipPath>`);
  const k = `<g clip-path="url(#${S.id("bank")})"><g transform="translate(-8 0)">${frau.svg}</g><g transform="translate(8 0)">${mann.svg}</g></g>`;
  S.teil({ id: "paar", de: "das Paar", syl: "PAAR", it: "la coppia", itSyl: "COP-pia", en: "couple", x: 238, y: Y, kunst: k,
    tipp: "Das Paar sitzt auf der Bank und schaut auf den Canaletto-Blick." });
}

/* =====================================================================
   12 — DIE BANK (Sandstein-Promenade, rechts)
   ===================================================================== */
{
  const Y = 180, s = km(Y), W = 2 * s;
  let k = schatten(0, 0.4, W / 2 + 2, 1.4, 0.35);
  const HOLZ = S.lg("bankholz", [[0, "#3f6b4a"], [1, "#2a4a33"]]);
  for (const sx of [-1, 1]) k += `<path d="M${r(sx * (W / 2 - 3))} 0 L${r(sx * (W / 2 - 3))} ${r(-0.44 * s)} L${r(sx * (W / 2 - 2.4))} ${r(-0.86 * s)} L${r(sx * (W / 2 - 4))} ${r(-0.86 * s)} L${r(sx * (W / 2 - 4))} ${r(-0.44 * s)} L${r(sx * (W / 2 - 5.4))} 0 Z" fill="#2a2d31"/>`;
  for (let i = 0; i < 3; i++) k += `<rect x="${r(-W / 2)}" y="${r(-0.45 * s - i * 1.2)}" width="${r(W)}" height="1" rx=".3" fill="${HOLZ}"/>`;
  for (let i = 0; i < 3; i++) k += `<rect x="${r(-W / 2 + 0.5)}" y="${r(-0.84 * s + i * 2)}" width="${r(W - 1)}" height="1.5" rx=".4" fill="${HOLZ}"/>`;
  S.teil({ id: "bank", de: "die Bank", syl: "BANK", it: "la panchina", itSyl: "pan-CHI-na", en: "bench", x: 238, y: Y, steht: true, kunst: k });
}

/* =====================================================================
   13 — DER MARKTSTAND (Weihnachtsbude) mit 14 — DER VERKÄUFERIN,
        15 — DEM STOLLEN und 16 — DEM KINDERPUNSCH
   ===================================================================== */
const BUDE = { x: 52, y: 194 };
const BS = km(BUDE.y), THEKE = BUDE.y - 1.05 * BS;
{
  const W = 2.8 * BS, H = 2.5 * BS, ty = THEKE - BUDE.y;
  const HOLZ = S.lg("budenholz", [[0, "#9c6a3a"], [0.5, "#b8834c"], [1, "#8a5a2c"]], 0, 0, 1, 0);
  let k = schatten(0, 0.6, W / 2 + 4, 2.2, 0.4);
  /* Holzbude mit Satteldach, Tannengirlande und Lichterkette */
  k += `<rect x="${r(-W / 2)}" y="${r(-H)}" width="${r(W)}" height="${r(H)}" fill="${HOLZ}"/>`;
  for (let x = -W / 2 + 2.6; x < W / 2; x += 2.6) k += `<line x1="${r(x)}" y1="${r(-H)}" x2="${r(x)}" y2="0" stroke="#6e4622" stroke-width=".3"/>`;
  const oy = -H + 5, ow = W - 8;
  k += `<rect x="${r(-ow / 2)}" y="${r(oy)}" width="${r(ow)}" height="${r(ty - oy)}" fill="${S.lg("budeinnen", [[0, "#5a3a1c"], [1, "#7a5230"]])}"/>`;
  /* Regal innen: Stollen in Papier, Dosen */
  k += `<rect x="${r(-ow / 2 + 2)}" y="${r(oy + 9)}" width="${r(ow - 4)}" height="1" fill="#c79a62"/>`;
  for (let i = 0; i < 5; i++) { const x = -ow / 2 + 5 + i * 7.6; k += `<rect x="${r(x)}" y="${r(oy + 4.4)}" width="6" height="4.6" rx=".4" fill="${i % 2 ? "#b8232a" : "#1f4f8f"}"/><rect x="${r(x)}" y="${r(oy + 5.8)}" width="6" height="1" fill="#e8c35a"/>`; }
  k += `<path d="M${r(-W / 2 - 4)} ${r(-H + 0.6)} L0 ${r(-H - 9)} L${r(W / 2 + 4)} ${r(-H + 0.6)} Z" fill="${S.lg("dach", [[0, "#7a2a22"], [1, "#5a1e18"]])}"/>`;
  k += `<path d="M${r(-W / 2 - 4)} ${r(-H + 0.6)} L0 ${r(-H - 9)} L${r(W / 2 + 4)} ${r(-H + 0.6)}" stroke="#4a3426" stroke-width=".8" fill="none"/>`;
  k += `<path d="M${r(-W / 2)} ${r(-H + 2)} Q${r(-W / 4)} ${r(-H + 5)} 0 ${r(-H + 2)} Q${r(W / 4)} ${r(-H + 5)} ${r(W / 2)} ${r(-H + 2)}" stroke="#2f5a32" stroke-width="2" fill="none"/>`;
  for (let i = 0; i < 14; i++) { const t = i / 13, x = -W / 2 + t * W, y = -H + 2 + Math.sin(t * Math.PI * 2) ** 2 * 3; k += `<circle cx="${r(x)}" cy="${r(y + 0.8)}" r=".6" fill="#ffe28a"/><circle cx="${r(x)}" cy="${r(y + 0.8)}" r="1.6" fill="#ffe28a" opacity=".25"/>`; }
  k += `<rect x="${r(-W / 2 + 6)}" y="${r(-H - 4.6)}" width="${r(W - 12)}" height="5.4" rx=".8" fill="#f4ecd8" stroke="#7a2a22" stroke-width=".4"/>`;
  k += `<text x="0" y="${r(-H - 0.6)}" font-size="3.6" text-anchor="middle" fill="#7a2a22" font-family="Georgia,serif" font-weight="bold" font-style="italic">Dresdner Christstollen</text>`;
  /* Theke */
  k += `<rect x="${r(-W / 2 - 1)}" y="${r(ty - 1.2)}" width="${r(W + 2)}" height="2" rx=".4" fill="#c79a62"/>`;
  k += `<rect x="${r(-W / 2 + 4)}" y="${r(ty + 4)}" width="${r(W - 8)}" height="7" rx=".6" fill="#f4ecd8" opacity=".9"/>`;
  k += `<text x="0" y="${r(ty + 9.2)}" font-size="3" text-anchor="middle" fill="#2f5a32" font-family="Georgia,serif" font-weight="bold">Stollen · Kinderpunsch</text>`;
  S.teil({ id: "marktstand", de: "der Marktstand", syl: "MARKT-stand", it: "la bancarella", itSyl: "ban-ca-REL-la", en: "market stall", x: BUDE.x, y: BUDE.y, steht: true, kunst: k,
    tipp: "Im Advent gibt es in Dresden viele Weihnachtsmärkte — der berühmteste ist der Striezelmarkt." });
}
{
  const Y = BUDE.y - 6;
  const m = B.mensch({ id: "b21e_verk", geschlecht: "w", pose: "servieren", blick: -14, frisur: "dutt", haarfarbe: "hellbraun", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "pullover", farbe: "creme" }, schuerze: { stueck: "schuerze", farbe: "rot" }, unterteil: { stueck: "hose", farbe: "schwarz" }, schuhe: { stueck: "stiefel", farbe: "braun" }, kopf: { stueck: "muetze", farbe: "rot" } } }, 1.66 * km(Y));
  S.def(`<clipPath id="${S.id("hinterTheke")}"><rect x="-50" y="-90" width="100" height="${r(THEKE - 1.2 - Y + 90)}"/></clipPath>`);
  S.teil({ id: "verkaeuferin", de: "die Verkäuferin", syl: "ver-KÄU-fe-rin", it: "la commessa", itSyl: "com-MES-sa", en: "shop assistant", x: BUDE.x - 6, y: Y,
    kunst: `<g clip-path="url(#${S.id("hinterTheke")})">${m.svg}</g>`, tipp: "Die Verkäuferin sagt: „Ein Stück Stollen und einen Kinderpunsch?“" });
}
{
  /* DER STOLLEN mit Puderzucker, angeschnitten auf dem Brett */
  const s = BS / 30;
  let k = `<path d="M${r(-10 * s)} 0 L${r(10 * s)} 0 L${r(9.4 * s)} ${r(-1 * s)} L${r(-9.4 * s)} ${r(-1 * s)} Z" fill="#c79a62"/>`;
  k += `<path d="M${r(-8 * s)} ${r(-1 * s)} Q${r(-8.6 * s)} ${r(-6 * s)} ${r(-4 * s)} ${r(-6.6 * s)} Q${r(-1 * s)} ${r(-5.4 * s)} ${r(0)} ${r(-6.8 * s)} Q${r(3 * s)} ${r(-7.4 * s)} ${r(4 * s)} ${r(-5.8 * s)} L${r(4 * s)} ${r(-1 * s)} Z" fill="${S.lg("puder", [[0, "#ffffff"], [1, "#e9e4da"]])}"/>`;
  k += `<path d="M${r(-6.6 * s)} ${r(-4 * s)} Q${r(-2 * s)} ${r(-5.4 * s)} ${r(2.6 * s)} ${r(-4.8 * s)}" stroke="#d8d0c0" stroke-width="${r(0.4 * s)}" fill="none"/>`;
  /* Anschnitt: Rosinen, Zitronat, Mandeln */
  k += `<path d="M${r(4 * s)} ${r(-1 * s)} L${r(4 * s)} ${r(-5.8 * s)} Q${r(5 * s)} ${r(-6.2 * s)} ${r(5.4 * s)} ${r(-5.4 * s)} L${r(5.4 * s)} ${r(-1 * s)} Z" fill="#f0d79a"/>`;
  k += `<path d="M${r(6.4 * s)} ${r(-1 * s)} L${r(6.4 * s)} ${r(-4.8 * s)} L${r(9 * s)} ${r(-4.8 * s)} L${r(9 * s)} ${r(-1 * s)} Z" fill="#f0d79a" stroke="#fff" stroke-width=".2"/>`;
  for (let i = 0; i < 9; i++) k += `<circle cx="${r((4.4 + rnd() * 4.4) * s)}" cy="${r((-1.6 - rnd() * 3) * s)}" r="${r(0.32 * s)}" fill="${i % 3 ? "#5a2a12" : "#7fa04a"}"/>`;
  S.teil({ oben: true, id: "stollen", de: "der Stollen", syl: "STOL-len", it: "il panettone di Dresda", itSyl: "pa-net-TO-ne di DRE-sda", en: "stollen",
    x: BUDE.x - 16, y: THEKE - 1.2, steht: true, kunst: k, tipp: "Der Dresdner Christstollen ist ein Weihnachtsgebäck mit Rosinen, Mandeln und viel Puderzucker." });
}
{
  /* DER KINDERPUNSCH in der Markttasse (heißer Früchtetee mit Saft, hellrot) */
  const s = BS / 30;
  let k = `<path d="M${r(-2.4 * s)} ${r(-5.6 * s)} L${r(2.4 * s)} ${r(-5.6 * s)} L${r(2 * s)} 0 L${r(-2 * s)} 0 Z" fill="${S.lg("tasse", [[0, "#2f5a9a"], [0.5, "#4a7ac0"], [1, "#22437a"]], 0, 0, 1, 0)}"/>`;
  k += `<ellipse cx="0" cy="${r(-5.6 * s)}" rx="${r(2.4 * s)}" ry="${r(0.6 * s)}" fill="#b0342c"/><ellipse cx="${r(-0.6 * s)}" cy="${r(-5.65 * s)}" rx="${r(1 * s)}" ry="${r(0.18 * s)}" fill="#e8705a" opacity=".6"/>`;
  k += `<path d="M${r(2.3 * s)} ${r(-4.6 * s)} q${r(1.8 * s)} 0 ${r(1.6 * s)} ${r(1.6 * s)} q-.2 ${r(1.4 * s)} ${r(-1.8 * s)} ${r(1.4 * s)}" stroke="#2f5a9a" stroke-width="${r(0.7 * s)}" fill="none"/>`;
  k += `<path d="M${r(-1.6 * s)} ${r(-3.4 * s)} l.6 -.6 .6 .6 -.6 .6 Z" fill="#fff"/><text x="0" y="${r(-1.6 * s)}" font-size="${r(1.2 * s)}" text-anchor="middle" fill="#fff" font-family="Arial">2026</text>`;
  k += `<path d="M0 ${r(-6.6 * s)} q-1 -1.6 0 -3 q1 -1.4 0 -2.8" stroke="#fff" stroke-width=".4" opacity=".5" fill="none"/>`;
  S.teil({ oben: true, id: "kinderpunsch", de: "der Kinderpunsch", syl: "KIN-der-punsch", it: "il punch analcolico", itSyl: "PUNCH a-nal-CO-li-co", en: "children's punch",
    x: BUDE.x + 18, y: THEKE - 1.2, steht: true, kunst: k, tipp: "Kinderpunsch ist heißer Früchtetee mit Saft, Zimt und Nelken. Er wärmt im Winter die Hände." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/dresden.js"));
console.log(aus);
