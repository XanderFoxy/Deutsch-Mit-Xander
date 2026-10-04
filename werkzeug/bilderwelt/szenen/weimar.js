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
     Zwiebelkuchen und Apfelsaft; die THÜRINGER
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
let KLEIN = 8;
/* Figuren sparen: runde Linienenden erbt die Gruppe; gleiche Verläufe teilen sich die Stopps per href */
const VERLAUF = {};
const sparen = (svg) => svg.replace(/ (stroke-linejoin|stroke-linecap)="round"/g, "").replace(/ data-teil="[^"]*"/g, "").replace(/ class="mensch"/g, "")
  .replace(/<(linearGradient|radialGradient) id="([^"]+)"([^>]*)>((?:<stop[^>]*>)+)<\/\1>/g, (all, tag, id, at, st) => {
    const key = tag + at.replace(/="[^"]*"/g, "") + st;
    if (VERLAUF[key]) return `<${tag} id="${id}"${at} href="#${VERLAUF[key]}"/>`;
    VERLAUF[key] = id; return all; });
const kompakt = (svg, Q = 1, min = 0.35, kopf = null) => {
  svg = schlank(svg, min);
  const rund = (n) => { const v = Math.round(+n / Q) * Q; return String(v === 0 ? 0 : r(v)); };
  /* kleine Formen (Gesicht, Hände, Augen) fein runden, große grob — keine Mosaik-Gesichter */
  const fein = (n) => { const v = Math.round(+n / 0.4) * 0.4; return String(v === 0 ? 0 : r(v)); };
  /* Alles am Kopf (Haar, Mütze, Pony, Zopf, Ohr) fein runden – sonst Treppen im Haar */
  const ausdehnung = (p) => { const z = (p.match(/-?\d*\.?\d+/g) || []).map(Number), a = [Infinity, Infinity], b = [-Infinity, -Infinity];
    z.forEach((v, i) => { a[i % 2] = Math.min(a[i % 2], v); b[i % 2] = Math.max(b[i % 2], v); });
    if (kopf && Math.abs((a[0] + b[0]) / 2 - kopf.x) < 18 && (a[1] + b[1]) / 2 > kopf.y - 24 && (a[1] + b[1]) / 2 < kopf.y + 16 && b[1] - a[1] < 50) return 0;
    return Math.max(b[0] - a[0], b[1] - a[1]); };
  /* Umrisse in clipPath (Haar-/Gesichtsgrenzen) und relative Pfade immer fein, sonst verrutschen Kanten */
  const tagRunden = (tag, immerFein) => tag
    .replace(/ d="([^"]+)"/g, (a, p) => ` d="${p.replace(/-?\d*\.?\d+/g, immerFein || /[a-df-z]/.test(p) || ausdehnung(p) < KLEIN ? fein : rund)}"`)
    .replace(/ (x|y|x1|y1|x2|y2|cx|cy)="(-?\d*\.?\d+)"/g, (a, k, n) => ` ${k}="${(immerFein || /^<(ellipse|circle)/.test(tag) ? fein : rund)(n)}"`);
  const TAG = /<(path|ellipse|circle|rect|line|polygon)\b[^>]*>/g, clips = [];
  svg = svg.replace(/<clipPath\b[\s\S]*?<\/clipPath>/g, (blk) => { clips.push(blk.replace(TAG, (t) => tagRunden(t, true))); return `\u0001${clips.length - 1}\u0001`; });
  return svg.replace(TAG, (t) => tagRunden(t, false)).replace(/\u0001(\d+)\u0001/g, (a, i) => clips[+i]);
};
const FIG = {};
const mensch = (name, spec, groesse, D, X, Q = 1, min = 0.35) => {
  const m = B.mensch(spec, 100);
  S.def(`<g id="${S.id("fig" + name)}" stroke-linejoin="round" stroke-linecap="round">${sparen(kompakt(m.svg, Q, min, m.z.kopf))}</g>`);
  const f = { m, D, X, x: r(xG(D, X)), y: r(yG(D)), u: sk(D), s: groesse * sk(D) / 100 };
  f.p = (q) => ({ x: f.x + q.x * m.k * f.s, y: f.y + q.y * m.k * f.s });
  f.svg = `<use href="#${S.id("fig" + name)}" transform="scale(${f.s.toFixed(5)})"/>`;
  FIG[name] = f;
  return f;
};

S.def(`<filter color-interpolation-filters="sRGB" id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter color-interpolation-filters="sRGB" id="${S.id("schw")}" x="-30%" y="-80%" width="160%" height="260%"><feGaussianBlur stdDeviation=".6"/></filter>`);
S.def(`<filter color-interpolation-filters="sRGB" id="${S.id("rauch")}" x="-50%" y="-50%" width="200%" height="200%"><feTurbulence type="fractalNoise" baseFrequency=".18" numOctaves="2" seed="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G" result="d"/><feGaussianBlur in="d" stdDeviation="1.3"/></filter>`);
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
    return `<g filter="url(#${S.id("wolke")})">${lage(0.5, 0.8, 0.97, "#c4c8d4", 0.85)}${lage(-0.3, -0.6, 0.94, "#eef0f5")}${lage(-1.4, -2.4, 0.74, "#fff8ec")}</g>`;
  };
  S.hinten(wolke(60, 34, 62, 18, 5) + wolke(334, 26, 54, 15, 9) + wolke(236, 52, 22, 5, 12) + wolke(150, 62, 14, 3, 14));
  S.hinten(`<g filter="url(#${S.id("schleier")})" opacity=".55"><path d="M120 10 Q210 4 320 9 Q220 11 120 13 Z M230 20 Q300 16 390 19 Q310 22 230 22 Z" fill="#f6f2ec"/></g>`);
}
S.hinten(`<rect x="0" y="${HOR - 60}" width="400" height="62" fill="${S.lg("dunst", [[0, "#efe6d6", 0], [1, "#efe6d6", 0.55]])}"/>`);
S.hinten(`<rect x="0" y="${HOR}" width="400" height="${260 - HOR}" fill="#a49b8f"/>`);
/* Kronen-Werkzeug (wie Potsdam): 3–4 Laubmassen als gezackte Pfade; dunkle Unterseite, Mittelton und helle Kappe
   links oben per <use> in die Masse geschnitten; Himmelslöcher mit Ästen. */
let bz = 0;
const lappenPfad = (cx, cy, rx, ry, z) => {
  const n = 15 + Math.round(z() * 6), P = [];
  for (let k = 0; k < n; k++) { const t = (k + z() * 0.4) / n * Math.PI * 2, f = 1 - z() * 0.07; P.push([t, f]); }
  const pt = ([t, f], g = 1) => `${r(cx + Math.cos(t) * rx * f * g)} ${r(cy + Math.sin(t) * ry * f * g)}`;
  let d = `M${pt(P[0])}`;
  for (let k = 0; k < n; k++) {
    const a = P[k], b = P[(k + 1) % n], tm = a[0] + (((b[0] - a[0]) + Math.PI * 2) % (Math.PI * 2)) / 2;
    const amp = z() < 0.2 ? 0.34 : 0.16 + z() * 0.12;
    d += ` Q${pt([tm, (a[1] + b[1]) / 2], 1 + amp)} ${pt(b)}`;
  }
  return d + " Z";
};
const krone = (cx, cy, w, h, seed, T, loecher = 3) => {
  const z = zufall(seed), id = S.id("kr" + bz++);
  const grad = (name, a, b) => S.lg(name + id, [[0, a], [1, b]], cx, cy - h / 2, cx, cy + h / 2, ' gradientUnits="userSpaceOnUse"');
  const GD = grad("d", T[0], T[1]), GM = grad("m", T[2], T[3]), GL = grad("l", T[4], T[5]);
  /* Massen leicht verschoben je Baum (kein Spiegelbild); ungerader Seed: eine Masse mehr, Krone flacher */
  const j = () => (z() - 0.5);
  const massen = [[cx - w * (0.2 + j() * 0.08), cy - h * (0.2 + j() * 0.06), w * 0.27, h * 0.25], [cx + w * (0.17 + j() * 0.08), cy - h * (0.22 + j() * 0.06), w * 0.26, h * 0.24], [cx + w * j() * 0.1, cy - h * 0.36, w * 0.2, h * 0.16], [cx, cy + h * 0.1, w * 0.44, h * 0.34]];
  if (seed % 2) massen.splice(2, 0, [cx + w * 0.3, cy - h * 0.02, w * 0.17, h * 0.2]);
  let g = "";
  massen.forEach(([mx, my, rx, ry], i) => {
    const mid = `${id}_${i}`;
    S.def(`<path id="${mid}" d="${lappenPfad(mx, my, rx, ry, z)}"/><clipPath id="${mid}c"><use href="#${mid}"/></clipPath>`);
    const um = (dx, dy, f) => `transform="translate(${r(mx + dx)} ${r(my + dy)}) scale(${f}) translate(${r(-mx)} ${r(-my)})"`;
    /* Lichtkappe als Halbmond an der Oberkante: helle Masse, darüber nach rechts unten versetzt Zwischen- und Mittelton,
       unten die dunkle Unterseite – gleiche gelappte Kante, weicher Übergang */
    g += `<use href="#${mid}" fill="${GL}"/><g clip-path="url(#${mid}c)"><use href="#${mid}" fill="${GM}" opacity=".55" ${um(rx * 0.06, ry * 0.12, 1)}/><use href="#${mid}" fill="${GM}" ${um(rx * 0.1, ry * 0.24, 0.98)}/><use href="#${mid}" fill="${GD}" ${um(rx * 0.05, ry * 0.86, 1)}/></g>`;
  });
  /* Himmelslöcher: unregelmäßig, 12–20 px groß, mit Ast aus dem dunklen Inneren */
  for (let i = 0; i < loecher; i++) {
    const a = -Math.PI * (0.15 + (i + z() * 0.6) / Math.max(1, loecher) * 0.7), d = 0.3 + z() * 0.06, hx = cx + Math.cos(a) * w * d, hy = cy + Math.sin(a) * h * d * 0.75, s = Math.min(w, h) * 0.05 + 1.2;
    let p = ""; for (let k = 0; k < 6; k++) { const t = k / 6 * Math.PI * 2, f = 0.6 + z() * 0.5; p += (k ? "L" : "M") + `${r(hx + Math.cos(t) * s * f)} ${r(hy + Math.sin(t) * s * f * 0.75)}`; }
    g += `<path d="${p}Z" fill="#9fbcdc" stroke="#9fbcdc" stroke-width=".4" stroke-linejoin="round"/><path d="M${r(hx - s * 0.5)} ${r(hy + s * 1.6)} L${r(hx + s * 0.1)} ${r(hy + s * 0.1)} M${r(hx - s * 0.1)} ${r(hy + s * 0.6)} L${r(hx - s * 0.7)} ${r(hy - s * 0.2)}" stroke="#3a2e22" stroke-width="${r(0.2 + s * 0.1)}" fill="none" stroke-linecap="round"/>`;
  }
  return g;
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
    g += `<rect x="${r(x0)}" y="${r(yt)}" width="${r(x1 - x0)}" height="${r(y0 - yt)}" fill="${S.lg("hauslicht", [[0, "#fff4dc", 0.26], [1, "#2e2a40", 0.2]], 0, 0, 1, 0)}"/>`;
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
  k += `<rect x="${-M - 0.2}" y="-5.9" width="${2 * M + 0.4}" height=".75" fill="#f8f1e2"/><rect x="${-M - 0.2}" y="-5.15" width="${2 * M + 0.4}" height=".5" fill="#3e3868" opacity=".34"/>`;
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
  k += `<rect x="${-M - 0.5}" y="-17.4" width="${2 * M + 1}" height=".55" fill="#fbf4e6"/><rect x="${-M - 0.3}" y="-16.85" width="${2 * M + 0.6}" height=".45" fill="#3e3868" opacity=".34"/>`;
  k += `<rect x="${-M}" y="-19" width="${2 * M}" height="1.6" fill="${S.lg("attika", [[0, "#f6ebd6"], [1, "#d9ccb0"]])}"/>`;
  k += `<rect x="${-M - 0.2}" y="-19.25" width="${2 * M + 0.4}" height=".3" fill="#fbf4e6"/>`;
  k += `<path d="M${-M + 0.3} -19.25 L${-M + 1.6} -19.9 L${M - 1.6} -19.9 L${M - 0.3} -19.25 Z" fill="${DACH}"/>`;
  /* Morgensonne: warm von links, rechte Seite kühler */
  k += `<rect x="${-W}" y="-14.4" width="${2 * W}" height="14.6" fill="${S.lg("thwarm", [[0, "#ffcf8a", 0.22], [0.45, "#ffcf8a", 0.05], [1, "#4a4a90", 0.16]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${-M}" y="-14.4" width="${2 * M}" height="14.6" fill="${S.lg("thwarm3", [[0, "#ffcf8a", 0.1], [1, "#4a4a90", 0.1]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${-M}" y="-19" width="${2 * M}" height="4.6" fill="${S.lg("thwarm2", [[0, "#ffcf8a", 0.2], [1, "#4a4a90", 0.14]], 0, 0, 1, 0)}"/>`;
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
}
S.teile[S.teile.length - 1].unter = theaterUnter;

/* =====================================================================
   3 — DIE BÄUME (Linden am Platz: ovale, dichte Kronen, Herbstgelb)
   ===================================================================== */
{
  const STAMM = S.lg("stamm", [[0, "#8a7458"], [0.5, "#5b4836"], [1, "#2f261d"]], 0, 0, 1, 0);
  const T1 = ["#7a6a24", "#3e4a1c", "#c9a032", "#7d8a32", "#e2c056", "#b8b04a"];
  const T2 = ["#6e6a26", "#3a461c", "#d0a83a", "#869036", "#e6c862", "#c0b854"];
  const baeume = (liste) => { let k = ""; for (const [D, X, w, T, sd] of liste) {
    const x = xG(D, X), y0 = yG(D), y1 = yG(D, 9), bw = w * sk(D), u = sk(D);
    k += `<path d="M${r(x - bw)} ${r(y0)} Q${r(x - bw * 0.5)} ${r((y0 + y1) / 2)} ${r(x - bw * 0.4)} ${r(y1)} L${r(x + bw * 0.4)} ${r(y1)} Q${r(x + bw * 0.5)} ${r((y0 + y1) / 2)} ${r(x + bw)} ${r(y0)} Z" fill="${STAMM}"/>`;
    k += `<path d="M${r(x)} ${r(yG(D, 6))} q${r(1.1 * u)} ${r(-0.7 * u)} ${r(1.8 * u)} ${r(-2.4 * u)} M${r(x)} ${r(yG(D, 6.6))} q${r(-1 * u)} ${r(-0.6 * u)} ${r(-1.6 * u)} ${r(-2.2 * u)}" stroke="#4a3b2c" stroke-width="${r(0.2 * u)}" fill="none" stroke-linecap="round"/>`;
    bodenSchatten(D, X, 1, 10, 0.16);
    k += krone(r(x), r(yG(D, 10.5)), r(6.4 * u), r(9.2 * u), sd, T, 3);
  } return k; };
  S.teil({ id: "baum", de: "der Baum", syl: "BAUM", it: "l'albero", itSyl: "AL-be-ro", en: "tree", x: 0, y: 0, kunst: baeume([[34, -20.8, 0.5, T1, 31], [28, -18.0, 0.55, T2, 32]]),
    tipp: "Bäume geben im Sommer Schatten. Im Herbst fallen die Blätter." });
  S.teil({ id: "linde", de: "die Linde", syl: "LIN-de", it: "il tiglio", itSyl: "TI-glio", en: "lime tree", x: 0, y: 0, kunst: baeume([[33, 20.4, 0.5, T2, 33], [27, 17.6, 0.55, T1, 34]]),
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
  bodenSchatten(DD, 0, 4.6, 6.9, 0.42);
  let k = "";
  /* Granitsockel in Metern: zwei Stufen, Fußgesims, Würfel mit Inschrift, Kopfgesims */
  S.def(`<pattern id="${S.id("granitkorn")}" patternUnits="userSpaceOnUse" width=".5" height=".4"><circle cx=".08" cy=".08" r=".03" fill="#4d4240"/><circle cx=".33" cy=".25" r=".025" fill="#e6d6cc"/><circle cx=".2" cy=".34" r=".02" fill="#6b4c48"/><circle cx=".42" cy=".06" r=".018" fill="#c9b2a8"/></pattern>`);
  const GRANIT = S.lg("granit", [[0, "#b2aaa6"], [0.45, "#9b8f8c"], [1, "#635a58"]], 0, 0, 1, 0);
  let p = `<rect x="-2.3" y="-.32" width="4.6" height=".32" fill="#8e8784"/><rect x="-2.3" y="-.32" width="4.6" height=".06" fill="#cdbfb5"/>`;
  p += `<rect x="-2.0" y="-.64" width="4" height=".32" fill="#9d9592"/><rect x="-2.0" y="-.64" width="4" height=".06" fill="#d2c4ba"/>`;
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
  p += `<path d="M1.52 -1.2 L2.0 -.9 L2.0 -.64 L2.3 -.32 L2.3 0 L1.9 0 L1.52 -.64 Z" fill="#2e2a40" opacity=".4"/>`;
  /* bronzene Plinthe mit Kante */
  p += `<path d="M-1.4 -3.4 L1.4 -3.4 L1.34 -3.58 L-1.34 -3.58 Z" fill="#3a3424"/><rect x="-1.36" y="-3.6" width="2.72" height=".05" fill="#a49464"/>`;
  k += `<g transform="scale(${DU.toFixed(5)})">${p}</g>`;
  /* DIE FIGUREN (100 Einheiten = 3,55 m; Ursprung Mitte der Plinthe).
     Licht von links vorn (Sonne im Südosten): Lichtkanten nur an Kanten, die nach links/oben zeigen;
     Grünpatina in Falten und unter den Armen. Goethe: Standbein links im Bild, Spielbein rechts mit
     gebeugtem Knie; Schiller umgekehrt. Beide um etwa 12° zueinander gedreht. */
  const FS = 3.55 * DU / 100, fussY = -3.58 * DU;
  const BRZ = S.lg("brz", [[0, "#92845a"], [0.2, "#655a3a"], [0.6, "#3a3324"], [1, "#1c1912"]], 0, 0, 1, 0);
  const BRZ2 = S.lg("brz2", [[0, "#6e6342"], [0.5, "#3e3727"], [1, "#1c1912"]], 0, 0, 1, 0);
  const BRZL = S.lg("brzl", [[0, "#a89a6a"], [0.4, "#7a6e4a"], [1, "#3a3424"]], 0, 0, 1, 0);
  const HL = "#d8c894", PAT = "#4f6b55", DK = "#14120d";
  const kante = (d, w = 0.5) => `<path d="${d}" stroke="${HL}" stroke-width="${w}" fill="none" stroke-linecap="round" opacity=".8"/>`;
  const falte = (d, w = 0.5) => `<path d="${d}" stroke="${DK}" stroke-width="${w}" fill="none" stroke-linecap="round" opacity=".5"/><path d="${d}" stroke="${PAT}" stroke-width="${r(w * 1.4)}" fill="none" opacity=".35" transform="translate(.4 0)"/>`;
  const F = (d, fill, extra = "") => `<path d="${d}" fill="${fill}"${extra}/>`;
  /* Glied als weiche Form um eine Mittellinie: Lichtkante innen auf der Seite zur Sonne (links oben),
     Kernschatten als Bahn auf der abgewandten Seite. */
  const pt = (p) => `${r(p[0])} ${r(p[1])}`;
  const kurve = (p, s = "M") => { let d = s + pt(p[0]); if (p.length === 2) return d + "L" + pt(p[1]);
    for (let i = 1; i < p.length - 1; i++) { const e = i === p.length - 2 ? p[i + 1] : [(p[i][0] + p[i + 1][0]) / 2, (p[i][1] + p[i + 1][1]) / 2]; d += "Q" + pt(p[i]) + " " + pt(e); }
    return d; };
  const seiten = (c, w) => { const A = [], B2 = []; for (let i = 0; i < c.length; i++) { const a = c[Math.max(0, i - 1)], b = c[Math.min(c.length - 1, i + 1)];
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, n = [-dy / l, dx / l];
    A.push([c[i][0] + n[0] * w[i] / 2, c[i][1] + n[1] * w[i] / 2]); B2.push([c[i][0] - n[0] * w[i] / 2, c[i][1] - n[1] * w[i] / 2]); } return [A, B2]; };
  const glied = (c, w, fill, licht = true) => {
    const [A, B2] = seiten(c, w), m = c.length >> 1, li = A[m][0] + A[m][1] < B2[m][0] + B2[m][1];
    const Lf = li ? A : B2, Rt = li ? B2 : A;
    let g = F(kurve(Lf) + kurve([...Rt].reverse(), "L") + "Z", fill);
    const [A2, B3] = seiten(c, w.map((v) => v * 0.2)), Rm = li ? B3 : A2;
    g += F(kurve(Rt) + kurve([...Rm].reverse(), "L") + "Z", DK, ' opacity=".32"');
    if (licht) { const [A4, B4] = seiten(c, w.map((v) => v * 0.66)); g += kante(kurve(li ? A4 : B4), 0.45); }
    return g;
  };
  /* Falte als Linse: Schatten rechts, Licht links daneben */
  const bahn = (x1, y1, x2, y2, b, w = 1.2) => { const mx = (x1 + x2) / 2 + b, my = r((y1 + y2) / 2);
    return F(`M${x1} ${y1}Q${r(mx + w)} ${my} ${x2} ${y2}Q${r(mx)} ${my} ${x1} ${y1}Z`, DK, ' opacity=".4"') + F(`M${x1} ${y1}Q${r(mx)} ${my} ${x2} ${y2}Q${r(mx - w * 0.8)} ${my} ${x1} ${y1}Z`, HL, ' opacity=".26"'); };
  /* Arm: Schulter, Ellbogen, Handgelenk; Ärmel weich, Beugefalten am Ellbogen, Aufschlag */
  const arm = (pts, w1, w2, aufschlag = true) => {
    const [a, b, c] = pts, mi = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
    let g = glied([a, mi(a, b, 0.5), b, mi(b, c, 0.5), c], [w1, w1 * 0.94, (w1 + w2) * 0.52, w2, w2 * 0.92], BRZ);
    const e1 = mi(b, a, 0.18), e2 = mi(b, c, 0.18);
    g += `<path d="M${pt(e1)}Q${pt(b)} ${pt(e2)}" stroke="${DK}" stroke-width=".55" fill="none" opacity=".5"/>`;
    if (aufschlag) { const q = mi(b, c, 0.78); g += glied([q, c], [w2 * 1.3, w2 * 1.3], BRZL, false); }
    return g;
  };
  const hand = (x, y, rot, s2 = 1) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s2})"><path d="M-2 -1.2 Q0 -2 2 -1.1 Q2.7 .3 2.2 1.3 Q.4 2.4 -1.8 1.5 Q-2.4 .2 -2 -1.2 Z" fill="${BRZL}"/><path d="M-2 -.6 Q-3.3 -.4 -3.2 .9 Q-2.4 1 -1.9 .5" fill="${BRZ}"/><path d="M-1.1 1.6 L-.9 .3 M0 1.9 L.1 .4 M1.1 1.7 L1.1 .4" stroke="${DK}" stroke-width=".28" opacity=".55"/><path d="M-1.8 -1.1 Q0 -1.9 1.8 -1" stroke="${HL}" stroke-width=".35" fill="none" opacity=".7"/></g>`;
  /* Bronzegesicht nur aus Licht und Schatten: Stirn und Nasenrücken hell (Licht von links), Augenhöhlen weich,
     Schatten unter Nase und Kinn – keine Augenschlitze, kein Strichmund. nx: Drehung der Nase, adler: Nasenhöcker */
  const kopfB = (cx, cy, nx, adler, alt) => { const P2 = (x, y) => `${r(cx + x)} ${r(cy + y)}`;
    return `<ellipse cx="${cx}" cy="${cy}" rx="4.5" ry="5.9" fill="${BRZ}"/>` +
      `<ellipse cx="${r(cx - 1.3)}" cy="${r(cy - 3)}" rx="2.6" ry="1.6" fill="${HL}" opacity=".42"/><ellipse cx="${r(cx - 2.5)}" cy="${r(cy + 1)}" rx="1.1" ry="1.7" fill="${HL}" opacity=".22"/>` +
      `<ellipse cx="${r(cx - 1.9 + nx)}" cy="${r(cy - 0.5)}" rx="1.2" ry=".7" fill="${DK}" opacity=".22"/><ellipse cx="${r(cx + 1.9 + nx)}" cy="${r(cy - 0.5)}" rx="1.2" ry=".7" fill="${DK}" opacity=".32"/>` +
      `<path d="M${P2(-3.2 + nx, -1.6)}Q${P2(-1.9 + nx, -2.5)} ${P2(-0.6 + nx, -1.7)}" stroke="${HL}" stroke-width=".5" fill="none" opacity=".6"/>` +
      `<path d="M${P2(nx + 0.1, -1.3)}Q${P2(nx + 1.4 + adler, 0.9)} ${P2(nx + 0.6, 2.3)}L${P2(nx - 0.5, 2.4)}Z" fill="${DK}" opacity=".45"/>` +
      `<path d="M${P2(nx - 0.3, -1.6)}Q${P2(nx + adler * 0.8, 0.2)} ${P2(nx - 0.6, 2)}" stroke="${HL}" stroke-width=".55" fill="none" opacity=".75"/>` +
      `<ellipse cx="${r(cx + nx * 0.6)}" cy="${r(cy + 2.9)}" rx=".9" ry=".3" fill="${DK}" opacity=".35"/>` +
      `<path d="M${P2(nx * 0.6 - 1.2, 3.7)}Q${P2(nx * 0.6, 4)} ${P2(nx * 0.6 + 1.2, 3.6)}" stroke="${DK}" stroke-width=".45" fill="none" opacity=".4"/><ellipse cx="${r(cx + nx * 0.6 - 0.2)}" cy="${r(cy + 4.4)}" rx=".8" ry=".25" fill="${HL}" opacity=".35"/>` +
      `<ellipse cx="${r(cx + nx * 0.5)}" cy="${r(cy + 5)}" rx="1.4" ry=".8" fill="${HL}" opacity=".22"/><ellipse cx="${r(cx + 2.8)}" cy="${r(cy + 1.3)}" rx="1.6" ry="2.6" fill="${DK}" opacity=".26"/>` +
      (alt ? `<path d="M${P2(-2.2, 5.6)}Q${P2(0, 6.8)} ${P2(2.4, 5.5)}" stroke="${DK}" stroke-width=".45" fill="none" opacity=".45"/>` : "");
  };
  const patina = (d, op = 0.5) => `<path d="${d}" fill="${PAT}" opacity="${op}"/>`;
  const GO = -11.5, SC = 11.5, KX = -4, KY = -57, KR = 5.4;
  let fig = "";
  /* ================= GOETHE (links): Hofrock tailliert mit Schößen, lange Weste, Kniehose mit Bund und Schnalle,
     Strümpfe mit Wade, Schnallenschuhe. Standbein links im Bild (Hüfte höher), Spielbein rechts nach außen gestellt ================= */
  {
    let g = "";
    /* Rockschöße hinter den Beinen (setzen an der Taille an) */
    g += F("M-9.4 -58.5 Q-12.8 -46 -13.8 -31 Q-11.4 -29.6 -8.6 -30.8 Q-7.8 -44 -6.8 -54 Z", BRZ2) + F("M9.2 -58.5 Q12.6 -46 13.6 -31 Q11.2 -29.6 8.4 -30.8 Q7.6 -44 6.6 -54 Z", BRZ2);
    /* Strümpfe mit Wade; Spielbein (rechts) mit gebeugtem Knie schräg nach außen */
    g += F("M-6.6 -27 Q-7.8 -19 -6.3 -12 Q-5.4 -7.6 -5.2 -4.6 L-2.6 -4.6 Q-2.4 -8 -1.8 -12 Q-.8 -19 -1.4 -27 Z", BRZL);
    g += F("M2.8 -27 L7.6 -27.6 Q9 -20 8.7 -13 Q8.6 -8.6 8.9 -5.2 L6.6 -5.2 Q6 -8.4 5.1 -12 Q2.3 -19 2.8 -27 Z", BRZL);
    g += F("M-2.6 -24 Q-1.4 -18 -2.2 -11 Q-2.6 -7 -2.6 -4.8 L-3.6 -4.8 Q-3.4 -9 -3 -12 Q-2.3 -18 -2.6 -24 Z", DK, ' opacity=".35"') + F("M7.4 -25 Q8.4 -19 7.8 -12 Q7.6 -8 7.9 -5.4 L7 -5.4 Q6.8 -9 6.8 -12 Q7.4 -19 7.4 -25 Z", DK, ' opacity=".35"');
    g += kante("M-6.9 -24 Q-7.6 -18 -6.2 -12 Q-5.6 -8 -5.3 -5", 0.45) + kante("M3 -25 Q3.2 -19 5.2 -12.4", 0.45);
    /* Schnallenschuhe: links nach vorn, rechts nach außen gedreht */
    g += F("M-6.4 0 Q-6.9 -2.9 -5.3 -4.9 L-2.4 -4.9 Q-.9 -3 -.8 0 Z", BRZ2) + F("M6.4 -5.4 L9.1 -5.4 Q10.8 -3 11 0 L5.8 0 Q5.2 -2.8 6.4 -5.4 Z", BRZ2);
    g += `<rect x="-4.6" y="-4.1" width="1.9" height=".9" fill="${HL}"/><rect x="7" y="-4.4" width="1.9" height=".9" fill="${HL}"/>`;
    /* Kniehose: Bund unter dem Knie, Spielbein-Knie tiefer und nach außen */
    g += F("M-7.4 -58 L7.6 -58 Q8.4 -42 7.9 -28 L2.6 -27.2 Q1.6 -37 .3 -44 Q-.7 -37 -1.2 -27.4 L-6.8 -27.4 Q-7.8 -42 -7.4 -58 Z", BRZ);
    g += F("M-6.9 -28.4 L-1.2 -28.4 L-1.3 -26.6 L-6.8 -26.6 Z M2.6 -28 L7.9 -28.7 L8 -26.9 L2.7 -26.3 Z", BRZ2);
    g += `<rect x="-2.6" y="-28.2" width="1" height="1.4" fill="${HL}" opacity=".85"/><rect x="6.4" y="-28.6" width="1" height="1.4" fill="${HL}" opacity=".85"/>`;
    g += bahn(.2, -44, .6, -28, .3, .8) + bahn(1.4, -40, 5.4, -30.4, -.8, 1) + bahn(-5.8, -52, -5.4, -32, .6, .9) + F("M5.6 -50 Q7.4 -40 7.4 -29 L6.2 -28.6 Q6.4 -40 5 -50 Z", DK, ' opacity=".35"');
    g += kante("M-7.3 -55 Q-7.8 -42 -7 -29", 0.45) + `<ellipse cx="4.6" cy="-30.6" rx="1.6" ry="1.2" fill="${HL}" opacity=".3"/>`;
    /* lange Weste; Saum kippt mit der Hüfte (links höher) */
    g += F("M-6.2 -82 L6.2 -82 L6.9 -53.6 L4 -48.6 L0 -50.2 L-4 -49.6 L-6.8 -54.8 Z", BRZ2);
    for (let y = -79; y > -53; y -= 3.2) g += `<circle cx=".1" cy="${y}" r=".5" fill="${HL}" opacity=".7"/>`;
    g += `<path d="M-5.6 -61.6 h3.4 M2 -60.8 h3.4" stroke="${HL}" stroke-width=".5" opacity=".55"/>` + F("M3.6 -80 L6.2 -80 L6.8 -54 L4.6 -50 Z", DK, ' opacity=".3"');
    /* Hofrock: Schultern, Taille, vorn zurückgeschnittene Kanten bis in die Schöße – eine geschlossene Form */
    const HR = "M-3 -86.4 Q-8 -86.6 -10.8 -84.4 Q-12.6 -82.6 -12.3 -78 L-11 -66 Q-10.2 -61 -9.4 -58.5 Q-12.8 -46 -13.8 -31 Q-11.4 -29.6 -8.6 -30.8 Q-7.6 -44 -6.6 -54 Q-5.2 -64 -4.4 -76 L-2.2 -82.4 L2.2 -82.4 L4.2 -76 Q5 -64 6.4 -54 Q7.4 -44 8.4 -30.8 Q11.2 -29.6 13.6 -31 Q12.6 -46 9.2 -58.5 Q9.8 -61 10.8 -66 L12.1 -78 Q12.3 -82.6 10.6 -84.4 Q7.8 -86.6 3 -86.4 Q0 -88 -3 -86.4 Z";
    g += F(HR, BRZ);
    g += F("M6.2 -82 Q10.8 -82 11.4 -76 L10.2 -64 Q9 -60 8.4 -58 Q11 -46 12.4 -31.2 L13.6 -31 Q12.6 -46 9.2 -58.5 Q9.8 -61 10.8 -66 L12.1 -78 Q12.3 -82.6 10.6 -84.4 Z", DK, ' opacity=".38"');
    g += bahn(-10.6, -56, -12.6, -32, -.5, 1.1) + bahn(10, -56, 11.8, -32, .5, 1.1) + bahn(-7.6, -50, -8.8, -31.6, -.3, .8);
    g += patina("M-9.8 -58 Q-11.4 -46 -12 -33 L-10.8 -33 Q-10.6 -46 -9 -57 Z") + patina("M8.8 -57 Q10.6 -46 11.4 -33 L12.4 -33 Q11.4 -46 9.6 -58 Z", 0.45);
    g += kante("M-10.6 -83.4 Q-11.9 -78 -11.2 -70 Q-10.4 -63 -9.6 -59.2 Q-12.4 -46 -13.4 -32", 0.6) + kante("M-4.2 -76 Q-5 -64 -6.4 -54 Q-7.4 -44 -8.2 -31.4", 0.35);
    /* Stehkragen, Halsbinde mit Jabot, Ordensstern */
    g += F("M-4.6 -86.4 Q0 -89.6 4.4 -86.4 L3.8 -84 Q0 -86 -4 -84 Z", "#6e6342") + F("M-2 -86 Q0 -84.4 2 -86 L1.5 -79.6 Q0 -78.4 -1.5 -79.6 Z", BRZL);
    g += patina("M-4.4 -84.6 Q0 -86.6 4 -84.6 L3.6 -83.6 Q0 -85.2 -3.8 -83.6 Z", 0.55);
    g += `<path d="M7 -74.6 L7.5 -73.1 L9 -72.6 L7.5 -72.1 L7 -70.6 L6.5 -72.1 L5 -72.6 L6.5 -73.1 Z" fill="#e2d39c"/>`;
    /* Kopf: Blick geradeaus, Haar zurückgekämmt mit Rollen über den Ohren, Doppelkinn */
    g += F("M-2.3 -90.6 L2.3 -90.6 L2.5 -85.8 L-2.5 -85.8 Z", "#4a4230") + patina("M.6 -90 L2.3 -90 L2.5 -86 L.8 -86 Z", 0.45);
    g += kopfB(0.2, -93.8, 0.1, 0, true);
    g += F("M-4.9 -94.8 Q-5.4 -100.9 .2 -100.9 Q5.6 -100.9 5.1 -94.8 Q4.3 -98.2 .2 -98.6 Q-4 -98.2 -4.9 -94.8 Z", BRZ2) + `<path d="M-4 -97.4 Q-1.6 -100.2 2.4 -99.8" stroke="${HL}" stroke-width=".45" fill="none" opacity=".75"/>`;
    g += F("M-4.7 -96.4 Q-5.6 -95 -5.1 -93.2 Q-4.6 -92.6 -4.1 -93.4 Q-4.6 -95 -4.1 -96.4 Z M4.9 -96.4 Q5.8 -95 5.3 -93.2 Q4.8 -92.6 4.3 -93.4 Q4.8 -95 4.3 -96.4 Z", BRZ2) + kante("M-5.1 -95.6 Q-5.3 -94.4 -4.9 -93.6", 0.3);
    fig += `<g transform="translate(${GO} 0)">${g}</g>`;
  }
  /* Goethes linker Arm liegt zwischen beiden Figuren auf Schillers Schulter */
  fig += `<g transform="translate(${GO} 0)">${arm([[10.2, -82.6], [13.4, -76.4], [14.6, -81.4]], 5.4, 4.6, false)}</g>`;
  /* ================= SCHILLER (rechts): langer offener Rock bis unter das Knie, Weste, offener Hemdkragen,
     Hose und Stiefel. Standbein rechts im Bild, Spielbein links nach außen; Kopf gehoben ================= */
  {
    let g = "";
    /* Stiefel unter dem Rocksaum: Standbein senkrecht, Spielbein schräg nach außen mit gebeugtem Knie */
    g += F("M1.4 -23 L6.2 -23 Q6.7 -13 5.9 -5.2 L6.5 -1.2 Q6.7 0 5.6 0 L1.1 0 Q.5 -.6 1.3 -2.4 L1.9 -5.2 Q1.1 -13 1.4 -23 Z", BRZ2);
    g += F("M-6.6 -22.4 L-1.9 -22.4 Q-2.8 -13 -5.4 -6 L-5 -2 Q-5 0 -6.4 0 L-12 0 Q-12.4 -1.4 -10.2 -2.6 L-9.4 -6 Q-8.6 -14 -6.6 -22.4 Z", BRZ2);
    g += F("M4.8 -22 Q5.6 -13 4.9 -5.4 L5.9 -5.2 Q6.7 -13 6.2 -22 Z", DK, ' opacity=".4"') + F("M-3.2 -21.6 Q-4.4 -13 -6.4 -6.2 L-5.4 -6 Q-2.8 -13 -1.9 -22 Z", DK, ' opacity=".4"');
    g += kante("M1.7 -21 Q1.4 -13 2.2 -5.6", 0.45) + kante("M-6.4 -21 Q-8.2 -14 -9.1 -6.4", 0.45) + `<path d="M1.6 -12.6 L6.3 -12.6 M-8.4 -13 L-3.4 -12.4" stroke="${HL}" stroke-width=".55" opacity=".6"/>`;
    /* Hose zwischen den offenen Rockflügeln */
    g += F("M-6.4 -58 L6.4 -58 L7 -22.8 L-6.8 -21.6 Z", BRZL) + `<path d="M.2 -48 Q-.2 -34 -1 -22" stroke="${DK}" stroke-width=".9" fill="none" opacity=".6"/>` + F("M2.2 -50 L5.4 -50 L5.8 -22.6 L3 -22.6 Z", DK, ' opacity=".3"');
    g += bahn(-1.6, -40, -4.4, -28, .5, .8) + kante("M-5 -54 Q-5.4 -38 -5.2 -23", 0.4);
    /* Weste mit Knöpfen, offener Hemdkragen (Bronze, nicht hell) */
    g += F("M-5.6 -82 L5.6 -82 L5.4 -56.6 Q2.6 -54.4 0 -55.6 Q-2.6 -55 -5.6 -57.6 Z", BRZ2);
    for (let y = -78; y > -57; y -= 3.6) g += `<circle cx=".2" cy="${y}" r=".5" fill="${HL}" opacity=".7"/>`;
    g += F("M3.4 -80 L5.6 -80 L5.4 -57 L3.4 -55.4 Z", DK, ' opacity=".3"');
    g += F("M-3.2 -87.2 L0 -81.6 L-1 -86.4 Z", BRZL) + F("M3.2 -87.2 L0 -81.6 L1 -86.4 Z", "#5a5238") + patina("M-.9 -86.2 L0 -82.2 L.9 -86.2 Z", 0.55);
    /* der lange Rock als geschlossene Form: Schultern, Revers, Taille, ausgestellter Saum bis unter das Knie (Saum kippt) */
    const RK = "M-3.2 -86.8 Q-8.2 -86.8 -10.8 -84.4 Q-12.6 -82.4 -12.2 -78 L-11 -66 Q-10.2 -60.6 -10 -57.4 Q-13.2 -40 -14.8 -21 Q-10.4 -20 -6.4 -20.8 L-3.4 -40 Q-2.6 -50 -3.4 -58 L-6 -73.6 L-2.2 -82 L2.2 -82 L6 -73.6 L3.4 -58 Q2.8 -50 3.6 -40 L6.6 -23.4 Q10.4 -22.8 14.4 -23.6 Q12.8 -40 9.8 -57.4 Q10.2 -60.6 10.8 -66 L12.1 -78 Q12.4 -82.4 10.6 -84.4 Q8 -86.8 3.2 -86.8 Q0 -88.6 -3.2 -86.8 Z";
    g += F(RK, BRZ);
    g += F("M6.4 -82 Q11 -82 11.4 -76 L10.2 -64 Q9.6 -60 9.2 -57.6 Q11.8 -40 13 -23.4 L14.4 -23.6 Q12.8 -40 9.8 -57.4 Q10.2 -60.6 10.8 -66 L12.1 -78 Q12.4 -82.4 10.6 -84.4 Z", DK, ' opacity=".38"');
    /* Revers: links im Licht, rechts im Schatten */
    g += F("M-2.2 -82 L-6 -73.6 L-4.4 -66 L-5.6 -76 L-2.8 -84 Z", BRZL) + F("M2.2 -82 L6 -73.6 L4.4 -66 L5.6 -76 L2.8 -84 Z", "#2e2a1e");
    g += bahn(-11.4, -54, -13.6, -22, -.6, 1.2) + bahn(-7.4, -48, -8.8, -21.4, -.3, 1) + bahn(10.6, -54, 12.6, -24, .6, 1.2) + bahn(7, -46, 8, -23.4, .3, .9);
    g += patina("M-10.6 -57 Q-12.6 -40 -13.6 -23 L-12.4 -23 Q-11.6 -40 -9.8 -56 Z") + patina("M9.4 -56 Q11.4 -40 12 -24 L13.2 -24 Q12.2 -40 10.2 -57 Z", 0.45) + patina("M-10.4 -80 Q-11.4 -74 -10.8 -68 L-9.6 -68 Q-10 -74 -9.4 -80 Z", 0.45);
    g += kante("M-10.6 -83.4 Q-11.9 -78 -11.2 -70 Q-10.4 -63 -10 -58.4 Q-13 -40 -14.4 -22", 0.6) + kante("M-4.2 -66 L-3.4 -58 Q-2.8 -50 -3.6 -40 L-6.4 -21.4", 0.6);
    /* Vorderkanten der Rockflügel: der rechte wirft einen Schatten auf die Hose */
    g += `<path d="M3.4 -58 Q2.8 -50 3.6 -40 L6.6 -23.4" stroke="${DK}" stroke-width="1.4" fill="none" opacity=".55" transform="translate(-.7 0)"/>`;
    /* linker Arm (rechts im Bild) hängt mit der Schriftrolle am Oberschenkel */
    g += arm([[10.6, -82], [13.4, -66], [12.4, -53.4]], 5.8, 4.4);
    g += `<rect x="11.2" y="-54" width="2.8" height="16" rx="1.2" fill="${BRZL}" transform="rotate(-6 12.6 -46)"/><path d="M11.6 -53 L10.2 -38.4" stroke="${HL}" stroke-width=".5" opacity=".7"/><ellipse cx="12.4" cy="-54" rx="1.4" ry=".8" fill="${HL}" opacity=".6"/>`;
    g += hand(12.6, -51.6, 84, 0.95);
    /* Kopf um 10° gehoben, Blick nach rechts oben: lange Nase mit Höcker als Profilkante, Haar aus der Stirn nach hinten bis in den Nacken */
    g += F("M-2.2 -91.6 L2.2 -91.6 L2.5 -86 L-2.5 -86 Z", "#4a4230") + kante("M-2 -91 L-2.3 -86.4", 0.4) + patina("M.6 -91 L2.2 -91 L2.5 -86.4 L.8 -86.4 Z", 0.45);
    const kopf = `<path d="M-4.8 -96 Q-4.6 -101.8 .6 -102 Q5.8 -101.6 5.8 -95.6 Q6.6 -91.6 5.4 -89.4 Q4.6 -90.6 4.2 -92.4 Q4.4 -94.4 3.8 -96.6 Q.6 -99 -3.6 -96.8 Q-4.2 -94 -4.4 -92.4 Q-5.3 -93.6 -4.8 -96 Z" fill="${BRZ2}"/>` +
      kopfB(0.4, -95, 0.8, 0.9, false) +
      `<path d="M-4.4 -96.8 Q-3.6 -101 .6 -101.2 Q4.8 -101 5.4 -97.4 Q2.8 -99.6 .4 -99.4 Q-2.6 -99.2 -4.4 -96.8 Z" fill="${BRZ2}"/>` +
      `<path d="M-3.6 -98.6 Q-5 -97.4 -5 -94.6 M-1.6 -100.2 Q-4.2 -99.6 -4.6 -96.8 M2.6 -100.4 Q5.4 -99.6 5.6 -96" stroke="${HL}" stroke-width=".4" fill="none" opacity=".65"/>`;
    g += `<g transform="rotate(-10 0 -91)">${kopf}</g>`;
    fig += `<g transform="translate(${SC} 0)">${g}</g>`;
  }
  /* Goethes Hand liegt auf Schillers Schulter: Handrücken oben, Finger hängen vorn über */
  fig += `<g transform="translate(${r(GO + 14.4)} -83.4) rotate(8)"><path d="M-2.6 -1 Q0 -2.2 2.8 -1 L3 1.2 Q.2 2 -2.4 1.2 Z" fill="${BRZL}"/>` +
    `<path d="M-1.9 1 L-1.8 3.6 M-.6 1.3 L-.5 4 M.7 1.3 L.8 4 M1.9 1.1 L2 3.4" stroke="${BRZL}" stroke-width="1.1" stroke-linecap="round"/><path d="M-1.3 1.3 L-1.2 3.6 M0 1.4 L.1 3.9 M1.3 1.3 L1.4 3.6" stroke="${DK}" stroke-width=".25" opacity=".55"/>` +
    `<path d="M-2.4 -.9 Q0 -2 2.6 -.9" stroke="${HL}" stroke-width=".4" fill="none" opacity=".75"/></g>`;
  /* Goethes rechter Arm kreuzt vor dem Körper zum Kranz, Schillers rechter Arm greift von rechts dazu */
  fig += `<g transform="translate(${GO} 0)">${arm([[-10.6, -83], [-12.8, -66], [2.4, -57.6]], 5.8, 4.5)}</g>`;
  fig += `<g transform="translate(${SC} 0)">${arm([[-10.6, -82.6], [-13.8, -67], [-10.6, -57]], 5.8, 4.4)}</g>`;
  /* der Lorbeerkranz auf Brusthöhe: spitze Blätter paarweise, zwei Bänder hängen herab */
  let kranz = `<path d="M${KX - 0.8} ${KY + KR - 0.4} Q${KX - 2.4} ${KY + KR + 5} ${KX - 1.8} ${KY + KR + 10} L${KX - 1} ${KY + KR + 9} L${KX - 0.7} ${KY + KR + 10.4} Q${KX - 1.2} ${KY + KR + 5} ${KX + 0.2} ${KY + KR - 0.2} Z" fill="${BRZL}"/>`;
  kranz += `<path d="M${KX + 0.8} ${KY + KR - 0.4} Q${KX + 2.2} ${KY + KR + 4.4} ${KX + 2} ${KY + KR + 9} L${KX + 1.3} ${KY + KR + 8.2} L${KX + 0.9} ${KY + KR + 9.4} Q${KX + 1} ${KY + KR + 4} ${KX - 0.1} ${KY + KR - 0.2} Z" fill="${BRZ}"/>`;
  kranz += `<ellipse cx="${KX}" cy="${KY}" rx="${KR}" ry="${r(KR * 0.92)}" fill="none" stroke="#2a261b" stroke-width=".9"/>`;
  S.def(`<path id="${S.id("blatt")}" d="M0 0 Q1.2 -.75 2.6 0 Q1.2 .75 0 0 Z"/>`);
  for (let i = 0; i < 16; i++) {
    const w = i / 16 * Math.PI * 2, x = KX + Math.cos(w) * KR, y = KY + Math.sin(w) * KR * 0.92, deg = Math.round(w * 57.3 + 90);
    const hell = Math.cos(w + 2.4) > 0;
    for (const sp of [-35, 35]) kranz += `<use href="#${S.id("blatt")}" fill="${hell ? "#a49464" : "#4a4430"}" transform="translate(${r(x)} ${r(y)}) rotate(${deg + sp})"/>`;
  }
  fig += kranz;
  fig += `<g transform="translate(${GO} 0)">${hand(2.4, -57.2, 60, 1)}</g>`;
  fig += `<g transform="translate(${SC} 0)">${hand(-10.6, -56.2, 100, 1)}</g>`;
  /* Schlagschatten der Figuren auf der Plinthe nach rechts */
  fig = `<path d="M-14 0 L14 0 L24 -1.4 L-4 -1.4 Z" fill="#14120d" opacity=".45"/>` + fig;
  k += `<g transform="translate(0 ${r(fussY)}) scale(${FS.toFixed(5)})">${fig}</g>`;
  const Pp = (x, y) => ({ x: x * FS, y: fussY + y * FS });
  const kz = Pp(KX, KY), sr = Pp(SC + 12.6, -44);
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
  let k = stand(ZK.D, ZK.X0, ZK.X1, ZK.T, ZK.h, "#3d6b48", -1, "#f4ecd8", "Zwiebelkuchen · Apfelsaft", 0.2);
  /* Zwiebelkuchen: zwei Bleche schräg auf einem Ständer (gelb, braune Röststellen, in Stücke geschnitten), Apfelsaft in Flaschen und Bechern */
  { const zr = zufall(41);
    for (let i = 0; i < 2; i++) {
      const X = ZK.X0 + 0.3 + i * 1.15, X2 = X + 1.0, Dv = ZK.D + 0.12, Dh = ZK.D + 0.42;
      k += `<path d="M${P(Dv, X - 0.03, 0.95)} L${P(Dv, X2 + 0.03, 0.95)} L${P(Dh, X2 + 0.03, 1.4)} L${P(Dh, X - 0.03, 1.4)} Z" fill="#8a5a20"/>`;
      k += `<path d="M${P(Dv, X, 0.98)} L${P(Dv, X2, 0.98)} L${P(Dh, X2, 1.38)} L${P(Dh, X, 1.38)} Z" fill="${S.lg("kuchen", [[0, "#f0cc6a"], [1, "#d9a446"]])}"/>`;
      let sch = "";
      for (let c = 1; c < 4; c++) { const Xc = X + c * 0.25; sch += `M${P(Dv, Xc, 0.98)} L${P(Dh, Xc, 1.38)} `; }
      sch += `M${P((Dv + Dh) / 2, X, 1.18)} L${P((Dv + Dh) / 2, X2, 1.18)}`;
      k += `<path d="${sch}" stroke="#a8742c" stroke-width=".22"/>`;
      let fl = ""; for (let f = 0; f < 14; f++) { const t = zr(), Xf = X + 0.06 + zr() * 0.88, Df = Dv + t * (Dh - Dv); fl += `<ellipse cx="${r(xG(Df, Xf))}" cy="${r(yG(Df, 0.98 + t * 0.4))}" rx=".45" ry=".28" fill="${f % 3 ? "#9a5a1e" : "#6e3a12"}"/>`; }
      k += fl;
    }
    for (let i = 0; i < 4; i++) {
      const X = ZK.X0 + 2.62 + i * 0.22, x = xG(ZK.D + 0.25, X), y = yG(ZK.D + 0.25, 0.95), u = sk(ZK.D + 0.25);
      k += `<path d="M${r(x - 0.04 * u)} ${r(y)} L${r(x - 0.04 * u)} ${r(y - 0.2 * u)} Q${r(x - 0.04 * u)} ${r(y - 0.25 * u)} ${r(x - 0.015 * u)} ${r(y - 0.27 * u)} L${r(x - 0.015 * u)} ${r(y - 0.31 * u)} L${r(x + 0.015 * u)} ${r(y - 0.31 * u)} L${r(x + 0.015 * u)} ${r(y - 0.27 * u)} Q${r(x + 0.04 * u)} ${r(y - 0.25 * u)} ${r(x + 0.04 * u)} ${r(y - 0.2 * u)} L${r(x + 0.04 * u)} ${r(y)} Z" fill="#d48a26"/>` +
        `<rect x="${r(x - 0.04 * u)}" y="${r(y - 0.15 * u)}" width="${r(0.08 * u)}" height="${r(0.07 * u)}" fill="#f2ead2"/><rect x="${r(x - 0.017 * u)}" y="${r(y - 0.33 * u)}" width="${r(0.034 * u)}" height="${r(0.03 * u)}" fill="#2f5a32"/><path d="M${r(x - 0.025 * u)} ${r(y - 0.02 * u)} V${r(y - 0.19 * u)}" stroke="#ffe0a0" stroke-width=".25" opacity=".7"/>`;
    }
    for (let i = 0; i < 2; i++) { const x = xG(ZK.D + 0.15, ZK.X0 + 2.5 + i * 0.95), y = yG(ZK.D + 0.15, 0.95), u = sk(ZK.D + 0.15); k += `<path d="M${r(x - 0.04 * u)} ${r(y - 0.11 * u)} L${r(x + 0.04 * u)} ${r(y - 0.11 * u)} L${r(x + 0.03 * u)} ${r(y)} L${r(x - 0.03 * u)} ${r(y)} Z" fill="#f4f1ea"/><ellipse cx="${r(x)}" cy="${r(y - 0.11 * u)}" rx="${r(0.04 * u)}" ry="${r(0.012 * u)}" fill="#d48a26"/>`; }
  }
  k += stand(ZW.D, ZW.X0, ZW.X1, ZW.T, ZW.h, "#7a4a24", 1, "#f4ecd8", "Zwiebeln aus Heldrungen", 0.2);
  /* Kiste mit losen Zwiebeln auf der Theke */
  { const kx = xG(ZW.D + 0.3, ZW.X0 + 2.9), ky = yG(ZW.D + 0.3, 0.95), ku = sk(ZW.D + 0.3);
    let g = `<path d="M-.36 0 L.36 0 L.38 -.22 L-.38 -.22 Z" fill="${HOLZ}"/><path d="M-.36 -.11 H.36" stroke="#5e3d20" stroke-width=".015"/><path d="M.22 0 L.36 0 L.38 -.22 L.24 -.22 Z" fill="#2e2a40" opacity=".25"/>`;
    for (const [dx, dy, rt] of [[-.26, -.24, 0], [-.1, -.26, 1], [.06, -.25, 0], [.22, -.24, 0], [-.18, -.32, 0], [-.01, -.34, 1], [.15, -.32, 0], [.06, -.4, 0]]) g += `<use href="#${S.id("knolle")}" fill="url(#${S.id(rt ? "zwrot" : "zwgelb")})" transform="translate(${dx} ${dy}) scale(.15)"/>`;
    k += `<g transform="translate(${r(kx)} ${r(ky)}) scale(${ku.toFixed(4)})">${g}</g>`; }
  /* Preisschild an der Theke */
  const px = xG(ZW.D, ZW.X0 + 0.9), py = yG(ZW.D, 0.62), pu = sk(ZW.D);
  k += `<rect x="${r(px - 0.5 * pu)}" y="${r(py - 0.17 * pu)}" width="${r(1.0 * pu)}" height="${r(0.32 * pu)}" fill="#f4ecd8"/><text x="${r(px)}" y="${r(py + 0.08 * pu)}" font-size="${r(0.2 * pu)}" text-anchor="middle" fill="#2f5a32" font-family="Georgia,serif" font-weight="bold">Zopf 8 €</text>`;
  S.teil({ id: "marktstand", de: "der Marktstand", syl: "MARKT-stand", it: "la bancarella", itSyl: "ban-ca-REL-la", en: "market stall", x: 0, y: 0, kunst: k,
    tipp: "Beim Zwiebelmarkt im Oktober stehen in der ganzen Altstadt Marktstände." });
}
{
  /* DIE VERKÄUFERIN: vorn an der Theke, reicht mit der rechten Hand einen Zopf über die Theke */
  const V = mensch("V", { id: "wmr_verk", geschlecht: "w", blick: 14, frisur: "lang", haarfarbe: "braun", haut: "hell", laecheln: true,
    pose: { lende: 1, brust: -2, nacken: 4, kopf: 2, schulterL: { vor: 10, seit: 12 }, ellbogenL: 70, unterarmL: 40, handL: 4, fingerL: 0.5,
      schulterR: { vor: 55, seit: 28, dreh: 10 }, ellbogenR: 35, unterarmR: 30, handR: 0, fingerR: 0.85,
      huefteL: { vor: 3, seit: 3, dreh: -6 }, knieL: 3, fussL: 0, huefteR: { vor: -3, seit: 2.5, dreh: -6 }, knieR: 2, fussR: 0 },
    kleidung: { oberteil: { stueck: "bluse", farbe: "creme" }, schuerze: { stueck: "schuerze", farbe: "#b8473a" }, unterteil: { stueck: "hose", farbe: "braun" }, schuhe: { stueck: "stiefel" } } }, 1.8, ZW.D + 0.42, (ZW.X0 + ZW.X1) / 2 + 0.1, 3, 0.9);
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
  { const h = FIG.Vh; k += zopf(h.x, h.y + 0.04 * u, 0.62, u, 0.35, 91); }
  S.teil({ id: "zwiebelzopf", de: "der Zwiebelzopf", syl: "ZWIE-bel-zopf", it: "la treccia di cipolle", itSyl: "TREC-cia di ci-POL-le", en: "onion braid", x: 0, y: 0, kunst: k,
    tipp: "Zwiebelzöpfe sind das Wahrzeichen des Weimarer Zwiebelmarkts. Den Markt gibt es seit 1653." });
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
  kleidung: { oberteil: { stueck: "tshirt", farbe: "schwarz" }, schuerze: { stueck: "schuerze", farbe: "weiss" }, unterteil: { stueck: "hose", farbe: "schwarz" }, schuhe: { stueck: "halbschuh" }, kopf: { stueck: "kappe", farbe: "rot" } } }, 1.92, GR.D + 0.4, (GR.X0 + GR.X1) / 2 - 0.4, 3, 0.9);
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
  /* Rauch: dünner Schleier vom rechten Grillende, zieht flach nach rechts weg (nicht über die Krone) */
  const rp = (pts) => pts.map(([dx, dy], i) => (i ? (i % 2 ? "Q" : " ") : "M") + `${r(cx + dx * su)} ${r(cy - dy * su)}`).join("") + "Z";
  S.davor(`<g filter="url(#${S.id("rauch")})" opacity=".3" pointer-events="none"><path d="${rp([[-0.1, 0.2], [0.1, 1.1], [0.9, 1.6], [1.8, 2.1], [3, 2.3], [3.1, 1.9], [1.9, 1.7], [0.7, 1.0], [0.4, 0.2]])}" fill="#ece8e2"/>` +
    `<path d="${rp([[0.4, 0.2], [0.7, 1.0], [1.6, 1.3], [2.6, 1.6], [3.8, 1.6], [3.8, 1.3], [2.4, 1.2], [1.2, 0.7], [0.8, 0.2]])}" fill="#dcd8d0" opacity=".7"/></g>`);
  S.teil({ id: "rostbratwurst", de: "die Rostbratwurst", syl: "ROST-brat-wurst", it: "la salsiccia alla griglia", itSyl: "sal-SIC-cia AL-la GRI-glia", en: "grilled sausage", x: 0, y: 0, kunst: k,
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
   12 — DAS FAHRRAD (Hollandrad) lehnt mit dem Hinterrad an der Litfaßsäule
   ===================================================================== */
{
  const D = 7.85, X = -4.6, u = sk(D), x = xG(D, X), y = yG(D);
  bodenSchatten(D, X, 1.7, 1, 0.24);
  const RAHMEN = "#c23a2a", CHROM = "#b9bfc4";
  let g = "";
  /* Räder: Reifen, Felge, 16 Speichen, Nabe; Licht von links oben */
  const rad = (cx) => {
    let sp = "";
    for (let i = 0; i < 16; i++) { const w = i / 16 * Math.PI * 2, v = w + (i % 2 ? 0.35 : -0.35); sp += `M${r(cx + Math.cos(v) * 0.035)} ${r(-0.34 + Math.sin(v) * 0.035)} L${(cx + Math.cos(w) * 0.29).toFixed(3)} ${(-0.34 + Math.sin(w) * 0.29).toFixed(3)} `; }
    return `<circle cx="${cx}" cy="-.34" r=".32" fill="none" stroke="#1d1d1d" stroke-width=".05"/><path d="M${cx - 0.3} -.4 A.31 .31 0 0 1 ${cx - 0.06} -.65" stroke="#6a6a6a" stroke-width=".012" fill="none"/>` +
      `<circle cx="${cx}" cy="-.34" r=".29" fill="none" stroke="${CHROM}" stroke-width=".02"/><path d="${sp}" stroke="#9aa1a6" stroke-width=".006"/><circle cx="${cx}" cy="-.34" r=".035" fill="#8a9196" stroke="#4a4f53" stroke-width=".008"/>`;
  };
  g += rad(-0.55) + rad(0.56);
  /* Schutzbleche */
  g += `<path d="M-.92 -.36 A.38 .38 0 0 1 -.2 -.5 M.22 -.5 A.38 .38 0 0 1 .9 -.44" stroke="#2b2b2b" stroke-width=".03" fill="none"/>`;
  /* Kette, Kettenblatt, Kurbel und Pedal */
  g += `<path d="M-.08 -.43 L-.55 -.385 M-.08 -.21 L-.55 -.295" stroke="#5a5f63" stroke-width=".012"/>`;
  g += `<circle cx="-.08" cy="-.32" r=".11" fill="none" stroke="#7a8084" stroke-width=".02" stroke-dasharray=".012 .008"/><circle cx="-.08" cy="-.32" r=".03" fill="#4a4f53"/>`;
  g += `<path d="M-.08 -.32 L.04 -.17" stroke="${CHROM}" stroke-width=".025" stroke-linecap="round"/><rect x="-.01" y="-.19" width=".1" height=".035" fill="#1d1d1d"/>`;
  /* Rahmen (Damenrahmen mit tiefem Einstieg), Lichtkante oben */
  const rohr = "M-.55 -.34 L-.08 -.32 L-.22 -.82 M-.55 -.34 L-.22 -.8 M-.08 -.32 Q.18 -.42 .42 -.74 L.4 -.86 M-.12 -.42 Q.12 -.52 .41 -.8 M.42 -.74 Q.47 -.55 .56 -.34";
  g += `<path d="${rohr}" stroke="${RAHMEN}" stroke-width=".045" fill="none" stroke-linejoin="round" stroke-linecap="round"/><path d="M-.5 -.37 L-.23 -.78 M-.08 -.36 Q.16 -.45 .38 -.74" stroke="#f08a72" stroke-width=".012" fill="none" opacity=".8"/>`;
  /* Gepäckträger */
  g += `<path d="M-.55 -.34 L-.66 -.66 M-.78 -.66 L-.26 -.66 M-.26 -.66 L-.22 -.78" stroke="#3a3d40" stroke-width=".018" fill="none"/>`;
  /* Sattelstütze und schmaler Sattel */
  g += `<path d="M-.22 -.82 L-.25 -.93" stroke="${CHROM}" stroke-width=".022"/><path d="M-.4 -.95 Q-.26 -.985 -.12 -.955 Q-.13 -.93 -.2 -.925 Q-.32 -.915 -.4 -.95 Z" fill="#2a1d14"/><path d="M-.38 -.955 Q-.26 -.98 -.14 -.958" stroke="#6a5444" stroke-width=".008" fill="none"/>`;
  /* Vorbau, geschwungener Lenker, Griff, Lampe */
  g += `<path d="M.4 -.86 L.38 -.98 Q.3 -1.01 .24 -.96" stroke="${CHROM}" stroke-width=".022" fill="none" stroke-linecap="round"/><path d="M.24 -.96 L.19 -.94" stroke="#1d1d1d" stroke-width=".04" stroke-linecap="round"/>`;
  g += `<path d="M.44 -.8 L.5 -.8 L.52 -.77 L.44 -.76 Z" fill="#e8e2c8" stroke="#3a3d40" stroke-width=".008"/>`;
  S.teil({ id: "fahrrad", de: "das Fahrrad", syl: "FAHR-rad", it: "la bicicletta", itSyl: "bi-ci-CLET-ta", en: "bicycle", x: r(x), y: r(y), steht: true,
    kunst: `<g transform="scale(${u.toFixed(4)}) skewX(4)">${g}</g>`, tipp: "Das Fahrrad lehnt an der Litfaßsäule. Viele Studenten fahren in Weimar Fahrrad." });
}

/* =====================================================================
   13 — DIE STUDENTIN mit dem BUCH, DER TOURIST mit dem BRÖTCHEN, DIE FAMILIE
   ===================================================================== */
KLEIN = 8;
const ST = mensch("ST", { id: "wmr_stud", geschlecht: "w", blick: 40, frisur: "lang", haarfarbe: "braun", haut: "mittel",
  pose: { lende: 1, brust: -1, nacken: 22, kopf: 14, schulterL: { vor: 26, seit: 12 }, ellbogenL: 96, unterarmL: 50, handL: 4, fingerL: 0.5,
    schulterR: { vor: 24, seit: 13 }, ellbogenR: 98, unterarmR: 50, handR: 4, fingerR: 0.5,
    huefteL: { vor: 3, seit: 3, dreh: -6 }, knieL: 3, fussL: 0, huefteR: { vor: -5, seit: 4, dreh: -10 }, knieR: 9, fussR: 5 },
  kleidung: { oberteil: { stueck: "pullover", farbe: "blau" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" }, zubehoer: { stueck: "schal", farbe: "gelb" } } }, 1.68, 8.6, -1.5, 2.4, 0.9);
bodenSchatten(8.6, -1.5, 0.45, 1.68, 0.26);
S.teil({ id: "studentin", de: "die Studentin", syl: "stu-DEN-tin", it: "la studentessa", itSyl: "stu-den-TES-sa", en: "student", x: ST.x, y: ST.y, kunst: ST.svg,
  tipp: "Die Studentin liest „Faust“ von Goethe." });
KLEIN = 8;
const TO = mensch("TO", { id: "wmr_tour", geschlecht: "m", blick: -32, frisur: "kurz", haarfarbe: "blond", haut: "hell", laecheln: true,
  pose: { lende: 1, brust: -2, nacken: 6, kopf: 4, schulterL: { vor: 3, seit: 8 }, ellbogenL: 14, unterarmL: 10, handL: 6, fingerL: 0.38,
    schulterR: { vor: 60, seit: 30, dreh: 0 }, ellbogenR: 150, unterarmR: 0, handR: 10, fingerR: 0.7,
    huefteL: { vor: 6, seit: 3, dreh: -6 }, knieL: 4, fussL: 0, huefteR: { vor: -3, seit: 2.5, dreh: -6 }, knieR: 2, fussR: 0 },
  kleidung: { oberteil: { stueck: "tshirt", farbe: "grau" }, jacke: { stueck: "jacke", farbe: "rot" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" }, zubehoer: { stueck: "rucksack", farbe: "blau" } } }, 1.8, 8.4, 1.6, 3, 0.9);
bodenSchatten(8.4, 1.6, 0.5, 1.8, 0.26);
S.teil({ id: "tourist", de: "der Tourist", syl: "tou-RIST", it: "il turista", itSyl: "tu-RI-sta", en: "tourist", x: TO.x, y: TO.y, kunst: TO.svg,
  tipp: "Der Tourist beißt gerade in seine Rostbratwurst. Lecker!" });
{
  /* Brötchen mit Wurst: die Wurst ragt an beiden Enden weit heraus, Senfstreifen */
  const h = TO.p(TO.m.z.handR);
  let g = `<rect x="-6.4" y="-1.35" width="12.8" height="1.35" rx=".67" fill="${S.lg("wurst2", [[0, "#d58a46"], [0.5, "#a3552a"], [1, "#6a3014"]])}"/>`;
  g += `<path d="M-5.4 -1.2 l.4 .9 M-4 -1.2 l.4 .9 M3.4 -1.2 l.4 .9 M4.8 -1.2 l.4 .9" stroke="#3a1a0a" stroke-width=".2"/>`;
  g += `<path d="M-3.2 -.2 Q0 1.4 3.2 -.2 L2.9 .6 Q0 2 -2.9 .6 Z" fill="#e2b06a"/>`;
  g += `<path d="M-2.8 -1.15 l.6 -.3 l.6 .3 l.6 -.3 l.6 .3 l.6 -.3 l.6 .3 l.6 -.3 l.6 .3 l.6 -.3" stroke="#e9c13a" stroke-width=".35" fill="none"/>`;
  g += `<path d="M-3.4 -.15 Q0 -1.3 3.4 -.15 Q3 .3 0 .1 Q-3 .3 -3.4 -.15 Z" fill="#d9a35a"/>`;
  S.teil({ oben: true, id: "broetchen", de: "das Brötchen", syl: "BRÖT-chen", it: "il panino", itSyl: "pa-NI-no", en: "bread roll", x: r(h.x + 1.2), y: r(h.y - 0.6), kunst: `<g transform="rotate(-26) scale(.6)">${g}</g>` + flaeche(-8, -3, 16, 6, 0.5),
    tipp: "Zur Rostbratwurst gehört ein Brötchen. Die Wurst ist immer länger als das Brötchen." });
}
{
  /* das Buch (gelbes Reclam-Heft), aufgeschlagen */
  const hs = [ST.m.z.handL, ST.m.z.handR].map((q) => ST.p(q));
  const hx = (hs[0].x + hs[1].x) / 2, hy = (hs[0].y + hs[1].y) / 2;
  let g = `<path d="M-3.4 -1.6 Q-1.6 -2.2 0 -1.4 Q1.6 -2.2 3.4 -1.6 L3.4 1.8 Q1.6 1.2 0 2 Q-1.6 1.2 -3.4 1.8 Z" fill="#f2c230" stroke="#b88a10" stroke-width=".2"/>`;
  g += `<path d="M-3 -1.3 Q-1.5 -1.8 -.2 -1.2 L-.2 1.6 Q-1.5 1 -3 1.4 Z M3 -1.3 Q1.5 -1.8 .2 -1.2 L.2 1.6 Q1.5 1 3 1.4 Z" fill="#f8f2e2"/>`;
  g += `<path d="M-2.6 -.8 H-.7 M-2.6 -.3 H-.7 M-2.6 .2 H-.9 M.7 -.8 H2.6 M.7 -.3 H2.6 M.7 .2 H2.2" stroke="#8a826e" stroke-width=".15"/>`;
  S.teil({ oben: true, id: "buch", de: "das Buch", syl: "BUCH", it: "il libro", itSyl: "LI-bro", en: "book", x: r(hx), y: r(hy - 0.4), kunst: `<g transform="scale(1.35)">${g}</g>` + flaeche(-5, -3.4, 10, 6.6, 0.5),
    tipp: "Goethe und Schiller haben in Weimar viele berühmte Bücher geschrieben." });
}
{
  /* DIE FAMILIE: Mutter und Kind kommen Hand in Hand vom Zwiebelmarkt. Die Mutter (senfgelbe Jacke, Tasche)
     trägt einen großen Zopf über dem rechten Unterarm; das Kind trägt einen kleinen Zopf als Kette. */
  const MD = 7.0, MX = 3.25;
  KLEIN = 8;
  const MU = mensch("MU", { id: "wmr_mutter", geschlecht: "w", blick: -16, frisur: "lang", haarfarbe: "hellbraun", haut: "hell", laecheln: true,
    pose: { roll: 1.4, lende: 3, brust: -1, brustDreh: 4, nacken: 5, kopf: 6,
      schulterL: { vor: 4, seit: 9 }, ellbogenL: 10, unterarmL: 10, handL: 4, fingerL: 0.7,
      schulterR: { vor: 22, seit: 9 }, ellbogenR: 78, unterarmR: 20, handR: 6, fingerR: 0.6,
      huefteL: { vor: 12, seit: 2, dreh: -5 }, knieL: 6, fussL: 0, huefteR: { vor: -10, seit: 2, dreh: -5 }, knieR: 18, fussR: 10 },
    kleidung: { oberteil: { stueck: "rollkragen", farbe: "creme" }, jacke: { stueck: "jacke", farbe: "#c99a34" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "stiefel" }, zubehoer: { stueck: "tasche", farbe: "braun" } } }, 1.68, MD, MX, 2.4, 0.9);
  KLEIN = 8;
  const KI = mensch("KI", { id: "wmr_kind", alter: "kind", geschlecht: "w", blick: -22, frisur: "zopf", haarfarbe: "blond", haut: "hell", laecheln: true,
    pose: { roll: -1, lende: 2, brust: -1, nacken: 0, kopf: -6,
      schulterL: { vor: 10, seit: 7 }, ellbogenL: 18, unterarmL: 10, handL: 6, fingerL: 0.4,
      schulterR: { vor: 8, seit: 56 }, ellbogenR: 8, unterarmR: 10, handR: 2, fingerR: 0.7,
      huefteL: { vor: -12, seit: 2, dreh: -5 }, knieL: 16, fussL: 8, huefteR: { vor: 12, seit: 2, dreh: -5 }, knieR: 6, fussR: 0 },
    kleidung: { oberteil: { stueck: "pullover", farbe: "creme" }, jacke: { stueck: "jacke", farbe: "blau" }, unterteil: { stueck: "hose", farbe: "jeans" }, schuhe: { stueck: "gummistiefel" }, kopf: { stueck: "muetze", farbe: "rot" } } }, 1.18, MD - 0.05, MX + 0.6, 2.4, 0.9);
  /* das Kind so stellen, dass seine rechte Hand in der linken Hand der Mutter liegt */
  const hm = MU.p(MU.m.z.handL), hk = KI.p(KI.m.z.handR);
  KI.x = r(KI.x + hm.x - hk.x - 0.1);
  bodenSchatten(MD, MX, 0.45, 1.68, 0.26);
  bodenSchatten(MD - 0.05, (KI.x - CX) / sk(MD - 0.05), 0.35, 1.18, 0.26);
  /* großer Zopf über dem rechten Unterarm der Mutter */
  const hr = MU.p(MU.m.z.handR), uk = sk(MD);
  const armZopf = zopf(hr.x - KI.x, hr.y - KI.y - 0.03 * uk, 0.42, uk * 0.78, 0.3, 57);
  /* kleiner Zopf als Kette um den Hals des Kindes: 6 Zwiebeln, gelb und rot, an einer Bastschnur */
  const hals = KI.p(KI.m.z.kopf), hx = hals.x - KI.x, hy = hals.y - KI.y;
  const kette = `<path d="M${r(hx - 2.3)} ${r(hy + 3.8)} Q${r(hx)} ${r(hy + 10.4)} ${r(hx + 2.3)} ${r(hy + 3.8)}" stroke="#c4a86a" stroke-width=".45" fill="none"/>` +
    [[-1.9, 5.8], [-1.1, 7.2], [0, 7.9], [1.1, 7.2], [1.9, 5.8], [0, 9.3]].map(([dx, dy], i) => `<use href="#${S.id("knolle")}" fill="url(#${S.id(i % 2 ? "zwrot" : "zwgelb")})" transform="translate(${r(hx + dx)} ${r(hy + dy)}) scale(1.05)"/>`).join("") +
    `<circle cx="${r(hx - 0.5)}" cy="${r(hy + 8.4)}" r=".35" fill="#e8c34a"/><circle cx="${r(hx + 0.6)}" cy="${r(hy + 8.6)}" r=".35" fill="#c9354a"/>`;
  S.teil({ id: "familie", de: "die Familie", syl: "fa-MI-lie", it: "la famiglia", itSyl: "fa-MI-glia", en: "family", x: KI.x, y: KI.y,
    kunst: `<g transform="translate(${r(MU.x - KI.x)} ${r(MU.y - KI.y)})">${MU.svg}</g>${armZopf}${KI.svg}${kette}`,
    tipp: "Mutter und Kind kommen Hand in Hand vom Zwiebelmarkt. Das Kind trägt einen kleinen Zwiebelzopf als Kette." });
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
