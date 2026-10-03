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
const rundeFigur = (svg) => svg.replace(/ (d|x1|y1|x2|y2|cx|cy|r|rx|ry|x|y|width|height|points)="([^"]*)"/g, (m, a, d) => ` ${a}="${d.replace(/-?\d+\.\d+/g, (n) => String(Math.round(+n)))}"`);

S.def(`<filter color-interpolation-filters="sRGB" id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter color-interpolation-filters="sRGB" id="${S.id("wolke")}" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="2.2"/></filter>`);
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
S.hinten(`<rect width="320" height="150" fill="${S.lg("himmel", [[0, "#3f78bc"], [0.6, "#7fa8d6"], [1, "#b4cfe6"]], 0, 0, 0, 62, ' gradientUnits="userSpaceOnUse"')}"/>`);
{
  let w = "";
  for (const [x, y, s] of [[44, 13, 0.9], [150, 6, 1.1], [300, 10, 0.8], [96, 29, 0.55], [12, 36, .6]]) {
    w += `<g filter="url(#${S.id("wolke")})" opacity=".92">`;
    for (const [dx, dy, rx, ry] of [[0, 0, 17, 4.2], [-11, 1.5, 10, 3.2], [11, 1, 12, 3.6], [-3, -3, 9, 4], [5, -2.6, 7, 3.6]])
      w += `<ellipse cx="${r(x + dx * s)}" cy="${r(y + dy * s)}" rx="${r(rx * s)}" ry="${r(ry * s)}" fill="#fff"/>`;
    w += `<ellipse cx="${r(x + 3 * s)}" cy="${r(y + 2.8 * s)}" rx="${r(16 * s)}" ry="${r(2 * s)}" fill="#f6dcc0"/></g>`;
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
        m += `<circle cx="${r(cx + dx)}" cy="${r(cy + dy)}" r="${r(rr)}" fill="${f}"/>`;
        if (licht) m += `<circle cx="${r(cx + dx + rr * 0.35)}" cy="${r(cy + dy - rr * 0.3)}" r="${r(rr * 0.5)}" fill="${licht}" opacity=".3"/>`;
      }
    }
    return m;
  };
  S.def(`<pattern id="${S.id("waldf")}" width="5.3" height="3.7" patternUnits="userSpaceOnUse" patternTransform="rotate(11)"><rect width="5.3" height="3.7" fill="#4a6a3c"/>${kronen(13, 5.3, 3.7, 0.45, 0.9, ["#3f5d34", "#557a42", "#4a6b3a", "#62844a", "#36502e", "#58763c"], "#a9c88a")}</pattern>`);
  S.def(`<pattern id="${S.id("waldg")}" width="11.3" height="7.1" patternUnits="userSpaceOnUse" patternTransform="rotate(-7)">${kronen(11, 11.3, 7.1, 1, 1.7, ["#3a5630", "#4e7240", "#5c7f45", "#33492b", "#5f8040"], "#b2d090")}</pattern>`);
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
    rip += `<path d="M${x0 - w / 2} ${r(y0)} Q${r((x0 + x1) / 2 - w)} ${r(y0 + 40)} ${r(x1 - w)} 120 L${r(x1 + w)} 120 Q${r((x0 + x1) / 2 + w)} ${r(y0 + 40)} ${x0 + w / 2} ${r(y0)} Z" fill="${hell ? "#f6e2a8" : "#0b1808"}" opacity="${hell ? .2 : .28}"/>`;
  }
  g += `<g filter="url(#${S.id("weichberg")})">${rip}</g>`;
  /* der Schlossberg (Jettenbühl): der Hang unter dem Schloss tritt hervor */
  g += `<path d="M104 72 Q128 62 160 64 Q184 66 196 78 Q206 94 214 112 L92 112 Q96 86 104 72 Z" fill="#f2d890" opacity=".14" filter="url(#${S.id("weichberg")})"/>`;
  g += `<path d="${d}" fill="${S.lg("waldluft", [[0, "#aec2d0", 0.72], [0.28, "#aec2d0", 0.34], [0.6, "#aec2d0", 0.08], [1, "#aec2d0", 0]], 0, 14, 0, 110, ' gradientUnits="userSpaceOnUse"')}"/>`;
  g += `<path d="${d}" fill="${S.lg("waldlicht", [[0, "#10200c", 0.26], [0.5, "#10200c", 0.04], [1, "#ffcf8a", 0.12]], 0, 0, 1, 0)}"/>`;
  k += `<g clip-path="url(#${S.id("berg")})">${g}</g>`;
  /* Herbstbäume frei verstreut (keine Muster), je weiter weg desto kleiner und blasser */
  for (let i = 0; i < 105; i++) {
    const x = rnd() * 320, y = kammY(x) + 3 + Math.pow(rnd(), 0.8) * (118 - kammY(x)), s = 0.45 + (y - 15) / 90;
    if (x > 112 && x < 182 && y > 52 && y < 98) continue;
    const f = ["#b8862e", "#c7702c", "#d9a53a", "#a8963a", "#c25a2a", "#d4b04a"][Math.floor(rnd() * 6)];
    const op = r(0.35 + 0.5 * Math.min(1, (y - 15) / 80));
    k += `<circle cx="${r(x)}" cy="${r(y)}" r="${r((0.6 + rnd() * 0.8) * s)}" fill="${f}" opacity="${op}"/>`;
  }
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
    for (let t = t0; t <= t1 + 1e-6; t += 0.04) { const p = bahn(t); L.push([p[0] - 1.3, p[1] - .2]); R.push([p[0] + 1.3, p[1] + .5]); }
    k += `<path d="${pfad([...L, ...R.reverse()])}" fill="${S.lg("schneise", [[0, "#8a9458"], [1, "#a8a868"]])}" opacity=".9"/>`;
    const G = []; for (let t = t0; t <= t1 + 1e-6; t += 0.04) G.push(bahn(t));
    k += `<path d="${pfad(G, false)}" stroke="#4b4038" stroke-width=".35" fill="none"/>`;
  }
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
  const RL = S.lg("ruinloch", [[0, "#3a4a32"], [0.5, "#2e2a22"], [1, "#22150f"]]);
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
    k += band(a0, true, "#e89470") + band(a1, true, "#4e2219");
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
  /* Stückgarten-Mauer rechts, Bäume an den Mauern */
  k += `<path d="${pfad([sp(-74, 26, 56), sp(-74, 26, 64), sp(-100, 30, 62), sp(-100, 30, 54)])}" fill="${ROT_N}"/>`;
  for (const [de, dn, z, s] of [[60, 18, 64, 1.2], [56, 26, 58, 1], [-82, 32, 66, 1.3], [-92, 30, 62, 1.1], [-70, 34, 58, 1.2], [36, 30, 60, 1], [-20, 32, 60, .9], [12, 32, 60, 1]]) {
    const p = sp(de, dn, z);
    k += `<circle cx="${r(p[0])}" cy="${r(p[1])}" r="${r(2 * s)}" fill="#3f5c32"/><circle cx="${r(p[0] + .7)}" cy="${r(p[1] - .7)}" r="${r(1.2 * s)}" fill="#6a8a46"/><circle cx="${r(p[0] + 1)}" cy="${r(p[1] - 1.1)}" r="${r(.55 * s)}" fill="#d9c27a" opacity=".55"/>`;
  }
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
   5 — DAS UFER (Neuenheim: Uferstraße, Baumreihe, Villen, Gärten)
   ===================================================================== */
{
  const oben = NORD.map(([x, y]) => [x, y]);
  let k = `<path d="${pfad([...oben, [321, 190], [-1, 190]])}" fill="${S.lg("ufergrund", [[0, "#7c8a5a"], [1, "#5c6c42"]])}"/>`;
  /* Ufermauer (Krone) und die Neuenheimer Landstraße */
  k += `<path d="${pfad(oben, false)}" stroke="#d9cdb8" stroke-width="1.1" fill="none"/>`;
  k += `<path d="${pfad(oben.map(([x, y]) => [x, y + 1.5]), false)}" stroke="#8f8a84" stroke-width="1.8" fill="none"/>`;
  k += `<path d="${pfad(oben.map(([x, y]) => [x, y + 2.7]), false)}" stroke="#c9bfae" stroke-width=".5" fill="none"/>`;
  /* Autos auf der Uferstraße */
  for (const [x, c] of [[34, "#c8302a"], [96, "#e8e4da"], [150, "#2f4f7a"], [232, "#3a3a3a"], [290, "#d8ad3a"]]) { const y = nordY(x) + 1.3; k += `<rect x="${x}" y="${r(y - .6)}" width="2.6" height="1" rx=".4" fill="${c}"/><rect x="${x + .5}" y="${r(y - .9)}" width="1.4" height=".5" rx=".2" fill="#9fb8c8"/>`; }
  /* Villen und Dächer zwischen den Gärten, Platanen an der Straße (von hinten nach vorn) */
  const villen = [];
  for (let x = -2; x < 316; x += 9 + rnd() * 7) villen.push([x, nordY(x) + 8 + rnd() * 5]);
  for (let x = 2; x < 140; x += 14 + rnd() * 8) villen.push([x, nordY(x) + 14 + rnd() * 3]);
  villen.sort((a, b) => a[1] - b[1]).forEach(([x, y]) => {
    const w = 7 + rnd() * 4, h = 3.4 + rnd() * 1.8, f = ["#efe4cc", "#e6d4b0", "#f4efe4", "#e8c8b4", "#d9d4c8"][Math.floor(rnd() * 5)], d = ["#8a442e", "#5e6168", "#9c4f35", "#a65a3c"][Math.floor(rnd() * 4)];
    k += `<rect x="${r(x)}" y="${r(y - h)}" width="${r(w)}" height="${r(h)}" fill="${f}"/><rect x="${r(x + w * .75)}" y="${r(y - h)}" width="${r(w * .25)}" height="${r(h)}" fill="#fff4dc" opacity=".35"/>`;
    k += `<path d="M${r(x - .4)} ${r(y - h)} L${r(x + 1.4)} ${r(y - h - 2.8)} L${r(x + w - 1.4)} ${r(y - h - 2.8)} L${r(x + w + .4)} ${r(y - h)} Z" fill="${d}"/><path d="M${r(x + w - 1.4)} ${r(y - h - 2.8)} L${r(x + w + .4)} ${r(y - h)} L${r(x + w - .6)} ${r(y - h)} Z" fill="#ffd8a0" opacity=".3"/>`;
    k += `<rect x="${r(x + .3)}" y="${r(y - h + .3)}" width="${r(w - .6)}" height="${r(h - .5)}" fill="${fm(Math.max(2, Math.min(5, Math.round(w / 1.8))), 2, "")}"/>`;
  });
  for (let x = 1; x < 320; x += 7 + rnd() * 3) { const y = nordY(x) + 4.6, s = .9 + rnd() * .4; k += `<circle cx="${r(x)}" cy="${r(y - 1.6 * s)}" r="${r(2.3 * s)}" fill="#4a6a36"/><circle cx="${r(x + .8)}" cy="${r(y - 2.4 * s)}" r="${r(1.3 * s)}" fill="#6f8f48"/><circle cx="${r(x + 1.1)}" cy="${r(y - 2.8 * s)}" r="${r(.6 * s)}" fill="#c8b45a" opacity=".6"/><path d="M${r(x)} ${r(y)} v${r(-1 * s)}" stroke="#6a5a48" stroke-width=".4"/>`; }
  S.teil({ id: "ufer", de: "das Ufer", syl: "U-fer", it: "la riva", itSyl: "RI-va", en: "riverbank", x: 0, y: 0, kunst: k,
    tipp: "Hier am Nordufer liegt der Stadtteil Neuenheim." });
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
    if (baum) { k += `<circle cx="${r(p[0])}" cy="${r(p[1] - 4 * s)}" r="${r((3.6 + rnd() * 1.6) * s)}" fill="#476636"/><circle cx="${r(p[0] + 1.3 * s)}" cy="${r(p[1] - 5.2 * s)}" r="${r(2.2 * s)}" fill="#6a8a46"/><circle cx="${r(p[0] + 2 * s)}" cy="${r(p[1] - 6 * s)}" r="${r(1 * s)}" fill="#d0b65a" opacity=".55"/>`; return; }
    const w = 9 + rnd() * 5;
    k += `<path d="${pfad([proj(e - w / 2 - 2, n + 1, z - 3.4), proj(e + w / 2 + 2, n + 1, z - 3.4), proj(e + w / 2 + 2, n + 1, z), proj(e - w / 2 - 2, n + 1, z)])}" fill="#a8604a"/>`;
    const h = haus(e - w / 2, e + w / 2, n, z, 8 + rnd() * 4, { giebel: rnd() < .4 });
    if (h) k += h.svg;
  });
  const hinten = reihe(-120, 120, 860, { z: hang, h0: 12, dh: 6, ohneFenster: true, lucke: [[275, 362], [445, 470]] });
  hinten.sort((a, b) => b.f - a.f).forEach((h) => { k += h.svg; });
  const mitte = reihe(-55, 140, 940, { h0: 13, dh: 6, giebel: .25, lucke: [[275, 362]] });
  mitte.sort((a, b) => b.f - a.f).forEach((h) => { k += h.svg; VORNE.push(h.umriss); });
  /* vordere Reihe am Kai: Neckarstaden (West) und Am Hackteufel (Ost); Lücke am Brückentor */
  const front = reihe(-9, 140, 1010, { h0: 14, dh: 6, laden: true, giebel: .2, lucke: [[322, 340]] });
  front.sort((a, b) => b.f - a.f).forEach((h) => { k += h.svg; VORNE.push(h.umriss); });
  /* Platanen am Kai (Neckarstaden, westlich des Tors) und Spaziergänger */
  for (let e = 314; e > 120; e -= 13 + rnd() * 4) {
    const n = quai(e) - 3, p = proj(e, n, 6), s = FOC / tief(e, n);
    if (p[0] + 4.6 * s > 320.5) continue;
    k += `<path d="M${r(p[0])} ${r(p[1])} v${r(-6 * s)}" stroke="#7a6a58" stroke-width="${r(.7 * s)}"/>`;
    k += `<ellipse cx="${r(p[0])}" cy="${r(p[1] - 9 * s)}" rx="${r(4.6 * s)}" ry="${r(4 * s)}" fill="#5a7a3e"/><ellipse cx="${r(p[0] + 1.4 * s)}" cy="${r(p[1] - 10.4 * s)}" rx="${r(2.6 * s)}" ry="${r(2.2 * s)}" fill="#8aa04e"/><ellipse cx="${r(p[0] + 2 * s)}" cy="${r(p[1] - 11.2 * s)}" rx="${r(1.2 * s)}" ry="${r(1 * s)}" fill="#e2c46a" opacity=".6"/>`;
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
    k += `<path d="${pfad([proj(e, NW, 11), proj(e, NW, 24.6)], false)}" stroke="#a9584a" stroke-width=".3"/>`;
    const sb = e + 4.3;
    k += `<path d="${q([[sb - .8, NW - 2, z0], [sb + .8, NW - 2, z0], [sb + .8, NW - 1.2, 22], [sb - .8, NW - 1.2, 22]])}" fill="#b4604a"/>`;
    for (const z of [12, 18]) k += `<path d="${pfad([proj(sb - .8, NW - 2, z), proj(sb + .8, NW - 2, z)], false)}" stroke="#e8a283" stroke-width=".35"/>`;
  }
  /* sehr steiles Satteldach mit Firstlinie, Walm am Chor (links, Osten), gestaffelte Gaubenreihen */
  const zT = 28, zF = 57;
  k += `<path d="${q([[TO, NW - .5, zT], [340, NW - .5, zT], [352, NM, zT + 3], [334, NM, zF], [TO, NM, zF]])}" fill="${S.lg("hgkdach", [[0, "#313740"], [0.5, "#4c5560"], [1, "#68727e"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="${q([[340, NW - .5, zT], [352, NM, zT + 3], [334, NM, zF]])}" fill="#262b32" opacity=".55"/>`;
  k += `<path d="${pfad([proj(TO, NM, zF), proj(334, NM, zF)], false)}" stroke="#9aa6b2" stroke-width=".5"/><path d="${pfad([proj(334, NM, zF), proj(340, NW - .5, zT)], false)}" stroke="#7d8894" stroke-width=".35"/>`;
  for (const [z, n, e0, e1] of [[33, 8, 292, 336], [40.5, 6, 294, 330], [48, 4, 296, 322]]) for (let i = 0; i < n; i++) {
    const e = e0 + (i + .5) * (e1 - e0) / n, nn = NW - .5 + (NM - NW + .5) * (z - zT) / (zF - zT), s = Math.max(.5, FOC / tief(e, nn) * (1 - (z - 33) / 40));
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
    x: 0, y: 0, kunst: `<g clip-path="url(#${S.id("hgkclip")})">${k}</g>`, tipp: "Zwischen den Strebepfeilern stehen seit dem Mittelalter kleine Läden. Das Dach ist fast so hoch wie die Mauern.",
    zoom: { x: 196, y: 70, w: 72, h: 48 },
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
    k += `<path d="M${r(p[0])} ${r(p[1])} v${r(-1.4 * sk)}" stroke="${["#b8473a", "#2f5f95", "#e8e4da", "#3a3a3a", "#d8ad3a", "#4f8a46", "#e07a2e"][i % 7]}" stroke-width="${r(.55 * sk)}" stroke-linecap="round"/><circle cx="${r(p[0])}" cy="${r(p[1] - 1.65 * sk)}" r="${r(.24 * sk)}" fill="#e2b48e"/>`;
  }
  /* Ansichtsfläche der Westseite — im Abendlicht */
  { const o = [], u = []; for (let i = 0; i <= 30; i++) { const s = -0.02 + i / 30 * 1.08; o.push(bp(s, ZP)); u.push(bp(s, s > 1.01 ? 6 : 0)); } k += `<path d="${pfad([...o, ...u.reverse()])}" fill="${S.lg("bruecke", [[0, "#a84d38"], [0.5, "#c86448"], [1, "#d9785a"]], 0, 0, 1, 0)}"/>`; }
  /* neun Bögen; Pfeiler mit Vorköpfen und Kappen */
  for (let j = 0; j < 9; j++) {
    const [a, b] = BOGEN(j), pts = [];
    for (let i = 0; i <= 12; i++) { const t = i / 12; pts.push(bp(a + (b - a) * t, bogenZ(t))); }
    k += `<path d="${pfad([bp(a, 0), ...pts, bp(b, 0)])}" fill="${S.lg("bogen", [[0, "#24181a"], [0.6, "#3b302d"], [1, "#5d6d69"]])}"/>`;
    k += `<path d="${pfad(pts, false)}" stroke="#eca07e" stroke-width=".55" fill="none"/><path d="${pfad(pts.slice(0, 6), false)}" stroke="#7a3428" stroke-width=".3" fill="none" transform="translate(-.2 .3)"/>`;
    if (j < 8) {
      const s = (j + 1) / 9, p0 = bp(s - PFEILER, 0), p1 = bp(s + PFEILER, 0), top = bp(s, 4.8), tl = bp(s - PFEILER, 3.4), tr = bp(s + PFEILER, 3.4);
      k += `<path d="${pfad([p0, tl, top, tr, p1])}" fill="#d97a5c"/><path d="${pfad([tl, top, tr], false)}" stroke="#f2b294" stroke-width=".3" fill="none"/>`;
      k += `<path d="${pfad([bp(s + PFEILER * .6, 4.2), bp(s + PFEILER * .6, ZB - .6)], false)}" stroke="#eca07e" stroke-width=".35"/>`;
    }
  }
  /* Gesims und Brüstungskrone */
  { const g = [], t = []; for (let i = 0; i <= 30; i++) { const s = -0.02 + i / 30 * 1.08; g.push(bp(s, ZB)); t.push(bp(s, ZP)); } k += `<path d="${pfad(g, false)}" stroke="#f0aa88" stroke-width=".6" fill="none"/><path d="${pfad(t, false)}" stroke="#ffd0b0" stroke-width=".5" fill="none"/>`; }
  /* Laternen auf der Brüstung */
  const LAT = [];
  for (const s of [0.11, 0.33, 0.44, 0.56, 0.67, 0.89, 1.0]) {
    const a = bp(s, ZP), b = bp(s, ZP + 4.4), sk = FOC / tief(BN[0] + (BS[0] - BN[0]) * s, BN[1] + (BS[1] - BN[1]) * s);
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
  const STEIN = S.lg("denkmal", [[0, "#6e6a5e"], [0.5, "#b2ad98"], [1, "#e6dfc8"]], 0, 0, 1, 0);
  const denkmal = (s, minerva) => {
    const fuss = bp(s, ZP), sk = FOC / tief(BN[0] + (BS[0] - BN[0]) * s, BN[1] + (BS[1] - BN[1]) * s), x = fuss[0], y = fuss[1];
    /* gestuftes Postament mit Sockel und Gesims */
    let g = `<rect x="${r(x - 1.5 * sk)}" y="${r(y - .8 * sk)}" width="${r(3 * sk)}" height="${r(.8 * sk)}" fill="#a88a72"/>`;
    g += `<rect x="${r(x - 1.1 * sk)}" y="${r(y - 3.6 * sk)}" width="${r(2.2 * sk)}" height="${r(2.8 * sk)}" fill="${STEIN}"/><rect x="${r(x - 1.35 * sk)}" y="${r(y - 3.9 * sk)}" width="${r(2.7 * sk)}" height="${r(.35 * sk)}" fill="#ece6d4"/>`;
    g += `<rect x="${r(x - .6 * sk)}" y="${r(y - 3 * sk)}" width="${r(1.2 * sk)}" height="${r(1.4 * sk)}" fill="#8f897a"/>`;
    const fy = y - 3.9 * sk;
    if (minerva) {
      /* Minerva: Helm mit Busch, Schild, Lanze */
      g += `<path d="M${r(x - .5 * sk)} ${r(fy)} L${r(x - .35 * sk)} ${r(fy - 2.6 * sk)} Q${r(x)} ${r(fy - 2.9 * sk)} ${r(x + .35 * sk)} ${r(fy - 2.6 * sk)} L${r(x + .55 * sk)} ${r(fy)} Z" fill="${STEIN}" stroke="#5e5950" stroke-width=".1"/>`;
      g += `<circle cx="${r(x)}" cy="${r(fy - 3.15 * sk)}" r="${r(.32 * sk)}" fill="#d8d2c0"/><path d="M${r(x - .35 * sk)} ${r(fy - 3.35 * sk)} Q${r(x)} ${r(fy - 4.2 * sk)} ${r(x + .5 * sk)} ${r(fy - 3.3 * sk)}" fill="#a8a290"/>`;
      g += `<ellipse cx="${r(x - .62 * sk)}" cy="${r(fy - 1 * sk)}" rx="${r(.42 * sk)}" ry="${r(.62 * sk)}" fill="#9a9480" stroke="#5e5950" stroke-width=".1"/>`;
      g += `<path d="M${r(x + .7 * sk)} ${r(fy + .1)} L${r(x + .7 * sk)} ${r(fy - 4.6 * sk)}" stroke="#4e4a42" stroke-width="${r(.14 * sk)}"/><path d="M${r(x + .7 * sk)} ${r(fy - 4.6 * sk)} l${r(-.14 * sk)} ${r(.5 * sk)} h${r(.28 * sk)} Z" fill="#4e4a42"/>`;
    } else {
      /* Karl Theodor im Kurfürstenmantel mit Hermelinkragen, Stab */
      g += `<path d="M${r(x - .7 * sk)} ${r(fy)} Q${r(x - .6 * sk)} ${r(fy - 1.6 * sk)} ${r(x - .35 * sk)} ${r(fy - 2.6 * sk)} Q${r(x)} ${r(fy - 2.9 * sk)} ${r(x + .35 * sk)} ${r(fy - 2.6 * sk)} Q${r(x + .7 * sk)} ${r(fy - 1.4 * sk)} ${r(x + .75 * sk)} ${r(fy)} Z" fill="${STEIN}" stroke="#5e5950" stroke-width=".1"/>`;
      g += `<path d="M${r(x - .42 * sk)} ${r(fy - 2.5 * sk)} Q${r(x)} ${r(fy - 2.1 * sk)} ${r(x + .42 * sk)} ${r(fy - 2.5 * sk)}" stroke="#f2ecdc" stroke-width="${r(.22 * sk)}" fill="none"/>`;
      g += `<circle cx="${r(x)}" cy="${r(fy - 3.15 * sk)}" r="${r(.32 * sk)}" fill="#d8d2c0"/><path d="M${r(x + .45 * sk)} ${r(fy - 1.8 * sk)} L${r(x + .85 * sk)} ${r(fy - 2.9 * sk)}" stroke="#4e4a42" stroke-width="${r(.12 * sk)}"/>`;
    }
    return { g, top: [x, fy - 3.6 * sk], sk };
  };
  const mi = denkmal(2 / 9, true), kt = denkmal(7 / 9, false);
  k += mi.g + kt.g;
  S.teil({ id: "denkmal", de: "das Denkmal", syl: "DENK-mal", it: "il monumento", itSyl: "mo-nu-MEN-to", en: "monument", x: kt.top[0], y: kt.top[1] + 3, kunst: `<g transform="translate(${r(-kt.top[0])} ${r(-kt.top[1] - 3)})">${k}</g>`,
    tipp: "Auf zwei Pfeilern stehen Denkmäler: Kurfürst Karl Theodor, der die Brücke bauen ließ, und Minerva, die Göttin der Weisheit." });
}

/* =====================================================================
   10 — DAS BRÜCKENTOR mit dem BRÜCKENAFFEN — Lupe: Turmhaube, Brückenaffe
   ===================================================================== */
{
  const G = proj(330, -372, ZB), GE = 1.25;
  const gp = (e, n, z) => { const p = proj(e, n, z); return [G[0] + GE * (p[0] - G[0]), G[1] + GE * (p[1] - G[1])]; };
  let k = "";
  const turm = (e, n, dunkel) => {
    const f = gp(e, n, ZB - 1), t = gp(e, n, 36), sk = FOC / tief(e, n) * GE, w = 7 * sk * .9, cx = f[0], h = f[1] - t[1];
    let g = `<rect x="${r(cx - w / 2)}" y="${r(t[1])}" width="${r(w)}" height="${r(h)}" fill="${PUTZ}"/>`;
    g += `<rect x="${r(cx - w / 2)}" y="${r(t[1])}" width="${r(w * .36)}" height="${r(h)}" fill="#7d7668" opacity="${dunkel ? .42 : .28}"/><rect x="${r(cx + w * .3)}" y="${r(t[1])}" width="${r(w * .2)}" height="${r(h)}" fill="#fff2d8" opacity=".5"/>`;
    g += `<rect x="${r(cx - w / 2 - .3)}" y="${r(t[1] - .9)}" width="${r(w + .6)}" height="1.2" fill="#b4553f"/><rect x="${r(cx - w / 2)}" y="${r(t[1] + h * .48)}" width="${r(w)}" height=".55" fill="#c86e54"/>`;
    g += `<rect x="${r(cx - .5)}" y="${r(t[1] + h * .16)}" width="1" height="1.6" fill="#3d3a38"/><rect x="${r(cx - .4)}" y="${r(t[1] + h * .62)}" width=".8" height="1.4" fill="#3d3a38"/><rect x="${r(cx + w * .16)}" y="${r(t[1] + h * .34)}" width=".7" height="1.2" fill="#3d3a38"/>`;
    const hb = t[1] - .9;
    g += `<path d="M${r(cx - w / 2 - .2)} ${r(hb)} Q${r(cx - w / 2 - .6)} ${r(hb - 3.6)} ${r(cx - 1.2)} ${r(hb - 5.2)} Q${r(cx - .6)} ${r(hb - 6)} ${r(cx - .6)} ${r(hb - 7)} L${r(cx + .6)} ${r(hb - 7)} Q${r(cx + .6)} ${r(hb - 6)} ${r(cx + 1.2)} ${r(hb - 5.2)} Q${r(cx + w / 2 + .6)} ${r(hb - 3.6)} ${r(cx + w / 2 + .2)} ${r(hb)} Z" fill="${SCHIEFER}"/>`;
    g += `<path d="M${r(cx + 1.6)} ${r(hb - 4.4)} Q${r(cx + w / 2 - .2)} ${r(hb - 3)} ${r(cx + w / 2 - .4)} ${r(hb - .6)}" stroke="#c4cdd6" stroke-width=".35" fill="none"/>`;
    g += `<path d="M${r(cx - 1)} ${r(hb - 7)} Q${r(cx - 1.2)} ${r(hb - 8.4)} ${r(cx)} ${r(hb - 9.2)} Q${r(cx + 1.2)} ${r(hb - 8.4)} ${r(cx + 1)} ${r(hb - 7)} Z" fill="${SCHIEFER}"/>`;
    g += `<path d="M${r(cx)} ${r(hb - 9.2)} V${r(hb - 11.6)}" stroke="#3a4049" stroke-width=".35"/><circle cx="${r(cx)}" cy="${r(hb - 10.2)}" r=".4" fill="#e8c35a"/>`;
    return { g, haube: [cx, hb - 5], w };
  };
  /* Ostturm (weiter weg, links) — Torbau — Westturm (näher, rechts) */
  const ost = turm(337.7, -374.2, true);
  k += ost.g;
  {
    const a = gp(330, -366, ZB - 1), b = gp(330, -366, 28), sk = FOC / tief(330, -366) * GE, w = 6 * sk;
    k += `<rect x="${r(a[0] - w / 2)}" y="${r(b[1])}" width="${r(w)}" height="${r(a[1] - b[1])}" fill="${PUTZ}"/><rect x="${r(a[0] - w / 2)}" y="${r(b[1])}" width="${r(w)}" height="${r(a[1] - b[1])}" fill="#b9b2a4" opacity=".3"/>`;
    k += `<path d="M${r(a[0] - w / 2 - .4)} ${r(b[1] + .2)} L${r(a[0])} ${r(b[1] - 2.4)} L${r(a[0] + w / 2 + .4)} ${r(b[1] + .2)} Z" fill="${SCHIEFER}"/>`;
    k += `<path d="M${r(a[0] - 1.9)} ${r(a[1])} V${r(a[1] - 5.6)} Q${r(a[0])} ${r(a[1] - 8.4)} ${r(a[0] + 1.9)} ${r(a[1] - 5.6)} V${r(a[1])} Z" fill="#2a2420"/><path d="M${r(a[0] - 2.4)} ${r(a[1])} V${r(a[1] - 5.8)} Q${r(a[0])} ${r(a[1] - 9.2)} ${r(a[0] + 2.4)} ${r(a[1] - 5.8)} V${r(a[1])}" stroke="#b4553f" stroke-width=".6" fill="none"/>`;
    k += `<rect x="${r(a[0] - .7)}" y="${r(b[1] + 3)}" width="1.4" height="1.8" fill="#3d3a38"/>`;
  }
  const west = turm(322.3, -369.8, false);
  k += west.g;
  /* Abendschatten der Türme auf die Häuser links dahinter */
  k += `<path d="M${r(ost.haube[0] - ost.w / 2)} ${r(G[1] - 2)} l-6 -3 l0 -14 l6 3 Z" fill="#1d140c" opacity=".14"/>`;
  /* der Brückenaffe (Bronze, ca. mannshoch) auf Straßenhöhe westlich vom Tor, daneben zwei Mäuse */
  const A = gp(320.6, -363.6, ZB), sa = FOC / tief(320.6, -363.6) * GE;
  const BR = S.lg("bronze", [[0, "#3e2c18"], [0.5, "#7d5e32"], [1, "#d4ac62"]], 0, 0, 1, 0);
  k += `<rect x="${r(A[0] - .7 * sa)}" y="${r(A[1] - .5 * sa)}" width="${r(1.4 * sa)}" height="${r(.5 * sa)}" fill="#9e9384"/>`;
  k += `<ellipse cx="${r(A[0])}" cy="${r(A[1] - 1 * sa)}" rx="${r(.42 * sa)}" ry="${r(.55 * sa)}" fill="${BR}"/><circle cx="${r(A[0])}" cy="${r(A[1] - 1.75 * sa)}" r="${r(.32 * sa)}" fill="${BR}"/>`;
  k += `<path d="M${r(A[0] + .3 * sa)} ${r(A[1] - 1.2 * sa)} L${r(A[0] + .7 * sa)} ${r(A[1] - 1.9 * sa)}" stroke="#7d5e32" stroke-width="${r(.14 * sa)}"/><circle cx="${r(A[0] + .78 * sa)}" cy="${r(A[1] - 2.15 * sa)}" r="${r(.24 * sa)}" fill="#e6f0f6" stroke="#7d5e32" stroke-width=".08"/>`;
  for (const dx of [-.55, .6]) k += `<ellipse cx="${r(A[0] + dx * sa)}" cy="${r(A[1] - .58 * sa)}" rx="${r(.16 * sa)}" ry="${r(.09 * sa)}" fill="#8a6a3a"/>`;
  const GZ = gp(330, -372, 22);
  S.teil({ id: "brueckentor", de: "das Brückentor", syl: "BRÜ-cken-tor", it: "la porta del ponte", itSyl: "POR-ta del PON-te", en: "bridge gate", x: GZ[0], y: GZ[1], kunst: `<g transform="translate(${r(-GZ[0])} ${r(-GZ[1])})">${k}</g>`,
    tipp: "Das Brückentor war früher Teil der Stadtmauer. Es hat zwei runde Türme und ist 28 Meter hoch.",
    zoom: { x: r(GZ[0] - 27), y: r(GZ[1] - 20), w: 54, h: 36 },
    unter: [
      { id: "turmhaube", de: "die Turmhaube", syl: "TURM-hau-be", it: "la cupola della torre", itSyl: "CU-po-la del-la TOR-re", en: "tower cap", x: west.haube[0], y: west.haube[1], kunst: flaeche(-west.w / 2 - .4, -7, west.w + .8, 9) + flaeche(ost.haube[0] - west.haube[0] - ost.w / 2 - .4, ost.haube[1] - west.haube[1] - 7, ost.w + .8, 9),
        tipp: "Seit 1788 tragen beide Türme barocke Hauben aus Schiefer." },
      { id: "brueckenaffe", de: "der Brückenaffe", syl: "BRÜ-cken-af-fe", it: "la scimmia del ponte", itSyl: "SCIM-mia del PON-te", en: "bridge monkey", x: A[0], y: A[1], kunst: flaeche(-1.4, -3.4, 2.8, 3.6, 0.4),
        tipp: "Der Affe aus Bronze hält einen Spiegel, daneben sitzen zwei Mäuse. Wer seine Finger berührt, kommt wieder nach Heidelberg — sagt man." },
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
   12 — DER WEINBERG direkt unter der Mauer (Pfähle, Drähte, Stöcke, Laub) — Lupe: Weintraube
   ===================================================================== */
const WT = {};
{
  let m = "";
  for (let i = 0; i < 11; i++) { const cx = rnd() * 3.2, cy = rnd() * 2.2; m += `<ellipse cx="${r(cx)}" cy="${r(cy)}" rx="${r(0.45 + rnd() * 0.3)}" ry="${r(0.35 + rnd() * 0.2)}" fill="${["#6d8b3a", "#93a040", "#c2a43e", "#5d7a33", "#b8762e", "#7f9a3c"][Math.floor(rnd() * 6)]}"/>`; }
  S.def(`<pattern id="${S.id("laub")}" width="3.2" height="2.2" patternUnits="userSpaceOnUse"><rect width="3.2" height="2.2" fill="#5f7a34"/>${m}</pattern>`);
  const LAUB = `url(#${S.id("laub")})`;
  /* steiler Hang: Rebzeilen laufen hangab in die Tiefe (zum Fluchtpunkt über der Mauer) */
  const top = (x) => 175.6 - (x - 140) * 0.012, VP = [236, 132];
  let k = `<path d="M136 189 L136 ${r(top(136))} L320 ${r(top(320))} L320 189 Z" fill="${S.lg("weinboden", [[0, "#8f7c55"], [1, "#6e5a3a"]])}"/>`;
  for (let i = 0; i < 22; i++) {
    const B0 = [124 + i * 9.4, 190], mitte = [];
    for (let t = 0; t <= 1; t += 0.065) {
      const x = B0[0] + (VP[0] - B0[0]) * t, y = B0[1] + (VP[1] - B0[1]) * t;
      if (y < top(x) + .4 || x < 138 || x > 319.5) { if (y < top(x) + .4) break; continue; }
      mitte.push([x, y, (y - VP[1]) / (B0[1] - VP[1])]);
    }
    if (mitte.length < 2) continue;
    const L = [], R = [];
    for (const [x, y, sk] of mitte) { const w = 2.6 * sk + .45, wob = (rnd() - .5) * .4 * sk; L.push([x - w + wob, y - 3 * sk]); R.push([x + w + wob, y - 2.4 * sk]); }
    /* Drahtrahmen und Pfähle */
    k += `<path d="${pfad(mitte.map(([x, y, sk]) => [x, y - 1.2 * sk]), false)}" stroke="#d8d0c0" stroke-width=".12" fill="none"/><path d="${pfad(mitte.map(([x, y, sk]) => [x, y - 2.3 * sk]), false)}" stroke="#d8d0c0" stroke-width=".12" fill="none"/>`;
    mitte.forEach(([x, y, sk], j) => { if (j % 2 === 0) k += `<path d="M${r(x)} ${r(y + .2)} V${r(y - 3.1 * sk)}" stroke="#8a7458" stroke-width="${r(.16 + .14 * sk)}"/>`; });
    k += `<path d="${pfad([...L, ...R.reverse()])}" fill="#3a2e1c" opacity=".3" transform="translate(-.8 .6)"/>`;
    k += `<path d="${pfad([...L, ...R.slice().reverse()])}" fill="${LAUB}"/><path d="${pfad([...L, ...R.slice().reverse()])}" fill="${S.lg("rebenlicht", [[0, "#000", 0.2], [0.6, "#000", 0], [1, "#fff2b0", 0.2]], 0, 0, 1, 0)}"/>`;
    /* knorrige Stöcke unter dem Laub, blaue Trauben */
    mitte.forEach(([x, y, sk], j) => {
      if (j % 2 === 1) k += `<path d="M${r(x)} ${r(y + .1)} q${r(.3 * sk)} ${r(-.6 * sk)} 0 ${r(-1.2 * sk)}" stroke="#5a4028" stroke-width="${r(.2 + .2 * sk)}" fill="none"/>`;
      if (rnd() < 0.6) k += `<path d="M${r(x + (rnd() - .5) * 1.6 * sk)} ${r(y - 1.1 * sk)} l${r(.3 * sk)} ${r(.6 * sk)} l${r(-.6 * sk)} 0 Z" fill="#3d2c52"/>`;
    });
  }
  /* die große Traube am vordersten Stock (rechts an der Mauer) */
  {
    const tx = 286, ty = 181;
    let g = `<path d="M${tx - 9} ${ty + 4} Q${tx - 4} ${ty - 3} ${tx + 2} ${ty - 4} Q${tx + 6} ${ty - 5} ${tx + 9} ${ty - 2}" stroke="#6a4a2a" stroke-width=".8" fill="none"/>`;
    for (const [x, y, rot, f] of [[-6, 0, -20, "#7a9a3a"], [-1, -4, 10, "#c2a43e"], [5, -4.4, -30, "#b8762e"], [8, -2.4, 20, "#8a9a3a"]]) g += `<path d="M${tx + x} ${ty + y} q-2.2 -2.2 0 -4.2 q2.2 2 0 4.2 Z" fill="${f}" transform="rotate(${rot} ${tx + x} ${ty + y})"/>`;
    for (const [x, y] of [[0, 0], [-1.2, .4], [1.2, .4], [-.6, 1.5], [.6, 1.5], [-1.4, 1.8], [1.4, 1.7], [0, 2.6], [-.9, 3.2], [.9, 3.2], [0, 4.3], [-.4, 5.2], [.4, 5.9]]) g += `<circle cx="${r(tx + x)}" cy="${r(ty + y)}" r=".9" fill="${S.rg("beere", [[0, "#8a7aa8"], [0.5, "#4a3a6a"], [1, "#2a1e3e"]], 0.35, 0.3, 0.7)}"/><circle cx="${r(tx + x - .3)}" cy="${r(ty + y - .3)}" r=".22" fill="#d8d0e8" opacity=".7"/>`;
    g += `<path d="M${tx} ${ty - 4} Q${tx + .4} ${ty - 2} ${tx} ${ty - .8}" stroke="#6a4a2a" stroke-width=".4" fill="none"/>`;
    k += g;
    WT.x = tx; WT.y = ty + 2;
  }
  S.teil({ id: "weinberg", de: "der Weinberg", syl: "WEIN-berg", it: "il vigneto", itSyl: "vi-GNE-to", en: "vineyard", x: 0, y: 0, kunst: k,
    tipp: "Der Philosophenweg führte früher durch Weinberge. Im Oktober ist Weinlese.",
    zoom: { x: 246, y: 160, w: 66, h: 44 },
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
  const facher = (cx, cy, a, sz) => {
    let g = "";
    for (let i = -6; i <= 6; i++) { const b = a + i * 0.13; g += `<path d="M${cx} ${cy} Q${r(cx + Math.cos(b) * sz * .5)} ${r(cy + Math.sin(b) * sz * .5 - 1)} ${r(cx + Math.cos(b) * sz)} ${r(cy + Math.sin(b) * sz)}" stroke="${i % 2 ? "#4f7a3a" : "#6a944a"}" stroke-width="${r(.9 - Math.abs(i) * .04)}" fill="none" stroke-linecap="round"/>`; }
    return g;
  };
  for (const [a, sz] of [[-2.6, 14], [-1.9, 15], [-1.2, 13], [-0.5, 14], [0.2, 12], [-3.1, 11], [0.8, 10], [1.6, 9]]) k += facher(292.8, 128.6, a, sz);
  k += `<circle cx="292.8" cy="128.8" r="1.6" fill="#3a5a2a"/>`;
  /* Agave auf der Mauerkrone */
  for (const [a, l] of [[-2.5, 7], [-2, 8.4], [-1.55, 9], [-1.1, 8], [-0.65, 6.6], [-2.9, 5.6], [-0.3, 5]]) k += `<path d="M268 185 Q${r(268 + Math.cos(a) * l * .5)} ${r(185 + Math.sin(a) * l * .5)} ${r(268 + Math.cos(a) * l)} ${r(185 + Math.sin(a) * l)} L${r(268 + Math.cos(a) * l * .3 + .8)} ${r(185 + Math.sin(a) * l * .3)} Z" fill="${S.lg("agave", [[0, "#7a9a9a"], [1, "#a8c4b4"]], 0, 0, 1, 0)}" stroke="#d8c45a" stroke-width=".15"/>`;
  k += `<path d="M262 186.4 h12 l-1 -1.6 h-10 Z" fill="#a0583e"/>`;
  S.teil({ id: "palme", de: "die Palme", syl: "PAL-me", it: "la palma", itSyl: "PAL-ma", en: "palm tree", x: 293, y: 187, kunst: `<g transform="translate(-293 -187)">${k}</g>`,
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
  S.teil({ id: "studentin", de: "die Studentin", syl: "stu-DEN-tin", it: "la studentessa", itSyl: "stu-den-TES-sa", en: "student", x: BANK.x + 6, y: BANK.y - 24, kunst: `<g transform="translate(0 24)"><g clip-path="url(#${S.id("sitz")})">${rundeFigur(m.svg)}</g></g>`,
    tipp: "Die Universität Heidelberg ist die älteste in Deutschland — gegründet 1386." });
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
S.davor(`<rect width="320" height="200" fill="${S.rg("sonne", [[0, "#ffd9a0", 0.26], [0.5, "#ffd9a0", 0.07], [1, "#ffd9a0", 0]], 1, 0.2, 0.95)}"/><rect width="320" height="200" fill="${S.rg("vignette", [[0, "#000", 0], [0.72, "#000", 0], [1, "#1a1008", 0.22]], 0.5, 0.5, 0.75)}"/>`);


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
