#!/usr/bin/env node
/* =====================================================================
   DER JAHRMARKT (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (Planet Wissen „Kirmes bei Nacht“, Hamburger DOM, Programme
   von Kirmes und Volksfesten in Moers, Fürstenau, Pirmasens):
   - Schaustellerinnen und Schausteller reisen von Frühjahr bis Herbst mit
     Karussells, Schießbuden und Riesenrad von Fest zu Fest; der Festplatz
     ist meist ein asphaltierter Platz.
   - Am Abend leuchtet alles: Glühbirnen an Riesenrad, Karussell und
     Achterbahn, LICHTERKETTEN über den Gassen, Leuchtschriften.
   - Fahrgeschäfte: RIESENRAD, ACHTERBAHN (mit Looping), AUTOSCOOTER
     (Halle mit Stromnetz an der Decke), KINDERKARUSSELL mit Pferden.
   - Buden: LOSBUDE („Jedes Los gewinnt“, Teddy als Hauptgewinn),
     SCHIESSBUDE (Luftgewehre an Ketten, Plastikrosen, Teddys),
     SÜSSWARENSTAND mit Zuckerwatte, gebrannten Mandeln (Duft!),
     Lebkuchenherzen mit Zuckerschrift, Liebesäpfeln und Popcorn.
   - Kinder mit Luftballon, Erwachsene mit Zuckerwatte.
   Maßstab (Zentralperspektive, Blick von einer Treppe am Platzrand):
   Augenhöhe 3,5 m, Fluchtpunkt (160 | 95), Einheiten je Meter =
   240 / Abstand: vordere Buden (9,5 m) ≈ 25, Karussell ≈ 13,
   Riesenrad (80 m) ≈ 3.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "jahrmarkt", titel: "Der Jahrmarkt", emoji: "🎡", thema: "Freizeit", kuerzel: "b14d", fassung: 852 });
const rnd = zufall(1810);
const r = B.r;
const knapp = (svg) => svg.replace(/ (d|x1|y1|x2|y2|cx|cy|rx|ry)="([^"]*)"/g, (m, a, v) => ` ${a}="${v.replace(/-?\d+\.\d+/g, (n) => String(Math.round(+n)))}"`);
const mensch = (spec, h) => { const m = B.mensch(spec, h); m.svg = knapp(m.svg); return m; };

/* ---------- Perspektive ---------------------------------------------- */
const VX = 160, YH = 95, H = 3.5, F = 240;
const s = (d) => F / d;
const X = (xm, d) => VX + xm * F / d;
const Y = (d, h = 0) => YH + (H - h) * F / d;
const P = (xm, d, h = 0) => [X(xm, d), Y(d, h)];
const pt = (xm, d, h = 0) => `${r(X(xm, d))} ${r(Y(d, h))}`;
const poly = (pp) => "M" + pp.map(([a, b]) => `${r(a)} ${r(b)}`).join(" L") + " Z";
const abs = (ax, ay, k) => `<g transform="translate(${r(-ax)} ${r(-ay)})">${k}</g>`;

/* ---------- Licht ----------------------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const GLOW = S.rg("glow", [[0, "#fff6c8", 0.9], [0.35, "#ffd36b", 0.35], [1, "#ffb347", 0]]);
const BUNT = ["#ffe066", "#ff6b6b", "#7fd3ff", "#9dff8a", "#ffb0e0", "#ffffff"];
/* Glühbirne: farbiger Punkt mit Lichthof */
const birne = (x, y, rr, f = "#ffe066", hof = 2.6) => `<circle cx="${r(x)}" cy="${r(y)}" r="${r(rr * hof)}" fill="${GLOW}"/><circle cx="${r(x)}" cy="${r(y)}" r="${r(rr)}" fill="${f}"/>`;
const STAHL = S.lg("stahl", [[0, "#dfe4e8"], [0.5, "#aab3ba"], [1, "#d0d6da"]], 0, 0, 1, 0);

/* =====================================================================
   KULISSE — Abendhimmel, Bäume am Horizont, Asphalt des Festplatzes
   ===================================================================== */
{
  let k = `<rect x="0" y="0" width="320" height="${YH + 12}" fill="${S.lg("himmel", [[0, "#141a46"], [0.45, "#3a2f6e"], [0.75, "#a3507a"], [1, "#f29a5c"]])}"/>`;
  for (let i = 0; i < 40; i++) k += `<circle cx="${r(rnd() * 320)}" cy="${r(rnd() * 45)}" r="${r(0.2 + rnd() * 0.35)}" fill="#fff" opacity="${r(0.4 + rnd() * 0.5)}"/>`;
  k += `<circle cx="292" cy="20" r="5.5" fill="#fff8de"/><circle cx="294" cy="19" r="5" fill="#f9eecf" opacity=".5"/>`;
  /* Baumreihe und Dächer der Stadt am Horizont */
  let b = `M0 ${YH + 10}`;
  for (let x = 0; x <= 320; x += 6) b += ` Q${x + 3} ${r(YH + 2 - rnd() * 7)} ${x + 6} ${r(YH + 6 - rnd() * 3)}`;
  b += ` L320 ${YH + 12} L0 ${YH + 12} Z`;
  k += `<path d="${b}" fill="#1d1f3a"/>`;
  k += `<path d="M18 ${YH + 6} v-14 l5 -5 l5 5 v14 Z M250 ${YH + 6} v-10 h12 v10 Z" fill="#20223f"/>`;
  /* Asphalt */
  k += `<rect x="0" y="${YH + 9}" width="320" height="${200 - YH - 9}" fill="${S.lg("asphalt", [[0, "#3a3550"], [0.4, "#3c3a4a"], [1, "#2b2a33"]])}"/>`;
  for (let i = 0; i < 160; i++) { const y = YH + 10 + Math.pow(rnd(), 0.6) * (200 - YH - 10); k += `<circle cx="${r(rnd() * 320)}" cy="${r(y)}" r="${r(0.15 + (y - YH) / 160)}" fill="${rnd() < 0.5 ? "#4a4658" : "#26252d"}" opacity=".6"/>`; }
  /* Kabelbrücke quer über den Platz */
  k += `<path d="${poly([P(-12, 14.5), P(12, 14.5), P(12, 14.1), P(-12, 14.1)])}" fill="#d9b200" opacity=".85"/>`;
  k += `<path d="M0 ${r(Y(14.3))} H320" stroke="#2b2b2b" stroke-width=".3" stroke-dasharray="3 3"/>`;
  /* Lichtschein der Buden auf dem Asphalt */
  for (const [x, y, rx, f] of [[40, 186, 60, "#ffcf6b"], [282, 186, 60, "#ff9a6b"], [100, 140, 50, "#9fd0ff"], [217, 152, 55, "#ffd36b"], [160, 125, 20, "#ffd36b"]]) k += `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${r(rx * 0.25)}" fill="${f}" opacity=".18" filter="url(#bw_weich)"/>`;
  S.hinten(k);
}

/* =====================================================================
   1 — DAS RIESENRAD (hinten links)
   ===================================================================== */
{
  const d = 80, sc = s(d), [x, yb] = P(-14, d), R = 15 * sc, hy = Y(d, 17), hx = x;
  let k = "";
  /* Stützen (A-Böcke) */
  k += `<path d="M${r(hx - 0.3 * R)} ${r(yb)} L${r(hx)} ${r(hy)} L${r(hx + 0.3 * R)} ${r(yb)} M${r(hx - 0.2 * R)} ${r(yb)} L${r(hx)} ${r(hy)} L${r(hx + 0.2 * R)} ${r(yb)}" stroke="#c9ced6" stroke-width=".9" fill="none"/>`;
  k += `<path d="M${r(hx - 0.25 * R)} ${r(yb - 0.25 * (yb - hy))} H${r(hx + 0.25 * R)}" stroke="#aab3ba" stroke-width=".5"/>`;
  /* Felgen, Speichen, Lichter */
  k += `<circle cx="${r(hx)}" cy="${r(hy)}" r="${r(R)}" fill="none" stroke="#e6e9ee" stroke-width="1"/><circle cx="${r(hx + 0.6)}" cy="${r(hy)}" r="${r(R * 0.97)}" fill="none" stroke="#9aa3ad" stroke-width=".5"/>`;
  k += `<circle cx="${r(hx)}" cy="${r(hy)}" r="${r(R * 0.55)}" fill="none" stroke="#c9ced6" stroke-width=".4"/>`;
  const n = 16;
  let sp = "";
  for (let i = 0; i < n; i++) { const a = i * 2 * Math.PI / n; sp += `M${r(hx)} ${r(hy)} L${r(hx + Math.cos(a) * R)} ${r(hy + Math.sin(a) * R)}`; }
  k += `<path d="${sp}" stroke="#d7dbe2" stroke-width=".35"/>`;
  for (let i = 0; i < n * 2; i++) { const a = i * Math.PI / n; k += birne(hx + Math.cos(a) * R, hy + Math.sin(a) * R, 0.45, BUNT[i % 3]); }
  for (let i = 0; i < n; i++) { const a = (i + 0.5) * 2 * Math.PI / n; for (const t of [0.35, 0.7]) k += `<circle cx="${r(hx + Math.cos(a) * R * t)}" cy="${r(hy + Math.sin(a) * R * t)}" r=".35" fill="${BUNT[(i + 3) % 6]}"/>`; }
  /* Gondeln hängen unter der Felge */
  const gf = ["#e8453c", "#2f86d0", "#f2c230", "#38c172"];
  for (let i = 0; i < n; i++) {
    const a = i * 2 * Math.PI / n, gx = hx + Math.cos(a) * R, gy = hy + Math.sin(a) * R;
    k += `<path d="M${r(gx)} ${r(gy)} V${r(gy + 1.6)}" stroke="#555" stroke-width=".3"/><path d="M${r(gx - 2.2)} ${r(gy + 1.6)} h4.4 l-.4 3.4 q-1.8 1 -3.6 0 Z" fill="${gf[i % 4]}"/><rect x="${r(gx - 1.6)}" y="${r(gy + 2.2)}" width="3.2" height="1.2" fill="#ffe9a8" opacity=".85"/>`;
  }
  k += `<circle cx="${r(hx)}" cy="${r(hy)}" r="2.2" fill="#e6e9ee"/>` + birne(hx, hy, 1, "#fff");
  /* Kassenhäuschen am Fuß mit Schrift */
  k += `<rect x="${r(hx - 12)}" y="${r(yb - 5)}" width="24" height="5" fill="#7a2a4a"/><text x="${r(hx)}" y="${r(yb - 1.4)}" font-size="3.2" text-anchor="middle" fill="#ffe066" font-family="Arial Black,Arial" font-weight="900">RIESENRAD</text>`;
  S.teil({ id: "riesenrad", de: "das Riesenrad", syl: "RIE-sen-rad", it: "la ruota panoramica", itSyl: "RUO-ta pa-no-RA-mi-ca", en: "ferris wheel", x: hx, y: yb, steht: true, kunst: abs(hx, yb, k),
    tipp: "Ganz oben im Riesenrad sieht man den ganzen Jahrmarkt." });
}

/* =====================================================================
   2 — DIE ACHTERBAHN (hinten rechts, mit Looping)
   ===================================================================== */
{
  const d = 60, sc = s(d), yb = Y(d);
  const xs = (xm) => X(xm, d), ys = (h) => Y(d, h);
  let k = "";
  /* Strecke: Lifthügel, Abfahrt, Looping, Hügel */
  const bahn = `M${r(xs(11))} ${r(ys(1))} L${r(xs(17))} ${r(ys(19))} Q${r(xs(18))} ${r(ys(20.5))} ${r(xs(19))} ${r(ys(18))} Q${r(xs(21))} ${r(ys(1))} ${r(xs(24))} ${r(ys(1.5))} ` +
    `C${r(xs(29))} ${r(ys(2))} ${r(xs(30))} ${r(ys(14))} ${r(xs(27))} ${r(ys(14))} C${r(xs(24))} ${r(ys(14))} ${r(xs(25))} ${r(ys(2.5))} ${r(xs(30))} ${r(ys(2.5))} Q${r(xs(33))} ${r(ys(9))} ${r(xs(36))} ${r(ys(3))} L${r(xs(39))} ${r(ys(3))}`;
  /* Stützen (Gitterpfeiler) */
  let st = "";
  for (const [xm, h] of [[12.5, 5.5], [14, 10], [15.5, 14.6], [17, 19], [18.6, 19], [20.2, 9], [21.8, 2], [26.5, 2.2], [31.5, 6.5], [33, 7.5], [34.6, 5]]) {
    st += `M${r(xs(xm))} ${r(yb)} V${r(ys(h))}`;
    for (let hh = 1.5; hh < h; hh += 2) st += `M${r(xs(xm) - 0.8)} ${r(ys(hh))} L${r(xs(xm) + 0.8)} ${r(ys(hh + 1.4))}`;
  }
  k += `<path d="${st}" stroke="#8d95a8" stroke-width=".55"/>`;
  k += `<path d="${bahn}" stroke="#d9dee8" stroke-width="1.6" fill="none"/><path d="${bahn}" stroke="#e8453c" stroke-width=".7" fill="none"/>`;
  /* Lichter an der Strecke */
  const probe = [[11, 1], [12.5, 5.5], [14, 10], [15.5, 14.6], [17, 19], [18.5, 19.3], [19.5, 14], [20.3, 8], [21.5, 2.2], [24, 1.5], [27, 3.5], [28.6, 9], [27, 14], [25.4, 9], [27, 2.6], [30, 2.5], [32, 7], [34, 6.6], [36, 3]];
  probe.forEach(([xm, h], i) => { k += birne(xs(xm), ys(h) - 0.8, 0.4, BUNT[i % 6], 2.2); });
  /* Zug auf dem Lifthügel */
  for (let i = 0; i < 3; i++) { const t = 0.55 + i * 0.09, xm = 11 + 6 * t, h = 1 + 18 * t; k += `<rect x="${r(xs(xm) - 1.6)}" y="${r(ys(h) - 2.6)}" width="3.2" height="2" rx=".5" fill="#f2c230" transform="rotate(-38 ${r(xs(xm))} ${r(ys(h))})"/>`; }
  /* Schild */
  k += `<rect x="${r(xs(23) - 14)}" y="${r(yb - 6)}" width="28" height="5.5" rx="1" fill="#1f2a6a"/><text x="${r(xs(23))}" y="${r(yb - 2)}" font-size="3.4" text-anchor="middle" fill="#ff8ad8" font-family="Arial Black,Arial" font-weight="900">LOOPING</text>`;
  const ax = xs(24);
  S.teil({ id: "achterbahn", de: "die Achterbahn", syl: "ACH-ter-bahn", it: "le montagne russe", itSyl: "mon-TA-gne RUS-se", en: "roller coaster", x: ax, y: yb, steht: true, kunst: abs(ax, yb, k),
    tipp: "Der erste Hügel ist immer der höchste – danach reicht die Kraft nur noch für kleinere." });
}

/* =====================================================================
   3 — DIE LOSBUDE (hinten in der Mitte) — Lupe: Los, Hauptgewinn
   ===================================================================== */
{
  const d = 30, sc = s(d), x0 = -1.7, x1 = 1.7;
  const [ax, yb] = P(0, d), xa = X(x0, d), xe = X(x1, d), yD = Y(d, 2.5), yT = Y(d, 1.0);
  let k = `<rect x="${r(xa)}" y="${r(yD)}" width="${r(xe - xa)}" height="${r(yb - yD)}" fill="#3a1f4a"/>`;
  /* Rückwand voller Gewinne (Plüschtiere) */
  for (let i = 0; i < 12; i++) { const x = xa + 2 + (i % 6) * (xe - xa - 4) / 5, y = yD + 4 + Math.floor(i / 6) * 4.5; k += `<circle cx="${r(x)}" cy="${r(y)}" r="1.7" fill="${["#c98a4a", "#ff8ad8", "#7fd3ff", "#f2c230", "#9dff8a", "#ffffff"][i % 6]}"/>`; }
  /* großer Teddy als Hauptgewinn */
  const tx = xa + (xe - xa) * 0.78, ty = yT - 1;
  k += `<ellipse cx="${r(tx)}" cy="${r(ty - 4)}" rx="3.3" ry="4" fill="#b9773a"/><circle cx="${r(tx)}" cy="${r(ty - 9.4)}" r="2.6" fill="#c98a4a"/><circle cx="${r(tx - 2)}" cy="${r(ty - 11.4)}" r="1" fill="#b9773a"/><circle cx="${r(tx + 2)}" cy="${r(ty - 11.4)}" r="1" fill="#b9773a"/><ellipse cx="${r(tx)}" cy="${r(ty - 8.7)}" rx="1.1" ry=".8" fill="#f1d3a8"/><path d="M${r(tx - 1.6)} ${r(ty - 6.2)} q1.6 1 3.2 0" stroke="#d23a33" stroke-width=".8" fill="none"/>`;
  /* Theke mit Loseimer */
  k += `<rect x="${r(xa)}" y="${r(yT)}" width="${r(xe - xa)}" height="${r(yb - yT)}" fill="${S.lg("losth", [[0, "#e8453c"], [1, "#a8261e"]])}"/>`;
  k += `<rect x="${r(xa)}" y="${r(yT)}" width="${r(xe - xa)}" height="1" fill="#ffd36b"/>`;
  const ex = xa + (xe - xa) * 0.3;
  k += `<path d="M${r(ex - 3)} ${r(yT)} L${r(ex - 2.4)} ${r(yT - 4)} L${r(ex + 2.4)} ${r(yT - 4)} L${r(ex + 3)} ${r(yT)} Z" fill="#f2c230"/>`;
  for (let i = 0; i < 9; i++) k += `<rect x="${r(ex - 2.2 + rnd() * 4)}" y="${r(yT - 5 + rnd() * 1.2)}" width="1" height=".6" fill="${BUNT[i % 6]}" transform="rotate(${Math.round(rnd() * 60 - 30)} ${r(ex)} ${r(yT - 4.5)})"/>`;
  /* Dach mit Leuchtschrift */
  k += `<path d="M${r(xa - 2)} ${r(yD)} L${r(xe + 2)} ${r(yD)} L${r(xe)} ${r(yD - 4)} L${r(xa)} ${r(yD - 4)} Z" fill="#2a1438"/>`;
  k += `<text x="${r(ax)}" y="${r(yD - 1)}" font-size="3" text-anchor="middle" fill="#ffe066" font-family="Arial Black,Arial" font-weight="900">LOSE</text>`;
  for (let i = 0; i <= 8; i++) k += birne(xa - 1.5 + i * (xe - xa + 3) / 8, yD + 0.3, 0.35, BUNT[i % 6], 2);
  k += `<text x="${r(ax)}" y="${r(yT + 3.4)}" font-size="1.8" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">Jedes Los gewinnt!</text>`;
  const unter = [
    { id: "los", de: "das Los", syl: "LOS", it: "il biglietto della lotteria", itSyl: "bi-GLIET-to del-la lot-te-RI-a", en: "raffle ticket", x: ex, y: yT, kunst: flaeche(-3.6, -6, 7.2, 6.4),
      tipp: "Man zieht ein Los aus dem Eimer und öffnet es: Niete oder Gewinn?" },
    { id: "hauptgewinn", de: "der Hauptgewinn", syl: "HAUPT-ge-winn", it: "il primo premio", itSyl: "PRI-mo PRE-mio", en: "top prize", x: tx, y: ty, kunst: flaeche(-3.8, -12.6, 7.6, 12.6) },
  ];
  S.teil({ id: "losbude", de: "die Losbude", syl: "LOS-bu-de", it: "la bancarella della lotteria", itSyl: "ban-ca-REL-la del-la lot-te-RI-a", en: "raffle stall", x: ax, y: yb, steht: true, kunst: abs(ax, yb, k),
    zoom: { x: r(xa - 4), y: r(yD - 5), w: r(xe - xa + 8), h: r((xe - xa + 8) / 1.5) }, unter });
}

/* =====================================================================
   4 — DER AUTOSCOOTER (links in der Mitte)
   ===================================================================== */
{
  const d0 = 20.5, d1 = 27, x0 = -8.6, x1 = -2.2, hD = 3.8;
  let k = "";
  /* Fahrfläche (Stahlplatten) */
  k += `<path d="${poly([P(x0, d0, 0.25), P(x1, d0, 0.25), P(x1, d1, 0.25), P(x0, d1, 0.25)])}" fill="#4d5262"/>`;
  k += `<path d="${poly([P(x0, d0, 0), P(x1, d0, 0), P(x1, d0, 0.25), P(x0, d0, 0.25)])}" fill="#2b2e38"/>`;
  /* Rückwand mit Bildern */
  k += `<path d="${poly([P(x0, d1, 0.25), P(x1, d1, 0.25), P(x1, d1, hD), P(x0, d1, hD)])}" fill="${S.lg("asw", [[0, "#2a2d6e"], [1, "#4a2a6e"]])}"/>`;
  for (let i = 0; i < 5; i++) { const [cx, cy] = P(x0 + 0.7 + i * 1.25, d1, 2.2); k += `<circle cx="${r(cx)}" cy="${r(cy)}" r="2.6" fill="${BUNT[i]}" opacity=".55"/><path d="M${r(cx - 2)} ${r(cy + 1)} l2 -3 l2 3" stroke="#fff" stroke-width=".4" fill="none" opacity=".6"/>`; }
  /* Netz an der Decke (Gitter) */
  k += `<path d="${poly([P(x0, d0, hD - 0.1), P(x1, d0, hD - 0.1), P(x1, d1, hD - 0.1), P(x0, d1, hD - 0.1)])}" fill="#1a1c2a"/>`;
  /* Autos: Stange zum Deckennetz, bunte Wagen */
  const autos = [[-7.6, 25.2, "#e8453c"], [-4.4, 25.6, "#2f86d0"], [-6.1, 23.2, "#f2c230"], [-3.4, 22.6, "#38c172"], [-7.4, 21.6, "#ff8ad8"]];
  autos.sort((a, b) => b[1] - a[1]).forEach(([xm, dd, f]) => {
    const sc = s(dd), [ax, ay] = P(xm, dd, 0.25), w = 1.1 * sc, hh = 0.55 * sc;
    k += `<path d="M${r(ax + w * 0.3)} ${r(ay - hh)} L${r(X(xm + 0.3, dd))} ${r(Y(dd, hD - 0.1))}" stroke="#c9ced6" stroke-width=".4"/>`;
    k += birne(X(xm + 0.3, dd), Y(dd, hD - 0.1), 0.35, "#bfe8ff", 3);
    k += `<path d="M${r(ax - w / 2)} ${r(ay)} L${r(ax - w / 2)} ${r(ay - hh * 0.55)} Q${r(ax - w * 0.4)} ${r(ay - hh)} ${r(ax - w * 0.1)} ${r(ay - hh)} L${r(ax + w * 0.35)} ${r(ay - hh * 0.9)} L${r(ax + w / 2)} ${r(ay - hh * 0.45)} L${r(ax + w / 2)} ${r(ay)} Z" fill="${f}"/>`;
    k += `<rect x="${r(ax - w / 2 - 0.4)}" y="${r(ay - hh * 0.3)}" width="${r(w + 0.8)}" height="${r(hh * 0.3)}" rx=".5" fill="#2b2b2b"/>`;
    k += `<circle cx="${r(ax - w * 0.05)}" cy="${r(ay - hh * 0.8)}" r="${r(hh * 0.14)}" fill="#1d1f22"/>`;
  });
  /* Stützen vorne und Dachkante mit Leuchtschrift */
  for (const xm of [x0, (x0 + x1) / 2, x1]) k += `<path d="M${pt(xm, d0, 0.25)} L${pt(xm, d0, hD)}" stroke="${STAHL}" stroke-width="1"/>`;
  k += `<path d="${poly([P(x0 - 0.2, d0, hD), P(x1 + 0.2, d0, hD), P(x1 + 0.2, d0, hD + 1.1), P(x0 - 0.2, d0, hD + 1.1)])}" fill="${S.lg("asdach", [[0, "#1f2a6a"], [1, "#141a46"]])}"/>`;
  const [tx, ty] = P((x0 + x1) / 2, d0, hD + 0.3);
  k += `<text x="${r(tx)}" y="${r(ty)}" font-size="7.5" text-anchor="middle" fill="#7fd3ff" font-family="Arial Black,Arial" font-weight="900" letter-spacing=".3">AUTOSCOOTER</text>`;
  for (let i = 0; i <= 18; i++) { const [bx, by] = P(x0 - 0.2 + i * (x1 - x0 + 0.4) / 18, d0, hD + 1.1); k += birne(bx, by, 0.45, BUNT[i % 6], 2.2); }
  for (let i = 0; i <= 18; i++) { const [bx, by] = P(x0 - 0.2 + i * (x1 - x0 + 0.4) / 18, d0, hD); k += birne(bx, by, 0.35, i % 2 ? "#ffe066" : "#ff6b6b", 2); }
  const [ax, ay] = P((x0 + x1) / 2, d0);
  S.teil({ id: "autoscooter", de: "der Autoscooter", syl: "AU-to-scoo-ter", it: "l'autoscontro", itSyl: "au-to-SCON-tro", en: "bumper cars", x: ax, y: ay, steht: true, kunst: abs(ax, ay, k),
    tipp: "Die Autos bekommen den Strom über die Stange vom Netz an der Decke." });
}

/* =====================================================================
   5 — DAS KARUSSELL (Kinderkarussell mit Pferden, rechts)
   ===================================================================== */
{
  const dc = 19, xmc = 4.4, R = 3.0, [cx, cy] = P(xmc, dc), sc = s(dc);
  const rx = R * sc, ryB = (Y(dc - R) - Y(dc + R)) / 2, yc = (Y(dc - R) + Y(dc + R)) / 2;
  const hP = 0.45, hD = 3.4;
  const ydach = (h) => yc - h * sc;
  let k = schatten(cx, yc + ryB * 0.6, rx + 3, ryB + 1, 0.35);
  /* Plattform */
  k += `<ellipse cx="${r(cx)}" cy="${r(yc)}" rx="${r(rx)}" ry="${r(ryB)}" fill="#6b2a3a"/>`;
  k += `<path d="M${r(cx - rx)} ${r(yc)} A${r(rx)} ${r(ryB)} 0 0 0 ${r(cx + rx)} ${r(yc)} L${r(cx + rx)} ${r(yc - hP * sc)} A${r(rx)} ${r(ryB)} 0 0 1 ${r(cx - rx)} ${r(yc - hP * sc)} Z" fill="${S.lg("plattf", [[0, "#c9a227"], [1, "#8a6a14"]])}"/>`;
  k += `<ellipse cx="${r(cx)}" cy="${r(yc - hP * sc)}" rx="${r(rx)}" ry="${r(ryB)}" fill="${S.rg("boden2", [[0, "#e8d6a0"], [1, "#b89a58"]])}"/>`;
  /* Mittelsäule mit Spiegeln */
  k += `<rect x="${r(cx - 0.55 * sc)}" y="${r(ydach(hD))}" width="${r(1.1 * sc)}" height="${r((hD - hP) * sc)}" fill="${S.lg("saeule", [[0, "#7a2a4a"], [0.5, "#c94a7a"], [1, "#7a2a4a"]], 0, 0, 1, 0)}"/>`;
  for (let i = 0; i < 3; i++) k += `<rect x="${r(cx - 0.4 * sc + i * 0.3 * sc)}" y="${r(ydach(2.6))}" width="${r(0.2 * sc)}" height="${r(1.2 * sc)}" fill="#cfe9f5" opacity=".75"/>`;
  /* Pferde und Stangen: hinten zuerst (oberer Halbkreis), vorne zuletzt */
  const n = 10, pferde = [];
  for (let i = 0; i < n; i++) { const a = i * 2 * Math.PI / n + 0.2; pferde.push({ a, x: cx + Math.cos(a) * rx * 0.78, y: yc - hP * sc + Math.sin(a) * ryB * 0.78, vorn: Math.sin(a) }); }
  pferde.sort((p, q) => p.vorn - q.vorn);
  const pferd = (x, y, hoch, f, gr) => {
    const g = gr * sc * 0.55, yy = y - hoch * sc;
    return `<path d="M${r(x)} ${r(ydach(hD - 0.2) + (yc - ydach(0)) * 0)} V${r(y)}" stroke="#e6c35a" stroke-width=".5"/>` +
      `<path d="M${r(x - g)} ${r(yy)} Q${r(x - g)} ${r(yy - g * 0.5)} ${r(x - g * 0.3)} ${r(yy - g * 0.5)} L${r(x + g * 0.4)} ${r(yy - g * 0.55)} L${r(x + g * 0.7)} ${r(yy - g * 1.15)} L${r(x + g * 1.05)} ${r(yy - g * 1.0)} L${r(x + g * 0.85)} ${r(yy - g * 0.35)} Q${r(x + g * 0.7)} ${r(yy)} ${r(x + g * 0.4)} ${r(yy + 0.2)} L${r(x + g * 0.45)} ${r(yy + g * 0.6)} M${r(x - g * 0.8)} ${r(yy + 0.2)} L${r(x - g * 0.95)} ${r(yy + g * 0.6)} Z" fill="${f}" stroke="#5a3a2a" stroke-width=".2"/>` +
      `<path d="M${r(x - g * 0.3)} ${r(yy - g * 0.5)} q${r(g * 0.3)} ${r(-g * 0.2)} ${r(g * 0.6)} 0" stroke="#d23a33" stroke-width=".6" fill="none"/>`;
  };
  pferde.forEach((p, i) => { if (p.vorn < 0) k += pferd(p.x, p.y, 0.6 + 0.25 * Math.sin(i * 1.7), ["#ffffff", "#f4e2c4", "#dcb98a"][i % 3], 1.3); });
  /* vordere Pferde */
  pferde.forEach((p, i) => { if (p.vorn >= 0) k += pferd(p.x, p.y, 0.6 + 0.25 * Math.sin(i * 1.7), ["#ffffff", "#f4e2c4", "#dcb98a"][i % 3], 1.3); });
  /* Dach: Kegel und gezackte Blende mit Glühbirnen */
  const yd = ydach(hD), yS = ydach(hD + 1.6);
  k += `<path d="M${r(cx - rx - 2)} ${r(yd)} L${r(cx)} ${r(yS)} L${r(cx + rx + 2)} ${r(yd)} Z" fill="${S.lg("dach", [[0, "#ffd36b"], [0.5, "#e8453c"], [1, "#a8261e"]], 0, 0, 1, 0)}"/>`;
  for (let i = 1; i < 8; i += 2) k += `<path d="M${r(cx)} ${r(yS)} L${r(cx - rx - 2 + i * (2 * rx + 4) / 8)} ${r(yd)} L${r(cx - rx - 2 + (i + 1) * (2 * rx + 4) / 8)} ${r(yd)} Z" fill="#fff4dc" opacity=".85"/>`;
  let za = `M${r(cx - rx - 2)} ${r(yd)}`;
  for (let i = 0; i < 12; i++) { const xa = cx - rx - 2 + i * (2 * rx + 4) / 12; za += ` L${r(xa + (2 * rx + 4) / 24)} ${r(yd + 3)} L${r(xa + (2 * rx + 4) / 12)} ${r(yd)}`; }
  k += `<path d="${za} L${r(cx + rx + 2)} ${r(yd - 2)} L${r(cx - rx - 2)} ${r(yd - 2)} Z" fill="#2f86d0"/>`;
  for (let i = 0; i <= 12; i++) k += birne(cx - rx - 2 + i * (2 * rx + 4) / 12, yd - 1, 0.45, BUNT[i % 6], 2.2);
  k += `<circle cx="${r(cx)}" cy="${r(yS - 1.6)}" r="1.4" fill="#ffd36b"/><path d="M${r(cx)} ${r(yS - 3)} v-3 l3 1 l-3 1" fill="#e8453c" stroke="#c9a227" stroke-width=".3"/>`;
  S.teil({ id: "karussell", de: "das Karussell", syl: "Ka-rus-SELL", it: "la giostra", itSyl: "GIO-stra", en: "carousel", x: cx, y: r(yc + ryB), steht: true, kunst: abs(cx, yc + ryB, k),
    tipp: "Auf dem Kinderkarussell reiten die Kleinen auf Pferden im Kreis." });
}

/* =====================================================================
   6 — DIE LICHTERKETTE über dem Platz (zwischen zwei Masten)
   ===================================================================== */
{
  let k = "";
  const masten = [[-4.6, 12.5], [4.7, 12.5]];
  for (const [xm, d] of masten) k += `<path d="M${pt(xm, d)} L${pt(xm, d, 5.6)}" stroke="#4a4f5a" stroke-width="1"/>`;
  const ketten = [[[-4.6, 12.5, 5.5], [4.7, 12.5, 5.5], 1.3], [[-4.6, 12.5, 5.3], [-1, 30, 3.4], 1], [[4.7, 12.5, 5.3], [1.5, 30, 3.4], 1]];
  ketten.forEach(([a, b, sag], j) => {
    const pa = P(a[0], a[1], a[2]), pb = P(b[0], b[1], b[2]);
    const mx = (pa[0] + pb[0]) / 2, my = (pa[1] + pb[1]) / 2 + sag * 6;
    k += `<path d="M${r(pa[0])} ${r(pa[1])} Q${r(mx)} ${r(my)} ${r(pb[0])} ${r(pb[1])}" stroke="#2b2b2b" stroke-width=".3" fill="none"/>`;
    const nn = j ? 12 : 22;
    for (let i = 1; i < nn; i++) { const t = i / nn, x = (1 - t) * (1 - t) * pa[0] + 2 * t * (1 - t) * mx + t * t * pb[0], y = (1 - t) * (1 - t) * pa[1] + 2 * t * (1 - t) * my + t * t * pb[1]; k += birne(x, y + 0.6, j ? 0.4 : 0.6, BUNT[(i + j) % 6], 2.4); }
  });
  const [ax, ay] = P(0, 12.5, 5.5);
  S.teil({ id: "lichterkette", de: "die Lichterkette", syl: "LICH-ter-ket-te", it: "la catena di luci", itSyl: "ca-TE-na di LU-ci", en: "string lights", x: ax, y: ay, kunst: abs(ax, ay, k) });
}

/* =====================================================================
   7 — DER SÜSSWARENSTAND (vorne links) — Lupe: Popcorn, gebrannte
       Mandeln, Lebkuchenherz, Liebesapfel
   ===================================================================== */
{
  const d = 9.4, sc = s(d), x0 = -6.6, x1 = -3.4;
  const xa = Math.max(0, X(x0, d)), xe = X(x1, d), yb = Y(d), yT = Y(d, 1.0), yD = Y(d, 2.7), yS = Y(d, 3.3);
  let k = schatten((xa + xe) / 2, yb, (xe - xa) / 2, 2, 0.4);
  /* Innenraum warm beleuchtet */
  k += `<rect x="${r(xa)}" y="${r(yD)}" width="${r(xe - xa)}" height="${r(yT - yD)}" fill="${S.lg("innen", [[0, "#fff1c8"], [1, "#e9b86a"]])}"/>`;
  /* Lebkuchenherzen an der Rückwand */
  const herz = (x, y, g, f, txt) => `<path d="M${r(x)} ${r(y + g * 0.9)} C${r(x - g * 1.4)} ${r(y)} ${r(x - g * 0.9)} ${r(y - g * 0.9)} ${r(x)} ${r(y - g * 0.3)} C${r(x + g * 0.9)} ${r(y - g * 0.9)} ${r(x + g * 1.4)} ${r(y)} ${r(x)} ${r(y + g * 0.9)} Z" fill="${f}" stroke="#fff" stroke-width=".35"/><text x="${r(x)}" y="${r(y + g * 0.15)}" font-size="${r(g * 0.42)}" text-anchor="middle" fill="#fff" font-family="'Comic Sans MS',cursive" font-weight="bold">${txt}</text><path d="M${r(x - g * 0.5)} ${r(y - g * 0.55)} Q${r(x)} ${r(y - g * 1.6)} ${r(x + g * 0.5)} ${r(y - g * 0.55)}" stroke="#d23a33" stroke-width=".25" fill="none"/>`;
  const herzen = [["Ich mag dich", "#a8462a"], ["Schatz", "#8a3a22"], ["Hallo", "#b0522e"], ["Für dich", "#9a4026"]];
  herzen.forEach(([t, f], i) => { k += herz(xa + 8 + i * (xe - xa - 14) / 3, yD + 9 + (i % 2) * 2, 4.6, f, t); });
  /* Theke */
  k += `<rect x="${r(xa)}" y="${r(yT)}" width="${r(xe - xa)}" height="${r(yb - yT)}" fill="${S.lg("theke", [[0, "#f4f4f0"], [1, "#d6d2c8"]])}"/>`;
  for (let x = xa + 3; x < xe; x += 6) k += `<rect x="${r(x)}" y="${r(yT + 2)}" width="3" height="${r(yb - yT - 3)}" fill="#e8453c" opacity=".85"/>`;
  k += `<rect x="${r(xa)}" y="${r(yT - 1)}" width="${r(xe - xa)}" height="2" fill="#c9a227"/>`;
  /* Auf der Theke: Popcornmaschine, Mandeln im Kupferkessel, Liebesäpfel */
  const pX = xa + (xe - xa) * 0.18, mX = xa + (xe - xa) * 0.5, aX = xa + (xe - xa) * 0.82;
  k += `<rect x="${r(pX - 7)}" y="${r(yT - 17)}" width="14" height="16" rx="1" fill="#d23a33"/><rect x="${r(pX - 5.6)}" y="${r(yT - 14.5)}" width="11.2" height="10" fill="#fff8e0" opacity=".9"/>`;
  for (let i = 0; i < 26; i++) k += `<circle cx="${r(pX - 5 + rnd() * 10)}" cy="${r(yT - 5.5 - rnd() * (i < 18 ? 3 : 8))}" r=".75" fill="#fff6d0" stroke="#e8c87a" stroke-width=".15"/>`;
  k += `<text x="${r(pX)}" y="${r(yT - 15.2)}" font-size="2" text-anchor="middle" fill="#fff" font-family="Arial Black,Arial" font-weight="900">POPCORN</text>`;
  k += `<path d="M${r(pX + 4)} ${r(yT - 1)} l1 -5 h3 l1 5 Z" fill="#fff" stroke="#d23a33" stroke-width=".3"/>`;
  k += `<path d="M${r(mX - 8)} ${r(yT - 5)} Q${r(mX)} ${r(yT + 1)} ${r(mX + 8)} ${r(yT - 5)} Z" fill="${S.lg("kupfer", [[0, "#f0a060"], [1, "#a8582a"]])}"/>`;
  for (let i = 0; i < 18; i++) k += `<ellipse cx="${r(mX - 6.5 + rnd() * 13)}" cy="${r(yT - 5.4 + rnd() * 1.2)}" rx=".9" ry=".55" fill="${rnd() < 0.5 ? "#8a4a1e" : "#a8622a"}"/>`;
  for (let i = 0; i < 4; i++) k += `<path d="M${r(mX - 4 + i * 2.6)} ${r(yT - 7)} q1 -2 0 -4" stroke="#fff" stroke-width=".35" opacity=".45" fill="none"/>`;
  for (let i = 0; i < 3; i++) { const x = mX + 10 + i * 3; k += `<path d="M${r(x - 1.2)} ${r(yT - 1)} L${r(x - 1.6)} ${r(yT - 5)} Q${r(x)} ${r(yT - 6)} ${r(x + 1.6)} ${r(yT - 5)} L${r(x + 1.2)} ${r(yT - 1)} Z" fill="#f4f0e2" stroke="#b9a37a" stroke-width=".2"/><ellipse cx="${r(x)}" cy="${r(yT - 5)}" rx="1.4" ry=".6" fill="#8a4a1e"/>`; }
  for (let i = 0; i < 4; i++) { const x = aX - 6 + i * 3.8; k += `<path d="M${r(x)} ${r(yT - 4.6)} V${r(yT - 9)}" stroke="#d8c28a" stroke-width=".4"/><circle cx="${r(x)}" cy="${r(yT - 2.6)}" r="2.2" fill="${S.rg("apfel", [[0, "#ff6b6b"], [0.6, "#c8102e"], [1, "#7a0618"]], 0.38, 0.32, 0.75)}"/><ellipse cx="${r(x - 0.7)}" cy="${r(yT - 3.4)}" rx=".6" ry=".35" fill="#fff" opacity=".7"/>`; }
  /* Dach und Schild */
  k += `<path d="M${r(xa)} ${r(yD)} L${r(xe + 3)} ${r(yD)} L${r(xe + 1)} ${r(yD - 3)} L${r(xa)} ${r(yD - 3)} Z" fill="#f4f4f0"/>`;
  for (let x = xa; x < xe + 2; x += 6) k += `<path d="M${r(x)} ${r(yD)} h3 l-.5 -3 h-3 Z" fill="#e8453c"/>`;
  k += `<rect x="${r(xa)}" y="${r(yS)}" width="${r(xe - xa)}" height="${r(yD - 3 - yS)}" fill="${S.lg("schildsw", [[0, "#8a2a5a"], [1, "#5a1a3a"]])}"/>`;
  k += `<text x="${r((xa + xe) / 2)}" y="${r(yS + (yD - 3 - yS) * 0.68)}" font-size="${r((yD - 3 - yS) * 0.55)}" text-anchor="middle" fill="#ffe066" font-family="Georgia,serif" font-weight="bold" font-style="italic">Süßwaren</text>`;
  for (let i = 0; i <= 10; i++) k += birne(xa + 1 + i * (xe - xa - 2) / 10, yD + 0.8, 0.5, BUNT[i % 6], 2.2);
  const unter = [
    { id: "popcorn", de: "das Popcorn", syl: "POP-corn", it: "i popcorn", itSyl: "POP-corn", en: "popcorn", x: pX, y: yT, kunst: flaeche(-7, -17.5, 16, 17.5),
      tipp: "Popcorn ist aufgeplatzter Mais – süß oder salzig." },
    { id: "gebrannte_mandeln", de: "die gebrannten Mandeln", syl: "ge-BRANN-ten MAN-deln", it: "le mandorle tostate", itSyl: "MAN-dor-le to-STA-te", en: "roasted almonds", x: mX + 2, y: yT, kunst: flaeche(-10, -11, 20, 11.5),
      tipp: "Die Mandeln werden im Kupferkessel mit Zucker geröstet – das riecht man von Weitem." },
    { id: "lebkuchenherz", de: "das Lebkuchenherz", syl: "LEB-ku-chen-herz", it: "il cuore di panpepato", itSyl: "CUO-re di pan-pe-PA-to", en: "gingerbread heart", x: xa + 8 + (xe - xa - 14) / 3, y: yD + 13, kunst: flaeche(-7, -9.6, 14, 11),
      tipp: "Auf dem Lebkuchenherz steht ein Spruch aus Zuckerguss." },
    { id: "liebesapfel", de: "der Liebesapfel", syl: "LIE-bes-ap-fel", it: "la mela caramellata", itSyl: "ME-la ca-ra-mel-LA-ta", en: "candy apple", x: aX - 0.3, y: yT, kunst: flaeche(-8.4, -9.4, 16.4, 9.6) },
  ];
  const ax = (xa + xe) / 2;
  S.teil({ id: "suesswarenstand", de: "der Süßwarenstand", syl: "SÜSS-wa-ren-stand", it: "la bancarella dei dolciumi", itSyl: "ban-ca-REL-la dei dol-CIU-mi", en: "sweet stall", x: ax, y: yb, steht: true, kunst: abs(ax, yb, k),
    zoom: { x: r(xa), y: r(yD - 4), w: r(xe - xa), h: r((xe - xa) / 1.5) }, unter });
}

/* =====================================================================
   8 — DIE SCHIESSBUDE (vorne rechts) — Lupe: Zielscheibe, Teddybär, Rose
   ===================================================================== */
{
  const d = 9.4, sc = s(d), x0 = 3.3, x1 = 6.6;
  const xa = X(x0, d), xe = Math.min(320, X(x1, d)), yb = Y(d), yT = Y(d, 1.0), yD = Y(d, 2.7), yS = Y(d, 3.3);
  let k = schatten((xa + xe) / 2, yb, (xe - xa) / 2, 2, 0.4);
  k += `<rect x="${r(xa)}" y="${r(yD)}" width="${r(xe - xa)}" height="${r(yT - yD)}" fill="${S.lg("sinnen", [[0, "#2a3a6a"], [1, "#1a2448"]])}"/>`;
  /* Gewinne oben: Teddys und Plastikrosen */
  for (let i = 0; i < 5; i++) {
    const x = xa + 6 + i * (xe - xa - 12) / 4, y = yD + 8, f = ["#c98a4a", "#ff8ad8", "#7fd3ff", "#f2c230", "#ffffff"][i];
    k += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="2.6" ry="3.2" fill="${f}"/><circle cx="${r(x)}" cy="${r(y - 4.4)}" r="2.2" fill="${f}"/><circle cx="${r(x - 1.7)}" cy="${r(y - 6.1)}" r=".8" fill="${f}"/><circle cx="${r(x + 1.7)}" cy="${r(y - 6.1)}" r=".8" fill="${f}"/><circle cx="${r(x - 0.7)}" cy="${r(y - 4.7)}" r=".25" fill="#222"/><circle cx="${r(x + 0.7)}" cy="${r(y - 4.7)}" r=".25" fill="#222"/>`;
  }
  for (let i = 0; i < 9; i++) { const x = xa + 4 + i * (xe - xa - 8) / 8; k += `<path d="M${r(x)} ${r(yD + 2)} v8" stroke="#3c8a3a" stroke-width=".35"/><circle cx="${r(x)}" cy="${r(yD + 2)}" r="1.1" fill="${["#e8453c", "#ffe066", "#ff8ad8"][i % 3]}"/>`; }
  /* Zielscheiben und Röhrchen */
  const ziele = [];
  for (let i = 0; i < 4; i++) { const x = xa + 7 + i * (xe - xa - 14) / 3, y = yD + 19; ziele.push([x, y]); for (const [rr, f] of [[3.4, "#f4f4f0"], [2.6, "#2b2b2b"], [1.8, "#f4f4f0"], [1, "#e8453c"]]) k += `<circle cx="${r(x)}" cy="${r(y)}" r="${rr}" fill="${f}"/>`; }
  for (let i = 0; i < 14; i++) { const x = xa + 3 + i * (xe - xa - 6) / 13; k += `<rect x="${r(x - 0.4)}" y="${r(yT - 6)}" width=".8" height="4" fill="${["#ffe066", "#ff6b6b", "#7fd3ff"][i % 3]}"/>`; }
  /* Theke mit angeketteten Luftgewehren */
  k += `<rect x="${r(xa)}" y="${r(yT)}" width="${r(xe - xa)}" height="${r(yb - yT)}" fill="${S.lg("sth", [[0, "#2f86d0"], [1, "#1f5fae"]])}"/>`;
  k += `<rect x="${r(xa)}" y="${r(yT - 1)}" width="${r(xe - xa)}" height="2" fill="#c9a227"/>`;
  for (const t of [0.25, 0.65]) { const x = xa + (xe - xa) * t; k += `<path d="M${r(x - 8)} ${r(yT - 1.2)} L${r(x + 6)} ${r(yT - 2.2)}" stroke="#3a2a1a" stroke-width="1.2" stroke-linecap="round"/><path d="M${r(x - 8)} ${r(yT - 1.2)} l3.5 -.3" stroke="#7a4a2a" stroke-width="2" stroke-linecap="round"/><path d="M${r(x - 6)} ${r(yT - 1)} q2 3 6 1" stroke="#9aa3aa" stroke-width=".25" fill="none" stroke-dasharray=".5 .3"/>`; }
  for (let x = xa + 4; x < xe - 2; x += 10) k += `<text x="${r(x + 4)}" y="${r(yT + 8)}" font-size="3.2" text-anchor="middle" fill="#ffe066" font-family="Arial Black,Arial" font-weight="900">★</text>`;
  /* Dach und Schild */
  k += `<path d="M${r(xa - 3)} ${r(yD)} L${r(xe)} ${r(yD)} L${r(xe)} ${r(yD - 3)} L${r(xa - 1)} ${r(yD - 3)} Z" fill="#f4f4f0"/>`;
  for (let x = xa - 2; x < xe; x += 6) k += `<path d="M${r(x)} ${r(yD)} h3 l-.5 -3 h-3 Z" fill="#2f86d0"/>`;
  k += `<rect x="${r(xa)}" y="${r(yS)}" width="${r(xe - xa)}" height="${r(yD - 3 - yS)}" fill="#141a46"/>`;
  k += `<text x="${r((xa + xe) / 2)}" y="${r(yS + (yD - 3 - yS) * 0.7)}" font-size="${r((yD - 3 - yS) * 0.55)}" text-anchor="middle" fill="#ff8ad8" font-family="Arial Black,Arial" font-weight="900">SCHIESSHALLE</text>`;
  for (let i = 0; i <= 10; i++) k += birne(xa + 1 + i * (xe - xa - 2) / 10, yD + 0.8, 0.5, BUNT[(i + 2) % 6], 2.2);
  const unter = [
    { id: "zielscheibe", de: "die Zielscheibe", syl: "ZIEL-schei-be", it: "il bersaglio", itSyl: "ber-SA-glio", en: "target", x: ziele[1][0], y: ziele[1][1] + 4, kunst: flaeche(-4, -8, 8, 8) },
    { id: "teddybaer", de: "der Teddybär", syl: "TED-dy-bär", it: "l'orsacchiotto", itSyl: "or-sac-CHIOT-to", en: "teddy bear", x: xa + 6, y: yD + 11.3, kunst: flaeche(-3.4, -10.2, 6.8, 10.4),
      tipp: "Wer gut trifft, gewinnt einen Teddybären." },
    { id: "rose", de: "die Rose", syl: "RO-se", it: "la rosa", itSyl: "RO-sa", en: "rose", x: xa + 4 + 4 * (xe - xa - 8) / 8, y: yD + 10, kunst: flaeche(-2.4, -9.4, 4.8, 9.6),
      tipp: "Die Plastikrose ist ein typischer Gewinn an der Schießbude." },
  ];
  const ax = (xa + xe) / 2;
  S.teil({ id: "schiessbude", de: "die Schießbude", syl: "SCHIESS-bu-de", it: "il tiro a segno", itSyl: "TI-ro a SE-gno", en: "shooting gallery", x: ax, y: yb, steht: true, kunst: abs(ax, yb, k),
    zoom: { x: r(xa), y: r(yD - 4), w: r(xe - xa), h: r((xe - xa) / 1.5) }, unter });
}

/* =====================================================================
   9 — DIE MENSCHEN: Besucherin mit Zuckerwatte, Kind mit Luftballon,
       Besucher
   ===================================================================== */
const hand = (m) => { const h = [m.z.handL, m.z.handR].filter(Boolean).sort((a, b) => (a.y != null ? a.y : a[1]) - (b.y != null ? b.y : b[1]))[0]; return [(h.x != null ? h.x : h[0]) * m.k, (h.y != null ? h.y : h[1]) * m.k]; };
let ZW = null, LB = null;
{
  const d = 11.6, sc = s(d), [x, y] = P(1.6, d);
  const m = mensch({ id: "b14d_bes", geschlecht: "m", pose: "gehen", blick: 25, frisur: "kurz", haarfarbe: "dunkelbraun", haut: "hell",
    kleidung: { oberteil: { stueck: "pullover", farbe: "#2f5f95" }, unterteil: { stueck: "jeans" }, jacke: { stueck: "jacke", farbe: "#3a3f44" }, schuhe: { stueck: "turnschuh" } } }, 1.8 * sc);
  S.teil({ id: "besucher", de: "der Besucher", syl: "Be-SU-cher", it: "il visitatore", itSyl: "vi-si-ta-TO-re", en: "visitor", x, y, kunst: schatten(0, 0, 6, 1.2, 0.35) + m.svg });
}
{
  const d = 10.4, sc = s(d), [x, y] = P(-1.5, d);
  const m = mensch({ id: "b14d_bin", geschlecht: "w", pose: "halten", blick: 18, frisur: "lang", haarfarbe: "rot", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "pullover", farbe: "#e0802e" }, unterteil: { stueck: "jeans" }, jacke: { stueck: "jacke", farbe: "#2f5a35" }, schuhe: { stueck: "stiefel" }, zubehoer: { stueck: "schal", farbe: "#c8324a" } } }, 1.68 * sc);
  const [hx, hy] = hand(m);
  ZW = [x + hx, y + hy, sc];
  S.teil({ id: "besucherin", de: "die Besucherin", syl: "Be-SU-che-rin", it: "la visitatrice", itSyl: "vi-si-ta-TRI-ce", en: "visitor", x, y, kunst: schatten(0, 0, 6, 1.2, 0.35) + m.svg });
}
{
  const d = 9.9, sc = s(d), [x, y] = P(0.15, d);
  const m = mensch({ id: "b14d_kind", alter: "kind", geschlecht: "m", pose: "zeigen", blick: -10, frisur: "kurz", haarfarbe: "blond", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "pullover", farbe: "#e8453c" }, unterteil: { stueck: "jeans" }, jacke: { stueck: "jacke", farbe: "#2f86d0" }, schuhe: { stueck: "turnschuh" }, kopf: { stueck: "muetze", farbe: "#f2c230" } } }, 1.3 * sc);
  const [hx, hy] = hand(m);
  LB = [x + hx, y + hy, sc];
  S.teil({ id: "kind_jm", de: "das Kind", syl: "KIND", it: "il bambino", itSyl: "bam-BI-no", en: "child", x, y, kunst: schatten(0, 0, 4, 1, 0.35) + m.svg,
    tipp: "Das Kind zeigt aufs Karussell: Da will es hin!" });
}
{
  /* DIE ZUCKERWATTE — rosa Wolke am Stab in der Hand der Besucherin */
  const [x, y, sc] = ZW, g = 0.2 * sc;
  let k = `<path d="M0 1 V${r(-g * 1.2)}" stroke="#f4f0e2" stroke-width=".6"/>`;
  for (let i = 0; i < 9; i++) { const a = i * 0.7; k += `<circle cx="${r(Math.cos(a) * g * 0.55)}" cy="${r(-g * 2.2 + Math.sin(a) * g * 0.7)}" r="${r(g * (0.55 + (i % 3) * 0.1))}" fill="${i % 2 ? "#ffb0e0" : "#ff9ad0"}"/>`; }
  k += `<circle cx="${r(-g * 0.3)}" cy="${r(-g * 2.6)}" r="${r(g * 0.4)}" fill="#fff" opacity=".35"/>`;
  S.teil({ oben: true, id: "zuckerwatte", de: "die Zuckerwatte", syl: "ZU-cker-wat-te", it: "lo zucchero filato", itSyl: "ZUC-che-ro fi-LA-to", en: "candy floss", x, y, kunst: k,
    tipp: "Zuckerwatte ist geschmolzener Zucker, zu feinen Fäden gesponnen." });
}
{
  /* DER LUFTBALLON — an der Schnur in der Hand des Kindes */
  const [x, y, sc] = LB, R = 0.17 * sc, hh = 0.95 * sc;
  let k = `<path d="M0 0 Q2 ${r(-hh * 0.5)} 1 ${r(-hh)}" stroke="#eee" stroke-width=".25" fill="none"/>`;
  k += `<ellipse cx="1" cy="${r(-hh - R * 1.1)}" rx="${r(R)}" ry="${r(R * 1.2)}" fill="${S.rg("ballon", [[0, "#ff9a9a"], [0.6, "#e8263a"], [1, "#9a0a1e"]], 0.35, 0.3, 0.8)}"/>`;
  k += `<path d="M.4 ${r(-hh + 0.2)} l.6 -1 l.6 1 Z" fill="#b8102a"/><ellipse cx="${r(1 - R * 0.35)}" cy="${r(-hh - R * 1.6)}" rx="${r(R * 0.25)}" ry="${r(R * 0.35)}" fill="#fff" opacity=".55"/>`;
  S.teil({ oben: true, id: "luftballon", de: "der Luftballon", syl: "LUFT-bal-lon", it: "il palloncino", itSyl: "pal-lon-CI-no", en: "balloon", x, y, kunst: k });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/jahrmarkt.js"));
console.log(aus);
