#!/usr/bin/env node
/* =====================================================================
   JAPAN (FASSUNG 852) — Bilderwelt neu: am Fuß des Fuji
   ---------------------------------------------------------------------
   RECHERCHE (Keio-Universität Fujisan „Chureito Pagoda“, JR Pass Blog,
   watabi.org „Arakurayama Sengen Park“, JR Central „N700S“):
   - STANDORT: Fujiyoshida/Fuji-Fünf-Seen-Gegend im Frühling (Mitte April).
     Man sitzt auf der Veranda (Engawa) eines alten Teehauses am
     Schreingarten. Hinten der Fuji (3776 m): fast symmetrischer
     Vulkankegel, oben flach mit Krater, Schneekappe mit Rinnen,
     darunter blauviolette Hänge. Auf dem bewaldeten Hang die
     fünfstöckige Chureito-Pagode (1963) — zinnoberrote Pfosten, weiße
     Wände, dunkle Dächer mit aufgebogenen Ecken, Bronze-Spitze mit neun
     Ringen. Im Tal fährt der Shinkansen (Tokaido-Linie, Baureihe
     N700S): weiß mit blauem Streifen, lange flache „Entenschnabel“-Nase,
     Oberleitung auf Masten. (Gestaucht: die Strecke liegt in Wahrheit
     etwas südlich, bei Fuji-Stadt, wo der Zug mit dem Berg fotografiert
     wird.)
   - SCHREINGARTEN: das zinnoberrote Torii (zwei Pfosten, zwei Querbalken,
     der obere Kasagi geschwungen und schwarz gedeckt), an Feiertagen mit
     der Flagge (weiß mit roter Sonne). Kirschbäume in voller Blüte, ein
     Teich mit Koi-Karpfen (rot-weiß, orange), eine Steinlaterne (Tōrō),
     ein Bambushain.
   - TEEHAUS: Holzveranda, Schiebetüren aus Papier (Shōji) mit
     Holzgitter, drinnen Tatami und ein Kimono auf dem Ständer (Ikō);
     unter dem Dachvorsprung ein roter Papierlampion. Auf dem niedrigen
     Tisch: Sushi auf dem Holzbrett (Lachs, Thunfisch, Garnele, Ei,
     Maki), eine Schale Ramen (Nudeln, Schweinebauch, Ei, Nori,
     Narutomaki, Frühlingszwiebeln), Essstäbchen auf der Stäbchenbank,
     eine gusseiserne Teekanne mit Teeschale, ein Faltfächer; davor ein
     Sitzkissen (Zabuton).
   Maßstab: Augenhöhe y = 112, Auge 1,6 m. Punkt in d Metern und h Metern
   Höhe: y = 112 + (1,6 − h)·260/d, Einheiten je Meter = 260/d.
   Veranda 0,5 m hoch, Wand d = 7, Tisch d = 4,8, Torii d = 30.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "japan", titel: "Japan", emoji: "🇯🇵", thema: "Länder", kuerzel: "b25d", fassung: 852 });
/* Verläufe nur einmal anlegen, auch wenn sie in Schleifen gebraucht werden */
{ const lg = S.lg, rg = S.rg, schon = {}; S.lg = (n, ...a) => schon["l" + n] || (schon["l" + n] = lg(n, ...a)); S.rg = (n, ...a) => schon["r" + n] || (schon["r" + n] = rg(n, ...a)); }
/* Wortmarke: Teile, die in Bildkoordinaten gezeichnet sind, bekommen ihren Ankerpunkt in die Mitte */
{ const teil = S.teil; S.teil = (t) => { if (t.anker) { const [ax, ay] = t.anker; t.kunst = `<g transform="translate(${B.r(t.x - ax)} ${B.r(t.y - ay)})">${t.kunst}</g>`; t.x = ax; t.y = ay; delete t.anker; } return teil(t); }; }
const rnd = zufall(3776);
const r = B.r;
const HOR = 112, F = 260, AUGE = 1.6;
const yAt = (d, h = 0) => HOR + (AUGE - h) * F / d;
const uAt = (d) => F / d;
const xAt = (x7, d) => 160 + (x7 - 160) * 7 / d;   /* gleiche Weltlinie wie x7 an der Wand (d = 7) */

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("wolke")}" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="2.2"/></filter>`);
S.def(`<filter id="${S.id("dunst")}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation=".6"/></filter>`);
const ZINNOBER = S.lg("zinnober", [[0, "#e2502e"], [0.5, "#cf3d1f"], [1, "#a82c14"]], 0, 0, 1, 0);
const DACH = S.lg("dach", [[0, "#4a4f57"], [1, "#2a2e34"]]);
const HOLZ = S.lg("holz", [[0, "#8a6440"], [1, "#5e4228"]]);
const HOLZ_H = S.lg("holzh", [[0, "#b38a5c"], [1, "#8a6440"]]);
const DUNKELHOLZ = S.lg("dunkelholz", [[0, "#4a3220"], [1, "#2e1f14"]]);
const PAPIER = S.lg("papier", [[0, "#fbf7ec"], [1, "#efe7d4"]]);
const BLUETE = ["#f8c8d8", "#f4b2c8", "#fbd9e4", "#eea3bd", "#fde8ef"];

/* =====================================================================
   KULISSE — Frühlingshimmel, Talboden, Garten
   ===================================================================== */
S.hinten(`<rect width="320" height="${HOR + 8}" fill="${S.lg("himmel", [[0, "#78aee0"], [0.6, "#b6d4ee"], [1, "#e8eef2"]])}"/>`);
{
  let w = "";
  for (const [x, y, s] of [[170, 22, 0.8], [228, 56, 0.6], [30, 80, 0.5]]) {
    w += `<g filter="url(#${S.id("wolke")})" opacity=".85">`;
    for (const [dx, dy, rx, ry] of [[0, 0, 16, 4], [-10, 1.5, 10, 3.4], [11, 1, 12, 3.8], [-3, -3, 9, 4]]) w += `<ellipse cx="${r(x + dx * s)}" cy="${r(y + dy * s)}" rx="${r(rx * s)}" ry="${r(ry * s)}" fill="#fff"/>`;
    w += `</g>`;
  }
  S.hinten(w);
}
/* Talboden mit Feldern und Dächern im Dunst, dann der Garten (Moos, Kiesweg) */
{
  let f = `<rect x="0" y="${HOR}" width="320" height="10" fill="${S.lg("tal", [[0, "#9db08a"], [1, "#7f9a6a"]])}"/>`;
  for (let i = 0; i < 40; i++) { const x = rnd() * 320, y = HOR + 0.6 + rnd() * 4; f += `<rect x="${r(x)}" y="${r(y)}" width="${r(2 + rnd() * 3)}" height="1.2" fill="${rnd() < 0.5 ? "#8c95a3" : "#b9b2a4"}" opacity=".7"/>`; }
  f += `<rect x="0" y="${HOR + 7}" width="320" height="${200 - HOR - 7}" fill="${S.lg("moos", [[0, "#6f9a4e"], [0.5, "#5b8a3e"], [1, "#4a7432"]])}"/>`;
  for (let i = 0; i < 160; i++) { const y = HOR + 8 + rnd() * 80; f += `<circle cx="${r(rnd() * 180)}" cy="${r(y)}" r="${r(0.3 + (y - HOR) * 0.012)}" fill="${rnd() < 0.5 ? "#7fae5a" : "#4f7a36"}" opacity=".6"/>`; }
  /* Trittsteine */
  for (const [d, x] of [[24, 100], [18, 92], [14, 80], [11, 64], [9, 44], [7.6, 24]]) f += `<ellipse cx="${x}" cy="${r(yAt(d))}" rx="${r(0.35 * uAt(d))}" ry="${r(0.08 * uAt(d))}" fill="#a49e93" stroke="#8a847a" stroke-width=".3"/>`;
  /* heruntergefallene Blütenblätter */
  for (let i = 0; i < 60; i++) f += `<ellipse cx="${r(rnd() * 170)}" cy="${r(HOR + 14 + rnd() * 86)}" rx=".6" ry=".35" fill="${BLUETE[i % 5]}" opacity=".9"/>`;
  S.hinten(f);
}

/* =====================================================================
   1 — DER BERG FUJI
   ===================================================================== */
{
  let k = "";
  /* Kegel mit hohlen Flanken: Höhe fällt nach außen wie (1 − |x|/165)^2,1; nur im Bild */
  const PX = 120;
  const hang = (x) => -87 * Math.pow(Math.max(0, 1 - Math.max(0, Math.abs(x) - 6) / 165), 2.1);
  let pfad = `M${-PX} 0`;
  for (let x = -PX; x <= 320 - PX; x += 8) pfad += ` L${x} ${r(Math.min(hang(x), -0.01))}`;
  pfad += ` L${320 - PX} 0 Z`;
  k += `<path d="${pfad}" fill="${S.lg("fuji", [[0, "#5d6d9a"], [0.5, "#6f7fa9"], [1, "#9aa6c4"]])}"/>`;
  k += `<path d="${pfad}" fill="${S.lg("fujilicht", [[0, "#000", 0.12], [0.5, "#000", 0], [0.55, "#fff", 0.06], [1, "#fff", 0.12]], 0, 0, 1, 0)}"/>`;
  /* Schneekappe mit Rinnen */
  let schnee = "M-8 -86 L-4 -87 L4 -87 L8 -86 Q14 -79 22 -70 ";
  for (let i = 0; i <= 10; i++) { const x = 22 - i * 4.4, y = -70 + (i % 2 ? -1 : 1) * (4 + rnd() * 6) + Math.abs(i - 5) * -0.4; schnee += `L${r(x)} ${r(y)} `; }
  schnee += "Q-14 -79 -8 -86 Z";
  k += `<path d="${schnee}" fill="${S.lg("schnee", [[0, "#ffffff"], [1, "#dfe6f2"]], 0, 0, 1, 0)}"/>`;
  for (const [x, l] of [[-12, 16], [-5, 22], [3, 20], [11, 14], [17, 11], [-17, 10]]) k += `<path d="M${x} ${r(-80 + Math.abs(x) * 0.3)} L${r(x * 1.25)} ${r(-80 + l)}" stroke="#fff" stroke-width="${r(0.6 + rnd() * 0.6)}" opacity=".85"/>`;
  for (const x of [-30, -16, 14, 28]) k += `<path d="M${r(x * 0.5)} -70 L${r(x * 1.6)} -36" stroke="#4f5f8a" stroke-width=".5" opacity=".35"/>`;
  k += `<path d="M-6 -86.4 L6 -86.4" stroke="#c9d3e3" stroke-width=".5"/>`;
  k += `<rect x="-120" y="-14" width="320" height="14" fill="${S.lg("fujidunst", [[0, "#e8eef2", 0], [1, "#e8eef2", 0.75]])}"/>`;
  S.teil({ anker: [120, 52], id: "fuji", de: "der Berg Fuji", syl: "BERG FU-ji", it: "il monte Fuji", itSyl: "MON-te FU-ji", en: "Mount Fuji", x: 120, y: HOR, kunst: k,
    tipp: "Der Fuji ist mit 3776 Metern der höchste Berg Japans – ein Vulkan." });
}

/* =====================================================================
   2 — DER HÜGEL (bewaldet, mit Kirschbäumen) und 3 — DIE PAGODE
   ===================================================================== */
{
  let k = `<path d="M-80 10 Q-50 -6 -20 -16 Q0 -24 20 -22 Q50 -16 70 -2 L80 10 Z" fill="${S.lg("huegel", [[0, "#3f6a3a"], [1, "#2f522c"]])}"/>`;
  for (let i = 0; i < 70; i++) { const x = -70 + rnd() * 140, y = -18 + rnd() * 26 + Math.abs(x) * 0.12; k += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(1.4 + rnd() * 1.8)}" fill="${rnd() < 0.55 ? "#4f7d45" : BLUETE[Math.floor(rnd() * 5)]}" opacity=".95"/>`; }
  k += `<path d="M-22 10 L-6 -18 L-4 -18 L-16 10 Z" fill="#b9b2a4" opacity=".6"/>`;
  S.teil({ id: "huegel", de: "der Hügel", syl: "HÜ-gel", it: "la collina", itSyl: "col-LI-na", en: "hill", x: 80, y: 108, kunst: k });
}
{
  let k = "";
  /* Sockel und fünf Geschosse: jedes kleiner, Dächer mit aufgebogenen Ecken */
  k += `<rect x="-11" y="-3" width="22" height="3" fill="#cfc8b8"/>`;
  const etagen = [[-3, 9, 9, 15], [-15, 8, 8, 13.4], [-26, 7.2, 7.4, 12], [-36, 6.4, 6.8, 10.8], [-45, 5.6, 6.2, 9.6]];
  for (const [y, w, h, dw] of etagen) {
    k += `<rect x="${-w}" y="${r(y - h)}" width="${2 * w}" height="${h}" fill="#f4efe4"/>`;
    for (const x of [-w, -w / 3, w / 3, w]) k += `<rect x="${r(x - 0.6)}" y="${r(y - h)}" width="1.2" height="${h}" fill="${ZINNOBER}"/>`;
    k += `<rect x="${-w}" y="${r(y - h)}" width="${2 * w}" height="1.2" fill="${ZINNOBER}"/>`;
    /* Dach: geschwungen mit hochgezogenen Ecken */
    const dy = y - h;
    k += `<path d="M${r(-dw)} ${r(dy - 0.4)} Q${r(-dw * 0.7)} ${r(dy + 0.6)} 0 ${r(dy + 0.4)} Q${r(dw * 0.7)} ${r(dy + 0.6)} ${r(dw)} ${r(dy - 0.4)} L${r(dw * 0.6)} ${r(dy - 3.4)} L${r(-dw * 0.6)} ${r(dy - 3.4)} Z" fill="${DACH}"/>`;
    k += `<path d="M${r(-dw)} ${r(dy - 0.4)} Q${r(-dw * 0.7)} ${r(dy + 0.6)} 0 ${r(dy + 0.4)} Q${r(dw * 0.7)} ${r(dy + 0.6)} ${r(dw)} ${r(dy - 0.4)}" stroke="#8a929c" stroke-width=".35" fill="none"/>`;
  }
  /* Sōrin: Bronze-Spitze mit neun Ringen */
  const top = -45 - 6.2 - 3.4;
  k += `<rect x="-.5" y="${r(top - 13)}" width="1" height="13" fill="#7a6a3a"/>`;
  for (let i = 0; i < 9; i++) k += `<ellipse cx="0" cy="${r(top - 2 - i * 1.1)}" rx="${r(1.6 - i * 0.05)}" ry=".3" fill="#9a8a4a"/>`;
  k += `<circle cx="0" cy="${r(top - 13.6)}" r=".8" fill="#b8a050"/>`;
  k += `<path d="M-8 -3 L-8 -12" stroke="#fff" stroke-width=".6" opacity=".2"/>`;
  S.teil({ id: "pagode", de: "die Pagode", syl: "Pa-GO-de", it: "la pagoda", itSyl: "pa-GO-da", en: "pagoda", x: 62, y: 90, kunst: k,
    tipp: "Die Chureito-Pagode hat fünf Stockwerke. Von hier sieht man sie zusammen mit dem Fuji." });
}

/* =====================================================================
   4 — DER SCHNELLZUG (Shinkansen N700S) im Tal, mit Oberleitung
   ===================================================================== */
{
  const Y = HOR + 6, u = uAt(80);   /* 3,25 je Meter */
  const H = 3.6 * u;
  let k = `<rect x="-6" y="-1" width="160" height="2.4" fill="#8a8579"/><rect x="-6" y="-1.6" width="160" height=".6" fill="#6a665e"/>`;
  /* Masten und Fahrdraht */
  for (let x = 4; x < 160; x += 34) k += `<rect x="${x}" y="${r(-H - 8)}" width=".8" height="${r(H + 8)}" fill="#7d838a"/><rect x="${x - 3}" y="${r(-H - 6.4)}" width="6" height=".5" fill="#7d838a"/>`;
  k += `<line x1="-6" y1="${r(-H - 4.6)}" x2="154" y2="${r(-H - 4.6)}" stroke="#4a4f55" stroke-width=".25"/>`;
  /* Zug: lange flache Nase links, weißer Wagenkasten, blaue Streifen */
  k += `<path d="M2 -1.6 Q-2 -2 1 -4.2 Q8 -9.6 20 ${r(-H + 0.4)} L150 ${r(-H + 0.4)} L150 -1.6 Z" fill="${S.lg("zug", [[0, "#ffffff"], [0.6, "#f1f3f5"], [1, "#c9ced4"]])}"/>`;
  k += `<path d="M6 -3.6 Q12 -7.6 20 ${r(-H + 1.6)} L28 ${r(-H + 1.6)} Q22 -8 14 -4.6 Z" fill="#1f2c3e"/>`;
  k += `<path d="M3 -2.6 L150 -2.6 L150 -3.8 L6 -3.8 Z" fill="#1e4aa8"/><path d="M14 -4.6 L150 -4.6 L150 -5.1 L18 -5.1 Z" fill="#1e4aa8"/>`;
  for (let x = 32; x < 148; x += 2.6) k += `<rect x="${r(x)}" y="${r(-H + 3.4)}" width="1.6" height="1.8" rx=".3" fill="#2e3c4e"/>`;
  for (const x of [56, 96, 136]) k += `<line x1="${x}" y1="${r(-H + 0.6)}" x2="${x}" y2="-1.6" stroke="#b9bec4" stroke-width=".3"/>`;
  k += `<rect x="70" y="${r(-H - 1.4)}" width="5" height="1.2" fill="#555b62"/><path d="M72.4 ${r(-H - 1.4)} L76 ${r(-H - 4.6)}" stroke="#555b62" stroke-width=".3"/>`;
  k += `<path d="M8 -6 Q14 -10 22 ${r(-H + 0.8)}" stroke="#fff" stroke-width=".5" opacity=".7" fill="none"/>`;
  S.teil({ anker: [100, 114], id: "shinkansen", de: "der Schnellzug", syl: "SCHNELL-zug", it: "il treno veloce", itSyl: "TRE-no ve-LO-ce", en: "bullet train", x: 22, y: Y, kunst: k,
    tipp: "Der Shinkansen fährt bis zu 285 km/h – von Tokio nach Osaka in zweieinhalb Stunden." });
}

/* =====================================================================
   5 — DAS TORII und 6 — DIE FLAGGE am Torii
   ===================================================================== */
{
  const u = uAt(30), Y = yAt(30);   /* 8,7 je Meter, y 125,9 */
  const H = 4.4 * u, B2 = 2.1 * u;
  let k = schatten(0, 0.3, B2 + 4, 1, 0.25);
  for (const s of [-1, 1]) {
    k += `<path d="M${r(s * B2 - 1.3)} 0 L${r(s * B2 * 0.96 - 1.1)} ${r(-H + 3)} L${r(s * B2 * 0.96 + 1.1)} ${r(-H + 3)} L${r(s * B2 + 1.3)} 0 Z" fill="${ZINNOBER}"/>`;
    k += `<rect x="${r(s * B2 - 1.7)}" y="-2.2" width="3.4" height="2.2" fill="#222"/>`;
  }
  /* Nuki (unterer Querbalken) und Gakuzuka mit Tafel */
  k += `<rect x="${r(-B2 - 4)}" y="${r(-H + 9)}" width="${r(2 * B2 + 8)}" height="2.4" fill="${ZINNOBER}"/>`;
  k += `<rect x="-1.4" y="${r(-H + 3)}" width="2.8" height="6" fill="${ZINNOBER}"/><rect x="-2.6" y="${r(-H + 3.8)}" width="5.2" height="4.4" fill="#2a2a2a" stroke="#c9a640" stroke-width=".3"/>`;
  /* Shimaki und Kasagi (oben, geschwungen, schwarz) */
  k += `<path d="M${r(-B2 - 6)} ${r(-H + 2.8)} L${r(B2 + 6)} ${r(-H + 2.8)} L${r(B2 + 6)} ${r(-H)} L${r(-B2 - 6)} ${r(-H)} Z" fill="${ZINNOBER}"/>`;
  k += `<path d="M${r(-B2 - 9)} ${r(-H - 4.4)} Q${r(-B2 - 4)} ${r(-H - 0.6)} 0 ${r(-H - 0.6)} Q${r(B2 + 4)} ${r(-H - 0.6)} ${r(B2 + 9)} ${r(-H - 4.4)} L${r(B2 + 8)} ${r(-H + 0.4)} Q${r(B2 + 3)} ${r(-H + 0.2)} 0 ${r(-H + 0.2)} Q${r(-B2 - 3)} ${r(-H + 0.2)} ${r(-B2 - 8)} ${r(-H + 0.4)} Z" fill="#1d1d1f"/>`;
  k += `<path d="M${r(-B2 - 8)} ${r(-H - 3.2)} Q0 ${r(-H + 0.4)} ${r(B2 + 8)} ${r(-H - 3.2)}" stroke="#55585e" stroke-width=".4" fill="none"/>`;
  S.teil({ id: "torii", de: "das Torii", syl: "TO-rii", it: "il torii", itSyl: "TO-rii", en: "torii gate", x: 104, y: Y, steht: true, kunst: k,
    tipp: "Das Torii ist das Tor zu einem Schrein. Hinter ihm beginnt der heilige Bereich." });
}
{
  const u = uAt(30), H = 4.4 * u, B2 = 2.1 * u;
  let k = `<line x1="0" y1="0" x2="13" y2="-9" stroke="#d9d6cf" stroke-width=".6"/><circle cx="13.2" cy="-9.1" r=".6" fill="#c9a640"/>`;
  k += `<g transform="translate(12.6 -8.6) rotate(-4)"><rect width="13.5" height="9" fill="#fbfbf8" stroke="#ddd" stroke-width=".15"/><circle cx="6.75" cy="4.5" r="2.7" fill="#bc002d"/><path d="M4 0 Q5.6 4.5 4 9" stroke="#000" stroke-width="1.4" opacity=".06" fill="none"/></g>`;
  S.teil({ oben: true, id: "flagge", de: "die Flagge", syl: "FLAG-ge", it: "la bandiera", itSyl: "ban-DIE-ra", en: "flag", x: r(104 + B2 + 1), y: r(yAt(30) - H + 14), kunst: k + flaeche(-1, -11, 27.6, 13),
    tipp: "Die japanische Flagge zeigt eine rote Sonne. Japan heißt „Land der aufgehenden Sonne“." });
}

/* =====================================================================
   7 — DER TEICH mit 8 — DEM KARPFEN (Koi) und 9 — DIE STEINLATERNE
   ===================================================================== */
const TEICH = { x: 100, y: 176, rx: 56, ry: 10 };
{
  let k = `<ellipse cx="0" cy="0" rx="${TEICH.rx + 3}" ry="${TEICH.ry + 2}" fill="#8f8a80"/>`;
  for (let i = 0; i < 26; i++) { const a = i / 26 * Math.PI * 2; k += `<ellipse cx="${r(Math.cos(a) * (TEICH.rx + 2))}" cy="${r(Math.sin(a) * (TEICH.ry + 1.4))}" rx="${r(2.6 + rnd() * 2)}" ry="${r(1.2 + rnd() * 0.8)}" fill="${rnd() < 0.5 ? "#a39e93" : "#7d786e"}"/>`; }
  k += `<ellipse cx="0" cy="0" rx="${TEICH.rx}" ry="${TEICH.ry}" fill="${S.rg("wasser", [[0, "#5d8f8a"], [0.7, "#3d6f6c"], [1, "#2a5250"]], 0.5, 0.4, 0.7)}"/>`;
  k += `<ellipse cx="-6" cy="-3" rx="34" ry="3" fill="#cfe4ea" opacity=".25"/>`;
  for (const [x, y] of [[30, 3], [38, -2], [-40, 4]]) k += `<ellipse cx="${x}" cy="${y}" rx="3.4" ry="1.2" fill="#4f8a3e"/><path d="M${x} ${y} l2.4 -.8" stroke="#2f5a2a" stroke-width=".3"/>`;
  k += `<circle cx="34" cy="1" r=".9" fill="#f6c8d8"/>`;
  for (let i = 0; i < 14; i++) k += `<ellipse cx="${r(-40 + rnd() * 80)}" cy="${r(-6 + rnd() * 12)}" rx=".7" ry=".35" fill="${BLUETE[i % 5]}"/>`;
  S.teil({ id: "teich", de: "der Teich", syl: "TEICH", it: "lo stagno", itSyl: "STA-gno", en: "pond", x: TEICH.x, y: TEICH.y, kunst: k });
}
{
  const koi = (x, y, s, w, farben) => {
    let g = `<g transform="translate(${x} ${y}) rotate(${w}) scale(${s})">`;
    g += `<path d="M-7 0 Q-4 -2.4 2 -1.8 Q6 -1.2 7 0 Q6 1.2 2 1.8 Q-4 2.4 -7 0 Z" fill="${farben[0]}"/>`;
    g += `<path d="M-7 0 L-10.4 -2.4 Q-9.4 0 -10.4 2.4 Z" fill="${farben[0]}" opacity=".85"/>`;
    g += `<path d="M-2 -1.6 Q0 -.4 2.6 -1.4 Q1 .2 -2 .4 Z" fill="${farben[1]}"/><path d="M3.4 -1 Q5 0 3.4 1 Z" fill="${farben[1]}"/>`;
    g += `<path d="M1 1.6 L-.6 3.4 L-1.4 1.8 Z M1 -1.6 L-.6 -3.4 L-1.4 -1.8 Z" fill="${farben[0]}" opacity=".75"/>`;
    g += `<circle cx="5.4" cy="-.6" r=".3" fill="#111"/></g>`;
    return g;
  };
  const k = koi(-14, -1, 1.15, -8, ["#f4f1ea", "#e2401c"]) + koi(10, 3, 1, 170, ["#f08a24", "#f8d27a"]) + koi(-28, 4, 0.9, 20, ["#e2401c", "#f4f1ea"]);
  S.teil({ oben: true, id: "koi", de: "der Karpfen", syl: "KARP-fen", it: "la carpa", itSyl: "CAR-pa", en: "carp", x: TEICH.x, y: TEICH.y, kunst: k + flaeche(-40, -6, 62, 12),
    tipp: "Die bunten Karpfen heißen in Japan „Koi“. Sie können über 50 Jahre alt werden." });
}
{
  const d = 9.2, u = uAt(d), Y = yAt(d);
  const ST = S.lg("granit", [[0, "#a9a59c"], [0.4, "#cfcbc2"], [1, "#8c887f"]], 0, 0, 1, 0);
  let k = schatten(0, 0.3, 8, 1.2, 0.3);
  k += `<path d="M-6 0 L-5 -3 L5 -3 L6 0 Z" fill="${ST}"/><rect x="-1.8" y="-18" width="3.6" height="15" fill="${ST}"/>`;
  k += `<path d="M-5 -18 L5 -18 L4 -20.4 L-4 -20.4 Z" fill="${ST}"/>`;
  k += `<rect x="-4" y="-28" width="8" height="7.6" fill="${ST}"/><rect x="-2.4" y="-26.4" width="4.8" height="4.4" fill="#2e2a24"/><rect x="-1.6" y="-25.6" width="3.2" height="3" fill="#f6dc8a" opacity=".55"/>`;
  k += `<path d="M-9 -28 Q-4 -30 0 -33.6 Q4 -30 9 -28 L7.6 -27 L-7.6 -27 Z" fill="${ST}"/><path d="M-9 -28 L-10 -29.4 M9 -28 L10 -29.4" stroke="#8c887f" stroke-width=".8"/>`;
  k += `<circle cx="0" cy="-34.6" r="1.4" fill="${ST}"/><path d="M-1 -36 L0 -38 L1 -36 Z" fill="${ST}"/>`;
  k += `<path d="M-4 -28 Q-6 -24 -5 -18" stroke="#6f8a4e" stroke-width=".9" opacity=".6" fill="none"/>`;
  S.teil({ id: "steinlaterne", de: "die Steinlaterne", syl: "STEIN-la-ter-ne", it: "la lanterna di pietra", itSyl: "lan-TER-na di PIE-tra", en: "stone lantern", x: 150, y: Y, steht: true, kunst: k });
}

/* =====================================================================
   10 — DIE KIRSCHBLÜTE (Kirschbaum links vorn) und 11 — DER BAMBUS
   ===================================================================== */
{
  const Y = yAt(8.4);
  let k = schatten(4, 0.3, 14, 1.6, 0.3);
  /* Stamm und Äste: dunkle Rinde mit Querstreifen */
  const RINDE = S.lg("rinde", [[0, "#3a2a24"], [0.5, "#5a4238"], [1, "#2e211c"]], 0, 0, 1, 0);
  k += `<path d="M-2 0 Q-4 -30 0 -60 Q2 -80 -2 -110 L5 -112 Q10 -80 6 -58 Q4 -30 8 0 Z" fill="${RINDE}"/>`;
  k += `<path d="M2 -70 Q20 -96 36 -138 L39 -136 Q24 -94 6 -62 Z" fill="${RINDE}"/><path d="M0 -96 Q-8 -120 -6 -150 L-3 -150 Q-4 -122 4 -100 Z" fill="${RINDE}"/>`;
  
  for (let y = -6; y > -100; y -= 7) k += `<path d="M${r(-1 + (y / -110) * -3)} ${y} h7" stroke="#7a6458" stroke-width=".4" opacity=".6"/>`;
  /* Blütenwolken */
  const wolken = [[2, -146, 16, 14], [20, -150, 18, 10], [6, -124, 18, 12], [26, -126, 11, 8], [-6, -104, 8, 9]];
  for (const [cx, cy, rx, ry] of wolken) {
    k += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${S.rg("bluetenwolke", [[0, "#fde8ef"], [0.6, "#f6c2d4"], [1, "#e9a3bd"]], 0.4, 0.35, 0.7)}"/>`;
    for (let i = 0; i < 22; i++) { const a = rnd() * Math.PI * 2, rr = Math.sqrt(rnd()); k += `<circle cx="${r(cx + Math.cos(a) * rx * rr)}" cy="${r(cy + Math.sin(a) * ry * rr)}" r="${r(1 + rnd() * 1.4)}" fill="${BLUETE[Math.floor(rnd() * 5)]}"/>`; }
    for (let i = 0; i < 4; i++) k += `<circle cx="${r(cx - rx * 0.5 + rnd() * rx)}" cy="${r(cy + ry * 0.3 + rnd() * ry * 0.4)}" r=".5" fill="#c4527a" opacity=".6"/>`;
  }
  S.teil({ id: "kirschbluete", de: "die Kirschblüte", syl: "KIRSCH-blü-te", it: "il fiore di ciliegio", itSyl: "FIO-re di ci-LIE-gio", en: "cherry blossom", x: 16, y: Y, steht: true, kunst: k,
    tipp: "Im Frühling feiern die Japaner unter den Kirschbäumen das Fest „Hanami“: Blüten anschauen." });
}
{
  const Y = yAt(7.6);
  let k = "";
  const halme = [[-8, 1.9, -0.02], [-3, 2.3, 0.01], [2, 2.1, -0.015], [7, 2.5, 0.02], [11, 1.8, -0.01]];
  for (const [x, w, n] of halme) {
    k += `<path d="M${x - w / 2} 0 L${r(x - w / 2 + n * Y)} ${r(-Y)} L${r(x + w / 2 + n * Y)} ${r(-Y)} L${x + w / 2} 0 Z" fill="${S.lg("bambus", [[0, "#5f8f3a"], [0.4, "#9cc464"], [1, "#4f7a2e"]], 0, 0, 1, 0)}"/>`;
    for (let y = -10; y > -Y + 2; y -= 14 + rnd() * 4) k += `<rect x="${r(x - w / 2 - 0.3 + n * -y)}" y="${r(y)}" width="${r(w + 0.6)}" height=".9" rx=".4" fill="#3f6a28"/>`;
  }
  for (let i = 0; i < 40; i++) { const x = -12 + rnd() * 26, y = -40 - rnd() * (Y - 46), a = -40 + rnd() * 80; k += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="4.4" ry=".9" fill="${rnd() < 0.5 ? "#6fa040" : "#4f8030"}" transform="rotate(${Math.round(a)} ${r(x)} ${r(y)})"/>`; }
  S.teil({ id: "bambus", de: "der Bambus", syl: "BAM-bus", it: "il bambù", itSyl: "bam-BÙ", en: "bamboo", x: 166, y: Y, steht: true, kunst: k,
    tipp: "Bambus ist ein Gras. Manche Arten wachsen fast einen Meter an einem Tag." });
}

/* =====================================================================
   12 — DAS TEEHAUS (Veranda, Pfosten, Dachvorsprung)
   ===================================================================== */
const WAND = { d: 7, x0: 172, oben: yAt(7, 2.8), boden: yAt(7, 0.5) };
{
  let k = "";
  /* Wand hinter den Schiebetüren (dunkles Holz) */
  k += `<rect x="${WAND.x0}" y="${r(WAND.oben)}" width="${320 - WAND.x0}" height="${r(WAND.boden - WAND.oben)}" fill="${DUNKELHOLZ}"/>`;
  /* Verandaboden: Dielen längs, in Fluchtperspektive */
  const vx = (d) => xAt(WAND.x0, d);
  const fy = (d) => yAt(d, 0.5);
  k += `<path d="M${r(vx(3.2))} 200 L${WAND.x0} ${r(WAND.boden)} L320 ${r(WAND.boden)} L320 200 Z" fill="${HOLZ_H}"/>`;
  for (const d of [6.2, 5.5, 4.9, 4.4, 4, 3.6]) k += `<line x1="${r(vx(d))}" y1="${r(fy(d))}" x2="320" y2="${r(fy(d))}" stroke="#7a5a38" stroke-width=".4" opacity=".7"/>`;
  k += `<path d="M${r(vx(3.2))} 200 L${WAND.x0} ${r(WAND.boden)} L320 ${r(WAND.boden)} L320 200 Z" fill="${S.lg("dielenglanz", [[0, "#000", 0.15], [0.5, "#fff", 0.08], [1, "#000", 0.05]])}"/>`;
  /* Stirnseite der Veranda (links) bis zum Boden */
  k += `<path d="M${WAND.x0} ${r(WAND.boden)} L${r(vx(3.2))} 200 L${r(vx(3.2) - 0.1)} 200 L${WAND.x0} ${r(yAt(7))} Z" fill="#4a3220"/>`;
  k += `<path d="M${WAND.x0} ${r(WAND.boden)} L${r(vx(4))} ${r(fy(4))} L${r(vx(4))} ${r(yAt(4.6) > 200 ? 200 : yAt(4.6))} L${WAND.x0} ${r(yAt(7))} Z" fill="${S.lg("stirn", [[0, "#5e4228"], [1, "#3a2818"]])}"/>`;
  /* Pfosten: an der Wand und vorn links */
  for (const x of [WAND.x0, 232, 292]) k += `<rect x="${x - 1.6}" y="${r(WAND.oben)}" width="3.2" height="${r(WAND.boden - WAND.oben)}" fill="${HOLZ}"/>`;
  const PX = vx(4.6);
  k += `<rect x="${r(PX - 2.6)}" y="${r(yAt(4.5, 3.1))}" width="5.2" height="${r(fy(4.6) - yAt(4.5, 3.1))}" fill="${S.lg("pfosten", [[0, "#5e4228"], [0.4, "#9a7550"], [1, "#4a3220"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${r(PX - 3.2)}" y="${r(fy(4.6) - 2)}" width="6.4" height="2" fill="#8c887f"/>`;
  /* Dachvorsprung: Unterseite mit Sparren, Traufe mit Ziegeln */
  const ex = vx(4.4), ey = yAt(4.4, 3.15);
  k += `<path d="M${WAND.x0} ${r(WAND.oben)} L320 ${r(WAND.oben)} L320 ${r(ey)} L${r(ex)} ${r(ey)} Z" fill="${S.lg("traufe", [[0, "#3a2818"], [1, "#6b4c30"]])}"/>`;
  for (let i = 0; i < 16; i++) { const x7 = WAND.x0 + 6 + i * 9.6, x2 = xAt(x7, 4.4); if (x2 > 320) { const t = (320 - x7) / (x2 - x7); k += `<line x1="${r(x7)}" y1="${r(WAND.oben)}" x2="320" y2="${r(WAND.oben + (ey - WAND.oben) * t)}" stroke="#2a1c10" stroke-width=".9"/>`; } else k += `<line x1="${r(x7)}" y1="${r(WAND.oben)}" x2="${r(x2)}" y2="${r(ey)}" stroke="#2a1c10" stroke-width=".9"/>`; }
  k += `<path d="M${r(ex - 2)} ${r(ey)} L320 ${r(ey)} L320 ${r(ey - 5)} L${r(ex - 6)} ${r(ey - 5)} Z" fill="${DACH}"/>`;
  k += `<path d="M${r(ex - 6)} ${r(ey - 5)} L320 ${r(ey - 5)} L320 0 L${r(ex + 4)} 0 Z" fill="${S.lg("ziegeldach", [[0, "#2e3238"], [1, "#4a5058"]])}"/>`;
  for (let x = ex - 4; x < 320; x += 3.4) k += `<circle cx="${r(x)}" cy="${r(ey - 2.4)}" r="1.5" fill="#3a3f46" stroke="#22252a" stroke-width=".3"/>`;
  k += `<line x1="${r(ex - 2)}" y1="${r(ey + 0.2)}" x2="320" y2="${r(ey + 0.2)}" stroke="#7a828c" stroke-width=".5"/>`;
  S.teil({ anker: [300, 64], id: "teehaus", de: "das Teehaus", syl: "TEE-haus", it: "la casa del tè", itSyl: "CA-sa del TÈ", en: "teahouse", x: 0, y: 0, kunst: k,
    tipp: "Vor dem Teehaus zieht man die Schuhe aus. Drinnen liegen Strohmatten (Tatami)." });
}

/* =====================================================================
   13 — DIE SCHIEBETÜR (Shōji) mit offenem Feld, 14 — DER KIMONO
   ===================================================================== */
{
  let k = "";
  const felder = [[WAND.x0 + 2, 232 - 1.6], [232 + 1.6, 292 - 1.6], [292 + 1.6, 320]];
  const y0 = WAND.oben + 2, y1 = WAND.boden;
  /* linkes Feld: halb offen — dahinter das Zimmer mit Tatami */
  const [a0, a1] = felder[0];
  const offen = a0 + (a1 - a0) * 0.62;
  k += `<rect x="${a0}" y="${r(y0)}" width="${r(offen - a0)}" height="${r(y1 - y0)}" fill="${S.lg("zimmer", [[0, "#cdb98f"], [1, "#a8915f"]])}"/>`;
  k += `<rect x="${a0}" y="${r(y1 - 14)}" width="${r(offen - a0)}" height="14" fill="${S.lg("tatami", [[0, "#c9c27a"], [1, "#a9a25a"]])}"/><line x1="${a0}" y1="${r(y1 - 7)}" x2="${r(offen)}" y2="${r(y1 - 7)}" stroke="#3a3a2a" stroke-width=".6"/>`;
  const shoji = (x0, x1, dunkel) => {
    let g = `<rect x="${r(x0)}" y="${r(y0)}" width="${r(x1 - x0)}" height="${r(y1 - y0)}" fill="${PAPIER}"/>`;
    if (dunkel) g += `<rect x="${r(x0)}" y="${r(y0)}" width="${r(x1 - x0)}" height="${r(y1 - y0)}" fill="#000" opacity=".06"/>`;
    for (let x = x0 + (x1 - x0) / 4; x < x1 - 1; x += (x1 - x0) / 4) g += `<line x1="${r(x)}" y1="${r(y0)}" x2="${r(x)}" y2="${r(y1)}" stroke="#8a6440" stroke-width=".5"/>`;
    for (let y = y0 + 8; y < y1 - 10; y += 8) g += `<line x1="${r(x0)}" y1="${r(y)}" x2="${r(x1)}" y2="${r(y)}" stroke="#8a6440" stroke-width=".5"/>`;
    g += `<rect x="${r(x0)}" y="${r(y1 - 10)}" width="${r(x1 - x0)}" height="10" fill="#8a6440"/>`;
    g += `<rect x="${r(x0)}" y="${r(y0)}" width="${r(x1 - x0)}" height="${r(y1 - y0)}" fill="none" stroke="#6b4c30" stroke-width="1.1"/>`;
    return g;
  };
  k += shoji(offen, a1, true);
  k += shoji(felder[1][0], (felder[1][0] + felder[1][1]) / 2) + shoji((felder[1][0] + felder[1][1]) / 2, felder[1][1]);
  k += shoji(felder[2][0], felder[2][1]);
  k += `<rect x="${WAND.x0}" y="${r(y0)}" width="${320 - WAND.x0}" height="${r(y1 - y0)}" fill="${S.lg("shojilicht", [[0, "#fff6dc", 0.25], [1, "#fff6dc", 0]], 0, 0, 1, 0)}"/>`;
  S.teil({ oben: true, anker: [262, 112], id: "schiebetuer", de: "die Schiebetür", syl: "SCHIE-be-tür", it: "la porta scorrevole", itSyl: "POR-ta scor-RE-vo-le", en: "sliding door", x: 0, y: 0, kunst: k,
    tipp: "Die Schiebetüren sind aus Holz und dünnem Papier. Das Licht scheint weich hindurch." });
}
{
  /* Kimono auf dem lackierten Ständer (Ikō), im Zimmer hinter der offenen Tür */
  const x0 = WAND.x0 + 2, x1 = x0 + (232 - 1.6 - x0) * 0.62;
  const cx = (x0 + x1) / 2, top = WAND.oben + 10, u = uAt(7.6);
  let k = `<rect x="${r(cx - 18)}" y="${r(top - 1.6)}" width="36" height="1.6" fill="#1d1d1f"/><rect x="${r(cx - 16.6)}" y="${r(top - 1.6)}" width="1.4" height="${r(WAND.boden - top - 12)}" fill="#1d1d1f"/><rect x="${r(cx + 15.2)}" y="${r(top - 1.6)}" width="1.4" height="${r(WAND.boden - top - 12)}" fill="#1d1d1f"/>`;
  const KI = S.lg("kimono", [[0, "#2b4a8a"], [1, "#1c3264"]]);
  k += `<path d="M${r(cx - 16)} ${r(top)} L${r(cx + 16)} ${r(top)} L${r(cx + 15)} ${r(top + 12)} L${r(cx + 7)} ${r(top + 12)} L${r(cx + 7.6)} ${r(top + 1.5 * u * 0.8)} L${r(cx - 7.6)} ${r(top + 1.5 * u * 0.8)} L${r(cx - 7)} ${r(top + 12)} L${r(cx - 15)} ${r(top + 12)} Z" fill="${KI}"/>`;
  /* Kragen, Obi, Muster (Kirschblüten und Wellen) */
  k += `<path d="M${r(cx - 2.6)} ${r(top)} L${r(cx)} ${r(top + 12)} L${r(cx + 2.6)} ${r(top)}" stroke="#f3efe6" stroke-width="1.4" fill="none"/>`;
  k += `<rect x="${r(cx - 7.4)}" y="${r(top + 14)}" width="14.8" height="5.6" fill="${S.lg("obi", [[0, "#e8c25a"], [1, "#b88a2a"]])}"/><rect x="${r(cx - 7.4)}" y="${r(top + 16.4)}" width="14.8" height=".8" fill="#c8242c"/>`;
  for (let i = 0; i < 14; i++) { const x = cx - 14 + rnd() * 28, y = top + 2 + rnd() * (1.5 * u * 0.8 - 4); if (Math.abs(x - cx) > 7 && y > top + 12) continue; k += `<circle cx="${r(x)}" cy="${r(y)}" r=".9" fill="${BLUETE[i % 5]}"/>`; }
  for (let i = 0; i < 3; i++) k += `<path d="M${r(cx - 7)} ${r(top + 1.5 * u * 0.8 - 2 - i * 2.4)} q2 -1.4 3.5 0 q2 -1.4 3.5 0 q2 -1.4 3.5 0 q2 -1.4 3.5 0" stroke="#9fc0e0" stroke-width=".4" fill="none"/>`;
  S.teil({ oben: true, anker: [198, 112], id: "kimono", de: "der Kimono", syl: "KI-mo-no", it: "il kimono", itSyl: "KI-mo-no", en: "kimono", x: 0, y: 0, kunst: k,
    tipp: "Der Kimono wird mit einem breiten Gürtel gebunden, dem Obi." });
}

/* =====================================================================
   15 — DER LAMPION unter dem Dachvorsprung
   ===================================================================== */
{
  let k = `<line x1="0" y1="-26" x2="0" y2="-21" stroke="#2a2a2a" stroke-width=".5"/><rect x="-3.4" y="-21.6" width="6.8" height="1.8" fill="#1d1d1f"/>`;
  k += `<path d="M-3.4 -19.8 Q-8 -10 -3.4 -.2 L3.4 -.2 Q8 -10 3.4 -19.8 Z" fill="${S.rg("lampion", [[0, "#ff8a5a"], [0.6, "#d8301e"], [1, "#9a1a10"]], 0.45, 0.45, 0.65)}"/>`;
  for (let y = -17; y > -19 + 18; y -= 2.6) k += `<path d="M-${r(4.2 + Math.sin((-y) / 20 * Math.PI) * 2.2)} ${r(y)} Q0 ${r(y + 0.8)} ${r(4.2 + Math.sin((-y) / 20 * Math.PI) * 2.2)} ${r(y)}" stroke="#7a1a10" stroke-width=".3" opacity=".7" fill="none"/>`;
  for (let i = 0; i < 7; i++) { const y = -3 - i * 2.4, w = 4.2 + Math.sin((y + 19.8) / 19.6 * Math.PI) * 2; k += `<path d="M${r(-w)} ${r(y)} Q0 ${r(y + 0.7)} ${r(w)} ${r(y)}" stroke="#7a1a10" stroke-width=".3" opacity=".6" fill="none"/>`; }
  k += `<rect x="-3.4" y="-.4" width="6.8" height="1.8" fill="#1d1d1f"/><path d="M-1 1.4 L-1.4 4 M1 1.4 L1.4 4 M0 1.4 L0 4.4" stroke="#e2b33a" stroke-width=".4"/>`;
  k += `<ellipse cx="-1.6" cy="-12" rx="1.2" ry="4" fill="#fff" opacity=".2"/>`;
  S.teil({ oben: true, id: "lampion", de: "der Lampion", syl: "LAM-pi-on", it: "la lanterna di carta", itSyl: "lan-TER-na di CAR-ta", en: "paper lantern", x: 300, y: 50, kunst: k });
}

/* =====================================================================
   16 — DAS SITZKISSEN, 17 — DER TISCH, darauf SUSHI, RAMEN, STÄBCHEN,
        TEEKANNE, und 18 — DER FÄCHER
   ===================================================================== */
const TI = { x: 252, d: 4.8 };
const TU = uAt(TI.d);
const T_H = yAt(TI.d + 0.35, 0.83), T_V = yAt(TI.d - 0.35, 0.83), T_B = yAt(TI.d, 0.5);
{
  const d = 3.8, Y = yAt(d, 0.5), u = uAt(d);
  let k = schatten(0, 0.2, 18, 1.6, 0.3);
  const w = 0.32 * u, t = 0.1 * u;
  k += `<path d="M${r(-w)} 0 Q${r(-w - 1)} ${r(-t / 2)} ${r(-w + 2)} ${r(-t)} L${r(w - 2)} ${r(-t)} Q${r(w + 1)} ${r(-t / 2)} ${r(w)} 0 Z" fill="${S.lg("zabuton", [[0, "#7a2a3a"], [1, "#4e1824"]])}"/>`;
  k += `<path d="M${r(-w + 2)} ${r(-t)} L${r(w - 2)} ${r(-t)} L${r(w - 4)} ${r(-t - 4)} L${r(-w + 4)} ${r(-t - 4)} Z" fill="${S.lg("zabutonoben", [[0, "#9a3a4a"], [1, "#7a2a3a"]])}"/>`;
  k += `<circle cx="0" cy="${r(-t - 2)}" r=".8" fill="#e2b33a"/>`;
  S.teil({ id: "sitzkissen", de: "das Sitzkissen", syl: "SITZ-kis-sen", it: "il cuscino", itSyl: "cu-SCI-no", en: "floor cushion", x: TI.x - 4, y: Y, steht: true, kunst: k,
    tipp: "In Japan sitzt man am niedrigen Tisch auf einem Kissen, dem Zabuton." });
}
const PL = (T_H + T_V) / 2;
const tischDinge = [];   /* Lupe: was auf dem Tisch steht */
{
  /* DAS SUSHI auf dem Holzbrett (Geta) */
  let k = `<path d="M-13 0 L13 0 L12 -2.6 L-12 -2.6 Z" fill="${S.lg("geta", [[0, "#e2c08a"], [1, "#b8925a"]])}"/><rect x="-12" y="0" width="2" height="1.2" fill="#8a6440"/><rect x="10" y="0" width="2" height="1.2" fill="#8a6440"/>`;
  const nigiri = (x, f, streifen) => {
    let g = `<ellipse cx="${x}" cy="-3.4" rx="2.4" ry="1.1" fill="#fbfaf4"/>`;
    g += `<path d="M${x - 2.6} -3.6 Q${x} -6.4 ${x + 2.6} -3.6 Q${x} -2.8 ${x - 2.6} -3.6 Z" fill="${f}"/>`;
    if (streifen) for (let i = 0; i < 3; i++) g += `<path d="M${r(x - 1.6 + i * 1.2)} -5 l.6 1.2" stroke="${streifen}" stroke-width=".3"/>`;
    return g;
  };
  k += nigiri(-9, "#f08a5a", "#fbd3b8") + nigiri(-4, "#c8243a", null) + nigiri(1, "#f6e27a", null);
  k += `<path d="M5.4 -3.6 Q8 -6.6 10.6 -3.6 Q8 -2.8 5.4 -3.6 Z" fill="#f4a08a"/><path d="M6 -4.6 l.6 .8 M7.4 -5.2 l.6 .9 M8.8 -4.8 l.6 .8" stroke="#fff" stroke-width=".3"/><path d="M10.4 -3.8 l1.6 -.8 l-.4 1.4 Z" fill="#e2502e"/>`;
  k += `<rect x="1" y="-4.6" width="2" height=".6" fill="#1d2a1d"/>`;
  /* Maki-Rollen und Ingwer, Wasabi */
  for (const x of [-11.4, -8.6]) k += `<rect x="${x - 1.2}" y="-1.6" width="2.4" height="1.6" fill="#1d2a1d"/><ellipse cx="${x}" cy="-1.6" rx="1.2" ry=".5" fill="#fbfaf4"/><circle cx="${x}" cy="-1.6" r=".35" fill="#e2502e"/>`;
  k += `<ellipse cx="9" cy="-1.4" rx="1.6" ry=".6" fill="#f6c8c8"/><ellipse cx="11.2" cy="-1.3" rx=".8" ry=".45" fill="#8ab84a"/>`;
  tischDinge.push({ id: "sushi", de: "das Sushi", syl: "SU-shi", it: "il sushi", itSyl: "SU-shi", en: "sushi", x: TI.x - 14, y: r(PL + 2.4), steht: true, kunst: k + flaeche(-13.4, -7, 26.8, 8.4),
    tipp: "Sushi: Reis mit Essig, dazu roher Fisch, Ei oder Gemüse." });
}
{
  /* DIE NUDELSUPPE (Ramen) in der Schale */
  let k = `<path d="M-7.6 -4.6 Q-7 1.4 0 1.6 Q7 1.4 7.6 -4.6 Z" fill="${S.lg("ramenschale", [[0, "#2a2a2e"], [0.6, "#3a3a40"], [1, "#1a1a1e"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-6 -1 Q0 .6 6 -1" stroke="#c8242c" stroke-width=".6" fill="none"/>`;
  k += `<ellipse cx="0" cy="-4.6" rx="7.6" ry="2" fill="#c8242c"/><ellipse cx="0" cy="-4.6" rx="6.8" ry="1.6" fill="${S.lg("bruehe", [[0, "#e8b86a"], [1, "#c98a3a"]])}"/>`;
  for (let i = 0; i < 6; i++) k += `<path d="M${r(-5 + i * 1.6)} -4.2 q.8 -.8 1.6 0" stroke="#f6e2a0" stroke-width=".35" fill="none"/>`;
  k += `<ellipse cx="-3" cy="-5.2" rx="2" ry=".9" fill="#d9a07a" stroke="#a8644a" stroke-width=".2"/>`;
  k += `<ellipse cx="2" cy="-5" rx="1.3" ry=".8" fill="#fbfaf4"/><ellipse cx="2" cy="-5" rx=".7" ry=".45" fill="#f0a830"/>`;
  k += `<path d="M4 -6.4 L6.4 -6.4 L6.2 -3.8 L4.2 -3.8 Z" fill="#1d2a1d"/>`;
  k += `<circle cx="-.6" cy="-3.8" r=".9" fill="#fbfaf4"/><path d="M-1.1 -3.8 q.5 -.5 1 0 q-.5 .5 -1 0" stroke="#e85a8a" stroke-width=".25" fill="none"/>`;
  for (let i = 0; i < 6; i++) k += `<circle cx="${r(-4 + rnd() * 6)}" cy="${r(-4.6 + rnd() * 1.2)}" r=".3" fill="#5fa03a"/>`;
  k += `<path d="M-1 -7 q-.6 -1.4 0 -2.6 q.6 -1.2 0 -2.4 M2 -7 q-.6 -1.2 0 -2.2" stroke="#fff" stroke-width=".35" opacity=".55" fill="none"/>`;
  tischDinge.push({ id: "ramen", de: "die Nudelsuppe", syl: "NU-del-sup-pe", it: "la zuppa di noodle", itSyl: "ZUP-pa di NU-dle", en: "noodle soup", x: TI.x + 6, y: r(PL + 1.6), steht: true, kunst: k + flaeche(-7.8, -7.4, 15.6, 9.2),
    tipp: "Ramen isst man mit Stäbchen. Laut schlürfen ist in Japan höflich!" });
}
{
  /* DIE ESSSTÄBCHEN auf der Stäbchenbank */
  let k = `<ellipse cx="-4" cy="0" rx="1.2" ry=".5" fill="#b8cfe0"/>`;
  k += `<path d="M-9 -.6 L9 .4 L9 .9 L-9 -.2 Z" fill="#7a3a24"/><path d="M-9 .4 L9 1.2 L9 1.7 L-9 .8 Z" fill="#8a4a30"/>`;
  k += `<path d="M-9 -.6 L-4 -.3 M-9 .4 L-4 .7" stroke="#e2b33a" stroke-width=".35"/>`;
  tischDinge.push({ id: "staebchen", de: "die Essstäbchen", syl: "ESS-stäb-chen", it: "le bacchette", itSyl: "bac-CHET-te", en: "chopsticks", x: TI.x + 4, y: r(T_V - 1.6), steht: true, kunst: k + flaeche(-9.4, -2.4, 18.8, 4.6),
    tipp: "Mit den Stäbchen zeigt man nicht auf Menschen und steckt sie nie senkrecht in den Reis." });
}
{
  /* DIE TEEKANNE (Tetsubin, Gusseisen) und eine Teeschale */
  let k = `<ellipse cx="0" cy="0" rx="5" ry="1" fill="#000" opacity=".2"/>`;
  k += `<path d="M-4.6 -1 Q-5.6 -5.4 -2.4 -7 L2.4 -7 Q5.6 -5.4 4.6 -1 Q0 .4 -4.6 -1 Z" fill="${S.rg("eisen", [[0, "#5a5a5e"], [0.6, "#2e2e32"], [1, "#1a1a1c"]], 0.4, 0.35, 0.8)}"/>`;
  for (let y = -6; y < -1.4; y += 1.1) for (let x = -3.6; x < 4; x += 1.1) k += `<circle cx="${r(x + ((y * 10) % 2 ? 0.5 : 0))}" cy="${r(y)}" r=".25" fill="#46464c"/>`;
  k += `<path d="M4.4 -4 Q7.6 -4.6 8.4 -7" stroke="#2e2e32" stroke-width="1.2" fill="none" stroke-linecap="round"/>`;
  k += `<rect x="-2.6" y="-7.8" width="5.2" height="1" rx=".4" fill="#3a3a3e"/><circle cx="0" cy="-8.4" r=".7" fill="#3a3a3e"/>`;
  k += `<path d="M-4.4 -6.6 Q0 -13 4.4 -6.6" stroke="#5e4228" stroke-width=".9" fill="none"/>`;
  k += `<path d="M-3 -5.6 Q-3.6 -4 -3 -2.4" stroke="#fff" stroke-width=".5" opacity=".25" fill="none"/>`;
  /* Teeschale (Yunomi) mit grünem Tee */
  k += `<path d="M8.4 -3.6 L12.6 -3.6 L12.2 0 L8.8 0 Z" fill="${S.lg("yunomi", [[0, "#d9d2c0"], [1, "#a8a08a"]], 0, 0, 1, 0)}"/><ellipse cx="10.5" cy="-3.6" rx="2.1" ry=".5" fill="#9ab84a"/>`;
  tischDinge.push({ id: "teekanne", de: "die Teekanne", syl: "TEE-kan-ne", it: "la teiera", itSyl: "te-IE-ra", en: "teapot", x: TI.x + 16, y: r(T_H + 2), steht: true, kunst: k + flaeche(-5.4, -12, 18.6, 12.8),
    tipp: "In Japan trinkt man grünen Tee – ohne Zucker und ohne Milch." });
}
{
  const wv = 0.55 * uAt(TI.d - 0.35), wh = 0.55 * uAt(TI.d + 0.35);
  const yv = T_V - T_B, yh = T_H - T_B;
  let k = schatten(0, 0.3, wv + 2, 2, 0.3);
  for (const s of [-1, 1]) k += `<rect x="${r(s * (wv - 4) - 1.6)}" y="${r(yv + 2)}" width="3.2" height="${r(-yv - 2)}" fill="${DUNKELHOLZ}"/>`;
  k += `<path d="M${r(-wh)} ${r(yh)} L${r(wh)} ${r(yh)} L${r(wv)} ${r(yv)} L${r(-wv)} ${r(yv)} Z" fill="${S.lg("lack", [[0, "#5a2a1a"], [1, "#3a1a10"]])}"/>`;
  k += `<rect x="${r(-wv)}" y="${r(yv)}" width="${r(2 * wv)}" height="2.6" fill="#2a120a"/>`;
  k += `<path d="M${r(-wh + 6)} ${r(yh + 1)} L${r(wh - 20)} ${r(yh + 1)}" stroke="#fff" stroke-width=".6" opacity=".18"/>`;
  /* die Dinge auf dem Tisch malt der Tisch mit; in der Lupe sind sie einzeln anwählbar */
  for (const t of tischDinge) k += `<g transform="translate(${r(t.x - TI.x)} ${r(t.y - T_B)})">${t.kunst.replace(/<rect class="bw-flaeche"[^>]*>/g, "")}</g>`;
  const unter = tischDinge.map((t) => Object.assign({}, t, { kunst: (t.kunst.match(/<rect class="bw-flaeche"[^>]*>/g) || []).join("") }));
  S.teil({ id: "tisch", de: "der Tisch", syl: "TISCH", it: "il tavolino", itSyl: "ta-vo-LI-no", en: "low table", x: TI.x, y: T_B, steht: true, kunst: k,
    zoom: { x: 206, y: 124, w: 96, h: 64 }, unter,
    tipp: "Am niedrigen Tisch isst man im Sitzen auf dem Kissen." });
}
{
  /* DER FÄCHER: offener Faltfächer auf dem Verandaboden neben dem Kissen */
  const Y = yAt(4.1, 0.5);
  let k = `<ellipse cx="0" cy="0" rx="9" ry="1.2" fill="#000" opacity=".15"/>`;
  const n = 11;
  let bl = "M0 0 ";
  for (let i = 0; i <= n; i++) { const a = Math.PI + i * Math.PI / n; bl += `L${r(Math.cos(a) * 10)} ${r(Math.sin(a) * 4.4)} `; }
  k += `<path d="${bl}Z" fill="${S.lg("faecher", [[0, "#f6efe0"], [1, "#e8d9b8"]], 0, 0, 1, 0)}"/>`;
  for (let i = 0; i <= n; i++) { const a = Math.PI + i * Math.PI / n; k += `<line x1="0" y1="0" x2="${r(Math.cos(a) * 10)}" y2="${r(Math.sin(a) * 4.4)}" stroke="#8a6440" stroke-width=".25"/>`; }
  k += `<path d="M-6 -1.6 Q-3 -3.6 0 -2.4 Q3 -3.4 6 -1.8" stroke="#5a8ab8" stroke-width=".7" fill="none"/>`;
  for (let i = 0; i < 6; i++) k += `<circle cx="${r(-6 + i * 2.2)}" cy="${r(-3 + (i % 2) * 0.6)}" r=".55" fill="${BLUETE[i % 5]}"/>`;
  k += `<circle cx="0" cy="0" r=".7" fill="#3a2818"/>`;
  S.teil({ oben: true, id: "faecher", de: "der Fächer", syl: "FÄ-cher", it: "il ventaglio", itSyl: "ven-TA-glio", en: "fan", x: 214, y: r(Y), steht: true, kunst: k + flaeche(-10.4, -5, 20.8, 6.4),
    tipp: "Im heißen japanischen Sommer hat man den Faltfächer immer dabei." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/japan.js"));
console.log(aus);
