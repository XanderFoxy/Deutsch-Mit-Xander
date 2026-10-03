#!/usr/bin/env node
/* =====================================================================
   LEIPZIG (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   STANDORT: Aussichtsplattform des Panorama Tower (City-Hochhaus,
   „Uniriese“, 142 m, Plattform in 120 m Höhe) am Augustusplatz.
   Blick nach Süden über die Innenstadt.

   RECHERCHE (Stadt Leipzig, ADAC-Reiseführer, Panorama Tower):
   - Von der Plattform sieht man direkt unten das GEWANDHAUS (1981) mit
     seiner gläsernen, vieleckig vorspringenden Foyerfront zum
     Augustusplatz; durch das Glas leuchtet das riesige Deckengemälde
     „Gesang vom Leben“ (Sighard Gille). Davor steht der MENDEBRUNNEN
     (1886): ein schlanker Obelisk über einem Becken mit Bronzefiguren.
   - Über den Ring fahren die STRASSENBAHNEN der LVB (lange,
     niederflurige Wagen, weiß mit blauem Band).
   - Im Südwesten ragt der Turm des NEUEN RATHAUSES (114,7 m) auf, fast so
     hoch wie die Plattform: schlanker Schaft, Uhr, Galerie mit
     Ecktürmchen, grüne Kupferhaube.
   - Im Westen die THOMASKIRCHE (Bachs Kirche): langes Schiff mit einem der
     steilsten Dächer Deutschlands, Westturm mit achteckigem Aufsatz,
     Galerie und grüner Haube mit Laterne.
   - Am Horizont im Südosten das VÖLKERSCHLACHTDENKMAL (91 m, Granit-
     porphyr): breiter Sockel, Steinblock mit Erzengel-Relief, darüber
     die Kuppel mit dem Ring der zwölf „Freiheitswächter“; davor der
     „See der Tränen“ (Wasserbecken).
   - Ganz hinten die Seen des Leipziger Neuseenlands (frühere
     Braunkohle-Tagebaue), dazu viele Baukräne: die Stadt wächst.
   - Auf der Plattform: Glasgeländer mit Handlauf, Münzfernrohr und eine
     Panoramatafel, die zeigt, was man sieht; Leipzig wirbt als
     Musikstadt (Bach, Mendelssohn, Gewandhausorchester, „Notenspur“).
   Maßstab: Plattform vorne ≈ 13 Einheiten je Meter (Geländer 1,1 m,
   Besucherin 1,66 m); die Stadt verkleinert sich zum Horizont (y 60).
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "leipzig", titel: "Leipzig", emoji: "🎼", thema: "Deutschland", kuerzel: "lpz", fassung: 852 });
const rnd = zufall(1813);
const r = B.r;

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const HORIZ = 60;
const STEIN = S.lg("stein", [[0, "#efe6d4"], [1, "#cbbd9f"]]);
const STEIN_V = S.lg("steinv", [[0, "#d9ccb1"], [0.5, "#f1e9d8"], [1, "#c3b495"]], 0, 0, 1, 0);
const KUPFER = S.lg("kupfer", [[0, "#8fc4ab"], [0.5, "#5f9f86"], [1, "#3f7663"]], 0, 0, 1, 0);
const SCHIEFER = S.lg("schiefer", [[0, "#6b707a"], [1, "#4a4e57"]]);
const PORPHYR = S.lg("porphyr", [[0, "#9a8e80"], [0.5, "#b4a898"], [1, "#7c7166"]], 0, 0, 1, 0);
const GLAS = S.lg("glas", [[0, "#ffffff", 0.0], [0.5, "#e8f4fa", 0.1], [1, "#ffffff", 0.22]], 0, 0, 1, 1);
const STAHL = S.lg("stahl", [[0, "#f2f4f6"], [0.5, "#b9c1c8"], [1, "#dfe4e8"]], 0, 0, 0, 1);

/* =====================================================================
   KULISSE — Himmel, Land am Horizont, Dächermeer
   ===================================================================== */
S.hinten(`<rect width="320" height="${HORIZ + 4}" fill="${S.lg("himmel", [[0, "#79a9d6"], [0.7, "#bcd5ea"], [1, "#e6eef2"]])}"/>`);
S.hinten(`<g opacity=".8"><ellipse cx="60" cy="16" rx="30" ry="4" fill="#fff"/><ellipse cx="80" cy="13" rx="14" ry="4" fill="#fff"/><ellipse cx="236" cy="22" rx="36" ry="3.5" fill="#fff" opacity=".8"/><ellipse cx="258" cy="19" rx="15" ry="3.6" fill="#fff"/><ellipse cx="160" cy="40" rx="40" ry="2.2" fill="#fff" opacity=".55"/></g>`);
/* flaches Land, Wald und Dunst am Horizont */
S.hinten(`<rect y="${HORIZ}" width="320" height="30" fill="${S.lg("land", [[0, "#b7c6c2"], [0.3, "#9fb3a3"], [1, "#8a9c86"]])}"/>`);
{
  let w = "";
  for (let x = -4; x < 324; x += 3 + rnd() * 3) w += `<ellipse cx="${r(x)}" cy="${r(HORIZ + 2 + rnd() * 1.5)}" rx="${r(2 + rnd() * 2.5)}" ry="${r(1 + rnd())}" fill="${rnd() < 0.5 ? "#7f9583" : "#8ea08f"}" opacity=".8"/>`;
  S.hinten(w);
}
/* Dächermeer: Reihen von Häusern, hinten klein und dunstig, vorne größer */
{
  const fassaden = ["#e6d6b8", "#d9c3a0", "#ead9c6", "#cbb89e", "#e2c9b3", "#d6cfc3", "#c9b28f", "#efe3cf", "#bfb8ae"];
  const daecher = ["#9a5a43", "#8a4f3b", "#6e6f75", "#5e636b", "#a86a4e", "#7b8088", "#8d5a46"];
  let g = `<rect y="${HORIZ + 4}" width="320" height="${170 - HORIZ}" fill="${S.lg("stadtgrund", [[0, "#a9a39a"], [1, "#8e8579"]])}"/>`;
  let y = HORIZ + 5;
  while (y < 166) {
    const s = 0.22 + (y - HORIZ) / 58;              /* Größe je Reihe */
    let x = -6 - rnd() * 6;
    while (x < 326) {
      const w = (7 + rnd() * 9) * s, h = (3 + rnd() * 3.5) * s, dach = (2.2 + rnd() * 2.2) * s;
      const flach = rnd() < 0.25;
      const f = fassaden[Math.floor(rnd() * fassaden.length)];
      g += `<rect x="${r(x)}" y="${r(y - h)}" width="${r(w)}" height="${r(h + 0.4)}" fill="${f}"/>`;
      if (s > 0.6) g += `<rect x="${r(x)}" y="${r(y - h)}" width="${r(w)}" height="${r(h)}" fill="url(#lpz_fenster)"/>`;
      if (flach) g += `<rect x="${r(x - 0.2)}" y="${r(y - h - dach * 0.5)}" width="${r(w + 0.4)}" height="${r(dach * 0.5)}" fill="#a3a19c"/>`;
      else g += `<path d="M${r(x - 0.3)} ${r(y - h)} L${r(x + w * 0.12)} ${r(y - h - dach)} L${r(x + w * 0.88)} ${r(y - h - dach)} L${r(x + w + 0.3)} ${r(y - h)} Z" fill="${daecher[Math.floor(rnd() * daecher.length)]}"/>`;
      x += w + rnd() * 1.5 * s;
    }
    y += 2.2 + (y - HORIZ) * 0.085;
  }
  S.def(`<pattern id="lpz_fenster" width="2.4" height="2.2" patternUnits="userSpaceOnUse"><rect x=".6" y=".5" width="1" height="1.1" fill="#4c5560" opacity=".55"/></pattern>`);
  /* Dunst über dem Dächermeer: hinten stark, vorne klar */
  g += `<rect y="${HORIZ}" width="320" height="70" fill="${S.lg("dunst", [[0, "#dfe8ee", 0.75], [0.45, "#dfe8ee", 0.25], [1, "#dfe8ee", 0]])}"/>`;
  S.hinten(g);
}
/* Straße (Ring) vorne mit Gleisen, Gehweg, Platz vor dem Gewandhaus */
const STRASSE = { y0: 160, y1: 176 };
S.hinten(`<path d="M0 ${STRASSE.y0} L320 ${STRASSE.y0 - 6} L320 ${STRASSE.y1} L0 ${STRASSE.y1} Z" fill="${S.lg("asphalt", [[0, "#6d6b68"], [1, "#575552"]])}"/>
<path d="M0 ${STRASSE.y0 + 5} L320 ${STRASSE.y0 - 0.5}" stroke="#a6a29b" stroke-width=".35"/><path d="M0 ${STRASSE.y0 + 7.4} L320 ${STRASSE.y0 + 1.8}" stroke="#a6a29b" stroke-width=".35"/>
<path d="M0 ${STRASSE.y0 + 10} L320 ${STRASSE.y0 + 5}" stroke="#eee" stroke-width=".4" stroke-dasharray="4 4"/>
<path d="M0 ${STRASSE.y0} L320 ${STRASSE.y0 - 6}" stroke="#c9c3b8" stroke-width="1.2"/>`);
/* Platz (Augustusplatz) links vorne: helle Granitplatten */
S.hinten(`<path d="M0 132 L150 128 L150 ${STRASSE.y0 - 2.8} L0 ${STRASSE.y0}" fill="${S.lg("platz", [[0, "#c9c4bb"], [1, "#b5afa4"]])}"/>`);
{
  let p = "";
  for (let i = 0; i < 10; i++) p += `<line x1="0" y1="${r(134 + i * 2.6)}" x2="150" y2="${r(130 + i * 2.75)}" stroke="#a49d92" stroke-width=".25"/>`;
  for (let i = 0; i < 16; i++) p += `<line x1="${r(i * 10)}" y1="${r(132 - i * 0.26)}" x2="${r(i * 10 - 3)}" y2="${r(STRASSE.y0 - i * 0.18)}" stroke="#a49d92" stroke-width=".25"/>`;
  S.hinten(p);
}

/* =====================================================================
   1 — DER SEE (Neuseenland am Horizont)
   ===================================================================== */
{
  let k = `<path d="M-30 0 Q-28 -2.6 -8 -3 L22 -3.2 Q32 -2.4 30 0 Q20 1.6 0 1.6 Q-22 1.6 -30 0 Z" fill="${S.lg("see", [[0, "#e4f1f8"], [1, "#8db8d2"]])}" stroke="#7fa6bf" stroke-width=".3"/>`;
  k += `<path d="M-20 -1.4 L18 -1.8" stroke="#fff" stroke-width=".5" opacity=".8"/><path d="M-6 -.2 L10 -.4" stroke="#fff" stroke-width=".35" opacity=".7"/>`;
  k += flaeche(-30, -4, 60, 6);
  S.teil({ id: "see", de: "der See", syl: "SEE", it: "il lago", itSyl: "LA-go", en: "lake", x: 262, y: HORIZ + 2.6, kunst: k,
    tipp: "Im Süden von Leipzig waren früher Braunkohle-Gruben. Heute sind dort Seen zum Baden." });
}

/* =====================================================================
   2 — DAS VÖLKERSCHLACHTDENKMAL (Horizont, Südosten)
   ===================================================================== */
{
  let k = schatten(0, 0.5, 26, 2, 0.25);
  /* Bäume des Parks rundherum */
  for (let i = 0; i < 12; i++) k += `<ellipse cx="${r(-26 + i * 4.6 + rnd() * 2)}" cy="${r(-1.5 - rnd() * 1.5)}" rx="${r(2.6 + rnd() * 1.2)}" ry="${r(2.2 + rnd())}" fill="${rnd() < 0.5 ? "#5f7a55" : "#6f8a62"}"/>`;
  /* Wasserbecken „See der Tränen“ davor */
  k += `<rect x="-12" y="-1.2" width="24" height="1.4" rx=".5" fill="#a9c6d4"/>`;
  /* Terrassen und Sockel */
  k += `<path d="M-17 -1.4 L17 -1.4 L15.5 -3.6 L-15.5 -3.6 Z" fill="#9b9084"/>`;
  /* unterer Block mit leicht geböschten Wänden */
  k += `<path d="M-13.4 -3.6 L13.4 -3.6 L12.6 -15 L-12.6 -15 Z" fill="${PORPHYR}"/>`;
  /* Erzengel Michael im Bogenfeld */
  k += `<path d="M-4.6 -3.6 L-4.6 -10.6 Q0 -14 4.6 -10.6 L4.6 -3.6 Z" fill="#776c61"/><path d="M-.9 -4.2 L-.6 -9.6 L.6 -9.6 L.9 -4.2 Z" fill="#5d544b"/><circle cx="0" cy="-10.3" r=".7" fill="#5d544b"/><path d="M-.6 -9 Q-3.4 -11.6 -3.8 -7.6 Q-2.4 -8.6 -.6 -7.8 Z M.6 -9 Q3.4 -11.6 3.8 -7.6 Q2.4 -8.6 .6 -7.8 Z" fill="#5d544b"/><line x1="1.4" y1="-12.4" x2="-1.6" y2="-4.4" stroke="#4d453d" stroke-width=".35"/>`;
  k += `<path d="M-12.6 -15 L-11.8 -3.6 M12.6 -15 L11.8 -3.6 M-8 -15 L-8 -3.6 M8 -15 L8 -3.6" stroke="#6f655b" stroke-width=".4"/>`;
  /* Gesims und oberer, schmalerer Körper mit Rippen */
  k += `<rect x="-13.6" y="-16.4" width="27.2" height="1.6" fill="#8a7f73"/>`;
  k += `<path d="M-10.6 -16.4 L10.6 -16.4 L9 -26 L-9 -26 Z" fill="${PORPHYR}"/>`;
  for (const x of [-6.6, -3.3, 0, 3.3, 6.6]) k += `<line x1="${x}" y1="-16.4" x2="${r(x * 0.86)}" y2="-26" stroke="#6f655b" stroke-width=".35"/>`;
  /* flache Rippenkuppel mit Plattform */
  k += `<path d="M-8 -30.6 Q-7.6 -36.2 -3 -37.2 L3 -37.2 Q7.6 -36.2 8 -30.6 Z" fill="${PORPHYR}"/>`;
  for (const x of [-4.6, -1.6, 1.6, 4.6]) k += `<path d="M${x} -31 Q${r(x * 0.8)} -35 ${r(x * 0.6)} -37" stroke="#6f655b" stroke-width=".3" fill="none"/>`;
  k += `<rect x="-3.4" y="-38" width="6.8" height="1" fill="#8a7f73"/>`;
  /* vorspringender Kranz mit den Freiheitswächtern */
  k += `<rect x="-11.4" y="-27.2" width="22.8" height="1.4" fill="#8a7f73"/>`;
  for (let i = 0; i < 7; i++) {
    const x = -9.6 + i * 3.2;
    k += `<path d="M${r(x - 0.9)} -27.2 L${r(x - 1)} -31 L${r(x - 0.5)} -32.2 L${r(x + 0.5)} -32.2 L${r(x + 1)} -31 L${r(x + 0.9)} -27.2 Z" fill="#82776b"/><circle cx="${r(x)}" cy="-33" r=".75" fill="#82776b"/>`;
  }
  k += `<path d="M-12 -14 L-11.2 -4.6" stroke="#d2c7b8" stroke-width=".6" opacity=".55"/>`;
  /* Dunst der Entfernung */
  k += `<path d="M-13.4 -3.6 L13.4 -3.6 L12.6 -15 L13.6 -15 L13.6 -16.4 L10.6 -16.4 L9 -26 L11.4 -26 L11.4 -27.2 L10.6 -27.2 L10.6 -32 L8 -32 Q7.6 -36.2 3 -37.2 L-3 -37.2 Q-7.6 -36.2 -8 -32 L-10.6 -32 L-10.6 -27.2 L-11.4 -27.2 L-11.4 -26 L-9 -26 L-10.6 -16.4 L-13.6 -16.4 L-13.6 -15 L-12.6 -15 Z" fill="#dfe8ee" opacity=".2"/>`;
  S.teil({ id: "denkmal", de: "das Völkerschlachtdenkmal", syl: "VÖL-ker-schlacht-denk-mal", it: "il monumento alla Battaglia delle Nazioni", itSyl: "mo-nu-MEN-to al-la bat-TA-glia", en: "Monument to the Battle of the Nations",
    x: 70, y: 67, steht: true, kunst: `<g transform="scale(.92 .78)">${k}</g>`,
    tipp: "Es erinnert an die Völkerschlacht von 1813 und ist 91 Meter hoch. Oben stehen zwölf steinerne Wächter." });
}

/* =====================================================================
   3 — DER PARK (Clara-Zetkin-Park, Südwesten)
   ===================================================================== */
{
  let k = `<path d="M-46 0 Q-40 -9 -20 -10 Q10 -12 30 -9 Q46 -7 50 0 Z" fill="${S.lg("wiese", [[0, "#93ad7c"], [1, "#7f9a69"]])}"/>`;
  for (let i = 0; i < 30; i++) {
    const x = -42 + rnd() * 88, y = -2 - rnd() * 8;
    k += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(2.2 + rnd() * 2)}" ry="${r(1.8 + rnd() * 1.2)}" fill="${["#5c7b4b", "#6d8c58", "#4f6d42", "#7b9a63"][Math.floor(rnd() * 4)]}"/>`;
  }
  k += `<path d="M-30 -3 Q0 -6 40 -2" stroke="#d8d0bd" stroke-width=".6" fill="none" opacity=".8"/>`;
  k += `<rect x="-46" y="-12" width="96" height="12" fill="#dfe8ee" opacity=".25"/>`;
  S.teil({ id: "park", de: "der Park", syl: "PARK", it: "il parco", itSyl: "PAR-co", en: "park", x: 262, y: 84, kunst: k,
    tipp: "Leipzig ist sehr grün: Mitten durch die Stadt zieht sich ein großer Auwald." });
}

/* =====================================================================
   4 — DER KRAN (Baustelle in der Südvorstadt)
   ===================================================================== */
{
  let k = "";
  /* Mast als Gitter */
  k += `<rect x="-1.1" y="-50" width="2.2" height="50" fill="none" stroke="#e8b923" stroke-width=".6"/>`;
  for (let y = -48; y < 0; y += 3) k += `<path d="M-1.1 ${y} L1.1 ${y + 3} M1.1 ${y} L-1.1 ${y + 3}" stroke="#d9a91a" stroke-width=".3"/>`;
  /* Ausleger und Gegenausleger */
  k += `<path d="M-14 -50 L44 -50 L44 -48.8 L-14 -48.8 Z" fill="none" stroke="#e8b923" stroke-width=".5"/>`;
  for (let x = -14; x < 44; x += 2.6) k += `<path d="M${x} -48.8 L${x + 1.3} -50 L${x + 2.6} -48.8" stroke="#d9a91a" stroke-width=".25" fill="none"/>`;
  k += `<path d="M0 -55 L-14 -50 M0 -55 L44 -50" stroke="#555" stroke-width=".25"/><path d="M-1 -55 L1 -55 L1.1 -50 L-1.1 -50 Z" fill="#e8b923"/>`;
  k += `<rect x="-14" y="-50" width="6" height="3.4" fill="#8f9399"/>`;
  k += `<rect x="1.2" y="-48.6" width="3" height="2.6" rx=".4" fill="#f0c43a"/><rect x="2" y="-48" width="1.6" height="1.2" fill="#9cc7dc"/>`;
  /* Haken mit Last */
  k += `<line x1="30" y1="-48.8" x2="30" y2="-30" stroke="#444" stroke-width=".25"/><path d="M29.4 -30 q.6 1.2 1.2 0" stroke="#444" stroke-width=".3" fill="none"/><rect x="27" y="-29" width="6" height="2" fill="#8d8d8d"/>`;
  /* Rohbau am Fuß */
  k += `<rect x="-10" y="-9" width="20" height="9" fill="#bcb7ae"/><path d="M-10 -6 h20 M-10 -3 h20" stroke="#8f8a82" stroke-width=".5"/>`;
  for (let x = -9; x < 10; x += 3) k += `<rect x="${x}" y="-8.4" width="1.8" height="1.6" fill="#55595f"/><rect x="${x}" y="-5.2" width="1.8" height="1.6" fill="#55595f"/>`;
  k += flaeche(-14, -56, 58, 8) + flaeche(-3, -50, 6, 50);
  S.teil({ oben: true, id: "kran", de: "der Kran", syl: "KRAN", it: "la gru", itSyl: "GRU", en: "crane", x: 146, y: 116, steht: true, kunst: k,
    tipp: "Leipzig wächst: Überall in der Stadt wird gebaut." });
}

/* =====================================================================
   5 — DAS NEUE RATHAUS (Südwesten) mit dem höchsten Rathausturm
   ===================================================================== */
{
  let k = schatten(0, 0.5, 30, 2, 0.25);
  /* Gebäudeflügel mit steilen Dächern */
  k += `<rect x="-28" y="-14" width="56" height="14" fill="${STEIN}"/>`;
  k += `<path d="M-30 -14 L-26 -21 L26 -21 L30 -14 Z" fill="${SCHIEFER}"/>`;
  for (let i = 0; i < 9; i++) k += `<path d="M${-25 + i * 6} -17.6 l1.2 -1.6 l1.2 1.6 Z" fill="#e7dcc6"/>`;
  for (let row = 0; row < 3; row++) for (let i = 0; i < 13; i++) k += `<rect x="${r(-26.5 + i * 4.2)}" y="${-12.2 + row * 4}" width="1.8" height="2.4" rx=".6" fill="#5b6470"/>`;
  /* Eckpavillons mit Haube */
  for (const sx of [-1, 1]) {
    k += `<rect x="${sx < 0 ? -32 : 24}" y="-19" width="8" height="19" fill="${STEIN_V}"/><path d="M${sx < 0 ? -33 : 23} -19 L${sx < 0 ? -28 : 28} -26 L${sx < 0 ? -23 : 33} -19 Z" fill="${KUPFER}"/>`;
  }
  /* Turm */
  k += `<rect x="-4.5" y="-60" width="9" height="46" fill="${STEIN_V}"/>`;
  for (let y = -54; y < -18; y += 6) k += `<rect x="-1" y="${y}" width="2" height="3" rx=".8" fill="#5b6470"/>`;
  k += `<path d="M-4.5 -20 h9 M-4.5 -40 h9" stroke="#b9a988" stroke-width=".5"/>`;
  /* Uhrgeschoss */
  k += `<rect x="-5.5" y="-66" width="11" height="7" fill="#e9dfca"/><circle cx="0" cy="-62.5" r="2.6" fill="#f7f1e2" stroke="#3a3a3a" stroke-width=".35"/><path d="M0 -62.5 L0 -64.4 M0 -62.5 L1.3 -62" stroke="#222" stroke-width=".35"/>`;
  /* Galerie mit Ecktürmchen */
  k += `<rect x="-6.2" y="-68" width="12.4" height="2" fill="#cdbf9f"/>`;
  for (const x of [-5.6, 4.2]) k += `<rect x="${x}" y="-72" width="1.4" height="4" fill="#e9dfca"/><path d="M${x - 0.3} -72 L${x + 0.7} -74.4 L${x + 1.7} -72 Z" fill="${KUPFER}"/>`;
  /* Kupferhaube mit Laterne */
  k += `<path d="M-4.2 -68 Q-4.6 -73 0 -76.5 Q4.6 -73 4.2 -68 Z" fill="${KUPFER}"/><rect x="-1" y="-79" width="2" height="2.6" fill="#e9dfca"/><path d="M-1.4 -79 L0 -81.6 L1.4 -79 Z" fill="${KUPFER}"/><line x1="0" y1="-81.6" x2="0" y2="-83.4" stroke="#7a6a3a" stroke-width=".35"/>`;
  k += `<path d="M-4.5 -60 L-2.6 -60 L-2.6 -14 L-4.5 -14 Z" fill="#fff" opacity=".18"/>`;
  S.teil({ id: "neues_rathaus", de: "das Neue Rathaus", syl: "NEU-e RAT-haus", it: "il nuovo municipio", itSyl: "NUO-vo mu-ni-CI-pio", en: "New Town Hall", x: 214, y: 112, steht: true, kunst: k,
    tipp: "Sein Turm ist 114,7 Meter hoch — der höchste Rathausturm Deutschlands." });
}

/* =====================================================================
   6 — DIE THOMASKIRCHE (Westen) — Bachs Kirche
   ===================================================================== */
{
  let k = schatten(-10, 0.5, 30, 2, 0.25);
  /* Langhaus mit sehr steilem Dach */
  k += `<rect x="-40" y="-12" width="38" height="12" fill="${STEIN}"/>`;
  for (let i = 0; i < 6; i++) k += `<path d="M${-37 + i * 6} -2 L${-37 + i * 6} -8 Q${-36 + i * 6} -10.4 ${-35 + i * 6} -8 L${-35 + i * 6} -2 Z" fill="#6c7a88"/>`;
  k += `<path d="M-42 -12 L-34 -30 L-4 -30 L-2 -12 Z" fill="${S.lg("kirchdach", [[0, "#7a7f86"], [1, "#565b62"]])}"/>`;
  k += `<path d="M-41 -12 L-33.6 -29" stroke="#8d939a" stroke-width=".5"/>`;
  /* Chor im Osten (links) mit Strebepfeilern */
  for (let i = 0; i < 6; i++) k += `<rect x="${-39 + i * 6.6}" y="-12.6" width="1.2" height="12.6" fill="#c8b994"/>`;
  /* Westturm: Steinschaft, achteckiger Aufsatz, Galerie, Haube */
  k += `<rect x="-3" y="-34" width="10" height="34" fill="${STEIN_V}"/>`;
  k += `<rect x="0.6" y="-26" width="2.8" height="5" rx="1.4" fill="#5d6874"/><rect x="0.6" y="-14" width="2.8" height="6" rx="1.4" fill="#5d6874"/>`;
  k += `<rect x="-1.8" y="-44" width="7.6" height="10" fill="#f4eee0"/>`;
  k += `<rect x="-0.6" y="-42.4" width="1.4" height="4.6" rx=".7" fill="#4d5866"/><rect x="2.8" y="-42.4" width="1.4" height="4.6" rx=".7" fill="#4d5866"/>`;
  k += `<rect x="-2.6" y="-45.6" width="9.2" height="1.6" fill="#c6b48c"/>`;
  k += `<path d="M-1.6 -45.6 Q-2.2 -50 2 -52.4 Q6.2 -50 5.6 -45.6 Z" fill="${KUPFER}"/>`;
  k += `<rect x="0.8" y="-55.6" width="2.4" height="3.4" fill="#f4eee0"/><path d="M0.4 -55.6 Q2 -59 3.6 -55.6 Z" fill="${KUPFER}"/><line x1="2" y1="-58.6" x2="2" y2="-61" stroke="#8d7a3a" stroke-width=".35"/>`;
  k += `<path d="M-3 -34 L-1.4 -34 L-1.4 0 L-3 0 Z" fill="#fff" opacity=".2"/>`;
  S.teil({ id: "thomaskirche", de: "die Thomaskirche", syl: "TO-mas-kir-che", it: "la chiesa di San Tommaso", itSyl: "CHIE-sa di san tom-MA-so", en: "St Thomas Church", x: 300, y: 118, steht: true, kunst: k,
    tipp: "Johann Sebastian Bach war hier 27 Jahre lang Thomaskantor. Hier singt der Thomanerchor." });
}

/* =====================================================================
   7 — DAS GEWANDHAUS (unten links, am Augustusplatz)
   ===================================================================== */
const GW = { x: 66, y: 146 };
{
  let k = schatten(0, 0.6, 58, 2.6, 0.3);
  /* Saalbau (hinten, aufsteigend) */
  k += `<path d="M-50 -26 L-36 -42 L36 -42 L50 -26 Z" fill="${S.lg("saaldach", [[0, "#c5bba9"], [1, "#a69c8a"]])}"/>`;
  k += `<path d="M-36 -42 L36 -42 L32 -46 L-32 -46 Z" fill="#d8cfbe"/>`;
  /* geschlossene Seitenteile mit Steinplatten */
  k += `<rect x="-56" y="-28" width="112" height="28" fill="${S.lg("gwstein", [[0, "#e4dccb"], [1, "#c9bea7"]])}"/>`;
  for (let i = 0; i < 6; i++) k += `<line x1="-56" y1="${-24 + i * 4}" x2="56" y2="${-24 + i * 4}" stroke="#b9ad95" stroke-width=".3"/>`;
  /* gläserne Foyerfront, vieleckig vorspringend */
  const front = "M-32 0 L-32 -30 L-18 -36 L18 -36 L32 -30 L32 0 Z";
  k += `<path d="${front}" fill="${S.lg("foyer", [[0, "#2c3a4a"], [1, "#3f5266"]])}"/>`;
  /* Deckengemälde „Gesang vom Leben“ leuchtet durch das Glas */
  k += `<path d="M-28 -24 Q-20 -33 -6 -31 Q10 -34 26 -26 L26 -20 Q8 -26 -6 -22 Q-18 -20 -28 -18 Z" fill="${S.lg("gemaelde", [[0, "#d8603a"], [0.35, "#f1b84a"], [0.65, "#4a8ec4"], [1, "#b8423a"]], 0, 0, 1, 0)}" opacity=".9"/>`;
  k += `<path d="M-22 -26 q4 -3 8 0 q4 -3 8 0 M4 -27 q3 -3 7 -1 q4 2 8 -1" stroke="#2c3a4a" stroke-width=".5" fill="none" opacity=".6"/>`;
  /* Geschossdecken und Pfosten */
  for (const y of [-18, -10]) k += `<line x1="-32" y1="${y}" x2="32" y2="${y}" stroke="#d5d9dc" stroke-width=".7"/>`;
  for (const x of [-32, -25, -18, -9, 0, 9, 18, 25, 32]) k += `<line x1="${x}" y1="${x === -18 || x === 18 ? -36 : x === -25 || x === 25 ? -33 : x === -32 || x === 32 ? -30 : -36}" x2="${x}" y2="0" stroke="#cfd5da" stroke-width=".45"/>`;
  /* warmes Licht der Foyerlampen, Treppen */
  for (let i = 0; i < 7; i++) k += `<circle cx="${-24 + i * 8}" cy="-14" r=".7" fill="#ffe7a8"/>`;
  k += `<path d="M-14 -2 L-6 -9 M14 -2 L6 -9" stroke="#b6bdc4" stroke-width=".8"/>`;
  k += `<path d="M-32 -30 L-18 -36 L-12 -36 L-28 0 L-32 0 Z" fill="#fff" opacity=".12"/>`;
  k += `<text x="44" y="-14" font-size="3.2" text-anchor="middle" fill="#5f5646" font-family="Arial,sans-serif" letter-spacing=".5">GEWANDHAUS</text>`;
  /* Stufen vor dem Eingang */
  k += `<rect x="-34" y="-1.2" width="68" height="1.6" fill="#d8d2c7"/>`;
  S.teil({ id: "gewandhaus", de: "das Gewandhaus", syl: "Ge-WAND-haus", it: "la sala da concerto", itSyl: "SA-la da con-CER-to", en: "concert hall", x: GW.x, y: GW.y, steht: true, kunst: k,
    tipp: "Das Konzerthaus des Gewandhausorchesters. Hinter dem Glas sieht man ein riesiges Deckengemälde." });
}

/* =====================================================================
   8 — DER BRUNNEN (Mendebrunnen vor dem Gewandhaus)
   ===================================================================== */
{
  let k = schatten(0, 0.4, 12, 1.6, 0.3);
  k += `<ellipse cx="0" cy="-1.2" rx="11" ry="2.6" fill="#b8b0a2"/><ellipse cx="0" cy="-1.8" rx="9.6" ry="1.9" fill="${S.lg("wasser", [[0, "#9cc3d6"], [1, "#6f9db4"]])}"/>`;
  k += `<path d="M-6 -1.8 q6 .9 12 0" stroke="#fff" stroke-width=".35" opacity=".7" fill="none"/>`;
  /* Sockel mit Bronzefiguren */
  k += `<path d="M-4 -2 L4 -2 L3.4 -8 L-3.4 -8 Z" fill="#a69c8b"/>`;
  for (const [x, s] of [[-4.6, 1], [4.6, -1]]) k += `<path d="M${x} -2.4 q${s * -1.6} -2 ${s * -0.6} -4.6 l${s * 0.8} -.6 l${s * 0.6} 1.2 q${s * -0.2} 2 ${s * 0.6} 4 Z" fill="#5d6a5c"/><circle cx="${r(x - s * 0.4)}" cy="-7.8" r=".7" fill="#5d6a5c"/>`;
  /* Obelisk mit Spitze */
  k += `<path d="M-1.9 -8 L1.9 -8 L1.2 -25 L-1.2 -25 Z" fill="${S.lg("obelisk", [[0, "#d7cdbb"], [1, "#a99d88"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-1.2 -25 L0 -27.6 L1.2 -25 Z" fill="#bfb39d"/><circle cx="0" cy="-28.2" r=".7" fill="#c9a640"/>`;
  k += `<path d="M-1 -12 h2 M-.9 -18 h1.8" stroke="#8c816f" stroke-width=".35"/>`;
  /* Wasserstrahlen */
  k += `<path d="M-2.6 -6.4 q-3 1 -4.6 4 M2.6 -6.4 q3 1 4.6 4" stroke="#e4f2f8" stroke-width=".5" fill="none" opacity=".9"/>`;
  S.teil({ id: "brunnen", de: "der Brunnen", syl: "BRUN-nen", it: "la fontana", itSyl: "fon-TA-na", en: "fountain", x: 140, y: 156, steht: true, kunst: k,
    tipp: "Der Mendebrunnen ist der schönste Brunnen am Augustusplatz." });
}

/* =====================================================================
   9 — DER BAUM (Linde am Ring)
   ===================================================================== */
const baum = (s) => {
  let g = schatten(0, 0.3, 5 * s, 1, 0.3);
  g += `<rect x="${r(-0.5 * s)}" y="${r(-6 * s)}" width="${r(s)}" height="${r(6 * s)}" fill="#5a4330"/>`;
  for (const [dx, dy, rr, f] of [[0, -9, 5, "#4f7a3f"], [-3, -8, 3.4, "#5c8a49"], [3, -8.4, 3.6, "#46703a"], [0, -12, 3.6, "#6a9a52"], [-1.4, -10.6, 2, "#80ad64"]]) g += `<circle cx="${r(dx * s)}" cy="${r(dy * s)}" r="${r(rr * s)}" fill="${f}"/>`;
  return g;
};
{
  /* weitere Bäume am Ring (Kulisse) */
  let g = "";
  for (const [x, y, s] of [[176, 157, 1.0], [216, 155.5, 1.05], [300, 154, 1.1]]) g += `<g transform="translate(${x} ${y})">${baum(s)}</g>`;
  S.hinten(g);
  S.teil({ id: "baum", de: "der Baum", syl: "BAUM", it: "l'albero", itSyl: "AL-be-ro", en: "tree", x: 258, y: 154.6, steht: true, kunst: baum(1.15) + flaeche(-6, -18, 12, 18),
    tipp: "Am Ring um die Altstadt stehen viele Linden." });
}

/* =====================================================================
   10 — DER BUS und 11 — DIE STRASSENBAHN auf dem Ring
   ===================================================================== */
{
  /* Bus (Seite und Dach von oben) */
  let k = schatten(0, 0.3, 11, 1, 0.3);
  k += `<path d="M-10 0 L-10 -6 L10 -6.4 L10.4 0 Z" fill="${S.lg("bus", [[0, "#ffffff"], [1, "#d7dde3"]])}"/>`;
  k += `<path d="M-10 -6 L-8.6 -8 L10.8 -8.4 L10 -6.4 Z" fill="#e9edf0"/>`;
  k += `<rect x="-9" y="-5" width="17" height="2.2" fill="#2a3b4c"/><rect x="-10" y="-2.4" width="20.4" height="1" fill="#1d5fa8"/>`;
  k += `<circle cx="-6" cy="0" r="1.3" fill="#222"/><circle cx="6.6" cy="0" r="1.3" fill="#222"/>`;
  k += `<rect x="-6" y="-8.2" width="6" height="1" fill="#cfd6dc"/>`;
  S.teil({ id: "bus", de: "der Bus", syl: "BUS", it: "l'autobus", itSyl: "AU-to-bus", en: "bus", x: 290, y: 163, steht: true, kunst: k });
}
{
  /* LVB-Niederflurbahn: fünf Wagenteile, weiß mit blauem Band */
  let k = schatten(0, 0.4, 32, 1.4, 0.3);
  const n = 5, lw = 12.2, x0 = -n * lw / 2;
  for (let i = 0; i < n; i++) {
    const x = x0 + i * lw, d = -i * 0.5;     /* leicht schräg: Straße steigt nach rechts an */
    k += `<path d="M${r(x)} ${r(d)} L${r(x)} ${r(d - 7)} L${r(x + lw - 0.5)} ${r(d - 7.3)} L${r(x + lw - 0.5)} ${r(d - 0.3)} Z" fill="${S.lg("tram", [[0, "#ffffff"], [1, "#dfe3e6"]])}"/>`;
    k += `<path d="M${r(x)} ${r(d - 7)} L${r(x + 1.2)} ${r(d - 9)} L${r(x + lw + 0.6)} ${r(d - 9.3)} L${r(x + lw - 0.5)} ${r(d - 7.3)} Z" fill="#cdd3d8"/>`;
    k += `<path d="M${r(x + 0.8)} ${r(d - 5.6)} L${r(x + lw - 1.2)} ${r(d - 5.85)} L${r(x + lw - 1.2)} ${r(d - 3.3)} L${r(x + 0.8)} ${r(d - 3.05)} Z" fill="#26384a"/>`;
    k += `<path d="M${r(x)} ${r(d - 2.2)} L${r(x + lw - 0.5)} ${r(d - 2.45)} L${r(x + lw - 0.5)} ${r(d - 1.3)} L${r(x)} ${r(d - 1.05)} Z" fill="#1d5fa8"/>`;
    k += `<rect x="${r(x + lw / 2 - 1)}" y="${r(d - 5.8)}" width="2" height="5.2" fill="#f2c230" opacity=".9"/>`;
    if (i === 2) k += `<rect x="${r(x + 2)}" y="${r(d - 10.6)}" width="6" height="1.4" fill="#7c858d"/><path d="M${r(x + 3)} ${r(d - 10.6)} L${r(x + 6)} ${r(d - 14)} L${r(x + 8)} ${r(d - 14)}" stroke="#444" stroke-width=".35" fill="none"/>`;
  }
  /* Kopf mit Liniennummer und Fahrtziel */
  k += `<path d="M${r(-x0)} ${r(-n * 0.5)} q2.6 -.6 2.8 -3.4 l-.2 -3.4 q-1 -.6 -2.6 -.4 Z" fill="#f0f2f3"/>`;
  k += `<rect x="${r(-x0 - 9)}" y="${r(-n * 0.5 - 7.1)}" width="7" height="1.3" fill="#111"/><text x="${r(-x0 - 5.5)}" y="${r(-n * 0.5 - 6.1)}" font-size="1.1" text-anchor="middle" fill="#ffb000" font-family="monospace">16 Messe</text>`;
  /* Oberleitung */
  k += `<line x1="${r(x0 - 4)}" y1="-14" x2="${r(-x0 + 6)}" y2="-17" stroke="#3c3c3c" stroke-width=".25"/>`;
  S.teil({ id: "strassenbahn", de: "die Straßenbahn", syl: "STRA-ßen-bahn", it: "il tram", itSyl: "TRAM", en: "tram", x: 222, y: 171, steht: true, kunst: k + flaeche(x0 - 1, -11, n * lw + 4, 11),
    tipp: "In Leipzig fahren Straßenbahnen seit über 100 Jahren — das Netz ist eines der größten in Deutschland." });
}

/* =====================================================================
   PLATTFORM vorne: Boden, Geländer, Tafel, Fernrohr, Besucherin
   ===================================================================== */
const HAND = 180;    /* Handlauf */
S.hinten(`<rect y="${HAND + 6}" width="320" height="${200 - HAND - 6}" fill="${S.lg("deck", [[0, "#8d8f91"], [1, "#6c6e70"]])}"/>`);
{
  let d = "";
  for (let x = -40; x < 360; x += 14) d += `<line x1="${x}" y1="${HAND + 6}" x2="${r(160 + (x - 160) * 1.6)}" y2="200" stroke="#5e6062" stroke-width=".35"/>`;
  d += `<rect y="${HAND + 5}" width="320" height="1.6" fill="#4d4f52"/>`;
  S.hinten(d);
}

/* 12 — DAS GELÄNDER */
{
  let k = `<rect x="-160" y="-1.4" width="320" height="2.4" rx="1.1" fill="${STAHL}"/><rect x="-160" y="-1.4" width="320" height=".7" fill="#fff" opacity=".7"/>`;
  for (let x = -150; x <= 150; x += 50) k += `<rect x="${x - 0.8}" y="0" width="1.6" height="${200 - HAND}" fill="${S.lg("pfosten", [[0, "#cfd5da"], [0.5, "#f4f6f7"], [1, "#9aa3aa"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-160" y="5.2" width="320" height=".8" fill="#9aa3aa"/>`;
  S.teil({ id: "gelaender", de: "das Geländer", syl: "Ge-LÄN-der", it: "la ringhiera", itSyl: "rin-GHIE-ra", en: "railing", x: 160, y: HAND, kunst: k });
  /* Glasscheiben des Geländers: nur Spiegelung, fangen keinen Tipp */
  S.davor(`<rect x="0" y="${HAND + 1}" width="320" height="${200 - HAND}" fill="${S.lg("scheibe", [[0, "#e9f3f8", 0.2], [1, "#e9f3f8", 0.06]])}"/>
<path d="M30 ${HAND + 1} L44 ${HAND + 1} L36 200 L22 200 Z M200 ${HAND + 1} L206 ${HAND + 1} L198 200 L192 200 Z" fill="#fff" opacity=".14"/>`);
}

/* 13 — DIE INFOTAFEL (Panoramatafel) mit Lupe */
const TAFEL = { x: 118, y: HAND - 0.6 };
{
  const W = 46, H = 15;
  let k = "";
  k += `<rect x="-1" y="0" width="2" height="6" fill="#7d858c"/>`;
  k += `<path d="M${-W / 2} -${H} L${W / 2} -${H} L${W / 2 + 1.5} 0 L${-W / 2 - 1.5} 0 Z" fill="#3a4148"/>`;
  k += `<path d="M${-W / 2 + 1} -${H - 1} L${W / 2 - 1} -${H - 1} L${W / 2 + 0.3} -1 L${-W / 2 - 0.3} -1 Z" fill="${S.lg("tafelgrund", [[0, "#f6f2e8"], [1, "#e6dfcf"]])}"/>`;
  k += `<text x="${-W / 2 + 2}" y="-11.4" font-size="1.9" fill="#1d3b5c" font-family="Arial,sans-serif" font-weight="bold">BLICK NACH SÜDEN</text>`;
  k += `<text x="${W / 2 - 2}" y="-11.4" font-size="1.4" text-anchor="end" fill="#7a2e2e" font-family="Arial,sans-serif">Musikstadt Leipzig</text>`;
  /* Panoramazeichnung: Silhouette mit Linien zu den Namen */
  k += `<path d="M-21 -4 L-15 -4 L-15 -7 L-13 -9 L-11 -7 L-11 -4 L-2 -4 L-2 -9.6 L-1.4 -10.6 L-.8 -9.6 L-.8 -4 L8 -4 L8 -6 L10 -8.6 L11 -6 L11 -4 L21 -4" stroke="#1d3b5c" stroke-width=".4" fill="none"/>`;
  for (const [x, t] of [[-13, "Denkmal"], [-1.4, "Rathaus"], [10, "Thomaskirche"]]) k += `<text x="${x}" y="-2.2" font-size="1.05" text-anchor="middle" fill="#333" font-family="Arial">${t}</text>`;
  const unter = [];
  /* Notenschlüssel (Logo „Notenspur“) */
  const nx = 17, ny = -7.4;
  let ns = `<path d="M${nx + 0.2} ${ny + 3} C${nx - 1.6} ${ny + 3} ${nx - 1.8} ${ny + 0.6} ${nx - 0.2} ${ny + 0.4} C${nx + 1.4} ${ny + 0.2} ${nx + 1.6} ${ny + 2.2} ${nx + 0.2} ${ny + 2.4} C${nx - 0.6} ${ny + 2.4} ${nx - 0.8} ${ny + 1.2} ${nx + 0.1} ${ny + 1} M${nx + 0.2} ${ny + 3} L${nx + 0.4} ${ny - 3.6} C${nx + 1.6} ${ny - 4.2} ${nx + 1.4} ${ny - 2} ${nx - 0.6} ${ny - 0.6} C${nx - 1.8} ${ny + 0.4} ${nx - 1.6} ${ny + 1.8} ${nx - 0.6} ${ny + 2.4} M${nx + 0.4} ${ny + 3} L${nx + 0.6} ${ny + 4.4} Q${nx + 0.4} ${ny + 5.4} ${nx - 0.4} ${ny + 5}" stroke="#7a2e2e" stroke-width=".42" fill="none" stroke-linecap="round"/>`;
  ns += `<path d="M${nx - 2.4} ${ny - 2} h5 M${nx - 2.4} ${ny - 1} h5 M${nx - 2.4} ${ny} h5 M${nx - 2.4} ${ny + 1} h5 M${nx - 2.4} ${ny + 2} h5" stroke="#7a2e2e" stroke-width=".12" opacity=".7"/>`;
  k += ns;
  unter.push({ id: "notenschluessel", de: "der Notenschlüssel", syl: "NO-ten-schlüs-sel", it: "la chiave di violino", itSyl: "CHIA-ve di vio-LI-no", en: "treble clef",
    x: TAFEL.x + nx, y: TAFEL.y + ny + 5.4, kunst: flaeche(-3, -9.4, 6, 10),
    tipp: "Leipzig ist eine Musikstadt: Bach, Mendelssohn und Wagner lebten hier. Die „Notenspur“ führt zu ihren Orten." });
  /* Windrose */
  const wx = -17, wy = -7.2;
  k += `<circle cx="${wx}" cy="${wy}" r="2" fill="none" stroke="#1d3b5c" stroke-width=".25"/><path d="M${wx} ${wy - 2.6} L${wx + 0.6} ${wy} L${wx} ${wy + 2.6} L${wx - 0.6} ${wy} Z" fill="#1d3b5c"/><path d="M${wx - 2.6} ${wy} L${wx} ${wy - 0.5} L${wx + 2.6} ${wy} L${wx} ${wy + 0.5} Z" fill="#8a96a3"/><text x="${wx}" y="${wy - 2.9}" font-size=".9" text-anchor="middle" fill="#1d3b5c" font-family="Arial">N</text>`;
  unter.push({ id: "windrose", de: "die Windrose", syl: "WIND-ro-se", it: "la rosa dei venti", itSyl: "RO-sa dei VEN-ti", en: "compass rose",
    x: TAFEL.x + wx, y: TAFEL.y + wy + 3, kunst: flaeche(-3, -6.4, 6, 6.6), tipp: "Die Windrose zeigt die Himmelsrichtungen: Norden, Osten, Süden, Westen." });
  /* Stadtplan-Ausschnitt */
  const kx = -7.5, ky = -7.6;
  k += `<rect x="${kx - 3.5}" y="${ky - 2}" width="7" height="4" fill="#e9efe2" stroke="#999" stroke-width=".15"/><path d="M${kx - 3.5} ${ky + 1} Q${kx} ${ky - 1.6} ${kx + 3.5} ${ky + 0.4}" stroke="#d9a33b" stroke-width=".35" fill="none"/><circle cx="${kx}" cy="${ky}" r=".9" fill="none" stroke="#c0392b" stroke-width=".3"/><circle cx="${kx + 1.6}" cy="${ky - 0.8}" r=".35" fill="#c0392b"/>`;
  unter.push({ id: "stadtplan", de: "der Stadtplan", syl: "STADT-plan", it: "la piantina della città", itSyl: "pian-TI-na del-la cit-TÀ", en: "city map",
    x: TAFEL.x + kx, y: TAFEL.y + ky + 2.2, kunst: flaeche(-3.8, -4.4, 7.6, 4.6), tipp: "Der rote Punkt zeigt: Hier stehen Sie." });
  k += `<path d="M${-W / 2} -${H} L${-W / 2 + 10} -${H} L${-W / 2 + 2} 0 L${-W / 2 - 1.5} 0 Z" fill="#fff" opacity=".18"/>`;
  S.teil({ oben: true, id: "infotafel", de: "die Infotafel", syl: "IN-fo-ta-fel", it: "il pannello informativo", itSyl: "pan-NEL-lo in-for-ma-TI-vo", en: "information board",
    x: TAFEL.x, y: TAFEL.y, kunst: k, zoom: { x: TAFEL.x - 25, y: TAFEL.y - 17, w: 50, h: 33 }, unter,
    tipp: "Die Tafel zeigt, was man von hier oben sieht." });
}

/* 14 — DER RUCKSACK (auf dem Plattformboden) */
{
  let k = schatten(0, 0.2, 4.6, 0.8, 0.35);
  k += `<path d="M-3.6 0 L-3.8 -7 Q-3.6 -9.4 0 -9.6 Q3.6 -9.4 3.8 -7 L3.6 0 Z" fill="${S.lg("ruck", [[0, "#d0573b"], [1, "#9d3b26"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-2.6 -2.6 L2.6 -2.6 L2.4 -.4 L-2.4 -.4 Z" fill="#a8432c"/><path d="M-3.4 -7.4 Q0 -8.6 3.4 -7.4" stroke="#7a2c1a" stroke-width=".4" fill="none"/><path d="M-1.4 -9.6 q1.4 -1.6 2.8 0" stroke="#3a2a22" stroke-width=".5" fill="none"/>`;
  k += `<path d="M-3 -6.6 q-.4 2 0 5" stroke="#fff" stroke-width=".5" opacity=".25" fill="none"/>`;
  S.teil({ id: "rucksack", de: "der Rucksack", syl: "RUCK-sack", it: "lo zaino", itSyl: "ZAI-no", en: "backpack", x: 186, y: 197, steht: true, kunst: k });
}

/* 15 — DIE TOURISTIN (an der Brüstung, Rücken zu uns, sie zeigt hinunter) */
{
  const m = B.mensch({ id: "lpz_tour", geschlecht: "w", pose: "zeigen", blick: 196, frisur: "zopf", haarfarbe: "dunkelbraun", haut: "hell",
    kleidung: { oberteil: { stueck: "pullover", farbe: "hellblau" }, jacke: { stueck: "jacke", farbe: "gelb" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" } } }, 24);
  S.teil({ id: "touristin", de: "die Touristin", syl: "tu-RIS-tin", it: "la turista", itSyl: "tu-RI-sta", en: "tourist", x: 214, y: 196, kunst: m.svg,
    tipp: "Sie zeigt auf das Gewandhaus: „Da spielt heute Abend das Orchester!“" });
}

/* 16 — DAS FERNROHR (Münzfernrohr) */
{
  let k = schatten(0, 0.3, 6, 1, 0.35);
  k += `<path d="M-4 0 L4 0 L3 -1.6 L-3 -1.6 Z" fill="#3c4247"/><rect x="-1" y="-13" width="2" height="11.6" fill="${S.lg("saeule", [[0, "#2f6f9e"], [0.5, "#4f91c2"], [1, "#1f4f74"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-2.4" y="-15" width="4.8" height="2.4" rx=".6" fill="#2a5f88"/>`;
  k += `<path d="M-4.4 -21 Q-5 -16 -1 -15.4 L5 -16.6 Q7 -19.6 4.8 -22 Z" fill="${S.lg("fernkopf", [[0, "#4f91c2"], [1, "#24597f"]])}"/>`;
  k += `<rect x="-6.4" y="-21" width="2.4" height="1.6" rx=".5" fill="#1b1f23" transform="rotate(-8 -5 -20)"/><rect x="-6.2" y="-18.6" width="2.4" height="1.6" rx=".5" fill="#1b1f23" transform="rotate(-8 -5 -18)"/>`;
  k += `<rect x="1.6" y="-20" width="2.6" height="1.6" rx=".3" fill="#e0e4e7"/><rect x="2.4" y="-19.6" width="1" height=".5" fill="#333"/>`;
  k += `<path d="M-3.6 -20.6 Q0 -22.4 4 -21" stroke="#fff" stroke-width=".5" opacity=".4" fill="none"/>`;
  S.teil({ id: "fernrohr", de: "das Fernrohr", syl: "FERN-rohr", it: "il cannocchiale", itSyl: "can-noc-CHIA-le", en: "telescope", x: 268, y: 196, steht: true, kunst: k,
    tipp: "Für eine Münze kann man durch das Fernrohr schauen — bis zum Völkerschlachtdenkmal." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/leipzig.js"));
console.log(aus);
