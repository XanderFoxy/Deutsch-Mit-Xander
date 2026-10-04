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
   Maßstab: echte Kamera, Auge 1,2 m (man sitzt am Cafétisch), Horizont y = 196, 173,6 Einheiten
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
const CAM = [-6, -30], AUGE = 1.6, HOR = 212, FOK = 176, LINKS = -2 * GRAD;
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

/* Luftperspektive: ein Hauch Himmelsblau über fernen Dingen, ohne Weichzeichner und ohne doppelte Geometrie */
const luftFilter = (name, a) => { S.def(`<filter id="${S.id(name)}" color-interpolation-filters="sRGB"><feFlood flood-color="#bcd0e4" flood-opacity="${a}" result="f"/><feComposite in="f" in2="SourceGraphic" operator="in" result="t"/><feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="t"/></feMerge></filter>`); return `filter="url(#${S.id(name)})"`; };
const LUFT1 = luftFilter("luft1", .1), LUFT2 = luftFilter("luft2", .16), LUFT3 = luftFilter("luft3", .24);
/* ---------- Stoffe (Sonne von rechts hinten, Südsüdwest) ---------- */
const SAND = S.lg("sand", [[0, "#efe3c6"], [1, "#e2d2b0"]]);                 // Sandstein in der Sonne
const SAND_D = S.lg("sandd", [[0, "#c9b896"], [1, "#b3a17f"]]);              // Sandstein seitlich
const BACK = S.lg("back", [[0, "#5f3330"], [0.5, "#55302c"], [1, "#4a2a27"]]);  // dunkler Backstein
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
S.hinten(`<rect width="${BR}" height="${HOR + 4}" fill="${S.lg("himmel", [[0, "#3f78bd"], [0.45, "#7aa8d6"], [0.8, "#bcd3e6"], [1, "#e4ebee"]])}"/>`);
S.hinten(`<rect width="${BR}" height="${HOR + 4}" fill="${S.lg("sonnenseite", [[0, "#fff3d6", 0], [0.6, "#fff3d6", 0], [1, "#fff0cf", 0.3]], 0, 0, 1, 0)}"/>`);
/* Oktober-Cumulus: gewölbte, sonnige Oberseite, flache graue Unterseite — jede Wolke anders */
const WB = S.rg("wolkenball", [[0, "#ffffff"], [0.55, "#f7f9fb"], [1, "#d3dce6"]], 0.38, 0.3, 0.75);
const wolke = (x, y, w, h, n, seed) => {
  const z = zufall(seed);
  let g = `<path d="M${r(x - w / 2 - h * .2)} ${r(y)} H${r(x + w / 2 + h * .2)} Q${r(x + w / 2)} ${r(y + h * .3)} ${r(x + w * .25)} ${r(y + h * .3)} H${r(x - w * .25)} Q${r(x - w / 2)} ${r(y + h * .3)} ${r(x - w / 2 - h * .2)} ${r(y)} Z" fill="#c4cfda"/>`;
  for (let i = 0; i < n; i++) { const t = i / (n - 1), cx = x - w / 2 + t * w, rr = h * (.35 + .65 * Math.sin(Math.PI * (.15 + .7 * t))) * (.75 + z() * .4); g += `<circle cx="${r(cx)}" cy="${r(y - rr * .5)}" r="${r(rr)}" fill="${WB}"/>`; }
  for (let i = 0; i < n - 2; i++) { const t = (i + .5) / (n - 1), cx = x - w / 2 + t * w + w * .05, rr = h * .5 * (.7 + z() * .4); g += `<circle cx="${r(cx)}" cy="${r(y - h * .9 - rr * .2)}" r="${r(rr)}" fill="${WB}"/>`; }
  g += `<path d="M${r(x - w / 2)} ${r(y)} H${r(x + w / 2)}" stroke="#b9c5d1" stroke-width="${r(h * .12)}" opacity=".6"/>`;
  return `<g>${g}</g>`;
};
S.hinten(wolke(74, 38, 64, 14, 7, 3) + wolke(206, 24, 38, 9, 5, 7) + wolke(344, 66, 50, 12, 6, 11) + wolke(160, 92, 24, 6, 4, 5));
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
  let c = pfad(fr(E, 0, 0, 30, 17, 3), S.lg("kirche", [[0, "#8a4a3a"], [1, "#9e5644"]]));
  c += pfad(poly([[-22, 52, 17], [8, 52, 17], [8, 60, 31], [-22, 60, 31]], 3), S.lg("kirchdach", [[0, "#3f6e5e"], [1, "#5a917c"]]));
  c += pfad(poly([[8, 52, 17], [8, 68, 17], [8, 60, 31]], 3), "#7e4333");
  c += `<path d="${linie([[-22, 60, 31], [8, 60, 31]], 3)}" stroke="#2f5548" stroke-width=".8" fill="none"/><path d="${linie([[8, 52, 17], [8, 60, 31]], 3)}" stroke="#c9b8a4" stroke-width=".5" fill="none"/>`;
  for (const s of [3, 9, 15, 21, 27]) c += pfad(fp(E, [[s - 1, 3], [s + 1, 3], [s + 1, 11.5], [s, 13.6], [s - 1, 11.5]]), "#33302f") + pfad(fr(E, s - .08, 3, s + .08, 12.6), "#b88a74") + pfad(fr(E, s - 1, 8, s + 1, 8.2), "#b88a74");
  for (const s of [0, 6, 12, 18, 24, 30]) c += pfad(fr(E, s - .6, 0, s + .6, 14), "#743d2f");
  S.hinten(`<g ${LUFT3}>${c}</g>`);
  let k = "";
  /* Gasse zur Domsheide (Südostecke): Rückfassaden und Giebel in 80–100 m schließen die Lücke */
  const GA = ebene(92, -66, -1, 0);
  k += giebelhaus(GA, 0, 8, 14, 7, "#a99b86", "#5a4a44", "#3f4448") + giebelhaus(GA, 8, 15, 15, 7, "#b8a993", "#5a4a44", "#3f4448") + giebelhaus(GA, 15, 22, 13, 6, "#9f927e", "#5a4a44", "#3f4448") + giebelhaus(GA, 22, 30, 14, 7, "#ae9f88", "#5a4a44", "#3f4448") + giebelhaus(GA, 30, 36, 13.4, 6.6, "#a49681", "#5a4a44", "#3f4448");
  /* Südostecke: Giebelhäuser an der Südseite östlich des Schüttings (Nordseiten im Schatten) */
  const SO = ebene(57, -57, -1, 0);
  k += giebelhaus(SO, 0, 5.6, 12.4, 7, "#b9a891", "#5a4a44", "#3f4448") + giebelhaus(SO, 5.6, 11.2, 13.4, 7.6, "#a88f7a", "#5a4a44", "#3f4448") + giebelhaus(SO, 11.2, 17, 12, 6.6, "#bcae98", "#5a4a44", "#3f4448");
  /* Ostseite südlich der Bürgerschaft: ein Giebelhaus quer (Westseite, Streiflicht) */
  const OS = ebene(57.4, -44, 0, -1);
  k += giebelhaus(OS, 0, 7, 13, 7, "#d2c3a6", "#5a4a44");
  S.hinten(`<g ${LUFT3}>${k}</g>`);
}

/* Schlagschatten am Boden gehören zum Marktplatz: sie fangen keinen Tipp für das Ding ab, das sie wirft */
let MP = null;
const amBoden = (svg) => { MP.kunst += svg; return ""; };
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
  for (let y = -54; y <= -4; y += 5) g += linie([[-13, y, 0], [56, y, 0]], 1.5);
  for (let x = -10; x <= 55; x += 5) g += linie([[x, -56, 0], [x, -1, 0]], 1.5);
  k += `<path d="${g.replace(/M/g, " M")}" stroke="#dcd7cc" stroke-width=".45" fill="none" opacity=".5"/>`;
  /* Schatten des Schüttings (Sonne 195°, 32° hoch → 1,6 m Schatten je Meter Höhe nach 15°) */
  const sv = (x, y, z) => [x + z * 0.414, y + z * 1.546, 0];
  k += pfad(poly([[8, -57, 0], sv(8, -57, 10.6), sv(8, -64.5, 19.5), sv(40, -64.5, 19.5), sv(40, -57, 10.6), [40, -57, 0]], 2), "#1f2430", ` opacity=".3"`);
  /* Schatten der Südostecke */
  k += pfad(poly([[40, -57, 0], sv(40, -57, 13), sv(50, -57, 13), sv(57, -46, 13), [57, -46, 0]], 2), "#1f2430", ` opacity=".2"`);
  MP = S.teil({ id: "marktplatz", de: "der Marktplatz", syl: "MARKT-platz", it: "la piazza del mercato", itSyl: "PIAZ-za del mer-CA-to", en: "market square", x: 0, y: 0, kunst: k,
    tipp: "Vom Marktplatz geht man in die Böttcherstraße und in den Schnoor, das älteste Viertel der Stadt." });
}

/* =====================================================================
   2 — DER DOM ST. PETRI (zwei Westtürme hinter der Bürgerschaft; der
       Nordturm steht über der Lücke neben dem Rathaus) — Lupe:
       Turmspitze, Turm, Fensterrose
   ===================================================================== */
const DOM = { x: 75, top: 56, spitze: 97 };
const domTeile = {};
{
  let k = "";
  const W = ebene(DOM.x, 8, 0, -1);           // Westfront: s = 0 (Nordecke) … 36 (Südecke), im Bild nach rechts
  const M = ebene(DOM.x + 0.8, 8, 0, -1);
  /* Stein: hell, nach rechts (Süden) zunehmend im Streiflicht der Südsonne */
  const ST = S.lg("domst", [[0, "#cbbfa5"], [0.6, "#dccfb2"], [1, "#eadfc4"]], 0, 0, 1, 0);
  const ST_D = "#a99c80", FUGE = "#9a8e74";
  /* Kirchenschiff dahinter: Kupferdach */
  k += pfad(poly([[DOM.x + 6, -16, 30], [DOM.x + 70, -16, 30], [DOM.x + 70, -10, 42], [DOM.x + 6, -10, 42]], 6), KUPFER_D);
  /* Mittelteil: Portalzone (verdeckt), Zwerggalerie, Fensterrose mit Rahmen, Giebel */
  k += pfad(fp(M, [[12, 0], [24, 0], [24, 36], [18, 45], [12, 36]]), ST);
  k += `<path d="${fl(M, [[11.6, 36], [18, 45.4], [24.4, 36]])}" stroke="${ST_D}" stroke-width=".6" fill="none"/>`;
  for (let i = 0; i < 7; i++) { const c = 13.2 + i * 1.6; k += pfad(fp(M, bogen(c, 1, 20.4, 22.6, 4)), "#4a443c") + pfad(fr(M, c + .62, 20.4, c + .98, 23.3), "#efe4c9"); }
  k += pfad(fr(M, 12.6, 23.4, 23.4, 24), "#d9ccaf") + pfad(fr(M, 12.6, 20, 23.4, 20.4), "#d9ccaf");
  {
    const c = pr(...M(18, 30)), rr = 4 * mass(DOM.x, -10);
    let g = `<circle cx="${r(c[0])}" cy="${r(c[1])}" r="${r(rr * 1.24)}" fill="#c3b598"/><circle cx="${r(c[0])}" cy="${r(c[1])}" r="${r(rr * 1.12)}" fill="#e9dec4"/><circle cx="${r(c[0])}" cy="${r(c[1])}" r="${r(rr)}" fill="${S.rg("rose", [[0, "#7d8fa6"], [0.6, "#45536a"], [1, "#2c3540"]])}"/>`;
    for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; g += `<line x1="${r(c[0] + Math.cos(a) * rr * .3)}" y1="${r(c[1] + Math.sin(a) * rr * .3)}" x2="${r(c[0] + Math.cos(a) * rr)}" y2="${r(c[1] + Math.sin(a) * rr)}" stroke="#d8cbb0" stroke-width=".4"/><circle cx="${r(c[0] + Math.cos(a + .26) * rr * .78)}" cy="${r(c[1] + Math.sin(a + .26) * rr * .78)}" r="${r(rr * .14)}" fill="none" stroke="#d8cbb0" stroke-width=".25"/>`; }
    g += `<circle cx="${r(c[0])}" cy="${r(c[1])}" r="${r(rr * .3)}" fill="#8c6a3a" stroke="#d8cbb0" stroke-width=".45"/>`;
    k += g;
    domTeile.rose = { x: c[0], y: c[1], rr };
  }
  /* zwei Türme: Geschosse mit Gesimsen und Bogenfriesen, gekuppelte Schallfenster mit Mittelsäule,
     am Helmfuß je Seite ein Giebel mit Fenster und vier Ecktürmchen, darüber der achteckige Kupferhelm */
  const turm = (s0, s1) => {
    const m = (s0 + s1) / 2;
    let g = pfad(fp(W, [[s0, 0], [s1, 0], [s1, DOM.top], [s0, DOM.top]]), ST);
    for (const s of [s0, s1 - 1.3]) g += pfad(fr(W, s, 0, s + 1.3, DOM.top), ST_D, ` opacity=".45"`);
    g += pfad(fr(W, s0, 0, s1, 24), S.lg("verwittert", [[0, "#5d5547", 0.75], [0.6, "#6f6655", 0.45], [1, "#8a806c", 0]], 0, 1, 0, 0));
    for (let z = 3; z < DOM.top; z += 1.2) g += `<path d="${fl(W, [[s0, z], [s1, z]])}" stroke="${FUGE}" stroke-width=".1" opacity=".35" fill="none"/>`;
    for (const z of [12, 22, 32, 42]) {
      g += pfad(fr(W, s0 - .25, z, s1 + .25, z + .7), "#e9dcbd") + pfad(fr(W, s0 - .25, z - .25, s1 + .25, z), "#8c7f66", ` opacity=".6"`);
      let fr2 = ""; for (let t = s0 + 1.3; t < s1 - 1.4; t += 1.15) fr2 += fl(W, bogen(t + .55, 1, z - 1.1, z - .7, 4).slice(1, -1)) + " ";
      g += `<path d="${fr2}" stroke="${ST_D}" stroke-width=".25" fill="none"/>`;
    }
    g += pfad(fp(W, bogen(m, 1.3, 15, 19, 6)), "#3a3631") + pfad(fp(W, bogen(m, 1.3, 25, 29, 6)), "#3a3631");
    /* Glockengeschoss: zwei gekuppelte Schallfenster mit Mittelsäule und Läden */
    for (const d of [-2.6, 2.6]) {
      g += pfad(fp(W, bogen(m + d, 3.6, 33.6, 39.6, 8)), "#bcae90");
      for (const e of [-.85, .85]) g += pfad(fp(W, bogen(m + d + e, 1.4, 34, 38.6, 6)), "#2c2926");
      for (let z = 34.6; z < 38.6; z += .7) g += `<path d="${fl(W, [[m + d - 1.5, z], [m + d + 1.5, z]])}" stroke="#6a5f50" stroke-width=".22"/>`;
      g += pfad(fr(W, m + d - .16, 34, m + d + .16, 38.8), "#efe4c9");
    }
    for (const d of [-3.4, -1.15, 1.15, 3.4]) g += pfad(fp(W, bogen(m + d, 1.5, 44.6, 49.4, 6)), "#2c2926") + pfad(fr(W, m + d + .82, 44.6, m + d + 1.06, 50.6), "#efe4c9");
    g += pfad(fr(W, s0 - .3, 52.6, s1 + .3, DOM.top), "#e9dcbd");
    /* Helm: hinter den Giebeln aufsteigend, Westflanke und Südwestflanke */
    const fuss = DOM.top + 2.2, spitze = pr(DOM.x + 6, 8 - m, DOM.spitze);
    const hl = pr(...W(s0 + 1.6, fuss)), hm = pr(DOM.x + .4, 8 - m, fuss), hr = pr(...W(s1 - 1.6, fuss));
    g += `<path d="M${P(hl)} L${P(spitze)} L${P(hm)} Z" fill="${KUPFER_D}"/><path d="M${P(hm)} L${P(spitze)} L${P(hr)} Z" fill="${KUPFER}"/>`;
    g += `<path d="M${P(hm)} L${P(spitze)}" stroke="#a7d8c0" stroke-width=".35"/>`;
    for (let i = 1; i < 6; i++) { const t = i / 6; const a = [hl[0] + (spitze[0] - hl[0]) * t, hl[1] + (spitze[1] - hl[1]) * t], b = [hr[0] + (spitze[0] - hr[0]) * t, hr[1] + (spitze[1] - hr[1]) * t]; g += `<path d="M${P(a)} L${P(b)}" stroke="#3f6e5e" stroke-width=".2" opacity=".6"/>`; }
    /* Giebel mit Fenster und Ecktürmchen davor */
    g += pfad(fp(W, [[s0 + 1, DOM.top], [s1 - 1, DOM.top], [m, DOM.top + 6.2]]), ST);
    g += `<path d="${fl(W, [[s0 + .8, DOM.top], [m, DOM.top + 6.4], [s1 - .8, DOM.top]])}" stroke="#efe4c9" stroke-width=".5" fill="none"/>`;
    g += pfad(fp(W, bogen(m, 1.6, DOM.top + .5, DOM.top + 2.6, 6)), "#2c2926");
    for (const s of [s0 + .65, s1 - .65]) g += pfad(fp(W, [[s - .65, DOM.top], [s + .65, DOM.top], [s + .65, DOM.top + 2.6], [s, DOM.top + 6.6], [s - .65, DOM.top + 2.6]]), ST) + pfad(fr(W, s + .2, DOM.top, s + .65, DOM.top + 2.6), ST_D);
    g += `<circle cx="${r(spitze[0])}" cy="${r(spitze[1] - .8)}" r=".7" fill="${GOLD}"/><path d="M${r(spitze[0])} ${r(spitze[1] - 1.4)} V${r(spitze[1] - 5.2)} M${r(spitze[0] - 1.1)} ${r(spitze[1] - 4.1)} H${r(spitze[0] + 1.1)}" stroke="#c9a23c" stroke-width=".45"/>`;
    return { g, spitze, hl, hr };
  };
  const tn = turm(0, 12), ts = turm(24, 36);
  k += tn.g + ts.g;
  /* Luftperspektive: ein Hauch Himmelsblau über dem ganzen Dom (90 m entfernt) */
  k = `<g ${LUFT2}>${k}</g>`;
  domTeile.spitze = ts.spitze;
  const sp = ts.spitze, hl = ts.hl, hr = ts.hr, tA = pr(...W(0, 22)), tB = pr(...W(12, DOM.top));
  S.teil({ id: "dom", de: "der Dom", syl: "DOM", it: "il duomo", itSyl: "DUO-mo", en: "cathedral", x: 0, y: 0, kunst: k,
    tipp: "An dieser Stelle steht seit über 1200 Jahren eine Kirche. Der Dom aus Stein ist fast 1000 Jahre alt; seine Türme sind fast 100 Meter hoch.",
    zoom: { x: r(domTeile.rose.x - 75), y: r(domTeile.rose.y + 9 - 100), w: 150, h: 100 },
    unter: [
      { id: "turmspitze", de: "die Turmspitze", syl: "TURM-spit-ze", it: "la guglia", itSyl: "GU-glia", en: "spire", x: sp[0], y: sp[1],
        kunst: `<path class="bw-flaeche" d="M-1.5 -2 L${r(hl[0] - sp[0] - 1)} ${r(hl[1] - sp[1] + 1)} L${r(hr[0] - sp[0] + 1)} ${r(hr[1] - sp[1] + 1)} L1.5 -2 Z" fill="rgba(255,255,255,0.001)"/>`,
        tipp: "Die Turmspitzen sind mit Kupfer gedeckt. Mit der Zeit wird Kupfer grün." },
      { id: "turm", de: "der Turm", syl: "TURM", it: "la torre", itSyl: "TOR-re", en: "tower", x: (tA[0] + tB[0]) / 2, y: tB[1], kunst: flaeche(-(tB[0] - tA[0]) / 2 - .5, 0, tB[0] - tA[0] + 1, tA[1] - tB[1]),
        tipp: "Oben im Turm hängen hinter den Schallfenstern die Glocken." },
      { id: "fensterrose", de: "die Fensterrose", syl: "FENS-ter-ro-se", it: "il rosone", itSyl: "ro-SO-ne", en: "rose window", x: domTeile.rose.x, y: domTeile.rose.y, kunst: flaecheEllipse(0, 0, domTeile.rose.rr * 1.3, domTeile.rose.rr * 1.3),
        tipp: "Die runde Fensterrose sitzt über dem Hauptportal zwischen den Türmen." },
    ] });
}

/* =====================================================================
   3 — DAS HAUS DER BÜRGERSCHAFT (Ostseite): das Parlament — Glas, helle
       Betonrippen, oben das Faltwerk
   ===================================================================== */
{
  const W = ebene(57, -6, 0, -1);        // s = 0 (Nordende) … 38 (Südende), im Bild nach rechts
  const L = 38;
  let k = pfad(fr(W, 0, 0, L, 13.4, 2), "#e2dfd7");
  /* Erdgeschoss zurückgesetzt, dunkel verglast, mit Stützen und Schatten unter der Kante */
  k += pfad(fr(W, 0.4, 0, L - .4, 3.8, 2), S.lg("bgeg", [[0, "#26313a"], [1, "#46535d"]]));
  for (let s = 1.6; s < L; s += 3.2) k += pfad(fr(W, s - .28, 0, s + .28, 3.8), "#d3cec3") + pfad(fr(W, s + .12, 0, s + .28, 3.8), "#9d988e");
  k += pfad(fr(W, 0.4, 3.4, L - .4, 3.8, 2), "#1c2228", ` opacity=".5"`);
  /* Obergeschosse: Glas, das Himmel, Platz und Rathaus spiegelt */
  k += pfad(fr(W, 0.4, 4.2, L - .4, 13, 2), S.lg("bgglas", [[0, "#b8cfe0"], [0.45, "#7f98aa"], [0.7, "#8f8576"], [1, "#5d6a72"]]));
  for (let s = 2; s < L - 2; s += 7.4) k += pfad(fp(W, [[s, 4.2], [s + 2.6, 4.2], [s + 4.4, 13], [s + 1.8, 13]]), "#ffffff", ` opacity=".14"`);
  k += pfad(fr(W, 0.4, 4.2, 12, 7.2), "#9a6a52", ` opacity=".25"`);
  for (const z of [7.2, 10.2]) k += pfad(fr(W, 0.4, z, L - .4, z + .5, 2), "#d8d4ca") + pfad(fr(W, .4, z - .2, L - .4, z, 2), "#2a333a", ` opacity=".35"`);
  /* kräftige Betonrippen mit Licht- und Schattenseite */
  for (let s = 0.8; s < L; s += 1.6) k += pfad(fr(W, s - .2, 4.2, s, 13), "#fbf9f4") + pfad(fr(W, s, 4.2, s + .2, 13), "#b9b4aa");
  /* das Faltwerk: geneigte Dachprismen, je eine Licht- und eine Schattenseite */
  const n = 9, w = L / n;
  for (let i = 0; i < n; i++) {
    const a = i * w, b = a + w, m = a + w / 2;
    k += pfad(fp(W, [[a, 13.4], [m, 16.8], [m, 13.4]]), "#f7f5ef");
    k += pfad(fp(W, [[m, 16.8], [b, 13.4], [m, 13.4]]), "#c2bdb2");
    k += pfad(poly([[57, -6 - m, 16.8], [57 + 4, -6 - m, 16.4], [57 + 4, -6 - b, 13.2], [57, -6 - b, 13.4]]), "#a7a297");
  }
  k += pfad(fr(W, 0, 13, L, 13.6, 2), "#d4cfc4") + pfad(fr(W, 0, 12.8, L, 13, 2), "#5a5f63", ` opacity=".5"`);
  k = `<g ${LUFT1}>${k}</g>`;
  S.teil({ id: "parlament", de: "das Parlament", syl: "par-la-MENT", it: "il parlamento", itSyl: "par-la-MEN-to", en: "parliament", x: 0, y: 0, kunst: k,
    tipp: "Hier tagt die Bremische Bürgerschaft, das Parlament des kleinsten Bundeslands. Das Haus heißt Haus der Bürgerschaft." });
}

/* =====================================================================
   4 — DAS RATHAUS (Weserrenaissance) — Lupe: Arkade, Erker, Giebel,
       Statue, Dach
   ===================================================================== */
S.def(`<pattern id="${S.id("blei")}" width="1.1" height="1.1" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0 H1.1 M0 0 V1.1" stroke="#d8dee2" stroke-width=".12" opacity=".55"/></pattern>`);
const BLEI = `url(#${S.id("blei")})`;
let RT = null;
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
    let gl = "";
    for (let z = 6.6, i = 0; z < ZE; z += 0.5, i++) { if (i % 3 === 2) gl += fl(Wd, [[0, z], [RH.L, z]], 2) + " "; else fug += fl(Wd, [[0, z], [RH.L, z]], 2) + " "; }
    k += `<path d="${fug}" stroke="#2e1c19" stroke-width=".14" fill="none" opacity=".5"/><path d="${gl}" stroke="#1f2a2a" stroke-width=".42" fill="none" opacity=".45"/>`;
  }
  k += pfad(fr(Wd, -.2, ZE - .7, RH.L + .2, ZE, 1.5), SAND);
  k += pfad(fr(Wd, -.2, ZE - .9, RH.L + .2, ZE - .7, 1.5), "#9b8a6c");
  const fenster = (E, sm, w, z0, z1) => {
    let g = pfad(fr(E, sm - w / 2 - .32, z0 - .4, sm + w / 2 + .32, z1 + .32), SAND);
    g += pfad(fr(E, sm - w / 2 - .32, z1 + .32, sm + w / 2 + .32, z1 + .5), "#a8977a");
    g += pfad(fr(E, sm - w / 2 - .12, z0 - .12, sm + w / 2 + .12, z1 + .12), "#a8977a");
    g += pfad(fr(E, sm - w / 2, z0, sm + w / 2, z1), GLAS) + pfad(fr(E, sm - w / 2, z0, sm + w / 2, z1), BLEI);
    g += pfad(fr(E, sm - w / 2, z1 - .25, sm + w / 2, z1), "#1d2228", ` opacity=".45"`);
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
  k += pfad(fr(A, -.1, 5.95, RH.L + .1, 6.2, 1.5), "#6f6048", ` opacity=".7"`);
  for (let i = 1; i < 11; i++) k += pfad(fr(A, i * BAY - .38, 3.2, i * BAY + .38, 3.55), "#f3e8cf") + pfad(fr(A, i * BAY - .32, 3.05, i * BAY + .32, 3.2), "#b3a17f");
  for (let i = 0; i < 11; i++) { const sm = (i + .5) * BAY; k += pfad(fp(A, [[sm - 1.375, 0], [sm - .2, 0], [sm - .9, 3.4], [sm - 1.375, 3.6]]), "#0f0b08", ` opacity=".35"`); }
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
    /* zwei Fenstergeschosse mit Pilastern */
    for (const [z0, z1] of [[6.9, 10.1], [10.7, 13.8]]) {
      for (let i = 0; i < 3; i++) {
        const c = s0 + (i + .5) * (s1 - s0) / 3;
        k += pfad(fr(Ek, c - 1.2, z0, c + 1.2, z1), GLAS) + pfad(fr(Ek, c - 1.2, z0, c + 1.2, z1), BLEI) + pfad(fr(Ek, c - 1.2, z1 - .25, c + 1.2, z1), "#1d2228", ` opacity=".45"`);
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
  const zA = pr(...A(2.5 * BAY, 1)), zE = pr(...Ek(EK.s0 + 1.8, 9)), zG = rhTeile.giebel, zS = pr(...Wd(2 * BAY, 9.4)), zD = pr(3, 4.4, 17.6);
  let zx0 = pr(0, RH.T, 0)[0] - 3, zx1 = pr(RH.L, 0, 0)[0] + 3, zy0 = pr(...Ek((EK.s0 + EK.s1) / 2, 29.8))[1] - 3, zy1 = pr(0, 0, 0)[1] + 4;
  let zw = zx1 - zx0, zh = zy1 - zy0;
  if (zw < zh * 1.5) { const d = zh * 1.5 - zw; zx0 -= d / 2; zw = zh * 1.5; } else { const d = zw / 1.5 - zh; zy0 -= d * .7; zh = zw / 1.5; }
  RT = S.teil({ id: "rathaus", de: "das Rathaus", syl: "RAT-haus", it: "il municipio", itSyl: "mu-ni-CI-pio", en: "town hall", x: 0, y: 0, kunst: k,
    tipp: "Das Rathaus ist über 600 Jahre alt und gehört zum Welterbe der UNESCO — zusammen mit dem Roland.",
    zoom: { x: r(zx0), y: r(zy0), w: r(zw), h: r(zh) },
    unter: [
      { id: "arkade", de: "die Arkade", syl: "ar-KA-de", it: "il portico", itSyl: "POR-ti-co", en: "arcade", x: zA[0], y: zA[1], kunst: flaeche(-5, -9, 10, 10),
        tipp: "Unter den elf Bögen der Arkaden bleibt man bei Regen trocken." },
      { id: "erker", de: "der Erker", syl: "ER-ker", it: "il bovindo", itSyl: "bo-VIN-do", en: "oriel", x: zE[0], y: zE[1], kunst: flaeche(-5, -10, 10, 14),
        tipp: "Der Erker ragt aus der Front heraus. Dahinter liegt die Obere Rathaushalle, der Festsaal der Stadt." },
      { id: "giebel", de: "der Giebel", syl: "GIE-bel", it: "il frontone", itSyl: "fron-TO-ne", en: "gable", x: zG[0], y: zG[1], kunst: flaeche(-6, -14, 12, 20),
        tipp: "Der Giebel mit Schnecken und Spitzsäulen ist typisch für die Weserrenaissance." },
      { id: "statue", de: "die Statue", syl: "STA-tu-e", it: "la statua", itSyl: "STA-tu-a", en: "statue", x: zS[0], y: zS[1], kunst: flaeche(-2.4, -7, 4.8, 9, 0.6),
        tipp: "Acht Figuren schmücken die Front: der Kaiser und die sieben Kurfürsten." },
      { id: "dach", de: "das Dach", syl: "DACH", it: "il tetto", itSyl: "TET-to", en: "roof", x: zD[0], y: zD[1], kunst: flaeche(-7, -7, 11.5, 11),
        tipp: "Das Dach ist aus Kupfer — darum ist es grün." },
    ] });
}

/* =====================================================================
   5 — DIE BREMER STADTMUSIKANTEN (Bronze, Westseite des Rathauses)
       Lupe: Esel, Hund, Katze, Hahn — streng übereinander, alle Köpfe
       nach links (Westen)
   ===================================================================== */
const SM = { x: -1.5, y: 6 };
{
  const fu = pr(SM.x, SM.y, 0), mk = mass(SM.x, SM.y), sk = mk / 100;   // Zeichnung in Zentimetern
  const BZ = S.lg("bz", [[0, "#6d6146"], [0.4, "#4a4230"], [1, "#2e2a1e"]], 0, 0, 1, 0);     // Bronze, Licht von links vorn
  const BZ_D = "#2a2619", BZ_L = "#9c8c62";
  const GB = S.lg("goldbein", [[0, "#fff1b8"], [0.35, "#f1cf7a"], [1, "#b8892e"]], 0, 0, 1, 0);
  let g = `<path d="M-60 0 L60 0 L60 -24 L-60 -24 Z" fill="${S.lg("smsockel", [[0, "#dcd6c9"], [1, "#a9a396"]], 0, 0, 1, 0)}"/><path d="M-62 -24 L62 -24 L60 -27 L-60 -27 Z" fill="#ece6d9"/>`;
  g += `<path d="M-54 -27 L54 -27 L52 -30 L-52 -30 Z" fill="${BZ_D}"/>`;
  let t = "";
  /* DER ESEL: Rumpf waagerecht, langer Hals nach vorn oben, großer Kopf, lange Ohren; Vorderbeine und Maul blank */
  const bein = (x, oben, f, w) => `<path d="M${x - w / 2} ${oben} L${x - w * .35} -14 L${x - w * .45} -3 L${x - w * .5} 0 L${x + w * .5} 0 L${x + w * .4} -3 L${x + w * .35} -14 L${x + w / 2} ${oben} Z" fill="${f}"/>`;
  t += bein(-26, -64, S.lg("goldfern", [[0, "#e9c870"], [1, "#a8792a"]], 0, 0, 1, 0), 5.4) + bein(28, -64, BZ_D, 5.8);
  t += `<path d="M-38 -62 C-44 -66 -46 -76 -47 -84 L-60 -100 C-64 -104 -70 -104 -80 -101 L-92 -97 Q-100 -95 -100 -101 Q-99 -108 -90 -112 L-74 -118 L-64 -120 C-56 -116 -48 -104 -40 -96 C-34 -91 -26 -90 -16 -90 C4 -92 22 -88 36 -92 C46 -94 50 -84 47 -72 C44 -64 38 -62 30 -62 C10 -59 -20 -59 -38 -62 Z" fill="${BZ}"/>`;
  t += `<path d="M-100 -101 Q-99 -108 -90 -112 L-84 -114 Q-90 -104 -88 -98 L-92 -97 Q-100 -95 -100 -101 Z" fill="${GB}"/>`;
  t += bein(-36, -64, GB, 6.2) + bein(36, -66, BZ, 6.6);
  t += `<path d="M-37.6 -58 L-37 -10" stroke="#fffbe6" stroke-width="1.2" opacity=".8"/><path d="M-27.4 -58 L-26.8 -10" stroke="#fff3c8" stroke-width=".8" opacity=".6"/>`;
  t += `<path d="M-66 -118 Q-66 -138 -60 -152 Q-56 -138 -61 -117 Z" fill="${BZ}"/><path d="M-71 -117 Q-74 -136 -70 -149 Q-65 -136 -66 -116 Z" fill="${BZ_D}"/>`;
  t += `<path d="M-64 -120 C-56 -116 -48 -104 -40 -96" stroke="${BZ_L}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
  t += `<ellipse cx="-78" cy="-109" rx="2" ry="1.5" fill="#15120b"/><ellipse cx="-96" cy="-100" rx="1.4" ry=".9" fill="#7a5a1a"/>`;
  t += `<path d="M45 -86 Q54 -72 50 -46 L46 -46 Q49 -70 42 -82 Z" fill="${BZ_D}"/><ellipse cx="48" cy="-42" rx="3.2" ry="5" fill="${BZ_D}"/>`;
  t += `<path d="M-16 -89 C4 -91 22 -87 36 -91" stroke="${BZ_L}" stroke-width="1.6" fill="none" opacity=".8"/>`;
  /* DER HUND: steht auf dem Rücken des Esels, Kopf hoch, Schnauze offen, Ohr */
  t += `<path d="M-18 -110 L-16 -90 L-12 -90 L-13 -110 Z M14 -110 L16 -90 L20 -90 L19 -110 Z" fill="${BZ_D}"/>`;
  t += `<path d="M-24 -110 C-27 -114 -28 -120 -30 -124 L-34 -132 L-37 -140 L-48 -142 L-50 -138 L-42 -137 L-50 -134 L-38 -131 L-33 -126 C-30 -122 -26 -126 -20 -126 L16 -126 C22 -126 25 -121 24 -116 L22 -110 C2 -108 -14 -108 -24 -110 Z" fill="${BZ}"/>`;
  t += `<path d="M-37 -140 C-38 -146 -34 -149 -30 -148 L-27 -150 L-26 -144 C-28 -138 -32 -133 -34 -132 Z" fill="${BZ}"/><path d="M-29 -148 L-24 -156 L-23 -146 Z" fill="${BZ_D}"/>`;
  t += `<path d="M-22 -112 L-20 -90 L-16 -90 L-17 -112 Z M8 -112 L10 -90 L14 -90 L13 -112 Z" fill="${BZ}"/>`;
  t += `<path d="M23 -122 Q32 -128 30 -140" stroke="${BZ}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  t += `<circle cx="-34" cy="-143" r="1.3" fill="#15120b"/><path d="M-20 -125 L16 -125" stroke="${BZ_L}" stroke-width="1.2" opacity=".8"/>`;
  /* DIE KATZE: auf dem Rücken des Hundes, Buckel, spitze Ohren, Schwanz senkrecht */
  t += `<path d="M-12 -138 L-11 -126 L-8 -126 L-8 -138 Z M8 -138 L10 -126 L13 -126 L12 -138 Z" fill="${BZ_D}"/>`;
  t += `<path d="M-14 -138 C-16 -142 -17 -146 -18 -150 L-22 -154 C-27 -153 -30 -156 -30 -160 L-29 -164 L-29 -170 L-25 -165 L-21 -169 L-20 -163 C-14 -165 -6 -168 2 -167 C9 -165 14 -158 13 -146 L12 -138 C2 -136 -6 -136 -14 -138 Z" fill="${BZ}"/>`;
  t += `<path d="M-10 -138 L-9 -126 L-6 -126 L-6 -138 Z" fill="${BZ}"/>`;
  t += `<path d="M12 -150 Q19 -158 17 -172 Q16 -180 19 -186" stroke="${BZ}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
  t += `<circle cx="-26" cy="-159" r="1" fill="#15120b"/><path d="M-18 -163 C-10 -166 0 -167 9 -162" stroke="${BZ_L}" stroke-width="1.1" fill="none" opacity=".85"/>`;
  /* DER HAHN: ganz oben auf der Katze, kräht, Kamm, Sichelfedern, Flügel leicht offen */
  t += `<path d="M-5 -175 L-6 -165 M0 -175 L1 -165" stroke="${BZ_D}" stroke-width="1.6"/>`;
  t += `<path d="M4 -188 C10 -202 18 -210 23 -203 C16 -203 12 -195 8 -186 Z M6 -184 C14 -194 22 -198 25 -191 C18 -191 14 -187 9 -181 Z" fill="${BZ_D}"/>`;
  t += `<path d="M-12 -175 C-18 -179 -18 -189 -14 -195 L-15 -203 L-20 -204 L-26 -206 L-20 -207 L-26 -209.4 L-19 -210 C-14 -213 -10 -209 -10 -203 C-8 -197 -4 -193 4 -191 C10 -191 12 -187 10 -179 C4 -173 -6 -173 -12 -175 Z" fill="${BZ}"/>`;
  t += `<path d="M-8 -189 C-2 -195 6 -193 9 -186 C2 -183 -4 -183 -8 -189 Z" fill="${BZ_L}" opacity=".7"/>`;
  t += `<path d="M-20 -210 Q-21 -216 -18 -214.4 Q-17 -218 -14.4 -214 Q-12 -216 -12 -211 Z" fill="${BZ}"/><ellipse cx="-19.6" cy="-202" rx="1.5" ry="2.3" fill="${BZ_D}"/><circle cx="-16.6" cy="-207.6" r=".9" fill="#15120b"/>`;
  g += `<g transform="translate(0 -30) scale(.92)">${t}</g>`;
  /* Schlagschatten auf dem Pflaster nach Nordnordosten (links oben im Bild, hinter der Bronze) */
  const sch = pfad(poly([[SM.x - .6, SM.y - .3, 0], [SM.x + .6, SM.y - .3, 0], [SM.x + .6 + .9, SM.y + 3.2, 0], [SM.x - .6 + .9, SM.y + 3.2, 0]]), "#1f2430", ` opacity=".28"`);
  amBoden(sch);
  const k = `<g transform="translate(${t2(fu[0])} ${t2(fu[1])}) scale(${sk.toFixed(5)})">${g}</g>` + flaeche(fu[0] - 4.6, fu[1] - 11.6, 9.2, 12.2, 0.6);
  const U = (cx, cy) => [fu[0] + cx * sk, fu[1] + (-30 + cy * .92) * sk];
  const ue = U(-20, -70), uh = U(-14, -122), uk = U(-8, -152), ug = U(-6, -192);
  S.teil({ id: "stadtmusikanten", de: "die Stadtmusikanten", syl: "STADT-mu-si-kan-ten", it: "i musicanti di Brema", itSyl: "mu-si-CAN-ti di BRE-ma", en: "Town Musicians of Bremen", x: 0, y: 0, kunst: k, oben: true,
    tipp: "Esel, Hund, Katze und Hahn aus dem Märchen der Brüder Grimm. Die Bronze von Gerhard Marcks steht seit 1953 hier.",
    zoom: { x: r(fu[0] - 9), y: r(fu[1] - 12.5), w: 19.5, h: 13 },
    unter: [
      { id: "esel", de: "der Esel", syl: "E-sel", it: "l'asino", itSyl: "A-si-no", en: "donkey", x: ue[0], y: ue[1], kunst: flaeche(-4.4, -2.6, 8.4, 6, .3),
        tipp: "Wer die Vorderbeine des Esels mit beiden Händen hält, darf sich etwas wünschen. Darum glänzen sie golden." },
      { id: "hund", de: "der Hund", syl: "HUND", it: "il cane", itSyl: "CA-ne", en: "dog", x: uh[0], y: uh[1], kunst: flaeche(-2.6, -1.4, 5.4, 2.2, .3),
        tipp: "Der Hund steht auf dem Rücken des Esels." },
      { id: "katze", de: "die Katze", syl: "KAT-ze", it: "il gatto", itSyl: "GAT-to", en: "cat", x: uk[0], y: uk[1], kunst: flaeche(-1.8, -1, 3.8, 1.8, .3),
        tipp: "Die Katze sitzt auf dem Hund — ganz oben steht der Hahn." },
      { id: "hahn", de: "der Hahn", syl: "HAHN", it: "il gallo", itSyl: "GAL-lo", en: "rooster", x: ug[0], y: ug[1], kunst: flaeche(-1.4, -1.2, 3, 2.2, .3),
        tipp: "Im Märchen machen alle vier zusammen Musik: Der Esel schreit, der Hund bellt, die Katze miaut, der Hahn kräht — so laut, dass die Räuber fliehen." },
    ] });
}

/* =====================================================================
   6 — DER ROLAND (vor dem Rathaus, Blick nach Osten zum Dom). Von hier
       sieht man ihn schräg von rechts hinten: Rücken mit Mantel und
       Locken, rechts das aufrechte Schwert; der Schild ist abgewandt.
       Lupe: Schwert, Baldachin
   ===================================================================== */
const RO = { x: 30, y: -14 };
{
  const fu = pr(RO.x, RO.y, 0), mk = mass(RO.x, RO.y), sk = mk / 10;   // Zeichnung in Dezimetern
  /* Schlagschatten nach Nordnordosten auf dem Pflaster (Höhe 10,2 m → 16 m lang) */
  const SV = (z) => [RO.x + z * .414, RO.y + z * 1.546, 0];
  let sch = pfad(poly([[RO.x - 2, RO.y - .6, 0], [RO.x + 2, RO.y - .6, 0], [SV(1.2)[0] + 1.6, SV(1.2)[1], 0], [SV(7.4)[0] + .4, SV(7.4)[1], 0], [SV(10)[0], SV(10)[1], 0], [SV(7.4)[0] - .4, SV(7.4)[1], 0], [SV(1.2)[0] - 1.6, SV(1.2)[1], 0]], 1), "#1f2430", ` opacity=".28"`);
  const LS = S.lg("rolstein2", [[0, "#f4efe4"], [0.5, "#ddd5c4"], [1, "#a39a88"]], 0, 0, 1, 0);   // Licht links vorn, Schatten rechts hinten
  const DK = "#8e8676", HL = "#fbf8f0";
  let g = "";
  /* Stufen und Podest */
  for (const [w, z, h] of [[21, 0, 4], [17, 4, 4], [13, 8, 4]]) g += `<rect x="${-w}" y="${-(z + h)}" width="${2 * w}" height="${h}" fill="${LS}"/><rect x="${-w}" y="${-(z + h)}" width="${2 * w}" height=".9" fill="${HL}"/><rect x="${w * .5}" y="${-(z + h)}" width="${w * .5}" height="${h}" fill="#6f6758" opacity=".35"/>`;
  g += `<rect x="-7.6" y="-19" width="15.2" height="7" fill="${LS}"/><rect x="-8.2" y="-19.8" width="16.4" height="1.2" fill="${HL}"/><path d="M-5 -17 h10 M-5 -14 h10" stroke="${DK}" stroke-width=".3"/>`;
  /* Rückenpfeiler bis zum Baldachin (links hinter ihm) */
  g += `<rect x="-6.4" y="-77" width="4" height="58" fill="${S.lg("rolpfeiler", [[0, "#e8e1d2"], [1, "#b0a796"]], 0, 0, 1, 0)}"/><rect x="-6.4" y="-77" width="1" height="58" fill="${HL}" opacity=".6"/>`;
  /* Beine in Plattenrüstung: Beinschienen, Kniebuckel, spitze Eisenschuhe */
  const bein = (dx, f) => `<path d="M${dx - .4} -45 L${dx + 3.8} -45 L${dx + 3.6} -36 Q${dx + 4.1} -33.6 ${dx + 3.5} -31.8 L${dx + 3} -22.6 L${dx + 3} -20.6 L${dx + .4} -20.6 L${dx + .2} -24 Q${dx - .4} -28 ${dx} -31 Q${dx - .5} -34 ${dx - .4} -36 Z" fill="${f}"/>`;
  g += bein(-2.6, "#b7ae9c") + bein(.6, LS);
  g += `<ellipse cx="3.7" cy="-32.8" rx="1" ry="1.3" fill="${HL}"/><ellipse cx=".5" cy="-32.6" rx=".8" ry="1.1" fill="#d6cebe"/>`;
  g += `<path d="M1 -21 L3.8 -21 L7.4 -20 L7.4 -19.4 L.8 -19.4 Z M-2.2 -21 L.4 -21 L3.4 -20.2 L3.4 -19.6 L-2.4 -19.6 Z" fill="#cfc7b6"/>`;
  for (const y of [-42, -39, -27, -24]) g += `<path d="M1 ${y} h3.2" stroke="${DK}" stroke-width=".25"/>`;
  /* kurzer Waffenrock über dem Kettenhemd, tiefer Gürtel */
  g += `<path d="M-3.6 -60 C-4.4 -54 -4.6 -48 -4.4 -43 L-4.6 -40.6 Q.4 -39.2 5.2 -40.6 L4.8 -45 C5.2 -51 5.2 -56 4.4 -60 Z" fill="${LS}"/>`;
  g += `<path d="M-2 -59 L-2.4 -41 M.8 -59.6 L.8 -40.2 M3.2 -59 L3.6 -40.6" stroke="${DK}" stroke-width=".28" opacity=".7"/>`;
  g += `<path d="M-4.4 -46.6 L5 -45.6 L5 -44.4 L-4.5 -45.4 Z" fill="#8e8676"/>`;
  for (const x of [-3, -1, 1, 3]) g += `<circle cx="${x}" cy="${r(-45.9 + (x + 4.4) * .1)}" r=".42" fill="#e8e1d2"/>`;
  /* Mantel über den Rücken (wir sehen ihn von hinten) */
  g += `<path d="M-4 -65 C-6.4 -60 -7 -52 -6.6 -42 L-5.6 -38.4 L-2.4 -38.8 L-.4 -40 C-.8 -48 .2 -56 1.6 -63.6 Q-1 -66 -4 -65 Z" fill="${S.lg("mantel", [[0, "#ede7da"], [1, "#b8af9d"]], 0, 0, 1, 0)}"/>`;
  g += `<path d="M-5 -60 C-5.6 -54 -5.6 -46 -5 -39.4 M-3 -62 C-3.4 -54 -3.4 -46 -2.8 -39 M-.8 -62 C-1.2 -55 -1.4 -48 -1 -40.2" stroke="${DK}" stroke-width=".32" fill="none" opacity=".75"/>`;
  /* rechter Arm im Kettenhemd, die Hand am Schwertgriff */
  S.def(`<pattern id="${S.id("kette")}" width=".7" height=".6" patternUnits="userSpaceOnUse"><rect width=".7" height=".6" fill="#cfc7b6"/><circle cx=".35" cy=".3" r=".2" fill="none" stroke="#8e8676" stroke-width=".09"/></pattern>`);
  g += `<path d="M1.6 -64 C4 -63.6 5 -61 4.6 -57.6 L5.6 -54.4 L4 -53.2 L2.6 -56.4 L1.2 -60 Z" fill="url(#${S.id("kette")})"/><path d="M3.6 -56 L6.8 -53.6 L6.4 -51.4 L3 -53.4 Z" fill="url(#${S.id("kette")})"/>`;
  g += `<path d="M1.4 -64.6 C3.6 -65 5 -63.6 5 -61.4 L3 -60.6 Z" fill="${LS}"/>`;
  /* DAS SCHWERT: Knauf, Griff, Parierstange, lange blanke Klinge vor ihm */
  g += `<circle cx="7.2" cy="-49.6" r=".6" fill="#a39983"/><rect x="6.85" y="-54.4" width=".7" height="4.4" fill="#8a8171"/><rect x="5.2" y="-55.2" width="4" height=".8" rx=".35" fill="#a39983"/>`;
  g += `<path d="M6.75 -55.2 L6.85 -80.6 L7.2 -82.6 L7.55 -80.6 L7.65 -55.2 Z" fill="${S.lg("klinge", [[0, "#f6f8f9"], [0.5, "#c9ced2"], [1, "#8f969b"]], 0, 0, 1, 0)}"/>`;
  g += `<ellipse cx="7" cy="-52.4" rx="1.1" ry=".9" fill="#e8e1d2"/>`;
  /* Kopf von hinten rechts: Nacken, lange Locken bis auf die Schultern, Wange und Ohr rechts */
  g += `<path d="M.4 -67 L2.6 -66.8 L2.8 -63.8 L.4 -64 Z" fill="#d6cebe"/>`;
  g += `<path d="M1.8 -74.4 Q4.4 -74.8 4.6 -71.4 Q4.4 -68.4 2.8 -67.4 L1.6 -68 Z" fill="#e8e1d2"/><ellipse cx="2.6" cy="-71" rx=".5" ry=".8" fill="#c9c1ae"/>`;
  g += `<path d="M-2.8 -68 Q-3.8 -74.6 .2 -76.6 Q3.6 -77.4 4.4 -74.6 Q2 -74.8 1.6 -72.4 Q1.4 -69.6 2 -66 Q0 -63.6 -2.4 -64 Q-3.6 -65.6 -2.8 -68 Z" fill="#d4ccb9"/>`;
  for (const [x, y] of [[-2.8, -65.4], [-3.2, -67.8], [-3, -70.4], [-2.4, -72.8], [-1.2, -75], [.6, -76.2], [2.4, -76.2], [.6, -64.6]]) g += `<circle cx="${x}" cy="${y}" r=".8" fill="#bfb6a2"/><circle cx="${x - .25}" cy="${y - .25}" r=".32" fill="${HL}"/>`;
  /* DER BALDACHIN: achteckiges gotisches Gehäuse — drei Seiten sichtbar, je Spitzbogen mit Wimperg, Fialen an den Ecken, Helm mit Krabben und Kreuzblume */
  const BAL = S.lg("bal", [[0, "#f2ede2"], [0.55, "#d9d1c0"], [1, "#a8a08e"]], 0, 0, 1, 0);
  g += `<path d="M-10 -77 L10 -77 L10 -86 L-10 -86 Z" fill="${BAL}"/>`;
  for (const [x0, w, f] of [[-10, 5.2, "#e9e3d6"], [-4.8, 9.6, "#ddd5c4"], [4.8, 5.2, "#b5ad9b"]]) {
    const m = x0 + w / 2;
    g += `<path d="M${x0 + .7} -77 L${x0 + .7} -81.4 Q${m} -85.4 ${x0 + w - .7} -81.4 L${x0 + w - .7} -77 Z" fill="#6f675a" opacity=".55"/>`;
    g += `<path d="M${x0 + .4} -86 L${m} -91 L${x0 + w - .4} -86 Z" fill="${f}"/><path d="M${x0 + .4} -86 L${m} -91 L${x0 + w - .4} -86" stroke="${DK}" stroke-width=".3" fill="none"/>`;
    g += `<path d="M${m - .2} -91 L${m} -92.6 L${m + .2} -91 Z" fill="${f}"/>`;
  }
  for (const x of [-10, -4.8, 4.8, 10]) g += `<path d="M${x - .7} -77 L${x + .7} -77 L${x + .7} -88 L${x} -92.4 L${x - .7} -88 Z" fill="${x > 4 ? "#b5ad9b" : "#ece6da"}"/>`;
  g += `<path d="M-7.6 -86.4 L0 -103 L7.6 -86.4 Z" fill="${S.lg("rolhelm", [[0, "#efe9dd"], [0.6, "#d3cbb9"], [1, "#a8a08e"]], 0, 0, 1, 0)}"/><path d="M0 -103 L.6 -86.4" stroke="${DK}" stroke-width=".3"/>`;
  for (let i = 1; i < 6; i++) g += `<path d="M${r(-7.6 + i * 1.3)} ${r(-86.4 - i * 2.8)} l-1 -.6 M${r(7.6 - i * 1.3)} ${r(-86.4 - i * 2.8)} l1 -.6" stroke="#a8a08e" stroke-width=".55"/>`;
  g += `<path d="M-1.2 -103 L1.2 -103 L0 -106.4 Z" fill="#d8d0bd"/><circle cx="0" cy="-104.4" r="1" fill="#ece6da"/>`;
  /* feine dunkle Kontur, damit sich der helle Stein vom hellen Hintergrund löst */
  const kontur = `<g transform="translate(${t2(fu[0])} ${t2(fu[1])}) scale(${sk.toFixed(5)})" fill="none" stroke="#5f584c" stroke-width=".9" opacity=".55">${g.replace(/fill="[^"]*"/g, "").replace(/<rect /g, '<rect fill="none" ').replace(/<path /g, '<path fill="none" ').replace(/<ellipse /g, '<ellipse fill="none" ').replace(/<circle /g, '<circle fill="none" ')}</g>`;
  amBoden(sch);
  const k = kontur + `<g transform="translate(${t2(fu[0])} ${t2(fu[1])}) scale(${sk.toFixed(5)})">${g}</g>`;
  const U = (cx, cy) => [fu[0] + cx * sk, fu[1] + cy * sk];
  const us = U(7.2, -66), ub = U(0, -92);
  S.teil({ id: "roland", de: "der Roland", syl: "RO-land", it: "il Rolando di Brema", itSyl: "ro-LAN-do di BRE-ma", en: "Roland statue", x: 0, y: 0, kunst: k,
    tipp: "Der Roland steht seit 1404 hier. Er blickt zum Dom und zeigt: Bremen ist eine freie Stadt. Der Abstand zwischen seinen Knien ist eine Bremer Elle.",
    zoom: { x: r(fu[0] - 39), y: r(fu[1] - 51), w: 78, h: 52 },
    unter: [
      { id: "schwert", de: "das Schwert", syl: "SCHWERT", it: "la spada", itSyl: "SPA-da", en: "sword", x: us[0], y: us[1], kunst: flaeche(-1.6, -6.4, 3.2, 12.6, .4),
        tipp: "Das Schwert steht für das Recht der Stadt, selbst Gericht zu halten." },
      { id: "baldachin", de: "der Baldachin", syl: "BAL-da-chin", it: "il baldacchino", itSyl: "bal-dac-CHI-no", en: "canopy", x: ub[0], y: ub[1], kunst: flaeche(-4.2, -6, 8.4, 7.4, .4),
        tipp: "Über dem Roland steht ein kleines gotisches Türmchen aus Stein, der Baldachin." },
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
    if (Math.max(ta[0], tb[0]) < BR - 2) k += `<text x="${r(ta[0])}" y="${r(ta[1])}" font-size="${r(.4 * mk * 10) / 10}" textLength="${r(Math.hypot(tb[0] - ta[0], tb[1] - ta[1]))}" lengthAdjust="spacingAndGlyphs" fill="#e8c86a" font-family="Georgia,serif" transform="rotate(${r(win)} ${r(ta[0])} ${r(ta[1])})">buten un binnen · wagen un winnen</text>`;
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
  S.teil({ id: "schuetting", de: "der Schütting", syl: "SCHÜT-ting", it: "lo Schütting (casa dei mercanti)", itSyl: "SCHÜT-ting", en: "Schütting (merchants' hall)", x: 0, y: 0, kunst: k,
    tipp: "Im Schütting trafen sich früher die Kaufleute, heute die Handelskammer. Über der Tür steht: „buten un binnen – wagen un winnen“." });
}

/* =====================================================================
   8 — MENSCHEN AUF DEM PLATZ: die Touristin (Wort) und Bildleben ohne
       Wort — eine Stadtführung vor dem Rathaus, Gäste an den Stadt-
       musikanten, ein Kind bei den Tauben, ein Paar. Die Figuren ohne
       Wort sind Kopien von vier B.mensch-Figuren (über <use>), liegen
       in der Lichtschicht und fangen keinen Tipp ab.
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
/* Schlagschatten einer Figur der Höhe h (m) auf dem Pflaster, nach Nordnordosten */
const figSchatten = (X, Y, h, b = .22) => pfad(poly([[X - b, Y, 0], [X + b, Y, 0], [X + b * .5 + h * .414, Y + h * 1.546, 0], [X - b * .5 + h * .414, Y + h * 1.546, 0]], 1), "#1f2430", ` opacity=".3"`);
const VORLAGE = {};
/* Vorlagen auf 3 cm gerundet (die Figuren sind im Bild höchstens 25 E hoch — unsichtbar, spart ein Viertel) */
const vorlage = (name, spec) => { const m = B.mensch(Object.assign({ id: "hbr_" + name }, spec), 1); S.def(`<g id="${S.id("fig_" + name)}">${kleineFigur(m.svg).replace(/ d="([^"]*)"/g, (q, d) => ` d="${d.replace(/-?\d+/g, (n) => String(Math.round(+n / 3) * 3))}"`)}</g>`); VORLAGE[name] = `#${S.id("fig_" + name)}`; };
vorlage("frau", { geschlecht: "w", pose: "stehen", blick: 200, frisur: "lang", haarfarbe: "blond", haut: "hell", kleidung: { oberteil: { stueck: "pullover", farbe: "weiss" }, unterteil: { stueck: "jeans" }, jacke: { stueck: "jacke", farbe: "rot" }, schuhe: { stueck: "turnschuh" }, zubehoer: { stueck: "tasche", farbe: "braun" } } });
vorlage("mann", { geschlecht: "m", pose: "stehen", blick: 170, frisur: "kurz", haarfarbe: "dunkelbraun", haut: "mittel", kleidung: { oberteil: { stueck: "hemd", farbe: "weiss" }, unterteil: { stueck: "hose", farbe: "beige" }, jacke: { stueck: "jacke", farbe: "gruen_d" }, schuhe: { stueck: "halbschuh", farbe: "braun" }, zubehoer: { stueck: "rucksack", farbe: "blau" } } });
vorlage("zeigerin", { geschlecht: "w", pose: "zeigen", blick: 205, frisur: "lang", haarfarbe: "dunkelbraun", haut: "hell", kleidung: { oberteil: { stueck: "pullover", farbe: "gelb" }, unterteil: { stueck: "jeans" }, jacke: { stueck: "jacke", farbe: "blau" }, schuhe: { stueck: "turnschuh" }, zubehoer: { stueck: "rucksack", farbe: "rot" } } });
vorlage("halter", { geschlecht: "m", pose: "halten", blick: 250, frisur: "kurz", haarfarbe: "grau", haut: "hell", alter: "alt", kleidung: { oberteil: { stueck: "pullover", farbe: "blau" }, unterteil: { stueck: "hose", farbe: "grau" }, jacke: { stueck: "mantel", farbe: "beige" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" } } });
vorlage("kind", { geschlecht: "m", alter: "kind", pose: "laufen", blick: 120, frisur: "kurz", haarfarbe: "blond", haut: "hell", kleidung: { oberteil: { stueck: "pullover", farbe: "gruen" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" } } });
/* Fahrrad (Seitenansicht, 1,75 m lang) in Metern um den Fußpunkt */
const fahrrad = (X, Y, sp) => {
  const p = pr(X, Y, 0), m = mass(X, Y);
  let g = `<g transform="translate(${t2(p[0])} ${t2(p[1])}) scale(${(sp ? -m : m).toFixed(4)} ${m.toFixed(4)})" fill="none" stroke-linecap="round">`;
  for (const cx of [-.55, .55]) g += `<circle cx="${cx}" cy="-.34" r=".33" stroke="#1e1e1e" stroke-width=".05"/><circle cx="${cx}" cy="-.34" r=".05" fill="#8a8f94" stroke="none"/>`;
  g += `<path d="M-.55 -.34 L-.12 -.36 L.3 -.78 L-.22 -.76 Z M-.12 -.36 L-.24 -.86 M.55 -.34 L.36 -.92 L.28 -1 L.42 -1.02" stroke="#c0392b" stroke-width=".05"/>`;
  g += `<path d="M-.34 -.88 h.24" stroke="#2a2a2a" stroke-width=".07"/><path d="M-.75 -.6 h.42 l-.04 .1 h-.34 Z" fill="#3a3a38" stroke="none"/></g>`;
  return g;
};
{
  const leute = [   // [Vorlage, x, y, Höhe m, gespiegelt]
    ["halter", -2.9, 5.4, 1.76, false], ["frau", -4.6, 3.2, 1.68, false], ["mann", -5.6, 1.6, 1.8, true],
    ["frau", 11.8, -17.2, 1.7, true], ["mann", 13.6, -19, 1.8, false], ["mann", 10.4, -19.8, 1.76, true], ["halter", 14.9, -17.4, 1.74, true],
    ["mann", 3.6, -31.2, 1.82, true], ["frau", 4.4, -30.4, 1.66, false],
    ["kind", -3.6, -21.8, 1.3, false], ["frau", 5.5, -27.4, 1.7, true],
  ].sort((a, b) => weit(b[1], b[2]) - weit(a[1], a[2]));
  let sch = "", fig = "";
  for (const [v, X, Y, h, sp] of leute) {
    const p = pr(X, Y, 0), H = h * mass(X, Y);
    sch += figSchatten(X, Y, h);
    if (X === 5.5) { fig += fahrrad(X + .5, Y + .1, true); sch += figSchatten(X + .5, Y + .1, 1, .3); }
    fig += `<use href="${VORLAGE[v]}" transform="translate(${t2(p[0])} ${t2(p[1])}) scale(${(sp ? -H : H).toFixed(4)} ${H.toFixed(4)})"/>`;
    /* die Stadtführerin hält einen roten Schirm hoch */
    if (X === 11.8) { const m = mass(X, Y), q = pr(X + .25, Y, 1.25), o = pr(X + .3, Y, 2.35); fig += `<path d="M${P(q)} L${P(o)}" stroke="#2a2a2a" stroke-width="${r(.03 * m * 10) / 10}"/><path d="M${r(o[0] - .1 * m)} ${r(o[1] + .35 * m)} L${r(o[0])} ${r(o[1] - .05 * m)} L${r(o[0] + .1 * m)} ${r(o[1] + .35 * m)} Z" fill="#d23a30"/>`; }
  }
  amBoden(sch);
  S.davor(fig);
}
{
  const X = 6, Y = -22, fu = pr(X, Y, 0), H = 1.68 * mass(X, Y);
  amBoden(figSchatten(X, Y, 1.68));
  S.teil({ id: "touristin", de: "die Touristin", syl: "tou-RIS-tin", it: "la turista", itSyl: "tu-RI-sta", en: "tourist", x: 0, y: 0,
    kunst: `<use href="${VORLAGE.zeigerin}" transform="translate(${t2(fu[0])} ${t2(fu[1])}) scale(${(-H).toFixed(4)} ${H.toFixed(4)})"/>` + flaeche(fu[0] - 5, fu[1] - H - 1, 10, H + 2),
    tipp: "Sie zeigt auf den Roland: „Schau mal, der Ritter mit dem Schwert!“" });
}

/* =====================================================================
   9 — DIE TAUBEN auf dem Platz, 10 — DIE MÖWEN von der Weser
   ===================================================================== */
{
  const taube = (x, y, spiegel) => {
    const p = pr(x, y, 0), k = mass(x, y) * .05;
    amBoden(figSchatten(x, y, .22, .12));
    return `<g transform="translate(${t2(p[0])} ${t2(p[1])}) scale(${(spiegel ? -k : k).toFixed(4)} ${k.toFixed(4)})"><path d="M-2.6 -1.4 Q-1.6 -2.8 .6 -2.6 L2 -2.2 Q2.6 -2.6 3 -3.4 Q3.4 -4 4 -3.6 L4.4 -3.4 L4 -3 Q3.6 -2 3 -1.4 Q1.6 -.4 -.6 -.6 L-2.8 -1 Z" fill="#8a8f98"/><path d="M-1.8 -1.8 Q0 -2.6 1.6 -2 Q.2 -1.2 -1.8 -1.8 Z" fill="#6c717a"/><path d="M-2.4 -1.6 Q-1 -2.6 1 -2.4" stroke="#c9ccd2" stroke-width=".25" fill="none"/><path d="M2.6 -2.2 Q3 -2.8 3.6 -2.6 Q3.4 -1.8 2.8 -1.6 Z" fill="#6f9a86"/><circle cx="3.8" cy="-3.4" r=".18" fill="#c46a2a"/><path d="M.6 -.6 V0 M1.4 -.7 V0" stroke="#c96a6a" stroke-width=".25"/></g>`;
  };
  const a = pr(-1.4, -22.6, 0);
  S.teil({ oben: true, id: "taube", de: "die Taube", syl: "TAU-be", it: "il piccione", itSyl: "pic-CIO-ne", en: "pigeon", x: 0, y: 0, kunst: taube(-.4, -21.2, true) + taube(-1.4, -22.6, false) + taube(.6, -22.2, false) + flaeche(a[0] - 2, a[1] - 5, 14, 6),
    tipp: "Tauben suchen auf dem Marktplatz nach Krümeln." });
}
{
  const moewe = (x, y, s, fl, spiegel) => `<g transform="translate(${x} ${y}) scale(${spiegel ? -s : s} ${s})"><path d="M-6 ${fl} Q-3 ${fl - .6} -1 -.6 L1 -.6 Q3 ${fl - .6} 6 ${fl} Q3.4 ${fl + .9} 1 .4 L-1 .4 Q-3.4 ${fl + .9} -6 ${fl} Z" fill="#f4f4f0"/><path d="M-6 ${fl} L-4.6 ${fl + .1} L-5.4 ${fl + .5} Z M6 ${fl} L4.6 ${fl + .1} L5.4 ${fl + .5} Z" fill="#1d1d1d"/><ellipse cx="0" cy="0" rx="2.2" ry=".9" fill="#fbfbf8"/><circle cx="-2" cy="-.3" r=".7" fill="#fbfbf8"/><path d="M-2.6 -.3 L-3.6 -.1 L-2.6 .1 Z" fill="#e8b82a"/><path d="M-1.4 -.6 Q0 -1.2 1.4 -.6" stroke="#b9c1c8" stroke-width=".3" fill="none"/></g>`;
  /* eine dritte sitzt oben auf dem rechten Nebengiebel des Rathauses */
  const gp = pr(9 * BAY, RH.WAND, 22.6), gm = mass(9 * BAY, RH.WAND) / 100;
  const sitzend = `<g transform="translate(${t2(gp[0])} ${t2(gp[1])}) scale(${gm.toFixed(5)})"><path d="M-20 -6 Q-14 -18 6 -16 L20 -12 Q24 -10 18 -8 L4 -4 Q-10 -2 -20 -6 Z" fill="#9aa4ac"/><path d="M-20 -6 Q-10 -1 4 -4 L6 -10 Q-8 -12 -20 -6 Z" fill="#f4f4f0"/><path d="M14 -10 L26 -12 L18 -8 Z" fill="#1d1d1d"/><circle cx="-16" cy="-12" r="6" fill="#fbfbf8"/><path d="M-22 -12 L-30 -11 L-22 -10 Z" fill="#e8b82a"/><circle cx="-18" cy="-13" r=".9" fill="#111"/><path d="M-6 -2 V4 M0 -3 V4" stroke="#e0a03a" stroke-width="1.4"/></g>`;
  RT.kunst += sitzend;
  S.teil({ oben: true, id: "moewe", de: "die Möwe", syl: "MÖ-we", it: "il gabbiano", itSyl: "gab-BIA-no", en: "seagull", x: 0, y: 0, kunst: moewe(118, 70, 1.1, -2.2, false) + moewe(134, 62, .85, -1, true) + flaeche(110, 57, 30, 18),
    tipp: "Bremen liegt an der Weser. Bis zur Nordsee sind es rund 60 Kilometer — darum fliegen hier Möwen." });
}

/* =====================================================================
   12 — DER TISCH im Café (wir sitzen daran) mit 13 — DEM STUHL gegenüber
        Lupe: Labskaus, Klaben, Kaffee
   ===================================================================== */
const TI = { b: 11, d: 6.4, z: .74, R: .36 };
let STUHL = "";
{
  /* DER STUHL gegenüber: Bistrostuhl aus Rattan, man sieht die Lehne über dem Tisch */
  const X = CAM[0] + 7.1 * Math.sin(14.5 * GRAD), Y = CAM[1] + 7.1 * Math.cos(14.5 * GRAD), fu = pr(X, Y, 0), sk = mass(X, Y) / 100, t = (AUGE - .46) / weit(X, Y);
  const unten = 0;
  const RAT = S.lg("rattan", [[0, "#8a5a2a"], [0.5, "#c08a4a"], [1, "#9a6a34"]], 0, 0, 1, 0);
  let g = "";
  for (const [x0, x1] of [[-19, -21], [19, 21], [-12, -13], [12, 13]]) g += `<path d="M${x0} -46 L${r(x0 + (x1 - x0) * (46 + unten) / 46)} ${unten}" stroke="#1f1f1f" stroke-width="2.2"/>`;
  g += `<ellipse cx="0" cy="-46" rx="23" ry="${r(23 * t * 10) / 10}" fill="${RAT}" stroke="#1f1f1f" stroke-width="1.4"/>`;
  g += `<path d="M-21 ${r(-46 - 20 * t)} C-22 -64 -20 -84 -14 -88 C-6 -92 6 -92 14 -88 C20 -84 22 -64 21 ${r(-46 - 20 * t)}" fill="none" stroke="#1f1f1f" stroke-width="2.4"/>`;
  g += `<path d="M-17 -68 C-17 -80 -13 -85 -8 -86.6 C-2 -88 2 -88 8 -86.6 C13 -85 17 -80 17 -68 C10 -70.6 -10 -70.6 -17 -68 Z" fill="${RAT}"/>`;
  for (let i = -2; i <= 2; i++) g += `<path d="M${i * 6} -87.6 L${i * 6.4} -69.6" stroke="#6e4620" stroke-width=".8" opacity=".55"/>`;
  for (const y of [-83, -78, -73]) g += `<path d="M-15 ${y} C-6 ${y - 2} 6 ${y - 2} 15 ${y}" stroke="#6e4620" stroke-width=".7" fill="none" opacity=".5"/>`;
  g += `<path d="M-16 -79.6 C-6 -82 6 -82 16 -79.6" stroke="#e8c48a" stroke-width=".9" fill="none" opacity=".7"/>`;
  amBoden(figSchatten(X, Y, .9, .25));
  STUHL = `<g transform="translate(${t2(fu[0])} ${t2(fu[1])}) scale(${sk.toFixed(5)})">${g}</g>`;
}
{
  const X = CAM[0] + TI.d * Math.sin(TI.b * GRAD), Y = CAM[1] + TI.d * Math.cos(TI.b * GRAD);
  const c = pr(X, Y, TI.z), mk = mass(X, Y), sk = mk / 100, t = (AUGE - TI.z) / TI.d;   // Zeichnung in Zentimetern, Tischplatte flach (t = Neigung)
  const R = TI.R * 100;
  let g = "";
  /* Tischplatte (Marmor, rund) mit Kante, Säulenfuß (läuft unten aus dem Bild) */
  const unten = r((pr(X, Y, 0)[1] - c[1]) / sk);
  g += `<path d="M-3 ${r(R * t)} L-2.6 ${unten - 3} L2.6 ${unten - 3} L3 ${r(R * t)} Z" fill="#2c2c2a"/><path d="M-22 ${unten} L22 ${unten} L16 ${unten - 3} L-16 ${unten - 3} Z" fill="#2c2c2a"/>`;
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
  amBoden(figSchatten(X, Y, .75, .4));
  const k = STUHL + `<g transform="translate(${t2(c[0])} ${t2(c[1])}) scale(${sk.toFixed(5)})">${g}</g>`;
  const U = (x, y) => [c[0] + x * sk, c[1] + y * sk];
  const uL = U(LX, LY - 2), uK = U(KX, KY - 4), uT = U(TX, TY - 3);
  const zw = 2 * R * sk + 10, zh = zw * 2 / 3;
  S.teil({ oben: true, id: "tisch", de: "der Tisch", syl: "TISCH", it: "il tavolino", itSyl: "ta-vo-LI-no", en: "table", x: 0, y: 0, kunst: k,
    tipp: "Im Café auf dem Marktplatz sitzt man draußen am Tisch.",
    zoom: { x: r(Math.max(0, c[0] - 15)), y: r(c[1] - 14), w: 30, h: 20 },
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
