#!/usr/bin/env node
/* =====================================================================
   TRIER (FASSUNG 854, Runde 2) — Bilderwelt neu: eine echte Stadtansicht
   ---------------------------------------------------------------------
   XANDER (03.10.): „die bekannten Sehenswürdigkeiten … mit Recherche zu
   den einzelnen Städten in Deutschland … auf Hollywood-Niveau“.

   RECHERCHE (Trier Tourismus und Marketing, KuLaDig „Porta Nigra“,
   katholisch.de „Die Porta Nigra wird 1.850 Jahre alt“, Stadtmuseum
   Simeonstift / museum-trier.de „Geschichte des Museums“, Wikipedia
   „Simeonstift of Trier“, steine-und-minerale.de, trierer-original.de,
   Park Plaza „Fakten über die Porta Nigra“, Reiseberichte zum
   „Römer-Express“):
   - STANDORT: der Vorplatz auf der STADTSEITE (Süden) am Ende der
     Simeonstraße, etwa 70 m vor dem Tor, Blick nach Norden. Links
     (Westen) das letzte Haus der Simeonstraße mit einem Café und dahinter,
     direkt am Westturm, das SIMEONSTIFT (romanischer Stiftsbau, gegründet
     1034, heute Stadtmuseum; die Quellen nennen „Simeonstiftplatz und das
     Stadtmuseum im Westen“ des Tores). Rechts (Osten) die Apsis am
     Ostturm, dahinter Bäume und Häuser. Nachmittag: die Sonne steht im
     Südwesten hinter uns links; Licht von links, Schatten fallen lang
     nach rechts hinten.
   - PORTA NIGRA (um 170 n. Chr., UNESCO-Welterbe seit 1986): Doppeltor
     mit zwei Durchfahrten in einem dreigeschossigen Mittelbau; dahinter
     ein Torhof (oben offen), dann die Bögen der Feldseite. An jeder Seite
     ein Turm; auf der Stadtseite bilden die Türme flache Risalite.
     Erdgeschoss mit Halbsäulen, Obergeschosse mit großen Bogenöffnungen
     zwischen Halbsäulen und Gesimsen — die Geschosse wirken wie offene
     Arkaden. Die Halbsäulen, Kapitelle und Basen sind NIE FERTIG
     GEMEISSELT worden (rohe Bossen). WESTTURM vier Geschosse (≈ 30 m),
     OSTTURM drei (≈ 23 m): im Mittelalter (Simeonskirche) riss man ein
     Geschoss ab; Erzbischof Albero baute um 1150 den Ostchor an — die
     halbrunde APSIS (hellerer, jüngerer Stein) steht noch. Breite 36 m.
     Grauer Sandstein in Quadern bis zu sechs Tonnen, ohne Mörtel, nur mit
     Eisenklammern verbunden; Metalldiebe brachen die Klammern im
     Mittelalter heraus — die LÖCHER sieht man überall. Der Stein ist mit
     der Zeit schwarz geworden: dunkle Laufspuren unter Gesimsen und
     Fensterbänken, schwarze Krusten an geschützten Stellen, ausgewaschene
     hellere Flächen.
   - TYPISCH: Erlebnisführungen mit Darstellern in römischer Kleidung (ein
     Zenturio: rote Tunika, Kettenhemd mit Schulterdopplung, Orden
     (Phalerae) am Riemengeschirr, Gürtel mit Lederstreifen, Schwert
     links, Querkamm am Helm, Stock aus Rebholz (vitis) als Rangzeichen, Caligae);
     der „Römer-Express“, eine kleine Stadtrundfahrt-Bahn, startet an der
     Porta Nigra; Moselwein (Riesling) im „Römer“-Glas mit grünem Stiel;
     Viez (Trierer Apfelwein) im weißen Porzellanbecher, der Viezporz;
     Reibekuchen (in Trier „Gromperekichelcher“) mit Apfelmus;
     Touristen, Tauben, Radfahrer.
     FASSUNG 880 — XANDER (Funk 299): ‚stell den Alkohol wieder her … die Städte sollen authentisch dargestellt werden‘:
     Viez, Moselwein und Riesling (Tafel, Schirm, Tisch, Gast) sind wieder da.
   UNSICHER (ohne Foto-Beleg, aus Fachwissen): die genaue Zahl der
   Fensterachsen (hier Türme je 3, Mittelbau 4), die Ausführung der Apsis,
   wie viel vom Simeonstift von hier zu sehen ist, die Farben der Bahn.
   Maßstab: Augenhöhe y = 200 (1,7 m), Brennweite 480 Einheiten,
   Bildmitte x = 200. Am Boden gilt: Einheiten je Meter = (y − 200) / 1,7.
   Das Tor (70 m) hat 6,86 Einheiten je Meter, Fuß bei y = 211,7.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");
globalThis.window = globalThis;
require(path.join(__dirname, "../../../bilderwelt-neu/figuren/mensch.js"));
const POSEN = globalThis.DMA_MENSCH.POSEN;

const S = neueSzene({ id: "trier", titel: "Trier", emoji: "🏺", thema: "Deutschland", kuerzel: "trr", fassung: 854, breite: 400, hoehe: 260 });
const rnd = zufall(170);
const r = B.r;
const W = 400, HH = 260, HOR = 200, F = 480, AUGE = 1.7;
const km = (y) => (y - HOR) / AUGE;
const proj = (lat, d, h = 0) => [r(200 + lat * F / d), r(HOR + (AUGE - h) * F / d)];
const pfad = (pts) => `M${pts.map((p) => p.join(" ")).join(" L")} Z`;

S.def(`<filter color-interpolation-filters="sRGB" id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter color-interpolation-filters="sRGB" id="${S.id("weich")}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation=".15"/></filter>`);
/* Licht von links (Sonne im Südwesten): Lichtkante INNEN an der linken Kontur, weicher Eigenschatten rechts */
S.def(`<filter color-interpolation-filters="sRGB" id="${S.id("licht")}" x="-5%" y="-5%" width="110%" height="110%"><feOffset in="SourceAlpha" dx=".15" result="o"/><feComposite in="SourceAlpha" in2="o" operator="out" result="rk"/><feFlood flood-color="#ffe2b0" flood-opacity=".75"/><feComposite in2="rk" operator="in" result="kante"/><feOffset in="SourceAlpha" dx="-.5" result="o2"/><feComposite in="SourceAlpha" in2="o2" operator="out" result="lk"/><feGaussianBlur in="lk" stdDeviation=".35" result="lk2"/><feFlood flood-color="#1f1a24" flood-opacity=".38"/><feComposite in2="lk2" operator="in" result="eigen"/><feComposite in="eigen" in2="SourceAlpha" operator="in" result="eigen2"/><feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="eigen2"/><feMergeNode in="kante"/></feMerge></filter>`);
const licht = (svg) => `<g filter="url(#${S.id("licht")})">${svg}</g>`;

const GOLD = S.lg("gold", [[0, "#fff1b0"], [0.45, "#f0c64a"], [1, "#a8781a"]], 0, 0, 1, 1);
const LAUF = S.lg("lauf", [[0, "#0b0a09", 0.6], [1, "#0b0a09", 0]]);            /* Laufspur, oben dunkel, unten ausgelaufen */
/* Laufspur: setzt oben am Gesims an, wird nach unten schmaler und blasser (keine harten Seitenkanten) */
const lauf = (x, y, w, h) => `<path d="M${r(x - w / 2)} ${r(y)} h${r(w)} q${r(-w * 0.1)} ${r(h * 0.5)} ${r(-w * 0.4)} ${r(h)} h${r(-w * 0.2)} q${r(-w * 0.2)} ${r(-h * 0.5)} ${r(-w * 0.4)} ${r(-h)} Z" fill="${LAUF}"/>`;
const SCHATTENBAND = S.lg("schband", [[0, "#0b0a09", 0.65], [1, "#0b0a09", 0]]);
const WASCH = S.lg("wasch", [[0, "#b3aa92", 0.32], [1, "#b3aa92", 0]]);              /* Auswaschung, oben hell */
const TRICHTER = S.lg("trichter", [[0, "#060505"], [0.55, "#1e1b18"], [1, "#857b69"]]);
const SSCHATTEN = S.lg("sschat", [[0, "#070606", 0.45], [0.6, "#070606", 0.2], [1, "#070606", 0]], 0, 0, 1, 0);
S.def(`<filter color-interpolation-filters="sRGB" id="${S.id("wblur")}" x="-60%" y="-20%" width="220%" height="140%"><feGaussianBlur stdDeviation=".7"/></filter>`);

/* Schlagschatten: Sonne hinten links (SW), Höhe ≈ 30° — lange Schatten nach rechts hinten.
   Sie liegen auf dem Pflaster (Bodenfläche), nicht am Ding. */
const SCHATTEN = [];
const SONNE = { az: 35 * Math.PI / 180, lang: 1.7 };
const schlag = (lat, d, hoeheM, breiteM = 0.5, a = 0.42) => {
  const L = SONNE.lang * hoeheM, dl = Math.sin(SONNE.az) * L, dd = Math.cos(SONNE.az) * L;
  const p = [[lat - breiteM / 2, d], [lat + breiteM / 2, d], [lat + dl + breiteM * 0.25, d + dd], [lat + dl - breiteM * 0.25, d + dd]].map(([a1, b1]) => proj(a1, b1));
  SCHATTEN.push(`<path d="${pfad(p)}" fill="#2a2630" opacity="${a}"/>`);
};

/* Pfade verdichten: absolut runden (Raster q), dann relativ schreiben — keine Drift, kürzere Zahlen */
function pfadKurz(d, q) {
  const tok = d.match(/[a-zA-Z]|-?(?:\d+\.?\d*|\.\d+)(?:e-?\d+)?/g);
  if (!tok) return d;
  const N = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7, Z: 0 };
  const rd = (v) => Math.round(v / q) * q;
  const fmt = (v) => { let s = (Math.round(v * 1000) / 1000).toString(); if (s.startsWith("0.")) s = s.slice(1); else if (s.startsWith("-0.")) s = "-" + s.slice(2); return s; };
  let i = 0, cx = 0, cy = 0, sx = 0, sy = 0, out = "", cmd = null;
  /* aktuelle Position im gerundeten Raster */
  let rx = 0, ry = 0, rsx = 0, rsy = 0;
  const num = () => parseFloat(tok[i++]);
  const join = (arr) => { let s = ""; for (const v of arr) { const t = fmt(v); s += (s && !t.startsWith("-") ? " " : "") + t; } return s; };
  while (i < tok.length) {
    if (/[a-zA-Z]/.test(tok[i])) cmd = tok[i++];
    else if (cmd === null) return d;
    const C = cmd.toUpperCase(), rel = cmd !== C;
    if (C === "Z") { out += "z"; cx = sx; cy = sy; rx = rsx; ry = rsy; if (i < tok.length && !/[a-zA-Z]/.test(tok[i])) return d; continue; }
    const n = N[C]; if (n === undefined) return d;
    const a = []; for (let k = 0; k < n; k++) { if (i >= tok.length || /[a-zA-Z]/.test(tok[i])) return d; a.push(num()); }
    let p;
    if (C === "H") { const x = rel ? cx + a[0] : a[0]; cx = x; const X = rd(x); out += "h" + fmt(X - rx); rx = X; }
    else if (C === "V") { const y = rel ? cy + a[0] : a[0]; cy = y; const Y = rd(y); out += "v" + fmt(Y - ry); ry = Y; }
    else if (C === "A") {
      const x = rel ? cx + a[5] : a[5], y = rel ? cy + a[6] : a[6]; cx = x; cy = y; const X = rd(x), Y = rd(y);
      out += "a" + join([rd(a[0]), rd(a[1]), Math.round(a[2])]) + " " + (a[3] ? 1 : 0) + " " + (a[4] ? 1 : 0) + " " + join([X - rx, Y - ry]); rx = X; ry = Y;
    } else {
      const pts = [];
      for (let k = 0; k < n; k += 2) { const x = rel ? cx + a[k] : a[k], y = rel ? cy + a[k + 1] : a[k + 1]; pts.push([x, y]); }
      const end = pts[pts.length - 1];
      const R = pts.map(([x, y]) => [rd(x) - rx, rd(y) - ry]);
      out += (C === "M" ? "m" : C.toLowerCase()) + join(R.flat());
      cx = end[0]; cy = end[1]; rx = rd(cx); ry = rd(cy);
      if (C === "M") { sx = cx; sy = cy; rsx = rx; rsy = ry; cmd = rel ? "l" : "L"; }
    }
  }
  /* das erste m ist relativ zu 0,0 — das ist dasselbe wie absolut */
  return out;
}
function verdichteSVG(svg, q) {
  return svg.replace(/ d="([^"]+)"/g, (m, d) => ` d="${pfadKurz(d, q)}"`);
}
/* Mensch aus dem Baukasten, ohne runden Bodenschatten und ohne feinste Linien; Pfade fein (0,4 cm) und relativ */
function figur(spec, hoehe, q = 0.4) {
  const m = B.mensch(spec, hoehe);
  let z = m.z.svg.replace(/(<g class="mensch">(?:<defs>.*?<\/defs>)?)<ellipse[^>]*\/>/s, "$1");
  z = z.replace(/<path [^>]*\/>/g, (t) => (/fill="none"/.test(t) && +((t.match(/stroke-width="([\d.]+)"/) || [])[1] || 9) < 0.4) ? "" : t);
  z = verdichteSVG(z, q);
  return { svg: `<g transform="scale(${m.k.toFixed(4)})">${z}</g>`, inner: z, k: m.k, z: m.z };
}
/* kleine Figur in der Ferne, mit Lichtseite links und Körperschatten rechts */
function passant(x, y, h, o = {}) {
  const { hemd = "#3d5a80", hose = "#2f3640", haar = "#4a3426", haut = "#e3b796", schritt = 0.1, rueck = false } = o;
  const X = (f) => r(x + f * h), Y = (f) => r(y - f * h);
  let g = `<path d="M${X(-0.05)} ${Y(0.5)} L${X(-0.06 - schritt)} ${Y(0.02)} L${X(-0.01 - schritt)} ${Y(0.02)} L${X(0)} ${Y(0.4)} L${X(0.01 + schritt)} ${Y(0.02)} L${X(0.06 + schritt)} ${Y(0.02)} L${X(0.05)} ${Y(0.5)} Z" fill="${hose}"/>`;
  g += `<path d="M${X(-0.11)} ${Y(0.82)} Q${X(-0.12)} ${Y(0.6)} ${X(-0.09)} ${Y(0.48)} L${X(0.09)} ${Y(0.48)} Q${X(0.12)} ${Y(0.6)} ${X(0.11)} ${Y(0.82)} Q${X(0)} ${Y(0.85)} ${X(-0.11)} ${Y(0.82)} Z" fill="${hemd}"/>`;
  g += `<path d="M${X(0.02)} ${Y(0.83)} Q${X(0.12)} ${Y(0.6)} ${X(0.09)} ${Y(0.48)} L${X(0.03)} ${Y(0.48)} Q${X(0.06)} ${Y(0.64)} ${X(0.02)} ${Y(0.83)} Z" fill="#1a1620" opacity=".3"/>`;
  g += `<path d="M${X(-0.11)} ${Y(0.8)} L${X(-0.14)} ${Y(0.53)} M${X(0.11)} ${Y(0.8)} L${X(0.14)} ${Y(0.53)}" stroke="${hemd}" stroke-width="${r(0.055 * h)}" stroke-linecap="round"/>`;
  g += `<rect x="${X(-0.025)}" y="${Y(0.88)}" width="${r(0.05 * h)}" height="${r(0.06 * h)}" fill="${haut}"/><ellipse cx="${X(0)}" cy="${Y(0.93)}" rx="${r(0.06 * h)}" ry="${r(0.07 * h)}" fill="${haut}"/>`;
  g += rueck ? `<ellipse cx="${X(0)}" cy="${Y(0.94)}" rx="${r(0.064 * h)}" ry="${r(0.072 * h)}" fill="${haar}"/>` : `<path d="M${X(-0.064)} ${Y(0.93)} Q${X(-0.06)} ${Y(1.01)} ${X(0)} ${Y(1.005)} Q${X(0.06)} ${Y(1.01)} ${X(0.064)} ${Y(0.93)} Q${X(0.03)} ${Y(0.975)} ${X(-0.064)} ${Y(0.93)} Z" fill="${haar}"/>`;
  return g;
}
/* Wolke: klare Kontur, drei Tonstufen — warme Unterseite, Licht links oben */
function wolke(x, y, w, h, seed) {
  const z = zufall(seed), c = [];
  const n = Math.max(4, Math.round(w / 5));
  for (let i = 0; i < n; i++) { const t = (i + 0.5) / n, hh = h * (0.45 + 0.55 * Math.sin(Math.PI * t)) * (0.7 + z() * 0.5); c.push([x - w / 2 + t * w, y - hh * 0.55, hh * 0.55]); }
  for (let i = 0; i < n - 1; i++) c.push([x - w / 2 + (i + 1) / n * w, y - h * 0.18, h * 0.32]);
  const id = S.id("wk" + seed);
  S.def(`<g id="${id}">${c.map(([a, b, rr]) => `<circle cx="${r(a)}" cy="${r(b)}" r="${r(rr)}"/>`).join("")}<rect x="${r(x - w / 2)}" y="${r(y - h * 0.3)}" width="${r(w)}" height="${r(h * 0.3)}" rx="${r(h * 0.15)}"/></g>`);
  const lage = (dx, dy, f, fill) => `<use href="#${id}" fill="${fill}" transform="translate(${r(x + dx)} ${r(y + dy)}) scale(${f}) translate(${r(-x)} ${r(-y)})"/>`;
  return `<g filter="url(#${S.id("weich")})">${lage(0, 0, 1, "#e6cdbd")}${lage(-0.8, -1.4, 0.94, "#f6efe9")}${lage(-2.2, -2.8, 0.76, "#fffaf0")}</g>`;
}
/* Laubkrone ohne Weichzeichner: Kern-Ellipse und Randbüschel (gekerbter Rand), eine Form, viermal per <use>
   (Schatten, Mitte, Licht, Glanz, Licht von der Seite lx); dunkle Astlücken, in denen ein Ast verschwindet */
function krone(x, cy, rx, ry, seed, o) {
  const { n = 16, rb = 0.22, lappen = 4, farben, lx = 1, bluete = false, rinde = "#3e3226" } = o;
  const z = zufall(seed), R = Math.min(rx, ry);
  let c = `<ellipse cx="${r(x)}" cy="${r(cy)}" rx="${r(rx * 0.86)}" ry="${r(ry * 0.84)}"/>`;
  for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2 + (z() - 0.5) * 0.4, f = 0.8 + z() * 0.22; c += `<circle cx="${r(x + Math.cos(a) * rx * f)}" cy="${r(cy + Math.sin(a) * ry * f)}" r="${r(R * rb * (0.7 + z() * 0.6))}"/>`; }
  for (let i = 0; i < lappen; i++) { const a = -Math.PI * (0.1 + z() * 0.8), f = 0.7 + z() * 0.2; c += `<circle cx="${r(x + Math.cos(a) * rx * f)}" cy="${r(cy + Math.sin(a) * ry * f)}" r="${r(R * (0.28 + z() * 0.12))}"/>`; }
  const id = S.id("kr" + seed);
  S.def(`<g id="${id}">${c}</g>`);
  const lage = (dx, dy, f, fill) => `<use href="#${id}" fill="${fill}" transform="translate(${r(x + dx)} ${r(cy + dy)}) scale(${f}) translate(${r(-x)} ${r(-cy)})"/>`;
  let g = lage(0, 0, 1, farben[0]) + lage(lx * R * 0.06, -R * 0.07, 0.9, farben[1]) + lage(lx * R * 0.17, -R * 0.18, 0.68, farben[2]) + lage(lx * R * 0.28, -R * 0.3, 0.4, farben[3]);
  /* Astlücken: unregelmäßige dunkle Lücken auf der Schattenseite; ein Aststück kommt von unten und verschwindet im Laub,
     zwei Blattbüschel brechen den Rand der Lücke */
  for (let i = 0; i < 3; i++) {
    const a = Math.PI * (lx > 0 ? 0.45 + i * 0.22 + z() * 0.1 : 0.55 - i * 0.22 - z() * 0.1), gx = x + Math.cos(a) * rx * 0.62, gy = cy + Math.sin(a) * ry * 0.55, w = R * (0.09 + z() * 0.04);
    let gp = "";
    for (let j = 0; j < 7; j++) { const b2 = j / 7 * Math.PI * 2, f = 0.55 + z() * 0.6; gp += `${j ? "L" : "M"}${r(gx + Math.cos(b2) * w * f)} ${r(gy + Math.sin(b2) * w * 0.75 * f)} `; }
    g += `<path d="${gp}Z" fill="${farben[4] || "#16240f"}"/>`;
    g += `<path d="M${r(gx - w * 0.5)} ${r(gy + w * 0.75)} L${r(gx - w * 0.35)} ${r(gy + w * 0.75)} L${r(gx + w * 0.15)} ${r(gy - w * 0.15)} L${r(gx + w * 0.08)} ${r(gy - w * 0.2)} Z" fill="${rinde}"/>`;
    for (let j = 0; j < 2; j++) { const b2 = z() * Math.PI * 2; g += `<circle cx="${r(gx + Math.cos(b2) * w * 0.8)}" cy="${r(gy + Math.sin(b2) * w * 0.6)}" r="${r(w * 0.45)}" fill="${farben[1]}"/>`; }
  }
  /* Blattbüschel brechen den Kronenrand an vier Stellen auf */
  for (let i = 0; i < 4; i++) { const a = -Math.PI * (0.1 + i * 0.26 + z() * 0.08), bx = x + Math.cos(a) * rx * 1.02, by = cy + Math.sin(a) * ry * 1.0; for (let j = 0; j < 3; j++) g += `<circle cx="${r(bx + (j - 1) * R * 0.07)}" cy="${r(by - (j % 2) * R * 0.05)}" r="${r(R * 0.06)}" fill="${farben[j === 1 ? 2 : 1]}"/>`; }
  /* Kastanie: Blütenkerzen in Gruppen auf der Lichtseite, schmal kegelig, cremeweiß mit rosa Hauch */
  if (bluete) for (let i = 0; i < 5; i++) {
    const a = -Math.PI * (lx > 0 ? 0.08 + z() * 0.45 : 0.47 + z() * 0.45), f = 0.45 + z() * 0.45, bx = x + Math.cos(a) * rx * f, by = cy + Math.sin(a) * ry * f, bh = R * 0.22;
    for (let j = 0; j < 3; j++) { const cx2 = bx + (j - 1) * R * 0.08, cy2 = by + (j % 2) * R * 0.05; g += `<path d="M${r(cx2 - bh * 0.16)} ${r(cy2)} Q${r(cx2 - bh * 0.1)} ${r(cy2 - bh * 0.7)} ${r(cx2)} ${r(cy2 - bh)} Q${r(cx2 + bh * 0.1)} ${r(cy2 - bh * 0.7)} ${r(cx2 + bh * 0.16)} ${r(cy2)} Z" fill="#f6f0e2"/><circle cx="${r(cx2)}" cy="${r(cy2 - bh * 0.35)}" r="${r(bh * 0.07)}" fill="#e8a8b4"/>`; }
  }
  return g;
}
/* Laubbaum (Platane): gefleckter Stamm, Äste verschwinden in der Krone, breite unregelmäßige Krone, Licht von links */
function baum(x, y, h, seed) {
  const kr = h * 0.36, cy = y - h * 0.64;
  let g = `<path d="M${r(x)} ${r(y - h * 0.42)} L${r(x - kr * 0.45)} ${r(cy + kr * 0.2)} M${r(x)} ${r(y - h * 0.46)} L${r(x + kr * 0.4)} ${r(cy + kr * 0.15)}" stroke="#7a705e" stroke-width="${r(h * 0.016)}"/>`;
  g += `<path d="M${r(x - h * 0.03)} ${y} L${r(x - h * 0.014)} ${r(y - h * 0.5)} L${r(x + h * 0.014)} ${r(y - h * 0.5)} L${r(x + h * 0.028)} ${y} Z" fill="#9a907c"/>`;
  g += `<path d="M${r(x - h * 0.02)} ${r(y - h * 0.15)} h${r(h * 0.02)} v${r(-h * 0.06)} h${r(-h * 0.02)} Z M${r(x)} ${r(y - h * 0.32)} h${r(h * 0.015)} v${r(-h * 0.05)} h${r(-h * 0.015)} Z" fill="#d6cdb4"/>`;
  return g + krone(x, cy, kr * 1.15, kr * 0.85, seed, { n: 18, rb: 0.24, farben: ["#2f4a26", "#4a6c32", "#7d9e48", "#a8c26a"], lx: -1, rinde: "#6a604e" });
}

/* =====================================================================
   KULISSE — Nachmittagshimmel (zum Horizont warm), Häuser jenseits des Tores
   ===================================================================== */
const HIMMEL = S.lg("himmel", [[0, "#4a82c4"], [0.3, "#86b0da"], [0.5, "#d9d6cc"], [0.7, "#f2d6aa"], [1, "#f6c88a"]]);
S.hinten(`<rect width="${W}" height="${HOR + 6}" fill="${HIMMEL}"/>`);
S.hinten(`<circle cx="-40" cy="150" r="190" fill="${S.rg("sonne", [[0, "#fff0c8", 0.6], [0.4, "#ffe0a0", 0.22], [1, "#ffe0a0", 0]])}"/>`);
S.hinten(wolke(56, 34, 44, 14, 5) + wolke(300, 26, 56, 17, 21) + wolke(372, 76, 26, 7, 33) + wolke(196, 18, 22, 6, 45) + wolke(150, 58, 14, 4, 57));
{
  /* rechts hinter der Apsis: Häuser am Porta-Nigra-Platz (Luftperspektive: blasser, aber scharf) */
  let c = "";
  const z = zufall(9);
  let lat = 21;
  while (lat < 44) {
    const bw = 6 + z() * 4, d = 96, [x0, y0] = proj(lat, d), [x1] = proj(lat + bw, d), K = F / d, h = (14 + z() * 5) * K;
    const top = r(y0 - h);
    c += `<rect x="${x0}" y="${top}" width="${r(x1 - x0 - 0.3)}" height="${r(y0 - top)}" fill="${z() < 0.5 ? "#e3d8c6" : "#d6cbb8"}"/>`;
    c += z() < 0.6 ? `<path d="M${r(x0 - 0.4)} ${top} L${r((x0 + x1) / 2)} ${r(top - (x1 - x0) * 0.35)} L${r(x1 + 0.1)} ${top} Z" fill="#a0786a"/>` : `<rect x="${r(x0 - 0.3)}" y="${r(top - 1.4)}" width="${r(x1 - x0 + 0.3)}" height="1.4" fill="#c9bea9"/>`;
    c += `<rect x="${x0}" y="${r(top + 0.2)}" width="${r(x1 - x0 - 0.3)}" height=".5" fill="#b8ac96"/>`;
    for (let j = 0; j < 4; j++) for (let i = 0; i < 3; i++) { const wx = r(x0 + 1.4 + i * (x1 - x0 - 2) / 3), wy = r(top + 3 + j * 4.6); c += `<rect x="${wx}" y="${wy}" width="1.5" height="2.6" fill="#8d9aa6"/><path d="M${r(wx + 0.75)} ${wy} v2.6 M${wx} ${r(wy + 1.1)} h1.5" stroke="#e6ddcc" stroke-width=".2"/>`; }
    lat += bw;
  }
  S.hinten(`<g opacity=".75">${c}</g>`);
  S.hinten(`<rect x="0" y="${HOR - 44}" width="${W}" height="50" fill="${S.lg("dunstband", [[0, "#efe1cc", 0], [1, "#efe1cc", 0.5]])}"/>`);
}

/* =====================================================================
   0 — DAS PFLASTER (Vorplatz: helle Granitplatten, vor dem Tor ein
       Band aus dunklem Basalt, Rinne, Gullydeckel, Laub)
   ===================================================================== */
let PFLASTER_TEIL;
{
  let f = `<rect x="0" y="${HOR}" width="${W}" height="${HH - HOR}" fill="${S.lg("pfl", [[0, "#a9a39a"], [0.4, "#b9b2a7"], [1, "#c8c0b3"]])}"/>`;
  /* Basaltband vor der Porta Nigra (d 62–70) */
  const [b1x, b1y] = proj(-40, 70), [b2x, b2y] = proj(-40, 62);
  f += `<rect x="0" y="${b1y}" width="${W}" height="${r(b2y - b1y)}" fill="#6e6a64"/>`;
  { const [, k1] = proj(0, 62), [, k2] = proj(0, 56); f += `<rect x="0" y="${k1}" width="${W}" height="${r(k2 - k1)}" fill="#8e877b"/>`; let kp = ""; for (let yy = k1 + 0.5; yy < k2; yy += 0.7) kp += `M0 ${r(yy)} H${W} `; f += `<path d="${kp}" stroke="#6a645a" stroke-width=".22" stroke-dasharray=".6 .25"/>`; }
  let q = "";
  for (let d = 70; d > 13; d -= (d > 40 ? 2.4 : 1.2)) { const y = r(HOR + AUGE * F / d); if (y > HH) break; q += `M0 ${y} H${W} `; }
  f += `<path d="${q}" stroke="#8a8479" stroke-width=".3" opacity=".75"/>`;
  /* Längsfugen zum Fluchtpunkt, versetzt (jede zweite Reihe um eine halbe Platte) */
  let l = "";
  for (let lat = -30; lat <= 30; lat += 0.8) {
    const [x1, y1] = proj(lat, 62); let [x2, y2] = proj(lat, 13.6);
    if (x1 < 0 || x1 > W) continue;
    if (x2 < 0 || x2 > W) { const xb = x2 < 0 ? 0 : W, t = (xb - x1) / (x2 - x1); x2 = xb; y2 = r(y1 + t * (y2 - y1)); }
    l += `M${x1} ${y1} L${x2} ${y2} `;
  }
  f += `<path d="${l}" stroke="#8a8479" stroke-width=".25" opacity=".45"/>`;
  /* einzelne Platten heller oder dunkler */
  const z = zufall(4);
  for (let i = 0; i < 70; i++) {
    const d = 15 + Math.pow(z(), 1.4) * 45, lat = (z() - 0.5) * 30, d2 = d - (d > 40 ? 2.4 : 1.2);
    const p = [proj(lat, d), proj(lat + 0.8, d), proj(lat + 0.8, d2), proj(lat, d2)];
    if (p.some(([x]) => x < 0 || x > W) || p.some(([, y]) => y > HH)) continue;
    f += `<path d="${pfad(p)}" fill="${z() < 0.5 ? "#d2cbbd" : "#9a9388"}" opacity=".35"/>`;
  }
  /* Rinne (Basalt) und ein Gullydeckel */
  const [r1x, r1y] = proj(0.6, 62), [r2x, r2y] = proj(0.6, 13.6);
  f += `<path d="M${r1x} ${r1y} L${r2x} ${r2y}" stroke="#5f5a53" stroke-width="1.6" opacity=".55"/><path d="M${r(r1x + 0.3)} ${r1y} L${r(r2x + 1.2)} ${r2y}" stroke="#d8d1c2" stroke-width=".5" opacity=".5"/>`;
  {
    const [gx, gy] = proj(3.6, 16.2), s = km(gy);
    f += `<ellipse cx="${gx}" cy="${gy}" rx="${r(0.32 * s)}" ry="${r(0.09 * s)}" fill="#4a4743"/><ellipse cx="${gx}" cy="${gy}" rx="${r(0.27 * s)}" ry="${r(0.07 * s)}" fill="#5e5a54"/>`;
    for (let i = -2; i <= 2; i++) f += `<path d="M${r(gx + i * 0.09 * s)} ${r(gy - 0.06 * s)} v${r(0.12 * s)}" stroke="#3a3733" stroke-width=".6"/>`;
  }
  /* Laub der Platanen */
  for (let i = 0; i < 26; i++) { const [x, y] = proj(1.5 + z() * 4.5, 16 + z() * 26), s = km(y) * 0.06; f += `<path d="M${x} ${y} l${r(s)} ${r(-s * 0.5)} l${r(s * 0.5)} ${r(s * 0.6)} Z" fill="${z() < 0.5 ? "#b88a3a" : "#8a6a2a"}" opacity=".8"/>`; }
  /* Vordergrund: Laub sammelt sich in den Fugen */
  for (let i = 0; i < 30; i++) { const lat = Math.round((-4 + z() * 14) / 0.8) * 0.8 + (z() - 0.5) * 0.15, [x, y] = proj(lat, 13.8 + z() * 6), s = km(y) * 0.07; if (x > W - 2 || y > HH - 1) continue; f += `<path d="M${x} ${y} l${r(s)} ${r(-s * 0.45)} l${r(s * 0.55)} ${r(s * 0.55)} Z" fill="${z() < 0.5 ? "#b88a3a" : "#8a6a2a"}" opacity=".85"/>`; }
  f += `<rect x="0" y="${HOR}" width="${W}" height="${HH - HOR}" fill="${S.lg("pfllicht", [[0, "#ffd9a0", 0.2], [0.55, "#000", 0], [1, "#000", 0.14]], 0, 0, 1, 0)}"/>`;
  PFLASTER_TEIL = S.teil({ id: "pflaster", de: "das Pflaster", syl: "PFLAS-ter", it: "il lastricato", itSyl: "la-stri-CA-to", en: "paving", x: 0, y: 0, kunst: f });
}

/* =====================================================================
   1 — DIE BÄUME (östlich des Tores, rechts hinten)
   ===================================================================== */
{
  let k = "";
  for (const [lat, d, h, s] of [[23.5, 84, 15, 15], [29.5, 90, 15, 3], [32.5, 88, 11, 9]]) { const [x, y] = proj(lat, d); k += baum(x, y, h * F / d, s); }
  S.teil({ id: "baum", de: "der Baum", syl: "BAUM", it: "l'albero", itSyl: "AL-be-ro", en: "tree", x: 0, y: 0, kunst: licht(k) });
}

/* =====================================================================
   2 — DAS MUSEUM (Simeonstift, romanisch, westlich am Westturm)
   ===================================================================== */
{
  const d = 72, K = F / d, latR = -20.8, latL = -28.5, h = 12.5;
  const [xr, yb] = proj(latR, d), [xl] = proj(latL, d), top = r(yb - h * K);
  let k = `<rect x="${xl}" y="${top}" width="${r(xr - xl)}" height="${r(yb - top)}" fill="${S.lg("stift", [[0, "#e3d3ae"], [1, "#c9b78f"]], 0, 0, 1, 0)}"/>`;
  /* heller Sandstein: Quaderlagen mit versetzten Stoßfugen, Sockel, Traufgesims, Dach */
  let fu = "", st = "";
  const zq = zufall(14);
  let row = 0;
  for (let y = yb - 0.6 * K; y > top + 1; y -= 0.6 * K, row++) { fu += `M${xl} ${r(y)} H${xr} `; for (let x = xl + (row % 2 ? 0.9 * K : 0) + zq() * 0.4 * K; x < xr; x += (1.1 + zq() * 0.5) * K) st += `M${r(x)} ${r(y)} v${r(-0.6 * K)} `; }
  k += `<path d="${fu}${st}" stroke="#a8977a" stroke-width=".25"/>`;
  k += `<rect x="${xl}" y="${r(yb - 0.6 * K)}" width="${r(xr - xl)}" height="${r(0.6 * K)}" fill="#bfae8a"/>`;
  k += `<rect x="${xl}" y="${r(top - 2)}" width="${r(xr - xl + 1)}" height="2.4" fill="#efe2c4"/><rect x="${xl}" y="${r(top + 0.4)}" width="${r(xr - xl)}" height="1" fill="#000" opacity=".2"/><path d="M${r(xl - 2)} ${r(top - 2)} L${r(xr + 1)} ${r(top - 2)} L${r(xr - 3)} ${r(top - 9)} L${xl} ${r(top - 9)} Z" fill="${S.lg("stiftdach", [[0, "#56606b"], [1, "#3a424b"]])}"/>`;
  /* Erdgeschoss: Anschnitt des romanischen Kreuzgangs — drei Rundbögen auf Säulchen, dahinter dunkle Tiefe */
  const aw = 2.0 * K, ah = 2.2 * K, a0 = xr - 4;
  for (let i = 0; i < 3; i++) {
    const x = a0 - (i + 1) * (aw + 0.9);
    if (x < xl + 1) break;
    k += `<path d="M${r(x)} ${r(yb - 0.6 * K)} V${r(yb - ah)} A${r(aw / 2)} ${r(aw / 2)} 0 0 1 ${r(x + aw)} ${r(yb - ah)} V${r(yb - 0.6 * K)} Z" fill="${S.lg("kreuzgang", [[0, "#3a3028"], [1, "#1c1712"]])}"/>`;
    k += `<path d="M${r(x - 0.5)} ${r(yb - ah)} A${r(aw / 2 + 0.5)} ${r(aw / 2 + 0.5)} 0 0 1 ${r(x + aw + 0.5)} ${r(yb - ah)}" stroke="#f1e4c6" stroke-width=".9" fill="none"/>`;
    /* Säulchen mit Würfelkapitell zwischen den Bögen */
    k += `<rect x="${r(x + aw + 0.15)}" y="${r(yb - ah)}" width=".6" height="${r(ah - 0.6 * K)}" fill="#e6d7b4"/><rect x="${r(x + aw - 0.05)}" y="${r(yb - ah - 0.6)}" width="1" height=".8" fill="#d6c5a0"/>`;
  }
  /* oben: zwei romanische Zwillingsfenster (Mittelsäulchen, gemeinsamer Rundbogen) */
  for (const wx of [xr - 9, xr - 19]) {
    if (wx < xl + 3) continue;
    const wy = yb - 7.6 * K, ww = 1.5 * K;
    k += `<path d="M${r(wx - ww / 2 - 0.5)} ${r(wy)} v${r(-1.7 * K)} a${r(ww / 2 + 0.5)} ${r(ww / 2 + 0.5)} 0 0 1 ${r(ww + 1)} 0 v${r(1.7 * K)} Z" fill="#d3c19a"/>`;
    for (const dx of [-ww / 2, 0.15]) k += `<path d="M${r(wx + dx)} ${r(wy)} v${r(-1.6 * K)} a${r(ww / 4 - 0.1)} ${r(ww / 4 - 0.1)} 0 0 1 ${r(ww / 2 - 0.2)} 0 v${r(1.6 * K)} Z" fill="#2c2620"/>`;
    k += `<rect x="${r(wx - 0.25)}" y="${r(wy - 1.6 * K)}" width=".5" height="${r(1.6 * K)}" fill="#efe2c4"/>`;
  }
  /* Banner des Stadtmuseums */
  k += `<rect x="${r(xr - 9)}" y="${r(top + 4)}" width="5" height="${r(5.5 * K)}" fill="#8a1f2b"/><text transform="translate(${r(xr - 5.6)} ${r(top + 6)}) rotate(90)" font-size="3" fill="#f4ecd8" font-family="Arial,sans-serif" font-weight="bold">STADTMUSEUM</text>`;
  k += `<rect x="${xl}" y="${top}" width="${r(xr - xl)}" height="${r(yb - top)}" fill="${S.lg("stiftlicht", [[0, "#ffd9a0", 0.18], [1, "#000", 0.15]], 0, 0, 1, 0)}"/>`;
  S.teil({ id: "museum", de: "das Museum", syl: "mu-SE-um", it: "il museo", itSyl: "mu-SE-o", en: "museum", x: 0, y: 0, kunst: k,
    tipp: "Neben der Porta Nigra steht das Simeonstift aus dem Mittelalter. Heute ist darin das Stadtmuseum." });
}

/* =====================================================================
   3 — DIE APSIS (romanischer Ostchor, um 1150, am Ostturm)
   ===================================================================== */
{
  const d = 80, K = F / d, [xs, ys] = proj(15.4, d);
  const R = 5.4, hw = 13.5, hk = 4.8;
  let k = "";
  const x0 = xs, x1 = r(xs + R * K), y1 = r(ys - hw * K);
  const bog = (y) => `M${x0} ${y} Q${r((x0 + x1) / 2)} ${r(y - 1.2)} ${x1} ${r(y + 0.6)}`;
  /* hellerer, jüngerer Sandstein; Rundung: links im Licht, rechts im Schatten */
  k += `<path d="M${x0} ${ys} V${y1} Q${r((x0 + x1) / 2)} ${r(y1 - 1.2)} ${x1} ${r(y1 + 0.6)} V${ys} Z" fill="${S.lg("apsis", [[0, "#cdbf9f"], [0.4, "#ad9f82"], [0.8, "#7a6f5c"], [1, "#554d40"]], 0, 0, 1, 0)}"/>`;
  let fu = "";
  for (let y = ys - 2.2; y > y1 + 3; y -= 2.6) fu += `${bog(r(y))} `;
  k += `<path d="${fu}" stroke="#6e6452" stroke-width=".25" fill="none" opacity=".7"/>`;
  /* Lisenen */
  for (const t of [0.08, 0.42, 0.78]) { const x = x0 + (x1 - x0) * (1 - Math.cos(t * Math.PI / 2)); k += `<rect x="${r(x)}" y="${r(y1 + 4)}" width="${r(1.6 * (1 - t) + 0.5)}" height="${r(ys - y1 - 5.5)}" fill="${t < 0.5 ? "#d9cbab" : "#5f5647"}"/>`; }
  /* Sockelgesims und Traufgesims mit Rundbogenfries */
  k += `<path d="${bog(r(ys - 1.4 * K))}" stroke="#d9cbab" stroke-width="1.2" fill="none"/>`;
  k += `<path d="${bog(r(y1 + 1.8))}" stroke="#e3d5b5" stroke-width="1.4" fill="none"/>`;
  for (let i = 0; i < 8; i++) { const t0 = i / 8, t1 = (i + 1) / 8, xa = x0 + (x1 - x0) * (1 - Math.cos(t0 * Math.PI / 2)), xb = x0 + (x1 - x0) * (1 - Math.cos(t1 * Math.PI / 2)); k += `<path d="M${r(xa)} ${r(y1 + 4.4 + t0)} Q${r((xa + xb) / 2)} ${r(y1 + 2.6 + t0)} ${r(xb)} ${r(y1 + 4.4 + t1)}" stroke="#5a5040" stroke-width=".5" fill="none"/>`; }
  /* Rundbogenfenster mit Gewände, zur Rundung hin schmaler */
  for (const hy of [3.4, 8.0]) for (const t of [0.22, 0.6]) {
    const f = Math.cos(t * Math.PI / 2), x = x0 + (x1 - x0) * (1 - Math.cos(t * Math.PI / 2)) + 1.2, w = Math.max(1, 1.5 * K * f * 0.6), yb = ys - hy * K;
    k += `<path d="M${r(x - 0.8)} ${r(yb + 0.4)} v${r(-2.9 * K - 0.4)} q${r(w / 2 + 0.8)} ${r(-w * 0.75)} ${r(w + 1.6)} 0 v${r(2.9 * K + 0.4)} Z" fill="#e3d5b5"/>`;
    k += `<path d="M${r(x)} ${r(yb)} v${r(-2.9 * K)} q${r(w / 2)} ${r(-w * 0.6)} ${r(w)} 0 v${r(2.9 * K)} Z" fill="#1d1a16"/>`;
  }
  /* halbes Kegeldach aus Schiefer mit Reihen */
  const dach = `M${r(x0 - 0.5)} ${r(y1 + 0.3)} L${r(x0 - 0.5)} ${r(ys - (hw + hk) * K)} Q${r(x0 + (x1 - x0) * 0.55)} ${r(ys - (hw + hk * 0.55) * K)} ${r(x1 + 1.6)} ${r(y1 + 1.2)} Q${r((x0 + x1) / 2)} ${r(y1 - 0.8)} ${r(x0 - 0.5)} ${r(y1 + 0.3)} Z`;
  k += `<path d="${dach}" fill="${S.lg("apsdach", [[0, "#7c8794"], [0.5, "#4c5661"], [1, "#272d34"]], 0, 0, 1, 0)}"/>`;
  for (let i = 1; i < 10; i++) { const t = i / 10; k += `<path d="M${r(x0 - 0.5)} ${r(y1 + 0.3 - hk * K * t)} Q${r(x0 + (x1 - x0) * 0.4)} ${r(y1 - 0.4 - hk * K * t * 0.7)} ${r(x1 + 1.6 - (x1 - x0) * t * 0.9)} ${r(y1 + 1.2 - hk * K * t * 0.55)}" stroke="#2a3038" stroke-width=".3" fill="none"/>`; }
  k += `<path d="M${r(x0 - 0.5)} ${r(y1 + 0.3)} Q${r((x0 + x1) / 2)} ${r(y1 - 0.8)} ${r(x1 + 1.6)} ${r(y1 + 1.2)}" stroke="#1e2328" stroke-width=".8" fill="none"/>`;
  /* Schatten in der Kehle zum Ostturm */
  k += `<path d="M${x0} ${ys} V${y1} Q${r((x0 + x1) / 2)} ${r(y1 - 1.2)} ${x1} ${r(y1 + 0.6)} V${ys} Z" fill="${S.lg("halbschatten", [[0, "#1a1e2a", 0.12], [0.75, "#1a1e2a", 0.08], [1, "#ffb870", 0.18]])}"/>`;
  k += `<rect x="${x0}" y="${y1}" width="4" height="${r(ys - y1)}" fill="${S.lg("kehle", [[0, "#000", 0.6], [1, "#000", 0]], 0, 0, 1, 0)}"/>`;
  S.teil({ id: "apsis", de: "die Apsis", syl: "AP-sis", it: "l'abside", itSyl: "AB-si-de", en: "apse", x: 0, y: 0, kunst: k,
    tipp: "Im Mittelalter war die Porta Nigra eine Kirche. Die runde Apsis aus hellerem Stein stammt aus dieser Zeit." });
}

/* =====================================================================
   4 — DIE PORTA NIGRA (Stadtseite) — Lupe: Westturm, Torbogen, Fenster,
       Säule, Steinblock, Loch
   ===================================================================== */
const GD = 70, GK = F / GD, GLAT = -2.6;
const [GX, GY] = proj(GLAT, GD);
const M = (m) => r(m * GK);
const X = (m) => M(m), Y = (m) => -M(m);
const G = { eg: 8.0, og1: 14.5, og2: 21.0, og3: 27.6, west: 29.3, ost: 21.7, mitte: 21.0 };
const TEILE = [
  { x0: -18, x1: -6.5, h: G.west, n: 3, turm: true, geschosse: 4, seed: 11 },
  { x0: -6.5, x1: 6.5, h: G.mitte, n: 4, turm: false, geschosse: 3, seed: 23 },
  { x0: 6.5, x1: 18, h: G.ost, n: 3, turm: true, geschosse: 3, seed: 37 },
];
const FENSTER = [];      /* Mitte und Maße aller Fenster (für die Lupe) */
const BLOCK = { x: 12.4, h: 2.55, w: 1.75, hh: 0.68 };
const LOCH = { x: 0, y: 0 };   /* der gezeigte Steinblock am Ostturm */
let PN_UNTER = [];
{
  let k = "";
  const z = zufall(31);
  /* --- Mauerwerk: unregelmäßige Quaderlagen, Klammerlöcher, Patina --- */
  const mauer = (t, oberkante, wasch) => {
    let hf = "", vf = "", lip = "", hell = "", dunkel = "", loch = "", lochlicht = "";
    let h = 0;
    while (h < t.h) {
      const lh = 0.5 + z() * 0.22, y = Y(h), y2 = Y(h + lh);
      hf += `M${X(t.x0)} ${y} H${X(t.x1)} `;
      lip += `M${X(t.x0)} ${r(y2 + 0.28)} H${X(t.x1)} `;
      let x = t.x0 - z() * 1.2;
      while (x < t.x1) {
        const bw = 1.2 + z() * 0.65, xa = Math.max(t.x0, x), xb = Math.min(t.x1, x + bw);
        if (x + bw < t.x1) vf += `M${X(x + bw)} ${y} V${y2} `;
        const v = z();
        if (v < 0.12) hell += `M${X(xa)} ${y}H${X(xb)}V${y2}H${X(xa)}Z`;
        else if (v < 0.26) dunkel += `M${X(xa)} ${y}H${X(xb)}V${y2}H${X(xa)}Z`;
        /* Klammerlöcher an den Stoßfugen oben (ausgebrochen, trichterförmig) */
        if (z() < 0.15 && x + bw < t.x1) {
          const lx = X(x + bw + (z() - 0.5) * 0.2), ly = r(y2 + 0.5 + z() * 0.6), rx = r(0.55 + z() * 0.4), ry = r(rx * 0.7);
          loch += `M${r(lx - rx)} ${ly}a${rx} ${ry} 0 1 0 ${r(2 * rx)} 0a${rx} ${ry} 0 1 0 ${r(-2 * rx)} 0`;
          lochlicht += `M${r(lx - rx * 0.8)} ${r(ly + ry * 0.55)}q${rx} ${r(ry * 0.9)} ${r(rx * 1.6)} 0`;
        }
        x += bw;
      }
      h += lh;
    }
    const id = S.id("mclip" + t.seed);
    S.def(`<clipPath id="${id}"><path d="${oberkante}"/></clipPath>`);
    return `<g clip-path="url(#${id})">${wasch}<path d="${hell}" fill="#9a927e" opacity=".22"/><path d="${dunkel}" fill="#0c0b0a" opacity=".3"/><path d="${hf}${vf}" stroke="#151310" stroke-width=".38" fill="none" opacity=".85"/><path d="${lip}" stroke="#8c8476" stroke-width=".22" opacity=".6" fill="none"/><path d="${loch}" fill="#0a0908"/><path d="${lochlicht}" stroke="#8c8272" stroke-width=".3" fill="none" opacity=".8"/></g>`;
  };
  /* --- Halbsäule: nie fertig gemeißelt (rohe Bosse, unbehauene Kapitelle und Basen) --- */
  {
    const zb = zufall(12);
    let pb = "";
    /* grob gespitzte Fläche: flache Punkte und kurze Hiebe in alle Richtungen, wenig Kontrast */
    for (let i = 0; i < 40; i++) { const x = r(zb() * 6), y = r(zb() * 9), l = r(0.12 + zb() * 0.3), dunkel = zb() < 0.55; pb += `<ellipse cx="${x}" cy="${y}" rx="${l}" ry="${r(l * (zb() < 0.6 ? 0.8 : 0.35))}" transform="rotate(${Math.round(zb() * 180)} ${x} ${y})" fill="${dunkel ? "#0c0b0a" : "#a39a86"}" opacity="${r(dunkel ? 0.16 + zb() * 0.14 : 0.1 + zb() * 0.1)}"/>`; }
    S.def(`<pattern id="${S.id("bosse")}" patternUnits="userSpaceOnUse" width="6" height="9">${pb}</pattern>`);
  }
  const SAEULE = S.lg("saeule", [[0, "#6a6253"], [0.3, "#4a443a"], [0.7, "#2a2723"], [1, "#161412"]], 0, 0, 1, 0);
  const saeule = (cx, h0, h1) => {
    const cw = 0.82, xa = X(cx - cw / 2), xb = X(cx + cw / 2), ya = Y(h1 - 0.55), yb = Y(h0 + 0.45);
    /* Schlagschatten der Halbsäule nach rechts auf die Wand (Sonne links vorn) */
    let g = `<path d="M${r(xb)} ${r(ya - M(0.55))} L${r(xb + M(0.42))} ${r(ya + 1.2)} L${r(xb + M(0.42))} ${yb} L${r(xb)} ${yb} Z" fill="${SSCHATTEN}"/>`;
    /* Schaft: Umriss mit zwei, drei flachen Höckern (rohe Bosse), keine Zacken */
    let lk = `M${xa} ${yb} `, rk2 = "";
    const nh = 2 + (z() < 0.5 ? 1 : 0), st = (h1 - h0 - 1) / nh;
    for (let j = 0; j < nh; j++) { const hA = h0 + 0.45 + j * st; lk += `Q${r(xa - 0.4 - z() * 0.5)} ${Y(hA + st / 2)} ${r(xa - z() * 0.15)} ${Y(hA + st)} `; }
    for (let j = nh - 1; j >= 0; j--) { const hA = h0 + 0.45 + j * st; rk2 += `Q${r(xb + 0.3 + z() * 0.4)} ${Y(hA + st / 2)} ${r(xb + z() * 0.1)} ${Y(hA)} `; }
    g += `<path d="${lk}L${xa} ${ya} L${xb} ${ya} ${rk2}L${xb} ${yb} Z" fill="${SAEULE}"/>`;
    g += `<path d="${lk}L${xa} ${ya} L${xb} ${ya} ${rk2}L${xb} ${yb} Z" fill="url(#${S.id("bosse")})"/>`;
    g += `<path d="M${r(xa + 0.35)} ${r(ya + 1)} V${r(yb - 1)}" stroke="#a39a86" stroke-width=".5" opacity=".55"/>`;
    g += `<path d="M${r(xb - 0.1)} ${ya} V${yb}" stroke="#050505" stroke-width=".5" opacity=".6"/>`;
    g += lauf(xa + 0.8 + z() * 1.4, ya + 0.2, 1 + z() * 0.5, 5 + z() * 11);
    /* ausgewaschene Säulenvorderseite: oben hell, nach unten auslaufend */
    g += `<rect x="${r(xa + 0.6)}" y="${r(ya + 0.4)}" width="${r(xb - xa - 2)}" height="${r(M(1.5 + z() * 2.5))}" fill="${WASCH}" filter="url(#${S.id("wblur")})"/>`;
    /* unbehauenes Kapitell und Basis: rohe Blöcke mit abgeschrägten Kanten */
    g += `<path d="M${r(xa - M(0.24))} ${ya} L${r(xa - M(0.24))} ${r(ya - M(0.38))} L${r(xa - M(0.1))} ${r(ya - M(0.56))} L${r(xb + M(0.14))} ${r(ya - M(0.56))} L${r(xb + M(0.26))} ${r(ya - M(0.38))} L${r(xb + M(0.26))} ${ya} Z" fill="#5e574b"/><path d="M${r(xa - M(0.24))} ${r(ya - M(0.38))} L${r(xa - M(0.1))} ${r(ya - M(0.56))} L${r(xb + M(0.14))} ${r(ya - M(0.56))}" stroke="#aaa18b" stroke-width=".5" fill="none"/><path d="M${r(xa - M(0.24))} ${ya} H${r(xb + M(0.26))}" stroke="#0b0a09" stroke-width=".6"/>`;
    /* Schattenkeil unter dem Kapitell (Licht von links oben) */
    g += `<path d="M${r(xa - M(0.24))} ${r(ya + 0.2)} H${r(xb + M(0.26) + M(0.35))} L${r(xb + M(0.26))} ${r(ya + M(0.4))} H${r(xb)} Z" fill="#070606" opacity=".28"/>`;
    g += `<path d="M${r(xa - M(0.2))} ${r(yb + M(0.45))} L${r(xa - M(0.16))} ${yb} L${r(xb + M(0.18))} ${yb} L${r(xb + M(0.22))} ${r(yb + M(0.45))} Z" fill="#5d564b"/>`;
    return g;
  };
  /* --- Bogenöffnung: helle Laibung auf der sonnenzugewandten Seite, dahinter die graue Innenwand --- */
  const fenster = (cx, s0, fw, fh, leute) => {
    const x0 = X(cx - fw / 2), x1 = X(cx + fw / 2), yb = Y(s0), ys = Y(s0 + fh - fw / 2), rr = r((x1 - x0) / 2);
    const lat = cx + GLAT, rw = Math.max(0.5, M(1.4 * Math.abs(lat) / GD) + 0.4);
    let g = `<path d="M${r(x0 - 1.1)} ${r(yb + 0.6)} V${ys} A${r(rr + 1.1)} ${r(rr + 1.1)} 0 0 1 ${r(x1 + 1.1)} ${ys} V${r(yb + 0.6)} Z" fill="#3c372f"/>`;
    g += `<path d="M${r(x0 - 1.1)} ${ys} A${r(rr + 1.1)} ${r(rr + 1.1)} 0 0 1 ${r(x0 + rr * 0.6)} ${r(ys - rr * 0.95)}" stroke="#9a8f7c" stroke-width=".45" fill="none"/>`;
    /* Laibung: links vom Betrachter sieht man die linke (Schatten-), rechts die rechte (Licht-)Laibung */
    const links = lat < 0;
    g += `<path d="M${x0} ${yb} V${ys} A${rr} ${rr} 0 0 1 ${x1} ${ys} V${yb} Z" fill="${links ? "#1f1c19" : "#857a66"}"/>`;
    const ia = links ? r(x0 + rw) : x0, ib = links ? x1 : r(x1 - rw), ir = r((ib - ia) / 2);
    g += `<path d="M${ia} ${yb} V${ys} A${ir} ${rr} 0 0 1 ${ib} ${ys} V${yb} Z" fill="${S.lg("innen", [[0, "#1c1a17"], [0.55, "#34302b"], [1, "#46413a"]])}"/>`;
    g += `<path d="M${r(ia + 0.4)} ${r(yb - 0.6)} V${r(ys + 1)} M${r(ib - 1.2)} ${r(yb - 0.6)} V${r(ys + 1)}" stroke="#3a3530" stroke-width=".5" opacity=".7"/>`;
    const vari = FENSTER.length % 4, tief = r(z() * 0.4);
    if (tief > 0.05) g += `<path d="M${ia} ${yb} V${ys} A${ir} ${rr} 0 0 1 ${ib} ${ys} V${yb} Z" fill="#000" opacity="${tief}"/>`;   /* je Fenster andere Tiefe */
    /* schwarze Kruste oben in der Bogenlaibung */
    g += `<path d="M${r(x0 + 0.3)} ${r(ys + 0.5)} A${r(rr - 0.3)} ${r(rr - 0.3)} 0 0 1 ${r(x1 - 0.3)} ${r(ys + 0.5)}" stroke="#050505" stroke-width="1.1" fill="none" opacity=".7"/>`;
    if (leute) g += leute(r((x0 + x1) / 2), yb);
    else if (z() < 0.12) { const tx = r(x0 + rr * 0.6 + z() * rr * 0.6); g += `<ellipse cx="${tx}" cy="${r(yb - 0.7)}" rx="1.1" ry=".6" fill="#8c939c"/><circle cx="${r(tx + 0.9)}" cy="${r(yb - 1.3)}" r=".42" fill="#6f7680"/>`; }
    /* ausgebrochener Bogenstein */
    if (vari === 0 || z() < 0.15) { const a = Math.PI * (1.15 + z() * 0.7), bx = r((x0 + x1) / 2 + Math.cos(a) * (rr + 0.55)), by = r(ys + Math.sin(a) * (rr + 0.55)); g += `<path d="M${r(bx - 1.1)} ${r(by - 0.4)} l1.7 -.8 l.7 1.5 l-1.6 1 Z" fill="#0d0c0b"/><path d="M${r(bx - 1.1)} ${r(by - 0.4)} l1.7 -.8" stroke="#9a907c" stroke-width=".35"/>`; }
    /* Fensterbank, manchmal mit abgebrochener Ecke; darunter Laufspuren */
    const ecke = vari === 1 || z() < 0.15;
    g += `<rect x="${r(x0 - 1.1 + (ecke ? 0.9 : 0))}" y="${yb}" width="${r(x1 - x0 + 2.2 - (ecke ? 0.9 : 0))}" height="1" fill="#7d7464"/><rect x="${r(x0 - 1.1)}" y="${yb}" width="${r(x1 - x0 + 2.2)}" height=".3" fill="#b3aa92" opacity=".6"/>`;
    for (let n = 0; n < 2 + (vari % 2); n++) g += lauf(x0 + z() * (x1 - x0), yb + 1, 0.9 + z() * 0.7, M(0.8 + z() * 3.4));
    FENSTER.push({ cx, s0, fw, fh });
    return g;
  };
  /* Besucher im Fenster: Arme auf der Brüstung, einer mit Kamera */
  const besucher = (hemd, kamera) => (x, yb) => {
    const s = GK * 0.95;
    let g = `<path d="M${r(x - 0.24 * s)} ${yb} L${r(x - 0.2 * s)} ${r(yb - 0.42 * s)} Q${r(x)} ${r(yb - 0.5 * s)} ${r(x + 0.2 * s)} ${r(yb - 0.42 * s)} L${r(x + 0.24 * s)} ${yb} Z" fill="${hemd}"/>`;
    g += `<circle cx="${x}" cy="${r(yb - 0.62 * s)}" r="${r(0.13 * s)}" fill="#e3b796"/><path d="M${r(x - 0.13 * s)} ${r(yb - 0.64 * s)} Q${x} ${r(yb - 0.84 * s)} ${r(x + 0.13 * s)} ${r(yb - 0.64 * s)} Z" fill="#4a3426"/>`;
    g += `<path d="M${r(x - 0.22 * s)} ${r(yb - 0.36 * s)} L${r(x - 0.34 * s)} ${r(yb - 0.05 * s)} L${r(x + 0.05 * s)} ${r(yb - 0.05 * s)} M${r(x + 0.22 * s)} ${r(yb - 0.36 * s)} L${r(x + 0.32 * s)} ${r(yb - 0.05 * s)}" stroke="${hemd}" stroke-width="${r(0.09 * s)}" stroke-linecap="round" fill="none"/>`;
    g += `<path d="M${r(x - 0.05 * s)} ${r(yb - 0.63 * s)} h.01 M${r(x + 0.05 * s)} ${r(yb - 0.63 * s)} h.01" stroke="#2a1e18" stroke-width=".35" stroke-linecap="round"/>`;
    if (kamera) g += `<rect x="${r(x + 0.16 * s)}" y="${r(yb - 0.5 * s)}" width="${r(0.14 * s)}" height="${r(0.09 * s)}" rx=".2" fill="#1d1f22"/>`;
    return g;
  };

  /* Ostseite des Westturms über dem Mittelbau: läuft 21 m nach hinten, im Schatten */
  {
    const Q = (la, d, h) => [r(200 + (la + GLAT) * F / d - GX), r(HOR + (AUGE - h) * F / d - GY)];
    const pts = [Q(-6.5, GD, 14), Q(-6.5, GD, G.west - 0.7), Q(-6.5, GD + 21, G.west - 1.1), Q(-6.5, GD + 21, 14)];
    k += `<path d="${pfad(pts)}" fill="${S.lg("ostseite", [[0, "#34302c"], [1, "#25221f"]], 0, 0, 1, 0)}"/>`;
    for (const [d0, d1] of [[GD + 3.5, GD + 7], [GD + 12, GD + 15.5]]) k += `<path d="${pfad([Q(-6.5, d0, G.og2 + 1), Q(-6.5, d0, G.og2 + 4.6), Q(-6.5, d1, G.og2 + 4.6), Q(-6.5, d1, G.og2 + 1)])}" fill="#0d0c0b"/>`;
    for (const h of [G.og2, G.og3]) k += `<path d="M${Q(-6.5, GD, h).join(" ")} L${Q(-6.5, GD + 21, h).join(" ")}" stroke="#4e483f" stroke-width=".9"/>`;
  }

  for (const t of TEILE) {
    /* Oberkante: gestufte Quaderreihen mit einzelnen fehlenden Blöcken (keine Sägezähne) */
    const xl = X(t.x0), xr = X(t.x1);
    let ober = `M${xl} 0 V${Y(t.h)} `;
    let x = t.x0;
    let stufe = 0;
    while (x < t.x1 - 0.2) {
      /* Türme: unregelmäßig abgebrochene Quaderstufen (keine Zinnen), Mittelbau: einzelne fehlende Blöcke */
      let bw, drop;
      if (t.turm) { bw = Math.min(1.3 + z() * 2.2, t.x1 - x); const pIn = t.x0 < 0 ? (x - t.x0) / (t.x1 - t.x0) : (t.x1 - x - bw) / (t.x1 - t.x0); stufe = Math.max(stufe, Math.min(3, Math.round(Math.pow(Math.max(0, pIn), 1.4) * 2.2 + (z() - 0.5) * 0.5))); if (t.x0 > 0) stufe = Math.max(0, Math.min(3, Math.round(Math.pow(Math.max(0, pIn), 1.4) * 3.2 + (z() - 0.5) * 0.9))); drop = stufe * 0.62; }
      else { bw = Math.min(1.2 + z() * 0.7, t.x1 - x); const v = z(); drop = v < 0.22 ? 0.62 : (v < 0.3 ? 1.24 : 0); }
      ober += `H${X(x)} V${Y(t.h - drop)} H${X(x + bw)} V${Y(t.h)} `;
      x += bw;
    }
    ober += `H${xr} V0 Z`;
    k += `<path d="${ober}" fill="${S.lg("stein" + t.seed, [[0, "#4a4743"], [0.5, "#383633"], [1, "#272624"]], 0, 0, 1, 0)}"/>`;
    /* ausgewaschene hellere Flächen und Laufspuren je Achse */
    const bay = (t.x1 - t.x0) / t.n;
    let wasch = "";
    for (let i = 0; i <= t.n; i++) {
      const cx = t.x0 + i * bay;
      /* helle Auswaschung: weiche, senkrecht auslaufende Bahnen unter den Gesimsen */
      for (const h of [G.eg, G.og1, G.og2, G.og3, t.h - 0.2]) if (h < t.h && z() < 0.55) wasch += `<rect x="${X(cx - bay * 0.45 + z() * bay * 0.7)}" y="${r(Y(h) + 2)}" width="${M(0.8 + z() * 1.4)}" height="${M(1.5 + z() * 3)}" fill="${WASCH}"/>`;
    }
    wasch += `<rect x="${xl}" y="${Y(t.h)}" width="${r(xr - xl)}" height="${M(1.6)}" fill="${S.lg("oberkante", [[0, "#b3aa92", 0.35], [1, "#b3aa92", 0]])}"/>`;
    k += mauer(t, ober, `<g filter="url(#${S.id("wblur")})">${wasch}</g>`);
    /* Gesimse mit Schattenband darunter (schwarze Kruste) */
    const hs = [G.eg, G.og1, G.og2, G.og3].filter((h) => h < t.h - (t.x0 > 0 ? 2 : 0.5));
    for (const h of hs) {
      k += `<rect x="${xl}" y="${r(Y(h) - 1)}" width="${r(xr - xl)}" height="2" fill="#3e3a34"/><rect x="${xl}" y="${r(Y(h) - 1)}" width="${r(xr - xl)}" height=".55" fill="#aaa18b"/>`;
      k += `<rect x="${xl}" y="${r(Y(h) + 1)}" width="${r(xr - xl)}" height="1" fill="#0b0a09" opacity=".55"/><rect x="${xl}" y="${r(Y(h) + 2)}" width="${r(xr - xl)}" height="${M(0.9)}" fill="${SCHATTENBAND}"/>`;
      /* abgebrochene Gesimskanten */
      for (let n = 0; n < 2; n++) if (z() < 0.55) { const bx = r(xl + z() * (xr - xl - 6)), bw2 = r(2.5 + z() * 3.5); k += `<path d="M${bx} ${r(Y(h) - 1)} l${r(bw2 * 0.25)} 1.9 l${r(bw2 * 0.55)} -.4 l${r(bw2 * 0.2)} -1.5 Z" fill="#141312"/><path d="M${bx} ${r(Y(h) - 1)} l${r(bw2 * 0.25)} 1.9 l${r(bw2 * 0.55)} -.4" stroke="#9a907c" stroke-width=".3" fill="none"/>`; }
    }
    /* Achsen: Halbsäulen und Bogenöffnungen */
    const etagen = [[0, G.eg], [G.eg, G.og1], [G.og1, G.og2], [G.og2, G.og3]].slice(0, t.geschosse);
    etagen.forEach(([h0, h1], e) => {
      if (e > 0) for (let i = 0; i < t.n; i++) {
        const cx = t.x0 + (i + 0.5) * bay, fw = Math.min(2.45, bay * 0.66), fh = Math.min(4.6, h1 - h0 - 1.3);
        let leute = null;
        if (t.seed === 11 && e === 3 && i === 0) leute = besucher("#c8302a", false);
        if (t.seed === 23 && e === 1 && i === 2) leute = besucher("#2f5f95", true);
        k += fenster(cx, h0 + 0.8, fw, fh, leute);
      }
      for (let i = 1; i < t.n; i++) k += saeule(t.x0 + i * bay, h0, h1);
    });
    /* Turm-Risalit: schmaler Versatz zur Mitte hin über alle Geschosse */
    if (t.turm) {
      const sx = t.x0 < 0 ? xr : xl, dir = t.x0 < 0 ? 1 : -1;
      k += `<path d="M${sx} 0 V${Y(Math.min(t.h, G.mitte))} L${r(sx + dir * 1.6)} ${r(Y(Math.min(t.h, G.mitte)) + 0.8)} V0 Z" fill="${t.x0 < 0 ? "#1d1b18" : "#6a6255"}"/>`;
    }
    if (t.seed === 11) k += `<path d="${ober}" fill="${S.rg("westlicht", [[0, "#ffcf86", 0.2], [0.55, "#ffcf86", 0.08], [1, "#ffcf86", 0]], 0.1, 0.05, 1.0)}"/>`;
    /* warmes Streiflicht von links, nach rechts schwächer */
    k += `<path d="${ober}" fill="${S.lg("pnlicht" + t.seed, [[0, "#ffc87a", t.x0 < 0 ? 0.3 : 0.12], [0.5, "#ffc87a", 0.05], [1, "#16203a", 0.2]], 0, 0, 1, 0.7)}"/>`;
  }
  /* der gezeigte Steinblock: ein normaler Quader im Verband; die Klammerlöcher sind ausgebrochene Trichter */
  {
    const bx0 = X(BLOCK.x - BLOCK.w / 2), bx1 = X(BLOCK.x + BLOCK.w / 2), by0 = Y(BLOCK.h + BLOCK.hh), by1 = Y(BLOCK.h);
    /* Quader wie seine Nachbarn: dieselben Fugen, nur etwas wärmer und mit weichem Licht oben links */
    k += `<rect x="${bx0}" y="${by0}" width="${r(bx1 - bx0)}" height="${r(by1 - by0)}" fill="#8a6a40" opacity=".14"/><rect x="${bx0}" y="${by0}" width="${r(bx1 - bx0)}" height="${r(by1 - by0)}" fill="${S.lg("blocklicht", [[0, "#b3aa92", 0.22], [0.4, "#b3aa92", 0], [1, "#b3aa92", 0]], 0, 0, 1, 1)}"/>`;
    /* Trichter in den Stein: außen ausgebrochen (nach unten heller), innen tief und dunkel */
    const trichter = (lx, ly, w) => `<path d="M${r(lx - w)} ${r(ly - 0.1 * w)} q${r(0.1 * w)} ${r(-0.6 * w)} ${r(0.8 * w)} ${r(-0.7 * w)} q${r(0.8 * w)} ${r(-0.05 * w)} ${r(1.1 * w)} ${r(0.5 * w)} q${r(0.15 * w)} ${r(0.7 * w)} ${r(-0.7 * w)} ${r(0.95 * w)} q${r(-0.9 * w)} ${r(0.1 * w)} ${r(-1.2 * w)} ${r(-0.75 * w)} Z" fill="${TRICHTER}"/><ellipse cx="${r(lx)}" cy="${r(ly - 0.25 * w)}" rx="${r(0.45 * w)}" ry="${r(0.3 * w)}" fill="#050404"/>`;
    LOCH.x = r(bx1); LOCH.y = r(by0 + (by1 - by0) * 0.45);
    k += trichter(r(bx0 + (bx1 - bx0) * 0.28), r(by0 + 0.9), 0.9) + trichter(r(bx0 + (bx1 - bx0) * 0.7), r(by0 + 0.7), 0.6) + trichter(LOCH.x, LOCH.y, 1.4);
  }
  /* die zwei Durchfahrten: Tunnel, Torhof mit Licht von oben, Bögen der Feldseite, dahinter der Platz */
  for (const cx of [-3.55, 3.55]) {
    const bw = 2.2, sp = 4.9;
    const bogen = (d, bwid, fill, extra = "") => {
      const f = GD / d, lat = cx + GLAT, xc = 200 + lat * F / d - GX, yb = HOR + AUGE * F / d - GY, w = bwid * F / d, hs = sp * F / d;
      return `<path d="M${r(xc - w)} ${r(yb)} V${r(yb - hs)} A${r(w)} ${r(w)} 0 0 1 ${r(xc + w)} ${r(yb - hs)} V${r(yb)} Z" fill="${fill}"${extra}/>`;
    };
    k += `<path d="M${X(cx - bw - 0.55)} 0 V${Y(sp)} A${M(bw + 0.55)} ${M(bw + 0.55)} 0 0 1 ${X(cx + bw + 0.55)} ${Y(sp)} V0 Z" fill="#5f584c"/>`;
    const cid = S.id("tor" + (cx < 0 ? "l" : "r"));
    S.def(`<clipPath id="${cid}"><path d="M${X(cx - bw)} 0 V${Y(sp)} A${M(bw)} ${M(bw)} 0 0 1 ${X(cx + bw)} ${Y(sp)} V0 Z"/></clipPath>`);
    k += `<g clip-path="url(#${cid})">`;
    k += bogen(GD, bw, "#151310");
    k += bogen(GD + 7, bw, S.lg("hof", [[0, "#cbbd9f"], [0.5, "#8a7f6c"], [1, "#5f574b"]]));   /* Torhof, oben offen */
    k += bogen(GD + 13.5, bw, "#1e1b18");
    k += bogen(GD + 21.5, bw, S.lg("platz", [[0, "#cfe0ea"], [0.55, "#e9e0cc"], [1, "#b9b0a0"]]));
    /* hinter dem Tor: Häuser am Porta-Nigra-Platz */
    const lat = cx + GLAT, d2 = GD + 21.5, xc = r(200 + lat * F / d2 - GX), yb = r(HOR + AUGE * F / d2 - GY), sc = F / d2;
    k += `<rect x="${r(xc - 1.9 * sc)}" y="${r(yb - 3.4 * sc)}" width="${r(1.5 * sc)}" height="${r(3.4 * sc)}" fill="#d8c8aa"/><rect x="${r(xc + 0.3 * sc)}" y="${r(yb - 3 * sc)}" width="${r(1.7 * sc)}" height="${r(3 * sc)}" fill="#c9b9a0"/>`;
    k += `<rect x="${r(xc - 1.6 * sc)}" y="${r(yb - 2.6 * sc)}" width=".9" height="1.4" fill="#7d8b97"/><rect x="${r(xc + 0.7 * sc)}" y="${r(yb - 2.2 * sc)}" width=".9" height="1.4" fill="#7d8b97"/>`;
    /* Lichtschacht des Torhofs fällt auf den Boden im Tunnel */
    const d1 = GD + 7, xh = r(200 + lat * F / d1 - GX), yh = r(HOR + AUGE * F / d1 - GY);
    k += `<path d="M${r(xh - 2 * F / d1)} ${yh} L${r(xh + 2 * F / d1)} ${yh} L${r(xh + 2.3 * F / GD)} ${r(-0.2)} L${r(xh - 2.3 * F / GD)} ${r(-0.2)} Z" fill="#c9b99a" opacity=".35"/>`;
    k += `</g>`;
    k += `<path d="M${X(cx - bw)} 0 V${Y(sp)} A${M(bw)} ${M(bw)} 0 0 1 ${X(cx + bw)} ${Y(sp)} V0 Z" fill="${S.rg("tunnel", [[0, "#000", 0], [0.55, "#000", 0.12], [1, "#000", 0.55]], 0.5, 0.62, 0.62)}"/>`;
    /* Keilsteine des Bogens */
    for (let a = 180; a <= 360; a += 12) { const ra = a * Math.PI / 180; k += `<path d="M${r(X(cx) + Math.cos(ra) * M(bw))} ${r(Y(sp) + Math.sin(ra) * M(bw))} L${r(X(cx) + Math.cos(ra) * M(bw + 0.55))} ${r(Y(sp) + Math.sin(ra) * M(bw + 0.55))}" stroke="#191714" stroke-width=".35"/>`; }
    k += `<path d="M${X(cx - bw - 0.55)} ${Y(sp)} A${M(bw + 0.55)} ${M(bw + 0.55)} 0 0 1 ${X(cx)} ${Y(sp + bw + 0.55)}" stroke="#a39783" stroke-width=".5" fill="none"/>`;
  }
  /* zwei Leute in den Durchfahrten (Maßstab) */
  k += passant(X(-3.2), 0, M(1.72), { hemd: "#c9b28a", rueck: true }) + passant(X(4.1), 0, M(1.66), { hemd: "#9a3a3a", hose: "#3d4a5a", rueck: true, schritt: 0.14 });
  /* eine Taube sitzt auf dem Gesims des Ostturms */
  {
    const tx = X(15.2), ty = r(Y(G.og1) - 1);
    k += `<ellipse cx="${tx}" cy="${r(ty - 0.9)}" rx="1.5" ry=".8" fill="#9aa1aa"/><circle cx="${r(tx + 1.2)}" cy="${r(ty - 1.8)}" r=".55" fill="#6f7680"/><path d="M${r(tx - 1.4)} ${r(ty - 0.8)} l-1 .4" stroke="#5a6068" stroke-width=".6"/>`;
  }
  k += `<rect x="${X(-18)}" y="-1.2" width="${M(36)}" height="1.4" fill="#1f1c19" opacity=".7"/>`;
  const PN = k;
  const F0 = FENSTER.find((f) => Math.abs(f.cx - (-6.5 + 3.25 * 2.5)) < 0.01 && Math.abs(f.s0 - (G.eg + 0.8)) < 0.01) || FENSTER[0];
  PN_UNTER = [
    { id: "westturm", de: "der Westturm", syl: "WEST-turm", it: "la torre occidentale", itSyl: "TOR-re oc-ci-den-TA-le", en: "west tower", x: GX + X(-12.25), y: GY - M(G.west / 2), kunst: flaeche(-M(5.75), -M(G.west / 2), M(11.5), M(G.west), 1),
      tipp: "Der Westturm hat noch alle vier Stockwerke. Er ist fast 30 Meter hoch." },
    { id: "torbogen", de: "der Torbogen", syl: "TOR-bo-gen", it: "l'arco della porta", itSyl: "AR-co del-la POR-ta", en: "archway", x: GX + X(-3.55), y: GY, kunst: flaeche(-M(2.75), -M(7.7), M(5.5), M(7.7), 1),
      tipp: "Die Porta Nigra hat zwei Durchfahrten. Dahinter liegt ein kleiner Hof ohne Dach." },
    { id: "fenster", de: "das Fenster", syl: "FENS-ter", it: "la finestra", itSyl: "fi-NE-stra", en: "window", x: GX + X(F0.cx), y: GY - M(F0.s0), kunst: flaeche(-M(F0.fw / 2 + 0.2), -M(F0.fh + 0.2), M(F0.fw + 0.4), M(F0.fh + 0.4), 0.6),
      tipp: "Die Fenster haben oben einen runden Bogen. In jedem Stockwerk gibt es eine lange Reihe davon." },
    { id: "saeule", de: "die Säule", syl: "SÄU-le", it: "la colonna", itSyl: "co-LON-na", en: "column", x: GX + X(6.5 + 11.5 / 3), y: GY, kunst: flaeche(-M(0.75), -M(G.eg), M(1.5), M(G.eg), 0.6),
      tipp: "Die Halbsäulen wurden nie fertig. Man sieht noch den groben Stein." },
    { id: "steinblock", de: "der Steinblock", syl: "STEIN-block", it: "il blocco di pietra", itSyl: "BLOC-co di PIE-tra", en: "stone block", x: GX + X(BLOCK.x), y: GY - M(BLOCK.h), kunst: flaeche(-M(BLOCK.w / 2), -M(BLOCK.hh), M(BLOCK.w), M(BLOCK.hh), 0.4),
      tipp: "Die Steine halten ohne Mörtel. Früher verbanden Eisenklammern die Blöcke." },
    { id: "loch", de: "das Loch", syl: "LOCH", it: "il buco", itSyl: "BU-co", en: "hole", x: r(GX + LOCH.x), y: r(GY + LOCH.y), kunst: flaeche(-3.5, -3.5, 7, 7, 0.4),
      tipp: "Im Mittelalter holten die Menschen das Eisen heraus. Sie brauchten es für andere Dinge. Die Löcher sieht man bis heute." },
  ];
  S.teil({ id: "portanigra", de: "die Porta Nigra", syl: "POR-ta NI-gra", it: "la Porta Nigra", itSyl: "POR-ta NI-gra", en: "Porta Nigra",
    x: GX, y: GY, kunst: PN, tipp: "Die Römer bauten die Porta Nigra um 170 nach Christus. „Porta Nigra“ heißt „schwarzes Tor“: Der Sandstein ist mit der Zeit dunkel geworden.",
    zoom: { x: 52, y: 8, w: 300, h: 200 }, unter: PN_UNTER });
}

/* =====================================================================
   5 — DIE LEUTE auf dem Platz (vor dem Tor, nach Tiefe sortiert)
   ===================================================================== */
{
  let p = "";
  const liste = [[-12, 66, "#7a2a40", 0], [-9.5, 68, "#e8e4dc", 1], [9, 64, "#3f7d5a", 0], [11, 67, "#d8ad3a", 1], [-6, 58, "#2f5f95", 0], [10.2, 47, "#b8473a", 0], [11.0, 48.5, "#e8e4dc", 1], [-2.5, 44, "#5a4a7a", 0], [14.5, 55, "#2f3640", 1]].sort((a, b) => b[1] - a[1]);
  for (const [la, dd, hemd, rk] of liste) { const [px, py] = proj(la, dd); p += passant(px, py, r(1.7 * F / dd), { hemd, rueck: !!rk, schritt: rk ? 0.12 : 0.04 }); schlag(la, dd, 1.7, 0.5, 0.3); }
  S.teil({ id: "leute", de: "die Leute", syl: "LEU-te", it: "la gente", itSyl: "GEN-te", en: "people", x: 0, y: 0, kunst: p,
    tipp: "Jeden Tag kommen viele Leute aus aller Welt zur Porta Nigra." });
}

/* =====================================================================
   6 — DER RADFAHRER (fährt quer über den Platz)
   ===================================================================== */
{
  const d = 40, lat = -7.6, [x, y] = proj(lat, d), s = km(y);
  let k = "";
  const R = 0.34 * s;
  for (const cx of [-0.55 * s, 0.55 * s]) k += `<circle cx="${r(cx)}" cy="${r(-R)}" r="${r(R)}" fill="none" stroke="#1c1c1e" stroke-width="${r(0.05 * s)}"/><circle cx="${r(cx)}" cy="${r(-R)}" r="${r(0.05 * s)}" fill="#9aa0a6"/>`;
  k += `<path d="M${r(-0.55 * s)} ${r(-R)} L${r(-0.05 * s)} ${r(-R)} L${r(-0.15 * s)} ${r(-0.9 * s)} Z M${r(-0.05 * s)} ${r(-R)} L${r(0.42 * s)} ${r(-0.88 * s)} L${r(-0.12 * s)} ${r(-0.82 * s)} M${r(0.42 * s)} ${r(-0.88 * s)} L${r(0.55 * s)} ${r(-R)}" stroke="#2f5f95" stroke-width="${r(0.045 * s)}" fill="none"/>`;
  k += `<path d="M${r(-0.16 * s)} ${r(-0.92 * s)} L${r(-0.02 * s)} ${r(-0.55 * s)} L${r(0.02 * s)} ${r(-R)} M${r(-0.16 * s)} ${r(-0.92 * s)} L${r(0.1 * s)} ${r(-0.6 * s)} L${r(0.14 * s)} ${r(-0.42 * s)}" stroke="#2f3640" stroke-width="${r(0.09 * s)}" stroke-linecap="round" fill="none"/>`;
  k += `<path d="M${r(-0.2 * s)} ${r(-0.92 * s)} Q${r(-0.1 * s)} ${r(-1.38 * s)} ${r(0.1 * s)} ${r(-1.4 * s)} L${r(0.16 * s)} ${r(-1.32 * s)} Q${r(-0.04 * s)} ${r(-1.2 * s)} ${r(-0.06 * s)} ${r(-0.92 * s)} Z" fill="#d8ad3a"/>`;
  k += `<path d="M${r(0.08 * s)} ${r(-1.32 * s)} L${r(0.4 * s)} ${r(-0.92 * s)}" stroke="#d8ad3a" stroke-width="${r(0.06 * s)}" stroke-linecap="round"/>`;
  k += `<circle cx="${r(0.16 * s)}" cy="${r(-1.5 * s)}" r="${r(0.1 * s)}" fill="#e3b796"/><path d="M${r(0.05 * s)} ${r(-1.55 * s)} Q${r(0.16 * s)} ${r(-1.7 * s)} ${r(0.28 * s)} ${r(-1.55 * s)} Z" fill="#c8302a"/>`;
  schlag(lat, d, 1.6, 1.2, 0.3);
  S.teil({ id: "radfahrer", de: "der Radfahrer", syl: "RAD-fah-rer", it: "il ciclista", itSyl: "ci-CLI-sta", en: "cyclist", x, y, kunst: licht(k) });
}

/* =====================================================================
   7 — DAS CAFÉ (letztes Haus der Simeonstraße, links vorn in der Flucht)
   ===================================================================== */
const CAFE = { lat: -14.5, d0: 34.8, d1: 41, h: 14 };
{
  const { lat, d0, d1, h } = CAFE;
  const P = (d, hh) => proj(lat, d, hh);
  const quad = (da, db, ha, hb, fill, extra = "") => `<path d="${pfad([P(da, ha), P(db, ha), P(db, hb), P(da, hb)])}" fill="${fill}"${extra}/>`;
  /* Gründerzeithaus im Schatten (die Front schaut nach Osten): kühler Putz */
  let k = quad(d0, d1, 0, h, S.lg("haus", [[0, "#8a7c6c"], [1, "#a8957a"]], 0, 0, 1, 0));
  /* Gesimse, Fensterbekrönungen, Sprossenfenster mit Läden */
  for (const hh of [4.3, 8.0, 11.2]) k += quad(d0, d1, hh, hh + 0.35, "#c8b48f") + quad(d0, d1, hh - 0.2, hh, "#5e4e3a");
  k += quad(d0, d1, h - 0.9, h, "#6e5c44") + quad(d0, d1, h - 0.9, h - 0.6, "#c8b48f");
  for (const [ha, hb] of [[5.0, 7.4], [8.6, 10.7]]) for (let d = d0 + 0.7; d < d1 - 1.2; d += 2.9) {
    k += quad(d - 0.15, d + 1.45, hb + 0.1, hb + 0.55, "#d6c39e");                      /* Verdachung */
    k += quad(d - 0.12, d + 1.42, ha - 0.12, hb + 0.1, "#e6dccb");                       /* Rahmen */
    k += quad(d, d + 1.3, ha, hb, S.lg("fglas", [[0, "#9ab2c4"], [0.5, "#5b7084"], [1, "#3a4856"]]));
    k += quad(d + 0.61, d + 0.69, ha, hb, "#e6dccb") + quad(d, d + 1.3, ha + (hb - ha) * 0.62, ha + (hb - ha) * 0.66, "#e6dccb");
    k += quad(d - 0.5, d - 0.15, ha, hb, "#4f6a4a") + quad(d + 1.45, d + 1.8, ha, hb, "#4f6a4a");   /* Fensterläden */
  }
  /* Ladenzone mit Holzrahmen, warmes Licht drinnen, Gäste und Kuchen */
  k += quad(d0, d1, 0, 3.9, "#4a3220");
  for (let d = d0 + 0.5; d < d1 - 0.8; d += 3.0) {
    k += quad(d, d + 2.4, 0.5, 3.4, S.lg("laden", [[0, "#f3d9a0"], [1, "#a77a45"]]));
    const [gx, gy] = P(d + 0.8, 1.15), s = F / (d + 0.8);
    /* ein Gast: Schultern, Hals, Kopf mit Haar, davor Tasse und Teller mit Kuchen */
    k += `<path d="M${r(gx - 0.24 * s)} ${r(gy + 0.1 * s)} Q${r(gx - 0.22 * s)} ${r(gy - 0.3 * s)} ${gx} ${r(gy - 0.32 * s)} Q${r(gx + 0.22 * s)} ${r(gy - 0.3 * s)} ${r(gx + 0.24 * s)} ${r(gy + 0.1 * s)} Z" fill="#6a4a7a"/>`;
    k += `<rect x="${r(gx - 0.04 * s)}" y="${r(gy - 0.42 * s)}" width="${r(0.08 * s)}" height="${r(0.12 * s)}" fill="#c99a7a"/><ellipse cx="${gx}" cy="${r(gy - 0.52 * s)}" rx="${r(0.1 * s)}" ry="${r(0.12 * s)}" fill="#e0b090"/><path d="M${r(gx - 0.11 * s)} ${r(gy - 0.52 * s)} Q${r(gx - 0.1 * s)} ${r(gy - 0.68 * s)} ${gx} ${r(gy - 0.66 * s)} Q${r(gx + 0.1 * s)} ${r(gy - 0.66 * s)} ${r(gx + 0.1 * s)} ${r(gy - 0.56 * s)} Q${r(gx - 0.02 * s)} ${r(gy - 0.6 * s)} ${r(gx - 0.11 * s)} ${r(gy - 0.52 * s)} Z" fill="#3a2a20"/><path d="M${r(gx - 0.04 * s)} ${r(gy - 0.53 * s)} h.01 M${r(gx + 0.04 * s)} ${r(gy - 0.53 * s)} h.01" stroke="#2a1e18" stroke-width=".45" stroke-linecap="round"/><path d="M${r(gx - 0.015 * s)} ${r(gy - 0.465 * s)} h${r(0.03 * s)}" stroke="#7a3a2e" stroke-width=".22" fill="none"/>`;
    /* der zweite Gast hält die Tasse am Mund (keine Zwillinge) */
    if (d > d0 + 2) k += `<path d="M${r(gx + 0.18 * s)} ${r(gy - 0.05 * s)} L${r(gx + 0.1 * s)} ${r(gy - 0.42 * s)}" stroke="#6a4a7a" stroke-width="${r(0.07 * s)}" stroke-linecap="round"/><rect x="${r(gx + 0.02 * s)}" y="${r(gy - 0.5 * s)}" width="${r(0.08 * s)}" height="${r(0.07 * s)}" fill="#f6f4ef"/>`;
    k += `<rect x="${r(gx + 0.12 * s)}" y="${r(gy - 0.02 * s)}" width="${r(0.07 * s)}" height="${r(0.07 * s)}" fill="#f6f4ef"/><ellipse cx="${r(gx - 0.15 * s)}" cy="${r(gy + 0.04 * s)}" rx="${r(0.1 * s)}" ry="${r(0.025 * s)}" fill="#f6f4ef"/><path d="M${r(gx - 0.2 * s)} ${r(gy + 0.03 * s)} l${r(0.08 * s)} ${r(-0.05 * s)} l${r(0.04 * s)} ${r(0.05 * s)} Z" fill="#c98a4a"/>`;
    /* Kuchentheke: steht unten im Fenster (Holzsockel, Glasaufsatz mit drei Torten und Spiegelung) */
    const [kx, k0] = P(d + 1.9, 0.5), k1 = P(d + 1.9, 0.78)[1], k2 = P(d + 1.9, 1.08)[1];
    k += `<rect x="${r(kx - 0.32 * s)}" y="${k1}" width="${r(0.64 * s)}" height="${r(k0 - k1)}" fill="#6a4426"/><rect x="${r(kx - 0.32 * s)}" y="${k1}" width="${r(0.64 * s)}" height=".4" fill="#a8784a"/>`;
    k += `<rect x="${r(kx - 0.3 * s)}" y="${k2}" width="${r(0.6 * s)}" height="${r(k1 - k2)}" fill="#fdf6e6" opacity=".35"/>`;
    for (const [dx, c1, c2] of [[-0.19, "#f3e2c0", "#8a3a2a"], [0, "#7a4a2a", "#f6f0e6"], [0.19, "#f6e8b0", "#e8a8b8"]]) k += `<rect x="${r(kx + (dx - 0.08) * s)}" y="${r(k1 - 0.1 * s)}" width="${r(0.16 * s)}" height="${r(0.1 * s)}" fill="${c1}"/><rect x="${r(kx + (dx - 0.08) * s)}" y="${r(k1 - 0.13 * s)}" width="${r(0.16 * s)}" height="${r(0.035 * s)}" fill="${c2}"/>`;
    k += `<path d="M${r(kx - 0.22 * s)} ${k1} L${r(kx - 0.1 * s)} ${k2} H${r(kx - 0.02 * s)} L${r(kx - 0.14 * s)} ${k1} Z" fill="#fff" opacity=".45"/><rect x="${r(kx - 0.3 * s)}" y="${k2}" width="${r(0.6 * s)}" height="${r(k1 - k2)}" fill="none" stroke="#d9c9a8" stroke-width=".25"/>`;
    k += quad(d, d + 2.4, 0.5, 3.4, "#fff", ' opacity=".12"');
  }
  /* Markise: eine Fläche mit Streifen (rot/creme) und Volant mit Schrift */
  const ml = lat + 1.6, mh0 = 3.9, mh1 = 3.05;
  for (let d = d0, i = 0; d < d1; d += 0.6, i++) k += `<path d="${pfad([P(d, mh0), P(Math.min(d1, d + 0.6), mh0), proj(ml, Math.min(d1, d + 0.6), mh1), proj(ml, d, mh1)])}" fill="${i % 2 ? "#f1e2c6" : "#a3262c"}"/>`;
  k += `<path d="${pfad([P(d0, mh0), P(d1, mh0), proj(ml, d1, mh1), proj(ml, d0, mh1)])}" fill="${S.lg("markl", [[0, "#000", 0.25], [1, "#fff", 0.1]], 0, 0, 0, 1)}"/>`;
  const v1 = proj(ml, d0, mh1), v2 = proj(ml, d1, mh1), v3 = proj(ml, d1, mh1 - 0.35), v4 = proj(ml, d0, mh1 - 0.35);
  k += `<path d="${pfad([v1, v2, v3, v4])}" fill="#a3262c"/>`;
  { const tp = proj(ml, d0 + 0.5, mh1 - 0.3), tq = proj(ml, d1, mh1 - 0.3); k += `<text transform="translate(${r(Math.max(1, tp[0]))} ${tp[1]}) rotate(${r(Math.atan2(tq[1] - tp[1], tq[0] - tp[0]) * 180 / Math.PI)})" font-size="${r(Math.max(2.2, (v4[1] - v1[1]) * 0.8))}" fill="#fff8e6" font-family="Georgia,serif" font-style="italic" font-weight="bold">Café</text>`; }
  S.teil({ id: "cafe", de: "das Café", syl: "ca-FÉ", it: "il caffè", itSyl: "caf-FÈ", en: "café", x: 0, y: 0, kunst: k,
    tipp: "In der Simeonstraße gibt es viele Cafés. Von hier sieht man direkt auf die Porta Nigra." });
}
{
  /* DIE TAFEL (Kundenstopper) vor dem Café: Viez, Riesling und Flammkuchen (rechts vom Schirmmast, gut lesbar)
     FASSUNG 880 — XANDER (Funk 299): ‚stell den Alkohol wieder her … die Städte sollen authentisch dargestellt werden‘ */
  const lat = -9.6, d = 34, [x, y] = proj(lat, d), s = km(y), H = 1.0 * s, Wd = 0.58 * s;
  let k = `<path d="M${r(-Wd / 2 - 0.6)} 0 L${r(-Wd / 2 + 1)} ${r(-H)} L${r(Wd / 2 - 1)} ${r(-H)} L${r(Wd / 2 + 0.6)} 0" stroke="#5b3a1f" stroke-width=".9" fill="none"/>`;
  k += `<path d="M${r(-Wd / 2 + 0.1)} -2 L${r(-Wd / 2 + 1.2)} ${r(-H + 1.4)} L${r(Wd / 2 - 1.2)} ${r(-H + 1.4)} L${r(Wd / 2 - 0.1)} -2 Z" fill="${S.lg("tafel", [[0, "#2e3a33"], [1, "#212a25"]])}"/>`;
  /* L: feste Zeilenbreite, damit lange Zeilen in jeder Schrift auf der Tafel bleiben */
  const t = (yy, f, txt, c = "#f4f0e6", w = "normal", L = 0) => `<text x="0" y="${r(yy)}" font-size="${f}" text-anchor="middle" fill="${c}" font-family="'Comic Sans MS','Segoe Print',cursive" font-weight="${w}"${L ? ` textLength="${r(L)}" lengthAdjust="spacingAndGlyphs"` : ""}>${txt}</text>`;
  k += t(-H + 4.2, 2.1, "Heute:", "#f6e7a1", "bold") + t(-H + 7, 1.7, "Viez 0,25 l", undefined, undefined, 0.43 * s) + t(-H + 9.4, 1.7, "Riesling") + t(-H + 11.9, 1.6, "Flammkuchen", "#ffc9b8", undefined, 0.48 * s);
  schlag(lat, d, 1, 0.6, 0.3);
  S.teil({ id: "tafel", de: "die Tafel", syl: "TA-fel", it: "la lavagna", itSyl: "la-VA-gna", en: "chalkboard", x, y, steht: true, kunst: licht(k),
    tipp: "Auf der Tafel steht, was es heute gibt: Viez, Riesling und Flammkuchen." });
}

/* =====================================================================
   8 — DIE LATERNE (vor dem Westturm)
   ===================================================================== */
{
  const lat = -5.2, d = 31, [x, y] = proj(lat, d), s = km(y), H = 4.2 * s;
  let k = `<path d="M${r(-0.12 * s)} 0 L${r(-0.08 * s)} ${r(-0.5 * s)} L${r(-0.045 * s)} ${r(-H + 0.6 * s)} L${r(0.045 * s)} ${r(-H + 0.6 * s)} L${r(0.08 * s)} ${r(-0.5 * s)} L${r(0.12 * s)} 0 Z" fill="${S.lg("mast", [[0, "#4c5a5d"], [0.4, "#1c2426"], [1, "#0f1416"]], 0, 0, 1, 0)}"/>`;
  const t = -H + 0.6 * s, lw = 0.2 * s;
  k += `<path d="M${r(-lw * 0.6)} ${r(t)} L${r(-lw)} ${r(t - 0.5 * s)} L${r(lw)} ${r(t - 0.5 * s)} L${r(lw * 0.6)} ${r(t)} Z" fill="${S.lg("glaslat", [[0, "#fff6d8"], [1, "#e8c98a"]])}" stroke="#1c2426" stroke-width=".4"/>`;
  k += `<path d="M${r(-lw - 0.5)} ${r(t - 0.5 * s)} L0 ${r(t - 0.72 * s)} L${r(lw + 0.5)} ${r(t - 0.5 * s)} Z" fill="#1c2426"/><circle cx="0" cy="${r(t - 0.76 * s)}" r=".6" fill="#1c2426"/>`;
  schlag(lat, d, 4.2, 0.25, 0.45);
  S.teil({ id: "laterne", de: "die Laterne", syl: "la-TER-ne", it: "il lampione", itSyl: "lam-PIO-ne", en: "street lamp", x, y, kunst: licht(k) });
}

/* =====================================================================
   9 — DIE BIMMELBAHN „Römer-Express“ (Stadtrundfahrt, startet hier)
   ===================================================================== */
{
  const d = 31, [x, y] = proj(5.6, d), s = km(y);
  const P = (m) => r(m * s);
  let k = "";
  /* Schatten unter dem Zug */
  k += `<rect x="${P(0.1)}" y="${P(-0.08)}" width="${P(6.9)}" height="${P(0.12)}" rx="${P(0.05)}" fill="#1a1a1a" opacity=".35"/>`;
  /* Räder mit Felgenring und Speichen */
  const RAD = (cx, rr) => { let g = `<circle cx="${P(cx)}" cy="${P(-rr)}" r="${P(rr)}" fill="#1c1c1e"/><circle cx="${P(cx)}" cy="${P(-rr)}" r="${P(rr * 0.78)}" fill="#a3262c"/>`; for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; g += `<path d="M${P(cx)} ${P(-rr)} l${P(Math.cos(a) * rr * 0.75)} ${P(Math.sin(a) * rr * 0.75)}" stroke="#e8d9b0" stroke-width="${P(0.035)}"/>`; } return g + `<circle cx="${P(cx)}" cy="${P(-rr)}" r="${P(rr * 0.16)}" fill="#d9c27a"/>`; };
  /* Lok: linke Stirnseite (wir sehen sie schmal, der Zug steht rechts vom Fluchtpunkt) */
  k += `<path d="M${P(0.06)} ${P(-0.45)} L${P(0.2)} ${P(-0.45)} L${P(0.2)} ${P(-1.95)} L${P(0.06)} ${P(-1.9)} Z" fill="#163a2a"/>`;
  /* Rahmen, Kessel mit Messingbändern, Dampfdom, Schornstein und die Glocke */
  k += `<path d="M${P(0.2)} ${P(-0.45)} H${P(2.6)} V${P(-1.25)} H${P(0.2)} Z" fill="#1f4a3a"/>`;
  k += `<path d="M${P(0.3)} ${P(-1.25)} H${P(1.95)} V${P(-1.98)} Q${P(1.12)} ${P(-2.14)} ${P(0.3)} ${P(-1.98)} Z" fill="${S.lg("kessel", [[0, "#5a9a7c"], [0.35, "#3c7a5e"], [1, "#163a2a"]])}"/>`;
  for (const bx of [0.65, 1.15, 1.65]) k += `<rect x="${P(bx)}" y="${P(-2.06)}" width="${P(0.07)}" height="${P(0.81)}" fill="#d9b44a"/>`;
  k += `<path d="M${P(1.0)} ${P(-2.05)} Q${P(1.0)} ${P(-2.35)} ${P(1.15)} ${P(-2.36)} Q${P(1.3)} ${P(-2.35)} ${P(1.3)} ${P(-2.05)} Z" fill="#d9b44a"/>`;
  k += `<rect x="${P(0.52)}" y="${P(-2.62)}" width="${P(0.22)}" height="${P(0.6)}" fill="#1c1c1e"/><path d="M${P(0.42)} ${P(-2.62)} H${P(0.84)} L${P(0.78)} ${P(-2.76)} H${P(0.48)} Z" fill="#d9c27a"/>`;
  k += `<path d="M${P(1.55)} ${P(-2.0)} V${P(-2.12)} M${P(1.43)} ${P(-2.12)} Q${P(1.55)} ${P(-2.4)} ${P(1.67)} ${P(-2.12)} Z" stroke="#7a5a12" stroke-width="${P(0.02)}" fill="${GOLD}"/><circle cx="${P(1.55)}" cy="${P(-2.1)}" r="${P(0.025)}" fill="#7a5a12"/>`;
  k += `<circle cx="${P(0.24)}" cy="${P(-1.6)}" r="${P(0.13)}" fill="#fff4c8" stroke="#d9c27a" stroke-width=".4"/>`;
  k += `<path d="M${P(0.66)} ${P(-2.8)} q${P(-0.1)} ${P(-0.25)} ${P(0.05)} ${P(-0.4)} q${P(0.15)} ${P(-0.15)} ${P(0)} ${P(-0.35)}" stroke="#fff" stroke-width="${P(0.08)}" opacity=".5" fill="none" stroke-linecap="round"/>`;
  /* Führerhaus mit Lokführer: Mütze, Hand am Fenster */
  k += `<path d="M${P(1.9)} ${P(-1.25)} H${P(2.65)} V${P(-2.35)} H${P(1.9)} Z" fill="#f1e8d6"/><rect x="${P(2.0)}" y="${P(-2.22)}" width="${P(0.52)}" height="${P(0.5)}" fill="#6f8aa0"/><path d="M${P(1.8)} ${P(-2.35)} H${P(2.78)} V${P(-2.48)} H${P(1.8)} Z" fill="#a3262c"/>`;
  k += `<path d="M${P(2.0)} ${P(-1.72)} L${P(2.02)} ${P(-1.84)} Q${P(2.1)} ${P(-1.93)} ${P(2.25)} ${P(-1.94)} Q${P(2.4)} ${P(-1.93)} ${P(2.48)} ${P(-1.84)} L${P(2.52)} ${P(-1.72)} Z" fill="#2f3f6a"/><path d="M${P(2.22)} ${P(-1.92)} l${P(0.03)} ${P(0.08)} l${P(0.03)} ${P(-0.08)}" fill="#f1e8d6"/><path d="M${P(2.23)} ${P(-1.93)} v${P(0.06)}" stroke="#e3b796" stroke-width="${P(0.07)}"/><ellipse cx="${P(2.25)}" cy="${P(-2.01)}" rx="${P(0.09)}" ry="${P(0.1)}" fill="#e3b796"/><path d="M${P(2.13)} ${P(-2.06)} Q${P(2.25)} ${P(-2.2)} ${P(2.37)} ${P(-2.06)} L${P(2.42)} ${P(-2.04)} Z" fill="#1f2a44"/><path d="M${P(2.28)} ${P(-2.02)} h.01 M${P(2.34)} ${P(-2.02)} h.01" stroke="#2a1e18" stroke-width=".35" stroke-linecap="round"/>`;
  k += `<path d="M${P(2.4)} ${P(-1.8)} L${P(2.5)} ${P(-1.72)}" stroke="#e3b796" stroke-width="${P(0.06)}" stroke-linecap="round"/>`;
  k += RAD(0.7, 0.27) + RAD(2.1, 0.27);
  /* Wagen mit Dach, Fahrgäste mit Schultern und Armen: einer winkt, ein Kind zeigt zur Porta, einer fotografiert */
  const w0 = 2.95, w1 = 6.9;
  k += `<rect x="${P(2.65)}" y="${P(-0.55)}" width="${P(0.3)}" height="${P(0.08)}" fill="#3a3a3a"/>`;
  k += `<path d="M${P(w0 - 0.12)} ${P(-0.45)} L${P(w0)} ${P(-0.45)} L${P(w0)} ${P(-1.15)} L${P(w0 - 0.12)} ${P(-1.12)} Z" fill="#cfc4ae"/>`;
  const gast = (gx, c, haar, art, kind = false) => {
    const q = kind ? 0.8 : 1, y0 = -1.15;
    let g = `<path d="M${P(gx - 0.2 * q)} ${P(y0)} Q${P(gx - 0.2 * q)} ${P(y0 - 0.36 * q)} ${P(gx)} ${P(y0 - 0.38 * q)} Q${P(gx + 0.2 * q)} ${P(y0 - 0.36 * q)} ${P(gx + 0.2 * q)} ${P(y0)} Z" fill="${c}"/>`;
    g += `<rect x="${P(gx - 0.035)}" y="${P(y0 - 0.45 * q)}" width="${P(0.07)}" height="${P(0.09)}" fill="#d9a986"/><ellipse cx="${P(gx)}" cy="${P(y0 - 0.52 * q)}" rx="${P(0.1 * q)}" ry="${P(0.115 * q)}" fill="#e3b796"/>`;
    g += `<path d="M${P(gx - 0.1 * q)} ${P(y0 - 0.52 * q)} Q${P(gx - 0.1 * q)} ${P(y0 - 0.68 * q)} ${P(gx)} ${P(y0 - 0.67 * q)} Q${P(gx + 0.1 * q)} ${P(y0 - 0.66 * q)} ${P(gx + 0.1 * q)} ${P(y0 - 0.55 * q)} Q${P(gx)} ${P(y0 - 0.6 * q)} ${P(gx - 0.1 * q)} ${P(y0 - 0.52 * q)} Z" fill="${haar}"/>`;
    if (art !== "foto") g += `<path d="M${P(gx - 0.035 * q)} ${P(y0 - 0.53 * q)} h.01 M${P(gx + 0.035 * q)} ${P(y0 - 0.53 * q)} h.01" stroke="#2a1e18" stroke-width=".35" stroke-linecap="round"/><path d="M${P(gx - 0.03 * q)} ${P(y0 - 0.465 * q)} q${P(0.03 * q)} ${P(0.015 * q)} ${P(0.06 * q)} 0" stroke="#9a4a3a" stroke-width=".25" fill="none"/>`;
    const sw = P(0.06 * q);
    if (art === "winkt") g += `<path d="M${P(gx + 0.17 * q)} ${P(y0 - 0.3 * q)} L${P(gx + 0.28 * q)} ${P(y0 - 0.55 * q)} L${P(gx + 0.24 * q)} ${P(y0 - 0.78 * q)}" stroke="${c}" stroke-width="${sw}" fill="none" stroke-linecap="round"/><circle cx="${P(gx + 0.24 * q)}" cy="${P(y0 - 0.82 * q)}" r="${P(0.04)}" fill="#e3b796"/>`;
    else if (art === "zeigt") g += `<path d="M${P(gx - 0.17 * q)} ${P(y0 - 0.3 * q)} L${P(gx - 0.42 * q)} ${P(y0 - 0.55 * q)}" stroke="${c}" stroke-width="${sw}" stroke-linecap="round"/><circle cx="${P(gx - 0.45 * q)}" cy="${P(y0 - 0.58 * q)}" r="${P(0.035)}" fill="#e3b796"/>`;
    else if (art === "foto") g += `<path d="M${P(gx - 0.16)} ${P(y0 - 0.3)} L${P(gx - 0.12)} ${P(y0 - 0.5)} M${P(gx + 0.16)} ${P(y0 - 0.3)} L${P(gx + 0.12)} ${P(y0 - 0.5)}" stroke="${c}" stroke-width="${sw}" stroke-linecap="round"/><rect x="${P(gx - 0.14)}" y="${P(y0 - 0.6)}" width="${P(0.2)}" height="${P(0.13)}" rx="${P(0.02)}" fill="#1d1f22"/>`;
    else g += `<path d="M${P(gx - 0.18)} ${P(y0 - 0.28)} L${P(gx - 0.22)} ${P(y0 - 0.02)} M${P(gx + 0.18)} ${P(y0 - 0.28)} L${P(gx + 0.22)} ${P(y0 - 0.02)}" stroke="${c}" stroke-width="${sw}" stroke-linecap="round"/>`;
    return g;
  };
  k += gast(3.35, "#e6889f", "#c9a466", "") + gast(4.0, "#2f5f95", "#4a3426", "foto") + gast(4.75, "#f2c230", "#26211f", "zeigt", true) + gast(5.5, "#3f7d5a", "#9d9a96", "winkt") + gast(6.3, "#e8e4dc", "#93704f", "");
  k += `<path d="M${P(w0)} ${P(-0.45)} H${P(w1)} V${P(-1.15)} H${P(w0)} Z" fill="${S.lg("wagen", [[0, "#fbf4e4"], [1, "#d9ccb2"]])}"/><rect x="${P(w0)}" y="${P(-0.62)}" width="${P(w1 - w0)}" height="${P(0.1)}" fill="#a3262c"/>`;
  k += `<text x="${P((w0 + w1) / 2)}" y="${P(-0.74)}" font-size="${P(0.22)}" text-anchor="middle" fill="#1f4a3a" font-family="Georgia,serif" font-weight="bold" font-style="italic">Römer-Express</text>`;
  k += `<path d="M${P(w0 - 0.1)} ${P(-2.25)} H${P(w1 + 0.1)} V${P(-2.4)} Q${P((w0 + w1) / 2)} ${P(-2.55)} ${P(w0 - 0.1)} ${P(-2.4)} Z" fill="#1f4a3a"/><path d="M${P(w0 - 0.1)} ${P(-2.25)} H${P(w1 + 0.1)}" stroke="#d9c27a" stroke-width=".5"/>`;
  for (const px of [w0 + 0.05, (w0 + w1) / 2, w1 - 0.05]) k += `<rect x="${P(px - 0.03)}" y="${P(-2.25)}" width="${P(0.06)}" height="${P(1.1)}" fill="#d9c27a"/>`;
  k += RAD(3.4, 0.22) + RAD(6.45, 0.22);
  schlag(5.6 + 3.5 * 1 / 1, d + 0.4, 2.2, 7, 0.3);
  S.teil({ id: "bimmelbahn", de: "die Bimmelbahn", syl: "BIM-mel-bahn", it: "il trenino turistico", itSyl: "tre-NI-no tu-RI-sti-co", en: "tourist train", x, y, kunst: licht(k),
    tipp: "Der Römer-Express fährt an der Porta Nigra los. Auf der Lok sitzt eine kleine Glocke: Sie bimmelt." });
}

/* =====================================================================
   10 — DIE REISEGRUPPE und 11 — DER RÖMER (Darsteller als Zenturio)
   ===================================================================== */
const ROEM = { lat: 2.1, d: 21.6 };
{
  const leute = [
    { lat: -2.0, d: 23.6, g: "w", blick: 75, frisur: "lang", haar: "blond", o: { stueck: "tshirt", farbe: "#e6889f" }, u: { stueck: "jeans" }, z: { stueck: "tasche", farbe: "braun" }, s: { stueck: "halbschuh", farbe: "braun" }, h: 1.64 },
    { lat: -2.9, d: 22.3, g: "m", alter: "kind", pose: "zeigen", blick: 70, frisur: "kurz", haar: "hellblond", o: { stueck: "tshirt", farbe: "#f2c230" }, u: { stueck: "shorts", farbe: "#3d5a80" }, z: { stueck: "rucksack", farbe: "#d0473a" }, h: 1.2 },
    { lat: -0.2, d: 22.6, g: "w", blick: 160, frisur: "dutt", haar: "dunkelbraun", o: { stueck: "bluse", farbe: "#f3efe6" }, u: { stueck: "rock_knie", farbe: "#2f4a6a" }, j: { stueck: "jacke", farbe: "#4f8a46" }, h: 1.62, handy: true },
  ];
  const teile = [];
  const handy = { lende: 1, brust: -2, nacken: -6, kopf: -10, schulterL: { vor: 94, seit: -4, dreh: 0 }, ellbogenL: 58, unterarmL: 0, handL: 20, fingerL: 0.5,
    schulterR: { vor: 96, seit: 12, dreh: 0 }, ellbogenR: 52, unterarmR: 0, handR: 24, fingerR: 0.5,
    huefteL: { vor: 3, seit: 3, dreh: -6 }, knieL: 3, fussL: 0, huefteR: { vor: -3, seit: 2.5, dreh: -6 }, knieR: 2, fussR: 0 };
  const [rx, ry] = proj(-1.0, 23.6);
  leute.sort((a, b) => b.d - a.d).forEach((p, i) => {
    const [x, y] = proj(p.lat, p.d), s = km(y);
    const kl = { oberteil: p.o, unterteil: p.u, schuhe: p.s || { stueck: "turnschuh" } };
    if (p.j) kl.jacke = p.j; if (p.z) kl.zubehoer = p.z; if (p.kopf) kl.kopf = p.kopf;
    const m = figur({ id: "trr_t" + i, alter: p.alter || "erwachsen", geschlecht: p.g, pose: p.handy ? handy : (p.pose || "stehen"), blick: p.blick, frisur: p.frisur, haarfarbe: p.haar, haut: "hell", laecheln: true, kleidung: kl }, p.h * s, 1);
    let extra = "";
    if (p.handy) { const hd = [m.z.handL, m.z.handR].sort((a, b) => a.y - b.y)[0]; extra = `<rect x="${r(hd.x * m.k - 0.9)}" y="${r(hd.y * m.k - 2.6)}" width="1.8" height="2.6" rx=".3" fill="#1d1f22"/>`; }
    /* Rückansicht: das Gesicht der Bibliothek scheint am Hinterkopf durch, darum Haar darüber */
    if (p.blick > 120) { const q = m.z.punkte, K = m.k, cx = ((q.scheitel[0] + q.ohr[0]) / 2 + 0.3) * K, cy = (q.scheitel[1] + q.kinn[1]) / 2 * K; extra += `<ellipse cx="${r(cx)}" cy="${r(cy)}" rx="${r((Math.abs(q.ohr[0] - q.scheitel[0]) + 1.4) * K)}" ry="${r(((q.kinn[1] - q.scheitel[1]) / 2 - 0.8) * K)}" fill="#45302a"/><circle cx="${r(q.hinterkopf[0] * K)}" cy="${r(q.hinterkopf[1] * K)}" r="${r(3 * K)}" fill="#4e382e"/>`; }
    teile.push(`<g transform="translate(${r(x - rx)} ${r(y - ry)})">${m.svg}${extra}</g>`);
    schlag(p.lat, p.d, p.h, 0.5);
  });
  S.teil({ id: "reisegruppe", de: "die Reisegruppe", syl: "REI-se-grup-pe", it: "il gruppo di turisti", itSyl: "GRUP-po di tu-RI-sti", en: "tour group", x: rx, y: ry,
    kunst: teile.join(""), tipp: "Die Reisegruppe hört dem Römer zu. Eine Frau fotografiert das Tor, ein Kind zeigt auf den Römer." });
}
{
  const [x, y] = proj(ROEM.lat, ROEM.d), s = km(y);
  /* er zeigt mit dem Rebstock schräg nach oben auf das Tor */
  const pose = { lende: 1, brust: -3, nacken: 2, kopf: -10, schulterL: { vor: 6, seit: 10 }, ellbogenL: 40, unterarmL: 20, handL: 6, fingerL: 0.7,
    schulterR: { vor: 120, seit: 22, dreh: 0 }, ellbogenR: 8, unterarmR: 0, handR: 10, fingerR: 0.75,
    huefteL: { vor: 6, seit: 4, dreh: -8 }, knieL: 6, fussL: 2, huefteR: { vor: -4, seit: 4, dreh: -4 }, knieR: 2, fussR: 0 };
  const m = figur({ id: "trr_roem", geschlecht: "m", pose, blick: -55, frisur: "kurz", haarfarbe: "dunkelbraun", haut: "mittel",
    kleidung: { oberteil: { stueck: "tshirt", farbe: "#a3262a" }, unterteil: { stueck: "rock_knie", farbe: "#a3262a" }, schuhe: { stueck: "sandale", farbe: "#4a2e14" }, kopf: { stueck: "helm", farbe: "#b9bdc1" } } }, 1.8 * s, 0.8);
  const p = m.z.punkte, k = m.k, P = (n) => p[n];
  const sL = P("schulterL"), sR = P("schulterR"), tL = P("tailleL"), tR = P("tailleR"), hL = P("huefteL"), hR = P("huefteR"), br = P("brust");
  /* Umhang (sagum): fällt von den Schultern nach HINTEN — nur an der Rückenseite (rechts) zu sehen */
  const ruecken = sL[0] > sR[0] ? 1 : -1;
  let hinten = `<path d="M${sR[0]} ${sR[1] - 2} Q${(sR[0] + sL[0]) / 2} ${sR[1] - 5} ${sL[0]} ${sL[1] - 2} L${sL[0] + ruecken * 9} ${hL[1] + 8} Q${sL[0] + ruecken * 4} ${hL[1] + 14} ${sL[0] - ruecken * 2} ${hL[1] + 10} Z" fill="${S.lg("umhang", [[0, "#6a1014"], [0.6, "#a8282c"], [1, "#7a1418"]], 0, 0, 1, 0)}"/>`;
  hinten += `<path d="M${sL[0] + ruecken * 2} ${sL[1] + 6} Q${sL[0] + ruecken * 6} ${hL[1] - 8} ${sL[0] + ruecken * 7} ${hL[1] + 8}" stroke="#4a0a0e" stroke-width="1.2" fill="none" opacity=".6"/>`;
  /* Kettenhemd (lorica hamata): umschließt den Rumpf, Saum ausgefranst über der Tunika */
  S.def(`<pattern id="${S.id("kette")}" patternUnits="userSpaceOnUse" width="2.2" height="1.8"><rect width="2.2" height="1.8" fill="#6f747a"/><path d="M0 .9 a1.1 .9 0 0 1 2.2 0 M-1.1 1.8 a1.1 .9 0 0 1 2.2 0 M1.1 1.8 a1.1 .9 0 0 1 2.2 0" stroke="#c4c9ce" stroke-width=".4" fill="none"/></pattern>`);
  const saum = [];
  const n = 8;
  for (let i = 0; i <= n; i++) { const t = i / n; saum.push(`${r(hR[0] - 3 + (hL[0] - hR[0] + 6) * t)} ${r(hR[1] + (hL[1] - hR[1]) * t + 9 + (i % 2) * 2.2)}`); }
  const rumpf = `M${sR[0] - 3} ${sR[1] + 1} Q${(sR[0] + sL[0]) / 2} ${sR[1] - 3} ${sL[0] + 3} ${sL[1] + 1} L${tL[0] + 3} ${tL[1]} L${hL[0] + 3} ${hL[1] + 9} L${saum.slice().reverse().join(" L")} L${hR[0] - 3} ${hR[1] + 9} L${tR[0] - 3} ${tR[1]} Z`;
  let vorn = `<path d="${rumpf}" fill="url(#${S.id("kette")})"/>`;
  vorn += `<path d="${rumpf}" fill="${S.lg("kettel", [[0, "#ffe2b0", 0.3], [0.35, "#fff", 0.05], [0.7, "#000", 0.25], [1, "#000", 0.45]], 0, 0, 1, 0)}"/>`;
  vorn += `<path d="M${(tR[0] + tL[0]) / 2 - 4} ${tR[1] - 6} q2 8 0 18 M${(tR[0] + tL[0]) / 2 + 5} ${tL[1] - 4} q-1 8 1 16" stroke="#3a3e42" stroke-width=".8" fill="none" opacity=".6"/>`;
  /* Schulterdopplung (humeralia) */
  for (const [sx, sy, dir] of [[sR[0], sR[1], -1], [sL[0], sL[1], 1]]) vorn += `<path d="M${sx - dir * 6} ${sy - 1} Q${sx} ${sy - 4} ${sx + dir * 4} ${sy + 2} L${sx + dir * 3} ${sy + 9} Q${sx - dir * 2} ${sy + 6} ${sx - dir * 7} ${sy + 6} Z" fill="url(#${S.id("kette")})" stroke="#3a3e42" stroke-width=".5"/>`;
  /* Riemengeschirr mit Phalerae (Orden) */
  vorn += `<path d="M${br[0] - 9} ${br[1] - 10} L${br[0] + 9} ${br[1] - 10} L${br[0] + 9} ${br[1] + 8} L${br[0] - 9} ${br[1] + 8} Z M${br[0]} ${br[1] - 10} V${br[1] + 8}" stroke="#5a3a1c" stroke-width="1.6" fill="none"/>`;
  for (const [dx, dy] of [[-9, -10], [9, -10], [0, -1], [-9, 8], [9, 8]]) vorn += `<circle cx="${br[0] + dx}" cy="${br[1] + dy}" r="2.4" fill="${GOLD}" stroke="#7a5a12" stroke-width=".4"/><circle cx="${br[0] + dx - 0.7}" cy="${br[1] + dy - 0.7}" r=".7" fill="#fff8d0"/>`;
  /* Gürtel (cingulum) mit beschlagenen Lederstreifen */
  vorn += `<path d="M${hR[0] - 3} ${hR[1] + 1} L${hL[0] + 3} ${hL[1] + 1} L${hL[0] + 3} ${hL[1] + 5} L${hR[0] - 3} ${hR[1] + 5} Z" fill="#5a3a1c"/>`;
  for (let i = 0; i < 5; i++) { const xx = hR[0] + 3 + i * (hL[0] - hR[0] - 6) / 4; vorn += `<path d="M${r(xx)} ${hR[1] + 5} V${hR[1] + 25}" stroke="#4a2e14" stroke-width="2"/><circle cx="${r(xx)}" cy="${hR[1] + 11}" r=".8" fill="#d9c27a"/><circle cx="${r(xx)}" cy="${hR[1] + 18}" r=".8" fill="#d9c27a"/><rect x="${r(xx - 1)}" y="${hR[1] + 24}" width="2" height="1.4" fill="#d9c27a"/>`; }
  /* Schwert (gladius) an der linken Hüfte */
  vorn += `<path d="M${hL[0] + 3} ${hL[1] - 2} L${hL[0] + 7} ${hL[1] + 26} L${hL[0] + 10} ${hL[1] + 25} L${hL[0] + 6} ${hL[1] - 3} Z" fill="${S.lg("scheide", [[0, "#3a2414"], [1, "#6a4426"]], 0, 0, 1, 0)}" stroke="#c9a640" stroke-width=".5"/>`;
  vorn += `<path d="M${hL[0] + 2} ${hL[1] - 3} L${hL[0] + 7} ${hL[1] - 4.4}" stroke="#c9a640" stroke-width="1.6"/><path d="M${hL[0] + 4} ${hL[1] - 4} L${hL[0] + 3.4} ${hL[1] - 10}" stroke="#6a4426" stroke-width="1.8"/><circle cx="${hL[0] + 3.3}" cy="${hL[1] - 11}" r="1.4" fill="#c9a640"/>`;
  /* Helm: Querkamm, Wangenklappen, Nackenschutz */
  const sch = P("scheitel"), ohr = P("ohr"), hk = P("hinterkopf");
  vorn += `<path d="M${hk[0] - 3} ${hk[1] + 6} L${hk[0] - 8} ${hk[1] + 11} L${hk[0] + 2} ${hk[1] + 12} Z" fill="#9aa0a6" stroke="#5a5e62" stroke-width=".4"/>`;
  vorn += `<path d="M${sch[0] - 15} ${sch[1] + 2} Q${sch[0]} ${sch[1] - 15} ${sch[0] + 15} ${sch[1] + 2} Q${sch[0]} ${sch[1] - 4} ${sch[0] - 15} ${sch[1] + 2} Z" fill="${S.lg("kamm", [[0, "#7a1418"], [0.5, "#d0343a"], [1, "#8a1a1e"]], 0, 0, 1, 0)}"/>`;
  for (let i = -6; i <= 6; i++) vorn += `<path d="M${sch[0] + i * 2.2} ${sch[1] - 1 + Math.abs(i) * 0.2} L${sch[0] + i * 2.4} ${sch[1] - 10 + Math.abs(i) * 0.9}" stroke="#6a1014" stroke-width=".4" opacity=".7"/>`;
  vorn += `<path d="M${sch[0] - 6} ${sch[1] + 3.4} Q${sch[0]} ${sch[1] + 1} ${sch[0] + 6} ${sch[1] + 3.4}" stroke="#e8eaec" stroke-width=".8" fill="none"/>`;
  vorn += `<path d="M${ohr[0] - 2} ${ohr[1] - 3} L${ohr[0]} ${ohr[1] + 10} Q${ohr[0] + 3} ${ohr[1] + 11} ${ohr[0] + 5} ${ohr[1] + 8} L${ohr[0] + 3} ${ohr[1] - 3} Z" fill="#b9bdc1" stroke="#5a5e62" stroke-width=".5"/><circle cx="${ohr[0] + 1.6}" cy="${ohr[1] + 2}" r=".6" fill="#d9c27a"/>`;
  /* Caligae: dunkle Riemensandalen, über den Knöchel geschnürt */
  for (const sd of ["L", "R"]) {
    const kn = P("knoechel" + sd), fu = P("fuss" + sd), ze = P("zeh" + sd), fe = P("ferse" + sd);
    /* dicke Sohle, darüber ein offenes Riemengitter, Zehen sichtbar, Schnürung bis über den Knöchel */
    vorn += `<path d="M${fe[0] - 1.5} ${fe[1] + 4.6} L${ze[0] + 2.5} ${ze[1] + 1.6} L${ze[0] + 2.2} ${ze[1] + 0.2} L${fe[0] - 1.2} ${fe[1] + 3.2} Z" fill="#2e1a0c"/>`;
    vorn += `<path d="M${fe[0]} ${fe[1] + 3} L${kn[0] + 0.5} ${kn[1] - 6} M${kn[0] - 3} ${kn[1] - 5} L${kn[0] + 3} ${kn[1] - 3.5} M${kn[0] - 3} ${kn[1] - 2} L${kn[0] + 3} ${kn[1] - 0.5} M${kn[0] - 2.5} ${kn[1] + 1} L${fu[0] + 2} ${fu[1] + 1} M${fu[0] - 1} ${fu[1] - 1} L${ze[0]} ${ze[1]} M${fu[0] + 3} ${fu[1] - 2} L${fu[0] - 1} ${fu[1] + 3}" stroke="#5a3418" stroke-width="1.1" stroke-linecap="round" fill="none"/>`;
    vorn += `<path d="M${ze[0] - 0.5} ${ze[1] - 0.6} q1.2 -.4 2 .2" stroke="#c48a66" stroke-width=".8" fill="none"/>`;
  }
  /* Rebstock (vitis) in der erhobenen rechten Hand, er zeigt damit zum Tor */
  const hR2 = m.z.handR, eR = P("ellbogenR");
  const dx = hR2.x - eR[0], dy = hR2.y - eR[1], L = Math.hypot(dx, dy) || 1;
  const vit = { x0: hR2.x - dx / L * 5, y0: hR2.y - dy / L * 5, x1: hR2.x + dx / L * 34, y1: hR2.y + dy / L * 34 };
  /* kurzer, knorriger Stock aus Rebholz, leicht gebogen, mit Knoten */
  const nx = -dy / L, ny = dx / L, mx2 = (vit.x0 + vit.x1) / 2 + nx * 2.5, my2 = (vit.y0 + vit.y1) / 2 + ny * 2.5;
  vorn += `<path d="M${r(vit.x0)} ${r(vit.y0)} Q${r(mx2)} ${r(my2)} ${r(vit.x1)} ${r(vit.y1)}" stroke="${S.lg("vitis", [[0, "#4a2e14"], [1, "#8a6a3a"]], 0, 0, 1, 0)}" stroke-width="2.6" stroke-linecap="round" fill="none"/>`;
  for (const t of [0.3, 0.55, 0.8]) { const qx = (1 - t) * (1 - t) * vit.x0 + 2 * t * (1 - t) * mx2 + t * t * vit.x1, qy = (1 - t) * (1 - t) * vit.y0 + 2 * t * (1 - t) * my2 + t * t * vit.y1; vorn += `<ellipse cx="${r(qx)}" cy="${r(qy)}" rx="1.9" ry="1.5" fill="#5a3a1c"/><circle cx="${r(qx - 0.4)}" cy="${r(qy - 0.4)}" r=".5" fill="#a07a48"/>`; }
  const svg = `<g transform="scale(${k.toFixed(4)})">${hinten}${m.inner}${vorn}</g>`;
  schlag(ROEM.lat, ROEM.d, 1.8, 0.55);
  const helm = { x: r(x + sch[0] * k), y: r(y + (sch[1] + 6) * k) };
  const schw = { x: r(x + (hL[0] + 6) * k), y: r(y + (hL[1] + 26) * k) };
  const vm = { x: r(x + (vit.x0 + vit.x1) / 2 * k), y: r(y + (vit.y0 + vit.y1) / 2 * k) };
  S.teil({ id: "roemer", de: "der Römer", syl: "RÖ-mer", it: "il romano", itSyl: "ro-MA-no", en: "Roman", x, y, kunst: svg,
    tipp: "Ein Darsteller spielt einen Zenturio, einen Offizier der römischen Armee. Er erzählt der Gruppe von der Porta Nigra.",
    zoom: { x: r(x - 40), y: r(y - 50), w: 72, h: 52 },
    unter: [
      { id: "helm", de: "der Helm", syl: "HELM", it: "l'elmo", itSyl: "EL-mo", en: "helmet", x: helm.x, y: helm.y, kunst: flaeche(-16 * k, -18 * k, 32 * k, 20 * k, 0.4),
        tipp: "Der Kamm quer auf dem Helm zeigt: Dieser Römer ist ein Zenturio." },
      { id: "schwert", de: "das Schwert", syl: "SCHWERT", it: "la spada", itSyl: "SPA-da", en: "sword", x: schw.x, y: schw.y, kunst: flaeche(-6 * k, -40 * k, 12 * k, 42 * k, 0.4),
        tipp: "Das kurze Schwert der Römer heißt Gladius." },
      { id: "stock", de: "der Stock", syl: "STOCK", it: "il bastone", itSyl: "ba-STO-ne", en: "staff", x: vm.x, y: vm.y,
        kunst: `<path class="bw-flaeche" d="M${r((vit.x0 - vit.x1) / 2 * k - 1.2)} ${r((vit.y0 - vit.y1) / 2 * k)} L${r((vit.x1 - vit.x0) / 2 * k - 1.2)} ${r((vit.y1 - vit.y0) / 2 * k)} L${r((vit.x1 - vit.x0) / 2 * k + 1.2)} ${r((vit.y1 - vit.y0) / 2 * k)} L${r((vit.x0 - vit.x1) / 2 * k + 1.2)} ${r((vit.y0 - vit.y1) / 2 * k)} Z" fill="rgba(255,255,255,0.001)" stroke="rgba(255,255,255,0.001)" stroke-width="2"/>`,
        tipp: "Der Stock aus Rebholz war das Zeichen des Zenturios." },
    ] });
}

/* =====================================================================
   12 — DIE TAUBEN (auf dem Pflaster und eine im Flug)
   ===================================================================== */
{
  let k = "";
  const taube = (lat, d, dir, pick) => {
    const [x, y] = proj(lat, d), a = km(y) * 0.085, s = a * dir;
    const P = (px, py) => `${r(px * s)} ${r(py * a)}`;
    let g = `<g transform="translate(${x} ${y})">`;
    const kopf = pick ? [1.55, -0.55] : [1.25, -2.15];
    g += `<path d="M${P(-2.4, -1.3)} L${P(-1.2, -1.75)} Q${P(0, -2.6)} ${P(0.95, -2.0)} Q${P(1.4, -1.0)} ${P(0.9, -0.45)} Q${P(0, 0)} ${P(-1.1, -0.65)} Z" fill="${S.lg("taube", [[0, "#b3bac2"], [1, "#666d76"]])}"/>`;
    g += `<path d="M${P(-1.0, -1.45)} Q${P(0, -2.1)} ${P(0.6, -1.7)} Q${P(0, -1.1)} ${P(-1.0, -1.45)} Z" fill="#8c939c"/><path d="M${P(-0.6, -1.5)} L${P(0.1, -1.75)} M${P(-0.9, -1.25)} L${P(-0.1, -1.45)}" stroke="#3d434a" stroke-width="${r(0.18 * a)}"/>`;
    g += `<path d="M${P(0.7, -1.9)} Q${P(1.0, -1.2)} ${P(kopf[0] * 0.9, kopf[1] * 0.85)}" stroke="${S.lg("hals", [[0, "#5d8a72"], [1, "#7a5a8a"]])}" stroke-width="${r(0.75 * a)}" fill="none" stroke-linecap="round"/>`;
    g += `<circle cx="${r(kopf[0] * s)}" cy="${r(kopf[1] * a)}" r="${r(0.42 * a)}" fill="#737a84"/><circle cx="${r((kopf[0] + 0.12) * s)}" cy="${r((kopf[1] - 0.1) * a)}" r="${r(0.09 * a)}" fill="#e8763a"/>`;
    g += `<path d="M${P(kopf[0] + 0.35, kopf[1] + 0.02)} L${P(kopf[0] + 0.75, kopf[1] + 0.15)} L${P(kopf[0] + 0.35, kopf[1] + 0.18)} Z" fill="#3a3a3a"/>`;
    g += `<path d="M${P(-0.2, -0.45)} L${P(-0.1, 0)} M${P(0.3, -0.45)} L${P(0.45, 0)}" stroke="#c4584a" stroke-width="${r(0.16 * a)}"/>`;
    schlag(lat, d, 0.25, 0.3, 0.3);
    return g + `</g>`;
  };
  for (const [lat, d, dir, pick] of [[-1.6, 17.5, 1, 1], [-0.7, 18.6, -1, 0], [0.6, 16.6, 1, 0], [-2.4, 19.8, -1, 1], [1.4, 19.2, -1, 1]]) k += taube(lat, d, dir, pick);
  for (let i = 0; i < 12; i++) { const [x, y] = proj(-2 + rnd() * 3.6, 16.4 + rnd() * 3.4); k += `<circle cx="${x}" cy="${y}" r=".35" fill="#e8d4a8"/>`; }
  S.teil({ id: "taube", de: "die Taube", syl: "TAU-be", it: "il piccione", itSyl: "pic-CIO-ne", en: "pigeon", x: 0, y: 0, kunst: licht(k),
    tipp: "Auf dem Platz vor der Porta Nigra suchen Tauben nach Krümeln." });
}

/* =====================================================================
   13 — DER SONNENSCHIRM, 14 — DER STUHL, 15 — DER GAST,
   16 — DER TISCH mit VIEZ, REIBEKUCHEN und MOSELWEIN (Café-Terrasse links vorn)
   FASSUNG 880 — XANDER (Funk 299): ‚stell den Alkohol wieder her … die Städte sollen authentisch dargestellt werden‘
   ===================================================================== */
const TISCH = { lat: -6.4, d: 18.2 };
const [TX, TY] = proj(TISCH.lat, TISCH.d), TK = km(TY);
{
  const lat = -7.3, d = 21, [x, y] = proj(lat, d), s = km(y), H = 2.45 * s, Wd = 1.3 * s;
  let k = `<rect x="${r(-0.03 * s)}" y="${r(-H)}" width="${r(0.06 * s)}" height="${r(H)}" fill="#d9d2c4"/>`;
  k += `<path d="M${r(-0.25 * s)} 0 L${r(0.25 * s)} 0 L${r(0.2 * s)} ${r(-0.1 * s)} L${r(-0.2 * s)} ${r(-0.1 * s)} Z" fill="#4a4a4a"/>`;
  k += `<path d="M${r(-Wd)} ${r(-H + 0.42 * s)} Q${r(-Wd * 0.5)} ${r(-H - 0.05 * s)} 0 ${r(-H - 0.12 * s)} Q${r(Wd * 0.5)} ${r(-H - 0.05 * s)} ${r(Wd)} ${r(-H + 0.42 * s)} Z" fill="${S.lg("schirm", [[0, "#fff8ec"], [0.6, "#efe4cc"], [1, "#c9b996"]], 0, 0, 1, 0)}"/>`;
  for (const t of [-0.6, -0.2, 0.2, 0.6]) k += `<path d="M0 ${r(-H - 0.12 * s)} L${r(t * Wd)} ${r(-H + 0.32 * s)}" stroke="#cdbf9f" stroke-width=".4"/>`;
  let vol = `M${r(-Wd)} ${r(-H + 0.42 * s)} `;
  for (let i = 0; i < 8; i++) vol += `q${r(Wd * 0.125)} ${r(0.08 * s)} ${r(Wd * 0.25)} 0 `;
  k += `<path d="${vol}" fill="#9b2b30"/>`;
  k += `<text x="${r(Wd * 0.2)}" y="${r(-H + 0.32 * s)}" font-size="${r(0.17 * s)}" text-anchor="middle" fill="#9b2b30" font-family="Georgia,serif" font-style="italic">Riesling</text>`;
  schlag(lat, d, 2.4, 2.4, 0.25);
  S.teil({ id: "sonnenschirm", de: "der Sonnenschirm", syl: "SON-nen-schirm", it: "l'ombrellone", itSyl: "om-brel-LO-ne", en: "parasol", x, y, kunst: licht(k) });
}
const stuhl = (s, dreh) => {
  const w = 0.42 * s, sh = 0.46 * s, lh = 0.86 * s, o = dreh * 0.1 * s;
  let k = `<path d="M${r(-w / 2)} 0 L${r(-w / 2 + o)} ${r(-sh)} M${r(w / 2)} 0 L${r(w / 2 + o)} ${r(-sh)} M${r(-w / 2 + o * 1.6 + 0.04 * s)} ${r(-sh + 0.04 * s)} L${r(-w / 2 + 2.4 * o)} ${r(0.02 * s)} M${r(w / 2 + o * 1.6 - 0.04 * s)} ${r(-sh + 0.04 * s)} L${r(w / 2 + 2.4 * o)} ${r(0.02 * s)}" stroke="#2a2d30" stroke-width="${r(0.03 * s)}" fill="none"/>`;
  k += `<path d="M${r(-w / 2 + o)} ${r(-sh)} L${r(w / 2 + o)} ${r(-sh)} L${r(w / 2 + 2 * o)} ${r(-sh - 0.08 * s)} L${r(-w / 2 + 2 * o)} ${r(-sh - 0.08 * s)} Z" fill="${S.lg("rattan", [[0, "#c9a46a"], [1, "#9a7440"]])}"/>`;
  k += `<path d="M${r(-w / 2 + 2 * o)} ${r(-sh - 0.08 * s)} L${r(-w / 2 + 2.2 * o)} ${r(-lh)} Q${r(2.2 * o)} ${r(-lh - 0.06 * s)} ${r(w / 2 + 2.2 * o)} ${r(-lh)} L${r(w / 2 + 2 * o)} ${r(-sh - 0.08 * s)}" stroke="#2a2d30" stroke-width="${r(0.035 * s)}" fill="none"/>`;
  k += `<path d="M${r(-w / 2 + 2.2 * o)} ${r(-lh + 0.08 * s)} L${r(w / 2 + 2.2 * o)} ${r(-lh + 0.08 * s)} L${r(w / 2 + 2.1 * o)} ${r(-lh + 0.18 * s)} L${r(-w / 2 + 2.1 * o)} ${r(-lh + 0.18 * s)} Z" fill="#b08850"/>`;
  return k;
};
let GASTHAND = null;
const STUHL_L = { lat: TISCH.lat - 0.8, d: TISCH.d + 0.5 };
{
  const [x1, y1] = proj(STUHL_L.lat, STUHL_L.d), [x2, y2] = proj(TISCH.lat + 0.8, TISCH.d + 0.6);
  const k = `<g transform="translate(${r(x1 - TX)} ${r(y1 - TY)})">${stuhl(km(y1), 1)}</g><g transform="translate(${r(x2 - TX)} ${r(y2 - TY)})">${stuhl(km(y2), -1)}</g>`;
  schlag(STUHL_L.lat, STUHL_L.d, 0.86, 0.45, 0.3); schlag(TISCH.lat + 0.8, TISCH.d + 0.6, 0.86, 0.45, 0.3);
  S.teil({ id: "stuhl", de: "der Stuhl", syl: "STUHL", it: "la sedia", itSyl: "SE-dia", en: "chair", x: TX, y: TY, kunst: licht(k) });
}
{
  /* DER GAST: ein älterer Herr sitzt auf dem linken Stuhl und trinkt Viez (der Stuhl bleibt sichtbar) */
  const [x, y] = proj(STUHL_L.lat, STUHL_L.d), s = km(y);
  const greif = Object.assign({}, POSEN.sitzen, { schulterR: { vor: 44, seit: 14 }, ellbogenR: 46, unterarmR: -40, handR: -6, fingerR: 0.6, kopf: -12, nacken: 2 });
  const m = figur({ id: "trr_gast", alter: "alt", geschlecht: "m", pose: greif, blick: 58, frisur: "glatze", haarfarbe: "grau", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "hemd", farbe: "#d8e4ec" }, unterteil: { stueck: "hose", farbe: "#5a5048" }, jacke: { stueck: "weste", farbe: "#6a5038" }, schuhe: { stueck: "halbschuh", farbe: "braun" }, kopf: { stueck: "hut", farbe: "#8a7a5a" } } }, 1.72 * s, 0.6);
  const sitzY = m.z.sitz.y * m.k;
  S.teil({ id: "gast", de: "der Gast", syl: "GAST", it: "l'ospite", itSyl: "O-spi-te", en: "guest", x, y: r(y - 0.2), kunst: `<g transform="translate(${r(0.1 * s)} ${r(-0.46 * s - sitzY)})">${m.svg}</g>`,
    tipp: "Der Gast trinkt einen Viez. Er schaut zur Porta Nigra hinauf." });
  GASTHAND = { x: x + 0.1 * s + m.z.handR.x * m.k, y: r(y - 0.2) - 0.46 * s - sitzY + m.z.handR.y * m.k };
}
{
  const s = TK, TH = 0.74 * s, R = 0.36 * s;
  let k = `<path d="M${r(-0.18 * s)} 0 L${r(0.18 * s)} 0 L${r(0.03 * s)} ${r(-0.08 * s)} L${r(-0.03 * s)} ${r(-0.08 * s)} Z" fill="#2c3236"/><rect x="${r(-0.025 * s)}" y="${r(-TH)}" width="${r(0.05 * s)}" height="${r(TH - 0.06 * s)}" fill="#3a4045"/>`;
  k += `<ellipse cx="0" cy="${r(-TH)}" rx="${r(R)}" ry="${r(R * 0.2)}" fill="#8b9298"/><ellipse cx="0" cy="${r(-TH - 0.02 * s)}" rx="${r(R)}" ry="${r(R * 0.2)}" fill="${S.lg("marmor", [[0, "#f3f1ec"], [1, "#d6d2c8"]])}"/>`;
  const top = -TH - 0.02 * s;
  /* FASSUNG 880 — XANDER (Funk 299): ‚stell den Alkohol wieder her … die Städte sollen authentisch dargestellt werden‘
     DER VIEZ im Viezporz (weißer Porzellanbecher mit blauem Strich, goldgelber Viez) genau unter der Hand des Gastes, der Henkel zeigt zu ihm */
  const vx = Math.max(-0.27 * s, Math.min(-0.16 * s, GASTHAND.x - TX + 0.03 * s));
  k += `<path d="M${r(vx - 0.045 * s)} ${r(top + 0.01 * s)} L${r(vx - 0.05 * s)} ${r(top - 0.11 * s)} L${r(vx + 0.05 * s)} ${r(top - 0.11 * s)} L${r(vx + 0.045 * s)} ${r(top + 0.01 * s)} Z" fill="${S.lg("porz", [[0, "#ffffff"], [0.7, "#eeece6"], [1, "#cfcbc2"]], 0, 0, 1, 0)}"/>`;
  k += `<ellipse cx="${r(vx)}" cy="${r(top - 0.11 * s)}" rx="${r(0.05 * s)}" ry="${r(0.012 * s)}" fill="#d9b25a"/>`;
  k += `<path d="M${r(vx - 0.048 * s)} ${r(top - 0.09 * s)} q${r(-0.04 * s)} 0 ${r(-0.035 * s)} ${r(0.035 * s)} q0 ${r(0.03 * s)} ${r(0.038 * s)} ${r(0.03 * s)}" stroke="#f6f4ef" stroke-width="${r(0.012 * s)}" fill="none"/>`;
  k += `<path d="M${r(vx - 0.03 * s)} ${r(top - 0.06 * s)} h${r(0.06 * s)}" stroke="#3a5a9a" stroke-width=".25"/>`;
  /* der Teller mit zwei Reibekuchen und Apfelmus (Mitte) */
  const px = -0.04 * s;
  k += `<ellipse cx="${r(px)}" cy="${r(top - 0.006 * s)}" rx="${r(0.1 * s)}" ry="${r(0.024 * s)}" fill="#fbfaf6" stroke="#cfcac0" stroke-width=".15"/>`;
  /* zwei flache, unregelmäßige Fladen ohne Loch: dunkler, ausgefranster Rand, goldbraune Fläche, helle Raspelstriche */
  const zr = zufall(66);
  for (const [dx, dy, rx] of [[-0.035, 0.012, 0.046], [0.022, 0.017, 0.042]]) {
    const cx = px + dx * s, cy = top - dy * s, R1 = rx * s, R2 = R1 * 0.32;
    let au = "", in2 = "";
    for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2, f = 0.86 + zr() * 0.2; au += `${i ? "L" : "M"}${r(cx + Math.cos(a) * R1 * f)} ${r(cy + Math.sin(a) * R2 * f)} `; in2 += `${i ? "L" : "M"}${r(cx + Math.cos(a) * R1 * 0.78 * f)} ${r(cy - 0.002 * s + Math.sin(a) * R2 * 0.7 * f)} `; }
    k += `<path d="${au}Z" fill="#8a5420"/><path d="${in2}Z" fill="#cf9446"/>`;
    k += `<path d="M${r(cx - R1 * 0.5)} ${r(cy - R2 * 0.2)} l${r(R1 * 0.28)} ${r(-R2 * 0.2)} M${r(cx - R1 * 0.1)} ${r(cy + R2 * 0.15)} l${r(R1 * 0.3)} ${r(-R2 * 0.25)} M${r(cx + R1 * 0.2)} ${r(cy - R2 * 0.35)} l${r(R1 * 0.25)} ${r(-R2 * 0.1)}" stroke="#f2c878" stroke-width=".22" fill="none"/>`;
  }
  /* Apfelmus im Schälchen am Tellerrand */
  k += `<path d="M${r(px + 0.045 * s)} ${r(top - 0.024 * s)} Q${r(px + 0.068 * s)} ${r(top - 0.002 * s)} ${r(px + 0.091 * s)} ${r(top - 0.024 * s)} Z" fill="#f4f1ea" stroke="#cfcac0" stroke-width=".12"/><ellipse cx="${r(px + 0.068 * s)}" cy="${r(top - 0.024 * s)}" rx="${r(0.023 * s)}" ry="${r(0.006 * s)}" fill="#ecd590"/>`;
  /* DER MOSELWEIN: Riesling im „Römer“ (grüner, hohler Stiel mit Noppen, helle Kelchschale mit hellgelbem Wein; rechts, deutlich abgerückt) */
  const wx = 0.2 * s;
  k += `<path d="M${r(wx - 0.035 * s)} ${r(top + 0.005 * s)} L${r(wx + 0.035 * s)} ${r(top + 0.005 * s)} L${r(wx + 0.01 * s)} ${r(top - 0.012 * s)} L${r(wx + 0.008 * s)} ${r(top - 0.07 * s)} L${r(wx - 0.008 * s)} ${r(top - 0.07 * s)} L${r(wx - 0.01 * s)} ${r(top - 0.012 * s)} Z" fill="#3f7a3a"/>`;
  for (const t of [0.02, 0.04, 0.06]) k += `<circle cx="${r(wx)}" cy="${r(top - t * s)}" r="${r(0.012 * s)}" fill="#5c9a52"/>`;
  k += `<path d="M${r(wx - 0.045 * s)} ${r(top - 0.15 * s)} Q${r(wx - 0.05 * s)} ${r(top - 0.07 * s)} ${r(wx)} ${r(top - 0.068 * s)} Q${r(wx + 0.05 * s)} ${r(top - 0.07 * s)} ${r(wx + 0.045 * s)} ${r(top - 0.15 * s)} Z" fill="#eef4e8" opacity=".55" stroke="#c9d6c4" stroke-width=".15"/>`;
  k += `<path d="M${r(wx - 0.043 * s)} ${r(top - 0.115 * s)} Q${r(wx - 0.045 * s)} ${r(top - 0.075 * s)} ${r(wx)} ${r(top - 0.072 * s)} Q${r(wx + 0.045 * s)} ${r(top - 0.075 * s)} ${r(wx + 0.043 * s)} ${r(top - 0.115 * s)} Z" fill="#f2df8a" opacity=".85"/>`;
  k += `<path d="M${r(wx - 0.03 * s)} ${r(top - 0.14 * s)} q.3 1.6 .3 3" stroke="#fff" stroke-width=".35" opacity=".8" fill="none"/>`;
  schlag(TISCH.lat, TISCH.d, 0.74, 0.7, 0.3);
  S.teil({ oben: true, id: "tisch", de: "der Tisch", syl: "TISCH", it: "il tavolino", itSyl: "ta-vo-LI-no", en: "table", x: TX, y: TY, steht: true, kunst: licht(k),
    zoom: { x: r(TX - 0.75 * s), y: r(TY - 1.15 * s), w: r(1.5 * s), h: r(1.0 * s) },
    unter: [
      { id: "viez", de: "der Viez", syl: "VIEZ", it: "il sidro di Treviri", itSyl: "SI-dro di TRE-vi-ri", en: "Trier cider", x: r(TX + vx), y: r(TY + top + 0.01 * s), kunst: flaeche(-0.08 * s, -0.14 * s, 0.16 * s, 0.15 * s, 0.4),
        tipp: "Viez ist ein saurer Apfelwein aus der Gegend von Trier. Man trinkt ihn aus einem Porzellanbecher. Der Becher heißt Viezporz." },
      { id: "reibekuchen", de: "der Reibekuchen", syl: "REI-be-ku-chen", it: "la frittella di patate", itSyl: "frit-TEL-la di pa-TA-te", en: "potato pancake", x: r(TX + px), y: r(TY + top), kunst: flaeche(-0.1 * s, -0.06 * s, 0.2 * s, 0.08 * s, 0.4),
        tipp: "In Trier sagt man zu Reibekuchen „Gromperekichelcher“. Man macht sie aus Kartoffeln." },
      { id: "moselwein", de: "der Moselwein", syl: "MO-sel-wein", it: "il vino della Mosella", itSyl: "VI-no del-la mo-SEL-la", en: "Moselle wine", x: r(TX + wx), y: r(TY + top - 0.15 * s), kunst: flaeche(-0.06 * s, -0.01 * s, 0.13 * s, 0.18 * s, 0.4),
        tipp: "An der Mosel wächst viel Riesling. Schon die Römer haben hier Wein angebaut." },
    ] });
}

/* Schatten des Eckhauses: ein großer Keil fällt nach rechts hinten über den linken Platzteil */
{
  const { lat, d0, d1, h } = CAFE;
  const L = SONNE.lang * h, dl = Math.sin(SONNE.az) * L, dd = Math.cos(SONNE.az) * L;
  const pts = [[lat, d0], [lat + dl, d0 + dd], [lat + dl, d1 + dd], [lat - 6 + dl, d1 + dd], [lat, d1]].map(([la, d]) => proj(la, Math.min(d, 69.5)));
  SCHATTEN.unshift(`<path d="${pfad(pts.map(([x, y]) => [Math.max(0, x), y]))}" fill="#2e3040" opacity=".4"/>`);
}
PFLASTER_TEIL.kunst += SCHATTEN.join("");

/* vorn rechts angeschnitten: ein Pflanzkübel mit Buchskugel (Rahmen, fängt keinen Tipp) */
{
  const [x, y] = proj(4.5, 14.2), s = km(y);
  let g = `<path d="M${r(x - 0.05 * s)} ${r(y)} L${r(x + 0.9 * s)} ${r(y - 0.05 * s)} L${r(x + 0.9 * s)} ${r(y + 0.12 * s)} L${r(x + 0.05 * s)} ${r(y + 0.12 * s)} Z" fill="#2a2630" opacity=".35"/>`;
  g += `<path d="M${r(x - 0.3 * s)} ${r(y - 0.55 * s)} H${r(x + 0.3 * s)} L${r(x + 0.26 * s)} ${y} H${r(x - 0.26 * s)} Z" fill="${S.lg("kuebel", [[0, "#9a9086"], [0.35, "#7a7068"], [1, "#4e4741"]], 0, 0, 1, 0)}"/><rect x="${r(x - 0.32 * s)}" y="${r(y - 0.6 * s)}" width="${r(0.64 * s)}" height="${r(0.07 * s)}" fill="#a8a096"/>`;
  g += krone(x, r(y - 0.85 * s), 0.34 * s, 0.3 * s, 77, { n: 20, rb: 0.2, lappen: 2, farben: ["#22381a", "#365a26", "#5a8238", "#86a85a", "#132010"], lx: -1 });
  S.davor(g);
}
/* eine Taube fliegt über den Platz (über allem, fängt aber keinen Tipp: sonst wäre die Fläche der Taube riesig) */
S.davor(`<g transform="translate(232 118)"><path d="M-5 -.2 Q-2.6 -3.2 0 -.4 Q2.6 -3.6 5.2 -1.2 Q2.6 -1.2 .4 1 Q-2.6 -.6 -5 -.2 Z" fill="#8c939c"/><path d="M-3.4 -1.2 L-1.6 -.6 M3.4 -1.6 L1.8 -.8" stroke="#3d434a" stroke-width=".5"/><ellipse cx=".2" cy=".1" rx="2" ry=".8" fill="#9aa1aa"/><circle cx="2.2" cy="-.3" r=".6" fill="#6f7680"/><path d="M-1.8 .2 L-3.2 .9 L-3 -.2 Z" fill="#6f7680"/></g>`);

/* Nachmittagslicht über allem (fängt keinen Tipp ab) */
S.davor(`<rect width="${W}" height="${HH}" fill="${S.rg("abend", [[0, "#ffd9a0", 0.14], [0.6, "#ffd9a0", 0], [1, "#000", 0.08]], 0.05, 0.5, 1.1)}" pointer-events="none"/>`);

/* Ladezeit: alle Pfade relativ und auf 0,1 gerundet */
for (const t of S.teile) { t.kunst = verdichteSVG(t.kunst, 0.1); for (const u of t.unter || []) u.kunst = verdichteSVG(u.kunst, 0.1); }
S.kulisse = S.kulisse.map((x) => verdichteSVG(x, 0.1)); S.defs = S.defs.map((x) => verdichteSVG(x, 0.1)); S.vorne = S.vorne.map((x) => verdichteSVG(x, 0.1));
const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/trier.js"));
console.log(aus);
