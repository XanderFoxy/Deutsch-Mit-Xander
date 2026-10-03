#!/usr/bin/env node
/* =====================================================================
   RIO DE JANEIRO — COPACABANA (FASSUNG 854) — Bilderwelt neu
   ---------------------------------------------------------------------
   XANDER (03.10.): „die bekanntesten Städte in anderen Ländern, die
   berühmt für irgendetwas sind … als Profi-Grafikdesigner auf
   Hollywood-Niveau … mit größter Sorgfalt und Präzision“.

   RECHERCHE (Lagepläne der Zona Sul, Koordinaten der Gipfel, Fotos vom
   Calçadão bei Posto 5, Daten zum Cristo Redentor, Orla-Rio-Kioske):
   - STANDORT: Copacabana, Höhe Posto 5, auf dem Sand direkt vor dem
     Calçadão. Blick nach NORDOSTEN den Strand entlang. Am Ende der
     Bucht der Hügel LEME (Morro do Leme, oben das alte Fort Duque de
     Caxias), links davon der Morro da BABILÔNIA mit den Favelas
     Babilônia und Chapéu Mangueira. Vom Posto 5 aus liegt der ZUCKER-
     HUT fast genau hinter Leme (Peilung ≈ 39°, 5,3 km): nur seine
     obere Kuppe schaut hinter den Hügeln hervor. Die Seilbahn fährt auf
     der Buchtseite (Praia Vermelha – Urca – Gipfel) und ist von hier
     verdeckt – darum ist sie nicht gezeichnet.
   - Der CORCOVADO (710 m) mit dem CRISTO REDENTOR liegt in Wirklichkeit
     links (Nordnordwest, Peilung ≈ −30°, 4,4 km) hinter den Häusern der
     Avenida Atlântica. Das Bild ist ein Panorama nach Himmelsrichtungen:
     Corcovado links, Leme/Zuckerhut rechts; die fernen Berge sind wie
     mit einem Teleobjektiv etwas größer gezeichnet.
   - Cristo Redentor: 30 m hoch auf 8 m Sockel (im Sockel eine Kapelle),
     Armspanne 28 m, Stahlbeton, außen ein Mosaik aus Tausenden kleiner
     dreieckiger Specksteinplättchen, Art déco (Paul Landowski, Heitor da
     Silva Costa, Gesicht Gheorghe Leonida), eingeweiht am 12.10.1931.
     Die Statue schaut nach OSTEN (zur Bucht): von der Copacabana (Süd-
     südost) sieht man sie schräg von vorn rechts – die Arme wirken
     darum etwas kürzer. Glatte Gewandfalten, Kordel um die Taille, ein
     Herz auf der Brust, weite Ärmel, die unter den Armen herabhängen.
   - Der Zuckerhut (Pão de Açúcar, 396 m): kahler Granit-Monolith mit
     dunklen Regenstreifen, oben bewachsen. Vormittags steht die Sonne im
     Nordosten über dem Meer (Südhalbkugel: Mittagssonne im Norden) – der
     Zuckerhut steht darum etwas im Gegenlicht, die Häuserfronten und der
     Cristo (schaut nach Osten) sind hell beleuchtet. Schatten fallen
     nach links vorn.
   - CALÇADÃO: portugiesisches Pflaster aus schwarzem Basalt und weißem
     Kalkstein; seit Burle Marx (1970) laufen die großen Wellen PARALLEL
     zum Meer. 4 km lang. Daneben die Avenida Atlântica (zwei Fahrbahnen,
     Mittelstreifen) und die Reihe der 10–14-stöckigen Wohnhäuser.
   - KIOSK (Orla Rio): runder Glaspavillon mit weißem Flachdach auf dem
     Calçadão am Sandrand; es gibt „coco gelado“ (eiskalte grüne Kokos-
     nuss mit Strohhalm), Açaí (gefrorenes lila Beerenmus mit Müsli und
     Banane) und „Mate gelado com limão“ (kalter Mate-Tee mit Zitrone).
   - TAXIS in Rio sind gelb mit einem blauen Streifen an der Seite.
   - Am Strand: Barracas (Strandbuden mit Fahne, Kühlbox und Stuhl-
     stapeln) verleihen Klappstühle und Schirme; Futevôlei-Netze; Strand-
     verkäufer tragen zwei Aluminiumfässer (Mate und Limonade) am Gurt;
     Havaianas (Flipflops); Kinder spielen „Altinha“ (den Ball in der Luft
     halten); Samba mit dem Pandeiro (Tamburin); die Canga als Strandtuch.
     Brasiliens Flagge: grün, gelbe Raute, blaue Himmelskugel mit 27
     Sternen, Band „ORDEM E PROGRESSO“.
   - RETTUNGSTURM Posto 5: Die Postos (1–6) gliedern den Strand; die
     Rettungsschwimmer beobachten das Meer von Türmen am Sand, die rote
     Fahne warnt vor Strömung. (Die genaue Form des Turms ist vereinfacht –
     unsicher, ohne Bildvorlage gezeichnet.)
   - Die Copacabana Palace (Posto 2–3) ist von Posto 5 rund 1,6 km entfernt:
     im Bild wäre sie keine Einheit breit – darum nicht eigens gezeichnet.
   - MASSSTAB der Wahrzeichen: Cristo samt Sockel ≈ 7 Einheiten (höchstens
     doppelt so groß wie in Wirklichkeit, Details in der Lupe), der Kopf
     ist 1/8 der Statue; Zuckerhut-Kuppe ≈ 15 Einheiten über dem Grat;
     Favela-Häuser 3–6 m breit (0,6–1,2 Einheiten).
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "rio", titel: "Rio de Janeiro", emoji: "🌴", thema: "Länder", kuerzel: "rio", fassung: 854 });
const rnd = zufall(1565);
const r = B.r;
const HY = 100, VX = 212;
const sy = (y) => (y - HY) / 1.6;
const um = (ox, oy, svg) => `<g transform="translate(${r(-ox)} ${r(-oy)})">${svg}</g>`;
const knapp = (svg) => svg.replace(/ (d|x1|y1|x2|y2|cx|cy|rx|ry)="([^"]*)"/g, (m, a, v) => ` ${a}="${v.replace(/-?\d+\.\d+/g, (n) => String(Math.round(+n)))}"`);
/* Figuren: Koordinaten auf halbe Zentimeter runden (spart ein Drittel, ohne Treppen im Haar) */
const halb = (svg) => svg.replace(/ (d|x1|y1|x2|y2|cx|cy|rx|ry)="([^"]*)"/g, (m, a, v) => ` ${a}="${v.replace(/-?\d+\.\d+/g, (n) => String(Math.round(+n * 2) / 2))}"`);
/* verdeckte Teile einer Figur weglassen: Pfade/Ellipsen, die ganz unterhalb von yMax liegen (Figur-Einheiten) */
const nurOben = (svg, yMax) => svg.replace(/<(path|ellipse|circle)\b[^>]*\/>/g, (el) => {
  let ys = [];
  const d = el.match(/ d="([^"]*)"/);
  if (d) { const n = d[1].match(/-?\d+(\.\d+)?/g) || []; for (let i = 1; i < n.length; i += 2) ys.push(+n[i]); }
  else { const cy = el.match(/ cy="([^"]*)"/), ry = el.match(/ (?:ry|r)="([^"]*)"/); if (cy) ys = [+cy[1] - (ry ? +ry[1] : 0)]; }
  return ys.length && Math.min(...ys) > yMax ? "" : el;
});
const pts = (a) => a.map(([x, y]) => `${r(x)} ${r(y)}`).join(" L");
B.mensch({}, 10);
/* Vieleck auf das Bild zuschneiden (Sutherland–Hodgman), damit nichts aus dem Rahmen ragt */
function kappe(p, x0 = 0, y0 = 0, x1 = 320, y1 = 200) {
  const kanten = [[(q) => q[0] >= x0, (a, b) => [x0, a[1] + (b[1] - a[1]) * (x0 - a[0]) / (b[0] - a[0])]],
    [(q) => q[0] <= x1, (a, b) => [x1, a[1] + (b[1] - a[1]) * (x1 - a[0]) / (b[0] - a[0])]],
    [(q) => q[1] >= y0, (a, b) => [a[0] + (b[0] - a[0]) * (y0 - a[1]) / (b[1] - a[1]), y0]],
    [(q) => q[1] <= y1, (a, b) => [a[0] + (b[0] - a[0]) * (y1 - a[1]) / (b[1] - a[1]), y1]]];
  for (const [innen, schnitt] of kanten) {
    const aus = [];
    for (let i = 0; i < p.length; i++) {
      const a = p[i], b = p[(i + 1) % p.length];
      if (innen(b)) { if (!innen(a)) aus.push(schnitt(a, b)); aus.push(b); } else if (innen(a)) aus.push(schnitt(a, b));
    }
    p = aus;
    if (!p.length) return p;
  }
  return p;
}
const vieleck = (p, attr) => { const q = kappe(p); return q.length > 2 ? `<path d="M${pts(q)} Z" ${attr}/>` : ""; };

/* Bodenpunkt (seitlich X Meter, Tiefe Z Meter) → Bild (f = 175) */
const F = 175;
const boden = (X, Z) => [VX + F * X / Z, HY + F * 1.6 / Z];

/* ---------- Stoffe ---------------------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("dunst")}" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="1.6"/></filter>`);
S.def(`<pattern id="${S.id("wald")}" width="2.6" height="2" patternUnits="userSpaceOnUse"><rect width="2.6" height="2" fill="#376b47"/><circle cx=".7" cy=".7" r=".7" fill="#3f774f"/><circle cx="2" cy="1.5" r=".75" fill="#30603d"/><circle cx="2.1" cy=".3" r=".45" fill="#468252"/><circle cx=".4" cy="1.7" r=".4" fill="#2c5938"/></pattern>`);
S.def(`<pattern id="${S.id("mosaik")}" width=".5" height=".44" patternUnits="userSpaceOnUse"><rect width=".5" height=".44" fill="#ece8dc"/><path d="M0 .44 L.25 0 L.5 .44 Z" fill="#dcd6c6"/><path d="M0 .44 L.25 0" stroke="#bdb5a2" stroke-width=".03"/></pattern>`);
/* Sonne vorn rechts (Nordosten): dem Betrachter zugewandte Seiten im Schatten, rechts ein warmer Lichtsaum */
S.def(`<filter id="${S.id("gegenlicht")}" x="-20%" y="-10%" width="140%" height="120%"><feComponentTransfer in="SourceGraphic" result="d"><feFuncR type="linear" slope=".78"/><feFuncG type="linear" slope=".78"/><feFuncB type="linear" slope=".84"/></feComponentTransfer><feOffset in="SourceAlpha" dx="-.45" dy=".2" result="v"/><feComposite in="SourceAlpha" in2="v" operator="out" result="kante"/><feGaussianBlur in="kante" stdDeviation=".12" result="kw"/><feFlood flood-color="#fff0c4" flood-opacity=".6"/><feComposite in2="kw" operator="in" result="l"/><feComposite in="l" in2="SourceAlpha" operator="in" result="l2"/><feMerge><feMergeNode in="d"/><feMergeNode in="l2"/></feMerge></filter>`);
const GEGENLICHT = `url(#${S.id("gegenlicht")})`;
/* im Kiosk: nur Schatten, kein Lichtsaum */
S.def(`<filter id="${S.id("innen")}"><feComponentTransfer><feFuncR type="linear" slope=".8"/><feFuncG type="linear" slope=".8"/><feFuncB type="linear" slope=".85"/></feComponentTransfer></filter>`);
const INNEN = `url(#${S.id("innen")})`;
const WALD = `url(#${S.id("wald")})`;
const MOSAIK = `url(#${S.id("mosaik")})`;
const DUNST = `url(#${S.id("dunst")})`;

/* =====================================================================
   KULISSE — Himmel, Sonne (vorn rechts, über dem Meer), Wolken, Vögel
   ===================================================================== */
{
  let k = `<rect width="320" height="101" fill="${S.lg("himmel", [[0, "#2a6fbd"], [0.45, "#5aa0d8"], [0.82, "#a6d3ec"], [1, "#d9eef3"]])}"/>`;
  k += `<rect width="320" height="101" fill="${S.rg("sonne", [[0, "#fff9dc", 0.95], [0.18, "#fff3c4", 0.55], [0.55, "#fff3c4", 0.12], [1, "#fff3c4", 0]], 0.98, 0.02, 0.75)}"/>`;
  /* Haufenwolken über den Bergen, weich */
  for (const [x, y, w] of [[150, 40, 18], [172, 34, 12], [192, 44, 14], [128, 30, 9], [262, 22, 16], [284, 30, 10]]) {
    k += `<ellipse cx="${x}" cy="${y + 2}" rx="${w * 1.3}" ry="${r(w * 0.22)}" fill="#c9d7e2" opacity=".55" filter="${DUNST}"/>`;
    for (let i = 0; i < 4; i++) k += `<circle cx="${r(x - w * 0.7 + i * w * 0.46)}" cy="${r(y - Math.sin((i + 0.5) / 4 * Math.PI) * w * 0.32)}" r="${r(w * (0.3 + 0.12 * Math.sin((i + 0.5) / 4 * Math.PI)))}" fill="#fbfdff" opacity=".85" filter="${DUNST}"/>`;
  }
  /* Fregattvögel (lange, abgewinkelte Flügel, gegabelter Schwanz) */
  for (const [x, y, s] of [[146, 16, 1], [168, 24, 0.75], [250, 12, 0.6]]) {
    k += `<path d="M${x - 6 * s} ${r(y - 1.2 * s)} L${r(x - 2.6 * s)} ${r(y + 0.4 * s)} L${x} ${y} L${r(x + 2.6 * s)} ${r(y + 0.4 * s)} L${x + 6 * s} ${r(y - 1.2 * s)} M${x} ${y} l${r(-0.5 * s)} ${r(2 * s)} M${x} ${y} l${r(0.5 * s)} ${r(2 * s)}" stroke="#2a2a33" stroke-width="${r(0.55 * s)}" fill="none" stroke-linejoin="round"/>`;
  }
  /* ferner Horizontdunst über dem Meer */
  k += `<rect x="150" y="96" width="170" height="4.4" fill="#e9f3f2" opacity=".5"/>`;
  S.hinten(k);
}

/* =====================================================================
   1 — DER REGENWALD (Tijuca-Massiv hinter der Copacabana) — weiter weg
   als der Corcovado: bläulich verschleiert, durch ein Tal getrennt
   ===================================================================== */
{
  const umriss = [[18, 104], [24, 70], [34, 58], [46, 50], [60, 44], [72, 40], [86, 33], [96, 36], [108, 44], [118, 48], [130, 47], [142, 52], [152, 60], [160, 68], [168, 76], [174, 86], [178, 104]];
  let k = `<path d="M${pts(umriss)} Z" fill="${WALD}"/>`;
  /* Luftperspektive: deutlich bläulicher als der nähere Corcovado */
  k += `<path d="M${pts(umriss)} Z" fill="${S.lg("waldluft", [[0, "#a9c8d4", 0.62], [0.5, "#93b8c0", 0.42], [1, "#6f9a98", 0.25]])}"/>`;
  /* Baumkronen am Grat (nur oben, wo der Grat frei steht) */
  for (let i = 0; i < umriss.length - 1; i++) {
    const [x1, y1] = umriss[i], [x2, y2] = umriss[i + 1];
    for (let t = 0; t < 1; t += 0.34) { const y = y1 + (y2 - y1) * t; if (y > 80) continue; k += `<circle cx="${r(x1 + (x2 - x1) * t)}" cy="${r(y + 0.5)}" r="${r(0.8 + rnd() * 0.6)}" fill="${rnd() < 0.5 ? "#6f9a8c" : "#628e80"}"/>`; }
  }
  /* Tallinien (Schatten der Seitentäler) */
  k += `<path d="M118 48 Q124 60 128 76 M142 52 Q146 62 148 74" stroke="#4f7a72" stroke-width=".8" fill="none" opacity=".35"/>`;
  S.teil({ id: "regenwald", de: "der Regenwald", syl: "RE-gen-wald", it: "la foresta pluviale", itSyl: "fo-RE-sta plu-VIA-le", en: "rainforest", x: 120, y: 50, kunst: um(120, 50, k),
    tipp: "Mitten in Rio wächst der Tijuca-Wald. Er ist einer der größten Stadtwälder der Welt." });
}

/* =====================================================================
   2 — DER BERG (Corcovado: links bewaldet, rechts die Granitwand) —
   näher, dunkler, mit mehr Fels; die Gipfelkuppe trägt die Plattform
   ===================================================================== */
const CX = 88, CY = 27;   /* Oberkante der Aussichtsplattform = Fuß des Sockels */
{
  const um1 = [[48, 78], [56, 66], [64, 54], [72, 43], [78, 35], [82, 30], [84.2, 28.2], [91.8, 28.2], [94, 30.6], [97, 37], [99.6, 48], [101.6, 58], [104, 66], [110, 74], [116, 78]];
  /* Tal zwischen Corcovado und Massiv: dunkler Schattensaum */
  let k = `<path d="M${pts(um1.map(([x, y]) => [x + (x < CX ? -1.6 : 1.6), y + 1.2]))} Z" fill="#2c4f3f" opacity=".45"/>`;
  k += `<path d="M${pts(um1)} Z" fill="${WALD}"/>`;
  k += `<path d="M${pts(um1)} Z" fill="${S.lg("corcluft", [[0, "#8fb2ba", 0.28], [1, "#1f3f2a", 0.12]])}"/>`;
  /* die Felswand nach Osten (rechts), von der Morgensonne beschienen */
  const wand = [[86.5, 28.6], [91.8, 28.4], [94, 30.6], [97, 37], [99.6, 48], [101.6, 58], [103.2, 64], [100.4, 66], [97.6, 57], [94.6, 45], [91, 35]];
  k += `<path d="M${pts(wand)} Z" fill="${S.lg("granit", [[0, "#7f7c76"], [0.55, "#aaa498"], [1, "#d0c8b6"]], 0, 0, 1, 0)}"/>`;
  for (let i = 0; i < 9; i++) { const x = 90 + i * 1.2, y = 31 + i * 1.6; k += `<path d="M${r(x)} ${r(y)} q.6 ${r(6 + rnd() * 6)} ${r(0.4 + rnd())} ${r(12 + rnd() * 8)}" stroke="#5f5c56" stroke-width="${r(0.25 + rnd() * 0.3)}" fill="none" opacity=".55"/>`; }
  /* Felsplatten an der linken Flanke und unter dem Gipfel */
  k += `<path d="M79.5 33 L84 29.4 L86 31 L83.6 38 L80.6 39 Z" fill="${S.lg("granit2", [[0, "#6d6c68"], [1, "#9a958a"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M70 47 L73.6 44 L75 47.6 L72 52 Z M64.6 56 L67 54 L68 57.4 L65.6 60 Z" fill="#7a7871" opacity=".85"/>`;
  /* Gipfelfels, auf dem die Terrassenmauer sitzt; Bäume an der Kante */
  k += `<path d="M82.2 31.6 Q83.2 28.7 84.5 27.5 L91.5 27.5 Q92.8 28.7 93.9 31.6 Z" fill="${S.lg("gipfel", [[0, "#77736b"], [1, "#a9a296"]], 0, 0, 1, 0)}"/>`;
  for (const [x, y, rr] of [[83.6, 28.4, 0.7], [82.6, 29.6, 0.9], [92.5, 28.4, 0.6], [93.5, 29.6, 0.8]]) k += `<circle cx="${x}" cy="${y}" r="${rr}" fill="#2f5a3a"/>`;
  /* Wald an der linken Flanke im Schatten */
  k += `<path d="M48 78 L56 66 L64 54 L72 43 L78 35 L82 30 L84.2 28.2 L86.5 28.6 L90 36 L88 52 L84 78 Z" fill="#14301f" opacity=".3"/>`;
  for (let i = 0; i < 16; i++) { const t = rnd(), x = 52 + t * 34, y = 77 - t * 46 + rnd() * 5; k += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(0.8 + rnd() * 0.6)}" fill="#3a6a46" opacity=".8"/>`; }
  S.teil({ id: "berg", de: "der Berg", syl: "BERG", it: "la montagna", itSyl: "mon-TA-gna", en: "mountain", x: 76, y: 44, kunst: um(76, 44, k),
    tipp: "Der Berg heißt Corcovado – „der Bucklige“. Er ist 710 Meter hoch." });
}

/* =====================================================================
   3 — DIE CHRISTUSSTATUE (Cristo Redentor) — Lupe: Arm, Sockel,
       Mosaik, Aussichtsplattform. Maße in Metern, q = Einheiten je Meter
       (doppelt so groß wie in Wirklichkeit, damit man sie erkennt).
   ===================================================================== */
{
  const q = 5.5 / 30, M = (v) => r(v * q * 100) / 100;
  const L = S.lg("cristoL", [[0, "#c4beaf"], [0.45, "#e6e2d6"], [1, "#fbf9f2"]], 0, 0, 1, 0);
  S.def(`<pattern id="${S.id("mosaik2")}" width=".16" height=".14" patternUnits="userSpaceOnUse"><rect width=".16" height=".14" fill="#ece8dc"/><path d="M0 .14 L.08 0 L.16 .14 Z" fill="#d9d2c1"/></pattern>`);
  let k = "";
  /* Aussichtsplattform von unten: nur die Außenmauer mit dem Geländer */
  k += `<path d="M${M(-16)} ${M(3.2)} L${M(-15.4)} 0 L${M(15.4)} 0 L${M(16)} ${M(3.2)} Z" fill="${S.lg("terrasse", [[0, "#d6d0c2"], [1, "#a39d8f"]])}"/>`;
  k += `<path d="M${M(-15.4)} 0 L${M(15.4)} 0" stroke="#8f897c" stroke-width=".06"/>`;
  k += `<path d="M${M(-15.2)} ${M(-1.1)} L${M(15.2)} ${M(-1.1)}" stroke="#7f7a70" stroke-width=".05"/>`;
  for (let x = -15; x <= 15; x += 2.5) k += `<line x1="${M(x)}" y1="0" x2="${M(x)}" y2="${M(-1.1)}" stroke="#7f7a70" stroke-width=".035"/>`;
  /* Sockel (8 m): Art-déco-Block, oben gestuft, senkrechte Rillen, Kapellentür */
  k += `<path d="M${M(-3.6)} 0 L${M(-3.2)} ${M(-6.6)} L${M(3.2)} ${M(-6.6)} L${M(3.6)} 0 Z" fill="${L}"/>`;
  k += `<rect x="${M(-3.5)}" y="${M(-7.4)}" width="${M(7)}" height="${M(0.8)}" fill="#f2efe6"/><rect x="${M(-3)}" y="${M(-8)}" width="${M(6)}" height="${M(0.6)}" fill="#dcd7ca"/>`;
  for (const x of [-2, -1, 1, 2]) k += `<line x1="${M(x)}" y1="${M(-6.3)}" x2="${M(x * 1.08)}" y2="${M(-0.4)}" stroke="#b0a998" stroke-width=".03"/>`;
  k += `<path d="M${M(-0.7)} 0 L${M(-0.7)} ${M(-2.2)} Q0 ${M(-2.8)} ${M(0.7)} ${M(-2.2)} L${M(0.7)} 0 Z" fill="#5a5144"/>`;
  /* Gewand (8–31 m): unten 5 m breit, Schultern 6 m, glatte senkrechte Falten */
  const yb = -8, ys = -8 - 22.6;
  const yp = yb - 0.7;   /* kleiner Plinthenblock, darauf die Füße */
  k += `<rect x="${M(-2.3)}" y="${M(yp)}" width="${M(4.5)}" height="${M(0.7)}" fill="#d8d3c5"/><path d="M${M(-1.3)} ${M(yp)} q${M(0.5)} ${M(-0.5)} ${M(1)} 0 Z M${M(0.4)} ${M(yp)} q${M(0.5)} ${M(-0.5)} ${M(1)} 0 Z" fill="#cfc9b9"/>`;
  const robe = `M${M(-2.25)} ${M(yp - 0.35)} L${M(-2.6)} ${M(yb - 11)} Q${M(-2.85)} ${M(ys + 2)} ${M(-2.8)} ${M(ys)} L${M(2.75)} ${M(ys)} Q${M(2.85)} ${M(ys + 2)} ${M(2.65)} ${M(yb - 11)} L${M(2.3)} ${M(yp - 0.35)} Z`;
  k += `<path d="${robe}" fill="${L}"/><path d="${robe}" fill="url(#${S.id("mosaik2")})" opacity=".5"/>`;
  for (const x of [-1.6, -0.5, 0.7, 1.8]) k += `<path d="M${M(x)} ${M(yb - 0.3)} Q${M(x + 0.2)} ${M(yb - 10)} ${M(x * 0.9)} ${M(ys + 1.4)}" stroke="#bdb6a4" stroke-width=".035" fill="none"/>`;
  /* Kordel um die Taille, zwei Enden hängen herab */
  k += `<path d="M${M(-2.75)} ${M(yb - 10.6)} Q0 ${M(yb - 10)} ${M(2.95)} ${M(yb - 10.6)}" stroke="#b5ad9a" stroke-width=".05" fill="none"/><path d="M${M(0.2)} ${M(yb - 10.3)} L${M(0.1)} ${M(yb - 5.4)} M${M(0.7)} ${M(yb - 10.3)} L${M(0.8)} ${M(yb - 6)}" stroke="#b5ad9a" stroke-width=".035"/>`;
  /* Arme waagrecht; schräg gesehen (die Statue schaut nach Osten) wirken sie kürzer.
     Der linke im Bild ist näher und etwas länger. Weite Ärmel hängen darunter. */
  const aL = -10.4, aR = 8.65, ya = ys - 0.3, yd = ya + 2.2;
  k += `<path d="M${M(-2.6)} ${M(ya)} L${M(aL + 1.2)} ${M(ya - 0.3)} L${M(aL + 1.2)} ${M(yd - 0.5)} L${M(-2.6)} ${M(yd + 0.6)} Z" fill="${S.lg("armL", [[0, "#e6e2d6"], [1, "#cdc7b8"]])}"/>`;
  k += `<path d="M${M(-2.6)} ${M(yd)} L${M(aL * 0.6)} ${M(yd - 0.4)} Q${M(aL * 0.45)} ${M(yd + 2.4)} ${M(-2.65)} ${M(yd + 4.6)} Z" fill="#d0c9ba"/>`;
  k += `<path d="M${M(2.8)} ${M(ya)} L${M(aR - 1.1)} ${M(ya - 0.25)} L${M(aR - 1.1)} ${M(yd - 0.5)} L${M(2.8)} ${M(yd + 0.6)} Z" fill="#faf8f1"/>`;
  k += `<path d="M${M(2.8)} ${M(yd)} L${M(aR * 0.6)} ${M(yd - 0.4)} Q${M(aR * 0.45)} ${M(yd + 2.3)} ${M(2.85)} ${M(yd + 4.5)} Z" fill="#ebe7dc"/>`;
  /* Hände: offen, Handfläche nach vorn, Daumen oben, Finger geschlossen (Fingerfugen) */
  for (const [x0, sg, c] of [[aL + 1.2, -1, "#ddd8ca"], [aR - 1.1, 1, "#f6f3ea"]]) {
    const xe = x0 + sg * 2.1, xm = x0 + sg * 0.75;
    k += `<path d="M${M(x0)} ${M(ya - 0.2)} L${M(xm)} ${M(ya - 0.25)} Q${M(xm + sg * 0.2)} ${M(ya - 1.1)} ${M(xm + sg * 0.55)} ${M(ya - 0.95)} Q${M(xm + sg * 0.7)} ${M(ya - 0.6)} ${M(xm + sg * 0.45)} ${M(ya - 0.1)} L${M(xe - sg * 0.3)} ${M(ya - 0.05)} Q${M(xe + sg * 0.1)} ${M(ya + 0.6)} ${M(xe - sg * 0.3)} ${M(yd - 0.55)} L${M(x0)} ${M(yd - 0.5)} Z" fill="${c}"/>`;
    k += `<path d="M${M(xm + sg * 0.35)} ${M(ya + 0.5)} L${M(xe - sg * 0.2)} ${M(ya + 0.5)} M${M(xm + sg * 0.35)} ${M(ya + 1.05)} L${M(xe - sg * 0.2)} ${M(ya + 1.05)} M${M(xm + sg * 0.35)} ${M(ya + 1.6)} L${M(xe - sg * 0.25)} ${M(ya + 1.6)}" stroke="#b9b29f" stroke-width=".02"/>`;
  }
  /* Kopf (3,75 m = 1/8 der Statue), 10° nach vorn geneigt: Haar mit Mittelscheitel in Strähnen
     bis auf die Schultern (keine Kapuze), spitzer Art-déco-Bart mit Kerben, gesenkte Lider */
  const kh = ys - 0.4, hx = 0.1;
  k += `<path d="M${M(-1.3)} ${M(kh + 0.35)} Q${M(-1.5)} ${M(kh - 1.7)} ${M(-0.95)} ${M(kh - 2.85)} Q${M(hx)} ${M(kh - 3.4)} ${M(1.15)} ${M(kh - 2.85)} Q${M(1.7)} ${M(kh - 1.7)} ${M(1.5)} ${M(kh + 0.35)} L${M(0.9)} ${M(kh + 0.2)} L${M(-0.7)} ${M(kh + 0.2)} Z" fill="#d6d0c1"/>`;
  let st = "";
  for (const sg of [-1, 1]) for (const f of [0.35, 0.65, 0.95]) st += `M${M(hx + sg * 0.05)} ${M(kh - 3.25)} Q${M(hx + sg * (0.5 + f))} ${M(kh - 3.05 + f * 0.25)} ${M(hx + sg * (0.55 + f * 0.75))} ${M(kh + 0.25)}`;
  k += `<path d="${st}" stroke="#b2ab99" stroke-width=".022" fill="none"/>`;
  /* Gesicht: Stirn groß (Kopf geneigt), Haaransatz mit leichtem Scheitel-V */
  k += `<path d="M${M(-0.68)} ${M(kh - 2.45)} Q${M(-0.3)} ${M(kh - 2.85)} ${M(hx)} ${M(kh - 2.62)} Q${M(0.5)} ${M(kh - 2.85)} ${M(0.9)} ${M(kh - 2.45)} L${M(0.9)} ${M(kh - 1.2)} Q${M(hx)} ${M(kh - 0.55)} ${M(-0.68)} ${M(kh - 1.2)} Z" fill="${S.lg("gesicht", [[0, "#dcd6c8"], [1, "#fbf9f3"]], 0, 0, 1, 0)}"/>`;
  /* Bart: vom Kinn spitz bis zum Halsansatz, senkrechte Kerben */
  k += `<path d="M${M(-0.66)} ${M(kh - 1.45)} Q${M(-0.62)} ${M(kh - 0.55)} ${M(-0.2)} ${M(kh - 0.1)} L${M(hx)} ${M(kh + 0.45)} L${M(0.4)} ${M(kh - 0.1)} Q${M(0.86)} ${M(kh - 0.55)} ${M(0.88)} ${M(kh - 1.45)} Q${M(hx)} ${M(kh - 0.95)} ${M(-0.66)} ${M(kh - 1.45)} Z" fill="#d9d3c4"/>`;
  k += `<path d="M${M(-0.35)} ${M(kh - 0.95)} L${M(-0.08)} ${M(kh - 0.05)} M${M(-0.05)} ${M(kh - 0.85)} L${M(0.04)} ${M(kh + 0.15)} M${M(0.25)} ${M(kh - 0.85)} L${M(0.16)} ${M(kh + 0.15)} M${M(0.55)} ${M(kh - 0.95)} L${M(0.28)} ${M(kh - 0.05)}" stroke="#b2ab99" stroke-width=".02"/>`;
  k += `<path d="M${M(-0.28)} ${M(kh - 1.32)} Q${M(hx)} ${M(kh - 1.5)} ${M(0.48)} ${M(kh - 1.32)}" stroke="#a9a290" stroke-width=".025" fill="none"/>`;
  /* gesenkte Lider, Brauen, Nase */
  k += `<path d="M${M(-0.46)} ${M(kh - 2.02)} q${M(0.22)} ${M(0.14)} ${M(0.44)} 0 M${M(0.2)} ${M(kh - 2.02)} q${M(0.22)} ${M(0.14)} ${M(0.44)} 0" stroke="#9f9886" stroke-width=".024" fill="none"/>`;
  k += `<path d="M${M(-0.5)} ${M(kh - 2.28)} q${M(0.25)} ${M(-0.1)} ${M(0.5)} 0 M${M(0.16)} ${M(kh - 2.28)} q${M(0.25)} ${M(-0.1)} ${M(0.5)} 0" stroke="#bdb6a4" stroke-width=".02" fill="none"/><path d="M${M(hx + 0.05)} ${M(kh - 2.2)} L${M(hx + 0.1)} ${M(kh - 1.6)}" stroke="#c4bdab" stroke-width=".03"/>`;
  /* Herz auf der Brust */
  k += `<path d="M${M(-0.35)} ${M(ys + 3.2)} q${M(-0.5)} ${M(-0.7)} 0 ${M(-1)} q${M(0.3)} ${M(-0.15)} ${M(0.42)} ${M(0.18)} q${M(0.12)} ${M(-0.33)} ${M(0.42)} ${M(-0.18)} q${M(0.5)} ${M(0.3)} 0 ${M(1)} l${M(-0.42)} ${M(0.5)} Z" fill="none" stroke="#b3ab98" stroke-width=".03"/>`;
  /* Lichtkante rechts (Morgensonne von Osten) */
  k += `<path d="M${M(2.95)} ${M(ys + 0.5)} Q${M(3.05)} ${M(yb - 11)} ${M(2.65)} ${M(yb - 0.5)}" stroke="#ffffff" stroke-width=".07" fill="none" opacity=".85"/>`;
  /* Besucher auf der Plattform (0,55 Einheiten) — nur in der Lupe */
  /* Besucher (1,7 m): von unten sieht man nur Kopf und Schultern über der Brüstung, locker verteilt */
  let besucher = "";
  for (const [x, c, h] of [[-13.4, "#d24a3c", 1.7], [-12.5, "#2f6fb0", 1.6], [-10.2, "#f0c040", 1.75], [-9.5, "#ffffff", 1.35], [7.6, "#3a8a4a", 1.7], [10.3, "#ffffff", 1.65], [11.1, "#c43a8a", 1.55], [13.8, "#2f6fb0", 1.75]]) besucher += `<path d="M${M(x - 0.25)} ${M(-1.1)} L${M(x - 0.22)} ${M(-h + 0.42)} Q${M(x)} ${M(-h + 0.32)} ${M(x + 0.22)} ${M(-h + 0.42)} L${M(x + 0.25)} ${M(-1.1)} Z" fill="${c}"/><circle cx="${M(x)}" cy="${M(-h + 0.17)}" r="${M(0.15)}" fill="${x > 0 ? "#6b4a32" : "#3a2a1e"}"/>`;
  const unterC = [
    { id: "arm", de: "der Arm", syl: "ARM", it: "il braccio", itSyl: "BRAC-cio", en: "arm", x: CX + M(aL * 0.55), y: CY + M(yd + 1.6), kunst: flaeche(M(aL * 0.5 - 0.7), M(-4.6), M(-aL * 0.9), M(5), 0.15),
      tipp: "Von einer Hand bis zur anderen sind es 28 Meter." },
    { id: "sockel", de: "der Sockel", syl: "SO-ckel", it: "il piedistallo", itSyl: "pie-di-STAL-lo", en: "pedestal", x: CX, y: CY, kunst: flaeche(M(-3.7), M(-8.1), M(7.4), M(8.1), 0.1),
      tipp: "Der Sockel ist 8 Meter hoch. Innen ist eine kleine Kapelle." },
    { id: "mosaik", de: "das Mosaik", syl: "Mo-sa-IK", it: "il mosaico", itSyl: "mo-SAI-co", en: "mosaic", x: CX, y: CY + M(yb), kunst: flaeche(M(-2.7), M(-10), M(5.6), M(10), 0.1),
      tipp: "Die Statue ist mit Millionen kleiner Dreiecke aus Speckstein beklebt." },
    { id: "aussichtsplattform", de: "die Aussichtsplattform", syl: "AUS-sichts-platt-form", it: "la terrazza panoramica", itSyl: "ter-RAZ-za pa-no-RA-mi-ca", en: "viewing platform", x: CX, y: CY + M(3.2), kunst: `<g transform="translate(0 ${-M(3.2)})">${besucher}</g>` + flaeche(M(-16), M(-6.4), M(11.5), M(6.4), 0.1) + flaeche(M(4.5), M(-6.4), M(11.5), M(6.4), 0.1),
      tipp: "Von der Plattform sieht man ganz Rio." },
  ];
  S.teil({ oben: true, id: "christusstatue", de: "die Christusstatue", syl: "CHRIS-tus-sta-tu-e", it: "il Cristo Redentore", itSyl: "CRI-sto re-den-TO-re", en: "Christ the Redeemer", x: CX, y: CY, kunst: k,
    zoom: { x: CX - 6.9, y: CY - 7.9, w: 13.8, h: 9.2 },
    unter: unterC,
    tipp: "Die Christusstatue ist 30 Meter hoch. Sie steht seit 1931 auf dem Corcovado." });
}

/* =====================================================================
   4 — DER ZUCKERHUT (nur die Kuppe über Babilônia und Leme; 5,3 km
   entfernt: blasser und bläulicher als die Hügel davor)
   ===================================================================== */
const HUEGEL = [[140, 104], [146, 96], [152, 89], [160, 82], [170, 77], [181, 74], [192, 74.6], [200, 78], [205, 82], [209, 83.4], [214, 82], [221, 79.2], [229, 77.6], [236, 78.4], [242, 81.4], [246, 86], [249, 92], [252.5, 100.6], [140, 100.6]];
{
  const X = 214;
  const um1 = [[203.5, 100], [204.6, 82], [206.6, 73.4], [209.4, 67.4], [212.6, 64.4], [215.6, 64], [218.6, 65.6], [221.4, 69.6], [223.4, 76], [224.8, 86], [225.4, 100]];
  let k = `<path d="M${pts(um1)} Z" fill="${S.lg("zh", [[0, "#7f858d"], [0.5, "#9a9da0"], [0.85, "#bdbab2"], [1, "#d3cfc3"]], 0, 0, 1, 0)}"/>`;
  /* dunkle Regenstreifen im Granit */
  for (let i = 0; i < 10; i++) { const x = 206 + i * 1.8 + rnd() * 0.6; const y0 = 66 + Math.abs(i - 4.5) * 0.9; k += `<path d="M${r(x)} ${r(y0)} q${r(-0.2 + rnd() * 0.4)} 5 ${r(-0.3 + rnd() * 0.6)} ${r(10 + rnd() * 6)}" stroke="#5f6064" stroke-width="${r(0.22 + rnd() * 0.3)}" opacity=".45" fill="none"/>`; }
  /* bewachsene Kuppe */
  k += `<path d="M209.6 67.2 Q214.4 62.8 219.4 66 Q216.6 65.4 214.4 65.6 Q211.8 65.8 209.6 67.2 Z" fill="#647e6a"/>`;
  k += `<path d="M205.4 79 q2.6 -1.4 4.6 .6 q-2 .8 -4.6 1.2 Z" fill="#647e6a" opacity=".8"/>`;
  /* Gegenlicht: Lichtsaum rechts, Dunst der Ferne */
  k += `<path d="M218.6 65.6 Q221.4 69.6 223.4 76" stroke="#fff3d8" stroke-width=".5" fill="none" opacity=".7"/>`;
  k += `<path d="M${pts(um1)} Z" fill="#d3e4ec" opacity=".3"/>`;
  const cid = S.id("zhclip");
  S.def(`<clipPath id="${cid}"><path d="M0 0 L320 0 L320 ${HUEGEL[17][1]} L${pts(HUEGEL.slice(0, 18).reverse())} L0 104 Z"/></clipPath>`);
  S.teil({ id: "zuckerhut", de: "der Zuckerhut", syl: "ZU-cker-hut", it: "il Pan di Zucchero", itSyl: "PAN di ZUC-che-ro", en: "Sugarloaf Mountain", x: X, y: 72, kunst: um(X, 72, `<g clip-path="url(#${cid})">${k}</g>`),
    tipp: "Der Zuckerhut ist ein Felsen aus Granit, 396 Meter hoch. Auf der anderen Seite fährt eine Seilbahn hinauf." });
}

/* =====================================================================
   5 — DAS MEER (Atlantik) — vom Horizont bis zur Brandung (kräftiger
   Shorebreak: rollende Wellen mit weißen Kämmen, nach rechts höher)
   ===================================================================== */
const WASSER_R = 110;   /* Wasserlinie am rechten Bildrand */
const wy = (x, yr) => HY + (yr - HY) * (x - VX) / (320 - VX);   /* Linie zum Fluchtpunkt */
{
  let k = `<path d="M196 100 L320 100 L320 ${WASSER_R} L${VX} 100.3 Z" fill="${S.lg("meer", [[0, "#1c5a8e"], [0.45, "#2878a6"], [0.8, "#3d9fb4"], [1, "#77c8c2"]])}"/>`;
  /* Sonnenglitzern Richtung Sonne (rechts) */
  for (let i = 0; i < 40; i++) { const x = 238 + rnd() * 82, y = 100.2 + rnd() * (wy(x, 104) - 100.4); k += `<rect x="${r(x)}" y="${r(y)}" width="${r(0.8 + rnd() * 2.2 * (x - 230) / 90)}" height=".2" fill="#fffbe8" opacity="${r(0.35 + 0.5 * (x - 230) / 90)}"/>`; }
  /* rollende Wellen: dunkle Wellenfront, darüber der weiße Schaumkamm */
  for (const [yr, st] of [[103.4, 0.55], [105.6, 0.8], [108.3, 1.15]]) {
    const ob = [], un = [], fr = [];
    for (let x = VX + 6; x < 322.5; x += 2.5) {
      const y = wy(x, yr), h = (y - 100) * 0.2 * st * (0.75 + 0.25 * Math.sin(x * 0.31 + yr));
      ob.push([x, y - h * (0.8 + 0.4 * rnd())]); un.push([x, y]); fr.push([x, y + h * 1.3]);
    }
    k += `<path d="M${pts(un)} L${pts(fr.slice().reverse())} Z" fill="#1d6c86" opacity=".55"/>`;
    k += `<path d="M${pts(ob)} L${pts(un.slice().reverse())} Z" fill="#f6fbf9"/>`;
    k += `<path d="M${pts(un)}" stroke="#cfe9ea" stroke-width="${r(0.25 * st)}" fill="none" opacity=".8"/>`;
  }
  /* auslaufendes Wasser auf dem Sand */
  k += `<path d="M${VX + 2} 100.5 L320 ${WASSER_R - 1} L320 ${WASSER_R} L${VX} 100.4 Z" fill="#f4fbf8" opacity=".85"/>`;
  /* Insel Cotunduba vor Leme und ein Frachter auf dem Weg in die Bucht */
  k += `<path d="M280 100.2 Q282 97.6 285 97.4 Q288 97.6 290.4 100.2 Z" fill="#6a8a72"/><path d="M280 100.2 L290.4 100.2" stroke="#e8f4f2" stroke-width=".3"/>`;
  k += `<path d="M300 99.7 L310 99.7 L309 100.4 L301 100.4 Z" fill="#40454c"/><rect x="307" y="98.5" width="1.6" height="1.2" fill="#e8e6e0"/><rect x="302" y="99.1" width="4.4" height=".6" fill="#b34a3a"/>`;
  S.teil({ id: "meer", de: "das Meer", syl: "MEER", it: "il mare", itSyl: "MA-re", en: "sea", x: 298, y: 103.5, kunst: halb(um(298, 103.5, k)),
    tipp: "Das ist der Atlantische Ozean. Die Wellen brechen an der Copacabana oft kräftig am Strand." });
}

/* =====================================================================
   6 — DER HÜGEL (Morro da Babilônia und Morro do Leme mit dem Fort)
   ===================================================================== */
{
  let k = `<path d="M${pts(HUEGEL)} Z" fill="${WALD}"/>`;
  k += `<path d="M${pts(HUEGEL)} Z" fill="${S.lg("huegelluft", [[0, "#9fc3c6", 0.4], [1, "#2f5a3c", 0.08]])}"/>`;
  /* kahle Felswand von Leme zum Meer (rechts, besonnt) */
  k += `<path d="M242 81.4 L246 86 L249 92 L252.5 100.6 L246.6 100.6 L245 93 L242.6 86 Z" fill="${S.lg("lemefels", [[0, "#8f8a80"], [1, "#c9c0ae"]], 0, 0, 1, 0)}"/>`;
  /* das Fort Duque de Caxias oben auf Leme */
  k += `<path d="M226.5 77.9 L227 75.6 L233.6 75.4 L234 77.8 Z" fill="#c9c4b6"/><rect x="228.4" y="74.4" width="3.6" height="1.2" fill="#d9d4c6"/><line x1="232.8" y1="75.4" x2="232.8" y2="71.8" stroke="#555" stroke-width=".15"/><rect x="232.85" y="71.8" width="1.6" height="1" fill="#2f8a4a"/>`;
  k += `<path d="M${pts(HUEGEL.slice(0, 18))}" stroke="#5e8f66" stroke-width=".5" fill="none" opacity=".6"/>`;
  S.teil({ id: "huegel", de: "der Hügel", syl: "HÜ-gel", it: "la collina", itSyl: "col-LI-na", en: "hill", x: 236, y: 88, kunst: um(236, 88, k),
    tipp: "Am Ende der Copacabana liegt der Hügel Leme. Oben steht ein altes Fort." });
}

/* =====================================================================
   7 — DIE FAVELA (Babilônia und Chapéu Mangueira oben am Hang, hinter
   den Hochhäusern). Häuser 3–6 m breit (≈ 0,6–1,2 Einheiten auf 3 km),
   dicht gestaffelt; je Farbe ein einziger Pfad (klein und schnell).
   ===================================================================== */
{
  const farben = ["#c9653f", "#dca56b", "#ece4d2", "#b44c3b", "#9fb8c2", "#e4c35c", "#a06e50", "#da8a72", "#f1ede2"];
  const hang = (x) => {
    for (let i = 0; i < HUEGEL.length - 2; i++) { const [x1, y1] = HUEGEL[i], [x2, y2] = HUEGEL[i + 1]; if (x >= x1 && x <= x2) return y1 + (y2 - y1) * (x - x1) / (x2 - x1); }
    return 100;
  };
  const wege = farben.map(() => []), fenster = [], tanks = [], schatten2 = [];
  for (let y = 80; y < 92; y += 0.95) {
    for (let x = 150 + rnd(); x < 212; x += 0.85 + rnd() * 0.7) {
      if (y < hang(x) + 1.6) continue;
      /* Babilônia (links) dichter, Chapéu Mangueira (rechts unten) lockerer, dazwischen Wald */
      const dicht = x < 196 ? 0.78 : (x > 203 && y > 84 ? 0.6 : 0.25);
      if (rnd() > dicht) continue;
      const w = 0.6 + rnd() * 0.6, h = 0.5 + rnd() * 0.35, c = Math.floor(rnd() * farben.length);
      wege[c].push(`M${r(x)} ${r(y)}h${r(w)}v${r(h)}h${r(-w)}z`);
      schatten2.push(`M${r(x + w - 0.18)} ${r(y)}h.18v${r(h)}h-.18z`);
      if (rnd() < 0.5) fenster.push(`M${r(x + 0.15)} ${r(y + 0.2)}h.18v.18h-.18z`);
      if (rnd() < 0.3) tanks.push(`M${r(x + w * 0.4)} ${r(y - 0.22)}h.3v.22h-.3z`);
    }
  }
  let k = "";
  farben.forEach((c, i) => { if (wege[i].length) k += `<path d="${wege[i].join("")}" fill="${c}"/>`; });
  k += `<path d="${schatten2.join("")}" fill="#000" opacity=".18"/><path d="${fenster.join("")}" fill="#3a2f2a"/><path d="${tanks.join("")}" fill="#2f6fb5"/>`;
  /* Bäume zwischen den Häusern und Luftdunst */
  for (let i = 0; i < 14; i++) { const x = 152 + rnd() * 58, y = Math.max(hang(x) + 2, 80) + rnd() * 10; if (y < 92) k += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(0.6 + rnd() * 0.5)}" fill="#46754e"/>`; }
  k += `<rect x="150" y="79" width="64" height="14" fill="#cfe2ea" opacity=".16"/>`;
  const cid = S.id("favclip");
  S.def(`<clipPath id="${cid}"><path d="M${pts(HUEGEL.slice(0, 18))} L252 100 L140 100 Z"/></clipPath>`);
  S.teil({ id: "favela", de: "die Favela", syl: "Fa-VE-la", it: "la favela", itSyl: "fa-VE-la", en: "favela", x: 175, y: 86, kunst: halb(um(175, 86, `<g clip-path="url(#${cid})">${k}</g>`)),
    tipp: "In der Favela wohnen viele Familien. Ihre Häuser am Hang haben sie oft selbst gebaut." });
}

/* =====================================================================
   8 — DAS HOCHHAUS (die Häuserreihe der Avenida Atlântica)
   Fassaden an der Linie X = −84,8 m; Tiefe Z; Fuß y = 100 + 280/Z.
   ===================================================================== */
const XF = -84.8;
{
  const fx = (Z, dx = 0) => VX + F * (XF - dx) / Z;
  const fy = (Z, H) => HY + F * (1.6 - H) / Z;
  const farben = [["#f2eee4", "#d9d2c2"], ["#efe2cf", "#d3c1a6"], ["#f4e9e6", "#d9c6c0"], ["#e4e9ec", "#c5cdd2"], ["#f6f2e8", "#ddd5c4"], ["#ead9bf", "#cdb895"], ["#f0ebe0", "#d6cfbf"]];
  const bauten = [];
  let Z = 58;
  const hoehen = [41, 36, 30, 24, 27, 35, 22, 30, 38, 26, 33, 28, 36, 24, 31, 35, 27, 30, 33, 25, 30, 28, 32, 26, 30, 28, 30, 26];
  for (let i = 0; Z < 1900; i++) {
    const w = 18 + rnd() * 14, H = hoehen[i % hoehen.length];
    bauten.push({ z0: Z, z1: Z + w, H, c: farben[i % farben.length], tief: 16 + rnd() * 8, glas: i % 3 === 1 });
    Z += w + (rnd() < 0.25 ? 6 + rnd() * 6 : 0.5);
  }
  const quad = (za, zb, h0, h1, d0 = 0, d1 = 0) => [[fx(za, d0), fy(za, h0)], [fx(zb, d0), fy(zb, h0)], [fx(zb, d1), fy(zb, h1)], [fx(za, d1), fy(za, h1)]];
  /* Farben mischen statt Schleier-Flächen: Schatten der Seitenwand und Dunst der Ferne */
  const misch = (a, b2, t) => { const h = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16)); const [p1, p2] = [h(a), h(b2)]; return "#" + p1.map((v, i) => Math.round(v + (p2[i] - v) * t).toString(16).padStart(2, "0")).join(""); };
  let k = "";
  /* von hinten nach vorn zeichnen */
  for (const b of bauten.slice().reverse()) {
    const xa = fx(b.z0), xb = fx(b.z1), ya = fy(b.z0, 0), ta = fy(b.z0, b.H);
    if (xb < -2) continue;
    const dunst = Math.min(0.55, Math.max(0, (b.z0 - 70) / 1600));
    const front = misch(b.c[0], "#d6ebf2", dunst), seite = misch(misch(b.c[1], "#3d4a5a", 0.2), "#d6ebf2", dunst);
    /* Seitenwand (Südwest, im Schatten) */
    const xs = fx(b.z0, b.tief);
    const wand = [[xs, ya], [xa, ya], [xa, ta], [xs, ta]];
    if (xa - xs > 0.25) k += vieleck(wand, `fill="${seite}"`);
    if (xa - xs > 6) for (let s = 1; s * 3 < b.H - 1; s++) { const y = fy(b.z0, s * 3 + 1.2), h = Math.max(0.4, 1.1 * F / b.z0), xw = xs + (xa - xs) * 0.3; k += vieleck([[xw, y], [xw + (xa - xs) * 0.12, y], [xw + (xa - xs) * 0.12, y + h], [xw, y + h]], `fill="#56606c" opacity=".55"`); }
    /* Front zum Meer (Morgensonne) */
    k += vieleck(quad(b.z0, b.z1, 0, b.H), `fill="${front}"`);
    const breit = xb - xa;
    if (breit > 2.2) {
      const n = Math.round(b.H / 3);
      /* Stockwerke: tiefe Loggien (dunkel) und helle Balkonbrüstungen */
      const dunkel = [], hell = [];
      const sub = (p) => { const q = kappe(p); return q.length > 2 ? `M${pts(q)}Z` : ""; };
      for (let s = 1; s < n; s++) {
        const h0 = s * 3;
        dunkel.push(sub(quad(b.z0 + 0.6, b.z1 - 0.6, h0 + 0.25, h0 + 2.75)));
        if (breit > 5) hell.push(sub(quad(b.z0 + 0.6, b.z1 - 0.6, h0 + 0.25, h0 + 1.15, -0.25, -0.25)));
      }
      k += `<path d="${dunkel.join("")}" fill="${b.glas ? "#6f8ea6" : "#55697b"}" opacity="${breit > 8 ? 0.82 : 0.55}"/>`;
      if (hell.length) k += `<path d="${hell.join("")}" fill="${b.glas ? "#cfe3ea" : "#fbfaf6"}" opacity="${b.glas ? 0.75 : 0.92}"/>`;
      /* senkrechte Teilung (Wohnungen, Pfeiler) */
      if (breit > 8) for (let zz = b.z0 + 3.4; zz < b.z1 - 1; zz += 3.4) if (fx(zz) > 0) k += `<line x1="${r(fx(zz))}" y1="${r(fy(zz, 3))}" x2="${r(fx(zz))}" y2="${r(Math.max(0, fy(zz, b.H - 0.4)))}" stroke="${b.c[0]}" stroke-width="${r(Math.max(0.2, 0.32 * F / zz))}"/>`;
      /* Erdgeschoss: Läden mit Markisen */
      k += vieleck(quad(b.z0, b.z1, 0, 3), `fill="#3b3a3a" opacity=".55"`);
      if (breit > 8) for (let j = 0; j < 3; j++) { const za = b.z0 + (j + 0.15) * (b.z1 - b.z0) / 3, zb = za + (b.z1 - b.z0) / 4; k += vieleck(quad(za, zb, 3.3, 2.6, 0, -1.5), `fill="${["#c0392b", "#2e7d5b", "#e0a83a"][j]}"`); }
      /* Dachaufbauten: Maschinenraum, Wassertank */
      const zm = b.z0 + (b.z1 - b.z0) * 0.35;
      /* Maschinenraum als Quader 3 m hinter der Dachkante: Front und Seitenwand */
      k += vieleck([[fx(zm, 3), fy(zm, b.H)], [fx(zm, 7), fy(zm, b.H)], [fx(zm, 7), fy(zm, b.H + 2.6)], [fx(zm, 3), fy(zm, b.H + 2.6)]], `fill="${b.c[1]}" opacity=".9"`);
      k += vieleck(quad(zm, zm + 4, b.H, b.H + 2.6, 3, 3), `fill="${b.c[0]}"`);
    }
    /* Lichtkante an der vorderen Ecke, Dachkante */
    if (xa > 0 && breit > 1.5) k += `<line x1="${r(xa)}" y1="${r(Math.max(0, ta))}" x2="${r(xa)}" y2="${r(ya)}" stroke="#ffffff" stroke-width="${r(Math.min(0.6, breit * 0.05))}" opacity=".6"/>`;
    if (dunst > 0.05 && breit > 2.2) k += vieleck([[xs, ya], [xb, fy(b.z1, 0)], [xb, fy(b.z1, b.H + 2.6)], [xa, fy(b.z0, b.H + 2.6)], [xs, ta]], `fill="#d6ebf2" opacity="${r(dunst * 0.8)}"`);
  }
  const cid = S.id("hausclip");
  S.def(`<clipPath id="${cid}"><path d="M0 0 L${VX} 0 L${VX} 100.2 L0 104.2 Z"/></clipPath>`);
  S.teil({ id: "hochhaus", de: "das Hochhaus", syl: "HOCH-haus", it: "il palazzo", itSyl: "pa-LAZ-zo", en: "high-rise", x: 40, y: 62, kunst: halb(um(40, 62, `<g clip-path="url(#${cid})">${k}</g>`)),
    tipp: "An der Avenida Atlântica stehen die Hochhäuser dicht an dicht – alle mit Blick aufs Meer." });
}

/* =====================================================================
   KULISSE vorn: die Avenida Atlântica (zwei Fahrbahnen, Mittelstreifen)
   ===================================================================== */
const linie = (y0) => (x) => HY + (y0 - HY) * (VX - x) / VX;   /* Gerade von (0|y0) zum Fluchtpunkt */
const BORD = linie(120), STRANDKANTE = linie(177.9), HAUSFUSS = linie(104.2);
{
  let k = `<path d="M0 104.2 L${VX} 100 L0 120 Z" fill="${S.lg("asphalt", [[0, "#8a8c8f"], [1, "#55585c"]])}"/>`;
  /* Gehweg an den Häusern, Mittelstreifen mit Mosaik und Bäumen */
  k += `<path d="M0 104.2 L${VX} 100 L0 105.6 Z" fill="#cfcabd"/>`;
  const mitte = linie(111.6), mitte2 = linie(112.5);
  k += `<path d="M0 111.6 L${VX} 100 L0 112.5 Z" fill="#e8e4da"/>`;
  for (let x = 2; x < 190; x += 6 + x * 0.05) k += `<rect x="${r(x)}" y="${r(mitte(x) + 0.1)}" width="${r(1.6 - x * 0.007)}" height="${r(Math.max(0.15, (mitte2(x) - mitte(x)) * 0.6))}" fill="${x % 3 < 1.5 ? "#2b2b2b" : "#a5452e"}"/>`;
  /* Fahrbahnmarkierung (weiß gestrichelt) */
  for (const y0 of [108.3, 116.2]) { const l = linie(y0); for (let x = 0; x < 196; x += 9 - x * 0.035) k += `<line x1="${r(x)}" y1="${r(l(x))}" x2="${r(x + 4 - x * 0.016)}" y2="${r(l(x + 4 - x * 0.016))}" stroke="#f2f2ea" stroke-width="${r(0.35 - x * 0.0013)}"/>`; }
  /* Bordstein zum Calçadão */
  k += `<path d="M0 119.3 L${VX} 100 L0 120.6 Z" fill="#d9d4c8"/>`;
  S.hinten(k);
}

/* =====================================================================
   9 — DAS TAXI (gelb mit blauem Streifen) auf der Avenida Atlântica
   fährt Richtung Leme: man sieht Heck und rechte Seite. Gebaut als
   Körper im Raum (X seitlich, Y Höhe, Z Tiefe) und in das Bild gerechnet.
   ===================================================================== */
{
  const P = (X, Y, Z) => [VX + F * X / Z, HY + F * (1.6 - Y) / Z];
  const XR = -24.6, XL = XR - 1.76, Z0 = 24, LG = 4.2;
  /* Seitenprofil [z vom Heck, y]: Kofferraum, Heckscheibe, Dach, Frontscheibe, Haube */
  const prof = [[0, 0.32], [0, 0.98], [0.12, 1.02], [0.8, 1.04], [1.28, 1.44], [2.74, 1.46], [3.26, 1.02], [4.1, 0.94], [LG, 0.72], [LG, 0.32]];
  const seite = (X) => prof.map(([z, y]) => P(X, y, Z0 + z));
  const [x0, y0] = P(XR, 0, Z0);              /* Bezugspunkt: hinteres rechtes Eck am Boden */
  const rel = (p) => [p[0] - x0, p[1] - y0];
  const poly = (a) => `M${pts(a.map(rel))} Z`;
  const GELB = S.lg("taxigelb", [[0, "#ffd84f"], [0.55, "#f4c021"], [1, "#d89c0e"]]);
  let k = "";
  /* Schatten auf dem Asphalt (nach links vorn) */
  k += `<path d="${poly([P(XR + 0.2, 0, Z0 - 0.4), P(XR + 0.2, 0, Z0 + LG), P(XL - 0.8, 0, Z0 + LG), P(XL - 0.8, 0, Z0 - 0.4)])}" fill="#1b1d22" opacity=".35" filter="url(#bw_weich)"/>`;
  /* Dach (zwischen den Seiten) */
  k += `<path d="${poly([P(XR - 0.08, 1.46, Z0 + 1.38), P(XR - 0.08, 1.46, Z0 + 2.88), P(XL + 0.08, 1.46, Z0 + 2.88), P(XL + 0.08, 1.46, Z0 + 1.38)])}" fill="#f8d243"/>`;
  /* Kofferraumdeckel */
  k += `<path d="${poly([P(XR, 1.02, Z0 + 0.12), P(XR, 1.04, Z0 + 0.85), P(XL, 1.04, Z0 + 0.85), P(XL, 1.02, Z0 + 0.12)])}" fill="#f6cd38"/>`;
  /* Heckscheibe */
  k += `<path d="${poly([P(XR - 0.1, 1.06, Z0 + 0.88), P(XR - 0.1, 1.43, Z0 + 1.36), P(XL + 0.1, 1.43, Z0 + 1.36), P(XL + 0.1, 1.06, Z0 + 0.88)])}" fill="#2c3b49"/>`;
  /* Heck (frontal) */
  k += `<path d="${poly([P(XR, 0.32, Z0), P(XR, 0.98, Z0), P(XR - 0.1, 1.02, Z0 + 0.12), P(XL + 0.1, 1.02, Z0 + 0.12), P(XL, 0.98, Z0), P(XL, 0.32, Z0)])}" fill="#e9b41a"/>`;
  /* rechte Seite */
  k += `<path d="M${pts(seite(XR).map(rel))} Z" fill="${GELB}"/>`;
  /* Seitenfenster mit Mittelpfosten */
  const fen = [[0.9, 1.08], [1.33, 1.4], [2.7, 1.41], [3.14, 1.08]].map(([z, y]) => P(XR, y, Z0 + z));
  k += `<path d="${poly(fen)}" fill="#2c3b49"/>`;
  const [ma, mb] = [P(XR, 1.08, Z0 + 2.1), P(XR, 1.42, Z0 + 2.1)];
  k += `<line x1="${r(ma[0] - x0)}" y1="${r(ma[1] - y0)}" x2="${r(mb[0] - x0)}" y2="${r(mb[1] - y0)}" stroke="#f2c021" stroke-width=".7"/>`;
  k += `<path d="${poly([P(XR, 1.36, Z0 + 1.5), P(XR, 1.38, Z0 + 2.0), P(XR, 1.12, Z0 + 2.0), P(XR, 1.1, Z0 + 1.1)])}" fill="#ffffff" opacity=".18"/>`;
  /* blauer Streifen */
  k += `<path d="${poly([P(XR, 0.66, Z0), P(XR, 0.66, Z0 + LG), P(XR, 0.56, Z0 + LG), P(XR, 0.56, Z0)])}" fill="#1f5fae"/>`;
  /* Türfugen, Griff, Spiegel */
  for (const z of [1.2, 2.2, 3.2]) { const [a, b] = [P(XR, 0.38, Z0 + z), P(XR, 1.02, Z0 + z)]; k += `<line x1="${r(a[0] - x0)}" y1="${r(a[1] - y0)}" x2="${r(b[0] - x0)}" y2="${r(b[1] - y0)}" stroke="#b9860c" stroke-width=".22"/>`; }
  /* Räder (rechts sichtbar, Ellipsen in der Seitenebene) */
  for (const z of [0.78, 3.4]) {
    const [cx, cy] = rel(P(XR + 0.02, 0.32, Z0 + z)), rr = 0.32 * F / (Z0 + z);
    k += `<ellipse cx="${r(cx)}" cy="${r(cy)}" rx="${r(rr * 0.82)}" ry="${r(rr)}" fill="#1b1b1d"/><ellipse cx="${r(cx + 0.2)}" cy="${r(cy)}" rx="${r(rr * 0.42)}" ry="${r(rr * 0.52)}" fill="#a3a9ae"/>`;
  }
  /* linkes Hinterrad: unter dem Stoßfänger in der Achsebene sichtbar */
  k += `<path d="${poly([P(XL + 0.02, 0, Z0 + 0.78), P(XL + 0.27, 0, Z0 + 0.78), P(XL + 0.27, 0.26, Z0 + 0.78), P(XL + 0.02, 0.26, Z0 + 0.78)])}" fill="#1b1b1d"/>`;
  /* Rücklichter, Kennzeichen (Mercosul: weiß mit blauem Band), Stoßstange */
  const hp = (X, Y) => rel(P(X, Y, Z0));
  const lr = (X1, Y1, X2, Y2, c) => { const [a, b] = [hp(X1, Y1), hp(X2, Y2)]; return `<rect x="${r(Math.min(a[0], b[0]))}" y="${r(Math.min(a[1], b[1]))}" width="${r(Math.abs(b[0] - a[0]))}" height="${r(Math.abs(b[1] - a[1]))}" rx=".3" fill="${c}"/>`; };
  k += lr(XR - 0.05, 0.92, XR - 0.42, 0.74, "#c4161c") + lr(XL + 0.05, 0.92, XL + 0.42, 0.74, "#c4161c");
  k += lr(XR - 0.62, 0.66, XL + 0.62, 0.5, "#f4f4f0") + lr(XR - 0.62, 0.66, XL + 0.62, 0.62, "#1f4f9e");
  k += lr(XR + 0.04, 0.44, XL - 0.04, 0.24, "#2c2c30");
  /* Taxischild auf dem Dach */
  const [sa, sb] = [rel(P(XR - 0.55, 1.46, Z0 + 2)), rel(P(XL + 0.55, 1.68, Z0 + 2))];
  k += `<rect x="${r(sb[0])}" y="${r(sb[1])}" width="${r(sa[0] - sb[0])}" height="${r(sa[1] - sb[1])}" rx=".3" fill="#f4f1e6"/><text x="${r((sa[0] + sb[0]) / 2)}" y="${r(sa[1] - 0.4)}" font-size="1.25" text-anchor="middle" fill="#1f4f9e" font-family="Arial" font-weight="bold">TAXI</text>`;
  /* Lichtkante */
  k += `<path d="M${pts([P(XR, 1.0, Z0 + 0.1), P(XR, 0.96, Z0 + 4.1)].map(rel))}" stroke="#fff6cc" stroke-width=".35" opacity=".8"/>`;
  S.teil({ id: "taxi", de: "das Taxi", syl: "TA-xi", it: "il taxi", itSyl: "TA-xi", en: "taxi", x: x0, y: y0, kunst: k,
    tipp: "Die Taxis in Rio sind gelb und haben einen blauen Streifen." });
}

/* =====================================================================
   10 — DIE PROMENADE (Calçadão) — schwarze Wellen auf Weiß,
        parallel zum Meer
   ===================================================================== */
{
  const XB = -16.96, XS = -4.354;            /* Bordstein und Strandkante (Meter) */
  let k = `<path d="M0 120.6 L${VX} 100 L0 ${r(STRANDKANTE(0))} Z" fill="${S.lg("calc", [[0, "#e7e1d3"], [1, "#f6f2e8"]])}"/>`;
  /* Wellenbänder: Mitte X_k, Breite 0,5 m, Ausschlag 0,4 m, Wellenlänge 3,4 m */
  const cid = S.id("calcclip");
  S.def(`<clipPath id="${cid}"><path d="M0 120.6 L${VX} 100 L0 ${r(STRANDKANTE(0))} Z"/></clipPath>`);
  let w = "";
  for (let i = 0; i < 12; i++) {
    const Xk = XB + 0.75 + i * 1.03;
    /* Stützpunkte: 7 je Wellenlänge, solange die Welle im Bild größer als ~0,5 Einheiten ist */
    const zs = [];
    for (let Z = 3.2; Z < 44; Z += 3.4 / 5.5) zs.push(Z);
    zs.push(70, 140, 400);
    const amp = (Z) => Z < 44 ? 0.4 * Math.min(1, Math.max(0, (44 - Z) / 14)) : 0;
    const kante = (d) => zs.map((Z) => boden(Xk + d + amp(Z) * Math.sin(2 * Math.PI * Z / 3.4 + i * 0.2), Z));
    const l = kante(-0.26), rr = kante(0.26).reverse();
    w += vieleck([...l, ...rr], `fill="#262626"`);
  }
  k += `<g clip-path="url(#${cid})">${w}</g>`;
  /* Fugen- und Steinstruktur: feiner Glanz, Verschmutzung zum Rand */
  k += `<path d="M0 120.6 L${VX} 100 L0 ${r(STRANDKANTE(0))} Z" fill="${S.lg("calclicht", [[0, "#ffffff", 0], [0.6, "#ffffff", 0.06], [1, "#ffffff", 0.18]], 0, 0, 1, 0)}"/>`;
  /* Sand weht auf den Rand */
  for (let i = 0; i < 26; i++) { const x = rnd() * 196, y = STRANDKANTE(x) - rnd() * 2.4 * (STRANDKANTE(x) - 100) / 78; k += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(0.6 + (y - 100) * 0.05)}" ry="${r(0.2 + (y - 100) * 0.012)}" fill="#e9d6ab" opacity=".7"/>`; }
  S.teil({ id: "promenade", de: "die Promenade", syl: "Pro-me-NA-de", it: "il lungomare", itSyl: "lun-go-MA-re", en: "promenade", x: 40, y: 150, kunst: halb(um(40, 150, k)),
    tipp: "Das Wellenmuster aus schwarzen und weißen Steinen ist 4 Kilometer lang." });
}

/* =====================================================================
   11 — DER STRAND (feiner heller Sand, in der Ferne viele Schirme)
   ===================================================================== */
{
  let k = `<path d="M-1 ${r(STRANDKANTE(-1))} L${VX} 100 L${VX} 100.3 L320 ${WASSER_R} L320 200 L-1 200 Z" fill="${S.lg("sand", [[0, "#f4e7c9"], [0.25, "#efdcb3"], [1, "#e6c993"]])}"/>`;
  /* nasser Sand an der Wasserlinie */
  k += `<path d="M${VX} 100.35 L320 ${WASSER_R} L320 ${WASSER_R + 1.8} L${VX} 100.5 Z" fill="#cdb58a" opacity=".7"/>`;
  /* Kante zum Calçadão: niedrige Stufe */
  k += `<path d="M-1 ${r(STRANDKANTE(-1))} L${VX} 100 L-1 ${r(STRANDKANTE(-1) + 2.2)} Z" fill="#cbb489" opacity=".7"/>`;
  /* Windrippel und Fußspuren (perspektivisch kleiner) */
  for (let i = 0; i < 46; i++) {
    const y = 106 + Math.pow(rnd(), 1.5) * 92, xmin = Math.max(-1, VX - VX * (y - HY) / (177.9 - HY) + 3), x = xmin + rnd() * (320 - xmin);
    if (y < wy(x, WASSER_R) + 2.5) continue;
    const s = sy(y);
    if (x + 0.5 * s > 319) continue;
    k += `<path d="M${r(x)} ${r(y)} q${r(0.25 * s)} ${r(-0.04 * s)} ${r(0.5 * s)} 0" stroke="#d2b783" stroke-width="${r(Math.max(0.15, 0.012 * s))}" fill="none" opacity=".7"/>`;
  }
  for (let i = 0; i < 9; i++) {
    const y = 140 + i * 6.4, x = 150 - i * 9 + (i % 2) * 2.4, s = sy(y);
    k += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(0.045 * s)}" ry="${r(0.018 * s)}" fill="#c9a66a" opacity=".38" transform="rotate(-20 ${r(x)} ${r(y)})"/>`;
  }
  /* ferne Sonnenschirme und Badegäste am Strand Richtung Leme */
  const schirmF = ["#e84a3c", "#f2c230", "#2f8fd0", "#3aa35a", "#f08a2c", "#ffffff", "#c43a8a"];
  for (let i = 0; i < 34; i++) {
    const Z = 30 + Math.pow(rnd(), 1.4) * 700, X = -2 + rnd() * 24;
    const [x, y] = boden(X, Z);
    if (x > 318 || y < 100.3 || y < wy(x, WASSER_R) + 0.6) continue;
    const s = F / Z;
    k += `<line x1="${r(x)}" y1="${r(y)}" x2="${r(x)}" y2="${r(y - 2.1 * s)}" stroke="#777" stroke-width="${r(Math.max(0.08, 0.04 * s))}"/>`;
    k += `<path d="M${r(x - 1 * s)} ${r(y - 1.9 * s)} Q${r(x)} ${r(y - 2.5 * s)} ${r(x + 1 * s)} ${r(y - 1.9 * s)} Z" fill="${schirmF[i % schirmF.length]}"/>`;
    if (rnd() < 0.5) {
      /* kleine Badegäste: Beine, Badekleidung, Oberkörper, Kopf */
      const hx = x + 0.6 * s, haut = ["#8d5a3b", "#d7a179", "#5e3a26", "#c28e62"][i % 4], bad = ["#d23f33", "#1d4fa0", "#139a43", "#f6d21e"][i % 4];
      k += `<path d="M${r(hx - 0.12 * s)} ${r(y)} L${r(hx - 0.07 * s)} ${r(y - 0.8 * s)} M${r(hx + 0.12 * s)} ${r(y)} L${r(hx + 0.07 * s)} ${r(y - 0.8 * s)}" stroke="${haut}" stroke-width="${r(Math.max(0.1, 0.1 * s))}"/>`;
      k += `<rect x="${r(hx - 0.16 * s)}" y="${r(y - 1.38 * s)}" width="${r(0.32 * s)}" height="${r(0.6 * s)}" rx="${r(0.08 * s)}" fill="${haut}"/><rect x="${r(hx - 0.16 * s)}" y="${r(y - 0.95 * s)}" width="${r(0.32 * s)}" height="${r(0.18 * s)}" fill="${bad}"/>`;
      k += `<circle cx="${r(hx)}" cy="${r(y - 1.5 * s)}" r="${r(0.12 * s)}" fill="#2a1d16"/>`;
    }
  }
  /* zwei Barracas (Strandbuden) mit Fahne, Kühlbox und gestapelten Stühlen */
  for (const [X, Z, fahne] of [[11, 46, "#f2c230"], [5.5, 80, "#2f8fd0"]]) {
    const [x, y] = boden(X, Z), s = F / Z;
    k += `<line x1="${r(x)}" y1="${r(y)}" x2="${r(x)}" y2="${r(y - 3.2 * s)}" stroke="#6b6b66" stroke-width="${r(Math.max(0.12, 0.05 * s))}"/>`;
    k += `<path d="M${r(x)} ${r(y - 3.2 * s)} l${r(1.1 * s)} ${r(0.15 * s)} l${r(-0.1 * s)} ${r(0.65 * s)} l${r(-1 * s)} ${r(-0.1 * s)} Z" fill="${fahne}"/>`;
    k += `<rect x="${r(x + 0.2 * s)}" y="${r(y - 0.45 * s)}" width="${r(0.7 * s)}" height="${r(0.45 * s)}" fill="#f2f2ee"/><rect x="${r(x + 0.2 * s)}" y="${r(y - 0.45 * s)}" width="${r(0.7 * s)}" height="${r(0.1 * s)}" fill="#2f8fd0"/>`;
    for (let j = 0; j < 4; j++) k += `<path d="M${r(x - 1.2 * s + j * 0.08 * s)} ${r(y - j * 0.12 * s)} l${r(0.55 * s)} 0 l${r(0.1 * s)} ${r(-0.5 * s)}" stroke="#c9ced2" stroke-width="${r(Math.max(0.1, 0.04 * s))}" fill="none"/>`;
    for (let j = 0; j < 3; j++) { const [cx2, cy2] = boden(X - 1.6 - j * 1.4, Z + 1.2); k += `<rect x="${r(cx2 - 0.25 * s)}" y="${r(cy2 - 0.5 * s)}" width="${r(0.5 * s)}" height="${r(0.5 * s)}" fill="${["#f08a2c", "#3aa35a", "#f2c230"][j]}"/>`; }
  }
  /* Futevôlei: Netz quer zum Strand, vier Spieler in Badekleidung (von der Seite gesehen) */
  {
    const Zn = 28, [n0x, n0y] = boden(-1, Zn), [n1x] = boden(5, Zn), sN = F / Zn;
    const netzO = HY + F * (1.6 - 2.2) / Zn, netzU = HY + F * (1.6 - 1.2) / Zn;
    k += `<line x1="${r(n0x)}" y1="${r(n0y)}" x2="${r(n0x)}" y2="${r(netzO)}" stroke="#555" stroke-width=".35"/><line x1="${r(n1x)}" y1="${r(n0y)}" x2="${r(n1x)}" y2="${r(netzO)}" stroke="#555" stroke-width=".35"/>`;
    k += `<rect x="${r(n0x)}" y="${r(netzO)}" width="${r(n1x - n0x)}" height="${r(netzU - netzO)}" fill="none" stroke="#3a3a3a" stroke-width=".15"/>`;
    let ma = "";
    for (let x = n0x + 0.8; x < n1x; x += 0.8) ma += `M${r(x)} ${r(netzO)}V${r(netzU)}`;
    for (let y = netzO + 0.5; y < netzU; y += 0.5) ma += `M${r(n0x)} ${r(y)}H${r(n1x)}`;
    k += `<path d="${ma}" stroke="#3a3a3a" stroke-width=".06" opacity=".7"/><rect x="${r(n0x)}" y="${r(netzO - 0.1)}" width="${r(n1x - n0x)}" height=".35" fill="#f4f4f0"/>`;
    const spieler = (X, Z, haut, hose, arm) => {
      const [x, y] = boden(X, Z), s = F / Z, h = 1.75 * s;
      let g = `<ellipse cx="${r(x - 0.8 * s)}" cy="${r(y + 0.05 * s)}" rx="${r(0.6 * s)}" ry="${r(0.08 * s)}" fill="#7a5a2a" opacity=".25"/>`;
      g += `<path d="M${r(x - 0.1 * s)} ${r(y)} L${r(x - 0.05 * s)} ${r(y - 0.85 * s)} M${r(x + 0.14 * s)} ${r(y)} L${r(x + 0.06 * s)} ${r(y - 0.85 * s)}" stroke="${haut}" stroke-width="${r(0.13 * s)}" stroke-linecap="round"/>`;
      g += `<path d="M${r(x - 0.17 * s)} ${r(y - 0.84 * s)} L${r(x + 0.17 * s)} ${r(y - 0.84 * s)} L${r(x + 0.16 * s)} ${r(y - 1.02 * s)} L${r(x - 0.16 * s)} ${r(y - 1.02 * s)} Z" fill="${hose}"/>`;
      g += `<path d="M${r(x - 0.17 * s)} ${r(y - 1.0 * s)} Q${r(x - 0.2 * s)} ${r(y - 1.4 * s)} ${r(x - 0.14 * s)} ${r(y - 1.5 * s)} L${r(x + 0.14 * s)} ${r(y - 1.5 * s)} Q${r(x + 0.2 * s)} ${r(y - 1.4 * s)} ${r(x + 0.17 * s)} ${r(y - 1.0 * s)} Z" fill="${haut}"/>`;
      g += `<path d="M${r(x - 0.13 * s)} ${r(y - 1.46 * s)} l${r(arm[0] * s)} ${r(arm[1] * s)} M${r(x + 0.13 * s)} ${r(y - 1.46 * s)} l${r(arm[2] * s)} ${r(arm[3] * s)}" stroke="${haut}" stroke-width="${r(0.09 * s)}" stroke-linecap="round"/>`;
      g += `<circle cx="${r(x)}" cy="${r(y - 1.63 * s)}" r="${r(0.12 * s)}" fill="${haut}"/><path d="M${r(x - 0.12 * s)} ${r(y - 1.66 * s)} a${r(0.12 * s)} ${r(0.12 * s)} 0 0 1 ${r(0.24 * s)} 0 Z" fill="#231915"/>`;
      return g;
    };
    k += spieler(1, 33, "#8d5a3b", "#d23f33", [-0.25, 0.4, 0.25, 0.4]) + spieler(4.5, 33, "#c28e62", "#1d4fa0", [-0.2, -0.45, 0.25, 0.4]);
    /* Ball über dem Netz, darunter sein Schatten */
    const [bx, by] = boden(2.6, 26);
    k += `<circle cx="${r(bx)}" cy="${r(HY + F * (1.6 - 2.9) / 26)}" r=".6" fill="#f6d21e" stroke="#1d4fa0" stroke-width=".15"/><ellipse cx="${r(bx - 1)}" cy="${r(by)}" rx=".7" ry=".2" fill="#7a5a2a" opacity=".3"/>`;
    k += spieler(0.4, 24, "#5e3a26", "#139a43", [-0.3, 0.35, 0.3, -0.5]) + spieler(4, 24, "#d7a179", "#f6d21e", [-0.3, 0.4, 0.28, 0.35]);
  }
  S.teil({ id: "strand", de: "der Strand", syl: "STRAND", it: "la spiaggia", itSyl: "SPIAG-gia", en: "beach", x: 205, y: 122, kunst: halb(um(205, 122, k)),
    tipp: "Die Copacabana ist vier Kilometer lang. Hier spielt man Futevôlei – Volleyball, aber ohne Hände!" });
}

/* =====================================================================
   DER RETTUNGSTURM (Posto 5) nahe am Wasser — Form vereinfacht: Stahl-
   gestell, Kabine mit Fenstern, Schild, rote Fahne (= gefährliche Strömung)
   ===================================================================== */
{
  const Xt = 13, Zt = 40, [x0, y0] = boden(Xt, Zt), s = F / Zt;   /* ≈ 4,4 Einheiten je Meter */
  const P = (X, Y, Z) => [VX + F * X / Z - x0, HY + F * (1.6 - Y) / Z - y0];
  const bein = (X, Z) => { const [a, b] = [P(X, 0, Z), P(X, 3, Z)]; return `<line x1="${r(a[0])}" y1="${r(a[1])}" x2="${r(b[0])}" y2="${r(b[1])}" stroke="#d8dcde" stroke-width=".45"/>`; };
  let k = `<path d="M${pts([P(Xt - 1, 0, Zt - 1), P(Xt + 1, 0, Zt - 1), P(Xt - 2, 0, Zt + 6), P(Xt - 5, 0, Zt + 5)])} Z" fill="#7a5a2a" opacity=".2"/>`;
  k += bein(Xt - 1, Zt + 1) + bein(Xt + 1, Zt + 1) + bein(Xt - 1, Zt - 1) + bein(Xt + 1, Zt - 1);
  /* Streben und Leiter */
  k += `<path d="M${pts([P(Xt - 1, 0.2, Zt - 1), P(Xt + 1, 2.4, Zt - 1)])} M${pts([P(Xt + 1, 0.2, Zt - 1), P(Xt - 1, 2.4, Zt - 1)])}" stroke="#b9bfc3" stroke-width=".25"/>`;
  for (let y = 0.4; y < 3; y += 0.4) { const [a, b] = [P(Xt - 0.6, y, Zt - 1.6), P(Xt + 0.2, y, Zt - 1.6)]; k += `<line x1="${r(a[0])}" y1="${r(a[1])}" x2="${r(b[0])}" y2="${r(b[1])}" stroke="#c9ced2" stroke-width=".18"/>`; }
  /* Plattform und Kabine (weiß, roter Streifen), Fenster zum Meer */
  k += `<path d="M${pts([P(Xt - 1.3, 3, Zt - 1.3), P(Xt + 1.3, 3, Zt - 1.3), P(Xt + 1.3, 3.2, Zt - 1.3), P(Xt - 1.3, 3.2, Zt - 1.3)])} Z" fill="#9aa1a6"/>`;
  k += `<path d="M${pts([P(Xt - 1.1, 3.2, Zt - 1.1), P(Xt + 1.1, 3.2, Zt - 1.1), P(Xt + 1.1, 5.0, Zt - 1.1), P(Xt - 1.1, 5.0, Zt - 1.1)])} Z" fill="${S.lg("kabine", [[0, "#cfd4d6"], [1, "#fbfbf8"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${pts([P(Xt - 1.1, 3.5, Zt - 1.1), P(Xt + 1.1, 3.5, Zt - 1.1), P(Xt + 1.1, 3.8, Zt - 1.1), P(Xt - 1.1, 3.8, Zt - 1.1)])} Z" fill="#d23f33"/>`;
  k += `<path d="M${pts([P(Xt - 0.85, 4.1, Zt - 1.1), P(Xt + 0.85, 4.1, Zt - 1.1), P(Xt + 0.85, 4.75, Zt - 1.1), P(Xt - 0.85, 4.75, Zt - 1.1)])} Z" fill="#3b5566"/>`;
  k += `<path d="M${pts([P(Xt - 1.5, 5.0, Zt - 1.5), P(Xt + 1.5, 5.0, Zt - 1.5), P(Xt + 1.1, 5.4, Zt), P(Xt - 1.1, 5.4, Zt)])} Z" fill="#d23f33"/>`;
  const [tx, ty] = P(Xt, 3.32, Zt - 1.15);
  k += `<text x="${r(tx)}" y="${r(ty)}" font-size="1.05" text-anchor="middle" fill="#1d4fa0" font-family="Arial" font-weight="bold">POSTO 5</text>`;
  /* Fahnenmast mit roter Fahne */
  const [m0, m1] = [P(Xt + 1.2, 5, Zt - 1.2), P(Xt + 1.2, 7.4, Zt - 1.2)];
  k += `<line x1="${r(m0[0])}" y1="${r(m0[1])}" x2="${r(m1[0])}" y2="${r(m1[1])}" stroke="#777" stroke-width=".18"/><path d="M${r(m1[0])} ${r(m1[1])} l3.4 .5 l-.2 2 l-3.2 -.3 Z" fill="#e0262a"/>`;
  S.teil({ id: "rettungsturm", de: "der Rettungsturm", syl: "RET-tungs-turm", it: "la torretta del bagnino", itSyl: "tor-RET-ta del ba-GNI-no", en: "lifeguard tower", x: x0, y: y0, steht: true, kunst: k,
    tipp: "Am Posto 5 passen Rettungsschwimmer auf. Die rote Fahne heißt: Vorsicht, starke Strömung!" });
}

/* =====================================================================
   12 — DER KIOSK (runder Glaspavillon mit weißem Dach) — Lupe:
        Kokosnuss, Açaí-Schale; 13 — DIE FLAGGE auf dem Dach
   ===================================================================== */
const KI = { x: 104, y: 134 };
const KS = sy(KI.y);                           /* 21,25 Einheiten je Meter */
/* im Raum: Mitte des Kiosks bei Tiefe ZK, seitlich XK; Glaskörper r = 1,3 m,
   Theke 1,05 m hoch (ragt 0,3 m vor), Dach 2,5–2,68 m, r = 1,8 m */
const ZK = F * 1.6 / (KI.y - HY), XK = (KI.x - VX) * ZK / F;
const PK = (X, Y, Z) => [VX + F * (XK + X) / (ZK + Z) - KI.x, HY + F * (1.6 - Y) / (ZK + Z) - KI.y];
const bogen = (R, Y, a0, a1, n = 18) => Array.from({ length: n + 1 }, (_, i) => { const a = a0 + (a1 - a0) * i / n; return PK(R * Math.cos(a), Y, R * Math.sin(a)); });
const KR = 1.3 * KS, KH = 2.5 * KS;
/* Höhe der Theke (Oberkante des Glaskörpers vorn) an der Bildstelle dx */
const thekeY = (dx, R = 1.3, Y = 1.05) => { const c = Math.max(-1, Math.min(1, dx / (R * F / ZK))); return PK(R * c, Y, -R * Math.sqrt(1 - c * c))[1]; };
const THEKE = KI.y + thekeY(14);
const kioskUnter = [];
{
  /* sichtbare Hälfte: zum Betrachter gewandt (der Kiosk steht links vom Blick, darum gedreht) */
  const DREH = Math.atan2(-ZK, -XK), VORN = [DREH + Math.PI / 2, DREH - Math.PI / 2].sort((a, b) => b - a);
  let k = `<ellipse cx="-9" cy="2" rx="${r(KR * 1.3)}" ry="6" fill="#1b120a" opacity=".3" filter="url(#bw_weich)"/>`;
  /* Unterseite des Daches (über der Augenhöhe: man sieht von unten hinein) */
  k += `<path d="M${pts(bogen(1.8, 2.5, 0, 2 * Math.PI, 36))} Z" fill="#c3c9cc"/>`;
  /* Sockelwand (weiß, rund) unter der Theke */
  const wand = [...bogen(1.3, 0, ...VORN), ...bogen(1.3, 1.0, VORN[1], VORN[0])];
  k += `<path d="M${pts(wand)} Z" fill="${S.lg("kwand", [[0, "#9ea4a7"], [0.45, "#c6cbcd"], [0.85, "#e4e7e8"], [1, "#fbfbf9"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${pts([...bogen(1.3, 0, ...VORN), ...bogen(1.3, 0.1, VORN[1], VORN[0])])} Z" fill="#2e7d5b"/>`;
  k += `<path d="M${pts([...bogen(1.3, 0.86, ...VORN), ...bogen(1.3, 1.0, VORN[1], VORN[0])])} Z" fill="#000" opacity=".12"/>`;
  const [tx, ty] = PK(1.3 * Math.cos(DREH), 0.5, 1.3 * Math.sin(DREH)), [ux, uy] = PK(1.3 * Math.cos(DREH), 0.3, 1.3 * Math.sin(DREH));
  k += `<text x="${r(tx)}" y="${r(ty)}" font-size="4.2" text-anchor="middle" fill="#2e7d5b" font-family="Arial" font-weight="bold" letter-spacing=".4">COCO GELADO</text>`;
  k += `<text x="${r(ux)}" y="${r(uy)}" font-size="2.1" text-anchor="middle" fill="#6b7377" font-family="Arial" letter-spacing=".3">AÇAÍ · MATE · SUCOS</text>`;
  /* Glasaufsatz: Innenraum, Rückwand mit Regal und Kühlschrank */
  k += `<path d="M${pts([...bogen(1.3, 1.05, ...VORN), ...bogen(1.3, 2.5, VORN[1], VORN[0])])} Z" fill="${S.lg("kinnen", [[0, "#3b4a52"], [1, "#56656b"]])}"/>`;
  k += `<path d="M${pts([...bogen(1.22, 2.02, 0.15, Math.PI - 0.15, 10), ...bogen(1.22, 2.07, Math.PI - 0.15, 0.15, 10)])} Z" fill="#8a7a62"/>`;
  for (let i = 0; i < 9; i++) { const [bx, by] = PK(1.1 * Math.cos(0.4 + i * 0.29), 2.07, 1.1 * Math.sin(0.4 + i * 0.29)); k += `<rect x="${r(bx - 0.6)}" y="${r(by - 2.6)}" width="1.3" height="2.6" rx=".3" fill="${["#e8c23a", "#2f8a4a", "#c0392b", "#f2f2ea", "#7a3fa0"][i % 5]}"/>`; }
  { const [fx1, fy1] = PK(-0.95, 1.7, 0.75), [fx2, fy2] = PK(-0.25, 1.05, 1.15); k += `<rect x="${r(fx1)}" y="${r(fy1)}" width="${r(fx2 - fx1)}" height="${r(fy2 - fy1)}" rx=".6" fill="#d5dadc"/><rect x="${r(fx1 + 0.8)}" y="${r(fy1 + 0.8)}" width="${r(fx2 - fx1 - 1.6)}" height="${r(fy2 - fy1 - 1.6)}" fill="#9cc6d4"/>`; }
  /* Thekenplatte (Edelstahl), ragt 0,3 m vor: Oberseite und Vorderkante */
  k += `<path d="M${pts([...bogen(1.6, 1.05, ...VORN), ...bogen(1.3, 1.05, VORN[1], VORN[0])])} Z" fill="${S.lg("kplatte", [[0, "#c8cdd0"], [0.5, "#f4f6f6"], [1, "#aeb5b9"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${pts([...bogen(1.6, 1.0, ...VORN), ...bogen(1.6, 1.05, VORN[1], VORN[0])])} Z" fill="#8f979c"/>`;
  /* Glasfront-Pfosten (die rechte Scheibe ist zum Verkaufen hochgeschoben) */
  for (const a of [-1.25, -0.8, -0.38, 0.05, 0.5, 0.95, 1.3]) { const w = DREH + a, [x1, y1] = PK(1.3 * Math.cos(w), 1.08, 1.3 * Math.sin(w)), [, y2] = PK(1.3 * Math.cos(w), 2.5, 1.3 * Math.sin(w)); k += `<rect x="${r(x1 - 0.4)}" y="${r(y2)}" width=".8" height="${r(y1 - y2)}" fill="#cfd5d8"/>`; }
  /* Dach: weiße Scheibe mit Überstand; Vorderkante wölbt sich nach oben */
  k += `<path d="M${pts([...bogen(1.8, 2.5, ...VORN, 24), ...bogen(1.8, 2.68, VORN[1], VORN[0], 24)])} Z" fill="${S.lg("kdach", [[0, "#b9bfc2"], [0.6, "#dfe3e4"], [1, "#ffffff"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${pts(bogen(1.8, 2.5, ...VORN, 24))}" stroke="#9aa3a8" stroke-width=".5" fill="none"/>`;
  const [dx0, dy0] = PK(1.8 * Math.cos(DREH), 2.55, 1.8 * Math.sin(DREH));
  k += `<text x="${r(dx0)}" y="${r(dy0 - 0.6)}" font-size="2.6" text-anchor="middle" fill="#2e7d5b" font-family="Arial" font-weight="bold" letter-spacing=".5">QUIOSQUE POSTO 5</text>`;
  const yT = thekeY(0), yD = -KH;

  /* --- auf der Theke (Lupe) --- */
  const TT = (dx) => thekeY(dx, 1.45);
  /* DIE KOKOSNUSS — drei grüne Nüsse, eine aufgeschlagen mit Strohhalm */
  {
    let g = "";
    const nuss = (x, y, s, offen) => {
      let h = `<ellipse cx="${r(x)}" cy="${r(y - 2.6 * s)}" rx="${r(2.5 * s)}" ry="${r(2.8 * s)}" fill="${S.rg("kokos", [[0, "#a9d46a"], [0.6, "#6aa83c"], [1, "#3f7a25"]], 0.38, 0.32, 0.75)}"/>`;
      h += `<path d="M${r(x - 0.6 * s)} ${r(y - 5.3 * s)} L${r(x)} ${r(y - 5.9 * s)} L${r(x + 0.6 * s)} ${r(y - 5.3 * s)}" fill="#5c8a33"/>`;
      if (offen) h += `<ellipse cx="${r(x)}" cy="${r(y - 5.1 * s)}" rx="${r(0.9 * s)}" ry="${r(0.35 * s)}" fill="#f4f1de"/><path d="M${r(x + 0.2)} ${r(y - 5.1 * s)} L${r(x + 1.6 * s)} ${r(y - 9.4 * s)} L${r(x + 2.6 * s)} ${r(y - 9.8 * s)}" stroke="#e8433a" stroke-width="${r(0.42 * s)}" fill="none" stroke-linecap="round"/><path d="M${r(x + 0.5)} ${r(y - 6 * s)} L${r(x + 1.1 * s)} ${r(y - 7.8 * s)}" stroke="#fff" stroke-width="${r(0.15 * s)}"/>`;
      h += `<ellipse cx="${r(x - 0.9 * s)}" cy="${r(y - 3.6 * s)}" rx="${r(0.6 * s)}" ry="${r(1 * s)}" fill="#fff" opacity=".25"/>`;
      return h;
    };
    g += nuss(-21, TT(-21), 0.9, false) + nuss(-15.8, TT(-15.8), 0.95, false) + nuss(-10.4, TT(-10.4), 1, true);
    k += g;
    kioskUnter.push({ id: "kokosnuss", de: "die Kokosnuss", syl: "KO-kos-nuss", it: "la noce di cocco", itSyl: "NO-ce di COC-co", en: "coconut", x: KI.x - 15.6, y: KI.y + TT(-15.6), kunst: flaeche(-8, -10.2, 16, 10.6, 0.6),
      tipp: "Das Kokoswasser trinkt man mit einem Strohhalm direkt aus der grünen Nuss." });
  }
  /* DIE AÇAÍ-SCHALE — lila Açaí mit Müsli und Bananenscheiben */
  {
    const x = -2.4, y = TT(-2.4);
    let g = `<path d="M${x - 3.2} ${y - 2.6} Q${x} ${y + 0.6} ${x + 3.2} ${y - 2.6} Z" fill="${S.lg("schale", [[0, "#f2efe6"], [1, "#c9c4b6"]])}"/>`;
    g += `<ellipse cx="${x}" cy="${y - 2.7}" rx="3.2" ry=".9" fill="#4b1d4f"/><path d="M${x - 2.8} ${y - 2.9} Q${x} ${y - 4.4} ${x + 2.8} ${y - 2.9} Q${x} ${y - 2} ${x - 2.8} ${y - 2.9} Z" fill="${S.rg("acai", [[0, "#7a3a86"], [1, "#3e1442"]])}"/>`;
    for (let i = 0; i < 9; i++) g += `<circle cx="${r(x - 2 + rnd() * 2.4)}" cy="${r(y - 3.4 + rnd() * 0.8)}" r=".22" fill="#c9954c"/>`;
    for (const [dx, dy] of [[1, -3.6], [1.9, -3.1], [0.4, -3]]) g += `<ellipse cx="${x + dx}" cy="${y + dy}" rx=".55" ry=".32" fill="#f6eab0" stroke="#e2cf7a" stroke-width=".08"/>`;
    k += g;
    kioskUnter.push({ id: "acai", de: "die Açaí-Schale", syl: "a-ça-Í-scha-le", it: "la ciotola di açaí", itSyl: "CIO-to-la di a-ça-Ì", en: "açaí bowl", x: KI.x + x, y: KI.y + y, kunst: flaeche(-3.6, -4.8, 7.2, 5, 0.6),
      tipp: "Açaí sind lila Beeren aus dem Amazonas. Man isst sie gefroren, mit Müsli und Banane." });
  }
  /* ein Becher Maracujasaft neben der Schale */
  { const x = 5.4, y = TT(5.4); k += `<path d="M${x - 1.4} ${y - 5} L${x + 1.4} ${y - 5} L${x + 1.1} ${y} L${x - 1.1} ${y} Z" fill="#f2c94c" opacity=".9"/><path d="M${x - 1.4} ${y - 5} L${x + 1.4} ${y - 5}" stroke="#fff" stroke-width=".3"/><path d="M${x + 0.3} ${y - 5} L${x + 0.9} ${y - 7.4}" stroke="#2e7d5b" stroke-width=".35"/>`; }
  /* Tafel mit den Preisen neben dem Kiosk */
  k += `<path d="M${r(-KR - 9)} 2 L${r(-KR - 7.6)} -16 L${r(-KR - 1.4)} -16 L${r(-KR)} 2" fill="none" stroke="#5a3b22" stroke-width=".7"/>`;
  k += `<rect x="${r(-KR - 9.2)}" y="-16" width="9" height="10" rx=".4" fill="#253128"/>`;
  for (const [i, t] of ["Coco R$ 10", "Açaí R$ 18", "Suco R$ 9"].entries()) k += `<text x="${r(-KR - 4.7)}" y="${r(-13.2 + i * 2.8)}" font-size="1.5" text-anchor="middle" fill="#f4efdc" font-family="'Comic Sans MS',cursive">${t}</text>`;
  S.teil({ id: "kiosk", de: "der Kiosk", syl: "KI-osk", it: "il chiosco", itSyl: "CHIO-sco", en: "kiosk", x: KI.x, y: KI.y, steht: true, kunst: k,
    zoom: { x: KI.x - 34, y: THEKE - 22, w: 60, h: 40 },
    unter: kioskUnter,
    tipp: "Am Kiosk gibt es eiskalte Kokosnüsse, Açaí und frische Säfte. Bezahlt wird in Real (R$)." });
}
{
  /* DIE FLAGGE Brasiliens am Mast auf dem Kioskdach */
  const X = KI.x + KR * 1.05, Y = KI.y + PK(1.2, 2.68, 0.6)[1];
  let k = `<rect x="-.35" y="-27" width=".7" height="27" fill="#c9ced2"/><circle cx="0" cy="-27.4" r=".7" fill="#d9b23a"/>`;
  const fw = 16, fh = 11.2, y0 = -26.4;
  const wel = (dy) => `M.4 ${r(y0 + dy)} Q${r(fw * 0.3)} ${r(y0 + dy - 1.2)} ${r(fw * 0.55)} ${r(y0 + dy)} T${fw} ${r(y0 + dy - 0.4)}`;
  k += `<path d="${wel(0)} L${fw} ${r(y0 + fh - 0.4)} Q${r(fw * 0.8)} ${r(y0 + fh - 1.6)} ${r(fw * 0.55)} ${r(y0 + fh)} T.4 ${r(y0 + fh)} Z" fill="#009b3a"/>`;
  const cx = fw * 0.5, cy = y0 + fh / 2 - 0.3;
  k += `<path d="M${r(cx - 6.6)} ${r(cy)} L${r(cx)} ${r(cy - 4.3)} L${r(cx + 6.6)} ${r(cy - 0.2)} L${r(cx)} ${r(cy + 4.3)} Z" fill="#fedf00"/>`;
  k += `<circle cx="${r(cx)}" cy="${r(cy)}" r="2.75" fill="#002776"/>`;
  k += `<path d="M${r(cx - 2.7)} ${r(cy - 0.3)} Q${r(cx)} ${r(cy - 1.3)} ${r(cx + 2.7)} ${r(cy + 0.5)}" stroke="#ffffff" stroke-width=".55" fill="none"/>`;
  for (let i = 0; i < 12; i++) k += `<circle cx="${r(cx - 1.8 + rnd() * 3.6)}" cy="${r(cy + 0.4 + rnd() * 1.8)}" r=".12" fill="#fff"/>`;
  k += `<path d="M.4 ${y0} Q${r(fw * 0.3)} ${r(y0 - 1.2)} ${r(fw * 0.55)} ${y0} L${r(fw * 0.55)} ${r(y0 + fh)} Q${r(fw * 0.3)} ${r(y0 + fh - 1.2)} .4 ${r(y0 + fh)} Z" fill="#fff" opacity=".1"/>`;
  S.teil({ oben: true, id: "flagge", de: "die Flagge", syl: "FLAG-ge", it: "la bandiera", itSyl: "ban-DIE-ra", en: "flag", x: X, y: Y, kunst: k,
    tipp: "Auf der Flagge Brasiliens steht „Ordem e Progresso“ – „Ordnung und Fortschritt“." });
}

/* =====================================================================
   14 — DER VERKÄUFER im Kiosk (hinter der Theke, man sieht den Oberkörper)
   ===================================================================== */
{
  const m = B.mensch({ id: "rio_verk", geschlecht: "m", alter: "erwachsen", pose: "servieren", blick: -18, frisur: "kurz", haarfarbe: "schwarz", haut: "dunkel", laecheln: true,
    kleidung: { oberteil: { stueck: "tshirt", farbe: "#2e7d5b" }, unterteil: { stueck: "shorts", farbe: "beige" }, kopf: { stueck: "kappe", farbe: "#2e7d5b" } } }, 1.76 * sy(KI.y - 3));
  const X = KI.x + 14, Y = KI.y - 3;
  const cid = S.id("verkclip");
  /* nur der Teil über der Theke ist zu sehen */
  S.def(`<clipPath id="${cid}" clipPathUnits="userSpaceOnUse"><rect x="-30" y="-80" width="60" height="${r(80 - (Y - THEKE))}"/></clipPath>`);
  const AY = Y - 30;   /* Bezugspunkt auf der Brust (über der Theke) */
  S.teil({ id: "verkaeufer", de: "der Verkäufer", syl: "ver-KÄU-fer", it: "il venditore", itSyl: "ven-di-TO-re", en: "vendor", x: X, y: AY, kunst: `<g transform="translate(0 ${r(Y - AY)})"><g clip-path="url(#${cid})"><g filter="${INNEN}">${knapp(nurOben(m.svg, (THEKE - Y) / m.k + 3))}</g></g></g>`,
    tipp: "Der Verkäufer sagt: „Bom dia!“ – das heißt „Guten Morgen!“" });
}
/* Glas vor dem Kiosk: Spiegelstreifen (fangen keinen Tipp ab) */
S.davor(`<g opacity=".85"><path d="M${r(KI.x - KR + 3)} ${r(THEKE - 1.2)} L${r(KI.x - KR + 9)} ${r(KI.y - KH)} L${r(KI.x - KR + 13)} ${r(KI.y - KH)} L${r(KI.x - KR + 7)} ${r(THEKE - 1.2)} Z" fill="#fff" opacity=".18"/><path d="M${r(KI.x - 6)} ${r(THEKE - 1.2)} L${r(KI.x - 2)} ${r(KI.y - KH)} L${r(KI.x)} ${r(KI.y - KH)} L${r(KI.x - 4)} ${r(THEKE - 1.2)} Z" fill="#fff" opacity=".12"/></g>`);

/* =====================================================================
   15 — DER SONNENSCHIRM und 16 — DER LIEGESTUHL (mit 17 — TAMBURIN)
   ===================================================================== */
const SCH = { x: 284, y: 152 };
{
  /* im Raum gebaut: Mast bei (X0 | Z0), Rand 2,0 m hoch (über der Augenhöhe
     1,6 m), Nabe 2,25 m, Durchmesser 2 m. Die vordere Hälfte zeigt die
     Oberseite, darunter sieht man die Innenseite der hinteren Hälfte. */
  const Z0 = F * 1.6 / (SCH.y - HY), X0 = (SCH.x - VX) * Z0 / F;
  const P = (X, Y, Z) => [VX + F * X / Z - SCH.x, HY + F * (1.6 - Y) / Z - SCH.y];
  const R = 1.0, n = 16;
  const rand = (a) => P(X0 + R * Math.cos(a), 2.0, Z0 + R * Math.sin(a));
  const nabe = P(X0 + 0.05, 2.27, Z0);
  const s = sy(SCH.y);
  let k = `<ellipse cx="${r(-1.1 * s)}" cy="${r(0.25 * s)}" rx="${r(1.05 * s)}" ry="${r(0.22 * s)}" fill="#7a5a2a" opacity=".22" filter="url(#bw_weich)"/>`;
  k += `<line x1="0" y1="0" x2="${r(nabe[0])}" y2="${r(nabe[1])}" stroke="${S.lg("mast", [[0, "#d8dcde"], [1, "#9aa1a6"]], 0, 0, 1, 0)}" stroke-width="1.2"/>`;
  const farben = ["#f3c623", "#1e8a4c", "#2f6fc0", "#f4f1e6"];
  const innen = ["#b88f14", "#14603a", "#244f8c", "#bdb7a6"];
  const keil = (i, c) => { const [p1, p2] = [rand(i * 2 * Math.PI / n), rand((i + 1) * 2 * Math.PI / n)]; const m = rand((i + 0.5) * 2 * Math.PI / n); return `<path d="M${r(nabe[0])} ${r(nabe[1])} L${r(p1[0])} ${r(p1[1])} Q${r(m[0] * 2 - (p1[0] + p2[0]) / 2)} ${r(m[1] * 2 - (p1[1] + p2[1]) / 2 + 0.8)} ${r(p2[0])} ${r(p2[1])} Z" fill="${c}"/>`; };
  /* Innenseite der hinteren Hälfte (sin > 0 = weiter weg) */
  for (let i = 0; i < n / 2; i++) k += keil(i, innen[Math.floor(i / 2) % 4]);
  for (let i = 0; i < n / 2; i++) { const p1 = rand((i + 0.5) * 2 * Math.PI / n); k += `<line x1="${r(nabe[0])}" y1="${r(nabe[1])}" x2="${r(p1[0])}" y2="${r(p1[1])}" stroke="#5f5f55" stroke-width=".22"/>`; }
  /* Oberseite der vorderen Hälfte, von der Sonne (rechts) beschienen */
  for (let i = n / 2; i < n; i++) k += keil(i, farben[Math.floor(i / 2) % 4]);
  const ob = [rand(Math.PI), ...Array.from({ length: n / 2 + 1 }, (_, j) => rand(Math.PI + j * Math.PI / (n / 2)))];
  k += `<path d="M${r(nabe[0])} ${r(nabe[1])} L${pts(ob)} Z" fill="${S.lg("schirmlicht", [[0, "#000", 0.16], [0.55, "#fff", 0], [1, "#fff6d0", 0.3]], 0, 0, 1, 0)}"/>`;
  /* Volant am vorderen Rand */
  for (let i = n / 2; i < n; i++) { const [p1, p2] = [rand(i * 2 * Math.PI / n), rand((i + 1) * 2 * Math.PI / n)]; k += `<path d="M${r(p1[0])} ${r(p1[1])} Q${r((p1[0] + p2[0]) / 2)} ${r((p1[1] + p2[1]) / 2 + 2.2)} ${r(p2[0])} ${r(p2[1])} Z" fill="${farben[Math.floor(i / 2) % 4]}"/>`; }
  k += `<circle cx="${r(nabe[0])}" cy="${r(nabe[1] - 0.6)}" r=".9" fill="#d8dcde"/>`;
  S.teil({ id: "sonnenschirm", de: "der Sonnenschirm", syl: "SON-nen-schirm", it: "l'ombrellone", itSyl: "om-brel-LO-ne", en: "beach umbrella", x: SCH.x, y: SCH.y, steht: true, kunst: k,
    tipp: "Sonnenschirme und Stühle leiht man an den Strandbuden aus." });
}
/* DAS STRANDTUCH (Canga) liegt rechts vorn im Sand — jeder Punkt des
   Musters wird einzeln perspektivisch in die Bildebene gerechnet */
{
  const P = (X, Z) => [VX + F * X / Z, HY + F * 1.6 / Z];
  const Xc = 1.2, Zc = 3.45, th = 0.3, TB = 1.5, TT = 0.9;
  const X0 = 278, Y0 = 186;
  const welt = (u, v) => { const [x, y] = P(Xc + (u - TB / 2) * Math.cos(th) - (v - TT / 2) * Math.sin(th), Zc + (u - TB / 2) * Math.sin(th) + (v - TT / 2) * Math.cos(th)); return [x - X0, y - Y0]; };
  const rahmen = (d) => [welt(d, d), welt(TB - d, d), welt(TB - d, TT - d), welt(d, TT - d)];
  let k = `<path d="M${pts(rahmen(0))} Z" fill="#e8613a"/>`;
  k += `<path d="M${pts(rahmen(0.04))} L${pts(rahmen(0.04).slice(0, 1))} M${pts(rahmen(0.1).reverse())} Z" fill="#f6d21e" fill-rule="evenodd"/>`;
  k += `<path d="M${pts(rahmen(0.12))} Z" fill="none" stroke="#fff3d6" stroke-width=".5"/>`;
  /* Palmblätter und Hibiskusblüten */
  const blatt = (u, v, rot, l, c2) => {
    const pkt = [];
    for (let i = 0; i <= 8; i++) { const t = i / 8; pkt.push([t * l, Math.sin(t * Math.PI) * l * 0.2]); }
    for (let i = 7; i > 0; i--) { const t = i / 8; pkt.push([t * l, -Math.sin(t * Math.PI) * l * 0.2]); }
    const cs = Math.cos(rot * Math.PI / 180), sn = Math.sin(rot * Math.PI / 180);
    const q = pkt.map(([x, y]) => welt(u + x * cs - y * sn, v + x * sn + y * cs));
    const [m1, m2] = [welt(u, v), welt(u + l * cs, v + l * sn)];
    return `<path d="M${pts(q)} Z" fill="${c2}"/><path d="M${r(m1[0])} ${r(m1[1])} L${r(m2[0])} ${r(m2[1])}" stroke="#0f4d2a" stroke-width=".35"/>`;
  };
  for (const [u, v, rot, l, c2] of [[0.28, 0.28, 20, 0.4, "#1e8a4c"], [0.3, 0.66, -35, 0.36, "#2fa35c"], [0.84, 0.24, 160, 0.34, "#2fa35c"], [1.12, 0.6, -150, 0.38, "#1e8a4c"], [0.74, 0.52, 75, 0.28, "#1e8a4c"], [1.18, 0.2, 40, 0.24, "#2fa35c"]]) k += blatt(u, v, rot, l, c2);
  for (const [u, v] of [[0.6, 0.36], [0.98, 0.74], [0.22, 0.5], [1.3, 0.42]]) {
    const [x, y] = welt(u, v), sk = F / (Zc + (v - TT / 2)) / 1;
    k += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(0.065 * sk)}" ry="${r(0.026 * sk)}" fill="#f6d21e"/><ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(0.028 * sk)}" ry="${r(0.011 * sk)}" fill="#c0392b"/>`;
  }
  /* Falte und Licht */
  /* weiche Falte: heller Grat und Schatten daneben */
  k += `<path d="M${pts([welt(0.3, 0.62), welt(0.75, 0.58), welt(1.1, 0.66)])}" stroke="#fff3e6" stroke-width=".8" fill="none" opacity=".35"/><path d="M${pts([welt(0.3, 0.66), welt(0.75, 0.62), welt(1.1, 0.7)])}" stroke="#8a2f14" stroke-width=".9" fill="none" opacity=".18"/>`;
  k += `<path d="M${pts(rahmen(0))} Z" fill="${S.lg("tuchlicht", [[0, "#fff", 0.1], [1, "#000", 0.08]], 0, 0, 1, 0)}"/>`;
  S.teil({ id: "strandtuch", de: "das Strandtuch", syl: "STRAND-tuch", it: "il telo da mare", itSyl: "TE-lo da MA-re", en: "beach towel", x: X0, y: Y0, kunst: k,
    tipp: "In Brasilien nimmt man ein buntes Tuch mit an den Strand: die „Canga“." });
}
/* =====================================================================
   DER STRANDVERKÄUFER mit den zwei Aluminiumfässern (Mate und Limonade)
   ===================================================================== */
const AM = { x: 148, y: 156 };
{
  const s = sy(AM.y);
  const m = B.mensch({ id: "rio_amb", geschlecht: "m", alter: "erwachsen", pose: "gehen", blick: 24, frisur: "kurz", haarfarbe: "schwarz", haut: "mittel", laecheln: true,
    kleidung: { oberteil: { stueck: "tshirt", farbe: "#e8722c" }, unterteil: { stueck: "shorts", farbe: "beige" }, kopf: { stueck: "kappe", farbe: "#e8722c" }, schuhe: { stueck: "sandale", farbe: "braun" } } }, 1.72 * s);
  const sch = `<ellipse cx="-10" cy="2.6" rx="13" ry="2.2" fill="#6b4a1e" opacity=".22" filter="url(#bw_weich)" transform="rotate(-28 -10 2.6)"/>`;
  /* Tragegurt über der Schulter */
  const [sx1, sy1] = m.z.punkte.schulterR, [hlx, hly] = [m.z.handL.x, m.z.handL.y], [hrx, hry] = [m.z.handR.x, m.z.handR.y];
  const [hu1] = m.z.punkte.huefteL, [hu2, hu2y] = m.z.punkte.huefteR;
  const gurt = `<path d="M${r(sx1 * m.k)} ${r(sy1 * m.k)} L${r(Math.min(hu1, hu2) * m.k - 2)} ${r(hu2y * m.k - 1)} M${r(sx1 * m.k)} ${r(sy1 * m.k)} L${r(Math.max(hu1, hu2) * m.k + 2)} ${r(hu2y * m.k - 1.5)}" stroke="#4a3a2a" stroke-width=".6"/>`;
  const AY = AM.y - 0.95 * 1.72 * s;
  S.teil({ id: "strandverkaeufer", de: "der Strandverkäufer", syl: "STRAND-ver-käu-fer", it: "il venditore ambulante", itSyl: "ven-di-TO-re am-bu-LAN-te", en: "beach vendor", x: AM.x, y: AY,
    kunst: `<g transform="translate(0 ${r(AM.y - AY)})">${sch}<g filter="${GEGENLICHT}">${knapp(m.svg)}${gurt}</g></g>`,
    tipp: "Der Strandverkäufer ruft: „Olha o mate! Limão!“ – kalter Mate-Tee und Limonade." });
  /* DAS FASS — zwei Aluminiumfässer mit Zapfhahn, an den Händen getragen */
  const fass = (cx, top, label, c) => {
    const w = 0.27 * s, h = 0.42 * s;
    let g = `<path d="M${r(cx - w / 2)} ${r(top)} L${r(cx - w / 2)} ${r(top + h)} A${r(w / 2)} ${r(w * 0.16)} 0 0 0 ${r(cx + w / 2)} ${r(top + h)} L${r(cx + w / 2)} ${r(top)} Z" fill="${S.lg("alufass", [[0, "#8f979c"], [0.35, "#eef1f2"], [0.6, "#c4cacd"], [1, "#9aa2a6"]], 0, 0, 1, 0)}"/>`;
    g += `<ellipse cx="${r(cx)}" cy="${r(top)}" rx="${r(w / 2)}" ry="${r(w * 0.16)}" fill="#d9dee0" stroke="#8f979c" stroke-width=".15"/>`;
    for (const t of [0.22, 0.78]) g += `<path d="M${r(cx - w / 2)} ${r(top + h * t)} A${r(w / 2)} ${r(w * 0.16)} 0 0 0 ${r(cx + w / 2)} ${r(top + h * t)}" stroke="#7d868b" stroke-width=".25" fill="none"/>`;
    g += `<rect x="${r(cx - w * 0.36)}" y="${r(top + h * 0.38)}" width="${r(w * 0.72)}" height="${r(h * 0.22)}" fill="${c}"/><text x="${r(cx)}" y="${r(top + h * 0.54)}" font-size="${r(w * 0.2)}" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">${label}</text>`;
    g += `<path d="M${r(cx + w * 0.2)} ${r(top + h * 0.82)} l${r(w * 0.12)} 0 l0 ${r(h * 0.1)}" stroke="#555" stroke-width=".35" fill="none"/>`;
    g += `<path d="M${r(cx - w * 0.3)} ${r(top)} Q${r(cx)} ${r(top - w * 0.35)} ${r(cx + w * 0.3)} ${r(top)}" stroke="#555" stroke-width=".35" fill="none"/>`;
    return g;
  };
  /* die Fässer hängen am Gurt links und rechts neben der Hüfte */
  const [hux, huy] = m.z.punkte.huefteL, [hvx] = m.z.punkte.huefteR, wf = 0.27 * s;
  const fxR = Math.max(hux, hvx) * m.k + wf * 0.55, fyR = huy * m.k - 1.2;
  const k = fass(Math.min(hux, hvx) * m.k - wf * 0.55, huy * m.k - 0.5, "LIMÃO", "#c9a21a") + fass(fxR, fyR, "MATE", "#2e7d5b");
  const ax = fxR, ay = fyR + 0.21 * s;    /* Bezugspunkt: Mitte des Mate-Fasses */
  S.teil({ oben: true, id: "fass", de: "das Fass", syl: "FASS", it: "il barile", itSyl: "ba-RI-le", en: "keg", x: AM.x + ax, y: AM.y + ay, kunst: `<g transform="translate(${r(-ax)} ${r(-ay)})">${k}</g>`,
    tipp: "In den Fässern aus Aluminium ist eiskalter Mate-Tee und Limonade. Man trinkt ihn aus Plastikbechern." });
}

const ST = { x: 246, y: 160 };
{
  const s = sy(ST.y);                          /* ≈ 47,5 Einheiten je Meter */
  const AL = S.lg("alu", [[0, "#eef1f2"], [0.5, "#b9c0c4"], [1, "#dfe3e5"]], 0, 0, 1, 0);
  let k = schatten(-0.3 * s, 0, 0.42 * s, 0.07 * s, 0.3);
  /* Klappstuhl aus Aluminium, Sitz 0,25 m, Lehne schräg nach hinten (vom Betrachter weg = nach oben) */
  const w = 0.56 * s, sitz = -0.26 * s, tief = 0.09 * s, lehne = -0.88 * s;
  k += `<line x1="${r(-w / 2)}" y1="0" x2="${r(-w / 2 + 2)}" y2="${r(sitz - tief)}" stroke="${AL}" stroke-width="1"/><line x1="${r(w / 2)}" y1="0" x2="${r(w / 2 - 2)}" y2="${r(sitz - tief)}" stroke="${AL}" stroke-width="1"/>`;
  k += `<line x1="${r(-w / 2 + 1)}" y1="${r(-0.5)}" x2="${r(-w / 2 + 3)}" y2="${r(sitz + 2)}" stroke="#9aa1a6" stroke-width=".8"/><line x1="${r(w / 2 - 1)}" y1="${r(-0.5)}" x2="${r(w / 2 - 3)}" y2="${r(sitz + 2)}" stroke="#9aa1a6" stroke-width=".8"/>`;
  /* Lehne (gestreifter Stoff) */
  const lehneP = `M${r(-w / 2 + 2.6)} ${r(sitz - tief)} L${r(-w / 2 + 4.2)} ${r(lehne)} L${r(w / 2 - 4.2)} ${r(lehne)} L${r(w / 2 - 2.6)} ${r(sitz - tief)} Z`;
  const cid = S.id("stuhlclip");
  S.def(`<clipPath id="${cid}"><path d="${lehneP}"/></clipPath>`);
  let streifen = "";
  for (let i = 0; i < 8; i++) streifen += `<rect x="${r(-w / 2 + i * w / 8)}" y="${r(lehne)}" width="${r(w / 8 + 0.1)}" height="${r(-lehne)}" fill="${["#f08a2c", "#f6d21e", "#2fa35c", "#f6d21e"][i % 4]}"/>`;
  k += `<g clip-path="url(#${cid})">${streifen}<rect x="${r(-w / 2)}" y="${r(lehne)}" width="${r(w)}" height="${r(-lehne)}" fill="${S.lg("lehneschatten", [[0, "#000", 0.05], [1, "#000", 0.22]])}"/></g>`;
  k += `<path d="M${r(-w / 2 + 4.2)} ${r(lehne)} L${r(w / 2 - 4.2)} ${r(lehne)}" stroke="${AL}" stroke-width="1"/>`;
  k += `<path d="M${r(-w / 2 + 2.6)} ${r(sitz - tief)} L${r(-w / 2 + 4.2)} ${r(lehne)} M${r(w / 2 - 2.6)} ${r(sitz - tief)} L${r(w / 2 - 4.2)} ${r(lehne)}" stroke="${AL}" stroke-width=".9"/>`;
  /* Sitzfläche (Stoff, von oben schräg) */
  k += `<path d="M${r(-w / 2 + 1.4)} ${r(sitz)} L${r(w / 2 - 1.4)} ${r(sitz)} L${r(w / 2 - 2.6)} ${r(sitz - tief)} L${r(-w / 2 + 2.6)} ${r(sitz - tief)} Z" fill="#e07a24"/>`;
  k += `<path d="M${r(-w / 2 + 1.4)} ${r(sitz)} L${r(w / 2 - 1.4)} ${r(sitz)}" stroke="${AL}" stroke-width="1.1"/>`;
  /* Armlehnen */
  k += `<path d="M${r(-w / 2 + 0.6)} ${r(sitz - 0.18 * s)} L${r(-w / 2 + 3.4)} ${r(sitz - 0.2 * s - tief)} M${r(w / 2 - 0.6)} ${r(sitz - 0.18 * s)} L${r(w / 2 - 3.4)} ${r(sitz - 0.2 * s - tief)}" stroke="#e9ecee" stroke-width="1.1" stroke-linecap="round"/>`;
  k += `<line x1="${r(-w / 2 + 0.6)}" y1="${r(sitz - 0.18 * s)}" x2="${r(-w / 2 + 1)}" y2="${r(sitz)}" stroke="#c3c9cc" stroke-width=".7"/><line x1="${r(w / 2 - 0.6)}" y1="${r(sitz - 0.18 * s)}" x2="${r(w / 2 - 1)}" y2="${r(sitz)}" stroke="#c3c9cc" stroke-width=".7"/>`;
  S.teil({ id: "klappstuhl", de: "der Klappstuhl", syl: "KLAPP-stuhl", it: "la sedia pieghevole", itSyl: "SE-dia pie-GHE-vo-le", en: "folding chair", x: ST.x, y: ST.y, steht: true, kunst: k,
    tipp: "Die leichten Klappstühle aus Aluminium leiht man an der Barraca, der Strandbude." });
  /* DAS TAMBURIN (Pandeiro) liegt auf dem Sitz */
  {
    const d = 0.26 * s;
    let g = `<ellipse cx="0" cy="0" rx="${r(d / 2)}" ry="${r(d * 0.16)}" fill="#8a5a2a"/>`;
    g += `<path d="M${r(-d / 2)} 0 L${r(-d / 2)} -1.4 A${r(d / 2)} ${r(d * 0.16)} 0 0 1 ${r(d / 2)} -1.4 L${r(d / 2)} 0 A${r(d / 2)} ${r(d * 0.16)} 0 0 1 ${r(-d / 2)} 0 Z" fill="${S.lg("holzring", [[0, "#c98a4a"], [1, "#8a5626"]])}"/>`;
    g += `<ellipse cx="0" cy="-1.4" rx="${r(d / 2 - 0.4)}" ry="${r(d * 0.16 - 0.15)}" fill="#f1e6cf"/>`;
    for (let i = 0; i < 5; i++) { const a = Math.PI * (0.15 + i * 0.175); g += `<ellipse cx="${r(-Math.cos(a) * d / 2)}" cy="${r(-0.7 + Math.sin(a) * d * 0.16)}" rx=".75" ry=".55" fill="#d8dcdf" stroke="#8b9196" stroke-width=".12"/>`; }
    S.teil({ oben: true, id: "tamburin", de: "das Tamburin", syl: "TAM-bu-rin", it: "il tamburello", itSyl: "tam-bu-REL-lo", en: "tambourine", x: ST.x + 0.6, y: ST.y + r(sitz - tief * 0.5), kunst: g,
      tipp: "In Brasilien heißt es Pandeiro. Ohne Pandeiro gibt es keinen Samba." });
  }
}

/* =====================================================================
   18 — DER JUNGE (Brasilien-Trikot) und 19 — DER FUSSBALL
   ===================================================================== */
const JU = { x: 190, y: 188 };
{
  const s = sy(JU.y);
  const m = B.mensch({ id: "rio_junge", geschlecht: "m", alter: "kind", pose: "werfen", blick: 40, frisur: "locken", haarfarbe: "schwarz", haut: "dunkel", laecheln: true,
    kleidung: { oberteil: { stueck: "badeshirt", farbe: "#f6d21e" }, unterteil: { stueck: "badehose", farbe: "#1d4fa0" } } }, 1.34 * s);
  /* Schatten fällt nach links vorn (Sonne vorn rechts) */
  const sch = `<ellipse cx="-16" cy="5" rx="17" ry="3" fill="#6b4a1e" opacity=".22" filter="url(#bw_weich)" transform="rotate(-24 -16 5)"/>`;
  /* grüner Kragen wie beim Trikot der Seleção */
  const [hx, hy] = m.z.punkte.hals;
  const kragen = `<path d="M${r(hx * m.k - 2.6)} ${r(hy * m.k + 1.6)} Q${r(hx * m.k)} ${r(hy * m.k + 3.6)} ${r(hx * m.k + 2.6)} ${r(hy * m.k + 1.6)}" stroke="#139a43" stroke-width=".9" fill="none"/>`;
  const AY = JU.y - 0.62 * 1.34 * s;   /* Bezugspunkt auf der Brust */
  S.teil({ id: "junge", de: "der Junge", syl: "JUN-ge", it: "il ragazzo", itSyl: "ra-GAZ-zo", en: "boy", x: JU.x, y: AY, kunst: `<g transform="translate(0 ${r(JU.y - AY)})">${sch}<g filter="${GEGENLICHT}">${halb(m.svg)}${kragen}</g></g>`,
    tipp: "Der Junge trägt das gelbe Trikot der brasilianischen Fußballmannschaft." });
}
{
  /* der Ball fliegt in Kniehöhe vor dem Jungen (Altinha), sein Schatten liegt darunter im Sand */
  const s = sy(JU.y + 2), d = 0.22 * s, hoch = 0.5 * s;
  let g = `<ellipse cx="-7" cy="${r(hoch + 1.5)}" rx="${r(d * 0.7)}" ry="${r(d * 0.16)}" fill="#6b4a1e" opacity=".28" filter="url(#bw_weich)"/>`;
  g += `<circle cx="0" cy="0" r="${r(d / 2)}" fill="${S.rg("ball", [[0, "#ffffff"], [0.7, "#e4e4e0"], [1, "#a9aaa6"]], 0.7, 0.25, 0.85)}"/>`;
  const fuenf = (cx, cy, rr) => `<path d="M${[0, 1, 2, 3, 4].map((i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / 5; return `${r(cx + Math.cos(a) * rr)} ${r(cy + Math.sin(a) * rr)}`; }).join(" L")} Z" fill="#1d1d1f"/>`;
  g += fuenf(0.3, -0.3, d * 0.16) + fuenf(-d * 0.34, -d * 0.12, d * 0.1) + fuenf(d * 0.32, d * 0.24, d * 0.1) + fuenf(-d * 0.1, d * 0.38, d * 0.08) + fuenf(d * 0.2, -d * 0.36, d * 0.08);
  g += `<path d="M.3 -.3 L${r(-d * 0.34)} ${r(-d * 0.12)} M.3 -.3 L${r(d * 0.32)} ${r(d * 0.24)} M.3 -.3 L${r(d * 0.2)} ${r(-d * 0.36)}" stroke="#8d8e8a" stroke-width=".18"/>`;
  g += `<path d="M${r(-d * 0.42)} ${r(-d * 0.1)} A${r(d / 2)} ${r(d / 2)} 0 0 1 ${r(d * 0.1)} ${r(-d * 0.48)}" stroke="#fff" stroke-width=".4" fill="none" opacity=".6"/>`;
  S.teil({ oben: true, id: "fussball", de: "der Fußball", syl: "FUSS-ball", it: "il pallone", itSyl: "pal-LO-ne", en: "football", x: JU.x + 28, y: JU.y + 2 - hoch, kunst: g,
    tipp: "Am Strand spielen die Kinder „Altinha“: Der Ball soll nicht auf den Sand fallen." });
}

/* =====================================================================
   20 — DIE FLIPFLOPS (Havaianas) im Sand vorn
   ===================================================================== */
{
  const s = sy(192);
  const L = 0.26 * s;   /* Sohle 26 cm */
  const sohle = (dx, dy, rot, gruen) => {
    /* gruen = rechter Fuß (gespiegelt); Paar gleichfarbig: grüne Sohle, gelber Rand und Riemen */
    const l = L, c1 = "#1e8a4c", c2 = "#f6d21e", sp = gruen ? -1 : 1;
    const umriss = (k2) => `M${r(-l / 2 * k2)} 0 C${r(-l / 2 * k2)} ${r(-0.17 * l * k2)} ${r(-0.3 * l * k2)} ${r(-0.19 * l * k2)} ${r(-0.15 * l * k2)} ${r(-0.15 * l * k2)} C${r(0.05 * l * k2)} ${r(-0.12 * l * k2)} ${r(0.25 * l * k2)} ${r(-0.26 * l * k2)} ${r(0.44 * l * k2)} ${r(-0.2 * l * k2)} C${r(0.55 * l * k2)} ${r(-0.12 * l * k2)} ${r(0.55 * l * k2)} ${r(0.12 * l * k2)} ${r(0.42 * l * k2)} ${r(0.17 * l * k2)} C${r(0.25 * l * k2)} ${r(0.22 * l * k2)} ${r(0.05 * l * k2)} ${r(0.12 * l * k2)} ${r(-0.15 * l * k2)} ${r(0.15 * l * k2)} C${r(-0.3 * l * k2)} ${r(0.19 * l * k2)} ${r(-l / 2 * k2)} ${r(0.17 * l * k2)} ${r(-l / 2 * k2)} 0 Z`;
    let g = `<g transform="translate(${dx} ${dy}) rotate(${rot}) scale(1 ${sp})">`;
    g += `<path d="${umriss(1)}" fill="${c2}"/><path d="${umriss(0.9)}" fill="${c1}"/>`;
    /* Zehensteg und Riemen (Y-Form) mit kleiner Flagge */
    g += `<path d="M${r(0.3 * l)} 0 Q${r(0.12 * l)} ${r(-0.06 * l)} ${r(-0.06 * l)} ${r(-0.17 * l)} M${r(0.3 * l)} 0 Q${r(0.12 * l)} ${r(0.06 * l)} ${r(-0.06 * l)} ${r(0.17 * l)}" stroke="#000" stroke-width="${r(0.05 * l)}" fill="none" opacity=".2" transform="translate(-.6 .5)"/>`;
    g += `<path d="M${r(0.3 * l)} 0 Q${r(0.12 * l)} ${r(-0.06 * l)} ${r(-0.06 * l)} ${r(-0.17 * l)} M${r(0.3 * l)} 0 Q${r(0.12 * l)} ${r(0.06 * l)} ${r(-0.06 * l)} ${r(0.17 * l)}" stroke="${c2}" stroke-width="${r(0.05 * l)}" fill="none" stroke-linecap="round"/>`;
    g += `<circle cx="${r(0.3 * l)}" cy="0" r="${r(0.03 * l)}" fill="${c2}"/>`;
    g += `<rect x="${r(0.08 * l)}" y="${r(-0.1 * l)}" width="${r(0.07 * l)}" height="${r(0.05 * l)}" fill="#009b3a"/><path d="M${r(0.085 * l)} ${r(-0.075 * l)} L${r(0.115 * l)} ${r(-0.095 * l)} L${r(0.145 * l)} ${r(-0.075 * l)} L${r(0.115 * l)} ${r(-0.055 * l)} Z" fill="#fedf00"/>`;
    g += `</g>`;
    return g;
  };
  /* von schräg oben gesehen: in der Tiefe auf etwa die Hälfte verkürzt */
  let k = schatten(-1.6, 0.6, L * 0.62, 1.4, 0.2);
  k += `<g transform="scale(1 .5)">${sohle(-5.5, 0, -72, false)}${sohle(5.5, -1, -64, true)}</g>`;
  S.teil({ oben: true, id: "flipflops", de: "die Flipflops", syl: "FLIP-flops", it: "le infradito", itSyl: "in-fra-DI-to", en: "flip-flops", x: 62, y: 192, kunst: k,
    tipp: "Die bunten Flipflops aus Brasilien heißen Havaianas." });
}

/* Licht: warmer Schein der Morgensonne von rechts oben (fängt nichts ab) */
S.davor(`<rect width="320" height="200" fill="${S.rg("morgenlicht", [[0, "#fff4cf", 0.22], [0.45, "#fff4cf", 0.05], [1, "#fff4cf", 0]], 1, 0, 0.9)}"/>`);

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/rio.js"));
console.log(aus);
