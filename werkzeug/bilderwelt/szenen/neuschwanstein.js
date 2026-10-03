#!/usr/bin/env node
/* =====================================================================
   SCHLOSS NEUSCHWANSTEIN (FASSUNG 854) — Bilderwelt neu: Sehenswürdigkeit
   ---------------------------------------------------------------------
   XANDER (03.10.): „die bekannten Sehenswürdigkeiten … als Profi-
   Grafikdesigner auf Hollywood-Niveau … mit größter Sorgfalt und
   Präzision auf höchstem Niveau“.

   STANDORT (Runde 2: echte Kamera): auf dem Deck der MARIENBRÜCKE
   (Schwangau, Ostallgäu), etwa 1 m hinter dem nördlichen Geländer,
   Augenhöhe 1,65 m über den Bohlen. Die Brücke liegt SÜDÖSTLICH des
   Schlosses; man schaut nach Nordwesten (Blickrichtung 319°) über die
   Pöllatschlucht auf das Schloss, etwa 30 m über dem oberen Schlosshof
   (≈ 40 m über dem Palasfuß). Oktober-Nachmittag, Sonne aus Südwest
   (≈ 225°, 25° hoch): die Südseiten leuchten, Hofseiten und Ostseiten
   liegen im Schatten, alle Schatten fallen nach Nordosten (rechts).

   RECHERCHE (Bayerische Schlösserverwaltung, Wikipedia „Schloss
   Neuschwanstein“ und „Marienbrücke“; Fachwissen, Unsicheres markiert):
   - DAS SCHLOSS (ab 1869 für König Ludwig II.): eine Kette von Bauten
     auf dem Felsgrat um einen oberen und einen unteren Hof. Im Westen
     der PALAS: fünf Geschosse, über 50 m lang, zwei Baukörper im
     flachen Winkel, steiles Satteldach aus Schiefer, achteckige
     Ecktürmchen. Vor der Hofseite zwei Treppentürme; der nördliche,
     der NORDTURM, ist über 65 m hoch und überragt das Dach um mehrere
     Geschosse. Im 4. Stock der Hofseite der SÄNGERSAAL (27 × 10 m) mit
     Bogenfenstern und Säulchen. Am oberen Hof im Süden die KEMENATE
     (drei Geschosse, schlanker Rundturm an der Ecke), im Norden das
     RITTERHAUS mit einer Galerie aus Blendarkaden, die zum VIERECKTURM
     (45 m, Plattform mit Rundtürmchen) und zum TORBAU führt. Der Torbau
     ist außen aus ROTEN ZIEGELN (nie mit Kalkstein verkleidet), zwei
     Geschosse, beidseitig Flankiertürme, in der Mitte die Tordurchfahrt.
     Verkleidung sonst heller Kalkstein vom Alterschrofen.
   - Lage der Bauten zueinander (Palas im Westen, Torbau im Osten, Hof
     dazwischen) nach Grundriss; Maße auf ±20 % genau (UNSICHER: genaue
     Geschosshöhen und Fensterzahl; hier vereinfacht, aber unregelmäßig).
   - MARIENBRÜCKE: eiserne Fachwerkbrücke (1866 unter Ludwig II. statt
     der Holzbrücke Maximilians II.), etwa 90 m über dem Pöllatfall.
     Der Wasserfall liegt direkt UNTER der Brücke — im Blick nach vorn
     ist er nicht zu sehen (er steht im Tipp der Schlucht); aus der
     Schlucht steigt Gischtdunst auf.
   - ECHTE PEILUNGEN von der Brücke (aus Kartenwissen, ±5°): Palas 312°,
     Torbau 325°, St. Coloman ≈ 307° (4 km), Schwangau ≈ 331° (3 km),
     Forggensee 320°–350° (4–12 km). Füssen (≈ 293°), Hohenschwangau
     und Alpsee (≈ 270°) sowie der Säuling (≈ 235°) liegen links
     AUSSERHALB des Bildes und fehlen darum.
   - Vor Ort typisch: Wanderer mit Rucksack und Kamera auf dem Weg vom
     Schloss zur Brücke, die Infotafel mit König Ludwig II.,
     Pferdekutschen (bringen Gäste vom Dorf zum Schloss; hier auf der
     Zufahrt unter dem Torbau — UNSICHER, ob man genau diese Stelle von
     der Brücke sieht), Herbstwald aus Buchen, Lärchen und Fichten.
   Kamera: Brennweite 580 Einheiten, Augenhöhe y 66 (Horizont).
   Schloss in ≈ 390 m ≈ 1,5 Einheiten je Meter.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "neuschwanstein", titel: "Schloss Neuschwanstein", emoji: "🏰", thema: "Deutschland", kuerzel: "nsw", fassung: 854, breite: 400, hoehe: 260 });
const rnd = zufall(1869);
const r = B.r;

/* ---------- Kamera ------------------------------------------------- */
const TH = 319 * Math.PI / 180, F = 580, CX = 200, HOR = 66, EYE = 32;   /* EYE: Augenhöhe über dem oberen Schlosshof (m) */
const FV = [Math.sin(TH), Math.cos(TH)], RV = [Math.cos(TH), -Math.sin(TH)];
const tief = (E, N) => E * FV[0] + N * FV[1];
const proj = (E, N, z) => { const f = tief(E, N), l = E * RV[0] + N * RV[1]; return [CX + F * l / f, HOR + F * (EYE - z) / f]; };
const E0 = -297, N0 = 268;                      /* Mitte des Palas, relativ zur Brücke (m Ost, m Nord) */
const C = (u, v, z) => proj(E0 + u, N0 + v, z);  /* u nach Osten, v nach Norden, z über dem oberen Hof */
const k1 = (u, v) => F / tief(E0 + u, N0 + v);  /* Einheiten je Meter an dieser Stelle */
const Pt = (p) => `${r(p[0])} ${r(p[1])}`;
const poly = (pts) => "M" + pts.map(Pt).join(" L") + " Z";
/* Vieleck auf das Bild beschneiden (Sutherland–Hodgman), damit nichts über den Rand ragt */
function zuschnitt(pts, x0 = -1, y0 = -1, x1 = 401, y1 = 261) {
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
const EBENE = -185;                             /* Alpenvorland (≈ 780 m) relativ zum Hof */
const yEbene = (f) => HOR + F * (EYE - EBENE) / f;

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("wolke")}" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="1.1"/></filter>`);
S.def(`<filter id="${S.id("dunst")}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3"/></filter>`);
S.def(`<filter id="${S.id("weich")}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation=".35"/></filter>`);
S.def(`<filter id="${S.id("flecken")}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="2.4"/></filter>`);

/* ---------- Stoffe (Sonne von links hinten: linke Kanten hell) ------ */
const KALK_SUED = S.lg("kalksued", [[0, "#fffaf0"], [1, "#f1e7d4"]]);
const KALK_OST = S.lg("kalkost", [[0, "#c9cad3"], [1, "#b2b5c1"]]);
const KALK_RUND = S.lg("kalkrund", [[0, "#fff8ea"], [0.35, "#f6eedf"], [0.7, "#c6c7cf"], [1, "#9fa3ae"]], 0, 0, 1, 0);
const SCHIEFER_OST = S.lg("schieferost", [[0, "#5d6672"], [1, "#454c57"]]);
const SCHIEFER_SUED = S.lg("schiefersued", [[0, "#8d96a2"], [1, "#6c7582"]]);
const SCHIEFER_RUND = S.lg("schieferrund", [[0, "#9aa3ae"], [0.4, "#717a87"], [1, "#3c434d"]], 0, 0, 1, 0);
const ZIEGEL_LICHT = S.lg("ziegellicht", [[0, "#cf6a4a"], [1, "#b8553a"]]);
const ZIEGEL_SCHATTEN = S.lg("ziegelschatten", [[0, "#8a3c2c"], [1, "#74301f"]]);
const ZIEGEL_RUND = S.lg("ziegelrund", [[0, "#d87a58"], [0.4, "#b8583e"], [1, "#6e2e20"]], 0, 0, 1, 0);
const GLAS = S.lg("glas", [[0, "#5d6b80"], [1, "#2a3340"]]);
const GLAS_S = "#2c3440";
const GOLD = S.lg("gold", [[0, "#f6dd84"], [1, "#b48a2c"]]);
S.def(`<pattern id="${S.id("quader")}" width="4" height="1.5" patternUnits="userSpaceOnUse"><path d="M0 1.45 H4 M2 0 V.75 M0 .75 H4 M0 .75 V1.5" stroke="#9c917e" stroke-width=".1" fill="none"/></pattern>`);
const QUADER = `url(#${S.id("quader")})`;
S.def(`<pattern id="${S.id("zv")}" width="2" height=".9" patternUnits="userSpaceOnUse"><path d="M0 .85 H2 M0 .42 H2 M1 0 V.42 M0 .42 V.9" stroke="#e8c9ae" stroke-width=".09" opacity=".8"/></pattern>`);
const ZV = `url(#${S.id("zv")})`;

/* ---------- Herbstwald als nahtlose Musterkacheln ------------------ */
const LAUB = ["#d6a03a", "#c8892c", "#e6bb52", "#b5672a", "#a8822e", "#c4a245", "#8f4e22"];
const NADEL = ["#2c4632", "#36553a", "#25402d", "#41613d"];
function waldKachel(name, w, h, n, anteilNadel, grund, seed) {
  const z = zufall(seed);
  const kronen = [];
  for (let i = 0; i < n; i++) kronen.push({ x: z() * w, y: z() * h, s: 0.9 + z() * 0.8, nadel: z() < anteilNadel, f: z() });
  kronen.sort((a, b) => a.y - b.y);
  let g = `<rect width="${w}" height="${h}" fill="${grund}"/>`;
  for (const c of kronen) for (const dx of [-w, 0, w]) for (const dy of [-h, 0, h]) {
    const x = c.x + dx, y = c.y + dy, s = c.s;
    if (x < -3 || x > w + 3 || y < -4 || y > h + 3) continue;
    if (c.nadel) {
      const f = NADEL[Math.floor(c.f * NADEL.length)];
      g += `<path d="M${r(x - s * 0.9)} ${r(y + s * 0.6)} L${r(x)} ${r(y - s * 2.2)} L${r(x + s * 0.9)} ${r(y + s * 0.6)} Z" fill="${f}"/><path d="M${r(x - s * 0.5)} ${r(y - s * 0.4)} L${r(x)} ${r(y - s * 2.2)} L${r(x)} ${r(y + s * 0.4)} Z" fill="#8aa874" opacity=".3"/>`;
    } else {
      const f = LAUB[Math.floor(c.f * LAUB.length)];
      g += `<ellipse cx="${r(x + 0.35)}" cy="${r(y + 0.4)}" rx="${r(s * 1.3)}" ry="${r(s * 1.05)}" fill="#2a2010" opacity=".25"/><ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(s * 1.3)}" ry="${r(s * 1.05)}" fill="${f}"/><ellipse cx="${r(x - s * 0.45)}" cy="${r(y - s * 0.35)}" rx="${r(s * 0.6)}" ry="${r(s * 0.45)}" fill="#fbe7a6" opacity=".16"/><path d="M${r(x - s * 1.1)} ${r(y + s * 0.2)} q${r(s * 0.5)} ${r(s * 0.5)} ${r(s * 1.1)} ${r(s * 0.7)}" stroke="#3a2410" stroke-width="${r(s * 0.12)}" fill="none" opacity=".35"/>`;
    }
  }
  S.def(`<pattern id="${S.id(name)}" width="${w}" height="${h}" patternUnits="userSpaceOnUse">${g}</pattern>`);
  return (skala, dreh = 0) => {
    const id = name + "_" + String(skala).replace(".", "") + "_" + dreh;
    S.def(`<pattern id="${S.id(id)}" href="#${S.id(name)}" patternTransform="rotate(${dreh}) scale(${skala})"/>`);
    return `url(#${S.id(id)})`;
  };
}
const HERBST = waldKachel("herbst", 26, 18, 120, 0.4, "#5a4a28", 3141);
/* Einzelne Bäume in der Nähe (30–150 m): Laubkrone aus Ballen mit Licht von links oben */
function laubkrone(cx, cy, rx, ry, pal, n = 7) {
  let g = `<ellipse cx="${r(cx + rx * 0.08)}" cy="${r(cy + ry * 0.12)}" rx="${r(rx)}" ry="${r(ry)}" fill="${pal[3]}"/>`;
  const ballen = [];
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2 + rnd() * 0.5, d = 0.35 + rnd() * 0.35; ballen.push([cx + Math.cos(a) * rx * d, cy + Math.sin(a) * ry * d * 0.9, rx * (0.42 + rnd() * 0.18)]); }
  ballen.push([cx - rx * 0.1, cy - ry * 0.15, rx * 0.5]);
  ballen.sort((a, b) => a[1] - b[1]);
  for (const [x, y, q] of ballen) {
    const t = Math.max(0, Math.min(1, ((x - cx) / rx + (y - cy) / ry) * 0.5 + 0.5));
    g += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(q)}" ry="${r(q * 0.82)}" fill="${t < 0.35 ? pal[0] : t < 0.65 ? pal[1] : pal[2]}"/>`;
    g += `<ellipse cx="${r(x - q * 0.3)}" cy="${r(y - q * 0.32)}" rx="${r(q * 0.5)}" ry="${r(q * 0.36)}" fill="#fbe39a" opacity="${t < 0.5 ? 0.45 : 0.18}"/>`;
    for (let j = 0; j < 4; j++) g += `<path d="M${r(x - q * 0.9 + j * q * 0.6)} ${r(y + q * 0.55)} q${r(q * 0.15)} ${r(q * 0.25)} ${r(q * 0.3)} 0" stroke="${pal[3]}" stroke-width="${r(Math.max(0.3, q * 0.08))}" fill="none" opacity=".6"/>`;
  }
  return g;
}
/* Laubkrone mit echter Blatt-Textur: Ballen als Umriss, darin ein Blattmuster, darüber Licht und Schatten je Ballen */
{
  const z = zufall(77);
  let m = `<rect width="9" height="7" fill="#7a3e16"/>`;
  for (let i = 0; i < 46; i++) {
    const x = z() * 9, y = z() * 7, f = ["#f2c45c", "#e0a23a", "#c97a2a", "#b25e22", "#e8b84a", "#d8902e", "#9a4a1c"][Math.floor(z() * 7)], a = Math.round(z() * 180);
    for (const [dx, dy] of [[0, 0], [9, 0], [-9, 0], [0, 7], [0, -7]]) { const ex = r(x + dx), ey = r(y + dy); if (ex < -1.5 || ex > 10.5 || ey < -1.5 || ey > 8.5) continue; m += `<ellipse cx="${ex}" cy="${ey}" rx=".95" ry=".5" fill="${f}" transform="rotate(${a} ${ex} ${ey})"/>`; }
  }
  S.def(`<pattern id="${S.id("blaetter")}" width="9" height="7" patternUnits="userSpaceOnUse">${m}</pattern>`);
  S.def(`<pattern id="${S.id("blaetter2")}" href="#${S.id("blaetter")}" patternTransform="scale(.55)"/>`);
}
let KRONE_NR = 0;
function textkrone(cx, cy, rx, ry, n = 8, klein = false) {
  const id = "krone" + (KRONE_NR++);
  const ballen = [[cx, cy, rx * 0.62, ry * 0.7]];
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2 + rnd() * 0.4, d = 0.42 + rnd() * 0.22; ballen.push([cx + Math.cos(a) * rx * d, cy + Math.sin(a) * ry * d, rx * (0.36 + rnd() * 0.14), ry * (0.4 + rnd() * 0.14)]); }
  ballen.sort((a, b) => a[1] - b[1]);
  const umriss = ballen.map(([x, y, a, b]) => `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(a)}" ry="${r(b)}"/>`).join("");
  S.def(`<clipPath id="${S.id(id)}">${umriss}</clipPath>`);
  const LICHT = S.rg("kronenlicht", [[0, "#fff1c0", 0.42], [0.45, "#fff1c0", 0.05], [0.8, "#2a1404", 0.18], [1, "#2a1404", 0.42]], 0.34, 0.3, 0.75);
  let g = `<g clip-path="url(#${S.id(id)})"><rect x="${r(cx - rx - 2)}" y="${r(cy - ry - 2)}" width="${r(2 * rx + 4)}" height="${r(2 * ry + 4)}" fill="url(#${S.id(klein ? "blaetter2" : "blaetter")})"/>`;
  for (const [x, y, a, b] of ballen) g += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(a)}" ry="${r(b)}" fill="${LICHT}"/>`;
  g += `<rect x="${r(cx - rx - 2)}" y="${r(cy - ry - 2)}" width="${r(2 * rx + 4)}" height="${r(2 * ry + 4)}" fill="${S.lg("kronenseite", [[0, "#ffe6a0", 0.12], [0.5, "#000", 0], [1, "#140a02", 0.28]], 0, 0, 1, 1)}"/></g>`;
  return g;
}
function fichteGross(x, yTop, h, w) {
  let g = "";
  const n = Math.max(5, Math.round(h / 7));
  for (let i = 0; i < n; i++) {
    const yy = yTop + (i + 1) * h / n, ww = w * (0.18 + 0.82 * (i + 1) / n);
    g += `<path d="M${r(x - ww)} ${r(yy)} Q${r(x - ww * 0.5)} ${r(yy - h / n * 0.6)} ${r(x)} ${r(yy - h / n * 1.6)} Q${r(x + ww * 0.5)} ${r(yy - h / n * 0.6)} ${r(x + ww)} ${r(yy)} Q${r(x + ww * 0.4)} ${r(yy - h / n * 0.25)} ${r(x)} ${r(yy - h / n * 0.1)} Q${r(x - ww * 0.4)} ${r(yy - h / n * 0.25)} ${r(x - ww)} ${r(yy)} Z" fill="${i % 2 ? "#2f4b33" : "#26402c"}"/>`;
    g += `<path d="M${r(x - ww * 0.9)} ${r(yy - 0.4)} Q${r(x - ww * 0.5)} ${r(yy - h / n * 0.7)} ${r(x - 0.4)} ${r(yy - h / n * 1.4)}" stroke="#86a66e" stroke-width="${r(Math.max(0.4, w * 0.04))}" fill="none" opacity=".7"/>`;
  }
  g += `<path d="M${r(x)} ${r(yTop - h * 0.06)} L${r(x)} ${r(yTop + h * 0.12)}" stroke="#26402c" stroke-width="${r(Math.max(0.6, w * 0.06))}"/>`;
  return g;
}
const BUCHE_PAL = ["#f0bf5a", "#d48d2e", "#a85a22", "#6e3a16"], LAERCHE_PAL = ["#f2d36a", "#d8b03e", "#a88a2a", "#6e5a1a"], AHORN_PAL = ["#f0a050", "#d4642a", "#a43c1e", "#6a2412"];
const drin = (x, y, pg) => {
  let c = false;
  for (let i = 0, j = pg.length - 1; i < pg.length; j = i++) {
    const [xi, yi] = pg[i], [xj, yj] = pg[j];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c;
  }
  return c;
};
/* Waldfläche: Grund, weiche Farbflecken (Buchengruppen, Fichtenhorste), Muster darüber */
function waldflaeche(name, pg, skala, n, grund, deckung, muster = HERBST, dreh = 0, farben = null) {
  const d = poly(pg);
  S.def(`<clipPath id="${S.id(name)}"><path d="${d}"/></clipPath>`);
  const xs = pg.map((p) => p[0]), ys = pg.map((p) => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  let f = "";
  for (let i = 0; i < n; i++) {
    const x = x0 + rnd() * (x1 - x0), y = y0 + rnd() * (y1 - y0);
    const w = Math.min((8 + rnd() * 16) * skala * 1.4, x - x0 + 4, x1 - x + 4), h = Math.min(w * 0.55, y - y0 + 2, y1 - y + 2);
    if (w < 2 || h < 1) continue;
    const pal = farben || ["#c58a2c", "#d9a640", "#2f4a32", "#9a5a24", "#3b5a3a", "#b98a34", "#e2b85a"];
    f += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(w)}" ry="${r(h)}" fill="${pal[Math.floor(rnd() * pal.length)]}"/>`;
  }
  return `<path d="${d}" fill="${grund}"/><g clip-path="url(#${S.id(name)})"><g filter="url(#${S.id("flecken")})">${f}</g></g><path d="${d}" fill="${muster(skala, dreh)}" opacity="${deckung}"/>`;
}
/* Saum aus Baumkronen entlang einer Oberkante */
function saum(linie, s, schritt, anteilNadel = 0.45) {
  let g = "";
  for (let i = 0; i < linie.length - 1; i++) {
    const [ax, ay] = linie[i], [bx, by] = linie[i + 1];
    const len = Math.hypot(bx - ax, by - ay);
    for (let d = 0; d < len; d += schritt * (0.7 + rnd() * 0.6)) {
      const t = d / len, x = ax + (bx - ax) * t, y = ay + (by - ay) * t + rnd() * s * 0.6, k = s * (0.8 + rnd() * 0.5);
      if (rnd() < anteilNadel) g += `<path d="M${r(x - k * 0.8)} ${r(y + k)} L${r(x)} ${r(y - k * 2.3)} L${r(x + k * 0.8)} ${r(y + k)} Z" fill="${NADEL[Math.floor(rnd() * 4)]}"/>`;
      else g += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(k * 1.25)}" ry="${r(k)}" fill="${LAUB[Math.floor(rnd() * LAUB.length)]}"/><ellipse cx="${r(x - k * 0.4)}" cy="${r(y - k * 0.35)}" rx="${r(k * 0.55)}" ry="${r(k * 0.4)}" fill="#fbe7a6" opacity=".4"/>`;
    }
  }
  return g;
}

/* =====================================================================
   KULISSE — Himmel, Wolken, ferne Hügel, Alpenvorland (Felder, Dörfer)
   ===================================================================== */
S.hinten(`<rect width="400" height="${HOR + 2}" fill="${S.lg("himmel", [[0, "#3d71b8"], [0.5, "#7ba7d6"], [0.85, "#c9dceb"], [1, "#efe6d2"]])}"/>`);
/* Sonne steht links hinten: der Himmel links etwas heller und wärmer */
S.hinten(`<rect width="400" height="${HOR + 2}" fill="${S.lg("sonnenseite", [[0, "#fff1d6", 0.35], [0.45, "#fff1d6", 0], [1, "#fff1d6", 0]], 0, 0, 1, 0)}"/>`);
{
  /* Haufenwolken: sonnige Oberseite, flache graublaue Unterseite */
  let c = "";
  const wolke = (x, y, s) => {
    let g = "";
    for (const [dx, dy, rx, ry] of [[-15, 0.4, 10, 3.6], [-6, -3, 9, 5.4], [4, -4.6, 8.6, 6], [13, -1.6, 9, 4.4], [0, 1, 21, 3]]) g += `<ellipse cx="${r(x + dx * s)}" cy="${r(y + dy * s)}" rx="${r(rx * s)}" ry="${r(ry * s)}" fill="#fbfcfd"/>`;
    g += `<ellipse cx="${r(x + 1 * s)}" cy="${r(y + 2.4 * s)}" rx="${r(20 * s)}" ry="${r(1.9 * s)}" fill="#b9c6d6"/>`;
    g += `<ellipse cx="${r(x - 5 * s)}" cy="${r(y - 3.6 * s)}" rx="${r(7 * s)}" ry="${r(2.8 * s)}" fill="#ffffff"/><ellipse cx="${r(x - 7 * s)}" cy="${r(y - 2 * s)}" rx="${r(5 * s)}" ry="${r(2.2 * s)}" fill="#fff6e4" opacity=".7"/>`;
    return g;
  };
  c += wolke(330, 22, 1.15) + wolke(388, 14, 0.75) + wolke(268, 36, 0.6) + wolke(52, 18, 0.8) + wolke(110, 40, 0.5);
  S.hinten(`<g filter="url(#${S.id("wolke")})">${c}</g>`);
}
/* ferne Hügel des Allgäus am Horizont, im Dunst */
S.hinten(`<path d="M0 ${HOR} L0 61 Q30 58 62 60.6 Q96 57.4 130 59.6 Q170 56.8 214 59.4 Q250 57.4 290 59 Q330 56.4 370 58.6 Q390 57.8 400 58.4 L400 ${HOR} Z" fill="#a9bacb" opacity=".9"/>`);
S.hinten(`<path d="M0 ${HOR + 1} Q80 62.4 160 63.6 Q240 62 320 63.2 Q370 62.4 400 63 L400 ${HOR + 1} Z" fill="#b5c3b4"/>`);
/* Alpenvorland: Felder als Parzellen auf der Ebene (perspektivisch projiziert) */
{
  let c = `<rect x="0" y="${HOR}" width="400" height="${190 - HOR}" fill="${S.lg("ebene", [[0, "#b6c3a6"], [0.2, "#a2b783"], [1, "#86a560"]])}"/>`;
  const FARBEN = ["#9fb873", "#b3c27e", "#8fae64", "#c2c486", "#a7a85c", "#93ad6a", "#b8b06a", "#7f9d58"];
  for (let N = 1200; N < 16000; N *= 1.17) {
    const dn = N * 0.17;
    for (let E = -9000; E < 6000; E += 380 + rnd() * 420) {
      const w = 300 + rnd() * 500, h = dn * (0.6 + rnd() * 0.7);
      const pts = [proj(E, N, EBENE), proj(E + w, N, EBENE), proj(E + w, N + h, EBENE), proj(E, N + h, EBENE)];
      if ([[E, N], [E + w, N], [E + w, N + h], [E, N + h]].some(([a, b]) => tief(a, b) < 300)) continue;
      if (pts.every((p) => p[0] < -10) || pts.every((p) => p[0] > 410)) continue;
      c += `<path d="${poly(pts)}" fill="${FARBEN[Math.floor(rnd() * FARBEN.length)]}" opacity=".75"/>`;
    }
  }
  /* Waldstücke und Hecken */
  for (let i = 0; i < 46; i++) {
    const E = -8000 + rnd() * 13000, N = 1500 + Math.pow(rnd(), 0.7) * 13000;
    if (tief(E, N) < 400) continue;
    const p = proj(E, N, EBENE), s = F / tief(E, N);
    if (p[0] < -20 || p[0] > 420) continue;
    c += `<ellipse cx="${r(p[0])}" cy="${r(p[1])}" rx="${r(Math.max(0.8, (90 + rnd() * 200) * s))}" ry="${r(Math.max(0.35, (30 + rnd() * 50) * s * 0.35))}" fill="${rnd() < 0.6 ? "#5f7a50" : "#87824a"}" opacity=".6"/>`;
  }
  /* Feldwege */
  for (const [a, b] of [[[-2600, 2200], [-900, 6000]], [[-5200, 2600], [-3000, 9000]], [[-600, 1800], [1800, 5200]]]) c += `<path d="M${Pt(proj(a[0], a[1], EBENE))} L${Pt(proj(b[0], b[1], EBENE))}" stroke="#e2dac0" stroke-width=".35" opacity=".7"/>`;
  /* Luftperspektive: nach hinten heller und bläulich */
  c += `<rect x="0" y="${HOR}" width="400" height="34" fill="${S.lg("ebenedunst", [[0, "#e6ebe8", 0.85], [0.5, "#e6ebe8", 0.35], [1, "#e6ebe8", 0]])}"/>`;
  c += `<rect x="0" y="${HOR}" width="400" height="${190 - HOR}" fill="${S.lg("goldduft", [[0, "#ffe6b0", 0.18], [1, "#ffe6b0", 0]], 0, 0, 1, 0)}"/>`;
  S.hinten(c);
}

/* =====================================================================
   1 — DER STAUSEE (Forggensee, groß rechts hinter dem Schloss)
   ===================================================================== */
{
  const ufer = [[-3300, 3700], [-2700, 3350], [-2100, 3700], [-1700, 4400], [-1250, 5400], [-800, 6600], [-450, 8000], [-250, 9600], [-500, 11200], [-1300, 12600], [-2300, 12300], [-3000, 10800], [-3500, 9000], [-3800, 7200], [-3900, 5600], [-3700, 4400]];
  const pts = zuschnitt(ufer.map(([E, N]) => proj(E, N, EBENE)), -1, 60, 401, 140);
  let d = `M${Pt(pts[0])}`;
  for (let i = 1; i <= pts.length; i++) { const a = pts[i - 1], b = pts[i % pts.length]; d += ` Q${Pt(a)} ${Pt([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2])}`; }
  d += " Z";
  let k = `<path d="${d}" fill="${S.lg("forggen", [[0, "#e3ecf1"], [0.45, "#bdd2e0"], [1, "#94b3c8"]])}"/>`;
  /* Himmelsspiegelung und Windstreifen */
  for (const [N0s, w] of [[4600, 0.5], [5600, 0.4], [7000, 0.35], [8800, 0.3]]) { const sg = strecke(proj(-3400, N0s, EBENE), proj(-900, N0s + 600, EBENE)); if (sg) k += `<path d="M${Pt(sg[0])} L${Pt(sg[1])}" stroke="#ffffff" stroke-width="${w}" opacity=".6"/>`; }
  k += `<path d="${d}" fill="${S.lg("forggenlicht", [[0, "#fff4dc", 0.3], [1, "#fff4dc", 0]], 0, 0, 1, 0)}"/>`;
  S.teil({ id: "stausee", de: "der Stausee", syl: "STAU-see", it: "il lago artificiale", itSyl: "LA-go ar-ti-fi-CIA-le", en: "reservoir", x: 0, y: 0, kunst: k,
    tipp: "Der Forggensee ist ein Stausee am Lech. Im Winter wird das Wasser abgelassen." });
}

/* =====================================================================
   2 — DIE KIRCHE (St. Coloman, allein in den Wiesen) und
   3 — DAS DORF (Schwangau)
   ===================================================================== */
{
  const [x, y] = proj(-3400, 2600, EBENE), s = F / tief(-3400, 2600);   /* ≈ 0,14 je Meter */
  const m = s * 3;   /* zur Lesbarkeit 3-fach überhöht (sonst kleiner als ein Pixel) */
  let k = `<ellipse cx="0" cy=".3" rx="${r(34 * m)}" ry="${r(5 * m)}" fill="#b9cc84" opacity=".8"/>`;
  k += `<rect x="${r(-10 * m)}" y="${r(-9 * m)}" width="${r(22 * m)}" height="${r(9 * m)}" fill="#fbf7ee"/><path d="M${r(-11 * m)} ${r(-9 * m)} L${r(-6 * m)} ${r(-15 * m)} L${r(10 * m)} ${r(-15 * m)} L${r(13 * m)} ${r(-9 * m)} Z" fill="#a8604a"/>`;
  k += `<rect x="${r(10 * m)}" y="${r(-9 * m)}" width="${r(2 * m)}" height="${r(9 * m)}" fill="#ddd6c8"/>`;
  k += `<rect x="${r(-16 * m)}" y="${r(-24 * m)}" width="${r(6 * m)}" height="${r(24 * m)}" fill="#fbf7ee"/><path d="M${r(-16.6 * m)} ${r(-24 * m)} Q${r(-17 * m)} ${r(-28 * m)} ${r(-13 * m)} ${r(-30 * m)} Q${r(-9 * m)} ${r(-28 * m)} ${r(-9.4 * m)} ${r(-24 * m)} Z" fill="#5c6b5c"/><rect x="${r(-13.3 * m)}" y="${r(-33 * m)}" width="${r(0.8 * m)}" height="${r(3 * m)}" fill="#5c6b5c"/>`;
  S.teil({ oben: true, id: "kirche", de: "die Kirche", syl: "KIR-che", it: "la chiesa", itSyl: "CHIE-sa", en: "church", x, y, kunst: k + flaeche(-4, -6, 8, 6.4),
    tipp: "Die Wallfahrtskirche St. Coloman steht ganz allein in den Wiesen bei Schwangau." });
}
{
  let k = "";
  const haeuser = [];
  for (let i = 0; i < 34; i++) haeuser.push([-1900 + rnd() * 1100, 2150 + rnd() * 800]);
  haeuser.sort((a, b) => tief(b[0], b[1]) - tief(a[0], a[1]));
  for (const [E, N] of haeuser) {
    const [x, y] = proj(E, N, EBENE), s = F / tief(E, N) * 2.6;
    if (x < 4 || x > 396) continue;
    k += `<rect x="${r(x - 6 * s)}" y="${r(y - 5 * s)}" width="${r(12 * s)}" height="${r(5 * s)}" fill="${rnd() < 0.7 ? "#f3eee2" : "#efe0c0"}"/><path d="M${r(x - 7 * s)} ${r(y - 5 * s)} L${r(x)} ${r(y - 9.5 * s)} L${r(x + 7 * s)} ${r(y - 5 * s)} Z" fill="${rnd() < 0.6 ? "#b0644a" : "#8f5a48"}"/>`;
  }
  { const [x, y] = proj(-1350, 2500, EBENE), s = F / tief(-1350, 2500) * 2.6; k += `<rect x="${r(x - 3 * s)}" y="${r(y - 30 * s)}" width="${r(6 * s)}" height="${r(30 * s)}" fill="#f6f1e6"/><path d="M${r(x - 3.6 * s)} ${r(y - 30 * s)} L${r(x)} ${r(y - 42 * s)} L${r(x + 3.6 * s)} ${r(y - 30 * s)} Z" fill="#5e7468"/>`; }
  S.teil({ id: "dorf", de: "das Dorf", syl: "DORF", it: "il paese", itSyl: "pa-E-se", en: "village", x: 0, y: 0, kunst: k,
    tipp: "Unten im Tal liegt Schwangau. Von hier sieht man auf die Dächer und den Kirchturm." });
}

/* =====================================================================
   GELÄNDE — Felswände, Schlossberg, Westhang (links), Schlucht, Hang
   rechts unter dem Torbau. Die Kanten kommen aus der Kamera (C/proj).
   ===================================================================== */
/* Felsfuß des Schlosses (Oberkante der Wände) und Unterkante der Wände */
const FUSS = [[-16, -24, -12], [-12, -28, -10], [0, -28, -7], [12, -28, -4], [26, -28, -4], [40, -28, -6], [50, -27.6, -8]].map(([u, v, z]) => C(u, v, z));
const FELS_U = [[-20, -30, -46], [-10, -33, -44], [2, -34, -38], [14, -33, -28], [26, -32, -22], [40, -30, -14], [50, -28.4, -9]].map(([u, v, z]) => C(u, v, z));
/* Waldgrenze rechts davon: dicht unter Mauer und Torbau */
const WALDKANTE = [...FELS_U, ...[[64, -27.4, -11], [80, -26.6, -12], [98, -26, -13], [112, -25, -13], [115, -6, -13], [117, 14, -16]].map(([u, v, z]) => C(u, v, z))];
/* Kante des Brückenkopfs (Schluchtrand rechts, auf unserer Seite) */
const RAND = [[300, 141], [296, 156], [288, 176], [278, 198], [266, 222], [256, 244], [250, 262]];
/* Grund der Schlucht (Bachlauf vor dem Schlossfelsen) */
const SOHLE = [[74, 220], [94, 226], [118, 232], [150, 240], [190, 242], [226, 236], [250, 226], [270, 212], [284, 196], [292, 180]];

/* =====================================================================
   4 — DER FELSEN (senkrechte Kalkwände unter Palas, Kemenate und Torbau)
   ===================================================================== */
{
  const pg = [...FUSS, ...FELS_U.slice().reverse()];
  let k = `<path d="${poly(pg)}" fill="${S.lg("fels", [[0, "#ddd4c2"], [1, "#a99c86"]])}"/>`;
  /* Rippen und Nischen: schmale Felspfeiler, links Licht (Südwest), rechts Schatten */
  const anz = 22;
  for (let i = 0; i < anz; i++) {
    const t = (i + rnd() * 0.6) / anz, j = Math.min(FUSS.length - 2, Math.floor(t * (FUSS.length - 1))), tt = t * (FUSS.length - 1) - j;
    const a = FUSS[j], b = FUSS[j + 1], c = FELS_U[j + 1], d = FELS_U[j];
    const top = [a[0] + (b[0] - a[0]) * tt, a[1] + (b[1] - a[1]) * tt + 1], bot = [d[0] + (c[0] - d[0]) * tt, d[1] + (c[1] - d[1]) * tt];
    const w = 1.6 + rnd() * 2.4, lit = t < 0.45;
    const m = [(top[0] + bot[0]) / 2 + (rnd() - 0.5) * 2, (top[1] + bot[1]) / 2];
    k += `<path d="M${Pt(top)} L${Pt([m[0] - w * 0.4, m[1]])} L${Pt(bot)} L${Pt([bot[0] + w, bot[1] - 1])} L${Pt([m[0] + w * 0.8, m[1]])} L${Pt([top[0] + w * 0.7, top[1]])} Z" fill="${lit ? (i % 2 ? "#f3ede1" : "#e6ddcc") : (i % 2 ? "#b4a996" : "#9a8f7c")}" opacity=".9"/>`;
    k += `<path d="M${Pt([top[0] + w * 0.7, top[1]])} L${Pt([m[0] + w * 0.8, m[1]])} L${Pt([bot[0] + w, bot[1] - 1])}" stroke="${lit ? "#9e927e" : "#6d6352"}" stroke-width=".45" fill="none" opacity=".8"/>`;
  }
  /* Schlagschatten der Bauten auf den Fels (Sonne Südwest → nach rechts) */
  k += `<path d="${poly([C(12, -28, -4), C(38, -28, -4), C(38, -30, -16), C(14, -31, -22)])}" fill="#2a2f40" opacity=".2"/>`;
  S.teil({ id: "felsen", de: "der Felsen", syl: "FEL-sen", it: "la roccia", itSyl: "ROC-cia", en: "rock", x: 0, y: 0, kunst: k,
    tipp: "Das Schloss steht auf einem Felsgrat. Die Kalkwände fallen fast senkrecht zur Pöllatschlucht ab." });
}

/* =====================================================================
   5 — DER WALD (am Schlossberg unter den Felswänden und am Westhang)
   ===================================================================== */
{
  /* a) Schlossberg: von der Felskante hinab bis an den Bach */
  const sohle = SOHLE.map(([x, y], i) => [x + (i % 2 ? 2 : -2), y + (i % 3) * 1.6]);
  const BERG = [...WALDKANTE.map(([x, y]) => [x, y - 2]), [318, 172], [306, 160], [294, 168], ...sohle.slice().reverse(), [68, 214], [70, 196]];
  let k = waldflaeche("bergclip", BERG, 2.6, 30, "#5c4a26", 0.72, HERBST, -6);
  k += saum(WALDKANTE.map(([x, y]) => [x, y + 1]), 2.6, 4.4, 0.42);
  k += saum([[FELS_U[0][0] - 1, FELS_U[0][1] - 4], [70, 196], [66, 212], [70, 226]], 2.8, 3.4, 0.55);
  /* Rippen (Licht von links) und Rinnen (Schatten) laufen den Hang hinab */
  for (const [x0, y0, x1, y1, hell] of [[100, 186, 92, 222, 1], [128, 172, 118, 230, 0], [150, 168, 146, 238, 1], [176, 168, 176, 240, 0], [206, 168, 210, 240, 1], [236, 166, 246, 228, 0], [262, 160, 272, 210, 1]]) {
    k += `<path d="M${x0} ${y0} Q${(x0 + x1) / 2 + (hell ? -4 : 4)} ${(y0 + y1) / 2} ${x1} ${y1} L${x1 + (hell ? 7 : 5)} ${y1} Q${(x0 + x1) / 2 + (hell ? 3 : 9)} ${(y0 + y1) / 2} ${x0 + 4} ${y0} Z" fill="${hell ? "#ffe6a8" : "#141008"}" opacity="${hell ? 0.12 : 0.22}"/>`;
  }
  /* einzelne Fichtenspitzen und Felsköpfe im Hang */
  for (let i = 0; i < 34; i++) { const x = 92 + rnd() * 200, y = 178 + rnd() * 56; if (!drin(x, y, BERG)) continue; const t = 1.4 + rnd() * 1.2; k += `<path d="M${r(x - t)} ${r(y + t)} L${r(x)} ${r(y - t * 3)} L${r(x + t)} ${r(y + t)} Z" fill="${NADEL[i % 4]}"/><path d="M${r(x - t * 0.5)} ${r(y - t)} L${r(x)} ${r(y - t * 3)} L${r(x)} ${r(y + t * 0.6)} Z" fill="#8aa874" opacity=".35"/>`; }
  for (const [x, y] of [[118, 214], [168, 220], [226, 206], [252, 190]]) k += `<path d="M${x} ${y} l3 -4 l5 1 l2 5 l-4 3 Z" fill="#c9bfab"/><path d="M${x + 3} ${y - 4} l5 1 l2 5 l-3 -1 Z" fill="#8a806c"/>`;
  k += `<path d="${poly(BERG)}" fill="${S.lg("bergtiefe", [[0, "#ffe9b8", 0.08], [0.45, "#000", 0], [1, "#080a12", 0.5]])}"/>`;
  k += `<path d="${poly(BERG)}" fill="${S.lg("bergseite", [[0, "#ffd99a", 0.1], [0.5, "#000", 0], [1, "#101420", 0.22]], 0, 0, 1, 0)}"/>`;
  /* b) Westhang links (60–150 m): tiefer als wir, die Wipfel großer Bäume ragen herauf.
        Er schaut nach Nordosten und liegt am Nachmittag im Schatten. */
  const WEST = [[0, 142], [14, 144], [30, 150], [46, 160], [60, 174], [70, 192], [74, 214], [70, 240], [64, 260], [0, 260]];
  k += waldflaeche("westclip", WEST, 2.2, 14, "#3e3a22", 0.7, HERBST, 14);
  k += `<path d="${poly(WEST)}" fill="${S.lg("westschatten", [[0, "#1e2a3a", 0.1], [0.5, "#1e2a3a", 0.28], [1, "#0e1018", 0.45]])}"/>`;
  const baeume = [[12, 120, "f", 34, 8], [32, 132, "b", 20, 14], [52, 140, "f", 30, 8], [16, 150, "b", 22, 15], [66, 156, "l", 18, 9], [26, 162, "f", 36, 10], [48, 172, "b", 20, 14], [14, 186, "a", 18, 13], [62, 190, "f", 30, 9], [34, 196, "b", 22, 15]];
  for (const [x, y, art, h, w] of baeume) {
    if (art === "f") k += fichteGross(x, y, h, w);
    else k += textkrone(x, y + h * 0.35, w, h * 0.42, 7, true);
  }
  k += `<path d="${poly(WEST)}" fill="${S.lg("westschatten2", [[0, "#1e2a3a", 0], [0.4, "#1e2a3a", 0.12], [1, "#0e1018", 0.35]])}"/>`;
  S.teil({ id: "wald", de: "der Wald", syl: "WALD", it: "il bosco", itSyl: "BO-sco", en: "forest", x: 0, y: 0, kunst: k,
    tipp: "Im Herbst färben sich Buchen und Lärchen gold. Die Fichten bleiben dunkelgrün." });
}

/* =====================================================================
   6 — DAS SCHLOSS NEUSCHWANSTEIN (Palas, Treppentürme, Kemenate,
       Ritterhaus, Hof) — Lupe: der Palas, das Dach, der Turm, das
       Fenster, die Kemenate, der Hof
   ===================================================================== */
/* Wand zwischen (u0,v0) und (u1,v1): Punkt (s Meter entlang, z) */
const wandFn = (u0, v0, u1, v1) => { const L = Math.hypot(u1 - u0, v1 - v0); return (s, z) => C(u0 + (u1 - u0) * s / L, v0 + (v1 - v0) * s / L, z); };
const wandFl = (W, s0, s1, z0, z1) => poly([W(s0, z0), W(s1, z0), W(s1, z1), W(s0, z1)]);
/* Rundbogenfenster auf einer Wand, n Öffnungen mit Säulchen, helles Gewände */
function bogen(W, s0, z0, w, h, n = 1, glas = GLAS, gewaende = "#fffaf0") {
  let g = "";
  const rand = 0.35;
  const arch = (a, b, zb, zt, f, extra = "") => {
    const bl = W(a, zb), br = W(b, zb), tl = W(a, zt), tr = W(b, zt), ap = W((a + b) / 2, zt + (b - a) / 2), cl = W(a, zt + (b - a) / 2), cr = W(b, zt + (b - a) / 2);
    return `<path d="M${Pt(bl)} L${Pt(tl)} Q${Pt(cl)} ${Pt(ap)} Q${Pt(cr)} ${Pt(tr)} L${Pt(br)} Z" fill="${f}"${extra}/>`;
  };
  g += arch(s0 - rand, s0 + w + rand, z0 - rand, z0 + h - w / 2, gewaende);
  const fw = (w - (n - 1) * 0.3) / n;
  for (let i = 0; i < n; i++) { const a = s0 + i * (fw + 0.3); g += arch(a, a + fw, z0, z0 + h - fw / 2 - (n > 1 ? 0.1 : 0) + (n > 1 ? fw / 2 - w / 2 + 0.1 : 0), glas); }
  return g;
}
/* runder oder achteckiger Turm mit spitzem Schieferhelm */
function rundturm(u, v, rad, z0, z1, helm, opt = {}) {
  const k = k1(u, v), b = C(u, v, z0), t = C(u, v, z1), sp = C(u, v, z1 + helm), w = rad * k;
  let g = `<rect x="${r(b[0] - w)}" y="${r(t[1])}" width="${r(2 * w)}" height="${r(b[1] - t[1])}" fill="${opt.ziegel ? ZIEGEL_RUND : KALK_RUND}"/>`;
  if (opt.acht) for (const q of [-0.5, 0.5]) g += `<line x1="${r(b[0] + q * w)}" y1="${r(t[1])}" x2="${r(b[0] + q * w)}" y2="${r(b[1])}" stroke="#000" stroke-width=".18" opacity=".18"/>`;
  if (opt.fenster) for (const [zf, dx] of opt.fenster) { const p = C(u, v, zf), fw = 0.55 * k, fh = 1.6 * k; g += `<path d="M${r(p[0] + dx * w - fw / 2)} ${r(p[1])} v${r(-fh + fw / 2)} a${r(fw / 2)} ${r(fw / 2)} 0 0 1 ${r(fw)} 0 v${r(fh - fw / 2)} Z" fill="${GLAS_S}"/>`; }
  /* Gesims / Konsolkranz unter dem Helm */
  g += `<rect x="${r(t[0] - w - 0.5)}" y="${r(t[1] - 0.6)}" width="${r(2 * w + 1)}" height="${r(Math.max(0.8, 0.7 * k))}" fill="${opt.ziegel ? "#e9d7bd" : "#f2ecdf"}"/>`;
  if (opt.zinnen) for (let x = t[0] - w - 0.4; x < t[0] + w; x += 1.3) g += `<rect x="${r(x)}" y="${r(t[1] - 1.8)}" width=".7" height="1.3" fill="${opt.ziegel ? "#c46848" : "#f6efe2"}"/>`;
  g += `<path d="M${r(t[0] - w - 0.6)} ${r(t[1] - 0.5)} Q${r(t[0] - w * 0.25)} ${r(t[1] - (t[1] - sp[1]) * 0.45)} ${r(sp[0])} ${r(sp[1])} Q${r(t[0] + w * 0.25)} ${r(t[1] - (t[1] - sp[1]) * 0.45)} ${r(t[0] + w + 0.6)} ${r(t[1] - 0.5)} Z" fill="${SCHIEFER_RUND}"/>`;
  g += `<path d="M${r(t[0] - w - 0.2)} ${r(t[1] - 0.8)} Q${r(t[0] - w * 0.4)} ${r(t[1] - (t[1] - sp[1]) * 0.45)} ${r(sp[0] - 0.1)} ${r(sp[1] + 0.8)} L${r(t[0] - w * 0.15)} ${r(t[1] - 0.8)} Z" fill="#c6ccd4" opacity=".4"/>`;
  g += `<line x1="${r(sp[0])}" y1="${r(sp[1])}" x2="${r(sp[0])}" y2="${r(sp[1] - 2.4)}" stroke="#9a7a2a" stroke-width=".3"/><circle cx="${r(sp[0])}" cy="${r(sp[1] - 1.2)}" r=".45" fill="${GOLD}"/>`;
  return g;
}
/* Satteldach: Traufe (u0,v0)–(u1,v1) auf zt, First parallel, versetzt um (du,dv) auf zf */
const dachFl = (a, b, zt, du, dv, zf) => poly([C(a[0], a[1], zt), C(b[0], b[1], zt), C(b[0] + du, b[1] + dv, zf), C(a[0] + du, a[1] + dv, zf)]);

const SCHLOSS_UNTER = [];
let SCHLOSS = "";
{
  let k = "";
  /* ---------- PALAS ---------- */
  const PS = wandFn(-12, -26, 12, -26);   /* Südseite (Giebelseite, zur Sonne) */
  const PO1 = wandFn(12, -26, 12, 0), PO2 = wandFn(12, 0, 13.6, 26);   /* Hofseite, zwei Baukörper im Knick */
  const ZT = 30, ZF = 51;
  /* Hofseite (im Schatten) */
  k += `<path d="${wandFl(PO1, 0, 26, -2, ZT)}" fill="${KALK_OST}"/><path d="${wandFl(PO2, 0, 26.05, -2, ZT - 0.4)}" fill="${S.lg("kalkost2", [[0, "#bfc1cb"], [1, "#a8acb8"]])}"/>`;
  k += `<path d="${wandFl(PO1, 0, 26, -2, ZT)}" fill="${QUADER}" opacity=".5"/>`;
  for (const z of [6.2, 12.4, 18.6, 24.2]) k += `<path d="M${Pt(PO1(0, z))} L${Pt(PO1(26, z))} L${Pt(PO2(26.05, z - 0.3))}" stroke="#9ea2ad" stroke-width=".45" fill="none"/>`;
  /* Fenster der Hofseite: unten gekuppelt, 3. Stock dreiteilig, 4. Stock: Sängersaal-Arkaden */
  for (const [W, s0, n] of [[PO1, 3, 4], [PO2, 2, 4]]) {
    for (let i = 0; i < n; i++) {
      const s = s0 + i * 5.8 + (i === 2 ? 0.6 : 0);
      k += bogen(W, s, 7.4, 2.4, 3.6, 2, GLAS, "#d9dbe2") + bogen(W, s, 13.6, 2.4, 3.8, 2, GLAS, "#d9dbe2") + bogen(W, s - 0.3, 19.4, 3, 3.8, 3, GLAS, "#d9dbe2");
    }
  }
  for (let i = 0; i < 9; i++) { const W = i < 5 ? PO1 : PO2, s = i < 5 ? 1.2 + i * 4.9 : 0.6 + (i - 5) * 6; k += bogen(W, s, 25.2, 3.6, 4.2, 3, GLAS, "#e3e5ea"); }
  /* Südseite mit Giebel (im Licht) */
  k += `<path d="${poly([PS(0, -12), PS(24, -4), PS(24, ZT), PS(0, ZT)])}" fill="${KALK_SUED}"/>`;
  k += `<path d="${poly([PS(0, ZT), PS(24, ZT), PS(12, ZF)])}" fill="${S.lg("giebel", [[0, "#fff8ea"], [1, "#efe4ce"]])}"/>`;
  k += `<path d="${poly([PS(0, -12), PS(24, -4), PS(24, ZT), PS(0, ZT)])}" fill="${QUADER}" opacity=".6"/>`;
  for (const z of [6.2, 12.4, 18.6, 24.2]) k += `<path d="M${Pt(PS(0, z))} L${Pt(PS(24, z))}" stroke="#ddd0b8" stroke-width=".5"/>`;
  /* Sockelgeschoss (Talseite) mit kleinen Fenstern */
  for (const s of [5, 11, 17]) k += bogen(PS, s, -6, 1.2, 2.4, 1, GLAS, "#f6efe0");
  k += bogen(PS, 3.2, 0.8, 2.2, 3.2, 2) + bogen(PS, 9.6, 0.8, 2.2, 3.2, 2) + bogen(PS, 18.2, 0.8, 2.2, 3.2, 2);
  k += bogen(PS, 3, 7.4, 2.6, 3.6, 2) + bogen(PS, 10.6, 7.4, 2.6, 3.6, 2) + bogen(PS, 18, 7.4, 2.6, 3.6, 2);
  k += bogen(PS, 2.8, 13.6, 2.8, 3.8, 2) + bogen(PS, 10.4, 13.6, 3.2, 3.8, 3) + bogen(PS, 18, 13.6, 2.8, 3.8, 2);
  /* Thronsaal (3./4. Stock im Westen): hohe Bogenfenster über zwei Geschosse */
  k += bogen(PS, 3.6, 19.6, 2.4, 9.2, 2) + bogen(PS, 10.6, 19.6, 2.8, 9.8, 2) + bogen(PS, 18, 19.6, 2.4, 9.2, 2);
  /* Giebel: Fensterchen und Ladeluke */
  k += bogen(PS, 9.6, 33.4, 4.8, 3.8, 3) + bogen(PS, 11, 40.6, 2, 3, 2);
  /* Dach: steile Schieferfläche zur Hofseite (Schatten), Ortgang am Südgiebel */
  k += `<path d="${dachFl([12, -26], [12, 0], ZT, -12, 0, ZF)}" fill="${SCHIEFER_OST}"/>`;
  k += `<path d="${poly([C(12, 0, ZT - 0.2), C(13.6, 26, ZT - 0.6), C(1.6, 26, ZF - 0.6), C(0, 0, ZF)])}" fill="${S.lg("schieferost2", [[0, "#56606c"], [1, "#3d4450"]])}"/>`;
  k += `<path d="M${Pt(C(0, -26, ZF))} L${Pt(C(0, 0, ZF))} L${Pt(C(1.6, 26, ZF - 0.6))}" stroke="#b0b8c2" stroke-width=".6" fill="none"/>`;
  k += `<path d="M${Pt(PS(0, ZT - 0.2))} L${Pt(PS(12, ZF + 0.2))} L${Pt(PS(24, ZT - 0.2))}" stroke="#ece4d4" stroke-width=".9" fill="none"/>`;
  /* Gauben (Zwerchhäuschen) auf der Hofseite und Schieferstreifen */
  for (const v of [-20, -12, -4, 6, 16]) {
    const a = C(12.6 - 3, v, 34), b = C(12.6 - 3, v + 2.4, 34), sp = C(12.6 - 3, v + 1.2, 37.2), u1 = C(12.6 - 3, v, 31.4), u2 = C(12.6 - 3, v + 2.4, 31.4);
    k += `<path d="${poly([u1, a, sp, b, u2])}" fill="#d0d2d9"/><path d="${poly([C(9.6, v + 0.6, 31.8), C(9.6, v + 1.8, 31.8), C(9.6, v + 1.8, 33.6), C(9.6, v + 0.6, 33.6)])}" fill="${GLAS_S}"/>`;
  }
  for (let i = 1; i < 6; i++) { const zz = ZT + (ZF - ZT) * i / 6, du = -12 * i / 6; k += `<path d="M${Pt(C(12 + du, -26, zz))} L${Pt(C(12 + du, 0, zz))}" stroke="#3b424c" stroke-width=".18" opacity=".6"/>`; }
  /* Kamine */
  for (const v of [-8, 12]) { const a = C(4, v, 44), b = C(4, v, 50); const w = 0.9 * k1(4, v); k += `<rect x="${r(a[0] - w)}" y="${r(b[1])}" width="${r(2 * w)}" height="${r(a[1] - b[1])}" fill="#e8e2d6"/><rect x="${r(a[0] - w - 0.3)}" y="${r(b[1] - 0.6)}" width="${r(2 * w + 0.6)}" height=".8" fill="#cfc8b8"/>`; }
  /* Ecktürmchen am Südgiebel (achteckig, aus Konsolen) und an der Nordostecke */
  k += rundturm(13.6, 26, 1.9, 18, 38, 10, { acht: true, fenster: [[30, 0]] });
  for (const [u, v] of [[-12, -26], [12, -26]]) {
    const c0 = C(u, v, 16);
    k += `<path d="M${r(c0[0] - 1.9 * k1(u, v))} ${r(c0[1])} Q${r(c0[0])} ${r(c0[1] + 4.2)} ${r(c0[0] + 1.9 * k1(u, v))} ${r(c0[1])} Z" fill="${u < 0 ? "#efe6d4" : "#c9c4ba"}"/>`;
    k += rundturm(u, v, 1.9, 16, 39, 11, { acht: true, fenster: [[22, 0], [31, 0]] });
  }
  SCHLOSS_UNTER.push({ id: "palas", de: "der Palas", syl: "PA-las", it: "il palazzo", itSyl: "pa-LAZ-zo", en: "great hall", pts: [PS(0, -12), PS(24, -4), PS(24, 18.6), PS(0, 18.6)],
    tipp: "Der Palas ist das Hauptgebäude: fünf Stockwerke, außen heller Kalkstein." });
  SCHLOSS_UNTER.push({ id: "dach", de: "das Dach", syl: "DACH", it: "il tetto", itSyl: "TET-to", en: "roof", pts: [C(12, -24, ZT + 1), C(13.4, 24, ZT + 1), C(2, 24, ZF - 1), C(1, -24, ZF - 1)],
    tipp: "Das steile Dach ist mit grauem Schiefer gedeckt." });
  SCHLOSS_UNTER.push({ id: "fenster", de: "das Fenster", syl: "FENS-ter", it: "la finestra", itSyl: "fi-NE-stra", en: "window", pts: [PS(3.2, 19.2), PS(21, 19.2), PS(21, 30.4), PS(3.2, 30.4)],
    tipp: "Die hohen Rundbogenfenster mit kleinen Säulen sehen aus wie in einer Burg aus dem Mittelalter." });

  /* ---------- RITTERHAUS (Nordseite des oberen Hofs) mit Galerie ---------- */
  {
    const RS = wandFn(16, 12, 46, 12), RO = wandFn(46, 12, 46, 24);
    k += `<path d="${wandFl(RS, 0, 30, 0, 16)}" fill="#c4c5cd"/><path d="${wandFl(RO, 0, 12, 0, 16)}" fill="#adb0bb"/>`;
    k += `<path d="${poly([C(46, 12, 16), C(46, 24, 16), C(46, 18, 23)])}" fill="#b4b7c1"/>`;
    k += `<path d="${dachFl([16, 12], [46, 12], 16, 0, 6, 23)}" fill="${SCHIEFER_SUED}"/>`;
    for (let i = 0; i < 8; i++) k += bogen(RS, 2 + i * 3.6, 0.6, 2.2, 3.6, 1, "#8f94a0", "#d6d8de");
    for (let i = 0; i < 6; i++) k += bogen(RS, 3 + i * 4.6, 8, 1.8, 2.8, 2, GLAS, "#d6d8de");
    /* Schatten des Palas fällt über Hof und Ritterhaus (Sonne Südwest) */
    k += `<path d="${poly([C(13, 12, 0), C(13, 12, 16), C(24, 12, 16), C(18, 12, 0)])}" fill="#2a3040" opacity=".25"/>`;
  }
  /* ---------- OBERER HOF (von oben leicht einsehbar) ---------- */
  {
    const hof = [C(12, -14, 0), C(46, -14, 0), C(46, 12, 0), C(13.4, 12, 0)];
    k += `<path d="${poly(hof)}" fill="${S.lg("hof", [[0, "#cfc4ae"], [1, "#b7ab94"]])}"/>`;
    k += `<path d="${poly([C(12.4, -14, 0), C(22, -14, 0), C(26, 12, 0), C(13.4, 12, 0)])}" fill="#2a3040" opacity=".22"/>`;
    SCHLOSS_UNTER.push({ id: "hof", de: "der Hof", syl: "HOF", it: "il cortile", itSyl: "cor-TI-le", en: "courtyard", pts: [C(24, -14, 0), C(46, -14, 0), C(46, 12, 0), C(26, 12, 0)], dick: 3,
      tipp: "Um den Hof stehen Palas, Kemenate, Ritterhaus und Torbau." });
  }
  /* ---------- TREPPENTÜRME vor der Hofseite: südlicher und NORDTURM ---------- */
  k += rundturm(16, -5, 2.7, 0, 40, 9, { acht: true, fenster: [[8, -0.3], [15, 0.2], [22, -0.2], [29, 0.3], [35, 0]] });
  {
    const u = 16.5, v = 5, rad = 3.6, kk = k1(u, v);
    k += rundturm(u, v, rad, 0, 58, 13, { fenster: [[6, 0.3], [12, -0.2], [18, 0.25], [24, -0.25], [30, 0.2], [36, -0.2], [42, 0.25], [48, 0]] });
    /* Laternengeschoss mit Bogenfenstern und Konsolfries unter dem Helm */
    const t = C(u, v, 58), w = rad * kk;
    for (let i = 0; i < 4; i++) { const x = t[0] - w * 0.75 + i * w * 0.5; k += `<path d="M${r(x - 0.55)} ${r(t[1] + 4.4)} v-2.6 a.55 .55 0 0 1 1.1 0 v2.6 Z" fill="${GLAS_S}"/>`; }
    for (let i = 0; i < 7; i++) k += `<path d="M${r(t[0] - w + i * w / 3)} ${r(t[1] + 0.3)} q.4 .9 .8 0" fill="#cfc8b8"/>`;
    SCHLOSS_UNTER.push({ id: "turm", de: "der Turm", syl: "TURM", it: "la torre", itSyl: "TOR-re", en: "tower", pts: [[t[0] - w - 1, C(u, v, 71)[1] - 1], [t[0] + w + 1, C(u, v, 71)[1] - 1], [t[0] + w + 1, C(u, v, 24)[1]], [t[0] - w - 1, C(u, v, 24)[1]]],
      tipp: "Der Nordturm ist über 65 Meter hoch – der höchste Turm des Schlosses. Innen führt eine Wendeltreppe hinauf." });
  }
  /* Schatten des Nordturms fällt nach Nordosten über den Hof auf das Ritterhaus */
  k += `<path d="${poly([C(18, 7, 0), C(14.5, 3, 0), C(30, 14, 0), C(34, 12, 0)])}" fill="#2a3040" opacity=".25"/><path d="${poly([C(30, 12, 0), C(34, 12, 0), C(34, 12, 14), C(30, 12, 14)])}" fill="#2a3040" opacity=".2"/>`;
  /* ---------- KEMENATE (Südseite des oberen Hofs) ---------- */
  {
    const KS = wandFn(12, -26, 38, -26), KO = wandFn(38, -26, 38, -14);
    k += `<path d="${wandFl(KS, 0, 26, -4, 18)}" fill="${KALK_SUED}"/><path d="${wandFl(KS, 0, 26, -4, 18)}" fill="${QUADER}" opacity=".55"/>`;
    k += `<path d="${wandFl(KO, 0, 12, -4, 18)}" fill="${KALK_OST}"/>`;
    k += `<path d="${poly([C(38, -26, 18), C(38, -14, 18), C(38, -20, 26)])}" fill="#bcbec8"/>`;
    k += `<path d="${dachFl([12, -26], [38, -26], 18, 0, 6, 26)}" fill="${SCHIEFER_SUED}"/>`;
    k += `<path d="M${Pt(C(12, -20, 26))} L${Pt(C(38, -20, 26))}" stroke="#b6bec8" stroke-width=".5"/>`;
    for (const z of [5.4, 11.6]) k += `<path d="M${Pt(KS(0, z))} L${Pt(KS(26, z))}" stroke="#ddd0b8" stroke-width=".45"/>`;
    for (const s of [3, 9, 15.4, 21]) k += bogen(KS, s, 0.6, 2.4, 3.4, 2) + bogen(KS, s, 6.8, 2.4, 3.6, 2) + bogen(KS, s - 0.2, 12.8, 2.8, 3.8, 3);
    for (const s of [7, 17]) { const a = C(12 + s, -25.4, 21.8), b = C(12 + s + 2.2, -25.4, 21.8), sp = C(12 + s + 1.1, -25.4, 24), u1 = C(12 + s, -25.4, 19.6), u2 = C(12 + s + 2.2, -25.4, 19.6); k += `<path d="${poly([u1, a, sp, b, u2])}" fill="#f3ead8"/><path d="${poly([C(12 + s + 0.6, -25.6, 19.9), C(12 + s + 1.6, -25.6, 19.9), C(12 + s + 1.6, -25.6, 21.4), C(12 + s + 0.6, -25.6, 21.4)])}" fill="${GLAS_S}"/>`; }
    /* schlanker Rundturm an der Südostecke */
    k += rundturm(38.6, -26.6, 1.9, -2, 27, 11, { fenster: [[4, 0], [10, 0], [16, 0], [22, 0]] });
    SCHLOSS_UNTER.push({ id: "kemenate", de: "die Kemenate", syl: "ke-me-NA-te", it: "la camera delle dame", itSyl: "CA-me-ra DEL-le DA-me", en: "bower", pts: [KS(0, -4), KS(26, -4), KS(26, 24), KS(0, 24)],
      tipp: "Die Kemenate war als Haus für die Damen gedacht. Sie hat drei Geschosse." });
  }
  SCHLOSS = k;
}
/* Lupen-Flächen = die gezeichneten Formen (Vierecke aus den Kamerapunkten) */
const vierFl = (pts, ref) => `<path class="bw-flaeche" d="M${pts.map((p) => `${r(p[0] - ref[0])} ${r(p[1] - ref[1])}`).join(" L")} Z" fill="rgba(255,255,255,0.001)"/>`;
{
  const unter = SCHLOSS_UNTER.map((u) => {
    let pts = u.pts;
    if (u.dick) { const ys = pts.map((p) => p[1]), m = (Math.min(...ys) + Math.max(...ys)) / 2; pts = pts.map(([x, y]) => [x, m + (y - m) * 1 + (y < m ? -u.dick : u.dick)]); }
    const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length, cy = Math.max(...pts.map((p) => p[1]));
    return { id: u.id, de: u.de, syl: u.syl, it: u.it, itSyl: u.itSyl, en: u.en, tipp: u.tipp, x: cx, y: cy, kunst: vierFl(pts, [cx, cy]) };
  });
  S.teil({ id: "neuschwanstein", de: "das Schloss Neuschwanstein", syl: "SCHLOSS neu-SCHWAN-stein", it: "il castello di Neuschwanstein", itSyl: "ca-STEL-lo di neu-SCHWAN-stein", en: "Neuschwanstein Castle",
    x: 0, y: 0, kunst: SCHLOSS, tipp: "König Ludwig II. ließ das Schloss ab 1869 bauen – wie eine Ritterburg aus dem Märchen.",
    zoom: { x: 102, y: 4, w: 150, h: 100 }, unter });
}

/* =====================================================================
   7 — DER VIERECKTURM (45 m, Plattform mit Rundtürmchen) und die Galerie
   ===================================================================== */
{
  let k = "";
  /* Galerie mit Blendarkaden zwischen Viereckturm und Torbau (Nordseite) */
  const G = wandFn(54, 12, 98, 13);
  k += `<path d="${wandFl(G, 0, 44, -4, 5)}" fill="#c2c4cc"/>`;
  for (let i = 0; i < 12; i++) k += bogen(G, 1 + i * 3.6, -3, 2.2, 5, 1, "#8f94a0", "#d6d8de");
  k += `<path d="${poly([G(0, 5), G(44, 5), G(44, 6), G(0, 6)])}" fill="${SCHIEFER_SUED}"/>`;
  /* unterer Hof */
  k += `<path d="${poly([C(46, -22, -4), C(98, -20, -4), C(98, 12, -4), C(54, 12, -4)])}" fill="${S.lg("hof2", [[0, "#cbbfa8"], [1, "#b2a68e"]])}"/>`;
  /* Viereckturm */
  const VS = wandFn(46, 4, 54, 4), VO = wandFn(54, 4, 54, 12);
  k += `<path d="${wandFl(VS, 0, 8, -4, 40)}" fill="${KALK_SUED}"/><path d="${wandFl(VS, 0, 8, -4, 40)}" fill="${QUADER}" opacity=".55"/>`;
  k += `<path d="${wandFl(VO, 0, 8, -4, 40)}" fill="${KALK_OST}"/>`;
  for (const z of [4, 11, 18, 25, 32]) k += bogen(VS, 2.6, z, 2.8, 3.8, 2) + bogen(VO, 2.6, z, 2.6, 3.6, 2, GLAS, "#d6d8de");
  /* Konsolfries und Zinnenkranz der Plattform */
  k += `<path d="${poly([VS(-0.5, 40), VS(8.5, 40), VO(8.5, 40), VO(8.5, 41.4), VS(8.5, 41.4), VS(-0.5, 41.4)])}" fill="#f4ede0"/>`;
  for (let s = -0.4; s < 8.4; s += 1.4) k += `<path d="${poly([VS(s, 41.4), VS(s + 0.8, 41.4), VS(s + 0.8, 42.8), VS(s, 42.8)])}" fill="#fbf4e6"/>`;
  for (let s = 0.4; s < 8.4; s += 1.4) k += `<path d="${poly([VO(s, 41.4), VO(s + 0.8, 41.4), VO(s + 0.8, 42.8), VO(s, 42.8)])}" fill="#c8cad2"/>`;
  k += rundturm(51.5, 8, 1.6, 41.4, 47, 7, { fenster: [[43.4, 0]] });
  /* Schatten des Turms nach Nordosten auf die Galerie */
  k += `<path d="${poly([C(54, 12, 5), C(62, 12.2, 5), C(60, 12.2, -4), C(54, 12, -4)])}" fill="#2a3040" opacity=".22"/>`;
  S.teil({ id: "viereckturm", de: "der Viereckturm", syl: "VIER-eck-turm", it: "la torre quadrata", itSyl: "TOR-re qua-DRA-ta", en: "square tower", x: 0, y: 0, kunst: k,
    tipp: "Der Viereckturm ist 45 Meter hoch. Oben ist eine Aussichtsplattform." });
}

/* =====================================================================
   8 — DIE MAUER (Ringmauer des unteren Hofs) und 9 — DAS TORHAUS
       (Torbau aus roten Ziegeln) — Lupe: das Tor
   ===================================================================== */
{
  /* Ringmauer mit Zinnen auf der Südseite */
  const M = wandFn(38, -27, 98, -23);
  let k = `<path d="${wandFl(M, 0, 60.1, -8, 2)}" fill="${KALK_SUED}"/><path d="${wandFl(M, 0, 60.1, -8, 2)}" fill="${QUADER}" opacity=".5"/>`;
  for (let s = 0.4; s < 60; s += 2.2) k += `<path d="${poly([M(s, 2), M(s + 1.2, 2), M(s + 1.2, 3.6), M(s, 3.6)])}" fill="#fbf4e6"/>`;
  for (const s of [12, 26, 40, 52]) k += `<path d="${poly([M(s, -3), M(s + 0.4, -3), M(s + 0.4, -0.6), M(s, -0.6)])}" fill="#4a4a50"/>`;
  S.teil({ id: "mauer", de: "die Mauer", syl: "MAU-er", it: "il muro di cinta", itSyl: "MU-ro di CIN-ta", en: "wall", x: 0, y: 0, kunst: k,
    tipp: "Die Mauer mit Zinnen umgibt den unteren Hof – wie bei einer echten Burg." });
}
{
  let k = "";
  const TS = wandFn(98, -22, 110, -22), TO = wandFn(110, -22, 110, 20);
  const ZT = 12, ZF = 20;
  /* Südgiebelseite (Licht) und Außenseite nach Osten (Schatten) */
  k += `<path d="${wandFl(TS, 0, 12, -10, ZT)}" fill="${ZIEGEL_LICHT}"/><path d="${poly([TS(0, ZT), TS(12, ZT), TS(6, ZF)])}" fill="${ZIEGEL_LICHT}"/>`;
  k += `<path d="${wandFl(TS, 0, 12, -10, ZT)}" fill="${ZV}"/><path d="${poly([TS(0, ZT), TS(12, ZT), TS(6, ZF)])}" fill="${ZV}"/>`;
  k += `<path d="${wandFl(TO, 0, 42, -10, ZT)}" fill="${ZIEGEL_SCHATTEN}"/><path d="${wandFl(TO, 0, 42, -10, ZT)}" fill="${ZV}" opacity=".6"/>`;
  /* Kalkstein-Bänder und Gewände */
  for (const z of [-2.6, 4.6]) k += `<path d="M${Pt(TS(0, z))} L${Pt(TS(12, z))} L${Pt(TO(42, z))}" stroke="#ead8b8" stroke-width=".6" fill="none"/>`;
  for (const s of [3, 8]) k += bogen(TS, s, -1.4, 1.8, 3.2, 1, GLAS, "#f2e2c6") + bogen(TS, s, 5.8, 1.8, 3.6, 1, GLAS, "#f2e2c6");
  k += bogen(TS, 4.8, 13.2, 2.4, 2.4, 2, GLAS, "#f2e2c6");
  for (const s of [3, 9, 30, 36]) k += bogen(TO, s, 5.8, 1.8, 3.4, 1, GLAS_S, "#b89c84");
  /* Dach (Ostseite, Schatten) mit Gauben */
  k += `<path d="${dachFl([110, -22], [110, 20], ZT, -6, 0, ZF)}" fill="${SCHIEFER_OST}"/>`;
  k += `<path d="M${Pt(C(104, -22, ZF))} L${Pt(C(104, 20, ZF))}" stroke="#a9b2bc" stroke-width=".5"/>`;
  k += `<path d="M${Pt(TS(0, ZT - 0.2))} L${Pt(TS(6, ZF + 0.2))} L${Pt(TS(12, ZT - 0.2))}" stroke="#e9d4b4" stroke-width=".7" fill="none"/>`;
  for (const v of [-14, 12]) k += `<path d="${poly([C(108.4, v, 13), C(108.4, v, 15.4), C(108.4, v + 1, 16.6), C(108.4, v + 2, 15.4), C(108.4, v + 2, 13)])}" fill="#9a4a36"/>`;
  /* DAS TOR: Rundbogendurchfahrt zwischen den Flankiertürmen, helle Kalkstein-Gewände */
  const tor = [];
  {
    const a = 18.8, b = 23.2, z0 = -10, zk = -4.6;
    const rahmen = [TO(a - 0.9, z0), TO(a - 0.9, zk), TO(a - 0.9, zk + 3.1), TO((a + b) / 2, zk + 3.1), TO(b + 0.9, zk + 3.1), TO(b + 0.9, zk), TO(b + 0.9, z0)];
    k += `<path d="M${Pt(rahmen[0])} L${Pt(rahmen[1])} Q${Pt(rahmen[2])} ${Pt(rahmen[3])} Q${Pt(rahmen[4])} ${Pt(rahmen[5])} L${Pt(rahmen[6])} Z" fill="#e7d7bb"/>`;
    const o = [TO(a, z0), TO(a, zk), TO(a, zk + 2.2), TO((a + b) / 2, zk + 2.2), TO(b, zk + 2.2), TO(b, zk), TO(b, z0)];
    k += `<path d="M${Pt(o[0])} L${Pt(o[1])} Q${Pt(o[2])} ${Pt(o[3])} Q${Pt(o[4])} ${Pt(o[5])} L${Pt(o[6])} Z" fill="${S.lg("torinnen", [[0, "#2a2422"], [1, "#4a3e34"]])}"/>`;
    k += `<path d="M${Pt(TO(a + 0.2, z0))} L${Pt(TO(a + 0.2, zk))} L${Pt(TO(b - 0.3, zk))} L${Pt(TO(b - 0.3, z0))} Z" fill="#c9b48e" opacity=".25"/>`;
    k += bogen(TO, 18.6, 1.4, 4.8, 3.6, 3, GLAS_S, "#e7d7bb");
    tor.push(...rahmen);
  }
  /* Flankiertürme beidseits des Tors (rund, mit Zinnenkranz und Helm) */
  k += rundturm(111.4, 4.8, 2.3, -10, 17, 9, { ziegel: true, zinnen: true, fenster: [[-4, 0], [3, 0], [9, 0]] });
  k += rundturm(111.4, -8.6, 2.4, -10, 17, 9, { ziegel: true, zinnen: true, fenster: [[-4, 0], [3, 0], [9, 0]] });
  /* Schlagschatten des Torbaus nach Nordosten auf den Hang */
  const xs = tor.map((p) => p[0]), ys = tor.map((p) => p[1]);
  const tx = (Math.min(...xs) + Math.max(...xs)) / 2, ty = Math.max(...ys);
  S.teil({ id: "torhaus", de: "das Torhaus", syl: "TOR-haus", it: "l'edificio d'ingresso", itSyl: "e-di-FI-cio d'in-GRES-so", en: "gatehouse", x: 0, y: 0, kunst: k,
    tipp: "Das Torhaus ist außen aus roten Ziegeln. Durch sein Tor kommen alle Besucher ins Schloss.",
    zoom: { x: r(tx - 33), y: r(ty - 44), w: 66, h: 44 },
    unter: [
      { id: "tor", de: "das Tor", syl: "TOR", it: "il portone", itSyl: "por-TO-ne", en: "gate", x: tx, y: ty, kunst: vierFl([tor[0], tor[2], tor[4], tor[6]], [tx, ty]),
        tipp: "Durch das große Tor zwischen den beiden Türmen betritt man das Schloss." },
    ] });
}

/* =====================================================================
   10 — DIE KUTSCHE auf der Zufahrt unter dem Torbau (Lupe: das Pferd)
   ===================================================================== */
const STRASSE = [[112, -4, -10], [122, -10, -12], [132, -18, -15], [140, -30, -19], [146, -44, -24]].map(([u, v, z]) => C(u, v, z));
{
  /* Zufahrt als Schneise im Wald (Straße mit Randbäumen) */
  let k = `<path d="M${STRASSE.map(Pt).join(" L")}" stroke="#d6c9ad" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
  k += `<path d="M${STRASSE.map(Pt).join(" L")}" stroke="#a89878" stroke-width=".4" fill="none" transform="translate(0 1)"/>`;
  const [x, y] = C(130, -16, -14.6), s = k1(130, -16);   /* ≈ 1,9 je Meter */
  let g = schatten(0, 0.2, 5.4 * s, 0.5 * s, 0.3);
  const pferd = (dx, f) => {
    let p = "";
    for (const [lx, w] of [[-0.6, -0.08], [-0.35, 0.06], [0.55, -0.05], [0.8, 0.08]]) p += `<path d="M${r((dx + lx) * s)} ${r(-1.1 * s)} L${r((dx + lx + w) * s)} ${r(-0.55 * s)} L${r((dx + lx) * s)} 0" stroke="${f}" stroke-width="${r(0.16 * s)}" fill="none"/>`;
    p += `<ellipse cx="${r(dx * s)}" cy="${r(-1.35 * s)}" rx="${r(0.95 * s)}" ry="${r(0.42 * s)}" fill="${f}"/>`;
    p += `<path d="M${r((dx - 0.6) * s)} ${r(-1.6 * s)} L${r((dx - 1.05) * s)} ${r(-2.35 * s)} L${r((dx - 0.8) * s)} ${r(-2.5 * s)} L${r((dx - 0.3) * s)} ${r(-1.75 * s)} Z" fill="${f}"/>`;
    p += `<path d="M${r((dx - 1.05) * s)} ${r(-2.35 * s)} L${r((dx - 1.7) * s)} ${r(-2.1 * s)} L${r((dx - 1.65) * s)} ${r(-1.95 * s)} L${r((dx - 1.15) * s)} ${r(-2.05 * s)} Z" fill="${f}"/>`;
    p += `<path d="M${r((dx - 0.82) * s)} ${r(-2.5 * s)} L${r((dx - 0.3) * s)} ${r(-1.72 * s)}" stroke="#f3e6c4" stroke-width="${r(0.15 * s)}"/>`;
    p += `<path d="M${r((dx + 0.92) * s)} ${r(-1.5 * s)} Q${r((dx + 1.2) * s)} ${r(-1.2 * s)} ${r((dx + 1.1) * s)} ${r(-0.65 * s)}" stroke="#f3e6c4" stroke-width="${r(0.17 * s)}" fill="none"/>`;
    return p;
  };
  g += `<g transform="translate(${r(0.45 * s)} ${r(-0.35 * s)})" opacity=".95">${pferd(-2.4, "#8a4f22")}</g>` + pferd(-2.4, "#b9743a");
  g += `<path d="M${r(-1.4 * s)} ${r(-1.4 * s)} L${r(0.3 * s)} ${r(-1.3 * s)}" stroke="#3a2a1c" stroke-width="${r(0.12 * s)}"/>`;
  g += `<path d="M${r(0.3 * s)} ${r(-0.7 * s)} L${r(2.8 * s)} ${r(-0.7 * s)} L${r(2.9 * s)} ${r(-1.7 * s)} L${r(2.3 * s)} ${r(-1.8 * s)} L${r(2.3 * s)} ${r(-1.3 * s)} L${r(1.1 * s)} ${r(-1.3 * s)} L${r(0.9 * s)} ${r(-1.7 * s)} L${r(0.4 * s)} ${r(-1.6 * s)} Z" fill="#23262b"/>`;
  g += `<path d="M${r(2.2 * s)} ${r(-1.8 * s)} Q${r(2.7 * s)} ${r(-3 * s)} ${r(3.3 * s)} ${r(-2.1 * s)} L${r(2.9 * s)} ${r(-1.7 * s)} Z" fill="#3a3f46"/>`;
  g += `<circle cx="${r(0.9 * s)}" cy="${r(-0.4 * s)}" r="${r(0.4 * s)}" fill="none" stroke="#d8a830" stroke-width="${r(0.12 * s)}"/><circle cx="${r(2.4 * s)}" cy="${r(-0.5 * s)}" r="${r(0.5 * s)}" fill="none" stroke="#d8a830" stroke-width="${r(0.12 * s)}"/>`;
  g += `<rect x="${r(0.6 * s)}" y="${r(-2.2 * s)}" width="${r(0.45 * s)}" height="${r(0.7 * s)}" fill="#2f4a2f"/><circle cx="${r(0.82 * s)}" cy="${r(-2.4 * s)}" r="${r(0.21 * s)}" fill="#e0b896"/><rect x="${r(0.57 * s)}" y="${r(-2.7 * s)}" width="${r(0.5 * s)}" height="${r(0.17 * s)}" fill="#1c1c1c"/>`;
  g += `<rect x="${r(1.5 * s)}" y="${r(-2 * s)}" width="${r(0.4 * s)}" height="${r(0.6 * s)}" fill="#b8473a"/><circle cx="${r(1.7 * s)}" cy="${r(-2.15 * s)}" r="${r(0.19 * s)}" fill="#e8c39e"/><rect x="${r(1.95 * s)}" y="${r(-1.95 * s)}" width="${r(0.35 * s)}" height="${r(0.55 * s)}" fill="#2f5f95"/><circle cx="${r(2.12 * s)}" cy="${r(-2.1 * s)}" r="${r(0.18 * s)}" fill="#d9a882"/>`;
  k += `<g transform="translate(${r(x)} ${r(y)})">${g}</g>`;
  S.teil({ oben: true, id: "kutsche", de: "die Kutsche", syl: "KUT-sche", it: "la carrozza", itSyl: "car-ROZ-za", en: "carriage", x: 0, y: 0, kunst: k + `<g transform="translate(${r(x)} ${r(y)})">${flaeche(-5.6 * s, -3 * s, 9.6 * s, 3.2 * s)}</g>`,
    tipp: "Pferdekutschen bringen Gäste vom Dorf Hohenschwangau hinauf zum Schloss.",
    zoom: { x: r(x - 21), y: r(y - 19), w: 42, h: 28 },
    unter: [
      { id: "pferd", de: "das Pferd", syl: "PFERD", it: "il cavallo", itSyl: "ca-VAL-lo", en: "horse", x: x - 2.4 * s, y, kunst: flaeche(-1.8 * s, -2.6 * s, 3 * s, 2.6 * s),
        tipp: "Zwei Pferde ziehen die Kutsche den steilen Weg hinauf." },
    ] });
}

/* =====================================================================
   11 — DIE SCHLUCHT (Pöllatschlucht: der tiefe Einschnitt vor dem Schloss)
   ===================================================================== */
{
  /* Sohle mit dem Bach, die sonnige Wand unter unserem Brückenkopf (rechts),
     Dunst aus der Tiefe (der Wasserfall liegt direkt unter der Brücke) */
  const TIEF = [...SOHLE, [292, 180], ...RAND.slice(2), [60, 262], [66, 240], [74, 214]];
  let k = `<path d="${poly([...SOHLE, ...RAND.slice(2), [60, 262], [66, 240]])}" fill="${S.lg("schluchtgrund", [[0, "#2e302c"], [1, "#121316"]])}"/>`;
  /* Bachlauf: weißes Wasser zwischen Blöcken, nach vorn hin breiter */
  const bach = [[86, 228], [110, 234], [136, 240], [164, 246], [190, 250], [214, 256], [232, 262]];
  k += `<path d="M${bach.map(Pt).join(" L")}" stroke="#4f6a6c" stroke-width="3.2" fill="none" stroke-linecap="round"/>`;
  k += `<path d="M${bach.map(Pt).join(" L")}" stroke="#d8e8ea" stroke-width="1.1" fill="none" stroke-dasharray="4 2.6 1.4 3" opacity=".9"/>`;
  for (const [x, y, w] of [[120, 236, 4], [158, 244, 5], [196, 251, 6], [222, 258, 7]]) k += `<ellipse cx="${x}" cy="${y - 1}" rx="${w}" ry="${w * 0.36}" fill="#5c5850"/><ellipse cx="${x - w * 0.3}" cy="${y - 1.6}" rx="${w * 0.45}" ry="${w * 0.16}" fill="#8f897a"/>`;
  /* sonnige Kalkwand unter dem Brückenkopf (schaut nach Südwest) mit Bändern */
  const WAND = [...RAND.slice(1), [226, 262], [238, 240], [250, 218], [262, 198], [272, 182], [282, 166]];
  k += `<path d="${poly(WAND)}" fill="${S.lg("nahwand", [[0, "#8e8270"], [0.5, "#b8aa90"], [1, "#d6c8ae"]], 0, 0, 1, 0)}"/>`;
  for (let i = 0; i < 18; i++) { const t = rnd(), y = 160 + t * 100, x = 296 - t * 46 - rnd() * 18; k += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(2 + t * 3)}" ry="${r(1.2 + t * 1.6)}" fill="${["#3e5a32", "#5a6e34", "#a8742a"][i % 3]}" opacity=".9"/>`; }
  for (let i = 0; i < 7; i++) { const y = 170 + i * 13; k += `<path d="M${r(296 - (y - 156) * 0.42)} ${y} L${r(290 - (y - 156) * 0.42 - 16)} ${r(y + 6)}" stroke="${i % 2 ? "#fbf4e6" : "#8a7d68"}" stroke-width=".6" opacity=".7"/>`; }
  for (const [x, y] of [[276, 186], [262, 214], [252, 236], [284, 172], [244, 252]]) k += `<ellipse cx="${x}" cy="${y}" rx="3.4" ry="1.5" fill="#46663a"/><ellipse cx="${x - 1}" cy="${y - 0.5}" rx="1.6" ry=".6" fill="#86a25a"/>`;
  /* Gischtdunst steigt aus der Tiefe */
  k += `<ellipse cx="170" cy="254" rx="70" ry="12" fill="#e9f0f2" opacity=".42" filter="url(#${S.id("dunst")})"/>`;
  k += `<ellipse cx="120" cy="236" rx="40" ry="7" fill="#e9f0f2" opacity=".25" filter="url(#${S.id("dunst")})"/>`;
  void TIEF;
  S.teil({ id: "schlucht", de: "die Schlucht", syl: "SCHLUCHT", it: "la gola", itSyl: "GO-la", en: "gorge", x: 0, y: 0, kunst: k,
    tipp: "Die Pöllatschlucht: Direkt unter der Brücke stürzt der Pöllatfall in die Tiefe. Unten rauscht der Bach am Schlossfelsen vorbei." });
}

/* =====================================================================
   12 — DIE FICHTE und 13 — DIE BUCHE: Wipfel, die aus der Schlucht
        heraufragen (wir sehen sie von oben)
   ===================================================================== */
{
  const f = 38, s = F / f, [x] = proj(...welt(f, (238 - CX) / F * f), 0), top = HOR + s * 5.4;
  let k = "";
  for (let i = 0; i < 11; i++) {
    const yy = top + 6 + i * 11, w = 4 + i * 2.6;
    if (yy > 258) break;
    k += `<path d="M${r(-w)} ${r(yy + 3)} Q${r(-w * 0.5)} ${r(yy + 0.4)} 0 ${r(yy - 8)} Q${r(w * 0.5)} ${r(yy + 0.4)} ${r(w)} ${r(yy + 3)} Q${r(w * 0.4)} ${r(yy + 1.6)} 0 ${r(yy + 2.2)} Q${r(-w * 0.4)} ${r(yy + 1.6)} ${r(-w)} ${r(yy + 3)} Z" fill="${i % 2 ? "#2f4b33" : "#26402c"}"/>`;
    k += `<path d="M${r(-w * 0.9)} ${r(yy + 2.6)} Q${r(-w * 0.5)} ${r(yy)} ${r(-0.6)} ${r(yy - 6)}" stroke="#86a66e" stroke-width=".6" fill="none" opacity=".75"/>`;
  }
  k += `<path d="M0 ${r(top - 3)} L0 ${r(top + 4)}" stroke="#26402c" stroke-width="1"/>`;
  S.teil({ id: "fichte", de: "die Fichte", syl: "FICH-te", it: "l'abete rosso", itSyl: "a-BE-te ROS-so", en: "spruce", x, y: 0, kunst: k,
    tipp: "Die Fichte wächst unten in der Schlucht. Von der Brücke aus sieht man auf ihren Wipfel." });
}
{
  /* Buchenkrone links vorn (aus der Schlucht, wir sehen von oben hinein; vom Geländer halb verdeckt):
     Laubballen mit Licht oben links, dazwischen dunkle Lücken und silbergraue Äste */
  let k = "";
  k += `<path d="M24 261 L20 248 Q30 238 44 244 L52 261 Z" fill="#4a2c14" opacity=".6"/>`;
  k += textkrone(62, 230, 46, 24, 10);
  for (const [x, y] of [[40, 246], [70, 242], [96, 246]]) k += `<path d="M${x} ${y + 14} Q${x - 2} ${y + 4} ${x + 6} ${y - 6}" stroke="#a6a8a6" stroke-width="1.6" fill="none"/><path d="M${x + 1} ${y + 14} Q${x - 1} ${y + 4} ${x + 6.6} ${y - 6}" stroke="#d7d8d4" stroke-width=".5" fill="none"/>`;
  for (let i = 0; i < 40; i++) { const a2 = rnd() * Math.PI * 2, d = Math.sqrt(rnd()), ex = r(62 + Math.cos(a2) * 44 * d), ey = r(230 + Math.sin(a2) * 22 * d); if (ey > 258 || rnd() < 0.6) continue; k += `<ellipse cx="${ex}" cy="${ey}" rx="1.5" ry=".9" fill="${["#f8dc7a", "#e9b040", "#c97526", "#9a4a1e"][Math.floor(rnd() * 4)]}" transform="rotate(${Math.round(rnd() * 180)} ${ex} ${ey})"/>`; }
  S.teil({ id: "buche", de: "die Buche", syl: "BU-che", it: "il faggio", itSyl: "FAG-gio", en: "beech", x: 0, y: 0, kunst: k,
    tipp: "Die Buche hat eine glatte, silbergraue Rinde. Im Oktober leuchten ihre Blätter kupfer und gold." });
}

/* =====================================================================
   VORDERGRUND RECHTS — der Brückenkopf mit dem Weg vom Schloss
   (Boden fällt zum Schloss hin ab: 5 cm je Meter, ab 25 m steiler)
   ===================================================================== */
function welt(f, l) { return [f * FV[0] + l * RV[0], f * FV[1] + l * RV[1]]; }
const bodenZ = (f) => EYE - 2.0 - 0.05 * Math.min(f, 25) - Math.max(0, f - 25) * 0.22;
const bodenP = (f, x) => [x, HOR + F * (EYE - bodenZ(f)) / f];
{
  /* 14 — DER WEG: Kies, Grasrand, Holzzaun an der Schluchtkante */
  const kante = RAND.slice(0, 7);
  let k = "";
  k += `<path d="${poly([...kante, [400, 261], [400, 136], [330, 137]])}" fill="${S.lg("bankgras", [[0, "#8c8f4e"], [1, "#6a6a36"]])}"/>`;
  /* Kiesweg: wird nach hinten schmal, biegt links zum Schloss */
  const wegL = [[300, 262], [308, 230], [314, 204], [316, 182], [316, 164], [314, 150], [311, 142]], wegR = [[400, 261], [400, 236], [382, 206], [360, 182], [340, 162], [326, 150], [318, 142]];
  k += `<path d="${poly([...wegL, ...wegR.slice().reverse()])}" fill="${S.lg("kies", [[0, "#d2c5a8"], [1, "#a69777"]])}"/>`;
  for (let i = 0; i < 70; i++) { const y = 142 + Math.pow(rnd(), 0.7) * 116, t = (y - 142) / 120, xl = 312 - t * 10, xr = Math.min(396, 318 + t * 86), x = xl + rnd() * (xr - xl); k += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(0.3 + t * 1.6)}" ry="${r(0.15 + t * 0.7)}" fill="${rnd() < 0.5 ? "#ebe1cc" : "#7f745f"}" opacity=".85"/>`; }
  /* Falllaub im Gras zwischen Zaun und Weg */
  for (let i = 0; i < 60; i++) { const t = Math.pow(rnd(), 0.7), y = 145 + t * 115, xl = 300 - t * 46, xr = 314 - t * 12; const x = xl + rnd() * Math.max(2, xr - xl); k += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(0.4 + t * 1.4)}" ry="${r(0.25 + t * 0.6)}" fill="${["#c98a2c", "#a85a24", "#e0b048"][i % 3]}" opacity=".8"/>`; }
  /* Grasbüschel am Wegrand */
  for (let i = 0; i < 26; i++) { const t = rnd(), y = 145 + t * 112, x = Math.min(396, 398 - (1 - t) * 76 + rnd() * 6); k += `<path d="M${r(x)} ${r(y)} l-1 ${r(-2 - t * 4)} M${r(x)} ${r(y)} l.4 ${r(-2.4 - t * 4)} M${r(x)} ${r(y)} l1.4 ${r(-1.8 - t * 3)}" stroke="#5e6a30" stroke-width="${r(0.3 + t * 0.4)}"/>`; }
  /* Zaun: Pfosten und zwei Latten entlang der Kante (perspektivisch) */
  const zaun = [[302, 141, 0.18], [298, 152, 0.24], [292, 168, 0.32], [284, 186, 0.44], [274, 208, 0.6], [264, 232, 0.8], [256, 256, 1]];
  for (const [x, y, t] of zaun) k += `<rect x="${r(x - 0.4 - t)}" y="${r(y - 3 - 18 * t)}" width="${r(0.8 + 2 * t)}" height="${r(3 + 18 * t)}" fill="#6b4a2e"/><rect x="${r(x - 0.4 - t)}" y="${r(y - 3 - 18 * t)}" width="${r(0.4 + t)}" height="${r(3 + 18 * t)}" fill="#8a6640"/>`;
  for (const h of [0.5, 0.92]) k += `<path d="M${zaun.map(([x, y, t]) => `${r(x)} ${r(y - (3 + 18 * t) * h)}`).join(" L")}" stroke="#7d5a38" stroke-width="1.2" fill="none"/>`;
  S.teil({ id: "weg", de: "der Weg", syl: "WEG", it: "il sentiero", itSyl: "sen-TIE-ro", en: "path", x: 0, y: 0, kunst: k,
    tipp: "Auf diesem Weg geht man in einer Viertelstunde vom Schloss zur Marienbrücke." });
}
{
  /* 15 — DIE INFOTAFEL am Weg (mit Porträt König Ludwigs II.) — Lupe: der König */
  const f = 9.2, [x, y] = bodenP(f, 334), s = F / f;    /* ≈ 63 je Meter: Tafel 0,62 m breit */
  const w = 0.31 * s, h0 = 0.95 * s, h1 = 1.5 * s;
  let k = schatten(w * 0.6, 0.6, w * 1.2, 2.4, 0.3);
  for (const dx of [-w * 0.78, w * 0.78]) k += `<rect x="${r(dx - 1.5)}" y="${r(-h0 - 2)}" width="3" height="${r(h0 + 2)}" fill="${S.lg("pfosten", [[0, "#7a5636"], [0.5, "#a07448"], [1, "#5e3f26"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${r(-w - 4)} ${r(-h1 - 4)} L${r(w + 4)} ${r(-h1 - 4)} L${r(w + 6)} ${r(-h1 + 1.6)} L${r(-w - 6)} ${r(-h1 + 1.6)} Z" fill="#5e3f26"/>`;
  k += `<rect x="${r(-w - 2)}" y="${r(-h1 + 1.6)}" width="${r(2 * w + 4)}" height="${r(h1 - h0 + 2.4)}" rx="1" fill="#3e2a1a"/>`;
  k += `<rect x="${r(-w)}" y="${r(-h1 + 3.6)}" width="${r(2 * w)}" height="${r(h1 - h0 - 1.6)}" fill="${S.lg("tafel", [[0, "#f6efe0"], [1, "#e4d9c2"]])}"/>`;
  k += `<rect x="${r(-w)}" y="${r(-h1 + 3.6)}" width="${r(2 * w)}" height="5.4" fill="#1f4f8f"/><text x="0" y="${r(-h1 + 7.8)}" font-size="4" text-anchor="middle" fill="#fff" font-family="Georgia,serif" font-weight="bold">Marienbrücke</text>`;
  const px = -w + 9.6, py = -h1 + 11, pw = 14, ph = 18.6;
  k += `<rect x="${r(px - pw / 2)}" y="${r(py)}" width="${pw}" height="${ph}" fill="#2b2f3a"/>`;
  k += `<path d="M${r(px - pw / 2)} ${r(py + ph)} Q${r(px - pw / 2)} ${r(py + ph - 7)} ${r(px)} ${r(py + ph - 7.8)} Q${r(px + pw / 2)} ${r(py + ph - 7)} ${r(px + pw / 2)} ${r(py + ph)} Z" fill="#1d2a4a"/>`;
  k += `<path d="M${r(px - pw / 2)} ${r(py + ph)} Q${r(px - pw / 2 + 0.4)} ${r(py + ph - 4.6)} ${r(px - 3.4)} ${r(py + ph - 6.6)} L${r(px - 2.3)} ${r(py + ph - 3)} Q${r(px - 4.6)} ${r(py + ph - 2.3)} ${r(px - 5.1)} ${r(py + ph)} Z M${r(px + pw / 2)} ${r(py + ph)} Q${r(px + pw / 2 - 0.4)} ${r(py + ph - 4.6)} ${r(px + 3.4)} ${r(py + ph - 6.6)} L${r(px + 2.3)} ${r(py + ph - 3)} Q${r(px + 4.6)} ${r(py + ph - 2.3)} ${r(px + 5.1)} ${r(py + ph)} Z" fill="#f6f3ec"/>`;
  for (const [dx, dy] of [[-5.8, -1.6], [-4.9, -3.8], [5.5, -1.6], [4.6, -3.8]]) k += `<path d="M${r(px + dx)} ${r(py + ph + dy)} l.3 .8 l-.6 0 Z" fill="#1a1a1a"/>`;
  k += `<circle cx="${r(px + 2)}" cy="${r(py + ph - 3.8)}" r=".7" fill="#d8b04a"/><path d="M${r(px - 0.8)} ${r(py + ph - 7.8)} L${r(px)} ${r(py + ph - 5.1)} L${r(px + 0.8)} ${r(py + ph - 7.8)}" fill="#f2ede2"/>`;
  k += `<rect x="${r(px - 0.85)}" y="${r(py + ph - 9.8)}" width="1.7" height="2.2" fill="#e8c4a2"/><ellipse cx="${r(px)}" cy="${r(py + 7)}" rx="3" ry="3.7" fill="#ecc8a6"/>`;
  k += `<path d="M${r(px - 3.3)} ${r(py + 6.7)} Q${r(px - 4)} ${r(py + 1.5)} ${r(px)} ${r(py + 1.7)} Q${r(px + 4)} ${r(py + 1.5)} ${r(px + 3.4)} ${r(py + 6.7)} Q${r(px + 2.8)} ${r(py + 3.9)} ${r(px)} ${r(py + 3.7)} Q${r(px - 2.6)} ${r(py + 3.9)} ${r(px - 3.3)} ${r(py + 6.7)} Z" fill="#2a1a12"/>`;
  k += `<circle cx="${r(px - 1.1)}" cy="${r(py + 6.8)}" r=".33" fill="#2a3a5a"/><circle cx="${r(px + 1.1)}" cy="${r(py + 6.8)}" r=".33" fill="#2a3a5a"/><path d="M${r(px - 0.85)} ${r(py + 9)} q.85 .4 1.7 0" stroke="#9a5a4a" stroke-width=".3" fill="none"/>`;
  k += `<rect x="${r(px - pw / 2)}" y="${r(py)}" width="${pw}" height="${ph}" fill="none" stroke="#c9a640" stroke-width=".6"/>`;
  k += `<text x="${r(px)}" y="${r(py + ph + 2.8)}" font-size="2" text-anchor="middle" fill="#3a2a1a" font-family="Georgia,serif">König Ludwig II.</text>`;
  for (let i = 0; i < 6; i++) k += `<rect x="${r(px + pw / 2 + 2.4)}" y="${r(py + 1 + i * 2.6)}" width="${i === 5 ? 7 : 13}" height=".8" fill="#8a7e6a"/>`;
  k += `<rect x="${r(px + pw / 2 + 2.4)}" y="${r(py + 16)}" width="13" height="4.6" fill="#c9d8b4"/><path d="M${r(px + pw / 2 + 3)} ${r(py + 19)} q3 -2.4 6 -.8 q2.4 1.2 4 -.8" stroke="#5d8fa0" stroke-width=".6" fill="none"/><circle cx="${r(px + pw / 2 + 11)}" cy="${r(py + 17.8)}" r=".7" fill="#b8473a"/>`;
  const zw = r(2 * w + 26);
  S.teil({ id: "infotafel", de: "die Infotafel", syl: "IN-fo-ta-fel", it: "il pannello informativo", itSyl: "pan-NEL-lo in-for-ma-TI-vo", en: "information board", x, y, steht: true, kunst: k,
    zoom: { x: r(x - zw / 2), y: r(y - h1 - 10), w: zw, h: r(zw / 1.5) },
    unter: [
      { id: "koenig", de: "der König", syl: "KÖ-nig", it: "il re", itSyl: "RE", en: "king", x: x + px, y: y + py + ph, kunst: flaeche(-pw / 2, -ph, pw, ph),
        tipp: "König Ludwig II. von Bayern (1845–1886) – man nennt ihn den Märchenkönig." },
    ] });
}

/* =====================================================================
   16 — DER WANDERER (auf dem Weg, Rücken zu uns, fotografiert) mit
   17 — DEM RUCKSACK und 18 — DER KAMERA
   ===================================================================== */
const WP0 = (() => { const f = 13.5, [x, y] = bodenP(f, 376); return { x, y, s: F / f }; })();
const wanderer = B.mensch({ id: "nsw_wanderer", geschlecht: "m", pose: "halten", blick: 196, frisur: "kurz", haarfarbe: "braun", haut: "hell",
  kleidung: { oberteil: { stueck: "pullover", farbe: "#c8452e" }, unterteil: { stueck: "hose", farbe: "#4b5560" }, schuhe: { stueck: "stiefel", farbe: "#5a3d26" }, kopf: { stueck: "muetze", farbe: "#2f5a35" } } }, 1.8 * WP0.s);
const WP = (n) => { const q = wanderer.z.punkte[n]; return [q[0] * wanderer.k, q[1] * wanderer.k]; };
{
  const k = schatten(8, 0.4, 0.5 * WP0.s, 0.1 * WP0.s, 0.3) + wanderer.svg;
  S.teil({ id: "wanderer", de: "der Wanderer", syl: "WAN-de-rer", it: "l'escursionista", itSyl: "e-scur-sio-NI-sta", en: "hiker", x: WP0.x, y: WP0.y, kunst: k,
    tipp: "Der Wanderer bleibt stehen und fotografiert das Schloss – das berühmteste Foto von Neuschwanstein." });
}
{
  const [sx1, sy1] = WP("schulterL"), [sx2, sy2] = WP("schulterR"), [, ly] = WP("lende");
  const cx = (sx1 + sx2) / 2, top = Math.min(sy1, sy2) - 0.4, w = Math.abs(sx1 - sx2) * 0.84, h = (ly - top) * 0.95;
  let k = `<path d="M${r(cx - w / 2)} ${r(top + h)} L${r(cx - w / 2 - 0.4)} ${r(top + 2)} Q${r(cx - w / 2)} ${r(top - 1)} ${r(cx)} ${r(top - 1.2)} Q${r(cx + w / 2)} ${r(top - 1)} ${r(cx + w / 2 + 0.4)} ${r(top + 2)} L${r(cx + w / 2)} ${r(top + h)} Q${r(cx)} ${r(top + h + 1.2)} ${r(cx - w / 2)} ${r(top + h)} Z" fill="${S.lg("rucksack", [[0, "#4f82a6"], [0.5, "#3d6a8a"], [1, "#24425a"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${r(cx - w * 0.36)} ${r(top + h * 0.55)} h${r(w * 0.72)} v${r(h * 0.36)} h${r(-w * 0.72)} Z" fill="#2f5876" stroke="#20384a" stroke-width=".25"/>`;
  k += `<path d="M${r(cx - w / 2 + 0.6)} ${r(top + 1.6)} Q${r(cx)} ${r(top + 3.6)} ${r(cx + w / 2 - 0.6)} ${r(top + 1.6)}" stroke="#20384a" stroke-width=".35" fill="none"/>`;
  k += `<rect x="${r(cx + w / 2 - 0.6)}" y="${r(top + h * 0.3)}" width="1.3" height="${r(h * 0.5)}" rx=".5" fill="#e8b84a"/>`;
  k += `<path d="M${r(cx - 1)} ${r(top - 1)} q1 -1.6 2 0" stroke="#20384a" stroke-width=".45" fill="none"/>`;
  S.teil({ oben: true, id: "rucksack", de: "der Rucksack", syl: "RUCK-sack", it: "lo zaino", itSyl: "ZAI-no", en: "backpack", x: WP0.x, y: WP0.y, kunst: k + flaeche(cx - w / 2 - 1, top - 2, w + 2, h + 3) });
}
{
  /* die Kamera vor dem Gesicht, zum Schloss gerichtet: man sieht ihr Ende über der Schulter */
  const hands = [WP("handL"), WP("handR")];
  const hx = (hands[0][0] + hands[1][0]) / 2, hy = Math.min(hands[0][1], hands[1][1]);
  const cw = 0.15 * WP0.s, ch = 0.095 * WP0.s;
  let k = `<rect x="${r(hx - cw / 2)}" y="${r(hy - ch * 0.9)}" width="${r(cw)}" height="${r(ch)}" rx=".6" fill="#1d1f22"/><rect x="${r(hx - cw * 0.32)}" y="${r(hy - ch * 1.3)}" width="${r(cw * 0.38)}" height="${r(ch * 0.45)}" fill="#2a2c30"/>`;
  k += `<rect x="${r(hx - cw * 0.38)}" y="${r(hy - ch * 0.72)}" width="${r(cw * 0.56)}" height="${r(ch * 0.58)}" fill="#3e5a7a"/><rect x="${r(hx - cw * 0.32)}" y="${r(hy - ch * 0.64)}" width="${r(cw * 0.18)}" height="${r(ch * 0.2)}" fill="#cfe0f0" opacity=".7"/>`;
  k += `<rect x="${r(hx + cw * 0.28)}" y="${r(hy - ch * 1.1)}" width="${r(cw * 0.12)}" height="${r(ch * 0.25)}" fill="#c9302c"/>`;
  S.teil({ oben: true, id: "kamera", de: "die Kamera", syl: "KA-me-ra", it: "la macchina fotografica", itSyl: "MAC-chi-na fo-to-GRA-fi-ca", en: "camera", x: WP0.x, y: WP0.y, kunst: k + flaeche(hx - cw, hy - ch * 1.6, cw * 2, ch * 1.8),
    tipp: "Von der Marienbrücke fotografieren jeden Tag Tausende Menschen das Schloss." });
}

/* =====================================================================
   19 — DAS GELÄNDER der Marienbrücke (vorn links, fluchtet nach Westen)
   ===================================================================== */
{
  const n = 1.0, zO = EYE - 0.45, zM = EYE - 1.0, zU = EYE - 1.62;
  const P = (E, z) => proj(E, n, z);
  const Es = [];
  for (let E = -16; E <= -0.75; E += (E < -6 ? 1.2 : E < -2.5 ? 0.6 : 0.3)) Es.push(E);
  let k = "";
  /* Gitterwerk aus schmalen Flacheisen: Pfosten und gekreuzte Diagonalen — nur was im Bild liegt */
  const linie = (a, b) => { const sg = strecke(a, b); return sg ? `M${Pt(sg[0])} L${Pt(sg[1])} ` : ""; };
  let g = "";
  for (let i = 0; i < Es.length; i++) {
    const a = P(Es[i], zO), b = P(Es[i], zU);
    g += linie(a, b);
    if (i < Es.length - 1) { const c = P(Es[i + 1], zU), d = P(Es[i + 1], zO); g += linie(a, c) + linie(b, d); }
  }
  k += `<path d="${g}" stroke="#2c3034" stroke-width=".85" fill="none"/>`;
  let m = "", o = "", o2 = "";
  for (let i = 0; i < Es.length - 1; i++) { m += linie(P(Es[i], zM), P(Es[i + 1], zM)); o += linie(P(Es[i], zO), P(Es[i + 1], zO)); o2 += linie(P(Es[i], zO + 0.012), P(Es[i + 1], zO + 0.012)); }
  k += `<path d="${m}" stroke="#30353a" stroke-width="1.3" fill="none"/>`;
  k += `<path d="${o}" stroke="#30363c" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
  k += `<path d="${o2}" stroke="#b6bec4" stroke-width=".8" fill="none"/>`;
  S.teil({ id: "gelaender", de: "das Geländer", syl: "ge-LÄN-der", it: "la ringhiera", itSyl: "rin-GHIE-ra", en: "railing", x: 0, y: 0, kunst: k,
    tipp: "Wir stehen auf der Marienbrücke. Sie führt in etwa 90 Metern Höhe über die Pöllatschlucht." });
}

/* Licht: warmer Nachmittagsschein von links */
S.davor(`<rect width="400" height="260" fill="${S.lg("abendlicht", [[0, "#ffd9a0", 0.1], [0.5, "#ffd9a0", 0], [1, "#ffd9a0", 0]], 0, 0, 1, 0)}"/>`);

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/neuschwanstein.js"));
console.log(aus);
