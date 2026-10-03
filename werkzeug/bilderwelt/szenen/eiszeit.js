#!/usr/bin/env node
/* =====================================================================
   DIE EISZEIT (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (UNESCO-Welterbe „Höhlen der ältesten Eiszeitkunst“ auf der
   Schwäbischen Alb: Vogelherd, Hohle Fels; Urgeschichtliches Museum
   Blaubeuren; Fachliteratur zur Mammutsteppe):
   - Vor etwa 40 000 Jahren war Süddeutschland eine baumlose, kalte
     MAMMUTSTEPPE: Gras, Kräuter, Schneeflecken. Im Süden reichten die
     GLETSCHER der Alpen weit ins Vorland.
   - Tiere: Wollhaarmammut (3–3,4 m Schulterhöhe, hoher Kopfbuckel,
     abfallender Rücken, kleine Ohren, gebogene Stoßzähne) in HERDEN mit
     KÄLBERN; WOLLNASHORN (zwei Hörner, das vordere bis 1 m lang, flach);
     RENTIERE; die SÄBELZAHNKATZE Homotherium (lange Vorderbeine,
     abfallender Rücken, flache Säbelzähne) jagte junge Mammuts.
   - Menschen lebten an HÖHLEN in Kalkfelsen der Alb: vorn unter dem
     Felsdach das FEUER, Kleidung aus FELL, mit Knochennadeln genäht;
     Werkzeuge aus Feuerstein (FAUSTKEIL, Speerspitzen am SPEER).
   - Die HÖHLENMALEREI: Tiere in Rötel (Ocker) und Holzkohle,
     Handabdrücke (Hand als Schablone, Farbe drumherum gesprüht).
   BLICK: vom Lagerplatz vor der Höhle über die Steppe nach Süden,
   Augenhöhe 4 m (auf dem Hang), Horizont y = 92.
   Einheiten je Meter am Boden: s(y) = (y − 92) / 4
   (Mammut y 152: 15; Lager y 186: 23,5).
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "eiszeit", titel: "Die Eiszeit", emoji: "🦣", thema: "Natur", kuerzel: "b20f", fassung: 852 });
const rnd = zufall(40000);
const r = B.r;
const HY = 92, E = 4;
const s = (y) => (y - HY) / E;
const um = (ox, oy, svg) => `<g transform="translate(${r(-ox)} ${r(-oy)})">${svg}</g>`;
const knapp = (svg) => svg.replace(/ (d|x1|y1|x2|y2|cx|cy|rx|ry)="([^"]*)"/g, (m, a, v) => ` ${a}="${v.replace(/-?\d+\.\d+/g, (n) => String(Math.round(+n * 2) / 2))}"`);
const mensch = (spec, h) => { const m = B.mensch(spec, h); m.svg = knapp(m.svg); return m; };

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("dunst")}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="1.2"/></filter>`);
const FELS = S.lg("fels", [[0, "#cfc6b4"], [0.5, "#b6ab96"], [1, "#958a76"]], 0, 0, 1, 0);
const MAMMUTFELL = S.lg("mammutfell", [[0, "#7a4a2a"], [0.5, "#5a321a"], [1, "#3e2010"]]);

/* Tiere: Zeichner in Metern (x nach rechts, h nach oben), Blick nach links */
const tier = (x0, yb, sk) => ({ P: (a, h) => `${r(x0 + a * sk)} ${r(yb - h * sk)}`, X: (a) => r(x0 + a * sk), Y: (h) => r(yb - h * sk) });

/* Wollhaarmammut */
const mammut = (x0, yb, sk, kalb = false, f = MAMMUTFELL) => {
  const { P, X, Y } = tier(x0, yb, sk);
  let g = "";
  const bein = (a, w, farbe) => `<path d="M${P(a - w / 2, 1.9)} L${P(a + w / 2, 1.9)} L${P(a + w * 0.42, 0.14)} Q${P(a + w * 0.45, 0)} ${P(a, 0)} Q${P(a - w * 0.45, 0)} ${P(a - w * 0.42, 0.14)} Z" fill="${farbe}"/>`;
  /* ferne Beine */
  g += bein(-0.75, 0.5, "#3a1e0e") + bein(1.55, 0.5, "#3a1e0e");
  /* Rumpf: hoher Kopfbuckel, Schulterbuckel, abfallender Rücken; Bauch auf 1,3 m */
  g += `<path d="M${P(-1.5, 3.05)} Q${P(-0.9, 3.35)} ${P(-0.3, 3.15)} Q${P(0.8, 2.85)} ${P(1.7, 2.45)} Q${P(2.2, 2.1)} ${P(2.05, 1.65)} Q${P(1.9, 1.3)} ${P(1.3, 1.3)} L${P(0.2, 1.28)} Q${P(-0.8, 1.25)} ${P(-1.3, 1.35)} Q${P(-1.75, 1.7)} ${P(-1.8, 2.3)} Z" fill="${f}"/>`;
  /* Kopf mit hoher Stirnkuppel */
  g += `<path d="M${P(-1.4, 3.0)} Q${P(-1.75, 3.55)} ${P(-2.15, 3.35)} Q${P(-2.5, 3.0)} ${P(-2.45, 2.3)} Q${P(-2.4, 1.9)} ${P(-2.2, 1.7)} L${P(-1.6, 1.8)} Q${P(-1.3, 2.4)} ${P(-1.4, 3.0)} Z" fill="${f}"/>`;
  /* Rüssel: hängt, Spitze leicht nach vorn */
  g += `<path d="M${P(-2.42, 2.1)} Q${P(-2.55, 1.2)} ${P(-2.45, 0.55)} Q${P(-2.5, 0.38)} ${P(-2.68, 0.45)} L${P(-2.7, 0.56)} Q${P(-2.6, 0.62)} ${P(-2.58, 0.75)} Q${P(-2.7, 1.3)} ${P(-2.18, 1.95)} Z" fill="#4a2814"/>`;
  for (let i = 0; i < 6; i++) g += `<path d="M${P(-2.62 + i * 0.01, 0.8 + i * 0.22)} q${r(0.12 * sk)} ${r(-0.02 * sk)} ${r(0.2 * sk)} 0" stroke="#2e180a" stroke-width=".25" fill="none"/>`;
  /* Ohr klein, Auge */
  g += `<path d="M${P(-1.55, 2.75)} q${r(0.2 * sk)} ${r(-0.1 * sk)} ${r(0.25 * sk)} ${r(0.3 * sk)} q${r(-0.05 * sk)} ${r(0.25 * sk)} ${r(-0.25 * sk)} ${r(0.2 * sk)} Z" fill="#3e2010"/>`;
  g += `<circle cx="${X(-2.13)}" cy="${Y(2.62)}" r="${r(Math.max(0.35, 0.06 * sk))}" fill="#120a04"/>`;
  /* Stoßzähne: weit nach vorn-unten, dann nach oben und innen gebogen */
  if (!kalb) {
    g += `<path d="M${P(-2.32, 1.98)} Q${P(-2.9, 1.0)} ${P(-3.6, 1.3)} Q${P(-4.0, 1.75)} ${P(-3.62, 2.45)} L${P(-3.56, 2.4)} Q${P(-3.86, 1.8)} ${P(-3.54, 1.42)} Q${P(-2.95, 1.16)} ${P(-2.24, 2.12)} Z" fill="${S.lg("elfenbein", [[0, "#f4ead2"], [1, "#c9b48a"]])}"/>`;
    g += `<path d="M${P(-2.15, 1.92)} Q${P(-2.7, 1.08)} ${P(-3.25, 1.36)} Q${P(-3.5, 1.6)} ${P(-3.36, 2.05)}" stroke="#d9c9a4" stroke-width="${r(0.12 * sk)}" fill="none" opacity=".75"/>`;
  }
  /* nahe Beine */
  g += bein(-1.0, 0.56, f) + bein(1.25, 0.56, f);
  /* langes Fell: Strähnen hängen an Flanke und Bauch */
  for (let i = 0; i < 26; i++) {
    const a = -1.6 + i * 0.14, h = 1.38 + Math.sin((i / 25) * Math.PI) * 0.1, l = 0.4 + rnd() * 0.35;
    g += `<path d="M${P(a, h + 0.25)} q${r(0.04 * sk)} ${r(l * 0.5 * sk)} ${r(-0.02 * sk)} ${r(l * sk)}" stroke="${i % 2 ? "#4a2814" : "#6a3c1e"}" stroke-width="${r(Math.max(0.3, 0.06 * sk))}" fill="none" stroke-linecap="round"/>`;
  }
  for (let i = 0; i < 18; i++) { const a = -1.4 + rnd() * 3.2, h = 1.4 + rnd() * 1.6; g += `<path d="M${P(a, h)} q${r(0.03 * sk)} ${r(0.15 * sk)} 0 ${r(0.3 * sk)}" stroke="#8a5a34" stroke-width="${r(Math.max(0.2, 0.03 * sk))}" fill="none" opacity=".6"/>`; }
  g += `<path d="M${P(-1.5, 3.1)} Q${P(-0.9, 3.38)} ${P(-0.3, 3.18)} Q${P(0.8, 2.9)} ${P(1.6, 2.5)}" stroke="#a87a4e" stroke-width="${r(0.08 * sk)}" fill="none" opacity=".55"/>`;
  g += `<path d="M${P(2.05, 2.1)} q${r(0.15 * sk)} ${r(0.2 * sk)} ${r(0.1 * sk)} ${r(0.5 * sk)}" stroke="#3e2010" stroke-width="${r(0.08 * sk)}" fill="none"/>`;
  return g;
};

/* =====================================================================
   KULISSE — Himmel, Alpen mit Eis, Steppe, Kalkfelsen
   ===================================================================== */
{
  let k = `<rect width="320" height="${HY + 4}" fill="${S.lg("himmel", [[0, "#8fa8c4"], [0.6, "#c3d0dc"], [1, "#e2e6e6"]])}"/>`;
  /* Schichtwolken, kalt */
  k += `<g filter="url(#${S.id("dunst")})" opacity=".7"><ellipse cx="80" cy="30" rx="60" ry="5" fill="#e9eef3"/><ellipse cx="190" cy="18" rx="70" ry="4" fill="#dfe6ee"/><ellipse cx="150" cy="44" rx="40" ry="3" fill="#eef2f5"/></g>`;
  /* ferne Alpen mit Schnee */
  k += `<path d="M0 74 L18 58 L30 64 L48 46 L62 56 L78 42 L96 56 L112 50 L130 62 L150 58 L176 70 L200 66 L200 96 L0 96 Z" fill="${S.lg("alpen", [[0, "#7d8796"], [1, "#a3adb9"]])}"/>`;
  k += `<path d="M38 54 L48 46 L56 52 L52 54 L48 52 L44 56 Z M70 48 L78 42 L88 50 L82 50 L78 47 L74 51 Z M106 54 L112 50 L118 55 L112 54 Z" fill="#f4f7fa"/>`;
  /* Steppe bis zum Horizont, Schneeflecken */
  k += `<rect x="0" y="${HY - 2}" width="320" height="${202 - HY}" fill="${S.lg("steppe", [[0, "#b7b08a"], [0.5, "#a49a6c"], [1, "#8c7f52"]])}"/>`;
  for (let i = 0; i < 40; i++) { const y = HY + Math.pow(rnd(), 1.4) * 100, x = rnd() * 320, w = 2 + (y - HY) * 0.25 * rnd(); k += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(w)}" ry="${r(w * 0.12)}" fill="#eef2f4" opacity=".85"/>`; }
  /* Grasbüschel, nach vorn größer */
  let gras = "";
  for (let i = 0; i < 160; i++) { const y = HY + 4 + Math.pow(rnd(), 0.8) * 104, x = rnd() * 320, h = 0.4 + (y - HY) * 0.05; gras += `<path d="M${r(x)} ${r(y)} l${r(-h * 0.3)} ${r(-h)} M${r(x)} ${r(y)} l${r(h * 0.1)} ${r(-h * 1.2)} M${r(x)} ${r(y)} l${r(h * 0.4)} ${r(-h * 0.9)}" stroke="${rnd() < 0.5 ? "#c9bd8a" : "#8a7c4e"}" stroke-width="${r(0.15 + (y - HY) * 0.004)}"/>`; }
  k += gras;
  /* ferne Rentiere (kleine Herde) */
  for (const [x, y] of [[172, 104], [178, 105], [184, 103.6], [190, 105.2]]) k += `<path d="M${x - 2} ${y - 1.6} L${x + 1.6} ${y - 1.8} L${x + 2} ${y - 1} L${x - 2} ${y - 0.8} Z M${x - 1.6} ${y - 0.9} v1 M${x - 1} ${y - 0.9} v1 M${x + 1.2} ${y - 1} v1 M${x + 1.7} ${y - 1} v1" stroke="#5a4a36" stroke-width=".3" fill="#6a5a44"/><path d="M${x - 2} ${y - 1.6} l-.8 -1 M${x - 2.4} ${y - 2.2} l-.6 -.8 l.6 -.4 M${x - 2.4} ${y - 2.2} l.4 -.8" stroke="#5a4a36" stroke-width=".2" fill="none"/>`;
  S.hinten(k);
}

/* =====================================================================
   1 — DER GLETSCHER (Eiszunge aus den Alpen)
   ===================================================================== */
{
  const x = 70, y = 96;
  /* breites Nährgebiet zwischen den Gipfeln, Zunge fließt ins Vorland */
  const EIS = S.lg("eis", [[0, "#f6fbff"], [0.5, "#dcecf5"], [1, "#b2d4e6"]]);
  let k = `<path d="M58 56 Q66 60 72 52 Q80 58 92 56 Q90 66 88 74 Q88 86 100 96 L104 98 L36 98 L40 96 Q54 88 56 76 Q58 66 58 56 Z" fill="${EIS}"/>`;
  k += `<path d="M58 56 Q66 60 72 52 Q80 58 92 56" stroke="#ffffff" stroke-width="1" fill="none"/>`;
  /* Querspalten und Fließbögen */
  for (let i = 0; i < 8; i++) { const yy = 62 + i * 4.4, w = 26 + i * i * 0.7; k += `<path d="M${r(73 - w / 2)} ${r(yy)} q${r(w / 2)} ${r(2 + i * 0.3)} ${r(w)} 0" stroke="#86b6d2" stroke-width=".35" fill="none" opacity=".75"/>`; }
  /* Mittel- und Seitenmoränen (dunkle Schuttbänder) */
  k += `<path d="M72 54 Q72 76 68 97 M58 60 Q56 82 44 96 M90 60 Q90 84 100 96" stroke="#7a7466" stroke-width="1" fill="none" opacity=".65"/>`;
  k += `<path d="M36 98 Q52 95 70 97 Q88 95 104 98 L104 100 L36 100 Z" fill="#8f8a7c"/>`;
  S.teil({ id: "ez_gletscher", de: "der Gletscher", syl: "GLET-scher", it: "il ghiacciaio", itSyl: "ghiac-CIA-io", en: "glacier", x, y, kunst: um(x, y, k),
    tipp: "Eine Eiszunge, die sich Jahr für Jahr ein Stück vorschiebt. Sie kommt aus den Alpen." });
}

/* =====================================================================
   2 — DIE ZEITLEISTE (Bildleiste oben links, Lupe → Dinosaurier)
   ===================================================================== */
{
  const x = 52, y = 22;
  let k = `<rect x="${x - 46}" y="${y - 16}" width="92" height="16" rx="2" fill="#1e2a36" opacity=".72"/>`;
  k += `<text x="${x}" y="${y - 11}" font-size="2.6" text-anchor="middle" fill="#f1ece0" font-family="Arial" font-weight="bold">Zeitleiste</text>`;
  const ab = [["Dinosaurier", "#6fae4a", 0.5], ["…", "#e8c04a", 0.38], ["Eiszeit", "#bfe0f2", 0.12]];
  let t0 = 0;
  for (const [n, f, w] of ab) { const a = x - 42 + t0 * 84, b = a + w * 84; k += `<rect x="${r(a)}" y="${y - 8.6}" width="${r(b - a)}" height="3" fill="${f}"/><text x="${r((a + b) / 2)}" y="${y - 2.4}" font-size="2" text-anchor="middle" fill="#f1ece0" font-family="Arial">${n}</text>`; t0 += w; }
  k += `<path d="M${x + 37} ${y - 10.4} l1.4 -2 l1.4 2 Z" fill="#ffd36b"/><text x="${x + 38.4}" y="${y - 13}" font-size="1.8" text-anchor="middle" fill="#ffd36b" font-family="Arial">hier</text>`;
  S.teil({ id: "ez_zeitleiste", de: "die Zeitleiste", syl: "ZEIT-leis-te", it: "la linea del tempo", itSyl: "LI-ne-a del TEM-po", en: "timeline", x, y, kunst: um(x, y, k), lupe: "dinosaurier",
    tipp: "Vom Mammut bis heute sind 40 000 Jahre. Von den Dinosauriern bis zum Mammut sind 65 Millionen. Antippen führt zu den Sauriern." });
}

/* =====================================================================
   3 — DIE HERDE (Mammuts in der Ferne)
   ===================================================================== */
{
  const x = 124, y = 108;
  let k = "";
  for (const [mx, my, sk, kalb] of [[100, 104.2, 2.9, false], [116, 105, 3.1, false], [128, 104.6, 2.0, true], [140, 106, 3.4, false], [154, 105.4, 3.0, false]]) k += mammut(mx, my, sk, kalb, "#5a3a24");
  S.teil({ id: "ez_herde", de: "die Herde", syl: "HER-de", it: "il branco", itSyl: "BRAN-co", en: "herd", x, y, kunst: um(x, y, k) + flaeche(-36, -14, 74, 15),
    tipp: "Mammuts lebten in Herden — wie Elefanten heute." });
}

/* =====================================================================
   4 — DIE HÖHLE im Kalkfelsen und 5 — DIE HÖHLENMALEREI (Lupe)
   ===================================================================== */
const MUND = "M232 166 Q230 128 244 106 Q258 92 276 94 Q296 98 304 120 Q310 142 308 168 Z";
{
  /* Felswand (Kulisse) mit Bänken und Schneeresten */
  let f = `<path d="M196 200 L198 120 Q204 70 222 40 Q246 14 280 10 L320 8 L320 200 Z" fill="${FELS}"/>`;
  for (let i = 0; i < 9; i++) { const y = 30 + i * 18; f += `<path d="M${200 + i * 0.4} ${y + 10} Q${250} ${y + 6 + (i % 2) * 3} 320 ${y + 4}" stroke="#8a806e" stroke-width=".6" fill="none" opacity=".7"/>`; }
  for (let i = 0; i < 30; i++) { const x = 205 + rnd() * 112, y = 20 + rnd() * 170; f += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(1 + rnd() * 3)}" ry="${r(0.4 + rnd())}" fill="${rnd() < 0.5 ? "#a39884" : "#ddd5c4"}" opacity=".6"/>`; }
  f += `<path d="M222 40 Q246 14 280 10 L320 8 L320 14 Q284 16 258 26 Q236 36 226 48 Z" fill="#f2f5f7"/>`;
  f += `<path d="M204 84 q10 -4 18 0 M300 70 q10 -3 20 0" stroke="#f2f5f7" stroke-width="1.6" fill="none"/>`;
  f += `<path d="M196 200 L198 120 Q204 70 222 40 L232 34 Q214 70 210 120 L208 200 Z" fill="#fff" opacity=".18"/>`;
  for (let i = 0; i < 7; i++) { const x = 212 + rnd() * 100, y = 30 + rnd() * 60; f += `<path d="M${r(x)} ${r(y)} l${r(1 + rnd() * 2)} ${r(6 + rnd() * 10)}" stroke="#6e6656" stroke-width=".5"/>`; }
  for (const [x, y] of [[204, 170], [212, 182], [306, 176], [314, 160], [226, 60], [296, 54]]) f += `<path d="M${x - 3} ${y} q1 -3 3 -3.4 q2 .4 3 3.4 Z" fill="#5f6a48"/><path d="M${x - 2} ${y - 1} q1 -2 2 -2.2" stroke="#7a8660" stroke-width=".4" fill="none"/>`;
  S.hinten(f);
  let k = `<path d="${MUND}" fill="${S.rg("hoehle", [[0, "#5a3a20"], [0.4, "#2e1e12"], [1, "#120c08"]], 0.5, 0.75, 0.75)}"/>`;
  k += `<path d="M232 166 Q230 128 244 106 Q258 92 276 94 Q296 98 304 120 Q310 142 308 168" stroke="#7a7060" stroke-width="2.4" fill="none"/>`;
  k += `<path d="${MUND}" fill="${S.rg("feuerschein", [[0, "#ff9a3a", 0.35], [1, "#ff9a3a", 0]], 0.2, 0.9, 0.7)}"/>`;
  S.teil({ id: "ez_hoehle", de: "die Höhle", syl: "HÖH-le", it: "la caverna", itSyl: "ca-VER-na", en: "cave", x: 270, y: 168, kunst: um(270, 168, k),
    tipp: "Darin ist es windstill und immer gleich kühl." });
}
{
  /* Malerei an der hellen Innenwand rechts im Höhlenmund */
  const unter = [];
  let k = `<path d="M262 104 Q284 98 298 112 Q302 126 296 136 Q280 134 266 128 Q258 116 262 104 Z" fill="${S.lg("innenwand", [[0, "#b8a486"], [1, "#8a7458"]])}"/>`;
  /* Pferd (Holzkohle) */
  const px = 274, py = 113;
  k += `<path d="M${px - 6} ${py} Q${px - 4} ${py - 3} ${px + 2} ${py - 2.6} Q${px + 4} ${py - 4.6} ${px + 6} ${py - 4.4} L${px + 6.4} ${py - 3} Q${px + 5} ${py - 2} ${px + 4.4} ${py + 0.6} L${px + 4} ${py + 4} M${px + 2.4} ${py + 0.6} L${px + 2.8} ${py + 4} M${px - 4} ${py + 0.6} L${px - 4.4} ${py + 4} M${px - 5.4} ${py} L${px - 6} ${py + 3.8} M${px - 6} ${py} q-1.6 .4 -2 2.4" stroke="#1d1712" stroke-width=".6" fill="none" stroke-linecap="round"/>`;
  k += `<path d="M${px + 3} ${py - 3.4} l.8 -1.2 M${px + 3.6} ${py - 3.6} l.8 -1.2" stroke="#1d1712" stroke-width=".4"/>`;
  unter.push({ id: "ez_pferd", de: "das Pferd", syl: "PFERD", it: "il cavallo", itSyl: "ca-VAL-lo", en: "horse", x: px, y: py + 4.4, kunst: flaeche(-8, -9.4, 16, 9.6), tipp: "Mit Holzkohle gemalt: ein Wildpferd." });
  /* Wisent in Rötel */
  const bx = 284, by = 125;
  k += `<path d="M${bx - 7} ${by} Q${bx - 7} ${by - 4} ${bx - 4} ${by - 5.4} Q${bx - 1} ${by - 7.4} ${bx + 2} ${by - 6} Q${bx + 5} ${by - 4.6} ${bx + 6.4} ${by - 2} L${bx + 6.6} ${by + 0.4} Q${bx + 5} ${by + 1.2} ${bx + 4} ${by} L${bx + 3.6} ${by + 3.4} L${bx + 2.6} ${by + 3.4} L${bx + 2.4} ${by + 0.6} L${bx - 4} ${by + 0.6} L${bx - 4.4} ${by + 3.4} L${bx - 5.6} ${by + 3.4} L${bx - 6} ${by + 0.4} Z" fill="#9a3a1e" opacity=".9"/>`;
  k += `<path d="M${bx + 5.6} ${by - 3.4} q.8 -1.6 2 -1.4 M${bx - 4} ${by - 5} q2 -1.6 5 -1" stroke="#1d1712" stroke-width=".45" fill="none"/>`;
  unter.push({ id: "ez_wisent", de: "der Wisent", syl: "WI-sent", it: "il bisonte", itSyl: "bi-SON-te", en: "bison", x: bx, y: by + 3.6, kunst: flaeche(-8, -11, 16, 11.4), tipp: "Mit Rötel gemalt — rote Erde, mit Fett gemischt." });
  /* Handabdruck: Hand als Schablone, Farbe drumherum gesprüht */
  const hx = 268, hy = 124;
  k += `<circle cx="${hx}" cy="${hy}" r="5" fill="${S.rg("spray", [[0, "#a8401e", 0.85], [0.7, "#a8401e", 0.5], [1, "#a8401e", 0]])}"/>`;
  k += `<path d="M${hx - 1.8} ${hy + 3} L${hx - 2} ${hy} L${hx - 3.2} ${hy - 1.4} L${hx - 2.4} ${hy - 1.8} L${hx - 1.4} ${hy - 0.8} L${hx - 1.4} ${hy - 3.8} L${hx - 0.6} ${hy - 3.8} L${hx - 0.4} ${hy - 1} L${hx - 0.2} ${hy - 4.2} L${hx + 0.6} ${hy - 4.2} L${hx + 0.6} ${hy - 1} L${hx + 1} ${hy - 3.8} L${hx + 1.8} ${hy - 3.6} L${hx + 1.4} ${hy - 0.6} L${hx + 2} ${hy - 2.6} L${hx + 2.6} ${hy - 2.4} L${hx + 2} ${hy + 0.6} L${hx + 1.8} ${hy + 3} Z" fill="#b8a486"/>`;
  unter.push({ id: "ez_handabdruck", de: "der Handabdruck", syl: "HAND-ab-druck", it: "l'impronta della mano", itSyl: "im-PRON-ta del-la MA-no", en: "handprint", x: hx, y: hy + 5, kunst: flaeche(-5, -10, 10, 10), tipp: "Die Hand an die Wand gelegt und Farbe darum gepustet — wie eine Unterschrift." });
  S.teil({ id: "ez_malerei", de: "die Höhlenmalerei", syl: "HÖH-len-ma-le-rei", it: "la pittura rupestre", itSyl: "pit-TU-ra ru-PE-stre", en: "cave painting", x: 280, y: 136, kunst: um(280, 136, k),
    zoom: { x: 256, y: 98, w: 48, h: 32 }, unter,
    tipp: "Mit Ocker, Kohle und Fett an die Wand gemalt — die ältesten Bilder, die es gibt." });
}

/* =====================================================================
   6 — DAS WOLLNASHORN (links in der Steppe)
   ===================================================================== */
{
  const yb = 134, sk = s(yb), x0 = 34;           // 10,5 je Meter
  const { P, X, Y } = tier(x0, yb, sk);
  const FELL = S.lg("nashornfell", [[0, "#8a6a44"], [0.6, "#6a4e30"], [1, "#4a3420"]]);
  let k = schatten(x0, yb, 2.2 * sk, 1.4, 0.25);
  const bein = (a, w, fb) => `<path d="M${P(a - w / 2, 0.9)} L${P(a + w / 2, 0.9)} L${P(a + w / 2, 0.08)} Q${P(a, 0)} ${P(a - w / 2, 0.08)} Z" fill="${fb}"/>`;
  k += bein(-0.9, 0.36, "#3e2a18") + bein(1.25, 0.38, "#3e2a18");
  /* Rumpf mit Schulterbuckel */
  k += `<path d="M${P(-1.25, 1.55)} Q${P(-0.8, 2.05)} ${P(-0.2, 1.9)} Q${P(0.9, 1.75)} ${P(1.6, 1.6)} Q${P(1.95, 1.3)} ${P(1.75, 0.85)} L${P(-0.9, 0.7)} Q${P(-1.35, 0.9)} ${P(-1.25, 1.55)} Z" fill="${FELL}"/>`;
  /* Kopf tief, zwei Hörner (vorn lang, flach, nach vorn-oben) */
  k += `<path d="M${P(-1.2, 1.5)} Q${P(-1.6, 1.4)} ${P(-2.1, 0.95)} Q${P(-2.35, 0.75)} ${P(-2.3, 0.6)} L${P(-1.9, 0.55)} Q${P(-1.3, 0.8)} ${P(-1.05, 1.0)} Z" fill="${FELL}"/>`;
  k += `<path d="M${P(-2.22, 0.78)} Q${P(-2.6, 1.3)} ${P(-2.75, 1.95)} Q${P(-2.45, 1.4)} ${P(-2.05, 0.92)} Z" fill="#5a4630"/>`;
  k += `<path d="M${P(-1.92, 1.02)} Q${P(-2.0, 1.25)} ${P(-1.95, 1.4)} Q${P(-1.85, 1.2)} ${P(-1.78, 1.08)} Z" fill="#5a4630"/>`;
  k += `<circle cx="${X(-1.75)}" cy="${Y(1.05)}" r=".45" fill="#120a04"/><path d="M${P(-1.35, 1.45)} l-.6 -1.6 l1.4 .8 Z" fill="#4a3420"/>`;
  k += bein(-0.6, 0.4, FELL) + bein(1.45, 0.42, FELL);
  for (let i = 0; i < 16; i++) { const a = -1.1 + i * 0.18; k += `<path d="M${P(a, 0.85)} q.2 1.4 -.1 2.6" stroke="#4a3420" stroke-width=".35" fill="none"/>`; }
  S.teil({ id: "wollnashorn", de: "das Wollnashorn", syl: "WOLL-nas-horn", it: "il rinoceronte lanoso", itSyl: "ri-no-ce-RON-te la-NO-so", en: "woolly rhinoceros", x: x0, y: yb, steht: true, kunst: um(x0, yb, k),
    tipp: "Es hatte zwei Hörner. Mit dem vorderen, flachen Horn schob es Schnee vom Gras." });
}

/* =====================================================================
   7 — DAS MAMMUT und 8 — DAS MAMMUTKALB
   ===================================================================== */
{
  const yb = 154, sk = s(yb), x0 = 104;          // 15,5 je Meter
  const k = schatten(x0 + 4, yb, 2.6 * sk, 2, 0.28) + mammut(x0, yb, sk);
  S.teil({ id: "ez_mammut", de: "das Mammut", syl: "MAM-mut", it: "il mammut", itSyl: "MAM-mut", en: "mammoth", x: x0, y: yb, steht: true, kunst: um(x0, yb, k),
    tipp: "Ein Wollhaarmammut: drei Meter zwanzig an der Schulter, das Fell fünfzig Zentimeter lang. Es lebte vor 40 000 Jahren — die Dinosaurier waren da schon 65 Millionen Jahre ausgestorben." });
}
{
  const yb = 156, sk = s(yb) * 0.36, x0 = 156;   // Kalb ≈ 1,1 m Schulterhöhe
  const k = schatten(x0, yb, 2.4 * sk, 1.2, 0.25) + mammut(x0, yb, sk, true, S.lg("kalbfell", [[0, "#9a6a40"], [1, "#6a4426"]]));
  S.teil({ id: "ez_kalb", de: "das Mammutkalb", syl: "MAM-mut-kalb", it: "il cucciolo di mammut", itSyl: "CUC-cio-lo", en: "mammoth calf", x: x0, y: yb, steht: true, kunst: um(x0, yb, k),
    tipp: "Ein Jungtier — es läuft dicht neben der Mutter." });
}

/* =====================================================================
   9 — DIE SÄBELZAHNKATZE (Homotherium, pirscht sich auf einem Felsen an)
   ===================================================================== */
{
  const yb = 142, sk = s(yb), x0 = 186;          // 12,5 je Meter
  const { P, X, Y } = tier(x0, yb, sk);
  /* Felsblock */
  let k = `<path d="M${r(x0 - 22)} ${yb + 4} Q${r(x0 - 20)} ${yb - 4} ${r(x0 - 8)} ${yb - 1} Q${r(x0 + 6)} ${yb - 3} ${r(x0 + 18)} ${yb + 1} L${r(x0 + 22)} ${yb + 6} Z" fill="${FELS}"/>`;
  k += `<path d="M${r(x0 - 18)} ${yb} q6 -2 12 -.6" stroke="#f2f5f7" stroke-width="1" fill="none"/>`;
  const FELL = S.lg("katze", [[0, "#c9a46a"], [0.6, "#a8844e"], [1, "#7a5c34"]]);
  const yy = -0.1;
  /* ferne Beine */
  k += `<path d="M${P(-0.75, 0.75 + yy)} L${P(-0.85, 0.05 + yy)} L${P(-1.05, 0 + yy)} M${P(0.7, 0.6 + yy)} L${P(0.85, 0.25 + yy)} L${P(0.7, 0 + yy)}" stroke="#7a5c34" stroke-width="${r(0.13 * sk)}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  /* Rumpf: hohe Schultern, abfallender Rücken, kurzer Schwanz; geduckt */
  k += `<path d="M${P(-0.95, 0.75 + yy)} Q${P(-0.75, 1.05 + yy)} ${P(-0.2, 0.98 + yy)} Q${P(0.5, 0.88 + yy)} ${P(0.85, 0.78 + yy)} Q${P(1.0, 0.6 + yy)} ${P(0.85, 0.45 + yy)} Q${P(0.1, 0.4 + yy)} ${P(-0.7, 0.45 + yy)} Q${P(-1.0, 0.55 + yy)} ${P(-0.95, 0.75 + yy)} Z" fill="${FELL}"/>`;
  k += `<path d="M${P(0.88, 0.76 + yy)} q${r(0.25 * sk)} ${r(0.02 * sk)} ${r(0.32 * sk)} ${r(0.18 * sk)}" stroke="#8a6a3e" stroke-width="${r(0.07 * sk)}" fill="none" stroke-linecap="round"/>`;
  /* Kopf tief vorgestreckt, Säbelzähne */
  k += `<path d="M${P(-0.92, 0.82 + yy)} Q${P(-1.15, 0.86 + yy)} ${P(-1.35, 0.76 + yy)} Q${P(-1.42, 0.66 + yy)} ${P(-1.36, 0.6 + yy)} L${P(-1.05, 0.6 + yy)} Q${P(-0.9, 0.68 + yy)} ${P(-0.92, 0.82 + yy)} Z" fill="${FELL}"/>`;
  k += `<path d="M${P(-1.3, 0.62 + yy)} L${P(-1.28, 0.44 + yy)} L${P(-1.24, 0.62 + yy)} Z" fill="#f4ead6"/>`;
  k += `<circle cx="${X(-1.22)}" cy="${Y(0.75 + yy)}" r=".4" fill="#2a1c0c"/><path d="M${P(-1.0, 0.85 + yy)} l.6 -1.2 l.6 1 Z" fill="#8a6a3e"/>`;
  /* nahe Beine: lange Vorderbeine */
  k += `<path d="M${P(-0.65, 0.75 + yy)} L${P(-0.72, 0.05 + yy)} L${P(-0.92, 0 + yy)} M${P(0.55, 0.6 + yy)} L${P(0.72, 0.28 + yy)} L${P(0.58, 0 + yy)}" stroke="${FELL}" stroke-width="${r(0.15 * sk)}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  k += `<path d="M${P(-0.6, 0.95 + yy)} Q${P(0.1, 0.9 + yy)} ${P(0.7, 0.8 + yy)}" stroke="#e0c48e" stroke-width=".5" fill="none" opacity=".6"/>`;
  S.teil({ id: "saebelzahnkatze", de: "die Säbelzahnkatze", syl: "SÄ-bel-zahn-kat-ze", it: "la tigre dai denti a sciabola", itSyl: "TI-gre dai DEN-ti a SCIA-bo-la", en: "sabre-toothed cat", x: x0, y: yb + 4, steht: true, kunst: um(x0, yb + 4, k),
    tipp: "So groß wie ein Löwe, mit flachen Säbelzähnen. Sie jagte junge Mammuts." });
}

/* =====================================================================
   10 — DAS FELL (im Rahmen zum Trocknen), 11 — DER SCHNEE (vorn)
   ===================================================================== */
{
  const x = 26, y = 190, sk = s(y);              // 24,5 je Meter
  let k = schatten(x, y, 18, 1.6, 0.25);
  k += `<path d="M${x - 16} ${y} L${x - 13} ${y - 40} M${x + 16} ${y} L${x + 13} ${y - 40} M${x - 15} ${y - 38} L${x + 15} ${y - 38} M${x - 16.4} ${y - 6} L${x + 16.4} ${y - 6}" stroke="${S.lg("ast", [[0, "#7a5a3a"], [1, "#4e3622"]], 0, 0, 1, 0)}" stroke-width="1.8" stroke-linecap="round"/>`;
  /* Rentierfell: Kopf oben, Beine zu den Ecken gespannt */
  k += `<path d="M${x - 12} ${y - 35} Q${x} ${y - 38} ${x + 12} ${y - 35} Q${x + 10} ${y - 22} ${x + 13} ${y - 9} Q${x} ${y - 7} ${x - 13} ${y - 9} Q${x - 10} ${y - 22} ${x - 12} ${y - 35} Z" fill="${S.lg("haut", [[0, "#c8b08a"], [0.5, "#b0946a"], [1, "#94784e"]])}"/>`;
  k += `<path d="M${x - 11} ${y - 33} Q${x} ${y - 30} ${x + 11} ${y - 33} M${x - 11} ${y - 12} Q${x} ${y - 15} ${x + 11} ${y - 12}" stroke="#8a6e46" stroke-width=".4" fill="none"/>`;
  for (const [a, b, c, d] of [[-12, -35, -15, -38], [12, -35, 15, -38], [-13, -9, -16, -6], [13, -9, 16, -6], [-11, -22, -14.6, -22], [11, -22, 14.6, -22]]) k += `<line x1="${x + a}" y1="${y + b}" x2="${x + c}" y2="${y + d}" stroke="#d9c49a" stroke-width=".45"/>`;
  void sk;
  S.teil({ id: "ez_fell", de: "das Fell", syl: "FELL", it: "la pelliccia", itSyl: "pel-LIC-cia", en: "hide", x, y, steht: true, kunst: um(x, y, k),
    tipp: "Ein Rentierfell wird zum Trocknen in einen Rahmen gespannt. Daraus näht man Kleidung." });
}
{
  const x = 80, y = 196;
  let k = `<path d="M44 200 Q50 186 74 184 Q96 182 118 188 Q134 192 140 200 Z" fill="${S.lg("schnee", [[0, "#ffffff"], [1, "#d6e2ec"]])}"/>`;
  k += `<path d="M52 192 Q80 186 120 192" stroke="#c4d4e2" stroke-width=".8" fill="none"/>`;
  for (let i = 0; i < 6; i++) k += `<ellipse cx="${r(60 + i * 12)}" cy="${r(194 - (i % 2))}" rx="1.6" ry=".6" fill="#b8cadb" opacity=".8"/>`;
  k += `<path d="M150 192 Q162 186 176 188 Q186 190 190 196 Q170 198 150 196 Z" fill="#f2f6f9"/>`;
  S.teil({ id: "ez_schnee", de: "der Schnee", syl: "SCHNEE", it: "la neve", itSyl: "NE-ve", en: "snow", x, y, kunst: um(x, y, k),
    tipp: "Auch im Sommer blieben in der Eiszeit Schneereste liegen." });
}

/* =====================================================================
   12 — DAS FEUER, 13 — DIE FRAU AM FEUER, 14 — DAS KIND, 15 — DER FAUSTKEIL,
   16 — DER HÖHLENMENSCH, 17 — DER SPEER
   ===================================================================== */
const FEUER = { x: 222, y: 184 };
{
  const { x, y } = FEUER;
  let k = schatten(x, y, 12, 2, 0.35);
  for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2; k += `<ellipse cx="${r(x + Math.cos(a) * 9)}" cy="${r(y + Math.sin(a) * 2.6)}" rx="2.4" ry="1.6" fill="${i % 2 ? "#8a8270" : "#a39a86"}"/>`; }
  k += `<ellipse cx="${x}" cy="${y}" rx="7.6" ry="2" fill="#2a1a10"/>`;
  k += `<path d="M${x - 7} ${y - 0.4} L${x + 5} ${y - 3} M${x - 5} ${y - 3} L${x + 7} ${y}" stroke="#4e3220" stroke-width="1.6" stroke-linecap="round"/>`;
  k += `<path d="M${x - 5} ${y - 1} Q${x - 6} ${y - 8} ${x - 2} ${y - 12} Q${x - 2.6} ${y - 7} ${x} ${y - 6} Q${x} ${y - 13} ${x + 3} ${y - 16} Q${x + 2} ${y - 10} ${x + 5} ${y - 8} Q${x + 6} ${y - 4} ${x + 5} ${y - 1} Z" fill="${S.lg("flamme", [[0, "#ffe9a0"], [0.4, "#ffb23a"], [1, "#e0501a"]], 0, 1, 0, 0)}"/>`;
  k += `<path d="M${x - 2} ${y - 1} Q${x - 2.6} ${y - 5} ${x} ${y - 7} Q${x + 2.4} ${y - 4} ${x + 2} ${y - 1} Z" fill="#fff6c8"/>`;
  for (let i = 0; i < 6; i++) k += `<circle cx="${r(x - 4 + rnd() * 8)}" cy="${r(y - 16 - rnd() * 10)}" r=".35" fill="#ffc04a"/>`;
  k += `<g filter="url(#${S.id("dunst")})" opacity=".45"><ellipse cx="${x + 2}" cy="${y - 26}" rx="4" ry="5" fill="#bfb8ae"/><ellipse cx="${x + 6}" cy="${y - 36}" rx="6" ry="6" fill="#cfc9c0"/></g>`;
  k += `<circle cx="${x}" cy="${y - 6}" r="22" fill="${S.rg("glut", [[0, "#ffb050", 0.3], [1, "#ffb050", 0]])}"/>`;
  S.teil({ id: "ez_feuer", de: "das Feuer", syl: "FEU-er", it: "il fuoco", itSyl: "FUO-co", en: "fire", x, y, steht: true, kunst: um(x, y, k) + flaeche(-9, -18, 18, 19),
    tipp: "Das Feuer wärmt, kocht das Fleisch und hält die Tiere fern." });
}
{
  const x = 202, y = 188;
  const m = mensch({ id: "b20f_frau", geschlecht: "w", pose: "knien", blick: 55, frisur: "zopf", haarfarbe: "dunkelbraun", haut: "hell",
    kleidung: { jacke: { stueck: "mantel", farbe: "braun" }, oberteil: { stueck: "pullover", farbe: "beige" }, unterteil: { stueck: "hose", farbe: "braun" }, schuhe: { stueck: "stiefel", farbe: "braun" } } }, 1.62 * s(y));
  /* Spieß mit Fleisch über dem Feuer, gehalten in der vorderen Hand */
  const h = [m.z.handL, m.z.handR].sort((a, b) => b.x - a.x)[0];
  const hx = x + h.x * m.k, hy = y + h.y * m.k;
  let sp = `<line x1="${r(hx - 2)}" y1="${r(hy + 1)}" x2="${FEUER.x + 4}" y2="${FEUER.y - 14}" stroke="#6a4a2a" stroke-width=".7" stroke-linecap="round"/>`;
  sp += `<ellipse cx="${FEUER.x + 1}" cy="${FEUER.y - 12.4}" rx="2.6" ry="1.5" fill="#8a3a1e" transform="rotate(-30 ${FEUER.x + 1} ${FEUER.y - 12.4})"/>`;
  S.teil({ id: "ez_frau", de: "die Frau am Feuer", syl: "FRAU am FEU-er", it: "la donna al fuoco", itSyl: "DON-na al FUO-co", en: "woman by the fire", x, y, kunst: schatten(0, 0, 9, 1.2, 0.25) + m.svg + um(x, y, sp),
    tipp: "Sie kniet am Feuer und dreht das Fleisch. Ihre Kleidung ist aus Fell genäht." });
}
{
  const x = 254, y = 194;
  const m = mensch({ id: "b20f_kind", alter: "kind", geschlecht: "m", pose: "hocken", blick: -50, frisur: "locken", haarfarbe: "braun", haut: "hell",
    kleidung: { jacke: { stueck: "jacke", farbe: "braun" }, oberteil: { stueck: "pullover", farbe: "beige" }, unterteil: { stueck: "hose", farbe: "braun" }, schuhe: { stueck: "stiefel", farbe: "braun" } } }, 1.25 * s(y));
  /* Feuersteinknolle und Schlagstein in den Händen */
  let st = "";
  const hs = [m.z.handL, m.z.handR].map((h) => [h.x * m.k, h.y * m.k]);
  st += `<ellipse cx="${r(hs[0][0])}" cy="${r(hs[0][1] - 0.6)}" rx="1.6" ry="1.2" fill="#5a5a62"/><ellipse cx="${r(hs[1][0])}" cy="${r(hs[1][1] - 0.6)}" rx="1.4" ry="1.1" fill="#a39a86"/>`;
  S.teil({ id: "ez_kind", de: "das Kind", syl: "KIND", it: "il bambino", itSyl: "bam-BI-no", en: "child", x, y, kunst: schatten(0, 0, 7, 1, 0.25) + m.svg + st,
    tipp: "Es hockt am Boden und schlägt einen Stein zurecht." });
}
{
  const x = 238, y = 197;
  let k = schatten(x, y, 4, 0.8, 0.3);
  k += `<path d="M${x - 4} ${y - 0.4} Q${x - 3} ${y - 3} ${x + 1} ${y - 3.4} Q${x + 4.2} ${y - 2.4} ${x + 4.4} ${y - 0.6} Q${x} ${y + 0.4} ${x - 4} ${y - 0.4} Z" fill="${S.lg("feuerstein", [[0, "#a8a8a0"], [0.5, "#7a7870"], [1, "#55534c"]])}"/>`;
  for (const [a, b] of [[-2, -1.8], [0, -2.4], [2, -1.6], [-0.8, -1], [1.4, -0.8]]) k += `<path d="M${x + a - 0.8} ${y + b} q.8 -.6 1.6 0" stroke="#d6d4cc" stroke-width=".25" fill="none"/>`;
  S.teil({ oben: true, id: "ez_faustkeil", de: "der Faustkeil", syl: "FAUST-keil", it: "il bifacciale", itSyl: "bi-fac-CIA-le", en: "hand axe", x, y, steht: true, kunst: um(x, y, k) + flaeche(-5, -4.4, 10, 5),
    tipp: "Ein Werkzeug aus Feuerstein: An beiden Seiten hat man Schneiden herausgeschlagen." });
}
let SPEER = null;
{
  const x = 292, y = 186;
  const m = mensch({ id: "b20f_mann", geschlecht: "m", pose: "halten", blick: -30, frisur: "lang", haarfarbe: "dunkelbraun", haut: "hell",
    kleidung: { jacke: { stueck: "mantel", farbe: "braun" }, oberteil: { stueck: "pullover", farbe: "beige" }, unterteil: { stueck: "hose", farbe: "braun" }, schuhe: { stueck: "stiefel", farbe: "braun" }, kopf: { stueck: "muetze", farbe: "braun" } } }, 1.72 * s(y));
  const h = [m.z.handL, m.z.handR].sort((a, b) => a.x - b.x)[0];
  SPEER = [x + h.x * m.k, y + h.y * m.k, y];
  S.teil({ id: "ez_hoehlenmensch", de: "der Höhlenmensch", syl: "HÖH-len-mensch", it: "l'uomo delle caverne", itSyl: "UO-mo del-le ca-VER-ne", en: "cave dweller", x, y, kunst: schatten(0, 0, 9, 1.2, 0.25) + m.svg,
    tipp: "Er trägt Fell, weil es keine gewebten Stoffe gab." });
}
{
  const [hx, hy, yb] = SPEER;
  const x0 = hx - 1.6, y0 = yb - 0.4, x1 = hx + 1.2, y1 = hy - 30;
  let k = `<line x1="${r(x0)}" y1="${r(y0)}" x2="${r(x1)}" y2="${r(y1)}" stroke="${S.lg("schaft", [[0, "#9a7444"], [1, "#6a4a28"]], 0, 0, 1, 0)}" stroke-width="1" stroke-linecap="round"/>`;
  const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
  const sx = x1 + ux * 5, sy = y1 + uy * 5;
  k += `<path d="M${r(x1 - uy * 1.2)} ${r(y1 + ux * 1.2)} L${r(sx)} ${r(sy)} L${r(x1 + uy * 1.2)} ${r(y1 - ux * 1.2)} Z" fill="#6e6c66"/>`;
  k += `<path d="M${r(x1 - uy * 0.9 - ux * 1.4)} ${r(y1 + ux * 0.9 - uy * 1.4)} L${r(x1 + uy * 0.9 - ux * 1.4)} ${r(y1 - ux * 0.9 - uy * 1.4)} M${r(x1 - uy * 0.9 - ux * 2.4)} ${r(y1 + ux * 0.9 - uy * 2.4)} L${r(x1 + uy * 0.9 - ux * 2.4)} ${r(y1 - ux * 0.9 - uy * 2.4)}" stroke="#c9b48a" stroke-width=".5"/>`;
  S.teil({ oben: true, id: "ez_speer", de: "der Speer", syl: "SPEER", it: "la lancia", itSyl: "LAN-cia", en: "spear", x: r(x0), y: r(y0), kunst: um(x0, y0, k),
    tipp: "Ein Holzschaft mit einer Spitze aus Feuerstein, mit Sehnen festgebunden." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/eiszeit.js"));
console.log(aus);
