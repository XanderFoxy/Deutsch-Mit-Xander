#!/usr/bin/env node
/* =====================================================================
   HEIDELBERG (FASSUNG 854) — Bilderwelt neu: eine echte Stadtansicht
   ---------------------------------------------------------------------
   RECHERCHE (Staatliche Schlösser und Gärten „Schloss Heidelberg“,
   Monumentbroschüre; heidelberg.de Kinderstadtplan „Schlossgeschichte“
   und „Gebäude“; Structurae „Karl-Theodor-Brücke“, „Brückentor“;
   Altstadt-Information „Brückenaffe“; Bergbahn Heidelberg; Café Knösel):
   - STANDORT: der Philosophenweg am Südhang des Heiligenbergs (Nordufer,
     etwa 90 m über dem Neckar, beim Philosophengärtchen). Man steht
     ungefähr auf Augenhöhe mit dem Schloss und schaut nach Südosten.
     Echte Peilungen von dort: Brücke Nordende ≈ 112°, Schloss ≈ 132°,
     Brückentor ≈ 137°, Heiliggeistkirche ≈ 146°, Molkenkur ≈ 147°,
     Königstuhl ≈ 145° (Gipfel 568 m). Darum von links nach rechts: die
     Alte Brücke kommt links vom Neuenheimer Ufer und läuft schräg nach
     hinten zum Brückentor; darüber am Hang das Schloss; rechts die
     Heiliggeistkirche mitten in der Altstadt; über allem der bewaldete
     Königstuhl, oben rechts die Molkenkur mit der Bergbahn.
   - ALTE BRÜCKE (Karl-Theodor-Brücke, 1786–88): rund 200 m lang, 7 m
     breit, neun Bögen aus rotem Neckartäler Sandstein; auf der Brüstung
     Statuen von Kurfürst Karl Theodor und der Göttin Minerva. Wir sehen
     die stromabwärts (Westen) gelegene Seite.
   - BRÜCKENTOR: zwei runde Tortürme, weiß verputzt, mit Sandstein-
     gesimsen; seit 1788 barocke Hauben (Schiefer) statt spitzer Helme;
     etwa 28 m hoch. Westlich davon (von hier rechts) sitzt der
     BRÜCKENAFFE aus Bronze (Gernot Rumpf, 1979) mit Spiegel.
   - SCHLOSS: Ruine aus rotem Sandstein. Von Nordwesten sieht man von
     links nach rechts: Glockenturm (Nordostecke, oben offenes Achteck),
     Gläserner Saalbau (Ruine), Friedrichsbau (1601–07, als einziger
     wieder mit Dach, Ziergiebel), davor der Altan (große Terrasse),
     Fassbau, Englischer Bau (Ruine mit großen Fenstern) und den Dicken
     Turm (Nordwestecke, 7 m dicke Mauern, im Pfälzischen Erbfolgekrieg
     gesprengt — seitdem halb offen). Der gesprengte Krautturm steht an
     der Südostecke und der Ottheinrichsbau zeigt seine Prachtfassade in
     den Hof: beide sind von hier aus verdeckt (steht im Tipp).
   - HEILIGGEISTKIRCHE: gotische Hallenkirche aus rotem Sandstein mit
     sehr hohem, steilem Dach mit Gaubenreihen; Westturm 82 m, oben ein
     Achteck mit barocker Haube und Laterne.
   - BERGBAHN: vom Kornmarkt über die Station Schloss zur Molkenkur und
     weiter auf den Königstuhl (seit 1890).
   - TYPISCHES: der „Studentenkuss“ (Praline von Café Knösel, seit 1863,
     Papier mit dem Scherenschnitt eines Paares), die Universität (die
     älteste Deutschlands, 1386 — hier: eine Studentin), die Weinberge am
     Philosophenweg (früher ein Weg durch die Reben), Ausflugsschiffe
     auf dem Neckar. Jahreszeit: Anfang Oktober, Trauben reif, Nachmittags-
     sonne von rechts (Westen).
   Maßstab: Augenhöhe y = 76 (Schlosshöhe). Ferne Bauten nach echter
   Peilung; Schloss und Tor zur besseren Lesbarkeit etwa 2× bzw. 1,3×.
   Vorne gilt: Einheiten je Meter = (y − 76) · 0,27.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "heidelberg", titel: "Heidelberg", emoji: "🏰", thema: "Deutschland", kuerzel: "hdb", fassung: 854 });
const rnd = zufall(1386);
const r = B.r;
const HOR = 76;
const km = (y) => (y - HOR) * 0.27;

/* Kamera für die Ferne (Meter, Ost/Nord, Höhe über dem Neckar) */
const FOC = 376, EYE = 89;
const FV = [0.7314, -0.682], RV = [-0.682, -0.7314];
const proj = (e, n, z) => { const f = e * FV[0] + n * FV[1], l = e * RV[0] + n * RV[1]; return [160 + FOC * l / f, HOR + FOC * (EYE - z) / f]; };
const P = (p) => `${r(p[0])} ${r(p[1])}`;

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("wolke")}" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="2.2"/></filter>`);
S.def(`<filter id="${S.id("dunst")}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation=".6"/></filter>`);
S.def(`<filter id="${S.id("spiegel")}" x="-10%" y="-20%" width="120%" height="140%"><feGaussianBlur stdDeviation=".9 .5"/></filter>`);
/* roter Neckartäler Sandstein — Licht von rechts (Westen) */
const ROT = S.lg("rot", [[0, "#8e3f30"], [0.55, "#b4553f"], [1, "#cf7457"]], 0, 0, 1, 0);
const ROT_D = S.lg("rotd", [[0, "#6c2e25"], [1, "#94443a"]], 0, 0, 1, 0);
const RUINE = S.lg("ruine", [[0, "#7f3a2e"], [0.6, "#a44f3d"], [1, "#c26a52"]], 0, 0, 1, 0);
const SCHIEFER = S.lg("schiefer", [[0, "#3a4049"], [0.6, "#56606b"], [1, "#6d7884"]], 0, 0, 1, 0);
const PUTZ = S.lg("putz", [[0, "#cfc8bb"], [0.55, "#f1ede3"], [1, "#fffdf6"]], 0, 0, 1, 0);
const LOCH = "#2a1c18";
/* Steinquader als Muster (sparsam) */
S.def(`<pattern id="${S.id("quader")}" width="4" height="2.4" patternUnits="userSpaceOnUse"><path d="M0 1.2 H4 M0 2.4 H4 M1 0 V1.2 M3 1.2 V2.4" stroke="#4a1d16" stroke-width=".18" opacity=".35"/></pattern>`);
const QUADER = `url(#${S.id("quader")})`;
/* Wald: drei Muster mit verschiedenen Kachelgrößen (keine sichtbaren Streifen) */
{
  const kronen = (n, w, h, r0, r1, farben, licht) => {
    let m = "";
    for (let i = 0; i < n; i++) {
      const cx = rnd() * w, cy = rnd() * h, rr = r0 + rnd() * (r1 - r0), f = farben[Math.floor(rnd() * farben.length)];
      for (const [dx, dy] of [[0, 0], [w, 0], [-w, 0], [0, h], [0, -h]]) {
        if (dx && (cx + dx < -rr || cx + dx > w + rr)) continue;
        if (dy && (cy + dy < -rr || cy + dy > h + rr)) continue;
        m += `<circle cx="${r(cx + dx)}" cy="${r(cy + dy)}" r="${r(rr)}" fill="${f}"/>`;
        if (licht) m += `<circle cx="${r(cx + dx + rr * 0.3)}" cy="${r(cy + dy - rr * 0.35)}" r="${r(rr * 0.5)}" fill="${licht}" opacity=".32"/>`;
      }
    }
    return m;
  };
  S.def(`<pattern id="${S.id("waldf")}" width="6.4" height="4.3" patternUnits="userSpaceOnUse"><rect width="6.4" height="4.3" fill="#4a6a3c"/>${kronen(15, 6.4, 4.3, 0.55, 1.05, ["#3f5d34", "#557a42", "#4a6b3a", "#62844a", "#36502e", "#7d8c46"], "#a9c27a")}</pattern>`);
  S.def(`<pattern id="${S.id("waldg")}" width="12.6" height="7.9" patternUnits="userSpaceOnUse">${kronen(12, 12.6, 7.9, 1.1, 1.9, ["#3a5630", "#4e7240", "#5c7f45", "#33492b", "#6f8a44", "#a8862e"], "#b5cc84")}</pattern>`);
  let f = "";
  for (let i = 0; i < 9; i++) f += `<ellipse cx="${r(rnd() * 47)}" cy="${r(rnd() * 29)}" rx="${r(5 + rnd() * 8)}" ry="${r(2.4 + rnd() * 3.4)}" fill="${i % 2 ? "#13240f" : "#d9e4a0"}" opacity="${i % 2 ? 0.16 : 0.1}"/>`;
  S.def(`<pattern id="${S.id("fleck")}" width="47" height="29" patternUnits="userSpaceOnUse">${f}</pattern>`);
  S.def(`<linearGradient id="${S.id("nahg")}" gradientUnits="userSpaceOnUse" x1="0" y1="38" x2="0" y2="92"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient>`);
  S.def(`<mask id="${S.id("nah")}"><rect width="320" height="200" fill="url(#${S.id("nahg")})"/></mask>`);
  let m2 = "";
  for (let i = 0; i < 14; i++) m2 += `<circle cx="${r(rnd() * 5)}" cy="${r(rnd() * 3.4)}" r="${r(0.5 + rnd() * 0.5)}" fill="${["#4f6f3a", "#3b5530", "#62803f", "#7a8a3c"][Math.floor(rnd() * 4)]}"/>`;
  S.def(`<pattern id="${S.id("wald2")}" width="5" height="3.4" patternUnits="userSpaceOnUse"><rect width="5" height="3.4" fill="#476636"/>${m2}</pattern>`);
}
const WALD_F = `url(#${S.id("waldf")})`, WALD_G = `url(#${S.id("waldg")})`, FLECK = `url(#${S.id("fleck")})`, WALD2 = `url(#${S.id("wald2")})`;

/* Fenster mit Rundbogen (lokal), dunkel */
const bogenFenster = (x, y, w, h, f = LOCH) => `<path d="M${r(x)} ${r(y + h)} V${r(y + w / 2)} A${r(w / 2)} ${r(w / 2)} 0 0 1 ${r(x + w)} ${r(y + w / 2)} V${r(y + h)} Z" fill="${f}"/>`;
const eckFenster = (x, y, w, h, f = LOCH) => `<rect x="${r(x)}" y="${r(y)}" width="${r(w)}" height="${r(h)}" fill="${f}"/>`;

/* =====================================================================
   KULISSE — Himmel (Oktobernachmittag), Wolken, ferne Höhen im Osten
   ===================================================================== */
S.hinten(`<rect width="320" height="140" fill="${S.lg("himmel", [[0, "#5f93cc"], [0.55, "#a9c8e4"], [1, "#e9e4d6"]])}"/>`);
{
  let w = "";
  for (const [x, y, s] of [[40, 14, 0.9], [150, 9, 1.1], [292, 13, 0.8], [96, 30, 0.55]]) {
    w += `<g filter="url(#${S.id("wolke")})" opacity=".9">`;
    for (const [dx, dy, rx, ry] of [[0, 0, 17, 4.2], [-11, 1.5, 10, 3.2], [11, 1, 12, 3.6], [-3, -3, 9, 4], [5, -2.6, 7, 3.6]])
      w += `<ellipse cx="${r(x + dx * s)}" cy="${r(y + dy * s)}" rx="${r(rx * s)}" ry="${r(ry * s)}" fill="#fff"/>`;
    w += `<ellipse cx="${x}" cy="${r(y + 2.6 * s)}" rx="${r(17 * s)}" ry="${r(2 * s)}" fill="#dfe4ea"/></g>`;
  }
  S.hinten(w);
  /* ferne Odenwaldhöhen im Neckartal (links, Osten) — im Dunst */
  S.hinten(`<path d="M0 52 Q20 46 42 50 Q60 53 78 47 L78 140 L0 140 Z" fill="#9fb1b8" opacity=".85"/><path d="M0 60 Q26 55 50 60 L60 140 L0 140 Z" fill="#8aa09c" opacity=".9"/>`);
}

/* =====================================================================
   1 — DER KÖNIGSTUHL (bewaldeter Berg hinter Schloss und Altstadt)
   ===================================================================== */
const kamm = [[0, 66], [18, 58], [40, 47], [70, 38], [100, 31], [130, 27], [160, 23], [190, 21], [215, 19], [240, 18], [262, 19], [285, 22], [305, 25], [320, 27]];
const kammY = (x) => { for (let i = 1; i < kamm.length; i++) if (x <= kamm[i][0]) { const [a, ya] = kamm[i - 1], [b, yb] = kamm[i]; return ya + (yb - ya) * (x - a) / (b - a); } return kamm[kamm.length - 1][1]; };
{
  /* Kammlinie mit Baumwipfeln */
  let d = `M0 ${kammY(0)}`;
  for (let x = 0; x <= 320; x += 2.2) d += ` Q${r(x + 1.1)} ${r(kammY(x + 1.1) - 1.4 - rnd() * 0.9)} ${r(x + 2.2)} ${r(kammY(x + 2.2))}`;
  d += ` L320 150 L0 150 Z`;
  let k = `<path d="${d}" fill="${WALD}"/>`;
  /* Dunst nach oben (Ferne), Licht von rechts, Schatten in den Rinnen */
  k += `<path d="${d}" fill="${S.lg("waldluft", [[0, "#9fb4c0", 0.62], [0.35, "#9fb4c0", 0.25], [0.7, "#9fb4c0", 0.05], [1, "#9fb4c0", 0]], 0, 0, 0, 1, ' gradientUnits="userSpaceOnUse" x1="0" y1="18" x2="0" y2="130"')}"/>`;
  k += `<path d="${d}" fill="${S.lg("waldlicht", [[0, "#10200c", 0.28], [0.5, "#10200c", 0], [1, "#ffe7a8", 0.12]], 0, 0, 1, 0)}"/>`;
  for (const [x0, w] of [[66, 10], [118, 12], [205, 9], [300, 10]]) k += `<path d="M${x0} ${r(kammY(x0) + 4)} Q${x0 - w * 0.3} ${r(kammY(x0) + 40)} ${x0 - w} 120 L${x0 - w + 6} 120 Q${x0 + 2} ${r(kammY(x0) + 40)} ${x0 + 3} ${r(kammY(x0) + 4)} Z" fill="#14240f" opacity=".18"/>`;
  /* einzelne herbstliche Bäume */
  for (let i = 0; i < 46; i++) {
    const x = rnd() * 320, y = kammY(x) + 10 + rnd() * 70;
    if (x > 92 && x < 222 && y > 40 && y < 104) continue;
    k += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(1 + rnd() * 1.3)}" fill="${["#b8862e", "#c7702c", "#d9a53a", "#9c8a34"][Math.floor(rnd() * 4)]}" opacity="${r(0.55 + rnd() * 0.35)}"/>`;
  }
  S.teil({ id: "koenigstuhl", de: "der Königstuhl", syl: "KÖ-nigs-stuhl", it: "il Königstuhl (monte)", itSyl: "KÖ-nigs-stuhl", en: "Königstuhl (mountain)", x: 0, y: 0, kunst: k,
    tipp: "Der Königstuhl ist 568 Meter hoch und ganz bewaldet. Oben gibt es eine Sternwarte." });
}

/* =====================================================================
   2 — DIE BERGBAHN (Station Schloss → Molkenkur, rechts oben am Hang)
   ===================================================================== */
{
  let k = "";
  const a = [212, 86], b = [254, 50];
  /* Schneise im Wald und die Gleise */
  k += `<path d="M${a[0] - 2.2} ${a[1]} L${b[0] - 2.2} ${b[1] + 1} L${b[0] + 1.6} ${b[1]} L${a[0] + 2} ${a[1] + 1} Z" fill="${S.lg("schneise", [[0, "#7f8f52"], [1, "#9aa463"]])}"/>`;
  k += `<path d="M${a[0] - .6} ${a[1]} L${b[0] - .6} ${b[1] + .4} M${a[0] + .7} ${a[1] + .3} L${b[0] + .5} ${b[1] + .3}" stroke="#4b4038" stroke-width=".3"/>`;
  for (let t = 0.04; t < 1; t += 0.06) k += `<line x1="${r(a[0] + (b[0] - a[0]) * t - 0.8)}" y1="${r(a[1] + (b[1] - a[1]) * t)}" x2="${r(a[0] + (b[0] - a[0]) * t + 0.9)}" y2="${r(a[1] + (b[1] - a[1]) * t + 0.4)}" stroke="#6a5b4b" stroke-width=".25"/>`;
  /* Molkenkur: Ausflugslokal und Bergstation */
  k += `<rect x="248" y="42" width="17" height="7" fill="${PUTZ}"/><path d="M247 42.4 L250 38.6 L263.4 38.6 L266 42.4 Z" fill="#6b4a3c"/>`;
  for (let i = 0; i < 5; i++) k += `<rect x="${249.4 + i * 3.1}" y="44" width="1.4" height="2" fill="#4a5560"/>`;
  k += `<rect x="252" y="49" width="7" height="2.4" fill="#d9d2c4"/><path d="M251 49.2 h9" stroke="#8a7f70" stroke-width=".4"/>`;
  /* der Wagen (Molkenkurbahn) auf halber Strecke */
  const t = 0.46, cx = a[0] + (b[0] - a[0]) * t, cy = a[1] + (b[1] - a[1]) * t;
  k += `<g transform="translate(${r(cx)} ${r(cy)}) rotate(-40)"><rect x="-3.4" y="-2.6" width="6.8" height="2.8" rx=".6" fill="${S.lg("wagen", [[0, "#c43a35"], [1, "#8a1f1d"]])}"/><rect x="-2.8" y="-2.1" width="5.6" height="1.2" rx=".3" fill="#cfe3ee"/><rect x="-3.4" y="-.2" width="6.8" height=".5" fill="#2b2b2b"/></g>`;
  S.teil({ id: "bergbahn", de: "die Bergbahn", syl: "BERG-bahn", it: "la funicolare", itSyl: "fu-ni-co-LA-re", en: "funicular railway", x: 0, y: 0, kunst: k,
    tipp: "Die Bergbahn fährt vom Kornmarkt hinauf zum Schloss, zur Molkenkur und bis auf den Königstuhl." });
}

/* =====================================================================
   3 — DAS SCHLOSS (Ruine am Hang) — Lupe: Glockenturm, Friedrichsbau,
       Altan, Dicker Turm
   ===================================================================== */
const SB = 100;   // Unterkante der Schlossmauern am Hang
{
  let k = "";
  /* Hang unter dem Schloss: Bäume, Mauern, Terrassen */
  k += `<path d="M96 ${SB + 2} Q104 92 112 90 L214 88 Q222 92 226 ${SB + 4} Z" fill="${WALD2}"/>`;
  /* --- Glockenturm (Nordostecke): unten mächtig, oben offenes Achteck --- */
  {
    const x = 112;
    k += `<path d="M${x - 9} ${SB - 4} L${x - 8} 70 L${x + 7} 70 L${x + 8} ${SB - 4} Z" fill="${RUINE}"/>`;
    k += `<path d="M${x - 9} ${SB - 4} L${x - 8} 70 L${x + 7} 70 L${x + 8} ${SB - 4} Z" fill="${QUADER}"/>`;
    k += bogenFenster(x - 4, 76, 1.8, 3) + bogenFenster(x + 1.6, 76, 1.8, 3) + eckFenster(x - 2.6, 84, 1.4, 2.2);
    k += `<rect x="${x - 8.6}" y="69" width="16.2" height="1.6" fill="#c97a5e"/>`;
    /* achteckiger Aufsatz, zwei Geschosse mit Bögen, ohne Dach */
    k += `<path d="M${x - 6.2} 69.4 L${x - 6.2} 52 L${x - 5} 49.6 L${x - 2.4} 50.6 L${x - 1} 48.4 L${x + 1.6} 49.8 L${x + 3.4} 48.8 L${x + 5.4} 50.4 L${x + 5.4} 69.4 Z" fill="${RUINE}"/>`;
    k += `<path d="M${x - 6.2} 69.4 L${x - 6.2} 52 L${x - 3} 51 L${x - 3} 69.4 Z" fill="#5d281f" opacity=".45"/>`;
    for (const yy of [53, 61]) for (const xx of [x - 4.6, x - 1.2, x + 2.2]) k += bogenFenster(xx, yy, 2, 5.4, "#3a1e19");
    k += `<rect x="${x - 6.6}" y="59.4" width="12.4" height=".9" fill="#c97a5e"/>`;
    k += `<path d="M${x + 5.4} 50.4 L${x + 5.4} 69.4" stroke="#e39a78" stroke-width=".5" opacity=".7"/>`;
  }
  /* --- Gläserner Saalbau (Ruine mit Fensterreihen) --- */
  {
    k += `<path d="M120 ${SB - 8} L120 62 L123 58 L126 61 L130 56.4 L134 60 L134 ${SB - 8} Z" fill="${RUINE}"/>`;
    k += `<path d="M120 ${SB - 8} L120 62 L123 58 L126 61 L130 56.4 L134 60 L134 ${SB - 8} Z" fill="${QUADER}"/>`;
    for (const yy of [63, 70.5, 78]) for (const xx of [121.4, 125.4, 129.4]) k += eckFenster(xx, yy, 2.4, 4.6, yy < 66 ? "#7fa7c6" : "#3a1e19");
  }
  /* --- Friedrichsbau: mit Dach, zwei Ziergiebel mit Voluten --- */
  {
    const x0 = 134, x1 = 164;
    k += `<rect x="${x0}" y="64" width="${x1 - x0}" height="${SB - 14 - 64}" fill="${ROT}"/>`;
    k += `<rect x="${x0}" y="64" width="${x1 - x0}" height="${SB - 14 - 64}" fill="${QUADER}"/>`;
    for (const yy of [66.5, 73.5]) {
      k += `<rect x="${x0}" y="${yy + 5.4}" width="${x1 - x0}" height=".8" fill="#d98a6c"/>`;
      for (let i = 0; i < 7; i++) k += `<rect x="${x0 + 1.4 + i * 4.1}" y="${yy}" width="2.2" height="4.2" fill="#2e2622"/><rect x="${x0 + 1.4 + i * 4.1}" y="${yy}" width="2.2" height="1" fill="#6f8aa0" opacity=".7"/>`;
    }
    for (let i = 0; i <= 7; i++) k += `<rect x="${r(x0 + 0.4 + i * 4.1)}" y="64" width=".6" height="${SB - 14 - 64}" fill="#e09477" opacity=".55"/>`;
    /* steiles Schieferdach */
    k += `<path d="M${x0 - 1} 64.4 L${x0 + 3} 55 L${x1 - 3} 55 L${x1 + 1} 64.4 Z" fill="${SCHIEFER}"/>`;
    k += `<path d="M${x0 + 3} 55 L${x1 - 3} 55" stroke="#8a96a2" stroke-width=".4"/>`;
    /* zwei Zwerchgiebel mit Voluten und Obelisken */
    for (const gx of [141.5, 156.5]) {
      k += `<path d="M${gx - 5} 64.4 L${gx - 5} 59 Q${gx - 6.6} 58 ${gx - 4.2} 56.6 L${gx - 3.2} 53.6 Q${gx - 4.4} 52.6 ${gx - 2.2} 51.6 L${gx - 1.2} 48.6 L${gx + 1.2} 48.6 L${gx + 2.2} 51.6 Q${gx + 4.4} 52.6 ${gx + 3.2} 53.6 L${gx + 4.2} 56.6 Q${gx + 6.6} 58 ${gx + 5} 59 L${gx + 5} 64.4 Z" fill="${ROT}"/>`;
      k += `<rect x="${gx - 3}" y="59" width="2" height="3.4" fill="#2e2622"/><rect x="${gx + 1}" y="59" width="2" height="3.4" fill="#2e2622"/><rect x="${gx - .9}" y="53" width="1.8" height="2.6" fill="#2e2622"/>`;
      k += `<path d="M${gx - 5.4} 58.6 h10.8 M${gx - 3.6} 55.8 h7.2" stroke="#d98a6c" stroke-width=".5"/>`;
      for (const ox of [-5, 5, -3.4, 3.4]) k += `<path d="M${gx + ox - .3} ${Math.abs(ox) > 4 ? 58.6 : 55.8} l.3 -2 .3 2 Z" fill="#7e3a2c"/>`;
      k += `<path d="M${gx - .35} 48.6 l.35 -2.2 .35 2.2 Z" fill="#7e3a2c"/>`;
    }
    k += `<path d="M${x1 - .3} 64 V${SB - 14}" stroke="#eba487" stroke-width=".6" opacity=".7"/>`;
  }
  /* --- der Altan (Terrasse vor Friedrichs- und Fassbau) auf hoher Mauer --- */
  {
    k += `<path d="M126 ${SB + 1} L127 ${SB - 14} L190 ${SB - 14} L191 ${SB + 1} Z" fill="${ROT_D}"/>`;
    k += `<path d="M126 ${SB + 1} L127 ${SB - 14} L190 ${SB - 14} L191 ${SB + 1} Z" fill="${QUADER}"/>`;
    for (let i = 0; i < 7; i++) k += `<path d="M${130 + i * 8.6} ${SB - 1} V${SB - 7} Q${132.4 + i * 8.6} ${SB - 10} ${134.8 + i * 8.6} ${SB - 7} V${SB - 1} Z" fill="#3c1d17" opacity=".75"/>`;
    k += `<rect x="126.4" y="${SB - 15.4}" width="64" height="1.4" fill="#d98a6c"/>`;
    for (let x = 127.4; x < 190; x += 1.3) k += `<rect x="${r(x)}" y="${SB - 17.6}" width=".55" height="2.2" fill="#c86e54"/>`;
    k += `<rect x="126.4" y="${SB - 18.2}" width="64" height=".8" fill="#e8a283"/>`;
    /* Besucher als Punkte auf dem Altan */
    for (const [x, c] of [[146, "#2f5f95"], [149, "#d8ad3a"], [168, "#b8473a"], [171.4, "#eeefec"], [176, "#4f8a46"]]) k += `<rect x="${x}" y="${SB - 20.2}" width=".8" height="2" rx=".3" fill="${c}"/><circle cx="${x + .4}" cy="${SB - 20.6}" r=".45" fill="#e2b48e"/>`;
  }
  /* --- Fassbau (niedriger, mit Dach) --- */
  {
    k += `<rect x="164" y="70" width="9" height="${SB - 14 - 70}" fill="${ROT}"/><path d="M163.4 70.4 L165 66 L172 66 L173.6 70.4 Z" fill="${SCHIEFER}"/>`;
    for (const yy of [72, 78]) for (const xx of [165.4, 169.4]) k += eckFenster(xx, yy, 2, 3.6, "#2e2622");
  }
  /* --- Englischer Bau (Ruine, große regelmäßige Fenster) --- */
  {
    k += `<path d="M173 ${SB - 14} L173 62 L189 61 L189 ${SB - 8} Z" fill="${RUINE}"/>`;
    k += `<path d="M173 ${SB - 14} L173 62 L189 61 L189 ${SB - 8} Z" fill="${QUADER}"/>`;
    for (const yy of [64, 72, 80]) for (const xx of [174.4, 178.6, 182.8]) k += `<rect x="${xx}" y="${yy}" width="2.8" height="5.4" fill="#3a1e19"/><rect x="${xx - .3}" y="${yy - .8}" width="3.4" height=".7" fill="#d98a6c"/>`;
    k += `<path d="M187 61.2 L187 ${SB - 8}" stroke="#e8a283" stroke-width=".6" opacity=".6"/>`;
  }
  /* --- der Dicke Turm (Nordwestecke): rund, halb aufgesprengt --- */
  {
    const cx = 200, w = 11;
    k += `<path d="M${cx - w} ${SB + 2} L${cx - w} 64 Q${cx - w + 1} 60.4 ${cx - w + 3} 61.6 L${cx - 3} 58.4 L${cx + 1} 61 L${cx + 5} 58.8 Q${cx + w - .6} 60 ${cx + w} 64 L${cx + w} ${SB + 2} Z" fill="${RUINE}"/>`;
    /* die offene Innenseite (gesprengt): Nischen und Fensterreihen */
    k += `<path d="M${cx - 6.6} ${SB - 2} L${cx - 6.6} 66 Q${cx} 62.6 ${cx + 6.6} 66 L${cx + 6.6} ${SB - 2} Z" fill="${S.lg("innen", [[0, "#5e2a22"], [0.5, "#874033"], [1, "#6a3026"]], 0, 0, 1, 0)}"/>`;
    for (const yy of [68, 76, 84]) for (const xx of [cx - 4.6, cx - 1, cx + 2.6]) k += bogenFenster(xx, yy, 2, 4.4, "#2d1712");
    k += `<path d="M${cx - 6.6} 66 L${cx - 6.6} ${SB - 2} M${cx + 6.6} 66 L${cx + 6.6} ${SB - 2}" stroke="#4a1f18" stroke-width=".8"/>`;
    k += `<path d="M${cx + w - .2} 64 L${cx + w - .2} ${SB + 2}" stroke="#e8a283" stroke-width=".9" opacity=".7"/>`;
    for (let y = 66; y < SB; y += 2.4) k += `<path d="M${cx - w} ${y} h4.4 M${cx + w - 4.4} ${y} h4.4" stroke="#4a1d16" stroke-width=".18" opacity=".4"/>`;
  }
  /* Efeu und Bäume an den Mauern */
  for (const [x, y, s] of [[100, 94, 1.2], [118, 95, 1], [124, 92, 0.9], [192, 95, 1.1], [214, 92, 1.4], [218, 97, 1.2], [106, 98, 1.3], [96, 99, 1]]) k += `<circle cx="${x}" cy="${y}" r="${r(2.6 * s)}" fill="#3f5c32"/><circle cx="${x + .8}" cy="${y - .8}" r="${r(1.6 * s)}" fill="#5a7a40"/>`;
  k += `<path d="M107 74 q2 4 0 8 q-1.4 3 .4 6" stroke="#3f5c32" stroke-width="1.4" opacity=".7" fill="none"/>`;
  S.teil({ id: "schloss", de: "das Schloss", syl: "SCHLOSS", it: "il castello", itSyl: "ca-STEL-lo", en: "castle", x: 0, y: 0, kunst: k,
    tipp: "Das Schloss ist seit über 300 Jahren eine Ruine. Der gesprengte Krautturm und die Prachtfassade des Ottheinrichsbaus liegen auf der anderen Seite.",
    zoom: { x: 98, y: 42, w: 120, h: 80 },
    unter: [
      { id: "glockenturm", de: "der Glockenturm", syl: "GLO-cken-turm", it: "il campanile", itSyl: "cam-pa-NI-le", en: "bell tower", x: 112, y: 70, kunst: flaeche(-6.5, -21, 13, 26),
        tipp: "Im Glockenturm hing früher die Glocke, die vor Gefahr warnte." },
      { id: "friedrichsbau", de: "der Friedrichsbau", syl: "FRIED-richs-bau", it: "il Friedrichsbau", itSyl: "FRIED-richs-bau", en: "Friedrich Building", x: 149, y: 64, kunst: flaeche(-15, -15.5, 30, 21),
        tipp: "Der Friedrichsbau hat als einziger großer Bau wieder ein Dach. Im Hof stehen 16 Figuren von Fürsten." },
      { id: "altan", de: "der Altan", syl: "al-TAN", it: "la terrazza", itSyl: "ter-RAZ-za", en: "terrace", x: 158, y: SB - 8, kunst: flaeche(-31, -10, 64, 17),
        tipp: "Vom Altan, der großen Terrasse, sieht man über die ganze Altstadt bis zum Philosophenweg." },
      { id: "dicker_turm", de: "der Dicke Turm", syl: "DI-cke TURM", it: "la Torre Grossa", itSyl: "TOR-re GROS-sa", en: "Thick Tower", x: 200, y: 80, kunst: flaeche(-11, -21, 22, 22),
        tipp: "Seine Mauern sind 7 Meter dick. Trotzdem sprengten ihn französische Soldaten — seitdem ist er halb offen." },
    ] });
}

/* =====================================================================
   4 — DER NECKAR (Wasser zwischen den Ufern, Spiegelungen)
   ===================================================================== */
/* fernes Südufer: Kai der Altstadt; nahes Nordufer: Neuenheim */
const sudufer = (x) => x <= 186 ? 130 + (x / 186) * 15 : 145 + (x - 186) * 0.21;
{
  const top = [];
  for (let x = 0; x <= 320; x += 10) top.push(`${x} ${r(sudufer(x))}`);
  let k = `<path d="M${top.join(" L")} L320 200 L0 200 Z" fill="${S.lg("wasser", [[0, "#7f9a9b"], [0.35, "#5f7f80"], [1, "#3f5f61"]], 0, 0, 0, 1, ' gradientUnits="userSpaceOnUse" x1="0" y1="128" x2="0" y2="196"')}"/>`;
  /* Spiegelbilder: Wald dunkel, Häuser hell, Tor weiß */
  k += `<g filter="url(#${S.id("spiegel")})" opacity=".42"><path d="M0 131 L80 137 L80 150 L0 145 Z" fill="#2f4a2a"/><rect x="186" y="146" width="10" height="12" fill="#f4efe2"/><path d="M196 147 L320 172 L320 186 L196 160 Z" fill="#e3c9a2"/><rect x="236" y="158" width="20" height="8" fill="#b4553f"/></g>`;
  for (let i = 0; i < 150; i++) {
    const x = rnd() * 320, y0 = sudufer(x) + 1.5, y = y0 + Math.pow(rnd(), 0.7) * (200 - y0), w = 1.2 + (y - 128) * 0.06 * (0.5 + rnd());
    k += `<path d="M${r(x)} ${r(y)} q${r(w / 2)} -.4 ${r(w)} 0" stroke="${rnd() < 0.55 ? "#e9f1ee" : "#2c4446"}" stroke-width="${r(0.15 + (y - 128) * 0.006)}" fill="none" opacity="${r(0.3 + rnd() * 0.4)}"/>`;
  }
  /* Glitzern der Sonne (rechts) */
  for (let i = 0; i < 18; i++) k += `<ellipse cx="${r(200 + rnd() * 110)}" cy="${r(160 + rnd() * 14)}" rx="${r(0.8 + rnd() * 1.4)}" ry=".25" fill="#fff6d8" opacity="${r(0.5 + rnd() * 0.4)}"/>`;
  S.teil({ id: "neckar", de: "der Neckar", syl: "NE-ckar", it: "il Neckar", itSyl: "NE-ckar", en: "the Neckar", x: 0, y: 0, kunst: k,
    tipp: "Der Neckar fließt durch Heidelberg und mündet in Mannheim in den Rhein." });
}

/* =====================================================================
   5 — DIE HEILIGGEISTKIRCHE (rechts, mitten in der Altstadt)
   ===================================================================== */
{
  const T = 273;    // Turmmitte
  let k = "";
  /* Langhaus: Wände mit hohen Maßwerkfenstern und Strebepfeilern */
  k += `<path d="M232 124 L232 113 L268 110 L268 124 Z" fill="${ROT}"/>`;
  for (let i = 0; i < 6; i++) { const x = 234.4 + i * 5.6; k += `<path d="M${x} 123 V${r(116 - i * 0.5)} Q${x + 1.2} ${r(113.6 - i * 0.5)} ${x + 2.4} ${r(116 - i * 0.5)} V123 Z" fill="#3c2a2a"/><path d="M${x + 1.2} ${r(114.2 - i * 0.5)} V123" stroke="#a9584a" stroke-width=".3"/><rect x="${x + 3.2}" y="${r(112 - i * 0.5)}" width="1.2" height="${r(12 + i * 0.5)}" fill="#c86e54"/>`; }
  /* sehr hohes, steiles Dach mit drei Gaubenreihen; Chorschluss links abgewalmt */
  k += `<path d="M229 113.4 L236 92 L266 89.4 L269.4 110.4 Z" fill="${S.lg("hgkdach", [[0, "#3c434d"], [0.5, "#58626e"], [1, "#6c7682"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M236 92 L266 89.4" stroke="#87929e" stroke-width=".5"/>`;
  for (const [yy, n, x0, dx] of [[95, 6, 239, 4.6], [100.4, 7, 236.6, 4.6], [106, 8, 234.2, 4.6]]) for (let i = 0; i < n; i++) {
    const x = x0 + i * dx, y = yy - (x - 232) * 0.075;
    k += `<path d="M${r(x)} ${r(y + 2)} L${r(x)} ${r(y + .6)} L${r(x + .9)} ${r(y - .4)} L${r(x + 1.8)} ${r(y + .6)} L${r(x + 1.8)} ${r(y + 2)} Z" fill="#7c8691"/><rect x="${r(x + .45)}" y="${r(y + .7)}" width=".9" height="1.1" fill="#2a2f35"/>`;
  }
  /* Westturm: Vierkant, Achteck mit Galerie, barocke Haube, Laterne */
  k += `<rect x="${T - 4.4}" y="86" width="8.8" height="38" fill="${ROT}"/>`;
  k += `<rect x="${T - 4.4}" y="86" width="8.8" height="38" fill="${QUADER}"/>`;
  k += `<rect x="${T - 4.4}" y="86" width="2.4" height="38" fill="#5d281f" opacity=".35"/>`;
  k += bogenFenster(T - 1.2, 100, 2.4, 6) + bogenFenster(T - 1, 112, 2, 4.4);
  k += `<rect x="${T - 5}" y="85" width="10" height="1.4" fill="#d98a6c"/>`;
  for (let x = T - 4.6; x < T + 4.8; x += 1.1) k += `<rect x="${r(x)}" y="83" width=".45" height="2" fill="#c86e54"/>`;
  k += `<rect x="${T - 5}" y="82.4" width="10" height=".7" fill="#e8a283"/>`;
  k += `<path d="M${T - 3.4} 83 L${T - 3.4} 75 L${T + 3.4} 75 L${T + 3.4} 83 Z" fill="${ROT}"/>`;
  for (const xx of [T - 2.8, T - .8, T + 1.2]) k += bogenFenster(xx, 76.2, 1.5, 5.6, "#3a2522");
  k += `<rect x="${T - 3.8}" y="74.2" width="7.6" height="1" fill="#d98a6c"/>`;
  /* die geschweifte Haube */
  k += `<path d="M${T - 4} 74.4 Q${T - 4.6} 70.6 ${T - 2.2} 69 Q${T - .8} 68 ${T - 1} 66.4 L${T + 1} 66.4 Q${T + .8} 68 ${T + 2.2} 69 Q${T + 4.6} 70.6 ${T + 4} 74.4 Z" fill="${SCHIEFER}"/>`;
  k += `<path d="M${T + 2.4} 69.4 Q${T + 3.8} 70.6 ${T + 3.6} 73.6" stroke="#9aa6b2" stroke-width=".4" fill="none"/>`;
  k += `<rect x="${T - 1.1}" y="63.4" width="2.2" height="3.2" fill="${SCHIEFER}"/><rect x="${T - .4}" y="64" width=".8" height="1.8" fill="#e6d9b2"/>`;
  k += `<path d="M${T - 1.4} 63.6 Q${T} 60.8 ${T + 1.4} 63.6 Z" fill="${SCHIEFER}"/><path d="M${T} 61 V57.4" stroke="#3a4049" stroke-width=".35"/><circle cx="${T}" cy="58.6" r=".45" fill="#d8b04a"/>`;
  S.teil({ id: "heiliggeistkirche", de: "die Heiliggeistkirche", syl: "HEI-lig-geist-kir-che", it: "la chiesa dello Spirito Santo", itSyl: "CHIE-sa del-lo SPI-ri-to SAN-to", en: "Church of the Holy Spirit",
    x: 0, y: 0, kunst: k, tipp: "Ihr Turm ist 82 Meter hoch. Zwischen den Strebepfeilern stehen seit dem Mittelalter kleine Läden." });
}

/* =====================================================================
   6 — DIE ALTSTADT (Häuserreihen am Südufer und am Schlosshang)
   ===================================================================== */
{
  let k = "";
  const fass = ["#efe3c8", "#e8d3a6", "#f2efe6", "#e9c9b4", "#d9d6cf", "#e2c48c", "#c9765c", "#f0e0c0", "#dcc7a4"];
  const dachF = ["#9c4f35", "#8a442e", "#a65a3c", "#7a3a26", "#5e6168"];
  const haus = (x, yb, w, h, s, giebel) => {
    const f = fass[Math.floor(rnd() * fass.length)], d = dachF[Math.floor(rnd() * dachF.length)], dh = h * (0.5 + rnd() * 0.25);
    let g = `<rect x="${r(x)}" y="${r(yb - h)}" width="${r(w)}" height="${r(h)}" fill="${f}"/>`;
    g += `<rect x="${r(x)}" y="${r(yb - h)}" width="${r(w * 0.22)}" height="${r(h)}" fill="#5a3a2a" opacity=".12"/>`;
    if (giebel) g += `<path d="M${r(x - .2)} ${r(yb - h)} L${r(x + w / 2)} ${r(yb - h - dh * 1.1)} L${r(x + w + .2)} ${r(yb - h)} Z" fill="${f}"/><path d="M${r(x - .5)} ${r(yb - h + .3)} L${r(x + w / 2)} ${r(yb - h - dh * 1.1 - .3)} L${r(x + w + .5)} ${r(yb - h + .3)}" stroke="${d}" stroke-width="${r(0.9 * s)}" fill="none"/>`;
    else g += `<path d="M${r(x - .4)} ${r(yb - h + .2)} L${r(x + w * 0.18)} ${r(yb - h - dh)} L${r(x + w * 0.82)} ${r(yb - h - dh)} L${r(x + w + .4)} ${r(yb - h + .2)} Z" fill="${d}"/>`;
    /* Fenster */
    const reihen = Math.max(1, Math.floor(h / (3.2 * s))), sp = Math.max(1, Math.floor(w / (2.6 * s)));
    for (let i = 0; i < reihen; i++) for (let j = 0; j < sp; j++) {
      const fx = x + (j + 0.5) * w / sp - 0.45 * s, fy = yb - h + 1.2 * s + i * (h - 1.6 * s) / reihen;
      g += `<rect x="${r(fx)}" y="${r(fy)}" width="${r(0.9 * s)}" height="${r(1.3 * s)}" fill="${rnd() < 0.2 ? "#d9e6ee" : "#3d4148"}"/>`;
    }
    if (!giebel && rnd() < 0.45) g += `<rect x="${r(x + w * 0.4)}" y="${r(yb - h - dh * 0.55)}" width="${r(1.2 * s)}" height="${r(1.1 * s)}" fill="#e7d9c4"/>`;
    return g;
  };
  /* Hang am Schloss (links): obere Häuser zwischen Bäumen */
  for (const [x, yb, w, h] of [[78, 112, 6, 5], [86, 110, 7, 6], [96, 108, 6, 5], [103, 112, 8, 6], [114, 109, 7, 5.4], [124, 111, 9, 6], [136, 110, 8, 5.6], [146, 112, 7, 6], [156, 110, 9, 5], [168, 112, 7, 6], [178, 110, 8, 5.4], [190, 112, 7, 5], [200, 111, 9, 6], [212, 113, 7, 5]]) k += haus(x, yb, w, h, 0.62, rnd() < 0.4);
  for (const [x, y, s] of [[92, 104, 1.4], [110, 104, 1.2], [132, 103, 1.3], [165, 104, 1.2], [187, 104, 1.4], [208, 106, 1.3], [222, 106, 1.5], [70, 108, 1.6]]) k += `<circle cx="${x}" cy="${y}" r="${r(2.4 * s)}" fill="#4a6a36"/><circle cx="${x + .7}" cy="${y - .7}" r="${r(1.4 * s)}" fill="#6a8a46"/>`;
  /* mittlere Reihen (Hauptstraße, Kornmarkt) */
  for (let x = 40; x < 228; x += 0) { const w = 5.5 + rnd() * 4; k += haus(x, 122 + (x / 228) * 4, w, 6 + rnd() * 3, 0.66, rnd() < 0.35); x += w + 0.3; }
  for (let x = 284; x < 322; x += 0) { const w = 7 + rnd() * 4; k += haus(x, 132 + (x - 284) * 0.12, w, 8 + rnd() * 3, 0.8, rnd() < 0.35); x += w + 0.3; }
  /* vordere Reihe am Kai: links vom Tor (oben, fern), rechts vom Tor (näher, größer) */
  for (let x = 30; x < 182; x += 0) { const w = 5.2 + rnd() * 3.6, yb = sudufer(x) - 1.2; k += haus(x, yb, w, 7 + rnd() * 3.5, 0.7, rnd() < 0.3); x += w + 0.25; }
  for (let x = 197; x < 322; x += 0) {
    const s = 0.8 + (x - 197) / 125 * 0.5, w = (7 + rnd() * 5) * s, yb = sudufer(x + w / 2) - 1.2;
    if (x > 228 && x < 262) { k += haus(x, yb, w, (12 + rnd() * 3) * s * 0.7, s, rnd() < 0.3); x += w + 0.3; continue; }
    k += haus(x, yb, w, (9 + rnd() * 4) * s, s, rnd() < 0.3); x += w + 0.3;
  }
  /* Kaimauer und Uferstraße */
  const kai = []; for (let x = 0; x <= 320; x += 10) kai.push(`${x} ${r(sudufer(x) - 1.2)}`);
  k += `<path d="M${kai.join(" L")}" stroke="#b9a48a" stroke-width="1.6" fill="none"/><path d="M${kai.join(" L")}" stroke="#8a6a52" stroke-width=".4" fill="none" transform="translate(0 1)"/>`;
  S.teil({ id: "altstadt", de: "die Altstadt", syl: "ALT-stadt", it: "il centro storico", itSyl: "CEN-tro STO-ri-co", en: "old town", x: 0, y: 0, kunst: k,
    tipp: "Die Altstadt liegt zwischen dem Neckar und dem Königstuhl. Die Hauptstraße ist über einen Kilometer lang." });
}

/* =====================================================================
   7 — DIE ALTE BRÜCKE (Karl-Theodor-Brücke) — Lupe: Bogen, Statue
   ===================================================================== */
const BN = [391.5, -155], BS = [334, -355.6], WEST = [-3.36, 0.97], OST = [3.36, -0.97];
const bp = (s, z, seite = WEST) => proj(BN[0] + (BS[0] - BN[0]) * s + seite[0], BN[1] + (BS[1] - BN[1]) * s + seite[1], z);
const PFEILER = 4.5 / 200 / 2;
{
  let k = "";
  const ZB = 12.2, ZP = 13.6;
  /* Spiegelung der Brücke im Wasser */
  {
    let o = [], u = [];
    for (let i = 0; i <= 30; i++) { const s = i / 30; o.push(P(bp(s, 0))); u.push(P(bp(s, -9))); }
    k += `<path d="M${o.join(" L")} L${u.reverse().join(" L")} Z" fill="#6e3a2e" opacity=".35" filter="url(#${S.id("spiegel")})"/>`;
  }
  /* die gegenüberliegende Brüstung (Ostseite) — schmaler Streifen hinter der Fahrbahn */
  {
    let o = [], u = [];
    for (let i = 0; i <= 20; i++) { const s = i / 20; o.push(P(bp(s, ZP, OST))); u.push(P(bp(s, ZB, OST))); }
    k += `<path d="M${o.join(" L")} L${u.reverse().join(" L")} Z" fill="#a24a37"/>`;
  }
  /* Ansichtsfläche der Westseite */
  {
    let o = [], u = [];
    for (let i = 0; i <= 30; i++) { const s = i / 30; o.push(P(bp(s, ZP))); u.push(P(bp(s, 0))); }
    k += `<path d="M${o.join(" L")} L${u.reverse().join(" L")} Z" fill="${S.lg("bruecke", [[0, "#9f4936"], [0.5, "#b95a43"], [1, "#a85340"]], 0, 0, 1, 0)}"/>`;
  }
  /* neun Bögen; Pfeiler mit Vorköpfen */
  for (let j = 0; j < 9; j++) {
    const a = j / 9 + (j ? PFEILER : 0.012), b = (j + 1) / 9 - (j < 8 ? PFEILER : 0.012);
    const pts = [];
    for (let i = 0; i <= 12; i++) { const t = i / 12, s = a + (b - a) * t, z = 2.2 + 7.6 * Math.pow(Math.sin(Math.PI * t), 0.75); pts.push(P(bp(s, z))); }
    const fa = bp(a, 0), fb = bp(b, 0);
    k += `<path d="M${P(fa)} L${pts.join(" L")} L${P(fb)} Z" fill="${S.lg("bogen", [[0, "#2b1d1a"], [0.7, "#4a3a34"], [1, "#6d7d78"]])}"/>`;
    k += `<path d="M${pts.join(" L")}" stroke="#d78a6c" stroke-width=".45" fill="none"/>`;
    /* Lichtschein unter dem Bogen: Wasser dahinter */
    const m1 = bp(a + (b - a) * 0.2, 0.2), m2 = bp(a + (b - a) * 0.8, 0.2);
    k += `<path d="M${P(m1)} L${P(m2)}" stroke="#8fa6a2" stroke-width=".7" opacity=".7"/>`;
    if (j < 8) {
      const s = (j + 1) / 9, p0 = bp(s - PFEILER, 0), p1 = bp(s + PFEILER, 0), top = bp(s, 4.6), tl = bp(s - PFEILER, 3.2), tr = bp(s + PFEILER, 3.2);
      k += `<path d="M${P(p0)} L${P(tl)} L${P(top)} L${P(tr)} L${P(p1)} Z" fill="#c76a50"/>`;
      k += `<path d="M${P(bp(s + PFEILER * 0.6, 4))} L${P(bp(s + PFEILER * 0.6, ZB - 0.6))}" stroke="#d98a6c" stroke-width=".35" opacity=".8"/>`;
    }
  }
  /* Gesims und Brüstung */
  {
    let g = [];
    for (let i = 0; i <= 30; i++) g.push(P(bp(i / 30, ZB)));
    k += `<path d="M${g.join(" L")}" stroke="#e39a78" stroke-width=".6" fill="none"/>`;
    let t = [];
    for (let i = 0; i <= 30; i++) t.push(P(bp(i / 30, ZP)));
    k += `<path d="M${t.join(" L")}" stroke="#f0b090" stroke-width=".5" fill="none"/>`;
  }
  /* Statuen auf der Brüstung: Minerva (Neuenheimer Seite) und Karl Theodor (Altstadtseite) */
  const statue = (s) => {
    const fuss = bp(s, ZP), kopf = bp(s, ZP + 7.4), h = fuss[1] - kopf[1], x = fuss[0];
    let g = `<rect x="${r(x - h * 0.2)}" y="${r(fuss[1] - h * 0.5)}" width="${r(h * 0.4)}" height="${r(h * 0.5)}" fill="#c77356"/><rect x="${r(x - h * 0.24)}" y="${r(fuss[1] - h * 0.52)}" width="${r(h * 0.48)}" height="${r(h * 0.06)}" fill="#e39a78"/>`;
    g += `<path d="M${r(x - h * 0.12)} ${r(fuss[1] - h * 0.52)} L${r(x - h * 0.09)} ${r(kopf[1] + h * 0.16)} L${r(x + h * 0.09)} ${r(kopf[1] + h * 0.16)} L${r(x + h * 0.12)} ${r(fuss[1] - h * 0.52)} Z" fill="#d6d2c4"/><circle cx="${r(x)}" cy="${r(kopf[1] + h * 0.1)}" r="${r(h * 0.08)}" fill="#d6d2c4"/>`;
    return g;
  };
  k += statue(2 / 9) + statue(7 / 9);
  /* Laternen auf der Brüstung */
  for (const s of [0.1, 0.33, 0.44, 0.56, 0.67, 0.9]) { const a = bp(s, ZP), b = bp(s, ZP + 4.2); k += `<path d="M${P(a)} L${P(b)}" stroke="#2f2a28" stroke-width=".3"/><circle cx="${r(b[0])}" cy="${r(b[1])}" r=".45" fill="#f2e6c2"/>`; }
  const sK = bp(7 / 9, ZP), bM = bp(0.5 / 9 + 6 / 9, 6);
  S.teil({ id: "alte_bruecke", de: "die Alte Brücke", syl: "AL-te BRÜ-cke", it: "il Ponte Vecchio", itSyl: "PON-te VEC-chio", en: "Old Bridge", x: 0, y: 0, kunst: k,
    tipp: "Die Alte Brücke ist rund 200 Meter lang. Sie wurde 1788 aus rotem Sandstein gebaut.",
    zoom: { x: 96, y: 112, w: 90, h: 60 },
    unter: [
      { id: "bogen", de: "der Bogen", syl: "BO-gen", it: "l'arco", itSyl: "AR-co", en: "arch", x: bM[0], y: bM[1], kunst: flaeche(-7, -4, 14, 8),
        tipp: "Die Brücke hat neun Bögen. Bei Hochwasser fließt das Wasser durch alle." },
      { id: "statue", de: "die Statue", syl: "STA-tu-e", it: "la statua", itSyl: "STA-tu-a", en: "statue", x: sK[0], y: sK[1], kunst: flaeche(-2.2, -6.6, 4.4, 6.8, 0.6),
        tipp: "Auf der Brücke stehen Kurfürst Karl Theodor und die Göttin Minerva." },
    ] });
}

/* =====================================================================
   8 — DAS BRÜCKENTOR mit dem BRÜCKENAFFEN — Lupe: Haube, Brückenaffe
   ===================================================================== */
const TOR = (() => { const p = bp(1, 12.2, [0, 0]); return { x: p[0] + 3, y: p[1] + 1 }; })();
{
  let k = "";
  const turm = (cx, w, h, dunkler) => {
    let g = `<rect x="${r(cx - w / 2)}" y="${r(-h)}" width="${r(w)}" height="${r(h)}" fill="${PUTZ}"/>`;
    g += `<rect x="${r(cx - w / 2)}" y="${r(-h)}" width="${r(w * 0.32)}" height="${r(h)}" fill="#8f8879" opacity="${dunkler ? 0.38 : 0.24}"/>`;
    g += `<rect x="${r(cx - w / 2 - .3)}" y="${r(-h - .9)}" width="${r(w + .6)}" height="1.2" fill="#b4553f"/><rect x="${r(cx - w / 2)}" y="${r(-h * 0.5)}" width="${r(w)}" height=".6" fill="#c86e54"/>`;
    g += `<rect x="${r(cx - .5)}" y="${r(-h * 0.82)}" width="1" height="1.6" fill="#3d3a38"/><rect x="${r(cx - .4)}" y="${r(-h * 0.36)}" width=".8" height="1.4" fill="#3d3a38"/><rect x="${r(cx + w * 0.18)}" y="${r(-h * 0.66)}" width=".7" height="1.2" fill="#3d3a38"/>`;
    /* barocke Haube: Glocke, Hals, kleine Zwiebel, Spitze mit Knauf */
    const hb = -h - 0.9;
    g += `<path d="M${r(cx - w / 2 - .2)} ${r(hb)} Q${r(cx - w / 2 - .6)} ${r(hb - 3.6)} ${r(cx - 1.2)} ${r(hb - 5.2)} Q${r(cx - .6)} ${r(hb - 6)} ${r(cx - .6)} ${r(hb - 7)} L${r(cx + .6)} ${r(hb - 7)} Q${r(cx + .6)} ${r(hb - 6)} ${r(cx + 1.2)} ${r(hb - 5.2)} Q${r(cx + w / 2 + .6)} ${r(hb - 3.6)} ${r(cx + w / 2 + .2)} ${r(hb)} Z" fill="${SCHIEFER}"/>`;
    g += `<path d="M${r(cx + 1.6)} ${r(hb - 4.4)} Q${r(cx + w / 2 - .2)} ${r(hb - 3)} ${r(cx + w / 2 - .4)} ${r(hb - .6)}" stroke="#a7b2bd" stroke-width=".35" fill="none"/>`;
    g += `<path d="M${r(cx - 1)} ${r(hb - 7)} Q${r(cx - 1.2)} ${r(hb - 8.4)} ${r(cx)} ${r(hb - 9.2)} Q${r(cx + 1.2)} ${r(hb - 8.4)} ${r(cx + 1)} ${r(hb - 7)} Z" fill="${SCHIEFER}"/>`;
    g += `<path d="M${r(cx)} ${r(hb - 9.2)} V${r(hb - 11.6)}" stroke="#3a4049" stroke-width=".35"/><circle cx="${r(cx)}" cy="${r(hb - 10.2)}" r=".4" fill="#d8b04a"/>`;
    return g;
  };
  /* linker Turm (Ostseite, etwas weiter weg) */
  k += turm(-5.4, 6.2, 20.4, true);
  /* Torbau dazwischen mit Durchfahrt und Fallgatter-Schlitz */
  k += `<rect x="-3" y="-15.6" width="6" height="15.6" fill="${PUTZ}"/><rect x="-3" y="-15.6" width="6" height="15.6" fill="#c9c2b4" opacity=".35"/>`;
  k += `<path d="M-3.4 -15.4 L0 -18 L3.4 -15.4 Z" fill="${SCHIEFER}"/>`;
  k += `<path d="M-1.9 0 V-5.6 Q0 -8.4 1.9 -5.6 V0 Z" fill="#2a2420"/><path d="M-2.4 0 V-5.8 Q0 -9.2 2.4 -5.8 V0" stroke="#b4553f" stroke-width=".6" fill="none"/>`;
  k += `<rect x="-.7" y="-12" width="1.4" height="1.8" fill="#3d3a38"/><rect x="-2.6" y="-9.6" width="5.2" height=".5" fill="#c86e54"/>`;
  /* rechter Turm (Westseite, näher) */
  k += turm(5.6, 6.8, 21, false);
  /* Brückenaffe (Bronze) am Westende der Brücke, mit Spiegel */
  const AX = 11.4, AY = -.4;
  k += `<rect x="${AX - 1.4}" y="${AY - .6}" width="2.8" height=".8" fill="#9a8f80"/>`;
  k += `<ellipse cx="${AX}" cy="${AY - 1.7}" rx="1.05" ry="1.25" fill="${S.lg("bronze", [[0, "#4d3a22"], [0.5, "#8a6a3a"], [1, "#c9a25a"]], 0, 0, 1, 0)}"/>`;
  k += `<circle cx="${AX + .1}" cy="${AY - 3.3}" r=".72" fill="#7a5c32"/><circle cx="${AX + .32}" cy="${AY - 3.35}" r=".28" fill="#c9a25a"/>`;
  k += `<path d="M${AX + .8} ${AY - 2.2} L${AX + 1.7} ${AY - 3.2}" stroke="#7a5c32" stroke-width=".4"/><circle cx="${AX + 1.9}" cy="${AY - 3.5}" r=".5" fill="#d9c58a" stroke="#6a4e2a" stroke-width=".15"/>`;
  S.teil({ id: "brueckentor", de: "das Brückentor", syl: "BRÜ-cken-tor", it: "la porta del ponte", itSyl: "POR-ta del PON-te", en: "bridge gate", x: TOR.x, y: TOR.y, kunst: k,
    tipp: "Das Brückentor war früher Teil der Stadtmauer. Es hat zwei Türme und ist 28 Meter hoch.",
    zoom: { x: TOR.x - 26, y: TOR.y - 38, w: 52, h: 42 },
    unter: [
      { id: "turmhaube", de: "die Turmhaube", syl: "TURM-hau-be", it: "la cupola della torre", itSyl: "CU-po-la del-la TOR-re", en: "tower cap", x: TOR.x + 5.6, y: TOR.y - 22, kunst: flaeche(-4, -11.6, 8, 12),
        tipp: "Seit 1788 tragen die Türme barocke Hauben aus Schiefer." },
      { id: "brueckenaffe", de: "der Brückenaffe", syl: "BRÜ-cken-af-fe", it: "la scimmia del ponte", itSyl: "SCIM-mia del PON-te", en: "bridge monkey", x: TOR.x + 11.4, y: TOR.y, kunst: flaeche(-1.8, -4.4, 4, 4.8, 0.5),
        tipp: "Der Affe aus Bronze hält einen Spiegel. Wer seine Finger berührt, kommt wieder nach Heidelberg — sagt man." },
    ] });
}

/* =====================================================================
   9 — DAS AUSFLUGSSCHIFF (fährt neckarabwärts nach rechts)
   ===================================================================== */
{
  let k = schatten(0, .4, 20, 1.2, .25);
  k += `<path d="M-23 -.8 q-4 .8 -8 .2 M21 -.6 q5 1 11 .2" stroke="#eef3f1" stroke-width=".6" fill="none" opacity=".85"/>`;
  k += `<path d="M-21 -4.6 L18 -4.6 Q22 -4.4 23.6 -3 L21 .4 L-19.6 .4 Q-21 -1.6 -21 -4.6 Z" fill="${S.lg("rumpf", [[0, "#ffffff"], [0.6, "#e9ecee"], [0.62, "#1f3f78"], [0.8, "#1f3f78"], [0.82, "#d9dde0"], [1, "#d9dde0"]])}"/>`;
  k += `<rect x="-18" y="-8.6" width="32" height="4" rx=".6" fill="#fbfbf8"/>`;
  for (let x = -16.6; x < 13; x += 2.4) k += `<rect x="${r(x)}" y="-7.9" width="1.8" height="2.2" rx=".3" fill="#3a5568"/>`;
  k += `<rect x="-19" y="-9.4" width="34" height=".8" fill="#e3e7ea"/><path d="M-18 -9.4 V-11 H14 V-9.4" stroke="#9aa3aa" stroke-width=".25" fill="none"/>`;
  for (let x = -16; x < 14; x += 2.2) k += `<line x1="${x}" y1="-9.4" x2="${x}" y2="-11" stroke="#9aa3aa" stroke-width=".15"/>`;
  k += `<rect x="8" y="-13.4" width="6.4" height="4" rx=".5" fill="#fbfbf8"/><rect x="8.6" y="-12.8" width="5.2" height="1.6" fill="#2e4658"/>`;
  /* Fahrgäste auf dem Sonnendeck (Punkte) und Sonnenschirm */
  for (const [x, c] of [[-14, "#b8473a"], [-11, "#2f5f95"], [-6, "#d8ad3a"], [-3, "#eeefec"], [1, "#4f8a46"]]) k += `<rect x="${x}" y="-11.8" width=".9" height="1.6" rx=".3" fill="${c}"/><circle cx="${x + .45}" cy="-12.3" r=".45" fill="#e2b48e"/>`;
  k += `<line x1="-17.6" y1="-4.6" x2="-17.6" y2="-12.4" stroke="#8a8f94" stroke-width=".3"/><rect x="-17.6" y="-12.4" width="2.6" height=".6" fill="#222"/><rect x="-17.6" y="-11.8" width="2.6" height=".6" fill="#c33"/><rect x="-17.6" y="-11.2" width="2.6" height=".6" fill="#e8c23a"/>`;
  k += `<text x="2" y="-5.3" font-size="1.4" text-anchor="middle" fill="#1f3f78" font-family="Arial,sans-serif" font-weight="bold" letter-spacing=".2">NECKAR</text>`;
  S.teil({ id: "ausflugsschiff", de: "das Ausflugsschiff", syl: "AUS-flugs-schiff", it: "il battello turistico", itSyl: "bat-TEL-lo tu-RI-sti-co", en: "excursion boat", x: 228, y: 166, kunst: `<g transform="scale(.82)">${k}</g>`,
    tipp: "Mit dem Ausflugsschiff fährt man auf dem Neckar bis nach Neckarsteinach." });
}

/* =====================================================================
   10 — DAS UFER (Neuenheim, wo die Brücke ankommt) — unten links
   ===================================================================== */
{
  let k = `<path d="M0 154 L16 158.6 Q40 168 62 182 L0 182 Z" fill="${S.lg("ufer", [[0, "#7c8a5a"], [1, "#5c6c42"]])}"/>`;
  k += `<path d="M0 155.6 L16 160 Q40 169.6 62 183.4" stroke="#c9bfae" stroke-width="1.6" fill="none"/>`;
  k += `<path d="M0 154 L16 158.6 Q40 168 62 182" stroke="#8a7a66" stroke-width=".6" fill="none"/>`;
  /* Dächer und Bäume von Neuenheim */
  for (const [x, y, w, c] of [[2, 163, 9, "#8a442e"], [12, 166, 8, "#5e6168"], [23, 170, 10, "#9c4f35"], [4, 172, 8, "#a65a3c"], [35, 176, 9, "#7a3a26"], [16, 177, 9, "#8a442e"]]) {
    k += `<path d="M${x} ${y} L${x + 2} ${y - 3.4} L${x + w - 2} ${y - 3.4} L${x + w} ${y} Z" fill="${c}"/><rect x="${x}" y="${y}" width="${w}" height="3" fill="#ece2cc"/>`;
    for (let i = 0; i < 3; i++) k += `<rect x="${r(x + 1.2 + i * w / 3.4)}" y="${y + .8}" width=".9" height="1.2" fill="#3d4148"/>`;
  }
  for (const [x, y, s] of [[10, 160, 1.3], [30, 167, 1.5], [44, 172, 1.4], [1, 167, 1.2], [26, 178, 1.3], [50, 179, 1.2]]) k += `<circle cx="${x}" cy="${y}" r="${r(2.6 * s)}" fill="#4a6a36"/><circle cx="${x + .9}" cy="${y - .9}" r="${r(1.6 * s)}" fill="#6f8f48"/>`;
  S.teil({ id: "ufer", de: "das Ufer", syl: "U-fer", it: "la riva", itSyl: "RI-va", en: "riverbank", x: 0, y: 0, kunst: k,
    tipp: "Auf dieser Seite liegt der Stadtteil Neuenheim mit der großen Neckarwiese." });
}

/* =====================================================================
   11 — DER WEINBERG (Reben am Hang unter dem Philosophenweg)
   ===================================================================== */
const weinOben = (x) => 180 - (x - 90) * 0.06;
{
  let k = `<path d="M70 200 L70 ${r(weinOben(70))} Q180 ${r(weinOben(180) - 1)} 320 ${r(weinOben(320))} L320 200 Z" fill="${S.lg("weinboden", [[0, "#8a7a52"], [1, "#6a5a3a"]])}"/>`;
  /* Rebzeilen: schräg, mit Pfählen und Laub (Oktober: grün-gelb) */
  for (let i = 0; i < 9; i++) {
    const y0 = weinOben(320) + 1.5 + i * 2.6, x0 = 320, x1 = 90 + i * 6;
    const y1 = Math.max(weinOben(x1) + 1.2, y0 + (x0 - x1) * 0.035);
    k += `<path d="M${x0} ${r(y0)} L${r(x1)} ${r(y1)}" stroke="#4d3a24" stroke-width=".3"/>`;
    for (let t = 0; t <= 1.0001; t += 0.035) {
      const x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t, s = 0.75 + i * 0.09;
      k += `<ellipse cx="${r(x)}" cy="${r(y - 1.1 * s)}" rx="${r(2.1 * s)}" ry="${r(1.25 * s)}" fill="${["#6b8a3a", "#8a9a3e", "#b5a443", "#5f7f36", "#c48a35"][Math.floor(rnd() * 5)]}"/>`;
      if (rnd() < 0.3) k += `<circle cx="${r(x + .6)}" cy="${r(y - .5 * s)}" r="${r(0.42 * s)}" fill="#3a2a4a"/>`;
      if (rnd() < 0.22) k += `<line x1="${r(x)}" y1="${r(y - 2.4 * s)}" x2="${r(x)}" y2="${r(y + .4)}" stroke="#7a6a52" stroke-width="${r(0.22 * s)}"/>`;
    }
  }
  S.teil({ id: "weinberg", de: "der Weinberg", syl: "WEIN-berg", it: "il vigneto", itSyl: "vi-GNE-to", en: "vineyard", x: 0, y: 0, kunst: k,
    tipp: "Am Philosophenweg wuchs früher überall Wein. Im Oktober ist Weinlese." });
}

/* =====================================================================
   12 — DER PHILOSOPHENWEG (Sandsteinmauer und Weg) — vorne
   ===================================================================== */
{
  let k = `<path d="M0 186.4 Q160 184.4 320 186 L320 193 Q160 191.4 0 193.6 Z" fill="${ROT_D}"/>`;
  k += `<path d="M0 186.4 Q160 184.4 320 186 L320 193 Q160 191.4 0 193.6 Z" fill="${QUADER}"/>`;
  k += `<path d="M0 185.4 Q160 183.4 320 185 L320 187 Q160 185.4 0 187.4 Z" fill="${S.lg("mauerkrone", [[0, "#b9654c"], [1, "#d9876a"]], 0, 0, 1, 0)}"/>`;
  for (let i = 0; i < 18; i++) { const x = rnd() * 320; k += `<ellipse cx="${r(x)}" cy="${r(186.4 - Math.sin(x / 320 * Math.PI) * 1.6 + rnd() * 5)}" rx="${r(1 + rnd() * 2)}" ry=".6" fill="#5e7a3a" opacity=".6"/>`; }
  /* der Weg: heller Sandsteinkies */
  k += `<path d="M0 193.6 Q160 191.4 320 193 L320 200 L0 200 Z" fill="${S.lg("weg", [[0, "#c9b597"], [1, "#b39c7c"]])}"/>`;
  for (let i = 0; i < 70; i++) k += `<circle cx="${r(rnd() * 320)}" cy="${r(194 + rnd() * 6)}" r="${r(0.2 + rnd() * 0.35)}" fill="${rnd() < 0.5 ? "#8f7a5e" : "#e3d4ba"}" opacity=".7"/>`;
  S.teil({ id: "philosophenweg", de: "der Philosophenweg", syl: "phi-lo-SO-phen-weg", it: "il Sentiero dei Filosofi", itSyl: "sen-TIE-ro dei fi-LO-so-fi", en: "Philosophers' Walk", x: 0, y: 0, kunst: k,
    tipp: "Auf dem Philosophenweg gingen Professoren und Studenten spazieren und dachten nach." });
}

/* =====================================================================
   13 — DIE STUDENTIN auf 14 — DER BANK (von hinten, mit Blick zum Schloss)
   ===================================================================== */
const BANK = { x: 52, y: 199 };
{
  const s = km(BANK.y);
  const m = B.mensch({ id: "hdb_stud", geschlecht: "w", pose: "sitzen", blick: 196, frisur: "zopf", haarfarbe: "dunkelbraun", haut: "hell",
    kleidung: { oberteil: { stueck: "pullover", farbe: "gelb" }, unterteil: { stueck: "jeans" }, jacke: { stueck: "jacke", farbe: "gruen_d" }, schuhe: { stueck: "turnschuh" }, zubehoer: { stueck: "rucksack", farbe: "rot" } } }, 1.66 * s * 0.92);
  const sitzY = m.z.sitz ? m.z.sitz.y * m.k : -0.45 * s;
  S.def(`<clipPath id="${S.id("sitz")}"><rect x="-30" y="-80" width="60" height="${r(80 + sitzY + 1)}"/></clipPath>`);
  S.teil({ id: "studentin", de: "die Studentin", syl: "stu-DEN-tin", it: "la studentessa", itSyl: "stu-den-TES-sa", en: "student", x: BANK.x + 8, y: BANK.y, kunst: `<g clip-path="url(#${S.id("sitz")})">${m.svg}</g>`,
    tipp: "Die Universität Heidelberg ist die älteste in Deutschland — gegründet 1386." });
}
{
  const s = km(BANK.y), W = 1.7 * s;
  let k = schatten(0, .3, W / 2 + 2, 1.4, .35);
  const HOLZ = S.lg("bankholz", [[0, "#7a5230"], [1, "#5a3a20"]]);
  for (const sx of [-1, 1]) k += `<path d="M${r(sx * (W / 2 - 3))} 0 L${r(sx * (W / 2 - 3))} ${r(-0.44 * s)} L${r(sx * (W / 2 - 2.2))} ${r(-0.9 * s)} L${r(sx * (W / 2 - 3.8))} ${r(-0.9 * s)} L${r(sx * (W / 2 - 3.8))} ${r(-0.44 * s)} L${r(sx * (W / 2 - 5.4))} 0 Z" fill="#2c2a28"/>`;
  for (let i = 0; i < 2; i++) k += `<rect x="${r(-W / 2)}" y="${r(-0.46 * s - i * 1.4)}" width="${r(W)}" height="1.1" rx=".3" fill="${HOLZ}"/>`;
  for (let i = 0; i < 3; i++) k += `<rect x="${r(-W / 2 + .4)}" y="${r(-0.88 * s + i * 2.6)}" width="${r(W - .8)}" height="1.8" rx=".4" fill="${HOLZ}"/><rect x="${r(-W / 2 + .4)}" y="${r(-0.88 * s + i * 2.6)}" width="${r(W - .8)}" height=".5" fill="#a87a4a" opacity=".6"/>`;
  S.teil({ id: "bank", de: "die Bank", syl: "BANK", it: "la panchina", itSyl: "pan-CHI-na", en: "bench", x: BANK.x, y: BANK.y, steht: true, kunst: k });
}

/* =====================================================================
   15 — DER STUDENTENKUSS (Schachtel auf der Mauer) und 16 — DAS BUCH
   ===================================================================== */
{
  const y = 185.6;
  let k = schatten(0, .2, 5, .8, .3);
  /* Schachtel, Deckel offen; darin die Pralinen in Papier */
  k += `<path d="M-4.6 0 L4.6 0 L4.6 -3.6 L-4.6 -3.6 Z" fill="${S.lg("kussbox", [[0, "#f6efe0"], [1, "#e6dcc6"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-4.6" y="-3.6" width="9.2" height=".7" fill="#a8232a"/><rect x="-4.6" y="-.6" width="9.2" height=".6" fill="#a8232a"/>`;
  /* Scherenschnitt: Student mit Mütze und junge Frau, Gesicht an Gesicht */
  k += `<path d="M-1.6 -1 L-1.6 -1.8 Q-2 -2.2 -1.3 -2.5 Q-.9 -2.9 -.5 -2.5 L-.2 -2.3 L-.4 -2 L-.25 -1.8 L-.55 -1.7 L-.6 -1 Z M-1.75 -2.5 L-.7 -2.9 L-.5 -2.55 Z" fill="#1d1a1a"/>`;
  k += `<path d="M1.6 -1 L1.7 -1.8 Q2.2 -2.2 1.6 -2.6 Q1.1 -2.9 .6 -2.5 L.25 -2.3 L.45 -2 L.3 -1.8 L.6 -1.7 L.65 -1 Z" fill="#1d1a1a"/>`;
  k += `<path d="M-4.6 -3.6 L-3.8 -6 L5.2 -6 L4.6 -3.6 Z" fill="#efe6d2"/><path d="M-3.4 -5.4 h7.6" stroke="#a8232a" stroke-width=".35"/>`;
  for (const x of [-2.6, 0, 2.6]) k += `<ellipse cx="${x}" cy="-3.9" rx="1.1" ry=".55" fill="#3a2418"/><ellipse cx="${x - .3}" cy="-4.1" rx=".4" ry=".15" fill="#8a6a52"/>`;
  S.teil({ oben: true, id: "studentenkuss", de: "der Studentenkuss", syl: "stu-DEN-ten-kuss", it: "il bacio dello studente (cioccolatino)", itSyl: "BA-cio del-lo stu-DEN-te", en: "Student Kiss (chocolate)", x: 108, y, steht: true, kunst: k,
    tipp: "Der Studentenkuss ist eine Praline aus Schokolade — seit 1863 aus Heidelberg." });
}
{
  const y = 185.4;
  let k = `<path d="M-3.6 0 L3.6 0 L3.8 -1.4 L-3.4 -1.4 Z" fill="#2f5f95"/><path d="M-3.4 -1.4 L3.8 -1.4 L3.6 -1.9 L-3.6 -1.9 Z" fill="#f4efe2"/><rect x="-3.6" y="-.5" width="7.2" height=".5" fill="#1d3f68"/>`;
  k += `<path d="M-3.6 -1.9 L3.6 -1.9 L3.4 -2.4 L-3.4 -2.4 Z" fill="#b8473a"/>`;
  S.teil({ oben: true, id: "buch", de: "das Buch", syl: "BUCH", it: "il libro", itSyl: "LI-bro", en: "book", x: 122, y, steht: true, kunst: k + flaeche(-4, -3, 8, 3.4, 0.5) });
}

/* =====================================================================
   17 — DIE WEINTRAUBE (Rebe hängt über die Mauer, rechts vorn)
   ===================================================================== */
{
  let k = `<path d="M-14 6 Q-8 -2 0 -4 Q6 -5 10 -2" stroke="#6a4a2a" stroke-width=".9" fill="none"/>`;
  for (const [x, y, rot, f] of [[-10, 1.4, -20, "#7a9a3a"], [-3, -4.6, 10, "#9aa83e"], [6, -5, -30, "#c49a3a"], [11, -2.6, 20, "#8a9a3a"]]) k += `<path d="M${x} ${y} q-2.4 -2.4 0 -4.6 q2.4 2.2 0 4.6 Z" fill="${f}" transform="rotate(${rot} ${x} ${y})"/><path d="M${x} ${y} l0 -4" stroke="#5a6a2a" stroke-width=".2" transform="rotate(${rot} ${x} ${y})"/>`;
  /* die Traube: blaue Beeren mit Reif */
  const beeren = [[0, 0], [-1.3, .4], [1.3, .4], [-.7, 1.6], [.7, 1.6], [-1.6, 1.9], [1.6, 1.8], [0, 2.8], [-1, 3.4], [1, 3.4], [0, 4.6], [-.5, 5.6], [.4, 6.4]];
  for (const [x, y] of beeren) k += `<circle cx="${x}" cy="${y}" r="1" fill="${S.rg("beere", [[0, "#8a7aa8"], [0.5, "#4a3a6a"], [1, "#2a1e3e"]], 0.35, 0.3, 0.7)}"/><circle cx="${r(x - .35)}" cy="${r(y - .35)}" r=".25" fill="#d8d0e8" opacity=".7"/>`;
  k += `<path d="M0 -4 Q.4 -2 0 -.8" stroke="#6a4a2a" stroke-width=".4" fill="none"/>`;
  S.teil({ oben: true, id: "weintraube", de: "die Weintraube", syl: "WEIN-trau-be", it: "il grappolo d'uva", itSyl: "GRAP-po-lo DU-va", en: "bunch of grapes", x: 288, y: 181, kunst: k,
    tipp: "Aus den Trauben vom Neckarhang wird Wein gemacht." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/heidelberg.js"));
console.log(aus);
