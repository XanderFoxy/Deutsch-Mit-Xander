#!/usr/bin/env node
/* =====================================================================
   PERU – MACHU PICCHU (FASSUNG 854) — Bilderwelt neu
   ---------------------------------------------------------------------
   XANDER (03.10.): „die bekanntesten Städte in anderen Ländern, die
   berühmt für irgendetwas sind … als Profi-Grafikdesigner auf
   Hollywood-Niveau … mit größter Sorgfalt und Präzision“.

   RECHERCHE (Lagepläne des Santuario Histórico, UNESCO-Beschreibung,
   Reiseführer zum „Circuito 1“, Beschreibungen der Casa del Guardián,
   Fotos des Postkartenblicks, Besucherregeln der SERNANP):
   - STANDORT: die obere Terrasse beim WÄCHTERHAUS (Casa del Guardián,
     Caretaker's Hut) im Südosten über der Ruinenstadt, rund 2 500 m hoch.
     Von hier stammt das Postkartenfoto. Der Blick geht nach
     NORDNORDWEST (nicht nach Süden): Die Stadt liegt auf dem Sattel
     zwischen dem Berg Machu Picchu (in unserem Rücken) und dem HUAYNA
     PICCHU (2 720 m, rund 290 m über der Stadt), der als steiler
     Zuckerhut dahinter aufragt. Vor seinem Fuß links der kleine,
     runde Huchuy Picchu.
   - Das Wächterhaus: kleines Haus aus groben Feldsteinen mit Lehmmörtel,
     drei Wände und eine offene Langseite, steiles Strohdach (Ichu-Gras,
     rekonstruiert), Giebel mit Steinringen zum Festbinden des Dachs,
     trapezförmige Nischen und Türen — typisch für die Inka: unten breiter
     als oben, das hält bei Erdbeben.
   - Die STADT (2 430 m, 15. Jh., unter Inka Pachacútec): links (Westen)
     der obere Sektor (Hanan) mit dem SONNENTEMPEL (Torreón: halbrunder
     Turm aus fugenlos geschliffenen Granitblöcken, zwei trapezförmige
     Fenster), dahinter der Hügel des Intihuatana (Stufenhügel mit dem
     „Sonnenstein“ oben); in der Mitte der lange, grüne HAUPTPLATZ;
     rechts (Osten) der untere Sektor (Hurin) mit dicht gereihten
     Wohnhäusern — die Dächer fehlen, die hohen GIEBEL stehen noch;
     einige Häuser haben wieder ein Strohdach. Ganz hinten der Heilige
     Felsen am Fuß des Huayna Picchu. Rund um die Stadt Hunderte
     TERRASSEN mit Stützmauern; auf ihnen bauten die Inka Mais und
     Kartoffeln an. Zwischen Landwirtschafts- und Stadtteil ein Graben.
   - Ringsum steile, grün bewaldete Berge (Nebelwald) und die tiefe
     Schlucht des URUBAMBA (rund 450 m tiefer), der die Stadt in einer
     großen Schleife umfließt. Rechts (Osten) jenseits des Flusses der
     Putucusi (rundlicher Berg mit Felswänden); auf unserer Seite
     schlängelt sich die Straße Hiram Bingham in SERPENTINEN zum Fluss
     hinab — dort fahren die grün-weißen Pendelbusse nach Aguas
     Calientes. Morgens hängen NEBELFETZEN in der Schlucht.
   - Tiere und Pflanzen: LAMAS weiden auf den Terrassen (eine kleine
     Herde lebt dort und „mäht“ das Gras), dazu Kolibris und über 400
     Orchideenarten; am Weg blüht die rosa-violette Orchidee „Wiñay
     Wayna“ (Quechua: „ewig jung“, Epidendrum secundum).
   - Menschen: Besucher kommen mit Führer und auf festen Rundwegen;
     Musikinstrumente spielen ist verboten. Viele tragen Andenkenkleidung
     aus Cusco: die CHULLO-Mütze (gestrickt, mit Ohrenklappen, Bommeln
     und Mustern) und den PONCHO aus Alpakawolle (in der Gegend von
     Cusco oft rot mit bunten Streifen). Das Mädchen hält eine
     PANFLÖTE (Siku/Zampoña) aus dem Markt von Aguas Calientes in der
     Hand — sie spielt hier nicht.
   KAMERA: Augenhöhe = Terrasse am Wächterhaus (0 m), Horizont y = 105,
   Brennweite 330: Punkt in d Metern Entfernung, h Metern Höhe (relativ
   zum Auge) und s Metern seitlich: x = 200 + 330·s/d, y = 105 − 330·h/d.
   Huayna-Picchu-Gipfel: d ≈ 1 000 m, h = +220 m → y ≈ 32. Hauptplatz:
   d ≈ 420 m, h ≈ −85 m → y ≈ 172. Die nahen Terrassen liegen 6–12 m
   unter uns (Lamas d ≈ 25 m, Besucher d ≈ 18 m, beide ≈ 30–40 Einheiten).
   LICHT: Morgen, etwa 9 Uhr im Oktober — die Sonne steht im Ostnordosten,
   rund 45° hoch, also RECHTS und etwas hinter uns. Ostseiten (rechts)
   hell und warm, Westseiten (links) kühl im Schatten; Schatten fallen
   nach links und etwas in die Tiefe. Der Putucusi liegt im Gegenlicht.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "peru", titel: "Peru – Machu Picchu", emoji: "🦙", thema: "Länder", kuerzel: "per", fassung: 854, breite: 400, hoehe: 260 });
{ const lg = S.lg, rg = S.rg, schon = {}; S.lg = (n, ...a) => schon["l" + n] || (schon["l" + n] = lg(n, ...a)); S.rg = (n, ...a) => schon["r" + n] || (schon["r" + n] = rg(n, ...a)); }
const rnd = zufall(1450);
const r = B.r;
const HOR = 105, F = 330, CX = 200;
const um = (ox, oy, svg) => `<g transform="translate(${r(-ox)} ${r(-oy)})">${svg}</g>`;
const P = (pts, zu = true) => "M" + pts.map(([x, y]) => r(x) + " " + r(y)).join(" L") + (zu ? " Z" : "");
/* glatte Kurve (Catmull-Rom) durch Punkte */
const glatt = (pts, zu = true, k = 1) => {
  let d = `M${r(pts[0][0])} ${r(pts[0][1])}`;
  const n = pts.length, q = (i) => pts[zu ? (i + n) % n : Math.max(0, Math.min(n - 1, i))];
  for (let i = 0; i < (zu ? n : n - 1); i++) {
    const p0 = q(i - 1), p1 = q(i), p2 = q(i + 1), p3 = q(i + 2);
    d += ` C${r(p1[0] + (p2[0] - p0[0]) / 6 * k)} ${r(p1[1] + (p2[1] - p0[1]) / 6 * k)} ${r(p2[0] - (p3[0] - p1[0]) / 6 * k)} ${r(p2[1] - (p3[1] - p1[1]) / 6 * k)} ${r(p2[0])} ${r(p2[1])}`;
  }
  return d + (zu ? " Z" : "");
};
/* Linie zwischen zwei Punkten mit kleinen Zacken (Kamm, Felskante) */
const zacken = (a, b, n, amp, seed) => {
  const z = zufall(seed), o = [];
  for (let i = 0; i <= n; i++) { const t = i / n; o.push([a[0] + (b[0] - a[0]) * t + (i && i < n ? (z() - 0.5) * amp * 0.6 : 0), a[1] + (b[1] - a[1]) * t + (i && i < n ? (z() - 0.5) * amp : 0)]); }
  return o;
};
const lerp = (a, b, t) => a + (b - a) * t;
/* Höhenlinie eines Profils (Punkte von links nach rechts) an der Stelle x */
const profilY = (pts, x) => { for (let i = 0; i < pts.length - 1; i++) { const [x0, y0] = pts[i], [x1, y1] = pts[i + 1]; if (x >= x0 && x <= x1) return y0 + (y1 - y0) * (x - x0) / (x1 - x0 || 1); } return x < pts[0][0] ? pts[0][1] : pts[pts.length - 1][1]; };

/* Figuren aus B.mensch für die Ferne vereinfachen: feine Linien entfallen, Zahlen außerhalb von transform auf 1/10 */
const vereinfache = (svg, grenze = 0.25) => svg.replace(/<(path|ellipse|line)\b[^>]*?\/>/g, (el) => { const sw = el.match(/stroke-width="([\d.]+)"/); return /fill="none"/.test(el) && sw && parseFloat(sw[1]) < grenze ? "" : el; });

/* ---------- Filter und Stoffe ---------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("dunst")}" x="-30%" y="-60%" width="160%" height="220%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="2.2"/></filter>`);
S.def(`<filter id="${S.id("weich")}" x="-30%" y="-60%" width="160%" height="220%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation=".8"/></filter>`);
/* Volumen: Lichtkante innen an der Sonnenseite (rechts oben), Eigenschatten innen links unten */
const volumen = (name, licht, schat, dx = 0.35, a1 = 0.75, a2 = 0.35) => {
  S.def(`<filter id="${S.id(name)}" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB"><feOffset in="SourceAlpha" dx="${-dx}" dy="${dx * 0.55}" result="v"/><feComposite in="SourceAlpha" in2="v" operator="out" result="kante"/><feFlood flood-color="${licht}" flood-opacity="${a1}"/><feComposite in2="kante" operator="in" result="l"/><feOffset in="SourceAlpha" dx="${dx * 1.6}" dy="${-dx}" result="w"/><feComposite in="SourceAlpha" in2="w" operator="out" result="kante2"/><feFlood flood-color="${schat}" flood-opacity="${a2}"/><feComposite in2="kante2" operator="in" result="s"/><feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="s"/><feMergeNode in="l"/></feMerge></filter>`);
  return `url(#${S.id(name)})`;
};
const VOL_FIGUR = volumen("volfigur", "#fff1cf", "#1d2a3a", 0.45, 0.7, 0.3);
const VOL_STEIN = volumen("volstein", "#fff4dc", "#2e2a24", 0.3, 0.8, 0.3);
const VOL_KLEIN = volumen("volklein", "#fff3d6", "#203040", 0.18, 0.75, 0.3);
/* Waldkronen als unregelmäßige Kachel: jede Krone mit Lichtseite rechts oben und Schatten links unten */
const kronen = (w, h, n, seed, rmin, rmax) => {
  const z = zufall(seed); let a = "", b = "";
  for (let i = 0; i < n; i++) {
    const x = z() * w, y = z() * h, rr = rmin + z() * (rmax - rmin);
    for (const dx of [-w, 0, w]) for (const dy of [-h, 0, h]) {
      const cx = x + dx, cy = y + dy; if (cx < -rr || cx > w + rr || cy < -rr || cy > h + rr) continue;
      a += `<circle cx="${r(cx - rr * 0.25)}" cy="${r(cy + rr * 0.3)}" r="${r(rr)}"/>`;
      b += `<circle cx="${r(cx + rr * 0.3)}" cy="${r(cy - rr * 0.3)}" r="${r(rr * 0.55)}"/>`;
    }
  }
  return `<g fill="#0e1f14" opacity=".16">${a}</g><g fill="#e8f0b0" opacity=".11">${b}</g>`;
};
S.def(`<pattern id="${S.id("wald")}" width="19" height="13" patternUnits="userSpaceOnUse">${kronen(19, 13, 34, 7, 0.7, 1.4)}</pattern>`);
S.def(`<pattern id="${S.id("waldfein")}" width="13" height="9" patternUnits="userSpaceOnUse">${kronen(13, 9, 30, 11, 0.55, 1.05)}</pattern>`);
S.def(`<pattern id="${S.id("gras")}" width="5" height="2.6" patternUnits="userSpaceOnUse"><path d="M.6 2.3l.2-.9M1.9 1.4l-.2-.8M3.2 2.4l.3-1M4.3 1.1l-.25-.8M2.6.6l.1-.5" stroke="#d6e98a" stroke-width=".22" opacity=".45"/><path d="M1.2 2.5l-.1-.7M3.8 2.2l.2-.6" stroke="#2f5420" stroke-width=".25" opacity=".35"/></pattern>`);
S.def(`<pattern id="${S.id("stroh")}" width="2" height="2.6" patternUnits="userSpaceOnUse"><rect width="2" height="2.6" fill="#b48e4e"/><path d="M.3 0 L.5 2.6 M1.1 0 L1.2 2.6 M1.7 0 L1.6 2.6" stroke="#d9b874" stroke-width=".28"/><path d="M.8 0 L.85 2.6" stroke="#7d5e2c" stroke-width=".22"/></pattern>`);
const WALD = `url(#${S.id("wald")})`, WALDF = `url(#${S.id("waldfein")})`, GRAS = `url(#${S.id("gras")})`, STROH = `url(#${S.id("stroh")})`;
const GRANIT_L = S.lg("granitl", [[0, "#f2ede2"], [1, "#d9d2c3"]]);         /* Ostflächen im Morgenlicht */
const GRANIT_S = S.lg("granits", [[0, "#8f8b82"], [1, "#7a766d"]]);         /* Westflächen im Schatten */
const GRANIT_F = S.lg("granitf", [[0, "#d3cec2"], [1, "#b5afa2"]]);         /* Südflächen (zu uns), streifendes Licht */
const INNEN = "#46423b";
const RASEN = S.lg("rasen", [[0, "#9cc35a"], [1, "#78a646"]]);
const RASEN_D = S.lg("rasend", [[0, "#6f9a42"], [1, "#557f34"]]);

/* =====================================================================
   KULISSE — Morgenhimmel, ferne Kämme, Dunst
   ===================================================================== */
S.hinten(`<rect width="400" height="200" fill="${S.lg("himmel", [[0, "#3d74b8"], [0.42, "#77a5d6"], [0.75, "#b9d2e6"], [1, "#e4ecee"]])}"/>`);
S.hinten(`<ellipse cx="430" cy="-10" rx="190" ry="120" fill="${S.rg("sonnenschein", [[0, "#fff6dc", 0.75], [0.5, "#fff6dc", 0.18], [1, "#fff6dc", 0]])}"/>`);
/* fernste Kämme (Cordillera Vilcabamba / Urubamba), sehr dunstig */
const KAMM_A = [[-2, 76], [18, 70], [38, 64], [55, 69], [72, 66], [96, 78], [118, 74], [140, 86], [170, 96], [200, 100], [236, 96], [262, 88], [284, 82], [306, 78], [330, 84], [352, 80], [376, 72], [402, 78]];
S.hinten(`<path d="${P([...KAMM_A, [402, 140], [-2, 140]])}" fill="${S.lg("kammA", [[0, "#9db3c9"], [1, "#c2d3df"]])}"/>`);

/* =====================================================================
   1 — DIE WOLKE (Haufenwolken am Morgenhimmel, hinter den Bergen)
   ===================================================================== */
/* Haufenwolke: viele Kreise verschiedener Größe (in der Mitte hoch, zu den Rändern flach), unten flach abgeschnitten.
   Schattierung: senkrechter Verlauf (oben warmweiß, unten blaugrau), darüber die Lichtform nach rechts oben versetzt */
const wolke = (name, cx, by, W, H, seed) => {
  const z = zufall(seed), kr = [];
  const n = Math.round(W / (H * 0.42));
  for (let i = 0; i <= n; i++) {
    const t = i / n, x = cx - W / 2 + W * t, prof = Math.max(0.18, 1 - Math.pow(2 * t - 1, 2) * 0.82);
    const rr = H * (0.2 + 0.26 * prof) * (0.75 + z() * 0.5);
    kr.push([x, by - rr * 0.6 - H * 0.3 * prof * z(), rr]);
  }
  for (let i = 0; i < 3; i++) { const t = 0.3 + z() * 0.4; kr.push([cx - W / 2 + W * t, by - H * (0.55 + z() * 0.25), H * (0.32 + z() * 0.14)]); }
  const top = Math.min(...kr.map(([, y, rr]) => y - rr));
  S.def(`<clipPath id="${S.id(name)}"><rect x="${r(cx - W)}" y="${r(top - 5)}" width="${r(2 * W)}" height="${r(by - top + 5)}"/></clipPath>`);
  const g = S.lg(name + "g", [[0, "#f6f8fb"], [0.5, "#dfe6ee"], [1, "#a9b9cc"]], 0, r(top), 0, r(by), ' gradientUnits="userSpaceOnUse"');
  const c = (dx, dy, f) => kr.map(([x, y, rr]) => `<circle cx="${r(x + dx)}" cy="${r(y + dy)}" r="${r(rr * f)}"/>`).join("");
  return `<g clip-path="url(#${S.id(name)})"><g fill="${g}">${c(0, 0, 1)}</g><g fill="#fffaf0" opacity=".7">${c(H * 0.09, -H * 0.1, 0.78)}</g><g fill="#ffffff" opacity=".9">${c(H * 0.15, -H * 0.17, 0.48)}</g></g>`;
};
{
  let k = wolke("w1", 58, 38, 54, 21, 3);
  k += wolke("w2", 316, 28, 44, 17, 5);
  k += wolke("w3", 140, 60, 22, 9, 9);
  k += wolke("w4", 268, 47, 18, 7, 13);
  S.teil({ id: "wolke", de: "die Wolke", syl: "WOL-ke", it: "la nuvola", itSyl: "NU-vo-la", en: "cloud", x: 56, y: 30, kunst: um(56, 30, k) });
}

/* Fels: Felsband entlang des Hangs — unregelmäßiger Umriss, Verlauf von der Schatten- zur Lichtseite,
   schräge Klüfte, Bewuchs wächst über die Ränder (so klebt der Fels nicht auf, sondern liegt im Hang) */
let FELS_N = 0;
const fels = (x, y, w, h, seed, hell = "#b3b2a4", dunkel = "#6f7671", gruen = "#4f7d48") => {
  const z = zufall(seed), pts = [], n = 14;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2, rx = w / 2 * (0.75 + z() * 0.35), ry = h / 2 * (0.8 + z() * 0.3);
    pts.push([x + w / 2 + Math.cos(a) * rx + (Math.sin(a) > 0 ? -w * 0.08 : w * 0.08), y + h / 2 + Math.sin(a) * ry]);
  }
  const g = S.lg("fels" + (FELS_N++), [[0, dunkel], [0.55, dunkel], [0.62, hell], [1, hell]], 0, 0, 1, 0.25);
  let o = `<path d="${glatt(pts, true, 0.7)}" fill="${g}"/>`;
  for (let i = 0; i < 3; i++) { const cx = x + w * (0.2 + 0.3 * i + z() * 0.1), cy = y + h * (0.15 + z() * 0.2); o += `<path d="M${r(cx)} ${r(cy)} l${r(w * 0.06)} ${r(h * 0.3)} l${r(-w * 0.04)} ${r(h * 0.3)}" stroke="#2f3532" stroke-width=".3" fill="none" opacity=".5"/>`; }
  o += `<path d="M${r(x + w * 0.1)} ${r(y + h * 0.5)} q${r(w * 0.35)} ${r(-h * 0.08)} ${r(w * 0.75)} ${r(h * 0.06)}" stroke="#3a403c" stroke-width=".25" fill="none" opacity=".4"/>`;
  for (let i = 0; i < 4; i++) { const t = z(); const px = x + w * (0.1 + t * 0.8), py = y + (i < 2 ? h * 0.05 : h * (0.85 + z() * 0.1)); o += `<ellipse cx="${r(px)}" cy="${r(py)}" rx="${r(w * (0.12 + z() * 0.08))}" ry="${r(h * 0.08 + 0.4)}" fill="${gruen}"/>`; }
  return o;
};

/* =====================================================================
   2 — DER BERG: links die Bergkette jenseits der Schlucht (Westen),
       rechts der Putucusi im Gegenlicht und der nahe Osthang
   ===================================================================== */
const KAMM_B = [[-2, 44], [14, 41], [30, 44], [46, 50], [62, 52], [80, 60], [98, 66], [114, 74], [128, 84], [140, 96], [150, 108], [158, 120], [164, 134], [168, 150]];
const PUTU = [[278, 150], [290, 126], [300, 110], [312, 98], [326, 88], [342, 82], [356, 80], [368, 82], [382, 88], [394, 92], [402, 94]];
{
  let k = "";
  /* Westkette: der Hang zu uns liegt halb im Licht, die Grate werfen Schatten nach links */
  const westD = P([...KAMM_B, [170, 210], [110, 262], [-2, 262]]);
  k += `<path d="${westD}" fill="${S.lg("westkette", [[0, "#4f7564"], [0.5, "#456b56"], [1, "#6d8f84"]])}"/>`;
  k += `<path d="${westD}" fill="${WALD}"/>`;
  /* Relief: Seitenrücken laufen schräg vom Kamm nach links unten; jeder Rücken hat eine Lichtseite (rechts) und
     daneben eine dunkle Rinne. Weich gezeichnet, schmal am Kamm, breit unten. */
  let rel = "";
  for (const [x0, l, sd] of [[40, 80, 1], [76, 80, 2], [110, 74, 3], [140, 60, 4]]) {
    const z = zufall(sd), y0 = profilY(KAMM_B, x0) + 1.5, pts = [[x0, y0]];
    for (let i = 1; i <= 5; i++) pts.push([x0 - i * (9 + z() * 3), y0 + l * i / 5 * 0.8]);
    const br = (i) => 0.6 + i * 1.5;
    rel += `<path d="${glatt([...pts.map(([a, b], i) => [a, b]), ...pts.map(([a, b], i) => [a + br(i) * 1.2, b + br(i) * 1.6]).reverse()], true, 0.8)}" fill="#b6d3a6" opacity=".22"/>`;
    rel += `<path d="${glatt([...pts.map(([a, b], i) => [a - br(i) * 0.6, b - br(i) * 1.4]), ...pts.map(([a, b]) => [a - 0.4, b - 0.3]).reverse()], true, 0.8)}" fill="#1c362c" opacity=".28"/>`;
  }
  k += `<g filter="url(#${S.id("weich")})">${rel}</g>`;
  for (const [x, w, h, sd] of [[20, 10, 5, 21], [56, 8, 4, 22], [84, 9, 4.5, 23], [112, 7, 3.6, 24], [34, 7, 3.6, 25]]) k += `<g opacity=".7">${fels(x, profilY(KAMM_B, x) + 8 + sd % 3 * 9, w, h, sd, "#a9b0a5", "#6d7a72", "#4f7560")}</g>`;
  /* Dunst am Fuß der Kette (Tiefe der Schlucht) */
  k += `<path d="${westD}" fill="${S.lg("westdunst", [[0, "#dfe9ef", 0.0], [0.35, "#dfe9ef", 0.12], [0.6, "#e6eef1", 0.75], [1, "#eef3f4", 0.95]])}"/>`;
  k += `<path d="M${KAMM_B.slice(0, 9).map(([x, y]) => r(x) + " " + r(y + 0.4)).join(" L")}" stroke="#cfe0d4" stroke-width=".8" fill="none" opacity=".6"/>`;

  /* Putucusi: Gegenlicht — dunkel, oben eine helle Kante, Felswände mit senkrechten Rissen */
  const putD = glatt([...PUTU, [402, 205], [300, 205], [284, 180]], true, 0.9);
  k += `<path d="${putD}" fill="${S.lg("putucusi", [[0, "#3c5e4f"], [0.6, "#355647"], [1, "#5c7d71"]])}"/>`;
  k += `<path d="${putD}" fill="${WALD}"/>`;
  for (const [x, y, w, h, sd] of [[322, 98, 22, 34, 31], [352, 88, 18, 26, 32], [374, 104, 14, 22, 35]]) k += `<g opacity=".85">${fels(x, y, w, h, sd, "#7f8a84", "#56625c", "#3d5e4f")}</g>`;
  k += `<path d="${glatt(PUTU.slice(1), false)}" stroke="#f3e2b4" stroke-width=".9" fill="none" opacity=".75"/>`;
  k += `<path d="${putD}" fill="${S.lg("putudunst", [[0, "#dfe9ef", 0], [0.55, "#dfe9ef", 0.1], [1, "#dfe9ef", 0.6]])}"/>`;
  /* naher Osthang auf unserer Seite (rechts unten): bewaldet, im Morgenlicht */
  const OST = [[314, 262], [318, 214], [326, 194], [342, 184], [362, 178], [384, 174], [402, 172], [402, 262]];
  k += `<path d="${glatt(OST, true, 0.7)}" fill="${S.lg("osthang", [[0, "#5f8c45"], [1, "#3d6a36"]])}"/>`;
  k += `<path d="${glatt(OST, true, 0.7)}" fill="${WALD}"/>`;
  k += `<path d="${glatt(OST.slice(1, 7), false)}" stroke="#bcd88a" stroke-width=".8" fill="none" opacity=".7"/>`;
  S.teil({ id: "berg", de: "der Berg", syl: "BERG", it: "la montagna", itSyl: "mon-TA-gna", en: "mountain", x: 352, y: 80, kunst: um(352, 80, k),
    tipp: "Rechts gegenüber liegt der Berg Putucusi. Zwischen den Bergen fließt tief unten der Fluss Urubamba." });
}

/* =====================================================================
   3 — DIE SCHLUCHT (links: das tiefe Tal des Urubamba im Morgendunst)
   ===================================================================== */
{
  /* der tiefe Einschnitt: kühler, dunkler Grund, darin waagrechte Dunstbänder */
  let k = `<path d="M0 150 Q40 150 70 160 Q96 172 108 196 L112 226 L0 226 Z" fill="${S.lg("schlucht", [[0, "#2e4c42", 0.0], [0.35, "#2b473d", 0.5], [1, "#2a463c", 0.7]])}"/>`;
  k += `<g filter="url(#${S.id("dunst")})">`;
  for (const [x, y, w, a] of [[4, 158, 60, 0.75], [30, 172, 70, 0.85], [8, 188, 90, 0.9], [40, 204, 70, 0.95]]) k += `<path d="M${x} ${y} q${r(w * 0.25)} -3 ${r(w * 0.5)} -1.6 q${r(w * 0.3)} -2.4 ${r(w * 0.5)} 1.2 q${r(-w * 0.5)} 4 ${r(-w)} .4 Z" fill="#eef3f4" opacity="${a}"/>`;
  k += `</g>`;
  S.teil({ id: "schlucht", de: "die Schlucht", syl: "SCHLUCHT", it: "la gola", itSyl: "GO-la", en: "gorge", x: 50, y: 180, kunst: um(50, 180, k),
    tipp: "Tief unten in der Schlucht fließt der Urubamba, rund 450 Meter unter der Stadt. Die Inka nannten ihn den heiligen Fluss." });
}

/* =====================================================================
   4 — DER HUAYNA PICCHU (mit dem kleinen Huchuy Picchu davor)
   ===================================================================== */
const HUAYNA = [[150, 138], [156, 128], [163, 117], [170, 105], [176, 93], [181, 84], [185, 78], [189, 70], [194, 58], [199, 47], [204, 39], [208, 34], [212, 31], [216, 30.5], [219, 32], [221, 36], [223, 44], [225, 53], [228, 61], [233, 67], [241, 72], [251, 78], [262, 86], [273, 96], [284, 108], [294, 121], [301, 134], [305, 148]];
{
  const d = glatt([...HUAYNA, [310, 160], [150, 160]], true, 0.85);
  let k = `<path d="${d}" fill="${S.lg("huayna", [[0, "#24433a"], [0.42, "#355c44"], [0.6, "#4f7d48"], [1, "#6a9450"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="${d}" fill="${WALDF}"/>`;
  /* Granitwände: links (Westen) im Schatten, rechts (Osten) im Morgenlicht */
  for (const [x, y, w, h, sd, hell] of [[194, 46, 15, 30, 41, 0], [210, 34, 12, 22, 43, 1], [180, 82, 12, 20, 44, 0], [222, 52, 11, 18, 45, 1]])
    k += hell ? fels(x, y, w, h, sd, "#b9b8a6", "#7f8780", "#5f8a4a") : fels(x, y, w, h, sd, "#8a918a", "#59615d", "#36583f");
  /* Bewuchs-Inseln auf den Platten */
  for (let i = 0; i < 26; i++) { const x = 172 + rnd() * 90, y = 40 + rnd() * 70; if (y < profilY(HUAYNA, x) + 3) continue; k += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(1 + rnd() * 1.6)}" ry="${r(0.7 + rnd())}" fill="${x > 214 ? "#6f9a4e" : "#2f5238"}" opacity=".9"/>`; }
  /* Inka-Terrassen am Gipfel (feine Stützmauern) und die kleinen Bauten oben */
  for (let i = 0; i < 6; i++) { const y = 34 + i * 2.4, x0 = 208 - i * 1.4, x1 = 222 + i * 1.3; k += `<path d="M${r(x0)} ${r(y)} Q${r((x0 + x1) / 2)} ${r(y + 0.9)} ${r(x1)} ${r(y - 0.2)}" stroke="#b9b2a0" stroke-width=".5" fill="none" opacity=".85"/>`; }
  k += `<path d="M210.4 31.2 l2 -1.2 l1.6 .9 v1.4 h-3.6 Z M216.2 31.6 l1.4 -.9 l1.3 .7 v1.1 h-2.7 Z" fill="#a39a88"/>`;
  /* Rinnen in der Westflanke, Lichtkante an der Ostflanke */
  for (const [x0, y0, x1, y1] of [[196, 52, 176, 112], [205, 42, 190, 116], [186, 70, 166, 116]]) k += `<path d="M${x0} ${y0} Q${r((x0 + x1) / 2 + 2)} ${r((y0 + y1) / 2)} ${x1} ${y1}" stroke="#1c342c" stroke-width=".9" fill="none" opacity=".5"/>`;
  k += `<path d="${glatt(HUAYNA.slice(12, 24), false)}" stroke="#f7e6b2" stroke-width="1" fill="none" opacity=".75" transform="translate(-.4 .6)"/>`;
  /* Huchuy Picchu: kleiner runder Hügel vor dem linken Fuß */
  const hu = glatt([[156, 160], [160, 146], [168, 137], [178, 132], [188, 133], [196, 138], [202, 147], [205, 160]], true, 0.9);
  k += `<path d="${hu}" fill="${S.lg("huchuy", [[0, "#3e6a40"], [1, "#6d9a4c"]], 0, 0, 1, 0)}"/><path d="${hu}" fill="${WALDF}"/>`;
  k += `<path d="M168 137.5 Q178 131.6 188 133.4 Q196 137 201 145" stroke="#e8e3a8" stroke-width=".7" fill="none" opacity=".6"/>`;
  /* Morgendunst über dem Fuß */
  k += `<path d="${d}" fill="${S.lg("huaynadunst", [[0, "#e3ecf0", 0], [0.6, "#e3ecf0", 0.05], [1, "#e3ecf0", 0.55]])}"/>`;
  S.teil({ id: "huayna_picchu", de: "der Huayna Picchu", syl: "HUAY-na PIC-chu", it: "lo Huayna Picchu", itSyl: "HUAY-na PIC-chu", en: "Huayna Picchu", x: 214, y: 60, kunst: um(214, 60, k),
    tipp: "Huayna Picchu heißt „junger Berg“. Ganz oben bauten die Inka Terrassen und kleine Tempel – der Weg hinauf ist sehr steil." });
}

/* =====================================================================
   5 — DER NEBEL (Wolkenfetzen in der Schlucht)
   ===================================================================== */
{
  let k = "";
  const fetzen = (x, y, w, h, a) => `<path d="M${x} ${y} q${r(w * 0.15)} ${r(-h * 0.9)} ${r(w * 0.35)} ${r(-h * 0.5)} q${r(w * 0.12)} ${r(-h * 0.8)} ${r(w * 0.3)} ${r(-h * 0.25)} q${r(w * 0.2)} ${r(-h * 0.2)} ${r(w * 0.35)} ${r(h * 0.75)} q${r(-w * 0.5)} ${r(h * 0.35)} ${r(-w)} 0 Z" fill="#f4f7f8" opacity="${a}"/>`;
  k += `<g filter="url(#${S.id("weich")})">`;
  k += fetzen(10, 122, 46, 9, 0.85) + fetzen(44, 132, 58, 10, 0.9) + fetzen(96, 128, 46, 8, 0.85) + fetzen(122, 140, 30, 7, 0.75);
  k += fetzen(270, 146, 34, 7, 0.8) + fetzen(296, 156, 54, 9, 0.9) + fetzen(340, 162, 62, 8, 0.85);
  k += `</g>`;
  /* helle Oberkanten (Sonne von rechts oben) */
  k += `<path d="M54 125.5 q8 -4 16 -2.4 M108 121.6 q7 -3 13 -1 M310 149 q9 -3.5 18 -1.6 M356 156 q10 -3 20 -1" stroke="#fff" stroke-width=".9" fill="none" opacity=".75" stroke-linecap="round"/>`;
  S.teil({ id: "nebel", de: "der Nebel", syl: "NE-bel", it: "la nebbia", itSyl: "NEB-bia", en: "mist", x: 80, y: 128, kunst: um(80, 128, k),
    tipp: "Morgens steigt der Nebel aus der feuchten Schlucht. Gegen Mittag ist er meist verschwunden." });
}

/* =====================================================================
   6 — DIE SERPENTINE (Straße Hiram Bingham) mit dem Bus
   ===================================================================== */
const SERP = [[402, 182], [356, 186], [384, 194], [338, 198], [372, 207], [328, 212], [360, 222], [320, 228]];
{
  let pfad = `M${SERP[0][0]} ${SERP[0][1]}`;
  for (let i = 1; i < SERP.length; i++) {
    const [x0, y0] = SERP[i - 1], [x1, y1] = SERP[i], dir = x1 < x0 ? -1 : 1;
    pfad += ` L${r(x1 - dir * 3)} ${r(y1 - 0.4)} Q${r(x1 - dir * 0.2)} ${r(y1)} ${r(x1 + dir * 0.4)} ${r(y1 + 2.2)}`;
  }
  let k = `<path d="${pfad}" stroke="#6b5a3e" stroke-width="2.6" fill="none" stroke-linejoin="round" opacity=".55" transform="translate(-.5 .7)"/>`;
  k += `<path d="${pfad}" stroke="${S.lg("strasse", [[0, "#e4d6b4"], [1, "#c9b78e"]])}" stroke-width="2" fill="none" stroke-linejoin="round"/>`;
  k += `<path d="${pfad}" stroke="#fffaf0" stroke-width=".45" fill="none" opacity=".6" transform="translate(.1 -.5)"/>`;
  S.teil({ id: "serpentine", de: "die Serpentine", syl: "ser-pen-TI-ne", it: "il tornante", itSyl: "tor-NAN-te", en: "hairpin bend", x: 360, y: 205, kunst: um(360, 205, k),
    tipp: "Die Straße Hiram Bingham windet sich in vielen Kurven vom Fluss hinauf. Busse bringen die Besucher nach oben." });
}

/* =====================================================================
   7 — DIE RUINENSTADT (mit Lupe: Sonnentempel, Hauptplatz, Haus, Tür)
   ---------------------------------------------------------------------
   Stadtboden ≈ 70 m unter uns: d(y) = 330·70 / (y − 105). Ein Haus wird
   als Kasten mit Giebeln gezeichnet; die Tiefe zeigt zum Fluchtpunkt.
   ===================================================================== */
const VP = [CX, HOR];
const dAusY = (y, tief = 70) => 330 * tief / Math.max(4, y - HOR);
const hinterPunkt = ([x, y], t, d) => { const f = d / (d + t); return [VP[0] + (x - VP[0]) * f, VP[1] + (y - VP[1]) * f]; };
/* ein Haus: (x, y) = vorne links unten, b = Breite der Front, h = Wandhöhe (Einheiten), t = Tiefe (m), g = Giebelhöhe,
   giebel: "front" (Giebel vorn und hinten) oder "seite" (Giebel an den Seiten), dach: rekonstruiertes Strohdach */
const haus = (x, y, b, h, t, g, giebel = "front", dach = false, tueren = 1, schattenAn = true) => {
  const d = dAusY(y), m = 330 / d;
  const A = [x, y], Bp = [x + b, y], A2 = hinterPunkt(A, t, d), B2 = hinterPunkt(Bp, t, d);
  const up = (p, v) => [p[0], p[1] - v];
  const rechtsSicht = x + b / 2 < VP[0];
  let o = "";
  /* Schlagschatten nach links auf den Boden (Sonne rechts, etwa 45° hoch) */
  if (schattenAn) o += `<path d="${P([A, [A[0] - h * 0.9, A[1] - h * 0.12], [A2[0] - h * 0.9, A2[1] - h * 0.12], A2])}" fill="#2a3320" opacity=".28"/>`;
  if (giebel === "front") o += `<path d="${P([up(A2, h), [(A2[0] + B2[0]) / 2, A2[1] - h - g * 0.92], up(B2, h)])}" fill="#d9cfbc"/>`;
  o += `<path d="${P([up(A, h), up(Bp, h), up(B2, h), up(A2, h)])}" fill="${INNEN}"/>`;
  /* Innenwand hinten im Licht (sichtbar über die Front hinweg) */
  o += `<path d="${P([up(A2, h), up(B2, h), up(B2, h * 0.35), up(A2, h * 0.35)])}" fill="#b9ae99" opacity=".75"/>`;
  if (rechtsSicht) o += `<path d="${P([Bp, B2, up(B2, h), up(Bp, h)])}" fill="${GRANIT_L}"/>`;
  else o += `<path d="${P([A, A2, up(A2, h), up(A, h)])}" fill="${GRANIT_S}"/>`;
  o += `<path d="${P([A, Bp, up(Bp, h), up(A, h)])}" fill="${GRANIT_F}"/>`;
  if (giebel === "front") o += `<path d="${P([up(A, h - 0.05), [x + b / 2, y - h - g], up(Bp, h - 0.05)])}" fill="${GRANIT_F}"/>`;
  else {
    const S1 = rechtsSicht ? Bp : A, S2 = rechtsSicht ? B2 : A2;
    o += `<path d="${P([up(S1, h - 0.05), [(S1[0] + S2[0]) / 2, (S1[1] + S2[1]) / 2 - h - g], up(S2, h - 0.05)])}" fill="${rechtsSicht ? GRANIT_L : GRANIT_S}"/>`;
    const S3 = rechtsSicht ? A : Bp, S4 = rechtsSicht ? A2 : B2;   /* Giebel der Gegenseite, nur die Spitze ragt über den Innenraum */
    o += `<path d="${P([up(S3, h), [(S3[0] + S4[0]) / 2, (S3[1] + S4[1]) / 2 - h - g], up(S4, h)])}" fill="#d3c8b3"/>`;
  }
  o += `<path d="M${r(x)} ${r(y - h)} H${r(x + b)}" stroke="#fbf4e4" stroke-width="${r(Math.max(0.2, 0.14 * m))}" opacity=".85"/>`;
  if (b > 3) for (let i = 1; i < 3; i++) o += `<path d="M${r(x + 0.2)} ${r(y - h * i / 3)} H${r(x + b - 0.2)}" stroke="#9a907f" stroke-width=".12" opacity=".55"/>`;
  for (let i = 0; i < tueren; i++) {
    const cx = x + b * (i + 0.5) / tueren, tb = Math.min(b / tueren * 0.42, 0.95 * m), th = Math.min(h * 0.72, 1.9 * m);
    o += `<path d="M${r(cx - tb / 2)} ${r(y)} L${r(cx - tb * 0.34)} ${r(y - th)} L${r(cx + tb * 0.34)} ${r(y - th)} L${r(cx + tb / 2)} ${r(y)} Z" fill="#3a332b"/>`;
  }
  if (dach && giebel === "front") {
    const gF = [x + b / 2, y - h - g], gH = [(A2[0] + B2[0]) / 2, A2[1] - h - g * 0.92], ue = 0.35 * m;
    o += `<path d="${P([[x - ue, y - h + ue * 0.6], gF, gH, [A2[0] - ue, A2[1] - h + ue * 0.6]])}" fill="${S.lg("strohs", [[0, "#8a6a36"], [1, "#6f5228"]])}"/>`;
    o += `<path d="${P([[x + b + ue, y - h + ue * 0.6], gF, gH, [B2[0] + ue, B2[1] - h + ue * 0.6]])}" fill="${S.lg("strohl", [[0, "#dcb66c"], [1, "#b48e4e"]])}"/>`;
    o += `<path d="M${r(x - ue)} ${r(y - h + ue * 0.6)} L${r(gF[0])} ${r(gF[1])} L${r(x + b + ue)} ${r(y - h + ue * 0.6)}" stroke="#5e4520" stroke-width=".25" fill="none"/>`;
  }
  return o;
};
/* Terrassenhang: Bögen (je eine Punktliste, oben/hinten → unten/vorn). Zwischen zwei Bögen liegt eine Stufe.
   seite = -1: Hang fällt nach links (Mauern zeigen weg, ihr Schatten liegt als Streifen auf der unteren Stufe),
   seite = +1: Hang fällt nach rechts (die Mauern stehen im Morgenlicht und sind zu sehen) */
const hang = (boegen, seite, breite = 1.2) => {
  let o = "";
  for (let i = 0; i < boegen.length - 1; i++) {
    const a = boegen[i], bb = boegen[i + 1];
    o += `<path d="${glatt([...a, ...bb.slice().reverse()], true, 0.5)}" fill="${i % 2 ? "#86ad50" : "#91b958"}"/>`;
    if (seite < 0) {
      const sch = a.map(([x, y]) => [x - breite, y]);
      o += `<path d="${glatt([...a, ...sch.slice().reverse()], true, 0.5)}" fill="#3f5a2c" opacity=".55"/>`;
      o += `<path d="${glatt(a, false)}" stroke="#e8e0c8" stroke-width=".45" fill="none"/>`;
    } else {
      const w = a.map(([x, y]) => [x + breite * 0.9, y + breite * 0.5]);
      o += `<path d="${glatt([...a, ...w.slice().reverse()], true, 0.5)}" fill="${S.lg("mauerlicht", [[0, "#efe7d4"], [1, "#cdc4ae"]], 0, 0, 1, 0)}"/>`;
      o += `<path d="${glatt(w, false)}" stroke="#55603a" stroke-width=".4" fill="none" opacity=".6"/>`;
    }
  }
  return o;
};
/* Häuserzeile: aneinander gebaute Häuser (gemeinsame Wände), Giebel meist an den Seiten — das typische Zackenbild */
const zeile = (x0, x1, y, hm, seed, dachAnteil = 0.06) => {
  const z = zufall(seed), m = 330 / dAusY(y); let o = "", x = x0;
  const teile = [];
  while (x < x1 - 2) {
    if (z() < 0.12) { x += (2 + z() * 3) * m; continue; }          /* Durchgang / Hof */
    const lang = z() < 0.7, b = Math.min(x1 - x, (lang ? 9 + z() * 5 : 5 + z() * 1.5) * m);
    if (b < 2.5 * m) break;
    teile.push([x, b, lang]);
    x += b + (z() < 0.4 ? 0.3 * m : 0);
  }
  /* Stützmauer der Terrasse, auf der die Zeile steht (helle Krone, Schatten darunter) */
  o += `<path d="M${r(x0 - 1.5)} ${r(y + 0.5)} L${r(x1 + 1.5)} ${r(y + 0.5)} L${r(x1 + 1.5)} ${r(y + 0.5 + 1.3 * m)} L${r(x0 - 1.5)} ${r(y + 0.5 + 1.3 * m)} Z" fill="${S.lg("zeilmauer", [[0, "#ddd5c4"], [1, "#a9a090"]])}"/><path d="M${r(x0 - 1.5)} ${r(y + 0.5 + 1.3 * m)} L${r(x1 + 1.5)} ${r(y + 0.5 + 1.3 * m)}" stroke="#3d4a2c" stroke-width="${r(0.5 * m)}" opacity=".35"/>`;
  /* von der Mitte nach außen zeichnen: die äußeren verdecken die inneren richtig (Fluchtpunkt in der Mitte) */
  teile.sort((p, q) => Math.abs(q[0] + q[1] / 2 - VP[0]) - Math.abs(p[0] + p[1] / 2 - VP[0]));
  teile.reverse();
  for (const [xx, b, lang] of teile.reverse()) o += haus(xx, y + (z() - 0.5) * 0.4, b, (3.3 + z() * 0.9) * m * hm, lang ? 5 + z() : 9 + z() * 3, (2.6 + z() * 0.8) * m, lang ? "seite" : "front", z() < dachAnteil, lang ? (z() < 0.5 ? 2 : 0) : 1);
  return o;
};
const STADT = {};
{
  let k = "";
  const zl = zufall(77);
  /* --- Bergrücken unter der Stadt: links und rechts fällt er steil in die Schlucht --- */
  const ruecken = [[84, 262], [88, 214], [94, 186], [106, 162], [126, 146], [160, 141], [196, 143], [236, 141], [268, 142], [294, 149], [316, 160], [332, 178], [342, 205], [348, 262]];
  k += `<path d="${glatt(ruecken, true, 0.6)}" fill="${S.lg("ruecken", [[0, "#3f6236"], [0.18, "#5f8645"], [0.5, "#7ea052"], [0.85, "#6d9a48"], [1, "#55813e"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="${glatt(ruecken, true, 0.6)}" fill="${WALDF}" opacity=".8"/>`;
  /* Sektorflächen: Gras zwischen den Ruinen, etwas trockener als der Platz */
  k += `<path d="${glatt([[108, 168], [120, 152], [150, 147], [180, 150], [194, 160], [196, 200], [150, 206], [108, 204], [102, 186]], true, 0.6)}" fill="${S.lg("westflaeche", [[0, "#97a868"], [1, "#86a05c"]])}"/>`;
  k += `<path d="${glatt([[236, 150], [262, 146], [288, 150], [300, 162], [306, 190], [300, 206], [246, 204], [240, 176]], true, 0.6)}" fill="${S.lg("ostflaeche", [[0, "#93a766"], [1, "#82a05a"]])}"/>`;
  /* Westhang: Terrassenbögen wandern nach links unten in die Schlucht */
  const westB = [];
  for (let i = 0; i < 11; i++) westB.push([[132 - i * 3.3, 146 + i * 1.3], [118 - i * 3.6, 165 + i * 2.3], [110 - i * 3.2, 189 + i * 2.6], [106 - i * 2.4, 214 + i * 1.5]]);
  k += hang(westB, -1, 1.3);
  /* Osthang: Mauern im Morgenlicht */
  const ostB = [];
  for (let i = 0; i < 9; i++) ostB.push([[280 + i * 4.2, 148 + i * 2], [298 + i * 3.6, 164 + i * 2.7], [312 + i * 2.8, 188 + i * 2.3], [318 + i * 2.2, 212 + i * 1.3]]);
  k += hang(ostB, 1, 1.5);
  /* --- Heiliger Felsen ganz hinten mit zwei Strohdachhäusern (Wayranas) --- */
  k += `<path d="M199 146 Q202 140.6 209 141 Q214 141.6 215.6 146 Z" fill="${S.lg("hfels", [[0, "#8d8577"], [1, "#d6ccb8"]], 0, 0, 1, 0)}"/>`;
  k += haus(190, 147, 5, 1.9, 6, 1.6, "front", true, 1) + haus(219, 147, 5, 1.9, 6, 1.6, "front", true, 1);
  /* --- der HAUPTPLATZ: lange Wiese in drei Stufen --- */
  const platz = [[190, 195], [244, 197], [229, 151], [206, 151]];
  k += `<path d="${P(platz)}" fill="${S.lg("platz", [[0, "#94b956"], [1, "#7fa94a"]])}"/>`;
  for (const [ya, yb, xa, xb] of [[180, 181.4, 192.6, 238.6], [166, 167, 197, 234], [157.4, 158, 201, 231.6]]) k += `<path d="M${xa} ${ya} L${xb} ${yb} L${xb} ${yb + 1} L${xa} ${ya + 1} Z" fill="#9b917f"/><path d="M${xa} ${ya} L${xb} ${yb}" stroke="#f1e8d4" stroke-width=".35"/>`;
  k += `<path d="${P(platz)}" fill="${GRAS}"/>`;
  /* --- OSTSEKTOR: Zeilen aneinander gebauter Wohnhäuser, dazwischen schmale Gassen und Höfe --- */
  let ost = "";
  for (let row = 0; row < 9; row++) {
    const y = 155 + row * 5.2;
    ost += zeile(239 + (y - 150) * 0.33, 282 + (y - 150) * 0.66, y, 1, 100 + row);
  }
  /* Gruppe der drei Tore (hinten rechts, mit Strohdächern) */
  ost = haus(247, 150, 4.6, 2.2, 6, 1.8, "front", true, 1) + haus(256, 150.6, 4.6, 2.2, 6, 1.8, "front", true, 1) + haus(265, 151.2, 4.6, 2.2, 6, 1.8, "front", true, 1) + ost;
  /* --- WESTSEKTOR --- */
  let west = "";
  /* Intihuatana: Stufenhügel (hinten links) mit dem Sonnenstein oben */
  for (let i = 0; i < 5; i++) {
    const w = 22 - i * 4.4, y = 158 - i * 3.8, cx = 158 + i * 0.6;
    west += `<path d="M${r(cx - w)} ${r(y)} Q${r(cx)} ${r(y + 1.8)} ${r(cx + w)} ${r(y)} L${r(cx + w * 0.84)} ${r(y - 3.8)} Q${r(cx)} ${r(y - 2.2)} ${r(cx - w * 0.84)} ${r(y - 3.8)} Z" fill="${i % 2 ? "#92b759" : "#86ac51"}"/>`;
    west += `<path d="M${r(cx - w)} ${r(y)} Q${r(cx)} ${r(y + 1.8)} ${r(cx + w)} ${r(y)} L${r(cx + w)} ${r(y + 1.3)} Q${r(cx)} ${r(y + 3.1)} ${r(cx - w)} ${r(y + 1.3)} Z" fill="${S.lg("intimauer", [[0, "#8f8677"], [0.55, "#cfc5b1"], [1, "#efe5d0"]], 0, 0, 1, 0)}"/>`;
  }
  west += `<path d="M158.8 140.2 l1.2 -2.2 h1.6 l.8 1.2 l.5 1 Z" fill="#e1d8c5"/><path d="M160.4 138 l.5 -1.8 h.7 l.3 1.8 Z" fill="#b8ae9b"/>`;
  /* Steinbruch: Feld aus hellen, rohen Granitblöcken zwischen Westsektor und Platz */
  for (let i = 0; i < 26; i++) { const x = 182 + zl() * 12, y = 158 + zl() * 14, w = 0.8 + zl() * 1.4; west += `<path d="M${r(x)} ${r(y)} l${r(w * 0.3)} ${r(-w * 0.6)} l${r(w * 0.8)} ${r(-w * 0.1)} l${r(w * 0.4)} ${r(w * 0.6)} Z" fill="${zl() < 0.5 ? "#e8dfcc" : "#b9af9c"}"/>`; }
  /* Heiliger Platz: Haupttempel und Tempel der drei Fenster */
  west += haus(166, 170, 9, 3.4, 8, 0, "seite", false, 0) + haus(176.5, 168.4, 6.6, 3.2, 6, 0, "seite", false, 3);
  /* Wohnhäuser im Westsektor (Zeilen von hinten nach vorn) */
  for (const [x0, x1, y, sd] of [[118, 150, 162, 201], [114, 162, 173, 202], [110, 150, 184, 203], [168, 188, 184, 204], [104, 140, 196, 205], [168, 184, 198, 206]]) west += zeile(x0, x1, y, 1, sd);
  /* der SONNENTEMPEL (Torreón): halbrunder Turm auf dem Felsen, zwei trapezförmige Fenster, fugenlose Blöcke */
  const T = { x: 154, y: 199 };
  let st = `<path d="M${T.x - 8} ${T.y} Q${T.x - 8.4} ${T.y - 6} ${T.x - 2} ${T.y - 7.6} Q${T.x + 4} ${T.y - 8.2} ${T.x + 8} ${T.y - 5} L${T.x + 9} ${T.y} Z" fill="${S.lg("torreonfels", [[0, "#857d70"], [1, "#c4baa6"]], 0, 0, 1, 0)}"/>`;
  st += `<path d="M${T.x - 5.6} ${T.y - 6.4} L${T.x - 5.6} ${T.y - 12.4} Q${T.x + 0.4} ${T.y - 15} ${T.x + 6.4} ${T.y - 12.4} L${T.x + 6.4} ${T.y - 5.4} Q${T.x + 0.4} ${T.y - 8} ${T.x - 5.6} ${T.y - 6.4} Z" fill="${S.lg("torreon", [[0, "#9a9182"], [0.45, "#e2d8c4"], [0.8, "#f6eedb"], [1, "#ddd2bb"]], 0, 0, 1, 0)}"/>`;
  for (let i = 1; i < 6; i++) { const yy = T.y - 6.6 - i * 1.0; st += `<path d="M${T.x - 5.6} ${r(yy)} Q${T.x + 0.4} ${r(yy - 2.5)} ${T.x + 6.4} ${r(yy + 0.2)}" stroke="#a69c8a" stroke-width=".13" fill="none"/>`; }
  for (const [x0, x1] of [[-1.4, -0.3], [2.4, 3.4]]) st += `<path d="M${r(T.x + x0)} ${r(T.y - 9.4)} L${r(T.x + x0 + 0.16)} ${r(T.y - 11.3)} L${r(T.x + x1 - 0.16)} ${r(T.y - 11.4)} L${r(T.x + x1)} ${r(T.y - 9.5)} Z" fill="#40392f"/>`;
  st += `<path d="M${T.x - 5.6} ${T.y - 12.4} Q${T.x + 0.4} ${T.y - 15} ${T.x + 6.4} ${T.y - 12.4}" stroke="#fffaf0" stroke-width=".35" fill="none"/>`;
  st += haus(T.x + 9, T.y - 0.6, 7.4, 3.6, 6, 2.6, "front", false, 1) + haus(T.x - 16, T.y + 1.4, 7.4, 3.8, 6, 2.8, "seite", false, 1);
  STADT.sonne = { x: T.x + 0.4, y: T.y - 10 };
  /* Treppe zwischen Westsektor und Platz */
  west += `<path d="M186 199 L198 153 L200.4 153 L190 199 Z" fill="#d6ccb6"/>`;
  for (let i = 0; i < 18; i++) { const t = i / 18; west += `<path d="M${r(186 + 12 * t)} ${r(199 - 46 * t)} h${r(4 - 1.6 * t)}" stroke="#8f8576" stroke-width=".16"/>`; }
  /* Graben und Mauer vorn (trennt Stadt und Landwirtschaft) */
  const graben = `<path d="M100 214 Q150 206 200 206.6 Q260 207.4 330 214 L330 216.4 Q260 210 200 209.2 Q150 208.6 100 216.6 Z" fill="#3f4d30" opacity=".55"/>`;
  k += west + ost + st + graben;
  STADT.k = k;
}
/* Lupen-Teile der Stadt: Zeichnung malt die Stadt mit, hier nur Fangflächen */
{
  const zoom = { x: 112, y: 138, w: 120, h: 78 };
  const unter = [];
  unter.push({ id: "sonnentempel", de: "der Sonnentempel", syl: "SON-nen-tem-pel", it: "il Tempio del Sole", itSyl: "TEM-pio del SO-le", en: "Temple of the Sun",
    x: STADT.sonne.x, y: STADT.sonne.y, kunst: flaeche(-7, -5, 15, 15),
    tipp: "Der Sonnentempel ist halbrund. Seine Steine passen so genau, dass kein Messer dazwischenpasst – ganz ohne Mörtel." });
  unter.push({ id: "hauptplatz", de: "der Hauptplatz", syl: "HAUPT-platz", it: "la piazza principale", itSyl: "PIAZ-za prin-ci-PA-le", en: "main square",
    x: 214, y: 172, kunst: `<path d="M-25 20 L26 22 L14 -19 L-8 -19 Z" class="bw-flaeche" fill="rgba(255,255,255,0.001)"/>`,
    tipp: "Der große, grüne Platz teilt die Stadt in zwei Hälften: oben die Tempel, unten die Wohnhäuser." });
  unter.push({ id: "sonnenstein", de: "der Sonnenstein", syl: "SON-nen-stein", it: "l'Intihuatana", itSyl: "in-ti-hua-TA-na", en: "Intihuatana stone",
    x: 160, y: 140, kunst: flaeche(-4, -4, 8, 6),
    tipp: "Oben auf dem Hügel steht der Intihuatana, der „Ort, an dem die Sonne angebunden wird“." });
  unter.push({ id: "haus", de: "das Haus", syl: "HAUS", it: "la casa", itSyl: "CA-sa", en: "house",
    x: 125, y: 182, kunst: flaeche(-6, -7, 12, 10),
    tipp: "Die Dächer waren aus Stroh und sind verfallen. Die spitzen Giebel aus Stein stehen noch." });
  S.teil({ id: "ruinenstadt", de: "die Ruinenstadt", syl: "ru-I-nen-stadt", it: "la città in rovina", itSyl: "cit-TÀ in ro-VI-na", en: "ruined city", x: 214, y: 175,
    kunst: um(214, 175, STADT.k), zoom, unter,
    tipp: "Machu Picchu heißt „alter Berg“. Die Inka bauten die Stadt vor über 500 Jahren auf 2 430 Metern Höhe." });
}

/* =====================================================================
   8 — DIE TERRASSE (Landwirtschaftsbereich zwischen uns und der Stadt)
   ---------------------------------------------------------------------
   Wir schauen von oben auf die Stufen: die Stützmauern zeigen von uns weg
   (zur Stadt). Man sieht die Laufflächen, die helle Mauerkrone und dahinter
   den Schatten der Mauer auf der nächsttieferen Stufe. Je näher, desto
   größer: zwei große Stufen vorn (Besucher, Lamas), dann immer schmalere.
   ===================================================================== */
const TERR = [];
{
  let k = "";
  /* Kanten von hinten (bei der Stadt) nach vorn; jede Kante biegt sich links in die Schlucht hinab */
  const kanten = [209, 211.2, 213.6, 216.6, 220.6, 226, 236.6, 262];
  const kante = (y, i) => [[60 + i * 1.5, y + 9 + i * 1.2], [92, y + 2.4 + i * 0.3], [140, y + 0.3], [200, y - 0.6], [262, y], [310, y + 1.8 + i * 0.3], [340 - i * 0.6, y + 6 + i * 0.6]];
  for (let i = 0; i < kanten.length - 1; i++) {
    const hinten = kante(kanten[i], i), vorn = kante(kanten[i + 1], i + 1), tief = kanten[i + 1] - kanten[i];
    k += `<path d="${glatt([...hinten, ...vorn.slice().reverse()], true, 0.6)}" fill="${S.lg("lauf" + (i % 2), [[0, i % 2 ? "#86b04f" : "#91ba57"], [1, i % 2 ? "#7aa447" : "#86ae4f"]])}"/>`;
    if (tief > 4) k += `<path d="${glatt([...hinten, ...vorn.slice().reverse()], true, 0.6)}" fill="${GRAS}"/>`;
    /* Schatten der höheren Mauer (vorn) auf dieser Stufe: Streifen am vorderen Rand? Nein — die Mauer fällt zur Stadt hin
       ab: ihr Schatten liegt am HINTEREN Rand der Stufe davor; hier: dunkler Streifen direkt hinter der Kante */
    const sch = hinten.map(([x, y]) => [x, y + Math.min(2.6, tief * 0.22)]);
    if (i > 0) k += `<path d="${glatt([...hinten, ...sch.slice().reverse()], true, 0.6)}" fill="#33502a" opacity=".45"/>`;
    TERR.push({ hinten, vorn });
  }
  /* Mauerkronen: helle Steinreihe mit Fugen auf jeder Kante */
  for (let i = 1; i < kanten.length - 1; i++) {
    const kk = kante(kanten[i], i), d = 0.5 + i * 0.32, zf = zufall(300 + i);
    const unten = kk.map(([x, y]) => [x, y + d]);
    k += `<path d="${glatt([...kk.map(([x, y]) => [x, y - d * 0.2]), ...unten.slice().reverse()], true, 0.6)}" fill="${S.lg("krone", [[0, "#f1e9d6"], [1, "#c9bfaa"]])}"/>`;
    let f = "";
    for (let x = 66; x < 336; x += d * (2.2 + zf() * 1.6)) f += `M${r(x)} ${r(profilY(kk, x) - d * 0.15)} l${r((zf() - 0.5) * 0.4)} ${r(d * 1.1)}`;
    k += `<path d="${f}" stroke="#8f8574" stroke-width="${r(0.1 + i * 0.03)}" opacity=".75"/>`;
  }
  S.teil({ id: "terrasse", de: "die Terrasse", syl: "ter-RAS-se", it: "la terrazza", itSyl: "ter-RAZ-za", en: "terrace", x: 200, y: 230, kunst: um(200, 230, k),
    tipp: "Auf den Terrassen bauten die Inka Mais und Kartoffeln an. Die Mauern halten die Erde fest, auch bei starkem Regen." });
}

/* =====================================================================
   9 — DAS WÄCHTERHAUS (Casa del Guardián) unten links, mit Lupe
   ===================================================================== */
{
  /* wir stehen auf der Terrasse darüber und sehen schräg von oben auf die Giebelseite (zu uns) und die lange
     Seitenwand rechts (Nordost, im Morgenlicht); das Haus ist 8 m lang, 5 m breit, die Wände 2,4 m hoch. */
  const X = -4, Y = 258, W = 52, H = 25, GI = 28, f = 0.22;
  const hin = (p) => [p[0] + (VP[0] - p[0]) * f, p[1] + (VP[1] - p[1]) * f];
  const up = (p, v) => [p[0], p[1] - v];
  const A = [X, Y], Bq = [X + W, Y], A2 = hin(A), B2 = hin(Bq);
  const G = [X + W / 2, Y - H - GI], G2 = hin(G);
  let k = "";
  /* Schlagschatten nach links auf die Terrasse */
  k += `<path d="${P([A, [A[0] - 20, A[1] - 4], [A2[0] - 20, A2[1] - 4], A2])}" fill="#22361a" opacity=".3"/>`;
  /* linke Dachfläche (im Schatten), rechte Seitenwand, rechte Dachfläche (im Licht), Giebelwand vorn */
  const ue = 3.4;
  const Ae = [A[0] - ue, A[1] - H + ue * 0.6], A2e = [A2[0] - ue, A2[1] - H + ue * 0.6], Be = [Bq[0] + ue, Bq[1] - H + ue * 0.6], B2e = [B2[0] + ue, B2[1] - H + ue * 0.6];
  k += `<path d="${P([Ae, [G[0] - 1, G[1] - 1.4], [G2[0] - 1, G2[1] - 1.4], A2e])}" fill="${S.lg("dachs", [[0, "#8e6c36"], [1, "#6c5026"]])}"/>`;
  k += `<path d="${P([Bq, B2, up(B2, H), up(Bq, H)])}" fill="${S.lg("wseite", [[0, "#e9dfca"], [1, "#d2c6ad"]], 0, 0, 1, 0)}"/>`;
  /* Feldsteine der Seitenwand */
  const zs = zufall(91);
  let st = "";
  for (let row = 0; row < 6; row++) for (let t = 0.04 + (row % 2) * 0.06; t < 0.94; t += 0.13 + zs() * 0.08) {
    const p0 = [Bq[0] + (B2[0] - Bq[0]) * t, Bq[1] + (B2[1] - Bq[1]) * t], s0 = 1 - f * t, hh = H * s0 / 6;
    const dt = 0.1, p1 = [Bq[0] + (B2[0] - Bq[0]) * (t + dt), Bq[1] + (B2[1] - Bq[1]) * (t + dt)];
    st += `<path d="M${r(p0[0])} ${r(p0[1] - row * hh - 0.4)} L${r(p1[0])} ${r(p1[1] - row * hh - 0.4)} L${r(p1[0])} ${r(p1[1] - (row + 1) * hh + 0.3)} L${r(p0[0])} ${r(p0[1] - (row + 1) * hh + 0.3)} Z"/>`;
  }
  k += `<g fill="#f4ecdb" stroke="#a89c86" stroke-width=".3" opacity=".85">${st}</g>`;
  k += `<path d="${P([Be, [G[0] + 0.6, G[1] - 1.6], [G2[0] + 0.6, G2[1] - 1.6], B2e])}" fill="${S.lg("dachl", [[0, "#e9c985"], [0.55, "#cfa865"], [1, "#a8823f"]], 0, 0, 1, 0.3)}"/>`;
  k += `<path d="${P([Be, [G[0] + 0.6, G[1] - 1.6], [G2[0] + 0.6, G2[1] - 1.6], B2e])}" fill="${STROH}" opacity=".5"/>`;
  /* Bindeschnüre quer über die Dachfläche und Halme an der Traufe */
  for (let i = 1; i < 6; i++) { const t = i / 6; k += `<path d="M${r(G[0] + (G2[0] - G[0]) * t + 0.6)} ${r(G[1] + (G2[1] - G[1]) * t - 1.6)} L${r(Be[0] + (B2e[0] - Be[0]) * t)} ${r(Be[1] + (B2e[1] - Be[1]) * t)}" stroke="#7d6232" stroke-width=".4" opacity=".6"/>`; }
  let halme = "";
  for (let t = 0; t <= 1.001; t += 0.035) { const p0 = [Be[0] + (B2e[0] - Be[0]) * t, Be[1] + (B2e[1] - Be[1]) * t]; halme += `M${r(p0[0])} ${r(p0[1] - 0.4)} l${r(0.6)} ${r(2 - t)}`; }
  k += `<path d="${halme}" stroke="#8a6a34" stroke-width=".45"/>`;
  /* Giebelwand (Südost, zu uns): grobe Feldsteine mit Lehm, streifendes Morgenlicht */
  const giebel = [A, Bq, up(Bq, H), G, up(A, H)];
  k += `<path d="${P(giebel)}" fill="${S.lg("wfront", [[0, "#cbc1ad"], [1, "#ada38f"]])}"/>`;
  st = "";
  for (let row = 0; row < 10; row++) {
    const y0 = Y - 1 - row * 5.1, hh = 4.2;
    const breite = (yy) => yy > Y - H ? W : W * (1 - (Y - H - yy) / GI);
    for (let x = X + 1 + (row % 2) * 2.5; x < X + W - 2; x += 5 + zs() * 3) {
      const yy = y0 - hh, bw = breite(yy), x0 = X + (W - bw) / 2, x1 = x0 + bw;
      if (x < x0 + 0.6 || x + 4 > x1 - 0.6) continue;
      const w = Math.min(3.6 + zs() * 2.6, x1 - 0.6 - x);
      st += `<path d="M${r(x + 0.3)} ${r(y0)} Q${r(x)} ${r(y0 - hh / 2)} ${r(x + 0.4)} ${r(y0 - hh)} L${r(x + w - 0.3)} ${r(y0 - hh + (zs() - 0.5) * 0.6)} Q${r(x + w + 0.2)} ${r(y0 - hh / 2)} ${r(x + w)} ${r(y0)} Z"/>`;
    }
  }
  k += `<g fill="#d4cab6" stroke="#8a7f6c" stroke-width=".35" opacity=".9">${st}</g>`;
  /* Lichtkante rechts innen, Mauerkrone */
  k += `<path d="M${r(Bq[0] - 0.4)} ${r(Bq[1])} L${r(Bq[0] - 0.4)} ${r(Bq[1] - H)}" stroke="#f3ead6" stroke-width=".8"/>`;
  /* trapezförmige Tür und Fenster im Giebel */
  const trapez = (cx, b, h, y0) => `M${r(cx - b / 2)} ${r(y0)} L${r(cx - b * 0.33)} ${r(y0 - h)} L${r(cx + b * 0.33)} ${r(y0 - h)} L${r(cx + b / 2)} ${r(y0)} Z`;
  k += `<path d="${trapez(X + W / 2, 13, 20, Y)}" fill="#2a241e"/><path d="${trapez(X + W / 2, 13, 20, Y)}" fill="none" stroke="#efe5cf" stroke-width=".6" opacity=".7"/>`;
  k += `<path d="M${r(X + W / 2 - 4.6)} ${r(Y - 20.4)} h9.2 v1.8 h-9.2 Z" fill="#b5a88f"/>`;
  k += `<path d="${trapez(X + W / 2, 5.4, 6.6, Y - H - 7)}" fill="#2a241e"/>`;
  /* Steinringe (Dachbinder) an der Giebelkante */
  for (const t of [0.3, 0.62]) for (const sd of [-1, 1]) { const px = G[0] + sd * (W / 2) * t, py = G[1] + GI * t; k += `<ellipse cx="${r(px + sd * 1.2)}" cy="${r(py)}" rx="1.1" ry=".8" fill="#9a8f7b" stroke="#6e6556" stroke-width=".3"/>`; }
  /* Dachkante vorn (Halme stehen über) */
  k += `<path d="M${r(Ae[0])} ${r(Ae[1])} L${r(G[0])} ${r(G[1] - 2)} L${r(Be[0])} ${r(Be[1])}" stroke="#9d7b40" stroke-width="2" fill="none" stroke-linejoin="round"/>`;
  k += `<path d="M${r(Ae[0])} ${r(Ae[1] - 0.8)} L${r(G[0])} ${r(G[1] - 2.8)} L${r(Be[0])} ${r(Be[1] - 0.8)}" stroke="#ecd39a" stroke-width=".55" fill="none"/>`;
  const unter = [
    { id: "strohdach", de: "das Strohdach", syl: "STROH-dach", it: "il tetto di paglia", itSyl: "TET-to di PA-glia", en: "thatched roof", x: G[0] + 14, y: G[1] + 14, kunst: `<path d="${P([[Be[0] - G[0] - 14, Be[1] - G[1] - 14], [-14, -16], [G2[0] - G[0] - 14, G2[1] - G[1] - 16], [B2e[0] - G[0] - 14, B2e[1] - G[1] - 14]])}" class="bw-flaeche" fill="rgba(255,255,255,0.001)"/>`,
      tipp: "Das Dach ist aus Ichu, einem harten Gras der Anden. Es wird mit Seilen an Steinringen festgebunden." },
    { id: "tuer", de: "die Tür", syl: "TÜR", it: "la porta", itSyl: "POR-ta", en: "door", x: X + W / 2, y: Y - 10, kunst: flaeche(-7, -11, 14, 21),
      tipp: "Inka-Türen sind unten breiter als oben. So halten sie auch bei einem Erdbeben." },
  ];
  S.teil({ id: "waechterhaus", de: "das Wächterhaus", syl: "WÄCH-ter-haus", it: "la casa del guardiano", itSyl: "CA-sa del guar-DIA-no", en: "guardhouse", x: X + W / 2, y: Y - 26, kunst: um(X + W / 2, Y - 26, k),
    zoom: { x: -2, y: 176, w: 96, h: 64 }, unter,
    tipp: "Von hier oben bewachten die Inka die Wege in die Stadt. Hier entsteht das berühmte Foto von Machu Picchu." });
}

/* =====================================================================
   10 — DAS LAMA und DAS FOHLEN (weiden auf den Terrassen)
   ===================================================================== */
/* Lama von der Seite (Maße in Metern, nach rechts schauend): Widerrist 1,1 m, Kopf 1,75 m, dichte Wolle,
   kräftiger Hals, Bananenohren, Zehen mit Polstern. Fußpunkt (0|0), H = Höhe bis zu den Ohrspitzen. */
const lama = (H, dir, fell, fleck, seed, jung = false) => {
  const u = H / 1.86, z = zufall(seed);
  const Q = (pts) => pts.map(([a, b]) => [a * u * dir, -b * u]);
  const X = (v) => r(v * u * dir), Y = (v) => r(-v * u);
  let o = "";
  /* Schatten am Boden: lang nach links, etwas in die Tiefe */
  o += `<path d="${glatt(Q([[-0.5, 0.02], [0.55, 0.02], [0.4 - (dir > 0 ? 1.6 : 0.6), 0.14], [-0.7 - (dir > 0 ? 1.3 : 0.2), 0.12]]), true, 0.8)}" fill="#22361a" opacity=".3"/>`;
  const bein = (x, knick, c, dicke = 0.13) => `<path d="${glatt(Q([[x - dicke / 2, 0.86], [x - dicke * 0.42, 0.5], [x - 0.04 + knick, 0.08], [x - 0.07 + knick, 0], [x + 0.08 + knick, 0], [x + 0.05 + knick, 0.08], [x + dicke * 0.38, 0.5], [x + dicke / 2, 0.86]]), true, 0.5)}" fill="${c}"/>`;
  const dunkel = jung ? "#6d4c30" : "#a8987f";
  o += bein(-0.34, 0.03, dunkel) + bein(0.48, -0.02, dunkel);
  /* Körper: Wollkante als kleine Bögen */
  const kp = [[-0.66, 0.98], [-0.62, 1.1], [-0.48, 1.16], [-0.2, 1.13], [0.1, 1.12], [0.36, 1.14], [0.56, 1.1], [0.66, 0.98], [0.64, 0.82], [0.5, 0.7], [0.2, 0.67], [-0.15, 0.68], [-0.45, 0.72], [-0.62, 0.82]];
  o += `<path d="${glatt(Q(kp), true, 0.9)}" fill="${fell}"/>`;
  if (fleck) o += `<path d="${glatt(Q([[-0.1, 1.12], [0.3, 1.14], [0.52, 1.06], [0.44, 0.86], [0.12, 0.84], [-0.08, 0.96]]), true, 0.9)}" fill="${fleck}"/>`;
  let wo = "";
  for (let i = 0; i < 10; i++) { const x = -0.58 + i * 0.12; wo += `M${X(x)} ${Y(0.72 + (i % 2) * 0.03)} q${r(0.04 * u * dir)} ${r(0.06 * u)} ${r(0.09 * u * dir)} 0`; }
  o += `<path d="${wo}" stroke="#5a4a3a" stroke-width="${r(0.025 * u)}" fill="none" opacity=".35"/>`;
  /* nahe Beine */
  o += bein(-0.46, -0.04, fell, 0.15) + bein(0.36, 0.04, fell, 0.15);
  o += `<path d="M${X(-0.54)} ${Y(0.02)} h${X(0.14)} M${X(0.36)} ${Y(0.02)} h${X(0.14)}" stroke="#3d3026" stroke-width="${r(0.05 * u)}"/>`;
  /* Schwanz (kurz, etwas angehoben) */
  o += `<path d="${glatt(Q([[-0.6, 1.1], [-0.74, 1.08], [-0.78, 0.94], [-0.68, 0.96], [-0.62, 1.02]]), true, 0.8)}" fill="${fell}"/>`;
  /* Hals (kräftig, leicht nach vorn) und Kopf */
  const kh = jung ? 1.46 : 1.56;
  o += `<path d="${glatt(Q([[0.36, 1.02], [0.44, 1.3], [0.52, kh], [0.72, kh + 0.02], [0.7, 1.32], [0.66, 0.98]]), true, 0.8)}" fill="${fell}"/>`;
  o += `<path d="${glatt(Q([[0.5, kh + 0.04], [0.58, kh + 0.15], [0.72, kh + 0.16], [0.86, kh + 0.1], [0.94, kh + 0.02], [0.92, kh - 0.05], [0.78, kh - 0.07], [0.62, kh - 0.05]]), true, 0.8)}" fill="${fell}"/>`;
  for (const [ox, kr] of [[0.58, -0.04], [0.66, 0.02]]) o += `<path d="${glatt(Q([[ox, kh + 0.13], [ox - 0.03 + kr, kh + 0.25], [ox + 0.01 + kr, kh + 0.33], [ox + 0.06, kh + 0.25], [ox + 0.06, kh + 0.13]]), true, 0.8)}" fill="${fell}"/>`;
  o += `<circle cx="${X(0.74)}" cy="${Y(kh + 0.07)}" r="${r(0.028 * u)}" fill="#1d1712"/><path d="M${X(0.9)} ${Y(kh + 0.02)} l${X(0.03)} ${Y(-0.03)}" stroke="#3a2e26" stroke-width="${r(0.02 * u)}"/>`;
  o += `<path d="M${X(0.86)} ${Y(kh - 0.04)} q${X(0.03)} ${Y(-0.02)} ${X(0.07)} ${Y(0.01)}" stroke="#4a3a2e" stroke-width="${r(0.018 * u)}" fill="none"/>`;
  return o;
};
{
  /* Mutter auf der zweiten großen Stufe, das Fohlen daneben */
  const t = TERR[TERR.length - 2], x = 168, y = profilY(t.vorn, 168) - 3;
  const k = `<g filter="${VOL_FIGUR}">${lama(29, 1, S.lg("lamafell", [[0, "#f7f2e8"], [1, "#d9cfbb"]], 0, 0, 1, 0), "#9b6a3c", 5)}</g>`;
  S.teil({ id: "lama", de: "das Lama", syl: "LA-ma", it: "il lama", itSyl: "LA-ma", en: "llama", x, y, steht: true, kunst: k,
    tipp: "Lamas tragen Lasten und geben Wolle. Hier halten sie das Gras auf den Terrassen kurz." });
  const x2 = 202, y2 = profilY(t.vorn, 202) - 4.5;
  const k2 = `<g filter="${VOL_FIGUR}">${lama(18, -1, S.lg("fohlenfell", [[0, "#c39668"], [1, "#94693f"]], 0, 0, 1, 0), "#f2ebdc", 6, true)}</g>`;
  S.teil({ id: "fohlen", de: "das Fohlen", syl: "FOH-len", it: "il piccolo di lama", itSyl: "PIC-co-lo di LA-ma", en: "baby llama", x: x2, y: y2, steht: true, kunst: k2,
    tipp: "Ein junges Lama heißt Fohlen. Es bleibt fast ein Jahr bei seiner Mutter." });
}

/* =====================================================================
   11 — DIE TREPPE (Inka-Treppe durch die Terrassen hinab zur Stadt)
   ===================================================================== */
{
  let k = "";
  const unten = 262, oben = 211, xl = (y) => 214 + (unten - y) * 0.24, xr = (y) => 246 - (unten - y) * 0.2;
  /* Wangen (niedrige Mauern links und rechts) */
  k += `<path d="M${r(xl(unten) - 4)} ${unten} L${r(xl(oben) - 1.2)} ${oben} L${r(xl(oben))} ${oben} L${r(xl(unten))} ${unten} Z" fill="#9b9283"/>`;
  k += `<path d="M${r(xr(unten))} ${unten} L${r(xr(oben))} ${oben} L${r(xr(oben) + 1.4)} ${oben} L${r(xr(unten) + 4.4)} ${unten} Z" fill="#ece3cf"/>`;
  k += `<path d="M${r(xl(unten))} ${unten} L${r(xl(oben))} ${oben} L${r(xr(oben))} ${oben} L${r(xr(unten))} ${unten} Z" fill="${S.lg("treppe", [[0, "#ddd4c1"], [1, "#c4baa5"]])}"/>`;
  /* Stufen: Kante hell, dahinter der Schatten (die Stufe fällt von uns weg) */
  let y = unten, n = 0;
  while (y > oben + 0.8) {
    const h = 1 + (y - oben) * 0.085;
    k += `<path d="M${r(xl(y))} ${r(y - h)} L${r(xr(y))} ${r(y - h)}" stroke="#fbf5e6" stroke-width="${r(0.22 + h * 0.12)}"/>`;
    k += `<path d="M${r(xl(y - h))} ${r(y - h - h * 0.28)} L${r(xr(y - h))} ${r(y - h - h * 0.28)}" stroke="#6f6658" stroke-width="${r(h * 0.32)}" opacity=".55"/>`;
    y -= h; n++;
  }
  /* einzelne Steinfugen */
  const zt = zufall(57); let f = "";
  for (let i = 0; i < 26; i++) { const yy = oben + 2 + zt() * (unten - oben - 4), x = xl(yy) + zt() * (xr(yy) - xl(yy)); f += `M${r(x)} ${r(yy)} l0 ${r(0.6 + (yy - oben) * 0.03)}`; }
  k += `<path d="${f}" stroke="#8f8676" stroke-width=".25"/>`;
  S.teil({ id: "treppe", de: "die Treppe", syl: "TREP-pe", it: "la scala", itSyl: "SCA-la", en: "stairs", x: 230, y: 240, kunst: um(230, 240, k),
    tipp: "In Machu Picchu gibt es über 100 Treppen aus Stein. Manche Stufen sind aus einem einzigen Felsblock gehauen." });
}

/* =====================================================================
   12 — DER BUS auf der Serpentine
   ===================================================================== */
{
  let k = `<path d="M-6.4 .6 L6.2 -.6 L6.2 .4 L-6.4 1.6 Z" fill="#2a2c20" opacity=".35"/>`;
  k += `<path d="M-6 -3.4 L5.6 -3.8 Q6.4 -3.8 6.4 -3 L6.4 .1 L-6 .6 Z" fill="${S.lg("bus", [[0, "#ffffff"], [1, "#d9dcd8"]])}"/>`;
  k += `<path d="M-6 -1.3 L6.4 -1.7 L6.4 -1 L-6 -.6 Z" fill="#2f8a4a"/>`;
  for (let i = 0; i < 5; i++) k += `<path d="M${r(-5.2 + i * 2.1)} -3 h1.6 v1.2 h-1.6 Z" fill="#3c5566"/>`;
  k += `<path d="M5 -3.3 h1.2 v1.6 h-1.2 Z" fill="#6b8696"/><circle cx="-3.6" cy=".5" r=".75" fill="#1d1d1d"/><circle cx="3.8" cy=".2" r=".75" fill="#1d1d1d"/>`;
  k += `<path d="M-6 -3.4 L5.6 -3.8" stroke="#fff" stroke-width=".35"/>`;
  S.teil({ oben: true, id: "bus", de: "der Bus", syl: "BUS", it: "l'autobus", itSyl: "AU-to-bus", en: "bus", x: 350, y: 197.6, kunst: k,
    tipp: "Die Busse fahren in etwa 25 Minuten vom Ort Aguas Calientes zur Ruinenstadt hinauf." });
}

/* =====================================================================
   13 — DIE TOURISTEN (Familie auf der vorderen Terrasse), mit Lupe:
        die Mütze (Chullo), der Poncho, die Panflöte
   ===================================================================== */
{
  const dunkel = (svg) => vereinfache(svg, 0.2);
  const schattenFigur = (x, y, h) => `<path d="M${r(x - 2.6)} ${r(y + 0.6)} L${r(x + 2.4)} ${r(y + 0.4)} L${r(x - h * 0.95)} ${r(y - h * 0.12)} L${r(x - h * 1.05)} ${r(y - h * 0.06)} Z" fill="${S.lg("figschatten", [[0, "#1d3014", 0], [0.15, "#1d3014", 0.18], [1, "#1d3014", 0.38]], 0, 0, 1, 0)}"/>`;
  const fig = (spec, hoehe) => B.mensch(Object.assign({ ohneSchatten: true, laecheln: true }, spec), hoehe);
  const pk = (m, n) => [m.z.punkte[n][0] * m.k, m.z.punkte[n][1] * m.k];
  let k = "", sch = "";
  /* Vater: schaut zur Stadt (Rücken zu uns), trägt den roten Poncho aus Alpakawolle */
  const V = { x: 302, y: 254 };
  const mv = fig({ id: "per_vater", geschlecht: "m", alter: "erwachsen", pose: "stehen", blick: 158, frisur: "kurz", haarfarbe: "braun", haut: "hell",
    kleidung: { oberteil: { stueck: "pullover", farbe: "#3f4a5a" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "stiefel", farbe: "braun" } } }, 42);
  {
    const [slx, sly] = pk(mv, "schulterL"), [srx, sry] = pk(mv, "schulterR"), [hx, hy] = pk(mv, "hals"), [hlx, hly] = pk(mv, "huefteL"), [hrx] = pk(mv, "huefteR");
    const xa = Math.min(slx, srx) - 2.2, xb = Math.max(slx, srx) + 2.2, yS = Math.min(sly, sry), yu = hly + 3.4, xm = (xa + xb) / 2;
    let po = `<path d="M${r(hx - 1.6)} ${r(hy - 0.4)} Q${r(xa + 0.6)} ${r(yS - 0.6)} ${r(xa - 0.6)} ${r(yS + 2.4)} L${r(xa - 2.2)} ${r(yu)} Q${r(xm)} ${r(yu + 1.6)} ${r(xb + 2.2)} ${r(yu)} L${r(xb + 0.6)} ${r(yS + 2.4)} Q${r(xb - 0.6)} ${r(yS - 0.6)} ${r(hx + 1.6)} ${r(hy - 0.4)} Z" fill="${S.lg("poncho", [[0, "#8e1c22"], [0.55, "#b8282f"], [1, "#d8453c"]], 0, 0, 1, 0)}"/>`;
    /* Streifenbänder (gelb, grün, schwarz) und Fransen am Saum */
    for (const [dy, c, w] of [[-3.2, "#f2c230", 0.45], [-2.5, "#1f6b3a", 0.4], [-1.9, "#f2c230", 0.3], [-6.6, "#1d1d22", 0.3]]) po += `<path d="M${r(xa - 2 + 0.2)} ${r(yu + dy)} Q${r(xm)} ${r(yu + dy + 1.6)} ${r(xb + 2 - 0.2)} ${r(yu + dy)}" stroke="${c}" stroke-width="${w}" fill="none"/>`;
    for (let x = xa - 1.8; x < xb + 1.8; x += 0.7) po += `<path d="M${r(x)} ${r(yu + 1.2 - Math.pow((x - xm) / (xb - xa + 4), 2) * 6)} l0 1.2" stroke="#9c2128" stroke-width=".25"/>`;
    po += `<path d="M${r(xb + 0.2)} ${r(yS + 2.6)} L${r(xb + 1.6)} ${r(yu - 0.4)}" stroke="#f07a5a" stroke-width=".6" opacity=".7"/>`;
    k += `<g transform="translate(${V.x} ${V.y})"><g filter="${VOL_FIGUR}">${dunkel(mv.svg)}</g>${po}</g>`;
    sch += schattenFigur(V.x, V.y, 42);
    STADT.poncho = { x: V.x + xm, y: V.y + (yS + yu) / 2 };
  }
  /* Mutter: fotografiert die Stadt (Rücken zu uns), mit Rucksack und Sonnenhut */
  const M = { x: 328, y: 251 };
  const poseFoto = { lende: 1, brust: -2, nacken: 4, kopf: 0, schulterL: { vor: 58, seit: 22 }, ellbogenL: 118, unterarmL: 60, handL: 10, fingerL: 0.6, schulterR: { vor: 56, seit: 24 }, ellbogenR: 120, unterarmR: 60, handR: 10, fingerR: 0.6,
    huefteL: { vor: 10, seit: 4, dreh: -6 }, knieL: 8, fussL: 0, huefteR: { vor: -6, seit: 4, dreh: -6 }, knieR: 2, fussR: 0 };
  const mm = fig({ id: "per_mutter", geschlecht: "w", alter: "erwachsen", pose: poseFoto, blick: 172, frisur: "zopf", haarfarbe: "dunkelbraun", haut: "hell",
    kleidung: { oberteil: { stueck: "hemd", farbe: "#e9e4d6" }, unterteil: { stueck: "hose", farbe: "#6a6f52" }, schuhe: { stueck: "stiefel", farbe: "braun" }, kopf: { stueck: "hut", farbe: "#e8dcc0" }, zubehoer: { stueck: "rucksack", farbe: "#2f6f8f" } } }, 39);
  k = `<g transform="translate(${M.x} ${M.y})"><g filter="${VOL_FIGUR}">${dunkel(mm.svg)}</g></g>` + k;
  sch += schattenFigur(M.x, M.y, 39);
  /* Mädchen: schaut zu uns, trägt den Chullo und hält eine Panflöte */
  const Mä = { x: 278, y: 257 };
  const poseHalt = { lende: 1, brust: -1, nacken: 4, kopf: -4, schulterL: { vor: 34, seit: 12 }, ellbogenL: 100, unterarmL: 70, handL: 6, fingerL: 0.55, schulterR: { vor: 32, seit: 12 }, ellbogenR: 98, unterarmR: 70, handR: 6, fingerR: 0.55,
    huefteL: { vor: 3, seit: 3, dreh: -6 }, knieL: 3, fussL: 0, huefteR: { vor: -3, seit: 3, dreh: -6 }, knieR: 2, fussR: 0 };
  const mk = fig({ id: "per_kind", geschlecht: "w", alter: "kind", pose: poseHalt, blick: -22, frisur: "zopf", haarfarbe: "braun", haut: "hell",
    kleidung: { oberteil: { stueck: "pullover", farbe: "#e0802e" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" } } }, 31);
  let chullo = "", floete = "";
  {
    const [sx, sy] = pk(mk, "scheitel"), [stx, sty] = pk(mk, "stirn"), [ox, oy] = pk(mk, "ohr"), [hkx, hky] = pk(mk, "hinterkopf"), [kx, ky] = pk(mk, "kinn");
    const cx = (stx + hkx) / 2, br = Math.abs(stx - hkx) / 2 + 1.1, yT = sy - 0.5, yB = sty + 0.4;
    const fl = (side) => { const ex = cx + side * (br - 0.2); return `<path d="M${r(ex - side * 0.9)} ${r(yB - 0.2)} L${r(ex + side * 0.15)} ${r(yB - 0.1)} L${r(ex + side * 0.1)} ${r(ky - 0.2)} Q${r(ex - side * 0.4)} ${r(ky + 0.5)} ${r(ex - side * 0.9)} ${r(ky - 0.4)} Z" fill="#b8262e"/><path d="M${r(ex - side * 0.4)} ${r(ky + 0.2)} l${r(side * 0.1)} 3.2" stroke="#f2c230" stroke-width=".35"/><circle cx="${r(ex - side * 0.3)}" cy="${r(ky + 3.6)}" r=".55" fill="#2f6fb0"/>`; };
    chullo += fl(-1) + fl(1);
    chullo += `<path d="M${r(cx - br)} ${r(yB)} Q${r(cx - br)} ${r(yT - 1.2)} ${r(cx)} ${r(yT - 1.4)} Q${r(cx + br)} ${r(yT - 1.2)} ${r(cx + br)} ${r(yB)} Z" fill="${S.lg("chullo", [[0, "#c22d33"], [1, "#e05040"]], 0, 0, 1, 0)}"/>`;
    /* Muster: weißes Zickzackband, blaues und gelbes Band */
    let zz = `M${r(cx - br + 0.3)} ${r(yB - 1.6)}`;
    for (let x = cx - br + 0.3, i = 0; x < cx + br - 0.3; x += 0.55, i++) zz += ` L${r(x + 0.55)} ${r(yB - 1.6 + (i % 2 ? 0 : -0.6))}`;
    chullo += `<path d="${zz}" stroke="#fbf6ea" stroke-width=".32" fill="none"/>`;
    chullo += `<path d="M${r(cx - br + 0.1)} ${r(yB - 0.4)} H${r(cx + br - 0.1)}" stroke="#2f6fb0" stroke-width=".55"/><path d="M${r(cx - br + 0.5)} ${r(yB - 2.8)} Q${r(cx)} ${r(yB - 3.4)} ${r(cx + br - 0.5)} ${r(yB - 2.8)}" stroke="#f2c230" stroke-width=".4" fill="none"/>`;
    chullo += `<circle cx="${r(cx + 0.2)}" cy="${r(yT - 2.1)}" r="1.05" fill="#f2c230"/><circle cx="${r(cx + 0.5)}" cy="${r(yT - 2.4)}" r=".45" fill="#fff4b8"/>`;
    STADT.muetze = { x: Mä.x + cx, y: Mä.y + (yT + yB) / 2 };
    /* Panflöte (Siku): sieben Rohre, nach rechts kürzer, mit Schnur gebunden — vor der Brust */
    const hx = (mk.z.handL.x + mk.z.handR.x) / 2 * mk.k, hy = (mk.z.handL.y + mk.z.handR.y) / 2 * mk.k;
    const fx = hx - 2.4, fy = hy - 2.8;
    for (let i = 0; i < 7; i++) floete += `<rect x="${r(fx + i * 0.68)}" y="${r(fy)}" width=".6" height="${r(5.2 - i * 0.5)}" rx=".28" fill="${i % 2 ? "#d9b56c" : "#e8c98a"}" stroke="#8a6a34" stroke-width=".12"/>`;
    floete += `<path d="M${r(fx - 0.1)} ${r(fy + 1.6)} H${r(fx + 4.8)}" stroke="#c22d33" stroke-width=".45"/>`;
    STADT.floete = { x: Mä.x + fx + 2.3, y: Mä.y + fy + 2.2 };
  }
  k += `<g transform="translate(${Mä.x} ${Mä.y})"><g filter="${VOL_FIGUR}">${dunkel(mk.svg)}</g>${chullo}${floete}</g>`;
  sch += schattenFigur(Mä.x, Mä.y, 31);
  const unter = [
    { id: "muetze", de: "die Mütze", syl: "MÜT-ze", it: "il berretto", itSyl: "ber-RET-to", en: "hat", x: STADT.muetze.x, y: STADT.muetze.y, kunst: flaeche(-3, -3.5, 6, 7),
      tipp: "Die Mütze aus den Anden heißt Chullo. Sie hat Ohrenklappen und hält in der Höhe schön warm." },
    { id: "poncho", de: "der Poncho", syl: "PON-cho", it: "il poncho", itSyl: "PON-cio", en: "poncho", x: STADT.poncho.x, y: STADT.poncho.y, kunst: flaeche(-7, -8, 14, 16),
      tipp: "Der Poncho ist ein großes Tuch mit einem Loch für den Kopf. Er ist oft aus warmer Alpakawolle." },
    { id: "panfloete", de: "die Panflöte", syl: "PAN-flö-te", it: "il flauto di Pan", itSyl: "FLAU-to di PAN", en: "pan flute", x: STADT.floete.x, y: STADT.floete.y, kunst: flaeche(-3.2, -3, 6.4, 6),
      tipp: "Die Panflöte heißt in den Anden Siku. Jedes Rohr hat einen anderen Ton." },
  ];
  S.teil({ id: "touristen", de: "die Touristen", syl: "tou-RIS-ten", it: "i turisti", itSyl: "tu-RI-sti", en: "tourists", x: 304, y: 236,
    kunst: um(304, 236, `<g pointer-events="none">${sch}</g>` + k), zoom: { x: 258, y: 206, w: 84, h: 56 }, unter,
    tipp: "Jeden Tag besuchen Tausende Menschen Machu Picchu. Man darf nur mit einer Eintrittskarte und auf festen Wegen hinein." });
}

/* =====================================================================
   14 — DIE ORCHIDEE (Wiñay Wayna) und DER KOLIBRI am Rand der Treppe
   ===================================================================== */
{
  let k = "";
  const stiele = [[0, 0, -1.6, -13], [1.2, 0, 2.2, -10.5], [-1, 0, -4, -8.6]];
  for (const [x0, y0, x1, y1] of stiele) k += `<path d="M${x0} ${y0} Q${r((x0 + x1) / 2 + 1)} ${r((y0 + y1) / 2)} ${x1} ${y1}" stroke="#4f7a32" stroke-width=".45" fill="none"/>`;
  k += `<path d="M-1 0 Q-5 -2 -7 -1.2 Q-4 -.4 -1 .4 Z M1 0 Q5 -2.6 7.4 -1.6 Q4.4 -.2 1 .4 Z" fill="#3f6e2c"/>`;
  for (const [, , x1, y1] of stiele) {
    const z = zufall(Math.round(x1 * 10 + 200));
    for (let i = 0; i < 9; i++) {
      const a = i / 9 * Math.PI * 2, rr = i ? 1.3 : 0, cx = x1 + Math.cos(a) * rr * (0.8 + z() * 0.3), cy = y1 + Math.sin(a) * rr * 0.8;
      k += `<g transform="translate(${r(cx)} ${r(cy)})"><path d="M0 -.75 L.22 -.2 L.75 -.1 L.3 .25 L.45 .75 L0 .45 L-.45 .75 L-.3 .25 L-.75 -.1 L-.22 -.2 Z" fill="${i % 3 ? "#d6408f" : "#b8327a"}"/><circle r=".22" fill="#f6d34a"/></g>`;
    }
  }
  S.teil({ oben: true, id: "orchidee", de: "die Orchidee", syl: "or-chi-DE-e", it: "l'orchidea", itSyl: "or-chi-DE-a", en: "orchid", x: 208, y: 247, kunst: k,
    tipp: "Diese Orchidee heißt Wiñay Wayna – „ewig jung“. In Machu Picchu wachsen über 400 Orchideenarten." });
  /* Kolibri: schwirrt vor den Blüten, Flügel verwischt */
  let ko = `<path d="M-2.2 .2 Q-1 -1.2 1 -.8 Q2.2 -.6 2.6 .2 Q1.6 1.1 -.4 1 Q-1.6 .9 -2.2 .2 Z" fill="${S.lg("kolibri", [[0, "#1f8a5a"], [1, "#3fc08a"]], 0, 0, 1, 0)}"/>`;
  ko += `<path d="M-2.1 .4 L-4.2 1.4 L-3.8 .3 Z" fill="#1b5f3e"/><path d="M1.6 -.2 Q2.6 .4 2.4 1 Q1.6 .9 1.2 .3 Z" fill="#d8344a"/>`;
  ko += `<circle cx="1.9" cy="-.25" r=".25" fill="#111"/><path d="M2.6 0 L5.4 .6" stroke="#2a2a2a" stroke-width=".3"/>`;
  ko += `<path d="M-.4 -.6 Q-1.6 -4.2 .6 -4.6 Q.8 -2.4 .4 -.6 Z" fill="#9fd8c0" opacity=".55"/><path d="M-.2 -.6 Q.4 -3.4 2.2 -3.2 Q1.2 -1.6 .5 -.5 Z" fill="#c8f0de" opacity=".45"/>`;
  S.teil({ oben: true, id: "kolibri", de: "der Kolibri", syl: "KO-li-bri", it: "il colibrì", itSyl: "co-li-BRÌ", en: "hummingbird", x: 197, y: 233, kunst: ko,
    tipp: "Der Kolibri schlägt bis zu 50-mal in der Sekunde mit den Flügeln. So kann er in der Luft stehen bleiben." });
}




const silben = (t) => { if (!t) return t; const st = t.split(/([- ])/); const gross = (x) => x.length && x === x.toUpperCase() && x !== x.toLowerCase(); const lang = st.some((x) => gross(x) && x.length > 1); return st.map((x) => (/^[- ]$/.test(x) ? x : (gross(x) && (x.length > 1 || !lang || /[À-ÖÙ-Ý]/.test(x)) ? x : x.toLowerCase()))).join(""); };
for (const t of S.teile) for (const u of [t, ...(t.unter || [])]) { u.syl = silben(u.syl); u.itSyl = silben(u.itSyl); }
const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/peru.js"));
console.log(aus);
