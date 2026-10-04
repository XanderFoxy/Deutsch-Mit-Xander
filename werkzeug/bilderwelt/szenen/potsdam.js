#!/usr/bin/env node
/* =====================================================================
   POTSDAM (FASSUNG 854, Runde 2) — Bilderwelt neu: Städte in Deutschland
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
     KUPPEL (flach, glatt gedeckt, ohne Kreuz — ein Lustschloss, keine
     Kirche) mit Ochsenaugen in Sandsteinrahmen und kleiner Laterne; im
     Fries des vorspringenden Mittelbaus die vergoldete INSCHRIFT
     „SANS, SOUCI.“ (mit Komma und Punkt — ein Rätsel bis heute).
     36 HERMEN aus Sandstein (Bacchanten und Bacchantinnen, die Begleiter
     des Weingottes, von Glume) tragen paarweise das Gebälk zwischen den
     hohen Fenstertüren; an beiden Enden runde Pavillons; oben eine
     Balustrade mit Vasen.
   - GROSSE FONTÄNE: rundes Becken (Persius 1840/41), der Strahl steigt
     bis 18 m (hier etwa 9 m, wie an einem normalen Tag). Ringsum ZWÖLF
     MARMORFIGUREN: acht römische Götter (Venus, Merkur, Apollo, Diana,
     Juno, Jupiter, Mars, Minerva) und die vier Elemente; Venus und Merkur
     (Pigalle) schenkte Ludwig XV. dem König — beide SITZEN. Seit 2002
     stehen dort Kopien. Attribute: Diana mit Bogen, Minerva mit Helm und
     Schild, Mars mit Helm und Speer. Um die Fontäne: Rasenstücke mit
     Buchskanten und Herbstastern (Parterre).
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
   Maßstab: Zentralperspektive, Auge 1,7 m über dem Kies, Horizont y = 188,
   Brennweite F = 720 (ein Meter in D Metern Entfernung = 720/D Einheiten).
   Fontänenmitte 80 m vor uns, unterste Terrassenmauer 150 m, oberste
   215 m, Schlossfassade 230 m (19,2 m über dem Parterre).
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "potsdam", titel: "Potsdam", emoji: "🏛️", thema: "Deutschland", kuerzel: "pdm", fassung: 854, breite: 400, hoehe: 260 });
const rnd = zufall(1745);
const r = B.r;
const HOR = 188, F = 720, EYE = 1.7, CX = 200;
const sk = (D) => F / D;
const yG = (D, h = 0) => HOR + (EYE - h) * F / D;
const xG = (D, X) => CX + X * F / D;
const kl = (x) => Math.min(400, Math.max(0, x));
const schattenListe = [];
/* Sonne im Südwesten (hinter uns, links), etwa 28° hoch: Schatten 1,9 × Höhe, nach Nordosten (rechts hinten) */
const bodenSchatten = (D, X, w, h, a = 0.3) => {
  const L = 1.9 * h, dx = 0.6 * L, dz = 0.8 * L;
  const p = [[X - w / 2, D], [X + w / 2, D], [X + dx + w * 0.3, D + dz], [X + dx - w * 0.3, D + dz]];
  schattenListe.push(`<path d="M${p.map(([x2, d2]) => `${r(kl(xG(d2, x2)))} ${r(yG(d2))}`).join(" L")} Z" fill="#35304a" opacity="${a}"/>`);
};
/* Figuren klein halten: feine Linien weg, Koordinaten der Formen auf Q cm runden
   (die Verläufe bleiben unangetastet, sonst werden Gesichter fleckig) */
const schlank = (svg, min = 0.35) => svg.replace(/<path [^>]*fill="none"[^>]*\/>/g, (p) => { const m = p.match(/stroke-width="([\d.]+)"/); return m && +m[1] < min ? "" : p; });
const kompakt = (svg, Q = 1, min = 0.35) => {
  svg = schlank(svg, min);
  const rund = (n) => { const v = Math.round(+n / Q) * Q; return String(v === 0 ? 0 : r(v)); };
  return svg.replace(/<(path|ellipse|circle|rect|line|polygon)\b[^>]*>/g, (tag) => tag
    .replace(/ d="([^"]+)"/g, (a, p) => ` d="${p.replace(/-?\d*\.?\d+/g, rund)}"`)
    .replace(/ (x|y|x1|y1|x2|y2|cx|cy)="(-?\d*\.?\d+)"/g, (a, k, n) => ` ${k}="${rund(n)}"`));
};

S.def(`<filter color-interpolation-filters="sRGB" id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter color-interpolation-filters="sRGB" id="${S.id("weich")}" x="-30%" y="-40%" width="160%" height="180%"><feGaussianBlur stdDeviation="1.3"/></filter>`);
S.def(`<filter color-interpolation-filters="sRGB" id="${S.id("weich2")}" x="-30%" y="-40%" width="160%" height="180%"><feGaussianBlur stdDeviation=".5"/></filter>`);
S.def(`<filter color-interpolation-filters="sRGB" id="${S.id("dunst")}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation=".35"/></filter>`);
S.def(`<filter color-interpolation-filters="sRGB" id="${S.id("gischt")}" x="-60%" y="-10%" width="220%" height="120%"><feGaussianBlur stdDeviation=".6 .25"/></filter>`);
S.def(`<filter color-interpolation-filters="sRGB" id="${S.id("schw")}" x="-30%" y="-80%" width="160%" height="260%"><feGaussianBlur stdDeviation=".6"/></filter>`);
/* Laubrand: gezackte, gelappte Kanten statt Kreisbögen */
S.def(`<filter color-interpolation-filters="sRGB" id="${S.id("laub")}" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".32" numOctaves="2" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="4.2" xChannelSelector="R" yChannelSelector="G"/></filter>`);
/* Wolkenrand: weich ausgefranst */
S.def(`<filter color-interpolation-filters="sRGB" id="${S.id("wolke")}" x="-15%" y="-30%" width="130%" height="160%"><feTurbulence type="fractalNoise" baseFrequency=".09" numOctaves="2" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G" result="d"/><feGaussianBlur in="d" stdDeviation=".7"/></filter>`);
S.def(`<filter color-interpolation-filters="sRGB" id="${S.id("schleier")}" x="-10%" y="-300%" width="120%" height="700%"><feTurbulence type="fractalNoise" baseFrequency=".04 .5" numOctaves="2" seed="5" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G"/><feGaussianBlur stdDeviation=".7"/></filter>`);

/* Stoffe */
const SAND = S.lg("sand", [[0, "#f6eedb"], [0.5, "#e2d5b9"], [1, "#b9a682"]], 0, 0, 1, 0);
const GOLD = S.lg("gold", [[0, "#fff3b0"], [0.45, "#f0c64a"], [1, "#a8760f"]], 0, 0, 1, 1);
const GLAS = S.lg("glas", [[0, "#a9bfcf"], [0.45, "#5e6f80"], [1, "#2f3c48"]]);
const MAUER = S.lg("mauer", [[0, "#f1e4c8"], [1, "#d6c4a2"]]);
const KIES = S.lg("kies", [[0, "#d4c6a9"], [1, "#c6b38e"]]);

/* =====================================================================
   KULISSE — Oktobernachmittag: Himmel, Wolken, Dunst, ferner Park
   ===================================================================== */
S.hinten(`<rect width="400" height="${HOR + 12}" fill="${S.lg("himmel", [[0, "#5f8fc6"], [0.5, "#93b6da"], [0.85, "#d5e0e6"], [1, "#efe6d2"]])}"/>`);
S.hinten(`<rect width="400" height="${HOR + 12}" fill="${S.rg("sonne", [[0, "#ffe9c0", 0.6], [1, "#ffe9c0", 0]], 0, 1, 0.8)}"/>`);
{
  /* Cumuli in verschiedenen Größen: oben groß, zum Horizont klein und flach.
     Drei Tonstufen: grau-violette Unterseite (weich), weißer Körper, warm
     angestrahlte Oberkante links (Sonne im Südwesten). */
  const wolke = (x, y, w, h, seed) => {
    const z = zufall(seed), c = [];
    const n = Math.max(4, Math.round(w / 4));
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n, hh = h * (0.35 + 0.65 * Math.pow(Math.sin(Math.PI * t), 0.8)) * (0.75 + z() * 0.4);
      const rr = Math.max(1.4, hh * (0.42 + z() * 0.16));
      c.push([x - w / 2 + t * w + (z() - 0.5) * 2, y - hh + rr, rr]);
    }
    for (let i = 0; i < n; i += 2) c.push([x - w / 2 + (i + 0.5) / n * w, y - h * 0.18, h * 0.28]);
    const id = S.id("wk" + seed);
    S.def(`<g id="${id}">${c.map(([a, b, rr]) => `<circle cx="${r(a)}" cy="${r(b)}" r="${r(rr)}"/>`).join("")}<ellipse cx="${x}" cy="${r(y - h * 0.12)}" rx="${r(w * 0.5)}" ry="${r(h * 0.16)}"/></g>`);
    const lage = (dx, dy, f, fill, op = 1) => `<use href="#${id}" fill="${fill}" opacity="${op}" transform="translate(${r(x + dx)} ${r(y + dy)}) scale(${f}) translate(${-x} ${-y})"/>`;
    return `<g filter="url(#${S.id("wolke")})">${lage(1, 1.4, 1, "#a9a6bf", 0.9)}${lage(-0.3, -0.6, 0.94, "#eef0f5")}${lage(-1.4, -2.4, 0.74, "#fff8ec")}</g>`;
  };
  S.hinten(wolke(74, 40, 70, 20, 3) + wolke(318, 30, 58, 17, 7) + wolke(196, 56, 26, 6, 11) + wolke(268, 72, 18, 4, 13) + wolke(122, 80, 14, 3, 17));
  /* lange Schleierwolken hoch oben */
  S.hinten(`<g filter="url(#${S.id("schleier")})" opacity=".55"><path d="M150 12 Q230 6 330 10 Q240 12 150 14 Z M20 22 Q80 17 150 20 Q90 23 20 24 Z" fill="#f6f2ec"/></g>`);
}
/* Dunst über dem Horizont */
S.hinten(`<rect x="0" y="${HOR - 70}" width="400" height="72" fill="${S.lg("dunst", [[0, "#efe6d6", 0], [1, "#efe6d6", 0.6]])}"/>`);
/* Boden des Parterres (unter allem) */
S.hinten(`<rect x="0" y="${HOR - 2}" width="400" height="${260 - HOR + 2}" fill="#6f8f45"/>`);
/* Kronen-Werkzeug: große gelappte Silhouette in drei Tonstufen, Himmelslöcher, Herbstfarbe als Verlauf */
let bz = 0;
const krone = (cx, cy, w, h, seed, T, loecher = 3, dunst = 0) => {
  /* Krone aus 9–12 Laublappen; jeder Lappen hat Schattenseite (rechts unten),
     Mittelton und Lichtkante (links oben, Sonne im Südwesten). Hinten zuerst. */
  const z = zufall(seed);
  const lap = [];
  const n = 11;
  for (let i = 0; i < n; i++) {
    const a = z() * Math.PI * 2, d = Math.sqrt(z()) * 0.34;
    lap.push([cx + Math.cos(a) * w * d, cy + Math.sin(a) * h * d * 0.95, (0.17 + z() * 0.09) * w, (0.15 + z() * 0.08) * h]);
  }
  lap.sort((p, q) => p[1] - q[1] || p[0] - q[0]);
  const grad = (name, a, b) => S.lg(name + seed, [[0, a], [1, b]], cx, cy - h / 2, cx, cy + h / 2, ' gradientUnits="userSpaceOnUse"');
  const GD = grad("kd", T[0], T[1]), GM = grad("km", T[2], T[3]), GL = grad("kl", T[4], T[5]);
  let basis = `<ellipse cx="${cx}" cy="${r(cy + h * 0.06)}" rx="${r(w * 0.42)}" ry="${r(h * 0.4)}"/>`;
  let lappen = "";
  for (const [x, y, rx, ry] of lap) {
    lappen += `<ellipse cx="${r(x + rx * 0.08)}" cy="${r(y + ry * 0.1)}" rx="${r(rx)}" ry="${r(ry)}" fill="${GD}"/>`;
    lappen += `<ellipse cx="${r(x - rx * 0.12)}" cy="${r(y - ry * 0.12)}" rx="${r(rx * 0.78)}" ry="${r(ry * 0.74)}" fill="${GM}"/>`;
    lappen += `<ellipse cx="${r(x - rx * 0.32)}" cy="${r(y - ry * 0.34)}" rx="${r(rx * 0.4)}" ry="${r(ry * 0.36)}" fill="${GL}"/>`;
  }
  let g = `<g filter="url(#${S.id("laub")})"${dunst ? ` opacity="${dunst}"` : ""}><g fill="${GD}">${basis}</g>${lappen}`;
  for (let i = 0; i < loecher; i++) { const a = -Math.PI * (0.1 + z() * 0.8), d = 0.28 + z() * 0.1; g += `<ellipse cx="${r(cx + Math.cos(a) * w * d * 1.2)}" cy="${r(cy + Math.sin(a) * h * d)}" rx="${r(0.9 + z() * 1.2)}" ry="${r(0.7 + z() * 0.9)}" fill="#a9c4de"/>`; }
  return g + `</g>`;
};
/* ferner Baumbestand des Parks hinter dem Schloss: durchgehend, blass (Luftperspektive) */
{
  let k = "";
  const T = ["#93a68f", "#8a9c84", "#a3b49c", "#98ab92", "#b8c6b0", "#aebfa6"];
  for (const [x, y, w, h, sd] of [[34, 122, 70, 46, 81], [96, 118, 60, 30, 82], [304, 118, 60, 30, 83], [366, 120, 72, 48, 84], [200, 126, 140, 22, 85]]) k += krone(x, y, w, h, sd, T, 0);
  S.hinten(k);
}

/* =====================================================================
   1 — DER BAUM (links) und DAS LAUB (rechts): alte Parkbäume, Herbstfarben
   ===================================================================== */
const stamm = (x, y0, y1, w) => `<path d="M${r(x - w)} ${y0} Q${r(x - w * 0.5)} ${r((y0 + y1) / 2)} ${r(x - w * 0.45)} ${y1} L${r(x + w * 0.45)} ${y1} Q${r(x + w * 0.5)} ${r((y0 + y1) / 2)} ${r(x + w)} ${y0} Z" fill="${S.lg("stamm", [[0, "#8a7458"], [0.5, "#5b4836"], [1, "#2f261d"]], 0, 0, 1, 0)}"/>` +
  `<path d="M${x} ${r(y1 + 8)} q${r(w * 2.4)} -6 ${r(w * 3.4)} -15 M${x} ${r(y1 + 5)} q${r(-w * 2.2)} -5 ${r(-w * 3.2)} -13" stroke="#3f3226" stroke-width="${r(w * 0.45)}" fill="none" stroke-linecap="round"/>`;
{
  const T = ["#3d5a2c", "#22381c", "#7e9a40", "#4e7032", "#d9cf6a", "#9fbd58"];
  let k = stamm(18, 196, 140, 3.2) + stamm(48, 194, 152, 2.3);
  k += krone(24, 118, 56, 86, 21, T, 4) + krone(52, 152, 36, 44, 22, ["#42602e", "#263f1e", "#8aa042", "#56783a", "#e6d26a", "#a8c25a"], 2);
  S.teil({ id: "baum", de: "der Baum", syl: "BAUM", it: "l'albero", itSyl: "AL-be-ro", en: "tree", x: 0, y: 0, kunst: k,
    tipp: "Im Park Sanssouci stehen viele alte Bäume." });
}
{
  const T = ["#5a5a24", "#2e3a1c", "#b08a30", "#6e7a34", "#f2c45a", "#c9be5a"];
  let k = stamm(382, 197, 140, 3.2) + stamm(352, 194, 152, 2.2);
  k += krone(376, 116, 54, 88, 23, T, 4) + krone(348, 152, 36, 44, 24, ["#4a5a28", "#2a3a1c", "#b8742a", "#6a7a34", "#f0a04a", "#c2b85a"], 2);
  S.teil({ id: "laub", de: "das Laub", syl: "LAUB", it: "il fogliame", itSyl: "fo-GLIA-me", en: "foliage", x: 0, y: 0, kunst: k,
    tipp: "Im Herbst färbt sich das Laub gelb und rot. Bald fallen die Blätter." });
}

/* =====================================================================
   2 — DAS SCHLOSS SANSSOUCI — gezeichnet in Metern (PU Einheiten je Meter)
   ===================================================================== */
const PD = 230, PH = 19.2, PU = sk(PD), PY = yG(PD, PH);
/* Herme (Bacchant/Bacchantin): Kopf trägt das Gebälk bei -8.6; Licht von links, Schattenkante rechts */
const HERME_S = S.lg("hermes", [[0, "#fff8e8"], [0.4, "#ecdfc0"], [0.75, "#c3b08a"], [1, "#8f7d5c"]], 0, 0, 1, 0);
S.def(`<g id="${S.id("herme")}">` +
  `<path d="M-.32 -.5 L-.32 -.8 L-.24 -.86 L-.37 -4.5 L.37 -4.5 L.24 -.86 L.32 -.8 L.32 -.5 Z" fill="${HERME_S}"/>` +
  `<path d="M-.4 -4.45 Q0 -4.3 .4 -4.45 L.36 -4.95 Q0 -4.75 -.36 -4.95 Z" fill="#e6d7b4"/>` +
  `<path d="M-.34 -4.9 Q-.3 -5.5 -.27 -5.8 Q-.38 -6.4 -.38 -6.75 L-.14 -6.92 L.14 -6.92 L.38 -6.75 Q.38 -6.4 .27 -5.8 Q.3 -5.5 .34 -4.9 Z" fill="${HERME_S}"/>` +
  `<path d="M.22 -.6 L.33 -4.5 L.3 -4.9 L.27 -5.8 L.37 -6.7 L.3 -6.72 L.2 -5.8 L.24 -4.9 L.16 -.6 Z" fill="#7d6a4a" opacity=".55"/>` +
  `<path d="M-.34 -6.72 Q-.6 -7.1 -.56 -7.45 Q-.52 -7.9 -.36 -8.4" stroke="#fbf1da" stroke-width=".16" fill="none" stroke-linecap="round"/>` +
  `<path d="M.33 -6.7 Q.48 -6.3 .36 -6.05 Q.2 -6.0 .02 -6.2" stroke="#c9b893" stroke-width=".14" fill="none" stroke-linecap="round"/>` +
  `<g fill="#b9a67e"><circle cx="-.02" cy="-6.12" r=".07"/><circle cx=".08" cy="-6.06" r=".07"/><circle cx=".02" cy="-5.98" r=".065"/></g>` +
  `<ellipse cx=".02" cy="-7.28" rx=".2" ry=".25" fill="#f3e9d1"/><path d="M.12 -7.46 Q.24 -7.28 .12 -7.08" stroke="#a8946c" stroke-width=".07" fill="none"/>` +
  `<g fill="#d9c8a2"><circle cx="-.14" cy="-7.44" r=".09"/><circle cx=".02" cy="-7.5" r=".1"/><circle cx=".17" cy="-7.43" r=".09"/></g>` +
  `<path d="M-.3 -7.6 L.34 -7.6 L.42 -8.6 L-.42 -8.6 Z" fill="#e1d2ae"/><path d="M.3 -7.6 L.34 -7.6 L.42 -8.6 L.34 -8.6 Z" fill="#a8946c"/>` +
  `</g>`);
/* Fenstertür: rundbogig, mit tiefer Laibung (Schatten oben und links) */
S.def(`<g id="${S.id("fenster")}">` +
  `<path d="M-1.3 0 L-1.3 -5.0 Q-1.3 -6.3 0 -6.3 Q1.3 -6.3 1.3 -5.0 L1.3 0 Z" fill="#f6f0e2"/>` +
  `<path d="M-1.05 0 L-1.05 -5.0 Q-1.05 -6.05 0 -6.05 Q1.05 -6.05 1.05 -5.0 L1.05 0 Z" fill="${GLAS}"/>` +
  `<path d="M-1.05 0 L-1.05 -5.0 Q-1.05 -6.05 0 -6.05 Q1.05 -6.05 1.05 -5.0 L.8 -5.0 Q.8 -5.75 0 -5.75 Q-.75 -5.75 -.75 -5.0 L-.75 0 Z" fill="#3a3530" opacity=".45"/>` +
  `<path d="M0 0 V-5.8 M-.9 -1.6 H.95 M-.9 -3.2 H.95 M-.9 -4.8 H.95" stroke="#f6f0e2" stroke-width=".12"/>` +
  `<path d="M-.6 -5.4 L-.1 -5.6 L-.6 -2.2 Z" fill="#fff" opacity=".25"/>` +
  `<path d="M-.5 -6.35 L.5 -6.35 L.3 -7.0 L-.3 -7.0 Z" fill="#f2e7cf"/>` +
  `</g>`);
/* Vase auf der Balustrade: Fuß, Bauch, Deckel mit Knauf (1,3 m) */
S.def(`<path id="${S.id("vase")}" d="M-.28 0 L.28 0 L.18 -.14 Q.1 -.2 .12 -.3 Q.46 -.42 .44 -.74 Q.4 -.98 .22 -1.02 L.26 -1.1 Q0 -1.2 -.26 -1.1 L-.22 -1.02 Q-.4 -.98 -.44 -.74 Q-.46 -.42 -.12 -.3 Q-.1 -.2 -.18 -.14 Z M-.06 -1.16 Q0 -1.32 .06 -1.16 Z" fill="${SAND}"/>`);
const schlossUnter = [];
{
  let k = "";
  const W = 45.8, TOP = -8.6;
  const GELB = S.lg("gelb", [[0, "#fae09a"], [0.5, "#f0c862"], [1, "#d8a645"]], 0, 0, 1, 0);
  /* Flügel */
  k += `<rect x="-37.8" y="${TOP}" width="75.6" height="${-TOP + 0.4}" fill="${GELB}"/>`;
  /* Mittelbau (ovaler Marmorsaal) — springt vor */
  k += `<rect x="-8" y="${TOP}" width="16" height="${-TOP + 0.4}" fill="${S.lg("mitte", [[0, "#fbe6a4"], [0.5, "#f2cc68"], [1, "#d4a447"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M7.7 ${TOP} L8.2 ${TOP} L8.2 .4 L7.7 .4 Z" fill="#a8792f" opacity=".55"/>`;
  /* runde Eckpavillons: Zylinder, links hell, rechts im Eigenschatten */
  const PAV = S.lg("pav", [[0, "#fbe39e"], [0.35, "#f1c962"], [0.8, "#c18e36"], [1, "#9a6c28"]], 0, 0, 1, 0);
  for (const s of [-1, 1]) {
    const x0 = s < 0 ? -W - 0.6 : 37.8;
    k += `<path d="M${x0} ${TOP} Q${r(x0 + 4.3)} ${TOP - 0.5} ${r(x0 + 8.6)} ${TOP} L${r(x0 + 8.6)} .4 L${x0} .4 Z" fill="${PAV}"/>`;
  }
  /* Fenstertüren */
  const fenster = [-5.3, 0, 5.3];
  for (let i = 1; i <= 5; i++) fenster.push(8 + (i - 0.5) * 5.96, -(8 + (i - 0.5) * 5.96));
  fenster.push(39.9, 43.6, -39.9, -43.6);
  for (const x of fenster) k += `<use href="#${S.id("fenster")}" x="${r(x)}" y="0"/>`;
  /* Hermen paarweise an den Pfeilern: 4 + 2·5 + 2·2 Pfeiler = 18 Paare = 36 Figuren, mit Schlagschatten nach rechts */
  const pfeiler = [-8, -2.65, 2.65, 8];
  for (let i = 1; i <= 5; i++) pfeiler.push(8 + i * 5.96, -(8 + i * 5.96));
  pfeiler.push(41.75, 45.3, -41.75, -45.6);
  let sch = "", hermen = "";
  for (const p of pfeiler) for (const s of [-1, 1]) {
    const x = r(p + s * 0.5);
    sch += `<path d="M${r(x + 0.25)} -.5 L${r(x + 0.7)} -.5 L${r(x + 0.85)} -7.6 L${r(x + 0.4)} -7.6 Z"/>`;
    hermen += `<use href="#${S.id("herme")}" transform="translate(${x} 0) scale(${-s} 1)"/>`;
  }
  k += `<g fill="#7a5418" opacity=".3" filter="url(#${S.id("schw")})">${sch}</g>` + hermen;
  /* Gebälk mit Fries und Kranzgesims; unter dem Gesims ein Schattenband */
  const GEB = S.lg("gebaelk", [[0, "#f7edd5"], [1, "#d8c7a0"]]);
  k += `<rect x="${-W - 0.6}" y="${TOP - 1.1}" width="${2 * W + 1.2}" height="1.1" fill="${GEB}"/>`;
  k += `<rect x="${-W - 0.6}" y="${TOP - 0.05}" width="${2 * W + 1.2}" height=".6" fill="#7a5418" opacity=".22"/>`;
  k += `<rect x="${-W - 0.8}" y="${TOP - 1.5}" width="${2 * W + 1.6}" height=".45" fill="#fbf4e3"/>`;
  /* Mittelbau: gekrümmtes Gebälk (ovaler Saal) mit der Inschrift im Fries */
  const MB = (y, d) => `M-8.2 ${y} Q0 ${r(y - d)} 8.2 ${y}`;
  k += `<path d="${MB(TOP + 0.05, 0.5)} L8.2 ${r(TOP - 1.55)} Q0 ${r(TOP - 2.1)} -8.2 ${r(TOP - 1.55)} Z" fill="${S.lg("fries", [[0, "#fbe4a0"], [0.6, "#f0c862"], [1, "#d3a245"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="${MB(TOP - 1.55, 0.55)} L8.4 ${r(TOP - 2.05)} Q0 ${r(TOP - 2.65)} -8.4 ${r(TOP - 2.05)} Z" fill="#fbf4e3"/>`;
  k += `<path d="${MB(TOP + 0.05, 0.5)}" stroke="#a8792f" stroke-width=".18" fill="none"/>`;
  k += `<path id="${S.id("bogen")}" d="M-7 ${r(TOP - 0.42)} Q0 ${r(TOP - 0.92)} 7 ${r(TOP - 0.42)}" fill="none"/>`;
  k += `<text font-size="1.05" fill="${GOLD}" stroke="#7a5410" stroke-width=".04" font-family="'Times New Roman',Georgia,serif" font-weight="bold" letter-spacing=".2"><textPath href="#${S.id("bogen")}" startOffset="50%" text-anchor="middle">SANS, SOUCI.</textPath></text>`;
  /* Balustrade der Flügel mit Docken; Vasen über jeder zweiten Achse */
  k += `<rect x="${-W}" y="${TOP - 2.6}" width="${2 * W}" height="1.1" fill="${S.lg("brust", [[0, "#f3ead6"], [1, "#d5c6a6"]])}"/>`;
  let bal = "";
  for (let x = -W + 0.4; x < W - 0.2; x += 0.55) if (Math.abs(x) > 8.6) bal += `<rect x="${r(x)}" y="${r(TOP - 2.45)}" width=".26" height=".8" rx=".1"/>`;
  k += `<g fill="#b6a684">${bal}</g>`;
  k += `<rect x="${-W}" y="${TOP - 2.75}" width="${2 * W - 0}" height=".3" fill="#fbf4e3"/>`;
  for (const x of [-44, -38, -32, -26.2, -20.3, -14.4, 14.4, 20.3, 26.2, 32, 38, 44]) k += `<use href="#${S.id("vase")}" transform="translate(${x} ${r(TOP - 2.75)})"/>`;
  /* Attika über dem Mittelbau und die Kuppel */
  const TB = TOP - 2.65;
  k += `<path d="M-7.6 ${r(TB + 0.2)} L7.6 ${r(TB + 0.2)} L7.6 ${r(TB - 1.3)} L-7.6 ${r(TB - 1.3)} Z" fill="${S.lg("attika", [[0, "#f8dc8a"], [0.55, "#eec35c"], [1, "#c99a3e"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-7.9" y="${r(TB - 1.6)}" width="15.8" height=".35" fill="#fbf4e3"/>`;
  for (const s of [-1, 1]) k += `<use href="#${S.id("vase")}" transform="translate(${s * 8.5} ${r(TB + 0.1)}) scale(1.1)"/>`;
  /* Kuppel: flach und breit, glatt mit grüner Patina (fleckig), Licht von links */
  const KB = TB - 1.6, KH = 5.9;
  const kup = `M-7.4 ${r(KB)} C-7.4 ${r(KB - KH * 0.62)} -4 ${r(KB - KH)} 0 ${r(KB - KH)} C4 ${r(KB - KH)} 7.4 ${r(KB - KH * 0.62)} 7.4 ${r(KB)} Z`;
  k += `<path d="${kup}" fill="${S.lg("kupfer", [[0, "#9fd0b9"], [0.3, "#86bfa5"], [0.7, "#5f9a80"], [1, "#3d6d59"]], 0, 0, 1, 0)}"/>`;
  {
    const z = zufall(71);
    let fl = "";
    for (let i = 0; i < 16; i++) { const t = z() * 2 - 1, v = z(); fl += `<ellipse cx="${r(t * 6)}" cy="${r(KB - 0.6 - v * (KH - 1.2) * (1 - t * t * 0.6))}" rx="${r(0.4 + z() * 0.8)}" ry="${r(0.25 + z() * 0.4)}" fill="${z() < 0.5 ? "#4f8670" : "#b8e0cc"}" opacity=".35"/>`; }
    k += fl;
  }
  k += `<path d="M-2.6 ${r(KB)} Q-2.4 ${r(KB - KH * 0.8)} 0 ${r(KB - KH)} M2.6 ${r(KB)} Q2.4 ${r(KB - KH * 0.8)} 0 ${r(KB - KH)}" stroke="#4a7d68" stroke-width=".06" fill="none" opacity=".6"/>`;
  k += `<path d="M-6.6 ${r(KB - 0.4)} C-6.4 ${r(KB - KH * 0.6)} -3.6 ${r(KB - KH * 0.94)} -.8 ${r(KB - KH * 0.98)}" stroke="#e2f5ea" stroke-width=".4" fill="none" opacity=".5"/>`;
  /* Ochsenaugen mit Sandsteinrahmen, Kartusche oben und Girlande unten */
  for (const [x, f] of [[-4.6, 0.8], [0, 0.9], [4.6, 0.8]]) {
    const y = KB - 1.2;
    k += `<ellipse cx="${x}" cy="${r(y)}" rx="${r(0.5 * f)}" ry="${r(0.58 * f)}" fill="#55786c" stroke="#e8dcbd" stroke-width=".26"/>`;
    k += `<path d="M${r(x - 0.3 * f)} ${r(y - 0.95)} q${r(0.3 * f)} -.55 ${r(0.6 * f)} 0 Z" fill="#efe3c6"/>`;
    k += `<path d="M${r(x - 0.75 * f)} ${r(y + 0.4)} q${r(0.75 * f)} .7 ${r(1.5 * f)} 0" stroke="#e8dcbd" stroke-width=".16" fill="none"/>`;
  }
  /* kleine schlichte Laterne mit goldener Kugel — kein Kreuz */
  const LB = KB - KH + 0.1;
  k += `<rect x="-.75" y="${r(LB - 1.0)}" width="1.5" height="1.0" fill="#86bfa5"/><rect x="-.35" y="${r(LB - 0.85)}" width=".25" height=".7" fill="#2c3a42"/><rect x=".15" y="${r(LB - 0.85)}" width=".25" height=".7" fill="#2c3a42"/>`;
  k += `<path d="M-.95 ${r(LB - 1.0)} Q0 ${r(LB - 1.7)} .95 ${r(LB - 1.0)} Z" fill="#6fa58d"/><circle cx="0" cy="${r(LB - 1.9)}" r=".24" fill="${GOLD}"/>`;
  /* Abendwärme auf der Fassade */
  k += `<rect x="${-W - 0.6}" y="${TOP}" width="${2 * W + 1.2}" height="${-TOP + 0.4}" fill="${S.lg("warm", [[0, "#ffd29a", 0.18], [0.6, "#ffd29a", 0.05], [1, "#7a6aa0", 0.1]], 0, 0, 1, 0)}"/>`;
  S.teil({ id: "schloss", de: "das Schloss", syl: "SCHLOSS", it: "il palazzo", itSyl: "pa-LAZ-zo", en: "palace",
    x: CX, y: PY, kunst: `<g transform="scale(${PU})">${k}</g>`,
    tipp: "Das Schloss Sanssouci war das Sommerschloss von König Friedrich dem Großen. „Sans souci“ ist Französisch und heißt „ohne Sorge“.",
    zoom: { x: r(CX - 15 * PU), y: r(PY - 20 * PU), w: r(30 * PU), h: r(20 * PU) } });
  const M = (x, y) => [r(CX + x * PU), r(PY + y * PU)];
  const [kx, ky] = M(0, KB);
  schlossUnter.push({ id: "kuppel", de: "die Kuppel", syl: "KUP-pel", it: "la cupola", itSyl: "CU-po-la", en: "dome", x: kx, y: ky,
    kunst: flaeche(-7.4 * PU, -(KH + 2) * PU, 14.8 * PU, (KH + 2) * PU), tipp: "Unter der grünen Kuppel liegt der Marmorsaal. Hier aß der König mit seinen Gästen." });
  const [ix, iy] = M(0, TOP);
  schlossUnter.push({ id: "inschrift", de: "die Inschrift", syl: "IN-schrift", it: "l'iscrizione", itSyl: "i-scri-ZIO-ne", en: "inscription", x: ix, y: iy,
    kunst: flaeche(-8 * PU, -1.9 * PU, 16 * PU, 2 * PU, 0.6), tipp: "Die Inschrift heißt „SANS, SOUCI.“ — mit Komma und Punkt. Warum, weiß bis heute niemand genau." });
  const [hx, hy] = M(-13.96 - 0.5, 0);
  schlossUnter.push({ id: "figur", de: "die Figur", syl: "fi-GUR", it: "la figura", itSyl: "fi-GU-ra", en: "figure", x: hx, y: hy,
    kunst: flaeche(-0.55 * PU, -8.7 * PU, 1.6 * PU, 8.5 * PU, 0.5), tipp: "36 Figuren aus Sandstein stützen das Dach. Sie feiern den Wein: Es sind Begleiter des Weingottes Bacchus." });
}
S.teile[S.teile.length - 1].unter = schlossUnter;

/* =====================================================================
   3 — DIE WEINBERGTERRASSEN: sechs geschwungene Mauern, Glasnischen, Reben am Spalier
   ===================================================================== */
const TD = (i) => 150 + 13 * i, TH = 3.2, HALB = 42, TREPPE = 3.1;
const wandD = (i, X) => TD(i) + 2.2 * (1 - (X / HALB) ** 2);   /* zur Mitte leicht zurück */
const NN = 14, ABST = (HALB - TREPPE - 1) / NN;
const terrUnter = [];
S.def(`<pattern id="${S.id("sprossen")}" patternUnits="userSpaceOnUse" width="1.5" height="1.6"><path d="M0 0 H1.5 M0 0 V1.6" stroke="#eef0e8" stroke-width=".22"/></pattern>`);
const NISCHE = S.lg("nischeglas", [[0, "#c3d6dc"], [0.3, "#6a877b"], [0.6, "#2f4a37"], [1, "#22362a"]]);
const TERRGRAS = S.lg("terrgras", [[0, "#5d7d38"], [1, "#3d5a26"]]);
{
  let k = "";
  const P = (i, X, h) => `${r(xG(wandD(i, X), X))} ${r(yG(wandD(i, X), h))}`;
  let pz = 0;
  for (let i = 5; i >= 0; i--) {
    const h0 = TH * i, h1 = TH * (i + 1), u = sk(TD(i) + 1);
    for (const s of [-1, 1]) {
      const xs = [];
      for (let j = 0; j <= 6; j++) xs.push(s * (TREPPE + 0.4 + (HALB - TREPPE - 0.4) * j / 6));
      /* Bewuchskante oben: schmal und dunkel, mit kleinen geschnittenen Gehölzen */
      k += `<path d="M${xs.map((X) => P(i, X, h1 + 0.45)).join(" L")} L${xs.slice().reverse().map((X) => P(i, X, h1)).join(" L")} Z" fill="${TERRGRAS}"/>`;
      let geh = "";
      for (let j = 1; j < NN; j += 2) { const X = s * (TREPPE + 1.2 + j * ABST), D = wandD(i, X) + 1.5, x = xG(D, X), y = yG(D, h1 + 0.2), uu = sk(D); geh += `<ellipse cx="${r(x)}" cy="${r(y - 0.55 * uu)}" rx="${r(0.45 * uu)}" ry="${r(0.6 * uu)}"/>`; }
      k += `<g fill="#3a5a2a">${geh}</g>`;
      /* die Mauer und darauf das Spalier: eigenes Muster je Mauerhälfte, an den Nischen ausgerichtet */
      const wand = `M${xs.map((X) => P(i, X, h1)).join(" L")} L${xs.slice().reverse().map((X) => P(i, X, h0)).join(" L")} Z`;
      const Hh = TH * u, A = ABST * u, X0 = s * (TREPPE + 1.2), x0 = xG(wandD(i, X0), X0), yt = yG(wandD(i, s * 20), h1);
      const z = zufall(100 + i * 7 + (s > 0 ? 3 : 0)), pid = S.id("sp" + pz++);
      let t = "";
      for (const zx of [0, A, 2 * A]) {
        t += `<path d="M${r(zx)} ${r(Hh * 0.98)} Q${r(zx + 0.3)} ${r(Hh * 0.6)} ${r(zx - 0.2)} ${r(Hh * 0.2)}" stroke="#6b5636" stroke-width="${r(0.12 * u)}" fill="none"/>`;
        for (const wy of [0.3, 0.62]) for (let m = 0; m < 5; m++) {
          const lx = zx + (z() - 0.5) * A * 0.7, ly = Hh * wy + (z() - 0.6) * Hh * 0.18, gelb = z() < 0.12;
          t += `<ellipse cx="${r(lx)}" cy="${r(ly)}" rx="${r((0.35 + z() * 0.2) * u)}" ry="${r((0.28 + z() * 0.12) * u)}" fill="${gelb ? "#b9a640" : z() < 0.5 ? "#5f8a3a" : "#7aa04a"}"/>`;
        }
        if (z() < 0.8) t += `<path d="M${r(zx + 0.4)} ${r(Hh * 0.36)} l${r(0.25 * u)} 0 l${r(-0.12 * u)} ${r(0.42 * u)} Z" fill="#4a3566"/>`;
      }
      t += `<path d="M0 ${r(Hh * 0.3)} H${r(2 * A)} M0 ${r(Hh * 0.62)} H${r(2 * A)}" stroke="#7a6e5a" stroke-width=".12" opacity=".7"/>`;
      S.def(`<pattern id="${pid}" patternUnits="userSpaceOnUse" width="${r(2 * A)}" height="${r(Hh * 1.4)}" patternTransform="translate(${r(x0 + (s > 0 ? 0 : -2 * A))} ${r(yt)})">${t}</pattern>`);
      k += `<path d="${wand}" fill="${MAUER}"/><path d="${wand}" fill="url(#${pid})"/>`;
      /* verglaste Nischen */
      let nische = "";
      for (let j = 0; j < NN; j++) {
        const Xn = s * (TREPPE + 1.2 + (j + 0.5) * ABST);
        const D = wandD(i, Xn), uu = sk(D), xn = xG(D, Xn), yb = yG(D, h0 + 0.2), ytt = yG(D, h1 - 0.45);
        const nw = 1.3 * uu / 2, ar = nw;
        nische += `M${r(xn - nw)} ${r(yb)} L${r(xn - nw)} ${r(ytt + ar)} Q${r(xn - nw)} ${r(ytt)} ${r(xn)} ${r(ytt)} Q${r(xn + nw)} ${r(ytt)} ${r(xn + nw)} ${r(ytt + ar)} L${r(xn + nw)} ${r(yb)} Z `;
      }
      k += `<path d="${nische}" fill="${NISCHE}" stroke="#f4f0e4" stroke-width="${r(0.14 * u)}"/><path d="${nische}" fill="url(#${S.id("sprossen")})" opacity=".75"/>`;
      /* Schlagschatten der Mauerkrone (Sonne SW: nach unten rechts) */
      k += `<path d="M${xs.map((X) => P(i, X, h1 - 0.08)).join(" L")} L${xs.slice().reverse().map((X) => P(i, X, h1 - 0.55)).join(" L")} Z" fill="#4a3a2a" opacity=".28"/>`;
      /* Mauerkrone (Sandstein), oben angestrahlt */
      k += `<path d="M${xs.map((X) => P(i, X, h1 + 0.25)).join(" L")} L${xs.slice().reverse().map((X) => P(i, X, h1 - 0.1)).join(" L")} Z" fill="#fbf3e0"/>`;
    }
  }
  /* Abendwärme über den Terrassen */
  S.teil({ id: "terrasse", de: "die Terrasse", syl: "ter-RAS-se", it: "la terrazza", itSyl: "ter-RAZ-za", en: "terrace", x: 0, y: 0, kunst: k,
    tipp: "Der Hang hat sechs Terrassen. Früher wuchs hier Wein für den König — daher der Name „Weinberg“.",
    zoom: { x: 236, y: 140, w: 84, h: 56 } });
  const i = 1, s = 1;
  const Xn = s * (TREPPE + 1.2 + (6 + 0.5) * ABST), D = wandD(i, Xn), u = sk(D);
  terrUnter.push({ id: "nische", de: "die Nische", syl: "NI-sche", it: "la nicchia", itSyl: "NIC-chia", en: "niche", x: r(xG(D, Xn)), y: r(yG(D, TH * i + 0.25)),
    kunst: flaeche(-0.75 * u, -(TH - 0.6) * u, 1.5 * u, (TH - 0.6) * u, 0.5), tipp: "168 Nischen sind verglast. Dahinter ist es warm: Dort wachsen Feigen." });
  const Xa = s * (TREPPE + 1.2 + 6 * ABST), Da = wandD(1, Xa), ua = sk(Da);
  terrUnter.push({ id: "weintraube", de: "die Weintraube", syl: "WEIN-trau-be", it: "il grappolo d'uva", itSyl: "GRAP-po-lo DU-va", en: "bunch of grapes", x: r(xG(Da, Xa)), y: r(yG(Da, TH + TH * 0.45)),
    kunst: flaeche(-0.7 * ua, -0.7 * ua, 1.4 * ua, 1.4 * ua, 0.5), tipp: "An den Mauern wächst Wein am Spalier. Im Herbst sind die Trauben reif." });
}
S.teile[S.teile.length - 1].unter = terrUnter;

/* =====================================================================
   MENSCHEN (einmal in <defs>, gezeichnet über <use>)
   ===================================================================== */
const FIG = {};
/* sehr kleine Figuren: Verläufe durch ihre Mittelfarbe ersetzen (spart Platz, sieht man nicht) */
const flach = (svg) => {
  const farbe = {};
  svg = svg.replace(/<(linear|radial)Gradient id="([^"]+)"[^>]*>(.*?)<\/(linear|radial)Gradient>/g, (a, t, id, stops) => {
    const c = [...stops.matchAll(/stop-color="([^"]+)"/g)].map((m) => m[1]);
    farbe[id] = c[Math.floor(c.length / 2)] || "#888";
    return "";
  });
  return svg.replace(/url\(#([^)]+)\)/g, (a, id) => farbe[id] || a);
};
const mensch = (name, spec, groesse, D, X, Q = 1, min = 0.35, einfach = false) => {
  const m = B.mensch(spec, 100);
  S.def(`<g id="${S.id("fig" + name)}">${kompakt(einfach ? flach(m.svg) : m.svg, Q, min)}</g>`);
  const f = { m, D, X, x: r(xG(D, X)), y: r(yG(D)), u: sk(D), s: groesse * sk(D) / 100 };
  f.p = (q) => ({ x: f.x + q.x * m.k * f.s, y: f.y + q.y * m.k * f.s });
  f.svg = `<use href="#${S.id("fig" + name)}" transform="scale(${f.s.toFixed(5)})"/>`;
  FIG[name] = f;
  return f;
};
/* DER GÄRTNER: zieht mit dem Rechen Laub zusammen (Fäuste am Stiel) */
const G = mensch("G", { id: "pdm_gaert", geschlecht: "m", blick: -62, frisur: "kurz", haarfarbe: "grau", haut: "hell",
  pose: { kipp: 8, lende: 4, brust: 4, nacken: 10, kopf: 6, schulterL: { vor: 34, seit: 8, dreh: 10 }, ellbogenL: 46, unterarmL: 40, handL: 0, fingerL: 0.95,
    schulterR: { vor: 20, seit: 10, dreh: 10 }, ellbogenR: 28, unterarmR: 40, handR: 0, fingerR: 0.95,
    huefteL: { vor: 18, seit: 4, dreh: -6 }, knieL: 14, fussL: 4, huefteR: { vor: -12, seit: 4, dreh: -6 }, knieR: 6, fussR: 0 },
  kleidung: { oberteil: { stueck: "pullover", farbe: "gruen_d" }, unterteil: { stueck: "arbeitshose" }, schuhe: { stueck: "stiefel" }, kopf: { stueck: "kappe", farbe: "gruen_d" } } }, 1.78, 31, 5.4, 2, 0.5);
bodenSchatten(31, 5.4, 0.5, 1.78, 0.26);
/* DIE TOURISTIN fotografiert mit dem Handy (von hinten, etwas schräg) */
const T = mensch("T", { id: "pdm_tour", geschlecht: "w", blick: 160, frisur: "zopf", haarfarbe: "blond", haut: "hell",
  pose: { lende: 1, brust: -2, nacken: 2, kopf: -6, schulterL: { vor: 62, seit: 12, dreh: 10 }, ellbogenL: 96, unterarmL: 30, handL: 4, fingerL: 0.5,
    schulterR: { vor: 64, seit: 14, dreh: 10 }, ellbogenR: 92, unterarmR: 30, handR: 4, fingerR: 0.5,
    huefteL: { vor: 4, seit: 3, dreh: -6 }, knieL: 4, fussL: 0, huefteR: { vor: -6, seit: 4, dreh: -8 }, knieR: 10, fussR: 6 },
  kleidung: { oberteil: { stueck: "pullover", farbe: "creme" }, jacke: { stueck: "jacke", farbe: "rot" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" }, zubehoer: { stueck: "tasche", farbe: "braun" } } }, 1.68, 22, -2.0);
bodenSchatten(22, -2.0, 0.45, 1.68, 0.26);
/* DER TOURIST zeigt mit gestrecktem Arm schräg hinauf zum Schloss */
const M2 = mensch("M2", { id: "pdm_tourist", geschlecht: "m", blick: 196, frisur: "kurz", haarfarbe: "dunkelbraun", haut: "mittel",
  pose: { lende: 1, brust: -4, nacken: -12, kopf: -10, kopfDreh: 12, schulterL: { vor: 3, seit: 7 }, ellbogenL: 12, unterarmL: 10, handL: 6, fingerL: 0.38,
    schulterR: { vor: 34, seit: 122, dreh: 0 }, ellbogenR: 4, unterarmR: 0, handR: 4, fingerR: "zeigen",
    huefteL: { vor: 5, seit: 3, dreh: -6 }, knieL: 5, fussL: 0, huefteR: { vor: -3, seit: 2.5, dreh: -6 }, knieR: 2, fussR: 0 },
  kleidung: { oberteil: { stueck: "tshirt", farbe: "hellblau" }, jacke: { stueck: "jacke", farbe: "gruen_d" }, unterteil: { stueck: "hose", farbe: "beige" }, schuhe: { stueck: "halbschuh" }, zubehoer: { stueck: "rucksack", farbe: "orange" } } }, 1.82, 25, -0.6);
bodenSchatten(25, -0.6, 0.5, 1.82, 0.26);
/* DAS KIND geht zur Treppe, die Kartoffel in der ausgestreckten Hand (Dreiviertel von hinten) */
const K = mensch("K", { id: "pdm_kind", alter: "kind", geschlecht: "m", blick: 148, frisur: "kurz", haarfarbe: "hellblond", haut: "hell",
  pose: { lende: 2, brust: -2, nacken: 4, kopf: 0, schulterL: { vor: -14, seit: 8 }, ellbogenL: 14, unterarmL: 10, handL: 6, fingerL: 0.38,
    schulterR: { vor: 34, seit: 46, dreh: 0 }, ellbogenR: 22, unterarmR: 80, handR: 0, fingerR: 0.75,
    huefteL: { vor: 18, seit: 3, dreh: -4 }, knieL: 10, fussL: 4, huefteR: { vor: -14, seit: 3, dreh: -4 }, knieR: 18, fussR: 14 },
  kleidung: { oberteil: { stueck: "pullover", farbe: "gelb" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" }, kopf: { stueck: "muetze", farbe: "blau" } } }, 1.22, 19, 1.3);
bodenSchatten(19, 1.3, 0.4, 1.22, 0.26);
/* DAS PAAR spaziert um die Fontäne (mittlere Tiefe) */
const P1 = mensch("P1", { id: "pdm_p1", geschlecht: "w", blick: 120, frisur: "lang", haarfarbe: "dunkelbraun", haut: "hell", pose: "gehen",
  kleidung: { oberteil: { stueck: "pullover", farbe: "rosa" }, jacke: { stueck: "mantel", farbe: "beige" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "stiefel" } } }, 1.66, 50, -6.4, 4, 1, true);
const P2 = mensch("P2", { id: "pdm_p2", geschlecht: "m", blick: 118, frisur: "glatze", haarfarbe: "grau", haut: "hell", pose: "gehen",
  kleidung: { oberteil: { stueck: "pullover", farbe: "blau" }, jacke: { stueck: "jacke", farbe: "braun" }, unterteil: { stueck: "hose", farbe: "grau" }, schuhe: { stueck: "halbschuh" } } }, 1.8, 50.6, -7.2, 4, 1, true);
bodenSchatten(50, -6.4, 0.45, 1.66, 0.22);
bodenSchatten(50.6, -7.2, 0.5, 1.8, 0.22);

/* =====================================================================
   4 — DIE TREPPE (Freitreppe, 132 Stufen in sechs Läufen, Sandstein)
   ===================================================================== */
{
  let k = "";
  const Q = (D, X, h) => `${r(xG(D, X))} ${r(yG(D, h))}`;
  for (let i = 5; i >= 0; i--) {
    const D0 = TD(i) - 4, h0 = TH * i, N = 22, st = TH / N, run = 8 / N;
    /* Wangen: links im Licht, rechts im Eigenschatten */
    for (const s of [-1, 1]) k += `<path d="M${Q(D0, s * (TREPPE + 0.45), h0)} L${Q(D0 + 8, s * (TREPPE + 0.45), h0 + TH + 0.35)} L${Q(D0 + 8, s * TREPPE, h0 + TH + 0.35)} L${Q(D0, s * TREPPE, h0)} Z" fill="${s < 0 ? "#efe3c6" : "#bba889"}"/>`;
    for (let j = 0; j < N; j++) {
      const D = D0 + j * run, ha = h0 + j * st, hb = ha + st;
      k += `<path d="M${Q(D, -TREPPE, ha)} L${Q(D, TREPPE, ha)} L${Q(D, TREPPE, hb)} L${Q(D, -TREPPE, hb)} Z" fill="${j % 2 ? "#dccdab" : "#d2c19e"}"/>`;
      if (hb < EYE) k += `<path d="M${Q(D, -TREPPE, hb)} L${Q(D, TREPPE, hb)} L${Q(D + run, TREPPE, hb)} L${Q(D + run, -TREPPE, hb)} Z" fill="#c1ae8a"/>`;
      else k += `<path d="M${Q(D, -TREPPE, hb)} L${Q(D, TREPPE, hb)}" stroke="#9e8a68" stroke-width=".22"/>`;
    }
    /* Podest am Ende jedes Laufs: dunklere Kante */
    k += `<path d="M${Q(D0 + 8, -TREPPE, h0 + TH)} L${Q(D0 + 8, TREPPE, h0 + TH)}" stroke="#8a7656" stroke-width=".7"/>`;
  }
  /* kleine Besucher auf der Treppe: dieselben Figuren, sehr fern */
  for (const [f, i, j, X, gr] of [["T", 1, 12, -1.6, 1.68], ["M2", 1, 12, -0.9, 1.82], ["K", 1, 11, 1.4, 1.22], ["P1", 3, 6, 1.9, 1.66], ["P2", 4, 16, -1.2, 1.8]]) {
    const D = TD(i) - 4 + j * 8 / 22, h = TH * i + (j + 1) * TH / 22;
    k += `<use href="#${S.id("fig" + f)}" transform="translate(${r(xG(D, X))} ${r(yG(D, h))}) scale(${(gr * sk(D) / 100).toFixed(5)})"/>`;
  }
  S.teil({ id: "treppe", de: "die Treppe", syl: "TREP-pe", it: "la scalinata", itSyl: "sca-li-NA-ta", en: "staircase", x: 0, y: 0, kunst: k,
    tipp: "132 Stufen führen vom Garten hinauf zum Schloss." });
}

/* =====================================================================
   5 — DER WEG (heller Kies) — Bodenfläche, Inhalt am Ende
   6 — DER RASEN (Parterre: Rasenstücke mit Buchskanten und Herbstastern)
   ===================================================================== */
const FD = 80, RB = 20, RS = 23.5, RING = 27.5;      /* Mitte der Fontäne, Becken, Figurenkreis, Platzrand */
const WEG = S.teil({ id: "weg", de: "der Weg", syl: "WEG", it: "il sentiero", itSyl: "sen-TIE-ro", en: "path", x: 0, y: 0, kunst: "",
  tipp: "Die Wege im Park sind aus hellem Kies. Er knirscht unter den Schuhen." });
{
  let k = "";
  const RASEN = S.lg("rasen", [[0, "#6f9442"], [1, "#4f7a2e"]]);
  const ringPt = (X) => FD - Math.sqrt(Math.max(0, RING * RING - X * X));
  const BLUMEN = (() => {
    const z = zufall(31);
    let t = "";
    for (let i = 0; i < 18; i++) t += `<circle cx="${r(z() * 6)}" cy="${r(z() * 3)}" r="${r(0.45 + z() * 0.35)}" fill="${["#b8435a", "#8c5aa8", "#d9a3c8", "#e8c34a", "#9a3a5a"][i % 5]}"/>`;
    S.def(`<pattern id="${S.id("blumen")}" patternUnits="userSpaceOnUse" width="6" height="3"><rect width="6" height="3" fill="#4f6f2e"/>${t}</pattern>`);
    return `url(#${S.id("blumen")})`;
  })();
  for (const s of [-1, 1]) {
    /* Rasenstück zwischen Hauptweg (|X| > 4,4) und dem runden Platz der Fontäne */
    const pts = [];
    for (let D = 17; D <= ringPt(4.4); D += 4) pts.push([s * 4.4, D]);
    for (let X = 4.4; X <= RING; X += 2) pts.push([s * X, ringPt(X)]);
    pts.push([s * 60, FD], [s * 60, 17]);
    k += `<path d="M${pts.map(([X, D]) => `${r(kl(xG(D, X)))} ${r(yG(D))}`).join(" L")} Z" fill="${RASEN}"/>`;
    /* Mähstreifen in die Tiefe */
    let st = "";
    for (const X of [7, 10, 13, 16]) st += `M${r(kl(xG(17, s * X)))} ${r(yG(17))} L${r(kl(xG(ringPt(X) - 1, s * X)))} ${r(yG(ringPt(X) - 1))} `;
    k += `<path d="${st}" stroke="#86a855" stroke-width="1.6" opacity=".35" fill="none"/>`;
    /* Blumenrabatte entlang des Weges und Buchskante */
    const rab = [];
    for (let D = 17; D <= ringPt(4.4) - 0.5; D += 4) rab.push([s * 4.5, D]);
    const rab2 = rab.map(([X, D]) => [X + s * 1.1, D]).reverse();
    k += `<path d="M${[...rab, ...rab2].map(([X, D]) => `${r(kl(xG(D, X)))} ${r(yG(D))}`).join(" L")} Z" fill="${BLUMEN}"/>`;
    const kante = [];
    for (let D = 17; D <= ringPt(4.4); D += 4) kante.push([s * 4.4, D]);
    for (let X = 4.4; X <= 14; X += 2) kante.push([s * X, ringPt(X)]);
    k += `<path d="M${kante.map(([X, D]) => `${r(kl(xG(D, X)))} ${r(yG(D, 0.15))}`).join(" L")}" stroke="#2f5524" stroke-width="1.2" fill="none" stroke-linejoin="round"/>`;
  }
  S.teil({ id: "rasen", de: "der Rasen", syl: "RA-sen", it: "il prato", itSyl: "PRA-to", en: "lawn", x: 0, y: 0, kunst: k,
    tipp: "Um die Fontäne liegen Rasenstücke mit Blumen. Ihr Rand ist aus kleinen Buchsbäumen." });
}

/* =====================================================================
   7 — DIE STATUEN (zwölf Marmorfiguren um die Fontäne; zehn sind zu sehen)
   ===================================================================== */
const statuen = [];
for (let a = 15; a < 360; a += 30) {
  const w = a * Math.PI / 180, X = RS * Math.sin(w), D = FD - RS * Math.cos(w), x = xG(D, X);
  if (x > 8 && x < 392) statuen.push({ a, X, D, x, y: yG(D), u: sk(D) });
}
statuen.sort((p, q) => q.D - p.D);
const SOCKEL = S.lg("sockel", [[0, "#faf7f0"], [0.5, "#dcd6ca"], [1, "#9c958a"]], 0, 0, 1, 0);
const MARMOR_S = S.lg("marmors", [[0, "#ffffff"], [0.5, "#eeebe4"], [0.8, "#c9c3b8"], [1, "#a39d92"]], 0, 0, 1, 0);
const FALTE = "#b3ad a2".replace(" ", "");
/* Gewandkörper der Göttinnen: Kontrapost (Standbein links im Bild, Hüfte hoch), Faltenbahnen */
const GEWAND = `<path d="M-.32 0 L-.3 -.5 Q-.32 -.95 -.3 -1.22 Q-.2 -1.38 -.19 -1.45 Q-.24 -1.66 -.25 -1.86 Q-.14 -1.93 -.05 -1.96 L.06 -1.96 Q.16 -1.93 .25 -1.84 Q.24 -1.64 .19 -1.46 Q.22 -1.32 .24 -1.14 Q.28 -.85 .27 -.55 Q.31 -.25 .37 -.03 L.35 0 Z" fill="${MARMOR_S}"/>` +
  `<path d="M.06 -1.12 Q.16 -.6 .12 -.02 L.2 -.02 Q.24 -.6 .14 -1.1 Z M-.12 -1.2 Q-.06 -.6 -.1 -.02 L-.04 -.02 Q.0 -.6 -.06 -1.2 Z" fill="${FALTE}" opacity=".7"/>` +
  `<path d="M.27 -.55 Q.31 -.25 .37 -.03 L.35 0 L.22 0 Q.22 -.4 .2 -.8 Q.24 -1.0 .24 -1.14 Z" fill="#9f998e" opacity=".55"/>` +
  `<path d="M-.19 -1.45 Q0 -1.52 .19 -1.46 M-.22 -1.7 Q0 -1.62 .21 -1.76" stroke="#bdb7ac" stroke-width=".03" fill="none"/>`;
const KOPF = (helm) => `<rect x="-.045" y="-2.04" width=".09" height=".11" fill="#e6e2da"/><ellipse cx=".015" cy="-2.14" rx=".1" ry=".125" fill="#f8f6f1"/>` +
  `<path d="M.06 -2.22 Q.12 -2.14 .07 -2.04 L.115 -2.1 Q.12 -2.2 .1 -2.24 Z" fill="#b9b3a8"/><path d="M-.04 -2.17 h.035 M.04 -2.17 h.03" stroke="#b9b3a8" stroke-width=".02"/>` +
  (helm ? `<path d="M-.11 -2.14 Q-.12 -2.3 .015 -2.31 Q.14 -2.3 .13 -2.14 Z" fill="#ece8e0"/><path d="M-.08 -2.29 Q.0 -2.48 .14 -2.4 Q.06 -2.36 .02 -2.3 Z" fill="#dcd7ce"/>`
    : `<path d="M-.09 -2.16 Q-.06 -2.3 .03 -2.29 Q.12 -2.28 .11 -2.16 Q.05 -2.23 -.09 -2.16 Z" fill="#dedad1"/><circle cx="-.06" cy="-2.27" r=".055" fill="#dedad1"/>`);
S.def(`<g id="${S.id("diana")}">${GEWAND}` +
  /* rechter Arm greift zum Köcher über der Schulter, linker hält den Bogen */
  `<path d="M-.32 -1.95 L-.18 -1.5" stroke="#cfc9be" stroke-width=".07" stroke-linecap="round"/>` +
  `<path d="M-.25 -1.84 Q-.38 -1.6 -.32 -1.5 Q-.24 -1.66 -.24 -1.9" stroke="#f6f4ef" stroke-width=".09" fill="none" stroke-linecap="round"/>` +
  `<path d="M.24 -1.84 Q.33 -1.6 .34 -1.4 Q.36 -1.25 .37 -1.15" stroke="#d6d1c7" stroke-width=".09" fill="none" stroke-linecap="round"/>` +
  `<path d="M.42 -1.78 Q.6 -1.2 .38 -.62" stroke="#c9c3b8" stroke-width=".04" fill="none"/><path d="M.42 -1.78 L.38 -.62" stroke="#ddd8cf" stroke-width=".01"/>` +
  KOPF(false) + `</g>`);
S.def(`<g id="${S.id("minerva")}">${GEWAND}` +
  `<ellipse cx=".33" cy="-1.05" rx=".2" ry=".34" fill="${MARMOR_S}"/><ellipse cx=".33" cy="-1.05" rx=".14" ry=".26" fill="none" stroke="#b9b3a8" stroke-width=".02"/>` +
  `<path d="M-.36 -2.5 L-.32 -.02" stroke="#d6d1c7" stroke-width=".035"/><path d="M-.25 -1.84 Q-.38 -1.95 -.36 -2.1" stroke="#f6f4ef" stroke-width=".09" fill="none" stroke-linecap="round"/>` +
  KOPF(true) + `</g>`);
S.def(`<g id="${S.id("juno")}">${GEWAND}` +
  `<path d="M-.25 -1.84 Q-.36 -1.62 -.33 -1.46 Q-.2 -1.5 -.05 -1.6" stroke="#f6f4ef" stroke-width=".09" fill="none" stroke-linecap="round"/>` +
  `<path d="M.24 -1.84 Q.34 -1.62 .33 -1.42 Q.36 -1.25 .36 -1.12" stroke="#d6d1c7" stroke-width=".09" fill="none" stroke-linecap="round"/>` +
  `<path d="M-.06 -2.25 L.015 -2.36 L.09 -2.25 Z" fill="#e6e2da"/>` + KOPF(false) + `</g>`);
S.def(`<g id="${S.id("mars")}">` +
  `<path d="M-.16 -1.12 L-.13 -.62 L-.12 -.05 L-.02 -.05 L-.02 -.62 L.0 -1.1 Z" fill="${MARMOR_S}"/>` +
  `<path d="M.04 -1.1 L.14 -.64 L.17 -.1 L.24 -.03 L.3 -.05 L.24 -.14 L.24 -.62 L.17 -1.1 Z" fill="#d2cdc3"/>` +
  `<path d="M-.19 -1.12 Q-.2 -1.4 -.22 -1.55 Q-.29 -1.75 -.3 -1.86 L-.08 -1.95 L.08 -1.95 L.3 -1.86 Q.29 -1.72 .22 -1.55 Q.2 -1.38 .2 -1.12 Z" fill="${MARMOR_S}"/>` +
  `<path d="M-.32 -1.88 Q-.36 -1.4 -.28 -.7 L-.08 -.72 Q.05 -.95 .22 -1.08 Q.12 -1.4 -.02 -1.6 Q-.12 -1.78 -.18 -1.94 Z" fill="#f1eee8"/>` +
  `<path d="M-.26 -1.7 Q-.22 -1.2 -.2 -.78 M-.14 -1.6 Q-.1 -1.2 -.12 -.76" stroke="#bdb7ac" stroke-width=".03" fill="none"/>` +
  `<path d="M.2 -1.12 Q.2 -1.38 .22 -1.55 Q.29 -1.72 .3 -1.86 L.22 -1.86 Q.14 -1.5 .12 -1.12 Z" fill="#a39d92" opacity=".5"/>` +
  `<path d="M.27 -1.86 Q.38 -2.05 .4 -2.3" stroke="#e8e4dc" stroke-width=".1" fill="none" stroke-linecap="round"/><path d="M.42 -2.7 L.38 -.2" stroke="#d8d3c9" stroke-width=".035"/><path d="M.42 -2.82 L.45 -2.68 L.39 -2.68 Z" fill="#d8d3c9"/>` +
  `<ellipse cx="-.36" cy="-1.3" rx=".2" ry=".22" fill="${MARMOR_S}"/><circle cx="-.36" cy="-1.3" r=".05" fill="#c9c3b8"/>` +
  KOPF(true) + `</g>`);
/* sitzend: so sind Venus und Merkur von Pigalle gearbeitet */
S.def(`<g id="${S.id("sitzend")}">` +
  `<path d="M-.4 0 L-.42 -.5 Q-.2 -.6 .4 -.52 L.42 0 Z" fill="#d8d3c9"/>` +
  `<path d="M-.12 -.5 L-.16 -.05 L-.06 -.05 L-.02 -.5 Z M.1 -.5 L.12 -.05 L.22 -.05 L.2 -.5 Z" fill="${MARMOR_S}"/>` +
  `<path d="M-.26 -.52 Q-.3 -.62 -.22 -.7 Q-.24 -.95 -.2 -1.12 Q-.25 -1.28 -.24 -1.4 L-.06 -1.48 L.06 -1.48 L.24 -1.38 Q.22 -1.22 .18 -1.1 Q.22 -.9 .22 -.7 Q.32 -.62 .3 -.52 Z" fill="${MARMOR_S}"/>` +
  `<path d="M-.3 -.6 Q0 -.48 .32 -.58 L.3 -.48 Q0 -.4 -.3 -.5 Z" fill="#e6e2da"/>` +
  `<path d="M.22 -1.38 Q.36 -1.5 .3 -1.68" stroke="#e8e4dc" stroke-width=".085" fill="none" stroke-linecap="round"/><path d="M-.22 -1.36 Q-.32 -1.1 -.18 -.86" stroke="#f6f4ef" stroke-width=".085" fill="none" stroke-linecap="round"/>` +
  `<g transform="translate(0 .5)">${KOPF(false)}</g></g>`);
const figurArt = { 15: "diana", 345: "mars", 45: "minerva", 315: "juno", 75: "mars", 285: "diana", 105: "juno", 255: "minerva", 135: "diana", 225: "mars", 165: "sitzend", 195: "sitzend" };
const figur = (u, a) => {
  let g = `<path d="M-.78 0 L-.78 -.18 L-.68 -.24 L-.66 -.32 L-.58 -.36 L-.58 -1.3 L-.66 -1.34 L-.7 -1.44 L-.8 -1.5 L-.8 -1.6 L.8 -1.6 L.8 -1.5 L.7 -1.44 L.66 -1.34 L.58 -1.3 L.58 -.36 L.66 -.32 L.68 -.24 L.78 -.18 L.78 0 Z" fill="${SOCKEL}"/>`;
  g += `<rect x="-.42" y="-1.18" width=".84" height=".66" fill="none" stroke="#bfb8ab" stroke-width=".03"/><rect x="-.58" y="-1.3" width="1.16" height=".09" fill="#8f897e" opacity=".35"/><path d="M-.8 -1.6 H0" stroke="#fff" stroke-width=".04"/>`;
  const art = figurArt[a] || "juno";
  g += `<use href="#${S.id(art)}" transform="translate(0 -1.6)${a > 180 && art !== "sitzend" ? " scale(-1 1)" : ""}"/>`;
  return `<g transform="scale(${u.toFixed(4)})">${g}</g>`;
};
{
  let k = "";
  for (const p of statuen) {
    bodenSchatten(p.D, p.X, 1.4, 3.9, 0.22);
    k += `<g transform="translate(${r(p.x)} ${r(p.y)})">${figur(p.u, p.a)}</g>`;
  }
  const vorne = statuen.filter((p) => p.a === 15)[0];
  S.teil({ id: "statue", de: "die Statue", syl: "STA-tu-e", it: "la statua", itSyl: "STA-tua", en: "statue", x: 0, y: 0, kunst: k,
    tipp: "Zwölf Statuen aus Marmor stehen um die Fontäne: acht römische Götter und die vier Elemente.",
    zoom: { x: r(vorne.x - 42), y: r(vorne.y - 54), w: 84, h: 56 },
    unter: [
      { id: "goettin", de: "die Göttin", syl: "GÖT-tin", it: "la dea", itSyl: "DE-a", en: "goddess", x: r(vorne.x), y: r(vorne.y - 1.6 * vorne.u),
        kunst: flaeche(-0.5 * vorne.u, -2.4 * vorne.u, 1.1 * vorne.u, 2.4 * vorne.u, 0.6), tipp: "Diana ist die Göttin der Jagd. Man erkennt sie am Bogen." },
      { id: "sockel", de: "der Sockel", syl: "SO-ckel", it: "il piedistallo", itSyl: "pie-di-STAL-lo", en: "pedestal", x: r(vorne.x), y: r(vorne.y),
        kunst: flaeche(-0.8 * vorne.u, -1.6 * vorne.u, 1.6 * vorne.u, 1.6 * vorne.u, 0.6) },
    ] });
}

/* =====================================================================
   8 — DIE FONTÄNE: rundes Becken, Wassersäule mit Krone, Gischt
   ===================================================================== */
{
  let k = "";
  const ring = (rad, h, n = 72) => { const p = []; for (let i = 0; i <= n; i++) { const w = i / n * Math.PI * 2, X = rad * Math.sin(w), D = FD - rad * Math.cos(w); p.push(`${r(xG(D, X))} ${r(yG(D, h))}`); } return "M" + p.join(" L") + " Z"; };
  /* Wasser: Himmel und Terrassen spiegeln sich, Wellenringe */
  k += `<path d="${ring(RB, 0.3)}" fill="${S.lg("wasser", [[0, "#7d9a6e"], [0.35, "#a9c0cc"], [1, "#6d8ea4"]])}"/>`;
  const yb = yG(FD, 0.3), u = sk(FD), H = 8.4 * u;
  for (const rr of [5, 9, 14]) k += `<path d="${ring(rr, 0.32, 40)}" fill="none" stroke="#eef5f8" stroke-width=".3" opacity="${r(0.7 - rr * 0.03)}"/>`;
  /* Spiegelung des Strahls */
  k += `<path d="M${CX - 2} ${r(yb)} L${CX + 2} ${r(yb)} L${CX + 1} ${r(yb + 2.4)} L${CX - 1} ${r(yb + 2.4)} Z" fill="#f4f8fa" opacity=".6"/>`;
  /* Beckenrand aus hellem Stein: hinten als feine Linie, vorn die Außenseite */
  k += `<path d="${ring(RB, 0.55)}" fill="none" stroke="#f4eee2" stroke-width=".7"/>`;
  const vorn = [], vorn2 = [];
  for (let i = 0; i <= 40; i++) { const w = Math.PI / 2 + i / 40 * Math.PI, X = RB * Math.sin(w), D = FD - RB * Math.cos(w); vorn.push(`${r(xG(D, X))} ${r(yG(D, 0.55))}`); vorn2.push(`${r(xG(D, X))} ${r(yG(D, 0))}`); }
  k += `<path d="M${vorn.join(" L")} L${vorn2.reverse().join(" L")} Z" fill="${S.lg("rand", [[0, "#f6f0e2"], [1, "#b2a690"]])}"/>`;
  /* die Wassersäule: heller Kern, versetzte Stränge, blau-graue Schattenseite rechts */
  k += `<g filter="url(#${S.id("gischt")})">`;
  k += `<path d="M${CX - 3.2} ${r(yb)} Q${CX - 2} ${r(yb - H * 0.5)} ${CX - 1.3} ${r(yb - H)} L${CX + 1.6} ${r(yb - H)} Q${CX + 2.4} ${r(yb - H * 0.5)} ${CX + 3.6} ${r(yb)} Z" fill="#dfe8ee" opacity=".55"/>`;
  k += `<path d="M${CX - 1.7} ${r(yb)} Q${CX - 1} ${r(yb - H * 0.55)} ${CX - 0.6} ${r(yb - H - 1)} L${CX + 0.9} ${r(yb - H - 1)} Q${CX + 1.3} ${r(yb - H * 0.55)} ${CX + 2} ${r(yb)} Z" fill="${S.lg("strahl", [[0, "#ffffff"], [0.55, "#f4f8fb"], [0.75, "#b9c9d6"], [1, "#8ea3b4"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${CX - 1} ${r(yb - 2)} Q${CX - 0.7} ${r(yb - H * 0.5)} ${CX - 0.3} ${r(yb - H + 2)}" stroke="#ffffff" stroke-width=".6" fill="none"/>`;
  /* Krone: oben fächert der Strahl auf und fällt als Tropfenvorhang zurück */
  k += `<path d="M${CX - 0.8} ${r(yb - H - 0.6)} Q${CX - 5} ${r(yb - H - 4.2)} ${CX - 8.6} ${r(yb - H + 3)} Q${CX - 10.8} ${r(yb - H * 0.5)} ${CX - 11.6} ${r(yb - 1)} L${CX - 9.2} ${r(yb - 1)} Q${CX - 8.4} ${r(yb - H * 0.5)} ${CX - 6.2} ${r(yb - H + 4.4)} Q${CX - 3.4} ${r(yb - H - 1)} ${CX - 0.5} ${r(yb - H + 1.4)} Z" fill="#ffffff" opacity=".75"/>`;
  k += `<path d="M${CX + 1} ${r(yb - H - 0.6)} Q${CX + 5.2} ${r(yb - H - 4.2)} ${CX + 8.8} ${r(yb - H + 3)} Q${CX + 11} ${r(yb - H * 0.5)} ${CX + 11.8} ${r(yb - 1)} L${CX + 9.4} ${r(yb - 1)} Q${CX + 8.6} ${r(yb - H * 0.5)} ${CX + 6.4} ${r(yb - H + 4.4)} Q${CX + 3.6} ${r(yb - H - 1)} ${CX + 0.7} ${r(yb - H + 1.4)} Z" fill="#d2dee6" opacity=".75"/>`;
  k += `<ellipse cx="${CX}" cy="${r(yb - H - 1.4)}" rx="5" ry="2.6" fill="#ffffff" opacity=".9"/>`;
  for (const sx of [-1, 1]) for (let i = 0; i < 6; i++) k += `<path d="M${r(CX + sx * (2 + i * 1.5))} ${r(yb - H + i * 1.2)} q${r(sx * 1.2)} ${r(H * 0.3)} ${r(sx * (1.6 + i * 0.25))} ${r(H - i * 1.2 - 2)}" stroke="#ffffff" stroke-width=".3" fill="none" opacity=".6"/>`;
  k += `<ellipse cx="${CX}" cy="${r(yb - 1.2)}" rx="13" ry="2.6" fill="#ffffff" opacity=".85"/>`;
  k += `<ellipse cx="${CX}" cy="${r(yb - 3)}" rx="7" ry="4" fill="#ffffff" opacity=".45"/>`;
  k += `</g>`;
  /* fallende Tropfen und Glitzern im Gegenlicht oben links */
  let tr = "";
  for (let i = 0; i < 70; i++) { const t = rnd(), sx = rnd() < 0.5 ? -1 : 1, x = CX + sx * (1 + Math.sqrt(t) * 10.5) + (rnd() - 0.5) * 1.2, y = yb - H * (1 - t * t) * 1.02 + rnd() * 3; tr += `<ellipse cx="${r(x)}" cy="${r(y)}" rx=".22" ry="${r(0.3 + rnd() * 0.5)}"/>`; }
  k += `<g fill="#ffffff" opacity=".85">${tr}</g>`;
  for (const [x, y, s2] of [[-3.2, -H - 2.2, 1.3], [-6.6, -H + 1, 1], [-1.4, -H + 6, 0.8]]) k += `<path d="M${r(CX + x - s2)} ${r(yb + y)} H${r(CX + x + s2)} M${r(CX + x)} ${r(yb + y - s2)} V${r(yb + y + s2)}" stroke="#fffbe6" stroke-width=".25"/>`;
  /* die Statuen vor dem Becken bleiben vorn: Becken dort ausschneiden */
  let loch = "";
  for (const p of statuen) if (p.D < FD - Math.sqrt(Math.max(0, RB * RB - p.X * p.X)) + 1.5) loch += ` M${r(p.x - 0.9 * p.u)} ${r(p.y + 1)} L${r(p.x + 0.9 * p.u)} ${r(p.y + 1)} L${r(p.x + 0.9 * p.u)} ${r(p.y - 4.4 * p.u)} L${r(p.x - 0.9 * p.u)} ${r(p.y - 4.4 * p.u)} Z`;
  S.def(`<clipPath id="${S.id("vorstatue")}"><path clip-rule="evenodd" d="M0 0 H400 V260 H0 Z${loch}"/></clipPath>`);
  S.teil({ id: "fontaene", de: "die Fontäne", syl: "fon-TÄ-ne", it: "la fontana", itSyl: "fon-TA-na", en: "fountain", x: 0, y: 0, kunst: `<g clip-path="url(#${S.id("vorstatue")})">${k}</g>`,
    tipp: "Die Große Fontäne springt bis zu 18 Meter hoch. Zur Zeit von Friedrich dem Großen funktionierte sie noch nicht.",
    zoom: { x: CX - 66, y: r(yb - H - 9), w: 132, h: 88 },
    unter: [
      { id: "strahl", de: "der Strahl", syl: "STRAHL", it: "il getto", itSyl: "GET-to", en: "jet", x: CX, y: r(yb - 3),
        kunst: flaeche(-2.5, -H + 2, 5, H - 2, 0.5), tipp: "Der Strahl fällt oben auseinander und regnet zurück ins Becken." },
      { id: "becken", de: "das Becken", syl: "BE-cken", it: "la vasca", itSyl: "VAS-ca", en: "basin", x: CX - 40, y: r(yG(FD - RB)),
        kunst: flaeche(-24, -6, 30, 7, 0.5), tipp: "Das runde Becken hat Ludwig Persius 1841 gebaut." },
    ] });
}

/* =====================================================================
   9 — DIE ORANGENBÄUME in grünen Holzkübeln (Reihen am Platzrand)
   ===================================================================== */
const ORANGEN = [];
for (const s of [-1, 1]) for (const D of [62, 54]) ORANGEN.push({ X: s * (D < 58 ? 11.2 : 12.0), D });
ORANGEN.sort((a, b) => b.D - a.D);
let kuebelUnter = null;
const KUEBEL = S.lg("kuebel", [[0, "#6d9c74"], [0.45, "#3f6e48"], [1, "#22402b"]], 0, 0, 1, 0);
const ORKRONE = S.rg("orkrone", [[0, "#8fbf5e"], [0.55, "#4a7a33"], [1, "#24461c"]], 0.32, 0.28, 0.78);
{
  let k = "";
  for (const o of ORANGEN) {
    const u = sk(o.D), x = xG(o.D, o.X), y = yG(o.D);
    bodenSchatten(o.D, o.X, 1.1, 3.4, 0.24);
    let g = "";
    g += `<path d="M-.5 0 L-.55 -.85 L.55 -.85 L.5 0 Z" fill="${KUEBEL}"/>`;
    g += `<path d="M-.5 -.28 H.5 M-.53 -.56 H.53" stroke="#203a28" stroke-width=".04"/>`;
    g += `<rect x="-.6" y="-.92" width=".12" height=".92" fill="#f2ede0"/><rect x=".48" y="-.92" width=".12" height=".92" fill="#b8b09c"/>`;
    g += `<circle cx="-.54" cy="-.98" r=".08" fill="#f2ede0"/><circle cx=".54" cy="-.98" r=".08" fill="#b8b09c"/>`;
    g += `<rect x="-.05" y="-1.9" width=".1" height="1.05" fill="#6b5236"/>`;
    g += `<circle cx="0" cy="-2.55" r=".78" fill="${ORKRONE}"/>`;
    const z = zufall(Math.round(o.D * 7 + o.X));
    for (let i = 0; i < 9; i++) { const a = z() * 6.28, d = Math.sqrt(z()) * 0.62; g += `<circle cx="${r(Math.cos(a) * d)}" cy="${r(-2.55 + Math.sin(a) * d)}" r=".075" fill="${Math.cos(a) < 0 ? "#f7a832" : "#d4781a"}"/>`; }
    k += `<g transform="translate(${r(x)} ${r(y)}) scale(${u.toFixed(4)})">${g}</g>`;
  }
  const o = ORANGEN.filter((q) => q.D === 54 && q.X < 0)[0], u = sk(o.D);
  kuebelUnter = { x: r(xG(o.D, o.X)), y: r(yG(o.D)), u };
  S.teil({ id: "orangenbaum", de: "der Orangenbaum", syl: "o-RAN-gen-baum", it: "l'arancio", itSyl: "a-RAN-cio", en: "orange tree", x: 0, y: 0, kunst: k,
    tipp: "Im Sommer stehen die Orangenbäume draußen im Park. Im Winter kommen sie in die Orangerie.",
    zoom: { x: r(Math.max(0, kuebelUnter.x - 33)), y: r(kuebelUnter.y - 44), w: 66, h: 44 },
    unter: [{ id: "kuebel", de: "der Kübel", syl: "KÜ-bel", it: "il vaso", itSyl: "VA-so", en: "tub", x: kuebelUnter.x, y: kuebelUnter.y,
      kunst: flaeche(-0.62 * u, -1 * u, 1.24 * u, 1 * u, 0.5), tipp: "Die Kübel sind aus Holz. So kann man die Bäume tragen." }] });
}

/* =====================================================================
   10 — DIE BANK am Platzrand (links)
   ===================================================================== */
{
  const D = 57, X = -10.4, u = sk(D), x = xG(D, X), y = yG(D);
  bodenSchatten(D, X, 1.8, 0.9, 0.24);
  let g = `<path d="M-.85 0 L-.8 -.42 M.85 0 L.8 -.42 M-.8 -.42 L-.82 -.88 M.8 -.42 L.82 -.88" stroke="#2a2d31" stroke-width=".07"/>`;
  for (let i = 0; i < 3; i++) g += `<rect x="-.95" y="${r(-0.46 - i * 0.07)}" width="1.9" height=".05" fill="${i ? "#f2eee6" : "#d8d2c4"}"/>`;
  for (let i = 0; i < 3; i++) g += `<rect x="-.9" y="${r(-0.86 + i * 0.12)}" width="1.8" height=".08" fill="#ece7dc"/>`;
  g += `<path d="M-.4 -.53 l.12 -.05 l.06 .07 Z M.3 -.52 l.1 -.06 l.05 .08 Z" fill="#c98a2a"/>`;
  S.teil({ id: "bank", de: "die Bank", syl: "BANK", it: "la panchina", itSyl: "pan-CHI-na", en: "bench", x: r(x), y: r(y), steht: true,
    kunst: `<g transform="scale(${u.toFixed(4)})">${g}</g>`, tipp: "Auf der Bank kann man sich ausruhen und auf die Fontäne schauen." });
}
S.teil({ id: "paar", de: "das Paar", syl: "PAAR", it: "la coppia", itSyl: "COP-pia", en: "couple", x: P1.x, y: P1.y,
  kunst: P1.svg + `<g transform="translate(${r(P2.x - P1.x)} ${r(P2.y - P1.y)})">${P2.svg}</g>`, tipp: "Das Paar spaziert um die Fontäne." });

/* =====================================================================
   11 — WEGWEISER, SCHUBKARRE, GÄRTNER, TOURISTIN, HANDY, TOURIST, KIND, KARTOFFEL
   ===================================================================== */
const WW = { D: 24, X: -4.7 };
const SK = { D: 29, X: 6.9 };
bodenSchatten(WW.D, WW.X, 0.12, 2.7, 0.2);
bodenSchatten(SK.D, SK.X, 1.3, 0.8, 0.22);
{
  const u = sk(WW.D);
  let g = `<rect x="-.05" y="-2.7" width=".1" height="2.7" fill="${S.lg("pfosten", [[0, "#6e7a73"], [1, "#2f3833"]], 0, 0, 1, 0)}"/>`;
  g += `<circle cx="0" cy="-2.74" r=".07" fill="#2f3833"/>`;
  /* wir schauen nach Norden: Westen zeigt nach links, Osten (Stadt) nach rechts */
  const schilder = [[-2.5, -1, "Neues Palais 1,7 km"], [-2.18, -1, "Orangerieschloss 0,7 km"], [-1.86, 1, "Brandenburger Tor 1,3 km"], [-1.54, 1, "Holländisches Viertel 2,3 km"]];
  for (const [y, s, t] of schilder) {
    const w = 1.62;
    const p = s > 0 ? `M.06 ${y} L${w} ${y} L${w + 0.14} ${r(y + 0.13)} L${w} ${r(y + 0.26)} L.06 ${r(y + 0.26)} Z` : `M-.06 ${y} L${-w} ${y} L${-w - 0.14} ${r(y + 0.13)} L${-w} ${r(y + 0.26)} L-.06 ${r(y + 0.26)} Z`;
    g += `<path d="${p}" fill="#f7f5ee" stroke="#2f5a3c" stroke-width=".025"/><path d="${p}" fill="#3a3550" opacity=".08" transform="translate(.02 .03)"/>`;
    g += `<text x="${s > 0 ? 0.13 : -0.13}" y="${r(y + 0.185)}" font-size=".108" ${s > 0 ? "" : `text-anchor="end" `}fill="#2f5a3c" font-family="Arial,sans-serif" font-weight="bold">${t}</text>`;
  }
  S.teil({ id: "wegweiser", de: "der Wegweiser", syl: "WEG-wei-ser", it: "il cartello stradale", itSyl: "car-TEL-lo stra-DA-le", en: "signpost", x: r(xG(WW.D, WW.X)), y: r(yG(WW.D)), steht: true,
    kunst: `<g transform="scale(${u.toFixed(4)})">${g}</g>`, tipp: "Potsdam hat auch ein Brandenburger Tor. Es ist älter als das Tor in Berlin." });
}
{
  /* Schubkarre mit einem Haufen Herbstlaub */
  const u = sk(SK.D);
  let g = `<circle cx="-.62" cy="-.2" r=".2" fill="#2b2b2b"/><circle cx="-.62" cy="-.2" r=".08" fill="#9aa1a6"/>`;
  g += `<path d="M-.7 -.32 L.55 -.42 L.9 -.05 M.05 -.4 L.15 0 M.55 -.42 L.6 0" stroke="#3b4044" stroke-width=".05" fill="none"/>`;
  g += `<path d="M-.75 -.72 L.6 -.78 L.45 -.36 L-.55 -.3 Z" fill="${S.lg("wanne", [[0, "#6aa776"], [1, "#2f5e3a"]])}"/>`;
  g += `<path d="M-.72 -.72 Q-.5 -1.02 -.1 -1.04 Q.3 -1.08 .58 -.78 Z" fill="#9a6a24"/>`;
  const z = zufall(9);
  for (let i = 0; i < 22; i++) { const x = -0.65 + z() * 1.2, y = -0.76 - z() * 0.26 * (1 - Math.abs(x) * 0.9); g += `<path d="M${r(x)} ${r(y)} q.05 -.06 .12 0 q-.05 .05 -.12 0 Z" fill="${["#c98a2a", "#a4642a", "#d9b23a", "#7c8d3a", "#b8502a"][i % 5]}" transform="rotate(${Math.round(z() * 180)} ${r(x)} ${r(y)})"/>`; }
  g += `<path d="M.55 -.62 L1.15 -.68" stroke="#6b5236" stroke-width=".06" stroke-linecap="round"/>`;
  S.teil({ oben: true, id: "schubkarre", de: "die Schubkarre", syl: "SCHUB-kar-re", it: "la carriola", itSyl: "car-RIO-la", en: "wheelbarrow", x: r(xG(SK.D, SK.X)), y: r(yG(SK.D)), steht: true,
    kunst: `<g transform="scale(${u.toFixed(4)})">${g}</g>`, tipp: "Der Gärtner sammelt das Laub in der Schubkarre." });
}
{
  /* Gärtner mit Rechen: Stiel durch beide Fäuste, schräg nach vorn links auf den Boden (1,7 m) */
  const hs = [G.m.z.handL, G.m.z.handR].map((h) => G.p(h));
  const hx = (hs[0].x + hs[1].x) / 2, hy = (hs[0].y + hs[1].y) / 2, gy = G.y + 0.4;
  const fx = hx - (gy - hy) * 0.9;
  const top = { x: hx + (hx - fx) * 0.35, y: hy - (gy - hy) * 0.35 };
  let g = `<path d="M${r(top.x - G.x)} ${r(top.y - G.y)} L${r(fx - G.x)} ${r(gy - 0.6 - G.y)}" stroke="#c49a62" stroke-width=".7" stroke-linecap="round"/>`;
  for (const h of hs) g += `<circle cx="${r(h.x - G.x)}" cy="${r(h.y - G.y)}" r=".55" fill="#e2b896"/>`;
  g += `<path d="M${r(fx - 3 - G.x)} ${r(gy - 0.9 - G.y)} L${r(fx + 2.4 - G.x)} ${r(gy - 0.5 - G.y)}" stroke="#4c5054" stroke-width=".7"/>`;
  for (let i = 0; i < 8; i++) g += `<path d="M${r(fx - 2.8 + i * 0.7 - G.x)} ${r(gy - 0.85 + i * 0.045 - G.y)} l.05 1" stroke="#4c5054" stroke-width=".28"/>`;
  /* zusammengerechtes Laub vor ihm */
  let laub = "";
  const z = zufall(77);
  for (let i = 0; i < 26; i++) { const x = fx - 6 + z() * 7 - G.x, y = gy + 0.4 - z() * 1.4 - G.y; laub += `<path d="M${r(x)} ${r(y)} q.4 -.5 .9 0 q-.4 .4 -.9 0 Z" fill="${["#c98a2a", "#a4642a", "#d9b23a", "#b8502a"][i % 4]}" transform="rotate(${Math.round(z() * 180)} ${r(x)} ${r(y)})"/>`; }
  S.teil({ id: "gaertner", de: "der Gärtner", syl: "GÄRT-ner", it: "il giardiniere", itSyl: "giar-di-NIE-re", en: "gardener", x: G.x, y: G.y, kunst: laub + G.svg + g,
    tipp: "Der Gärtner recht das Laub zusammen. Im Park Sanssouci arbeiten viele Gärtner." });
}
{
  const hs = [T.m.z.handL, T.m.z.handR].map((h) => T.p(h));
  const hx = (hs[0].x + hs[1].x) / 2, hy = Math.min(hs[0].y, hs[1].y);
  S.teil({ id: "touristin", de: "die Touristin", syl: "tou-RIS-tin", it: "la turista", itSyl: "tu-RI-sta", en: "tourist", x: T.x, y: T.y, kunst: T.svg,
    tipp: "Die Touristin macht ein Foto vom Schloss." });
  const g = `<rect x="-1.6" y="-3.1" width="3.2" height="5.6" rx=".6" fill="#1d2127" stroke="#8a9198" stroke-width=".25"/><rect x="-1.2" y="-2.6" width="2.4" height="4.6" rx=".3" fill="${S.lg("display", [[0, "#9cc0e2"], [0.55, "#f0c75e"], [1, "#9cbf63"]])}"/><circle cx="0" cy="-.9" r=".4" fill="#5f8f74"/>`;
  S.teil({ oben: true, id: "handy", de: "das Handy", syl: "HAN-dy", it: "il cellulare", itSyl: "cel-lu-LA-re", en: "mobile phone", x: r(hx), y: r(hy - 0.6), kunst: g + flaeche(-2.6, -4.2, 5.2, 8, 0.5),
    tipp: "Mit dem Handy macht man schnell ein Foto." });
}
S.teil({ id: "tourist", de: "der Tourist", syl: "tou-RIST", it: "il turista", itSyl: "tu-RI-sta", en: "tourist", x: M2.x, y: M2.y, kunst: M2.svg,
  tipp: "Der Tourist zeigt nach oben: „Da ist das Schloss!“" });
{
  S.teil({ id: "kind", de: "das Kind", syl: "KIND", it: "il bambino", itSyl: "bam-BI-no", en: "child", x: K.x, y: K.y, kunst: K.svg,
    tipp: "Das Kind bringt eine Kartoffel zum Grab des Königs." });
  const h = K.p(K.m.z.handR);
  let g = `<ellipse cx="0" cy="0" rx="2.1" ry="1.55" fill="${S.rg("knolle", [[0, "#ecd09a"], [0.6, "#c49a5c"], [1, "#8e6a3a"]], 0.38, 0.32, 0.75)}" transform="rotate(-18)"/>`;
  g += `<circle cx="-.7" cy="-.3" r=".14" fill="#7a5530"/><circle cx=".8" cy=".25" r=".14" fill="#7a5530"/><circle cx=".1" cy=".7" r=".12" fill="#7a5530"/><path d="M-1.2 -.8 q.7 -.6 1.6 -.5" stroke="#f6e6c2" stroke-width=".3" fill="none" opacity=".75"/>`;
  S.teil({ oben: true, id: "kartoffel", de: "die Kartoffel", syl: "kar-TOF-fel", it: "la patata", itSyl: "pa-TA-ta", en: "potato", x: r(h.x + 0.6), y: r(h.y - 1), kunst: g + flaeche(-3, -3, 6, 6, 0.6),
    tipp: "Friedrich der Große machte die Kartoffel in Preußen bekannt. Darum legen Besucher Kartoffeln auf sein Grab." });
}

/* Der Weg: Kies vom Platz bis vorn, Rechenspuren, Herbstblätter und alle Schlagschatten */
{
  let k = `<path d="M0 ${r(yG(FD + 30))} L400 ${r(yG(FD + 30))} L400 260 L0 260 Z" fill="${KIES}"/>`;
  {
    const z = zufall(5);
    for (const [n, dx] of [["korn", 0], ["korn2", 3.1]]) {
      let t = "";
      for (let i = 0; i < 16; i++) t += `<ellipse cx="${r(z() * 7)}" cy="${r(z() * 2.6)}" rx="${r(0.22 + z() * 0.3)}" ry="${r(0.1 + z() * 0.1)}" fill="${i % 2 ? "#efe6d2" : "#a29276"}"/>`;
      S.def(`<pattern id="${S.id(n)}" patternUnits="userSpaceOnUse" width="7" height="2.6" patternTransform="translate(${dx} ${dx / 2})">${t}</pattern>`);
    }
    k += `<path d="M0 ${r(yG(60))} L400 ${r(yG(60))} L400 ${r(yG(30))} L0 ${r(yG(30))} Z" fill="url(#${S.id("korn")})" opacity=".5"/>`;
    k += `<path d="M0 ${r(yG(30))} L400 ${r(yG(30))} L400 260 L0 260 Z" fill="url(#${S.id("korn2")})" opacity=".6"/>`;
  }
  /* Rechenspuren auf dem Hauptweg (längs) */
  let sp = "";
  for (const X of [-3.2, -1.8, -0.4, 1.2, 2.8]) sp += `M${r(xG(52, X))} ${r(yG(52))} L${r(xG(17, X))} ${r(yG(17))} `;
  k += `<path d="${sp}" stroke="#b6a483" stroke-width=".4" fill="none" opacity=".55"/>`;
  /* Herbstblätter auf dem Kies, nah größer */
  let bl = "";
  const z = zufall(44);
  for (let i = 0; i < 46; i++) { const D = 18 + z() * 37, X = (z() - 0.5) * 8.6, x = xG(D, X), y = yG(D) + z(), s2 = 0.18 * sk(D); if (x < 3 || x > 397 || y > 257) continue; bl += `<path d="M${r(x)} ${r(y)} q${r(s2 * 0.5)} ${r(-s2 * 0.6)} ${r(s2)} 0 q${r(-s2 * 0.5)} ${r(s2 * 0.4)} ${r(-s2)} 0 Z" fill="${["#c98a2a", "#d9b23a", "#a4642a", "#b8502a"][i % 4]}" transform="rotate(${Math.round(z() * 180)} ${r(x)} ${r(y)})"/>`; }
  k += bl;
  k += `<g filter="url(#${S.id("schw")})">${schattenListe.join("")}</g>`;
  k += `<rect x="0" y="${r(yG(FD + 30))}" width="400" height="${r(260 - yG(FD + 30))}" fill="${S.lg("kieslicht", [[0, "#000", 0.05], [0.3, "#000", 0], [1, "#fff0d0", 0.12]])}"/>`;
  WEG.kunst = k;
}

/* Warmes Nachmittagslicht über allem (fängt keinen Tipp ab): golden von links, kühl rechts */
S.davor(`<rect width="400" height="260" fill="${S.lg("abendlicht", [[0, "#ffcf8a", 0.16], [0.55, "#ffcf8a", 0.04], [1, "#6a6aa8", 0.08]], 0, 0, 1, 0)}" pointer-events="none"/>`);
S.davor(`<rect width="400" height="260" fill="${S.rg("abend", [[0, "#ffe7b8", 0.12], [0.6, "#ffe7b8", 0], [1, "#000", 0.05]], 0.0, 0.85, 1.1)}" pointer-events="none"/>`);

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/potsdam.js"));
console.log(aus);
