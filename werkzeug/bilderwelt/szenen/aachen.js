#!/usr/bin/env node
/* =====================================================================
   AACHEN (FASSUNG 854) — Bilderwelt neu: eine echte Stadtansicht
   ---------------------------------------------------------------------
   XANDER (03.10.): „die bekannten Sehenswürdigkeiten … mit Recherche zu
   den einzelnen Städten in Deutschland … auf Hollywood-Niveau“.

   RECHERCHE (aachen.de „Karls Liebling“, aachen-tourismus.de „Karlsbrunnen“/
   „Rathaus“/„Aachener Dom“, KuLaDig „Katschhof“, Lonely Planet „Rathaus“,
   Aachener Kunstblätter zur Figurengruppe am Rathaus):
   - STANDORT: der Markt, nordöstlicher Teil, etwa 100 m vor der
     Nordfassade des Rathauses, Blick nach Süd-Südwest. Echte Richtungen
     von hier: links (Osten) der Granusturm mit dem kleinen Gasthaus
     „Postwagen“, rechts (Westen) der halbrunde Marktturm; vor dem
     Rathaus rechts der Karlsbrunnen; rechts die Bürgerhäuser an der
     Westseite des Marktes. Der Dom steht 100 m weiter südlich hinter dem
     Rathaus; von hier sieht man links am Granusturm vorbei über die
     niedrigen Häuser seine Chorhalle und das Oktogon. Wie in der Anleitung
     erlaubt (nach Himmelsrichtung geordnet), ist der Dom etwas überhöht,
     damit man ihn erkennt; sein Westturm steht genau hinter dem Granusturm.
   - RATHAUS: um 1330–1350 gotisch auf den Grundmauern der Königshalle
     (Aula regia) Karls des Großen. Links der karolingische GRANUSTURM
     (quadratisch, unten altes Bruchsteinmauerwerk), rechts der halbrunde
     MARKTTURM; ihre barocken Turmhelme entwarf Leo Hugot 1977–79 neu.
     Marktfassade: über dem Erdgeschoss die hohen Fenster des
     Krönungssaals, dazwischen auf Konsolen unter Baldachinen 50 Figuren
     deutscher Herrscher (31 davon in Aachen gekrönt, Figuren von 1901),
     oben Maßwerkbrüstung und Fialen; in der Mitte die barocke zweiläufige
     FREITREPPE: zwei Läufe parallel zur Fassade führen zum Podest vor dem
     Portal. Steiles Schieferdach mit Gauben und Dachreiter.
   - KARLSBRUNNEN (1620, ältester noch sprudelnder Brunnen der Stadt):
     Becken aus Blaustein (Rokoko, J. J. Couven), darin die sechs Tonnen
     schwere Bronzeschale — „Karl in de Eäzekomp“ (Erbsenschüssel) —,
     darüber Karl der Große mit Vollbart, Bügelkrone, Zepter in der Rechten
     und Reichsapfel in der Linken (seit 2014 eine Kopie).
   - DOM: Pfalzkapelle Karls des Großen (um 800); das karolingische
     OKTOGON mit sechzehneckigem Umgang und dem barocken FALTDACH (1656):
     acht Giebel über den Achteckseiten, dazwischen gefaltet, oben die
     Laterne; östlich die gotische CHORHALLE (geweiht 1414), über 25 m hohe
     Fenster — die Aachener nennen sie „Glashaus“. Erstes deutsches
     UNESCO-Welterbe (1978).
   - TYPISCH: Aachener Printen (flache, harte Lebkuchen-Schnitten mit
     Kandis, auch mit Schokolade); Öcher Platt („Oche“ = Aachen, „Öcher“ =
     Aachener, „Alaaf!“ ruft man im Karneval); Bürgerhäuser aus Backstein
     mit Fensterrahmen aus grauem Blaustein; Tauben; viele Studenten.
     Elisenbrunnen (Thermalwasser, riecht nach Schwefel) und Puppenbrunnen
     (Krämerstraße, beginnt am Postwagen) liegen hinter den Häusern — der
     Wegweiser zeigt hin, ebenso zum Dreiländereck (Deutschland,
     Niederlande, Belgien).
   UNSICHER (ohne Foto-Beleg, aus Fachwissen): genaue Form der beiden
   Turmhelme (Knauf und Wetterfahne statt Kreuz), die genaue Verteilung der
   Herrscherfiguren, Gestalt des Postwagens, Zahl der Stufen der Freitreppe.
   Maßstab: Augenhöhe y = 136 (1,7 m) über ebenem Pflaster. Am Boden gilt:
   Einheiten je Meter = (y − 136) / 1,7; Rathaus (≈100 m) ≈ 2,6 Einheiten je
   Meter, Fuß bei y ≈ 140,5. Licht: Sommerabend, die Sonne steht tief im
   Westnordwesten (rechts) und färbt die Nordfassade golden; lange Schatten
   fallen nach links.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "aachen", titel: "Aachen", emoji: "⛪", thema: "Deutschland", kuerzel: "aac", fassung: 854 });
const rnd = zufall(814);
const r = B.r;
const HOR = 136, AUGE = 1.7, F = 264;
const km = (y) => (y - HOR) / AUGE;
const bodenY = (d) => HOR + AUGE * F / d;

S.def(`<filter color-interpolation-filters="sRGB" id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter color-interpolation-filters="sRGB" id="${S.id("wolke")}" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="1.3"/></filter>`);
S.def(`<filter color-interpolation-filters="sRGB" id="${S.id("schw")}" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation=".7"/></filter>`);
const STEIN = S.lg("stein", [[0, "#9a8f7a"], [0.55, "#b4a88f"], [1, "#c9bda2"]], 0, 0, 1, 0);
const BLAUSTEIN = S.lg("blaustein", [[0, "#5f656b"], [0.5, "#7f878d"], [1, "#9ba3a8"]], 0, 0, 1, 0);
const SCHIEFER = S.lg("schiefer", [[0, "#2e353c"], [0.6, "#4a545e"], [1, "#6e7a85"]], 0, 0, 1, 0);
const DACH = S.lg("dach", [[0, "#3a434c"], [1, "#58636e"]]);
const GOLD = S.lg("gold", [[0, "#fff1a8"], [0.4, "#f1c74a"], [1, "#a8781a"]], 0, 0, 1, 1);
const BRONZE = S.lg("bronze", [[0, "#2f4a3d"], [0.45, "#5f8270"], [0.75, "#8fb09c"], [1, "#4b6a5a"]], 0, 0, 1, 0);
const DOMSTEIN = S.lg("domstein", [[0, "#9c9381"], [0.5, "#c9bfa9"], [1, "#ddd2b9"]], 0, 0, 1, 0);
const GOLDLICHT = "#ffc977";                     /* Abendsonne, als Lasur über den Fassaden */
const LANG = S.lg("lang", [[0, "#2b2420", 0.2], [0.55, "#2b2420", 0.75], [1, "#2b2420", 1]], 0, 0, 1, 0);
/* Lange Abendschatten: Die Sonne steht tief im WNW (rechts, leicht hinter uns). Jeder Schatten fällt nach links und etwas
   vom Betrachter weg: dx ≈ −0,95·L, dy ≈ −0,12·L (hinten flacher), Länge ≈ 4,5 × Höhe. Die Schatten liegen auf dem Pflaster
   (Teil „Marktplatz“), damit sie keine Trefferfläche vergrößern. X, Y absolut; „bis“ = wo der Schatten spätestens endet. */
const SCHATTEN = [];
const schlag = (X, Y, w, h, a = 0.5, bis = -4, spitz = 0.55) => {
  const L = Math.max(0, Math.min(4.5 * h, (X - w * spitz / 2 - bis) / 0.95)), dx = -0.95 * L, dy = -0.12 * L * Math.min(1, (Y - HOR) / 50);
  SCHATTEN.push(`<path d="M${r(X + w / 2)} ${r(Y)} L${r(X - w / 2)} ${r(Y)} L${r(X - w * spitz / 2 + dx)} ${r(Y + dy)} L${r(X + w * spitz / 2 + dx)} ${r(Y + dy - w * 0.04)} Z" fill="${LANG}" opacity="${a}"/>`);
  return "";
};
/* Streiflicht von rechts: warme Lichtkante rechts, links ein weicher Eigenschatten */
S.def(`<filter color-interpolation-filters="sRGB" id="${S.id("licht")}" x="-10%" y="-5%" width="120%" height="110%"><feOffset in="SourceAlpha" dx="-.22" result="o"/><feComposite in="SourceAlpha" in2="o" operator="out" result="rk"/><feFlood flood-color="#ffd9a0" flood-opacity=".9"/><feComposite in2="rk" operator="in" result="kante"/><feOffset in="SourceAlpha" dx=".7" result="o2"/><feComposite in="SourceAlpha" in2="o2" operator="out" result="lk"/><feGaussianBlur in="lk" stdDeviation=".25" result="lk2"/><feFlood flood-color="#1f1a24" flood-opacity=".3"/><feComposite in2="lk2" operator="in" result="eigen"/><feComposite in="eigen" in2="SourceAlpha" operator="in" result="eigen2"/><feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="eigen2"/><feMergeNode in="kante"/></feMerge></filter>`);
const licht = (svg) => `<g filter="url(#${S.id("licht")})">${svg}</g>`;
/* Mensch aus dem Baukasten, ohne runden Bodenschatten, feine Linien weg, Pfade gerundet (Ladezeit) */
function figur(spec, hoehe, fein = 1) {
  const m = B.mensch(spec, hoehe);
  const kopfY = -0.83 * (m.z.hoehe || 170);
  let z = m.z.svg.replace(/(<g class="mensch">(?:<defs>.*?<\/defs>)?)<ellipse[^>]*\/>/s, "$1");
  z = z.replace(/<path [^>]*\/>/g, (t) => (/fill="none"/.test(t) && +((t.match(/stroke-width="([\d.]+)"/) || [])[1] || 9) < 0.4) ? "" : t);
  z = z.replace(/ d="([^"]*)"/g, (a, v) => {
    const zs = (v.match(/-?\d+\.?\d*/g) || []).map(Number), ys = zs.filter((_, i) => i % 2);
    const q = Math.min(...ys) < kopfY ? fein : 1;
    return ` d="${v.replace(/-?\d+\.\d+/g, (x) => String(Math.round(+x / q) * q))}"`;
  }).replace(/ (x1|y1|x2|y2)="(-?\d+\.\d+)"/g, (a, n, v) => ` ${n}="${Math.round(+v)}"`);
  return { svg: `<g transform="scale(${m.k.toFixed(4)})">${z}</g>`, k: m.k, z: m.z };
}
/* kleine Figur in der Ferne (unter ≈ 12 Einheiten) */
function passant(x, y, h, o = {}) {
  const { hemd = "#3d5a80", hose = "#2f3640", haar = "#4a3426", haut = "#e3b796", schritt = 0.1, rueck = false, sitzt = false } = o;
  const X = (f) => r(x + f * h), Y = (f) => r(y - f * h);
  let g = "";
  if (sitzt) g += `<path d="M${X(-0.05)} ${Y(0.5)} L${X(0.16)} ${Y(0.5)} L${X(0.17)} ${Y(0.02)} L${X(0.12)} ${Y(0.02)} L${X(0.11)} ${Y(0.42)} L${X(-0.05)} ${Y(0.42)} Z" fill="${hose}"/>`;
  else g += `<path d="M${X(-0.05)} ${Y(0.5)} L${X(-0.06 - schritt)} ${Y(0.02)} L${X(-0.01 - schritt)} ${Y(0.02)} L${X(0)} ${Y(0.4)} L${X(0.01 + schritt)} ${Y(0.02)} L${X(0.06 + schritt)} ${Y(0.02)} L${X(0.05)} ${Y(0.5)} Z" fill="${hose}"/>`;
  g += `<path d="M${X(-0.11)} ${Y(0.82)} Q${X(-0.12)} ${Y(0.6)} ${X(-0.09)} ${Y(0.48)} L${X(0.09)} ${Y(0.48)} Q${X(0.12)} ${Y(0.6)} ${X(0.11)} ${Y(0.82)} Q${X(0)} ${Y(0.85)} ${X(-0.11)} ${Y(0.82)} Z" fill="${hemd}"/>`;
  g += `<path d="M${X(0.03)} ${Y(0.82)} Q${X(0.12)} ${Y(0.6)} ${X(0.09)} ${Y(0.48)} L${X(0.05)} ${Y(0.48)} Q${X(0.08)} ${Y(0.64)} ${X(0.03)} ${Y(0.82)} Z" fill="#ffd9a0" opacity=".3"/>`;
  g += `<path d="M${X(-0.11)} ${Y(0.8)} L${X(-0.14)} ${Y(0.53)} M${X(0.11)} ${Y(0.8)} L${X(0.14)} ${Y(0.53)}" stroke="${hemd}" stroke-width="${r(0.055 * h)}" stroke-linecap="round"/>`;
  g += `<rect x="${X(-0.025)}" y="${Y(0.88)}" width="${r(0.05 * h)}" height="${r(0.06 * h)}" fill="${haut}"/><ellipse cx="${X(0)}" cy="${Y(0.93)}" rx="${r(0.06 * h)}" ry="${r(0.07 * h)}" fill="${haut}"/>`;
  g += rueck ? `<ellipse cx="${X(0)}" cy="${Y(0.94)}" rx="${r(0.064 * h)}" ry="${r(0.072 * h)}" fill="${haar}"/>` : `<path d="M${X(-0.064)} ${Y(0.93)} Q${X(-0.06)} ${Y(1.01)} ${X(0)} ${Y(1.005)} Q${X(0.06)} ${Y(1.01)} ${X(0.064)} ${Y(0.93)} Q${X(0.03)} ${Y(0.975)} ${X(-0.064)} ${Y(0.93)} Z" fill="${haar}"/>`;
  return g;
}
function wolke(x, y, s, seed) {
  const z = zufall(seed);
  let w = `<g filter="url(#${S.id("wolke")})" opacity=".95">`;
  const n = 5 + Math.floor(z() * 5), puffs = [];
  for (let i = 0; i < n; i++) { const t = i / (n - 1) - 0.5; puffs.push([t * 34 * s * (0.8 + z() * 0.4), -(1 - Math.abs(t) * 1.6) * 7 * s * (0.6 + z() * 0.8), (5 + z() * 6) * s * (1 - Math.abs(t) * 0.8)]); }
  w += `<ellipse cx="${x}" cy="${r(y + 2 * s)}" rx="${r(20 * s)}" ry="${r(3 * s)}" fill="#e6d3c0"/>`;
  for (const [dx, dy, rr] of puffs) w += `<circle cx="${r(x + dx)}" cy="${r(y + dy)}" r="${r(rr)}" fill="#f6eee4"/>`;
  for (const [dx, dy, rr] of puffs) w += `<circle cx="${r(x + dx + rr * 0.2)}" cy="${r(y + dy - rr * 0.25)}" r="${r(rr * 0.7)}" fill="#fffaf2"/>`;
  w += `<ellipse cx="${x}" cy="${r(y + 2.4 * s)}" rx="${r(17 * s)}" ry="${r(1.8 * s)}" fill="#d9c2ad" opacity=".8"/></g>`;
  return w;
}

/* =====================================================================
   KULISSE — Abendhimmel
   ===================================================================== */
S.hinten(`<rect width="320" height="${HOR + 4}" fill="${S.lg("himmel", [[0, "#6a98cb"], [0.5, "#a9c4df"], [0.82, "#ecd9bf"], [1, "#f6d6a6"]])}"/>`);
S.hinten(`<rect width="320" height="${HOR + 4}" fill="${S.lg("himmelwarm", [[0, "#ffd08a", 0], [0.6, "#ffd08a", 0], [1, "#ffc06a", 0.35]], 0, 0, 1, 0)}"/>`);
S.hinten(`<circle cx="338" cy="100" r="96" fill="${S.rg("sonne", [[0, "#fff1c8", 0.75], [0.35, "#ffe0a0", 0.3], [1, "#ffe0a0", 0]])}"/>`);
S.hinten(wolke(160, 18, 0.9, 7) + wolke(262, 30, 1.05, 19) + wolke(40, 12, 0.7, 29) + wolke(118, 44, 0.5, 43));

/* =====================================================================
   0 — DER MARKTPLATZ (Kopfsteinpflaster in Fluchtperspektive, eben)
   ===================================================================== */
{
  let f = `<rect x="0" y="${HOR}" width="320" height="${200 - HOR}" fill="${S.lg("pflaster", [[0, "#a49a88"], [0.4, "#958a78"], [1, "#857a69"]])}"/>`;
  /* Steinreihen von hinten bis vorn: Steingröße wächst mit der Nähe, keine Naht */
  let i = 0;
  for (let d = 90; d > 4.2; d /= 1.028, i++) {
    const y0 = bodenY(d), y1 = bodenY(d * 1.028), h = y0 - y1, ym = (y0 + y1) / 2, k1 = km(ym);
    if (y1 > 200) break;
    const st = 0.17 * k1, gap = 0.035 * k1, off = r((i * 37 % 10) / 10 * (st + gap));
    const a = Math.min(1, 0.35 + k1 / 20);
    if (st > 0.9) {
      f += `<line x1="0" y1="${r(ym)}" x2="320" y2="${r(ym)}" stroke="${["#a39886", "#978c7a", "#ab9f8b"][i % 3]}" stroke-width="${r(h * 0.84)}" stroke-dasharray="${r(st)} ${r(gap)}" stroke-dashoffset="${off}" opacity="${r(a)}"/>`;
      f += `<line x1="0" y1="${r(ym - h * 0.22)}" x2="320" y2="${r(ym - h * 0.22)}" stroke="#d2c8b4" stroke-width="${r(h * 0.16)}" stroke-dasharray="${r(st * 0.6)} ${r(st * 0.4 + gap)}" stroke-dashoffset="${r(off - st * 0.2)}" opacity="${r(a * 0.55)}"/>`;
    } else f += `<line x1="0" y1="${r(y0)}" x2="320" y2="${r(y0)}" stroke="#6f6556" stroke-width="${r(Math.max(0.08, h * 0.25))}" opacity=".45"/>`;
  }
  f += `<rect x="0" y="${HOR}" width="320" height="${200 - HOR}" fill="${S.lg("pflasterlicht", [[0, "#000", 0.14], [0.55, "#000", 0], [1, "#ffcf8a", 0.16]], 0, 0, 1, 0)}"/>`;
  var MARKT = S.teil({ id: "marktplatz", de: "der Marktplatz", syl: "MARKT-platz", it: "la piazza del mercato", itSyl: "PIAZ-za del mer-CA-to", en: "market square", x: 0, y: 0, kunst: f,
    tipp: "Auf dem Marktplatz vor dem Rathaus ist im Advent der Weihnachtsmarkt." });
}

/* =====================================================================
   1 — DER AACHENER DOM (links hinter dem Rathaus) — Lupe: Kirchenfenster, Kuppel
   ===================================================================== */
const DOM = { x: 2, y: 140, u: 1.45 };
const DOM_SICHT = 104;                 /* bis hierhin (y) ist der Dom über den Häusern zu sehen */
{
  const u = DOM.u, H = (m) => r(-m * u);
  let k = "";
  /* Chorhalle („Glashaus“): schlanke, sehr hohe Fenster fast bis zur Traufe, Strebepfeiler mit Fialen */
  const CX0 = 0, CX1 = 40;
  k += `<path d="M${CX0} 0 L${CX0} ${H(34)} L${CX1} ${H(34)} L${CX1} 0 Z" fill="${DOMSTEIN}"/>`;
  k += `<path d="M${CX0 - 1} ${H(34)} L${CX0 + 4} ${H(49)} L${CX1 - 3} ${H(49)} L${CX1 + 1.5} ${H(34)} Z" fill="${DACH}"/>`;
  for (let i = 1; i < 6; i++) k += `<line x1="${r(CX0 + i * 0.8)}" y1="${H(34 + i * 2.5)}" x2="${r(CX1 - i * 0.6)}" y2="${H(34 + i * 2.5)}" stroke="#2a3138" stroke-width=".15" opacity=".6"/>`;
  k += `<path d="M${CX0 + 4} ${H(49)} L${CX1 - 3} ${H(49)}" stroke="#c8a24a" stroke-width=".35"/>`;
  /* Dachreiter der Chorhalle */
  k += `<path d="M${r(CX1 - 9)} ${H(49)} L${r(CX1 - 9)} ${H(52)} L${r(CX1 - 8.4)} ${H(57)} L${r(CX1 - 7.8)} ${H(52)} L${r(CX1 - 7.8)} ${H(49)} Z" fill="#3e4750"/>`;
  const joch = [[2, 8.6], [11.4, 18], [20.8, 27.4], [30.2, 36.8]];
  for (const [a, b] of joch) {
    const m = (a + b) / 2, w = b - a;
    k += `<path d="M${a} ${H(3)} L${a} ${H(28.5)} Q${a} ${H(32)} ${r(m)} ${H(33)} Q${b} ${H(32)} ${b} ${H(28.5)} L${b} ${H(3)} Z" fill="${S.lg("glas", [[0, "#6f8fa6"], [0.4, "#3c5568"], [0.7, "#8aa3b4"], [1, "#2f4252"]], 0, 0, 1, 0)}"/>`;
    for (let i = 1; i < 3; i++) k += `<line x1="${r(a + i * w / 3)}" y1="${H(3)}" x2="${r(a + i * w / 3)}" y2="${H(29.5)}" stroke="#d6ccb6" stroke-width=".3"/>`;
    for (let h = 7; h < 29; h += 4.3) k += `<line x1="${a}" y1="${H(h)}" x2="${b}" y2="${H(h)}" stroke="#d6ccb6" stroke-width=".22"/>`;
    k += `<circle cx="${r(m)}" cy="${H(30.6)}" r="${r(w * 0.18)}" fill="none" stroke="#d6ccb6" stroke-width=".3"/>`;
    k += `<path d="M${r(a + 0.6)} ${H(12)} L${r(a + w * 0.45)} ${H(24)} L${r(a + w * 0.7)} ${H(24)} L${r(a + 2)} ${H(12)} Z" fill="#ffe2b0" opacity=".12"/>`;
    k += `<path d="M${r(a - 0.3)} ${H(33.6)} L${r(m)} ${H(39.4)} L${r(b + 0.3)} ${H(33.6)}" stroke="#c2b8a3" stroke-width=".6" fill="none"/><path d="M${r(m - 0.4)} ${H(39.4)} L${r(m)} ${H(40.8)} L${r(m + 0.4)} ${H(39.4)} Z" fill="#c2b8a3"/>`;
  }
  for (const x of [0, 9.4, 18.8, 28.2, 37.6]) {
    k += `<path d="M${x - 0.6} 0 L${x - 0.6} ${H(34)} L${x + 2} ${H(34)} L${x + 2} 0 Z" fill="${S.lg("strebe", [[0, "#8f8674"], [1, "#e0d6bf"]], 0, 0, 1, 0)}"/>`;
    k += `<path d="M${x - 0.4} ${H(34)} L${x + 0.7} ${H(42.5)} L${x + 1.8} ${H(34)} Z" fill="#cfc5b0"/><circle cx="${x + 0.7}" cy="${H(42.9)}" r=".35" fill="#cfc5b0"/>`;
    for (let i = 1; i < 4; i++) k += `<circle cx="${r(x + 0.7 + (i % 2 ? -0.6 : 0.6) * (1 - i / 4))}" cy="${H(34 + i * 2.1)}" r=".24" fill="#cfc5b0"/>`;
  }
  /* Oktogon: sechzehneckiger Umgang, Tambour, das barocke FALTDACH mit acht Giebeln, Laterne */
  const OX = 54, OW = 13;
  k += `<path d="M${OX - OW - 4} 0 L${OX - OW - 4} ${H(19)} L${OX + OW + 4} ${H(19)} L${OX + OW + 4} 0 Z" fill="${DOMSTEIN}"/>`;
  for (let i = 0; i < 5; i++) { const x0 = OX - OW - 4 + i * (2 * OW + 8) / 5, x1 = x0 + (2 * OW + 8) / 5; k += `<path d="M${r(x0)} ${H(19)} L${r((x0 + x1) / 2)} ${H(22.5)} L${r(x1)} ${H(19)} Z" fill="${DOMSTEIN}" stroke="#a99f8b" stroke-width=".25"/><path d="M${r(x0 + 0.4)} ${H(19)} L${r((x0 + x1) / 2)} ${H(21.8)} L${r(x1 - 0.4)} ${H(19)} Z" fill="${SCHIEFER}" opacity=".6"/>`; }
  const T = [OX - OW, OX - OW * 0.42, OX + OW * 0.42, OX + OW];
  k += `<path d="M${T[0]} ${H(19)} L${T[0]} ${H(33)} L${r(T[1])} ${H(33.6)} L${r(T[2])} ${H(33.6)} L${T[3]} ${H(33)} L${T[3]} ${H(19)} Z" fill="${S.lg("tambour", [[0, "#9e9582"], [0.35, "#c9bfa9"], [0.65, "#ddd3bd"], [1, "#e9dec6"]], 0, 0, 1, 0)}"/>`;
  k += `<line x1="${r(T[1])}" y1="${H(19)}" x2="${r(T[1])}" y2="${H(33.6)}" stroke="#8f8674" stroke-width=".4"/><line x1="${r(T[2])}" y1="${H(19)}" x2="${r(T[2])}" y2="${H(33.6)}" stroke="#8f8674" stroke-width=".4"/>`;
  for (const x of [OX - OW * 0.71, OX, OX + OW * 0.71]) k += `<path d="M${r(x - 1.5)} ${H(23)} L${r(x - 1.5)} ${H(28.6)} A1.5 1.5 0 0 1 ${r(x + 1.5)} ${H(28.6)} L${r(x + 1.5)} ${H(23)} Z" fill="#33414c"/>`;
  /* acht Giebel: drei ganz zu sehen, zwei halb (an den Rändern); dazwischen das gefaltete Schieferdach */
  const GI = 7.6;
  k += `<path d="M${T[0] + 0.4} ${H(33.4)} Q${r(OX - OW * 0.55)} ${H(44)} ${OX} ${H(46)} Q${r(OX + OW * 0.55)} ${H(44)} ${T[3] - 0.4} ${H(33.4)} Z" fill="${S.lg("faltdach", [[0, "#2f3840"], [0.5, "#4e5965"], [1, "#7c8894"]], 0, 0, 1, 0)}"/>`;
  for (let i = 0; i < 3; i++) {
    const a = T[i], b = T[i + 1], m = (a + b) / 2;
    k += `<path d="M${r(a)} ${H(33.6)} L${r(m)} ${H(33.6 + GI)} L${r(b)} ${H(33.6)} Z" fill="${i === 2 ? "#e6dbc3" : i === 1 ? "#d3c8b1" : "#b9ae98"}" stroke="#a39985" stroke-width=".3"/>`;
    k += `<circle cx="${r(m)}" cy="${H(36.4)}" r="1.1" fill="#3b4752"/>`;
    k += `<path d="M${r(m)} ${H(33.6 + GI)} Q${r(m + (OX - m) * 0.5)} ${H(43.5)} ${OX} ${H(46)}" stroke="#262d33" stroke-width=".45" fill="none"/>`;
  }
  for (const s of [-1, 1]) k += `<path d="M${r(OX + s * OW)} ${H(33.4)} L${r(OX + s * (OW + 0.6))} ${H(37)} L${r(OX + s * OW * 0.82)} ${H(34)} Z" fill="#a39985"/>`;
  /* Laterne mit Kugel und Kreuz */
  k += `<rect x="${OX - 1.5}" y="${H(50.6)}" width="3" height="${r(4.6 * u)}" fill="#46505a"/><rect x="${OX - 0.75}" y="${H(49.8)}" width="1.5" height="${r(2.6 * u)}" fill="#e9d7a6" opacity=".7"/>`;
  k += `<path d="M${OX - 1.9} ${H(50.6)} Q${OX} ${H(54)} ${OX + 1.9} ${H(50.6)} Z" fill="#46505a"/><circle cx="${OX}" cy="${H(54.5)}" r=".65" fill="${GOLD}"/><path d="M${OX} ${H(55)} L${OX} ${H(58)} M${OX - 0.9} ${H(56.9)} L${OX + 0.9} ${H(56.9)}" stroke="#d9b24a" stroke-width=".38"/>`;
  /* Abendsonne: Wände golden lasiert, rechte Kanten hell */
  k += `<rect x="0" y="${H(34)}" width="${CX1 + 2}" height="${r(34 * u)}" fill="${GOLDLICHT}" opacity=".16"/><rect x="${OX - OW}" y="${H(33.6)}" width="${2 * OW}" height="${r(33.6 * u)}" fill="${GOLDLICHT}" opacity=".16"/>`;
  const sicht = DOM_SICHT - DOM.y;
  S.teil({ id: "dom", de: "der Aachener Dom", syl: "AA-che-ner DOM", it: "il Duomo di Aquisgrana", itSyl: "DUO-mo di a-qui-SGRA-na", en: "Aachen Cathedral",
    x: DOM.x, y: DOM.y, kunst: k, tipp: "Karl der Große hat den Dom um das Jahr 800 bauen lassen. Der Dom war das erste Welterbe in Deutschland.",
    zoom: { x: 17, y: 48, w: 81, h: 54 },
    unter: [
      { id: "kirchenfenster", de: "das Kirchenfenster", syl: "KIR-chen-fens-ter", it: "la vetrata", itSyl: "ve-TRA-ta", en: "church window", x: DOM.x + 19.8, y: DOM_SICHT, kunst: flaeche(-18.05, -13, 36.2, 13, 0.5),
        tipp: "Die Fenster der Chorhalle sind über 25 Meter hoch. Darum nennen die Aachener die Chorhalle „Glashaus“." },
      { id: "kuppel", de: "die Kuppel", syl: "KUP-pel", it: "la cupola", itSyl: "CU-po-la", en: "dome", x: DOM.x + OX, y: DOM.y - 33.6 * DOM.u, kunst: flaeche(-OW, -(25 * DOM.u), Math.min(2 * OW, 71.5 - DOM.x - OX + OW), 25 * DOM.u, 1),
        tipp: "Unter der Kuppel liegt das Oktogon, ein Raum mit acht Ecken. Es ist über 1200 Jahre alt." },
    ] });
}

/* =====================================================================
   2 — DAS GASTHAUS „Postwagen“ und ein Bürgerhaus (links, am Granusturm)
   ===================================================================== */
{
  let k = "";
  /* der Postwagen: kleines Barockhaus mit hölzernen Fensterbändern, ans Rathaus gebaut */
  k += `<path d="M44 140.4 L44 110 L72.6 108 L72.6 140.4 Z" fill="${S.lg("postwagen", [[0, "#6d4c32"], [0.6, "#8f6a48"], [1, "#a57d56"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M42.6 110.2 L49 101 L68 100 L74 108 Z" fill="${DACH}"/><path d="M42.6 110.2 L74 108" stroke="#2a3138" stroke-width=".5"/>`;
  for (const y of [112.6, 121.6]) { k += `<rect x="46" y="${y}" width="24.6" height="6.4" fill="#3d2a1c"/>`; for (let x = 46.6; x < 70.2; x += 2.45) k += `<rect x="${x}" y="${y + 0.6}" width="1.95" height="5.2" fill="${S.lg("butzen", [[0, "#d9c79a"], [1, "#7f8b8a"]])}"/><line x1="${r(x + 0.97)}" y1="${y + 0.6}" x2="${r(x + 0.97)}" y2="${y + 5.8}" stroke="#3d2a1c" stroke-width=".15"/>`; }
  k += `<rect x="45" y="119.6" width="26.6" height="1.2" fill="#c9b07a"/><text x="58.3" y="120.6" font-size="1.2" text-anchor="middle" fill="#3d2a1c" font-family="Georgia,serif" font-weight="bold">ZUM POSTWAGEN</text>`;
  k += `<rect x="51" y="130.4" width="5.2" height="10" fill="#3d2a1c"/><rect x="51.6" y="131" width="4" height="9.4" fill="${S.lg("ptuer", [[0, "#ffd88a"], [1, "#a8743a"]])}"/><rect x="59" y="130.8" width="10" height="6.4" fill="#3d2a1c"/><rect x="59.6" y="131.4" width="8.8" height="5.2" fill="#c9b07a" opacity=".7"/>`;
  k += `<path d="M44 140.4 L44 110 L72.6 108 L72.6 140.4 Z" fill="${GOLDLICHT}" opacity=".14"/>`;
  S.teil({ id: "gasthaus", de: "das Gasthaus", syl: "GAST-haus", it: "la locanda", itSyl: "lo-CAN-da", en: "inn", x: 0, y: 0, kunst: k,
    tipp: "Der „Postwagen“ am Rathaus ist eines der ältesten Gasthäuser in Aachen." });
}

/* =====================================================================
   3 — DAS RATHAUS (Nordfassade am Markt) — Lupe: der König, die Freitreppe
   ===================================================================== */
/* Fassadenkoordinate m (Meter von Ost nach West) → Bildpunkt; die Fassade weicht nach rechts leicht zurück */
const RH = { x0: 74 };
const fs = (m) => 2.64 * (1 - 0.0027 * m);
const fx = (m) => r(RH.x0 + m * 2.62 * (1 - 0.00135 * m));
const fy = (m, h) => r(HOR + (AUGE - h) * fs(m));
const FP = (m, h) => `${fx(m)} ${fy(m, h)}`;
const quad = (m0, m1, h0, h1, f, extra = "") => `<path d="M${FP(m0, h0)} L${FP(m1, h0)} L${FP(m1, h1)} L${FP(m0, h1)} Z" fill="${f}"${extra}/>`;
/* gotischer Baldachin über einer Figur: Spitzhaube mit Krabben, darunter ein Schattenkeil */
const baldachin = (m, h, z) => {
  const x = fx(m), y = fy(m, h), s = fs(m) * z;
  let g = `<path d="M${r(x - 0.62 * s)} ${r(y)} L${r(x - 0.62 * s)} ${r(y - 0.5 * s)} L${r(x)} ${r(y - 1.9 * s)} L${r(x + 0.62 * s)} ${r(y - 0.5 * s)} L${r(x + 0.62 * s)} ${r(y)} Z" fill="${S.lg("baldachin", [[0, "#a29780"], [0.55, "#cfc3a8"], [1, "#e2d7bd"]], 0, 0, 1, 0)}"/>`;
  g += `<path d="M${r(x - 0.62 * s)} ${r(y)} Q${r(x)} ${r(y + 0.45 * s)} ${r(x + 0.62 * s)} ${r(y)}" fill="#5d5444" opacity=".55"/>`;
  for (const t of [0.3, 0.55, 0.8]) g += `<circle cx="${r(x - 0.62 * s * (1 - t))}" cy="${r(y - 0.5 * s - 1.4 * s * t)}" r="${r(0.09 * s)}" fill="#b8ad94"/><circle cx="${r(x + 0.62 * s * (1 - t))}" cy="${r(y - 0.5 * s - 1.4 * s * t)}" r="${r(0.09 * s)}" fill="#e6dcc2"/>`;
  g += `<circle cx="${x}" cy="${r(y - 1.95 * s)}" r="${r(0.11 * s)}" fill="#d9cfb5"/>`;
  return g;
};
/* Herrscherfigur aus Sandstein: Konsole, Gewand mit Falten, Mantel, Kopf mit Krone, Zepter */
const figur1 = (m, h, z, var1) => {
  const x = fx(m), y = fy(m, h), s = fs(m) * z;
  const X = (f) => r(x + f * s), Y = (f) => r(y - f * s);
  let g = `<path d="M${X(-0.42)} ${Y(-0.05)} L${X(0.42)} ${Y(-0.05)} L${X(0.22)} ${Y(-0.38)} L${X(-0.22)} ${Y(-0.38)} Z" fill="#9a8f78"/>`;
  g += `<path d="M${X(-0.4)} ${Y(0.02)} L${X(-0.34)} ${Y(1.05)} Q${X(-0.4)} ${Y(1.45)} ${X(-0.24)} ${Y(1.62)} L${X(0.24)} ${Y(1.62)} Q${X(0.4)} ${Y(1.45)} ${X(0.34)} ${Y(1.05)} L${X(0.4)} ${Y(0.02)} Z" fill="${S.lg("fig", [[0, "#8c826d"], [0.5, "#b0a58c"], [1, "#cdbf9f"]], 0, 0, 1, 0)}"/>`;
  g += `<path d="M${X(-0.36)} ${Y(1.5)} Q${X(-0.5)} ${Y(0.8)} ${X(-0.3)} ${Y(0.04)} L${X(-0.12)} ${Y(0.04)} Q${X(-0.22)} ${Y(0.8)} ${X(-0.1)} ${Y(1.5)} Z" fill="#8f856f"/>`;
  for (const f of [-0.06, 0.1, 0.24]) g += `<path d="M${X(f)} ${Y(1.2)} Q${X(f + 0.03)} ${Y(0.6)} ${X(f + 0.05)} ${Y(0.05)}" stroke="#857a64" stroke-width="${r(0.03 * s)}" fill="none"/>`;
  g += `<ellipse cx="${x}" cy="${Y(1.82)}" rx="${r(0.15 * s)}" ry="${r(0.19 * s)}" fill="#c4b79b"/>`;
  g += `<path d="M${X(-0.13)} ${Y(1.78)} Q${x} ${Y(1.58)} ${X(0.13)} ${Y(1.78)} Q${x} ${Y(1.68)} ${X(-0.13)} ${Y(1.78)} Z" fill="#9d9179"/>`;
  g += `<path d="M${X(-0.15)} ${Y(1.98)} L${X(-0.15)} ${Y(2.14)} L${X(-0.07)} ${Y(2.06)} L${x} ${Y(2.16)} L${X(0.07)} ${Y(2.06)} L${X(0.15)} ${Y(2.14)} L${X(0.15)} ${Y(1.98)} Z" fill="#c9ad66"/>`;
  if (var1 % 2) g += `<line x1="${X(0.3)}" y1="${Y(0.5)}" x2="${X(0.36)}" y2="${Y(1.9)}" stroke="#a3987f" stroke-width="${r(0.05 * s)}"/>`;
  else g += `<circle cx="${X(-0.26)}" cy="${Y(1.05)}" r="${r(0.09 * s)}" fill="#c4b79b"/>`;
  return g;
};
const FENSTER = []; for (let i = 0; i < 9; i++) FENSTER.push(12 + i * 5.45);
const PFEILER = []; for (let i = 0; i <= 9; i++) PFEILER.push(11 + i * 5.45 - 0.3);
const FIGUR_H = [8.9, 14.2];
const TREPPE = { m0: 22.6, m1: 47.4, pa: 31.6, pb: 38.4, h: 6.6 };
{
  let k = "";
  /* --- Dach des Saalbaus: steiles Schieferdach, zwei Reihen kleiner Gauben, Dachreiter --- */
  k += `<path d="M${FP(9, 22.6)} L${FP(14, 34)} L${FP(56, 34)} L${FP(61, 22.6)} Z" fill="${DACH}"/>`;
  for (let i = 1; i < 6; i++) { const h = 22.6 + i * 2; k += `<path d="M${FP(9 + i * 0.85, h)} L${FP(61 - i * 0.85, h)}" stroke="#2a3138" stroke-width=".15" opacity=".55"/>`; }
  for (const [h, n] of [[25, 9], [30, 6]]) for (let i = 0; i < n; i++) {
    const m = 15 + (i + 0.5) * (40 / n), w = 0.9;
    k += `<path d="M${FP(m - w, h)} L${FP(m - w, h + 1.5)} L${FP(m, h + 2.5)} L${FP(m + w, h + 1.5)} L${FP(m + w, h)} Z" fill="#4a545e"/><path d="M${FP(m - w * 0.55, h + 0.15)} L${FP(m - w * 0.55, h + 1.3)} L${FP(m + w * 0.55, h + 1.3)} L${FP(m + w * 0.55, h + 0.15)} Z" fill="${S.lg("gaube", [[0, "#93a9b8"], [1, "#3e4c58"]])}"/>`;
  }
  k += `<path d="M${FP(34.4, 33.6)} L${FP(34.4, 37)} L${FP(35.6, 37)} L${FP(35.6, 33.6)} Z" fill="#46505a"/><path d="M${FP(34, 37)} L${FP(35, 41.5)} L${FP(36, 37)} Z" fill="#46505a"/><circle cx="${fx(35)}" cy="${fy(35, 42)}" r=".5" fill="${GOLD}"/>`;
  /* --- Wand aus Sandstein; Sockel aus Blaustein, Gurtgesims --- */
  k += quad(9, 61, 0, 21.2, STEIN);
  k += quad(9, 61, 0, 0.9, BLAUSTEIN) + quad(9, 61, 0.9, 1.15, "#d9cfb9");
  k += quad(9, 61, 6.6, 7.1, "#dcd2bb") + quad(9, 61, 7.1, 7.3, "#7d725e");
  /* Erdgeschoss: spitzbogige Fenster mit Laibung und Sohlbank */
  for (let m = 11.4; m < 59; m += 3.4) {
    if (m > TREPPE.m0 - 1 && m < TREPPE.m1) continue;
    k += `<path d="M${FP(m - 0.2, 1.6)} L${FP(m + 1.8, 1.6)} L${FP(m + 1.8, 4.6)} Q${FP(m + 1.8, 5.6)} ${FP(m + 0.8, 5.9)} Q${FP(m - 0.2, 5.6)} ${FP(m - 0.2, 4.6)} Z" fill="#d2c6ab"/>`;
    k += `<path d="M${FP(m, 1.8)} L${FP(m + 1.6, 1.8)} L${FP(m + 1.6, 4.6)} Q${FP(m + 1.6, 5.4)} ${FP(m + 0.8, 5.6)} Q${FP(m, 5.4)} ${FP(m, 4.6)} Z" fill="${S.lg("egfenster", [[0, "#3c4a56"], [1, "#6d8293"]])}"/>`;
    k += `<path d="M${FP(m + 0.8, 1.8)} L${FP(m + 0.8, 5.5)}" stroke="#cfc5b0" stroke-width=".25"/><path d="M${FP(m + 1.6, 1.8)} L${FP(m + 1.3, 1.8)} L${FP(m + 1.3, 4.8)} L${FP(m + 1.6, 4.6)} Z" fill="#2b343c"/><path d="M${FP(m - 0.6, 1.4)} L${FP(m - 0.2, 1.4)} L${FP(m - 0.2, 5.6)} L${FP(m - 0.6, 5.2)} Z" fill="#5d5444" opacity=".3"/>`;
    k += quad(m - 0.35, m + 1.95, 1.4, 1.65, "#e2d8c2");
  }
  /* Krönungssaal: neun hohe Maßwerkfenster mit tiefer Laibung */
  for (const m of FENSTER) {
    k += `<path d="M${FP(m - 0.25, 8.4)} L${FP(m + 3.05, 8.4)} L${FP(m + 3.05, 17.2)} Q${FP(m + 3.05, 19.8)} ${FP(m + 1.4, 20.2)} Q${FP(m - 0.25, 19.8)} ${FP(m - 0.25, 17.2)} Z" fill="#d6cab0"/>`;
    k += `<path d="M${FP(m, 8.6)} L${FP(m + 2.8, 8.6)} L${FP(m + 2.8, 17.2)} Q${FP(m + 2.8, 19.4)} ${FP(m + 1.4, 19.8)} Q${FP(m, 19.4)} ${FP(m, 17.2)} Z" fill="${S.lg("rfenster", [[0, "#536879"], [0.55, "#2c3a47"], [1, "#7a8fa0"]], 0, 0, 1, 0)}"/>`;
    k += `<path d="M${FP(m + 2.8, 8.6)} L${FP(m + 2.35, 8.6)} L${FP(m + 2.35, 17.6)} L${FP(m + 2.8, 17.2)} Z" fill="#26313a"/><path d="M${FP(m, 8.6)} L${FP(m + 0.2, 8.6)} L${FP(m + 0.2, 17.6)} L${FP(m, 17.2)} Z" fill="#f2e2bf" opacity=".55"/>`;
    k += `<path d="M${FP(m + 1.4, 8.6)} L${FP(m + 1.4, 19.4)} M${FP(m, 13.2)} L${FP(m + 2.8, 13.2)}" stroke="#d6ccb6" stroke-width=".3"/>`;
    k += `<path d="M${FP(m + 0.5, 17.6)} Q${FP(m + 1.4, 19)} ${FP(m + 2.3, 17.6)}" stroke="#d6ccb6" stroke-width=".22" fill="none"/>`;
    k += `<path d="M${FP(m + 0.2, 17)} L${FP(m + 2.3, 17)} L${FP(m + 2.3, 18.6)} Q${FP(m + 1.4, 19.6)} ${FP(m + 0.2, 18.6)} Z" fill="#ffe3b2" opacity=".14"/>`;
    k += quad(m - 0.4, m + 3.2, 8.15, 8.4, "#e6dcc6");
  }
  /* Pfeiler zwischen den Fenstern: je zwei Herrscherfiguren übereinander, jede in einer flachen Nische */
  PFEILER.forEach((m, i) => {
    k += `<path d="M${FP(m - 1.55, 7.3)} L${FP(m - 0.95, 7.3)} L${FP(m - 0.95, 21.2)} L${FP(m - 1.55, 20.9)} Z" fill="#4a4136" opacity=".28"/>`;
    k += `<path d="M${FP(m - 0.95, 7.3)} L${FP(m + 0.95, 7.3)} L${FP(m + 0.95, 21.2)} L${FP(m - 0.95, 21.2)} Z" fill="${S.lg("pfeiler", [[0, "#9e937d"], [0.6, "#bdb197"], [1, "#d3c7ab"]], 0, 0, 1, 0)}"/>`;
    for (const h of FIGUR_H) {
      k += `<path d="M${FP(m - 0.6, h - 0.3)} L${FP(m + 0.6, h - 0.3)} L${FP(m + 0.6, h + 2.6)} L${FP(m - 0.6, h + 2.6)} Z" fill="#6e6553" opacity=".55"/>`;
      k += `<path d="M${FP(m - 0.55, h + 2.6)} L${FP(m - 0.95, h + 2.2)} L${FP(m - 0.95, h + 4.2)} L${FP(m - 0.3, h + 4.6)} Z" fill="#4a4136" opacity=".3"/>`;
      k += figur1(m, h, 0.95, i + h) + baldachin(m, h + 2.65, 0.95);
      k += `<path d="M${FP(m + 0.48, h + 2.7)} L${FP(m + 0.6, h + 2.7)} L${FP(m + 0.6, h + 3.2)} L${FP(m, h + 4.4)} L${FP(m, h + 4.1)} Z" fill="#ffe2ad" opacity=".55"/>`;
    }
  });
  /* Gesims, Maßwerkbrüstung mit Vierpässen, Fialen über den Pfeilern */
  k += quad(9, 61, 20.6, 21.2, "#e2d8c2") + quad(9, 61, 21.2, 22.7, "#c9bea6");
  {
    let v = "";
    for (let m = 9.8; m < 60.5; m += 1.25) {
      const x = +fx(m + 0.6), y = +fy(m + 0.6, 21.95), a = 0.19 * fs(m);
      for (const [ox, oy] of [[-a, 0], [a, 0], [0, -a], [0, a]]) v += `M${r(x + ox - a)} ${r(y + oy)}a${r(a)} ${r(a)} 0 1 0 ${r(2 * a)} 0a${r(a)} ${r(a)} 0 1 0 ${r(-2 * a)} 0`;
      k += `<path d="M${fx(m + 0.05)} ${fy(m + 0.05, 21.35)} L${fx(m + 1.15)} ${fy(m + 1.15, 21.35)} L${fx(m + 1.15)} ${fy(m + 1.15, 22.55)} L${fx(m + 0.05)} ${fy(m + 0.05, 22.55)} Z" fill="#b5aa92"/>`;
    }
    k += `<path d="${v}" fill="#5f5646" opacity=".8"/>`;
  }
  k += quad(9, 61, 22.6, 22.9, "#e6dcc6");
  for (const m of PFEILER) k += `<path d="M${FP(m - 0.4, 22.9)} L${FP(m, 25.6)} L${FP(m + 0.4, 22.9)} Z" fill="#d6cbb2"/><circle cx="${fx(m)}" cy="${fy(m, 25.75)}" r=".3" fill="#d6cbb2"/>`;
  /* --- barocke Freitreppe: zwei Läufe parallel zur Fassade, Podest vor dem Portal --- */
  {
    const T = TREPPE;
    /* Portal im Obergeschoss */
    k += `<path d="M${FP(33.4, 6.6)} L${FP(36.6, 6.6)} L${FP(36.6, 10.6)} Q${FP(36.6, 12.2)} ${FP(35, 12.6)} Q${FP(33.4, 12.2)} ${FP(33.4, 10.6)} Z" fill="#d6cab0"/>`;
    k += `<path d="M${FP(33.8, 6.6)} L${FP(36.2, 6.6)} L${FP(36.2, 10.6)} Q${FP(36.2, 11.8)} ${FP(35, 12.1)} Q${FP(33.8, 11.8)} ${FP(33.8, 10.6)} Z" fill="#4a3324"/>`;
    k += `<path d="M${FP(35, 6.6)} L${FP(35, 11.9)}" stroke="#2e1f15" stroke-width=".3"/>`;
    /* Sockelwand unter dem Podest (Blaustein) mit Kellertür */
    k += quad(T.pa, T.pb, 0, T.h, S.lg("podest", [[0, "#5a6066"], [1, "#7d858b"]], 0, 0, 1, 0));
    k += `<path d="M${FP(34.2, 0)} L${FP(35.8, 0)} L${FP(35.8, 2.2)} Q${FP(35.8, 3)} ${FP(35, 3.2)} Q${FP(34.2, 3)} ${FP(34.2, 2.2)} Z" fill="#2c3136"/>`;
    k += quad(T.pa - 0.3, T.pb + 0.3, T.h - 0.35, T.h + 0.1, "#a7aeb3");
    /* die beiden Läufe: Blaustein-Wange schräg, darüber die Stufen als Treppenkante (Tritt hell, Setzstufe dunkel) */
    const N = 16;
    for (const seite of [-1, 1]) {
      const mOut = seite < 0 ? T.m0 : T.m1, mIn = seite < 0 ? T.pa : T.pb;
      const dm = (mIn - mOut) / N, dh = T.h / N;
      /* Wange */
      k += `<path d="M${FP(mOut, 0)} L${FP(mOut, 0.6)} L${FP(mIn, T.h)} L${FP(mIn, T.h - 1.1)} Z" fill="${BLAUSTEIN}"/>`;
      k += `<path d="M${FP(mOut, 0)} L${FP(mOut, 0.6)} L${FP(mIn, T.h)} L${FP(mIn, T.h - 1.1)} Z" fill="#000" opacity=".12"/>`;
      /* Stufen */
      for (let i = 0; i < N; i++) {
        const m0 = mOut + i * dm, m1 = m0 + dm, h0 = i * dh + 0.6 * (1 - i / N), h1 = h0 + dh;
        k += `<path d="M${FP(m0, h0)} L${FP(m0, h1)} L${FP(m1, h1)} L${FP(m1, h0 + dh * 0.2)} Z" fill="${i % 2 ? "#aeb4b8" : "#a3aaae"}"/>`;
        k += `<path d="M${FP(m0, h1)} L${FP(m1, h1)}" stroke="#e3e7e9" stroke-width=".28"/>`;
        k += `<path d="M${FP(m0, h0)} L${FP(m0, h1)}" stroke="#555c62" stroke-width=".22"/>`;
      }
      /* schmiedeeisernes Geländer mit Handlauf */
      k += `<path d="M${FP(mOut, 1.7)} L${FP(mIn, T.h + 1.1)}" stroke="#23272a" stroke-width=".4" fill="none"/>`;
      for (let i = 0; i <= 8; i++) { const m = mOut + (mIn - mOut) * i / 8, h = 0.6 + (T.h - 0.6) * i / 8; k += `<path d="M${FP(m, h)} L${FP(m, h + 1.1)}" stroke="#23272a" stroke-width=".18"/>`; }
      k += `<path d="M${FP(mOut, 0.6)} L${FP(mOut, 1.9)}" stroke="#23272a" stroke-width=".35"/><circle cx="${fx(mOut)}" cy="${fy(mOut, 2)}" r=".3" fill="#c9a24a"/>`;
    }
    /* steinerne Brüstung an der Vorderkante des Podests: Sockel, Balustersäulchen, Deckplatte */
    k += quad(T.pa - 0.3, T.pb + 0.3, T.h + 0.1, T.h + 0.35, "#8a9196");
    for (let m = T.pa; m <= T.pb + 0.01; m += (T.pb - T.pa) / 9) k += `<path d="M${FP(m - 0.17, T.h + 0.35)} L${FP(m + 0.17, T.h + 0.35)} L${FP(m + 0.1, T.h + 0.75)} L${FP(m + 0.2, T.h + 1.05)} L${FP(m - 0.2, T.h + 1.05)} L${FP(m - 0.1, T.h + 0.75)} Z" fill="#9aa1a6"/>`;
    k += quad(T.pa - 0.35, T.pb + 0.35, T.h + 1.05, T.h + 1.35, "#b9c0c4") + `<path d="M${FP(T.pa - 0.35, T.h + 1.35)} L${FP(T.pb + 0.35, T.h + 1.35)}" stroke="#ffe2ad" stroke-width=".22"/>`;
  }
  /* Abendsonne: goldene Lasur auf der Fassade */
  k += `<path d="M${FP(9, 0)} L${FP(61, 0)} L${FP(61, 22.9)} L${FP(9, 22.9)} Z" fill="${GOLDLICHT}" opacity=".2"/>`;
  /* Trefferfläche aller Figuren (Lupe): das Band der Pfeiler im Lupenausschnitt */
  const z0 = 14, z1 = 50;
  S.teil({ id: "rathaus", de: "das Rathaus", syl: "RAT-haus", it: "il municipio", itSyl: "mu-ni-CI-pio", en: "town hall",
    x: 0, y: 0, kunst: k, tipp: "Das Rathaus steht auf den Mauern der Königshalle Karls des Großen. Nach der Krönung im Dom feierten die Könige hier im Krönungssaal ein großes Fest.",
    zoom: { x: fx(z0) - 1, y: r(141.5 - (fx(z1) - fx(z0) + 2) * 2 / 3), w: fx(z1) - fx(z0) + 2, h: r((fx(z1) - fx(z0) + 2) * 2 / 3) },
    unter: [
      { id: "koenig", de: "der König", syl: "KÖ-nig", it: "il re", itSyl: "RE", en: "king", x: fx(z0), y: fy(z0, FIGUR_H[0] - 0.4),
        kunst: flaeche(0, -((FIGUR_H[1] + 4.2 - FIGUR_H[0]) * fs(z0)), fx(z1) - fx(z0), (FIGUR_H[1] + 4.2 - FIGUR_H[0]) * fs(z0), 0.4),
        tipp: "An der Fassade stehen 50 Figuren von Königen und Kaisern. 31 von ihnen wurden in Aachen gekrönt." },
      { id: "freitreppe", de: "die Freitreppe", syl: "FREI-trep-pe", it: "la scalinata", itSyl: "sca-li-NA-ta", en: "outdoor staircase", x: fx(35), y: fy(35, 0), kunst: flaeche(fx(TREPPE.m0) - fx(35), -(TREPPE.h + 1.2) * fs(35), fx(TREPPE.m1) - fx(TREPPE.m0), (TREPPE.h + 1.2) * fs(35), 0.6),
        tipp: "Über die Freitreppe geht man hinauf zum Eingang des Rathauses." },
    ] });
}

/* =====================================================================
   4 — DER GRANUSTURM (Osten, links): unten karolingisches Bruchsteinmauerwerk
   ===================================================================== */
{
  const m0 = 0, m1 = 9.4, mm = 4.7;
  let k = "";
  k += `<path d="M${FP(m0, 0)} L${FP(m0, 33)} L${FP(m1, 33)} L${FP(m1, 0)} Z" fill="${S.lg("granus", [[0, "#857b68"], [0.6, "#b0a58c"], [1, "#c9bea2"]], 0, 0, 1, 0)}"/>`;
  for (let i = 0; i < 80; i++) { const m = m0 + 0.3 + rnd() * (m1 - m0 - 1), h = 0.6 + rnd() * 17.5, w = 0.5 + rnd() * 0.8; k += `<path d="M${FP(m, h)} L${FP(m + w, h)} L${FP(m + w, h + 0.45)} L${FP(m, h + 0.45)} Z" fill="${rnd() < 0.5 ? "#6f6656" : "#c9bea4"}" opacity=".55"/>`; }
  k += `<path d="M${FP(m0, 18.6)} L${FP(m1, 18.6)}" stroke="#ddd3bc" stroke-width=".55"/><path d="M${FP(m0, 26.6)} L${FP(m1, 26.6)}" stroke="#ddd3bc" stroke-width=".5"/>`;
  for (const [h, n] of [[8, 1], [20.4, 2], [28.2, 3]]) for (let i = 0; i < n; i++) { const m = mm - (n - 1) * 1.3 + i * 2.6 - 0.55; k += `<path d="M${FP(m, h)} L${FP(m + 1.1, h)} L${FP(m + 1.1, h + 3)} L${FP(m + 0.55, h + 3.6)} L${FP(m, h + 3)} Z" fill="#2f363d"/>`; }
  /* Turmuhr */
  k += `<circle cx="${fx(mm)}" cy="${fy(mm, 24.4)}" r="${r(1.2 * fs(mm))}" fill="#f2ead6" stroke="#c9a24a" stroke-width=".45"/><path d="M${fx(mm)} ${fy(mm, 24.4)} L${fx(mm)} ${fy(mm, 25.3)} M${fx(mm)} ${fy(mm, 24.4)} L${r(fx(mm) + 1.6)} ${fy(mm, 24.2)}" stroke="#222" stroke-width=".3"/>`;
  /* Helm (UNSICHER, nach Hugot 1977): geschweifte Glocke, offene Laterne, schlanke hohe Nadelspitze, Knauf und Wetterfahne */
  k += `<path d="M${FP(m0 - 0.5, 33)} L${FP(m1 + 0.5, 33)} L${FP(m1 + 0.5, 33.8)} L${FP(m0 - 0.5, 33.8)} Z" fill="#ddd3bc"/>`;
  k += `<path d="M${FP(m0 - 0.2, 33.8)} C${FP(m0, 36)} ${FP(mm - 1.2, 35.6)} ${FP(mm - 1.3, 38.6)} L${FP(mm + 1.3, 38.6)} C${FP(mm + 1.2, 35.6)} ${FP(m1, 36)} ${FP(m1 + 0.2, 33.8)} Z" fill="${SCHIEFER}"/>`;
  k += `<path d="M${FP(mm - 1.3, 38.6)} L${FP(mm - 1.3, 41.6)} L${FP(mm + 1.3, 41.6)} L${FP(mm + 1.3, 38.6)} Z" fill="#3e4750"/>`;
  for (const d of [-0.75, 0.25]) k += `<path d="M${FP(mm + d, 39)} L${FP(mm + d, 41)} L${FP(mm + d + 0.5, 41.3)} L${FP(mm + d + 0.5, 39)} Z" fill="#f0d79a" opacity=".75"/>`;
  k += `<path d="M${FP(mm - 1.6, 41.6)} L${FP(mm + 1.6, 41.6)} L${FP(mm + 1.4, 42.1)} L${FP(mm - 1.4, 42.1)} Z" fill="#c9a24a"/>`;
  k += `<path d="M${FP(mm - 1.15, 42.1)} C${FP(mm - 1.2, 44)} ${FP(mm - 0.3, 47)} ${FP(mm, 53)} C${FP(mm + 0.3, 47)} ${FP(mm + 1.2, 44)} ${FP(mm + 1.15, 42.1)} Z" fill="${SCHIEFER}"/>`;
  k += `<circle cx="${fx(mm)}" cy="${fy(mm, 53.3)}" r=".55" fill="${GOLD}"/><path d="M${fx(mm)} ${fy(mm, 53.6)} L${fx(mm)} ${fy(mm, 56)}" stroke="#7a6a3a" stroke-width=".3"/><path d="M${fx(mm)} ${fy(mm, 55.6)} l1.8 .25 l-.2 .55 l-1.6 -.1 Z" fill="#c9a24a"/>`;
  /* Abendlicht von rechts */
  k += `<path d="M${FP(m1 - 2.4, 0)} L${FP(m1, 0)} L${FP(m1, 33)} L${FP(m1 - 2.4, 33)} Z" fill="#ffc977" opacity=".42"/><path d="M${FP(m0, 0)} L${FP(m0 + 2.4, 0)} L${FP(m0 + 2.4, 33)} L${FP(m0, 33)} Z" fill="#4c5a6c" opacity=".28"/><path d="M${FP(m0, 0)} L${FP(m1, 0)} L${FP(m1, 33)} L${FP(m0, 33)} Z" fill="${GOLDLICHT}" opacity=".15"/>`;
  S.teil({ id: "granusturm", de: "der Granusturm", syl: "GRA-nus-turm", it: "la torre Granus", itSyl: "TOR-re GRA-nus", en: "Granus Tower", x: fx(mm), y: fy(mm, 20),
    kunst: `<g transform="translate(${-fx(mm)} ${-fy(mm, 20)})">${k}</g>`, tipp: "Der Granusturm ist ein Turm aus der Zeit Karls des Großen. Er ist über 1200 Jahre alt." });
}

/* =====================================================================
   5 — DER MARKTTURM (Westen, rechts): halbrund, eigene Gliederung, barocke Zwiebelhaube
   ===================================================================== */
{
  const m0 = 61, m1 = 70, mm = (m0 + m1) / 2;
  let k = "";
  k += `<path d="M${FP(m0, 0)} L${FP(m0, 30)} L${FP(m1, 30)} L${FP(m1, 0)} Z" fill="${S.lg("marktturm", [[0, "#857b67"], [0.35, "#ab9f86"], [0.75, "#cdc1a4"], [1, "#e2d4b4"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${FP(m0, 0)} L${FP(m1, 0)} L${FP(m1, 1)} Q${FP(mm, 0.6)} ${FP(m0, 1)} Z" fill="${BLAUSTEIN}"/>`;
  /* Gesimse mit Rundbogenfries, schmale Lanzettfenster versetzt in vier Geschossen */
  for (const h of [7.2, 14.4, 21.6]) {
    k += `<path d="M${FP(m0, h)} Q${FP(mm, h - 0.6)} ${FP(m1, h)} L${FP(m1, h + 0.5)} Q${FP(mm, h - 0.1)} ${FP(m0, h + 0.5)} Z" fill="#e2d8c0"/>`;
    for (let m = m0 + 0.5; m < m1 - 0.4; m += 0.9) k += `<path d="M${FP(m, h - 0.05)} Q${FP(m + 0.45, h - 0.6)} ${FP(m + 0.9, h - 0.05)}" stroke="#8f8571" stroke-width=".18" fill="none"/>`;
  }
  for (const [h, ms] of [[2.4, [mm - 0.6]], [9.2, [mm - 2.6, mm + 1.4]], [16.4, [mm - 0.6]], [23.4, [mm - 2.8, mm - 0.6, mm + 1.6]]]) for (const m of ms) k += `<path d="M${FP(m, h)} L${FP(m + 1.2, h)} L${FP(m + 1.2, h + 3.2)} L${FP(m + 0.6, h + 3.9)} L${FP(m, h + 3.2)} Z" fill="#2f363d"/><path d="M${FP(m - 0.2, h - 0.2)} L${FP(m + 1.4, h - 0.2)}" stroke="#e2d8c0" stroke-width=".3"/>`;
  /* Kranzgesims mit Konsolen */
  k += `<path d="M${FP(m0 - 0.4, 28.6)} Q${FP(mm, 27.8)} ${FP(m1 + 0.4, 28.6)} L${FP(m1 + 0.4, 30)} Q${FP(mm, 29.3)} ${FP(m0 - 0.4, 30)} Z" fill="#ddd3bc"/>`;
  for (let m = m0 + 0.4; m < m1; m += 1.1) k += `<rect x="${fx(m)}" y="${fy(m, 28.6)}" width=".5" height=".9" fill="#a39985"/>`;
  /* Helm (UNSICHER, nach Hugot 1977): breite Zwiebel, Laterne, kleine Zwiebel, Knauf mit Wetterfahne */
  k += `<path d="M${FP(m0 - 0.2, 30)} C${FP(m0 - 1.4, 33.6)} ${FP(mm - 2.6, 36)} ${FP(mm - 1.2, 37.4)} L${FP(mm + 1.2, 37.4)} C${FP(mm + 2.6, 36)} ${FP(m1 + 1.4, 33.6)} ${FP(m1 + 0.2, 30)} Z" fill="${SCHIEFER}"/>`;
  k += `<path d="M${FP(m0 + 1.4, 31)} C${FP(m0 + 0.6, 33.6)} ${FP(mm - 2, 35.4)} ${FP(mm - 1, 36.6)}" stroke="#7d8894" stroke-width=".3" fill="none"/>`;
  k += `<path d="M${FP(mm - 1.2, 37.4)} L${FP(mm - 1.2, 39.8)} L${FP(mm + 1.2, 39.8)} L${FP(mm + 1.2, 37.4)} Z" fill="#3e4750"/><path d="M${FP(mm - 0.45, 37.8)} L${FP(mm - 0.45, 39.4)} L${FP(mm + 0.45, 39.4)} L${FP(mm + 0.45, 37.8)} Z" fill="#f0d79a" opacity=".7"/>`;
  k += `<path d="M${FP(mm - 1.1, 39.8)} C${FP(mm - 2, 41)} ${FP(mm - 0.8, 42.4)} ${FP(mm - 0.2, 42.8)} L${FP(mm + 0.2, 42.8)} C${FP(mm + 0.8, 42.4)} ${FP(mm + 2, 41)} ${FP(mm + 1.1, 39.8)} Z" fill="${SCHIEFER}"/>`;
  k += `<path d="M${FP(mm - 0.2, 42.8)} L${FP(mm, 45)} L${FP(mm + 0.2, 42.8)} Z" fill="#323a42"/><circle cx="${fx(mm)}" cy="${fy(mm, 45.3)}" r=".5" fill="${GOLD}"/><path d="M${fx(mm)} ${fy(mm, 45.6)} L${fx(mm)} ${fy(mm, 47.4)}" stroke="#7a6a3a" stroke-width=".28"/><path d="M${fx(mm)} ${fy(mm, 47.1)} l1.6 .22 l-.2 .5 l-1.4 -.1 Z" fill="#c9a24a"/>`;
  k += `<path d="M${FP(m1 - 2.6, 0)} L${FP(m1, 0)} L${FP(m1, 30)} L${FP(m1 - 2.6, 30)} Z" fill="#ffc977" opacity=".45"/><path d="M${FP(m0, 0)} L${FP(m0 + 2.4, 0)} L${FP(m0 + 2.4, 30)} L${FP(m0, 30)} Z" fill="#4c5a6c" opacity=".26"/><path d="M${FP(m0, 0)} L${FP(m1, 0)} L${FP(m1, 30)} L${FP(m0, 30)} Z" fill="${GOLDLICHT}" opacity=".16"/>`;
  S.teil({ id: "marktturm", de: "der Marktturm", syl: "MARKT-turm", it: "la torre del mercato", itSyl: "TOR-re del mer-CA-to", en: "Market Tower", x: fx(mm), y: fy(mm, 18),
    kunst: `<g transform="translate(${-fx(mm)} ${-fy(mm, 18)})">${k}</g>`, tipp: "Der Marktturm ist ein halbrunder Turm an der Westseite des Rathauses. Oben hat er eine barocke Haube." });
}

/* =====================================================================
   6 — DAS HAUS (Bürgerhäuser an der Westseite des Marktes, rechts) mit Café links
   ===================================================================== */
{
  let k = "";
  const fenster = (x0, x1, yB, h, ach, rahmen, glas) => {
    let g = "";
    const w = x1 - x0, sp = w / ach;
    for (let gs = 0; gs < 3; gs++) for (let a = 0; a < ach; a++) {
      const x = x0 + sp * (a + 0.28), y = yB - h + 4 + gs * (h - 12) / 2.6, fw = sp * 0.44, fh = (h - 12) / 4;
      g += `<rect x="${r(x - 0.5)}" y="${r(y - 0.6)}" width="${r(fw + 1)}" height="${r(fh + 1.3)}" fill="${rahmen}"/><rect x="${r(x)}" y="${r(y)}" width="${r(fw)}" height="${r(fh)}" fill="${glas}"/><line x1="${r(x + fw / 2)}" y1="${r(y)}" x2="${r(x + fw / 2)}" y2="${r(y + fh)}" stroke="#e8e2d4" stroke-width=".25"/><rect x="${r(x)}" y="${r(y)}" width=".35" height="${r(fh)}" fill="#1f272e"/>`;
    }
    return g;
  };
  const glas = S.lg("hfenster", [[0, "#4c5d6b"], [1, "#2b3742"]]);
  /* (1) Backsteinhaus mit geschweiftem Couven-Giebel (breit) */
  {
    const x0 = 252, x1 = 279, yB = 141, h = 29, w = x1 - x0;
    k += `<path d="M${x0} ${yB} L${x0} ${yB - h} L${x1} ${yB - h} L${x1} ${yB} Z" fill="${S.lg("haus2", [[0, "#9c4f37"], [1, "#b8674b"]], 0, 0, 1, 0)}"/>`;
    k += `<path d="M${x0} ${yB - h} Q${r(x0 + w * 0.12)} ${yB - h - 4} ${r(x0 + w * 0.3)} ${yB - h - 5} L${r(x0 + w * 0.3)} ${yB - h - 9} Q${r(x0 + w / 2)} ${yB - h - 13} ${r(x1 - w * 0.3)} ${yB - h - 9} L${r(x1 - w * 0.3)} ${yB - h - 5} Q${r(x1 - w * 0.12)} ${yB - h - 4} ${x1} ${yB - h} Z" fill="#b0603f" stroke="#7a8086" stroke-width=".6"/>`;
    k += `<circle cx="${r(x0 + w / 2)}" cy="${yB - h - 7.4}" r="1.3" fill="#3b4752" stroke="#7a8086" stroke-width=".4"/>`;
    k += fenster(x0, x1, yB, h, 3, "#8b9298", glas);
    k += `<rect x="${x0}" y="${yB - 8.6}" width="${w}" height="8.6" fill="#5f656b"/><rect x="${x0 + 1}" y="${yB - 7.6}" width="${w - 2}" height="7.6" fill="${S.lg("laden", [[0, "#e9d9b0"], [1, "#9a8a6c"]])}"/>`;
    k += `<path d="M${x0} ${yB - 7.6} L${x1} ${yB - 7.6} L${x1 + 1.4} ${yB - 3.8} L${x0 - 1.4} ${yB - 3.8} Z" fill="#2f5d47"/>`;
    for (let x = x0; x < x1; x += 2.4) k += `<path d="M${r(x)} ${yB - 3.8} q1.2 1.2 2.4 0" fill="#2f5d47"/>`;
    k += `<path d="M${x0} ${yB - 8.6} L${x0} ${yB - h} Q${r(x0 + w * 0.12)} ${yB - h - 4} ${r(x0 + w * 0.3)} ${yB - h - 5} L${r(x0 + w * 0.3)} ${yB - h - 9} Q${r(x0 + w / 2)} ${yB - h - 13} ${r(x1 - w * 0.3)} ${yB - h - 9} L${r(x1 - w * 0.3)} ${yB - h - 5} Q${r(x1 - w * 0.12)} ${yB - h - 4} ${x1} ${yB - h} L${x1} ${yB - 8.6} Z" fill="${GOLDLICHT}" opacity=".14"/><rect x="${x1 - 2.2}" y="${yB - h}" width="2.2" height="${h - 8.6}" fill="#ffd9a0" opacity=".25"/>`;
  }
  /* (2) schmales Putzhaus mit Traufe und zwei Gauben */
  {
    const x0 = 279, x1 = 296, yB = 141.4, h = 24, w = x1 - x0;
    k += `<path d="M${x0} ${yB} L${x0} ${yB - h} L${x1} ${yB - h} L${x1} ${yB} Z" fill="${S.lg("haus3", [[0, "#ddd0b0"], [1, "#efe4ca"]], 0, 0, 1, 0)}"/>`;
    k += `<path d="M${x0 - 0.6} ${yB - h} L${x0 + 2.4} ${yB - h - 7} L${x1 - 2.4} ${yB - h - 7} L${x1 + 0.6} ${yB - h} Z" fill="${DACH}"/>`;
    for (const x of [x0 + 4.4, x1 - 6.4]) k += `<path d="M${x} ${yB - h - 1} L${x} ${yB - h - 3.6} L${x + 1} ${yB - h - 4.6} L${x + 2} ${yB - h - 3.6} L${x + 2} ${yB - h - 1} Z" fill="#4a545e"/><rect x="${x + 0.4}" y="${yB - h - 3.4}" width="1.2" height="2" fill="#93a9b8"/>`;
    k += fenster(x0, x1, yB, h, 2, "#e8e0cc", glas);
    k += `<path d="M${x0} ${yB - 8} L${x0} ${yB - h} L${x1} ${yB - h} L${x1} ${yB - 8} Z" fill="${GOLDLICHT}" opacity=".14"/>`;
    k += `<rect x="${x0}" y="${yB - 8}" width="${w}" height="8" fill="#7a6a54"/><rect x="${x0 + 1.4}" y="${yB - 7}" width="${w - 2.8}" height="7" fill="${S.lg("laden2", [[0, "#f0dcae"], [1, "#a8916a"]])}"/>`;
  }
  /* (3) Backsteinhaus mit Treppengiebel, dunkler */
  {
    const x0 = 296, x1 = 321, yB = 141.8, h = 31, w = x1 - x0;
    k += `<path d="M${x0} ${yB} L${x0} ${yB - h} L${x1} ${yB - h} L${x1} ${yB} Z" fill="${S.lg("haus4", [[0, "#7d3f2e"], [1, "#954d39"]], 0, 0, 1, 0)}"/>`;
    for (let i = 0; i < 4; i++) { const s = i * 2.6; k += `<rect x="${r(x0 + 1 + s)}" y="${r(yB - h - (i + 1) * 2.6)}" width="${r(w - 2 - 2 * s)}" height="2.7" fill="#8f4835"/><rect x="${r(x0 + 0.6 + s)}" y="${r(yB - h - (i + 1) * 2.6)}" width="${r(w - 1.2 - 2 * s)}" height=".5" fill="#7a8086"/>`; }
    k += fenster(x0, x1, yB, h, 3, "#8b9298", glas);
    k += `<rect x="${x0}" y="${yB - 8.6}" width="${w}" height="8.6" fill="#5f656b"/><rect x="${x0 + 1}" y="${yB - 7.6}" width="${w - 2}" height="7.6" fill="${S.lg("laden3", [[0, "#e9d9b0"], [1, "#9a8a6c"]])}"/>`;
    k += `<path d="M${x0} ${yB - 7.6} L${x1} ${yB - 7.6} L${x1 + 1.4} ${yB - 3.8} L${x0 - 1.4} ${yB - 3.8} Z" fill="#7a2a28"/>`;
    for (let x = x0; x < x1; x += 2.4) k += `<path d="M${r(x)} ${yB - 3.8} q1.2 1.2 2.4 0" fill="#7a2a28"/>`;
    k += `<path d="M${x0} ${yB - 8.6} L${x0} ${yB - h} L${x0 + 1} ${yB - h} L${x0 + 1} ${yB - h - 10.4} L${x1} ${yB - h - 10.4} L${x1} ${yB - 8.6} Z" fill="${GOLDLICHT}" opacity=".12"/>`;
  }
  /* links: Bürgerhaus mit dem Café (Markise) und ein Eckhaus */
  k += `<path d="M18 141 L18 112 L44 110.4 L44 141 Z" fill="${S.lg("haus1", [[0, "#8e4a35"], [1, "#a85c41"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M16.6 112.4 L22 104.4 L42 103.4 L45 110.6 Z" fill="${DACH}"/>`;
  for (const y of [114.5, 123]) for (const x of [21, 27.5, 34, 40]) k += `<rect x="${x - 0.5}" y="${y - 0.5}" width="3.2" height="6" fill="#7a8086"/><rect x="${x}" y="${y}" width="2.2" height="5" fill="#3b4752"/>`;
  k += `<rect x="0" y="117" width="18.4" height="24" fill="${S.lg("haus0", [[0, "#cfc3a8"], [1, "#e2d8c0"]], 0, 0, 1, 0)}"/><path d="M-1 117.4 L4 111 L18.6 110.6 L18.6 117 Z" fill="${DACH}"/>`;
  for (const x of [2.4, 8.4, 14]) k += `<rect x="${x}" y="119.6" width="2.4" height="4.2" fill="#3b4752"/><rect x="${x}" y="126.2" width="2.4" height="4.2" fill="#3b4752"/>`;
  /* das Café im Erdgeschoss: Schaufenster mit warmem Licht, Markise in Weinrot */
  k += `<rect x="0" y="132.4" width="44" height="8.6" fill="#4a3a2c"/><rect x="1.2" y="133.6" width="15" height="7.4" fill="${S.lg("cafe", [[0, "#ffd894"], [1, "#b07a3c"]])}"/><rect x="19.6" y="133.6" width="22" height="7.4" fill="${S.lg("cafe2", [[0, "#ffd894"], [1, "#b07a3c"]])}"/><rect x="17" y="133.6" width="2.2" height="7.4" fill="#2e2219"/>`;
  k += `<path d="M0 131.6 L44 131.6 L46 136 L-2 136 Z" fill="#7a2a28"/>`;
  for (let x = -2; x < 46; x += 2.4) k += `<path d="M${r(x)} 136 q1.2 1.3 2.4 0" fill="#7a2a28"/>`;
  k += `<text x="31" y="134.6" font-size="2" text-anchor="middle" fill="#f6e7c4" font-family="Georgia,serif" font-style="italic">Café am Markt</text>`;
  k += `<path d="M18 141 L18 112 L44 110.4 L44 132 L18 132 Z M0 141 L0 117 L18.4 117 L18.4 132 L0 132 Z" fill="${GOLDLICHT}" opacity=".13"/>`;
  S.teil({ id: "haus", de: "das Haus", syl: "HAUS", it: "la casa", itSyl: "CA-sa", en: "house", x: 0, y: 0, kunst: k,
    tipp: "Viele alte Häuser in Aachen sind aus Backstein. Die Fensterrahmen sind aus grauem Blaustein." });
}

/* =====================================================================
   7 — DER KARLSBRUNNEN — Lupe: der Kaiser, die Krone, der Reichsapfel, das Zepter
   ===================================================================== */
const KB = { x: 206, y: 146.4 };
{
  let k = schlag(-2, 0.6, 50, 9, 0.8);
  /* Rokoko-Becken aus Blaustein: Stufe, geschwungener Rand */
  k += `<path d="M-31 0 L31 0 L30 -1.4 L-30 -1.4 Z" fill="#5d6368"/><path d="M-31 0 L31 0" stroke="#3e4347" stroke-width=".4"/>`;
  k += `<path d="M-28.4 -1.4 Q-28.8 -4.6 -24 -5.6 Q-14 -7.2 0 -7.4 Q14 -7.2 24 -5.6 Q28.8 -4.6 28.4 -1.4 Z" fill="${BLAUSTEIN}"/>`;
  k += `<path d="M-24 -5.6 Q-14 -7.2 0 -7.4 Q14 -7.2 24 -5.6 Q14 -6.4 0 -6.4 Q-14 -6.4 -24 -5.6 Z" fill="#b2b9be"/>`;
  for (const x of [-20, -8, 8, 20]) k += `<path d="M${x - 1.4} -1.6 Q${x} -4.4 ${x + 1.4} -1.6" stroke="#4f555a" stroke-width=".4" fill="none"/>`;
  k += `<ellipse cx="0" cy="-6.6" rx="22" ry="1" fill="${S.lg("bwasser", [[0, "#7fa2ad"], [1, "#c6d7d2"]], 0, 0, 1, 0)}" opacity=".9"/>`;
  /* Studenten sitzen auf dem Beckenrand */
  for (const [x, f, haar] of [[-19, "#2d6fb3", "#3a2a20"], [-15.6, "#e0a82e", "#c9a466"], [16, "#c9302c", "#2b2b2b"]]) k += passant(x, -5.4, 9.6, { hemd: f, haar, hose: "#3d5f8c", sitzt: true });
  /* Fuß und die große Bronzeschale („Eäzekomp“) */
  k += `<path d="M-2.6 -6.8 L-1.8 -12 L1.8 -12 L2.6 -6.8 Z" fill="${BRONZE}"/>`;
  k += `<path d="M-13 -15 Q-12.4 -10.8 -6 -10.2 Q0 -9.6 6 -10.2 Q12.4 -10.8 13 -15 Z" fill="${S.lg("schale", [[0, "#3f6151"], [0.4, "#76a08a"], [0.7, "#a6c8b0"], [1, "#5d806d"]], 0, 0, 1, 0)}"/>`;
  k += `<ellipse cx="0" cy="-15" rx="13" ry="1.1" fill="#5d8471"/><ellipse cx="0" cy="-15.1" rx="12" ry=".75" fill="#8fb3bf"/>`;
  for (const x of [-9, -3, 3, 9]) k += `<path d="M${x} -14.4 q.4 2.4 0 3.6" stroke="#2f4a3d" stroke-width=".35" fill="none"/>`;
  for (const x of [-12.4, 12.4]) k += `<path d="M${x} -14.4 Q${r(x * 1.25)} -12 ${r(x * 1.34)} -6.8" stroke="#dcecef" stroke-width=".55" fill="none" opacity=".85"/>`;
  k += `<path d="M-1.6 -15.4 L-1.3 -23 L1.3 -23 L1.6 -15.4 Z" fill="${BRONZE}"/><rect x="-2.4" y="-24.4" width="4.8" height="1.6" rx=".4" fill="#4b6a5a"/>`;
  /* KARL DER GROSSE (blickt zu uns): Zepter in seiner Rechten (im Bild links), Reichsapfel in seiner Linken (im Bild rechts) */
  const KY = -24.4;
  const BR = S.lg("karl", [[0, "#22362d"], [0.45, "#4f7363"], [0.75, "#86a996"], [1, "#3a5a4b"]], 0, 0, 1, 0);
  const REGAL = S.lg("regal", [[0, "#7a6a3a"], [0.5, "#c9b06a"], [1, "#8a7640"]], 0, 0, 1, 1);
  k += `<path d="M-2.2 ${KY - 7.4} Q-3.3 ${KY - 4} -3 ${KY - 0.3} L3 ${KY - 0.3} Q3.3 ${KY - 4} 2.2 ${KY - 7.4} Z" fill="#2a4237"/>`;
  for (const x of [-2.4, 2.4]) k += `<path d="M${x * 0.85} ${KY - 6.8} Q${r(x * 1.25)} ${KY - 3.6} ${r(x * 1.2)} ${KY - 0.5}" stroke="#1f3329" stroke-width=".18" fill="none"/>`;
  k += `<path d="M-1.5 ${KY - 5.2} L-2.1 ${KY - 0.4} L2.1 ${KY - 0.4} L1.5 ${KY - 5.2} Z" fill="${BR}"/>`;
  for (const x of [-1, 0, 1]) k += `<path d="M${x * 0.8} ${KY - 4.8} Q${r(x * 1.05)} ${KY - 2.4} ${r(x * 1.3)} ${KY - 0.5}" stroke="#1f3329" stroke-width=".16" fill="none"/>`;
  k += `<ellipse cx="-.8" cy="${KY - 0.3}" rx=".6" ry=".25" fill="#2a4237"/><ellipse cx=".8" cy="${KY - 0.3}" rx=".6" ry=".25" fill="#2a4237"/>`;
  k += `<path d="M-1.6 ${KY - 5.2} L-1.7 ${KY - 7.6} Q0 ${KY - 8.2} 1.7 ${KY - 7.6} L1.6 ${KY - 5.2} Z" fill="${BR}"/>`;
  k += `<rect x="-1.6" y="${KY - 5.5}" width="3.2" height=".4" fill="#1f3329"/><circle cx="0" cy="${KY - 5.3}" r=".25" fill="${REGAL}"/>`;
  k += `<path d="M-2.2 ${KY - 7.5} Q-1 ${KY - 8.3} 0 ${KY - 8.1} Q1 ${KY - 8.3} 2.2 ${KY - 7.5} L2 ${KY - 7} Q0 ${KY - 7.6} -2 ${KY - 7} Z" fill="#355445"/><circle cx="-1.5" cy="${KY - 7.5}" r=".3" fill="${REGAL}"/>`;
  /* rechter Arm (im Bild links) hält das Zepter hoch */
  k += `<path d="M-1.8 ${KY - 7.3} Q-2.7 ${KY - 6.4} -2.6 ${KY - 5.6}" stroke="#3e5e4e" stroke-width=".75" fill="none" stroke-linecap="round"/><circle cx="-2.6" cy="${KY - 5.6}" r=".35" fill="#4f7363"/>`;
  k += `<path d="M-2.7 ${KY - 4.4} L-2.5 ${KY - 11.6}" stroke="${REGAL}" stroke-width=".32"/><path d="M-2.5 ${KY - 11.6} l-.45 -.5 .45 -.85 .45 .85 Z" fill="${REGAL}"/><circle cx="-2.5" cy="${KY - 12.6}" r=".18" fill="${REGAL}"/>`;
  /* linker Arm (im Bild rechts) hält den Reichsapfel vor die Brust */
  k += `<path d="M1.8 ${KY - 7.3} Q2.6 ${KY - 6} 2 ${KY - 5.3} L1.3 ${KY - 5.6}" stroke="#3e5e4e" stroke-width=".75" fill="none" stroke-linecap="round"/>`;
  k += `<circle cx="1.6" cy="${KY - 6.1}" r=".72" fill="${REGAL}"/><path d="M1.6 ${KY - 6.8} L1.6 ${KY - 7.7} M1.2 ${KY - 7.35} L2 ${KY - 7.35}" stroke="#a8914f" stroke-width=".2"/><path d="M.9 ${KY - 6.1} L2.3 ${KY - 6.1}" stroke="#7a6a3a" stroke-width=".12"/>`;
  /* Kopf: Gesicht mit Nase und Augen, Vollbart, Bügelkrone mit Stirnkreuz */
  k += `<rect x="-.35" y="${KY - 8.6}" width=".7" height=".6" fill="#3e5e4e"/>`;
  k += `<ellipse cx="0" cy="${KY - 9.55}" rx=".82" ry="1" fill="${S.rg("gesicht", [[0, "#8fb09d"], [0.6, "#5f8270"], [1, "#3e5e4e"]], 0.6, 0.4, 0.7)}"/>`;
  k += `<path d="M-.32 ${KY - 9.85} h.22 M.12 ${KY - 9.85} h.22" stroke="#1f3329" stroke-width=".14"/><path d="M-.45 ${KY - 10.05} q.2 -.12 .36 0 M.1 ${KY - 10.05} q.2 -.12 .36 0" stroke="#2a4237" stroke-width=".08" fill="none"/>`;
  k += `<path d="M0 ${KY - 9.8} L-.12 ${KY - 9.25} L.1 ${KY - 9.2}" stroke="#2a4237" stroke-width=".1" fill="none"/>`;
  k += `<path d="M-.82 ${KY - 9.5} Q-.95 ${KY - 8.3} -.4 ${KY - 7.75} Q0 ${KY - 7.45} .4 ${KY - 7.75} Q.95 ${KY - 8.3} .82 ${KY - 9.5} Q.5 ${KY - 9.05} .2 ${KY - 9.1} Q0 ${KY - 8.95} -.2 ${KY - 9.1} Q-.5 ${KY - 9.05} -.82 ${KY - 9.5} Z" fill="#3a594a"/>`;
  for (const x of [-0.45, -0.15, 0.15, 0.45]) k += `<path d="M${x} ${KY - 8.95} q.05 .5 ${r(x * 0.2)} .9" stroke="#2a4237" stroke-width=".07" fill="none"/>`;
  k += `<path d="M-.3 ${KY - 9.05} q.3 .12 .6 0" stroke="#1f3329" stroke-width=".09" fill="none"/>`;
  k += `<path d="M-.95 ${KY - 10.25} L-.95 ${KY - 11.1} L-.48 ${KY - 11.25} L-.48 ${KY - 10.3} Z M-.42 ${KY - 10.3} L-.42 ${KY - 11.35} L.42 ${KY - 11.35} L.42 ${KY - 10.3} Z M.48 ${KY - 10.3} L.48 ${KY - 11.25} L.95 ${KY - 11.1} L.95 ${KY - 10.25} Z" fill="${REGAL}"/>`;
  k += `<path d="M-.95 ${KY - 10.25} L.95 ${KY - 10.25}" stroke="#7a6a3a" stroke-width=".12"/><path d="M-.85 ${KY - 11.1} Q0 ${KY - 12.3} .85 ${KY - 11.1}" stroke="${REGAL}" stroke-width=".2" fill="none"/>`;
  k += `<path d="M0 ${KY - 11.35} L0 ${KY - 12.25} M-.28 ${KY - 11.95} L.28 ${KY - 11.95}" stroke="${REGAL}" stroke-width=".16"/>`;
  k += `<circle cx="0" cy="${KY - 10.8}" r=".14" fill="#b5162b"/><circle cx="-.7" cy="${KY - 10.7}" r=".09" fill="#2f6fb3"/><circle cx=".7" cy="${KY - 10.7}" r=".09" fill="#2f6fb3"/>`;
  k += `<path d="M1.4 ${KY - 7.2} Q2 ${KY - 4} 1.9 ${KY - 0.8}" stroke="#b4d3c0" stroke-width=".25" fill="none" opacity=".7"/>`;
  S.teil({ id: "karlsbrunnen", de: "der Karlsbrunnen", syl: "KARLS-brun-nen", it: "la fontana di Carlo Magno", itSyl: "fon-TA-na di CAR-lo MA-gno", en: "Charlemagne Fountain",
    x: KB.x, y: KB.y, kunst: k, tipp: "Die Aachener nennen den Brunnen „Karl in de Eäzekomp“ — Karl in der Erbsenschüssel.",
    zoom: { x: KB.x - 10.5, y: KB.y - 38.6, w: 21, h: 14 },
    unter: [
      { id: "kaiser", de: "der Kaiser", syl: "KAI-ser", it: "l'imperatore", itSyl: "im-pe-ra-TO-re", en: "emperor", x: KB.x, y: KB.y + KY, kunst: flaeche(-1.9, -8.6, 3.4, 8.6, 0.4),
        tipp: "Karl der Große war Kaiser. Er lebte sehr gern in Aachen — wegen der warmen Quellen." },
      { id: "krone", de: "die Krone", syl: "KRO-ne", it: "la corona", itSyl: "co-RO-na", en: "crown", x: KB.x, y: KB.y + KY - 10.2, kunst: flaeche(-1.1, -2.2, 2.2, 2.2, 0.3),
        tipp: "Die Krone hat oben einen Bügel und vorn ein Kreuz." },
      { id: "reichsapfel", de: "der Reichsapfel", syl: "REICHS-ap-fel", it: "il globo imperiale", itSyl: "GLO-bo im-pe-RIA-le", en: "imperial orb", x: KB.x + 1.6, y: KB.y + KY - 6.1, kunst: flaeche(-0.9, -1.8, 1.8, 2.6, 0.3),
        tipp: "Den Reichsapfel trägt der Kaiser in der Hand: Er zeigt die Herrschaft über die Welt." },
      { id: "zepter", de: "das Zepter", syl: "ZEP-ter", it: "lo scettro", itSyl: "SCET-tro", en: "sceptre", x: KB.x - 2.6, y: KB.y + KY - 8, kunst: flaeche(-0.8, -4.8, 1.5, 7.4, 0.3),
        tipp: "Das Zepter ist ein Stab. Er zeigt: Hier regiert ein König." },
    ] });
}

/* =====================================================================
   8 — DIE TAUBE (drei Tauben auf dem Pflaster)
   ===================================================================== */
{
  const taube = (x, y, s, rechts) => {
    const m = rechts ? 1 : -1;
    let g = schlag(x, y + 0.1, 3 * s, 2.2 * s, 0.7);
    g += `<path d="M${r(x - 2.2 * s * m)} ${r(y - 1.2 * s)} Q${r(x - 0.4 * s * m)} ${r(y - 2.6 * s)} ${r(x + 1.2 * s * m)} ${r(y - 1.8 * s)} Q${r(x + 1.8 * s * m)} ${r(y - 0.6 * s)} ${r(x + 0.6 * s * m)} ${r(y - 0.2 * s)} L${r(x - 1.2 * s * m)} ${r(y - 0.4 * s)} L${r(x - 3 * s * m)} ${r(y - 0.8 * s)} Z" fill="${S.lg("taube", [[0, "#9aa0ad"], [1, "#6c7280"]])}"/>`;
    g += `<path d="M${r(x - 1.6 * s * m)} ${r(y - 1.5 * s)} Q${r(x)} ${r(y - 1.9 * s)} ${r(x + 0.6 * s * m)} ${r(y - 1.1 * s)}" stroke="#5a606c" stroke-width="${r(0.3 * s)}" fill="none"/>`;
    g += `<circle cx="${r(x + 1.3 * s * m)}" cy="${r(y - 2.4 * s)}" r="${r(0.7 * s)}" fill="#7c8290"/><path d="M${r(x + 0.9 * s * m)} ${r(y - 1.9 * s)} q${r(0.4 * s * m)} ${r(0.4 * s)} ${r(0.9 * s * m)} 0" stroke="#6f9c8a" stroke-width="${r(0.35 * s)}" fill="none"/>`;
    g += `<path d="M${r(x + 1.9 * s * m)} ${r(y - 2.5 * s)} l${r(0.5 * s * m)} ${r(0.2 * s)}" stroke="#d9a07a" stroke-width="${r(0.2 * s)}"/><circle cx="${r(x + 1.5 * s * m)}" cy="${r(y - 2.6 * s)}" r="${r(0.12 * s)}" fill="#c0392b"/>`;
    g += `<path d="M${r(x)} ${r(y - 0.3 * s)} l0 ${r(0.4 * s)} M${r(x + 0.4 * s * m)} ${r(y - 0.3 * s)} l0 ${r(0.4 * s)}" stroke="#c0605a" stroke-width="${r(0.15 * s)}"/>`;
    g += flaecheEllipse(x, y - 1.4 * s, 4.2, 2.6);
    return g;
  };
  const k = taube(0, 0, 1.25, true) + taube(10, 2.6, 1.35, false) + taube(-9, 3.4, 1.4, true);
  S.teil({ oben: true, id: "taube", de: "die Taube", syl: "TAU-be", it: "il piccione", itSyl: "pic-CIO-ne", en: "pigeon", x: 168, y: 168, kunst: k });
}

/* =====================================================================
   9 — DER SONNENSCHIRM, DER STUHL, DER TISCH (Lupe: Printe, Tasse) und DER GAST — Café links vorn
   ===================================================================== */
const TISCH = { x: 52, y: 186 };
{
  const s = km(182);
  let k = "";
  const H = 2.7 * s;
  k += schlag(0, 0.2, 2.2, H, 0.6, 24);
  /* am Abend zugeklappt: schmaler Stoffkegel am Mast */
  k += `<rect x="-.55" y="${r(-H - 3)}" width="1.1" height="${r(H + 3)}" fill="#d8d2c4"/><circle cx="0" cy="${r(-H - 3.4)}" r=".8" fill="#cfc6b4"/>`;
  k += `<path d="M-.6 ${r(-H - 2)} Q-3.2 ${r(-H + 10)} -2.2 ${r(-H + 26)} L2.2 ${r(-H + 26)} Q3.2 ${r(-H + 10)} .6 ${r(-H - 2)} Z" fill="${S.lg("schirm", [[0, "#d8cdb6"], [0.55, "#fbf6ec"], [1, "#ffe9c4"]], 0, 0, 1, 0)}"/>`;
  for (const x of [-1.2, 0, 1.2]) k += `<path d="M${r(x * 0.3)} ${r(-H)} Q${r(x * 1.4)} ${r(-H + 14)} ${r(x * 1.5)} ${r(-H + 26)}" stroke="#c9bea6" stroke-width=".3" fill="none"/>`;
  k += `<path d="M-2.4 ${r(-H + 25.6)} q2.4 1.6 4.8 0" stroke="#7a2a28" stroke-width=".9" fill="none"/><rect x="-1.4" y="${r(-H + 14)}" width="2.8" height=".9" rx=".3" fill="#7a2a28"/>`;
  k += `<path d="M-3 -1 L3 -1 L3.6 0 L-3.6 0 Z" fill="#7d786d"/>`;
  S.teil({ id: "sonnenschirm", de: "der Sonnenschirm", syl: "SON-nen-schirm", it: "l'ombrellone", itSyl: "om-brel-LO-ne", en: "parasol", x: 24, y: 182, steht: true, kunst: k,
    tipp: "Am Abend klappt das Café die Sonnenschirme zu." });
}
const stuhl = (x, y, mitLehne = true, ax = 999) => {
  const s = km(y), SH = 0.46 * s, LH = 0.9 * s;
  let k = schlag(0, 0.2, 9, LH, 0.55, ax);
  k += `<path d="M-4.4 0 L-4 ${r(-SH)} M4.4 0 L4 ${r(-SH)}" stroke="#2c3236" stroke-width=".9"/>`;
  if (mitLehne) {
    k += `<path d="M-3.6 ${r(-SH)} L-4.2 ${r(-LH)} M3.6 ${r(-SH)} L4.2 ${r(-LH)}" stroke="#2c3236" stroke-width=".9"/>`;
    k += `<path d="M-4.6 ${r(-LH)} Q0 ${r(-LH - 2)} 4.6 ${r(-LH)}" stroke="#2c3236" stroke-width="1.2" fill="none"/>`;
    for (const t of [0.3, 0.55]) k += `<path d="M-4.2 ${r(-SH - (LH - SH) * t)} Q0 ${r(-SH - (LH - SH) * t - 1.4)} 4.2 ${r(-SH - (LH - SH) * t)}" stroke="#2c3236" stroke-width=".5" fill="none"/>`;
  }
  k += `<path d="M-4.8 ${r(-SH)} L4.8 ${r(-SH)} L4.2 ${r(-SH + 1.4)} L-4.2 ${r(-SH + 1.4)} Z" fill="${S.lg("sitz", [[0, "#b08a5a"], [1, "#7d5e38"]])}"/>`;
  return k;
};
{
  S.teil({ id: "stuhl", de: "der Stuhl", syl: "STUHL", it: "la sedia", itSyl: "SE-dia", en: "chair", x: 72, y: 181, steht: true, kunst: stuhl(0, 181, true, 72) });
}
{
  /* DER GAST — eine Frau sitzt auf dem zweiten Stuhl links vom Tisch (der Stuhl bleibt sichtbar) */
  const Y = 188.6, s = km(Y);
  const m = figur({ id: "aac_gast", geschlecht: "w", pose: "sitzen", blick: 70, frisur: "dutt", haarfarbe: "dunkelbraun", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "bluse", farbe: "#e9eef3" }, unterteil: { stueck: "rock_knie", farbe: "#2f5f95" }, schuhe: { stueck: "halbschuh", farbe: "braun" } } }, 1.66 * s);
  const sitzY = m.z.sitz.y * m.k;
  let k = stuhl(0, Y, true, 30);
  k += `<g transform="translate(0 ${r(-0.46 * s - sitzY)})">${m.svg}</g>`;
  S.teil({ id: "gast", de: "der Gast", syl: "GAST", it: "l'ospite", itSyl: "O-spi-te", en: "guest", x: 30, y: Y, kunst: k,
    tipp: "Im Café trinkt der Gast einen Kaffee und isst Printen dazu." });
}
{
  const s = km(TISCH.y), TH = 0.75 * s, R = 0.36 * s;
  let k = schlag(0, 0.4, 2 * R, TH, 0.6, TISCH.x);
  k += `<path d="M-3 0 L3 0 L.7 -2 L-.7 -2 Z" fill="#2c3236"/><rect x="-.55" y="${r(-TH)}" width="1.1" height="${r(TH - 1.6)}" fill="#3a4045"/>`;
  k += `<ellipse cx="0" cy="${r(-TH)}" rx="${r(R)}" ry="${r(R * 0.22)}" fill="#8b9298"/><ellipse cx="0" cy="${r(-TH - 0.5)}" rx="${r(R)}" ry="${r(R * 0.22)}" fill="${S.lg("marmor", [[0, "#f3f1ec"], [1, "#d6d2c8"]])}"/>`;
  const top = -TH - 0.5;
  /* Kaffeetasse mit Untertasse, Henkel aus Porzellan (nicht durchsichtig) */
  k += `<ellipse cx="-4.6" cy="${r(top + 0.6)}" rx="2.6" ry=".7" fill="#e8e6e0"/><path d="M-2.95 ${r(top - 1.7)} q1.6 .1 1.3 1.2 q-.35 .85 -1.45 .5" stroke="#f6f4ef" stroke-width=".55" fill="none"/><path d="M-2.95 ${r(top - 1.7)} q1.6 .1 1.3 1.2 q-.35 .85 -1.45 .5" stroke="#c9c5bc" stroke-width=".12" fill="none" transform="translate(.15 .1)"/>`;
  k += `<path d="M-6.4 ${r(top + 0.4)} L-6.2 ${r(top - 2.2)} L-3 ${r(top - 2.2)} L-2.8 ${r(top + 0.4)} Q-4.6 ${r(top + 1)} -6.4 ${r(top + 0.4)} Z" fill="${S.lg("tasse", [[0, "#ffffff"], [0.7, "#f1efea"], [1, "#d8d4cc"]], 0, 0, 1, 0)}"/><ellipse cx="-4.6" cy="${r(top - 2.2)}" rx="1.6" ry=".4" fill="#5c3b26"/>`;
  k += `<path d="M-4.8 ${r(top - 2.8)} q-.8 -1.2 0 -2.4 q.8 -1.2 0 -2.2" stroke="#fff" stroke-width=".35" opacity=".55" fill="none"/>`;
  /* Teller mit Aachener Printen: flache Schnitten (Höhe : Länge ≈ 1 : 10), Kandisstücke, eine mit Schokolade */
  k += `<ellipse cx="3.6" cy="${r(top + 0.5)}" rx="4.6" ry="1.1" fill="#f6f4ef" stroke="#d9d4c9" stroke-width=".2"/>`;
  const printe = (x, y, a, schoko) => {
    let g = `<g transform="rotate(${a} ${x} ${y})"><path d="M${r(x - 2.6)} ${r(y)} L${r(x + 2.6)} ${r(y)} L${r(x + 2.4)} ${r(y - 0.5)} L${r(x - 2.8)} ${r(y - 0.5)} Z" fill="${schoko ? "#3d2416" : S.lg("printe", [[0, "#9a5422"], [1, "#6b3612"]])}"/>`;
    g += `<path d="M${r(x - 2.8)} ${r(y - 0.5)} L${r(x + 2.4)} ${r(y - 0.5)} L${r(x + 2.1)} ${r(y - 0.85)} L${r(x - 3)} ${r(y - 0.85)} Z" fill="${schoko ? "#5a3826" : "#b26a32"}"/>`;
    if (!schoko) for (const t of [-2, -1, 0.2, 1.3]) g += `<rect x="${r(x + t)}" y="${r(y - 0.84)}" width=".38" height=".22" fill="#f1e2c0"/>`;
    else g += `<path d="M${r(x - 2.6)} ${r(y - 0.7)} l.6 -.12 l.6 .12 l.6 -.12 l.6 .12" stroke="#7a5236" stroke-width=".1" fill="none"/>`;
    return g + `</g>`;
  };
  k += printe(2.6, top + 0.35, -4, false) + printe(4.4, top - 0.25, 6, true) + printe(4.2, top + 0.9, -2, false);
  S.teil({ id: "tisch", de: "der Tisch", syl: "TISCH", it: "il tavolino", itSyl: "ta-vo-LI-no", en: "table", x: TISCH.x, y: TISCH.y, steht: true, kunst: k,
    zoom: { x: TISCH.x - 10.5, y: TISCH.y + top - 6, w: 21, h: 14 },
    unter: [
      { id: "printe", de: "die Printe", syl: "PRIN-te", it: "il biscotto Printe", itSyl: "bi-SCOT-to PRIN-te", en: "Aachen gingerbread", x: TISCH.x + 3.6, y: TISCH.y + top + 1, kunst: flaeche(-4.4, -2.8, 8.8, 3.8, 0.4),
        tipp: "Aachener Printen sind flache, harte und würzige Lebkuchen — mit Kandiszucker, manche mit Schokolade." },
      { id: "tasse", de: "die Tasse", syl: "TAS-se", it: "la tazza", itSyl: "TAZ-za", en: "cup", x: TISCH.x - 4.6, y: TISCH.y + top + 1, kunst: flaeche(-2.6, -3.6, 4.6, 4.2, 0.4),
        tipp: "Zu den Printen trinkt man gern einen Kaffee." },
    ] });
}

/* =====================================================================
   10 — DIE TAFEL (Kundenstopper) mit Öcher Platt
   ===================================================================== */
{
  const s = km(191), H = 1 * s, W = 0.62 * s;
  let k = schlag(0, 0.3, W, H, 0.55);
  k += `<path d="M${r(-W / 2 - 1)} 0 L${r(-W / 2 + 1.6)} ${r(-H)} L${r(W / 2 - 1.6)} ${r(-H)} L${r(W / 2 + 1)} 0" stroke="#5b3a1f" stroke-width="1.2" fill="none"/>`;
  k += `<path d="M${r(-W / 2 + 0.2)} -3 L${r(-W / 2 + 1.9)} ${r(-H + 2)} L${r(W / 2 - 1.9)} ${r(-H + 2)} L${r(W / 2 - 0.2)} -3 Z" fill="${S.lg("tafel", [[0, "#2e3a33"], [1, "#212a25"]])}"/>`;
  const t = (y, f, txt, c = "#f4f0e6", w = "normal") => `<text x="0" y="${r(y)}" font-size="${f}" text-anchor="middle" fill="${c}" font-family="'Comic Sans MS','Segoe Print',cursive" font-weight="${w}">${txt}</text>`;
  k += t(-H + 6.6, 2.9, "Willkommen!", "#f6e7a1", "bold");
  k += t(-H + 11, 2.5, "Öcher Printen");
  k += t(-H + 14.2, 2.5, "+ Kaffee 3,90");
  k += t(-H + 18.6, 2.9, "Oche Alaaf!", "#ffb8a8", "bold");
  k += `<path d="M${r(-W / 2 + 3)} ${r(-H + 7.8)} L${r(W / 2 - 3)} ${r(-H + 7.8)}" stroke="#f6e7a1" stroke-width=".3" stroke-dasharray="1 .7"/>`;
  S.teil({ id: "tafel", de: "die Tafel", syl: "TA-fel", it: "la lavagna", itSyl: "la-VA-gna", en: "chalkboard", x: 98, y: 191, steht: true, kunst: k,
    tipp: "Auf der Tafel steht Öcher Platt, die Mundart von Aachen: „Oche“ heißt Aachen, „Öcher“ heißt Aachener. „Alaaf!“ ruft man im Karneval." });
}

/* =====================================================================
   11 — DIE TOURISTIN (von hinten): Rucksack mit Trägern, Handy zum Rathaus
   ===================================================================== */
{
  const Y = 180, s = km(Y);
  const handy = { lende: 1, brust: -2, nacken: -4, kopf: -8, schulterL: { vor: 3, seit: 7 }, ellbogenL: 14, unterarmL: 10, handL: 6, fingerL: 0.38,
    schulterR: { vor: 96, seit: 12, dreh: 0 }, ellbogenR: 52, unterarmR: 0, handR: 24, fingerR: 0.5,
    huefteL: { vor: 3, seit: 3, dreh: -6 }, knieL: 3, fussL: 0, huefteR: { vor: -3, seit: 2.5, dreh: -6 }, knieR: 2, fussR: 0 };
  const m = figur({ id: "aac_tour", geschlecht: "w", pose: handy, blick: 186, frisur: "lang", haarfarbe: "braun", haut: "hell",
    kleidung: { oberteil: { stueck: "pullover", farbe: "creme" }, unterteil: { stueck: "jeans" }, jacke: { stueck: "jacke", farbe: "#c9662f" }, schuhe: { stueck: "turnschuh" } } }, 1.66 * s);
  const H = 1.66 * s;
  /* Rucksack mit Volumen (Seitenfläche), Deckel, Trägern über den Schultern */
  let rs = `<path d="M${r(-0.105 * H)} ${r(-0.78 * H)} L${r(0.1 * H)} ${r(-0.78 * H)} Q${r(0.12 * H)} ${r(-0.68 * H)} ${r(0.1 * H)} ${r(-0.55 * H)} L${r(-0.1 * H)} ${r(-0.55 * H)} Q${r(-0.12 * H)} ${r(-0.68 * H)} ${r(-0.105 * H)} ${r(-0.78 * H)} Z" fill="${S.lg("ruck", [[0, "#1f4a2b"], [0.5, "#2f6a3e"], [1, "#24502f"]], 0, 0, 1, 0)}"/>`;
  rs += `<path d="M${r(0.1 * H)} ${r(-0.77 * H)} L${r(0.135 * H)} ${r(-0.75 * H)} L${r(0.13 * H)} ${r(-0.57 * H)} L${r(0.1 * H)} ${r(-0.555 * H)} Z" fill="#18381f"/>`;
  rs += `<path d="M${r(-0.105 * H)} ${r(-0.78 * H)} Q0 ${r(-0.81 * H)} ${r(0.1 * H)} ${r(-0.78 * H)} L${r(0.09 * H)} ${r(-0.72 * H)} Q0 ${r(-0.74 * H)} ${r(-0.095 * H)} ${r(-0.72 * H)} Z" fill="#3a7a4a"/>`;
  rs += `<rect x="${r(-0.07 * H)}" y="${r(-0.66 * H)}" width="${r(0.14 * H)}" height="${r(0.07 * H)}" rx=".3" fill="#24502f" stroke="#18381f" stroke-width=".2"/>`;
  rs += `<path d="M${r(-0.08 * H)} ${r(-0.79 * H)} Q${r(-0.11 * H)} ${r(-0.84 * H)} ${r(-0.13 * H)} ${r(-0.82 * H)} M${r(0.08 * H)} ${r(-0.79 * H)} Q${r(0.11 * H)} ${r(-0.84 * H)} ${r(0.13 * H)} ${r(-0.82 * H)}" stroke="#18381f" stroke-width=".7" fill="none"/>`;
  /* Handy in der erhobenen Hand, Bildschirm zeigt das Rathaus */
  const hand = m.z.handR.y < m.z.handL.y ? m.z.handR : m.z.handL, hx = hand.x * m.k, hy = hand.y * m.k;
  const ph = `<g transform="translate(${r(hx)} ${r(hy - 1.6)})"><rect x="-1.1" y="-1.9" width="2.2" height="3.6" rx=".35" fill="#1d1f22"/><rect x="-.9" y="-1.65" width="1.8" height="3.1" fill="#8fb3d6"/><rect x="-.7" y="-.2" width="1.4" height="1" fill="#c9bfa5"/><path d="M-.7 -.2 L0 -.9 L.7 -.2" fill="#4a545e"/></g>`;
  S.teil({ id: "touristin", de: "die Touristin", syl: "tou-RIS-tin", it: "la turista", itSyl: "tu-RI-sta", en: "tourist", x: 140, y: Y,
    kunst: schlag(0, 0.3, 6, H, 0.75) + m.svg + rs + ph, tipp: "Die Touristin fotografiert das Rathaus. Viele Touristen kommen nach Aachen, um den Dom und das Rathaus zu sehen." });
}

/* =====================================================================
   12 — DIE LATERNE, DAS FAHRRAD (lehnt an der Laterne) und DER WEGWEISER (rechts vorn)
   ===================================================================== */
const LAT = { x: 248, y: 170 };
{
  const s = km(LAT.y), H = 4.2 * s;
  let k = schlag(0, 0.3, 3, H, 0.55, LAT.x);
  k += `<path d="M-2 0 L-1.4 -5 L1.4 -5 L2 0 Z" fill="#23292c"/><rect x="-.6" y="${r(-H + 9)}" width="1.2" height="${r(H - 14)}" fill="${S.lg("lmast", [[0, "#1f2427"], [0.5, "#4d565b"], [1, "#9aa3a8"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-1.2" y="${r(-H + 8.4)}" width="2.4" height="1.2" fill="#23292c"/>`;
  k += `<path d="M-2.4 ${r(-H + 8.4)} L-3.4 ${r(-H + 2)} L3.4 ${r(-H + 2)} L2.4 ${r(-H + 8.4)} Z" fill="${S.lg("lglas", [[0, "#fff4d0"], [1, "#e6cf94"]])}" stroke="#23292c" stroke-width=".4"/>`;
  k += `<line x1="0" y1="${r(-H + 2)}" x2="0" y2="${r(-H + 8.4)}" stroke="#23292c" stroke-width=".3"/>`;
  k += `<path d="M-4.2 ${r(-H + 2)} L4.2 ${r(-H + 2)} L1.2 ${r(-H - 1.2)} L-1.2 ${r(-H - 1.2)} Z" fill="#23292c"/><circle cx="0" cy="${r(-H - 1.8)}" r=".8" fill="#23292c"/>`;
  S.teil({ id: "laterne", de: "die Laterne", syl: "la-TER-ne", it: "il lampione", itSyl: "lam-PIO-ne", en: "street lamp", x: LAT.x, y: LAT.y, steht: true, kunst: k });
}
{
  /* DAS FAHRRAD — lehnt mit dem Lenker an der Laterne */
  const Y = 171, s = km(Y), R = 0.34 * s;
  let k = schlag(0, 0.4, 30, 1.0 * s, 0.5);
  const ra = (cx) => `<circle cx="${r(cx)}" cy="${r(-R)}" r="${r(R)}" fill="none" stroke="#22262a" stroke-width="1.1"/><circle cx="${r(cx)}" cy="${r(-R)}" r="${r(R - 0.9)}" fill="none" stroke="#a9b0b5" stroke-width=".25"/>` + [...Array(12)].map((_, i) => { const a = i * Math.PI / 6; return `<line x1="${r(cx)}" y1="${r(-R)}" x2="${r(cx + Math.cos(a) * (R - 1))}" y2="${r(-R + Math.sin(a) * (R - 1))}" stroke="#b7bec3" stroke-width=".12"/>`; }).join("") + `<circle cx="${r(cx)}" cy="${r(-R)}" r=".7" fill="#7f878d"/>`;
  const hx = -0.55 * s, vx = 0.5 * s;
  k += ra(hx) + ra(vx);
  const T = { x: -0.12 * s, y: -R - 0.36 * s }, L = { x: 0.36 * s, y: -R - 0.42 * s }, P = { x: -0.06 * s, y: -R };
  const FR = S.lg("rahmen", [[0, "#1f5f8a"], [1, "#2f86b8"]]);
  k += `<path d="M${r(hx)} ${r(-R)} L${r(P.x)} ${r(P.y)} L${r(L.x - 1)} ${r(L.y + 2)} M${r(hx)} ${r(-R)} L${r(T.x)} ${r(T.y)} L${r(P.x)} ${r(P.y)} M${r(T.x)} ${r(T.y)} L${r(L.x - 1)} ${r(L.y + 1)} L${r(vx)} ${r(-R)}" stroke="${FR}" stroke-width=".9" fill="none" stroke-linejoin="round"/>`;
  k += `<path d="M${r(T.x - 0.6)} ${r(T.y - 2.6)} L${r(T.x)} ${r(T.y)}" stroke="#22262a" stroke-width=".7"/><path d="M${r(T.x - 3)} ${r(T.y - 2.8)} Q${r(T.x)} ${r(T.y - 3.6)} ${r(T.x + 1.8)} ${r(T.y - 2.6)} L${r(T.x - 2.6)} ${r(T.y - 2.2)} Z" fill="#2a2420"/>`;
  k += `<path d="M${r(L.x - 1)} ${r(L.y + 1)} L${r(L.x)} ${r(L.y - 2.4)} Q${r(L.x + 2.6)} ${r(L.y - 3.4)} ${r(L.x + 3.4)} ${r(L.y - 1.8)}" stroke="#30363a" stroke-width=".7" fill="none"/>`;
  k += `<path d="M${r(hx - R * 0.9)} ${r(-R * 1.55)} Q${r(hx)} ${r(-R * 2.15)} ${r(hx + R * 0.95)} ${r(-R * 1.5)}" stroke="#30363a" stroke-width=".6" fill="none"/><path d="M${r(hx - R * 0.8)} ${r(-R * 1.95)} L${r(T.x - 1)} ${r(-R * 1.95)}" stroke="#30363a" stroke-width=".6"/>`;
  k += `<path d="M${r(vx - R * 0.9)} ${r(-R * 1.5)} Q${r(vx)} ${r(-R * 2.1)} ${r(vx + R * 0.9)} ${r(-R * 1.55)}" stroke="#30363a" stroke-width=".6" fill="none"/>`;
  k += `<path d="M${r(P.x)} ${r(P.y)} L${r(P.x - 2.4)} 0" stroke="#4a5055" stroke-width=".45"/>`;
  k += `<circle cx="${r(P.x)}" cy="${r(P.y)}" r="1.3" fill="none" stroke="#5a6166" stroke-width=".4"/><path d="M${r(P.x)} ${r(P.y)} L${r(P.x + 1.6)} ${r(P.y + 1.4)}" stroke="#5a6166" stroke-width=".4"/>`;
  const lenkerX = LAT.x - (vx + 3.4);
  S.teil({ id: "fahrrad", de: "das Fahrrad", syl: "FAHR-rad", it: "la bicicletta", itSyl: "bi-ci-CLET-ta", en: "bicycle", x: r(lenkerX + 0.4), y: Y, steht: true, kunst: k,
    tipp: "In Aachen studieren sehr viele junge Leute — viele fahren mit dem Fahrrad." });
}
{
  const Y = 194, s = km(Y), H = 2.6 * s;
  let k = schlag(0, 0.3, 2, H, 0.6);
  k += `<rect x="-.9" y="${r(-H)}" width="1.8" height="${r(H)}" fill="${S.lg("pfosten", [[0, "#3b3f43"], [0.5, "#80878d"], [1, "#b9c0c5"]], 0, 0, 1, 0)}"/><circle cx="0" cy="${r(-H - 0.5)}" r="1.1" fill="#3b3f43"/>`;
  const schild = (y, links, text, unter, flaggen) => {
    const w = 22.5, h = 5.4, x0 = links ? -w + 0.6 : -0.6;
    const pfad = links ? `M${r(x0)} ${r(y + h / 2)} L${r(x0 + 2.8)} ${r(y)} L${r(x0 + w)} ${r(y)} L${r(x0 + w)} ${r(y + h)} L${r(x0 + 2.8)} ${r(y + h)} Z` : `M${r(x0)} ${r(y)} L${r(x0 + w - 2.8)} ${r(y)} L${r(x0 + w)} ${r(y + h / 2)} L${r(x0 + w - 2.8)} ${r(y + h)} L${r(x0)} ${r(y + h)} Z`;
    let g = `<path d="${pfad}" fill="#f4efe2" stroke="#7a2a28" stroke-width=".45"/>`;
    const tx = x0 + w / 2 + (links ? 1.4 : -1.4) + (flaggen ? 3 : 0);
    g += `<text x="${r(tx)}" y="${r(y + 2.75)}" font-size="${flaggen ? 1.95 : 2.2}" text-anchor="middle" fill="#3a2a1c" font-family="Georgia,serif" font-weight="bold">${text}</text>`;
    g += `<text x="${r(tx)}" y="${r(y + 4.7)}" font-size="1.75" text-anchor="middle" fill="#5b4a34" font-family="Arial,sans-serif">${unter}</text>`;
    if (flaggen) {
      const fxx = x0 + 1, fyy = y + 0.8;
      g += `<rect x="${r(fxx)}" y="${r(fyy)}" width="1.8" height=".42" fill="#1d1d1d"/><rect x="${r(fxx)}" y="${r(fyy + 0.42)}" width="1.8" height=".42" fill="#dd2a24"/><rect x="${r(fxx)}" y="${r(fyy + 0.84)}" width="1.8" height=".42" fill="#f2c62f"/>`;
      g += `<rect x="${r(fxx + 2)}" y="${r(fyy + 1.6)}" width="1.8" height=".42" fill="#ae1c28"/><rect x="${r(fxx + 2)}" y="${r(fyy + 2.02)}" width="1.8" height=".42" fill="#fff" stroke="#ddd" stroke-width=".05"/><rect x="${r(fxx + 2)}" y="${r(fyy + 2.44)}" width="1.8" height=".42" fill="#21468b"/>`;
      g += `<rect x="${r(fxx)}" y="${r(fyy + 3.1)}" width=".6" height="1.26" fill="#1d1d1d"/><rect x="${r(fxx + 0.6)}" y="${r(fyy + 3.1)}" width=".6" height="1.26" fill="#f2c62f"/><rect x="${r(fxx + 1.2)}" y="${r(fyy + 3.1)}" width=".6" height="1.26" fill="#dd2a24"/>`;
    }
    return g;
  };
  k += schild(-H + 1.2, true, "Elisenbrunnen", "Thermalwasser · 250 m");
  k += schild(-H + 7.2, true, "Dom", "Katschhof · 150 m");
  k += schild(-H + 13.2, true, "Puppenbrunnen", "Krämerstraße · 200 m");
  k += schild(-H + 19.2, false, "Dreiländereck", "Vaalserberg · 6 km", true);
  S.teil({ id: "wegweiser", de: "der Wegweiser", syl: "WEG-wei-ser", it: "il cartello indicatore", itSyl: "car-TEL-lo in-di-ca-TO-re", en: "signpost",
    x: 294, y: Y, steht: true, kunst: k,
    tipp: "Am Dreiländereck treffen sich Deutschland, die Niederlande und Belgien. Am Elisenbrunnen kommt warmes Wasser aus der Erde — es riecht nach Schwefel." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/aachen.js"));
console.log(aus);
