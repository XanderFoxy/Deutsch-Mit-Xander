#!/usr/bin/env node
/* =====================================================================
   HANNOVER (FASSUNG 854) — Bilderwelt neu: eine echte Stadtansicht
   ---------------------------------------------------------------------
   RECHERCHE (aus Fachwissen, die Websuche war in dieser Sitzung
   aufgebraucht — Unsicheres ist mit „(unsicher)“ markiert):
   - MOTIV: Das Neue Rathaus über dem Maschteich ist das Postkartenbild
     Hannovers (stärker als die Herrenhäuser Gärten, die 5 km entfernt
     liegen). STANDORT: das Südufer des Maschteichs im Maschpark, Blick
     genau nach NORDEN auf die Gartenseite (Südfront) des Rathauses, die
     sich im Wasser spiegelt. Links (Westen) und rechts (Osten) die alten
     Bäume des Maschparks; der Maschsee liegt hinter uns (Süden).
   - NEUES RATHAUS (1901–1913, Hermann Eggert, ab 1909 Gustav Halmhuber;
     am 20. Juni 1913 in Gegenwart Kaiser Wilhelms II. eingeweiht): ein
     „Rathausschloss“ des Historismus aus hellem Sandstein mit grünen
     Kupferdächern, gegründet auf 6026 Buchenholzpfählen. Die Gartenseite
     ist symmetrisch: Eckpavillons mit hohen Walmdächern und Laternen,
     lange Flügel mit gequadertem Sockel, Gurtgesimsen, paarweise
     gruppierten Fenstern mit Verdachungen und Zwerchhäusern, in der
     Mitte ein vortretender Mittelbau mit Bogenhalle, Balkon, hohen
     Maßwerkfenstern und Ziergiebel mit dem Stadtwappen (Einzelheiten,
     Terrasse und Treppe zum Wasser aus dem Gedächtnis, unsicher; eine
     Uhr kenne ich auf dieser Seite nicht, darum das Wappen). Der
     Haupteingang liegt auf der Nordseite am Trammplatz. Länge rund
     120 m (unsicher ±10 %).
   - KUPPEL: 97,73 m hoch, über der Mittelhalle (etwa 45 m hinter der
     Südfront): hoher Tambour mit Bogenfenstern zwischen Säulen, vier
     Ecktürmchen, die steile grüne Kupferkuppel mit Rippen und
     Ochsenaugen in Kupfergauben, oben die Laterne mit der
     AUSSICHTSPLATTFORM und der Spitze. Im Inneren fährt der BOGENAUFZUG
     (weltweit einzigartig) schräg, bis 17° geneigt, der Wölbung nach
     oben — von außen nicht zu sehen (steht im Tipp).
   - MASCHTEICH und MASCHPARK: der Teich liegt südlich vor dem Rathaus,
     ringsum alte Buchen, Linden und Rosskastanien; Stockenten, Schwäne.
   - TYPISCHES: der LEIBNIZ-BUTTERKEKS (Bahlsen, Hannover, seit 1891,
     52 Zähne), die LÜTTJE LAGE (ein Glas dunkles Bier und ein Korn,
     gleichzeitig aus einer Hand getrunken — gehört zum Schützenfest, dem
     größten der Welt; als Lernwort mit Alkohol — Frage an Xander offen),
     eine POSTKARTE mit den NANAS von Niki de Saint Phalle am Leibnizufer
     (1974; die Figuren selbst stehen an der Leine, von hier nicht zu
     sehen), Rosskastanien im Oktober.
   Licht: Anfang Oktober, Nachmittag, die Sonne steht im Südwesten (links
   hinter uns, ≈ 25° hoch): die Südfront hell, rechte Kanten und die
   Unterseiten der Gesimse im Schatten; Schlagschatten fallen nach rechts
   hinten (Nordosten), etwa 1,5-mal so lang wie das Ding hoch ist.
   Maßstab: Kamera 1,6 m über dem Weg (Weg 0,8 m über dem Wasser), Blick
   nach Norden, Brennweite 280, Horizont y = 156. Südfront 150 m entfernt
   (1,87 Einheiten je Meter), Kuppel 195 m (1,44 je Meter), vorn in 6 m
   47 je Meter. Näher als 5,3 m sieht man den Boden nicht mehr (Bildrand),
   darum liegt die Decke dort.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const BR = 320, HO = 240;
const S = neueSzene({ id: "hannover", titel: "Hannover", emoji: "🌳", thema: "Deutschland", kuerzel: "han", fassung: 854, breite: BR, hoehe: HO });
const rnd = zufall(1913);
const r = B.r;
const t2 = (n) => (+n).toFixed(2);
{ const lg = S.lg, rg = S.rg, da = {};
  S.lg = (n, ...a) => da["l" + n] || (da["l" + n] = lg(n, ...a));
  S.rg = (n, ...a) => da["r" + n] || (da["r" + n] = rg(n, ...a)); }

/* ---------- Kamera (Meter: x Ost, y Nord, z Höhe über dem Weg) ---------- */
const CY = -150, AUGE = 1.6, HOR = 156, FOK = 280, WASSER = -0.8;
const tief = (y) => y - CY;
const pr = (x, y, z) => [160 + FOK * x / tief(y), HOR - FOK * (z - AUGE) / tief(y)];
const mass = (y) => FOK / tief(y);
const P = (p) => `${r(p[0])} ${r(p[1])}`;
const poly = (pts) => "M" + pts.map((p) => P(pr(p[0], p[1], p[2]))).join(" L") + " Z";
const pfad = (d, f, extra = "") => d ? `<path d="${d}" fill="${f}"${extra}/>` : "";
/* senkrechte Ebene y = Y (Fassade): Punkte (x, z) */
const fe = (Y, pts) => "M" + pts.map(([x, z]) => P(pr(x, Y, z))).join(" L") + " Z";
const fr = (Y, x0, z0, x1, z1) => fe(Y, [[x0, z0], [x1, z0], [x1, z1], [x0, z1]]);
const fl = (Y, pts) => "M" + pts.map(([x, z]) => P(pr(x, Y, z))).join(" L");
const bogen = (xm, w, z0, zK, n = 8) => { const p = [[xm - w / 2, z0]]; for (let i = 0; i <= n; i++) { const a = Math.PI * (1 - i / n); p.push([xm + Math.cos(a) * w / 2, zK + Math.sin(a) * w / 2]); } p.push([xm + w / 2, z0]); return p; };
/* Spiegelachse für die Front (150 m): y + y' = 2 · (HOR + FOK · (AUGE − WASSER) / 150) */
const SPIEGEL = 2 * (HOR + FOK * (AUGE - WASSER) / 150);
/* Schlagschatten eines Dings der Höhe h am Boden (Sonne Südwest, 25° hoch): nach Nordost, 1,5 h lang */
const bodenSchatten = (x, y, b, h, a = .3) => pfad(poly([[x - b / 2, y, 0], [x + b / 2, y, 0], [x + b / 2 + h * 1.06, y + h * 1.06, 0], [x - b / 2 + h * 1.06, y + h * 1.06, 0]]), "#2a3418", ` opacity="${a}"`);
/* Anker: ein Teil mit Zeichnung in Bildkoordinaten, aber Wort-Anker an einer sinnvollen Stelle */
const anker = (x, y, kunst) => ({ x, y, kunst: `<g transform="translate(${t2(-x)} ${t2(-y)})">${kunst}</g>` });

S.def(`<filter id="bw_weich" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("spiegel")}" color-interpolation-filters="sRGB" x="-5%" y="-10%" width="110%" height="120%"><feGaussianBlur stdDeviation=".7 .35"/></filter>`);
S.def(`<filter id="${S.id("luft")}" color-interpolation-filters="sRGB"><feFlood flood-color="#c3d4e4" flood-opacity=".14" result="f"/><feComposite in="f" in2="SourceGraphic" operator="in" result="t"/><feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="t"/></feMerge></filter>`);
const LUFT = `filter="url(#${S.id("luft")})"`;

const STEIN = S.lg("stein", [[0, "#f4ecda"], [1, "#e2d7bf"]]);           // heller Sandstein in der Sonne
const STEIN_D = S.lg("steind", [[0, "#c2b69c"], [1, "#a99d84"]]);         // Schattenseiten
const KUPFER = S.lg("kupfer", [[0, "#6aa690"], [0.5, "#78b29b"], [1, "#5a917c"]], 0, 0, 1, 0);
const KUPFER_D = S.lg("kupferd", [[0, "#4a7f6d"], [1, "#3f6e5e"]], 0, 0, 1, 0);
const GLAS = S.lg("glas", [[0, "#a7bccd"], [0.45, "#4a5a68"], [1, "#2e3842"]]);
const GOLD = S.lg("gold", [[0, "#fff2b0"], [0.45, "#e2b850"], [1, "#9a7322"]], 0, 0, 1, 0);
const SCHATTEN = "#5d523e";

/* =====================================================================
   KULISSE — Himmel und Wolken
   ===================================================================== */
S.hinten(`<rect width="${BR}" height="${HOR + 6}" fill="${S.lg("himmel", [[0, "#4278bb"], [0.55, "#8ab3da"], [0.9, "#d0e0ec"], [1, "#e9ede8"]])}"/>`);
S.hinten(`<rect width="${BR}" height="${HOR + 6}" fill="${S.lg("sonnenseite", [[0, "#fff1cc", 0.3], [0.4, "#fff1cc", 0], [1, "#fff1cc", 0]], 0, 0, 1, 0)}"/>`);
{
  const WB = S.rg("wolkenball", [[0, "#ffffff"], [0.55, "#f7f9fb"], [1, "#d3dce6"]], 0.38, 0.3, 0.75);
  const wolke = (x, y, w, h, n, seed) => {
    const z = zufall(seed);
    let g = `<path d="M${r(x - w / 2 - h * .2)} ${r(y)} H${r(x + w / 2 + h * .2)} Q${r(x + w / 2)} ${r(y + h * .3)} ${r(x + w * .25)} ${r(y + h * .3)} H${r(x - w * .25)} Q${r(x - w / 2)} ${r(y + h * .3)} ${r(x - w / 2 - h * .2)} ${r(y)} Z" fill="#c4cfda"/>`;
    for (let i = 0; i < n; i++) { const t = i / (n - 1), cx = x - w / 2 + t * w, rr = h * (.35 + .65 * Math.sin(Math.PI * (.15 + .7 * t))) * (.75 + z() * .4); g += `<circle cx="${r(cx)}" cy="${r(y - rr * .5)}" r="${r(rr)}" fill="${WB}"/>`; }
    for (let i = 0; i < n - 2; i++) { const t = (i + .5) / (n - 1), cx = x - w / 2 + t * w + w * .05, rr = h * .5 * (.7 + z() * .4); g += `<circle cx="${r(cx)}" cy="${r(y - h * .9 - rr * .2)}" r="${r(rr)}" fill="${WB}"/>`; }
    return g;
  };
  S.hinten(wolke(50, 32, 50, 11, 6, 2) + wolke(262, 28, 40, 9, 5, 9));
}

/* =====================================================================
   1 — DER MASCHPARK (alte Bäume links und rechts, Rasen am Nordufer)
   ===================================================================== */
/* Himmel in Bildkoordinaten: Lücken im Laub zeigen genau die Himmelsfarbe ihrer Höhe */
S.def(`<linearGradient id="${S.id("himmelU")}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="${HOR + 6}"><stop offset="0" stop-color="#4278bb"/><stop offset=".55" stop-color="#8ab3da"/><stop offset=".9" stop-color="#d0e0ec"/><stop offset="1" stop-color="#e9ede8"/></linearGradient>`);
const HIMMEL_U = `url(#${S.id("himmelU")})`;
/* unregelmäßige Lücke im Laub (gezackt, vom Laub umrandet) */
const luecke = (x, y, w, h, seed) => { const z = zufall(seed); let d = ""; for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5, f = i % 2 ? .55 + z() * .2 : .9 + z() * .25; d += (i ? " L" : "M") + `${r(x + Math.cos(a) * w * f)} ${r(y + Math.sin(a) * h * f)}`; } return `<path d="${d} Z" fill="${HIMMEL_U}"/>`; };
/* weich schattierte Laubballen: Licht oben links (Sonne Südwest), Schatten unten rechts, darunter ein dunkler Kontaktschatten */
const KRONE = {
  buche: [S.rg("krBuche", [[0, "#e8ad62"], [0.45, "#b9692f"], [1, "#6a3519"]], 0.36, 0.32, 0.72), "#4e2814"],
  linde: [S.rg("krLinde", [[0, "#f6e07e"], [0.45, "#d6ab3c"], [1, "#8c6a20"]], 0.36, 0.32, 0.72), "#6a5016"],
  gruen: [S.rg("krGruen", [[0, "#d4d27c"], [0.45, "#9ea242"], [1, "#55602a"]], 0.36, 0.32, 0.72), "#3a461c"],
  orange: [S.rg("krOrange", [[0, "#f2b066"], [0.45, "#cc742f"], [1, "#7c3a18"]], 0.36, 0.32, 0.72), "#562812"],
};
/* Krone als Ellipse (rx, ry) aus Ballen; Ballen bleiben im Bild */
const baumKrone = (cx, cy, rx, ry, fam, seed, herz) => {
  const z = zufall(seed), [F, D] = KRONE[fam];
  const lap = [];
  for (let i = 0; i < 11; i++) { const a = -Math.PI / 2 + i * Math.PI * 2 / 11 + (z() - .5) * .3; let ex = Math.cos(a) * .72, ey = Math.sin(a) * .74; if (herz && ey < -.4) ex *= 1 + (Math.abs(ex) > .2 ? .25 : -.4); const rr = Math.min(rx, ry) * (.34 + z() * .12); lap.push([cx + ex * (rx - rr * .6), cy + ey * (ry - rr * .6), rr]); }
  for (let i = 0; i < 4; i++) lap.push([cx + (z() - .5) * rx * .7, cy + (z() - .5) * ry * .7, Math.min(rx, ry) * (.38 + z() * .1)]);
  lap.sort((p, q) => p[1] - q[1]);
  const ok = (x, rr) => Math.min(rr, x + 1, BR + 1 - x);
  let g = "";
  for (const [x, y, rr] of lap) { const q = ok(x + rr * .12, rr); if (q > .8) g += `<circle cx="${r(x + rr * .12)}" cy="${r(y + rr * .14)}" r="${r(q)}" fill="${D}"/>`; }
  for (const [x, y, rr] of lap) { const q = ok(x, rr * .96); if (q > .8) g += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(q)}" fill="${F}"/>`; }
  return g;
};
{
  let k = "";
  k += `<rect x="0" y="${r(pr(0, -2, 0)[1])}" width="${BR}" height="${r(pr(0, -24, 0)[1] - pr(0, -2, 0)[1] + .5)}" fill="${S.lg("rasenfern", [[0, "#7f9a50"], [1, "#94a85e"]])}"/>`;
  /* [x, y, Höhe m, Kronenbreite m, Art, Saat, herzförmig] — die Krone bleibt neben dem Rathaus (es steht weiter hinten) */
  const baum = (x, y, h, b, fam, seed, herz, luecken) => {
    const p = pr(x, y, 0), m = mass(y), ry = h * .36 * m, rx = Math.min(b * m / 2, x < 0 ? 47 - p[0] : p[0] - 272), cy = p[1] - h * .62 * m;
    const st = "#4a3a2c";
    let g = `<path d="M${r(p[0] - .55 * m)} ${r(p[1])} Q${r(p[0] - .3 * m)} ${r(p[1] - 2 * m)} ${r(p[0] - .35 * m)} ${r(cy + ry * .3)} L${r(p[0] + .35 * m)} ${r(cy + ry * .3)} Q${r(p[0] + .3 * m)} ${r(p[1] - 2 * m)} ${r(p[0] + .55 * m)} ${r(p[1])} Z" fill="${st}"/>`;
    g += baumKrone(p[0], cy, rx, ry, fam, seed, herz);
    /* echte Lücken im Laub, durch die man Himmel und zwei Äste sieht */
    const zz = zufall(seed + 50);
    for (const [u, v, s] of luecken) { const lx = p[0] + u * rx, ly = cy + v * ry; g += luecke(lx, ly, rx * .16 * s, ry * .1 * s, seed + u * 10); g += `<path d="M${r(lx - rx * .2 * s)} ${r(ly + ry * .14 * s)} Q${r(lx)} ${r(ly - ry * .02)} ${r(lx + rx * .22 * s)} ${r(ly - ry * .12 * s + zz())}" stroke="${st}" stroke-width="${r(.22 * m)}" fill="none" stroke-linecap="round"/>`; }
    return g;
  };
  for (const t of [[-74, -12, 30, 15, "buche", 3, false, [[.35, -.15, 1]]], [-52, -44, 33, 16, "linde", 5, true, [[-.25, .05, 1.1], [.3, -.35, .8]]], [64, -6, 34, 16, "gruen", 4, false, [[-.3, .1, 1]]], [56, -40, 31, 15, "orange", 9, false, []]]) k += baum(...t);
  const A = anker(18, 150, `<g ${LUFT}>${k}</g>`);
  S.teil({ id: "maschpark", de: "der Maschpark", syl: "MASCH-park", it: "il parco Masch", itSyl: "PAR-co MASCH", en: "Maschpark", x: A.x, y: A.y, kunst: A.kunst,
    tipp: "Der ganze Park um den Teich heißt Maschpark. Hannover ist eine der grünsten Großstädte Deutschlands." });
}

/* =====================================================================
   2 — DIE KUPPEL (97,73 m) — Lupe: Aussichtsplattform, Turmspitze,
       Eckturm
   ===================================================================== */
const KU = { y: 45, top: 97.7 };
const kuTeile = {};
{
  let k = "";
  const Y = KU.y - 14;
  const m = mass(Y);
  const tuerm = (xm) => {
    const Yt = Y - 4, mt = mass(Yt);
    let g = pfad(fr(Yt, xm - 2.2, 30, xm + 2.2, 50), STEIN) + pfad(fr(Yt, xm + 1.1, 30, xm + 2.2, 50), STEIN_D);
    for (const z of [36, 43]) g += pfad(fe(Yt, bogen(xm, 1.6, z - .3, z + 3.6, 6)), "#e9dfc9") + pfad(fe(Yt, bogen(xm, 1.2, z, z + 3.6, 6)), "#3b4048");
    g += pfad(fr(Yt, xm - 2.6, 50, xm + 2.6, 51), "#cfc4ac") + pfad(fr(Yt, xm - 2.6, 49.6, xm + 2.6, 50), SCHATTEN, ` opacity=".5"`);
    const c = pr(xm, Yt, 51);
    g += `<path d="M${r(c[0] - 2.4 * mt)} ${r(c[1])} Q${r(c[0] - 2.2 * mt)} ${r(c[1] - 3.4 * mt)} ${r(c[0])} ${r(c[1] - 4.6 * mt)} Q${r(c[0] + 2.2 * mt)} ${r(c[1] - 3.4 * mt)} ${r(c[0] + 2.4 * mt)} ${r(c[1])} Z" fill="${KUPFER}"/><path d="M${r(c[0] + .4 * mt)} ${r(c[1] - 4.4 * mt)} Q${r(c[0] + 2.1 * mt)} ${r(c[1] - 3.2 * mt)} ${r(c[0] + 2.3 * mt)} ${r(c[1])} L${r(c[0] + 1.2 * mt)} ${r(c[1])} Z" fill="${KUPFER_D}"/>`;
    g += `<path d="M${r(c[0])} ${r(c[1] - 4.6 * mt)} V${r(c[1] - 6.8 * mt)}" stroke="#3f6e5e" stroke-width=".4"/><circle cx="${r(c[0])}" cy="${r(c[1] - 5.4 * mt)}" r=".4" fill="${GOLD}"/>`;
    return g;
  };
  k += tuerm(-17) + tuerm(17);
  /* Tambour: Säulenpaare zwischen hohen Bogenfenstern, Balustrade oben */
  k += pfad(fr(Y, -14, 30, 14, 56), S.lg("tambour", [[0, "#f3ead6"], [0.6, "#e2d7bf"], [1, "#b2a68c"]], 0, 0, 1, 0));
  for (const xm of [-9.6, -3.2, 3.2, 9.6]) {
    const w = 2.8 * (1 - Math.abs(xm) / 30);
    k += pfad(fe(Y, bogen(xm, w + .9, 39.4, 46.6, 6)), "#d6caae") + pfad(fe(Y, bogen(xm, w, 40, 46.6, 6)), GLAS);
    k += pfad(fr(Y, xm - .08, 40, xm + .08, 47.6), "#e7ddc6");
  }
  for (const xm of [-12.8, -6.4, 0, 6.4, 12.8]) for (const d of [-.55, .55]) {
    const x = xm + d * (1 - Math.abs(xm) / 30);
    k += pfad(fr(Y, x - .3, 38, x + .3, 50.6), xm > 6 ? "#c4b89e" : "#fbf5e8") + pfad(fr(Y, x + .12, 38, x + .3, 50.6), "#b8ac92", ` opacity=".7"`);
    k += pfad(fr(Y, x - .42, 50.6, x + .42, 51.2), "#efe6d2");
  }
  k += pfad(fr(Y, -14.4, 51, 14.4, 53), "#e2d7bf") + pfad(fr(Y, -14.4, 50.7, 14.4, 51), SCHATTEN, ` opacity=".55"`) + pfad(fr(Y, -14.4, 53, 14.4, 53.6), "#b9ad93");
  k += pfad(fr(Y, -13.6, 53.6, 13.6, 55.6), "#ece3cf");
  { let d = ""; for (let x = -13; x <= 13; x += .8) d += `M${P(pr(x, Y, 53.8))} L${P(pr(x, Y, 55.2))} `; k += `<path d="${d}" stroke="#a99d84" stroke-width=".32"/>`; }
  k += pfad(fr(Y, -13.8, 55.6, 13.8, 56.1), "#f6efe0");
  /* die Kuppel: steile Kupferschale, Rippen, Ochsenaugen in Kupfergauben mit Rahmen und Lichtkante */
  const prof = [[13.2, 56], [13.3, 60], [12.8, 65], [11.6, 70], [9.6, 75], [7, 79.6], [4.4, 83], [2.6, 85]];
  const kd = "M" + prof.map(([x, z]) => P(pr(-x, Y + 2, z))).join(" L") + " L" + prof.slice().reverse().map(([x, z]) => P(pr(x, Y + 2, z))).join(" L") + " Z";
  k += pfad(kd, S.lg("kuppel", [[0, "#8cc6ae"], [0.4, "#6fab94"], [0.8, "#4f8a75"], [1, "#3e6f5f"]], 0, 0, 1, 0));
  for (const f of [-0.82, -0.55, -0.27, 0, 0.27, 0.55, 0.82]) {
    const pts = prof.map(([x, z]) => P(pr(x * f, Y + 2, z)));
    k += `<path d="M${pts.join(" L")}" stroke="${f > 0.4 ? "#3d6b5c" : "#b6e2cf"}" stroke-width="${Math.abs(f) > .7 ? .45 : .65}" fill="none"/>`;
  }
  const OG = S.lg("ochsenglas", [[0, "#8aa4b8"], [1, "#4a5866"]]);
  for (const [z, n, xr, gr] of [[62.4, 5, 12.4, 1], [72, 3, 9, .75]]) for (let i = 0; i < n; i++) {
    const f = (i - (n - 1) / 2) / ((n - 1) / 2) * .62, c = pr(f * xr, Y + 2, z), rr = (1 - Math.abs(f) * .45) * .9 * m * gr;
    k += `<path d="M${r(c[0] - rr * 1.5)} ${r(c[1] + rr * 1.2)} L${r(c[0] - rr * 1.5)} ${r(c[1] - rr * .3)} Q${r(c[0] - rr * 1.5)} ${r(c[1] - rr * 2.3)} ${r(c[0])} ${r(c[1] - rr * 2.4)} L${r(c[0])} ${r(c[1] + rr * 1.2)} Z" fill="#82bca4"/><path d="M${r(c[0])} ${r(c[1] + rr * 1.2)} L${r(c[0])} ${r(c[1] - rr * 2.4)} Q${r(c[0] + rr * 1.5)} ${r(c[1] - rr * 2.3)} ${r(c[0] + rr * 1.5)} ${r(c[1] - rr * .3)} L${r(c[0] + rr * 1.5)} ${r(c[1] + rr * 1.2)} Z" fill="#5a917c"/>`;
    k += `<ellipse cx="${r(c[0])}" cy="${r(c[1])}" rx="${r(rr * .95)}" ry="${r(rr * 1.2)}" fill="#3f6e5e"/><ellipse cx="${r(c[0])}" cy="${r(c[1])}" rx="${r(rr * .72)}" ry="${r(rr * .95)}" fill="${OG}"/>`;
  }
  /* Laterne mit der Aussichtsplattform: Boden mit Schattenkante, Geländer mit Pfosten, Menschen */
  const L0 = 85;
  k += pfad(fr(Y + 2, -3.8, L0, 3.8, L0 + .7), "#e2d7bf") + pfad(fr(Y + 2, -3.6, L0 - .5, 3.6, L0), SCHATTEN, ` opacity=".6"`);
  k += pfad(fr(Y + 2, -2.4, L0 + .7, 2.4, L0 + 5), "#efe6d2") + pfad(fr(Y + 2, 1.2, L0 + .7, 2.4, L0 + 5), "#c2b69c");
  for (const x of [-1.5, 0, 1.5]) k += pfad(fe(Y + 2, bogen(x, .8, L0 + 1.4, L0 + 3.8, 4)), "#3b4048");
  for (const [x, c] of [[-3.1, "#c0392b"], [3, "#2f5f95"], [-2.2, "#e8c23a"]]) { const p = pr(x, Y + 1.6, L0 + .7); k += `<rect x="${r(p[0] - .26)}" y="${r(p[1] - 1.9)}" width=".52" height="1.4" fill="${c}"/><circle cx="${r(p[0])}" cy="${r(p[1] - 2.1)}" r=".3" fill="#e2b48e"/>`; }
  { let d = ""; for (let x = -3.6; x <= 3.61; x += .6) d += `M${P(pr(x, Y + 1.4, L0 + .7))} L${P(pr(x, Y + 1.4, L0 + 1.9))} `; k += `<path d="${d} M${P(pr(-3.7, Y + 1.4, L0 + 1.9))} L${P(pr(3.7, Y + 1.4, L0 + 1.9))}" stroke="#26302c" stroke-width=".3"/>`; }
  const hb = pr(0, Y + 2, L0 + 5), hm = mass(Y + 2);
  k += `<path d="M${r(hb[0] - 2.8 * hm)} ${r(hb[1])} Q${r(hb[0] - 2.4 * hm)} ${r(hb[1] - 2.6 * hm)} ${r(hb[0])} ${r(hb[1] - 3.4 * hm)} Q${r(hb[0] + 2.4 * hm)} ${r(hb[1] - 2.6 * hm)} ${r(hb[0] + 2.8 * hm)} ${r(hb[1])} Z" fill="${KUPFER}"/>`;
  const sp = pr(0, Y + 2, KU.top);
  k += `<path d="M${r(hb[0] - .5 * hm)} ${r(hb[1] - 3.2 * hm)} L${r(sp[0])} ${r(sp[1])} L${r(hb[0] + .5 * hm)} ${r(hb[1] - 3.2 * hm)} Z" fill="#3f6e5e"/><circle cx="${r(hb[0])}" cy="${r(hb[1] - 4.4 * hm)}" r="${r(.7 * hm)}" fill="${GOLD}"/>`;
  kuTeile.platt = pr(0, Y + 2, L0 + 1.5); kuTeile.spitze = pr(0, Y + 2, 93); kuTeile.turm = pr(-17, Y - 4, 48);
  const zh = r(kuTeile.turm[1] - sp[1] + 16), zw = r(zh * 1.5), zx = sp[0];
  S.teil({ id: "kuppel", de: "die Kuppel", syl: "KUP-pel", it: "la cupola", itSyl: "CU-po-la", en: "dome", x: 0, y: 0, kunst: k,
    tipp: "Die Kuppel ist fast 100 Meter hoch. Innen fährt ein schräger Aufzug im Bogen nach oben — so einen gibt es nur hier.",
    zoom: { x: r(zx - zw / 2), y: r(sp[1] - 3), w: zw, h: zh },
    unter: [
      { id: "aussichtsplattform", de: "die Aussichtsplattform", syl: "AUS-sichts-platt-form", it: "la terrazza panoramica", itSyl: "ter-RAZ-za pa-no-RA-mi-ca", en: "viewing platform", x: kuTeile.platt[0], y: kuTeile.platt[1], kunst: flaeche(-7.5, -6, 15, 8),
        tipp: "Von der Plattform oben auf der Kuppel sieht man bei klarem Wetter bis zum Harz." },
      { id: "turmspitze", de: "die Turmspitze", syl: "TURM-spit-ze", it: "la guglia", itSyl: "GU-glia", en: "spire", x: kuTeile.spitze[0], y: kuTeile.spitze[1], kunst: flaeche(-3, -8, 6, 9),
        tipp: "Ganz oben auf der kleinen Laterne über der Kuppel sitzt die Turmspitze." },
      { id: "eckturm", de: "der Eckturm", syl: "ECK-turm", it: "la torretta", itSyl: "tor-RET-ta", en: "corner turret", x: kuTeile.turm[0], y: kuTeile.turm[1], kunst: flaeche(-4.4, -9, 8.8, 14),
        tipp: "Vier kleine Türme stehen an den Ecken um die große Kuppel." },
    ] });
}

/* =====================================================================
   3 — DAS NEUE RATHAUS (Gartenseite) — Lupe: Portal, Balkon, Fenster
   ===================================================================== */
const rhTeile = {};
{
  let dach = "", f = "";
  const Wy = 0, My = -4, Py = -3;           // Flügel, Mittelbau, Eckpavillons
  /* Fenster mit Laibung (Schatten innen links oben), Rahmen und Verdachung in drei Arten */
  const fenster = (Y, xm, z0, z1, w, art) => {
    let g = pfad(fr(Y, xm - w / 2 - .3, z0 - .35, xm + w / 2 + .3, z1 + .3), "#ece2cb");
    g += art === "bogen" ? pfad(fe(Y, bogen(xm, w, z0, z1 - w / 2, 6)), GLAS) : pfad(fr(Y, xm - w / 2, z0, xm + w / 2, z1), GLAS);
    g += pfad(fr(Y, xm - w / 2, z1 - (art === "bogen" ? w / 2 : 0) - .25, xm + w / 2, z1 - (art === "bogen" ? w / 2 : 0)), "#1d2228", ` opacity=".4"`);
    g += pfad(fr(Y, xm - w / 2, z0, xm - w / 2 + .18, z1 - (art === "bogen" ? w / 2 : 0)), "#1d2228", ` opacity=".35"`);
    g += `<path d="${fl(Y, [[xm, z0], [xm, z1 - (art === "bogen" ? w / 2 : 0)]])} ${fl(Y, [[xm - w / 2, z0 + (z1 - z0) * .62], [xm + w / 2, z0 + (z1 - z0) * .62]])}" stroke="#ece4d0" stroke-width=".22"/>`;
    if (art === "dreieck") g += pfad(fe(Y, [[xm - w / 2 - .5, z1 + .3], [xm + w / 2 + .5, z1 + .3], [xm, z1 + 1.3]]), "#efe6d2") + pfad(fr(Y, xm - w / 2 - .5, z1 + .1, xm + w / 2 + .5, z1 + .3), SCHATTEN, ` opacity=".45"`);
    else if (art === "gerade") g += pfad(fr(Y, xm - w / 2 - .45, z1 + .3, xm + w / 2 + .45, z1 + .7), "#efe6d2") + pfad(fr(Y, xm - w / 2 - .45, z1 + .15, xm + w / 2 + .45, z1 + .3), SCHATTEN, ` opacity=".45"`);
    return g;
  };
  /* Gurtgesims mit Schattenkante darunter */
  const gurt = (Y, x0, x1, z, h = .5) => pfad(fr(Y, x0, z, x1, z + h), "#efe6d2") + pfad(fr(Y, x0, z - .22, x1, z), SCHATTEN, ` opacity=".5"`);
  /* ---- Dächer ---- */
  for (const sg of [-1, 1]) {
    const a = 16 * sg, b = 47 * sg;
    dach += pfad(poly([[a, Wy, 22.4], [b, Wy, 22.4], [b, 9, 31], [a, 9, 31]]), KUPFER);
    dach += `<path d="${fl(9, [[a, 31], [b, 31]])}" stroke="#a6d6c2" stroke-width=".5"/>`;
    for (const [z, y, step, w, h] of [[25, 3.2, 4.2, 1.1, 1.8], [28.4, 6.2, 8.4, .9, 1.4]]) for (let x = 18.2 + (z > 26 ? 2.1 : 0); x < 46; x += step) {
      const xm = x * sg; if (Math.abs(Math.abs(x) - 27.2) < 2.6 || Math.abs(Math.abs(x) - 40.6) < 2.6) continue;
      dach += pfad(fe(y, [[xm - w, z], [xm + w, z], [xm + w, z + h], [xm, z + h + .9], [xm - w, z + h]]), "#efe6d2") + pfad(fe(y, [[xm - w - .2, z + h - .1], [xm, z + h + 1.1], [xm + w + .2, z + h - .1], [xm + w + .2, z + h + .2], [xm, z + h + 1.4], [xm - w - .2, z + h + .2]]), KUPFER_D) + pfad(fr(y, xm - w * .55, z + .2, xm + w * .55, z + h - .1), "#2e3842");
    }
  }
  dach += pfad(poly([[-16, My, 26.2], [16, My, 26.2], [12, 6, 34], [-12, 6, 34]]), KUPFER_D);
  for (const sg of [-1, 1]) {
    const a = 47 * sg, b = 59 * sg, m = 53 * sg;
    dach += pfad(poly([[a, Py, 25.4], [b, Py, 25.4], [m + 2 * sg, 6, 37], [m - 2 * sg, 6, 37]]), S.lg("pavdach", [[0, "#7ab59e"], [1, "#4f8a75"]], 0, 0, 1, 0));
    dach += `<path d="M${P(pr(a, Py, 25.4))} L${P(pr(m - 2 * sg, 6, 37))} M${P(pr(b, Py, 25.4))} L${P(pr(m + 2 * sg, 6, 37))}" stroke="#a6d6c2" stroke-width=".5"/>`;
    for (const z of [28.4, 32]) dach += pfad(fe(Py + (z - 25.4) * .75, [[m - .9, z], [m + .9, z], [m + .9, z + 1.5], [m, z + 2.3], [m - .9, z + 1.5]]), "#efe6d2") + pfad(fr(Py + (z - 25.4) * .75, m - .45, z + .2, m + .45, z + 1.3), "#2e3842");
    /* Laterne auf dem First: offenes Türmchen mit Kupferhaube */
    const c = pr(m, 6, 37), mm = mass(6);
    dach += `<rect x="${r(c[0] - 1.4 * mm)}" y="${r(c[1] - 3.4 * mm)}" width="${r(2.8 * mm)}" height="${r(3.4 * mm)}" fill="#efe6d2"/><rect x="${r(c[0] - .9 * mm)}" y="${r(c[1] - 2.8 * mm)}" width="${r(.7 * mm)}" height="${r(2 * mm)}" fill="#2e3842"/><rect x="${r(c[0] + .2 * mm)}" y="${r(c[1] - 2.8 * mm)}" width="${r(.7 * mm)}" height="${r(2 * mm)}" fill="#2e3842"/>`;
    dach += `<path d="M${r(c[0] - 1.8 * mm)} ${r(c[1] - 3.4 * mm)} Q${r(c[0] - 1.4 * mm)} ${r(c[1] - 6 * mm)} ${r(c[0])} ${r(c[1] - 6.8 * mm)} Q${r(c[0] + 1.4 * mm)} ${r(c[1] - 6 * mm)} ${r(c[0] + 1.8 * mm)} ${r(c[1] - 3.4 * mm)} Z" fill="${KUPFER}"/><path d="M${r(c[0])} ${r(c[1] - 6.8 * mm)} V${r(c[1] - 8.8 * mm)}" stroke="#3f6e5e" stroke-width=".4"/><circle cx="${r(c[0])}" cy="${r(c[1] - 7.6 * mm)}" r=".45" fill="${GOLD}"/>`;
  }
  /* ---- Flügel ---- */
  for (const sg of [-1, 1]) {
    const x0 = Math.min(16 * sg, 47 * sg), x1 = Math.max(16 * sg, 47 * sg);
    f += pfad(fr(Wy, x0, 0, x1, 22.4), STEIN);
    /* gequaderter Sockel */
    f += pfad(fr(Wy, x0, 0, x1, 5.2), "#ddd1b6");
    { let d = ""; for (let z = .65; z < 5.2; z += .65) d += fl(Wy, [[x0, z], [x1, z]]) + " "; for (let z = 0, i = 0; z < 5.2; z += .65, i++) for (let x = x0 + (i % 2 ? 1 : 0); x < x1; x += 2) d += fl(Wy, [[x, z], [x, z + .65]]) + " "; f += `<path d="${d}" stroke="#a99d84" stroke-width=".16" opacity=".8"/>`; }
    f += gurt(Wy, x0, x1, 5.2, .6) + gurt(Wy, x0, x1, 13.2) + gurt(Wy, x0, x1, 18.8, .4);
    /* Kranzgesims mit Zahnschnitt */
    f += pfad(fr(Wy, x0 - .2, 21.5, x1 + .2, 22.5), "#f3ebd8") + `<path d="${fl(Wy, [[x0, 21.3], [x1, 21.3]])}" stroke="${SCHATTEN}" stroke-width=".5" stroke-dasharray=".3 .35" opacity=".7"/>`;
    /* Fensterachsen paarweise, dazwischen Lisenen; Brüstungsfelder unter den Hauptfenstern */
    for (const pm of [20, 27.2, 34.4, 41.6]) {
      for (const d of [-1.55, 1.55]) {
        const xm = (pm + d) * sg;
        f += fenster(Wy, xm, 1.4, 4, 1.3, "bogen");
        f += pfad(fr(Wy, xm - .85, 6.4, xm + .85, 7.6), "#cfc3a8") + pfad(fr(Wy, xm - .6, 6.6, xm + .6, 7.4), "#e8ddc6");
        f += fenster(Wy, xm, 8.2, 12.4, 1.4, Math.abs(pm - 27.2) < 1 || Math.abs(pm - 41.6) < 1 ? "dreieck" : "gerade");
        f += fenster(Wy, xm, 14.2, 17.6, 1.3, "gerade") + fenster(Wy, xm, 19.4, 20.8, 1.1, "");
      }
      for (const d of [-3.6, 3.6]) { const xl = (pm + d) * sg; f += pfad(fr(Wy, xl - .32, 5.8, xl + .32, 21.4), "#efe6d2") + pfad(fr(Wy, xl + .14 * sg, 5.8, xl + .32 * sg, 21.4), "#c9bd9f"); }
    }
    /* zwei Zwerchhäuser je Flügel (über den Achsen mit Dreiecksgiebeln) */
    for (const pm of [27.2, 41.6]) {
      const xm = pm * sg;
      f += pfad(fe(Wy, [[xm - 3.2, 22.4], [xm + 3.2, 22.4], [xm + 3.2, 25.6], [xm + 2.2, 25.6], [xm + 2.2, 27.8], [xm + 1, 27.8], [xm, 29.6], [xm - 1, 27.8], [xm - 2.2, 27.8], [xm - 2.2, 25.6], [xm - 3.2, 25.6]]), STEIN);
      for (const s2 of [-1, 1]) f += pfad(fe(Wy, [[xm + s2 * 3.2, 25.6], [xm + s2 * 2.6, 26.4], [xm + s2 * 2.2, 27.8], [xm + s2 * 2.2, 25.6]]), "#cfc3a8");
      f += fenster(Wy, xm - 1.2, 23.1, 25.2, .9, "") + fenster(Wy, xm + 1.2, 23.1, 25.2, .9, "") + fenster(Wy, xm, 26, 27.4, .8, "bogen");
      for (const [x, z] of [[xm - 3.2, 25.6], [xm + 3.2, 25.6], [xm - 2.2, 27.8], [xm + 2.2, 27.8]]) f += pfad(fe(Wy, [[x - .22, z], [x + .22, z], [x, z + 1.6]]), "#e2d7bf");
      f += pfad(fe(Wy, [[xm - .15, 29.6], [xm + .15, 29.6], [xm, 30.8]]), "#e2d7bf");
      f += pfad(fe(Wy, [[xm + 2.2 * sg, 25.6], [xm + 3.2 * sg, 25.6], [xm + 3.2 * sg, 22.4], [xm + 2.6 * sg, 22.4]]), SCHATTEN, sg > 0 ? ` opacity=".25"` : ` opacity="0"`);
    }
  }
  /* ---- Eckpavillons ---- */
  for (const sg of [-1, 1]) {
    const a = 47 * sg, b = 59 * sg, x0 = Math.min(a, b), x1 = Math.max(a, b);
    f += pfad(poly([[a, Py, 0], [a, Wy, 0], [a, Wy, 25.4], [a, Py, 25.4]]), sg < 0 ? STEIN_D : "#efe6d2");
    f += pfad(fr(Py, x0, 0, x1, 25.4), STEIN) + pfad(fr(Py, x0, 0, x1, 5.2), "#ddd1b6");
    { let d = ""; for (let z = .65; z < 5.2; z += .65) d += fl(Py, [[x0, z], [x1, z]]) + " "; f += `<path d="${d}" stroke="#a99d84" stroke-width=".16" opacity=".8"/>`; }
    f += gurt(Py, x0, x1, 5.2, .6) + gurt(Py, x0, x1, 13.2) + gurt(Py, x0, x1, 18.8, .4);
    f += pfad(fr(Py, x0 - .3, 24.4, x1 + .3, 25.6), "#f3ebd8") + pfad(fr(Py, x0 - .3, 24.15, x1 + .3, 24.4), SCHATTEN, ` opacity=".55"`);
    for (const xm of [49.6, 53, 56.4].map((x) => x * sg)) f += fenster(Py, xm, 1.4, 4, 1.3, "bogen") + fenster(Py, xm, 8.2, 12.4, 1.6, Math.abs(xm) === 53 ? "dreieck" : "gerade") + fenster(Py, xm, 14.2, 17.6, 1.4, "gerade") + fenster(Py, xm, 19.6, 23, 1.3, "bogen");
    for (const x of [x0 + .5, x1 - .5]) f += pfad(fr(Py, x - .6, 5.8, x + .6, 24.2), "#f1e8d4") + pfad(fr(Py, x + .25, 5.8, x + .6, 24.2), "#cdbfa2");
  }
  /* ---- Mittelbau: Bogenhalle, Balkon, Maßwerkfenster, Ziergiebel mit Wappen ---- */
  {
    f += pfad(poly([[-16, My, 0], [-16, Wy, 0], [-16, Wy, 26.2], [-16, My, 26.2]]), "#efe6d2");
    f += pfad(poly([[16, My, 0], [16, Wy, 0], [16, Wy, 26.2], [16, My, 26.2]]), STEIN_D);
    f += pfad(fr(My, -16, 0, 16, 26.2), STEIN);
    for (const x of [-16, -8.2, 8.2, 16]) {
      f += pfad(fr(My, x - .7, 0, x + .7, 25), S.lg("lisene", [[0, "#ddd1b6"], [0.45, "#fbf5e8"], [1, "#c9bd9f"]], 0, 0, 1, 0));
      for (const z of [7.6, 16.2, 23.4]) f += pfad(fe(My, [[x - .75, z - .3], [x + .75, z - .3], [x + 1.15, z + .4], [x + 1.15, z + .8], [x - 1.15, z + .8], [x - 1.15, z + .4]]), "#f6efe0") + pfad(fr(My, x - 1.15, z - .55, x + 1.15, z - .3), SCHATTEN, ` opacity=".45"`);
    }
    /* Bogenhalle: profilierte Bögen, Schlusssteine, Halle innen mit Licht von links */
    for (const xm of [-4.6, 0, 4.6]) {
      f += pfad(fe(My, bogen(xm, 4.2, 0, 4, 8)), "#d9cdb2") + pfad(fe(My, bogen(xm, 3.4, 0, 4, 8)), S.lg("halle", [[0, "#6a5c4a"], [0.5, "#3f3730"], [1, "#2a2420"]], 0, 0, 1, 0));
      f += pfad(fe(My, [[xm - .35, 5.5], [xm + .35, 5.5], [xm + .25, 6.3], [xm - .25, 6.3]]), "#f6efe0");
      f += pfad(fe(My, bogen(xm, 1.4, 0, 1.5, 6)), "#5a4e40", ` opacity=".6"`);
    }
    for (const xm of [-12, 12]) f += fenster(My, xm, 1.4, 4.6, 1.8, "bogen");
    /* Balkon mit Docken, darunter Schatten */
    f += pfad(fr(My - 1.2, -7.8, 6.4, 7.8, 7), "#e2d7bf") + pfad(fr(My, -7.6, 5.7, 7.6, 6.4), SCHATTEN, ` opacity=".55"`);
    { let d = ""; for (let x = -7.4; x <= 7.41; x += .5) d += `M${P(pr(x, My - 1.2, 7))} L${P(pr(x, My - 1.2, 8.1))} `; f += `<path d="${d}" stroke="#cfc3a8" stroke-width=".3"/>`; }
    f += pfad(fr(My - 1.2, -8, 8.1, 8, 8.5), "#f3ebd8");
    rhTeile.balkon = pr(0, My, 7.6);
    /* hohe Saalfenster mit Maßwerk (zwei Bahnen und Kreis im Bogen), darüber kleinere */
    for (const xm of [-12, -4.6, 0, 4.6, 12]) {
      const w = xm === 0 ? 2.4 : 2;
      f += fenster(My, xm, 9, 15.4, w, "bogen");
      const c = pr(xm, My, 14.6), mm = mass(My);
      f += `<path d="${fl(My, [[xm - w / 4, 9], [xm - w / 4, 14.2]])} ${fl(My, [[xm + w / 4, 9], [xm + w / 4, 14.2]])}" stroke="#ece4d0" stroke-width=".22"/><circle cx="${r(c[0])}" cy="${r(c[1])}" r="${r(w * .22 * mm)}" fill="none" stroke="#ece4d0" stroke-width=".22"/>`;
      f += fenster(My, xm, 17.4, 21, 1.6, "gerade");
      f += pfad(fe(My, bogen(xm, 2, 21.8, 22.4, 6)), "#e7ddc6") + pfad(fe(My, bogen(xm, 1.4, 22, 22.4, 6)), "#cfc3a8");
      f += pfad(fr(My, xm - 1.1, 15.8, xm + 1.1, 16.9), "#cfc3a8");
    }
    f += pfad(fr(My, -16.4, 25, 16.4, 26.4), "#f3ebd8") + pfad(fr(My, -16.4, 24.75, 16.4, 25), SCHATTEN, ` opacity=".55"`);
    f += pfad(fr(My, -15.8, 23.8, 15.8, 24.6), "#ece2cb") + `<path d="${fl(My, [[-15.6, 24.2], [15.6, 24.2]])}" stroke="#a99d84" stroke-width=".35" stroke-dasharray=".5 .4" fill="none"/>`;
    /* Ziergiebel: Voluten, Fialen, zwei Figurennischen, in der Mitte das Stadtwappen (Kleeblatt, Löwe im Tor — vereinfacht) */
    const G = [[-10, 26.4], [10, 26.4], [10, 28.8], [8.6, 28.8], [7.8, 30], [6, 31.2], [6, 33.4], [4.4, 33.4], [3.6, 34.8], [1.6, 35.6], [0, 37.6], [-1.6, 35.6], [-3.6, 34.8], [-4.4, 33.4], [-6, 33.4], [-6, 31.2], [-7.8, 30], [-8.6, 28.8], [-10, 28.8]];
    f += pfad(fe(My, G), STEIN);
    f += `<path d="${fl(My, G.slice(2))}" stroke="${SCHATTEN}" stroke-width=".3" fill="none" opacity=".5"/>`;
    for (const [x, z] of [[-10, 28.8], [10, 28.8], [-6, 33.4], [6, 33.4], [-1.6, 35.6], [1.6, 35.6]]) f += pfad(fe(My, [[x - .32, z], [x + .32, z], [x + .32, z + 1], [x, z + 2.4], [x - .32, z + 1]]), "#e7ddc6");
    f += pfad(fe(My, [[-.25, 37.6], [.25, 37.6], [0, 39.8]]), "#e7ddc6");
    for (const xm of [-6.8, 6.8]) { f += pfad(fe(My, bogen(xm, 1.4, 27, 29.4, 6)), "#9a8e74"); const c = pr(xm, My, 27), mm = mass(My); f += `<path d="M${r(c[0] - .3 * mm)} ${r(c[1])} L${r(c[0] - .25 * mm)} ${r(c[1] - 1.7 * mm)} L${r(c[0] + .25 * mm)} ${r(c[1] - 1.7 * mm)} L${r(c[0] + .3 * mm)} ${r(c[1])} Z" fill="#efe6d2"/><circle cx="${r(c[0])}" cy="${r(c[1] - 2 * mm)}" r="${r(.25 * mm)}" fill="#efe6d2"/>`; }
    {
      const c = pr(0, My, 31.2), mm = mass(My);
      f += `<g transform="translate(${t2(c[0])} ${t2(c[1])}) scale(${(mm / 10).toFixed(4)})"><path d="M-17 -18 Q-20 -10 -16 6 Q-8 20 0 22 Q8 20 16 6 Q20 -10 17 -18 Z" fill="#e9dfc8" stroke="#bfb293" stroke-width="1"/><path d="M-13 -14 H13 V4 Q8 15 0 17 Q-8 15 -13 4 Z" fill="#c8323a"/><path d="M-9 4 V-6 H-6 V-9 H-3 V-6 H3 V-9 H6 V-6 H9 V4 Z" fill="#f2e6c2"/><path d="M-3 4 V-1 Q0 -4 3 -1 V4 Z" fill="#2a2420"/><circle cx="0" cy="-11" r="2.6" fill="#4f8a46"/><circle cx="-2.6" cy="-9" r="2.4" fill="#4f8a46"/><circle cx="2.6" cy="-9" r="2.4" fill="#4f8a46"/></g>`;
    }
    rhTeile.portal = pr(0, My, 2.4); rhTeile.fenster = pr(4.6, My, 12);
  }
  /* ---- Terrasse mit Balustrade (Docken) und Treppe zum Wasser in der Mittelachse (unsicher) ---- */
  {
    const TY = -14;
    f += pfad(poly([[-62, TY, 0], [62, TY, 0], [62, TY, 1.6], [-62, TY, 1.6]]), "#d5c9af");
    f += pfad(poly([[-62, TY, 1.6], [62, TY, 1.6], [62, TY + 10, 1.6], [-62, TY + 10, 1.6]]), "#cfc4ac");
    let d = ""; for (let x = -61.6; x <= 61.6; x += .55) { if (Math.abs(x) < 6) continue; d += `M${P(pr(x, TY, 1.6))} L${P(pr(x, TY, 2.5))} `; }
    f += `<path d="${d}" stroke="#efe7d4" stroke-width=".32"/>`;
    for (const sg of [-1, 1]) f += pfad(fe(TY, [[6 * sg, 2.5], [62 * sg, 2.5], [62 * sg, 2.8], [6 * sg, 2.8]]), "#f6efe0") + pfad(fe(TY, [[6 * sg, 1.6], [62 * sg, 1.6], [62 * sg, 1.75], [6 * sg, 1.75]]), SCHATTEN, ` opacity=".3"`);
    for (let i = 0; i < 6; i++) f += pfad(fr(TY - .5 - i * .55, -6, 1.6 - i * .3, 6, 1.3 - i * .3), i % 2 ? "#d5c9af" : "#ece2cb");
    for (const sg of [-1, 1]) f += pfad(fr(TY - 1.6, 6 * sg - .5, 0, 6 * sg + .5, 2.8), "#ece2cb");
  }
  S.def(`<g id="${S.id("fassade")}">${f}</g>`);
  const FAS = `<use href="#${S.id("fassade")}"/>`;
  const zx0 = pr(-17, 0, 0)[0], zw = pr(17, 0, 0)[0] - zx0 + 30, zh = zw * 2 / 3;
  S.teil({ id: "rathaus", de: "das Neue Rathaus", syl: "NEU-e RAT-haus", it: "il Nuovo Municipio", itSyl: "NUO-vo mu-ni-CI-pio", en: "New Town Hall", x: 0, y: 0, kunst: `<g ${LUFT}>${dach}${FAS}</g>`,
    tipp: "Das Neue Rathaus wurde 1913 eingeweiht — Kaiser Wilhelm II. war dabei. Es steht auf 6026 Pfählen aus Buchenholz.",
    zoom: { x: r(zx0 - 15), y: r(pr(0, -4, 0)[1] - zh + 4), w: r(zw), h: r(zh) },
    unter: [
      { id: "portal", de: "das Portal", syl: "por-TAL", it: "il portale", itSyl: "por-TA-le", en: "portal", x: rhTeile.portal[0], y: rhTeile.portal[1], kunst: flaeche(-10, -6, 20, 8),
        tipp: "Das ist die Gartenseite. Der Haupteingang liegt auf der anderen Seite, am Trammplatz." },
      { id: "balkon", de: "der Balkon", syl: "bal-KON", it: "il balcone", itSyl: "bal-CO-ne", en: "balcony", x: rhTeile.balkon[0], y: rhTeile.balkon[1], kunst: flaeche(-15, -3, 30, 4),
        tipp: "Vom Balkon schaut man über den Maschteich in den Park." },
      { id: "fenster", de: "das Fenster", syl: "FENS-ter", it: "la finestra", itSyl: "fi-NE-stra", en: "window", x: rhTeile.fenster[0], y: rhTeile.fenster[1], kunst: flaeche(-2.4, -7, 4.8, 11),
        tipp: "Zähl mal die Fenster in einer Reihe!" },
    ] });
}

/* =====================================================================
   4 — DER MASCHTEICH (Spiegelbild, nach vorn von Wellen aufgelöst)
   ===================================================================== */
const NAH = -138;           // Uferkante vorn (12 m vor uns)
{
  const fern = pr(0, -20, WASSER)[1], nah = pr(0, NAH, 0)[1];
  S.def(`<clipPath id="${S.id("teich")}"><rect x="0" y="${r(fern)}" width="${BR}" height="${r(nah - fern)}"/></clipPath>`);
  let k = `<rect x="0" y="${r(fern)}" width="${BR}" height="${r(nah - fern + .5)}" fill="${S.lg("wasser", [[0, "#93adbe"], [0.5, "#6f8d9e"], [1, "#4b6979"]])}"/>`;
  k += `<g clip-path="url(#${S.id("teich")})"><g opacity=".55" filter="url(#${S.id("spiegel")})"><g transform="translate(0 ${SPIEGEL.toFixed(4)}) scale(1 -1)"><use href="#${S.id("fassade")}"/></g></g></g>`;
  k += `<rect x="0" y="${r(fern)}" width="${BR}" height="${r(nah - fern)}" fill="${S.lg("wasserluft", [[0, "#9ab4c4", 0.12], [1, "#2c4452", 0.38]])}"/>`;
  /* warmer Glanz links (Sonne im Südwesten) */
  k += `<ellipse cx="62" cy="${r(fern + 8)}" rx="58" ry="7" fill="${S.rg("glanz", [[0, "#fff0c8", 0.28], [0.6, "#fff0c8", 0.08], [1, "#fff0c8", 0]])}"/>`;
  /* Wellen: oben fein und selten, nach vorn dicht — das Spiegelbild löst sich auf */
  for (let i = 0; i < 230; i++) {
    const t = Math.pow(rnd(), .7), y = fern + t * (nah - fern), w = 1 + t * 9 * (.5 + rnd()), x = rnd() * (BR - w);
    k += `<path d="M${r(x)} ${r(y)} h${r(w)}" stroke="${rnd() < .55 ? "#e6f0f2" : "#2c4452"}" stroke-width="${r(.15 + t * .5)}" opacity="${r(.2 + t * .4)}"/>`;
  }
  /* treibende Blätter */
  for (let i = 0; i < 9; i++) { const x = rnd() * BR, y = fern + 8 + rnd() * (nah - fern - 10), s = .4 + (y - fern) * .04; k += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(s * 1.2)}" ry="${r(s * .4)}" fill="${["#d9a53a", "#c7702c", "#e0b84a"][i % 3]}"/>`; }
  k += `<rect x="0" y="${r(fern - .6)}" width="${BR}" height=".8" fill="#c9bfa8"/>`;
  const A = anker(40, r((fern + nah) / 2 + 6), k);
  S.teil({ id: "maschteich", de: "der Maschteich", syl: "MASCH-teich", it: "lo stagno Masch", itSyl: "STA-gno MASCH", en: "Masch pond", x: A.x, y: A.y, kunst: A.kunst,
    tipp: "Im Maschteich spiegelt sich das Rathaus. Ein Stück weiter südlich liegt der große Maschsee." });
}

/* =====================================================================
   5 — DER SCHWAN und 6 — DIE ENTE (näher am Ufer, mit Bugwelle und Spiegelbild)
   ===================================================================== */
{
  const Y = -122, p = pr(-6.4, Y, WASSER), m = mass(Y) / 100;    // Zentimeter, Blick nach rechts
  let g = `<path d="M-60 2 Q0 8 64 2" stroke="#e6f0f2" stroke-width="2" fill="none" opacity=".7"/><path d="M58 0 L80 -2 M58 2 L82 4" stroke="#e6f0f2" stroke-width="1.6" opacity=".6"/>`;
  g += `<g transform="translate(0 4) scale(1 -.5)" opacity=".35"><path d="M-50 -4 Q-56 -26 -30 -30 Q10 -34 40 -20 Q56 -14 52 -2 Q20 6 -40 2 Z" fill="#f4f4f0"/><path d="M38 -18 Q46 -40 40 -62 Q36 -78 46 -84 Q56 -86 58 -78 L66 -72 L56 -74 Q50 -72 50 -62 Q54 -40 48 -16 Z" fill="#f4f4f0"/></g>`;
  g += `<path d="M-50 -4 Q-56 -26 -30 -30 Q10 -34 40 -20 Q56 -14 52 -2 Q20 6 -40 2 Z" fill="${S.lg("schwan", [[0, "#ffffff"], [1, "#d9dde0"]])}"/>`;
  g += `<path d="M-34 -26 Q-6 -42 30 -24 Q4 -24 -22 -14 Z" fill="#eceeed"/><path d="M-30 -20 Q-10 -28 14 -22" stroke="#c9ced2" stroke-width="1.2" fill="none"/>`;
  g += `<path d="M38 -18 Q46 -40 40 -62 Q36 -78 46 -84 Q56 -86 58 -78 L60 -76 L56 -74 Q50 -72 50 -62 Q54 -40 48 -16 Z" fill="#fbfbf8"/>`;
  g += `<path d="M58 -79 L70 -73 L58 -74 Z" fill="#e0752a"/><path d="M54 -81 Q57 -86 61 -80 L59 -76 Q56 -77 54 -81 Z" fill="#1d1d1d"/><circle cx="52" cy="-80" r="1.6" fill="#1d1d1d"/>`;
  S.teil({ oben: true, id: "schwan", de: "der Schwan", syl: "SCHWAN", it: "il cigno", itSyl: "CI-gno", en: "swan", x: p[0], y: p[1], kunst: `<g transform="scale(${m.toFixed(5)})">${g}</g>` + flaeche(-4, -6, 10, 7, .5),
    tipp: "Der Schwan ist weiß und hat einen langen Hals." });
}
{
  const ente = (x, Y, sp, erpel) => { const p = pr(x, Y, WASSER), m = mass(Y) / 100; return `<g transform="translate(${t2(p[0])} ${t2(p[1])}) scale(${(sp * m).toFixed(5)} ${m.toFixed(5)})"><path d="M-24 2 Q0 6 26 2" stroke="#e6f0f2" stroke-width="1.6" fill="none" opacity=".7"/><g transform="translate(0 3) scale(1 -.5)" opacity=".3"><path d="M-20 -2 Q-22 -14 -6 -14 L10 -12 Q16 -22 24 -20 Q30 -18 28 -12 L20 -2 Z" fill="${erpel ? "#2f6b3a" : "#7a6248"}"/></g><path d="M-20 -2 Q-22 -14 -6 -14 L10 -12 Q16 -22 24 -20 Q30 -18 28 -12 L34 -10 L27 -8 Q22 -6 20 -2 Q0 4 -20 -2 Z" fill="${erpel ? "#b7b2a8" : "#8a6c4c"}"/>` + (erpel ? `<path d="M10 -12 Q16 -22 24 -20 Q30 -18 28 -12 Q22 -9 14 -9 Z" fill="#1f6b3a"/><path d="M12 -9 Q18 -7 22 -9" stroke="#fff" stroke-width="1.6" fill="none"/><path d="M-2 -6 Q8 -12 14 -8 Q8 -4 -2 -4 Z" fill="#6a4030"/><path d="M-20 -6 Q-24 -9 -26 -6" stroke="#1d1d1d" stroke-width="1.6" fill="none"/>` : `<path d="M-14 -8 Q0 -12 12 -8" stroke="#5a442e" stroke-width="1" fill="none"/>`) + `<path d="M-8 -10 Q2 -13 10 -9" stroke="#3a5a8a" stroke-width="2.2"/><path d="M27 -12 L34 -10 L27 -9 Z" fill="${erpel ? "#e8c82a" : "#d89a3a"}"/><circle cx="23" cy="-16" r="1" fill="#111"/></g>`; };
  const k = ente(-2.8, -131.6, -1, true) + ente(-1.2, -130.6, -1, false);
  const e0 = pr(-2.8, -131.6, WASSER);
  const A = anker(e0[0], e0[1], k + flaeche(e0[0] - 5, e0[1] - 5, 13, 6, .5));
  S.teil({ oben: true, id: "ente", de: "die Ente", syl: "EN-te", it: "l'anatra", itSyl: "A-na-tra", en: "duck", x: A.x, y: A.y, kunst: A.kunst,
    tipp: "Auf dem Maschteich schwimmen Stockenten. Das Männchen hat einen grünen Kopf und einen weißen Ring am Hals." });
}

/* =====================================================================
   7 — DER WEG am Südufer und 8 — DER RASEN davor
   ===================================================================== */
const WEGRAND = -140.6;
let WEG = null, RASEN = null, RASEN_SCHATTEN = "";
/* Schatten und Streulaub gehören zum Boden (Weg oder Rasen): sie fangen keinen Tipp ab */
const aufBoden = (T, svg) => { T.kunst += `<g transform="translate(${t2(-T.x)} ${t2(-T.y)})">${svg}</g>`; };
{
  const kante = pr(0, NAH, 0)[1], rand = pr(0, WEGRAND, 0)[1];
  let k = `<rect x="0" y="${r(kante)}" width="${BR}" height="${r(rand - kante + .5)}" fill="${S.lg("weg", [[0, "#cdbd9c"], [1, "#bba684"]])}"/>`;
  k += `<rect x="0" y="${r(kante - .6)}" width="${BR}" height="1.2" fill="#e8e0cc"/><rect x="0" y="${r(kante + .6)}" width="${BR}" height=".5" fill="#8f8674" opacity=".5"/>`;
  for (let i = 0; i < 70; i++) k += `<circle cx="${r(rnd() * BR)}" cy="${r(kante + 1 + rnd() * (rand - kante - 1))}" r="${r(.15 + rnd() * .35)}" fill="${rnd() < .5 ? "#8f7c5e" : "#efe4cc"}" opacity=".7"/>`;
  const A = anker(40, r((kante + rand) / 2), k);
  WEG = S.teil({ id: "weg", de: "der Weg", syl: "WEG", it: "il sentiero", itSyl: "sen-TIE-ro", en: "path", x: A.x, y: A.y, kunst: A.kunst,
    tipp: "Auf dem Weg um den Maschteich gehen die Leute spazieren und joggen." });
}
{
  const rand = pr(0, WEGRAND, 0)[1];
  const gras = (name, w, h, n, l, b) => { const z = zufall(w * 100); let m = `<rect width="${w}" height="${h}" fill="#6c8c3c"/>`; for (let i = 0; i < n; i++) { const x = r(z() * w), y = r(z() * h), dx = r((z() - .5) * l * .5); m += `<path d="M${x} ${y} l${dx} ${-l} M${r(+x + b)} ${y} l${r(dx * .6)} ${r(-l * .8)}" stroke="${["#93b04e", "#56742c", "#7f9e44", "#a6bd5e"][Math.floor(z() * 4)]}" stroke-width="${r(b * .6)}"/>`; } S.def(`<pattern id="${S.id(name)}" width="${w}" height="${h}" patternUnits="userSpaceOnUse">${m}</pattern>`); return `url(#${S.id(name)})`; };
  const G1 = gras("gras1", 2.3, 1.1, 14, .5, .2), G2 = gras("gras2", 7, 3.3, 30, 1.1, .35), G3 = gras("gras3", 11, 5.2, 34, 2.2, .6);
  S.def(`<linearGradient id="${S.id("gm2g")}" gradientUnits="userSpaceOnUse" x1="0" y1="${r(rand + 6)}" x2="0" y2="${r(rand + 16)}"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient><mask id="${S.id("gm2")}"><rect width="${BR}" height="${HO}" fill="url(#${S.id("gm2g")})"/></mask>`);
  S.def(`<linearGradient id="${S.id("gm3g")}" gradientUnits="userSpaceOnUse" x1="0" y1="${r(rand + 22)}" x2="0" y2="${r(rand + 34)}"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient><mask id="${S.id("gm3")}"><rect width="${BR}" height="${HO}" fill="url(#${S.id("gm3g")})"/></mask>`);
  const R0 = `x="0" y="${r(rand)}" width="${BR}" height="${r(HO - rand)}"`;
  let k = `<rect ${R0} fill="${G1}"/><rect ${R0} fill="${G2}" mask="url(#${S.id("gm2")})"/><rect ${R0} fill="${G3}" mask="url(#${S.id("gm3")})"/>`;
  const FL1 = S.rg("grasfleck1", [[0, "#2f4818", 0.22], [1, "#2f4818", 0]]), FL2 = S.rg("grasfleck2", [[0, "#e4e89a", 0.2], [1, "#e4e89a", 0]]);
  for (let i = 0; i < 12; i++) { const x = r(rnd() * BR), y = r(rand + 4 + rnd() * (HO - rand - 6)), w = 20 + rnd() * 22; k += `<ellipse cx="${x}" cy="${y}" rx="${r(Math.min(w, x + 4, BR + 4 - x))}" ry="${r(3 + (y - rand) * .12)}" fill="${i % 2 ? FL1 : FL2}"/>`; }
  k += `<rect ${R0} fill="${S.lg("rasenlicht", [[0, "#000", 0.06], [1, "#fff2b0", 0.08]])}"/><path d="M0 ${r(rand)} H${BR}" stroke="#56742c" stroke-width=".8"/>`;
  const A = anker(200, 228, k);
  RASEN = S.teil({ id: "rasen", de: "der Rasen", syl: "RA-sen", it: "il prato", itSyl: "PRA-to", en: "lawn", x: A.x, y: A.y, kunst: A.kunst,
    tipp: "Der Rasen ist im Herbst voller bunter Blätter." });
}

/* =====================================================================
   9 — DER KASTANIENBAUM (rechts vorn): Rosskastanie mit gefingerten
       Blättern (fünf bis sieben verkehrt-eiförmige Blättchen am langen
       Stiel), Borke, Wurzelanlauf, Schatten nach rechts hinten
   ===================================================================== */
{
  const Y = -141, p = pr(4.2, Y, 0), m = mass(Y);
  let k = "";
  RASEN_SCHATTEN = bodenSchatten(4.2, Y, .9, 9, .28).replace(/(-?\d+\.?\d*) (-?\d+\.?\d*)/g, (q, x, y) => `${Math.min(+x, BR + 4)} ${y}`);
  /* Stamm mit Längsrissen und Wurzelanlauf */
  k += `<path d="M${r(p[0] - .9 * m)} ${r(p[1] + .2)} Q${r(p[0] - .5 * m)} ${r(p[1] - .4 * m)} ${r(p[0] - .42 * m)} ${r(p[1] - 1.4 * m)} C${r(p[0] - .3 * m)} ${r(p[1] - 4 * m)} ${r(p[0] - .6 * m)} ${r(p[1] - 6 * m)} ${r(p[0] - 22)} 52 L${r(p[0] - 10)} 50 C${r(p[0] + .1 * m)} ${r(p[1] - 6 * m)} ${r(p[0] + .38 * m)} ${r(p[1] - 4 * m)} ${r(p[0] + .48 * m)} ${r(p[1] - 1.4 * m)} Q${r(p[0] + .6 * m)} ${r(p[1] - .4 * m)} ${r(p[0] + .95 * m)} ${r(p[1] + .2)} Z" fill="${S.lg("stamm", [[0, "#8a7462"], [0.45, "#5a4838"], [1, "#2e241c"]], 0, 0, 1, 0)}"/>`;
  { let d = ""; for (let i = 0; i < 9; i++) { const x = p[0] + (-.32 + i * .09) * m, y0 = p[1] - (1 + rnd() * 2) * m, y1 = 70 + rnd() * 30; d += `M${r(x)} ${r(y0)} C${r(x + 1)} ${r((y0 + y1) / 2)} ${r(x - 1)} ${r((y0 + y1) / 2)} ${r(x + .4)} ${r(y1)} `; } k += `<path d="${d}" stroke="#2a1f17" stroke-width=".55" fill="none" opacity=".55"/>`; }
  /* Gabelung bei y ≈ 72: drei starke Äste laufen nach links oben, nach oben und nach rechts aus dem Bild */
  const ast = (pts, w0, w1) => { let d = "", e = ""; for (let i = 0; i < pts.length; i++) { const t = i / (pts.length - 1), w = w0 + (w1 - w0) * t; d += (i ? " L" : "M") + `${r(pts[i][0] - w / 2)} ${r(pts[i][1])}`; e = ` L${r(pts[i][0] + w / 2)} ${r(pts[i][1])}` + e; } return `<path d="${d}${e} Z" fill="#4a3a2c"/>`; };
  k += ast([[p[0] - 12, 74], [p[0] - 30, 58], [p[0] - 56, 44], [p[0] - 84, 36], [p[0] - 110, 30]], 9, 2.4);
  k += ast([[p[0] - 8, 72], [p[0] - 10, 46], [p[0] - 4, 20], [p[0] + 2, 1]], 8, 4);
  k += ast([[p[0] - 4, 76], [p[0] + 10, 58], [p[0] + 26, 46]], 7, 4);
  k += ast([[p[0] - 56, 44], [p[0] - 70, 56], [p[0] - 92, 64], [p[0] - 104, 60]], 3, 1.2);
  /* schweres Laubdach von oben rechts über das obere Drittel, die Kuppel bleibt frei;
     gelappte Massen (Licht links oben, Schatten rechts unten), Himmelslücken */
  const masse = (cx, cy, R, seed) => {
    const z = zufall(seed); let g = "";
    const lap = []; for (let i = 0; i < 8; i++) { const a = z() * Math.PI * 2, d = R * (.35 + z() * .45); lap.push([cx + Math.cos(a) * d, cy + Math.sin(a) * d * .7, R * (.38 + z() * .2)]); }
    lap.push([cx, cy, R * .6]);
    const ok = (x, y, rr) => { rr = Math.min(rr, x + 1, BR + 1 - x, y + 1); return rr > .8 ? rr : 0; };
    for (const [x, y, rr] of lap) { const q = ok(x, y, rr); if (q) g += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(q)}" fill="#8a6222"/>`; }
    for (const [x, y, rr] of lap) { const q = ok(x - rr * .15, y - rr * .18, rr * .78); if (q) g += `<circle cx="${r(x - rr * .15)}" cy="${r(y - rr * .18)}" r="${r(q)}" fill="#b98330"/>`; }
    for (const [x, y, rr] of lap.slice(0, 5)) { const q = ok(x - rr * .3, y - rr * .34, rr * .4); if (q) g += `<circle cx="${r(x - rr * .3)}" cy="${r(y - rr * .34)}" r="${r(q * .8)}" fill="#e2b24a" opacity=".55"/>`; }
    return g;
  };
  for (const [cx, cy, R, sd] of [[300, 10, 30, 1], [258, 6, 26, 2], [222, 14, 22, 3], [196, 34, 14, 4], [236, 44, 22, 5], [282, 46, 26, 6], [310, 70, 18, 7], [256, 74, 16, 8], [214, 60, 14, 9], [292, 96, 12, 10]]) k += masse(cx, cy, R, sd);
  for (const [x, y, w] of [[240, 26, 4], [276, 32, 3.4], [222, 40, 3], [300, 56, 3.2], [264, 60, 2.6]]) k += `<ellipse cx="${x}" cy="${y}" rx="${w}" ry="${r(w * .7)}" fill="#a9c6df"/>`;
  /* gefingerte Rosskastanienblätter am Rand des Laubdachs, durchhängende Zweige */
  const blatt = (x, y, sz, rot, f) => {
    let g = `<g transform="translate(${t2(x)} ${t2(y)}) rotate(${rot}) scale(${sz.toFixed(3)})"><path d="M0 0 L0 9" stroke="#7a5a2a" stroke-width=".5"/>`;
    for (const [a, l] of [[-78, 5.6], [-42, 8], [-12, 9.6], [18, 9], [50, 7.2], [82, 5]]) g += `<path d="M0 0 C-1 ${r(-l * .35)} ${r(-2.6)} ${r(-l * .8)} 0 ${-l} C${r(2.6)} ${r(-l * .8)} 1 ${r(-l * .35)} 0 0 Z" fill="${f}" stroke="#8a5a22" stroke-width=".35" transform="rotate(${a})"/>`;
    return g + `</g>`;
  };
  const rand = [[190, 46], [200, 62], [208, 74], [222, 82], [238, 88], [254, 92], [270, 98], [286, 106], [298, 110], [304, 104], [204, 30], [212, 20]];
  for (const [x, y] of rand) for (let j = 0; j < 2; j++) k += blatt(x + (rnd() - .5) * 8, y + (rnd() - .5) * 6, .55 + rnd() * .35, Math.round(150 + rnd() * 60), ["#e2b24a", "#d39a32", "#c4862e", "#b9a040", "#e8c25a"][Math.floor(rnd() * 5)]);
  for (let i = 0; i < 26; i++) { const x = 200 + rnd() * 100, y = 10 + rnd() * 74; k += blatt(x, y, .5 + rnd() * .35, Math.round(rnd() * 360), ["#e2b24a", "#d39a32", "#c4862e", "#e8c25a"][Math.floor(rnd() * 4)]); }
  /* aufgeplatzte Stachelschalen mit glänzender Kastanie an kurzen Stielen */
  const schale = (x, y) => { let g = `<path d="M${x} ${r(y - 3.2)} V${y}" stroke="#5a4a2a" stroke-width=".35"/><g transform="translate(${x} ${r(y + 1.4)})"><circle r="1.9" fill="#7f8f34"/><path d="M-1.9 0 Q0 -.6 1.9 0" stroke="#f4eedc" stroke-width=".6" fill="none"/>`; for (let a = 0; a < 10; a++) { const w = a * Math.PI / 5; g += `<path d="M${r(Math.cos(w) * 1.8)} ${r(Math.sin(w) * 1.8)} l${r(Math.cos(w) * .8)} ${r(Math.sin(w) * .8)}" stroke="#5f6f2a" stroke-width=".22"/>`; } return g + `<ellipse cx=".2" cy=".5" rx="1.1" ry=".9" fill="#7a3814"/><ellipse cx="-.2" cy=".2" rx=".4" ry=".22" fill="#fff" opacity=".6"/></g>`; };
  for (const [x, y] of [[226, 86], [262, 96], [298, 108], [212, 70], [244, 90], [280, 102]]) k += schale(x, y);
  /* am Stammfuß: Kastanien und offene Schalen auf dem Weg */
  for (const [dx, dy] of [[-22, 2], [-15, 4], [-9, 1.4]]) k += `<ellipse cx="${r(p[0] + dx)}" cy="${r(p[1] + dy)}" rx="1.3" ry=".9" fill="#7a3814"/><ellipse cx="${r(p[0] + dx - .3)}" cy="${r(p[1] + dy - .3)}" rx=".4" ry=".2" fill="#fff" opacity=".6"/>`;
  aufBoden(RASEN, RASEN_SCHATTEN);
  const A = anker(p[0], 120, k);
  S.teil({ id: "kastanienbaum", de: "der Kastanienbaum", syl: "kas-TA-nien-baum", it: "l'ippocastano", itSyl: "ip-po-ca-STA-no", en: "horse chestnut tree", x: A.x, y: A.y, kunst: A.kunst,
    tipp: "Kastanienbäume haben Blätter wie eine Hand mit fünf bis sieben Fingern." });
}

/* =====================================================================
   10 — DIE SPAZIERGÄNGERIN (hinter der Lehne) und 11 — DIE BANK
   ===================================================================== */
const BANK = { x: 1.9, y: -139.4 };
const kleineFigur = (svg) => {
  const farbe = {};
  svg = svg.replace(/<(linear|radial)Gradient id="([^"]+)"[^>]*>(.*?)<\/\1Gradient>/g, (q, a, id, inn) => { const st = [...inn.matchAll(/offset="([\d.]+)" stop-color="(#[0-9a-fA-F]+)"/g)]; let best = st[0]; for (const x of st) if (Math.abs(+x[1] - .45) < Math.abs(+best[1] - .45)) best = x; farbe[id] = best ? best[2] : "#888"; return ""; });
  svg = svg.replace(/url\(#([^)]+)\)/g, (q, id) => farbe[id] || q).replace(/<defs><\/defs>/g, "");
  return svg.replace(/ d="([^"]*)"/g, (q, d) => ` d="${d.replace(/-?\d+\.\d+/g, (n) => String(Math.round(+n * 10) / 10))}"`);
};
{
  const m = mass(BANK.y), p = pr(BANK.x + .5, BANK.y + .15, 0);
  const f = B.mensch({ id: "han_spaz", geschlecht: "w", pose: "sitzen", blick: 184, frisur: "dutt", haarfarbe: "grau", haut: "hell", alter: "alt",
    kleidung: { oberteil: { stueck: "pullover", farbe: "blau" }, unterteil: { stueck: "hose", farbe: "grau" }, jacke: { stueck: "mantel", farbe: "beige" }, schuhe: { stueck: "halbschuh", farbe: "braun" } } }, 1.64 * m);
  const sitz = f.z.sitz ? f.z.sitz.y * f.k : -.45 * m;
  S.def(`<clipPath id="${S.id("sitz")}"><rect x="-60" y="-200" width="120" height="${r(200 + sitz + 1)}"/></clipPath>`);
  const kopf = [p[0], p[1] - 1.25 * m];
  /* Rückansicht: Hinterkopf ganz mit grauem Haar, Dutt tief am Hinterkopf, schmaler Nacken, roter Schal als Ring um den Hals */
  const hk = [f.z.kopf.x * f.k, f.z.kopf.y * f.k], cm = f.k;
  const hinterkopf = `<ellipse cx="${r(hk[0])}" cy="${r(hk[1] + 1 * cm)}" rx="${r(9.6 * cm)}" ry="${r(11.4 * cm)}" fill="${S.lg("grauhaar", [[0, "#d9d6d0"], [1, "#9e9a92"]], 0, 0, 1, 0)}"/><path d="M${r(hk[0] - 6 * cm)} ${r(hk[1] - 4 * cm)} Q${r(hk[0])} ${r(hk[1] - 9 * cm)} ${r(hk[0] + 6 * cm)} ${r(hk[1] - 3 * cm)}" stroke="#f2f0ec" stroke-width="${r(1.2 * cm * 10) / 10}" fill="none" opacity=".7"/><circle cx="${r(hk[0] + .5 * cm)}" cy="${r(hk[1] + 5 * cm)}" r="${r(4.6 * cm)}" fill="#a8a49c"/><circle cx="${r(hk[0] - .6 * cm)}" cy="${r(hk[1] + 4 * cm)}" r="${r(1.8 * cm)}" fill="#d9d6d0"/><rect x="${r(hk[0] - 3.4 * cm)}" y="${r(hk[1] + 10.4 * cm)}" width="${r(6.8 * cm)}" height="${r(2.2 * cm)}" fill="#e2b48e"/><ellipse cx="${r(hk[0])}" cy="${r(hk[1] + 13.6 * cm)}" rx="${r(8 * cm)}" ry="${r(2.8 * cm)}" fill="#c8323a"/>`;
  S.teil({ id: "spaziergaengerin", de: "die Spaziergängerin", syl: "spa-ZIER-gän-ge-rin", it: "la signora a passeggio", itSyl: "si-GNO-ra a pas-SEG-gio", en: "walker", x: kopf[0], y: kopf[1],
    kunst: `<g transform="translate(${t2(p[0] - kopf[0])} ${t2(p[1] - kopf[1])})"><g clip-path="url(#${S.id("sitz")})">${kleineFigur(f.svg)}</g>${hinterkopf}</g>`,
    tipp: "Sie macht eine Pause und schaut über den Teich zum Rathaus." });
}
{
  const m = mass(BANK.y), p = pr(BANK.x, BANK.y, 0), W = 1.9 * m;
  const HOLZ = S.lg("bankholz", [[0, "#9a6a3a"], [1, "#5e3a1c"]]);
  aufBoden(WEG, bodenSchatten(BANK.x, BANK.y, 1.9, .9, .3));
  let k = "";
  let g = "";
  for (const sg of [-1, 1]) g += `<path d="M${r(sg * (W / 2 - 4))} 0 L${r(sg * (W / 2 - 4))} ${r(-.45 * m)} L${r(sg * (W / 2 - 3))} ${r(-.92 * m)} L${r(sg * (W / 2 - 5))} ${r(-.92 * m)} L${r(sg * (W / 2 - 5))} ${r(-.45 * m)} L${r(sg * (W / 2 - 7))} 0 Z" fill="#2c2a28"/>`;
  g += `<rect x="${r(-W / 2)}" y="${r(-.47 * m)}" width="${r(W)}" height="1.4" rx=".3" fill="${HOLZ}"/>`;
  for (let i = 0; i < 3; i++) g += `<rect x="${r(-W / 2 + .4)}" y="${r(-.92 * m + i * 3.4)}" width="${r(W - .8)}" height="2.3" rx=".5" fill="${HOLZ}"/><rect x="${r(-W / 2 + .4)}" y="${r(-.92 * m + i * 3.4)}" width="${r(W - .8)}" height=".6" fill="#c0905a" opacity=".6"/><rect x="${r(-W / 2 + .4)}" y="${r(-.92 * m + i * 3.4 + 1.9)}" width="${r(W - .8)}" height=".4" fill="#2e1c0c" opacity=".4"/>`;
  k += `<g transform="translate(${t2(p[0])} ${t2(p[1])})">${g}</g>`;
  const A = anker(p[0] + W * .3, p[1] - .6 * m, k);
  S.teil({ id: "bank", de: "die Bank", syl: "BANK", it: "la panchina", itSyl: "pan-CHI-na", en: "bench", x: A.x, y: A.y, kunst: A.kunst,
    tipp: "Auf der Bank ruht man sich aus." });
}

/* =====================================================================
   12 — DAS LAUB: ein Laubhaufen am Stammfuß (das Wort); Streublätter
        liegen auf Weg und Rasen und gehören zu diesen
   ===================================================================== */
const blattForm = (x, y, s, rot, f) => `<path d="M${r(x + s * .5)} ${r(y + s * .3)} q${r(1.2 * s)} ${r(-1.2 * s)} ${r(2.4 * s)} 0 q${r(-1.2 * s)} ${r(1.2 * s)} ${r(-2.4 * s)} 0 Z" fill="#2a3418" opacity=".25" transform="rotate(${rot} ${r(x + s)} ${r(y)})"/><path d="M${r(x)} ${r(y)} q${r(1.2 * s)} ${r(-1.2 * s)} ${r(2.4 * s)} 0 q${r(-1.2 * s)} ${r(1.2 * s)} ${r(-2.4 * s)} 0 Z" fill="${f}" transform="rotate(${rot} ${r(x + s)} ${r(y)})"/>`;
{
  const LF = ["#d9a53a", "#c7702c", "#e0b84a", "#b8542a", "#a8862e"];
  let streu = "";
  for (let i = 0; i < 40; i++) { const x = 110 + rnd() * 200, y = 196 + rnd() * 36, sz = .6 + (y - 190) * .05; streu += blattForm(x, y, sz, Math.round(rnd() * 360), LF[Math.floor(rnd() * 5)]); }
  aufBoden(RASEN, streu);
  /* der Haufen am Stammfuß */
  const p0 = pr(3.4, -141.4, 0);
  let k = `<ellipse cx="${r(p0[0])}" cy="${r(p0[1] + 1)}" rx="16" ry="3.4" fill="#2a3418" opacity=".22"/>`;
  for (let i = 0; i < 46; i++) { const a = rnd() * Math.PI * 2, d = Math.sqrt(rnd()); const x = p0[0] + Math.cos(a) * d * 14, y = p0[1] + Math.sin(a) * d * 3 - (1 - d) * 2.6; k += blattForm(x, y, .9 + rnd() * .5, Math.round(rnd() * 360), LF[Math.floor(rnd() * 5)]); }
  const A = anker(p0[0], p0[1] - 2, k);
  S.teil({ id: "laub", de: "das Laub", syl: "LAUB", it: "le foglie", itSyl: "FO-glie", en: "fallen leaves", x: A.x, y: A.y, kunst: A.kunst,
    tipp: "Im Oktober färbt sich das Laub gelb, orange und rot." });
}

/* =====================================================================
   13 — DIE DECKE (Picknick links vorn) — Lupe: Butterkeks, Lüttje Lage,
        Kastanie, Postkarte
   ===================================================================== */
{
  const Y0 = -144.65, Y1 = -143.1, X0 = -2.5, X1 = -.3;
  const a = pr(X0, Y0, 0), b = pr(X1, Y0, 0), c = pr(X1, Y1, 0), d = pr(X0, Y1, 0);
  const L = (u, v) => [a[0] + (b[0] - a[0]) * u + (d[0] - a[0]) * v + (c[0] - b[0] - d[0] + a[0]) * u * v, a[1] + (b[1] - a[1]) * u + (d[1] - a[1]) * v + (c[1] - b[1] - d[1] + a[1]) * u * v];
  let k = bodenSchatten(-1.4, -143.1, 2.2, .05, .2);
  /* Vichy-Karo: weiß, hellrot, dunkelrot an den Kreuzungen */
  k += `<path d="M${P(a)} L${P(b)} L${P(c)} L${P(d)} Z" fill="#f6f1e8"/>`;
  const NU = 12, NV = 7;
  for (let i = 0; i < NU; i += 2) k += `<path d="M${P(L(i / NU, 0))} L${P(L((i + 1) / NU, 0))} L${P(L((i + 1) / NU, 1))} L${P(L(i / NU, 1))} Z" fill="#d84a50" opacity=".55"/>`;
  for (let j = 0; j < NV; j += 2) k += `<path d="M${P(L(0, j / NV))} L${P(L(1, j / NV))} L${P(L(1, (j + 1) / NV))} L${P(L(0, (j + 1) / NV))} Z" fill="#d84a50" opacity=".55"/>`;
  /* umgeschlagener Zipfel vorn rechts, Saum */
  k += `<path d="M${P(L(.86, 0))} L${P(b)} L${P(L(1, .2))} Z" fill="#efe6d8"/><path d="M${P(L(.86, 0))} L${P(L(1, .2))}" stroke="#b8a890" stroke-width=".4"/><path d="M${P(a)} L${P(L(.86, 0))}" stroke="#a83a40" stroke-width=".8"/>`;
  const auf = (u, v) => L(u, v), mdt = (v) => mass(Y0 + (Y1 - Y0) * v) / 100;
  /* DER BUTTERKEKS: offene Packung, ein Keks herausgezogen, zwei Kekse daneben, Krümel */
  const K = auf(.24, .5), km = mdt(.5);
  const keks = (cx, cy, rot) => {
    const Lk = 6.5, Bk = 5.4, n1 = 14, n2 = 12, pts = [];
    for (let i = 0; i < n1; i++) pts.push([-Lk / 2 + (i + .5) * Lk / n1, -Bk / 2]);
    for (let i = 0; i < n2; i++) pts.push([Lk / 2, -Bk / 2 + (i + .5) * Bk / n2]);
    for (let i = n1 - 1; i >= 0; i--) pts.push([-Lk / 2 + (i + .5) * Lk / n1, Bk / 2]);
    for (let i = n2 - 1; i >= 0; i--) pts.push([-Lk / 2, -Bk / 2 + (i + .5) * Bk / n2]);
    let z = `<g transform="translate(${cx} ${cy}) rotate(${rot}) scale(1 .5)"><rect x="${-Lk / 2}" y="${-Bk / 2}" width="${Lk}" height="${Bk}" fill="#dca95a"/>`;
    for (const [x, y] of pts) z += `<circle cx="${r(x * 100) / 100}" cy="${r(y * 100) / 100}" r=".26" fill="#dca95a"/>`;
    z += `<rect x="${-Lk / 2 + .35}" y="${-Bk / 2 + .35}" width="${Lk - .7}" height="${Bk - .7}" fill="#efc77a"/><text x="0" y=".5" font-size="1.3" text-anchor="middle" fill="#b8843a" font-family="Arial" font-weight="bold">LEIBNIZ</text>`;
    for (const [x, y] of [[-2.2, -1.6], [0, -1.6], [2.2, -1.6], [-2.2, 1.7], [0, 1.7], [2.2, 1.7]]) z += `<circle cx="${x}" cy="${y}" r=".18" fill="#b8843a"/>`;
    return z + `</g>`;
  };
  let kg = `<path d="M-11 1 L4 1 L6 -.4 L-9 -.4 Z" fill="#2a3418" opacity=".25"/><path d="M-10 0 L3 0 L3 -2.4 L-10 -2.4 Z" fill="#d5b03a"/><path d="M-10 -2.4 L3 -2.4 L5.4 -3.8 L-7.6 -3.8 Z" fill="#f2cc4a"/><path d="M3 0 L5.4 -1.4 L5.4 -3.8 L3 -2.4 Z" fill="#b8902a"/>`;
  kg += `<path d="M-10 -2.4 L-12.6 -4.6 L-9.6 -5.4 L-7.6 -3.8 Z" fill="#e8d8a0"/><text x="-3.6" y="-.6" font-size="1.3" text-anchor="middle" fill="#7a1f1a" font-family="Arial" font-weight="bold">BUTTERKEKS</text>`;
  kg += keks(-11.4, -3.2, -20) + keks(9.4, -.2, -8) + keks(14.4, .8, 14);
  for (let i = 0; i < 8; i++) kg += `<circle cx="${r(6 + rnd() * 10)}" cy="${r(1.6 + rnd() * 1.6)}" r=".25" fill="#d9a85a"/>`;
  k += `<g transform="translate(${t2(K[0])} ${t2(K[1])}) scale(${(km * 1.15).toFixed(5)})">${kg}</g>`;
  /* DIE LÜTTJE LAGE: dunkles Bier und Korn auf dem Holzbrettchen */
  const L0 = auf(.66, .62), lm = mdt(.62);
  let lg = `<path d="M-6 1.2 L6 1.2 L7 -.6 L-5 -.6 Z" fill="#2a3418" opacity=".25"/><path d="M-5 0 L5 0 L5.6 -.8 L-4.4 -.8 Z" fill="#a8743f"/>`;
  lg += `<path d="M-3.6 -.6 L-1 -.6 L-.8 -8 L-3.8 -8 Z" fill="#e8eef0" opacity=".5"/><path d="M-3.5 -.8 L-1.1 -.8 L-.9 -6.6 L-3.7 -6.6 Z" fill="#3a1e0e"/><path d="M-3.7 -6.6 L-.9 -6.6 L-.85 -7.4 L-3.75 -7.4 Z" fill="#e8d8b8"/><path d="M-3.3 -6.4 L-3 -1.2" stroke="#fff" stroke-width=".3" opacity=".6"/>`;
  lg += `<path d="M1 -.6 L3.2 -.6 L3.4 -4.6 L.8 -4.6 Z" fill="#eef4f6" opacity=".6"/><path d="M1.1 -.8 L3.1 -.8 L3.25 -3.6 L.95 -3.6 Z" fill="#f4f8f8" opacity=".85"/>`;
  k += `<g transform="translate(${t2(L0[0])} ${t2(L0[1])}) scale(${(lm * 1.1).toFixed(5)})">${lg}</g>`;
  /* Thermoskanne und Becher */
  const T0 = auf(.86, .7), tm = mdt(.7);
  k += `<g transform="translate(${t2(T0[0])} ${t2(T0[1])}) scale(${tm.toFixed(5)})"><path d="M-3 1 L8 1 L10 -.6 L-1 -.6 Z" fill="#2a3418" opacity=".25"/><rect x="-2.4" y="-22" width="5" height="22" rx="1" fill="#2f6b4a"/><rect x="-2.4" y="-22" width="1.4" height="22" fill="#5a9a72" opacity=".6"/><rect x="-2.6" y="-25" width="5.4" height="3.4" rx=".6" fill="#3a3a38"/><path d="M5 -.2 L5.4 -6 L9.2 -6 L9.6 -.2 Z" fill="#ece8e0"/><ellipse cx="7.3" cy="-6" rx="2" ry=".6" fill="#6a4020"/></g>`;
  /* DIE POSTKARTE mit den Nanas am Leineufer */
  const PK = auf(.42, .22), pm = mdt(.22);
  let pg = `<g transform="rotate(-8) scale(1 .5)"><rect x="-7.4" y="-5" width="14.8" height="10" fill="#fff" stroke="#c9c6be" stroke-width=".2"/><rect x="-6.8" y="-4.4" width="13.6" height="8.8" fill="#9cc6e4"/><rect x="-6.8" y="1.6" width="13.6" height="2.8" fill="#7f9a50"/>`;
  for (const [x, f1, f2] of [[-4, "#e8443a", "#2f6fd0"], [0, "#f2c230", "#e8443a"], [4, "#2fa86a", "#f2c230"]]) pg += `<ellipse cx="${x}" cy="0" rx="1.6" ry="2.2" fill="${f1}"/><circle cx="${x}" cy="-2.8" r=".8" fill="#4a2a1a"/><path d="M${x - 1.4} -1.4 L${x - 2.4} -3 M${x + 1.4} -1.4 L${x + 2.6} -2.6" stroke="${f2}" stroke-width=".7"/><path d="M${x - .8} 1.8 L${x - 1.2} 3.4 M${x + .8} 1.8 L${x + 1.4} 3.4" stroke="${f2}" stroke-width=".7"/>`;
  pg += `<text x="0" y="-3.2" font-size="1.4" text-anchor="middle" fill="#fff" font-family="Georgia" font-weight="bold">Hannover</text></g>`;
  k += `<g transform="translate(${t2(PK[0])} ${t2(PK[1])}) scale(${pm.toFixed(5)})">${pg}</g>`;
  /* DIE KASTANIE: gesammelte Rosskastanien und eine aufgeplatzte Stachelschale auf der Decke */
  const KA = auf(.1, .7), mm = mdt(.7);
  let kgz = "";
  const nuss = (x, y, rr, rot) => `<g transform="translate(${x} ${y}) rotate(${rot})"><ellipse cx="1" cy="1.2" rx="${rr * 1.1}" ry="${rr * .45}" fill="#2a3418" opacity=".3"/><path d="M${-rr} 0 Q${-rr} ${-rr * 1.15} 0 ${-rr * 1.05} Q${rr * 1.05} ${-rr} ${rr} 0 Q${rr * .7} ${rr * .55} 0 ${rr * .55} Q${-rr * .7} ${rr * .55} ${-rr} 0 Z" fill="${S.rg("kastanie", [[0, "#b8642c"], [0.55, "#7a3814"], [1, "#4a220c"]], 0.35, 0.3, 0.8)}"/><path d="M${-rr * .9} ${rr * .05} Q0 ${rr * .7} ${rr * .9} ${rr * .05} Q0 ${rr * .3} ${-rr * .9} ${rr * .05} Z" fill="#d8c09a"/><ellipse cx="${-rr * .35}" cy="${-rr * .55}" rx="${rr * .3}" ry="${rr * .14}" fill="#fff" opacity=".55"/></g>`;
  /* aufgeplatzte Schale: drei Klappen, innen weich weiß, außen grün mit Stacheln */
  kgz += `<g transform="translate(5.6 -.4)"><ellipse cx="0" cy="1.6" rx="5" ry="1.4" fill="#2a3418" opacity=".3"/>`;
  for (const rot of [-70, 30, 140]) {
    kgz += `<g transform="rotate(${rot})"><path d="M0 0 Q-3.2 -1.4 -2.6 -4.4 Q0 -5.8 2.6 -4.4 Q3.2 -1.4 0 0 Z" fill="#8a9a3a"/><path d="M0 -.6 Q-2 -1.6 -1.6 -3.8 Q0 -4.6 1.6 -3.8 Q2 -1.6 0 -.6 Z" fill="#f4eedc"/>`;
    for (let i = 0; i < 6; i++) { const a = -2.6 + i * 1.05; kgz += `<path d="M${r(a)} ${r(-4.2 + Math.abs(a) * .2)} l${r(a * .25)} -1.2" stroke="#5f6f2a" stroke-width=".25"/>`; }
    kgz += `</g>`;
  }
  kgz += nuss(0, -.6, 1.4, 10) + `</g>`;
  kgz += nuss(-1.4, 0, 1.7, -8) + nuss(2.2, .6, 1.6, 20) + nuss(-4.6, .9, 1.5, 4);
  k += `<g transform="translate(${t2(KA[0])} ${t2(KA[1])}) scale(${(mm * 1.2).toFixed(5)})">${kgz}</g>`;
  const zw = 66, zh = 44;
  const A = anker(L(.5, .1)[0], L(.5, .1)[1], k);
  S.teil({ oben: true, id: "decke", de: "die Decke", syl: "DE-cke", it: "la coperta", itSyl: "co-PER-ta", en: "picnic blanket", x: A.x, y: A.y, kunst: A.kunst,
    tipp: "Bei schönem Wetter machen viele ein Picknick im Maschpark.",
    zoom: (() => { const xs = [K[0], L0[0], PK[0], KA[0]], ys = [K[1], L0[1] - 8 * lm, PK[1], KA[1]]; const x0 = Math.min(...xs) - 7, x1 = Math.max(...xs) + 7, w = Math.max(54, x1 - x0), h = w * 2 / 3, my = (Math.min(...ys) + Math.max(...ys)) / 2; return { x: r(Math.max(0, x0)), y: r(Math.max(0, Math.min(HO - h, my - h / 2))), w: r(w), h: r(h) }; })(),
    unter: [
      { id: "butterkeks", de: "der Butterkeks", syl: "BUT-ter-keks", it: "il biscotto al burro", itSyl: "bi-SCOT-to al BUR-ro", en: "butter biscuit", x: K[0] + 1.5 * km * 1.15, y: K[1] - 2 * km * 1.15, kunst: flaeche(-15 * km, -5 * km, 34 * km, 8 * km, .3),
        tipp: "Der Leibniz-Keks kommt aus Hannover und hat genau 52 Zähne." },
      { id: "luettje_lage", de: "die Lüttje Lage", syl: "LÜTT-je LA-ge", it: "la Lüttje Lage (birra e acquavite di grano)", itSyl: "LÜTT-je LA-ge", en: "Lüttje Lage (beer and schnapps)", x: L0[0], y: L0[1] - 4 * lm, kunst: flaeche(-6.5 * lm, -5.5 * lm, 13 * lm, 10 * lm, .3),
        tipp: "Bier und Korn trinkt man gleichzeitig aus zwei Gläsern in einer Hand. Das gehört zum Schützenfest, dem größten der Welt." },
      { id: "kastanie", de: "die Kastanie", syl: "kas-TA-nie", it: "la castagna d'India", itSyl: "ca-STA-gna d'IN-dia", en: "conker", x: KA[0] + 1.5 * mm, y: KA[1] - 1.5 * mm, kunst: flaeche(-8 * mm, -6 * mm, 18 * mm, 9 * mm, .3),
        tipp: "Im Herbst sammeln Kinder Kastanien und basteln daraus Tiere." },
      { id: "postkarte", de: "die Postkarte", syl: "POST-kar-te", it: "la cartolina", itSyl: "car-to-LI-na", en: "postcard", x: PK[0], y: PK[1], kunst: flaeche(-7.6 * pm, -3 * pm, 15.2 * pm, 6 * pm, .3),
        tipp: "Auf der Karte: die bunten Nanas von Niki de Saint Phalle. Sie stehen am Leineufer." },
    ] });
}

/* =====================================================================
   14 — DIE LATERNE am Weg (links): Parkleuchte mit Glühkörper
   ===================================================================== */
{
  const Y = -138.9, p = pr(-5.2, Y, 0), m = mass(Y) / 100;     // Zentimeter
  let g = "";
  g += `<path d="M-14 0 L14 0 L10 -30 L6 -40 L-6 -40 L-10 -30 Z" fill="#26302c"/><rect x="-4.5" y="-300" width="9" height="262" fill="${S.lg("mast", [[0, "#3c4a44"], [0.5, "#26302c"], [1, "#1a221f"]], 0, 0, 1, 0)}"/>`;
  for (const y of [-120, -240]) g += `<rect x="-6.5" y="${y}" width="13" height="5" fill="#26302c"/>`;
  g += `<path d="M-9 -300 L9 -300 L5 -312 L-5 -312 Z" fill="#26302c"/>`;
  g += `<path d="M-14 -312 L14 -312 L20 -350 L-20 -350 Z" fill="${S.lg("leuchte", [[0, "#f6f2e4", 0.9], [1, "#d9d2bc", 0.9]])}" stroke="#26302c" stroke-width="2"/>`;
  g += `<ellipse cx="0" cy="-330" rx="4" ry="6" fill="#e9e4d6" stroke="#b9b29e" stroke-width=".8"/><ellipse cx="-1.2" cy="-332" rx="1.2" ry="2.2" fill="#ffffff" opacity=".8"/><path d="M-12 -318 L-16 -344" stroke="#fff" stroke-width="2" opacity=".7"/><path d="M0 -312 V-350" stroke="#26302c" stroke-width="1.4"/>`;
  g += `<path d="M-26 -350 L26 -350 L0 -372 Z" fill="#26302c"/><circle cx="0" cy="-378" r="5" fill="#26302c"/>`;
  aufBoden(WEG, pfad(poly([[-5.35, Y, 0], [-5.05, Y, 0], [-5.05 + .8, NAH - .1, 0], [-5.35 + .8, NAH - .1, 0]]), "#2a3418", ` opacity=".25"`));
  const kunst = `<g transform="translate(${t2(p[0])} ${t2(p[1])}) scale(${m.toFixed(5)})">${g}</g>`;
  const A = anker(p[0], p[1] - 160 * m, kunst);
  S.teil({ id: "laterne", de: "die Laterne", syl: "la-TER-ne", it: "il lampione", itSyl: "lam-PIO-ne", en: "street lamp", x: A.x, y: A.y, kunst: A.kunst,
    tipp: "Am Abend leuchtet die Laterne am Weg." });
}

/* Licht über allem: warme Nachmittagssonne von links, Vignette (fängt keinen Tipp ab) */
S.davor(`<rect width="${BR}" height="${HO}" fill="${S.rg("sonne", [[0, "#fff1c8", 0.2], [0.5, "#fff1c8", 0.05], [1, "#fff1c8", 0]], 0, 0.2, 0.9)}"/><rect width="${BR}" height="${HO}" fill="${S.rg("vignette", [[0, "#000", 0], [0.74, "#000", 0], [1, "#1a1008", 0.2]], 0.5, 0.5, 0.75)}"/>`);

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/hannover.js"));
console.log(aus);
