#!/usr/bin/env node
/* =====================================================================
   DIE HAND GANZ NAH (FASSUNG 852) — Bilderwelt neu, Detail-Szene
   (geöffnet über die Lupe aus „koerper“)
   ---------------------------------------------------------------------
   RECHERCHE (Anthropometrie der Hand; Beugefalten als Marker der
   Gelenke, Folia Morphologica „functional hand proportions“):
   - Handlänge (Handgelenksfalte bis Mittelfingerspitze) ≈ 19 cm,
     Mittelhand ≈ 11 cm, Mittelfinger ≈ 8 cm, Handbreite ≈ 8,5 cm.
   - Reihenfolge der Längen: Mittelfinger > Ringfinger ≈ Zeigefinger >
     kleiner Finger; der kleine Finger setzt tiefer an.
   - Innenseite: Beugefalten an jedem Fingergelenk, Fingerkuppen mit
     Polstern, drei Hauptlinien (Lebens-, Kopf-, Herzlinie), der
     Daumenballen. Außenseite: Fingernägel mit Nagelmond, Knöchel,
     Sehnen und Adern auf dem Handrücken.
   Darstellung wie im Lehrbuch: dieselbe (linke) Hand zweimal —
   links die Innenseite, rechts der Handrücken; Daumen jeweils außen.
   Die Arme stecken in Pulloverärmeln.
   Maßstab: ≈ 8,3 Einheiten je Zentimeter (Handlänge 157 Einheiten).
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "hand_detail", titel: "Die Hand ganz nah", emoji: "🔍", thema: "Körper", kuerzel: "b27b", fassung: 852 });
const rnd = zufall(2702);
const r = B.r;
const MX = 320;
const SP = (svg) => `<g transform="matrix(-1 0 0 1 ${MX} 0)">${svg}</g>`;     /* rechte Hand = Spiegelbild der linken */
const A = (cx, cy, svg) => `<g transform="translate(${-cx} ${-cy})">${svg}</g>`;

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("w1")}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation=".7"/></filter>`);
S.def(`<filter id="${S.id("w4")}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4"/></filter>`);
const W1 = `filter="url(#${S.id("w1")})"`;
const INNEN = S.lg("innen", [[0, "#d9a082"], [0.25, "#efc3a6"], [0.55, "#f6d2b8"], [0.85, "#ebbb9d"], [1, "#d29a7c"]], 0, 0, 1, 0);
const AUSSEN = S.lg("aussen", [[0, "#c88f6e"], [0.25, "#e2ad8b"], [0.55, "#ebbd9c"], [0.85, "#dca582"], [1, "#c48b6a"]], 0, 0, 1, 0);
const FLAECHE_I = S.rg("flaechei", [[0, "#f8d8c0"], [0.6, "#efc2a5"], [1, "#dca587"]], 0.5, 0.45, 0.6);
const FLAECHE_A = S.rg("flaechea", [[0, "#efc3a2"], [0.6, "#e2ad8b"], [1, "#cf9675"]], 0.45, 0.4, 0.65);
const KUPPE = S.rg("kuppe", [[0, "#f9cfc0"], [0.7, "#f2bca8", 0.7], [1, "#eab49e", 0]]);
const NAGEL = S.lg("nagel", [[0, "#f4dcd2"], [0.3, "#efc2b6"], [1, "#e6ad9e"]]);
const KNOE = S.rg("knoechel", [[0, "#f8dcc6"], [0.6, "#eebf9f", 0.7], [1, "#e2ad8b", 0]], 0.5, 0.4, 0.55);
const STRICK = S.lg("strick", [[0, "#3d6a74"], [0.5, "#4f818c"], [1, "#355d66"]], 0, 0, 1, 0);

/* Finger der LINKEN Hand, Innenseite (Daumen links). Fußpunkt, Neigung, Länge, Breite */
const F = {
  zeigefinger: { bx: 75, by: 90, a: -7, L: 61, w: 16 },
  mittelfinger: { bx: 92, by: 86, a: -1, L: 68, w: 16.6 },
  ringfinger: { bx: 108, by: 89, a: 5, L: 63, w: 15.6 },
  kleinerfinger: { bx: 123, by: 99, a: 12, L: 48, w: 13.4 },
  daumen: { bx: 72, by: 146, a: -41, L: 56, w: 19.5 },
};
const T = (f, svg) => `<g transform="translate(${f.bx} ${f.by}) rotate(${f.a})">${svg}</g>`;
const fingerForm = (f) => {
  const w = f.w, w2 = w * 0.86, L = f.L;
  return `M${r(-w / 2)} 8 C${r(-w / 2)} ${r(-L * 0.4)} ${r(-w2 / 2)} ${r(-L * 0.75)} ${r(-w2 / 2)} ${r(-L + w2 / 2)} A${r(w2 / 2)} ${r(w2 * 0.55)} 0 0 1 ${r(w2 / 2)} ${r(-L + w2 / 2)} C${r(w2 / 2)} ${r(-L * 0.75)} ${r(w / 2)} ${r(-L * 0.4)} ${r(w / 2)} 8 Z`;
};
const falte = (w, y, bogen = 1.2, op = 0.55, f = "#b77a5f") => `<path d="M${r(-w * 0.38)} ${r(y)} q${r(w * 0.38)} ${bogen} ${r(w * 0.76)} 0" stroke="${f}" stroke-width=".55" opacity="${op}" fill="none"/>`;

/* Umriss der Hand ohne Finger (Mittelhand) — linke Hand, Innenseite */
/* Innenseite: Oberkante = Beugefalten am Fingeransatz; Rücken: Bögen über den Knöcheln */
const MITTELHAND_I = `M79 172 C71 162 62 147 61.5 131 C61 116 62.6 103 66 94 Q75 95.4 83.5 87.4 Q92 91.4 100 88 Q108 92.4 116 93.8 Q123 99.6 130.4 101.6 C135 104 137.4 107 137.4 113 C138 133 134.6 151 124 172 Z`;
const MITTELHAND_A = `M79 172 C71 162 62 147 61.5 131 C61 116 62.6 103 66 94 Q74 87 83.5 87.4 Q92 81.6 100 88 Q108 84.4 116 93 Q123 91.6 130.4 101.6 C135 104 137.4 107 137.4 113 C138 133 134.6 151 124 172 Z`;
const MITTELHAND = `M79 172 C71 162 62 147 61.5 131 C61 116 62.6 103 66 92 C68 86 71 82 77 80.5 L131 85 C135 91 137.4 101 137.4 113 C138 133 134.6 151 124 172 Z`;
const ARM = `M79 164 C80 176 79 188 77.6 201 L122.4 201 C121 188 120.6 176 121.4 164 Z`;

/* =====================================================================
   KULISSE — heller Grund, weicher Schatten hinter den Händen
   ===================================================================== */
S.hinten(`<rect width="320" height="200" fill="${S.lg("grund", [[0, "#eef0f1"], [1, "#d3d9dd"]])}"/>`);
S.hinten(`<rect width="320" height="200" fill="${S.rg("grundl", [[0, "#ffffff", 0.7], [1, "#ffffff", 0]], 0.5, 0.35, 0.6)}"/>`);
{
  let sch = `<g opacity=".22" filter="url(#${S.id("w4")})" transform="translate(4 5)"><path d="${MITTELHAND}" fill="#3a3f45"/><path d="${ARM}" fill="#3a3f45"/>`;
  for (const f of Object.values(F)) sch += T(f, `<path d="${fingerForm(f)}" fill="#3a3f45"/>`);
  sch += `</g>`;
  S.hinten(sch + `<g transform="matrix(-1 0 0 1 ${MX - 8} 0)">${sch}</g>`);
}

/* =====================================================================
   LINKS — DIE INNENSEITE
   ===================================================================== */
{
  const f = F.daumen;
  let g = `<path d="${fingerForm(f)}" fill="${INNEN}"/>`;
  g += falte(f.w, -f.L * 0.52, 1.4, 0.6) + falte(f.w, -f.L * 0.52 + 1.4, 1.1, 0.4);
  g += `<path d="M${r(-f.w * 0.1)} ${r(-f.L * 0.95)} q${r(f.w * 0.3)} 4 ${r(f.w * 0.1)} 14" stroke="#fff3e8" stroke-width="2.4" opacity=".35" fill="none" ${W1}/>`;
  S.teil({ id: "daumen", de: "der Daumen", syl: "DAU-men", it: "il pollice", itSyl: "POL-li-ce", en: "thumb", x: 52, y: 120, kunst: A(52, 120, T(f, g)),
    tipp: "Der Daumen hat nur zwei Glieder, die anderen Finger haben drei." });
}
const FINGER_I = [["kleinerfinger", "der kleine Finger", "KLEI-ne FIN-ger", "il mignolo", "MI-gno-lo", "little finger"],
  ["ringfinger", "der Ringfinger", "RING-fin-ger", "l'anulare", "a-nu-LA-re", "ring finger"],
  ["mittelfinger", "der Mittelfinger", "MIT-tel-fin-ger", "il medio", "ME-dio", "middle finger"],
  ["zeigefinger", "der Zeigefinger", "ZEI-ge-fin-ger", "l'indice", "IN-di-ce", "index finger"]];
for (const [id, de, syl, it, itSyl, en] of FINGER_I) {
  const f = F[id];
  let g = `<path d="${fingerForm(f)}" fill="${INNEN}"/>`;
  /* Beugefalten: Grundgelenk (doppelt), Mittelgelenk (doppelt), Endgelenk */
  g += falte(f.w, -1, 1.2, 0.6) + falte(f.w, 0.6, 1, 0.4);
  g += falte(f.w, -f.L * 0.47, 1.3, 0.6) + falte(f.w, -f.L * 0.47 + 1.3, 1.1, 0.45);
  g += falte(f.w, -f.L * 0.74, 1.1, 0.5);
  g += `<path d="M${r(-f.w * 0.12)} ${r(-f.L * 0.7)} L${r(-f.w * 0.1)} ${r(-f.L * 0.1)}" stroke="#fff3e8" stroke-width="2.2" opacity=".28" ${W1}/>`;
  const tipp = id === "zeigefinger" ? "Mit dem Zeigefinger zeigt man auf etwas." : null;
  S.teil({ id, de, syl, it, itSyl, en, x: f.bx, y: f.by - f.L * 0.5, kunst: A(f.bx, f.by - f.L * 0.5, T(f, g)), tipp });
}
{
  let k = `<path d="${ARM}" fill="${INNEN}"/>`;
  k += `<path d="M84 174.6 C94 176.6 106 176.6 116 174.6 M83.4 178 C94 180 106 180 116.6 178" stroke="#b7795d" stroke-width=".55" opacity=".5" fill="none"/>`;
  /* Pulsader und Sehnen am Unterarm, ganz zart */
  k += `<path d="M96 175 C96 182 95.6 188 95 194 M104 175 C104 182 104.4 188 105 194" stroke="#d9a084" stroke-width="1.6" opacity=".35" fill="none" ${W1}/>`;
  k += `<path d="M114 176 C114 184 113.6 190 113 196" stroke="#8fa0c4" stroke-width="1" opacity=".22" fill="none" ${W1}/>`;
  S.teil({ id: "handgelenk", de: "das Handgelenk", syl: "HAND-ge-lenk", it: "il polso", itSyl: "POL-so", en: "wrist", x: 100, y: 172, kunst: A(100, 172, k),
    tipp: "Am Handgelenk kann man den Puls fühlen." });
}
{
  let k = `<path d="${MITTELHAND_I}" fill="${FLAECHE_I}"/>`;
  /* Mulde in der Mitte, Ballen unter den Fingern */
  k += `<ellipse cx="102" cy="124" rx="13" ry="15" fill="#c98b6e" opacity=".07" ${W1}/>`;
  for (const f of [F.zeigefinger, F.mittelfinger, F.ringfinger, F.kleinerfinger]) k += `<ellipse cx="${f.bx + f.a * 0.3}" cy="${f.by + 6}" rx="${r(f.w * 0.42)}" ry="4.2" fill="#fbe0cc" opacity=".45" ${W1}/>`;
  k += `<path d="M126 118 C132 128 133 146 127 162" stroke="#fbe0cc" stroke-width="6" opacity=".18" fill="none" filter="url(#bw_weich)"/>`;
  S.teil({ id: "handflaeche", de: "die Handfläche", syl: "HAND-flä-che", it: "il palmo", itSyl: "PAL-mo", en: "palm", x: 108, y: 132, kunst: A(108, 132, k) });
}
{
  const k = `<path d="M63 112 C75 113 85 127 89.6 148 C91 158 87 165 81 167.6 C72 161 63.4 149 61.6 134 C61 125 61.6 117 63 112 Z" fill="${S.rg("ballen", [[0, "#fbdcc6"], [0.6, "#f0c2a5", 0.8], [1, "#e4ae90", 0]], 0.42, 0.5, 0.6)}"/>`;
  S.teil({ id: "daumenballen", de: "der Daumenballen", syl: "DAU-men-bal-len", it: "l'eminenza tenar", itSyl: "e-mi-NEN-za TE-nar", en: "ball of the thumb", x: 75, y: 142, kunst: A(75, 142, k) });
}
{
  /* Lebenslinie, Kopflinie, Herzlinie */
  const linie = (d, b) => `<path d="${d}" stroke="#ad6d55" stroke-width="${b}" fill="none" stroke-linecap="round" opacity=".8"/><path d="${d}" stroke="#fff1e4" stroke-width=".5" fill="none" opacity=".55" transform="translate(.5 .6)"/>`;
  let k = linie("M67.6 104.6 C80 109 84.6 128 88.6 150 C89.6 156 90.6 160 92 164", 1.05);
  k += linie("M68.4 105.4 C84 110 102 114.6 124.6 123.6", 0.95);
  k += linie("M135.4 106 C124 101.6 110 99.6 96 99.6 C90 99.8 86 98.6 82.6 96.4", 0.95);
  k += `<path d="M99 160 C101 146 104 132 108 118" stroke="#b77a5f" stroke-width=".5" opacity=".4" fill="none"/>`;
  S.teil({ id: "handlinie", de: "die Handlinie", syl: "HAND-li-ni-e", it: "la linea della mano", itSyl: "LI-ne-a DEL-la MA-no", en: "palm line", x: 104, y: 112, kunst: A(104, 112, k),
    tipp: "Jeder Mensch hat eigene Handlinien — wie einen Fingerabdruck." });
}
{
  let k = "";
  for (const f of [F.zeigefinger, F.mittelfinger, F.ringfinger, F.kleinerfinger, F.daumen]) {
    const w2 = f.w * 0.86;
    k += T(f, `<ellipse cx="0" cy="${r(-f.L + w2 * 0.78)}" rx="${r(w2 * 0.4)}" ry="${r(w2 * 0.6)}" fill="${KUPPE}"/>`
      + `<path d="M${r(-w2 * 0.22)} ${r(-f.L + w2 * 0.55)} q${r(w2 * 0.22)} -1.2 ${r(w2 * 0.44)} 0 M${r(-w2 * 0.26)} ${r(-f.L + w2 * 0.85)} q${r(w2 * 0.26)} -1.4 ${r(w2 * 0.52)} 0" stroke="#cf8f7a" stroke-width=".25" opacity=".55" fill="none"/>`);
  }
  S.teil({ id: "fingerkuppe", de: "die Fingerkuppe", syl: "FIN-ger-kup-pe", it: "il polpastrello", itSyl: "pol-pa-STREL-lo", en: "fingertip", x: 90, y: 26, kunst: A(90, 26, k),
    tipp: "Auf den Fingerkuppen sind feine Linien — der Fingerabdruck." });
}

/* =====================================================================
   RECHTS — DER HANDRÜCKEN (gespiegelte Form derselben Hand)
   ===================================================================== */
{
  let k = "";
  for (const f of Object.values(F)) {
    let g = `<path d="${fingerForm(f)}" fill="${AUSSEN}"/>`;
    /* Knitterfalten über Mittel- und Endgelenk */
    const y1 = f === F.daumen ? -f.L * 0.52 : -f.L * 0.47;
    for (let i = 0; i < 3; i++) g += `<path d="M${r(-f.w * 0.26)} ${r(y1 - 1.6 + i * 1.3)} q${r(f.w * 0.26)} ${r(-1.6 + i * 0.4)} ${r(f.w * 0.52)} 0" stroke="#a96f52" stroke-width=".4" opacity="${0.5 - i * 0.1}" fill="none"/>`;
    if (f !== F.daumen) g += `<path d="M${r(-f.w * 0.16)} ${r(-f.L * 0.75)} q${r(f.w * 0.16)} -.9 ${r(f.w * 0.32)} 0" stroke="#a96f52" stroke-width=".35" opacity=".4" fill="none"/>`;
    g += `<ellipse cx="0" cy="${r(y1)}" rx="${r(f.w * 0.3)}" ry="2.6" fill="#f6d2b6" opacity=".35" ${W1}/>`;
    k += T(f, g);
  }
  S.teil({ id: "finger", de: "die Finger", syl: "FIN-ger", it: "le dita", itSyl: "DI-ta", en: "fingers", x: 228, y: 60, kunst: A(228, 60, SP(k)),
    tipp: "Eine Hand hat fünf Finger: Daumen, Zeigefinger, Mittelfinger, Ringfinger und kleiner Finger." });
}
{
  let k = `<path d="${ARM}" fill="${AUSSEN}"/><path d="${MITTELHAND_A}" fill="${FLAECHE_A}"/>`;
  k += `<path d="M79 166 C90 162 110 162 121 166 L121.4 170 C110 166 90 166 79 170 Z" fill="${AUSSEN}"/>`;
  /* Strecksehnen fächern vom Handgelenk zu den Knöcheln */
  for (const f of [F.zeigefinger, F.mittelfinger, F.ringfinger, F.kleinerfinger]) k += `<path d="M${r(96 + (f.bx - 98) * 0.25)} 162 Q${r((f.bx + 98) / 2)} 128 ${r(f.bx + f.a * 0.2)} ${f.by + 10}" stroke="#f6d0b4" stroke-width="1.3" opacity=".3" fill="none" ${W1}/>`;
  /* Adern */
  k += `<path d="M112 168 C110 150 116 136 112 118 M112 140 C104 132 98 126 92 112" stroke="#8b96c0" stroke-width="1.1" opacity=".15" fill="none" ${W1}/>`;
  k += `<path d="M66 100 C70 116 74 130 80 140" stroke="#b07859" stroke-width="2.4" opacity=".2" fill="none" ${W1}/>`;
  S.teil({ id: "handruecken", de: "der Handrücken", syl: "HAND-rü-cken", it: "il dorso della mano", itSyl: "DOR-so del-la MA-no", en: "back of the hand", x: 220, y: 136, kunst: A(220, 136, SP(k)) });
}
{
  let k = "";
  for (const f of [F.zeigefinger, F.mittelfinger, F.ringfinger, F.kleinerfinger]) {
    const x = f.bx + f.a * 0.15, y = f.by + 5;
    k += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(f.w * 0.42)}" ry="5" fill="${KNOE}"/>`;
    k += `<path d="M${r(x - 3)} ${r(y + 2.6)} q3 1.4 6 0" stroke="#b07a5c" stroke-width=".4" opacity=".45" fill="none"/>`;
  }
  S.teil({ id: "knoechel", de: "der Knöchel", syl: "KNÖ-chel", it: "la nocca", itSyl: "NOC-ca", en: "knuckle", x: 222, y: 96, kunst: A(222, 96, SP(k)) });
}
{
  let k = "";
  for (const f of Object.values(F)) {
    const w2 = f.w * 0.86, L = f.L, nw = w2 * 0.66, nl = f === F.daumen ? 14 : L * 0.2;
    const y0 = -L + 1.4, y1 = y0 + nl;
    let g = `<path d="M${r(-nw / 2)} ${r(y1)} L${r(-nw / 2)} ${r(y0 + 3)} Q${r(-nw / 2)} ${r(y0)} 0 ${r(y0 - 0.2)} Q${r(nw / 2)} ${r(y0)} ${r(nw / 2)} ${r(y0 + 3)} L${r(nw / 2)} ${r(y1)} Q0 ${r(y1 + 1.4)} ${r(-nw / 2)} ${r(y1)} Z" fill="${NAGEL}" stroke="#c78f7c" stroke-width=".3"/>`;
    g += `<path d="M${r(-nw / 2 + 0.3)} ${r(y0 + 2.4)} Q0 ${r(y0 + 0.9)} ${r(nw / 2 - 0.3)} ${r(y0 + 2.4)} L${r(nw / 2 - 0.3)} ${r(y0 + 0.9)} Q0 ${r(y0 - 0.6)} ${r(-nw / 2 + 0.3)} ${r(y0 + 0.9)} Z" fill="#fbf4ee"/>`;
    g += `<path d="M${r(-nw * 0.3)} ${r(y1 - 0.2)} Q0 ${r(y1 - 3)} ${r(nw * 0.3)} ${r(y1 - 0.2)}" fill="#fbe9e2" opacity=".85"/>`;
    g += `<path d="M${r(-nw * 0.2)} ${r(y0 + 4)} L${r(-nw * 0.18)} ${r(y1 - 3)}" stroke="#fff" stroke-width=".8" opacity=".5" stroke-linecap="round"/>`;
    k += T(f, g);
  }
  S.teil({ id: "fingernagel", de: "der Fingernagel", syl: "FIN-ger-na-gel", it: "l'unghia", itSyl: "UN-ghia", en: "fingernail", x: 228, y: 40, kunst: A(228, 40, SP(k)),
    tipp: "Ein Fingernagel wächst etwa drei Millimeter im Monat." });
}
{
  const f = F.ringfinger, y = -f.L * 0.2;
  let g = `<rect x="${r(-f.w / 2 - 0.5)}" y="${r(y - 1.8)}" width="${r(f.w + 1)}" height="3.6" rx="1.6" fill="${S.lg("gold", [[0, "#8a6a1e"], [0.3, "#e9cf75"], [0.55, "#fff1b8"], [0.8, "#c9a23e"], [1, "#7a5a16"]], 0, 0, 1, 0)}"/>`;
  g += `<path d="M${r(-f.w / 2)} ${r(y - 0.6)} q${r(f.w / 2)} 1 ${f.w} 0" stroke="#fff6cf" stroke-width=".4" opacity=".7" fill="none"/>`;
  S.teil({ oben: true, id: "ring", de: "der Ring", syl: "RING", it: "l'anello", itSyl: "a-NEL-lo", en: "ring", x: 213, y: 76, kunst: A(213, 76, SP(T(f, g))),
    tipp: "Den Ehering trägt man in Deutschland meist am rechten Ringfinger." });
}
{
  /* Armbanduhr am rechten Bild (Handrücken) */
  const cx = MX - 100, cy = 172;
  let k = `<path d="M${cx - 22} ${cy - 4.6} C${cx - 10} ${cy - 6.4} ${cx + 10} ${cy - 6.4} ${cx + 22} ${cy - 4.6} L${cx + 22.2} ${cy + 4.4} C${cx + 10} ${cy + 2.6} ${cx - 10} ${cy + 2.6} ${cx - 22.2} ${cy + 4.4} Z" fill="${S.lg("band", [[0, "#5a3a24"], [0.5, "#7a5236"], [1, "#4a2f1c"]])}"/>`;
  k += `<path d="M${cx - 20} ${cy - 3.4} C${cx - 10} ${cy - 5} ${cx + 10} ${cy - 5} ${cx + 20} ${cy - 3.4}" stroke="#c8a27c" stroke-width=".3" stroke-dasharray=".8 .6" fill="none"/>`;
  k += `<circle cx="${cx}" cy="${cy - 1}" r="9.6" fill="${S.lg("gehaeuse", [[0, "#f2f4f5"], [0.5, "#a9b1b8"], [1, "#e1e5e8"]], 0, 0, 1, 1)}"/>`;
  k += `<circle cx="${cx}" cy="${cy - 1}" r="8" fill="${S.rg("zb", [[0, "#ffffff"], [1, "#e9ecee"]])}"/>`;
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; k += `<line x1="${r(cx + Math.sin(a) * 7)}" y1="${r(cy - 1 - Math.cos(a) * 7)}" x2="${r(cx + Math.sin(a) * (i % 3 ? 6.3 : 5.6))}" y2="${r(cy - 1 - Math.cos(a) * (i % 3 ? 6.3 : 5.6))}" stroke="#222" stroke-width="${i % 3 ? 0.3 : 0.6}"/>`; }
  k += `<line x1="${cx}" y1="${cy - 1}" x2="${r(cx + 2.9)}" y2="${r(cy - 3.6)}" stroke="#1c1c1c" stroke-width=".8" stroke-linecap="round"/><line x1="${cx}" y1="${cy - 1}" x2="${r(cx - 1.2)}" y2="${r(cy - 6.6)}" stroke="#1c1c1c" stroke-width=".5" stroke-linecap="round"/>`;
  k += `<circle cx="${cx}" cy="${cy - 1}" r=".6" fill="#b3261e"/><rect x="${cx + 9.2}" y="${cy - 2.2}" width="1.8" height="2.4" rx=".4" fill="#b9c0c6"/>`;
  k += `<path d="M${cx - 6} ${cy - 6} A8 8 0 0 1 ${cx + 3} ${cy - 8.4}" stroke="#fff" stroke-width=".9" opacity=".7" fill="none"/>`;
  S.teil({ id: "armbanduhr", de: "die Armbanduhr", syl: "ARM-band-uhr", it: "l'orologio da polso", itSyl: "o-ro-LO-gio da POL-so", en: "wristwatch", x: cx, y: cy, kunst: A(cx, cy, k) });
}

/* =====================================================================
   DIE ÄRMEL (Strickpullover mit Rippenbündchen) — beide Arme
   ===================================================================== */
{
  let e = `<path d="M71 201 L73.6 182.4 C86 179.6 114 179.6 126.4 182.4 L129 201 Z" fill="${STRICK}"/>`;
  e += `<path d="M73.6 182.4 C86 179.6 114 179.6 126.4 182.4 L126.8 186 C114 183.4 86 183.4 73.2 186 Z" fill="#5e929d"/>`;
  for (let x = 75; x < 126; x += 2.2) e += `<path d="M${r(x)} ${r(183 - Math.sin((x - 75) / 51 * Math.PI) * 2.6)} L${r(x + (x - 100) * 0.03)} 201" stroke="#2e525a" stroke-width=".55" opacity=".55"/>`;
  e += `<path d="M73.4 184.4 C86 181.6 114 181.6 126.6 184.4" stroke="#8fc0c9" stroke-width=".6" opacity=".6" fill="none"/>`;
  S.teil({ id: "aermel", de: "der Ärmel", syl: "ÄR-mel", it: "la manica", itSyl: "MA-ni-ca", en: "sleeve", x: 100, y: 191, kunst: A(100, 191, e + SP(e)) });
}

/* Licht von links oben (fängt keinen Tipp ab) */
S.davor(`<rect width="320" height="200" fill="${S.lg("licht", [[0, "#fff8ee", 0.08], [0.6, "#fff8ee", 0], [1, "#10080a", 0.06]], 0, 0, 1, 0.4)}"/>`);

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/hand_detail.js"));
console.log(aus);
