#!/usr/bin/env node
/* =====================================================================
   WEIMAR (FASSUNG 854) — Bilderwelt neu: Städte in Deutschland
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
     Schiller in Wirklichkeit größer war.
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
     ZWIEBELZÖPFE, Trockenblumen und Zwiebelkuchen; die THÜRINGER
     ROSTBRATWURST vom Holzkohlegrill im Brötchen mit Senf; Studenten der
     Bauhaus-Universität mit dem Fahrrad; ein gelbes Reclam-Heft
     („Faust“) — Weimar ist die Stadt der Dichter.
   - LICHT: Vormittag im Oktober, die Sonne steht im Südosten (hinter uns,
     links): die Ostfassade des Theaters ist hell; Schatten fallen nach
     rechts hinten. Die Linden am Platz sind herbstlich gelb.
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
/* feine Nähte und Falten (dünne Linien ohne Füllung) sieht man in dieser Größe nicht */
const schlank = (svg, min = 0.35) => svg.replace(/<path [^>]*fill="none"[^>]*\/>/g, (p) => { const m = p.match(/stroke-width="([\d.]+)"/); return m && +m[1] < min ? "" : p; });
const kompakt = (svg, Q = 1) => {
  svg = schlank(svg);
  const rund = (n) => { const v = Math.round(+n / Q) * Q; return String(v === 0 ? 0 : v); };
  return svg.replace(/ d="([^"]+)"/g, (a, p) => ` d="${p.replace(/-?\d*\.?\d+/g, rund)}"`)
    .replace(/ (x|y|x1|y1|x2|y2|cx|cy|fx|fy)="(-?\d*\.?\d+)"/g, (a, k, n) => ` ${k}="${rund(n)}"`);
};
/* Schlagschatten auf dem Pflaster: Sonne im Südosten, etwa 25° hoch → 2,1 × Höhe, nach rechts hinten */
const schattenListe = [];
const bodenSchatten = (D, X, w, h, a = 0.3) => {
  const L = 2.1 * h, dx = 0.55 * L, dz = 0.83 * L;
  const p = [[X - w / 2, D], [X + w / 2, D], [X + dx + w * 0.3, D + dz], [X + dx - w * 0.3, D + dz]];
  schattenListe.push(`<path d="M${p.map(([x2, d2]) => `${r(Math.min(400, Math.max(0, xG(d2, x2))))} ${r(yG(d2))}`).join(" L")} Z" fill="#2c2620" opacity="${a}"/>`);
};
/* Figuren: einmal in <defs> (100 Einheiten hoch), gezeichnet über <use> */
const FIG = {};
const mensch = (name, spec, groesse, D, X, Q = 1) => {
  const m = B.mensch(spec, 100);
  S.def(`<g id="${S.id("fig" + name)}">${kompakt(m.svg, Q)}</g>`);
  const f = { m, x: r(xG(D, X)), y: r(yG(D)), u: sk(D), s: groesse * sk(D) / 100 };
  f.p = (q) => ({ x: f.x + q.x * m.k * f.s, y: f.y + q.y * m.k * f.s });
  f.svg = `<use href="#${S.id("fig" + name)}" transform="scale(${f.s.toFixed(5)})"/>`;
  FIG[name] = f;
  return f;
};

S.def(`<filter color-interpolation-filters="sRGB" id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter color-interpolation-filters="sRGB" id="${S.id("wolke")}" x="-20%" y="-30%" width="140%" height="160%"><feGaussianBlur stdDeviation=".6"/></filter>`);
S.def(`<filter color-interpolation-filters="sRGB" id="${S.id("schw")}" x="-30%" y="-80%" width="160%" height="260%"><feGaussianBlur stdDeviation=".6"/></filter>`);
S.def(`<filter color-interpolation-filters="sRGB" id="${S.id("rauch")}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.6"/></filter>`);

/* Stoffe */
const TRAV = S.lg("trav", [[0, "#f1e8d4"], [0.5, "#e4d8bf"], [1, "#cbbd9f"]], 0, 0, 1, 0);
const TRAV_S = S.lg("travs", [[0, "#d3c6aa"], [1, "#b2a487"]], 0, 0, 1, 0);
const GRANIT = S.lg("granit", [[0, "#b3aaa2"], [0.45, "#9f958d"], [1, "#776d66"]], 0, 0, 1, 0);
const GOLD = S.lg("gold", [[0, "#fff3b0"], [0.45, "#e7bd4a"], [1, "#9a6c10"]], 0, 0, 1, 1);
const GLAS = S.lg("glas", [[0, "#a9bccb"], [0.5, "#5a6a78"], [1, "#2f3b46"]]);
const DACH = S.lg("dach", [[0, "#6d747b"], [1, "#4a5157"]]);
const HOLZ = S.lg("holz", [[0, "#a87848"], [0.5, "#8c5f35"], [1, "#6a4424"]], 0, 0, 1, 0);

/* =====================================================================
   KULISSE — Oktoberhimmel am Vormittag
   ===================================================================== */
S.hinten(`<rect width="400" height="${HOR + 14}" fill="${S.lg("himmel", [[0, "#6f9fd2"], [0.6, "#a9c7e4"], [1, "#e8eef2"]])}"/>`);
S.hinten(`<rect width="400" height="${HOR + 14}" fill="${S.rg("sonne", [[0, "#fff6dc", 0.6], [1, "#fff6dc", 0]], 0, 0.75, 0.7)}"/>`);
{
  const WF = ["#c6d1dd", "#eaeff4", "#ffffff"];
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
  S.hinten(wolke(58, 30, 54, 16, 5) + wolke(330, 22, 46, 13, 9) + wolke(240, 40, 20, 5, 12));
}
/* Pflaster unter allem (falls irgendwo eine Lücke bleibt) */
S.hinten(`<rect x="0" y="${HOR}" width="400" height="${260 - HOR}" fill="#a49b8f"/>`);

/* =====================================================================
   1 — DIE HÄUSER am Platz (links Süd-, rechts Nordseite, barock/klassizistisch)
   ===================================================================== */
{
  let k = "";
  /* Haus: in der Fassadenebene D, von X0 bis X1, Traufe in m, Dachfirst in m */
  const haus = (D, X0, X1, traufe, first, farbe, fl, achsen, gaube) => {
    const u = sk(D), x0 = Math.max(0.6, xG(D, X0)), x1 = Math.min(399.4, xG(D, X1)), y0 = yG(D, 0), yt = yG(D, traufe), yf = yG(D, first);
    let g = `<rect x="${r(x0)}" y="${r(yt)}" width="${r(x1 - x0)}" height="${r(y0 - yt)}" fill="${farbe}"/>`;
    g += `<rect x="${r(x0)}" y="${r(yt)}" width="${r(x1 - x0)}" height="${r(y0 - yt)}" fill="${S.lg("hauslicht", [[0, "#fff4dc", 0.25], [1, "#000", 0.12]], 0, 0, 1, 0)}"/>`;
    g += `<path d="M${r(x0 - 0.6)} ${r(yt)} L${r(x0 + (x1 - x0) * 0.12)} ${r(yf)} L${r(x1 - (x1 - x0) * 0.12)} ${r(yf)} L${r(x1 + 0.6)} ${r(yt)} Z" fill="${DACH}"/>`;
    g += `<rect x="${r(x0 - 0.6)}" y="${r(yt - 0.6)}" width="${r(x1 - x0 + 1.2)}" height=".9" fill="#efe6d4"/>`;
    const dx = (xG(D, X1) - xG(D, X0)) / achsen, fh = (y0 - yt - 0.6 * u) / fl, xa = xG(D, X0);
    for (let f = 0; f < fl; f++) for (let i = 0; i < achsen; i++) {
      const x = xa + (i + 0.5) * dx, y = yt + 0.6 * u + f * fh;
      if (x < 2 || x > 398) continue;
      g += `<rect x="${r(x - 0.45 * u)}" y="${r(y + fh * 0.22)}" width="${r(0.9 * u)}" height="${r(fh * 0.55)}" fill="${GLAS}"/><rect x="${r(x - 0.6 * u)}" y="${r(y + fh * 0.18)}" width="${r(1.2 * u)}" height="${r(0.18 * u)}" fill="#f4ecdc"/>`;
    }
    if (gaube) for (let i = 1; i < achsen; i += 2) { const x = xa + (i + 0.5) * dx; if (x < 4 || x > 396) continue; g += `<path d="M${r(x - 0.5 * u)} ${r(yt - 0.4 * u)} L${r(x - 0.5 * u)} ${r(yt - 1.4 * u)} L${r(x)} ${r(yt - 1.9 * u)} L${r(x + 0.5 * u)} ${r(yt - 1.4 * u)} L${r(x + 0.5 * u)} ${r(yt - 0.4 * u)} Z" fill="#e9e1d0"/><rect x="${r(x - 0.3 * u)}" y="${r(yt - 1.3 * u)}" width="${r(0.6 * u)}" height="${r(0.8 * u)}" fill="#3f4a52"/>`; }
    return g;
  };
  /* links (Süden), hinter den Bäumen: zwei Häuser in der Flucht des Theaters */
  k += haus(44, -34, -24, 13, 18, "#e7d8b6", 3, 4, true);
  k += haus(40, -40, -33.5, 12, 16.5, "#d9c7a2", 3, 2, false);
  /* rechts (Norden): Häuser an der Nordseite des Platzes, die näher kommen */
  k += haus(43, 24, 34, 14, 19, "#e9d9bb", 3, 4, true);
  k += haus(37, 30, 40, 12.5, 17, "#f0e4c8", 3, 4, true);
  S.teil({ id: "haus", de: "das Haus", syl: "HAUS", it: "la casa", itSyl: "CA-sa", en: "house", x: 0, y: 0, kunst: k,
    tipp: "Am Theaterplatz stehen alte Häuser aus der Zeit von Goethe und Schiller." });
}

/* =====================================================================
   2 — DAS THEATER (Deutsches Nationaltheater) — gezeichnet in Metern
   ===================================================================== */
const TD = 40, TU = sk(TD), TY = yG(TD, 0);
const theaterUnter = [];
{
  let k = "";
  const W = 22.6, M = 11.2;
  /* Seitenflügel: zwei Geschosse, Rundbogenfenster unten, Rechteckfenster oben */
  for (const s of [-1, 1]) {
    const x0 = s < 0 ? -W : M, w = W - M;
    k += `<rect x="${x0}" y="-14.4" width="${w}" height="14.6" fill="${TRAV}"/>`;
    k += `<rect x="${x0}" y="-.6" width="${w}" height=".8" fill="${TRAV_S}"/>`;
    for (let y = -1.6; y > -5.6; y -= 0.8) k += `<path d="M${x0} ${r(y)} H${x0 + w}" stroke="#c4b598" stroke-width=".07"/>`;
    k += `<rect x="${x0 - 0.2}" y="-6.1" width="${w + 0.4}" height=".55" fill="#f4ecdb"/>`;
    for (const c of [2.4, 5.7, 9.0]) {
      const x = s < 0 ? -W + c : M + w - c;
      k += `<path d="M${x - 1.1} -.6 L${x - 1.1} -3.8 Q${x - 1.1} -5 ${x} -5 Q${x + 1.1} -5 ${x + 1.1} -3.8 L${x + 1.1} -.6 Z" fill="${GLAS}"/>`;
      k += `<path d="M${x - 1.1} -.6 L${x - 1.1} -3.8 Q${x - 1.1} -5 ${x} -5 Q${x + 1.1} -5 ${x + 1.1} -3.8 L${x + 1.1} -.6" stroke="#f4ecdb" stroke-width=".25" fill="none"/>`;
      k += `<rect x="${x - 1}" y="-11.4" width="2" height="3.6" fill="${GLAS}" stroke="#f4ecdb" stroke-width=".22"/><path d="M${x} -11.4 V-7.8 M${x - 1} -9.6 H${x + 1}" stroke="#f4ecdb" stroke-width=".12"/>`;
      k += `<rect x="${x - 1.35}" y="-12.1" width="2.7" height=".45" fill="#f4ecdb"/>`;
    }
    k += `<rect x="${x0 - 0.3}" y="-15.1" width="${w + 0.6}" height=".8" fill="#f6efe0"/>`;
    k += `<path d="M${x0 - 0.3} -15.1 L${x0 + (s < 0 ? 1.5 : 0)} -17.6 L${x0 + w - (s > 0 ? 1.5 : 0)} -17.6 L${x0 + w + 0.3} -15.1 Z" fill="${DACH}"/>`;
  }
  /* Mittelbau */
  k += `<rect x="${-M}" y="-18" width="${2 * M}" height="18.2" fill="${TRAV}"/>`;
  k += `<rect x="${-M}" y="-.7" width="${2 * M}" height=".9" fill="${TRAV_S}"/>`;
  /* Erdgeschoss mit Quaderfugen und fünf Türen */
  for (let y = -1.5; y > -5.6; y -= 0.8) k += `<path d="M${-M} ${r(y)} H${M}" stroke="#c4b598" stroke-width=".07"/>`;
  for (const x of [-8, -4, 0, 4, 8]) {
    k += `<rect x="${x - 1.15}" y="-4.1" width="2.3" height="3.4" fill="#3b342e"/>`;
    k += `<rect x="${x - 0.95}" y="-3.95" width="1.9" height="3.25" fill="${GLAS}"/><path d="M${x} -3.95 V-.7 M${x - 0.95} -2.6 H${x + 0.95}" stroke="#6b5a3e" stroke-width=".12"/>`;
    k += `<rect x="${x - 1.4}" y="-4.6" width="2.8" height=".5" fill="#f2e9d6"/>`;
  }
  /* Gedenktafel links vom Eingang (1919) */
  k += `<rect x="-10.75" y="-3.7" width="1.35" height="1.9" fill="#3a3632"/><rect x="-10.6" y="-3.55" width="1.05" height="1.6" fill="none" stroke="#c9a54a" stroke-width=".05"/>`;
  for (let i = 0; i < 6; i++) k += `<rect x="-10.45" y="${r(-3.35 + i * 0.24)}" width="${i % 2 ? 0.6 : 0.75}" height=".06" fill="#c9a54a"/>`;
  /* Schaukästen mit Plakaten rechts */
  k += `<rect x="9.5" y="-3.5" width="1.2" height="1.7" fill="#3a3632"/><rect x="9.6" y="-3.4" width="1" height="1.5" fill="#b8323a"/><rect x="9.7" y="-3.25" width=".8" height=".5" fill="#f2e3c4"/>`;
  k += `<rect x="-6.1" y="-6" width="12.2" height=".1" fill="none"/>`;
  k += `<rect x="${-M - 0.2}" y="-5.9" width="${2 * M + 0.4}" height=".8" fill="#f6efe0"/><rect x="${-M - 0.2}" y="-5.15" width="${2 * M + 0.4}" height=".15" fill="#b8a98a"/>`;
  /* Säulen (sechs, über zwei Geschosse) und fünf hohe Fenster */
  for (const x of [-8, -4, 0, 4, 8]) {
    k += `<rect x="${x - 1.05}" y="-13.4" width="2.1" height="6.6" fill="${GLAS}"/>`;
    k += `<path d="M${x} -13.4 V-6.8 M${x - 1.05} -11.2 H${x + 1.05} M${x - 1.05} -9 H${x + 1.05}" stroke="#f4ecdb" stroke-width=".14"/>`;
    k += `<rect x="${x - 1.05}" y="-13.4" width="2.1" height="6.6" fill="none" stroke="#f4ecdb" stroke-width=".26"/>`;
    k += `<rect x="${x - 1.3}" y="-6.75" width="2.6" height=".35" fill="#f2e9d6"/>`;
    k += `<path d="M${x - 0.8} -13.4 L${x - 0.3} -13.1 L${x - 0.8} -9.2 Z" fill="#fff" opacity=".22"/>`;
  }
  for (const x of [-10, -6, -2, 2, 6, 10]) {
    k += `<rect x="${x - 0.48}" y="-14.2" width=".96" height="8.3" fill="${S.lg("saeule", [[0, "#fbf5e8"], [0.45, "#ece2cc"], [1, "#b9ab8e"]], 0, 0, 1, 0)}"/>`;
    for (const f of [-0.24, 0, 0.24]) k += `<path d="M${r(x + f)} -14 V-6.1" stroke="#c6b79a" stroke-width=".05"/>`;
    k += `<path d="M${x - 0.62} -14.2 L${x + 0.62} -14.2 L${x + 0.5} -14.6 L${x - 0.5} -14.6 Z" fill="#f2e9d6"/><circle cx="${x - 0.42}" cy="-14.38" r=".14" fill="#e2d6bc"/><circle cx="${x + 0.42}" cy="-14.38" r=".14" fill="#e2d6bc"/>`;
    k += `<rect x="${x - 0.6}" y="-6.1" width="1.2" height=".3" fill="#f2e9d6"/>`;
  }
  /* Gebälk mit dem Schriftzug, Gesims, Attika */
  k += `<rect x="${-M - 0.3}" y="-15.6" width="${2 * M + 0.6}" height="1" fill="#efe6d2"/>`;
  k += `<rect x="${-M - 0.2}" y="-16.9" width="${2 * M + 0.4}" height="1.3" fill="${TRAV}"/>`;
  k += `<text x="0" y="-15.85" font-size=".95" text-anchor="middle" fill="#6f6250" font-family="'Times New Roman',Georgia,serif" letter-spacing=".22">DEUTSCHES NATIONALTHEATER</text>`;
  k += `<rect x="${-M - 0.5}" y="-17.4" width="${2 * M + 1}" height=".55" fill="#f8f1e2"/>`;
  k += `<rect x="${-M}" y="-19" width="${2 * M}" height="1.6" fill="${S.lg("attika", [[0, "#f1e8d4"], [1, "#d9ccb0"]])}"/>`;
  k += `<rect x="${-M - 0.2}" y="-19.25" width="${2 * M + 0.4}" height=".3" fill="#f8f1e2"/>`;
  k += `<path d="M${-M + 0.3} -19.25 L${-M + 1.6} -19.9 L${M - 1.6} -19.9 L${M - 0.3} -19.25 Z" fill="${DACH}"/>`;
  /* leichter Schatten auf der rechten Hälfte (Sonne von links vorn) */
  S.teil({ id: "theater", de: "das Theater", syl: "the-A-ter", it: "il teatro", itSyl: "te-A-tro", en: "theatre", x: CX, y: TY, kunst: `<g transform="scale(${TU.toFixed(5)})">${k}</g>`,
    tipp: "Das Deutsche Nationaltheater: Hier wurde 1919 die erste demokratische Verfassung Deutschlands beschlossen.",
    zoom: { x: r(CX - 14 * TU), y: r(TY - 19 * TU), w: r(28 * TU), h: r(18.7 * TU) } });
  theaterUnter.push({ id: "gedenktafel", de: "die Gedenktafel", syl: "ge-DENK-ta-fel", it: "la targa commemorativa", itSyl: "TAR-ga com-me-mo-ra-TI-va", en: "memorial plaque",
    x: r(CX - 10.08 * TU), y: r(TY - 1.8 * TU), kunst: flaeche(-0.75 * TU, -1.95 * TU, 1.5 * TU, 1.95 * TU, 0.4),
    tipp: "Die Tafel erinnert an die Nationalversammlung von 1919. Daher kommt der Name „Weimarer Republik“." });
  theaterUnter.push({ id: "saeule", de: "die Säule", syl: "SÄU-le", it: "la colonna", itSyl: "co-LON-na", en: "column",
    x: r(CX + 6 * TU), y: r(TY - 5.8 * TU), kunst: flaeche(-0.55 * TU, -8.8 * TU, 1.1 * TU, 8.8 * TU, 0.4) });
  theaterUnter.push({ id: "tuer", de: "die Tür", syl: "TÜR", it: "la porta", itSyl: "POR-ta", en: "door",
    x: r(CX + 8 * TU), y: r(TY - 0.7 * TU), kunst: flaeche(-1.15 * TU, -3.4 * TU, 2.3 * TU, 3.4 * TU, 0.4) });
  theaterUnter.push({ id: "schriftzug", de: "der Schriftzug", syl: "SCHRIFT-zug", it: "la scritta", itSyl: "SCRIT-ta", en: "lettering",
    x: r(CX + 4.5 * TU), y: r(TY - 15.6 * TU), kunst: flaeche(-5.5 * TU, -1.3 * TU, 11 * TU, 1.3 * TU, 0.4),
    tipp: "Über den Säulen steht „Deutsches Nationaltheater“." });
}
S.teile[S.teile.length - 1].unter = theaterUnter;

/* =====================================================================
   3 — DIE BÄUME (Linden am Platz, Herbstlaub)
   ===================================================================== */
{
  let bz = 0;
  const krone = (cx, cy, w, h, seed, herbst) => {
    const z = zufall(seed);
    let g = "";
    const N = Math.round(w * h / 130);
    const b = [];
    for (let i = 0; i < N; i++) { const a = z() * Math.PI * 2, d = Math.sqrt(z()) * 0.92; b.push([cx + Math.cos(a) * d * w / 2, cy + Math.sin(a) * d * h / 2, 4.5 + z() * 3.5, z() < herbst]); }
    b.sort((p, q) => p[1] - q[1]);
    let basis = "";
    for (const [x, y, rr] of b) basis += `<circle cx="${r(x + 0.6)}" cy="${r(y + 0.8)}" r="${r(rr * 0.95)}"/>`;
    g += `<g fill="#6b5a24">${basis}</g>`;
    for (const [x, y, rr, gelb] of b) {
      const id = S.id("bl" + bz++);
      let c = "";
      for (let j = 0; j < 6; j++) { const a = z() * 6.28, d = z() * rr * 0.7; c += `<circle cx="${r(x + Math.cos(a) * d)}" cy="${r(y + Math.sin(a) * d * 0.8)}" r="${r(rr * (0.32 + z() * 0.22))}"/>`; }
      S.def(`<g id="${id}">${c}</g>`);
      const T = gelb ? ["#7a5e1c", "#c39a2e", "#efcf5e"] : ["#4d5a24", "#86913a", "#b9bd5c"];
      g += `<use href="#${id}" fill="${T[0]}" transform="translate(.9 1.1)"/><use href="#${id}" fill="${T[1]}"/><use href="#${id}" fill="${T[2]}" transform="translate(${r(x - 0.8)} ${r(y - 1)}) scale(.62) translate(${r(-x)} ${r(-y)})"/>`;
    }
    return g;
  };
  let k = "";
  const STAMM = S.lg("stamm", [[0, "#7a6550"], [1, "#3c3024"]], 0, 0, 1, 0);
  for (const [D, X, w] of [[34, -22.5, 0.5], [28, -19.5, 0.55], [33, 22, 0.5], [27, 19, 0.55]]) {
    const x = xG(D, X), y0 = yG(D), y1 = yG(D, 8), bw = w * sk(D), u = sk(D);
    k += `<path d="M${r(x - bw)} ${r(y0)} L${r(x - bw * 0.55)} ${r(y1)} L${r(x + bw * 0.55)} ${r(y1)} L${r(x + bw)} ${r(y0)} Z" fill="${STAMM}"/>`;
    k += `<path d="M${r(x)} ${r(yG(D, 5.5))} q${r(1.2 * u)} ${r(-0.8 * u)} ${r(2 * u)} ${r(-2.6 * u)} M${r(x)} ${r(yG(D, 6.2))} q${r(-1.1 * u)} ${r(-0.7 * u)} ${r(-1.8 * u)} ${r(-2.4 * u)}" stroke="#4a3b2c" stroke-width="${r(0.18 * u)}" fill="none" stroke-linecap="round"/>`;
    bodenSchatten(D, X, 1, 9, 0.18);
  }
  k += krone(xG(34, -22.5), yG(34, 10), 38, 56, 31, 0.6) + krone(xG(28, -19.5), yG(28, 9.5), 36, 58, 32, 0.55);
  k += krone(xG(33, 22), yG(33, 10), 38, 56, 33, 0.65) + krone(xG(27, 19), yG(27, 9.5), 36, 58, 34, 0.55);
  S.teil({ id: "baum", de: "der Baum", syl: "BAUM", it: "l'albero", itSyl: "AL-be-ro", en: "tree", x: 0, y: 0, kunst: k,
    tipp: "Im Oktober werden die Blätter der Linden gelb." });
}

/* =====================================================================
   4 — DER PLATZ (Granitpflaster) mit den Schlagschatten — Bodenfläche
   ===================================================================== */
const PLATZ = {};
/* (die Kunst wird am Ende gebaut, wenn alle Schatten bekannt sind; der Platz liegt aber unter allem) */
S.teil(PLATZ.t = { id: "platz", de: "der Platz", syl: "PLATZ", it: "la piazza", itSyl: "PIAZ-za", en: "square", x: 0, y: 0, kunst: "",
  tipp: "Der Theaterplatz ist einer der schönsten Plätze in Weimar." });

/* =====================================================================
   5 — DIE LATERNE (Kandelaber am Platz)
   ===================================================================== */
{
  let k = "";
  for (const [D, X] of [[27, -6.4], [27, 6.4]]) {
    const u = sk(D), x = xG(D, X), y = yG(D);
    bodenSchatten(D, X, 0.3, 4.2, 0.18);
    let g = `<path d="M-.22 0 L-.18 -.5 L-.08 -.6 L-.06 -3.6 L.06 -3.6 L.08 -.6 L.18 -.5 L.22 0 Z" fill="${S.lg("guss", [[0, "#5a6064"], [0.4, "#2f3438"], [1, "#1e2225"]], 0, 0, 1, 0)}"/>`;
    g += `<path d="M-.26 -3.6 L.26 -3.6 L.32 -4.25 L-.32 -4.25 Z" fill="#f5f0dc" opacity=".9"/><path d="M-.32 -4.25 L.32 -4.25 L0 -4.55 Z" fill="#2f3438"/><path d="M0 -3.6 V-4.25" stroke="#2f3438" stroke-width=".03"/>`;
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
  bodenSchatten(DD, 0, 4.4, 6.9, 0.3);
  let k = "";
  /* Sockel: zwei Stufen, Fuß, Würfel mit Inschrift, Gesims — in Metern */
  let p = `<rect x="-2.3" y="-.35" width="4.6" height=".35" fill="#8f877f"/><rect x="-2.3" y="-.35" width="4.6" height=".07" fill="#c3bab0"/>`;
  p += `<rect x="-2.0" y="-.7" width="4" height=".35" fill="#9a918a"/><rect x="-2.0" y="-.7" width="4" height=".07" fill="#c8bfb5"/>`;
  p += `<path d="M-1.75 -.7 L-1.75 -1.15 L-1.55 -1.3 L1.55 -1.3 L1.75 -1.15 L1.75 -.7 Z" fill="${GRANIT}"/>`;
  p += `<rect x="-1.5" y="-2.85" width="3" height="1.55" fill="${GRANIT}"/>`;
  p += `<path d="M-1.75 -2.85 L1.75 -2.85 L1.6 -3.0 L1.75 -3.12 L1.75 -3.3 L-1.75 -3.3 L-1.75 -3.12 L-1.6 -3.0 Z" fill="${S.lg("gesims", [[0, "#b8afa6"], [1, "#857c74"]])}"/>`;
  p += `<rect x="-1.5" y="-2.85" width="3" height="1.55" fill="url(#${S.id("granitkorn")})" opacity=".5"/>`;
  const t = (y, txt, fs) => `<text x="0" y="${y}" font-size="${fs}" text-anchor="middle" fill="${GOLD}" stroke="#5e4512" stroke-width=".012" font-family="'Times New Roman',Georgia,serif" letter-spacing=".02">${txt}</text>`;
  p += t(-2.38, "DEM DICHTERPAAR", 0.21) + t(-2.04, "GOETHE UND SCHILLER", 0.21) + t(-1.7, "DAS VATERLAND", 0.21);
  /* Bronzeplatte, auf der die beiden stehen */
  p += `<path d="M-1.35 -3.3 L1.35 -3.3 L1.3 -3.45 L-1.3 -3.45 Z" fill="#3e4636"/>`;
  k += `<g transform="scale(${DU.toFixed(5)})">${p}</g>`;
  /* DIE FIGUREN (Bronze, von Hand gezeichnet): Goethe links im Hofrock mit Weste,
     Ordensstern und Kniehose, seine linke Hand auf Schillers Schulter, die rechte
     hält den Lorbeerkranz; Schiller rechts im langen offenen Rock, den Blick nach
     oben, die rechte Hand am Kranz, in der linken die Schriftrolle.
     Figurenmaß: 100 Einheiten = 3,55 m; Ursprung = Mitte der Bronzeplatte. */
  const FS = 3.55 * DU / 100;
  const fussY = -3.45 * DU;
  const BRZ = S.lg("brz", [[0, "#aca577"], [0.28, "#6e6b44"], [0.68, "#3a3a26"], [1, "#1d1d14"]], 0, 0, 1, 0);
  const BRZ_H = S.lg("brzh", [[0, "#b0aa78"], [0.5, "#7a7650"], [1, "#4a4a31"]], 0, 0, 1, 0);
  const ARM_L = "#6f6b45", ARM_D = "#3f3f29", DUNKEL = "#1f1f16";
  /* Bein: Kniehose bis unter das Knie, Strumpf mit Wade, schmale Fessel */
  const bein = (x0, x1, kc, fx) => `<path d="M${x0} -56 L${x1} -56 L${r(kc + 2.7)} -29 Q${r(kc + 3.1)} -19 ${r(fx + 1.6)} -5 L${r(fx - 1.6)} -5 Q${r(kc - 3.1)} -19 ${r(kc - 2.7)} -29 Z" fill="${BRZ}"/>` +
    `<path d="M${r(kc - 2.8)} -29.6 L${r(kc + 2.8)} -29.6 L${r(kc + 2.7)} -28.2 L${r(kc - 2.7)} -28.2 Z" fill="${ARM_D}"/><circle cx="${r(kc + 2)}" cy="-28.9" r=".45" fill="#a49e6c"/>`;
  const schuh = (fx, dir) => `<path d="M${fx - 2.4} -4 L${fx + 2.4} -4 Q${fx + 2.4 + dir * 2.4} -1.6 ${fx + dir * 3.6} 0 L${fx - 2.6 + Math.min(0, dir) * 1.4} 0 Q${fx - 3} -2 ${fx - 2.4} -4 Z" fill="${DUNKEL}"/><rect x="${fx - 1}" y="-3.6" width="2" height="1" fill="#8a8458"/>`;
  const arm = (pts, w, farbe) => `<path d="M${pts.map((p2) => p2.join(" ")).join(" L")}" stroke="${farbe}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<path d="M${pts.map((p2) => (p2[0] - w * 0.22) + " " + (p2[1] - w * 0.1)).join(" L")}" stroke="#a49e6c" stroke-width="${r(w * 0.22)}" fill="none" stroke-linecap="round" opacity=".55"/>`;
  const hand = (x, y, rot) => `<ellipse cx="${x}" cy="${y}" rx="2" ry="2.6" fill="${BRZ_H}" transform="rotate(${rot} ${x} ${y})"/><path d="M${x - 1.2} ${y + 1.6} q1.2 1 2.4 0" stroke="${ARM_D}" stroke-width=".4" fill="none"/>`;
  const GO = -13, SC = 13;
  let fig = "";
  /* Goethes linker Arm geht hinter Schillers Schulter (zuerst gezeichnet) */
  fig += `<g transform="translate(${GO} 0)">${arm([[10.4, -80.6], [13.4, -71], [16.2, -81]], 5.4, ARM_D)}</g>`;
  /* --- Schiller --- */
  {
    let g = bein(-8, -1.6, -5.4, -5.8) + bein(1.4, 7.6, 4.8, 5) + schuh(-5.8, -1) + schuh(5, 1);
    /* Weste und Hemd mit offenem Kragen */
    g += `<path d="M-5 -82 L5 -82 L5.6 -54 Q0 -51 -5.6 -54 Z" fill="#4c4b31"/>`;
    for (let y = -78; y > -56; y -= 4.4) g += `<circle cx="0" cy="${y}" r=".55" fill="#a49e6c"/>`;
    g += `<path d="M-3.4 -86.5 L0 -80.5 L3.4 -86.5 L2 -87.5 L0 -84 L-2 -87.5 Z" fill="#8f8a5e"/>`;
    /* langer, offener Rock mit breitem Kragen; die Schöße reichen bis unter das Knie */
    g += `<path d="M-11.2 -82 Q-12.6 -70 -12.6 -58 Q-14 -40 -14.6 -25 L-9.2 -25 Q-7.6 -42 -6.2 -56 L-3.6 -86 L3.6 -86 L6.2 -56 Q7.6 -42 9.2 -25 L14.6 -25 Q14 -40 12.6 -58 Q12.6 -70 11.2 -82 Q6 -85.6 0 -86.4 Q-6 -85.6 -11.2 -82 Z" fill="${BRZ}"/>`;
    g += `<path d="M-3.6 -86 L-7.4 -76 L-6 -70 L-6.2 -56 M3.6 -86 L7.4 -76 L6 -70 L6.2 -56" stroke="${ARM_D}" stroke-width=".7" fill="none"/>`;
    g += `<path d="M-4 -86.5 Q-8.5 -87 -11 -83 L-7.6 -76 Z M4 -86.5 Q8.5 -87 11 -83 L7.6 -76 Z" fill="#7a7650"/>`;
    g += `<path d="M-11 -66 Q-11.6 -50 -12.8 -32 M10.6 -66 Q11.2 -50 12.4 -32 M-9 -40 Q-8.6 -34 -9.2 -27" stroke="${ARM_D}" stroke-width=".5" fill="none" opacity=".7"/>`;
    /* linker Arm (rechts im Bild) mit der Schriftrolle */
    g += arm([[10.6, -80.5], [12.8, -63], [11.2, -51.5]], 5.6, ARM_D);
    g += `<path d="M9.8 -57 L13.2 -39.5" stroke="#8a8458" stroke-width="2.6" stroke-linecap="round"/><ellipse cx="9.8" cy="-57" rx="1.4" ry=".9" fill="#b0aa78" transform="rotate(-12 9.8 -57)"/>`;
    g += hand(11.4, -50.5, -10);
    /* Kopf: Blick nach oben in die Ferne, langes welliges Haar, kräftige Nase */
    g += `<rect x="-2" y="-90" width="4" height="4.6" fill="#5d5b3a"/>`;
    g += `<ellipse cx="-.3" cy="-94.2" rx="4.7" ry="6.1" fill="${BRZ_H}" transform="rotate(-6 -.3 -94.2)"/>`;
    g += `<path d="M-5.4 -94 Q-6.2 -101.8 -.4 -101.6 Q5.4 -101.4 5.4 -95 Q5.8 -90 5.4 -86.6 Q4.2 -85.8 3.4 -87 Q4.2 -91.8 3.2 -96 Q-1 -98.4 -4 -95.8 Q-4.8 -91.4 -3.6 -87.2 Q-4.6 -85.8 -5.8 -86.6 Q-6.2 -90 -5.4 -94 Z" fill="${BRZ}"/><path d="M-5 -92 q.6 2 .2 4 M4.8 -92 q-.4 2 0 4" stroke="#8a8458" stroke-width=".4" fill="none"/>`;
    g += `<path d="M-2.6 -95.4 q.9 -.6 1.8 0 M.8 -95.6 q.9 -.6 1.8 0" stroke="${DUNKEL}" stroke-width=".5" fill="none"/><path d="M-.6 -95 Q-1.6 -92 -.4 -91.2" stroke="${ARM_D}" stroke-width=".7" fill="none"/><path d="M-1.8 -89.4 q1.2 .5 2.4 0" stroke="${ARM_D}" stroke-width=".45" fill="none"/>`;
    fig += `<g transform="translate(${SC} 0)">${g}</g>`;
  }
  /* --- Goethe --- */
  {
    let g = bein(-7.6, -1.4, -4.6, -4.6) + bein(1.4, 7.6, 5.4, 6.2) + schuh(-4.6, -1) + schuh(6.2, 1);
    /* Weste mit Knöpfen, Halsbinde */
    g += `<path d="M-4.8 -82 L4.8 -82 L5.2 -55 Q0 -52 -5.2 -55 Z" fill="#4c4b31"/>`;
    for (let y = -79; y > -57; y -= 3.6) g += `<circle cx=".2" cy="${y}" r=".5" fill="#a49e6c"/>`;
    g += `<path d="M-2.2 -86.4 Q0 -84.6 2.2 -86.4 L1.6 -80.4 Q0 -78.8 -1.6 -80.4 Z" fill="#9a9466"/>`;
    /* Hofrock: knielang, vorn offen, Stehkragen */
    g += `<path d="M-11 -82 Q-12.4 -70 -12.4 -58 Q-13.4 -43 -13.8 -30 L-8.2 -30 Q-6.4 -44 -5 -57.6 L-2 -85.6 L2 -85.6 L5 -57.6 Q6.4 -44 8.2 -30 L13.8 -30 Q13.4 -43 12.4 -58 Q12.4 -70 11 -82 Q6 -85.4 0 -86 Q-6 -85.4 -11 -82 Z" fill="${BRZ}"/>`;
    g += `<path d="M-4.4 -86.6 Q0 -89 4.4 -86.6 L3.4 -84.2 Q0 -85.8 -3.4 -84.2 Z" fill="#7a7650"/>`;
    g += `<path d="M-2 -85.6 L-5 -57.6 L-8.2 -30 M2 -85.6 L5 -57.6 L8.2 -30" stroke="${ARM_D}" stroke-width=".6" fill="none"/>`;
    g += `<path d="M-10.6 -66 Q-11.2 -50 -12.2 -34 M10.2 -66 Q10.8 -50 11.8 -34" stroke="${ARM_D}" stroke-width=".5" fill="none" opacity=".7"/>`;
    /* Ordensstern auf der linken Brust */
    g += `<path d="M7 -74.6 L7.5 -73.1 L9 -72.6 L7.5 -72.1 L7 -70.6 L6.5 -72.1 L5 -72.6 L6.5 -73.1 Z" fill="#c9c08a"/>`;
    /* rechter Arm (links im Bild): hält den Kranz vor dem Körper */
    g += arm([[-10.8, -80.5], [-11.6, -63.5], [2.4, -50.4]], 5.8, ARM_L);
    g += hand(4.2, -49.2, 60);
    /* Kopf: ruhig nach vorn, hohe Stirn, Haar nach hinten mit Locken über den Ohren */
    g += `<rect x="-2" y="-90" width="4" height="4.4" fill="#5d5b3a"/>`;
    g += `<ellipse cx=".2" cy="-93.6" rx="4.8" ry="6.2" fill="${BRZ_H}"/>`;
    g += `<path d="M-4.9 -94.6 Q-5.4 -100.6 0 -100.6 Q5.4 -100.6 5 -94.6 Q4.2 -97.8 0 -98.2 Q-4 -97.8 -4.9 -94.6 Z" fill="${BRZ}"/>`;
    g += `<path d="M-4.9 -96 Q-6.2 -94 -5 -91.6 Q-4.2 -92.8 -4.4 -95.4 Z M5.1 -96 Q6.4 -94 5.2 -91.6 Q4.4 -92.8 4.6 -95.4 Z" fill="#4a4a31"/>`;
    g += `<path d="M-2.6 -94.4 q.9 -.5 1.8 0 M.9 -94.4 q.9 -.5 1.8 0" stroke="${DUNKEL}" stroke-width=".5" fill="none"/><path d="M.2 -94 Q-.6 -91.6 .4 -90.8" stroke="${ARM_D}" stroke-width=".6" fill="none"/><path d="M-1.2 -89.2 q1.3 .4 2.6 0" stroke="${ARM_D}" stroke-width=".45" fill="none"/>`;
    fig += `<g transform="translate(${GO} 0)">${g}</g>`;
  }
  /* Schillers rechter Arm greift über Goethes Rock zum Kranz */
  fig += `<g transform="translate(${SC} 0)">${arm([[-10.6, -80.5], [-13.6, -64.5], [-14.2, -51.6]], 5.6, ARM_L)}${hand(-14.6, -49.4, -10)}</g>`;
  /* der Lorbeerkranz zwischen beiden Händen */
  const KX = -4.6, KY = -45.6;
  let kranz = `<ellipse cx="${KX}" cy="${KY}" rx="5.2" ry="5" fill="none" stroke="#3f3f29" stroke-width="1.6"/>`;
  for (let i = 0; i < 18; i++) { const w = i / 18 * Math.PI * 2, x = KX + Math.cos(w) * 5.2, y = KY + Math.sin(w) * 5; kranz += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="1.5" ry=".7" fill="${i % 2 ? "#8a8458" : "#5d5b3a"}" transform="rotate(${Math.round(w * 57.3 + 50)} ${r(x)} ${r(y)})"/>`; }
  kranz += `<path d="M${KX - 1.6} ${KY + 5} l-.8 2.6 M${KX + 1.6} ${KY + 5} l.8 2.6" stroke="#5d5b3a" stroke-width=".6"/>`;
  fig += kranz;
  /* Goethes Hand liegt auf Schillers Schulter */
  fig += `<g transform="translate(${GO} 0)">${hand(16.6, -82.4, 80)}</g>`;
  /* Patina: grünliche Laufspuren */
  k += `<g transform="translate(0 ${r(fussY)}) scale(${FS.toFixed(5)})">${fig}</g>`;
  const P = (x, y) => ({ x: x * FS, y: fussY + y * FS });
  const GX = GO * FS;
  const { x: kx, y: ky } = P(KX, KY);
  const sL = P(SC + 11.4, -50.5);
  /* grüne Patina-Streifen und Glanz auf der Bronze */
  S.teil({ id: "denkmal", de: "das Denkmal", syl: "DENK-mal", it: "il monumento", itSyl: "mo-nu-MEN-to", en: "monument", x: CX, y: DY, kunst: k,
    tipp: "Das Goethe-Schiller-Denkmal steht seit 1857 vor dem Theater. Es ist das berühmteste Denkmal in Weimar.",
    zoom: { x: r(CX - 3.4 * DU), y: r(DY - 7.3 * DU), w: r(6.8 * DU), h: r(4.6 * DU) } });
  denkmalUnter.push({ id: "dichter", de: "der Dichter", syl: "DICH-ter", it: "il poeta", itSyl: "po-E-ta", en: "poet", x: r(CX + GX), y: r(DY + fussY),
    kunst: flaeche(-0.5 * DU, -3.6 * DU, 1.0 * DU, 3.6 * DU, 0.5), tipp: "Links steht Johann Wolfgang von Goethe, rechts Friedrich Schiller. Beide waren Dichter und Freunde." });
  denkmalUnter.push({ id: "lorbeerkranz", de: "der Lorbeerkranz", syl: "LOR-beer-kranz", it: "la corona d'alloro", itSyl: "co-RO-na dal-LO-ro", en: "laurel wreath", x: r(CX + kx), y: r(DY + ky + 0.2 * DU),
    kunst: flaeche(-0.22 * DU, -0.4 * DU, 0.44 * DU, 0.42 * DU, 0.3), tipp: "Der Lorbeerkranz ist ein Zeichen für Ruhm. Beide Dichter halten ihn zusammen." });
  denkmalUnter.push({ id: "schriftrolle", de: "die Schriftrolle", syl: "SCHRIFT-rol-le", it: "il rotolo", itSyl: "RO-to-lo", en: "scroll", x: r(CX + sL.x), y: r(DY + sL.y + 0.4 * DU),
    kunst: flaeche(-0.12 * DU, -0.7 * DU, 0.26 * DU, 0.72 * DU, 0.3) });
  denkmalUnter.push({ id: "sockel", de: "der Sockel", syl: "SO-ckel", it: "il piedistallo", itSyl: "pie-di-STAL-lo", en: "pedestal", x: CX, y: r(DY - 0.7 * DU),
    kunst: flaeche(-1.75 * DU, -2.6 * DU, 3.5 * DU, 2.6 * DU, 0.5), tipp: "Auf dem Sockel steht: „Dem Dichterpaar Goethe und Schiller das Vaterland“." });
}
S.teile[S.teile.length - 1].unter = denkmalUnter;
S.def(`<pattern id="${S.id("granitkorn")}" patternUnits="userSpaceOnUse" width=".6" height=".5"><circle cx=".1" cy=".1" r=".03" fill="#5d5550"/><circle cx=".4" cy=".3" r=".025" fill="#d9d0c6"/><circle cx=".25" cy=".42" r=".02" fill="#5d5550"/></pattern>`);

/* =====================================================================
   7 — DIE TAUBEN vor dem Denkmal
   ===================================================================== */
{
  const taube = (D, X, pick, s2 = 1) => {
    const u = sk(D) * 0.042 * s2, x = xG(D, X), y = yG(D);
    let g = `<path d="M-.6 0 l-.3 -1.6 M.8 0 l.2 -1.6" stroke="#d2544a" stroke-width=".4"/>`;
    g += `<path d="M-4.4 -3 Q-2 -6.2 2 -5 L5.4 -4.4 L5 -3.4 Q1 -1.2 -4.4 -3 Z" fill="${S.lg("taube", [[0, "#a8adb8"], [1, "#6e7480"]])}"/>`;
    g += `<path d="M-1 -4.6 L2.6 -4.2 M-.6 -3.8 L2.8 -3.4" stroke="#2f3238" stroke-width=".35"/>`;
    const kx = pick ? -5 : -3.6, ky = pick ? -1.4 : -6.4;
    g += `<path d="M-3 -4.4 Q${kx + 0.6} ${ky + 1.6} ${kx} ${ky}" stroke="#6f8f7e" stroke-width="1.8" fill="none" stroke-linecap="round"/><circle cx="${kx}" cy="${ky}" r="1.15" fill="#7d838e"/><circle cx="${kx - 0.3}" cy="${ky - 0.25}" r=".25" fill="#e98a2a"/><path d="M${kx - 1} ${ky + 0.1} l-1 .4 l1 .2 Z" fill="#3a3a3e"/>`;
    return `<g transform="translate(${r(x)} ${r(y)}) scale(${u.toFixed(4)})">${g}</g>`;
  };
  const k = taube(13.2, -0.9, true) + taube(12.6, 0.2, false) + taube(14, 1.3, true, 1) + taube(12.2, 3.6, false);
  S.teil({ oben: true, id: "taube", de: "die Taube", syl: "TAU-be", it: "il piccione", itSyl: "pic-CIO-ne", en: "pigeon", x: 0, y: 0, kunst: k,
    tipp: "Die Tauben suchen auf dem Platz nach Krümeln." });
}

/* =====================================================================
   8 — DER MARKTSTAND mit Zwiebelzöpfen (links), DIE VERKÄUFERIN
   ===================================================================== */
const ZW = { D: 13, X: -5.6 };
{
  const u = sk(ZW.D), x = xG(ZW.D, ZW.X), y = yG(ZW.D);
  bodenSchatten(ZW.D, ZW.X, 3.2, 2.6, 0.26);
  let g = "";
  /* Holzstand mit Pultdach, weiß-rotes Markisenband, Theke */
  for (const sx of [-1.55, 1.45]) g += `<rect x="${sx}" y="-2.55" width=".1" height="2.55" fill="#6a4424"/>`;
  g += `<path d="M-1.75 -2.55 L1.75 -2.55 L1.85 -2.95 L-1.65 -3.15 Z" fill="${S.lg("standdach", [[0, "#8c5f35"], [1, "#5a3a1c"]])}"/>`;
  for (let i = 0; i < 9; i++) g += `<path d="M${r(-1.75 + i * 0.39)} -2.55 l.39 0 l0 .22 q-.195 .12 -.39 0 Z" fill="${i % 2 ? "#f4efe6" : "#b8323a"}"/>`;
  g += `<rect x="-1.55" y="-2.3" width="3.1" height=".26" fill="#f4ecd8"/><text x="0" y="-2.11" font-size=".18" text-anchor="middle" fill="#6a3a1a" font-family="Georgia,serif" font-weight="bold">Zwiebeln aus Heldrungen</text>`;
  /* Querstange, an der die Zöpfe hängen */
  g += `<rect x="-1.5" y="-2.0" width="3" height=".06" fill="#6a4424"/>`;
  /* Theke mit Brett */
  g += `<rect x="-1.65" y="-.95" width="3.3" height=".1" fill="#c79a62"/><rect x="-1.6" y="-.85" width="3.2" height=".85" fill="${HOLZ}"/>`;
  for (let i = 0; i < 8; i++) g += `<path d="M${r(-1.6 + i * 0.4)} -.85 V0" stroke="#5e3d20" stroke-width=".02"/>`;
  g += `<rect x="-1.2" y="-.62" width="1.1" height=".34" fill="#f4ecd8"/><text x="-.65" y="-.38" font-size=".2" text-anchor="middle" fill="#2f5a32" font-family="Georgia,serif" font-weight="bold">Zopf 8 €</text>`;
  S.teil({ id: "marktstand", de: "der Marktstand", syl: "MARKT-stand", it: "la bancarella", itSyl: "ban-ca-REL-la", en: "market stall", x: r(x), y: r(y), steht: true,
    kunst: `<g transform="scale(${u.toFixed(4)})">${g}</g>`, tipp: "Beim Zwiebelmarkt im Oktober stehen in der ganzen Altstadt Marktstände." });
}
{
  /* Die Verkäuferin hinter der Theke (bis zur Theke verdeckt) */
  const V = mensch("V", { id: "wmr_verk", geschlecht: "w", blick: 20, frisur: "dutt", haarfarbe: "braun", haut: "hell", laecheln: true, pose: "halten",
    kleidung: { oberteil: { stueck: "pullover", farbe: "gruen_d" }, schuerze: { stueck: "schuerze", farbe: "beige" }, unterteil: { stueck: "hose", farbe: "braun" }, schuhe: { stueck: "stiefel" }, kopf: { stueck: "kopftuch", farbe: "rot" } } }, 1.64, ZW.D + 0.7, ZW.X + 0.4, 2);
  const theke = yG(ZW.D, 0.95);
  S.def(`<clipPath id="${S.id("hinterTheke")}"><rect x="-60" y="-120" width="120" height="${r(theke - V.y + 120)}"/></clipPath>`);
  S.teil({ id: "verkaeuferin", de: "die Verkäuferin", syl: "ver-KÄU-fe-rin", it: "la venditrice", itSyl: "ven-di-TRI-ce", en: "saleswoman", x: V.x, y: V.y,
    kunst: `<g clip-path="url(#${S.id("hinterTheke")})">${V.svg}</g>`, tipp: "Die Verkäuferin sagt: „Ein Zwiebelzopf bringt Glück in die Küche!“" });
}
{
  /* DIE ZWIEBELZÖPFE: geflochtene Zöpfe hängen an der Stange */
  const u = sk(ZW.D), x = xG(ZW.D, ZW.X), y = yG(ZW.D);
  const zopf = (cx, len, rot) => {
    let g = `<path d="M${cx} -1.98 Q${cx + 0.02} ${r(-1.98 + len / 2)} ${cx} ${r(-1.98 + len)}" stroke="#c9a46a" stroke-width=".05" fill="none"/>`;
    const n = Math.round(len / 0.11);
    for (let i = 0; i < n; i++) {
      const yy = -1.9 + i * 0.11, sx = (i % 2 ? 0.06 : -0.06);
      g += `<ellipse cx="${r(cx + sx)}" cy="${r(yy)}" rx=".075" ry=".065" fill="url(#${S.id(rot && i % 3 === 0 ? "zwrot" : "zwgelb")})"/>`;
    }
    g += `<path d="M${cx - 0.03} ${r(-1.98 + len)} l-.04 .12 M${cx + 0.03} ${r(-1.98 + len)} l.04 .12" stroke="#cbb07a" stroke-width=".02"/>`;
    return g;
  };
  S.def(`<radialGradient id="${S.id("zwgelb")}" cx=".38" cy=".35" r=".7"><stop offset="0" stop-color="#f3d79a"/><stop offset=".6" stop-color="#c98d3e"/><stop offset="1" stop-color="#8a5620"/></radialGradient>`);
  S.def(`<radialGradient id="${S.id("zwrot")}" cx=".38" cy=".35" r=".7"><stop offset="0" stop-color="#d98aa6"/><stop offset=".6" stop-color="#8e2a4e"/><stop offset="1" stop-color="#5a1430"/></radialGradient>`);
  let g = "";
  const pos = [[-1.32, 0.95, false], [-1.0, 0.8, true], [-0.7, 0.92, false], [0.55, 0.85, false], [0.85, 0.95, true], [1.15, 0.8, false], [1.38, 0.9, false]];
  for (const [cx, len, rot] of pos) g += zopf(cx, len, rot);
  /* Trockenblumen-Sträuße dazwischen */
  for (const cx of [0.1]) { g += `<path d="M${cx} -1.98 L${cx} -1.4" stroke="#7a8a4a" stroke-width=".03"/>`; for (let i = 0; i < 9; i++) g += `<circle cx="${r(cx - 0.14 + rnd() * 0.28)}" cy="${r(-1.42 + rnd() * 0.22)}" r=".04" fill="${["#d9b23a", "#b8435a", "#e8e0c8", "#8c5aa8"][i % 4]}"/>`; }
  S.teil({ id: "zwiebelzopf", de: "der Zwiebelzopf", syl: "ZWIE-bel-zopf", it: "la treccia di cipolle", itSyl: "TREC-cia di ci-POL-le", en: "onion braid", x: r(x), y: r(y), steht: true,
    kunst: `<g transform="scale(${u.toFixed(4)})">${g}${flaeche(-1.45, -2.0, 1, 1.05, 0.05)}${flaeche(0.45, -2.0, 1.05, 1.05, 0.05)}</g>`,
    tipp: "Zwiebelzöpfe sind das Wahrzeichen des Weimarer Zwiebelmarkts. Den Markt gibt es seit 1653." });
  /* DIE ZWIEBEL: Kisten mit losen Zwiebeln auf der Theke */
  let z = "";
  for (const [cx, rot] of [[0.35, false], [1.05, true]]) {
    z += `<path d="M${cx - 0.32} -.95 L${cx + 0.32} -.95 L${cx + 0.3} -1.12 L${cx - 0.3} -1.12 Z" fill="#b9874f"/>`;
    for (let i = 0; i < 7; i++) z += `<ellipse cx="${r(cx - 0.24 + (i % 4) * 0.16 + (i > 3 ? 0.08 : 0))}" cy="${r(-1.16 - (i > 3 ? 0.09 : 0))}" rx=".085" ry=".075" fill="url(#${S.id(rot ? "zwrot" : "zwgelb")})"/>`;
  }
  S.teil({ oben: true, id: "zwiebel", de: "die Zwiebel", syl: "ZWIE-bel", it: "la cipolla", itSyl: "ci-POL-la", en: "onion", x: r(x), y: r(y), steht: true,
    kunst: `<g transform="scale(${u.toFixed(4)})">${z}${flaeche(0, -1.32, 1.4, 0.4, 0.05)}</g>` });
}

/* =====================================================================
   9 — DER GRILL mit Thüringer Rostbratwürsten (rechts), DER VERKÄUFER
   ===================================================================== */
const GR = { D: 12.5, X: 4.5 };
{
  const u = sk(GR.D), x = xG(GR.D, GR.X), y = yG(GR.D);
  bodenSchatten(GR.D, GR.X, 2.8, 2.6, 0.26);
  let g = "";
  /* Bratwurstbude: Holzhütte mit Satteldach, vorn der Holzkohlegrill (Rost) */
  g += `<rect x="-1.4" y="-2.45" width="2.8" height="2.45" fill="${HOLZ}"/>`;
  for (let i = 0; i < 9; i++) g += `<path d="M${r(-1.4 + i * 0.35)} -2.45 V0" stroke="#5e3d20" stroke-width=".02"/>`;
  g += `<rect x="-1.15" y="-2.1" width="2.3" height="1.05" fill="#3a2a1c"/>`;
  g += `<path d="M-1.65 -2.4 L0 -3.1 L1.65 -2.4 Z" fill="${S.lg("hdach", [[0, "#3d6b48"], [1, "#24432c"]])}"/><path d="M-1.65 -2.4 L0 -3.1 L1.65 -2.4" stroke="#1d2f21" stroke-width=".05" fill="none"/>`;
  g += `<rect x="-1.1" y="-2.95" width="2.2" height=".34" rx=".04" fill="#f4ecd8" stroke="#2f5a32" stroke-width=".03"/><text x="0" y="-2.71" font-size=".2" text-anchor="middle" fill="#2f5a32" font-family="Georgia,serif" font-weight="bold">Thüringer Rostbratwurst</text>`;
  /* Grill: Stahlwanne auf Beinen, Glut, Rost */
  g += `<path d="M-1.2 -.95 L1.2 -.95 L1.05 -.7 L-1.05 -.7 Z" fill="#2b2e31"/>`;
  for (const lx of [-0.95, 0.95]) g += `<path d="M${lx} -.7 L${lx * 1.05} 0" stroke="#2b2e31" stroke-width=".05"/>`;
  g += `<rect x="-1.15" y="-1.02" width="2.3" height=".08" fill="${S.lg("glut", [[0, "#ff9a3c"], [1, "#c2361a"]], 0, 0, 1, 0)}"/>`;
  g += `<path d="M-1.2 -1.04 H1.2" stroke="#7c8389" stroke-width=".02"/>`;
  S.teil({ id: "grill", de: "der Grill", syl: "GRILL", it: "la griglia", itSyl: "GRI-glia", en: "grill", x: r(x), y: r(y), steht: true,
    kunst: `<g transform="scale(${u.toFixed(4)})">${g}</g>`, tipp: "Die Thüringer Rostbratwurst wird auf einem Rost über Holzkohle gegrillt." });
}
{
  const V2 = mensch("V2", { id: "wmr_grill", geschlecht: "m", blick: -20, frisur: "kurz", haarfarbe: "dunkelbraun", haut: "hell", pose: "halten",
    kleidung: { oberteil: { stueck: "tshirt", farbe: "schwarz" }, schuerze: { stueck: "schuerze", farbe: "weiss" }, unterteil: { stueck: "hose", farbe: "schwarz" }, schuhe: { stueck: "halbschuh" }, kopf: { stueck: "kappe", farbe: "rot" } } }, 1.78, GR.D + 0.6, GR.X - 0.1, 2);
  const theke = yG(GR.D, 1.0);
  S.def(`<clipPath id="${S.id("hinterGrill")}"><rect x="-60" y="-120" width="120" height="${r(theke - V2.y + 120)}"/></clipPath>`);
  S.teil({ id: "verkaeufer", de: "der Verkäufer", syl: "ver-KÄU-fer", it: "il venditore", itSyl: "ven-di-TO-re", en: "salesman", x: V2.x, y: V2.y,
    kunst: `<g clip-path="url(#${S.id("hinterGrill")})">${V2.svg}</g>`, tipp: "Der Verkäufer fragt: „Mit Senf?“" });
}
{
  /* Würste auf dem Rost und Rauch */
  const u = sk(GR.D), x = xG(GR.D, GR.X), y = yG(GR.D);
  let g = "";
  for (let i = 0; i < 7; i++) {
    const wx = -0.95 + i * 0.3;
    g += `<rect x="${r(wx)}" y="-1.09" width=".26" height=".07" rx=".035" fill="${S.lg("wurst", [[0, "#c9773a"], [0.5, "#9a4f22"], [1, "#6e3414"]])}"/>`;
    g += `<path d="M${r(wx + 0.06)} -1.08 l.04 .05 M${r(wx + 0.14)} -1.08 l.04 .05" stroke="#3a1a0a" stroke-width=".012"/>`;
  }
  S.davor(`<g transform="translate(${r(x)} ${r(y)}) scale(${u.toFixed(4)})" pointer-events="none"><g filter="url(#${S.id("rauch")})" opacity=".55"><path d="M-.6 -1.2 Q-.9 -1.8 -.5 -2.3 Q-.1 -2.8 -.5 -3.4 L-.1 -3.4 Q.3 -2.8 0 -2.3 Q-.3 -1.8 .1 -1.2 Z" fill="#e8e6e2"/></g></g>`);
  S.teil({ oben: true, id: "rostbratwurst", de: "die Rostbratwurst", syl: "ROST-brat-wurst", it: "la salsiccia alla griglia", itSyl: "sal-SIC-cia AL-la GRI-glia", en: "grilled sausage", x: r(x), y: r(y), steht: true,
    kunst: `<g transform="scale(${u.toFixed(4)})">${g}${flaeche(-1.05, -1.25, 2.1, 0.32, 0.05)}</g>`,
    tipp: "Die Thüringer Rostbratwurst isst man im Brötchen — mit Senf, ohne Ketchup." });
}

/* =====================================================================
   10 — DIE LITFASSSÄULE mit dem Bauhaus-Plakat (links vorn)
   ===================================================================== */
const LS = { D: 8.6, X: -6.0 };
{
  const u = sk(LS.D), x = xG(LS.D, LS.X), y = yG(LS.D);
  bodenSchatten(LS.D, LS.X, 1.2, 3.6, 0.28);
  let g = "";
  const R = 0.6;
  g += `<rect x="${-R - 0.05}" y="-.3" width="${2 * R + 0.1}" height=".3" fill="#2f4a3a"/>`;
  g += `<rect x="${-R}" y="-3.2" width="${2 * R}" height="2.9" fill="${S.lg("saeulenrund", [[0, "#e8e2d4"], [0.35, "#f7f3ea"], [1, "#a7a092"]], 0, 0, 1, 0)}"/>`;
  /* Bauhaus-Plakat: Kreis, Quadrat, Dreieck in den Grundfarben */
  g += `<rect x="-.48" y="-3.0" width=".7" height="1.05" fill="#f2efe6"/>`;
  g += `<circle cx="-.3" cy="-2.72" r=".14" fill="#d23b2a"/><rect x="-.15" y="-2.62" width=".26" height=".26" fill="#2f5aa8"/><path d="M-.4 -2.2 L-.2 -2.52 L0 -2.2 Z" fill="#f2c230"/>`;
  g += `<text x="-.13" y="-2.08" font-size=".09" text-anchor="middle" fill="#1d1d1d" font-family="Arial,sans-serif" font-weight="bold">bauhaus museum</text><text x="-.13" y="-1.99" font-size=".07" text-anchor="middle" fill="#1d1d1d" font-family="Arial,sans-serif">weimar</text>`;
  /* zweites Plakat: Theaterplakat „Faust“ */
  g += `<rect x=".26" y="-2.95" width=".3" height="1.0" fill="#1f2a44"/><text x=".41" y="-2.6" font-size=".09" text-anchor="middle" fill="#f2c230" font-family="Georgia,serif" font-weight="bold">FAUST</text><text x=".41" y="-2.48" font-size=".05" text-anchor="middle" fill="#e8e0c8" font-family="Arial">DNT Weimar</text>`;
  g += `<rect x="-.48" y="-1.8" width="1.0" height=".95" fill="#e9b24a"/><text x=".02" y="-1.4" font-size=".11" text-anchor="middle" fill="#6a2a12" font-family="Georgia,serif" font-weight="bold">Zwiebelmarkt</text><text x=".02" y="-1.25" font-size=".07" text-anchor="middle" fill="#6a2a12" font-family="Arial">9.–11. Oktober</text>`;
  g += `<rect x="${-R}" y="-3.2" width="${2 * R}" height="2.9" fill="${S.lg("rundlicht", [[0, "#000", 0.08], [0.3, "#fff", 0.12], [0.6, "#000", 0], [1, "#000", 0.3]], 0, 0, 1, 0)}"/>`;
  /* Gesims und Kuppeldach mit Spitze */
  g += `<rect x="${-R - 0.08}" y="-3.36" width="${2 * R + 0.16}" height=".18" fill="#2f4a3a"/>`;
  g += `<path d="M${-R - 0.02} -3.36 Q${-R} -3.8 0 -3.86 Q${R} -3.8 ${R + 0.02} -3.36 Z" fill="${S.lg("lsdach", [[0, "#4f7a5e"], [1, "#24402e"]], 0, 0, 1, 0)}"/><path d="M0 -3.86 V-4.05" stroke="#24402e" stroke-width=".05"/><circle cx="0" cy="-4.08" r=".05" fill="#c9a54a"/>`;
  S.teil({ id: "litfasssaeule", de: "die Litfaßsäule", syl: "LIT-faß-säu-le", it: "la colonna delle affissioni", itSyl: "co-LON-na DEL-le af-fis-SIO-ni", en: "advertising column", x: r(x), y: r(y), steht: true,
    kunst: `<g transform="scale(${u.toFixed(4)})">${g}</g>`, tipp: "Die Litfaßsäule hat Ernst Litfaß 1855 in Berlin erfunden.",
    zoom: { x: r(x - 0.95 * u), y: r(y - 3.25 * u), w: r(1.9 * u), h: r(1.3 * u) },
    unter: [{ id: "plakat", de: "das Plakat", syl: "pla-KAT", it: "il manifesto", itSyl: "ma-ni-FE-sto", en: "poster", x: r(x - 0.13 * u), y: r(y - 1.95 * u),
      kunst: flaeche(-0.35 * u, -1.05 * u, 0.7 * u, 1.05 * u, 0.4), tipp: "Das Bauhaus wurde 1919 in Weimar gegründet. Kreis, Quadrat und Dreieck sind typisch für das Bauhaus-Design." }] });
}

/* =====================================================================
   11 — DIE STUDENTIN mit dem BUCH (gelbes Reclam-Heft)
   ===================================================================== */
const ST = mensch("ST", { id: "wmr_stud", geschlecht: "w", blick: 40, frisur: "locken", haarfarbe: "dunkelbraun", haut: "mittel",
  pose: { lende: 1, brust: -1, nacken: 22, kopf: 14, schulterL: { vor: 22, seit: 12 }, ellbogenL: 92, unterarmL: 50, handL: 4, fingerL: 0.5,
    schulterR: { vor: 20, seit: 13 }, ellbogenR: 95, unterarmR: 50, handR: 4, fingerR: 0.5,
    huefteL: { vor: 3, seit: 3, dreh: -6 }, knieL: 3, fussL: 0, huefteR: { vor: -5, seit: 4, dreh: -10 }, knieR: 9, fussR: 5 },
  kleidung: { oberteil: { stueck: "pullover", farbe: "blau" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" }, zubehoer: { stueck: "schal", farbe: "gelb" } } }, 1.68, 10.5, -1.75);
{
  bodenSchatten(10.5, -1.75, 0.45, 1.68, 0.26);
  S.teil({ id: "studentin", de: "die Studentin", syl: "stu-DEN-tin", it: "la studentessa", itSyl: "stu-den-TES-sa", en: "student", x: ST.x, y: ST.y, kunst: ST.svg,
    tipp: "Die Studentin liest „Faust“ von Goethe." });
}

/* =====================================================================
   13 — DER TOURIST mit einer Rostbratwurst im Brötchen
   ===================================================================== */
const TO = mensch("TO", { id: "wmr_tour", geschlecht: "m", blick: -32, frisur: "kurz", haarfarbe: "blond", haut: "hell", laecheln: true,
  pose: { lende: 1, brust: -2, nacken: 6, kopf: 4, schulterL: { vor: 3, seit: 8 }, ellbogenL: 14, unterarmL: 10, handL: 6, fingerL: 0.38,
    schulterR: { vor: 40, seit: 18, dreh: 20 }, ellbogenR: 110, unterarmR: 40, handR: 10, fingerR: 0.7,
    huefteL: { vor: 6, seit: 3, dreh: -6 }, knieL: 4, fussL: 0, huefteR: { vor: -3, seit: 2.5, dreh: -6 }, knieR: 2, fussR: 0 },
  kleidung: { oberteil: { stueck: "tshirt", farbe: "grau" }, jacke: { stueck: "jacke", farbe: "rot" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" }, zubehoer: { stueck: "rucksack", farbe: "blau" } } }, 1.8, 10, 2.2);
{
  bodenSchatten(10, 2.2, 0.5, 1.8, 0.26);
  S.teil({ id: "tourist", de: "der Tourist", syl: "tou-RIST", it: "il turista", itSyl: "tu-RI-sta", en: "tourist", x: TO.x, y: TO.y, kunst: TO.svg,
    tipp: "Der Tourist isst eine Rostbratwurst. Lecker!" });
  const h = TO.p(TO.m.z.handR);
  let g = `<path d="M-3.4 -.3 Q0 1.3 3.4 -.3 L3 .5 Q0 1.9 -3 .5 Z" fill="#e2b06a"/>`;
  g += `<rect x="-4.4" y="-1.25" width="8.8" height="1.25" rx=".62" fill="${S.lg("wurst2", [[0, "#c9773a"], [0.5, "#9a4f22"], [1, "#6e3414"]])}"/>`;
  g += `<path d="M-2.4 -1.1 l.4 .8 M-.6 -1.1 l.4 .8 M1.2 -1.1 l.4 .8" stroke="#3a1a0a" stroke-width=".18"/><path d="M-3.4 -.9 Q0 -.4 3.2 -.9" stroke="#e9c13a" stroke-width=".35" fill="none"/>`;
  g += `<path d="M-3.6 -.2 Q0 -1.4 3.6 -.2 Q3.2 .3 0 .1 Q-3.2 .3 -3.6 -.2 Z" fill="#d9a35a"/>`;
  S.teil({ oben: true, id: "broetchen", de: "das Brötchen", syl: "BRÖT-chen", it: "il panino", itSyl: "pa-NI-no", en: "bread roll", x: r(h.x), y: r(h.y - 0.6), kunst: g + flaeche(-4.8, -1.8, 9.6, 3.4, 0.5),
    tipp: "Zur Rostbratwurst gehört ein Brötchen. Die Wurst ist immer länger als das Brötchen." });
}
{
  /* das Buch (gelbes Reclam-Heft) in den Händen der Studentin */
  const hs = [ST.m.z.handL, ST.m.z.handR].map((q) => ST.p(q));
  const hx = (hs[0].x + hs[1].x) / 2, hy = (hs[0].y + hs[1].y) / 2;
  const g = `<path d="M-2.4 -1.6 L0 -1.2 L2.4 -1.6 L2.4 1.4 L0 1.8 L-2.4 1.4 Z" fill="#f2c230" stroke="#b88a10" stroke-width=".15"/><path d="M0 -1.2 V1.8" stroke="#b88a10" stroke-width=".15"/><path d="M-1.9 -.8 H-.6 M-1.9 -.3 H-.4 M.5 -.6 H1.9" stroke="#6a4a10" stroke-width=".15"/>`;
  S.teil({ oben: true, id: "buch", de: "das Buch", syl: "BUCH", it: "il libro", itSyl: "LI-bro", en: "book", x: r(hx), y: r(hy - 0.4), kunst: g + flaeche(-2.7, -2, 5.4, 4, 0.5),
    tipp: "Goethe und Schiller haben in Weimar viele berühmte Bücher geschrieben." });
}

/* Der Platz: Granitpflaster in Reihen, die zum Theater fluchten, dazu alle Schatten */
{
  let k = `<path d="M0 ${r(yG(80))} L400 ${r(yG(80))} L400 260 L0 260 Z" fill="${S.lg("pflaster", [[0, "#b1a89b"], [1, "#958b7e"]])}"/>`;
  /* Querfugen (näher = weiter auseinander) und Längsfugen zum Fluchtpunkt */
  let fugen = "";
  for (let D = 8; D < 80; D *= 1.07) fugen += `M0 ${r(yG(D))} H400 `;
  for (let X = -40; X <= 40; X += 1.2) {
    /* Längsfuge vom Horizont nach vorn, am Bildrand abgeschnitten */
    let [ax, ay, bx, by] = [xG(80, X), yG(80), xG(6, X), yG(6)];
    if (by > 260) { const t = (260 - ay) / (by - ay); bx = ax + (bx - ax) * t; by = 260; }
    if (bx < 0 || bx > 400) { const xr = bx < 0 ? 0 : 400; const t = (xr - ax) / (bx - ax); if (t <= 0) continue; by = ay + (by - ay) * t; bx = xr; }
    if (ax < 0 || ax > 400) continue;
    fugen += `M${r(ax)} ${r(ay)} L${r(bx)} ${r(by)} `;
  }
  k += `<path d="${fugen}" stroke="#7a7064" stroke-width=".22" fill="none" opacity=".6"/>`;
  {
    const z = zufall(9);
    let t = "";
    for (let i = 0; i < 16; i++) t += `<rect x="${r(z() * 8)}" y="${r(z() * 3)}" width="${r(0.6 + z() * 1.2)}" height=".3" fill="${i % 2 ? "#c2b8aa" : "#857b6e"}"/>`;
    S.def(`<pattern id="${S.id("stein")}" patternUnits="userSpaceOnUse" width="8" height="3">${t}</pattern>`);
    k += `<path d="M0 ${r(yG(30))} L400 ${r(yG(30))} L400 260 L0 260 Z" fill="url(#${S.id("stein")})" opacity=".35"/>`;
  }
  /* Bänder aus hellem Granit, die das Denkmal einfassen */
  const ring = (rad) => { const p = []; for (let i = 0; i <= 40; i++) { const w = i / 40 * Math.PI * 2, X = rad * Math.sin(w), D = DD - rad * Math.cos(w); p.push(`${r(xG(D, X))} ${r(yG(D))}`); } return "M" + p.join(" L") + " Z"; };
  k += `<g filter="url(#${S.id("schw")})">${schattenListe.join("")}</g>`;
  k += `<rect x="0" y="${r(yG(80))}" width="400" height="${r(260 - yG(80))}" fill="${S.lg("platzlicht", [[0, "#000", 0.08], [0.3, "#000", 0], [1, "#fff4dc", 0.1]])}"/>`;
  PLATZ.t.kunst = k;
  /* der Platz ist Bodenfläche: ganz nach unten in der Reihenfolge */
  S.teile.splice(S.teile.indexOf(PLATZ.t), 1);
  S.teile.unshift(PLATZ.t);
}

/* Ein Hauch Morgenlicht über allem (fängt keinen Tipp ab) */
S.davor(`<rect width="400" height="260" fill="${S.rg("licht", [[0, "#fff0c8", 0.12], [0.6, "#fff0c8", 0], [1, "#000", 0.05]], 0.0, 0.8, 1.1)}" pointer-events="none"/>`);

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/weimar.js"));
console.log(aus);
