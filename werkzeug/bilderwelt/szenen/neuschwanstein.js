#!/usr/bin/env node
/* =====================================================================
   SCHLOSS NEUSCHWANSTEIN (FASSUNG 854) — Bilderwelt neu: Sehenswürdigkeit
   ---------------------------------------------------------------------
   XANDER (03.10.): „die bekannten Sehenswürdigkeiten … als Profi-
   Grafikdesigner auf Hollywood-Niveau … mit größter Sorgfalt und
   Präzision auf höchstem Niveau“.

   STANDORT (echte Kamera): auf dem Deck der MARIENBRÜCKE (Schwangau,
   Ostallgäu), 1,5 m hinter dem nördlichen Geländer, Augenhöhe 1,65 m über
   den Bohlen. Die Brücke läuft quer (West–Ost) zum Blick: das Rautengitter
   des Geländers liegt schräg im unteren Bilddrittel, man schaut darüber in
   die Schlucht. Das Deck selbst liegt bei waagrechtem Blick unter dem
   Bildrand (es wäre erst bei gesenkter Kamera zu sehen). Die Brücke liegt SÜDÖSTLICH des
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
   - Vor Ort typisch: Pferdekutschen (bringen Gäste von Hohenschwangau
     zum Schloss; hier auf der Zufahrt an der Ostseite unter dem Torbau —
     Verlauf UNSICHER), Herbstwald aus Buchen, Lärchen und Fichten, die
     Pöllat tief unten in der Schlucht. Wanderer und Infotafel stehen am
     Brückenkopf hinter uns bzw. außerhalb des Bildes und fehlen darum.
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
    const w = Math.min((8 + rnd() * 16) * skala * 1.4, x - Math.max(1, x0), Math.min(399, x1) - x), h = Math.min(w * 0.55, y - y0 + 2, Math.min(260, y1) - y + 2);
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
  /* Ein flacher Zug Haufenwolken über dem Dunst des Alpenvorlands: sonnige Oberkanten links (Sonne Südwest),
     grau-violette, flache Unterseite; nach hinten (zum Horizont) kleiner und flacher */
  S.def(`<linearGradient id="${S.id("wolkenzug")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fffaf0"/><stop offset=".45" stop-color="#f1eef2"/><stop offset=".78" stop-color="#c4bdd2"/><stop offset="1" stop-color="#9f97b2"/></linearGradient>`);
  S.def(`<linearGradient id="${S.id("wolkenlicht")}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff0d0" stop-opacity=".7"/><stop offset=".5" stop-color="#fff0d0" stop-opacity="0"/></linearGradient>`);
  let c = "", nr = 0;
  const wolke = (x, y, b, h) => {
    /* Kuppen als Kreise; oben in der Mitte höher. Unterkante flach (Clip), darunter die violette Basis */
    const id = S.id("wz" + nr++);
    S.def(`<clipPath id="${id}"><rect x="${r(x - b)}" y="${r(y - h * 3)}" width="${r(2 * b)}" height="${r(h * 3)}"/></clipPath>`);
    let d = "";
    const n = Math.max(3, Math.round(b / h * 0.9));
    for (let i = 0; i < n; i++) { const t = (i + 0.5) / n, hoch = Math.sin(t * Math.PI), rr = h * (0.35 + hoch * 0.45) * (0.85 + rnd() * 0.3), cx = x - b / 2 + t * b, cy = y - h * 0.15 - hoch * h * 0.4; d += `M${r(cx - rr)} ${r(cy)} a${r(rr)} ${r(rr)} 0 1 0 ${r(2 * rr)} 0 a${r(rr)} ${r(rr)} 0 1 0 ${r(-2 * rr)} 0 Z `; }
    return `<g clip-path="url(#${id})"><path d="${d}" fill="url(#${S.id("wolkenzug")})"/><path d="${d}" fill="url(#${S.id("wolkenlicht")})"/></g>`;
  };
  for (const [x, y, b, h] of [[46, 24, 60, 9], [126, 36, 42, 6], [318, 22, 74, 10], [384, 34, 40, 6], [196, 46, 34, 4], [262, 49, 28, 3.4], [96, 52, 30, 3], [356, 54, 24, 2.6], [20, 56, 22, 2.2], [228, 57, 18, 1.8]]) c += wolke(x, y, b, h);
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
  const [x, y] = proj(-3700, 2500, EBENE), s = F / tief(-3700, 2500);   /* ≈ 0,14 je Meter */
  const m = s * 1.15;   /* fast im echten Maßstab: klein und im Dunst; antippbar über einen unsichtbaren Fingerrahmen */
  let k = `<ellipse cx="0" cy=".3" rx="${r(34 * m)}" ry="${r(5 * m)}" fill="#b4c48c" opacity=".7"/>`;
  k += `<rect x="${r(-10 * m)}" y="${r(-9 * m)}" width="${r(22 * m)}" height="${r(9 * m)}" fill="#f1efe8"/><path d="M${r(-11 * m)} ${r(-9 * m)} L${r(-6 * m)} ${r(-15 * m)} L${r(10 * m)} ${r(-15 * m)} L${r(13 * m)} ${r(-9 * m)} Z" fill="#a8786a"/>`;
  k += `<rect x="${r(10 * m)}" y="${r(-9 * m)}" width="${r(2 * m)}" height="${r(9 * m)}" fill="#d4d2cc"/>`;
  k += `<rect x="${r(-16 * m)}" y="${r(-24 * m)}" width="${r(6 * m)}" height="${r(24 * m)}" fill="#f3f1ea"/><path d="M${r(-16.6 * m)} ${r(-24 * m)} Q${r(-17 * m)} ${r(-28 * m)} ${r(-13 * m)} ${r(-30 * m)} Q${r(-9 * m)} ${r(-28 * m)} ${r(-9.4 * m)} ${r(-24 * m)} Z" fill="#6c7a72"/>`;
  S.teil({ oben: true, id: "kirche", de: "die Kirche", syl: "KIR-che", it: "la chiesa", itSyl: "CHIE-sa", en: "church", x, y, kunst: k + flaeche(-7, -12, 14, 14),
    tipp: "Die Wallfahrtskirche St. Coloman steht ganz allein in den Wiesen bei Schwangau." });
}
{
  let k = "";
  const haeuser = [], hx = [], hy = [];
  for (let i = 0; i < 34; i++) haeuser.push([-1900 + rnd() * 1100, 2150 + rnd() * 800]);
  haeuser.sort((a, b) => tief(b[0], b[1]) - tief(a[0], a[1]));
  for (const [E, N] of haeuser) {
    const [x, y] = proj(E, N, EBENE), s = F / tief(E, N) * 0.95;
    if (x < 4 || x > 396) continue;
    hx.push(x); hy.push(y);
    k += `<rect x="${r(x - 6 * s)}" y="${r(y - 5 * s)}" width="${r(12 * s)}" height="${r(5 * s)}" fill="${rnd() < 0.7 ? "#f3eee2" : "#efe0c0"}"/><path d="M${r(x - 7 * s)} ${r(y - 5 * s)} L${r(x)} ${r(y - 9.5 * s)} L${r(x + 7 * s)} ${r(y - 5 * s)} Z" fill="${rnd() < 0.6 ? "#b0644a" : "#8f5a48"}"/>`;
  }
  { const [x, y] = proj(-1350, 2500, EBENE), s = F / tief(-1350, 2500) * 0.95; k += `<rect x="${r(x - 3 * s)}" y="${r(y - 30 * s)}" width="${r(6 * s)}" height="${r(30 * s)}" fill="#f6f1e6"/><path d="M${r(x - 3.6 * s)} ${r(y - 30 * s)} L${r(x)} ${r(y - 42 * s)} L${r(x + 3.6 * s)} ${r(y - 30 * s)} Z" fill="#5e7468"/>`; }
  /* Häuser in den Dunst einfärben; eine gemeinsame unsichtbare Trefferform um den ganzen Ort */
  const bx0 = Math.min(...hx) - 3, bx1 = Math.min(398, Math.max(...hx) + 3), by0 = Math.min(...hy) - 5, by1 = Math.max(...hy) + 2;
  k = `<g opacity=".85">${k}</g>` + `<path class="bw-flaeche" d="M${r(bx0)} ${r(by0)} H${r(bx1)} V${r(by1)} H${r(bx0)} Z" fill="rgba(255,255,255,0.001)"/>`;
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
/* Die Pöllatschlucht von der Brücke aus: die Kerbe (tiefster, dunkelster Bereich) läuft von unten Mitte nach
   links oben unter die Palaswand und weiter ins Tal. Rechts unten der diesseitige Hang direkt unter uns. */
const KERBE = [[184, 262], [160, 252], [132, 242], [108, 233], [90, 226]];
const KEIL_L = [[132, 262], [118, 250], [104, 238], [94, 230], [86, 224]], KEIL_R = [[86, 224], [104, 232], [140, 241], [180, 249], [214, 256], [238, 262]];
const NAH_OBEN = [[238, 262], [246, 244], [260, 226], [278, 207], [302, 191], [332, 180], [366, 173], [401, 168]];
const LINKS_OBEN = [[86, 224], [62, 222], [34, 220], [-1, 219]];

/* =====================================================================
   4 — DER FELSEN (senkrechte Kalkwände unter Palas, Kemenate und Torbau)
   ===================================================================== */
{
  /* Wettersteinkalk-Grat: polygonal gebrochene Wand. Facetten mit Licht nach links (Südwest) und harter
     Schattenseite rechts, schräge Schichtbänder, dunkle Risse, Grasbüschel in den Spalten */
  const pg = [...FUSS, ...FELS_U.slice().reverse()];
  S.def(`<clipPath id="${S.id("felsclip")}"><path d="${poly(pg)}"/></clipPath>`);
  const zf = (j, t) => [FUSS[j][0] + (FELS_U[j][0] - FUSS[j][0]) * t, FUSS[j][1] + (FELS_U[j][1] - FUSS[j][1]) * t];
  const NJ = FUSS.length, NT = 6, gitter = [];
  for (let j = 0; j < NJ; j++) { gitter.push([]); for (let t = 0; t <= NT; t++) { const p2 = zf(j, t / NT); const inner = j > 0 && j < NJ - 1 && t > 0 && t < NT; gitter[j].push(inner ? [p2[0] + (rnd() - 0.5) * 4, p2[1] + (rnd() - 0.5) * 3 - (j * 0.6)] : p2); } }
  let k = `<path d="${poly(pg)}" fill="#cbbfa8"/><g clip-path="url(#${S.id("felsclip")})">`;
  const TON = ["#f3ecdd", "#e2d8c4", "#cbbfa6", "#a99c84", "#857a66", "#6e6453"];
  for (let j = 0; j < NJ - 1; j++) for (let t = 0; t < NT; t++) {
    const a2 = gitter[j][t], b2 = gitter[j + 1][t], c2 = gitter[j + 1][t + 1], d2 = gitter[j][t + 1];
    const links = rnd() < 0.55, hell = j < 3 ? 0 : j < 5 ? 1 : 2;   /* Palas-Seite im Licht, nach rechts mehr Schatten */
    k += `<path d="${poly([a2, b2, c2])}" fill="${TON[Math.min(5, hell + (links ? 0 : 2))]}"/><path d="${poly([a2, c2, d2])}" fill="${TON[Math.min(5, hell + (links ? 1 : 3))]}"/>`;
  }
  /* schräge Schichtbänder (fallen nach rechts ein) */
  for (const t of [0.2, 0.42, 0.63, 0.82]) { let d = ""; for (let j = 0; j < NJ - 1; j++) { if (rnd() < 0.4) continue; const p2 = zf(j, Math.min(0.98, t + j * 0.035)), p3 = zf(j + 1, Math.min(0.98, t + (j + 0.6) * 0.035)); d += `M${Pt(p2)} L${Pt([p2[0] + (p3[0] - p2[0]) * 0.6, p2[1] + (p3[1] - p2[1]) * 0.6])} `; } k += `<path d="${d}" stroke="#7d725f" stroke-width=".4" fill="none" opacity=".6"/>`; }
  /* Risse entlang einzelner Facettenkanten, Grasbüschel und kleine Fichten in den Spalten */
  for (let i = 0; i < 10; i++) { const j = 1 + Math.floor(rnd() * (NJ - 2)), t = 1 + Math.floor(rnd() * (NT - 2)), a2 = gitter[j][t], b2 = gitter[j][t + 1]; k += `<path d="M${Pt(a2)} L${Pt(b2)}" stroke="#3e372c" stroke-width=".6"/>`;
    if (i % 2) k += `<path d="M${r(b2[0] - 1.2)} ${r(b2[1])} l.5 -1.6 l.4 1.4 l.5 -1.8 l.4 1.6 l.6 -1.2 l.2 1.6 Z" fill="${i % 4 === 1 ? "#5a7a3a" : "#b08a3a"}"/>`;
    else k += `<path d="M${r(b2[0] - 1)} ${r(b2[1])} L${r(b2[0])} ${r(b2[1] - 3.2)} L${r(b2[0] + 1)} ${r(b2[1])} Z" fill="#2f4b33"/>`; }
  k += `</g>`;
  /* Schlagschatten der Bauten auf den Fels (Sonne Südwest → nach rechts) */
  k += `<path d="${poly([C(12, -28, -4), C(38, -28, -4), C(38, -30, -16), C(14, -31, -22)])}" fill="#2a2f40" opacity=".24"/>`;
  /* Futtermauer unter Ringmauer und Torhaus: Quaderlagen mit Fugen, unregelmäßige Unterkante auf Felsrippen */
  {
    const M2 = wandFn(38, -27.2, 98, -23.2), T2 = wandFn(98, -22.2, 112, -22.2), T3 = wandFn(112, -22.2, 112, 22);
    const unterkante = (W, L, z0) => { const out = []; for (let s0 = L; s0 >= 0; s0 -= 3) out.push(W(s0, z0 - 2.5 - rnd() * 3)); return out; };
    const flaechen = [[M2, 60, -7.6, "#cfc3aa"], [T2, 14, -9.6, "#cbbfa6"], [T3, 44.2, -9.6, "#a99d86"]];
    for (const [W, L, z0, f] of flaechen) {
      const pgm = [W(0, z0), W(L, z0), ...unterkante(W, L, z0 - 4)];
      k += `<path d="${poly(pgm)}" fill="${f}"/>`;
      let d = ""; for (let z = z0 - 1.2; z > z0 - 7; z -= 1.2) { const q = strecke(W(0, z), W(L, z)); if (q) d += `M${Pt(q[0])} L${Pt(q[1])} `; }
      for (let z = z0, n = 0; z > z0 - 6; z -= 1.2, n++) for (let s0 = (n % 2) * 1.1; s0 < L; s0 += 2.2) { const a2 = W(s0, z), b2 = W(s0, z - 1.2); d += `M${Pt(a2)} L${Pt(b2)} `; }
      k += `<path d="${d}" stroke="#6e6452" stroke-width=".3" fill="none" opacity=".75"/>`;
      k += `<path d="M${Pt(W(0, z0 - 0.2))} L${Pt(W(L, z0 - 0.2))}" stroke="#4a4236" stroke-width=".8" opacity=".55"/>`;
    }
    for (let s0 = 3; s0 < 60; s0 += 6 + rnd() * 5) k += `<path d="${poly([M2(s0, -13), M2(s0 + 2.6, -13), M2(s0 + 1.6, -19), M2(s0 - 0.8, -17.5)])}" fill="#c9bda4"/><path d="${poly([M2(s0 + 1.2, -13), M2(s0 + 2.6, -13), M2(s0 + 1.6, -19)])}" fill="#6f6553"/>`;
  }
  S.teil({ id: "felsen", de: "der Felsen", syl: "FEL-sen", it: "la roccia", itSyl: "ROC-cia", en: "rock", x: 0, y: 0, kunst: k,
    tipp: "Das Schloss steht auf einem Felsgrat. Die Kalkwände fallen fast senkrecht zur Pöllatschlucht ab." });
}

/* =====================================================================
   5 — DER WALD (am Schlossberg unter den Felswänden und am Westhang)
   ===================================================================== */
{
  /* Gegenhang unter dem Schloss: fällt ohne Absatz von der Felswand bis in die Kerbe. Oben im Nachmittagslicht,
     nach unten immer dunkler und blauer; Rinnen und Felsrippen laufen hangab, Fichten stehen in schrägen Reihen. */
  const GEGEN = [[-1, 140], [24, 139], [50, 136], [72, 133], ...WALDKANTE.map(([x, y]) => [x, y - 2]), [298, 142], [330, 135], [370, 130], [401, 128], ...NAH_OBEN.slice().reverse(), ...KEIL_R.slice().reverse().slice(1), ...LINKS_OBEN.slice(1)];
  let k = waldflaeche("bergclip", GEGEN, 2.0, 30, "#5c4a26", 0.8, HERBST, -4);
  k += saum([[0, 141], [36, 138], [72, 134]], 2.2, 3.6, 0.5);
  k += saum([[298, 143], [330, 136], [370, 131], [401, 129]], 1.6, 3.2, 0.5);
  S.def(`<clipPath id="${S.id("gegenclip")}"><path d="${poly(GEGEN)}"/></clipPath>`);
  let rinne = "";
  /* Rinnen (dunkel) und Rippen (Fels, hell) laufen steil hangab zur Kerbe */
  for (const [x0, y0, x1, y1, hell] of [[96, 184, 80, 224, 0], [118, 166, 104, 230, 1], [134, 152, 124, 236, 0], [152, 150, 146, 240, 1], [170, 150, 166, 246, 0], [190, 151, 186, 250, 1], [212, 153, 210, 254, 0], [236, 156, 234, 250, 1], [260, 156, 260, 232, 0], [24, 150, 16, 218, 0], [50, 146, 42, 220, 1], [70, 140, 64, 220, 0]]) {
    if (hell) { let d = `M${x0} ${y0}`, d2 = ` L${x0 + 3.5} ${y0}`; for (let i = 1; i <= 6; i++) { const t = i / 6, x = x0 + (x1 - x0) * t + (rnd() - 0.5) * 3, y = y0 + (y1 - y0) * t; d += ` L${r(x)} ${r(y)}`; d2 = ` L${r(x + 3 + rnd() * 3)} ${r(y)}` + d2; } rinne += `<path d="${d}${d2} Z" fill="#a89c84" opacity=".5"/><path d="${d}" stroke="#e2d8c2" stroke-width=".45" fill="none" opacity=".55"/>`; }
    else rinne += `<path d="M${x0} ${y0} Q${(x0 + x1) / 2 + 3} ${(y0 + y1) / 2} ${x1} ${y1} L${x1 + 6} ${y1} Q${(x0 + x1) / 2 + 7} ${(y0 + y1) / 2} ${x0 + 3} ${y0} Z" fill="#141018" opacity=".42"/>`;
  }
  /* Fichten in schrägen Reihen am Hang (Licht links) */
  for (let reihe = 0; reihe < 7; reihe++) for (let i = 0; i < 9; i++) {
    const x = 10 + reihe * 34 + i * 6 + rnd() * 3, y = 150 + i * 9 - reihe * 2 + rnd() * 3, q = 1.4 + (y - 150) / 70;
    if (!drin(x, y, GEGEN) || rnd() < 0.35) continue;
    rinne += `<path d="M${r(x - q)} ${r(y + q)} L${r(x)} ${r(y - q * 3)} L${r(x + q)} ${r(y + q)} Z" fill="${NADEL[(reihe + i) % 4]}"/><path d="M${r(x - q * 0.6)} ${r(y)} L${r(x)} ${r(y - q * 3)} L${r(x)} ${r(y + q * 0.5)} Z" fill="#8aa874" opacity=".35"/>`;
  }
  k += `<g clip-path="url(#${S.id("gegenclip")})">${rinne}</g>`;
  /* Luft und Licht: oben warm und dunstig, nach unten zur Kerbe kühl und dunkel */
  k += `<path d="${poly(GEGEN)}" fill="${S.lg("bergtiefe", [[0, "#d6e0ea", 0.3], [0.22, "#c9d6e2", 0.1], [0.48, "#1a2236", 0.36], [0.8, "#06080e", 0.7], [1, "#06080e", 0.86]])}"/>`;
  /* Schlagschatten des Torhauses nach rechts auf Straße und Wald */
  k += `<path d="M281 138 L312 146 L306 162 L276 152 Z" fill="#1a2030" opacity=".3"/>`;
  S.teil({ id: "wald", de: "der Wald", syl: "WALD", it: "il bosco", itSyl: "BO-sco", en: "forest", x: 0, y: 0, kunst: k,
    tipp: "Im Herbst werden Buchen und Lärchen goldgelb. Die Fichten bleiben dunkelgrün." });
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
  /* Helmformen: achteckig = gerade Pyramide mit Graten; schlank = eingezogene Turmspitze; stumpf = bauchiger,
     niedriger Kegel; sonst leicht eingezogen */
  const hh = t[1] - sp[1], form = opt.helm || (opt.acht ? "acht" : "rund");
  if (form === "acht") {
    g += `<path d="M${r(t[0] - w - 0.5)} ${r(t[1] - 0.5)} L${r(sp[0])} ${r(sp[1])} L${r(t[0] + w + 0.5)} ${r(t[1] - 0.5)} Z" fill="${SCHIEFER_RUND}"/>`;
    g += `<path d="M${r(t[0] - w - 0.5)} ${r(t[1] - 0.5)} L${r(sp[0])} ${r(sp[1])} L${r(t[0] - w * 0.5)} ${r(t[1] + 0.1)} Z" fill="#c6ccd4" opacity=".45"/>`;
    g += `<path d="M${r(t[0] - w * 0.5)} ${r(t[1] + 0.1)} L${r(sp[0])} ${r(sp[1])} M${r(t[0] + w * 0.5)} ${r(t[1] + 0.1)} L${r(sp[0])} ${r(sp[1])}" stroke="#2c323a" stroke-width=".22" opacity=".5"/>`;
  } else {
    const [cq, ch] = form === "schlank" ? [0.08, 0.55] : form === "stumpf" ? [0.8, 0.55] : [0.25, 0.45];
    g += `<path d="M${r(t[0] - w - 0.6)} ${r(t[1] - 0.5)} Q${r(t[0] - w * cq)} ${r(t[1] - hh * ch)} ${r(sp[0])} ${r(sp[1])} Q${r(t[0] + w * cq)} ${r(t[1] - hh * ch)} ${r(t[0] + w + 0.6)} ${r(t[1] - 0.5)} Z" fill="${SCHIEFER_RUND}"/>`;
    g += `<path d="M${r(t[0] - w - 0.2)} ${r(t[1] - 0.8)} Q${r(t[0] - w * (cq + 0.15))} ${r(t[1] - hh * ch)} ${r(sp[0] - 0.1)} ${r(sp[1] + 0.8)} L${r(t[0] - w * 0.15)} ${r(t[1] - 0.8)} Z" fill="#c6ccd4" opacity=".4"/>`;
  }
  g += `<line x1="${r(sp[0])}" y1="${r(sp[1])}" x2="${r(sp[0])}" y2="${r(sp[1] - 2.4)}" stroke="#9a7a2a" stroke-width=".3"/><circle cx="${r(sp[0])}" cy="${r(sp[1] - 1.2)}" r=".45" fill="${GOLD}"/>`;
  return g;
}
/* Satteldach: Traufe (u0,v0)–(u1,v1) auf zt, First parallel, versetzt um (du,dv) auf zf */
const dachFl = (a, b, zt, du, dv, zf) => poly([C(a[0], a[1], zt), C(b[0], b[1], zt), C(b[0] + du, b[1] + dv, zf), C(a[0] + du, a[1] + dv, zf)]);

/* Hofpflaster als Fugennetz auf der Ebene z, und Besucher als kleine Figuren (1,7 m) */
function pflaster(u0, u1, v0, v1, z, schritt = 3) {
  let d = "";
  for (let u = u0 + schritt; u < u1; u += schritt) d += `M${Pt(C(u, v0, z))} L${Pt(C(u, v1, z))} `;
  for (let v = v0 + schritt; v < v1; v += schritt) d += `M${Pt(C(u0, v, z))} L${Pt(C(u1, v, z))} `;
  return `<path d="${d}" stroke="#8e8470" stroke-width=".18" opacity=".55" fill="none"/>`;
}
function besucher(liste, z) {
  const FA = ["#b8473a", "#2f5f95", "#3e6a3a", "#c89a3a", "#5a4a6a", "#d8d2c4"];
  let g = "";
  liste.forEach(([u, v], i) => {
    const [x, y] = C(u, v, z), h = 1.7 * k1(u, v), w = h * 0.3;
    g += `<ellipse cx="${r(x + w * 0.8)}" cy="${r(y)}" rx="${r(w * 1.2)}" ry="${r(w * 0.3)}" fill="#2a3040" opacity=".3"/><rect x="${r(x - w / 2)}" y="${r(y - h * 0.82)}" width="${r(w)}" height="${r(h * 0.5)}" fill="${FA[i % FA.length]}"/><rect x="${r(x - w * 0.4)}" y="${r(y - h * 0.34)}" width="${r(w * 0.8)}" height="${r(h * 0.34)}" fill="#3a3a44"/><circle cx="${r(x)}" cy="${r(y - h * 0.9)}" r="${r(w * 0.42)}" fill="#e2b896"/>`;
  });
  return g;
}
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
  const zDach = (u) => ZF - (ZF - ZT) * u / 12;
  for (const v of [-8, 12]) k += `<path d="${poly([C(3.2, v - 0.9, zDach(3.2)), C(4.8, v + 0.9, zDach(4.8)), C(11, v + 6.4, zDach(11)), C(10.2, v + 4.2, zDach(10.2))])}" fill="#1c2028" opacity=".38"/>`;
  for (const v of [-8, 12]) { const a = C(4, v, 42.6), b = C(4, v, 50); const w = 0.9 * k1(4, v); k += `<rect x="${r(a[0] - w)}" y="${r(b[1])}" width="${r(2 * w)}" height="${r(a[1] - b[1])}" fill="#ece6da"/><rect x="${r(a[0])}" y="${r(b[1])}" width="${r(w)}" height="${r(a[1] - b[1])}" fill="#b9b4aa"/><rect x="${r(a[0] - w - 0.3)}" y="${r(b[1] - 0.6)}" width="${r(2 * w + 0.6)}" height=".8" fill="#cfc8b8"/><path d="M${r(a[0] - w - 0.6)} ${r(a[1])} L${r(a[0] + w + 0.6)} ${r(a[1] - 0.4)}" stroke="#3a4048" stroke-width=".6"/>`; }
  /* Ecktürmchen am Südgiebel (achteckig, aus Konsolen) und an der Nordostecke */
  k += rundturm(13.6, 26, 1.9, 18, 38, 10, { acht: true, fenster: [[30, 0]] });
  for (const [u, v] of [[-12, -26], [12, -26]]) {
    const c0 = C(u, v, 16);
    k += `<path d="M${r(c0[0] - 1.9 * k1(u, v))} ${r(c0[1])} Q${r(c0[0])} ${r(c0[1] + 4.2)} ${r(c0[0] + 1.9 * k1(u, v))} ${r(c0[1])} Z" fill="${u < 0 ? "#efe6d4" : "#c9c4ba"}"/>`;
    k += rundturm(u, v, 1.9, 16, 39, 13.5, { acht: true, fenster: [[22, 0], [31, 0]] });
  }
  SCHLOSS_UNTER.push({ id: "palas", de: "der Palas", syl: "PA-las", it: "il palazzo", itSyl: "pa-LAZ-zo", en: "great hall", pts: [PS(0, -12), PS(24, -4), PS(24, 18.6), PS(0, 18.6)],
    tipp: "Der Palas ist das Hauptgebäude. Er hat fünf Stockwerke und ist außen aus hellem Kalkstein." });
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
    k += pflaster(13, 46, -14, 12, 0, 2.6);
    k += `<path d="${poly([C(12.4, -14, 0), C(22, -14, 0), C(26, 12, 0), C(13.4, 12, 0)])}" fill="#2a3040" opacity=".22"/>`;
    k += besucher([[30, -6], [34, 2], [38, -10], [41, 4]], 0);
    SCHLOSS_UNTER.push({ id: "hof", de: "der Hof", syl: "HOF", it: "il cortile", itSyl: "cor-TI-le", en: "courtyard", pts: [C(24, -14, 0), C(46, -14, 0), C(46, 12, 0), C(26, 12, 0)], dick: 3,
      tipp: "Um den Hof stehen Palas, Kemenate, Ritterhaus und Torhaus." });
  }
  /* ---------- TREPPENTÜRME vor der Hofseite: südlicher und NORDTURM ---------- */
  k += rundturm(16, -5, 2.7, 0, 40, 11, { acht: true, fenster: [[8, -0.3], [15, 0.2], [22, -0.2], [29, 0.3], [35, 0]] });
  {
    const u = 16.5, v = 5, rad = 3.6, kk = k1(u, v);
    k += rundturm(u, v, rad, 0, 58, 16, { helm: "schlank", fenster: [[6, 0.3], [12, -0.2], [18, 0.25], [24, -0.25], [30, 0.2], [36, -0.2], [42, 0.25], [48, 0]] });
    /* Laternengeschoss mit Bogenfenstern und Konsolfries unter dem Helm */
    const t = C(u, v, 58), w = rad * kk;
    for (let i = 0; i < 4; i++) { const x = t[0] - w * 0.75 + i * w * 0.5; k += `<path d="M${r(x - 0.55)} ${r(t[1] + 4.4)} v-2.6 a.55 .55 0 0 1 1.1 0 v2.6 Z" fill="${GLAS_S}"/>`; }
    for (let i = 0; i < 7; i++) k += `<path d="M${r(t[0] - w + i * w / 3)} ${r(t[1] + 0.3)} q.4 .9 .8 0" fill="#cfc8b8"/>`;
    SCHLOSS_UNTER.push({ id: "turm", de: "der Turm", syl: "TURM", it: "la torre", itSyl: "TOR-re", en: "tower", pts: [[t[0] - w - 1, C(u, v, 74)[1] - 1], [t[0] + w + 1, C(u, v, 74)[1] - 1], [t[0] + w + 1, C(u, v, 24)[1]], [t[0] - w - 1, C(u, v, 24)[1]]],
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
    /* Schlagschatten des Ecktürmchens am Palas (Sonne Südwest) schräg über das Kemenatendach */
    k += `<path d="${poly([C(12.2, -26, 18), C(16, -26, 18), C(21.6, -20, 26), C(17.8, -20, 26)])}" fill="#1c2028" opacity=".3"/>`;
    /* drei Geschosse, gegen die fünf des Palas versetzt (eigene Höhen, eigene Achsen) */
    for (const z of [3.2, 9.8]) k += `<path d="M${Pt(KS(0.6, z))} L${Pt(KS(26, z))}" stroke="#ddd0b8" stroke-width=".45"/>`;
    for (const s of [4.2, 10.6, 16.4, 22]) k += bogen(KS, s, -2.2, 2, 3.2, 2) + bogen(KS, s - 0.3, 4.4, 2.6, 3.8, 2) + bogen(KS, s - 0.5, 11.2, 3, 4.2, 3);
    /* Baufuge zum Palas: die Kemenate springt etwas zurück – Schattenstreifen rechts der Fuge, Lichtkante am Palas */
    k += `<path d="${poly([KS(0, -4), KS(0.7, -4), KS(0.7, 17.6), KS(0, 18)])}" fill="#6e6a64" opacity=".45"/><path d="M${Pt(KS(0, -4))} L${Pt(KS(0, 18))}" stroke="#fffaf0" stroke-width=".35"/>`;
    for (const s of [7, 17]) { const a = C(12 + s, -25.4, 21.8), b = C(12 + s + 2.2, -25.4, 21.8), sp = C(12 + s + 1.1, -25.4, 24), u1 = C(12 + s, -25.4, 19.6), u2 = C(12 + s + 2.2, -25.4, 19.6); k += `<path d="${poly([u1, a, sp, b, u2])}" fill="#f3ead8"/><path d="${poly([C(12 + s + 0.6, -25.6, 19.9), C(12 + s + 1.6, -25.6, 19.9), C(12 + s + 1.6, -25.6, 21.4), C(12 + s + 0.6, -25.6, 21.4)])}" fill="${GLAS_S}"/>`; }
    /* schlanker Rundturm an der Südostecke */
    k += rundturm(38.6, -26.6, 2.1, -2, 25, 5.6, { helm: "stumpf", fenster: [[4, 0], [10, 0], [16, 0], [21, 0]] });
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
  k += pflaster(46, 98, -22, 12, -4, 3.2);
  /* Schatten der Ringmauer fällt nach Norden in den Hof */
  k += `<path d="${poly([C(46, -22, -4), C(98, -20, -4), C(98, -13, -4), C(50, -15.6, -4)])}" fill="#2a3040" opacity=".26"/>`;
  k += besucher([[62, -8], [66, -4], [74, 2], [80, -10], [88, -2], [92, 6], [70, 8]], -4);
  /* Viereckturm */
  const VS = wandFn(46, 4, 54, 4), VO = wandFn(54, 4, 54, 12);
  k += `<path d="${wandFl(VS, 0, 8, -4, 40)}" fill="${KALK_SUED}"/><path d="${wandFl(VS, 0, 8, -4, 40)}" fill="${QUADER}" opacity=".55"/>`;
  k += `<path d="${wandFl(VO, 0, 8, -4, 40)}" fill="${KALK_OST}"/>`;
  for (const z of [4, 11, 18, 25, 32]) k += bogen(VS, 2.6, z, 2.8, 3.8, 2) + bogen(VO, 2.6, z, 2.6, 3.6, 2, GLAS, "#d6d8de");
  /* Konsolfries und Zinnenkranz der Plattform */
  k += `<path d="${poly([VS(-0.5, 40), VS(8.5, 40), VO(8.5, 40), VO(8.5, 41.4), VS(8.5, 41.4), VS(-0.5, 41.4)])}" fill="#f4ede0"/>`;
  for (let s = -0.4; s < 8.4; s += 1.4) k += `<path d="${poly([VS(s, 41.4), VS(s + 0.8, 41.4), VS(s + 0.8, 42.8), VS(s, 42.8)])}" fill="#fbf4e6"/>`;
  for (let s = 0.4; s < 8.4; s += 1.4) k += `<path d="${poly([VO(s, 41.4), VO(s + 0.8, 41.4), VO(s + 0.8, 42.8), VO(s, 42.8)])}" fill="#c8cad2"/>`;
  k += rundturm(51.5, 8, 1.6, 41.4, 47, 5.2, { helm: "stumpf", fenster: [[43.4, 0]] });
  /* Schatten des Turms nach Nordosten auf die Galerie */
  k += `<path d="${poly([C(54, 12, 5), C(62, 12.2, 5), C(60, 12.2, -4), C(54, 12, -4)])}" fill="#2a3040" opacity=".22"/>`;
  S.teil({ id: "viereckturm", de: "der Viereckturm", syl: "VIER-eck-turm", it: "la torre quadrata", itSyl: "TOR-re qua-DRA-ta", en: "square tower", x: 0, y: 0, kunst: k,
    tipp: "Der Viereckturm ist 45 Meter hoch. Oben hat er eine Plattform mit einem kleinen runden Türmchen." });
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
  /* Schlagschatten des Kemenate-Rundturms (Sonne Südwest) auf die Mauer */
  k += `<path d="${poly([M(0.2, -8), M(4.6, -8), M(8.4, 3.6), M(3.6, 3.6)])}" fill="#2a3040" opacity=".22"/>`;
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
/* Fahrstraße: in den Hang geschnitten, steigt vom rechten Bildrand an und endet als Wendeplatz deutlich UNTER dem
   Torhaus. Das letzte Stück bis zum Tor geht man zu Fuß (Fußweg mit Besuchern). */
const STRASSE = [[402, 161], [374, 158], [346, 156], [320, 154.6], [300, 153.6]];
{
  const breite = (x) => 1.8 + (x - 300) / 100 * 1.8;
  const oben = STRASSE.map(([x, y]) => [x, y - breite(x) / 2]), unten = STRASSE.map(([x, y]) => [x, y + breite(x) / 2]);
  let k = `<path d="${poly([...unten.map(([x, y]) => [x, y + 0.2]), ...unten.slice().reverse().map(([x, y]) => [x, y + 2.4 + (x - 300) / 60])])}" fill="#4a3a22"/>`;
  k += `<path d="${poly([...oben, ...unten.slice().reverse()])}" fill="${S.lg("fahrbahn", [[0, "#cbbfa2"], [1, "#a89878"]])}"/>`;
  k += `<path d="M${oben.map(Pt).join(" L")}" stroke="#6e5c3a" stroke-width=".4" fill="none"/>`;
  k += `<ellipse cx="300" cy="153.4" rx="5" ry="1.6" fill="#c2b598"/>`;
  /* Fußweg zum Tor mit drei Besuchern */
  k += `<path d="M298 152.6 L288 150.2 L276 147.6 L266 144.4" stroke="#d2c6a8" stroke-width="1" fill="none"/>`;
  for (const [x, y, f] of [[289, 150.4, "#b8473a"], [280, 148.4, "#2f5f95"], [271, 146, "#3e6a3a"]]) k += `<rect x="${x - 0.5}" y="${y - 2.6}" width="1" height="1.6" fill="${f}"/><rect x="${x - 0.4}" y="${y - 1}" width=".8" height="1" fill="#3a3a44"/><circle cx="${x}" cy="${y - 3}" r=".45" fill="#e2b896"/>`;
  /* Kronen talseits vor der Böschung */
  k += saum(unten.map(([x, y]) => [x, y + 3.4]), 1.4, 3.4, 0.45);
  /* Kutsche fährt bergauf nach links (zum Schloss), Pferde vorn */
  const x = 352, y = 156.6, s = 1.9, winkel = -4;
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
  const scher = `translate(${r(x)} ${r(y)}) rotate(${winkel})`;
  k += `<g transform="${scher}">${g}</g>`;
  S.teil({ oben: true, id: "kutsche", de: "die Kutsche", syl: "KUT-sche", it: "la carrozza", itSyl: "car-ROZ-za", en: "carriage", x: 0, y: 0, kunst: k + `<g transform="${scher}">${flaeche(-5.6 * s, -3 * s, 9.6 * s, 3.2 * s)}</g>`,
    tipp: "Die Kutsche fährt bis unter das Schloss. Das letzte Stück geht man zu Fuß.",
    zoom: { x: r(x - 19), y: r(y - 20), w: 36, h: 24 },
    unter: [
      { id: "pferd", de: "das Pferd", syl: "PFERD", it: "il cavallo", itSyl: "ca-VAL-lo", en: "horse", x, y, kunst: `<g transform="rotate(${winkel})">${flaeche(-4.3 * s, -2.7 * s, 3.2 * s, 2.7 * s)}</g>`,
        tipp: "Zwei Pferde ziehen die Kutsche bergauf." },
    ] });
}

/* =====================================================================
   11 — DIE SCHLUCHT: die dunkle Kerbe mit dem Bachfaden, links und rechts
        die Hänge direkt unter uns (Kronen von oben). Lupe: der Bach
   ===================================================================== */
const kuppe = (cx, cy, q, dunkel) => {
  const P0 = dunkel ? ["#3a2410", "#7a4a1e", "#b07a34"] : ["#5a3212", "#a85e24", "#e0a040"];
  return `<path d="${wellig(cx + q * 0.08, cy + q * 0.1, q, q * 0.72, 9)}" fill="${P0[0]}"/><path d="${wellig(cx - q * 0.14, cy - q * 0.14, q * 0.74, q * 0.52, 8)}" fill="${P0[1]}"/><path d="${wellig(cx - q * 0.34, cy - q * 0.3, q * 0.34, q * 0.24, 6)}" fill="${P0[2]}"/>`;
};
const sternFichte = (cx, cy, q) => { let g = ""; for (const [f, rr] of [["#1e3424", 1], ["#2c4a32", 0.72], ["#46684a", 0.42]]) { let d = ""; for (let i = 0; i < 20; i++) { const a = i / 20 * Math.PI * 2 + rr, rad = (i % 2 ? 0.78 : 1) * q * rr * (0.9 + rnd() * 0.2); d += (i ? " L" : "M") + `${r(cx + Math.cos(a) * rad)} ${r(cy + Math.sin(a) * rad * 0.7)}`; } g += `<path d="${d} Z" fill="${f}"/>`; } return g + `<circle cx="${r(cx - q * 0.1)}" cy="${r(cy - q * 0.08)}" r="${r(q * 0.12)}" fill="#7a9a6a"/>`; };
{
  let k = "";
  /* diesseits links (Westufer unter der Brücke, im Schatten) und rechts (Ostufer, Licht von links) */
  const NAHL = [...KEIL_L.slice().reverse(), ...LINKS_OBEN.slice(1), [-1, 262]], NAHR = [...NAH_OBEN, [401, 262]];
  k += waldflaeche("nahlclip", NAHL, 4.2, 10, "#2e2414", 0.9, HERBST, 24) + waldflaeche("nahrclip", NAHR, 4.8, 14, "#4a3018", 0.92, HERBST, -12);
  let kl = "", kr = "";
  for (const [x, y, q] of [[372, 236, 15], [318, 250, 14], [386, 202, 10], [262, 238, 11], [350, 188, 9]]) kr += laubBusch(x, y, q, q * 0.72);
  for (const [x, y, q] of [[296, 214, 8], [232, 244, 9]]) kr += sternFichte(x, y, q);
  k += `<g clip-path="url(#${S.id("nahlclip")})">${kl}<rect x="0" y="215" width="200" height="46" fill="${S.lg("nahlschatten", [[0, "#0a0c14", 0.15], [1, "#0a0c14", 0.45]], 0, 0, 1, 0)}"/></g>`;
  k += `<g clip-path="url(#${S.id("nahrclip")})">${kr}<rect x="185" y="160" width="215" height="102" fill="${S.lg("nahrschatten", [[0, "#0a0c14", 0.55], [0.35, "#0a0c14", 0.1], [1, "#0a0c14", 0]], 0, 0, 1, 0)}"/></g>`;
  /* die Kerbe: tiefster und dunkelster Bereich, nach unten breiter */
  /* die Kerbe als Keil: unten (nah, tief unter uns) breit, nach links oben unter die Palaswand spitz zulaufend */
  const KEIL = [...KEIL_L, ...KEIL_R.slice(1)], OB = KEIL_R, UN = KEIL_L;
  k += `<path d="${poly(KEIL)}" fill="${S.lg("kerbe", [[0, "#05060a"], [0.5, "#0c0f16"], [1, "#1a1f2c"]], 0, 0, 0, 1)}"/>`;
  /* Steilwände im Keil: links (Westufer) ein Hauch Licht, rechts Schatten; einzelne dunkle Kronen an den Kanten */
  k += `<path d="${poly([...KEIL_L, [100, 240], [120, 262]])}" fill="#2a2a2c" opacity=".6"/>`;
  /* der Bach: nur ein heller Faden, mit kleinen weißen Schwällen */
  k += `<path d="M${KERBE.slice(0, 5).map(Pt).join(" L")}" stroke="${S.lg("bachfaden", [[0, "#5e7078", 0], [0.4, "#8fa4ac", 0.7], [1, "#a8bcc4", 0.9]], 1, 0, 0, 0)}" stroke-width=".9" fill="none"/>`;
  /* Hänge laufen weich in die Kerbe: dunkle Säume oberhalb und unterhalb */
  k += `<path d="${poly([...OB.map(([x, y]) => [x, y - 9]), ...OB.slice().reverse()])}" fill="#0c0e14" opacity=".4"/>`;
  for (let i = 0; i < 6; i++) { const [x, y] = KERBE[1 + Math.floor(rnd() * 3)]; k += `<ellipse cx="${r(x + rnd() * 6 - 3)}" cy="${r(y + rnd() * 1.2 - 0.6)}" rx=".9" ry=".35" fill="#e6f0f2"/>`; }
  /* Gischt steigt in Fahnen aus der Kerbe auf */
  for (const [x, y, h] of [[176, 254, 30], [148, 244, 22], [118, 236, 14]]) k += `<path d="M${x - 5} ${y} Q${x - 9} ${y - h * 0.5} ${x - 3} ${y - h} Q${x + 2} ${y - h * 0.6} ${x + 6} ${y} Z" fill="#e8eff2" opacity=".22" filter="url(#${S.id("dunst")})"/>`;
  const BACH = KERBE[2];
  S.teil({ id: "schlucht", de: "die Schlucht", syl: "SCHLUCHT", it: "la gola", itSyl: "GO-la", en: "gorge", x: 0, y: 0, kunst: k + `<path class="bw-flaeche" d="${poly(KEIL)}" fill="rgba(255,255,255,0.001)"/>`,
    tipp: "Die Pöllatschlucht ist tief und eng. Unten rauscht die Pöllat, direkt unter der Brücke stürzt sie als Wasserfall hinab.",
    zoom: { x: 104, y: 202, w: 96, h: 64 },
    unter: [
      { id: "bach", de: "der Bach", syl: "BACH", it: "il torrente", itSyl: "tor-REN-te", en: "stream", x: BACH[0], y: BACH[1] + 6, kunst: `<path class="bw-flaeche" d="M${KERBE.slice(0, 5).map(([x, y]) => `${r(x - BACH[0] - 6)} ${r(y - BACH[1] - 12)}`).join(" L")} L${KERBE.slice(0, 5).reverse().map(([x, y]) => `${r(x - BACH[0] + 6)} ${r(y - BACH[1])}`).join(" L")} Z" fill="rgba(255,255,255,0.001)"/>`,
        tipp: "Die Pöllat ist ein Gebirgsbach. Sie fließt durch die Schlucht hinunter ins Tal." },
    ] });
}

/* =====================================================================
   12 — DIE FICHTE (unten am diesseitigen Hang, von oben gesehen) und
   13 — DIE BUCHE (vorn links: Stamm von unten, Äste, Laubballen an den Astenden)
   ===================================================================== */
{
  const x = 338, y = 206, q = 12;
  const k = `<ellipse cx="${x + 4}" cy="${y + 5}" rx="${q}" ry="${q * 0.5}" fill="#120c06" opacity=".35"/>` + sternFichte(x, y, q);
  S.teil({ id: "fichte", de: "die Fichte", syl: "FICH-te", it: "l'abete rosso", itSyl: "a-BE-te ROS-so", en: "spruce", x: 0, y: 0, kunst: k,
    tipp: "Die Fichte wächst unten am Hang. Von der Brücke aus sieht man von oben auf ihre Spitze." });
}
{
  /* eine Buche als Figur: glatter silbergrauer Stamm mit Licht- und Schattenseite, jeder Ballen sitzt an einem Astende */
  const STAMM = S.lg("buchenstamm", [[0, "#d6d8d4"], [0.5, "#a9aca8"], [1, "#6e716e"]], 0, 0, 1, 0);
  let k = `<path d="M-1 262 L-1 236 Q14 224 30 212 L36 218 Q18 236 12 262 Z" fill="${STAMM}"/>`;
  const aeste = [[30, 213, 18, 196, 2.2], [32, 214, 50, 198, 2.4], [34, 216, 66, 214, 1.8], [24, 222, 6, 206, 1.6], [44, 204, 56, 186, 1.2], [56, 199, 74, 194, 1.1]];
  for (const [x0, y0, x1, y1, w] of aeste) k += `<path d="M${x0} ${y0} Q${(x0 + x1) / 2 + 2} ${(y0 + y1) / 2 + 2} ${x1} ${y1}" stroke="#9a9d99" stroke-width="${w}" fill="none" stroke-linecap="round"/><path d="M${x0} ${y0 - 0.6} Q${(x0 + x1) / 2 + 1.4} ${(y0 + y1) / 2 + 1.2} ${x1} ${y1 - 0.4}" stroke="#dcdeda" stroke-width="${r(w * 0.3)}" fill="none"/>`;
  /* Laubballen an den Astenden, nach außen kleiner */
  for (const [cx, cy, rx] of [[50, 194, 13], [18, 192, 12], [66, 210, 11], [6, 204, 9], [58, 182, 9], [78, 190, 8], [36, 186, 10]]) k += laubBusch(cx, cy, rx, rx * 0.72);
  S.teil({ id: "buche", de: "die Buche", syl: "BU-che", it: "il faggio", itSyl: "FAG-gio", en: "beech", x: 0, y: 0, kunst: k,
    tipp: "Die Buche hat eine glatte, silbergraue Rinde. Im Oktober leuchten ihre Blätter kupferrot und golden." });
}

/* =====================================================================
   14 — DAS GELÄNDER der Marienbrücke: genietetes Rautengitter aus Flachstahl,
        alles mit der Entfernung verkürzt (rechts nah, links fern), Pfosten mit
        Knotenblech, Handlauf mit Oberseite und Glanzkante
   ===================================================================== */
{
  const NR = 1.5, zO = EYE - 0.45, zH = zO - 0.05, zU = EYE - 1.62, BR = 0.045;
  const Pg = (E, z, n = NR) => proj(E, n, z);
  const band = (E0, z0, E1, z1, w) => zuschnitt([Pg(E0 - w / 2, z0), Pg(E0 + w / 2, z0), Pg(E1 + w / 2, z1), Pg(E1 - w / 2, z1)]);
  let dunkel = "", hell = "";
  for (let E = -6; E <= 1.4; E += 0.25) {
    for (const [E1, sg] of [[E + 0.6, 1], [E - 0.6, -1]]) {
      const q = band(E, zH, E1, zU, BR); if (q.length > 2) dunkel += `M${q.map(Pt).join(" L")} Z `;
      const h = band(E - sg * 0.012, zH, E1 - sg * 0.012, zU, 0.012); if (h.length > 2) hell += `M${h.map(Pt).join(" L")} Z `;
    }
  }
  let k = `<path d="${dunkel}" fill="#2a2f35"/><path d="${hell}" fill="#7f8a92"/>`;
  /* Nietköpfe an den Kreuzungen */
  for (let E = -6; E <= 0.6; E += 0.25) for (let n = 1; n <= 4; n++) {
    const u = n * 0.25 / 1.2, Ek = E + u * 0.6, z = zH - u * (zH - zU), [x, y] = Pg(Ek, z), rr = F * 0.014 / tief(Ek, NR);
    if (x < 1 || x > 399 || y < 1 || y > 259) continue;
    k += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(rr)}" fill="#4a525a"/><circle cx="${r(x - rr * 0.3)}" cy="${r(y - rr * 0.3)}" r="${r(rr * 0.4)}" fill="#9aa4ac"/>`;
  }
  /* Pfosten mit Knotenblech */
  for (const E of [-3.9, -1.6]) {
    const q = band(E, zH, E, zU, 0.06); if (q.length > 2) k += `<path d="${poly(q)}" fill="#22272c"/>`;
    const g = zuschnitt([Pg(E - 0.12, zH), Pg(E + 0.12, zH), Pg(E + 0.045, zH - 0.12), Pg(E - 0.045, zH - 0.12)]); if (g.length > 2) k += `<path d="${poly(g)}" fill="#2e343a"/>`;
  }
  /* Handlauf: Vorderseite dunkel, Oberseite hell mit Glanzkante direkt darauf */
  const v = zuschnitt([Pg(-7, zO), Pg(0.8, zO), Pg(0.8, zH), Pg(-7, zH)]), o = zuschnitt([Pg(-7, zO, NR + 0.07), Pg(0.8, zO, NR + 0.07), Pg(0.8, zO), Pg(-7, zO)]);
  k += `<path d="${poly(v)}" fill="#2c3238"/><path d="${poly(o)}" fill="#8e989f"/>`;
  { const g2 = strecke(Pg(-7, zO, NR + 0.02), Pg(0.8, zO, NR + 0.02)); if (g2) k += `<path d="M${Pt(g2[0])} L${Pt(g2[1])}" stroke="#e2e8ec" stroke-width="${r(F * 0.008 / 2)}"/>`; }
  S.teil({ id: "gelaender", de: "das Geländer", syl: "ge-LÄN-der", it: "la ringhiera", itSyl: "rin-GHIE-ra", en: "railing", x: 0, y: 0, kunst: k,
    tipp: "Wir stehen auf der Marienbrücke und schauen über das Geländer. Die Brücke führt in etwa 90 Metern Höhe über die Pöllatschlucht." });
}

/* Licht: warmer Nachmittagsschein von links */
S.davor(`<rect width="400" height="260" fill="${S.lg("abendlicht", [[0, "#ffd9a0", 0.1], [0.5, "#ffd9a0", 0], [1, "#ffd9a0", 0]], 0, 0, 1, 0)}"/>`);

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/neuschwanstein.js"));
console.log(aus);
