#!/usr/bin/env node
const STADEL = [{ X0: 10.4, X1: 14.2, D0: 60, D1: 64.5 }, { X0: 11, X1: 14.6, D0: 70, D1: 74 }];
const LAERCHEN = [[18.5, 57, 17, 61, true], [9.8, 79, 15, 62, true], [17.8, 68, 13, 63, false], [-9.4, 69, 16, 64, true], [-9.6, 50, 18, 65, false]];
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
     WANDERIN auf der Bank, der BERGSTEIGER (Helm, Seil, Pickel) am Geländer
     der Kirchbrücke, die Schweizer FLAGGE, ALPENDOHLEN. Bernhardiner nicht: das
     Fotografieren mit den Hunden ist in Zermatt seit 2015 verboten.
     Die Gornergratbahn ist von hier nicht zu sehen (UNSICHER) — weggelassen.
   ZEIT/LICHT: Ende September, 10 Uhr: Sonne im Südosten (Azimut 135°,
   35° hoch) — für uns LINKS und etwas hinter uns. Ostwand und rechter
   Hang leuchten, Nordwand und linker Hang im Schatten; Schatten fallen
   nach rechts. Die Lärchen werden schon golden.
   KAMERA: Augenhöhe 6,5 m über dem Fluss (Brücke 4,8 m + 1,7 m),
   Horizont y = 196, Fluchtpunkt x = 200. Ufer 4,2 m über dem Wasser,
   Talboden steigt 2 %. Nah (Dorf): x = 200 + 380·X/D, y = 196 − (h − 6,5)·
   380/D. Ferne (Berge): Teleblick wie auf den bekannten Fotos, Matterhorn
   in 8,57 km = 0,0607 Einheiten je Meter (1000 m = 61 Einheiten; die
   Ferne wird mit T() um den Horizont auf das 1,368-Fache gerechnet).
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "schweiz", titel: "Schweiz – Zermatt und Matterhorn", emoji: "🏔️", thema: "Länder", kuerzel: "chz", fassung: 854, breite: 400, hoehe: 260 });
/* Verläufe in Bildkoordinaten: die Koordinaten aus "extra" ersetzen die Vorgaben (sonst stünden x1/y1 doppelt da, und der Browser nähme die ersten) */
{ const lg0 = S.lg; S.lg = (n, st, x1 = 0, y1 = 0, x2 = 0, y2 = 1, ex = "") => { if (!/ x1=/.test(ex)) return lg0(n, st, x1, y1, x2, y2, ex); const m = (k) => ex.match(new RegExp(" " + k + '="([^"]*)"'))[1]; return lg0(n, st, m("x1"), m("y1"), m("x2"), m("y2"), ex.replace(/ (x1|y1|x2|y2)="[^"]*"/g, "")); }; }
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
/* Pfade relativ schreiben (Ladezeit): jede Koordinate absolut auf 0,1 gerundet, dann als Differenz — keine Drift */
function relativ(svg) {
  const f = (v) => { let s = String(Math.round(v * 10) / 10); if (s === "-0") s = "0"; return s.replace(/^(-?)0\./, "$1."); };
  const R = (v) => Math.round(v * 10) / 10;
  return svg.replace(/ d="([^"]*)"/g, (m0, d) => {
    const tok = d.match(/[a-zA-Z]|-?(?:\d+\.?\d*|\.\d+)(?:e-?\d+)?/g) || [];
    let i = 0, cx = 0, cy = 0, sx = 0, sy = 0, out = "", prev = "", letzter = "";
    const zahl = (s) => { if (out && prev !== "" && !/^-/.test(s) && !(s[0] === "." && prev.includes("."))) out += " "; out += s; prev = s; };
    const befehl = (c) => { if (c !== letzter || c === "m") { out += c; prev = ""; letzter = c; } };
    const istZahl = () => i < tok.length && !/^[a-zA-Z]$/.test(tok[i]);
    let cmd = "";
    while (i < tok.length) {
      if (/^[a-zA-Z]$/.test(tok[i])) cmd = tok[i++];
      const rel = cmd === cmd.toLowerCase(), C = cmd.toUpperCase();
      const n = () => parseFloat(tok[i++]);
      const pkt = () => { let x = n(), y = n(); if (rel) { x += cx; y += cy; } return [R(x), R(y)]; };
      if (C === "Z") { befehl("z"); cx = sx; cy = sy; if (!istZahl()) continue; else continue; }
      if (!istZahl()) { i++; continue; }
      if (C === "M") { const [x, y] = pkt(); befehl("m"); zahl(f(x - cx)); zahl(f(y - cy)); cx = sx = x; cy = sy = y; cmd = rel ? "l" : "L"; continue; }
      if (C === "L" || C === "T") { const [x, y] = pkt(); befehl(C.toLowerCase()); zahl(f(x - cx)); zahl(f(y - cy)); cx = x; cy = y; continue; }
      if (C === "H") { let x = n(); if (rel) x += cx; x = R(x); befehl("h"); zahl(f(x - cx)); cx = x; continue; }
      if (C === "V") { let y = n(); if (rel) y += cy; y = R(y); befehl("v"); zahl(f(y - cy)); cy = y; continue; }
      if (C === "C") { const a = pkt(), b = pkt(), e = pkt(); befehl("c"); for (const p of [a, b, e]) { zahl(f(p[0] - cx)); zahl(f(p[1] - cy)); } cx = e[0]; cy = e[1]; continue; }
      if (C === "S" || C === "Q") { const a = pkt(), e = pkt(); befehl(C.toLowerCase()); for (const p of [a, e]) { zahl(f(p[0] - cx)); zahl(f(p[1] - cy)); } cx = e[0]; cy = e[1]; continue; }
      if (C === "A") { const rx = n(), ry = n(), rot = n(), fa = n(), fs = n(); let x = n(), y = n(); if (rel) { x += cx; y += cy; } x = R(x); y = R(y); befehl("a"); zahl(f(rx)); zahl(f(ry)); zahl(f(rot)); zahl(String(fa)); zahl(String(fs)); zahl(f(x - cx)); zahl(f(y - cy)); cx = x; cy = y; continue; }
      i++;
    }
    return ` d="${out}"`;
  });
}
/* beim Schreiben alle Pfade relativ */
{ const schreiben = S.schreiben; S.schreiben = (datei) => { for (const t of S.teile) { t.kunst = relativ(t.kunst); if (t.unter) for (const u of t.unter) u.kunst = relativ(u.kunst); } S.kulisse = S.kulisse.map(relativ); S.vorne = S.vorne.map(relativ); S.defs = S.defs.map(relativ); return schreiben(datei); }; }
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
    /* Verläufe durch ihre mittlere Farbe ersetzen; Clip-Pfade bleiben (sonst laufen Schattierungen im Gesicht über) */
    svg = svg.replace(/<(linearGradient|radialGradient) id="[^"]+"[^>]*>.*?<\/\1>/g, "").replace(/<defs><\/defs>/g, "").replace(/url\(#([^)]+)\)/g, (m, id) => farbe[id] || m);
  }
  return svg;   /* Zahlen bleiben fein: beim Schreiben werden alle Pfade relativ auf 0,1 gesetzt */
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
S.def(`<filter id="${S.id("vol")}"${CIF} x="-10%" y="-5%" width="120%" height="110%"><feOffset in="SourceAlpha" dx=".22" dy=".1" result="o"/><feComposite in="SourceAlpha" in2="o" operator="out" result="k"/><feFlood flood-color="#fff2d0" flood-opacity=".45"/><feComposite in2="k" operator="in" result="licht"/><feOffset in="SourceAlpha" dx="-1.3" result="o2"/><feComposite in="SourceAlpha" in2="o2" operator="out" result="s"/><feGaussianBlur in="s" stdDeviation=".6" result="sb"/><feFlood flood-color="#1a2440" flood-opacity=".38"/><feComposite in2="sb" operator="in"/><feComposite in2="SourceAlpha" operator="in" result="schatten"/><feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="schatten"/><feMergeNode in="licht"/></feMerge></filter>`);
const VOL = `filter="url(#${S.id("vol")})"`;
S.def(`<filter id="${S.id("volf")}"${CIF} x="-10%" y="-5%" width="120%" height="110%"><feOffset in="SourceAlpha" dx="-1.1" result="o2"/><feComposite in="SourceAlpha" in2="o2" operator="out" result="s"/><feGaussianBlur in="s" stdDeviation=".5" result="sb"/><feFlood flood-color="#1a2440" flood-opacity=".35"/><feComposite in2="sb" operator="in"/><feComposite in2="SourceAlpha" operator="in" result="schatten"/><feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="schatten"/></feMerge></filter>`);
const VOLF = `filter="url(#${S.id("volf")})"`;

/* =====================================================================
   KULISSE 1 — Himmel (klarer Herbstmorgen, tiefblau oben)
   ===================================================================== */
S.hinten(`<rect width="400" height="262" fill="${S.lg("himmel", [[0, "#2f63a8"], [0.35, "#5b8bc8"], [0.7, "#a9c6e2"], [1, "#dfe9f0"]])}"/>`);
S.hinten(`<ellipse cx="-30" cy="40" rx="190" ry="120" fill="${S.rg("sonnenseite", [[0, "#fff4d8", 0.35], [1, "#fff4d8", 0]])}"/>`);
/* Dunst über dem Talschluss und zwei kleine Schönwetterwolken an den Hängen */
S.hinten(`<rect y="80" width="400" height="90" fill="${S.lg("taldunst", [[0, "#e6eef4", 0], [1, "#e6eef4", 0.55]])}"/>`);
{
  const w = (cx, cy, sk) => { let g = ""; for (const [dx, dy, rr] of [[-6, 0.5, 3], [-2, -1.5, 4.2], [3, -0.6, 3.6], [7, 0.8, 2.6]]) g += `<circle cx="${r(cx + dx * sk)}" cy="${r(cy + dy * sk)}" r="${r(rr * sk)}"/>`; return `<g fill="#fbfbfa">${g}</g><g fill="#c9d3e2" opacity=".6"><ellipse cx="${r(cx + 1 * sk)}" cy="${r(cy + 2.4 * sk)}" rx="${r(9 * sk)}" ry="${r(1.6 * sk)}"/></g>`; };
  S.hinten(w(46, 40, 1.4) + w(352, 30, 1.1));
}

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
/* Linke Silhouette (Furggengrat): oben die kantige, leicht überhängende „Nase“ (der Haken), dann gestufter Grat; unten als Zackengrat auslaufend */
const LINKS = [[218.6, 42.7], [216.9, 43.1], [215.4, 44.1], [214.5, 45.5], [215.1, 46.5], [214.1, 48.2], [213.2, 51.4], [212.1, 54.8], [210.0, 58.6], [208.2, 61.6], [205.4, 64.6], [201.6, 67.8], [197.0, 70.8], [191.2, 73.9], [186.0, 75.4], [184.6, 77.0], [178.2, 79.4], [171.6, 82.4], [168.8, 82.0], [163.4, 85.2], [157.6, 86.6], [154.8, 86.0], [150.2, 88.8], [144.0, 90.2], [140.6, 89.6], [134.6, 92.4], [126.0, 94.4], [120.0, 96.6]];
/* Rechte Silhouette: kurzer, fast waagrechter Gipfelgrat zum italienischen Gipfel, Zmuttgrat mit der Zmuttnase im unteren Drittel */
const RECHTSK = [[218.6, 42.7], [220.6, 43.1], [222.6, 43.2], [223.6, 43.9], [225.0, 46.0], [227.2, 49.4], [229.8, 53.4], [232.6, 57.2], [235.2, 60.2], [238.4, 62.6], [242.0, 66.0], [246.4, 70.0], [251.4, 74.2], [256.6, 78.2], [260.6, 80.4], [264.8, 80.8], [267.6, 82.6], [268.8, 85.4], [272.6, 88.6], [278.4, 92.4], [285.0, 96.4], [294.0, 101.6], [306.0, 107.0]];
/* Hörnligrat: unter dem Gipfel die SCHULTER (flacheres Stück, ≈ 4200 m), darunter Felstürme in Stufen bis zur Hörnlihütte */
const HOERNLI = [[219.3, 43.5], [219.8, 46.4], [220.5, 48.4], [222.6, 49.2], [224.2, 49.9], [224.6, 51.0], [224.0, 53.0], [223.6, 55.4], [224.5, 56.3], [223.3, 59.8], [222.9, 62.9], [223.6, 63.9], [222.2, 67.8], [221.5, 71.5], [222.1, 72.5], [221.0, 76.5], [220.6, 80.4], [220.1, 84.0], [219.6, 88], [219.0, 93], [218.0, 100]];
const HUETTE = [220.4, 84.6];
const ostPoly = [...LINKS, [120, 106], [218, 106], ...HOERNLI.slice().reverse()];
const nordPoly = [...HOERNLI, [218, 112], [306, 112], ...RECHTSK.slice().reverse()];
const pp = (pts) => "M" + pts.map(pt).join(" L") + " Z";
const drin = (poly) => (x, y) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
/* Schnittpunkt einer Linie y(x) mit dem Hörnligrat bzw. der linken Kante: Bänder laufen zwischen beiden */
S.def(fern(`<clipPath id="${S.id("ost")}"><path d="${pp(ostPoly)}"/></clipPath><clipPath id="${S.id("nord")}"><path d="${pp(nordPoly)}"/></clipPath>`));
let BERG = "";
{
  const z = zufall(4478);
  /* Ostwand: Morgensonne, oben warm und hell, unten kühler (drei Tonstufen) */
  BERG += `<path d="${pp(ostPoly)}" fill="${S.lg("ostwand", [[0, "#f6dcb0"], [0.3, "#e2c196"], [0.6, "#c4a888"], [1, "#a8a09a"]], 0, 0, 0, 1, ` gradientUnits="userSpaceOnUse" x1="0" y1="${r(T(0, 42)[1])}" x2="0" y2="${r(T(0, 104)[1])}"`)}"/>`;
  BERG += `<path d="${pp(nordPoly)}" fill="${S.lg("nordwand", [[0, "#6f7f98"], [0.5, "#58687f"], [1, "#56677c"]], 0, 0, 0, 1, ` gradientUnits="userSpaceOnUse" x1="0" y1="${r(T(0, 42)[1])}" x2="0" y2="${r(T(0, 110)[1])}"`)}"/>`;
  /* Gneis-Schichtbänder: 8 durchgehende Bänder, leicht nach links fallend; dunkle Unterkante, darauf Neuschnee als lange dünne Streifen */
  let unterkante = "", schnee = "", band = "";
  for (let i = 0; i < 9; i++) {
    const yr = 48.5 + i * 6.2 + (z() - 0.5) * 1.2, pts = [];
    for (let x = 226; x >= 116; x -= 3.2) pts.push([x, yr + (226 - x) * 0.3 + (z() - 0.5) * 1.1]);
    const d = "M" + pts.map(pt).join(" L");
    unterkante += d;
    band += "M" + pts.map(pt).join(" L") + " L" + pts.slice().reverse().map(([x, y]) => pt([x, y - 1.6 - z() * 0.6])).join(" L") + " Z";
    /* Schnee liegt in Stücken auf dem Band (Lücken, wo der Fels steil ist) */
    let s0 = 0;
    while (s0 < pts.length - 1) { const l = 1 + Math.floor(z() * 2); const seg = pts.slice(s0, Math.min(pts.length, s0 + l + 1)); if (seg.length > 1 && z() < 0.65) { const dy = -0.4 - z() * 0.5; schnee += "M" + seg.map(([x, y]) => pt([x + (z() - 0.5), y + dy])).join(" L"); } s0 += l + (z() < 0.5 ? 1 : 2); }
  }
  /* Couloirs: drei Schneerinnen, die zur Mitte der Wand zusammenlaufen */
  let rinnen = "";
  for (const [x0, y0, x1, y1, w] of [[214, 50, 206, 84, 1.6], [204, 64, 202, 92, 1.3], [192, 74, 199, 98, 1.2]]) rinnen += `M${x0 - w * 0.3} ${y0} Q${(x0 + x1) / 2 - w} ${(y0 + y1) / 2} ${x1 - w} ${y1} L${x1 + w} ${y1} Q${(x0 + x1) / 2 + w * 0.6} ${(y0 + y1) / 2} ${x0 + w * 0.3} ${y0} Z`;
  BERG += `<g clip-path="url(#${S.id("ost")})"><path d="${band}" fill="#8f7a66" opacity=".16"/><path d="${unterkante}" stroke="#5e4c40" stroke-width=".45" fill="none" opacity=".45"/><path d="${rinnen}" fill="#eef0f6" opacity=".5"/><path d="${schnee}" stroke="#fdfdff" stroke-width=".6" fill="none" stroke-linecap="round" opacity=".85"/>` +
    `<path d="${pp(HOERNLI.map(([x, y]) => [x - 2.2, y]).concat(HOERNLI.slice().reverse()))}" fill="#6e5e52" opacity=".35"/>` +
    `<path d="M120 97 Q150 90 176 85 L200 84 L216 86 L216 106 L120 106 Z" fill="${S.lg("ostdunst", [[0, "#b8c8dc", 0], [1, "#b8c8dc", 0.55]])}"/></g>`;
  /* Nordwand: Eisfelder und Schneebänder schräg nach rechts unten, dazwischen dunkle Felsrippen */
  let eis = "", fels = "", baender = "";
  const imNord = drin(nordPoly);
  for (let i = 0; i < 16; i++) { const y0 = 46 + z() * 52, x0 = 223 + z() * 26; if (!imNord(x0 + 1, y0 + 1)) continue; const L = 4 + z() * 9, d = 0.6 + z() * 1.0; eis += `M${r(x0)} ${r(y0)} L${r(x0 + L)} ${r(y0 + L * (0.5 + z() * 0.3))} L${r(x0 + L - 0.8)} ${r(y0 + L * 0.65 + d)} L${r(x0 - 0.4)} ${r(y0 + d)} Z`; }
  for (let i = 0; i < 10; i++) { const x0 = 226 + z() * 22, y0 = 50 + z() * 40, L = 6 + z() * 10; fels += `M${r(x0)} ${r(y0)} L${r(x0 + 0.9)} ${r(y0 + 0.2)} L${r(x0 + L * 0.45 + 0.9)} ${r(y0 + L)} L${r(x0 + L * 0.45)} ${r(y0 + L)} Z`; }
  for (let i = 0; i < 14; i++) { const x0 = 224 + z() * 30, y0 = 50 + z() * 50, L = 3 + z() * 6; baender += `M${r(x0)} ${r(y0)} L${r(x0 + L)} ${r(y0 + L * 0.55)}`; }
  BERG += `<g clip-path="url(#${S.id("nord")})"><path d="${eis}" fill="#c3d0e2" opacity=".55"/><path d="${fels}" fill="#33405a" opacity=".55"/><path d="${baender}" stroke="#d6e0ee" stroke-width=".7" fill="none" opacity=".7"/>` +
    `<path d="M222 92 Q250 86 268 92 Q286 98 306 106 L306 112 L222 112 Z" fill="${S.lg("norddunst", [[0, "#c4d2e2", 0.2], [1, "#c4d2e2", 0.6]])}"/></g>`;
  /* Lichtkanten (innen, nur sonnenzugewandt): linke Silhouette oben, Hörnligrat; Gipfelschnee */
  BERG += `<g clip-path="url(#${S.id("ost")})"><path d="M${LINKS.slice(0, 14).map(pt).join(" L")}" stroke="#fff4e0" stroke-width="1.1" fill="none" opacity=".9"/><path d="M${HOERNLI.slice(0, 17).map(pt).join(" L")}" stroke="#ffeedd" stroke-width=".9" fill="none" opacity=".8"/></g>`;
  BERG += `<path d="M215.6 44.6 L216.9 43.1 L218.6 42.7 L220.6 43.1 L222.6 43.2 L223.6 43.9 L224.2 45.2 L221.6 44.9 L219.7 45.5 L217.6 44.9 Z" fill="#fdfdff"/>`;
  /* Schulter mit Schnee, Hörnlihütte (und Solvay-Biwak als Punkt) */
  BERG += `<path d="M220.5 48.4 L222.6 49.2 L224.2 49.9 L223.2 50.4 L221.0 49.6 Z" fill="#fbfcff"/>`;
  BERG += `<rect x="${HUETTE[0] - 1.3}" y="${HUETTE[1] - 1}" width="2.6" height="1.2" fill="#f2efe8"/><path d="M${HUETTE[0] - 1.5} ${HUETTE[1] - 1} L${HUETTE[0]} ${HUETTE[1] - 1.8} L${HUETTE[0] + 1.5} ${HUETTE[1] - 1} Z" fill="#5a5450"/><rect x="223.3" y="62.6" width=".7" height=".5" fill="#e8e2d6"/>`;
}

/* Die Fahnenwolke: setzt am Gipfel an (dicht, hell), franst nach links aus, Unterseite im Schatten */
let FAHNE = "";
{
  const z = zufall(9);
  let c = "", u = "";
  for (let i = 0; i < 12; i++) { const t = i / 11, x = 216.5 - t * 36, y = 43.6 + t * 1.6 + Math.sin(t * 6) * 0.8, rr = (2.6 - t * 1.2) * (0.8 + z() * 0.4); c += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(rr * 1.8)}" ry="${r(rr * 0.85)}" opacity="${r(1 - t * 0.75)}"/>`; u += `<ellipse cx="${r(x)}" cy="${r(y + rr * 0.45)}" rx="${r(rr * 1.6)}" ry="${r(rr * 0.4)}" opacity="${r(0.8 - t * 0.6)}"/>`; }
  FAHNE = `<g fill="#ffffff" filter="url(#${S.id("dunst")})">${c}</g><g fill="#aab4c8" filter="url(#${S.id("dunst")})" opacity=".55">${u}</g><g fill="#fffaf2" filter="url(#${S.id("weich")})" opacity=".7">${c.replace(/rx="([\d.]+)"/g, (m, v) => `rx="${r(v * 0.55)}"`).replace(/ry="([\d.]+)"/g, (m, v) => `ry="${r(v * 0.5)}"`)}</g>`;
}

/* =====================================================================
   MITTLERE BERGE — Hirli/Schwarzsee-Rücken mit Gletschern, blau verschleiert (7–9 km)
   ===================================================================== */
let MITTE = "";
{
  const rand = [[110, 112], [124, 106], [136, 103], [146, 101.6], [152, 100], [160, 99.6], [168, 98], [176, 97.2], [184, 95.6], [192, 94.4], [198, 92.8], [204, 91.6], [210, 90], [216, 88.6], [220, 89.4], [226, 91], [234, 93.6], [242, 96.6], [250, 99], [258, 100.6], [266, 103], [276, 105.6], [286, 108.6], [300, 114]];
  MITTE += `<path d="${pp([...rand, [300, 140], [110, 140]])}" fill="${S.lg("hirli", [[0, "#9a9a92"], [0.4, "#868a7a"], [1, "#6c7660"]])}"/>`;
  /* Lichtseite der Rippen links, Schatten rechts */
  let rp = "";
  const z2 = zufall(2889);
  for (let i = 0; i < 18; i++) { const x0 = 125 + i * 9 + z2() * 4, y0 = 101 + Math.abs(x0 - 216) * 0.08 + z2() * 3, L = 6 + z2() * 8, dx = x0 < 216 ? -0.5 : 0.5; rp += `M${r(x0)} ${r(y0)} L${r(x0 + 1)} ${r(y0)} L${r(x0 + L * dx + 1)} ${r(y0 + L)} L${r(x0 + L * dx)} ${r(y0 + L)} Z`; }
  MITTE += `<path d="${rp}" fill="#5f5e58" opacity=".3"/>`;
  /* Gletscher: Furgggletscher links, Matterhorngletscher rechts — blaugraue Zunge, Spalten, graue Moräne */
  const gl = (pts, spalten) => `<path d="${pp(pts)}" fill="${S.lg("gletscher", [[0, "#f2f5fa"], [0.7, "#d3dfec"], [1, "#a9bccf"]])}"/><path d="${spalten}" stroke="#8ea4bc" stroke-width=".35" fill="none"/>`;
  MITTE += gl([[226, 92.4], [238, 93.2], [250, 95.6], [262, 98.6], [276, 102.4], [270, 104.4], [258, 102.2], [244, 99.8], [232, 97.6]], "M236 95.2 Q240 96.4 238 97.8 M246 97 Q250 98.4 248 99.8 M256 99.4 Q259 100.6 258 101.8 M265 101 Q268 102 266 103");
  MITTE += gl([[160, 96.6], [172, 94.6], [184, 93.4], [196, 91.8], [206, 91.2], [204, 93.4], [194, 95.6], [180, 97.6], [166, 98.6]], "M172 95.6 Q170 96.8 172 97.6 M182 94.6 Q180 95.8 182 96.8 M192 93.4 Q190 94.6 192 95.4");
  MITTE += `<path d="M164 98.6 Q182 97.8 196 95.8 L206 93.6 L206 94.8 Q190 98 166 100 Z M232 97.8 Q252 101 270 104.6 L268 105.6 Q250 102.4 230 99 Z" fill="#7d7a72" opacity=".55"/>`;
  /* Luftperspektive: Sockel blauer und heller */
  MITTE += `<path d="${pp([...rand, [300, 140], [110, 140]])}" fill="${S.lg("hirlidunst", [[0, "#bccbe0", 0.5], [0.5, "#bccbe0", 0.3], [1, "#bccbe0", 0.12]])}"/>`;
}

/* =====================================================================
   WALDHÄNGE — Großform mit Kuppen, Rippen, Lawinenzügen; Waldgrenze; Textur mit Gradient; Lärchen in goldenen Gruppen
   ===================================================================== */
S.def(`<pattern id="${S.id("waldK")}" width="3.6" height="3" patternUnits="userSpaceOnUse"><path d="M.9 .2 L1.6 2.6 L.2 2.6 Z M2.8 1.2 L3.5 3.6 L2.1 3.6 Z" fill="#1d3226"/><path d="M.9 .2 L.2 2.6 L.9 2.6 Z" fill="#2e4a36" opacity=".9"/></pattern>`);
S.def(`<pattern id="${S.id("waldG")}" width="7" height="6" patternUnits="userSpaceOnUse"><path d="M1.6 .2 L3 5.2 L.2 5.2 Z M5.2 2.2 L6.6 7.2 L3.8 7.2 Z" fill="#1d3226"/><path d="M1.6 .2 L.2 5.2 L1.6 5.2 Z M5.2 2.2 L3.8 7.2 L5.2 7.2 Z" fill="#33503a" opacity=".9"/></pattern>`);
S.def(`<pattern id="${S.id("waldKs")}" width="3.6" height="3" patternUnits="userSpaceOnUse"><path d="M.9 .2 L1.6 2.6 L.2 2.6 Z M2.8 1.2 L3.5 3.6 L2.1 3.6 Z" fill="#2c4a2a"/><path d="M.9 .2 L.2 2.6 L.9 2.6 Z M2.8 1.2 L2.1 3.6 L2.8 3.6 Z" fill="#6e9446" opacity=".9"/></pattern>`);
S.def(`<pattern id="${S.id("waldGs")}" width="7" height="6" patternUnits="userSpaceOnUse"><path d="M1.6 .2 L3 5.2 L.2 5.2 Z M5.2 2.2 L6.6 7.2 L3.8 7.2 Z" fill="#2c4a2a"/><path d="M1.6 .2 L.2 5.2 L1.6 5.2 Z M5.2 2.2 L3.8 7.2 L5.2 7.2 Z" fill="#6e9446" opacity=".9"/></pattern>`);
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
/* goldene Lärchengruppen: kleine Kegel in Flecken */
function gruppe(cx, cy, w, h, n, seed, gr, licht) {
  const z = zufall(seed); let d = "", d2 = "";
  for (let i = 0; i < n; i++) { const x = cx + (z() - 0.5) * w, y = cy + (z() - 0.5) * h * (1 - Math.abs(x - cx) / w), g = gr * (0.8 + z() * 0.4); d += `M${r(x)} ${r(y - g)}L${r(x + g * 0.33)} ${r(y)}L${r(x - g * 0.33)} ${r(y)}Z`; d2 += `M${r(x)} ${r(y - g)}L${r(x + (licht ? -1 : 1) * g * 0.33)} ${r(y)}L${r(x)} ${r(y)}Z`; }
  return `<path d="${d}" fill="#c99a32"/><path d="${d2}" fill="#f2cc5c" opacity="${licht ? 0.9 : 0.45}"/>`;
}
let HANG_L = "", HANG_R = "", WALD_MITTE = "";
{
  /* Talschluss (Furi, Zmutt): fern, blau verschleiert */
  const mitte = [[140, 128], [152, 120], [162, 116], [172, 114], [182, 112.4], [192, 111], [202, 110.4], [212, 109.2], [222, 109], [232, 110], [242, 111.4], [252, 114], [262, 116.4], [272, 120], [282, 124], [282, 172], [140, 172]];
  WALD_MITTE = `<path d="${pp(mitte)}" fill="${S.lg("waldmitte", [[0, "#5f7652"], [1, "#3e5a38"]])}"/><path d="${pp(mitte)}" fill="url(#${S.id("waldK")})" opacity=".6"/>`;
  WALD_MITTE += gruppe(176, 120, 12, 4, 18, 31, 1.3, false) + gruppe(236, 118, 14, 4, 20, 32, 1.3, true) + gruppe(208, 128, 10, 5, 16, 33, 1.6, true);
  WALD_MITTE += `<path d="M170 122 Q186 118 198 121 Q190 126 172 126 Z M228 114.6 Q240 113 252 117 Q240 120 228 119 Z" fill="#a9b67a" opacity=".85"/>`;
  WALD_MITTE += `<path d="${pp(mitte)}" fill="${S.lg("waldmittedunst", [[0, "#c8d8e6", 0.55], [1, "#c8d8e6", 0.1]])}"/>`;
  /* linker Hang (Schatten): Kuppen und Kerben, oben über der Waldgrenze Fels und Alpweide */
  const L = [[-2, 40], [10, 44.6], [18, 47], [24, 52], [32, 55.4], [40, 58], [46, 62.6], [54, 66], [62, 67.4], [70, 72.4], [80, 76], [90, 79.2], [98, 83.8], [108, 86.6], [116, 89], [124, 93.6], [134, 97.2], [144, 100], [152, 103.6], [160, 107], [168, 110.6], [176, 115.6], [184, 122.4], [191, 133], [195, 175], [-2, 175]];
  HANG_L = `<path d="${pp(L)}" fill="${S.lg("hangL", [[0, "#5a6a5c"], [0.25, "#34493a"], [1, "#22362b"]])}"/>`;
  /* Waldgrenze: oben Alpweide/Fels (über ≈ 2200 m) */
  HANG_L += `<path d="M-2 40 L10 44.6 L18 47 L24 52 L32 55.4 L40 58 L46 62.6 L54 66 L62 67.4 L56 72 L44 70 L32 66 L20 62 L8 58 L-2 56 Z" fill="#6f7a66"/><path d="M14 50 L20 53 L18 57 Z M36 58 L42 61 L38 64 Z" fill="#8a8a84"/>`;
  HANG_L += `<path d="${pp(L)}" fill="url(#${S.id("waldK")})" clip-path="url(#${S.id("hangLunten")})"/>`;
  S.def(fern(`<clipPath id="${S.id("hangLunten")}"><path d="M-2 56 L8 58 L20 62 L32 66 L44 70 L56 72 L62 67.4 L70 72.4 L80 76 L90 79.2 L98 83.8 L108 86.6 L116 89 L124 93.6 L134 97.2 L144 100 L152 103.6 L160 107 L168 110.6 L176 115.6 L184 122.4 L191 133 L195 175 L-2 175 Z"/></clipPath>`));
  /* Lawinenzüge: hellere, waldfreie Schneisen */
  HANG_L += `<path d="M28 64 Q34 82 36 104 L42 104 Q40 82 34 64 Z M88 82 Q94 98 96 118 L100 118 Q98 98 93 82 Z" fill="#56664e" opacity=".9"/>`;
  HANG_L += gruppe(60, 96, 16, 8, 26, 51, 2.2, false) + gruppe(118, 110, 14, 6, 20, 52, 2.0, false) + gruppe(150, 124, 10, 6, 14, 53, 2.2, false);
  HANG_L += `<path d="${pp(L)}" fill="${S.lg("hangLdunst", [[0, "#9db4cc", 0.4], [0.6, "#9db4cc", 0.1], [1, "#9db4cc", 0]])}"/>`;
  /* rechter Hang (Sonne): Rippen hell, Rinnen dunkel, oben Alpweide und Fels */
  const R = [[402, 18], [388, 26], [380, 30.6], [372, 38], [362, 42.4], [352, 50.6], [344, 54], [336, 60.4], [326, 65.6], [318, 70.2], [308, 74.6], [300, 81.6], [292, 86], [284, 91.6], [276, 96.6], [268, 101], [261, 106.4], [254, 112.4], [246, 120], [240, 128], [236, 138], [234, 175], [402, 175]];
  HANG_R = `<path d="${pp(R)}" fill="${S.lg("hangR", [[0, "#b8b47a"], [0.25, "#7f9a52"], [0.6, "#6b8a44"], [1, "#4f6e38"]])}"/>`;
  HANG_R += `<path d="M402 18 L388 26 L380 30.6 L372 38 L362 42.4 L352 50.6 L344 54 L350 60 L364 54 L378 46 L392 40 L402 38 Z" fill="#c2bd84"/><path d="M380 34 L386 37 L382 40 Z M362 46 L368 49 L364 52 Z" fill="#a49a88"/>`;
  S.def(fern(`<clipPath id="${S.id("hangRunten")}"><path d="M402 38 L392 40 L378 46 L364 54 L350 60 L344 54 L336 60.4 L326 65.6 L318 70.2 L308 74.6 L300 81.6 L292 86 L284 91.6 L276 96.6 L268 101 L261 106.4 L254 112.4 L246 120 L240 128 L236 138 L234 175 L402 175 Z"/></clipPath>`));
  HANG_R += `<g clip-path="url(#${S.id("hangRunten")})"><path d="${pp(R)}" fill="url(#${S.id("waldKs")})" opacity=".85"/><path d="M300 110 L402 70 L402 175 L250 175 Z" fill="url(#${S.id("waldGs")})" opacity=".8"/></g>`;
  /* Rippen (Licht) und Rinnen (Schatten), Lawinenzug */
  HANG_R += `<path d="M370 50 Q356 80 344 112 L350 112 Q360 82 376 50 Z M320 74 Q306 100 296 128 L300 128 Q310 100 326 72 Z" fill="#e8d890" opacity=".35"/><path d="M356 54 Q342 84 330 116 L334 116 Q346 84 360 54 Z M300 84 Q290 104 282 126 L285 126 Q294 104 304 84 Z" fill="#2a3e26" opacity=".45"/>`;
  HANG_R += `<path d="M386 40 Q378 70 372 104 L378 104 Q384 70 392 40 Z" fill="#a6b06e" opacity=".9"/>`;
  HANG_R += gruppe(330, 92, 22, 10, 34, 71, 2.4, true) + gruppe(286, 112, 14, 6, 20, 72, 2.2, true) + gruppe(360, 70, 16, 8, 24, 73, 2.0, true) + gruppe(262, 130, 10, 6, 14, 74, 2.4, true);
  HANG_R += `<path d="${pp(R)}" fill="${S.lg("hangRdunst", [[0, "#cfe0ee", 0.35], [0.5, "#cfe0ee", 0.08], [1, "#cfe0ee", 0]])}"/>`;
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

S.def(`<pattern id="${S.id("bruch")}" width="5" height="3" patternUnits="userSpaceOnUse"><path d="M0 1.1 Q1.2 .8 2.4 1.2 L2.6 0 M2.4 1.2 Q3.6 1.5 5 1 M0 2.3 Q1 2.6 1.8 2.2 L1.6 1.1 M1.8 2.2 Q3 2 3.8 2.6 L3.9 1.4 M3.8 2.6 Q4.4 2.4 5 2.3 M2.8 3 L3 2.5" stroke="#6a655c" stroke-width=".22" fill="none"/></pattern>`);
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
    /* sonnenverbranntes Lärchenholz: Sonnenseite fast schwarzbraun, Schattenseite graubraun */
    g += `<path d="${poly3(f.pts)}" fill="${f.licht > 0.05 ? mix("#3e2414", "#fff1d6", Math.min(0.2, f.licht * 0.22)) : (o.hotel ? "#5e5246" : "#6a5c4e")}"/>`;
    /* Balkenfugen (waagrecht) im Holz */
    const s = F / f.m[1];
    let fugen = "";
    if (s > 5) for (let h = sockel + 0.38; h < (f.art === "giebel" ? hr : he) - 0.2; h += 0.38) {
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
    /* Vorstösse (Gwätt): an den Hausecken stehen die Balkenköpfe des Blockbaus vor */
    if (s > 3.2) {
      const a0 = f.pts[0], a1 = f.pts[1], lang = Math.hypot(a1[0] - a0[0], a1[1] - a0[1]), u = [(a1[0] - a0[0]) / lang, (a1[1] - a0[1]) / lang];
      let kp = "";
      for (const [ec, sg] of [[a0, -1], [a1, 1]]) for (let hh = sockel + 0.05; hh < he - 0.3; hh += 0.38) {
        const A = [ec[0] + u[0] * sg * 0.32, ec[1] + u[1] * sg * 0.32], q = [proj([ec[0], ec[1], hh]), proj([A[0], A[1], hh]), proj([A[0], A[1], hh + 0.3]), proj([ec[0], ec[1], hh + 0.3])];
        kp += "M" + q.map(pt).join(" L") + " Z";
      }
      g += `<path d="${kp}" fill="${f.licht > 0.05 ? "#5a3820" : "#4a4036"}" stroke="#20140a" stroke-width="${r(Math.max(0.1, 0.02 * s))}"/>`;
    }
    /* Untersicht des Dachvorsprungs über der Traufseite: dunkles Band mit Sparrenköpfen */
    if (f.art === "seite" && s > 2.5) {
      const ov2 = 0.9, n2 = f.n, top = f.pts.filter((p) => p[2] > he - 0.01);
      if (top.length === 2) {
        const [A, Bq] = top, aus = (p) => [p[0] + n2[0] * ov2, p[1] + n2[1] * ov2, p[2] - 0.45];
        g += `<path d="${poly3([A, Bq, aus(Bq), aus(A)])}" fill="#22160c"/>`;
        let sp = "";
        const L2 = Math.hypot(Bq[0] - A[0], Bq[1] - A[1]);
        for (let t2 = 0.4; t2 < L2; t2 += 0.9) { const c = [A[0] + (Bq[0] - A[0]) * t2 / L2 + n2[0] * ov2, A[1] + (Bq[1] - A[1]) * t2 / L2 + n2[1] * ov2, he - 0.45], [x, y] = proj(c); sp += `M${r(x)} ${r(y)}v${r(Math.max(0.3, 0.14 * F / c[1]))}`; }
        g += `<path d="${sp}" stroke="#8a6a4a" stroke-width="${r(Math.max(0.2, 0.1 * s))}"/>`;
        g += `<path d="M${pt(proj(aus(A)))} L${pt(proj(aus(Bq)))}" stroke="#8d8b86" stroke-width="${r(Math.max(0.4, 0.14 * s))}" stroke-dasharray="${r(0.5 * s)} ${r(0.06 * s)}"/>`;
      }
    }
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
      if (F / d[0][1] > 3) for (let i = 1; i < 7; i++) { const tt = i / 7, a = d[0].map((v, j) => v + (d[1][j] - v) * tt), b = d[3].map((v, j) => v + (d[2][j] - v) * tt); const q = strecke(proj(a), proj(b)); if (q) reihen += `M${pt(q[0])} L${pt(q[1])}`; }
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
  if (s < 3.4) return "";
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
    const holz = h > o.sockel - 0.2, tuer = holz && f.art === "giebel" && o.balkon, uc = lang * (i + 0.5) / nf, fw = holz ? (tuer ? 0.5 : 0.45) : 0.6, fh = tuer ? 2.0 : holz ? 1.15 : 1.4;
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
      let latten = "", ausschnitt = "";
      const nl = Math.max(4, Math.round((u1 - u0) / 0.22));
      if (s > 7) for (let i = 1; i < nl; i++) { const uu = u0 + (u1 - u0) * i / nl; latten += `M${pt(Qv(uu, hb2 + 1.0, aus))} L${pt(Qv(uu, hb2 + 0.05, aus))}`; const [cx, cy] = Qv(uu - (u1 - u0) / nl / 2, hb2 + 0.55, aus); ausschnitt += `<ellipse cx="${r(cx)}" cy="${r(cy)}" rx="${r(0.045 * s)}" ry="${r(0.11 * s)}"/>`; }
      /* Schatten des Balkons auf der Wand darunter */
      g += `<path d="${pz([Q(u0 - 0.2, hb2), Q(u1 + 0.2, hb2), Q(u1 + 0.2, hb2 - 0.7), Q(u0 - 0.2, hb2 - 0.7)])}" fill="#140a04" opacity=".35"/>`;
      let blumen = "", blaetter = "";
      const nb = Math.max(4, Math.round((u1 - u0) / (s > 8 ? 0.3 : 0.6)));
      const z = zufall(Math.round(h * 100 + o.D0));
      for (let i = 0; i < nb; i++) {
        const uu = u0 + (u1 - u0) * (i + 0.5) / nb, [x, y] = Qv(uu, hb2 + 1.12, aus + 0.08), rr = Math.max(0.3, 0.17 * s);
        /* Hängegeranien: Polster fällt über das Brett, unregelmäßiger Rand */
        const hang = rr * (1.2 + z() * 1.6);
        blaetter += `<path d="M${r(x - rr * 1.1)} ${r(y)} Q${r(x - rr * 1.2)} ${r(y + hang)} ${r(x - rr * 0.3)} ${r(y + hang * 1.1)} Q${r(x + rr * 0.2)} ${r(y + hang * 0.7)} ${r(x + rr * 0.6)} ${r(y + hang * 0.95)} Q${r(x + rr * 1.2)} ${r(y + hang * 0.6)} ${r(x + rr * 1.1)} ${r(y)} Z"/>`;
        for (let j = 0; j < (s > 8 ? 4 : 1); j++) blumen += `<circle cx="${r(x + (z() - 0.5) * rr * 1.8)}" cy="${r(y + (z() * 1.1 - 0.4) * hang)}" r="${r(rr * (0.28 + z() * 0.2))}"/>`;
      }
      const bal = `<path d="${pz(unterseite)}" fill="#2a1a10"/><path d="${pz(br)}" fill="${tönen("#7a5030", f.licht + 0.1)}"/><path d="${latten}" stroke="#3a2414" stroke-width="${r(Math.max(0.12, 0.035 * s))}"/>${ausschnitt ? `<g fill="#1e120a">${ausschnitt}</g>` : ""}<path d="${pz([Qv(u0, hb2 + 1.0, aus + 0.02), Qv(u1, hb2 + 1.0, aus + 0.02), Qv(u1, hb2 + 1.12, aus + 0.12), Qv(u0, hb2 + 1.12, aus + 0.12)])}" fill="#6a4426"/><g fill="#3f6a2c">${blaetter}</g><g fill="#d8202e">${blumen}</g>${s > 8 ? `<g fill="#ff6a6a" opacity=".6">${blumen.replace(/r="([\d.]+)"/g, (m, v) => `r="${r(v * 0.45)}"`)}</g>` : ""}`;
      g += bal;
      BALKONE.push({ o, h: hb2, s, Qv, u0, u1, aus });
    }
  }
  return g;
}

/* Stadel: Steinsockel, Stützen mit runden Steinplatten, Blockbau, Steinplattendach (Giebel zu uns) */
function stadel(o) {
  const { X0, X1, D0, D1, h0 } = o, Xm = (X0 + X1) / 2, Dm = (D0 + D1) / 2;
  const hs = h0 + 1.3, hp = hs + 0.75, hk = hp + 0.14, he = hk + 2.8, hr = he + 1.8;
  let g = "";
  const zentrum = [Xm, Dm, hs / 2];
  /* Sockel (Bruchstein) */
  const sockel = [[[X0, D0, h0], [X1, D0, h0], [X1, D0, hs], [X0, D0, hs]], [[X0 < 0 ? X1 : X0, D0, h0], [X0 < 0 ? X1 : X0, D1, h0], [X0 < 0 ? X1 : X0, D1, hs], [X0 < 0 ? X1 : X0, D0, hs]]];
  for (const p of sockel) {
    const f = flaecheInfo(p, zentrum); if (!f.sicht) continue;
    g += `<path d="${poly3(p)}" fill="${tönen("#9a958c", f.licht)}"/>`;
    const zz = zufall(Math.round(D0 * 10)); let fu = "";
    for (let h = h0 + 0.3; h < hs; h += 0.35) { const a = p[0], b = p[1]; for (let t = zz() * 0.2; t < 1; t += 0.18 + zz() * 0.12) { const t2 = Math.min(1, t + 0.12 + zz() * 0.1); const A = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, h], Bq = [a[0] + (b[0] - a[0]) * t2, a[1] + (b[1] - a[1]) * t2, h + (zz() - 0.5) * 0.05]; fu += `M${pt(proj(A))} L${pt(proj(Bq))} M${pt(proj(Bq))} L${pt(proj([Bq[0], Bq[1], h + 0.33]))}`; } }
    g += `<path d="${fu}" stroke="#5e5a54" stroke-width=".3" opacity=".6"/>`;
  }
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
    /* dicke runde Steinplatte (≈ 10 cm) mit Kante, darunter dunkler Spalt */
    platten += `<ellipse cx="${r(b[0] + 0.05 * ss)}" cy="${r(b[1] + 0.12 * ss)}" rx="${r(0.3 * ss)}" ry="${r(0.06 * ss)}" fill="#1a1008" opacity=".55"/><path d="M${r(b[0] - 0.46 * ss)} ${r(b[1] - 0.05 * ss)} L${r(b[0] - 0.46 * ss)} ${r(b[1] + 0.06 * ss)} A${r(0.46 * ss)} ${r(0.09 * ss)} 0 0 0 ${r(b[0] + 0.46 * ss)} ${r(b[1] + 0.06 * ss)} L${r(b[0] + 0.46 * ss)} ${r(b[1] - 0.05 * ss)} Z" fill="#7d786f"/><ellipse cx="${r(b[0])}" cy="${r(b[1] - 0.05 * ss)}" rx="${r(0.46 * ss)}" ry="${r(0.09 * ss)}" fill="#bdb7ab"/>`;
  }
  g += stuetzen + platten;
  /* Blockbau (Lärche, fast schwarz gebrannt) */
  const k0 = [[X0 - 0.15, D0 - 0.15, hk], [X1 + 0.15, D0 - 0.15, hk], [X1 + 0.15, D0 - 0.15, he], [Xm, D0 - 0.15, hr], [X0 - 0.15, D0 - 0.15, he]];
  const ks = X0 < 0 ? X1 + 0.15 : X0 - 0.15;
  const k1 = [[ks, D0 - 0.15, hk], [ks, D1 + 0.15, hk], [ks, D1 + 0.15, he], [ks, D0 - 0.15, he]];
  for (const p of [k1, k0]) {
    const f = flaecheInfo(p, [Xm, Dm, (hk + he) / 2]);
    if (!f.sicht) continue;
    g += `<path d="${poly3(p)}" fill="${f.licht > 0.05 ? "#2e1c10" : "#4a4036"}"/>`;
    /* Vorstösse an den Ecken */
    { const a0 = p[0], a1 = p[1], L2 = Math.hypot(a1[0] - a0[0], a1[1] - a0[1]), u = [(a1[0] - a0[0]) / L2, (a1[1] - a0[1]) / L2]; let kp = "";
      for (const [ec, sg] of [[a0, -1], [a1, 1]]) for (let hh = hk + 0.05; hh < he - 0.2; hh += 0.28) { const A = [ec[0] + u[0] * sg * 0.25, ec[1] + u[1] * sg * 0.25]; kp += "M" + [proj([ec[0], ec[1], hh]), proj([A[0], A[1], hh]), proj([A[0], A[1], hh + 0.22]), proj([ec[0], ec[1], hh + 0.22])].map(pt).join(" L") + " Z"; }
      g += `<path d="${kp}" fill="#3a2414" stroke="#120a04" stroke-width=".15"/>`; }
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
  if (fd.sicht) g += `<path d="${poly3(dachS)}" fill="${tönen("#9a9892", fd.licht)}"/>`;
  const st = [[X0 - ov, D0 - ov, he - ov * t], [Xm, D0 - ov, hr], [X1 + ov, D0 - ov, he - ov * t]];
  g += `<path d="M${st.map(proj).map(pt).join(" L")}" stroke="#8d8b86" stroke-width="${r(0.28 * s)}" fill="none" stroke-linejoin="round" stroke-dasharray="${r(0.45 * s)} ${r(0.05 * s)}"/>`;
  return { g, posten, hp, s };
}

/* Lärche: gerader, durchgehender Stamm, kurze waagrechte Äste mit leicht aufgebogenen Spitzen, Nadeln als weiche Büschel (Tupfen) — licht, mit Himmelslöchern; Sonne von links */
function laerche(X, D, h, seed, gold) {
  const z = zufall(seed), [bx, by] = P(X, D, hb(D)), s = F / D, H = h * s, W = h * 0.2 * s;
  let g = `<path d="M${r(bx - 0.16 * s)} ${r(by)} L${r(bx - 0.03 * s)} ${r(by - H)} L${r(bx + 0.03 * s)} ${r(by - H)} L${r(bx + 0.16 * s)} ${r(by)} Z" fill="${S.lg("stammL", [[0, "#9a7a58"], [0.4, "#6a4a30"], [1, "#3a281a"]], 0, 0, 1, 0)}"/>`;
  let aeste = "";
  const tupf = [[], [], []];
  const etagen = Math.round(h * 1.5);
  for (let i = 0; i < etagen; i++) {
    const t = i / (etagen - 1), y = by - H * (0.2 + t * 0.78);
    for (const sg of [-1, 1]) {
      if (z() < 0.12) continue;
      const w = (W * Math.pow(1 - t, 0.8) * (0.55 + z() * 0.6) + 0.15 * s), xe = bx + sg * w, ye = y + (z() - 0.3) * 0.25 * s;
      aeste += `M${r(bx)} ${r(y)} Q${r(bx + sg * w * 0.6)} ${r(y + 0.15 * s)} ${r(xe)} ${r(ye - 0.15 * s)}`;
      const n = 3 + Math.floor(w / s * 3.5);
      for (let j = 0; j < n; j++) {
        const u = (j + 0.5) / n, x = bx + sg * w * u + (z() - 0.5) * 0.25 * s, yy = y + 0.12 * s * Math.sin(u * 3) - u * 0.12 * s + (z() - 0.5) * 0.4 * s;
        const k = sg < 0 ? (z() < 0.6 ? 2 : 1) : (z() < 0.6 ? 0 : 1);
        tupf[k].push(`M${r(x)} ${r(yy)}h${r(0.18 * s * (0.6 + z()))}`);
      }
    }
  }
  const f = gold ? ["#a06c1c", "#d8a232", "#f6d266"] : ["#6f8a34", "#a8b84a", "#d8c45a"];
  const dw = r(Math.max(0.7, 0.3 * s));
  g += `<path d="${aeste}" stroke="#5a4028" stroke-width="${r(Math.max(0.15, 0.04 * s))}" fill="none"/>`;
  tupf.forEach((t, i) => { g += `<path d="${t.join("")}" stroke="${f[i]}" stroke-width="${dw}" stroke-linecap="round" fill="none"/>`; });
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
  S.teil({ id: "matterhorn", de: "das Matterhorn", syl: "MAT-ter-horn", it: "il Cervino", itSyl: "cer-VI-no", en: "Matterhorn", anker: g0, kunst: fern(BERG + MITTE),
    tipp: "Das Matterhorn ist der bekannteste Berg der Schweiz (4478 m). Der Berg steht an der Grenze zu Italien. An seinem Fuß liegen Gletscher.",
    zoom: { x: r(z0[0]), y: r(z0[1]), w: r(105 * KF), h: r(70 * KF) }, unter });
}
/* 2 — DIE WOLKE (Fahnenwolke) */
S.teil({ oben: true, id: "wolke", de: "die Wolke", syl: "WOL-ke", it: "la nuvola", itSyl: "NU-vo-la", en: "cloud", anker: T(196, 47), kunst: fern(FAHNE),
  tipp: "Der Wind bildet am Gipfel oft eine Wolke wie eine Fahne: die Fahnenwolke." });
/* Kulisse für Wald (fern) und Hänge: gehören zur Lärche/zum Wald? — die Hänge sind Kulisse über den Teilen davor nicht nötig:
   sie liegen vor dem Matterhorn und werden deshalb als Teil „der Wald“ gezeichnet */
S.teil({ id: "wald", de: "der Wald", syl: "WALD", it: "il bosco", itSyl: "BO-sco", en: "forest", anker: T(330, 120), kunst: fern(WALD_MITTE + HANG_L + HANG_R),
  tipp: "Im Wald wachsen Lärchen und Arven. Im Herbst werden die Lärchen golden." });

/* =====================================================================
   DAS DORF — Häuser von hinten nach vorn
   ===================================================================== */
const HAEUSER = [
  /* fern (Talboden 120–300 m): kleine Chalets */
  ...[[-18, 240, 9], [16, 235, 9], [-20, 195, 10], [16, 190, 9], [30, 170, 11], [-16, 150, 10], [13, 140, 9], [-26, 125, 12]].map(([X, D, h], i) => ({ X0: X < 0 ? X - 9 : X, X1: X < 0 ? X : X + 9, D0: D, D1: D + 10, he: h, first: i % 2 ? "X" : "D", fern: true })),
  { X0: -26, X1: -13, D0: 96, D1: 108, he: 13, first: "D", balkon: true },
  { X0: 13, X1: 24, D0: 104, D1: 114, he: 11, first: "X" },
  { X0: -24, X1: -12.5, D0: 74, D1: 86, he: 12.5, first: "D", balkon: true, kamin: [-20, 80] },
  { X0: 14, X1: 26, D0: 84, D1: 96, he: 12, first: "D", balkon: true },
  { X0: -24, X1: -13.5, D0: 54, D1: 66, he: 13.5, first: "D", balkon: true, kamin: [-20, 60] },
  { X0: -25, X1: -12.5, D0: 34, D1: 46, he: 13.6, first: "D", balkon: true, kamin: [-21, 40], hotel: true },
  { X0: 12.5, X1: 23, D0: 38, D1: 49, he: 11.2, first: "D", balkon: true, chaletWort: true },
];
let DORF_FERN = "", CHALET_WORT = null, DORF_NAH = [], HOTEL = null;
for (const h of HAEUSER.sort((a, b) => b.D0 - a.D0)) {
  const h0 = hb(h.D0), he = h0 + h.he, hr = he + (h.first === "D" ? (h.X1 - h.X0) * 0.3 : (h.D1 - h.D0) * 0.3);
  const c = chalet({ ...h, h0, he, hr, sockel: h0 + (h.hotel ? 5.6 : 3.0), holz: h.hotel ? "#5e3c24" : ["#6a4429", "#5a3820", "#74492a"][Math.round(h.D0) % 3] });
  if (h.fern) DORF_FERN += c.g;
  else if (h.chaletWort) CHALET_WORT = { c, h };
  else if (h.hotel) HOTEL = { c, h };
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

/* =====================================================================
   SCHLAGSCHATTEN (Sonne links, 35° hoch): Häuser links werfen ihre Schatten über Uferweg, Fluss und das rechte Ufer;
   Lärchen und Stadel werfen lange, schmale Schatten nach rechts
   ===================================================================== */
function huelle(p) { p = p.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]); const k = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]); const lo = [], hi = []; for (const q of p) { while (lo.length >= 2 && k(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); } for (const q of p.slice().reverse()) { while (hi.length >= 2 && k(hi[hi.length - 2], hi[hi.length - 1], q) <= 0) hi.pop(); hi.push(q); } return lo.slice(0, -1).concat(hi.slice(0, -1)); }
function clipX(poly, x0, x1) {
  let out = poly;
  for (const [innen, grenze] of [[(q) => q[0] >= x0, x0], [(q) => q[0] <= x1, x1]]) { const inp = out; out = []; for (let i = 0; i < inp.length; i++) { const a = inp[(i + inp.length - 1) % inp.length], b = inp[i], sch = () => [grenze, a[1] + (b[1] - a[1]) * (grenze - a[0]) / (b[0] - a[0])]; if (innen(b)) { if (!innen(a)) out.push(sch()); out.push(b); } else if (innen(a)) out.push(sch()); } if (!out.length) break; }
  return out;
}
const wurf3 = (pts3, hp) => huelle(pts3.map(([X, D, h]) => [X + 1.416 * (h - hp), D + 0.174 * (h - hp)]));
let SCHATTEN_BODEN = "", SCHATTEN_WASSER = "", RAND_GELAENDER = "";
{
  let boden = "", wasser = "";
  for (const h of HAEUSER) {
    if (h.fern || h.X1 > 0) continue;
    const h0 = hb(h.D0), he = h0 + h.he, hr = he + (h.X1 - h.X0) * 0.3, Xm = (h.X0 + h.X1) / 2;
    const pts = [[h.X0, h.D0, h0], [h.X1, h.D0, h0], [h.X0, h.D1, h0], [h.X1, h.D1, h0], [h.X1 + 0.9, h.D0 - 0.9, he - 0.4], [h.X1 + 0.9, h.D1 + 0.9, he - 0.4], [Xm, h.D0 - 0.9, hr], [Xm, h.D1 + 0.9, hr]];
    for (const [x0, x1, planeAdd, ziel] of [[-30, -UFER, 0, "b"], [UFER, 30, 0, "b"], [-UFER + 0.9, UFER - 0.9, -4.2, "w"]]) {
      const hp = h0 + planeAdd, poly = clipX(wurf3(pts, hp), x0, x1);
      if (poly.length > 2) { const d = pz(poly.map(([X, D]) => P(X, D, hp + 0.02))); if (ziel === "b") boden += d; else wasser += d; }
    }
  }
  for (const [X, D, hh] of LAERCHEN) { const h0 = hb(D), L = 1.416 * hh, w = 1.2; boden += pz([P(X, D - 0.3, h0), P(X + L * 0.5, D + 0.174 * hh * 0.5 - w, h0), P(X + L, D + 0.174 * hh, h0), P(X + L * 0.5, D + 0.174 * hh * 0.5 + w, h0), P(X, D + 0.3, h0)]); }
  for (const st of STADEL) { const h0 = hb(st.D0), top = 6.5; boden += pz(wurf3([[st.X0, st.D0, h0], [st.X1, st.D0, h0], [st.X0, st.D1, h0], [st.X1, st.D1, h0], [st.X0, st.D0, h0 + top - 1.8], [st.X1, st.D1, h0 + top - 1.8], [(st.X0 + st.X1) / 2, st.D0, h0 + top], [(st.X0 + st.X1) / 2, st.D1, h0 + top]], h0).map(([X, D]) => P(X, D, h0))); }
  SCHATTEN_BODEN = `<path d="${boden}" fill="#1e2a48" opacity=".28"/>`;
  SCHATTEN_WASSER = `<path d="${wasser}" fill="#22364a" opacity=".2" filter="url(#${S.id("weich")})"/>`;
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
  /* Bruchsteinmauer: Lagen ungleich hoch, Stoßfugen versetzt, einzelne Steine heller/dunkler; unten nasser Streifen, Moos in den Fugen */
  const z = zufall(31);
  let fugen = "", hell = "", dunkel = "", moos = "";
  for (const sg of [-1, 1]) {
    const Xw = (f) => sg * (UFER - 0.9 * (1 - f));
    let f = 0.04;
    while (f < 0.98) {
      const df = (0.08 + z() * 0.07);
      let D = 9 + z() * 0.6;
      while (D < 46) {
        const L = (0.5 + z() * 0.9) * (D > 30 ? 1.6 : 1), f1 = Math.min(0.99, f + df);
        const q = [P(Xw(f), D, hw(D) + f * 4.2), P(Xw(f), D + L, hw(D + L) + f * 4.2), P(Xw(f1), D + L, hw(D + L) + f1 * 4.2), P(Xw(f1), D, hw(D) + f1 * 4.2)];
        if (q[0][1] < 262) { const d = "M" + q.map(pt).join(" L") + " Z"; fugen += d; const w = z(); if (w < 0.18) hell += d; else if (w < 0.34) dunkel += d; if (z() < 0.05 && D < 30) moos += `M${pt(q[3])} L${r(Math.min(400, q[3][0] + 0.3 * F / D))} ${r(q[3][1])}`; }
        D += L;
      }
      f += df;
    }
  }
  k += `<path d="${hell}" fill="#fff" opacity=".12"/><path d="${dunkel}" fill="#2a2620" opacity=".14"/><path d="${fugen}" fill="none" stroke="#3a3632" stroke-width=".35" opacity=".55"/><path d="${moos}" stroke="#5d7a3a" stroke-width="1" stroke-linecap="round"/>`;
  /* nasser Streifen am Wasser */
  { const nl = [], nr = []; for (const D of Ds) { nl.push(P(-UFER + 0.9 - 0.12, D, hw(D) + 0.5)); nr.push(P(UFER - 0.9 + 0.12, D, hw(D) + 0.5)); }
    k += `<path d="${pz([...Lw, ...nl.slice().reverse()])} ${pz([...Rw, ...nr.slice().reverse()])}" fill="#2a3230" opacity=".35"/>`; }
  k += `<path d="M${Lm.map(pt).join(" L")} M${Rm.map(pt).join(" L")}" stroke="#e6e1d8" stroke-width="1.1" fill="none"/>`;
  /* Wasser: milchig grau-türkis (Gletschermilch), wenig Wasser im Herbst */
  const wasser = pz([...Lw, ...Rw.slice().reverse()]);
  k += `<path d="${wasser}" fill="${S.lg("vispa", [[0, "#d6e2dc"], [0.35, "#b6cac2"], [0.7, "#9eb7ae"], [1, "#8aa79e"]], 0, 0, 0, 1, ` gradientUnits="userSpaceOnUse" x1="0" y1="${HOR}" x2="0" y2="262"`)}"/>`;
  /* Kiesbänke: organische Linsen und Zungen (weiche Ränder, nicht im Raster); das Wasser fließt in 2–3 gewundenen Rinnen dazwischen */
  const WL = UFER - 0.9;
  const kiesL = [[-WL, 9], [-WL, 34], [-WL, 62], [-WL, 96], [-5.2, 92], [-4.7, 72], [-3.4, 55], [-3.9, 40], [-2.6, 26], [-3.3, 16], [-4.6, 9]];
  const kiesR = [[WL, 9], [WL, 22], [WL, 44], [5.6, 42], [4.6, 30], [3.7, 19], [4.4, 9]];
  const kiesR2 = [[WL, 58], [WL, 84], [WL, 118], [5.5, 112], [4.2, 92], [3.6, 76], [4.8, 63]];
  const insel = [[0.2, 21], [1.3, 26], [1.9, 37], [1.4, 50], [0.5, 56], [-0.4, 46], [-0.6, 33]];
  const insel2 = [[0.9, 66], [2.0, 78], [1.6, 100], [0.4, 110], [-0.5, 92], [-0.3, 76]];
  const BAENKE = [kiesL, kiesR, kiesR2, insel, insel2];
  const bankD = (pts) => rund(pts.map(([X, D]) => P(X, D, hw(D) + 0.05)));
  const kies = BAENKE.map(bankD).join("");
  /* dunklerer Wasserrand an den Bänken (das Wasser wird dort flach und grau), dann die Bank selbst */
  k += `<path d="${kies}" fill="none" stroke="#8aa29a" stroke-width="2.2" stroke-linejoin="round"/><path d="${kies}" fill="${S.lg("kies", [[0, "#d2cdc0"], [1, "#aca698"]], 0, 0, 0, 1)}"/>`;
  /* Glanz zur Mitte der Rinnen: lange, weich geschwungene helle Bahnen */
  const rinnen = [[[-1.8, 10], [-1.3, 18], [-1.7, 28], [-2.1, 40], [-1.8, 52], [-1.6, 66], [-2.2, 84], [-2.6, 104], [-1.2, 130]],
    [[2.6, 10], [2.9, 18], [3.0, 30], [2.6, 46], [2.6, 62], [2.7, 80], [2.5, 104], [1.2, 130]]];
  let glanz = "";
  for (const rn of rinnen) glanz += "M" + rn.map(([X, D]) => pt(P(X, D, hw(D)))).join(" L");
  k += `<path d="${glanz}" stroke="#eef6f2" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round" fill="none" opacity=".35"/><path d="${glanz}" stroke="#fbfefc" stroke-width=".7" stroke-linejoin="round" fill="none" opacity=".5"/>`;
  /* runde graue Steine in drei Größen: vorn größer; auf den Bänken dicht, im Wasser vereinzelt */
  const drin = (pts, X, D) => { let c = false; for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) { const [xi, yi] = pts[i], [xj, yj] = pts[j]; if ((yi > D) !== (yj > D) && X < (xj - xi) * (D - yi) / (yj - yi) + xi) c = !c; } return c; };
  const imKies = (X, D) => BAENKE.some((b) => drin(b, X, D));
  const stein = [[], [], []], sLicht = [];
  for (let i = 0; i < 300; i++) {
    const D = 9 + Math.pow(z(), 1.6) * 100, X = (z() * 2 - 1) * WL; if (!imKies(X, D)) continue;
    const [x, y] = P(X, D, hw(D)), gr = (0.1 + z() * 0.25) * F / D, kl = gr < 0.9 ? 0 : gr < 1.8 ? 1 : 2;
    stein[kl].push(`M${r(x)} ${r(y)}h${r(Math.max(0.1, gr * 0.35))}`);
    if (kl === 2) sLicht.push(`M${r(x - gr * 0.12)} ${r(y - gr * 0.16)}h${r(gr * 0.15)}`);
  }
  [[0.8, "#8e8a82"], [1.5, "#7f7c75"], [2.6, "#77736c"]].forEach(([w, c], i) => { k += `<path d="${stein[i].join("")}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" fill="none"/>`; });
  k += `<path d="${sLicht.join("")}" stroke="#d8d3c8" stroke-width=".9" stroke-linecap="round" fill="none"/>`;
  k += SCHATTEN_WASSER;
  /* Geländer der Uferwege auf den Mauerkronen */
  { let st = "", ho = ""; for (const sg of [-1, 1]) { const top = []; for (let D = 10; D <= 120; D += D < 30 ? 2 : 4) { const a2 = P(sg * UFER, D, hb(D)), b2 = P(sg * UFER, D, hb(D) + 1.0); st += `M${pt(a2)} L${pt(b2)}`; top.push(b2); } ho += "M" + top.map(pt).join(" L"); }
    RAND_GELAENDER = `<path d="${st}" stroke="#2a2e30" stroke-width=".55"/><path d="${ho}" stroke="#3a3e40" stroke-width=".8" fill="none"/>`; }
  /* Schatten der linken Mauer auf Wasser und Kies (Sonne von links) */
  const schattenW = [];
  for (const D of Ds) schattenW.push(P(-UFER + 0.9 + 1.7, D, hw(D)));
  k += `<path d="${pz([...Lw, ...schattenW.slice().reverse()])}" fill="#2a3a48" opacity=".32"/>`;
  /* einzelne große Steine in den Rinnen: Schaumkragen auf der Oberstromseite (von uns weg), dahinter kurze, unregelmäßige Wirbel */
  let steine = "", steinLicht = "", schaum = "", kiel = "", wellen = "";
  for (let i = 0; i < 22; i++) {
    const D = 10 + Math.pow(z(), 1.3) * 70, X = (z() * 2 - 1) * (WL - 0.5); if (imKies(X, D)) continue;
    const [x, y] = P(X, D, hw(D)), s2 = F / D, rr = (0.18 + z() * 0.24) * s2;
    steine += `M${r(x - rr)} ${r(y)} Q${r(x - rr)} ${r(y - rr * 0.7)} ${r(x)} ${r(y - rr * 0.75)} Q${r(x + rr)} ${r(y - rr * 0.7)} ${r(x + rr)} ${r(y)} Q${r(x)} ${r(y + rr * 0.2)} ${r(x - rr)} ${r(y)} Z`;
    steinLicht += `M${r(x - rr * 0.85)} ${r(y - rr * 0.1)} Q${r(x - rr * 0.8)} ${r(y - rr * 0.6)} ${r(x - rr * 0.1)} ${r(y - rr * 0.68)} Q${r(x - rr * 0.45)} ${r(y - rr * 0.35)} ${r(x - rr * 0.85)} ${r(y - rr * 0.1)} Z`;
    schaum += `M${r(x - rr * 1.2)} ${r(y - rr * 0.3)} Q${r(x - rr * 0.2)} ${r(y - rr * (1.1 + z() * 0.4))} ${r(x + rr * 1.15)} ${r(y - rr * 0.35)} Q${r(x)} ${r(y - rr * 0.8)} ${r(x - rr * 1.2)} ${r(y - rr * 0.3)} Z`;
    for (const sg of [-1, 1]) if (z() < 0.8) { const L = rr * (0.8 + z() * 1.0); kiel += `M${r(x + sg * rr * 0.8)} ${r(y + rr * 0.1)} q${r(sg * L * 0.3)} ${r(L * 0.5)} ${r(sg * L * (0.5 + z() * 0.4))} ${r(L * (0.6 + z() * 0.3))}`; }
  }
  for (let i = 0; i < 26; i++) { const D = 10 + Math.pow(z(), 1.4) * 100, X = (z() * 2 - 1) * (WL - 0.5); if (imKies(X, D)) continue; const [x, y] = P(X, D, hw(D)), L = (0.5 + z() * 1.1) * F / D; wellen += `M${r(x - L / 2)} ${r(y)} q${r(L * (0.4 + z() * 0.2))} ${r(-0.2 * F / D)} ${r(L)} ${r((z() - 0.5) * 0.1 * F / D)}`; }
  k += `<path d="${wellen}" stroke="#f4f8f6" stroke-width=".5" fill="none" opacity=".6"/><path d="${kiel}" stroke="#eef5f2" stroke-width=".45" stroke-linecap="round" fill="none" opacity=".6"/><path d="${schaum}" fill="#fbfdfc"/><path d="${steine}" fill="#8f8c86"/><path d="${steinLicht}" fill="#d6d2c8"/>`;
  k += RAND_GELAENDER;
  S.teil({ id: "fluss", de: "der Fluss", syl: "FLUSS", it: "il fiume", itSyl: "FIU-me", en: "river", anker: [200, 240], kunst: k,
    tipp: "Die Matter Vispa kommt aus den Gletschern. Darum ist ihr Wasser milchig und kalt. Im Herbst führt sie wenig Wasser." });
}

/* 7 — die Häuser im Dorf (nah), Stadel und Lärchen */
const STADEL_DATA = [];
{
  const items = [...DORF_NAH];
  for (const s of STADEL) { const st = stadel({ ...s, h0: hb(s.D0) }); STADEL_DATA.push(st); items.push({ D: s.D0, g: st.g, stadel: STADEL_DATA.length - 1 }); }
  items.sort((a, b) => b.D - a.D);
  /* die nahen Häuser gehören zum Dorf (Wort), die Stadel sind ein eigenes Wort */
  let haus = "";
  for (const it of items) if (it.stadel === undefined) haus += it.g;
  S.teil({ id: "dorf", de: "das Dorf", syl: "DORF", it: "il villaggio", itSyl: "vil-LAG-gio", en: "village", anker: [200, 168], kunst: BODEN + SCHATTEN_BODEN + DORF_FERN + haus,
    tipp: "Zermatt ist autofrei: Hier fahren nur kleine Elektroautos." });
  /* das Hotel (links vorn): zweigeschossiger Bruchsteinsockel, Haustür mit Treppe, Schild */
  {
    const { c, h } = HOTEL, h0 = hb(h.D0), Q = (X, hh) => P(X, h.D0 - 0.01, h0 + hh);
    let k = c.g;
    k += `<path d="${pz([Q(h.X1 - 3.4, 0), Q(h.X1 - 0.6, 0), Q(h.X1 - 0.6, 5.5), Q(h.X1 - 3.4, 5.5)])}" fill="url(#${S.id("bruch")})" opacity=".55"/>`;
    k += `<path d="${pz([Q(h.X1 - 2.6, 0.6), Q(h.X1 - 1.2, 0.6), Q(h.X1 - 1.2, 2.9), Q(h.X1 - 2.6, 2.9)])}" fill="#4a2e1a" stroke="#d8d0c0" stroke-width=".8"/>`;
    for (let i = 0; i < 3; i++) k += `<path d="${pz([P(h.X1 - 2.9, h.D0 - 0.3 - i * 0.3, h0 + 0.6 - i * 0.2), P(h.X1 - 0.9, h.D0 - 0.3 - i * 0.3, h0 + 0.6 - i * 0.2), P(h.X1 - 0.9, h.D0 - 0.6 - i * 0.3, h0 + 0.4 - i * 0.2), P(h.X1 - 2.9, h.D0 - 0.6 - i * 0.3, h0 + 0.4 - i * 0.2)])}" fill="#b8b2a6" stroke="#8a857c" stroke-width=".3"/>`;
    const [sx, sy] = Q(h.X1 - 1.9, 3.5), ss = F / h.D0;
    k += `<rect x="${r(sx - 0.9 * ss)}" y="${r(sy - 0.25 * ss)}" width="${r(1.8 * ss)}" height="${r(0.5 * ss)}" rx="${r(0.05 * ss)}" fill="#2f5a35" stroke="#e8d9a8" stroke-width=".3"/><text x="${r(sx)}" y="${r(sy + 0.12 * ss)}" font-size="${r(0.3 * ss)}" text-anchor="middle" fill="#f4ead0" font-family="Georgia,serif">Zimmer frei</text>`;
    const [hx, hy] = P((h.X0 + h.X1) / 2, h.D0, h0);
    S.teil({ id: "hotel", de: "das Hotel", syl: "ho-TEL", it: "l'albergo", itSyl: "al-BER-go", en: "hotel", anker: [Math.max(10, hx), hy], kunst: k,
      tipp: "Zermatt hat über 100 Hotels. Viele haben unten Stein und oben Holz." });
  }
  /* der Stadel (Lupe: Steinplatte und Stütze) */
  const sd = STADEL_DATA[0], sObj = STADEL[0];
  const [sx, sy] = P((sObj.X0 + sObj.X1) / 2, sObj.D0, hb(sObj.D0));
  const pl = sd.posten.find((p) => Math.abs(p[0] - (sObj.X0 + sObj.X1) / 2) < 0.1) || sd.posten[0];
  const [plx, ply] = P(pl[0], pl[1], sd.hp), ps = F / pl[1];
  S.teil({ id: "stadel", de: "der Stadel", syl: "STA-del", it: "il granaio", itSyl: "gra-NA-io", en: "granary", anker: [sx, sy], kunst: STADEL_DATA.map((d) => d.g).join(""),
    tipp: "Im Stadel lagerten die Bauern früher Getreide und Heu.",
    zoom: { x: r(sx - 26), y: r(sy - 34), w: 54, h: 36 },
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
    tipp: "Die Lärche ist der einzige heimische Nadelbaum, der im Winter seine Nadeln verliert. Im Herbst werden sie golden." });
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
    const xa = Math.min(bx1, bx2), xb = Math.min(398, Math.max(bx1, bx2)), xm = (xa + xb) / 2;
    unter.push({ id: "balkon", de: "der Balkon", syl: "bal-KON", it: "il balcone", itSyl: "bal-CO-ne", en: "balcony", x: xm, y: by, kunst: flaeche(xa - xm, byo - by, xb - xa, by - byo, 0.4),
      tipp: "Fast jedes Chalet hat Holzbalkone voller Blumen." });
    const b2 = bal[0], [gx, gy] = b2.Qv(b2.u0 + (b2.u1 - b2.u0) * 0.3, b2.h + 1.12, b2.aus + 0.08), gs = b2.s;
    unter.push({ id: "geranie", de: "die Geranie", syl: "ge-RA-nie", it: "il geranio", itSyl: "ge-RA-nio", en: "geranium", x: gx, y: gy + 0.3 * gs, kunst: flaeche(-0.8 * gs, -0.6 * gs, 1.6 * gs, 0.8 * gs, 0.3),
      tipp: "Rote Geranien blühen den ganzen Sommer an den Balkonen." });
  }
  const zx0 = P(h.X0, h.D0, 0)[0], zx1 = P(h.X1, h.D1, 0)[0];
  S.teil({ id: "chalet", de: "das Chalet", syl: "scha-LEE", it: "lo chalet", itSyl: "scia-LÈ", en: "chalet", anker: [cx, cy], kunst: c.g,
    tipp: "Ein Chalet ist ein Holzhaus in den Bergen. Unten ist es aus Stein.",
    zoom: { x: 318, y: 96, w: 82, h: 55 }, unter });
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
  S.teil({ id: "elektrotaxi", de: "das Elektrotaxi", syl: "e-LEK-tro-ta-xi", it: "il taxi elettrico", itSyl: "TA-xi e-LET-tri-co", en: "electric taxi", anker: [x, y], kunst: `<g ${VOL}>${k}</g>`,
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
  /* Brotkorb mit Würfeln neben dem Caquelon */
  { const bx = fx - 0.42 * ts, by = fy; let bk = `<path d="M${r(bx - 0.13 * ts)} ${r(by - 0.1 * ts)} L${r(bx + 0.13 * ts)} ${r(by - 0.1 * ts)} L${r(bx + 0.1 * ts)} ${r(by)} L${r(bx - 0.1 * ts)} ${r(by)} Z" fill="#b88a4a"/><path d="M${r(bx - 0.12 * ts)} ${r(by - 0.06 * ts)} H${r(bx + 0.12 * ts)}" stroke="#8a5e2a" stroke-width="${r(0.008 * ts)}"/>`;
    for (let i = 0; i < 5; i++) bk += `<rect x="${r(bx + (-0.11 + i * 0.045) * ts)}" y="${r(by - (0.15 + (i % 2) * 0.02) * ts)}" width="${r(0.045 * ts)}" height="${r(0.05 * ts)}" fill="${i % 2 ? "#e8c88a" : "#c8924a"}"/>`;
    fondue += bk; }
  k += `<g ${VOL}>${fondue}${raclette}</g>`;
  /* KUHGLOCKE am Pfosten des Eingangs (Zierglocke mit Lederriemen) */
  const [gx, gy] = P(TER.X1 - 0.2, TER.D0 + 0.1, h0 + 2.2), gs = F / (TER.D0 + 0.1);
  const [gx0, gy0] = P(TER.X1 - 0.2, TER.D0 + 0.1, h0 + 0.3);
  let glocke = `<rect x="${r(gx0 - 0.06 * gs)}" y="${r(gy - 0.5 * gs)}" width="${r(0.12 * gs)}" height="${r(gy0 - gy + 0.5 * gs)}" fill="#6e4a2c"/>`;
  glocke += `<path d="M${r(gx - 0.14 * gs)} ${r(gy - 0.42 * gs)} Q${r(gx)} ${r(gy - 0.3 * gs)} ${r(gx + 0.14 * gs)} ${r(gy - 0.42 * gs)}" stroke="#4a2a16" stroke-width="${r(0.05 * gs)}" fill="none"/>`;
  glocke += `<path d="M${r(gx - 0.1 * gs)} ${r(gy - 0.33 * gs)} L${r(gx + 0.1 * gs)} ${r(gy - 0.33 * gs)} L${r(gx + 0.17 * gs)} ${r(gy + 0.02 * gs)} Q${r(gx)} ${r(gy + 0.07 * gs)} ${r(gx - 0.17 * gs)} ${r(gy + 0.02 * gs)} Z" fill="${S.lg("glocke", [[0, "#f6d77a"], [0.5, "#c9962a"], [1, "#7a5410"]], 0, 0, 1, 0)}"/>`;
  /* bunt besticktes Lederband */
  glocke += `<path d="M${r(gx - 0.2 * gs)} ${r(gy - 0.62 * gs)} Q${r(gx)} ${r(gy - 0.42 * gs)} ${r(gx + 0.2 * gs)} ${r(gy - 0.62 * gs)}" stroke="#b8262c" stroke-width="${r(0.07 * gs)}" fill="none"/><path d="M${r(gx - 0.17 * gs)} ${r(gy - 0.58 * gs)} Q${r(gx)} ${r(gy - 0.4 * gs)} ${r(gx + 0.17 * gs)} ${r(gy - 0.58 * gs)}" stroke="#fff" stroke-width="${r(0.025 * gs)}" stroke-dasharray="${r(0.03 * gs)} ${r(0.03 * gs)}" fill="none"/>`;
  glocke += `<path d="M${r(gx - 0.12 * gs)} ${r(gy - 0.2 * gs)} L${r(gx + 0.12 * gs)} ${r(gy - 0.2 * gs)}" stroke="#d8343c" stroke-width="${r(0.03 * gs)}"/><circle cx="${r(gx)}" cy="${r(gy + 0.06 * gs)}" r="${r(0.035 * gs)}" fill="#5a3a10"/>`;
  k += `<g ${VOL}>${glocke}</g>`;
  const [ax, ay] = P((TER.X0 + TER.X1) / 2, TER.D0, h0);
  S.teil({ id: "terrasse", de: "die Terrasse", syl: "ter-RAS-se", it: "la terrazza", itSyl: "ter-RAZ-za", en: "terrace", anker: [ax, ay], kunst: k,
    tipp: "Auf der Terrasse essen die Gäste mit Blick auf das Matterhorn.",
    zoom: { x: r(tx - 15), y: r(ty - 22), w: 45, h: 30 },
    unter: [
      { id: "fondue", de: "das Fondue", syl: "fon-DÜ", it: "la fonduta", itSyl: "fon-DU-ta", en: "fondue", x: fx, y: fy, kunst: flaeche(-0.16 * ts, -0.32 * ts, 0.32 * ts, 0.34 * ts, 0.3),
        tipp: "Beim Käsefondue taucht man Brotwürfel in geschmolzenen Käse." },
      { id: "raclette", de: "das Raclette", syl: "ra-KLETT", it: "la raclette", itSyl: "ra-CLET-te", en: "raclette", x: rx0 + 0.12 * ts, y: ry0, kunst: flaeche(-0.18 * ts, -0.44 * ts, 0.4 * ts, 0.47 * ts, 0.3),
        tipp: "Raclette kommt aus dem Wallis: Der Käse wird geschmolzen und auf Kartoffeln geschabt. In der Schweiz sagt man auch „die Raclette“." },
      { id: "kuhglocke", de: "die Kuhglocke", syl: "KUH-glo-cke", it: "il campanaccio", itSyl: "cam-pa-NAC-cio", en: "cowbell", x: gx, y: gy + 0.08 * gs, kunst: flaeche(-0.2 * gs, -0.55 * gs, 0.4 * gs, 0.63 * gs, 0.3),
        tipp: "Auf der Alp tragen die Kühe Glocken. So hört der Bauer, wo sie sind." },
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
const BANK = { X: -9.6, D: 27.5 };
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
  const [mx, my] = q3(0.0, 0.3, 0.47), ms = F / (BANK.D + 0.3);
  let messer = `<rect x="${r(mx - 0.05 * ms)}" y="${r(my - 0.022 * ms)}" width="${r(0.1 * ms)}" height="${r(0.026 * ms)}" rx="${r(0.012 * ms)}" fill="#d52b1e"/><path d="M${r(mx + 0.05 * ms)} ${r(my - 0.016 * ms)} L${r(mx + 0.12 * ms)} ${r(my - 0.03 * ms)} L${r(mx + 0.12 * ms)} ${r(my - 0.018 * ms)} L${r(mx + 0.05 * ms)} ${r(my - 0.004 * ms)} Z" fill="#dfe5ea"/><path d="M${r(mx - 0.008 * ms)} ${r(my - 0.009 * ms)} h${r(0.016 * ms)} M${r(mx)} ${r(my - 0.017 * ms)} v${r(0.016 * ms)}" stroke="#fff" stroke-width="${r(0.005 * ms)}"/>`;
  const [cx, cy] = q3(-0.34, 0.5, 0.47), cs = F / (BANK.D + 0.5);
  let schoko = `<path d="M${r(cx - 0.09 * cs)} ${r(cy)} L${r(cx + 0.09 * cs)} ${r(cy)} L${r(cx + 0.07 * cs)} ${r(cy - 0.035 * cs)} L${r(cx - 0.11 * cs)} ${r(cy - 0.035 * cs)} Z" fill="#5a3418"/><path d="M${r(cx - 0.02 * cs)} ${r(cy)} L${r(cx + 0.09 * cs)} ${r(cy)} L${r(cx + 0.07 * cs)} ${r(cy - 0.035 * cs)} L${r(cx - 0.04 * cs)} ${r(cy - 0.035 * cs)} Z" fill="#d6c8a8"/><path d="M${r(cx - 0.06 * cs)} ${r(cy - 0.035 * cs)} L${r(cx - 0.05 * cs)} ${r(cy)} M${r(cx - 0.09 * cs)} ${r(cy - 0.018 * cs)} L${r(cx - 0.02 * cs)} ${r(cy - 0.018 * cs)}" stroke="#3a200c" stroke-width="${r(0.005 * cs)}"/>`;
  const [ux, uy] = q3(-0.1, 0.9, 0.47), us = F / (BANK.D + 0.9);
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
  const [wx, wy] = q3(-0.18, -0.45, 0.0), ws = F / (BANK.D - 0.45);
  const wi = B.mensch({ id: "chz_wi", geschlecht: "w", pose: "sitzen", blick: 270, frisur: "zopf", haarfarbe: "braun", haut: "hell", ohneSchatten: true,
    kleidung: { oberteil: { stueck: "pullover", farbe: "#2f8a8a" }, jacke: { stueck: "jacke", farbe: "#d0402e" }, unterteil: { stueck: "hose", farbe: "grau" }, schuhe: { stueck: "stiefel", farbe: "braun" } } }, 1.66 * ws);
  S.teil({ id: "wanderin", de: "die Wanderin", syl: "WAN-de-rin", it: "l'escursionista", itSyl: "e-scur-sio-NI-sta", en: "hiker (woman)", x: wx, y: wy, kunst: `<g ${VOLF}>${schlank(wi.svg, 2)}</g>`,
    tipp: "Die Wanderin macht eine Pause und isst Schokolade." });
}

/* 18 — DAS GELÄNDER der Kirchbrücke (vorne, 10 m vor uns): Holzhandlauf auf dunklen Stahlpfosten */
{
  const D = 11.5, hd = 4.8, s = F / D;
  let k = "", pf = "";
  for (let X = -10.4; X <= 10.4; X += 1.6) { const a2 = P(X, D, hd), b2 = P(X, D, hd + 1.0); pf += `<rect x="${r(a2[0] - 0.04 * s)}" y="${r(b2[1])}" width="${r(0.08 * s)}" height="${r(a2[1] - b2[1])}"/>`; }
  const y1 = P(0, D, hd + 1.0)[1], y2 = P(0, D, hd + 0.55)[1], y3 = P(0, D, hd + 0.15)[1];
  k += `<rect x="0" y="${r(y2 - 0.02 * s)}" width="400" height="${r(0.04 * s)}" fill="#2a2e30"/><rect x="0" y="${r(y3 - 0.02 * s)}" width="400" height="${r(0.04 * s)}" fill="#2a2e30"/>`;
  k += `<g fill="${S.lg("pfosten", [[0, "#5a6064"], [0.4, "#2a2e30"], [1, "#16191a"]], 0, 0, 1, 0)}">${pf}</g>`;
  k += `<rect x="0" y="${r(y1 - 0.07 * s)}" width="400" height="${r(0.1 * s)}" rx="${r(0.04 * s)}" fill="${S.lg("handlauf", [[0, "#b07a48"], [0.5, "#7a4e28"], [1, "#4a2e16"]])}"/><rect x="0" y="${r(y1 - 0.07 * s)}" width="400" height="${r(0.02 * s)}" fill="#ffe2b0" opacity=".6"/>`;
  S.teil({ id: "gelaender", de: "das Geländer", syl: "ge-LÄN-der", it: "la ringhiera", itSyl: "rin-GHIE-ra", en: "railing", anker: [120, y1], kunst: k,
    tipp: "Am Geländer der Kirchbrücke stehen jeden Morgen Menschen und fotografieren das Matterhorn." });
}

/* 19 — DER BERGSTEIGER am Brückengeländer (vorn rechts, 9 m): Helm, Seil, Pickel am Rucksack; fotografiert den Berg */
{
  const X = 4.0, D = 10.6, [x, y] = P(X, D, 4.8), s = F / D;
  const foto = { lende: 1, brust: -3, nacken: -4, kopf: -6, schulterL: { vor: 64, seit: 16 }, ellbogenL: 104, unterarmL: 40, handL: 10, fingerL: 0.5, schulterR: { vor: 62, seit: 18 }, ellbogenR: 106, unterarmR: 40, handR: 10, fingerR: 0.5, huefteL: { vor: 3, seit: 3, dreh: -6 }, knieL: 3, fussL: 0, huefteR: { vor: -3, seit: 3, dreh: -6 }, knieR: 2, fussR: 0 };
  const m = B.mensch({ id: "chz_berg", geschlecht: "m", pose: foto, blick: 196, frisur: "kurz", haarfarbe: "braun", haut: "hell", ohneSchatten: true,
    kleidung: { oberteil: { stueck: "pullover", farbe: "#2f5f95" }, jacke: { stueck: "jacke", farbe: "#c8352e" }, unterteil: { stueck: "hose", farbe: "#3a3c40" }, schuhe: { stueck: "stiefel", farbe: "braun" }, kopf: { stueck: "helm", farbe: "#f08a1c" } } }, 1.8 * s);
  const pu = m.z.punkte || {}, ru = pu.ruecken ? [pu.ruecken[0] * m.k, pu.ruecken[1] * m.k] : [0, -1.25 * s];
  /* Rucksack mit Pickel, Seilring über der Schulter */
  let k = `<path d="M${r(ru[0] - 0.2 * s)} ${r(ru[1] - 0.28 * s)} Q${r(ru[0])} ${r(ru[1] - 0.36 * s)} ${r(ru[0] + 0.2 * s)} ${r(ru[1] - 0.28 * s)} L${r(ru[0] + 0.21 * s)} ${r(ru[1] + 0.22 * s)} Q${r(ru[0])} ${r(ru[1] + 0.3 * s)} ${r(ru[0] - 0.21 * s)} ${r(ru[1] + 0.22 * s)} Z" fill="${S.lg("rucksack", [[0, "#4a6a3a"], [1, "#2a4422"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${r(ru[0] - 0.18 * s)} ${r(ru[1] - 0.1 * s)} H${r(ru[0] + 0.18 * s)}" stroke="#1a2a14" stroke-width="${r(0.02 * s)}"/>`;
  k += `<path d="M${r(ru[0] + 0.06 * s)} ${r(ru[1] + 0.2 * s)} L${r(ru[0] + 0.12 * s)} ${r(ru[1] - 0.55 * s)}" stroke="#2a2a2c" stroke-width="${r(0.03 * s)}"/><path d="M${r(ru[0] + 0.0 * s)} ${r(ru[1] - 0.55 * s)} Q${r(ru[0] + 0.12 * s)} ${r(ru[1] - 0.62 * s)} ${r(ru[0] + 0.26 * s)} ${r(ru[1] - 0.5 * s)}" stroke="#b9c1c7" stroke-width="${r(0.035 * s)}" fill="none" stroke-linecap="round"/>`;
  /* Seil: aufgeschossen, oben unter dem Deckel des Rucksacks festgeschnallt */
  for (let i = 0; i < 3; i++) k += `<ellipse cx="${r(ru[0] - 0.01 * s)}" cy="${r(ru[1] - 0.3 * s + i * 0.025 * s)}" rx="${r(0.17 * s)}" ry="${r(0.06 * s)}" fill="none" stroke="${i % 2 ? "#f2c62e" : "#d8343c"}" stroke-width="${r(0.028 * s)}"/>`;
  S.teil({ id: "bergsteiger", de: "der Bergsteiger", syl: "BERG-stei-ger", it: "l'alpinista", itSyl: "al-pi-NI-sta", en: "mountaineer", x, y, kunst: `<g ${VOLF}>${schlank(m.svg, 1)}${k}</g>`,
    tipp: "Bergsteiger brauchen Helm, Seil und Pickel. Auf das Matterhorn steigt man meist über den Hörnligrat." });
}

/* Alpendohlen (schwarz, gelber Schnabel) am Himmel — Kulisse */
{
  const dohle = (x, y, s, f) => `<path d="M${r(x - 3 * s)} ${r(y - 1.4 * s * f)} Q${r(x - 1.4 * s)} ${r(y - 0.6 * s)} ${r(x)} ${r(y)} Q${r(x + 1.4 * s)} ${r(y - 0.6 * s)} ${r(x + 3 * s)} ${r(y - 1.4 * s * f)} Q${r(x + 1.2 * s)} ${r(y + 0.1 * s)} ${r(x)} ${r(y + 0.5 * s)} Q${r(x - 1.2 * s)} ${r(y + 0.1 * s)} ${r(x - 3 * s)} ${r(y - 1.4 * s * f)} Z" fill="#141416"/><path d="M${r(x + 0.15 * s)} ${r(y + 0.2 * s)} L${r(x + 0.7 * s)} ${r(y + 0.28 * s)} L${r(x + 0.15 * s)} ${r(y + 0.45 * s)} Z" fill="#f2c62e"/>`;
  S.hinten(dohle(80, 36, 1.7, 1) + dohle(100, 26, 1.35, -0.4) + dohle(64, 22, 1.1, 0.6));
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/schweiz.js"));
console.log(aus);
