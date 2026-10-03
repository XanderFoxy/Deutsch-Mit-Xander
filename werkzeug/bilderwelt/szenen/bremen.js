#!/usr/bin/env node
/* =====================================================================
   BREMEN (FASSUNG 854) — Bilderwelt neu: eine echte Stadtansicht
   ---------------------------------------------------------------------
   RECHERCHE (aus Fachwissen, die Websuche war in dieser Sitzung
   aufgebraucht — Unsicheres ist mit „(unsicher)“ markiert):
   - STANDORT: der Westrand des Marktplatzes, wo die Obernstraße
     einmündet (vor den Giebelhäusern der Westseite, auf der Terrasse
     eines Cafés). Man schaut nach Nordosten bis Südosten über den Platz.
     Echte Reihenfolge von links nach rechts (Peilung von hier, 0° =
     Norden): das RATHAUS mit seiner Schaufront zum Markt (Süden) von
     ≈ 13° bis 52°, links an seiner Westseite (≈ 10°) die STADTMUSIKANTEN;
     vor dem Rathaus, nahe seinem Ostende, der ROLAND (≈ 55°); hinter der
     Lücke zum Domshof der DOM ST. PETRI, dessen zwei Westtürme sich hinter
     dem HAUS DER BÜRGERSCHAFT (Ostseite, 60°–90°) erheben (≈ 67°–84°);
     in der Südostecke Giebelhäuser; rechts an der Südseite der SCHÜTTING
     (105°–127°), gegenüber dem Rathaus. Zylinder-Panorama über 132°
     (Weitwinkel wie bei Stuttgart): senkrechte Kanten bleiben senkrecht,
     lange waagerechte Kanten biegen sich leicht. Die Abstände stammen aus
     dem Stadtplan im Gedächtnis (Rathaus–Schütting ≈ 57 m, unsicher ±20 %).
   - RATHAUS: gotischer Saalbau (1405–1410, 41,5 m × 16 m), 1608–1612 von
     Lüder von Bentheim mit der Fassade der WESERRENAISSANCE geschmückt:
     unten die ARKADEN mit elf Rundbögen aus hellem Sandstein, darüber die
     Balustrade; das Obergeschoss aus dunklem Backstein mit hohen
     Kreuzstockfenstern und den acht gotischen STANDBILDERN (Kaiser und
     sieben Kurfürsten) unter Baldachinen; in der Mitte der ERKER (Mittel-
     risalit) mit großen Fenstern und dem hohen Ziergiebel mit Voluten und
     Obelisken; das steile Dach aus grünem KUPFER mit Gauben und je einem
     kleineren Zwerchgiebel links und rechts (Zahl der Nebengiebel und die
     Walm-Form des Dachs unsicher). Seit 2004 mit dem Roland UNESCO-Welterbe.
     An der Westseite der Eingang zum Ratskeller (unsicher).
   - ROLAND (1404): Steinfigur, 5,47 m, auf einem Podest mit Stufen und
     unter einem gotischen Baldachin, zusammen 10,21 m. Langes lockiges
     Haar, Rüstung, das blanke SCHWERT aufrecht in der rechten Hand, der
     SCHILD mit dem Reichsadler am linken Arm. Er blickt zum Dom, dem Sitz
     des Erzbischofs — von hier sieht man ihn darum von seiner rechten
     Seite, leicht von hinten: das Schwert vorn, der Schild halb verdeckt.
   - DOM ST. PETRI: zwei Westtürme, je ≈ 98 m, mit schlanken grünen
     Kupferhelmen (die Türme wurden 1888–1901 erneuert), dazwischen der
     Giebel mit der großen FENSTERROSE; Sandstein, hell. Der untere Teil
     wird vom Haus der Bürgerschaft verdeckt (Turmabschluss mit Giebeln und
     Ecktürmchen vereinfacht, unsicher).
   - HAUS DER BÜRGERSCHAFT (1962–1966, Wassili Luckhardt): das Landes-
     parlament, Glas und helle Betonrippen, oben das gefaltete Dach
     („Faltwerk“), das die Giebel der Altstadt aufnimmt.
   - SCHÜTTING (1537–1539, Haus der Kaufleute, heute Handelskammer):
     heller Sandstein, flämische Renaissance; Ziergiebel an den Schmal-
     seiten, in der Mitte der Marktseite ein Zwerchhaus (1594), das Portal
     mit dem Wahlspruch „buten un binnen – wagen un winnen“ (draußen und
     drinnen – wagen und gewinnen). Dach dunkel (unsicher). Nordseite im
     Schatten (Sonne von Süden).
   - STADTMUSIKANTEN (Gerhard Marcks, 1953): Bronze, gut 2 m hoch, Esel,
     Hund, Katze und Hahn übereinander, schlank und streng gebaut. Die
     Vorderbeine des Esels und seine Nase sind vom Anfassen blank und
     golden — wer die Beine mit beiden Händen hält, darf sich etwas
     wünschen. Gezeigt im Profil (Blick nach Westen), wie auf den
     bekannten Fotos (genaue Ausrichtung unsicher).
   - TYPISCHES: Bremen ist Kaffeestadt (1906 erfand Ludwig Roselius hier
     den koffeinfreien Kaffee HAG; er ließ auch die Böttcherstraße bauen,
     die neben dem Schütting beginnt — von hier hinter dem rechten
     Bildrand). Der KLABEN (schwerer Rosinen-Stollen ohne Puderzucker,
     in Scheiben mit Butter), das LABSKAUS (Seemannsessen: Kartoffeln,
     Pökelfleisch, Rote Bete, mit Spiegelei, Rollmops und Gewürzgurke).
     Möwen von der Weser, Tauben auf dem Platz.
   Licht: Anfang Oktober, früher Nachmittag, Sonne im Südsüdwesten (rechts
   hinter uns, ≈ 32° hoch): Südseiten hell, die Nordseite des Schüttings
   im Schatten; sein Schatten fällt nach Nordnordosten auf den Platz.
   Maßstab: echte Kamera, Auge 1,6 m, Horizont y = 196, 173,6 Einheiten
   je Bogenmaß: am Rathaus ≈ 3–4, am Roland 3,5, am Dom 1,9 Einheiten je
   Meter. Bild 400 × 260, damit die 98 m hohen Domtürme ganz hineinpassen.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const BR = 400, HO = 260;
const S = neueSzene({ id: "bremen", titel: "Bremen", emoji: "🐓", thema: "Deutschland", kuerzel: "hbr", fassung: 854, breite: BR, hoehe: HO });
const rnd = zufall(1404);
{ const lg = S.lg, rg = S.rg, da = {};
  S.lg = (n, ...a) => da["l" + n] || (da["l" + n] = lg(n, ...a));
  S.rg = (n, ...a) => da["r" + n] || (da["r" + n] = rg(n, ...a)); }
const r = B.r;
const t2 = (n) => (+n).toFixed(2);

/* ---------- Kamera: Zylinder-Panorama (Meter: x Ost, y Nord, z Höhe) ---------- */
const GRAD = Math.PI / 180;
const CAM = [-10, -44], AUGE = 1.2, HOR = 196, FOK = 173.6, LINKS = 2 * GRAD;
const peil = (x, y) => Math.atan2(x - CAM[0], y - CAM[1]);
const weit = (x, y) => Math.hypot(x - CAM[0], y - CAM[1]);
const pr = (x, y, z) => [FOK * (peil(x, y) - LINKS), HOR - FOK * (z - AUGE) / weit(x, y)];
const mass = (x, y) => FOK / weit(x, y);
const P = (p) => `${r(p[0])} ${r(p[1])}`;
/* lange waagerechte Kanten fein unterteilen: im Panorama sind sie gebogen */
const fein = (pts, schritt, zu = true) => {
  const out = [], n = pts.length, m = zu ? n : n - 1;
  for (let i = 0; i < m; i++) {
    const a = pts[i], b = pts[(i + 1) % n], L = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.max(1, Math.ceil(L / schritt));
    for (let j = 0; j < k; j++) { const t = j / k; out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]); }
  }
  if (!zu) out.push(pts[n - 1]);
  return out;
};
/* am Bildrand beschneiden: nichts ragt aus dem Bild */
const RAHMEN = [-1, -1, BR + 1, HO + 1];
const randClip = (pts) => {
  let out = pts;
  const kanten = [[(p) => p[0] >= RAHMEN[0], (a, b) => (RAHMEN[0] - a[0]) / (b[0] - a[0])], [(p) => p[0] <= RAHMEN[2], (a, b) => (RAHMEN[2] - a[0]) / (b[0] - a[0])],
    [(p) => p[1] >= RAHMEN[1], (a, b) => (RAHMEN[1] - a[1]) / (b[1] - a[1])], [(p) => p[1] <= RAHMEN[3], (a, b) => (RAHMEN[3] - a[1]) / (b[1] - a[1])]];
  for (const [innen, t] of kanten) {
    const inp = out; out = [];
    for (let i = 0; i < inp.length; i++) {
      const a = inp[i], b = inp[(i + 1) % inp.length];
      if (innen(a)) { out.push(a); if (!innen(b)) { const k = t(a, b); out.push([a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]); } }
      else if (innen(b)) { const k = t(a, b); out.push([a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]); }
    }
    if (!out.length) break;
  }
  return out;
};
const poly = (pts, schritt = 3) => { const q = randClip(fein(pts, schritt).map((p) => pr(p[0], p[1], p[2]))); return q.length > 2 ? "M" + q.map(P).join(" L") + " Z" : ""; };
/* Linien: Punkte außerhalb des Bildes fallen weg, die Linie wird dort unterbrochen */
const imBild = (p) => p[0] >= -1 && p[0] <= BR + 1 && p[1] >= -1 && p[1] <= HO + 1;
const linie = (pts, schritt = 3) => {
  let d = "", an = false;
  for (const p of fein(pts, schritt, false).map((p) => pr(p[0], p[1], p[2]))) { if (imBild(p)) { d += (an ? " L" : " M") + P(p); an = true; } else an = false; }
  return d.trim();
};
/* senkrechte Ebene: Punkt (s, z) — s läuft von (x0, y0) in Richtung (ux, uy) */
const ebene = (x0, y0, ux, uy) => (s, z) => [x0 + s * ux, y0 + s * uy, z];
const fp = (E, pts, schritt = 99) => poly(pts.map(([s, z]) => E(s, z)), schritt);
const fr = (E, s0, z0, s1, z1, schritt = 99) => fp(E, [[s0, z0], [s1, z0], [s1, z1], [s0, z1]], schritt);
const fl = (E, pts, schritt = 99) => linie(pts.map(([s, z]) => E(s, z)), schritt);
/* Rundbogen-Öffnung: von z0 senkrecht bis zum Kämpfer zK, Halbkreis bis zum Scheitel */
const bogen = (sm, w, z0, zK, n = 8) => {
  const pts = [[sm - w / 2, z0]];
  for (let i = 0; i <= n; i++) { const a = Math.PI * (1 - i / n); pts.push([sm + Math.cos(a) * w / 2, zK + Math.sin(a) * w / 2]); }
  pts.push([sm + w / 2, z0]);
  return pts;
};
const pfad = (d, f, extra = "") => d ? `<path d="${d}" fill="${f}"${extra}/>` : "";

S.def(`<filter id="bw_weich" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("wolke")}" color-interpolation-filters="sRGB" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="2.4"/></filter>`);
S.def(`<filter id="${S.id("dunst")}" color-interpolation-filters="sRGB" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation=".35"/></filter>`);

/* ---------- Stoffe (Sonne von rechts hinten, Südsüdwest) ---------- */
const SAND = S.lg("sand", [[0, "#efe3c6"], [1, "#e2d2b0"]]);                 // Sandstein in der Sonne
const SAND_D = S.lg("sandd", [[0, "#c9b896"], [1, "#b3a17f"]]);              // Sandstein seitlich
const BACK = S.lg("back", [[0, "#7a3f31"], [0.5, "#6d372b"], [1, "#5e3026"]]);  // dunkler Backstein
const KUPFER = S.lg("kupfer", [[0, "#5d9a85"], [0.5, "#72ad96"], [1, "#86bba3"]]);
const KUPFER_D = S.lg("kupferd", [[0, "#4a7d6c"], [1, "#5d907d"]]);
const GLAS = S.lg("glas", [[0, "#8fa9bd"], [0.4, "#40505e"], [1, "#2b3540"]]);
const LOCH = S.lg("loch", [[0, "#2c2622"], [0.7, "#3d342d"], [1, "#4f453b"]]);
const DOMSTEIN = S.lg("domstein", [[0, "#d4c8ad"], [1, "#e3d8bf"]], 0, 0, 1, 0);
const DOMSTEIN_D = S.lg("domsteind", [[0, "#b3a68b"], [1, "#c4b79c"]], 0, 0, 1, 0);
const BRONZE = S.lg("bronze", [[0, "#5b5036"], [0.5, "#3f3826"], [1, "#2c271b"]], 0, 0, 1, 0);
const GOLD = S.lg("gold", [[0, "#fff2b0"], [0.45, "#e2b850"], [1, "#9a7322"]], 0, 0, 1, 0);
const ROLSTEIN = S.lg("rolstein", [[0, "#cfc6b3"], [0.5, "#ebe4d3"], [1, "#d8cfbb"]], 0, 0, 1, 0);

/* =====================================================================
   KULISSE — Himmel (Oktober, früher Nachmittag), Wolken
   ===================================================================== */
S.hinten(`<rect width="${BR}" height="${HOR + 4}" fill="${S.lg("himmel", [[0, "#4a82c2"], [0.5, "#86b0da"], [0.85, "#c9dceb"], [1, "#e6ecef"]])}"/>`);
S.hinten(`<rect width="${BR}" height="${HOR + 4}" fill="${S.lg("sonnenseite", [[0, "#fff3d6", 0], [0.65, "#fff3d6", 0], [1, "#fff0cf", 0.32]], 0, 0, 1, 0)}"/>`);
{
  let w = "";
  for (const [x, y, s] of [[60, 26, 1.1], [128, 54, 0.75], [214, 16, 0.8], [330, 40, 1.2], [270, 86, 0.6], [30, 92, 0.7], [372, 110, 0.6]]) {
    w += `<g filter="url(#${S.id("wolke")})" opacity=".9">`;
    for (const [dx, dy, rx, ry] of [[0, 0, 17, 4.6], [-11, 1.5, 10, 3.4], [11, 1, 12, 3.8], [-3, -3.4, 9, 4.4], [5, -2.8, 7, 3.8]])
      w += `<ellipse cx="${r(x + dx * s)}" cy="${r(y + dy * s)}" rx="${r(rx * s)}" ry="${r(ry * s)}" fill="#fff"/>`;
    w += `<ellipse cx="${x}" cy="${r(y + 3 * s)}" rx="${r(17 * s)}" ry="${r(2.2 * s)}" fill="#dfe6ee"/></g>`;
  }
  S.hinten(w);
}
/* ferne Bauten in den Lücken: Liebfrauenkirche (Nordwesten), Domshof (Nordosten), Südostecke */
const giebelhaus = (E, s0, s1, h, gh, farbe, dach, fenster = "#4c5257") => {
  /* Giebelhaus in einer senkrechten Ebene E (s nach rechts im Bild), Treppengiebel */
  const m = (s0 + s1) / 2, w = s1 - s0;
  let g = pfad(fp(E, [[s0, 0], [s1, 0], [s1, h], [s1 - w * .12, h], [s1 - w * .12, h + gh * .3], [s1 - w * .26, h + gh * .3], [s1 - w * .26, h + gh * .62], [m + w * .1, h + gh * .62], [m + w * .1, h + gh], [m - w * .1, h + gh], [m - w * .1, h + gh * .62], [s0 + w * .26, h + gh * .62], [s0 + w * .26, h + gh * .3], [s0 + w * .12, h + gh * .3], [s0 + w * .12, h], [s0, h]]), farbe);
  const n = Math.max(2, Math.round(w / 2.6));
  for (let e = 0; e < Math.floor(h / 3.2); e++) for (let i = 0; i < n; i++) { const c = s0 + (i + .5) * w / n, z = 1.2 + e * 3.2 + (e ? .4 : 0); g += pfad(fr(E, c - .45, z, c + .45, z + (e ? 1.7 : 2.2)), e ? fenster : "#3a3d40"); }
  g += pfad(fr(E, m - .5, h + gh * .35, m + .5, h + gh * .55), fenster);
  return g;
};
{
  /* Liebfrauenkirche: Backstein-Hallenkirche mit hohen Spitzbogenfenstern, Kupferdach (Lage aus dem Plan, unsicher) */
  const E = ebene(-22, 52, 1, 0);
  let c = pfad(fr(E, 0, 0, 30, 17, 3), S.lg("kirche", [[0, "#93503d"], [1, "#a85e48"]]));
  c += pfad(poly([[-22, 52, 17], [8, 52, 17], [8, 60, 31], [-22, 60, 31]], 3), KUPFER_D);
  for (const s of [3, 9, 15, 21, 27]) c += pfad(fp(E, [[s - 1, 3], [s + 1, 3], [s + 1, 11.5], [s, 13.6], [s - 1, 11.5]]), "#33302f") + pfad(fr(E, s - .1, 3, s + .1, 12.4), "#b88a74");
  for (const s of [0, 6, 12, 18, 24, 30]) c += pfad(fr(E, s - .6, 0, s + .6, 14), "#7e4333");
  c += pfad(poly([[1, 56, 31], [1.6, 56, 31], [1.3, 56, 38]]), KUPFER);
  S.hinten(`<g opacity=".9" filter="url(#${S.id("dunst")})">${c}</g>`);
  /* Domshof: Bürgerhäuser hinter der Lücke zwischen Rathaus und Bürgerschaft (Südseiten in der Sonne) */
  let k = "";
  const D = ebene(76, 30, 1, 0);
  [[0, 9, 19, 5, "#e2d6bf"], [9, 17, 21, 0, "#d3c4a6"], [17, 27, 20, 6, "#e7dcc6"], [27, 38, 22, 0, "#cbb99b"], [38, 46, 18, 5, "#ddd0b8"]].forEach(([s0, s1, h, gh, f]) => { k += gh ? giebelhaus(D, s0, s1, h, gh, f) : pfad(fr(D, s0, 0, s1, h), f) + pfad(poly([[76 + s0, 30, h], [76 + s1, 30, h], [76 + s1, 35, h + 5], [76 + s0, 35, h + 5]]), "#6e5a50"); });
  /* Südostecke: Giebelhäuser an der Südseite östlich des Schüttings (Nordseiten im Schatten) */
  const SO = ebene(57, -57, -1, 0);
  k += giebelhaus(SO, 0, 5.6, 12.4, 7, "#b9a891", "#5a4a44", "#3f4448") + giebelhaus(SO, 5.6, 11.2, 13.4, 7.6, "#a88f7a", "#5a4a44", "#3f4448") + giebelhaus(SO, 11.2, 17, 12, 6.6, "#bcae98", "#5a4a44", "#3f4448");
  /* Ostseite südlich der Bürgerschaft: ein Giebelhaus quer (Westseite, Streiflicht) */
  const OS = ebene(57.4, -44, 0, -1);
  k += giebelhaus(OS, 0, 7, 13, 7, "#d2c3a6", "#5a4a44");
  S.hinten(`<g filter="url(#${S.id("dunst")})">${k}</g>`);
}

/* =====================================================================
   1 — DER MARKTPLATZ (Pflaster, Fugen, Schatten des Schüttings)
   ===================================================================== */
{
  /* Granitpflaster in Reihen (Läuferverband), drei Maßstäbe: hinten fein, vorn grob */
  const setz = (a, b, nx, ny) => {
    let m = `<rect width="${r(a * nx)}" height="${r(b * ny)}" fill="#6f6a62"/>`;
    for (let j = 0; j < ny; j++) for (let i = -1; i < nx; i++) {
      const x = i * a + (j % 2 ? a / 2 : 0), f = ["#a39e95", "#958f86", "#b2ada3", "#8b867d", "#a8a196", "#9c978e", "#b9b3a8"][Math.floor(rnd() * 7)];
      if (x + a < 0 || x > a * nx) continue;
      m += `<rect x="${r(x + a * .06)}" y="${r(j * b + b * .1)}" width="${r(a * .88)}" height="${r(b * .8)}" rx="${r(b * .25)}" fill="${f}"/><rect x="${r(x + a * .12)}" y="${r(j * b + b * .14)}" width="${r(a * .6)}" height="${r(b * .22)}" rx="${r(b * .1)}" fill="#fff" opacity=".12"/>`;
    }
    return m;
  };
  S.def(`<pattern id="${S.id("pf1")}" width="4.2" height="1.2" patternUnits="userSpaceOnUse">${setz(1.05, .3, 4, 4)}</pattern>`);
  S.def(`<pattern id="${S.id("pf2")}" width="9.6" height="3.2" patternUnits="userSpaceOnUse">${setz(2.4, .8, 4, 4)}</pattern>`);
  S.def(`<pattern id="${S.id("pf3")}" width="21" height="7.2" patternUnits="userSpaceOnUse">${setz(5.25, 1.8, 4, 4)}</pattern>`);
  S.def(`<linearGradient id="${S.id("m2g")}" gradientUnits="userSpaceOnUse" x1="0" y1="${HOR + 7}" x2="0" y2="${HOR + 16}"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient><mask id="${S.id("m2")}"><rect width="${BR}" height="${HO}" fill="url(#${S.id("m2g")})"/></mask>`);
  S.def(`<linearGradient id="${S.id("m3g")}" gradientUnits="userSpaceOnUse" x1="0" y1="${HOR + 22}" x2="0" y2="${HOR + 36}"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient><mask id="${S.id("m3")}"><rect width="${BR}" height="${HO}" fill="url(#${S.id("m3g")})"/></mask>`);
  const boden = `M0 ${HOR - 3} H${BR} V${HO} H0 Z`;
  let k = `<path d="${boden}" fill="url(#${S.id("pf1")})"/><path d="${boden}" fill="url(#${S.id("pf2")})" mask="url(#${S.id("m2")})"/><path d="${boden}" fill="url(#${S.id("pf3")})" mask="url(#${S.id("m3")})"/>`;
  k += `<path d="${boden}" fill="${S.lg("bodenluft", [[0, "#e9e6df", 0.6], [0.1, "#e9e6df", 0.18], [0.45, "#fff6e0", 0.06], [1, "#2a2218", 0.1]])}"/>`;
  /* helle Granitbänder im Raster (5 m), gebogen wie im Panorama */
  let g = "";
  for (let y = -54; y <= -4; y += 5) g += linie([[-13, y, 0], [56, y, 0]], 2);
  for (let x = -5; x <= 55; x += 5) g += linie([[x, -56, 0], [x, -1, 0]], 2);
  k += `<path d="${g.replace(/M/g, " M")}" stroke="#d9d4c9" stroke-width=".4" fill="none" opacity=".32"/>`;
  /* Schatten des Schüttings (Sonne 195°, 32° hoch → 1,6 m Schatten je Meter Höhe nach 15°) */
  const sv = (x, y, z) => [x + z * 0.414, y + z * 1.546, 0];
  k += pfad(poly([[8, -57, 0], sv(8, -57, 10.6), sv(8, -64.5, 19.5), sv(40, -64.5, 19.5), sv(40, -57, 10.6), [40, -57, 0]], 2), "#1f2430", ` opacity=".3"`);
  /* Schatten der Südostecke */
  k += pfad(poly([[40, -57, 0], sv(40, -57, 13), sv(50, -57, 13), sv(57, -46, 13), [57, -46, 0]], 2), "#1f2430", ` opacity=".2"`);
  S.teil({ id: "marktplatz", de: "der Marktplatz", syl: "MARKT-platz", it: "la piazza del mercato", itSyl: "PIAZ-za del mer-CA-to", en: "market square", x: 0, y: 0, kunst: k,
    tipp: "Vom Marktplatz geht man in die Böttcherstraße und in den Schnoor, das älteste Viertel der Stadt." });
}

/* =====================================================================
   2 — DER DOM ST. PETRI (zwei Westtürme hinter der Bürgerschaft)
       Lupe: Turmspitze, Fensterrose
   ===================================================================== */
const DOM = { x: 75, ys: [-38, -26], yn: [-14, -2], top: 56, spitze: 97 };
const domTeile = {};
{
  let k = "";
  const W = ebene(DOM.x, -2, 0, -1);     // Westfront: s = 0 (Norden) … 36 (Süden), im Bild nach rechts
  /* Kirchenschiff dahinter (Dach aus Kupfer) */
  k += pfad(poly([[DOM.x + 6, -26, 30], [DOM.x + 70, -26, 30], [DOM.x + 70, -20, 42], [DOM.x + 6, -20, 42]], 6), KUPFER_D);
  /* Mittelteil mit Giebel und Fensterrose (leicht zurück) */
  const M = ebene(DOM.x + 0.8, -2, 0, -1);
  k += pfad(fp(M, [[12, 0], [24, 0], [24, 36], [18, 45], [12, 36]]), DOMSTEIN);
  k += `<path d="${fl(M, [[11.6, 36], [18, 45.4], [24.4, 36]])}" stroke="#a89b80" stroke-width=".5" fill="none"/>`;
  /* Fensterrose: Kreis mit Maßwerk */
  {
    const c = pr(...M(18, 29)), rr = 4.2 * mass(DOM.x, -20);
    let g = `<circle cx="${r(c[0])}" cy="${r(c[1])}" r="${r(rr * 1.18)}" fill="#c3b598"/><circle cx="${r(c[0])}" cy="${r(c[1])}" r="${r(rr)}" fill="${S.rg("rose", [[0, "#6a7f95"], [0.6, "#3e4b5a"], [1, "#2c3540"]])}"/>`;
    for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; g += `<line x1="${r(c[0] + Math.cos(a) * rr * .28)}" y1="${r(c[1] + Math.sin(a) * rr * .28)}" x2="${r(c[0] + Math.cos(a) * rr)}" y2="${r(c[1] + Math.sin(a) * rr)}" stroke="#cfc2a6" stroke-width=".35"/>`; }
    g += `<circle cx="${r(c[0])}" cy="${r(c[1])}" r="${r(rr * .28)}" fill="none" stroke="#cfc2a6" stroke-width=".4"/><circle cx="${r(c[0])}" cy="${r(c[1])}" r="${r(rr * .66)}" fill="none" stroke="#cfc2a6" stroke-width=".3"/>`;
    k += g;
    domTeile.rose = { x: c[0], y: c[1], rr };
  }
  /* zwei Türme */
  const turm = (s0, s1, sued) => {
    let g = fp(W, [[s0, 0], [s1, 0], [s1, DOM.top], [s0, DOM.top]]);
    g = `<path d="${g}" fill="${DOMSTEIN}"/>`;
    /* Südseite des Südturms: schmal sichtbar, in voller Sonne */
    if (sued) g += pfad(poly([[DOM.x, -38, 0], [DOM.x + 12, -38, 0], [DOM.x + 12, -38, DOM.top], [DOM.x, -38, DOM.top]]), "#efe6d2");
    /* Lisenen an den Kanten, Gesimse */
    for (const s of [s0, s1 - 1.2]) g += pfad(fr(W, s, 0, s + 1.2, DOM.top), DOMSTEIN_D, ` opacity=".55"`);
    for (const z of [18, 28, 38, 47.6, 55]) g += pfad(fr(W, s0 - .2, z, s1 + .2, z + .7), "#c4b697");
    /* Fenster: unten schmale Rundbögen, oben gekuppelte Schallarkaden */
    const m = (s0 + s1) / 2;
    for (const z of [21, 31]) g += pfad(fp(W, bogen(m, 1.4, z, z + 3.8, 6)), "#3a3631");
    for (const d of [-2.6, 0, 2.6]) g += pfad(fp(W, bogen(m + d, 1.5, 40, 44.6, 6)), "#2f2c29");
    for (const d of [-3.4, -1.15, 1.15, 3.4]) g += pfad(fp(W, bogen(m + d, 1.3, 49.4, 53.4, 6)), "#2b2826");
    /* Uhr am Turm (unsicher, nur am Südturm) */
    /* Abschluss: vier kleine Giebel und Ecktürmchen, darüber der Kupferhelm */
    g += pfad(fp(W, [[s0 + 1, DOM.top], [m, DOM.top + 5.4], [s1 - 1, DOM.top]]), DOMSTEIN);
    g += pfad(fp(W, bogen(m, 1.6, DOM.top + .4, DOM.top + 2.4, 6)), "#2f2c29");
    for (const s of [s0 + .6, s1 - .6]) g += pfad(fp(W, [[s - .6, DOM.top], [s + .6, DOM.top], [s + .2, DOM.top + 4.6], [s, DOM.top + 6], [s - .2, DOM.top + 4.6]]), DOMSTEIN_D);
    const a = W(s0 + 1.2, DOM.top + 2), b = W(s1 - 1.2, DOM.top + 2), mm = W(m, 0);
    const spitze = pr(mm[0] + 6, mm[1], DOM.spitze), fa = pr(...a), fb = pr(...b), fm = pr(mm[0] - 0.5, mm[1], DOM.top + 2);
    g += `<path d="M${P(fa)} L${P(spitze)} L${P(fb)} Z" fill="${KUPFER_D}"/><path d="M${P(fm)} L${P(spitze)} L${P(fb)} Z" fill="${KUPFER}"/>`;
    g += `<path d="M${P(fm)} L${P(spitze)}" stroke="#9fd0b8" stroke-width=".35"/>`;
    /* Kreuz und Knauf */
    g += `<circle cx="${r(spitze[0])}" cy="${r(spitze[1] - .8)}" r=".7" fill="${GOLD}"/><path d="M${r(spitze[0])} ${r(spitze[1] - 1.4)} V${r(spitze[1] - 5.4)} M${r(spitze[0] - 1.2)} ${r(spitze[1] - 4.2)} H${r(spitze[0] + 1.2)}" stroke="#c9a23c" stroke-width=".45"/>`;
    return { g, spitze, m };
  };
  const tn = turm(0, 12, false), ts = turm(24, 36, true);
  k += tn.g + ts.g;
  domTeile.spitze = ts.spitze;
  domTeile.belfry = pr(...W(6, 47));
  /* Licht: Westseiten im Streiflicht, Dunst der Entfernung */
  /* Dunst der Entfernung nur über dem Mauerwerk (nicht über dem Himmel) */
  for (const [a, b] of [[0, 12], [12, 24], [24, 36]]) k += pfad(fp(W, [[a, 0], [b, 0], [b, a === 12 ? 36 : DOM.top], [a, a === 12 ? 36 : DOM.top]]), S.lg("domluft", [[0, "#c7d6e2", 0.3], [1, "#c7d6e2", 0.08]]));
  const sp = domTeile.spitze;
  S.teil({ id: "dom", de: "der Dom", syl: "DOM", it: "il duomo", itSyl: "DUO-mo", en: "cathedral", x: 0, y: 0, kunst: k,
    tipp: "Der Dom St. Petri ist über 1200 Jahre alt. Seine zwei Türme sind fast 100 Meter hoch.",
    zoom: { x: r(domTeile.rose.x - 64), y: r(domTeile.rose.y - 70), w: 128, h: 85 },
    unter: [
      { id: "turmspitze", de: "die Turmspitze", syl: "TURM-spit-ze", it: "la guglia", itSyl: "GU-glia", en: "spire", x: sp[0], y: domTeile.rose.y - 62, kunst: flaeche(-7, -6, 14, 10),
        tipp: "Die Turmspitzen sind mit Kupfer gedeckt. Mit der Zeit wird Kupfer grün." },
      { id: "glockenturm", de: "der Glockenturm", syl: "GLO-cken-turm", it: "il campanile", itSyl: "cam-pa-NI-le", en: "bell tower", x: domTeile.belfry[0], y: domTeile.belfry[1], kunst: flaeche(-7, -9, 14, 16),
        tipp: "Hinter den hohen Bogenfenstern oben im Turm hängen die Glocken." },
      { id: "fensterrose", de: "die Fensterrose", syl: "FENS-ter-ro-se", it: "il rosone", itSyl: "ro-SO-ne", en: "rose window", x: domTeile.rose.x, y: domTeile.rose.y, kunst: flaecheEllipse(0, 0, domTeile.rose.rr * 1.25, domTeile.rose.rr * 1.25),
        tipp: "Die runde Fensterrose sitzt über dem Hauptportal zwischen den Türmen." },
    ] });
}

/* =====================================================================
   3 — DAS HAUS DER BÜRGERSCHAFT (Ostseite, Glas und Faltdach)
   ===================================================================== */
{
  const W = ebene(57, -6, 0, -1);        // s = 0 (Nordende) … 38 (Südende), im Bild nach rechts
  const L = 38;
  let k = pfad(fr(W, 0, 0, L, 13.4, 2), "#e6e3db");
  /* Erdgeschoss zurückgesetzt, dunkel verglast, mit Stützen */
  k += pfad(fr(W, 0.4, 0, L - .4, 3.8, 2), S.lg("bgeg", [[0, "#2f3a42"], [1, "#4d5a63"]]));
  for (let s = 1.6; s < L; s += 3.2) k += pfad(fr(W, s - .25, 0, s + .25, 3.8), "#d9d5cb");
  /* Obergeschosse: Glas mit Himmel, davor schlanke Betonrippen */
  k += pfad(fr(W, 0.4, 4.2, L - .4, 13, 2), S.lg("bgglas", [[0, "#a9c3d6"], [0.5, "#6c8597"], [1, "#4b5d6b"]]));
  for (const z of [7.2, 10.2]) k += pfad(fr(W, 0.4, z, L - .4, z + .45, 2), "#d8d4ca");
  for (let s = 0.8; s < L; s += 1.6) k += pfad(fr(W, s - .14, 4.2, s + .14, 13), "#f1eee7");
  /* das Faltwerk: Dachprismen im Zickzack */
  const n = 9, w = L / n;
  for (let i = 0; i < n; i++) {
    const a = i * w, b = a + w, m = a + w / 2;
    k += pfad(fp(W, [[a, 13.4], [m, 16.8], [b, 13.4]]), i % 2 ? "#f3f1ec" : "#e9e6df");
    k += pfad(fp(W, [[m, 16.8], [b, 13.4], [b - .4, 13.4]]), "#c9c4b9");
  }
  k += pfad(fr(W, 0, 13, L, 13.6, 2), "#cfcbc1");
  /* drei Fahnenmasten (unsicher): Bremer Speckflagge, Deutschland, Europa */
  const fahne = (s, art) => {
    const fu = pr(...W(s, 0)), ko = pr(...W(s - 2.2, 12)), mm = mass(57, -6 - s);
    let g = `<path d="M${P(pr(...W(s - 2.2, 0)))} V${r(ko[1])}" stroke="#d6d8da" stroke-width=".45"/>`;
    const x = ko[0], y = ko[1] + .4, fw = 2.6 * mm, fh = 1.7 * mm;
    if (art === "hb") {
      for (let i = 0; i < 8; i++) g += `<rect x="${r(x + .3)}" y="${r(y + i * fh / 8)}" width="${r(fw)}" height="${r(fh / 8 + .05)}" fill="${i % 2 ? "#fff" : "#d0202c"}"/>`;
      for (let i = 0; i < 8; i++) for (let j = 0; j < 2; j++) g += `<rect x="${r(x + .3 + j * fh / 8)}" y="${r(y + i * fh / 8)}" width="${r(fh / 8)}" height="${r(fh / 8 + .05)}" fill="${(i + j) % 2 ? "#fff" : "#d0202c"}"/>`;
    } else if (art === "de") {
      ["#1d1d1d", "#d0202c", "#f1c232"].forEach((f, i) => { g += `<rect x="${r(x + .3)}" y="${r(y + i * fh / 3)}" width="${r(fw)}" height="${r(fh / 3 + .05)}" fill="${f}"/>`; });
    } else {
      g += `<rect x="${r(x + .3)}" y="${r(y)}" width="${r(fw)}" height="${r(fh)}" fill="#1f3f95"/>`;
      for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; g += `<circle cx="${r(x + .3 + fw / 2 + Math.cos(a) * fh * .3)}" cy="${r(y + fh / 2 + Math.sin(a) * fh * .3)}" r=".18" fill="#f1c232"/>`; }
    }
    return g;
  };
  k += fahne(9, "hb") + fahne(12.6, "de") + fahne(16.2, "eu");
  k += pfad(fr(W, 0, 0, L, 13.4, 4), S.lg("bgluft", [[0, "#c7d6e2", 0.16], [1, "#c7d6e2", 0.04]]));
  S.teil({ id: "buergerschaft", de: "die Bürgerschaft", syl: "BÜR-ger-schaft", it: "il parlamento di Brema", itSyl: "par-la-MEN-to di BRE-ma", en: "state parliament", x: 0, y: 0, kunst: k,
    tipp: "Im Haus der Bürgerschaft tagt das Parlament des Landes Bremen — das kleinste Bundesland Deutschlands." });
}

/* =====================================================================
   4 — DAS RATHAUS (Weserrenaissance) — Lupe: Arkade, Erker, Giebel,
       Statue, Dach
   ===================================================================== */
const RH = { L: 41.5, T: 16, WAND: 2.6, ERK: -0.9 };
const BAY = RH.L / 11;
const EK = { s0: 4 * BAY + .3, s1: 7 * BAY - .3 };
const rhTeile = {};
{
  let k = "";
  const A = ebene(0, 0, 1, 0), Wd = ebene(0, RH.WAND, 1, 0), Ek = ebene(0, RH.ERK, 1, 0), West = ebene(0, RH.T, 0, -1);
  const ZE = 14.9, FIRST = 25;
  /* ---- Dach: Walmdach aus Kupfer, Gauben ---- */
  const dachV = [[0, RH.WAND, ZE], [RH.L, RH.WAND, ZE], [RH.L - 7, 9.3, FIRST], [7, 9.3, FIRST]];
  k += pfad(poly(dachV, 1.5), KUPFER);
  k += pfad(poly([[0, RH.T, ZE], [0, RH.WAND, ZE], [7, 9.3, FIRST]], 1.5), KUPFER_D);
  {
    let n = "";
    for (let x = 0.9; x < RH.L; x += 0.9) {
      const t = x < 7 ? x / 7 : x > RH.L - 7 ? (RH.L - x) / 7 : 1;
      n += linie([[x, RH.WAND, ZE], [x, RH.WAND + 6.7 * t, ZE + 10.2 * t]], 99);
    }
    k += `<path d="${n.replace(/M/g, " M")}" stroke="#4f8673" stroke-width=".2" fill="none" opacity=".7"/>`;
    k += `<path d="${linie([[7, 9.3, FIRST], [RH.L - 7, 9.3, FIRST]], 1.5)}" stroke="#a7d3bd" stroke-width=".5" fill="none"/>`;
    k += `<path d="${linie([[0, RH.WAND, ZE], [7, 9.3, FIRST]])}" stroke="#a7d3bd" stroke-width=".4" fill="none"/>`;
  }
  const gaube = (x, z) => {
    const y = RH.WAND + (z - ZE) / 10.2 * 6.7 - .3, G = ebene(0, y, 1, 0);
    return pfad(fp(G, [[x - .5, z], [x + .5, z], [x + .5, z + 1.1], [x, z + 1.7], [x - .5, z + 1.1]]), "#7fb59e") + pfad(fr(G, x - .25, z + .2, x + .25, z + .95), "#2f3b38");
  };
  for (const x of [2.6, 4.6, 12.2, 29.4, 37, 39]) k += gaube(x, 17.2);
  for (const x of [11.4, 13.2, 28.3, 30.1]) k += gaube(x, 20.8);
  /* ---- Westwand (schmal sichtbar): Backstein, Spitzbogenfenster, Ratskeller-Eingang ---- */
  k += pfad(fp(West, [[0, 6], [RH.T - RH.WAND, 6], [RH.T - RH.WAND, ZE], [0, ZE]]), "#7a4233");
  k += pfad(fp(West, [[0, 0], [RH.T, 0], [RH.T, 6.2], [0, 6.2]]), SAND_D);
  k += pfad(fp(West, [[4, 7.4], [6.2, 7.4], [6.2, 12.2], [5.1, 13.4], [4, 12.2]]), GLAS);
  k += pfad(fp(West, [[8.6, 7.4], [10.8, 7.4], [10.8, 12.2], [9.7, 13.4], [8.6, 12.2]]), GLAS);
  k += pfad(fp(West, [[10.6, 0], [13.4, 0], [13.4, 3.6], [10.6, 3.6]]), "#d9c9a6") + pfad(fp(West, bogen(12, 1.8, 0, 2.3, 6)), "#3a2c24");
  k += pfad(fp(West, [[0, ZE], [RH.T - RH.WAND, ZE], [RH.T - RH.WAND, ZE + .6], [0, ZE + .6]]), "#c9b896");
  /* ---- Obergeschoss: dunkler Backstein, Kreuzstockfenster, acht Standbilder ---- */
  k += pfad(fr(Wd, 0, 6, RH.L, ZE, 1.5), BACK);
  {
    let fug = "";
    for (let z = 6.6; z < ZE; z += 0.75) fug += fl(Wd, [[0, z], [RH.L, z]], 2);
    k += `<path d="${fug.replace(/M/g, " M")}" stroke="#4a241c" stroke-width=".18" fill="none" opacity=".5"/>`;
  }
  k += pfad(fr(Wd, -.2, ZE - .7, RH.L + .2, ZE, 1.5), SAND);
  k += pfad(fr(Wd, -.2, ZE - .9, RH.L + .2, ZE - .7, 1.5), "#9b8a6c");
  const fenster = (E, sm, w, z0, z1) => {
    let g = pfad(fr(E, sm - w / 2 - .25, z0 - .25, sm + w / 2 + .25, z1 + .25), SAND);
    g += pfad(fr(E, sm - w / 2, z0, sm + w / 2, z1), GLAS);
    g += `<path d="${fl(E, [[sm, z0], [sm, z1]])} ${fl(E, [[sm - w / 2, z1 - (z1 - z0) * .33], [sm + w / 2, z1 - (z1 - z0) * .33]])}" stroke="#e8dcc0" stroke-width=".35" fill="none"/>`;
    g += pfad(fp(E, [[sm - w / 2, z1 - .3], [sm - w / 2 + w * .35, z1 - .3], [sm - w / 2, z1 - (z1 - z0) * .6]]), "#ffffff", ` opacity=".16"`);
    return g;
  };
  const wingBays = [0, 1, 2, 3, 7, 8, 9, 10];
  for (const b of wingBays) k += fenster(Wd, (b + .5) * BAY, 1.9, 7.6, 13.1);
  /* Standbilder: Kaiser und sieben Kurfürsten unter Baldachinen */
  const figur = (sm, krone) => {
    const E = ebene(0, RH.WAND - .35, 1, 0), mk = mass(sm, RH.WAND);
    let g = pfad(fp(E, [[sm - .42, 8.05], [sm + .42, 8.05], [sm + .3, 8.45], [sm - .3, 8.45]]), SAND_D);
    g += pfad(fp(E, [[sm - .36, 8.45], [sm + .36, 8.45], [sm + .3, 9.3], [sm + .27, 9.86], [sm + .13, 10.02], [sm - .13, 10.02], [sm - .27, 9.86], [sm - .3, 9.3]]), S.lg("figur", [[0, "#a8977a"], [0.45, "#e6d8b8"], [1, "#c9b896"]], 0, 0, 1, 0));
    g += `<path d="${fl(E, [[sm - .08, 8.5], [sm - .04, 9.8]])} ${fl(E, [[sm + .14, 8.5], [sm + .1, 9.5]])}" stroke="#8e7e62" stroke-width=".18" fill="none"/>`;
    g += `<path d="${fl(E, [[sm + .26, 9.1], [sm + .34, 10.3]])}" stroke="#8e7e62" stroke-width=".22"/>`;
    const kopf = pr(...E(sm, 10.18));
    g += `<circle cx="${r(kopf[0])}" cy="${r(kopf[1])}" r="${r(.16 * mk)}" fill="#e0d2b2"/>`;
    g += krone ? pfad(fp(E, [[sm - .17, 10.3], [sm + .17, 10.3], [sm + .17, 10.48], [sm + .08, 10.4], [sm, 10.5], [sm - .08, 10.4], [sm - .17, 10.48]]), "#d8b04a") : pfad(fp(E, [[sm - .17, 10.3], [sm + .17, 10.3], [sm + .12, 10.42], [sm - .12, 10.42]]), "#b8a684");
    g += pfad(fp(E, [[sm - .44, 10.62], [sm + .44, 10.62], [sm + .44, 10.92], [sm, 11.8], [sm - .44, 10.92]]), SAND);
    g += pfad(fp(E, [[sm - .05, 11.8], [sm + .05, 11.8], [sm, 12.3]]), SAND_D);
    return g;
  };
  const figurS = [1 * BAY, 2 * BAY, 3 * BAY, EK.s0 - .55, EK.s1 + .55, 8 * BAY, 9 * BAY, 10 * BAY];
  figurS.forEach((sm, i) => { k += figur(sm, i === 3); });
  /* ---- Arkaden: elf Rundbögen, darüber Gebälk und Balustrade ---- */
  k += pfad(fr(A, 0, 0, RH.L, 6.2, 1.5), SAND);
  for (let i = 0; i < 11; i++) {
    const sm = (i + .5) * BAY;
    k += pfad(fp(A, bogen(sm, 2.75, 0, 3.4, 8)), LOCH);
    /* Rückwand der Halle mit Tür (nur in der Mitte) */
    if (i === 5) k += pfad(fp(A, bogen(sm, 1.2, 0, 1.7, 6)), "#1d1712");
    /* Archivolte und Schlussstein */
    k += `<path d="${fl(A, bogen(sm, 3.05, 3.4, 3.4, 8).slice(1, -1))}" stroke="#cdbb97" stroke-width=".5" fill="none"/>`;
    k += pfad(fp(A, [[sm - .22, 4.65], [sm + .22, 4.65], [sm + .16, 5.15], [sm - .16, 5.15]]), "#d6c49f");
    /* Säulen vor den Pfeilern */
    if (i > 0) k += pfad(fr(A, i * BAY - .22, 0, i * BAY + .22, 4.6), S.lg("saeule", [[0, "#c6b48f"], [0.5, "#f6ecd4"], [1, "#d3c29e"]], 0, 0, 1, 0));
    /* Rosetten in den Zwickeln */
    if (i > 0) { const c = pr(...A(i * BAY, 4.95)); k += `<circle cx="${r(c[0])}" cy="${r(c[1])}" r=".55" fill="#cdb995"/>`; }
  }
  k += pfad(fr(A, -.1, 5.3, RH.L + .1, 6.2, 1.5), "#e7d9b8");
  k += pfad(fr(A, -.1, 5.3, RH.L + .1, 5.45, 1.5), "#a8977a");
  /* Balustrade mit Docken und Obelisken */
  k += pfad(fr(A, -.1, 6.2, RH.L + .1, 6.45, 1.5), "#d7c6a2");
  {
    let d = "";
    for (let s = .25; s < RH.L; s += .42) d += fp(A, [[s - .1, 6.45], [s + .1, 6.45], [s + .14, 6.85], [s + .06, 7.05], [s - .06, 7.05], [s - .14, 6.85]]);
    k += pfad(d.replace(/Z M/g, "Z M"), "#e9dcbd");
  }
  k += pfad(fr(A, -.1, 7.05, RH.L + .1, 7.35, 1.5), SAND);
  for (let i = 0; i <= 11; i++) {
    if (i >= 4 && i <= 7) continue;
    const s = Math.min(RH.L - .2, Math.max(.2, i * BAY));
    k += pfad(fp(A, [[s - .2, 7.35], [s + .2, 7.35], [s + .08, 8.3], [s, 8.6], [s - .08, 8.3]]), "#e3d4b1");
  }
  /* ---- der Erker (Mittelrisalit) ---- */
  {
    const s0 = EK.s0, s1 = EK.s1, sm = (s0 + s1) / 2, Ws = ebene(s0, RH.ERK, 0, 1);
    /* Westseite des Erkers (schmal, Streiflicht) */
    k += pfad(fp(Ws, [[0, 0], [RH.WAND - RH.ERK, 0], [RH.WAND - RH.ERK, ZE + .6], [0, ZE + .6]]), SAND_D);
    k += pfad(fr(Ek, s0, 0, s1, ZE + .6, 1.5), SAND);
    for (let i = 0; i < 3; i++) {
      const c = s0 + (i + .5) * (s1 - s0) / 3;
      k += pfad(fp(Ek, bogen(c, 2.6, 0, 3.4, 8)), LOCH);
      k += `<path d="${fl(Ek, bogen(c, 2.9, 3.4, 3.4, 8).slice(1, -1))}" stroke="#cdbb97" stroke-width=".5" fill="none"/>`;
    }
    k += pfad(fr(Ek, s0 - .15, 5.3, s1 + .15, 6.4), "#e7d9b8");
    /* zwei Fenstergeschosse mit Pilastern: unten die Güldenkammer */
    for (const [z0, z1] of [[6.9, 10.1], [10.7, 13.8]]) {
      for (let i = 0; i < 3; i++) {
        const c = s0 + (i + .5) * (s1 - s0) / 3;
        k += pfad(fr(Ek, c - 1.2, z0, c + 1.2, z1), GLAS);
        k += `<path d="${fl(Ek, [[c, z0], [c, z1]])} ${fl(Ek, [[c - 1.2, z0 + (z1 - z0) * .62], [c + 1.2, z0 + (z1 - z0) * .62]])}" stroke="#e8dcc0" stroke-width=".3" fill="none"/>`;
      }
      for (let i = 0; i <= 3; i++) { const c = s0 + i * (s1 - s0) / 3; k += pfad(fr(Ek, c - .3, z0 - .2, c + .3, z1 + .2), S.lg("pilaster", [[0, "#cdbb97"], [0.5, "#f3e7cb"], [1, "#d8c7a3"]], 0, 0, 1, 0)); }
      k += pfad(fr(Ek, s0 - .1, z1 + .2, s1 + .1, z1 + .55), "#d9c8a4");
    }
    k += pfad(fr(Ek, s0 - .3, ZE - .1, s1 + .3, ZE + .6), "#e9dcbd");
    /* der hohe Ziergiebel: drei Stufen mit Voluten und Obelisken, oben eine Figur */
    const st = [[ZE + .6, 18.8, s1 - s0], [18.8, 22.4, 7.4], [22.4, 25.6, 4.2]];
    st.forEach(([z0, z1, w], i) => {
      const a = sm - w / 2, b = sm + w / 2;
      k += pfad(fr(Ek, a, z0, b, z1), SAND);
      /* Voluten an den Seiten (bis zur nächsten Stufe) */
      if (i < 2) {
        const w2 = st[i + 1][2];
        for (const sg of [-1, 1]) {
          const x0 = sm + sg * w / 2, x1 = sm + sg * w2 / 2;
          k += pfad(fp(Ek, [[x0, z1], [x0 - sg * .2, z1 + .6], [x0 - sg * (w / 2 - w2 / 2) * .5, z1 + 1.1], [x1, z1 + 2.2], [x1, z1]]), SAND_D);
          const c = pr(...Ek(x0 - sg * .4, z1 + .55)); k += `<circle cx="${r(c[0])}" cy="${r(c[1])}" r=".5" fill="none" stroke="#a8977a" stroke-width=".3"/>`;
        }
      }
      /* Fenster der Stufe */
      const nF = i === 0 ? 3 : i === 1 ? 2 : 1;
      for (let j = 0; j < nF; j++) { const c = a + (j + .5) * w / nF; k += pfad(fr(Ek, c - .55, z0 + .7, c + .55, z1 - .6), GLAS); }
      k += pfad(fr(Ek, a - .25, z1 - .25, b + .25, z1 + .15), "#d9c8a4");
      /* Obelisken an den Ecken */
      for (const s of [a, b]) k += pfad(fp(Ek, [[s - .22, z1 + .15], [s + .22, z1 + .15], [s + .08, z1 + 1.6], [s, z1 + 1.9], [s - .08, z1 + 1.6]]), "#cbb994");
    });
    /* Bekrönung: Rundgiebel und Figur */
    k += pfad(fp(Ek, [[sm - 2.1, 25.6], ...bogen(sm, 4.2, 25.6, 25.6, 8).slice(1, -1), [sm + 2.1, 25.6]]), SAND);
    k += pfad(fp(Ek, [[sm - .3, 27.6], [sm + .3, 27.6], [sm + .25, 29.2], [sm, 29.6], [sm - .25, 29.2]]), "#bfae8c");
    /* Wappen: der Bremer Schlüssel auf Rot */
    {
      const c = pr(...Ek(sm, 24)), mk = mass(sm, 0);
      k += `<g transform="translate(${t2(c[0])} ${t2(c[1])}) scale(${(mk / 10).toFixed(4)})"><path d="M-6 -8 H6 V2 Q6 8 0 10 Q-6 8 -6 2 Z" fill="#c4202c" stroke="#e9dcbd" stroke-width=".8"/><circle cx="0" cy="-3.2" r="2.4" fill="none" stroke="#f2f2f2" stroke-width="1.2"/><path d="M0 -.8 V7 M0 4 H2.4 M0 6 H2" stroke="#f2f2f2" stroke-width="1.2"/></g>`;
    }
    rhTeile.erker = pr(...Ek(sm, 10));
    rhTeile.giebel = pr(...Ek(sm, 22));
  }
  /* ---- zwei kleinere Zwerchgiebel auf dem Dach ---- */
  for (const sm of [2 * BAY, 9 * BAY]) {
    const E = ebene(0, RH.WAND, 1, 0);
    k += pfad(fr(E, sm - 2.2, ZE, sm + 2.2, 18), SAND);
    k += pfad(fr(E, sm - 1.2, 18, sm + 1.2, 20.4), SAND);
    for (const sg of [-1, 1]) k += pfad(fp(E, [[sm + sg * 2.2, 18], [sm + sg * 1.9, 18.6], [sm + sg * 1.2, 19.6], [sm + sg * 1.2, 18]]), SAND_D);
    k += pfad(fp(E, [[sm - 1.2, 20.4], [sm, 21.6], [sm + 1.2, 20.4]]), SAND);
    k += pfad(fr(E, sm - .7, 15.5, sm + .7, 17.4), GLAS) + pfad(fr(E, sm - .4, 18.6, sm + .4, 20), GLAS);
    for (const s of [sm - 2.2, sm + 2.2, sm - 1.2, sm + 1.2]) { const z = Math.abs(s - sm) > 2 ? 18 : 20.4; k += pfad(fp(E, [[s - .16, z], [s + .16, z], [s + .05, z + 1.2], [s, z + 1.4], [s - .05, z + 1.2]]), "#cbb994"); }
    k += pfad(fp(E, [[sm - .06, 21.6], [sm + .06, 21.6], [sm, 22.6]]), "#cbb994");
  }
  /* Schlagschatten des Erkers nach Osten (Sonne 15° westlich von Süden) */
  k += pfad(fp(A, [[EK.s1, 0], [EK.s1 + .25, 0], [EK.s1 + .25, 5.3], [EK.s1, 5.3]]), "#3b3226", ` opacity=".28"`);
  k += pfad(fp(Wd, [[EK.s1, 7.35], [EK.s1 + .95, 7.35], [EK.s1 + .95, ZE - .9], [EK.s1, ZE - .9]]), "#1d0f0a", ` opacity=".3"`);
  /* Licht: Sonne von Süden — die Front hell, unten in den Arkaden Schatten */
  k += pfad(fr(A, 0, 0, RH.L, 7.4, 1.5), S.lg("rhlicht", [[0, "#000", 0], [0.6, "#000", 0], [1, "#fff6dc", 0.12]], 0, 0, 1, 0));
  const zA = pr(...A(2.5 * BAY, 1)), zE = pr(...Ek(EK.s0 + 1.8, 9)), zG = rhTeile.giebel, zS = pr(...Wd(9 * BAY, 9.4)), zD = pr(...Wd(5.5 * BAY, 20));
  let zx0 = pr(0, RH.T, 0)[0] - 3, zx1 = pr(RH.L, 0, 0)[0] + 3, zy0 = pr(...Ek((EK.s0 + EK.s1) / 2, 29.8))[1] - 3, zy1 = pr(0, 0, 0)[1] + 4;
  let zw = zx1 - zx0, zh = zy1 - zy0;
  if (zw < zh * 1.5) { const d = zh * 1.5 - zw; zx0 -= d / 2; zw = zh * 1.5; } else { const d = zw / 1.5 - zh; zy0 -= d * .7; zh = zw / 1.5; }
  S.teil({ id: "rathaus", de: "das Rathaus", syl: "RAT-haus", it: "il municipio", itSyl: "mu-ni-CI-pio", en: "town hall", x: 0, y: 0, kunst: k,
    tipp: "Das Rathaus ist über 600 Jahre alt und gehört zum Welterbe der UNESCO — zusammen mit dem Roland.",
    zoom: { x: r(zx0), y: r(zy0), w: r(zw), h: r(zh) },
    unter: [
      { id: "arkade", de: "die Arkade", syl: "ar-KA-de", it: "il portico", itSyl: "POR-ti-co", en: "arcade", x: zA[0], y: zA[1], kunst: flaeche(-5, -9, 10, 10),
        tipp: "Unter den elf Bögen der Arkaden kann man trocken über den Markt gehen." },
      { id: "erker", de: "der Erker", syl: "ER-ker", it: "il bovindo", itSyl: "bo-VIN-do", en: "oriel", x: zE[0], y: zE[1], kunst: flaeche(-5, -10, 10, 14),
        tipp: "Hinter den großen Fenstern des Erkers liegt die prächtige Güldenkammer." },
      { id: "giebel", de: "der Giebel", syl: "GIE-bel", it: "il frontone", itSyl: "fron-TO-ne", en: "gable", x: zG[0], y: zG[1], kunst: flaeche(-6, -14, 12, 20),
        tipp: "Der Giebel mit Schnecken und Spitzsäulen ist typisch für die Weserrenaissance." },
      { id: "statue", de: "die Statue", syl: "STA-tu-e", it: "la statua", itSyl: "STA-tu-a", en: "statue", x: zS[0], y: zS[1], kunst: flaeche(-2.4, -7, 4.8, 9, 0.6),
        tipp: "Acht Figuren schmücken die Front: der Kaiser und die sieben Kurfürsten." },
      { id: "dach", de: "das Dach", syl: "DACH", it: "il tetto", itSyl: "TET-to", en: "roof", x: zD[0], y: zD[1], kunst: flaeche(-14, -8, 28, 12),
        tipp: "Das Dach ist aus Kupfer — darum ist es grün." },
    ] });
}

/* =====================================================================
   5 — DIE BREMER STADTMUSIKANTEN (Bronze, Westseite des Rathauses)
       Lupe: Esel, Hund, Katze, Hahn
   ===================================================================== */
const SM = { x: -1.5, y: 6 };
{
  const fu = pr(SM.x, SM.y, 0), mk = mass(SM.x, SM.y), sk = mk / 100;   // Zeichnung in Zentimetern, Blick nach links (Westen)
  const BZ = S.lg("bz", [[0, "#2e2a1f"], [0.55, "#4a4330"], [1, "#6a5f42"]], 0, 0, 1, 0);     // Bronze, Licht von rechts
  const BZ_D = "#2a2619", BZ_L = "#8a7b55";
  const GOLDB = S.lg("goldbein", [[0, "#8a6a26"], [0.45, "#f3d27a"], [0.7, "#fff1b8"], [1, "#c8973a"]], 0, 0, 1, 0);
  let g = `<ellipse cx="4" cy="2" rx="84" ry="9" fill="#1b140c" opacity=".35" filter="url(#bw_weich)"/>`;
  /* niedriger Steinsockel, darauf die Bronzeplatte */
  g += `<path d="M-64 0 L64 0 L64 -22 L-64 -22 Z" fill="${S.lg("smsockel", [[0, "#a9a396"], [1, "#d5cfc2"]], 0, 0, 1, 0)}"/><path d="M-66 -22 L66 -22 L64 -25 L-64 -25 Z" fill="#e8e2d5"/>`;
  g += `<path d="M-58 -25 L58 -25 L56 -28 L-56 -28 Z" fill="${BZ_D}"/>`;
  const Z = -28, k9 = 0.92;
  let t = "";
  /* DER ESEL: schlank, langer Hals, lange Ohren; die Vorderbeine golden blank */
  const bein = (x, oben, f, w = 6) => `<path d="M${x - w / 2} ${oben} C${x - w / 2} ${oben + 20} ${x - w * .3} ${-34} ${x - w * .32} -12 L${x - w * .42} -4 Q${x - w * .5} 0 ${x - w * .1} 0 L${x + w * .55} 0 L${x + w * .32} -6 C${x + w * .3} -30 ${x + w * .5} ${oben + 20} ${x + w / 2} ${oben} Z" fill="${f}"/>`;
  t += bein(-27, -60, "#b8892e", 5.6) + bein(25, -60, BZ_D, 6);                         // ferne Beine
  t += `<path d="M-60 -116 Q-57 -134 -48 -147 Q-46 -134 -54 -114 Z" fill="${BZ_D}"/><path d="M-66 -116 Q-66 -136 -58 -150 Q-54 -136 -60 -114 Z" fill="${BZ}"/>`;
  t += `<path d="M-40 -60 C-47 -64 -50 -72 -52 -78 L-66 -96 C-72 -100 -82 -96 -94 -94 Q-102 -93 -101 -100 C-100 -108 -88 -114 -76 -118 L-64 -120 C-56 -118 -48 -108 -40 -100 C-34 -94 -28 -92 -20 -92 C0 -94 20 -90 36 -94 C46 -96 52 -86 47 -74 C44 -64 38 -60 30 -60 C10 -56 -20 -56 -40 -60 Z" fill="${BZ}"/>`;
  t += bein(-37, -62, GOLDB, 6.4) + bein(35, -64, BZ, 6.8);                              // nahe Beine
  t += `<path d="M-38.4 -54 C-38 -40 -38.6 -26 -38.4 -10" stroke="#fffbe6" stroke-width="1.1" opacity=".75" fill="none"/>`;
  t += `<path d="M-64 -120 C-56 -117 -48 -108 -40 -100" stroke="${BZ_L}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
  t += `<ellipse cx="-78" cy="-109" rx="2.2" ry="1.6" fill="#15120b"/><ellipse cx="-97" cy="-97" rx="1.6" ry="1" fill="#15120b"/>`;
  t += `<path d="M-100 -95 Q-92 -92 -86 -95" stroke="#15120b" stroke-width=".8" fill="none"/><path d="M-90 -112 Q-82 -116 -72 -116" stroke="${BZ_L}" stroke-width="1.2" fill="none" opacity=".7"/>`;
  t += `<path d="M45 -86 Q55 -72 51 -46 L47 -46 Q50 -70 42 -82 Z" fill="${BZ_D}"/><ellipse cx="49" cy="-42" rx="3.4" ry="5" fill="${BZ_D}"/>`;
  t += `<path d="M-18 -91 C2 -93 22 -89 38 -93 C46 -94 50 -86 47 -76" stroke="${BZ_L}" stroke-width="1.6" fill="none" opacity=".8"/>`;
  /* DER HUND: steht auf dem Rücken des Esels, Kopf hoch, bellt */
  t += `<path d="M-19 -108 L-17 -92 L-13 -92 L-14 -108 Z M13 -110 L15 -92 L19 -92 L18 -110 Z" fill="${BZ_D}"/>`;
  t += `<path d="M-24 -108 C-28 -112 -30 -118 -32 -122 L-40 -134 L-50 -135 L-55 -136 L-47 -139 L-57 -144 C-50 -148 -44 -150 -40 -150 L-36 -151 L-31 -160 L-31 -148 C-29 -142 -25 -128 -17 -124 L14 -124 C20 -124 23 -120 22 -114 L20 -108 C0 -106 -14 -106 -24 -108 Z" fill="${BZ}"/>`;
  t += `<path d="M-23 -110 L-21 -92 L-17 -92 L-18 -110 Z M8 -110 L10 -92 L14 -92 L13 -110 Z" fill="${BZ}"/>`;
  t += `<path d="M21 -120 Q30 -128 28 -141" stroke="${BZ}" stroke-width="3.2" fill="none" stroke-linecap="round"/>`;
  t += `<circle cx="-44" cy="-145" r="1.5" fill="#15120b"/><path d="M-16 -123 L13 -123" stroke="${BZ_L}" stroke-width="1.2" opacity=".8"/>`;
  /* DIE KATZE: auf dem Hund, Buckel, Schwanz hoch */
  t += `<path d="M-16 -136 L-15 -124 L-12 -124 L-12 -136 Z M6 -136 L8 -124 L11 -124 L10 -136 Z" fill="${BZ}"/>`;
  t += `<path d="M-16 -134 C-20 -138 -22 -142 -22 -146 L-26 -150 C-30 -150 -34 -152 -34 -156 L-33 -160 L-32 -165 L-29 -160 L-25 -163 L-24 -158 C-18 -158 -8 -161 0 -159 C8 -157 12 -151 12 -142 L11 -134 C0 -132 -8 -132 -16 -134 Z" fill="${BZ}"/>`;
  t += `<path d="M11 -144 Q22 -150 18 -166 Q17 -172 21 -176" stroke="${BZ}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
  t += `<circle cx="-29" cy="-156" r="1.1" fill="#15120b"/><path d="M-22 -158 C-12 -160 0 -160 9 -154" stroke="${BZ_L}" stroke-width="1.1" fill="none" opacity=".8"/>`;
  /* DER HAHN: ganz oben, kräht, Flügel leicht offen, Sichelfedern */
  t += `<path d="M-6 -168 L-7 -158 M-1 -168 L0 -158" stroke="${BZ_D}" stroke-width="1.6"/>`;
  t += `<path d="M4 -182 C10 -196 18 -205 23 -198 C16 -198 12 -190 8 -180 Z M6 -178 C14 -188 22 -193 25 -186 C18 -186 14 -182 9 -175 Z" fill="${BZ_D}"/>`;
  t += `<path d="M-12 -168 C-18 -172 -18 -182 -14 -188 L-15 -196 L-20 -197 L-26 -199 L-20 -200 L-26 -202.4 L-19 -203 C-14 -206 -10 -202 -10 -196 C-8 -190 -4 -186 4 -184 C10 -184 12 -180 10 -172 C4 -166 -6 -166 -12 -168 Z" fill="${BZ}"/>`;
  t += `<path d="M-8 -182 C-2 -188 6 -186 9 -179 C2 -176 -4 -176 -8 -182 Z" fill="${BZ_L}" opacity=".7"/>`;
  t += `<path d="M-20 -203 Q-21 -209 -18 -207.4 Q-17 -211 -14.4 -207 Q-12 -209 -12 -204 Z" fill="${BZ}"/><ellipse cx="-19.6" cy="-195" rx="1.6" ry="2.4" fill="${BZ_D}"/><circle cx="-16.6" cy="-200.6" r=".9" fill="#15120b"/>`;
  g += `<g transform="translate(0 ${Z}) scale(${k9})">${t}</g>`;
  const k = `<g transform="translate(${t2(fu[0])} ${t2(fu[1])}) scale(${sk.toFixed(4)})">${g}</g>` + flaeche(fu[0] - 4, fu[1] - 8.6, 8, 9.4, 0.6);
  const U = (cx, cy) => [fu[0] + cx * sk, fu[1] + (Z + cy * k9) * sk];
  const ue = U(-24, -70), uh = U(-18, -128), uk = U(-10, -150), ug = U(-6, -186);
  S.teil({ id: "stadtmusikanten", de: "die Stadtmusikanten", syl: "STADT-mu-si-kan-ten", it: "i musicanti di Brema", itSyl: "mu-si-CAN-ti di BRE-ma", en: "Town Musicians of Bremen", x: 0, y: 0, kunst: k, oben: true,
    tipp: "Esel, Hund, Katze und Hahn aus dem Märchen der Brüder Grimm. Die Bronze steht seit 1953 hier.",
    zoom: { x: r(fu[0] - 7.5), y: r(fu[1] - 9.4), w: 15, h: 10 },
    unter: [
      { id: "esel", de: "der Esel", syl: "E-sel", it: "l'asino", itSyl: "A-si-no", en: "donkey", x: ue[0], y: ue[1], kunst: flaeche(-3.4, -2.2, 6.6, 4.8, .3),
        tipp: "Wer die Vorderbeine des Esels mit beiden Händen hält, darf sich etwas wünschen. Darum glänzen sie golden." },
      { id: "hund", de: "der Hund", syl: "HUND", it: "il cane", itSyl: "CA-ne", en: "dog", x: uh[0], y: uh[1], kunst: flaeche(-1.8, -.9, 4, 1.7, .3) },
      { id: "katze", de: "die Katze", syl: "KAT-ze", it: "il gatto", itSyl: "GAT-to", en: "cat", x: uk[0], y: uk[1], kunst: flaeche(-1.4, -.6, 3.2, 1.1, .3) },
      { id: "hahn", de: "der Hahn", syl: "HAHN", it: "il gallo", itSyl: "GAL-lo", en: "rooster", x: ug[0], y: ug[1], kunst: flaeche(-1.1, -1, 2.4, 1.9, .3),
        tipp: "Im Märchen kräht der Hahn so laut, dass die Räuber aus dem Haus fliehen." },
    ] });
}

/* =====================================================================
   6 — DER ROLAND (vor dem Rathaus, Blick zum Dom) — Lupe: Schwert,
       Baldachin
   ===================================================================== */
const RO = { x: 30, y: -14 };
{
  const fu = pr(RO.x, RO.y, 0), mk = mass(RO.x, RO.y), sk = mk / 10;   // Zeichnung in Dezimetern
  let g = `<ellipse cx="6" cy="1" rx="26" ry="3" fill="#1b140c" opacity=".3" filter="url(#bw_weich)"/>`;
  /* Schatten nach Nordnordosten (hinter ihm) */
  g += `<path d="M-8 0 L22 -4 L30 -6 L14 1 Z" fill="#1f2430" opacity=".2"/>`;
  /* Stufen (Sonnenseite links/Süden hell) */
  for (const [w, z, h] of [[21, 0, 4], [17, 4, 4], [13, 8, 4]]) g += `<rect x="${-w}" y="${-(z + h)}" width="${2 * w}" height="${h}" fill="${ROLSTEIN}"/><rect x="${-w}" y="${-(z + h)}" width="${2 * w}" height=".9" fill="#f6f1e6"/><rect x="${w * .55}" y="${-(z + h)}" width="${w * .45}" height="${h}" fill="#8f8879" opacity=".35"/>`;
  /* Podest */
  g += `<rect x="-7.6" y="-19" width="15.2" height="7" fill="${ROLSTEIN}"/><rect x="-8.2" y="-19.8" width="16.4" height="1.2" fill="#f2ede2"/><rect x="2.6" y="-19" width="5" height="7" fill="#8f8879" opacity=".35"/>`;
  /* Rückenpfeiler (links, hinter seinem Rücken) bis zum Baldachin */
  g += `<rect x="-7.6" y="-76" width="4.6" height="57" fill="${S.lg("rolpfeiler", [[0, "#bfb6a2"], [1, "#d9d1bf"]], 0, 0, 1, 0)}"/>`;
  /* DER ROLAND im Profil nach rechts (zum Dom), leicht von hinten: Kettenpanzer an den Beinen, Waffenrock mit
     tief sitzendem Gürtel, der Mantel fällt über den Rücken, lange Locken, das Schwert aufrecht in der Rechten */
  S.def(`<pattern id="${S.id("kette")}" width=".7" height=".6" patternUnits="userSpaceOnUse"><rect width=".7" height=".6" fill="#d9d1bf"/><circle cx=".35" cy=".3" r=".2" fill="none" stroke="#9d9482" stroke-width=".08"/></pattern>`);
  const KETTE = `url(#${S.id("kette")})`;
  const RS = S.lg("rolfig", [[0, "#bdb39d"], [0.5, "#ece6d8"], [1, "#d6cdb9"]], 0, 0, 1, 0);
  const bein = (dx, f) => `<path d="M${dx} -45 L${4.6 + dx} -45 L${4.4 + dx} -36 Q${4.9 + dx} -33.4 ${4.2 + dx} -31.6 L${3.4 + dx} -22.4 L${3.2 + dx} -21 L${1 + dx} -21 L${.8 + dx} -24 Q${.2 + dx} -28 ${.6 + dx} -31 Q${.2 + dx} -34 ${dx} -36 Z" fill="${f}"/>`;
  g += bein(-1.6, "#a69c88") + `<path d="M-1 -21 L2 -21 L4.8 -20.2 L4.8 -19.6 L-1.2 -19.6 Z" fill="#9d9482"/>`;
  g += bein(0, KETTE) + bein(0, S.lg("beinlicht", [[0, "#000", 0.18], [0.6, "#000", 0], [1, "#fff", 0.2]], 0, 0, 1, 0));
  g += `<path d="M.6 -21 L3.6 -21 L6.4 -20.2 L6.4 -19.6 L.4 -19.6 Z" fill="#c9c0ab"/><ellipse cx="4.1" cy="-32.6" rx=".95" ry="1.2" fill="#f1ece0"/>`;
  /* Mantel hinten (links), mit Falten */
  g += `<path d="M-2.2 -64 C-5 -60 -6.6 -50 -6.8 -40 L-6.2 -36.6 L-3.4 -37.6 L-3.2 -46 C-3.2 -54 -2.4 -60 -1.2 -63 Z" fill="#c3baa5"/>`;
  g += `<path d="M-4.4 -58 C-5.2 -52 -5.4 -46 -5.2 -38 M-3.2 -60 C-3.8 -54 -4.2 -46 -4 -38" stroke="#9d9482" stroke-width=".3" fill="none"/>`;
  /* Waffenrock bis zu den Knien, tiefer Prunkgürtel */
  g += `<path d="M-2.6 -62 C-3.4 -55 -3.6 -48 -3.6 -44 L-4 -37 Q.6 -35.4 5.8 -37 L5.2 -44 C5.6 -50 5.6 -57 4.4 -62 Q1 -64 -2.6 -62 Z" fill="${RS}"/>`;
  g += `<path d="M-1 -60 C-1.4 -52 -1.6 -44 -1.4 -37 M1.6 -61 C1.4 -52 1.6 -44 2 -36.4 M3.6 -60 C3.8 -52 4 -44 4.4 -36.6" stroke="#b5ab95" stroke-width=".28" fill="none"/>`;
  g += `<path d="M-3.7 -46.4 L5.4 -45.2 L5.4 -43.8 L-3.8 -45 Z" fill="#a39983"/>`;
  for (const x of [-2.6, -.6, 1.4, 3.4]) g += `<circle cx="${x}" cy="${r(-45.6 + (x + 3.7) * .13)}" r=".45" fill="#ddd5c2"/>`;
  /* Schildrand vor der Brust (der Schild selbst ist abgewandt) */
  g += `<path d="M4.4 -63.4 Q6.4 -58 6 -48 L5.2 -46.6 Q5.6 -57 3.8 -62.6 Z" fill="#b8ae98"/>`;
  /* rechter Arm: Schulter, Oberarm, Unterarm nach vorn; die Hand hält das Schwert */
  g += `<path d="M.2 -63.8 C2.6 -63.6 3.8 -61 3.6 -58 L3.2 -54.6 L1 -54.8 L.8 -59 Z" fill="#e3dccb"/>`;
  g += `<path d="M1.2 -56.6 L6.2 -55 L6.6 -52.4 L1.2 -53.4 Z" fill="#ddd5c3"/>`;
  /* DAS SCHWERT: Knauf, Griff, Parierstange, lange blanke Klinge */
  g += `<circle cx="7" cy="-50.6" r=".6" fill="#a39983"/><rect x="6.65" y="-55.4" width=".7" height="4.4" fill="#8a8171"/>`;
  g += `<rect x="4.9" y="-56.2" width="4.2" height=".8" rx=".35" fill="#a39983"/>`;
  g += `<path d="M6.5 -56.2 L6.6 -80.6 L7 -82.6 L7.4 -80.6 L7.5 -56.2 Z" fill="${S.lg("klinge", [[0, "#aeb3b7"], [0.5, "#f6f8f9"], [1, "#9fa5aa"]], 0, 0, 1, 0)}"/><path d="M7 -56 V-80" stroke="#8c9297" stroke-width=".12"/>`;
  g += `<ellipse cx="6.9" cy="-53.4" rx="1.2" ry="1" fill="#ece6d8"/>`;
  /* Kopf im Profil, lange Locken bis auf die Schultern */
  g += `<path d="M.4 -66.8 L2.6 -66.6 L2.8 -63.4 L.4 -63.6 Z" fill="#e3dccb"/>`;
  g += `<path d="M-1.6 -70 Q-2 -74 .6 -75.6 Q3.6 -76.4 4.6 -73.4 L4.6 -72 L5.3 -70.6 L4.6 -70.2 L4.6 -69.2 Q4.4 -67.6 3 -67.2 L1.2 -67.4 Q-1 -66.6 -1.6 -70 Z" fill="#efe9dc"/>`;
  g += `<path d="M-2 -69 Q-2.8 -74 .4 -76.2 Q3.8 -77.2 4.9 -74 Q2.8 -75 1.6 -73.6 Q1 -71 1.4 -67.6 Q0 -64.6 -1.8 -64 Q-3.2 -66 -2 -69 Z" fill="#cbc2ad"/>`;
  for (const [x, y] of [[-2.4, -65.2], [-2.8, -67.4], [-2.6, -69.8], [-2, -72.4], [-.8, -74.8], [1, -76], [3, -76.2]]) g += `<circle cx="${x}" cy="${y}" r=".75" fill="#bcb29c"/><circle cx="${x + .2}" cy="${y - .2}" r=".3" fill="#ddd5c2"/>`;
  g += `<circle cx="3.7" cy="-72.3" r=".28" fill="#5a5246"/><path d="M3.2 -73.2 L4.3 -73.4" stroke="#a39983" stroke-width=".2"/>`;
  /* DER BALDACHIN: gotisches Gehäuse mit Spitzbögen, Fialen und Kreuzblume */
  g += `<path d="M-9 -76 L9 -76 L9 -84 L-9 -84 Z" fill="${ROLSTEIN}"/>`;
  for (const x of [-6, 0, 6]) g += `<path d="M${x - 2.2} -76 L${x - 2.2} -79.6 Q${x} -82.6 ${x + 2.2} -79.6 L${x + 2.2} -76 Z" fill="#8e8676" opacity=".55"/>`;
  g += `<rect x="-9.6" y="-85" width="19.2" height="1.4" fill="#f2ede2"/>`;
  g += `<path d="M-8 -85 L0 -100 L8 -85 Z" fill="${S.lg("rolhelm", [[0, "#cfc6b2"], [1, "#e6dfd0"]], 0, 0, 1, 0)}"/>`;
  for (const x of [-9, 9]) g += `<path d="M${x - 1} -85 L${x - .6} -92 L${x} -95 L${x + .6} -92 L${x + 1} -85 Z" fill="#d8d0bd"/>`;
  g += `<path d="M-1 -100 L1 -100 L0 -103.6 Z" fill="#d8d0bd"/><circle cx="0" cy="-101.4" r="1" fill="#e6dfd0"/>`;
  for (let i = 1; i < 5; i++) g += `<path d="M${r(-8 + i * 1.6)} ${r(-85 - i * 3)} l-1 -.8" stroke="#a59c86" stroke-width=".5"/>`;
  const k = `<g transform="translate(${t2(fu[0])} ${t2(fu[1])}) scale(${sk.toFixed(4)})">${g}</g>`;
  const U = (cx, cy) => [fu[0] + cx * sk, fu[1] + cy * sk];
  const us = U(7, -66), ub = U(0, -88);
  S.teil({ id: "roland", de: "der Roland", syl: "RO-land", it: "il Roland (statua)", itSyl: "RO-land", en: "Roland statue", x: 0, y: 0, kunst: k,
    tipp: "Der Roland steht seit 1404 hier. Er blickt zum Dom und zeigt: Bremen ist eine freie Stadt.",
    zoom: { x: r(fu[0] - 20), y: r(fu[1] - 38), w: 42, h: 40 },
    unter: [
      { id: "schwert", de: "das Schwert", syl: "SCHWERT", it: "la spada", itSyl: "SPA-da", en: "sword", x: us[0], y: us[1], kunst: flaeche(-1.4, -6.2, 2.8, 12, .4),
        tipp: "Das Schwert steht für das Recht der Stadt, selbst Gericht zu halten." },
      { id: "baldachin", de: "der Baldachin", syl: "BAL-da-chin", it: "il baldacchino", itSyl: "bal-dac-CHI-no", en: "canopy", x: ub[0], y: ub[1], kunst: flaeche(-3.4, -5, 6.8, 6.4, .4),
        tipp: "Unter dem steinernen Dach steht der Roland geschützt vor Regen." },
    ] });
}

/* =====================================================================
   7 — DER SCHÜTTING (Südseite, gegenüber dem Rathaus) — Lupe: Portal
   ===================================================================== */
const SCH = { x0: 8, x1: 40, y: -57, T: 15 };
{
  let k = "";
  const N = ebene(SCH.x1, SCH.y, -1, 0);     // Nordfront: s = 0 (Ostende, im Bild links) … 32 (Westende)
  const Wg = ebene(SCH.x0, SCH.y, 0, -1);    // Westgiebel: s = 0 (Nordecke) … 15 (Süden)
  const L = SCH.x1 - SCH.x0, ZT = 10.6, FI = 19.4;
  /* Farben der Nordseite: Sandstein im Schatten (kühl), Westgiebel im Streiflicht */
  const SN = S.lg("schnord", [[0, "#b9ae98"], [1, "#a69c88"]]), SN_D = "#948a77", SN_K = "#c7bca5", GLAS_N = S.lg("glasn", [[0, "#6f8496"], [0.5, "#38434d"], [1, "#2a3138"]]);
  /* Dach (dunkel, unsicher), Gauben */
  k += pfad(poly([[SCH.x1, SCH.y, ZT], [SCH.x0, SCH.y, ZT], [SCH.x0, SCH.y - SCH.T / 2, FI], [SCH.x1, SCH.y - SCH.T / 2, FI]], 2), S.lg("schdach", [[0, "#3c4246"], [1, "#545b60"]], 0, 0, 1, 0));
  k += `<path d="${linie([[SCH.x0, SCH.y - SCH.T / 2, FI], [SCH.x1, SCH.y - SCH.T / 2, FI]], 2)}" stroke="#7d868c" stroke-width=".5" fill="none"/>`;
  for (const s of [3.4, 7.4, 24.6, 28.6]) { const E = ebene(SCH.x1, SCH.y - 1.6, -1, 0); k += pfad(fp(E, [[s - .55, 12.4], [s + .55, 12.4], [s + .55, 13.7], [s, 14.5], [s - .55, 13.7]]), "#5f676c") + pfad(fr(E, s - .27, 12.6, s + .27, 13.5), "#1f2427"); }
  /* Ostgiebel als Umriss über dem Dach (fern, links) */
  {
    const E = ebene(SCH.x1, SCH.y, 0, -1);
    k += pfad(fp(E, [[0, ZT], [1.4, ZT], [1.4, 12.6], [2.6, 13.2], [2.6, 14.6], [4, 14.6], [4, 16.4], [5, 17], [5, 18.4], [6.4, 18.4], [7.5, 21.4], [8.6, 18.4], [10, 18.4], [10, 17], [11, 16.4], [11, 14.6], [12.4, 14.6], [12.4, 13.2], [13.6, 12.6], [13.6, ZT], [15, ZT]]), "#a2988a");
  }
  /* Nordfront */
  k += pfad(fr(N, 0, 0, L, ZT, 2), SN);
  const fenster = (sm, z0, z1) => pfad(fr(N, sm - .95, z0 - .2, sm + .95, z1 + .2), SN_K) + pfad(fr(N, sm - .75, z0, sm + .75, z1), GLAS_N) + `<path d="${fl(N, [[sm, z0], [sm, z1]])} ${fl(N, [[sm - .75, z0 + (z1 - z0) * .64], [sm + .75, z0 + (z1 - z0) * .64]])}" stroke="#cfc4ad" stroke-width=".3" fill="none"/>`;
  for (let i = 0; i < 10; i++) { const sm = 1.8 + i * 3.16; if (Math.abs(sm - 16) > 2.4) k += fenster(sm, 1.4, 4); k += fenster(sm, 5.6, 9.2); }
  for (const z of [4.7, 10]) k += pfad(fr(N, -.1, z, L + .1, z + .5, 2), SN_K);
  k += pfad(fr(N, -.1, 0, L + .1, .6, 2), SN_D);
  /* Quaderfugen, Pilaster zwischen den Fensterachsen, Giebelchen über den Fenstern, Zahnschnitt unter der Traufe */
  {
    let f = "";
    for (let z = 1.2; z < 10; z += .62) if (Math.abs(z - 4.9) > .4) f += fl(N, [[0, z], [L, z]], 2) + " ";
    k += `<path d="${f}" stroke="#8e8574" stroke-width=".14" fill="none" opacity=".55"/>`;
    for (let i = 0; i <= 10; i++) { const s0 = .22 + i * 3.16; if (s0 > 13.6 && s0 < 18.4) continue; k += pfad(fr(N, s0 - .2, .6, s0 + .2, 10), "#c4b9a2") + pfad(fr(N, s0 + .12, .6, s0 + .2, 10), "#8f8675"); }
    for (let i = 0; i < 10; i++) { const sm = 1.8 + i * 3.16; k += pfad(fp(N, i % 2 ? [[sm - 1.05, 9.42], [sm + 1.05, 9.42], [sm, 9.95]] : [[sm - 1.05, 9.42], [sm + 1.05, 9.42], [sm + .8, 9.8], [sm, 9.92], [sm - .8, 9.8]]), "#cdbfa5"); if (Math.abs(sm - 16) > 2.4) k += pfad(fp(N, [[sm - 1, 4.22], [sm + 1, 4.22], [sm, 4.62]]), "#cdbfa5"); }
    k += `<path d="${fl(N, [[0, 10.32], [L, 10.32]], 2)}" stroke="#6f6758" stroke-width=".55" stroke-dasharray=".35 .45" fill="none"/>`;
  }
  /* das Portal mit Säulen und dem Wahlspruch */
  {
    const sm = 16;
    k += pfad(fr(N, sm - 2.2, 0, sm + 2.2, 4.8), "#cdc1a7");
    k += pfad(fp(N, bogen(sm, 2.2, 0, 2.6, 8)), "#231e1a");
    k += `<path d="${fl(N, bogen(sm, 2.5, 2.6, 2.6, 8).slice(1, -1))}" stroke="#e2d7bd" stroke-width=".35" fill="none"/>`;
    for (const d of [-1.7, 1.7]) k += pfad(fr(N, sm + d - .22, 0, sm + d + .22, 4), "#ded3ba");
    k += pfad(fr(N, sm - 2.3, 4.05, sm + 2.3, 4.75), "#4b3226");
    /* Schrift im Band: auf die verkürzte Breite gestaucht und mit der Kante geneigt */
    const ta = pr(...N(sm - 2.15, 4.22)), tb = pr(...N(sm + 2.15, 4.22)), mk = mass(SCH.x1 - sm, SCH.y), win = Math.atan2(tb[1] - ta[1], tb[0] - ta[0]) * 180 / Math.PI;
    k += `<text x="${r(ta[0])}" y="${r(ta[1])}" font-size="${r(.4 * mk * 10) / 10}" textLength="${r(Math.hypot(tb[0] - ta[0], tb[1] - ta[1]))}" lengthAdjust="spacingAndGlyphs" fill="#e8c86a" font-family="Georgia,serif" transform="rotate(${r(win)} ${r(ta[0])} ${r(ta[1])})">buten un binnen · wagen un winnen</text>`;
    /* Freitreppe */
    for (let i = 0; i < 3; i++) k += pfad(poly([[SCH.x1 - sm - 2.6 + i * .2, SCH.y + 1.2 - i * .4, i * .25], [SCH.x1 - sm + 2.6 - i * .2, SCH.y + 1.2 - i * .4, i * .25], [SCH.x1 - sm + 2.6 - i * .2, SCH.y + 1.2 - i * .4, (i + 1) * .25], [SCH.x1 - sm - 2.6 + i * .2, SCH.y + 1.2 - i * .4, (i + 1) * .25]]), i % 2 ? "#b9ae98" : "#c9bea8");
    rhTeile.portal = pr(...N(sm, 2.4));
  }
  /* Zwerchhaus in der Mitte (1594): drei Stufen mit Voluten und Spitzsäulen */
  {
    const sm = 16;
    const st = [[ZT, 13.6, 8], [13.6, 16.4, 5.2], [16.4, 18.8, 2.8]];
    st.forEach(([z0, z1, w], i) => {
      k += pfad(fr(N, sm - w / 2, z0, sm + w / 2, z1), SN);
      const nF = 3 - i;
      for (let j = 0; j < nF; j++) { const c = sm - w / 2 + (j + .5) * w / nF; k += pfad(fr(N, c - .45, z0 + .5, c + .45, z1 - .5), GLAS_N); }
      if (i < 2) { const w2 = st[i + 1][2]; for (const sg of [-1, 1]) k += pfad(fp(N, [[sm + sg * w / 2, z1], [sm + sg * (w / 2 - .3), z1 + .7], [sm + sg * w2 / 2, z1 + 1.8], [sm + sg * w2 / 2, z1]]), SN_D); }
      k += pfad(fr(N, sm - w / 2 - .2, z1 - .2, sm + w / 2 + .2, z1 + .15), SN_K);
      for (const sg of [-1, 1]) k += pfad(fp(N, [[sm + sg * w / 2 - .15, z1 + .15], [sm + sg * w / 2 + .15, z1 + .15], [sm + sg * w / 2, z1 + 1.3]]), SN_K);
    });
    k += pfad(fp(N, [[sm - 1.4, 18.8], [sm, 20.4], [sm + 1.4, 18.8]]), SN);
    k += pfad(fp(N, [[sm - .08, 20.4], [sm + .08, 20.4], [sm, 21.6]]), SN_K);
  }
  /* Westgiebel (Streiflicht von Süden): Treppen, Voluten, Fenster, Spitzsäulen */
  {
    const G = [[0, 0], [SCH.T, 0], [SCH.T, ZT], [13.6, ZT], [13.6, 12.6], [12.4, 13.2], [12.4, 14.6], [11, 14.6], [11, 16.4], [10, 17], [10, 18.4], [8.6, 18.4], [7.5, 21.4], [6.4, 18.4], [5, 18.4], [5, 17], [4, 16.4], [4, 14.6], [2.6, 14.6], [2.6, 13.2], [1.4, 12.6], [1.4, ZT], [0, ZT]];
    k += pfad(fp(Wg, G), S.lg("schgiebel", [[0, "#dccdaa"], [1, "#e8dbbd"]], 0, 0, 1, 0));
    for (const z of [4.7, 10]) k += pfad(fr(Wg, -.1, z, SCH.T + .1, z + .5), "#efe4c9");
    for (const s of [2.4, 5.6, 9.4, 12.6]) { k += pfad(fr(Wg, s - .7, 1.4, s + .7, 4), GLAS); k += pfad(fr(Wg, s - .7, 5.6, s + .7, 9.2), GLAS); }
    for (const s of [5.4, 9.6]) k += pfad(fr(Wg, s - .55, 11.2, s + .55, 13.6), GLAS);
    k += pfad(fr(Wg, 7, 15, 8, 17.4), GLAS);
    for (const [s, z] of [[1.4, 12.6], [2.6, 14.6], [4, 16.4], [5, 18.4], [10, 18.4], [11, 16.4], [12.4, 14.6], [13.6, 12.6]]) k += pfad(fp(Wg, [[s - .14, z], [s + .14, z], [s, z + 1.3]]), "#d4c4a2");
    k += pfad(fr(Wg, -.05, 0, .5, ZT), "#b5a88e");
  }
  const pt = rhTeile.portal;
  S.teil({ id: "schuetting", de: "der Schütting", syl: "SCHÜT-ting", it: "lo Schütting (casa dei mercanti)", itSyl: "SCHÜT-ting", en: "Schütting (merchants' hall)", x: 0, y: 0, kunst: k,
    tipp: "Im Schütting trafen sich früher die Kaufleute. Heute sitzt hier die Handelskammer.",
    zoom: { x: r(pt[0] - 22), y: r(pt[1] - 24), w: 44, h: 30 },
    unter: [
      { id: "portal", de: "das Portal", syl: "por-TAL", it: "il portale", itSyl: "por-TA-le", en: "portal", x: pt[0], y: pt[1], kunst: flaeche(-3.6, -6.4, 7.2, 9),
        tipp: "Über der Tür steht: „buten un binnen – wagen un winnen“ — draußen und drinnen, wagen und gewinnen." },
    ] });
}

/* =====================================================================
   8 — DIE TOURISTIN und 9 — DER TOURIST (vor dem Rathaus, sie zeigt zum Roland)
   ===================================================================== */
/* kleine Figuren: Verläufe durch ihre Mittelfarbe ersetzen, Pfade auf ganze Zentimeter runden (die Seite lädt schnell) */
const kleineFigur = (svg) => {
  const farbe = {};
  svg = svg.replace(/<(linear|radial)Gradient id="([^"]+)"[^>]*>(.*?)<\/\1Gradient>/g, (q, a, id, inn) => {
    const st = [...inn.matchAll(/offset="([\d.]+)" stop-color="(#[0-9a-fA-F]+)"/g)]; let best = st[0];
    for (const x of st) if (Math.abs(+x[1] - .45) < Math.abs(+best[1] - .45)) best = x;
    farbe[id] = best ? best[2] : "#888"; return "";
  });
  svg = svg.replace(/url\(#([^)]+)\)/g, (q, id) => farbe[id] || q).replace(/<defs><\/defs>/g, "");
  return svg.replace(/ d="([^"]*)"/g, (q, d) => ` d="${d.replace(/-?\d+\.\d+/g, (n) => String(Math.round(+n)))}"`);
};
const figur = (X, Y, spec, h) => { const fu = pr(X, Y, 0), mk = mass(X, Y); const m = B.mensch(spec, h * mk); return { x: fu[0], y: fu[1], svg: schatten(.4 * mk, .2, .5 * mk, .12 * mk, .28) + kleineFigur(m.svg) }; };
{
  const f = figur(15.4, -25.2, { id: "hbr_tour", geschlecht: "w", pose: "zeigen", blick: 205, frisur: "zopf", haarfarbe: "dunkelbraun", haut: "hell",
    kleidung: { oberteil: { stueck: "pullover", farbe: "gelb" }, unterteil: { stueck: "jeans" }, jacke: { stueck: "jacke", farbe: "blau" }, schuhe: { stueck: "turnschuh" }, zubehoer: { stueck: "rucksack", farbe: "rot" } } }, 1.68);
  S.teil({ id: "touristin", de: "die Touristin", syl: "tou-RIS-tin", it: "la turista", itSyl: "tu-RI-sta", en: "tourist (woman)", x: f.x, y: f.y, kunst: f.svg,
    tipp: "Sie zeigt auf den Roland: „Schau mal, der Ritter mit dem Schwert!“" });
}
{
  const f = figur(16.8, -26.4, { id: "hbr_tour2", geschlecht: "m", pose: "stehen", blick: 190, frisur: "kurz", haarfarbe: "blond", haut: "hell",
    kleidung: { oberteil: { stueck: "tshirt", farbe: "weiss" }, unterteil: { stueck: "hose", farbe: "beige" }, jacke: { stueck: "jacke", farbe: "gruen_d" }, schuhe: { stueck: "turnschuh" } } }, 1.8);
  S.teil({ id: "tourist", de: "der Tourist", syl: "tou-RIST", it: "il turista", itSyl: "tu-RI-sta", en: "tourist (man)", x: f.x, y: f.y, kunst: f.svg,
    tipp: "Viele Gäste kommen wegen der Stadtmusikanten und des Rolands nach Bremen." });
}

/* =====================================================================
   10 — DIE TAUBEN auf dem Platz, 11 — DIE MÖWEN von der Weser
   ===================================================================== */
{
  const taube = (x, y, s, spiegel) => {
    const p = pr(x, y, 0), k = mass(x, y) * s;
    return `<g transform="translate(${t2(p[0])} ${t2(p[1])}) scale(${spiegel ? -k.toFixed(3) : k.toFixed(3)} ${k.toFixed(3)})"><ellipse cx="0" cy=".3" rx="2.4" ry=".5" fill="#1b140c" opacity=".25"/><path d="M-2.6 -1.4 Q-1.6 -2.8 .6 -2.6 L2 -2.2 Q2.6 -2.6 3 -3.4 Q3.4 -4 4 -3.6 L4.4 -3.4 L4 -3 Q3.6 -2 3 -1.4 Q1.6 -.4 -.6 -.6 L-2.8 -1 Z" fill="#8a8f98"/><path d="M-1.8 -1.8 Q0 -2.6 1.6 -2 Q.2 -1.2 -1.8 -1.8 Z" fill="#6c717a"/><path d="M2.6 -2.2 Q3 -2.8 3.6 -2.6 Q3.4 -1.8 2.8 -1.6 Z" fill="#6f9a86"/><circle cx="3.8" cy="-3.4" r=".18" fill="#c46a2a"/><path d="M.6 -.6 V0 M1.4 -.7 V0" stroke="#c96a6a" stroke-width=".25"/></g>`;
  };
  const T1 = [CAM[0] + 5.2 * Math.sin(40 * GRAD), CAM[1] + 5.2 * Math.cos(40 * GRAD)], T2 = [CAM[0] + 6.4 * Math.sin(46 * GRAD), CAM[1] + 6.4 * Math.cos(46 * GRAD)];
  const a = pr(T1[0], T1[1], 0), b = pr(T2[0], T2[1], 0);
  S.teil({ oben: true, id: "taube", de: "die Taube", syl: "TAU-be", it: "il piccione", itSyl: "pic-CIO-ne", en: "pigeon", x: 0, y: 0, kunst: taube(T2[0], T2[1], .05, true) + taube(T1[0], T1[1], .05, false),
    tipp: "Tauben suchen auf dem Marktplatz nach Krümeln." });
}
{
  const moewe = (x, y, s, fl) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-5 ${fl} Q-2.6 -1.6 0 0 Q2.6 -1.6 5 ${fl} Q2.6 -.6 .4 .8 L0 1.1 L-.4 .8 Q-2.6 -.6 -5 ${fl} Z" fill="#f6f6f2"/><path d="M-5 ${fl} L-4 ${fl + .2} M5 ${fl} L4 ${fl + .2}" stroke="#2a2a2a" stroke-width=".5"/><path d="M-.5 .4 Q0 1.6 .5 .4" fill="#d9d9d4"/><path d="M0 1.2 l.3 .5" stroke="#e1b53a" stroke-width=".3"/></g>`;
  S.teil({ oben: true, id: "moewe", de: "die Möwe", syl: "MÖ-we", it: "il gabbiano", itSyl: "gab-BIA-no", en: "seagull", x: 0, y: 0, kunst: moewe(118, 76, 1, -1.8) + moewe(131, 70, .8, -.6) + flaeche(110, 64, 28, 16),
    tipp: "Bremen liegt an der Weser. Bis zur Nordsee sind es rund 60 Kilometer — darum fliegen hier Möwen." });
}

/* =====================================================================
   12 — DER TISCH im Café (wir sitzen daran) mit 13 — DEM STUHL gegenüber
        Lupe: Labskaus, Klaben, Kaffee
   ===================================================================== */
const TI = { b: 19.5, d: 1.6, z: .74, R: .36 };
{
  /* DER STUHL gegenüber: Bistrostuhl aus Rattan, man sieht die Lehne über dem Tisch */
  const X = CAM[0] + 2.4 * Math.sin(23 * GRAD), Y = CAM[1] + 2.4 * Math.cos(23 * GRAD), fu = pr(X, Y, 0), sk = mass(X, Y) / 100, t = (AUGE - .46) / weit(X, Y);
  const unten = r((HO - fu[1]) / sk);       /* die Beine enden am unteren Bildrand */
  const RAT = S.lg("rattan", [[0, "#8a5a2a"], [0.5, "#c08a4a"], [1, "#9a6a34"]], 0, 0, 1, 0);
  let g = "";
  for (const [x0, x1] of [[-19, -21], [19, 21], [-12, -13], [12, 13]]) g += `<path d="M${x0} -46 L${r(x0 + (x1 - x0) * (46 + unten) / 46)} ${unten}" stroke="#1f1f1f" stroke-width="2.2"/>`;
  g += `<ellipse cx="0" cy="-46" rx="23" ry="${r(23 * t * 10) / 10}" fill="${RAT}" stroke="#1f1f1f" stroke-width="1.4"/>`;
  g += `<path d="M-21 ${r(-46 - 20 * t)} C-22 -64 -20 -84 -14 -88 C-6 -92 6 -92 14 -88 C20 -84 22 -64 21 ${r(-46 - 20 * t)}" fill="none" stroke="#1f1f1f" stroke-width="2.4"/>`;
  g += `<path d="M-17 -68 C-17 -80 -13 -85 -8 -86.6 C-2 -88 2 -88 8 -86.6 C13 -85 17 -80 17 -68 C10 -70.6 -10 -70.6 -17 -68 Z" fill="${RAT}"/>`;
  for (let i = -2; i <= 2; i++) g += `<path d="M${i * 6} -87.6 L${i * 6.4} -69.6" stroke="#6e4620" stroke-width=".8" opacity=".55"/>`;
  for (const y of [-83, -78, -73]) g += `<path d="M-15 ${y} C-6 ${y - 2} 6 ${y - 2} 15 ${y}" stroke="#6e4620" stroke-width=".7" fill="none" opacity=".5"/>`;
  g += `<path d="M-16 -79.6 C-6 -82 6 -82 16 -79.6" stroke="#e8c48a" stroke-width=".9" fill="none" opacity=".7"/>`;
  S.teil({ id: "stuhl", de: "der Stuhl", syl: "STUHL", it: "la sedia", itSyl: "SE-dia", en: "chair", x: fu[0], y: fu[1], kunst: `<g transform="scale(${sk.toFixed(4)})">${g}</g>` });
}
{
  const X = CAM[0] + TI.d * Math.sin(TI.b * GRAD), Y = CAM[1] + TI.d * Math.cos(TI.b * GRAD);
  const c = pr(X, Y, TI.z), mk = mass(X, Y), sk = mk / 100, t = (AUGE - TI.z) / TI.d;   // Zeichnung in Zentimetern, Tischplatte flach (t = Neigung)
  const R = TI.R * 100;
  let g = "";
  /* Tischplatte (Marmor, rund) mit Kante, Säulenfuß (läuft unten aus dem Bild) */
  const unten = r((HO - c[1]) / sk);
  g += `<path d="M-5 ${r(R * t)} L-4.4 ${unten} L4.4 ${unten} L5 ${r(R * t)} Z" fill="#2c2c2a"/>`;
  g += `<ellipse cx="0" cy="3.4" rx="${R}" ry="${r(R * t)}" fill="#3a3a38"/>`;
  g += `<ellipse cx="0" cy="0" rx="${R}" ry="${r(R * t)}" fill="${S.rg("platte", [[0, "#ffffff"], [0.6, "#efede8"], [1, "#d6d3cc"]], 0.42, 0.3, 0.8)}"/>`;
  g += `<path d="M-20 ${r(-R * t * .5)} q10 4 22 1 q8 -2 16 3" stroke="#c9c6be" stroke-width=".5" fill="none" opacity=".6"/>`;
  /* Labskaus auf dem Teller (Mitte hinten): rosa Brei, Spiegelei, Rollmops, Gewürzgurke, Rote Bete */
  const lab = (x, y) => {
    const pr2 = (rx, ry) => `rx="${rx}" ry="${r(ry * t * 10) / 10}"`;
    let q = `<ellipse cx="${x}" cy="${y + 1.2}" ${pr2(14, 14)} fill="#c9c6be"/><ellipse cx="${x}" cy="${y}" ${pr2(14, 14)} fill="#fbfaf7"/><ellipse cx="${x}" cy="${y}" ${pr2(10.4, 10.4)} fill="#efede7"/>`;
    q += `<path d="M${x - 8.6} ${y + .4} C${x - 8.6} ${y - 4.6} ${x - 4} ${y - 5.4} ${x} ${y - 5.6} C${x + 5} ${y - 5.4} ${x + 8.8} ${y - 4.4} ${x + 8.6} ${y + .4} C${x + 4} ${y + 3} ${x - 4} ${y + 3} ${x - 8.6} ${y + .4} Z" fill="${S.rg("labskaus", [[0, "#ec9fa6"], [0.65, "#c9636f"], [1, "#a3465a"]], 0.45, 0.35, 0.7)}"/>`;
    for (let i = 0; i < 14; i++) q += `<circle cx="${r(x - 7 + rnd() * 14)}" cy="${r(y - 3.6 + rnd() * 4.4)}" r=".35" fill="#a8455a" opacity=".6"/>`;
    q += `<ellipse cx="${x - 1}" cy="${y - 4.6}" rx="5.6" ry="1.9" fill="#fffdf6"/><ellipse cx="${x - .6}" cy="${y - 4.9}" rx="2.1" ry="1.1" fill="${S.rg("dotter", [[0, "#ffd54a"], [1, "#e89a12"]], 0.4, 0.35, 0.7)}"/><ellipse cx="${x - 1.1}" cy="${y - 5.2}" rx=".7" ry=".3" fill="#fff" opacity=".7"/>`;
    q += `<path d="M${x + 5.4} ${y - 2.6} C${x + 7.4} ${y - 4.4} ${x + 11} ${y - 3.6} ${x + 11.4} ${y - 1.4} C${x + 10} ${y} ${x + 7} ${y} ${x + 5.4} ${y - 2.6} Z" fill="${S.lg("rollmops", [[0, "#dfe4e6"], [1, "#9fb0b8"]])}"/><path d="M${x + 6.6} ${y - 2.4} C${x + 8} ${y - 3.2} ${x + 10} ${y - 2.8} ${x + 10.6} ${y - 1.6}" stroke="#4c6170" stroke-width=".5" fill="none"/><path d="M${x + 7.6} ${y - 3.9} l.2 2.8" stroke="#d9c79a" stroke-width=".35"/>`;
    q += `<path d="M${x - 12} ${y + .2} C${x - 11.6} ${y - 1.6} ${x - 8.6} ${y - 2.2} ${x - 6.6} ${y - 1.2} C${x - 7} ${y + .6} ${x - 10.6} ${y + 1.2} ${x - 12} ${y + .2} Z" fill="${S.lg("gurke", [[0, "#8aa63a"], [1, "#4f6a1f"]])}"/>`;
    for (const [dx, dy] of [[-4.6, 1.6], [-1.6, 2.2]]) q += `<ellipse cx="${x + dx}" cy="${y + dy}" rx="2" ry=".8" fill="#7a1f3a"/><ellipse cx="${x + dx - .3}" cy="${y + dy - .2}" rx="1" ry=".35" fill="#a8456a"/>`;
    return q;
  };
  const LX = 2, LY = -R * t * .38;
  g += lab(LX, r(LY));
  /* der Klaben auf dem Holzbrett (vorn links): Laib angeschnitten, zwei Scheiben mit Butter */
  const KX = -20, KY = r(R * t * .4);
  g += `<path d="M${KX - 11} ${KY + 2} L${KX + 12} ${KY + 2} L${KX + 13.4} ${KY - 1.4} L${KX - 9.6} ${KY - 1.4} Z" fill="#a8743f"/><path d="M${KX - 11} ${KY + 2} L${KX + 12} ${KY + 2} L${KX + 12} ${KY + 3.4} L${KX - 11} ${KY + 3.4} Z" fill="#7a5028"/>`;
  g += `<path d="M${KX - 9} ${KY - .6} L${KX - 9} ${KY - 6.6} Q${KX - 8.6} ${KY - 8.6} ${KX - 6.4} ${KY - 8.6} L${KX + 1.4} ${KY - 8.6} Q${KX + 2.8} ${KY - 8.4} ${KX + 3} ${KY - 7} L${KX + 3} ${KY - .6} Z" fill="${S.lg("klabenkruste", [[0, "#a8642a"], [1, "#6f3a14"]])}"/>`;
  g += `<path d="M${KX - 8.4} ${KY - 7.4} Q${KX - 3} ${KY - 8.6} ${KX + 2.2} ${KY - 7.6}" stroke="#d0904a" stroke-width=".5" fill="none" opacity=".7"/>`;
  g += `<path d="M${KX + 3} ${KY - .6} L${KX + 3} ${KY - 7} Q${KX + 3.4} ${KY - 8.4} ${KX + 4.4} ${KY - 8.2} L${KX + 4.6} ${KY - .6} Z" fill="#ead09a"/>`;
  for (const [x, y] of [[3.6, -6.6], [4, -4.4], [3.5, -2.6], [4.1, -1.4], [3.7, -5.4]]) g += `<ellipse cx="${KX + x}" cy="${KY + y}" rx=".35" ry=".45" fill="#3f2414"/>`;
  for (const [dx, rot] of [[8.4, -6], [12, 4]]) {
    g += `<g transform="translate(${KX + dx} ${KY - .6}) rotate(${rot})"><path d="M-2.4 0 Q-2.8 -4.6 -1.2 -5.6 L2 -5.6 Q2.8 -4.4 2.6 0 Z" fill="#ecd29c" stroke="#8a4a1a" stroke-width=".5"/><path d="M-1.9 -3.6 Q0 -4.6 2.2 -3.8 L2.1 -2.6 L-1.8 -2.6 Z" fill="#fde9a0"/>`;
    for (const [x, y] of [[-1, -1.6], [.8, -1.1], [.2, -4.6], [1.4, -.6]]) g += `<ellipse cx="${x}" cy="${y}" rx=".35" ry=".42" fill="#3f2414"/>`;
    g += `</g>`;
  }
  /* der Kaffee (rechts): weiße Tasse auf der Untertasse, Löffel, Dampf */
  const TX = 23, TY = r(R * t * .15);
  g += `<ellipse cx="${TX}" cy="${TY + .6}" rx="6.4" ry="${r(6.4 * t * 10) / 10}" fill="#d6d3cc"/><ellipse cx="${TX}" cy="${TY}" rx="6.4" ry="${r(6.4 * t * 10) / 10}" fill="#fbfaf7"/>`;
  g += `<path d="M${TX - 3.8} ${TY - .6} L${TX - 3.6} ${TY - 6.6} L${TX + 3.6} ${TY - 6.6} L${TX + 3.8} ${TY - .6} Q${TX} ${TY + .8} ${TX - 3.8} ${TY - .6} Z" fill="${S.lg("tasse", [[0, "#ffffff"], [0.65, "#f0eee9"], [1, "#cfcbc3"]], 0, 0, 1, 0)}"/>`;
  g += `<ellipse cx="${TX}" cy="${TY - 6.6}" rx="3.6" ry="${r(3.6 * t * 10) / 10}" fill="#fbfaf7"/><ellipse cx="${TX}" cy="${TY - 6.5}" rx="3.1" ry="${r(3.1 * t * 10) / 10}" fill="${S.rg("kaffee", [[0, "#9a6436"], [0.6, "#5a3218"], [1, "#3a1e0c"]], 0.45, 0.4, 0.6)}"/>`;
  g += `<path d="M${TX + 3.6} ${TY - 5.4} Q${TX + 6.4} ${TY - 5.2} ${TX + 6} ${TY - 3.4} Q${TX + 5.6} ${TY - 2} ${TX + 3.6} ${TY - 2.2}" stroke="#efede8" stroke-width=".9" fill="none"/>`;
  g += `<path d="M${TX - 6} ${TY + .4} L${TX - 1.6} ${TY - .6}" stroke="#a9adb1" stroke-width=".7" stroke-linecap="round"/>`;
  g += `<path d="M${TX - .6} ${TY - 8} q-1.4 -2.2 0 -4.2 q1.4 -2 0 -4 M${TX + 1.4} ${TY - 8} q-1.2 -1.8 0 -3.6" stroke="#fff" stroke-width=".45" fill="none" opacity=".6"/>`;
  /* Zuckertütchen mit dem Bremer Schlüssel */
  g += `<g transform="translate(${TX - 9} ${TY + 4}) rotate(-12)"><rect x="-2.2" y="-.9" width="4.4" height="1.8" rx=".3" fill="#fff" stroke="#c4202c" stroke-width=".25"/><path d="M-.9 0 h1.6 M.4 0 v.6" stroke="#c4202c" stroke-width=".3"/><circle cx="-1.1" cy="0" r=".4" fill="none" stroke="#c4202c" stroke-width=".25"/></g>`;
  const k = `<g transform="translate(${t2(c[0])} ${t2(c[1])}) scale(${sk.toFixed(4)})">${g}</g>`;
  const U = (x, y) => [c[0] + x * sk, c[1] + y * sk];
  const uL = U(LX, LY - 2), uK = U(KX, KY - 4), uT = U(TX, TY - 3);
  const zw = 2 * R * sk + 10, zh = zw * 2 / 3;
  S.teil({ oben: true, id: "tisch", de: "der Tisch", syl: "TISCH", it: "il tavolino", itSyl: "ta-vo-LI-no", en: "table", x: 0, y: 0, kunst: k,
    zoom: { x: r(Math.max(0, c[0] - zw / 2)), y: r(HO - zh), w: r(zw), h: r(zh) },
    unter: [
      { id: "labskaus", de: "das Labskaus", syl: "LABS-kaus", it: "il Labskaus (piatto dei marinai)", itSyl: "LABS-kaus", en: "lobscouse", x: uL[0], y: uL[1], kunst: flaecheEllipse(0, 0, 14 * sk, 6 * sk),
        tipp: "Labskaus ist ein Essen der Seeleute: Kartoffeln, Fleisch und Rote Bete, dazu Spiegelei, Rollmops und Gurke." },
      { id: "klaben", de: "der Klaben", syl: "KLA-ben", it: "il Klaben (dolce di Brema)", itSyl: "KLA-ben", en: "Bremen fruit loaf", x: uK[0], y: uK[1], kunst: flaeche(-12 * sk, -6 * sk, 27 * sk, 12 * sk, .3),
        tipp: "Der Bremer Klaben ist ein schwerer Kuchen mit vielen Rosinen — ohne Puderzucker. Man isst ihn in Scheiben mit Butter." },
      { id: "kaffee", de: "der Kaffee", syl: "KAF-fee", it: "il caffè", itSyl: "caf-FÈ", en: "coffee", x: uT[0], y: uT[1], kunst: flaeche(-8 * sk, -7 * sk, 16 * sk, 12 * sk, .3),
        tipp: "Bremen ist eine Kaffeestadt. Hier wurde 1906 der koffeinfreie Kaffee erfunden." },
    ] });
}

/* Licht über allem: warmes Licht von rechts hinten, leichte Vignette (fängt keinen Tipp ab) */
S.davor(`<rect width="${BR}" height="${HO}" fill="${S.rg("sonne", [[0, "#fff1c8", 0.18], [0.5, "#fff1c8", 0.05], [1, "#fff1c8", 0]], 1, 0.9, 0.9)}"/><rect width="${BR}" height="${HO}" fill="${S.rg("vignette", [[0, "#000", 0], [0.74, "#000", 0], [1, "#1a1008", 0.2]], 0.5, 0.5, 0.75)}"/>`);

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/bremen.js"));
console.log(aus);
