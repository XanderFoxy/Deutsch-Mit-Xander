#!/usr/bin/env node
/* =====================================================================
   GRIECHENLAND (FASSUNG 852) — Bilderwelt neu: Lindos auf Rhodos
   ---------------------------------------------------------------------
   RECHERCHE (Lonely Planet „Acropolis of Lindos“, rhodesguide.com,
   rodiaki.gr „Lindos: A magnificent Acropolis on an imposing rock“,
   Gemeinde Lindos/Windmühlen von Rhodos):
   - STANDORT: Dachterrasse einer Taverne im Dorf Lindos (Ostküste von
     Rhodos). Von hier sieht man, was jeder Reisende in Lindos sieht:
     links die Bucht mit dem Meer und den Fischerbooten, gegenüber auf der
     Landzunge eine alte Windmühle aus Stein, rechts den 116 m hohen
     Felsen mit der AKROPOLIS: oben die Mauern der Johanniter-Burg mit
     Zinnen, darüber die dorischen Säulen der hellenistischen Säulenhalle
     (Stoa, 20 Säulen, acht wieder aufgerichtet) und ganz am Rand der
     kleine Tempel der Athena Lindia.
   - DORF: weiß gekalkte Würfelhäuser mit flachen Dächern, blaue Türen
     und Fensterläden, die Kirche der Panagia (15. Jh.) mit dem hohen
     Glockenturm aus hellem Stein. Böden aus Kieselmosaik (Chochlaki:
     schwarze und weiße Kiesel in Mustern).
   - ESEL: Die „Lindos-Taxis“ — Esel mit bunt bestickten Satteldecken
     und Quasten tragen Besucher den Weg zur Akropolis hinauf.
   - TAVERNE: Holzstühle mit Binsensitz, Tischtuch blau-weiß kariert;
     Gyros mit Pita, Tomate, Zwiebel und Tsatsiki; Bauernsalat
     (Choriatiki) mit Tomaten, Gurke, Zwiebeln, Paprika, Oliven und einer
     Scheibe Feta mit Oregano; ein Schälchen Kalamata-Oliven, Olivenöl in
     der Flasche. Als Schmuck eine große Amphore aus Terrakotta.
     Bougainvillea blüht an der weißen Hauswand, eine Katze sonnt sich.
   - Die griechische Flagge: neun blau-weiße Streifen, oben links das
     weiße Kreuz auf blauem Grund.
   Maßstab: Augenhöhe y = 104 (Meereshorizont), Auge 1,6 m über der
   Terrasse. Bodenpunkt in d Metern: y = 104 + 1,6·253/d, Einheiten je
   Meter = 253/d. Tisch d = 5 (50 je Meter), Mauer d = 7, Esel d = 9.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "griechenland", titel: "Griechenland", emoji: "🇬🇷", thema: "Länder", kuerzel: "b25b", fassung: 852 });
const rnd = zufall(1580);
const r = B.r;
const HOR = 104, F = 253, AUGE = 1.6;
const yAt = (d, h = 0) => HOR + (AUGE - h) * F / d;
const uAt = (d) => F / d;

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("wolke")}" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="2.2"/></filter>`);
S.def(`<pattern id="${S.id("kiesel")}" width="4" height="2.4" patternUnits="userSpaceOnUse"><rect width="4" height="2.4" fill="#2e2b28"/><ellipse cx="1" cy=".6" rx=".8" ry=".45" fill="#3f3b37"/><ellipse cx="3" cy=".7" rx=".75" ry=".42" fill="#25221f"/><ellipse cx="2" cy="1.8" rx=".8" ry=".45" fill="#46413b"/><ellipse cx="0" cy="1.8" rx=".7" ry=".4" fill="#36322e"/><ellipse cx="4" cy="1.8" rx=".7" ry=".4" fill="#36322e"/></pattern>`);
S.def(`<pattern id="${S.id("kieselw")}" width="4" height="2.4" patternUnits="userSpaceOnUse"><rect width="4" height="2.4" fill="#d9d3c6"/><ellipse cx="1" cy=".6" rx=".8" ry=".45" fill="#efebe2"/><ellipse cx="3" cy=".7" rx=".75" ry=".42" fill="#e6e0d4"/><ellipse cx="2" cy="1.8" rx=".8" ry=".45" fill="#f6f2ea"/><ellipse cx="0" cy="1.8" rx=".7" ry=".4" fill="#e1dbcf"/><ellipse cx="4" cy="1.8" rx=".7" ry=".4" fill="#e1dbcf"/></pattern>`);
const KALK = S.lg("kalk", [[0, "#ffffff"], [0.6, "#f4f2ec"], [1, "#e2ddd2"]]);
const KALK_V = S.lg("kalkv", [[0, "#e8e4da"], [0.25, "#ffffff"], [0.8, "#f4f1ea"], [1, "#d8d2c5"]], 0, 0, 1, 0);
const KALK_S = S.lg("kalks", [[0, "#cfd6e0"], [1, "#b7c0cd"]]);
const BLAU = S.lg("blau", [[0, "#2f74b5"], [1, "#1b4f86"]]);
const FELS = S.lg("fels", [[0, "#c9b48f"], [0.45, "#ad9672"], [1, "#8a7457"]]);
const FELS_V = S.lg("felsv", [[0, "#7e6a50"], [0.4, "#b39d78"], [1, "#9b8464"]], 0, 0, 1, 0);
const BURG = S.lg("burg", [[0, "#dcc8a0"], [1, "#bba47c"]]);
const SAULE = S.lg("saule", [[0, "#b9a785"], [0.4, "#efe4cb"], [0.75, "#dccdae"], [1, "#a6926e"]], 0, 0, 1, 0);
const TERRA = S.lg("terra", [[0, "#c2683a"], [0.4, "#e08a55"], [0.75, "#c9703f"], [1, "#9a4c25"]], 0, 0, 1, 0);
const HOLZ = S.lg("holz", [[0, "#8a5a32"], [1, "#5e3b1e"]]);

/* =====================================================================
   KULISSE — Himmel, ferne Landzunge, Terrassenboden
   ===================================================================== */
S.hinten(`<rect width="320" height="${HOR + 2}" fill="${S.lg("himmel", [[0, "#2f7fd0"], [0.6, "#7fb6e6"], [1, "#d6ecf7"]])}"/>`);
S.hinten(`<circle cx="40" cy="14" r="60" fill="${S.rg("sonne", [[0, "#fffbe6", 0.6], [1, "#fffbe6", 0]])}"/>`);
{
  let w = "";
  for (const [x, y, s] of [[120, 16, 0.8], [96, 38, 0.55], [28, 60, 0.6]]) {
    w += `<g filter="url(#${S.id("wolke")})" opacity=".85">`;
    for (const [dx, dy, rx, ry] of [[0, 0, 16, 4], [-10, 1.5, 10, 3.4], [11, 1, 12, 3.8], [-3, -3, 9, 4]]) w += `<ellipse cx="${r(x + dx * s)}" cy="${r(y + dy * s)}" rx="${r(rx * s)}" ry="${r(ry * s)}" fill="#fff"/>`;
    w += `</g>`;
  }
  S.hinten(w);
}
/* Terrassenboden und Gasse: Kieselmosaik (Chochlaki), Felder mit weißen
   Kieselbändern und Rauten; rechts geht die Gasse zwischen den Häusern weiter */
{
  const Y0 = yAt(7);
  let f = `<path d="M232 136 L320 136 L320 ${r(Y0)} L232 ${r(Y0)} Z" fill="url(#${S.id("kiesel")})"/>`;
  f += `<path d="M232 136 L320 136 L320 ${r(Y0)} L232 ${r(Y0)} Z" fill="${S.lg("gassenlicht", [[0, "#e9dcc0", 0.35], [1, "#e9dcc0", 0]])}"/>`;
  f += `<rect x="0" y="150" width="320" height="50" fill="url(#${S.id("kiesel")})"/>`;
  /* Kieselband vor der Mauer und Feldgrenzen (in Fluchtperspektive) */
  f += `<rect x="0" y="${r(Y0 + 1)}" width="320" height="2.2" fill="url(#${S.id("kieselw")})" opacity=".85"/>`;
  for (const i of [-6, -3, 0, 3, 6]) f += `<path d="M${r(160 + i * 26)} ${r(Y0 + 3)} L${r(160 + i * 58)} 200" stroke="#cfc8b8" stroke-width="${r(0.9 + Math.abs(i) * 0.05)}" opacity=".45"/>`;
  /* Rauten-Muster in den Feldern, flachgedrückt */
  for (const [cx, d] of [[60, 5.6], [262, 5.6], [40, 4.4], [290, 4.4]]) {
    const cy = yAt(d), w = 0.5 * uAt(d), h = 0.08 * uAt(d);
    f += `<path d="M${r(cx - w)} ${r(cy)} L${cx} ${r(cy - h)} L${r(cx + w)} ${r(cy)} L${cx} ${r(cy + h)} Z" fill="none" stroke="#ddd6c8" stroke-width="${r(0.06 * uAt(d) * 0.3)}" opacity=".8"/>`;
  }
  /* Rosette (Sonnenmuster) vor dem Tisch */
  const rx = 26, ry = 4.6, cx = 196, cy = yAt(4.6);
  f += `<ellipse cx="${cx}" cy="${r(cy)}" rx="${rx}" ry="${ry}" fill="url(#${S.id("kieselw")})"/><ellipse cx="${cx}" cy="${r(cy)}" rx="${rx - 4}" ry="${r(ry - 0.8)}" fill="url(#${S.id("kiesel")})"/>`;
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; f += `<path d="M${cx} ${r(cy)} L${r(cx + Math.cos(a) * (rx - 5))} ${r(cy + Math.sin(a) * (ry - 1))}" stroke="#ece6da" stroke-width=".8"/>`; }
  f += `<ellipse cx="${cx}" cy="${r(cy)}" rx="5" ry="1" fill="url(#${S.id("kieselw")})"/>`;
  f += `<rect x="0" y="${r(Y0)}" width="320" height="${r(200 - Y0)}" fill="${S.lg("bodenlicht", [[0, "#000", 0.2], [0.35, "#000", 0.02], [1, "#fff", 0.08]])}"/>`;
  S.hinten(f);
}

/* =====================================================================
   1 — DIE WINDMÜHLE auf der Landzunge gegenüber
   ===================================================================== */
{
  let k = "";
  /* Landzunge: trockene Hügel mit Macchia */
  k += `<path d="M-30 9 Q-18 -2 -6 0 Q4 -6 14 -3 Q28 2 40 9 Z" fill="${S.lg("landzunge", [[0, "#b9a27a"], [1, "#94805d"]])}"/>`;
  for (let i = 0; i < 26; i++) k += `<circle cx="${r(-26 + rnd() * 62)}" cy="${r(3 + rnd() * 5)}" r="${r(0.5 + rnd() * 0.7)}" fill="${rnd() < 0.5 ? "#6f7f4a" : "#56653a"}" opacity=".8"/>`;
  /* Turm aus Stein, weiß gekalkt, mit kegelförmigem Holzdach */
  k += `<path d="M-3 0 L-2.4 -11 L2.4 -11 L3 0 Z" fill="${KALK_V}"/>`;
  k += `<rect x="-.6" y="-4" width="1.2" height="2.2" rx=".5" fill="${BLAU}"/><rect x="-.4" y="-8.4" width=".8" height="1" fill="#3d4652"/>`;
  k += `<path d="M-2.8 -11 L0 -14.6 L2.8 -11 Z" fill="${S.lg("muehldach", [[0, "#8b6a45"], [1, "#5d4329"]], 0, 0, 1, 0)}"/>`;
  /* acht Flügelruten mit dreieckigen Segeln, durch Seile verspannt */
  const ax = 0.6, ay = -12;
  for (let i = 0; i < 8; i++) {
    const a = i * Math.PI / 4 + 0.2, x2 = ax + Math.cos(a) * 8, y2 = ay + Math.sin(a) * 8;
    k += `<line x1="${ax}" y1="${ay}" x2="${r(x2)}" y2="${r(y2)}" stroke="#5d4329" stroke-width=".3"/>`;
    if (i % 2 === 0) { const b = a + 0.38; k += `<path d="M${r(ax + Math.cos(a) * 1.5)} ${r(ay + Math.sin(a) * 1.5)} L${r(x2)} ${r(y2)} L${r(ax + Math.cos(b) * 6)} ${r(ay + Math.sin(b) * 6)} Z" fill="#f6f2e8" opacity=".95"/>`; }
  }
  k += `<circle cx="${ax}" cy="${ay}" r=".6" fill="#3d2c1a"/>`;
  k += flaeche(-9, -21, 18, 21);
  S.teil({ id: "windmuehle", de: "die Windmühle", syl: "WIND-müh-le", it: "il mulino a vento", itSyl: "mu-LI-no a VEN-to", en: "windmill", x: 92, y: HOR - 6, kunst: k,
    tipp: "Früher mahlten die Windmühlen auf den Inseln das Korn. Der Wind weht hier fast immer." });
}

/* =====================================================================
   2 — DAS MEER (Bucht von Lindos)
   ===================================================================== */
{
  let k = `<rect x="0" y="0" width="236" height="40" fill="${S.lg("meer", [[0, "#1f5fa0"], [0.3, "#2a86b8"], [0.75, "#2fb0c4"], [1, "#5fd0cf"]])}"/>`;
  k += `<rect x="0" y="0" width="236" height="1.2" fill="#174d86"/>`;
  for (let i = 0; i < 70; i++) { const y = 2 + rnd() * 34, w = 2 + rnd() * (3 + y * 0.25); k += `<rect x="${r(rnd() * 230)}" y="${r(y)}" width="${r(w)}" height="${r(0.2 + y * 0.012)}" rx=".2" fill="#e8fbff" opacity="${r(0.25 + rnd() * 0.4)}"/>`; }
  /* Sonnenglitzern */
  k += `<ellipse cx="80" cy="6" rx="40" ry="2.4" fill="#fff" opacity=".12"/>`;
  S.teil({ id: "meer", de: "das Meer", syl: "MEER", it: "il mare", itSyl: "MA-re", en: "sea", x: 0, y: HOR, kunst: k,
    tipp: "Das Mittelmeer ist hier im Sommer etwa 25 Grad warm und ganz klar." });
}

/* =====================================================================
   3 — DAS FISCHERBOOT (Kaiki in der Bucht)
   ===================================================================== */
{
  let k = `<ellipse cx="0" cy=".6" rx="16" ry="1.4" fill="#174d86" opacity=".45"/>`;
  k += `<path d="M-15 -4 Q-14 0 -10 1 L11 1 Q15 0 17 -6 L-15 -4 Z" fill="#f7f5ef"/>`;
  k += `<path d="M-15 -4 L17 -6 L16.6 -4.8 L-14.8 -3 Z" fill="#2a6fb3"/><path d="M-12 .4 L12 .4" stroke="#c63c2a" stroke-width=".7"/>`;
  k += `<path d="M-14.6 -2.4 L16 -4" stroke="#e2b23a" stroke-width=".4"/>`;
  k += `<rect x="-6" y="-10" width="8" height="5.4" fill="${S.lg("ruderhaus", [[0, "#ffffff"], [1, "#dcd6c8"]])}"/><rect x="-6.6" y="-10.6" width="9.2" height="1" fill="#2a6fb3"/>`;
  k += `<rect x="-4.8" y="-8.8" width="2.4" height="1.8" fill="#3c5a76"/><rect x="-1.4" y="-8.8" width="2.4" height="1.8" fill="#3c5a76"/>`;
  k += `<line x1="7" y1="-5" x2="7" y2="-17" stroke="#6b4a2a" stroke-width=".5"/><line x1="7" y1="-15" x2="15" y2="-5.6" stroke="#6b4a2a" stroke-width=".25"/>`;
  k += `<g transform="translate(7.2 -17)"><rect width="3.6" height="2.4" fill="#0d5eaf"/><rect y=".53" width="3.6" height=".27" fill="#fff"/><rect y="1.07" width="3.6" height=".27" fill="#fff"/><rect y="1.6" width="3.6" height=".27" fill="#fff"/></g>`;
  k += `<path d="M-14 1.6 Q0 3 15 1.6" stroke="#fff" stroke-width=".4" opacity=".6" fill="none"/>`;
  S.teil({ id: "fischerboot", de: "das Fischerboot", syl: "FI-scher-boot", it: "la barca da pesca", itSyl: "BAR-ca da PE-sca", en: "fishing boat", x: 98, y: HOR + 19, kunst: k,
    tipp: "Die bunten Holzboote der Fischer heißen auf Griechisch „Kaiki“." });
}

/* =====================================================================
   4 — DIE AKROPOLIS auf dem Felsen — Lupe: Säule, Tempel, Burgmauer, Felsen
   ===================================================================== */
const akroUnter = [];
{
  const X = 220, Y = 136;   /* Fußpunkt (vom Dorf verdeckt) */
  let k = "";
  /* der Felsen: links eine senkrechte Klippe zum Meer, rechts Hänge */
  const felsPfad = "M-96 0 L-94 -46 Q-93 -70 -86 -86 L-70 -96 L-30 -100 L10 -104 L52 -100 L84 -94 L100 -88 L100 0 Z";
  k += `<path d="${felsPfad}" fill="${FELS}"/>`;
  k += `<path d="M-96 0 L-94 -46 Q-93 -70 -86 -86 L-80 -90 Q-84 -60 -82 -30 L-80 0 Z" fill="${FELS_V}"/>`;
  /* Verwitterung: senkrechte dunkle Schlieren, Felsbänder mit Lichtkante, Schatten rechts */
  for (let i = 0; i < 18; i++) { const x = -78 + rnd() * 172, y = -92 + rnd() * 20, h = 20 + rnd() * 50; k += `<path d="M${r(x)} ${r(y)} q${r(-1 + rnd() * 2)} ${r(h / 2)} ${r(-0.5 + rnd())} ${r(h)}" stroke="#6f5c43" stroke-width="${r(2 + rnd() * 2.6)}" opacity="${r(0.06 + rnd() * 0.08)}" fill="none"/>`; }
  for (const [y, x0, x1] of [[-74, -78, 40], [-58, -70, 96], [-38, -84, 70], [-22, -60, 100]]) k += `<path d="M${x0} ${y} Q${(x0 + x1) / 2} ${y - 3} ${x1} ${y + 1}" stroke="#e3d2ad" stroke-width="1.1" opacity=".22" fill="none"/><path d="M${x0} ${y + 1.4} Q${(x0 + x1) / 2} ${y - 1.6} ${x1} ${y + 2.4}" stroke="#6f5c43" stroke-width=".8" opacity=".18" fill="none"/>`;
  k += `<path d="${felsPfad}" fill="${S.lg("felsschatten", [[0, "#000", 0], [0.6, "#000", 0], [1, "#3a2a18", 0.28]], 0, 0, 1, 0)}"/>`;
  k += `<path d="${felsPfad}" fill="${S.lg("felsunten", [[0, "#fff", 0.08], [0.5, "#000", 0], [1, "#3a2a18", 0.2]])}"/>`;
  for (let i = 0; i < 26; i++) { const x = -90 + rnd() * 186, y = -90 + rnd() * 80; k += `<path d="M${r(x)} ${r(y)} l${r(2 + rnd() * 6)} ${r(1 + rnd() * 3)}" stroke="#7a6548" stroke-width="${r(0.3 + rnd() * 0.4)}" opacity=".55"/>`; }
  for (let i = 0; i < 40; i++) k += `<circle cx="${r(-80 + rnd() * 178)}" cy="${r(-60 + rnd() * 55)}" r="${r(0.6 + rnd() * 1.2)}" fill="${rnd() < 0.5 ? "#7d8a4e" : "#66733e"}" opacity=".7"/>`;
  k += `<path d="M-94 -46 Q-93 -70 -86 -86" stroke="#f1e2c2" stroke-width=".8" opacity=".5" fill="none"/>`;
  /* Burgmauer der Johanniter mit Zinnen und Turm */
  const MY = -100;
  k += `<path d="M-84 -86 L-72 -96 L-72 -110 L84 -110 L84 -92 L-70 -92 Z" fill="${BURG}"/>`;
  k += `<path d="M-84 -86 L-72 -96 L-72 -110 L-84 -102 Z" fill="#b29a72"/>`;
  for (let x = -71; x < 84; x += 4) k += `<rect x="${x}" y="-112.6" width="2.4" height="2.8" fill="${BURG}"/>`;
  for (let i = 0; i < 14; i++) k += `<line x1="-72" y1="${r(-108 + i * 1.2)}" x2="84" y2="${r(-108 + i * 1.2)}" stroke="#a89068" stroke-width=".15" opacity=".5"/>`;
  k += `<rect x="-56" y="-118" width="14" height="26" fill="${S.lg("turm", [[0, "#c4ad84"], [0.4, "#e2cfa6"], [1, "#b39b73"]], 0, 0, 1, 0)}"/>`;
  for (let x = -56; x < -42; x += 3.4) k += `<rect x="${r(x)}" y="-120.6" width="2" height="2.6" fill="#d2bc93"/>`;
  k += `<rect x="-51" y="-112" width="1.4" height="3" rx=".7" fill="#4a3f30"/><rect x="-47" y="-112" width="1.4" height="3" rx=".7" fill="#4a3f30"/>`;
  k += `<path d="M14 -92 L14 -100 Q18 -104 22 -100 L22 -92 Z" fill="#5a4c3a"/>`;
  /* Säulenhalle (Stoa): dorische Säulen über der Mauer, mit Gebälkresten */
  const SAULEN = [];
  for (let i = 0; i < 9; i++) SAULEN.push(-26 + i * 6.4);
  for (const x of SAULEN) {
    k += `<rect x="${r(x - 1.3)}" y="-128" width="2.6" height="18" fill="${SAULE}"/>`;
    for (const dx of [-0.6, 0, 0.6]) k += `<line x1="${r(x + dx)}" y1="-127" x2="${r(x + dx)}" y2="-110.4" stroke="#b8a682" stroke-width=".15"/>`;
    k += `<rect x="${r(x - 1.9)}" y="-129.4" width="3.8" height="1.4" fill="#e9dcc0"/>`;
  }
  k += `<rect x="-28" y="-131.4" width="13.8" height="2" fill="#e3d5b6"/><rect x="${r(SAULEN[5] - 2)}" y="-131.4" width="${r(SAULEN[8] - SAULEN[5] + 4)}" height="2" fill="#e3d5b6"/>`;
  /* Tempel der Athena Lindia am äußersten Rand (vier Säulen, Giebel) */
  const TX = 66;
  k += `<rect x="${TX - 9}" y="-114" width="18" height="2" fill="#e3d5b6"/>`;
  for (let i = 0; i < 4; i++) k += `<rect x="${TX - 7.6 + i * 4.6}" y="-124" width="1.8" height="10" fill="${SAULE}"/>`;
  k += `<rect x="${TX - 9}" y="-126" width="18" height="2.2" fill="#e9dcc0"/><path d="M${TX - 9} -126 L${TX} -130.4 L${TX + 9} -126 Z" fill="#dccdae"/><path d="M${TX - 6} -126.4 L${TX} -129.2 L${TX + 6} -126.4 Z" fill="#cbbb98"/>`;
  /* Weg mit Treppe hinauf (Eselsweg) */
  k += `<path d="M-30 -2 Q-10 -30 10 -44 Q30 -60 14 -80 L18 -82 Q36 -60 14 -42 Q-6 -26 -24 -2 Z" fill="#d8c8a6" opacity=".9"/>`;
  /* Lupe-Teile */
  akroUnter.push({ id: "saeule", de: "die Säule", syl: "SÄU-le", it: "la colonna", itSyl: "co-LON-na", en: "column", x: X + SAULEN[4], y: Y - 109, kunst: flaeche(-3, -21, 6, 22),
    tipp: "Diese Säulen sind über 2200 Jahre alt. Sie gehören zu einer großen Säulenhalle." });
  akroUnter.push({ id: "tempel", de: "der Tempel", syl: "TEM-pel", it: "il tempio", itSyl: "TEM-pio", en: "temple", x: X + TX, y: Y - 113, kunst: flaeche(-10.5, -18.4, 21, 19),
    tipp: "Der Tempel war der Göttin Athena geweiht." });
  akroUnter.push({ id: "burgmauer", de: "die Burgmauer", syl: "BURG-mau-er", it: "le mura del castello", itSyl: "MU-ra del ca-STEL-lo", en: "castle wall", x: X - 49, y: Y - 92, kunst: flaeche(-23, -28, 30, 28),
    tipp: "Die Ritter des Johanniterordens bauten im Mittelalter eine Burg um die alte Akropolis." });
  akroUnter.push({ id: "felsen", de: "der Felsen", syl: "FEL-sen", it: "la roccia", itSyl: "ROC-cia", en: "rock", x: X + 40, y: Y - 40, kunst: flaeche(-24, -36, 52, 36) });
  S.teil({ id: "akropolis", de: "die Akropolis", syl: "A-KRO-po-lis", it: "l'Acropoli", itSyl: "a-CRO-po-li", en: "Acropolis", x: X, y: Y, kunst: k,
    zoom: { x: 124, y: 2, w: 198, h: 132 }, unter: akroUnter,
    tipp: "Akropolis heißt „Oberstadt“: die Burg auf dem Hügel. Die berühmteste steht in Athen, diese hier in Lindos auf Rhodos." });
}

/* =====================================================================
   5 — DAS DORF: weiße Würfelhäuser am Fuß des Felsens
   ===================================================================== */
{
  let k = "";
  const haeuser = [];
  /* Reihen von hinten nach vorne */
  for (const [y0, n, hMin, hMax] of [[-30, 9, 8, 12], [-18, 10, 9, 13], [-4, 9, 10, 15], [10, 7, 11, 16]]) {
    let x = -78 + rnd() * 6;
    for (let i = 0; i < n && x < 102; i++) {
      const w = 10 + rnd() * 9, h = hMin + rnd() * (hMax - hMin);
      haeuser.push([x, y0, w, h]);
      x += w + 0.6 + rnd() * 2;
    }
  }
  for (const [x, y, w, h] of haeuser) {
    k += `<rect x="${r(x)}" y="${r(y - h)}" width="${r(w)}" height="${r(h + 14)}" fill="${KALK}"/>`;
    k += `<rect x="${r(x + w - 2.2)}" y="${r(y - h)}" width="2.2" height="${r(h + 14)}" fill="${KALK_S}" opacity=".7"/>`;
    k += `<rect x="${r(x - 0.4)}" y="${r(y - h - 1)}" width="${r(w + 0.8)}" height="1.2" fill="#f9f8f4"/>`;
    const art = rnd();
    if (art < 0.5) k += `<rect x="${r(x + 2)}" y="${r(y - h + 3)}" width="2.2" height="3" fill="${rnd() < 0.5 ? "#2f74b5" : "#3a4048"}"/>`;
    if (art > 0.3) k += `<path d="M${r(x + w / 2 - 1.6)} ${r(y)} L${r(x + w / 2 - 1.6)} ${r(y - 4.4)} Q${r(x + w / 2)} ${r(y - 6)} ${r(x + w / 2 + 1.6)} ${r(y - 4.4)} L${r(x + w / 2 + 1.6)} ${r(y)} Z" fill="${rnd() < 0.6 ? "#2f74b5" : "#6b4a2e"}"/>`;
    if (art > 0.8) k += `<path d="M${r(x + 1)} ${r(y - h - 1)} L${r(x + 1)} ${r(y - h - 4)} Q${r(x + 3)} ${r(y - h - 6)} ${r(x + 5)} ${r(y - h - 4)} L${r(x + 5)} ${r(y - h - 1)} Z" fill="#f9f8f4"/>`;
  }
  /* Palmen und Bougainvillea-Tupfer zwischen den Häusern */
  for (const x of [-40, 30, 70]) {
    k += `<path d="M${x} 6 Q${x + 1} -8 ${x - 0.5} -18" stroke="#7a5a3a" stroke-width="1" fill="none"/>`;
    for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * 0.5; k += `<path d="M${x - 0.5} -18 Q${r(x - 0.5 + Math.cos(a) * 4)} ${r(-18 + Math.sin(a) * 4 - 1)} ${r(x - 0.5 + Math.cos(a) * 7)} ${r(-18 + Math.sin(a) * 3 + 3)}" stroke="#4f7a3a" stroke-width="1.1" fill="none"/>`; }
  }
  for (let i = 0; i < 16; i++) k += `<circle cx="${r(-70 + rnd() * 165)}" cy="${r(-26 + rnd() * 40)}" r="${r(1 + rnd() * 1.2)}" fill="${rnd() < 0.6 ? "#d23a8a" : "#e05aa0"}" opacity=".9"/>`;
  k += `<rect x="-80" y="-34" width="184" height="58" fill="${S.lg("dorflicht", [[0, "#fff", 0], [1, "#e9d9bd", 0.25]])}"/>`;
  S.teil({ id: "dorf", de: "das Dorf", syl: "DORF", it: "il villaggio", itSyl: "vil-LAG-gio", en: "village", x: 218, y: 126, kunst: k,
    tipp: "Die Häuser werden jedes Jahr frisch gekalkt. Das Weiß hält sie im Sommer kühl." });
}

/* =====================================================================
   6 — DIE KIRCHE der Panagia mit dem Glockenturm
   ===================================================================== */
{
  let k = "";
  /* Kirchenschiff mit Ziegeldach und kleiner Kuppel */
  k += `<rect x="-16" y="-16" width="22" height="18" fill="${KALK}"/><rect x="2" y="-16" width="4" height="18" fill="${KALK_S}" opacity=".8"/>`;
  k += `<path d="M-17 -16 L-5 -22 L7 -16 Z" fill="${S.lg("ziegel", [[0, "#c7643a"], [1, "#9a4626"]])}"/>`;
  k += `<rect x="-9" y="-26" width="8" height="5" fill="${KALK}"/><path d="M-9.4 -26 Q-5 -32 -.6 -26 Z" fill="${S.lg("kuppel", [[0, "#d7764a"], [1, "#a2512c"]], 0, 0, 1, 0)}"/><line x1="-5" y1="-29.6" x2="-5" y2="-32.4" stroke="#7a5a2a" stroke-width=".4"/><path d="M-6 -31.4 H-4" stroke="#7a5a2a" stroke-width=".35"/>`;
  k += `<path d="M-11 2 L-11 -7 Q-8.5 -10 -6 -7 L-6 2 Z" fill="#6b4a2e"/>`;
  /* Glockenturm: heller Stein, vier Geschosse mit Bögen, Uhr, kleine Kuppel */
  const T = S.lg("glockenturm", [[0, "#cdb88f"], [0.4, "#ecdcb6"], [1, "#b8a07a"]], 0, 0, 1, 0);
  k += `<rect x="8" y="-30" width="11" height="32" fill="${T}"/>`;
  k += `<rect x="8.6" y="-40" width="9.8" height="10" fill="${T}"/><rect x="9.4" y="-48" width="8.2" height="8" fill="${T}"/><rect x="10.2" y="-54" width="6.6" height="6" fill="${T}"/>`;
  for (const [y, w] of [[-30, 11], [-40, 9.8], [-48, 8.2], [-54, 6.6]]) k += `<rect x="${r(13.5 - w / 2 - 0.5)}" y="${y - 0.8}" width="${r(w + 1)}" height="1" fill="#f3e6c8"/>`;
  k += `<circle cx="13.5" cy="-24" r="2.2" fill="#f8f4ea" stroke="#7a5a2a" stroke-width=".3"/><path d="M13.5 -24 L13.5 -25.6 M13.5 -24 L14.6 -23.4" stroke="#222" stroke-width=".3"/>`;
  for (const [y, n, w] of [[-38.6, 2, 2.4], [-46.6, 2, 2], [-52.8, 1, 2]]) for (let i = 0; i < n; i++) {
    const x = n === 1 ? 13.5 - w / 2 : 10.6 + i * 3.8;
    k += `<path d="M${r(x)} ${y + 6} L${r(x)} ${r(y + 1.2)} Q${r(x + w / 2)} ${r(y - 0.6)} ${r(x + w)} ${r(y + 1.2)} L${r(x + w)} ${y + 6} Z" fill="#3a3128"/>`;
    k += `<path d="M${r(x + 0.3)} ${y + 3.4} Q${r(x + w / 2)} ${r(y + 1.4)} ${r(x + w - 0.3)} ${y + 3.4} Z" fill="#c9a640"/>`;
  }
  k += `<path d="M10 -54.8 Q13.5 -60 17 -54.8 Z" fill="${T}"/><line x1="13.5" y1="-58.6" x2="13.5" y2="-62" stroke="#7a5a2a" stroke-width=".4"/><path d="M12.4 -61 H14.6" stroke="#7a5a2a" stroke-width=".35"/>`;
  S.teil({ id: "haus2", de: "die Kirche", syl: "KIR-che", it: "la chiesa", itSyl: "CHIE-sa", en: "church", x: 198, y: 134, kunst: k,
    tipp: "Die Kirche der Panagia (Maria) ist über 500 Jahre alt. Ihr Glockenturm ist weit zu sehen." });
}

/* =====================================================================
   7 — DAS WEISSE HAUS (links, Haus der Taverne) und DIE BOUGAINVILLEA
   ===================================================================== */
{
  const Y = yAt(8), u = uAt(8);   /* ≈ 154,6; 31,6 je Meter */
  let k = "";
  k += `<rect x="-2" y="${r(-4 * u)}" width="62" height="${r(4 * u)}" fill="${KALK_V}"/>`;
  k += `<rect x="-2" y="${r(-4 * u - 3)}" width="64" height="3.4" rx="1" fill="#fdfcf8"/>`;
  /* Kalk-Struktur */
  for (let i = 0; i < 50; i++) k += `<circle cx="${r(rnd() * 58)}" cy="${r(-4 * u + rnd() * 4 * u)}" r="${r(0.3 + rnd() * 0.6)}" fill="${rnd() < 0.5 ? "#e6e1d6" : "#fff"}" opacity=".7"/>`;
  /* Kapitänshaus-Tür: Steinrahmen mit Kordel-Muster, blaue Tür */
  k += `<rect x="13" y="${r(-2.2 * u - 4)}" width="${r(0.9 * u + 8)}" height="${r(2.2 * u + 4)}" fill="${S.lg("tuerstein", [[0, "#d9c39a"], [1, "#b89f74"]])}"/>`;
  for (let i = 0; i < 16; i++) k += `<ellipse cx="${r(15 + i * ((0.9 * u + 4) / 15))}" cy="${r(-2.2 * u - 2)}" rx=".9" ry=".5" fill="#a88e62" transform="rotate(35 ${r(15 + i * ((0.9 * u + 4) / 15))} ${r(-2.2 * u - 2)})"/>`;
  k += `<rect x="17" y="${r(-2.1 * u + 0.4)}" width="${r(0.9 * u)}" height="${r(2.1 * u - 0.4)}" fill="${BLAU}"/>`;
  for (let i = 0; i < 2; i++) k += `<rect x="${r(18.4 + i * (0.45 * u))}" y="${r(-2 * u + 1)}" width="${r(0.45 * u - 2.8)}" height="${r(0.9 * u)}" rx=".6" fill="none" stroke="#174276" stroke-width=".6"/><rect x="${r(18.4 + i * (0.45 * u))}" y="${r(-1 * u + 2)}" width="${r(0.45 * u - 2.8)}" height="${r(0.9 * u - 4)}" rx=".6" fill="none" stroke="#174276" stroke-width=".6"/>`;
  k += `<circle cx="${r(17 + 0.9 * u - 3)}" cy="${r(-1.05 * u)}" r=".9" fill="#c9a640"/>`;
  /* Fenster mit blauen Läden */
  const fx = 46, fy = -3 * u;
  k += `<rect x="${fx - 5}" y="${r(fy)}" width="10" height="13" fill="#2b3640"/><rect x="${fx - 10.4}" y="${r(fy)}" width="5" height="13" fill="${BLAU}"/><rect x="${fx + 5.4}" y="${r(fy)}" width="5" height="13" fill="${BLAU}"/>`;
  for (let i = 1; i < 6; i++) k += `<line x1="${fx - 10.4}" y1="${r(fy + i * 2.2)}" x2="${fx - 5.4}" y2="${r(fy + i * 2.2)}" stroke="#174276" stroke-width=".4"/><line x1="${fx + 5.4}" y1="${r(fy + i * 2.2)}" x2="${fx + 10.4}" y2="${r(fy + i * 2.2)}" stroke="#174276" stroke-width=".4"/>`;
  k += `<rect x="${fx - 6}" y="${r(fy + 13)}" width="12" height="1.2" fill="#f2efe7"/>`;
  /* Sockel und Schatten der Mauerkante */
  k += `<rect x="-2" y="-3" width="62" height="3" fill="#d6d0c4"/><rect x="56" y="${r(-4 * u)}" width="4" height="${r(4 * u)}" fill="${KALK_S}" opacity=".6"/>`;
  S.teil({ id: "haus", de: "das weiße Haus", syl: "WEI-ße HAUS", it: "la casa bianca", itSyl: "CA-sa BIAN-ca", en: "white house", x: 0, y: Y, kunst: k,
    tipp: "Weiße Wände und blaue Türen: So sehen die Häuser auf den griechischen Inseln aus." });
}
{
  const Y = yAt(8);
  let k = `<path d="M8 -18 Q14 -60 6 -92 Q2 -110 12 -126" stroke="#6b4a2a" stroke-width="1.2" fill="none"/><path d="M8 -60 Q24 -76 36 -122" stroke="#6b4a2a" stroke-width=".8" fill="none"/>`;
  const bl = [];
  for (let i = 0; i < 120; i++) {
    const t = rnd();
    const x = t < 0.55 ? 2 + rnd() * 16 + (1 - rnd()) * 4 : 12 + rnd() * 30, y = t < 0.55 ? -20 - rnd() * 104 : -112 - rnd() * 18;
    bl.push([x, y]);
  }
  for (const [x, y] of bl) k += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(1.2 + rnd() * 1.1)}" fill="${["#d01f7c", "#e0469a", "#b8166a", "#f06ab0"][Math.floor(rnd() * 4)]}"/>`;
  for (let i = 0; i < 30; i++) { const [x, y] = bl[Math.floor(rnd() * bl.length)]; k += `<ellipse cx="${r(x + 1)}" cy="${r(y + 1)}" rx="1.2" ry=".7" fill="#3f7a35"/>`; }
  S.teil({ oben: true, id: "bougainvillea", de: "die Bougainvillea", syl: "Bu-gän-VIL-lea", it: "la bouganville", itSyl: "bu-gan-VIL-le", en: "bougainvillea", x: 0, y: Y, kunst: k,
    tipp: "Die Bougainvillea blüht den ganzen Sommer pink und lila." });
}

/* =====================================================================
   8 — DIE FLAGGE auf dem Dach
   ===================================================================== */
{
  let k = `<line x1="0" y1="0" x2="0" y2="-23" stroke="#e9e6dd" stroke-width=".8"/><circle cx="0" cy="-23.4" r=".8" fill="#d8b44a"/>`;
  const W = 21, H = 14, s = H / 9;
  let f = `<rect width="${W}" height="${H}" fill="#0d5eaf"/>`;
  for (let i = 1; i < 9; i += 2) f += `<rect y="${r(i * s)}" width="${W}" height="${r(s)}" fill="#fff"/>`;
  f += `<rect width="${r(5 * s)}" height="${r(5 * s)}" fill="#0d5eaf"/><rect x="${r(2 * s)}" width="${r(s)}" height="${r(5 * s)}" fill="#fff"/><rect y="${r(2 * s)}" width="${r(5 * s)}" height="${r(s)}" fill="#fff"/>`;
  f += `<path d="M6 0 Q8 7 6 14" stroke="#000" stroke-width="2" opacity=".08" fill="none"/><path d="M15 0 Q17 7 15 14" stroke="#fff" stroke-width="1.6" opacity=".12" fill="none"/>`;
  k += `<g transform="translate(.4 -22.6) skewY(4)">${f}</g>`;
  S.teil({ oben: true, id: "flagge", de: "die Flagge", syl: "FLAG-ge", it: "la bandiera", itSyl: "ban-DIE-ra", en: "flag", x: 44, y: r(yAt(8) - 4 * uAt(8) - 2), kunst: k + flaeche(-2, -24, 24, 25),
    tipp: "Die neun Streifen der griechischen Flagge stehen für die Silben von „Freiheit oder Tod“." });
}

/* =====================================================================
   9 — DIE MAUER der Terrasse (weiß gekalkt)
   ===================================================================== */
const MAUER_Y = yAt(7), MAUER_O = yAt(7, 0.72);
{
  let k = `<rect x="0" y="${r(MAUER_O - MAUER_Y)}" width="174" height="${r(MAUER_Y - MAUER_O)}" fill="${KALK}"/>`;
  k += `<path d="M-1 ${r(MAUER_O - MAUER_Y + 1)} Q-1 ${r(MAUER_O - MAUER_Y - 2.4)} 3 ${r(MAUER_O - MAUER_Y - 2.4)} L172 ${r(MAUER_O - MAUER_Y - 2.4)} Q175 ${r(MAUER_O - MAUER_Y - 2.4)} 175 ${r(MAUER_O - MAUER_Y + 1)} Z" fill="#fdfdfb"/>`;
  k += `<rect x="0" y="${r(MAUER_O - MAUER_Y + 1)}" width="174" height="2" fill="#d5dbe3" opacity=".7"/>`;
  for (let i = 0; i < 40; i++) k += `<circle cx="${r(rnd() * 174)}" cy="${r(MAUER_O - MAUER_Y + 3 + rnd() * (MAUER_Y - MAUER_O - 5))}" r="${r(0.3 + rnd() * 0.5)}" fill="#e3ded3" opacity=".8"/>`;
  k += `<rect x="0" y="-2" width="174" height="2" fill="#d1cbbd"/>`;
  k += `<rect x="170" y="${r(MAUER_O - MAUER_Y)}" width="4" height="${r(MAUER_Y - MAUER_O)}" fill="${KALK_S}" opacity=".8"/>`;
  S.teil({ id: "mauer", de: "die Mauer", syl: "MAU-er", it: "il muretto", itSyl: "mu-RET-to", en: "wall", x: 58, y: MAUER_Y, steht: true, kunst: k });
}

/* =====================================================================
   10 — DIE KATZE auf der Mauer
   ===================================================================== */
{
  let k = `<ellipse cx="0" cy="-.2" rx="4.4" ry=".7" fill="#000" opacity=".15"/>`;
  const FELL = S.lg("fell", [[0, "#e6a35a"], [1, "#b8742f"]]);
  k += `<path d="M-3.6 0 Q-4.4 -5 -1.8 -7.4 L1.6 -7.4 Q3.8 -5 3.2 0 Z" fill="${FELL}"/>`;
  k += `<path d="M3 -.4 Q7 -.6 6.6 -3.6" stroke="${FELL}" stroke-width="1.1" fill="none" stroke-linecap="round"/>`;
  k += `<circle cx="-.2" cy="-9" r="2.6" fill="${FELL}"/><path d="M-2.4 -10.2 L-2.2 -12.8 L-.8 -11.2 Z M2 -10.2 L1.8 -12.8 L.4 -11.2 Z" fill="${FELL}"/>`;
  k += `<path d="M-1.4 -9.4 h.9 M.6 -9.4 h.9" stroke="#2f4a2a" stroke-width=".45"/><circle cx="-.2" cy="-8.2" r=".3" fill="#c46a6a"/>`;
  for (const y of [-3, -5]) k += `<path d="M-3.4 ${y} q1.4 .6 2.4 0" stroke="#a5662a" stroke-width=".35" fill="none"/>`;
  k += `<path d="M-1.6 0 v-2.4 M.8 0 v-2.4" stroke="#a5662a" stroke-width=".3"/>`;
  S.teil({ oben: true, id: "katze", de: "die Katze", syl: "KAT-ze", it: "il gatto", itSyl: "GAT-to", en: "cat", x: 214, y: r(MAUER_O - 2.4), steht: true, kunst: k + flaeche(-4.4, -13, 11, 13.4),
    tipp: "In Griechenland leben viele Katzen frei auf den Straßen und Terrassen." });
}

/* =====================================================================
   11 — DER ESEL („Lindos-Taxi“) auf der Gasse rechts
   ===================================================================== */
{
  const u = uAt(9);   /* ≈ 28 je Meter */
  const FELL = S.lg("eselfell", [[0, "#9a8f84"], [0.6, "#7d7268"], [1, "#5f554c"]]);
  let k = schatten(0, 0.4, 24, 2, 0.35);
  /* Beine */
  for (const [x, v] of [[-12, 1], [-8, -1], [9, 1], [13, -1]]) k += `<path d="M${x} -16 L${x + v * 0.6} -2 L${x + v * 0.6 + 1.6} -2 L${x + 2} -16 Z" fill="${v > 0 ? "#6e645a" : "#857a6f"}"/><rect x="${r(x + v * 0.6 - 0.3)}" y="-2" width="2.4" height="2" rx=".5" fill="#2a2420"/>`;
  /* Körper */
  k += `<path d="M-16 -16 Q-17 -27 -6 -28 L10 -28 Q17 -27 16 -18 Q15 -14 9 -14 L-12 -14 Q-16 -14 -16 -16 Z" fill="${FELL}"/>`;
  k += `<path d="M-14 -17 Q0 -13 14 -17" stroke="#d8d2c8" stroke-width="1.4" opacity=".55" fill="none"/>`;
  /* Hals und Kopf (nach links), weiße Schnauze, lange Ohren */
  k += `<path d="M-10 -26 Q-16 -30 -18 -36 L-12 -38 Q-9 -32 -4 -27 Z" fill="${FELL}"/>`;
  k += `<path d="M-18 -36 Q-24 -36 -25 -31 Q-25.6 -28 -22.6 -27.6 Q-19 -28 -16 -32 Z" fill="${FELL}"/>`;
  k += `<path d="M-25 -31 Q-25.6 -28 -22.6 -27.6 Q-21 -28 -21.4 -30.4 Q-23 -31.6 -25 -31 Z" fill="#e8e2d8"/>`;
  k += `<circle cx="-19" cy="-34" r=".9" fill="#efe9df"/><circle cx="-19.1" cy="-34" r=".5" fill="#1b1714"/>`;
  k += `<path d="M-15.6 -37 L-15 -45 Q-13.6 -44 -13.4 -37 Z M-13 -37.4 L-11.4 -44.6 Q-10.2 -43 -11 -37 Z" fill="#6e645a"/><path d="M-15 -43 L-14.4 -38" stroke="#2a2420" stroke-width=".4"/>`;
  k += `<path d="M-12 -38 Q-8 -33 -4 -28.4" stroke="#3a322c" stroke-width="1.4" fill="none"/>`;
  /* Halfter */
  k += `<path d="M-22 -31.6 L-16 -33.2 M-17 -36.6 L-16.2 -31.6" stroke="#b8262a" stroke-width=".6" fill="none"/>`;
  /* Sattel mit bunter Decke und Quasten */
  k += `<path d="M-8 -28 L10 -28 L11 -16 L-9 -16 Z" fill="${S.lg("decke", [[0, "#c8242c"], [0.33, "#e2b33a"], [0.5, "#2d6ab0"], [0.7, "#c8242c"], [1, "#2f7a4a"]])}"/>`;
  for (let i = 0; i < 6; i++) k += `<path d="M${-7.6 + i * 3.4} -16 l.6 2.6" stroke="${["#e2b33a", "#2d6ab0", "#c8242c"][i % 3]}" stroke-width=".9" stroke-linecap="round"/>`;
  k += `<path d="M-6 -28 Q1 -34 8 -28 Z" fill="#6b4a2e"/><path d="M-3 -31 L-3 -33.6 M5 -30.6 L5 -33" stroke="#4a3220" stroke-width=".9"/>`;
  /* Schwanz */
  k += `<path d="M16 -24 Q19 -20 18 -12" stroke="#5f554c" stroke-width=".8" fill="none"/><path d="M17.4 -13 l.8 2.4 l.6 -2.2 Z" fill="#2a2420"/>`;
  S.teil({ id: "esel", de: "der Esel", syl: "E-sel", it: "l'asino", itSyl: "A-si-no", en: "donkey", x: 282, y: yAt(9), steht: true, kunst: k,
    tipp: "In Lindos tragen die Esel Besucher den steilen Weg hinauf zur Akropolis. Man nennt sie „Lindos-Taxi“." });
}

/* =====================================================================
   12 — DIE AMPHORE (Terrakotta, Schmuck auf der Terrasse)
   ===================================================================== */
{
  const u = uAt(6.2);
  let k = schatten(0, 0.3, 9, 1.4, 0.35);
  const h = 0.9 * u, w = 0.42 * u;
  k += `<path d="M-3 0 L-3.6 -2 Q${r(-w / 2)} ${r(-h * 0.35)} ${r(-w / 2 + 0.4)} ${r(-h * 0.62)} Q${r(-w / 2 + 2)} ${r(-h * 0.78)} ${r(-w * 0.18)} ${r(-h * 0.82)} L${r(-w * 0.18)} ${r(-h * 0.95)} L${r(-w * 0.26)} ${r(-h)} L${r(w * 0.26)} ${r(-h)} L${r(w * 0.18)} ${r(-h * 0.95)} L${r(w * 0.18)} ${r(-h * 0.82)} Q${r(w / 2 - 2)} ${r(-h * 0.78)} ${r(w / 2 - 0.4)} ${r(-h * 0.62)} Q${r(w / 2)} ${r(-h * 0.35)} 3.6 -2 L3 0 Z" fill="${TERRA}"/>`;
  /* Henkel */
  for (const s of [-1, 1]) k += `<path d="M${r(s * w * 0.18)} ${r(-h * 0.92)} Q${r(s * w * 0.55)} ${r(-h * 0.94)} ${r(s * w * 0.42)} ${r(-h * 0.7)}" stroke="#a9552c" stroke-width="1.6" fill="none"/>`;
  /* Mäanderband und dunkle Bänder (Schmuck) */
  const by = -h * 0.6;
  k += `<rect x="${r(-w / 2 + 0.8)}" y="${r(by - 1.6)}" width="${r(w - 1.6)}" height="3.2" fill="#2a1a12"/>`;
  for (let x = -w / 2 + 1.4; x < w / 2 - 2; x += 2.4) k += `<path d="M${r(x)} ${r(by + 1)} v-1.8 h1.6 v1 h-.8" stroke="#e08a55" stroke-width=".4" fill="none"/>`;
  k += `<rect x="${r(-w / 2 + 2)}" y="${r(-h * 0.25)}" width="${r(w - 4)}" height="1" fill="#2a1a12" opacity=".8"/>`;
  k += `<path d="M${r(-w / 2 + 2.4)} ${r(-h * 0.55)} Q${r(-w / 2 + 2)} ${r(-h * 0.3)} -1 -3" stroke="#fff" stroke-width=".8" opacity=".25" fill="none"/>`;
  S.teil({ id: "amphore", de: "die Amphore", syl: "Am-PHO-re", it: "l'anfora", itSyl: "AN-fo-ra", en: "amphora", x: 236, y: yAt(6.2), steht: true, kunst: k,
    tipp: "In Amphoren transportierten die alten Griechen Öl und Wein." });
}

/* =====================================================================
   13 — DER STUHL und 14 — DER TISCH (Taverne)
   ===================================================================== */
{
  const d = 4.5, u = uAt(d), Y = yAt(d);
  const sitz = -0.45 * u, lehne = -0.92 * u;
  const H = S.lg("stuhlblau", [[0, "#3a7fc0"], [1, "#245c94"]], 0, 0, 1, 0);
  let k = schatten(0, 0.3, 12, 1.4, 0.3);
  /* Seitenansicht: zwei Beine vorn, zwei hinten, Lehne mit Sprossen */
  k += `<rect x="-9" y="${r(lehne)}" width="2" height="${r(-lehne)}" fill="${H}"/><rect x="-6.6" y="${r(lehne + 1)}" width="1.6" height="${r(-lehne - 1)}" fill="#1f4f80"/>`;
  k += `<rect x="7" y="${r(sitz)}" width="2" height="${r(-sitz)}" fill="${H}"/><rect x="4.6" y="${r(sitz + 0.6)}" width="1.6" height="${r(-sitz - 0.6)}" fill="#1f4f80"/>`;
  k += `<rect x="-9" y="${r(-0.18 * u)}" width="18" height="1.2" fill="${H}"/>`;
  /* Binsensitz (geflochten) */
  k += `<path d="M-10 ${r(sitz)} L10 ${r(sitz)} L9 ${r(sitz + 3)} L-9 ${r(sitz + 3)} Z" fill="${S.lg("binse", [[0, "#e2c37a"], [1, "#b8913f"]])}"/>`;
  for (let x = -9; x < 9; x += 1.4) k += `<line x1="${r(x)}" y1="${r(sitz + 0.3)}" x2="${r(x + 0.8)}" y2="${r(sitz + 2.8)}" stroke="#9c7834" stroke-width=".3"/>`;
  /* Lehne: zwei Querstreben */
  for (const t of [0.12, 0.32]) k += `<rect x="-9.6" y="${r(lehne + u * t)}" width="3.4" height="2.4" rx=".6" fill="${H}"/>`;
  S.teil({ id: "stuhl", de: "der Stuhl", syl: "STUHL", it: "la sedia", itSyl: "SE-dia", en: "chair", x: 90, y: Y, steht: true, kunst: k,
    tipp: "Die typischen Taverne-Stühle haben einen Sitz aus geflochtenen Binsen." });
}
const TISCH = { d: 4.3, x: 150 };
const ES = uAt(4.3) / uAt(5);   /* Speisen maßstäblich zum näheren Tisch */
const TU = uAt(TISCH.d), TY = yAt(TISCH.d);
const T_HINTEN = yAt(TISCH.d + 0.4, 0.75), T_VORNE = yAt(TISCH.d - 0.4, 0.75);
{
  const halb = (d) => 0.45 * uAt(d);
  const yv = T_VORNE - TY, yh = T_HINTEN - TY, wv = halb(TISCH.d - 0.4), wh = halb(TISCH.d + 0.4);
  let k = schatten(0, 0.3, 26, 2, 0.35);
  /* Beine (Holz, blau gestrichen) */
  for (const s of [-1, 1]) k += `<rect x="${r(s * (wv - 3) - 1.2)}" y="${r(yv)}" width="2.4" height="${r(-yv)}" fill="${S.lg("tischbein", [[0, "#3a7fc0"], [1, "#245c94"]], 0, 0, 1, 0)}"/>`;
  for (const s of [-1, 1]) k += `<rect x="${r(s * (wh - 3) - 1)}" y="${r(yh)}" width="2" height="${r(yv - yh + 6)}" fill="#1f4f80"/>`;
  /* Tischtuch blau-weiß kariert, hängt vorne über */
  S.def(`<pattern id="${S.id("karo")}" width="3" height="3" patternUnits="userSpaceOnUse"><rect width="3" height="3" fill="#fbfbf8"/><rect width="1.5" height="3" fill="#3b78c2" opacity=".55"/><rect width="3" height="1.5" fill="#3b78c2" opacity=".55"/></pattern>`);
  k += `<path d="M${r(-wh)} ${r(yh)} L${r(wh)} ${r(yh)} L${r(wv + 1.4)} ${r(yv)} L${r(-wv - 1.4)} ${r(yv)} Z" fill="url(#${S.id("karo")})"/>`;
  k += `<path d="M${r(-wv - 1.4)} ${r(yv)} L${r(wv + 1.4)} ${r(yv)} L${r(wv + 1)} ${r(yv + 7)} L${r(-wv - 1)} ${r(yv + 7)} Z" fill="url(#${S.id("karo")})"/>`;
  k += `<path d="M${r(-wv - 1.4)} ${r(yv)} L${r(wv + 1.4)} ${r(yv)} L${r(wv + 1)} ${r(yv + 7)} L${r(-wv - 1)} ${r(yv + 7)} Z" fill="#000" opacity=".12"/>`;
  k += `<path d="M${r(-wh)} ${r(yh)} L${r(wh)} ${r(yh)} L${r(wv + 1.4)} ${r(yv)} L${r(-wv - 1.4)} ${r(yv)} Z" fill="${S.lg("tuchlicht", [[0, "#fff", 0.25], [1, "#fff", 0]])}"/>`;
  S.teil({ id: "tisch", de: "der Tisch", syl: "TISCH", it: "il tavolo", itSyl: "TA-vo-lo", en: "table", x: TISCH.x, y: TY, steht: true, kunst: k });
}
const PL = (T_HINTEN + T_VORNE) / 2;

/* =====================================================================
   15 — AUF DEM TISCH: Gyros, Salat, Oliven, Olivenöl
   ===================================================================== */
{
  /* DER GYROS: Pita mit Fleisch, Tomate, Zwiebel, Tsatsiki, dazu Pommes */
  let k = `<ellipse cx="0" cy="0" rx="10.4" ry="2.6" fill="#e9e6df"/><ellipse cx="0" cy="-.3" rx="9.2" ry="2.1" fill="#fbfaf6"/>`;
  for (let i = 0; i < 8; i++) k += `<rect x="${r(4 + rnd() * 4)}" y="${r(-2.8 + rnd() * 1.8)}" width=".8" height="2.6" rx=".3" fill="#efc964" transform="rotate(${Math.round(-40 + rnd() * 80)} 6 -1)"/>`;
  k += `<path d="M-8 -.4 Q-8.6 -4.6 -4 -6 Q1 -7 3.2 -3.6 Q4 -1.6 2 -.2 Z" fill="${S.lg("pita", [[0, "#f1d496"], [1, "#d3a55a"]])}"/>`;
  for (let i = 0; i < 9; i++) k += `<path d="M${r(-6 + i * 1.1)} ${r(-4.2 + (i % 2) * 0.5)} q.6 -1 1.4 -.2" stroke="#7a4220" stroke-width=".9" fill="none" stroke-linecap="round"/>`;
  k += `<ellipse cx="-3.4" cy="-5.6" rx="1.1" ry=".5" fill="#d8322a"/><ellipse cx="-.8" cy="-5.8" rx="1" ry=".45" fill="#d8322a"/><path d="M-5.6 -5.2 q.8 -.6 1.6 0 M1 -5.2 q.8 -.6 1.4 0" stroke="#e8d6f0" stroke-width=".35" fill="none"/>`;
  k += `<ellipse cx="-1.4" cy="-6.4" rx="2.2" ry=".7" fill="#f4f2ec"/><circle cx="-1" cy="-6.6" r=".2" fill="#6a8a3a"/>`;
  S.teil({ oben: true, id: "gyros", de: "der Gyros", syl: "GY-ros", it: "il gyros", itSyl: "GY-ros", en: "gyros", x: TISCH.x - 11, y: r(PL + 1), steht: true, kunst: `<g transform="scale(${r(ES * 100) / 100})">` + k + flaeche(-10.6, -7.6, 21.2, 10.4) + "</g>",
    tipp: "Gyros heißt „Drehung“: Das Fleisch dreht sich am Spieß und wird dünn abgeschnitten." });
}
{
  /* DER SALAT: Bauernsalat mit Feta-Scheibe */
  let k = `<path d="M-7 -2.6 Q-6.4 1.4 0 1.6 Q6.4 1.4 7 -2.6 Z" fill="${S.lg("schale", [[0, "#fdfcf9"], [1, "#d9d5cc"]])}"/><ellipse cx="0" cy="-2.6" rx="7" ry="1.6" fill="#f2efe8"/>`;
  for (let i = 0; i < 6; i++) k += `<path d="M${r(-5.6 + i * 2)} -3 a1.2 1 0 0 1 2.2 0 Z" fill="#d8322a"/>`;
  for (let i = 0; i < 5; i++) k += `<ellipse cx="${r(-5 + i * 2.4)}" cy="-3.4" rx="1" ry=".55" fill="#a8cf6a" stroke="#4f8a2a" stroke-width=".25"/>`;
  k += `<path d="M-5 -3.8 q1 -.8 2 0 M2 -3.6 q1 -.8 2 0" stroke="#b56cc0" stroke-width=".35" fill="none"/>`;
  k += `<path d="M-1 -3.4 q1 -.6 2 0" stroke="#4f9a3a" stroke-width=".6" fill="none"/>`;
  for (const [x, y] of [[-4, -4.2], [3.6, -4.4], [5, -3.2]]) k += `<ellipse cx="${x}" cy="${y}" rx=".75" ry=".55" fill="#3b1e2e"/>`;
  k += `<path d="M-3 -4 L3 -4 L2.6 -6.6 L-2.6 -6.6 Z" fill="${S.lg("feta", [[0, "#fffefa"], [1, "#ebe7dc"]])}"/>`;
  for (let i = 0; i < 6; i++) k += `<circle cx="${r(-2.2 + rnd() * 4.4)}" cy="${r(-6.4 + rnd() * 0.6)}" r=".2" fill="#6a7a3a"/>`;
  S.teil({ oben: true, id: "feta", de: "der Salat", syl: "Sa-LAT", it: "l'insalata", itSyl: "in-sa-LA-ta", en: "salad", x: TISCH.x + 10, y: r(PL + 0.4), steht: true, kunst: `<g transform="scale(${r(ES * 100) / 100})">` + k + flaeche(-7.2, -7.2, 14.4, 9) + "</g>",
    tipp: "Der griechische Bauernsalat: Tomaten, Gurke, Zwiebeln, Oliven und oben ein Stück Feta-Käse." });
}
{
  /* DIE OLIVE: Schälchen mit Kalamata-Oliven */
  let k = `<path d="M-3.6 -1.4 Q-3.2 .8 0 .9 Q3.2 .8 3.6 -1.4 Z" fill="${S.lg("schaelchen", [[0, "#2f74b5"], [1, "#1b4f86"]])}"/><ellipse cx="0" cy="-1.4" rx="3.6" ry=".9" fill="#d8e6f2"/>`;
  for (const [x, y] of [[-1.8, -1.9], [0, -2.2], [1.8, -1.9], [-.9, -2.9], [.9, -2.9]]) k += `<ellipse cx="${x}" cy="${y}" rx="1" ry=".72" fill="${S.rg("kalamata", [[0, "#7a3a5c"], [1, "#2a0f1e"]], 0.35, 0.3, 0.8)}"/><circle cx="${r(x - 0.3)}" cy="${r(y - 0.25)}" r=".2" fill="#fff" opacity=".5"/>`;
  S.teil({ oben: true, id: "olive", de: "die Olive", syl: "O-LI-ve", it: "l'oliva", itSyl: "o-LI-va", en: "olive", x: TISCH.x + 2, y: r(T_HINTEN + 1.6), steht: true, kunst: `<g transform="scale(${r(ES * 100) / 100})">` + k + flaeche(-4, -4.6, 8, 5.8) + "</g>",
    tipp: "Griechenland hat über 150 Millionen Olivenbäume." });
}
{
  /* DAS OLIVENÖL in der Glasflasche */
  const u = TU;
  let k = `<ellipse cx="0" cy="0" rx="2.4" ry=".6" fill="#000" opacity=".15"/>`;
  k += `<path d="M-2 0 L-2 ${r(-0.13 * u)} Q-2 ${r(-0.17 * u)} -.7 ${r(-0.19 * u)} L-.7 ${r(-0.24 * u)} L.7 ${r(-0.24 * u)} L.7 ${r(-0.19 * u)} Q2 ${r(-0.17 * u)} 2 ${r(-0.13 * u)} L2 0 Z" fill="${S.lg("oel", [[0, "#c9b23a"], [0.5, "#e6cf55"], [1, "#9a8a22"]], 0, 0, 1, 0)}" opacity=".95"/>`;
  k += `<rect x="-.8" y="${r(-0.27 * u)}" width="1.6" height="1.6" rx=".3" fill="#2a2a2a"/>`;
  k += `<rect x="-1.8" y="${r(-0.1 * u)}" width="3.6" height="2.6" fill="#f3eee0"/><path d="M-1 ${r(-0.1 * u + 1.4)} q.5 -.8 1 0 q.5 .8 1 0" stroke="#4f7a2a" stroke-width=".3" fill="none"/>`;
  k += `<rect x="-1.5" y="${r(-0.17 * u)}" width=".5" height="${r(0.15 * u)}" fill="#fff" opacity=".4"/>`;
  S.teil({ oben: true, id: "olivenoel", de: "das Olivenöl", syl: "O-LI-ven-öl", it: "l'olio d'oliva", itSyl: "O-lio d'o-LI-va", en: "olive oil", x: TISCH.x - 15, y: r(T_HINTEN + 1), steht: true, kunst: k + flaeche(-2.6, -0.28 * u, 5.2, 0.28 * u + 0.8),
    tipp: "Griechen essen mehr Olivenöl als jedes andere Volk – über 12 Liter pro Person im Jahr." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/griechenland.js"));
console.log(aus);
