#!/usr/bin/env node
/* =====================================================================
   PRAG (FASSUNG 854) — Bilderwelt neu: Städte der Welt
   ---------------------------------------------------------------------
   XANDER (03.10.): „die bekannten Sehenswürdigkeiten … zu den bekanntesten
   Städten in anderen Ländern … als Profi-Grafikdesigner auf Hollywood-
   Niveau“ — und (Funk 291) „mit größter Sorgfalt und Präzision“.

   RECHERCHE (Wikipedia „Charles Bridge“, „Old Town Bridge Tower“,
   „Lesser Town Bridge Tower“, „St. Vitus Cathedral“, „Prague Castle“,
   „Church of St. Nicholas (Malá Strana)“, „Petřín Lookout Tower“;
   prague.eu; praguecitytourism.cz):
   - STANDORT: erhöht am ALTSTÄDTER BRÜCKENTURM (etwa 7 m über der
     Fahrbahn), Blick nach Westen über die KARLSBRÜCKE (1357–1402,
     516 m lang, 9,5 m breit, 16 Bögen aus Sandstein, 13 m über der
     Moldau). Die Brücke läuft leicht nach links (Westsüdwest) zur
     Kleinseite. Echte Richtungen von links nach rechts: der Petřín
     (Laurenziberg, 327 m) mit dem AUSSICHTSTURM (63,5 m, 1891, ein
     kleiner Eiffelturm, Südwesten), die Insel Kampa, am Brückenende die
     zwei KLEINSEITNER BRÜCKENTÜRME (links der niedrige romanische
     Judithturm, rechts der hohe gotische Turm von 1464, 43,5 m, mit
     Schieferdach und Ecktürmchen, dazwischen das Tor), dahinter die
     grüne Kuppel und der Glockenturm der NIKOLAUSKIRCHE (Barock, 79 m),
     rechts oben auf dem Hradschin die PRAGER BURG (lange helle
     Südfront) mit dem VEITSDOM (links die zwei schlanken Westtürme,
     82 m, in der Mitte der große Südturm, 96,5 m, mit grüner
     Renaissance-Haube und Galerie, rechts der Chor mit Strebebögen).
   - Auf der Brücke: 30 dunkle Barockstatuen (heute Kopien), 15 je Seite,
     auf Sockeln über den Pfeilern; die erste rechts ist die Madonna mit
     dem heiligen Bernhard, die erste links der heilige Ivo. Die
     Statue des HEILIGEN NEPOMUK (1683, Bronze, die älteste) steht rechts
     als achte; um seinen Kopf fünf goldene Sterne; die Bronzetafel
     darunter ist blank gerieben: Wer sie berührt, kommt wieder nach
     Prag. Gaslaternen auf der Brüstung, Kopfsteinpflaster,
     Straßenmusiker (Jazz, Akkordeon), Puppenspieler mit MARIONETTEN,
     Stände der Maler und Künstler.
   - Auf der Moldau: AUSFLUGSSCHIFFE mit Glasdach, TRETBOOTE (auch in
     Schwanenform), SCHWÄNE. Links das Altstädter Wehr.
   - TYPISCH: TRDELNÍK (Hohlgebäck vom Spieß, in Zimtzucker gerollt),
     Marionetten, BÖHMISCHES GLAS (geschliffene Vasen, Kristall),
     Knödel. Die Astronomische Uhr steht am Altstädter Ring – von hier
     aus nicht zu sehen (nur im Tipp).
   - LICHT: Sommermorgen, etwa 9 Uhr; die Sonne steht im Ostsüdosten
     hinter dem Betrachter (links hinten, 35° hoch). Alles, was zu uns
     und nach links (Süden) schaut, ist hell; Schatten fallen nach vorn
     und leicht nach rechts (Länge 1,4 × Höhe).
   Maßstab: Augenhöhe 7 m über der Brücke, Horizont y = 100, F = 440.
   Brückenkoordinaten s (entlang der Brücke) und q (quer, rechts +);
   der Blick ist 11° nach rechts gedreht: d = s·cos11° + q·sin11°,
   l = −s·sin11° + q·cos11°, x = 200 + F·l/d, y = 100 + F·(7 − h)/d.
   Burg in 1050 m, Nikolauskirche 744 m, Petřín 1340 m, Brückentürme
   510 m, Musiker in 24 m (1,75 m ≈ 31 Einheiten).
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "prag", titel: "Prag", emoji: "🌉", thema: "Länder", kuerzel: "prg", fassung: 854, breite: 400, hoehe: 260 });
const rnd = zufall(1357);
const r = B.r;
const F = 440, HOR = 100, E = 7, W = 11 * Math.PI / 180, CA = Math.cos(W), SA = Math.sin(W);
const Dd = (s, q) => s * CA + q * SA, Ll = (s, q) => -s * SA + q * CA;
const X = (s, q) => 200 + F * Ll(s, q) / Dd(s, q);
const Y = (s, q, h = 0) => HOR + F * (E - h) / Dd(s, q);
const P = (s, q, h = 0) => `${r(X(s, q))} ${r(Y(s, q, h))}`;
/* ferne Dinge nach Richtung (Grad gegen die Blickmitte) und Entfernung */
const XA = (a) => 200 + F * Math.tan(a * Math.PI / 180);
const YD = (d, h) => HOR + F * (E - h) / d;
const kompakt = (svg, Q = 1) => {
  const rund = (n) => { const v = Math.round(+n / Q) * Q; return String(v === 0 ? 0 : v); };
  return svg.replace(/ d="([^"]+)"/g, (a, p) => ` d="${p.replace(/-?\d*\.?\d+/g, rund)}"`)
    .replace(/ (x|y|x1|y1|x2|y2|cx|cy|fx|fy)="(-?\d*\.?\d+)"/g, (a, k, n) => ` ${k}="${rund(n)}"`);
};
/* Vielecke auf das Bild beschneiden — nichts ragt hinaus */
const BOX = [0, 0, 400, 260];
function klipp(pts) {
  let p = pts.map((q) => q.split(" ").map(Number));
  const kante = [[(q) => q[0] >= BOX[0], (a, b) => [BOX[0], a[1] + (b[1] - a[1]) * (BOX[0] - a[0]) / (b[0] - a[0])]],
    [(q) => q[0] <= BOX[2], (a, b) => [BOX[2], a[1] + (b[1] - a[1]) * (BOX[2] - a[0]) / (b[0] - a[0])]],
    [(q) => q[1] >= BOX[1], (a, b) => [a[0] + (b[0] - a[0]) * (BOX[1] - a[1]) / (b[1] - a[1]), BOX[1]]],
    [(q) => q[1] <= BOX[3], (a, b) => [a[0] + (b[0] - a[0]) * (BOX[3] - a[1]) / (b[1] - a[1]), BOX[3]]]];
  for (const [innen, schnitt] of kante) {
    const out = [];
    for (let i = 0; i < p.length; i++) {
      const a = p[i], b = p[(i + 1) % p.length];
      if (innen(a)) { out.push(a); if (!innen(b)) out.push(schnitt(a, b)); } else if (innen(b)) out.push(schnitt(a, b));
    }
    p = out; if (!p.length) break;
  }
  return p.map(([x, y]) => `${r(x)} ${r(y)}`);
}
const strecke = (a, b) => {   /* Linie a→b auf das Bild beschnitten */
  let [x1, y1] = a.split(" ").map(Number), [x2, y2] = b.split(" ").map(Number), t0 = 0, t1 = 1;
  const dx = x2 - x1, dy = y2 - y1;
  for (const [p, q] of [[-dx, x1 - BOX[0]], [dx, BOX[2] - x1], [-dy, y1 - BOX[1]], [dy, BOX[3] - y1]]) {
    if (p === 0) { if (q < 0) return ""; continue; }
    const t = q / p; if (p < 0) { if (t > t1) return ""; if (t > t0) t0 = t; } else { if (t < t0) return ""; if (t < t1) t1 = t; }
  }
  return `M${r(x1 + t0 * dx)} ${r(y1 + t0 * dy)} L${r(x1 + t1 * dx)} ${r(y1 + t1 * dy)}`;
};
const poly = (pts, fill, extra = "") => { const q = klipp(pts); return q.length > 2 ? `<path d="M${q.join(" L")}Z" fill="${fill}"${extra}/>` : ""; };

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("dunst")}" x="-5%" y="-30%" width="110%" height="160%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation=".6"/></filter>`);
S.def(`<filter id="${S.id("spiegel")}" x="-10%" y="-20%" width="120%" height="140%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation=".8 .3"/></filter>`);

/* Stoffe */
const SAND_L = S.lg("sandl", [[0, "#a59782"], [1, "#8c7e6b"]]);     /* Sandstein, zur Sonne */
const SAND_S = S.lg("sands", [[0, "#5e564f"], [1, "#4a443f"]]);     /* Sandstein, Schatten */
const SOCKEL = S.lg("sockel", [[0, "#a39582"], [0.6, "#8a7d6b"], [1, "#6f6456"]], 0, 0, 1, 0);
const KUPFER = S.lg("kupfer", [[0, "#8fc7ad"], [0.5, "#5f9f83"], [1, "#3f7562"]], 0, 0, 1, 0);
const SCHIEFER = S.lg("schiefer", [[0, "#5a5f6a"], [1, "#3a3e47"]], 0, 0, 1, 0);
const GOLD = S.lg("gold", [[0, "#fff1b0"], [0.45, "#e9bd4c"], [1, "#9a6a14"]], 0, 0, 1, 1);
const PUTZ = "#eadfca";

/* =====================================================================
   KULISSE — Morgenhimmel, Petřín, Hradschin-Hang, Kleinseite, Kampa
   ===================================================================== */
S.hinten(`<rect width="400" height="130" fill="${S.lg("himmel", [[0, "#6d9fd2"], [0.5, "#9fc2e2"], [0.85, "#dbe7ef"], [1, "#f2eadc"]])}"/>`);
{
  /* Kumuluswolken: runde Ballen, Licht von links hinten, kühle Unterseite */
  const WS = S.lg("wks", [[0, "#b9c4d8"], [1, "#d3d9e6"]]), WL = S.lg("wkl", [[0, "#fffaf0"], [0.5, "#ffffff"], [1, "#eef1f7"]], 0, 0, 1, 0);
  const wolke = (x, y, w, h, seed) => {
    const z = zufall(seed), n = 7 + Math.floor(z() * 4), ball = [];
    for (let i = 0; i < n; i++) { const t = (i + 0.5) / n, rr = h * (0.22 + 0.5 * Math.pow(Math.sin(Math.PI * t), 1.5)) * (0.7 + z() * 0.6); ball.push([x - w / 2 + t * w + (z() - 0.5) * 2, y - rr * (0.6 + z() * 0.4), rr]); }
    for (let i = 0; i < 3; i++) { const t = 0.3 + z() * 0.4, rr = h * (0.3 + z() * 0.25); ball.push([x - w / 2 + t * w, y - h * 0.55 - rr * 0.5, rr]); }
    const kreise = (dx, dy, f) => ball.map(([cx, cy, rr]) => `M${r(cx + dx - rr * f)} ${r(cy + dy)} a${r(rr * f)} ${r(rr * f)} 0 1 0 ${r(2 * rr * f)} 0 a${r(rr * f)} ${r(rr * f)} 0 1 0 ${r(-2 * rr * f)} 0`).join("");
    let g = `<path d="${kreise(0, 0, 1)}M${r(x - w / 2)} ${r(y - h * 0.3)} h${w} v${r(h * 0.3)} h${-w}Z" fill="${WS}"/>`;
    g += `<path d="${kreise(-h * 0.12, -h * 0.12, 0.86)}" fill="${WL}"/>`;
    g += `<path d="${kreise(-h * 0.2, -h * 0.2, 0.55)}" fill="#fff" opacity=".7"/>`;
    return g;
  };
  S.hinten(wolke(110, 30, 44, 9, 4) + wolke(250, 18, 30, 6, 12) + wolke(372, 36, 34, 7, 27) + wolke(30, 14, 22, 5, 41));
}
{
  /* Petřín: bewaldeter Hügel links, Kuppe bei x 13, fällt nach rechts zur Kleinseite */
  const kuppe = YD(1340, 128);
  const huegel = `M0 ${r(kuppe + 2)} C8 ${r(kuppe - 1)} 22 ${r(kuppe - 0.5)} 40 ${r(kuppe + 4)} C70 ${r(kuppe + 12)} 110 88 150 98 L170 104 L170 130 L0 130 Z`;
  let g = `<path d="${huegel}" fill="${S.lg("petrin", [[0, "#7f9a78"], [1, "#5d7a5a"]])}"/>`;
  /* Baumkronen als Rand (gelappt), Dunst darüber */
  let kr = "";
  const z = zufall(8);
  for (let x = 0; x < 168; x += 2.2 + z() * 2) {
    const t = x < 40 ? kuppe + 2 + (x - 13) * (x - 13) * 0.004 : kuppe + 4 + (x - 40) * 0.24;
    kr += `M${r(x)} ${r(t + 1)} a${r(1.6 + z())} ${r(1.4 + z())} 0 0 1 ${r(3 + z())} 0Z`;
  }
  g += `<path d="${kr}" fill="#7a9673"/>`;
  g += `<path d="${huegel}" fill="${S.lg("petdunst", [[0, "#dfe8ef", 0.3], [1, "#dfe8ef", 0.12]])}"/>`;
  /* Kloster Strahov und Häuser am Hang (helle Fassaden, rote Dächer) */
  for (const [x, y, w] of [[96, 93, 6], [104, 95, 5], [118, 97, 7], [130, 99, 6], [141, 100, 6], [152, 102, 7]]) g += `<rect x="${x}" y="${y}" width="${w}" height="3" fill="#e7dcc6"/><path d="M${x - 0.3} ${y} L${x + w / 2} ${y - 1.6} L${x + w + 0.3} ${y}Z" fill="#b65a3c"/>`;
  S.hinten(g);
}
{
  /* Hradschin-Hang rechts: Gärten unter der Burg, Kleinseite mit roten Dächern */
  let g = `<path d="M178 104 C210 98 240 92 262 90 L400 84 L400 130 L178 130 Z" fill="${S.lg("hang", [[0, "#7d9a6e"], [1, "#5a7652"]])}"/>`;
  const z = zufall(19);
  let kr = "";
  for (let x = 236; x < 400; x += 2 + z() * 2.4) { const y = 90 + (x > 262 ? -(x - 262) * 0.04 : (262 - x) * 0.07) + z() * 3; kr += `M${r(x)} ${r(y + 2)} a${r(1.5 + z())} ${r(1.3 + z())} 0 0 1 ${r(2.8 + z())} 0Z`; }
  g += `<path d="${kr}" fill="#6f8d62"/>`;
  /* Terrassen der Burggärten */
  g += `<path d="M300 93.4 L398 89.5 M318 97 L398 94" stroke="#d9cdb4" stroke-width=".45" opacity=".6"/>`;
  S.hinten(g);
  /* Häuserzeilen der Kleinseite (rechts, am Ufer in ~430 m) und auf Kampa (links): 3–5 Stockwerke,
     helle Barockfassaden, Ziegeldächer mit Gauben; davor Uferbäume */
  let d = "";
  const zd = zufall(23);
  const zeile = (x0, x1, yb, hmin, hmax) => {
    let g = "";
    for (let x = x0; x < x1;) {
      const w = 5 + zd() * 8, h = hmin + zd() * (hmax - hmin), dach = 2.4 + zd() * 2.6;
      const fc = ["#efe4cf", "#e8d6b8", "#f1e9da", "#ddc9a8", "#ecd3c3", "#e2d8b0", "#f3dcc8"][Math.floor(zd() * 7)];
      g += `<rect x="${r(x)}" y="${r(yb - h)}" width="${r(w + 0.2)}" height="${r(h)}" fill="${fc}"/>`;
      g += `<rect x="${r(x)}" y="${r(yb - h)}" width="${r(w * 0.12)}" height="${r(h)}" fill="#fff" opacity=".25"/>`;
      g += `<path d="M${r(x - 0.2)} ${r(yb - h)} L${r(x + w * 0.2)} ${r(yb - h - dach)} L${r(x + w * 0.8)} ${r(yb - h - dach)} L${r(x + w + 0.4)} ${r(yb - h)}Z" fill="${zd() < 0.5 ? "#b8573a" : "#a24a35"}"/>`;
      let fen = "";
      for (let fy = yb - h + 1.4; fy < yb - 2; fy += 2.6) for (let fx = x + 1; fx < x + w - 0.9; fx += 1.8) fen += `M${r(fx)} ${r(fy)} h.8 v1.2 h-.8Z`;
      g += `<path d="${fen}" fill="#6a6f80" opacity=".8"/>`;
      if (zd() < 0.4) g += `<path d="M${r(x + w / 2 - 0.6)} ${r(yb - h - dach * 0.5)} h1.2 v-1 l-.6 -.6 l-.6 .6Z" fill="#eadfca"/>`;
      x += w;
    }
    return g;
  };
  d += zeile(140, 400, 119.5, 10, 17) + zeile(0, 110, 122.5, 6, 11);
  /* Uferbäume (gelappt, Himmelslücken zwischen den Kronen) */
  for (let x = 2; x < 108; x += 5 + zd() * 6) { const y = 123 - zd(); d += `<path d="M${r(x)} ${r(y)} a2.6 2.9 0 1 1 5.2 0Z" fill="${zd() < 0.5 ? "#4f7a46" : "#5f8a50"}"/><path d="M${r(x + 1)} ${r(y - 2.4)} a1.2 1 0 0 1 2 0" stroke="#86a870" stroke-width=".5" fill="none"/>`; }
  for (let x = 266; x < 398; x += 7 + zd() * 9) { const y = 120.4 - zd(); d += `<path d="M${r(x)} ${r(y)} a2.4 2.7 0 1 1 4.8 0Z" fill="#557f4a"/>`; }
  S.hinten(d);
  S.hinten(`<rect x="0" y="100" width="400" height="24" fill="${S.lg("ferne", [[0, "#e6edf2", 0.0], [1, "#e6edf2", 0.35]])}"/>`);
}

/* =====================================================================
   1 — DER AUSSICHTSTURM auf dem Petřín (63,5 m, Stahlgitter)
   ===================================================================== */
{
  const d = 1340, x = r(XA(-23)), yb = r(YD(d, 128)), s = F / d;
  let k = `<g transform="scale(${s.toFixed(4)})">`;
  /* achteckiger Gitterturm, unten breiter; Plattformen, Spitze */
  k += `<path d="M-6 0 L-1.6 -60 L1.6 -60 L6 0 Z" fill="none" stroke="#7a5a44" stroke-width="1.4"/>`;
  let gi = "";
  for (let i = 0; i < 9; i++) { const y0 = -i * 6.6, y1 = y0 - 6.6, w0 = 6 - i * 0.49, w1 = w0 - 0.49; gi += `M${r(-w0)} ${r(y0)} L${r(w1)} ${r(y1)} M${r(w0)} ${r(y0)} L${r(-w1)} ${r(y1)} M${r(-w1)} ${r(y1)} H${r(w1)}`; }
  k += `<path d="${gi}" stroke="#8a6650" stroke-width=".8"/>`;
  k += `<rect x="-3.6" y="-21" width="7.2" height="1.6" fill="#6e4f3c"/><rect x="-2.6" y="-55" width="5.2" height="1.6" fill="#6e4f3c"/>`;
  k += `<path d="M-1.6 -60 L0 -64 L1.6 -60 Z" fill="#6e4f3c"/><path d="M0 -64 V-67" stroke="#6e4f3c" stroke-width=".6"/></g>`;
  S.teil({ id: "aussichtsturm", de: "der Aussichtsturm", syl: "AUS-sichts-turm", it: "la torre panoramica", itSyl: "TOR-re pa-no-RA-mi-ca", en: "lookout tower", x, y: yb, steht: true, kunst: k + flaeche(-4, -29, 8, 29, 0.6),
    tipp: "Der Aussichtsturm auf dem Petřín sieht aus wie ein kleiner Eiffelturm." });
}

/* =====================================================================
   2 — DER VEITSDOM (hinter der Burg: Westtürme, Südturm, Chor)
   ===================================================================== */
{
  const d = 1050, s = F / d, x0 = r(XA(19)), yb = r(YD(d, 56));
  /* Koordinaten in Metern, Ursprung: Südturm am Boden (Burghof, 56 m über der Brücke) */
  let k = `<g transform="scale(${s.toFixed(4)})">`;
  /* Langhaus und Chor: steiles Dach (dunkles Kupfer/Schiefer mit Rautenmuster) */
  k += `<path d="M-62 -4 L-62 -32 L60 -32 L60 -4 Z" fill="${S.lg("domwand", [[0, "#8f8a80"], [1, "#a8a196"]])}"/>`;
  k += `<path d="M-64 -32 L-56 -58 L56 -58 L64 -32 Z" fill="${S.lg("domdach", [[0, "#3e5a52"], [1, "#2c3f3a"]])}"/>`;
  let dr = "";
  for (let i = -60; i < 62; i += 4) dr += `M${i} -32 L${i + 4} -45 L${i} -58`;
  k += `<path d="${dr}" stroke="#5f7d72" stroke-width=".7" fill="none" opacity=".6"/>`;
  /* Strebebögen und Fialen am Chor (rechts) */
  let sb = "";
  for (let i = 0; i < 6; i++) { const x = 18 + i * 7.5; sb += `M${x} -4 V-30 M${x} -24 Q${x + 3} -32 ${x + 6} -34 M${x - 0.9} -30 L${x} -38 L${x + 0.9} -30`; }
  k += `<path d="${sb}" stroke="#6f6a62" stroke-width="1.3" fill="none"/>`;
  let ff = "";
  for (let i = 0; i < 9; i++) { const x = -56 + i * 8; ff += `M${x} -10 v-14 q2 -4 4 0 v14 Z`; }
  k += `<path d="${ff}" fill="#4a4e5c"/>`;
  /* zwei Westtürme (82 m) mit durchbrochenen Helmen — links */
  for (const x of [-60, -50]) {
    k += `<rect x="${x - 4}" y="-62" width="8" height="58" fill="${x < -55 ? "#7f7a71" : "#9a958b"}"/>`;
    k += `<path d="M${x - 4.4} -62 L${x} -82 L${x + 4.4} -62 Z" fill="#3f4a48"/><path d="M${x - 2} -66 L${x} -78 L${x + 2} -66" stroke="#788783" stroke-width=".7" fill="none"/>`;
    k += `<path d="M${x - 3} -40 v-12 q3 -5 6 0 v12 Z" fill="#4a4e5c"/>`;
    for (const dx of [-4, 4]) k += `<path d="M${x + dx - 0.8} -62 L${x + dx} -67 L${x + dx + 0.8} -62 Z" fill="#7f7a71"/>`;
  }
  /* Südturm (96,5 m): gotischer Schaft, Renaissance-Galerie, grüne Haube mit Laterne */
  k += `<rect x="-7" y="-58" width="14" height="58" fill="${S.lg("sturm", [[0, "#b8b1a4"], [0.6, "#a39c90"], [1, "#878177"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-3 -16 v-24 q3 -6 6 0 v24 Z" fill="#4a4e5c"/><path d="M-3 -16 v-24 q3 -6 6 0 v24" stroke="#c9c1b2" stroke-width=".6" fill="none"/>`;
  k += `<rect x="-6" y="-12" width="12" height="3" fill="#c9a24a"/>`;
  k += `<rect x="-8" y="-60" width="16" height="2.6" fill="#d8d0c0"/><path d="M-8 -62.5 h16 M-7 -60 v-2.5 M-4 -60 v-2.5 M-1 -60 v-2.5 M2 -60 v-2.5 M5 -60 v-2.5 M7 -60 v-2.5" stroke="#d8d0c0" stroke-width=".6"/>`;
  k += `<path d="M-7 -62.5 Q-7.5 -70 -3.5 -73 Q0 -76 3.5 -73 Q7.5 -70 7 -62.5 Z" fill="${KUPFER}"/>`;
  k += `<rect x="-2.6" y="-79" width="5.2" height="6" fill="${KUPFER}"/><path d="M-3.4 -79 Q0 -86 3.4 -79 Z" fill="${KUPFER}"/><path d="M-1.4 -86 Q0 -92 1.4 -86 Z" fill="${KUPFER}"/><path d="M0 -92 V-96.5" stroke="#d6a93a" stroke-width=".9"/>`;
  k += `<path d="M-1.6 -77.6 v-3 h1.2 v3 Z M.4 -77.6 v-3 h1.2 v3 Z" fill="#2f4a42"/>`;
  k += `</g>`;
  S.teil({ id: "veitsdom", de: "der Veitsdom", syl: "VEITS-dom", it: "la Cattedrale di San Vito", itSyl: "cat-te-DRA-le di san VI-to", en: "St Vitus Cathedral", x: x0, y: yb, steht: true, kunst: k,
    tipp: "Der Veitsdom ist die größte Kirche Tschechiens. Man hat fast 600 Jahre an ihm gebaut." });
}

/* =====================================================================
   3 — DIE PRAGER BURG (lange helle Südfront über den Gärten)
   ===================================================================== */
{
  const d = 1050, s = F / d, x0 = r(XA(19)), yb = r(YD(d, 36));
  let k = `<g transform="scale(${s.toFixed(4)})">`;
  /* Südflügel: drei Abschnitte, Walmdächer, viele Fensterreihen */
  const fl = [[-170, -70, 22, 0], [-70, 60, 26, 1], [60, 112, 20, 2]];
  for (const [a, b, h, i] of fl) {
    k += `<rect x="${a}" y="${-h}" width="${b - a}" height="${h}" fill="${["#ece3d2", "#f3ecdf", "#e6dcc8"][i]}"/>`;
    k += `<path d="M${a - 2} ${-h} L${a + 6} ${-h - 9} L${b - 6} ${-h - 9} L${b + 2} ${-h} Z" fill="${["#8d4a38", "#5b7b6f", "#97553f"][i]}"/>`;
    let fen = "";
    for (let x = a + 4; x < b - 3; x += 5.2) for (let y = -h + 4; y < -3; y += 6) fen += `M${r(x)} ${r(y)} h2.2 v3.2 h-2.2Z`;
    k += `<path d="${fen}" fill="#6a6f80"/>`;
    k += `<rect x="${a}" y="${-h}" width="${b - a}" height="1.4" fill="#fffaf0"/>`;
  }
  /* Schatten der Dachüberstände und die Gartenmauer mit Terrassen */
  k += `<rect x="-172" y="-1" width="286" height="8" fill="#cfc4ad"/><path d="M-172 7 L114 7" stroke="#a89c86" stroke-width="1.2"/>`;
  /* rechts: die Basilika St. Georg (zwei helle Türme) und der Schwarze Turm */
  k += `<rect x="96" y="-44" width="5" height="22" fill="#f2ead8"/><rect x="104" y="-41" width="5" height="19" fill="#e9dfca"/><path d="M95.6 -44 L98.5 -50 L101.4 -44 Z M103.6 -41 L106.5 -47 L109.4 -41 Z" fill="#7d4a3a"/>`;
  k += `</g>`;
  S.teil({ id: "prager_burg", de: "die Prager Burg", syl: "PRA-ger BURG", it: "il Castello di Praga", itSyl: "ca-STEL-lo di PRA-ga", en: "Prague Castle", x: x0, y: yb, steht: true, kunst: k,
    tipp: "Die Prager Burg ist eine der größten Burganlagen der Welt." });
}

/* =====================================================================
   4 — DIE NIKOLAUSKIRCHE auf der Kleinseite (Kuppel und Glockenturm)
   ===================================================================== */
{
  const d = 744, s = F / d, x0 = r(XA(5)), yb = r(YD(d, -4));
  let k = `<g transform="scale(${s.toFixed(4)})">`;
  /* Kirchenschiff (rosa-heller Putz), Tambour, große grüne Kuppel mit Laterne */
  k += `<rect x="-34" y="-30" width="44" height="30" fill="${S.lg("nikw", [[0, "#f6ead6"], [1, "#e2cfb4"]], 0, 0, 1, 0)}"/><path d="M-36 -30 L-28 -37 L8 -37 L12 -30 Z" fill="#7a9a88"/>`;
  k += `<path d="M-34 -30 H10 V-28 H-34 Z" fill="#fffaf0"/><path d="M-30 -28 V-4 M-20 -28 V-4 M-10 -28 V-4 M0 -28 V-4" stroke="#fff8ea" stroke-width="1.4"/>`;
  k += `<path d="M-27 -10 V-22 Q-25 -25.5 -23 -22 V-10 Z M-17 -10 V-22 Q-15 -25.5 -13 -22 V-10 Z M-7 -10 V-22 Q-5 -25.5 -3 -22 V-10 Z" fill="#7c8296"/>`;
  k += `<rect x="-24" y="-48" width="20" height="12" fill="${S.lg("tamb", [[0, "#fff6e6"], [1, "#d9c6ac"]], 0, 0, 1, 0)}"/>`;
  let tf = "";
  for (const x of [-21, -16, -11, -7]) tf += `M${x} -40 v-5 q1 -1.5 2 0 v5 Z`;
  k += `<path d="${tf}" fill="#5c6274"/><rect x="-25" y="-49" width="22" height="1.6" fill="#fffaf0"/>`;
  k += `<path d="M-25 -49 Q-25 -66 -14 -68 Q-3 -66 -3 -49 Z" fill="${KUPFER}"/>`;
  k += `<path d="M-19 -50 Q-19 -63 -14 -67 M-9 -50 Q-9 -63 -14 -67" stroke="#a8d8c0" stroke-width=".5" fill="none" opacity=".7"/>`;
  k += `<rect x="-16" y="-73" width="4" height="5" fill="#f2e6d0"/><path d="M-16.8 -73 Q-14 -78 -11.2 -73 Z" fill="${KUPFER}"/><path d="M-14 -78 V-82 M-15.2 -80.6 h2.4" stroke="#d6a93a" stroke-width=".6"/>`;
  /* Glockenturm rechts (79 m): heller Schaft, grüne Barockhaube in Stufen */
  k += `<rect x="14" y="-58" width="10" height="58" fill="${S.lg("glt", [[0, "#fbf3e3"], [1, "#d8c7aa"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M16 -50 v-5 q3 -3 6 0 v5 Z M16.6 -36 v-5 q2.4 -2.4 4.8 0 v5 Z" fill="#5c6274"/><rect x="13" y="-59" width="12" height="1.6" fill="#fffaf0"/>`;
  k += `<path d="M14 -59 Q14 -66 19 -67 Q24 -66 24 -59 Z" fill="${KUPFER}"/><rect x="17.4" y="-71" width="3.2" height="4" fill="#f2e6d0"/><path d="M16.6 -71 Q19 -76 21.4 -71 Z" fill="${KUPFER}"/><path d="M19 -76 V-79" stroke="#d6a93a" stroke-width=".6"/>`;
  k += `</g>`;
  /* der untere Teil steht hinter den Häusern der Kleinseite: dort abschneiden */
  S.def(`<clipPath id="${S.id("nikclip")}"><rect x="-40" y="-60" width="80" height="${r(60 + (101.5 - yb))}"/></clipPath>`);
  k = `<g clip-path="url(#${S.id("nikclip")})">${k}</g>`;
  S.teil({ id: "nikolauskirche", de: "die Nikolauskirche", syl: "NI-ko-laus-kir-che", it: "la chiesa di San Nicola", itSyl: "CHIE-sa di san ni-CO-la", en: "St Nicholas Church", x: x0, y: yb, steht: true, kunst: k,
    tipp: "Die Nikolauskirche ist eine der schönsten Barockkirchen in Prag." });
}

/* =====================================================================
   5 — DIE MOLDAU (Wasser mit Himmelsspiegelung, Wellen, Wehr)
   ===================================================================== */
{
  const WY = (s, q) => Y(s, q, -13);
  let k = `<path d="M0 124 L110 121.5 L150 120 L400 118.5 L400 260 L0 260 Z" fill="${S.lg("wasser", [[0, "#9bb3bf"], [0.25, "#7d9aa5"], [0.7, "#5c7a84"], [1, "#4a6670"]])}"/>`;
  /* Spiegelung der hellen Ufer und des Himmels (weich) */
  k += `<g filter="url(#${S.id("spiegel")})" opacity=".45"><path d="M150 120 L400 118.5 L400 126 L150 127 Z" fill="#e8dcc4"/><path d="M0 124 L110 121.5 L110 128 L0 131 Z" fill="#9fb48e"/></g>`;
  /* Wellen: kurze helle und dunkle Striche, nach vorn größer */
  let hell = "", dunkel = "";
  for (let i = 0; i < 520; i++) {
    const y = 122 + Math.pow(rnd(), 1.6) * 138, x = rnd() * 400, w = 0.8 + (y - 120) * 0.05 + rnd() * 1.5;
    if (rnd() < 0.55) hell += `M${r(x)} ${r(y)} h${r(w)}`; else dunkel += `M${r(x)} ${r(y)} h${r(w)}`;
  }
  k += `<path d="${hell}" stroke="#d8e6ee" stroke-width=".35" opacity=".55"/><path d="${dunkel}" stroke="#36515b" stroke-width=".35" opacity=".45"/>`;
  /* das Altstädter Wehr: schäumende schräge Linie links */
  k += `<path d="M0 168 Q40 150 100 126 L104 127 Q46 152 0 176 Z" fill="${S.lg("wehr", [[0, "#ffffff", 0.55], [1, "#dfe9ee", 0.1]])}"/><path d="M0 168 Q40 150 100 126" stroke="#f4f8fa" stroke-width=".5" stroke-dasharray="1 .7" opacity=".9" fill="none"/>`;
  /* Kampa: Ufermauer links, Kleinseitner Ufermauer rechts */
  k += `<path d="M0 124 L110 121.5 L110 122.6 L0 125.4 Z" fill="#b9ad96"/><path d="M150 120 L400 118.5 L400 119.6 L150 121.2 Z" fill="#c9bea8"/>`;
  S.teil({ id: "moldau", de: "die Moldau", syl: "MOL-dau", it: "la Moldava", itSyl: "mol-DA-va", en: "Vltava", x: 0, y: 0, kunst: k,
    tipp: "Die Moldau fließt mitten durch Prag. Der Komponist Smetana hat ein berühmtes Stück über sie geschrieben." });
}

/* =====================================================================
   6 — AUF DER MOLDAU: Ausflugsschiff, Tretboot, Schwan
   ===================================================================== */
{
  /* Ausflugsschiff mit Glasdach, von der Seite (fährt flussabwärts nach rechts) */
  const s0 = 150, qa = 46, qb = 76;
  const A = (q, h) => P(s0, q, -13 + h);
  let k = "";
  /* Spiegelung */
  k += `<g filter="url(#${S.id("spiegel")})" opacity=".22"><path d="M${A(qa, 0)} L${A(qb, 0)} L${A(qb - 1, -1.8)} L${A(qa + 1, -1.8)}Z" fill="#f4f4f0"/><path d="M${A(qa, -0.9)} L${A(qb, -0.9)} L${A(qb - 1, -1.3)} L${A(qa + 1, -1.3)}Z" fill="#1f4e8c"/></g>`;
  /* Rumpf weiß mit blauem Streifen, Bug rechts spitz */
  k += `<path d="M${A(qa, 0.2)} L${A(qb - 3, 0.2)} L${A(qb + 1, 2.2)} L${A(qa - 0.5, 2.2)}Z" fill="${S.lg("rumpf", [[0, "#ffffff"], [1, "#d7dde2"]])}"/>`;
  k += `<path d="M${A(qa - 0.3, 1.4)} L${A(qb, 1.4)} L${A(qb + 0.5, 1.8)} L${A(qa - 0.4, 1.8)}Z" fill="#1f4e8c"/>`;
  /* Aufbau mit Glasdach und Fensterreihe, Fahrgäste */
  k += `<path d="M${A(qa + 1.5, 2.2)} L${A(qb - 5, 2.2)} L${A(qb - 5, 4.4)} L${A(qa + 1.5, 4.4)}Z" fill="#eef1f3"/>`;
  k += `<path d="M${A(qa + 2, 2.7)} L${A(qb - 5.5, 2.7)} L${A(qb - 5.5, 4)} L${A(qa + 2, 4)}Z" fill="${S.lg("glasbg", [[0, "#9fc4dc"], [1, "#4a6f88"]])}"/>`;
  let fg = "";
  for (let q = qa + 3; q < qb - 6; q += 1.6) fg += `M${A(q, 2.7)} L${A(q, 4)}`;
  k += `<path d="${fg}" stroke="#eef1f3" stroke-width=".35"/>`;
  for (let q = qa + 3.2; q < qb - 6; q += 2.3) { const [x, y] = A(q, 3.2).split(" ").map(Number); k += `<circle cx="${r(x)}" cy="${r(y)}" r=".55" fill="${["#d8a986", "#8a5a3a", "#e6c09a"][Math.floor(rnd() * 3)]}"/>`; }
  k += `<path d="M${A(qa + 1.2, 4.4)} L${A(qb - 4.6, 4.4)} L${A(qb - 5.2, 5.1)} L${A(qa + 1.8, 5.1)}Z" fill="#cfe2ee" opacity=".9"/>`;
  k += `<path d="M${A(qb - 4, 2.2)} L${A(qb - 2, 2.2)} L${A(qb - 2, 4.6)} L${A(qb - 4, 4.6)}Z" fill="#f6f6f2"/><path d="M${A(qb - 3.6, 3.4)} L${A(qb - 2.4, 3.4)} L${A(qb - 2.4, 4.2)} L${A(qb - 3.6, 4.2)}Z" fill="#3b5266"/>`;
  k += `<path d="M${A(qa + 0.6, 4.4)} L${A(qa + 0.6, 6.6)}" stroke="#c0392b" stroke-width=".4"/><path d="M${A(qa + 0.6, 6.6)} L${A(qa - 1.2, 6.2)} L${A(qa + 0.6, 5.8)}Z" fill="#fff"/><path d="M${A(qa + 0.6, 6.2)} L${A(qa - 1.2, 6.2)} L${A(qa + 0.6, 5.8)}Z" fill="#11457e"/>`;
  /* Bugwelle und Kielwasser */
  k += `<path d="M${A(qb + 1, 0)} Q${A(qb + 3, -0.6)} ${A(qb + 6, 0)}" stroke="#fff" stroke-width=".7" fill="none" opacity=".8"/><path d="M${A(qa - 0.5, 0)} L${A(qa - 9, -0.4)} M${A(qa - 0.5, 0.2)} L${A(qa - 7, 0.6)}" stroke="#e8f2f6" stroke-width=".5" opacity=".7"/>`;
  S.teil({ id: "ausflugsschiff", de: "das Ausflugsschiff", syl: "AUS-flugs-schiff", it: "il battello turistico", itSyl: "bat-TEL-lo tu-RI-sti-co", en: "sightseeing boat", x: 0, y: 0, kunst: k,
    tipp: "Mit dem Ausflugsschiff fährt man unter der Karlsbrücke hindurch." });
}
{
  /* Tretboot in Schwanenform */
  const s0 = 88, q0 = 30, sc = F / Dd(s0, q0), x = r(X(s0, q0)), y = r(Y(s0, q0, -13));
  let k = `<g transform="scale(${sc.toFixed(4)})">`;
  k += `<ellipse cx="0" cy=".15" rx="1.9" ry=".3" fill="#2f4a55" opacity=".35"/>`;
  k += `<path d="M-1.6 0 Q-1.8 -.9 -1.1 -1 L1 -1 Q1.6 -.9 1.6 0 Z" fill="${S.lg("tret", [[0, "#ffffff"], [1, "#d5dade"]])}"/>`;
  k += `<path d="M1.1 -1 Q1.7 -1.6 1.4 -2.4 Q1.3 -2.9 1.7 -3 Q2.1 -3 2.2 -2.7 L2.5 -2.6 L2.15 -2.45 Q1.9 -2.5 1.85 -2.2 Q2 -1.3 1.4 -.8 Z" fill="#fbfbf8"/><path d="M2.2 -2.7 L2.55 -2.6 L2.2 -2.48 Z" fill="#e36a2a"/><circle cx="1.95" cy="-2.75" r=".06" fill="#1d1d22"/>`;
  k += `<path d="M-1.5 -1 Q-1.9 -1.4 -1.4 -1.6 Q-1.2 -1.3 -1 -1 Z" fill="#f2f2ee"/>`;
  k += `<rect x="-.9" y="-1.25" width="1.5" height=".3" fill="#d14a3a"/>`;
  k += `<circle cx="-.4" cy="-1.7" r=".2" fill="#d8a986"/><path d="M-.62 -1.5 h.44 v.4 h-.44Z" fill="#2f6fb3"/><circle cx=".2" cy="-1.72" r=".2" fill="#6b4a32"/><path d="M-.02 -1.52 h.44 v.4 h-.44Z" fill="#e3b23c"/>`;
  k += `<path d="M-2.2 .1 q1 .3 2 0 q1 -.3 2.4 0" stroke="#e8f2f6" stroke-width=".08" fill="none"/></g>`;
  S.teil({ id: "tretboot", de: "das Tretboot", syl: "TRET-boot", it: "il pedalò", itSyl: "pe-da-LÒ", en: "pedal boat", x, y, steht: true, kunst: k,
    tipp: "Auf der Moldau kann man Tretboote ausleihen – manche sehen aus wie ein Schwan." });
}
{
  /* Schwan auf dem Wasser */
  const s0 = 62, q0 = 20, sc = F / Dd(s0, q0), x = r(X(s0, q0)), y = r(Y(s0, q0, -13));
  let k = `<g transform="scale(${sc.toFixed(4)})">`;
  k += `<ellipse cx="0" cy=".05" rx=".7" ry=".1" fill="#2f4a55" opacity=".3"/>`;
  k += `<path d="M-.6 0 Q-.75 -.32 -.45 -.38 Q-.1 -.45 .25 -.3 Q.4 -.22 .4 0 Z" fill="${S.lg("schwan", [[0, "#ffffff"], [1, "#dfe4e8"]])}"/>`;
  k += `<path d="M-.55 -.32 Q-.75 -.5 -.5 -.55 Q-.3 -.42 -.2 -.38 Z" fill="#fff"/>`;
  k += `<path d="M.25 -.28 Q.42 -.5 .34 -.75 Q.3 -.92 .44 -.94 Q.56 -.93 .58 -.86 L.7 -.82 L.57 -.79 Q.5 -.8 .48 -.74 Q.56 -.5 .4 -.24 Z" fill="#fff"/><path d="M.58 -.86 L.71 -.82 L.57 -.78 Z" fill="#e36a2a"/><circle cx=".5" cy="-.88" r=".02" fill="#1d1d22"/>`;
  k += `<path d="M-.8 .06 q.4 .1 .8 0 q.4 -.1 .8 0" stroke="#e8f2f6" stroke-width=".04" fill="none"/></g>`;
  S.teil({ id: "schwan", de: "der Schwan", syl: "SCHWAN", it: "il cigno", itSyl: "CI-gno", en: "swan", x, y, steht: true, kunst: k + flaeche(-3, -6, 7, 6.5, 0.6),
    tipp: "An der Karlsbrücke schwimmen viele weiße Schwäne." });
}

/* =====================================================================
   7 — DIE KLEINSEITNER BRÜCKENTÜRME (links Judithturm, rechts der hohe Turm)
   ===================================================================== */
{
  const s0 = 512, s = F / Dd(s0, 0), x0 = r(X(s0, 0)), yb = r(Y(s0, 0));
  let k = `<g transform="scale(${s.toFixed(4)})">`;
  /* Judithturm (romanisch, ~ 28 m, heller Putz, Satteldach) links */
  k += `<rect x="-13.5" y="-25" width="8.5" height="25" fill="#e6dac3"/><rect x="-13.5" y="-25" width="2" height="25" fill="#f3eadb"/>`;
  k += `<path d="M-14 -25 L-13.4 -27 L-5.6 -27 L-5 -25 Z" fill="#cfc2a8"/><path d="M-13.6 -27 L-9.25 -34 L-4.9 -27 Z" fill="#4c4a4d"/><path d="M-9.25 -34 V-35.4" stroke="#d6a93a" stroke-width=".4"/>`;
  k += `<path d="M-11.4 -15 v-3.4 q1 -1.6 2 0 v3.4 Z M-8.6 -15 v-3.4 q1 -1.6 2 0 v3.4 Z M-10 -21.5 v-2 q.8 -1.2 1.6 0 v2 Z" fill="#5c6274"/>`;
  /* Torbogen mit Zinnen zwischen den Türmen */
  k += `<rect x="-5" y="-15" width="10" height="15" fill="#8d8478"/><path d="M-3 0 V-7 Q0 -11 3 0 Z" fill="#2c2a2e"/><path d="M-3 0 V-7 Q0 -10.6 3 -7 V0" fill="#2c2a2e"/>`;
  let zi = "";
  for (let x = -5; x < 5; x += 2) zi += `M${x} -15 v-1.4 h1.2 v1.4Z`;
  k += `<path d="${zi}" fill="#8d8478"/>`;
  /* der hohe gotische Turm (43,5 m) rechts: dunkler Stein, Blendmaßwerk, steiles Schieferdach mit Ecktürmchen */
  k += `<rect x="5" y="-29" width="10.5" height="29" fill="${S.lg("mturm", [[0, "#9a9285"], [1, "#6f685f"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M5.4 -24 h9.7 M5.4 -12 h9.7" stroke="#b3a996" stroke-width=".5"/>`;
  k += `<path d="M7 -8 v-6 q3.5 -4 7 0 v6 M7 -18 v-4 q3.5 -3 7 0 v4" stroke="#c9c0b0" stroke-width=".5" fill="none"/>`;
  k += `<rect x="4.4" y="-30.4" width="11.7" height="1.6" fill="#a59c8c"/>`;
  k += `<path d="M5 -30.4 L10.25 -43.5 L15.5 -30.4 Z" fill="${SCHIEFER}"/><path d="M5 -30.4 L10.25 -43.5 L8.4 -30.4 Z" fill="#6c717c"/><path d="M10.25 -43.5 V-45.2" stroke="#d6a93a" stroke-width=".5"/>`;
  for (const x of [5, 15.5]) k += `<rect x="${x - 0.8}" y="-32.6" width="1.6" height="2.4" fill="#8f877b"/><path d="M${x - 1} -32.6 L${x} -36.4 L${x + 1} -32.6 Z" fill="#4a4e58"/>`;
  k += `<path d="M9.4 -34.5 l.85 -2.4 l.85 2.4 Z" fill="#7d838e"/>`;
  k += `</g>`;
  S.teil({ id: "brueckenturm", de: "der Brückenturm", syl: "BRÜ-cken-turm", it: "la torre del ponte", itSyl: "TOR-re del PON-te", en: "bridge tower", x: x0, y: yb, steht: true, kunst: k + flaeche(-14 * s, -44 * s, 31 * s, 44 * s, 0.6),
    tipp: "An beiden Enden der Karlsbrücke steht ein Brückenturm. Durch das Tor geht man in die Kleinseite." });
}

/* =====================================================================
   8 — DIE KARLSBRÜCKE (Fahrbahn mit Pflaster, Brüstungen aus Sandstein)
   ===================================================================== */
const BR = 4.75, BRH = 1.1, BRD = 0.6;   /* halbe Breite, Brüstungshöhe, -dicke */
const STATUEN = [];   /* [s, Seite(-1/+1)] — über den Pfeilern, alle ~30 m */
for (let i = 0; i < 15; i++) { STATUEN.push([34 + i * 31, 1]); STATUEN.push([30 + i * 31.4, -1]); }
{
  const S0 = 18, S1 = 505;
  let k = "";
  /* Pflaster: Grundfläche in Flucht, nach hinten heller (Dunst) */
  k += poly([P(S0, -BR + BRD, 0), P(S1, -BR + BRD, 0), P(S1, BR - BRD, 0), P(S0, BR - BRD, 0)], S.lg("pflaster", [[0, "#b6a998"], [0.4, "#9a8d7c"], [1, "#857868"]]));
  /* Pflasterfugen: Längsreihen und Querreihen (nah dicht) */
  let fu = "";
  for (let q = -BR + BRD + 0.35; q < BR - BRD; q += 0.35) fu += strecke(P(S0, q), P(160, q));
  k += `<path d="${fu}" stroke="#6d6253" stroke-width=".18" opacity=".45"/>`;
  let qu = "";
  for (let s = S0; s < 160; s += s < 40 ? 0.32 : s < 80 ? 0.7 : 1.5) qu += strecke(P(s, -BR + BRD), P(s, BR - BRD));
  k += `<path d="${qu}" stroke="#6d6253" stroke-width=".14" opacity=".35"/>`;
  /* Lichtflecken auf den Steinen (Rundungen), nur vorn */
  let st = "";
  for (let i = 0; i < 220; i++) { const s = S0 + Math.pow(rnd(), 1.5) * 30, q = -BR + BRD + rnd() * (2 * BR - 2 * BRD); const [x, y] = P(s, q).split(" ").map(Number); if (y < 259 && x > 1) st += `M${r(x)} ${r(y)} h${r(0.3 + 18 / s)}`; }
  k += `<path d="${st}" stroke="#d9cdb9" stroke-width=".4" opacity=".5"/>`;
  /* Brüstungen: Innenseite (links im Schatten, rechts in der Sonne) und Oberseite */
  const bruestung = (q0, innen, seite) => {
    let g = poly([P(S0, innen, 0), P(S1, innen, 0), P(S1, innen, BRH), P(S0, innen, BRH)], seite < 0 ? SAND_S : SAND_L);
    g += poly([P(S0, innen, BRH), P(S1, innen, BRH), P(S1, q0, BRH), P(S0, q0, BRH)], seite < 0 ? "#8c8275" : "#b3a691");
    /* Fugen der Quader */
    let f = "";
    for (let s = S0; s < 200; s += 1.6) f += strecke(P(s, innen, 0), P(s, innen, BRH));
    f += strecke(P(S0, innen, 0.55), P(S1, innen, 0.55));
    g += `<path d="${f}" stroke="${seite < 0 ? "#3e3833" : "#6d6253"}" stroke-width=".2" opacity=".55"/>`;
    g += `<path d="${strecke(P(S0, innen, BRH), P(S1, innen, BRH))}" stroke="${seite < 0 ? "#a39784" : "#d8cbb4"}" stroke-width=".45"/>`;
    return g;
  };
  k += bruestung(-BR, -BR + BRD, -1) + bruestung(BR, BR - BRD, 1);
  /* Schatten der Statuen und Laternen fallen nach vorn rechts auf das Pflaster */
  let sch = "";
  for (const [s, sei] of STATUEN) if (s < 200) {
    const q0 = sei * (BR - BRD), dq = 0.48, ds = 0.93;   /* Richtung: 27° nach rechts */
    if (sei < 0) sch += poly([P(s - 1, q0, 0), P(s + 1, q0, 0), P(s + 1 + ds * 7, q0 + dq * 7, 0), P(s - 1 + ds * 7, q0 + dq * 7, 0)], "#2b2a3a", ` opacity=".22"`);
  }
  k += sch;
  S.teil({ id: "karlsbruecke", de: "die Karlsbrücke", syl: "KARLS-brü-cke", it: "il Ponte Carlo", itSyl: "PON-te CAR-lo", en: "Charles Bridge", x: 0, y: 0, kunst: k,
    tipp: "Die Karlsbrücke ist über 650 Jahre alt und 516 Meter lang. Autos dürfen nicht darüber fahren." });
}

/* =====================================================================
   9 — DIE LATERNEN auf der Brüstung (Gaslaternen)
   ===================================================================== */
{
  let k = "";
  const lat = (s, sei) => {
    const q = sei * (BR - BRD / 2), sc = F / Dd(s, q), x = X(s, q), y = Y(s, q, BRH);
    let g = `<g transform="translate(${r(x)} ${r(y)}) scale(${sc.toFixed(4)})">`;
    g += `<path d="M-.14 0 V-3 h.28 V0 Z" fill="#26282c"/><path d="M-.22 0 h.44 v-.35 h-.44Z" fill="#33363c"/>`;
    g += `<path d="M-.3 -3 L-.22 -3.6 h.44 L.3 -3 Z" fill="#2b2e33"/><path d="M-.24 -3.6 L-.3 -4.2 h.6 L.24 -3.6 Z" fill="#f2e8c8" opacity=".9"/>`;
    g += `<path d="M-.36 -4.2 L0 -4.55 L.36 -4.2 Z" fill="#26282c"/><path d="M0 -4.55 V-4.7" stroke="#26282c" stroke-width=".06"/>`;
    g += `<path d="M-.3 -4.2 L-.24 -3.6 M.3 -4.2 L.24 -3.6 M0 -4.2 V-3.6" stroke="#26282c" stroke-width=".04"/></g>`;
    return g;
  };
  for (let i = 9; i >= 0; i--) { k += lat(46 + i * 31.4, -1) + lat(49.5 + i * 31, 1); }
  S.teil({ id: "laterne", de: "die Laterne", syl: "la-TER-ne", it: "il lampione", itSyl: "lam-PIO-ne", en: "street lamp", x: 0, y: 0, kunst: k,
    tipp: "Am Abend zündet ein Laternenanzünder einige Gaslaternen auf der Brücke noch von Hand an." });
}

/* =====================================================================
   10 — DIE STATUEN (30 dunkle Barockfiguren), Lupe auf den heiligen Nepomuk
   ===================================================================== */
const NEPO = { s: 34 + 7 * 31, sei: 1 };
{
  let k = "";
  /* Barockfiguren in Metern (etwa 3 m), geschwärzter Sandstein. Licht von vorn links:
     linke Kanten hell, rechte Seite dunkel; Falten als dunkle Bögen. Nah mit Falten, fern nur Umriss. */
  const SF = S.lg("stf", [[0, "#77706a"], [0.35, "#575049"], [0.8, "#36322e"], [1, "#25221f"]], 0, 0, 1, 0);
  const SF2 = S.lg("stf2", [[0, "#68615a"], [0.5, "#47423c"], [1, "#2a2724"]], 0, 0, 1, 0);
  const falten = (d, nah) => nah ? `<path d="${d}" stroke="#1d1b19" stroke-width=".05" fill="none" opacity=".8"/>` : "";
  const kopf = (x, y, heil, nah) => `<ellipse cx="${x}" cy="${y}" rx=".15" ry=".19" fill="${SF2}"/>` + (heil ? `<circle cx="${x}" cy="${r((y - 0.02) * 100) / 100}" r=".27" fill="none" stroke="#3a3530" stroke-width=".035"/>` : "") +
    (nah ? `<path d="M${r((x - 0.13) * 100) / 100} ${r((y - 0.05) * 100) / 100} Q${x} ${r((y - 0.25) * 100) / 100} ${r((x + 0.13) * 100) / 100} ${r((y - 0.05) * 100) / 100}" stroke="#7d756c" stroke-width=".04" fill="none"/>` : "");
  const figur = (art, nah) => {
    let g = `<path d="M-.75 0 Q-.6 -.32 0 -.3 Q.6 -.32 .75 0 Z" fill="#3a3632"/>`;   /* Wolken-/Felssockel */
    if (art === 0) {           /* Heiliger mit Kreuz, Mantel über die Schulter geworfen */
      g += `<path d="M-.5 -.25 C-.58 -.9 -.6 -1.6 -.48 -2.1 C-.42 -2.38 -.32 -2.52 -.18 -2.6 L.2 -2.6 C.36 -2.5 .46 -2.3 .5 -2 C.58 -1.5 .6 -.8 .52 -.25 Z" fill="${SF}"/>`;
      g += `<path d="M.22 -2.55 C.75 -2.1 .85 -1.2 .45 -.5 C.2 -.35 -.15 -.45 -.38 -.62 C-.05 -.95 .25 -1.5 .2 -2.3 Z" fill="${SF2}"/>`;
      g += falten("M-.3 -.35 Q-.36 -1.2 -.2 -2.1 M.05 -.4 Q.1 -1.1 .02 -1.9 M.4 -.7 Q.6 -1.3 .4 -2", nah);
      g += `<path d="M-.35 -2.2 Q-.1 -1.9 .15 -1.8" stroke="${SF2}" stroke-width=".16" stroke-linecap="round" fill="none"/>`;
      g += `<path d="M.42 -1.3 L.68 -3.5 M.48 -3.0 L.86 -2.95" stroke="#2a2724" stroke-width=".09" stroke-linecap="round"/>`;
      g += kopf(0.02, -2.84, true, nah);
    } else if (art === 1) {    /* Bischof mit Mitra und Krummstab */
      g += `<path d="M-.55 -.25 C-.62 -1 -.6 -1.7 -.45 -2.15 C-.38 -2.4 -.28 -2.55 -.16 -2.6 L.18 -2.6 C.32 -2.52 .44 -2.35 .5 -2.1 C.62 -1.6 .64 -.9 .58 -.25 Z" fill="${SF}"/>`;
      g += `<path d="M-.42 -2.2 C-.2 -1.6 .2 -1.6 .44 -2.15 L.4 -1.2 C.1 -1.05 -.15 -1.05 -.4 -1.2 Z" fill="${SF2}"/>`;
      g += falten("M-.25 -.3 Q-.3 -.8 -.25 -1.1 M.1 -.3 Q.12 -.7 .1 -1.05 M.35 -.3 Q.42 -.7 .36 -1.1", nah);
      g += `<path d="M-.62 -.2 V-3.3" stroke="#2a2724" stroke-width=".07"/><path d="M-.62 -3.3 Q-.62 -3.62 -.38 -3.6 Q-.2 -3.55 -.3 -3.35 Q-.4 -3.25 -.48 -3.35" stroke="#2a2724" stroke-width=".07" fill="none"/>`;
      g += `<path d="M-.5 -2.2 Q-.6 -2 -.62 -1.8" stroke="${SF2}" stroke-width=".15" stroke-linecap="round" fill="none"/>`;
      g += kopf(0, -2.82, false, nah) + `<path d="M-.15 -2.95 L-.13 -3.25 L0 -3.38 L.13 -3.25 L.15 -2.95 Z" fill="${SF2}"/>`;
    } else if (art === 2) {    /* Madonna mit Kind, Mantel mit Kapuze */
      g += `<path d="M-.6 -.25 C-.7 -1 -.62 -1.8 -.4 -2.3 C-.3 -2.6 -.15 -2.95 0 -3 C.18 -2.95 .3 -2.65 .42 -2.35 C.62 -1.8 .66 -1 .6 -.25 Z" fill="${SF}"/>`;
      g += `<path d="M-.42 -2.3 C-.2 -2.75 .2 -2.75 .4 -2.3 C.2 -2.5 -.2 -2.5 -.42 -2.3 Z" fill="#2a2724"/>`;
      g += falten("M-.4 -.3 Q-.5 -1.2 -.3 -2 M0 -.3 Q.05 -1 .02 -1.6 M.35 -.3 Q.45 -1 .3 -1.8", nah);
      g += `<ellipse cx="-.32" cy="-1.85" rx=".2" ry=".3" fill="${SF2}"/><circle cx="-.36" cy="-2.22" r=".11" fill="${SF2}"/>`;
      g += kopf(0.04, -2.62, true, nah);
    } else if (art === 3) {    /* Heiliger mit ausgebreiteten Armen, ein Engelchen am Sockel */
      g += `<path d="M-.48 -.25 C-.55 -1 -.52 -1.7 -.4 -2.2 L-.16 -2.55 L.16 -2.55 L.4 -2.2 C.52 -1.7 .56 -1 .5 -.25 Z" fill="${SF}"/>`;
      g += `<path d="M-.38 -2.3 Q-.75 -2.6 -.95 -3.05 M.38 -2.3 Q.75 -2.55 .98 -2.95" stroke="${SF2}" stroke-width=".16" stroke-linecap="round" fill="none"/>`;
      g += falten("M-.25 -.3 Q-.3 -1.2 -.2 -2.1 M.15 -.3 Q.2 -1.1 .12 -2", nah);
      g += `<path d="M.45 -.28 Q.4 -.65 .62 -.72 Q.85 -.66 .8 -.28 Z" fill="${SF2}"/><circle cx=".63" cy="-.84" r=".1" fill="${SF2}"/><path d="M.5 -.6 L.36 -.8 L.52 -.72 Z" fill="#4a4540"/>`;
      g += kopf(0, -2.8, true, nah);
    } else {                   /* Gruppe: Heiliger kniend vor einem stehenden mit Buch */
      g += `<path d="M-.75 -.25 C-.8 -.7 -.7 -1.1 -.45 -1.25 C-.35 -1.45 -.25 -1.5 -.15 -1.45 L-.05 -1 L0 -.25 Z" fill="${SF2}"/>`;
      g += `<path d="M0 -.25 C-.05 -1 0 -1.7 .12 -2.2 L.3 -2.5 L.6 -2.5 L.75 -2.2 C.88 -1.7 .9 -1 .85 -.25 Z" fill="${SF}"/>`;
      g += `<path d="M.1 -1.9 L-.18 -2.15 L-.02 -2.32 L.26 -2.08 Z" fill="#2a2724"/>`;
      g += falten("M.3 -.3 Q.25 -1.2 .35 -2.1 M.65 -.3 Q.7 -1 .62 -2", nah);
      g += kopf(-0.3, -1.66, true, nah) + kopf(0.45, -2.76, true, nah);
    }
    return g;
  };
  const statue = (s, sei, i) => {
    const q = sei * (BR + 0.2), sc = F / Dd(s, q), x = X(s, q), y = Y(s, q, 0), nah = s < 110;
    let g = `<g transform="translate(${r(x)} ${r(y)}) scale(${sc.toFixed(4)})">`;
    /* Sockel (2,6 m): Sockelstufe, Würfel mit Inschriftkartusche, Gesims; links/vorn im Licht */
    g += `<path d="M-1.15 0 V-.35 H1.15 V0 Z M-1.05 -.35 V-2.35 H1.05 V-.35 Z" fill="${SOCKEL}"/>`;
    g += `<path d="M-1.05 -.35 V-2.35 H-.75 V-.35 Z" fill="#c2b29a" opacity=".55"/><path d="M.7 -.35 V-2.35 H1.05 V-.35 Z" fill="#3e3833" opacity=".45"/>`;
    g += `<path d="M-1.3 -2.35 H1.3 L1.2 -2.6 H-1.2 Z" fill="#b5a68e"/><path d="M-1.3 -2.35 H1.3 V-2.28 H-1.3 Z" fill="#5e564f"/>`;
    if (nah) g += `<path d="M-.55 -1.85 Q-.6 -1.35 -.55 -.85 H.55 Q.6 -1.35 .55 -1.85 Z" fill="#6f6556" stroke="#d2c4ab" stroke-width=".04"/><path d="M-.38 -1.55 h.76 M-.42 -1.35 h.84 M-.36 -1.15 h.72" stroke="#3e3833" stroke-width=".04"/>`;
    else g += `<rect x="-.5" y="-1.8" width="1" height=".9" fill="#6f6556"/>`;
    g += `<g transform="translate(0 -2.6)">${figur(i % 5, nah)}</g></g>`;
    return g;
  };
  /* von hinten nach vorn zeichnen */
  const liste = STATUEN.map(([s, sei], i) => [s, sei, i]).sort((a, b) => b[0] - a[0]);
  for (const [s, sei, i] of liste) {
    if (s === NEPO.s && sei === NEPO.sei) {
      /* der heilige Nepomuk (Bronze): mit Kruzifix, fünf goldene Sterne als Heiligenschein, Bronzetafeln */
      const q = sei * (BR + 0.2), sc = F / Dd(s, q), x = X(s, q), y = Y(s, q, 0);
      let g = `<g transform="translate(${r(x)} ${r(y)}) scale(${sc.toFixed(4)})">`;
      g += `<path d="M-1.15 0 V-.35 H1.15 V0 Z M-1.05 -.35 V-2.35 H1.05 V-.35 Z" fill="${SOCKEL}"/><path d="M-1.3 -2.35 H1.3 L1.2 -2.6 H-1.2 Z" fill="#b5a68e"/>`;
      g += `<rect x="-.75" y="-2.2" width="1.5" height="1.1" fill="#3f3a2a"/><rect x="-.3" y="-1.9" width=".6" height=".5" fill="#e8c86a"/>`;
      g += `<g transform="translate(0 -2.6)"><path d="M-.5 0 Q-.6 -1.5 -.4 -2.4 Q-.25 -2.75 0 -2.8 Q.25 -2.75 .4 -2.4 Q.6 -1.5 .5 0 Z" fill="#2c2f2a"/>`;
      g += `<path d="M-.4 -2.4 Q-.25 -2.75 0 -2.8 Q.25 -2.75 .4 -2.4 L.3 -2 L-.3 -2 Z" fill="#e8e2d0"/>`;
      g += `<circle cx="0" cy="-3.05" r=".24" fill="#2c2f2a"/><path d="M-.5 -1.7 L.5 -2.3 M-.1 -2.5 L.1 -1.5" stroke="#3a3326" stroke-width=".1"/>`;
      let st = "";
      for (let j = 0; j < 5; j++) { const a = (-60 + j * 30) * Math.PI / 180; st += `<circle cx="${r(Math.sin(a) * 0.55 * 100) / 100}" cy="${r((-3.1 - Math.cos(a) * 0.55) * 100) / 100}" r=".11" fill="#ffd34a"/>`; }
      g += st + `</g></g>`;
      k += g;
    } else k += statue(s, sei, i);
  }
  const nx = r(X(NEPO.s, BR + 0.2)), ny = r(Y(NEPO.s, BR + 0.2)), ns = F / Dd(NEPO.s, BR + 0.2);
  S.teil({ id: "statue", de: "die Statue", syl: "STA-tu-e", it: "la statua", itSyl: "STA-tu-a", en: "statue", x: 0, y: 0, kunst: k,
    zoom: { x: r(nx - 15), y: r(ny - 17), w: 27, h: 18 },
    unter: [
      { id: "nepomuk", de: "der heilige Nepomuk", syl: "der HEI-li-ge NE-po-muk", it: "san Giovanni Nepomuceno", itSyl: "san gio-VAN-ni ne-po-mu-CE-no", en: "St John of Nepomuk", x: nx, y: ny,
        kunst: flaeche(-1.3 * ns, -6.3 * ns, 2.6 * ns, 6.3 * ns, 0.3), tipp: "Wer die blanke Bronzetafel am Nepomuk berührt, kommt wieder nach Prag – so sagt man." },
      { id: "heiligenschein", de: "der Heiligenschein", syl: "HEI-li-gen-schein", it: "l'aureola", itSyl: "au-RE-o-la", en: "halo", x: nx, y: r(ny - 6 * ns),
        kunst: flaecheEllipse(0, 0, 0.8 * ns, 0.6 * ns), tipp: "Um den Kopf des Nepomuk leuchten fünf goldene Sterne." },
    ],
    tipp: "Auf der Karlsbrücke stehen 30 Statuen von Heiligen." });
}

/* =====================================================================
   11 — DER STAND eines Künstlers (Böhmisches Glas, Bilder)
   ===================================================================== */
{
  const s0 = 40, q0 = -3.2, sc = F / Dd(s0, q0), x = r(X(s0, q0)), y = r(Y(s0, q0));
  let k = `<g transform="scale(${sc.toFixed(4)})">`;
  k += `<path d="M-.8 0 L-.75 -.95 M.8 0 L.75 -.95 M-.7 .25 L-.66 -.85 M.7 .25 L.66 -.85" stroke="#4a3a2a" stroke-width=".06"/>`;
  k += `<path d="M-.95 -.95 H.95 V-1.02 H-.95 Z" fill="#6b4a32"/><path d="M-.95 -.95 L.95 -.95 L.85 -.75 L-.85 -.75 Z" fill="#7a2a3a"/>`;
  k += `<path d="M-.9 -.95 L.9 -.95 L.82 -.62 L-.82 -.62Z" fill="#8a2f42" opacity=".9"/>`;
  /* Glasvasen: rubinrot, kobaltblau, klar mit Schliff */
  const vase = (cx, h, c) => `<path d="M${cx - 0.07} -1.02 Q${cx - 0.12} ${r((-1.02 - h * 0.45) * 100) / 100} ${cx - 0.04} ${r((-1.02 - h * 0.8) * 100) / 100} L${cx - 0.06} ${r((-1.02 - h) * 100) / 100} H${cx + 0.06} L${cx + 0.04} ${r((-1.02 - h * 0.8) * 100) / 100} Q${cx + 0.12} ${r((-1.02 - h * 0.45) * 100) / 100} ${cx + 0.07} -1.02 Z" fill="${c}"/><path d="M${cx - 0.04} -1.06 L${cx - 0.03} ${r((-1.02 - h * 0.7) * 100) / 100}" stroke="#fff" stroke-width=".02" opacity=".8"/>`;
  k += vase(-0.6, 0.32, "#b3122e") + vase(-0.35, 0.24, "#1f4fa8") + vase(-0.12, 0.3, "#d8eef2") + vase(0.12, 0.2, "#2e8a5a");
  k += `<path d="M.32 -1.02 h.18 l-.03 -.12 h-.12 Z M.56 -1.02 h.18 l-.03 -.12 h-.12 Z" fill="#c9e6ee" stroke="#fff" stroke-width=".01"/>`;
  /* Bilder mit Prag-Motiven an der Staffelwand dahinter */
  k += `<path d="M-.7 -1.02 L-.6 -1.9 M.7 -1.02 L.6 -1.9" stroke="#5a4632" stroke-width=".05"/>`;
  k += `<rect x="-.62" y="-1.86" width=".56" height=".42" fill="#efe6d6" stroke="#6b4a32" stroke-width=".03"/><path d="M-.58 -1.48 L-.46 -1.66 L-.38 -1.58 L-.3 -1.72 L-.2 -1.6 L-.1 -1.48 Z" fill="#7a9ab8"/><path d="M-.4 -1.72 V-1.8" stroke="#3a3a3a" stroke-width=".02"/>`;
  k += `<rect x="0" y="-1.86" width=".56" height=".42" fill="#f3e8d3" stroke="#6b4a32" stroke-width=".03"/><path d="M.05 -1.5 Q.28 -1.62 .5 -1.5 L.5 -1.48 L.05 -1.48 Z" fill="#9a8b76"/><circle cx=".38" cy="-1.74" r=".05" fill="#e8b23a"/>`;
  k += `</g>`;
  S.teil({ id: "stand", de: "der Stand", syl: "STAND", it: "la bancarella", itSyl: "ban-ca-REL-la", en: "stall", x, y, steht: true, kunst: k,
    zoom: { x: r(x - 21), y: r(y - 26), w: 39, h: 26 },
    unter: [{ id: "vase", de: "die Vase", syl: "VA-se", it: "il vaso", itSyl: "VA-so", en: "vase", x: r(x - 0.35 * sc), y: r(y - 1.02 * sc),
      kunst: flaeche(-0.38 * sc, -0.36 * sc, 0.76 * sc, 0.38 * sc, 0.4), tipp: "Böhmisches Glas ist berühmt: Es wird von Hand geschliffen." }],
    tipp: "Auf der Brücke verkaufen Künstler Bilder und Schmuck." });
}

/* =====================================================================
   12 — DIE TAUBEN auf dem Pflaster
   ===================================================================== */
{
  let k = "";
  const taube = (s, q, dreh) => {
    const sc = F / Dd(s, q), x = X(s, q), y = Y(s, q);
    return `<g transform="translate(${r(x)} ${r(y)}) scale(${(sc * dreh).toFixed(4)} ${sc.toFixed(4)})"><ellipse cx="0" cy=".01" rx=".14" ry=".02" fill="#2b2a3a" opacity=".3"/>` +
      `<path d="M-.15 -.08 Q-.12 -.17 0 -.17 Q.1 -.17 .12 -.12 Q.12 -.05 .05 -.04 L-.12 -.05 L-.2 -.06 Z" fill="#8f939e"/><path d="M-.08 -.13 Q.02 -.16 .07 -.1 Q0 -.07 -.08 -.08Z" fill="#6f737e"/>` +
      `<circle cx=".11" cy="-.18" r=".045" fill="#7a7e8a"/><path d="M.1 -.15 q.03 .02 .04 .04" stroke="#6a9a7a" stroke-width=".02"/><path d="M.15 -.185 l.04 .01 l-.04 .01Z" fill="#c8a080"/>` +
      `<path d="M-.01 -.04 v.04 M.03 -.04 v.04" stroke="#c46a5a" stroke-width=".015"/></g>`;
  };
  k += taube(23.5, 0.4, 1) + taube(24.2, 1.3, -1) + taube(22.6, -0.6, 1);
  S.teil({ id: "taube", de: "die Taube", syl: "TAU-be", it: "il piccione", itSyl: "pic-CIO-ne", en: "pigeon", x: 0, y: 0, kunst: k });
}

/* =====================================================================
   13 — DER MUSIKER mit Akkordeon und Hut für die Münzen
   ===================================================================== */
let MUS = null;
{
  const s0 = 26, q0 = -3.4, sc = F / Dd(s0, q0), x = r(X(s0, q0)), y = r(Y(s0, q0));
  const pose = { kipp: 0, lende: 1, brust: 0, nacken: 4, kopf: 6, huefteL: { vor: 2, seit: 4 }, knieL: 2, fussL: 0, huefteR: { vor: -4, seit: 4 }, knieR: 4, fussR: 0,
    schulterL: { vor: 30, seit: 28, dreh: 30 }, ellbogenL: 85, unterarmL: 20, handL: 0, fingerL: 0.6, schulterR: { vor: 30, seit: 28, dreh: 30 }, ellbogenR: 85, unterarmR: 20, handR: 0, fingerR: 0.6 };
  const m = B.mensch({ id: "prg_mus", geschlecht: "m", blick: 30, neigung: 16, frisur: "kurz", haarfarbe: "grau", haut: "hell", laecheln: true, pose,
    kleidung: { oberteil: { stueck: "hemd", farbe: "weiss" }, jacke: { stueck: "weste", farbe: "#2c2a30" }, unterteil: { stueck: "anzughose" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" }, kopf: { stueck: "hut", farbe: "#2a2a2e" } } }, r(1.76 * sc));
  MUS = { x, y, m, sc };
  S.hinten(`<ellipse cx="${r(x + 0.9 * sc)}" cy="${r(y + 0.1)}" rx="${r(0.55 * sc)}" ry="${r(0.12 * sc)}" fill="#2b2a3a" opacity=".22" filter="url(#bw_weich)"/>`);
  S.teil({ id: "musiker", de: "der Musiker", syl: "MU-si-ker", it: "il musicista", itSyl: "mu-si-CI-sta", en: "musician", x, y, kunst: kompakt(m.svg, 2),
    tipp: "Auf der Karlsbrücke spielen jeden Tag Straßenmusiker." });
}
{
  /* Akkordeon zwischen den Händen: rote Gehäuse, Balg in Falten, Tastatur links */
  const { x, y, m } = MUS;
  const hL = { x: x + m.z.handL.x * m.k, y: y + m.z.handL.y * m.k }, hR = { x: x + m.z.handR.x * m.k, y: y + m.z.handR.y * m.k };
  const cx = (hL.x + hR.x) / 2, cy = (hL.y + hR.y) / 2 + 1.2, w = Math.abs(hL.x - hR.x) * 0.92, h = w * 0.62;
  let k = `<rect x="${r(-w / 2)}" y="${r(-h / 2)}" width="${r(w * 0.22)}" height="${r(h)}" rx=".4" fill="#b3241f"/><rect x="${r(w / 2 - w * 0.22)}" y="${r(-h / 2)}" width="${r(w * 0.22)}" height="${r(h)}" rx=".4" fill="#b3241f"/>`;
  let balg = "";
  for (let i = 0; i < 7; i++) { const xx = -w / 2 + w * 0.22 + i * (w * 0.56 / 6); balg += `M${r(xx)} ${r(-h / 2 + 0.3)} V${r(h / 2 - 0.3)}`; }
  k += `<rect x="${r(-w / 2 + w * 0.22)}" y="${r(-h / 2 + 0.3)}" width="${r(w * 0.56)}" height="${r(h - 0.6)}" fill="#2a2a30"/><path d="${balg}" stroke="#c9c9cf" stroke-width=".3"/>`;
  k += `<rect x="${r(-w / 2 + 0.3)}" y="${r(-h / 2 + 0.5)}" width="${r(w * 0.1)}" height="${r(h - 1)}" fill="#f4f1ea"/>`;
  k += `<path d="M${r(-w / 2 + 0.3)} ${r(-h / 2 + 1.2)} h${r(w * 0.1)} M${r(-w / 2 + 0.3)} ${r(-h / 2 + 2)} h${r(w * 0.1)}" stroke="#1d1d22" stroke-width=".25"/>`;
  k += `<rect x="${r(-w / 2)}" y="${r(-h / 2)}" width="${r(w)}" height=".35" fill="#fff" opacity=".25"/>`;
  S.teil({ oben: true, id: "akkordeon", de: "das Akkordeon", syl: "ak-KOR-de-on", it: "la fisarmonica", itSyl: "fi-sar-MO-ni-ca", en: "accordion", x: r(cx), y: r(cy), kunst: k });
}
{
  /* Hut mit Münzen vor dem Musiker */
  const s0 = 25.2, q0 = -2.4, sc = F / Dd(s0, q0), x = r(X(s0, q0)), y = r(Y(s0, q0));
  let k = `<g transform="scale(${sc.toFixed(4)})"><ellipse cx="0" cy="-.03" rx=".22" ry=".07" fill="#2a2a2e"/><path d="M-.13 -.05 Q-.13 -.17 0 -.17 Q.13 -.17 .13 -.05 Z" fill="#33333a"/>`;
  k += `<ellipse cx="0" cy="-.09" rx=".1" ry=".03" fill="#5a3a2a"/><circle cx="-.03" cy="-.095" r=".018" fill="#e9c35a"/><circle cx=".03" cy="-.09" r=".016" fill="#c9c9cf"/><circle cx=".005" cy="-.1" r=".015" fill="#e9c35a"/></g>`;
  S.teil({ oben: true, id: "hut", de: "der Hut", syl: "HUT", it: "il cappello", itSyl: "cap-PEL-lo", en: "hat", x, y, steht: true, kunst: k + flaeche(-4, -4, 8, 4.4, 0.6),
    tipp: "Wer die Musik mag, wirft eine Münze in den Hut." });
}

/* =====================================================================
   14 — DER PUPPENSPIELER mit der Marionette
   ===================================================================== */
let PUP = null;
{
  const s0 = 31, q0 = 2.4, sc = F / Dd(s0, q0), x = r(X(s0, q0)), y = r(Y(s0, q0));
  const pose = { kipp: 0, lende: 1, brust: 2, nacken: 12, kopf: 14, huefteL: { vor: 2, seit: 4 }, knieL: 2, fussL: 0, huefteR: { vor: -4, seit: 4 }, knieR: 4, fussR: 0,
    schulterL: { vor: 55, seit: 10, dreh: 0 }, ellbogenL: 40, unterarmL: 20, handL: 0, fingerL: 0.7, schulterR: { vor: 55, seit: 10, dreh: 0 }, ellbogenR: 40, unterarmR: 20, handR: 0, fingerR: 0.7 };
  const m = B.mensch({ id: "prg_pup", geschlecht: "m", blick: -28, neigung: 16, frisur: "locken", haarfarbe: "dunkelbraun", haut: "hell", pose,
    kleidung: { oberteil: { stueck: "pullover", farbe: "#2f5f95" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" }, zubehoer: { stueck: "schal", farbe: "#d9a43a" } } }, r(1.78 * sc));
  PUP = { x, y, m, sc };
  S.teil({ id: "puppenspieler", de: "der Puppenspieler", syl: "PUP-pen-spie-ler", it: "il burattinaio", itSyl: "bu-rat-ti-NA-io", en: "puppeteer", x, y, kunst: kompakt(m.svg, 2),
    tipp: "Marionetten bewegt man an Fäden. Prag hat ein eigenes Marionettentheater." });
}
{
  /* Marionette: Spielkreuz in den Händen, Fäden, kleine Figur (Teufelchen? nein: ein Musikant mit Hut) tanzt auf dem Pflaster */
  const { x, y, m, sc } = PUP;
  const hL = { x: x + m.z.handL.x * m.k, y: y + m.z.handL.y * m.k }, hR = { x: x + m.z.handR.x * m.k, y: y + m.z.handR.y * m.k };
  const kx = (hL.x + hR.x) / 2, ky = (hL.y + hR.y) / 2;
  /* Fußpunkt der Puppe: 0,5 m vor dem Spieler (links von ihm im Bild) */
  const fx = X(30.4, 1.6), fy = Y(30.4, 1.6), ps = F / Dd(30.4, 1.6);
  const ph = 0.55 * ps;   /* 55 cm groß */
  let k = `<path d="M${r(kx - 1.6)} ${r(ky)} L${r(kx + 1.6)} ${r(ky)} M${r(kx)} ${r(ky - 0.8)} V${r(ky + 0.8)}" stroke="#7a5432" stroke-width=".45" stroke-linecap="round"/>`;
  const kopfY = fy - ph * 0.88, handY = fy - ph * 0.55;
  k += `<path d="M${r(kx)} ${r(ky)} L${r(fx)} ${r(kopfY)} M${r(kx - 1.6)} ${r(ky)} L${r(fx - ph * 0.2)} ${r(handY)} M${r(kx + 1.6)} ${r(ky)} L${r(fx + ph * 0.22)} ${r(handY - ph * 0.1)} M${r(kx - 0.6)} ${r(ky + 0.4)} L${r(fx - ph * 0.07)} ${r(fy - ph * 0.03)} M${r(kx + 0.6)} ${r(ky + 0.4)} L${r(fx + ph * 0.1)} ${r(fy - ph * 0.08)}" stroke="#e8e4da" stroke-width=".12" opacity=".8"/>`;
  /* Figur: Hut, Gesicht, rote Jacke, schwarze Hose, Holzschuhe */
  const g = (a, b) => `${r(fx + a * ph)} ${r(fy + b * ph)}`;
  k += `<path d="M${g(-0.12, -0.6)} L${g(0.12, -0.6)} L${g(0.14, -0.3)} L${g(-0.14, -0.3)}Z" fill="#c0392b"/>`;
  k += `<path d="M${g(-0.1, -0.3)} L${g(-0.07, -0.03)} M${g(0.08, -0.3)} L${g(0.1, -0.08)}" stroke="#2a2a30" stroke-width="${r(0.07 * ph)}" stroke-linecap="round"/>`;
  k += `<path d="M${g(-0.12, -0.56)} L${g(-0.2, -0.55)} M${g(0.12, -0.56)} L${g(0.22, -0.65)}" stroke="#c0392b" stroke-width="${r(0.06 * ph)}" stroke-linecap="round"/>`;
  k += `<circle cx="${r(fx)}" cy="${r(fy - ph * 0.7)}" r="${r(ph * 0.1)}" fill="#e8c4a0"/><circle cx="${r(fx + ph * 0.03)}" cy="${r(fy - ph * 0.69)}" r="${r(ph * 0.02)}" fill="#c0392b"/>`;
  k += `<path d="M${g(-0.14, -0.76)} L${g(0.14, -0.76)} L${g(0.09, -0.8)} L${g(0.07, -0.9)} L${g(-0.07, -0.9)} L${g(-0.09, -0.8)}Z" fill="#2a2a30"/>`;
  k += `<ellipse cx="${r(fx - ph * 0.07)}" cy="${r(fy)}" rx="${r(ph * 0.06)}" ry="${r(ph * 0.03)}" fill="#7a5432"/><ellipse cx="${r(fx + ph * 0.1)}" cy="${r(fy - ph * 0.05)}" rx="${r(ph * 0.06)}" ry="${r(ph * 0.03)}" fill="#7a5432"/>`;
  S.teil({ oben: true, id: "marionette", de: "die Marionette", syl: "ma-ri-o-NET-te", it: "la marionetta", itSyl: "ma-rio-NET-ta", en: "marionette", x: 0, y: 0, kunst: k,
    tipp: "Eine Marionette ist eine Puppe an Fäden." });
}

/* =====================================================================
   15 — DIE TOURISTIN mit dem Trdelník
   ===================================================================== */
{
  const s0 = 21.6, q0 = 1.3, sc = F / Dd(s0, q0), x = r(X(s0, q0)), y = r(Y(s0, q0));
  const pose = { kipp: 0, lende: 1, brust: 0, nacken: 2, kopf: 0, huefteL: { vor: 2, seit: 4 }, knieL: 2, fussL: 0, huefteR: { vor: -4, seit: 4 }, knieR: 4, fussR: 0,
    schulterR: { vor: 20, seit: 10, dreh: 20 }, ellbogenR: 120, unterarmR: 40, handR: 0, fingerR: 0.7, schulterL: { vor: 3, seit: 8 }, ellbogenL: 14, unterarmL: 10, handL: 6, fingerL: 0.4 };
  const m = B.mensch({ id: "prg_tour", geschlecht: "w", blick: 34, neigung: 18, frisur: "zopf", haarfarbe: "blond", haut: "hell", laecheln: true, pose,
    kleidung: { kleid: { stueck: "sommerkleid", farbe: "#e9a03a" }, schuhe: { stueck: "sandale" }, zubehoer: { stueck: "tasche", farbe: "#7d5838" } } }, r(1.66 * sc));
  S.hinten(`<ellipse cx="${r(x + 0.8 * sc)}" cy="${r(y + 0.2)}" rx="${r(0.5 * sc)}" ry="${r(0.12 * sc)}" fill="#2b2a3a" opacity=".22" filter="url(#bw_weich)"/>`);
  S.teil({ id: "touristin", de: "die Touristin", syl: "tou-RIS-tin", it: "la turista", itSyl: "tu-RI-sta", en: "tourist", x, y, kunst: kompakt(m.svg, 2),
    tipp: "Nicht weit von der Brücke steht am Altstädter Ring die berühmte Astronomische Uhr." });
  /* Trdelník: Hohlgebäck (Rolle), goldbraun mit Zimtzucker, oben Eis */
  const hx = x + m.z.handR.x * m.k, hy = y + m.z.handR.y * m.k;
  let k = `<path d="M-1 0 L-1.3 -4.6 Q0 -5.1 1.3 -4.6 L1 0 Z" fill="${S.lg("trdl", [[0, "#9a5a22"], [0.5, "#d8964a"], [1, "#a8642a"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-1.05 -.8 L1.05 -1.4 M-1.12 -1.9 L1.12 -2.5 M-1.2 -3 L1.2 -3.6 M-1.26 -4.1 L1.2 -4.6" stroke="#7a3e12" stroke-width=".28"/>`;
  let zu = "";
  for (let i = 0; i < 14; i++) zu += `<circle cx="${r((rnd() - 0.5) * 2)}" cy="${r(-rnd() * 4.4)}" r=".14" fill="#f6e2b8"/>`;
  k += zu + `<ellipse cx="0" cy="-4.85" rx="1.35" ry=".9" fill="#fbf4e6"/><circle cx="-.4" cy="-5.4" r=".55" fill="#f7efe0"/><circle cx=".45" cy="-5.3" r=".5" fill="#c84a5a"/>`;
  S.teil({ oben: true, id: "trdelnik", de: "der Trdelník", syl: "TRDL-ník", it: "il trdelník", itSyl: "TRDL-nik", en: "chimney cake", x: r(hx), y: r(hy + 1.6), kunst: k,
    tipp: "Der Trdelník ist ein süßes Gebäck. Der Teig wird um einen Spieß gewickelt und über dem Feuer gebacken." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/prag.js"));
console.log(aus);
