#!/usr/bin/env node
/* =====================================================================
   AM STRAND (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (Strand- und Badeordnungen Prerow/Usedom, DLRG-Wachdienst
   an der Ostsee, Fotos Ostseebäder Sellin, Heringsdorf, Kühlungsborn):
   - Ein deutscher Ostseestrand: feiner heller Sand, hinten die DÜNE mit
     STRANDHAFER (Dünenschutz: Schild „Betreten verboten“), vorne das
     grünblaue Meer mit flacher BRANDUNG; am Spülsaum Tang, MUSCHELN,
     STRANDKRABBEN und mit Glück BERNSTEIN.
   - STRANDKÖRBE stehen in Reihen (25 m² je Korb), sind nummeriert und
     werden vermietet; man dreht sie zur Sonne.
   - Der bewachte Abschnitt hat einen RETTUNGSTURM der DLRG auf Stelzen
     mit Rettungsring; die Flagge rot-gelb heißt „bewacht“ (Wachzeit
     etwa 9–18 Uhr).
   - Die SEEBRÜCKE führt auf Pfählen mehrere hundert Meter ins Meer,
     mit Laternen und einem Kopf für die Ausflugsschiffe.
   - Die deutsche Ostseeküste schaut meist nach Norden: Die Sonne steht
     hinter dem Betrachter, die Strandkörbe werden zur Sonne gedreht.
   - Palmen wachsen hier nicht im Boden: Hotels stellen Hanfpalmen im
     Kübel an den Strand.
   BLICK: vom oberen Strand aufs Meer, Augenhöhe 3 m (am Dünenfuß),
   Horizont y = 58. Einheiten je Meter am Boden: s(y) = (y − 58) / 3
   (vorn y 180: 41, Strandkorb y 125: 22, Wasserlinie y 103: 15).
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "strand", titel: "Am Strand", emoji: "🏖️", thema: "Urlaub", kuerzel: "b20a", fassung: 852 });
const rnd = zufall(1793);
const r = B.r;
const HY = 58, E = 3;
const s = (y) => (y - HY) / E;                       // Einheiten je Meter am Boden bei y
const um = (ox, oy, svg) => `<g transform="translate(${r(-ox)} ${r(-oy)})">${svg}</g>`;
const knapp = (svg) => svg.replace(/ (d|x1|y1|x2|y2|cx|cy|rx|ry)="([^"]*)"/g, (m, a, v) => ` ${a}="${v.replace(/-?\d+\.\d+/g, (n) => String(Math.round(+n)))}"`);
const mensch = (spec, h) => { const m = B.mensch(spec, h); m.svg = knapp(m.svg); return m; };
B.mensch({}, 10);
const MP = globalThis.DMA_MENSCH.POSEN;
MP.b20a_buddeln = Object.assign({}, MP.knien, { lende: 12, brust: 12, nacken: 10, kopf: 10,
  schulterR: { vor: 52, seit: 10 }, ellbogenR: 34, unterarmR: -30, handR: 0, fingerR: 0.7,
  schulterL: { vor: 40, seit: 18 }, ellbogenL: 30, unterarmL: -40, handL: 0, fingerL: 0.4 });

/* ---------- Stoffe ---------------------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("wolk")}" x="-20%" y="-40%" width="140%" height="180%"><feGaussianBlur stdDeviation="1.6"/></filter>`);
S.def(`<pattern id="${S.id("sand")}" width="4" height="3" patternUnits="userSpaceOnUse"><rect width="4" height="3" fill="#ead9b0"/><circle cx=".7" cy=".6" r=".22" fill="#d6c08f"/><circle cx="2.6" cy="1.9" r=".2" fill="#f6ead0"/><circle cx="1.6" cy="2.4" r=".16" fill="#cbb07a"/><circle cx="3.4" cy=".5" r=".14" fill="#bfa572"/></pattern>`);
S.def(`<pattern id="${S.id("geflecht")}" width="1.6" height="1.2" patternUnits="userSpaceOnUse"><rect width="1.6" height="1.2" fill="#f1ebdc"/><path d="M0 .3 h.8 M.8 .9 h.8" stroke="#cfc4a8" stroke-width=".35"/><path d="M.8 0 v.6 M0 .6 v.6 M1.6 .6 v.6" stroke="#ddd3bb" stroke-width=".2"/></pattern>`);
S.def(`<pattern id="${S.id("streifen")}" width="3" height="4" patternUnits="userSpaceOnUse"><rect width="3" height="4" fill="#f7f6f1"/><rect width="1.5" height="4" fill="#2f63a6"/></pattern>`);
const SAND = `url(#${S.id("sand")})`, GEFLECHT = `url(#${S.id("geflecht")})`, STREIFEN = `url(#${S.id("streifen")})`;
const HOLZ = S.lg("holz", [[0, "#b08a5c"], [0.5, "#9c7748"], [1, "#82603a"]], 0, 0, 1, 0);
const GRAUHOLZ = S.lg("grauholz", [[0, "#a59a88"], [0.5, "#8d8372"], [1, "#776e60"]], 0, 0, 1, 0);

/* =====================================================================
   KULISSE — Himmel, Wolken, ferne Küste, Meeresgrund, Sand
   ===================================================================== */
{
  let k = `<rect width="320" height="${HY + 2}" fill="${S.lg("himmel", [[0, "#5d97d0"], [0.55, "#93bfe4"], [1, "#d9e9f2"]])}"/>`;
  /* Kumuluswolken: runde Köpfe, flache Basis */
  const wolke = (x, y, w, a = 1) => {
    let g = `<g filter="url(#${S.id("wolk")})" opacity="${a}">`;
    g += `<ellipse cx="${x}" cy="${y + 2}" rx="${w}" ry="${r(w * 0.16)}" fill="#e3ebf2"/>`;
    for (let i = 0; i < 6; i++) { const t = i / 5 - 0.5, rr = w * (0.28 - Math.abs(t) * 0.22); g += `<circle cx="${r(x + t * w * 1.4)}" cy="${r(y - rr * 0.6)}" r="${r(rr)}" fill="#fbfdff"/>`; }
    return g + `<ellipse cx="${x}" cy="${y + 1.4}" rx="${r(w * 0.9)}" ry="${r(w * 0.1)}" fill="#cfdbe6" opacity=".7"/></g>`;
  };
  k += wolke(46, 20, 30) + wolke(250, 14, 22, 0.9) + wolke(170, 40, 16, 0.75) + wolke(300, 42, 12, 0.6);
  /* zwei ferne Möwen */
  k += `<path d="M196 30 q2 -1.4 3.4 0 q1.4 -1.4 3.4 0" stroke="#5b6670" stroke-width=".45" fill="none"/><path d="M60 46 q1.4 -1 2.4 0 q1 -1 2.4 0" stroke="#6b7680" stroke-width=".4" fill="none"/>`;
  /* ferne Küste rechts: Steilufer mit Wald, wird zur Düne hin höher */
  k += `<path d="M196 ${HY} L200 55.6 Q214 54 232 53.4 Q262 51.8 290 49 L320 46 L320 ${HY + 6} L196 ${HY + 6} Z" fill="${S.lg("kueste", [[0, "#5d7a5a"], [1, "#7c8f6e"]])}"/>`;
  k += `<path d="M198 ${HY} L202 56.6 L292 52.4 L320 51 L320 ${HY + 1} Z" fill="#d9c89f" opacity=".8"/>`;
  for (let i = 0; i < 40; i++) { const x = 202 + rnd() * 116, y = 54.6 - (x - 200) * 0.045 - rnd() * 1.4; k += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(0.8 + rnd() * 0.9)}" fill="${rnd() < 0.5 ? "#4d6a4b" : "#5f7d58"}"/>`; }
  k += `<rect x="196" y="47" width="124" height="${HY - 46}" fill="#cfe0ea" opacity=".28"/>`;
  /* Meeresgrund (unter den Wasserteilen) */
  k += `<rect x="0" y="${HY}" width="320" height="48" fill="${S.lg("meer", [[0, "#3f6f87"], [0.45, "#4f8796"], [1, "#78aba6"]])}"/>`;
  /* Sand: trocken oben, nass an der Wasserlinie, Spülsaum */
  k += `<rect x="0" y="100" width="320" height="100" fill="${SAND}"/>`;
  k += `<rect x="0" y="100" width="320" height="100" fill="${S.lg("sandlicht", [[0, "#b49c72", 0.35], [0.12, "#c8b088", 0.15], [0.3, "#fff", 0], [1, "#fff5dd", 0.25]])}"/>`;
  k += `<path d="M0 103 Q80 101.6 160 103.2 T320 103 L320 111 Q240 112.4 160 110.6 T0 111 Z" fill="#b7a07a" opacity=".55"/>`;
  /* Spülsaum: dunkle Linie aus Tang und Muschelbruch */
  let sp = "";
  for (let x = 0; x < 290; x += 1.6) { const y = 112.6 + Math.sin(x / 23) * 1.2 + rnd() * 0.8; sp += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(0.7 + rnd() * 1.1)}" ry=".32" fill="${rnd() < 0.6 ? "#5d5236" : "#7a6a45"}" opacity=".75"/>`; }
  k += sp;
  /* Fußspuren vom Spaziergänger am Wasser */
  for (let i = 0; i < 8; i++) { const x = 120 - i * 7, y = 108.4 + i * 0.25 + (i % 2) * 1.1; k += `<ellipse cx="${x}" cy="${r(y)}" rx="1" ry=".42" fill="#9f8a64" opacity=".6"/>`; }
  /* Fußspuren im trockenen Sand (Mulden) */
  for (let i = 0; i < 16; i++) { const x = 130 + rnd() * 140, y = 118 + rnd() * 40; k += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(0.9 + (y - 110) * 0.02)}" ry="${r(0.4 + (y - 110) * 0.008)}" fill="#cdb98e" opacity=".55"/>`; }
  S.hinten(k);
}

/* weiter entfernte Strandkörbe — gehören zum Teil „der Strandkorb“ */
const korbKlein = (x, y, sk, f) => {
  const w = 1.25 * sk, h = 1.6 * sk;
  let g = `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(w * 0.62)}" ry="${r(w * 0.1)}" fill="#6b5a3d" opacity=".25"/>`;
  g += `<rect x="${r(x - w / 2)}" y="${r(y - h * 0.28)}" width="${r(w)}" height="${r(h * 0.28)}" fill="#c9c2b2"/>`;
  g += `<path d="M${r(x - w / 2)} ${r(y - h * 0.28)} L${r(x - w / 2)} ${r(y - h * 0.8)} Q${r(x - w / 2)} ${r(y - h)} ${r(x)} ${r(y - h)} Q${r(x + w / 2)} ${r(y - h)} ${r(x + w / 2)} ${r(y - h * 0.8)} L${r(x + w / 2)} ${r(y - h * 0.28)} Z" fill="#ece5d3"/>`;
  g += `<path d="M${r(x - w * 0.38)} ${r(y - h * 0.3)} L${r(x - w * 0.38)} ${r(y - h * 0.78)} Q${r(x)} ${r(y - h * 0.94)} ${r(x + w * 0.38)} ${r(y - h * 0.78)} L${r(x + w * 0.38)} ${r(y - h * 0.3)} Z" fill="${f}"/>`;
  for (let i = -2; i <= 2; i++) g += `<rect x="${r(x + i * w * 0.15 - w * 0.035)}" y="${r(y - h * 0.86)}" width="${r(w * 0.07)}" height="${r(h * 0.56)}" fill="#fff" opacity=".7"/>`;
  return g + `<rect x="${r(x - w * 0.4)}" y="${r(y - h * 0.38)}" width="${r(w * 0.8)}" height="${r(h * 0.06)}" fill="#efe7d2"/>`;
};

/* =====================================================================
   1 — DER HORIZONT und 2 — DAS OFFENE MEER
   ===================================================================== */
{
  let k = `<rect x="0" y="${HY}" width="283" height="25" fill="${S.lg("offen", [[0, "#36647d"], [0.6, "#467d90"], [1, "#56909b"]])}"/>`;
  /* Wellenlinien, nach hinten immer dichter */
  for (let i = 0; i < 22; i++) {
    const y = HY + 0.6 + Math.pow(i / 21, 1.7) * 24;
    for (let x = rnd() * 12; x < 283; x += 10 + rnd() * 14) {
      const w = 2 + (y - HY) * 0.35;
      k += `<path d="M${r(x)} ${r(y)} q${r(w / 2)} ${r(-0.25 - (y - HY) * 0.02)} ${r(w)} 0" stroke="${rnd() < 0.5 ? "#a9cbd2" : "#2c556b"}" stroke-width="${r(0.18 + (y - HY) * 0.012)}" fill="none" opacity=".6"/>`;
    }
  }
  /* Glitzern der Sonne */
  for (let i = 0; i < 30; i++) k += `<rect x="${r(rnd() * 280)}" y="${r(HY + 2 + rnd() * 20)}" width="${r(0.6 + rnd() * 1.4)}" height=".25" fill="#fff" opacity=".5"/>`;
  S.teil({ id: "offenes_meer", de: "das offene Meer", syl: "OF-fe-nes MEER", it: "il mare aperto", itSyl: "MA-re a-PER-to", en: "open sea", x: 140, y: 70, kunst: um(140, 70, k),
    tipp: "Weit draußen — dort ist das Wasser am tiefsten und dunkelsten." });
}
{
  let k = `<rect x="0" y="${HY - 1.6}" width="197" height="3.2" fill="${S.lg("dunst", [[0, "#e4eef3", 0], [0.5, "#e8f1f5", 0.75], [1, "#e4eef3", 0]])}"/>`;
  k += `<rect x="0" y="${HY - 0.15}" width="197" height=".5" fill="#28546b"/>`;
  S.teil({ id: "horizont", de: "der Horizont", syl: "Ho-ri-ZONT", it: "l'orizzonte", itSyl: "o-riz-ZON-te", en: "horizon", x: 100, y: HY, kunst: um(100, HY, k),
    tipp: "Da, wo Himmel und Wasser sich berühren." });
}

/* =====================================================================
   3 — DER LEUCHTTURM auf dem Steilufer rechts (weiß-rot, Galerie)
   ===================================================================== */
{
  const x = 214, y = 55.4;
  let k = `<path d="M${x - 2.6} ${y} L${x - 1.6} ${y - 21} L${x + 1.6} ${y - 21} L${x + 2.6} ${y} Z" fill="${S.lg("ltw", [[0, "#ffffff"], [0.6, "#e9ecee"], [1, "#b9c0c6"]], 0, 0, 1, 0)}"/>`;
  for (const [a, b] of [[4, 8], [12, 16]]) {
    const w1 = 2.6 - a * 0.05, w2 = 2.6 - b * 0.05;
    k += `<path d="M${r(x - w1)} ${y - a} L${r(x - w2)} ${y - b} L${r(x + w2)} ${y - b} L${r(x + w1)} ${y - a} Z" fill="${S.lg("ltr", [[0, "#d23a30"], [0.6, "#b42a22"], [1, "#7e1b16"]], 0, 0, 1, 0)}"/>`;
  }
  k += `<rect x="${x - 2.4}" y="${y - 22}" width="4.8" height="1" fill="#2a2a2a"/><rect x="${x - 1.4}" y="${y - 25.4}" width="2.8" height="3.4" fill="#f6efc4" stroke="#2a2a2a" stroke-width=".3"/>`;
  k += `<path d="M${x - 1.8} ${y - 25.4} Q${x} ${y - 28} ${x + 1.8} ${y - 25.4} Z" fill="#b42a22"/><line x1="${x}" y1="${y - 27.6}" x2="${x}" y2="${y - 28.8}" stroke="#2a2a2a" stroke-width=".25"/>`;
  k += `<rect x="${x - 4}" y="${y - 1.6}" width="3" height="1.6" fill="#e6e1d6"/><path d="M${x - 4.4} ${y - 1.6} L${x - 2.5} ${y - 2.8} L${x - 0.6} ${y - 1.6} Z" fill="#b42a22"/>`;
  S.teil({ id: "leuchtturm", de: "der Leuchtturm", syl: "LEUCHT-turm", it: "il faro", itSyl: "FA-ro", en: "lighthouse", x, y, steht: true, kunst: um(x, y, k) + flaeche(-4, -29, 8, 29),
    tipp: "Nachts blinkt sein Licht, damit die Schiffe die Küste erkennen." });
}

/* =====================================================================
   4 — DIE SEEBRÜCKE (links, auf Pfählen bis weit ins Meer)
   ===================================================================== */
{
  /* Brücke auf X = −30 m; vorn (Bildrand) s = 5,33, Kopf s = 1,2 */
  const VX = 160, X = -30, H = 3.5;
  const pt = (sk, h) => [r(VX + X * sk), r(HY + (E - h) * sk)];
  const sNah = 160 / 30, sFern = 1.2;
  const [a1, a2] = [pt(sNah, H), pt(sFern, H)];
  const [u1, u2] = [pt(sNah, H - 0.7), pt(sFern, H - 0.7)];
  const [g1, g2] = [pt(sNah, H + 1.1), pt(sFern, H + 1.1)];
  let k = "";
  /* Pfähle: gleichmäßig in der Tiefe */
  const n = 28;
  for (let i = 0; i <= n; i++) {
    const sk = 1 / (1 / sNah + (1 / sFern - 1 / sNah) * i / n);
    const [px, py] = pt(sk, H - 0.7), [, pw] = pt(sk, -0.2);
    const b = Math.max(0.35, 0.4 * sk);
    k += `<rect x="${r(px - b / 2)}" y="${py}" width="${r(b)}" height="${r(pw - py)}" fill="#3f3a33"/>`;
    k += `<rect x="${r(px + b * 1.4)}" y="${py}" width="${r(b * 0.8)}" height="${r(pw - py - 0.2)}" fill="#4d473e" opacity=".8"/>`;
    if (i % 3 === 0 && i < n - 2) k += `<line x1="${r(px)}" y1="${r(py + (pw - py) * 0.15)}" x2="${r(px + 6 * sk)}" y2="${r(pw - (pw - py) * 0.2)}" stroke="#4a443b" stroke-width="${r(0.12 * sk)}"/>`;
    k += `<ellipse cx="${r(px + b * 0.4)}" cy="${r(pw)}" rx="${r(b * 1.4)}" ry="${r(b * 0.25)}" fill="#cfe2e6" opacity=".55"/>`;
  }
  /* Belag (Seitenansicht) und Geländer mit weißen Pfosten */
  k += `<path d="M${a1[0] - 2} ${a1[1]} L${a2[0]} ${a2[1]} L${u2[0]} ${u2[1]} L${u1[0] - 2} ${u1[1]} Z" fill="${S.lg("bruecke", [[0, "#7b6a55"], [1, "#5d4f3f"]])}"/>`;
  k += `<path d="M${a1[0] - 2} ${a1[1]} L${a2[0]} ${a2[1]}" stroke="#d8cfbd" stroke-width=".5"/>`;
  for (let i = 0; i <= 40; i++) {
    const sk = 1 / (1 / sNah + (1 / sFern - 1 / sNah) * i / 40);
    const [px, py] = pt(sk, H), [, gy] = pt(sk, H + 1.1);
    k += `<line x1="${px}" y1="${py}" x2="${px}" y2="${gy}" stroke="#f4f2ec" stroke-width="${r(Math.max(0.15, 0.1 * sk))}"/>`;
    if (i % 8 === 2) { const [, ly] = pt(sk, H + 3.4); k += `<line x1="${px}" y1="${py}" x2="${px}" y2="${ly}" stroke="#2c3236" stroke-width="${r(Math.max(0.2, 0.12 * sk))}"/><ellipse cx="${px}" cy="${ly}" rx="${r(0.28 * sk)}" ry="${r(0.4 * sk)}" fill="#f7f1d6" stroke="#2c3236" stroke-width="${r(0.06 * sk)}"/>`; }
  }
  k += `<path d="M${g1[0] - 2} ${g1[1]} L${g2[0]} ${g2[1]}" stroke="#f4f2ec" stroke-width="${r(0.15 * sNah)}"/>`;
  k += `<path d="M${g1[0] - 2} ${r((g1[1] + a1[1]) / 2)} L${g2[0]} ${r((g2[1] + a2[1]) / 2)}" stroke="#e9e6de" stroke-width=".35"/>`;
  /* Brückenkopf: breite Plattform mit Pavillon und Anleger */
  const kx = a2[0], ky = a2[1];
  k += `<rect x="${r(kx - 5)}" y="${r(ky)}" width="11" height="1" fill="#5d4f3f"/>`;
  for (let i = 0; i < 6; i++) k += `<rect x="${r(kx - 4.6 + i * 2)}" y="${r(ky + 1)}" width=".35" height="${r(pt(sFern, -0.2)[1] - ky - 1)}" fill="#3f3a33"/>`;
  k += `<rect x="${r(kx - 3.4)}" y="${r(ky - 3.4)}" width="6.4" height="3.4" fill="#f2efe6"/><path d="M${r(kx - 4.2)} ${r(ky - 3.4)} L${r(kx - 0.2)} ${r(ky - 6.2)} L${r(kx + 3.8)} ${r(ky - 3.4)} Z" fill="#3d6f8f"/>`;
  for (let i = 0; i < 3; i++) k += `<rect x="${r(kx - 2.8 + i * 2)}" y="${r(ky - 2.6)}" width="1.2" height="1.4" fill="#7fa2b6"/>`;
  k += `<line x1="${r(kx - 0.2)}" y1="${r(ky - 6.2)}" x2="${r(kx - 0.2)}" y2="${r(ky - 8.4)}" stroke="#2c3236" stroke-width=".2"/><path d="M${r(kx - 0.2)} ${r(ky - 8.4)} l1.6 .5 l-1.6 .5 Z" fill="#c7302a"/>`;
  S.teil({ id: "seebruecke", de: "die Seebrücke", syl: "SEE-brü-cke", it: "il pontile", itSyl: "pon-TI-le", en: "pier", x: 60, y: 74, kunst: um(60, 74, k),
    tipp: "Die Seebrücke steht auf Pfählen. Am Ende legen die Ausflugsschiffe an." });
}

/* =====================================================================
   5 — DAS SEGELBOOT (zwischen Brückenkopf und Leuchtturm)
   ===================================================================== */
{
  const x = 176, y = 64;
  let k = `<path d="M${x - 6} ${y - 2} L${x + 6.4} ${y - 2} Q${x + 5.6} ${y} ${x + 3.6} ${y + 0.4} L${x - 4.6} ${y + 0.4} Q${x - 5.8} ${y - 0.6} ${x - 6} ${y - 2} Z" fill="${S.lg("rumpf", [[0, "#ffffff"], [1, "#c9d1d6"]])}"/>`;
  k += `<rect x="${x - 6}" y="${y - 1.2}" width="12" height=".4" fill="#1f4f86"/>`;
  k += `<line x1="${x}" y1="${y - 2}" x2="${x}" y2="${y - 19}" stroke="#6b7176" stroke-width=".3"/>`;
  k += `<path d="M${x - 0.3} ${y - 18.6} Q${x - 4} ${y - 9} ${x - 5.4} ${y - 2.6} L${x - 0.3} ${y - 2.6} Z" fill="${S.lg("grosssegel", [[0, "#fdfdfb"], [1, "#d9dcd8"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${x + 0.3} ${y - 17.6} Q${x + 3.4} ${y - 10} ${x + 6} ${y - 2.6} L${x + 0.3} ${y - 2.6} Z" fill="#eef0ec"/>`;
  k += `<path d="M${x - 4.6} ${y + 0.5} q4.6 .8 9.2 0" stroke="#e8f1f2" stroke-width=".3" fill="none" opacity=".8"/>`;
  S.teil({ id: "segelboot", de: "das Segelboot", syl: "SE-gel-boot", it: "la barca a vela", itSyl: "BAR-ca a VE-la", en: "sailing boat", x, y, kunst: um(x, y, k) });
}

/* =====================================================================
   6 — DIE MÖWE (Silbermöwe im Flug)
   ===================================================================== */
{
  const x = 118, y = 30;
  /* Rumpf leicht von unten: weiß, Flügel silbergrau mit schwarzen,
     weiß getupften Spitzen, gelber Schnabel mit rotem Fleck */
  let k = `<path d="M${x - 15} ${y - 4.4} Q${x - 8} ${y - 6.6} ${x - 2.6} ${y - 0.8} L${x + 2.6} ${y - 0.8} Q${x + 8} ${y - 7.6} ${x + 16} ${y - 3} Q${x + 9} ${y - 3.8} ${x + 3} ${y + 1.6} L${x - 3} ${y + 1.6} Q${x - 8} ${y - 2.8} ${x - 15} ${y - 4.4} Z" fill="${S.lg("fluegel", [[0, "#b9c2c9"], [1, "#9aa5ae"]])}"/>`;
  k += `<path d="M${x - 15} ${y - 4.4} Q${x - 12.6} ${y - 5.2} ${x - 10.4} ${y - 4.6} Q${x - 12.4} ${y - 3.8} ${x - 15} ${y - 4.4} Z" fill="#1d1f22"/><circle cx="${x - 13.6}" cy="${y - 4.6}" r=".35" fill="#fff"/>`;
  k += `<path d="M${x + 16} ${y - 3} Q${x + 13.6} ${y - 4.6} ${x + 11.2} ${y - 4.6} Q${x + 13} ${y - 3.2} ${x + 16} ${y - 3} Z" fill="#1d1f22"/><circle cx="${x + 14.4}" cy="${y - 3.6}" r=".35" fill="#fff"/>`;
  k += `<path d="M${x - 9} ${y - 3.6} Q${x - 6} ${y - 2.6} ${x - 3} ${y + 1.2} M${x + 9} ${y - 4.2} Q${x + 6} ${y - 2.8} ${x + 3} ${y + 1.2}" stroke="#f4f6f7" stroke-width=".5" fill="none"/>`;
  k += `<ellipse cx="${x}" cy="${y + 0.6}" rx="4.4" ry="1.7" fill="${S.lg("bauch", [[0, "#ffffff"], [1, "#dfe4e8"]])}"/>`;
  k += `<path d="M${x + 3.6} ${y + 0.2} L${x + 7} ${y + 0.4} L${x + 6.6} ${y + 1.6} L${x + 3.4} ${y + 1.4} Z" fill="#f4f6f7"/>`;
  k += `<ellipse cx="${x - 4.6}" cy="${y - 0.1}" rx="1.9" ry="1.5" fill="#ffffff"/><circle cx="${x - 5.3}" cy="${y - 0.5}" r=".3" fill="#1d1f22"/>`;
  k += `<path d="M${x - 6.4} ${y - 0.2} L${x - 8.6} ${y + 0.4} L${x - 6.4} ${y + 0.8} Z" fill="#f2c230"/><circle cx="${x - 7.6}" cy="${y + 0.6}" r=".25" fill="#d0302a"/>`;
  k += `<path d="M${x + 2} ${y + 2} l.6 1.2 M${x + 2.8} ${y + 2} l.6 1.2" stroke="#e9a8a0" stroke-width=".4"/>`;
  S.teil({ id: "moewe", de: "die Möwe", syl: "MÖ-we", it: "il gabbiano", itSyl: "gab-BIA-no", en: "seagull", x, y, kunst: um(x, y, k),
    tipp: "Die Silbermöwe hat einen gelben Schnabel mit rotem Punkt. Pass auf dein Fischbrötchen auf!" });
}

/* =====================================================================
   7 — DIE WELLE, 8 — DIE BRANDUNG, 9 — DAS FLACHE WASSER, 10 — DER SCHAUM
   ===================================================================== */
{
  /* ein Wellenzug parallel zum Strand: dunkles Tal, helle Front */
  const y0 = 86;
  const linie = (dy, amp) => { let d = ""; for (let x = 0; x <= 284; x += 8) d += `${x === 0 ? "M" : "L"}${x} ${r(y0 + dy + Math.sin(x / 19) * amp)} `; return d; };
  let k = `<path d="${linie(-2.4, 0.5)} L284 ${y0 + 3} L0 ${y0 + 3} Z" fill="${S.lg("wellenk", [[0, "#5f9da6"], [0.55, "#3f7b8a"], [1, "#4e8b96"]])}"/>`;
  k += `<path d="${linie(-2.4, 0.5)}" stroke="#d9eef0" stroke-width=".7" fill="none" opacity=".85"/>`;
  k += `<path d="${linie(-1.2, 0.4)}" stroke="#9fd0d2" stroke-width=".4" fill="none" opacity=".7"/>`;
  for (let i = 0; i < 18; i++) { const x = rnd() * 280; k += `<path d="M${r(x)} ${r(y0 - 2.4 + Math.sin(x / 19) * 0.5)} q1.2 -.8 2.4 0" stroke="#fff" stroke-width=".5" fill="none" opacity=".8"/>`; }
  S.teil({ id: "welle", de: "die Welle", syl: "WEL-le", it: "l'onda", itSyl: "ON-da", en: "wave", x: 140, y: y0, kunst: um(140, y0, k),
    tipp: "Die Wellen laufen in Reihen auf den Strand zu." });
}
{
  const y0 = 93;
  let k = `<path d="M0 ${y0 - 3} Q70 ${y0 - 4.2} 140 ${y0 - 3} T284 ${y0 - 3.4} L284 ${y0 + 2.6} Q210 ${y0 + 3.4} 140 ${y0 + 2.4} T0 ${y0 + 2.8} Z" fill="${S.lg("brandung", [[0, "#cfe6e6"], [0.35, "#f6fbfa"], [0.7, "#e2efed"], [1, "#a8cfcc"]])}"/>`;
  for (let i = 0; i < 70; i++) { const x = rnd() * 282, y = y0 - 2.6 + rnd() * 5; k += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(0.6 + rnd() * 1.6)}" ry="${r(0.25 + rnd() * 0.35)}" fill="${rnd() < 0.5 ? "#ffffff" : "#bcdad8"}" opacity=".85"/>`; }
  k += `<path d="M0 ${y0 - 3} Q70 ${y0 - 4.2} 140 ${y0 - 3} T284 ${y0 - 3.4}" stroke="#4d8590" stroke-width=".5" fill="none" opacity=".6"/>`;
  S.teil({ id: "brandung", de: "die Brandung", syl: "BRAN-dung", it: "la risacca", itSyl: "ri-SAC-ca", en: "surf", x: 140, y: y0, kunst: um(140, y0, k),
    tipp: "Hier brechen sich die Wellen und werden zu Schaum." });
}
{
  const y0 = 99.6;
  let k = `<path d="M0 ${y0 - 3.6} Q70 ${y0 - 2.6} 140 ${y0 - 3.6} T284 ${y0 - 3} L284 ${y0 + 3.6} Q240 ${y0 + 4.4} 160 ${y0 + 3.6} T0 ${y0 + 4.4} Z" fill="${S.lg("flach", [[0, "#7fb8b2"], [0.6, "#a5cfc4", 0.9], [1, "#c9ddc8", 0.75]])}"/>`;
  /* Sandrippel scheinen durch */
  for (let i = 0; i < 26; i++) { const x = rnd() * 280, y = y0 - 2 + rnd() * 5; k += `<path d="M${r(x)} ${r(y)} q2 -.5 4 0" stroke="#d9cfa9" stroke-width=".35" fill="none" opacity=".55"/>`; }
  k += `<path d="M0 ${y0 + 4.4} Q80 ${y0 + 3.6} 160 ${y0 + 3.6} T284 ${y0 + 3.6}" stroke="#f3f7f2" stroke-width=".55" fill="none" opacity=".9"/>`;
  S.teil({ id: "flachwasser", de: "das flache Wasser", syl: "FLA-ches WAS-ser", it: "l'acqua bassa", itSyl: "AC-qua BAS-sa", en: "shallow water", x: 140, y: y0, kunst: um(140, y0, k),
    tipp: "Knietief — hier kann man noch stehen." });
}
{
  /* Schaumspitzen, die auf den nassen Sand laufen */
  const y0 = 104.4;
  let k = "";
  k += `<path d="M150 ${y0 - 1.4} Q190 ${y0 - 2.2} 230 ${y0 - 1} T282 ${y0 - 1.2} L282 ${y0 + 1.2} Q250 ${y0 + 2.6} 220 ${y0 + 1.2} Q190 ${y0 + 2.8} 150 ${y0 + 1} Z" fill="#f5faf8" opacity=".92"/>`;
  for (let i = 0; i < 46; i++) { const x = 152 + rnd() * 128, y = y0 - 1 + rnd() * 2.4; k += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(0.25 + rnd() * 0.5)}" fill="${rnd() < 0.5 ? "#c8e0dc" : "#ffffff"}"/>`; }
  k += `<path d="M152 ${y0 + 1.2} Q190 ${y0 + 3} 220 ${y0 + 1.4} Q250 ${y0 + 2.8} 282 ${y0 + 1.4}" stroke="#ffffff" stroke-width=".6" fill="none"/>`;
  S.teil({ id: "schaum", de: "der Schaum", syl: "SCHAUM", it: "la schiuma", itSyl: "SCHIU-ma", en: "foam", x: 216, y: y0, kunst: um(216, y0, k) });
}

/* =====================================================================
   11 — DIE LUFTMATRATZE (auf dem nassen Sand am Wasser)
   ===================================================================== */
{
  const x = 124, y = 140, sk = s(y);
  const L = 1.8 * sk, Bt = 0.65 * sk * 0.32;
  let k = schatten(x + 1, y + 0.6, L / 2, 1, 0.25);
  /* flach liegend: Oberseite als schmales Viereck mit Querwülsten, vorn die Kante, am Kopfende das Kissen */
  const D = Bt + 2.6, x0 = x - L / 2, x1 = x + L / 2, sh = 2.4;   // Tiefe auf dem Bild, Schräge
  k += `<path d="M${r(x0)} ${r(y - 1.6)} L${r(x1)} ${r(y - 1.6)} L${r(x1)} ${r(y)} Q${r(x)} ${r(y + 0.5)} ${r(x0)} ${r(y)} Z" fill="#a92e22"/>`;
  k += `<path d="M${r(x0)} ${r(y - 1.6)} L${r(x0 + sh)} ${r(y - 1.6 - D)} L${r(x1 + sh)} ${r(y - 1.6 - D)} L${r(x1)} ${r(y - 1.6)} Z" fill="${S.lg("matratze", [[0, "#f6806a"], [0.5, "#e8553f"], [1, "#c8392a"]])}"/>`;
  for (let i = 1; i < 9; i++) { const xx = x0 + 9 + i * (L - 9) / 9; k += `<path d="M${r(xx)} ${r(y - 1.6)} L${r(xx + sh)} ${r(y - 1.6 - D)}" stroke="#b8372a" stroke-width=".45"/><path d="M${r(xx + 1)} ${r(y - 1.6)} L${r(xx + 1 + sh)} ${r(y - 1.6 - D)}" stroke="#ff9d86" stroke-width=".35" opacity=".7"/>`; }
  k += `<path d="M${r(x0 + 0.6)} ${r(y - 1.6)} L${r(x0 + 0.6 + sh)} ${r(y - 1.8 - D)} L${r(x0 + 8.6 + sh)} ${r(y - 1.8 - D)} L${r(x0 + 8.6)} ${r(y - 1.6)} Z" fill="#f59a5a"/>`;
  k += `<path d="M${r(x0 + 0.6)} ${r(y - 1.6)} L${r(x0 + 8.6)} ${r(y - 1.6)} L${r(x0 + 8.6)} ${r(y - 0.2)} L${r(x0 + 0.6)} ${r(y - 0.2)} Z" fill="#c9622c"/>`;
  k += `<circle cx="${r(x1 - 2)}" cy="${r(y - 2.4)}" r=".5" fill="#fff"/>`;
  S.teil({ id: "luftmatratze", de: "die Luftmatratze", syl: "LUFT-ma-trat-ze", it: "il materassino", itSyl: "ma-te-ras-SI-no", en: "air mattress", x, y, steht: true, kunst: um(x, y, k) });
}

/* =====================================================================
   12 — DER MANN (geht barfuß am Wasser entlang)
   ===================================================================== */
{
  const x = 150, y = 106.6;
  const m = mensch({ id: "b20a_mann", geschlecht: "m", pose: "gehen", blick: -78, frisur: "kurz", haarfarbe: "grau", haut: "hell",
    kleidung: { oberteil: { stueck: "tshirt", farbe: "hellblau" }, unterteil: { stueck: "shorts", farbe: "beige" }, schuhe: { stueck: "barfuss" }, kopf: { stueck: "kappe", farbe: "weiss" } } }, 1.8 * s(y));
  S.teil({ id: "mann", de: "der Mann", syl: "MANN", it: "l'uomo", itSyl: "UO-mo", en: "man", x, y, kunst: schatten(0, 0, 4, 0.6, 0.2) + m.svg,
    tipp: "Er geht barfuß am Wasser entlang." });
}

/* =====================================================================
   13 — DIE DÜNE mit 14 — STRANDHAFER und 15 — DEM SCHILD (rechts)
   ===================================================================== */
const DUENE = "M320 34 Q306 40 300 56 Q294 74 289 92 Q284 112 282 130 Q280 160 279 200 L320 200 Z";
{
  let k = `<path d="${DUENE}" fill="${S.lg("duene", [[0, "#e6d3a4"], [0.5, "#dcc795"], [1, "#cdb684"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="${DUENE}" fill="${SAND}" opacity=".45"/>`;
  k += `<path d="M320 34 Q306 40 300 56 Q294 74 289 92 Q284 112 282 130 Q280 160 279 200" stroke="#f3e6c2" stroke-width="1.4" fill="none" opacity=".7"/>`;
  /* Windrippel */
  for (let i = 0; i < 14; i++) { const y = 70 + i * 9, x = 300 - (y - 60) * 0.12 + 3; k += `<path d="M${r(x)} ${y} q6 -1.4 14 0" stroke="#c6ad78" stroke-width=".4" fill="none" opacity=".7"/>`; }
  S.teil({ id: "duene", de: "die Düne", syl: "DÜ-ne", it: "la duna", itSyl: "DU-na", en: "dune", x: 300, y: 200, kunst: um(300, 200, k),
    tipp: "Die Düne schützt das Land vor dem Meer. Man darf sie nur auf den Wegen betreten." });
}
{
  /* Strandhafer: blaugrüne, harte, eingerollte Halme in Horsten */
  let k = "";
  const horst = (x, y, h) => {
    let g = "";
    for (let i = 0; i < 9; i++) {
      const a = -0.75 + i * 0.19 + (rnd() - 0.5) * 0.1, l = h * (0.7 + rnd() * 0.35);
      const ex = x + Math.sin(a) * l, ey = y - Math.cos(a) * l;
      g += `<path d="M${r(x + (i - 4) * 0.25)} ${r(y)} Q${r(x + Math.sin(a) * l * 0.4)} ${r(y - l * 0.6)} ${r(ex)} ${r(ey)}" stroke="${rnd() < 0.5 ? "#8fa27a" : "#a5b68c"}" stroke-width="${r(0.35 + h * 0.012)}" fill="none" stroke-linecap="round"/>`;
    }
    g += `<path d="M${r(x)} ${r(y)} q.3 ${r(-h * 0.8)} ${r(h * 0.05)} ${r(-h * 1.05)}" stroke="#c9b98a" stroke-width="${r(0.5 + h * 0.02)}" fill="none"/>`;
    return g;
  };
  const pos = [[314, 38, 7], [310, 46, 8], [306, 52, 9], [312, 60, 11], [302, 66, 10], [310, 76, 13], [297, 84, 11], [311, 92, 13], [293, 102, 12], [305, 106, 16], [290, 122, 14], [310, 124, 15], [300, 140, 17], [287, 150, 15], [309, 160, 17], [296, 178, 20], [306, 196, 20]];
  pos.forEach(([x, y, h]) => { k += horst(x, y, h); });
  S.teil({ id: "strandhafer", de: "der Strandhafer", syl: "STRAND-ha-fer", it: "lo sparto pungente", itSyl: "SPAR-to pun-GEN-te", en: "marram grass", x: 304, y: 120, kunst: um(304, 120, k),
    tipp: "Seine langen Wurzeln halten den Sand fest — so wächst die Düne." });
}
{
  const x = 289, y = 132;
  let k = schatten(x, y, 3, 0.6, 0.25);
  k += `<rect x="${x - 0.6}" y="${y - 30}" width="1.2" height="30" fill="${HOLZ}"/>`;
  k += `<rect x="${x - 9}" y="${y - 32}" width="18" height="11" rx=".6" fill="#f5f3ec" stroke="#2f6a3a" stroke-width=".6"/>`;
  k += `<circle cx="${x - 5}" cy="${y - 26.5}" r="3.2" fill="#fff" stroke="#c7302a" stroke-width=".7"/><path d="M${x - 6.4} ${y - 25} q1.4 -3 2.8 0 M${x - 5} ${y - 28} v3" stroke="#2d6b36" stroke-width=".5" fill="none"/><line x1="${x - 7.2}" y1="${y - 24.3}" x2="${x - 2.8}" y2="${y - 28.7}" stroke="#c7302a" stroke-width=".6"/>`;
  k += `<text x="${x + 3}" y="${y - 27.6}" font-size="2.3" text-anchor="middle" fill="#2f6a3a" font-family="Arial" font-weight="bold">Dünen-</text><text x="${x + 3}" y="${y - 25}" font-size="2.3" text-anchor="middle" fill="#2f6a3a" font-family="Arial" font-weight="bold">schutz</text><text x="${x + 3}" y="${y - 22.6}" font-size="1.5" text-anchor="middle" fill="#333" font-family="Arial">Betreten verboten</text>`;
  S.teil({ id: "schild", de: "das Schild", syl: "SCHILD", it: "il cartello", itSyl: "car-TEL-lo", en: "sign", x, y, steht: true, kunst: um(x, y, k),
    tipp: "Auf dem Schild steht: Dünenschutz — Betreten verboten." });
}

/* =====================================================================
   16 — DER RETTUNGSTURM der DLRG und 17 — DER RETTUNGSRING
   ===================================================================== */
const TURM = { x: 255, y: 113 };
{
  const { x, y } = TURM, sk = s(y);               // ≈ 18 Einheiten je Meter
  const bw = 2.2 * sk, st = 2.3 * sk, hh = 2.0 * sk;  // Breite, Stelzen, Hütte
  const yP = y - st;                              // Plattform
  let k = schatten(x, y + 0.5, bw * 0.75, 2, 0.28);
  /* Stelzen mit Kreuzverband, hinten dunkler */
  for (const dx of [-0.42, 0.42]) k += `<rect x="${r(x + dx * bw - 0.7)}" y="${r(yP)}" width="1.4" height="${r(st - 3)}" fill="#6f6556"/>`;
  k += `<path d="M${r(x - 0.42 * bw)} ${r(yP + 2)} L${r(x + 0.42 * bw)} ${r(y - 6)} M${r(x + 0.42 * bw)} ${r(yP + 2)} L${r(x - 0.42 * bw)} ${r(y - 6)}" stroke="#7a705f" stroke-width=".9"/>`;
  for (const dx of [-0.5, 0.5]) k += `<rect x="${r(x + dx * bw - 1)}" y="${r(yP)}" width="2" height="${r(st)}" fill="${GRAUHOLZ}"/>`;
  k += `<path d="M${r(x - 0.5 * bw)} ${r(yP + 3)} L${r(x + 0.5 * bw)} ${r(y - 2)} M${r(x + 0.5 * bw)} ${r(yP + 3)} L${r(x - 0.5 * bw)} ${r(y - 2)}" stroke="#8d8372" stroke-width="1.1"/>`;
  /* Leiter rechts */
  k += `<path d="M${r(x + 0.5 * bw + 1)} ${r(yP)} L${r(x + 0.5 * bw + 6)} ${r(y)} M${r(x + 0.5 * bw + 4)} ${r(yP)} L${r(x + 0.5 * bw + 9)} ${r(y)}" stroke="#8d8372" stroke-width=".8"/>`;
  for (let i = 1; i < 8; i++) { const t = i / 8; k += `<line x1="${r(x + 0.5 * bw + 1 + 5 * t)}" y1="${r(yP + t * st)}" x2="${r(x + 0.5 * bw + 4 + 5 * t)}" y2="${r(yP + t * st)}" stroke="#9a907e" stroke-width=".6"/>`; }
  /* Plattform mit Geländer */
  k += `<rect x="${r(x - 0.62 * bw)}" y="${r(yP - 1.6)}" width="${r(1.24 * bw)}" height="2.2" fill="#7e745f"/>`;
  /* Hütte: weiß, rotes Band mit DLRG, Fenster rundum, Pultdach */
  const hx0 = x - 0.45 * bw, hx1 = x + 0.45 * bw, hy1 = yP - 1.6, hy0 = hy1 - hh;
  k += `<rect x="${r(hx0)}" y="${r(hy0)}" width="${r(hx1 - hx0)}" height="${r(hh)}" fill="${S.lg("huette", [[0, "#ffffff"], [0.7, "#eef0ef"], [1, "#cdd2d2"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${r(hx0 + 1.6)}" y="${r(hy0 + 3)}" width="${r(hx1 - hx0 - 3.2)}" height="${r(hh * 0.38)}" fill="${S.lg("scheibe", [[0, "#9cc4d8"], [1, "#4f7f99"]])}"/>`;
  k += `<line x1="${r(x)}" y1="${r(hy0 + 3)}" x2="${r(x)}" y2="${r(hy0 + 3 + hh * 0.38)}" stroke="#f4f4f2" stroke-width="1"/>`;
  k += `<path d="M${r(hx0 + 2)} ${r(hy0 + 3)} l5 0 l-5 6 Z" fill="#fff" opacity=".35"/>`;
  k += `<rect x="${r(hx0)}" y="${r(hy1 - hh * 0.4)}" width="${r(hx1 - hx0)}" height="${r(hh * 0.3)}" fill="#d7262b"/>`;
  k += `<text x="${r(x)}" y="${r(hy1 - hh * 0.16)}" font-size="${r(hh * 0.22)}" text-anchor="middle" fill="#ffd400" font-family="Arial Black,Arial" font-weight="bold" letter-spacing=".3">DLRG</text>`;
  k += `<path d="M${r(hx0 - 3)} ${r(hy0 + 1)} L${r(hx1 + 3)} ${r(hy0 - 2)} L${r(hx1 + 3)} ${r(hy0 + 0.6)} L${r(hx0 - 3)} ${r(hy0 + 3)} Z" fill="${S.lg("dach", [[0, "#c7302a"], [1, "#8e1f1a"]])}"/>`;
  /* Geländer vor der Hütte */
  k += `<line x1="${r(x - 0.62 * bw)}" y1="${r(yP - 7)}" x2="${r(x + 0.62 * bw)}" y2="${r(yP - 7)}" stroke="#e9e6dd" stroke-width=".9"/>`;
  for (let i = 0; i <= 6; i++) k += `<line x1="${r(x - 0.62 * bw + i * 0.2067 * bw)}" y1="${r(yP - 7)}" x2="${r(x - 0.62 * bw + i * 0.2067 * bw)}" y2="${r(yP - 1.6)}" stroke="#e9e6dd" stroke-width=".7"/>`;
  /* Fahnenmast mit rot-gelber Flagge: „bewacht“ */
  const fx = hx0 + 2, fy = hy0 + 2;
  k += `<line x1="${r(fx)}" y1="${r(fy)}" x2="${r(fx)}" y2="${r(fy - 22)}" stroke="#d8dadb" stroke-width=".8"/><circle cx="${r(fx)}" cy="${r(fy - 22.4)}" r=".7" fill="#e3c44a"/>`;
  k += `<path d="M${r(fx + 0.4)} ${r(fy - 21.6)} Q${r(fx + 6)} ${r(fy - 23)} ${r(fx + 11)} ${r(fy - 21)} L${r(fx + 11)} ${r(fy - 17.4)} Q${r(fx + 6)} ${r(fy - 19.4)} ${r(fx + 0.4)} ${r(fy - 18)} Z" fill="#d7262b"/>`;
  k += `<path d="M${r(fx + 0.4)} ${r(fy - 18)} Q${r(fx + 6)} ${r(fy - 19.4)} ${r(fx + 11)} ${r(fy - 17.4)} L${r(fx + 11)} ${r(fy - 13.8)} Q${r(fx + 6)} ${r(fy - 15.8)} ${r(fx + 0.4)} ${r(fy - 14.4)} Z" fill="#ffd400"/>`;
  S.teil({ id: "rettungsturm", de: "der Rettungsturm", syl: "RET-tungs-turm", it: "la torretta di salvataggio", itSyl: "tor-RET-ta di sal-va-TAG-gio", en: "lifeguard tower", x, y, steht: true, kunst: um(x, y, k),
    tipp: "Hier passen die Rettungsschwimmer der DLRG auf. Die rot-gelbe Flagge heißt: Der Strand ist bewacht." });
  TURM.yP = yP; TURM.bw = bw;
}
{
  const x = TURM.x - 0.62 * TURM.bw + 3.4, y = TURM.yP + 6.4, R = 0.36 * s(TURM.y);
  let k = `<line x1="${r(x)}" y1="${r(TURM.yP)}" x2="${r(x)}" y2="${r(y - R)}" stroke="#d9d4c4" stroke-width=".35"/>`;
  k += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(R * 0.78)}" fill="none" stroke="#f3f1ec" stroke-width="${r(R * 0.44)}"/>`;
  for (let i = 0; i < 4; i++) { const a0 = i * 90 + 20, a1 = a0 + 45; const p = (a, rr) => `${r(x + Math.cos(a * Math.PI / 180) * rr)} ${r(y + Math.sin(a * Math.PI / 180) * rr)}`;
    k += `<path d="M${p(a0, R)} A${r(R)} ${r(R)} 0 0 1 ${p(a1, R)} L${p(a1, R * 0.56)} A${r(R * 0.56)} ${r(R * 0.56)} 0 0 0 ${p(a0, R * 0.56)} Z" fill="#d7262b"/>`; }
  k += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(R)}" fill="none" stroke="#b9b4a6" stroke-width=".2"/>`;
  S.teil({ oben: true, id: "rettungsring", de: "der Rettungsring", syl: "RET-tungs-ring", it: "il salvagente", itSyl: "sal-va-GEN-te", en: "lifebuoy", x, y: y + R, kunst: um(x, y + R, k) });
}

/* =====================================================================
   18 — DER STRANDKORB (zur Sonne gedreht, Nr. 47)
   ===================================================================== */
{
  const x = 182, y = 126, sk = s(y);
  const w = 1.25 * sk, h = 1.6 * sk, sitz = y - 0.42 * sk;
  let k = korbKlein(112, 109, s(109), "#3d8c6a") + korbKlein(136, 110, s(110), "#c7473d");
  k += schatten(x, y + 0.6, w * 0.62, 1.8, 0.3);
  /* Untergestell mit ausgezogenen Fußstützen */
  k += `<rect x="${r(x - w / 2)}" y="${r(sitz)}" width="${r(w)}" height="${r(y - sitz)}" fill="${S.lg("unterbau", [[0, "#f3efe6"], [1, "#cfc8b7"]])}"/>`;
  for (const dx of [-0.24, 0.24]) {
    k += `<path d="M${r(x + dx * w - w * 0.2)} ${r(sitz + 2)} L${r(x + dx * w + w * 0.2)} ${r(sitz + 2)} L${r(x + dx * w + w * 0.22)} ${r(y + 1.6)} L${r(x + dx * w - w * 0.22)} ${r(y + 1.6)} Z" fill="#e7e1d3" stroke="#a69c86" stroke-width=".3"/>`;
    k += `<rect x="${r(x + dx * w - 2)}" y="${r(sitz + 4)}" width="4" height=".8" rx=".4" fill="#8f8572"/>`;
  }
  /* Korb: Geflecht außen, Haube oben */
  const kx0 = x - w / 2, kx1 = x + w / 2, ky = y - h;
  k += `<path d="M${r(kx0)} ${r(sitz)} L${r(kx0)} ${r(ky + h * 0.24)} Q${r(kx0 + 1)} ${r(ky)} ${r(x)} ${r(ky)} Q${r(kx1 - 1)} ${r(ky)} ${r(kx1)} ${r(ky + h * 0.24)} L${r(kx1)} ${r(sitz)} Z" fill="${GEFLECHT}"/>`;
  k += `<path d="M${r(kx0)} ${r(sitz)} L${r(kx0)} ${r(ky + h * 0.24)} Q${r(kx0 + 1)} ${r(ky)} ${r(x)} ${r(ky)} Q${r(kx1 - 1)} ${r(ky)} ${r(kx1)} ${r(ky + h * 0.24)} L${r(kx1)} ${r(sitz)}" stroke="#bfb393" stroke-width=".9" fill="none"/>`;
  /* Innen: blau-weiß gestreifter Stoff */
  const ix0 = x - w * 0.4, ix1 = x + w * 0.4, iy = ky + 3.4;
  k += `<path d="M${r(ix0)} ${r(sitz)} L${r(ix0)} ${r(iy + h * 0.2)} Q${r(ix0 + 1)} ${r(iy)} ${r(x)} ${r(iy)} Q${r(ix1 - 1)} ${r(iy)} ${r(ix1)} ${r(iy + h * 0.2)} L${r(ix1)} ${r(sitz)} Z" fill="${STREIFEN}"/>`;
  k += `<path d="M${r(ix0)} ${r(sitz)} L${r(ix0)} ${r(iy + h * 0.2)} Q${r(ix0 + 1)} ${r(iy)} ${r(x)} ${r(iy)} Q${r(ix1 - 1)} ${r(iy)} ${r(ix1)} ${r(iy + h * 0.2)} L${r(ix1)} ${r(sitz)} Z" fill="${S.lg("korbschatten", [[0, "#1d2b3a", 0.5], [0.5, "#1d2b3a", 0.15], [1, "#1d2b3a", 0.05]])}"/>`;
  /* Sitzpolster und Armlehnen mit Klapptischchen */
  k += `<rect x="${r(ix0)}" y="${r(sitz - 3)}" width="${r(ix1 - ix0)}" height="3" rx="1" fill="${S.lg("polster", [[0, "#4a7bbd"], [1, "#2c578f"]])}"/>`;
  for (const [a, b] of [[kx0, ix0], [ix1, kx1]]) {
    k += `<rect x="${r(a)}" y="${r(sitz - h * 0.3)}" width="${r(b - a)}" height="${r(h * 0.3)}" fill="${GEFLECHT}"/>`;
    k += `<rect x="${r(a - 0.4)}" y="${r(sitz - h * 0.3 - 1)}" width="${r(b - a + 0.8)}" height="1.2" rx=".4" fill="${HOLZ}"/>`;
  }
  /* Markise vorn an der Haube und Nummernschild */
  k += `<path d="M${r(ix0 - 1)} ${r(iy + 1.4)} Q${r(x)} ${r(iy - 1.4)} ${r(ix1 + 1)} ${r(iy + 1.4)} L${r(ix1)} ${r(iy + 4.6)} Q${r(x)} ${r(iy + 2.6)} ${r(ix0)} ${r(iy + 4.6)} Z" fill="#2f63a6"/>`;
  for (let i = 0; i < 6; i++) k += `<path d="M${r(ix0 + 0.6 + i * (ix1 - ix0) / 6)} ${r(iy + 4.4 - Math.sin((i + 0.5) / 6 * Math.PI) * 2)} q${r((ix1 - ix0) / 12)} 1.2 ${r((ix1 - ix0) / 6)} 0" fill="#f7f6f1"/>`;
  k += `<rect x="${r(x - 3)}" y="${r(ky + 0.6)}" width="6" height="2.6" rx=".4" fill="#f7f6f1" stroke="#2f63a6" stroke-width=".3"/><text x="${r(x)}" y="${r(ky + 2.6)}" font-size="2.2" text-anchor="middle" fill="#2f63a6" font-family="Arial" font-weight="bold">47</text>`;
  k += `<path d="M${r(kx0 + 1)} ${r(ky + 6)} Q${r(kx0 + 1.6)} ${r(ky + 2)} ${r(kx0 + 5)} ${r(ky + 1.2)}" stroke="#fff" stroke-width=".7" opacity=".6" fill="none"/>`;
  S.teil({ id: "strandkorb", de: "der Strandkorb", syl: "STRAND-korb", it: "la sedia da spiaggia", itSyl: "SE-dia da SPIAG-gia", en: "beach chair", x, y, steht: true, kunst: um(x, y, k),
    tipp: "Den Strandkorb gibt es fast nur an der deutschen Nord- und Ostsee. Man mietet ihn für einen Tag oder eine Woche." });
}

/* =====================================================================
   19 — DIE PALME (Hanfpalme im Kübel), 20 — DER LIEGESTUHL,
   21 — DER SONNENSCHIRM
   ===================================================================== */
{
  const x = 18, y = 150, sk = s(y);                // ≈ 31 je Meter
  let k = schatten(x, y + 0.6, 9, 1.6, 0.3);
  /* Holzkübel */
  k += `<path d="M${x - 7.6} ${y - 14} L${x + 7.6} ${y - 14} L${x + 6.2} ${y} L${x - 6.2} ${y} Z" fill="${HOLZ}"/>`;
  for (let i = -2; i <= 2; i++) k += `<line x1="${x + i * 3}" y1="${y - 14}" x2="${r(x + i * 2.5)}" y2="${y}" stroke="#6e5232" stroke-width=".35"/>`;
  k += `<rect x="${x - 7.4}" y="${y - 11}" width="14.8" height="1.1" fill="#4c4c4c"/><rect x="${x - 6.6}" y="${y - 4}" width="13.2" height="1.1" fill="#4c4c4c"/>`;
  k += `<ellipse cx="${x}" cy="${y - 14}" rx="7.6" ry="1.6" fill="#4a3826"/>`;
  /* Stamm mit braunem Fasermantel */
  const top = y - 1.75 * sk;
  k += `<path d="M${x - 2.2} ${y - 14} Q${x - 1.4} ${r((y + top) / 2)} ${x - 1.4} ${r(top)} L${x + 1.4} ${r(top)} Q${x + 1.6} ${r((y + top) / 2)} ${x + 2.2} ${y - 14} Z" fill="${S.lg("stamm", [[0, "#5b4630"], [0.5, "#7a5f40"], [1, "#4a3825"]], 0, 0, 1, 0)}"/>`;
  for (let yy = y - 16; yy > top + 2; yy -= 2.4) k += `<path d="M${x - 1.8} ${r(yy)} q1.8 1 3.6 0" stroke="#3e2f20" stroke-width=".45" fill="none"/>`;
  /* Fächerblätter (Trachycarpus): Stiel, Fächer mit vielen Segmenten */
  const blatt = (a, l, sp) => {
    const rad = a * Math.PI / 180, bx = x + Math.cos(rad) * l, by = top + Math.sin(rad) * l;
    let g = `<path d="M${x} ${r(top)} Q${r((x + bx) / 2)} ${r((top + by) / 2 - 2)} ${r(bx)} ${r(by)}" stroke="#4f6b33" stroke-width=".55" fill="none"/>`;
    for (let i = 0; i < 13; i++) {
      const b = rad + (i - 6) * 0.11 * sp, L = 8 + Math.sin(i / 12 * Math.PI) * 3.4;
      g += `<path d="M${r(bx)} ${r(by)} L${r(bx + Math.cos(b - 0.05) * L)} ${r(by + Math.sin(b - 0.05) * L + 1.2)} L${r(bx + Math.cos(b + 0.05) * L)} ${r(by + Math.sin(b + 0.05) * L + 1.2)} Z" fill="${i % 2 ? "#3f7a3a" : "#4f8d44"}"/>`;
    }
    return g;
  };
  for (const [a, l, sp] of [[170, 5, 0.9], [10, 5, 0.9], [-165, 8, 1], [-15, 8, 1], [-135, 9, 1.1], [-45, 9, 1.1], [-110, 7, 1], [-70, 7, 1], [-90, 3, 0.9], [140, 3, 0.8], [40, 3, 0.8]]) k += blatt(a, l, sp);
  S.teil({ id: "palme", de: "die Palme", syl: "PAL-me", it: "la palma", itSyl: "PAL-ma", en: "palm tree", x, y, steht: true, kunst: um(x, y, k),
    tipp: "An der Ostsee wachsen keine Palmen. Diese Hanfpalme steht im Kübel und kommt im Winter ins Warme." });
}
{
  /* Liegestuhl aus Holz mit gestreiftem Segeltuch, schräg von vorn */
  const x = 46, y = 160, sk = s(y);              // ≈ 34 je Meter
  let k = schatten(x + 2, y + 0.5, 14, 2, 0.3);
  const L = (x1, y1, x2, y2, w = 1.4, f = HOLZ) => `<line x1="${r(x1)}" y1="${r(y1)}" x2="${r(x2)}" y2="${r(y2)}" stroke="${f}" stroke-width="${w}" stroke-linecap="round"/>`;
  /* Hinterbeine-Rahmen (lehnt) und Vorderbeine */
  k += L(x - 9, y - 2.4, x - 13, y - 28, 1.5, "#8a6a42") + L(x + 9, y - 2.4, x + 5, y - 28, 1.5, "#8a6a42");
  k += L(x - 11, y, x - 4, y - 14) + L(x + 11, y, x + 15, y - 14);
  k += L(x - 4, y - 14, x + 15, y - 14, 1.2);
  /* Tuch: von oben hinten nach vorne unten durchhängend */
  k += `<path d="M${x - 12.6} ${y - 27} L${x + 5.4} ${y - 27} Q${x + 8} ${y - 12} ${x + 14} ${y - 14.6} L${x - 3.4} ${y - 14.6} Q${x - 9} ${y - 12} ${x - 12.6} ${y - 27} Z" fill="${S.lg("tuch", [[0, "#e2472f"], [0.2, "#f6f1e6"], [0.4, "#e2472f"], [0.6, "#f6f1e6"], [0.8, "#e2472f"], [1, "#f6f1e6"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${x - 12.6} ${y - 27} L${x + 5.4} ${y - 27} Q${x + 8} ${y - 12} ${x + 14} ${y - 14.6} L${x - 3.4} ${y - 14.6} Q${x - 9} ${y - 12} ${x - 12.6} ${y - 27} Z" fill="${S.lg("tuchsch", [[0, "#000", 0.05], [0.7, "#000", 0.22], [1, "#000", 0.05]])}"/>`;
  k += L(x - 13, y - 28, x + 5, y - 28, 1.3);
  k += L(x - 3.4, y - 14.4, x + 14.4, y - 14.4, 1.2, "#9c7748");
  S.teil({ id: "liegestuhl", de: "der Liegestuhl", syl: "LIE-ge-stuhl", it: "la sdraio", itSyl: "SDRA-io", en: "deckchair", x, y, steht: true, kunst: um(x, y, k) });
}
{
  /* Sonnenschirm, in den Sand gesteckt, leicht geneigt */
  const x = 84, y = 170, sk = s(y);              // ≈ 37 je Meter
  const tx = x - 4, ty = y - 2.2 * sk, R = 0.95 * sk;
  let k = schatten(x, y + 0.5, 3, 0.7, 0.3);
  k += `<ellipse cx="${x}" cy="${y}" rx="2.4" ry=".7" fill="#d8c398"/>`;
  k += `<line x1="${x}" y1="${y}" x2="${r(tx)}" y2="${r(ty + 2)}" stroke="${S.lg("stock", [[0, "#ffffff"], [1, "#b7bcc0"]], 0, 0, 1, 0)}" stroke-width="1.3"/>`;
  k += `<rect x="${r(x - 0.5 - 1.5)}" y="${r(y - 26)}" width="2" height="3" rx=".6" fill="#4c5054"/>`;
  /* Schirmdach: acht Bahnen, gelb-weiß */
  const pkt = (a, rr, dy) => [tx + Math.cos(a) * rr, ty + 8 + Math.sin(a) * rr * 0.22 + dy];
  const n = 8;
  for (let i = 0; i < n; i++) {
    const a0 = Math.PI * i / n, a1 = Math.PI * (i + 1) / n;
    const p0 = pkt(a0, R, 0), p1 = pkt(a1, R, 0), pm = pkt((a0 + a1) / 2, R * 0.97, 1.1);
    k += `<path d="M${r(tx)} ${r(ty)} L${r(p0[0])} ${r(p0[1])} Q${r(pm[0])} ${r(pm[1])} ${r(p1[0])} ${r(p1[1])} Z" fill="${i % 2 ? "#f7f3e6" : "#f2b632"}"/>`;
  }
  k += `<path d="M${r(tx - R)} ${r(ty + 8)} Q${r(tx)} ${r(ty - 2)} ${r(tx + R)} ${r(ty + 8)} L${r(tx)} ${r(ty)} Z" fill="${S.lg("schirmlicht", [[0, "#fff", 0.35], [1, "#fff", 0]])}"/>`;
  k += `<path d="M${r(tx - R)} ${r(ty + 8)} Q${r(tx)} ${r(ty + 10.6)} ${r(tx + R)} ${r(ty + 8)}" stroke="#c98d1a" stroke-width=".6" fill="none"/>`;
  for (let i = 0; i <= n; i++) { const p = pkt(Math.PI * i / n, R, 0); k += `<path d="M${r(p[0])} ${r(p[1])} l0 1.4" stroke="#c98d1a" stroke-width=".5"/>`; }
  k += `<circle cx="${r(tx)}" cy="${r(ty - 0.4)}" r=".9" fill="#d9a321"/>`;
  S.teil({ id: "sonnenschirm", de: "der Sonnenschirm", syl: "SON-nen-schirm", it: "l'ombrellone", itSyl: "om-brel-LO-ne", en: "beach umbrella", x, y, steht: true, kunst: um(x, y, k) });
}

/* =====================================================================
   22 — DAS HANDTUCH (auf dem Sand), 23 — DIE SONNENCREME, 24 — DER WASSERBALL
   ===================================================================== */
{
  const p = [[100, 172], [176, 170], [184, 194], [94, 197]];
  let k = `<path d="M${p.map((q) => q.join(" ")).join(" L")} Z" fill="${S.lg("handtuch", [[0, "#2a7fb8"], [0.18, "#2a7fb8"], [0.18, "#f6f3ea"], [0.32, "#f6f3ea"], [0.32, "#2a7fb8"], [0.68, "#2a7fb8"], [0.68, "#f6f3ea"], [0.82, "#f6f3ea"], [0.82, "#2a7fb8"], [1, "#2a7fb8"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${p.map((q) => q.join(" ")).join(" L")} Z" fill="${S.lg("tuchlicht", [[0, "#000", 0.1], [1, "#fff", 0.12]])}"/>`;
  k += `<path d="M100 172 Q138 168.6 176 170" stroke="#f6f3ea" stroke-width=".6" fill="none"/>`;
  for (let i = 0; i < 8; i++) k += `<line x1="${r(94 + i * 0.6)}" y1="${r(197 - i * 3.2)}" x2="${r(91 + i * 0.6)}" y2="${r(197.6 - i * 3.2)}" stroke="#e8e2d4" stroke-width=".4"/>`;
  k += `<path d="M128 182 q10 -2 22 1" stroke="#1f6596" stroke-width=".5" fill="none" opacity=".6"/>`;
  S.teil({ id: "handtuch", de: "das Handtuch", syl: "HAND-tuch", it: "l'asciugamano", itSyl: "a-sciu-ga-MA-no", en: "towel", x: 140, y: 196, kunst: um(140, 196, k) });
}
{
  const x = 160, y = 186;
  let k = schatten(x + 1, y, 4, 0.8, 0.3);
  k += `<path d="M${x - 2.4} ${y} L${x - 2.8} ${y - 11} Q${x} ${y - 12} ${x + 2.8} ${y - 11} L${x + 2.4} ${y} Z" fill="${S.lg("creme", [[0, "#ffffff"], [0.6, "#f4f1e8"], [1, "#cfcabd"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${x - 2.6}" y="${y - 8}" width="5.2" height="4.4" fill="#f39a1f"/><circle cx="${x}" cy="${y - 5.8}" r="1.4" fill="#ffd64a"/>`;
  k += `<text x="${x}" y="${y - 1.6}" font-size="1.6" text-anchor="middle" fill="#2b5c9a" font-family="Arial" font-weight="bold">LSF 50</text>`;
  k += `<rect x="${x - 1.6}" y="${y - 14}" width="3.2" height="3" rx=".5" fill="#2b5c9a"/>`;
  k += `<path d="M${x - 2} ${y - 10} L${x - 1.6} ${y - 1}" stroke="#fff" stroke-width=".6" opacity=".7"/>`;
  S.teil({ oben: true, id: "sonnencreme", de: "die Sonnencreme", syl: "SON-nen-creme", it: "la crema solare", itSyl: "CRE-ma so-LA-re", en: "sun cream", x, y, steht: true, kunst: um(x, y, k),
    tipp: "Am Meer ist die Sonne stark — darum Sonnencreme mit hohem Schutz." });
}
{
  const x = 76, y = 192, R = 0.2 * s(y);         // Ø 40 cm
  let k = schatten(x + 1, y, R, 1.2, 0.3);
  const c = [x, y - R];
  k += `<circle cx="${r(c[0])}" cy="${r(c[1])}" r="${r(R)}" fill="#f6f3ea"/>`;
  k += `<path d="M${r(c[0])} ${r(c[1] - R)} A${r(R)} ${r(R)} 0 0 0 ${r(c[0])} ${r(c[1] + R)} A${r(R * 0.45)} ${r(R)} 0 0 1 ${r(c[0])} ${r(c[1] - R)} Z" fill="#e8322b"/>`;
  k += `<path d="M${r(c[0])} ${r(c[1] - R)} A${r(R * 0.45)} ${r(R)} 0 0 1 ${r(c[0])} ${r(c[1] + R)} A${r(R * 0.25)} ${r(R)} 0 0 0 ${r(c[0])} ${r(c[1] - R)} Z" fill="#f6f3ea"/>`;
  k += `<path d="M${r(c[0])} ${r(c[1] - R)} A${r(R * 0.25)} ${r(R)} 0 0 0 ${r(c[0])} ${r(c[1] + R)} A${r(R * 0.75)} ${r(R)} 0 0 0 ${r(c[0])} ${r(c[1] - R)} Z" fill="#2f6bc1"/>`;
  k += `<path d="M${r(c[0])} ${r(c[1] - R)} A${r(R)} ${r(R)} 0 0 1 ${r(c[0])} ${r(c[1] + R)} A${r(R * 0.75)} ${r(R)} 0 0 0 ${r(c[0])} ${r(c[1] - R)} Z" fill="#f2c024"/>`;
  k += `<circle cx="${r(c[0])}" cy="${r(c[1])}" r="${r(R)}" fill="${S.rg("ballglanz", [[0, "#fff", 0.55], [0.35, "#fff", 0], [1, "#000", 0.28]], 0.35, 0.3, 0.75)}"/>`;
  S.teil({ id: "ball", de: "der Wasserball", syl: "WAS-ser-ball", it: "il pallone", itSyl: "pal-LO-ne", en: "beach ball", x, y, steht: true, kunst: um(x, y, k) });
}

/* =====================================================================
   25 — DAS KIND, 26 — DIE SANDBURG (Lupe), 27 — DER EIMER, 28 — DIE SCHAUFEL
   ===================================================================== */
{
  const x = 206, y = 186;
  const m = mensch({ id: "b20a_kind", alter: "kind", geschlecht: "m", pose: "b20a_buddeln", blick: 62, frisur: "kurz", haarfarbe: "blond", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "badeshirt", farbe: "hellblau" }, unterteil: { stueck: "badehose", farbe: "orange" }, schuhe: { stueck: "barfuss" }, kopf: { stueck: "kappe", farbe: "gelb" } } }, 1.3 * s(y));
  S.teil({ id: "kind", de: "das Kind", syl: "KIND", it: "il bambino", itSyl: "bam-BI-no", en: "child", x, y, kunst: schatten(0, 0, 9, 1.2, 0.25) + m.svg,
    tipp: "Es baut eine Sandburg. Das UV-Shirt schützt vor Sonnenbrand." });
}
const BURG = { x: 242, y: 186 };
{
  const { x, y } = BURG;
  let k = "";
  /* Wassergraben ringsum */
  k += `<ellipse cx="${x}" cy="${y - 2}" rx="21" ry="5.6" fill="#c3a876"/><ellipse cx="${x}" cy="${y - 2.4}" rx="18.6" ry="4.4" fill="${S.lg("graben", [[0, "#7ea8a6"], [1, "#a9c6bd"]])}"/>`;
  k += `<ellipse cx="${x}" cy="${y - 3}" rx="15" ry="3.4" fill="#d8bf8c"/>`;
  /* Burg aus nassem Sand: Mauer, drei Türme mit Zinnen */
  const SANDN = S.lg("nasssand", [[0, "#d9be88"], [0.6, "#c9aa72"], [1, "#a98a58"]], 0, 0, 1, 0);
  k += `<path d="M${x - 13} ${y - 3} L${x - 13} ${y - 9} L${x + 13} ${y - 9} L${x + 13} ${y - 3} Q${x} ${y - 1} ${x - 13} ${y - 3} Z" fill="${SANDN}"/>`;
  for (let i = 0; i < 7; i++) k += `<rect x="${x - 12.4 + i * 3.8}" y="${y - 10.6}" width="2" height="1.8" fill="${SANDN}"/>`;
  k += `<path d="M${x - 2.6} ${y - 2} L${x - 2.6} ${y - 5.6} Q${x} ${y - 8} ${x + 2.6} ${y - 5.6} L${x + 2.6} ${y - 2} Z" fill="#8e7148"/>`;
  const turm = (tx, h, w) => {
    let g = `<path d="M${tx - w} ${y - 4} L${tx - w * 0.82} ${y - h} L${tx + w * 0.82} ${y - h} L${tx + w} ${y - 4} Z" fill="${SANDN}"/>`;
    g += `<ellipse cx="${tx}" cy="${y - h}" rx="${r(w * 0.82)}" ry="${r(w * 0.25)}" fill="#e3cb97"/>`;
    for (let i = 0; i < 4; i++) g += `<rect x="${r(tx - w * 0.8 + i * w * 0.46)}" y="${r(y - h - 1.6)}" width="${r(w * 0.26)}" height="1.6" fill="${SANDN}"/>`;
    for (let i = 0; i < 3; i++) g += `<line x1="${r(tx - w * 0.9)}" y1="${r(y - 6 - i * (h - 6) / 3)}" x2="${r(tx + w * 0.9)}" y2="${r(y - 6 - i * (h - 6) / 3)}" stroke="#b99b67" stroke-width=".3" opacity=".7"/>`;
    return g;
  };
  k += turm(x - 11, 15, 3.8) + turm(x + 11, 14, 3.6) + turm(x, 20, 4.4);
  /* Fähnchen auf dem Hauptturm */
  k += `<line x1="${x}" y1="${y - 21.6}" x2="${x}" y2="${y - 30}" stroke="#7a5a32" stroke-width=".35"/><path d="M${x} ${y - 30} L${x + 4.4} ${y - 28.6} L${x} ${y - 27.2} Z" fill="#d7262b"/>`;
  /* Muscheln an der Mauer (Herz-, Mies- und Sandklaffmuschel) */
  const unter = [];
  const herzmuschel = (mx, my, sc) => {
    let g = `<path d="M${mx - 1.6 * sc} ${my} Q${mx - 1.8 * sc} ${my - 2.2 * sc} ${mx} ${my - 2.4 * sc} Q${mx + 1.8 * sc} ${my - 2.2 * sc} ${mx + 1.6 * sc} ${my} Q${mx} ${my + 0.5 * sc} ${mx - 1.6 * sc} ${my} Z" fill="${S.lg("muschel", [[0, "#fbf3e6"], [1, "#d9bfa0"]])}" stroke="#b39373" stroke-width=".15"/>`;
    for (let i = -2; i <= 2; i++) g += `<path d="M${mx} ${my - 2.3 * sc} Q${r(mx + i * 0.5 * sc)} ${r(my - 1.4 * sc)} ${r(mx + i * 0.7 * sc)} ${r(my + 0.1 * sc)}" stroke="#c1a283" stroke-width=".18" fill="none"/>`;
    return g;
  };
  k += herzmuschel(x - 6, y - 4.8, 1) + herzmuschel(x + 6, y - 5, 0.9);
  k += `<path d="M${x + 15} ${y + 2.2} q2.6 -1.6 5 -.4 q-1.6 1.6 -5 .4 Z" fill="#273148"/><path d="M${x + 15.4} ${y + 2} q2.2 -1 4.2 -.3" stroke="#5a6a8c" stroke-width=".25" fill="none"/>`;
  unter.push({ id: "muschel", de: "die Muschel", syl: "MU-schel", it: "la conchiglia", itSyl: "con-CHI-glia", en: "shell", x: x - 6, y: y - 4.8, kunst: flaeche(-3, -4.2, 6, 5),
    tipp: "Die Herzmuschel findet man an der Ostsee überall im Spülsaum." });
  /* Strandkrabbe am Grabenrand: grünbraun, seitwärts */
  {
    const cx = x - 19, cy = y + 0.6;
    let g = "";
    for (const sd of [-1, 1]) for (let i = 0; i < 4; i++) g += `<path d="M${r(cx + sd * 1.4)} ${r(cy - 0.4 + i * 0.35)} q${r(sd * 1.2)} -.9 ${r(sd * 2)} ${r(0.4 + i * 0.2)}" stroke="#5a5a2e" stroke-width=".3" fill="none" stroke-linecap="round"/>`;
    g += `<path d="M${r(cx - 1.6)} ${r(cy - 1.4)} q-1.2 -1.2 -2 -.4 q.4 .9 1.6 .8 Z M${r(cx + 1.6)} ${r(cy - 1.4)} q1.2 -1.2 2 -.4 q-.4 .9 -1.6 .8 Z" fill="#6c6a34"/>`;
    g += `<path d="M${r(cx - 2)} ${r(cy - 0.4)} Q${r(cx - 2.2)} ${r(cy - 2.2)} ${r(cx)} ${r(cy - 2.4)} Q${r(cx + 2.2)} ${r(cy - 2.2)} ${r(cx + 2)} ${r(cy - 0.4)} Q${r(cx)} ${r(cy + 0.4)} ${r(cx - 2)} ${r(cy - 0.4)} Z" fill="${S.rg("krabbe", [[0, "#8a8644"], [0.7, "#5f6a2e"], [1, "#3f4a22"]], 0.45, 0.3, 0.7)}"/>`;
    for (let i = -2; i <= 2; i++) g += `<circle cx="${r(cx + i * 0.7)}" cy="${r(cy - 2.35 + Math.abs(i) * 0.12)}" r=".16" fill="#3d4520"/>`;
    g += `<circle cx="${r(cx - 0.5)}" cy="${r(cy - 2.5)}" r=".22" fill="#1b1d10"/><circle cx="${r(cx + 0.5)}" cy="${r(cy - 2.5)}" r=".22" fill="#1b1d10"/>`;
    k += g;
    unter.push({ id: "strandkrabbe", de: "die Strandkrabbe", syl: "STRAND-krab-be", it: "il granchio", itSyl: "GRAN-chio", en: "shore crab", x: cx, y: cy + 1, kunst: flaeche(-4.4, -4.4, 8.8, 5.2),
      tipp: "Sie ist grünbraun, nicht rot — rot wird sie erst im Kochtopf. Der Panzer ist sieben Zentimeter breit. Sie läuft seitwärts." });
  }
  /* Bernstein auf dem Sand */
  {
    const bx = x + 18, by = y - 3.4;
    k += `<path d="M${bx - 1.6} ${by} Q${bx - 1.8} ${by - 1.6} ${bx - 0.2} ${by - 1.8} Q${bx + 1.6} ${by - 1.6} ${bx + 1.5} ${by - 0.2} Q${bx} ${by + 0.5} ${bx - 1.6} ${by} Z" fill="${S.rg("bernstein", [[0, "#ffd36b"], [0.6, "#e08a1c"], [1, "#9a4f0c"]], 0.4, 0.35, 0.7)}"/><circle cx="${bx - 0.5}" cy="${by - 1.1}" r=".35" fill="#fff" opacity=".8"/>`;
    unter.push({ id: "bernstein", de: "der Bernstein", syl: "BERN-stein", it: "l'ambra", itSyl: "AM-bra", en: "amber", x: bx, y: by + 0.6, kunst: flaeche(-3, -3.4, 6, 4),
      tipp: "Bernstein ist versteinertes Harz, Millionen Jahre alt. Nach Sturm findet man ihn am Ostseestrand." });
  }
  /* Sandförmchen (Seestern) neben dem Graben */
  {
    const fx = x - 12, fy = y + 4.6;
    let g = `<path d="M${fx} ${fy - 3.2}`;
    for (let i = 1; i <= 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? 1.3 : 3.2; g += ` L${r(fx + Math.cos(a) * rr)} ${r(fy + Math.sin(a) * rr * 0.55)}`; }
    g += ` Z" fill="#2bb3a3" stroke="#178072" stroke-width=".3"/>`;
    g += `<path d="M${fx - 3} ${fy} q3 1.4 6 0" stroke="#178072" stroke-width=".6" fill="none"/>`;
    k += g;
    unter.push({ id: "sandfoermchen", de: "das Sandförmchen", syl: "SAND-förm-chen", it: "la formina", itSyl: "for-MI-na", en: "sand mould", x: fx, y: fy + 1.6, kunst: flaeche(-3.6, -4, 7.2, 4.4) });
  }
  k += `<path d="M${x - 12} ${y - 8.6} L${x - 5} ${y - 8.6}" stroke="#f0dcb0" stroke-width=".5" opacity=".7"/>`;
  S.teil({ id: "sandburg", de: "die Sandburg", syl: "SAND-burg", it: "il castello di sabbia", itSyl: "ca-STEL-lo di SAB-bia", en: "sandcastle", x, y, steht: true, kunst: um(x, y, k),
    zoom: { x: x - 27, y: y - 32, w: 54, h: 38 }, unter: unter.map((u) => Object.assign(u, { kunst: u.kunst })) });
}
{
  const x = 270, y = 190;
  let k = schatten(x + 1, y, 6, 1, 0.3);
  k += `<path d="M${x - 5} ${y - 11} L${x + 5} ${y - 11} L${x + 4} ${y} L${x - 4} ${y} Z" fill="${S.lg("eimer", [[0, "#ff6a4a"], [0.5, "#e9402a"], [1, "#a92b1c"]], 0, 0, 1, 0)}"/>`;
  k += `<ellipse cx="${x}" cy="${y - 11}" rx="5" ry="1.4" fill="#8f2416"/><ellipse cx="${x}" cy="${y - 10.8}" rx="4.4" ry="1" fill="#d8bf8c"/>`;
  k += `<path d="M${x - 5} ${y - 10} Q${x} ${y - 19} ${x + 5} ${y - 10}" stroke="#f2c024" stroke-width=".6" fill="none"/>`;
  k += `<rect x="${x - 4.6}" y="${y - 4.4}" width="9.2" height=".8" fill="#ff8b6e" opacity=".7"/><path d="M${x - 3.6} ${y - 10} L${x - 3} ${y - 1}" stroke="#fff" stroke-width=".7" opacity=".4"/>`;
  S.teil({ oben: true, id: "eimer", de: "der Eimer", syl: "EI-mer", it: "il secchiello", itSyl: "sec-CHIEL-lo", en: "bucket", x, y, steht: true, kunst: um(x, y, k) });
}
{
  const x = 256, y = 197;
  let k = schatten(x, y - 0.4, 9, 0.8, 0.25);
  k += `<line x1="${x - 10}" y1="${y - 4.6}" x2="${x + 1}" y2="${y - 1.4}" stroke="#2f6bc1" stroke-width="1.2" stroke-linecap="round"/>`;
  k += `<rect x="${x - 11.6}" y="${y - 6}" width="3" height="1.2" rx=".5" fill="#2f6bc1" transform="rotate(16 ${x - 10} ${y - 5.4})"/>`;
  k += `<path d="M${x + 0.4} ${y - 3.4} L${x + 7.6} ${y - 2} Q${x + 9.4} ${y - 0.6} ${x + 7.6} ${y + 0.6} L${x} ${y + 0.4} Z" fill="${S.lg("schaufel", [[0, "#4f8be0"], [1, "#2556a0"]])}"/>`;
  k += `<path d="M${x + 1} ${y - 2.8} L${x + 7} ${y - 1.6}" stroke="#fff" stroke-width=".4" opacity=".5"/>`;
  S.teil({ oben: true, id: "schaufel", de: "die Schaufel", syl: "SCHAU-fel", it: "la paletta", itSyl: "pa-LET-ta", en: "spade", x, y, steht: true, kunst: um(x, y, k) });
}

/* Licht über allem: leichter Dunst über dem Meer */
S.davor(`<rect x="0" y="${HY - 6}" width="320" height="10" fill="${S.lg("dunstvorn", [[0, "#ffffff", 0], [0.5, "#ffffff", 0.12], [1, "#ffffff", 0]])}"/>`);

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/strand.js"));
console.log(aus);
