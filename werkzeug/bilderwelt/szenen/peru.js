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
  /* Relief: beleuchtete Rücken und dunkle Rinnen als weiche Flächen (weichgezeichnet, keine Linien) */
  let rel = "";
  for (const [x0, l, sd] of [[12, 92, 1], [38, 90, 2], [62, 84, 3], [88, 76, 4], [114, 60, 5]]) {
    const z = zufall(sd), y0 = profilY(KAMM_B, x0) + 2, pts = [[x0, y0]];
    let x = x0; for (let i = 1; i <= 5; i++) { x += (z() - 0.7) * 4; pts.push([x, y0 + l * i / 5]); }
    const breite = (i) => 1.5 + i * 1.3;
    rel += `<path d="${glatt([...pts.map(([a, b], i) => [a - breite(i), b]), ...pts.map(([a, b], i) => [a + breite(i) * 0.3, b]).reverse()], true, 0.8)}" fill="#1f3a30" opacity=".45"/>`;
    rel += `<path d="${glatt([...pts.map(([a, b], i) => [a + 1 + breite(i) * 0.3, b]), ...pts.map(([a, b], i) => [a + 2 + breite(i) * 1.6, b + 1]).reverse()], true, 0.8)}" fill="#a9cba0" opacity=".3"/>`;
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
  for (const [x, y, w, h, sd] of [[316, 104, 14, 22, 31], [340, 90, 12, 28, 32], [362, 96, 13, 20, 33], [332, 130, 10, 13, 34], [380, 108, 10, 18, 35]]) k += fels(x, y, w, h, sd, "#7b8680", "#55625c", "#3d5e4f");
  k += `<path d="${glatt(PUTU.slice(1), false)}" stroke="#f3e2b4" stroke-width=".9" fill="none" opacity=".75"/>`;
  k += `<path d="${putD}" fill="${S.lg("putudunst", [[0, "#dfe9ef", 0], [0.55, "#dfe9ef", 0.1], [1, "#dfe9ef", 0.6]])}"/>`;
  /* naher Osthang auf unserer Seite (rechts unten): bewaldet, im Morgenlicht */
  const OST = [[312, 262], [318, 214], [330, 190], [348, 176], [366, 170], [384, 168], [402, 166], [402, 262]];
  k += `<path d="${glatt(OST, true, 0.7)}" fill="${S.lg("osthang", [[0, "#5f8c45"], [1, "#3d6a36"]])}"/>`;
  k += `<path d="${glatt(OST, true, 0.7)}" fill="${WALD}"/>`;
  k += `<path d="${glatt(OST.slice(1, 7), false)}" stroke="#bcd88a" stroke-width=".8" fill="none" opacity=".7"/>`;
  S.teil({ id: "berg", de: "der Berg", syl: "BERG", it: "la montagna", itSyl: "mon-TA-gna", en: "mountain", x: 352, y: 80, kunst: um(352, 80, k),
    tipp: "Rechts gegenüber liegt der Berg Putucusi. Zwischen den Bergen fließt tief unten der Fluss Urubamba." });
}

/* =====================================================================
   3 — DER FLUSS (Urubamba) ganz unten rechts in der Schlucht
   ===================================================================== */
{
  const k = `<path d="M300 205 Q330 199 352 202 Q376 205 402 200 L402 207 Q378 212 352 209 Q326 206 304 210 Z" fill="${S.lg("fluss", [[0, "#a7b9a8"], [1, "#6e8e83"]])}"/>` +
    `<path d="M312 205 q10 -1.2 20 0 M344 204.6 q8 .8 18 .2 M372 205 q10 -.8 22 -1.6" stroke="#eef3ea" stroke-width=".5" fill="none" opacity=".8"/>`;
  S.teil({ id: "fluss", de: "der Fluss", syl: "FLUSS", it: "il fiume", itSyl: "FIU-me", en: "river", x: 352, y: 205, kunst: um(352, 205, k),
    tipp: "Der Urubamba fließt rund 450 Meter tiefer als die Stadt. Die Inka nannten ihn den heiligen Fluss." });
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
  for (const [x, y, w, h, sd, hell] of [[192, 58, 11, 20, 41, 0], [201, 40, 10, 16, 42, 0], [212, 36, 9, 14, 43, 1], [182, 80, 10, 16, 44, 0], [222, 50, 9, 15, 45, 1], [236, 70, 8, 10, 46, 1], [171, 100, 9, 12, 47, 0], [206, 64, 8, 13, 48, 0]])
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
  const ruecken = [[78, 232], [96, 186], [110, 160], [128, 146], [160, 141], [196, 143], [236, 141], [268, 142], [296, 150], [318, 162], [334, 180], [344, 205], [340, 232]];
  k += `<path d="${glatt(ruecken, true, 0.7)}" fill="${S.lg("ruecken", [[0, "#7e9f52"], [1, "#5d8240"]])}"/>`;
  k += `<path d="${glatt(ruecken, true, 0.7)}" fill="${WALDF}" opacity=".6"/>`;
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
  k += `<path d="${P(platz)}" fill="${S.lg("platz", [[0, "#a3c95e"], [1, "#8ab650"]])}"/>`;
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
   ===================================================================== */
const TERR = [];          /* Vorderkanten der Stufen (für Lamas und Besucher) */
{
  let k = "";
  /* Untergrund: der Hang unter uns, links fällt er in die Schlucht */
  k += `<path d="M60 262 L66 228 Q120 210 200 209 Q280 210 336 222 L344 262 Z" fill="#6f9746"/>`;
  /* Stufen von hinten (oben) nach vorn (unten): Lauffläche, darunter die Stützmauer (vorne sichtbar, weil der Hang sich krümmt) */
  const stufen = [[211.5, 1.6, 2.6], [215.5, 1.9, 3.2], [220.5, 2.3, 4], [227, 2.8, 5], [235.5, 3.4, 6.2], [246.5, 4.2, 7.6], [260.5, 5, 9]];
  let vorher = 209;
  stufen.forEach(([y, wand, tief], i) => {
    const lin = (yy, lift) => [[64 - i * 0.6, yy + 6 + lift], [110, yy + 0.8 + lift], [170, yy - 1.2 + lift], [230, yy - 0.8 + lift], [290, yy + 0.8 + lift], [340 + i * 0.4, yy + 5 + lift]];
    const oben = lin(vorher, 0), unten = lin(y - wand, 0), fuss = lin(y, 0);
    k += `<path d="${glatt([...oben, ...unten.slice().reverse()], true, 0.6)}" fill="${S.lg("lauf" + (i % 2), [[0, i % 2 ? "#8db655" : "#97bf5c"], [1, i % 2 ? "#7ba548" : "#86b04f"]])}"/>`;
    k += `<path d="${glatt([...oben, ...unten.slice().reverse()], true, 0.6)}" fill="${GRAS}"/>`;
    k += `<path d="${glatt([...unten, ...fuss.slice().reverse()], true, 0.6)}" fill="${S.lg("terrmauer", [[0, "#d8d0bf"], [1, "#a69e8e"]])}"/>`;
    /* Steinfugen der Mauer: grobe Feldsteine */
    let fugen = "";
    const zf = zufall(300 + i);
    for (let x = 70; x < 336; x += wand * (1.4 + zf())) { const yy = profilY(unten, x); fugen += `M${r(x)} ${r(yy + 0.2)} l${r((zf() - 0.5) * 0.6)} ${r(wand * 0.95)}`; }
    k += `<path d="${fugen}" stroke="#857d6f" stroke-width="${r(0.12 + i * 0.03)}" opacity=".8"/>`;
    k += `<path d="${glatt(unten, false)}" stroke="#f6efdf" stroke-width="${r(0.3 + i * 0.06)}" fill="none"/>`;
    /* Schatten der Mauer auf der nächsten Stufe davor fällt nach links — die Mauer selbst steht im Licht */
    TERR.push({ y, oben: unten, unten: fuss });
    vorher = y;
  });
  S.teil({ id: "terrasse", de: "die Terrasse", syl: "ter-RAS-se", it: "la terrazza", itSyl: "ter-RAZ-za", en: "terrace", x: 200, y: 232, kunst: um(200, 232, k),
    tipp: "Auf den Terrassen bauten die Inka Mais und Kartoffeln an. Die Mauern halten die Erde fest, auch bei starkem Regen." });
}

/* =====================================================================
   9 — DAS WÄCHTERHAUS (Casa del Guardián) unten links, mit Lupe
   ===================================================================== */
{
  /* wir stehen auf der Terrasse darüber: man sieht das Strohdach von oben, die Giebelseite rechts im Licht */
  const X = -6, Y = 252, L = 78, H = 26, TIEF = [-16, -14], GI = 30;
  const A = [X, Y], Bq = [X + L, Y], A2 = [X + TIEF[0], Y + TIEF[1]], B2 = [X + L + TIEF[0], Y + TIEF[1]];
  const up = (p, v) => [p[0], p[1] - v];
  let k = "";
  /* Schlagschatten nach links auf die Terrasse */
  k += `<path d="${P([A, [A[0] - 26, A[1] - 3], [A2[0] - 26, A2[1] - 3], A2])}" fill="#2a3a20" opacity=".3"/>`;
  /* rechte Giebelwand (Nordost, im Morgenlicht) */
  const gw = [Bq, B2, up(B2, H), [(Bq[0] + B2[0]) / 2, (Bq[1] + B2[1]) / 2 - H - GI], up(Bq, H)];
  k += `<path d="${P(gw)}" fill="${S.lg("wgiebel", [[0, "#e3d9c4"], [1, "#c8bca4"]], 0, 0, 1, 0)}"/>`;
  /* Vorderwand (Südost, zu uns) */
  k += `<path d="${P([A, Bq, up(Bq, H), up(A, H)])}" fill="${S.lg("wfront", [[0, "#c1b7a3"], [1, "#a69c89"]])}"/>`;
  /* Feldsteine mit Lehmfugen */
  const zs = zufall(91);
  let st = "";
  for (let row = 0; row < 7; row++) {
    const y0 = Y - 2 - row * (H / 7);
    for (let x = X + 2 + (row % 2) * 2.6; x < X + L - 3; x += 4 + zs() * 3.4) { const w = 3 + zs() * 2.4, h = H / 7 - 0.7; st += `<path d="M${r(x)} ${r(y0)} l${r(0.3)} ${r(-h)} l${r(w)} ${r(-0.3 + zs() * 0.6)} l${r(0.2)} ${r(h)} Z"/>`; }
  }
  k += `<g fill="#cfc5b1" stroke="#8a7f6c" stroke-width=".3" opacity=".9">${st}</g>`;
  st = "";
  for (let row = 0; row < 7; row++) {
    const t0 = row / 7;
    for (let t = 0.08; t < 0.92; t += 0.16 + zs() * 0.1) { const p = [Bq[0] + (B2[0] - Bq[0]) * t, Bq[1] + (B2[1] - Bq[1]) * t - 2 - row * (H / 7)]; st += `<path d="M${r(p[0])} ${r(p[1])} l${r(TIEF[0] * 0.14)} ${r(TIEF[1] * 0.14)} l0 ${r(-H / 7 + 0.7)} l${r(-TIEF[0] * 0.14)} ${r(-TIEF[1] * 0.14)} Z"/>`; }
  }
  k += `<g fill="#efe6d2" stroke="#a89c86" stroke-width=".3" opacity=".9">${st}</g>`;
  /* trapezförmige Tür in der Vorderwand und zwei Nischen */
  const tuer = (cx, b, h, y0) => `<path d="M${r(cx - b / 2)} ${r(y0)} L${r(cx - b * 0.34)} ${r(y0 - h)} L${r(cx + b * 0.34)} ${r(y0 - h)} L${r(cx + b / 2)} ${r(y0)} Z"/>`;
  k += `<g fill="#2d2721">${tuer(X + 48, 9, 19, Y)}${tuer(X + 22, 5, 7, Y - 9)}${tuer(X + 64, 5, 7, Y - 9)}</g>`;
  k += `<path d="M${r(X + 48 - 3.2)} ${r(Y - 19.4)} h6.4 v1.6 h-6.4 Z" fill="#b3a68e"/>`;
  /* Fenster im Giebel (trapezförmig) und Steinringe zum Festbinden des Dachs */
  const gm = [(Bq[0] + B2[0]) / 2, (Bq[1] + B2[1]) / 2];
  k += `<path d="M${r(gm[0] - 3)} ${r(gm[1] - H - 4)} L${r(gm[0] - 2.2)} ${r(gm[1] - H - 11)} L${r(gm[0] + 1.4)} ${r(gm[1] - H - 12.6)} L${r(gm[0] + 2)} ${r(gm[1] - H - 5.6)} Z" fill="#3a332b"/>`;
  /* Strohdach: First von der Giebelspitze nach links; vordere Dachfläche (Südost) zu uns, oben im Licht */
  const F1 = [gm[0], gm[1] - H - GI], F0 = [F1[0] - L, F1[1]];
  const ue = 3.2;
  const dachV = [[A[0] - ue, A[1] - H + ue], [Bq[0] + ue * 0.6, Bq[1] - H + ue], F1, F0];
  k += `<path d="${P(dachV)}" fill="${S.lg("dachv", [[0, "#e4c27e"], [0.5, "#c9a463"], [1, "#9d7a40"]])}"/>`;
  k += `<path d="${P(dachV)}" fill="${STROH}" opacity=".55"/>`;
  /* Halme an der Traufe, Bindeschnüre */
  let halme = "";
  for (let x = A[0] - ue + 1; x < Bq[0]; x += 1.1) halme += `M${r(x)} ${r(A[1] - H + ue - 0.3)} l${r(0.2)} ${r(1.6 + (x * 7 % 3) * 0.3)}`;
  k += `<path d="${halme}" stroke="#8a6a34" stroke-width=".45"/>`;
  for (let i = 1; i < 6; i++) { const t = i / 6; k += `<path d="M${r(F0[0] + (F1[0] - F0[0]) * t)} ${r(F1[1])} L${r(A[0] - ue + (Bq[0] - A[0] + ue * 1.6) * t)} ${r(A[1] - H + ue)}" stroke="#7d6232" stroke-width=".35" opacity=".55"/>`; }
  k += `<path d="M${r(F0[0])} ${r(F0[1])} L${r(F1[0])} ${r(F1[1])}" stroke="#6e5428" stroke-width="1.6" stroke-linecap="round"/><path d="M${r(F0[0])} ${r(F0[1] - 0.5)} L${r(F1[0])} ${r(F1[1] - 0.5)}" stroke="#f0d79c" stroke-width=".5"/>`;
  /* Dachüberstand an der Giebelseite */
  k += `<path d="M${r(F1[0])} ${r(F1[1])} L${r(Bq[0] + ue * 0.6)} ${r(Bq[1] - H + ue)} L${r(Bq[0] + ue * 0.6 + 1.6)} ${r(Bq[1] - H + ue - 0.4)} L${r(F1[0] + 1.4)} ${r(F1[1] - 0.3)} Z" fill="#7a5c2e"/>`;
  const unter = [
    { id: "strohdach", de: "das Strohdach", syl: "STROH-dach", it: "il tetto di paglia", itSyl: "TET-to di PA-glia", en: "thatched roof", x: X + 34, y: Y - H - 14, kunst: `<path d="M-38 17 L46 17 L44 -14 L-34 -14 Z" class="bw-flaeche" fill="rgba(255,255,255,0.001)"/>`,
      tipp: "Das Dach ist aus Ichu, einem harten Gras der Anden. Es wird mit Seilen an Steinringen festgebunden." },
    { id: "tuer", de: "die Tür", syl: "TÜR", it: "la porta", itSyl: "POR-ta", en: "door", x: X + 48, y: Y - 9, kunst: flaeche(-5, -10, 10, 10),
      tipp: "Inka-Türen sind unten breiter als oben. So halten sie auch bei einem Erdbeben." },
  ];
  S.teil({ id: "waechterhaus", de: "das Wächterhaus", syl: "WÄCH-ter-haus", it: "la casa del guardiano", itSyl: "CA-sa del guar-DIA-no", en: "guardhouse", x: X + 40, y: Y - 20, kunst: um(X + 40, Y - 20, k),
    zoom: { x: -4, y: 182, w: 105, h: 70 }, unter,
    tipp: "Von hier oben bewachten die Inka die Wege in die Stadt. Hier entsteht das berühmte Foto von Machu Picchu." });
}

/* =====================================================================
   10 — DAS LAMA und DAS FOHLEN (weiden auf den Terrassen)
   ===================================================================== */
/* Lama von der Seite: Fußpunkt (0|0), H = Höhe bis zu den Ohrspitzen, dir = 1 schaut nach rechts */
const lama = (H, dir, fell, fleck, seed, jung = false) => {
  const u = H / 1.85, z = zufall(seed);
  const X = (v) => r(v * u * dir), Y = (v) => r(-v * u);
  let o = "";
  /* Schatten: lang nach links (Sonne rechts) und etwas nach hinten */
  o += `<path d="M${X(-0.6)} ${Y(0)} L${X(0.6)} ${Y(0)} L${r(-1.1 * u + (dir > 0 ? -0.2 : 0) * u)} ${r(-0.12 * u)} L${r(-2.1 * u)} ${r(-0.14 * u)} Z" fill="#253a18" opacity=".32"/>`;
  /* ferne Beine (dunkler) */
  const bein = (x, dx, c) => `<path d="M${X(x - 0.05)} ${Y(0.82)} L${X(x - 0.04)} ${Y(0.4)} L${X(x - 0.03 + dx)} ${Y(0.03)} L${X(x + 0.06 + dx)} ${Y(0)} L${X(x + 0.05 + dx)} ${Y(0.06)} L${X(x + 0.05)} ${Y(0.42)} L${X(x + 0.07)} ${Y(0.82)} Z" fill="${c}"/>`;
  o += bein(-0.38, 0.04, "#7d6650") + bein(0.34, -0.03, "#7d6650");
  /* Körper mit wolligem Rand */
  const koerper = [];
  for (let i = 0; i <= 14; i++) { const t = i / 14, a = Math.PI * (1 + t); const wolle = i % 2 ? 0.035 : 0; koerper.push([0.0 + Math.cos(a) * (0.62 + wolle), 0.98 + Math.sin(a) * -(0.22 + wolle)]); }
  for (let i = 0; i <= 10; i++) { const t = i / 10, a = Math.PI * t; koerper.push([Math.cos(a) * 0.6, 0.98 - Math.sin(a) * 0.2 * -1 - 0.0]); }
  const kp = [[-0.62, 0.98], [-0.6, 1.1], [-0.5, 1.18], [-0.3, 1.2], [-0.05, 1.19], [0.2, 1.2], [0.42, 1.22], [0.56, 1.16], [0.62, 1.02], [0.58, 0.86], [0.44, 0.78], [0.2, 0.76], [-0.1, 0.77], [-0.38, 0.78], [-0.56, 0.84]];
  const kd = glatt(kp.map(([a, b]) => [a * u * dir, -b * u]), true, 0.9);
  o += `<path d="${kd}" fill="${fell}"/>`;
  if (fleck) o += `<path d="M${X(-0.1)} ${Y(1.19)} Q${X(0.25)} ${Y(1.25)} ${X(0.42)} ${Y(1.2)} Q${X(0.5)} ${Y(0.95)} ${X(0.2)} ${Y(0.86)} Q${X(-0.05)} ${Y(0.95)} ${X(-0.1)} ${Y(1.19)} Z" fill="${fleck}"/>`;
  /* Wollbüschel */
  let wo = "";
  for (let i = 0; i < 9; i++) { const x = -0.5 + i * 0.12, y = 1.18 - (i % 3) * 0.12 - z() * 0.08; wo += `M${X(x)} ${Y(y)} q${r(0.05 * u * dir)} ${r(0.06 * u)} ${r(0.1 * u * dir)} 0`; }
  o += `<path d="${wo}" stroke="#fff" stroke-width="${r(0.03 * u)}" fill="none" opacity=".45"/>`;
  /* nahe Beine */
  o += bein(-0.3, -0.05, fell) + bein(0.42, 0.05, fell);
  o += `<path d="M${X(-0.3)} ${Y(0.03)} h${X(0.12)} M${X(0.42)} ${Y(0.03)} h${X(0.12)}" stroke="#3d3026" stroke-width="${r(0.05 * u)}"/>`;
  /* Schwanz */
  o += `<path d="M${X(-0.6)} ${Y(1.12)} q${X(-0.12)} ${Y(-0.02)} ${X(-0.1)} ${Y(-0.18)} q${X(0.06)} ${Y(0.06)} ${X(0.1)} ${Y(0.12)} Z" fill="${fell}"/>`;
  /* Hals und Kopf */
  const hals = jung ? [[0.4, 1.1], [0.46, 1.38], [0.5, 1.52], [0.62, 1.52], [0.6, 1.32], [0.58, 1.06]] : [[0.38, 1.12], [0.44, 1.46], [0.48, 1.62], [0.62, 1.62], [0.6, 1.4], [0.6, 1.08]];
  o += `<path d="${glatt(hals.map(([a, b]) => [a * u * dir, -b * u]), true, 0.8)}" fill="${fell}"/>`;
  const ko = jung ? 1.5 : 1.6;
  o += `<path d="${glatt([[0.46, ko + 0.02], [0.52, ko + 0.12], [0.62, ko + 0.12], [0.74, ko + 0.06], [0.8, ko - 0.02], [0.76, ko - 0.06], [0.6, ko - 0.06]].map(([a, b]) => [a * u * dir, -b * u]), true, 0.8)}" fill="${fell}"/>`;
  /* Bananenohren */
  for (const [ox, kr] of [[0.5, -0.03], [0.57, 0.03]]) o += `<path d="M${X(ox)} ${Y(ko + 0.1)} Q${X(ox - 0.04 + kr)} ${Y(ko + 0.24)} ${X(ox + 0.02 + kr)} ${Y(ko + 0.3)} Q${X(ox + 0.06)} ${Y(ko + 0.2)} ${X(ox + 0.05)} ${Y(ko + 0.1)} Z" fill="${fell}"/>`;
  o += `<circle cx="${X(0.62)}" cy="${Y(ko + 0.04)}" r="${r(0.025 * u)}" fill="#1d1712"/><path d="M${X(0.78)} ${Y(ko)} l${X(0.02)} ${Y(-0.03)}" stroke="#3a2e26" stroke-width="${r(0.02 * u)}"/>`;
  return o;
};
{
  /* großes Lama auf der dritten Stufe, schaut nach rechts zu uns ins Tal */
  const t = TERR[3], x = 174, y = profilY(t.oben, 174) - 0.6;
  const k = `<g filter="${VOL_FIGUR}">${lama(30, 1, S.lg("lamafell", [[0, "#f6f1e6"], [1, "#d8cdb9"]], 0, 0, 1, 0), "#9b6a3c", 5)}</g>`;
  S.teil({ id: "lama", de: "das Lama", syl: "LA-ma", it: "il lama", itSyl: "LA-ma", en: "llama", x, y, steht: true, kunst: k,
    tipp: "Lamas tragen Lasten und geben Wolle. Hier halten sie das Gras auf den Terrassen kurz." });
  const x2 = 204, y2 = profilY(t.oben, 204) - 0.4;
  const k2 = `<g filter="${VOL_FIGUR}">${lama(18, -1, S.lg("fohlenfell", [[0, "#b98b5c"], [1, "#8d6440"]], 0, 0, 1, 0), "#f2ebdc", 6, true)}</g>`;
  S.teil({ id: "fohlen", de: "das Fohlen", syl: "FOH-len", it: "il piccolo di lama", itSyl: "PIC-co-lo di LA-ma", en: "baby llama", x: x2, y: y2, steht: true, kunst: k2,
    tipp: "Ein junges Lama heißt Fohlen. Es bleibt fast ein Jahr bei seiner Mutter." });
}

/* --- vorläufig: Rest folgt --- */


const silben = (t) => { if (!t) return t; const st = t.split(/([- ])/); const gross = (x) => x.length && x === x.toUpperCase() && x !== x.toLowerCase(); const lang = st.some((x) => gross(x) && x.length > 1); return st.map((x) => (/^[- ]$/.test(x) ? x : (gross(x) && (x.length > 1 || !lang || /[À-ÖÙ-Ý]/.test(x)) ? x : x.toLowerCase()))).join(""); };
for (const t of S.teile) for (const u of [t, ...(t.unter || [])]) { u.syl = silben(u.syl); u.itSyl = silben(u.itSyl); }
const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/peru.js"));
console.log(aus);
