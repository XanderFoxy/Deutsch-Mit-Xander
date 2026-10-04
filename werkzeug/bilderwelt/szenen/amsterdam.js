#!/usr/bin/env node
/* =====================================================================
   AMSTERDAM (FASSUNG 854) — Bilderwelt neu: Sehenswürdigkeit
   ---------------------------------------------------------------------
   XANDER (03.10.): „die bekanntesten Städte in anderen Ländern … als
   Profi-Grafikdesigner auf Hollywood-Niveau … mit größter Sorgfalt und
   Präzision auf höchstem Niveau“.

   STANDORT: die Brücke der HERENGRACHT über die Mündung der
   REGULIERSGRACHT (Grachtengürtel, 17. Jh., UNESCO-Welterbe seit 2010).
   Von hier blickt man genau die Reguliersgracht entlang nach SSO und
   sieht die berühmten „SIEBEN BRÜCKEN“ hintereinander — eines der
   meistfotografierten Motive der Stadt (lonelyplanet „Reguliersgracht“,
   Wanderlog/getnofilter „Seven bridges view point“; schon Stadtpläne des
   18. Jh. erwähnen die Sichtachse). Steht man hier, zählt man ringsum
   sogar 15 Brücken.
   RECHERCHE (Fachwissen und die Quellen oben; Unsicheres markiert):
   - Die Brücken liegen dort, wo die Kaistraßen der Querkanäle die
     Reguliersgracht kreuzen: zwei an der KEIZERSGRACHT (vorne und hinten),
     eine an der KERKSTRAAT, zwei an der PRINSENGRACHT, dahinter zwei
     weitere bis zur Lijnbaansgracht (Namen der beiden letzten UNSICHER).
     Gemauerte Bogenbrücken (Backstein, Bogenring aus hellem Naturstein),
     flach gewölbt, Fahrbahn leicht gebuckelt, dunkles Eisengeländer.
     Abends leuchten an den Bögen Ketten aus kleinen Glühbirnen.
   - GRACHTENHÄUSER (17./18. Jh.): schmal (5–8 m), 4–5 Geschosse,
     Hochparterre über einer Treppe (Stoep), hohe Schiebefenster mit
     weißen Rahmen, Backstein (rotbraun) oder dunkel/hell gestrichen,
     weiße Natursteinbänder. Giebelformen: TREPPENGIEBEL (trapgevel),
     HALSGIEBEL (halsgevel, mit Klauenstücken), GLOCKENGIEBEL (klokgevel),
     später Gesimsfassaden (lijstgevel). Oben der Balken mit dem
     LASTENHAKEN (hijsbalk): Möbel werden außen hochgezogen, weil die
     Treppen zu eng sind; die Fassaden neigen sich dafür leicht nach vorn.
   - Am Kai ULMEN (Amsterdam hat rund 75 000 Ulmen), eiserne Poller
     („Amsterdammertjes“, rotbraun mit den drei Andreaskreuzen des
     Stadtwappens), grüne Grachtenlaternen, überall FAHRRÄDER, auch
     LASTENRÄDER (bakfiets) mit Kiste vorn. An den Kaimauern liegen
     HAUSBOOTE (umgebaute Lastkähne und kastenförmige „Arken“, Pflanzen auf
     dem Dach), auf ihnen sitzen gern GRAUREIHER. Durch die Grachten
     fahren flache RUNDFAHRTBOOTE mit Glasdach.
   - Typisches: TULPEN, Gouda-KÄSE (Laibe mit gelber Wachsrinde), die
     SIRUPWAFFEL (stroopwafel), bemalte HOLZSCHUHE (klompen) als
     Souvenir — hier im Käse- und Souvenirladen an der Ecke rechts.
     Die Fahne der Stadt: Rot-Schwarz-Rot mit drei weißen Andreaskreuzen.
   ZEIT/LICHT: Frühlingsabend (Tulpenzeit), Sonne im Westnordwesten,
   17° hoch, rechts hinter uns. Die Häuser der rechten (Westseite)
   liegen im Gegenlicht-Schatten und werfen ihren Schatten über die
   Gracht bis an die linke Häuserzeile: dort leuchten nur die oberen
   Geschosse und Giebel golden (Schattenkante als Sägezahn der Giebel).
   Durch die Lücke der Herengracht hinter uns fällt Sonne auf das nahe
   Wasser und den linken Kai; durch die Querkanäle fällt sie auf die
   hinteren Brücken (Keizersgracht, Prinsengracht). Die Lichterketten
   brennen schon.
   KAMERA: Augenhöhe 4,25 m über dem Wasser (Brücke 2,6 m + 1,65 m),
   Fluchtpunkt (200 | 112), Brennweite 480 Einheiten. Wasser 0 m, Kai
   1,3 m, Kaimauer bei ±8 m, Fassaden bei ±14,5 m. Punkt X quer, D
   Abstand, h Höhe: x = 200 + 480·X/D, y = 112 − (h − 4,25)·480/D.
   Erste Brücke 102 m (4,7 Einheiten je Meter), Laden 37–45 m, Menschen
   am Kai 31–44 m, Geländer 2,4 m vor uns, Fahrrad 2–2,5 m.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "amsterdam", titel: "Amsterdam", emoji: "🚲", thema: "Länder", kuerzel: "ams", fassung: 854, breite: 400, hoehe: 260 });
/* Verläufe nur einmal anlegen (keine doppelten ids) */
/* Verläufe in Bildkoordinaten: die Koordinaten aus "extra" ersetzen die Vorgaben (sonst stünden x1/y1 doppelt da, und der Browser nähme die ersten) */
{ const lg0 = S.lg; S.lg = (n, st, x1 = 0, y1 = 0, x2 = 0, y2 = 1, ex = "") => { if (!/ x1=/.test(ex)) return lg0(n, st, x1, y1, x2, y2, ex); const m = (k) => ex.match(new RegExp(" " + k + '="([^"]*)"'))[1]; return lg0(n, st, m("x1"), m("y1"), m("x2"), m("y2"), ex.replace(/ (x1|y1|x2|y2)="[^"]*"/g, "")); }; }
{ const lg = S.lg, rg = S.rg, schon = {}; S.lg = (n, ...a) => schon["l" + n] || (schon["l" + n] = lg(n, ...a)); S.rg = (n, ...a) => schon["r" + n] || (schon["r" + n] = rg(n, ...a)); }
/* anker: Kunst in Bildkoordinaten, Bezugspunkt (x, y) für die App */
/* Alles, was über den Bildrand hinausragt, auf den Rand setzen (unsichtbar dort, aber die Trefferfläche bleibt im Bild) */
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
const rnd = zufall(1612);
const r = B.r;

/* ---------- Kamera ---------------------------------------------------- */
const VPX = 200, HOR = 112, F = 480, E = 4.25, KAI = 1.3, KX = 8, FX = 14.5;
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

/* ---------- Sonne: WNW, 17° hoch — in Kamerakoordinaten nach rechts (+X) und hinter uns (−D) ---------- */
const SX = 0.766, SD = -0.643, TAN = 0.306;

/* ---------- Filter (alle in sRGB, sonst Lichthöfe) ---------- */
const CIF = ` color-interpolation-filters="sRGB"`;
S.def(`<filter id="bw_weich"${CIF} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("glimm")}"${CIF} x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="1.1"/></filter>`);
S.def(`<filter id="${S.id("weich")}"${CIF} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation=".5"/></filter>`);
S.def(`<filter id="${S.id("welle")}"${CIF} x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".012 .55" numOctaves="2" seed="4"/><feDisplacementMap in="SourceGraphic" scale="4.2" xChannelSelector="R" yChannelSelector="G"/><feGaussianBlur stdDeviation=".35 .12"/></filter>`);
/* Volumen für Figuren und Räder: Lichtkante rechts (Sonne rechts hinten), Eigenschatten links */
S.def(`<filter id="${S.id("vol")}"${CIF} x="-10%" y="-5%" width="120%" height="110%"><feOffset in="SourceAlpha" dx="-.5" dy=".15" result="o"/><feComposite in="SourceAlpha" in2="o" operator="out" result="k"/><feFlood flood-color="#ffe2a8" flood-opacity=".9"/><feComposite in2="k" operator="in" result="licht"/><feOffset in="SourceAlpha" dx="1.4" result="o2"/><feComposite in="SourceAlpha" in2="o2" operator="out" result="s"/><feGaussianBlur in="s" stdDeviation=".6" result="sb"/><feFlood flood-color="#1a2040" flood-opacity=".38"/><feComposite in2="sb" operator="in"/><feComposite in2="SourceAlpha" operator="in" result="schatten"/><feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="schatten"/><feMergeNode in="licht"/></feMerge></filter>`);
/* im Schatten: nur weiches Himmelslicht von oben, kühle Kante */
S.def(`<filter id="${S.id("volS")}"${CIF} x="-10%" y="-5%" width="120%" height="110%"><feOffset in="SourceAlpha" dy=".6" result="o"/><feComposite in="SourceAlpha" in2="o" operator="out" result="k"/><feFlood flood-color="#cfe0f2" flood-opacity=".45"/><feComposite in2="k" operator="in" result="licht"/><feOffset in="SourceAlpha" dx="1" result="o2"/><feComposite in="SourceAlpha" in2="o2" operator="out" result="s"/><feGaussianBlur in="s" stdDeviation=".5" result="sb"/><feFlood flood-color="#101830" flood-opacity=".3"/><feComposite in2="sb" operator="in"/><feComposite in2="SourceAlpha" operator="in" result="schatten"/><feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="schatten"/><feMergeNode in="licht"/></feMerge></filter>`);
S.def(`<filter id="${S.id("voln")}"${CIF} x="-5%" y="-5%" width="110%" height="110%"><feOffset in="SourceAlpha" dx="-.35" dy=".3" result="o"/><feComposite in="SourceAlpha" in2="o" operator="out" result="k"/><feFlood flood-color="#ffe2a8" flood-opacity=".6"/><feComposite in2="k" operator="in" result="licht"/><feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="licht"/></feMerge></filter>`);
const VOLN = `filter="url(#${S.id("voln")})"`;
const VOL = `filter="url(#${S.id("vol")})"`, VOLS = `filter="url(#${S.id("volS")})"`;

/* =====================================================================
   DIE HÄUSERZEILEN — Daten (je Seite eine Liste von Häusern)
   ===================================================================== */
/* Querstraßen und Querkanäle (hier enden die Zeilen) */
const LUECKEN = [[-99, 12], [102, 145], [196, 206], [252, 294], [345, 354], [400, 999]];
const BRUECKEN = [102, 136, 196, 252, 285, 345, 400];   /* Vorderkante jeder Brücke (9 m tief, die Kerkstraat 10 m) */
const TYPEN = ["trap", "hals", "klok", "lijst", "trap", "hals", "tuit", "lijst", "klok", "trap"];
const ZIEGEL = ["#7d3a2a", "#8e4632", "#6c3427", "#9a5639", "#74402f"];
const PUTZE = ["#e8e0cf", "#cfd3cf", "#2e3a3d", "#d9c7a4", "#3c4440", "#efe9dc"];
function zeile(seite, seed) {
  const z = zufall(seed), liste = [];
  for (let i = 0; i < LUECKEN.length - 1; i++) {
    let d = LUECKEN[i][1];
    const ende = LUECKEN[i + 1][0];
    while (d < ende - 4) {
      let w = 5.2 + z() * 2.8;
      if (ende - (d + w) < 4.6) w = ende - d;
      const typ = TYPEN[Math.floor(z() * TYPEN.length)];
      const ziegel = z() < 0.62;
      const He = 12.6 + z() * 3.2, Ht = typ === "lijst" ? He + 1.1 : He + 4.2 + z() * 2.2;
      liste.push({ d0: d, d1: d + w, w, typ, He, Ht, farbe: ziegel ? ZIEGEL[Math.floor(z() * ZIEGEL.length)] : PUTZE[Math.floor(z() * PUTZE.length)], ziegel, n: w > 6.4 ? 3 : 2, z: z() });
      d += w;
    }
  }
  return liste;
}
const RECHTS = zeile(1, 31), LINKS = zeile(-1, 77);
/* Die Häuser der Lupe (links, 66–100 m) gezielt festlegen: Hals-, Treppen-, Glockengiebel, Gesims, Treppengiebel */
{
  const fest = [["hals", 66, 72.6, "#7d3a2a", true], ["trap", 72.6, 79.4, "#9a5639", true], ["klok", 79.4, 85.4, "#e8e0cf", false], ["lijst", 85.4, 92.6, "#2e3a3d", false], ["trap", 92.6, 102, "#74402f", true]];
  const i0 = LINKS.findIndex((h) => h.d1 > 62);
  const vorher = LINKS.slice(0, i0), nachher = LINKS.filter((h) => h.d0 >= 102);
  const letzte = vorher[vorher.length - 1];
  letzte.d1 = 66; letzte.w = 66 - letzte.d0;
  if (letzte.w < 3) { vorher.pop(); vorher[vorher.length - 1].d1 = 66; vorher[vorher.length - 1].w = 66 - vorher[vorher.length - 1].d0; }
  const neu = fest.map(([typ, d0, d1, farbe, ziegel], i) => ({ d0, d1, w: d1 - d0, typ, He: [14.6, 13.4, 13.8, 15.2, 13.2][i], Ht: [20.4, 19.6, 19.2, 16.3, 19.4][i], farbe, ziegel, n: d1 - d0 > 6.4 ? 3 : 2, z: 0.3 + i * 0.1 }));
  LINKS.length = 0; LINKS.push(...vorher, ...neu, ...nachher);
}
/* Giebelumriss in (u, h): u = 0 … w längs der Zeile, h über dem Wasser (Fuß auf Kaihöhe) */
function umriss(h) {
  const { w, He, Ht, typ } = h, o = [[0, KAI], [0, He]];
  const kurve = (a, b, c, n = 6) => { for (let i = 1; i <= n; i++) { const t = i / n; o.push([(1 - t) * (1 - t) * a[0] + 2 * t * (1 - t) * b[0] + t * t * c[0], (1 - t) * (1 - t) * a[1] + 2 * t * (1 - t) * b[1] + t * t * c[1]]); } };
  if (typ === "trap") {
    const n = 4, sw = w / (2 * n + 1.6), dh = (Ht - He) / (n + 1);
    for (let k = 0; k < n; k++) { o.push([k * sw, He + (k + 1) * dh]); o.push([(k + 1) * sw, He + (k + 1) * dh]); }
    o.push([n * sw, Ht]); o.push([w - n * sw, Ht]);
    for (let k = n - 1; k >= 0; k--) { o.push([w - (k + 1) * sw, He + (k + 1) * dh]); o.push([w - k * sw, He + (k + 1) * dh]); }
  } else if (typ === "hals") {
    /* Halsgiebel: Klauenstücke (Viertelkreis-Voluten) an den Schultern, gerader Hals, Dreiecksfronton mit Gesims */
    const a = 0.3 * w, kh = 2.3, top = Ht - 1.4;
    for (let i = 0; i <= 6; i++) { const t = i / 6 * Math.PI / 2; o.push([a * Math.sin(t), He + 0.25 + kh * (1 - Math.cos(t))]); }
    o.push([a, top]); o.push([a - 0.3, top]); o.push([a - 0.3, top + 0.25]); o.push([w / 2, Ht]); o.push([w - a + 0.3, top + 0.25]); o.push([w - a + 0.3, top]); o.push([w - a, top]);
    for (let i = 6; i >= 0; i--) { const t = i / 6 * Math.PI / 2; o.push([w - a * Math.sin(t), He + 0.25 + kh * (1 - Math.cos(t))]); }
    o.push([w, He + 0.25]);
  } else if (typ === "klok") {
    /* Glockengiebel: S-förmige Flanken (unten hohl, oben gewölbt), oben kleiner Rundbogen */
    const prof = [[0, 0], [0.11, 0.04], [0.18, 0.15], [0.205, 0.32], [0.2, 0.5], [0.23, 0.68], [0.3, 0.82], [0.38, 0.91], [0.44, 0.95]];
    for (const [u, v] of prof.slice(1)) o.push([u * w, He + v * (Ht - 0.4 - He)]);
    for (let i = 1; i < 6; i++) { const t = Math.PI * i / 6; o.push([w / 2 - 0.06 * w * Math.cos(t), Ht - 0.4 + 0.4 * Math.sin(t) + 0.02]); }
    for (const [u, v] of prof.slice(1).reverse()) o.push([w - u * w, He + v * (Ht - 0.4 - He)]);
  } else if (typ === "tuit") {
    const a = 0.3 * w;
    o.push([a * 0.6, He + 1.2]); o.push([a, Ht - 1]); o.push([w / 2, Ht]); o.push([w - a, Ht - 1]); o.push([w - a * 0.6, He + 1.2]);
  } else {
    o.push([0, Ht - 0.3]); o.push([-0.25, Ht - 0.3]); o.push([-0.25, Ht]); o.push([w + 0.25, Ht]); o.push([w + 0.25, Ht - 0.3]); o.push([w, Ht - 0.3]);
  }
  o.push([w, He]); o.push([w, KAI]);
  return o;
}
/* Skyline der rechten Zeile (für die Schatten): Höhe an Stelle D */
const umrisseR = RECHTS.map((h) => ({ h, u: umriss(h) }));
function HR(D) {
  for (const { h, u } of umrisseR) {
    if (D < h.d0 || D > h.d1) continue;
    const uu = D - h.d0; let m = h.He;
    for (let i = 1; i < u.length; i++) { const [a0, b0] = u[i - 1], [a1, b1] = u[i]; if ((uu - a0) * (uu - a1) <= 0 && a0 !== a1) m = Math.max(m, b0 + (b1 - b0) * (uu - a0) / (a1 - a0)); else if (a0 === a1 && Math.abs(uu - a0) < 0.05) m = Math.max(m, Math.max(b0, b1)); }
    return m;
  }
  return D < 12 ? 0 : (LUECKEN.some(([a, b]) => D >= a && D <= b) ? 0 : 14);
}
/* Liegt ein Punkt in der Sonne? (Strahl zur Sonne über die rechte Zeile) */
const sonnig = (X, D, h) => { const t = (FX - X) / SX, Dh = D + SD * t, hh = h + TAN * t; return HR(Dh) < hh; };
/* Schattenhöhe an der linken Fassade */
const SCHATTEN_L = (D) => Math.max(KAI, HR(D + SD * (2 * FX) / SX) - TAN * (2 * FX) / SX);

/* ---------- Farben und Verläufe ---------- */
const GLAS = S.lg("glas", [[0, "#4d5b6c"], [0.5, "#26303c"], [1, "#1a222c"]]);
const GLAS_L = S.lg("glasl", [[0, "#c7c2b8"], [0.35, "#6d7480"], [1, "#2a313b"]]);
const RAHMEN = "#f2eee4";
const WASSER = S.lg("wasser", [[0, "#7f9aa4"], [0.12, "#4f6a6c"], [0.55, "#344b4b"], [1, "#24383a"]]);

/* =====================================================================
   KULISSE 1 — Abendhimmel und Wolken
   ===================================================================== */
S.hinten(`<rect width="400" height="${HOR + 30}" fill="${S.lg("himmel", [[0, "#5b86bf"], [0.4, "#8eaed0"], [0.72, "#d9cbbd"], [0.9, "#f2c99a"], [1, "#f7b98a"]])}"/>`);
S.hinten(`<ellipse cx="420" cy="${HOR - 10}" rx="200" ry="70" fill="${S.rg("abendglanz", [[0, "#ffd9a0", 0.55], [1, "#ffd9a0", 0]])}"/>`);
/* Wolken: klare Kumulus-Formen, Licht von rechts (warm), Schatten unten links (bläulich) */
S.def(`<filter id="${S.id("wolkweich")}"${CIF} x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="1.3"/></filter>`);
function wolke(cx, cy, s, seed, form) {
  const z = zufall(seed), teile = form.map(([dx, dy, rr]) => [cx + dx * s, cy + dy * s, rr * s * (0.92 + z() * 0.16)]);
  const fuss = cy + s * 1.6, xs = form.map((f) => f[0]), xl = cx + Math.min(...xs) * s - 6 * s, xr = cx + Math.max(...xs) * s + 6 * s;
  const li = teile.reduce((a, b) => (b[0] < a[0] ? b : a)), re = teile.reduce((a, b) => (b[0] > a[0] ? b : a));
  let umr = "", hl = "", sch = "";
  for (const [x, y, rr] of teile) umr += `M${r(x - rr)} ${r(y)} a${r(rr)} ${r(rr)} 0 1 1 ${r(2 * rr)} 0 a${r(rr)} ${r(rr)} 0 1 1 ${r(-2 * rr)} 0 Z`;
  umr += `M${r(li[0])} ${r(fuss)} L${r(li[0])} ${r(li[1])} L${r(re[0])} ${r(re[1])} L${r(re[0])} ${r(fuss)} Z`;
  for (const [x, y, rr] of teile) { hl += `<circle cx="${r(x + rr * 0.3)}" cy="${r(y - rr * 0.3)}" r="${r(rr * 0.55)}"/>`; sch += `<circle cx="${r(x - rr * 0.25)}" cy="${r(y + rr * 0.35)}" r="${r(rr * 0.85)}"/>`; }
  const id = S.id("wk" + seed), idb = S.id("wb" + seed), oben = cy - 14 * s;
  return `<clipPath id="${id}"><path d="${umr}"/></clipPath><clipPath id="${idb}"><rect x="${r(xl)}" y="${r(oben)}" width="${r(xr - xl)}" height="${r(fuss - oben)}"/></clipPath>` +
    `<g clip-path="url(#${idb})"><g clip-path="url(#${id})"><rect x="${r(xl)}" y="${r(oben)}" width="${r(xr - xl)}" height="${r(fuss - oben)}" fill="${S.lg("wolke" + seed, [[0, "#fff4e2"], [0.55, "#f2e6e0"], [1, "#a99cbc"]], 0, 0, 0, 1, ` gradientUnits="userSpaceOnUse" x1="0" y1="${r(cy - 6 * s)}" x2="0" y2="${r(fuss)}"`)}"/>` +
    `<g fill="#8f84b0" opacity=".32" filter="url(#${S.id("wolkweich")})">${sch}</g><g fill="#ffe0b0" opacity=".8" filter="url(#${S.id("wolkweich")})">${hl}</g>` +
    `<rect x="${r(xl)}" y="${r(oben)}" width="${r(xr - xl)}" height="${r(fuss - oben)}" fill="${S.lg("wolkeseite", [[0, "#7a6ea0", 0.3], [0.5, "#fff", 0], [1, "#ffb860", 0.45]], 0, 0, 1, 0)}"/></g></g>`;
}
const WOLKE_A = [[-11, 1.2, 2.2], [-8, -0.2, 3.2], [-4.4, -2.2, 4.3], [0.4, -4, 5.4], [3.2, -6.4, 3.4], [5.6, -2.4, 4.4], [9, -0.4, 3.2], [11.8, 1.1, 2.1], [-1.6, 0.4, 3.4], [3.6, 0.6, 3]];
const WOLKE_B = [[-6.4, 0.6, 2.2], [-3, -1.2, 3.2], [0.6, -2.6, 3.8], [3.8, -0.8, 3], [6.8, 0.8, 2], [1.2, 0.4, 2.6]];
const WOLKE_C = [[-4, 0.5, 1.8], [-1, -0.6, 2.6], [2.4, 0.2, 2]];
S.hinten(wolke(186, 22, 1.9, 11, WOLKE_A) + wolke(262, 52, 1.3, 12, WOLKE_B) + wolke(150, 70, 0.9, 13, WOLKE_C) + wolke(226, 90, 0.6, 14, WOLKE_B));

/* =====================================================================
   KULISSE 2 — ganz hinten: Bäume am Weteringschans, Gracht bis zum Horizont
   ===================================================================== */
{
  /* Ende der Sichtachse: quer stehende Giebelreihe an der Lijnbaansgracht/Weteringschans, im Abenddunst; Kronen davor */
  let k = "";
  const z = zufall(5), D = 445, s0 = F / D;
  let X = -36;
  while (X < 36) {
    const w = 5 + z() * 2.5, He = 12 + z() * 3, Ht = He + 3 + z() * 2.5, x0 = VPX + X * s0, x1 = VPX + (X + w) * s0, xm = (x0 + x1) / 2;
    const y0 = P(0, D, KAI)[1], ye = P(0, D, He)[1], yt = P(0, D, Ht)[1], typ = z();
    const gp = typ < 0.4 ? `M${r(x0)} ${r(y0)} V${r(ye)} H${r(x0 + (x1 - x0) * 0.2)} V${r(ye - (ye - yt) * 0.4)} H${r(x0 + (x1 - x0) * 0.35)} V${r(yt)} H${r(x1 - (x1 - x0) * 0.35)} V${r(ye - (ye - yt) * 0.4)} H${r(x1 - (x1 - x0) * 0.2)} V${r(ye)} H${r(x1)} V${r(y0)} Z` : `M${r(x0)} ${r(y0)} V${r(ye)} L${r(xm)} ${r(yt)} L${r(x1)} ${r(ye)} V${r(y0)} Z`;
    k += `<path d="${gp}" fill="${["#b49a92", "#a89a96", "#c2b2a2", "#9a8c8e"][Math.floor(z() * 4)]}" stroke="#d8cfc4" stroke-width=".15"/>`;
    for (let fy = 2.4; fy < He - 1; fy += 3) k += `<path d="M${r(x0 + (x1 - x0) * 0.2)} ${r(P(0, D, fy + 1.4)[1])} H${r(x1 - (x1 - x0) * 0.2)}" stroke="#6d6a74" stroke-width="${r(1.4 * s0)}" stroke-dasharray="${r(0.9 * s0)} ${r(0.7 * s0)}"/>`;
    X += w;
  }
  for (let i = 0; i < 9; i++) { const Xb = -30 + i * 7.5 + z() * 2, x = VPX + Xb * s0, y = P(0, D - 20, KAI)[1]; k += `<ellipse cx="${r(x)}" cy="${r(y - 5)}" rx="${r(3.6 + z() * 1.6)}" ry="${r(3.4 + z())}" fill="${z() < 0.5 ? "#8fa262" : "#9fb070"}"/>`; }
  k += `<rect x="140" y="${HOR - 16}" width="120" height="18" fill="${S.lg("dunstEnde", [[0, "#e9d6c0", 0.15], [1, "#e9d6c0", 0.55]])}"/>`;
  S.hinten(k);
}

/* =====================================================================
   DAS WASSER — Gracht mit Querkanälen, Spiegelungen (gewellt), Licht
   ===================================================================== */
/* Wasserfläche: zwischen den Kaimauern; an den Querkanälen breiter */
const WASSER_PFAD = (() => {
  const L = [], R = [];
  const stufen = [[3, KX], [111, KX], [111, 26], [136, 26], [136, KX], [261, KX], [261, 26], [285, 26], [285, KX], [700, KX]];
  for (const [D, X] of stufen) { L.push(P(-X, D, 0)); R.push(P(X, D, 0)); }
  return pz([...L, ...R.reverse()]);
})();
S.def(`<clipPath id="${S.id("wasserclip")}"><path d="${WASSER_PFAD}"/></clipPath>`);
let SPIEGEL = "", SPIEGEL_B = "";   /* gespiegelte Häuser / Brücken — werden im Wasser gesammelt */

/* =====================================================================
   DIE HÄUSER — Zeichnen (hinten zuerst), mit Laibungen, Bändern, Dächern
   ===================================================================== */
const projU = (seite, h, u, hh) => P(seite * FX, h.d0 + u, hh);
/* Fenster mit Laibung: Öffnung in der Fassade, Glas 0,22 m zurückgesetzt (sichtbare Laibung auf der fernen Seite) */
function fenster(seite, D0, D1, h0, h1, art) {
  const X = seite * FX, Xi = seite * (FX + 0.22);
  const o = [P(X, D0, h1), P(X, D1, h1), P(X, D1, h0), P(X, D0, h0)];
  /* sichtbare Glasfläche = Schnitt aus Öffnung und zurückgesetzter Öffnung (Linien zum Fluchtpunkt) */
  const xi1 = P(Xi, D1, 0)[0], xo0 = P(X, D0, 0)[0];
  const lin = (h, XX) => (x) => HOR - (h - E) * (x - VPX) / XX;
  const tO = lin(h1, X), tI = lin(h1, Xi), bO = lin(h0, X), bI = lin(h0, Xi);
  const top = (x) => Math.max(tI(x), tO(x)), bot = (x) => Math.min(bI(x), bO(x));
  const g = [[xi1, top(xi1)], [xo0, top(xo0)], [xo0, bot(xo0)], [xi1, bot(xi1)]];
  return { o, g, art, D: D0 };
}
const haeuserSVG = { 1: "", "-1": "" };
const dachSVG = { 1: "", "-1": "" };
const fensterTeile = { 1: [], "-1": [] };
const giebelInfo = [];
let SCHATTEN_LINKS = "";
function baueZeile(seite, liste) {
  let out = "", spiegel = "";
  const geord = liste.slice().sort((a, b) => b.d0 - a.d0);
  for (const h of geord) {
    if (h.d1 < 35.5) continue;
    const u = umriss(h), Q = (uu, hh) => projU(seite, h, uu, hh);
    /* Dach hinter dem Giebel: First quer zur Gracht, 12 m tief */
    const dm = h.w / 2, Xd = seite * (FX + 12);
    if (h.typ !== "lijst") {
      const dach = pz([P(seite * FX, h.d0 + 0.2, h.He), P(seite * FX, h.d0 + dm, h.Ht - 0.6), P(Xd, h.d0 + dm, h.Ht - 0.6), P(Xd, h.d0 + 0.2, h.He)]);
      out += `<path d="${dach}" fill="${h.z < 0.5 ? "#3d3836" : "#5a3a30"}"/>`;
    } else {
      out += `<path d="${pz([P(seite * FX, h.d0 + 0.3, h.Ht - 0.2), P(seite * FX, h.d1 - 0.3, h.Ht - 0.2), P(seite * (FX + 1.2), h.d1 - 0.6, h.Ht + 1.0), P(seite * (FX + 1.2), h.d0 + 0.6, h.Ht + 1.0)])}" fill="#3a3533"/>`;
      /* Dachgaube mit Lastenhaken */
      out += `<path d="${pz([Q(dm - 1, h.Ht), Q(dm + 1, h.Ht), Q(dm + 1, h.Ht + 2.2), Q(dm - 1, h.Ht + 2.2)])}" fill="#2c2a2a" stroke="${RAHMEN}" stroke-width=".5"/>`;
    }
    const fass = pz(u.map(([a, b]) => Q(a, b)));
    /* Licht in der Grundfarbe: links Abendsonne (warm), rechts Gegenlicht-Schatten (kühl) */
    out += `<path d="${fass}" fill="${seite < 0 ? mix(h.farbe, "#ff9a3a", 0.24) : mix(h.farbe, "#26304a", 0.36)}"/>`;
    if (h.typ === "hals") {
      const a = 0.3 * h.w, kh = 2.3, kl = [], kr = [];
      for (let i = 0; i <= 6; i++) { const t = i / 6 * Math.PI / 2; kl.push(Q(a * Math.sin(t), h.He + 0.25 + kh * (1 - Math.cos(t)))); kr.push(Q(h.w - a * Math.sin(t), h.He + 0.25 + kh * (1 - Math.cos(t)))); }
      const stein = seite < 0 ? "#f3dfb4" : "#9a958a";
      out += `<path d="${pz([Q(0, h.He), ...kl, Q(a, h.He)])} ${pz([Q(h.w, h.He), ...kr, Q(h.w - a, h.He)])}" fill="${stein}"/>`;
      out += `<path d="M${pt(Q(a * 0.35, h.He + 0.6))} Q${pt(Q(a * 0.75, h.He + 0.9))} ${pt(Q(a * 0.7, h.He + 1.6))} M${pt(Q(h.w - a * 0.35, h.He + 0.6))} Q${pt(Q(h.w - a * 0.75, h.He + 0.9))} ${pt(Q(h.w - a * 0.7, h.He + 1.6))}" stroke="#8a6a40" stroke-width=".35" fill="none"/>`;
    }
    /* Spiegelbild (vereinfachte Fassade, dunkler) */
    if (h.d0 < 260) spiegel += `<path d="${pz(u.map(([a, b]) => P(seite * FX, h.d0 + a, -b)))}" fill="${mix(h.farbe, seite < 0 ? "#ffb36a" : "#1c2a33", seite < 0 ? 0.12 : 0.35)}"/>`;
    /* Steinbänder (weißer Naturstein) auf Geschosshöhe und Sockel */
    const sw = (D) => r(Math.max(0.2, 0.12 * F / D));
    let baender = "";
    for (const hb of [4.9, 8.4, 11.6]) if (hb < h.He - 0.5) baender += `M${pt(Q(0, hb))} L${pt(Q(h.w, hb))} `;
    out += `<path d="${baender}" stroke="${h.ziegel ? "#e9e1d0" : mix(h.farbe, "#000", 0.18)}" stroke-width="${sw(h.d0 + dm)}" opacity="${h.ziegel ? 0.85 : 0.5}"/>`;
    out += `<path d="${pz([Q(0, KAI), Q(h.w, KAI), Q(h.w, 2.1), Q(0, 2.1)])}" fill="#2b2826" opacity=".55"/>`;
    /* Giebelkante (Abdeckung aus hellem Stein) */
    out += `<path d="M${u.slice(1, -1).map(([a, b]) => pt(Q(a, b))).join(" L")}" fill="none" stroke="${h.ziegel ? "#efe7d6" : mix(h.farbe, "#ffffff", 0.35)}" stroke-width="${sw(h.d0 + dm)}" stroke-linejoin="round"/>`;
    const fern = h.d0 > 140;
    if (fern) {
      /* ferne Häuser: Fensterreihen nur als dunkle Linien (sie sind nur wenige Einheiten breit) */
      let fl = "";
      for (const hb of [3.4, 6.6, 9.9]) if (hb < h.He - 0.5) fl += `M${pt(Q(0.6, hb))} L${pt(Q(h.w - 0.6, hb))} `;
      out += `<path d="${fl}" stroke="#20262c" stroke-width="${r(1.6 * F / (h.d0 + dm))}" stroke-dasharray="${r(0.5 * F / (h.d0 + dm))} ${r(0.4 * F / (h.d0 + dm))}" opacity=".55"/>`;
      continue;
    }
    /* Fenster: Geschosse */
    const reihen = [[2.3, 4.5], [5.5, 7.6], [8.9, 10.8]];
    if (h.He > 13.8) reihen.push([12.0, 13.4]);
    const nn = h.n, fw = Math.min(1.25, h.w / (nn * 1.75)), abst = h.w / nn;
    for (const [a, b] of reihen) if (b < h.He - 0.3) for (let i = 0; i < nn; i++) {
      const uc = abst * (i + 0.5);
      if (a < 3 && i === (seite > 0 ? 0 : nn - 1)) continue;   /* hier ist die Tür */
      fensterTeile[seite].push(fenster(seite, h.d0 + uc - fw / 2, h.d0 + uc + fw / 2, a, b, a < 3 ? "unten" : ""));
    }
    /* Giebelfenster und Ladeluke unter dem Lastenhaken */
    if (h.typ !== "lijst") {
      fensterTeile[seite].push(fenster(seite, h.d0 + dm - 0.55, h.d0 + dm + 0.55, h.He + 0.6, h.He + 2.4, "luke"));
      if (h.typ === "trap" || h.typ === "klok") fensterTeile[seite].push(fenster(seite, h.d0 + dm - 0.35, h.d0 + dm + 0.35, h.Ht - 2.6, h.Ht - 1.4, ""));
    }
    /* Tür mit Stoep (Treppe zum Hochparterre) */
    const ut = seite > 0 ? 0.35 : h.w - 1.45;
    out += `<path d="${pz([Q(ut, 1.9), Q(ut + 1.1, 1.9), Q(ut + 1.1, 4.4), Q(ut, 4.4)])}" fill="${h.z < 0.4 ? "#1f3a2e" : h.z < 0.7 ? "#2a2a2c" : "#5a2a22"}"/>`;
    out += `<path d="${pz([Q(ut, 4.4), Q(ut + 1.1, 4.4), Q(ut + 1.1, 4.9), Q(ut, 4.9)])}" fill="#efe9dc"/>`;
    /* Lastenhaken: Balken ragt 1 m zur Gracht, Haken hängt darunter */
    {
      const hb = h.typ === "lijst" ? h.Ht + 1.9 : h.Ht - ({ trap: 1.0, hals: 1.9, klok: 1.3, tuit: 1.3 }[h.typ] || 1.2), uu = h.d0 + dm;
      const a = P(seite * FX, uu, hb), b = P(seite * (FX - 0.8), uu, hb), c = P(seite * (FX - 0.8), uu, hb - 0.9);
      out += `<path d="M${pt(a)} L${pt(b)}" stroke="#2a201a" stroke-width="${r(Math.max(0.4, 0.16 * F / uu))}"/><path d="M${pt(b)} L${pt(c)}" stroke="#4a4440" stroke-width="${r(Math.max(0.15, 0.04 * F / uu))}"/><path d="M${pt(c)} q${r(0.12 * F / uu)} ${r(0.18 * F / uu)} ${r(0.22 * F / uu)} 0" stroke="#2a2420" stroke-width="${r(Math.max(0.2, 0.06 * F / uu))}" fill="none"/>`;
      if (seite < 0 && h.d0 >= 66 && h.d0 < 92) giebelInfo.push({ h, haken: [a, b, c] });
    }
    if (seite < 0) {
      /* Schatten der rechten Giebel auf dieser Fassade (Sägezahn), sonst Sonne */
      const pts = [];
      for (let uu = 0; uu <= h.w + 0.001; uu += Math.min(0.25, h.w / 8)) pts.push(Q(uu, Math.min(h.He, SCHATTEN_L(h.d0 + uu))));
      if (pts.some((q, i) => SCHATTEN_L(h.d0 + i * Math.min(0.25, h.w / 8)) > KAI + 0.05)) SCHATTEN_LINKS += pz([Q(0, KAI), ...dp(pts, 0.1), Q(h.w, KAI)]);
    }
    if (seite < 0 && h.d0 >= 66 && h.d0 < 102) giebelInfo.push({ h, umriss: u.map(([a, b]) => Q(a, b)) });
  }
  return { out, spiegel };
}
const ZR = baueZeile(1, RECHTS), ZL = baueZeile(-1, LINKS);
SPIEGEL += ZR.spiegel + ZL.spiegel;
/* Fenster einer Zeile als wenige Pfade: Laibung, Glas, Rahmen + Sprossen */
function fensterSVG(seite, sonne) {
  let lai = "", glas = "", rah = "", luk = "";
  for (const f of fensterTeile[seite]) {
    if (sonne || f.D < 60) lai += "M" + f.o.map(pt).join(" L") + " Z";
    const g = f.g, gp = "M" + g.map(pt).join(" L") + " Z";
    if (f.art === "luke") { luk += gp; continue; }
    glas += gp;
    if (f.D > (sonne ? 100 : 62)) continue;
    const m1 = [(g[0][0] + g[1][0]) / 2, (g[0][1] + g[1][1]) / 2], m2 = [(g[3][0] + g[2][0]) / 2, (g[3][1] + g[2][1]) / 2];
    const l1 = [(g[0][0] + g[3][0]) / 2, (g[0][1] + g[3][1]) / 2], l2 = [(g[1][0] + g[2][0]) / 2, (g[1][1] + g[2][1]) / 2];
    rah += `M${pt(l1)} L${pt(l2)} M${pt(m1)} L${pt(m2)}`;
  }
  return `<path d="${lai}" fill="${sonne ? "#5a463c" : "#1d1a1a"}" opacity=".85"/><path d="${glas}" fill="${sonne ? GLAS_L : GLAS}" stroke="${RAHMEN}" stroke-width=".42" stroke-linejoin="round"/><path d="${luk}" fill="${sonne ? "#2f4a3a" : "#203328"}" stroke="${RAHMEN}" stroke-width=".3"/><path d="${rah}" fill="none" stroke="${RAHMEN}" stroke-width=".3"/>`;
}

/* Querkanal-Häuser (frontal, hinter den Lücken): Keizersgracht und Prinsengracht Südseite */
{
  let k = "";
  for (const [D, seite] of [[145, 1], [145, -1], [294, 1], [294, -1]]) {
    const z = zufall(D * 7 + seite);
    let X = FX;
    while (X < 34) {
      const w = 5.5 + z() * 2.5, He = 12.5 + z() * 3, Ht = He + 4 + z() * 2;
      const xa = P(seite * X, D, 0)[0], xb = P(seite * (X + w), D, 0)[0];
      const y0 = P(0, D, KAI)[1], ye = P(0, D, He)[1], yt = P(0, D, Ht)[1];
      const xm = (xa + xb) / 2, f = z() < 0.6 ? ZIEGEL[Math.floor(z() * 5)] : PUTZE[Math.floor(z() * 6)];
      k += `<path d="M${r(xa)} ${r(y0)} L${r(xa)} ${r(ye)} L${r(xm)} ${r(yt)} L${r(xb)} ${r(ye)} L${r(xb)} ${r(y0)} Z" fill="${f}"/>`;
      /* sonnig (frontal nach Norden, in der Lücke): warmes Licht */
      k += `<path d="M${r(xa)} ${r(y0)} L${r(xa)} ${r(ye)} L${r(xm)} ${r(yt)} L${r(xb)} ${r(ye)} L${r(xb)} ${r(y0)} Z" fill="#ffb565" opacity=".18"/>`;
      const s = F / D;
      for (let fy = 2.6; fy < He - 1.5; fy += 3.2) for (let fx = 0.25; fx < 0.8; fx += 0.33) k += `<rect x="${r(xa + (xb - xa) * fx)}" y="${r(P(0, D, fy + 1.8)[1])}" width="${r(Math.max(0.5, 1.1 * s))}" height="${r(1.8 * s)}" fill="#2a313a" stroke="${RAHMEN}" stroke-width=".25"/>`;
      X += w;
    }
  }
  S.hinten(k);
}

/* =====================================================================
   KULISSE 3 — Kaimauern, Kaistraßen (die Häuserzeilen sind Wörter)
   ===================================================================== */
{
  let k = "";
  for (const s of [-1, 1]) {
    /* Kaistraße (Klinker) zwischen Kaimauer und Fassade, 33–700 m */
    for (let i = 0; i < LUECKEN.length - 1; i++) {
      const a = Math.max(18, LUECKEN[i][1]), b = LUECKEN[i + 1][0];
      if (b <= a) continue;
      k += `<path d="${pz([P(s * KX, a, KAI), P(s * FX, a, KAI), P(s * FX, b, KAI), P(s * KX, b, KAI)])}" fill="${S.lg("klinker", [[0, "#8a6e60"], [1, "#6f5a50"]], 0, 0, 1, 0)}"/>`;
      /* Kaimauer zum Wasser (Backstein, unten nass und dunkel) */
      k += `<path d="${pz([P(s * KX, a, 0), P(s * KX, a, KAI), P(s * KX, b, KAI), P(s * KX, b, 0)])}" fill="${s < 0 ? "#6e4a3c" : "#4f3a33"}"/>`;
      k += `<path d="${pz([P(s * KX, a, 0), P(s * KX, a, 0.35), P(s * KX, b, 0.35), P(s * KX, b, 0)])}" fill="#2a3230" opacity=".7"/>`;
      k += `<path d="M${pt(P(s * KX, a, KAI))} L${pt(P(s * KX, b, KAI))}" stroke="#b9ab98" stroke-width=".6"/>`;
    }
  }
  /* Querkanal-Kaistraßen und Wasserstreifen zur Seite */
  for (const [a, b] of [[102, 111], [136, 145], [252, 261], [285, 294], [196, 206], [345, 354]]) for (const s of [-1, 1]) k += `<path d="${pz([P(s * KX, a, KAI), P(s * 40, a, KAI), P(s * 40, b, KAI), P(s * KX, b, KAI)])}" fill="#7d6658"/>`;
  S.hinten(k);
}

/* Sonne und Schatten auf den Kaistraßen; lange Abendschatten von Lastenrad und Radfahrerin */
{
  const Ds = (X) => 12 + (FX - X) * 0.839;
  const sonneL = pz([P(-FX, 18, KAI), P(-KX, 18, KAI), P(-KX, Ds(-KX), KAI), P(-FX, Ds(-FX), KAI)]);
  const schattenL = pz([P(-KX, Ds(-KX), KAI), P(-FX, Ds(-FX), KAI), P(-FX, 102, KAI), P(-KX, 102, KAI)]);
  const schattenR = pz([P(KX, 18, KAI), P(FX, 18, KAI), P(FX, 102, KAI), P(KX, 102, KAI)]);
  let k = `<path d="${sonneL}" fill="#ffc06a" opacity=".2"/><path d="${schattenL} ${schattenR}" fill="#1e2a48" opacity=".26"/>`;
  /* Schatten fällt nach links hinten (weg von der Sonne): Richtung (−0,766 | +0,643), Länge = Höhe / tan 17° */
  const wurf = (fuss, hoehe, breite) => {
    const L = hoehe / TAN, [X0, D0] = fuss, dx = -SX * L, dd = -SD * L, nx = 0.643, nd = 0.766;
    return pz([P(X0 + nx * breite, D0 + nd * breite, KAI), P(X0 + dx + nx * breite * 0.6, D0 + dd + nd * breite * 0.6, KAI), P(X0 + dx - nx * breite * 0.6, D0 + dd - nd * breite * 0.6, KAI), P(X0 - nx * breite, D0 - nd * breite, KAI)]);
  };
  const rad = (X0, X1, D, hh) => { const L = hh / TAN, dx = -SX * L, dd = -SD * L; return pz([P(X0, D - 0.15, KAI), P(X1, D - 0.15, KAI), P(X1 + dx, D - 0.15 + dd, KAI), P(X1 + dx, D + 0.25 + dd, KAI), P(X0 + dx, D + 0.25 + dd, KAI), P(X0, D + 0.25, KAI)]); };
  k += `<g fill="#1a2238" opacity=".34" filter="url(#${S.id("weich")})"><path d="${wurf([-8.45, 30.6], 1.68, 0.22)}"/><path d="${rad(-11.4, -8.6, 30.6, 0.95)}"/></g>`;
  S.hinten(k);
}

/* =====================================================================
   DIE GRACHT (Wort) — Wasser mit Spiegelungen
   ===================================================================== */
let GRACHT_KUNST = "";
{
  /* Hinten spiegelt das flach getroffene Wasser den warmen Abendhimmel, vorn (steiler Blick) sieht man die Eigenfarbe: Oliv-Braun */
  let k = `<path d="${WASSER_PFAD}" fill="${S.lg("wasser2", [[0, "#e6cdb2"], [0.06, "#b9b4b0"], [0.2, "#8a9590"], [0.45, "#5e685c"], [0.75, "#454a3a"], [1, "#363a2c"]], 0, 0, 0, 1, ` gradientUnits="userSpaceOnUse" x1="0" y1="${HOR}" x2="0" y2="262"`)}"/>`;
  GRACHT_KUNST = k;
}

/* =====================================================================
   DIE BRÜCKEN — gemauerte Bögen hintereinander, mit Lichterketten
   ===================================================================== */
const BOGEN = { b: 4.5, s: 0.5, k: 3.0, dh: 0.3 };   /* Brücke 1: halbe Spannweite, Kämpfer, Scheitel, Fahrbahn höher */
const BOGEN_R = { b: 3.6, s: 0.5, k: 2.35, dh: -0.1 };   /* die Brücken über die Reguliersgracht */
const bogenPkt = (D, n = 16, b = BOGEN.b, s = BOGEN.s, k = BOGEN.k) => { const o = []; for (let i = 0; i <= n; i++) { const a = Math.PI * i / n; o.push(P(-b * Math.cos(a), D, s + (k - s) * Math.sin(a))); } return o; };
const deckH = (X) => 3.2 + 0.25 * (1 - (X / 10) * (X / 10));
let BRUECKEN_SVG = "", BRUECKE1 = "", LICHTER_UNTER = null;
function bruecke(D, tiefe, nr) {
  /* Brücke 1 (Keizersgracht) ist höher und weiter gespannt; die Reguliersgracht-Brücken dahinter sind niedriger —
     so steht der Bogen der zweiten ganz im ersten, und die Schenkel der hinteren schauen unten heraus */
  const G = nr === 0 ? BOGEN : BOGEN_R, dH = (X) => deckH(X) + G.dh;
  const s = F / D, licht = sonnig(0, D - 0.5, 2), rueck = D + tiefe;
  let g = "";
  /* Durchblick: Wasser unter der Brücke (dunkel), Seitenwände */
  const vorn = bogenPkt(D, 16, G.b, G.s, G.k), hinten = bogenPkt(rueck, 16, G.b, G.s, G.k);
  const loch = (pts, Dd) => "M" + pt(P(-G.b, Dd, -0.05)) + " L" + pts.map(pt).join(" L") + " L" + pt(P(G.b, Dd, -0.05)) + " Z";
  g += `<path d="${loch(vorn, D)} ${loch(hinten, rueck)}" fill="${S.lg("tunnel", [[0, "#2a2a26"], [0.6, "#3c3a2e"], [1, "#4a4636"]])}" fill-rule="evenodd"/>`;
  /* Wasser unter der Brücke: es spiegelt die helle Öffnung dahinter — kein schwarzer Balken */
  g += `<path d="${pz([P(-G.b, D, 0), P(G.b, D, 0), P(G.b, rueck, 0), P(-G.b, rueck, 0)])}" fill="#8a8670" opacity=".6"/>`;
  /* Stirnseite mit Bogenöffnung */
  const L = [];
  for (let X = -11; X <= 11.01; X += 1) L.push(P(X, D, dH(X)));
  const stirn = "M" + pt(P(-11, D, 0)) + " L" + L.map(pt).join(" L") + " L" + pt(P(11, D, 0)) + " Z " + loch(vorn, D);
  const farbe = licht ? "#a35a3c" : "#6e4234";
  g += `<path d="${stirn}" fill="${farbe}" fill-rule="evenodd"/>`;
  /* Ziegelfugen: waagerechte Linien (sparsam) */
  const fern = D > 180;
  let fug = "";
  if (!fern) for (let h = 0.6; h < 2.7; h += 0.42) fug += `M${pt(P(-11, D, h))} L${pt(P(-G.b - 0.2, D, h))} M${pt(P(G.b + 0.2, D, h))} L${pt(P(11, D, h))} `;
  g += `<path d="${fug}" stroke="#3a2018" stroke-width="${r(Math.max(0.12, 0.03 * s))}" opacity=".45"/>`;
  /* Bogenring aus hellem Stein mit Fugen (Keilsteine) */
  const aussen = bogenPkt(D, 16, G.b + 0.55, G.s, G.k + 0.5);
  g += `<path d="M${aussen.map(pt).join(" L")} L${vorn.slice().reverse().map(pt).join(" L")} Z" fill="${licht ? "#f4e4c4" : nr === 0 ? "#c4baa8" : "#e2d2b4"}"/>`;
  let keil = "";
  if (!fern) for (let i = 1; i < 16; i++) keil += `M${pt(vorn[i])} L${pt(aussen[i])} `;
  g += `<path d="${keil}" stroke="#6d655c" stroke-width="${r(Math.max(0.1, 0.025 * s))}"/>`;
  /* Schlussstein im Scheitel */
  if (!fern) { const k1 = vorn[7], k2 = vorn[9], a1 = aussen[7], a2 = aussen[9], top = P(0, D, G.k + 0.62); g += `<path d="M${pt(k1)} L${pt(k2)} L${pt([a2[0], top[1]])} L${pt([a1[0], top[1]])} Z" fill="${licht ? "#fff4dc" : "#d6cfc2"}" stroke="#6d655c" stroke-width="${r(Math.max(0.1, 0.025 * s))}"/>`; }
  /* Gesims (Naturstein) und Geländer */
  g += `<path d="M${L.map(pt).join(" L")} L${L.slice().reverse().map((q) => pt([q[0], q[1] + 0.32 * s])).join(" L")} Z" fill="${licht ? "#f6e8cc" : "#d2c6b2"}"/>`;
  /* Pfosten im festen Takt (alle 2 m) */
  let pf = "";
  for (let X = -10; X <= 10.01; X += 2) { const a = P(X, D, dH(X)); pf += `M${pt(a)} L${pt([a[0], a[1] - 1.05 * s])} `; }
  g += `<path d="${pf}" stroke="#141c18" stroke-width="${r(Math.max(0.3, 0.09 * s))}"/>`;
  const gel = L.map((q) => [q[0], q[1] - 1.0 * s]);
  let staebe = "";
  for (let X = -10.5; X <= 10.5; X += fern ? 1.5 : 0.5) { const a = P(X, D, dH(X)); staebe += `M${pt(a)} L${pt([a[0], a[1] - 1.0 * s])} `; }
  g += `<path d="M${gel.map(pt).join(" L")}" stroke="#1f2a26" stroke-width="${r(Math.max(0.25, 0.06 * s))}" fill="none"/><path d="${staebe}" stroke="#1f2a26" stroke-width="${r(Math.max(0.1, 0.022 * s))}" opacity=".9"/>`;
  /* Sonne aus den Querkanälen: warme Kante oben */
  if (licht) g += `<path d="M${L.map(pt).join(" L")}" stroke="#ffd9a0" stroke-width="${r(0.08 * s)}" fill="none"/>`;
  /* Lichterkette: Birnen im Bogen und am Gesims — als gepunktete Linie (eine Birne alle 0,45 m) */
  const pd = (pts) => "M" + pts.map(pt).join(" L");
  const kette = bogenPkt(D - 0.05, 22, G.b + 0.3, G.s, G.k + 0.28), deckK = [];
  for (let X = -10; X <= 10; X += 1) deckK.push(P(X, D - 0.05, dH(X) - 0.05));
  const lp = `${pd(kette)} ${pd(deckK)}`, gap = r(Math.max(0.9, 0.45 * s)), bw = r(Math.max(0.5, 0.09 * s));
  g += `<path d="${lp}" fill="none" stroke="#ffcf7a" stroke-width="${r(Math.max(0.7, 0.2 * s))}" opacity=".35" filter="url(#${S.id("glimm")})"/><path d="${lp}" fill="none" stroke="#fff6d8" stroke-width="${bw}" stroke-linecap="round" stroke-dasharray="0 ${gap}"/>`;
  /* Spiegelung der Brücke: der gespiegelte Bogenring mit seinen Lichtern ergibt mit dem Bogen ein geschlossenes Oval */
  const sp = [];
  for (let X = -11; X <= 11.01; X += 1) sp.push(P(X, D, -dH(X)));
  const vornS = bogenPkt(D, 16, G.b, -G.s, -G.k), aussenS = bogenPkt(D, 16, G.b + 0.55, -G.s, -G.k - 0.5);
  SPIEGEL_B += `<path d="M${pt(P(-11, D, 0))} L${sp.map(pt).join(" L")} L${pt(P(11, D, 0))} Z M${pt(P(-G.b, D, 0))} L${vornS.map(pt).join(" L")} L${pt(P(G.b, D, 0))} Z" fill="${mix(farbe, "#262a2a", 0.35)}" fill-rule="evenodd"/>`;
  SPIEGEL_B += `<path d="M${aussenS.map(pt).join(" L")} L${vornS.slice().reverse().map(pt).join(" L")} Z" fill="${licht ? "#cbbd9e" : "#8f887c"}"/>`;
  SPIEGEL_B += `<path d="${pd(bogenPkt(D - 0.05, 22, G.b + 0.3, -G.s, -G.k - 0.28))}" fill="none" stroke="#ffe2a0" stroke-width="${bw}" stroke-linecap="round" stroke-dasharray="0 ${gap}"/>`;
  if (nr === 0) LICHTER_UNTER = { pts: kette, s, D };
  return g;
}
const FERN = [];
{
  const tiefen = [9, 9, 10, 9, 9, 9, 9];
  for (let i = BRUECKEN.length - 1; i >= 0; i--) {
    const g = bruecke(BRUECKEN[i], tiefen[i], i);
    if (i === 0) BRUECKE1 = g; else FERN.push({ D: BRUECKEN[i], g });
  }
}

/* =====================================================================
   SCHATTEN UND LICHT auf der linken Zeile (Sägezahn der rechten Giebel),
   sonnige Flecken auf dem Wasser
   ===================================================================== */
function lichtLinks() { return `<path d="${SCHATTEN_LINKS}" fill="#2a2c66" opacity=".5"/>`; }
/* rechte Zeile: Gegenlicht — Lichtkanten auf den Giebelkanten, die zur Sonne zeigen */
function lichtRechts() {
  let kanten = "";
  for (const h of RECHTS) if (h.d1 >= 33) {
    const u = umriss(h);
    for (let i = 2; i < u.length - 1; i++) {
      const [a0, b0] = u[i - 1], [a1, b1] = u[i];
      if (b1 > b0 + 0.05 || (Math.abs(b1 - b0) < 0.05 && b0 > h.He)) {
        const z = strecke(projU(1, h, a0, b0), projU(1, h, a1, b1));
        if (z) kanten += `M${pt(z[0])} L${pt(z[1])}`;
      }
    }
  }
  return `<path d="${kanten}" stroke="#ffd79a" stroke-width=".5" fill="none" opacity=".85"/>`;
}

/* =====================================================================
   BÄUME (Ulmen) — gelappte Kronen mit Himmelslöchern
   ===================================================================== */
/* geschlossene, glatte Kurve (Catmull-Rom) durch Punkte */
function rund(pts, ganz) {
  const n = pts.length, g = (i) => pts[(i + n) % n], rr = ganz ? Math.round : r;
  let d = `M${rr(pts[0][0])} ${rr(pts[0][1])}`;
  for (let i = 0; i < n; i++) { const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2); d += `C${rr(p1[0] + (p2[0] - p0[0]) / 6)} ${rr(p1[1] + (p2[1] - p0[1]) / 6)} ${rr(p2[0] - (p3[0] - p1[0]) / 6)} ${rr(p2[1] - (p3[1] - p1[1]) / 6)} ${rr(p2[0])} ${rr(p2[1])}`; }
  return d + "Z";
}
const ballen = (x, y, rr, z, n = 7) => rund(Array.from({ length: n }, (_, i) => { const a = i * Math.PI * 2 / n + z() * 0.3, q = rr * (0.78 + 0.32 * z()); return [x + Math.cos(a) * q, y + Math.sin(a) * q * 0.86]; }), rr > 3.5);
/* Laubkrone aus Blattballen: dunkler Grund, hellere Ballen oben rechts, Blattpunkte am Rand, Himmelslöcher dazwischen */
function krone(cx, cy, rx, ry, seed, sonne, fern) {
  const z = zufall(seed);
  if (fern) {
    /* ferne Kronen (wenige Einheiten groß): einfache Ballen */
    let c1 = "", c2 = "";
    for (let i = 0; i < 6; i++) { const a = i * 1.05 + z(), dd = i ? 0.55 : 0, x = cx + Math.cos(a) * dd * rx, y = cy + Math.sin(a) * dd * ry * 0.8, rc = Math.min(rx, ry) * (0.5 + z() * 0.15); c1 += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(rc)}"/>`; c2 += `<circle cx="${r(x + rc * 0.2)}" cy="${r(y - rc * 0.25)}" r="${r(rc * 0.6)}"/>`; }
    return `<g fill="${sonne ? "#7c9a3a" : "#627d36"}">${c1}</g><g fill="${sonne ? "#b6cc5a" : "#90ab4e"}">${c2}</g>`;
  }
  /* April: junges, lockeres Laub in gefransten Büscheln an den Astenden, Äste sichtbar, Himmel und Giebel scheinen durch */
  const fransen = (x, y, rr, n = 12) => rund(Array.from({ length: n }, (_, i) => { const a = i * Math.PI * 2 / n, q = rr * (i % 2 ? 0.7 + z() * 0.12 : 0.95 + z() * 0.15); return [x + Math.cos(a) * q, y + Math.sin(a) * q * 0.85]; }), rr > 4);
  const N = rx > 60 ? 13 : 10, gx = cx, gy = cy + ry * 0.95;
  let aeste = "", d1 = "", d2 = "", d3 = "";
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1), ang = -Math.PI * (0.06 + 0.88 * t) + (z() - 0.5) * 0.25, dist = 0.55 + 0.45 * z();
    const tx = cx + Math.cos(ang) * rx * dist, ty = cy + Math.sin(ang) * ry * dist * 0.95 + ry * 0.12;
    aeste += `M${r(gx)} ${r(gy)} Q${r(gx + (tx - gx) * 0.3)} ${r(gy + (ty - gy) * 0.75)} ${r(tx)} ${r(ty)}`;
    const k = 2 + Math.floor(z() * 2);
    for (let j = 0; j < k; j++) {
      const rc = Math.min(rx, ry) * (0.16 + z() * 0.1), x = tx + (z() - 0.5) * rc * 1.6, y = ty + (z() - 0.5) * rc * 1.2;
      d1 += fransen(x - rc * 0.12, y + rc * 0.16, rc);
      d2 += fransen(x + rc * 0.1, y - rc * 0.12, rc * 0.72, 10);
      if (z() < 0.6) d3 += fransen(x + rc * 0.32, y - rc * 0.3, rc * 0.34, 8);
    }
  }
  const sw = Math.max(0.25, Math.min(rx, ry) * 0.022);
  return `<path d="${aeste}" stroke="#5e5248" stroke-width="${r(sw)}" fill="none" stroke-linecap="round"/><path d="${d1}" fill="${sonne ? "#6f8f30" : "#556f2c"}" opacity=".95"/><path d="${d2}" fill="${sonne ? "#a9c44a" : "#82a03e"}" opacity=".95"/><path d="${d3}" fill="${sonne ? "#e0e884" : "#b2c766"}" opacity=".85"/>`;
}
function ulme(X, D, seed) {
  const [bx, by] = P(X, D, KAI), s = F / D, z = zufall(seed), sonne = X < 0 && sonnig(X, D, 9);
  const lean = (X < 0 ? 1 : -1) * 0.5 * s;
  let g = "";
  /* Stamm und Hauptäste (Ulme: früh verzweigt, Vasenform) */
  const tw = 0.42 * s, fork = 3.4 * s;
  g += `<path d="M${r(bx - tw / 2)} ${r(by)} Q${r(bx - tw * 0.4 + lean * 0.3)} ${r(by - fork * 0.6)} ${r(bx - tw * 0.3 + lean * 0.5)} ${r(by - fork)} L${r(bx + tw * 0.3 + lean * 0.5)} ${r(by - fork)} Q${r(bx + tw * 0.4 + lean * 0.3)} ${r(by - fork * 0.6)} ${r(bx + tw / 2)} ${r(by)} Z" fill="${S.lg("stamm", [[0, "#3a352f"], [0.6, "#57514a"], [1, "#2c2824"]], 0, 0, 1, 0)}"/>`;
  let aeste = "";
  for (const [dx, dy] of [[-1.6, -4.2], [-0.4, -5.2], [1.3, -4.4], [2.2, -3]]) aeste += `M${r(bx + lean * 0.5)} ${r(by - fork)} Q${r(bx + lean * 0.7 + dx * 0.4 * s)} ${r(by - fork - dy * -0.4 * s)} ${r(bx + lean + dx * s)} ${r(by - fork + dy * s * 0.8)} `;
  g += `<path d="${aeste}" stroke="#4a4038" stroke-width="${r(0.1 * s)}" fill="none" stroke-linecap="round"/>`;
  const cx = bx + lean, cy = by - (KAI + 7.6 - KAI) * s;
  g += krone(cx, cy, 3.6 * s, 2.7 * s, seed, sonne, D > 100);
  return { g, bx, by, sonne };
}

/* 5 — DIE ULMEN (hintere Reihe zuerst, die nahen später) */
const ULMEN = { fern: [], nah: [] };
for (const s of [-1, 1]) {
  const liste = s < 0 ? [[22, 1], [150, 5], [168, 6], [224, 7]] : [[22, 11], [40, 12], [62, 14], [84, 16], [150, 17], [175, 18], [228, 19]];
  for (const [D, seed] of liste) (D < 100 ? ULMEN.nah : ULMEN.fern).push({ X: s * 9.3, D, seed });
}

/* =====================================================================
   3-D-Prisma (Boote): Grundriss als Liste (X, D), Höhe h0 … h1
   ===================================================================== */
function prisma(grund, h0, h1, farbe, dachFarbe, licht) {
  let fl = 0;
  for (let i = 0; i < grund.length; i++) { const a = grund[i], b = grund[(i + 1) % grund.length]; fl += a[0] * b[1] - b[0] * a[1]; }
  if (fl < 0) grund = grund.slice().reverse();
  const n = grund.length, flaechen = [];
  for (let i = 0; i < n; i++) {
    const a = grund[i], b = grund[(i + 1) % n];
    const nx = b[1] - a[1], nd = -(b[0] - a[0]);   /* Außennormale bei Umlauf gegen den Uhrzeiger (Draufsicht X rechts, D vorn) */
    const mx = (a[0] + b[0]) / 2, md = (a[1] + b[1]) / 2;
    if (nx * (0 - mx) + nd * (0 - md) <= 0) continue;
    const hell = Math.max(0, (nx * SX + nd * SD) / Math.hypot(nx, nd));
    flaechen.push({ d: md, svg: `<path d="${pz([P(a[0], a[1], h0), P(b[0], b[1], h0), P(b[0], b[1], h1), P(a[0], a[1], h1)])}" fill="${mix(farbe, licht ? "#ffd9a0" : "#9fb4c8", licht ? hell * 0.35 : 0.08 + hell * 0.05)}"/>` });
  }
  flaechen.sort((p, q) => q.d - p.d);
  let g = flaechen.map((f) => f.svg).join("");
  if (dachFarbe && h1 < E) g += `<path d="${pz(grund.map(([x, d]) => P(x, d, h1)))}" fill="${dachFarbe}"/>`;
  return g;
}

/* Fahrrad als Vorlage (1 Einheit = 1 m, Hinterrad-Aufstand bei 0|0, Fahrtrichtung +x), Farbe über color */
S.def(`<g id="${S.id("rad")}" fill="none" stroke="currentColor" stroke-width=".04" stroke-linecap="round"><circle cx=".0" cy="-.34" r=".33"/><circle cx="1.1" cy="-.34" r=".33"/><path d="M0 -.34 L.42 -.36 L.36 -.8 M.42 -.36 L.98 -.78 L1.1 -.34 M.36 -.8 L.98 -.78 M.98 -.78 L.95 -1.0 L.8 -1.03" stroke-width=".05"/><path d="M.28 -.86 L.46 -.86" stroke="#3a2618" stroke-width=".06"/><path d="M-.05 -.5 L.3 -.5" stroke-width=".03"/></g>`);
const radUse = (x, y, s, farbe, links) => `<use href="#${S.id("rad")}" transform="translate(${r(x)} ${r(y)}) scale(${(links ? -s : s).toFixed(3)} ${s.toFixed(3)})" color="${farbe}"/>`;
/* =====================================================================
   TEILE — hinten zuerst
   ===================================================================== */
/* 1 — DIE GRACHT (das Wasser mit allen Spiegelungen) */
{
  let k = GRACHT_KUNST;
  /* Spiegelungen: durch waagrechte Wellenbänder gebrochen (Lücken nach vorn größer), nach vorn schwächer (steiler Blick) */
  S.def(`<pattern id="${S.id("baender")}" width="400" height="2.6" patternUnits="userSpaceOnUse"><rect width="400" height="1.9" fill="#fff"/><rect x="-6" y="1.9" width="140" height=".7" fill="#fff" opacity=".5"/></pattern>`);
  S.def(`<pattern id="${S.id("baender2")}" width="400" height="5.2" patternUnits="userSpaceOnUse"><rect width="400" height="3.1" fill="#fff"/><rect x="220" y="3.1" width="120" height="2.1" fill="#fff" opacity=".6"/></pattern>`);
  S.def(`<mask id="${S.id("spmaske")}" maskUnits="userSpaceOnUse" x="0" y="${HOR}" width="400" height="${262 - HOR}"><rect y="${HOR}" width="400" height="40" fill="url(#${S.id("baender")})"/><rect y="${HOR + 40}" width="400" height="${222 - HOR}" fill="url(#${S.id("baender2")})"/><rect y="${HOR}" width="400" height="${262 - HOR}" fill="${S.lg("spfade", [[0, "#000", 0.1], [0.35, "#000", 0.35], [1, "#000", 0.82]], 0, 0, 0, 1, ` gradientUnits="userSpaceOnUse" x1="0" y1="${HOR}" x2="0" y2="262"`)}"/></mask>`);
  S.def(`<mask id="${S.id("spmaske2")}" maskUnits="userSpaceOnUse" x="0" y="${HOR}" width="400" height="${262 - HOR}"><rect y="${HOR}" width="400" height="${262 - HOR}" fill="url(#${S.id("baender")})" opacity=".9"/></mask>`);
  k += `<g clip-path="url(#${S.id("wasserclip")})"><g mask="url(#${S.id("spmaske")})" opacity=".85">${SPIEGEL}</g><g mask="url(#${S.id("spmaske2")})">${SPIEGEL_B}</g></g>`;
  /* Abendsonne durch die Lücke der Herengracht: warmes Licht auf dem nahen Wasser bis zur Schattenkante */
  const kante = []; for (let X = -KX; X <= KX + 0.01; X += 2) kante.push(P(X, 12 + (FX - X) * 0.839, 0));
  k += `<path d="${pz([P(-KX, 9, 0), P(KX, 9, 0), ...kante.reverse()])}" fill="${S.lg("sonnestreif", [[0, "#ffb860", 0.45], [1, "#ffc77a", 0.12]])}"/>`;
  /* kleine Wellen: helle Striche, vorn länger */
  const zw = zufall(91);
  let wl = "";
  for (let i = 0; i < 46; i++) { const D = 14 + Math.pow(zw(), 1.6) * 90, X = (zw() * 2 - 1) * KX * 0.95, [x, y] = P(X, D, 0), L = (0.6 + zw() * 1.4) * F / D; wl += `M${r(x - L / 2)} ${r(y)} Q${r(x)} ${r(y - 0.12 * F / D)} ${r(x + L / 2)} ${r(y)}`; }
  k += `<path d="${wl}" stroke="#dfeaee" stroke-width=".3" fill="none" opacity=".3" clip-path="url(#${S.id("wasserclip")})"/>`;
  S.teil({ id: "gracht", de: "die Gracht", syl: "GRACHT", it: "il canale", itSyl: "ca-NA-le", en: "canal", anker: [200, 200], kunst: k,
    tipp: "Die Grachten wurden im 17. Jahrhundert gegraben. Der Grachtengürtel ist UNESCO-Welterbe." });
}
/* ferne Brücken (2–7) als Kulisse über dem Wasser — Teil der Brücke (Wort) unten */

/* 2 — DIE HÄUSERZEILE RECHTS (Kulisse) und LINKS (Wort: das Grachtenhaus) */
/* die rechte Zeile ist Kulisse (dasselbe Wort wie links wäre doppelt) */
S.hinten(kappe(ZR.out + fensterSVG(1, false) + lichtRechts()));

/* die Lupe des Grachtenhauses: Giebelformen und Lastenhaken */
const grachtUnter = [];
{
  const nachTyp = (t) => giebelInfo.find((g) => g.umriss && g.h.typ === t);
  const giebelFlaeche = (g) => {
    const pts = g.umriss.filter((q, i) => i > 0 && i < g.umriss.length - 1);
    const xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]);
    const top = Math.min(...ys), x0 = Math.min(...xs), x1 = Math.max(...xs);
    const yE = P(0, g.h.d0 + g.h.w / 2, g.h.He)[1];
    return { x: (x0 + x1) / 2, y: yE, kunst: flaeche(x0 - (x0 + x1) / 2, top - yE, x1 - x0, yE - top + 1, 0.4) };
  };
  for (const [t, id, de, syl, it, itSyl, en, tipp] of [
    ["trap", "treppengiebel", "der Treppengiebel", "TREP-pen-gie-bel", "il frontone a gradini", "fron-TO-ne a gra-DI-ni", "step gable", "Der Treppengiebel ist die älteste Giebelform an den Grachten."],
    ["hals", "halsgiebel", "der Halsgiebel", "HALS-gie-bel", "il frontone a collo", "fron-TO-ne a COL-lo", "neck gable", "Der Halsgiebel hat einen schmalen „Hals“ und verzierte Seitenstücke."],
    ["klok", "glockengiebel", "der Glockengiebel", "GLO-cken-gie-bel", "il frontone a campana", "fron-TO-ne a cam-PA-na", "bell gable", "Der Glockengiebel sieht aus wie eine Glocke."]]) {
    const g = nachTyp(t); if (!g) continue;
    const f = giebelFlaeche(g);
    grachtUnter.push({ id, de, syl, it, itSyl, en, tipp, x: f.x, y: f.y, kunst: f.kunst });
  }
  const hk = giebelInfo.find((g) => g.haken && g.h.typ === "trap");
  if (hk) { const [a, b, c] = hk.haken; grachtUnter.push({ id: "lastenhaken", de: "der Lastenhaken", syl: "LAS-ten-ha-ken", it: "il gancio di carico", itSyl: "GAN-cio di CA-ri-co", en: "hoisting hook", x: b[0], y: c[1] + 1,
    tipp: "Oben am Balken hängt der Haken. Mit einem Seil zieht man Möbel durch das Fenster — die Treppen sind zu eng.",
    kunst: flaeche(Math.min(a[0], b[0]) - b[0] - 0.8, a[1] - c[1] - 2.2, Math.abs(b[0] - a[0]) + 2.4, c[1] - a[1] + 3.4, 0.3) }); }
}
S.teil({ id: "grachtenhaus", de: "das Grachtenhaus", syl: "GRACH-ten-haus", it: "la casa sul canale", itSyl: "CA-sa sul ca-NA-le", en: "canal house", anker: [60, 70],
  kunst: ZL.out + fensterSVG(-1, true) + lichtLinks(),
  tipp: "Bauland am Wasser war sehr teuer — darum sind die Grachtenhäuser schmal und hoch. Viele sind über 300 Jahre alt.",
  zoom: { x: 74, y: 0, w: 72, h: 48 }, unter: grachtUnter });

/* 3 — DIE BRÜCKEN: die erste (Keizersgracht) ist das Wort, die hinteren gehören dazu */
{
  let unter = [];
  if (LICHTER_UNTER) {
    const p = LICHTER_UNTER.pts, xs = p.map((q) => q[0]), ys = p.map((q) => q[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys);
    const yb = P(0, BRUECKEN[0], BOGEN.s)[1];
    unter.push({ id: "lichterkette", de: "die Lichterkette", syl: "LICH-ter-ket-te", it: "la catena di luci", itSyl: "ca-TE-na di LU-ci", en: "string of lights", x: (x0 + x1) / 2, y: y0, kunst: `<path class="bw-flaeche" d="M${r(x0 - (x0 + x1) / 2)} ${r(yb - y0)} ${p.map((q) => `L${r(q[0] - (x0 + x1) / 2)} ${r(q[1] - y0)}`).join(" ")}" stroke="rgba(255,255,255,0.001)" stroke-width="1.6" fill="none"/>`,
      tipp: "Abends leuchten an vielen Brücken kleine Lampen. Die Bögen spiegeln sich im Wasser." });
    const yu = P(0, BRUECKEN[0], 0)[1];
    unter.push({ id: "bogen", de: "der Bogen", syl: "BO-gen", it: "l'arco", itSyl: "AR-co", en: "arch", x: (x0 + x1) / 2, y: yu, kunst: flaeche(x0 - (x0 + x1) / 2 + 2.5, y0 - yu + 1.4, x1 - x0 - 5, yu - y0 - 1.4, 0.6) });
  }
  const [bx, by] = P(0, BRUECKEN[0], 0);
  for (const u of ULMEN.fern) FERN.push({ D: u.D, g: ulme(u.X, u.D, u.seed).g });
  /* drei Räder lehnen am Geländer der ersten Brücke */
  for (const [X, f] of [[-7.2, "#1d1e22"], [-5.6, "#2a4a7a"], [6.0, "#1d1e22"]]) { const D = BRUECKEN[0] + 0.4, [x, y] = P(X, D, deckH(X) + BOGEN.dh); BRUECKE1 += radUse(x, y, F / D, f, X > 0); }
  BRUECKEN_SVG = FERN.sort((a, b) => b.D - a.D).map((f) => f.g).join("");
  S.teil({ id: "bruecke", de: "die Brücke", syl: "BRÜ-cke", it: "il ponte", itSyl: "PON-te", en: "bridge", anker: [bx, by], kunst: BRUECKEN_SVG + BRUECKE1,
    tipp: "Hinter dieser Brücke liegen sechs weitere hintereinander — man sieht ihre Bögen und Lichter. Amsterdam hat über 1500 Brücken.",
    zoom: { x: 152, y: 98, w: 96, h: 40 }, unter });
}

/* 4 — DER RADFAHRER auf der ersten Brücke (fährt nach rechts; klein: eigene, schlanke Zeichnung) */
{
  const D = BRUECKEN[0] + 2.2, X = -2.4, [fx, fy] = P(X, D, deckH(X) + BOGEN.dh), s = F / D;
  const q = (a, b) => `${r(a * s)} ${r(b * s)}`, rr = 0.34;
  let k = `<g fill="none" stroke="#1b1d1f" stroke-width="${r(0.05 * s)}"><circle cx="${r(-0.55 * s)}" cy="${r(-rr * s)}" r="${r(rr * s)}"/><circle cx="${r(0.55 * s)}" cy="${r(-rr * s)}" r="${r(rr * s)}"/></g>`;
  k += `<path d="M${q(-0.55, -rr)} L${q(-0.1, -rr)} L${q(0.38, -0.82)} M${q(-0.1, -rr)} L${q(-0.18, -0.84)} L${q(0.38, -0.82)} L${q(0.55, -rr)} M${q(0.38, -0.82)} L${q(0.33, -1.02)} L${q(0.24, -1.04)}" stroke="#2d5a8a" stroke-width="${r(0.05 * s)}" fill="none"/>`;
  /* Beine (Jeans), Oberkörper (Jacke), Arme zum Lenker, Kopf */
  k += `<path d="M${q(-0.16, -0.95)} L${q(0.05, -0.62)} L${q(-0.05, -0.32)} M${q(-0.16, -0.95)} L${q(-0.25, -0.58)} L${q(-0.12, -0.3)}" stroke="#3d5f8c" stroke-width="${r(0.11 * s)}" stroke-linecap="round" fill="none"/>`;
  k += `<path d="M${q(-0.24, -0.92)} Q${q(-0.22, -1.42)} ${q(0.02, -1.5)} L${q(0.12, -1.42)} Q${q(0.0, -1.1)} ${q(-0.08, -0.9)} Z" fill="#b8473a"/>`;
  k += `<path d="M${q(0.03, -1.4)} L${q(0.24, -1.05)}" stroke="#a63e33" stroke-width="${r(0.07 * s)}" stroke-linecap="round"/>`;
  k += `<circle cx="${r(0.08 * s)}" cy="${r(-1.62 * s)}" r="${r(0.11 * s)}" fill="#eec6a4"/><path d="M${q(-0.03, -1.66)} Q${q(0.06, -1.78)} ${q(0.19, -1.67)} L${q(0.12, -1.64)} Z" fill="#c9a466"/>`;
  S.teil({ oben: true, id: "radfahrer", de: "der Radfahrer", syl: "RAD-fah-rer", it: "il ciclista", itSyl: "ci-CLI-sta", en: "cyclist", x: fx, y: fy, kunst: `<g ${VOLS}>${k}</g>`,
    tipp: "In Amsterdam gibt es über 800 000 Fahrräder." });
}

let LINKS_BOOT = "";
{
  /* links: umgebauter Lastkahn (dunkelgrüner Rumpf, Holzaufbau, Steuerhaus) */
  const D0 = 31, D1 = 50, X0 = -7.9, X1 = -5.0;
  const bug = [[X0, D0 + 1.2], [X0 + 0.6, D0], [X1 - 0.6, D0], [X1, D0 + 1.2], [X1, D1], [X0, D1]];
  let k = prisma(bug.slice().reverse(), 0, 1.0, "#1f3a30", "#5b4a3a", sonnig(X1, D0 + 4, 1));
  k += prisma([[X0 + 0.3, D0 + 4], [X0 + 0.3, D1 - 1], [X1 - 0.25, D1 - 1], [X1 - 0.25, D0 + 4]], 1.0, 2.5, "#8a5a36", "#3e3a36", sonnig(X1, D0 + 6, 2));
  k += prisma([[X0 + 0.7, D0 + 1.6], [X0 + 0.7, D0 + 3.4], [X1 - 0.6, D0 + 3.4], [X1 - 0.6, D0 + 1.6]], 1.0, 2.35, "#6b4226", "#2c3236", sonnig(X1, D0 + 2, 2));
  { const q = [P(X1 - 0.6, D0 + 1.8, 1.7), P(X1 - 0.6, D0 + 3.2, 1.7), P(X1 - 0.6, D0 + 3.2, 2.15), P(X1 - 0.6, D0 + 1.8, 2.15)]; k += `<path d="${pz(q)}" fill="#24323a" stroke="#efe9dc" stroke-width=".35"/>`; }
  let fen = "";
  for (let d = D0 + 5; d < D1 - 2; d += 3) fen += `M${pt(P(X1 - 0.25, d, 1.4))} L${pt(P(X1 - 0.25, d + 1.8, 1.4))} L${pt(P(X1 - 0.25, d + 1.8, 2.1))} L${pt(P(X1 - 0.25, d, 2.1))} Z`;
  k += `<path d="${fen}" fill="#2a2a2e" stroke="#f0ece2" stroke-width=".4"/>`;
  k += `<path d="M${pt(P(X1, D0 + 1.2, 0.98))} L${pt(P(X1, D1, 0.98))}" stroke="#e9e2cf" stroke-width=".7"/>`;
  /* Blumenkästen und Fahrrad auf dem Deck */
  for (let i = 0; i < 4; i++) { const d = D0 + 6 + i * 3, [x, y] = P(X1 - 0.25, d, 2.5), s = F / d; k += `<ellipse cx="${r(x - 0.4 * s)}" cy="${r(y - 0.2 * s)}" rx="${r(0.5 * s)}" ry="${r(0.35 * s)}" fill="#557f37"/><circle cx="${r(x - 0.2 * s)}" cy="${r(y - 0.42 * s)}" r="${r(0.12 * s)}" fill="#e2364a"/><circle cx="${r(x - 0.55 * s)}" cy="${r(y - 0.38 * s)}" r="${r(0.1 * s)}" fill="#f4d24a"/>`; }
  const [hx, hy] = P(X1, D0 + 8, 0);
  LINKS_BOOT = { k, hx, hy };
}
/* 6 — DIE HAUSBOOTE an den Kaimauern */
{
  /* rechts: kastenförmige „Arke“ (graublau), Pflanzen auf dem Dach */
  const D0 = 47, D1 = 66, X0 = 5.0, X1 = 7.8;
  let k = prisma([[X0, D0], [X1, D0], [X1, D1], [X0, D1]], 0, 0.9, "#2b3236", "#3a4246", false);
  k += prisma([[X0 + 0.2, D0 + 0.6], [X1 - 0.1, D0 + 0.6], [X1 - 0.1, D1 - 0.8], [X0 + 0.2, D1 - 0.8]], 0.9, 2.7, "#6f8796", "#46514f", false);
  /* Fensterband auf der Gracht-Seite */
  let fen = "";
  for (let d = D0 + 1.6; d < D1 - 2; d += 2.6) fen += `M${pt(P(X0 + 0.2, d, 1.4))} L${pt(P(X0 + 0.2, d + 1.6, 1.4))} L${pt(P(X0 + 0.2, d + 1.6, 2.3))} L${pt(P(X0 + 0.2, d, 2.3))} Z`;
  k += `<path d="${fen}" fill="#273038" stroke="#e8e6df" stroke-width=".35"/>`;
  for (let i = 0; i < 6; i++) { const d = D0 + 2 + i * 2.8, [x, y] = P(X0 + 1.2, d, 2.7), s = F / d; k += `<ellipse cx="${r(x)}" cy="${r(y - 0.3 * s)}" rx="${r(0.35 * s)}" ry="${r(0.3 * s)}" fill="${i % 2 ? "#4f7a35" : "#6c8f3e"}"/><rect x="${r(x - 0.2 * s)}" y="${r(y - 0.1 * s)}" width="${r(0.4 * s)}" height="${r(0.15 * s)}" fill="#a65d3a"/>`; }
  /* Spiegelung */
  const [hx, hy] = P(X0, (D0 + D1) / 2, 0);
  S.teil({ id: "hausboot", de: "das Hausboot", syl: "HAUS-boot", it: "la casa galleggiante", itSyl: "CA-sa gal-leg-GIAN-te", en: "houseboat", anker: [LINKS_BOOT.hx, LINKS_BOOT.hy], kunst: k + LINKS_BOOT.k,
    tipp: "In den Grachten liegen etwa 2500 Hausboote. Viele waren früher Lastkähne." });
}

/* 7 — DER REIHER auf dem Dach des Lastkahns */
{
  const D = 38, X = -6.9, [x, y] = P(X, D, 2.5), s = F / D;
  const q = (a, b) => `${r(a * s)} ${r(b * s)}`;
  let k = `<path d="M${q(-0.05, 0)} L${q(-0.04, -0.42)} M${q(0.07, 0)} L${q(0.05, -0.42)}" stroke="#c9a46a" stroke-width="${r(0.025 * s)}"/>`;
  k += `<path d="M${q(-0.32, -0.42)} Q${q(-0.25, -0.72)} ${q(0.05, -0.74)} Q${q(0.2, -0.72)} ${q(0.18, -0.55)} Q${q(0.05, -0.38)} ${q(-0.32, -0.42)} Z" fill="#8f979d"/>`;
  k += `<path d="M${q(-0.3, -0.5)} Q${q(-0.1, -0.68)} ${q(0.12, -0.66)}" stroke="#4d5358" stroke-width="${r(0.05 * s)}" fill="none"/>`;
  k += `<path d="M${q(0.12, -0.68)} Q${q(0.2, -0.95)} ${q(0.12, -1.1)} Q${q(0.06, -1.2)} ${q(0.16, -1.24)}" stroke="#d9dcdc" stroke-width="${r(0.06 * s)}" fill="none" stroke-linecap="round"/>`;
  k += `<ellipse cx="${r(0.2 * s)}" cy="${r(-1.25 * s)}" rx="${r(0.07 * s)}" ry="${r(0.05 * s)}" fill="#e8eaea"/><path d="M${q(0.26, -1.26)} L${q(0.45, -1.22)} L${q(0.26, -1.22)} Z" fill="#e2b13a"/><path d="M${q(0.13, -1.28)} L${q(0.02, -1.24)}" stroke="#1d1d1f" stroke-width="${r(0.02 * s)}"/>`;
  S.teil({ oben: true, id: "reiher", de: "der Reiher", syl: "REI-her", it: "l'airone", itSyl: "ai-RO-ne", en: "heron", x, y, kunst: `<g ${VOL}>${k}</g>`,
    tipp: "Graureiher leben mitten in Amsterdam. Sie warten am Wasser auf Fische." });
}

/* 8 — DAS RUNDFAHRTBOOT (kommt auf uns zu: flacher Rumpf, Kabine mit gewölbtem Glasdach) */
{
  const c = 1.45, D0 = 25, L = 24, w = 2.1;
  const runde = (w0, d0, tief, n = 10) => { const o = []; for (let i = 0; i <= n; i++) { const a = Math.PI * i / n; o.push([c - w0 * Math.cos(a), d0 + tief - tief * Math.sin(a)]); } return o; };
  const bug = runde(w, D0, 2.2);
  const rumpf = [[c - w, D0 + L], ...bug, [c + w, D0 + L]];
  const licht = sonnig(c, D0, 0.5);
  let k = prisma(rumpf, 0, 0.8, "#1d2b47", "#26365a", licht);
  /* weiße Scheuerleiste */
  k += `<path d="M${pt(P(c - w, D0 + L, 0.8))} L${bug.map((q) => pt(P(q[0], q[1], 0.8))).join(" L")} L${pt(P(c + w, D0 + L, 0.8))}" stroke="#ecebe5" stroke-width=".9" fill="none"/>`;
  /* Kabine: Glaswände, gewölbtes Glasdach mit Streben */
  const kab = [[c - w + 0.25, D0 + L - 0.5], ...runde(w - 0.25, D0 + 1.6, 1.3), [c + w - 0.25, D0 + L - 0.5]];
  k += prisma(kab, 0.8, 1.55, "#3e5d74", null, licht);
  const dachPkt = (hh, inset) => [[c - w + inset, D0 + L - 0.5], ...runde(w - inset, D0 + 1.6 + inset * 0.4, 1.3 - inset * 0.3), [c + w - inset, D0 + L - 0.5]].map(([x, d]) => P(x, d, hh));
  k += `<path d="${pz(dachPkt(1.55, 0.25))}" fill="#c9d6dc"/>`;
  k += `<path d="${pz(dachPkt(1.8, 0.9))}" fill="${S.lg("glasdach", [[0, "#dbe7ec"], [0.35, "#9fb9c6"], [1, "#6e8c9c"]])}"/>`;
  /* Fahrgäste schemenhaft unter dem Glas */
  const z = zufall(8);
  let koepfe = "";
  for (let d = D0 + 4.5; d < D0 + L - 2; d += 1.8) for (const dx of [-1.25, -0.45, 0.45, 1.25]) { if (z() < 0.4) continue; const [x, y] = P(c + dx, d, 1.45), ss = F / d; koepfe += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(0.1 * ss)}" fill="${["#3a2a20", "#b8925a", "#5a3e2c", "#26211f"][Math.floor(z() * 4)]}"/>`; }
  /* (Fahrgäste nicht einzeln: hinter dem spiegelnden Glas nur Schatten) */
  let streb = "";
  for (let d = D0 + 3.4; d < D0 + L - 1; d += 1.6) streb += `M${pt(P(c - w + 0.3, d, 1.58))} L${pt(P(c - w + 0.9, d, 1.8))} L${pt(P(c + w - 0.9, d, 1.8))} L${pt(P(c + w - 0.3, d, 1.58))} `;
  k += `<path d="${streb}" stroke="#f2f4f2" stroke-width=".3" fill="none" opacity=".9"/>`;
  /* Himmelsspiegelung als heller Streifen auf dem Glas */
  k += `<path d="${pz([P(c - 0.6, D0 + 3, 1.8), P(c + 0.2, D0 + 3, 1.8), P(c + 0.6, D0 + 14, 1.8), P(c - 0.1, D0 + 14, 1.8)])}" fill="#fff" opacity=".28"/>`;
  /* Rettungsring vorn und Positionslicht */
  { const [x, y] = P(c + 1.0, D0 + 1.75, 1.15), ss = F / (D0 + 1.75); k += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(0.24 * ss)}" fill="none" stroke="#e8e4da" stroke-width="${r(0.09 * ss)}"/><path d="M${r(x - 0.24 * ss)} ${r(y)} a${r(0.24 * ss)} ${r(0.24 * ss)} 0 0 1 ${r(0.17 * ss)} ${r(-0.17 * ss)}" fill="none" stroke="#c8352e" stroke-width="${r(0.09 * ss)}"/>`; }
  { const [x, y] = P(c, D0 + 0.05, 0.9); k += `<circle cx="${r(x)}" cy="${r(y)}" r=".7" fill="#fff4cc"/>`; }
  /* Bugwelle */
  const [wx, wy] = P(c, D0, 0), sw = F / D0;
  k += `<path d="M${r(wx - 2.5 * sw)} ${r(wy + 2)} Q${r(wx - 1.4 * sw)} ${r(wy - 0.4)} ${r(wx)} ${r(wy - 0.2)} Q${r(wx + 1.4 * sw)} ${r(wy - 0.4)} ${r(wx + 2.5 * sw)} ${r(wy + 2)}" stroke="#eef4f4" stroke-width=".8" fill="none" opacity=".75"/>`;
  k += `<path d="M${r(wx - 3.2 * sw)} ${r(wy + 5)} q${r(0.8 * sw)} -1 ${r(1.6 * sw)} 0 M${r(wx + 1.6 * sw)} ${r(wy + 5)} q${r(0.8 * sw)} -1 ${r(1.6 * sw)} 0" stroke="#dfe9ec" stroke-width=".5" fill="none" opacity=".5"/>`;
  /* Spiegelung des Rumpfs */
  const spg = pz(bug.map((q) => P(q[0], q[1], -0.8)).concat(bug.slice().reverse().map((q) => P(q[0], q[1], 0))));
  k = `<path d="${spg}" fill="#101a30" opacity=".5" filter="url(#${S.id("weich")})"/>` + k;
  S.teil({ id: "rundfahrtboot", de: "das Rundfahrtboot", syl: "RUND-fahrt-boot", it: "il battello turistico", itSyl: "bat-TEL-lo tu-RI-sti-co", en: "canal boat", anker: [wx, wy], kunst: k,
    tipp: "Mit dem Rundfahrtboot fährt man durch die Grachten. Durch das Glasdach sieht man die Häuser." });
}

/* 9 — DIE ENTEN vor dem Boot */
{
  const ente = (X, D, f) => { const [x, y] = P(X, D, 0), s = F / D, q = (a, b) => `${r(x + a * s)} ${r(y + b * s)}`;
    return `<path d="M${q(-0.22, 0)} Q${q(-0.24, -0.14)} ${q(-0.05, -0.15)} L${q(0.1, -0.16)} Q${q(0.2, -0.16)} ${q(0.22, 0)} Z" fill="${f}"/><circle cx="${r(x + 0.14 * s)}" cy="${r(y - 0.24 * s)}" r="${r(0.08 * s)}" fill="${f === "#6d5a48" ? "#6d5a48" : "#2f6a4a"}"/><path d="M${q(0.21, -0.24)} l${r(0.08 * s)} ${r(0.02 * s)}" stroke="#e2b13a" stroke-width="${r(0.04 * s)}"/><path d="M${q(-0.3, 0.03)} q${r(0.25 * s)} ${r(0.05 * s)} ${r(0.55 * s)} 0" stroke="#dfe9ec" stroke-width=".3" fill="none" opacity=".6"/>`; };
  const k = ente(-2.2, 20, "#6d5a48") + ente(-1.5, 21.5, "#8a8478");
  const [x, y] = P(-1.9, 20.6, 0);
  S.teil({ oben: true, id: "ente", de: "die Ente", syl: "EN-te", it: "l'anatra", itSyl: "A-na-tra", en: "duck", x, y, kunst: `<g transform="translate(${r(-x)} ${r(-y)})">${k}</g>` });
}

/* 10 — DIE LATERNE (Grachtenlaterne, rechter Kai) */
{
  const D = 29, X = 8.6, [x, y] = P(X, D, KAI), s = F / D;
  let k = `<path d="M${r(-0.09 * s)} 0 L${r(-0.06 * s)} ${r(-3.3 * s)} L${r(0.06 * s)} ${r(-3.3 * s)} L${r(0.09 * s)} 0 Z" fill="${S.lg("mast", [[0, "#2a3a32"], [0.5, "#43574c"], [1, "#1b2620"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${r(-0.16 * s)}" y="${r(-0.5 * s)}" width="${r(0.32 * s)}" height="${r(0.5 * s)}" rx="${r(0.05 * s)}" fill="#22302a"/>`;
  k += `<path d="M${r(-0.2 * s)} ${r(-3.3 * s)} L${r(0.2 * s)} ${r(-3.3 * s)} L${r(0.26 * s)} ${r(-3.85 * s)} L${r(-0.26 * s)} ${r(-3.85 * s)} Z" fill="#fff0c4"/>`;
  k += `<path d="M${r(-0.2 * s)} ${r(-3.3 * s)} L${r(0.2 * s)} ${r(-3.3 * s)} M${r(0)} ${r(-3.3 * s)} L0 ${r(-3.85 * s)}" stroke="#1b2620" stroke-width="${r(0.025 * s)}"/>`;
  k += `<path d="M${r(-0.32 * s)} ${r(-3.85 * s)} L${r(0.32 * s)} ${r(-3.85 * s)} L0 ${r(-4.15 * s)} Z" fill="#1f2c26"/><circle cx="0" cy="${r(-4.2 * s)}" r="${r(0.05 * s)}" fill="#1f2c26"/>`;
  k += `<ellipse cx="0" cy="${r(-3.6 * s)}" rx="${r(0.5 * s)}" ry="${r(0.45 * s)}" fill="#ffd98a" opacity=".35" filter="url(#${S.id("glimm")})"/>`;
  S.teil({ id: "laterne", de: "die Laterne", syl: "la-TER-ne", it: "il lampione", itSyl: "lam-PIO-ne", en: "street lamp", x, y, kunst: `<g ${VOLS}>${k}</g>` });
}

/* 11 — DER LADEN (Käse und Souvenirs, Eckhaus rechts) — Lupe */
const LADEN = { d0: 37.2, d1: 44.6 };
{
  const X = FX, Q = (D, h) => P(X, D, h);
  let k = "";
  /* Schaufenster (Erdgeschoss), Markise, Schild „KAAS“ */
  k += `<path d="${pz([Q(LADEN.d0, KAI), Q(LADEN.d1, KAI), Q(LADEN.d1, 4.4), Q(LADEN.d0, 4.4)])}" fill="#203a2c"/>`;
  k += `<path d="${pz([Q(LADEN.d0 + 0.4, 1.6), Q(LADEN.d1 - 2, 1.6), Q(LADEN.d1 - 2, 3.9), Q(LADEN.d0 + 0.4, 3.9)])}" fill="${S.lg("laden", [[0, "#f4dc9a"], [1, "#d8b56a"]])}"/>`;
  /* Regale mit Käselaiben (Gouda, flach liegend, gestapelt) im Fenster; darüber dunkelgrüne Sprossen (nach den Laiben gezeichnet) */
  let kaese = "";
  for (let reihe = 0; reihe < 3; reihe++) for (let d = LADEN.d0 + 0.8; d < LADEN.d1 - 2.3; d += 0.62) {
    const [x, y] = Q(d, 2.0 + reihe * 0.6), s = F / d;
    for (let j = 0; j < 2; j++) { const yy = y - j * 0.09 * s, w = 0.11 * s, hh = 0.08 * s; kaese += `<rect x="${r(x - w)}" y="${r(yy - hh)}" width="${r(2 * w)}" height="${r(hh)}" rx="${r(hh * 0.45)}" fill="${(reihe + j) % 3 ? "#efb52e" : "#d98f1c"}"/><rect x="${r(x - w * 0.8)}" y="${r(yy - hh)}" width="${r(1.6 * w)}" height="${r(hh * 0.3)}" rx="${r(hh * 0.15)}" fill="#ffe08a" opacity=".7"/>`; }
  }
  k += kaese;
  for (let reihe = 0; reihe < 3; reihe++) k += `<path d="M${pt(Q(LADEN.d0 + 0.4, 2.0 + reihe * 0.6))} L${pt(Q(LADEN.d1 - 2, 2.0 + reihe * 0.6))}" stroke="#7a5230" stroke-width=".5"/>`;
  { let spr = ""; for (const d of [LADEN.d0 + 0.4 + (LADEN.d1 - 2.4 - LADEN.d0) / 2]) spr += `M${pt(Q(d, 1.6))} L${pt(Q(d, 3.9))}`; spr += `M${pt(Q(LADEN.d0 + 0.4, 3.3))} L${pt(Q(LADEN.d1 - 2, 3.3))}`;
    k += `<path d="${spr}" stroke="#1f3a2c" stroke-width=".9"/><path d="${pz([Q(LADEN.d0 + 0.4, 1.6), Q(LADEN.d1 - 2, 1.6), Q(LADEN.d1 - 2, 3.9), Q(LADEN.d0 + 0.4, 3.9)])}" fill="none" stroke="#1f3a2c" stroke-width="1.1"/>`; }
  /* Ladentür mit Fenster */
  k += `<path d="${pz([Q(LADEN.d1 - 1.7, KAI + 0.1), Q(LADEN.d1 - 0.5, KAI + 0.1), Q(LADEN.d1 - 0.5, 3.9), Q(LADEN.d1 - 1.7, 3.9)])}" fill="#2a4a38"/><path d="${pz([Q(LADEN.d1 - 1.5, 2.2), Q(LADEN.d1 - 0.7, 2.2), Q(LADEN.d1 - 0.7, 3.6), Q(LADEN.d1 - 1.5, 3.6)])}" fill="#e8c878" opacity=".85"/>`;
  /* Markise (gestreift) ragt zur Gracht */
  let mk = "";
  for (let i = 0; i < 8; i++) { const a = LADEN.d0 + i * (LADEN.d1 - LADEN.d0) / 8, b = a + (LADEN.d1 - LADEN.d0) / 8; mk += `<path d="${pz([P(X, a, 4.3), P(X, b, 4.3), P(X - 1.2, b, 3.7), P(X - 1.2, a, 3.7)])}" fill="${i % 2 ? "#f2efe6" : "#c8352e"}"/>`; }
  k += mk;
  /* Schild KAAS (verkürzt auf der Wand) */
  k += `<path d="${pz([Q(LADEN.d0 + 0.8, 4.5), Q(LADEN.d1 - 0.8, 4.5), Q(LADEN.d1 - 0.8, 5.2), Q(LADEN.d0 + 0.8, 5.2)])}" fill="#f2c23c"/>`;
  {
    const txt = "KAAS", n = txt.length;
    for (let i = 0; i < n; i++) { const D = LADEN.d1 - 1.2 - (LADEN.d1 - LADEN.d0 - 2.4) * (i + 0.5) / n, [lx, ly] = P(X, D, 4.62), ls = F / D; k += `<text font-size="${r(0.62 * ls)}" text-anchor="middle" fill="#3a2410" font-family="Georgia,serif" font-weight="bold" transform="translate(${r(lx)} ${r(ly)}) scale(${r(X / D * 100) / 100} 1)">${txt[i]}</text>`; }
  }
  /* Verkaufstisch vor dem Laden: Käselaibe, Holzschuhe, Sirupwaffeln */
  const T = { X: 13.2, D: 39.6 }, [tx, ty] = P(T.X, T.D, KAI), ts = F / T.D;
  let tisch = `<rect x="${r(tx - 0.9 * ts)}" y="${r(ty - 0.8 * ts)}" width="${r(1.8 * ts)}" height="${r(0.12 * ts)}" fill="#8a5a34"/><path d="M${r(tx - 0.8 * ts)} ${r(ty - 0.7 * ts)} L${r(tx - 0.8 * ts)} ${r(ty)} M${r(tx + 0.8 * ts)} ${r(ty - 0.7 * ts)} L${r(tx + 0.8 * ts)} ${r(ty)}" stroke="#5a3a22" stroke-width="${r(0.06 * ts)}"/>`;
  /* Käse: zwei Gouda-Laibe gestapelt (gewölbte Seiten, gelbe Wachsrinde), oben ein Stück herausgeschnitten */
  const kx = tx - 0.45 * ts, ky = ty - 0.8 * ts, m = (a, b) => `${r(kx + a * ts)} ${r(ky + b * ts)}`;
  const laib = (y0, w, h, f) => `<path d="M${m(-w, y0)} Q${m(-w - 0.03, y0 - h / 2)} ${m(-w, y0 - h)} Q${m(0, y0 - h - 0.07)} ${m(w, y0 - h)} Q${m(w + 0.03, y0 - h / 2)} ${m(w, y0)} Q${m(0, y0 + 0.06)} ${m(-w, y0)} Z" fill="${f}"/><path d="M${m(-w, y0 - h)} Q${m(0, y0 - h + 0.06)} ${m(w, y0 - h)}" stroke="#c98a1c" stroke-width="${r(0.012 * ts)}" fill="none"/>`;
  tisch += laib(0, 0.26, 0.1, S.lg("gouda", [[0, "#f7cf4a"], [0.6, "#eaa924"], [1, "#c97f16"]], 0, 0, 1, 0)) + laib(-0.1, 0.24, 0.1, S.lg("gouda", []));
  tisch += `<path d="M${m(-0.02, -0.215)} L${m(0.24, -0.205)} L${m(0.25, -0.11)} L${m(0.02, -0.115)} Z" fill="#fff0b8"/><path d="M${m(0.24, -0.205)} L${m(0.25, -0.11)} L${m(0.27, -0.12)} L${m(0.26, -0.2)} Z" fill="#e8c260"/><path d="M${m(0.02, -0.21)} L${m(0.05, -0.14)}" stroke="#e8c870" stroke-width="${r(0.008 * ts)}"/>`;
  tisch += `<path d="M${m(-0.18, -0.2)} Q${m(-0.05, -0.235)} ${m(0.1, -0.2)}" stroke="#fff4c0" stroke-width="${r(0.012 * ts)}" fill="none" opacity=".8"/>`;
  /* Holzschuhe: ein Paar, gelb lackiert, mit roter Tulpe bemalt (Seitenansicht, Spitze rechts, 36 cm) */
  const klomp = (x0, dy, f, k = 1.25) => { const q = (a, b) => `${r(hx + (x0 + a * k) * ts)} ${r(hy + (dy + b * k) * ts)}`;
    return `<path d="M${q(-0.15, 0)} L${q(0.1, 0)} Q${q(0.16, -0.005)} ${q(0.19, -0.035)} Q${q(0.215, -0.07)} ${q(0.2, -0.08)} Q${q(0.17, -0.088)} ${q(0.12, -0.09)} Q${q(0.06, -0.095)} ${q(0.03, -0.122)} L${q(-0.12, -0.13)} Q${q(-0.17, -0.125)} ${q(-0.17, -0.07)} Q${q(-0.17, -0.02)} ${q(-0.15, 0)} Z" fill="${f}"/>` +
      `<path d="M${q(-0.12, -0.128)} Q${q(-0.05, -0.15)} ${q(0.03, -0.122)} Q${q(-0.05, -0.112)} ${q(-0.12, -0.128)} Z" fill="#3a220c"/>` +
      `<path d="M${q(0.05, -0.02)} Q${q(0.06, -0.05)} ${q(0.08, -0.07)}" stroke="#3f7a2e" stroke-width="${r(0.012 * ts)}" fill="none"/><path d="M${q(0.065, -0.068)} L${q(0.06, -0.093)} L${q(0.08, -0.083)} L${q(0.1, -0.093)} L${q(0.095, -0.068)} Z" fill="#d0283a"/>` +
      `<path d="M${q(-0.15, -0.1)} Q${q(-0.02, -0.098)} ${q(0.12, -0.082)} Q${q(0.18, -0.08)} ${q(0.2, -0.074)}" stroke="#fff8d8" stroke-width="${r(0.01 * ts)}" fill="none" opacity=".85"/><path d="M${q(-0.15, -0.006)} L${q(0.12, -0.006)}" stroke="#9a6a08" stroke-width="${r(0.014 * ts)}" opacity=".6"/>`; };
  /* ein Paar große Holzschuhe hängt am Türrahmen (wie bei den Souvenirläden): Seitenansicht, Spitze hochgezogen */
  const [hx0, hy0] = P(X - 0.2, LADEN.d1 - 0.3, 3.75), hs = F / (LADEN.d1 - 0.3);
  /* Holzschuh in Seitenansicht (Spitze rechts, hochgezogen), 36 cm, an einer Schnur */
  const klomp2 = (dx, dy, f, f2) => { const q = (a, b) => `${r(hx0 + (dx + a) * hs)} ${r(hy0 + (dy + b) * hs)}`;
    return `<path d="M${q(-0.16, 0)} L${q(0.12, 0)} Q${q(0.19, -0.01)} ${q(0.215, -0.05)} Q${q(0.235, -0.085)} ${q(0.22, -0.1)} Q${q(0.18, -0.105)} ${q(0.12, -0.11)} Q${q(0.05, -0.12)} ${q(0.025, -0.15)} L${q(-0.13, -0.155)} Q${q(-0.18, -0.13)} ${q(-0.175, -0.07)} Q${q(-0.175, -0.02)} ${q(-0.16, 0)} Z" fill="${f}"/>` +
      `<path d="M${q(-0.16, 0)} L${q(0.12, 0)} Q${q(0.19, -0.01)} ${q(0.215, -0.05)} L${q(0.18, -0.035)} Q${q(0.1, -0.02)} ${q(-0.15, -0.025)} Z" fill="${f2}"/>` +
      `<path d="M${q(-0.125, -0.152)} Q${q(-0.05, -0.172)} ${q(0.022, -0.148)} Q${q(-0.05, -0.135)} ${q(-0.125, -0.152)} Z" fill="#3a220c"/>` +
      `<path d="M${q(0.06, -0.025)} Q${q(0.07, -0.06)} ${q(0.09, -0.085)}" stroke="#3f7a2e" stroke-width="${r(0.012 * hs)}" fill="none"/><path d="M${q(0.078, -0.082)} L${q(0.073, -0.11)} L${q(0.092, -0.1)} L${q(0.11, -0.11)} L${q(0.106, -0.082)} Z" fill="#d0283a"/>` +
      `<path d="M${q(-0.15, -0.12)} Q${q(-0.02, -0.118)} ${q(0.12, -0.1)} Q${q(0.19, -0.095)} ${q(0.215, -0.09)}" stroke="#fff6cc" stroke-width="${r(0.01 * hs)}" fill="none" opacity=".9"/>`; };
  k += `<path d="M${r(hx0)} ${r(hy0 - 0.12 * hs)} L${r(hx0 - 0.05 * hs)} ${r(hy0 + 0.17 * hs)} M${r(hx0)} ${r(hy0 - 0.12 * hs)} L${r(hx0 + 0.05 * hs)} ${r(hy0 + 0.3 * hs)}" stroke="#3a2a1c" stroke-width="${r(0.01 * hs)}"/>`;
  k += klomp2(0.05, 0.47, "#e2ac22", "#b8820e") + klomp2(-0.04, 0.33, "#f6cb3c", "#d49a1c");
  const hx = hx0 + 0.0 * hs, hy = hy0 + 0.47 * hs;
  /* Sirupwaffeln: blaue Dose, eine Waffel lehnt davor (Gitter, Sirup) */
  const wx = tx + 0.68 * ts, wy = ty - 0.8 * ts, w2 = (a, b) => `${r(wx + a * ts)} ${r(wy + b * ts)}`;
  tisch += `<rect x="${r(wx - 0.08 * ts)}" y="${r(wy - 0.2 * ts)}" width="${r(0.16 * ts)}" height="${r(0.2 * ts)}" rx="${r(0.01 * ts)}" fill="#2a5aa0"/><rect x="${r(wx - 0.08 * ts)}" y="${r(wy - 0.13 * ts)}" width="${r(0.16 * ts)}" height="${r(0.05 * ts)}" fill="#f2efe6"/><ellipse cx="${r(wx)}" cy="${r(wy - 0.2 * ts)}" rx="${r(0.08 * ts)}" ry="${r(0.02 * ts)}" fill="#c9d3dc"/>`;
  { const cx2 = wx + 0.13 * ts, cy2 = wy - 0.06 * ts, rw = 0.06 * ts;
    let gitter = "";
    for (let i = -2; i <= 2; i++) gitter += `M${r(cx2 + i * rw * 0.35 - rw * 0.6)} ${r(cy2 - rw * 0.8)} L${r(cx2 + i * rw * 0.35 + rw * 0.6)} ${r(cy2 + rw * 0.8)} M${r(cx2 + i * rw * 0.35 + rw * 0.6)} ${r(cy2 - rw * 0.8)} L${r(cx2 + i * rw * 0.35 - rw * 0.6)} ${r(cy2 + rw * 0.8)} `;
    const id = S.id("waffel");
    tisch += `<clipPath id="${id}"><circle cx="${r(cx2)}" cy="${r(cy2)}" r="${r(rw * 0.9)}"/></clipPath><circle cx="${r(cx2)}" cy="${r(cy2)}" r="${r(rw)}" fill="#a8682a"/><circle cx="${r(cx2)}" cy="${r(cy2)}" r="${r(rw * 0.9)}" fill="#d49a4c"/><path d="${gitter}" stroke="#9a5e24" stroke-width="${r(0.008 * ts)}" clip-path="url(#${id})"/><path d="M${r(cx2 - rw * 0.5)} ${r(cy2 - rw * 0.55)} Q${r(cx2)} ${r(cy2 - rw * 0.85)} ${r(cx2 + rw * 0.5)} ${r(cy2 - rw * 0.55)}" stroke="#f4cf8a" stroke-width="${r(0.006 * ts)}" fill="none"/>`; }
  k += `<g ${VOLS}>${tisch}</g>`;
  const unter = [
    { id: "kaese", de: "der Käse", syl: "KÄ-se", it: "il formaggio", itSyl: "for-MAG-gio", en: "cheese", x: kx, y: ky, kunst: flaeche(-0.3 * ts, -0.3 * ts, 0.6 * ts, 0.34 * ts, 0.3),
      tipp: "Gouda ist ein runder Käse aus den Niederlanden. Er hat eine gelbe Wachsrinde." },
    { id: "holzschuh", de: "der Holzschuh", syl: "HOLZ-schuh", it: "lo zoccolo", itSyl: "ZOC-co-lo", en: "clog", x: hx, y: hy, kunst: flaeche(-0.24 * hs, -0.33 * hs, 0.52 * hs, 0.35 * hs, 0.3),
      tipp: "Früher trugen die Bauern Holzschuhe. Heute kauft man sie als Souvenir." },
    { id: "sirupwaffel", de: "die Sirupwaffel", syl: "SI-rup-waf-fel", it: "la cialda allo sciroppo", itSyl: "CIAL-da AL-lo sci-ROP-po", en: "stroopwafel", x: wx, y: wy, kunst: flaeche(-0.09 * ts, -0.23 * ts, 0.3 * ts, 0.25 * ts, 0.3),
      tipp: "Die Sirupwaffel (niederländisch „stroopwafel“) legt man auf die heiße Teetasse — dann wird der Sirup weich." },
  ];
  S.teil({ id: "laden", de: "der Laden", syl: "LA-den", it: "il negozio", itSyl: "ne-GO-zio", en: "shop", anker: [tx, ty], kunst: k,
    tipp: "Im Käseladen kann man oft Käse probieren.",
    zoom: { x: r(tx - 24), y: r(ty - 33), w: 48, h: 32 }, unter });
}

/* 12 — DER POLLER (Amsterdammertje) am rechten Kai */
{
  let k = "";
  const pos = [[12.2, 33.6], [12.2, 35.4]];
  for (const [X, D] of pos) {
    const [x, y] = P(X, D, KAI), s = F / D;
    k += `<path d="M${r(x - 0.08 * s)} ${r(y)} L${r(x - 0.07 * s)} ${r(y - 0.75 * s)} Q${r(x)} ${r(y - 0.86 * s)} ${r(x + 0.07 * s)} ${r(y - 0.75 * s)} L${r(x + 0.08 * s)} ${r(y)} Z" fill="${S.lg("poller", [[0, "#5a2418"], [0.45, "#8a3a26"], [1, "#4a1c12"]], 0, 0, 1, 0)}"/>`;
    for (let i = 0; i < 3; i++) { const yy = y - (0.28 + i * 0.15) * s; k += `<path d="M${r(x - 0.035 * s)} ${r(yy - 0.035 * s)} l${r(0.07 * s)} ${r(0.07 * s)} M${r(x + 0.035 * s)} ${r(yy - 0.035 * s)} l${r(-0.07 * s)} ${r(0.07 * s)}" stroke="#c96a4a" stroke-width="${r(0.014 * s)}"/>`; }
  }
  const [x, y] = P(12.2, 34.5, KAI);
  S.teil({ oben: true, id: "poller", de: "der Poller", syl: "POL-ler", it: "il paracarro", itSyl: "pa-ra-CAR-ro", en: "bollard", x, y, kunst: `<g transform="translate(${r(-x)} ${r(-y)})">${k}</g>`,
    tipp: "Die braunen Poller heißen „Amsterdammertjes“. Die drei Kreuze kommen aus dem Stadtwappen." });
}

/* 13 — DIE TOURISTIN am rechten Kai, fotografiert mit dem Handy die Brücken (klein: eigene, schlanke Zeichnung) */
{
  const X = 9.9, D = 44, [x, y] = P(X, D, KAI), s = F / D, q = (a, b) => `${r(a * s)} ${r(b * s)}`;
  let k = `<ellipse cx="${r(-0.35 * s)}" cy="${r(0.04 * s)}" rx="${r(0.45 * s)}" ry="${r(0.09 * s)}" fill="#14182a" opacity=".28"/>`;
  k += `<path d="M${q(-0.1, -0.02)} L${q(-0.12, -0.8)} L${q(0.02, -0.8)} L${q(0.0, -0.02)} Z M${q(0.03, -0.02)} L${q(0.04, -0.8)} L${q(0.15, -0.8)} L${q(0.12, -0.02)} Z" fill="#33507a"/>`;
  k += `<path d="M${q(-0.16, 0)} h${r(0.14 * s)} v${r(-0.05 * s)} h${r(-0.12 * s)} Z M${q(0.02, 0)} h${r(0.14 * s)} v${r(-0.05 * s)} h${r(-0.12 * s)} Z" fill="#eeeeea"/>`;
  k += `<path d="M${q(-0.17, -0.74)} Q${q(-0.2, -1.1)} ${q(-0.13, -1.38)} L${q(0.14, -1.38)} Q${q(0.2, -1.1)} ${q(0.19, -0.74)} Z" fill="#d6c6a2"/><path d="M${q(-0.13, -1.36)} L${q(0.14, -1.36)} L${q(0.12, -1.3)} L${q(-0.11, -1.3)} Z" fill="#c8352e"/>`;
  k += `<path d="M${q(-0.11, -1.33)} Q${q(-0.24, -1.3)} ${q(-0.26, -1.47)}" stroke="#cbb994" stroke-width="${r(0.07 * s)}" fill="none" stroke-linecap="round"/><path d="M${q(0.12, -1.33)} Q${q(0.0, -1.25)} ${q(-0.2, -1.45)}" stroke="#bda984" stroke-width="${r(0.07 * s)}" fill="none" stroke-linecap="round"/>`;
  k += `<rect x="${r(-0.33 * s)}" y="${r(-1.6 * s)}" width="${r(0.08 * s)}" height="${r(0.15 * s)}" rx="${r(0.015 * s)}" fill="#1a1c20"/><rect x="${r(-0.32 * s)}" y="${r(-1.59 * s)}" width="${r(0.06 * s)}" height="${r(0.12 * s)}" fill="#8fb4d6"/>`;
  k += `<path d="M${q(-0.07, -1.38)} L${q(0.07, -1.38)} L${q(0.06, -1.44)} L${q(-0.05, -1.44)} Z" fill="#c99a76"/><ellipse cx="${r(0)}" cy="${r(-1.55 * s)}" rx="${r(0.1 * s)}" ry="${r(0.12 * s)}" fill="#c99a76"/>`;
  k += `<path d="M${q(-0.02, -1.68)} Q${q(0.13, -1.68)} ${q(0.11, -1.5)} Q${q(0.12, -1.42)} ${q(0.19, -1.36)} Q${q(0.05, -1.4)} ${q(0.03, -1.5)} Q${q(-0.04, -1.6)} ${q(-0.09, -1.55)} Q${q(-0.09, -1.66)} ${q(-0.02, -1.68)} Z" fill="#4a3022"/>`;
  S.teil({ id: "touristin", de: "die Touristin", syl: "tou-RIS-tin", it: "la turista", itSyl: "tu-RI-sta", en: "tourist", x, y, kunst: `<g ${VOLS}>${k}</g>`,
    tipp: "Die Touristin fotografiert mit dem Handy die Brücken." });
}

/* 14 — DIE FLAGGE von Amsterdam (am linken Haus, in der Sonne) */
{
  const D = 47.5, X = -FX, [ax, ay] = P(X, D, 9.6), [bx, by] = P(X + 1.6, D - 0.3, 10.4), s = F / D;
  const fw = 1.4 * s, fh = 0.95 * s;
  let k = `<path d="M${r(ax)} ${r(ay)} L${r(bx)} ${r(by)}" stroke="#e8e2d4" stroke-width="${r(0.06 * s)}"/>`;
  const fl = (y0, y1, f) => `<path d="M${r(bx)} ${r(by + y0)} Q${r(bx + fw * 0.5)} ${r(by + y0 - 0.15 * s)} ${r(bx + fw)} ${r(by + y0 + 0.25 * s)} L${r(bx + fw)} ${r(by + y1 + 0.25 * s)} Q${r(bx + fw * 0.5)} ${r(by + y1 - 0.15 * s)} ${r(bx)} ${r(by + y1)} Z" fill="${f}"/>`;
  k += fl(0, fh / 3, "#d22630") + fl(fh / 3, 2 * fh / 3, "#121212") + fl(2 * fh / 3, fh, "#d22630");
  for (let i = 0; i < 3; i++) { const cx = bx + fw * (0.25 + i * 0.25), cy = by + fh / 2 + (i === 1 ? -0.06 : 0.03) * s, a = 0.07 * s; k += `<path d="M${r(cx - a)} ${r(cy - a)} L${r(cx + a)} ${r(cy + a)} M${r(cx + a)} ${r(cy - a)} L${r(cx - a)} ${r(cy + a)}" stroke="#fff" stroke-width="${r(0.035 * s)}"/>`; }
  k += `<path d="M${r(bx)} ${r(by)} Q${r(bx + fw * 0.5)} ${r(by - 0.15 * s)} ${r(bx + fw)} ${r(by + 0.25 * s)} L${r(bx + fw)} ${r(by + fh + 0.25 * s)} Q${r(bx + fw * 0.5)} ${r(by + fh - 0.15 * s)} ${r(bx)} ${r(by + fh)} Z" fill="${S.lg("fahnelicht", [[0, "#fff", 0.2], [0.5, "#000", 0.15], [1, "#fff", 0.25]], 0, 0, 1, 0)}"/>`;
  S.teil({ oben: true, id: "flagge", de: "die Flagge", syl: "FLAG-ge", it: "la bandiera", itSyl: "ban-DIE-ra", en: "flag", x: bx, y: by + fh, kunst: `<g transform="translate(${r(-bx)} ${r(-by - fh)})">${k}</g>`,
    tipp: "Die Flagge von Amsterdam ist rot-schwarz-rot mit drei weißen Kreuzen." });
}

/* 15a — DER FAHRRADSTÄNDER am rechten Kai: Bügel und eine Reihe angeschlossener Räder (quer zum Wasser, Vorderrad zur Gracht) */
{
  const farben = ["#1d1e22", "#2a4a7a", "#1d1e22", "#7a2a2a", "#2a2a2a", "#3e6a4a", "#1d1e22", "#c9c2b0"];
  let k = "";
  const posten = [];
  for (let i = 0; i < 8; i++) posten.push(47 + i * 1.5);
  /* Bügel (Edelstahl) */
  let buegel = "";
  for (const D of posten) { const a = P(10.5, D, KAI), b = P(10.5, D, KAI + 0.75), c = P(10.9, D, KAI + 0.75), d = P(10.9, D, KAI); buegel += `M${pt(a)} L${pt(b)} L${pt(c)} L${pt(d)}`; }
  for (const D of posten.slice().reverse()) {
    const s2 = F / D, [x, y] = P(11.3, D, KAI), sch = `<path d="${pz([P(9.9, D - 0.1, KAI), P(11.5, D - 0.1, KAI), P(11.5, D + 0.5, KAI), P(9.9, D + 0.5, KAI)])}" fill="#141a2a" opacity=".22"/>`;
    k += sch + radUse(x, y, s2, farben[posten.indexOf(D)], true);
  }
  k += `<path d="${buegel}" stroke="#b9c1c6" stroke-width=".55" fill="none"/>`;
  const [ax, ay] = P(10.7, 50, KAI);
  S.teil({ id: "fahrradstaender", de: "der Fahrradständer", syl: "FAHR-rad-stän-der", it: "la rastrelliera per bici", itSyl: "ra-strel-LIE-ra per BI-ci", en: "bike rack", anker: [ax, ay], kunst: k,
    tipp: "Am Fahrradständer schließt man das Rad mit einem Schloss an — in Amsterdam gibt es über 800 000 Fahrräder." });
}

/* 15 — die nahen Ulmen (vor Häusern, Laden und Booten) */
const ULME_TEIL = [];
for (const u of ULMEN.nah.sort((a, b) => b.D - a.D)) ULME_TEIL.push(ulme(u.X, u.D, u.seed));
{
  /* die Ulmen als ein Wort; Bezug: der Stamm rechts (36 m) */
  const ref = ULME_TEIL.find((u) => u.bx > 300 && u.bx < 400) || ULME_TEIL[0];
  S.teil({ id: "ulme", de: "die Ulme", syl: "UL-me", it: "l'olmo", itSyl: "OL-mo", en: "elm", anker: [ref.bx, ref.by], kunst: ULME_TEIL.map((u) => u.g).join(""),
    tipp: "Amsterdam hat rund 75 000 Ulmen. Sie stehen direkt am Wasser." });
}

/* 16 — DAS LASTENRAD und 17 — DIE RADFAHRERIN am linken Kai (in der Sonne) */
{
  const D = 30.6, Xh = -9.0, Xv = -11.4, [x0, y0] = P(Xv, D, KAI), [x1] = P(Xh, D, KAI), s = F / D;
  /* Lastenrad quer zur Gracht: Kiste vorn (links), Hinterrad rechts */
  const rr = 0.3 * s, q = (a, b) => `${r(a)} ${r(b)}`;
  const hx = x1, vx = x0 + 0.2 * s, gy = y0;
  let k = `<g fill="none" stroke="#151617" stroke-width="${r(0.045 * s)}"><circle cx="${r(vx)}" cy="${r(gy - rr * 0.7)}" r="${r(rr * 0.7)}"/><circle cx="${r(hx)}" cy="${r(gy - rr)}" r="${r(rr)}"/></g>`;
  /* Kiste (Holz) über dem kleinen Vorderrad */
  k += `<path d="M${r(vx - 0.25 * s)} ${r(gy - 0.55 * s)} L${r(vx + 0.7 * s)} ${r(gy - 0.55 * s)} L${r(vx + 0.78 * s)} ${r(gy - 1.05 * s)} L${r(vx - 0.33 * s)} ${r(gy - 1.05 * s)} Z" fill="${S.lg("kiste", [[0, "#c8915a"], [1, "#94622f"]])}"/>`;
  k += `<path d="M${r(vx - 0.3 * s)} ${r(gy - 0.8 * s)} L${r(vx + 0.75 * s)} ${r(gy - 0.8 * s)}" stroke="#7a4e24" stroke-width="${r(0.02 * s)}"/>`;
  /* Rahmen, Lenker, Sattel */
  k += `<path d="M${q(vx + 0.7 * s, gy - 0.6 * s)} L${q(hx - 0.35 * s, gy - 0.45 * s)} L${q(hx, gy - rr)} M${q(hx - 0.35 * s, gy - 0.45 * s)} L${q(hx - 0.1 * s, gy - 0.95 * s)} L${q(hx, gy - rr)} M${q(vx + 0.75 * s, gy - 0.6 * s)} L${q(vx + 0.85 * s, gy - 1.25 * s)} L${q(vx + 1.05 * s, gy - 1.25 * s)}" stroke="#20304a" stroke-width="${r(0.05 * s)}" fill="none" stroke-linecap="round"/>`;
  k += `<path d="M${q(hx - 0.22 * s, gy - 1.0 * s)} L${q(hx + 0.05 * s, gy - 1.0 * s)}" stroke="#1a1a1a" stroke-width="${r(0.07 * s)}" stroke-linecap="round"/>`;
  /* Kind in der Kiste? — nein: Einkauf mit Brot und Blumenstrauß */
  k += `<path d="M${q(vx + 0.05 * s, gy - 1.05 * s)} l${r(0.08 * s)} ${r(-0.45 * s)} l${r(0.1 * s)} 0 l${r(-0.02 * s)} ${r(0.45 * s)} Z" fill="#d9a35a"/>`;
  for (let i = 0; i < 5; i++) k += `<path d="M${q(vx + 0.42 * s, gy - 1.05 * s)} L${q(vx + (0.3 + i * 0.07) * s, gy - (1.4 + (i % 2) * 0.08) * s)}" stroke="#4f7a35" stroke-width="${r(0.02 * s)}"/><ellipse cx="${r(vx + (0.3 + i * 0.07) * s)}" cy="${r(gy - (1.43 + (i % 2) * 0.08) * s)}" rx="${r(0.035 * s)}" ry="${r(0.05 * s)}" fill="${["#e8344a", "#f4c63a", "#e8344a", "#f07aa0", "#f4c63a"][i]}"/>`;
  const [rx, ry] = [x1 - 0.7 * s, y0];
  S.teil({ id: "lastenrad", de: "das Lastenrad", syl: "LAS-ten-rad", it: "la bici cargo", itSyl: "BI-ci CAR-go", en: "cargo bike", anker: [(vx + hx) / 2, gy], kunst: `<g ${VOL}>${k}</g>`,
    tipp: "Mit dem Lastenrad fahren Eltern ihre Kinder oder den Einkauf durch die Stadt." });
  const m = B.mensch({ id: "ams_radf", geschlecht: "w", pose: "kontrapost", blick: 60, frisur: "lang", haarfarbe: "blond", haut: "hell", ohneSchatten: true,
    kleidung: { oberteil: { stueck: "pullover", farbe: "#e0802e" }, unterteil: { stueck: "jeans" }, jacke: { stueck: "jacke", farbe: "#2f5a35" }, schuhe: { stueck: "halbschuh", farbe: "braun" } } }, 1.68 * s);
  const fxp = hx + 0.55 * s;
  S.teil({ id: "radfahrerin", de: "die Radfahrerin", syl: "RAD-fah-re-rin", it: "la ciclista", itSyl: "ci-CLI-sta", en: "cyclist (woman)", x: fxp, y: y0 + 0.05 * s,
    kunst: `<ellipse cx="0" cy="0" rx="${r(0.22 * s)}" ry="${r(0.05 * s)}" fill="#1a2238" opacity=".35"/><g ${VOL}>${schlank(m.svg, 2)}</g>`,
    tipp: "Die Radfahrerin hat Brot und Tulpen gekauft." });
}

/* 18 — DAS GELÄNDER unserer Brücke (vorne, 2,4 m vor uns, in der Abendsonne) */
const GEL = { D: 2.4, h: 3.62 };
{
  const s = F / GEL.D, top = P(0, GEL.D, GEL.h)[1];
  let k = `<rect x="0" y="${r(top - 0.025 * s)}" width="400" height="${r(0.05 * s)}" rx="${r(0.025 * s)}" fill="${S.lg("handlauf", [[0, "#6a776e"], [0.3, "#33403a"], [1, "#141c18"]])}"/>`;
  k += `<rect x="0" y="${r(top - 0.022 * s)}" width="400" height="${r(0.01 * s)}" fill="#ffd9a0" opacity=".6"/>`;
  let st = "";
  for (let X = -0.98; X <= 1.0; X += 0.14) { const x = VPX + X * s; st += `<rect x="${r(x - 0.009 * s)}" y="${r(top + 0.02 * s)}" width="${r(0.018 * s)}" height="${r(262 - top)}"/>`; }
  k += `<g fill="${S.lg("stab", [[0, "#2a3530"], [0.6, "#151d19"], [1, "#4a3a28"]], 0, 0, 1, 0)}">${st}</g>`;
  S.teil({ id: "gelaender", de: "das Geländer", syl: "ge-LÄN-der", it: "la ringhiera", itSyl: "rin-GHIE-ra", en: "railing", anker: [300, top], kunst: k });
}

/* 19 — DAS FAHRRAD vorn links am Geländer: Lenker mit KLINGEL, Korb mit TULPEN */
{
  const pp = (X, D, h) => P(X + 0.17, D, h), q = (X, D, h) => pt(pp(X, D, h)), HL = 3.74;
  let k = "";
  /* Steuerrohr und Gabel (verschwinden nach unten), Oberrohr nach rechts unten */
  k += `<path d="M${q(-0.62, 2.2, HL - 0.06)} L${q(-0.6, 2.2, 3.0)} M${q(-0.6, 2.2, HL - 0.22)} L${q(-0.05, 2.2, 3.05)}" stroke="${S.lg("lack", [[0, "#3a3d42"], [0.5, "#101114"], [1, "#2a2c30"]])}" stroke-width="${r(0.042 * F / 2.2)}" stroke-linecap="round" fill="none"/>`;
  /* Lenker (Hollandrad: nach hinten geschwungen), Griffe */
  k += `<path d="M${q(-0.47, 1.92, HL - 0.02)} Q${q(-0.62, 1.95, HL + 0.02)} ${q(-0.62, 2.2, HL)} Q${q(-0.62, 2.45, HL + 0.02)} ${q(-0.47, 2.48, HL - 0.02)}" stroke="#141518" stroke-width="${r(0.026 * F / 2.2)}" fill="none" stroke-linecap="round"/>`;
  k += `<path d="M${q(-0.47, 1.92, HL)} Q${q(-0.6, 1.95, HL + 0.04)} ${q(-0.6, 2.2, HL + 0.02)}" stroke="#7d848c" stroke-width="${r(0.006 * F / 2.2)}" fill="none"/>`;
  k += `<path d="M${q(-0.62, 2.2, HL - 0.2)} L${q(-0.62, 2.2, HL)}" stroke="#141518" stroke-width="${r(0.035 * F / 2.2)}" stroke-linecap="round"/>`;
  k += `<path d="M${q(-0.47, 1.92, HL - 0.02)} L${q(-0.36, 1.9, HL - 0.03)} M${q(-0.47, 2.48, HL - 0.02)} L${q(-0.36, 2.5, HL - 0.03)}" stroke="#3a2618" stroke-width="${r(0.04 * F / 2.2)}" stroke-linecap="round"/>`;
  /* Korb (Weide) vorn am Lenker */
  const kb = [pp(-1.0, 2.0, HL - 0.08), pp(-0.66, 2.0, HL - 0.08), pp(-0.66, 2.0, HL - 0.45), pp(-1.0, 2.0, HL - 0.45)];
  let korb = `<path d="${pz(kb)}" fill="${S.lg("weide", [[0, "#c79a5a"], [1, "#8a6230"]])}"/>`;
  let fl = "";
  for (let h = HL - 0.12; h > HL - 0.45; h -= 0.045) fl += `M${q(-1.0, 2.0, h)} L${q(-0.66, 2.0, h)} `;
  for (let X = -0.98; X < -0.66; X += 0.04) fl += `M${q(X, 2.0, HL - 0.08)} L${q(X, 2.0, HL - 0.45)} `;
  korb += `<path d="${fl}" stroke="#6e4a20" stroke-width=".6" opacity=".55"/><path d="M${q(-1.0, 2.0, HL - 0.08)} L${q(-0.66, 2.0, HL - 0.08)}" stroke="#d9b070" stroke-width="${r(0.025 * F / 2.0)}" stroke-linecap="round"/>`;
  S.teil({ id: "fahrrad", de: "das Fahrrad", syl: "FAHR-rad", it: "la bicicletta", itSyl: "bi-ci-CLET-ta", en: "bicycle", anker: [pp(-0.6, 2.2, 3.2)[0], 258], kunst: `<g ${VOLN}>${k}</g>` + korb,
    tipp: "Das typische Hollandrad ist schwarz. Man sitzt darauf ganz aufrecht." });
  /* Tulpen im Korb (Strauß, Seidenpapier) */
  const z = zufall(44);
  let stiele = "", blaetter = "", blueten = "";
  const farben = [["#d81e34", "#f2707a", "#8e0f1e"], ["#f4c22e", "#ffe48a", "#c8901a"], ["#e8558a", "#ffa6c8", "#a82a5a"], ["#e33a2a", "#ff8a6a", "#9a1a10"]];
  const tul = [];
  for (let i = 0; i < 15; i++) tul.push({ X: -0.96 + z() * 0.28, D: 1.93 + z() * 0.16, h: HL - 0.02 + z() * 0.16, f: farben[Math.floor(z() * 4)] });
  tul.sort((a, b) => b.D - a.D || a.h - b.h);
  for (const t of tul) {
    const [bx, by] = pp(t.X, t.D, t.h), [sx, sy] = pp(-0.83 + (t.X + 0.83) * 0.4, 2.0, HL - 0.1), ss = F / t.D;
    stiele += `M${r(sx)} ${r(sy)} Q${r((sx + bx) / 2)} ${r((sy + by) / 2 + 2)} ${r(bx)} ${r(by)} `;
    const [f, hlc, d] = t.f, w = 0.021 * ss, hh = 0.038 * ss;
    blueten += `<path d="M${r(bx - w)} ${r(by - hh)} Q${r(bx - w * 1.1)} ${r(by + hh * 0.25)} ${r(bx)} ${r(by + hh * 0.3)} Q${r(bx + w * 1.1)} ${r(by + hh * 0.25)} ${r(bx + w)} ${r(by - hh)} L${r(bx + w * 0.45)} ${r(by - hh * 0.62)} L${r(bx)} ${r(by - hh * 1.08)} L${r(bx - w * 0.45)} ${r(by - hh * 0.62)} Z" fill="${f}"/><path d="M${r(bx + w * 0.15)} ${r(by - hh * 0.85)} Q${r(bx + w * 0.8)} ${r(by - hh * 0.3)} ${r(bx + w * 0.55)} ${r(by + hh * 0.15)}" stroke="${hlc}" stroke-width="${r(0.008 * ss)}" fill="none"/><path d="M${r(bx)} ${r(by - hh * 1.0)} L${r(bx)} ${r(by + hh * 0.25)}" stroke="${d}" stroke-width="${r(0.005 * ss)}" opacity=".6"/>`;
  }
  for (let i = 0; i < 6; i++) { const [sx, sy] = pp(-0.94 + i * 0.05, 2.0, HL - 0.1), ss = F / 2; blaetter += `<path d="M${r(sx)} ${r(sy)} Q${r(sx + (i - 2.5) * 0.03 * ss)} ${r(sy - 0.06 * ss)} ${r(sx + (i - 2.5) * 0.028 * ss)} ${r(sy - 0.13 * ss)} Q${r(sx + 0.012 * ss)} ${r(sy - 0.08 * ss)} ${r(sx + 0.018 * ss)} ${r(sy)} Z" fill="${i % 2 ? "#5f8f3e" : "#4a7a32"}"/>`; }
  /* Seidenpapier um den Strauß */
  const [pa, pb] = [pp(-0.98, 1.98, HL - 0.05), pp(-0.68, 1.98, HL - 0.05)];
  const papier = `<path d="M${r(pa[0])} ${r(pa[1])} L${r(pa[0] - 4)} ${r(pa[1] - 22)} L${r((pa[0] + pb[0]) / 2)} ${r(pa[1] - 10)} L${r(pb[0] + 5)} ${r(pb[1] - 24)} L${r(pb[0])} ${r(pb[1])} Z" fill="#f4efe2" opacity=".85"/>`;
  const tk = `<path d="${stiele}" stroke="#4d7f34" stroke-width="${r(0.009 * F / 2)}" fill="none"/>` + blaetter + blueten;
  S.teil({ oben: true, id: "tulpe", de: "die Tulpe", syl: "TUL-pe", it: "il tulipano", itSyl: "tu-LI-pa-no", en: "tulip", anker: [pp(-0.83, 2, HL)[0], pp(-0.83, 2, HL)[1]], kunst: tk,
    tipp: "Im Frühling blühen in den Niederlanden Millionen Tulpen. Die ersten kamen im 16. Jahrhundert aus dem Osmanischen Reich (heute Türkei)." });
  /* die Klingel am Lenker (fernes Ende) */
  const [kx, kyy] = P(-0.33, 2.42, HL + 0.035), ks = F / 2.42;
  const kl = `<ellipse cx="${r(kx)}" cy="${r(kyy)}" rx="${r(0.032 * ks)}" ry="${r(0.022 * ks)}" fill="${S.rg("klingel", [[0, "#ffffff"], [0.4, "#d6dde2"], [1, "#6d777f"]], 0.65, 0.3, 0.8)}"/><rect x="${r(kx - 0.006 * ks)}" y="${r(kyy + 0.015 * ks)}" width="${r(0.012 * ks)}" height="${r(0.025 * ks)}" fill="#8a949b"/><path d="M${r(kx + 0.02 * ks)} ${r(kyy - 0.005 * ks)} l${r(0.03 * ks)} ${r(-0.012 * ks)}" stroke="#4a525a" stroke-width="${r(0.008 * ks)}"/>`;
  S.teil({ oben: true, id: "fahrradklingel", de: "die Fahrradklingel", syl: "FAHR-rad-klin-gel", it: "il campanello della bici", itSyl: "cam-pa-NEL-lo DEL-la BI-ci", en: "bicycle bell", x: kx, y: kyy + 0.04 * ks, kunst: `<g transform="translate(${r(-kx)} ${r(-kyy - 0.04 * ks)})">${kl}</g>`,
    tipp: "Ring, ring! In Amsterdam klingelt man oft — auf den Radwegen ist viel los." });
}

/* Lichtstimmung vorn: warme Sonne auf dem nahen Wasser (durch die Lücke der Herengracht) */
S.davor(`<path d="${pz([P(-KX, 12, 0), P(KX, 12, 0), P(KX, 17.5, 0), P(-KX, 33, 0)])}" fill="#ffcf8a" opacity=".08"/>`);

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/amsterdam.js"));
console.log(aus);
