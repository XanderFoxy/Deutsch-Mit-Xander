#!/usr/bin/env node
/* =====================================================================
   HEIDELBERG (FASSUNG 854) — Bilderwelt neu: eine echte Stadtansicht
   ---------------------------------------------------------------------
   RECHERCHE (Staatliche Schlösser und Gärten „Schloss Heidelberg“,
   Monumentbroschüre; heidelberg.de Kinderstadtplan „Schlossgeschichte“
   und „Gebäude“; Structurae „Karl-Theodor-Brücke“, „Brückentor“;
   Altstadt-Information „Brückenaffe“; Bergbahn Heidelberg; Café Knösel):
   - STANDORT: Philosophenweg beim Philosophengärtchen (Südhang des
     Heiligenbergs, ≈ 49,4160 N / 8,7060 O, Augenhöhe ≈ 89 m über dem
     Neckar), Blick nach Südosten (Bildmitte 134°). Echte Peilungen und
     Entfernungen: Brücke Nordende 112° / 390 m (läuft links aus dem
     Bild), Brückentor 137° / 490 m, Schloss (Friedrichsbau) 132° /
     900 m, Heiliggeistkirche 145° / 500 m, Molkenkur 147° / 1,1 km,
     Königstuhl-Gipfel 145° / 2,3 km (568 m, mit Fernmeldeturm).
     Alles Ferne wird mit dieser Kamera gerechnet (Meter → Bild). Die
     Kirchturmspitze (82 m) liegt deshalb fast auf Augenhöhe, das Schloss
     thront darüber. Schloss etwa 1,35-fach, Brückentor 1,25-fach betont;
     unten im Bild sind die Abstände leicht gestaucht, damit Neckar,
     Neuenheimer Ufer und der Weinberg unter der Mauer nebeneinander Platz
     haben.
   - ALTE BRÜCKE (Karl-Theodor-Brücke, 1786–88): rund 200 m lang, 7 m
     breit, neun Bögen aus rotem Neckartäler Sandstein; Denkmäler von
     Kurfürst Karl Theodor und der Göttin Minerva auf Pfeilern; Laternen.
   - BRÜCKENTOR: zwei runde Tortürme, weiß verputzt, Sandsteingesimse,
     seit 1788 barocke Schieferhauben; 28 m. Westlich davon auf
     Straßenhöhe der BRÜCKENAFFE aus Bronze (Gernot Rumpf, 1979) mit
     Spiegel, daneben zwei Bronzemäuse.
   - SCHLOSS (Ruine, roter Sandstein), von Nordwesten von links nach rechts:
     Glockenturm (Nordostecke, oben offenes Achteck), Gläserner Saalbau,
     Friedrichsbau (1601–07, wieder mit Dach, Ziergiebel), davor der
     Altan, Fassbau, Englischer Bau, Dicker Turm (Nordwestecke, 7 m
     dicke Mauern, gesprengt, seitdem halb offen; außen Nischenfiguren).
     Krautturm (Südostecke) und Ottheinrichsbau (Hoffassade) sind von hier
     verdeckt — steht im Tipp.
   - HEILIGGEISTKIRCHE: Hallenkirche, sehr steiles Dach mit Gaubenreihen,
     Chor im Osten abgewalmt; Westturm 82 m: Vierkant, Achteck mit Galerie,
     geschweifte Haube, Laterne, kleine Haube.
   - BERGBAHN Kornmarkt – Schloss – Molkenkur – Königstuhl (seit 1890).
   - PHILOSOPHENGÄRTCHEN: mildes Klima, Palmen, Agaven, Zypressen;
     Gedenkstein für Friedrich Hölderlin („Lange lieb ich dich schon …“).
     Der Philosophenweg führte früher durch Weinberge.
   - STUDENTENKUSS: Praline von Café Knösel (seit 1863), Papier mit dem
     Scherenschnitt eines Paares. Universität seit 1386.
   Zeit: Anfang Oktober, später Nachmittag, Sonne tief aus Westsüdwest
   (rechts hinten): Westseiten leuchten, Nordseiten im weichen Schatten.
   Vorne gilt: Einheiten je Meter = (y − 80) · 0,27.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "heidelberg", titel: "Heidelberg", emoji: "🏰", thema: "Deutschland", kuerzel: "hdb", fassung: 854 });
const rnd = zufall(1386);
/* Verläufe nur einmal anlegen, auch wenn sie in Schleifen gebraucht werden (kleinere Datei) */
{ const L = S.lg, R = S.rg, C = {}; S.lg = (n, ...a) => C["l" + n] || (C["l" + n] = L(n, ...a)); S.rg = (n, ...a) => C["r" + n] || (C["r" + n] = R(n, ...a)); }
const r = B.r;
const HOR = 80;
const km = (y) => (y - HOR) * 0.27;

/* ---------- Kamera: Meter (Ost e, Nord n, Höhe z über dem Neckar) ---------- */
const FOC = 400, EYE = 89, BL = 134 * Math.PI / 180;
const FV = [Math.sin(BL), Math.cos(BL)], RV = [Math.cos(BL), -Math.sin(BL)];
/* sanfte Stauchung unten (y > 118), damit Fluss, Ufer und Vordergrund Platz haben */
const Y0 = 118, WL = 50, WK = 0.35;
const W = (y) => { const d = y - Y0; if (d <= 0) return y; if (d <= WL) return Y0 + d - WK * d * d / (2 * WL); return Y0 + WL - WK * WL / 2 + (d - WL) * (1 - WK); };
const tief = (e, n) => e * FV[0] + n * FV[1];
const proj = (e, n, z) => { const f = e * FV[0] + n * FV[1], l = e * RV[0] + n * RV[1]; return [160 + FOC * l / f, W(HOR + FOC * (EYE - z) / f)]; };
const P = (p) => `${r(p[0])} ${r(p[1])}`;
/* Polygone am Bildrand beschneiden (nichts ragt hinaus; die Trefferflächen bleiben im Bild) */
const RAHMEN = [-0.4, -0.4, 320.4, 200.4];
const randClip = (pts) => {
  let out = pts;
  const kanten = [[(p) => p[0] >= RAHMEN[0], 0, RAHMEN[0]], [(p) => p[0] <= RAHMEN[2], 0, RAHMEN[2]], [(p) => p[1] >= RAHMEN[1], 1, RAHMEN[1]], [(p) => p[1] <= RAHMEN[3], 1, RAHMEN[3]]];
  for (const [innen, ax, g] of kanten) {
    const inp = out; out = [];
    for (let i = 0; i < inp.length; i++) {
      const a = inp[i], b = inp[(i + 1) % inp.length], schnitt = () => { const t = (g - a[ax]) / (b[ax] - a[ax]); return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; };
      if (innen(a)) { out.push(a); if (!innen(b)) out.push(schnitt()); } else if (innen(b)) out.push(schnitt());
    }
    if (!out.length) break;
  }
  return out;
};
const linieClip = (pts) => {
  const out = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], drin = (p) => p[0] >= RAHMEN[0] && p[0] <= RAHMEN[2];
    if (drin(a)) out.push(a);
    const b = pts[i + 1];
    if (b && drin(a) !== drin(b)) { const g = (drin(a) ? b : a)[0] < RAHMEN[0] ? RAHMEN[0] : RAHMEN[2], t = (g - a[0]) / (b[0] - a[0]); out.push([g, a[1] + (b[1] - a[1]) * t]); }
  }
  return out;
};
const pfad = (pts, zu = true) => { const q = zu ? randClip(pts) : linieClip(pts); return q.length > 1 ? "M" + q.map(P).join(" L") + (zu ? " Z" : "") : ""; };
/* Figuren klein im Bild: Pfaddaten auf ganze Einheiten runden (unsichtbar, halbiert die Datei) */
const rundeFigur = (svg) => {
  const k = +((svg.match(/scale\(([\d.]+)\)/) || [0, 1])[1]), lim = .1 / k;
  return svg.replace(/<path(?=[^>]*fill="none")[^>]*stroke-width="([\d.]+)"[^>]*\/>/g, (m, w) => (+w < lim ? "" : m))
    .replace(/ d="([^"]*)"/g, (m, d) => ` d="${d.replace(/-?\d+\.\d+/g, (n) => String(Math.round(+n)))}"`)
    .replace(/<(\w+)[^>]*>/g, (tag, n) => (/Gradient$/.test(n) && !/userSpaceOnUse/.test(tag) ? tag
      : tag.replace(/ (x1|y1|x2|y2|cx|cy|r|rx|ry|fx|fy)="(-?[\d.]+)"/g, (m, a, v) => ` ${a}="${Math.abs(+v) < 3 ? Math.round(+v * 10) / 10 : Math.round(+v * 2) / 2}"`)));
};

S.def(`<filter color-interpolation-filters="sRGB" id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter color-interpolation-filters="sRGB" id="${S.id("spiegel")}" x="-10%" y="-30%" width="120%" height="160%"><feGaussianBlur stdDeviation=".7 1.1"/></filter>`);
S.def(`<filter color-interpolation-filters="sRGB" id="${S.id("dunst")}" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>`);
/* roter Neckartäler Sandstein: Nordseiten im Schatten, Westseiten in der Abendsonne */
const ROT_N = S.lg("rotn", [[0, "#7e3628"], [0.6, "#94432f"], [1, "#a24d37"]], 0, 0, 1, 0);
const ROT_W = S.lg("rotw", [[0, "#d27454"], [1, "#efa47a"]], 0, 0, 1, 0);
const ROT_D = S.lg("rotd", [[0, "#6c2e25"], [1, "#94443a"]], 0, 0, 1, 0);
const RUINE = S.lg("ruine", [[0, "#7a3428"], [0.55, "#9a4733"], [1, "#b65a40"]], 0, 0, 1, 0);
const SCHIEFER = S.lg("schiefer", [[0, "#353b44"], [0.6, "#4f5864"], [1, "#77818c"]], 0, 0, 1, 0);
const PUTZ = S.lg("putz", [[0, "#bdb6a8"], [0.5, "#e6e1d5"], [1, "#fff6e4"]], 0, 0, 1, 0);
const LOCH = "#2a1c18";
S.def(`<pattern id="${S.id("quader")}" width="3" height="1.8" patternUnits="userSpaceOnUse"><path d="M0 .9 H3 M0 1.8 H3 M.8 0 V.9 M2.3 .9 V1.8" stroke="#3a140e" stroke-width=".14" opacity=".38"/></pattern>`);
const QUADER = `url(#${S.id("quader")})`;

/* =====================================================================
   KULISSE — Himmel (Oktoberabend), Wolken unten warm angestrahlt, ferne Höhen
   ===================================================================== */
S.hinten(`<rect width="320" height="150" fill="${S.lg("himmel", [[0, "#3c6eb0"], [0.45, "#86a8d0"], [0.8, "#d8c8c0"], [1, "#f4d2a8"]], 0, 0, 0, 62, ' gradientUnits="userSpaceOnUse"')}"/>`);
/* tiefe Sonne rechts hinten (Westsüdwest): warmes Leuchten im Himmel nach rechts unten */
S.hinten(`<rect width="320" height="150" fill="${S.rg("abendglut", [[0, "#ffd49a", 0.75], [0.45, "#ffc8a0", 0.3], [1, "#ffc8a0", 0]], 1.05, 0.45, 0.7)}"/>`);
{
  let w = "";
  /* Schönwetterwolken, klar gezeichnet: Unterseite warm angestrahlt, rechte Kanten golden, links bläulicher Schatten */
  for (const [x, y, s] of [[44, 13, 0.85], [150, 7, 1.05], [292, 11, 0.8], [98, 30, 0.5], [14, 36, .55]]) {
    const K = [[0, -3, 6], [-8, -.8, 4.4], [8.5, -1.2, 4.8], [-14, 1.2, 2.9], [14.5, 1, 3.1], [-3.5, -5.3, 4], [4.5, -4.8, 3.4]];
    const kreis = (dx, dy, rr) => `M${r(x + (dx - rr) * s)} ${r(y + dy * s)}a${r(rr * s)} ${r(rr * s)} 0 1 0 ${r(2 * rr * s)} 0a${r(rr * s)} ${r(rr * s)} 0 1 0 ${r(-2 * rr * s)} 0`;
    const basis = `M${r(x - 16.5 * s)} ${r(y + 3.4 * s)}H${r(x + 17 * s)}a${r(1.4 * s)} ${r(1.1 * s)} 0 0 0 0 ${r(-2.2 * s)}H${r(x - 16.5 * s)}a${r(1.4 * s)} ${r(1.1 * s)} 0 0 0 0 ${r(2.2 * s)}`;
    w += `<path d="${K.map(([a, b, c]) => kreis(a, b + .9, c)).join("")}${basis}" fill="#f2c49e"/>`;
    w += `<path d="${K.map(([a, b, c]) => kreis(a - .7, b - .3, c * .92)).join("")}" fill="#c8c4d4"/>`;
    w += `<path d="${K.map(([a, b, c]) => kreis(a + .2, b - .7, c * .86)).join("")}" fill="#fbf6f2"/>`;
    w += `<path d="${K.slice(0, 3).map(([a, b, c]) => kreis(a + 1.4, b - 1.3, c * .5)).join("")}" fill="#fff4e2"/>`;
  }
  S.hinten(w);
  /* ferne Odenwaldhöhen im Neckartal (links, Osten), im Dunst */
  S.hinten(`<path d="M0 44 Q16 40 34 44 Q52 47 70 42 Q86 38 100 44 L100 130 L0 130 Z" fill="#a9b8c0"/><path d="M0 52 Q22 47 44 52 Q60 55 76 51 L80 130 L0 130 Z" fill="#94a8a6"/>`);
}

/* =====================================================================
   1 — DER KÖNIGSTUHL (Wald mit Kuppen, Rinnen, Fernmeldeturm)
   ===================================================================== */
const kamm = [[0, 58], [20, 50], [45, 40], [75, 31], [105, 25], [140, 21], [175, 18], [205, 16], [235, 14.5], [258, 15.5], [282, 19], [302, 23], [320, 26]];
const kammY = (x) => { for (let i = 1; i < kamm.length; i++) if (x <= kamm[i][0]) { const [a, ya] = kamm[i - 1], [b, yb] = kamm[i]; return ya + (yb - ya) * (x - a) / (b - a); } return kamm[kamm.length - 1][1]; };
{
  /* Baumkronen als Muster, ohne Herbstfarben (die stehen frei verteilt), gedreht gegen sichtbare Raster */
  const kronen = (n, w, h, r0, r1, farben, licht) => {
    let m = "";
    for (let i = 0; i < n; i++) {
      const cx = rnd() * w, cy = rnd() * h, rr = r0 + rnd() * (r1 - r0), f = farben[Math.floor(rnd() * farben.length)];
      for (const [dx, dy] of [[0, 0], [w, 0], [-w, 0], [0, h], [0, -h], [w, h], [-w, -h], [w, -h], [-w, h]]) {
        if (cx + dx < -rr || cx + dx > w + rr || cy + dy < -rr || cy + dy > h + rr) continue;
        /* Krone: dunkler Lappen unten links (Eigenschatten), Hauptkrone, heller Lappen oben rechts (Westsonne) */
        const X = cx + dx, Y = cy + dy;
        m += `<circle cx="${r(X - rr * .18)}" cy="${r(Y + rr * .2)}" r="${r(rr * .9)}" fill="#2c4224" opacity=".55"/><circle cx="${r(X)}" cy="${r(Y)}" r="${r(rr * .85)}" fill="${f}"/>`;
        if (licht) m += `<circle cx="${r(X + rr * .25)}" cy="${r(Y - rr * .25)}" r="${r(rr * .5)}" fill="${licht}" opacity=".28"/>`;
      }
    }
    return m;
  };
  S.def(`<pattern id="${S.id("waldf")}" width="5.3" height="3.7" patternUnits="userSpaceOnUse" patternTransform="rotate(11)"><rect width="5.3" height="3.7" fill="#4a6a3c"/>${kronen(13, 5.3, 3.7, 0.45, 0.9, ["#3f5d34", "#557a42", "#4a6b3a", "#62844a", "#36502e", "#58763c"], "#a9c88a")}</pattern>`);
  S.def(`<pattern id="${S.id("waldg")}" width="11.3" height="7.1" patternUnits="userSpaceOnUse" patternTransform="rotate(-7)">${kronen(13, 11.3, 7.1, 1, 1.6, ["#456a38", "#4e7240", "#5c7f45", "#40603a", "#5f8040"], "#c8d890")}</pattern>`);
  S.def(`<linearGradient id="${S.id("nahg")}" gradientUnits="userSpaceOnUse" x1="0" y1="40" x2="0" y2="96"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient><mask id="${S.id("nah")}"><rect width="320" height="200" fill="url(#${S.id("nahg")})"/></mask>`);
  let d = `M0 ${kammY(0)}`;
  for (let x = 0; x <= 320; x += 1.6) {
    const y = kammY(x + 1.6);
    if (rnd() < 0.12) d += ` L${r(x + 0.5)} ${r(kammY(x) - 0.5)} L${r(x + 0.8)} ${r(kammY(x) - 2.4 - rnd() * 1.2)} L${r(x + 1.1)} ${r(kammY(x) - 0.5)} L${r(x + 1.6)} ${r(y)}`;
    else d += ` Q${r(x + 0.8)} ${r(kammY(x + 0.8) - 0.9 - rnd() * 1)} ${r(x + 1.6)} ${r(y)}`;
  }
  d += ` L320 160 L0 160 Z`;
  let k = `<path d="${d}" fill="url(#${S.id("waldf")})"/><path d="${d}" fill="url(#${S.id("waldg")})" mask="url(#${S.id("nah")})"/>`;
  /* Geländeform: Kuppen und Hangrippen im Licht von rechts, Rinnen im Schatten */
  S.def(`<clipPath id="${S.id("berg")}"><path d="${d}"/></clipPath>`);
  let g = "";
  /* Hangrippen fächern vom Gipfel aus nach unten; Licht von rechts, Rinnen dazwischen (weich) */
  S.def(`<filter color-interpolation-filters="sRGB" id="${S.id("weichberg")}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3.2"/></filter>`);
  let rip = "";
  for (const [x0, x1, w, hell] of [[60, 18, 9, 1], [74, 46, 6, 0], [112, 84, 10, 1], [128, 112, 6, 0], [205, 222, 9, 1], [222, 248, 6, 0], [262, 296, 10, 1], [282, 318, 6, 0], [168, 160, 7, 0]]) {
    const y0 = kammY(x0) + 3;
    continue;
    rip += `<path d="M${x0 - w / 2} ${r(y0)} Q${r((x0 + x1) / 2 - w)} ${r(y0 + 40)} ${r(x1 - w)} 120 L${r(x1 + w)} 120 Q${r((x0 + x1) / 2 + w)} ${r(y0 + 40)} ${x0 + w / 2} ${r(y0)} Z" fill="#0b1808" opacity=".2"/>`;
  }
  g += `<g filter="url(#${S.id("weichberg")})">${rip}</g>`;
  /* der Schlossberg (Jettenbühl): der Hang unter dem Schloss tritt hervor */
  g += `<path d="M104 72 Q128 62 160 64 Q184 66 196 78 Q206 94 214 112 L92 112 Q96 86 104 72 Z" fill="#f2d890" opacity=".14" filter="url(#${S.id("weichberg")})"/>`;
  g += `<path d="${d}" fill="${S.lg("waldluft", [[0, "#e0ccbc", 0.7], [0.28, "#d8c8c0", 0.34], [0.6, "#c8c8c8", 0.08], [1, "#c8c8c8", 0]], 0, 14, 0, 110, ' gradientUnits="userSpaceOnUse"')}"/>`;
  g += `<path d="${d}" fill="${S.lg("waldlicht", [[0, "#10200c", 0.32], [0.45, "#10200c", 0.04], [0.75, "#ffc070", 0.1], [1, "#ffb860", 0.24]], 0, 0, 1, 0)}"/>`;
  k += `<g clip-path="url(#${S.id("berg")})">${g}</g>`;
  /* Herbstlaub: ganze Baumgruppen in Herbstfarben — dieselben Kronen wie im grünen Wald, nur gelb, orange
     und rot; gruppenweise verteilt, nach oben kleiner und blasser */
  S.def(`<pattern id="${S.id("waldh")}" width="5.3" height="3.7" patternUnits="userSpaceOnUse" patternTransform="rotate(11)"><rect width="5.3" height="3.7" fill="#9a7a34"/>${kronen(13, 5.3, 3.7, 0.45, 0.9, ["#b8862e", "#c7702c", "#d9a53a", "#a8963a", "#b85a2a", "#c8a040"], "#ffe0a0")}</pattern>`);
  let hb = "";
  for (let i = 0; i < 90; i++) {
    const x = 10 + rnd() * 300, y = kammY(x) + 4 + Math.pow(rnd(), 0.75) * (114 - kammY(x)), t = Math.min(1, (y - 15) / 90);
    if (x > 108 && x < 186 && y > 48 && y < 100) continue;
    const g = .8 + 2.6 * t * (.6 + rnd() * .6);
    let d2 = "";
    for (let j = 0; j < 3; j++) { const cx = x + (rnd() - .5) * 2.4 * g, cy = y + (rnd() - .5) * 1.2 * g, rr = g * (.5 + rnd() * .5); d2 += `M${r(cx - rr)} ${r(cy)}a${r(rr)} ${r(rr * .8)} 0 1 0 ${r(2 * rr)} 0a${r(rr)} ${r(rr * .8)} 0 1 0 ${r(-2 * rr)} 0`; }
    hb += `<path d="${d2}" fill="url(#${S.id("waldh")})" opacity="${r(.3 + .4 * t)}"/>`;
  }
  k = k.replace(`<g clip-path="url(#${S.id("berg")})">`, `<g clip-path="url(#${S.id("berg")})">${hb}`);
  /* Fernmeldeturm auf dem Gipfel (schlanker Schaft, Betriebsgeschoss, Antenne) */
  {
    const fx = 235.4, fy = 15.2;
    k += `<path d="M${fx - .55} ${fy} L${fx - .3} ${fy - 6.2} L${fx + .3} ${fy - 6.2} L${fx + .55} ${fy} Z" fill="${S.lg("turmbeton", [[0, "#8d969c"], [0.6, "#d8dcde"], [1, "#f4ead8"]], 0, 0, 1, 0)}"/>`;
    k += `<rect x="${fx - .85}" y="${fy - 7.4}" width="1.7" height="1.3" rx=".3" fill="#cfd4d6"/><rect x="${fx - .85}" y="${fy - 7}" width="1.7" height=".35" fill="#4a5560"/>`;
    k += `<path d="M${fx} ${fy - 7.4} V${fy - 11.4}" stroke="#d8d4cc" stroke-width=".32"/><path d="M${fx} ${fy - 9.8} V${fy - 10.6} M${fx} ${fy - 11} V${fy - 11.4}" stroke="#c8302a" stroke-width=".34"/>`;
  }
  S.teil({ id: "koenigstuhl", de: "der Königstuhl", syl: "KÖ-nigs-stuhl", it: "il Königstuhl (monte)", itSyl: "KÖ-nigs-stuhl", en: "Königstuhl (mountain)", x: 0, y: 0, kunst: k,
    tipp: "Der Königstuhl ist 568 Meter hoch und ganz bewaldet. Oben stehen der Fernmeldeturm und eine Sternwarte." });
}

/* =====================================================================
   2 — DIE BERGBAHN (Station Schloss → Molkenkur), Wagen auf halber Strecke
   ===================================================================== */
{
  let k = "";
  const M = proj(624, -912, 184);
  /* Trasse folgt dem Hang: aus dem Wald hinter dem Schloss, ein Stück Tunnel, dann die Schneise */
  const bahn = (t) => { const a = [176, 70], c = [M[0] - 1, M[1] + 4.6], ctrl = [208, 66]; const u = 1 - t; return [u * u * a[0] + 2 * u * t * ctrl[0] + t * t * c[0], u * u * a[1] + 2 * u * t * ctrl[1] + t * t * c[1]]; };
  for (const [t0, t1] of [[0, 0.24], [0.42, 1]]) {
    const L = [], R = [];
    /* Schneise im Wald: heller Wiesenstreifen, an den Rändern Waldschatten; darin Schotterbett und zwei Schienen */
    for (let t = t0; t <= t1 + 1e-6; t += 0.04) { const p = bahn(t), w = 1.6 + t * 1.4; L.push([p[0] - w * .55, p[1] - w * .9]); R.push([p[0] + w * .55, p[1] + w * .9]); }
    k += `<path d="${pfad([...L, ...R.slice().reverse()])}" fill="${S.lg("schneise", [[0, "#7e8a50"], [.5, "#a8ac6c"], [1, "#c8b878"]])}"/>`;
    k += `<path d="${pfad(L, false)}" stroke="#1e3018" stroke-width=".5" opacity=".55" fill="none"/><path d="${pfad(R, false)}" stroke="#e8d8a0" stroke-width=".3" opacity=".6" fill="none"/>`;
    const G = []; for (let t = t0; t <= t1 + 1e-6; t += 0.04) G.push(bahn(t));
    k += `<path d="${pfad(G, false)}" stroke="#9a8a78" stroke-width=".9" fill="none"/><path d="${pfad(G.map(([x, y]) => [x - .15, y - .22]), false)} ${pfad(G.map(([x, y]) => [x + .15, y + .22]), false)}" stroke="#3b3430" stroke-width=".16" fill="none"/>`;
  }
  /* Station Schloss: kurzes Stück Bahnsteig mit Dach am unteren Ende */
  { const p = bahn(0.02); k += `<path d="M${r(p[0] - 2.2)} ${r(p[1] - 1.6)} h4.4 l.6 1 h-5.6 Z" fill="#6b4a3c"/><rect x="${r(p[0] - 2)}" y="${r(p[1] - .6)}" width="4" height="1.4" fill="#e8dcc4"/>`; }
  /* Tunnelportale */
  for (const t of [0.24, 0.42]) { const p = bahn(t); k += `<path d="M${r(p[0] - 1.2)} ${r(p[1] + .8)} q1.2 -2.2 2.4 0 Z" fill="#2a241e"/>`; }
  /* Molkenkur: Ausflugslokal und Bergstation */
  k += `<rect x="${r(M[0] - 6)}" y="${r(M[1] - 3)}" width="12" height="4.6" fill="${PUTZ}"/><path d="M${r(M[0] - 6.6)} ${r(M[1] - 2.7)} L${r(M[0] - 4.6)} ${r(M[1] - 5.6)} L${r(M[0] + 4.6)} ${r(M[1] - 5.6)} L${r(M[0] + 6.6)} ${r(M[1] - 2.7)} Z" fill="#6b4a3c"/>`;
  for (let i = 0; i < 5; i++) k += `<rect x="${r(M[0] - 5 + i * 2.3)}" y="${r(M[1] - 1.8)}" width="1" height="1.5" fill="#4a5560"/>`;
  k += `<rect x="${r(M[0] - 2.6)}" y="${r(M[1] + 1.6)}" width="5" height="2.2" fill="#d9d2c4"/>`;
  /* der Wagen der Molkenkurbahn */
  const p = bahn(0.66), q = bahn(0.7), wink = Math.atan2(q[1] - p[1], q[0] - p[0]) * 180 / Math.PI;
  k += `<g transform="translate(${r(p[0])} ${r(p[1])}) rotate(${r(wink)})"><rect x="-2.6" y="-2.1" width="5.2" height="2.2" rx=".5" fill="${S.lg("wagen", [[0, "#d04a40"], [1, "#8a1f1d"]])}"/><rect x="-2.1" y="-1.7" width="4.2" height=".9" rx=".2" fill="#cfe3ee"/><rect x="-2.6" y="-.1" width="5.2" height=".4" fill="#2b2b2b"/></g>`;
  S.teil({ id: "bergbahn", de: "die Bergbahn", syl: "BERG-bahn", it: "la funicolare", itSyl: "fu-ni-co-LA-re", en: "funicular railway", x: 0, y: 0, kunst: k,
    tipp: "Die Bergbahn fährt vom Kornmarkt hinauf zum Schloss, zur Molkenkur und bis auf den Königstuhl. Ein Teil der Strecke liegt im Tunnel." });
}

/* =====================================================================
   3 — DAS SCHLOSS — echte Lage (≈ 900 m), 1,35-fach betont.
       Lupe: Glockenturm, Friedrichsbau, Altan, Dicker Turm
   ===================================================================== */
const SA = { e: 675, n: -600 }, SE_ = 1.35, SAP = proj(SA.e, SA.n, 89);
const sp = (de, dn, z) => { const p = proj(SA.e + de, SA.n + dn, z); return [SAP[0] + SE_ * (p[0] - SAP[0]), SAP[1] + SE_ * (p[1] - SAP[1])]; };
const SL = {};
{
  let k = "";
  const RL = S.lg("ruinloch", [[0, "#e8d0b4"], [0.45, "#b8a890"], [0.7, "#6a7a4a"], [1, "#3a4030"]]);
  const GLAS = S.lg("schlossglas", [[0, "#ffcf8a"], [0.3, "#5a5e62"], [1, "#2a2e33"]]);
  const quad = (de0, de1, dn, z0, z1) => pfad([sp(de0, dn, z0), sp(de1, dn, z0), sp(de1, dn, z1), sp(de0, dn, z1)]);
  const flaech = (pts, dn, fill) => `<path d="${pfad(pts.map(([de, z]) => sp(de, dn, z)))}" fill="${fill}"/>`;
  const fenster = (de, dn, z, w, h, f, rund) => {
    if (!rund) return flaech([[de - w / 2, z], [de + w / 2, z], [de + w / 2, z + h], [de - w / 2, z + h]], dn, f);
    const pts = [[de - w / 2, z], [de + w / 2, z], [de + w / 2, z + h - w / 2]];
    for (let i = 1; i < 6; i++) { const a = i / 6 * Math.PI; pts.push([de + Math.cos(a) * w / 2, z + h - w / 2 + Math.sin(a) * w / 2]); }
    pts.push([de - w / 2, z + h - w / 2]);
    return flaech(pts, dn, f);
  };
  const moos = (p, s) => `<ellipse cx="${r(p[0])}" cy="${r(p[1])}" rx="${r(1.2 * s)}" ry="${r(.7 * s)}" fill="#4f6a36" opacity=".75"/>`;
  /* Hangfuß unter dem Schloss: Mauern, Terrassen, Bäume */
  k += `<path d="${pfad([sp(-78, 30, 60), sp(-60, 34, 58), sp(-20, 30, 62), sp(20, 30, 62), sp(60, 22, 58), sp(70, 14, 52), sp(70, 14, 40), sp(-78, 30, 40)])}" fill="#476636"/>`;
  /* --- Glockenturm (Nordostecke): mächtiger Unterbau, oben offenes Achteck --- */
  {
    k += `<path d="${quad(40, 57, 10, 56, 96)}" fill="${ROT_N}"/><path d="${quad(40, 57, 10, 56, 96)}" fill="${QUADER}"/>`;
    k += `<path d="${quad(55.6, 57, 10, 56, 96)}" fill="#5a2418" opacity=".5"/>`;
    k += fenster(49, 10, 70, 1.6, 2.8, LOCH) + fenster(46, 10, 84, 1.6, 2.6, LOCH) + fenster(52, 10, 88, 1.6, 2.6, LOCH);
    k += `<path d="${quad(39.4, 57.6, 10, 95.6, 97.4)}" fill="#c97a5e"/>`;
    /* Achteck: Nordseite und Nordwestseite, zwei Geschosse offener Bögen, oben ausgebrochen */
    const top = [[43, 118], [44, 120.6], [45.6, 119.8], [47.2, 122.4], [49.2, 121.4], [51, 123.6], [52.6, 121.8], [54, 119.6]];
    k += flaech([[43, 97.4], [54, 97.4], ...top.slice().reverse()], 10, ROT_N);
    k += flaech([[43, 97.4], [43, 118], [44, 120.6], [44, 97.4]], 10, "#3a1610");
    k += `<path d="${pfad([sp(43, 10, 97.4), sp(43, 6, 97.4), sp(43, 6, 118.6), sp(43, 10, 118)])}" fill="${S.lg("glockw", [[0, "#b8603f"], [1, "#d8825e"]], 0, 0, 1, 0)}"/>`;
    for (const [z, h] of [[99.6, 7.2], [109.4, 7.4]]) for (const de of [45.4, 48.5, 51.6]) k += fenster(de, 10, z, 1.9, h, RL, true);
    for (const [z, h] of [[99.6, 7.2], [109.4, 7.4]]) k += `<path d="${pfad([sp(43, 9, z), sp(43, 7, z), sp(43, 7, z + h - 1), sp(43, 8, z + h), sp(43, 9, z + h - 1)])}" fill="#2e2622"/>`;
    k += `<path d="${quad(42.6, 54.4, 10, 107.6, 108.8)}" fill="#c97a5e"/>`;
    k += moos(sp(44.5, 10, 120.5), 1) + moos(sp(52.5, 10, 121.5), .9);
    SL.glocke = sp(48.5, 10, 96);
  }
  /* --- Gläserner Saalbau (Ruine: Arkadengeschosse, ohne Dach) --- */
  {
    const top = [[28, 112], [30, 114.6], [32.4, 113.2], [35, 116.4], [37.6, 114.2], [40, 113.4]];
    k += flaech([[28, 76], [40, 76], ...top.slice().reverse()], 8, RUINE) + `<path d="${pfad([sp(28, 8, 76), sp(40, 8, 76), ...top.slice().reverse().map(([a, b]) => sp(a, 8, b))])}" fill="${QUADER}"/>`;
    for (const z of [92, 99.5, 107]) for (const de of [30.4, 34, 37.6]) k += fenster(de, 8, z, 2.2, 5, z < 95 ? GLAS : RL, true);
    k += `<path d="${quad(27.6, 40.4, 8, 97.6, 98.4)} ${quad(27.6, 40.4, 8, 105, 105.8)}" fill="#c47256"/>`;
    k += moos(sp(35, 8, 116), .9);
  }
  /* --- Friedrichsbau (1601–07): mit Dach, zwei Zwerchgiebel, Fensterachsen, Gesimse --- */
  {
    const d0 = -10, d1 = 28, dn = 8, zu = 89, zo = 114;
    k += `<path d="${quad(d0, d1, dn, zu, zo)}" fill="${ROT_N}"/><path d="${quad(d0, d1, dn, zu, zo)}" fill="${QUADER}"/>`;
    for (const z of [95.6, 101.8, 108]) k += `<path d="${quad(d0, d1, dn, z - .5, z + .2)}" fill="#c26a50"/>`;
    for (let i = 0; i <= 8; i++) { const de = d0 + .4 + i * (d1 - d0 - .8) / 8; k += `<path d="${quad(de - .35, de + .35, dn, zu, zo)}" fill="#b45f48" opacity=".8"/>`; }
    for (const z of [90.6, 96.8, 103, 109.2]) for (let i = 0; i < 8; i++) {
      const de = d0 + 2.6 + i * (d1 - d0 - 5.2) / 7;
      k += fenster(de, dn, z, 1.9, 3.6, "#e2a88c") + fenster(de, dn, z + .2, 1.5, 3.2, GLAS);
    }
    /* Dach mit Gauben */
    k += `<path d="${pfad([sp(d0 - .6, dn, zo), sp(d1 + .6, dn, zo), sp(d1 - 3, 0, 126), sp(d0 + 3, 0, 126)])}" fill="${SCHIEFER}"/>`;
    k += `<path d="${pfad([sp(d1 - 3, 0, 126), sp(d0 + 3, 0, 126)], false)}" stroke="#9aa6b2" stroke-width=".4"/>`;
    for (const de of [-2, 22]) k += `<path d="${pfad([sp(de - 1.2, 7, 116), sp(de + 1.2, 7, 116), sp(de + 1.2, 7, 118.6), sp(de, 7, 120), sp(de - 1.2, 7, 118.6)])}" fill="#7c8691"/>`;
    /* zwei Zwerchhäuser mit Volutengiebeln, Gesimsen und Obelisken */
    for (const gm of [4, 16]) {
      const gp = [[gm - 5, zo], [gm - 5, 118], [gm - 6.4, 118.6], [gm - 4, 120.4], [gm - 3.4, 123.6], [gm - 4.4, 124.4], [gm - 2.2, 125.6], [gm - 1.3, 129], [gm + 1.3, 129], [gm + 2.2, 125.6], [gm + 4.4, 124.4], [gm + 3.4, 123.6], [gm + 4, 120.4], [gm + 6.4, 118.6], [gm + 5, 118], [gm + 5, zo]];
      k += flaech(gp, dn, ROT_N);
      k += flaech(gp.slice(8).map(([a, b]) => [a, b]).concat([[gm + 5, zo]]).length ? [[gm, zo], [gm, 129], [gm + 1.3, 129], [gm + 2.2, 125.6], [gm + 4.4, 124.4], [gm + 3.4, 123.6], [gm + 4, 120.4], [gm + 6.4, 118.6], [gm + 5, 118], [gm + 5, zo]] : [], dn, "#e6936e");
      k += fenster(gm - 2.4, dn, 114.8, 1.8, 3, GLAS) + fenster(gm + 2.4, dn, 114.8, 1.8, 3, GLAS) + fenster(gm, dn, 121, 1.6, 2.6, GLAS);
      k += `<path d="${quad(gm - 5.6, gm + 5.6, dn, 118, 118.6)} ${quad(gm - 3.8, gm + 3.8, dn, 124, 124.5)}" fill="#f0b090"/>`;
      for (const o of [-5.4, 5.4, -3.7, 3.7]) k += flaech([[gm + o - .3, Math.abs(o) > 4 ? 118.6 : 124.5], [gm + o + .3, Math.abs(o) > 4 ? 118.6 : 124.5], [gm + o, Math.abs(o) > 4 ? 120.8 : 126.6]], dn, "#7e3a2c");
      k += flaech([[gm - .3, 129], [gm + .3, 129], [gm, 131.6]], dn, "#7e3a2c");
    }
    k += `<path d="${pfad([sp(d1, dn, zu), sp(d1, dn - 2, zu), sp(d1, dn - 2, zo), sp(d1, dn, zo)])}" fill="${ROT_W}"/>`;
    SL.fried = sp(9, dn, 108);
  }
  /* --- Fassbau (niedriger, mit Dach) --- */
  {
    k += `<path d="${quad(-26, -10, 8, 89, 104)}" fill="${ROT_N}"/><path d="${quad(-26, -10, 8, 89, 104)}" fill="${QUADER}"/>`;
    k += `<path d="${pfad([sp(-26.6, 8, 104), sp(-9.4, 8, 104), sp(-11, 1, 110), sp(-25, 1, 110)])}" fill="${SCHIEFER}"/>`;
    for (const z of [92, 98]) for (const de of [-22, -18, -14]) k += fenster(de, 8, z, 1.6, 3, GLAS);
  }
  /* --- der Altan auf hoher Mauer mit Balustrade und Besuchern --- */
  {
    const d0 = -30, d1 = 30, dn = 24;
    k += `<path d="${pfad([sp(d0, 8, 89), sp(d1, 8, 89), sp(d1, dn, 89), sp(d0, dn, 89)])}" fill="#b98a72"/>`;
    k += `<path d="${quad(d0, d1, dn, 70, 89)}" fill="${ROT_N}"/><path d="${quad(d0, d1, dn, 70, 89)}" fill="${QUADER}"/>`;
    for (let i = 0; i < 6; i++) { const de = d0 + 5 + i * 10; k += `<path d="${quad(de - .9, de + .9, dn + .6, 70, 88)}" fill="#b4604a"/>`; }
    for (let i = 0; i < 6; i++) { const de = d0 + 5 + i * 10 + 5; if (de < d1) k += fenster(de, dn, 77, 2.4, 6, "#3a1d17", true); }
    k += `<path d="${quad(d0, d1, dn + .3, 88.6, 89.4)}" fill="#e2a084"/>`;
    for (let de = d0 + .6; de < d1; de += 1.5) k += `<path d="${quad(de - .3, de + .3, dn, 89.4, 90.6)}" fill="#c87058"/>`;
    k += `<path d="${quad(d0, d1, dn, 90.6, 91.2)}" fill="#efaa8c"/>`;
    for (const [de, c] of [[-14, "#2f5f95"], [-11.6, "#d8ad3a"], [4, "#b8473a"], [6.2, "#eeefec"], [12, "#4f8a46"], [20, "#e0802e"]]) { const a = sp(de, dn - 1.2, 89.2), b = sp(de, dn - 1.2, 90.9); k += `<path d="M${P(a)} L${P(b)}" stroke="${c}" stroke-width=".55"/><circle cx="${r(b[0])}" cy="${r(b[1] - .35)}" r=".32" fill="#e2b48e"/>`; }
    SL.altan = sp(0, dn, 80);
  }
  /* --- Englischer Bau (Ruine, große klassische Fenster mit Verdachungen) --- */
  {
    const dn = 14, top = [[-50, 110], [-47, 111.4], [-43, 110.4], [-39, 112], [-35, 110.6], [-31, 111.8], [-28, 110.8]];
    k += flaech([[-50, 70], [-28, 70], ...top.slice().reverse()], dn, RUINE) + `<path d="${pfad([[-50, 70], [-28, 70], ...top.slice().reverse()].map(([a, b]) => sp(a, dn, b)))}" fill="${QUADER}"/>`;
    for (const [z, giebel] of [[96, true], [86, false], [76, false]]) for (const de of [-46, -41.4, -36.8, -32.2]) {
      k += fenster(de, dn, z, 2.4, 5.6, RL);
      k += giebel ? flaech([[de - 1.6, z + 5.8], [de + 1.6, z + 5.8], [de, z + 7.2]], dn, "#d48467") : flaech([[de - 1.6, z + 5.8], [de + 1.6, z + 5.8], [de + 1.6, z + 6.4], [de - 1.6, z + 6.4]], dn, "#d48467");
    }
    k += moos(sp(-44, dn, 111), .8) + moos(sp(-33, dn, 111.5), .9);
  }
  /* --- der Dicke Turm (Nordwestecke): rund, die Stadtseite weggesprengt — halbe Schale mit Bruchkanten --- */
  {
    const cx = -60, cy = 18, R = 13, d = 7;
    const ring = (rad, z, a0, a1, n = 14) => { const pts = []; for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; pts.push(sp(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad, z)); } return pts; };
    /* Blickrichtung zum Betrachter: 314° → im Rechenraum (Ost, Nord) Winkel 136°; die stehende Hälfte liegt gegenüber (Südost) */
    const aB = 136 * Math.PI / 180, a0 = aB + Math.PI / 2, a1 = aB + 3 * Math.PI / 2;
    const zFuss = 62, zKrone = (a) => 100 + 4 * Math.sin(a * 3) - 6 * Math.abs(Math.cos((a - aB - Math.PI) / 2));
    /* Silhouette der erhaltenen Hälfte: unten gerade, oben unregelmäßig abgebrochen */
    const N = 16, oben = [], unten = [];
    for (let i = 0; i <= N; i++) { const a = a0 + (a1 - a0) * i / N; unten.push(sp(cx + Math.cos(a) * R, cy + Math.sin(a) * R, zFuss)); }
    for (let i = N; i >= 0; i--) { const a = a0 + (a1 - a0) * i / N; oben.push(sp(cx + Math.cos(a) * R, cy + Math.sin(a) * R, zKrone(a) + (i % 3 === 1 ? -1.6 : i % 4 === 2 ? .8 : 0))); }
    k += `<path d="${pfad([...unten, ...oben])}" fill="${RUINE}"/><path d="${pfad([...unten, ...oben])}" fill="${QUADER}"/>`;
    /* die Bruchflächen (7 m Mauerstärke) als Bänder links (Schatten) und rechts (Abendlicht) */
    const band = (a, innen, f) => { const L = [], U = []; for (let z = zFuss; z <= zKrone(a) - 1; z += 4) { const j = (Math.sin(z * 1.7) * .8); L.push(sp(cx + Math.cos(a) * (R + j * .3), cy + Math.sin(a) * (R + j * .3), z)); U.push(sp(cx + Math.cos(a) * (R - d + j), cy + Math.sin(a) * (R - d + j), z)); } return `<path d="${pfad([...L, ...U.reverse()])}" fill="${f}"/>`; };
    /* Bruchflächen: 7 m dicke Mauer im Anschnitt — gestufte, unregelmäßige Kanten, Steinlagen; links im Schatten, rechts in der Abendsonne */
    const bruch = (a, f, fl) => {
      const L = [], U = [];
      for (let z = zFuss; z <= zKrone(a) - 1; z += 2.2) { const j = Math.sin(z * 1.7) * .9 + Math.cos(z * .6) * .6; L.push(sp(cx + Math.cos(a) * (R + .2), cy + Math.sin(a) * (R + .2), z)); U.push(sp(cx + Math.cos(a) * (R - d + j), cy + Math.sin(a) * (R - d + j), z)); U.push(sp(cx + Math.cos(a) * (R - d + j), cy + Math.sin(a) * (R - d + j), z + 2.2)); }
      let g = `<path d="${pfad([...L, ...U.reverse()])}" fill="${f}"/>`;
      let lg = ""; for (let z = zFuss + 1.1; z < zKrone(a) - 1; z += 1.1) lg += `M${P(sp(cx + Math.cos(a) * R, cy + Math.sin(a) * R, z))} L${P(sp(cx + Math.cos(a) * (R - d * .8), cy + Math.sin(a) * (R - d * .8), z))} `;
      return g + `<path d="${lg}" stroke="${fl}" stroke-width=".2" opacity=".6"/>`;
    };
    k += bruch(a0, S.lg("bruchw", [[0, "#d07a58"], [1, "#f6b48e"]], 0, 0, 1, 0), "#a8563f") + bruch(a1, "#9a5040", "#5e2a20");
    /* Innenseite (hohl) mit Geschossen und Fensternischen */
    const iu = [], io = [];
    for (let i = 0; i <= N; i++) { const a = a0 + (a1 - a0) * i / N; iu.push(sp(cx + Math.cos(a) * (R - d), cy + Math.sin(a) * (R - d), zFuss + 4)); }
    for (let i = N; i >= 0; i--) { const a = a0 + (a1 - a0) * i / N; io.push(sp(cx + Math.cos(a) * (R - d), cy + Math.sin(a) * (R - d), zKrone(a) - 2.4)); }
    k += `<path d="${pfad([...iu, ...io])}" fill="${S.lg("innen", [[0, "#3e1a14"], [0.4, "#7e3a2e"], [0.8, "#a8563f"], [1, "#7a3428"]], 0, 0, 1, 0)}"/>`;
    for (const z of [68, 77, 86]) for (let i = 1; i < 6; i++) { const a = a0 + (a1 - a0) * i / 6, de = cx + Math.cos(a) * (R - d), dn = cy + Math.sin(a) * (R - d); k += fenster(de, dn, z, 1.6, 4.6, "#22110d", true); }
    /* außen rechts (Westseite, im Licht): zwei Nischen mit den Kurfürsten Ludwig V. und Friedrich V. */
    for (const [z, aa] of [[84, a0 + .3], [84, a0 + .6]]) {
      const p = sp(cx + Math.cos(aa) * R, cy + Math.sin(aa) * R, z), q = sp(cx + Math.cos(aa) * R, cy + Math.sin(aa) * R, z + 4.4);
      k += `<path d="M${r(p[0] - .7)} ${r(p[1])} V${r(q[1] + .7)} Q${r(p[0])} ${r(q[1] - .2)} ${r(p[0] + .7)} ${r(q[1] + .7)} V${r(p[1])} Z" fill="#5e2a20"/><path d="M${r(p[0] - .35)} ${r(p[1])} L${r(p[0] - .25)} ${r(q[1] + 1.4)} L${r(p[0] + .25)} ${r(q[1] + 1.4)} L${r(p[0] + .35)} ${r(p[1])} Z" fill="#d8b49a"/><circle cx="${r(p[0])}" cy="${r(q[1] + 1.1)}" r=".3" fill="#d8b49a"/>`;
    }
    k += moos(sp(cx - 6, cy + 9, 99), .9) + moos(sp(cx + 8, cy - 6, 101), .8);
    SL.dick = sp(cx, cy, 84);
  }
  /* Efeu an den Ruinenmauern */
  for (const [de, dn, z, gg] of [[-48, 14, 88, 1.3], [-31, 14, 80, 1], [-70, 22, 76, 1.4], [-52, 10, 92, 1], [29, 8, 84, 1.1], [44, 10, 72, 1.2]]) {
    const p = sp(de, dn, z); let ef = ""; for (let i = 0; i < 6; i++) { const ox = (rnd() - .5) * 2.2 * gg, oy = rnd() * 3.4 * gg, rr = (.5 + rnd() * .5) * gg; ef += `M${r(p[0] + ox - rr)} ${r(p[1] + oy)}a${r(rr)} ${r(rr)} 0 1 0 ${r(2 * rr)} 0a${r(rr)} ${r(rr)} 0 1 0 ${r(-2 * rr)} 0`; }
    k += `<path d="${ef}" fill="#4a6a32" opacity=".85"/>`;
  }
  /* die Schlossterrasse: hohe Stützmauer aus Sandstein mit Strebepfeilern unter Altan und Bauten, davor der
     Schlossgraben (Schattenband); rechts die Bastion des Stückgartens mit Bäumen obendrauf */
  {
    k += `<path d="${pfad([sp(-78, 32, 52), sp(62, 26, 52), sp(62, 26, 56), sp(-78, 32, 56)])}" fill="#2a2a1c" opacity=".4"/>`;
    k += `<path d="${pfad([sp(-74, 30, 56), sp(60, 26, 56), sp(60, 26, 70), sp(-74, 30, 70)])}" fill="${S.lg("terrasse", [[0, "#8a3e2e"], [.6, "#a85a44"], [1, "#d08060"]], 0, 0, 1, 0)}"/><path d="${pfad([sp(-74, 30, 56), sp(60, 26, 56), sp(60, 26, 70), sp(-74, 30, 70)])}" fill="${QUADER}" opacity=".4"/>`;
    for (let de = -64; de < 60; de += 21) k += `<path d="${pfad([sp(de - 1, 30.6, 56), sp(de + 1, 30.6, 56), sp(de + .7, 30.6, 68), sp(de - .7, 30.6, 68)])}" fill="#9a4c3a"/><path d="${pfad([sp(de - 1, 30.6, 56), sp(de - 1, 29, 56), sp(de - .7, 29, 68), sp(de - .7, 30.6, 68)])}" fill="#c87a5e"/>`;
    k += `<path d="${pfad([sp(-74, 30.2, 70), sp(60, 26.2, 70)], false)}" stroke="#f2b494" stroke-width=".5"/>`;
    k += `<path d="${pfad([sp(-74, 30, 44), sp(-74, 30, 66), sp(-104, 34, 64), sp(-104, 34, 42)])}" fill="${ROT_N}"/><path d="${pfad([sp(-74, 30, 44), sp(-74, 30, 66), sp(-104, 34, 64), sp(-104, 34, 42)])}" fill="${QUADER}" opacity=".6"/><path d="${pfad([sp(-74, 30.2, 66), sp(-104, 34.2, 64)], false)}" stroke="#f2b494" stroke-width=".5"/>`;
  }
  for (const [de, dn, z, s] of [[60, 18, 64, 1.2], [56, 26, 58, 1], [-82, 32, 66, 1.3], [-92, 30, 62, 1.1], [-70, 34, 58, 1.2], [36, 30, 60, 1], [-20, 32, 60, .9], [12, 32, 60, 1]]) {
    const p = sp(de, dn, z);
    k += `<circle cx="${r(p[0])}" cy="${r(p[1])}" r="${r(2 * s)}" fill="#3f5c32"/><circle cx="${r(p[0] + .7)}" cy="${r(p[1] - .7)}" r="${r(1.2 * s)}" fill="#6a8a46"/><circle cx="${r(p[0] + 1)}" cy="${r(p[1] - 1.1)}" r="${r(.55 * s)}" fill="#d9c27a" opacity=".55"/>`;
  }
  k += `<ellipse cx="${r(SAP[0] - 6)}" cy="${r(SAP[1] - 12)}" rx="40" ry="26" fill="${S.rg("schlossglut", [[0, "#ffb070", .22], [1, "#ffb070", 0]])}"/>`;
  S.teil({ id: "schloss", de: "das Schloss", syl: "SCHLOSS", it: "il castello", itSyl: "ca-STEL-lo", en: "castle", x: 0, y: 0, kunst: k,
    tipp: "Das Schloss ist seit über 300 Jahren eine Ruine. Der gesprengte Krautturm und die Prachtfassade des Ottheinrichsbaus liegen auf der anderen Seite.",
    zoom: { x: 104, y: 46, w: 90, h: 60 },
    unter: [
      { id: "glockenturm", de: "der Glockenturm", syl: "GLO-cken-turm", it: "il campanile", itSyl: "cam-pa-NI-le", en: "bell tower", x: SL.glocke[0], y: SL.glocke[1], kunst: flaeche(-3.8, -18, 7.6, 30),
        tipp: "Im Glockenturm hing früher die Glocke, die vor Gefahr warnte." },
      { id: "friedrichsbau", de: "der Friedrichsbau", syl: "FRIED-richs-bau", it: "il Friedrichsbau", itSyl: "FRIED-richs-bau", en: "Friedrich Building", x: SL.fried[0], y: SL.fried[1], kunst: flaeche(-8, -12, 16, 18),
        tipp: "Der Friedrichsbau hat als einziger großer Bau wieder ein Dach. An der Hofseite stehen 16 Fürstenfiguren (die Originale sind drinnen)." },
      { id: "altan", de: "der Altan", syl: "al-TAN", it: "la terrazza", itSyl: "ter-RAZ-za", en: "terrace", x: SL.altan[0], y: SL.altan[1], kunst: flaeche(-15, -5, 30, 10),
        tipp: "Vom Altan, der großen Terrasse, sieht man über die ganze Altstadt bis zum Philosophenweg." },
      { id: "dicker_turm", de: "der Dicke Turm", syl: "DI-cke TURM", it: "la Torre Grossa", itSyl: "TOR-re GROS-sa", en: "Thick Tower", x: SL.dick[0], y: SL.dick[1], kunst: flaeche(-7, -12, 14, 20),
        tipp: "Seine Mauern sind 7 Meter dick. Trotzdem sprengten ihn französische Soldaten — seitdem ist er halb offen." },
    ] });
}

/* =====================================================================
   Gemeinsame Linien: Südufer (Kai der Altstadt) und Nordufer (Neuenheim)
   ===================================================================== */
const quai = (e) => e < 330 ? -350 - (330 - e) * 0.01 : -350 - (e - 330) * 0.07;
const SUED = []; for (let e = 1150; e >= 120; e -= 15) { const p = proj(e, quai(e), 6); SUED.push(p); }
const suedY = (x) => { for (let i = 1; i < SUED.length; i++) { const a = SUED[i - 1], b = SUED[i]; if ((x - a[0]) * (x - b[0]) <= 0) return a[1] + (b[1] - a[1]) * (x - a[0]) / ((b[0] - a[0]) || 1); } return x < SUED[0][0] ? SUED[0][1] : SUED[SUED.length - 1][1]; };
const NORD = [[-1, 160.2], [20, 163.4], [60, 167.4], [110, 169.6], [200, 171.2], [321, 172.2]];
const nordY = (x) => { for (let i = 1; i < NORD.length; i++) if (x <= NORD[i][0]) { const [a, ya] = NORD[i - 1], [b, yb] = NORD[i]; return ya + (yb - ya) * (x - a) / (b - a); } return 172.2; };

/* =====================================================================
   4 — DER NECKAR (Wasser, weiche Spiegelungen, Schatten der Brücke, Ruderboot)
   ===================================================================== */
const BN = [392, -156], BS = [334, -356], WEST = [-3.36, 0.97], OST = [3.36, -0.97];
const bp = (s, z, seite = WEST) => proj(BN[0] + (BS[0] - BN[0]) * s + seite[0], BN[1] + (BS[1] - BN[1]) * s + seite[1], z);
const PFEILER = 4.5 / 208 / 2;
const BOGEN = (j) => [j / 9 + (j ? PFEILER : 0.012), (j + 1) / 9 - (j < 8 ? PFEILER : 0.012)];
const bogenZ = (t) => 2.2 + 7.6 * Math.pow(Math.sin(Math.PI * t), 0.75);
{
  const oben = []; for (let x = 0; x <= 320; x += 4) oben.push([x, suedY(x)]);
  const unten = []; for (let x = 320; x >= 0; x -= 4) unten.push([x, nordY(x) + 2]);
  const fl = pfad([...oben, ...unten]);
  let k = `<path d="${fl}" fill="${S.lg("wasser", [[0, "#8fa6a4"], [0.3, "#6a8786"], [1, "#46625f"]], 0, 112, 0, 174, ' gradientUnits="userSpaceOnUse"')}"/>`;
  /* Himmel spiegelt sich hell in der Ferne (links im Tal) */
  k += `<path d="${fl}" fill="${S.lg("wasserhimmel", [[0, "#dfe8ea", 0.5], [0.4, "#dfe8ea", 0.1], [1, "#dfe8ea", 0]], 0, 112, 0, 150, ' gradientUnits="userSpaceOnUse"')}"/>`;
  /* weiche Spiegelungen: Häuserzeile, Tor, Wald — mit Maske nach unten ausgeblendet */
  S.def(`<linearGradient id="${S.id("spg")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><mask id="${S.id("spm")}" maskContentUnits="objectBoundingBox"><rect width="1" height="1" fill="url(#${S.id("spg")})"/></mask>`);
  let sp_ = "";
  for (let x = 0; x < 320; x += 6) {
    const y = suedY(x + 3), h = 4 + (y - 112) * 0.18, c = ["#e6d2b0", "#d8c4a6", "#e8c8b4", "#d2cabe", "#c8a07e"][Math.floor(rnd() * 5)];
    sp_ += `<rect x="${x}" y="${r(y + .6)}" width="6.4" height="${r(h)}" fill="${x < 40 ? "#2f4a2a" : c}"/>`;
  }
  k += `<g mask="url(#${S.id("spm")})"><g filter="url(#${S.id("spiegel")})" opacity=".42">${sp_}</g></g>`;
  /* Spiegelung der Brücke: genau unter den Bögen, Bogen + Spiegelbild ergeben fast Kreise */
  {
    let g = "";
    const o = [], u = []; for (let i = 0; i <= 30; i++) { const s = -0.02 + i / 30 * 1.06; o.push(bp(s, 0)); u.push(bp(s, -12)); }
    g += `<path d="${pfad([...o, ...u.reverse()])}" fill="#a85a40"/>`;
    for (let j = 0; j < 9; j++) {
      const [a, b] = BOGEN(j), pts = [];
      for (let i = 0; i <= 10; i++) { const t = i / 10; pts.push(bp(a + (b - a) * t, -bogenZ(t))); }
      g += `<path d="${pfad([bp(a, 0), ...pts, bp(b, 0)])}" fill="#4f6966"/>`;
    }
    k += `<g mask="url(#${S.id("spm")})"><g opacity=".5" filter="url(#${S.id("spiegel")})">${g}</g></g>`;
    /* Schatten der Brücke auf dem Wasser stromauf (Sonne von Westsüdwest) */
    const sch = []; for (let i = 0; i <= 20; i++) sch.push(bp(i / 20, 0, [3.36 * 4.5, -0.97 * 4.5]));
    const sch2 = []; for (let i = 20; i >= 0; i--) sch2.push(bp(i / 20, 0, OST));
    k += `<path d="${pfad([...sch, ...sch2])}" fill="#1e3332" opacity=".22"/>`;
  }
  /* Wellen und Glitzern als feine Striche */
  for (let i = 0; i < 115; i++) {
    const x = rnd() * 320, y0 = suedY(x) + 1, y1 = nordY(x), y = y0 + Math.pow(rnd(), 0.8) * (y1 - y0), w = 0.8 + (y - 112) * 0.05 * (0.5 + rnd());
    if (y1 - y0 < 2) continue;
    k += `<path d="M${r(x)} ${r(y)} h${r(Math.min(w, 320 - x))}" stroke="${rnd() < 0.6 ? "#f4f8f2" : "#2a4442"}" stroke-width="${r(0.12 + (y - 112) * 0.004)}" opacity="${r(0.25 + rnd() * 0.45)}"/>`;
  }
  for (let i = 0; i < 40; i++) { const x = 200 + rnd() * 116, y = suedY(x) + 1.5 + rnd() * (nordY(x) - suedY(x) - 2); if (nordY(x) - suedY(x) > 3) k += `<path d="M${r(x)} ${r(y)} h${r(.6 + rnd() * 1.6)}" stroke="#fff4d0" stroke-width=".22" opacity="${r(.5 + rnd() * .4)}"/>`; }
  /* ein Ruderboot (Zweier) stromab der Brücke */
  {
    const p = proj(300, -280, 0), s = FOC / tief(300, -280);
    k += `<path d="M${r(p[0] - 4 * s)} ${r(p[1])} q${r(4 * s)} ${r(.5 * s)} ${r(8 * s)} ${r(-.3 * s)} l${r(-.3 * s)} ${r(-.25 * s)} h${r(-7.4 * s)} Z" fill="#f2efe6"/><path d="M${r(p[0] - 3 * s)} ${r(p[1] + .1)} l${r(-1.4 * s)} ${r(.4 * s)} M${r(p[0] + 1 * s)} ${r(p[1] + .1)} l${r(1.4 * s)} ${r(.5 * s)}" stroke="#c8a060" stroke-width=".2"/>`;
    for (const dx of [-1.6, 1.4]) k += `<rect x="${r(p[0] + dx * s - .25)}" y="${r(p[1] - 1.1)}" width=".5" height=".9" rx=".2" fill="${dx < 0 ? "#c8302a" : "#2f5f95"}"/><circle cx="${r(p[0] + dx * s)}" cy="${r(p[1] - 1.3)}" r=".25" fill="#e2b48e"/>`;
    k += `<path d="M${r(p[0] + 4.4 * s)} ${r(p[1] + .2)} q${r(3 * s)} ${r(.4)} ${r(6 * s)} 0" stroke="#eef3f1" stroke-width=".25" fill="none" opacity=".7"/>`;
  }
  S.teil({ id: "neckar", de: "der Neckar", syl: "NE-ckar", it: "il Neckar", itSyl: "NE-ckar", en: "the Neckar", x: 0, y: 0, kunst: k,
    tipp: "Der Neckar fließt durch Heidelberg und mündet in Mannheim in den Rhein." });
}

/* Fenster je Haus: Muster in der Hausfläche (Achsen × Geschosse), mit oder ohne Läden */
const FM = {};
const fm = (a, g, laeden) => {
  const key = a + "_" + g + "_" + laeden;
  if (!FM[key]) {
    const id = S.id("f" + key);
    const w = 1 / a, h = 1 / g;
    let c = `<rect x="${r(w * .32 * 1000) / 1000}" y="${r(h * .22 * 1000) / 1000}" width="${r(w * .36 * 1000) / 1000}" height="${r(h * .5 * 1000) / 1000}" fill="#3a3e45"/>`;
    if (laeden) c += `<rect x="${r(w * .2 * 1000) / 1000}" y="${r(h * .22 * 1000) / 1000}" width="${r(w * .1 * 1000) / 1000}" height="${r(h * .5 * 1000) / 1000}" fill="${laeden}"/><rect x="${r(w * .7 * 1000) / 1000}" y="${r(h * .22 * 1000) / 1000}" width="${r(w * .1 * 1000) / 1000}" height="${r(h * .5 * 1000) / 1000}" fill="${laeden}"/>`;
    S.def(`<pattern id="${id}" width="${r(w * 1000) / 1000}" height="${r(h * 1000) / 1000}" patternUnits="objectBoundingBox" patternContentUnits="objectBoundingBox">${c}</pattern>`);
    FM[key] = `url(#${id})`;
  }
  return FM[key];
};

/* =====================================================================
   5 — DAS UFER (Neuenheim): Ufermauer und Neuenheimer Landstraße, dahinter — von oben gesehen —
       die großen Dächer der Villen mit Gärten. Sie liegen viel näher als die Altstadt und sind darum
       zwei- bis dreimal so groß; nach unten (zur Mauer hin) werden sie größer.
   ===================================================================== */
{
  const oben = NORD.map(([x, y]) => [x, y]);
  let k = `<path d="${pfad([...oben, [321, 190], [-1, 190]])}" fill="${S.lg("ufergrund", [[0, "#6f8a52"], [1, "#4f6a3a"]])}"/>`;
  /* Ufermauer (Krone mit Licht) und die Neuenheimer Landstraße */
  k += `<path d="${pfad(oben.map(([x, y]) => [x, y + .3]), false)}" stroke="#e2d6c0" stroke-width=".8" fill="none"/>`;
  k += `<path d="${pfad(oben.map(([x, y]) => [x, y + 1.6]), false)}" stroke="#8f8a84" stroke-width="2" fill="none"/>`;
  k += `<path d="${pfad(oben.map(([x, y]) => [x, y + 1.6]), false)}" stroke="#f2ead8" stroke-width=".12" stroke-dasharray="1.6 1.4" fill="none"/>`;
  k += `<path d="${pfad(oben.map(([x, y]) => [x, y + 2.8]), false)}" stroke="#c9bfae" stroke-width=".6" fill="none"/>`;
  for (const [x, c] of [[34, "#c8302a"], [96, "#e8e4da"], [150, "#2f4f7a"], [232, "#3a3a3a"], [290, "#d8ad3a"]]) { const y = nordY(x) + 1.3; k += `<rect x="${x}" y="${r(y - .7)}" width="3" height="1.2" rx=".45" fill="${c}"/><rect x="${x + .6}" y="${r(y - 1.05)}" width="1.6" height=".6" rx=".2" fill="#9fb8c8"/><rect x="${x}" y="${r(y + .3)}" width="3" height=".35" fill="#2a2a2a" opacity=".3"/>`; }
  /* Baum als gelappte Krone: Schattenseite links unten, Licht von rechts oben (Westsonne) */
  /* Bäume als gelappte Kronen (Schattenseite links unten, Licht von rechts oben), je Sorte einmal gezeichnet
     und dann nur noch verschoben und skaliert eingesetzt (<use>) — spart Ladezeit */
  const lap = (cx, cy, rr, c) => { let d = ""; for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI * 2, q = rr * (.82 + ((i * 37) % 5) * .05); d += `M${r(cx + Math.cos(a) * rr * .5 - q * .55)} ${r(cy + Math.sin(a) * rr * .5)}a${r(q * .55)} ${r(q * .55)} 0 1 0 ${r(q * 1.1)} 0a${r(q * .55)} ${r(q * .55)} 0 1 0 ${r(-q * 1.1)} 0`; } return `<path d="${d}" fill="${c}"/>`; };
  [["#3c5a2e", "#5a7a3e", "#9ab060"], ["#7a6a2a", "#b0863a", "#e0b860"]].forEach((f, i) => {
    const R = 2.4;
    S.def(`<g id="${S.id("baum" + i)}"><ellipse cx="-2.6" cy="-.2" rx="2.6" ry=".7" fill="#1e2a14" opacity=".3"/><path d="M0 0v-1.4" stroke="#5a4838" stroke-width=".35"/>${lap(0, -2 - R * .2, R, f[0])}${lap(R * .2, -2.2 - R * .4, R * .7, f[1])}${lap(R * .35, -2.4 - R * .6, R * .35, f[2])}</g>`);
  });
  const baum = (x, y, g, herbst) => `<use href="#${S.id("baum" + (herbst ? 1 : 0))}" transform="translate(${r(x)} ${r(y)}) scale(${r(g * 100) / 100})"/>`;
  /* Villa von oben gesehen (Walmdach): Rückdach, Front (zu uns, Nordseite), Westwand in der Sonne,
     Vorderdach, Walm nach Westen im Licht, Gauben, Kamin */
  const villa = (cx, by, g, w, d, h, rh, wand, dach) => {
    const Q = (u, v, hh) => [cx + g * (u + .28 * v), by + g * (.04 * u - .62 * hh - .66 * v)];
    const pp = (...pts) => pfad(pts.map((p) => Q(...p)));
    const a = w / 2, e = Math.min(d / 2, a - .5);
    /* Schlagschatten nach links hinten (tiefe Sonne aus Westsüdwest) */
    const L = (h + rh * .5) * 1.5, sx = -.92 * L, sy = .39 * L;
    let v = `<path d="${pp([a, 0, 0], [a, d, 0], [a + sx, d + sy, 0], [-a + sx, d + sy, 0], [-a + sx, sy, 0], [-a, 0, 0])}" fill="#1e2a14" opacity=".3"/>`;
    v += `<path d="${pp([-a, d, h], [a, d, h], [a - e, d / 2, h + rh], [-a + e, d / 2, h + rh])}" fill="${dach[1]}"/>`;
    v += `<path d="${pp([-a, 0, 0], [a, 0, 0], [a, 0, h], [-a, 0, h])}" fill="${wand[0]}"/>`;
    v += `<path d="${pp([a, 0, 0], [a, d, 0], [a, d, h], [a, 0, h])}" fill="${wand[1]}"/>`;
    const fw = Math.max(2, Math.round(w / 3.2));
    let fe = "";
    for (let i = 0; i < fw; i++) for (const z of [1.2, 4.2]) { if (z + 1.6 > h) continue; const u = -a + (i + .5) * w / fw; fe += pp([u - .5, 0, z], [u + .5, 0, z], [u + .5, 0, z + 1.6], [u - .5, 0, z + 1.6]); }
    for (const vv of [d * .3, d * .7]) for (const z of [1.2, 4.2]) { if (z + 1.6 > h) continue; fe += pp([a, vv - .5, z], [a, vv + .5, z], [a, vv + .5, z + 1.6], [a, vv - .5, z + 1.6]); }
    v += `<path d="${fe}" fill="#3a3e46"/>`;
    v += `<path d="${pp([-a - .3, -.3, h], [a + .3, -.3, h], [a - e, d / 2, h + rh], [-a + e, d / 2, h + rh])}" fill="${dach[0]}"/>`;
    v += `<path d="${pp([a + .3, -.3, h], [a + .3, d + .3, h], [a - e, d / 2, h + rh])}" fill="${dach[2]}"/>`;
    v += `<path d="${pfad([Q(-a + e, d / 2, h + rh), Q(a - e, d / 2, h + rh), Q(a + .3, -.3, h)], false)}" stroke="#ffd8b0" stroke-width="${r(.12 * g)}" fill="none" opacity=".7"/>`;
    /* Gauben im Vorderdach */
    const ng = Math.max(1, Math.round(w / 5) - 1);
    for (let i = 0; i < ng; i++) {
      const u = -a + (i + 1) * w / (ng + 1), hz = h + rh * .35, vz = d * .17;
      v += `<path d="${pp([u - .9, vz, hz - .4], [u + .9, vz, hz - .4], [u + .9, vz, hz + 1.1], [u, vz, hz + 1.8], [u - .9, vz, hz + 1.1])}" fill="${wand[0]}"/><path d="${pp([u - .45, vz - .05, hz - .1], [u + .45, vz - .05, hz - .1], [u + .45, vz - .05, hz + .9], [u - .45, vz - .05, hz + .9])}" fill="#3a3e46"/>`;
    }
    const ku = a * .4;
    v += `<path d="${pp([ku - .4, d * .45, h + rh * .5], [ku + .4, d * .45, h + rh * .5], [ku + .4, d * .45, h + rh + 1.4], [ku - .4, d * .45, h + rh + 1.4])}" fill="#8a4a36"/>`;
    return v;
  };
  const WAND = [["#e8dcc4", "#fff0d6"], ["#e4d0aa", "#ffe4b8"], ["#efe8de", "#fff6ea"], ["#dcc4b4", "#f8dcc8"], ["#d8d2c4", "#f6eedc"], ["#e6c89a", "#ffdcaa"]];
  const DACH = [["#4c5560", "#3a414a", "#8a93a0"], ["#8a3e2a", "#6e3020", "#d47a56"], ["#9c4a32", "#7a3a26", "#e08a62"], ["#565e68", "#40464e", "#9aa2ac"]];
  /* drei Reihen: hinten (an der Straße) kleiner, vorn größer; dazwischen Gärten und Bäume */
  const dinge = [];
  for (const [y0, g0, dx] of [[6.8, .95, 26], [11.8, 1.22, 30], [17.2, 1.55, 36]]) {
    for (let x = -12 + rnd() * 10; x < 330; x += dx + rnd() * 9) {
      const by = Math.min(nordY(x) + y0 + rnd() * 1.6, 186), g = g0 * (1 + (by - 176) * .015);
      dinge.push({ y: by, f: () => villa(x, by, g, 10 + rnd() * 5, 8 + rnd() * 2, 6 + rnd() * 1.5, 3.4 + rnd() * 1.4, WAND[Math.floor(rnd() * WAND.length)], DACH[Math.floor(rnd() * DACH.length)]) });
      for (let t = 0; t < 2; t++) { const bx = Math.min(316, Math.max(4, x + dx * (.55 + rnd() * .35))), bb = by - 1 + rnd() * 3; dinge.push({ y: bb, f: () => baum(bx, bb, g * (.8 + rnd() * .4), rnd() < .3) }); }
    }
  }
  dinge.sort((p, q) => p.y - q.y).forEach((o) => { k += o.f(); });
  /* Platanen an der Uferstraße */
  for (let x = 3; x < 317; x += 8 + rnd() * 3) k += baum(x, nordY(x) + 4.2, .75 + rnd() * .2, rnd() < .2);
  S.teil({ id: "ufer", de: "das Ufer", syl: "U-fer", it: "la riva", itSyl: "RI-va", en: "riverbank", x: 0, y: 0, kunst: k,
    tipp: "Hier am Nordufer liegt der Stadtteil Neuenheim. Von oben sieht man die Dächer der Villen und ihre Gärten." });
}

/* =====================================================================
   6 — DIE ALTSTADT — Häuserreihen in echter Lage (von hinten nach vorn)
   ===================================================================== */
const HGK = { e0: 278, e1: 350, n: -404 };
const VORNE = [];                          // Umrisse der Häuser vor der Kirche (für deren Verdeckung)
{
  let k = "";
  const fass = ["#efe3c8", "#e6d0a2", "#f1ede4", "#e7c7b2", "#d8d4cc", "#dfc08a", "#c26e55", "#eedcbc", "#d9c3a0", "#e9d9c9", "#cdb79a", "#f0d8a8", "#d6b6a0"];
  const dachF = ["#9a4e36", "#8a442e", "#a65a3c", "#7c3c28", "#93533b", "#b06446", "#5b5f66", "#4e535a"];
  const haus = (e0, e1, nf, zb, h, opt = {}) => {
    const dep = 11, rise = opt.giebel ? Math.min(9, (e1 - e0) * .7) : 4.5 + rnd() * 3;
    const a = proj(e0, nf, zb), b = proj(e1, nf, zb), c = proj(e1, nf, zb + h), d = proj(e0, nf, zb + h);
    if (Math.max(a[0], b[0]) < -2 || Math.min(a[0], b[0]) > 322) return null;
    const f = opt.farbe || fass[Math.floor(rnd() * fass.length)], dc = dachF[Math.floor(rnd() * dachF.length)];
    const sk = FOC / tief(e0, nf);
    let g = `<path d="${pfad([a, b, c, d])}" fill="${f}"/>`;
    let umriss;
    if (opt.giebel) {
      const apex = proj((e0 + e1) / 2, nf, zb + h + rise);
      g += `<path d="${pfad([proj(e0, nf - dep, zb + h), d, apex, proj((e0 + e1) / 2, nf - dep, zb + h + rise)])}" fill="${dc}"/>`;
      g += `<path d="${pfad([c, d, apex])}" fill="${f}"/><path d="${pfad([c, apex, d], false)}" stroke="${dc}" stroke-width="${r(Math.max(.25, .5 * sk))}" fill="none"/>`;
      g += `<path d="${pfad([d, apex, proj(e0, nf, zb + h + .2)])}" fill="#ffe2b0" opacity=".25"/>`;
      umriss = [a, b, c, apex, d];
    } else {
      const r0 = proj(e0 + 1.5, nf - dep / 2, zb + h + rise), r1 = proj(e1 - 1.5, nf - dep / 2, zb + h + rise);
      g += `<path d="${pfad([d, c, r1, r0])}" fill="${dc}"/><path d="${pfad([d, r0, proj(e0, nf - dep / 2, zb + h + .3)])}" fill="#ffd8a0" opacity=".3"/>`;
      if ((e1 - e0) * sk > 4.5) { const gm = proj((e0 + e1) / 2, nf - 2.2, zb + h + rise * .45), gs = Math.max(.5, sk * 1.1); if (gm[0] > 1.5 && gm[0] < 318.5) g += `<path d="M${r(gm[0] - gs)} ${r(gm[1] + gs * .8)} V${r(gm[1])} L${r(gm[0])} ${r(gm[1] - gs * .6)} L${r(gm[0] + gs)} ${r(gm[1])} V${r(gm[1] + gs * .8)} Z" fill="#ece2d0"/><rect x="${r(gm[0] - gs * .4)}" y="${r(gm[1] + .05)}" width="${r(gs * .8)}" height="${r(gs * .6)}" fill="#3d4148"/>`; }
      if (rnd() < 0.5) { const sc = proj(e0 + (e1 - e0) * (0.2 + rnd() * 0.6), nf - 3, zb + h + rise * .7); if (sc[0] > .5 && sc[0] < 319) g += `<rect x="${r(sc[0])}" y="${r(sc[1] - sk * 1.4)}" width="${r(Math.max(.4, sk * .8))}" height="${r(sk * 1.4)}" fill="#7a4a3a"/>`; }
      umriss = [a, b, c, r1, r0, d];
    }
    /* Fensterachsen und Geschosse je Haus verschieden, Läden manchmal */
    const geschosse = Math.max(2, Math.min(5, Math.round(h / 3.4))), achsen = Math.max(2, Math.min(5, Math.round((e1 - e0) / 3.2)));
    const laeden = rnd() < 0.25 ? (rnd() < 0.5 ? "#4f7a4a" : "#7a5236") : "";
    const zOG = opt.laden ? zb + 3.6 : zb + .4;
    if (!opt.ohneFenster) g += `<path d="${pfad([proj(e0 + .5, nf, zOG), proj(e1 - .5, nf, zOG), proj(e1 - .5, nf, zb + h - .4), proj(e0 + .5, nf, zb + h - .4)])}" fill="${fm(achsen, opt.laden ? geschosse - 1 : geschosse, laeden)}"/>`;
    if (opt.laden && sk > 0.6) {
      g += `<path d="${pfad([proj(e0 + .6, nf, zb), proj(e1 - .6, nf, zb), proj(e1 - .6, nf, zb + 2.8), proj(e0 + .6, nf, zb + 2.8)])}" fill="#3a3430" opacity=".75"/>`;
      g += `<path d="${pfad([proj(e0 + .4, nf, zb + 3), proj(e1 - .4, nf, zb + 3)], false)}" stroke="${rnd() < .5 ? "#a8302a" : "#2f5f7a"}" stroke-width="${r(Math.max(.3, sk * .7))}"/>`;
    }
    g += `<path d="${pfad([d, c], false)}" stroke="#fff" stroke-opacity=".35" stroke-width="${r(Math.max(.2, sk * .25))}"/>`;
    if (opt.lichtseite) g += `<path d="${pfad([a, proj(e0, nf - 3, zb), proj(e0, nf - 3, zb + h), d])}" fill="#f6c28e" opacity=".55"/>`;
    return { svg: g, umriss };
  };
  const reihe = (n0, e0, e1, opt) => {
    const out = [];
    for (let e = e1; e > e0;) {
      const w = 9 + rnd() * 9, ea = Math.max(e0, e - w);
      if (opt.lucke && opt.lucke.some(([u0, u1]) => ea < u1 && e > u0)) { e = Math.min(...opt.lucke.filter(([u0, u1]) => ea < u1 && e > u0).map(([u0]) => u0)); continue; }
      const nf = (opt.n ? opt.n(ea) : quai(ea) + n0) + (rnd() - .5) * 2.4;
      const zb = opt.z ? opt.z(ea, nf) : 7;
      const h = (opt.h0 || 13) + rnd() * (opt.dh || 6);
      const hs = haus(ea, e, nf, zb, h, { giebel: rnd() < (opt.giebel || .2), laden: opt.laden && !opt.ohneFenster, lichtseite: rnd() < .18, ohneFenster: opt.ohneFenster });
      if (hs) out.push({ ...hs, f: tief((ea + e) / 2, nf) });
      e = ea - (rnd() < .15 ? 2 : 0.2);
    }
    return out;
  };
  /* Hanglage am Schloss: der Boden steigt vom Kornmarkt zum Schloss an */
  const hang = (e, n) => 8 + (e > 400 && e < 800 ? Math.max(0, -n - 470) * .62 : 0);
  /* Dunst zwischen Altstadt und Schloss */
  k += `<path d="M60 112 Q150 96 240 104 L260 124 L60 126 Z" fill="#f2e2c8" opacity=".22" filter="url(#${S.id("dunst")})"/>`;
  /* Hang zwischen Kornmarkt und Schloss: einzelne Häuser auf Stützmauern zwischen Bäumen (keine Reihe) */
  const hangDinge = [];
  for (let i = 0; i < 26; i++) {
    const e = 420 + rnd() * 190, n = quai(e) - 140 - rnd() * 70;
    if (n < -560 && e > 560) continue;                          // nicht in den Schlossbau (östlich davon liegt der Schlossgarten)
    const z = hang(e, n);
    hangDinge.push({ f: tief(e, n), e, n, z, baum: rnd() < .45 });
  }
  for (let i = 0; i < 22; i++) { const e = 400 + rnd() * 420, n = quai(e) - 130 - rnd() * 90; hangDinge.push({ f: tief(e, n), e, n, z: hang(e, n), baum: true }); }
  hangDinge.sort((a, b) => b.f - a.f).forEach(({ e, n, z, baum }) => {
    const s = FOC / tief(e, n), p = proj(e, n, z);
    if (baum) { k += `<use href="#${S.id(rnd() < .3 ? "baum1" : "baum0")}" transform="translate(${r(p[0])} ${r(p[1])}) scale(${r((1.4 + rnd() * .6) * s * 100) / 100})"/>`; return; }
    const w = 9 + rnd() * 5;
    /* Stützmauer aus Sandstein: Mauerkrone im Licht, Schatten darunter, davor ein Gartenstreifen */
    k += `<path d="${pfad([proj(e - w / 2 - 3, n + 6, z - 3.6), proj(e + w / 2 + 3, n + 6, z - 3.6), proj(e + w / 2 + 3, n + 6, z - 3), proj(e - w / 2 - 3, n + 6, z - 3)])}" fill="#2a3a20" opacity=".3"/>`;
    k += `<path d="${pfad([proj(e - w / 2 - 2, n + 5, z - 3), proj(e + w / 2 + 2, n + 5, z - 3), proj(e + w / 2 + 2, n + 5, z), proj(e - w / 2 - 2, n + 5, z)])}" fill="#9a8a72"/>`;
    k += `<path d="${pfad([proj(e - w / 2 - 2, n + 5, z), proj(e + w / 2 + 2, n + 5, z)], false)}" stroke="#e8d8b8" stroke-width=".3"/>`;
    k += `<path d="${pfad([proj(e - w / 2 - 2, n + 5, z), proj(e + w / 2 + 2, n + 5, z), proj(e + w / 2 + 2, n + 1, z), proj(e - w / 2 - 2, n + 1, z)])}" fill="#6a8a46"/>`;
    const h = haus(e - w / 2, e + w / 2, n, z, 8 + rnd() * 4, { giebel: rnd() < .4 });
    if (h) k += h.svg;
  });
  const hinten = reihe(-120, 120, 860, { z: hang, h0: 12, dh: 6, ohneFenster: true, lucke: [[275, 362], [445, 470]] });
  hinten.sort((a, b) => b.f - a.f).forEach((h) => { k += h.svg; });
  const mitte = reihe(-55, 140, 940, { h0: 13, dh: 6, giebel: .25, lucke: [[275, 362]] });
  mitte.sort((a, b) => b.f - a.f).forEach((h) => { k += h.svg; VORNE.push(h.umriss); });
  /* vordere Reihe am Kai: Neckarstaden (West) und Am Hackteufel (Ost); Lücke am Brückentor */
  const front = reihe(-9, 140, 1010, { h0: 14, dh: 6, laden: true, giebel: .2, lucke: [[316, 345]] });
  front.sort((a, b) => b.f - a.f).forEach((h) => { k += h.svg; VORNE.push(h.umriss); });
  /* Platanen am Kai (Neckarstaden, westlich des Tors) und Spaziergänger */
  for (let e = 314; e > 120; e -= 13 + rnd() * 4) {
    const n = quai(e) - 3, p = proj(e, n, 6), s = FOC / tief(e, n);
    if (p[0] + 4.6 * s > 320.5) continue;
    k += `<path d="M${r(p[0])} ${r(p[1])} v${r(-6 * s)}" stroke="#7a6a58" stroke-width="${r(.7 * s)}"/>`;
    k += `<use href="#${S.id("baum0")}" transform="translate(${r(p[0])} ${r(p[1] - 4.5 * s)}) scale(${r(1.9 * s * 100) / 100})"/>`;
    VORNE.push([[p[0] - 4.6 * s, p[1] - 9 * s], [p[0], p[1] - 13 * s], [p[0] + 4.6 * s, p[1] - 9 * s], [p[0], p[1]]]);
  }
  for (let i = 0; i < 16; i++) { const e = 165 + rnd() * 735, n = quai(e) - 2.5, p = proj(e, n, 6.1), s = FOC / tief(e, n); k += `<path d="M${r(p[0])} ${r(p[1])} v${r(-1.5 * s)}" stroke="${["#b8473a", "#2f5f95", "#e8e4da", "#3a3a3a", "#d8ad3a"][i % 5]}" stroke-width="${r(.55 * s)}"/><circle cx="${r(p[0])}" cy="${r(p[1] - 1.75 * s)}" r="${r(.25 * s)}" fill="#e2b48e"/>`; }
  /* Kaimauer */
  const kai = []; for (let e = 1150; e >= 110; e -= 15) kai.push(proj(e, quai(e), 6));
  k += `<path d="${pfad(kai, false)}" stroke="#c9b597" stroke-width="1" fill="none"/><path d="${pfad(kai.map(([x, y]) => [x, y + .9]), false)}" stroke="#7d6450" stroke-width=".9" fill="none"/>`;
  S.teil({ id: "altstadt", de: "die Altstadt", syl: "ALT-stadt", it: "il centro storico", itSyl: "CEN-tro STO-ri-co", en: "old town", x: 0, y: 0, kunst: k,
    tipp: "Die Altstadt liegt zwischen dem Neckar und dem Königstuhl. Die Hauptstraße ist über einen Kilometer lang." });
}

/* =====================================================================
   7 — DIE HEILIGGEISTKIRCHE (echte Größe; nur sichtbar über den Dächern davor)
       Lupe: der Kirchturm
   ===================================================================== */
{
  const z0 = 7, NW = -404, SW = -432, NM = -418, TW = 278, TO = 289;
  const q = (pts) => pfad(pts.map(([e, n, z]) => proj(e, n, z)));
  let k = "";
  /* Langhaus: Nordwand mit Strebepfeilern (Wasserschläge) und hohen Maßwerkfenstern */
  k += `<path d="${q([[TO, NW, z0], [340, NW, z0], [340, NW, 28], [TO, NW, 28]])}" fill="${ROT_N}"/>`;
  for (let i = 0; i < 6; i++) {
    const e = TO + 4 + i * 8.6;
    const pts = [[e, NW, 11]]; for (let j = 0; j <= 6; j++) { const a = Math.PI * j / 6; pts.push([e + 2.4 - (1 - Math.cos(a)) * 2.4 + 2.4 * 0, NW, 22 + Math.sin(a) * 2.6]); }
    k += `<path d="${q([[e - 1.5, NW, 11], [e + 1.5, NW, 11], [e + 1.5, NW, 22.4], [e, NW, 25.4], [e - 1.5, NW, 22.4]])}" fill="#3a2826"/>`;
    k += `<path d="${pfad([proj(e, NW, 11), proj(e, NW, 24.6)], false)} ${pfad([proj(e - .75, NW, 11), proj(e - .75, NW, 23)], false)} ${pfad([proj(e + .75, NW, 11), proj(e + .75, NW, 23)], false)}" stroke="#c9705a" stroke-width=".3"/>`;
    const sb = e + 4.3;
    k += `<path d="${q([[sb - .8, NW - 2, z0], [sb + .8, NW - 2, z0], [sb + .8, NW - 1.2, 22], [sb - .8, NW - 1.2, 22]])}" fill="#b4604a"/>`;
    for (const z of [12, 18]) k += `<path d="${pfad([proj(sb - .8, NW - 2, z), proj(sb + .8, NW - 2, z)], false)}" stroke="#e8a283" stroke-width=".35"/>`;
  }
  /* sehr steiles Satteldach mit Firstlinie, Walm am Chor (links, Osten), gestaffelte Gaubenreihen */
  const zT = 28, zF = 57;
  k += `<path d="${q([[TO, NW - .5, zT], [340, NW - .5, zT], [352, NM, zT + 3], [334, NM, zF], [TO, NM, zF]])}" fill="${S.lg("hgkdach", [[0, "#313740"], [0.5, "#4c5560"], [1, "#68727e"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="${q([[340, NW - .5, zT], [352, NM, zT + 3], [334, NM, zF]])}" fill="#262b32" opacity=".55"/>`;
  k += `<path d="${pfad([proj(TO, NM, zF), proj(334, NM, zF)], false)}" stroke="#9aa6b2" stroke-width=".5"/><path d="${pfad([proj(334, NM, zF), proj(340, NW - .5, zT)], false)}" stroke="#7d8894" stroke-width=".35"/>`;
  /* Schieferdeckung: feine Reihen über die ganze Dachfläche, kräftiger Firstkamm */
  { let sl = ""; for (let z = zT + 1.4; z < zF - .6; z += 1.5) { const t = (z - zT) / (zF - zT), nn = NW - .5 + (NM - NW + .5) * t, eR = 340 + (334 - 340) * t; sl += pfad([proj(TO, nn, z), proj(eR, nn, z)], false) + " "; }
    k += `<path d="${sl}" stroke="#2a3038" stroke-width=".14" opacity=".55" fill="none"/>`; }
  k += `<path d="${pfad([proj(TO, NM, zF + .3), proj(334, NM, zF + .3)], false)}" stroke="#a8b4c0" stroke-width=".8"/><path d="${pfad([proj(TO, NM, zF - .6), proj(334, NM, zF - .6)], false)}" stroke="#262b32" stroke-width=".35"/>`;
  for (const [z, n, e0, e1] of [[31.4, 10, 291, 338], [36.6, 9, 292, 335], [41.8, 7, 294, 331], [46.8, 5, 296, 327], [51.6, 3, 300, 322]]) for (let i = 0; i < n; i++) {
    const e = e0 + (i + .5) * (e1 - e0) / n, nn = NW - .5 + (NM - NW + .5) * (z - zT) / (zF - zT), s = Math.max(.55, FOC / tief(e, nn) * (1 - (z - 31) / 34) * 1.15);
    const p = proj(e, nn, z);
    k += `<path d="M${r(p[0] - s)} ${r(p[1] + s * .9)} V${r(p[1])} L${r(p[0])} ${r(p[1] - s * .8)} L${r(p[0] + s)} ${r(p[1])} V${r(p[1] + s * .9)} Z" fill="#7c8691"/><rect x="${r(p[0] - s * .45)}" y="${r(p[1] + s * .05)}" width="${r(s * .9)}" height="${r(s * .8)}" fill="#252a30"/>`;
  }
  /* Westturm: Vierkant mit Eckstrebepfeilern, Achteck mit Galerie, geschweifte Haube, Laterne, kleine Haube */
  const zV = 52, zA = 63;
  k += `<path d="${q([[TO, -412, z0], [TW, -412, z0], [TW, -412, zV], [TO, -412, zV]])}" fill="${ROT_N}"/><path d="${q([[TO, -412, z0], [TW, -412, z0], [TW, -412, zV], [TO, -412, zV]])}" fill="${QUADER}"/>`;
  k += `<path d="${q([[TW, -412, z0], [TW, -422, z0], [TW, -422, zV], [TW, -412, zV]])}" fill="${ROT_W}"/><path d="${q([[TW, -412, z0], [TW, -422, z0], [TW, -422, zV], [TW, -412, zV]])}" fill="${QUADER}"/>`;
  for (const z of [24, 36]) k += `<path d="${pfad([proj(TO, -412, z), proj(TW, -412, z), proj(TW, -422, z)], false)}" stroke="#e8a283" stroke-width=".45" fill="none"/>`;
  for (const [e, n, f] of [[283.5, -412, "#2c1d1a"], [TW, -417, "#3a2420"]]) {
    for (const z of [38, 27]) { const p = proj(e, n, z), s = FOC / tief(e, n); k += `<path d="M${r(p[0] - s * 1)} ${r(p[1])} V${r(p[1] - s * 5)} Q${r(p[0])} ${r(p[1] - s * 6.6)} ${r(p[0] + s * 1)} ${r(p[1] - s * 5)} V${r(p[1])} Z" fill="${f}"/>`; }
  }
  /* Galerie und Achteck (drei sichtbare Seiten) */
  k += `<path d="${q([[TO + .6, -411.4, zV], [TW - .6, -411.4, zV], [TW - .6, -422.6, zV], [TW - .6, -422.6, zV + 1.1], [TW - .6, -411.4, zV + 1.1], [TO + .6, -411.4, zV + 1.1]])}" fill="#d98a6c"/>`;
  const okt = (e, n) => [e, n];
  const O = [okt(287, -413.5), okt(283.5, -412.2), okt(280, -413.5), okt(279.2, -417), okt(280, -420.5)];
  for (let i = 0; i < 4; i++) {
    const [ea, na] = O[i], [eb, nb] = O[i + 1];
    k += `<path d="${q([[ea, na, zV + 1.1], [eb, nb, zV + 1.1], [eb, nb, zA], [ea, na, zA]])}" fill="${i < 2 ? ROT_N : ROT_W}"/>`;
    const em = (ea + eb) / 2, nm = (na + nb) / 2, p = proj(em, nm, zV + 3), s = FOC / tief(em, nm);
    k += `<path d="M${r(p[0] - s * .7)} ${r(p[1])} V${r(p[1] - s * 5.4)} Q${r(p[0])} ${r(p[1] - s * 6.6)} ${r(p[0] + s * .7)} ${r(p[1] - s * 5.4)} V${r(p[1])} Z" fill="#2c1d1a"/>`;
  }
  for (let x = 0; x <= 12; x++) { const t = x / 12, e = TO + .4 + (TW - .4 - TO - .4) * t, p = proj(e, -411.4, zV + 1.1), s = FOC / tief(e, -411.4); k += `<path d="M${r(p[0])} ${r(p[1])} v${r(-s * 1.1)}" stroke="#c86e54" stroke-width=".22"/>`; }
  k += `<path d="${pfad([proj(TO + .4, -411.4, zV + 2.3), proj(TW - .4, -411.4, zV + 2.3), proj(TW - .4, -422.6, zV + 2.3)], false)}" stroke="#efaa8c" stroke-width=".4" fill="none"/>`;
  /* geschweifte Haube mit Laterne und kleiner Haube */
  const T = proj(283.5, -417, zA), s = FOC / tief(283.5, -417), Y = (z) => T[1] - (z - zA) * s;
  k += `<path d="M${r(T[0] - 5 * s)} ${r(Y(zA))} Q${r(T[0] - 5.8 * s)} ${r(Y(zA + 4.6))} ${r(T[0] - 2.6 * s)} ${r(Y(zA + 6.6))} Q${r(T[0] - 1 * s)} ${r(Y(zA + 7.6))} ${r(T[0] - 1.1 * s)} ${r(Y(zA + 9.4))} L${r(T[0] + 1.1 * s)} ${r(Y(zA + 9.4))} Q${r(T[0] + 1 * s)} ${r(Y(zA + 7.6))} ${r(T[0] + 2.6 * s)} ${r(Y(zA + 6.6))} Q${r(T[0] + 5.8 * s)} ${r(Y(zA + 4.6))} ${r(T[0] + 5 * s)} ${r(Y(zA))} Z" fill="${SCHIEFER}"/>`;
  k += `<path d="M${r(T[0] + 2.8 * s)} ${r(Y(zA + 6))} Q${r(T[0] + 4.8 * s)} ${r(Y(zA + 4.2))} ${r(T[0] + 4.5 * s)} ${r(Y(zA + .6))}" stroke="#b5c0ca" stroke-width=".4" fill="none"/>`;
  k += `<rect x="${r(T[0] - 1.5 * s)}" y="${r(Y(zA + 13.4))}" width="${r(3 * s)}" height="${r(4 * s)}" fill="${SCHIEFER}"/><rect x="${r(T[0] - 1 * s)}" y="${r(Y(zA + 12.8))}" width="${r(.7 * s)}" height="${r(2.6 * s)}" fill="#f2deb0"/><rect x="${r(T[0] + .3 * s)}" y="${r(Y(zA + 12.8))}" width="${r(.7 * s)}" height="${r(2.6 * s)}" fill="#f2deb0"/>`;
  k += `<path d="M${r(T[0] - 1.9 * s)} ${r(Y(zA + 13.4))} Q${r(T[0] - 1.8 * s)} ${r(Y(zA + 15.4))} ${r(T[0])} ${r(Y(zA + 16.6))} Q${r(T[0] + 1.8 * s)} ${r(Y(zA + 15.4))} ${r(T[0] + 1.9 * s)} ${r(Y(zA + 13.4))} Z" fill="${SCHIEFER}"/>`;
  k += `<path d="M${r(T[0])} ${r(Y(zA + 16.6))} V${r(Y(zA + 21.6))}" stroke="#3a4049" stroke-width=".35"/><circle cx="${r(T[0])}" cy="${r(Y(zA + 18.2))}" r=".45" fill="#e8c35a"/><path d="M${r(T[0] - .7)} ${r(Y(zA + 20.6))} h1.4" stroke="#e8c35a" stroke-width=".3"/>`;
  /* verdeckt von den Häusern davor: nur der Teil über ihrer Dachlinie ist zu sehen */
  const xL = 200, xR = 262, oben = [];
  for (let x = xR; x >= xL; x -= .5) {
    let ym = 300;
    for (const u of VORNE) { for (let i = 0; i < u.length; i++) { const a = u[i], b = u[(i + 1) % u.length]; if ((x - a[0]) * (x - b[0]) <= 0 && a[0] !== b[0]) { const y = a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]); if (y < ym) ym = y; } } }
    oben.push([x, Math.min(ym, 200)]);
  }
  S.def(`<clipPath id="${S.id("hgkclip")}"><path d="${pfad([[xL, 0], [xR, 0], ...oben])}"/></clipPath>`);
  const tp = proj(283.5, -417, 45);
  S.teil({ id: "heiliggeistkirche", de: "die Heiliggeistkirche", syl: "HEI-lig-geist-kir-che", it: "la chiesa dello Spirito Santo", itSyl: "CHIE-sa del-lo SPI-ri-to SAN-to", en: "Church of the Holy Spirit",
    x: 0, y: 0, kunst: `<g clip-path="url(#${S.id("hgkclip")})">${k}</g>`, tipp: "Die Heiliggeistkirche ist die größte Kirche der Altstadt. Ihr steiles Schieferdach ist fast so hoch wie die Mauern und hat viele kleine Gauben.",
    zoom: { x: 194, y: 80, w: 72, h: 48 },
    unter: [
      { id: "kirchturm", de: "der Kirchturm", syl: "KIRCH-turm", it: "il campanile", itSyl: "cam-pa-NI-le", en: "church tower", x: tp[0], y: tp[1], kunst: flaeche(-4, -32, 8, 40),
        tipp: "Der Turm der Heiliggeistkirche ist 82 Meter hoch. Oben trägt er eine barocke Haube mit Laterne." },
    ] });
}

/* =====================================================================
   8 — DIE ALTE BRÜCKE — Lupe: Bogen, Laterne
   ===================================================================== */
const ZB = 12.2, ZP = 13.6;
{
  let k = "";
  /* gegenüberliegende Brüstung (Ostseite): schmaler Streifen hinter der Fahrbahn */
  { const o = [], u = []; for (let i = 0; i <= 20; i++) { const s = -0.02 + i / 20 * 1.08; o.push(bp(s, ZP, OST)); u.push(bp(s, ZB, OST)); } k += `<path d="${pfad([...o, ...u.reverse()])}" fill="#a24a37"/>`; }
  /* Fahrbahn mit Spaziergängern (Oktobernachmittag: viel Betrieb) */
  { const o = [], u = []; for (let i = 0; i <= 20; i++) { const s = -0.02 + i / 20 * 1.08; o.push(bp(s, ZB, OST)); u.push(bp(s, ZB, WEST)); } k += `<path d="${pfad([...o, ...u.reverse()])}" fill="#b9a690"/>`; }
  for (let i = 0; i < 26; i++) {
    const s = 0.03 + rnd() * 1.0, seite = [WEST[0] * (rnd() * 1.6 - .8), WEST[1] * (rnd() * 1.6 - .8)], p = bp(s, ZB, seite), sk = FOC / tief(BN[0] + (BS[0] - BN[0]) * s, BN[1] + (BS[1] - BN[1]) * s);
    /* Menschen in echter Größe (≈ 1,75 m): Beine, Oberkörper, Kopf; Licht von rechts */
    const c = ["#b8473a", "#2f5f95", "#e8e4da", "#3a3a3a", "#d8ad3a", "#4f8a46", "#e07a2e"][i % 7], h = 2.6 * sk;
    k += `<path d="M${r(p[0] - .12 * sk)} ${r(p[1])} v${r(-h * .45)} M${r(p[0] + .12 * sk)} ${r(p[1])} v${r(-h * .45)}" stroke="#3a3a44" stroke-width="${r(.2 * sk)}"/><path d="M${r(p[0])} ${r(p[1] - h * .42)} v${r(-h * .38)}" stroke="${c}" stroke-width="${r(.55 * sk)}" stroke-linecap="round"/><circle cx="${r(p[0])}" cy="${r(p[1] - h * .9)}" r="${r(.17 * h)}" fill="#e2b48e"/>`;
  }
  /* Ansichtsfläche der Westseite — im Abendlicht */
  { const o = [], u = []; for (let i = 0; i <= 30; i++) { const s = -0.02 + i / 30 * 1.08; o.push(bp(s, ZP)); u.push(bp(s, s > 1.01 ? 6 : 0)); } k += `<path d="${pfad([...o, ...u.reverse()])}" fill="${S.lg("bruecke", [[0, "#a84d38"], [0.5, "#c86448"], [1, "#d9785a"]], 0, 0, 1, 0)}"/>`; }
  /* neun Bögen; Pfeiler mit Vorköpfen und Kappen */
  for (let j = 0; j < 9; j++) {
    const [a, b] = BOGEN(j), pts = [];
    for (let i = 0; i <= 12; i++) { const t = i / 12; pts.push(bp(a + (b - a) * t, bogenZ(t))); }
    k += `<path d="${pfad([bp(a, 0), ...pts, bp(b, 0)])}" fill="${S.lg("bogen", [[0, "#24181a"], [0.5, "#3b302d"], [0.78, "#56645f"], [0.9, "#9ab4ae"], [1, "#c8dad2"]])}"/>`;
    k += `<path d="${pfad(pts, false)}" stroke="#eca07e" stroke-width=".55" fill="none"/><path d="${pfad(pts.slice(0, 6), false)}" stroke="#7a3428" stroke-width=".3" fill="none" transform="translate(-.2 .3)"/>`;
    if (j < 8) {
      const s = (j + 1) / 9, p0 = bp(s - PFEILER, 0), p1 = bp(s + PFEILER, 0), top = bp(s, 4.8), tl = bp(s - PFEILER, 3.4), tr = bp(s + PFEILER, 3.4);
      k += `<path d="${pfad([p0, tl, top, tr, p1])}" fill="#d97a5c"/><path d="${pfad([tl, top, tr], false)}" stroke="#f2b294" stroke-width=".3" fill="none"/>`;
      /* Gischt am Pfeilerfuß */
      const g0 = bp(s - PFEILER * 1.5, -.2), g1 = bp(s + PFEILER * 1.5, -.2);
      k += `<path d="M${P(g0)} Q${r((g0[0] + g1[0]) / 2)} ${r((g0[1] + g1[1]) / 2 + .7)} ${P(g1)}" stroke="#f4faf8" stroke-width=".45" fill="none" opacity=".85"/>`;
      k += `<path d="${pfad([bp(s + PFEILER * .6, 4.2), bp(s + PFEILER * .6, ZB - .6)], false)}" stroke="#eca07e" stroke-width=".35"/>`;
    }
  }
  /* Brüstung aus rotem Sandstein: eigener Streifen mit Fugen und heller Deckplatte */
  { const o = [], u = [], fu = []; for (let i = 0; i <= 30; i++) { const s = -0.02 + i / 30 * 1.08; o.push(bp(s, ZP + .3)); u.push(bp(s, ZB - .3)); }
    for (let i = 1; i < 60; i++) { const s = -0.02 + i / 60 * 1.08; fu.push(`M${P(bp(s, ZB - .2))} L${P(bp(s, ZP + .2))}`); }
    k += `<path d="${pfad([...o, ...u.reverse()])}" fill="#c4684c"/><path d="${fu.join(" ")}" stroke="#7a3428" stroke-width=".12" opacity=".6"/>`; }
  /* Gesims und Brüstungskrone */
  { const g = [], t = []; for (let i = 0; i <= 30; i++) { const s = -0.02 + i / 30 * 1.08; g.push(bp(s, ZB)); t.push(bp(s, ZP)); } k += `<path d="${pfad(g, false)}" stroke="#f0aa88" stroke-width=".6" fill="none"/><path d="${pfad(t, false)}" stroke="#ffd0b0" stroke-width=".5" fill="none"/>`; }
  /* Laternen auf der Brüstung */
  const LAT = [];
  for (const s of [0.11, 0.33, 0.44, 0.56, 0.67, 0.89, 1.0]) {
    const sk = FOC / tief(BN[0] + (BS[0] - BN[0]) * s, BN[1] + (BS[1] - BN[1]) * s), a = bp(s, ZP), b = [a[0], a[1] - 4.4 * sk * 1.1];
    k += `<path d="M${P(a)} L${P(b)}" stroke="#2f2a28" stroke-width="${r(.32 * sk)}"/><path d="M${r(b[0] - .5 * sk)} ${r(b[1] + .3 * sk)} h${r(sk)} l${r(-.2 * sk)} ${r(-1.1 * sk)} h${r(-.6 * sk)} Z" fill="#f6e6b8" stroke="#2f2a28" stroke-width=".12"/>`;
    LAT.push([b[0], b[1]]);
  }
  const bM = bp(5.5 / 9, 6);
  S.teil({ id: "alte_bruecke", de: "die Alte Brücke", syl: "AL-te BRÜ-cke", it: "il Ponte Vecchio", itSyl: "PON-te VEC-chio", en: "Old Bridge", x: 0, y: 0, kunst: k,
    tipp: "Die Alte Brücke ist rund 200 Meter lang. Sie wurde 1788 aus rotem Sandstein gebaut.",
    zoom: { x: 84, y: 112, w: 78, h: 52 },
    unter: [
      { id: "bogen", de: "der Bogen", syl: "BO-gen", it: "l'arco", itSyl: "AR-co", en: "arch", x: bM[0], y: bM[1], kunst: flaeche(-5, -3, 10, 6),
        tipp: "Die Brücke hat neun Bögen. Bei Hochwasser fließt das Wasser durch alle." },
      { id: "laterne", de: "die Laterne", syl: "la-TER-ne", it: "il lampione", itSyl: "lam-PIO-ne", en: "street lamp", x: LAT[3][0], y: LAT[3][1], kunst: LAT.slice(2, 6).map(([x, y]) => flaeche(x - LAT[3][0] - 1.3, y - LAT[3][1] - 1.6, 2.6, 5, 0.4)).join(""),
        tipp: "Am Abend leuchten die Laternen auf der Brücke." },
    ] });
}

/* =====================================================================
   9 — DAS DENKMAL (Minerva und Kurfürst Karl Theodor auf den Pfeilern)
   ===================================================================== */
{
  let k = "";
  /* Postament rot (Neckartäler Sandstein); Minerva hell-rötlich, Karl Theodor mit dunklerer Patina */
  const POST = S.lg("postament", [[0, "#8a3c2c"], [.6, "#c0644a"], [1, "#e89474"]], 0, 0, 1, 0);
  const denkmal = (s, minerva) => {
    const fuss = bp(s, ZP), sk = FOC / tief(BN[0] + (BS[0] - BN[0]) * s, BN[1] + (BS[1] - BN[1]) * s) * 1.3, x = fuss[0], y = fuss[1];
    const STEIN = minerva ? S.lg("minerva", [[0, "#9a5a46"], [.6, "#d0907a"], [1, "#f0b89c"]], 0, 0, 1, 0) : S.lg("kurfuerst", [[0, "#4a463e"], [.6, "#7a7466"], [1, "#a8a090"]], 0, 0, 1, 0);
    /* hohes, gestuftes Postament über dem Pfeiler */
    let g = `<rect x="${r(x - 1.4 * sk)}" y="${r(y - .9 * sk)}" width="${r(2.8 * sk)}" height="${r(.9 * sk)}" fill="#a85640"/>`;
    g += `<rect x="${r(x - 1 * sk)}" y="${r(y - 3.4 * sk)}" width="${r(2 * sk)}" height="${r(2.5 * sk)}" fill="${POST}"/><rect x="${r(x - 1.25 * sk)}" y="${r(y - 3.7 * sk)}" width="${r(2.5 * sk)}" height="${r(.32 * sk)}" fill="#f0a684"/>`;
    g += `<rect x="${r(x - .55 * sk)}" y="${r(y - 2.8 * sk)}" width="${r(1.1 * sk)}" height="${r(1.2 * sk)}" fill="#8a4434"/>`;
    const fy = y - 3.7 * sk;
    if (minerva) {
      /* Minerva: Helm mit Busch, runder Schild, Lanze */
      g += `<path d="M${r(x - .5 * sk)} ${r(fy)} L${r(x - .35 * sk)} ${r(fy - 2.6 * sk)} Q${r(x)} ${r(fy - 2.9 * sk)} ${r(x + .35 * sk)} ${r(fy - 2.6 * sk)} L${r(x + .55 * sk)} ${r(fy)} Z" fill="${STEIN}"/>`;
      g += `<circle cx="${r(x)}" cy="${r(fy - 3.15 * sk)}" r="${r(.32 * sk)}" fill="#e0a084"/><path d="M${r(x - .38 * sk)} ${r(fy - 3.3 * sk)} Q${r(x - .1 * sk)} ${r(fy - 4.4 * sk)} ${r(x + .55 * sk)} ${r(fy - 3.4 * sk)} Q${r(x + .1 * sk)} ${r(fy - 3.7 * sk)} ${r(x - .38 * sk)} ${r(fy - 3.3 * sk)} Z" fill="#8a4a38"/>`;
      g += `<circle cx="${r(x - .62 * sk)}" cy="${r(fy - 1.1 * sk)}" r="${r(.6 * sk)}" fill="#b87058"/><circle cx="${r(x - .62 * sk)}" cy="${r(fy - 1.1 * sk)}" r="${r(.25 * sk)}" fill="#d89478"/>`;
      g += `<path d="M${r(x + .7 * sk)} ${r(fy + .1)} L${r(x + .7 * sk)} ${r(fy - 4.8 * sk)}" stroke="#6a3a2c" stroke-width="${r(.13 * sk)}"/><path d="M${r(x + .7 * sk)} ${r(fy - 4.8 * sk)} l${r(-.14 * sk)} ${r(.5 * sk)} h${r(.28 * sk)} Z" fill="#6a3a2c"/>`;
    } else {
      /* Karl Theodor im Kurfürstenmantel mit Hermelinkragen (weiß mit Schwänzchen), Stab */
      g += `<path d="M${r(x - .75 * sk)} ${r(fy)} Q${r(x - .6 * sk)} ${r(fy - 1.6 * sk)} ${r(x - .35 * sk)} ${r(fy - 2.6 * sk)} Q${r(x)} ${r(fy - 2.9 * sk)} ${r(x + .35 * sk)} ${r(fy - 2.6 * sk)} Q${r(x + .7 * sk)} ${r(fy - 1.4 * sk)} ${r(x + .8 * sk)} ${r(fy)} Z" fill="${STEIN}"/>`;
      g += `<path d="M${r(x - .45 * sk)} ${r(fy - 2.5 * sk)} Q${r(x)} ${r(fy - 2 * sk)} ${r(x + .45 * sk)} ${r(fy - 2.5 * sk)}" stroke="#f2ecdc" stroke-width="${r(.3 * sk)}" fill="none"/>`;
      for (const dx of [-.25, 0, .25]) g += `<circle cx="${r(x + dx * sk)}" cy="${r(fy - 2.3 * sk)}" r="${r(.05 * sk)}" fill="#1d1d1d"/>`;
      g += `<circle cx="${r(x)}" cy="${r(fy - 3.15 * sk)}" r="${r(.32 * sk)}" fill="#9a9484"/><path d="M${r(x + .5 * sk)} ${r(fy - 1.6 * sk)} L${r(x + .95 * sk)} ${r(fy - 3 * sk)}" stroke="#3a3630" stroke-width="${r(.12 * sk)}"/>`;
    }
    /* Lichtkante rechts (Westsonne) */
    g += `<path d="M${r(x + 1 * sk)} ${r(y - .9 * sk)} V${r(y - 3.4 * sk)}" stroke="#ffd0b0" stroke-width="${r(.12 * sk)}" opacity=".7"/>`;
    return { g, top: [x, fy - 3.6 * sk], sk };
  };
  const mi = denkmal(2 / 9, true), kt = denkmal(7 / 9, false);
  k += mi.g + kt.g;
  S.teil({ id: "denkmal", de: "das Denkmal", syl: "DENK-mal", it: "il monumento", itSyl: "mo-nu-MEN-to", en: "monument", x: kt.top[0], y: kt.top[1] + 3, kunst: `<g transform="translate(${r(-kt.top[0])} ${r(-kt.top[1] - 3)})">${k}</g>`,
    tipp: "Auf zwei Pfeilern stehen Denkmäler: auf der Altstadtseite Kurfürst Karl Theodor, der die Brücke bauen ließ, auf der Neuenheimer Seite Minerva, die Göttin der Weisheit." });
}

/* =====================================================================
   10 — DAS BRÜCKENTOR mit dem BRÜCKENAFFEN — Lupe: Turmhaube, Brückenaffe
   Zwei gleich hohe Rundtürme auf dem Brückenkopf, dazwischen der schmale Mittelbau mit der spitzbogigen
   Durchfahrt (Fallgatternische); die Fahrbahn der Brücke führt genau hinein. Weißer Putz, Sockel,
   Gesimse und Torrahmen aus rotem Sandstein; barocke „welsche“ Hauben aus Schiefer (unten eingezogen,
   geschweift, oben Laterne, Spitze und Knauf). Abendsonne von rechts (Westen).
   ===================================================================== */
{
  const G = proj(330, -372, ZB), GE = 1.25;
  const gp = (e, n, z) => { const p = proj(e, n, z); return [G[0] + GE * (p[0] - G[0]), G[1] + GE * (p[1] - G[1])]; };
  const NA = [.279, .96], WA = [-.96, .279];                   // Brückenachse nach Norden, Torfront nach Westen
  const at = (u, v) => [330 + WA[0] * u + NA[0] * v, -372 + WA[1] * u + NA[1] * v];   // u: nach Westen, v: nach Norden
  const Z0 = ZB - 2.4, ZT = ZB + 16.6, ZM = ZB + 11.4;
  let k = "";
  const TP = S.lg("torputz", [[0, "#8a8478"], [.35, "#cfc8ba"], [.72, "#f6f0e2"], [.86, "#fff2d6"], [1, "#d8c4a4"]], 0, 0, 1, 0);
  const SST = "#b4553f", SST_L = "#e08a68";
  /* Brückenkopf: Sockelmauer aus Sandstein unter dem ganzen Tor */
  {
    const a = gp(...at(-9.5, 2.4), 6), b = gp(...at(10, 2.4), 6), c = gp(...at(10, 2.4), Z0 + .6), d = gp(...at(-9.5, 2.4), Z0 + .6);
    k += `<path d="${pfad([a, b, c, d])}" fill="${S.lg("torsockel", [[0, "#7c3628"], [1, "#c06a4e"]], 0, 0, 1, 0)}"/><path d="${pfad(Array.from({ length: 8 }, (_, i) => gp(...at(-9.5 + i * 2.8, 2.45), 6 + (Z0 - 5.4) * .5)), false)}" stroke="#5a2418" stroke-width=".18" opacity=".5" fill="none"/>`;
  }
  const turm = (u, dunkel) => {
    const [e, n] = at(u, 0), f = gp(e, n, Z0), t = gp(e, n, ZT), sk = FOC / tief(e, n) * GE, R = 3.7 * sk, cx = f[0];
    const y = (z) => gp(e, n, z)[1];
    let g = `<path d="M${r(cx - R)} ${r(f[1])} V${r(t[1])} H${r(cx + R)} V${r(f[1])} Z" fill="${TP}"/>`;
    if (dunkel) g += `<path d="M${r(cx - R)} ${r(f[1])} V${r(t[1])} H${r(cx + R)} V${r(f[1])} Z" fill="#3a3028" opacity=".16"/>`;
    /* Sandsteinsockel, Gurtgesims, Traufgesims mit Lichtkante rechts */
    for (const [z0, z1] of [[Z0, Z0 + 1.6], [ZB + 7.6, ZB + 8.3], [ZT - .4, ZT + .7]]) g += `<path d="M${r(cx - R - .15)} ${r(y(z0))} V${r(y(z1))} H${r(cx + R + .15)} V${r(y(z0))} Z" fill="${SST}"/><path d="M${r(cx + R * .45)} ${r(y(z0))} V${r(y(z1))} H${r(cx + R + .15)} V${r(y(z0))} Z" fill="${SST_L}" opacity=".7"/>`;
    /* kleine Fenster mit Sandsteingewänden auf der sichtbaren Rundung */
    for (const [dx, z] of [[-.15, ZB + 3.6], [.35, ZB + 5.4], [-.1, ZB + 10.4], [.4, ZB + 12.8], [0, ZB + 14.8]]) {
      const x = cx + dx * R, w = Math.max(.6, .55 * sk * (1 - Math.abs(dx))), h = 1.3 * sk;
      g += `<rect x="${r(x - w / 2 - .18)}" y="${r(y(z) - h - .18)}" width="${r(w + .36)}" height="${r(h + .36)}" fill="${SST}"/><rect x="${r(x - w / 2)}" y="${r(y(z) - h)}" width="${r(w)}" height="${r(h)}" fill="#2e2a2a"/>`;
    }
    /* welsche Haube: unten eingezogen, geschweift gebaucht, Laterne, Spitze, Knauf */
    const prof = [[0, 1.08], [.5, .86], [1.2, .8], [2.4, .93], [3.4, .86], [4.4, .58], [5.1, .28], [5.5, .24], [5.9, .34], [6.5, .3], [7, .14], [8.4, .05]];
    const hz = (h) => y(ZT + .7 + h * 1.08);
    const L = prof.map(([h, q]) => [cx - q * R, hz(h)]), Rr = prof.map(([h, q]) => [cx + q * R, hz(h)]).reverse();
    g += `<path d="M${L.map(P).join(" L")} L${Rr.map(P).join(" L")} Z" fill="${S.lg("haube", [[0, "#272c34"], [.55, "#4a5462"], [.8, "#8c97a4"], [1, "#56606c"]], 0, 0, 1, 0)}"/>`;
    g += `<path d="M${P([cx + .5 * R, hz(.6)])} Q${P([cx + .78 * R, hz(1.8)])} ${P([cx + .62 * R, hz(3.6)])}" stroke="#c8d2dc" stroke-width=".35" fill="none" opacity=".8"/>`;
    g += `<path d="M${r(cx - .24 * R)} ${r(hz(5.25))} H${r(cx + .24 * R)}" stroke="#e8c35a" stroke-width=".25"/>`;
    const kn = hz(8.4);
    g += `<circle cx="${r(cx)}" cy="${r(kn - .45)}" r=".5" fill="#e8c35a"/><path d="M${r(cx)} ${r(kn - .9)} V${r(kn - 2.6)}" stroke="#3a4049" stroke-width=".3"/>`;
    return { g, haube: [cx, hz(2.4)], w: 2 * R, cx, R, f };
  };
  /* Ostturm (links, weiter weg) */
  const ost = turm(-8, true);
  k += ost.g;
  /* das Ende der Brückenfahrbahn liegt vor dem Ostturm und führt in die Durchfahrt */
  k += `<path d="${pfad([gp(...at(-3.6, 1.2), ZB), gp(...at(3.6, 1.2), ZB), gp(...at(3.6, 16), ZB), gp(...at(-3.6, 16), ZB)])}" fill="#b9a690"/>`;
  k += `<path d="${pfad([gp(...at(-3.6, 1.2), ZB), gp(...at(-3.6, 16), ZB), gp(...at(-3.6, 16), ZP + .3), gp(...at(-3.6, 1.2), ZP + .3)])}" fill="#a24a37"/>`;
  /* Mittelbau: Front zwischen den Türmen, Schieferdach, Durchfahrt mit Spitzbogen und Fallgatternische */
  {
    const fr = (u, z) => gp(...at(u, 1.2), z);
    k += `<path d="${pfad([fr(-8, ZM), fr(8, ZM), gp(...at(8, -3.5), ZM + 3.6), gp(...at(-8, -3.5), ZM + 3.6)])}" fill="${SCHIEFER}"/>`;
    k += `<path d="${pfad([fr(-8, Z0), fr(8, Z0), fr(8, ZM), fr(-8, ZM)])}" fill="${S.lg("torfront", [[0, "#b8b0a2"], [1, "#e2dacb"]], 0, 0, 1, 0)}"/>`;
    k += `<path d="${pfad([fr(-8, ZM - .5), fr(8, ZM - .5), fr(8, ZM + .2), fr(-8, ZM + .2)])}" fill="${SST}"/>`;
    const bogen = (w, zk, zs) => { const pts = [fr(-w / 2, ZB)]; for (let i = 0; i <= 10; i++) { const t = i / 10, a = (Math.PI / 3) * (t < .5 ? 2 * t : 2 * (1 - t)); pts.push(fr(t < .5 ? -w / 2 + w - w * Math.cos(a) : w / 2 - w + w * Math.cos(a), zk + w * Math.sin(a) * (zs - zk) / (.866 * w))); } pts.push(fr(w / 2, ZB)); return pts; };
    k += `<path d="${pfad(bogen(5.6, ZB + 4.4, ZB + 8.2))}" fill="${SST}"/>`;
    k += `<path d="${pfad(bogen(4.2, ZB + 4.2, ZB + 7.4))}" fill="${S.lg("durchfahrt", [[0, "#1c1412"], [1, "#4a3830"]])}"/>`;
    /* Fallgatternische: dunkler Schlitz über dem Bogen, unten die Spitzen des hochgezogenen Gatters */
    k += `<path d="${pfad([fr(-1.9, ZB + 6.6), fr(1.9, ZB + 6.6), fr(1.9, ZB + 6.95), fr(-1.9, ZB + 6.95)])}" fill="#120c0a"/>`;
    let gz = ""; for (let u = -1.6; u <= 1.65; u += .55) gz += `M${P(fr(u, ZB + 6.6))} L${P(fr(u, ZB + 5.9))} `;
    k += `<path d="${gz}" stroke="#2a2420" stroke-width=".3"/>`;
    const w1 = fr(0, ZB + 9.4);
    k += `<rect x="${r(w1[0] - .5)}" y="${r(w1[1] - 1.1)}" width="1" height="1.2" fill="#2e2a2a" stroke="${SST}" stroke-width=".25"/>`;
  }
  /* Westturm (rechts, näher) */
  const west = turm(8, false);
  k += west.g;
  /* Abendschatten der Türme nach links auf die Häuser dahinter */
  k += `<path d="M${r(ost.cx - ost.R)} ${r(ost.f[1] - 3)} l-7 -2.6 l0 -15 l7 2.6 Z" fill="#1d140c" opacity=".14"/>`;
  /* der Brückenaffe (Bronze) auf Fahrbahnhöhe rechts neben der Durchfahrt, mit Spiegel; daneben zwei Mäuse */
  const A = gp(...at(6.4, 4.6), ZB), sa = FOC / tief(...at(6.4, 4.6)) * GE * 1.5;
  const BR = S.lg("bronze", [[0, "#3e2c18"], [0.5, "#7d5e32"], [1, "#d4ac62"]], 0, 0, 1, 0);
  k += `<rect x="${r(A[0] - .75 * sa)}" y="${r(A[1] - .45 * sa)}" width="${r(1.5 * sa)}" height="${r(.45 * sa)}" fill="#a89a88"/>`;
  k += `<ellipse cx="${r(A[0])}" cy="${r(A[1] - .95 * sa)}" rx="${r(.42 * sa)}" ry="${r(.52 * sa)}" fill="${BR}"/><circle cx="${r(A[0])}" cy="${r(A[1] - 1.66 * sa)}" r="${r(.3 * sa)}" fill="${BR}"/><ellipse cx="${r(A[0] + .05 * sa)}" cy="${r(A[1] - 1.58 * sa)}" rx="${r(.17 * sa)}" ry="${r(.13 * sa)}" fill="#a88450"/>`;
  k += `<circle cx="${r(A[0] - .27 * sa)}" cy="${r(A[1] - 1.85 * sa)}" r="${r(.1 * sa)}" fill="#5a4024"/><circle cx="${r(A[0] + .27 * sa)}" cy="${r(A[1] - 1.85 * sa)}" r="${r(.1 * sa)}" fill="#7d5e32"/>`;
  k += `<path d="M${r(A[0] + .3 * sa)} ${r(A[1] - 1.15 * sa)} L${r(A[0] + .66 * sa)} ${r(A[1] - 1.8 * sa)}" stroke="#7d5e32" stroke-width="${r(.13 * sa)}" stroke-linecap="round"/><circle cx="${r(A[0] + .74 * sa)}" cy="${r(A[1] - 2.06 * sa)}" r="${r(.24 * sa)}" fill="#e6f0f6" stroke="#9a7a42" stroke-width="${r(.06 * sa)}"/>`;
  k += `<path d="M${r(A[0] - .3 * sa)} ${r(A[1] - .5 * sa)} q${r(-.5 * sa)} ${r(.1 * sa)} ${r(-.6 * sa)} ${r(-.4 * sa)}" stroke="#6a4e28" stroke-width="${r(.1 * sa)}" fill="none"/>`;
  for (const dx of [-1.15, 1.1]) { const mx = A[0] + dx * sa, my = A[1] - .5 * sa; k += `<ellipse cx="${r(mx)}" cy="${r(my - .1 * sa)}" rx="${r(.17 * sa)}" ry="${r(.1 * sa)}" fill="#8a6a3a"/><circle cx="${r(mx + Math.sign(dx) * .17 * sa)}" cy="${r(my - .16 * sa)}" r="${r(.07 * sa)}" fill="#a88450"/><circle cx="${r(mx + Math.sign(dx) * .12 * sa)}" cy="${r(my - .24 * sa)}" r="${r(.05 * sa)}" fill="#c8a060"/>`; }
  const GZ = gp(330, -372, ZB + 10);
  S.teil({ id: "brueckentor", de: "das Brückentor", syl: "BRÜ-cken-tor", it: "la porta del ponte", itSyl: "POR-ta del PON-te", en: "bridge gate", x: GZ[0], y: GZ[1], kunst: `<g transform="translate(${r(-GZ[0])} ${r(-GZ[1])})">${k}</g>`,
    tipp: "Das Brückentor war früher Teil der Stadtmauer. Zwischen den zwei runden Türmen führt die Straße durch einen Torbogen in die Altstadt. Es ist 28 Meter hoch.",
    zoom: { x: r(GZ[0] - 27), y: r(GZ[1] - 18), w: 54, h: 36 },
    unter: [
      { id: "turmhaube", de: "die Turmhaube", syl: "TURM-hau-be", it: "la cupola della torre", itSyl: "CU-po-la del-la TOR-re", en: "tower cap", x: west.haube[0], y: west.haube[1], kunst: flaeche(-west.w / 2 - .4, -6, west.w + .8, 8) + flaeche(ost.haube[0] - west.haube[0] - ost.w / 2 - .4, ost.haube[1] - west.haube[1] - 6, Math.min(ost.w + .8, west.haube[0] - west.w / 2 - .4 - (ost.haube[0] - ost.w / 2 - .4)), 8),
        tipp: "Seit 1788 tragen beide Türme barocke Hauben aus Schiefer." },
      { id: "brueckenaffe", de: "der Brückenaffe", syl: "BRÜ-cken-af-fe", it: "la scimmia del ponte", itSyl: "SCIM-mia del PON-te", en: "bridge monkey", x: A[0], y: A[1], kunst: flaeche(-1.5 * sa, -2.4 * sa, 3 * sa, 2.5 * sa, 0.4),
        tipp: "Der Affe aus Bronze hält einen Spiegel, daneben sitzen zwei Mäuse. Wer den Spiegel berührt, wird reich. Wer seine Finger berührt, kommt wieder nach Heidelberg — sagt man." },
    ] });
}

/* =====================================================================
   11 — DAS AUSFLUGSSCHIFF (neckarabwärts nach rechts)
   ===================================================================== */
{
  const p = proj(250, -300, 0), s = FOC / tief(250, -300) * 1.05;
  let k = schatten(0, .3, 20, 1.2, .25);
  k += `<path d="M-23 -.6 q-4 .8 -8 .2 M21 -.5 q5 1 11 .2" stroke="#eef3f1" stroke-width=".6" fill="none" opacity=".85"/>`;
  k += `<path d="M-21 -4.6 L18 -4.6 Q22 -4.4 23.6 -3 L21 .4 L-19.6 .4 Q-21 -1.6 -21 -4.6 Z" fill="${S.lg("rumpf", [[0, "#ffffff"], [0.6, "#e9ecee"], [0.62, "#1f3f78"], [0.8, "#1f3f78"], [0.82, "#d9dde0"], [1, "#d9dde0"]])}"/>`;
  k += `<rect x="-18" y="-8.6" width="32" height="4" rx=".6" fill="#fbfbf8"/>`;
  for (let x = -16.6; x < 13; x += 2.4) k += `<rect x="${r(x)}" y="-7.9" width="1.8" height="2.2" rx=".3" fill="#3a5568"/>`;
  k += `<rect x="-19" y="-9.4" width="34" height=".8" fill="#e3e7ea"/><path d="M-18 -9.4 V-11 H14 V-9.4" stroke="#9aa3aa" stroke-width=".25" fill="none"/>`;
  for (let x = -16; x < 14; x += 2.2) k += `<line x1="${x}" y1="-9.4" x2="${x}" y2="-11" stroke="#9aa3aa" stroke-width=".15"/>`;
  k += `<rect x="8" y="-13.4" width="6.4" height="4" rx=".5" fill="#fbfbf8"/><rect x="8.6" y="-12.8" width="5.2" height="1.6" fill="#2e4658"/>`;
  for (const [x, c] of [[-14, "#b8473a"], [-11, "#2f5f95"], [-6, "#d8ad3a"], [-3, "#eeefec"], [1, "#4f8a46"]]) k += `<rect x="${x}" y="-11.8" width=".9" height="1.6" rx=".3" fill="${c}"/><circle cx="${x + .45}" cy="-12.3" r=".45" fill="#e2b48e"/>`;
  k += `<line x1="-17.6" y1="-4.6" x2="-17.6" y2="-12.4" stroke="#8a8f94" stroke-width=".3"/><rect x="-17.6" y="-12.4" width="2.6" height=".6" fill="#222"/><rect x="-17.6" y="-11.8" width="2.6" height=".6" fill="#c33"/><rect x="-17.6" y="-11.2" width="2.6" height=".6" fill="#e8c23a"/>`;
  k += `<rect x="-21" y="-9.4" width="40" height="5" fill="#ffcf8a" opacity=".12"/>`;
  S.teil({ id: "ausflugsschiff", de: "das Ausflugsschiff", syl: "AUS-flugs-schiff", it: "il battello turistico", itSyl: "bat-TEL-lo tu-RI-sti-co", en: "excursion boat", x: p[0], y: p[1], kunst: `<g transform="scale(${r(s / 1.6 * 100) / 100})">${k}</g>`,
    tipp: "Mit dem Ausflugsschiff fährt man auf dem Neckar bis nach Neckarsteinach." });
}

/* =====================================================================
   12 — DER WEINBERG: ein Streifen direkt unter der Mauer. Die Rebzeilen laufen hangab (vom Betrachter
        weg, im Bild nach oben) und werden kleiner; Pfähle, Drähte, Stöcke, Herbstlaub — Lupe: Weintraube
   ===================================================================== */
const WT = {};
{
  const OB = 177.2, UN = 186.5, VP = [170, 150];
  let k = `<path d="M-1 ${UN} L-1 ${OB + 1.2} Q80 ${OB - .6} 160 ${OB} Q240 ${OB + .5} 321 ${OB - .4} L321 ${UN} Z" fill="${S.lg("weinboden", [[0, "#8f7c55"], [1, "#6e5a3a"]])}"/>`;
  const LF = ["#6d8b3a", "#93a040", "#c2a43e", "#5d7a33", "#b8762e", "#7f9a3c", "#d8a840"];
  let draht = "", pf = "", stock = "", tr = "";
  const laub = ["", "", "", "", "", "", ""];
  for (let i = -2; i < 36; i++) {
    const B0 = [i * 9.6, UN + .5];
    const pts = [];
    for (let t = 0; t <= 1; t += .07) { const x = B0[0] + (VP[0] - B0[0]) * t, y = B0[1] + (VP[1] - B0[1]) * t; if (y < OB + .6) break; if (x < -1 || x > 321) continue; pts.push([x, y, (y - VP[1]) / (B0[1] - VP[1])]); }
    if (pts.length < 2) continue;
    draht += pfad(pts.map(([x, y, sk]) => [x, y - 1.3 * sk]), false) + " " + pfad(pts.map(([x, y, sk]) => [x, y - 2.4 * sk]), false) + " ";
    pts.forEach(([x, y, sk], j) => {
      if (j % 2 === 0) pf += `M${r(x)} ${r(y + .2)}V${r(y - 2.9 * sk)} `;
      stock += `M${r(x)} ${r(y)}q${r(.3 * sk)} ${r(-.6 * sk)} 0 ${r(-1.2 * sk)} `;
      for (let b = 0; b < 2; b++) { const c = Math.floor(rnd() * LF.length), rr = (.6 + rnd() * .5) * sk * 1.1, bx = x + (rnd() - .4) * 1.8 * sk, byy = y - (1.4 + rnd() * 1.2) * sk; laub[c] += `M${r(bx - rr)} ${r(byy)}a${r(rr)} ${r(rr * .8)} 0 1 0 ${r(2 * rr)} 0a${r(rr)} ${r(rr * .8)} 0 1 0 ${r(-2 * rr)} 0`; }
      if (rnd() < .5) tr += `M${r(x + (rnd() - .5) * 1.4 * sk)} ${r(y - 1.1 * sk)}l${r(.3 * sk)} ${r(.6 * sk)}l${r(-.6 * sk)} 0Z`;
    });
  }
  k += `<path d="${draht}" stroke="#d8d0c0" stroke-width=".1" fill="none"/><path d="${pf}" stroke="#8a7458" stroke-width=".22"/><path d="${stock}" stroke="#5a4028" stroke-width=".3" fill="none"/>`;
  laub.forEach((d, c) => { if (d) k += `<path d="${d}" fill="${LF[c]}"/>`; });
  k += `<path d="${tr}" fill="#3d2c52"/>`;
  /* Licht von rechts über den Hang, Dunst nach oben */
  k += `<path d="M-1 ${UN} L-1 ${OB + 1.2} Q80 ${OB - .6} 160 ${OB} Q240 ${OB + .5} 321 ${OB - .4} L321 ${UN} Z" fill="${S.lg("rebenlicht", [[0, "#2a1e10", 0.18], [0.6, "#000", 0], [1, "#ffd890", 0.18]], 0, 0, 1, 0)}"/>`;
  /* die große Traube am vordersten Stock (rechts an der Mauer) */
  {
    const tx = 247, ty = 180.8;
    let g = `<path d="M${tx - 9} ${ty + 4} Q${tx - 4} ${ty - 3} ${tx + 2} ${ty - 4} Q${tx + 6} ${ty - 5} ${tx + 9} ${ty - 2}" stroke="#6a4a2a" stroke-width=".8" fill="none"/>`;
    for (const [x, y, rot, f] of [[-6, 0, -20, "#7a9a3a"], [-1, -4, 10, "#c2a43e"], [5, -4.4, -30, "#b8762e"], [8, -2.4, 20, "#8a9a3a"]]) g += `<path d="M${tx + x} ${ty + y} q-2.2 -2.2 0 -4.2 q2.2 2 0 4.2 Z" fill="${f}" transform="rotate(${rot} ${tx + x} ${ty + y})"/>`;
    for (const [x, y] of [[0, 0], [-1.2, .4], [1.2, .4], [-.6, 1.5], [.6, 1.5], [-1.4, 1.8], [1.4, 1.7], [0, 2.6], [-.9, 3.2], [.9, 3.2], [0, 4.3], [-.4, 5.2], [.4, 5.9]]) g += `<circle cx="${r(tx + x)}" cy="${r(ty + y)}" r=".9" fill="${S.rg("beere", [[0, "#8a7aa8"], [0.5, "#4a3a6a"], [1, "#2a1e3e"]], 0.35, 0.3, 0.7)}"/><circle cx="${r(tx + x - .3)}" cy="${r(ty + y - .3)}" r=".22" fill="#d8d0e8" opacity=".7"/>`;
    g += `<path d="M${tx} ${ty - 4} Q${tx + .4} ${ty - 2} ${tx} ${ty - .8}" stroke="#6a4a2a" stroke-width=".4" fill="none"/>`;
    k += g;
    WT.x = tx; WT.y = ty + 2;
  }
  S.teil({ id: "weinberg", de: "der Weinberg", syl: "WEIN-berg", it: "il vigneto", itSyl: "vi-GNE-to", en: "vineyard", x: 0, y: 0, kunst: k,
    tipp: "Der Philosophenweg führte früher durch Weinberge. Im Oktober ist Weinlese.",
    zoom: { x: 232, y: 158, w: 66, h: 44 },
    unter: [
      { id: "weintraube", de: "die Weintraube", syl: "WEIN-trau-be", it: "il grappolo d'uva", itSyl: "GRAP-po-lo DU-va", en: "bunch of grapes", x: WT.x, y: WT.y, kunst: flaeche(-2.4, -3, 4.8, 6.6, 0.6),
        tipp: "Aus den Trauben vom Neckarhang wird Wein gemacht." },
    ] });
}

/* =====================================================================
   13 — DIE MAUER (roter Sandstein) und 14 — DER PHILOSOPHENWEG
   ===================================================================== */
{
  S.def(`<pattern id="${S.id("mauerq")}" width="13" height="6.6" patternUnits="userSpaceOnUse"><path d="M0 3.3 H13 M0 6.6 H13 M4.2 0 V3.3 M10.6 0 V3.3 M1.4 3.3 V6.6 M7.6 3.3 V6.6" stroke="#3e150f" stroke-width=".3" opacity=".5"/><rect x="5" y=".6" width="4" height="1.2" fill="#c97a5e" opacity=".25"/><rect x="2" y="4" width="4.6" height="1.4" fill="#5a2018" opacity=".2"/></pattern>`);
  const face = `M0 187.2 Q160 185.2 320 186.8 L320 194 Q160 192.2 0 194.6 Z`;
  let k = `<path d="${face}" fill="${ROT_D}"/><path d="${face}" fill="url(#${S.id("mauerq")})"/><path d="${face}" fill="${S.lg("mauerlicht", [[0, "#000", 0.2], [0.7, "#000", 0], [1, "#ffcf9a", 0.16]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M0 185.2 Q160 183.2 320 184.8 L320 187.2 Q160 185.6 0 187.6 Z" fill="${S.lg("mauerkrone", [[0, "#b25e46"], [1, "#e6977a"]], 0, 0, 1, 0)}"/>`;
  for (let x = 4; x < 320; x += 6.4 + rnd() * 2) { const y = 185.2 - Math.sin(x / 320 * Math.PI) * 1.9 + (x / 320) * -0.4; k += `<path d="M${r(x)} ${r(y)} v2.4" stroke="#6e2a1e" stroke-width=".3"/>`; }
  k += `<path d="M0 185.2 Q160 183.2 320 184.8" stroke="#ffc09a" stroke-width=".5" fill="none"/>`;
  for (let i = 0; i < 16; i++) { const x = rnd() * 320, y = 187.6 - Math.sin(x / 320 * Math.PI) * 1.8 + rnd() * 5.4; k += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(1 + rnd() * 2.2)}" ry="${r(.5 + rnd() * .4)}" fill="#5e7a3a" opacity=".65"/>`; }
  for (let i = 0; i < 14; i++) { const x = rnd() * 320, y = 194 - Math.sin(x / 320 * Math.PI) * 1.8; k += `<path d="M${r(x)} ${r(y + .6)} q-1.4 -1.8 -2.6 -2.2 M${r(x)} ${r(y + .6)} q.2 -2.4 .8 -3 M${r(x)} ${r(y + .6)} q1.4 -1.6 2.6 -1.8" stroke="#5f7d36" stroke-width=".5" fill="none"/>`; }
  S.teil({ id: "mauer", de: "die Mauer", syl: "MAU-er", it: "il muro", itSyl: "MU-ro", en: "wall", x: 0, y: 0, kunst: k,
    tipp: "Mauern aus rotem Sandstein stützen den steilen Hang am Philosophenweg." });
}
{
  let k = `<path d="M0 194.6 Q160 192.2 320 194 L320 200 L0 200 Z" fill="${S.lg("weg", [[0, "#cdb99b"], [1, "#b39c7c"]])}"/>`;
  for (let i = 0; i < 60; i++) k += `<circle cx="${r(rnd() * 320)}" cy="${r(195 + rnd() * 5)}" r="${r(0.2 + rnd() * 0.35)}" fill="${rnd() < 0.5 ? "#8f7a5e" : "#e8dbc2"}" opacity=".7"/>`;
  for (let i = 0; i < 26; i++) { const x = r(rnd() * 320), y = r(195.4 + rnd() * 4.4); k += `<ellipse cx="${x}" cy="${y}" rx="${r(.7 + rnd() * .5)}" ry=".35" fill="${["#c7702c", "#d9a53a", "#a8562a", "#b8862e"][Math.floor(rnd() * 4)]}" transform="rotate(${Math.round(rnd() * 60 - 30)} ${x} ${y})"/>`; }
  S.teil({ id: "philosophenweg", de: "der Philosophenweg", syl: "phi-lo-SO-phen-weg", it: "il Sentiero dei Filosofi", itSyl: "sen-TIE-ro dei fi-LO-so-fi", en: "Philosophers' Walk", x: 0, y: 0, kunst: k,
    tipp: "Auf dem Philosophenweg gingen Professoren und Studenten spazieren und dachten nach." });
}

/* =====================================================================
   15 — DIE PALME im Philosophengärtchen (Hanfpalme, Agave, Zypresse)
   ===================================================================== */
{
  let k = "";
  /* Zypresse hinten */
  k += `<path d="M311 186 Q306 160 309.6 134 Q312 126 314.4 134 Q318 160 313 186 Z" fill="${S.lg("zypresse", [[0, "#1f3a22"], [0.6, "#355a36"], [1, "#4f7a46"]], 0, 0, 1, 0)}"/>`;
  /* Hanfpalme: faseriger Stamm, Fächerblätter */
  k += `<path d="M291 187 Q292.6 160 291.4 128 L294.2 128 Q295.6 160 294.6 187 Z" fill="${S.lg("palmstamm", [[0, "#3a2a1e"], [0.6, "#6a5038"], [1, "#8a6a48"]], 0, 0, 1, 0)}"/>`;
  for (let y = 132; y < 186; y += 2.2) k += `<path d="M${r(291.6 - (y - 132) * .004)} ${y} l2.8 .8" stroke="#2a1e14" stroke-width=".3" opacity=".5"/>`;
  /* Fächerblätter: jedes auf einem eigenen Stiel, der Fächer in verschiedenen Winkeln (manche von der Seite,
     dann schmal), Licht von rechts; unten hängen alte, braune Wedel am Stamm */
  const CX = 292.8, CY = 128.6;
  const blatt = (a, len, fan, breit, farben, haengt) => {
    const ex = CX + Math.cos(a) * len, ey = CY + Math.sin(a) * len + (haengt ? 1.5 : -.6);
    let g = `<path d="M${CX} ${CY} Q${r(CX + Math.cos(a) * len * .5)} ${r(CY + Math.sin(a) * len * .5 - (haengt ? 0 : .8))} ${r(ex)} ${r(ey)}" stroke="${haengt ? "#7a5a34" : "#5a7a34"}" stroke-width=".35" fill="none"/>`;
    for (let i = -7; i <= 7; i++) {
      const b = a + i * .16 * breit + (haengt ? .5 : 0), l = fan * (1 - Math.abs(i) * .025), dr = haengt ? 2.4 : .8;
      g += `<path d="M${r(ex)} ${r(ey)} Q${r(ex + Math.cos(b) * l * .6)} ${r(ey + Math.sin(b) * l * .6)} ${r(ex + Math.cos(b) * l)} ${r(ey + Math.sin(b) * l + dr)}" stroke="${farben[(i + 8) % 3]}" stroke-width="${r(.75 - Math.abs(i) * .03)}" fill="none" stroke-linecap="round"/>`;
    }
    return g;
  };
  for (const [a, len] of [[1.9, 4], [1.2, 3.6], [2.5, 3.4]]) k += blatt(a, len, 5.5, .55, ["#8a6a3a", "#a8844a", "#6a4e2a"], true);
  for (const [a, len, fan, br] of [[-2.7, 6, 7, 1], [-2.1, 6.4, 7.5, .7], [-1.55, 5, 7, 1.05], [-1, 6.2, 7.2, .6], [-.35, 6.6, 7, 1], [.25, 5.6, 6.4, .8], [-3.2, 5.4, 6, .7], [.8, 4.6, 5.6, .9]])
    k += blatt(a, len, fan, br, a > -1.4 ? ["#5f8a40", "#86b056", "#4f7a3a"] : ["#3f6a32", "#5a8a42", "#355a2a"], false);
  k += `<circle cx="${CX}" cy="${CY + .2}" r="1.3" fill="#4a3a26"/>`;
  /* Agave auf der Mauerkrone */
  for (const [a, l] of [[-2.5, 7], [-2, 8.4], [-1.55, 9], [-1.1, 8], [-0.65, 6.6], [-2.9, 5.6], [-0.3, 5]]) k += `<path d="M268 185 Q${r(268 + Math.cos(a) * l * .5)} ${r(185 + Math.sin(a) * l * .5)} ${r(268 + Math.cos(a) * l)} ${r(185 + Math.sin(a) * l)} L${r(268 + Math.cos(a) * l * .3 + .8)} ${r(185 + Math.sin(a) * l * .3)} Z" fill="${S.lg("agave", [[0, "#7a9a9a"], [1, "#a8c4b4"]], 0, 0, 1, 0)}" stroke="#d8c45a" stroke-width=".15"/>`;
  k += `<path d="M262 186.4 h12 l-1 -1.6 h-10 Z" fill="#a0583e"/>`;
  S.teil({ id: "palme", de: "die Palme", syl: "PAL-me", it: "la palma", itSyl: "PAL-ma", en: "palm tree", x: 293, y: 152, kunst: `<g transform="translate(-293 -152)">${k}</g>`,
    tipp: "Im Philosophengärtchen ist es so mild, dass Palmen, Agaven und Zypressen wachsen." });
}

/* =====================================================================
   16 — DER GEDENKSTEIN für Friedrich Hölderlin
   ===================================================================== */
{
  const y = 197.4, s = km(y);
  let k = schatten(0, .3, .5 * s, .06 * s, .3);
  k += `<path d="M${r(-.42 * s)} 0 L${r(-.38 * s)} ${r(-.62 * s)} Q${r(-.3 * s)} ${r(-.72 * s)} ${r(-.05 * s)} ${r(-.74 * s)} L${r(.3 * s)} ${r(-.7 * s)} Q${r(.42 * s)} ${r(-.6 * s)} ${r(.44 * s)} 0 Z" fill="${S.lg("gedenk", [[0, "#7e3a2c"], [0.5, "#a8573f"], [1, "#d07a5c"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${r(-.38 * s)} ${r(-.62 * s)} Q${r(-.3 * s)} ${r(-.72 * s)} ${r(-.05 * s)} ${r(-.74 * s)} L${r(.3 * s)} ${r(-.7 * s)}" stroke="#e8a283" stroke-width=".4" fill="none"/>`;
  k += `<rect x="${r(-.26 * s)}" y="${r(-.56 * s)}" width="${r(.52 * s)}" height="${r(.34 * s)}" rx=".3" fill="${S.lg("bronzetafel", [[0, "#4e3a22"], [0.5, "#8a6a3a"], [1, "#5e4426"]], 0, 0, 1, 1)}"/>`;
  k += `<text x="0" y="${r(-.47 * s)}" font-size="${r(.06 * s)}" text-anchor="middle" fill="#e8d0a0" font-family="Georgia,serif" font-weight="bold">HÖLDERLIN</text>`;
  for (let i = 0; i < 4; i++) k += `<path d="M${r(-.2 * s)} ${r((-.41 + i * .05) * s)} h${r((.4 - (i === 3 ? .15 : 0)) * s)}" stroke="#c9a874" stroke-width=".22" opacity=".8"/>`;
  k += `<ellipse cx="${r(-.32 * s)}" cy="${r(-.66 * s)}" rx="${r(.08 * s)}" ry="${r(.03 * s)}" fill="#5e7a3a" opacity=".7"/>`;
  S.teil({ id: "gedenkstein", de: "der Gedenkstein", syl: "ge-DENK-stein", it: "la lapide commemorativa", itSyl: "LA-pi-de com-me-mo-ra-TI-va", en: "memorial stone", x: 126, y, steht: true, kunst: k,
    tipp: "Der Stein erinnert an den Dichter Friedrich Hölderlin. Über Heidelberg schrieb er: „Lange lieb ich dich schon …“" });
}

/* =====================================================================
   17 — DIE STUDENTIN auf 18 — DER BANK (von hinten), 19 — DER RUCKSACK
   ===================================================================== */
const BANK = { x: 47, y: 199 };
{
  const s = km(BANK.y);
  const m = B.mensch({ id: "hdb_stud", geschlecht: "w", pose: "sitzen", blick: 196, frisur: "zopf", haarfarbe: "dunkelbraun", haut: "hell",
    kleidung: { oberteil: { stueck: "pullover", farbe: "gelb" }, unterteil: { stueck: "jeans" }, jacke: { stueck: "jacke", farbe: "gruen_d" }, schuhe: { stueck: "turnschuh" }, zubehoer: { stueck: "schal", farbe: "rot" } } }, 1.66 * s * 0.92);
  const sitzY = m.z.sitz ? m.z.sitz.y * m.k : -0.45 * s;
  S.def(`<clipPath id="${S.id("sitz")}"><rect x="-30" y="-80" width="60" height="${r(80 + sitzY + 1)}"/></clipPath>`);
  S.teil({ id: "studentin", de: "die Studentin", syl: "stu-DEN-tin", it: "la studentessa", itSyl: "stu-den-TES-sa", en: "student", x: BANK.x + 6, y: BANK.y - 29, kunst: `<g transform="translate(0 29)"><g clip-path="url(#${S.id("sitz")})">${rundeFigur(m.svg)}</g></g>`,
    tipp: "Die Universität Heidelberg ist die älteste Universität im heutigen Deutschland — gegründet 1386." });
}
{
  const s = km(BANK.y), W = 1.7 * s;
  let k = schatten(0, .3, W / 2 + 2, 1.4, .35);
  const HOLZ = S.lg("bankholz", [[0, "#7a5230"], [1, "#5a3a20"]]);
  for (const sx of [-1, 1]) k += `<path d="M${r(sx * (W / 2 - 3))} 0 L${r(sx * (W / 2 - 3))} ${r(-0.44 * s)} L${r(sx * (W / 2 - 2.2))} ${r(-0.9 * s)} L${r(sx * (W / 2 - 3.8))} ${r(-0.9 * s)} L${r(sx * (W / 2 - 3.8))} ${r(-0.44 * s)} L${r(sx * (W / 2 - 5.4))} 0 Z" fill="#2c2a28"/>`;
  for (let i = 0; i < 2; i++) k += `<rect x="${r(-W / 2)}" y="${r(-0.46 * s - i * 1.4)}" width="${r(W)}" height="1.1" rx=".3" fill="${HOLZ}"/>`;
  for (let i = 0; i < 3; i++) k += `<rect x="${r(-W / 2 + .4)}" y="${r(-0.88 * s + i * 2.6)}" width="${r(W - .8)}" height="1.8" rx=".4" fill="${HOLZ}"/><rect x="${r(-W / 2 + .4)}" y="${r(-0.88 * s + i * 2.6)}" width="${r(W - .8)}" height=".5" fill="#c8945a" opacity=".6"/>`;
  S.teil({ id: "bank", de: "die Bank", syl: "BANK", it: "la panchina", itSyl: "pan-CHI-na", en: "bench", x: BANK.x, y: BANK.y, steht: true, kunst: k });
}
{
  const s = km(199.4);
  let k = schatten(0, .2, .26 * s, .04 * s, .3);
  k += `<path d="M${r(-.17 * s)} 0 Q${r(-.21 * s)} ${r(-.26 * s)} ${r(-.15 * s)} ${r(-.4 * s)} Q${r(0)} ${r(-.48 * s)} ${r(.15 * s)} ${r(-.4 * s)} Q${r(.21 * s)} ${r(-.26 * s)} ${r(.17 * s)} 0 Z" fill="${S.lg("rucksack", [[0, "#8a1f1d"], [0.5, "#c8302a"], [1, "#a8261f"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${r(-.12 * s)} ${r(-.16 * s)} h${r(.24 * s)} v${r(.13 * s)} h${r(-.24 * s)} Z" fill="#9a221d" stroke="#5a1210" stroke-width=".2"/><path d="M${r(-.1 * s)} ${r(-.38 * s)} q${r(.1 * s)} ${r(-.12 * s)} ${r(.2 * s)} 0" stroke="#3a2a20" stroke-width=".5" fill="none"/>`;
  k += `<path d="M${r(-.15 * s)} ${r(-.3 * s)} h${r(.3 * s)}" stroke="#d8d0c0" stroke-width=".25"/>`;
  S.teil({ id: "rucksack", de: "der Rucksack", syl: "RUCK-sack", it: "lo zaino", itSyl: "ZAI-no", en: "backpack", x: 80, y: 199.4, steht: true, kunst: k });
}

/* =====================================================================
   20 — DER STUDENTENKUSS (flache Schachtel, ca. 15 cm, auf der Mauer)
   ===================================================================== */
{
  const y = 185.6;
  let k = schatten(0, .15, 2.6, .4, .3);
  k += `<path d="M-2.3 0 L2.3 0 L2.3 -1.7 L-2.3 -1.7 Z" fill="${S.lg("kussbox", [[0, "#efe4cc"], [0.5, "#fbf6ea"], [1, "#f4ead6"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-2.3" y="-1.7" width="4.6" height=".3" fill="#9e1f2a"/><rect x="-2.3" y="-.25" width="4.6" height=".25" fill="#9e1f2a"/>`;
  /* Deckel schräg offen, darin die runden Pralinen; vorn der Scherenschnitt des Paares */
  k += `<path d="M-2.3 -1.7 L-1.9 -2.9 L2.6 -2.9 L2.3 -1.7 Z" fill="#e9dcc2"/><path d="M-1.7 -2.6 h3.9" stroke="#9e1f2a" stroke-width=".18"/>`;
  for (const x of [-1.3, 0, 1.3]) k += `<ellipse cx="${x}" cy="-1.85" rx=".55" ry=".26" fill="#3a2418"/>`;
  const kopf = `M-3.4 3.6 L-2.6 2.2 Q-3.6 .4 -3.2 -1.4 Q-2.8 -3.4 -.8 -3.6 Q.8 -3.6 1.3 -2.4 L1.45 -1.6 L2.15 -.85 L1.5 -.55 L1.75 -.15 L1.45 .15 L1.65 .5 L1.25 1.2 Q.7 1.6 .4 1.7 L.6 3.6 Z`;
  k += `<g transform="translate(0 -.85) scale(.17)" fill="#161212"><path d="${kopf}" transform="translate(-2.15 0)"/><path d="M-5.6 -3 L-1.4 -4.4 L-.8 -3.4 L-4.8 -2.2 Z" transform="translate(-.3 0)"/><path d="${kopf}" transform="translate(2.15 0) scale(-1 1)"/><circle cx="4.9" cy="-2.6" r="1.1"/></g>`;
  S.teil({ oben: true, id: "studentenkuss", de: "der Studentenkuss", syl: "stu-DEN-ten-kuss", it: "il bacio dello studente (cioccolatino)", itSyl: "BA-cio del-lo stu-DEN-te", en: "Student Kiss (chocolate)", x: 99, y, steht: true, kunst: k + flaeche(-2.6, -3.2, 5.2, 3.4, 0.4),
    tipp: "Der Studentenkuss ist eine Praline aus Schokolade — seit 1863 aus Heidelberg." });
}

/* Licht über allem: Abendsonne von rechts (warm), leichte Vignette — fängt keinen Tipp ab */
S.davor(`<rect width="320" height="200" fill="${S.rg("sonne", [[0, "#ffcf90", 0.34], [0.5, "#ffcf90", 0.1], [1, "#ffcf90", 0]], 1, 0.3, 0.95)}"/><rect width="320" height="200" fill="${S.rg("vignette", [[0, "#000", 0], [0.72, "#000", 0], [1, "#1a1008", 0.22]], 0.5, 0.5, 0.75)}"/>`);


/* ---------- zum Schluss: Pfaddaten verkürzen (relative Befehle, 0,1 genau — spart ein Fünftel der Ladezeit) ---------- */
/* Pfaddaten verkürzen: relative Befehle, auf 0,1 gerundet (ohne Drift), kurze Zahlen */
const pfadKurz = (() => {
  const ARGS = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7, Z: 0 };
  const q = (v) => Math.round(v * 10) / 10;
  const zahl = (v) => { let s = String(q(v)); if (s === "-0") s = "0"; return s.replace(/^(-?)0\./, "$1."); };
  return (d) => {
    const tok = d.match(/[a-zA-Z]|-?(?:\d+\.?\d*|\.\d+)(?:e-?\d+)?/g);
    if (!tok) return d;
    let i = 0, cx = 0, cy = 0, sx = 0, sy = 0, rx = 0, ry = 0, srx = 0, sry = 0, cmd = null, last = "", out = "", prev = "";
    const schreib = (t) => {
      if (/^[a-zA-Z]$/.test(t)) { out += t; prev = ""; return; }
      if (prev === "") out += t;
      else if (t[0] === "-") out += t;
      else if (t[0] === "." && prev.includes(".")) out += t;
      else out += " " + t;
      prev = t;
    };
    while (i < tok.length) {
      if (/[a-zA-Z]/.test(tok[i])) cmd = tok[i++];
      else if (cmd === "M") cmd = "L"; else if (cmd === "m") cmd = "l";
      if (!cmd) return d;
      const U = cmd.toUpperCase(), rel = cmd !== U, n = ARGS[U];
      if (n === undefined) return d;
      const a = tok.slice(i, i + n).map(Number); i += n;
      if (a.length < n || a.some(isNaN)) return d;
      let z, teile = [];
      if (U === "Z") { z = "z"; cx = sx; cy = sy; rx = srx; ry = sry; }
      else if (U === "H") { const x = rel ? cx + a[0] : a[0], dx = q(x - rx); z = "h"; teile = [zahl(dx)]; rx = q(rx + dx); cx = x; }
      else if (U === "V") { const y = rel ? cy + a[0] : a[0], dy = q(y - ry); z = "v"; teile = [zahl(dy)]; ry = q(ry + dy); cy = y; }
      else if (U === "A") {
        const x = rel ? cx + a[5] : a[5], y = rel ? cy + a[6] : a[6], dx = q(x - rx), dy = q(y - ry);
        z = "a"; teile = [zahl(a[0]), zahl(a[1]), zahl(a[2]), a[3] ? "1" : "0", a[4] ? "1" : "0", zahl(dx), zahl(dy)];
        rx = q(rx + dx); ry = q(ry + dy); cx = x; cy = y;
      } else {
        const pts = []; for (let j = 0; j < n; j += 2) pts.push([rel ? cx + a[j] : a[j], rel ? cy + a[j + 1] : a[j + 1]]);
        const [ex, ey] = pts[pts.length - 1];
        if (out === "") { z = "M"; teile = [zahl(ex), zahl(ey)]; rx = q(ex); ry = q(ey); }
        else {
          z = U.toLowerCase();
          for (const [px, py] of pts) teile.push(zahl(px - rx), zahl(py - ry));
          rx = q(rx + q(ex - rx)); ry = q(ry + q(ey - ry));
        }
        cx = ex; cy = ey;
        if (U === "M") { sx = ex; sy = ey; srx = rx; sry = ry; }
      }
      /* gleicher Befehl wie davor: Buchstabe weglassen (nicht nach M/m und nicht bei z) */
      if (!(z === last && z !== "m" && z !== "M" && z !== "z")) schreib(z);
      for (const t of teile) schreib(t);
      last = z;
    }
    return out;
  };
})();
/* direkt aufeinanderfolgende Pfade mit gleichen Eigenschaften (deckend, ohne evenodd) zu einem Pfad zusammenfassen */
const fasseZusammen = (svg) => {
  let alt;
  do { alt = svg; svg = svg.replace(/<path d="([^"]*)"((?: [\w-]+="[^"]*")*)\/><path d="([^"]*)"\2\/>/g, (m, a, rest, b) => (/opacity|evenodd|class=/.test(rest) ? m : `<path d="${a} ${b}"${rest}/>`)); } while (svg !== alt);
  return svg;
};
const kuerzePfade = (svg) => fasseZusammen(svg).replace(/ d="([^"]*)"/g, (m, d) => ` d="${pfadKurz(d)}"`);
for (const t of S.teile) { t.kunst = kuerzePfade(t.kunst); for (const u of t.unter || []) u.kunst = kuerzePfade(u.kunst); }
for (const L of [S.defs, S.kulisse, S.vorne]) L.forEach((v, i) => { L[i] = kuerzePfade(v); });

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/heidelberg.js"));
console.log(aus);
