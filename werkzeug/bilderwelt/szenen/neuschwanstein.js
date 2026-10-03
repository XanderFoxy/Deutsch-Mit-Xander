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
const wandFn = (u0, v0, u1, v1) => { const L = Math.hypot(u1 - u0, v1 - v0); return (s, z) => C(u0 + (u1 - u0) * s / L, v0 + (v1 - v0) * s / L, z); };
const Pt = (p) => `${r(p[0])} ${r(p[1])}`;
const poly = (pts) => "M" + pts.map(Pt).join(" L") + " Z";
const wandFl = (W, s0, s1, z0, z1) => poly([W(s0, z0), W(s1, z0), W(s1, z1), W(s0, z1)]);
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
S.def(`<pattern id="${S.id("schiefer")}" width="1.6" height="1.1" patternUnits="userSpaceOnUse"><path d="M0 1.05 Q.4 .55 .8 1.05 Q1.2 .55 1.6 1.05 M-.8 .5 Q-.4 0 0 .5 Q.4 0 .8 .5 Q1.2 0 1.6 .5 Q2 0 2.4 .5" stroke="#2c323a" stroke-width=".12" fill="none" opacity=".7"/></pattern>`);
const SCHIEFER = `url(#${S.id("schiefer")})`;
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
/* Laubbüschel als Illustration: drei gewellte Flächen (Schatten, Mitte, Licht von links oben) */
const wellig = (cx, cy, rx, ry, n) => { const f = []; for (let i = 0; i < n; i++) f.push(0.78 + rnd() * 0.36); let d = ""; for (let i = 0; i <= n; i++) { const a = i / n * Math.PI * 2 + 0.3, q = f[i % n], x = cx + Math.cos(a) * rx * q, y = cy + Math.sin(a) * ry * q; const rr = (0.22 + rnd() * 0.22) * (rx + ry) / 2; d += i ? ` A${r(rr)} ${r(rr * 0.85)} 0 0 1 ${r(x)} ${r(y)}` : `M${r(x)} ${r(y)}`; } return d + " Z"; };
function laubBusch(cx, cy, rx, ry) {
  let g = `<path d="${wellig(cx + rx * 0.06, cy + ry * 0.12, rx, ry, 11)}" fill="#6e3412"/><path d="${wellig(cx - rx * 0.14, cy - ry * 0.16, rx * 0.78, ry * 0.7, 10)}" fill="#b8682a"/>`;
  for (let i = 0; i < 4; i++) { const x = cx - rx * (0.5 - rnd() * 0.6), y = cy - ry * (0.55 - rnd() * 0.5); g += `<path d="${wellig(x, y, rx * 0.26, ry * 0.24, 6)}" fill="${i % 2 ? "#e7a640" : "#f4c862"}"/>`; }
  for (let i = 0; i < 3; i++) { const x = cx + rx * (0.2 + rnd() * 0.5), y = cy + ry * (0.1 + rnd() * 0.5); g += `<path d="${wellig(x, y, rx * 0.22, ry * 0.2, 6)}" fill="#5a2a0e" opacity=".7"/>`; }
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
    const w = Math.min((8 + rnd() * 16) * skala * 1.4, x - Math.max(0, x0) + 2, Math.min(400, x1) - x + 2), h = Math.min(w * 0.55, y - y0 + 2, Math.min(260, y1) - y + 2);
    if (w < 2 || h < 1) continue;
    const pal = farben || ["#c58a2c", "#d9a640", "#2f4a32", "#9a5a24", "#3b5a3a", "#b98a34", "#e2b85a"];
    f += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(w)}" ry="${r(h)}" fill="${pal[Math.floor(rnd() * pal.length)]}"/>`;
  }
  return `<path d="${d}" fill="${grund}"/><g clip-path="url(#${S.id(name)})"><g filter="url(#${S.id("flecken")})">${f}</g></g><path d="${d}" fill="${muster(skala, dreh)}" opacity="${deckung}"/>`;
}
/* Saum aus Baumkronen entlang einer Oberkante */
function saum(linie, s, schritt, anteilNadel = 0.45) {
  let g = "";
  linie = linie.map(([x, y]) => [Math.max(s * 2.3, Math.min(400 - s * 2.3, x)), Math.min(258 - s * 1.6, y)]);
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
  /* Haufenwolken mit klarer Kontur: Kuppen aus Kreisen, ein gemeinsamer Verlauf (im Bildraum) von der
     sonnigen Oberseite zur flachen graublauen Unterseite; Basis gerade abgeschnitten */
  let c = "", nr = 0;
  const wolke = (x, y, s) => {
    const id = S.id("wk" + nr++), top = y - 16 * s;
    S.def(`<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="0" y1="${r(top)}" x2="0" y2="${r(y)}"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#f3f6f9"/><stop offset="1" stop-color="#b9c6d4"/></linearGradient>`);
    S.def(`<clipPath id="${id}c"><rect x="${r(x - 40 * s)}" y="${r(top - 2)}" width="${r(80 * s)}" height="${r(y - top + 2)}"/></clipPath>`);
    let g = "";
    for (const [dx, dy, rr] of [[-15, -2, 6], [-7, -6, 8], [3, -8, 9.5], [13, -5, 7.5], [20, -2, 5], [-1, -1, 9]]) g += `<circle cx="${r(x + dx * s)}" cy="${r(y + dy * s)}" r="${r(rr * s)}"/>`;
    return `<g clip-path="url(#${id}c)" fill="url(#${id})">${g}</g><path d="M${r(x - 20 * s)} ${r(y - 0.5)} L${r(x + 24 * s)} ${r(y - 0.5)}" stroke="#aebccb" stroke-width="${r(1 * s)}"/>`;
  };
  c += wolke(330, 30, 1.15) + wolke(388, 20, 0.7) + wolke(268, 40, 0.6) + wolke(52, 26, 0.8) + wolke(110, 46, 0.5);
  S.hinten(c);
}
/* ferne Hügel des Allgäus am Horizont, im Dunst */
S.hinten(`<path d="M0 ${HOR} L0 61 Q30 58 62 60.6 Q96 57.4 130 59.6 Q170 56.8 214 59.4 Q250 57.4 290 59 Q330 56.4 370 58.6 Q390 57.8 400 58.4 L400 ${HOR} Z" fill="#a9bacb" opacity=".9"/>`);
S.hinten(`<path d="M0 ${HOR + 1} Q80 62.4 160 63.6 Q240 62 320 63.2 Q370 62.4 400 63 L400 ${HOR + 1} Z" fill="#b5c3b4"/>`);
/* Alpenvorland: Felder als Parzellen auf der Ebene (perspektivisch projiziert) */
{
  let c = `<rect x="0" y="${HOR}" width="400" height="${190 - HOR}" fill="${S.lg("ebene", [[0, "#b6c3a6"], [0.2, "#a2b783"], [1, "#86a560"]])}"/>`;
  const FARBEN = ["#9fb873", "#b3c27e", "#8fae64", "#c2c486", "#a7a85c", "#93ad6a", "#b8b06a", "#7f9d58"];
  /* Felder als lange Streifen (Flurform des Allgäuer Vorlands), in Blöcken mit wechselnder Richtung */
  for (let N = 1200; N < 15000; N *= 1.22) {
    const dn = N * 0.2;
    for (let E = -9000; E < 6000; E += 700 + rnd() * 500) {
      const quer = rnd() < 0.5, bw = 500 + rnd() * 400, n = 3 + Math.floor(rnd() * 3);
      for (let i = 0; i < n; i++) {
        const q = quer ? [[E, N + dn * i / n], [E + bw, N + dn * i / n], [E + bw, N + dn * (i + 1) / n], [E, N + dn * (i + 1) / n]] : [[E + bw * i / n, N], [E + bw * (i + 1) / n, N], [E + bw * (i + 1) / n, N + dn], [E + bw * i / n, N + dn]];
        if (q.some(([a2, b2]) => tief(a2, b2) < 300)) continue;
        const pts = q.map(([a2, b2]) => proj(a2, b2, EBENE));
        if (pts.every((p2) => p2[0] < -10) || pts.every((p2) => p2[0] > 410)) continue;
        c += `<path d="${poly(pts)}" fill="${FARBEN[Math.floor(rnd() * FARBEN.length)]}" opacity=".7"/>`;
      }
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
  S.teil({ id: "stausee", de: "der See", syl: "SEE", it: "il lago", itSyl: "LA-go", en: "lake", x: 0, y: 0, kunst: k,
    tipp: "Der Forggensee ist ein Stausee: Der Fluss Lech wird hier aufgestaut. Im Winter lässt man das Wasser ab." });
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
  S.teil({ oben: true, id: "kirche", de: "die Kirche", syl: "KIR-che", it: "la chiesa", itSyl: "CHIE-sa", en: "church", x, y, kunst: k + flaeche(-6.5, -11, 13, 12),
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
/* Grund der Pöllatschlucht (Bachlauf): vom unteren Bildrand weg bis an den Fuß des Schlossbergs */
const SOHLE = [[122, 262], [138, 248], [154, 236], [170, 226], [184, 218], [196, 212]];
/* Oberkante der nahen Ostwand (unsere Seite der Schlucht, rechts) */
const RIM = [[196, 212], [212, 200], [232, 188], [256, 177], [282, 167], [312, 158], [350, 151], [401, 147]];
/* Grenze zwischen fernem und nahem Wald am Schlossberg (darunter größere Kronen) */
const NAHWALD = [[0, 192], [30, 196], [64, 204], [96, 214], [124, 226], [150, 238]];

/* =====================================================================
   4 — DER FELSEN (senkrechte Kalkwände unter Palas, Kemenate und Torbau)
   ===================================================================== */
{
  /* Kalkfelsen: Schichtbänder, Risse, Rippen mit Licht (Südwest) und harter Schattenseite, Bewuchs in Spalten */
  const pg = [...FUSS, ...FELS_U.slice().reverse()];
  const zf = (j, t) => [FUSS[j][0] + (FELS_U[j][0] - FUSS[j][0]) * t, FUSS[j][1] + (FELS_U[j][1] - FUSS[j][1]) * t];
  let k = `<path d="${poly(pg)}" fill="${S.lg("fels", [[0, "#e8dfcc"], [1, "#b7a98f"]])}"/>`;
  /* Rippen: Lichtfläche links, Schattenfläche rechts mit scharfer Kante */
  for (let i = 0; i < 14; i++) {
    const j = Math.min(FUSS.length - 2, Math.floor(i / 14 * (FUSS.length - 1))), tt = (i / 14 * (FUSS.length - 1)) - j;
    const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
    const top = lerp(FUSS[j], FUSS[j + 1], tt), bot = lerp(FELS_U[j], FELS_U[j + 1], tt);
    const w = 1.6 + rnd() * 2.2, m = [(top[0] + bot[0]) / 2 + (rnd() - 0.5) * 3, (top[1] + bot[1]) / 2];
    k += `<path d="M${Pt([top[0] + 0.6, top[1] + 1])} L${Pt([m[0] + w * 0.4, m[1]])} L${Pt([bot[0] + w * 0.8, bot[1] - 1])} L${Pt([bot[0] + w * 1.8, bot[1] - 1.4])} L${Pt([m[0] + w * 1.3, m[1]])} L${Pt([top[0] + w, top[1] + 1])} Z" fill="#6f6553" opacity="${i > 9 ? 0.62 : 0.42}"/>`;
    k += `<path d="M${Pt([top[0] + 0.6, top[1] + 1])} L${Pt([m[0] + w * 0.4, m[1]])} L${Pt([bot[0] + w * 0.8, bot[1] - 1])}" stroke="#fbf5e8" stroke-width=".5" fill="none" opacity=".8"/>`;
  }
  /* Schichtbänder, leicht wellig */
  for (const t of [0.18, 0.34, 0.52, 0.7, 0.86]) { let d = ""; for (let j = 0; j < FUSS.length; j++) { const p2 = zf(j, t + (rnd() - 0.5) * 0.04); d += (j ? " L" : "M") + Pt(p2); } k += `<path d="${d}" stroke="#8f826c" stroke-width=".45" fill="none" opacity=".75"/>`; }
  /* Risse und Bewuchs */
  for (let i = 0; i < 9; i++) { const j = Math.floor(rnd() * (FUSS.length - 1)), t0 = rnd() * 0.4; let p2 = zf(j, t0), d = `M${Pt(p2)}`; for (let n = 0; n < 4; n++) { p2 = [p2[0] + (rnd() - 0.4) * 2.4, p2[1] + 3 + rnd() * 3]; d += ` L${Pt(p2)}`; } k += `<path d="${d}" stroke="#5a5040" stroke-width=".4" fill="none"/>`; k += `<ellipse cx="${r(p2[0])}" cy="${r(p2[1])}" rx="1.4" ry=".8" fill="${i % 3 ? "#4f6a32" : "#c48a32"}"/>`; }
  /* Schlagschatten der Bauten auf den Fels (Sonne Südwest → nach rechts) */
  k += `<path d="${poly([C(12, -28, -4), C(38, -28, -4), C(38, -30, -16), C(14, -31, -22)])}" fill="#2a2f40" opacity=".24"/>`;
  /* Futtermauer auf Felsrippen unter Ringmauer und Torbau (bis an den Wald) */
  {
    const M2 = wandFn(38, -27.2, 98, -23.2), T2 = wandFn(98, -22.2, 112, -22.2);
    k += `<path d="${poly([M2(0, -7.6), M2(60, -7.6), T2(0, -9.6), T2(14, -9.6), T2(14, -16), T2(0, -16), M2(60, -15), M2(0, -15)])}" fill="#d9ccb2"/>`;
    k += `<path d="${poly([M2(0, -7.6), M2(60, -7.6), T2(0, -9.6), T2(14, -9.6), T2(14, -16), T2(0, -16), M2(60, -15), M2(0, -15)])}" fill="${QUADER}" opacity=".8"/>`;
    k += `<path d="M${Pt(M2(0, -7.8))} L${Pt(M2(60, -7.8))} L${Pt(T2(0, -9.8))} L${Pt(T2(14, -9.8))}" stroke="#7d705a" stroke-width=".5" fill="none"/>`;
    const T3 = wandFn(112, -22.2, 112, 22);
    k += `<path d="${poly([T3(0, -9.6), T3(44.2, -9.6), T3(44.2, -17), T3(0, -16)])}" fill="#b9ac92"/><path d="${poly([T3(0, -9.6), T3(44.2, -9.6), T3(44.2, -17), T3(0, -16)])}" fill="${QUADER}" opacity=".7"/>`;
    for (let s0 = 3; s0 < 60; s0 += 7 + rnd() * 5) k += `<path d="${poly([M2(s0, -15), M2(s0 + 2.4, -15), M2(s0 + 1.6, -19), M2(s0 - 0.6, -18)])}" fill="#bfb196"/><path d="${poly([M2(s0 + 1.2, -15), M2(s0 + 2.4, -15), M2(s0 + 1.6, -19)])}" fill="#6f6553" opacity=".6"/>`;
  }
  S.teil({ id: "felsen", de: "der Felsen", syl: "FEL-sen", it: "la roccia", itSyl: "ROC-cia", en: "rock", x: 0, y: 0, kunst: k,
    tipp: "Das Schloss steht auf einem Felsgrat. Die Kalkwände fallen fast senkrecht zur Pöllatschlucht ab." });
}

/* =====================================================================
   5 — DER WALD (am Schlossberg unter den Felswänden und am Westhang)
   ===================================================================== */
{
  /* Wald in drei Tiefen: hinten (am Schloss, ≈ 400 m) feine Körnung mit Dunst, Mitte das Muster,
     vorn unten (≈ 150–250 m) große Kronen. Oben rechts der Osthang hinter dem Torbau. */
  const BERG = [[0, 146], [16, 148], [36, 155], [54, 165], [68, 176], ...WALDKANTE.map(([x, y]) => [x, y - 2]), [298, 142], [330, 135], [370, 130], [401, 128], [401, 262], [0, 262]];
  let k = waldflaeche("bergclip", BERG, 2.2, 34, "#5c4a26", 0.75, HERBST, -6);
  k += saum(WALDKANTE.map(([x, y]) => [x, y + 1]), 2.2, 4, 0.42);
  k += saum([[0, 147], [36, 155], [68, 176]], 2.4, 3.6, 0.5);
  k += saum([[298, 143], [330, 136], [370, 131], [401, 129]], 1.6, 3.2, 0.5);
  /* vorn: großes Muster und einzelne Fichten, mit Kronensaum als Übergang */
  const NAH = [...NAHWALD, [150, 262], [0, 262]];
  k += waldflaeche("nahclip", NAH, 3.8, 10, "#4a3a1e", 0.85, HERBST, 10);
  k += saum(NAHWALD, 3.6, 6, 0.4);
  for (let i = 0; i < 22; i++) { const x = 8 + rnd() * 180, y = 160 + rnd() * 70; if (!drin(x, y, BERG) || drin(x, y, NAH)) continue; const t = 1 + (y - 150) / 45; k += `<path d="M${r(x - t)} ${r(y + t)} L${r(x)} ${r(y - t * 3)} L${r(x + t)} ${r(y + t)} Z" fill="${NADEL[i % 4]}"/><path d="M${r(x - t * 0.5)} ${r(y - t)} L${r(x)} ${r(y - t * 3)} L${r(x)} ${r(y + t * 0.6)} Z" fill="#8aa874" opacity=".35"/>`; }
  /* Luftperspektive: oben (fern) bläulicher Dunst, zum Bach hin dunkel */
  k += `<path d="${poly(BERG)}" fill="${S.lg("bergtiefe", [[0, "#c9d6e2", 0.38], [0.35, "#c9d6e2", 0.08], [0.7, "#000", 0], [1, "#080a12", 0.42]])}"/>`;
  /* Schlagschatten des Torbaus nach Nordosten (rechts) auf den Hang */
  k += `<path d="M282 140 L304 145 L300 158 L276 152 Z" fill="#1a2030" opacity=".28"/>`;
  S.teil({ id: "wald", de: "der Wald", syl: "WALD", it: "il bosco", itSyl: "BO-sco", en: "forest", x: 0, y: 0, kunst: k,
    tipp: "Im Herbst färben sich Buchen und Lärchen gold. Die Fichten bleiben dunkelgrün." });
}

/* =====================================================================
   6 — DAS SCHLOSS NEUSCHWANSTEIN (Palas, Treppentürme, Kemenate,
       Ritterhaus, Hof) — Lupe: der Palas, das Dach, der Turm, das
       Fenster, die Kemenate, der Hof
   ===================================================================== */
/* Wand zwischen (u0,v0) und (u1,v1): Punkt (s Meter entlang, z) */
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
  /* Hofseite: Achsen unregelmäßig, Geschosse verschieden hoch; oben die Arkaden des Sängersaals */
  for (const [W, achsen] of [[PO1, [2.6, 7.9, 14.1, 19.3]], [PO2, [2.2, 8.4, 13.6, 20.2]]]) {
    achsen.forEach((s, i) => {
      k += bogen(W, s + (i % 2) * 0.3, 7.2, i === 2 ? 1.8 : 2.4, 3.3, i === 2 ? 1 : 2, GLAS, "#d9dbe2") + bogen(W, s, 13.4, 2.4, 4.1, 2, GLAS, "#d9dbe2") + bogen(W, s - 0.4, 19.2, i % 2 ? 2.6 : 3.2, 4, i % 2 ? 2 : 3, GLAS, "#d9dbe2");
    });
  }
  const SAAL = S.lg("saalglas", [[0, "#aab8cc"], [1, "#6c7d96"]]);
  k += `<path d="${poly([PO1(0.4, 24.6), PO1(26, 24.6), PO2(25.6, 24.4), PO2(25.6, 30.4), PO1(26, 30.6), PO1(0.4, 30.6)])}" fill="#e9eaee"/>`;
  for (let i = 0; i < 10; i++) { const W = i < 5 ? PO1 : PO2, s = i < 5 ? 1 + i * 5 : 0.8 + (i - 5) * 5; k += bogen(W, s, 25.2, 4.2, 5.2, 3, SAAL, "#f4f4f6"); }
  k += `<path d="M${Pt(PO1(0.4, 25))} L${Pt(PO1(26, 25))} L${Pt(PO2(25.6, 24.8))}" stroke="#c6c8d0" stroke-width=".55" fill="none"/>`;
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
  k += `<path d="${dachFl([12, -26], [12, 0], ZT, -12, 0, ZF)}" fill="${SCHIEFER_OST}"/><path d="${dachFl([12, -26], [12, 0], ZT, -12, 0, ZF)}" fill="${SCHIEFER}" opacity=".55"/>`;
  k += `<path d="${poly([C(12, 0, ZT - 0.2), C(13.6, 26, ZT - 0.6), C(1.6, 26, ZF - 0.6), C(0, 0, ZF)])}" fill="${S.lg("schieferost2", [[0, "#56606c"], [1, "#3d4450"]])}"/><path d="${poly([C(12, 0, ZT - 0.2), C(13.6, 26, ZT - 0.6), C(1.6, 26, ZF - 0.6), C(0, 0, ZF)])}" fill="${SCHIEFER}" opacity=".5"/>`;
  k += `<path d="M${Pt(C(0, -26, ZF))} L${Pt(C(0, 0, ZF))} L${Pt(C(1.6, 26, ZF - 0.6))}" stroke="#b0b8c2" stroke-width=".6" fill="none"/>`;
  k += `<path d="M${Pt(PS(0, ZT - 0.2))} L${Pt(PS(12, ZF + 0.2))} L${Pt(PS(24, ZT - 0.2))}" stroke="#ece4d4" stroke-width=".9" fill="none"/>`;
  /* Gauben (Zwerchhäuschen) auf der Hofseite und Schieferstreifen */
  for (const v of [-20, -12, -4, 6, 16]) {
    const a = C(12.6 - 3, v, 34), b = C(12.6 - 3, v + 2.4, 34), sp = C(12.6 - 3, v + 1.2, 37.2), u1 = C(12.6 - 3, v, 31.4), u2 = C(12.6 - 3, v + 2.4, 31.4);
    k += `<path d="${poly([u1, a, sp, b, u2])}" fill="#d0d2d9"/><path d="${poly([C(9.6, v + 0.6, 31.8), C(9.6, v + 1.8, 31.8), C(9.6, v + 1.8, 33.6), C(9.6, v + 0.6, 33.6)])}" fill="${GLAS_S}"/>`;
  }
  for (let i = 1; i < 6; i++) { const zz = ZT + (ZF - ZT) * i / 6, du = -12 * i / 6; k += `<path d="M${Pt(C(12 + du, -26, zz))} L${Pt(C(12 + du, 0, zz))}" stroke="#3b424c" stroke-width=".18" opacity=".6"/>`; }
  /* Kamine */
  for (const v of [-8, 12]) { const a = C(4, v, 42.6), b = C(4, v, 50); const w = 0.9 * k1(4, v); k += `<rect x="${r(a[0] - w)}" y="${r(b[1])}" width="${r(2 * w)}" height="${r(a[1] - b[1])}" fill="#ece6da"/><rect x="${r(a[0])}" y="${r(b[1])}" width="${r(w)}" height="${r(a[1] - b[1])}" fill="#b9b4aa"/><rect x="${r(a[0] - w - 0.3)}" y="${r(b[1] - 0.6)}" width="${r(2 * w + 0.6)}" height=".8" fill="#cfc8b8"/><path d="M${r(a[0] - w - 0.6)} ${r(a[1])} L${r(a[0] + w + 0.6)} ${r(a[1] - 0.4)}" stroke="#3a4048" stroke-width=".6"/>`; }
  /* Ecktürmchen am Südgiebel (achteckig, aus Konsolen) und an der Nordostecke */
  k += rundturm(13.6, 26, 1.9, 18, 38, 10, { acht: true, fenster: [[30, 0]] });
  for (const [u, v] of [[-12, -26], [12, -26]]) {
    const c0 = C(u, v, 16);
    k += `<path d="M${r(c0[0] - 1.9 * k1(u, v))} ${r(c0[1])} Q${r(c0[0])} ${r(c0[1] + 4.2)} ${r(c0[0] + 1.9 * k1(u, v))} ${r(c0[1])} Z" fill="${u < 0 ? "#efe6d4" : "#c9c4ba"}"/>`;
    k += rundturm(u, v, 1.9, 16, 39, 13.5, { acht: true, fenster: [[22, 0], [31, 0]] });
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
    k += `<path d="${dachFl([12, -26], [38, -26], 18, 0, 6, 26)}" fill="${SCHIEFER_SUED}"/><path d="${dachFl([12, -26], [38, -26], 18, 0, 6, 26)}" fill="${SCHIEFER}" opacity=".45"/>`;
    k += `<path d="M${Pt(C(12, -20, 26))} L${Pt(C(38, -20, 26))}" stroke="#b6bec8" stroke-width=".5"/>`;
    for (const z of [5.4, 11.6]) k += `<path d="M${Pt(KS(0, z))} L${Pt(KS(26, z))}" stroke="#ddd0b8" stroke-width=".45"/>`;
    for (const s of [3, 9, 15.4, 21]) k += bogen(KS, s, 0.6, 2.4, 3.4, 2) + bogen(KS, s, 6.8, 2.4, 3.6, 2) + bogen(KS, s - 0.2, 12.8, 2.8, 3.8, 3);
    for (const s of [7, 17]) { const a = C(12 + s, -25.4, 21.8), b = C(12 + s + 2.2, -25.4, 21.8), sp = C(12 + s + 1.1, -25.4, 24), u1 = C(12 + s, -25.4, 19.6), u2 = C(12 + s + 2.2, -25.4, 19.6); k += `<path d="${poly([u1, a, sp, b, u2])}" fill="#f3ead8"/><path d="${poly([C(12 + s + 0.6, -25.6, 19.9), C(12 + s + 1.6, -25.6, 19.9), C(12 + s + 1.6, -25.6, 21.4), C(12 + s + 0.6, -25.6, 21.4)])}" fill="${GLAS_S}"/>`; }
    /* schlanker Rundturm an der Südostecke */
    k += rundturm(38.6, -26.6, 2.1, -2, 25, 7.5, { fenster: [[4, 0], [10, 0], [16, 0], [21, 0]] });
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
  /* Flankiertürme LINKS und RECHTS neben der Durchfahrt (Tor frei); Kalksteinsockel und umlaufende Gesimse */
  for (const v of [5.2, -10.6]) {
    k += rundturm(111.4, v, 2.2, -10, 17, 9, { ziegel: true, zinnen: true, fenster: [[-4, 0], [3, 0], [9, 0]] });
    const kk = k1(111.4, v), b0 = C(111.4, v, -10), b1 = C(111.4, v, -7.4), w = 2.2 * kk;
    k += `<rect x="${r(b0[0] - w - 0.3)}" y="${r(b1[1])}" width="${r(2 * w + 0.6)}" height="${r(b0[1] - b1[1])}" fill="#e2d4b6"/>`;
    for (const z of [-2.6, 4.6]) { const g0 = C(111.4, v, z); k += `<path d="M${r(g0[0] - w - 0.2)} ${r(g0[1])} Q${r(g0[0])} ${r(g0[1] + 0.9)} ${r(g0[0] + w + 0.2)} ${r(g0[1])}" stroke="#ead8b8" stroke-width=".6" fill="none"/>`; }
  }
  /* Schlagschatten des Torbaus nach Nordosten auf den Hang */
  const xs = tor.map((p) => p[0]), ys = tor.map((p) => p[1]);
  const tx = (Math.min(...xs) + Math.max(...xs)) / 2, ty = Math.max(...ys);
  S.teil({ id: "torhaus", de: "das Torhaus", syl: "TOR-haus", it: "l'edificio d'ingresso", itSyl: "e-di-FI-cio d'in-GRES-so", en: "gatehouse", x: 0, y: 0, kunst: k,
    tipp: "Das Torhaus ist außen aus roten Ziegeln. Durch sein Tor kommen alle Besucher ins Schloss.",
    zoom: { x: r(tx - 56), y: r(ty - 76), w: 112, h: 78 },
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
  /* Zufahrt als Schneise: Böschung bergseits (dunkel), Fahrbahn, Kronen talseits überhängend */
  let k = `<path d="M${STRASSE.map(Pt).join(" L")}" stroke="#5e4c2c" stroke-width="3.6" fill="none" stroke-linecap="round" transform="translate(-1 -.8)"/>`;
  k += `<path d="M${STRASSE.map(Pt).join(" L")}" stroke="#d6c9ad" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
  k += `<path d="M${STRASSE.map(Pt).join(" L")}" stroke="#a89878" stroke-width=".4" fill="none" transform="translate(.6 .6)"/>`;
  k += saum(STRASSE.slice(1).map(([x, y]) => [x + 2.2, y + 1]), 1.3, 2.6, 0.4);
  /* Kutsche in Fahrtrichtung (bergauf zum Torbau): Seitenansicht, entlang der Straße geschert */
  const [x, y] = C(117.5, -7.4, -11.1), s = k1(117.5, -7.4) * 1.05;
  const sa = STRASSE[0], sb = STRASSE[1], winkel = Math.atan2(sb[1] - sa[1], sb[0] - sa[0]) * 180 / Math.PI;
  let g = schatten(0, 0.2, 4.6 * s, 0.5 * s, 0.3);
  const pferd = (dx, f, dunkel) => {
    let p = "";
    /* Beine mit Hufen */
    for (const [lx, w] of [[-0.62, -0.1], [-0.38, 0.08], [0.52, -0.06], [0.78, 0.1]]) p += `<path d="M${r((dx + lx) * s)} ${r(-1.05 * s)} L${r((dx + lx + w) * s)} ${r(-0.5 * s)} L${r((dx + lx) * s)} ${r(-0.08 * s)}" stroke="${f}" stroke-width="${r(0.15 * s)}" fill="none"/><path d="M${r((dx + lx - 0.05) * s)} 0 h${r(0.13 * s)}" stroke="#2a201a" stroke-width="${r(0.12 * s)}"/>`;
    /* Rumpf, Hals (geschwungen), Kopf mit Maul und Ohren */
    p += `<ellipse cx="${r(dx * s)}" cy="${r(-1.32 * s)}" rx="${r(0.95 * s)}" ry="${r(0.44 * s)}" fill="${f}"/>`;
    p += `<path d="M${r((dx - 0.55) * s)} ${r(-1.55 * s)} Q${r((dx - 0.95) * s)} ${r(-2.0 * s)} ${r((dx - 1.05) * s)} ${r(-2.45 * s)} L${r((dx - 0.75) * s)} ${r(-2.55 * s)} Q${r((dx - 0.55) * s)} ${r(-2.05 * s)} ${r((dx - 0.2) * s)} ${r(-1.7 * s)} Z" fill="${f}"/>`;
    p += `<path d="M${r((dx - 1.05) * s)} ${r(-2.45 * s)} L${r((dx - 1.62) * s)} ${r(-2.12 * s)} Q${r((dx - 1.7) * s)} ${r(-1.98 * s)} ${r((dx - 1.55) * s)} ${r(-1.95 * s)} L${r((dx - 0.95) * s)} ${r(-2.2 * s)} Z" fill="${f}"/><path d="M${r((dx - 0.85) * s)} ${r(-2.55 * s)} l${r(-0.05 * s)} ${r(-0.22 * s)} l${r(0.12 * s)} ${r(0.16 * s)}" fill="${f}"/>`;
    /* Mähne, Schweif, Geschirr (Kummet und Strang) */
    p += `<path d="M${r((dx - 0.78) * s)} ${r(-2.5 * s)} Q${r((dx - 0.6) * s)} ${r(-2.05 * s)} ${r((dx - 0.25) * s)} ${r(-1.75 * s)}" stroke="${dunkel}" stroke-width="${r(0.14 * s)}" fill="none"/>`;
    p += `<path d="M${r((dx + 0.9) * s)} ${r(-1.5 * s)} Q${r((dx + 1.22) * s)} ${r(-1.15 * s)} ${r((dx + 1.1) * s)} ${r(-0.7 * s)}" stroke="${dunkel}" stroke-width="${r(0.16 * s)}" fill="none"/>`;
    p += `<path d="M${r((dx - 0.62) * s)} ${r(-1.75 * s)} Q${r((dx - 0.48) * s)} ${r(-1.3 * s)} ${r((dx - 0.5) * s)} ${r(-1.05 * s)}" stroke="#2a1a10" stroke-width="${r(0.12 * s)}" fill="none"/><path d="M${r((dx - 0.5) * s)} ${r(-1.3 * s)} L${r((dx + 1.5) * s)} ${r(-1.25 * s)}" stroke="#2a1a10" stroke-width="${r(0.06 * s)}"/>`;
    return p;
  };
  g += `<g transform="translate(${r(0.42 * s)} ${r(-0.3 * s)})">${pferd(-2.4, "#6e3e1c", "#2a160a")}</g>` + pferd(-2.4, "#b9743a", "#4a2a12");
  g += `<path d="M${r(0.3 * s)} ${r(-0.7 * s)} L${r(2.8 * s)} ${r(-0.7 * s)} L${r(2.9 * s)} ${r(-1.7 * s)} L${r(2.3 * s)} ${r(-1.8 * s)} L${r(2.3 * s)} ${r(-1.3 * s)} L${r(1.1 * s)} ${r(-1.3 * s)} L${r(0.9 * s)} ${r(-1.7 * s)} L${r(0.4 * s)} ${r(-1.6 * s)} Z" fill="#23262b"/>`;
  g += `<path d="M${r(2.2 * s)} ${r(-1.8 * s)} Q${r(2.7 * s)} ${r(-3 * s)} ${r(3.3 * s)} ${r(-2.1 * s)} L${r(2.9 * s)} ${r(-1.7 * s)} Z" fill="#3a3f46"/>`;
  g += `<circle cx="${r(0.9 * s)}" cy="${r(-0.4 * s)}" r="${r(0.4 * s)}" fill="none" stroke="#d8a830" stroke-width="${r(0.12 * s)}"/><circle cx="${r(2.4 * s)}" cy="${r(-0.5 * s)}" r="${r(0.5 * s)}" fill="none" stroke="#d8a830" stroke-width="${r(0.12 * s)}"/>`;
  g += `<rect x="${r(0.6 * s)}" y="${r(-2.2 * s)}" width="${r(0.45 * s)}" height="${r(0.7 * s)}" fill="#2f4a2f"/><circle cx="${r(0.82 * s)}" cy="${r(-2.4 * s)}" r="${r(0.21 * s)}" fill="#e0b896"/><rect x="${r(0.57 * s)}" y="${r(-2.7 * s)}" width="${r(0.5 * s)}" height="${r(0.17 * s)}" fill="#1c1c1c"/>`;
  g += `<rect x="${r(1.5 * s)}" y="${r(-2 * s)}" width="${r(0.4 * s)}" height="${r(0.6 * s)}" fill="#b8473a"/><circle cx="${r(1.7 * s)}" cy="${r(-2.15 * s)}" r="${r(0.19 * s)}" fill="#e8c39e"/><rect x="${r(1.95 * s)}" y="${r(-1.95 * s)}" width="${r(0.35 * s)}" height="${r(0.55 * s)}" fill="#2f5f95"/><circle cx="${r(2.12 * s)}" cy="${r(-2.1 * s)}" r="${r(0.18 * s)}" fill="#d9a882"/>`;
  const scher = `translate(${r(x)} ${r(y)}) skewY(${r(Math.max(-40, Math.min(40, winkel)) * 0.85)}) scale(.82 1)`;
  k += `<g transform="${scher}">${g}</g>`;
  S.teil({ oben: true, id: "kutsche", de: "die Kutsche", syl: "KUT-sche", it: "la carrozza", itSyl: "car-ROZ-za", en: "carriage", x: 0, y: 0, kunst: k + `<g transform="${scher}">${flaeche(-5.6 * s, -3 * s, 9.6 * s, 3.2 * s)}</g>`,
    tipp: "Pferdekutschen bringen Gäste vom Dorf Hohenschwangau hinauf zum Schloss.",
    zoom: { x: r(x - 19), y: r(y - 20), w: 36, h: 24 },
    unter: [
      { id: "pferd", de: "das Pferd", syl: "PFERD", it: "il cavallo", itSyl: "ca-VAL-lo", en: "horse", x, y, kunst: `<g transform="translate(0 0) skewY(${r(Math.max(-40, Math.min(40, winkel)) * 0.85)}) scale(.82 1)">${flaeche(-4.3 * s, -2.7 * s, 3.2 * s, 2.7 * s)}</g>`,
        tipp: "Zwei Pferde ziehen die Kutsche den steilen Weg hinauf." },
    ] });
}

/* =====================================================================
   11 — DIE SCHLUCHT (Pöllatschlucht): dunkler Grund mit dem Bach, rechts die
        nahe Kalkwand unserer Seite (im Nachmittagslicht), Gischtdunst.
        Lupe: der Bach
   ===================================================================== */
{
  const L = SOHLE.map(([x, y], i) => [x - 12 + i * 1.6 + (i % 2 ? 2 : -1), y + 1]), R = SOHLE.map(([x, y], i) => [x + 14 - i * 2 + (i % 2 ? -2 : 1), y + 2]);
  let k = `<path d="${poly([...L, ...R.slice().reverse()])}" fill="${S.lg("schluchtgrund", [[0, "#34352e"], [1, "#141518"]])}"/>`;
  /* Ufersteine */
  for (let i = 0; i < 8; i++) { const t = rnd(), j = Math.min(SOHLE.length - 2, Math.floor(t * (SOHLE.length - 1))), tt = t * (SOHLE.length - 1) - j; const side = rnd() < 0.5 ? L : R; const x = side[j][0] + (side[j + 1][0] - side[j][0]) * tt + (side === L ? 2 : -2), y = side[j][1] + (side[j + 1][1] - side[j][1]) * tt - 1; const q = 1 + (y - 200) / 30; k += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(q * 1.6)}" ry="${r(q * 0.8)}" fill="#6e6a5e"/><ellipse cx="${r(x - q * 0.4)}" cy="${r(y - q * 0.3)}" rx="${r(q * 0.7)}" ry="${r(q * 0.3)}" fill="#a39d8a"/>`; }
  /* die Pöllat: graugrünes Wasser, unten breiter, mit weißen Schwällen zwischen den Blöcken */
  const WL = SOHLE.map(([x, y], i) => [x - 3.4 + i * 0.5, y]), WR = SOHLE.map(([x, y], i) => [x + 3.6 - i * 0.55, y + 0.6]);
  k += `<path d="${poly([...WL, ...WR.slice().reverse()])}" fill="${S.lg("pwasser", [[0, "#5f7c7c"], [1, "#3e5656"]])}"/>`;
  for (let i = 0; i < 16; i++) { const t = rnd(), j = Math.min(SOHLE.length - 2, Math.floor(t * (SOHLE.length - 1))), tt = t * (SOHLE.length - 1) - j; const x = SOHLE[j][0] + (SOHLE[j + 1][0] - SOHLE[j][0]) * tt + (rnd() - 0.5) * 3, y = SOHLE[j][1] + (SOHLE[j + 1][1] - SOHLE[j][1]) * tt; const q = 0.8 + (y - 205) / 28; k += `<path d="M${r(x - q * 1.6)} ${r(y)} q${r(q * 0.8)} ${r(-q * 0.7)} ${r(q * 1.6)} ${r(-q * 0.2)} q${r(q * 0.8)} ${r(q * 0.5)} ${r(q * 1.5)} ${r(q * 0.3)} q${r(-q * 1.5)} ${r(q * 0.5)} ${r(-q * 3.1)} ${r(-q * 0.1)} Z" fill="#eef5f4" opacity=".9"/>`; }
  for (const [x, y, w] of [[140, 246, 3.4], [158, 234, 2.8], [174, 224, 2.2], [128, 257, 4.2]]) k += `<ellipse cx="${x - 1}" cy="${y}" rx="${w}" ry="${r(w * 0.45)}" fill="#5c5850"/><ellipse cx="${r(x - 1 - w * 0.3)}" cy="${r(y - w * 0.15)}" rx="${r(w * 0.45)}" ry="${r(w * 0.16)}" fill="#8f897a"/>`;
  /* Uferhänge: die Schlucht wird zum Grund hin dunkel; Kronen hängen von beiden Seiten über */
  k += `<path d="${poly([...L.map(([x, y]) => [x - 16, y - 4]), ...L.slice().reverse()])}" fill="#0e1018" opacity=".4"/>`;
  k += saum(L.map(([x, y]) => [x - 2, y - 1]), 2.6, 3.6, 0.5) + saum(R.map(([x, y]) => [x + 2, y - 1]), 2.6, 3.6, 0.5);
  const BACH = [SOHLE[1][0], SOHLE[1][1]];
  /* die nahe Ostwand: steiler Waldhang mit Kalkfelsen, nach Südwest gewandt (Nachmittagssonne) */
  const WAND = [...RIM, [401, 262], ...R.slice().reverse()];
  k += waldflaeche("wandclip", WAND, 3.4, 16, "#4e3c1e", 0.88, HERBST, 22);
  /* harte Schattenkante: der Schlossberg verschattet den unteren Teil des Hangs */
  k += `<path d="${poly([[200, 216], [290, 262], ...R])}" fill="#141a28" opacity=".45"/>`;
  /* Kronensaum an der Oberkante */
  k += saum(RIM.map(([x, y]) => [x, y + 1]), 2.6, 4.6, 0.5);
  /* Gischtdunst steigt aus der Tiefe (der Pöllatfall liegt direkt unter der Brücke) */
  k += `<ellipse cx="140" cy="251" rx="44" ry="9" fill="#eef4f6" opacity=".55" filter="url(#${S.id("dunst")})"/><ellipse cx="170" cy="232" rx="30" ry="7" fill="#eef4f6" opacity=".38" filter="url(#${S.id("dunst")})"/><ellipse cx="192" cy="214" rx="18" ry="4" fill="#eef4f6" opacity=".3" filter="url(#${S.id("dunst")})"/>`;
  S.teil({ id: "schlucht", de: "die Schlucht", syl: "SCHLUCHT", it: "la gola", itSyl: "GO-la", en: "gorge", x: 0, y: 0, kunst: k,
    tipp: "Die Pöllatschlucht ist tief und eng. Unten rauscht die Pöllat, direkt unter der Brücke stürzt sie als Wasserfall hinab.",
    zoom: { x: 104, y: 196, w: 96, h: 64 },
    unter: [
      { id: "bach", de: "der Bach", syl: "BACH", it: "il torrente", itSyl: "tor-REN-te", en: "stream", x: BACH[0], y: BACH[1] + 4, kunst: `<path class="bw-flaeche" d="M${SOHLE.map(([x, y]) => `${r(x - BACH[0] - 3)} ${r(y - BACH[1] - 4)}`).join(" L")} L${SOHLE.slice().reverse().map(([x, y]) => `${r(x - BACH[0] + 4)} ${r(y - BACH[1] - 4)}`).join(" L")} Z" fill="rgba(255,255,255,0.001)"/>`,
        tipp: "Die Pöllat ist ein Gebirgsbach. Sie fließt durch die Schlucht hinunter ins Tal." },
    ] });
}

/* =====================================================================
   12 — DIE FICHTE (wächst unten am Hang; wir sehen von oben auf ihre Spitze)
   13 — DIE BUCHE (große Krone links vorn, unter uns; silbergraue Äste)
   ===================================================================== */
{
  const x = 344, top = 182;
  let k = "";
  /* Quirle von oben gesehen: Äste strahlen schräg nach unten aus, Licht von links */
  for (let i = 0; i < 9; i++) {
    const yy = top + 5 + i * 9.2, w = 3 + i * 2.6;
    if (yy > 262) break;
    k += `<path d="M${r(x - w)} ${r(yy + 3)} Q${r(x - w * 0.5)} ${r(yy + 0.4)} ${r(x)} ${r(yy - 7)} Q${r(x + w * 0.5)} ${r(yy + 0.4)} ${r(x + w)} ${r(yy + 3)} Q${r(x + w * 0.4)} ${r(yy + 1.6)} ${r(x)} ${r(yy + 2.2)} Q${r(x - w * 0.4)} ${r(yy + 1.6)} ${r(x - w)} ${r(yy + 3)} Z" fill="${i % 2 ? "#2f4b33" : "#26402c"}"/>`;
    k += `<path d="M${r(x - w * 0.9)} ${r(yy + 2.6)} Q${r(x - w * 0.5)} ${r(yy)} ${r(x - 0.6)} ${r(yy - 5.4)}" stroke="#86a66e" stroke-width=".6" fill="none" opacity=".75"/>`;
    for (const sg of [-1, 1]) k += `<path d="M${r(x + sg * w * 0.3)} ${r(yy - 1)} L${r(x + sg * w * 0.95)} ${r(yy + 2.6)}" stroke="#1c3022" stroke-width=".35" opacity=".6"/>`;
  }
  k += `<path d="M${x} ${top - 3} L${x} ${top + 5}" stroke="#26402c" stroke-width="1"/><circle cx="${x}" cy="${top - 2.6}" r=".7" fill="#4f7a4a"/>`;
  S.teil({ id: "fichte", de: "die Fichte", syl: "FICH-te", it: "l'abete rosso", itSyl: "a-BE-te ROS-so", en: "spruce", x: 0, y: 0, kunst: k,
    tipp: "Die Fichte wächst unten am Hang. Von der Brücke aus sieht man von oben auf ihre Spitze." });
}
{
  /* Buche: Stamm und silbergraue Hauptäste, darüber Laub in Büscheln mit Licht- und Schattenseite */
  let k = "";
  k += `<path d="M58 262 Q60 246 54 232 M60 250 Q74 236 92 224 M57 240 Q40 226 22 216 M56 234 Q58 216 66 200" stroke="#8e918e" stroke-width="3.2" fill="none" stroke-linecap="round"/><path d="M60 262 Q62 246 56 232 M62 250 Q76 236 93 225 M58 240 Q41 227 23 217" stroke="#d2d4d0" stroke-width=".8" fill="none" opacity=".8"/>`;
  for (const [cx, cy, rx, ry] of [[40, 236, 14, 9], [88, 244, 13, 8], [20, 210, 13, 9], [100, 216, 14, 9], [44, 204, 15, 10], [76, 196, 15, 10], [60, 218, 14, 9], [116, 236, 10, 7], [10, 232, 10, 7]]) k += laubBusch(cx, cy, rx, ry);
  k += `<path d="M44 248 Q50 240 56 236" stroke="#8e918e" stroke-width="2" fill="none"/>`;
  S.teil({ id: "buche", de: "die Buche", syl: "BU-che", it: "il faggio", itSyl: "FAG-gio", en: "beech", x: 0, y: 0, kunst: k,
    tipp: "Die Buche hat eine glatte, silbergraue Rinde. Im Oktober leuchten ihre Blätter kupfer und gold." });
}

/* =====================================================================
   14 — DAS GELÄNDER der Marienbrücke: Rautengitter aus Flacheisen, wir stehen
        1,5 m dahinter auf dem Deck und schauen darüber ins Leere
   ===================================================================== */
{
  const NR = 1.5, zO = EYE - 0.45, zU = EYE - 1.62;
  const P = (E, z) => proj(E, NR, z);
  const linie = (a, b) => { const sg = strecke(a, b); return sg ? `M${Pt(sg[0])} L${Pt(sg[1])} ` : ""; };
  let gD = "", gH = "";
  /* Rautengitter: Diagonalen in beide Richtungen, alle 0,3 m */
  for (let E = -4.4; E <= 0.4; E += 0.17) {
    gD += linie(P(E, zO), P(E + 0.6, zU)) + linie(P(E, zO), P(E - 0.6, zU));
    gH += linie(P(E + 0.02, zO), P(E + 0.62, zU));
  }
  let pf = "";
  for (let E = -4.2; E <= 0.6; E += 1.5) pf += linie(P(E, zO), P(E, zU));
  let o = "", o2 = "";
  o = linie(P(-5, zO), P(0.2, zO)); o2 = linie(P(-5, zO + 0.03), P(0.2, zO + 0.03));
  let k = `<path d="${gD}" stroke="#2a2e33" stroke-width="1.35" fill="none"/><path d="${gH}" stroke="#8a939a" stroke-width=".45" fill="none" opacity=".7"/>`;
  k += `<path d="${pf}" stroke="#22262a" stroke-width="5" fill="none"/>`;
  k += `<path d="${o}" stroke="#2c3238" stroke-width="7" fill="none" stroke-linecap="round"/><path d="${o2}" stroke="#c0c8ce" stroke-width="1.6" fill="none"/>`;
  S.teil({ id: "gelaender", de: "das Geländer", syl: "ge-LÄN-der", it: "la ringhiera", itSyl: "rin-GHIE-ra", en: "railing", x: 0, y: 0, kunst: k,
    tipp: "Wir stehen auf der Marienbrücke und schauen über das Geländer. Die Brücke führt in etwa 90 Metern Höhe über die Pöllatschlucht." });
}

/* Licht: warmer Nachmittagsschein von links */
S.davor(`<rect width="400" height="260" fill="${S.lg("abendlicht", [[0, "#ffd9a0", 0.1], [0.5, "#ffd9a0", 0], [1, "#ffd9a0", 0]], 0, 0, 1, 0)}"/>`);

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/neuschwanstein.js"));
console.log(aus);
