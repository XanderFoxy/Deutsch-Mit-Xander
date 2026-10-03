#!/usr/bin/env node
/* =====================================================================
   MAGDEBURG (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   STANDORT: Elbwiese am Ostufer (Werder / Rotehornpark), südlich der
   Hubbrücke. Weitwinkel-Blick über die Elbe nach Westen auf die
   Altstadt; rechts hinten über dem Werder der Jahrtausendturm.

   RECHERCHE (merian.de „10 Highlights an der Elbe“, Stadt Magdeburg,
   Volksstimme zur Hubbrücke):
   - „Einer der schönsten Blicke auf Magdeburg ist der vom Elbufer
     hinauf zum DOM.“ Vom Fluss aus sieht man den Chor im Osten mit
     seinen hohen gotischen Fenstern und Strebepfeilern; dahinter ragen
     die zwei Westtürme (104 m) mit achteckigen Spitzen auf.
   - Gleich neben dem Domplatz die GRÜNE ZITADELLE (Hundertwasser, 2005):
     rosa Fassade, kein Fenster wie das andere, Bäume wachsen aus den
     Fenstern („Baummieter“), bunte Keramiksäulen, begrüntes Dach,
     goldene Kugeln auf den Türmchen.
   - Weiter nördlich Johanniskirche (zwei Türme), Wallonerkirche und
     Petrikirche am Petriförder, dem Anleger der „Weißen Flotte“
     (weiße Fahrgastschiffe mit blauem Band).
   - Die HUBBRÜCKE (1846/1890er, Stahlfachwerk) führt über die Stromelbe
     zum Werder; ihr Mittelteil ist dauerhaft angehoben, man steigt über
     steile Treppen.
   - Im Elbauenpark der JAHRTAUSENDTURM (60 m, Holz, kegelförmig) —
     ein Museum zur Geschichte der Wissenschaft.
   - Am Ufer: Elberadweg, Bänke, Rettungsringe, Möwen und Enten.
   - Ein Fachwerkhaus steht am Altstadtufer (in Magdeburg sind nach dem
     Krieg nur wenige erhalten; die alte Szene hat das Wort, es bleibt).
   Maßstab: vorne (Wiese) ≈ 22 Einheiten je Meter (Bank 0,45 m Sitz),
   Altstadtufer ≈ 300 m entfernt, Horizont bei y 112.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "magdeburg", titel: "Magdeburg", emoji: "🏰", thema: "Deutschland", kuerzel: "mdb", fassung: 852 });
const rnd = zufall(805);
const r = B.r;

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const UFER = 122;      /* Wasserlinie am Altstadtufer */
const NAH = 170;       /* Wasserlinie am Werder (vorne) */
const SAND = S.lg("sand", [[0, "#e6dcc4"], [1, "#c5b896"]], 0, 0, 1, 0);
const SAND_D = S.lg("sandd", [[0, "#cdbf9e"], [1, "#a99a78"]], 0, 0, 1, 0);
const KUPFER = S.lg("kupfer", [[0, "#93c7b0"], [0.5, "#64a08a"], [1, "#43796a"]], 0, 0, 1, 0);
const SCHIEFER = S.lg("schiefer", [[0, "#6d727b"], [1, "#4b4f58"]]);
const GOLD = S.rg("gold", [[0, "#fff3b0"], [0.45, "#e7bc3c"], [1, "#9b7414"]], 0.38, 0.32, 0.7);
const ROSA = S.lg("rosa", [[0, "#f6c9cf"], [1, "#e7a8b2"]], 0, 0, 1, 0);
const STAHL = S.lg("stahl", [[0, "#5d7180"], [1, "#3f505d"]]);

/* =====================================================================
   KULISSE — Himmel, Altstadtufer, Elbe, Werder
   ===================================================================== */
S.hinten(`<rect width="320" height="${UFER}" fill="${S.lg("himmel", [[0, "#6fa3d6"], [0.65, "#b7d3ea"], [1, "#f1ead9"]])}"/>`);
S.hinten(`<g fill="#fff"><ellipse cx="190" cy="18" rx="34" ry="5" opacity=".8"/><ellipse cx="212" cy="14" rx="16" ry="5" opacity=".9"/><ellipse cx="40" cy="30" rx="26" ry="3.4" opacity=".6"/><ellipse cx="290" cy="46" rx="30" ry="3" opacity=".55"/></g>`);
/* Häuserzeile der Altstadt hinter dem Ufer (dunstig) */
{
  let g = "";
  const f = ["#e3d6c0", "#d9c9ad", "#e9dfcd", "#cfc3b0", "#e1cdb7", "#d6d0c6"];
  let x = -4;
  while (x < 324) {
    const w = 8 + rnd() * 12, h = 10 + rnd() * 10;
    g += `<rect x="${r(x)}" y="${r(UFER - 8 - h)}" width="${r(w)}" height="${r(h + 2)}" fill="${f[Math.floor(rnd() * f.length)]}"/>`;
    g += `<path d="M${r(x - 0.4)} ${r(UFER - 8 - h)} L${r(x + w * 0.2)} ${r(UFER - 12 - h)} L${r(x + w * 0.8)} ${r(UFER - 12 - h)} L${r(x + w + 0.4)} ${r(UFER - 8 - h)} Z" fill="${rnd() < 0.6 ? "#9a6a55" : "#70757d"}"/>`;
    for (let j = 0; j < 3; j++) for (let i = 0; i < Math.floor(w / 3); i++) g += `<rect x="${r(x + 1 + i * 3)}" y="${r(UFER - 6 - h + 1.6 + j * 3.6)}" width="1.2" height="1.6" fill="#6b7480" opacity=".5"/>`;
    x += w;
  }
  /* Dunst */
  g += `<rect y="${UFER - 34}" width="320" height="30" fill="${S.lg("dunst", [[0, "#f1ead9", 0.6], [1, "#f1ead9", 0.15]])}"/>`;
  /* Uferbäume und Promenade mit Ufermauer */
  for (let x2 = -4; x2 < 326; x2 += 5 + rnd() * 4) g += `<ellipse cx="${r(x2)}" cy="${r(UFER - 7 - rnd() * 2)}" rx="${r(4 + rnd() * 3)}" ry="${r(3.4 + rnd() * 2)}" fill="${["#5f8150", "#6f9160", "#567645"][Math.floor(rnd() * 3)]}"/>`;
  g += `<rect y="${UFER - 5}" width="320" height="3" fill="#cfc6b4"/><rect y="${UFER - 2.2}" width="320" height="2.6" fill="${S.lg("mauer", [[0, "#a59a86"], [1, "#857a68"]])}"/>`;
  for (let x2 = 6; x2 < 320; x2 += 26) g += `<rect x="${x2}" y="${UFER - 11}" width=".5" height="6" fill="#3c3c3c"/><circle cx="${x2 + 0.25}" cy="${UFER - 11.2}" r=".8" fill="#f6efd8"/>`;
  S.hinten(g);
}

/* =====================================================================
   1 — DER DOM (Chor nach Osten, dahinter die zwei Westtürme)
   ===================================================================== */
{
  let k = "";
  const turm = (x) => {
    let t = `<rect x="${x - 7}" y="-62" width="14" height="40" fill="${SAND}"/>`;
    for (let i = 0; i < 4; i++) t += `<rect x="${x - 7}" y="${-62 + i * 10}" width="14" height="1" fill="#b6a684"/>`;
    t += `<rect x="${x - 1.6}" y="-58" width="3.2" height="7" rx="1.6" fill="#55606c"/><rect x="${x - 1.6}" y="-46" width="3.2" height="9" rx="1.6" fill="#55606c"/>`;
    /* achteckiges Glockengeschoss mit Ecktürmchen */
    t += `<rect x="${x - 6}" y="-74" width="12" height="12" fill="${SAND}"/>`;
    t += `<rect x="${x - 4}" y="-72.6" width="2.6" height="8" rx="1.3" fill="#4b5560"/><rect x="${x + 1.4}" y="-72.6" width="2.6" height="8" rx="1.3" fill="#4b5560"/>`;
    for (const s of [-1, 1]) t += `<path d="M${x + s * 6.6} -62 L${x + s * 6.6} -76 L${x + s * 5.4} -80 L${x + s * 4.2} -76 L${x + s * 4.2} -62 Z" fill="${SAND_D}"/>`;
    /* steinerne Spitze mit Kreuzblume */
    t += `<path d="M${x - 5.6} -74 L${x} -96 L${x + 5.6} -74 Z" fill="${S.lg("helm", [[0, "#cbbd9b"], [0.5, "#ddd0b2"], [1, "#a9997a"]], 0, 0, 1, 0)}"/>`;
    for (let i = 1; i < 5; i++) t += `<path d="M${r(x - 5.6 + i * 1.1)} ${-74 - i * 4.4} l-.9 .2 M${r(x + 5.6 - i * 1.1)} ${-74 - i * 4.4} l.9 .2" stroke="#a9997a" stroke-width=".6"/>`;
    t += `<line x1="${x}" y1="-96" x2="${x}" y2="-100" stroke="#8d7a4a" stroke-width=".6"/><path d="M${x - 1.2} -98.6 h2.4" stroke="#8d7a4a" stroke-width=".5"/>`;
    t += `<path d="M${x - 7} -62 L${x - 5} -62 L${x - 5} -22 L${x - 7} -22 Z" fill="#fff" opacity=".15"/>`;
    return t;
  };
  k += turm(-13) + turm(13);
  /* Langhausdach zwischen und vor den Türmen */
  k += `<path d="M-26 -22 L-20 -40 L20 -40 L26 -22 Z" fill="${SCHIEFER}"/>`;
  /* Querhaus links und rechts */
  k += `<rect x="-40" y="-26" width="16" height="26" fill="${SAND}"/><path d="M-41 -26 L-32 -38 L-23 -26 Z" fill="${SCHIEFER}"/>`;
  k += `<rect x="24" y="-26" width="16" height="26" fill="${SAND}"/><path d="M23 -26 L32 -38 L41 -26 Z" fill="${SCHIEFER}"/>`;
  k += `<rect x="-35" y="-22" width="4" height="12" rx="2" fill="#4f5a66"/><rect x="29" y="-22" width="4" height="12" rx="2" fill="#4f5a66"/>`;
  /* Chor mit Umgang (drei sichtbare Seiten des Polygons) */
  k += `<path d="M-22 0 L-22 -28 L-12 -32 L12 -32 L22 -28 L22 0 Z" fill="${S.lg("chor", [[0, "#d1c3a2"], [0.35, "#efe5cc"], [0.7, "#e3d6b8"], [1, "#bfae8a"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-23 -28 L-12 -40 L12 -40 L23 -28 L12 -32 L-12 -32 Z" fill="${SCHIEFER}"/><path d="M-12 -40 L0 -46 L12 -40 Z" fill="#5a5f68"/>`;
  for (const x of [-16, -6.4, 3.2, 12.8]) k += `<path d="M${x} -6 L${x} -24 Q${x + 1.6} -27.6 ${x + 3.2} -24 L${x + 3.2} -6 Z" fill="${S.lg("domfenster", [[0, "#5c6a7a"], [1, "#3c4754"]])}"/><line x1="${x + 1.6}" y1="-25" x2="${x + 1.6}" y2="-6" stroke="#cfc2a3" stroke-width=".3"/>`;
  for (const x of [-22, -11.5, -1.6, 8.2, 18]) k += `<path d="M${x} 0 L${x} -30 L${x + 2.2} -31 L${x + 3.2} 0 Z" fill="${SAND_D}"/><path d="M${x + 1} -31 L${x + 1.6} -34 L${x + 2.2} -31 Z" fill="#b6a684"/>`;
  /* Umgang unten mit niedrigerem Pultdach */
  k += `<path d="M-24 -6 L-24 0 L24 0 L24 -6 L20 -8 L-20 -8 Z" fill="#cdbf9e"/>`;
  k += `<rect x="-40" y="-1" width="80" height="1.6" fill="#a99a78"/>`;
  S.teil({ id: "dom", de: "der Dom", syl: "DOM", it: "la cattedrale", itSyl: "cat-te-DRA-le", en: "cathedral", x: 80, y: UFER - 8, steht: true, kunst: k,
    tipp: "Der Magdeburger Dom ist die erste gotische Kathedrale in Deutschland. Hier liegt Kaiser Otto der Große begraben." });
}

/* =====================================================================
   2 — DIE GRÜNE ZITADELLE (Hundertwasser) — mit Lupe
   ===================================================================== */
const ZI = { x: 160, y: UFER - 8 };
{
  const unter = [];
  let k = "";
  /* rosa Baukörper mit welliger Oberkante */
  k += `<path d="M-30 0 L-30 -30 Q-24 -33 -18 -31 Q-10 -36 -2 -33 Q8 -37 16 -32 Q24 -35 30 -31 L30 0 Z" fill="${ROSA}"/>`;
  /* Geschossbänder in Hundertwasser-Farben, wellig */
  for (let i = 0; i < 4; i++) k += `<path d="M-30 ${-6 - i * 6.5} Q-15 ${-7.6 - i * 6.5} 0 ${-6 - i * 6.5} Q15 ${-4.6 - i * 6.5} 30 ${-6.4 - i * 6.5}" stroke="${["#d6575f", "#4f8fcf", "#e3b23c", "#5aa36a"][i]}" stroke-width=".6" fill="none" opacity=".8"/>`;
  /* Fenster: jedes anders */
  const fenster = [];
  for (let j = 0; j < 4; j++) for (let i = 0; i < 9; i++) {
    const x = -27 + i * 6.3 + (rnd() - 0.5) * 1.4, y = -10 - j * 6.5 + (rnd() - 0.5) * 1.2, w = 2 + rnd() * 1.3, h = 2.4 + rnd() * 1.2;
    fenster.push([x, y]);
    k += `<rect x="${r(x)}" y="${r(y)}" width="${r(w)}" height="${r(h)}" rx="${r(rnd() * 1)}" fill="#3e5163" stroke="${["#f4f1e6", "#e3b23c", "#4f8fcf", "#d6575f"][Math.floor(rnd() * 4)]}" stroke-width=".4"/>`;
  }
  /* Bunte Keramiksäulen im Erdgeschoss */
  const saeulen = [-22, -10, 6, 18];
  saeulen.forEach((x, i) => {
    k += `<rect x="${x - 0.9}" y="-6.6" width="1.8" height="6.6" fill="${["#d6575f", "#4f8fcf", "#e3b23c", "#5aa36a"][i]}"/>`;
    for (let j = 0; j < 3; j++) k += `<rect x="${x - 1.1}" y="${-6.2 + j * 2.2}" width="2.2" height=".6" rx=".3" fill="#f4f1e6"/>`;
  });
  k += `<path d="M-16 0 L-16 -5 Q-12 -9 -8 -5 L-8 0 Z" fill="#3c2e2a"/>`;
  /* Gründach mit Wiese und Bäumen */
  k += `<path d="M-31 -30.4 Q-24 -33.6 -18 -31.6 Q-10 -36.6 -2 -33.6 Q8 -37.6 16 -32.6 Q24 -35.6 31 -31.4 Q24 -38 16 -36.6 Q8 -41 -2 -37.6 Q-10 -40 -18 -35.6 Q-24 -37.4 -31 -30.4 Z" fill="#6f9a4c"/>`;
  for (const [x, y, rr] of [[-20, -37, 3.4], [-6, -40, 3], [10, -41, 3.8], [22, -38.6, 2.8]]) k += `<line x1="${x}" y1="${y + 2}" x2="${x}" y2="${y + 4.6}" stroke="#5a4330" stroke-width=".6"/><circle cx="${x}" cy="${y}" r="${rr}" fill="#557f3c"/><circle cx="${x - 1}" cy="${y - 1}" r="${rr * 0.5}" fill="#79a85a"/>`;
  /* Turm mit Zwiebel und goldener Kugel */
  const tx = 24;
  k += `<rect x="${tx - 3}" y="-46" width="6" height="15" fill="${ROSA}"/><path d="M${tx - 3} -40 h6 M${tx - 3} -36 h6" stroke="#4f8fcf" stroke-width=".5"/>`;
  k += `<path d="M${tx - 3.6} -46 Q${tx - 4.6} -51 ${tx} -54 Q${tx + 4.6} -51 ${tx + 3.6} -46 Z" fill="#e3b23c"/><circle cx="${tx}" cy="-56" r="2.4" fill="${GOLD}"/>`;
  const tx2 = -24;
  k += `<rect x="${tx2 - 2.2}" y="-41" width="4.4" height="9" fill="#f4f1e6"/><circle cx="${tx2}" cy="-43.2" r="2.4" fill="${GOLD}"/>`;
  /* ein Baum wächst aus dem Fenster */
  const [bx, by] = fenster[22];
  k += `<path d="M${r(bx + 1.2)} ${r(by + 1)} q2 -1 3.4 -3" stroke="#5a4330" stroke-width=".55" fill="none"/><circle cx="${r(bx + 4.6)}" cy="${r(by - 3.6)}" r="2.6" fill="#4f7d3a"/><circle cx="${r(bx + 4)}" cy="${r(by - 4.4)}" r="1.3" fill="#7aab58"/>`;
  k += `<path d="M-30 -30 L-27 -31 L-27 0 L-30 0 Z" fill="#fff" opacity=".18"/>`;
  unter.push({ id: "kugel", de: "die goldene Kugel", syl: "GOL-de-ne KU-gel", it: "la sfera dorata", itSyl: "SFE-ra do-RA-ta", en: "golden ball", x: ZI.x + tx, y: ZI.y - 53, kunst: flaecheEllipse(0, -3, 3, 3.2),
    tipp: "Goldene Kugeln auf den Türmen sind typisch für Hundertwasser." });
  unter.push({ id: "baummieter", de: "der Baummieter", syl: "BAUM-mie-ter", it: "l'albero inquilino", itSyl: "AL-be-ro in-qui-LI-no", en: "tree tenant", x: ZI.x + bx + 4.4, y: ZI.y + by - 0.8, kunst: flaecheEllipse(0, -3, 3, 3.2),
    tipp: "Ein Baum wächst aus einem Fenster. Hundertwasser nannte ihn „Baummieter“: Er wohnt mit im Haus." });
  unter.push({ id: "fenster", de: "das Fenster", syl: "FENS-ter", it: "la finestra", itSyl: "fi-NE-stra", en: "window", x: ZI.x + fenster[5][0] + 1.2, y: ZI.y + fenster[5][1] + 3.2, kunst: flaeche(-2, -4, 4.4, 4.6),
    tipp: "Kein Fenster ist wie das andere — jedes hat eine eigene Form und Farbe." });
  unter.push({ id: "saeule", de: "die Säule", syl: "SÄU-le", it: "la colonna", itSyl: "co-LON-na", en: "column", x: ZI.x + saeulen[2], y: ZI.y, kunst: flaeche(-1.6, -7, 3.2, 7),
    tipp: "Die bunten Säulen sind mit Keramik verziert." });
  unter.push({ id: "dachgarten", de: "der Dachgarten", syl: "DACH-gar-ten", it: "il giardino pensile", itSyl: "giar-DI-no PEN-si-le", en: "roof garden", x: ZI.x - 6, y: ZI.y - 34, kunst: flaeche(-12, -9, 24, 8),
    tipp: "Auf dem Dach wachsen Gras und Bäume." });
  S.teil({ id: "zitadelle", de: "die Grüne Zitadelle", syl: "GRÜ-ne Zi-ta-DEL-le", it: "la Cittadella Verde", itSyl: "cit-ta-DEL-la VER-de", en: "Green Citadel", x: ZI.x, y: ZI.y, steht: true, kunst: k,
    zoom: { x: ZI.x - 34, y: ZI.y - 60, w: 68, h: 62 }, unter,
    tipp: "Das letzte Haus des Künstlers Friedensreich Hundertwasser — rosa, ohne gerade Linien und mit Bäumen auf dem Dach." });
}

/* =====================================================================
   3 — DER KIRCHTURM (Johanniskirche, zwei Türme)
   ===================================================================== */
{
  let k = `<rect x="-14" y="-16" width="24" height="16" fill="#cbb994"/><path d="M-15 -16 L-8 -24 L10 -24 L11 -16 Z" fill="${SCHIEFER}"/>`;
  for (const x of [-10, -4, 2]) k += `<rect x="${x}" y="-13" width="2.2" height="8" rx="1.1" fill="#4f5a66"/>`;
  for (const x of [12, 20]) {
    k += `<rect x="${x - 3.4}" y="-40" width="6.8" height="40" fill="${SAND}"/><rect x="${x - 1}" y="-35" width="2" height="4" rx="1" fill="#4f5a66"/><rect x="${x - 1}" y="-24" width="2" height="4" rx="1" fill="#4f5a66"/>`;
    k += `<path d="M${x - 3.4} -40 L${x - 2.4} -44 L${x + 2.4} -44 L${x + 3.4} -40 Z" fill="#b8a785"/><path d="M${x - 2.4} -44 Q${x - 2.6} -48 ${x} -52 Q${x + 2.6} -48 ${x + 2.4} -44 Z" fill="${KUPFER}"/><line x1="${x}" y1="-52" x2="${x}" y2="-55" stroke="#7a6a3a" stroke-width=".4"/>`;
  }
  S.teil({ id: "kirchturm", de: "der Kirchturm", syl: "KIRCH-turm", it: "il campanile", itSyl: "cam-pa-NI-le", en: "church tower", x: 214, y: UFER - 8, steht: true, kunst: k,
    tipp: "Die Johanniskirche hat zwei Türme. Von oben sieht man weit über die Elbe." });
}

/* =====================================================================
   4 — DAS FACHWERKHAUS am Altstadtufer
   ===================================================================== */
{
  let k = schatten(0, 0.2, 10, 0.8, 0.25);
  k += `<rect x="-9" y="-16" width="18" height="16" fill="#f3ead6"/>`;
  k += `<path d="M-10 -16 L0 -25 L10 -16 Z" fill="#9b4b35"/><path d="M-10 -16 L0 -25 L10 -16" stroke="#6e3323" stroke-width=".5" fill="none"/>`;
  /* Balken: Rähm, Ständer, Streben (Mann-Figur) */
  const b = "#5a3a22";
  k += `<path d="M-9 -16 h18 M-9 -8 h18 M-9 -.4 h18 M-9 -16 v16 M9 -16 v16 M-3 -16 v16 M3 -16 v16" stroke="${b}" stroke-width=".9"/>`;
  k += `<path d="M-9 -8 L-3 -16 M9 -8 L3 -16 M-9 -.4 L-3 -8 M9 -.4 L3 -8" stroke="${b}" stroke-width=".7"/>`;
  for (const x of [-7.6, 4.4]) for (const y of [-14.6, -6.6]) k += `<rect x="${x}" y="${y}" width="3.2" height="3.6" fill="#55687a" stroke="#f3ead6" stroke-width=".3"/>`;
  k += `<rect x="-1.6" y="-6.2" width="3.2" height="6" fill="#6b4226"/><rect x="-1.2" y="-22" width="2.4" height="2.4" fill="#55687a"/>`;
  k += `<path d="M-10 -16 L10 -16" stroke="#fff" stroke-width=".4" opacity=".5"/>`;
  S.teil({ id: "fachwerkhaus", de: "das Fachwerkhaus", syl: "FACH-werk-haus", it: "la casa a graticcio", itSyl: "CA-sa a gra-TIC-cio", en: "half-timbered house", x: 240, y: UFER - 4.6, steht: true, kunst: k,
    tipp: "Beim Fachwerkhaus sieht man das Holzgerüst. Die Felder dazwischen sind mit Lehm oder Steinen gefüllt." });
}

/* =====================================================================
   5 — DER JAHRTAUSENDTURM (Elbauenpark, rechts hinten über dem Werder)
   ===================================================================== */
{
  let k = "";
  k += `<path d="M-6 0 Q-5 -18 -2.4 -36 L2.4 -36 Q5 -18 6 0 Z" fill="${S.lg("holz", [[0, "#8a5a33"], [0.45, "#c08a54"], [1, "#6e4526"]], 0, 0, 1, 0)}"/>`;
  for (let i = 1; i < 12; i++) { const y = -i * 3, w = 6 - i * 0.3; k += `<line x1="${r(-w)}" y1="${y}" x2="${r(w)}" y2="${y}" stroke="#5e3b20" stroke-width=".3" opacity=".7"/>`; }
  /* außen umlaufende Treppe als Spirale */
  k += `<path d="M-5.8 -2 L5.6 -8 M-5.4 -12 L5 -18 M-4.6 -22 L4.2 -28 M-3.6 -31 L3.2 -35" stroke="#ead9bd" stroke-width=".5" opacity=".9"/>`;
  k += `<rect x="-3" y="-38" width="6" height="2" fill="#4d3420"/><line x1="0" y1="-38" x2="0" y2="-46" stroke="#555" stroke-width=".5"/>`;
  k += `<path d="M-6 0 Q-5 -18 -2.4 -36 L-1.2 -36 Q-3 -18 -3.6 0 Z" fill="#fff" opacity=".14"/>`;
  k += `<path d="M-6 0 Q-5 -18 -2.4 -36 L2.4 -36 Q5 -18 6 0 Z" fill="#f1ead9" opacity=".25"/>`;
  S.teil({ id: "jahrtausendturm", de: "der Jahrtausendturm", syl: "JAHR-tau-send-turm", it: "la torre del millennio", itSyl: "TOR-re del mil-LEN-nio", en: "Millennium Tower", x: 304, y: 108, steht: true, kunst: k,
    tipp: "Der Turm aus Holz ist 60 Meter hoch. Drinnen zeigt ein Museum, wie Menschen die Welt erforscht haben." });
}

/* =====================================================================
   6 — DIE ELBE (Fluss mit Strömung und Spiegelungen)
   ===================================================================== */
{
  let k = `<rect x="-160" y="${UFER - NAH}" width="320" height="${NAH - UFER + 2}" fill="${S.lg("elbe", [[0, "#9db9c4"], [0.4, "#6f93a3"], [1, "#4f7484"]])}"/>`;
  /* Spiegelungen von Dom und Zitadelle */
  const spiegel = (x, w, h, farbe, n) => `<path d="M${x - w / 2} ${UFER - NAH} L${x + w / 2} ${UFER - NAH} L${x + w / 2 - 3} ${UFER - NAH + h} L${x - w / 2 + 3} ${UFER - NAH + h} Z" fill="${S.lg(n, [[0, farbe, 0.4], [1, farbe, 0]])}"/>`;
  k += spiegel(80 - 160, 50, 20, "#e4d6b0", "sp1") + spiegel(0, 58, 14, "#f1b9c0", "sp2") + spiegel(214 - 160, 24, 10, "#e4d6b0", "sp3");
  for (let i = 0; i < 40; i++) {
    const y = UFER - NAH + 2 + rnd() * (NAH - UFER - 4), t = (y - (UFER - NAH)) / (NAH - UFER), w = 4 + t * 16;
    const x = -160 + rnd() * 320;
    k += `<path d="M${r(x)} ${r(y)} q${r(w / 2)} ${r(-0.5 - t)} ${r(w)} 0" stroke="#e6f1f5" stroke-width="${r(0.25 + t * 0.4)}" fill="none" opacity="${r(0.35 + rnd() * 0.4)}"/>`;
  }
  k += `<rect x="-160" y="-2" width="320" height="2" fill="#3d5e6d" opacity=".4"/>`;
  S.teil({ id: "elbe", de: "die Elbe", syl: "EL-be", it: "l'Elba", itSyl: "EL-ba", en: "the Elbe", x: 160, y: NAH, kunst: k,
    tipp: "Die Elbe fließt von Tschechien bis zur Nordsee bei Hamburg — durch Dresden, Magdeburg und Hamburg." });
}

/* =====================================================================
   7 — DIE HUBBRÜCKE (Stahlfachwerk, Mittelteil angehoben)
   ===================================================================== */
{
  /* Die Brücke läuft vom Altstadtufer (links hinten) zum Werder (rechts vorne). */
  const A = [0, 0], E = [82, 14];       /* Fahrbahn: Anfang (fern) und Ende (nah), relativ */
  const P = (t) => [A[0] + (E[0] - A[0]) * t, A[1] + (E[1] - A[1]) * t];
  const hoeheBei = (t) => 3.4 + t * 2.4;    /* Trägerhöhe wächst nach vorne */
  let k = "";
  /* Pfeiler im Wasser */
  for (const t of [0.12, 0.38, 0.62, 0.88]) { const [x, y] = P(t); k += `<rect x="${r(x - 1.2 - t)}" y="${r(y)}" width="${r(2.4 + t * 2)}" height="${r(5 + t * 3)}" fill="#8e8576"/><rect x="${r(x - 1.2 - t)}" y="${r(y + 3 + t * 3)}" width="${r(2.4 + t * 2)}" height="2" fill="#5d7480" opacity=".5"/>`; }
  /* feste Felder: Fachwerkträger */
  const feld = (t0, t1) => {
    let g = "";
    const [x0, y0] = P(t0), [x1, y1] = P(t1), h0 = hoeheBei(t0), h1 = hoeheBei(t1);
    g += `<path d="M${r(x0)} ${r(y0)} L${r(x1)} ${r(y1)} L${r(x1)} ${r(y1 - h1)} L${r(x0)} ${r(y0 - h0)} Z" fill="none" stroke="${STAHL}" stroke-width=".9"/>`;
    const n = 6;
    for (let i = 0; i < n; i++) {
      const a = t0 + (t1 - t0) * i / n, b = t0 + (t1 - t0) * (i + 1) / n;
      const [xa, ya] = P(a), [xb, yb] = P(b);
      g += `<path d="M${r(xa)} ${r(ya)} L${r(xb)} ${r(yb - hoeheBei(b))} M${r(xb)} ${r(yb)} L${r(xb)} ${r(yb - hoeheBei(b))}" stroke="#4c5d69" stroke-width=".45"/>`;
    }
    g += `<path d="M${r(x0)} ${r(y0 + 0.6)} L${r(x1)} ${r(y1 + 0.6)}" stroke="#2f3a42" stroke-width="1"/>`;
    return g;
  };
  k += feld(0, 0.42) + feld(0.66, 1);
  /* Hubteil: zwei Gittertürme, Brückenteil oben */
  for (const t of [0.44, 0.64]) {
    const [x, y] = P(t), h = 27 + t * 5;
    k += `<rect x="${r(x - 1.6)}" y="${r(y - h)}" width="3.2" height="${r(h)}" fill="none" stroke="#3f505d" stroke-width=".7"/>`;
    for (let yy = 0; yy < h - 2; yy += 3) k += `<path d="M${r(x - 1.6)} ${r(y - yy)} L${r(x + 1.6)} ${r(y - yy - 3)}" stroke="#4c5d69" stroke-width=".35"/>`;
    k += `<rect x="${r(x - 2.2)}" y="${r(y - h - 1.4)}" width="4.4" height="1.6" fill="#3f505d"/>`;
  }
  { /* angehobener Mittelteil */
    const [x0, y0] = P(0.44), [x1, y1] = P(0.64), lift = 20;
    k += `<path d="M${r(x0 + 1.6)} ${r(y0 - lift)} L${r(x1 - 1.6)} ${r(y1 - lift)} L${r(x1 - 1.6)} ${r(y1 - lift - 6)} L${r(x0 + 1.6)} ${r(y0 - lift - 5)} Z" fill="none" stroke="${STAHL}" stroke-width=".9"/>`;
    for (let i = 1; i < 5; i++) { const a = x0 + (x1 - x0) * i / 5, b = y0 + (y1 - y0) * i / 5; k += `<path d="M${r(a)} ${r(b - lift)} L${r(a - 2.6)} ${r(b - lift - 5.2)}" stroke="#4c5d69" stroke-width=".45"/>`; }
    k += `<path d="M${r(x0 + 1.6)} ${r(y0 - lift + 0.6)} L${r(x1 - 1.6)} ${r(y1 - lift + 0.6)}" stroke="#2f3a42" stroke-width="1"/>`;
    /* steile Treppen auf beiden Seiten */
    k += `<path d="M${r(x0 - 3)} ${r(y0 - 0.5)} L${r(x0 + 1.4)} ${r(y0 - lift)} M${r(x1 + 3)} ${r(y1 - 0.5)} L${r(x1 - 1.4)} ${r(y1 - lift)}" stroke="#2f3a42" stroke-width=".6" stroke-dasharray=".6 .5"/>`;
  }
  k += flaeche(-2, -34, 84, 52);
  S.teil({ id: "hubbruecke", de: "die Hubbrücke", syl: "HUB-brü-cke", it: "il ponte sollevabile", itSyl: "PON-te sol-le-VA-bi-le", en: "lift bridge", x: 236, y: UFER - 1, kunst: k,
    tipp: "Früher wurde das Mittelstück angehoben, damit hohe Schiffe durchfahren konnten. Heute bleibt es oben — man steigt über steile Treppen." });
}

/* =====================================================================
   8 — DAS SCHIFF (Fahrgastschiff der Weißen Flotte)
   ===================================================================== */
{
  let k = schatten(0, 0.4, 34, 1.6, 0.25);
  /* Rumpf */
  k += `<path d="M-34 -6 L30 -6 Q36 -6 38 -9.6 L36 -1 Q33 0 26 0 L-30 0 Q-34 -1 -34 -6 Z" fill="${S.lg("rumpf", [[0, "#ffffff"], [1, "#d8dee3"]])}"/>`;
  k += `<path d="M-34 -3.6 L36.6 -3.6" stroke="#1f4f8f" stroke-width="1.4"/>`;
  /* Hauptdeck mit Fensterband */
  k += `<path d="M-30 -6 L-30 -13 L26 -13 L30 -6 Z" fill="#f6f8f9"/>`;
  for (let i = 0; i < 12; i++) k += `<rect x="${-28 + i * 4.6}" y="-11.8" width="3.6" height="3.6" rx=".5" fill="#36506a"/>`;
  /* Sonnendeck mit Steuerhaus, Geländer, Sonnenschirmen */
  k += `<rect x="-28" y="-13.6" width="54" height="1" fill="#1f4f8f"/>`;
  k += `<path d="M10 -13.6 L10 -19.6 L22 -19.6 L24 -13.6 Z" fill="#f6f8f9"/><rect x="11.4" y="-18.6" width="10" height="2.6" fill="#36506a"/>`;
  k += `<path d="M-28 -16 L8 -16" stroke="#9aa6b0" stroke-width=".4"/>`;
  for (let x = -27; x < 8; x += 3) k += `<line x1="${x}" y1="-16" x2="${x}" y2="-13.6" stroke="#9aa6b0" stroke-width=".3"/>`;
  for (const x of [-20, -8]) k += `<line x1="${x}" y1="-13.6" x2="${x}" y2="-19" stroke="#666" stroke-width=".4"/><path d="M${x - 5} -18.4 Q${x} -21.4 ${x + 5} -18.4 Z" fill="${x < -10 ? "#d8463a" : "#f2c230"}"/>`;
  k += `<line x1="-31" y1="-6" x2="-31" y2="-15" stroke="#555" stroke-width=".4"/><path d="M-31 -15 L-26.6 -13.8 L-31 -12.6 Z" fill="#c33"/>`;
  k += `<text x="-12" y="-7.2" font-size="2" text-anchor="middle" fill="#1f4f8f" font-family="Arial,sans-serif" font-weight="bold">WEISSE FLOTTE · MAGDEBURG</text>`;
  /* Bugwelle */
  k += `<path d="M30 -.6 q6 .4 12 2 M-34 -.4 q-4 1.2 -10 1.4" stroke="#fff" stroke-width=".6" opacity=".8" fill="none"/>`;
  S.teil({ id: "schiff", de: "das Schiff", syl: "SCHIFF", it: "la nave", itSyl: "NA-ve", en: "ship", x: 166, y: 150, steht: true, kunst: k,
    tipp: "Die Schiffe der „Weißen Flotte“ fahren mit Gästen auf der Elbe — los geht es am Petriförder." });
}

/* =====================================================================
   9 — DIE ENTE (im Wasser vorne)
   ===================================================================== */
{
  const ente = (sx) => {
    let g = `<ellipse cx="0" cy="-1.4" rx="3.4" ry="1.6" fill="#7a6650"/><path d="M-3.4 -1.6 q-1.4 -.8 -1.8 -.2 q.8 .6 1.8 .8" fill="#6a5743"/>`;
    g += `<path d="M2 -2 q.2 -2.2 1.6 -2.6 q1.6 -.2 1.8 1.2 q-.2 .9 -1.4 1.4 Z" fill="#2f6a46"/><rect x="2.2" y="-2.3" width="1.6" height=".45" fill="#fff"/>`;
    g += `<path d="M5.2 -3.2 l1.6 .3 l-1.5 .5 Z" fill="#e3b23c"/><circle cx="4.2" cy="-3.3" r=".3" fill="#111"/>`;
    g += `<path d="M-4 .2 q4 .8 8 0" stroke="#e6f1f5" stroke-width=".4" fill="none" opacity=".7"/>`;
    return `<g transform="scale(${sx} 1)">${g}</g>`;
  };
  S.teil({ oben: true, id: "ente", de: "die Ente", syl: "EN-te", it: "l'anatra", itSyl: "A-na-tra", en: "duck", x: 124, y: 164, kunst: ente(1) + `<g transform="translate(9 -1.4) scale(.8)">${ente(-1)}</g>` + flaeche(-5, -5.6, 16, 6.4) });
}

/* =====================================================================
   VORNE: die Elbwiese am Werder mit dem Elberadweg
   ===================================================================== */
/* 10 — DIE WIESE */
{
  let k = `<path d="M-160 -${200 - NAH + 1} Q-80 -${200 - NAH + 5} 0 -${200 - NAH + 3} Q80 -${200 - NAH + 1} 160 -${200 - NAH + 4} L160 0 L-160 0 Z" fill="${S.lg("wiese", [[0, "#8fb064"], [1, "#6c9148"]])}"/>`;
  /* Uferkante mit Steinen */
  for (let i = 0; i < 26; i++) k += `<ellipse cx="${r(-160 + i * 12.6 + rnd() * 4)}" cy="${r(-(200 - NAH) + 1 + rnd())}" rx="${r(2 + rnd() * 2)}" ry="${r(1 + rnd() * 0.6)}" fill="${rnd() < 0.5 ? "#9b9282" : "#b2a998"}"/>`;
  /* Gräser */
  let gr = "";
  for (let i = 0; i < 90; i++) { const x = -160 + rnd() * 320, y = -(200 - NAH) + 4 + rnd() * 26; gr += `M${r(x)} ${r(y)} l${r(-0.4 + rnd() * 0.8)} -${r(1.2 + rnd() * 1.6)}`; }
  k += `<path d="${gr}" stroke="#5c8240" stroke-width=".35"/>`;
  S.teil({ id: "wiese", de: "die Wiese", syl: "WIE-se", it: "il prato", itSyl: "PRA-to", en: "meadow", x: 160, y: 200, kunst: k,
    tipp: "Auf den Elbwiesen liegen die Magdeburger im Sommer in der Sonne." });
}
/* Elberadweg (Kulisse über der Wiese wäre falsch — er gehört zur Wiese, als eigenes Teil) */
{
  /* 11 — DER RADWEG */
  let k = `<path d="M-160 -5 Q-60 -12 40 -10 Q110 -9 160 -16 L160 -9 Q110 -2 40 -3 Q-60 -5 -160 2 Z" fill="${S.lg("weg", [[0, "#d9cfb9"], [1, "#c2b79e"]])}"/>`;
  k += `<path d="M-160 -1.6 Q-60 -8.4 40 -6.6 Q110 -5.6 160 -12.6" stroke="#fff" stroke-width=".4" stroke-dasharray="3 3" fill="none" opacity=".8"/>`;
  k += `<g transform="translate(-60 -6.2)"><circle r="2" fill="none" stroke="#fff" stroke-width=".35"/><circle cx="4.6" r="2" fill="none" stroke="#fff" stroke-width=".35"/><path d="M0 0 L2 -2.6 L4.6 0 M1.2 -2.6 L3.4 -2.6" stroke="#fff" stroke-width=".35" fill="none"/></g>`;
  S.teil({ id: "radweg", de: "der Radweg", syl: "RAD-weg", it: "la pista ciclabile", itSyl: "PI-sta ci-CLA-bi-le", en: "cycle path", x: 160, y: 190, kunst: k,
    tipp: "Der Elberadweg ist einer der beliebtesten Radwege in Deutschland." });
}

/* 12 — DER RETTUNGSRING (am Pfosten an der Uferkante) */
{
  let k = schatten(0, 0.2, 2.6, 0.6, 0.3);
  k += `<rect x="-.8" y="-20" width="1.6" height="20" fill="#7a5a3a"/><rect x="-2.6" y="-20" width="5.2" height="1.4" fill="#5d4129"/>`;
  k += `<circle cx="0" cy="-12" r="4.4" fill="none" stroke="#e8e6e0" stroke-width="2.2"/>`;
  for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + 0.4; k += `<path d="M${r(Math.cos(a) * 4.4)} ${r(-12 + Math.sin(a) * 4.4)} A4.4 4.4 0 0 1 ${r(Math.cos(a + 0.6) * 4.4)} ${r(-12 + Math.sin(a + 0.6) * 4.4)}" stroke="#d8382c" stroke-width="2.2" fill="none"/>`; }
  k += `<path d="M-3 -15 A4.4 4.4 0 0 1 1 -16.3" stroke="#fff" stroke-width=".5" fill="none" opacity=".6"/>`;
  S.teil({ id: "rettungsring", de: "der Rettungsring", syl: "RET-tungs-ring", it: "il salvagente", itSyl: "sal-va-GEN-te", en: "lifebuoy", x: 46, y: 176, steht: true, kunst: k,
    tipp: "Fällt jemand ins Wasser, wirft man ihm den Rettungsring zu." });
}

/* 13 — DIE MÖWE (auf einem Poller) und 14 — DER POLLER */
{
  let k = schatten(0, 0.2, 3, 0.7, 0.3);
  k += `<path d="M-2.4 0 L-2.4 -5.6 Q0 -6.8 2.4 -5.6 L2.4 0 Z" fill="${S.lg("poller", [[0, "#3c4247"], [0.5, "#6a737a"], [1, "#2c3135"]], 0, 0, 1, 0)}"/><ellipse cx="0" cy="-5.8" rx="3.2" ry="1" fill="#545b61"/>`;
  S.teil({ id: "poller", de: "der Poller", syl: "POL-ler", it: "la bitta", itSyl: "BIT-ta", en: "bollard", x: 76, y: 177, steht: true, kunst: k,
    tipp: "Am Poller machen die Schiffe ihre Taue fest." });
  let m = `<path d="M-3.4 -2.6 Q0 -4.6 3 -3 L4 -4.2 Q4.6 -2.6 3 -1.6 Q0 -.6 -3.4 -2.6 Z" fill="#f4f4f2"/><path d="M-3.6 -2.8 Q-1 -5.2 2 -4" fill="#9aa5ad"/>`;
  m += `<circle cx="-3" cy="-4.6" r="1.4" fill="#f8f8f6"/><path d="M-4.3 -4.8 l-1.3 .4 l1.3 .3 Z" fill="#e3b23c"/><circle cx="-3.3" cy="-5" r=".25" fill="#111"/>`;
  m += `<path d="M2.4 -3.4 L4.6 -4.6 L4.4 -3.2 Z" fill="#2b2b2b"/><path d="M-.8 -1.2 v1.2 M.6 -1.2 v1.2" stroke="#e3a33c" stroke-width=".35"/>`;
  S.teil({ oben: true, id: "moewe", de: "die Möwe", syl: "MÖ-we", it: "il gabbiano", itSyl: "gab-BIA-no", en: "seagull", x: 61, y: 176.5, steht: true, kunst: m + flaeche(-5, -6.4, 10, 6.6) });
}

/* 15 — DIE LATERNE (am Radweg) */
{
  let k = schatten(0, 0.2, 3, 0.7, 0.3);
  k += `<rect x="-1.6" y="-2" width="3.2" height="2" fill="#2f3438"/><rect x="-.6" y="-36" width="1.2" height="34" fill="${S.lg("mast", [[0, "#3a4045"], [0.5, "#6b747b"], [1, "#2c3135"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-3.6 -36 L3.6 -36 L2.4 -41 L-2.4 -41 Z" fill="#f6efd8" stroke="#2f3438" stroke-width=".5"/><path d="M-4.2 -41 L4.2 -41 L0 -44.4 Z" fill="#2f3438"/><path d="M-1.6 -36 v-4.6 M1.6 -36 v-4.6" stroke="#2f3438" stroke-width=".3"/>`;
  S.teil({ id: "laterne", de: "die Laterne", syl: "la-TER-ne", it: "il lampione", itSyl: "lam-PIO-ne", en: "street lamp", x: 292, y: 186, steht: true, kunst: k });
}

/* 16 — DIE BANK mit 17 — DER SPAZIERGÄNGERIN und 18 — DAS FAHRRAD */
const BANK = { x: 112, y: 192 };
{
  const m = B.mensch({ id: "mdb_frau", geschlecht: "w", alter: "alt", pose: "sitzen", blick: 200, frisur: "kurz", haarfarbe: "grau", haut: "hell",
    kleidung: { oberteil: { stueck: "pullover", farbe: "rosa" }, jacke: { stueck: "jacke", farbe: "blau" }, unterteil: { stueck: "hose", farbe: "beige" }, schuhe: { stueck: "halbschuh" } } }, 37);
  S.teil({ id: "spaziergaengerin", de: "die Spaziergängerin", syl: "spa-ZIER-gän-ge-rin", it: "la passeggiatrice", itSyl: "pas-seg-gia-TRI-ce", en: "walker", x: BANK.x + 9, y: BANK.y - 0.4, kunst: m.svg,
    tipp: "Sie macht eine Pause und schaut auf den Dom." });
}
{
  let k = schatten(0, 0.4, 22, 1.4, 0.3);
  const holz = S.lg("bankholz", [[0, "#b07b46"], [1, "#8a5a2e"]]);
  for (const x of [-17, 17]) k += `<path d="M${x - 1.4} 0 L${x - 1.4} -10 L${x + 1.4} -10 L${x + 1.4} 0 Z" fill="#2f3438"/><path d="M${x - 1.4} -11 L${x + 1.4} -11 L${x + 1.4} -22 L${x - 1.4} -22 Z" fill="#2f3438"/>`;
  for (let i = 0; i < 3; i++) k += `<rect x="-20" y="${-10.6 + i * 1.6}" width="40" height="1.3" rx=".4" fill="${holz}"/>`;
  for (let i = 0; i < 3; i++) k += `<rect x="-20" y="${-21.4 + i * 2.8}" width="40" height="2" rx=".5" fill="${holz}"/>`;
  k += `<rect x="-20" y="-21.4" width="40" height=".6" fill="#fff" opacity=".2"/>`;
  S.teil({ id: "bank", de: "die Bank", syl: "BANK", it: "la panchina", itSyl: "pan-CHI-na", en: "bench", x: BANK.x, y: BANK.y, steht: true, kunst: k });
}
{
  /* Fahrrad auf dem Ständer neben der Bank */
  let k = schatten(0, 0.3, 14, 1.2, 0.3);
  const rad = (cx) => `<circle cx="${cx}" cy="-6.6" r="6.4" fill="none" stroke="#1f2326" stroke-width="1.1"/><circle cx="${cx}" cy="-6.6" r="5.6" fill="none" stroke="#b9c1c8" stroke-width=".2"/>` +
    [0, 1, 2, 3, 4, 5].map((i) => `<line x1="${cx}" y1="-6.6" x2="${r(cx + Math.cos(i * Math.PI / 3) * 5.6)}" y2="${r(-6.6 + Math.sin(i * Math.PI / 3) * 5.6)}" stroke="#b9c1c8" stroke-width=".18"/>`).join("") + `<circle cx="${cx}" cy="-6.6" r=".6" fill="#777"/>`;
  k += rad(-9.6) + rad(9.6);
  const rot = "#2e7a5a";
  k += `<path d="M-9.6 -6.6 L-3 -15 L7 -15 L9.6 -6.6 M-3 -15 L0 -6.6 L7 -15 M0 -6.6 L-9.6 -6.6" stroke="${rot}" stroke-width="1.1" fill="none" stroke-linejoin="round"/>`;
  k += `<path d="M-3 -15 L-3.8 -17 M-5.6 -17.4 L-1.6 -17.4" stroke="#222" stroke-width=".9" stroke-linecap="round"/>`;
  k += `<path d="M7 -15 L6.4 -18 M5 -18.4 q1.6 -.6 3.2 .2" stroke="#222" stroke-width=".8" fill="none" stroke-linecap="round"/>`;
  k += `<rect x="-12" y="-14.6" width="7" height="1" fill="#222"/><path d="M-12 -14 L-12 -9.6 L-6 -9.6" stroke="#444" stroke-width=".4" fill="none"/>`;
  k += `<circle cx="0" cy="-6.6" r="1.2" fill="#444"/><path d="M0 -6.6 L1.6 -4" stroke="#444" stroke-width=".5"/><line x1="0" y1="-6.6" x2="-1.4" y2="0" stroke="#333" stroke-width=".5"/>`;
  k += `<path d="M8.4 -16 q1.6 .2 2 1.6" stroke="#ddd" stroke-width=".6" fill="none"/>`;
  S.teil({ id: "fahrrad", de: "das Fahrrad", syl: "FAHR-rad", it: "la bicicletta", itSyl: "bi-ci-CLET-ta", en: "bicycle", x: 160, y: 190, steht: true, kunst: k });
}

/* 19 — DIE WEIDE (Silberweide am Ufer, rechts vorne) */
{
  let k = schatten(0, 0.6, 14, 1.6, 0.3);
  k += `<path d="M-2.6 0 Q-1.4 -12 -3 -24 L1 -24 Q1 -12 2.8 0 Z" fill="${S.lg("stamm", [[0, "#5a4632"], [0.6, "#7a6248"], [1, "#4a3826"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-2 -20 Q-8 -26 -12 -26 M1 -22 Q6 -28 12 -27" stroke="#5a4632" stroke-width="1" fill="none"/>`;
  /* hängende Zweige */
  for (let i = 0; i < 38; i++) {
    const x = -18 + rnd() * 36, y0 = -40 + rnd() * 10, l = 12 + rnd() * 14;
    k += `<path d="M${r(x)} ${r(y0)} q${r(-0.6 + rnd() * 1.2)} ${r(l * 0.5)} ${r(-0.4 + rnd() * 0.8)} ${r(l)}" stroke="${["#8fae6a", "#a8c27f", "#7a9a5a", "#b5cd8f"][Math.floor(rnd() * 4)]}" stroke-width="${r(0.8 + rnd() * 0.8)}" fill="none" stroke-linecap="round"/>`;
  }
  k += `<ellipse cx="0" cy="-36" rx="18" ry="8" fill="#9bb876" opacity=".9"/><ellipse cx="-4" cy="-38" rx="9" ry="4" fill="#b7cf92" opacity=".8"/>`;
  S.teil({ id: "weide", de: "die Weide", syl: "WEI-de", it: "il salice", itSyl: "SA-li-ce", en: "willow", x: 14, y: 182, steht: true, kunst: k,
    tipp: "Weiden wachsen gern am Wasser. Ihre Zweige hängen bis zum Boden." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/magdeburg.js"));
console.log(aus);
