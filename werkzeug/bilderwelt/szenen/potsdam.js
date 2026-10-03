#!/usr/bin/env node
/* =====================================================================
   POTSDAM (FASSUNG 854) — Bilderwelt neu: Städte in Deutschland
   ---------------------------------------------------------------------
   XANDER (03.10.): „die bekannten Sehenswürdigkeiten … mit Recherche zu
   den einzelnen Städten in Deutschland … als Profi-Grafikdesigner auf
   Hollywood-Niveau“ — und (Funk 291) „mit größter Sorgfalt und Präzision“.

   RECHERCHE (SPSG/museum-digital „Weinbergterrassen“, berlin.de „Schloss
   Sanssouci“, voicemap „Große Fontäne“, Uni Potsdam „Spaziergang durch
   den Park Sanssouci“, Wikipedia „Sanssouci“):
   - STANDORT: im Park Sanssouci an der Hauptallee, südlich der GROSSEN
     FONTÄNE, Blick genau nach Norden die Hauptachse hinauf: über das
     Becken der Fontäne und das Parterre auf die sechs WEINBERGTERRASSEN
     und oben auf das SCHLOSS SANSSOUCI (das Postkartenmotiv).
   - WEINBERGTERRASSEN (Diterichs, 1744): der Südhang ist in sechs breite
     Terrassen geteilt; die Stützmauern sind zur Mitte hin leicht nach
     innen geschwungen (so fangen sie mehr Sonne). Auf den Mauern wechseln
     glatte Flächen mit Spalieren für Wein und Obst und insgesamt 168
     VERGLASTE NISCHEN (darin Feigen und fremde Rebsorten). In der Mitte
     die FREITREPPE: früher 120, heute 132 Stufen, sechsmal geteilt wie
     die Terrassen; an den Enden je eine Rampe (hier von Bäumen verdeckt).
   - SCHLOSS SANSSOUCI (Knobelsdorff/Friedrich II., 1745–47): ein
     eingeschossiges Sommerschloss, 91,6 m lang, gelb verputzt. In der
     Mitte springt der ovale Marmorsaal vor, darüber die grüne Kupfer-
     KUPPEL mit Ochsenaugen-Fenstern und Laterne; am Fries die goldene
     INSCHRIFT „SANS, SOUCI.“ (mit Komma und Punkt — ein Rätsel bis heute).
     36 HERMEN aus Sandstein (Bacchanten und Bacchantinnen, die Begleiter
     des Weingottes, von Glume) tragen paarweise das Gebälk zwischen den
     hohen Fenstertüren; an beiden Enden runde Pavillons; oben eine
     Balustrade mit Vasen.
   - GROSSE FONTÄNE: rundes Becken (Persius 1840/41), der Strahl steigt
     bis 18 m (hier etwa 9 m, wie an einem normalen Tag). Ringsum ZWÖLF
     MARMORFIGUREN: acht römische Götter (Venus, Merkur, Apollo, Diana,
     Juno, Jupiter, Mars, Minerva) und die vier Elemente; Venus und Merkur
     schenkte Ludwig XV. dem König. Seit 2002 stehen dort Kopien.
   - KÜBELPFLANZEN: Von Mai bis Oktober stehen Orangenbäume in grünen
     Holzkübeln im Park, im Winter in der Orangerie.
   - KARTOFFELN: Friedrich II. machte die Kartoffel in Preußen bekannt.
     Besucher legen bis heute Kartoffeln auf sein schlichtes Grab. Das
     Grab liegt OBEN auf der Schlossterrasse am Ostende — von hier unten
     ist es NICHT zu sehen; darum trägt ein Kind seine Kartoffel hinauf.
   - NICHT SICHTBAR von diesem Standort (darum nicht gezeichnet): Neues
     Palais (1,7 km westlich, am Ende der Hauptallee), Orangerieschloss
     (nordwestlich hinter Bäumen), Historische Mühle (westlich hinter dem
     Schloss, außerhalb dieses Blickwinkels), Ruinenberg (liegt tiefer als
     das Dach des Schlosses und wird verdeckt), Holländisches Viertel und
     Brandenburger Tor (in der Stadt) — sie stehen auf dem WEGWEISER.
     Das Potsdamer Brandenburger Tor (1770) ist älter als das Berliner (1791).
   - LICHT: Nachmittag Anfang Oktober, die Sonne steht im Südwesten (hinter
     uns, links): die Südfassaden sind hell, Schatten fallen kurz nach
     rechts hinten. Laub der Parkbäume beginnt sich zu färben, an den
     Spalieren reifen blaue Trauben.
   Maßstab: Zentralperspektive, Auge 1,7 m über dem Kies, Horizont y = 182,
   Brennweite F = 640 (ein Meter in D Metern Entfernung = 640/D Einheiten).
   Fontänenmitte 80 m vor uns, unterste Terrassenmauer 150 m, oberste
   215 m, Schlossfassade 230 m (19,2 m über dem Parterre).
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "potsdam", titel: "Potsdam", emoji: "🏛️", thema: "Deutschland", kuerzel: "pdm", fassung: 854, breite: 400, hoehe: 260 });
const rnd = zufall(1745);
const r = B.r;
const HOR = 182, F = 640, EYE = 1.7, CX = 200;
const sk = (D) => F / D;
const yG = (D, h = 0) => HOR + (EYE - h) * F / D;
const xG = (D, X) => CX + X * F / D;
const schattenListe = [];
/* Sonne im Südwesten, etwa 28° hoch: Schatten 1,9 × so lang wie das Ding hoch ist, nach Nordosten (rechts hinten) */
const bodenSchatten = (D, X, w, h, a = 0.3) => {
  const L = 1.9 * h, dx = 0.6 * L, dz = 0.8 * L;
  const p = [[X - w / 2, D], [X + w / 2, D], [X + dx + w * 0.3, D + dz], [X + dx - w * 0.3, D + dz]];
  schattenListe.push(`<path d="M${p.map(([x2, d2]) => `${r(Math.min(400, Math.max(0, xG(d2, x2))))} ${r(yG(d2))}`).join(" L")} Z" fill="#3b3020" opacity="${a}"/>`);
};
/* Figuren klein halten: Koordinaten ganzzahlig (1 cm) — bei dieser Größe unsichtbar */
/* feine Nähte und Falten (dünne Linien ohne Füllung) sieht man in dieser Größe nicht — weg damit */
const schlank = (svg, min = 0.35) => svg.replace(/<path [^>]*fill="none"[^>]*\/>/g, (p) => { const m = p.match(/stroke-width="([\d.]+)"/); return m && +m[1] < min ? "" : p; });
const kompakt = (svg, Q = 1) => {
  svg = schlank(svg);
  const rund = (n) => { const v = Math.round(+n / Q) * Q; return String(v === 0 ? 0 : v); };
  return svg.replace(/ d="([^"]+)"/g, (a, p) => ` d="${p.replace(/-?\d*\.?\d+/g, rund)}"`)
    .replace(/ (x|y|x1|y1|x2|y2|cx|cy|fx|fy)="(-?\d*\.?\d+)"/g, (a, k, n) => ` ${k}="${rund(n)}"`);
};

S.def(`<filter color-interpolation-filters="sRGB" id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter color-interpolation-filters="sRGB" id="${S.id("wolke")}" x="-20%" y="-30%" width="140%" height="160%"><feGaussianBlur stdDeviation=".6"/></filter>`);
S.def(`<filter color-interpolation-filters="sRGB" id="${S.id("dunst")}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation=".35"/></filter>`);
S.def(`<filter color-interpolation-filters="sRGB" id="${S.id("gischt")}" x="-60%" y="-10%" width="220%" height="120%"><feGaussianBlur stdDeviation=".7 .3"/></filter>`);
S.def(`<filter color-interpolation-filters="sRGB" id="${S.id("schw")}" x="-30%" y="-80%" width="160%" height="260%"><feGaussianBlur stdDeviation=".6"/></filter>`);

/* Stoffe */
const GELB = S.lg("gelb", [[0, "#f6d77c"], [0.5, "#efc761"], [1, "#d9a944"]], 0, 0, 1, 0);
const GELB_P = S.lg("gelbp", [[0, "#e9bc55"], [1, "#b98a35"]], 0, 0, 1, 0);   /* runder Pavillon, dreht weg */
const SAND = S.lg("sand", [[0, "#f3ead6"], [0.5, "#e2d5b9"], [1, "#c4b393"]], 0, 0, 1, 0);
const KUPFER = S.lg("kupfer", [[0, "#7fb9a0"], [0.35, "#a8d6c0"], [0.7, "#6fa58d"], [1, "#4b7f6a"]], 0, 0, 1, 0);
const GOLD = S.lg("gold", [[0, "#fff3b0"], [0.45, "#f0c64a"], [1, "#a8760f"]], 0, 0, 1, 1);
const GLAS = S.lg("glas", [[0, "#9db4c6"], [0.45, "#58697a"], [1, "#2f3c48"]]);
const MAUER = S.lg("mauer", [[0, "#efe5cf"], [1, "#d6c8aa"]]);
const MARMOR = S.lg("marmor", [[0, "#ffffff"], [0.45, "#f1efe9"], [1, "#c9c5bd"]], 0, 0, 1, 0);
const KIES = S.lg("kies", [[0, "#d8ccb4"], [1, "#c2b293"]]);

/* =====================================================================
   KULISSE — Oktoberhimmel, ferne Baumkronen hinter dem Schloss
   ===================================================================== */
S.hinten(`<rect width="400" height="${HOR + 12}" fill="${S.lg("himmel", [[0, "#5d93cf"], [0.55, "#9cc0e2"], [1, "#e6ecef"]])}"/>`);
S.hinten(`<rect width="400" height="${HOR + 12}" fill="${S.rg("sonne", [[0, "#fff4d8", 0.55], [1, "#fff4d8", 0]], 0, 0.9, 0.7)}"/>`);
{
  /* Schönwetter-Cumuli (Oktobernachmittag): unregelmäßige Türme, flache,
     kühlere Unterseite, Licht von links unten (Sonne im Südwesten, tief) */
  const WF = ["#c3cfdc", "#e9eef4", "#ffffff"];
  const wolke = (x, y, w, h, seed) => {
    const z = zufall(seed), c = [];
    const tuerme = Array.from({ length: 2 + Math.floor(z() * 2) }, () => [z() * 0.8 + 0.1, 0.55 + z() * 0.45, 0.12 + z() * 0.12]);
    const hoehe = (t) => Math.max(0.3, ...tuerme.map(([m, a, s2]) => a * Math.exp(-((t - m) ** 2) / (2 * s2 * s2)))) * Math.pow(Math.sin(Math.PI * Math.min(1, Math.max(0, t))), 0.35);
    const n = Math.max(3, Math.round(w / 2.6));
    for (let i = 0; i < n; i++) { const t = (i + 0.5) / n, hh = hoehe(t) * h, rr = Math.max(1.1, hh * (0.24 + z() * 0.1)); c.push([x - w / 2 + t * w + (z() - 0.5) * 1.2, y - hh + rr, rr]); }
    for (let i = 0; i < n; i += 2) { const t = (i + 0.5) / n, hh = hoehe(t) * h; c.push([x - w / 2 + t * w, y - hh * 0.45, hh * 0.45]); }
    const mm = Math.max(3, Math.round(w / (h * 0.32))); for (let i = 0; i < mm; i++) { const t = (i + 0.5) / mm, rr = h * (0.2 + 0.12 * Math.sin(Math.PI * t)); c.push([x - w / 2 + t * w, y - rr * 0.55, rr]); }
    const id = S.id("wk" + seed), cy0 = y - h * 0.5;
    S.def(`<clipPath id="${id}c"><rect x="${r(x - w)}" y="${r(y - h * 3)}" width="${r(w * 2)}" height="${r(h * 3)}"/></clipPath><g id="${id}">${c.map(([a, b, rr]) => `<circle cx="${r(a)}" cy="${r(b)}" r="${r(rr)}"/>`).join("")}</g>`);
    const lage = (dx, dy, f, fill, extra = "") => `<use href="#${id}" fill="${fill}" transform="translate(${r(x + dx)} ${r(cy0 + dy)}) scale(${f}) translate(${r(-x)} ${r(-cy0)})"${extra}/>`;
    return `<g clip-path="url(#${id}c)">${lage(0, 0, 1, WF[0], ` filter="url(#${S.id("wolke")})"`)}${lage(-0.4, -1.6, 0.93, WF[1])}${lage(-1.1, -3.2, 0.8, WF[2])}</g>`;
  };
  S.hinten(wolke(70, 44, 62, 22, 3) + wolke(322, 34, 54, 18, 7) + wolke(196, 26, 30, 8, 11) + wolke(262, 62, 22, 6, 13) + wolke(122, 70, 18, 4.5, 17));
}
/* Boden des Parterres (unter allem) */
S.hinten(`<rect x="0" y="${HOR - 2}" width="400" height="${260 - HOR + 2}" fill="#6f8f45"/>`);
/* ferne Bäume hinter dem Schloss (Ehrenhof, Maulbeerallee), im Dunst */
{
  let k = "";
  for (let i = 0; i < 26; i++) {
    const x = 40 + i * 13 + rnd() * 6, y = 118 + rnd() * 4, rr = 6 + rnd() * 5;
    k += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(rr)}" fill="${rnd() < 0.5 ? "#7f9a74" : "#8ea67f"}"/>`;
  }
  S.hinten(`<g opacity=".75" filter="url(#${S.id("dunst")})">${k}</g>`);
}

/* =====================================================================
   1 — DIE BÄUME links und rechts (Parkbäume, erstes Herbstlaub)
   ===================================================================== */
{
  /* Kronen aus Laubbüscheln: jeder Büschel dreimal gezeichnet — Schatten
     unten rechts, Mittelton, Licht oben links (Sonne im Südwesten) */
  let bz = 0;
  const krone = (cx, cy, w, h, seed, herbst) => {
    const z = zufall(seed);
    let g = "";
    const N = Math.round(w * h / 110);
    const bueschel = [];
    for (let i = 0; i < N; i++) { const a = z() * Math.PI * 2, d = Math.sqrt(z()) * 0.92; bueschel.push([cx + Math.cos(a) * d * w / 2, cy + Math.sin(a) * d * h / 2, 5 + z() * 4, z() < herbst]); }
    bueschel.sort((p, q) => p[1] - q[1]);
    /* geschlossene Grundmasse der Krone (dunkel), damit keine Löcher bleiben */
    let basis = "";
    for (const [x, y, rr] of bueschel) basis += `<circle cx="${r(x + 0.6)}" cy="${r(y + 0.8)}" r="${r(rr * 0.95)}"/>`;
    g += `<g fill="#36562b">${basis}</g>`;
    for (const [x, y, rr, gelb] of bueschel) {
      const id = S.id("bl" + bz++);
      let c = "";
      for (let j = 0; j < 7; j++) { const a = z() * 6.28, d = z() * rr * 0.7; c += `<circle cx="${r(x + Math.cos(a) * d)}" cy="${r(y + Math.sin(a) * d * 0.8)}" r="${r(rr * (0.32 + z() * 0.22))}"/>`; }
      S.def(`<g id="${id}">${c}</g>`);
      const T = gelb ? ["#6e5a22", "#a8892f", "#d9bd5a"] : ["#2f4f27", "#557c3a", "#93b562"];
      g += `<use href="#${id}" fill="${T[0]}" transform="translate(.9 1.1)"/><use href="#${id}" fill="${T[1]}"/><use href="#${id}" fill="${T[2]}" transform="translate(${r(x - 0.8)} ${r(y - 1)}) scale(.62) translate(${r(-x)} ${r(-y)})"/>`;
    }
    return g;
  };
  let k = "";
  /* Stämme und Äste */
  const STAMM = S.lg("stamm", [[0, "#7a6550"], [1, "#3c3024"]], 0, 0, 1, 0);
  for (const [x, y0, y1, w] of [[18, 191, 140, 3.4], [46, 190, 150, 2.4], [374, 191, 140, 3.4], [352, 190, 152, 2.2]]) {
    k += `<path d="M${x - w} ${y0} L${r(x - w * 0.5)} ${y1} L${r(x + w * 0.5)} ${y1} L${x + w} ${y0} Z" fill="${STAMM}"/>`;
    k += `<path d="M${x} ${y1 + 12} q${w * 2} -6 ${w * 3} -14 M${x} ${y1 + 8} q${-w * 2} -5 ${-w * 3} -12" stroke="#4a3b2c" stroke-width="${r(w * 0.4)}" fill="none"/>`;
  }
  k += krone(30, 124, 50, 96, 21, 0.28) + krone(54, 156, 36, 46, 22, 0.35);
  k += krone(370, 122, 50, 98, 23, 0.32) + krone(346, 156, 36, 44, 24, 0.2);
  S.teil({ id: "baum", de: "der Baum", syl: "BAUM", it: "l'albero", itSyl: "AL-be-ro", en: "tree", x: 0, y: 0, kunst: k,
    tipp: "Im Park Sanssouci stehen viele alte Bäume. Im Oktober färbt sich das Laub." });
}

/* =====================================================================
   2 — DAS SCHLOSS SANSSOUCI — gezeichnet in Metern (u Einheiten je Meter)
   ===================================================================== */
const PD = 230, PH = 19.2, PU = sk(PD), PY = yG(PD, PH);
/* Herme (Bacchant/Bacchantin), 0,9 m breit, Fuß bei y = -0.5, Kopf trägt das Gebälk bei -8.6 */
S.def(`<g id="${S.id("herme")}">` +
  `<path d="M-.22 -.5 L-.36 -4.4 L.36 -4.4 L.22 -.5 Z" fill="${SAND}"/>` +
  `<path d="M-.3 -4.3 Q-.46 -5.2 -.38 -6.2 Q-.42 -6.9 -.2 -7.2 L.22 -7.2 Q.44 -6.9 .4 -6.2 Q.48 -5.2 .3 -4.3 Z" fill="${SAND}"/>` +
  `<path d="M-.36 -6.9 Q-.62 -7.6 -.44 -8.5 L-.28 -8.5 Q-.36 -7.7 -.18 -7.1 Z" fill="#e6dac0"/>` +
  `<circle cx=".02" cy="-7.62" r=".3" fill="#efe5cf"/>` +
  `<path d="M-.36 -8.0 Q0 -8.5 .4 -8.0 L.44 -8.62 L-.4 -8.62 Z" fill="#d9caa8"/>` +
  `<path d="M.22 -.5 L.36 -4.4 L.4 -6.2 Q.44 -6.9 .22 -7.2" stroke="#9b8a69" stroke-width=".07" fill="none"/>` +
  `<path d="M-.3 -4.35 L.3 -4.35 M-.32 -5.5 Q0 -5.3 .34 -5.5" stroke="#a8977a" stroke-width=".06" fill="none"/>` +
  `</g>`);
/* Fenstertür: rundbogig, 2,3 m breit, bis 6,1 m hoch */
S.def(`<g id="${S.id("fenster")}">` +
  `<path d="M-1.3 0 L-1.3 -5.0 Q-1.3 -6.3 0 -6.3 Q1.3 -6.3 1.3 -5.0 L1.3 0 Z" fill="#f6f0e2"/>` +
  `<path d="M-1.05 0 L-1.05 -5.0 Q-1.05 -6.05 0 -6.05 Q1.05 -6.05 1.05 -5.0 L1.05 0 Z" fill="${GLAS}"/>` +
  `<path d="M0 0 V-6.05 M-1.05 -1.6 H1.05 M-1.05 -3.2 H1.05 M-1.05 -4.8 H1.05" stroke="#f6f0e2" stroke-width=".12"/>` +
  `<path d="M-.9 -5.6 L-.3 -5.9 L-.9 -2.2 Z" fill="#fff" opacity=".28"/>` +
  `<path d="M-.5 -6.35 L.5 -6.35 L.3 -7.0 L-.3 -7.0 Z" fill="#f2e7cf"/>` +
  `</g>`);
const schlossUnter = [];
{
  let k = "";
  const W = 45.8, TOP = -8.6;
  /* weicher Schatten des Gebälks auf der Wand */
  /* Wände: Flügel und Mittelbau, die runden Pavillons an den Enden */
  k += `<rect x="-37.8" y="${TOP}" width="75.6" height="${-TOP + 0.4}" fill="${GELB}"/>`;
  for (const s of [-1, 1]) {
    const x0 = s < 0 ? -W : 37.8;
    k += `<rect x="${x0}" y="${TOP}" width="8" height="${-TOP + 0.4}" fill="${s < 0 ? S.lg("pavl", [[0, "#c9963d"], [0.6, "#efc761"], [1, "#f3d277"]], 0, 0, 1, 0) : GELB_P}"/>`;
  }
  /* Mittelbau (ovaler Marmorsaal) — springt vor, etwas heller */
  k += `<rect x="-8" y="${TOP}" width="16" height="${-TOP + 0.4}" fill="${S.lg("mitte", [[0, "#f9de8a"], [0.5, "#f2cc68"], [1, "#dcae4c"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M7.6 ${TOP} L8.1 ${TOP} L8.1 .4 L7.6 .4 Z" fill="#b9893a" opacity=".6"/>`;
  /* Fenstertüren */
  const fenster = [-5.3, 0, 5.3];
  for (let i = 1; i <= 5; i++) fenster.push(8 + (i - 0.5) * 5.96, -(8 + (i - 0.5) * 5.96));
  fenster.push(39.8, 43.8, -39.8, -43.8);
  for (const x of fenster) k += `<use href="#${S.id("fenster")}" x="${r(x)}" y="0"/>`;
  /* Hermen paarweise an den Pfeilern: 4 + 2·5 + 2·2 Pfeiler = 18 Paare = 36 Figuren */
  const pfeiler = [-8, -2.65, 2.65, 8];
  for (let i = 1; i <= 5; i++) pfeiler.push(8 + i * 5.96, -(8 + i * 5.96));
  pfeiler.push(41.8, 45.5, -41.8, -45.5);
  let schatten = "", hermen = "";
  for (const p of pfeiler) for (const s of [-1, 1]) {
    const x = r(p + s * 0.5);
    schatten += `<path d="M${r(x + 0.2)} -.5 L${r(x + 0.55)} -.5 L${r(x + 0.7)} -7.4 L${r(x + 0.35)} -7.4 Z"/>`;
    hermen += `<use href="#${S.id("herme")}" transform="translate(${x} 0) scale(${s} 1)"/>`;
  }
  k += `<g fill="#8a6524" opacity=".28" filter="url(#${S.id("schw")})">${schatten}</g>` + hermen;
  /* Gebälk mit Fries, Kranzgesims, darüber die Balustrade mit Vasen */
  k += `<rect x="${-W - 0.3}" y="${TOP - 1.1}" width="${2 * W + 0.6}" height="1.1" fill="${S.lg("gebaelk", [[0, "#f7edd5"], [1, "#dccca7"]])}"/>`;
  k += `<rect x="${-W - 0.5}" y="${TOP - 1.5}" width="${2 * W + 1}" height=".45" fill="#fbf4e3"/>`;
  k += `<rect x="${-W - 0.3}" y="${TOP - 0.1}" width="${2 * W + 0.6}" height=".22" fill="#a68a55" opacity=".6"/>`;
  k += `<rect x="${-W}" y="${TOP - 2.6}" width="${2 * W}" height="1.1" fill="${S.lg("brust", [[0, "#f3ead6"], [1, "#d5c6a6"]])}"/>`;
  let bal = "";
  for (let x = -W + 0.4; x < W - 0.2; x += 0.55) if (Math.abs(x) > 7.4) bal += `<rect x="${r(x)}" y="${r(TOP - 2.45)}" width=".26" height=".8" rx=".1"/>`;
  k += `<g fill="#b6a684">${bal}</g>`;
  k += `<rect x="${-W}" y="${TOP - 2.75}" width="${2 * W}" height=".3" fill="#fbf4e3"/>`;
  for (const p of pfeiler) if (Math.abs(p) > 8.5) k += `<path d="M${r(p - 0.35)} ${r(TOP - 2.75)} q-.2 -.5 .1 -.9 q-.25 -.25 0 -.45 h.5 q.25 .2 0 .45 q.3 .4 .1 .9 Z" fill="${SAND}"/>`;
  /* Dachflächen der Flügel (grau, nur oben angeschnitten) und der Pavillons */
  k += `<path d="M${-W + 0.5} ${TOP - 2.75} L-9 ${TOP - 2.75} L-9 ${TOP - 3.6} L${-W + 2} ${TOP - 3.4} Z M${W - 0.5} ${TOP - 2.75} L9 ${TOP - 2.75} L9 ${TOP - 3.6} L${W - 2} ${TOP - 3.4} Z" fill="#7d8790"/>`;
  /* Tambour mit der Inschrift „SANS, SOUCI.“ */
  const TB = TOP - 2.75;
  k += `<rect x="-7.6" y="${r(TB - 2.4)}" width="15.2" height="2.4" fill="${S.lg("tambour", [[0, "#f8da80"], [0.55, "#eec35c"], [1, "#d1a142"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-7.9" y="${r(TB - 2.75)}" width="15.8" height=".4" fill="#fbf4e3"/><rect x="-7.6" y="${r(TB - 0.25)}" width="15.2" height=".25" fill="#c9a454"/>`;
  k += `<text x="0" y="${r(TB - 0.62)}" font-size="1.45" text-anchor="middle" fill="${GOLD}" stroke="#8a5e10" stroke-width=".05" font-family="'Times New Roman',Georgia,serif" font-weight="bold" letter-spacing=".22">SANS, SOUCI.</text>`;
  /* Kuppel: grünes Kupfer, Rippen, drei Ochsenaugen mit Goldrahmen */
  const KB = TB - 2.75;
  k += `<path d="M-7.2 ${r(KB)} C-7.2 ${r(KB - 4.6)} -3.6 ${r(KB - 7.6)} 0 ${r(KB - 7.9)} C3.6 ${r(KB - 7.6)} 7.2 ${r(KB - 4.6)} 7.2 ${r(KB)} Z" fill="${KUPFER}"/>`;
  for (const t of [-0.78, -0.45, -0.15, 0.15, 0.45, 0.78]) k += `<path d="M${r(t * 7.2)} ${r(KB)} Q${r(t * 6.6)} ${r(KB - 5.4)} 0 ${r(KB - 7.9)}" stroke="#3f6b58" stroke-width=".1" fill="none"/>`;
  k += `<path d="M-6.4 ${r(KB - 0.6)} C-6.4 ${r(KB - 4.6)} -3.2 ${r(KB - 7)} -.6 ${r(KB - 7.6)}" stroke="#d6f0e2" stroke-width=".35" fill="none" opacity=".55"/>`;
  for (const [x, w] of [[-3.8, 0.85], [0, 1], [3.8, 0.85]]) {
    k += `<ellipse cx="${x}" cy="${r(KB - 2.1)}" rx="${r(0.78 * w)}" ry=".95" fill="#2c3a42" stroke="${GOLD}" stroke-width=".22"/>`;
    k += `<path d="M${r(x - 0.4 * w)} ${r(KB - 3.15)} q${r(0.4 * w)} -.5 ${r(0.8 * w)} 0" stroke="${GOLD}" stroke-width=".18" fill="none"/>`;
  }
  k += `<path d="M-7.4 ${r(KB + 0.05)} L7.4 ${r(KB + 0.05)}" stroke="${GOLD}" stroke-width=".25"/>`;
  /* Laterne mit goldener Bekrönung */
  const LB = KB - 7.7;
  k += `<rect x="-1" y="${r(LB - 1.5)}" width="2" height="1.5" fill="${KUPFER}"/>`;
  for (const x of [-0.55, 0, 0.55]) k += `<rect x="${x - 0.14}" y="${r(LB - 1.3)}" width=".28" height="1" fill="#2c3a42"/>`;
  k += `<path d="M-1.25 ${r(LB - 1.5)} Q0 ${r(LB - 2.6)} 1.25 ${r(LB - 1.5)} Z" fill="${KUPFER}"/>`;
  k += `<circle cx="0" cy="${r(LB - 2.75)}" r=".32" fill="${GOLD}"/><path d="M0 ${r(LB - 3.05)} L0 ${r(LB - 3.8)} M-.32 ${r(LB - 3.45)} L.32 ${r(LB - 3.45)}" stroke="#e2b43a" stroke-width=".14"/>`;
  /* Vasen und Figurengruppen neben der Kuppel */
  for (const s of [-1, 1]) k += `<path d="M${s * 8.6 - 0.45} ${r(TB)} q-.2 -.6 .1 -1.1 q-.3 -.3 0 -.55 h.7 q.3 .25 0 .55 q.3 .5 .1 1.1 Z" fill="${SAND}"/>`;
  S.teil({ id: "schloss", de: "das Schloss", syl: "SCHLOSS", it: "il castello", itSyl: "ca-STEL-lo", en: "palace",
    x: CX, y: PY, kunst: `<g transform="scale(${PU})">${k}</g>`,
    tipp: "Das Schloss Sanssouci war das Sommerschloss von König Friedrich dem Großen. „Sans souci“ ist Französisch und heißt „ohne Sorge“.",
    zoom: { x: CX - 48, y: PY - 66, w: 96, h: 64 } });
  const M = (x, y) => [r(CX + x * PU), r(PY + y * PU)];
  const [kx, ky] = M(0, KB);
  schlossUnter.push({ id: "kuppel", de: "die Kuppel", syl: "KUP-pel", it: "la cupola", itSyl: "CU-po-la", en: "dome", x: kx, y: ky,
    kunst: flaeche(-7.2 * PU, -9.4 * PU, 14.4 * PU, 9.4 * PU), tipp: "Unter der grünen Kuppel liegt der Marmorsaal. Hier aß der König mit seinen Gästen." });
  const [ix, iy] = M(0, TB);
  schlossUnter.push({ id: "inschrift", de: "die Inschrift", syl: "IN-schrift", it: "l'iscrizione", itSyl: "i-scri-ZIO-ne", en: "inscription", x: ix, y: iy,
    kunst: flaeche(-7.4 * PU, -2.6 * PU, 14.8 * PU, 2.6 * PU, 0.6), tipp: "Die Inschrift heißt „SANS, SOUCI.“ — mit Komma und Punkt. Warum, weiß bis heute niemand genau." });
  const [hx, hy] = M(-13.96 - 0.5, 0);
  schlossUnter.push({ id: "figur", de: "die Figur", syl: "fi-GUR", it: "la statua", itSyl: "STA-tua", en: "figure", x: hx, y: hy,
    kunst: flaeche(-0.55 * PU, -8.7 * PU, 1.6 * PU, 8.5 * PU, 0.5), tipp: "36 Figuren aus Sandstein tragen das Dach. Sie feiern den Wein: Es sind Begleiter des Weingottes Bacchus." });
  const [fx, fy] = M(5.3, 0);
  schlossUnter.push({ id: "fenster", de: "das Fenster", syl: "FENS-ter", it: "la finestra", itSyl: "fi-NE-stra", en: "window", x: fx, y: fy,
    kunst: flaeche(-1.3 * PU, -6.4 * PU, 2.6 * PU, 6.2 * PU, 0.5), tipp: "Die hohen Fenster sind zugleich Türen: Man geht direkt auf die Terrasse." });
}
S.teile[S.teile.length - 1].unter = schlossUnter;

/* =====================================================================
   3 — DIE WEINBERGTERRASSEN: sechs geschwungene Mauern mit Glasnischen
   ===================================================================== */
const TD = (i) => 150 + 13 * i, TH = 3.2, HALB = 42, TREPPE = 3.1;
const wandD = (i, X) => TD(i) + 2.2 * (1 - (X / HALB) ** 2);   /* zur Mitte leicht zurück */
const terrUnter = [];
/* Spalier: Weinlaub (grün, erstes Gelb) mit blauen Trauben — als Muster */
{
  const z = zufall(77);
  let t = "";
  t += `<rect width="4" height="3.4" fill="#6a8f3e" opacity=".55"/>`;
  for (let i = 0; i < 14; i++) t += `<ellipse cx="${r(z() * 4)}" cy="${r(z() * 3.4)}" rx="${r(0.55 + z() * 0.3)}" ry="${r(0.42 + z() * 0.2)}" fill="${["#4f7430", "#6f9440", "#b9a640", "#5f8a3a", "#8cae4e", "#3f6328", "#c9b555"][i % 7]}"/>`;
  t += `<path d="M.4 .2 L3.6 .2 M.4 1.9 L3.6 1.9" stroke="#8a7a5a" stroke-width=".12" opacity=".5"/>`;
  t += `<ellipse cx="2.2" cy="2.6" rx=".32" ry=".5" fill="#4a3566"/><ellipse cx="2.45" cy="2.45" rx=".22" ry=".3" fill="#5d4580"/>`;
  S.def(`<pattern id="${S.id("spalier")}" patternUnits="userSpaceOnUse" width="4" height="3.4">${t}</pattern>`);
  /* Sprossen der verglasten Nischen */
  S.def(`<pattern id="${S.id("sprossen")}" patternUnits="userSpaceOnUse" width="1.5" height="1.6"><path d="M0 0 H1.5 M0 0 V1.6" stroke="#eef0e8" stroke-width=".22"/></pattern>`);
}
const TERRGRAS = S.lg("terrgras", [[0, "#7f9e4c"], [1, "#5d7d38"]]);
const NISCHE = S.lg("nischeglas", [[0, "#b9cfd6"], [0.3, "#5e7c72"], [0.6, "#2f4a37"], [1, "#22362a"]]);
{
  let k = "";
  const P = (i, X, h) => `${r(xG(wandD(i, X), X))} ${r(yG(wandD(i, X), h))}`;
  for (let i = 5; i >= 0; i--) {
    const h0 = TH * i, h1 = TH * (i + 1);
    for (const s of [-1, 1]) {
      const xs = [];
      for (let j = 0; j <= 12; j++) xs.push(s * (TREPPE + 0.4 + (HALB - TREPPE - 0.4) * j / 12));
      /* Bewuchs auf der Terrasse dahinter (Rasenkante) */
      k += `<path d="M${xs.map((X) => P(i, X, h1 + 0.9)).join(" L")} L${xs.slice().reverse().map((X) => P(i, X, h1)).join(" L")} Z" fill="${TERRGRAS}"/>`;
      /* die Mauer, darauf das Spalier */
      const wand = `M${xs.map((X) => P(i, X, h1)).join(" L")} L${xs.slice().reverse().map((X) => P(i, X, h0)).join(" L")} Z`;
      k += `<path d="${wand}" fill="${MAUER}"/><path d="${wand}" fill="url(#${S.id("spalier")})"/>`;
      /* verglaste Nischen: Rundbogen, Sprossen, dahinter Feigen im Dunkeln */
      const n = 14, abst = (HALB - TREPPE - 1) / n;
      let nische = "";
      for (let j = 0; j < n; j++) {
        const Xn = s * (TREPPE + 1.2 + (j + 0.5) * abst);
        const D = wandD(i, Xn), u = sk(D), xn = xG(D, Xn), yb = yG(D, h0 + 0.2), yt = yG(D, h1 - 0.35);
        const nw = 1.3 * u / 2, ar = nw;
        nische += `M${r(xn - nw)} ${r(yb)} L${r(xn - nw)} ${r(yt + ar)} Q${r(xn - nw)} ${r(yt)} ${r(xn)} ${r(yt)} Q${r(xn + nw)} ${r(yt)} ${r(xn + nw)} ${r(yt + ar)} L${r(xn + nw)} ${r(yb)} Z `;
      }
      k += `<path d="${nische}" fill="${NISCHE}" stroke="#f4f0e4" stroke-width="${r(0.14 * sk(TD(i)))}"/><path d="${nische}" fill="url(#${S.id("sprossen")})" opacity=".75"/>`;
      /* Mauerkrone (Sandstein) und Schattenfuge unten */
      k += `<path d="M${xs.map((X) => P(i, X, h1 + 0.25)).join(" L")} L${xs.slice().reverse().map((X) => P(i, X, h1 - 0.1)).join(" L")} Z" fill="#f7f0de"/>`;
      k += `<path d="M${xs.map((X) => P(i, X, h1 - 0.1)).join(" L")}" stroke="#8a7a5a" stroke-width=".3" fill="none" opacity=".5"/>`;
    }
  }
  /* Spiegelung des Himmels in den Nischen (oben links hell) */
  S.teil({ id: "terrasse", de: "die Terrasse", syl: "ter-RAS-se", it: "la terrazza", itSyl: "ter-RAZ-za", en: "terrace", x: 0, y: 0, kunst: k,
    tipp: "Der Hang hat sechs Terrassen. Früher wuchs hier Wein für den König — daher der Name „Weinberg“.",
    zoom: { x: 236, y: 138, w: 84, h: 56 } });
  /* Lupe: eine Glasnische und eine Weintraube auf der zweiten Terrasse rechts */
  const i = 1, s = 1, n = 14, abst = (HALB - TREPPE - 1) / n;
  const Xn = s * (TREPPE + 1.2 + (6 + 0.5) * abst), D = wandD(i, Xn), u = sk(D);
  terrUnter.push({ id: "nische", de: "die Nische", syl: "NI-sche", it: "la nicchia", itSyl: "NIC-chia", en: "niche", x: r(xG(D, Xn)), y: r(yG(D, TH * i + 0.25)),
    kunst: flaeche(-0.95 * u, -(TH - 0.6) * u, 1.9 * u, (TH - 0.6) * u, 0.5), tipp: "168 Nischen sind verglast. Dahinter ist es warm: Dort wachsen Feigen." });
  const Xa = s * (TREPPE + 1.2 + 4 * abst), Da = wandD(0, Xa), ua = sk(Da);
  terrUnter.push({ id: "weintraube", de: "die Weintraube", syl: "WEIN-trau-be", it: "il grappolo d'uva", itSyl: "GRAP-po-lo DU-va", en: "bunch of grapes", x: r(xG(Da, Xa) + 0.6 * ua), y: r(yG(Da, 1.4)),
    kunst: flaeche(-0.6 * ua, -0.9 * ua, 1.4 * ua, 1.8 * ua, 0.5), tipp: "An den Mauern wächst Wein am Spalier. Im Herbst sind die Trauben reif." });
}
S.teile[S.teile.length - 1].unter = terrUnter;

/* =====================================================================
   10 — MENSCHEN: Gärtner, Touristin, Tourist, Kind
   ===================================================================== */
/* Jede Figur wird einmal in <defs> gelegt (100 Einheiten hoch) und mit <use> gezeichnet:
   vorn groß, auf der Treppe noch einmal ganz klein. */
const FIG = {};
const mensch = (name, spec, groesse, D, X, Q = 2) => {
  const m = B.mensch(spec, 100);
  S.def(`<g id="${S.id("fig" + name)}">${kompakt(m.svg, Q)}</g>`);
  const f = { m, x: r(xG(D, X)), y: r(yG(D)), u: sk(D), hoehe: 100 / groesse, s: groesse * sk(D) / 100 };
  /* Hände und Kopf in Bildkoordinaten */
  f.p = (q) => ({ x: f.x + q.x * m.k * f.s, y: f.y + q.y * m.k * f.s });
  f.svg = `<use href="#${S.id("fig" + name)}" transform="scale(${f.s.toFixed(5)})"/>`;
  FIG[name] = f;
  return f;
};
/* DER GÄRTNER mit Rechen, neben der Schubkarre (rechts) */
const G = mensch("G", { id: "pdm_gaert", geschlecht: "m", blick: -60, frisur: "kurz", haarfarbe: "grau", haut: "hell", pose: "halten",
  kleidung: { oberteil: { stueck: "pullover", farbe: "gruen_d" }, unterteil: { stueck: "arbeitshose" }, schuhe: { stueck: "stiefel" }, kopf: { stueck: "kappe", farbe: "gruen_d" } } }, 1.78, 33, 6.6);
const GH = [G.m.z.handL, G.m.z.handR].map((h) => G.p(h)).sort((a, b) => a.x - b.x);
bodenSchatten(33, 6.6, 0.5, 1.78, 0.26);
/* DIE TOURISTIN fotografiert mit dem Handy (von hinten, etwas schräg) */
const T = mensch("T", { id: "pdm_tour", geschlecht: "w", blick: 160, frisur: "zopf", haarfarbe: "blond", haut: "hell",
  pose: { lende: 1, brust: -2, nacken: 2, kopf: -6, schulterL: { vor: 62, seit: 12, dreh: 10 }, ellbogenL: 96, unterarmL: 30, handL: 4, fingerL: 0.5,
    schulterR: { vor: 64, seit: 14, dreh: 10 }, ellbogenR: 92, unterarmR: 30, handR: 4, fingerR: 0.5,
    huefteL: { vor: 4, seit: 3, dreh: -6 }, knieL: 4, fussL: 0, huefteR: { vor: -6, seit: 4, dreh: -8 }, knieR: 10, fussR: 6 },
  kleidung: { oberteil: { stueck: "pullover", farbe: "creme" }, jacke: { stueck: "jacke", farbe: "rot" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" }, zubehoer: { stueck: "tasche", farbe: "braun" } } }, 1.68, 22, -3.6);
bodenSchatten(22, -3.6, 0.45, 1.68, 0.26);
/* DER TOURIST zeigt zum Schloss hinauf, mit Rucksack */
const M2 = mensch("M2", { id: "pdm_tourist", geschlecht: "m", blick: 196, frisur: "kurz", haarfarbe: "dunkelbraun", haut: "mittel",
  pose: { lende: 1, brust: -4, nacken: -8, kopf: -14, schulterL: { vor: 3, seit: 7 }, ellbogenL: 12, unterarmL: 10, handL: 6, fingerL: 0.38,
    schulterR: { vor: 128, seit: 10, dreh: 0 }, ellbogenR: 6, unterarmR: 0, handR: 6, fingerR: "zeigen",
    huefteL: { vor: 5, seit: 3, dreh: -6 }, knieL: 5, fussL: 0, huefteR: { vor: -3, seit: 2.5, dreh: -6 }, knieR: 2, fussR: 0 },
  kleidung: { oberteil: { stueck: "tshirt", farbe: "hellblau" }, jacke: { stueck: "jacke", farbe: "gruen_d" }, unterteil: { stueck: "hose", farbe: "beige" }, schuhe: { stueck: "halbschuh" }, zubehoer: { stueck: "rucksack", farbe: "orange" } } }, 1.82, 25, -1.0);
bodenSchatten(25, -1.0, 0.5, 1.82, 0.26);
/* DAS KIND mit der Kartoffel (für das Grab des Königs) */
const K = mensch("K", { id: "pdm_kind", alter: "kind", geschlecht: "m", blick: 24, frisur: "kurz", haarfarbe: "hellblond", haut: "hell", laecheln: true,
  pose: { lende: 1, brust: -2, nacken: 8, kopf: 8, schulterL: { vor: 3, seit: 8 }, ellbogenL: 14, unterarmL: 10, handL: 6, fingerL: 0.38,
    schulterR: { vor: 58, seit: 26, dreh: 10 }, ellbogenR: 48, unterarmR: 60, handR: 10, fingerR: 0.6,
    huefteL: { vor: 6, seit: 3, dreh: -6 }, knieL: 4, fussL: 0, huefteR: { vor: -3, seit: 2.5, dreh: -6 }, knieR: 2, fussR: 0 },
  kleidung: { oberteil: { stueck: "pullover", farbe: "gelb" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" }, kopf: { stueck: "muetze", farbe: "blau" } } }, 1.22, 17.5, 1.5);
bodenSchatten(17.5, 1.5, 0.4, 1.22, 0.26);
/* =====================================================================
   4 — DIE TREPPE (Freitreppe, 132 Stufen in sechs Läufen)
   ===================================================================== */
{
  let k = "";
  const Q = (D, X, h) => `${r(xG(D, X))} ${r(yG(D, h))}`;
  for (let i = 5; i >= 0; i--) {
    const D0 = TD(i) - 4, h0 = TH * i, N = 22, st = TH / N, run = 8 / N;
    /* Wangen (seitliche Mauern) */
    for (const s of [-1, 1]) k += `<path d="M${Q(D0, s * (TREPPE + 0.4), h0)} L${Q(D0 + 8, s * (TREPPE + 0.4), h0 + TH + 0.3)} L${Q(D0 + 8, s * TREPPE, h0 + TH + 0.3)} L${Q(D0, s * TREPPE, h0)} Z" fill="#e9dfc6"/>`;
    for (let j = 0; j < N; j++) {
      const D = D0 + j * run, ha = h0 + j * st, hb = ha + st;
      /* Setzstufe (hell, Südlicht) */
      k += `<path d="M${Q(D, -TREPPE, ha)} L${Q(D, TREPPE, ha)} L${Q(D, TREPPE, hb)} L${Q(D, -TREPPE, hb)} Z" fill="${j % 2 ? "#efe6d1" : "#e8dec6"}"/>`;
      /* Trittfläche sieht man nur unterhalb der Augenhöhe */
      if (hb < EYE) k += `<path d="M${Q(D, -TREPPE, hb)} L${Q(D, TREPPE, hb)} L${Q(D + run, TREPPE, hb)} L${Q(D + run, -TREPPE, hb)} Z" fill="#cbbd9e"/>`;
      else k += `<path d="M${Q(D, -TREPPE, hb)} L${Q(D, TREPPE, hb)}" stroke="#a89878" stroke-width=".22"/>`;
    }
  }
  /* kleine Besucher auf der Treppe: dieselben Figuren wie vorn (über <use>), sehr fern */
  for (const [f, i, j, X, gr] of [["T", 1, 12, -1.6, 1.68], ["M2", 1, 12, -0.9, 1.82], ["K", 1, 11, -0.4, 1.22], ["T", 3, 6, 1.9, 1.68], ["M2", 4, 16, -1.2, 1.82]]) {
    const D = TD(i) - 4 + j * 8 / 22, h = TH * i + (j + 1) * TH / 22, ref = FIG[f];
    k += `<use href="#${S.id("fig" + f)}" transform="translate(${r(xG(D, X))} ${r(yG(D, h))}) scale(${(gr * sk(D) / 100).toFixed(5)})"/>`;
  }
  S.teil({ id: "treppe", de: "die Treppe", syl: "TREP-pe", it: "la scalinata", itSyl: "sca-li-NA-ta", en: "staircase", x: 0, y: 0, kunst: k,
    tipp: "132 Stufen führen vom Garten hinauf zum Schloss." });
}

/* =====================================================================
   5 — DER RASEN (Parterre beiderseits der Fontäne)
   ===================================================================== */
{
  let k = "";
  const RASEN = S.lg("rasen", [[0, "#86a856"], [1, "#5f8a3a"]]);
  for (const s of [-1, 1]) {
    const pts = [[s * 27, 60], [s * 70, 60], [s * 70, 148], [s * 9, 148], [s * 9, 112], [s * 27, 100]];
    k += `<path d="M${pts.map(([X, D]) => `${r(Math.min(400, Math.max(0, xG(D, X))))} ${r(yG(D))}`).join(" L")} Z" fill="${RASEN}"/>`;
    /* Buchsbaumkante zum Kies */
    k += `<path d="M${r(xG(66, s * 27))} ${r(yG(66))} L${r(xG(100, s * 27))} ${r(yG(100))}" stroke="#3f6b2e" stroke-width="1.1"/>`;
  }
  S.teil({ id: "rasen", de: "der Rasen", syl: "RA-sen", it: "il prato", itSyl: "PRA-to", en: "lawn", x: 0, y: 0, kunst: k });
}

/* =====================================================================
   6 — DIE STATUEN (zwölf Marmorfiguren um die Fontäne; zehn sind zu sehen)
   ===================================================================== */
const FD = 80, RB = 20, RS = 23.5;      /* Mitte der Fontäne, Beckenradius, Figurenkreis */
const statuen = [];
for (let a = 15; a < 360; a += 30) {
  const w = a * Math.PI / 180, X = RS * Math.sin(w), D = FD - RS * Math.cos(w), x = xG(D, X);
  if (x > 6 && x < 394) statuen.push({ a, X, D, x, y: yG(D), u: sk(D) });
}
statuen.sort((p, q) => q.D - p.D);
const SOCKEL = S.lg("sockel", [[0, "#f4f1ea"], [0.5, "#dcd7cc"], [1, "#a9a39a"]], 0, 0, 1, 0);
const figur = (u, art) => {
  /* Sockel 1,6 m, Figur 2,3 m, gezeichnet in Metern */
  let g = `<path d="M-.75 0 L-.75 -.25 L-.6 -.3 L-.6 -1.35 L-.72 -1.42 L-.72 -1.6 L.72 -1.6 L.72 -1.42 L.6 -1.35 L.6 -.3 L.75 -.25 L.75 0 Z" fill="${SOCKEL}"/>`;
  g += `<rect x="-.45" y="-1.2" width=".9" height=".55" fill="#cfc9be" opacity=".7"/>`;
  if (art % 2) {
    /* Göttin: Gewand bis zum Boden, ein Arm angewinkelt */
    g += `<path d="M-.42 -1.62 Q-.5 -2.6 -.32 -3.1 Q-.38 -3.5 -.2 -3.7 L.22 -3.7 Q.4 -3.4 .34 -3.0 Q.52 -2.5 .44 -1.62 Z" fill="${MARMOR}"/>`;
    g += `<path d="M.3 -3.4 Q.62 -3.1 .48 -2.7" stroke="#ece9e2" stroke-width=".12" fill="none"/><path d="M-.3 -3.45 Q-.66 -3.0 -.5 -2.55" stroke="#dcd8cf" stroke-width=".12" fill="none"/>`;
    g += `<path d="M-.2 -1.7 Q-.1 -2.6 -.05 -3.2 M.15 -1.7 Q.2 -2.4 .1 -3.1" stroke="#b9b4aa" stroke-width=".05" fill="none"/>`;
  } else {
    /* Gott: Standbein, Mantel über der Schulter, Arm erhoben */
    g += `<path d="M-.3 -1.62 L-.22 -2.55 L-.3 -3.05 Q-.36 -3.5 -.18 -3.7 L.2 -3.7 Q.36 -3.5 .3 -3.05 L.22 -2.55 L.3 -1.62 L.1 -1.62 L.02 -2.45 L-.08 -1.62 Z" fill="${MARMOR}"/>`;
    g += `<path d="M.22 -3.55 Q.6 -3.9 .62 -4.25" stroke="#efece5" stroke-width=".13" fill="none" stroke-linecap="round"/>`;
    g += `<path d="M-.32 -3.5 Q-.55 -2.9 -.42 -2.2 L-.28 -2.3 Q-.34 -2.9 -.18 -3.3 Z" fill="#dcd8cf"/>`;
  }
  g += `<circle cx="0" cy="-3.88" r=".2" fill="#f5f3ee"/><path d="M-.18 -3.95 Q0 -4.12 .18 -3.95" stroke="#cfcac0" stroke-width=".06" fill="none"/>`;
  return `<g transform="scale(${u})">${g}</g>`;
};
{
  let k = "";
  statuen.forEach((p, n) => {
    k += `<g transform="translate(${r(p.x)} ${r(p.y)})">${figur(p.u, Math.round(p.a / 30))}</g>`;
  });
  const vorne = statuen.filter((p) => p.a === 345)[0];
  S.teil({ id: "statue", de: "die Statue", syl: "STA-tu-e", it: "la statua", itSyl: "STA-tua", en: "statue", x: 0, y: 0, kunst: k,
    tipp: "Zwölf Statuen aus Marmor stehen um die Fontäne: acht römische Götter und die vier Elemente.",
    zoom: { x: r(vorne.x - 40), y: r(vorne.y - 50), w: 80, h: 54 },
    unter: [
      { id: "goettin", de: "die Göttin", syl: "GÖT-tin", it: "la dea", itSyl: "DE-a", en: "goddess", x: r(vorne.x), y: r(vorne.y - 1.6 * vorne.u),
        kunst: flaeche(-0.55 * vorne.u, -2.4 * vorne.u, 1.1 * vorne.u, 2.4 * vorne.u, 0.6), tipp: "Venus ist die Göttin der Liebe. Ihre Figur schenkte der König von Frankreich." },
      { id: "sockel", de: "der Sockel", syl: "SO-ckel", it: "il piedistallo", itSyl: "pie-di-STAL-lo", en: "pedestal", x: r(vorne.x), y: r(vorne.y),
        kunst: flaeche(-0.8 * vorne.u, -1.6 * vorne.u, 1.6 * vorne.u, 1.6 * vorne.u, 0.6) },
    ] });
}

/* =====================================================================
   7 — DIE FONTÄNE (rundes Becken, Strahl etwa 9 m)
   ===================================================================== */
{
  let k = "";
  /* das Becken als Ellipse in der Ebene: Rand 0,5 m hoch */
  const ring = (rad, h, n = 64) => { const p = []; for (let i = 0; i <= n; i++) { const w = i / n * Math.PI * 2, X = rad * Math.sin(w), D = FD - rad * Math.cos(w); p.push(`${r(xG(D, X))} ${r(yG(D, h))}`); } return "M" + p.join(" L") + " Z"; };
  /* Wasserfläche */
  k += `<path d="${ring(RB, 0.3)}" fill="${S.lg("wasser", [[0, "#9fb6c4"], [0.5, "#6f8fa3"], [1, "#4d6e82"]])}"/>`;
  /* Spiegelung der Terrassen und des Himmels, Wellenringe */
  for (let i = 0; i < 40; i++) { const X = (rnd() - 0.5) * 34, D = FD - 16 + rnd() * 30, x = xG(D, X), y = yG(D, 0.3); k += `<path d="M${r(x - 1.5)} ${r(y)} q1.5 -.3 3 0" stroke="${rnd() < 0.5 ? "#dfeaf0" : "#3e5e70"}" stroke-width=".3" fill="none" opacity=".7"/>`; }
  k += `<path d="${ring(3.6, 0.3, 32)}" fill="#e9f2f6" opacity=".55"/>`;
  /* Beckenrand aus hellem Stein: die vordere Hälfte zeigt die Außenseite */
  const vorn = [], vorn2 = [];
  for (let i = 0; i <= 32; i++) { const w = Math.PI / 2 + i / 32 * Math.PI, X = RB * Math.sin(w), D = FD - RB * Math.cos(w); vorn.push(`${r(xG(D, X))} ${r(yG(D, 0.55))}`); vorn2.push(`${r(xG(D, X))} ${r(yG(D, 0))}`); }
  k += `<path d="${ring(RB, 0.55)}" fill="none" stroke="#efe8d8" stroke-width=".9"/>`;
  k += `<path d="M${vorn.join(" L")} L${vorn2.reverse().join(" L")} Z" fill="${S.lg("rand", [[0, "#efe8d8"], [1, "#b9ae98"]])}"/>`;
  /* der Strahl: dicke Wassersäule, oben ein Schirm, der als Vorhang zurückfällt; Gischt am Fuß */
  const yb = yG(FD, 0.3), u = sk(FD), H = 9 * u;
  const STRAHL = S.lg("strahl", [[0, "#dfe9ef", 0.9], [0.35, "#ffffff", 1], [0.7, "#f4f8fa", 0.95], [1, "#cdd9e0", 0.85]], 0, 0, 1, 0);
  k += `<g filter="url(#${S.id("gischt")})">`;
  k += `<ellipse cx="${CX}" cy="${r(yb - H * 0.45)}" rx="7" ry="${r(H * 0.55)}" fill="#ffffff" opacity=".22"/>`;
  for (const s2 of [-1, 1]) k += `<path d="M${CX + s2 * 0.8} ${r(yb - H + 0.5)} Q${CX + s2 * 5} ${r(yb - H - 1.8)} ${CX + s2 * 7.6} ${r(yb - H * 0.55)} Q${CX + s2 * 8.8} ${r(yb - H * 0.22)} ${CX + s2 * 9.4} ${r(yb - 0.8)} L${CX + s2 * 7.2} ${r(yb - 0.8)} Q${CX + s2 * 6.6} ${r(yb - H * 0.45)} ${CX + s2 * 0.8} ${r(yb - H + 3.4)} Z" fill="#ffffff" opacity=".42"/>`;
  k += `<path d="M-2.4 0 Q-1.5 ${r(-H * 0.5)} -1 ${r(-H)} Q0 ${r(-H - 3)} 1 ${r(-H)} Q1.5 ${r(-H * 0.5)} 2.4 0 Z" transform="translate(${CX} ${r(yb)})" fill="${STRAHL}"/>`;
  k += `<ellipse cx="${CX}" cy="${r(yb - 0.9)}" rx="11" ry="2" fill="#ffffff" opacity=".9"/>`;
  k += `</g>`;
  k += `<path d="M${CX - 0.5} ${r(yb - 2)} L${CX - 0.3} ${r(yb - H + 2)}" stroke="#ffffff" stroke-width=".5" opacity=".9"/>`;
  for (let i = 0; i < 60; i++) { const t = rnd(), sx = rnd() < 0.5 ? -1 : 1; k += `<circle cx="${r(CX + sx * (1.4 + t * 8) + (rnd() - 0.5))}" cy="${r(yb - H * (1 - t * t) * 0.97 + rnd() * 2)}" r="${r(0.18 + rnd() * 0.22)}" fill="#fff" opacity=".85"/>`; }
  /* die Statuen vor dem Becken bleiben vorn: Becken dort ausschneiden */
  let loch = "";
  for (const p of statuen) if (p.D < FD - Math.sqrt(Math.max(0, RB * RB - p.X * p.X)) + 1.5) loch += ` M${r(p.x - 0.9 * p.u)} ${r(p.y + 1)} L${r(p.x + 0.9 * p.u)} ${r(p.y + 1)} L${r(p.x + 0.9 * p.u)} ${r(p.y - 4.4 * p.u)} L${r(p.x - 0.9 * p.u)} ${r(p.y - 4.4 * p.u)} Z`;
  S.def(`<clipPath id="${S.id("vorstatue")}"><path clip-rule="evenodd" d="M0 0 H400 V260 H0 Z${loch}"/></clipPath>`);
  S.teil({ id: "fontaene", de: "die Fontäne", syl: "fon-TÄ-ne", it: "la fontana", itSyl: "fon-TA-na", en: "fountain", x: 0, y: 0, kunst: `<g clip-path="url(#${S.id("vorstatue")})">${k}</g>`,
    tipp: "Die Große Fontäne springt bis zu 18 Meter hoch. Zur Zeit von Friedrich dem Großen funktionierte sie noch nicht." });
}

/* =====================================================================
   8 — DER WEG (heller Kies um die Fontäne) mit den Schlagschatten
   ===================================================================== */
const WEG = { teil: null };

/* =====================================================================
   9 — DIE ORANGENBÄUME in grünen Holzkübeln (Reihen links und rechts)
   ===================================================================== */
const ORANGEN = [];
for (const s of [-1, 1]) for (const D of [58, 46, 37]) ORANGEN.push({ X: s * (D < 40 ? 10.6 : 12.0), D });
ORANGEN.sort((a, b) => b.D - a.D);
let kuebelUnter = null;
const KUEBEL = S.lg("kuebel", [[0, "#5d8c64"], [0.5, "#3f6e48"], [1, "#2a4d33"]], 0, 0, 1, 0);
const ORKRONE = S.rg("orkrone", [[0, "#7fb055"], [0.6, "#4a7a33"], [1, "#2c5222"]], 0.35, 0.3, 0.75);
{
  let k = "";
  for (const o of ORANGEN) {
    const u = sk(o.D), x = xG(o.D, o.X), y = yG(o.D);
    bodenSchatten(o.D, o.X, 1.1, 3.4, 0.26);
    let g = "";
    /* Kübel: 0,9 m, grün gestrichen, Eckpfosten mit Kugeln */
    g += `<path d="M-.5 0 L-.55 -.85 L.55 -.85 L.5 0 Z" fill="${KUEBEL}"/>`;
    g += `<path d="M-.5 -.28 H.5 M-.53 -.56 H.53" stroke="#2a4532" stroke-width=".04"/>`;
    g += `<rect x="-.6" y="-.92" width=".12" height=".92" fill="#e9e4d6"/><rect x=".48" y="-.92" width=".12" height=".92" fill="#cfc8b6"/>`;
    g += `<circle cx="-.54" cy="-.98" r=".08" fill="#e9e4d6"/><circle cx=".54" cy="-.98" r=".08" fill="#cfc8b6"/>`;
    /* Stamm und runde Krone mit Orangen */
    g += `<rect x="-.05" y="-1.9" width=".1" height="1.05" fill="#6b5236"/>`;
    g += `<circle cx="0" cy="-2.55" r=".78" fill="${ORKRONE}"/>`;
    const z = zufall(Math.round(o.D * 7 + o.X));
    for (let i = 0; i < 9; i++) { const a = z() * 6.28, d = Math.sqrt(z()) * 0.62; g += `<circle cx="${r(Math.cos(a) * d)}" cy="${r(-2.55 + Math.sin(a) * d)}" r=".075" fill="#f29a1e"/>`; }
    k += `<g transform="translate(${r(x)} ${r(y)}) scale(${u.toFixed(4)})">${g}</g>`;
  }
  const o = ORANGEN.filter((q) => q.D === 37 && q.X < 0)[0], u = sk(o.D);
  kuebelUnter = { x: r(xG(o.D, o.X)), y: r(yG(o.D)), u };
  S.teil({ id: "orangenbaum", de: "der Orangenbaum", syl: "o-RAN-gen-baum", it: "l'arancio", itSyl: "a-RAN-cio", en: "orange tree", x: 0, y: 0, kunst: k,
    tipp: "Im Sommer stehen die Orangenbäume draußen im Park. Im Winter kommen sie in die Orangerie.",
    zoom: { x: r(kuebelUnter.x - 36), y: r(kuebelUnter.y - 50), w: 72, h: 54 },
    unter: [{ id: "kuebel", de: "der Kübel", syl: "KÜ-bel", it: "il vaso", itSyl: "VA-so", en: "planter", x: kuebelUnter.x, y: kuebelUnter.y,
      kunst: flaeche(-0.62 * u, -1 * u, 1.24 * u, 1 * u, 0.5), tipp: "Die Kübel sind aus Holz. So kann man die Bäume tragen." }] });
}

/* DER WEGWEISER (links vorn) */
const WW = { D: 24, X: -5.1 };
bodenSchatten(WW.D, WW.X, 0.12, 2.7, 0.2);
/* DIE SCHUBKARRE */
const SK = { D: 31.5, X: 8.4 };
bodenSchatten(SK.D, SK.X, 1.3, 0.8, 0.22);
for (const p of statuen) bodenSchatten(p.D, p.X, 1.2, 3.9, 0.2);

{
  /* Kiesfläche vom Becken bis vorne: helle Körnung, Rechenspuren, Schatten */
  let k = `<path d="M0 ${r(yG(FD + 30))} L400 ${r(yG(FD + 30))} L400 260 L0 260 Z" fill="${KIES}"/>`;
  {
    const z = zufall(5);
    let t = "";
    for (let i = 0; i < 14; i++) t += `<ellipse cx="${r(z() * 6)}" cy="${r(z() * 2.4)}" rx="${r(0.25 + z() * 0.3)}" ry="${r(0.12 + z() * 0.1)}" fill="${i % 2 ? "#efe6d2" : "#a99b80"}"/>`;
    S.def(`<pattern id="${S.id("korn")}" patternUnits="userSpaceOnUse" width="6" height="2.4">${t}</pattern>`);
    k += `<path d="M0 ${r(yG(60))} L400 ${r(yG(60))} L400 260 L0 260 Z" fill="url(#${S.id("korn")})" opacity=".55"/>`;
  }
  /* Rechenspuren des Gärtners (Bögen um die Fontäne) */
  for (const rr of [26, 29, 33]) { const p = []; for (let i = 0; i <= 40; i++) { const w = Math.PI * 0.62 + i / 40 * Math.PI * 0.76, X = rr * Math.sin(w), D = FD - rr * Math.cos(w); const x2 = xG(D, X); if (D > 10 && x2 > 1 && x2 < 399) p.push(`${r(x2)} ${r(yG(D))}`); } k += `<path d="M${p.join(" L")}" stroke="#b3a487" stroke-width=".4" fill="none" opacity=".55"/>`; }
  k += `<g filter="url(#${S.id("schw")})">${schattenListe.join("")}</g>`;
  k += `<rect x="0" y="${r(yG(FD + 30))}" width="400" height="${r(260 - yG(FD + 30))}" fill="${S.lg("kieslicht", [[0, "#000", 0.06], [0.3, "#000", 0], [1, "#fff6e0", 0.12]])}"/>`;
  WEG.teil = S.teil({ id: "weg", de: "der Weg", syl: "WEG", it: "il sentiero", itSyl: "sen-TIE-ro", en: "path", x: 0, y: 0, kunst: k,
    tipp: "Die Wege im Park sind aus hellem Kies. Er knirscht unter den Schuhen." });
}
/* Der Weg ist Bodenfläche: er muss VOR allen Dingen gezeichnet werden, die darauf stehen */
{
  const t = S.teile.pop();
  const ix = S.teile.findIndex((q) => q.id === "rasen");
  S.teile.splice(ix, 0, t);
}

{
  /* Wegweiser: Pfosten mit vier Schildern (weiß, grüne Schrift wie im Park) */
  const u = sk(WW.D);
  let g = `<rect x="-.05" y="-2.7" width=".1" height="2.7" fill="${S.lg("pfosten", [[0, "#5e6a63"], [1, "#2f3833"]], 0, 0, 1, 0)}"/>`;
  g += `<circle cx="0" cy="-2.74" r=".07" fill="#2f3833"/>`;
  const schilder = [[-2.5, 1, "Schloss Sanssouci"], [-2.18, -1, "Neues Palais 1,7 km"], [-1.86, 1, "Brandenburger Tor 1,2 km"], [-1.54, -1, "Holländisches Viertel 1,9 km"]];
  for (const [y, s, t] of schilder) {
    const w = 1.62;
    const p = s > 0 ? `M.06 ${y} L${w} ${y} L${w + 0.14} ${r(y + 0.13)} L${w} ${r(y + 0.26)} L.06 ${r(y + 0.26)} Z` : `M-.06 ${y} L${-w} ${y} L${-w - 0.14} ${r(y + 0.13)} L${-w} ${r(y + 0.26)} L-.06 ${r(y + 0.26)} Z`;
    g += `<path d="${p}" fill="#f7f5ee" stroke="#2f5a3c" stroke-width=".025"/>`;
    g += `<text x="${s > 0 ? 0.13 : -0.13}" y="${r(y + 0.185)}" font-size=".108" ${s > 0 ? "" : `text-anchor="end" `}fill="#2f5a3c" font-family="Arial,sans-serif" font-weight="bold">${t}</text>`;
  }
  S.teil({ id: "wegweiser", de: "der Wegweiser", syl: "WEG-wei-ser", it: "il cartello stradale", itSyl: "car-TEL-lo stra-DA-le", en: "signpost", x: r(xG(WW.D, WW.X)), y: r(yG(WW.D)), steht: true,
    kunst: `<g transform="scale(${u.toFixed(4)})">${g}</g>`, tipp: "Potsdam hat auch ein Brandenburger Tor. Es ist älter als das Tor in Berlin." });
}
{
  /* Schubkarre mit Laub, Rad vorn (zum Betrachter links) */
  const u = sk(SK.D);
  let g = `<circle cx="-.62" cy="-.2" r=".2" fill="#2b2b2b"/><circle cx="-.62" cy="-.2" r=".08" fill="#9aa1a6"/>`;
  g += `<path d="M-.7 -.32 L.55 -.42 L.9 -.05 M.05 -.4 L.15 0 M.55 -.42 L.6 0" stroke="#3b4044" stroke-width=".05" fill="none"/>`;
  g += `<path d="M-.75 -.72 L.6 -.78 L.45 -.36 L-.55 -.3 Z" fill="${S.lg("wanne", [[0, "#5f9a6a"], [1, "#2f5e3a"]])}"/>`;
  for (let i = 0; i < 16; i++) g += `<ellipse cx="${r(-0.6 + rnd() * 1.1)}" cy="${r(-0.78 - rnd() * 0.16)}" rx=".08" ry=".05" fill="${["#c98a2a", "#a4642a", "#d9b23a", "#7c8d3a"][i % 4]}"/>`;
  g += `<path d="M.55 -.62 L1.15 -.68" stroke="#6b5236" stroke-width=".06" stroke-linecap="round"/>`;
  S.teil({ oben: true, id: "schubkarre", de: "die Schubkarre", syl: "SCHUB-kar-re", it: "la carriola", itSyl: "car-RIO-la", en: "wheelbarrow", x: r(xG(SK.D, SK.X)), y: r(yG(SK.D)), steht: true,
    kunst: `<g transform="scale(${u.toFixed(4)})">${g}</g>`, tipp: "Der Gärtner sammelt das Laub in der Schubkarre." });
}
S.teil({ id: "gaertner", de: "der Gärtner", syl: "GÄRT-ner", it: "il giardiniere", itSyl: "giar-di-NIE-re", en: "gardener", x: G.x, y: G.y, kunst: G.svg,
  tipp: "Im Park Sanssouci arbeiten viele Gärtner. Sie pflegen die Beete, die Bäume und die Wege." });
{
  /* Rechen: Stiel durch beide Hände, Zinken unten auf dem Kies */
  const [a, b] = GH;
  const dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
  const fuss = { x: a.x - ux * 0.2, y: G.y + 0.2 };
  const top = { x: b.x + ux * 3, y: b.y + uy * 3 };
  let g = `<path d="M${r(fuss.x)} ${r(fuss.y - 0.6)} L${r(top.x)} ${r(top.y)}" stroke="#b8925e" stroke-width=".55" stroke-linecap="round"/>`;
  g += `<path d="M${r(fuss.x - 3)} ${r(fuss.y - 0.8)} L${r(fuss.x + 3)} ${r(fuss.y - 0.5)}" stroke="#4c5054" stroke-width=".6"/>`;
  for (let i = 0; i < 9; i++) g += `<path d="M${r(fuss.x - 2.8 + i * 0.7)} ${r(fuss.y - 0.75 + i * 0.035)} l.05 1" stroke="#4c5054" stroke-width=".25"/>`;
  S.teil({ oben: true, id: "rechen", de: "der Rechen", syl: "RE-chen", it: "il rastrello", itSyl: "ra-STREL-lo", en: "rake", x: 0, y: 0, kunst: g + flaeche(fuss.x - 3.2, Math.min(top.y, fuss.y) - 0.5, 6.4, Math.abs(fuss.y - top.y) + 1.6, 0.5),
    tipp: "Mit dem Rechen macht der Gärtner den Kies glatt." });
}
{
  /* Handy in den Händen der Touristin */
  const hs = [T.m.z.handL, T.m.z.handR].map((h) => T.p(h));
  const hx = (hs[0].x + hs[1].x) / 2, hy = Math.min(hs[0].y, hs[1].y);
  S.teil({ id: "touristin", de: "die Touristin", syl: "tou-RIS-tin", it: "la turista", itSyl: "tu-RI-sta", en: "tourist", x: T.x, y: T.y, kunst: T.svg,
    tipp: "Die Touristin macht ein Foto vom Schloss." });
  const g = `<rect x="-1.6" y="-3.1" width="3.2" height="5.6" rx=".6" fill="#1d2127" stroke="#8a9198" stroke-width=".25"/><rect x="-1.2" y="-2.6" width="2.4" height="4.6" rx=".3" fill="${S.lg("display", [[0, "#9cc0e2"], [0.55, "#f0c75e"], [1, "#9cbf63"]])}"/><circle cx="0" cy="-.9" r=".4" fill="#5f8f74"/>`;
  S.teil({ oben: true, id: "handy", de: "das Handy", syl: "HAN-dy", it: "il cellulare", itSyl: "cel-lu-LA-re", en: "mobile phone", x: r(hx), y: r(hy - 0.6), kunst: g + flaeche(-2, -3.5, 4, 6.4, 0.5),
    tipp: "Mit dem Handy macht man schnell ein Foto." });
}
{
  const kopf = M2.p(M2.m.z.kopf);
  S.teil({ id: "tourist", de: "der Tourist", syl: "tou-RIST", it: "il turista", itSyl: "tu-RI-sta", en: "tourist", x: M2.x, y: M2.y, kunst: M2.svg,
    tipp: "Der Tourist zeigt nach oben: „Da ist das Schloss!“",
    zoom: { x: r(M2.x - 30), y: r(M2.y - 62), w: 60, h: 40 },
    unter: [{ id: "rucksack", de: "der Rucksack", syl: "RUCK-sack", it: "lo zaino", itSyl: "ZAI-no", en: "backpack", x: r(M2.x), y: r(kopf.y + 0.62 * M2.u * 1),
      kunst: flaeche(-0.24 * M2.u, 0, 0.48 * M2.u, 0.5 * M2.u, 0.5) }] });
}
{
  S.teil({ id: "kind", de: "das Kind", syl: "KIND", it: "il bambino", itSyl: "bam-BI-no", en: "child", x: K.x, y: K.y, kunst: K.svg,
    tipp: "Das Kind bringt eine Kartoffel zum Grab des Königs." });
  const h = K.p(K.m.z.handR);
  let g = `<ellipse cx="0" cy="0" rx="1.7" ry="1.25" fill="${S.rg("knolle", [[0, "#e3c48c"], [0.6, "#c49a5c"], [1, "#8e6a3a"]], 0.38, 0.32, 0.75)}" transform="rotate(-18)"/>`;
  g += `<circle cx="-.6" cy="-.3" r=".12" fill="#7a5530"/><circle cx=".7" cy=".2" r=".12" fill="#7a5530"/><circle cx=".1" cy=".6" r=".1" fill="#7a5530"/><path d="M-1 -.7 q.6 -.5 1.3 -.4" stroke="#f2dfb6" stroke-width=".25" fill="none" opacity=".7"/>`;
  S.teil({ oben: true, id: "kartoffel", de: "die Kartoffel", syl: "kar-TOF-fel", it: "la patata", itSyl: "pa-TA-ta", en: "potato", x: r(h.x), y: r(h.y - 1.2), kunst: g + flaeche(-2.2, -1.9, 4.4, 3.8, 0.6),
    tipp: "Friedrich der Große machte die Kartoffel in Preußen bekannt. Darum legen Besucher Kartoffeln auf sein Grab." });
}

/* Ein Hauch Nachmittagslicht über allem (fängt keinen Tipp ab) */
S.davor(`<rect width="400" height="260" fill="${S.rg("abend", [[0, "#ffe7b8", 0.14], [0.6, "#ffe7b8", 0], [1, "#000", 0.05]], 0.0, 0.85, 1.1)}" pointer-events="none"/>`);

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/potsdam.js"));
console.log(aus);
