#!/usr/bin/env node
/* =====================================================================
   WEIMAR (FASSUNG 854, Runde 2) — Bilderwelt neu: Städte in Deutschland
   ---------------------------------------------------------------------
   XANDER (03.10.): „die bekannten Sehenswürdigkeiten … mit Recherche zu
   den einzelnen Städten in Deutschland … als Profi-Grafikdesigner auf
   Hollywood-Niveau“ — und (Funk 291) „mit größter Sorgfalt und Präzision“.

   RECHERCHE (weimar.de „Denkmäler“, Wikipedia „Goethe and Schiller
   Monument“, Bundestag „Schauplätze: Nationaltheater“, heinze.de/Gutjahr
   „DNT Weimar“, museum.com „Haus der Weimarer Republik“, Zwiebelmarkt-
   ordnung der Stadt Weimar, festivalsindeutschland „Zwiebelmarkt“):
   - STANDORT: der THEATERPLATZ, Blick von seiner Ostseite nach Westen auf
     das GOETHE-SCHILLER-DENKMAL und dahinter die Hauptfassade des
     DEUTSCHEN NATIONALTHEATERS (das Postkartenmotiv). Hinter uns liegen
     das Wittumspalais (Südostecke) und das Haus der Weimarer Republik
     (bis 2018 das alte Bauhaus-Museum) — von hier aus nicht zu sehen.
     Das neue BAUHAUS-MUSEUM (2019) steht 500 m nördlich am Weimarhallen-
     park, ebenfalls nicht im Blick; das Gartenhaus im Park an der Ilm
     liegt 1 km südöstlich. Das Bauhaus zeigt sich hier darum auf dem
     Plakat an der LITFASSSÄULE.
   - DENKMAL (Ernst Rietschel, enthüllt 4. September 1857): Bronze, die
     Figuren 3,7 m hoch auf einem hohen Granitsockel mit der Inschrift
     „DEM DICHTERPAAR GOETHE UND SCHILLER DAS VATERLAND“. Goethe steht
     links im Hofrock, seine linke Hand liegt auf Schillers Schulter, in
     der rechten hält er den Lorbeerkranz; Schiller (rechts, im offenen
     Rock) greift mit der rechten Hand nach dem Kranz, in der linken hält
     er eine Schriftrolle. Beide sind gleich groß dargestellt, obwohl
     Schiller in Wirklichkeit größer war. Goethe steht ruhig und blickt
     geradeaus; Schiller hebt den Kopf und schaut in die Ferne. Goethe in
     Kniehose, Strümpfen und Schnallenschuhen, Schiller im langen, offenen
     Rock bis unter die Knie. Dunkle Bronze mit grünlicher Patina in den
     Falten; massiver Granitsockel mit Fuß- und Kopfgesims.
   - NATIONALTHEATER (Max Littmann, 1906–08, neoklassizistisch, Fassade
     aus Thüringer Travertin, 1945 bis auf die Fassade zerstört, 1948
     wieder eröffnet): breiter Mittelbau mit Säulen über dem Eingangs-
     geschoss, oben der Schriftzug „DEUTSCHES NATIONALTHEATER“, niedrigere
     Seitenflügel. Hier tagte 1919 die Nationalversammlung und beschloss
     die erste demokratische Verfassung Deutschlands; links vom Eingang
     erinnert eine GEDENKTAFEL daran (Nachbildung der Tafel von Walter
     Gropius). Unsicher (ohne Bildquelle geprüft): die genaue Zahl der
     Säulen und Türen im Mittelbau.
   - TYPISCH: der ZWIEBELMARKT (seit 1653, am zweiten Oktoberwochenende,
     auch auf dem Theaterplatz): Bauern aus Heldrungen verkaufen
     geflochtene ZWIEBELZÖPFE (gelbe und rote Zwiebeln, nach unten
     schmaler, oben eine Schlaufe, mit Strohblumen), Trockenblumen,
     Zwiebelkuchen und Federweißer; die THÜRINGER
     ROSTBRATWURST vom Holzkohlegrill im Brötchen mit Senf; Studenten der
     Bauhaus-Universität mit dem Fahrrad; ein gelbes Reclam-Heft
     („Faust“) — Weimar ist die Stadt der Dichter.
   - LICHT: Vormittag im Oktober, die Sonne steht im Südosten (hinter uns,
     links): die Ostfassade des Theaters ist warm angestrahlt, in Laibungen
     und unter Gesimsen kühle Schatten; Schlagschatten fallen nach rechts
     hinten. Die Linden am Platz sind herbstlich gelb, auf dem Pflaster
     liegen Blätter. Die Häuser am Platz sind farbig gefasst (Ocker,
     Lindgrün, Altrosa) mit Gauben und Fensterläden.
   Maßstab: Zentralperspektive, Auge 1,7 m über dem Pflaster, Horizont
   y = 175, F = 260 (ein Meter in D Metern = 260/D Einheiten). Denkmal
   18 m vor uns, Theaterfassade 40 m (22 m hinter dem Denkmal).
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "weimar", titel: "Weimar", emoji: "📜", thema: "Deutschland", kuerzel: "wmr", fassung: 854, breite: 400, hoehe: 260 });
const rnd = zufall(1857);
const r = B.r;
const HOR = 175, F = 260, EYE = 1.7, CX = 200;
const sk = (D) => F / D;
const yG = (D, h = 0) => HOR + (EYE - h) * F / D;
const xG = (D, X) => CX + X * F / D;
const kl = (x) => Math.min(400, Math.max(0, x));
const P = (D, X, h = 0) => `${r(xG(D, X))} ${r(yG(D, h))}`;
/* Schlagschatten auf dem Pflaster: Sonne im Südosten (hinter uns, links), etwa 25° hoch → 2,1 × Höhe, nach rechts hinten */
const schattenListe = [];
const bodenSchatten = (D, X, w, h, a = 0.3) => {
  const L = 2.1 * h, dx = 0.55 * L, dz = 0.83 * L;
  const p = [[X - w / 2, D], [X + w / 2, D], [X + dx + w * 0.3, D + dz], [X + dx - w * 0.3, D + dz]];
  schattenListe.push(`<path d="M${p.map(([x2, d2]) => `${r(kl(xG(d2, x2)))} ${r(yG(d2))}`).join(" L")} Z" fill="#2e2a40" opacity="${a}"/>`);
};
/* Figuren klein halten: feine Linien weg, Formkoordinaten auf Q cm runden (Verläufe bleiben genau) */
const schlank = (svg, min = 0.35) => svg.replace(/<path [^>]*fill="none"[^>]*\/>/g, (p) => { const m = p.match(/stroke-width="([\d.]+)"/); return m && +m[1] < min ? "" : p; });
const kompakt = (svg, Q = 1, min = 0.35) => {
  svg = schlank(svg, min);
  const rund = (n) => { const v = Math.round(+n / Q) * Q; return String(v === 0 ? 0 : r(v)); };
  return svg.replace(/<(path|ellipse|circle|rect|line|polygon)\b[^>]*>/g, (tag) => tag
    .replace(/ d="([^"]+)"/g, (a, p) => ` d="${p.replace(/-?\d*\.?\d+/g, rund)}"`)
    .replace(/ (x|y|x1|y1|x2|y2|cx|cy)="(-?\d*\.?\d+)"/g, (a, k, n) => ` ${k}="${rund(n)}"`));
};
const FIG = {};
const mensch = (name, spec, groesse, D, X, Q = 1, min = 0.35) => {
  const m = B.mensch(spec, 100);
  S.def(`<g id="${S.id("fig" + name)}">${kompakt(m.svg, Q, min)}</g>`);
  const f = { m, D, X, x: r(xG(D, X)), y: r(yG(D)), u: sk(D), s: groesse * sk(D) / 100 };
  f.p = (q) => ({ x: f.x + q.x * m.k * f.s, y: f.y + q.y * m.k * f.s });
  f.svg = `<use href="#${S.id("fig" + name)}" transform="scale(${f.s.toFixed(5)})"/>`;
  FIG[name] = f;
  return f;
};

S.def(`<filter color-interpolation-filters="sRGB" id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter color-interpolation-filters="sRGB" id="${S.id("schw")}" x="-30%" y="-80%" width="160%" height="260%"><feGaussianBlur stdDeviation=".6"/></filter>`);
S.def(`<filter color-interpolation-filters="sRGB" id="${S.id("rauch")}" x="-50%" y="-50%" width="200%" height="200%"><feTurbulence type="fractalNoise" baseFrequency=".18" numOctaves="2" seed="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G" result="d"/><feGaussianBlur in="d" stdDeviation="1.3"/></filter>`);
S.def(`<filter color-interpolation-filters="sRGB" id="${S.id("laub")}" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".32" numOctaves="2" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="4.2" xChannelSelector="R" yChannelSelector="G"/></filter>`);
S.def(`<filter color-interpolation-filters="sRGB" id="${S.id("wolke")}" x="-15%" y="-30%" width="130%" height="160%"><feTurbulence type="fractalNoise" baseFrequency=".09" numOctaves="2" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G" result="d"/><feGaussianBlur in="d" stdDeviation=".7"/></filter>`);
S.def(`<filter color-interpolation-filters="sRGB" id="${S.id("schleier")}" x="-10%" y="-300%" width="120%" height="700%"><feTurbulence type="fractalNoise" baseFrequency=".04 .5" numOctaves="2" seed="5" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G"/><feGaussianBlur stdDeviation=".7"/></filter>`);

/* Stoffe */
const TRAV = S.lg("trav", [[0, "#f8ecd2"], [0.5, "#ecdcbc"], [1, "#d1bf9b"]], 0, 0, 1, 0);
const TRAV_S = S.lg("travs", [[0, "#cdbd9e"], [1, "#a99a7e"]], 0, 0, 1, 0);
const GOLD = S.lg("gold", [[0, "#fff3b0"], [0.45, "#e7bd4a"], [1, "#9a6c10"]], 0, 0, 1, 1);
const GLAS = S.lg("glas", [[0, "#b4c8d6"], [0.5, "#5a6a78"], [1, "#2f3b46"]]);
const DACH = S.lg("dach", [[0, "#6d747b"], [1, "#454b52"]]);
const HOLZ = S.lg("holz", [[0, "#b08050"], [0.5, "#8c5f35"], [1, "#6a4424"]], 0, 0, 1, 0);
const HOLZ_S = S.lg("holzs", [[0, "#6a4424"], [1, "#4a2e18"]], 0, 0, 1, 0);

/* =====================================================================
   KULISSE — Oktobervormittag: Himmel, Wolken, Schleier, Dunst
   ===================================================================== */
S.hinten(`<rect width="400" height="${HOR + 14}" fill="${S.lg("himmel", [[0, "#6a98cc"], [0.55, "#a2c0de"], [0.85, "#dfe6ea"], [1, "#f2e8d6"]])}"/>`);
S.hinten(`<rect width="400" height="${HOR + 14}" fill="${S.rg("sonne", [[0, "#fff1d0", 0.6], [1, "#fff1d0", 0]], 0, 1, 0.8)}"/>`);
{
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
  S.hinten(wolke(60, 34, 62, 18, 5) + wolke(334, 26, 54, 15, 9) + wolke(236, 52, 22, 5, 12) + wolke(150, 62, 14, 3, 14));
  S.hinten(`<g filter="url(#${S.id("schleier")})" opacity=".55"><path d="M120 10 Q210 4 320 9 Q220 11 120 13 Z M230 20 Q300 16 390 19 Q310 22 230 22 Z" fill="#f6f2ec"/></g>`);
}
S.hinten(`<rect x="0" y="${HOR - 60}" width="400" height="62" fill="${S.lg("dunst", [[0, "#efe6d6", 0], [1, "#efe6d6", 0.55]])}"/>`);
S.hinten(`<rect x="0" y="${HOR}" width="400" height="${260 - HOR}" fill="#a49b8f"/>`);
/* Kronen-Werkzeug (wie Potsdam): gelappte Kronen, drei Tonstufen je Lappen, Himmelslöcher */
const krone = (cx, cy, w, h, seed, T, loecher = 3) => {
  const z = zufall(seed);
  const lap = [];
  for (let i = 0; i < 12; i++) { const a = z() * Math.PI * 2, d = Math.sqrt(z()) * 0.34; lap.push([cx + Math.cos(a) * w * d, cy + Math.sin(a) * h * d * 0.95, (0.17 + z() * 0.09) * w, (0.15 + z() * 0.08) * h]); }
  lap.sort((p, q) => p[1] - q[1] || p[0] - q[0]);
  const grad = (name, a, b) => S.lg(name + seed, [[0, a], [1, b]], cx, cy - h / 2, cx, cy + h / 2, ' gradientUnits="userSpaceOnUse"');
  const GD = grad("kd", T[0], T[1]), GM = grad("km", T[2], T[3]), GL = grad("kl", T[4], T[5]);
  let g = `<g filter="url(#${S.id("laub")})"><ellipse cx="${cx}" cy="${r(cy + h * 0.06)}" rx="${r(w * 0.42)}" ry="${r(h * 0.42)}" fill="${GD}"/>`;
  for (const [x, y, rx, ry] of lap) {
    g += `<ellipse cx="${r(x + rx * 0.08)}" cy="${r(y + ry * 0.1)}" rx="${r(rx)}" ry="${r(ry)}" fill="${GD}"/>`;
    g += `<ellipse cx="${r(x - rx * 0.12)}" cy="${r(y - ry * 0.12)}" rx="${r(rx * 0.78)}" ry="${r(ry * 0.74)}" fill="${GM}"/>`;
    g += `<ellipse cx="${r(x - rx * 0.32)}" cy="${r(y - ry * 0.34)}" rx="${r(rx * 0.4)}" ry="${r(ry * 0.36)}" fill="${GL}"/>`;
  }
  for (let i = 0; i < loecher; i++) { const a = -Math.PI * (0.1 + z() * 0.8), d = 0.28 + z() * 0.1; g += `<ellipse cx="${r(cx + Math.cos(a) * w * d * 1.2)}" cy="${r(cy + Math.sin(a) * h * d)}" rx="${r(0.9 + z() * 1.1)}" ry="${r(0.7 + z() * 0.8)}" fill="#adc6de"/>`; }
  return g + `</g>`;
};

/* =====================================================================
   4 — DER PLATZ (Bodenfläche, Inhalt am Ende) und 1 — DIE HÄUSER
   ===================================================================== */
const PLATZ = S.teil({ id: "platz", de: "der Platz", syl: "PLATZ", it: "la piazza", itSyl: "PIAZ-za", en: "square", x: 0, y: 0, kunst: "",
  tipp: "Der Theaterplatz ist einer der schönsten Plätze in Weimar." });
{
  let k = "";
  /* Bürgerhaus der Goethezeit: Putzfarbe, Traufgesims, Fensterläden, Mansard- oder Satteldach mit Gauben */
  const haus = (D, X0, X1, traufe, first, farbe, laden, fl, achsen, mansard) => {
    const u = sk(D), xa = xG(D, X0), xb = xG(D, X1), x0 = Math.max(0, xa), x1 = Math.min(400, xb), y0 = yG(D, 0), yt = yG(D, traufe), yf = yG(D, first);
    if (x1 - x0 < 1) return "";
    let g = `<rect x="${r(x0)}" y="${r(yt)}" width="${r(x1 - x0)}" height="${r(y0 - yt)}" fill="${farbe}"/>`;
    g += `<rect x="${r(x0)}" y="${r(yt)}" width="${r(x1 - x0)}" height="${r(y0 - yt)}" fill="${S.lg("hauslicht", [[0, "#fff4dc", 0.22], [1, "#2e2a40", 0.14]], 0, 0, 1, 0)}"/>`;
    if (mansard) {
      const ym = yG(D, traufe + (first - traufe) * 0.65);
      g += `<path d="M${r(x0)} ${r(yt)} L${r(Math.max(0, x0 + 0.8 * u))} ${r(ym)} L${r(Math.max(0, x0 + 1.6 * u))} ${r(yf)} L${r(Math.min(400, x1 - 1.6 * u))} ${r(yf)} L${r(Math.min(400, x1 - 0.8 * u))} ${r(ym)} L${r(x1)} ${r(yt)} Z" fill="${DACH}"/>`;
    } else g += `<path d="M${r(x0)} ${r(yt)} L${r(x0 + (x1 - x0) * 0.1)} ${r(yf)} L${r(x1 - (x1 - x0) * 0.1)} ${r(yf)} L${r(x1)} ${r(yt)} Z" fill="${DACH}"/>`;
    g += `<rect x="${r(x0)}" y="${r(yt - 0.35 * u)}" width="${r(x1 - x0)}" height="${r(0.4 * u)}" fill="#f4ecdc"/><rect x="${r(x0)}" y="${r(yt + 0.05 * u)}" width="${r(x1 - x0)}" height="${r(0.25 * u)}" fill="#2e2a40" opacity=".18"/>`;
    const dx = (xb - xa) / achsen, fh = (y0 - yt - 0.6 * u) / fl;
    for (let f = 0; f < fl; f++) for (let i = 0; i < achsen; i++) {
      const x = xa + (i + 0.5) * dx, y = yt + 0.6 * u + f * fh;
      if (x - 1.2 * u < 0 || x + 1.2 * u > 400) continue;
      const fy = y + fh * 0.2, fw = 0.9 * u, fhh = fh * 0.56;
      g += `<rect x="${r(x - fw / 2)}" y="${r(fy)}" width="${r(fw)}" height="${r(fhh)}" fill="${GLAS}"/><path d="M${r(x - fw / 2)} ${r(fy)} h${r(fw)} M${r(x - fw / 2)} ${r(fy)} v${r(fhh)}" stroke="#2e2a40" stroke-width="${r(0.18 * u)}" opacity=".35"/>`;
      g += `<path d="M${r(x)} ${r(fy)} v${r(fhh)} M${r(x - fw / 2)} ${r(fy + fhh * 0.4)} h${r(fw)}" stroke="#f4ecdc" stroke-width="${r(0.07 * u)}"/>`;
      g += `<rect x="${r(x - fw / 2 - 0.42 * u)}" y="${r(fy)}" width="${r(0.38 * u)}" height="${r(fhh)}" fill="${laden}"/><rect x="${r(x + fw / 2 + 0.04 * u)}" y="${r(fy)}" width="${r(0.38 * u)}" height="${r(fhh)}" fill="${laden}"/>`;
      g += `<rect x="${r(x - fw / 2 - 0.1 * u)}" y="${r(fy - 0.22 * u)}" width="${r(fw + 0.2 * u)}" height="${r(0.18 * u)}" fill="#f6efe0"/>`;
    }
    for (let i = 1; i < achsen; i += 2) {
      const x = xa + (i + 0.5) * dx, yy = mansard ? yG(D, traufe + (first - traufe) * 0.35) : yt - 0.4 * u;
      if (x - u < 0 || x + u > 400) continue;
      g += `<path d="M${r(x - 0.55 * u)} ${r(yy + 0.6 * u)} L${r(x - 0.55 * u)} ${r(yy - 0.6 * u)} L${r(x)} ${r(yy - 1.1 * u)} L${r(x + 0.55 * u)} ${r(yy - 0.6 * u)} L${r(x + 0.55 * u)} ${r(yy + 0.6 * u)} Z" fill="#e9e1d0"/><rect x="${r(x - 0.32 * u)}" y="${r(yy - 0.45 * u)}" width="${r(0.64 * u)}" height="${r(0.8 * u)}" fill="#3f4a52"/>`;
    }
    return g;
  };
  /* links (Süden): ockerfarbenes Haus mit Mansarddach, davor ein niedrigeres altrosa Haus */
  k += haus(46, -36, -24.5, 12.5, 18.5, "#dca85e", "#4e6a46", 3, 4, true);
  k += haus(41, -38, -29.5, 9.5, 14, "#e2b4a4", "#6a5446", 2, 3, false);
  /* rechts (Norden): lindgrünes Haus, dann ein hellgraues */
  k += haus(45, 24.5, 34, 13, 18, "#c6d2a2", "#5a4a3a", 3, 4, false);
  k += haus(39, 31, 40, 11.5, 16.5, "#d9d6cf", "#3e5a6a", 3, 3, true);
  /* Schatten der Hausecken zum Theater */
  k += `<path d="M${r(xG(46, -24.5))} ${r(yG(46, 12.5))} L${r(xG(46, -24.5) - 3)} ${r(yG(46, 12.5))} L${r(xG(46, -24.5) - 3)} ${r(yG(46))} L${r(xG(46, -24.5))} ${r(yG(46))} Z" fill="#2e2a40" opacity=".2"/>`;
  S.teil({ id: "haus", de: "das Haus", syl: "HAUS", it: "la casa", itSyl: "CA-sa", en: "house", x: 0, y: 0, kunst: k,
    tipp: "Am Theaterplatz stehen alte Bürgerhäuser mit farbigen Fassaden und Fensterläden." });
}

/* =====================================================================
   2 — DAS THEATER (Deutsches Nationaltheater) — gezeichnet in Metern
   ===================================================================== */
const TD = 40, TU = sk(TD), TY = yG(TD, 0);
const theaterUnter = [];
{
  let k = "";
  const W = 22.6, M = 11.2;
  const KUEHL = "#3a3a5a";
  /* Fenster mit tiefer Laibung: Schatten oben und links (Licht von links vorn) */
  const fenster = (x, y0, y1, w) => `<rect x="${r(x - w / 2)}" y="${y1}" width="${w}" height="${r(y0 - y1)}" fill="${GLAS}"/>` +
    `<path d="M${r(x - w / 2)} ${y1} h${w} v.35 h${r(-w + 0.3)} V${y0} h-.3 Z" fill="${KUEHL}" opacity=".45"/>` +
    `<path d="M${x} ${y1} V${y0} M${r(x - w / 2)} ${r(y1 + (y0 - y1) * 0.35)} H${r(x + w / 2)}" stroke="#f4ecdb" stroke-width=".12"/>` +
    `<rect x="${r(x - w / 2)}" y="${y1}" width="${w}" height="${r(y0 - y1)}" fill="none" stroke="#f6eedd" stroke-width=".26"/>` +
    `<path d="M${r(x - w / 2 + 0.3)} ${r(y1 + 0.5)} L${r(x - w / 2 + 0.8)} ${r(y1 + 0.5)} L${r(x - w / 2 + 0.3)} ${r(y1 + 2.6)} Z" fill="#fff" opacity=".2"/>`;
  /* Seitenflügel */
  for (const s of [-1, 1]) {
    const x0 = s < 0 ? -W : M, w = W - M;
    k += `<rect x="${x0}" y="-14.4" width="${w}" height="14.6" fill="${TRAV}"/>`;
    k += `<rect x="${x0}" y="-.6" width="${w}" height=".8" fill="${TRAV_S}"/>`;
    for (let y = -1.4; y > -5.6; y -= 0.8) k += `<path d="M${x0} ${r(y)} H${x0 + w}" stroke="#b9a988" stroke-width=".08"/>`;
    k += `<rect x="${x0 - 0.2}" y="-6.1" width="${w + 0.4}" height=".55" fill="#f8f0de"/><rect x="${x0 - 0.2}" y="-5.55" width="${w + 0.4}" height=".35" fill="${KUEHL}" opacity=".22"/>`;
    for (const c of [2.4, 5.7, 9.0]) {
      const x = s < 0 ? -W + c : M + w - c;
      k += `<path d="M${x - 1.1} -.6 L${x - 1.1} -3.8 Q${x - 1.1} -5 ${x} -5 Q${x + 1.1} -5 ${x + 1.1} -3.8 L${x + 1.1} -.6 Z" fill="${GLAS}"/>`;
      k += `<path d="M${x - 1.1} -.6 L${x - 1.1} -3.8 Q${x - 1.1} -5 ${x} -5 Q${x + 1.1} -5 ${x + 1.1} -3.8 L${x + 0.8} -3.8 Q${x + 0.8} -4.6 ${x} -4.6 Q${x - 0.8} -4.6 ${x - 0.8} -3.8 L${x - 0.8} -.6 Z" fill="${KUEHL}" opacity=".4"/>`;
      k += `<path d="M${x - 1.1} -.6 L${x - 1.1} -3.8 Q${x - 1.1} -5 ${x} -5 Q${x + 1.1} -5 ${x + 1.1} -3.8 L${x + 1.1} -.6" stroke="#f4ecdb" stroke-width=".25" fill="none"/>`;
      k += fenster(x, -7.8, -11.4, 2);
      k += `<rect x="${x - 1.35}" y="-12.1" width="2.7" height=".45" fill="#f8f0de"/><rect x="${x - 1.35}" y="-11.65" width="2.7" height=".25" fill="${KUEHL}" opacity=".25"/>`;
    }
    k += `<rect x="${x0 - 0.3}" y="-15.1" width="${w + 0.6}" height=".8" fill="#f8f1e2"/><rect x="${x0 - 0.3}" y="-14.3" width="${w + 0.6}" height=".4" fill="${KUEHL}" opacity=".25"/>`;
    k += `<path d="M${x0 - 0.3} -15.1 L${x0 + (s < 0 ? 1.5 : 0)} -17.6 L${x0 + w - (s > 0 ? 1.5 : 0)} -17.6 L${x0 + w + 0.3} -15.1 Z" fill="${DACH}"/>`;
  }
  /* Mittelbau */
  k += `<rect x="${-M}" y="-18" width="${2 * M}" height="18.2" fill="${TRAV}"/>`;
  /* Erdgeschoss als Sockel mit Rustika (Fugenquader, versetzt) */
  k += `<rect x="${-M}" y="-5.2" width="${2 * M}" height="5.4" fill="${S.lg("rustika", [[0, "#efe1c2"], [1, "#d6c4a0"]], 0, 0, 1, 0)}"/>`;
  let fug = "";
  for (let i = 0, y = -0.6; y > -5.2; y -= 0.75, i++) { fug += `M${-M} ${r(y)} H${M} `; for (let x = -M + (i % 2 ? 0.9 : 0); x < M; x += 1.8) fug += `M${r(x)} ${r(y)} v-.75 `; }
  k += `<path d="${fug}" stroke="#a8977a" stroke-width=".08" fill="none"/>`;
  /* drei Stufen vor den Portalen */
  for (let i = 0; i < 3; i++) k += `<rect x="${-M + 0.6 - i * 0.3}" y="${r(-0.6 + i * 0.22)}" width="${r(2 * M - 1.2 + i * 0.6)}" height=".24" fill="${i % 2 ? "#e2d4b6" : "#f2e8d2"}"/>`;
  /* fünf Portale bis zum Boden: Rahmen, zwei Flügel, Griffe, Oberlicht */
  for (const x of [-8, -4, 0, 4, 8]) {
    k += `<rect x="${x - 1.2}" y="-4.5" width="2.4" height="3.9" fill="#3a3028"/>`;
    k += `<rect x="${x - 1}" y="-4.3" width="2" height=".85" fill="${GLAS}"/><path d="M${x - 0.33} -4.3 v.85 M${x + 0.33} -4.3 v.85" stroke="#3a3028" stroke-width=".08"/>`;
    k += `<rect x="${x - 1}" y="-3.35" width=".98" height="2.75" fill="${S.lg("tuer", [[0, "#7a5a3a"], [1, "#4a3420"]], 0, 0, 1, 0)}"/><rect x="${x + 0.02}" y="-3.35" width=".98" height="2.75" fill="#55402a"/>`;
    k += `<rect x="${x - 0.82}" y="-3.1" width=".62" height="1" fill="none" stroke="#8a6a44" stroke-width=".06"/><rect x="${x + 0.2}" y="-3.1" width=".62" height="1" fill="none" stroke="#6a4e30" stroke-width=".06"/>`;
    k += `<rect x="${x - 0.82}" y="-1.8" width=".62" height=".95" fill="none" stroke="#8a6a44" stroke-width=".06"/><rect x="${x + 0.2}" y="-1.8" width=".62" height=".95" fill="none" stroke="#6a4e30" stroke-width=".06"/>`;
    k += `<rect x="${x - 0.16}" y="-2.2" width=".08" height=".4" fill="#e7c25a"/><rect x="${x + 0.08}" y="-2.2" width=".08" height=".4" fill="#c99e3a"/>`;
    k += `<path d="M${x - 1.2} -4.5 h2.4 v.3 h-2.1 V-.6 h-.3 Z" fill="#2a2a44" opacity=".35"/>`;
    k += `<rect x="${x - 1.45}" y="-4.95" width="2.9" height=".45" fill="#f6ecd6"/>`;
  }
  /* Gedenktafel links vom Eingang (1919) */
  k += `<rect x="-10.75" y="-3.7" width="1.35" height="1.9" fill="#3a3632"/><rect x="-10.6" y="-3.55" width="1.05" height="1.6" fill="none" stroke="#c9a54a" stroke-width=".05"/>`;
  for (let i = 0; i < 6; i++) k += `<rect x="-10.45" y="${r(-3.35 + i * 0.24)}" width="${i % 2 ? 0.6 : 0.75}" height=".06" fill="#c9a54a"/>`;
  /* Schaukasten rechts */
  k += `<rect x="9.5" y="-3.5" width="1.2" height="1.7" fill="#3a3632"/><rect x="9.6" y="-3.4" width="1" height="1.5" fill="#b8323a"/><rect x="9.7" y="-3.25" width=".8" height=".5" fill="#f2e3c4"/>`;
  k += `<rect x="${-M - 0.2}" y="-5.9" width="${2 * M + 0.4}" height=".75" fill="#f8f1e2"/><rect x="${-M - 0.2}" y="-5.15" width="${2 * M + 0.4}" height=".4" fill="${KUEHL}" opacity=".28"/>`;
  /* hohe Fenster zwischen den Säulen */
  for (const x of [-8, -4, 0, 4, 8]) { k += fenster(x, -6.8, -13.4, 2.1); k += `<rect x="${x - 1.3}" y="-6.75" width="2.6" height=".35" fill="#f2e9d6"/>`; }
  /* sechs Säulen mit Basis, Kannelur, ionischem Kapitell; Schattenseite rechts, Schlagschatten auf die Wand */
  const SAEULE = S.lg("saeule", [[0, "#fff8ea"], [0.4, "#efe2c6"], [0.8, "#bfae8c"], [1, "#9a8a6c"]], 0, 0, 1, 0);
  for (const x of [-10, -6, -2, 2, 6, 10]) {
    k += `<path d="M${x + 0.48} -14 L${x + 1.1} -14 L${x + 1.1} -6.1 L${x + 0.48} -6.1 Z" fill="${KUEHL}" opacity=".2"/>`;
    k += `<rect x="${x - 0.48}" y="-14.2" width=".96" height="8.3" fill="${SAEULE}"/>`;
    for (const f of [-0.24, 0, 0.24]) k += `<path d="M${r(x + f)} -14 V-6.3" stroke="#bba98a" stroke-width=".05"/>`;
    k += `<path d="M${x - 0.66} -14.2 L${x + 0.66} -14.2 L${x + 0.52} -14.55 L${x - 0.52} -14.55 Z" fill="#f4ead6"/>`;
    k += `<circle cx="${x - 0.5}" cy="-14.38" r=".2" fill="#efe3c8" stroke="#a8977a" stroke-width=".04"/><circle cx="${x + 0.5}" cy="-14.38" r=".2" fill="#d6c6a6" stroke="#a8977a" stroke-width=".04"/>`;
    k += `<rect x="${x - 0.62}" y="-6.2" width="1.24" height=".22" fill="#f2e9d6"/><rect x="${x - 0.7}" y="-5.98" width="1.4" height=".2" fill="#e2d4b8"/>`;
  }
  /* Gebälk mit dem Schriftzug, Gesims mit Schattenband, Attika */
  k += `<rect x="${-M - 0.3}" y="-15.6" width="${2 * M + 0.6}" height="1" fill="#f2e8d4"/>`;
  k += `<rect x="${-M - 0.2}" y="-16.9" width="${2 * M + 0.4}" height="1.3" fill="${TRAV}"/>`;
  k += `<text x="0" y="-15.85" font-size=".95" text-anchor="middle" fill="#6f6250" font-family="'Times New Roman',Georgia,serif" letter-spacing=".22">DEUTSCHES NATIONALTHEATER</text>`;
  k += `<rect x="${-M - 0.5}" y="-17.4" width="${2 * M + 1}" height=".55" fill="#fbf4e6"/><rect x="${-M - 0.3}" y="-16.85" width="${2 * M + 0.6}" height=".35" fill="${KUEHL}" opacity=".25"/>`;
  k += `<rect x="${-M}" y="-19" width="${2 * M}" height="1.6" fill="${S.lg("attika", [[0, "#f6ebd6"], [1, "#d9ccb0"]])}"/>`;
  k += `<rect x="${-M - 0.2}" y="-19.25" width="${2 * M + 0.4}" height=".3" fill="#fbf4e6"/>`;
  k += `<path d="M${-M + 0.3} -19.25 L${-M + 1.6} -19.9 L${M - 1.6} -19.9 L${M - 0.3} -19.25 Z" fill="${DACH}"/>`;
  /* Morgensonne: warm von links, rechte Seite kühler */
  k += `<rect x="${-W}" y="-14.4" width="${2 * W}" height="14.6" fill="${S.lg("thwarm", [[0, "#ffcf8a", 0.14], [0.5, "#ffcf8a", 0.04], [1, "#5a5a9a", 0.08]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${-M}" y="-19" width="${2 * M}" height="4.6" fill="${S.lg("thwarm2", [[0, "#ffcf8a", 0.12], [1, "#5a5a9a", 0.06]], 0, 0, 1, 0)}"/>`;
  S.teil({ id: "theater", de: "das Theater", syl: "the-A-ter", it: "il teatro", itSyl: "te-A-tro", en: "theatre", x: CX, y: TY, kunst: `<g transform="scale(${TU.toFixed(5)})">${k}</g>`,
    tipp: "Das Deutsche Nationaltheater: Hier wurde 1919 die erste demokratische Verfassung Deutschlands beschlossen.",
    zoom: { x: r(CX - 14 * TU), y: r(TY - 19 * TU), w: r(28 * TU), h: r(18.7 * TU) } });
  theaterUnter.push({ id: "gedenktafel", de: "die Gedenktafel", syl: "ge-DENK-ta-fel", it: "la targa commemorativa", itSyl: "TAR-ga com-me-mo-ra-TI-va", en: "memorial plaque",
    x: r(CX - 10.08 * TU), y: r(TY - 1.8 * TU), kunst: flaeche(-0.75 * TU, -1.95 * TU, 1.5 * TU, 1.95 * TU, 0.4),
    tipp: "Die Tafel erinnert an die Nationalversammlung von 1919. Daher kommt der Name „Weimarer Republik“." });
  theaterUnter.push({ id: "saeule", de: "die Säule", syl: "SÄU-le", it: "la colonna", itSyl: "co-LON-na", en: "column",
    x: r(CX + 6 * TU), y: r(TY - 5.8 * TU), kunst: flaeche(-0.55 * TU, -8.8 * TU, 1.1 * TU, 8.8 * TU, 0.4) });
  theaterUnter.push({ id: "tuer", de: "die Tür", syl: "TÜR", it: "la porta", itSyl: "POR-ta", en: "door",
    x: r(CX + 8 * TU), y: r(TY - 0.6 * TU), kunst: flaeche(-1.2 * TU, -3.9 * TU, 2.4 * TU, 3.9 * TU, 0.4) });
  theaterUnter.push({ id: "schriftzug", de: "der Schriftzug", syl: "SCHRIFT-zug", it: "la scritta", itSyl: "SCRIT-ta", en: "lettering",
    x: r(CX + 4.5 * TU), y: r(TY - 15.6 * TU), kunst: flaeche(-5.5 * TU, -1.3 * TU, 11 * TU, 1.3 * TU, 0.4),
    tipp: "Über den Säulen steht „Deutsches Nationaltheater“." });
}
S.teile[S.teile.length - 1].unter = theaterUnter;

/* =====================================================================
   3 — DIE BÄUME (Linden am Platz: ovale, dichte Kronen, Herbstgelb)
   ===================================================================== */
{
  let k = "";
  const STAMM = S.lg("stamm", [[0, "#8a7458"], [0.5, "#5b4836"], [1, "#2f261d"]], 0, 0, 1, 0);
  const T1 = ["#7a6a24", "#3e4a1c", "#c9a032", "#7d8a32", "#f6d86a", "#d8cc5a"];
  const T2 = ["#6e6a26", "#3a461c", "#d0a83a", "#869036", "#f8e07a", "#e0d468"];
  for (const [D, X, w, T, sd] of [[34, -20.8, 0.5, T1, 31], [28, -18.0, 0.55, T2, 32], [33, 20.4, 0.5, T2, 33], [27, 17.6, 0.55, T1, 34]]) {
    const x = xG(D, X), y0 = yG(D), y1 = yG(D, 9), bw = w * sk(D), u = sk(D);
    k += `<path d="M${r(x - bw)} ${r(y0)} Q${r(x - bw * 0.5)} ${r((y0 + y1) / 2)} ${r(x - bw * 0.4)} ${r(y1)} L${r(x + bw * 0.4)} ${r(y1)} Q${r(x + bw * 0.5)} ${r((y0 + y1) / 2)} ${r(x + bw)} ${r(y0)} Z" fill="${STAMM}"/>`;
    k += `<path d="M${r(x)} ${r(yG(D, 6))} q${r(1.1 * u)} ${r(-0.7 * u)} ${r(1.8 * u)} ${r(-2.4 * u)} M${r(x)} ${r(yG(D, 6.6))} q${r(-1 * u)} ${r(-0.6 * u)} ${r(-1.6 * u)} ${r(-2.2 * u)}" stroke="#4a3b2c" stroke-width="${r(0.2 * u)}" fill="none" stroke-linecap="round"/>`;
    bodenSchatten(D, X, 1, 10, 0.16);
    k += krone(r(x), r(yG(D, 10.5)), r(6.4 * u), r(9.2 * u), sd, T, 3);
  }
  S.teil({ id: "baum", de: "der Baum", syl: "BAUM", it: "l'albero", itSyl: "AL-be-ro", en: "tree", x: 0, y: 0, kunst: k,
    tipp: "Am Platz stehen Linden. Im Oktober werden ihre Blätter gelb." });
}

/* =====================================================================
   5 — DIE LATERNE (Weimarer Altstadtlaterne mit vierseitigem Glaskopf)
   ===================================================================== */
{
  let k = "";
  const GUSS = S.lg("guss", [[0, "#6a7074"], [0.4, "#2f3438"], [1, "#1a1d20"]], 0, 0, 1, 0);
  for (const [D, X] of [[27, -6.4], [27, 6.4]]) {
    const u = sk(D), x = xG(D, X), y = yG(D);
    bodenSchatten(D, X, 0.3, 4.4, 0.18);
    let g = `<path d="M-.24 0 L-.2 -.5 L-.09 -.62 L-.06 -3.5 L.06 -3.5 L.09 -.62 L.2 -.5 L.24 0 Z" fill="${GUSS}"/>`;
    g += `<path d="M-.2 -3.5 L.2 -3.5 L.28 -3.62 L-.28 -3.62 Z" fill="#2f3438"/>`;
    g += `<path d="M-.26 -3.62 L.26 -3.62 L.38 -4.42 L-.38 -4.42 Z" fill="#f8f2da" opacity=".95"/><path d="M0 -3.62 L0 -4.42 M-.26 -3.62 L-.38 -4.42 M.26 -3.62 L.38 -4.42" stroke="#2f3438" stroke-width=".035"/>`;
    g += `<path d="M.06 -3.62 L.26 -3.62 L.38 -4.42 L.1 -4.42 Z" fill="#c9c2a8" opacity=".6"/>`;
    g += `<path d="M-.46 -4.42 L.46 -4.42 L.12 -4.72 L-.12 -4.72 Z" fill="#2f3438"/><circle cx="0" cy="-4.78" r=".07" fill="#2f3438"/>`;
    k += `<g transform="translate(${r(x)} ${r(y)}) scale(${u.toFixed(4)})">${g}</g>`;
  }
  S.teil({ id: "laterne", de: "die Laterne", syl: "la-TER-ne", it: "il lampione", itSyl: "lam-PIO-ne", en: "street lamp", x: 0, y: 0, kunst: k });
}

/* =====================================================================
   6 — DAS DENKMAL: Goethe und Schiller (Bronze) auf dem Granitsockel
   ===================================================================== */
const DD = 18, DU = sk(DD), DY = yG(DD);
const denkmalUnter = [];
{
  bodenSchatten(DD, 0, 4.6, 6.9, 0.3);
  let k = "";
  /* Granitsockel in Metern: zwei Stufen, Fußgesims, Würfel mit Inschrift, Kopfgesims */
  S.def(`<pattern id="${S.id("granitkorn")}" patternUnits="userSpaceOnUse" width=".5" height=".4"><circle cx=".08" cy=".08" r=".03" fill="#4d4240"/><circle cx=".33" cy=".25" r=".025" fill="#e6d6cc"/><circle cx=".2" cy=".34" r=".02" fill="#6b4c48"/><circle cx=".42" cy=".06" r=".018" fill="#c9b2a8"/></pattern>`);
  const GRANIT = S.lg("granit", [[0, "#b8a69c"], [0.45, "#9a8780"], [1, "#6a5a55"]], 0, 0, 1, 0);
  let p = `<rect x="-2.3" y="-.32" width="4.6" height=".32" fill="#958780"/><rect x="-2.3" y="-.32" width="4.6" height=".06" fill="#cdbfb5"/>`;
  p += `<rect x="-2.0" y="-.64" width="4" height=".32" fill="#a39389"/><rect x="-2.0" y="-.64" width="4" height=".06" fill="#d2c4ba"/>`;
  /* Fußgesims: Plinthe, Wulst, Kehle */
  p += `<path d="M-1.8 -.64 L-1.8 -.9 L-1.72 -.96 Q-1.62 -1.04 -1.66 -1.12 L-1.52 -1.2 L1.52 -1.2 L1.66 -1.12 Q1.62 -1.04 1.72 -.96 L1.8 -.9 L1.8 -.64 Z" fill="${GRANIT}"/>`;
  /* Würfel */
  p += `<rect x="-1.52" y="-2.9" width="3.04" height="1.7" fill="${GRANIT}"/><rect x="-1.52" y="-2.9" width="3.04" height="1.7" fill="url(#${S.id("granitkorn")})" opacity=".7"/>`;
  p += `<rect x="1.1" y="-2.9" width=".42" height="1.7" fill="#3a2e2c" opacity=".25"/><rect x="-1.52" y="-2.9" width=".12" height="1.7" fill="#f2e6dc" opacity=".35"/>`;
  /* Kopfgesims: Platte, Karnies, Abdeckplatte (massiv, gerade Enden) */
  p += `<path d="M-1.52 -2.9 L-1.62 -2.98 Q-1.74 -3.04 -1.78 -3.14 L-1.84 -3.18 L-1.84 -3.4 L1.84 -3.4 L1.84 -3.18 L1.78 -3.14 Q1.74 -3.04 1.62 -2.98 L1.52 -2.9 Z" fill="${S.lg("gesims", [[0, "#c8b8ae"], [1, "#7c6c66"]])}"/>`;
  p += `<rect x="-1.84" y="-3.42" width="3.68" height=".06" fill="#e6d8ce"/><rect x="-1.52" y="-2.9" width="3.04" height=".12" fill="#2e2622" opacity=".3"/>`;
  const t = (y, txt) => `<text x="0" y="${y}" font-size=".21" text-anchor="middle" fill="${GOLD}" stroke="#5e4512" stroke-width=".012" font-family="'Times New Roman',Georgia,serif" letter-spacing=".02">${txt}</text>`;
  p += t(-2.42, "DEM DICHTERPAAR") + t(-2.08, "GOETHE UND SCHILLER") + t(-1.74, "DAS VATERLAND");
  /* Schlagschatten des Sockels nach rechts hinten auf die Stufen */
  p += `<path d="M1.52 -1.2 L2.0 -.9 L2.0 -.64 L2.3 -.32 L2.3 0 L1.9 0 L1.52 -.64 Z" fill="#2e2a40" opacity=".25"/>`;
  /* bronzene Plinthe mit Kante */
  p += `<path d="M-1.4 -3.4 L1.4 -3.4 L1.34 -3.58 L-1.34 -3.58 Z" fill="#3a3424"/><rect x="-1.36" y="-3.6" width="2.72" height=".05" fill="#a49464"/>`;
  k += `<g transform="scale(${DU.toFixed(5)})">${p}</g>`;
  /* DIE FIGUREN (100 Einheiten = 3,55 m; Ursprung Mitte der Plinthe) */
  const FS = 3.55 * DU / 100, fussY = -3.58 * DU;
  const BRZ = S.lg("brz", [[0, "#8f8158"], [0.22, "#605538"], [0.6, "#3a3324"], [1, "#1c1912"]], 0, 0, 1, 0);
  const BRZ2 = S.lg("brz2", [[0, "#6a5f40"], [0.5, "#3e3727"], [1, "#1c1912"]], 0, 0, 1, 0);
  const HL = "#d6c592", PAT = "#5f8268", DK = "#14120d";
  const kante = (d, w = 0.5) => `<path d="${d}" stroke="${HL}" stroke-width="${w}" fill="none" stroke-linecap="round" opacity=".85"/>`;
  const falte = (d, w = 0.45) => `<path d="${d}" stroke="${DK}" stroke-width="${w}" fill="none" stroke-linecap="round" opacity=".55"/><path d="${d}" stroke="${PAT}" stroke-width="${r(w * 0.6)}" fill="none" opacity=".5" transform="translate(.35 0)"/>`;
  const bein = (pts) => `<path d="${pts}" fill="${BRZ}"/>`;
  const schuh = (fx, dir) => `<path d="M${fx - 2.2} -4.8 L${fx + 2.2} -4.8 Q${fx + 2.2 + dir * 2.2} -1.6 ${fx + dir * 3.4} 0 L${fx - 2.4 + Math.min(0, dir) * 1.4} 0 Q${fx - 2.8} -2.2 ${fx - 2.2} -4.8 Z" fill="${BRZ2}"/><rect x="${fx - 0.9}" y="-4.1" width="1.8" height="1" fill="${HL}" opacity=".8"/>`;
  const arm = (pts, w) => `<path d="M${pts.map((q) => q.join(" ")).join(" L")}" stroke="url(#${S.id("brz")})" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<path d="M${pts.map((q) => (q[0] - w * 0.3) + " " + q[1]).join(" L")}" stroke="${HL}" stroke-width="${r(w * 0.18)}" fill="none" stroke-linecap="round" opacity=".7"/>` +
    `<path d="M${pts.map((q) => (q[0] + w * 0.3) + " " + q[1]).join(" L")}" stroke="${DK}" stroke-width="${r(w * 0.22)}" fill="none" stroke-linecap="round" opacity=".55"/>`;
  const hand = (x, y, rot, s2 = 1) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s2})"><path d="M-1.9 -1.2 Q0 -2 1.9 -1.1 L2.2 1.2 Q.4 2.3 -1.8 1.4 Z" fill="${BRZ}"/><path d="M-1.2 1.4 L-1 .2 M0 1.7 L.1 .3 M1.1 1.5 L1.1 .3" stroke="${DK}" stroke-width=".3" opacity=".6"/><path d="M-1.8 -1.1 Q0 -1.9 1.8 -1" stroke="${HL}" stroke-width=".35" fill="none" opacity=".7"/></g>`;
  const gesicht = (cx, cy, rot, nase) => `<g transform="rotate(${rot} ${cx} ${cy})">` +
    `<ellipse cx="${cx}" cy="${cy}" rx="4.6" ry="5.9" fill="${BRZ}"/>` +
    `<ellipse cx="${cx - 1.6}" cy="${cy + 1.2}" rx="1.6" ry="2.2" fill="${HL}" opacity=".22"/>` +
    `<path d="M${cx - 3.3} ${cy - 0.9} Q${cx - 1.8} ${cy - 2} ${cx - 0.4} ${cy - 1} M${cx + 0.6} ${cy - 1} Q${cx + 2} ${cy - 2} ${cx + 3.4} ${cy - 0.9}" stroke="${HL}" stroke-width=".5" fill="none" opacity=".75"/>` +
    `<ellipse cx="${cx - 1.8}" cy="${cy - 0.1}" rx="1.1" ry=".6" fill="${DK}" opacity=".7"/><ellipse cx="${cx + 1.9}" cy="${cy - 0.1}" rx="1.1" ry=".6" fill="${DK}" opacity=".75"/>` +
    `<path d="${nase}" fill="${HL}" opacity=".6"/>` +
    `<path d="M${cx - 1.2} ${cy + 3.1} q1.2 .5 2.4 0" stroke="${DK}" stroke-width=".45" fill="none"/>` +
    `<ellipse cx="${cx + 0.2}" cy="${cy + 4.6}" rx="2.6" ry=".9" fill="${DK}" opacity=".45"/>` +
    `<ellipse cx="${cx + 2.6}" cy="${cy + 1.2}" rx="1.4" ry="2.6" fill="${DK}" opacity=".3"/></g>`;
  const GO = -12, SC = 12;
  let fig = "";
  /* Goethes linker Arm: Oberarm hinter Schillers Schulter */
  fig += `<g transform="translate(${GO} 0)">${arm([[10.4, -80.6], [14.8, -72.4], [14.4, -82.2]], 5.2)}</g>`;
  /* --- Schiller: langer offener Rock, Kopf erhoben --- */
  {
    let g = `<path d="M-12.8 -62 Q-14.6 -44 -15.4 -22 L15.4 -22 Q14.6 -44 12.8 -62 Z" fill="${BRZ2}"/>`;
    g += bein("M-6.8 -52 L-1.4 -52 L-1.6 -28 Q-1 -20 -2.8 -12 L-3 -5 L-4.8 -5 L-5 -12 Q-7.4 -20 -6.6 -28 Z") + bein("M1.2 -52 L6.8 -52 L6.4 -28 Q7.8 -20 5.4 -12 L5.2 -5 L3.4 -5 L3.2 -12 Q1.8 -20 2.2 -28 Z");
    g += kante("M-6.4 -24 Q-6.8 -16 -5.4 -6") + kante("M2.4 -24 Q2.4 -16 3 -6");
    g += schuh(-4, -1) + schuh(4.2, 1);
    g += `<path d="M-5.2 -80 L5.2 -80 L5.6 -54 L0 -51 L-5.6 -54 Z" fill="${BRZ2}"/>`;
    for (let y = -77; y > -56; y -= 4.2) g += `<circle cx="0" cy="${y}" r=".55" fill="${HL}" opacity=".8"/>`;
    g += `<path d="M-3.6 -86.5 L0 -80 L3.6 -86.5 L2 -87.6 L0 -84 L-2 -87.6 Z" fill="#8a7c54"/>`;
    g += `<path d="M-10.4 -83.2 Q-12.1 -80.4 -11.7 -72 Q-10.8 -64 -9.8 -60 Q-13.4 -42 -14.6 -23 Q-11.6 -21.4 -9 -23 Q-7.6 -40 -6.6 -56 L-6.4 -70 L-7.6 -76 L-3.8 -86.4 Q-7.6 -86.2 -10.4 -83.2 Z" fill="${BRZ}"/>`;
    g += `<path d="M10.4 -83.2 Q12.1 -80.4 11.7 -72 Q10.8 -64 9.8 -60 Q13.4 -42 14.6 -23 Q11.6 -21.4 9 -23 Q7.6 -40 6.6 -56 L6.4 -70 L7.6 -76 L3.8 -86.4 Q7.6 -86.2 10.4 -83.2 Z" fill="${BRZ}"/>`;
    g += `<path d="M-3.8 -86.4 L-7.6 -76 L-6.4 -70 L-5.4 -74 Z" fill="#7a6e4a"/><path d="M3.8 -86.4 L7.6 -76 L6.4 -70 L5.4 -74 Z" fill="#2e2a1e"/>`;
    g += `<path d="M-4.4 -86.8 Q-9 -87.4 -11.2 -83 L-7.6 -77 Z" fill="#6a5f40"/><path d="M4.4 -86.8 Q9 -87.4 11.2 -83 L7.6 -77 Z" fill="#2a261b"/>`;
    g += kante("M-10.8 -82 Q-11.8 -76 -11.3 -70 Q-10.4 -63 -9.8 -59 Q-13 -42 -14.2 -24", 0.6);
    g += falte("M-10.6 -64 Q-11.2 -46 -12.6 -26") + falte("M-8.6 -40 Q-8.2 -32 -9.6 -24") + falte("M10.2 -64 Q10.8 -46 12.2 -26") + falte("M8.6 -44 Q9 -34 10.2 -24");
    /* linker Arm (rechts im Bild) mit der Schriftrolle */
    g += arm([[10.6, -80.5], [12.4, -63], [10.8, -51]], 5.4);
    g += `<path d="M9.4 -57 L12.6 -40" stroke="#7a6e4a" stroke-width="2.6" stroke-linecap="round"/><path d="M8.8 -57 L12 -40" stroke="${HL}" stroke-width=".5" opacity=".7"/><ellipse cx="9.4" cy="-57" rx="1.4" ry=".9" fill="${HL}" opacity=".8" transform="rotate(-12 9.4 -57)"/>`;
    g += hand(10.8, -50, 80, 0.9);
    /* Kopf erhoben, langes welliges Haar bis zum Kragen, kräftige Nase */
    g += `<rect x="-2" y="-90" width="4" height="4.4" fill="#4a4230"/>`;
    g += `<path d="M-5.4 -93 Q-6.4 -101.8 -.4 -101.8 Q5.6 -101.6 5.6 -94.6 Q6 -90 5.4 -86.4 Q4.2 -85.6 3.4 -86.8 Q4 -91.8 3 -96 Q-1 -98.4 -4 -95.8 Q-4.8 -91.4 -3.6 -87 Q-4.6 -85.6 -5.8 -86.4 Q-6.2 -90 -5.4 -93 Z" fill="${BRZ2}"/>`;
    g += gesicht(-0.3, -93.8, -7, "M-.4 -95.6 Q.2 -93.4 1.2 -92 L-.4 -91.6 Z");
    g += `<path d="M-5.2 -96 Q-4.6 -100.6 -.6 -101 Q3.6 -100.8 5 -97.2 Q2.4 -99.4 -.4 -99.2 Q-3.2 -99 -5.2 -96 Z" fill="${BRZ2}"/><path d="M-4.6 -97 Q-2 -100.4 2.6 -99.6" stroke="${HL}" stroke-width=".45" fill="none" opacity=".7"/>`;
    g += `<path d="M-5.6 -92 q.8 2.4 .2 5 M5 -92 q-.4 2.4 .2 5" stroke="${HL}" stroke-width=".35" fill="none" opacity=".6"/>`;
    fig += `<g transform="translate(${SC} 0)">${g}</g>`;
  }
  /* --- Goethe: Hofrock, Weste, Kniehose, Strümpfe, Schnallenschuhe; ruhig, Blick geradeaus --- */
  {
    let g = `<path d="M-12.6 -62 Q-14.4 -46 -14.8 -32 L14.8 -32 Q14.4 -46 12.6 -62 Z" fill="${BRZ2}"/>`;
    g += bein("M-6.6 -52 L-1.2 -52 L-1.6 -28 Q-1.0 -22 -2.6 -12 L-2.8 -5 L-4.6 -5 L-4.8 -12 Q-7.2 -20 -6.2 -28 Z") + bein("M1.2 -52 L6.8 -52 L6.6 -28 Q8 -20 5.6 -12 L5.4 -4.6 L3.6 -4.6 L3.4 -12 Q2.0 -20 2.2 -28 Z");
    for (const [x0, x1] of [[-6.4, -1.2], [1.9, 6.7]]) g += `<rect x="${x0}" y="-29.6" width="${r(x1 - x0)}" height="1.4" fill="#2e2a1e"/><rect x="${r(x1 - 1.4)}" y="-29.4" width=".9" height="1" fill="${HL}" opacity=".8"/>`;
    g += kante("M-6 -26 Q-6.4 -17 -4.8 -6") + kante("M2.2 -26 Q2.4 -17 3.4 -6");
    g += schuh(-3.6, -1) + schuh(4.6, 1);
    g += `<path d="M-5.4 -82 L5.4 -82 L6 -50 L0 -47 L-6 -50 Z" fill="${BRZ2}"/>`;
    for (let y = -79; y > -52; y -= 3.4) g += `<circle cx=".2" cy="${y}" r=".5" fill="${HL}" opacity=".8"/>`;
    g += `<path d="M-5 -60 h3.2 M2 -60 h3.2" stroke="${HL}" stroke-width=".4" opacity=".6"/>`;
    g += `<path d="M-2 -86.6 Q0 -85 2 -86.6 L1.5 -80 Q0 -78.6 -1.5 -80 Z" fill="#8a7c54"/>`;
    g += `<path d="M-10.2 -83.2 Q-11.9 -80.4 -11.5 -72 Q-10.6 -64 -9.6 -60 Q-12.6 -48 -13.8 -33 Q-11 -31.6 -8.6 -33 Q-7.4 -46 -5.6 -58 L-3.6 -78 L-2.2 -86 Q-6.6 -85.8 -10.2 -83.2 Z" fill="${BRZ}"/>`;
    g += `<path d="M10.2 -83.2 Q11.9 -80.4 11.5 -72 Q10.6 -64 9.6 -60 Q12.6 -48 13.8 -33 Q11 -31.6 8.6 -33 Q7.4 -46 5.6 -58 L3.6 -78 L2.2 -86 Q6.6 -85.8 10.2 -83.2 Z" fill="${BRZ}"/>`;
    g += `<path d="M-4.4 -86 Q0 -89 4.4 -86 L3.6 -83.6 Q0 -85.6 -3.6 -83.6 Z" fill="#6a5f40"/>`;
    g += kante("M-10.6 -82 Q-11.6 -76 -11.1 -70 Q-10.2 -63 -9.6 -59 Q-12.2 -47 -13.4 -34", 0.6) + kante("M-3.4 -78 L-5.2 -58 Q-6.8 -46 -8 -34", 0.35);
    g += falte("M-10.4 -64 Q-11 -48 -12 -35") + falte("M10 -64 Q10.6 -48 11.6 -35") + falte("M-7.6 -50 Q-7.8 -42 -9 -34", 0.35);
    g += `<path d="M7.2 -74.6 L7.7 -73.1 L9.2 -72.6 L7.7 -72.1 L7.2 -70.6 L6.7 -72.1 L5.2 -72.6 L6.7 -73.1 Z" fill="#e2d39c"/>`;
    /* rechter Arm hält den Kranz vor dem Körper */
    g += arm([[-10.8, -80.5], [-12.2, -63.5], [1.6, -49.6]], 5.6);
    /* Kopf: hohe Stirn, Haar nach hinten mit Seitenrollen */
    g += `<rect x="-2" y="-90" width="4" height="4.4" fill="#4a4230"/>`;
    g += gesicht(0.2, -93.6, 0, "M.2 -95 L-.5 -91.4 L.9 -91.2 Z");
    g += `<path d="M-4.9 -94.6 Q-5.4 -100.8 0 -100.8 Q5.4 -100.8 5.1 -94.6 Q4.2 -98 0 -98.4 Q-4 -98 -4.9 -94.6 Z" fill="${BRZ2}"/><path d="M-4 -97.2 Q-1.6 -100 2.4 -99.6" stroke="${HL}" stroke-width=".45" fill="none" opacity=".7"/>`;
    fig += `<g transform="translate(${GO} 0)">${g}</g>`;
  }
  /* Schillers rechter Arm greift zum Kranz (vor Goethes Rockschoß) */
  fig += `<g transform="translate(${SC} 0)">${arm([[-10.6, -80.5], [-12.8, -63.5], [-11.2, -48.6]], 5.4)}${hand(-11.4, -46.8, 100, 0.95)}</g>`;
  /* der Lorbeerkranz: Ring aus Blättern, zwei herabhängende Bänder */
  const KX = -4.2, KY = -44.6, KR = 5.4;
  let kranz = `<path d="M${KX - 0.8} ${KY + KR} L${KX - 2.4} ${KY + KR + 7} L${KX - 1.4} ${KY + KR + 6.2} L${KX - 1.1} ${KY + KR + 7.6} Z M${KX + 0.8} ${KY + KR} L${KX + 2} ${KY + KR + 6.6} L${KX + 1} ${KY + KR + 5.9} L${KX + 0.6} ${KY + KR + 7.2} Z" fill="#4a4230"/>`;
  kranz += `<ellipse cx="${KX}" cy="${KY}" rx="${KR}" ry="${KR * 0.92}" fill="none" stroke="#2a261b" stroke-width="1.6"/>`;
  for (let i = 0; i < 22; i++) { const w = i / 22 * Math.PI * 2, rr = KR + (i % 2 ? 0.6 : -0.6), x = KX + Math.cos(w) * rr, y = KY + Math.sin(w) * rr * 0.92; kranz += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="1.6" ry=".65" fill="${Math.cos(w + 0.8) < 0 ? "#9a8c5e" : "#4a4430"}" transform="rotate(${Math.round(w * 57.3 + 60)} ${r(x)} ${r(y)})"/>`; }
  fig += kranz;
  /* Goethes Hand liegt auf Schillers Schulter */
  fig += `<g transform="translate(${GO} 0)">${hand(15.4, -83, 15, 1.15)}</g>`;
  /* Goethes rechte Hand am Kranz */
  fig += `<g transform="translate(${GO} 0)">${hand(3, -48.8, 70, 0.95)}</g>`;
  k += `<g transform="translate(0 ${r(fussY)}) scale(${FS.toFixed(5)})">${fig}</g>`;
  const Pp = (x, y) => ({ x: x * FS, y: fussY + y * FS });
  const kz = Pp(KX, KY), sr = Pp(SC + 11, -48);
  S.teil({ id: "denkmal", de: "das Denkmal", syl: "DENK-mal", it: "il monumento", itSyl: "mo-nu-MEN-to", en: "monument", x: CX, y: DY, kunst: k,
    tipp: "Das Goethe-Schiller-Denkmal steht seit 1857 vor dem Theater. Es ist das berühmteste Denkmal in Weimar.",
    zoom: { x: r(CX - 3.6 * DU), y: r(DY - 7.4 * DU), w: r(7.2 * DU), h: r(4.8 * DU) } });
  denkmalUnter.push({ id: "dichter", de: "der Dichter", syl: "DICH-ter", it: "il poeta", itSyl: "po-E-ta", en: "poet", x: CX, y: r(DY + fussY),
    kunst: flaeche(-28 * FS, -102 * FS, 56 * FS, 102 * FS, 0.5), tipp: "Links steht Johann Wolfgang von Goethe, rechts Friedrich Schiller. Beide waren Dichter und Freunde." });
  denkmalUnter.push({ id: "lorbeerkranz", de: "der Lorbeerkranz", syl: "LOR-beer-kranz", it: "la corona d'alloro", itSyl: "co-RO-na dal-LO-ro", en: "laurel wreath", x: r(CX + kz.x), y: r(DY + kz.y + 6.4 * FS),
    kunst: flaeche(-6.6 * FS, -12.8 * FS, 13.2 * FS, 13.4 * FS, 0.3), tipp: "Der Lorbeerkranz ist ein Zeichen für Ruhm. Beide Dichter halten ihn zusammen." });
  denkmalUnter.push({ id: "schriftrolle", de: "die Schriftrolle", syl: "SCHRIFT-rol-le", it: "il rotolo di carta", itSyl: "RO-to-lo di CAR-ta", en: "scroll", x: r(CX + sr.x), y: r(DY + sr.y + 9 * FS),
    kunst: flaeche(-2.6 * FS, -18 * FS, 5.2 * FS, 18 * FS, 0.3) });
  denkmalUnter.push({ id: "sockel", de: "der Sockel", syl: "SO-ckel", it: "il piedistallo", itSyl: "pie-di-STAL-lo", en: "pedestal", x: CX, y: r(DY - 0.64 * DU),
    kunst: flaeche(-1.8 * DU, -2.8 * DU, 3.6 * DU, 2.8 * DU, 0.5), tipp: "Auf dem Sockel steht: „Dem Dichterpaar Goethe und Schiller das Vaterland“." });
}
S.teile[S.teile.length - 1].unter = denkmalUnter;

/* =====================================================================
   7 — DIE TAUBEN vor dem Denkmal
   ===================================================================== */
{
  const TAUBE = S.lg("taube", [[0, "#b4b9c4"], [1, "#6e7480"]]);
  const taube = (D, X, pick, s2 = 1) => {
    const u = sk(D) * 0.042 * s2, x = xG(D, X), y = yG(D);
    bodenSchatten(D, X, 0.3, 0.25, 0.25);
    let g = `<path d="M-.6 0 l-.3 -1.6 M.8 0 l.2 -1.6" stroke="#d2544a" stroke-width=".4"/>`;
    g += `<path d="M-4.4 -3 Q-2 -6.2 2 -5 L5.4 -4.4 L5 -3.4 Q1 -1.2 -4.4 -3 Z" fill="${TAUBE}"/>`;
    g += `<path d="M-1.6 -4.8 Q1.6 -5.6 4.6 -4.2 Q1.6 -3.4 -1.2 -3.6 Z" fill="#8a909c"/><path d="M.6 -4.6 L3 -4.1 M.8 -3.9 L3.2 -3.7" stroke="#2f3238" stroke-width=".3"/>`;
    const kx = pick ? -5 : -3.6, ky = pick ? -1.4 : -6.4;
    g += `<path d="M-3 -4.4 Q${kx + 0.6} ${ky + 1.6} ${kx} ${ky}" stroke="#6f8f7e" stroke-width="1.8" fill="none" stroke-linecap="round"/><circle cx="${kx}" cy="${ky}" r="1.15" fill="#7d838e"/><circle cx="${kx - 0.3}" cy="${ky - 0.25}" r=".25" fill="#e98a2a"/><path d="M${kx - 1} ${ky + 0.1} l-1 .4 l1 .2 Z" fill="#3a3a3e"/>`;
    return `<g transform="translate(${r(x)} ${r(y)}) scale(${u.toFixed(4)})">${g}</g>`;
  };
  const k = taube(13.2, -0.9, true) + taube(12.6, 0.2, false) + taube(14, 1.3, true, 1) + taube(9.6, 0.3, false) + taube(9.2, -0.4, true);
  S.teil({ oben: true, id: "taube", de: "die Taube", syl: "TAU-be", it: "il piccione", itSyl: "pic-CIO-ne", en: "pigeon", x: 0, y: 0, kunst: k,
    tipp: "Die Tauben suchen auf dem Platz nach Krümeln." });
}

/* =====================================================================
   8 — DIE MARKTSTÄNDE (Zwiebelstand links, angeschnitten rechts: Zwiebelkuchen)
   Stände als Körper: Front, Seitenwand zur Bildmitte, Dach mit Unterseite
   ===================================================================== */
const stand = (D, X0, X1, T, h, dach, seite, schild, schrift, sf) => {
  const D1 = D + T;
  let g = "";
  /* Rückwand und Seitenwand (sichtbar zur Mitte), Innenraum dunkel */
  g += `<path d="M${P(D1, X0, 0)} L${P(D1, X1, 0)} L${P(D1, X1, h)} L${P(D1, X0, h)} Z" fill="#3a2a1c"/>`;
  const Xs = seite > 0 ? X1 : X0;
  g += `<path d="M${P(D, Xs, 0)} L${P(D1, Xs, 0)} L${P(D1, Xs, h + 0.3)} L${P(D, Xs, h)} Z" fill="${HOLZ_S}"/>`;
  let br = "";
  for (let i = 1; i < 4; i++) br += `M${P(D + T * i / 4, Xs, 0)} L${P(D + T * i / 4, Xs, h + 0.3 * i / 4)} `;
  g += `<path d="${br}" stroke="#3a2414" stroke-width=".3"/>`;
  /* Pfosten vorn */
  for (const X of [X0 + 0.06, X1 - 0.06]) g += `<path d="M${P(D, X - 0.06, 0)} L${P(D, X + 0.06, 0)} L${P(D, X + 0.06, h)} L${P(D, X - 0.06, h)} Z" fill="#5a3a1c"/>`;
  /* Pultdach: vorn h, hinten h + 0.3; die Unterseite sieht man von unten (über Augenhöhe) */
  g += `<path d="M${P(D - 0.25, X0 - 0.2, h)} L${P(D - 0.25, X1 + 0.2, h)} L${P(D1 + 0.1, X1 + 0.2, h + 0.3)} L${P(D1 + 0.1, X0 - 0.2, h + 0.3)} Z" fill="#2a1d12"/>`;
  g += `<path d="M${P(D - 0.25, X0 - 0.2, h + 0.18)} L${P(D - 0.25, X1 + 0.2, h + 0.18)} L${P(D - 0.25, X1 + 0.2, h - 0.02)} L${P(D - 0.25, X0 - 0.2, h - 0.02)} Z" fill="${dach}"/>`;
  /* Markisenband */
  const n = Math.round((X1 - X0 + 0.4) / 0.4);
  let mk = "";
  for (let i = 0; i < n; i++) { const a = X0 - 0.2 + i * (X1 - X0 + 0.4) / n, b = a + (X1 - X0 + 0.4) / n, m2 = (a + b) / 2; if (i % 2 === 0) mk += `M${P(D - 0.25, a, h - 0.02)} L${P(D - 0.25, b, h - 0.02)} L${P(D - 0.25, b, h - 0.22)} Q${P(D - 0.25, m2, h - 0.32)} ${P(D - 0.25, a, h - 0.22)} Z `; }
  g += `<path d="M${P(D - 0.25, X0 - 0.2, h - 0.02)} L${P(D - 0.25, X1 + 0.2, h - 0.02)} L${P(D - 0.25, X1 + 0.2, h - 0.22)} L${P(D - 0.25, X0 - 0.2, h - 0.22)} Z" fill="#f4efe6"/><path d="${mk}" fill="#b8323a"/>`;
  /* Schild */
  const sx = xG(D - 0.25, (X0 + X1) / 2), sy = yG(D - 0.25, h + 0.42), su = sk(D - 0.25);
  g += `<rect x="${r(sx - (X1 - X0) * 0.42 * su)}" y="${r(sy - 0.17 * su)}" width="${r((X1 - X0) * 0.84 * su)}" height="${r(0.34 * su)}" rx=".5" fill="${schild}" stroke="#5a3a1c" stroke-width=".3"/>`;
  g += `<text x="${r(sx)}" y="${r(sy + 0.08 * su)}" font-size="${r(sf * su)}" text-anchor="middle" fill="#6a2a12" font-family="Georgia,serif" font-weight="bold">${schrift}</text>`;
  /* Theke: Front, Oberseite (von oben sichtbar) */
  g += `<path d="M${P(D, X0, 0.95)} L${P(D, X1, 0.95)} L${P(D + 0.6, X1, 0.95)} L${P(D + 0.6, X0, 0.95)} Z" fill="#c9a06a"/>`;
  g += `<path d="M${P(D, X0, 0)} L${P(D, X1, 0)} L${P(D, X1, 0.95)} L${P(D, X0, 0.95)} Z" fill="${HOLZ}"/>`;
  let br2 = "";
  for (let i = 1; i < 9; i++) { const X = X0 + (X1 - X0) * i / 9; br2 += `M${P(D, X, 0)} L${P(D, X, 0.95)} `; }
  g += `<path d="${br2}" stroke="#5e3d20" stroke-width=".25"/>`;
  g += `<path d="M${P(D, X0, 0.95)} L${P(D, X1, 0.95)}" stroke="#e8c48a" stroke-width=".5"/>`;
  return g;
};
const ZW = { D: 13, X0: -7.4, X1: -3.8, T: 1.8, h: 2.55 };
const ZK = { D: 16, X0: 8.2, X1: 11.8, T: 1.8, h: 2.55 };
{
  bodenSchatten(ZW.D + 0.9, (ZW.X0 + ZW.X1) / 2, 3.6, 2.6, 0.26);
  bodenSchatten(ZK.D + 0.9, (ZK.X0 + ZK.X1) / 2, 3.6, 2.6, 0.22);
  let k = stand(ZK.D, ZK.X0, ZK.X1, ZK.T, ZK.h, "#3d6b48", -1, "#f4ecd8", "Zwiebelkuchen · Federweißer", 0.2);
  /* Zwiebelkuchen-Bleche auf der Theke */
  for (let i = 0; i < 3; i++) { const X = ZK.X0 + 0.5 + i * 1.05; k += `<path d="M${P(ZK.D + 0.15, X, 0.98)} L${P(ZK.D + 0.15, X + 0.9, 0.98)} L${P(ZK.D + 0.5, X + 0.9, 0.98)} L${P(ZK.D + 0.5, X, 0.98)} Z" fill="#e2b45a" stroke="#8a5a20" stroke-width=".2"/>`; }
  k += stand(ZW.D, ZW.X0, ZW.X1, ZW.T, ZW.h, "#7a4a24", 1, "#f4ecd8", "Zwiebeln aus Heldrungen", 0.2);
  /* Preisschild an der Theke */
  const px = xG(ZW.D, ZW.X0 + 0.9), py = yG(ZW.D, 0.62), pu = sk(ZW.D);
  k += `<rect x="${r(px - 0.5 * pu)}" y="${r(py - 0.17 * pu)}" width="${r(1.0 * pu)}" height="${r(0.32 * pu)}" fill="#f4ecd8"/><text x="${r(px)}" y="${r(py + 0.08 * pu)}" font-size="${r(0.2 * pu)}" text-anchor="middle" fill="#2f5a32" font-family="Georgia,serif" font-weight="bold">Zopf 8 €</text>`;
  S.teil({ id: "marktstand", de: "der Marktstand", syl: "MARKT-stand", it: "la bancarella", itSyl: "ban-ca-REL-la", en: "market stall", x: 0, y: 0, kunst: k,
    tipp: "Beim Zwiebelmarkt im Oktober stehen in der ganzen Altstadt Marktstände." });
}
{
  /* DIE VERKÄUFERIN: frontal hinter der Theke, hält einen Zopf hoch */
  const V = mensch("V", { id: "wmr_verk", geschlecht: "w", blick: 14, frisur: "dutt", haarfarbe: "braun", haut: "hell", laecheln: true,
    pose: { lende: 1, brust: -2, nacken: 4, kopf: 2, schulterL: { vor: 10, seit: 12 }, ellbogenL: 70, unterarmL: 40, handL: 4, fingerL: 0.5,
      schulterR: { vor: 50, seit: 36, dreh: 10 }, ellbogenR: 70, unterarmR: 40, handR: 0, fingerR: 0.85,
      huefteL: { vor: 3, seit: 3, dreh: -6 }, knieL: 3, fussL: 0, huefteR: { vor: -3, seit: 2.5, dreh: -6 }, knieR: 2, fussR: 0 },
    kleidung: { oberteil: { stueck: "pullover", farbe: "gruen_d" }, schuerze: { stueck: "schuerze", farbe: "beige" }, unterteil: { stueck: "hose", farbe: "braun" }, schuhe: { stueck: "stiefel" }, zubehoer: { stueck: "schal", farbe: "rot" } } }, 1.64, ZW.D + 0.7, (ZW.X0 + ZW.X1) / 2 + 0.1, 2, 0.6);
  const theke = yG(ZW.D, 0.95);
  S.def(`<clipPath id="${S.id("hinterTheke")}"><rect x="-60" y="-120" width="120" height="${r(theke - V.y + 120)}"/></clipPath>`);
  S.teil({ id: "verkaeuferin", de: "die Verkäuferin", syl: "ver-KÄU-fe-rin", it: "la venditrice", itSyl: "ven-di-TRI-ce", en: "saleswoman", x: V.x, y: V.y,
    kunst: `<g clip-path="url(#${S.id("hinterTheke")})">${V.svg}</g>`, tipp: "Die Verkäuferin sagt: „Ein Zwiebelzopf bringt Glück in die Küche!“" });
  FIG.Vh = V.p(V.m.z.handR);
}
/* DER ZWIEBELZOPF: geflochten, oben eine Schlaufe, nach unten schmaler, mit Strohblumen */
S.def(`<radialGradient id="${S.id("zwgelb")}" cx=".36" cy=".3" r=".75"><stop offset="0" stop-color="#f6dca0"/><stop offset=".55" stop-color="#cf9442"/><stop offset="1" stop-color="#7e4c1a"/></radialGradient>`);
S.def(`<radialGradient id="${S.id("zwrot")}" cx=".36" cy=".3" r=".75"><stop offset="0" stop-color="#e09ab4"/><stop offset=".55" stop-color="#93304f"/><stop offset="1" stop-color="#4e1028"/></radialGradient>`);
/* eine Zwiebel (Breite 1): Knolle mit Spitze nach oben, Schalenlinien, Licht von links */
S.def(`<g id="${S.id("knolle")}"><path d="M0 -.62 Q.12 -.4 .42 -.22 Q.58 .1 .3 .34 Q0 .46 -.3 .34 Q-.58 .1 -.42 -.22 Q-.12 -.4 0 -.62 Z"/><path d="M-.18 -.3 Q-.3 .05 -.14 .32 M.12 -.3 Q.26 .05 .14 .32" stroke="#fff" stroke-width=".05" fill="none" opacity=".35"/></g>`);
const zopf = (x, y, len, s2, rotAnteil, seed) => {
  /* Koordinaten in Metern, Ursprung an der Schlaufe; Knollen dicht und schuppig übereinander, nach unten schmaler */
  const z = zufall(seed);
  let g = `<path d="M-.07 .02 Q0 -.18 .07 .02" stroke="#c9b27a" stroke-width=".035" fill="none"/>`;
  g += `<path d="M-.05 .04 L.05 .04 L.02 ${r(len)} L-.02 ${r(len)} Z" fill="#b89a5e"/>`;
  const reihen = Math.round(len / 0.06);
  for (let i = reihen - 1; i >= 0; i--) {
    const t = i / reihen, w = 0.2 * (1 - t * 0.6), yy = 0.09 + i * 0.06, n = t < 0.6 ? 3 : 2;
    for (let j = 0; j < n; j++) {
      const xx = (j - (n - 1) / 2) * w * 0.55 + (i % 2 ? 0.03 : -0.03) + (z() - 0.5) * 0.02, f = 0.2 * (1 - t * 0.45) * (0.9 + z() * 0.2);
      g += `<use href="#${S.id("knolle")}" fill="url(#${S.id(z() < rotAnteil ? "zwrot" : "zwgelb")})" transform="translate(${r(xx)} ${r(yy)}) rotate(${Math.round((z() - 0.5) * 40)}) scale(${r(f)})"/>`;
    }
  }
  /* Strohblumen oben im Zopf und ein Büschel Schlotten */
  for (let i = 0; i < 7; i++) g += `<circle cx="${r((z() - 0.5) * 0.2)}" cy="${r(0.03 + z() * 0.1)}" r=".03" fill="${["#e8c34a", "#c9354a", "#8c5aa8", "#f2ead6", "#e8843a", "#c9354a", "#e8c34a"][i]}"/>`;
  return `<g transform="translate(${r(x)} ${r(y)}) scale(${s2.toFixed(4)})">${g}</g>`;
};
{
  const u = sk(ZW.D);
  let k = "";
  const ya = yG(ZW.D - 0.2, ZW.h - 0.3);
  /* Querstange */
  k += `<path d="M${P(ZW.D - 0.2, ZW.X0 + 0.1, ZW.h - 0.3)} L${P(ZW.D - 0.2, ZW.X1 - 0.1, ZW.h - 0.3)}" stroke="#5a3a1c" stroke-width=".6"/>`;
  const pos = [[0.22, 0.95, 0.2], [0.5, 0.8, 0.5], [0.78, 0.92, 0.1], [2.78, 0.88, 0.3], [3.08, 0.98, 0.0], [3.36, 0.82, 0.6]];
  pos.forEach(([dx, len, rot], i) => { k += zopf(xG(ZW.D - 0.2, ZW.X0 + dx), ya, len, u, rot, i * 7 + 3); });
  /* liegende Zöpfe auf der Theke (quer, von oben gesehen) */
  for (const [dx, rot] of [[0.7, 0.3], [3.0, 0.1]]) k += `<g transform="translate(${r(xG(ZW.D + 0.3, ZW.X0 + dx))} ${r(yG(ZW.D + 0.3, 1.0))}) rotate(-84)">${zopf(0, 0, 0.6, u, rot, Math.round(dx * 10))}</g>`;
  S.teil({ id: "zwiebelzopf", de: "der Zwiebelzopf", syl: "ZWIE-bel-zopf", it: "la treccia di cipolle", itSyl: "TREC-cia di ci-POL-le", en: "onion braid", x: 0, y: 0, kunst: k,
    tipp: "Zwiebelzöpfe sind das Wahrzeichen des Weimarer Zwiebelmarkts. Den Markt gibt es seit 1653." });
  /* der Zopf in der Hand der Verkäuferin */
}

/* =====================================================================
   9 — DER GRILL mit Thüringer Rostbratwürsten (rechts), DER VERKÄUFER
   ===================================================================== */
const GR = { D: 12.5, X0: 2.9, X1: 6.3, T: 1.8, h: 2.5 };
{
  bodenSchatten(GR.D + 0.9, (GR.X0 + GR.X1) / 2, 3.4, 2.6, 0.26);
  let k = stand(GR.D, GR.X0, GR.X1, GR.T, GR.h, "#2f5a3a", -1, "#f4ecd8", "Thüringer Rostbratwurst", 0.19);
  /* Senftopf auf der Theke */
  const sx = xG(GR.D + 0.25, GR.X1 - 0.45), sy = yG(GR.D + 0.25, 0.95), su = sk(GR.D);
  k += `<path d="M${r(sx - 0.13 * su)} ${r(sy)} L${r(sx - 0.15 * su)} ${r(sy - 0.24 * su)} L${r(sx + 0.15 * su)} ${r(sy - 0.24 * su)} L${r(sx + 0.13 * su)} ${r(sy)} Z" fill="#f4eee0"/><ellipse cx="${r(sx)}" cy="${r(sy - 0.24 * su)}" rx="${r(0.15 * su)}" ry="${r(0.04 * su)}" fill="#e6c23a"/><rect x="${r(sx - 0.12 * su)}" y="${r(sy - 0.17 * su)}" width="${r(0.24 * su)}" height="${r(0.08 * su)}" fill="#c9302a"/><text x="${r(sx)}" y="${r(sy - 0.115 * su)}" font-size="${r(0.06 * su)}" text-anchor="middle" fill="#fff" font-family="Arial">Senf</text>`;
  S.teil({ id: "grill", de: "der Grill", syl: "GRILL", it: "la griglia", itSyl: "GRI-glia", en: "grill", x: 0, y: 0, kunst: k, tipp: "Die Thüringer Rostbratwurst wird auf einem Rost über Holzkohle gegrillt." });
}
const V2 = mensch("V2", { id: "wmr_grill", geschlecht: "m", blick: -14, frisur: "kurz", haarfarbe: "dunkelbraun", haut: "hell", laecheln: true,
  pose: { lende: 1, brust: -1, nacken: 8, kopf: 4, schulterL: { vor: 30, seit: 10 }, ellbogenL: 70, unterarmL: 40, handL: 4, fingerL: 0.6,
    schulterR: { vor: 42, seit: 20, dreh: 10 }, ellbogenR: 64, unterarmR: 30, handR: 0, fingerR: 0.9,
    huefteL: { vor: 3, seit: 3, dreh: -6 }, knieL: 3, fussL: 0, huefteR: { vor: -3, seit: 2.5, dreh: -6 }, knieR: 2, fussR: 0 },
  kleidung: { oberteil: { stueck: "tshirt", farbe: "schwarz" }, schuerze: { stueck: "schuerze", farbe: "weiss" }, unterteil: { stueck: "hose", farbe: "schwarz" }, schuhe: { stueck: "halbschuh" }, kopf: { stueck: "kappe", farbe: "rot" } } }, 1.8, GR.D + 0.8, (GR.X0 + GR.X1) / 2 - 0.2, 2, 0.6);
{
  const theke = yG(GR.D, 0.95);
  S.def(`<clipPath id="${S.id("hinterGrill")}"><rect x="-60" y="-120" width="120" height="${r(theke - V2.y + 120)}"/></clipPath>`);
  /* Grillzange in der rechten Hand, sie greift eine Wurst auf dem Rost */
  const h = V2.p(V2.m.z.handR), zx = xG(GR.D - 0.15, GR.X0 + 1.1), zy = yG(GR.D - 0.15, 1.02);
  const zange = `<path d="M${r(h.x - V2.x)} ${r(h.y - V2.y)} L${r(zx - V2.x)} ${r(zy - V2.y)} M${r(h.x - V2.x + 0.4)} ${r(h.y - V2.y + 0.2)} L${r(zx - V2.x + 0.5)} ${r(zy - V2.y)}" stroke="#b9c1c6" stroke-width=".35" stroke-linecap="round"/>`;
  S.teil({ id: "verkaeufer", de: "der Verkäufer", syl: "ver-KÄU-fer", it: "il venditore", itSyl: "ven-di-TO-re", en: "salesman", x: V2.x, y: V2.y,
    kunst: `<g clip-path="url(#${S.id("hinterGrill")})">${V2.svg}</g>${zange}`, tipp: "Der Verkäufer wendet die Würste mit der Grillzange und fragt: „Mit Senf?“" });
}
{
  /* Holzkohlegrill vor der Theke: Wanne, glühende Kohlen, Rost mit Würsten; Rauch zieht nach rechts oben */
  let k = "";
  const X0 = GR.X0 + 0.25, X1 = GR.X1 - 0.25, D = GR.D - 0.3;
  for (const X of [X0 + 0.1, X1 - 0.1]) k += `<path d="M${P(D, X, 0)} L${P(D, X, 0.85)}" stroke="#2b2e31" stroke-width=".8"/>`;
  k += `<path d="M${P(D, X0, 1.0)} L${P(D, X1, 1.0)} L${P(D, X1 - 0.1, 0.82)} L${P(D, X0 + 0.1, 0.82)} Z" fill="#2b2e31"/>`;
  k += `<path d="M${P(D, X0, 1.0)} L${P(D, X1, 1.0)} L${P(D + 0.5, X1, 1.0)} L${P(D + 0.5, X0, 1.0)} Z" fill="#1d1a18"/>`;
  const z = zufall(12);
  let glut = "";
  for (let i = 0; i < 26; i++) { const X = X0 + 0.1 + z() * (X1 - X0 - 0.2), Dd = D + 0.05 + z() * 0.4, [x, y] = [xG(Dd, X), yG(Dd, 1.0)]; glut += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(0.6 + z() * 0.5)}" ry="${r(0.3 + z() * 0.2)}" fill="${z() < 0.45 ? "#ff8a2a" : z() < 0.7 ? "#c43a1a" : "#3a2a24"}"/>`; }
  k += `<g>${glut}</g>`;
  /* Rost */
  let rost = "";
  for (let i = 0; i <= 10; i++) { const X = X0 + (X1 - X0) * i / 10; rost += `M${P(D, X, 1.05)} L${P(D + 0.5, X, 1.05)} `; }
  k += `<path d="${rost}" stroke="#8a9196" stroke-width=".18"/>`;
  /* Würste: lang, dünn, mit Röstmustern */
  const W = S.lg("wurst", [[0, "#d58a46"], [0.5, "#a3552a"], [1, "#6a3014"]]);
  for (let i = 0; i < 6; i++) {
    const X = X0 + 0.3 + i * (X1 - X0 - 0.6) / 5, [x, y] = [xG(D + 0.2 + (i % 2) * 0.15, X), yG(D + 0.2 + (i % 2) * 0.15, 1.07)], su = sk(D);
    k += `<rect x="${r(x - 0.12 * su)}" y="${r(y - 0.03 * su)}" width="${r(0.24 * su)}" height="${r(0.06 * su)}" rx="${r(0.03 * su)}" fill="${W}" transform="rotate(${-6 + i * 2.5} ${r(x)} ${r(y)})"/><path d="M${r(x - 0.06 * su)} ${r(y - 0.02 * su)} v${r(0.04 * su)} M${r(x + 0.04 * su)} ${r(y - 0.02 * su)} v${r(0.04 * su)}" stroke="#3a1a0a" stroke-width=".15"/>`;
  }
  const cx = xG(D, X1 - 0.5), cy = yG(D, 1.0), su = sk(D);
  S.davor(`<g filter="url(#${S.id("rauch")})" opacity=".45" pointer-events="none"><path d="M${r(cx - 0.8 * su)} ${r(cy - 0.2 * su)} Q${r(cx - 0.6 * su)} ${r(cy - 1.4 * su)} ${r(cx + 0.6 * su)} ${r(cy - 2.4 * su)} Q${r(cx + 1.8 * su)} ${r(cy - 3.4 * su)} ${r(cx + 3.2 * su)} ${r(cy - 4.0 * su)} L${r(cx + 3.6 * su)} ${r(cy - 3.4 * su)} Q${r(cx + 1.6 * su)} ${r(cy - 2.4 * su)} ${r(cx + 0.6 * su)} ${r(cy - 1.4 * su)} Q${r(cx - 0.2 * su)} ${r(cy - 0.8 * su)} ${r(cx - 0.2 * su)} ${r(cy - 0.2 * su)} Z" fill="#ece8e2"/>` +
    `<path d="M${r(cx + 0.4 * su)} ${r(cy - 0.2 * su)} Q${r(cx + 0.8 * su)} ${r(cy - 1.6 * su)} ${r(cx + 2 * su)} ${r(cy - 2.2 * su)} Q${r(cx + 3 * su)} ${r(cy - 2.8 * su)} ${r(cx + 4.2 * su)} ${r(cy - 2.9 * su)} L${r(cx + 4.2 * su)} ${r(cy - 2.4 * su)} Q${r(cx + 2.6 * su)} ${r(cy - 2.0 * su)} ${r(cx + 1.4 * su)} ${r(cy - 1.2 * su)} Q${r(cx + 0.8 * su)} ${r(cy - 0.6 * su)} ${r(cx + 0.8 * su)} ${r(cy - 0.2 * su)} Z" fill="#dcd8d0" opacity=".8"/></g>`);
  S.teil({ oben: true, id: "rostbratwurst", de: "die Rostbratwurst", syl: "ROST-brat-wurst", it: "la salsiccia alla griglia", itSyl: "sal-SIC-cia AL-la GRI-glia", en: "grilled sausage", x: 0, y: 0, kunst: k,
    tipp: "Die Thüringer Rostbratwurst isst man im Brötchen — mit Senf, ohne Ketchup." });
}

/* =====================================================================
   10 — DIE ZWIEBEL: eine Kiste mit losen Zwiebeln vor dem Stand
   ===================================================================== */
{
  const D = 11.6, X = -4.4, u = sk(D), x = xG(D, X), y = yG(D);
  bodenSchatten(D, X, 0.6, 0.4, 0.26);
  let g = `<path d="M-.32 0 L.32 0 L.34 -.3 L-.34 -.3 Z" fill="${HOLZ}"/><path d="M-.34 -.3 L.34 -.3 L.3 -.38 L-.3 -.38 Z" fill="#6a4424"/><path d="M-.32 -.1 H.32 M-.33 -.2 H.33" stroke="#5e3d20" stroke-width=".015"/>`;
  for (const [dx, dy, rot] of [[-0.2, -0.38, 0], [-0.04, -0.4, 1], [0.14, -0.39, 0], [-0.12, -0.46, 0], [0.06, -0.48, 1], [0.24, -0.42, 0]]) g += `<use href="#${S.id("knolle")}" fill="url(#${S.id(rot ? "zwrot" : "zwgelb")})" transform="translate(${dx} ${dy}) scale(.15)"/>`;
  g += `<use href="#${S.id("knolle")}" fill="url(#${S.id("zwgelb")})" transform="translate(.5 -.07) scale(.15)"/>`;
  S.teil({ oben: true, id: "zwiebel", de: "die Zwiebel", syl: "ZWIE-bel", it: "la cipolla", itSyl: "ci-POL-la", en: "onion", x: r(x), y: r(y), steht: true,
    kunst: `<g transform="scale(${u.toFixed(4)})">${g}</g>`, tipp: "Die Zwiebeln kommen aus Heldrungen. Es gibt gelbe und rote." });
}

/* =====================================================================
   11 — DIE LITFASSSÄULE mit dem Bauhaus-Plakat (links vorn), matter Papierton
   ===================================================================== */
const LS = { D: 8.6, X: -6.0 };
{
  const u = sk(LS.D), x = xG(LS.D, LS.X), y = yG(LS.D);
  bodenSchatten(LS.D, LS.X, 1.2, 3.6, 0.28);
  let g = "";
  const R = 0.6;
  g += `<rect x="${-R - 0.05}" y="-.3" width="${2 * R + 0.1}" height=".3" fill="#2f4a3a"/>`;
  g += `<rect x="${-R}" y="-3.2" width="${2 * R}" height="2.9" fill="#e6e0d2"/>`;
  g += `<rect x="-.48" y="-3.0" width=".7" height="1.05" fill="#f2efe6"/>`;
  g += `<circle cx="-.3" cy="-2.72" r=".14" fill="#d23b2a"/><rect x="-.15" y="-2.62" width=".26" height=".26" fill="#2f5aa8"/><path d="M-.4 -2.2 L-.2 -2.52 L0 -2.2 Z" fill="#f2c230"/>`;
  g += `<text x="-.13" y="-2.08" font-size=".09" text-anchor="middle" fill="#1d1d1d" font-family="Arial,sans-serif" font-weight="bold">bauhaus museum</text><text x="-.13" y="-1.99" font-size=".07" text-anchor="middle" fill="#1d1d1d" font-family="Arial,sans-serif">weimar</text>`;
  g += `<path d="M.22 -1.95 L.22 -2.1 L.08 -1.95 Z" fill="#c9c4b8"/>`;
  g += `<rect x=".26" y="-2.95" width=".3" height="1.0" fill="#1f2a44"/><text x=".41" y="-2.6" font-size=".09" text-anchor="middle" fill="#f2c230" font-family="Georgia,serif" font-weight="bold">FAUST</text><text x=".41" y="-2.48" font-size=".05" text-anchor="middle" fill="#e8e0c8" font-family="Arial">DNT Weimar</text>`;
  g += `<rect x="-.48" y="-1.8" width="1.0" height=".95" fill="#e9b24a"/><text x=".02" y="-1.4" font-size=".11" text-anchor="middle" fill="#6a2a12" font-family="Georgia,serif" font-weight="bold">Zwiebelmarkt</text><text x=".02" y="-1.25" font-size=".07" text-anchor="middle" fill="#6a2a12" font-family="Arial">9.–11. Oktober</text>`;
  g += `<path d="M-.6 -1.8 h1.2 M-.6 -1.95 h1.2 M-.6 -3.02 h1.2" stroke="#b9b2a2" stroke-width=".015"/>`;
  /* matte Rundung: links Licht, rechts Eigenschatten, kein Glanz */
  g += `<rect x="${-R}" y="-3.2" width="${2 * R}" height="2.9" fill="${S.lg("rundlicht", [[0, "#fff4dc", 0.12], [0.35, "#fff", 0.04], [0.65, "#2e2a40", 0.08], [1, "#2e2a40", 0.42]], 0, 0, 1, 0)}"/>`;
  g += `<rect x="${-R - 0.08}" y="-3.36" width="${2 * R + 0.16}" height=".18" fill="#2f4a3a"/><rect x="${-R - 0.05}" y="-3.48" width="${2 * R + 0.1}" height=".06" fill="#c9a54a"/>`;
  g += `<path d="M${-R - 0.02} -3.36 Q${-R} -3.8 0 -3.86 Q${R} -3.8 ${R + 0.02} -3.36 Z" fill="${S.lg("lsdach", [[0, "#5a8a6a"], [1, "#24402e"]], 0, 0, 1, 0)}"/><path d="M0 -3.86 V-4.05" stroke="#24402e" stroke-width=".05"/><circle cx="0" cy="-4.08" r=".05" fill="#c9a54a"/>`;
  S.teil({ id: "litfasssaeule", de: "die Litfaßsäule", syl: "LIT-faß-säu-le", it: "la colonna delle affissioni", itSyl: "co-LON-na DEL-le af-fis-SIO-ni", en: "advertising column", x: r(x), y: r(y), steht: true,
    kunst: `<g transform="scale(${u.toFixed(4)})">${g}</g>`, tipp: "Die Litfaßsäule hat Ernst Litfaß 1855 in Berlin erfunden.",
    zoom: { x: r(x - 0.95 * u), y: r(y - 3.25 * u), w: r(1.9 * u), h: r(1.3 * u) },
    unter: [{ id: "plakat", de: "das Plakat", syl: "pla-KAT", it: "il manifesto", itSyl: "ma-ni-FE-sto", en: "poster", x: r(x - 0.13 * u), y: r(y - 1.95 * u),
      kunst: flaeche(-0.35 * u, -1.05 * u, 0.7 * u, 1.05 * u, 0.4), tipp: "Das Bauhaus wurde 1919 in Weimar gegründet. Kreis, Quadrat und Dreieck sind typisch für das Bauhaus-Design." }] });
}

/* =====================================================================
   12 — DAS FAHRRAD mit Zwiebelzopf am Lenker (an der Litfaßsäule)
   ===================================================================== */
{
  const D = 7.4, X = -3.6, u = sk(D), x = xG(D, X), y = yG(D);
  bodenSchatten(D, X, 1.7, 1, 0.24);
  let g = "";
  const rad = (cx) => `<circle cx="${cx}" cy="-.34" r=".34" fill="none" stroke="#1d1d1d" stroke-width=".045"/><circle cx="${cx}" cy="-.34" r=".3" fill="none" stroke="#b9bfc4" stroke-width=".008"/><circle cx="${cx}" cy="-.34" r=".04" fill="#8a9196"/>`;
  g += rad(-0.55) + rad(0.55);
  g += `<path d="M-.55 -.34 L-.1 -.34 L-.25 -.82 L.42 -.82 L-.1 -.34 M.42 -.82 L.55 -.34 M-.25 -.82 L-.29 -.92 M.42 -.82 L.38 -.98" stroke="#c23a2a" stroke-width=".05" fill="none" stroke-linejoin="round"/>`;
  g += `<path d="M-.4 -.95 L-.16 -.95" stroke="#2b2b2b" stroke-width=".07" stroke-linecap="round"/><path d="M.28 -1.0 Q.38 -1.05 .5 -.98" stroke="#2b2b2b" stroke-width=".04" fill="none"/>`;
  g += `<rect x="-.75" y="-.72" width=".38" height=".18" fill="#c8a45e"/>`;
  g += `<g transform="translate(.42 -.98) scale(.5)">${zopf(0, 0, 0.7, 1, 0.3, 77)}</g>`;
  S.teil({ id: "fahrrad", de: "das Fahrrad", syl: "FAHR-rad", it: "la bicicletta", itSyl: "bi-ci-CLET-ta", en: "bicycle", x: r(x), y: r(y), steht: true,
    kunst: `<g transform="scale(${u.toFixed(4)})">${g}</g>`, tipp: "Am Lenker hängt ein Zwiebelzopf. Viele Studenten fahren in Weimar Fahrrad." });
}

/* =====================================================================
   13 — DIE STUDENTIN mit dem BUCH, DER TOURIST mit dem BRÖTCHEN, DIE FAMILIE
   ===================================================================== */
const ST = mensch("ST", { id: "wmr_stud", geschlecht: "w", blick: 40, frisur: "locken", haarfarbe: "dunkelbraun", haut: "mittel",
  pose: { lende: 1, brust: -1, nacken: 22, kopf: 14, schulterL: { vor: 26, seit: 12 }, ellbogenL: 96, unterarmL: 50, handL: 4, fingerL: 0.5,
    schulterR: { vor: 24, seit: 13 }, ellbogenR: 98, unterarmR: 50, handR: 4, fingerR: 0.5,
    huefteL: { vor: 3, seit: 3, dreh: -6 }, knieL: 3, fussL: 0, huefteR: { vor: -5, seit: 4, dreh: -10 }, knieR: 9, fussR: 5 },
  kleidung: { oberteil: { stueck: "pullover", farbe: "blau" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" }, zubehoer: { stueck: "schal", farbe: "gelb" } } }, 1.68, 8.6, -1.5, 1.5, 0.45);
bodenSchatten(8.6, -1.5, 0.45, 1.68, 0.26);
S.teil({ id: "studentin", de: "die Studentin", syl: "stu-DEN-tin", it: "la studentessa", itSyl: "stu-den-TES-sa", en: "student", x: ST.x, y: ST.y, kunst: ST.svg,
  tipp: "Die Studentin liest „Faust“ von Goethe." });
const TO = mensch("TO", { id: "wmr_tour", geschlecht: "m", blick: -32, frisur: "kurz", haarfarbe: "blond", haut: "hell", laecheln: true,
  pose: { lende: 1, brust: -2, nacken: 6, kopf: 4, schulterL: { vor: 3, seit: 8 }, ellbogenL: 14, unterarmL: 10, handL: 6, fingerL: 0.38,
    schulterR: { vor: 40, seit: 18, dreh: 20 }, ellbogenR: 110, unterarmR: 40, handR: 10, fingerR: 0.7,
    huefteL: { vor: 6, seit: 3, dreh: -6 }, knieL: 4, fussL: 0, huefteR: { vor: -3, seit: 2.5, dreh: -6 }, knieR: 2, fussR: 0 },
  kleidung: { oberteil: { stueck: "tshirt", farbe: "grau" }, jacke: { stueck: "jacke", farbe: "rot" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" }, zubehoer: { stueck: "rucksack", farbe: "blau" } } }, 1.8, 8.4, 1.6, 1.5, 0.45);
bodenSchatten(8.4, 1.6, 0.5, 1.8, 0.26);
S.teil({ id: "tourist", de: "der Tourist", syl: "tou-RIST", it: "il turista", itSyl: "tu-RI-sta", en: "tourist", x: TO.x, y: TO.y, kunst: TO.svg,
  tipp: "Der Tourist isst eine Rostbratwurst. Lecker!" });
{
  /* Brötchen mit Wurst: die Wurst ragt an beiden Enden weit heraus, Senfstreifen */
  const h = TO.p(TO.m.z.handR);
  let g = `<rect x="-6.4" y="-1.35" width="12.8" height="1.35" rx=".67" fill="${S.lg("wurst2", [[0, "#d58a46"], [0.5, "#a3552a"], [1, "#6a3014"]])}"/>`;
  g += `<path d="M-5.4 -1.2 l.4 .9 M-4 -1.2 l.4 .9 M3.4 -1.2 l.4 .9 M4.8 -1.2 l.4 .9" stroke="#3a1a0a" stroke-width=".2"/>`;
  g += `<path d="M-3.2 -.2 Q0 1.4 3.2 -.2 L2.9 .6 Q0 2 -2.9 .6 Z" fill="#e2b06a"/>`;
  g += `<path d="M-2.8 -1.15 l.6 -.3 l.6 .3 l.6 -.3 l.6 .3 l.6 -.3 l.6 .3 l.6 -.3 l.6 .3 l.6 -.3" stroke="#e9c13a" stroke-width=".35" fill="none"/>`;
  g += `<path d="M-3.4 -.15 Q0 -1.3 3.4 -.15 Q3 .3 0 .1 Q-3 .3 -3.4 -.15 Z" fill="#d9a35a"/>`;
  S.teil({ oben: true, id: "broetchen", de: "das Brötchen", syl: "BRÖT-chen", it: "il panino", itSyl: "pa-NI-no", en: "bread roll", x: r(h.x), y: r(h.y - 0.6), kunst: g + flaeche(-6.8, -2, 13.6, 3.8, 0.5),
    tipp: "Zur Rostbratwurst gehört ein Brötchen. Die Wurst ist immer länger als das Brötchen." });
}
{
  /* das Buch (gelbes Reclam-Heft), aufgeschlagen */
  const hs = [ST.m.z.handL, ST.m.z.handR].map((q) => ST.p(q));
  const hx = (hs[0].x + hs[1].x) / 2, hy = (hs[0].y + hs[1].y) / 2;
  let g = `<path d="M-3.4 -1.6 Q-1.6 -2.2 0 -1.4 Q1.6 -2.2 3.4 -1.6 L3.4 1.8 Q1.6 1.2 0 2 Q-1.6 1.2 -3.4 1.8 Z" fill="#f2c230" stroke="#b88a10" stroke-width=".2"/>`;
  g += `<path d="M-3 -1.3 Q-1.5 -1.8 -.2 -1.2 L-.2 1.6 Q-1.5 1 -3 1.4 Z M3 -1.3 Q1.5 -1.8 .2 -1.2 L.2 1.6 Q1.5 1 3 1.4 Z" fill="#f8f2e2"/>`;
  g += `<path d="M-2.6 -.8 H-.7 M-2.6 -.3 H-.7 M-2.6 .2 H-.9 M.7 -.8 H2.6 M.7 -.3 H2.6 M.7 .2 H2.2" stroke="#8a826e" stroke-width=".15"/>`;
  S.teil({ oben: true, id: "buch", de: "das Buch", syl: "BUCH", it: "il libro", itSyl: "LI-bro", en: "book", x: r(hx), y: r(hy - 0.4), kunst: g + flaeche(-3.8, -2.6, 7.6, 5, 0.5),
    tipp: "Goethe und Schiller haben in Weimar viele berühmte Bücher geschrieben." });
}
{
  /* DIE FAMILIE: Mutter und Kind vom Zwiebelmarkt, das Kind trägt einen kleinen Zwiebelzopf um den Hals */
  const MU = mensch("MU", { id: "wmr_mutter", geschlecht: "w", blick: -20, frisur: "pony", haarfarbe: "hellbraun", haut: "hell", laecheln: true, pose: "gehen",
    kleidung: { oberteil: { stueck: "pullover", farbe: "rosa" }, jacke: { stueck: "mantel", farbe: "gruen_d" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "stiefel" }, zubehoer: { stueck: "tasche", farbe: "braun" } } }, 1.68, 7.0, 3.0, 2, 0.5);
  const KI = mensch("KI", { id: "wmr_kind", alter: "kind", geschlecht: "w", blick: -26, frisur: "zopf", haarfarbe: "blond", haut: "hell", laecheln: true, pose: "gehen",
    kleidung: { oberteil: { stueck: "pullover", farbe: "gelb" }, jacke: { stueck: "jacke", farbe: "rot" }, unterteil: { stueck: "hose", farbe: "jeans" }, schuhe: { stueck: "gummistiefel" }, kopf: { stueck: "muetze", farbe: "blau" } } }, 1.18, 6.8, 3.9, 2, 0.5);
  bodenSchatten(7.0, 3.0, 0.45, 1.68, 0.26);
  bodenSchatten(6.8, 3.9, 0.35, 1.18, 0.26);
  /* kleiner Zopf als Kette um den Hals des Kindes */
  const hals = KI.p(KI.m.z.kopf);
  const kette = `<path d="M${r(hals.x - KI.x - 2.2)} ${r(hals.y - KI.y + 4)} Q${r(hals.x - KI.x)} ${r(hals.y - KI.y + 9)} ${r(hals.x - KI.x + 2.2)} ${r(hals.y - KI.y + 4)}" stroke="#c4a86a" stroke-width=".4" fill="none"/>` +
    [[-1.4, 6.6], [0, 7.6], [1.4, 6.6]].map(([dx, dy], i) => `<use href="#${S.id("knolle")}" fill="url(#${S.id(i === 1 ? "zwrot" : "zwgelb")})" transform="translate(${r(hals.x - KI.x + dx)} ${r(hals.y - KI.y + dy)}) scale(1.1)"/>`).join("");
  S.teil({ id: "familie", de: "die Familie", syl: "fa-MI-lie", it: "la famiglia", itSyl: "fa-MI-glia", en: "family", x: KI.x, y: KI.y,
    kunst: `<g transform="translate(${r(MU.x - KI.x)} ${r(MU.y - KI.y)})">${MU.svg}</g>${KI.svg}${kette}`,
    tipp: "Die Familie war auf dem Zwiebelmarkt. Das Kind trägt einen kleinen Zwiebelzopf als Kette." });
}

/* Der Platz: Granitpflaster mit Fugen zum Fluchtpunkt, Steintextur, Lindenblätter, alle Schatten */
{
  let k = `<path d="M0 ${r(yG(80))} L400 ${r(yG(80))} L400 260 L0 260 Z" fill="${S.lg("pflaster", [[0, "#b4ab9e"], [1, "#958b7e"]])}"/>`;
  let fugen = "";
  for (let D = 6.5; D < 80; D *= 1.07) fugen += `M0 ${r(yG(D))} H400 `;
  for (let X = -40; X <= 40; X += 1.2) {
    let [ax, ay, bx, by] = [xG(80, X), yG(80), xG(6, X), yG(6)];
    if (by > 260) { const t = (260 - ay) / (by - ay); bx = ax + (bx - ax) * t; by = 260; }
    if (bx < 0 || bx > 400) { const xr = bx < 0 ? 0 : 400; const t = (xr - ax) / (bx - ax); if (t <= 0) continue; by = ay + (by - ay) * t; bx = xr; }
    if (ax < 0 || ax > 400) continue;
    fugen += `M${r(ax)} ${r(ay)} L${r(bx)} ${r(by)} `;
  }
  k += `<path d="${fugen}" stroke="#6e655a" stroke-width=".25" fill="none" opacity=".55"/>`;
  {
    const z = zufall(9);
    for (const [n, w, h, dx] of [["stein", 8, 3, 0], ["stein2", 13, 5, 4.4]]) {
      let t = "";
      for (let i = 0; i < 18; i++) t += `<rect x="${r(z() * w)}" y="${r(z() * h)}" width="${r(0.6 + z() * 1.4)}" height="${r(0.3 + z() * 0.3)}" fill="${["#c6bcae", "#857b6e", "#a69c8e", "#b9a99a"][i % 4]}"/>`;
      S.def(`<pattern id="${S.id(n)}" patternUnits="userSpaceOnUse" width="${w}" height="${h}" patternTransform="translate(${dx} ${dx / 2})">${t}</pattern>`);
    }
    k += `<path d="M0 ${r(yG(30))} L400 ${r(yG(30))} L400 ${r(yG(12))} L0 ${r(yG(12))} Z" fill="url(#${S.id("stein")})" opacity=".35"/>`;
    k += `<path d="M0 ${r(yG(12))} L400 ${r(yG(12))} L400 260 L0 260 Z" fill="url(#${S.id("stein2")})" opacity=".4"/>`;
  }
  /* gelbe Lindenblätter */
  let bl = "";
  const z = zufall(61);
  for (let i = 0; i < 40; i++) { const D = 6.5 + z() * 22, X = (z() - 0.5) * 2 * Math.min(13, D * 0.75), x = xG(D, X), y = yG(D) + z() * 0.5, s2 = 0.13 * sk(D); if (x < 3 || x > 397 || y > 257) continue; bl += `<path d="M${r(x)} ${r(y)} q${r(s2 * 0.5)} ${r(-s2 * 0.7)} ${r(s2)} 0 q${r(-s2 * 0.5)} ${r(s2 * 0.5)} ${r(-s2)} 0 Z" fill="${["#e8c34a", "#d9a83a", "#c98a2a", "#b9a83a"][i % 4]}" transform="rotate(${Math.round(z() * 180)} ${r(x)} ${r(y)})"/>`; }
  k += bl;
  k += `<g filter="url(#${S.id("schw")})">${schattenListe.join("")}</g>`;
  k += `<rect x="0" y="${r(yG(80))}" width="400" height="${r(260 - yG(80))}" fill="${S.lg("platzlicht", [[0, "#000", 0.06], [0.3, "#000", 0], [1, "#fff0d0", 0.1]])}"/>`;
  PLATZ.kunst = k;
}

/* Warmes Morgenlicht über allem (fängt keinen Tipp ab): golden von links, kühl rechts */
S.davor(`<rect width="400" height="260" fill="${S.lg("morgen", [[0, "#ffcf8a", 0.14], [0.55, "#ffcf8a", 0.03], [1, "#6a6aa8", 0.08]], 0, 0, 1, 0)}" pointer-events="none"/>`);

/* Pfade relativ schreiben, ohne Drift gerundet — Genauigkeit nach Größe des Pfads
   (große Bildpfade 0,1; kleine, in Metern gezeichnete Formen 0,01 bzw. 0,001) */
const relativ = (d) => {
  if (/[AaSsTt]/.test(d)) return d;
  const tok = d.match(/[MLHVCQZmlhvcqz]|-?\d*\.?\d+(?:e-?\d+)?/g);
  if (!tok) return d;
  const N = { M: 2, L: 2, H: 1, V: 1, C: 6, Q: 4, Z: 0 };
  /* erst absolut auflösen, um die Größe zu kennen */
  const segs = [];
  let i = 0, cx = 0, cy = 0, sx = 0, sy = 0, cmd = null;
  while (i < tok.length) {
    const t = tok[i];
    if (/[A-Za-z]/.test(t)) { cmd = t; i++; if (/[Zz]/.test(cmd)) { segs.push(["z"]); cx = sx; cy = sy; continue; } }
    if (!cmd) return d;
    const C = cmd.toUpperCase(), rel = cmd !== C, n = N[C];
    const a = tok.slice(i, i + n).map(Number); i += n;
    if (a.length < n || a.some(isNaN)) return d;
    if (C === "H") { cx = rel ? cx + a[0] : a[0]; segs.push(["h", cx]); continue; }
    if (C === "V") { cy = rel ? cy + a[0] : a[0]; segs.push(["v", cy]); continue; }
    const abs = [];
    for (let k = 0; k < n; k += 2) abs.push(rel ? cx + a[k] : a[k], rel ? cy + a[k + 1] : a[k + 1]);
    segs.push([C === "M" ? "m" : C.toLowerCase(), ...abs]);
    cx = abs[n - 2]; cy = abs[n - 1];
    if (C === "M") { sx = cx; sy = cy; cmd = rel ? "l" : "L"; }
  }
  let xs = [], ys = [];
  for (const s of segs) { if (s[0] === "h") xs.push(s[1]); else if (s[0] === "v") ys.push(s[1]); else for (let k = 1; k < s.length; k += 2) { xs.push(s[k]); ys.push(s[k + 1]); } }
  if (!xs.length) xs = [0]; if (!ys.length) ys = [0];
  const ext = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys));
  const dez = ext >= 60 ? 1 : ext >= 6 ? 2 : 3, p = Math.pow(10, dez);
  const R = (v) => Math.round(v * p) / p;
  const zahl = (v) => { let s = (Math.round(v * p) / p).toFixed(dez).replace(/\.?0+$/, ""); if (s === "-0" || s === "") s = "0"; return s.replace(/^(-?)0\./, "$1."); };
  let out = "", last = "", rx = 0, ry = 0, rsx = 0, rsy = 0;
  const put = (c, nums) => {
    let s = "";
    nums.forEach((n, k) => { const t = zahl(n); if (k === 0 && c === last) s += (t.startsWith("-") ? "" : " ") + t; else if (k === 0) s += c + t; else s += (t.startsWith("-") ? "" : " ") + t; });
    out += s; last = c === "m" ? "l" : c;
  };
  for (const s of segs) {
    if (s[0] === "z") { out += "z"; last = "z"; rx = rsx; ry = rsy; continue; }
    if (s[0] === "h") { const X = R(s[1]); put("h", [X - rx]); rx = X; continue; }
    if (s[0] === "v") { const Y = R(s[1]); put("v", [Y - ry]); ry = Y; continue; }
    const absR = s.slice(1).map(R);
    put(s[0], absR.map((v, k) => v - (k % 2 ? ry : rx)));
    rx = absR[absR.length - 2]; ry = absR[absR.length - 1];
    if (s[0] === "m") { rsx = rx; rsy = ry; }
  }
  return out;
};
const relativAlles = (svg) => svg.replace(/ d="([^"]+)"/g, (m, d) => ` d="${relativ(d)}"`);
/* vor dem Schreiben alle Zeichnungen einer Szene umformen */
const szeneRelativ = (S) => {
  S.defs = S.defs.map(relativAlles); S.kulisse = S.kulisse.map(relativAlles); S.vorne = S.vorne.map(relativAlles);
  for (const t of S.teile) { t.kunst = relativAlles(t.kunst); if (t.unter) for (const u of t.unter) u.kunst = relativAlles(u.kunst); }
};
szeneRelativ(S);
const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/weimar.js"));
console.log(aus);
