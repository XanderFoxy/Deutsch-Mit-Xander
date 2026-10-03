#!/usr/bin/env node
/* =====================================================================
   ROM & SEINE WUNDER (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   XANDER (Funk 263/286): jeder Ort authentisch wie das echte Vorbild,
   alles logisch platziert, jedes Ding einzeln antippbar.

   RECHERCHE (Aussichtspunkte Roms: xixerone „best panoramic viewpoints“,
   italyplanner „Gianicolo“, Wanted in Rome „Views“) — der Standort ist
   die Terrasse auf dem GIANICOLO (Piazzale Garibaldi), der berühmteste
   Blick über Rom. Man schaut nach Osten über die Dächer von Trastevere;
   von links (Norden) nach rechts (Süden) liegen:
   - der PETERSDOM (Michelangelos Kuppel mit Laterne, Nebenkuppeln) ganz
     nah links; die ENGELSBURG (Rundbau des Hadrian-Grabmals, oben der
     Bronzeengel) am TIBER, davor die Engelsbrücke auf BÖGEN;
   - auf dem Pincio-Hügel die Kirche Trinità dei Monti mit zwei Türmen,
     davor der OBELISK, darunter die SPANISCHE TREPPE;
   - die flache, graue KUPPEL des PANTHEONS zwischen den Dächern (die
     Vorhalle zeigt nach Norden), die hohe KUPPEL von Sant'Andrea della
     Valle, das weiße Vittoriano mit der Trajans-SÄULE davor;
   - rechts die RUINEN des Palatins und das KOLOSSEUM (außen vier
     Geschosse, auf der Südseite eingestürzt: dort sieht man den
     inneren Ring).
   - Auf dem Gianicolo selbst: Schirm-PINIEN, das Reiterstandbild
     Garibaldis (STATUE), die Steinbrüstung, das Pflaster aus
     „Sampietrini“, ein Kiosk mit Pizza al taglio und GELATO, ein
     Postkartenständer (Forum und Trevibrunnen sieht man von hier nicht –
     sie hängen als Postkarten am Ständer), eine VESPA.
   Maßstab: wie eine gemalte Vedute sind die Wahrzeichen etwas
   überhöht, ihre Reihenfolge und Lage stimmen. Vorn (Boden y ≈ 186)
   ≈ 38 Einheiten je Meter (Vespa 1,15 m).
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "rom", titel: "Rom & seine Wunder", emoji: "🏛️", thema: "Landeskunde", kuerzel: "b23c", fassung: 852 });
const rnd = zufall(753);
const r = B.r;
const abs = (x, y, svg) => `<g transform="translate(${r(-x)} ${r(-y)})">${svg}</g>`;
const LUPE = "rom_detail";

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("dunst")}" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="1.6"/></filter>`);
const TRAVERTIN = S.lg("travertin", [[0, "#f2e4c4"], [0.5, "#e2cfa4"], [1, "#c4ad80"]], 0, 0, 1, 0);
const TRAV_H = S.lg("travh", [[0, "#efdfbb"], [1, "#cdb68a"]]);
const BLEI = S.lg("blei", [[0, "#a9b6c2"], [0.45, "#8494a3"], [1, "#56636f"]], 0, 0, 1, 0);
const ZIEGEL = S.lg("ziegelw", [[0, "#c9774a"], [1, "#9c5532"]]);
const BRONZE = S.lg("bronze", [[0, "#6e7a62"], [0.5, "#3e4a3a"], [1, "#24302a"]], 0, 0, 1, 0);

/* =====================================================================
   KULISSE — Abendhimmel, Albaner Berge, Dächermeer, Vittoriano
   ===================================================================== */
S.hinten(`<rect x="0" y="0" width="320" height="120" fill="${S.lg("himmel", [[0, "#79a8d8"], [0.6, "#c9dcea"], [1, "#f4e2c4"]])}"/>`);
S.hinten(`<g filter="url(#${S.id("dunst")})"><ellipse cx="200" cy="22" rx="34" ry="4" fill="#fff" opacity=".8"/><ellipse cx="226" cy="18" rx="18" ry="3.6" fill="#fff" opacity=".85"/><ellipse cx="120" cy="40" rx="24" ry="3" fill="#fff" opacity=".55"/></g>`);
S.hinten(`<path d="M0 78 Q60 70 120 74 Q190 64 250 70 Q290 66 320 72 L320 90 L0 90 Z" fill="${S.lg("berge", [[0, "#a7b4c6"], [1, "#c8cdd2"]])}"/>`);
{
  /* Dächermeer: hinten klein und dunstig, vorn größer und wärmer */
  let g = `<rect x="0" y="80" width="320" height="34" fill="${S.lg("stadt", [[0, "#d9c3a2"], [1, "#c58f62"]])}"/>`;
  const farben = ["#e2b98a", "#d9a46e", "#efd2a4", "#cf8e5e", "#e8c79a", "#d3b089", "#f0dcb6"];
  for (let reihe = 0; reihe < 6; reihe++) {
    const y = 82 + reihe * 5.4, s = 0.7 + reihe * 0.28;
    for (let x = -4 + rnd() * 6; x < 324; x += (5 + rnd() * 5) * s) {
      const w = (4 + rnd() * 5) * s, h = (3 + rnd() * 3) * s, f = farben[Math.floor(rnd() * farben.length)];
      g += `<rect x="${r(x)}" y="${r(y - h)}" width="${r(w)}" height="${r(h + 3)}" fill="${f}"/>`;
      g += `<path d="M${r(x - 0.4)} ${r(y - h)} L${r(x + w / 2)} ${r(y - h - 1.4 * s)} L${r(x + w + 0.4)} ${r(y - h)} Z" fill="${rnd() < 0.7 ? "#b5583a" : "#a24a30"}"/>`;
      if (s > 1) for (let j = 0; j < Math.floor(w / (2.2 * s)); j++) g += `<rect x="${r(x + 0.8 * s + j * 2.2 * s)}" y="${r(y - h + 1.2 * s)}" width="${r(0.8 * s)}" height="${r(1.2 * s)}" fill="#6d4a32" opacity=".7"/>`;
    }
  }
  g += `<rect x="0" y="80" width="320" height="16" fill="#e9eef2" opacity=".25"/>`;
  /* das Vittoriano: weißer Marmor, Säulenhalle, Quadrigen */
  g += `<path d="M214 104 L214 88 L246 88 L246 104 Z" fill="${S.lg("vitt", [[0, "#fbfaf6"], [1, "#d9d6cc"]])}"/>`;
  for (let x = 215.6; x < 245; x += 1.9) g += `<rect x="${r(x)}" y="89" width=".7" height="8" fill="#c9c5ba"/>`;
  g += `<rect x="213" y="86.6" width="34" height="2" fill="#efede6"/><rect x="214" y="97" width="32" height="1.4" fill="#e4e1d8"/><path d="M220 104 L222 99 L238 99 L240 104 Z" fill="#ecebe4"/>`;
  for (const x of [215.6, 244.4]) g += `<rect x="${x - 1.6}" y="83" width="3.2" height="4" fill="#efede6"/><path d="M${x - 2} 83 L${x - 1.2} 80.6 L${x + 1.6} 80.6 L${x + 2} 83 Z" fill="#5f6a4e"/>`;
  g += `<path d="M228.6 99 L231.4 99 L231.4 96 L230 94.6 L228.6 96 Z" fill="#5f6a4e"/>`;
  S.hinten(g);
}

/* =====================================================================
   3 — DIE SPANISCHE TREPPE mit Trinità dei Monti, 4 — DER OBELISK
   ===================================================================== */
{
  let k = `<path d="M136 96 Q140 84 152 82 L170 82 Q178 84 182 96 Z" fill="${S.lg("pincio", [[0, "#7c9a5e"], [1, "#5f7e48"]])}"/>`;
  for (const [x, y] of [[140, 88], [145, 84.6], [175, 85], [179, 89]]) k += `<ellipse cx="${x}" cy="${y}" rx="3.4" ry="2.2" fill="#4d6b3a"/>`;
  /* Kirche mit Doppelturmfassade */
  k += `<rect x="151" y="72" width="16" height="10" fill="${S.lg("trinita", [[0, "#f3e6cc"], [1, "#dcc79e"]])}"/><path d="M155 72 L159 69.4 L163 72 Z" fill="#efe2c4"/>`;
  for (const x of [150, 164]) k += `<rect x="${x}" y="66" width="4" height="8" fill="#f1e2c2"/><path d="M${x - 0.3} 66 Q${x + 2} 62.4 ${x + 4.3} 66 Z" fill="#8b98a0"/><rect x="${x + 1.2}" y="67.6" width="1.6" height="2.4" rx=".6" fill="#6b5e4a"/>`;
  k += `<path d="M157.6 82 L157.6 77 Q159 75.6 160.4 77 L160.4 82 Z" fill="#6b5e4a"/>`;
  /* die Treppe: Läufe, Podeste, Balustraden — nach unten breiter */
  const lauf = (y0, y1, a0, a1) => { let g = `<path d="M${159 - a0} ${y0} L${159 + a0} ${y0} L${159 + a1} ${y1} L${159 - a1} ${y1} Z" fill="#efe4cc"/>`; for (let y = y0 + 0.8; y < y1; y += 0.9) { const a = a0 + (a1 - a0) * (y - y0) / (y1 - y0); g += `<line x1="${r(159 - a)}" y1="${r(y)}" x2="${r(159 + a)}" y2="${r(y)}" stroke="#c9b893" stroke-width=".25"/>`; } return g; };
  k += lauf(82, 86, 5, 6.4) + `<rect x="152" y="86" width="14" height="1.2" fill="#e2d4b4"/>` + lauf(87.2, 91.4, 7, 9) + `<rect x="149.6" y="91.4" width="18.8" height="1.2" fill="#e2d4b4"/>` + lauf(92.6, 97.6, 9.4, 12);
  k += `<path d="M152 82 L147 97.6 M166 82 L171 97.6" stroke="#d8c8a2" stroke-width=".7"/>`;
  for (const x of [148, 151, 167, 170]) k += `<circle cx="${x}" cy="${x < 159 ? 94 : 94}" r=".9" fill="#d55a7a"/>`;
  S.teil({ id: "spanischetreppe", de: "die Spanische Treppe", syl: "SPA-ni-sche TREP-pe", it: "la Scalinata di Trinità dei Monti", itSyl: "sca-li-NA-ta di tri-ni-TÀ dei MON-ti", en: "Spanish Steps", x: 159, y: 98, kunst: abs(159, 98, k),
    tipp: "135 Stufen führen von der Piazza di Spagna hinauf zur Kirche Trinità dei Monti." });
}
{
  let k = `<path d="M-.8 0 L.8 0 L.55 -11 L0 -12.4 L-.55 -11 Z" fill="${S.lg("obel", [[0, "#e9dcc4"], [1, "#a8977a"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-1.4" y="0" width="2.8" height="1.6" fill="#d8c8a2"/><path d="M0 -12.4 L0 -14 M-.8 -13.4 L.8 -13.4" stroke="#c9a33a" stroke-width=".35"/>`;
  S.teil({ oben: true, id: "obelisk", de: "der Obelisk", syl: "O-be-LISK", it: "l'obelisco", itSyl: "o-be-LI-sco", en: "obelisk", x: 159, y: 82, kunst: k + flaeche(-2.4, -14.4, 4.8, 16.4),
    tipp: "Die Römer brachten Obelisken aus Ägypten mit; in Rom stehen heute 13." });
}

/* =====================================================================
   5 — DAS PANTHEON (flache Kuppel, Vorhalle nach Norden)
   ===================================================================== */
{
  let k = `<path d="M166 100 L166 92 L172 87.6 L178 92 L178 100 Z" fill="#e4d4b2"/><path d="M165 92.4 L172 87 L179 92.4" stroke="#cbb48a" stroke-width=".7" fill="none"/>`;
  k += `<rect x="171" y="92" width="22" height="9" fill="${S.lg("rotunde", [[0, "#c9a57c"], [0.5, "#b38c62"], [1, "#8a6a48"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M171 95 h22 M171 98 h22" stroke="#8a6a48" stroke-width=".3"/>`;
  for (let i = 0; i < 3; i++) k += `<path d="M${172 + i * 0.6} ${91.6 - i * 1.4} L${192 - i * 0.6} ${91.6 - i * 1.4}" stroke="#9aa3a8" stroke-width="1.4"/>`;
  k += `<path d="M174 88 Q182 81 190 88 Z" fill="${S.lg("pkuppel", [[0, "#b9c2c6"], [0.5, "#99a3a8"], [1, "#6e787d"]], 0, 0, 1, 0)}"/>`;
  k += `<ellipse cx="182" cy="84.6" rx="1.4" ry=".4" fill="#3c4246"/>`;
  S.teil({ id: "pantheon", de: "das Pantheon", syl: "PAN-the-on", it: "il Pantheon", itSyl: "PAN-the-on", en: "Pantheon", x: 179, y: 101, kunst: abs(179, 101, k), lupe: LUPE,
    tipp: "Die Kuppel ist fast 1900 Jahre alt und oben offen: Durch das Opaion fällt Licht." });
}

/* =====================================================================
   6 — DIE KUPPEL (Sant'Andrea della Valle), 7 — DIE SÄULE (Trajanssäule)
   ===================================================================== */
{
  let k = `<rect x="194" y="92" width="16" height="10" fill="${TRAV_H}"/><rect x="196" y="81" width="12" height="11" fill="${TRAVERTIN}"/><rect x="195.4" y="80" width="13.2" height="1.4" fill="#f2e6c8"/>`;
  for (let i = 0; i < 4; i++) k += `<path d="M${197.4 + i * 2.8} 89 L${197.4 + i * 2.8} 84.6 Q${198.2 + i * 2.8} 83.6 ${199 + i * 2.8} 84.6 L${199 + i * 2.8} 89 Z" fill="#6d5e48"/>`;
  k += `<path d="M195.6 80.4 Q196 69 202 67 Q208 69 208.4 80.4 Z" fill="${BLEI}"/>`;
  for (const t of [-0.6, -0.2, 0.2, 0.6]) k += `<path d="M${r(202 + t * 6.4)} 80.4 Q${r(202 + t * 5.4)} 72 202 67.2" stroke="#e2e8ee" stroke-width=".4" fill="none" opacity=".7"/>`;
  k += `<rect x="200.6" y="62.6" width="2.8" height="4.6" fill="${TRAVERTIN}"/><path d="M200.2 62.8 Q202 60.6 203.8 62.8 Z" fill="${BLEI}"/><path d="M202 60.6 L202 58.4 M201.2 59.2 L202.8 59.2" stroke="#c9a33a" stroke-width=".4"/>`;
  S.teil({ id: "kuppel", de: "die Kuppel", syl: "KUP-pel", it: "la cupola", itSyl: "CU-po-la", en: "dome", x: 202, y: 102, kunst: abs(202, 102, k),
    tipp: "Sant'Andrea della Valle hat nach dem Petersdom die zweitgrößte Kuppel Roms." });
}
{
  let k = `<rect x="-1.5" y="-24" width="3" height="22" fill="${S.lg("trajan", [[0, "#efe4cc"], [1, "#b9a682"]], 0, 0, 1, 0)}"/>`;
  for (let y = -23; y < -3; y += 1.6) k += `<path d="M-1.5 ${y + 1.2} L1.5 ${y}" stroke="#a8977a" stroke-width=".3"/>`;
  k += `<rect x="-2.6" y="-2.4" width="5.2" height="2.4" fill="#d8c8a2"/><rect x="-2" y="-25" width="4" height="1.2" fill="#d8c8a2"/>`;
  k += `<path d="M-.6 -25 L-.6 -27.6 L.6 -27.6 L.6 -25 Z M0 -28.6 L0 -27.6" stroke="#4e5a48" stroke-width=".5" fill="${BRONZE}"/><circle cx="0" cy="-28.4" r=".55" fill="${BRONZE}"/>`;
  S.teil({ oben: true, id: "saeule", de: "die Säule", syl: "SÄU-le", it: "la colonna", itSyl: "co-LON-na", en: "column", x: 211, y: 104, steht: true, kunst: k + flaeche(-3, -29.4, 6, 29.6),
    tipp: "Die Trajanssäule erzählt in einem Bilderband, das sich 23-mal herumwindet, von Kriegen." });
}

/* =====================================================================
   8 — DIE RUINE (Palatin), 9 — DAS KOLOSSEUM
   ===================================================================== */
{
  let k = `<path d="M244 106 Q246 94 256 92 Q266 93 266 106 Z" fill="${S.lg("palatin", [[0, "#8aa067"], [1, "#6d8650"]])}"/>`;
  k += `<path d="M247 104 L247 95 L262 95 L262 104 Z" fill="${ZIEGEL}"/>`;
  for (const x of [248.6, 253.4, 258.2]) k += `<path d="M${x} 104 L${x} 99 Q${x + 1.6} 96.8 ${x + 3.2} 99 L${x + 3.2} 104 Z" fill="#5e3a26"/><path d="M${x} 97.4 L${x} 95" stroke="#7a4128" stroke-width=".4"/>`;
  k += `<path d="M247 95 L249 93.4 L251 95 L254 92.6 L256 95 L259 93 L262 95" fill="${ZIEGEL}" stroke="#9c5532" stroke-width=".4"/>`;
  k += `<path d="M262 104 L262 97.6 L264.6 96 L265 104 Z" fill="#b5683e"/>`;
  for (const [x, y, w] of [[245, 94, 4], [265, 92, 4.4], [252, 90.6, 3]]) k += `<ellipse cx="${x}" cy="${y}" rx="${w}" ry="${w * 0.45}" fill="#3f5a32"/><rect x="${x - 0.3}" y="${y}" width=".6" height="4" fill="#5a4030"/>`;
  S.teil({ id: "ruine", de: "die Ruine", syl: "Ru-I-ne", it: "la rovina", itSyl: "ro-VI-na", en: "ruin", x: 255, y: 106, kunst: abs(255, 106, k),
    tipp: "Auf dem Palatin standen die Paläste der Kaiser – daher kommt unser Wort „Palast“." });
}
{
  /* Außenring (links vollständig, vier Geschosse) und eingestürzte Südseite mit innerem Ring */
  let k = `<path d="M268 106 L268 82 Q282 78.6 290 80 L290 86 L298 89 L301 106 Z" fill="${S.lg("kolo", [[0, "#e7d2a2"], [0.5, "#d4b984"], [1, "#a88a5a"]], 0, 0, 1, 0)}"/>`;
  /* Geschosse: drei Arkadenreihen + Attika mit Fenstern */
  for (const [y, h] of [[100.4, 4.4], [94.6, 4.4], [88.8, 4.4]]) {
    for (let x = 269.4; x < 289.4; x += 2.6) k += `<path d="M${r(x)} ${y + h} L${r(x)} ${r(y + 1.2)} Q${r(x + 0.85)} ${y} ${r(x + 1.7)} ${r(y + 1.2)} L${r(x + 1.7)} ${y + h} Z" fill="#5e4a32"/>`;
    k += `<rect x="268" y="${r(y - 0.8)}" width="22" height=".7" fill="#f2e2bc"/>`;
  }
  for (let x = 270.4; x < 289; x += 5.2) k += `<rect x="${x}" y="84" width="1.2" height="1.6" fill="#7a6040"/>`;
  k += `<rect x="268" y="81.6" width="22" height=".8" fill="#f2e2bc"/>`;
  /* Bruchkante und innerer Ring rechts */
  k += `<path d="M290 80 L290 86 L292.6 87.4 L293.4 90 L298 91" stroke="#b99a66" stroke-width=".7" fill="none"/>`;
  for (let x = 291; x < 299.6; x += 2.4) k += `<path d="M${r(x)} 104 L${r(x)} ${r(97.4)} Q${r(x + 0.7)} 96.4 ${r(x + 1.4)} ${r(97.4)} L${r(x + 1.4)} 104 Z" fill="#6e5638"/>`;
  for (let x = 291.4; x < 298.6; x += 2.4) k += `<path d="M${r(x)} 95 L${r(x)} 92.4 Q${r(x + 0.6)} 91.6 ${r(x + 1.2)} 92.4 L${r(x + 1.2)} 95 Z" fill="#6e5638"/>`;
  k += `<path d="M268.6 83 L270.4 83 L270.4 104" stroke="#fff" stroke-width=".5" opacity=".3" fill="none"/>`;
  S.teil({ id: "kolosseum", de: "das Kolosseum", syl: "Ko-los-SE-um", it: "il Colosseo", itSyl: "co-los-SE-o", en: "Colosseum", x: 284, y: 106, kunst: abs(284, 106, k), lupe: LUPE,
    tipp: "Im Kolosseum fanden 50 000 Zuschauer Platz." });
}

/* =====================================================================
   10 — DER TIBER, 11 — DER BOGEN (Engelsbrücke)
   ===================================================================== */
{
  let k = `<path d="M96 100.4 Q150 99 196 101.6 Q232 104 246 110 L240 116 L196 116 Q200 108 170 106 Q130 104.6 96 105.6 Z" fill="${S.lg("tiber", [[0, "#7a9e94"], [1, "#4f7068"]])}"/>`;
  k += `<path d="M96 100.4 Q150 99 196 101.6 Q232 104 246 110" stroke="#c9b893" stroke-width="1.1" fill="none"/>`;
  k += `<path d="M96 105.6 Q130 104.6 170 106 Q200 108 196 116" stroke="#c9b893" stroke-width="1.1" fill="none"/>`;
  k += `<path d="M150 102.4 h18 M200 104.6 h14 M120 103 h12 M214 108.6 h10" stroke="#cfe2dc" stroke-width=".4" opacity=".8"/>`;
  k += `<path d="M96 99.6 Q150 98.2 196 100.8" stroke="#6a8a4a" stroke-width=".9" fill="none" stroke-dasharray="1.6 1.2"/>`;
  S.teil({ id: "tiber", de: "der Tiber", syl: "TI-ber", it: "il Tevere", itSyl: "TE-ve-re", en: "Tiber", x: 190, y: 111, kunst: abs(190, 111, k),
    tipp: "Der Tiber fließt mitten durch Rom; an seinem Ufer wurde die Stadt gegründet." });
}
/* =====================================================================
   1 — DER PETERSDOM (Kuppel Michelangelos, ganz links und nah)
   ===================================================================== */
{
  let k = "";
  /* Langhaus mit Attika (Seitenansicht), Nebenkuppeln */
  k += `<rect x="42" y="88" width="72" height="20" fill="${TRAVERTIN}"/><rect x="41" y="86" width="74" height="2.6" fill="#f4e8cc"/>`;
  for (let x = 44; x < 114; x += 5.4) k += `<rect x="${x}" y="89" width="1.2" height="19" fill="#d2bd92"/>`;
  for (let x = 46.6; x < 112; x += 10.8) k += `<rect x="${x}" y="93" width="2.6" height="5" rx="1.2" fill="#6d5e48"/>`;
  for (let x = 44; x < 114; x += 6) k += `<rect x="${x}" y="83.6" width="1" height="2.6" fill="#efe2c4"/>`;
  for (const [cx, w] of [[52, 7], [102, 7]]) {
    k += `<rect x="${cx - w * 0.6}" y="80" width="${w * 1.2}" height="6" fill="${TRAVERTIN}"/><path d="M${cx - w * 0.6} 80 Q${cx} ${80 - w * 1.1} ${cx + w * 0.6} 80 Z" fill="${BLEI}"/><rect x="${cx - 0.6}" y="${80 - w * 1.2}" width="1.2" height="2.4" fill="#e9dcc0"/>`;
  }
  /* Tambour mit Doppelsäulen und Fenstern */
  k += `<rect x="60" y="68" width="34" height="18" fill="${TRAVERTIN}"/><rect x="59" y="66.4" width="36" height="2.4" fill="#f4e8cc"/><rect x="59" y="84.6" width="36" height="1.6" fill="#d8c498"/>`;
  for (let i = 0; i < 6; i++) { const x = 61.6 + i * 6; k += `<rect x="${x}" y="69" width="1.1" height="15.4" fill="#f6ecd2"/><rect x="${x + 1.5}" y="69" width="1.1" height="15.4" fill="#f6ecd2"/>`; if (i < 5) k += `<path d="M${x + 3.4} 82 L${x + 3.4} 74 Q${x + 4.4} 72.6 ${x + 5.4} 74 L${x + 5.4} 82 Z" fill="#5e5242"/>`; }
  /* Kuppel: Bleideckung mit Rippen und Dachfenstern */
  k += `<path d="M59.6 66.6 Q60 40 77 34 Q94 40 94.4 66.6 Z" fill="${BLEI}"/>`;
  for (const t of [-0.75, -0.42, -0.12, 0.2, 0.52, 0.82]) k += `<path d="M${r(77 + t * 17.4)} 66.6 Q${r(77 + t * 15)} 46 77 34.4" stroke="#e2e8ee" stroke-width=".55" fill="none" opacity=".75"/>`;
  for (const [x, y] of [[66, 58], [73, 57], [81, 57], [88, 58], [69, 48], [77, 46.6], [85, 48]]) k += `<rect x="${x - 0.7}" y="${y}" width="1.4" height="1.8" rx=".5" fill="#3c4650"/>`;
  k += `<path d="M64 60 Q66 44 76 37" stroke="#fff" stroke-width="1" opacity=".3" fill="none"/>`;
  /* Laterne, Kugel, Kreuz */
  k += `<rect x="74" y="27" width="6" height="7.4" fill="${TRAVERTIN}"/><path d="M73.4 27.4 Q77 22.4 80.6 27.4 Z" fill="${BLEI}"/>`;
  for (let i = 0; i < 3; i++) k += `<rect x="${74.8 + i * 1.8}" y="28.4" width=".8" height="4.4" fill="#5e5242"/>`;
  k += `<circle cx="77" cy="21.6" r="1.2" fill="#d9b24a"/><path d="M77 20.4 L77 16.4 M75.6 17.8 L78.4 17.8" stroke="#c9a33a" stroke-width=".6"/>`;
  S.teil({ id: "petersdom", de: "der Petersdom", syl: "PE-ters-dom", it: "San Pietro", itSyl: "san PIE-tro", en: "St Peter's Basilica", x: 78, y: 108, kunst: abs(78, 108, k),
    tipp: "Die Kuppel hat Michelangelo entworfen; sie ist 136 Meter hoch." });
}

/* =====================================================================
   2 — DIE ENGELSBURG (Hadrians Grabmal, oben der Bronzeengel)
   ===================================================================== */
{
  let k = `<rect x="114" y="98" width="34" height="10" fill="${S.lg("bastion", [[0, "#b98a62"], [1, "#94663f"]])}"/>`;
  k += zinnenFlach(114, 148, 98);
  k += `<rect x="119" y="85" width="24" height="14" fill="${S.lg("rundbau", [[0, "#dcc29a"], [0.4, "#c9aa7c"], [1, "#8e7552"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M119 92 h24 M119 96 h24" stroke="#9e8460" stroke-width=".3"/>`;
  k += `<rect x="123" y="77" width="16" height="8.4" fill="${S.lg("palast", [[0, "#e8cfa4"], [1, "#c8a676"]], 0, 0, 1, 0)}"/><rect x="122.4" y="76.2" width="17.2" height="1.4" fill="#b5583a"/>`;
  for (let x = 124.6; x < 138; x += 3) k += `<rect x="${x}" y="79" width="1.2" height="2" fill="#6d5a42"/>`;
  k += `<rect x="129.4" y="72.6" width="3.2" height="4" fill="#d8bb8c"/>`;
  /* der Erzengel Michael (Bronze, mit Schwert), Flügel */
  k += `<path d="M130.2 72.6 L131.8 72.6 L131.6 68 L130.4 68 Z" fill="${BRONZE}"/><circle cx="131" cy="67.2" r=".9" fill="${BRONZE}"/>`;
  k += `<path d="M130.2 69 Q127.4 66.6 128.2 64.4 Q129.6 66.4 130.6 68 Z M131.8 69 Q134.6 66.6 133.8 64.4 Q132.4 66.4 131.4 68 Z" fill="#4e5a48"/>`;
  k += `<path d="M131.6 69.4 L134 71.2" stroke="${BRONZE}" stroke-width=".5"/>`;
  S.teil({ id: "engelsburg", de: "die Engelsburg", syl: "EN-gels-burg", it: "Castel Sant'Angelo", itSyl: "ca-STEL sant-AN-ge-lo", en: "Castel Sant'Angelo", x: 131, y: 108, kunst: abs(131, 108, k),
    tipp: "Erst Grabmal des Kaisers Hadrian, dann Burg der Päpste." });
}
function zinnenFlach(x0, x1, y) {
  let g = "";
  for (let x = x0; x < x1 - 1; x += 3.4) g += `<rect x="${r(x)}" y="${y - 1.6}" width="1.9" height="1.8" fill="#a77a52"/>`;
  return g;
}

{
  let k = `<path d="M142 102.6 L176 99.2 L176 101.2 L142 104.8 Z" fill="${S.lg("bruecke", [[0, "#e6d6b2"], [1, "#c4ad80"]])}"/>`;
  k += `<path d="M142 104.8 L176 101.2 L176 104.6 L142 108.6 Z" fill="${TRAV_H}"/>`;
  for (let i = 0; i < 5; i++) { const x = 143.6 + i * 6.4, y = 107.6 - i * 0.66; k += `<path d="M${r(x)} ${r(y + 0.8)} Q${r(x + 2.6)} ${r(y - 2.8)} ${r(x + 5.2)} ${r(y + 0.2)} Z" fill="#3e5650"/>`; }
  for (let i = 0; i < 6; i++) { const x = 143 + i * 6.4, y = 102.4 - i * 0.66; k += `<rect x="${r(x)}" y="${r(y - 2)}" width=".9" height="2.2" fill="#f4ecdc"/><circle cx="${r(x + 0.45)}" cy="${r(y - 2.4)}" r=".5" fill="#f4ecdc"/>`; }
  S.teil({ id: "bogen", de: "der Bogen", syl: "BO-gen", it: "l'arco", itSyl: "AR-co", en: "arch", x: 159, y: 108.6, kunst: abs(159, 108.6, k),
    tipp: "Die Engelsbrücke ruht seit fast 1900 Jahren auf steinernen Bögen; oben stehen zehn Engel." });
}

/* =====================================================================
   12 — DIE BALUSTRADE (Steinbrüstung der Terrasse)
   ===================================================================== */
{
  S.def(`<pattern id="${S.id("baluster")}" width="5" height="12" patternUnits="userSpaceOnUse"><path d="M1.4 12 L1.4 10.6 Q.8 9 1.6 7.6 Q.6 5.4 1.8 3.2 L1.8 1.4 L3.2 1.4 L3.2 3.2 Q4.4 5.4 3.4 7.6 Q4.2 9 3.6 10.6 L3.6 12 Z" fill="#e9dcc0"/><path d="M3.2 1.6 L3.2 3.2 Q4.4 5.4 3.4 7.6 Q4.2 9 3.6 10.6 L3.6 12" stroke="#a8977a" stroke-width=".4" fill="none"/></pattern>`);
  let k = `<rect x="0" y="113" width="320" height="16" fill="${S.lg("brschatten", [[0, "#5a5048", 0.25], [1, "#5a5048", 0.5]])}"/>`;
  k += `<rect x="0" y="115" width="320" height="12" fill="url(#${S.id("baluster")})"/>`;
  for (let x = 0; x <= 320; x += 64) k += `<rect x="${Math.min(x, 313)}" y="113" width="7" height="16" fill="${TRAV_H}"/>`;
  k += `<rect x="0" y="111" width="320" height="4" rx=".8" fill="${S.lg("brdeckel", [[0, "#f6ecd6"], [1, "#cdb994"]])}"/>`;
  k += `<rect x="0" y="127" width="320" height="3" fill="#c4b28e"/>`;
  S.teil({ id: "balustrade", de: "die Balustrade", syl: "Ba-lus-TRA-de", it: "la balaustra", itSyl: "ba-la-U-stra", en: "balustrade", x: 160, y: 130, kunst: abs(160, 130, k) });
}

/* =====================================================================
   13 — DIE PIAZZA (Piazzale Garibaldi, Pflaster aus Sampietrini)
   ===================================================================== */
{
  S.def(`<pattern id="${S.id("sampietrini")}" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" fill="#4a4844"/><rect x=".35" y=".35" width="2.3" height="2.3" rx=".5" fill="#6e6b64"/><rect x="3.35" y=".35" width="2.3" height="2.3" rx=".5" fill="#77746c"/><rect x=".35" y="3.35" width="2.3" height="2.3" rx=".5" fill="#7c7970"/><rect x="3.35" y="3.35" width="2.3" height="2.3" rx=".5" fill="#686560"/></pattern>`);
  let k = "";
  [[130, 142, 0.45], [142, 160, 0.65], [160, 200, 0.95]].forEach(([a, b, s], i) => {
    S.def(`<pattern id="${S.id("sp" + i)}" href="#${S.id("sampietrini")}" patternTransform="scale(${s} ${s * 0.6}) rotate(45)"/>`);
    k += `<rect x="0" y="${a}" width="320" height="${b - a}" fill="url(#${S.id("sp" + i)})"/>`;
  });
  k += `<rect x="0" y="130" width="320" height="70" fill="${S.lg("platzlicht", [[0, "#f4dcb4", 0.35], [0.5, "#f4dcb4", 0.08], [1, "#000", 0.12]])}"/>`;
  k += `<rect x="0" y="130" width="320" height="3" fill="#3a3632" opacity=".35"/>`;
  S.teil({ id: "piazza", de: "die Piazza", syl: "PIAZ-za", it: "la piazza", itSyl: "PIAZ-za", en: "square", x: 160, y: 200, kunst: abs(160, 200, k),
    tipp: "Die schwarzen Pflastersteine heißen in Rom „Sampietrini“ – kleine Peterchen." });
}

/* =====================================================================
   14 — DIE STATUE (Reiterstandbild Garibaldis auf dem Platz)
   ===================================================================== */
{
  let k = schatten(22, 150, 22, 2, 0.3);
  /* Sockel aus Travertin mit Bronzereliefs und Stufen */
  k += `<path d="M4 150 L40 150 L38 146 L6 146 Z" fill="#d8c8a2"/><rect x="8" y="104" width="28" height="42" fill="${TRAVERTIN}"/>`;
  k += `<rect x="7" y="102" width="30" height="3" fill="#f2e6c8"/><rect x="7" y="140" width="30" height="2.4" fill="#cdb994"/>`;
  k += `<rect x="11" y="112" width="22" height="18" fill="${BRONZE}" opacity=".85"/><path d="M13 128 q3 -6 6 -2 q3 -8 6 -1 q3 -5 6 1" stroke="#8a9a7a" stroke-width=".5" fill="none"/>`;
  k += `<text x="22" y="137" font-size="3.2" text-anchor="middle" fill="#7a6a4c" font-family="Georgia,serif" letter-spacing=".3">GARIBALDI</text>`;
  /* Pferd (stehend, Kopf nach rechts) und Reiter mit Hut und Poncho */
  const H = BRONZE;
  k += `<path d="M10 92 Q10 86 16 85 L28 85 Q33 85 34 88 L35 92 Q34 95 30 95 L15 95 Q10 95 10 92 Z" fill="${H}"/>`;
  k += `<path d="M30 86.4 Q32 80.6 35.4 77 L38.6 78.4 Q37.4 82 36 84.6 L35.4 90 Z" fill="${H}"/><path d="M35 77.6 Q36 74.8 38.4 75 L42.4 78.6 Q42.8 80.2 41.2 80.4 L38.4 79.6 Z" fill="${H}"/>`;
  k += `<path d="M31.6 82 Q33.6 78.6 35.8 76.6" stroke="#2a3428" stroke-width="1.2" fill="none"/>`;
  k += `<path d="M36 76.4 L35.4 74.6 L36.8 75.6 Z" fill="${H}"/>`;
  for (const [x, d] of [[13, 0], [16.4, 1], [29, -0.6], [32, 0.8]]) k += `<path d="M${x} 94 L${x + d} 102 L${x + d + 1.6} 102 L${x + 1.6} 94 Z" fill="${H}"/>`;
  k += `<path d="M10.4 88 Q7 92 8.4 99" stroke="${H}" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
  k += `<path d="M18 86 L18 79 Q20 75.4 23 76 Q25.6 77 25.4 80 L25 86 Z" fill="${H}"/><path d="M17.4 80.6 Q21.6 84 26 80.4 L25.6 84 Q21.6 86.6 17.6 84 Z" fill="#4e5a48"/>`;
  k += `<circle cx="22" cy="73.6" r="1.8" fill="${H}"/><path d="M19.4 72.6 L24.6 72.6 L23.6 70.8 L20.4 70.8 Z" fill="#2a3428"/><rect x="18.6" y="72.4" width="6.8" height=".7" rx=".3" fill="#2a3428"/>`;
  k += `<path d="M21 86 L20 91 L22 91 L22.6 86 Z" fill="#2e3a30"/>`;
  k += `<path d="M14 86 Q22 83.6 30 86" stroke="#9aab8a" stroke-width=".5" fill="none" opacity=".7"/><path d="M19 77 Q20 76 21.6 76.4" stroke="#9aab8a" stroke-width=".5" fill="none" opacity=".7"/>`;
  S.teil({ id: "statue", de: "die Statue", syl: "STA-tu-e", it: "la statua", itSyl: "STA-tua", en: "statue", x: 22, y: 150, kunst: abs(22, 150, k),
    tipp: "Das Reiterstandbild zeigt Giuseppe Garibaldi, einen Helden der Einigung Italiens." });
}

/* =====================================================================
   15 — DIE PINIE (Schirmpinie am Rand der Terrasse)
   ===================================================================== */
{
  let k = `<path d="M302 130 Q304 90 300 60 Q298 46 292 36 L296 35 Q302 44 304.6 58 Q308 86 306.4 130 Z" fill="${S.lg("stamm", [[0, "#8a6a52"], [0.5, "#6e4e38"], [1, "#4a3424"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M300 44 Q290 40 284 38 M304 50 Q312 44 318 42" stroke="#5a3e2c" stroke-width="1.4" fill="none"/>`;
  /* Schirmkrone: flach, dicht, mit Lichtkante oben */
  k += `<path d="M262 36 Q268 22 284 18 Q298 8 314 14 Q322 16 320 26 L320 40 Q306 44 290 42 Q272 44 262 36 Z" fill="${S.lg("krone", [[0, "#5e7e44"], [0.5, "#3f5e30"], [1, "#2a4220"]])}"/>`;
  for (let i = 0; i < 26; i++) { const x = 266 + rnd() * 52, y = 18 + rnd() * 20; k += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(2.4 + rnd() * 2)}" ry="${r(1.2 + rnd())}" fill="${rnd() < 0.5 ? "#6e8e50" : "#344e28"}" opacity=".8"/>`; }
  k += `<path d="M268 28 Q282 16 300 14" stroke="#9cb878" stroke-width="1.2" fill="none" opacity=".5"/>`;
  S.teil({ id: "pinie", de: "die Pinie", syl: "PI-nie", it: "il pino", itSyl: "PI-no", en: "pine tree", x: 304, y: 130, kunst: abs(304, 130, k),
    tipp: "Die Schirmpinie mit ihrer flachen Krone ist ein Wahrzeichen Roms." });
}

/* =====================================================================
   16 — DIE BANK, 17 — DER POSTKARTENSTÄNDER mit Forum und Trevibrunnen
   ===================================================================== */
{
  let k = schatten(0, 0.3, 22, 1.4, 0.3);
  k += `<path d="M-20 -6 L-20 0 M20 -6 L20 0 M-18 -6 L-17 0 M18 -6 L17 0" stroke="#2f3a32" stroke-width="1.4"/>`;
  k += `<path d="M-22 -7.6 L22 -7.6 L21 -5.6 L-21 -5.6 Z" fill="${S.lg("sitz", [[0, "#9a6a3e"], [1, "#6e4626"]])}"/>`;
  for (const y of [-17, -13.4]) k += `<rect x="-21" y="${y}" width="42" height="2.6" rx=".6" fill="#8a5c34"/>`;
  k += `<path d="M-19 -6 L-19.6 -18 M19 -6 L19.6 -18" stroke="#2f3a32" stroke-width="1.2"/>`;
  S.teil({ id: "bank", de: "die Bank", syl: "BANK", it: "la panchina", itSyl: "pan-CHI-na", en: "bench", x: 200, y: 168, steht: true, kunst: k });
}
const PK = { x: 236, y: 186 };
const karte = (x, y, inhalt, w = 9, h = 6.6) => `<g transform="translate(${x} ${y})"><rect x="-.4" y="-.4" width="${w + 0.8}" height="${h + 0.8}" fill="#fbfaf6"/><g>${inhalt}</g><rect x="0" y="0" width="${w}" height="${h}" fill="none" stroke="#d8d4ca" stroke-width=".2"/></g>`;
{
  let k = schatten(0, 0.3, 9, 1.2, 0.3);
  k += `<path d="M-7 0 L0 -3 L7 0" stroke="#3a3e42" stroke-width="1" fill="none"/><rect x="-.6" y="-52" width="1.2" height="50" fill="${S.lg("rohr", [[0, "#c9cfd4"], [1, "#6e767c"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-10.6" y="-54" width="21.2" height="2" rx=".6" fill="#b8282a"/><text x="0" y="-52.4" font-size="1.6" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">CARTOLINE</text>`;
  for (const y of [-51, -41.6, -32.2, -22.8]) k += `<rect x="-10.4" y="${y + 6.8}" width="20.8" height=".6" fill="#8a9298"/>`;
  /* weitere Karten: Petersdom, Kolosseum, Spanische Treppe, Engelsburg, Vespa, Pizza */
  const motiv = {
    himmel: `<rect width="9" height="6.6" fill="#8fbbe0"/>`,
    kuppel: `<rect y="4.4" width="9" height="2.2" fill="#e2cfa4"/><path d="M2.6 4.4 Q4.5 .8 6.4 4.4 Z" fill="#8494a3"/>`,
    kolo: `<rect y="5" width="9" height="1.6" fill="#b8a27a"/><path d="M1 5 L1 2 Q4.5 1 8 2 L8 5 Z" fill="#d4b984"/><path d="M1.6 4.6 v-1.2 M2.8 4.6 v-1.2 M4 4.6 v-1.2 M5.2 4.6 v-1.2 M6.4 4.6 v-1.2" stroke="#6e5638" stroke-width=".5"/>`,
    treppe: `<path d="M2 6.6 L3.6 3 L5.4 3 L7 6.6 Z" fill="#efe4cc"/><rect x="3.4" y="1" width="2.2" height="2" fill="#f1e2c2"/>`,
    vespa: `<rect width="9" height="6.6" fill="#f4d7a8"/><circle cx="2.6" cy="5" r=".9" fill="#222"/><circle cx="6.6" cy="5" r=".9" fill="#222"/><path d="M2 4.4 Q3 2.4 6.4 3 L7.4 4.6 Z" fill="#7fc3b0"/>`,
    pizza: `<rect width="9" height="6.6" fill="#2a6a3a"/><circle cx="4.5" cy="3.3" r="2.4" fill="#e8b45a"/><circle cx="3.6" cy="2.8" r=".5" fill="#c43a2a"/><circle cx="5.4" cy="3.8" r=".5" fill="#c43a2a"/>`,
  };
  const pos = [[-10.2, -44.2, "kolo"], [0.6, -44.2, "kuppel"], [-10.2, -34.8, "treppe"], [0.6, -34.8, "vespa"], [-10.2, -25.4, "pizza"], [0.6, -25.4, "kuppel"]];
  for (const [x, y, m] of pos) k += karte(x, y, (m === "vespa" || m === "pizza" ? "" : motiv.himmel) + motiv[m]);
  S.teil({ id: "postkartenstaender", de: "der Postkartenständer", syl: "post-KAR-ten-stän-der", it: "l'espositore di cartoline", itSyl: "e-spo-si-TO-re di car-to-LI-ne", en: "postcard rack", x: PK.x, y: PK.y, steht: true, kunst: k });
}
{
  /* Postkarte: das Forum Romanum (drei Säulen des Castor-Tempels, Bogen) */
  let m = `<rect width="9" height="6.6" fill="#9cc3e2"/><rect y="5.2" width="9" height="1.4" fill="#c9b184"/>`;
  m += `<rect x="1.2" y="1.2" width=".8" height="4" fill="#efe2c4"/><rect x="2.6" y="1.2" width=".8" height="4" fill="#efe2c4"/><rect x="4" y="1.2" width=".8" height="4" fill="#efe2c4"/><rect x=".9" y=".6" width="4.2" height=".7" fill="#e2d2ae"/>`;
  m += `<path d="M5.6 5.2 L5.6 2.4 L8.4 2.4 L8.4 5.2 L7.6 5.2 Q7 3.6 6.4 5.2 Z" fill="#d8c498"/>`;
  m += `<text x="4.5" y="6.3" font-size=".9" text-anchor="middle" fill="#fff" font-family="Georgia">FORO ROMANO</text>`;
  S.teil({ oben: true, id: "forum", de: "das Forum Romanum", syl: "FO-rum Ro-MA-num", it: "il Foro Romano", itSyl: "FO-ro ro-MA-no", en: "Roman Forum", x: PK.x - 5.7, y: PK.y - 47, kunst: karte(-4.5, -6.6, m), lupe: LUPE,
    tipp: "Das Forum war der Marktplatz und das Herz des antiken Rom." });
}
{
  /* Postkarte: der Trevibrunnen (Palastfassade, Mittelnische, Becken) */
  let m = `<rect width="9" height="6.6" fill="#efe2c4"/><rect x=".6" y="1" width="7.8" height="3.6" fill="#e6d4ac"/><rect x="3.6" y="1.6" width="1.8" height="3" rx=".8" fill="#c9b184"/><circle cx="4.5" cy="3" r=".45" fill="#fbf7ee"/>`;
  m += `<path d="M1.2 1.2 v3.2 M2.4 1.2 v3.2 M6.6 1.2 v3.2 M7.8 1.2 v3.2" stroke="#fbf3dc" stroke-width=".4"/><rect y="4.6" width="9" height="2" fill="#5fb4c8"/><path d="M1.6 4.6 Q4.5 3.6 7.4 4.6" fill="#d8c8a2"/>`;
  m += `<text x="4.5" y="6.3" font-size=".9" text-anchor="middle" fill="#fff" font-family="Georgia">FONTANA DI TREVI</text>`;
  S.teil({ oben: true, id: "trevibrunnen", de: "der Trevibrunnen", syl: "TRE-vi-brun-nen", it: "la Fontana di Trevi", itSyl: "fon-TA-na di TRE-vi", en: "Trevi Fountain", x: PK.x + 5.1, y: PK.y - 47, kunst: karte(-4.5, -6.6, m), lupe: LUPE,
    tipp: "Wer eine Münze über die Schulter in den Brunnen wirft, kommt nach Rom zurück." });
}

/* =====================================================================
   18 — DIE PIZZERIA (Kiosk mit Pizza al taglio und Gelato) — Lupe
   ===================================================================== */
const KI = { x0: 252, x1: 318, y: 188 };
{
  const cx = (KI.x0 + KI.x1) / 2, W = KI.x1 - KI.x0;
  let k = schatten(0, 0.4, W / 2 + 2, 2, 0.32);
  /* Korpus in Kiosk-Grün, Dach mit Schild, Markise rot-weiß */
  k += `<rect x="${-W / 2}" y="-60" width="${W}" height="60" fill="${S.lg("kiosk", [[0, "#3e6e4c"], [1, "#2a4e36"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${-W / 2 - 2}" y="-75" width="${W + 4}" height="15" rx="1" fill="#24402e"/>`;
  k += `<text x="0" y="-64.2" font-size="6" text-anchor="middle" fill="#f6e7b4" font-family="Georgia,serif" font-weight="bold" letter-spacing=".8" dy="-2.4">PIZZERIA</text>`;
  k += `<text x="0" y="-61.4" font-size="2.4" text-anchor="middle" fill="#f6e7b4" font-family="Arial" letter-spacing=".6">PIZZA AL TAGLIO · GELATO</text>`;
  for (let i = 0; i < 11; i++) k += `<path d="M${-W / 2 - 2 + i * 6.4} -59.6 L${-W / 2 - 2 + (i + 1) * 6.4} -59.6 L${-W / 2 - 2 + (i + 1) * 6.4 + 1} -52 L${-W / 2 - 2 + i * 6.4 + 1} -52 Z" fill="${i % 2 ? "#f6f2ea" : "#c8302c"}"/>`;
  let saum = `M${-W / 2 - 1} -52`;
  for (let i = 0; i < 11; i++) saum += ` Q${-W / 2 - 1 + i * 6.4 + 3.2} -48.6 ${-W / 2 - 1 + (i + 1) * 6.4} -52`;
  k += `<path d="${saum} Z" fill="#c8302c"/>`;
  /* Fenster: hinten Backofen, Ablage mit Pizzablechen; rechts Eisvitrine */
  k += `<rect x="${-W / 2 + 3}" y="-47" width="${W - 6}" height="22" fill="${S.lg("innen", [[0, "#f3e6cc"], [1, "#d8c49a"]])}"/>`;
  k += `<rect x="-29" y="-45" width="14" height="10" rx="1" fill="#6e6a64"/><path d="M-27 -36 Q-22 -42 -17 -36 Z" fill="#2a2420"/><ellipse cx="-22" cy="-37" rx="3" ry="1" fill="#ff9a3a"/>`;
  k += `<rect x="-10" y="-44" width="9" height="12" rx=".6" fill="#f6f2ea" stroke="#b8a888" stroke-width=".3"/>`;
  for (let i = 0; i < 4; i++) k += `<rect x="-9" y="${-42.6 + i * 2.6}" width="7" height=".5" fill="#8a7a5a"/>`;
  k += `<text x="-5.5" y="-42.8" font-size="1.5" text-anchor="middle" fill="#c8302c" font-family="Arial" font-weight="bold">MENÙ</text>`;
  /* Theke: links Pizza-Bleche, rechts Eisvitrine mit Gelato-Wannen */
  k += `<rect x="${-W / 2}" y="-25" width="${W}" height="25" fill="${S.lg("theke", [[0, "#e9e2d2"], [1, "#b9ad96"]])}"/>`;
  k += `<rect x="${-W / 2 - 1}" y="-26" width="${W + 2}" height="2.2" rx=".6" fill="#8a7a62"/>`;
  const PIZZA = [["#c43a2a", "#f2e2b0"], ["#e8c45a", "#7a9a3a"], ["#c43a2a", "#6e4a2a"]];
  PIZZA.forEach(([a, b], i) => {
    const x = -30 + i * 9.6;
    k += `<path d="M${x} -26.4 L${x + 8.4} -26.4 L${x + 9.2} -28.6 L${x - 0.8} -28.6 Z" fill="#9aa3aa"/><path d="M${x + 0.2} -28.4 L${x + 8.2} -28.4 L${x + 8.6} -30 L${x - 0.2} -30 Z" fill="${a}"/>`;
    for (let j = 0; j < 4; j++) k += `<circle cx="${r(x + 1 + j * 2)}" cy="-29.2" r=".55" fill="${b}"/>`;
    k += `<path d="M${x + 4.2} -30 L${x + 4.2} -28.4" stroke="#e8c88a" stroke-width=".3"/>`;
  });
  k += `<path d="M2 -26 L30 -26 L28 -34 L4 -34 Z" fill="#dfeff4" opacity=".55" stroke="#9ab4bc" stroke-width=".4"/>`;
  const GEL = ["#f4e3b0", "#7a4a2a", "#f2a0b4", "#a8d47a", "#f6f0e2", "#e04a3a"];
  GEL.forEach((f, i) => { const x = 5 + i * 4.1; k += `<rect x="${x}" y="-28.6" width="3.6" height="2.4" fill="#c9cfd4"/><path d="M${x + 0.1} -28.6 Q${x + 1.8} -31.6 ${x + 3.5} -28.6 Z" fill="${f}"/>`; });
  k += `<path d="M2 -26 L30 -26 L28 -34 L4 -34 Z" fill="none" stroke="#9ab4bc" stroke-width=".4"/>`;
  /* Waffel mit drei Kugeln auf der Theke */
  k += `<path d="M24.4 -26.4 L25.6 -20 L26.8 -26.4 Z" fill="#d8a45a" transform="translate(0 -6)"/>`;
  /* Front: Paneele */
  for (let i = 0; i < 4; i++) k += `<rect x="${-W / 2 + 3 + i * 15.4}" y="-21" width="13.4" height="17" rx="1" fill="none" stroke="#9a8e78" stroke-width=".5"/>`;
  k += `<rect x="${-W / 2}" y="-60" width="2" height="60" fill="#1e3826"/><rect x="${W / 2 - 2}" y="-60" width="2" height="60" fill="#1e3826"/>`;
  const unter = [
    { id: "pizza", de: "die Pizza", syl: "PIZ-za", it: "la pizza", itSyl: "PIZ-za", en: "pizza", x: cx - 16, y: KI.y - 26, kunst: flaeche(-15, -5, 30, 5.4), tipp: "„Pizza al taglio“ wird vom Blech in Stücken verkauft und nach Gewicht bezahlt." },
    { id: "gelato", de: "das Eis", syl: "EIS", it: "il gelato", itSyl: "ge-LA-to", en: "ice cream", x: cx + 16, y: KI.y - 26, kunst: flaeche(-14.4, -8.6, 28.8, 9), tipp: "In Italien heißt Speiseeis „Gelato“." },
    { id: "speisekarte", de: "die Speisekarte", syl: "SPEI-se-kar-te", it: "il menù", itSyl: "me-NÙ", en: "menu", x: cx - 5.5, y: KI.y - 32, kunst: flaeche(-4.8, -12.4, 9.6, 12.8) },
  ];
  S.teil({ id: "pizzeria", de: "die Pizzeria", syl: "Piz-ze-RI-a", it: "la pizzeria", itSyl: "piz-ze-RI-a", en: "pizzeria", x: cx, y: KI.y, steht: true, kunst: k,
    zoom: { x: KI.x0 - 2, y: KI.y - 50, w: W + 4, h: 46 }, unter });
}

/* =====================================================================
   19 — DIE VESPA (geparkt auf dem Platz)
   ===================================================================== */
{
  let k = schatten(0, 0.4, 26, 1.8, 0.35);
  const LACK = S.lg("lack", [[0, "#a8dccb"], [0.5, "#78bfa8"], [1, "#4e9480"]]);
  /* Räder */
  for (const x of [-16, 17]) k += `<circle cx="${x}" cy="-6" r="6" fill="#1d1d1f"/><circle cx="${x}" cy="-6" r="3.6" fill="#c9cfd4"/><circle cx="${x}" cy="-6" r="1.4" fill="#6e767c"/>`;
  /* Heckhaube (Bauch), Trittbrett, Beinschild, Lenker, Scheinwerfer, Sitz */
  k += `<path d="M-26 -10 Q-27 -22 -14 -24 Q-2 -24 0 -16 L1 -9 L-24 -9 Q-26 -9 -26 -10 Z" fill="${LACK}"/>`;
  k += `<path d="M-2 -9 L12 -9 L12 -12 L-2 -12 Z" fill="#4a4e52"/><path d="M-2 -12.6 L12 -12.6" stroke="#b9c0c6" stroke-width=".6"/>`;
  k += `<path d="M11 -9 Q12 -24 16 -34 L19.4 -34 Q16 -24 17 -12 Q22 -10 23 -6 L18 -6 Q16 -9 11 -9 Z" fill="${LACK}"/>`;
  k += `<path d="M14 -12 Q22 -12 23.4 -6 L10 -6 Q11 -10 14 -12 Z" fill="${LACK}"/>`;
  k += `<rect x="15" y="-38" width="5.6" height="4.4" rx="2" fill="${LACK}"/><path d="M12 -37.6 L24 -37.6" stroke="#2a2a2c" stroke-width="1.2" stroke-linecap="round"/>`;
  k += `<circle cx="20.6" cy="-35.6" r="2" fill="#f6f2e2" stroke="#b9c0c6" stroke-width=".6"/>`;
  k += `<path d="M-22 -24 Q-14 -27.4 -5 -25 L-5 -22.6 Q-14 -24.6 -22 -21.6 Z" fill="#6e3a24"/>`;
  k += `<path d="M-24 -18 Q-20 -22 -10 -22.4" stroke="#fff" stroke-width="1" opacity=".4" fill="none"/>`;
  k += `<rect x="-27" y="-15" width="2.4" height="1.6" rx=".4" fill="#d23b30"/>`;
  S.teil({ id: "vespa", de: "die Vespa", syl: "VES-pa", it: "la Vespa", itSyl: "VE-spa", en: "scooter", x: 66, y: 188, steht: true, kunst: k,
    tipp: "„Vespa“ heißt Wespe – der Motorroller aus Italien ist seit 1946 berühmt." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/rom.js"));
console.log(aus);
