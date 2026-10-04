#!/usr/bin/env node
/* =====================================================================
   KANADA – NIAGARAFÄLLE (FASSUNG 854) — Bilderwelt neu
   ---------------------------------------------------------------------
   XANDER (03.10.): „die bekanntesten Städte in anderen Ländern, die
   berühmt für irgendetwas sind … als Profi-Grafikdesigner auf
   Hollywood-Niveau … mit größter Sorgfalt und Präzision“.

   RECHERCHE (Niagara Parks, Lagepläne Queen Victoria Park/Table Rock,
   Maße der Fälle, Niagara City Cruises, Skylon Tower, Sonnenstand
   Anfang Oktober):
   - STANDORT: TABLE ROCK am kanadischen Ufer (Niagara Falls, Ontario),
     an der Steinmauer direkt an der Abbruchkante, wenige Meter nördlich
     der Stelle, an der das Wasser der Hufeisenfälle zu Boden stürzt.
     Blick nach OSTNORDOST.
   - RECHTS (Osten bis Südosten): die HUFEISENFÄLLE (Horseshoe Falls,
     „Kanadische Fälle“): 51 m hoch, die Kante rund 790 m lang, als
     Hufeisen geschwungen. Vom Table Rock sieht man die Kante vom nahen
     Teil (rechts, groß) über den tiefsten Punkt bis zur Gegenseite am
     Terrapin Point (Aussichtspunkt auf Goat Island, USA). In der Mitte
     des Hufeisens ist das Wasser so tief, dass die Kante GRÜN leuchtet.
     Aus dem Becken steigt eine riesige GISCHTWOLKE auf, oft über 100 m
     hoch. Steht die Sonne abends im Westen (in unserem Rücken),
     erscheint in der Gischt über der Schlucht ein REGENBOGEN
     (Gegenpunkt der Sonne ≈ 60°, Bogenradius 42°).
   - MITTE: GOAT ISLAND (Ziegeninsel, USA) — flach, mit Herbstwald, die
     Felswand zur Schlucht in Schichten: oben grauer Dolomit (Lockport),
     darunter weichere, dunklere Schichten, unten Schutthalden.
   - LINKS AM RAND (Nordosten, rund 0,9 km): gerade noch der Südteil der
     AMERIKANISCHEN FÄLLE (21–30 m freier Fall auf große Felsbrocken)
     und daneben, hinter der kleinen Luna Island, der schmale BRAUTSCHLEIER
     (Bridal Veil Falls); an seinem Fuß die Holzstege der „Cave of the
     Winds“ mit Besuchern in gelben Capes.
   - IN DER SCHLUCHT: das Ausflugsboot von Niagara City Cruises (früher
     Hornblower) — Katamaran mit zwei Decks, die Fahrgäste in ROTEN
     Regencapes (die US-Boote „Maid of the Mist“ haben blaue), am Heck
     die kanadische Flagge. Es fährt bis in die Gischt im Hufeisen.
     Möwen (Ringschnabelmöwen) segeln über dem Wasser.
   - Der SKYLON TOWER (160 m) steht in unserem Rücken links (Norden, auf
     dem Hügel über dem Queen Victoria Park) — von hier aus ist er mit
     den Fällen nicht im selben Blick; er bleibt deshalb weg.
   - TYPISCHES (Anfang Oktober): ZUCKERAHORN in leuchtendem Rot und Orange
     (das Ahornblatt ist auf der FLAGGE Kanadas), AHORNSIRUP in der
     Flasche in Blattform (Andenken aus dem Table Rock Centre), dazu ein
     Fähnchen in der Andenkentüte; KANADAGÄNSE ziehen im Keil nach Süden;
     SCHWARZE EICHHÖRNCHEN (eine dunkle Form des Grauhörnchens) sind im
     Park sehr häufig. MÜNZFERNROHRE stehen an der Mauer.
   KAMERA: Standpunkt Table Rock (≈ 10 m nördlich der Kante), Augenhöhe
   1,6 m über der Promenade (= Höhe des Flusses oberhalb der Fälle),
   Blick nach 101° (Ost), Brennweite 178, Horizont y = 112. So liegt rechts
   der nahe Abbruch (Peilung bis 150°) im Bild und links die Südhälfte der
   Amerikanischen Fälle (Peilung ≈ 55°); dahinter die Skyline von Niagara
   Falls, NY (Seneca-Hotelturm, 26 Stockwerke, Peilung ≈ 63°). Welt in Metern:
   x Ost, y Nord, z oben, Ursprung an der Westecke der Kante (Table Rock).
   Der Fluss unterhalb der Fälle liegt 52 m tiefer.
   LICHT: 3. Oktober, gegen 18 Uhr (Sonnenuntergang 18:50) — Sonne im
   Westen (Azimut 255°, 9° hoch), also HINTER UNS, etwas rechts. Goldenes
   Abendlicht: nach Westen gewandte Flächen (Amerikanische Fälle, Felswand
   von Goat Island, Westteil der Hufeisenfälle) leuchten warm; der nahe
   Teil des Hufeisens (nach Nordost) liegt im Schatten. Lange Schatten
   fallen nach vorn, leicht links (Richtung 75°). Der Gegenpunkt der Sonne
   liegt 9° unter dem Horizont bei 75°: der Regenbogen steht als hoher
   Bogen über der Schlucht; sichtbar ist er nur, wo Gischt in der Luft ist.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "kanada", titel: "Kanada – Niagarafälle", emoji: "🍁", thema: "Länder", kuerzel: "kan", fassung: 854, breite: 400, hoehe: 260 });
{ const lg = S.lg, rg = S.rg, schon = {}; S.lg = (n, ...a) => schon["l" + n] || (schon["l" + n] = lg(n, ...a)); S.rg = (n, ...a) => schon["r" + n] || (schon["r" + n] = rg(n, ...a)); }
const rnd = zufall(1846);
const r = B.r;
const HOR = 112, F = 178, CX = 200;
const um = (ox, oy, svg) => `<g transform="translate(${r(-ox)} ${r(-oy)})">${svg}</g>`;
const P = (pts, zu = true) => "M" + pts.map(([x, y]) => r(x) + " " + r(y)).join(" L") + (zu ? " Z" : "");
const glatt = (pts, zu = true, k = 1) => {
  let d = `M${r(pts[0][0])} ${r(pts[0][1])}`;
  const n = pts.length, q = (i) => pts[zu ? (i + n) % n : Math.max(0, Math.min(n - 1, i))];
  for (let i = 0; i < (zu ? n : n - 1); i++) {
    const p0 = q(i - 1), p1 = q(i), p2 = q(i + 1), p3 = q(i + 2);
    d += ` C${r(p1[0] + (p2[0] - p0[0]) / 6 * k)} ${r(p1[1] + (p2[1] - p0[1]) / 6 * k)} ${r(p2[0] - (p3[0] - p1[0]) / 6 * k)} ${r(p2[1] - (p3[1] - p1[1]) / 6 * k)} ${r(p2[0])} ${r(p2[1])}`;
  }
  return d + (zu ? " Z" : "");
};
const profilY = (pts, x) => { for (let i = 0; i < pts.length - 1; i++) { const [x0, y0] = pts[i], [x1, y1] = pts[i + 1]; if (x >= Math.min(x0, x1) && x <= Math.max(x0, x1)) return y0 + (y1 - y0) * (x - x0) / (x1 - x0 || 1); } return x < pts[0][0] ? pts[0][1] : pts[pts.length - 1][1]; };
const kappeKreise = (svg, x0 = 0, x1 = 400, y1 = 260) => svg.replace(/<(circle|ellipse) ([^>]*?)\/>/g, (el, tag, at) => {
  const g = (n) => { const m = at.match(new RegExp(" ?" + n + '="([^"]*)"')); return m ? +m[1] : null; };
  const cx = g("cx") || 0, cy = g("cy") || 0; let rx = tag === "circle" ? g("r") : g("rx"), ry = tag === "circle" ? rx : g("ry");
  const f = Math.min(1, Math.max(0, cx - x0) / rx, Math.max(0, x1 - cx) / rx, Math.max(0, y1 - cy) / ry);
  if (f <= 0.05) return "";
  if (f >= 1) return el;
  return tag === "circle" ? el.replace(/ r="[^"]*"/, ` r="${r(rx * f)}"`) : el.replace(/ rx="[^"]*"/, ` rx="${r(rx * f)}"`).replace(/ ry="[^"]*"/, ` ry="${r(ry * f)}"`);
});
const kappeRand = (svg, x0 = -0.5, x1 = 400.5, y1 = 260.5, y0 = -0.5) => kappeKreise(svg).replace(/<path d="M(-?[\d.]+)[ ,](-?[\d.]+)[^"]*[a-df-z][^"]*"[^>]*\/>/g, (el, x, y) => (+x < -1 || +x > 401 || +y > 261 ? "" : el)).replace(/ d="([MLCQSZ\d\s.,-]+)"/g, (m0, d) => {
  let i = 0; return ` d="${d.replace(/-?\d*\.?\d+/g, (z) => { const v = +z, o = i++ % 2 ? Math.max(y0, Math.min(y1, v)) : Math.max(x0, Math.min(x1, v)); return String(r(o)); })}"`;
});

/* ---------- Kamera (Welt in Metern → Bild) ---------------------------- */
const V = [0, 10, 1.6], AZ = 101 * Math.PI / 180;
const FW = [Math.sin(AZ), Math.cos(AZ)], RE = [Math.sin(AZ + Math.PI / 2), Math.cos(AZ + Math.PI / 2)];
const tiefe = (E, N) => (E - V[0]) * FW[0] + (N - V[1]) * FW[1];
const W = (E, N, U) => { const dx = E - V[0], dy = N - V[1], d = dx * FW[0] + dy * FW[1], s = dx * RE[0] + dy * RE[1]; return [CX + F * s / d, HOR - F * (U - V[2]) / d]; };
const UNTEN = -52;     /* Fluss unterhalb der Fälle */
/* Kante der Hufeisenfälle (Ost, Nord) von Table Rock bis Terrapin Point, als glatte Kurve abgetastet */
const KANTE0 = [[0, 0], [40, -50], [90, -110], [145, -158], [200, -185], [265, -200], [330, -200], [390, -182], [440, -150], [480, -108], [510, -60], [532, -14], [545, 30]];
const KANTE = [];
for (let i = 0; i < KANTE0.length - 1; i++) for (let t = 0; t < 1; t += 0.25) { const a = KANTE0[i], b = KANTE0[i + 1]; KANTE.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); }
KANTE.push(KANTE0[KANTE0.length - 1]);
/* US-Ufer: Felswand von Goat Island (von Terrapin Point nach Norden) bis Luna Island, dann die Amerikanischen Fälle */
const USUFER = [[545, 30], [575, 110], [610, 190], [650, 270], [690, 340], [705, 380]];
const LUNA = [[705, 380], [712, 400]];
const AMFALL = [[712, 400], [722, 450], [735, 510], [748, 570], [760, 630], [770, 700]];

/* Figuren aus B.mensch schlank machen (Ladezeit!): Zahlen außerhalb von transform auf ganze Zentimeter der Figur
   runden (Kurven bleiben Kurven), winzige Teile (< min cm) und feine Linien weglassen, Verläufe auf 3 Stufen kürzen */
const vereinfache = (svg, grenze = 0.25, min = 2.2) => {
  svg = svg.replace(/<(path|ellipse|line|circle)\b[^>]*?\/>/g, (el) => {
    const sw = el.match(/stroke-width="([\d.]+)"/);
    if (/fill="none"/.test(el) && sw && parseFloat(sw[1]) < grenze) return "";
    const d = el.match(/ d="([^"]*)"/);
    if (d && !/[a-df-z]/.test(d[1])) { const v = (d[1].match(/-?\d*\.?\d+/g) || []).map(Number), xs = v.filter((_, i) => i % 2 === 0), ys = v.filter((_, i) => i % 2); if (xs.length > 1 && Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) < min) return ""; }
    const rr = el.match(/ (?:r|rx)="([^"]*)"/); if (rr && !d && +rr[1] * 2 < min * 0.5) return "";
    return el;
  });
  svg = svg.replace(/(<(?:linear|radial)Gradient\b[^>]*>)((?:<stop[^>]*\/>)+)/g, (m, kopf, stops) => { const st = stops.match(/<stop[^>]*\/>/g); if (st.length <= 3) return m; return kopf + [st[0], st[Math.floor(st.length / 2)], st[st.length - 1]].join(""); });
  /* reine Linienzüge (nur M/L/Z): Douglas–Peucker mit 0,6 cm Toleranz — dichte Punktreihen werden kurz */
  const dp = (p, eps) => { if (p.length < 3) return p; const [a, b] = [p[0], p[p.length - 1]], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1e-9; let mi = 0, md = 0; for (let j = 1; j < p.length - 1; j++) { const dd = Math.abs((p[j][0] - a[0]) * dy - (p[j][1] - a[1]) * dx) / l; if (dd > md) { md = dd; mi = j; } } return md > eps ? dp(p.slice(0, mi + 1), eps).slice(0, -1).concat(dp(p.slice(mi), eps)) : [a, b]; };
  /* Kurven (C/S/Q, absolut) in Punktfolgen wandeln: je Abschnitt Mitte und Ende — danach greift Douglas–Peucker */
  svg = svg.replace(/ d="([MLCSQZ\d\s.,-]+)"/g, (m0, d) => {
    if (!/[CSQ]/.test(d)) return m0;
    const tok = d.match(/[A-Z]|-?\d*\.?\d+/g) || []; let o = "", i = 0, cmd = "", cx = 0, cy = 0, px = 0, py = 0;
    const n = (k) => +tok[i + k];
    while (i < tok.length) {
      if (/[A-Z]/.test(tok[i])) { cmd = tok[i++]; if (cmd === "Z") { o += "Z"; continue; } }
      if (cmd === "M" || cmd === "L") { o += (cmd === "M" ? "M" : "L") + n(0) + " " + n(1); cx = n(0); cy = n(1); px = cx; py = cy; i += 2; if (cmd === "M") cmd = "L"; }
      else if (cmd === "C") { const mx = (cx + 3 * n(0) + 3 * n(2) + n(4)) / 8, my = (cy + 3 * n(1) + 3 * n(3) + n(5)) / 8; o += `L${mx} ${my}L${n(4)} ${n(5)}`; px = n(2); py = n(3); cx = n(4); cy = n(5); i += 6; }
      else if (cmd === "S") { const c1x = 2 * cx - px, c1y = 2 * cy - py, mx = (cx + 3 * c1x + 3 * n(0) + n(2)) / 8, my = (cy + 3 * c1y + 3 * n(1) + n(3)) / 8; o += `L${mx} ${my}L${n(2)} ${n(3)}`; px = n(0); py = n(1); cx = n(2); cy = n(3); i += 4; }
      else if (cmd === "Q") { const mx = (cx + 2 * n(0) + n(2)) / 4, my = (cy + 2 * n(1) + n(3)) / 4; o += `L${mx} ${my}L${n(2)} ${n(3)}`; cx = n(2); cy = n(3); i += 4; }
      else return m0;
    }
    return ` d="${o}"`;
  });
  svg = svg.replace(/ d="([MLZ\d\s.,-]+)"/g, (m0, d) => {
    const teile = d.split(/(?=M)/).map((seg) => { const zu = /Z/.test(seg), v = (seg.match(/-?\d*\.?\d+/g) || []).map(Number), p = []; for (let i = 0; i + 1 < v.length; i += 2) p.push([v[i], v[i + 1]]); let q; if (p.length > 3) { let mi = 0, md = -1; for (let j = 1; j < p.length; j++) { const dd = Math.hypot(p[j][0] - p[0][0], p[j][1] - p[0][1]); if (dd > md) { md = dd; mi = j; } } q = dp(p.slice(0, mi + 1), 0.6).slice(0, -1).concat(dp(p.slice(mi), 0.6)); } else q = p; return q.length ? "M" + q.map(([x, y]) => Math.round(x) + " " + Math.round(y)).join("L") + (zu ? "Z" : "") : ""; });
    return ` d="${teile.join("")}"`;
  });
  return svg.split(/(transform="[^"]*"|<path d="[^"]*[a-df-z][^"]*")/).map((t, i) => i % 2 ? t : t.replace(/ (d|cx|cy|r|rx|ry|x|y|x1|y1|x2|y2|width|height)="([^"]*)"/g, (m0, n, v) => ` ${n}="${v.replace(/-?\d+\.\d+/g, (z) => String(Math.round(parseFloat(z))))}"`)).join("");
};


/* ---------- Filter und Stoffe ---------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("dunst")}" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="2.4"/></filter>`);
S.def(`<filter id="${S.id("nebel")}" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="5"/></filter>`);
S.def(`<filter id="${S.id("nebel2")}" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="4.2"/></filter>`);
S.def(`<filter id="${S.id("weich")}" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation=".9"/></filter>`);
S.def(`<filter id="${S.id("hauch")}" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation=".35"/></filter>`);
const volumen = (name, licht, schat, dx = 0.35, a1 = 0.75, a2 = 0.35) => {
  /* Sonne hinten rechts: Lichtkante innen rechts, Eigenschatten innen links */
  S.def(`<filter id="${S.id(name)}" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB"><feOffset in="SourceAlpha" dx="${-dx}" dy="${dx * 0.3}" result="v"/><feComposite in="SourceAlpha" in2="v" operator="out" result="kante"/><feFlood flood-color="${licht}" flood-opacity="${a1}"/><feComposite in2="kante" operator="in" result="l"/><feOffset in="SourceAlpha" dx="${dx * 1.6}" dy="${-dx * 0.5}" result="w"/><feComposite in="SourceAlpha" in2="w" operator="out" result="kante2"/><feFlood flood-color="${schat}" flood-opacity="${a2}"/><feComposite in2="kante2" operator="in" result="s"/><feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="s"/><feMergeNode in="l"/></feMerge></filter>`);
  return `url(#${S.id(name)})`;
};
const VOL = volumen("vol", "#ffe2b0", "#1b2433", 0.6, 0.8, 0.35);
const VOL_KLEIN = volumen("volklein", "#ffe6bb", "#1b2433", 0.25, 0.8, 0.3);
/* Herbstlaub als unregelmäßige Kachel (Kronen mit Lichtseite rechts) */
const kronen = (w, h, n, seed, rmin, rmax, farben) => {
  const z = zufall(seed); let o = "";
  for (let i = 0; i < n; i++) {
    const x = z() * w, y = z() * h, rr = rmin + z() * (rmax - rmin), c = farben[Math.floor(z() * farben.length)];
    for (const dx of [-w, 0, w]) for (const dy of [-h, 0, h]) {
      const cx = x + dx, cy = y + dy; if (cx < -rr || cx > w + rr || cy < -rr || cy > h + rr) continue;
      o += `<circle cx="${r(cx)}" cy="${r(cy)}" r="${r(rr)}" fill="${c}"/><circle cx="${r(cx + rr * 0.3)}" cy="${r(cy - rr * 0.3)}" r="${r(rr * 0.45)}" fill="#ffe1a8" opacity=".18"/>`;
    }
  }
  return o;
};
S.def(`<pattern id="${S.id("laub")}" width="14" height="6" patternUnits="userSpaceOnUse"><rect width="14" height="6" fill="#6e4a26"/>${kronen(14, 6, 30, 5, 0.45, 0.9, ["#a83c1c", "#c86a28", "#d49a3a", "#7c7a30", "#943018", "#5f6e30"])}</pattern>`);
const LAUB = `url(#${S.id("laub")})`;

/* =====================================================================
   KULISSE — Nachmittagshimmel, ferner Horizont, Fluss oberhalb der Fälle
   ===================================================================== */
S.hinten(`<rect width="400" height="160" fill="${S.lg("himmel", [[0, "#4a78b2"], [0.4, "#7f9fc6"], [0.62, "#aab6cc"], [0.8, "#cfc5cc"], [0.93, "#e6cdc4"], [1, "#eed6c4"]])}"/>`);

/* flaches Land am Horizont (Ontario und New York): dunstiger Waldsaum */
{
  let h = `<path d="M-1 110.4 Q40 109.2 80 110 Q120 109.4 160 110.2 Q220 109.6 280 110.4 Q340 109.8 401 110.6 L401 113 L-1 113 Z" fill="#9fb0b6"/>`;
  /* Fluss oberhalb der Fälle: glänzendes Band mit Stromschnellen */
  h += `<path d="M170 112.3 L401 112.1 L401 113.6 L170 113.6 Z" fill="${S.lg("oberfluss", [[0, "#cfe0e2"], [1, "#a9c7c8"]])}"/>`;
  for (let i = 0; i < 14; i++) { const x = 180 + i * 16 + rnd() * 8; h += `<path d="M${r(x)} ${r(112.6 + rnd() * 0.6)} h${r(4 + rnd() * 6)}" stroke="#fff" stroke-width=".35" opacity=".8"/>`; }
  S.hinten(h);
}

/* =====================================================================
   1 — DIE WOLKE
   ===================================================================== */
/* Wolke als flaches, stilisiertes Band (wie in mexiko): wenige große Bögen oben, flache Unterseite, oben cremeweiß,
   unten kühl lila; die Abendsonne in unserem Rücken vergoldet die Unterkante */
const wolke = (name, cx, by, W0, H, seed) => {
  const z = zufall(seed), n = 4 + Math.floor(z() * 2), pts = [[cx - W0 / 2, by]];
  for (let i = 0; i < n; i++) {
    const t0 = i / n, t1 = (i + 1) / n, prof = 1 - Math.pow((t0 + t1) - 1, 2) * 0.9, hh = H * prof * (0.75 + z() * 0.35);
    const xa = cx - W0 / 2 + W0 * t0, xb = cx - W0 / 2 + W0 * t1;
    pts.push(`A${r((xb - xa) / 2)} ${r(hh)} 0 0 1 ${r(xb)} ${r(by - (i < n - 1 ? H * 0.25 * prof : 0))}`);
  }
  let d = `M${r(cx - W0 / 2)} ${r(by)} ` + pts.slice(1).join(" ") + ` Q${r(cx)} ${r(by + H * 0.12)} ${r(cx - W0 / 2)} ${r(by)} Z`;
  const g = S.lg(name + "g", [[0, "#fff6ea"], [0.55, "#f2e3dc"], [0.85, "#c9bccd"], [1, "#e9b98e"]], 0, r(by - H * 1.1), 0, r(by + H * 0.1), ' gradientUnits="userSpaceOnUse"');
  return `<path d="${d}" fill="${g}"/><path d="M${r(cx - W0 * 0.42)} ${r(by + 0.2)} Q${r(cx)} ${r(by + H * 0.12 + 0.4)} ${r(cx + W0 * 0.44)} ${r(by + 0.1)}" stroke="#f3c48e" stroke-width=".7" fill="none" opacity=".9"/>`;
};
{
  let k = wolke("w1", 210, 42, 70, 13, 3) + wolke("w2", 330, 20, 46, 8, 7);
  S.teil({ id: "wolke", de: "die Wolke", syl: "WOL-ke", it: "la nuvola", itSyl: "NU-vo-la", en: "cloud", x: 210, y: 34, kunst: um(210, 34, k) });
}

/* =====================================================================
   1a — DAS HOCHHAUS (Skyline von Niagara Falls, NY, hinter Goat Island)
   ===================================================================== */
{
  let k = "";
  /* Gebäude als Kästen im Raum: Westseite zu uns im Abendlicht, dunstig */
  const bau = (E, N, b, t, h, farbe, licht) => {
    const a = W(E, N, h), c = W(E + 0.0, N + b, h), a0 = W(E, N, 0), c0 = W(E, N + b, 0);
    return `<path d="${P([a0, a, c, c0])}" fill="${farbe}"/><path d="${P([a, c, [c[0] + 0.6, c[1] - 0.4], [a[0] + 0.6, a[1] - 0.4]])}" fill="${licht}"/>`;
  };
  k += bau(1300, 560, 50, 20, 26, "#a9a8b0", "#d8cbbd") + bau(1720, 600, 70, 20, 24, "#a7a6b0", "#d4c8bc");
  k += bau(1460, 1080, 40, 25, 56, "#9fa0aa", "#d2c4b6") + bau(1350, 940, 60, 20, 34, "#a3a3ad", "#d6c9bc");
  /* Seneca-Hotelturm: 26 Stockwerke (≈ 82 m), Glas bronze, gestufte Krone */
  const [sx0, sy0] = W(1575, 785, 0), [sx1, sy1] = W(1575, 815, 82), [sx2] = W(1575, 815, 0);
  k += `<path d="${P([[sx0, sy0], [sx0, sy1 + 2], [sx0 + (sx2 - sx0) * 0.2, sy1], [sx2 - (sx2 - sx0) * 0.2, sy1], [sx2, sy1 + 2], [sx2, sy0]])}" fill="${S.lg("seneca", [[0, "#9c9089"], [0.6, "#c8b29c"], [1, "#a8968a"]], 0, 0, 1, 0)}"/>`;
  for (let i = 1; i < 13; i++) { const y = sy1 + 2 + (sy0 - sy1 - 2) * i / 13; k += `<path d="M${r(sx0)} ${r(y)} H${r(sx2)}" stroke="#7f7672" stroke-width=".15" opacity=".7"/>`; }
  k += `<path d="M${r(sx0)} ${r(sy0)} V${r(sy1 + 2)}" stroke="#ead8c2" stroke-width=".4" opacity=".8"/>`;
  /* Dunst über allem (1,5–2 km entfernt) */
  k = `<g opacity=".85">${k}</g>`;
  S.teil({ id: "hochhaus", de: "das Hochhaus", syl: "HOCH-haus", it: "il grattacielo", itSyl: "grat-ta-CIE-lo", en: "high-rise", x: r(sx0), y: r(sy1 + 8), kunst: um(r(sx0), r(sy1 + 8), k),
    tipp: "Hinter der Insel liegt die Stadt Niagara Falls in den USA. Das hohe Haus ist ein Hotel mit 26 Stockwerken." });
}

/* =====================================================================
   1b — DER FLUSS (unterhalb der Fälle, in der Schlucht)
   ===================================================================== */
{
  let k = `<path d="M-1 126 L401 126 L401 222 L-1 222 Z" fill="${S.lg("fluss", [[0, "#6f9c98"], [0.25, "#3f8079"], [0.65, "#2d6a64"], [1, "#245a56"]])}"/>`;
  k += `<path d="M-1 126 L401 126 L401 140 L-1 140 Z" fill="${S.lg("flussglanz", [[0, "#e9eef0", 0.45], [1, "#e9eef0", 0]])}"/>`;
  /* Schaum: weiche, breite Bahnen vom Becken nach links (weichgezeichnet), darüber wenige klare Linien */
  const zf = zufall(61); let weich = "", klar = "";
  for (let i = 0; i < 16; i++) {
    const y = 140 + Math.pow(zf(), 0.9) * 50, x0 = 400 - zf() * 90, l = 60 + zf() * 160 * (y - 126) / 66, b = 0.8 + (y - 126) * 0.05;
    weich += `<path d="M${r(x0)} ${r(y)} Q${r(x0 - l * 0.5)} ${r(y - b * 1.5)} ${r(x0 - l)} ${r(y + b * 0.4)} Q${r(x0 - l * 0.5)} ${r(y + b * 0.6)} ${r(x0)} ${r(y + b * 1.6)} Z" fill="#e6f1ec" opacity="${r(0.18 + zf() * 0.2)}"/>`;
    if (i % 3 === 0) klar += `M${r(x0 - 4)} ${r(y + b * 0.5)} Q${r(x0 - l * 0.45)} ${r(y - b)} ${r(x0 - l * 0.8)} ${r(y + b * 0.3)}`;
  }
  k += `<g filter="url(#${S.id("weich")})">${weich}</g><path d="${klar}" stroke="#f4faf6" stroke-width=".4" fill="none" opacity=".55" stroke-linecap="round"/>`;
  /* weißes Wasser direkt unter den Fällen */
  k += `<g filter="url(#${S.id("dunst")})"><path d="M230 150 Q300 144 401 146 L401 168 Q320 170 240 162 Z" fill="#f2f6f4" opacity=".85"/></g>`;
  for (const [x, y, rr] of [[120, 176, 8], [40, 170, 6], [200, 182, 9]]) k += `<path d="M${x - rr} ${y} a${rr} ${r(rr * 0.22)} 0 1 1 ${r(rr * 1.6)} ${r(-rr * 0.06)} a${r(rr * 0.6)} ${r(rr * 0.14)} 0 1 1 ${r(-rr * 1.1)} ${r(-rr * 0.05)}" stroke="#cfe3dd" stroke-width=".5" fill="none" opacity=".45"/>`;
  S.teil({ id: "fluss", de: "der Fluss", syl: "FLUSS", it: "il fiume", itSyl: "FIU-me", en: "river", x: 120, y: 170, kunst: um(120, 170, k),
    tipp: "Der Niagara verbindet den Eriesee mit dem Ontariosee. Unterhalb der Fälle ist er bis zu 50 Meter tief." });
}

/* =====================================================================
   2 — DIE INSEL (Goat Island) mit Herbstwald — 3 — DIE FELSWAND
   ===================================================================== */
{
  /* Waldsaum auf Goat Island: von Luna Island bis Terrapin Point, Bäume ≈ 18–24 m */
  const fuss = USUFER.slice().reverse().map(([E, N]) => W(E, N, 2));          /* Oberkante der Felswand */
  const krone = [];
  const zz = zufall(21);
  for (let i = 0; i <= 40; i++) {
    const t = i / 40, a = USUFER[USUFER.length - 1], b = USUFER[0];
    const j = Math.min(USUFER.length - 2, Math.floor((1 - t) * (USUFER.length - 1))), tt = (1 - t) * (USUFER.length - 1) - j;
    const E = USUFER[j][0] + (USUFER[j + 1][0] - USUFER[j][0]) * tt + 40, N = USUFER[j][1] + (USUFER[j + 1][1] - USUFER[j][1]) * tt;
    krone.push(W(E, N, 16 + zz() * 9));
  }
  krone.sort((p, q) => p[0] - q[0]);
  const fussS = fuss.slice().sort((p, q) => p[0] - q[0]);
  let k = `<path d="${glatt([...krone, [fussS[fussS.length - 1][0], fussS[fussS.length - 1][1]], ...fussS.slice().reverse()], true, 0.6)}" fill="${LAUB}"/>`;
  /* Herbstbäume in zwei Reihen, im Raum gesetzt: Kronen aus 3–5 Lappen (dazwischen Himmelslöcher), Größen streuen,
     einzelne hohe Bäume; die hintere Reihe dunstiger */
  const farben = [["#b4421c", "#e8864a"], ["#c8702a", "#f2b05a"], ["#cf9a34", "#f6d276"], ["#7f7e34", "#b6b45e"], ["#9c3418", "#d86a3e"], ["#5f6f30", "#93a456"]];
  const baeume = [];
  for (const [ab, n, dunst] of [[48, 30, 0.35], [14, 36, 0]]) for (let i = 0; i < n; i++) {
    const t = (i + zz() * 0.8) / n, j = Math.min(USUFER.length - 2, Math.floor(t * (USUFER.length - 1))), tt = t * (USUFER.length - 1) - j;
    const E = USUFER[j][0] + (USUFER[j + 1][0] - USUFER[j][0]) * tt + ab + zz() * 10, N = USUFER[j][1] + (USUFER[j + 1][1] - USUFER[j][1]) * tt;
    const hoch = zz() < 0.12 ? 26 + zz() * 6 : 13 + zz() * 9, rad = 3.5 + zz() * 4.5;
    baeume.push({ E, N, hoch, rad, f: farben[Math.floor(zz() * farben.length)], dunst, d: tiefe(E, N) });
  }
  baeume.sort((p, q) => q.d - p.d);
  for (const b of baeume) {
    const [x, y] = W(b.E, b.N, b.hoch - b.rad), [, y0] = W(b.E, b.N, 2), m = F / b.d, rr = b.rad * m;
    let lap = "", hl = "";
    const nl = 3 + Math.floor(zz() * 3);
    for (let l = 0; l < nl; l++) { const a = (l / nl) * Math.PI * 2 + zz(), lx = x + Math.cos(a) * rr * 0.55, ly = y + Math.sin(a) * rr * 0.45, lr = rr * (0.5 + zz() * 0.2); lap += `<circle cx="${r(lx)}" cy="${r(ly)}" r="${r(lr)}"/>`; if (Math.sin(a) < 0.2) hl += `<circle cx="${r(lx - lr * 0.15)}" cy="${r(ly - lr * 0.2)}" r="${r(lr * 0.55)}"/>`; }
    k += `<path d="M${r(x)} ${r(y0)} V${r(y + rr * 0.3)}" stroke="#4a3626" stroke-width="${r(Math.max(0.2, rr * 0.12))}"/>`;
    k += `<g fill="${b.f[0]}"${b.dunst ? ` opacity=".8"` : ""}>${lap}</g><g fill="${b.f[1]}" opacity="${b.dunst ? 0.45 : 0.7}">${hl}</g>`;
  }
  k += `<path d="${glatt([...krone, [fussS[fussS.length - 1][0], fussS[fussS.length - 1][1]], ...fussS.slice().reverse()], true, 0.6)}" fill="${S.lg("inseldunst", [[0, "#e8e0d2", 0.35], [1, "#e8e0d2", 0.05]])}"/>`;
  S.teil({ id: "insel", de: "die Insel", syl: "IN-sel", it: "l'isola", itSyl: "I-so-la", en: "island", x: 120, y: 108, kunst: um(120, 108, kappeRand(k)),
    tipp: "Goat Island (Ziegeninsel) gehört zu den USA. Sie trennt die Hufeisenfälle von den Amerikanischen Fällen." });
}
{
  /* Felswand von Goat Island zur Schlucht: oben die harte Dolomitbank (hell, steht über), darunter weichere,
     dunklere Schichten, unten die Schutthalde mit Büschen. Nachmittagslicht von rechts hinten. */
  const lin = (u, dE = 0) => USUFER.map(([E, N]) => W(E + dE, N, u));
  const oben = lin(2), unten = lin(UNTEN + 12);
  let k = `<path d="${P([...oben, ...unten.slice().reverse()])}" fill="${S.lg("felswand", [[0, "#e6c08a"], [0.3, "#c49a6c"], [0.6, "#a07c5e"], [1, "#86684f"]])}"/>`;
  /* Dolomitbank oben: hell, mit Überhang-Schatten darunter */
  k += `<path d="${P([...lin(2), ...lin(-7).reverse()])}" fill="${S.lg("dolomit", [[0, "#f8dfae"], [1, "#e0bd88"]])}"/>`;
  k += `<path d="${P([...lin(-7), ...lin(-9.5).reverse()])}" fill="#5e4f40" opacity=".55"/>`;
  /* Blöcke und Klüfte: unregelmäßige Kanten, nicht gleichmäßig */
  const zk = zufall(33);
  let kl = "";
  for (let i = 0; i < 34; i++) {
    const t = zk(), j = Math.min(USUFER.length - 2, Math.floor(t * (USUFER.length - 1))), tt = t * (USUFER.length - 1) - j;
    const E = USUFER[j][0] + (USUFER[j + 1][0] - USUFER[j][0]) * tt, N = USUFER[j][1] + (USUFER[j + 1][1] - USUFER[j][1]) * tt;
    const u0 = i % 2 ? 1.5 : -10 - zk() * 8, u1 = u0 - 4 - zk() * 9;
    const [x0, y0] = W(E, N, u0), [, y1] = W(E, N, u1);
    kl += `M${r(x0)} ${r(y0)} l${r((zk() - 0.5) * 0.5)} ${r((y1 - y0) * 0.5)} l${r((zk() - 0.5) * 0.5)} ${r((y1 - y0) * 0.5)}`;
  }
  k += `<path d="${kl}" stroke="#4e4236" stroke-width=".3" opacity=".7" fill="none"/>`;
  for (const [u, c, w, o] of [[-14, "#6e5f50", 0.4, 0.6], [-21, "#9a8774", 0.3, 0.6], [-28, "#5f5244", 0.35, 0.5]]) k += `<path d="${P(lin(u), false)}" stroke="${c}" stroke-width="${w}" fill="none" opacity="${o}"/>`;
  /* Feuchte, dunkle Streifen (Sickerwasser) und Moos */
  for (let i = 0; i < 10; i++) { const t = zk(), j = Math.min(USUFER.length - 2, Math.floor(t * (USUFER.length - 1))), tt = t * (USUFER.length - 1) - j; const E = USUFER[j][0] + (USUFER[j + 1][0] - USUFER[j][0]) * tt, N = USUFER[j][1] + (USUFER[j + 1][1] - USUFER[j][1]) * tt; const [x0, y0] = W(E, N, -9), [, y1] = W(E, N, -32); k += `<path d="M${r(x0 - 0.5)} ${r(y0)} L${r(x0 + 0.5)} ${r(y0)} L${r(x0 + 0.3)} ${r(y1)} L${r(x0 - 0.3)} ${r(y1)} Z" fill="#3f3a33" opacity=".35"/>`; }
  /* Schutthalde (Talus) am Fuß, mit Büschen in Herbstfarben */
  const talus = USUFER.map(([E, N]) => W(E - 20, N + 4, UNTEN + 0.5)), talusO = lin(UNTEN + 16);
  k += `<path d="${P([...talusO, ...talus.slice().reverse()])}" fill="${S.lg("talus", [[0, "#a59a88"], [1, "#7a7064"]])}"/>`;
  for (let i = 0; i < 36; i++) { const t = zk(), [x, y] = talus[0].map((v, q) => v + (talus[talus.length - 1][q] - v) * t); k += `<ellipse cx="${r(x)}" cy="${r(y - 0.8 - zk() * 2.4)}" rx="${r(0.5 + zk() * 0.9)}" ry="${r(0.35 + zk() * 0.35)}" fill="${["#7b8a3e", "#b8862e", "#a9a091", "#c06a2a", "#8f8778"][i % 5]}"/>`; }
  S.teil({ id: "felswand", de: "die Felswand", syl: "FELS-wand", it: "la parete rocciosa", itSyl: "pa-RE-te roc-CIO-sa", en: "cliff", x: 140, y: 124, kunst: um(140, 124, kappeRand(k)),
    tipp: "Das Wasser spült den weichen Stein unter der harten Kalkschicht aus. So wandern die Fälle langsam flussaufwärts." });
}

/* =====================================================================
   4 — DIE AMERIKANISCHEN FÄLLE (am linken Rand, mit Lupe: Brautschleier, Felsen)
   ===================================================================== */
const AM = {};
{
  const kr = AMFALL.map(([E, N]) => W(E, N, 3)), fu = AMFALL.map(([E, N]) => W(E - 6, N, -32)), fl = AMFALL.map(([E, N]) => W(E - 34, N - 6, UNTEN + 1));
  /* Ufer der USA dahinter: Bäume und ein paar Dächer */
  let k = `<path d="${P([...AMFALL.map(([E, N]) => W(E + 30, N, 14)), ...kr.slice().reverse()])}" fill="#7a5a32"/>`;
  {
    const za = zufall(23), farben = [["#b4421c", "#e07a3a"], ["#c8702a", "#f0a850"], ["#cf9a34", "#f4cc6a"], ["#7f7e34", "#b0ae58"], ["#9c3418", "#d4643a"]];
    for (let t = 0; t <= 1.0001; t += 0.06) {
      const j = Math.min(AMFALL.length - 2, Math.floor(t * (AMFALL.length - 1))), tt = t * (AMFALL.length - 1) - j;
      const E = AMFALL[j][0] + (AMFALL[j + 1][0] - AMFALL[j][0]) * tt + 30, N = AMFALL[j][1] + (AMFALL[j + 1][1] - AMFALL[j][1]) * tt;
      const [x, y] = W(E, N, 14 + za() * 8), rr = 1.4 + za() * 1.1, [c0, c1] = farben[Math.floor(za() * farben.length)];
      k += `<path d="M${r(x - rr)} ${r(y + rr * 1.8)} Q${r(x - rr * 1.1)} ${r(y)} ${r(x)} ${r(y - rr * 0.8)} Q${r(x + rr * 1.1)} ${r(y)} ${r(x + rr)} ${r(y + rr * 1.8)} Z" fill="${c0}"/><path d="M${r(x - rr * 0.5)} ${r(y + rr * 0.3)} Q${r(x)} ${r(y - rr * 0.6)} ${r(x + rr * 0.6)} ${r(y + rr * 0.2)} Q${r(x)} ${r(y + rr * 0.6)} ${r(x - rr * 0.5)} ${r(y + rr * 0.3)} Z" fill="${c1}"/>`;
    }
  }
  /* Felsbrocken (Talus) am Fuß: große graue Blöcke, Wasser schäumt darüber */
  k += `<path d="${P([...fu, ...fl.slice().reverse()])}" fill="${S.lg("amtalus", [[0, "#8a8479"], [1, "#5f5a52"]])}"/>`;
  const zt = zufall(41);
  for (let i = 0; i < 30; i++) { const t = zt(), [x, y] = fu[0].map((v, q) => v + (fu[fu.length - 1][q] - v) * t); const yy = y + zt() * 8; k += `<path d="M${r(x - 1.4)} ${r(yy + 0.8)} l${r(0.4)} ${r(-1.4)} l${r(1.6)} ${r(-0.3)} l${r(0.7)} ${r(1.5)} Z" fill="${zt() < 0.5 ? "#b2aa9c" : "#7d766b"}"/>`; }
  /* Wasser über die Brocken: weiße Schleier */
  let schl = "";
  for (let i = 0; i < 34; i++) { const t = zt(), [x, y] = fu[0].map((v, q) => v + (fu[fu.length - 1][q] - v) * t); schl += `<path d="M${r(x - 0.8)} ${r(y)} Q${r(x - 1.4)} ${r(y + 4)} ${r(x - 1.6)} ${r(y + 8 + zt() * 3)} L${r(x + 0.6)} ${r(y + 8)} Q${r(x + 0.4)} ${r(y + 4)} ${r(x + 0.8)} ${r(y)} Z" fill="#f6f4ee" opacity="${r(0.45 + zt() * 0.35)}"/>`; }
  k += `<g filter="url(#${S.id("hauch")})">${schl}</g>`;
  /* Fallendes Wasser (Westseite, im Nachmittagslicht) */
  k += `<path d="${P([...kr, ...fu.map(([x, y]) => [x, y + 1.2]).reverse()])}" fill="${S.lg("amwasser", [[0, "#fff6e4"], [0.6, "#fbf0de"], [1, "#e9e6de"]])}"/>`;
  let st = "";
  for (let i = 0; i < 40; i++) { const t = i / 40 + zt() * 0.02, [x, y] = kr[0].map((v, q) => v + (kr[kr.length - 1][q] - v) * t), [, y2] = fu[0].map((v, q) => v + (fu[fu.length - 1][q] - v) * t); st += `M${r(x)} ${r(y + 0.4)} L${r(x - 0.2)} ${r(y2)}`; }
  k += `<path d="${st}" stroke="#c9d3d6" stroke-width=".22" opacity=".8"/>`;
  k += `<path d="${P(kr, false)}" stroke="#7fae9e" stroke-width=".5" fill="none"/>`;
  /* Gischt am Fuß */
  k += `<g filter="url(#${S.id("weich")})">${fl.map(([x, y], i) => `<ellipse cx="${r(x + 2)}" cy="${r(y - 2.5)}" rx="${r(4 + (i % 2) * 2)}" ry="1.8" fill="#fff" opacity=".7"/>`).join("")}</g>`;
  /* Luna Island (Bäume) und der Brautschleier rechts daneben */
  const [lx, ly] = W(708, 390, 3);
  k += `<path d="M${r(lx - 4)} ${r(ly + 0.4)} Q${r(lx - 3)} ${r(ly - 5)} ${r(lx)} ${r(ly - 5.4)} Q${r(lx + 3)} ${r(ly - 5)} ${r(lx + 3.6)} ${r(ly + 0.4)} Z" fill="#c8572a"/><path d="M${r(lx - 1)} ${r(ly - 4.6)} q2 -.8 3.6 .6" stroke="#ffd79a" stroke-width=".5" fill="none" opacity=".7"/>`;
  const bv = [W(700, 370, 3), W(704, 382, 3)], bvU = [W(696, 370, -24), W(700, 382, -24)];
  k += `<path d="${P([bv[0], bv[1], bvU[1], bvU[0]])}" fill="${S.lg("brautschleier", [[0, "#fffaf0"], [1, "#e6ebea"]])}"/>`;
  /* Stege der Cave of the Winds am Fuß des Brautschleiers mit Besuchern in gelben Capes */
  const [sx, sy] = W(686, 372, -30);
  k += `<path d="M${r(sx - 6)} ${r(sy)} h8 v.6 h-8 Z M${r(sx - 3)} ${r(sy - 2.4)} h6 v.5 h-6 Z" fill="#9a7a4a"/>`;
  for (let i = 0; i < 5; i++) k += `<path d="M${r(sx - 5.4 + i * 1.6)} ${r(sy - 0.1)} l.35 -1.2 l.35 1.2 Z" fill="#f2d02c"/>`;
  AM.brautschleier = [(bv[0][0] + bv[1][0]) / 2, (bv[0][1] + bvU[0][1]) / 2];
  AM.felsen = fu[2];
  const unter = [
    { id: "brautschleier", de: "der Brautschleier", syl: "BRAUT-schlei-er", it: "il Velo della Sposa", itSyl: "VE-lo del-la SPO-sa", en: "Bridal Veil Falls", x: AM.brautschleier[0], y: AM.brautschleier[1], kunst: flaeche(-3, -6, 6, 12),
      tipp: "Der Brautschleier ist ein kleiner, schmaler Wasserfall. Am Fuß gehen Besucher in gelben Capes auf Holzstegen." },
    { id: "felsbrocken", de: "der Felsbrocken", syl: "FELS-bro-cken", it: "il masso", itSyl: "MAS-so", en: "boulder", x: AM.felsen[0], y: AM.felsen[1] + 4, kunst: flaeche(-12, -4, 24, 8),
      tipp: "Am Fuß der Amerikanischen Fälle liegen riesige Felsbrocken. Viele davon sind 1931 und 1954 abgebrochen." },
  ];
  S.teil({ id: "amerikanische_faelle", de: "die Amerikanischen Fälle", syl: "a-me-ri-KA-ni-schen FÄL-le", it: "le Cascate Americane", itSyl: "ca-SCA-te a-me-ri-CA-ne", en: "American Falls", x: 22, y: 118, kunst: um(22, 118, kappeRand(k)),
    zoom: { x: 0, y: 96, w: 66, h: 44 }, unter,
    tipp: "Die Amerikanischen Fälle liegen in den USA. Das Wasser fällt 21 bis 30 Meter tief auf große Felsbrocken." });
}

/* =====================================================================
   5 — DIE HUFEISENFÄLLE (mit Lupe: die Kante, der Aussichtspunkt)
   ===================================================================== */
const HU = {};
{
  const SONNE = [Math.sin(255 * Math.PI / 180), Math.cos(255 * Math.PI / 180)];
  const N0 = KANTE.length;
  /* Grün: am nahen Abbruch (Table Rock) und im Scheitel ist das Wasser tief — dort glasig grün, sonst weiß gebrochen */
  const gruen = (i) => { const t = i / (N0 - 1); return Math.max(Math.max(0, 1 - t / 0.22), Math.max(0, 1 - Math.abs(t - 0.5) / 0.14)); };
  const seg = [];
  for (let i = 0; i < N0 - 1; i++) {
    const a = KANTE[i], b = KANTE[i + 1];
    if (tiefe((a[0] + b[0]) / 2, (a[1] + b[1]) / 2) < 25) continue;
    const dE = b[0] - a[0], dN = b[1] - a[1], l = Math.hypot(dE, dN), n = [-dN / l, dE / l];
    const licht = Math.max(0, n[0] * SONNE[0] + n[1] * SONNE[1]);
    const pA = W(a[0], a[1], 0.4), pB = W(b[0], b[1], 0.4), uA = W(a[0] + n[0] * 8, a[1] + n[1] * 8, UNTEN + 4), uB = W(b[0] + n[0] * 8, b[1] + n[1] * 8, UNTEN + 4);
    if (pA[0] > 420 && pB[0] > 420) continue;
    seg.push({ i, pA, pB, uA, uB, licht, g: (gruen(i) + gruen(i + 1)) / 2, d: tiefe((a[0] + b[0]) / 2, (a[1] + b[1]) / 2) });
  }
  let k = "";
  /* Fluss oberhalb der Kante (nah rechts sichtbar): Stromschnellen laufen auf die Kante zu */
  const ob = KANTE.filter(([E, N]) => tiefe(E, N) > 25).map(([E, N]) => W(E, N, 0.4)).filter(([x]) => x < 430);
  const hor = ob.map(([x]) => [x, HOR + 0.6]);
  k += `<path d="${P([...ob, ...hor.reverse()])}" fill="${S.lg("oberwasser", [[0, "#a9c6c0"], [1, "#5f9a8a"]])}"/>`;
  let ra = "";
  for (let i = 0; i < 26; i++) { const t = rnd(), j = Math.floor(t * (ob.length - 1)), [x, y] = ob[j]; if (y < HOR + 2.2) continue; ra += `M${r(x - 3 - rnd() * 4)} ${r(HOR + 1 + (y - HOR) * 0.3)} L${r(x)} ${r(y - 0.6)}`; }
  k += `<path d="${ra}" stroke="#ffffff" stroke-width=".35" opacity=".7"/>`;
  /* Fallwände von hinten nach vorn */
  seg.sort((p, q) => q.d - p.d);
  for (const sg of seg) {
    const L = sg.licht, g = sg.g, h = sg.uA[1] - sg.pA[1];
    const id = "wv" + sg.i;
    const oben = g > 0.4 ? "#2f7d63" : (L > 0.3 ? "#fffaf0" : "#eef2f2"), mitte = g > 0.4 ? "#7fbba2" : (L > 0.3 ? "#f8f4ea" : "#dfe6e8");
    S.def(`<linearGradient id="${S.id(id)}" gradientUnits="userSpaceOnUse" x1="0" y1="${r(sg.pA[1])}" x2="0" y2="${r(sg.uA[1])}"><stop offset="0" stop-color="${oben}"/><stop offset="${r(0.12 + g * 0.16)}" stop-color="${mitte}"/><stop offset="${r(0.3 + g * 0.15)}" stop-color="${L > 0.3 ? "#fbf7ee" : "#e6ecee"}"/><stop offset="1" stop-color="${L > 0.3 ? "#e9eef0" : "#c3d0d6"}"/></linearGradient>`);
    k += `<path d="${P([sg.pA, sg.pB, sg.uB, sg.uA])}" fill="url(#${S.id(id)})" stroke="url(#${S.id(id)})" stroke-width=".3"/>`;
    /* Stränge: breite helle Bahnen, dazwischen kühle Spalten; oben glatt gebündelt, unten zerfasert */
    const breite = Math.abs(sg.pB[0] - sg.pA[0]), n = h > 60 ? 0 : Math.max(1, Math.round(breite / 2.6));
    const zw = zufall(500 + sg.i);
    let hell = "", spalt = "";
    for (let j = 0; j < n; j++) {
      const t0 = j / n, t1 = (j + 0.55 + zw() * 0.3) / n, q = (t, v) => [sg.pA[0] + (sg.pB[0] - sg.pA[0]) * t + (sg.uA[0] + (sg.uB[0] - sg.uA[0]) * t - (sg.pA[0] + (sg.pB[0] - sg.pA[0]) * t)) * v, sg.pA[1] + (sg.pB[1] - sg.pA[1]) * t + h * v];
      const lang = 0.55 + zw() * 0.4, v0 = 0.06 + g * 0.18;
      const a1 = q(t0, v0), a2 = q(t1, v0), b1 = q(t0 - 0.08, lang), b2 = q(t1 + 0.12, lang), sp = q((t0 + t1) / 2, lang + 0.08);
      hell += `M${r(a1[0])} ${r(a1[1])} L${r(a2[0])} ${r(a2[1])} L${r(b2[0])} ${r(b2[1])} L${r(sp[0])} ${r(sp[1])} L${r(b1[0])} ${r(b1[1])} Z`;
      const c1 = q(t1 + 0.04, v0 + 0.05), c2 = q(t1 + 0.12, v0 + 0.05), d2 = q(t1 + 0.12, lang * 0.8);
      spalt += `M${r(c1[0])} ${r(c1[1])} L${r(c2[0])} ${r(c2[1])} L${r(d2[0])} ${r(d2[1])} Z`;
    }
    if (n) k += `<path d="${spalt}" fill="${L > 0.3 ? "#b9c8cc" : "#90a6b2"}" opacity=".45"/><path d="${hell}" fill="#ffffff" opacity="${L > 0.3 ? 0.55 : 0.38}"/>`;
    else {
      /* naher Abbruch, fast von der Seite gesehen: glatte, gebogene Bahnen — oben glasig grün, nach unten weiß aufgerissen */
      let st = "", gr = "";
      for (let j = 0; j < 4; j++) {
        const t = (j + 0.3 + zw() * 0.4) / 4, x0 = sg.pA[0] + (sg.pB[0] - sg.pA[0]) * t, y0 = sg.pA[1] + (sg.pB[1] - sg.pA[1]) * t, x1 = sg.uA[0] + (sg.uB[0] - sg.uA[0]) * t, y1 = Math.min(262, sg.uA[1] + (sg.uB[1] - sg.uA[1]) * t);
        gr += `M${r(x0)} ${r(y0 + 1)} Q${r(x0 + (x1 - x0) * 0.1 + 1)} ${r(y0 + (y1 - y0) * 0.12)} ${r(x0 + (x1 - x0) * 0.2)} ${r(y0 + (y1 - y0) * 0.24)}`;
        st += `M${r(x0 + (x1 - x0) * 0.2)} ${r(y0 + (y1 - y0) * 0.22)} Q${r(x0 + (x1 - x0) * 0.6 - 1)} ${r(y0 + (y1 - y0) * 0.6)} ${r(x1)} ${r(y1)}`;
      }
      k += `<path d="${gr}" stroke="#bfe6d2" stroke-width=".7" fill="none" opacity=".7"/><path d="${st}" stroke="#ffffff" stroke-width="1.3" fill="none" opacity=".55" stroke-linecap="round"/>`;
    }
    /* glasige Kante: helle Lichtlinie auf der Kante, darunter der dunkle Bogen des überkippenden Wassers */
    if (g > 0.2 && h < 60) k += `<path d="M${r(sg.pA[0])} ${r(sg.pA[1] + h * 0.05)} L${r(sg.pB[0])} ${r(sg.pB[1] + h * 0.05)}" stroke="#1e5c48" stroke-width=".5" opacity="${r(g * 0.6)}"/>`;
  }
  const kante = KANTE.filter(([E, N]) => tiefe(E, N) > 25).map(([E, N]) => W(E, N, 0.4)).filter(([x]) => x < 440);
  k += `<path d="${P(kante, false)}" stroke="#f4fff8" stroke-width=".6" fill="none" opacity=".9"/>`;
  /* Dunstsee über dem Becken: dicht und weiß, verdeckt die untere Hälfte der Wände */
  const fussL = KANTE.filter(([E, N]) => tiefe(E, N) > 25).map(([E, N]) => W(E, N, -26)).filter(([x]) => x < 440);
  k += `<g filter="url(#${S.id("nebel2")})"><path d="${P([...fussL.map(([x, y]) => [x, y - 3]), [404, 168], [404, 222], [380, 222], [340, 178], ...fussL.slice().reverse().filter(([x]) => x < 340).map(([x, y]) => [x - 4, y + 10])])}" fill="${S.lg("dunstsee", [[0, "#fff6e6"], [0.5, "#f2f3f0"], [1, "#d9e2e6"]])}" opacity=".93"/></g>`;
  /* Terrapin Point: Aussichtsplattform mit Geländer, Besuchern und US-Flagge */
  const [tx, ty] = W(552, 32, 2);
  k += `<path d="M${r(tx - 6)} ${r(ty + 0.5)} h12 l-.8 -1.1 h-10.4 Z" fill="#c9c0b0"/><path d="M${r(tx - 6)} ${r(ty - 0.9)} h12" stroke="#2a2a2a" stroke-width=".22"/>`;
  for (let i = 0; i < 6; i++) k += `<path d="M${r(tx - 4.6 + i * 1.7)} ${r(ty - 0.1)} v-1.6" stroke="${["#2f5f95", "#c0392b", "#f2f2f0", "#e0a020", "#3a3a3a", "#7a3a8a"][i]}" stroke-width=".7"/><circle cx="${r(tx - 4.6 + i * 1.7)}" cy="${r(ty - 2)}" r=".38" fill="#d9a77c"/>`;
  k += `<path d="M${r(tx + 5.4)} ${r(ty)} V${r(ty - 6)}" stroke="#666" stroke-width=".2"/><path d="M${r(tx + 5.4)} ${r(ty - 6)} h3 v1.8 h-3 Z" fill="#c8202a"/><path d="M${r(tx + 5.4)} ${r(ty - 5.4)} h3 M${r(tx + 5.4)} ${r(ty - 4.8)} h3" stroke="#fff" stroke-width=".22"/><path d="M${r(tx + 5.4)} ${r(ty - 6)} h1.3 v1 h-1.3 Z" fill="#2a3a7a"/>`;
  HU.terrapin = [tx + 1, ty - 2];
  const ap = W(300, -202, 0.4);
  HU.kante = [ap[0], ap[1] + 2];
  const nah = W(70, -88, -14);
  HU.wasserfall = nah;
  const unter = [
    { id: "kante", de: "die Kante", syl: "KAN-te", it: "il bordo", itSyl: "BOR-do", en: "brink", x: HU.kante[0], y: HU.kante[1], kunst: flaeche(-10, -2.4, 20, 4.8),
      tipp: "In der Mitte des Hufeisens ist das Wasser an der Kante besonders tief – deshalb leuchtet es dort grün." },
    { id: "wasserfall", de: "der Wasserfall", syl: "WAS-ser-fall", it: "la cascata", itSyl: "ca-SCA-ta", en: "waterfall", x: HU.wasserfall[0], y: HU.wasserfall[1], kunst: flaeche(-14, -14, 26, 26),
      tipp: "Ein Wasserfall entsteht, wo ein Fluss über eine Felskante stürzt. Hier, ganz nah am Table Rock, donnert er direkt neben uns hinab." },
    { id: "aussichtspunkt", de: "der Aussichtspunkt", syl: "AUS-sichts-punkt", it: "il belvedere", itSyl: "bel-ve-DE-re", en: "viewpoint", x: HU.terrapin[0], y: HU.terrapin[1], kunst: flaeche(-7, -4, 14, 6),
      tipp: "Gegenüber liegt Terrapin Point in den USA. Von dort sehen die Besucher die Fälle von der anderen Seite." },
  ];
  S.teil({ id: "hufeisenfaelle", de: "die Hufeisenfälle", syl: "HUF-ei-sen-fäl-le", it: "le Cascate a Ferro di Cavallo", itSyl: "ca-SCA-te a FER-ro di ca-VAL-lo", en: "Horseshoe Falls", x: 330, y: 124, kunst: um(330, 124, kappeRand(k)),
    zoom: { x: 150, y: 92, w: 150, h: 100 }, unter,
    tipp: "Die Hufeisenfälle sind mehr als 50 Meter hoch. In jeder Sekunde stürzen hier mehr als 2000 Kubikmeter Wasser hinab." });
}

/* =====================================================================
   6 — DIE GISCHT (Fahne über dem Becken: unten der Dunstsee, darüber schräg vom Westwind versetzte Schleier)
   ===================================================================== */
const SCHLEIER = [];
{
  /* Schleier: lange, weiche Formen, unten breit, oben durchscheinend und nach rechts geneigt */
  const schleier = (x0, y0, b, hoch, neig, seed) => {
    const z = zufall(seed), li = [], re = [];
    for (let i = 0; i <= 6; i++) { const t = i / 6, w = b * (1 - t * 0.45) * (0.85 + z() * 0.3), x = x0 + neig * t * t, y = y0 - hoch * t; li.push([x - w / 2 - z() * 3, y]); re.push([x + w / 2 + z() * 3, y]); }
    return glatt([...li, ...re.reverse()], true, 0.9);
  };
  const lagen = [[262, 138, 76, 92, 26, 0.8, 1], [292, 134, 58, 104, 36, 0.62, 2], [234, 140, 46, 70, 18, 0.55, 3], [322, 136, 54, 72, 30, 0.5, 4], [278, 122, 38, 114, 46, 0.32, 5]];
  let k = "";
  for (const [x, y, b, h, ne, a, sd] of lagen) { const d = schleier(x, y, b, h, ne, sd); SCHLEIER.push(d); k += `<path d="${d}" fill="${S.lg("schleier", [[0, "#fff0d6"], [0.45, "#f4ede4"], [1, "#c9d3dc"]], 0, 0, 1, 0)}" opacity="${a}"/>`; }
  k = `<g filter="url(#${S.id("nebel")})">${k}</g>`;
  /* oben ausfransende Fetzen */
  let f = "";
  for (const [x, y, w] of [[300, 44, 26], [322, 58, 20], [282, 32, 16]]) f += `<path d="M${x - w / 2} ${y} q${r(w * 0.3)} -5 ${r(w * 0.6)} -2 q${r(w * 0.3)} -3 ${r(w * 0.4)} 3 q${r(-w * 0.5)} 4 ${r(-w)} -1 Z" fill="#f6efe6" opacity=".35"/>`;
  k += `<g filter="url(#${S.id("dunst")})">${f}</g>`;
  S.teil({ id: "gischt", de: "die Gischt", syl: "GISCHT", it: "gli spruzzi", itSyl: "SPRUZ-zi", en: "spray", x: 290, y: 70, kunst: um(290, 70, kappeRand(k)),
    tipp: "Die Gischt steigt oft über 100 Meter hoch. Man sieht sie schon von Weitem – und man wird nass!" });
}

/* =====================================================================
   7 — DER REGENBOGEN (Sonne im Rücken: Gegenpunkt 75° Azimut, 9° unter dem Horizont)
   ===================================================================== */
{
  const rad = Math.PI / 180, A = [Math.sin(75 * rad) * Math.cos(9 * rad), Math.cos(75 * rad) * Math.cos(9 * rad), -Math.sin(9 * rad)];
  const kreuz = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const norm = (v) => { const l = Math.hypot(...v); return v.map((x) => x / l); };
  const u1 = norm(kreuz(A, [0, 0, 1])), u2 = kreuz(u1, A);
  const bild = (D) => { const d = D[0] * FW[0] + D[1] * FW[1], s = D[0] * RE[0] + D[1] * RE[1]; return [CX + F * s / d, HOR - F * D[2] / d]; };
  const bogen = (grad) => { const o = []; for (let ph = -10; ph <= 90; ph += 1.5) { const c = Math.cos(grad * rad), sn = Math.sin(grad * rad), p = ph * rad; const D = A.map((a, i) => c * a + sn * (Math.cos(p) * u1[i] + Math.sin(p) * u2[i])); if (D[0] * FW[0] + D[1] * FW[1] > 0.2) o.push(bild(D)); } return o; };
  const farben = [[42.3, "#e8402a"], [41.9, "#f39a2a"], [41.5, "#f5e04a"], [41.1, "#5cc85a"], [40.7, "#3a8ae0"], [40.3, "#7a50c8"]];
  /* sichtbar nur in der Gischt: Maske aus den Schleiern und dem Dunstsee, oben und unten weich ausgeblendet */
  S.def(`<linearGradient id="${S.id("rbmaske")}" gradientUnits="userSpaceOnUse" x1="0" y1="34" x2="0" y2="176"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".25" stop-color="#fff" stop-opacity=".8"/><stop offset=".8" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><mask id="${S.id("rbm")}" maskUnits="userSpaceOnUse" x="0" y="0" width="400" height="260"><g filter="url(#${S.id("dunst")})" fill="url(#${S.id("rbmaske")})">${SCHLEIER.map((d) => `<path d="${d}"/>`).join("")}<path d="M200 128 L320 128 L320 178 L200 178 Z"/></g></mask>`);
  let k = "";
  const zug = (g) => bogen(g).filter(([x, y]) => x > 150 && x < 330 && y > 20 && y < 180).sort((p, q) => p[1] - q[1]);
  /* Alexanders Dunkelband: innen ist der Himmel heller, außen dunkler */
  const innen = zug(37.5), aussen = zug(45.5);
  if (innen.length > 1) k += `<path d="${glatt(innen.filter((_, i) => i % 3 === 0), false)}" stroke="#ffffff" stroke-width="7" fill="none" opacity=".07"/>`;
  if (aussen.length > 1) k += `<path d="${glatt(aussen.filter((_, i) => i % 3 === 0), false)}" stroke="#5a6a7a" stroke-width="5" fill="none" opacity=".04"/>`;
  for (const [g, c] of farben) { const pts = zug(g); if (pts.length > 1) k += `<path d="${glatt(pts.filter((_, i) => i % 3 === 0 || i === pts.length - 1), false)}" stroke="${c}" stroke-width="1.5" fill="none" opacity=".66"/>`; }
  S.teil({ id: "regenbogen", de: "der Regenbogen", syl: "RE-gen-bo-gen", it: "l'arcobaleno", itSyl: "ar-co-ba-LE-no", en: "rainbow", x: 0, y: 0,
    kunst: `<g mask="url(#${S.id("rbm")})" filter="url(#${S.id("hauch")})">${k}</g>`,
    tipp: "Den Regenbogen sieht man nur, wenn die Sonne im Rücken steht. Hier am Table Rock also am Nachmittag und am Abend." });
}

/* =====================================================================
   8 — DAS BOOT (Niagara City Cruises) fährt in die Gischt — Lupe: das Regencape, die Flagge
   ===================================================================== */
const BOOT = {};
{
  /* Katamaran, 30 m lang, 10 m breit, im Raum gebaut (wir schauen rund 15° von oben): Kurs vom Anleger in die Gischt */
  const C = [185, 25], AX = [0.482, -0.877], QX = [0.877, 0.482];
  const pt = (a, q, u) => W(C[0] + AX[0] * a + QX[0] * q, C[1] + AX[1] * a + QX[1] * q, UNTEN + u);
  const umriss = (u, ein = 0) => { const o = []; for (const [a, q] of [[-15, -5], [9, -5], [13, -3.4], [15.5, 0], [13, 3.4], [9, 5], [-15, 5]]) o.push(pt(a - (a > 0 ? ein : -ein) * 0.2, q - Math.sign(q) * ein, u)); return o; };
  let k = "";
  /* Kielwasser (zwei Bahnen der Rümpfe) nach hinten, Bugwelle */
  const kw = (q) => `M${pt(-15, q, 0).map(r).join(" ")} Q${pt(-28, q * 1.5, 0).map(r).join(" ")} ${pt(-42, q * 2.4, 0).map(r).join(" ")}`;
  k += `<g filter="url(#${S.id("weich")})"><path d="${P([pt(-15, -5, 0), pt(-45, -12, 0), pt(-45, 12, 0), pt(-15, 5, 0)])}" fill="#eaf4f0" opacity=".4"/></g>`;
  k += `<path d="${kw(-4)} ${kw(4)}" stroke="#ffffff" stroke-width=".55" fill="none" opacity=".8"/>`;
  k += `<path d="M${pt(12, -6, 0).map(r).join(" ")} Q${pt(16.5, 0, 0).map(r).join(" ")} ${pt(12, 6.4, 0).map(r).join(" ")}" stroke="#ffffff" stroke-width=".8" fill="none"/>`;
  /* Rumpf: weiß, dunkelblaues Band an der Wasserlinie */
  const wl = umriss(0), dk = umriss(3.2), od = umriss(5.6, 0.6);
  k += `<path d="${P(wl)}" fill="#1f3a6a"/><path d="${P(umriss(0.8))}" fill="${S.lg("rumpf", [[0, "#ffffff"], [1, "#d6dce2"]])}"/>`;
  k += `<path d="${P(dk)}" fill="#f2f4f6"/>`;
  /* Unterdeck-Fenster als dunkler Streifen an der Seite zu uns (Backbord) */
  k += `<path d="${P([pt(-13, -5, 1.4), pt(8, -5, 1.4), pt(8, -5, 2.6), pt(-13, -5, 2.6)])}" fill="#2c3e50" opacity=".85"/>`;
  /* Oberdeck von oben: hellgrauer Boden, dicht gedrängte Fahrgäste in roten Capes */
  k += `<path d="${P(od)}" fill="#dfe3e6"/>`;
  const zb = zufall(81); let capes = "", koepfe = "";
  for (let a = -13; a < 9; a += 1.15) for (let q = -3.8; q <= 3.8; q += 1.2) {
    if (zb() < 0.12 || (a > 3 && Math.abs(q) < 2)) continue;
    const [x, y] = pt(a + (zb() - 0.5) * 0.4, q + (zb() - 0.5) * 0.3, 6.2);
    capes += `<ellipse cx="${r(x)}" cy="${r(y)}" rx=".55" ry=".45"/>`;
    if (zb() < 0.45) koepfe += `<circle cx="${r(x + 0.05)}" cy="${r(y - 0.35)}" r=".22"/>`;
  }
  k += `<g fill="#d8262e">${capes}</g><g fill="#a81a20" opacity=".5">${capes.replace(/ry="\.45"/g, 'ry=".2"').replace(/cy="([\d.]+)"/g, (m0, v) => `cy="${r(+v + 0.25)}"`)}</g><g fill="#e2b48e">${koepfe}</g>`;
  /* Reling um das Oberdeck */
  k += `<path d="${P(umriss(6.6, 0.6))}" fill="none" stroke="#ffffff" stroke-width=".3"/>`;
  /* Steuerhaus vorn */
  const sh = [pt(4, -2, 5.6), pt(8, -2, 5.6), pt(8, 2, 5.6), pt(4, 2, 5.6)], shO = [pt(4, -2, 8), pt(8, -2, 8), pt(8, 2, 8), pt(4, 2, 8)];
  k += `<path d="${P([sh[0], sh[1], shO[1], shO[0]])}" fill="#f6f7f8"/><path d="${P(shO)}" fill="#e9ecef"/><path d="${P([pt(5, -2, 6.6), pt(7.6, -2, 6.6), pt(7.6, -2, 7.6), pt(5, -2, 7.6)])}" fill="#2c3e50"/>`;
  /* Flagge am Heck: rot-weiß-rot, in der Mitte ein spitzes Ahornblatt */
  const [fx, fy0] = pt(-14.6, 0, 6), fy = fy0 - 6;
  k += `<path d="M${r(fx)} ${r(fy0)} V${r(fy - 0.2)}" stroke="#555" stroke-width=".3"/>`;
  k += `<path d="M${r(fx)} ${r(fy)} h4.4 v2.2 h-4.4 Z" fill="#fff"/><path d="M${r(fx)} ${r(fy)} h1.1 v2.2 h-1.1 Z M${r(fx + 3.3)} ${r(fy)} h1.1 v2.2 h-1.1 Z" fill="#d52b1e"/>`;
  k += `<path d="M${r(fx + 2.2)} ${r(fy + 0.25)} l.28 .5 l.32 -.12 l-.1 .56 l.3 .1 l-.42 .34 l.06 .3 h-.88 l.06 -.3 l-.42 -.34 l.3 -.1 l-.1 -.56 l.32 .12 Z" fill="#d52b1e"/>`;
  const [cx, cy] = pt(-6, -4.6, 3.6), [dx, dy] = pt(-4, 0, 6.2);
  BOOT.cape = [cx, cy]; BOOT.deck = [dx, dy];
  const unter = [
    { id: "regencape", de: "das Regencape", syl: "RE-gen-cape", it: "la mantella", itSyl: "man-TEL-la", en: "rain poncho", x: BOOT.cape[0], y: BOOT.cape[1], kunst: flaeche(-6, -2.4, 12, 3.2),
      tipp: "Auf den kanadischen Booten bekommen alle ein rotes Regencape, auf den amerikanischen ein blaues." },
    { id: "deck", de: "das Deck", syl: "DECK", it: "il ponte", itSyl: "PON-te", en: "deck", x: BOOT.deck[0], y: BOOT.deck[1], kunst: flaeche(-5, -1.8, 10, 2.6),
      tipp: "Auf dem oberen Deck steht man im Freien. Dort wird man von der Gischt am nassesten." },
  ];
  const [bx, by] = pt(0, 0, 3);
  S.teil({ id: "boot", de: "das Boot", syl: "BOOT", it: "la barca", itSyl: "BAR-ca", en: "boat", x: bx, y: by, kunst: um(bx, by, k),
    zoom: { x: bx - 30, y: by - 22, w: 60, h: 40 }, unter,
    tipp: "Das Boot fährt ganz nah an die Hufeisenfälle heran – mitten in die Gischt." });
}

/* =====================================================================
   9 — DIE MÖWE (Ringschnabelmöwen über der Schlucht)
   ===================================================================== */
{
  const moewe = (x, y, s, fl) => {
    const k = (v) => r(v * s);
    return `<g transform="translate(${r(x)} ${r(y)})"><path d="M${k(-4)} ${k(-0.6 * fl)} Q${k(-2)} ${k(-1.6 * fl)} ${k(-0.4)} 0 Q${k(0)} ${k(0.3)} ${k(0.4)} 0 Q${k(2)} ${k(-1.6 * fl)} ${k(4)} ${k(-0.6 * fl)} Q${k(2.2)} ${k(-0.9 * fl)} ${k(0.6)} ${k(0.5)} Q0 ${k(0.9)} ${k(-0.6)} ${k(0.5)} Q${k(-2.2)} ${k(-0.9 * fl)} ${k(-4)} ${k(-0.6 * fl)} Z" fill="#f7f7f4"/><path d="M${k(-4)} ${k(-0.6 * fl)} l${k(0.9)} ${k(-0.2)} M${k(4)} ${k(-0.6 * fl)} l${k(-0.9)} ${k(-0.2)}" stroke="#2a2a2a" stroke-width="${k(0.35)}"/><path d="M${k(-0.3)} ${k(0.2)} Q0 ${k(1.1)} ${k(0.3)} ${k(0.2)}" fill="#c9ccd0"/><path d="M${k(0.3)} ${k(0.2)} l${k(0.6)} ${k(-0.1)}" stroke="#e8c030" stroke-width="${k(0.25)}"/></g>`;
  };
  let k = moewe(150, 150, 2.2, 1) + moewe(118, 136, 1.2, -0.6) + moewe(182, 132, 0.9, 0.8) + moewe(205, 166, 1.4, -0.4);
  S.teil({ oben: true, id: "moewe", de: "die Möwe", syl: "MÖ-we", it: "il gabbiano", itSyl: "gab-BIA-no", en: "seagull", x: 150, y: 150, kunst: um(150, 150, k),
    tipp: "Am Niagara leben viele Möwen. Sie fangen Fische, die mit dem Wasser die Fälle hinabstürzen." });
}

/* =====================================================================
   10 — DIE KANADAGANS (ein Keil zieht nach Süden)
   ===================================================================== */
{
  const gans = (x, y, s, fl) => {
    const k = (v) => r(v * s);
    let o = `<g transform="translate(${r(x)} ${r(y)})">`;
    o += `<path d="M${k(-3.6)} ${k(-1.2 * fl - 0.2)} Q${k(-1.6)} ${k(-0.8 * fl - 0.6)} ${k(-0.2)} ${k(-0.2)} L${k(0.6)} ${k(-0.2)} Q${k(0.4)} ${k(-0.9 * fl)} ${k(2.2)} ${k(-1.6 * fl - 0.3)} Q${k(1.2)} ${k(-0.2 * fl)} ${k(0.9)} ${k(0.4)} L${k(-0.6)} ${k(0.4)} Z" fill="#5a4e44"/>`;
    o += `<path d="M${k(-1.6)} ${k(0)} Q${k(0)} ${k(-0.5)} ${k(1.6)} ${k(-0.1)} Q${k(1.2)} ${k(0.6)} ${k(-1.2)} ${k(0.5)} Q${k(-1.8)} ${k(0.4)} ${k(-1.6)} 0 Z" fill="#8a7a6a"/>`;
    o += `<path d="M${k(-1.6)} ${k(0.3)} Q${k(-1.9)} ${k(0.3)} ${k(-2.2)} ${k(0.5)} L${k(-1.6)} ${k(0.55)} Z" fill="#f2efe8"/>`;
    o += `<path d="M${k(1.5)} ${k(-0.05)} L${k(3.4)} ${k(-0.5)}" stroke="#1b1b1b" stroke-width="${k(0.42)}" stroke-linecap="round"/><path d="M${k(3.1)} ${k(-0.6)} l${k(0.5)} ${k(0.15)}" stroke="#f2efe8" stroke-width="${k(0.3)}"/>`;
    return o + `</g>`;
  };
  let k = "";
  const keil = [[176, 62, 0], [168, 57.6, 1], [168, 66.4, 1], [160, 53.2, 0], [160, 70.8, 0], [152, 48.8, 1], [152, 75.2, 1], [144, 44.4, 0], [144, 79.6, 1]];
  for (const [x, y, fl] of keil) k += gans(x, y, 1.05, fl ? 1 : -0.6);
  S.teil({ oben: true, id: "kanadagans", de: "die Kanadagans", syl: "KA-na-da-gans", it: "l'oca canadese", itSyl: "O-ca ca-na-DE-se", en: "Canada goose", x: 162, y: 62, kunst: um(162, 62, k),
    tipp: "Im Herbst fliegen die Kanadagänse in einem Keil nach Süden. Dabei rufen sie laut." });
}

/* =====================================================================
   11 — DER AHORN (Zweige oben links, leuchtend rot) und DAS AHORNBLATT
   ===================================================================== */
/* Ahornblatt: fünf Lappen mit Zähnen, Stiel; Größe s (Einheiten), Drehung w */
const blatt = (x, y, s, w, farbe, ader = "#7a1a10") => {
  const pts = [[0, -1], [0.18, -0.62], [0.42, -0.72], [0.36, -0.42], [0.82, -0.5], [0.68, -0.22], [0.98, 0.02], [0.6, 0.12], [0.62, 0.36], [0.3, 0.26], [0.1, 0.5], [0.04, 0.5], [0.04, 0.9], [-0.04, 0.9], [-0.04, 0.5], [-0.1, 0.5], [-0.3, 0.26], [-0.62, 0.36], [-0.6, 0.12], [-0.98, 0.02], [-0.68, -0.22], [-0.82, -0.5], [-0.36, -0.42], [-0.42, -0.72], [-0.18, -0.62]];
  const c = Math.cos(w), sn = Math.sin(w), T = ([a, b]) => [x + (a * c - b * sn) * s, y + (a * sn + b * c) * s];
  let o = `<path d="${P(pts.map(T))}" fill="${farbe}"/>`;
  const [ax, ay] = T([0, 0.5]);
  for (const q of [[0, -0.9], [0.86, -0.4], [-0.86, -0.4], [0.84, 0.06], [-0.84, 0.06]]) { const [bx, by] = T(q); o += `M${r(ax)} ${r(ay)} L${r(bx)} ${r(by)}`; }
  return o.replace(/(M[\d.-]+ [\d.-]+ L[\d.-]+ [\d.-]+)+$/, (m) => `<path d="${m}" stroke="${ader}" stroke-width="${r(s * 0.05)}" opacity=".6"/>`);
};
{
  let k = "";
  /* Äste kommen von links oben (der Baum steht hinter uns links im Park) */
  const aeste = [[[-6, -4], [30, 10], [70, 22], [104, 28]], [[24, 6], [36, 26], [46, 40]], [[56, 18], [74, 38], [84, 46]], [[-6, 30], [18, 34], [40, 52]]];
  for (const a of aeste) k += `<path d="${glatt(a, false)}" stroke="#3a2618" stroke-width="${a === aeste[0] ? 2.2 : 1.1}" fill="none" stroke-linecap="round"/>`;
  const zb = zufall(93);
  const farben = ["#d8301e", "#e8562a", "#f08a2c", "#c8241a", "#f2b23a", "#b81c14"];
  for (const a of aeste) for (let i = 0; i < 14; i++) {
    const t = zb(), j = Math.min(a.length - 2, Math.floor(t * (a.length - 1))), tt = t * (a.length - 1) - j;
    const x = a[j][0] + (a[j + 1][0] - a[j][0]) * tt + (zb() - 0.5) * 12, y = a[j][1] + (a[j + 1][1] - a[j][1]) * tt + (zb() - 0.2) * 9;
    if (x < 3 || y < 2) continue;
    k += blatt(x, y, 4 + zb() * 2.4, zb() * 6.28, farben[Math.floor(zb() * farben.length)]);
  }
  S.teil({ id: "ahorn", de: "der Ahorn", syl: "A-horn", it: "l'acero", itSyl: "A-ce-ro", en: "maple tree", x: 40, y: 24, kunst: um(40, 24, `<g filter="${VOL}">${kappeRand(k)}</g>`),
    tipp: "Im Herbst färbt sich der Zuckerahorn leuchtend rot. Aus seinem Saft kocht man Ahornsirup." });
}

/* =====================================================================
   12 — DIE MAUER (Steinmauer an der Kante, wir schauen auf die Abdeckplatten)
   ===================================================================== */
const KAPPE = 219, FRONT = 244;     /* Hinterkante der Abdeckplatten, Vorderkante (Oberkante der Mauerfront) */
{
  /* Abdeckplatten aus Kalkstein (oben, im Nachmittagslicht), leicht überstehend */
  let k = `<path d="M-1 ${KAPPE} L401 ${KAPPE - 1.2} L401 ${FRONT + 1} L-1 ${FRONT + 2} Z" fill="${S.lg("kappe", [[0, "#f4dfbd"], [1, "#e0c79f"]])}"/>`;
  k += `<path d="M-1 ${KAPPE} L401 ${KAPPE - 1.2}" stroke="#fff8ea" stroke-width=".8"/>`;
  for (const xb of [-60, 150, 330]) k += `<path d="M${r(CX + (xb - CX) * 0.82)} ${r(KAPPE + 0.1)} L${xb} ${FRONT + 1.5}" stroke="#a8987e" stroke-width=".5"/>`;
  /* Vorderkante der Platte: runde Fase im Licht, darunter Schattenfuge */
  k += `<path d="M-1 ${FRONT + 2} L401 ${FRONT + 1} L401 ${FRONT + 4} L-1 ${FRONT + 5} Z" fill="${S.lg("fase", [[0, "#f6ecd8"], [1, "#b5a68c"]])}"/>`;
  k += `<path d="M-1 ${FRONT + 5} L401 ${FRONT + 4} L401 ${FRONT + 7} L-1 ${FRONT + 8} Z" fill="#5a4c3c" opacity=".45"/>`;
  /* Mauerfront: grob behauene Kalksteinblöcke in unregelmäßigen Lagen */
  const zm = zufall(101);
  let steine = "";
  const farb = ["#d6c7a8", "#cbb999", "#dccdb0", "#c3b08f", "#d0c2a6", "#bfae90"];
  let y = FRONT + 7.5;
  while (y < 262) {
    const h = 8 + zm() * 7;
    for (let x = -4 - zm() * 14; x < 404; ) {
      const w = 16 + zm() * 26, hh = h - 1 - zm() * 1.6, yy = y + zm() * 0.8;
      const c = farb[Math.floor(zm() * farb.length)];
      steine += `<path d="M${r(x + 1.2)} ${r(yy)} Q${r(x + w * 0.5)} ${r(yy - 0.8)} ${r(x + w - 1.4)} ${r(yy + 0.2)} Q${r(x + w)} ${r(yy + hh * 0.5)} ${r(x + w - 1)} ${r(yy + hh)} Q${r(x + w * 0.5)} ${r(yy + hh + 0.6)} ${r(x + 1)} ${r(yy + hh - 0.2)} Q${r(x - 0.2)} ${r(yy + hh * 0.5)} ${r(x + 1.2)} ${r(yy)} Z" fill="${c}"/>`;
      steine += `<path d="M${r(x + 1.6)} ${r(yy + 0.7)} Q${r(x + w * 0.5)} ${r(yy)} ${r(x + w - 1.8)} ${r(yy + 0.9)}" stroke="#f6ecd6" stroke-width=".7" fill="none" opacity=".75"/>`;
      steine += `<path d="M${r(x + 1.6)} ${r(yy + hh - 0.6)} Q${r(x + w * 0.5)} ${r(yy + hh)} ${r(x + w - 1.6)} ${r(yy + hh - 0.5)}" stroke="#8c7a5e" stroke-width=".8" fill="none" opacity=".55"/>`;
      if (zm() < 0.4) steine += `<path d="M${r(x + 3 + zm() * (w - 9))} ${r(yy + 2 + zm() * (hh - 5))} l${r(2 + zm() * 3)} ${r(0.5)} l${r(-0.8)} ${r(1.3)} Z" fill="#9c8b70" opacity=".45"/>`;
      x += w + 0.9 + zm() * 0.6;
    }
    y += h;
  }
  k += `<path d="M-1 ${FRONT + 6} L401 ${FRONT + 5} L401 261 L-1 261 Z" fill="#6d5c47"/>` + steine;
  /* Poren und Flechten */
  let pk = "";
  for (let i = 0; i < 70; i++) { const x = zm() * 400, yy = KAPPE + 2 + zm() * (FRONT - KAPPE - 2); pk += `<circle cx="${r(x)}" cy="${r(yy)}" r="${r(0.15 + zm() * 0.35)}"/>`; }
  k += `<g fill="#8f7f66" opacity=".5">${pk}</g>`;
  for (const [x, yy, rr] of [[34, 232, 4], [262, 226, 2.4], [150, 238, 3.2]]) k += `<ellipse cx="${x}" cy="${yy}" rx="${rr}" ry="${r(rr * 0.5)}" fill="#c6bf86" opacity=".55"/>`;
  S.teil({ id: "mauer", de: "die Mauer", syl: "MAU-er", it: "il muretto", itSyl: "mu-RET-to", en: "wall", x: 200, y: 230, kunst: um(200, 230, kappeRand(k)),
    tipp: "Die Mauer schützt die Besucher an der Kante. Dahinter geht es 50 Meter in die Tiefe." });
}

/* Schatten auf der Abdeckplatte: Sonne tief hinter uns — lange Schatten laufen nach vorn (zum Fluchtpunkt hin)
   und fallen über die Hinterkante in die Schlucht; hier nur bis zur Kante */
const kappenSchatten = (x0, x1, yb) => {
  const t = (yb - KAPPE) / Math.max(1, yb - HOR), m = (x0 + x1) / 2, w = (x1 - x0) * 0.42, xm = m + (CX - m) * t - 3;
  return `<path d="M${r(m - w)} ${r(yb + 0.6)} Q${r(m)} ${r(yb + 1.6)} ${r(m + w)} ${r(yb + 0.6)} L${r(xm + w * 0.6)} ${KAPPE + 0.8} L${r(xm - w * 0.6)} ${KAPPE + 0.8} Z" fill="url(#${S.id("kschatten")})" filter="url(#${S.id("weich")})"/>`;
};
S.def(`<linearGradient id="${S.id("kschatten")}" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#4a3420" stop-opacity=".55"/><stop offset="1" stop-color="#4a3420" stop-opacity=".2"/></linearGradient>`);

/* =====================================================================
   13 — DAS FERNROHR (Münzfernrohr an der Mauer, links)
   ===================================================================== */
{
  let k = "";
  /* Münzfernrohr in Dreiviertelansicht (wie die Tower-Optical-Geräte): runder Kopf mit kurzem Schnabel,
     schaut nach rechts zu den Fällen; Okulare seitlich, Preisschild an der Säule */
  const X = 46, Y = 190;
  k += `<path d="M${X - 3} 261 L${X - 2.4} ${Y + 20} L${X + 2.4} ${Y + 20} L${X + 3} 261 Z" fill="${S.lg("saeule", [[0, "#1a3328"], [0.55, "#2c5440"], [0.8, "#4c7c64"], [1, "#22433a"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${X - 4.6}" y="${Y + 30}" width="9.2" height="7" rx="1" fill="#24463a"/><rect x="${X - 3.4}" y="${Y + 31.4}" width="6.8" height="3.4" rx=".4" fill="#d9c98a"/><text x="${X}" y="${Y + 34.1}" font-size="2.4" text-anchor="middle" fill="#3a2a10" font-family="Arial,sans-serif">$ 1</text>`;
  /* Gabel */
  k += `<path d="M${X - 1.6} ${Y + 21} L${X - 7.6} ${Y + 8} L${X - 5.6} ${Y + 7} L${X} ${Y + 17} L${X + 5.4} ${Y + 7} L${X + 7.4} ${Y + 8} L${X + 1.6} ${Y + 21} Z" fill="#244438"/>`;
  /* Kopf: rundlicher Körper, Schnabel mit zwei Objektiven nach rechts vorn */
  k += `<path d="M${X - 13} ${Y - 2} Q${X - 14} ${Y - 11} ${X - 5} ${Y - 12.5} L${X + 7} ${Y - 12} Q${X + 13} ${Y - 10} ${X + 13} ${Y - 2} Q${X + 13} ${Y + 7} ${X + 5} ${Y + 8} L${X - 6} ${Y + 8} Q${X - 13} ${Y + 7} ${X - 13} ${Y - 2} Z" fill="${S.lg("kopf", [[0, "#1d3d31"], [0.55, "#2f5e48"], [0.85, "#4f8a6c"], [1, "#2a5242"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${X + 9} ${Y - 9} L${X + 19} ${Y - 7.6} Q${X + 21} ${Y - 2} ${X + 19} ${Y + 3.6} L${X + 9} ${Y + 5} Z" fill="#26493a"/>`;
  k += `<ellipse cx="${X + 19.4}" cy="${Y - 4.6}" rx="1.6" ry="2.6" fill="#33526a"/><ellipse cx="${X + 19.4}" cy="${Y + 1.2}" rx="1.6" ry="2.6" fill="#33526a"/><path d="M${X + 19} ${Y - 6.4} q.8 1.2 0 2.6 M${X + 19} ${Y - 0.6} q.8 1.2 0 2.6" stroke="#cfe8f4" stroke-width=".4" fill="none"/>`;
  /* Okulare mit Gummimuscheln an der linken Seite (zum Betrachter hin, schräg) */
  k += `<path d="M${X - 12} ${Y - 7} q-3.4 0 -3.6 2.4 q.2 2.4 3.6 2.4 Z M${X - 12} ${Y - 1} q-3.4 0 -3.6 2.4 q.2 2.4 3.6 2.4 Z" fill="#141614"/>`;
  k += `<path d="M${X - 9} ${Y - 12} Q${X} ${Y - 14.5} ${X + 8} ${Y - 12}" stroke="#a9d4bc" stroke-width=".8" fill="none" opacity=".55"/>`;
  k = kappenSchatten(X - 3, X + 3, FRONT + 1) + `<g filter="${VOL}">${k}</g>`;
  S.teil({ id: "fernrohr", de: "das Fernrohr", syl: "FERN-rohr", it: "il cannocchiale", itSyl: "can-noc-CHIA-le", en: "telescope", x: X, y: Y, kunst: um(X, Y, kappeRand(k)),
    tipp: "Für eine Münze kann man durch das Fernrohr schauen. Dann sieht man das Boot ganz nah." });
}

/* =====================================================================
   14 — DER AHORNSIRUP (Flasche in Blattform), 15 — DIE TÜTE, 16 — DIE FLAGGE
   ===================================================================== */
{
  const X = 288, Y = 236;
  /* Flasche: Ahornblatt-Form aus Glas, darin goldbrauner Sirup, rote Kappe */
  const form = [[0, -30], [3, -26], [4, -24], [8, -26], [7, -21], [13, -22], [11, -17], [15, -14], [10, -12], [11, -6], [6, -7], [4, -1], [-4, -1], [-6, -7], [-11, -6], [-10, -12], [-15, -14], [-11, -17], [-13, -22], [-7, -21], [-8, -26], [-4, -24], [-3, -26]].map(([a, b]) => [a, b * 1.0]);
  let k = kappenSchatten(X - 13, X + 13, Y);
  k += `<path d="${glatt(form, true, 0.35)}" fill="${S.lg("sirup", [[0, "#7a3a0e"], [0.45, "#c8741e"], [0.75, "#e9a23a"], [1, "#9a4a14"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="${glatt(form.map(([a, b]) => [a * 0.9, b * 0.9 - 2.4]), true, 0.35)}" fill="none" stroke="#ffd896" stroke-width=".6" opacity=".5"/>`;
  k += `<path d="M-1.6 -31 h3.2 v-3 h-3.2 Z" fill="#e8d9b0" transform="translate(${X} ${Y})"/>`;
  k = k.replace(`transform="translate(${X} ${Y})"`, "");
  k = `<g transform="translate(${X} ${Y})">` + k.replace(kappenSchatten(X - 13, X + 13, Y), "") + `<path d="M-2.4 -34 h4.8 v-4.6 q-2.4 -1 -4.8 0 Z" fill="#c8202a"/><path d="M-2 -38 h1.2 v4" stroke="#ff8a8a" stroke-width=".5"/>` +
    `<path d="M-6 -16 h12 v7 h-12 Z" fill="#f6f0e2"/><path d="M-4 -12.4 l1 -1.6 l.6 .8 l1 -1.6 l.8 1.6 l.6 -.8 l1 1.6 Z" fill="#c8202a"/><path d="M-5 -10.4 h10" stroke="#7a5a3a" stroke-width=".35"/>` +
    `<path d="M-9 -22 Q-8 -14 -7 -8" stroke="#fff" stroke-width="1.2" fill="none" opacity=".55" stroke-linecap="round"/></g>`;
  k = kappenSchatten(X - 13, X + 13, Y) + `<g filter="${VOL_KLEIN}">${k}</g>`;
  S.teil({ id: "ahornsirup", de: "der Ahornsirup", syl: "A-horn-si-rup", it: "lo sciroppo d'acero", itSyl: "sci-ROP-po d'A-ce-ro", en: "maple syrup", x: X, y: Y - 16, kunst: um(X, Y - 16, k),
    tipp: "Ahornsirup wird aus dem Saft des Zuckerahorns gekocht. Für einen Liter Sirup braucht man etwa 40 Liter Saft." });
}
{
  const X = 338, Y = 238;
  let k = kappenSchatten(X - 15, X + 15, Y);
  /* Papiertüte mit Ahornblatt, Kordelgriffe */
  let t = `<path d="M${X - 15} ${Y} L${X - 13.6} ${Y - 40} L${X + 12.6} ${Y - 40} L${X + 15} ${Y} Z" fill="${S.lg("tuete", [[0, "#e7e1d4"], [0.6, "#fbf8f2"], [1, "#ece6d8"]], 0, 0, 1, 0)}"/>`;
  t += `<path d="M${X - 13.6} ${Y - 40} L${X - 10} ${Y - 43} L${X + 15.6} ${Y - 43} L${X + 12.6} ${Y - 40} Z" fill="#d8d0c0"/>`;
  t += `<path d="M${X - 8} ${Y - 40} q4 -12 9 0 M${X + 2} ${Y - 40} q4 -11 8 0" stroke="#8a6a44" stroke-width=".9" fill="none"/>`;
  t += blatt(X, Y - 20, 8.5, 0, "#d52b1e", "#8a1a10").replace(/<path d="([^"]*)" stroke[^>]*\/>$/, "");
  t += `<text x="${X}" y="${Y - 6}" font-size="3.2" text-anchor="middle" fill="#9a2a20" font-family="Georgia,serif" font-weight="bold">NIAGARA</text>`;
  k += `<g filter="${VOL_KLEIN}">${t}</g>`;
  S.teil({ id: "tuete", de: "die Tüte", syl: "TÜ-te", it: "il sacchetto", itSyl: "sac-CHET-to", en: "bag", x: X, y: Y - 20, kunst: um(X, Y - 20, k),
    tipp: "In der Tüte sind Andenken aus dem Laden am Table Rock." });
  /* Fähnchen: steckt in der Tüte, Stab schräg, Flagge Kanadas (rot-weiß-rot, Ahornblatt mit 11 Spitzen) */
  const sx = X + 4, sy = Y - 38, ex = X + 13, ey = Y - 74;
  let f = `<path d="M${sx} ${sy} L${ex} ${ey}" stroke="#a8875a" stroke-width="1" stroke-linecap="round"/>`;
  const fl = [[ex, ey], [ex + 26, ey - 3], [ex + 27, ey + 11], [ex + 1.6, ey + 14]];
  const m = (a, b, t2) => [a[0] + (b[0] - a[0]) * t2, a[1] + (b[1] - a[1]) * t2];
  const q = (u, v) => { const o = m(fl[0], fl[1], u), un = m(fl[3], fl[2], u); return m(o, un, v); };
  f += `<path d="M${r(fl[0][0])} ${r(fl[0][1])} Q${r(ex + 13)} ${r(ey - 4.4)} ${r(fl[1][0])} ${r(fl[1][1])} L${r(fl[2][0])} ${r(fl[2][1])} Q${r(ex + 14)} ${r(ey + 10)} ${r(fl[3][0])} ${r(fl[3][1])} Z" fill="#ffffff"/>`;
  for (const [u0, u1] of [[0, 0.25], [0.75, 1]]) { const a = q(u0, 0), b = q(u1, 0), c = q(u1, 1), d = q(u0, 1); f += `<path d="${P([a, b, c, d])}" fill="#d52b1e"/>`; }
  const [cx, cy] = q(0.5, 0.5);
  f += blatt(cx, cy + 0.6, 4.4, -0.06, "#d52b1e", "#d52b1e").replace(/<path d="([^"]*)" stroke[^>]*\/>$/, "");
  f += `<path d="M${r(fl[0][0] + 6)} ${r(fl[0][1] + 2)} Q${r(ex + 13)} ${r(ey + 4)} ${r(ex + 20)} ${r(ey + 2)}" stroke="#000" stroke-width="2.4" fill="none" opacity=".05"/>`;
  S.teil({ oben: true, id: "flagge", de: "die Flagge", syl: "FLAG-ge", it: "la bandiera", itSyl: "ban-DIE-ra", en: "flag", x: ex + 13, y: ey + 6, kunst: um(ex + 13, ey + 6, `<g filter="${VOL_KLEIN}">${f}</g>`),
    tipp: "Die Flagge Kanadas ist rot und weiß. In der Mitte ist ein rotes Ahornblatt." });
}

/* =====================================================================
   17 — DAS EICHHÖRNCHEN (schwarzes Grauhörnchen) auf der Mauer, rechts
   ===================================================================== */
{
  const X = 382, Y = 242;
  let k = kappenSchatten(X - 9, X + 7, Y);
  /* buschiger Schwanz hinter dem Rücken, hoch aufgestellt und oben eingerollt */
  const schw = [[X + 3, Y - 2], [X + 11, Y - 6], [X + 15, Y - 16], [X + 14, Y - 28], [X + 9, Y - 37], [X + 2, Y - 40], [X - 2, Y - 37], [X + 1, Y - 34], [X + 6, Y - 33], [X + 8, Y - 26], [X + 7, Y - 16], [X + 2, Y - 8]];
  let e = `<path d="${glatt(schw, true, 0.8)}" fill="${S.lg("schwanz", [[0, "#1a1817"], [1, "#3a3532"]], 0, 0, 1, 0)}"/>`;
  let haar = "";
  for (let i = 0; i < 18; i++) { const t = i / 17, p = schw[Math.min(5, Math.floor(t * 6))], p2 = schw[Math.min(6, Math.floor(t * 6) + 1)], x = p[0] + (p2[0] - p[0]) * (t * 6 % 1), y = p[1] + (p2[1] - p[1]) * (t * 6 % 1); haar += `M${r(x)} ${r(y)} l${r(1.4 - t * 2.6)} ${r(-0.8 - t * 0.4)}`; }
  e += `<path d="${haar}" stroke="#6e6862" stroke-width=".45" opacity=".75" stroke-linecap="round"/>`;
  /* Körper: sitzt aufrecht, Rücken rund, Bauch etwas heller */
  e += `<path d="${glatt([[X - 7, Y], [X - 9, Y - 6], [X - 8, Y - 13], [X - 5, Y - 18], [X, Y - 19], [X + 4, Y - 15], [X + 5, Y - 8], [X + 5, Y]], true, 0.8)}" fill="${S.lg("hoernchen", [[0, "#141312"], [0.6, "#211f1d"], [1, "#363230"]], 0, 0, 1, 0)}"/>`;
  e += `<path d="${glatt([[X - 7.5, Y - 1], [X - 8.6, Y - 7], [X - 7.6, Y - 12], [X - 5.6, Y - 9], [X - 5, Y - 2]], true, 0.8)}" fill="#2a2725"/>`;
  /* Kopf mit Schnauze nach links, Ohr, Auge mit hellem Ring */
  e += `<path d="${glatt([[X - 4, Y - 18], [X - 7.6, Y - 20], [X - 10.4, Y - 22.4], [X - 9.6, Y - 25], [X - 6, Y - 27.4], [X - 1.6, Y - 26.6], [X + 0.4, Y - 23], [X - 0.6, Y - 19]], true, 0.8)}" fill="#1d1b19"/>`;
  e += `<path d="M${X - 3.6} ${Y - 26.6} l-.4 -3.6 l2.6 2.6 Z" fill="#1d1b19"/><path d="M${X - 3.4} ${Y - 27} l-.2 -2 l1.2 1.4 Z" fill="#6a5a4c"/>`;
  e += `<circle cx="${X - 6.4}" cy="${Y - 24}" r="1.2" fill="#8a7a68"/><circle cx="${X - 6.4}" cy="${Y - 24}" r=".8" fill="#0b0a09"/><circle cx="${X - 6.7}" cy="${Y - 24.3}" r=".3" fill="#fff"/><circle cx="${X - 10.2}" cy="${Y - 23}" r=".5" fill="#111"/>`;
  /* Vorderpfoten halten eine Nuss vor der Brust */
  e += `<ellipse cx="${X - 9}" cy="${Y - 15}" rx="2.2" ry="1.9" fill="#a0723c"/><path d="M${X - 10} ${Y - 15.6} q1 -.7 2.2 0" stroke="#d9a868" stroke-width=".4" fill="none"/>`;
  e += `<path d="M${X - 5} ${Y - 16.4} q-2 .4 -3.2 1.6 M${X - 4.6} ${Y - 13.6} q-2 .2 -3.2 1.4" stroke="#24201c" stroke-width="1.2" fill="none" stroke-linecap="round"/>`;
  e += `<path d="M${X - 7} ${Y} q1.8 -1 3.8 0 M${X} ${Y} q2 -1 4 0" stroke="#1d1a17" stroke-width="1.3" fill="none" stroke-linecap="round"/>`;
  k += `<g filter="${VOL_KLEIN}">${e}</g>`;
  S.teil({ id: "eichhoernchen", de: "das Eichhörnchen", syl: "EICH-hörn-chen", it: "lo scoiattolo", itSyl: "sco-IAT-to-lo", en: "squirrel", x: X, y: Y - 20, kunst: um(X, Y - 20, k),
    tipp: "In Kanada gibt es viele schwarze Eichhörnchen. Es sind Grauhörnchen mit dunklem Fell." });
}

/* =====================================================================
   18 — DAS AHORNBLATT (zwei Blätter liegen auf der Mauer)
   ===================================================================== */
{
  let k = "";
  for (const [x, y, s0, w, c] of [[206, 234, 11, 0.4, "#d8301e"], [246, 228, 8.5, -0.9, "#f08a2c"]]) {
    k += `<g transform="translate(${x} ${y}) scale(1 .5) translate(${-x} ${-y})">${blatt(x, y, s0, w, c)}</g>`;
    k += `<ellipse cx="${x - 1}" cy="${y + 2.6}" rx="${r(s0 * 0.8)}" ry="${r(s0 * 0.16)}" fill="#5a3c22" opacity=".25"/>`;
  }
  S.teil({ oben: true, id: "ahornblatt", de: "das Ahornblatt", syl: "A-horn-blatt", it: "la foglia d'acero", itSyl: "FO-glia d'A-ce-ro", en: "maple leaf", x: 226, y: 231, kunst: um(226, 231, `<g filter="${VOL_KLEIN}">${k}</g>`),
    tipp: "Das Ahornblatt ist das Zeichen Kanadas. Man sieht es auf der Flagge und auf vielen Andenken." });
}

/* =====================================================================
   19 — DAS KIND (im roten Regencape, kommt gerade vom Boot und zeigt zum Regenbogen)
   20 — DER TOURIST (fotografiert mit dem Handy)
   Beide stehen links neben uns an der Mauer, ganz nah: die Füße liegen unter dem Bildrand.
   ===================================================================== */
{
  const fig = (spec, hoehe) => B.mensch(Object.assign({ ohneSchatten: true, laecheln: true }, spec), hoehe);
  const pk = (m, n) => [m.z.punkte[n][0] * m.k, m.z.punkte[n][1] * m.k];
  /* Tourist: hält das Handy hoch, Rücken halb zu uns */
  const T = { x: 86, y: 270 };
  const poseFoto = { lende: 1, brust: -2, nacken: 2, kopf: -4, schulterL: { vor: 70, seit: 18 }, ellbogenL: 100, unterarmL: 60, handL: 10, fingerL: 0.6, schulterR: { vor: 68, seit: 20 }, ellbogenR: 104, unterarmR: 60, handR: 10, fingerR: 0.6,
    huefteL: { vor: 4, seit: 4, dreh: -6 }, knieL: 4, fussL: 0, huefteR: { vor: -4, seit: 4, dreh: -6 }, knieR: 2, fussR: 0 };
  const mt = fig({ id: "kan_tourist", geschlecht: "m", alter: "erwachsen", pose: poseFoto, blick: 150, frisur: "kurz", haarfarbe: "dunkelbraun", haut: "mittel",
    kleidung: { oberteil: { stueck: "pullover", farbe: "#2f5f95" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" }, kopf: { stueck: "kappe", farbe: "#c8202a" } } }, 104);
  const hx = (mt.z.handL.x + mt.z.handR.x) / 2 * mt.k, hy = (mt.z.handL.y + mt.z.handR.y) / 2 * mt.k;
  let kt = `<g transform="translate(${T.x} ${T.y})"><g filter="${VOL}">${vereinfache(mt.svg, 0.3)}</g><rect x="${r(hx - 2.2)}" y="${r(hy - 4.6)}" width="4.4" height="3.2" rx=".5" fill="#1b1d22"/><rect x="${r(hx - 1.8)}" y="${r(hy - 4.2)}" width="3.6" height="2.4" rx=".3" fill="#7fb0d8"/></g>`;
  S.teil({ id: "tourist", de: "der Tourist", syl: "tou-RIST", it: "il turista", itSyl: "tu-RI-sta", en: "tourist", x: T.x, y: T.y - 50, kunst: um(T.x, T.y - 50, kt),
    tipp: "Jedes Jahr kommen Millionen Menschen zu den Niagarafällen. Fast alle machen hier ein Foto." });
  /* Kind: rotes Regencape mit Kapuze, nass glänzend, zeigt mit dem rechten Arm zum Regenbogen */
  const K = { x: 128, y: 268 };
  const poseZeig = { lende: 1, brust: -2, nacken: 2, kopf: -8, schulterL: { vor: 6, seit: 10 }, ellbogenL: 14, unterarmL: 0, handL: 0, fingerL: 0.4, schulterR: { vor: 120, seit: 34 }, ellbogenR: 8, unterarmR: 0, handR: 0, fingerR: 0.9,
    huefteL: { vor: 3, seit: 3, dreh: -6 }, knieL: 3, fussL: 0, huefteR: { vor: -3, seit: 3, dreh: -6 }, knieR: 2, fussR: 0 };
  const mk = fig({ id: "kan_kind", geschlecht: "w", alter: "kind", pose: poseZeig, blick: 140, frisur: "zopf", haarfarbe: "braun", haut: "hell",
    kleidung: { oberteil: { stueck: "pullover", farbe: "#e9c23a" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "gummistiefel", farbe: "#2f6f8f" } } }, 82);
  const [sx, sy] = pk(mk, "scheitel"), [hkx] = pk(mk, "hinterkopf"), [stx] = pk(mk, "stirn"), [slx, sly] = pk(mk, "schulterL"), [srx] = pk(mk, "schulterR"), [, kny] = pk(mk, "knieL"), [hx2, hy2] = pk(mk, "hals");
  const xa = Math.min(slx, srx) - 3, xb = Math.max(slx, srx) + 3, yu = kny - 2, cx = (stx + hkx) / 2, br = Math.abs(stx - hkx) / 2 + 1.6;
  let cape = `<path d="M${r(cx - br)} ${r(hy2 + 1)} Q${r(cx - br - 0.6)} ${r(sy - 3)} ${r(cx)} ${r(sy - 3.4)} Q${r(cx + br + 0.6)} ${r(sy - 3)} ${r(cx + br)} ${r(hy2 + 1)} Q${r(xb + 1)} ${r(sly + 1)} ${r(xb + 3)} ${r(yu)} Q${r((xa + xb) / 2)} ${r(yu + 2.4)} ${r(xa - 3)} ${r(yu)} Q${r(xa - 1)} ${r(sly + 1)} ${r(cx - br)} ${r(hy2 + 1)} Z" fill="${S.lg("kindcape", [[0, "#8e141c"], [0.5, "#d02028"], [1, "#e84a3a"]], 0, 0, 1, 0)}" opacity=".93"/>`;
  /* nasser Glanz: lange, helle Lichtstreifen innen auf der rechten (sonnennahen) Seite */
  cape += `<path d="M${r(xb - 2)} ${r(sly + 4)} Q${r(xb + 0.6)} ${r((sly + yu) / 2)} ${r(xb + 1)} ${r(yu - 3)} M${r(cx + br * 0.4)} ${r(sy - 2)} Q${r(cx + br * 0.9)} ${r(sy + 1)} ${r(cx + br * 0.8)} ${r(hy2)}" stroke="#ffd0c4" stroke-width=".9" fill="none" opacity=".75" stroke-linecap="round"/>`;
  cape += `<path d="M${r((xa + xb) / 2 - 2)} ${r(sly + 6)} l-1.5 ${r(yu - sly - 9)} M${r((xa + xb) / 2 + 3)} ${r(sly + 7)} l1 ${r(yu - sly - 10)}" stroke="#7a1016" stroke-width=".5" opacity=".6"/>`;
  for (const [dx, dy] of [[-2, 10], [4, 16], [1, 24], [-4, 20]]) cape += `<circle cx="${r(cx + dx)}" cy="${r(sly + dy)}" r=".55" fill="#ffffff" opacity=".7"/>`;
  const kk = `<g transform="translate(${K.x} ${K.y})"><g filter="${VOL}">${vereinfache(mk.svg, 0.3)}${cape}</g></g>`;
  S.teil({ id: "kind", de: "das Kind", syl: "KIND", it: "la bambina", itSyl: "bam-BI-na", en: "child", x: K.x, y: K.y - 40, kunst: um(K.x, K.y - 40, kk),
    tipp: "Das Mädchen kommt gerade vom Boot. Es trägt noch das nasse rote Regencape und zeigt auf den Regenbogen." });
}

/* Abendlicht: warmer Schein von hinten rechts, fängt keinen Tipp ab */
S.davor(`<rect width="400" height="260" fill="${S.rg("abendlicht", [[0, "#ffb860", 0.2], [0.6, "#ffcf8a", 0.06], [1, "#ffcf8a", 0]], 1, 1, 0.9)}"/>`);




const silben = (t) => { if (!t) return t; const st = t.split(/([- ])/); const gross = (x) => x.length && x === x.toUpperCase() && x !== x.toLowerCase(); const lang = st.some((x) => gross(x) && x.length > 1); return st.map((x) => (/^[- ]$/.test(x) ? x : (gross(x) && (x.length > 1 || !lang || /[À-ÖÙ-Ý]/.test(x)) ? x : x.toLowerCase()))).join(""); };
for (const t of S.teile) for (const u of [t, ...(t.unter || [])]) { u.syl = silben(u.syl); u.itSyl = silben(u.itSyl); }
const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/kanada.js"));
console.log(aus);
