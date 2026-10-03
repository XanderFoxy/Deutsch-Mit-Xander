#!/usr/bin/env node
/* =====================================================================
   IN DER DUSCHE (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   (Lupe aus dem Badezimmer: hier sieht man den Duschbereich von nahem)
   ---------------------------------------------------------------------
   RECHERCHE (Sanitär-Händler, Duschsysteme mit Thermostat, Ratgeber
   „bodengleiche Dusche“) — so sieht eine Dusche in Deutschland heute aus:
   - Flache DUSCHTASSE (oder bodengleich) mit ABFLUSS; davor eine
     Duschabtrennung aus Sicherheitsglas (ESG) mit Chromprofilen:
     ein festes Feld und eine Pendeltür mit Stangengriff, oben eine
     Stabilisierungsstange zur Wand.
   - An der Rückwand ein DUSCHSYSTEM (Duschsäule): oben die große
     Kopfbrause (Regendusche), auf 1,1 m das THERMOSTAT mit zwei Griffen
     (Temperatur mit Sperrknopf bei 38 °C, Wassermenge), dazu die
     HANDBRAUSE im Halter am Schlauch.
   - Eine geflieste WANDNISCHE (Duschablage) mit LED-Licht für Shampoo,
     Spülung, Duschgel, Seife, Schwamm und Rasierer; ein Duschabzieher
     für das Glas hängt am Haken.
   - Draußen: HANDTUCHHAKEN, BADEMATTE vor der Tür, ein
     HANDTUCHHEIZKÖRPER an der Wand; großformatige Fliesen 30 × 60 cm.
   - Keine Person IN der Dusche. Wer gerade fertig ist, steht im
     BADEMANTEL auf der Matte (die Körperwörter liegen in seiner Lupe).
   Maßstab: Rückwand ≈ 62 Einheiten je Meter (Wandfuß y 158),
   vorne ≈ 80 je Meter; Mann im Bademantel 1,78 m, Tür 2 m hoch.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "dusche", titel: "In der Dusche", emoji: "🚿", thema: "Körperpflege", kuerzel: "b15a", fassung: 852 });
const rnd = zufall(3806);
const r = B.r;

const WAND_UNTEN = 158;
const VP = { x: 168, y: 92 };
/* Maßstab je Bodenzeile: Rückwand 62/m, vorne (y 200) 80/m */
const M = (y) => 62 + (y - WAND_UNTEN) * (18 / 42);

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const CHROM = S.lg("chrom", [[0, "#f7f9fa"], [0.35, "#c3cbd1"], [0.5, "#8f99a1"], [0.65, "#d6dce0"], [1, "#f2f4f5"]], 0, 0, 1, 0);
const CHROM_H = S.lg("chromh", [[0, "#f7f9fa"], [0.4, "#c3cbd1"], [0.55, "#8f99a1"], [1, "#e9edef"]]);
const KERAMIK = S.lg("keramik", [[0, "#ffffff"], [1, "#e3e7ea"]]);

/* =====================================================================
   KULISSE — Fliesenwand (hell), Duschrückwand (Schiefergrau), Boden
   ===================================================================== */
S.def(`<pattern id="${S.id("fl")}" width="37.2" height="18.6" patternUnits="userSpaceOnUse"><rect width="37.2" height="18.6" fill="#ece9e3"/><rect x=".3" y=".3" width="36.6" height="18" fill="#f3f1ec"/><path d="M0 18.45 H37.2 M37.05 0 V18.6" stroke="#cfc9bf" stroke-width=".35"/></pattern>`);
S.def(`<pattern id="${S.id("sch")}" width="37.2" height="18.6" patternUnits="userSpaceOnUse" x="5"><rect width="37.2" height="18.6" fill="#5d6268"/><rect x=".3" y=".3" width="36.6" height="18" fill="#666b71"/><path d="M0 18.45 H37.2 M37.05 0 V18.6" stroke="#4a4e53" stroke-width=".4"/></pattern>`);
const DUSCH = { x0: 37.6, x1: 130 };   /* Rückwand der Dusche (Wandflucht); links die Seitenwand in die Tiefe */
{
  let k = `<rect x="0" y="0" width="320" height="${WAND_UNTEN}" fill="url(#${S.id("fl")})"/>`;
  k += `<rect x="0" y="0" width="${DUSCH.x1}" height="${WAND_UNTEN}" fill="url(#${S.id("sch")})"/>`;
  /* linke Seitenwand der Duschecke (Flucht zum selben Punkt) */
  const sw = (y) => r(VP.y + (y - VP.y) * VP.x / (VP.x - DUSCH.x0));
  k += `<path d="M0 0 L${DUSCH.x0} 0 L${DUSCH.x0} ${WAND_UNTEN} L0 ${sw(WAND_UNTEN)} Z" fill="#565a5f"/>`;
  for (let y = 18.6; y < WAND_UNTEN; y += 18.6) k += `<line x1="${DUSCH.x0}" y1="${r(y)}" x2="0" y2="${sw(y)}" stroke="#44484c" stroke-width=".4"/>`;
  k += `<line x1="18" y1="${r(sw(0) * 0.5)}" x2="18" y2="${r((sw(WAND_UNTEN) + WAND_UNTEN) / 2)}" stroke="#44484c" stroke-width=".4"/>`;
  k += `<path d="M0 0 L${DUSCH.x0} 0 L${DUSCH.x0} ${WAND_UNTEN} L0 ${sw(WAND_UNTEN)} Z" fill="${S.lg("seitlicht", [[0, "#000", 0.18], [1, "#000", 0.02]], 0, 0, 1, 0)}"/>`;
  k += `<line x1="${DUSCH.x0}" y1="0" x2="${DUSCH.x0}" y2="${WAND_UNTEN}" stroke="#7a7f84" stroke-width=".5"/>`;
  /* Steinstruktur der dunklen Fliesen */
  for (let i = 0; i < 90; i++) k += `<circle cx="${r(rnd() * DUSCH.x1)}" cy="${r(rnd() * WAND_UNTEN)}" r="${r(0.3 + rnd() * 0.8)}" fill="${rnd() < 0.5 ? "#73787e" : "#565b60"}" opacity=".5"/>`;
  /* Licht von oben (Deckenspot) und feuchter Glanz */
  k += `<rect x="0" y="0" width="320" height="${WAND_UNTEN}" fill="${S.rg("licht", [[0, "#fffdf4", 0.4], [1, "#fffdf4", 0]], 0.4, 0, 0.75)}"/>`;
  k += `<rect x="${DUSCH.x0}" y="0" width="${DUSCH.x1}" height="${WAND_UNTEN}" fill="${S.lg("nass", [[0, "#000", 0], [0.6, "#000", 0.05], [1, "#000", 0.16]])}"/>`;
  /* Boden: große graue Fliesen in Fluchtperspektive */
  k += `<rect x="0" y="${WAND_UNTEN}" width="320" height="${200 - WAND_UNTEN}" fill="${S.lg("boden", [[0, "#b9b6b0"], [1, "#9f9c96"]])}"/>`;
  for (let i = -8; i <= 8; i++) {
    const xb = VP.x + i * 37.2 * 0.62 / 0.62;   /* Fugen 60 cm auf der Rückwandlinie */
    const t = (200 - VP.y) / (WAND_UNTEN - VP.y);
    k += `<line x1="${r(xb)}" y1="${WAND_UNTEN}" x2="${r(VP.x + (xb - VP.x) * t)}" y2="200" stroke="#87847e" stroke-width=".35"/>`;
  }
  for (const y of [WAND_UNTEN + 7.5, WAND_UNTEN + 18, WAND_UNTEN + 33]) k += `<line x1="0" y1="${y}" x2="320" y2="${y}" stroke="#87847e" stroke-width=".35"/>`;
  k += `<rect x="0" y="${WAND_UNTEN}" width="320" height="${200 - WAND_UNTEN}" fill="${S.lg("bodenlicht", [[0, "#000", 0.12], [0.5, "#000", 0], [1, "#fff", 0.07]])}"/>`;
  /* Sockel: Fliesenfuß (Hohlkehle) */
  k += `<rect x="0" y="${WAND_UNTEN - 1}" width="320" height="1.4" fill="#8e8b85" opacity=".6"/>`;
  S.hinten(k);
}

/* =====================================================================
   0 — DAS FENSTER (Kippfenster mit Milchglas, hoch über dem Heizkörper)
   ===================================================================== */
{
  let k = `<rect x="-26" y="-36" width="52" height="36" rx="1" fill="#e8e6e1"/>`;
  k += `<rect x="-24" y="-34" width="48" height="32" fill="#ffffff"/><rect x="-21.6" y="-31.6" width="43.2" height="27.2" fill="${S.lg("milch", [[0, "#eef5f8"], [0.5, "#dce9ef"], [1, "#cddfe7"]], 0, 0, 1, 1)}"/>`;
  for (let i = 0; i < 50; i++) k += `<circle cx="${r(-21 + rnd() * 42)}" cy="${r(-31 + rnd() * 26)}" r=".45" fill="#fff" opacity=".6"/>`;
  k += `<path d="M-21.6 -31.6 L-8 -31.6 L-21.6 -10 Z" fill="#fff" opacity=".35"/>`;
  /* Fenstergriff (Dreh-Kipp) rechts, Fensterbank */
  k += `<rect x="18.6" y="-20" width="2.2" height="3" rx=".5" fill="#f4f4f2" stroke="#c9c9c4" stroke-width=".25"/><rect x="19.2" y="-17.6" width="1.1" height="6" rx=".5" fill="#f4f4f2" stroke="#c9c9c4" stroke-width=".25"/>`;
  k += `<rect x="-28" y="0" width="56" height="2.4" rx=".6" fill="${S.lg("bank", [[0, "#f6f5f2"], [1, "#d6d4cf"]])}"/>`;
  S.teil({ id: "fenster", de: "das Fenster", syl: "FENS-ter", it: "la finestra", itSyl: "fi-NE-stra", en: "window",
    x: 288, y: 50, kunst: k, tipp: "Nach dem Duschen das Fenster öffnen – sonst bleibt die Feuchtigkeit im Bad." });
}

/* =====================================================================
   1 — DER HANDTUCHHEIZKÖRPER (rechts an der Wand, mit gefaltetem Tuch)
   ===================================================================== */
{
  let k = schatten(0, 0, 1, 1, 0);
  const W = 30, H = 76;
  for (const sx of [-W / 2, W / 2 - 3]) k += `<rect x="${sx}" y="${-H}" width="3" height="${H}" rx="1.2" fill="${S.lg("hkrohr", [[0, "#ffffff"], [0.5, "#e1e4e6"], [1, "#c3c8cc"]], 0, 0, 1, 0)}"/>`;
  for (let i = 0; i < 16; i++) {
    const y = -H + 3 + i * 4.5 + (i > 7 ? 4 : 0);
    k += `<rect x="${-W / 2 + 1}" y="${r(y)}" width="${W - 2}" height="2" rx="1" fill="${S.lg("hksp", [[0, "#ffffff"], [1, "#cfd4d8"]])}"/>`;
  }
  /* Wandhalter und Thermostatkopf */
  k += `<rect x="${-W / 2 - 1}" y="${-H + 6}" width="2" height="2.4" fill="#aab1b6"/><rect x="${W / 2 - 1}" y="${-H + 6}" width="2" height="2.4" fill="#aab1b6"/>`;
  k += `<rect x="${W / 2 - 3}" y="0" width="3" height="4" fill="#d9dde0"/>`;
  /* gefaltetes Gästetuch über der mittleren Lücke */
  k += `<path d="M-11 -38 L11 -38 L11 -22 Q0 -20 -11 -22 Z" fill="${S.lg("gast", [[0, "#9cc5c9"], [1, "#6fa3a8"]])}"/>`;
  k += `<rect x="-11" y="-39.5" width="22" height="3" rx="1.4" fill="#86b6ba"/><path d="M-11 -25.5 Q0 -23.5 11 -25.5" stroke="#5c8f94" stroke-width=".6" fill="none"/>`;
  S.teil({ id: "handtuchheizkoerper", de: "der Handtuchheizkörper", syl: "HAND-tuch-heiz-kör-per", it: "lo scaldasalviette", itSyl: "scal-da-sal-VIET-te", en: "towel radiator",
    x: 288, y: WAND_UNTEN - 14, kunst: k, tipp: "Am Handtuchheizkörper trocknen die Handtücher schnell." });
}

/* =====================================================================
   2 — DER HANDTUCHHAKEN und 3 — DAS HANDTUCH (neben der Duschtür)
   ===================================================================== */
const HAKEN = { x: 146, y: WAND_UNTEN - 1.75 * 62 };
{
  let k = `<rect x="-3" y="-4" width="6" height="8" rx="1.4" fill="${CHROM}"/>`;
  k += `<path d="M0 -1 q0 5 3.6 5.4" stroke="${CHROM_H}" stroke-width="1.4" fill="none" stroke-linecap="round"/><circle cx="3.8" cy="4.4" r="1" fill="#e9edef"/>`;
  S.teil({ oben: true, id: "handtuchhaken", de: "der Handtuchhaken", syl: "HAND-tuch-ha-ken", it: "il gancio per asciugamani", itSyl: "GAN-cio per a-sciu-ga-MA-ni", en: "towel hook",
    x: HAKEN.x, y: HAKEN.y, kunst: k + flaeche(-4, -5, 10, 11) });
}
{
  /* Duschtuch an der Aufhängeschlaufe: oben gerafft, darunter glatt mit Bordüre */
  const F = S.lg("tuch", [[0, "#5d7fa3"], [0.45, "#6f93b8"], [1, "#4b6b8e"]], 0, 0, 1, 0);
  let k = `<path d="M1.4 4.6 Q-5 6 -10.5 13 L-11.5 58 L12.5 58 L11.5 13 Q6 6 2.6 4.6 Z" fill="${F}"/>`;
  k += `<path d="M2 5.2 L-6 13 M2 5.2 L-1.5 13.5 M2 5.2 L3.5 13.5 M2 5.2 L8 13" stroke="#3f5c7c" stroke-width=".55" fill="none"/>`;
  k += `<path d="M-6 13 Q-6.6 36 -6.4 58 M-1.5 13.5 Q-2 36 -1.6 58 M3.5 13.5 Q4 36 3.6 58 M8 13 Q8.4 36 8.2 58" stroke="#46658a" stroke-width=".5" fill="none" opacity=".7"/>`;
  k += `<rect x="-11.5" y="47" width="24" height="1.4" fill="#e9eef4"/><rect x="-11.5" y="49.6" width="24" height=".8" fill="#e9eef4"/><rect x="-11.5" y="56.4" width="24" height="1.6" fill="#40607f"/>`;
  for (let x = -11; x <= 12; x += 1.2) k += `<line x1="${r(x)}" y1="58" x2="${r(x + 0.1)}" y2="59.4" stroke="#4b6b8e" stroke-width=".45"/>`;
  k += `<path d="M-9.6 15 Q-10.4 34 -10 55" stroke="#fff" stroke-width="1.1" opacity=".22" fill="none"/>`;
  k += `<path d="M1.4 4.6 q.6 -1.4 1.8 -1" stroke="#40607f" stroke-width=".7" fill="none"/>`;
  S.teil({ id: "handtuch", de: "das Handtuch", syl: "HAND-tuch", it: "l'asciugamano", itSyl: "a-sciu-ga-MA-no", en: "towel",
    x: HAKEN.x + 2, y: HAKEN.y, kunst: k });
}

/* =====================================================================
   4 — DIE DUSCHTASSE (flach, weiß) und 5 — DER ABFLUSS
   ===================================================================== */
const TASSE = { yh: WAND_UNTEN, yv: 177, x0h: DUSCH.x0, x1h: DUSCH.x1 };
const vorn = (x) => VP.x + (x - VP.x) * (TASSE.yv - VP.y) / (WAND_UNTEN - VP.y);
{
  const xl = Math.max(0, vorn(TASSE.x0h)), xr = vorn(TASSE.x1h);
  let k = "";
  /* Oberfläche (leicht nach innen geneigt), vordere Kante 3 cm */
  k += `<path d="M${TASSE.x0h} ${TASSE.yh - TASSE.yv} L${TASSE.x1h} ${TASSE.yh - TASSE.yv} L${r(xr)} -2.4 L${r(xl)} -2.4 Z" fill="${S.lg("tasse", [[0, "#dfe4e8"], [1, "#f7f9fa"]])}"/>`;
  k += `<path d="M${r(xl)} -2.4 L${r(xr)} -2.4 L${r(xr)} 0 L${r(xl)} 0 Z" fill="${KERAMIK}"/><path d="M${r(xl)} -2.4 L${r(xr)} -2.4" stroke="#fff" stroke-width=".7"/>`;
  /* Wasserfilm und Spiegelung */
  k += `<path d="M40 ${TASSE.yh - TASSE.yv + 3} Q70 -8 112 ${TASSE.yh - TASSE.yv + 4} Q70 -4 30 -6 Z" fill="#cfe3ee" opacity=".55"/>`;
  S.teil({ id: "duschtasse", de: "die Duschtasse", syl: "DUSCH-tas-se", it: "il piatto doccia", itSyl: "PIAT-to DOC-cia", en: "shower tray",
    x: 0, y: TASSE.yv, steht: true, kunst: k, tipp: "Die flache Duschtasse ist fast bodengleich – man stolpert nicht." });
}
const ABFL = { x: 84, y: 168 };
{
  let k = `<ellipse cx="0" cy="0" rx="7" ry="2.1" fill="#9aa3aa"/><ellipse cx="0" cy="-.2" rx="6" ry="1.7" fill="${CHROM}"/>`;
  for (let i = -4; i <= 4; i += 1.6) k += `<line x1="${r(i)}" y1="-1.2" x2="${r(i)}" y2=".8" stroke="#5f686f" stroke-width=".45"/>`;
  k += `<path d="M-4 -1.1 Q0 -1.8 3 -1.2" stroke="#fff" stroke-width=".4" opacity=".8" fill="none"/>`;
  S.teil({ oben: true, id: "abfluss", de: "der Abfluss", syl: "AB-fluss", it: "lo scarico", itSyl: "SCA-ri-co", en: "drain",
    x: ABFL.x, y: ABFL.y, kunst: k + flaecheEllipse(0, 0, 8, 3.5) });
}

/* =====================================================================
   6 — DIE DUSCHABLAGE (geflieste Wandnische mit LED) — Lupe
   ===================================================================== */
const NI = { x0: 41, x1: 61, y0: WAND_UNTEN - 1.42 * 62, y1: WAND_UNTEN - 0.86 * 62 };
const ablageUnter = [];
{
  const W = NI.x1 - NI.x0, H = NI.y1 - NI.y0, cx = (NI.x0 + NI.x1) / 2;
  const B0 = -H / 2 + 1.5, B1 = -1.2;   /* Glasboden Mitte und Nischenboden (relativ zur Unterkante) */
  let k = `<rect x="${-W / 2 - 1}" y="${-H - 1}" width="${W + 2}" height="${H + 2}" rx=".6" fill="#3f4347"/>`;
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="${H}" fill="${S.lg("nische", [[0, "#7b8086"], [0.2, "#6a6f75"], [1, "#55595e"]])}"/>`;
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="1.3" fill="#fff6dc" opacity=".9"/><rect x="${-W / 2}" y="${-H + 1.3}" width="${W}" height="10" fill="${S.lg("led", [[0, "#fff1c8", 0.5], [1, "#fff1c8", 0]])}"/>`;
  /* Seitenwände in Tiefe */
  k += `<path d="M${-W / 2} ${-H} L${-W / 2 + 2.6} ${-H + 2} L${-W / 2 + 2.6} -1.4 L${-W / 2} 0 Z" fill="#4c5055"/>`;
  k += `<path d="M${W / 2} ${-H} L${W / 2 - 1.6} ${-H + 2} L${W / 2 - 1.6} -1.4 L${W / 2} 0 Z" fill="#7a7f85"/>`;
  k += `<rect x="${-W / 2}" y="${B0}" width="${W}" height="1.1" fill="#d4e7ec" opacity=".85"/><rect x="${-W / 2}" y="${B1}" width="${W}" height="1.2" fill="#80868c"/>`;
  /* Flaschen und Dinge */
  const flasche = (x, boden, w, h, farbe, deckel, etikett, kopf) => {
    let g = "";
    if (kopf) {   /* Flasche steht auf dem Klappdeckel */
      g += `<rect x="${r(x - w / 2 + 0.4)}" y="${r(boden - 2.2)}" width="${r(w - 0.8)}" height="2.2" rx=".7" fill="${deckel}"/>`;
      g += `<path d="M${r(x - w / 2)} ${r(boden - 2)} L${r(x + w / 2)} ${r(boden - 2)} L${r(x + w / 2)} ${r(boden - h + 1.4)} Q${r(x + w / 2)} ${r(boden - h)} ${r(x)} ${r(boden - h)} Q${r(x - w / 2)} ${r(boden - h)} ${r(x - w / 2)} ${r(boden - h + 1.4)} Z" fill="${farbe}"/>`;
    } else {
      g += `<path d="M${r(x - w / 2)} ${boden} L${r(x + w / 2)} ${boden} L${r(x + w / 2)} ${r(boden - h + 3)} Q${r(x + w / 2)} ${r(boden - h + 1.6)} ${r(x + w / 4)} ${r(boden - h + 1.4)} L${r(x - w / 4)} ${r(boden - h + 1.4)} Q${r(x - w / 2)} ${r(boden - h + 1.6)} ${r(x - w / 2)} ${r(boden - h + 3)} Z" fill="${farbe}"/>`;
      g += `<rect x="${r(x - w / 4)}" y="${r(boden - h)}" width="${r(w / 2)}" height="1.6" rx=".4" fill="${deckel}"/>`;
    }
    g += `<rect x="${r(x - w / 2 + 0.5)}" y="${r(boden - h * 0.62)}" width="${r(w - 1)}" height="${r(h * 0.3)}" rx=".3" fill="#fff" opacity=".88"/>`;
    g += `<text x="${r(x)}" y="${r(boden - h * 0.44)}" font-size="1.05" text-anchor="middle" fill="#333" font-family="Arial" font-weight="bold">${etikett}</text>`;
    g += `<rect x="${r(x - w / 2 + 0.5)}" y="${r(boden - h + 2.4)}" width=".6" height="${r(h - 4)}" fill="#fff" opacity=".4"/>`;
    return g;
  };
  /* oben: Shampoo, Haarspülung; unten: Duschgel, Seife, Schwamm, Rasierer */
  k += flasche(-6, B0, 5, 11, S.lg("sham", [[0, "#2f7fb8"], [1, "#1e5b88"]], 0, 0, 1, 0), "#e9eef2", "SHAMPOO");
  k += flasche(0.5, B0, 4.6, 10, S.lg("spue", [[0, "#e8a6c0"], [1, "#c97b9b"]], 0, 0, 1, 0), "#f4f4f4", "SPÜLUNG", true);
  k += flasche(-6.2, B1, 4.8, 10, S.lg("gel", [[0, "#7cc576"], [1, "#4a9a47"]], 0, 0, 1, 0), "#f1f1f1", "DUSCHGEL", true);
  /* Seife im Schälchen */
  k += `<path d="M-1.6 ${B1} L4 ${B1} L4.6 ${B1 - 1.2} L-2.2 ${B1 - 1.2} Z" fill="#e9eef1"/><rect x="-1.1" y="${B1 - 3.1}" width="4.6" height="2" rx="1" fill="${S.lg("seife", [[0, "#fbe7b0"], [1, "#e8c56a"]])}"/>`;
  /* Schwamm (gelb, porig) am Rand */
  k += `<rect x="5" y="${B1 - 3.6}" width="4.4" height="3.6" rx="1.2" fill="${S.lg("schwamm", [[0, "#f6d64e"], [1, "#d9ae1f"]])}"/>`;
  for (let i = 0; i < 7; i++) k += `<circle cx="${r(5.6 + rnd() * 3.2)}" cy="${r(B1 - 3 + rnd() * 2.6)}" r=".22" fill="#b38b12"/>`;
  /* Rasierer hängt am Glasboden */
  k += `<path d="M7.6 ${B0 + 1} L8 ${B0 + 8.6}" stroke="#3a7bd5" stroke-width=".9" stroke-linecap="round"/><rect x="6.6" y="${B0 + 8.4}" width="2.8" height="1.3" rx=".4" fill="#9ba4ab"/>`;
  S.teil({ id: "duschablage", de: "die Duschablage", syl: "DUSCH-ab-la-ge", it: "la mensola della doccia", itSyl: "MEN-so-la DEL-la DOC-cia", en: "shower shelf",
    x: cx, y: NI.y1, kunst: k,
    zoom: { x: cx - 24, y: NI.y0 - 3, w: 48, h: 32 },
    unter: [
      { id: "shampoo", de: "das Shampoo", syl: "Sham-POO", it: "lo shampoo", itSyl: "SHAM-poo", en: "shampoo", x: cx - 6, y: NI.y1 + B0, kunst: flaeche(-2.8, -11.4, 5.6, 11.6), tipp: "Mit Shampoo wäscht man die Haare." },
      { id: "haarspuelung", de: "die Haarspülung", syl: "HAAR-spü-lung", it: "il balsamo", itSyl: "BAL-sa-mo", en: "conditioner", x: cx + 0.5, y: NI.y1 + B0, kunst: flaeche(-2.6, -10.4, 5.2, 10.6) },
      { id: "rasierer", de: "der Rasierer", syl: "ra-SIE-rer", it: "il rasoio", itSyl: "ra-SO-io", en: "razor", x: cx + 8, y: NI.y1 + B0 + 10, kunst: flaeche(-2, -9.6, 4, 10) },
      { id: "duschgel", de: "das Duschgel", syl: "DUSCH-gel", it: "il bagnoschiuma", itSyl: "ba-gno-SCHIU-ma", en: "shower gel", x: cx - 6.2, y: NI.y1 + B1, kunst: flaeche(-2.7, -10.4, 5.4, 10.6) },
      { id: "seife", de: "die Seife", syl: "SEI-fe", it: "il sapone", itSyl: "sa-PO-ne", en: "soap", x: cx + 1.2, y: NI.y1 + B1, kunst: flaeche(-2.8, -3.6, 5.6, 3.8) },
      { id: "schwamm", de: "der Schwamm", syl: "SCHWAMM", it: "la spugna", itSyl: "SPU-gna", en: "sponge", x: cx + 7.2, y: NI.y1 + B1, kunst: flaeche(-2.4, -4, 4.8, 4.2) },
    ],
    tipp: "In der Nische stehen Shampoo und Duschgel – griffbereit und nicht im Weg." });
}

/* =====================================================================
   7 — DAS DUSCHSYSTEM: Thermostat, Handbrause, Duschkopf (Kopfbrause)
   ===================================================================== */
const SAEULE = { x: 108, yT: WAND_UNTEN - 1.1 * 62, yO: WAND_UNTEN - 2.0 * 62 };
/* die Säule selbst (Rohr) gehört zur Kulisse: kein Wort, nur Halt */
S.hinten(`<rect x="${SAEULE.x - 1.3}" y="${r(SAEULE.yO)}" width="2.6" height="${r(SAEULE.yT - SAEULE.yO)}" fill="${CHROM}"/><rect x="${SAEULE.x - 2}" y="${r(SAEULE.yT - 20)}" width="4" height="2" rx=".6" fill="#9aa3aa"/>`);
{
  /* DER THERMOSTAT — Aufputz-Thermostat, links Temperatur (38 °C-Sperre), rechts Menge */
  let k = `<rect x="-15" y="-3.4" width="30" height="6.8" rx="3.4" fill="${CHROM_H}"/>`;
  k += `<rect x="-14" y="-2.6" width="28" height="1.2" rx=".6" fill="#fff" opacity=".7"/>`;
  for (const sx of [-1, 1]) k += `<rect x="${sx * 15 - (sx > 0 ? 0 : 2.4)}" y="-2.2" width="2.4" height="4.4" rx=".6" fill="#aab3b9"/>`;
  /* Griffe */
  k += `<circle cx="-11" cy="0" r="5" fill="${S.rg("griff", [[0, "#ffffff"], [0.6, "#c9d0d5"], [1, "#7e8890"]], 0.4, 0.35, 0.7)}"/>`;
  k += `<circle cx="11" cy="0" r="5" fill="${S.rg("griff2", [[0, "#ffffff"], [0.6, "#c9d0d5"], [1, "#7e8890"]], 0.4, 0.35, 0.7)}"/>`;
  k += `<rect x="-12.2" y="-5.6" width="2.4" height="2.4" rx=".6" fill="#d23b30"/><text x="-11" y="1.3" font-size="2.6" text-anchor="middle" fill="#4a5359" font-family="Arial" font-weight="bold">38</text>`;
  k += `<path d="M-15.6 -3 A5.5 5.5 0 0 1 -14.2 -4.6" stroke="#2f73c8" stroke-width=".8" fill="none"/><path d="M-7.8 -4.6 A5.5 5.5 0 0 1 -6.4 -3" stroke="#d23b30" stroke-width=".8" fill="none"/>`;
  k += `<path d="M8 -3.8 L14 3.8" stroke="#9aa3aa" stroke-width=".8"/><circle cx="11" cy="0" r="1.3" fill="#e9edef"/>`;
  /* Auslauf nach oben (Säule) und Schlauchanschluss unten */
  k += `<rect x="-1.4" y="-6" width="2.8" height="3" fill="${CHROM}"/><rect x="-1.8" y="3" width="3.6" height="2.4" rx=".6" fill="${CHROM}"/>`;
  S.teil({ id: "thermostat", de: "der Thermostat", syl: "ther-mo-STAT", it: "il termostato", itSyl: "ter-MO-sta-to", en: "thermostat",
    x: SAEULE.x, y: SAEULE.yT, kunst: k, tipp: "Mit dem Thermostat stellt man die Wassertemperatur ein. Der rote Knopf sperrt bei 38 °C." });
}
{
  /* DIE HANDBRAUSE im Halter an der Säule, mit Brauseschlauch */
  const hy = SAEULE.yT - 22;
  let k = `<path d="M0 ${r(SAEULE.yT + 5.4 - hy)} C8 ${r(SAEULE.yT + 20 - hy)} 14 ${r(SAEULE.yT - 2 - hy)} 6 2.6" stroke="#a6aeb4" stroke-width="1.5" fill="none"/>`;
  k += `<path d="M0 ${r(SAEULE.yT + 5.4 - hy)} C8 ${r(SAEULE.yT + 20 - hy)} 14 ${r(SAEULE.yT - 2 - hy)} 6 2.6" stroke="#e9edef" stroke-width=".5" stroke-dasharray=".7 .5" fill="none"/>`;
  /* Halter */
  k += `<rect x="-2.6" y="-1.4" width="5.2" height="3" rx="1" fill="${CHROM_H}"/>`;
  /* Griff schräg nach oben, runder Brausekopf */
  k += `<path d="M5 2 L1.4 -9" stroke="${CHROM}" stroke-width="2.6" stroke-linecap="round"/>`;
  k += `<g transform="rotate(-20 0 -13)"><ellipse cx="0" cy="-13" rx="5.2" ry="2.4" fill="${CHROM_H}"/><ellipse cx="0" cy="-12.6" rx="4.4" ry="1.6" fill="#59636b"/>`;
  for (let i = 0; i < 9; i++) k += `<circle cx="${r(-3 + (i % 5) * 1.5)}" cy="${r(-13 + Math.floor(i / 5) * 0.8)}" r=".22" fill="#cdd3d7"/>`;
  k += `</g>`;
  S.teil({ id: "handbrause", de: "die Handbrause", syl: "HAND-brau-se", it: "la doccetta", itSyl: "doc-CET-ta", en: "hand shower",
    x: SAEULE.x, y: hy, kunst: k + flaeche(-4, -17, 9, 20), tipp: "Die Handbrause hängt am Schlauch – man kann sie in die Hand nehmen." });
}
const KOPF = { x: 84, y: SAEULE.yO + 3 };
{
  /* DER DUSCHKOPF — runde Kopfbrause (Regendusche) am Brausearm */
  let k = `<path d="M${SAEULE.x - KOPF.x} 0 L${SAEULE.x - KOPF.x} -3 Q${SAEULE.x - KOPF.x} -6 ${SAEULE.x - KOPF.x - 3} -6 L2 -6" stroke="${CHROM_H}" stroke-width="2.2" fill="none"/>`;
  k += `<rect x="-1.6" y="-6.4" width="3.2" height="4" fill="${CHROM}"/>`;
  k += `<ellipse cx="0" cy="-1.4" rx="13" ry="3.2" fill="${CHROM_H}"/><ellipse cx="0" cy="-.6" rx="12.4" ry="2.4" fill="#59636b"/>`;
  for (let i = 0; i < 22; i++) { const a = rnd() * Math.PI * 2, d = Math.sqrt(rnd()); k += `<circle cx="${r(Math.cos(a) * d * 10.5)}" cy="${r(-0.6 + Math.sin(a) * d * 1.8)}" r=".25" fill="#cfd6db"/>`; }
  k += `<path d="M-11 -3 Q0 -4.6 11 -3" stroke="#fff" stroke-width=".7" opacity=".8" fill="none"/>`;
  S.teil({ id: "duschkopf", de: "der Duschkopf", syl: "DUSCH-kopf", it: "il soffione", itSyl: "sof-FIO-ne", en: "shower head",
    x: KOPF.x, y: KOPF.y, kunst: k, tipp: "Aus der großen Kopfbrause fällt das Wasser wie Regen." });
}
{
  /* DER DUSCHABZIEHER am Haken rechts in der Dusche */
  let k = `<rect x="-1.2" y="-1.2" width="2.4" height="2.4" rx=".6" fill="${CHROM}"/>`;
  k += `<path d="M0 1 L0 7" stroke="#2b2f33" stroke-width="1.6" stroke-linecap="round"/><path d="M-1 1.4 Q0 -.6 1 1.4" stroke="#2b2f33" stroke-width=".6" fill="none"/>`;
  k += `<rect x="-7" y="7" width="14" height="2.4" rx=".8" fill="#2b2f33"/><rect x="-7.4" y="9.2" width="14.8" height="1.1" rx=".4" fill="#9aa3aa"/>`;
  S.teil({ oben: true, id: "duschabzieher", de: "der Duschabzieher", syl: "DUSCH-ab-zie-her", it: "il tergivetro per doccia", itSyl: "ter-gi-VE-tro per DOC-cia", en: "shower squeegee",
    x: 121, y: SAEULE.yT + 14, kunst: k + flaeche(-8, -2, 16, 13), tipp: "Nach dem Duschen zieht man das Glas ab – dann bleiben keine Kalkflecken." });
}

/* =====================================================================
   8 — DAS WASSER (Regen aus der Kopfbrause, Spritzer in der Tasse)
   ===================================================================== */
{
  let k = "";
  const unten = ABFL.y - KOPF.y - 2;
  for (let i = 0; i < 26; i++) {
    const x0 = -10 + rnd() * 20, x1 = x0 * 1.35 + (rnd() - 0.5) * 2, len = unten - rnd() * 6;
    k += `<path d="M${r(x0)} 1.6 L${r(x1)} ${r(len)}" stroke="${rnd() < 0.5 ? "#e8f5fc" : "#bfe0f2"}" stroke-width="${r(0.35 + rnd() * 0.35)}" opacity="${r(0.45 + rnd() * 0.4)}" stroke-dasharray="${r(4 + rnd() * 8)} ${r(1 + rnd() * 3)}"/>`;
  }
  /* Spritzer und Pfütze am Boden */
  k += `<ellipse cx="0" cy="${r(unten + 1)}" rx="15" ry="3" fill="#cfe7f4" opacity=".55"/>`;
  for (let i = 0; i < 16; i++) { const a = Math.PI + rnd() * Math.PI, d = 5 + rnd() * 9; k += `<circle cx="${r(2 + Math.cos(a) * d)}" cy="${r(unten - 1 + Math.sin(a) * d * 0.3)}" r="${r(0.3 + rnd() * 0.4)}" fill="#e8f6fd" opacity=".8"/>`; }
  /* unsichtbare Fläche nur über dem Wasserstrahl (dünne Linien sind schwer zu treffen) */
  k += `<path class="bw-flaeche" d="M-11 2 L11 2 L15 ${r(unten)} L-15 ${r(unten)} Z" fill="rgba(255,255,255,0.001)"/>`;
  S.teil({ oben: true, id: "wasser", de: "das Wasser", syl: "WAS-ser", it: "l'acqua", itSyl: "AC-qua", en: "water",
    x: KOPF.x, y: KOPF.y, kunst: k, tipp: "Erst das Wasser anstellen, dann die Temperatur prüfen." });
}

/* =====================================================================
   9 — DIE DUSCHE (Glasabtrennung mit Chromprofilen und Pendeltür)
   ===================================================================== */
const GL = { y: TASSE.yv - 2.4, hoehe: 2.0 * 77, x0: 0, xm: 52, x1: vorn(DUSCH.x1) };
{
  const top = -GL.hoehe, sx = GL.x0, ex = GL.x1;
  const hinten = { x: DUSCH.x1, y: WAND_UNTEN - TASSE.yv + 2.4 }, htop = hinten.y - 2.0 * 62;
  let k = "";
  /* Wandprofil links (vorne halb aus dem Bild), Bodenprofil, Türspalt */
  k += `<rect x="${r(sx)}" y="${r(top)}" width="2.4" height="${r(GL.hoehe)}" fill="${CHROM}"/>`;
  k += `<rect x="${r(sx)}" y="-1.6" width="${r(ex - sx)}" height="1.8" fill="${CHROM_H}"/>`;
  /* Pendeltür: zwei Scharniere am festen Feld, senkrechter Stangengriff */
  k += `<rect x="${GL.xm - 0.6}" y="${r(top + 2)}" width="1.2" height="${r(GL.hoehe - 4)}" fill="#b9c3c9" opacity=".7"/>`;
  for (const hy of [top + 18, -20]) k += `<rect x="${GL.xm - 2.4}" y="${r(hy)}" width="4.8" height="6" rx="1" fill="${CHROM_H}"/><circle cx="${GL.xm}" cy="${r(hy + 3)}" r=".8" fill="#7e8890"/>`;
  k += `<rect x="${r(ex - 13)}" y="-92" width="2.2" height="34" rx="1.1" fill="${CHROM}"/>`;
  k += `<rect x="${r(ex - 14)}" y="-90" width="3" height="2" fill="#aab3b9"/><rect x="${r(ex - 14)}" y="-61" width="3" height="2" fill="#aab3b9"/>`;
  /* vordere Glaskante (Türende) und Seitenteil rechts in die Tiefe */
  k += `<rect x="${r(ex - 1.2)}" y="${r(top)}" width="2.4" height="${r(GL.hoehe)}" fill="${CHROM}"/>`;
  k += `<path d="M${r(ex + 1.2)} -1 L${hinten.x + 1.2} ${r(hinten.y)} L${hinten.x + 1.2} ${r(htop)} L${r(ex + 1.2)} ${r(top)}" fill="none" stroke="#c3cbd1" stroke-width="1.2"/>`;
  /* Stabilisierungsstange oben zur Wand */
  k += `<path d="M${r(sx + 4)} ${r(top + 1)} L${r(sx + 20)} ${r(htop - 6)}" stroke="${CHROM_H}" stroke-width="1.2"/>`;
  k += `<rect x="${r(sx)}" y="${r(top - 0.6)}" width="${r(ex - sx + 1.2)}" height="1.2" fill="#d6dce0"/>`;
  S.teil({ id: "dusche", de: "die Dusche", syl: "DU-sche", it: "la doccia", itSyl: "DOC-cia", en: "shower",
    x: 0, y: GL.y, kunst: k, tipp: "Die Duschwand ist aus Sicherheitsglas. Die Tür schwingt nach außen auf." });
  /* Glas (davor): leichter Blauschimmer, Kalkschleier unten, Spiegelstreifen, Tropfen */
  let g = `<path d="M${r(sx)} ${r(GL.y + top)} L${r(ex)} ${r(GL.y + top)} L${r(ex)} ${r(GL.y)} L${r(sx)} ${r(GL.y)} Z" fill="${S.lg("glas", [[0, "#e6f3f8", 0.1], [0.75, "#e6f3f8", 0.14], [1, "#ffffff", 0.32]])}"/>`;
  g += `<path d="M${r(ex + 1.2)} ${r(GL.y)} L${hinten.x + 1.2} ${r(GL.y + hinten.y)} L${hinten.x + 1.2} ${r(GL.y + htop)} L${r(ex + 1.2)} ${r(GL.y + top)} Z" fill="#e6f3f8" opacity=".22"/>`;
  g += `<path d="M${r(sx + 6)} ${r(GL.y)} L${r(sx + 40)} ${r(GL.y + top)} L${r(sx + 52)} ${r(GL.y + top)} L${r(sx + 18)} ${r(GL.y)} Z" fill="#fff" opacity=".1"/>`;
  g += `<path d="M${r(GL.xm + 14)} ${r(GL.y)} L${r(GL.xm + 36)} ${r(GL.y + top)} L${r(GL.xm + 40)} ${r(GL.y + top)} L${r(GL.xm + 18)} ${r(GL.y)} Z" fill="#fff" opacity=".12"/>`;
  /* Dampfbeschlag oben, Tropfen mit Lauf */
  g += `<rect x="${r(sx)}" y="${r(GL.y + top)}" width="${r(ex - sx)}" height="40" fill="${S.lg("dampf", [[0, "#ffffff", 0.3], [1, "#ffffff", 0]])}"/>`;
  for (let i = 0; i < 34; i++) {
    const x = sx + 4 + rnd() * (ex - sx - 8), y = GL.y + top + 10 + rnd() * (GL.hoehe - 20);
    g += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(0.3 + rnd() * 0.45)}" fill="#fff" opacity=".55"/>`;
    if (rnd() < 0.3) g += `<path d="M${r(x)} ${r(y)} l0 ${r(3 + rnd() * 6)}" stroke="#fff" stroke-width=".35" opacity=".35"/>`;
  }
  S.davor(g);
}

/* =====================================================================
   10 — DIE BADEMATTE und 11 — DER BADEMANTEL (Mann nach dem Duschen)
        mit Lupe für die Körperwörter
   ===================================================================== */
const MATTE = { x: 196, y: 186 };
{
  const F = S.lg("matte", [[0, "#7fa9b8"], [1, "#5f8b9b"]]);
  let k = schatten(0, 0, 30, 3, 0.18);
  k += `<path d="M-24 -14 L22 -14 L30 0 L-30 0 Z" fill="${F}"/>`;
  k += `<path d="M-21 -12.4 L19.4 -12.4 L26 -1.6 L-26.6 -1.6 Z" fill="none" stroke="#a9cbd6" stroke-width=".7"/>`;
  for (let i = 0; i < 60; i++) { const t = rnd(), u = rnd(); k += `<circle cx="${r(-28 + t * 56 - (1 - u) * 0 + (u - 0.5) * 6 * (1 - u))}" cy="${r(-u * 13.6)}" r=".35" fill="#94bccb" opacity=".7"/>`; }
  k += `<path d="M-30 0 L30 0" stroke="#4d7787" stroke-width="1"/>`;
  for (let x = -29; x <= 29; x += 1.8) k += `<line x1="${x}" y1=".4" x2="${x + 0.2}" y2="2" stroke="#6d98a8" stroke-width=".5"/>`;
  S.teil({ id: "badematte", de: "die Badematte", syl: "BA-de-mat-te", it: "il tappetino da bagno", itSyl: "tap-pe-TI-no da BA-gno", en: "bath mat",
    x: MATTE.x, y: MATTE.y, steht: true, kunst: k, tipp: "Auf der Badematte rutscht man mit nassen Füßen nicht aus." });
}
{
  const H = 1.78 * M(183);
  const m = B.mensch({ id: "b15a_mann", geschlecht: "m", pose: "stehen", blick: 28, frisur: "kurz", haarfarbe: "dunkelbraun", haut: "mittel", laecheln: true,
    kleidung: { kleid: { stueck: "bademantel", farbe: "weiss" }, schuhe: { stueck: "barfuss" } } }, H);
  const X = 214, Y = 183;
  const P = (n) => { const p = m.z.punkte[n]; return { x: X + p[0] * m.k, y: Y + p[1] * m.k }; };
  const kp = (n, w, h, dx = 0, dy = 0) => { const p = P(n); return { x: p.x + dx, y: p.y + dy, f: flaeche(-w / 2, -h / 2, w, h) }; };
  const teile = [];
  const wort = (id, de, syl, it, itSyl, en, q, tipp) => teile.push(Object.assign({ id, de, syl, it, itSyl, en, x: q.x, y: q.y, kunst: q.f }, tipp ? { tipp } : {}));
  const s = m.k;   /* cm → Einheiten */
  wort("kopf", "der Kopf", "KOPF", "la testa", "TE-sta", "head", kp("ohr", 9, 9, -1 * s, 0));
  wort("haar", "das Haar", "HAAR", "i capelli", "ca-PEL-li", "hair", kp("scheitel", 18 * s, 7 * s, 0, 3 * s));
  wort("gesicht", "das Gesicht", "Ge-SICHT", "il viso", "VI-so", "face", kp("nase", 13 * s, 16 * s, -1 * s, 0));
  wort("schulter", "die Schulter", "SCHUL-ter", "la spalla", "SPAL-la", "shoulder", kp("schulterL", 14 * s, 12 * s, 0, 2 * s));
  wort("brust", "die Brust", "BRUST", "il petto", "PET-to", "chest", kp("brust", 24 * s, 16 * s, -6 * s, -2 * s));
  wort("bauch", "der Bauch", "BAUCH", "la pancia", "PAN-cia", "belly", kp("bauch", 26 * s, 16 * s, 0, 0));
  wort("bein", "das Bein", "BEIN", "la gamba", "GAM-ba", "leg", kp("unterschenkelL", 14 * s, 26 * s, 0, -2 * s));
  wort("fuss", "der Fuß", "FUSS", "il piede", "PIE-de", "foot", kp("fussL", 18 * s, 10 * s, 1 * s, 0));
  const top = Y - H - 2;
  /* Schalkragen und Gürtel des Frottee-Bademantels über die Figur gelegt */
  const Q = (n, dx = 0, dy = 0) => { const p = m.z.punkte[n]; return `${r(p[0] * s + dx)} ${r(p[1] * s + dy)}`; };
  const yT = (m.z.punkte.tailleL[1] + m.z.punkte.tailleR[1]) / 2 * s;
  let mantel = `<path d="M${Q("hals", -5, 1)} Q${Q("brust", -8, 0)} ${r(3)} ${r(yT - 1)} L${r(6)} ${r(yT - 1)} Q${Q("brust", -3, 2)} ${Q("hals", -1.4, 2.4)} Z" fill="#e6e2da"/>`;
  mantel += `<path d="M${Q("hals", 4.6, 0)} Q${Q("brust", 1, -2)} ${r(-1)} ${r(yT - 1)} L${r(3)} ${r(yT - 1)} Q${Q("brust", 4, 0)} ${Q("hals", 8, 2.4)} Z" fill="#f4f1eb" stroke="#d4cfc4" stroke-width=".35"/>`;
  mantel += `<path d="M${Q("tailleR", -1.6, -1.4)} Q${r(0)} ${r(yT + 0.4)} ${Q("tailleL", 1.4, -1.4)} L${Q("tailleL", 1.4, 1.4)} Q${r(0)} ${r(yT + 3.2)} ${Q("tailleR", -1.6, 1.4)} Z" fill="#e3ded5" stroke="#cbc5b8" stroke-width=".3"/>`;
  mantel += `<ellipse cx="4.4" cy="${r(yT + 0.6)}" rx="2" ry="1.6" fill="#ece8e0" stroke="#cbc5b8" stroke-width=".3"/>`;
  mantel += `<path d="M3.6 ${r(yT + 1.6)} L2.4 ${r(yT + 14)} L4.6 ${r(yT + 14.2)} L5 ${r(yT + 1.8)} Z M5.4 ${r(yT + 1.6)} L7.6 ${r(yT + 12)} L9.4 ${r(yT + 11.4)} L6.4 ${r(yT + 1.2)} Z" fill="#e8e4dc" stroke="#cbc5b8" stroke-width=".3"/>`;
  S.teil({ id: "bademantel", de: "der Bademantel", syl: "BA-de-man-tel", it: "l'accappatoio", itSyl: "ac-cap-pa-TO-io", en: "bathrobe",
    x: X, y: Y, kunst: m.svg + mantel,
    zoom: { x: X - (H + 6) * 0.75, y: top, w: (H + 6) * 1.5, h: H + 6 },
    unter: teile,
    tipp: "Nach dem Duschen zieht er den Bademantel an. In der Lupe findest du die Körperteile." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/dusche.js"));
console.log(aus);
