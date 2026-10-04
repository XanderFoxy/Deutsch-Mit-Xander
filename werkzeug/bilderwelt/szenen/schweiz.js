#!/usr/bin/env node
/* =====================================================================
   SCHWEIZ – ZERMATT UND MATTERHORN (FASSUNG 854) — Bilderwelt neu
   ---------------------------------------------------------------------
   XANDER (03.10.): „die bekanntesten Städte in anderen Ländern … als
   Profi-Grafikdesigner auf Hollywood-Niveau … mit größter Sorgfalt und
   Präzision auf höchstem Niveau“.

   STANDORT: die KIRCHBRÜCKE in Zermatt (1600 m) über die Matter Vispa,
   der bekannteste Fotopunkt des Dorfes (zermatt.ch „Viewpoint
   Kirchbrücke“, locationscout „Matterhorn from Kirchbrücke“): Blick
   flussaufwärts nach SÜDWESTEN (Azimut ≈ 232°). „Das Matterhorn mit ein
   paar Stadeln, eingerahmt von alten Lärchen“ (zermatt.ch).
   RECHERCHE (Swisstopo-Koordinaten, Factsheet Matterhorn zermatt.ch,
   Wikipedia „Matterhorn“, jagged-globe; Unsicheres markiert):
   - MATTERHORN 4478 m, 8,6 km entfernt, Azimut 235° (2,8° rechts der
     Bildmitte), 18,7° über dem Auge. Von Zermatt sieht man die OSTWAND
     (links, morgens in der Sonne) und die NORDWAND (rechts, fast immer
     im Schatten); dazwischen der HÖRNLIGRAT (Nordostgrat, Weg der
     Erstbesteigung 1865 durch Edward Whymper), der fast genau auf
     Zermatt zuläuft und deshalb beinahe senkrecht unter dem Gipfel
     herabzieht, mit der „Schulter“ (≈ 4160–4250 m). Am Fuß des Grats auf
     3260 m die HÖRNLIHÜTTE (Azimut 235°, 7,3 km — genau unter dem
     Gipfel). Linke Silhouette: der Furggengrat — oben fast senkrecht
     (der Gipfel wirkt wie ein nach links geneigter Haken), unten flach
     zum Furggjoch (3271 m, Azimut 219°). Rechte Silhouette: der
     Zmuttgrat mit der „Zmuttnase“, steil (≈ 45°). Gestein: Gneis, braun-
     grau, waagrechte Bänder; im Herbst Neuschnee auf den Bändern. Am Fuß
     Gletscher (Furgg- und Matterhorngletscher).
   - Die FAHNENWOLKE: Wind formt auf der windabgewandten Seite eine
     Wolkenfahne am Gipfel (hier nach links/Osten, bei Westwind).
   - Davor das Hirli/Schwarzsee-Gebiet (2600–2900 m) und bewaldete
     Hänge (Lärchen und Arven). Links der schattige Hang (Furi/Riffelalp-
     Seite, er schaut nach Nordwesten), rechts der sonnige Hang (Trift).
   - DORF: autofrei (nur Elektrofahrzeuge, die ELEKTROTAXIS), Chalets aus
     sonnengebräuntem Lärchenholz auf weiß verputztem Steinsockel,
     Holzbalkone mit GERANIEN, Dächer aus grauen Steinplatten (Gneis).
     Die alten STADEL (Getreidespeicher) stehen auf hölzernen STÜTZEN mit
     runden STEINPLATTEN, damit keine Mäuse hineinkommen.
   - Die Matter Vispa: milchig-grünes Gletscherwasser über Steinen,
     zwischen gemauerten Ufern; daneben Wege mit Bänken.
   - Typisches: KÄSEFONDUE und RACLETTE auf der Terrasse, die KUHGLOCKE als
     Schmuck, das rote TASCHENMESSER und SCHOKOLADE im Picknick der
     WANDERER, die Schweizer FLAGGE, ALPENDOHLEN. Bernhardiner nicht: das
     Fotografieren mit den Hunden ist in Zermatt seit 2015 verboten.
     Die Gornergratbahn ist von hier nicht zu sehen (UNSICHER) — weggelassen.
   ZEIT/LICHT: Ende September, 10 Uhr: Sonne im Südosten (Azimut 135°,
   35° hoch) — für uns LINKS und etwas hinter uns. Ostwand und rechter
   Hang leuchten, Nordwand und linker Hang im Schatten; Schatten fallen
   nach rechts. Die Lärchen werden schon golden.
   KAMERA: Augenhöhe 6,5 m über dem Fluss (Brücke 4,8 m + 1,7 m),
   Horizont y = 170, Brennweite 380, Fluchtpunkt x = 200. Ufer 4,2 m über
   dem Wasser, Talboden steigt 2 %. Punkt X quer, D Abstand, h Höhe:
   x = 200 + 380·X/D, y = 170 − (h − 6,5)·380/D. Ferne: Matterhorn in
   8,57 km = 0,0443 Einheiten je Meter (1000 m = 44 Einheiten).
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "schweiz", titel: "Schweiz – Zermatt und Matterhorn", emoji: "🏔️", thema: "Länder", kuerzel: "chz", fassung: 854, breite: 400, hoehe: 260 });
{ const lg = S.lg, rg = S.rg, schon = {}; S.lg = (n, ...a) => schon["l" + n] || (schon["l" + n] = lg(n, ...a)); S.rg = (n, ...a) => schon["r" + n] || (schon["r" + n] = rg(n, ...a)); }
/* anker: Kunst in Bildkoordinaten, Bezugspunkt (x, y) für die App.
   Alles, was über den Bildrand hinausragt, auf den Rand setzen (unsichtbar dort, aber die Trefferfläche bleibt im Bild) */
function kappe(svg) {
  const X0 = -1, Y0 = -1, X1 = 401, Y1 = 261, kx = (v) => Math.min(X1, Math.max(X0, v)), ky = (v) => Math.min(Y1, Math.max(Y0, v));
  const zahl = (v) => String(Math.round(v * 10) / 10);
  svg = svg.replace(/ d="([^"]*)"/g, (m0, d) => {
    let out = "", cmd = "", idx = 0;
    const tok = d.match(/[MLCQSTHVAZmlcqsthvaz]|-?\d*\.?\d+(?:e-?\d+)?/g) || [];
    for (const t of tok) {
      if (/[A-Za-z]/.test(t)) { cmd = t; idx = 0; out += t; continue; }
      let v = parseFloat(t);
      if ("MLCQST".includes(cmd)) v = idx % 2 ? ky(v) : kx(v);
      else if (cmd === "H") v = kx(v); else if (cmd === "V") v = ky(v);
      else if (cmd === "A") { const j = idx % 7; if (j === 5) v = kx(v); if (j === 6) v = ky(v); }
      out += (out && /[\d.]$/.test(out) ? " " : "") + zahl(v); idx++;
    }
    return ` d="${out}"`;
  });
  /* Kreise und Ellipsen am Rand: als Vieleck, dann begrenzt */
  svg = svg.replace(/<(circle|ellipse)([^>]*?)\/>/g, (el, typ, at) => {
    const g = (n) => { const m = at.match(new RegExp(" " + n + '="([-\\d.]+)"')); return m ? parseFloat(m[1]) : 0; };
    const cx = g("cx"), cy = g("cy"), rx = typ === "circle" ? g("r") : g("rx"), ry = typ === "circle" ? g("r") : g("ry");
    if (cx - rx >= X0 - 4 && cx + rx <= X1 + 4 && cy - ry >= Y0 - 4 && cy + ry <= Y1 + 4) return el;
    if (cx + rx < X0 || cx - rx > X1 || cy + ry < Y0 || cy - ry > Y1) return "";
    const pts = Array.from({ length: 16 }, (_, i) => [kx(cx + Math.cos(i * Math.PI / 8) * rx), ky(cy + Math.sin(i * Math.PI / 8) * ry)]);
    const rest = at.replace(/ (cx|cy|r|rx|ry)="[^"]*"/g, "");
    return `<path d="M${pts.map(([a, b]) => zahl(a) + " " + zahl(b)).join(" L")} Z"${rest}/>`;
  });
  svg = svg.replace(/<rect([^>]*?)\/>/g, (el, at) => {
    const g = (n) => { const m = at.match(new RegExp(" " + n + '="([-\\d.]+)"')); return m ? parseFloat(m[1]) : 0; };
    if (/transform=/.test(at)) return el;
    const x = g("x"), y = g("y"), w = g("width"), h = g("height");
    const xa = kx(x), ya = ky(y), xb = kx(x + w), yb = ky(y + h);
    if (xb <= xa || yb <= ya) return "";
    return `<rect${at.replace(/ (x|y|width|height)="[^"]*"/g, "")} x="${zahl(xa)}" y="${zahl(ya)}" width="${zahl(xb - xa)}" height="${zahl(yb - ya)}"/>`;
  });
  return svg;
}
{ const teil = S.teil; S.teil = (t) => { if (t.anker) { const [ax, ay] = t.anker; t.kunst = `<g transform="translate(${B.r(-ax)} ${B.r(-ay)})">${kappe(t.kunst)}</g>`; t.x = ax; t.y = ay; delete t.anker; } return teil(t); }; }
const rnd = zufall(1865);
const r = B.r;

/* ---------- Kamera ---------------------------------------------------- */
const VPX = 200, HOR = 196, F = 380, E = 6.5;
/* Ferne (Berge, Hänge) wurde für den Horizont 170 und 0,0443 Einheiten je Meter entworfen; im Bild steht sie 1,368-mal größer
   um den Horizont 196 (Teleblick wie auf den bekannten Fotos): T rechnet jeden Punkt um */
const KF = 1.368, T = (x, y) => [200 + (x - 200) * KF, 196 + (y - 170) * KF];
function fern(svg) {
  const z = (v) => String(Math.round(v * 10) / 10);
  svg = svg.replace(/ d="([^"]*)"/g, (m0, d) => {
    let out = "", cmd = "", idx = 0, px = 0;
    for (const t of d.match(/[MLCQSTHVAZmlcqsthvaz]|-?\d*\.?\d+(?:e-?\d+)?/g) || []) {
      if (/[A-Za-z]/.test(t)) { cmd = t; idx = 0; out += t; continue; }
      let v = parseFloat(t);
      if ("MLCQST".includes(cmd)) { if (idx % 2 === 0) px = v; else { const q = T(px, v); out += (out && /[\d.]$/.test(out) ? " " : "") + z(q[0]) + " " + z(q[1]); } idx++; continue; }
      out += (out && /[\d.]$/.test(out) ? " " : "") + z(v * KF); idx++;
    }
    return ` d="${out}"`;
  });
  svg = svg.replace(/<(circle|ellipse|rect)([^>]*?)\/>/g, (el, typ, at) => {
    const g = (n) => { const m = at.match(new RegExp(" " + n + '="([-\\d.]+)"')); return m ? parseFloat(m[1]) : null; };
    let neu = at;
    const setz = (n, v) => { neu = neu.replace(new RegExp(" " + n + '="[^"]*"'), ` ${n}="${z(v)}"`); };
    if (typ === "rect") { const q = T(g("x") || 0, g("y") || 0); setz("x", q[0]); setz("y", q[1]); setz("width", g("width") * KF); setz("height", g("height") * KF); }
    else { const q = T(g("cx"), g("cy")); setz("cx", q[0]); setz("cy", q[1]); for (const n of ["r", "rx", "ry"]) if (g(n) !== null) setz(n, g(n) * KF); }
    return `<${typ}${neu}/>`;
  });
  return svg.replace(/stroke-width="([\d.]+)"/g, (m, v) => `stroke-width="${z(parseFloat(v) * KF)}"`);
}
const P = (X, D, h) => [VPX + F * X / D, HOR - (h - E) * F / D];
const pt = (q) => `${r(q[0])} ${r(q[1])}`;
function zuschnitt(pts, x0 = -2, y0 = -2, x1 = 402, y1 = 262) {
  const kanten = [[(p) => p[0] >= x0, (a, b) => [x0, a[1] + (b[1] - a[1]) * (x0 - a[0]) / (b[0] - a[0])]], [(p) => p[0] <= x1, (a, b) => [x1, a[1] + (b[1] - a[1]) * (x1 - a[0]) / (b[0] - a[0])]],
    [(p) => p[1] >= y0, (a, b) => [a[0] + (b[0] - a[0]) * (y0 - a[1]) / (b[1] - a[1]), y0]], [(p) => p[1] <= y1, (a, b) => [a[0] + (b[0] - a[0]) * (y1 - a[1]) / (b[1] - a[1]), y1]]];
  let out = pts;
  for (const [innen, schnitt] of kanten) {
    const inp = out; out = [];
    for (let i = 0; i < inp.length; i++) {
      const a = inp[(i + inp.length - 1) % inp.length], b = inp[i];
      if (innen(b)) { if (!innen(a)) out.push(schnitt(a, b)); out.push(b); } else if (innen(a)) out.push(schnitt(a, b));
    }
    if (!out.length) break;
  }
  return out;
}
/* Strecke auf das Bild beschneiden (Liang–Barsky); null, wenn ganz draußen */
function strecke(a, b, x0 = -1, y0 = -1, x1 = 401, y1 = 261) {
  let t0 = 0, t1 = 1; const dx = b[0] - a[0], dy = b[1] - a[1];
  for (const [p, q] of [[-dx, a[0] - x0], [dx, x1 - a[0]], [-dy, a[1] - y0], [dy, y1 - a[1]]]) {
    if (p === 0) { if (q < 0) return null; continue; }
    const t = q / p;
    if (p < 0) { if (t > t1) return null; if (t > t0) t0 = t; } else { if (t < t0) return null; if (t < t1) t1 = t; }
  }
  return [[a[0] + dx * t0, a[1] + dy * t0], [a[0] + dx * t1, a[1] + dy * t1]];
}
/* Linie vereinfachen (Douglas–Peucker), fein — keine Treppen */
function dp(pts, eps = 0.12) {
  if (pts.length < 3) return pts;
  const [a, b] = [pts[0], pts[pts.length - 1]], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1e-9;
  let mi = 0, md = -1;
  for (let i = 1; i < pts.length - 1; i++) { const d = Math.abs(dy * (pts[i][0] - a[0]) - dx * (pts[i][1] - a[1])) / L; if (d > md) { md = d; mi = i; } }
  if (md <= eps) return [a, b];
  return dp(pts.slice(0, mi + 1), eps).slice(0, -1).concat(dp(pts.slice(mi), eps));
}
const pz = (pts) => { const z = zuschnitt(pts); return z.length > 2 ? "M" + z.map(pt).join(" L") + " Z" : ""; };
/* Figuren aus B.mensch verschlanken (Ladezeit!): feine Linien weg, Zahlen auf ganze Zentimeter (nie in transform) */
function schlank(svg, stufe = 1) {
  const grenze = stufe >= 2 ? 1.2 : 0.6;
  svg = svg.replace(/<(path|ellipse|line)\b[^>]*?\/>/g, (el) => { const sw = el.match(/stroke-width="([\d.]+)"/); return /fill="none"/.test(el) && sw && parseFloat(sw[1]) < grenze ? "" : el; });
  if (stufe >= 2) {
    const farbe = {};
    svg.replace(/<(linearGradient|radialGradient) id="([^"]+)"[^>]*>(.*?)<\/\1>/g, (_, t, id, inn) => { const st = [...inn.matchAll(/stop-color="([^"]+)"/g)].map((m) => m[1]); farbe[id] = st[Math.floor(st.length / 2)] || "#888"; return ""; });
    svg = svg.replace(/<defs>.*?<\/defs>/g, "").replace(/ clip-path="url\(#[^)]+\)"/g, "").replace(/url\(#([^)]+)\)/g, (_, id) => farbe[id] || "#888");
  }
  return svg.split(/(transform="[^"]*"|offset="[^"]*"|opacity="[^"]*")/).map((t, i) => i % 2 ? t : t.replace(/(-?\d+\.\d+)/g, (m) => String(Math.round(parseFloat(m))))).join("");
}
const mix = (c1, c2, f) => "#" + [1, 3, 5].map((i) => Math.round(parseInt(c1.substr(i, 2), 16) * (1 - f) + parseInt(c2.substr(i, 2), 16) * f).toString(16).padStart(2, "0")).join("");

/* geschlossene, glatte Kurve (Catmull-Rom) durch Punkte */
function rund(pts, ganz) {
  const n = pts.length, g = (i) => pts[(i + n) % n], rr = ganz ? Math.round : r;
  let d = `M${rr(pts[0][0])} ${rr(pts[0][1])}`;
  for (let i = 0; i < n; i++) { const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2); d += `C${rr(p1[0] + (p2[0] - p0[0]) / 6)} ${rr(p1[1] + (p2[1] - p0[1]) / 6)} ${rr(p2[0] - (p3[0] - p1[0]) / 6)} ${rr(p2[1] - (p3[1] - p1[1]) / 6)} ${rr(p2[0])} ${rr(p2[1])}`; }
  return d + "Z";
}
const ballen = (x, y, rr, z, n = 7) => rund(Array.from({ length: n }, (_, i) => { const a = i * Math.PI * 2 / n + z() * 0.3, q = rr * (0.78 + 0.32 * z()); return [x + Math.cos(a) * q, y + Math.sin(a) * q * 0.86]; }), rr > 3.5);
const hw = (D) => 0.02 * D, hb = (D) => 0.02 * D + 4.2;   /* Wasserspiegel, Uferhöhe */
const UFER = 7.6;   /* halbe Breite zwischen den Mauerkronen */
/* Sonne: links, etwas hinter uns, 35° hoch (Vektor zur Sonne in X, D, h) */
const SUN = [-0.813, -0.1, 0.574];
const sch = (h) => [h * 0.813 / 0.574, h * 0.1 / 0.574];   /* Schattenversatz am Boden für Höhe h (nach rechts, etwas nach hinten) */

/* ---------- Filter ---------- */
const CIF = ` color-interpolation-filters="sRGB"`;
S.def(`<filter id="bw_weich"${CIF} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("weich")}"${CIF} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation=".5"/></filter>`);
S.def(`<filter id="${S.id("dunst")}"${CIF} x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="2.2"/></filter>`);
S.def(`<filter id="${S.id("wasser")}"${CIF} x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".05 .35" numOctaves="2" seed="7"/><feDisplacementMap in="SourceGraphic" scale="3" xChannelSelector="R" yChannelSelector="G"/></filter>`);
/* Volumen: Lichtkante links (Sonne links), Eigenschatten rechts */
S.def(`<filter id="${S.id("vol")}"${CIF} x="-10%" y="-5%" width="120%" height="110%"><feOffset in="SourceAlpha" dx=".5" dy=".2" result="o"/><feComposite in="SourceAlpha" in2="o" operator="out" result="k"/><feFlood flood-color="#fff2d0" flood-opacity=".85"/><feComposite in2="k" operator="in" result="licht"/><feOffset in="SourceAlpha" dx="-1.3" result="o2"/><feComposite in="SourceAlpha" in2="o2" operator="out" result="s"/><feGaussianBlur in="s" stdDeviation=".6" result="sb"/><feFlood flood-color="#1a2440" flood-opacity=".38"/><feComposite in2="sb" operator="in"/><feComposite in2="SourceAlpha" operator="in" result="schatten"/><feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="schatten"/><feMergeNode in="licht"/></feMerge></filter>`);
const VOL = `filter="url(#${S.id("vol")})"`;

/* =====================================================================
   KULISSE 1 — Himmel (klarer Herbstmorgen, tiefblau oben)
   ===================================================================== */
S.hinten(`<rect width="400" height="262" fill="${S.lg("himmel", [[0, "#2f63a8"], [0.35, "#5b8bc8"], [0.7, "#a9c6e2"], [1, "#dfe9f0"]])}"/>`);
S.hinten(`<ellipse cx="-30" cy="40" rx="190" ry="120" fill="${S.rg("sonnenseite", [[0, "#fff4d8", 0.35], [1, "#fff4d8", 0]])}"/>`);

/* =====================================================================
   KULISSE 2 — ferne Berge links und rechts des Matterhorns (Dunst)
   ===================================================================== */
{
  let k = "";
  /* links: Theodulgebiet / Furggrat mit Gletschern (hinter dem Furggjoch) */
  k += `<path d="M60 112 L78 102 L92 99 L104 96 L114 94 L126 93.5 L140 92 L160 91 L180 92 L190 96 L190 120 L60 120 Z" fill="${S.lg("fernlinks", [[0, "#c9d5e2"], [1, "#a8b8c8"]])}"/>`;
  k += `<path d="M78 102 L92 99 L104 96 L114 94 L126 93.5 L140 92 L160 91 L172 91.6 L170 95 L150 96 L132 98 L112 99.5 L96 102 Z" fill="#f4f7fa" opacity=".95"/>`;
  /* rechts: Zmutt-Seite (Schönbiel), dunstig */
  k += `<path d="M262 120 L276 104 L292 99 L306 101 L322 97 L338 101 L356 108 L356 125 L262 125 Z" fill="${S.lg("fernrechts", [[0, "#c2cfdc"], [1, "#9fb1c2"]])}"/>`;
  k += `<path d="M292 99 L306 101 L322 97 L338 101 L330 103 L318 101.5 L306 104 L296 102.5 Z" fill="#f2f6fa" opacity=".9"/>`;
  S.hinten(fern(k));
}

/* =====================================================================
   DAS MATTERHORN — Silhouette nach Koordinaten (siehe RECHERCHE)
   ===================================================================== */
const GIPFEL = [218.6, 42.7];
const LINKS = [[218.6, 42.7], [217.3, 43.3], [215.9, 45], [214.6, 48.3], [213.1, 52.2], [211.2, 56.6], [208.5, 61], [205, 65.2], [200.6, 69], [195, 72.5], [187, 76.5], [178, 80.3], [166, 84.5], [152, 88.5], [136, 92], [118, 95], [100, 97.6]];
const RECHTSK = [[218.6, 42.7], [220.4, 43], [222.2, 43.6], [224, 45.3], [226.4, 48.8], [229.4, 53], [232.6, 57.2], [235.6, 60], [238.4, 61.2], [240.6, 62.7], [243.4, 65.6], [247.4, 69.6], [252.6, 74.4], [258.8, 79.4], [266, 84.8], [274, 90.2], [283, 95.8], [294, 101.6], [306, 107]];
const HOERNLI = [[219.1, 43.4], [219.7, 46.4], [220.5, 48.3], [222.2, 49.5], [223.3, 51.1], [223.2, 55], [222.6, 59.6], [222, 64.6], [221.4, 69.8], [220.8, 75], [220.3, 80], [220, 84], [219.6, 88], [219, 93], [218, 100]];
const HUETTE = [220.4, 84.6];
const ostPoly = [...LINKS, [100, 106], [218, 106], ...HOERNLI.slice().reverse()];
const nordPoly = [...HOERNLI, [218, 112], [306, 112], ...RECHTSK.slice().reverse()];
const pp = (pts) => "M" + pts.map(pt).join(" L") + " Z";
S.def(`<clipPath id="${S.id("ost")}"><path d="${pp(ostPoly)}"/></clipPath><clipPath id="${S.id("nord")}"><path d="${pp(nordPoly)}"/></clipPath>`);
let BERG = "";
{
  const z = zufall(4478);
  /* Ostwand: Morgensonne, warmes Grau-Ocker, oben heller */
  BERG += `<path d="${pp(ostPoly)}" fill="${S.lg("ostwand", [[0, "#efdcc0"], [0.35, "#d4bb9a"], [0.75, "#b59f86"], [1, "#9c8e80"]], 0, 0, 0, 1, ` gradientUnits="userSpaceOnUse" x1="0" y1="${r(T(0, 42)[1])}" x2="0" y2="${r(T(0, 106)[1])}"`)}"/>`;
  /* Nordwand: Schatten, kühles Blaugrau */
  BERG += `<path d="${pp(nordPoly)}" fill="${S.lg("nordwand", [[0, "#6d7d96"], [0.5, "#55657e"], [1, "#46546a"]], 0, 0, 0, 1, ` gradientUnits="userSpaceOnUse" x1="0" y1="${r(T(0, 42)[1])}" x2="0" y2="${r(T(0, 110)[1])}"`)}"/>`;
  /* Felsbänder (fallen nach links unten) und Neuschnee auf den Bändern — Ostwand */
  let baender = "", schnee = "", rinnen = "";
  for (let i = 0; i < 34; i++) {
    const y0 = 47 + Math.pow(z(), 0.9) * 55, x0 = 222 - z() * 8;
    const len = 6 + z() * 30;
    let pts = [[x0, y0]];
    for (let j = 1; j <= 5; j++) pts.push([x0 - len * j / 5, y0 + len * j / 5 * 0.36 + (z() - 0.5) * 0.8]);
    const d = "M" + pts.map(pt).join(" L");
    if (z() < 0.55) schnee += d; else baender += d;
  }
  for (let i = 0; i < 22; i++) {
    const x0 = 160 + z() * 60, y0 = 55 + z() * 40;
    let pts = [[x0, y0]];
    for (let j = 1; j <= 4; j++) pts.push([x0 - j * 1.4 + (z() - 0.5), y0 + j * 3.2]);
    rinnen += "M" + pts.map(pt).join(" L");
  }
  BERG += `<g clip-path="url(#${S.id("ost")})"><path d="${rinnen}" stroke="#7d6e60" stroke-width=".45" fill="none" opacity=".55"/><path d="${baender}" stroke="#8a7766" stroke-width=".5" fill="none" opacity=".6"/><path d="${schnee}" stroke="#fbfcff" stroke-width=".85" fill="none" opacity=".85" stroke-linecap="round"/>` +
    `<path d="M140 92 L170 86 L200 80 L218 78 L218 106 L140 106 Z" fill="#fff" opacity=".18"/>` +
    /* Schattenseite der Grate in der Ostwand (Rippen werfen kleine Schatten nach rechts) */
    `<path d="${pp(HOERNLI.map(([x, y]) => [x - 2.2, y]).concat(HOERNLI.slice().reverse()))}" fill="#7c6c5e" opacity=".35"/></g>`;
  /* Nordwand: Eis- und Schneerinnen (fallen nach rechts unten), Felsrippen */
  let eis = "", rippen = "";
  for (let i = 0; i < 26; i++) {
    const x0 = 221 + z() * 18, y0 = 47 + z() * 45, len = 8 + z() * 20;
    let pts = [[x0, y0]];
    for (let j = 1; j <= 4; j++) pts.push([x0 + len * j / 4 * 0.55 + (z() - 0.5) * 0.6, y0 + len * j / 4]);
    (z() < 0.6 ? (eis += "M" + pts.map(pt).join(" L")) : (rippen += "M" + pts.map(pt).join(" L")));
  }
  BERG += `<g clip-path="url(#${S.id("nord")})"><path d="${rippen}" stroke="#36435a" stroke-width=".6" fill="none" opacity=".6"/><path d="${eis}" stroke="#dce6f2" stroke-width=".9" fill="none" opacity=".75" stroke-linecap="round"/>` +
    `<path d="M226 86 L250 84 L270 88 L300 104 L300 112 L222 112 Z" fill="#e8eef6" opacity=".55"/></g>`;
  /* Lichtkante an der linken Silhouette und am Hörnligrat, Gipfelschnee */
  BERG += `<path d="M${LINKS.slice(0, 10).map(pt).join(" L")}" stroke="#fff6e4" stroke-width=".7" fill="none" opacity=".9"/>`;
  BERG += `<path d="M${HOERNLI.slice(0, 13).map(pt).join(" L")}" stroke="#fbeedd" stroke-width=".55" fill="none" opacity=".8"/>`;
  BERG += `<path d="M216.4 44.8 L218.6 42.7 L222.2 43.6 L223.6 45.6 L221 46 L219.4 45.2 Z" fill="#fdfdff"/>`;
  /* die Hörnlihütte (und das Berghaus daneben) am Fuß des Grats */
  BERG += `<rect x="${HUETTE[0] - 1.3}" y="${HUETTE[1] - 1}" width="2.6" height="1.2" fill="#f2efe8"/><path d="M${HUETTE[0] - 1.5} ${HUETTE[1] - 1} L${HUETTE[0]} ${HUETTE[1] - 1.8} L${HUETTE[0] + 1.5} ${HUETTE[1] - 1} Z" fill="#5a5450"/>`;
}

/* Die Fahnenwolke am Gipfel (nach links, windabgewandt) */
let FAHNE = "";
{
  const z = zufall(9);
  let c = "";
  for (let i = 0; i < 9; i++) { const t = i / 8, x = 214 - t * 34, y = 45 + t * 2 + Math.sin(t * 5) * 1.2, rr = 2.4 + t * 3.2 + z() * 1.2; c += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(rr * 1.5)}" ry="${r(rr * 0.75)}"/>`; }
  FAHNE = `<g fill="#ffffff" opacity=".78" filter="url(#${S.id("dunst")})">${c}</g><g fill="#fffaf0" opacity=".55" filter="url(#${S.id("weich")})">${c.replace(/rx="([\d.]+)"/g, (m, v) => `rx="${r(v * 0.6)}"`).replace(/ry="([\d.]+)"/g, (m, v) => `ry="${r(v * 0.5)}"`)}</g>`;
}

/* =====================================================================
   MITTLERE BERGE — Hirli/Schwarzsee-Rücken, Gletscher am Fuß
   ===================================================================== */
let MITTE = "";
{
  MITTE += `<path d="M110 112 L132 104 L150 101 L168 98.5 L184 96 L198 93 L208 90.5 L216 88.6 L224 90.4 L236 95 L250 99 L266 103 L284 108 L300 114 L300 140 L110 140 Z" fill="${S.lg("hirli", [[0, "#8c8a7e"], [0.4, "#7d7e66"], [1, "#5d6a48"]])}"/>`;
  /* Schutt und Felsrippen, Lichtseite links */
  MITTE += `<path d="M150 101 L168 98.5 L184 96 L198 93 L208 90.5 L216 88.6 L214 95 L196 101 L172 106 L150 108 Z" fill="#b7aa92" opacity=".55"/>`;
  MITTE += `<path d="M216 88.6 L224 90.4 L236 95 L250 99 L266 103 L284 108 L270 110 L246 104 L228 98 Z" fill="#4e5a6a" opacity=".35"/>`;
  /* Gletscherreste am Fuß der Nordwand und der Ostwand */
  MITTE += `<path d="M228 92.5 L246 93.4 L262 97 L276 101.6 L262 101.4 L246 98 L232 96 Z" fill="#eef3f8" opacity=".9"/>`;
  MITTE += `<path d="M168 95.4 L186 93 L198 91.2 L204 92.2 L190 95 L174 97.4 Z" fill="#f6f8fb" opacity=".9"/>`;
}

/* =====================================================================
   WALDHÄNGE — links im Schatten (Arven, Lärchen), rechts in der Sonne
   ===================================================================== */
function baeumchen(poly, n, seed, groesse, farben, hellRechts) {
  const z = zufall(seed), xs = poly.map((p) => p[0]), ys = poly.map((p) => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const innen = (x, y) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
  const wege = farben.map(() => "");
  const lichter = [];
  for (let i = 0, versuch = 0; i < n && versuch < n * 6; versuch++) {
    const x = x0 + z() * (x1 - x0), y = y0 + z() * (y1 - y0);
    if (!innen(x, y)) continue;
    const g = groesse(y), w = g * 0.36, k = Math.floor(z() * farben.length);
    wege[k] += `M${r(x)} ${r(y - g)}L${r(x + w)} ${r(y)}L${r(x - w)} ${r(y)}Z`;
    if (hellRechts !== null) lichter.push(`M${r(x)} ${r(y - g)}L${r(x + (hellRechts ? w : -w))} ${r(y)}L${r(x)} ${r(y)}Z`);
    i++;
  }
  return wege.map((d, i) => `<path d="${d}" fill="${farben[i]}"/>`).join("") + (lichter.length ? `<path d="${lichter.join("")}" fill="#fff" opacity=".12"/>` : "");
}
/* Waldtextur: kleine Nadelbäume (Arven dunkel, Lärchen golden) als Muster */
S.def(`<pattern id="${S.id("waldS")}" width="4.6" height="3.9" patternUnits="userSpaceOnUse" patternTransform="rotate(-8)"><path d="M1.2 0.4 L2.2 3.6 L0.2 3.6 Z M4.4 1.6 L5.5 4.9 L3.3 4.9 Z" fill="#1c3024"/><path d="M3 -0.6 L3.7 1.8 L2.3 1.8 Z" fill="#8a7030"/><path d="M1.2 0.4 L2.2 3.6 L1.2 3.6 Z" fill="#2c4636" opacity=".8"/></pattern>`);
S.def(`<pattern id="${S.id("waldL")}" width="4.6" height="3.9" patternUnits="userSpaceOnUse" patternTransform="rotate(6)"><path d="M1.2 0.4 L2.2 3.6 L0.2 3.6 Z M4.4 1.6 L5.5 4.9 L3.3 4.9 Z" fill="#2c4a2a"/><path d="M3 -0.6 L3.8 1.9 L2.2 1.9 Z" fill="#e0ae40"/><path d="M1.2 0.4 L0.2 3.6 L1.2 3.6 Z M4.4 1.6 L3.3 4.9 L4.4 4.9 Z" fill="#6f9446" opacity=".9"/></pattern>`);
let HANG_L = "", HANG_R = "", WALD_MITTE = "";
{
  /* fernere Waldhänge im Talschluss (Furi, Zmutt) */
  const mitte = [[140, 128], [160, 116], [180, 112], [200, 110], [222, 109], [240, 111], [262, 116], [282, 124], [282, 172], [140, 172]];
  WALD_MITTE = `<path d="${pp(mitte)}" fill="${S.lg("waldmitte", [[0, "#6f8456"], [1, "#4a6238"]])}"/><path d="${pp(mitte)}" fill="url(#${S.id("waldL")})" opacity=".55"/>` + baeumchen(mitte, 60, 3, (y) => 1.4 + (y - 110) * 0.06, ["#2a4226", "#d6a43a"], false);
  /* Wiesen und Lichtungen (Furi, Zmutt) */
  WALD_MITTE += `<path d="M170 122 Q186 118 198 121 Q190 127 172 127 Z M226 116 Q240 114 252 119 Q240 123 228 121 Z" fill="#b6c07a" opacity=".85"/>`;
  WALD_MITTE += `<path d="${pp(mitte)}" fill="${S.lg("waldmittedunst", [[0, "#c8d8e6", 0.45], [1, "#c8d8e6", 0.05]])}"/>`;
  /* linker Hang (Schatten) */
  const L = [[-2, 44], [20, 54], [38, 63], [54, 70], [76, 78], [100, 86], [122, 93], [141, 100], [158, 106], [171, 113], [184, 122], [192, 134], [195, 175], [-2, 175]];
  HANG_L = `<path d="${pp(L)}" fill="${S.lg("hangL", [[0, "#3c5240"], [0.5, "#2c4234"], [1, "#22362b"]])}"/>`;
  HANG_L += `<path d="${pp(L)}" fill="url(#${S.id("waldS")})"/>` + baeumchen(L, 120, 5, (y) => 2.4 + (y - 50) * 0.05, ["#1d3027", "#8a6a2c", "#2a3e2e"], false);
  HANG_L += `<path d="M${L.slice(0, 11).map(pt).join(" L")}" stroke="#a9bccc" stroke-width="1" fill="none" opacity=".3"/>`;
  HANG_L += `<path d="${pp(L)}" fill="${S.lg("hangLdunst", [[0, "#9db4cc", 0.35], [0.6, "#9db4cc", 0.08], [1, "#9db4cc", 0]])}"/>`;
  /* rechter Hang (Sonne) */
  const R = [[402, 20], [372, 40], [346, 56], [322, 70], [300, 82], [286, 91], [273, 100], [261, 107], [251, 114], [242, 124], [236, 136], [234, 175], [402, 175]];
  HANG_R = `<path d="${pp(R)}" fill="${S.lg("hangR", [[0, "#7f9a52"], [0.5, "#6b8a44"], [1, "#4f6e38"]])}"/>`;
  /* Wiesen (heller) zwischen den Wäldern */
  HANG_R += `<path d="M346 57 L330 66 L322 72 L340 76 L360 64 L374 50 Z M286 94 L278 101 L286 105 L300 98 L304 90 Z" fill="#b4c070" opacity=".75"/>`;
  HANG_R += `<path d="${pp(R)}" fill="url(#${S.id("waldL")})" opacity=".9"/>` + baeumchen(R, 130, 7, (y) => 2.4 + (y - 20) * 0.045, ["#2f4a2c", "#e2b44a", "#d49a2e", "#3c5a32"], true);
  HANG_R += `<path d="M${R.slice(0, 10).map(pt).join(" L")}" stroke="#f6edc8" stroke-width="1" fill="none" opacity=".4"/>`;
  HANG_R += `<path d="${pp(R)}" fill="${S.lg("hangRdunst", [[0, "#cfe0ee", 0.3], [0.5, "#cfe0ee", 0.05], [1, "#cfe0ee", 0]])}"/>`;
}

/* =====================================================================
   3-D-KÖRPER (Häuser, Stadel): Flächen, Sichtbarkeit, Licht
   ===================================================================== */
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const kreuz = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const skal = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const norm = (a) => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const mitteV = (pts) => pts.reduce((s, p) => [s[0] + p[0] / pts.length, s[1] + p[1] / pts.length, s[2] + p[2] / pts.length], [0, 0, 0]);
const AUGE = [0, 0, E];
const proj = (p) => P(p[0], p[1], p[2]);
/* Fläche (Vieleck in X, D, h) mit Außenrichtung (zeigt weg vom Körpermittelpunkt) */
function flaecheInfo(pts, zentrum) {
  let n = norm(kreuz(sub(pts[1], pts[0]), sub(pts[2], pts[0])));
  const m = mitteV(pts);
  if (skal(n, sub(m, zentrum)) < 0) n = n.map((v) => -v);
  return { pts, n, m, sicht: skal(n, sub(AUGE, m)) > 0, licht: Math.max(0, skal(n, SUN)), abstand: Math.hypot(...sub(m, AUGE)) };
}
const tönen = (farbe, licht) => licht > 0.05 ? mix(farbe, "#fff1d6", Math.min(0.28, licht * 0.32)) : mix(farbe, "#1c2840", 0.32);
/* Vieleck unterhalb einer Höhe abschneiden (für Steinsockel und Holz) */
function bisHoehe(pts, hmax, oben) {
  const out = [], innen = (p) => (oben ? p[2] >= hmax : p[2] <= hmax);
  for (let i = 0; i < pts.length; i++) {
    const a = pts[(i + pts.length - 1) % pts.length], b = pts[i];
    const schnitt = () => { const t = (hmax - a[2]) / (b[2] - a[2]); return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, hmax]; };
    if (innen(b)) { if (!innen(a)) out.push(schnitt()); out.push(b); } else if (innen(a)) out.push(schnitt());
  }
  return out;
}
const poly3 = (pts) => pz(pts.map(proj));

S.def(`<linearGradient id="${S.id("traufe")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#140a04" stop-opacity=".5"/><stop offset=".12" stop-color="#140a04" stop-opacity=".12"/><stop offset=".4" stop-color="#140a04" stop-opacity="0"/></linearGradient>`);
/* Chalet: Steinsockel (weiß), darüber Lärchenholz, Steinplattendach. first: "D" (Giebel zu uns) oder "X" (Giebel zum Fluss) */
function chalet(o) {
  const { X0, X1, D0, D1, h0, he, hr, sockel, first } = o;
  const Xm = (X0 + X1) / 2, Dm = (D0 + D1) / 2, zentrum = [Xm, Dm, (h0 + he) / 2];
  const fl = [];
  const wand = (pts, art) => fl.push(Object.assign(flaecheInfo(pts, zentrum), { art }));
  if (first === "D") {
    wand([[X0, D0, h0], [X1, D0, h0], [X1, D0, he], [Xm, D0, hr], [X0, D0, he]], "giebel");
    wand([[X0, D1, h0], [X1, D1, h0], [X1, D1, he], [Xm, D1, hr], [X0, D1, he]], "giebel");
    wand([[X0, D0, h0], [X0, D1, h0], [X0, D1, he], [X0, D0, he]], "seite");
    wand([[X1, D0, h0], [X1, D1, h0], [X1, D1, he], [X1, D0, he]], "seite");
  } else {
    wand([[X0, D0, h0], [X1, D0, h0], [X1, D0, he], [X0, D0, he]], "seite");
    wand([[X0, D1, h0], [X1, D1, h0], [X1, D1, he], [X0, D1, he]], "seite");
    wand([[X0, D0, h0], [X0, D1, h0], [X0, D1, he], [X0, Dm, hr], [X0, D0, he]], "giebel");
    wand([[X1, D0, h0], [X1, D1, h0], [X1, D1, he], [X1, Dm, hr], [X1, D0, he]], "giebel");
  }
  let g = "";
  const sicht = fl.filter((f) => f.sicht).sort((a, b) => b.abstand - a.abstand);
  for (const f of sicht) {
    g += `<path d="${poly3(f.pts)}" fill="${tönen(o.holz || "#6a4429", f.licht)}"/>`;
    /* Balkenfugen (waagrecht) im Holz */
    const s = F / f.m[1];
    let fugen = "";
    for (let h = sockel + 0.33; h < (f.art === "giebel" ? hr : he) - 0.2; h += 0.33) {
      const z = bisHoehe(f.pts, h, true), w = bisHoehe(z, h + 0.01, false);
      if (w.length >= 2) { const a = proj(w[0]), b = proj(w[w.length - 1]); const q = strecke(a, b); if (q && s > 4) fugen += `M${pt(q[0])} L${pt(q[1])}`; }
    }
    if (fugen) g += `<path d="${fugen}" stroke="#2e1d10" stroke-width="${r(Math.max(0.12, 0.02 * s))}" opacity=".45"/>`;
    /* Schatten unter dem Dachvorsprung (oben dunkler) */
    g += `<path d="${poly3(f.pts)}" fill="url(#${S.id("traufe")})"/>`;
    /* weißer Steinsockel */
    const unten = bisHoehe(f.pts, sockel, false);
    if (unten.length > 2) g += `<path d="${poly3(unten)}" fill="${tönen("#e6e1d6", f.licht)}"/>`;
    /* Fenster */
    g += fensterAuf(f, o, s);
  }
  /* Dach: Steinplatten; sichtbare Dachflächen und die Stirnkanten der Giebel */
  const ov = 0.9, t = (hr - he) / ((first === "D" ? (X1 - X0) : (D1 - D0)) / 2);
  const dachFl = first === "D"
    ? [[[X0 - ov, D0 - ov, he - ov * t], [Xm, D0 - ov, hr], [Xm, D1 + ov, hr], [X0 - ov, D1 + ov, he - ov * t]], [[X1 + ov, D0 - ov, he - ov * t], [Xm, D0 - ov, hr], [Xm, D1 + ov, hr], [X1 + ov, D1 + ov, he - ov * t]]]
    : [[[X0 - ov, D0 - ov, he - ov * t], [X0 - ov, Dm, hr], [X1 + ov, Dm, hr], [X1 + ov, D0 - ov, he - ov * t]], [[X0 - ov, D1 + ov, he - ov * t], [X0 - ov, Dm, hr], [X1 + ov, Dm, hr], [X1 + ov, D1 + ov, he - ov * t]]];
  for (const d of dachFl) {
    const f = flaecheInfo(d, [Xm, Dm, he - 3]);
    if (f.sicht) {
      g += `<path d="${poly3(d)}" fill="${tönen("#8a8986", f.licht)}"/>`;
      /* Plattenreihen */
      let reihen = "";
      for (let i = 1; i < 7; i++) { const tt = i / 7, a = d[0].map((v, j) => v + (d[1][j] - v) * tt), b = d[3].map((v, j) => v + (d[2][j] - v) * tt); const q = strecke(proj(a), proj(b)); if (q) reihen += `M${pt(q[0])} L${pt(q[1])}`; }
      g += `<path d="${reihen}" stroke="#5d5c5a" stroke-width=".35" opacity=".7"/>`;
    }
  }
  /* Giebelstirn: Dachrand als dunkles Brett mit heller Steinkante */
  const stirn = first === "D" ? [[X0 - ov, D0 - ov, he - ov * t], [Xm, D0 - ov, hr], [X1 + ov, D0 - ov, he - ov * t]] : (X0 > 0 ? [[X0 - ov, D0 - ov, he - ov * t], [X0 - ov, Dm, hr], [X0 - ov, D1 + ov, he - ov * t]] : [[X1 + ov, D0 - ov, he - ov * t], [X1 + ov, Dm, hr], [X1 + ov, D1 + ov, he - ov * t]]);
  const sw = F / D0;
  g += `<path d="M${stirn.map(proj).map(pt).join(" L")}" stroke="#3a2a1e" stroke-width="${r(Math.max(0.4, 0.3 * sw))}" fill="none" stroke-linejoin="round"/><path d="M${stirn.map(proj).map(pt).join(" L")}" stroke="#c9c7c2" stroke-width="${r(Math.max(0.2, 0.08 * sw))}" fill="none" transform="translate(0 ${r(-0.12 * sw)})"/>`;
  /* Kamin */
  if (o.kamin) { const [cx, cd] = o.kamin, a = proj([cx, cd, hr - 1]), b = proj([cx, cd, hr + 1.2]), w = Math.max(0.6, 0.6 * F / cd); g += `<rect x="${r(a[0] - w / 2)}" y="${r(b[1])}" width="${r(w)}" height="${r(a[1] - b[1])}" fill="#d8d3c8"/><rect x="${r(a[0] - w * 0.65)}" y="${r(b[1] - w * 0.2)}" width="${r(w * 1.3)}" height="${r(w * 0.3)}" fill="#6f6d6a"/>`; }
  return { g, faces: fl };
}
/* Fenster und Balkone auf einer Fläche */
const BALKONE = [];
function fensterAuf(f, o, s) {
  if (s < 2.2) return "";
  const pts = f.pts, n = f.n;
  /* Achse längs der Wand */
  const a0 = pts[0], a1 = pts[1], lang = Math.hypot(a1[0] - a0[0], a1[1] - a0[1]);
  const u = [(a1[0] - a0[0]) / lang, (a1[1] - a0[1]) / lang, 0];
  const Q = (uu, h) => proj([a0[0] + u[0] * uu, a0[1] + u[1] * uu, h]);
  const Qv = (uu, h, aus) => proj([a0[0] + u[0] * uu + n[0] * aus, a0[1] + u[1] * uu + n[1] * aus, h]);
  let gl = "", rah = "", lad = "";
  const geschosse = [];
  for (let h = o.h0 + 1.2; h < o.he - 1.6; h += 2.8) geschosse.push(h);
  const nf = Math.max(1, Math.floor(lang / 3.4));
  for (const h of geschosse) for (let i = 0; i < nf; i++) {
    const holz = h > o.sockel - 0.2, uc = lang * (i + 0.5) / nf, fw = holz ? 0.45 : 0.6, fh = holz ? 1.15 : 1.4;
    const q = [Q(uc - fw, h + fh), Q(uc + fw, h + fh), Q(uc + fw, h), Q(uc - fw, h)];
    gl += "M" + q.map(pt).join(" L") + " Z";
    const m1 = Q(uc, h + fh), m2 = Q(uc, h), l1 = Q(uc - fw, h + fh / 2), l2 = Q(uc + fw, h + fh / 2);
    rah += `M${pt(m1)} L${pt(m2)} M${pt(l1)} L${pt(l2)}`;
    /* Fensterläden (grün-weiß) links und rechts im Holzteil */
    if (holz) for (const sg of [-1, 1]) lad += "M" + [Q(uc + sg * fw, h + fh), Q(uc + sg * (fw + 0.42), h + fh), Q(uc + sg * (fw + 0.42), h), Q(uc + sg * fw, h)].map(pt).join(" L") + " Z";
  }
  let g = `<path d="${gl}" fill="#2a3440" stroke="#f2eee6" stroke-width="${r(Math.max(0.2, 0.08 * s))}"/><path d="${rah}" stroke="#f2eee6" stroke-width="${r(Math.max(0.12, 0.05 * s))}"/>`;
  if (lad) g += `<path d="${lad}" fill="${f.licht > 0.05 ? "#4f7a46" : "#35553a"}" stroke="#e8e2d6" stroke-width="${r(Math.max(0.1, 0.03 * s))}"/>`;
  /* Balkone vor der Giebelseite: Platte, Brüstung aus Latten, Geranien */
  if (f.art === "giebel" && o.balkon) {
    for (const h of geschosse.filter((h) => h > o.sockel - 0.5)) {
      const hb2 = h - 0.25, aus = 1.1, u0 = 0.4, u1 = lang - 0.4;
      const br = [Qv(u0, hb2 + 1.05, aus), Qv(u1, hb2 + 1.05, aus), Qv(u1, hb2, aus), Qv(u0, hb2, aus)];
      const unterseite = [Q(u0, hb2), Q(u1, hb2), Qv(u1, hb2, aus), Qv(u0, hb2, aus)];
      let latten = "";
      const nl = Math.max(4, Math.round((u1 - u0) / 0.25));
      if (s > 5) for (let i = 1; i < nl; i++) { const uu = u0 + (u1 - u0) * i / nl; latten += `M${pt(Qv(uu, hb2 + 1.0, aus))} L${pt(Qv(uu, hb2 + 0.05, aus))}`; }
      let blumen = "", blaetter = "";
      const nb = Math.max(4, Math.round((u1 - u0) / 0.3));
      const z = zufall(Math.round(h * 100 + o.D0));
      for (let i = 0; i < nb; i++) { const uu = u0 + (u1 - u0) * (i + 0.5) / nb, [x, y] = Qv(uu, hb2 + 1.12, aus + 0.08), rr = Math.max(0.35, 0.16 * s); blaetter += `<circle cx="${r(x)}" cy="${r(y + rr * 0.3)}" r="${r(rr * 1.1)}"/>`; blumen += `<circle cx="${r(x + (z() - 0.5) * rr)}" cy="${r(y - rr * 0.4)}" r="${r(rr * 0.75)}"/>`; }
      const bal = `<path d="${pz(unterseite)}" fill="#2a1a10"/><path d="${pz(br)}" fill="${tönen("#7a5030", f.licht + 0.1)}"/><path d="${latten}" stroke="#3a2414" stroke-width="${r(Math.max(0.12, 0.035 * s))}"/><g fill="#3f6a2c">${blaetter}</g><g fill="#d8202e">${blumen}</g>`;
      g += bal;
      BALKONE.push({ o, h: hb2, s, Qv, u0, u1, aus });
    }
  }
  return g;
}

/* Stadel: Steinsockel, Stützen mit runden Steinplatten, Blockbau, Steinplattendach (Giebel zu uns) */
function stadel(o) {
  const { X0, X1, D0, D1, h0 } = o, Xm = (X0 + X1) / 2, Dm = (D0 + D1) / 2;
  const hs = h0 + 1.5, hp = hs + 0.55, hk = hp + 0.12, he = hk + 2.8, hr = he + 1.8;
  let g = "";
  const zentrum = [Xm, Dm, hs / 2];
  /* Sockel (Bruchstein) */
  const sockel = [[[X0, D0, h0], [X1, D0, h0], [X1, D0, hs], [X0, D0, hs]], [[X0 < 0 ? X1 : X0, D0, h0], [X0 < 0 ? X1 : X0, D1, h0], [X0 < 0 ? X1 : X0, D1, hs], [X0 < 0 ? X1 : X0, D0, hs]]];
  for (const p of sockel) { const f = flaecheInfo(p, zentrum); if (f.sicht) g += `<path d="${poly3(p)}" fill="${tönen("#9a958c", f.licht)}"/>`; }
  /* Stützen und Steinplatten: vorne drei, an der Flussseite drei */
  const s = F / D0;
  let stuetzen = "", platten = "";
  const posten = [];
  for (const xx of [X0 + 0.35, Xm, X1 - 0.35]) posten.push([xx, D0 + 0.35]);
  const xs = X0 < 0 ? X1 - 0.35 : X0 + 0.35;
  for (const dd of [Dm, D1 - 0.35]) posten.push([xs, dd]);
  posten.sort((a, b) => b[1] - a[1]);
  for (const [xx, dd] of posten) {
    const a = proj([xx, dd, hs]), b = proj([xx, dd, hp]), ss = F / dd, w = 0.24 * ss;
    stuetzen += `<rect x="${r(a[0] - w / 2)}" y="${r(b[1])}" width="${r(w)}" height="${r(a[1] - b[1])}" fill="#5a3a22"/>`;
    platten += `<ellipse cx="${r(b[0])}" cy="${r(b[1])}" rx="${r(0.42 * ss)}" ry="${r(0.11 * ss)}" fill="#8e8a82"/><ellipse cx="${r(b[0])}" cy="${r(b[1] - 0.04 * ss)}" rx="${r(0.4 * ss)}" ry="${r(0.07 * ss)}" fill="#b9b4aa"/>`;
  }
  g += stuetzen + platten;
  /* Blockbau (Lärche, fast schwarz gebrannt) */
  const k0 = [[X0 - 0.15, D0 - 0.15, hk], [X1 + 0.15, D0 - 0.15, hk], [X1 + 0.15, D0 - 0.15, he], [Xm, D0 - 0.15, hr], [X0 - 0.15, D0 - 0.15, he]];
  const ks = X0 < 0 ? X1 + 0.15 : X0 - 0.15;
  const k1 = [[ks, D0 - 0.15, hk], [ks, D1 + 0.15, hk], [ks, D1 + 0.15, he], [ks, D0 - 0.15, he]];
  for (const p of [k1, k0]) {
    const f = flaecheInfo(p, [Xm, Dm, (hk + he) / 2]);
    if (!f.sicht) continue;
    g += `<path d="${poly3(p)}" fill="${tönen("#4a2e1a", f.licht)}"/>`;
    let balken = "";
    for (let h = hk + 0.28; h < he + 1.7; h += 0.28) { const z = bisHoehe(p, h, true), w = bisHoehe(z, h + 0.01, false); if (w.length >= 2) { const q = strecke(proj(w[0]), proj(w[w.length - 1])); if (q) balken += `M${pt(q[0])} L${pt(q[1])}`; } }
    g += `<path d="${balken}" stroke="#1c1008" stroke-width="${r(Math.max(0.15, 0.03 * s))}" opacity=".6"/>`;
    /* Lichtkante der Balken auf der Sonnenseite */
    if (f.licht > 0.1) g += `<path d="${balken}" stroke="#c8925a" stroke-width="${r(Math.max(0.08, 0.012 * s))}" opacity=".5" transform="translate(0 ${r(-0.03 * s)})"/>`;
  }
  /* kleine Tür vorne */
  g += `<path d="${poly3([[Xm - 0.45, D0 - 0.2, hk + 0.4], [Xm + 0.45, D0 - 0.2, hk + 0.4], [Xm + 0.45, D0 - 0.2, hk + 1.9], [Xm - 0.45, D0 - 0.2, hk + 1.9]])}" fill="#2a1a0e"/>`;
  /* Dach: Steinplatten, Stirnseite */
  const ov = 0.5, t = (hr - he) / ((X1 - X0) / 2);
  const dachS = X0 < 0 ? [[X1 + ov, D0 - ov, he - ov * t], [Xm, D0 - ov, hr], [Xm, D1 + ov, hr], [X1 + ov, D1 + ov, he - ov * t]] : [[X0 - ov, D0 - ov, he - ov * t], [Xm, D0 - ov, hr], [Xm, D1 + ov, hr], [X0 - ov, D1 + ov, he - ov * t]];
  const fd = flaecheInfo(dachS, [Xm, Dm, he - 2]);
  if (fd.sicht) g += `<path d="${poly3(dachS)}" fill="${tönen("#8d8b86", fd.licht)}"/>`;
  const st = [[X0 - ov, D0 - ov, he - ov * t], [Xm, D0 - ov, hr], [X1 + ov, D0 - ov, he - ov * t]];
  g += `<path d="M${st.map(proj).map(pt).join(" L")}" stroke="#77756f" stroke-width="${r(0.22 * s)}" fill="none" stroke-linejoin="round"/>`;
  return { g, posten, hp, s };
}

/* Lärche: schlanker Kegel aus hängenden Zweigbüscheln (Etagen), lichte Krone, Herbstgold; Sonne von links */
function laerche(X, D, h, seed, gold) {
  const z = zufall(seed), [bx, by] = P(X, D, hb(D)), s = F / D, H = h * s, W = h * 0.19 * s;
  let g = `<path d="M${r(bx - 0.16 * s)} ${r(by)} L${r(bx - 0.04 * s)} ${r(by - H)} L${r(bx + 0.04 * s)} ${r(by - H)} L${r(bx + 0.16 * s)} ${r(by)} Z" fill="${S.lg("stammL", [[0, "#8a6a4a"], [0.4, "#5a3e28"], [1, "#2e2016"]], 0, 0, 1, 0)}"/>`;
  let dunkel = "", mittel = "", hell = "", zweige = "";
  const etagen = Math.max(10, Math.round(h * 1.3));
  for (let i = 0; i < etagen; i++) {
    const t = i / (etagen - 1), y = by - H * (0.14 + t * 0.84) + (z() - 0.5) * H * 0.02, w = W * Math.pow(1 - t, 0.85) * (0.6 + z() * 0.65) + 0.1 * s, hh = H * 0.05 * (1.2 - t * 0.5);
    for (const sg of [-1, 1]) {
      if (z() < 0.14 && t < 0.85) continue;
      const ww = w * (0.7 + z() * 0.45), xe = bx + sg * ww, ye = y + hh * (1.0 + z() * 1.3);
      const tuft = `M${r(bx)} ${r(y - hh * 0.4)} Q${r(bx + sg * ww * 0.55)} ${r(y - hh * 0.6)} ${r(xe)} ${r(ye)} Q${r(bx + sg * ww * 0.7)} ${r(ye + hh * 0.7)} ${r(bx + sg * ww * 0.3)} ${r(y + hh * 0.75)} Q${r(bx + sg * ww * 0.1)} ${r(y + hh * 0.3)} ${r(bx)} ${r(y + hh * 0.2)} Z`;
      (sg < 0 ? hell : dunkel) !== null && (sg < 0 ? (mittel += tuft) : (dunkel += tuft));
      if (sg < 0) hell += `M${r(bx + sg * ww * 0.15)} ${r(y - hh * 0.35)} Q${r(bx + sg * ww * 0.55)} ${r(y - hh * 0.5)} ${r(xe)} ${r(ye)} Q${r(bx + sg * ww * 0.6)} ${r(y + hh * 0.05)} ${r(bx + sg * ww * 0.15)} ${r(y + hh * 0.05)} Z`;
      zweige += `M${r(bx)} ${r(y)} Q${r(bx + sg * ww * 0.5)} ${r(y - hh * 0.3)} ${r(xe - sg * ww * 0.15)} ${r(ye - hh * 0.2)}`;
    }
  }
  const f = gold ? ["#9a6a1e", "#d49a2c", "#f6cf5a"] : ["#4a6230", "#6f8a40", "#a8bf62"];
  g += `<path d="${zweige}" stroke="#4a3424" stroke-width="${r(Math.max(0.12, 0.035 * s))}" fill="none"/><path d="${dunkel}" fill="${f[0]}" opacity=".95"/><path d="${mittel}" fill="${f[1]}" opacity=".95"/><path d="${hell}" fill="${f[2]}" opacity=".8"/>`;
  return { g, bx, by, s, H };
}

/* =====================================================================
   TEILE — hinten zuerst
   ===================================================================== */
/* 1 — DAS MATTERHORN (mit Lupe) */
{
  const unter = [
    { id: "gipfel", de: "der Gipfel", syl: "GIP-fel", it: "la vetta", itSyl: "VET-ta", en: "summit", x: GIPFEL[0], y: GIPFEL[1] + 4, kunst: flaeche(-4.5, -5, 9, 6, 0.6),
      tipp: "Der Gipfel des Matterhorns ist 4478 Meter hoch." },
    { id: "grat", de: "der Grat", syl: "GRAT", it: "la cresta", itSyl: "CRE-sta", en: "ridge", x: 221.6, y: 74, kunst: `<path class="bw-flaeche" d="M-2.5 -26 L-0.4 -21 L1.6 -19.5 L1.6 -10 L0 0 L-1.5 8" stroke="rgba(255,255,255,0.001)" stroke-width="3.2" fill="none"/>`,
      tipp: "Über den Hörnligrat stiegen 1865 die ersten Menschen auf das Matterhorn." },
    { id: "nordwand", de: "die Nordwand", syl: "NORD-wand", it: "la parete nord", itSyl: "pa-RE-te NORD", en: "north face", x: 240, y: 80, kunst: flaeche(-12, -14, 18, 14, 0.6),
      tipp: "Die Nordwand liegt fast immer im Schatten. Sie ist sehr steil und vereist." },
    { id: "huette", de: "die Hütte", syl: "HÜT-te", it: "il rifugio", itSyl: "ri-FU-gio", en: "mountain hut", x: HUETTE[0], y: HUETTE[1] + 1, kunst: flaeche(-3.4, -4.4, 6.8, 5.4, 0.5),
      tipp: "In der Hörnlihütte auf 3260 Metern schlafen die Bergsteiger vor dem Aufstieg." },
  ];
  for (const u of unter) { const q = T(u.x, u.y); u.x = q[0]; u.y = q[1]; u.kunst = `<g transform="scale(1.368)">${u.kunst}</g>`; }
  const g0 = T(GIPFEL[0], 100), z0 = T(166, 36);
  S.teil({ id: "matterhorn", de: "das Matterhorn", syl: "MAT-ter-horn", it: "il Cervino", itSyl: "cer-VI-no", en: "Matterhorn", anker: g0, kunst: fern(BERG),
    tipp: "Das Matterhorn ist der bekannteste Berg der Schweiz. Es steht an der Grenze zu Italien.",
    zoom: { x: r(z0[0]), y: r(z0[1]), w: r(105 * KF), h: r(70 * KF) }, unter });
}
/* 2 — DIE WOLKE (Fahnenwolke) */
S.teil({ oben: true, id: "wolke", de: "die Wolke", syl: "WOL-ke", it: "la nuvola", itSyl: "NU-vo-la", en: "cloud", anker: T(196, 47), kunst: fern(FAHNE),
  tipp: "Der Wind bildet am Gipfel oft eine Wolke wie eine Fahne: die Fahnenwolke." });
/* 3 — DER GLETSCHER (am Fuß, mit den mittleren Bergen) */
S.teil({ id: "gletscher", de: "der Gletscher", syl: "GLET-scher", it: "il ghiacciaio", itSyl: "ghiac-CIA-io", en: "glacier", anker: T(250, 100), kunst: fern(MITTE),
  tipp: "Gletscher sind Flüsse aus Eis. Sie schmelzen langsam, weil es wärmer wird." });

/* Kulisse für Wald (fern) und Hänge: gehören zur Lärche/zum Wald? — die Hänge sind Kulisse über den Teilen davor nicht nötig:
   sie liegen vor dem Matterhorn und werden deshalb als Teil „der Wald“ gezeichnet */
S.teil({ id: "wald", de: "der Wald", syl: "WALD", it: "il bosco", itSyl: "BO-sco", en: "forest", anker: T(330, 120), kunst: fern(WALD_MITTE + HANG_L + HANG_R),
  tipp: "Im Herbst werden die Lärchen golden. Sie verlieren als einzige Nadelbäume im Winter ihre Nadeln." });

/* =====================================================================
   DAS DORF — Häuser von hinten nach vorn
   ===================================================================== */
const HAEUSER = [
  /* fern (Talboden 120–300 m): kleine Chalets */
  ...[[-24, 260, 9], [-14, 240, 8], [12, 250, 9], [22, 230, 8], [-20, 200, 10], [16, 190, 9], [30, 170, 11], [-32, 165, 10], [-16, 150, 10], [13, 140, 9], [24, 130, 10], [-26, 125, 12]].map(([X, D, h], i) => ({ X0: X < 0 ? X - 9 : X, X1: X < 0 ? X : X + 9, D0: D, D1: D + 10, he: h, first: i % 2 ? "X" : "D", fern: true })),
  { X0: -26, X1: -13, D0: 96, D1: 108, he: 13, first: "D", balkon: true },
  { X0: 13, X1: 24, D0: 104, D1: 114, he: 11, first: "X" },
  { X0: -24, X1: -12.5, D0: 74, D1: 86, he: 12.5, first: "D", balkon: true, kamin: [-20, 80] },
  { X0: 14, X1: 26, D0: 84, D1: 96, he: 12, first: "D", balkon: true },
  { X0: -24, X1: -13.5, D0: 54, D1: 66, he: 13.5, first: "D", balkon: true, kamin: [-20, 60] },
  { X0: -25, X1: -12.5, D0: 34, D1: 46, he: 13.6, first: "D", balkon: true, kamin: [-21, 40], hotel: true },
  { X0: 12.5, X1: 23, D0: 38, D1: 49, he: 11.2, first: "D", balkon: true, chaletWort: true },
];
let DORF_FERN = "", CHALET_WORT = null, DORF_NAH = [];
for (const h of HAEUSER.sort((a, b) => b.D0 - a.D0)) {
  const h0 = hb(h.D0), he = h0 + h.he, hr = he + (h.first === "D" ? (h.X1 - h.X0) * 0.3 : (h.D1 - h.D0) * 0.3);
  const c = chalet({ ...h, h0, he, hr, sockel: h0 + (h.hotel ? 5.6 : 3.0), holz: h.hotel ? "#5e3c24" : ["#6a4429", "#5a3820", "#74492a"][Math.round(h.D0) % 3] });
  if (h.fern) DORF_FERN += c.g;
  else if (h.chaletWort) CHALET_WORT = { c, h };
  else DORF_NAH.push({ D: h.D0, g: c.g });
}

/* Talboden, Ufer und Fluss (Kulisse unter dem Dorf? — nein: der Fluss ist ein Wort) */
{
  /* Talboden zwischen den Hängen: Wiesen und Wege, im Dunst */
  let k = `<path d="M150 150 L172 140 L200 136 L230 137 L256 142 L270 150 L270 175 L150 175 Z" fill="${S.lg("talboden", [[0, "#8a9a62"], [1, "#6f8450"]])}"/>`;
  S.hinten(k);
}
/* 4 — DAS DORF: Talboden mit Wiesen und Wegen, ferne und nahe Häuser (hinten zuerst) */
let BODEN = "";
{
  BODEN += `<path d="${pz([P(-90, 600, hb(600)), P(90, 600, hb(600)), P(90, 2500, 40), P(-90, 2500, 40)])}" fill="#8f9e64"/>`;
  for (const sg of [-1, 1]) {
    const a = [], b = [];
    for (const D of [8, 12, 18, 24, 30, 40, 55, 75, 100, 130, 170, 230, 300, 420, 600, 900]) { a.push(P(sg * UFER, D, hb(D))); b.push(P(sg * 90, D, hb(D))); }
    BODEN += `<path d="${pz([...a, ...b.slice().reverse()])}" fill="${sg < 0 ? S.lg("bodenL", [[0, "#7f8a5c"], [1, "#6c7a4c"]]) : S.lg("bodenR", [[0, "#a7b06a"], [1, "#93a05a"]])}"/>`;
    /* Uferweg (Kies) an der Mauer */
    const c = [], d = [];
    for (const D of [8, 12, 18, 24, 30, 40, 55, 75, 100, 130, 170, 230]) { c.push(P(sg * UFER, D, hb(D))); d.push(P(sg * (UFER + 4.2), D, hb(D))); }
    BODEN += `<path d="${pz([...c, ...d.slice().reverse()])}" fill="${sg < 0 ? "#9a9282" : "#cfc4ae"}"/>`;
  }
}

/* 5 — DER FLUSS (Matter Vispa) mit Ufermauern */
{
  let k = "";
  const Ds = [9, 11, 14, 18, 23, 30, 38, 48, 60, 75, 95, 120, 150, 200, 260, 340, 450, 600];
  const Lm = [], Rm = [], Lw = [], Rw = [];
  for (const D of Ds) { Lm.push(P(-UFER, D, hb(D))); Rm.push(P(UFER, D, hb(D))); Lw.push(P(-UFER + 0.9, D, hw(D))); Rw.push(P(UFER - 0.9, D, hw(D))); }
  /* Mauern (Bruchstein): die linke schaut nach rechts (Schatten), die rechte nach links (Sonne) */
  k += `<path d="${pz([...Lm, ...Lw.slice().reverse()])}" fill="${S.lg("mauerL", [[0, "#78726a"], [1, "#5a554f"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="${pz([...Rm, ...Rw.slice().reverse()])}" fill="${S.lg("mauerR", [[0, "#d6cfc2"], [1, "#b2aa9c"]], 0, 0, 1, 0)}"/>`;
  /* Steinlagen und Stoßfugen (nur nah) */
  let lagen = "", stoss = "";
  const z = zufall(31);
  for (const sg of [-1, 1]) for (let f = 0.12; f < 1; f += 0.11) {
    const pts = [];
    for (const D of [9, 12, 16, 22, 30, 40, 55, 80, 120]) { const hh = hw(D) + f * 4.2, X = sg * (UFER - 0.9 * (1 - f)); pts.push(P(X, D, hh + (z() - 0.5) * 0.06)); }
    const q = zuschnitt(pts.concat(pts.slice().reverse()));
    lagen += "M" + pts.filter((p) => p[1] < 262 && p[1] > 0).map(pt).join(" L");
    for (let D = 9.5 + z(); D < 45; D += 0.5 + z() * 0.7) { const hh = hw(D) + f * 4.2, X = sg * (UFER - 0.9 * (1 - f)), a2 = P(X, D, hh), b2 = P(X, D, hh + 0.42); if (a2[1] < 262) stoss += `M${pt(a2)} L${pt(b2)}`; }
  }
  k += `<path d="${lagen}" stroke="#3a3632" stroke-width=".4" fill="none" opacity=".45"/><path d="${stoss}" stroke="#3a3632" stroke-width=".35" opacity=".4"/>`;
  k += `<path d="M${Lm.map(pt).join(" L")} M${Rm.map(pt).join(" L")}" stroke="#e6e1d8" stroke-width="1.1" fill="none"/>`;
  /* Wasser: milchig grün-grau, hinten hell (Himmel), vorn kräftiger */
  const wasser = pz([...Lw, ...Rw.slice().reverse()]);
  k += `<path d="${wasser}" fill="${S.lg("vispa", [[0, "#cfe0dc"], [0.35, "#a9c7c0"], [0.7, "#80aaa2"], [1, "#5f8f88"]], 0, 0, 0, 1, ` gradientUnits="userSpaceOnUse" x1="0" y1="${HOR}" x2="0" y2="262"`)}"/>`;
  /* Schatten der linken Mauer auf dem Wasser (Sonne von links) */
  const schattenW = [];
  for (const D of Ds) schattenW.push(P(-UFER + 0.9 + 1.6, D, hw(D)));
  k += `<path d="${pz([...Lw, ...schattenW.slice().reverse()])}" fill="#2a4048" opacity=".3"/>`;
  /* Strömung: lange helle und dunkle Streifen in Fließrichtung (zu uns), kurze Querwellen */
  let hellS = "", dunkelS = "", quer = "";
  for (let i = 0; i < 110; i++) {
    const D = 10 + Math.pow(z(), 1.7) * 160, X = (z() * 2 - 1) * (UFER - 1.3), L = 1.5 + z() * 4;
    const a2 = P(X, D, hw(D)), b2 = P(X + (z() - 0.5) * 0.4, Math.max(9, D - L), hw(D - L));
    const d = `M${pt(a2)} Q${r((a2[0] + b2[0]) / 2 + (z() - 0.5) * 2)} ${r((a2[1] + b2[1]) / 2)} ${pt(b2)}`;
    (z() < 0.68 ? (hellS += d) : (dunkelS += d));
  }
  for (let i = 0; i < 40; i++) { const D = 10 + Math.pow(z(), 1.5) * 120, X = (z() * 2 - 1) * (UFER - 1.4), [x, y] = P(X, D, hw(D)), L = (0.6 + z() * 1.2) * F / D; quer += `M${r(x - L / 2)} ${r(y)} Q${r(x)} ${r(y - 0.2 * F / D)} ${r(x + L / 2)} ${r(y)}`; }
  /* Steine mit Schaumkragen oben (stromauf) und hellem Kielwasser nach unten */
  let steine = "", schaum = "", kiel = "";
  for (let i = 0; i < 60; i++) {
    const D = 10 + Math.pow(z(), 1.4) * 90, X = (z() * 2 - 1) * (UFER - 1.5), [x, y] = P(X, D, hw(D)), s2 = F / D, rr = (0.12 + z() * 0.22) * s2, a = 0.6 + z() * 0.5;
    steine += `<path d="M${r(x - rr)} ${r(y + rr * 0.1)} Q${r(x - rr * 0.9)} ${r(y - rr * 0.5 * a)} ${r(x - rr * 0.1)} ${r(y - rr * 0.55 * a)} Q${r(x + rr * 0.8)} ${r(y - rr * 0.45 * a)} ${r(x + rr)} ${r(y + rr * 0.05)} Q${r(x)} ${r(y + rr * 0.25)} ${r(x - rr)} ${r(y + rr * 0.1)} Z"/>`;
    schaum += `M${r(x - rr * 1.5)} ${r(y - rr * 0.05)} Q${r(x - rr * 0.6)} ${r(y - rr * 0.9)} ${r(x + rr * 0.3)} ${r(y - rr * 0.7)} Q${r(x + rr * 1.4)} ${r(y - rr * 0.6)} ${r(x + rr * 1.6)} ${r(y + rr * 0.05)} Q${r(x)} ${r(y - rr * 0.35)} ${r(x - rr * 1.5)} ${r(y - rr * 0.05)} Z`;
    kiel += `M${r(x - rr * 1.1)} ${r(y + rr * 0.3)} Q${r(x)} ${r(y + rr * 0.9)} ${r(x + rr * 1.1)} ${r(y + rr * 0.3)}`;
  }
  k += `<g filter="url(#${S.id("wasser")})"><path d="${dunkelS}" stroke="#4f7f78" stroke-width=".7" fill="none" opacity=".5"/><path d="${hellS}" stroke="#f2f8f6" stroke-width=".9" fill="none" opacity=".7"/><path d="${quer}" stroke="#f4f9f7" stroke-width=".6" fill="none" opacity=".6"/></g>`;
  k += `<path d="${schaum}" fill="#f6faf8" opacity=".85" filter="url(#${S.id("weich")})"/><g fill="#6a6e6a">${steine}</g><path d="${kiel}" stroke="#f0f6f4" stroke-width=".5" fill="none" opacity=".6"/>`;
  S.teil({ id: "fluss", de: "der Fluss", syl: "FLUSS", it: "il fiume", itSyl: "FIU-me", en: "river", anker: [200, 240], kunst: k,
    tipp: "Die Matter Vispa kommt aus den Gletschern. Darum ist ihr Wasser milchig und kalt." });
}

/* 7 — die Häuser im Dorf (nah), Stadel und Lärchen */
const STADEL = [{ X0: 10.4, X1: 14.2, D0: 60, D1: 64.5 }, { X0: 11, X1: 14.6, D0: 70, D1: 74 }];
const LAERCHEN = [[16.5, 56, 17, 61, true], [9.8, 77, 15, 62, true], [17.5, 66, 13, 63, false], [-9.4, 69, 16, 64, true], [-9.6, 50, 18, 65, false], [10.4, 54, 14, 66, true]];
const STADEL_DATA = [];
{
  const items = [...DORF_NAH];
  for (const s of STADEL) { const st = stadel({ ...s, h0: hb(s.D0) }); STADEL_DATA.push(st); items.push({ D: s.D0, g: st.g, stadel: STADEL_DATA.length - 1 }); }
  items.sort((a, b) => b.D - a.D);
  /* die nahen Häuser gehören zum Dorf (Wort), die Stadel sind ein eigenes Wort */
  let haus = "";
  for (const it of items) if (it.stadel === undefined) haus += it.g;
  S.teil({ id: "dorf", de: "das Dorf", syl: "DORF", it: "il villaggio", itSyl: "vil-LAG-gio", en: "village", anker: [70, 150], kunst: BODEN + DORF_FERN + haus,
    tipp: "Zermatt ist autofrei: Hier fahren nur kleine Elektroautos." });
  /* der Stadel (Lupe: Steinplatte und Stütze) */
  const sd = STADEL_DATA[0], sObj = STADEL[0];
  const [sx, sy] = P((sObj.X0 + sObj.X1) / 2, sObj.D0, hb(sObj.D0));
  const pl = sd.posten.find((p) => Math.abs(p[0] - (sObj.X0 + sObj.X1) / 2) < 0.1) || sd.posten[0];
  const [plx, ply] = P(pl[0], pl[1], sd.hp), ps = F / pl[1];
  S.teil({ id: "stadel", de: "der Stadel", syl: "STA-del", it: "il granaio", itSyl: "gra-NA-io", en: "granary", anker: [sx, sy], kunst: STADEL_DATA.map((d) => d.g).join(""),
    tipp: "Im Stadel lagerten die Bauern früher Getreide und Heu.",
    zoom: { x: r(sx - 14), y: r(sy - 22), w: 33, h: 22 },
    unter: [
      { id: "steinplatte", de: "die Steinplatte", syl: "STEIN-plat-te", it: "la lastra di pietra", itSyl: "LA-stra di PIE-tra", en: "stone slab", x: plx, y: ply + 0.1 * ps, kunst: flaeche(-0.5 * ps, -0.3 * ps, 1.0 * ps, 0.45 * ps, 0.3),
        tipp: "Die runden Steinplatten halten die Mäuse ab: Sie können nicht um die Platte herumklettern." },
      { id: "stuetze", de: "die Stütze", syl: "STÜT-ze", it: "il pilastrino", itSyl: "pi-la-STRI-no", en: "post", x: plx, y: ply + 0.6 * ps, kunst: flaeche(-0.22 * ps, -0.45 * ps, 0.44 * ps, 0.6 * ps, 0.2) },
    ] });
}

/* 8 — DIE LÄRCHEN */
{
  let k = "";
  const L = LAERCHEN.map(([X, D, h, seed, gold]) => ({ D, ...laerche(X, D, h, seed, gold) })).sort((a, b) => b.D - a.D);
  for (const l of L) k += l.g;
  const ref = L.find((l) => l.bx > 300) || L[0];
  S.teil({ id: "laerche", de: "die Lärche", syl: "LÄR-che", it: "il larice", itSyl: "LA-ri-ce", en: "larch", anker: [ref.bx, ref.by], kunst: k,
    tipp: "Die Lärche ist ein Nadelbaum. Im Herbst färben sich ihre Nadeln gelb." });
}

/* 9 — DAS CHALET (rechts, mit Balkonen und Geranien — Lupe) */
{
  const { c, h } = CHALET_WORT;
  const bal = BALKONE.filter((b) => b.o === h || b.o.D0 === h.D0);
  const unter = [];
  const [cx, cy] = P((h.X0 + h.X1) / 2, h.D0, hb(h.D0));
  if (bal.length) {
    const b = bal[Math.min(1, bal.length - 1)], um = (b.u0 + b.u1) / 2;
    const [bx, by] = b.Qv(um, b.h, b.aus), [bx2] = b.Qv(b.u1, b.h, b.aus), [bx1] = b.Qv(b.u0, b.h, b.aus), [, byo] = b.Qv(um, b.h + 1.05, b.aus);
    unter.push({ id: "balkon", de: "der Balkon", syl: "bal-KON", it: "il balcone", itSyl: "bal-CO-ne", en: "balcony", x: bx, y: by, kunst: flaeche(Math.min(bx1, bx2) - bx, byo - by, Math.abs(bx2 - bx1), by - byo, 0.4),
      tipp: "Fast jedes Chalet hat Holzbalkone voller Blumen." });
    const b2 = bal[0], [gx, gy] = b2.Qv(b2.u0 + (b2.u1 - b2.u0) * 0.3, b2.h + 1.12, b2.aus + 0.08), gs = b2.s;
    unter.push({ id: "geranie", de: "die Geranie", syl: "ge-RA-nie", it: "il geranio", itSyl: "ge-RA-nio", en: "geranium", x: gx, y: gy + 0.3 * gs, kunst: flaeche(-0.8 * gs, -0.6 * gs, 1.6 * gs, 0.8 * gs, 0.3),
      tipp: "Rote Geranien blühen den ganzen Sommer an den Balkonen." });
  }
  const zx0 = P(h.X0, h.D0, 0)[0], zx1 = P(h.X1, h.D1, 0)[0];
  S.teil({ id: "chalet", de: "das Chalet", syl: "scha-LEE", it: "lo chalet", itSyl: "scia-LÈ", en: "chalet", anker: [cx, cy], kunst: c.g,
    tipp: "Ein Chalet ist ein Holzhaus in den Bergen. Unten ist es aus Stein.",
    zoom: { x: r(Math.min(zx0, zx1) - 4), y: r(P(0, h.D0, hb(h.D0) + h.he + 3)[1]), w: 48, h: 32 }, unter });
}

/* 10 — DAS ELEKTROTAXI auf dem linken Uferweg */
{
  const X = -9.2, D = 44, [x, y] = P(X, D, hb(D)), s = F / D;
  const q = (a, b) => `${r(x + a * s)} ${r(y + b * s)}`;
  let k = `<path d="M${q(-0.75, 0.02)} L${q(0.75, 0.02)} L${q(2.4, 0.32)} L${q(0.9, 0.32)} Z" fill="#1c2638" opacity=".35" filter="url(#${S.id("weich")})"/>`;
  /* Kastenwagen von vorn: weiß, große Scheibe, Schild TAXI */
  k += `<path d="M${q(-0.7, -0.25)} L${q(-0.7, -1.75)} Q${q(-0.68, -1.95)} ${q(-0.5, -1.97)} L${q(0.5, -1.97)} Q${q(0.68, -1.95)} ${q(0.7, -1.75)} L${q(0.7, -0.25)} Z" fill="${S.lg("taxi", [[0, "#ffffff"], [0.6, "#e8ecef"], [1, "#b9c2c9"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${q(-0.6, -1.0)} L${q(-0.58, -1.75)} L${q(0.58, -1.75)} L${q(0.6, -1.0)} Z" fill="#33485c"/><path d="M${q(-0.55, -1.05)} L${q(-0.3, -1.7)} L${q(-0.12, -1.7)} L${q(-0.38, -1.05)} Z" fill="#fff" opacity=".35"/>`;
  k += `<rect x="${r(x - 0.24 * s)}" y="${r(y - 2.12 * s)}" width="${r(0.48 * s)}" height="${r(0.16 * s)}" rx="${r(0.04 * s)}" fill="#ffd23c"/><text x="${r(x)}" y="${r(y - 2.0 * s)}" font-size="${r(0.12 * s)}" text-anchor="middle" fill="#1a1a1a" font-family="Arial" font-weight="bold">TAXI</text>`;
  k += `<rect x="${r(x - 0.62 * s)}" y="${r(y - 0.62 * s)}" width="${r(0.2 * s)}" height="${r(0.1 * s)}" rx="${r(0.03 * s)}" fill="#fff7d8"/><rect x="${r(x + 0.42 * s)}" y="${r(y - 0.62 * s)}" width="${r(0.2 * s)}" height="${r(0.1 * s)}" rx="${r(0.03 * s)}" fill="#fff7d8"/>`;
  k += `<rect x="${r(x - 0.3 * s)}" y="${r(y - 0.55 * s)}" width="${r(0.6 * s)}" height="${r(0.14 * s)}" fill="#c9d0d6"/><text x="${r(x)}" y="${r(y - 0.44 * s)}" font-size="${r(0.1 * s)}" text-anchor="middle" fill="#2a2a2a" font-family="Arial">ZERMATT</text>`;
  k += `<rect x="${r(x - 0.66 * s)}" y="${r(y - 0.3 * s)}" width="${r(0.22 * s)}" height="${r(0.3 * s)}" rx="${r(0.05 * s)}" fill="#1b1b1d"/><rect x="${r(x + 0.44 * s)}" y="${r(y - 0.3 * s)}" width="${r(0.22 * s)}" height="${r(0.3 * s)}" rx="${r(0.05 * s)}" fill="#1b1b1d"/>`;
  S.teil({ id: "elektrotaxi", de: "das Elektrotaxi", syl: "e-LEK-tro-ta-xi", it: "il taxi elettrico", itSyl: "TA-xi e-LET-tri-co", en: "electric taxi", x, y, kunst: `<g ${VOL}>${k}</g>`,
    tipp: "In Zermatt sind Autos verboten. Taxis und Lieferwagen fahren mit Strom." });
}

/* 11 — DIE TERRASSE (Restaurant rechts am Ufer): Fondue, Raclette, Kuhglocke — Lupe */
const TER = { X0: 7.6, X1: 11.6, D0: 31.5, D1: 37 };
{
  const s = F / TER.D0, h0 = hb(TER.D0);
  let k = "";
  /* Holzdeck */
  k += `<path d="${pz([P(TER.X0, TER.D0, h0 + 0.3), P(TER.X1, TER.D0, h0 + 0.3), P(TER.X1, TER.D1, h0 + 0.3), P(TER.X0, TER.D1, h0 + 0.3)])}" fill="#a87a4c"/>`;
  k += `<path d="${pz([P(TER.X0, TER.D0, h0), P(TER.X1, TER.D0, h0), P(TER.X1, TER.D0, h0 + 0.3), P(TER.X0, TER.D0, h0 + 0.3)])}" fill="#6e4a2c"/>`;
  /* Geländer zum Fluss (Holz) */
  let gel = "";
  for (let D = TER.D0; D <= TER.D1 + 0.01; D += 0.9) gel += `M${pt(P(TER.X0, D, h0 + 0.3))} L${pt(P(TER.X0, D, h0 + 1.3))}`;
  k += `<path d="${gel}" stroke="#5a3a20" stroke-width=".6"/><path d="M${pt(P(TER.X0, TER.D0, h0 + 1.3))} L${pt(P(TER.X0, TER.D1, h0 + 1.3))}" stroke="#7a5230" stroke-width="1"/>`;
  /* zwei Tische mit Stühlen, roter Sonnenschirm */
  const tisch = (X, D) => { const [tx, ty] = P(X, D, h0 + 0.3 + 0.75), ts = F / D; return { tx, ty, ts, g: `<path d="M${r(tx - 0.55 * ts)} ${r(ty)} L${r(tx + 0.55 * ts)} ${r(ty)} L${r(tx + 0.5 * ts)} ${r(ty + 0.08 * ts)} L${r(tx - 0.5 * ts)} ${r(ty + 0.08 * ts)} Z" fill="#8a5a30"/><rect x="${r(tx - 0.04 * ts)}" y="${r(ty + 0.08 * ts)}" width="${r(0.08 * ts)}" height="${r(0.67 * ts)}" fill="#4a3020"/><path d="M${r(tx - 0.62 * ts)} ${r(ty - 0.02 * ts)} L${r(tx + 0.62 * ts)} ${r(ty - 0.02 * ts)}" stroke="#d8343c" stroke-width="${r(0.03 * ts)}"/>` }; };
  const t1 = tisch(9.8, 33), t2 = tisch(10.2, 35.6);
  k += t2.g + t1.g;
  /* Stühle (Holz) */
  for (const [X, D] of [[8.9, 33], [10.7, 33.1], [9.3, 35.6], [11.0, 35.6]]) { const [cx, cy] = P(X, D, h0 + 0.3), cs = F / D; k += `<path d="M${r(cx - 0.2 * cs)} ${r(cy)} L${r(cx - 0.2 * cs)} ${r(cy - 0.9 * cs)} M${r(cx + 0.2 * cs)} ${r(cy)} L${r(cx + 0.2 * cs)} ${r(cy - 0.45 * cs)}" stroke="#5a3a20" stroke-width="${r(0.05 * cs)}"/><path d="M${r(cx - 0.22 * cs)} ${r(cy - 0.47 * cs)} L${r(cx + 0.22 * cs)} ${r(cy - 0.47 * cs)}" stroke="#7a5230" stroke-width="${r(0.07 * cs)}"/>`; }
  /* Sonnenschirm über Tisch 2 */
  { const [px, py] = P(10.2, 35.6, h0 + 2.6), ps = F / 35.6, [fx, fy] = P(10.2, 35.6, h0 + 1.05); k += `<path d="M${r(fx)} ${r(fy)} L${r(px)} ${r(py)}" stroke="#ddd" stroke-width="${r(0.04 * ps)}"/><path d="M${r(px - 1.3 * ps)} ${r(py + 0.45 * ps)} Q${r(px)} ${r(py - 0.5 * ps)} ${r(px + 1.3 * ps)} ${r(py + 0.45 * ps)} Z" fill="${S.lg("schirm", [[0, "#e84a3c"], [1, "#a8231c"]], 0, 0, 1, 0)}"/><path d="M${r(px - 1.3 * ps)} ${r(py + 0.45 * ps)} Q${r(px - 0.65 * ps)} ${r(py + 0.6 * ps)} ${r(px)} ${r(py + 0.45 * ps)} Q${r(px + 0.65 * ps)} ${r(py + 0.6 * ps)} ${r(px + 1.3 * ps)} ${r(py + 0.45 * ps)}" stroke="#7a1810" stroke-width=".3" fill="none"/>`; }
  /* FONDUE auf Tisch 1: Caquelon (rot-orange Keramik) auf dem Rechaud, Brotwürfel, Gabeln */
  const { tx, ty, ts } = t1, fx = tx - 0.18 * ts, fy = ty - 0.02 * ts;
  const fq = (a, b) => `${r(fx + a * ts)} ${r(fy + b * ts)}`;
  let fondue = `<path d="M${fq(-0.1, 0)} L${fq(-0.08, -0.12)} M${fq(0.1, 0)} L${fq(0.08, -0.12)}" stroke="#2a2a2a" stroke-width="${r(0.014 * ts)}"/><ellipse cx="${r(fx)}" cy="${r(fy - 0.08 * ts)}" rx="${r(0.035 * ts)}" ry="${r(0.025 * ts)}" fill="#3a6ad8" opacity=".9"/>`;
  fondue += `<path d="M${fq(-0.13, -0.13)} Q${fq(-0.14, -0.26)} ${fq(0, -0.27)} Q${fq(0.14, -0.26)} ${fq(0.13, -0.13)} Q${fq(0, -0.1)} ${fq(-0.13, -0.13)} Z" fill="${S.lg("caquelon", [[0, "#e8763a"], [0.6, "#c4481e"], [1, "#8a2c10"]], 0, 0, 1, 0)}"/>`;
  fondue += `<ellipse cx="${r(fx)}" cy="${r(fy - 0.265 * ts)}" rx="${r(0.13 * ts)}" ry="${r(0.035 * ts)}" fill="#f2d78a"/><path d="M${fq(0.13, -0.18)} L${fq(0.3, -0.2)}" stroke="#8a4a20" stroke-width="${r(0.025 * ts)}"/>`;
  fondue += `<path d="M${fq(-0.05, -0.28)} L${fq(-0.2, -0.55)} M${fq(0.06, -0.28)} L${fq(0.18, -0.56)}" stroke="#9aa3aa" stroke-width="${r(0.01 * ts)}"/><rect x="${r(fx - 0.23 * ts)}" y="${r(fy - 0.6 * ts)}" width="${r(0.06 * ts)}" height="${r(0.06 * ts)}" fill="#e2b46a"/><path d="M${fq(-0.18, -0.55)} q${r(0.02 * ts)} ${r(0.05 * ts)} 0 ${r(0.08 * ts)}" stroke="#f2d78a" stroke-width="${r(0.012 * ts)}" fill="none"/>`;
  fondue += `<ellipse cx="${r(fx + 0.36 * ts)}" cy="${r(fy - 0.03 * ts)}" rx="${r(0.13 * ts)}" ry="${r(0.035 * ts)}" fill="#c9a06a"/>` + Array.from({ length: 6 }, (_, i) => `<rect x="${r(fx + (0.27 + (i % 3) * 0.06) * ts)}" y="${r(fy - (0.09 + Math.floor(i / 3) * 0.04) * ts)}" width="${r(0.05 * ts)}" height="${r(0.045 * ts)}" fill="${i % 2 ? "#e6c084" : "#d4a058"}"/>`).join("");
  /* RACLETTE auf Tisch 1 rechts: halber Laib unter dem Heizarm, Käse läuft auf den Teller mit Kartoffeln */
  const rx0 = tx + 0.32 * ts, ry0 = ty - 0.02 * ts, rq = (a, b) => `${r(rx0 + a * ts)} ${r(ry0 + b * ts)}`;
  let raclette = `<path d="M${rq(-0.05, 0)} L${rq(-0.05, -0.42)} L${rq(0.24, -0.42)} L${rq(0.24, -0.36)} L${rq(0.02, -0.36)} L${rq(0.02, 0)} Z" fill="#7d868d"/><rect x="${r(rx0 - 0.02 * ts)}" y="${r(ry0 - 0.4 * ts)}" width="${r(0.25 * ts)}" height="${r(0.05 * ts)}" fill="#ff8a3c" opacity=".7"/>`;
  raclette += `<path d="M${rq(0.03, -0.12)} L${rq(0.25, -0.2)} L${rq(0.25, -0.08)} Q${rq(0.14, -0.03)} ${rq(0.03, -0.05)} Z" fill="#f4d27a"/><path d="M${rq(0.25, -0.2)} L${rq(0.28, -0.19)} L${rq(0.28, -0.07)} L${rq(0.25, -0.08)} Z" fill="#c98a2a"/>`;
  raclette += `<path d="M${rq(0.2, -0.08)} Q${rq(0.22, -0.02)} ${rq(0.19, 0.0)}" stroke="#ffd96a" stroke-width="${r(0.025 * ts)}" fill="none"/><ellipse cx="${r(rx0 + 0.16 * ts)}" cy="${r(ry0 + 0.0)}" rx="${r(0.14 * ts)}" ry="${r(0.03 * ts)}" fill="#f4f2ec"/><ellipse cx="${r(rx0 + 0.12 * ts)}" cy="${r(ry0 - 0.02 * ts)}" rx="${r(0.04 * ts)}" ry="${r(0.03 * ts)}" fill="#c9a050"/><ellipse cx="${r(rx0 + 0.2 * ts)}" cy="${r(ry0 - 0.02 * ts)}" rx="${r(0.035 * ts)}" ry="${r(0.028 * ts)}" fill="#b88a40"/>`;
  k += `<g ${VOL}>${fondue}${raclette}</g>`;
  /* KUHGLOCKE am Pfosten des Eingangs (Zierglocke mit Lederriemen) */
  const [gx, gy] = P(TER.X1 - 0.2, TER.D0 + 0.1, h0 + 2.2), gs = F / (TER.D0 + 0.1);
  const [gx0, gy0] = P(TER.X1 - 0.2, TER.D0 + 0.1, h0 + 0.3);
  let glocke = `<rect x="${r(gx0 - 0.06 * gs)}" y="${r(gy - 0.5 * gs)}" width="${r(0.12 * gs)}" height="${r(gy0 - gy + 0.5 * gs)}" fill="#6e4a2c"/>`;
  glocke += `<path d="M${r(gx - 0.14 * gs)} ${r(gy - 0.42 * gs)} Q${r(gx)} ${r(gy - 0.3 * gs)} ${r(gx + 0.14 * gs)} ${r(gy - 0.42 * gs)}" stroke="#4a2a16" stroke-width="${r(0.05 * gs)}" fill="none"/>`;
  glocke += `<path d="M${r(gx - 0.1 * gs)} ${r(gy - 0.33 * gs)} L${r(gx + 0.1 * gs)} ${r(gy - 0.33 * gs)} L${r(gx + 0.17 * gs)} ${r(gy + 0.02 * gs)} Q${r(gx)} ${r(gy + 0.07 * gs)} ${r(gx - 0.17 * gs)} ${r(gy + 0.02 * gs)} Z" fill="${S.lg("glocke", [[0, "#f6d77a"], [0.5, "#c9962a"], [1, "#7a5410"]], 0, 0, 1, 0)}"/>`;
  glocke += `<path d="M${r(gx - 0.12 * gs)} ${r(gy - 0.2 * gs)} L${r(gx + 0.12 * gs)} ${r(gy - 0.2 * gs)}" stroke="#d8343c" stroke-width="${r(0.03 * gs)}"/><circle cx="${r(gx)}" cy="${r(gy + 0.06 * gs)}" r="${r(0.035 * gs)}" fill="#5a3a10"/>`;
  k += `<g ${VOL}>${glocke}</g>`;
  const [ax, ay] = P((TER.X0 + TER.X1) / 2, TER.D0, h0);
  S.teil({ id: "terrasse", de: "die Terrasse", syl: "ter-RAS-se", it: "la terrazza", itSyl: "ter-RAZ-za", en: "terrace", anker: [ax, ay], kunst: k,
    tipp: "Auf der Terrasse essen die Gäste mit Blick auf das Matterhorn.",
    zoom: { x: r(tx - 14), y: r(ty - 15), w: 30, h: 20 },
    unter: [
      { id: "fondue", de: "das Fondue", syl: "fon-DÜ", it: "la fonduta", itSyl: "fon-DU-ta", en: "fondue", x: fx, y: fy, kunst: flaeche(-0.16 * ts, -0.32 * ts, 0.32 * ts, 0.34 * ts, 0.3),
        tipp: "Beim Käsefondue taucht man Brotwürfel in geschmolzenen Käse." },
      { id: "raclette", de: "das Raclette", syl: "ra-KLETT", it: "la raclette", itSyl: "ra-CLET-te", en: "raclette", x: rx0 + 0.12 * ts, y: ry0, kunst: flaeche(-0.18 * ts, -0.44 * ts, 0.4 * ts, 0.47 * ts, 0.3),
        tipp: "Raclette kommt aus dem Wallis: Der Käse wird geschmolzen und auf Kartoffeln geschabt." },
      { id: "kuhglocke", de: "die Kuhglocke", syl: "KUH-glo-cke", it: "il campanaccio", itSyl: "cam-pa-NAC-cio", en: "cowbell", x: gx, y: gy + 0.08 * gs, kunst: flaeche(-0.2 * gs, -0.55 * gs, 0.4 * gs, 0.63 * gs, 0.3),
        tipp: "Auf der Alm tragen die Kühe Glocken. So hört der Bauer, wo sie sind." },
    ] });
}

/* 12 — DIE FLAGGE (Schweiz) am Mast neben der Terrasse */
{
  const X = TER.X1 + 0.6, D = TER.D1 + 0.5, h0 = hb(D), [mx, my] = P(X, D, h0), [tx, ty] = P(X, D, h0 + 7.2), s = F / D;
  let k = `<path d="M${r(mx)} ${r(my)} L${r(tx)} ${r(ty)}" stroke="#e8e8e4" stroke-width="${r(0.09 * s)}"/><circle cx="${r(tx)}" cy="${r(ty)}" r="${r(0.08 * s)}" fill="#d8b24a"/>`;
  const fw = 1.5 * s, fy = ty + 0.15 * s;
  k += `<path d="M${r(tx)} ${r(fy)} Q${r(tx - fw * 0.5)} ${r(fy + 0.2 * s)} ${r(tx - fw)} ${r(fy + 0.05 * s)} L${r(tx - fw)} ${r(fy + fw + 0.05 * s)} Q${r(tx - fw * 0.5)} ${r(fy + fw + 0.2 * s)} ${r(tx)} ${r(fy + fw)} Z" fill="#d52b1e"/>`;
  const cx = tx - fw / 2, cy = fy + fw / 2 + 0.1 * s, a = fw * 0.19, b = fw * 0.06;
  k += `<path d="M${r(cx - b)} ${r(cy - a)} L${r(cx + b)} ${r(cy - a)} L${r(cx + b)} ${r(cy - b)} L${r(cx + a)} ${r(cy - b)} L${r(cx + a)} ${r(cy + b)} L${r(cx + b)} ${r(cy + b)} L${r(cx + b)} ${r(cy + a)} L${r(cx - b)} ${r(cy + a)} L${r(cx - b)} ${r(cy + b)} L${r(cx - a)} ${r(cy + b)} L${r(cx - a)} ${r(cy - b)} L${r(cx - b)} ${r(cy - b)} Z" fill="#fff"/>`;
  k += `<path d="M${r(tx)} ${r(fy)} Q${r(tx - fw * 0.5)} ${r(fy + 0.2 * s)} ${r(tx - fw)} ${r(fy + 0.05 * s)} L${r(tx - fw)} ${r(fy + fw + 0.05 * s)} Q${r(tx - fw * 0.5)} ${r(fy + fw + 0.2 * s)} ${r(tx)} ${r(fy + fw)} Z" fill="${S.lg("fahnelicht", [[0, "#fff", 0.25], [0.5, "#000", 0.12], [1, "#fff", 0.1]], 1, 0, 0, 0)}"/>`;
  S.teil({ oben: true, id: "flagge", de: "die Flagge", syl: "FLAG-ge", it: "la bandiera", itSyl: "ban-DIE-ra", en: "flag", x: mx, y: my, kunst: `<g transform="translate(${r(-mx)} ${r(-my)})">${k}</g>`,
    tipp: "Die Schweizer Flagge ist quadratisch: ein weißes Kreuz auf Rot." });
}

/* 13 — DIE BANK am linken Uferweg mit Picknick (Lupe: Taschenmesser, Schokolade) und 14/15 — DIE WANDERER */
const BANK = { X: -8.0, D: 30.5 };
{
  const s = F / BANK.D, h0 = hb(BANK.D), [bx, by] = P(BANK.X, BANK.D, h0);
  /* Bank längs zum Fluss (Sitz zeigt zum Wasser): von uns aus seitlich, 1,8 m lang */
  const q3 = (dX, dD, h) => P(BANK.X + dX, BANK.D + dD, h0 + h);
  let k = "";
  for (const dD of [-0.8, 0.8]) k += `<path d="M${pt(q3(0, dD, 0))} L${pt(q3(0, dD, 0.45))} M${pt(q3(-0.45, dD, 0))} L${pt(q3(-0.45, dD, 0.9))}" stroke="#2a2a2c" stroke-width="${r(0.05 * s)}"/>`;
  k += `<path d="${pz([q3(0.05, -0.95, 0.45), q3(0.05, 0.95, 0.45), q3(-0.4, 0.95, 0.45), q3(-0.4, -0.95, 0.45)])}" fill="#9a6a3c"/>`;
  k += `<path d="${pz([q3(0.05, -0.95, 0.45), q3(0.05, 0.95, 0.45), q3(0.05, 0.95, 0.4), q3(0.05, -0.95, 0.4)])}" fill="#6e4a2c"/>`;
  for (const hh of [0.62, 0.8]) k += `<path d="${pz([q3(-0.45, -0.95, hh), q3(-0.45, 0.95, hh), q3(-0.45, 0.95, hh + 0.12), q3(-0.45, -0.95, hh + 0.12)])}" fill="#b07c48"/>`;
  /* Picknick auf der Bank: Taschenmesser (rot, Kreuz), Schokolade (Tafel, Papier), Brot */
  const [mx, my] = q3(-0.12, -0.55, 0.47), ms = F / (BANK.D - 0.55);
  let messer = `<rect x="${r(mx - 0.05 * ms)}" y="${r(my - 0.022 * ms)}" width="${r(0.1 * ms)}" height="${r(0.026 * ms)}" rx="${r(0.012 * ms)}" fill="#d52b1e"/><path d="M${r(mx + 0.05 * ms)} ${r(my - 0.016 * ms)} L${r(mx + 0.12 * ms)} ${r(my - 0.03 * ms)} L${r(mx + 0.12 * ms)} ${r(my - 0.018 * ms)} L${r(mx + 0.05 * ms)} ${r(my - 0.004 * ms)} Z" fill="#dfe5ea"/><path d="M${r(mx - 0.008 * ms)} ${r(my - 0.009 * ms)} h${r(0.016 * ms)} M${r(mx)} ${r(my - 0.017 * ms)} v${r(0.016 * ms)}" stroke="#fff" stroke-width="${r(0.005 * ms)}"/>`;
  const [cx, cy] = q3(-0.15, 0.1, 0.47), cs = F / (BANK.D + 0.1);
  let schoko = `<path d="M${r(cx - 0.09 * cs)} ${r(cy)} L${r(cx + 0.09 * cs)} ${r(cy)} L${r(cx + 0.07 * cs)} ${r(cy - 0.035 * cs)} L${r(cx - 0.11 * cs)} ${r(cy - 0.035 * cs)} Z" fill="#5a3418"/><path d="M${r(cx - 0.02 * cs)} ${r(cy)} L${r(cx + 0.09 * cs)} ${r(cy)} L${r(cx + 0.07 * cs)} ${r(cy - 0.035 * cs)} L${r(cx - 0.04 * cs)} ${r(cy - 0.035 * cs)} Z" fill="#d6c8a8"/><path d="M${r(cx - 0.06 * cs)} ${r(cy - 0.035 * cs)} L${r(cx - 0.05 * cs)} ${r(cy)} M${r(cx - 0.09 * cs)} ${r(cy - 0.018 * cs)} L${r(cx - 0.02 * cs)} ${r(cy - 0.018 * cs)}" stroke="#3a200c" stroke-width="${r(0.005 * cs)}"/>`;
  const [ux, uy] = q3(-0.2, 0.45, 0.47), us = F / (BANK.D + 0.45);
  const brot = `<path d="M${r(ux - 0.1 * us)} ${r(uy)} Q${r(ux - 0.1 * us)} ${r(uy - 0.07 * us)} ${r(ux)} ${r(uy - 0.075 * us)} Q${r(ux + 0.1 * us)} ${r(uy - 0.07 * us)} ${r(ux + 0.1 * us)} ${r(uy)} Z" fill="#b8783a"/>`;
  k += `<g ${VOL}>${messer}${schoko}${brot}</g>`;
  /* Bodenschatten der Bank (Sonne links → nach rechts) */
  const [o1x] = sch(0.45);
  k = `<path d="${pz([q3(0.05, -0.95, 0), q3(0.05, 0.95, 0), q3(0.05 + o1x, 0.95, 0), q3(0.05 + o1x, -0.95, 0)])}" fill="#1c2638" opacity=".28" filter="url(#${S.id("weich")})"/>` + k;
  S.teil({ id: "bank", de: "die Bank", syl: "BANK", it: "la panchina", itSyl: "pan-CHI-na", en: "bench", anker: [bx, by], kunst: k,
    zoom: { x: r(bx - 15), y: r(by - 20), w: 30, h: 20 },
    unter: [
      { id: "taschenmesser", de: "das Taschenmesser", syl: "TA-schen-mes-ser", it: "il coltellino svizzero", itSyl: "col-tel-LI-no SVIZ-ze-ro", en: "pocket knife", x: mx, y: my, kunst: flaeche(-0.08 * ms, -0.06 * ms, 0.22 * ms, 0.08 * ms, 0.3),
        tipp: "Das rote Schweizer Taschenmesser hat viele Werkzeuge: Messer, Schere, Dosenöffner …" },
      { id: "schokolade", de: "die Schokolade", syl: "scho-ko-LA-de", it: "il cioccolato", itSyl: "cioc-co-LA-to", en: "chocolate", x: cx, y: cy, kunst: flaeche(-0.12 * cs, -0.07 * cs, 0.23 * cs, 0.09 * cs, 0.3),
        tipp: "Die Schweiz ist berühmt für ihre Schokolade." },
    ] });
  /* DIE WANDERIN sitzt auf der Bank (schaut zum Fluss) */
  const [wx, wy] = q3(-0.18, 0.55, 0.0), ws = F / (BANK.D + 0.55);
  const wi = B.mensch({ id: "chz_wi", geschlecht: "w", pose: "sitzen", blick: 270, frisur: "zopf", haarfarbe: "braun", haut: "hell", ohneSchatten: true,
    kleidung: { oberteil: { stueck: "pullover", farbe: "#2f8a8a" }, jacke: { stueck: "jacke", farbe: "#d0402e" }, unterteil: { stueck: "hose", farbe: "grau" }, schuhe: { stueck: "stiefel", farbe: "braun" } } }, 1.66 * ws);
  S.teil({ id: "wanderin", de: "die Wanderin", syl: "WAN-de-rin", it: "l'escursionista", itSyl: "e-scur-sio-NI-sta", en: "hiker (woman)", x: wx, y: wy, kunst: `<g ${VOL}>${schlank(wi.svg, 2)}</g>`,
    tipp: "Die Wanderin macht eine Pause und isst Schokolade." });
  /* DER WANDERER steht daneben und schaut zum Matterhorn (Rucksack, Wanderstöcke) */
  const Dw = BANK.D - 1.6, Xw = BANK.X + 0.4, [hx, hy] = P(Xw, Dw, h0), hs = F / Dw;
  const halt = { lende: 1, brust: -2, nacken: -6, kopf: -10, schulterL: { vor: 18, seit: 12 }, ellbogenL: 20, unterarmL: 0, handL: 0, fingerL: 0.8, schulterR: { vor: 18, seit: 12 }, ellbogenR: 22, unterarmR: 0, handR: 0, fingerR: 0.8, huefteL: { vor: 6, seit: 4, dreh: -4 }, knieL: 6, fussL: 0, huefteR: { vor: -6, seit: 4, dreh: -4 }, knieR: 3, fussR: 0 };
  const wa = B.mensch({ id: "chz_wa", geschlecht: "m", pose: halt, blick: 200, frisur: "kurz", haarfarbe: "dunkelbraun", haut: "hell", ohneSchatten: true,
    kleidung: { oberteil: { stueck: "pullover", farbe: "#e0802e" }, jacke: { stueck: "jacke", farbe: "#2f5f95" }, unterteil: { stueck: "hose", farbe: "#4a4a40" }, schuhe: { stueck: "stiefel", farbe: "braun" }, kopf: { stueck: "muetze", farbe: "#c8352e" } } }, 1.78 * hs);
  const hands = [wa.z.handL, wa.z.handR].filter(Boolean).map((h) => [h.x * wa.k, h.y * wa.k]);
  let stoecke = "";
  for (const [ax2, ay2] of hands) stoecke += `<path d="M${r(ax2)} ${r(ay2 - 0.08 * hs)} L${r(ax2 + (ax2 < 0 ? -0.18 : 0.18) * hs)} ${r(0.02 * hs)}" stroke="#3a3f46" stroke-width="${r(0.025 * hs)}" stroke-linecap="round"/><path d="M${r(ax2)} ${r(ay2 - 0.1 * hs)} L${r(ax2)} ${r(ay2 + 0.06 * hs)}" stroke="#1a1a1a" stroke-width="${r(0.04 * hs)}" stroke-linecap="round"/>`;
  /* Rucksack (von hinten gut zu sehen) */
  const ru = (wa.z.punkte && wa.z.punkte.ruecken) ? [wa.z.punkte.ruecken[0] * wa.k, wa.z.punkte.ruecken[1] * wa.k] : [0, -1.25 * hs];
  const rucksack = `<path d="M${r(ru[0] - 0.19 * hs)} ${r(ru[1] - 0.26 * hs)} Q${r(ru[0])} ${r(ru[1] - 0.34 * hs)} ${r(ru[0] + 0.19 * hs)} ${r(ru[1] - 0.26 * hs)} L${r(ru[0] + 0.2 * hs)} ${r(ru[1] + 0.2 * hs)} Q${r(ru[0])} ${r(ru[1] + 0.27 * hs)} ${r(ru[0] - 0.2 * hs)} ${r(ru[1] + 0.2 * hs)} Z" fill="${S.lg("rucksack", [[0, "#3e8a4a"], [1, "#24562e"]], 0, 0, 1, 0)}"/><path d="M${r(ru[0] - 0.17 * hs)} ${r(ru[1] - 0.12 * hs)} L${r(ru[0] + 0.17 * hs)} ${r(ru[1] - 0.12 * hs)}" stroke="#1a3a1e" stroke-width="${r(0.02 * hs)}"/><rect x="${r(ru[0] - 0.1 * hs)}" y="${r(ru[1] + 0.02 * hs)}" width="${r(0.2 * hs)}" height="${r(0.12 * hs)}" rx="${r(0.02 * hs)}" fill="#2f6a3a"/>`;
  const schatten = `<path d="M${r(-0.18 * hs)} 0 L${r(0.18 * hs)} 0 L${r(2.45 * hs)} ${r(-0.12 * hs)} L${r(2.3 * hs)} ${r(-0.22 * hs)} Z" fill="#1c2638" opacity=".3" filter="url(#${S.id("weich")})"/>`;
  S.teil({ id: "wanderer", de: "der Wanderer", syl: "WAN-de-rer", it: "l'escursionista", itSyl: "e-scur-sio-NI-sta", en: "hiker", x: hx, y: hy, kunst: schatten + `<g ${VOL}>${schlank(wa.svg, 2)}${rucksack}${stoecke}</g>`,
    tipp: "Rund um Zermatt gibt es über 400 Kilometer Wanderwege.",
    zoom: { x: r(hx - 12), y: r(hy - 2.1 * hs), w: 24, h: 16 + r(0.2 * hs) },
    unter: [
      { id: "rucksack", de: "der Rucksack", syl: "RUCK-sack", it: "lo zaino", itSyl: "ZAI-no", en: "backpack", x: hx + ru[0], y: hy + ru[1] + 0.25 * hs, kunst: flaeche(-0.22 * hs, -0.6 * hs, 0.44 * hs, 0.62 * hs, 0.3),
        tipp: "Im Rucksack sind Regenjacke, Wasser und Proviant." },
    ] });
}

/* 16 — DIE ALPENDOHLEN (schwarz, gelber Schnabel) am Himmel */
{
  const dohle = (x, y, s, f) => `<path d="M${r(x - 3 * s)} ${r(y - 1.4 * s * f)} Q${r(x - 1.4 * s)} ${r(y - 0.6 * s)} ${r(x)} ${r(y)} Q${r(x + 1.4 * s)} ${r(y - 0.6 * s)} ${r(x + 3 * s)} ${r(y - 1.4 * s * f)} Q${r(x + 1.2 * s)} ${r(y + 0.1 * s)} ${r(x)} ${r(y + 0.5 * s)} Q${r(x - 1.2 * s)} ${r(y + 0.1 * s)} ${r(x - 3 * s)} ${r(y - 1.4 * s * f)} Z" fill="#141416"/><path d="M${r(x + 0.15 * s)} ${r(y + 0.2 * s)} l${r(0.5 * s)} ${r(0.05 * s)} l${r(-0.5 * s)} ${r(0.15 * s)} Z" fill="#f2c62e"/>`;
  const k = dohle(84, 34, 1.1, 1) + dohle(98, 26, 0.85, -0.4) + dohle(70, 22, 0.7, 0.6);
  S.teil({ oben: true, id: "alpendohle", de: "die Alpendohle", syl: "AL-pen-doh-le", it: "il gracchio alpino", itSyl: "GRAC-chio al-PI-no", en: "alpine chough", x: 84, y: 34, kunst: `<g transform="translate(-84 -34)">${k}</g>`,
    tipp: "Alpendohlen sind schwarz und haben einen gelben Schnabel. Sie fliegen bis auf die Gipfel." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/schweiz.js"));
console.log(aus);
