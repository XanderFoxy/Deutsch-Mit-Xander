#!/usr/bin/env node
/* =====================================================================
   DER FREIZEITPARK (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (Parkbeschreibungen großer deutscher Freizeitparks, Hinweise
   zu Wartezeiten und Mindestgrößen):
   - Am EINGANG ein Torbau mit Kassen und Drehkreuzen; dahinter der
     Hauptweg mit WEGWEISERN zu den Themenbereichen und einer großen
     PARKPLAN-Tafel.
   - Die WILDWASSERBAHN: Baumstamm-Boote fahren durch eine Rinne, werden
     hochgezogen und rauschen eine steile Abfahrt hinunter – unten spritzt
     es. Davor die WARTESCHLANGE zwischen Metallgeländern, eine Tafel mit
     der Wartezeit und die MESSLATTE für die Mindestgröße.
   - ACHTERBAHN aus Stahl mit Looping, RIESENRAD, PARKEISENBAHN mit
     kleiner Dampflok, die quer über den Weg fährt (Bahnübergang).
   - IMBISS mit Pommes, Currywurst und Getränken; Bänke, Mülleimer,
     Blumenbeete.
   - Das MASKOTTCHEN des Parks (eine Person im Kostüm, hier ein Bär im
     Park-Shirt) begrüßt die Kinder und winkt.
   Maßstab (Zentralperspektive, Blick von der Treppe am Hauptweg):
   Augenhöhe 2,6 m, Fluchtpunkt (160 | 100), Einheiten je Meter =
   280 / Abstand: Familie vorne (9 m) ≈ 31, Imbiss (15 m) ≈ 19,
   Eingang (45 m) ≈ 6.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "freizeitpark", titel: "Der Freizeitpark", emoji: "🎢", thema: "Freizeit", kuerzel: "b14e", fassung: 852 });
const rnd = zufall(1975);
const r = B.r;
const knapp = (svg) => svg.replace(/ (d|x1|y1|x2|y2|cx|cy|rx|ry)="([^"]*)"/g, (m, a, v) => ` ${a}="${v.replace(/-?\d+\.\d+/g, (n) => String(Math.round(+n)))}"`);
const mensch = (spec, h) => { const m = B.mensch(spec, h); m.svg = knapp(m.svg); return m; };

/* ---------- Perspektive ---------------------------------------------- */
const VX = 160, YH = 100, H = 2.6, F = 280;
const s = (d) => F / d;
const X = (xm, d) => VX + xm * F / d;
const Y = (d, h = 0) => YH + (H - h) * F / d;
const P = (xm, d, h = 0) => [X(xm, d), Y(d, h)];
const pt = (xm, d, h = 0) => `${r(X(xm, d))} ${r(Y(d, h))}`;
const poly = (pp) => "M" + pp.map(([a, b]) => `${r(a)} ${r(b)}`).join(" L") + " Z";
const abs = (ax, ay, k) => `<g transform="translate(${r(-ax)} ${r(-ay)})">${k}</g>`;
function quader(x0, x1, d0, d1, h0, h1, f) {
  let o = "";
  if (x0 > 0 && f.seite) o += `<path d="${poly([P(x0, d0, h0), P(x0, d1, h0), P(x0, d1, h1), P(x0, d0, h1)])}" fill="${f.seite}"/>`;
  if (x1 < 0 && f.seite) o += `<path d="${poly([P(x1, d0, h0), P(x1, d1, h0), P(x1, d1, h1), P(x1, d0, h1)])}" fill="${f.seite}"/>`;
  if (h1 < H && f.deckel) o += `<path d="${poly([P(x0, d0, h1), P(x1, d0, h1), P(x1, d1, h1), P(x0, d1, h1)])}" fill="${f.deckel}"/>`;
  if (f.front) o += `<path d="${poly([P(x0, d0, h0), P(x1, d0, h0), P(x1, d0, h1), P(x0, d0, h1)])}" fill="${f.front}"/>`;
  return o;
}

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const STAHL = S.lg("stahl", [[0, "#eef1f3"], [0.5, "#b9c2c8"], [1, "#dfe4e7"]], 0, 0, 1, 0);
const HOLZ = S.lg("holz", [[0, "#a8703f"], [1, "#7d4f2a"]]);
const WASSER = S.lg("wasser", [[0, "#7fd0e8"], [1, "#2f8fc0"]]);
const baum = (x, y, g, f = "#4f8a46") => `<rect x="${r(x - g * 0.08)}" y="${r(y - g * 0.5)}" width="${r(g * 0.16)}" height="${r(g * 0.5)}" fill="#6b4a2a"/><circle cx="${r(x)}" cy="${r(y - g * 0.75)}" r="${r(g * 0.42)}" fill="${f}"/><circle cx="${r(x - g * 0.25)}" cy="${r(y - g * 0.6)}" r="${r(g * 0.3)}" fill="${f}"/><circle cx="${r(x + g * 0.25)}" cy="${r(y - g * 0.62)}" r="${r(g * 0.3)}" fill="${f}"/><circle cx="${r(x - g * 0.1)}" cy="${r(y - g * 0.92)}" r="${r(g * 0.18)}" fill="#fff" opacity=".12"/>`;

/* =====================================================================
   KULISSE — Sommerhimmel, Wald am Horizont, Rasen, Hauptweg, Gleis
   ===================================================================== */
{
  let k = `<rect x="0" y="0" width="320" height="${YH + 14}" fill="${S.lg("himmel", [[0, "#5aa8e8"], [0.7, "#a8d4f2"], [1, "#e4f2f8"]])}"/>`;
  for (const [x, y, g] of [[40, 22, 1], [150, 14, 0.8], [250, 30, 1.1], [300, 10, 0.7]]) k += `<g opacity=".9"><ellipse cx="${x}" cy="${y}" rx="${r(16 * g)}" ry="${r(5 * g)}" fill="#fff"/><ellipse cx="${r(x - 6 * g)}" cy="${r(y - 3 * g)}" rx="${r(8 * g)}" ry="${r(5 * g)}" fill="#fff"/><ellipse cx="${r(x + 5 * g)}" cy="${r(y - 4 * g)}" rx="${r(7 * g)}" ry="${r(5 * g)}" fill="#fff"/></g>`;
  /* Wald am Horizont */
  let w = `M0 ${YH + 14}`;
  for (let x = 0; x <= 320; x += 5) w += ` Q${x + 2.5} ${r(YH + 3 - rnd() * 8)} ${x + 5} ${r(YH + 7 - rnd() * 3)}`;
  k += `<path d="${w} L320 ${YH + 16} L0 ${YH + 16} Z" fill="#5f8f5a"/>`;
  /* Rasen */
  k += `<rect x="0" y="${YH + 12}" width="320" height="${200 - YH - 12}" fill="${S.lg("rasen", [[0, "#8fbf6a"], [1, "#6fa64e"]])}"/>`;
  for (let i = 0; i < 140; i++) { const y = YH + 14 + Math.pow(rnd(), 0.7) * (200 - YH - 14), x = rnd() * 320; k += `<path d="M${r(x)} ${r(y)} l.3 ${r(-0.6 - (y - YH) / 60)}" stroke="#5a8f3e" stroke-width=".3"/>`; }
  /* Hauptweg (Pflaster), führt zum Eingang */
  k += `<path d="${poly([P(-3.4, 45), P(3.4, 45), P(5.5, 7.2), P(-5.5, 7.2)])}" fill="${S.lg("weg", [[0, "#d8c8a8"], [1, "#c9b48e"]])}"/>`;
  let pf = "";
  for (let d = 8; d < 45; d *= 1.06) pf += `M${pt(-3.4 - (45 - d) / 37.8 * 2.1, d)} L${pt(3.4 + (45 - d) / 37.8 * 2.1, d)}`;
  for (let i = -5; i <= 5; i++) pf += `M${pt(i * 0.68, 45)} L${pt(i * 1.1, 7.2)}`;
  k += `<path d="${pf}" stroke="#a8946e" stroke-width=".3" opacity=".7"/>`;
  /* Gleis der Parkeisenbahn quer über den Weg (Bahnübergang) */
  const dG = 22.5;
  k += `<path d="M0 ${r(Y(dG + 0.6))} H320 M0 ${r(Y(dG - 0.6))} H320" stroke="#8a7a62" stroke-width="1.2"/>`;
  let sw = "";
  for (let xm = -14; xm <= 14; xm += 0.6) sw += `M${pt(xm, dG + 0.7)} L${pt(xm, dG - 0.7)}`;
  k += `<path d="${sw}" stroke="#6b4a2a" stroke-width=".8"/>`;
  k += `<path d="M0 ${r(Y(dG + 0.35))} H320 M0 ${r(Y(dG - 0.35))} H320" stroke="#7d8890" stroke-width=".5"/>`;
  /* Bäume hinten */
  for (const [xm, d, g] of [[-18, 40, 9], [14, 42, 8], [-11, 36, 8], [20, 35, 9], [-21, 30, 10]]) { const [x, y] = P(xm, d); k += baum(x, y, g * s(d) / 6, "#3f7a3a"); }
  /* Blumenbeete am Wegrand */
  for (const [xm, d] of [[-4.8, 12], [5.6, 11.5]]) {
    const [x, y] = P(xm, d), g = s(d);
    k += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(1.4 * g)}" ry="${r(0.3 * g)}" fill="#5a3a22"/>`;
    for (let i = 0; i < 26; i++) k += `<circle cx="${r(x + (rnd() - 0.5) * 2.4 * g)}" cy="${r(y - 0.15 * g + (rnd() - 0.5) * 0.4 * g)}" r="${r(0.06 * g)}" fill="${["#e8453c", "#f2c230", "#ff8ad8", "#ffffff"][i % 4]}"/>`;
  }
  S.hinten(k);
}

/* =====================================================================
   1 — DAS RIESENRAD (hinten links)
   ===================================================================== */
{
  const d = 70, sc = s(d), [x, yb] = P(-24, d), R = 12 * sc, hy = Y(d, 14);
  let k = `<path d="M${r(x - 0.35 * R)} ${r(yb)} L${r(x)} ${r(hy)} L${r(x + 0.35 * R)} ${r(yb)}" stroke="#c9ced6" stroke-width="1.1" fill="none"/>`;
  k += `<circle cx="${r(x)}" cy="${r(hy)}" r="${r(R)}" fill="none" stroke="#f4f6f8" stroke-width="1.2"/><circle cx="${r(x)}" cy="${r(hy)}" r="${r(R * 0.5)}" fill="none" stroke="#d6dbe2" stroke-width=".4"/>`;
  let sp = "";
  for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8; sp += `M${r(x)} ${r(hy)} L${r(x + Math.cos(a) * R)} ${r(hy + Math.sin(a) * R)}`; }
  k += `<path d="${sp}" stroke="#dfe3e8" stroke-width=".35"/>`;
  const gf = ["#e8453c", "#2f86d0", "#f2c230", "#38c172"];
  for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8, gx = x + Math.cos(a) * R, gy = hy + Math.sin(a) * R; k += `<path d="M${r(gx)} ${r(gy)} V${r(gy + 1.3)}" stroke="#666" stroke-width=".3"/><path d="M${r(gx - 2)} ${r(gy + 1.3)} h4 l-.4 3 q-1.6 .9 -3.2 0 Z" fill="${gf[i % 4]}"/><rect x="${r(gx - 1.4)}" y="${r(gy + 1.8)}" width="2.8" height=".9" fill="#dff1fb"/>`; }
  k += `<circle cx="${r(x)}" cy="${r(hy)}" r="2" fill="#f4f6f8" stroke="#9aa3aa" stroke-width=".3"/>`;
  S.teil({ id: "riesenrad_fp", de: "das Riesenrad", syl: "RIE-sen-rad", it: "la ruota panoramica", itSyl: "RUO-ta pa-no-RA-mi-ca", en: "ferris wheel", x, y: yb, steht: true, kunst: abs(x, yb, k) });
}

/* =====================================================================
   2 — DIE ACHTERBAHN (Stahl, mit Looping, hinten rechts)
   ===================================================================== */
{
  const d = 55, yb = Y(d), xs = (xm) => X(xm, d), ys = (h) => Y(d, h);
  const bahn = `M${r(xs(9))} ${r(ys(2))} L${r(xs(15))} ${r(ys(18))} Q${r(xs(16))} ${r(ys(19.2))} ${r(xs(17))} ${r(ys(17))} Q${r(xs(19.5))} ${r(ys(0.8))} ${r(xs(22))} ${r(ys(1.5))} ` +
    `C${r(xs(27))} ${r(ys(2))} ${r(xs(28))} ${r(ys(13))} ${r(xs(25))} ${r(ys(13))} C${r(xs(22))} ${r(ys(13))} ${r(xs(23))} ${r(ys(2.2))} ${r(xs(28))} ${r(ys(2.4))} Q${r(xs(29.5))} ${r(ys(8))} ${r(xs(30.5))} ${r(ys(3))}`;
  let st = "";
  for (const [xm, h] of [[10.5, 6], [12, 10.2], [13.5, 14.2], [15, 18], [16.6, 18.2], [18.2, 8.5], [20, 1.6], [25, 2], [29.4, 7.4]]) st += `M${r(xs(xm))} ${r(yb)} V${r(ys(h))}`;
  let k = `<path d="${st}" stroke="#f4f6f8" stroke-width="1.1"/><path d="${st}" stroke="#b9c2c8" stroke-width=".3" transform="translate(.45 0)"/>`;
  k += `<path d="${bahn}" stroke="#1f5fae" stroke-width="1.8" fill="none"/><path d="${bahn}" stroke="#7fb0ea" stroke-width=".4" fill="none" transform="translate(0 -.5)"/>`;
  /* Zug in der Abfahrt */
  const zx = xs(18.4), zy = ys(7);
  k += `<g transform="rotate(68 ${r(zx)} ${r(zy)})"><rect x="${r(zx - 5)}" y="${r(zy - 2.4)}" width="10" height="2.2" rx=".6" fill="#e8453c"/><rect x="${r(zx - 4.4)}" y="${r(zy - 3.2)}" width="1.6" height="1" fill="#f2c230"/><rect x="${r(zx - 0.8)}" y="${r(zy - 3.2)}" width="1.6" height="1" fill="#2f86d0"/><rect x="${r(zx + 2.8)}" y="${r(zy - 3.2)}" width="1.6" height="1" fill="#38c172"/></g>`;
  const ax = xs(20);
  S.teil({ id: "achterbahn_fp", de: "die Achterbahn", syl: "ACH-ter-bahn", it: "le montagne russe", itSyl: "mon-TA-gne RUS-se", en: "roller coaster", x: ax, y: yb, steht: true, kunst: abs(ax, yb, k),
    tipp: "Im Freizeitpark steht sie fest verankert — auf dem Jahrmarkt wird sie jedes Mal neu aufgebaut." });
}

/* =====================================================================
   3 — DER EINGANG (Torbau mit Kassen und Drehkreuzen, hinten Mitte)
   ===================================================================== */
{
  const d = 45, sc = s(d), [cx, yb] = P(0, d);
  let k = "";
  /* Zaun links und rechts */
  let z = "";
  for (let xm = -14; xm <= 14; xm += 0.5) if (Math.abs(xm) > 4.4) z += `M${pt(xm, d)} L${pt(xm, d, 1.6)}`;
  k += `<path d="${z}" stroke="#4a5a4a" stroke-width=".35"/><path d="M${pt(-14, d, 1.5)} L${pt(-4.4, d, 1.5)} M${pt(4.4, d, 1.5)} L${pt(14, d, 1.5)}" stroke="#4a5a4a" stroke-width=".6"/>`;
  /* Türme */
  for (const sx of [-1, 1]) {
    const xa = X(sx * 4.6 - 1.1, d), xe = X(sx * 4.6 + 1.1, d), yT = Y(d, 6.2);
    k += `<rect x="${r(xa)}" y="${r(yT)}" width="${r(xe - xa)}" height="${r(yb - yT)}" fill="${S.lg("turm", [[0, "#f1dcb4"], [1, "#d8bb88"]], 0, 0, 1, 0)}"/>`;
    k += `<path d="M${r(xa - 1)} ${r(yT)} L${r((xa + xe) / 2)} ${r(yT - 2.4 * sc)} L${r(xe + 1)} ${r(yT)} Z" fill="#c8402e"/>`;
    k += `<path d="M${r((xa + xe) / 2)} ${r(yT - 2.4 * sc)} v-4" stroke="#555" stroke-width=".3"/><path d="M${r((xa + xe) / 2)} ${r(yT - 2.4 * sc - 4)} l3.4 1 l-3.4 1 Z" fill="${sx < 0 ? "#2f86d0" : "#f2c230"}"/>`;
    /* Kassenfenster */
    k += `<rect x="${r(xa + 2)}" y="${r(Y(d, 2.2))}" width="${r(xe - xa - 4)}" height="${r(0.9 * sc)}" fill="#3a5a7a"/><text x="${r((xa + xe) / 2)}" y="${r(Y(d, 2.45))}" font-size="1.5" text-anchor="middle" fill="#7a2a1a" font-family="Arial" font-weight="bold">KASSE</text>`;
  }
  /* Bogen mit Schild */
  const xl = X(-3.5, d), xr = X(3.5, d), yA = Y(d, 4.6);
  k += `<path d="M${r(xl)} ${r(yA + 3)} Q${r(cx)} ${r(yA - 4)} ${r(xr)} ${r(yA + 3)} L${r(xr)} ${r(yA - 3.2)} Q${r(cx)} ${r(yA - 10)} ${r(xl)} ${r(yA - 3.2)} Z" fill="#2f86d0"/>`;
  k += `<text x="${r(cx)}" y="${r(yA - 1.6)}" font-size="4.4" text-anchor="middle" fill="#ffe066" font-family="Arial Black,Arial" font-weight="900">ABENTEUERLAND</text>`;
  /* Drehkreuze */
  for (let i = 0; i < 4; i++) { const xm = -2.4 + i * 1.6, [x, y] = P(xm, d); k += `<rect x="${r(x - 1.2)}" y="${r(y - 0.9 * sc)}" width="2.4" height="${r(0.9 * sc)}" fill="${STAHL}"/><path d="M${r(x + 1.2)} ${r(y - 0.6 * sc)} h2.4 M${r(x + 1.2)} ${r(y - 0.6 * sc)} l1.8 1.2" stroke="#8d989f" stroke-width=".4"/>`; }
  S.teil({ id: "eingang", de: "der Eingang", syl: "EIN-gang", it: "l'ingresso", itSyl: "in-GRES-so", en: "entrance", x: cx, y: yb, steht: true, kunst: abs(cx, yb, k),
    tipp: "Am Eingang zeigt man die Eintrittskarte und geht durch das Drehkreuz." });
}

/* =====================================================================
   4 — DER PARKPLAN (große Tafel am Weg)
   ===================================================================== */
{
  const d = 31, sc = s(d), x0 = 4.0, x1 = 7.4, [ax, yb] = P((x0 + x1) / 2, d);
  const xa = X(x0, d), xe = X(x1, d), y0 = Y(d, 3.1), y1 = Y(d, 1.1);
  let k = `<path d="M${r(xa + 2)} ${r(yb)} V${r(y1)} M${r(xe - 2)} ${r(yb)} V${r(y1)}" stroke="#6b4a2a" stroke-width="1.2"/>`;
  k += `<rect x="${r(xa)}" y="${r(y0)}" width="${r(xe - xa)}" height="${r(y1 - y0)}" rx=".6" fill="#6b4a2a"/><rect x="${r(xa + 0.8)}" y="${r(y0 + 0.8)}" width="${r(xe - xa - 1.6)}" height="${r(y1 - y0 - 1.6)}" fill="#cfe7b0"/>`;
  /* Karte: Wege, See, Fahrgeschäfte als Symbole */
  const mx = (t) => xa + 0.8 + t * (xe - xa - 1.6), my = (t) => y0 + 0.8 + t * (y1 - y0 - 1.6);
  k += `<ellipse cx="${r(mx(0.3))}" cy="${r(my(0.6))}" rx="${r((xe - xa) * 0.15)}" ry="${r((y1 - y0) * 0.18)}" fill="#7fc0e8"/>`;
  k += `<path d="M${r(mx(0.5))} ${r(my(1))} L${r(mx(0.5))} ${r(my(0.5))} L${r(mx(0.2))} ${r(my(0.2))} M${r(mx(0.5))} ${r(my(0.5))} L${r(mx(0.85))} ${r(my(0.3))}" stroke="#f4ead2" stroke-width="1" fill="none"/>`;
  for (const [t, u, f] of [[0.2, 0.2, "#e8453c"], [0.85, 0.3, "#2f86d0"], [0.75, 0.75, "#f2c230"], [0.15, 0.85, "#8a4fc0"]]) k += `<circle cx="${r(mx(t))}" cy="${r(my(u))}" r="1.2" fill="${f}" stroke="#fff" stroke-width=".3"/>`;
  k += `<circle cx="${r(mx(0.5))}" cy="${r(my(0.92))}" r=".9" fill="#d23a33"/><text x="${r(mx(0.5) + 1.4)}" y="${r(my(0.94))}" font-size="1.3" fill="#d23a33" font-family="Arial" font-weight="bold">Sie sind hier</text>`;
  k += `<rect x="${r(xa)}" y="${r(y0 - 2.6)}" width="${r(xe - xa)}" height="2.8" fill="#2f86d0"/><text x="${r(ax)}" y="${r(y0 - 0.6)}" font-size="2.1" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">PARKPLAN</text>`;
  S.teil({ id: "karte", de: "der Parkplan", syl: "PARK-plan", it: "la mappa del parco", itSyl: "MAP-pa del PAR-co", en: "park map", x: ax, y: yb, steht: true, kunst: abs(ax, yb, k),
    tipp: "Auf dem Parkplan zeigt ein roter Punkt: Hier stehst du." });
}

/* =====================================================================
   5 — DIE WILDWASSERBAHN (Abfahrt im Profil, links) mit Platschbecken
   ===================================================================== */
{
  const d = 28, sc = s(d), yb = Y(d);
  const bahnP = (t) => { /* t 0…1 von oben links nach unten rechts */ const xm = -15.5 + t * 9.5, h = 9.6 * Math.pow(1 - t, 1.6) + 0.6; return P(xm, d, h); };
  let k = "";
  /* Felsen und Platschbecken */
  const [bx, by] = P(-5.2, d);
  k += `<ellipse cx="${r(bx)}" cy="${r(by)}" rx="${r(3.6 * sc)}" ry="${r(0.7 * sc)}" fill="${WASSER}"/>`;
  k += `<path d="M${r(bx - 3.8 * sc)} ${r(by)} q${r(1 * sc)} ${r(-1.2 * sc)} ${r(2.2 * sc)} ${r(-0.6 * sc)} q${r(0.6 * sc)} ${r(-0.8 * sc)} ${r(1.4 * sc)} 0" fill="#8a7a68"/><path d="M${r(bx + 2.6 * sc)} ${r(by)} q${r(0.6 * sc)} ${r(-1.4 * sc)} ${r(1.6 * sc)} ${r(-0.4 * sc)} L${r(bx + 4 * sc)} ${r(by)} Z" fill="#7a6a58"/>`;
  /* Stützen unter der Rinne */
  let st = "";
  for (let t = 0.04; t < 0.8; t += 0.09) { const [x, y] = bahnP(t); st += `M${r(x)} ${r(y + 1.5)} V${r(yb)} M${r(x - 1.6)} ${r(yb)} L${r(x)} ${r(y + 4)} L${r(x + 1.6)} ${r(yb)}`; }
  k += `<path d="${st}" stroke="#7d4f2a" stroke-width=".7"/>`;
  /* Rinne (Holzoptik) mit Wasser */
  let o = "", u = "";
  for (let i = 0; i <= 30; i++) { const [x, y] = bahnP(i / 30); o += (i ? " L" : "M") + `${r(x)} ${r(y - 1.6)}`; u = ` L${r(x)} ${r(y + 1.8)}` + u; }
  k += `<path d="${o}${u} Z" fill="${HOLZ}"/>`;
  let wl = "";
  for (let i = 0; i <= 30; i++) { const [x, y] = bahnP(i / 30); wl += (i ? " L" : "M") + `${r(x)} ${r(y - 1.2)}`; }
  k += `<path d="${wl}" stroke="#9fe0f2" stroke-width=".9" fill="none"/>`;
  /* Station oben (Holzhütte) */
  const [sx, sy] = bahnP(0);
  k += `<path d="M${r(sx - 12)} ${r(sy + 2)} L${r(sx + 4)} ${r(sy + 2)} L${r(sx + 4)} ${r(sy - 6)} L${r(sx - 4)} ${r(sy - 11)} L${r(sx - 12)} ${r(sy - 6)} Z" fill="#8a5a2e"/><path d="M${r(sx - 13.5)} ${r(sy - 5.6)} L${r(sx - 4)} ${r(sy - 12)} L${r(sx + 5.5)} ${r(sy - 5.6)}" stroke="#5a3418" stroke-width="1.4" fill="none"/>`;
  /* Baumstamm-Boot unten im Wasser, Gischt */
  const [ex, ey] = bahnP(1);
  k += `<path d="M${r(ex - 7)} ${r(ey + 0.5)} Q${r(ex - 7)} ${r(ey - 2.6)} ${r(ex - 3)} ${r(ey - 2.6)} L${r(ex + 5)} ${r(ey - 2.6)} Q${r(ex + 7.5)} ${r(ey - 2)} ${r(ex + 7)} ${r(ey + 0.5)} Z" fill="${S.lg("stamm", [[0, "#b07a44"], [1, "#7d4f2a"]])}"/>`;
  k += `<ellipse cx="${r(ex + 6)}" cy="${r(ey - 1)}" rx="1.3" ry="1.7" fill="#d9a870" stroke="#7d4f2a" stroke-width=".3"/>`;
  for (let i = 0; i < 16; i++) { const a = -Math.PI * (0.1 + 0.8 * rnd()), l = 4 + rnd() * 9; k += `<path d="M${r(ex - 3)} ${r(ey - 1)} q${r(Math.cos(a) * l * 0.5)} ${r(Math.sin(a) * l)} ${r(Math.cos(a) * l)} ${r(Math.sin(a) * l * 0.6)}" stroke="#ffffff" stroke-width="${r(0.6 + rnd() * 0.8)}" opacity=".8" fill="none" stroke-linecap="round"/>`; }
  for (let i = 0; i < 12; i++) k += `<circle cx="${r(ex - 10 + rnd() * 14)}" cy="${r(ey - 4 - rnd() * 9)}" r="${r(0.4 + rnd() * 0.8)}" fill="#ffffff" opacity=".85"/>`;
  /* Schild */
  k += `<rect x="${r(bx - 13)}" y="${r(by - 0.9 * sc - 5)}" width="26" height="5" rx=".6" fill="#6b4a2a"/><text x="${r(bx)}" y="${r(by - 0.9 * sc - 1.4)}" font-size="3" text-anchor="middle" fill="#ffe9a8" font-family="Georgia,serif" font-weight="bold">Wildwasserbahn</text><path d="M${r(bx - 9)} ${r(by - 0.9 * sc)} V${r(by)} M${r(bx + 9)} ${r(by - 0.9 * sc)} V${r(by)}" stroke="#6b4a2a" stroke-width=".8"/>`;
  const [ax, ay] = P(-8, d);
  S.teil({ id: "wildwasserbahn", de: "die Wildwasserbahn", syl: "WILD-was-ser-bahn", it: "la discesa sull'acqua", itSyl: "di-SCE-sa sul-l'AC-qua", en: "log flume", x: ax, y: ay, steht: true, kunst: abs(ax, ay, k),
    tipp: "Unten schlägt das Boot ins Wasser — und alle werden nass." });
}

/* =====================================================================
   6 — DIE PARKEISENBAHN (Dampflok mit zwei Wagen, links auf dem Gleis)
   ===================================================================== */
{
  const d = 22.5, sc = s(d), [x0, yb] = P(-9.4, d), L = 7.2 * sc;
  let k = schatten(L / 2, 0, L / 2, 1, 0.3);
  /* Wagen (offen, mit Dach) */
  for (let i = 0; i < 2; i++) {
    const wx = i * 2.6 * sc, ww = 2.4 * sc;
    k += `<rect x="${r(wx)}" y="${r(-0.9 * sc)}" width="${r(ww)}" height="${r(0.6 * sc)}" fill="${i ? "#2f86d0" : "#38c172"}"/><rect x="${r(wx)}" y="${r(-1.95 * sc)}" width="${r(ww)}" height="${r(0.18 * sc)}" fill="#c8402e"/>`;
    for (const t of [0.05, 0.5, 0.95]) k += `<rect x="${r(wx + ww * t - 0.3)}" y="${r(-1.8 * sc)}" width=".6" height="${r(0.9 * sc)}" fill="#6b4a2a"/>`;
    for (const t of [0.22, 0.78]) k += `<circle cx="${r(wx + ww * t)}" cy="${r(-0.25 * sc)}" r="${r(0.24 * sc)}" fill="#2b2b2b"/><circle cx="${r(wx + ww * t)}" cy="${r(-0.25 * sc)}" r="${r(0.1 * sc)}" fill="#9aa3aa"/>`;
  }
  /* Dampflok vorne (rechts) */
  const lx = 5.3 * sc;
  k += `<rect x="${r(lx)}" y="${r(-1.0 * sc)}" width="${r(1.9 * sc)}" height="${r(0.7 * sc)}" rx="${r(0.3 * sc)}" fill="#2b2b2b"/>`;
  k += `<rect x="${r(lx)}" y="${r(-1.75 * sc)}" width="${r(0.8 * sc)}" height="${r(0.8 * sc)}" fill="#c8402e"/><rect x="${r(lx - 0.05 * sc)}" y="${r(-1.85 * sc)}" width="${r(0.9 * sc)}" height="${r(0.14 * sc)}" fill="#2b2b2b"/>`;
  k += `<rect x="${r(lx + 0.15 * sc)}" y="${r(-1.6 * sc)}" width="${r(0.4 * sc)}" height="${r(0.3 * sc)}" fill="#dff1fb"/>`;
  k += `<rect x="${r(lx + 1.45 * sc)}" y="${r(-1.6 * sc)}" width="${r(0.22 * sc)}" height="${r(0.6 * sc)}" fill="#2b2b2b"/><path d="M${r(lx + 1.56 * sc)} ${r(-1.65 * sc)} q-2 -3 1 -5 q3 -2 1 -5" stroke="#f4f6f8" stroke-width="2" opacity=".75" fill="none"/>`;
  k += `<circle cx="${r(lx + 1.55 * sc)}" cy="${r(-0.65 * sc)}" r="${r(0.1 * sc)}" fill="#ffe066"/>`;
  for (const t of [0.25, 0.75]) k += `<circle cx="${r(lx + 1.9 * sc * t)}" cy="${r(-0.27 * sc)}" r="${r(0.27 * sc)}" fill="#c8402e" stroke="#2b2b2b" stroke-width=".4"/>`;
  S.teil({ id: "parkbahn", de: "die Parkeisenbahn", syl: "PARK-ei-sen-bahn", it: "il trenino", itSyl: "tre-NI-no", en: "park railway", x: x0, y: yb, steht: true, kunst: k,
    tipp: "Mit der kleinen Parkeisenbahn fährt man einmal rund um den Park." });
}

/* =====================================================================
   7 — DIE WARTESCHLANGE vor der Wildwasserbahn (Geländer im Zickzack)
       mit Wartezeit-Tafel und Messlatte
   ===================================================================== */
{
  const x0 = -9.6, x1 = -4.0, reihen = [20.6, 19.4, 18.2, 17.0];
  let k = "";
  reihen.forEach((d, i) => {
    const xa = i % 2 ? x0 + 0.8 : x0, xe = i % 2 ? x1 : x1 - 0.8;
    k += `<path d="M${pt(xa, d, 0.95)} L${pt(xe, d, 0.95)} M${pt(xa, d, 0.5)} L${pt(xe, d, 0.5)}" stroke="${STAHL}" stroke-width="${r(0.06 * s(d) + 0.3)}"/>`;
    for (let xm = xa; xm <= xe + 0.01; xm += 1.4) k += `<path d="M${pt(xm, d)} L${pt(xm, d, 0.98)}" stroke="#9aa3aa" stroke-width="${r(0.05 * s(d) + 0.2)}"/>`;
  });
  /* Umkehrbögen */
  for (const [a, b, xm] of [[20.6, 19.4, x1], [18.2, 17.0, x1], [19.4, 18.2, x0]]) k += `<path d="M${pt(xm, a, 0.95)} Q${pt(xm + (xm > -7 ? 0.5 : -0.5), (a + b) / 2, 0.95)} ${pt(xm, b, 0.95)}" stroke="${STAHL}" stroke-width=".8" fill="none"/>`;
  /* Wartezeit-Tafel am Anfang der Schlange */
  const [tx, ty] = P(-3.3, 16.6), sc = s(16.6);
  k += `<path d="M${r(tx)} ${r(ty)} V${r(ty - 2.2 * sc)}" stroke="#6b4a2a" stroke-width="1"/><rect x="${r(tx - 9)}" y="${r(ty - 2.75 * sc)}" width="18" height="${r(0.65 * sc)}" rx=".8" fill="#6b4a2a"/>`;
  k += `<text x="${r(tx)}" y="${r(ty - 2.75 * sc + 3.6)}" font-size="2.2" text-anchor="middle" fill="#ffe9a8" font-family="Arial" font-weight="bold">Wartezeit</text><text x="${r(tx)}" y="${r(ty - 2.75 * sc + 8)}" font-size="4" text-anchor="middle" fill="#ffffff" font-family="Arial Black,Arial" font-weight="900">20 Min.</text>`;
  const [ax, ay] = P(-6.8, 17.0);
  S.teil({ id: "warteschlange", de: "die Warteschlange", syl: "WAR-te-schlan-ge", it: "la coda", itSyl: "CO-da", en: "queue", x: ax, y: ay, kunst: abs(ax, ay, k),
    tipp: "Die Tafel zeigt, wie lange man in der Warteschlange wartet." });
}
{
  /* DIE MESSLATTE — Holzfigur mit ausgestrecktem Arm bei 1,10 m */
  const d = 16.4, sc = s(d), [x, y] = P(-10.3, d), h = 1.1 * sc;
  let k = schatten(0, 0, 3, 0.6, 0.3);
  k += `<rect x="-1.4" y="${r(-h - 2)}" width="2.8" height="${r(h + 2)}" rx=".8" fill="#f2c230" stroke="#b8860b" stroke-width=".3"/>`;
  for (let i = 1; i < 6; i++) k += `<path d="M-1.4 ${r(-h * i / 5)} h1.2" stroke="#7a5a08" stroke-width=".25"/>`;
  k += `<path d="M1.2 ${r(-h)} h5" stroke="#e8453c" stroke-width="1.1" stroke-linecap="round"/><circle cx="6.6" cy="${r(-h)}" r=".9" fill="#f6d2b0"/>`;
  k += `<circle cx="0" cy="${r(-h - 4)}" r="2.4" fill="#f6d2b0" stroke="#b8860b" stroke-width=".3"/><circle cx="-.8" cy="${r(-h - 4.3)}" r=".3" fill="#222"/><circle cx=".8" cy="${r(-h - 4.3)}" r=".3" fill="#222"/><path d="M-.9 ${r(-h - 3.3)} q.9 .7 1.8 0" stroke="#222" stroke-width=".25" fill="none"/>`;
  k += `<text x="0" y="${r(-h * 0.45)}" font-size="1.5" text-anchor="middle" fill="#5a3a08" font-family="Arial" font-weight="bold" transform="rotate(-90 0 ${r(-h * 0.45)})">1,10 m</text>`;
  S.teil({ id: "messlatte", de: "die Messlatte", syl: "MESS-lat-te", it: "il misuratore d'altezza", itSyl: "mi-su-ra-TO-re d'al-TEZ-za", en: "height sign", x, y, steht: true, kunst: k,
    tipp: "Wer kleiner als 1,10 Meter ist, darf noch nicht mitfahren." });
}

/* =====================================================================
   8 — DER IMBISS (rechts) — Lupe: Pommes, Currywurst, Limonade, Brezel
   ===================================================================== */
{
  const d = 15.5, sc = s(d), x0 = 4.4, x1 = 8.0;
  const [ax, yb] = P((x0 + x1) / 2, d), xa = X(x0, d), xe = Math.min(319, X(x1, d)), yT = Y(d, 1.05), yD = Y(d, 2.5), yS = Y(d, 3.2);
  let k = schatten(ax, yb, (xe - xa) / 2 + 2, 1.6, 0.35);
  k += `<rect x="${r(xa)}" y="${r(yD)}" width="${r(xe - xa)}" height="${r(yT - yD)}" fill="#fff4dc"/>`;
  /* Preistafel und Fritteuse */
  k += `<rect x="${r(xa + 2)}" y="${r(yD + 1.5)}" width="${r((xe - xa) * 0.45)}" height="${r((yT - yD) * 0.55)}" fill="#2b2b2b"/>`;
  [["Pommes", "3,50"], ["Currywurst", "4,50"], ["Limonade", "2,80"], ["Brezel", "2,20"]].forEach(([t, p], i) => { k += `<text x="${r(xa + 3)}" y="${r(yD + 4 + i * 2.6)}" font-size="1.7" fill="#fff" font-family="Arial">${t}</text><text x="${r(xa + 1.6 + (xe - xa) * 0.45)}" y="${r(yD + 4 + i * 2.6)}" font-size="1.7" text-anchor="end" fill="#ffe066" font-family="Arial">${p} €</text>`; });
  k += `<rect x="${r(xe - 15)}" y="${r(yD + 3)}" width="11" height="6" fill="${STAHL}"/><rect x="${r(xe - 14)}" y="${r(yD + 2)}" width="4" height="1.2" fill="#8d989f"/><rect x="${r(xe - 9)}" y="${r(yD + 2)}" width="4" height="1.2" fill="#8d989f"/>`;
  /* Theke */
  k += `<rect x="${r(xa)}" y="${r(yT)}" width="${r(xe - xa)}" height="${r(yb - yT)}" fill="${S.lg("ith", [[0, "#f2c230"], [1, "#d89a10"]])}"/>`;
  for (let x = xa + 2; x < xe - 1; x += 5) k += `<rect x="${r(x)}" y="${r(yT + 1.5)}" width="2.5" height="${r(yb - yT - 2.5)}" fill="#e8a820"/>`;
  k += `<rect x="${r(xa - 0.6)}" y="${r(yT - 1)}" width="${r(xe - xa + 1.2)}" height="1.6" fill="#ffffff"/>`;
  /* auf der Theke: Pommes-Tüte, Currywurst-Schale, Limonade, Brezel */
  const pX = xa + (xe - xa) * 0.18, cX = xa + (xe - xa) * 0.42, lX = xa + (xe - xa) * 0.64, bX = xa + (xe - xa) * 0.85;
  k += `<path d="M${r(pX - 2.2)} ${r(yT - 1)} L${r(pX - 2.8)} ${r(yT - 5)} L${r(pX + 2.8)} ${r(yT - 5)} L${r(pX + 2.2)} ${r(yT - 1)} Z" fill="#d23a33"/>`;
  for (let i = 0; i < 9; i++) k += `<rect x="${r(pX - 2.4 + i * 0.55)}" y="${r(yT - 7 - (i % 3) * 0.8)}" width=".5" height="3.4" fill="#f6d36b" transform="rotate(${-12 + i * 3} ${r(pX)} ${r(yT - 5)})"/>`;
  k += `<path d="M${r(pX + 0.6)} ${r(yT - 7.2)} q1 -1 2 0" stroke="#fff" stroke-width=".9" fill="none"/>`;
  k += `<path d="M${r(cX - 3.4)} ${r(yT - 1)} L${r(cX - 3)} ${r(yT - 2.6)} L${r(cX + 3)} ${r(yT - 2.6)} L${r(cX + 3.4)} ${r(yT - 1)} Z" fill="#f4f4f0"/>`;
  for (let i = 0; i < 5; i++) k += `<ellipse cx="${r(cX - 2.2 + i * 1.1)}" cy="${r(yT - 2.9)}" rx=".55" ry=".4" fill="#b8402e"/><circle cx="${r(cX - 2.2 + i * 1.1)}" cy="${r(yT - 3.1)}" r=".15" fill="#e8b020"/>`;
  k += `<path d="M${r(cX + 1.6)} ${r(yT - 2.6)} l1.4 -2" stroke="#e6c35a" stroke-width=".3"/>`;
  k += `<path d="M${r(lX - 1.2)} ${r(yT - 1)} L${r(lX - 1.4)} ${r(yT - 6)} L${r(lX + 1.4)} ${r(yT - 6)} L${r(lX + 1.2)} ${r(yT - 1)} Z" fill="#9fe0f2" opacity=".85"/><rect x="${r(lX - 1.3)}" y="${r(yT - 4.6)}" width="2.6" height="2.6" fill="#f2a01a" opacity=".8"/><path d="M${r(lX + 0.4)} ${r(yT - 6)} l.8 -2.4" stroke="#e8453c" stroke-width=".35"/>`;
  k += `<path d="M${r(bX - 2.4)} ${r(yT - 2)} C${r(bX - 3.6)} ${r(yT - 4.4)} ${r(bX - 1)} ${r(yT - 6)} ${r(bX)} ${r(yT - 3.6)} C${r(bX + 1)} ${r(yT - 6)} ${r(bX + 3.6)} ${r(yT - 4.4)} ${r(bX + 2.4)} ${r(yT - 2)}" stroke="#8a4614" stroke-width="1" fill="none" stroke-linecap="round"/>`;
  /* Dach (Markise) und Schild */
  k += `<path d="M${r(xa - 2)} ${r(yD + 2)} L${r(xe + 1)} ${r(yD + 2)} L${r(xe)} ${r(yD - 1)} L${r(xa)} ${r(yD - 1)} Z" fill="#ffffff"/>`;
  for (let x = xa - 1; x < xe; x += 5) k += `<path d="M${r(x)} ${r(yD + 2)} h2.5 l-.4 -3 h-2.5 Z" fill="#e8453c"/>`;
  k += `<rect x="${r(xa)}" y="${r(yS)}" width="${r(xe - xa)}" height="${r(yD - 1 - yS)}" rx=".8" fill="#2f86d0"/><text x="${r((xa + xe) / 2)}" y="${r(yS + (yD - 1 - yS) * 0.74)}" font-size="${r((yD - 1 - yS) * 0.62)}" text-anchor="middle" fill="#fff" font-family="Arial Black,Arial" font-weight="900">IMBISS</text>`;
  const unter = [
    { id: "pommes", de: "die Pommes", syl: "POM-mes", it: "le patatine fritte", itSyl: "pa-ta-TI-ne FRIT-te", en: "chips", x: pX, y: yT, kunst: flaeche(-3.4, -9.4, 6.8, 9.4), tipp: "„Pommes rot-weiß“ heißt: mit Ketchup und Mayo." },
    { id: "currywurst", de: "die Currywurst", syl: "CUR-ry-wurst", it: "il currywurst", itSyl: "CUR-ry-wurst", en: "curry sausage", x: cX, y: yT, kunst: flaeche(-4, -5.6, 8, 5.6) },
    { id: "limonade", de: "die Limonade", syl: "li-mo-NA-de", it: "la limonata", itSyl: "li-mo-NA-ta", en: "lemonade", x: lX, y: yT, kunst: flaeche(-2.6, -8.6, 5.2, 8.6) },
    { id: "brezel", de: "die Brezel", syl: "BRE-zel", it: "il pretzel", itSyl: "PRET-zel", en: "pretzel", x: bX, y: yT, kunst: flaeche(-3.6, -6.4, 7.2, 5.4) },
  ];
  S.teil({ id: "imbiss", de: "der Imbiss", syl: "IM-biss", it: "il chiosco", itSyl: "CHIO-sco", en: "snack bar", x: ax, y: yb, steht: true, kunst: abs(ax, yb, k),
    zoom: { x: r(xa - 1), y: r(yD - 3), w: r(xe - xa + 2), h: r((xe - xa + 2) / 1.5) }, unter });
}

/* =====================================================================
   9 — DER WEGWEISER (an der Weggabelung vorne links)
   ===================================================================== */
{
  const d = 9.2, sc = s(d), [x, y] = P(-3.0, d), hP = 3.0 * sc;
  let k = schatten(0, 0, 3, 0.8, 0.35);
  k += `<rect x="-.9" y="${r(-hP)}" width="1.8" height="${r(hP)}" fill="${S.lg("pfosten", [[0, "#8a5a2e"], [0.5, "#a8703f"], [1, "#6b4322"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-1.6 ${r(-hP)} L0 ${r(-hP - 2.4)} L1.6 ${r(-hP)} Z" fill="#c8402e"/>`;
  const schilder = [["Wildwasserbahn", -1, "#2f86d0", 0.0], ["Achterbahn", 1, "#e8453c", 0.36], ["Riesenrad", -1, "#38c172", 0.72], ["Imbiss", 1, "#f2a01a", 1.08]];
  schilder.forEach(([t, dir, f, dy]) => {
    const yy = -hP + 3 + dy * sc * 0.42 * 2, w = 0.95 * sc, hh = 0.32 * sc;
    const x0 = dir > 0 ? 0.6 : -0.6 - w, xs = dir > 0 ? x0 + w : x0;
    k += `<path d="M${r(x0)} ${r(yy)} H${r(x0 + w)} ${dir > 0 ? `L${r(xs + hh * 0.6)} ${r(yy + hh / 2)}` : ""} L${r(x0 + w)} ${r(yy + hh)} H${r(x0)} ${dir < 0 ? `L${r(xs - hh * 0.6)} ${r(yy + hh / 2)}` : ""} Z" fill="${f}" stroke="#ffffff" stroke-width=".35"/>`;
    k += `<text x="${r(x0 + w / 2)}" y="${r(yy + hh * 0.68)}" font-size="${r(hh * 0.5)}" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">${t}</text>`;
  });
  S.teil({ id: "wegweiser", de: "der Wegweiser", syl: "WEG-wei-ser", it: "il cartello indicatore", itSyl: "car-TEL-lo in-di-ca-TO-re", en: "signpost", x, y, steht: true, kunst: k,
    tipp: "Der Wegweiser zeigt, wo es zur Achterbahn oder zum Imbiss geht." });
}

/* =====================================================================
   10 — DIE BANK und DER MÜLLEIMER (vorne rechts)
   ===================================================================== */
{
  const d = 8.4, x0 = 3.4, x1 = 5.2, [ax, ay] = P((x0 + x1) / 2, d);
  let k = schatten(ax, ay, (X(x1, d) - X(x0, d)) / 2 + 2, 1.4, 0.3);
  for (const xm of [x0 + 0.12, x1 - 0.12]) k += `<path d="M${pt(xm, d - 0.1)} L${pt(xm, d - 0.1, 0.45)} L${pt(xm, d + 0.25, 0.9)} M${pt(xm, d + 0.3)} L${pt(xm, d + 0.3, 0.45)}" stroke="#2b3a2b" stroke-width="1.4" fill="none"/>`;
  for (let i = 0; i < 3; i++) k += `<path d="${poly([P(x0, d - 0.15 + i * 0.15, 0.45), P(x1, d - 0.15 + i * 0.15, 0.45), P(x1, d - 0.05 + i * 0.15, 0.45), P(x0, d - 0.05 + i * 0.15, 0.45)])}" fill="#a8703f" stroke="#7d4f2a" stroke-width=".2"/>`;
  for (let i = 0; i < 3; i++) k += `<path d="${poly([P(x0, d + 0.28, 0.55 + i * 0.13), P(x1, d + 0.28, 0.55 + i * 0.13), P(x1, d + 0.28, 0.64 + i * 0.13), P(x0, d + 0.28, 0.64 + i * 0.13)])}" fill="#b07a44" stroke="#7d4f2a" stroke-width=".2"/>`;
  S.teil({ id: "bank", de: "die Bank", syl: "BANK", it: "la panchina", itSyl: "pan-CHI-na", en: "bench", x: ax, y: ay, steht: true, kunst: abs(ax, ay, k) });
}
{
  const d = 8.0, sc = s(d), [x, y] = P(2.55, d), w = 0.5 * sc, hh = 0.9 * sc;
  let k = schatten(0, 0, w / 2 + 1, 1, 0.35);
  k += `<path d="M${r(-w / 2)} ${r(-hh)} L${r(w / 2)} ${r(-hh)} L${r(w * 0.44)} 0 L${r(-w * 0.44)} 0 Z" fill="${S.lg("muell", [[0, "#3f7a3a"], [0.5, "#5a9a52"], [1, "#2f5a2a"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${r(-w / 2 - 0.6)}" y="${r(-hh - 2)}" width="${r(w + 1.2)}" height="2.4" rx=".8" fill="#2f5a2a"/><rect x="${r(-w * 0.3)}" y="${r(-hh - 1.4)}" width="${r(w * 0.6)}" height="1.2" fill="#1d2a1d"/>`;
  for (let i = 0; i < 4; i++) k += `<path d="M${r(-w / 2 + 1 + i * w / 4)} ${r(-hh + 1.5)} V-1.5" stroke="#2f5a2a" stroke-width=".4"/>`;
  k += `<text x="0" y="${r(-hh * 0.5)}" font-size="${r(sc * 0.09)}" text-anchor="middle" fill="#fff" font-family="Arial">♻</text>`;
  S.teil({ id: "muelleimer", de: "der Mülleimer", syl: "MÜLL-ei-mer", it: "il cestino", itSyl: "ce-STI-no", en: "litter bin", x, y, steht: true, kunst: k });
}

/* =====================================================================
   11 — DAS MASKOTTCHEN (Bär im Kostüm, winkt), BESUCHER, KIND mit EIS
   ===================================================================== */
{
  const d = 11.6, sc = s(d), [x, y] = P(1.75, d), hh = 2.0 * sc, g = hh / 100;
  const pelz = S.rg("pelz", [[0, "#c98a4a"], [0.7, "#a8682e"], [1, "#7d4a1e"]], 0.4, 0.35, 0.75);
  let k = schatten(0, 0, 22 * g, 4 * g, 0.35);
  /* Schuhe, Beine (Latzhose), Körper im Park-Shirt */
  for (const sx of [-1, 1]) k += `<ellipse cx="${r(sx * 9 * g)}" cy="${r(-3 * g)}" rx="${r(9 * g)}" ry="${r(4.5 * g)}" fill="#c8402e"/><rect x="${r(sx * 9 * g - 6 * g)}" y="${r(-30 * g)}" width="${r(12 * g)}" height="${r(27 * g)}" rx="${r(4 * g)}" fill="#2f5f95"/>`;
  k += `<path d="M${r(-20 * g)} ${r(-28 * g)} Q${r(-23 * g)} ${r(-58 * g)} ${r(-14 * g)} ${r(-64 * g)} L${r(14 * g)} ${r(-64 * g)} Q${r(23 * g)} ${r(-58 * g)} ${r(20 * g)} ${r(-28 * g)} Z" fill="#2f86d0"/>`;
  k += `<path d="M${r(-18 * g)} ${r(-45 * g)} Q0 ${r(-52 * g)} ${r(18 * g)} ${r(-45 * g)} L${r(19 * g)} ${r(-28 * g)} L${r(-19 * g)} ${r(-28 * g)} Z" fill="#2f5f95"/>`;
  k += `<circle cx="0" cy="${r(-55 * g)}" r="${r(6 * g)}" fill="#ffe066"/><text x="0" y="${r(-52.6 * g)}" font-size="${r(7 * g)}" text-anchor="middle" fill="#2f5f95" font-family="Arial Black,Arial" font-weight="900">A</text>`;
  /* Arme mit weißen Handschuhen, rechter Arm winkt */
  k += `<path d="M${r(-15 * g)} ${r(-60 * g)} Q${r(-27 * g)} ${r(-50 * g)} ${r(-25 * g)} ${r(-36 * g)}" stroke="${pelz}" stroke-width="${r(9 * g)}" fill="none" stroke-linecap="round"/><circle cx="${r(-25 * g)}" cy="${r(-33 * g)}" r="${r(6 * g)}" fill="#ffffff" stroke="#cfd6db" stroke-width=".3"/>`;
  k += `<path d="M${r(15 * g)} ${r(-60 * g)} Q${r(28 * g)} ${r(-66 * g)} ${r(30 * g)} ${r(-84 * g)}" stroke="${pelz}" stroke-width="${r(9 * g)}" fill="none" stroke-linecap="round"/><ellipse cx="${r(31 * g)}" cy="${r(-89 * g)}" rx="${r(6 * g)}" ry="${r(7 * g)}" fill="#ffffff" stroke="#cfd6db" stroke-width=".3"/>`;
  for (const a of [-0.5, 0, 0.5]) k += `<path d="M${r(31 * g + Math.sin(a) * 4 * g)} ${r(-95 * g)} l${r(Math.sin(a) * 3 * g)} ${r(-3 * g)}" stroke="#ffffff" stroke-width="${r(3 * g)}" stroke-linecap="round"/>`;
  /* großer Bärenkopf */
  k += `<circle cx="${r(-14 * g)}" cy="${r(-96 * g)}" r="${r(7 * g)}" fill="${pelz}"/><circle cx="${r(14 * g)}" cy="${r(-96 * g)}" r="${r(7 * g)}" fill="${pelz}"/><circle cx="${r(-14 * g)}" cy="${r(-96 * g)}" r="${r(3.5 * g)}" fill="#f1c79a"/><circle cx="${r(14 * g)}" cy="${r(-96 * g)}" r="${r(3.5 * g)}" fill="#f1c79a"/>`;
  k += `<circle cx="0" cy="${r(-80 * g)}" r="${r(19 * g)}" fill="${pelz}"/>`;
  k += `<ellipse cx="0" cy="${r(-73 * g)}" rx="${r(10 * g)}" ry="${r(7.5 * g)}" fill="#f1d3a8"/><ellipse cx="0" cy="${r(-77 * g)}" rx="${r(3.6 * g)}" ry="${r(2.6 * g)}" fill="#3a2414"/>`;
  k += `<path d="M${r(-5 * g)} ${r(-71 * g)} Q0 ${r(-66 * g)} ${r(5 * g)} ${r(-71 * g)}" stroke="#3a2414" stroke-width="${r(1.2 * g)}" fill="none" stroke-linecap="round"/>`;
  for (const sx of [-1, 1]) k += `<circle cx="${r(sx * 7 * g)}" cy="${r(-85 * g)}" r="${r(3.2 * g)}" fill="#ffffff"/><circle cx="${r(sx * 7 * g + 0.6 * g)}" cy="${r(-84.6 * g)}" r="${r(1.8 * g)}" fill="#1d1f22"/><circle cx="${r(sx * 7 * g + 1.2 * g)}" cy="${r(-85.4 * g)}" r="${r(0.6 * g)}" fill="#fff"/>`;
  k += `<path d="M${r(-9 * g)} ${r(-94 * g)} Q${r(-3 * g)} ${r(-99 * g)} ${r(4 * g)} ${r(-96 * g)}" stroke="#fff" stroke-width="${r(1.5 * g)}" opacity=".25" fill="none"/>`;
  S.teil({ id: "maskottchen", de: "das Maskottchen", syl: "Mas-KOTT-chen", it: "la mascotte", itSyl: "ma-SCOT-te", en: "mascot", x, y, kunst: k,
    tipp: "Im Bärenkostüm steckt ein Mensch. Das Maskottchen winkt den Kindern zu." });
}
const hand = (m) => { const h = [m.z.handL, m.z.handR].filter(Boolean).sort((a, b) => (a.y != null ? a.y : a[1]) - (b.y != null ? b.y : b[1]))[0]; return [(h.x != null ? h.x : h[0]) * m.k, (h.y != null ? h.y : h[1]) * m.k]; };
let EIS = null;
{
  const d = 9.5, sc = s(d), [x, y] = P(-0.7, d);
  const m = mensch({ id: "b14e_bes", geschlecht: "m", pose: "gehen", blick: 30, frisur: "kurz", haarfarbe: "braun", haut: "oliv",
    kleidung: { oberteil: { stueck: "tshirt", farbe: "#38a0a0" }, unterteil: { stueck: "shorts", farbe: "beige" }, schuhe: { stueck: "turnschuh" }, zubehoer: { stueck: "rucksack", farbe: "#e2662f" }, kopf: { stueck: "kappe", farbe: "#2f5f95" } } }, 1.8 * sc);
  S.teil({ id: "besucher_fp", de: "der Besucher", syl: "Be-SU-cher", it: "il visitatore", itSyl: "vi-si-ta-TO-re", en: "visitor", x, y, kunst: schatten(0, 0, 7, 1.4, 0.35) + m.svg });
}
{
  const d = 9.0, sc = s(d), [x, y] = P(0.55, d);
  const m = mensch({ id: "b14e_kind", alter: "kind", geschlecht: "w", pose: "halten", blick: 40, frisur: "zopf", haarfarbe: "blond", haut: "hell", laecheln: true,
    kleidung: { kleid: { stueck: "sommerkleid", farbe: "#ff8ad8" }, schuhe: { stueck: "sandale" } } }, 1.25 * sc);
  const [hx, hy] = hand(m);
  EIS = [x + hx, y + hy, sc];
  S.teil({ id: "kind_fp", de: "das Kind", syl: "KIND", it: "il bambino", itSyl: "bam-BI-no", en: "child", x, y, kunst: schatten(0, 0, 5, 1.1, 0.35) + m.svg,
    tipp: "Das Kind freut sich: Das Maskottchen winkt ihm zu!" });
}
{
  /* DAS EIS — Waffel mit zwei Kugeln in der Hand des Kindes */
  const [x, y, sc] = EIS, g = 0.05 * sc;
  let k = `<path d="M${r(-g)} ${r(-g * 0.4)} L0 ${r(g * 2)} L${r(g)} ${r(-g * 0.4)} Z" fill="#d9a35b" stroke="#a8703f" stroke-width=".2"/>`;
  k += `<circle cx="0" cy="${r(-g * 1.1)}" r="${r(g * 1.05)}" fill="#f6e2b8"/><circle cx="${r(g * 0.2)}" cy="${r(-g * 2.6)}" r="${r(g * 0.95)}" fill="#ff9ab8"/><circle cx="${r(-g * 0.2)}" cy="${r(-g * 2.9)}" r="${r(g * 0.3)}" fill="#fff" opacity=".5"/>`;
  S.teil({ oben: true, id: "eis", de: "das Eis", syl: "EIS", it: "il gelato", itSyl: "ge-LA-to", en: "ice cream", x, y: y + g * 0.6, kunst: k,
    tipp: "Erdbeer und Vanille – zwei Kugeln in der Waffel." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/freizeitpark.js"));
console.log(aus);
