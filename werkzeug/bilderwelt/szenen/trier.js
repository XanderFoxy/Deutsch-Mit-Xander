#!/usr/bin/env node
/* =====================================================================
   TRIER (FASSUNG 854) — Bilderwelt neu: eine echte Stadtansicht
   ---------------------------------------------------------------------
   XANDER (03.10.): „die bekannten Sehenswürdigkeiten … mit Recherche zu
   den einzelnen Städten in Deutschland … auf Hollywood-Niveau“.

   RECHERCHE (Trier Tourismus und Marketing, KuLaDig „Porta Nigra“,
   katholisch.de „Die Porta Nigra wird 1.850 Jahre alt“, Stadtmuseum
   Simeonstift „Ansicht der Porta Nigra“, steine-und-minerale.de,
   trierer-original.de, Park Plaza „Fakten über die Porta Nigra“):
   - STANDORT: der Vorplatz auf der STADTSEITE (Süden) am Ende der
     Simeonstraße, etwa 78 m vor dem Tor, Blick nach Norden. Links (Westen)
     die Eckhäuser der Simeonstraße mit Cafés, rechts (Osten) das
     Stadtmuseum Simeonstift. Nachmittag: die Sonne steht im Südwesten
     hinter uns links; Schatten fallen nach rechts hinten.
   - PORTA NIGRA (um 170 n. Chr., UNESCO-Welterbe seit 1986): Doppeltor
     mit zwei Durchfahrten in einem dreigeschossigen Mittelbau, an jeder
     Seite ein Turm. Auf der Feldseite (Norden) springen die Türme fast
     halbrund vor, auf der Stadtseite bilden sie flache Risalite. Das
     Erdgeschoss ist auf der Stadtseite mit Halbsäulen gegliedert, die
     Obergeschosse sind etwas niedriger und haben regelmäßige Reihen von
     Bogenfenstern, gerahmt von Pilastern/Halbsäulen und Gesimsen. Der
     WESTTURM hat vier Geschosse (≈ 30 m), der OSTTURM nur drei (≈ 23 m):
     als das Tor im Mittelalter zur Simeonskirche wurde, riss man ein
     Geschoss des Ostturms ab; an ihn baute Erzbischof Albero um 1150 den
     Ostchor an — die halbrunde APSIS ist bis heute erhalten. Breite 36 m.
     Grauer Sandstein in tonnenschweren Quadern, nur mit Eisenklammern
     verbunden, ohne Mörtel; die Löcher, die Metalldiebe beim Ausbrechen
     der Klammern hinterließen, sieht man noch. Der Stein ist mit der Zeit
     schwarz geworden — daher der Name „schwarzes Tor“ (seit dem
     Mittelalter).
   - TYPISCH: Erlebnisführungen mit Darstellern in römischer Kleidung (ein
     Zenturio mit querstehendem Helmkamm, Kettenhemd, Schwert links und
     Rebstock) beginnen an der Porta Nigra; Moselwein (Riesling) im
     „Römer“-Glas mit grünem Stiel; Viez (Trierer Apfelwein) im weißen
     Porzellanbecher, der Viezporz; Touristen, Tauben, Radfahrer.
   UNSICHER (ohne Foto-Beleg, aus Fachwissen): die genaue Zahl der
   Fensterachsen je Geschoss (hier Türme je 3, Mittelbau 4), die genaue
   Höhe und Dachform der Apsis, das Aussehen des Museumsbaus.
   Maßstab: Augenhöhe y = 200 (1,7 m), Brennweite 480 Einheiten,
   Bildmitte x = 200. Am Boden gilt: Einheiten je Meter = (y − 200) / 1,7.
   Das Tor (78 m) hat 6,15 Einheiten je Meter, Fuß bei y = 210,5.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "trier", titel: "Trier", emoji: "🏺", thema: "Deutschland", kuerzel: "trr", fassung: 854, breite: 400, hoehe: 260 });
const rnd = zufall(170);
const r = B.r;
const W = 400, HH = 260, HOR = 200, F = 480, AUGE = 1.7;
const km = (y) => (y - HOR) / AUGE;
const proj = (lat, d, h = 0) => [r(200 + lat * F / d), r(HOR + (AUGE - h) * F / d)];

S.def(`<filter color-interpolation-filters="sRGB" id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter color-interpolation-filters="sRGB" id="${S.id("wolke")}" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation=".8"/></filter>`);
S.def(`<filter color-interpolation-filters="sRGB" id="${S.id("dunst")}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation=".35"/></filter>`);
S.def(`<filter color-interpolation-filters="sRGB" id="${S.id("laub")}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation=".25"/></filter>`);
/* Licht von links (Sonne im Südwesten): warme Lichtkante links, weicher Eigenschatten rechts */
S.def(`<filter color-interpolation-filters="sRGB" id="${S.id("licht")}" x="-10%" y="-5%" width="120%" height="110%"><feOffset in="SourceAlpha" dx=".22" result="o"/><feComposite in="SourceAlpha" in2="o" operator="out" result="rk"/><feFlood flood-color="#ffe2b0" flood-opacity=".9"/><feComposite in2="rk" operator="in" result="kante"/><feOffset in="SourceAlpha" dx="-.7" result="o2"/><feComposite in="SourceAlpha" in2="o2" operator="out" result="lk"/><feGaussianBlur in="lk" stdDeviation=".25" result="lk2"/><feFlood flood-color="#1f1a24" flood-opacity=".3"/><feComposite in2="lk2" operator="in" result="eigen"/><feComposite in="eigen" in2="SourceAlpha" operator="in" result="eigen2"/><feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="eigen2"/><feMergeNode in="kante"/></feMerge></filter>`);
const licht = (svg) => `<g filter="url(#${S.id("licht")})">${svg}</g>`;

/* Stoffe */
const STEIN = S.lg("stein", [[0, "#5d5852"], [0.5, "#4a4641"], [1, "#3a3733"]], 0, 0, 1, 0);
const STEIN_H = S.lg("steinh", [[0, "#6e675d"], [1, "#58534b"]]);
const GOLD = S.lg("gold", [[0, "#fff1b0"], [0.45, "#f0c64a"], [1, "#a8781a"]], 0, 0, 1, 1);
const DUNKEL = "#141210";
const LANG = "#2b2620";

/* Schlagschatten: Sonne hinten links (SW), Höhe ≈ 38° — Schatten fallen vom Betrachter weg nach rechts. */
const SCHATTEN = [];
const schlag = (lat, d, hoeheM, breiteM = 0.5, a = 0.4) => {
  const L = 1.3 * hoeheM, dl = Math.sin(35 * Math.PI / 180) * L, dd = Math.cos(35 * Math.PI / 180) * L;
  const [x1, y1] = proj(lat - breiteM / 2, d), [x2, y2] = proj(lat + breiteM / 2, d);
  const [x3, y3] = proj(lat + dl + breiteM * 0.3, d + dd), [x4, y4] = proj(lat + dl - breiteM * 0.3, d + dd);
  SCHATTEN.push(`<path d="M${x1} ${y1} L${x2} ${y2} L${x3} ${y3} L${x4} ${y4} Z" fill="${LANG}" opacity="${a}" filter="url(#${S.id("dunst")})"/>`);
};

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
  return { svg: `<g transform="scale(${m.k.toFixed(4)})">${z}</g>`, inner: z, k: m.k, z: m.z };
}
/* kleine Figur in der Ferne */
function passant(x, y, h, o = {}) {
  const { hemd = "#3d5a80", hose = "#2f3640", haar = "#4a3426", haut = "#e3b796", schritt = 0.1, rueck = false } = o;
  const X = (f) => r(x + f * h), Y = (f) => r(y - f * h);
  let g = `<path d="M${X(-0.05)} ${Y(0.5)} L${X(-0.06 - schritt)} ${Y(0.02)} L${X(-0.01 - schritt)} ${Y(0.02)} L${X(0)} ${Y(0.4)} L${X(0.01 + schritt)} ${Y(0.02)} L${X(0.06 + schritt)} ${Y(0.02)} L${X(0.05)} ${Y(0.5)} Z" fill="${hose}"/>`;
  g += `<path d="M${X(-0.11)} ${Y(0.82)} Q${X(-0.12)} ${Y(0.6)} ${X(-0.09)} ${Y(0.48)} L${X(0.09)} ${Y(0.48)} Q${X(0.12)} ${Y(0.6)} ${X(0.11)} ${Y(0.82)} Q${X(0)} ${Y(0.85)} ${X(-0.11)} ${Y(0.82)} Z" fill="${hemd}"/>`;
  g += `<path d="M${X(-0.03)} ${Y(0.82)} Q${X(-0.12)} ${Y(0.6)} ${X(-0.09)} ${Y(0.48)} L${X(-0.05)} ${Y(0.48)} Q${X(-0.08)} ${Y(0.64)} ${X(-0.03)} ${Y(0.82)} Z" fill="#ffe2b0" opacity=".3"/>`;
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
  w += `<ellipse cx="${x}" cy="${r(y + 2 * s)}" rx="${r(20 * s)}" ry="${r(3 * s)}" fill="#d6d3db"/>`;
  for (const [dx, dy, rr] of puffs) w += `<circle cx="${r(x + dx)}" cy="${r(y + dy)}" r="${r(rr)}" fill="#f2f1f2"/>`;
  for (const [dx, dy, rr] of puffs) w += `<circle cx="${r(x + dx - rr * 0.22)}" cy="${r(y + dy - rr * 0.25)}" r="${r(rr * 0.7)}" fill="#ffffff"/>`;
  w += `<ellipse cx="${x}" cy="${r(y + 2.4 * s)}" rx="${r(17 * s)}" ry="${r(1.8 * s)}" fill="#c9c6d0" opacity=".8"/></g>`;
  return w;
}
function baum(x, y, h, seed) {
  const z = zufall(seed);
  const kr = h * 0.36;
  let g = `<path d="M${r(x - h * 0.03)} ${y} L${r(x - h * 0.012)} ${r(y - h * 0.5)} L${r(x + h * 0.012)} ${r(y - h * 0.5)} L${r(x + h * 0.025)} ${y} Z" fill="#8a8170"/>`;
  g += `<path d="M${r(x - h * 0.02)} ${r(y - h * 0.2)} q${r(h * 0.01)} ${r(-h * 0.03)} ${r(h * 0.025)} ${r(-h * 0.02)}" stroke="#c9c1ac" stroke-width=".6" fill="none"/>`;
  const c = [];
  for (let i = 0; i < 26; i++) { const a = z() * Math.PI * 2, rr = Math.sqrt(z()) * kr; c.push([x + Math.cos(a) * rr * 1.1, y - h * 0.62 + Math.sin(a) * rr * 0.9, kr * (0.28 + z() * 0.2)]); }
  c.sort((a, b) => a[1] - b[1]);
  g += `<g filter="url(#${S.id("laub")})">`;
  for (const [a, b, rr] of c) g += `<circle cx="${r(a)}" cy="${r(b)}" r="${r(rr)}" fill="#33502a"/>`;
  for (const [a, b, rr] of c) g += `<circle cx="${r(a - rr * 0.22)}" cy="${r(b - rr * 0.2)}" r="${r(rr * 0.72)}" fill="#4a6c32"/>`;
  for (const [a, b, rr] of c) if (a < x + kr * 0.3) g += `<circle cx="${r(a - rr * 0.38)}" cy="${r(b - rr * 0.36)}" r="${r(rr * 0.4)}" fill="#8fae56" opacity=".85"/>`;
  g += `</g>`;
  return g;
}

/* =====================================================================
   KULISSE — Nachmittagshimmel, Häuser jenseits des Tores im Dunst
   ===================================================================== */
S.hinten(`<rect width="${W}" height="${HOR + 6}" fill="${S.lg("himmel", [[0, "#4f86c6"], [0.5, "#8ab3dc"], [0.85, "#cfdbe4"], [1, "#efe4d0"]])}"/>`);
S.hinten(`<circle cx="-30" cy="120" r="170" fill="${S.rg("sonne", [[0, "#fff0c8", 0.55], [0.4, "#ffe2a8", 0.2], [1, "#ffe2a8", 0]])}"/>`);
S.hinten(wolke(60, 30, 0.9, 5) + wolke(300, 22, 1.1, 21) + wolke(372, 72, 0.6, 33) + wolke(196, 16, 0.5, 45));
{
  /* jenseits des Tores (Porta-Nigra-Platz, Theodor-Heuss-Allee): Häuser und Bäume im Dunst */
  let c = "";
  let x = 60;
  while (x < 340) { const w2 = 8 + rnd() * 9, h = 14 + rnd() * 12; c += `<rect x="${r(x)}" y="${r(HOR + 3 - h)}" width="${r(w2)}" height="${r(h)}" fill="${rnd() < 0.5 ? "#d9d1c4" : "#cfc6b6"}"/><path d="M${r(x)} ${r(HOR + 3 - h)} h${r(w2)} l-1 -3 h${r(-w2 + 2)} Z" fill="#8a7f78"/>`; x += w2 + 0.6; }
  S.hinten(`<g opacity=".7">${c}</g><rect x="0" y="${HOR - 40}" width="${W}" height="46" fill="${S.lg("dunstband", [[0, "#e6e0d6", 0], [1, "#e6e0d6", 0.6]])}"/>`);
}

/* =====================================================================
   0 — DAS PFLASTER (Vorplatz, helle Granitplatten in Fluchtperspektive)
   ===================================================================== */
let PFLASTER_TEIL;
{
  let f = `<rect x="0" y="${HOR}" width="${W}" height="${HH - HOR}" fill="${S.lg("pfl", [[0, "#a9a39a"], [0.4, "#b8b2a8"], [1, "#c6bfb3"]])}"/>`;
  /* Querfugen: Platten 1,2 m tief */
  let q = "";
  for (let d = 80; d > 13; d -= (d > 40 ? 2.4 : 1.2)) { const y = r(HOR + AUGE * F / d); if (y > HH) break; q += `M0 ${y} H${W} `; }
  f += `<path d="${q}" stroke="#8e887e" stroke-width=".3" opacity=".7"/>`;
  /* Längsfugen zum Fluchtpunkt (Platten 0,8 m breit), Läufer versetzt nur angedeutet */
  let l = "";
  for (let lat = -30; lat <= 30; lat += 0.8) { const [x1, y1] = proj(lat, 80), [x2, y2] = proj(lat, 13.6); if (x2 < -40 || x2 > 440) continue; l += `M${x1} ${y1} L${x2} ${y2} `; }
  f += `<path d="${l}" stroke="#8e887e" stroke-width=".25" opacity=".45"/>`;
  /* Mittelstreifen aus dunklem Basalt (Rinne) und einzelne Flecken */
  const [m1x, m1y] = proj(-0.4, 78), [m2x] = proj(0.4, 78), [m3x, m3y] = proj(0.4, 13.6), [m4x] = proj(-0.4, 13.6);
  f += `<path d="M${m1x} ${m1y} L${m4x} ${m3y}" stroke="#6b665e" stroke-width=".6" opacity=".5"/>`;
  for (let i = 0; i < 60; i++) { const y = HOR + 4 + Math.pow(rnd(), 0.7) * (HH - HOR - 4), x = rnd() * W, s = km(y) * 0.08; f += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(s * 2)}" ry="${r(s * 0.6)}" fill="#7a746b" opacity=".2"/>`; }
  f += `<rect x="0" y="${HOR}" width="${W}" height="${HH - HOR}" fill="${S.lg("pfllicht", [[0, "#ffe2b0", 0.16], [0.5, "#000", 0], [1, "#000", 0.12]], 0, 0, 1, 0)}"/>`;
  PFLASTER_TEIL = S.teil({ id: "pflaster", de: "das Pflaster", syl: "PFLAS-ter", it: "il lastricato", itSyl: "la-stri-CA-to", en: "paving", x: 0, y: 0, kunst: f });
}

/* =====================================================================
   1 — DIE BÄUME (westlich des Tores, links hinten)
   ===================================================================== */
{
  let k = "";
  for (const [lat, d, h, s] of [[-26, 96, 16, 3], [-21, 104, 17, 9], [27, 110, 15, 15]]) { const [x, y] = proj(lat, d); k += baum(x, y, h * F / d, s); }
  S.teil({ id: "baum", de: "der Baum", syl: "BAUM", it: "l'albero", itSyl: "AL-be-ro", en: "tree", x: 0, y: 0, kunst: k });
}

/* =====================================================================
   2 — DAS MUSEUM (Stadtmuseum Simeonstift, rechts neben dem Tor)
   ===================================================================== */
{
  const d = 76, K = F / d, [x0, y0] = proj(20.6, d), w = 22 * K, h = 13 * K;
  let k = `<rect x="${x0}" y="${r(y0 - h)}" width="${r(w)}" height="${r(h)}" fill="${S.lg("mus", [[0, "#e8dcc3"], [1, "#cdbf9f"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${x0}" y="${r(y0 - h)}" width="${r(w)}" height="2" fill="#a59878"/>`;
  /* zwei Fensterbänder, unten der Eingang mit Glas */
  for (let j = 0; j < 2; j++) for (let i = 0; i < 6; i++) k += `<rect x="${r(x0 + 4 + i * 3.4 * K * 0.5)}" y="${r(y0 - h + 6 + j * 3.6 * K)}" width="${r(1.2 * K)}" height="${r(2.0 * K)}" fill="${S.lg("musglas", [[0, "#7f97a8"], [1, "#4a5e6c"]])}"/>`;
  k += `<rect x="${r(x0 + 2)}" y="${r(y0 - 3.4 * K)}" width="${r(5 * K)}" height="${r(3.4 * K)}" fill="#3e4c56"/><rect x="${r(x0 + 2)}" y="${r(y0 - 3.4 * K)}" width="${r(5 * K)}" height="${r(0.4 * K)}" fill="#8a7d62"/>`;
  /* Fahnen-Banner des Museums */
  k += `<rect x="${r(x0 + w * 0.3)}" y="${r(y0 - h + 4)}" width="${r(2.2 * K)}" height="${r(8 * K)}" fill="#8a1f2b"/>`;
  k += `<text transform="translate(${r(x0 + w * 0.3 + 1.1 * K + 1)} ${r(y0 - h + 6)}) rotate(90)" font-size="3.4" fill="#f4ecd8" font-family="Arial,sans-serif" font-weight="bold">STADTMUSEUM</text>`;
  k += `<text transform="translate(${r(x0 + w * 0.3 + 1.1 * K - 3)} ${r(y0 - h + 6)}) rotate(90)" font-size="3" fill="#f4ecd8" font-family="Arial,sans-serif">Simeonstift Trier</text>`;
  k += `<rect x="${x0}" y="${r(y0 - h)}" width="${r(w)}" height="${r(h)}" fill="${S.lg("muslicht", [[0, "#000", 0.12], [1, "#000", 0]], 0, 0, 1, 0)}"/>`;
  S.teil({ id: "museum", de: "das Museum", syl: "mu-SE-um", it: "il museo", itSyl: "mu-SE-o", en: "museum", x: 0, y: 0, kunst: licht(k),
    tipp: "Im Stadtmuseum Simeonstift lernt man die Geschichte von Trier kennen." });
}

/* =====================================================================
   3 — DIE APSIS (romanischer Ostchor, um 1150, am Ostturm)
   ===================================================================== */
{
  const d = 80, K = F / d, [xs, ys] = proj(15.4, d);
  const R = 5.4, hw = 13.5, hk = 4.6;
  let k = "";
  /* Halbzylinder von der Seite (Achse senkrecht): wir sehen seine gerundete
     Südseite — links im Licht, nach rechts (Osten) dreht sie sich in den Schatten */
  const x0 = xs, x1 = r(xs + R * K), y1 = r(ys - hw * K);
  const bog = (y) => `M${x0} ${y} Q${r((x0 + x1) / 2)} ${r(y - 1.2)} ${x1} ${r(y + 0.6)}`;
  k += `<path d="M${x0} ${ys} V${y1} Q${r((x0 + x1) / 2)} ${r(y1 - 1.2)} ${x1} ${r(y1 + 0.6)} V${ys} Z" fill="${S.lg("apsis", [[0, "#8a8275"], [0.45, "#6b655b"], [0.8, "#4a453f"], [1, "#2e2b27"]], 0, 0, 1, 0)}"/>`;
  /* Lisenen, Sockel, Gesims mit Rundbogenfries */
  for (const t of [0.12, 0.5, 0.86]) k += `<path d="M${r(x0 + t * (x1 - x0))} ${ys} V${r(y1 + 1.5)}" stroke="${t < 0.6 ? "#9a9284" : "#3a3631"}" stroke-width="${r(0.6 * (1 - t) + 0.3)}"/>`;
  k += `<path d="${bog(r(ys - 1.4 * K))}" stroke="#9a9284" stroke-width="1" fill="none"/>`;
  k += `<path d="${bog(r(y1 + 2))}" stroke="#a39b8c" stroke-width="1.2" fill="none"/>`;
  for (let i = 0; i < 7; i++) { const t0 = i / 7, t1 = (i + 1) / 7, xa = x0 + (x1 - x0) * (1 - Math.cos(t0 * Math.PI / 2)), xb = x0 + (x1 - x0) * (1 - Math.cos(t1 * Math.PI / 2)); k += `<path d="M${r(xa)} ${r(y1 + 3.6 + t0)} Q${r((xa + xb) / 2)} ${r(y1 + 2.2 + t0)} ${r(xb)} ${r(y1 + 3.6 + t1)}" stroke="#5a554c" stroke-width=".45" fill="none"/>`; }
  /* zwei Reihen Rundbogenfenster, nach rechts schmaler (gerundete Wand) */
  for (const hy of [3.6, 8.4]) for (const t of [0.18, 0.55, 0.85]) {
    const f = Math.cos(t * Math.PI / 2), x = x0 + (x1 - x0) * (1 - f) + 0.4, w = Math.max(0.6, 1.3 * K * f * 0.55), yb = ys - hy * K;
    k += `<path d="M${r(x)} ${r(yb)} v${r(-2.4 * K)} q${r(w / 2)} ${r(-w * 0.6)} ${r(w)} 0 v${r(2.4 * K)} Z" fill="${DUNKEL}"/>`;
  }
  /* halbes Kegeldach aus Schiefer: am Turm hoch, nach Osten fallend */
  k += `<path d="M${r(x0 - 0.5)} ${r(y1 + 0.3)} L${r(x0 - 0.5)} ${r(ys - (hw + hk) * K)} Q${r(x0 + (x1 - x0) * 0.55)} ${r(ys - (hw + hk * 0.55) * K)} ${r(x1 + 1.6)} ${r(y1 + 1.2)} Q${r((x0 + x1) / 2)} ${r(y1 - 0.8)} ${r(x0 - 0.5)} ${r(y1 + 0.3)} Z" fill="${S.lg("apsdach", [[0, "#6b7682"], [0.5, "#46505b"], [1, "#262c33"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${r(x0 - 0.5)} ${r(y1 + 0.3)} Q${r((x0 + x1) / 2)} ${r(y1 - 0.8)} ${r(x1 + 1.6)} ${r(y1 + 1.2)}" stroke="#1e2328" stroke-width=".8" fill="none"/>`;
  /* Schatten des Ostturms auf der Apsis-Wurzel */
  k += `<rect x="${x0}" y="${y1}" width="1.6" height="${r(ys - y1)}" fill="#000" opacity=".25"/>`;
  S.teil({ id: "apsis", de: "die Apsis", syl: "AP-sis", it: "l'abside", itSyl: "AB-si-de", en: "apse", x: 0, y: 0, kunst: licht(k),
    tipp: "Im Mittelalter war die Porta Nigra eine Kirche. Die runde Apsis stammt aus dieser Zeit." });
}

/* =====================================================================
   4 — DIE PORTA NIGRA (Stadtseite) — Lupe: Westturm, Torbogen,
       Fenster, Säule, Steinblock
   ===================================================================== */
const GD = 70, GK = F / GD, GLAT = -2.6;
const [GX, GY] = proj(GLAT, GD);
const M = (m) => r(m * GK);
/* Geschosshöhen (m) */
const G = { eg: 8.0, og1: 14.5, og2: 21.0, og3: 27.6, west: 29.3, ost: 21.7, mitte: 21.0 };
const TEILE = [ /* x von–bis (m, vom Tormittelpunkt), Höhe, Fensterachsen */
  { x0: -18, x1: -6.5, h: G.west, n: 3, turm: true, geschosse: 4 },
  { x0: -6.5, x1: 6.5, h: G.mitte, n: 4, turm: false, geschosse: 3 },
  { x0: 6.5, x1: 18, h: G.ost, n: 3, turm: true, geschosse: 3 },
];
let PN_UNTER = [];
{
  /* Quaderfugen als Muster (Tor-Einheiten): Lagen 0,62 m, Quader 1,3 m, versetzt */
  const qh = r(0.62 * GK), qw = r(1.3 * GK);
  S.def(`<pattern id="${S.id("quader")}" patternUnits="userSpaceOnUse" width="${qw}" height="${r(qh * 2)}"><path d="M0 ${qh} H${qw} M0 ${r(qh * 2)} H${qw} M${r(qw / 2)} 0 V${qh} M0 ${qh} V${r(qh * 2)}" stroke="#1e1b18" stroke-width=".32" fill="none" opacity=".7"/><path d="M0 ${r(qh + 0.3)} H${qw}" stroke="#8e8576" stroke-width=".18" opacity=".45"/><ellipse cx="${r(qw / 2)}" cy="${r(qh - 0.2)}" rx=".5" ry=".35" fill="#100e0c" opacity=".8"/><ellipse cx="${r(qw * 0.02)}" cy="${r(qh * 2 - 0.2)}" rx=".45" ry=".32" fill="#100e0c" opacity=".7"/></pattern>`);
  /* Verwitterung: einzelne Quader heller (graubrauner Sandstein) oder schwärzer, dazu Rußfahnen */
  const z = zufall(31);
  let fl = "";
  for (let row = 0; row < 8; row++) for (let col = 0; col < 7; col++) {
    const v = z(); if (v > 0.55) continue;
    const off = row % 2 ? qw / 2 : 0;
    fl += `<rect x="${r(col * qw + off)}" y="${r(row * qh)}" width="${qw}" height="${qh}" fill="${v < 0.22 ? "#9a8f7c" : (v < 0.4 ? "#0e0c0a" : "#6f675b")}" opacity="${r(0.1 + z() * 0.16)}"/>`;
  }
  S.def(`<pattern id="${S.id("patina")}" patternUnits="userSpaceOnUse" width="${r(qw * 7)}" height="${r(qh * 8)}">${fl}</pattern>`);
  let st = "";
  for (let i = 0; i < 24; i++) { const x = z() * 120, w = 1 + z() * 3; st += `<rect x="${r(x)}" y="0" width="${r(w)}" height="60" fill="${z() < 0.6 ? "#0b0a09" : "#8a8070"}" opacity="${r(0.08 + z() * 0.14)}"/>`; }
  S.def(`<pattern id="${S.id("fahnen")}" patternUnits="userSpaceOnUse" width="120" height="60">${st}</pattern>`);
  let k = "";
  const X = (m) => M(m), Y = (m) => -M(m);
  /* Körper der drei Teile; die Türme stehen als flache Risalite 0,6 m vor */
  for (const t of TEILE) {
    const x = X(t.x0), w = M(t.x1 - t.x0), top = Y(t.h);
    /* leicht unregelmäßige Oberkante (ausgebrochene Quader) */
    let oben = `M${x} 0 V${top} `;
    const n = Math.round(w / 3);
    for (let i = 1; i <= n; i++) { const xx = x + i * w / n; const dy = (i % 3 === 1 && t.turm) ? r(-0.8 + z() * 0.4) : 0; oben += `L${r(xx - 0.01)} ${r(top + (i % 4 === 2 ? 1.1 : 0))} L${r(xx)} ${r(top + dy)} `; }
    oben += `V0 Z`;
    k += `<path d="${oben}" fill="${STEIN}"/>`;
    k += `<path d="${oben}" fill="url(#${S.id("quader")})"/>`;
    k += `<path d="${oben}" fill="url(#${S.id("patina")})"/>`;
    k += `<path d="${oben}" fill="url(#${S.id("fahnen")})"/>`;
    /* Gesimse über jedem Geschoss */
    const hs = [G.eg, G.og1, G.og2, G.og3].filter((h) => h < t.h - 0.5);
    for (const h of hs) k += `<rect x="${x}" y="${r(Y(h) - 0.9)}" width="${w}" height="1.8" fill="#6a645a"/><rect x="${x}" y="${r(Y(h) - 0.9)}" width="${w}" height=".5" fill="#8e8576"/><rect x="${x}" y="${r(Y(h) + 0.9)}" width="${w}" height=".7" fill="#1a1714" opacity=".6"/>`;
    /* Achsen: Halbsäulen und Bogenfenster */
    const bay = (t.x1 - t.x0) / t.n;
    const etagen = [[0, G.eg], [G.eg, G.og1], [G.og1, G.og2], [G.og2, G.og3]].slice(0, t.geschosse);
    etagen.forEach(([h0, h1], e) => {
      for (let i = 0; i <= t.n; i++) {
        /* Halbsäule (toskanisch) zwischen den Achsen, rund schattiert */
        const cx = t.x0 + i * bay;
        if (i === 0 || i === t.n) continue;
        const cw = 0.75, hh0 = h0 + (e === 0 ? 0.6 : 0.2), hh1 = h1 - 0.5;
        k += `<rect x="${r(X(cx - cw / 2))}" y="${r(Y(hh1))}" width="${M(cw)}" height="${r(M(hh1 - hh0))}" fill="${S.lg("saeule", [[0, "#8a8172"], [0.35, "#6b645a"], [1, "#2a2622"]], 0, 0, 1, 0)}"/>`;
        k += `<rect x="${r(X(cx - cw / 2 - 0.15))}" y="${r(Y(hh1) - 0.2)}" width="${M(cw + 0.3)}" height="1.1" fill="#7a7266"/><rect x="${r(X(cx - cw / 2 - 0.15))}" y="${r(Y(hh0) - 0.9)}" width="${M(cw + 0.3)}" height=".9" fill="#5a544b"/>`;
      }
      if (e === 0) return;   /* Erdgeschoss der Stadtseite: Halbsäulen, keine Fenster */
      for (let i = 0; i < t.n; i++) {
        const cx = t.x0 + (i + 0.5) * bay, fw = Math.min(2.1, bay * 0.58), s0 = h0 + 0.95, fh = Math.min(3.9, h1 - h0 - 1.6);
        const x0 = X(cx - fw / 2), x1 = X(cx + fw / 2), yb = Y(s0), ys = Y(s0 + fh - fw / 2);
        /* Gewände (Bogen aus Keilsteinen), die Öffnung tief dunkel */
        k += `<path d="M${r(x0 - 0.9)} ${yb} V${ys} A${r((x1 - x0) / 2 + 0.9)} ${r((x1 - x0) / 2 + 0.9)} 0 0 1 ${r(x1 + 0.9)} ${ys} V${yb} Z" fill="#5c564d"/>`;
        k += `<path d="M${x0} ${yb} V${ys} A${r((x1 - x0) / 2)} ${r((x1 - x0) / 2)} 0 0 1 ${x1} ${ys} V${yb} Z" fill="${DUNKEL}"/>`;
        k += `<path d="M${x0} ${yb} V${ys} A${r((x1 - x0) / 2)} ${r((x1 - x0) / 2)} 0 0 1 ${r(x0 + (x1 - x0) * 0.32)} ${r(ys - (x1 - x0) * 0.45)} L${r(x0 + (x1 - x0) * 0.32)} ${yb} Z" fill="#34302b"/>`;
        k += `<rect x="${r(x0 - 0.9)}" y="${yb}" width="${r(x1 - x0 + 1.8)}" height=".8" fill="#7a7266"/>`;
      }
    });
    /* Turm-Risalit: schmale Seitenfläche zur Mitte hin (er steht 0,6 m vor) */
    if (t.turm) {
      const sx = t.x0 < 0 ? X(t.x1) : X(t.x0), dir = t.x0 < 0 ? 1 : -1;
      k += `<path d="M${sx} 0 V${top} L${r(sx + dir * 1.6)} ${r(top + 0.8)} V0 Z" fill="${t.x0 < 0 ? "#2a2723" : "#5e584f"}"/>`;
    }
    /* Licht von links: Verlauf über die ganze Fläche */
    k += `<path d="${oben}" fill="${S.lg("pnlicht" + t.x0, [[0, "#ffe2b0", 0.16], [0.5, "#000", 0], [1, "#000", 0.16]], 0, 0, 1, 0)}"/>`;
  }
  /* die zwei Durchfahrten im Mittelbau: Tonnengewölbe, hinten der Innenhof und die Feldseite im Licht */
  for (const cx of [-3.55, 3.55]) {
    const bw = 2.2, sp = 4.9;
    k += `<path d="M${X(cx - bw - 0.5)} 0 V${Y(sp)} A${M(bw + 0.5)} ${M(bw + 0.5)} 0 0 1 ${X(cx + bw + 0.5)} ${Y(sp)} V0 Z" fill="#6a645a"/>`;
    k += `<path d="M${X(cx - bw)} 0 V${Y(sp)} A${M(bw)} ${M(bw)} 0 0 1 ${X(cx + bw)} ${Y(sp)} V0 Z" fill="#191613"/>`;
    /* durchgesehen: der helle Hof und der zweite Bogen der Feldseite, dahinter der Platz */
    k += `<path d="M${X(cx - 1.3)} 0 V${Y(3.7)} A${M(1.3)} ${M(1.3)} 0 0 1 ${X(cx + 1.3)} ${Y(3.7)} V0 Z" fill="${S.lg("hof", [[0, "#cfd6d8"], [0.6, "#b8b2a2"], [1, "#8c8577"]])}"/>`;
    k += `<path d="M${X(cx - 1.3)} ${Y(1.8)} q${M(0.6)} ${-M(0.5)} ${M(1.2)} 0 q${M(0.5)} ${-M(0.9)} ${M(1.4)} 0 V0 H${X(cx - 1.3)} Z" fill="#5f7a4a" opacity=".8"/>`;
    k += `<path d="M${X(cx - bw)} 0 V${Y(sp)} A${M(bw)} ${M(bw)} 0 0 1 ${X(cx + bw)} ${Y(sp)} V0 Z" fill="${S.rg("tunnel", [[0, "#000", 0], [0.6, "#000", 0.15], [1, "#000", 0.6]], 0.5, 0.65, 0.6)}"/>`;
    /* Keilsteine des Bogens */
    for (let a = 180; a <= 360; a += 15) { const ra = a * Math.PI / 180; k += `<path d="M${r(X(cx) + Math.cos(ra) * M(bw))} ${r(Y(sp) + Math.sin(ra) * M(bw))} L${r(X(cx) + Math.cos(ra) * M(bw + 0.5))} ${r(Y(sp) + Math.sin(ra) * M(bw + 0.5))}" stroke="#2a2622" stroke-width=".3"/>`; }
  }
  /* zwei Leute in den Durchfahrten (Maßstab) */
  k += passant(X(-3.2), 0, M(1.72), { hemd: "#c9b28a", rueck: true }) + passant(X(4.1), 0, M(1.66), { hemd: "#9a3a3a", hose: "#3d4a5a", rueck: true, schritt: 0.14 });
  /* Sockel am Boden */
  k += `<rect x="${X(-18)}" y="-1.2" width="${M(36)}" height="1.4" fill="#2a2622" opacity=".7"/>`;
  const PN = licht(k);
  const [WTX] = [X(-12.25)];
  PN_UNTER = [
    { id: "westturm", de: "der Westturm", syl: "WEST-turm", it: "la torre occidentale", itSyl: "TOR-re oc-ci-den-TA-le", en: "west tower", x: GX + X(-12.25), y: GY, kunst: flaeche(-M(5.75), -M(G.west), M(11.5), M(G.west - G.og2), 1),
      tipp: "Der Westturm hat noch alle vier Stockwerke. Er ist fast 30 Meter hoch." },
    { id: "torbogen", de: "der Torbogen", syl: "TOR-bo-gen", it: "l'arco della porta", itSyl: "AR-co del-la POR-ta", en: "archway", x: GX + X(-3.55), y: GY, kunst: flaeche(-M(2.7), -M(7.6), M(5.4), M(7.6), 1),
      tipp: "Die Porta Nigra hat zwei Durchfahrten. Früher fuhren hier Wagen in die Stadt." },
    { id: "fenster", de: "das Fenster", syl: "FENS-ter", it: "la finestra", itSyl: "fi-NE-stra", en: "window", x: GX + X(2.44), y: GY - M(G.og1 + 1.2), kunst: flaeche(-M(1.1), -M(3.6), M(2.2), M(3.8), 0.6),
      tipp: "Die Fenster haben oben einen runden Bogen. In jedem Stockwerk gibt es eine lange Reihe davon." },
    { id: "saeule", de: "die Säule", syl: "SÄU-le", it: "la colonna", itSyl: "co-LON-na", en: "column", x: GX + X(6.5 + 11.5 / 3), y: GY, kunst: flaeche(-M(0.7), -M(G.eg), M(1.4), M(G.eg), 0.6),
      tipp: "Zwischen den Fenstern stehen Halbsäulen. So sieht das Tor fast wie ein Palast aus." },
    { id: "steinblock", de: "der Steinblock", syl: "STEIN-block", it: "il blocco di pietra", itSyl: "BLOC-co di PIE-tra", en: "stone block", x: GX + X(13.5), y: GY - M(3.4), kunst: flaeche(-M(2.2), -M(1.6), M(4.4), M(2.8), 0.6),
      tipp: "Die Steine halten ohne Mörtel. Früher waren sie mit Eisenklammern verbunden – die Löcher sieht man noch." },
  ];
  S.teil({ id: "portanigra", de: "die Porta Nigra", syl: "POR-ta NI-gra", it: "la Porta Nigra", itSyl: "POR-ta NI-gra", en: "Porta Nigra",
    x: GX, y: GY, kunst: PN, tipp: "Die Römer bauten die Porta Nigra um 170 nach Christus. „Porta Nigra“ heißt „schwarzes Tor“: Der Sandstein ist mit der Zeit dunkel geworden.",
    zoom: { x: 52, y: 8, w: 300, h: 200 }, unter: PN_UNTER });
}

/* =====================================================================
   5 — DER RADFAHRER (fährt quer über den Platz) und Leute in der Ferne
   ===================================================================== */
{
  const d = 46, lat = 1.2, [x, y] = proj(lat, d), s = km(y);
  let k = "";
  const R = 0.34 * s;
  for (const cx of [-0.55 * s, 0.55 * s]) k += `<circle cx="${r(cx)}" cy="${r(-R)}" r="${r(R)}" fill="none" stroke="#1c1c1e" stroke-width="${r(0.05 * s)}"/>`;
  k += `<path d="M${r(-0.55 * s)} ${r(-R)} L${r(-0.05 * s)} ${r(-R)} L${r(-0.15 * s)} ${r(-0.9 * s)} Z M${r(-0.05 * s)} ${r(-R)} L${r(0.42 * s)} ${r(-0.88 * s)} L${r(-0.12 * s)} ${r(-0.82 * s)} M${r(0.42 * s)} ${r(-0.88 * s)} L${r(0.55 * s)} ${r(-R)}" stroke="#2f5f95" stroke-width="${r(0.045 * s)}" fill="none"/>`;
  /* Fahrer: einfacher Körper (klein im Bild), Helm */
  k += `<path d="M${r(-0.16 * s)} ${r(-0.92 * s)} L${r(-0.02 * s)} ${r(-0.55 * s)} L${r(0.02 * s)} ${r(-R)} M${r(-0.16 * s)} ${r(-0.92 * s)} L${r(0.1 * s)} ${r(-0.6 * s)} L${r(0.14 * s)} ${r(-0.42 * s)}" stroke="#2f3640" stroke-width="${r(0.09 * s)}" stroke-linecap="round" fill="none"/>`;
  k += `<path d="M${r(-0.2 * s)} ${r(-0.92 * s)} Q${r(-0.1 * s)} ${r(-1.38 * s)} ${r(0.1 * s)} ${r(-1.4 * s)} L${r(0.16 * s)} ${r(-1.32 * s)} Q${r(-0.04 * s)} ${r(-1.2 * s)} ${r(-0.06 * s)} ${r(-0.92 * s)} Z" fill="#d8ad3a"/>`;
  k += `<path d="M${r(0.08 * s)} ${r(-1.32 * s)} L${r(0.4 * s)} ${r(-0.92 * s)}" stroke="#d8ad3a" stroke-width="${r(0.06 * s)}" stroke-linecap="round"/>`;
  k += `<circle cx="${r(0.16 * s)}" cy="${r(-1.5 * s)}" r="${r(0.1 * s)}" fill="#e3b796"/><path d="M${r(0.05 * s)} ${r(-1.55 * s)} Q${r(0.16 * s)} ${r(-1.7 * s)} ${r(0.28 * s)} ${r(-1.55 * s)} Z" fill="#c8302a"/>`;
  schlag(lat, d, 1.6, 1.2, 0.3);
  /* Spaziergänger am Tor (gehören zum Platz, nicht antippbar einzeln) */
  let p = "";
  for (const [la, dd, hemd] of [[-12, 66, "#7a2a40"], [-9.5, 70, "#e8e4dc"], [9, 64, "#3f7d5a"], [11, 69, "#d8ad3a"], [-6, 58, "#2f5f95"]]) { const [px, py] = proj(la, dd); p += passant(px, py, r(1.7 * F / dd), { hemd, rueck: rnd() < 0.5 }); schlag(la, dd, 1.7, 0.5, 0.25); }
  PFLASTER_TEIL.kunst += p;
  S.teil({ id: "radfahrer", de: "der Radfahrer", syl: "RAD-fah-rer", it: "il ciclista", itSyl: "ci-CLI-sta", en: "cyclist", x, y, kunst: licht(k) });
}

/* =====================================================================
   6 — DAS CAFÉ (Eckhaus der Simeonstraße, links vorn in der Flucht)
   ===================================================================== */
{
  const lat = -12.5, d0 = 28, d1 = 46, h = 15.5;
  const P = (d, hh) => proj(lat, d, hh);
  let k = "";
  const [a0x, a0y] = P(d0, 0), [a1x, a1y] = P(d1, 0), [b1x, b1y] = P(d1, h), [b0x, b0y] = P(d0, h);
  /* Hausfront in der Flucht (Putz in Ocker), Gesimse und Fenster */
  k += `<path d="M${a0x} ${a0y} L${a1x} ${a1y} L${b1x} ${b1y} L${b0x} ${b0y} Z" fill="${S.lg("haus", [[0, "#9c8466"], [1, "#b39a76"]], 0, 0, 1, 0)}"/>`;
  /* Stirnseite zur Porta hin (Schatten) */
  const quad = (da, db, ha, hb, fill, extra = "") => { const [p1x, p1y] = P(da, ha), [p2x, p2y] = P(db, ha), [p3x, p3y] = P(db, hb), [p4x, p4y] = P(da, hb); return `<path d="M${p1x} ${p1y} L${p2x} ${p2y} L${p3x} ${p3y} L${p4x} ${p4y} Z" fill="${fill}"${extra}/>`; };
  for (const hh of [4.4, 8.0, 11.6]) k += quad(d0, d1, hh, hh + 0.35, "#cbb48e") + quad(d0, d1, hh - 0.15, hh, "#6f5a3e");
  k += quad(d0, d1, h - 0.6, h, "#7a5a32");
  for (const [ha, hb] of [[5.2, 7.4], [8.8, 11], [12.3, 14.4]]) for (let d = d0 + 1.2; d < d1 - 1; d += 3.2) { k += quad(d - 0.15, d + 1.55, ha - 0.15, hb + 0.15, "#e6dccb"); k += quad(d, d + 1.4, ha, hb, S.lg("fglas", [[0, "#8aa4b8"], [0.5, "#5b7084"], [1, "#3a4856"]])); k += quad(d + 0.66, d + 0.74, ha, hb, "#e6dccb"); k += quad(d - 0.25, d + 1.65, ha - 0.4, ha - 0.15, "#d8ccb6"); }
  /* Erdgeschoss: Schaufenster und Café, Markise mit Schrift */
  for (let d = d0 + 0.8; d < d1 - 1; d += 4.2) k += quad(d, d + 3.2, 0.3, 3.4, S.lg("schau", [[0, "#5d6f7d"], [1, "#2c3740"]]));
  k += quad(d0, d1, 3.6, 4.2, "#7a2a2a");
  const [m1x, m1y] = P(d0, 3.7), [m2x, m2y] = P(d1, 3.7), [m3x, m3y] = proj(lat + 1.4, d1, 3.0), [m4x, m4y] = proj(lat + 1.4, d0, 3.0);
  k += `<path d="M${m1x} ${m1y} L${m2x} ${m2y} L${m3x} ${m3y} L${m4x} ${m4y} Z" fill="${S.lg("markise", [[0, "#9b2b30"], [1, "#c23a3f"]], 0, 0, 1, 0)}"/>`;
  for (let d = d0; d < d1; d += 1.2) { const [s1x, s1y] = P(d, 3.7), [s2x, s2y] = proj(lat + 1.4, d, 3.0); k += `<path d="M${s1x} ${s1y} L${s2x} ${s2y}" stroke="#f1e2c6" stroke-width="${r(F / d * 0.25)}" opacity=".85"/>`; }
  k += `<text transform="translate(${r(m4x + 4)} ${r(m4y - 1)}) rotate(${r(Math.atan2(m3y - m4y, m3x - m4x) * 180 / Math.PI)}) skewX(-10)" font-size="5.2" fill="#fff8e6" font-family="Georgia,serif" font-style="italic" font-weight="bold">Café an der Porta</text>`;
  S.teil({ id: "cafe", de: "das Café", syl: "ca-FÉ", it: "il caffè", itSyl: "caf-FÈ", en: "café", x: 0, y: 0, kunst: k,
    tipp: "In der Simeonstraße gibt es viele Cafés. Von hier sieht man direkt auf die Porta Nigra." });
}

/* =====================================================================
   7 — DIE LATERNE (vor dem Westturm)
   ===================================================================== */
{
  const lat = -5.2, d = 31, [x, y] = proj(lat, d), s = km(y), H = 4.2 * s;
  let k = `<path d="M${r(-0.12 * s)} 0 L${r(-0.08 * s)} ${r(-0.5 * s)} L${r(-0.045 * s)} ${r(-H + 0.6 * s)} L${r(0.045 * s)} ${r(-H + 0.6 * s)} L${r(0.08 * s)} ${r(-0.5 * s)} L${r(0.12 * s)} 0 Z" fill="${S.lg("mast", [[0, "#3c4a4d"], [0.4, "#1c2426"], [1, "#0f1416"]], 0, 0, 1, 0)}"/>`;
  const t = -H + 0.6 * s, lw = 0.2 * s;
  k += `<path d="M${r(-lw * 0.6)} ${r(t)} L${r(-lw)} ${r(t - 0.5 * s)} L${r(lw)} ${r(t - 0.5 * s)} L${r(lw * 0.6)} ${r(t)} Z" fill="${S.lg("glaslat", [[0, "#fff6d8"], [1, "#e8c98a"]])}" stroke="#1c2426" stroke-width=".4"/>`;
  k += `<path d="M${r(-lw - 0.5)} ${r(t - 0.5 * s)} L0 ${r(t - 0.72 * s)} L${r(lw + 0.5)} ${r(t - 0.5 * s)} Z" fill="#1c2426"/><circle cx="0" cy="${r(t - 0.76 * s)}" r=".6" fill="#1c2426"/>`;
  schlag(lat, d, 4.2, 0.2, 0.3);
  S.teil({ id: "laterne", de: "die Laterne", syl: "la-TER-ne", it: "il lampione", itSyl: "lam-PIO-ne", en: "street lamp", x, y, kunst: licht(k) });
}

/* =====================================================================
   8 — DIE REISEGRUPPE und 9 — DER RÖMER (Darsteller als Zenturio)
   ===================================================================== */
{
  /* drei Touristen, sie schauen nach rechts zum Römer (schräg von hinten) */
  let k = "";
  const leute = [
    { lat: 0.9, d: 23.8, g: "w", blick: 125, frisur: "lang", haar: "blond", o: { stueck: "tshirt", farbe: "#e6889f" }, u: { stueck: "jeans" }, j: null, z: { stueck: "tasche", farbe: "braun" }, h: 1.64 },
    { lat: 2.0, d: 25.6, g: "m", blick: 140, frisur: "kurz", haar: "grau", o: { stueck: "hemd", farbe: "#9fc0dc" }, u: { stueck: "hose", farbe: "beige" }, j: null, z: { stueck: "rucksack", farbe: "#2f4a6a" }, h: 1.78, kopf: { stueck: "hut", farbe: "#e3d3a8" } },
    { lat: 2.5, d: 22.6, g: "w", blick: 110, frisur: "dutt", haar: "dunkelbraun", o: { stueck: "bluse", farbe: "#f3efe6" }, u: { stueck: "rock_knie", farbe: "#2f4a6a" }, j: { stueck: "jacke", farbe: "#4f8a46" }, z: null, h: 1.62 },
  ];
  const teile = [];
  leute.sort((a, b) => b.d - a.d).forEach((p, i) => {
    const [x, y] = proj(p.lat, p.d), s = km(y);
    const kl = { oberteil: p.o, unterteil: p.u, schuhe: { stueck: "turnschuh" } };
    if (p.j) kl.jacke = p.j; if (p.z) kl.zubehoer = p.z; if (p.kopf) kl.kopf = p.kopf;
    const m = figur({ id: "trr_t" + i, geschlecht: p.g, pose: "stehen", blick: p.blick, frisur: p.frisur, haarfarbe: p.haar, haut: "hell", kleidung: kl }, p.h * s);
    teile.push(`<g transform="translate(${x} ${y})">${m.svg}</g>`);
    schlag(p.lat, p.d, p.h, 0.5);
  });
  k = teile.join("");
  const [rx, ry] = proj(1.8, 23.8);
  S.teil({ id: "reisegruppe", de: "die Reisegruppe", syl: "REI-se-grup-pe", it: "il gruppo di turisti", itSyl: "GRUP-po di tu-RI-sti", en: "tour group", x: rx, y: ry,
    kunst: `<g transform="translate(${-rx} ${-ry})">${licht(k)}</g>`, tipp: "Die Reisegruppe hört dem Römer zu. Er erzählt vom Leben in Trier vor fast 2000 Jahren." });
}
const ROEM = { lat: 4.5, d: 21.5 };
{
  const [x, y] = proj(ROEM.lat, ROEM.d), s = km(y);
  const m = figur({ id: "trr_roem", geschlecht: "m", pose: "zeigen", blick: -40, frisur: "kurz", haarfarbe: "dunkelbraun", haut: "mittel",
    kleidung: { oberteil: { stueck: "tshirt", farbe: "#a3262a" }, unterteil: { stueck: "rock_knie", farbe: "#a3262a" }, schuhe: { stueck: "sandale", farbe: "braun" }, kopf: { stueck: "helm", farbe: "#b9bdc1" } } }, 1.8 * s);
  const p = m.z.punkte, k = m.k;
  const P = (n) => p[n];
  /* Umhang (rot, hinter dem Körper) */
  let hinten = `<path d="M${P("schulterR")[0] - 4} ${P("schulterR")[1]} Q${P("huefteR")[0] - 12} ${P("huefteR")[1]} ${P("knieR")[0] - 12} ${P("knieR")[1] + 6} L${P("knieL")[0] + 14} ${P("knieL")[1] + 4} Q${P("huefteL")[0] + 10} ${P("huefteL")[1]} ${P("schulterL")[0] + 3} ${P("schulterL")[1]} Z" fill="${S.lg("umhang", [[0, "#7a1418"], [0.5, "#b02a2e"], [1, "#6a1014"]], 0, 0, 1, 0)}"/>`;
  /* Kettenhemd über dem Oberkörper (Muster aus Ringen), Brustgurt mit Phalerae (Orden) */
  S.def(`<pattern id="${S.id("kette")}" patternUnits="userSpaceOnUse" width="2.4" height="2"><rect width="2.4" height="2" fill="#7d8287"/><circle cx="1.2" cy="1" r=".8" fill="none" stroke="#c9cdd1" stroke-width=".45"/><circle cx="0" cy="0" r=".8" fill="none" stroke="#a9aeb3" stroke-width=".45"/></pattern>`);
  const sL = P("schulterL"), sR = P("schulterR"), tL = P("tailleL"), tR = P("tailleR"), hL = P("huefteL"), hR = P("huefteR");
  let vorn = `<path d="M${sR[0] - 1} ${sR[1] + 2} Q${(sR[0] + sL[0]) / 2} ${sR[1] - 2} ${sL[0] + 1} ${sL[1] + 2} L${tL[0] + 2} ${tL[1]} L${hL[0] + 2} ${hL[1] + 6} L${hR[0] - 2} ${hR[1] + 6} L${tR[0] - 2} ${tR[1]} Z" fill="url(#${S.id("kette")})" stroke="#4a4e52" stroke-width=".6"/>`;
  vorn += `<path d="M${sR[0] - 1} ${sR[1] + 2} Q${(sR[0] + sL[0]) / 2} ${sR[1] - 2} ${sL[0] + 1} ${sL[1] + 2} L${tL[0] + 2} ${tL[1]} L${hL[0] + 2} ${hL[1] + 6} L${hR[0] - 2} ${hR[1] + 6} L${tR[0] - 2} ${tR[1]} Z" fill="${S.lg("kettel", [[0, "#ffe2b0", 0.25], [0.5, "#000", 0], [1, "#000", 0.35]], 0, 0, 1, 0)}"/>`;
  const br = P("brust");
  for (const [dx, dy] of [[-6, -6], [0, -6], [6, -6], [-3, 2], [3, 2]]) vorn += `<circle cx="${br[0] + dx}" cy="${br[1] + dy}" r="2.2" fill="${GOLD}" stroke="#7a5a12" stroke-width=".4"/>`;
  /* Gürtel (cingulum) mit beschlagenen Lederstreifen */
  vorn += `<path d="M${hR[0] - 2} ${hR[1] + 2} L${hL[0] + 2} ${hL[1] + 2} L${hL[0] + 2} ${hL[1] + 6} L${hR[0] - 2} ${hR[1] + 6} Z" fill="#5a3a1c"/>`;
  for (let i = 0; i < 5; i++) { const x = hR[0] + 4 + i * (hL[0] - hR[0] - 8) / 4; vorn += `<path d="M${r(x)} ${hR[1] + 6} V${hR[1] + 24}" stroke="#4a2e14" stroke-width="2"/><circle cx="${r(x)}" cy="${hR[1] + 12}" r=".8" fill="#d9c27a"/><circle cx="${r(x)}" cy="${hR[1] + 19}" r=".8" fill="#d9c27a"/>`; }
  /* Schwert (gladius) an der linken Hüfte — beim Zenturio links */
  vorn += `<path d="M${hL[0] + 3} ${hL[1] - 2} L${hL[0] + 7} ${hL[1] + 26} L${hL[0] + 10} ${hL[1] + 25} L${hL[0] + 6} ${hL[1] - 3} Z" fill="${S.lg("scheide", [[0, "#3a2414"], [1, "#6a4426"]], 0, 0, 1, 0)}" stroke="#c9a640" stroke-width=".5"/>`;
  vorn += `<path d="M${hL[0] + 2} ${hL[1] - 3} L${hL[0] + 7} ${hL[1] - 4.4}" stroke="#c9a640" stroke-width="1.6"/><path d="M${hL[0] + 4} ${hL[1] - 4} L${hL[0] + 3.4} ${hL[1] - 10}" stroke="#6a4426" stroke-width="1.8"/><circle cx="${hL[0] + 3.3}" cy="${hL[1] - 11}" r="1.4" fill="#c9a640"/>`;
  /* Querkamm des Zenturio-Helms und Wangenklappen */
  const sch = P("scheitel"), ohr = P("ohr");
  vorn += `<path d="M${sch[0] - 15} ${sch[1] + 2} Q${sch[0]} ${sch[1] - 15} ${sch[0] + 15} ${sch[1] + 2} Q${sch[0]} ${sch[1] - 4} ${sch[0] - 15} ${sch[1] + 2} Z" fill="${S.lg("kamm", [[0, "#7a1418"], [0.5, "#d0343a"], [1, "#8a1a1e"]], 0, 0, 1, 0)}"/>`;
  for (let i = -6; i <= 6; i++) vorn += `<path d="M${sch[0] + i * 2.2} ${sch[1] - 1 + Math.abs(i) * 0.2} L${sch[0] + i * 2.4} ${sch[1] - 10 + Math.abs(i) * 0.9}" stroke="#6a1014" stroke-width=".4" opacity=".7"/>`;
  vorn += `<path d="M${ohr[0] - 1} ${ohr[1] - 2} L${ohr[0] + 1} ${ohr[1] + 9} L${ohr[0] + 4} ${ohr[1] + 8} L${ohr[0] + 3} ${ohr[1] - 2} Z" fill="#a9aeb3" stroke="#6a6e72" stroke-width=".4"/>`;
  /* Rebstock (vitis) in der linken Hand */
  const hdL = m.z.handL;
  vorn += `<path d="M${hdL.x - 1} ${hdL.y + 18} L${hdL.x + 2} ${hdL.y - 40}" stroke="${S.lg("vitis", [[0, "#4a2e14"], [1, "#8a6a40"]], 0, 0, 1, 0)}" stroke-width="2.4" stroke-linecap="round"/>`;
  const svg = `<g transform="scale(${k.toFixed(4)})">${hinten}${m.inner}${vorn}</g>`;
  schlag(ROEM.lat, ROEM.d, 1.8, 0.55);
  const helm = { x: r(x + sch[0] * k), y: r(y + (sch[1] + 6) * k) };
  const schw = { x: r(x + (hL[0] + 6) * k), y: r(y + (hL[1] + 26) * k) };
  S.teil({ id: "roemer", de: "der Römer", syl: "RÖ-mer", it: "il romano", itSyl: "ro-MA-no", en: "Roman", x, y, kunst: licht(svg),
    tipp: "Ein Darsteller spielt einen Zenturio, einen Offizier der römischen Armee. Er führt Touristen durch Trier.",
    zoom: { x: r(x - 30), y: r(y - 2.05 * s * 1.0), w: 60, h: 40 },
    unter: [
      { id: "helm", de: "der Helm", syl: "HELM", it: "l'elmo", itSyl: "EL-mo", en: "helmet", x: helm.x, y: helm.y, kunst: flaeche(-16 * k, -18 * k, 32 * k, 20 * k, 0.4),
        tipp: "Der Kamm quer auf dem Helm zeigt: Dieser Römer ist ein Zenturio." },
      { id: "schwert", de: "das Schwert", syl: "SCHWERT", it: "la spada", itSyl: "SPA-da", en: "sword", x: schw.x, y: schw.y, kunst: flaeche(-6 * k, -40 * k, 12 * k, 42 * k, 0.4),
        tipp: "Das kurze Schwert der Römer heißt Gladius." },
    ] });
}

/* =====================================================================
   10 — DIE TAUBEN (auf dem Pflaster, Mitte vorn)
   ===================================================================== */
{
  let k = "";
  const taube = (lat, d, dir, pick) => {
    /* Stadttaube von der Seite: grauer Körper, dunkle Flügelbinden, grün-violett schillernder Hals, rote Füße */
    const [x, y] = proj(lat, d), a = km(y) * 0.11, s = a * dir;
    const P = (px, py) => `${r(px * s)} ${r(py * a)}`;
    let g = `<g transform="translate(${x} ${y})">`;
    const kopf = pick ? [1.55, -0.55] : [1.25, -2.15];
    g += `<path d="M${P(-2.4, -1.3)} L${P(-1.2, -1.75)} Q${P(0, -2.6)} ${P(0.95, -2.0)} Q${P(1.4, -1.0)} ${P(0.9, -0.45)} Q${P(0, 0)} ${P(-1.1, -0.65)} Z" fill="${S.lg("taube", [[0, "#a9b0b8"], [1, "#6b727b"]])}"/>`;
    g += `<path d="M${P(-1.0, -1.45)} Q${P(0, -2.1)} ${P(0.6, -1.7)} Q${P(0, -1.1)} ${P(-1.0, -1.45)} Z" fill="#8c939c"/><path d="M${P(-0.6, -1.5)} L${P(0.1, -1.75)} M${P(-0.9, -1.25)} L${P(-0.1, -1.45)}" stroke="#3d434a" stroke-width="${r(0.18 * a)}"/>`;
    g += `<path d="M${P(0.7, -1.9)} Q${P(1.0, -1.2)} ${P(kopf[0] * 0.9, kopf[1] * 0.85)}" stroke="${S.lg("hals", [[0, "#5d8a72"], [1, "#7a5a8a"]])}" stroke-width="${r(0.75 * a)}" fill="none" stroke-linecap="round"/>`;
    g += `<circle cx="${r(kopf[0] * s)}" cy="${r(kopf[1] * a)}" r="${r(0.42 * a)}" fill="#737a84"/><circle cx="${r((kopf[0] + 0.12) * s)}" cy="${r((kopf[1] - 0.1) * a)}" r="${r(0.09 * a)}" fill="#e8763a"/>`;
    g += `<path d="M${P(kopf[0] + 0.35, kopf[1] + 0.02)} L${P(kopf[0] + 0.75, kopf[1] + 0.15)} L${P(kopf[0] + 0.35, kopf[1] + 0.18)} Z" fill="#3a3a3a"/>`;
    g += `<path d="M${P(-0.2, -0.45)} L${P(-0.1, 0)} M${P(0.3, -0.45)} L${P(0.45, 0)}" stroke="#c4584a" stroke-width="${r(0.16 * a)}"/>`;
    return g + `</g>`;
  };
  for (const [lat, d, dir, pick] of [[-1.6, 17.5, 1, 1], [-0.7, 18.6, -1, 0], [0.6, 16.6, 1, 0], [-2.4, 19.8, -1, 1], [1.4, 19.2, -1, 1]]) k += taube(lat, d, dir, pick);
  /* ein paar Brotkrumen */
  for (let i = 0; i < 10; i++) { const [x, y] = proj(-2 + rnd() * 3.6, 16.4 + rnd() * 3.4); k += `<circle cx="${x}" cy="${y}" r=".35" fill="#e8d4a8"/>`; }
  S.teil({ id: "taube", de: "die Taube", syl: "TAU-be", it: "il piccione", itSyl: "pic-CIO-ne", en: "pigeon", x: 0, y: 0, kunst: licht(k),
    tipp: "Auf dem Platz vor der Porta Nigra suchen Tauben nach Krümeln." });
}

/* =====================================================================
   11 — DER SONNENSCHIRM, 12 — DER STUHL, 13 — DER TISCH mit
        VIEZ und MOSELWEIN (Café-Terrasse links vorn)
   ===================================================================== */
const TISCH = { lat: -6.4, d: 18.2 };
const [TX, TY] = proj(TISCH.lat, TISCH.d), TK = km(TY);
{
  const lat = -8.2, d = 20.5, [x, y] = proj(lat, d), s = km(y), H = 2.45 * s, Wd = 1.45 * s;
  let k = `<rect x="${r(-0.03 * s)}" y="${r(-H)}" width="${r(0.06 * s)}" height="${r(H)}" fill="#d9d2c4"/>`;
  k += `<path d="M${r(-0.25 * s)} 0 L${r(0.25 * s)} 0 L${r(0.2 * s)} ${r(-0.1 * s)} L${r(-0.2 * s)} ${r(-0.1 * s)} Z" fill="#4a4a4a"/>`;
  k += `<path d="M${r(-Wd)} ${r(-H + 0.42 * s)} Q${r(-Wd * 0.5)} ${r(-H - 0.05 * s)} 0 ${r(-H - 0.12 * s)} Q${r(Wd * 0.5)} ${r(-H - 0.05 * s)} ${r(Wd)} ${r(-H + 0.42 * s)} Z" fill="${S.lg("schirm", [[0, "#fbf6ea"], [0.6, "#efe4cc"], [1, "#d9cba8"]], 0, 0, 1, 0)}"/>`;
  for (const t of [-0.6, -0.2, 0.2, 0.6]) k += `<path d="M0 ${r(-H - 0.12 * s)} L${r(t * Wd)} ${r(-H + 0.32 * s)}" stroke="#cdbf9f" stroke-width=".4"/>`;
  k += `<path d="M${r(-Wd)} ${r(-H + 0.42 * s)} q${r(Wd * 0.125)} ${r(0.08 * s)} ${r(Wd * 0.25)} 0 q${r(Wd * 0.125)} ${r(0.08 * s)} ${r(Wd * 0.25)} 0 q${r(Wd * 0.125)} ${r(0.08 * s)} ${r(Wd * 0.25)} 0 q${r(Wd * 0.125)} ${r(0.08 * s)} ${r(Wd * 0.25)} 0 q${r(Wd * 0.125)} ${r(0.08 * s)} ${r(Wd * 0.25)} 0 q${r(Wd * 0.125)} ${r(0.08 * s)} ${r(Wd * 0.25)} 0 q${r(Wd * 0.125)} ${r(0.08 * s)} ${r(Wd * 0.25)} 0 q${r(Wd * 0.125)} ${r(0.08 * s)} ${r(Wd * 0.25)} 0" fill="#9b2b30"/>`;
  k += `<text x="${r(Wd * 0.2)}" y="${r(-H + 0.32 * s)}" font-size="${r(0.17 * s)}" text-anchor="middle" fill="#9b2b30" font-family="Georgia,serif" font-style="italic">Riesling</text>`;
  schlag(lat, d, 2.4, 2.6, 0.25);
  S.teil({ id: "sonnenschirm", de: "der Sonnenschirm", syl: "SON-nen-schirm", it: "l'ombrellone", itSyl: "om-brel-LO-ne", en: "parasol", x, y, kunst: licht(k) });
}
const stuhl = (s, dreh) => {
  /* Bistrostuhl aus Metall mit Rattan-Sitz, schräg gestellt */
  const w = 0.42 * s, sh = 0.46 * s, lh = 0.86 * s, o = dreh * 0.1 * s;
  let k = `<path d="M${r(-w / 2)} 0 L${r(-w / 2 + o)} ${r(-sh)} M${r(w / 2)} 0 L${r(w / 2 + o)} ${r(-sh)} M${r(-w / 2 + o * 1.6 + 0.04 * s)} ${r(-sh + 0.04 * s)} L${r(-w / 2 + 2.4 * o)} ${r(0.02 * s)} M${r(w / 2 + o * 1.6 - 0.04 * s)} ${r(-sh + 0.04 * s)} L${r(w / 2 + 2.4 * o)} ${r(0.02 * s)}" stroke="#2a2d30" stroke-width="${r(0.03 * s)}" fill="none"/>`;
  k += `<path d="M${r(-w / 2 + o)} ${r(-sh)} L${r(w / 2 + o)} ${r(-sh)} L${r(w / 2 + 2 * o)} ${r(-sh - 0.08 * s)} L${r(-w / 2 + 2 * o)} ${r(-sh - 0.08 * s)} Z" fill="${S.lg("rattan", [[0, "#c9a46a"], [1, "#9a7440"]])}"/>`;
  k += `<path d="M${r(-w / 2 + 2 * o)} ${r(-sh - 0.08 * s)} L${r(-w / 2 + 2.2 * o)} ${r(-lh)} Q${r(2.2 * o)} ${r(-lh - 0.06 * s)} ${r(w / 2 + 2.2 * o)} ${r(-lh)} L${r(w / 2 + 2 * o)} ${r(-sh - 0.08 * s)}" stroke="#2a2d30" stroke-width="${r(0.035 * s)}" fill="none"/>`;
  k += `<path d="M${r(-w / 2 + 2.2 * o)} ${r(-lh + 0.08 * s)} L${r(w / 2 + 2.2 * o)} ${r(-lh + 0.08 * s)} L${r(w / 2 + 2.1 * o)} ${r(-lh + 0.18 * s)} L${r(-w / 2 + 2.1 * o)} ${r(-lh + 0.18 * s)} Z" fill="#b08850"/>`;
  return k;
};
{
  const [x1, y1] = proj(TISCH.lat - 0.75, TISCH.d + 0.4), [x2, y2] = proj(TISCH.lat + 0.8, TISCH.d + 0.6);
  const k = `<g transform="translate(${r(x1 - TX)} ${r(y1 - TY)})">${stuhl(km(y1), 1)}</g><g transform="translate(${r(x2 - TX)} ${r(y2 - TY)})">${stuhl(km(y2), -1)}</g>`;
  schlag(TISCH.lat - 0.75, TISCH.d + 0.4, 0.86, 0.45, 0.3); schlag(TISCH.lat + 0.8, TISCH.d + 0.6, 0.86, 0.45, 0.3);
  S.teil({ id: "stuhl", de: "der Stuhl", syl: "STUHL", it: "la sedia", itSyl: "SE-dia", en: "chair", x: TX, y: TY, kunst: licht(k) });
}
{
  const s = TK, TH = 0.74 * s, R = 0.36 * s;
  let k = `<path d="M${r(-0.18 * s)} 0 L${r(0.18 * s)} 0 L${r(0.03 * s)} ${r(-0.08 * s)} L${r(-0.03 * s)} ${r(-0.08 * s)} Z" fill="#2c3236"/><rect x="${r(-0.025 * s)}" y="${r(-TH)}" width="${r(0.05 * s)}" height="${r(TH - 0.06 * s)}" fill="#3a4045"/>`;
  k += `<ellipse cx="0" cy="${r(-TH)}" rx="${r(R)}" ry="${r(R * 0.2)}" fill="#8b9298"/><ellipse cx="0" cy="${r(-TH - 0.02 * s)}" rx="${r(R)}" ry="${r(R * 0.2)}" fill="${S.lg("marmor", [[0, "#f3f1ec"], [1, "#d6d2c8"]])}"/>`;
  const top = -TH - 0.02 * s;
  /* der Viez in der Viezporz: weißer Porzellanbecher, trüber goldener Apfelwein */
  const vx = -0.13 * s;
  k += `<path d="M${r(vx - 0.045 * s)} ${r(top + 0.01 * s)} L${r(vx - 0.05 * s)} ${r(top - 0.11 * s)} L${r(vx + 0.05 * s)} ${r(top - 0.11 * s)} L${r(vx + 0.045 * s)} ${r(top + 0.01 * s)} Z" fill="${S.lg("porz", [[0, "#ffffff"], [0.7, "#eeece6"], [1, "#cfcbc2"]], 0, 0, 1, 0)}"/>`;
  k += `<ellipse cx="${r(vx)}" cy="${r(top - 0.11 * s)}" rx="${r(0.05 * s)}" ry="${r(0.012 * s)}" fill="#d9b25a"/>`;
  k += `<path d="M${r(vx + 0.048 * s)} ${r(top - 0.09 * s)} q${r(0.04 * s)} 0 ${r(0.035 * s)} ${r(0.035 * s)} q0 ${r(0.03 * s)} ${r(-0.038 * s)} ${r(0.03 * s)}" stroke="#f6f4ef" stroke-width="${r(0.012 * s)}" fill="none"/>`;
  k += `<path d="M${r(vx - 0.03 * s)} ${r(top - 0.06 * s)} h${r(0.06 * s)}" stroke="#3a5a9a" stroke-width=".25"/>`;
  /* der Moselwein (Riesling) im Römerglas mit grünem Stiel */
  const wx = 0.12 * s;
  k += `<path d="M${r(wx - 0.035 * s)} ${r(top + 0.005 * s)} L${r(wx + 0.035 * s)} ${r(top + 0.005 * s)} L${r(wx + 0.01 * s)} ${r(top - 0.012 * s)} L${r(wx + 0.008 * s)} ${r(top - 0.07 * s)} L${r(wx - 0.008 * s)} ${r(top - 0.07 * s)} L${r(wx - 0.01 * s)} ${r(top - 0.012 * s)} Z" fill="#3f7a3a"/>`;
  for (const t of [0.02, 0.04, 0.06]) k += `<circle cx="${r(wx)}" cy="${r(top - t * s)}" r="${r(0.012 * s)}" fill="#5c9a52"/>`;
  k += `<path d="M${r(wx - 0.045 * s)} ${r(top - 0.15 * s)} Q${r(wx - 0.05 * s)} ${r(top - 0.07 * s)} ${r(wx)} ${r(top - 0.068 * s)} Q${r(wx + 0.05 * s)} ${r(top - 0.07 * s)} ${r(wx + 0.045 * s)} ${r(top - 0.15 * s)} Z" fill="#eef4e8" opacity=".55" stroke="#c9d6c4" stroke-width=".15"/>`;
  k += `<path d="M${r(wx - 0.043 * s)} ${r(top - 0.115 * s)} Q${r(wx - 0.045 * s)} ${r(top - 0.075 * s)} ${r(wx)} ${r(top - 0.072 * s)} Q${r(wx + 0.045 * s)} ${r(top - 0.075 * s)} ${r(wx + 0.043 * s)} ${r(top - 0.115 * s)} Z" fill="#f2df8a" opacity=".85"/>`;
  k += `<path d="M${r(wx - 0.03 * s)} ${r(top - 0.14 * s)} q.3 1.6 .3 3" stroke="#fff" stroke-width=".35" opacity=".8" fill="none"/>`;
  /* Bierdeckel / Karte */
  k += `<ellipse cx="${r(0.02 * s)}" cy="${r(top + 0.005 * s)}" rx="${r(0.05 * s)}" ry="${r(0.012 * s)}" fill="#c9a46a" opacity=".8"/>`;
  schlag(TISCH.lat, TISCH.d, 0.74, 0.7, 0.3);
  S.teil({ id: "tisch", de: "der Tisch", syl: "TISCH", it: "il tavolino", itSyl: "ta-vo-LI-no", en: "table", x: TX, y: TY, steht: true, kunst: licht(k),
    zoom: { x: r(TX - 0.6 * s), y: r(TY - 1.05 * s), w: r(1.2 * s), h: r(0.8 * s) },
    unter: [
      { id: "viez", de: "der Viez", syl: "VIEZ", it: "il sidro di Treviri", itSyl: "SI-dro di TRE-vi-ri", en: "Trier cider", x: r(TX + vx), y: r(TY + top + 0.01 * s), kunst: flaeche(-0.08 * s, -0.14 * s, 0.16 * s, 0.15 * s, 0.4),
        tipp: "Viez ist ein saurer Apfelwein aus der Gegend von Trier. Man trinkt ihn aus einem Becher aus Porzellan, der Viezporz." },
      { id: "moselwein", de: "der Moselwein", syl: "MO-sel-wein", it: "il vino della Mosella", itSyl: "VI-no del-la mo-SEL-la", en: "Moselle wine", x: r(TX + wx), y: r(TY + top + 0.01 * s), kunst: flaeche(-0.06 * s, -0.17 * s, 0.12 * s, 0.18 * s, 0.4),
        tipp: "An der Mosel wächst viel Riesling. Schon die Römer haben hier Wein angebaut." },
    ] });
}

/* Schatten des Eckhauses (links) fällt nach rechts hinten auf den Platz */
{
  const L = 1.3 * 15.5, dl = Math.sin(35 * Math.PI / 180) * L, dd = Math.cos(35 * Math.PI / 180) * L;
  const pts = [[-12.5, 28], [-12.5 + dl, 28 + dd], [-12.5 + dl, 46 + dd], [-20.5 + dl, 46 + dd], [-20.5, 46], [-12.5, 46]].map(([la, d]) => proj(la, d));
  SCHATTEN.unshift(`<path d="M${pts.map((p) => p.join(" ")).join(" L")} Z" fill="#3a3a48" opacity=".28"/>`);
}
/* Schlagschatten auf das Pflaster (sie gehören zur Bodenfläche) */
PFLASTER_TEIL.kunst += SCHATTEN.join("");

/* Nachmittagslicht über allem (fängt keinen Tipp ab) */
S.davor(`<rect width="${W}" height="${HH}" fill="${S.rg("abend", [[0, "#ffe2b0", 0.12], [0.6, "#ffe2b0", 0], [1, "#000", 0.08]], 0.05, 0.5, 1.1)}" pointer-events="none"/>`);

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/trier.js"));
console.log(aus);
