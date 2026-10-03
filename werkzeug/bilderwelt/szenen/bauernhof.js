#!/usr/bin/env node
/* =====================================================================
   DER BAUERNHOF (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (Hofanlagen in Deutschland: Drei-/Vierseithof, Merkblätter
   zu landwirtschaftlichen Bauten, Zuchtbeurteilung Holstein):
   - Die Gebäude stehen um den HOFPLATZ: Wohnhaus, STALL (Ziegel oder
     Fachwerk, kleine Stallfenster, zweiteilige Stalltür), große hölzerne
     SCHEUNE mit Tor und Heuboden-Luke. Auf dem Hof die DUNGSTÄTTE (der
     Misthaufen) mit Mistgabel und Schubkarre — „je größer der Misthaufen,
     desto stattlicher der Hof“.
   - Holstein-Kühe (schwarzbunt), Kreuzhöhe 145–156 cm, 650–750 kg, in
     Deutschland mit gelben Ohrmarken in beiden Ohren, meist enthornt.
     Kälber stehen einzeln im weißen Kälberiglu auf Stroh.
   - Schweine: Deutsche Landrasse, rosa, Schlappohren über den Augen.
   - Legehennen braun, der Hahn mit großem Kamm und Sichelfedern; ein
     hölzerner Hühnerstall mit Leiter und Legenest.
   - Am Hoftor die Milchbank mit Milchkannen, die Schwengelpumpe mit
     Steintrog, Heu in Quaderballen, die Weide mit Holzpfosten-Zaun.
   Maßstab: Augenhöhe 4 m über dem Hof, Horizont y = 70. Eine Strecke von
   1 m am Boden bei y misst (y − 70) / 4 Einheiten: bei den Gebäuden
   (y ≈ 118) 12 je Meter, bei der Kuh (y ≈ 158) 22, ganz vorn (y ≈ 192) 30.

   TIER-BAUKASTEN: tierKasten(S) zeichnet Tiere in Seitenansicht nach
   echten Maßen (Zentimeter, Blick nach rechts, Ursprung = Boden unter
   der Körpermitte). Die Szenen wald, teich, tierheim und haustiere
   benutzen ihn mit: require("./bauernhof").tierKasten(S).
   ===================================================================== */
"use strict";
const path = require("path");
const B = require("../bau");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = B;
const r = B.r;

/* =====================================================================
   TIER-BAUKASTEN
   ===================================================================== */
function tierKasten(S, seed = 4711) {
  const rnd = zufall(seed);
  const G = {};
  const lg = (n, stops, x1 = 0, y1 = 0, x2 = 0, y2 = 1) => G["l" + n] || (G["l" + n] = S.lg("t" + n, stops, x1, y1, x2, y2));
  const rg = (n, stops, cx = 0.5, cy = 0.5, rr = 0.5) => G["r" + n] || (G["r" + n] = S.rg("t" + n, stops, cx, cy, rr));
  /* glatte Linie durch Punkte (Catmull-Rom); [x, y, 1] = Ecke */
  const glatt = (pts, zu = true, sp = 1) => {
    const n = pts.length, P = (i) => (zu ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
    let d = `M${r(pts[0][0])} ${r(pts[0][1])}`;
    for (let i = 0; i < (zu ? n : n - 1); i++) {
      const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
      const c1 = p1[2] ? p1 : [p1[0] + (p2[0] - p0[0]) / 6 * sp, p1[1] + (p2[1] - p0[1]) / 6 * sp];
      const c2 = p2[2] ? p2 : [p2[0] - (p3[0] - p1[0]) / 6 * sp, p2[1] - (p3[1] - p1[1]) / 6 * sp];
      d += `C${r(c1[0])} ${r(c1[1])} ${r(c2[0])} ${r(c2[1])} ${r(p2[0])} ${r(p2[1])}`;
    }
    return d + (zu ? "Z" : "");
  };
  const box = (pts) => { const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]); return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]; };
  const VOL = () => lg("vol", [[0, "#fff", 0.2], [0.35, "#fff", 0], [0.7, "#000", 0.1], [1, "#000", 0.34]]);
  let nr = 0;
  /* Körper: Umriss + (geklippt) Zeichnung + Volumen-Verlauf + feiner Rand */
  const koerper = (pts, fill, innen = "", o = {}) => {
    const d = glatt(pts);
    const id = S.id("tk" + nr++);
    S.def(`<path id="${id}" d="${d}"/><clipPath id="${id}c"><use href="#${id}"/></clipPath>`);
    const [x0, y0, x1, y1] = box(pts);
    let s = `<use href="#${id}" fill="${fill}"/>`;
    s += `<g clip-path="url(#${id}c)">${innen}`;
    if (o.vol !== false) s += `<rect x="${r(x0)}" y="${r(y0)}" width="${r(x1 - x0)}" height="${r(y1 - y0)}" fill="${VOL()}"/>`;
    s += `</g>`;
    if (o.rand !== false) s += `<use href="#${id}" fill="none" stroke="${o.rand || "#000"}" stroke-opacity="${o.randA || 0.35}" stroke-width="${o.rw || 1}"/>`;
    return s;
  };
  const form = (pts, fill, extra = "") => `<path d="${glatt(pts)}" fill="${fill}"${extra}/>`;
  const linie = (pts, farbe, w, extra = "") => `<path d="${glatt(pts, false)}" fill="none" stroke="${farbe}" stroke-width="${w}" stroke-linecap="round"${extra}/>`;
  /* Fell/Federn: kurze Striche in einem Feld, alle in einem Pfad */
  const striche = (n, x0, y0, x1, y1, dx, dy, farbe, w, op = 0.5) => {
    let d = "";
    for (let i = 0; i < n; i++) {
      const x = x0 + rnd() * (x1 - x0), y = y0 + rnd() * (y1 - y0), s = 0.6 + rnd() * 0.8;
      d += `M${r(x)} ${r(y)}l${r(dx * s)} ${r(dy * s)}`;
    }
    return `<path d="${d}" stroke="${farbe}" stroke-width="${w}" stroke-opacity="${op}" fill="none" stroke-linecap="round"/>`;
  };
  /* Auge: Lid, Augapfel, Iris/Pupille, Glanzlicht */
  const auge = (x, y, rr, iris = "#2a1a10", o = {}) => {
    let s = `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(rr * 1.25)}" ry="${r(rr * (o.flach || 1))}" fill="${o.lid || "#1a120c"}"/>`;
    s += `<ellipse cx="${r(x + rr * 0.08)}" cy="${r(y)}" rx="${r(rr * 0.95)}" ry="${r(rr * 0.85 * (o.flach || 1))}" fill="${iris}"/>`;
    if (o.pupille) s += `<ellipse cx="${r(x + rr * 0.1)}" cy="${r(y)}" rx="${r(rr * (o.schlitz ? 0.22 : 0.45))}" ry="${r(rr * 0.8 * (o.flach || 1))}" fill="#080605"/>`;
    s += `<circle cx="${r(x + rr * 0.35)}" cy="${r(y - rr * 0.35)}" r="${r(rr * 0.28)}" fill="#fff" opacity=".85"/>`;
    return s;
  };
  /* Zusammensetzen: Schatten (Szeneneinheiten) + skalierte Zeichnung */
  const fertig = (svg, k, dir, laenge, hit) => {
    const L = laenge * k / 2;
    return schatten(0, 0.2, L * 0.95, Math.max(0.8, L * 0.12), 0.32) + `<g transform="scale(${r4(dir * k)} ${r4(k)})">${svg}</g>` + (hit || "");
  };
  const r4 = (n) => Math.round(n * 10000) / 10000;

  /* ---------------- HUF / KLAUE (Paarhufer zweigeteilt) ---------------- */
  const klaue = (x, w, h, farbe = "#2b2522") => `<path d="M${r(x - w / 2)} 0 L${r(x - w / 2 + 1)} ${r(-h)} L${r(x + w / 2 - 1.5)} ${r(-h)} L${r(x + w / 2 + 1)} 0 Z" fill="${farbe}"/><line x1="${r(x + w * 0.15)}" y1="0" x2="${r(x + w * 0.05)}" y2="${r(-h)}" stroke="#000" stroke-width=".6" opacity=".5"/>`;

  /* =================== DIE KUH (Holstein, schwarzbunt) =================== */
  function kuh(k, dir = 1, o = {}) {
    const SCHWARZ = "#1d1b1c", WEISS = lg("kuhw", [[0, "#fbfaf6"], [1, "#e4e0d8"]]);
    /* Beine auf der abgewandten Seite (dunkler, leicht versetzt) */
    let s = "";
    s += form([[46, -66], [48, -40], [47, -10], [50, -2], [52, 0, 1], [40, 0, 1], [40, -8], [38, -34], [34, -60]], "#cfcac0");
    s += klaue(46, 12, 6);
    s += form([[-56, -70], [-60, -50], [-68, -40], [-67, -10], [-62, 0, 1], [-74, 0, 1], [-76, -14], [-81, -42], [-84, -70]], "#c9c3b8");
    s += klaue(-68, 12, 6);
    /* Schwanz hinter dem Körper */
    s += linie([[-97, -136], [-103, -120], [-104, -95], [-103, -70], [-102, -52]], "#efece6", 3.2);
    s += form([[-102, -56], [-99, -48], [-100, -36], [-103, -32], [-106, -38], [-105, -50]], "#2a2626");
    /* Umriss mit den nahen Beinen */
    const K = [[-96, -139], [-80, -144], [-66, -149], [-54, -143], [-40, -141], [0, -139], [28, -144], [44, -149], [62, -144], [80, -134], [94, -132],
      [103, -129], [113, -117], [122, -101], [128, -89], [129, -82], [125, -77], [116, -78], [106, -86], [97, -95], [86, -98], [70, -88], [58, -76],
      [56, -66], [54, -48], [53, -36], [53, -12], [55, -6], [58, 0, 1], [44, 0, 1], [45, -6], [44, -14], [44, -34], [42, -48], [37, -62],
      [10, -62], [-20, -62], [-40, -64], [-58, -68],
      [-64, -58], [-76, -44], [-76, -22], [-75, -9], [-70, 0, 1], [-84, 0, 1], [-84, -8], [-86, -16], [-88, -30], [-92, -44], [-95, -58], [-100, -84], [-102, -110], [-100, -128]];
    /* Flecken (schwarz), Kopf schwarz mit weißer Blesse */
    let f = "";
    f += form([[84, -150], [110, -140], [140, -100], [136, -70], [100, -80], [86, -98], [80, -120]], SCHWARZ);
    f += form([[104, -127], [109, -122], [118, -104], [124, -92], [127, -84], [122, -84], [116, -96], [108, -110], [103, -122]], "#f4f2ec");
    f += form([[30, -160], [70, -152], [88, -128], [80, -104], [66, -96], [52, -108], [34, -118], [22, -132]], SCHWARZ);
    f += form([[-24, -160], [12, -158], [16, -126], [6, -104], [-12, -100], [-22, -118], [-34, -130]], SCHWARZ);
    f += form([[-110, -150], [-62, -152], [-50, -128], [-60, -108], [-78, -98], [-90, -86], [-104, -90], [-112, -120]], SCHWARZ);
    f += form([[-40, -88], [-26, -86], [-24, -74], [-36, -70], [-44, -78]], SCHWARZ);
    /* Fell: feine Haarstriche, Rippen-/Muskelschatten */
    f += striche(40, -90, -140, 60, -70, 3, 1.2, "#8c877e", 0.5, 0.35);
    f += `<path d="M0 -120 q14 -6 24 6 M-8 -108 q16 -6 28 6 M-14 -96 q16 -6 30 4" stroke="#000" stroke-opacity=".1" stroke-width="2" fill="none"/>`;
    f += `<path d="M-64 -128 q-14 22 -6 54" stroke="#000" stroke-opacity=".12" stroke-width="3" fill="none"/>`;
    f += `<ellipse cx="-10" cy="-112" rx="44" ry="24" fill="${rg("glanz", [[0, "#fff", 0.35], [1, "#fff", 0]])}"/>`;
    /* Klauen und weiße Fesseln */
    f += klaue(51, 13, 6) + klaue(-77, 13, 6);
    s += koerper(K, WEISS, f, { rw: 1.2 });
    /* Euter mit Zitzen */
    s += form([[-32, -66], [-34, -54], [-42, -45], [-56, -44], [-64, -52], [-64, -68]], lg("euter", [[0, "#efc0b4"], [1, "#c98577"]]));
    s += `<path d="M-40 -46 l-.8 6 h2.6 l-.2 -6 Z M-55 -45 l-.4 6 h2.6 l-.6 -6 Z" fill="#c07c70"/><path d="M-38 -60 q-6 -6 -14 -4" stroke="#fff" stroke-width="1.4" opacity=".35" fill="none"/>`;
    s += `<path d="M-40 -60 q8 -4 18 2" stroke="#d9a49a" stroke-width="2.4" fill="none"/>`;
    /* Ohr (waagerecht) mit gelber Ohrmarke, Auge, Nüstern */
    s += form([[94, -128], [86, -138], [76, -142], [72, -138], [80, -130], [92, -124]], SCHWARZ);
    s += `<path d="M78 -138 q6 0 10 6" stroke="#5a4e48" stroke-width="1" fill="none"/>`;
    s += `<rect x="76" y="-137" width="5" height="6" rx="1" fill="#f2c318" stroke="#b8900c" stroke-width=".4"/>`;
    s += auge(106, -113, 2.6, "#2b1c14");
    s += `<path d="M102 -116 q4 -3 8 0" stroke="#000" stroke-width=".8" fill="none"/>`;
    s += `<ellipse cx="126" cy="-86" rx="2" ry="1.3" fill="#000" opacity=".8"/>`;
    s += `<path d="M118 -79 q4 1 9 0" stroke="#000" stroke-width=".7" fill="none" opacity=".6"/>`;
    s += `<ellipse cx="124" cy="-84" rx="5" ry="4" fill="#555" opacity=".3"/>`;
    return fertig(s, k, dir, 230);
  }

  /* =================== DAS KALB (Holstein, ~6 Wochen) =================== */
  function kalb(k, dir = 1) {
    const SCHWARZ = "#1d1b1c";
    let s = "";
    s += form([[22, -44], [24, -24], [24, -6], [26, 0, 1], [18, 0, 1], [18, -8], [16, -26], [14, -42]], "#cfcac0") + klaue(22, 8, 4);
    s += form([[-30, -46], [-30, -30], [-34, -22], [-33, -6], [-30, 0, 1], [-38, 0, 1], [-40, -10], [-42, -26], [-44, -46]], "#c9c3b8") + klaue(-34, 8, 4);
    s += linie([[-46, -74], [-50, -62], [-50, -44]], "#efece6", 2) + `<ellipse cx="-50" cy="-42" rx="2" ry="4" fill="#2a2626"/>`;
    const K = [[-46, -74], [-30, -78], [-4, -76], [18, -79], [28, -83], [36, -88], [42, -93], [48, -94], [55, -87], [60, -76], [62, -70], [59, -67], [53, -68], [46, -71], [38, -66], [32, -56],
      [30, -46], [29, -28], [29, -8], [30, 0, 1], [21, 0, 1], [22, -8], [22, -28], [21, -42], [16, -48], [-6, -46], [-24, -48],
      [-27, -40], [-28, -30], [-28, -8], [-26, 0, 1], [-35, 0, 1], [-35, -8], [-36, -18], [-40, -28], [-44, -36], [-48, -52], [-49, -66]];
    let f = form([[32, -110], [66, -90], [68, -60], [42, -64], [28, -80]], SCHWARZ);
    f += form([[47, -92], [51, -86], [57, -74], [60, -70], [56, -70], [51, -80], [46, -88]], "#f4f2ec");
    f += form([[-20, -90], [10, -88], [8, -64], [-8, -58], [-22, -66]], SCHWARZ);
    f += form([[-56, -86], [-38, -88], [-34, -66], [-46, -56], [-56, -60]], SCHWARZ);
    f += striche(24, -44, -78, 30, -48, 2, 0.8, "#8c877e", 0.4, 0.35);
    f += klaue(25.5, 9, 4) + klaue(-30.5, 9, 4);
    s += koerper(K, lg("kuhw", [[0, "#fbfaf6"], [1, "#e4e0d8"]]), f, { rw: 0.8 });
    s += form([[40, -91], [32, -97], [24, -99], [22, -96], [29, -91], [38, -87]], SCHWARZ);
    s += `<rect x="25" y="-97" width="3.4" height="4" rx=".7" fill="#f2c318"/>`;
    s += auge(49, -82, 2, "#2b1c14");
    s += `<ellipse cx="60" cy="-72" rx="1.4" ry=".9" fill="#000" opacity=".8"/>`;
    return fertig(s, k, dir, 115);
  }

  /* =================== DAS PFERD (Brauner, Warmblut) =================== */
  function pferd(k, dir = 1) {
    const FELL = lg("pfd", [[0, "#9a5528"], [0.6, "#7a3d1a"], [1, "#552810"]]);
    const SCHW = "#1f1714";
    let s = "";
    /* ferne Beine */
    s += form([[50, -92], [52, -62], [52, -50], [51, -24], [54, -12], [57, -4], [59, 0, 1], [46, 0, 1], [46, -8], [44, -16], [43, -30], [43, -52], [40, -74], [36, -92]], "#3a2416");
    s += form([[-50, -98], [-54, -80], [-60, -58], [-58, -30], [-56, -14], [-52, -4], [-50, 0, 1], [-64, 0, 1], [-64, -8], [-67, -16], [-68, -34], [-72, -58], [-78, -84], [-84, -102]], "#3a2416");
    /* Schweif */
    s += form([[-100, -150], [-110, -140], [-116, -110], [-118, -80], [-116, -60], [-110, -52], [-106, -62], [-106, -90], [-102, -120], [-96, -146]], lg("schweif", [[0, "#2a1d16"], [1, "#120c09"]]));
    s += striche(14, -114, -130, -104, -60, 0.5, 8, "#4a3426", 0.6, 0.6);
    const K = [[-98, -150], [-80, -160], [-55, -157], [-25, -149], [10, -152], [34, -164], [48, -176], [64, -194], [80, -210], [94, -220],
      [101, -222], [108, -219], [118, -200], [130, -178], [139, -160], [142, -151], [139, -144], [128, -143], [118, -148], [108, -154], [101, -162], [98, -170], [96, -156], [90, -138], [82, -122], [72, -106],
      [64, -94], [60, -80], [58, -62], [58, -50], [57, -26], [59, -14], [62, -6], [66, 0, 1], [52, 0, 1], [52, -6], [50, -14], [50, -28], [50, -50], [48, -70], [44, -88],
      [20, -96], [-10, -93], [-40, -97],
      [-56, -102], [-62, -82], [-70, -60], [-68, -32], [-66, -16], [-62, -6], [-59, 0, 1], [-74, 0, 1], [-74, -8], [-77, -16], [-78, -34], [-82, -58], [-87, -82], [-96, -110], [-102, -132]];
    let f = "";
    /* schwarze Beine (Braune haben schwarzes „Abzeichen“ an den Beinen) */
    f += `<rect x="40" y="-48" width="30" height="50" fill="${SCHW}"/><rect x="-86" y="-40" width="34" height="42" fill="${SCHW}"/>`;
    f += `<path d="M-90 -40 L-52 -46" stroke="${SCHW}" stroke-width="10" opacity=".5"/>`;
    /* Muskeln: Schulter, Hinterhand, Rippen */
    f += `<ellipse cx="-62" cy="-128" rx="34" ry="26" fill="${rg("muskel", [[0, "#c27a40", 0.55], [1, "#c27a40", 0]])}"/>`;
    f += `<ellipse cx="44" cy="-124" rx="22" ry="28" fill="${rg("muskel", [[0, "#c27a40", 0.55], [1, "#c27a40", 0]])}"/>`;
    f += `<path d="M30 -152 q-10 24 0 52 M-36 -140 q-12 22 -4 46 M-82 -100 q8 -30 -6 -50" stroke="#2d1508" stroke-opacity=".28" stroke-width="2" fill="none"/>`;
    f += `<path d="M90 -176 q12 22 2 46" stroke="#2d1508" stroke-opacity=".25" stroke-width="3" fill="none"/>`;
    /* Kopf: Ganasche (Backe), Blesse, Maul dunkler */
    f += `<path d="M106 -184 q-14 8 -6 24 q12 6 20 -4" stroke="#2d1508" stroke-opacity=".35" stroke-width="1.6" fill="none"/>`;
    f += form([[108, -216], [114, -208], [127, -180], [136, -158], [132, -156], [121, -180], [108, -206]], "#f1ebe2");
    f += `<ellipse cx="136" cy="-150" rx="8" ry="7" fill="#2a1a12" opacity=".55"/>`;
    f += striche(40, -90, -150, 60, -100, 4, 1, "#b06a35", 0.7, 0.35);
    s += koerper(K, FELL, f, { rw: 1.2 });
    /* Mähne und Schopf */
    s += form([[99, -224], [88, -216], [76, -206], [60, -192], [46, -176], [36, -166], [42, -178], [54, -192], [68, -206], [82, -218], [94, -227]], SCHW);
    s += linie([[88, -218], [82, -204]], "#3d2a1e", 1.6) + linie([[72, -206], [64, -194]], "#3d2a1e", 1.6) + linie([[58, -194], [50, -180]], "#3d2a1e", 1.6);
    s += form([[101, -223], [110, -219], [114, -208], [108, -210]], SCHW);
    /* Ohren */
    s += form([[96, -221], [94, -235], [96, -241, 1], [101, -231], [102, -221]], "#6a3417") + form([[102, -221], [103, -234], [106, -239, 1], [108, -227], [106, -219]], "#7a3d1a");
    s += auge(112, -197, 3.2, "#2a170c");
    s += `<path d="M108 -201 q5 -3 9 0" stroke="#000" stroke-width=".8" fill="none"/>`;
    s += `<path d="M135 -158 q3 -2 4 2 q-2 2 -4 0" fill="#000" opacity=".75"/>`;
    s += `<path d="M130 -146 q5 1 9 -1" stroke="#000" stroke-width=".8" fill="none" opacity=".5"/>`;
    /* Hufe */
    s += `<path d="M52 0 L53 -6 L64 -6 L66 0 Z M-74 0 L-73 -6 L-61 -6 L-59 0 Z" fill="#3b332c"/>`;
    return fertig(s, k, dir, 250);
  }

  /* =================== DAS SCHWEIN (Deutsche Landrasse) =================== */
  function schwein(k, dir = 1, o = {}) {
    const HAUT = lg("schw", [[0, "#f6d2c4"], [0.6, "#eab3a2"], [1, "#cf8e7e"]]);
    let s = "";
    s += form([[34, -26], [35, -8], [37, -2], [38, 0, 1], [30, 0, 1], [30, -6], [28, -24]], "#d79a8a") + klaue(34, 7, 3.5, "#6d5148");
    s += form([[-38, -30], [-40, -14], [-38, -4], [-36, 0, 1], [-44, 0, 1], [-46, -10], [-50, -28]], "#d0907f") + klaue(-40, 7, 3.5, "#6d5148");
    const K = [[-62, -58], [-44, -70], [-10, -74], [24, -72], [44, -66], [56, -60], [66, -50], [76, -44], [83, -42], [84, -36], [80, -32], [72, -33], [62, -32], [50, -28], [42, -22],
      [41, -10], [42, -3], [43, 0, 1], [34, 0, 1], [34, -4], [33, -12], [32, -20], [10, -22], [-24, -22], [-36, -26],
      [-44, -14], [-44, -4], [-43, 0, 1], [-52, 0, 1], [-52, -5], [-54, -14], [-60, -28], [-66, -44]];
    let f = striche(60, -60, -72, 60, -26, 2.2, -0.6, "#f8e4da", 0.35, 0.8);
    f += `<path d="M-48 -60 q-10 18 -4 34 M24 -66 q-6 22 2 40" stroke="#b56a5a" stroke-opacity=".25" stroke-width="2" fill="none"/>`;
    if (o.dreck !== false) f += `<path d="M-60 -6 q20 -10 46 -4 q30 -8 60 2 L90 4 L-60 4 Z" fill="#6b4a2c" opacity=".55"/><ellipse cx="-30" cy="-36" rx="8" ry="4" fill="#7a5634" opacity=".35"/>`;
    f += klaue(38.5, 9, 3.5, "#6d5148") + klaue(-47.5, 9, 3.5, "#6d5148");
    s += koerper(K, HAUT, f, { rand: "#8a4c40", randA: 0.4, rw: 0.8 });
    /* Rüsselscheibe */
    s += `<ellipse cx="83" cy="-38.5" rx="2.6" ry="4.6" fill="#e59c8c" stroke="#a96357" stroke-width=".5"/><ellipse cx="83.4" cy="-40.5" rx=".7" ry="1" fill="#6b3a32"/><ellipse cx="83.4" cy="-36.5" rx=".7" ry="1" fill="#6b3a32"/>`;
    s += `<path d="M70 -34 q5 2 10 0" stroke="#8a4c40" stroke-width=".6" fill="none"/>`;
    s += auge(62, -51, 1.5, "#3a2a20");
    /* Schlappohr über dem Auge */
    s += form([[46, -66], [54, -68], [62, -62], [70, -52], [72, -46], [66, -46], [58, -50], [50, -56]], lg("ohr", [[0, "#f2c0b0"], [1, "#d58f80"]]));
    s += `<path d="M52 -64 q10 4 16 14" stroke="#b56a5a" stroke-width=".6" fill="none" opacity=".6"/>`;
    /* Ringelschwanz */
    s += `<path d="M-62 -58 q-6 -2 -6 -7 q1 -4 4 -2 q2 3 -2 4 q-4 0 -4 -5" stroke="#dd9c8c" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
    return fertig(s, k, dir, 140);
  }

  /* =================== DAS SCHAF (Schwarzkopf) =================== */
  function schaf(k, dir = 1) {
    const WOLLE = rg("wolle", [[0, "#f6f1e4"], [0.7, "#e3d9c3"], [1, "#c4b79c"]], 0.45, 0.35, 0.7);
    const SCHW = "#1e1a19";
    let s = "";
    s += `<path d="M24 -40 L27 -24 L26 -4 L28 0 L22 0 L21 -4 L21 -24 L18 -40 Z M-32 -42 L-34 -24 L-38 -14 L-36 -4 L-34 0 L-40 0 L-41 -4 L-43 -14 L-41 -26 L-40 -42 Z" fill="#2a2524"/>`;
    s += `<path d="M36 -40 L38 -24 L37 -4 L39 0 L33 0 L32 -4 L32 -24 L29 -40 Z M-20 -42 L-22 -24 L-26 -14 L-24 -4 L-22 0 L-28 0 L-29 -4 L-31 -14 L-29 -26 L-28 -42 Z" fill="${SCHW}"/>`;
    /* Wollkörper mit welligem Rand */
    const pts = [];
    const N = 26;
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2, rx = 52, ry = 26, w = (i % 2 ? 1 : 0.94);
      pts.push([r(-6 + Math.cos(a) * rx * w), r(-62 + Math.sin(a) * ry * w)]);
    }
    let f = "";
    for (let i = 0; i < 46; i++) { const x = -54 + rnd() * 100, y = -86 + rnd() * 48; f += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(3 + rnd() * 3)}" fill="none" stroke="#b3a68a" stroke-width=".6" opacity=".45"/>`; }
    s += koerper(pts, WOLLE, f, { rand: "#8f8268", randA: 0.5, rw: 0.8 });
    /* Kopf (schwarz, Ramsnase), Ohr */
    s += form([[36, -78], [44, -86], [52, -86], [58, -80], [64, -70], [68, -60], [67, -55], [62, -53], [56, -55], [50, -60], [42, -62], [34, -64]], lg("schafk", [[0, "#3a3330"], [1, "#151211"]]));
    s += form([[40, -84], [46, -88], [50, -86], [48, -82], [43, -80]], WOLLE);
    s += form([[46, -78], [40, -76], [32, -72], [30, -69], [36, -69], [46, -73]], "#2c2625");
    s += `<path d="M44 -76 q-6 2 -12 5" stroke="#5a4c46" stroke-width=".6" fill="none"/>`;
    s += auge(54, -75, 1.6, "#8a7230", { pupille: true, flach: 0.8 });
    s += `<path d="M64.5 -59 q1.6 -.4 2 1.2" stroke="#000" stroke-width=".9" fill="none"/><path d="M62 -54.5 q3 .6 5 -.6" stroke="#000" stroke-width=".5" fill="none" opacity=".6"/>`;
    return fertig(s, k, dir, 125);
  }

  /* =================== HUHN und HAHN =================== */
  function huhn(k, dir = 1, o = {}) {
    const F = lg("huhn", [[0, "#b8642c"], [0.6, "#94461d"], [1, "#6e3112"]]);
    let s = "";
    /* Beine (gelb) mit Zehen */
    const bein = (x, dx) => `<path d="M${x} -13 L${x + dx} -1.2" stroke="#d9a63a" stroke-width="1.5" stroke-linecap="round"/><path d="M${x + dx - 3.5} 0 L${x + dx + 4} 0 M${x + dx} -.4 l-2 .4" stroke="#c8932c" stroke-width="1" stroke-linecap="round"/>`;
    s += bein(-1, 0) + bein(3.5, 1.5);
    const K = [[21.5, -35], [17, -39], [13, -41], [8.5, -38.5], [6, -33], [0, -28], [-8, -27], [-14, -32], [-19, -34], [-21, -30], [-20, -23], [-15, -16], [-6, -11], [4, -12], [11, -17], [14, -24], [16, -29], [18, -32]];
    let f = "";
    /* Hals heller, Schwanz dunkel mit hellen Säumen, Flügel */
    f += form([[8, -42], [20, -40], [18, -28], [10, -24], [4, -30]], "#c97a3c", ` opacity=".7"`);
    f += form([[-22, -38], [-12, -30], [-16, -20], [-24, -24]], "#5a2810");
    f += `<path d="M-4 -26 Q8 -26 10 -18 Q2 -12 -10 -16 Q-12 -22 -4 -26 Z" fill="#7a3614" opacity=".65"/>`;
    f += `<path d="M-8 -22 q6 2 14 0 M-9 -19 q6 2 14 0 M-6 -25 q6 1 11 0" stroke="#d48a4c" stroke-width=".55" fill="none" opacity=".8"/>`;
    f += striche(30, -18, -30, 16, -12, 1.4, 0.6, "#e0a060", 0.4, 0.5);
    s += koerper(K, F, f, { rand: "#3a1a08", randA: 0.4, rw: 0.5 });
    /* Kamm, Kehllappen, Schnabel, Auge */
    s += form([[9, -40], [10, -43], [12, -42], [13, -44.5], [15, -42.5], [17, -43], [17.5, -40], [13, -39.5]], "#d42a22");
    s += form([[18, -33], [20, -31], [19, -28], [17, -29], [17, -32]], "#c8231c");
    s += `<path d="M20.5 -37 L24.5 -35.2 L20.6 -33.8 Z" fill="#e2b34a" stroke="#9c7420" stroke-width=".3"/>`;
    s += auge(16.5, -37, 0.95, "#d98c1c", { pupille: true });
    return fertig(s, k, dir, 42);
  }
  function hahn(k, dir = 1) {
    let s = "";
    const bein = (x, dx) => `<path d="M${x} -18 L${x + dx} -1.5" stroke="#d9a63a" stroke-width="2" stroke-linecap="round"/><path d="M${x + dx - 4.5} 0 L${x + dx + 5} 0 M${x + dx - 1} -3.5 l-2 -.6" stroke="#c8932c" stroke-width="1.2" stroke-linecap="round"/>`;
    s += bein(-2, -1) + bein(4, 1.5);
    /* Sichelfedern (schwarz-grün schillernd) hinter dem Körper */
    const SICH = lg("sichel", [[0, "#1d3a2c"], [0.5, "#0e1a16"], [1, "#24412f"]], 0, 0, 1, 0);
    s += `<path d="M-14 -34 C-22 -62 -44 -60 -42 -34 C-40 -24 -34 -18 -30 -16 C-36 -30 -34 -46 -26 -44 C-22 -42 -18 -38 -16 -30 Z" fill="${SICH}"/>`;
    s += `<path d="M-14 -30 C-26 -52 -46 -46 -40 -22 C-38 -16 -34 -12 -32 -10 C-38 -24 -34 -36 -26 -34 Z" fill="#14261d"/>`;
    s += `<path d="M-30 -52 q-10 2 -10 20 M-24 -46 q-10 4 -8 24" stroke="#4f8a6a" stroke-width=".7" fill="none" opacity=".7"/>`;
    const K = [[27, -48], [22, -53], [17, -55], [12, -51], [10, -44], [6, -36], [-2, -33], [-12, -34], [-17, -30], [-18, -24], [-14, -19], [-6, -16], [4, -17], [12, -22], [16, -30], [19, -38], [22, -43]];
    let f = "";
    f += `<rect x="-20" y="-60" width="50" height="50" fill="#b23a14"/>`;
    f += `<path d="M-18 -26 Q0 -12 18 -26 L22 -12 L-20 -12 Z" fill="#141414"/>`;
    f += form([[6, -58], [26, -52], [20, -36], [10, -30], [-2, -32], [2, -44]], lg("behang", [[0, "#f0b245"], [1, "#d37a22"]]));
    f += `<path d="M-14 -32 q8 -4 14 -2" stroke="#e8a63c" stroke-width="3" fill="none" opacity=".8"/>`;
    f += `<path d="M-6 -30 Q8 -30 10 -22 Q2 -18 -10 -22 Z" fill="#202a3a" opacity=".85"/>`;
    f += striche(26, 4, -54, 20, -32, -1, 3, "#ffd27a", 0.5, 0.6);
    s += koerper(K, "#b23a14", f, { rand: "#2a1206", randA: 0.4, rw: 0.6 });
    s += form([[11, -54], [11, -58], [13, -57], [14, -61], [16, -58], [18, -61.5], [19, -57.5], [21.5, -59], [21.5, -55], [24, -54], [20, -52], [14, -52]], "#d8241c");
    s += form([[23, -45], [26, -42], [25, -36], [22, -36], [21, -42]], "#cc201a");
    s += `<path d="M26 -50 L31 -48 L26.2 -46.4 Z" fill="#e2b34a" stroke="#9c7420" stroke-width=".3"/>`;
    s += auge(21.5, -50, 1.1, "#d98c1c", { pupille: true });
    return fertig(s, k, dir, 50);
  }
  function kueken(k, dir = 1) {
    let s = `<path d="M-1 -3 L-1.4 0 M1.2 -3 L1.6 0" stroke="#e0a23a" stroke-width=".6"/>`;
    s += koerper([[4.5, -7.5], [2.5, -9.5], [0, -9], [-1.5, -7], [-4.5, -6.5], [-5, -3.5], [-2.5, -2.4], [2, -2.6], [4, -4.5]], rg("kueken", [[0, "#fff3a8"], [1, "#e9c040"]], 0.6, 0.3, 0.7), striche(14, -5, -9, 4, -3, 0.6, 0.3, "#fff7c4", 0.3, 0.8), { rand: "#a07a10", randA: 0.4, rw: 0.25 });
    s += `<path d="M4.4 -7.8 L6 -7.2 L4.4 -6.6 Z" fill="#e48a1c"/>` + `<circle cx="3" cy="-7.8" r=".45" fill="#1a1208"/>`;
    return fertig(s, k, dir, 10);
  }

  /* =================== DER HUND =================== */
  /* art: "schaefer" (schwarz-loh, Stehohren), "labrador" (gelb), "mischling" (braun-weiß), "dackel"
     pose: "stehen" | "sitzen" | "liegen" */
  function hund(k, dir = 1, o = {}) {
    const art = o.art || "schaefer", pose = o.pose || "stehen";
    const FARBE = { schaefer: ["#b9773a", "#8a5222"], labrador: ["#e2bf82", "#c49a5a"], mischling: ["#7a4c2c", "#55331d"], schwarz: ["#2b2624", "#191514"], dackel: ["#9a5326", "#6e3612"], beagle: ["#c08443", "#8d5a28"] }[art];
    const F = lg("hund_" + art, [[0, FARBE[0]], [1, FARBE[1]]]);
    const dk = art === "dackel" ? 0.55 : 1; /* Beinlänge */
    let s = "";
    if (pose === "stehen") {
      const by = (y) => (y > -36 ? y * dk : y - 36 * (dk - 1)); /* Beine kürzen, Körper absenken */
      const B2 = (pts) => pts.map(([x, y, e]) => (e ? [x, by(y), e] : [x, by(y)]));
      s += form(B2([[28, -36], [28, -10], [30, -2], [31, 0, 1], [24, 0, 1], [23, -5], [22, -30]]), FARBE[1]);
      s += form(B2([[-30, -40], [-34, -26], [-40, -14], [-38, -4], [-35, 0, 1], [-42, 0, 1], [-45, -8], [-46, -16], [-46, -38]]), FARBE[1]);
      /* Rute */
      const rute = art === "schaefer" ? [[-46, -56], [-54, -46], [-56, -30], [-52, -20]] : art === "labrador" ? [[-46, -56], [-56, -50], [-62, -44]] : [[-46, -56], [-56, -62], [-60, -72]];
      s += `<path d="${glatt(B2(rute), false)}" stroke="${art === "schaefer" ? "#3a2a1e" : FARBE[1]}" stroke-width="${art === "schaefer" ? 8 : 4.5}" fill="none" stroke-linecap="round"/>`;
      const K = B2([[-46, -58], [-30, -60], [0, -61], [22, -64], [32, -70], [40, -78], [44, -82], [52, -84], [58, -80], [70, -76], [76, -74], [77, -70], [72, -66], [62, -66], [54, -66], [46, -62], [38, -54], [34, -44],
        [33, -34], [33, -10], [35, -3], [37, 0, 1], [27, 0, 1], [26, -5], [25, -12], [24, -28], [20, -34], [4, -35], [-14, -39],
        [-24, -42], [-31, -30], [-37, -18], [-35, -6], [-31, 0, 1], [-41, 0, 1], [-43, -6], [-45, -16], [-49, -30], [-51, -46]]);
      let f = "";
      if (art === "schaefer") {
        f += form(B2([[-60, -66], [30, -70], [36, -58], [20, -44], [-10, -46], [-40, -48], [-58, -46]]), "#24201d");
        f += form([[60, -88], [80, -76], [76, -62], [58, -64]], "#1e1a18");
        f += form([[40, -90], [54, -88], [52, -76], [42, -70]], "#3a2c22", ` opacity=".6"`);
      }
      if (art === "mischling") f += form(B2([[24, -60], [44, -62], [56, -64], [70, -64], [62, -52], [40, -40], [32, -12], [24, -14], [26, -40]]), "#f1ebe1");
      if (art === "beagle") { f += form(B2([[-40, -66], [20, -66], [16, -50], [-30, -48]]), "#2a2420"); f += form(B2([[60, -82], [66, -80], [78, -74], [74, -64], [60, -64]]), "#f1ebe1") + form(B2([[-60, -40], [40, -40], [40, 4], [-60, 4]]), "#f1ebe1"); }
      f += striche(40, -46, -64, 34, -38, 2.4, 0.8, "#000", 0.4, 0.2);
      f += `<path d="M24 -60 q-6 14 2 22 M-30 -58 q-8 14 -2 30" stroke="#000" stroke-opacity=".15" stroke-width="1.6" fill="none"/>`;
      s += koerper(K, F, f, { rw: 0.6 });
      /* Kopfdetails */
      const hy = by(-80) + 80;
      if (art === "schaefer") s += form([[47, -82 + hy], [46.5, -93 + hy], [49, -97 + hy, 1], [54, -89 + hy], [55, -83 + hy]], "#2a2420");
      else s += form([[48, -84], [56, -86], [58, -76], [54, -64], [48, -66], [46, -76]].map(([x, y]) => [x, by(y)]), FARBE[1]);
      s += auge(62, by(-79), 1.6, "#3a2410");
      s += `<ellipse cx="76.5" cy="${r(by(-73.5))}" rx="2" ry="1.6" fill="#111"/>`;
      s += `<path d="M70 ${r(by(-67))} q-6 2 -12 0" stroke="#2a1a10" stroke-width=".6" fill="none"/>`;
      return fertig(s, k, dir, 110);
    }
    if (pose === "sitzen") {
      s += form([[-18, -24], [-26, -26], [-34, -18], [-36, -6], [-30, 0, 1], [-14, 0, 1], [-10, -8]], FARBE[1]);
      const K = [[-24, -20], [-20, -40], [-6, -56], [8, -66], [14, -74], [20, -78], [28, -76], [38, -70], [42, -68], [43, -64], [38, -61], [30, -61], [24, -58], [20, -48],
        [20, -30], [20, -8], [22, -2], [24, 0, 1], [14, 0, 1], [14, -6], [12, -24], [6, -26], [0, -12], [2, -4], [6, 0, 1], [-22, 0, 1], [-30, -6]];
      let f = "";
      if (art === "schaefer") { f += form([[-30, -30], [-6, -58], [6, -60], [0, -36], [-20, -18]], "#24201d"); f += form([[30, -80], [46, -68], [40, -56], [28, -60]], "#1e1a18"); }
      if (art === "mischling") f += form([[16, -60], [26, -62], [40, -60], [34, -50], [24, -40], [22, 2], [12, 2], [14, -40]], "#f1ebe1");
      if (art === "beagle") { f += form([[-30, -34], [-6, -52], [0, -40], [-20, -20]], "#2a2420"); f += form([[22, -56], [40, -64], [44, -58], [26, -48], [22, 2], [12, 2], [14, -40]], "#f1ebe1"); }
      f += striche(30, -28, -66, 24, -4, 1, 2.4, "#000", 0.4, 0.2);
      s += koerper(K, F, f, { rw: 0.6 });
      s += `<path d="M-30 -2 q-10 0 -12 -6" stroke="${art === "schaefer" ? "#3a2a1e" : FARBE[1]}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
      if (art === "schaefer") s += form([[16, -76], [14, -92], [16, -96, 1], [22, -86], [23, -78]], "#2a2420");
      else s += form([[16, -78], [24, -80], [26, -70], [22, -58], [16, -60], [14, -70]], FARBE[1]);
      s += auge(30, -72, 1.5, "#3a2410");
      s += `<ellipse cx="42.4" cy="-66" rx="1.8" ry="1.5" fill="#111"/>`;
      return fertig(s, k, dir, 70);
    }
    /* liegen */
    const K = [[-50, -18], [-36, -26], [-10, -28], [12, -30], [22, -34], [30, -40], [38, -42], [48, -38], [56, -34], [57, -30], [52, -27], [44, -27], [40, -22], [42, -14], [60, -10], [64, -6], [62, -1], [44, 0], [24, 0], [-40, 0], [-52, -6]];
    let f = "";
    if (art === "schaefer") { f += form([[-56, -24], [20, -36], [24, -24], [-50, -14]], "#24201d"); f += form([[40, -46], [60, -32], [52, -24], [40, -28]], "#1e1a18"); }
    if (art === "mischling") f += form([[30, -28], [44, -28], [42, -14], [64, -8], [64, 2], [40, 2], [32, -16]], "#f1ebe1");
    f += striche(30, -48, -28, 30, -4, 2.4, 0.4, "#000", 0.4, 0.2);
    s += koerper(K, F, f, { rw: 0.6 });
    s += `<path d="M-50 -4 q-10 2 -16 -2" stroke="${FARBE[1]}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    if (art === "schaefer") s += form([[28, -40], [26, -54], [28, -58, 1], [34, -48], [35, -40]], "#2a2420");
    else s += form([[28, -42], [36, -44], [38, -34], [34, -24], [28, -26], [26, -34]], FARBE[1]);
    s += auge(44, -36, 1.4, "#3a2410");
    s += `<ellipse cx="56" cy="-31" rx="1.8" ry="1.4" fill="#111"/>`;
    return fertig(s, k, dir, 115);
  }

  /* =================== DIE KATZE (Hauskatze) =================== */
  /* art: "tabby" (braun getigert), "rot", "schwarzweiss", "grau", "schildpatt"; pose: "sitzen" | "liegen" | "stehen" */
  function katze(k, dir = 1, o = {}) {
    const art = o.art || "tabby", pose = o.pose || "sitzen";
    const FB = { tabby: ["#9c8466", "#6e5a44", "#3e3022"], rot: ["#e0a060", "#c27a3a", "#9a5520"], schwarzweiss: ["#2a2626", "#181516", null], grau: ["#9aa0a6", "#767c84", "#4e545c"], schildpatt: ["#3a2c24", "#2a201a", null] }[art];
    const F = lg("katze_" + art, [[0, FB[0]], [1, FB[1]]]);
    const streifen = (pts) => FB[2] ? pts.map((p) => linie(p, FB[2], 1.6, ` opacity=".75"`)).join("") : "";
    let s = "", f = "";
    if (pose === "sitzen") {
      /* Schwanz um die Pfoten gelegt */
      s += `<path d="M-13 -2 Q-6 2 6 0.6 Q12 0 14 -1.6" stroke="${FB[1]}" stroke-width="3.2" fill="none" stroke-linecap="round"/>`;
      const K = [[12, -17], [11, -9], [13, -2], [15, -0.6], [14, 0, 1], [6, 0, 1], [-4, 0], [-11, -1], [-15, -5], [-16, -11], [-14, -18], [-8, -24], [-1, -27], [4, -28.5], [5.5, -33.5], [7, -37.5, 1], [10.5, -33], [14, -32.5], [16, -36, 1], [17.5, -31], [19.5, -27.5], [21, -25], [20, -23.5], [18, -22.5], [14.5, -21]];
      f += streifen([[[-14, -14], [-8, -16]], [[-14, -9], [-6, -10]], [[-13, -4], [-6, -6]], [[-10, -22], [-6, -18]], [[-4, -25], [-2, -20]], [[4, -26], [6, -22]], [[10, -31], [11, -28]], [[13, -31], [13, -28]], [[11, -8], [14, -8]], [[11, -4], [14, -4]]]);
      if (art === "schwarzweiss") f += form([[10, -22], [18, -22], [20, -24], [16, -18], [14, -2], [15, 1], [6, 1], [10, -10]], "#f1eee8");
      if (art === "schildpatt") f += form([[-16, -16], [-6, -26], [0, -18], [-10, -6]], "#c2782e") + form([[8, -30], [14, -34], [16, -26], [10, -24]], "#d79a4a");
      f += striche(30, -15, -27, 15, -2, 0.4, 1.6, "#000", 0.3, 0.2);
      f += `<path d="M9 -15 Q8.4 -8 8.6 -1 M-2 -13 Q-12 -12 -12 -2" stroke="#000" stroke-opacity=".28" stroke-width=".5" fill="none"/>`;
      s += koerper(K, F, f, { rw: 0.35 });
      s += `<path d="M14.6 -32.6 L15.6 -34.8 L16.4 -32" fill="#d79a92" opacity=".7"/>`;
      s += auge(17.2, -28.4, 1.15, art === "schwarzweiss" ? "#9ab53a" : "#b9a12a", { pupille: true, schlitz: true, flach: 0.8 });
      s += `<path d="M20.2 -25.6 l.9 .4 l-.8 .5 Z" fill="#c98a86"/>`;
      s += `<path d="M19 -24.4 l7 -1.4 M19 -24 l7 .2 M19 -23.6 l6.4 1.4" stroke="#fff" stroke-width=".15" opacity=".8"/>`;
      return fertig(s, k, dir, 30);
    }
    if (pose === "liegen") {
      s += `<path d="M-22 -2 Q-30 -2 -30 -8 Q-28 -12 -24 -10" stroke="${FB[1]}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
      const K = [[-22, -2], [-24, -8], [-20, -14], [-8, -16], [4, -15], [10, -16], [12, -20], [13, -24.5, 1], [15.5, -21], [19, -21], [21, -24.5, 1], [22, -19.5], [24, -16], [25, -14], [23, -12.5], [20, -11], [19, -6], [24, -3], [26, -1], [24, 0], [8, 0], [-14, 0]];
      f += streifen([[[-18, -12], [-14, -6]], [[-12, -14], [-9, -7]], [[-6, -15], [-4, -8]], [[0, -15], [1, -9]], [[14, -21], [15, -18]]]);
      if (art === "schwarzweiss") f += form([[16, -12], [24, -14], [22, -10], [26, -1], [10, 1], [16, -6]], "#f1eee8");
      f += striche(26, -22, -16, 20, -1, 1.6, 0.3, "#000", 0.3, 0.2);
      s += koerper(K, F, f, { rw: 0.35 });
      s += auge(21, -16.6, 0.95, "#b9a12a", { pupille: true, schlitz: true, flach: 0.7 });
      s += `<path d="M24.2 -14.2 l.8 .4 l-.7 .4 Z" fill="#c98a86"/>`;
      return fertig(s, k, dir, 52);
    }
    /* stehen / gehen */
    s += `<path d="M10 -14 L11 -1 M-14 -14 L-17 -1" stroke="${FB[1]}" stroke-width="3" stroke-linecap="round"/>`;
    s += `<path d="M-20 -20 Q-30 -22 -32 -34 Q-32 -40 -28 -42" stroke="${FB[1]}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    const K = [[-21, -20], [-10, -23], [6, -22], [14, -24], [18, -29], [19, -33.5, 1], [21.5, -30], [25, -30], [27.5, -33.5, 1], [28, -28], [30, -25], [31, -23.5], [29, -22], [25, -20], [19, -16], [16, -12], [15, -2], [16, 0, 1], [12, 0, 1], [12, -4], [10, -13], [-12, -13], [-14, -2], [-12, 0, 1], [-17, 0, 1], [-18, -4], [-20, -12]];
    f += streifen([[[-16, -21], [-14, -15]], [[-10, -22], [-8, -15]], [[-4, -22], [-3, -15]], [[2, -22], [3, -15]], [[20, -30], [21, -27]]]);
    if (art === "schwarzweiss") f += form([[22, -20], [30, -22], [24, -16], [18, -12], [14, -14]], "#f1eee8");
    f += striche(26, -20, -24, 28, -12, 1.6, 0.3, "#000", 0.3, 0.2);
    s += koerper(K, F, f, { rw: 0.35 });
    s += auge(26.8, -26.4, 1, "#b9a12a", { pupille: true, schlitz: true, flach: 0.75 });
    return fertig(s, k, dir, 52);
  }

  /* =================== DIE ENTE =================== */
  /* art: "peking" (weiß, Hofente), "erpel" (Stockente ♂), "weibchen" (Stockente ♀); schwimmt: Unterkante = Wasserlinie */
  function ente(k, dir = 1, o = {}) {
    const art = o.art || "peking", schwimmt = !!o.schwimmt;
    const FB = { peking: ["#fbf8ef", "#ddd6c4"], erpel: ["#a8a49c", "#7d786e"], weibchen: ["#a07a50", "#6e5030"] }[art];
    let s = "";
    if (!schwimmt) s += `<path d="M-2 -10 L-2 -1.5 M3 -10 L3.5 -1.5" stroke="#e8902a" stroke-width="1.4"/><path d="M-6 0 L1 0 M0 0 L7 0" stroke="#e07f1c" stroke-width="1.6" stroke-linecap="round"/>`;
    const y0 = schwimmt ? 8 : 0;
    const K = [[18, -32], [15, -34.5], [11, -33.5], [9, -29], [9.5, -25], [8, -22], [0, -22], [-10, -21], [-16, -22], [-20, -24], [-19, -19], [-16, -14], [-8, -10], [4, -10], [12, -14], [14, -20], [14, -24], [15, -27]].map(([x, y]) => [x, y + y0]);
    let f = "";
    if (art === "erpel") {
      f += form([[6, -38], [20, -36], [18, -24], [8, -23]].map(([x, y]) => [x, y + y0]), lg("erpelkopf", [[0, "#2f7a4a"], [0.5, "#1b5a3a"], [1, "#2e6b6a"]]));
      f += `<path d="M7.5 ${-24 + y0} q4 1.5 7.5 0" stroke="#fff" stroke-width="1" fill="none"/>`;
      f += form([[4, -24], [14, -24], [12, -12], [2, -12]].map(([x, y]) => [x, y + y0]), "#7a4030");
      f += form([[-22, -28], [-14, -22], [-16, -16], [-22, -18]].map(([x, y]) => [x, y + y0]), "#1a1a1a");
      f += `<path d="M-6 ${-19 + y0} l8 0" stroke="#3d5fb0" stroke-width="2"/>`;
    }
    if (art === "weibchen") { f += striche(60, -20, -38 + y0, 18, -10 + y0, 1.2, 0.5, "#3a2412", 0.7, 0.7); f += `<path d="M-6 ${-19 + y0} l8 0" stroke="#3d5fb0" stroke-width="1.6"/>`; f += `<path d="M9 ${-30 + y0} q5 -1 9 1" stroke="#3a2412" stroke-width=".8" fill="none"/>`; }
    f += `<path d="M-14 ${-20 + y0} Q-4 ${-24 + y0} 6 ${-20 + y0} Q2 ${-15 + y0} -10 ${-16 + y0} Z" fill="#000" opacity=".1"/>`;
    f += `<path d="M-14 ${-18 + y0} q8 1 16 -1 M-12 ${-16 + y0} q8 1 14 -1" stroke="#000" stroke-opacity=".18" stroke-width=".5" fill="none"/>`;
    s += koerper(K, lg("ente_" + art, [[0, FB[0]], [1, FB[1]]]), f, { rw: 0.35 });
    const schn = art === "erpel" ? "#d8c23a" : art === "weibchen" ? "#c47a2a" : "#f0a030";
    s += `<path d="M17 ${-32.4 + y0} Q22 ${-32 + y0} 25 ${-29.6 + y0} Q24 ${-28.4 + y0} 17.6 ${-29 + y0} Z" fill="${schn}" stroke="#8a5a14" stroke-width=".3"/>`;
    s += auge(14, -31.4 + y0, 0.8, "#1a120a");
    if (schwimmt) return `<g transform="scale(${r4(dir * k)} ${r4(k)})">${s}</g>`;
    return fertig(s, k, dir, 38);
  }

  return { glatt, koerper, form, linie, striche, auge, fertig, klaue, lg, rg, rnd, kuh, kalb, pferd, schwein, schaf, huhn, hahn, kueken, hund, katze, ente };
}
module.exports = { tierKasten };

/* =====================================================================
   DIE SZENE
   ===================================================================== */
function baue() {
  const S = neueSzene({ id: "bauernhof", titel: "Der Bauernhof", emoji: "🐄", thema: "Natur", kuerzel: "bh", fassung: 852 });
  S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
  S.def(`<filter id="bh_wolke" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.4"/></filter>`);
  const T = tierKasten(S);
  const rnd = zufall(1952);
  /* ---------- Raum: Kamera 4 m hoch, Horizont y = 70 ---------- */
  const F = 320, HY = 70, E = 4;
  const P = (X, Y, Z) => [r(160 + X * F / Z), r(HY + (E - Y) * F / Z)];
  const Zb = (y) => F * E / (y - HY);
  const Xb = (x, Z) => (x - 160) * Z / F;
  const sk = (y) => (y - HY) / E;              // Einheiten je Meter am Boden bei y
  const poly = (pts, fill, extra = "") => `<path d="M${pts.map((q) => q.join(" ")).join("L")}Z" fill="${fill}"${extra}/>`;
  const um = (x, y, svg) => `<g transform="translate(${r(-x)} ${r(-y)})">${svg}</g>`;
  function kiste(X0, X1, Y0, Y1, Z0, Z1, f) {
    let g = "";
    if (f.s && X0 > 0) g += poly([P(X0, Y0, Z0), P(X0, Y0, Z1), P(X0, Y1, Z1), P(X0, Y1, Z0)], f.s);
    if (f.s && X1 < 0) g += poly([P(X1, Y0, Z0), P(X1, Y0, Z1), P(X1, Y1, Z1), P(X1, Y1, Z0)], f.s);
    if (f.o && Y1 < E) g += poly([P(X0, Y1, Z0), P(X1, Y1, Z0), P(X1, Y1, Z1), P(X0, Y1, Z1)], f.o);
    if (f.v) g += poly([P(X0, Y0, Z0), P(X1, Y0, Z0), P(X1, Y1, Z0), P(X0, Y1, Z0)], f.v);
    return g;
  }
  const HOLZ = S.lg("holz", [[0, "#8a6440"], [1, "#6a4a2c"]]);
  const HOLZ_H = S.lg("holzh", [[0, "#b08a5c"], [1, "#8c6a44"]]);
  const HEU = S.lg("heu", [[0, "#e9cf7a"], [0.6, "#d4b25a"], [1, "#b8923c"]]);
  const HEU_S = S.lg("heus", [[0, "#c9a650"], [1, "#a7853a"]]);
  const ALU = S.lg("alu", [[0, "#9aa3aa"], [0.35, "#eef2f4"], [0.6, "#c4ccd2"], [1, "#8a939a"]], 0, 0, 1, 0);
  const heuStriche = (x0, y0, x1, y1, n) => T.striche(n, x0, y0, x1, y1, 2.2, 0.6, "#fff1b8", 0.35, 0.7) + T.striche(n / 2, x0, y0, x1, y1, -1.8, 0.8, "#8a6a2a", 0.3, 0.5);

  /* =====================================================================
     KULISSE: Himmel, Hügel mit Wald und Dorf, Weide, Hofplatz
     ===================================================================== */
  S.hinten(`<rect x="0" y="0" width="320" height="76" fill="${S.lg("himmel", [[0, "#7fb2e0"], [0.7, "#b9d8ef"], [1, "#e4f0f6"]])}"/>`);
  let w = "";
  for (const [x, y, a, b] of [[200, 22, 26, 6], [226, 18, 18, 7], [290, 30, 30, 6], [312, 26, 16, 6], [150, 12, 20, 4]]) w += `<ellipse cx="${x}" cy="${y}" rx="${a}" ry="${b}" fill="#fff" opacity=".85" filter="url(#bh_wolke)"/>`;
  S.hinten(w);
  /* ferne Hügel, Waldrand, Kirchturm */
  S.hinten(`<path d="M0 66 Q60 56 130 62 T260 58 T320 60 L320 76 L0 76 Z" fill="#8fae7a"/>`);
  let wald = "M196 70";
  for (let x = 196; x <= 322; x += 3) wald += `L${x} ${r(66 - rnd() * 4 - (x > 230 && x < 250 ? 2 : 0))}`;
  S.hinten(`<path d="${wald}L322 72 L196 72 Z" fill="#4f6b45"/><path d="${wald}L322 72 L196 72 Z" fill="${S.lg("dunst", [[0, "#cfe0e6", 0.45], [1, "#cfe0e6", 0]])}"/>`);
  S.hinten(`<g fill="#d9d2c4"><rect x="257" y="56" width="4" height="12"/><path d="M256.6 56 L259 47 L261.4 56 Z" fill="#5a6470"/><rect x="250" y="63" width="7" height="5"/><path d="M249.5 63.5 L253.5 60.5 L257.5 63.5 Z" fill="#a4553a"/><rect x="263" y="64" width="8" height="5"/><path d="M262.5 64.5 L267 61 L271.5 64.5 Z" fill="#9b4a32"/></g>`);
  /* Weide und Hofplatz */
  S.hinten(`<rect x="0" y="72" width="320" height="50" fill="${S.lg("weide", [[0, "#94b56a"], [1, "#6f9a48"]])}"/>`);
  S.hinten(T.striche(220, 200, 92, 320, 120, 0.3, -1.6, "#4f7a34", 0.4, 0.5) + T.striche(120, 200, 92, 320, 120, -0.3, -1.4, "#b8d68a", 0.35, 0.5));
  {
    let g = `<path d="M0 116 L320 117 L320 200 L0 200 Z" fill="${S.lg("hof", [[0, "#a49579"], [0.5, "#9a8a6c"], [1, "#8a7a5e"]])}"/>`;
    /* Kopfsteinpflaster vor den Gebäuden (Fluchtlinien zum Fluchtpunkt) */
    g += `<path d="M0 116 L218 117 L224 132 L0 134 Z" fill="${S.lg("pflaster", [[0, "#8f8a80"], [1, "#a39d92"]])}"/>`;
    let st = "";
    for (let y = 117.5; y < 133; y += 1.6) { const h = 0.7 + (y - 117) * 0.05; for (let x = 0; x < 222; x += 2.4 + (y - 117) * 0.12) st += `<rect x="${r(x + ((y * 7) % 2.4))}" y="${r(y)}" width="${r(1.8 + (y - 117) * 0.1)}" height="${r(h)}" rx=".4"/>`; }
    g += `<g fill="#b5afa4" opacity=".55">${st}</g>`;
    /* Fahrspuren des Traktors, Kies, Grasbüschel am Rand */
    g += `<path d="M40 136 Q120 150 200 200 L182 200 Q110 154 32 138 Z M66 134 Q150 146 250 200 L232 200 Q140 150 58 136 Z" fill="#7a6a50" opacity=".35"/>`;
    for (let i = 0; i < 260; i++) { const y = 134 + rnd() * 66, x = rnd() * 320, q = (y - 70) / 60; g += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(0.25 * q + rnd() * 0.3 * q)}" fill="${rnd() < 0.5 ? "#c4b69a" : "#6e604a"}" opacity=".6"/>`; }
    g += T.striche(60, 222, 122, 320, 140, 0.4, -2.4, "#5e8a3a", 0.6, 0.7) + T.striche(40, 296, 150, 320, 200, 0.4, -3, "#5e8a3a", 0.7, 0.7);
    /* Pfütze (Ente) und Suhle (Schwein) */
    g += `<ellipse cx="198" cy="193" rx="22" ry="4.4" fill="${S.lg("pfuetze", [[0, "#9fc3dc"], [1, "#6f8fa8"]])}"/><ellipse cx="192" cy="192" rx="10" ry="1.4" fill="#fff" opacity=".35"/>`;
    g += `<ellipse cx="114" cy="195" rx="30" ry="5" fill="#5e4428"/><ellipse cx="108" cy="194" rx="16" ry="2" fill="#7a5a36" opacity=".7"/>`;
    S.hinten(g);
  }

  /* =====================================================================
     DAS FELD (Weizen, in der Ferne)
     ===================================================================== */
  {
    let k = `<path d="M218 74 L320 72 L320 92 L218 95 Z" fill="${S.lg("weizen", [[0, "#e2c46a"], [1, "#c9a548"]])}"/>`;
    for (let i = 0; i < 10; i++) k += `<line x1="${r(224 + i * 9.5)}" y1="${r(74 - i * 0.2)}" x2="${r(220 + i * 10.6)}" y2="${r(95 - i * 0.3)}" stroke="#b08a34" stroke-width=".35" opacity=".7"/>`;
    k += `<path d="M218 74 L320 72 L320 74 L218 76 Z" fill="#f2dc90" opacity=".6"/>`;
    k += `<path d="M218 95 L320 92 L320 94 L218 97 Z" fill="#6f9a48"/>`;
    S.teil({ id: "feld", de: "das Feld", syl: "FELD", it: "il campo", itSyl: "CAM-po", en: "field", x: 269, y: 95, kunst: um(269, 95, k),
      tipp: "Auf dem Feld wächst Weizen. Im Sommer wird er geerntet." });
  }
  /* =====================================================================
     DER APFELBAUM (Streuobstwiese hinter dem Zaun)
     ===================================================================== */
  {
    const x = 306, y = 104;
    let k = `<path d="M-1.6 0 L-1.2 -14 L1.4 -14 L1.8 0 Z" fill="${HOLZ}"/>`;
    k += `<path d="M-1 -12 L-6 -20 M1 -12 L5 -22" stroke="#5a3d24" stroke-width="1.4"/>`;
    let kr = "";
    for (let i = 0; i < 22; i++) { const a = rnd() * Math.PI * 2, d = rnd() * 12; kr += `<circle cx="${r(Math.cos(a) * d * 1.2)}" cy="${r(-30 + Math.sin(a) * d * 0.8)}" r="${r(5 + rnd() * 3)}" fill="${rnd() < 0.5 ? "#4f7d36" : "#3d6a2c"}"/>`; }
    k += kr;
    k += `<ellipse cx="-4" cy="-36" rx="10" ry="6" fill="#8fbf5a" opacity=".45"/>`;
    for (let i = 0; i < 12; i++) k += `<circle cx="${r(-14 + rnd() * 28)}" cy="${r(-40 + rnd() * 20)}" r=".9" fill="#c8322a"/>`;
    S.teil({ id: "apfelbaum", de: "der Apfelbaum", syl: "AP-fel-baum", it: "il melo", itSyl: "ME-lo", en: "apple tree", x, y, steht: true, kunst: schatten(0, 0, 10, 1.2, 0.25) + k });
  }
  /* =====================================================================
     SCHAF und PFERD auf der Weide
     ===================================================================== */
  S.teil({ id: "schaf", de: "das Schaf", syl: "SCHAF", it: "la pecora", itSyl: "PE-co-ra", en: "sheep", x: 290, y: 111, kunst: T.schaf(sk(111) / 100, -1),
    tipp: "Ein Schwarzkopfschaf: weiße Wolle, schwarzer Kopf. Aus der Wolle macht man Garn." });
  S.teil({ id: "pferd", de: "das Pferd", syl: "PFERD", it: "il cavallo", itSyl: "ca-VAL-lo", en: "horse", x: 248, y: 113, kunst: T.pferd(sk(113) / 100, -1),
    tipp: "Ein Brauner: braunes Fell, schwarze Mähne und schwarze Beine." });
  /* =====================================================================
     DER ZAUN (Koppelzaun aus Holz)
     ===================================================================== */
  {
    const y = 118, s = sk(y);
    let k = "";
    for (const ry of [0.55, 1.05]) k += `<path d="M218 ${r(y - ry * s)} L322 ${r(y - ry * s)}" stroke="${HOLZ_H}" stroke-width="1.5"/><path d="M218 ${r(y - ry * s - 0.5)} L322 ${r(y - ry * s - 0.5)}" stroke="#d4b48a" stroke-width=".4"/>`;
    for (let x = 220; x <= 320; x += 16.5) k += `<rect x="${r(x - 0.9)}" y="${r(y - 1.35 * s)}" width="1.8" height="${r(1.35 * s)}" fill="${HOLZ}"/><ellipse cx="${r(x)}" cy="${r(y - 1.35 * s)}" rx=".9" ry=".4" fill="#b08a5c"/>`;
    S.teil({ id: "zaun", de: "der Zaun", syl: "ZAUN", it: "il recinto", itSyl: "re-CIN-to", en: "fence", x: 270, y, kunst: um(270, y, k) });
  }

  /* =====================================================================
     DIE SCHEUNE (Giebelseite mit Tor, Heuboden-Luke) — Lupe
     ===================================================================== */
  const SCH = { x: 49, y: 118 };
  {
    const brett = (x0, x1, yo, yu) => { let g = ""; for (let x = x0 + 1.6; x < x1; x += 3.2) g += `<rect x="${r(x - 0.5)}" y="${r(yo(x))}" width="1" height="${r(yu - yo(x))}" fill="#3e2416" opacity=".55"/>`; return g; };
    let k = "";
    /* Giebelwand: senkrechte Bretter (Boden-Deckel-Schalung), ochsenblutrot */
    const giebel = (x) => -58 - (49 - Math.abs(x)) / 49 * 46;
    k += `<path d="M-49 -10 L-49 -58 L0 -104 L49 -58 L49 -10 Z" fill="${S.lg("scheunewand", [[0, "#8a3a26"], [1, "#6e2c1c"]])}"/>`;
    k += brett(-49, 49, (x) => giebel(x) + 1, -10);
    k += `<path d="M-49 -10 L-49 -58 L0 -104 L49 -58 L49 -10 Z" fill="${S.lg("scheunelicht", [[0, "#fff", 0.1], [1, "#000", 0.15]], 0, 0, 1, 0)}"/>`;
    /* Dachkante mit Ziegeln und Windbrett */
    k += `<path d="M-55 -54 L0 -108 L55 -54 L52 -52 L0 -103 L-52 -52 Z" fill="#7c2f1c"/><path d="M-55 -54 L0 -108 L55 -54" stroke="#3c2416" stroke-width="1.6" fill="none"/>`;
    /* Sockel aus Bruchstein */
    k += `<rect x="-49" y="-10" width="98" height="10" fill="#8d877c"/>`;
    for (let i = 0; i < 40; i++) k += `<ellipse cx="${r(-47 + rnd() * 94)}" cy="${r(-8.5 + rnd() * 7.5)}" rx="${r(1.8 + rnd() * 1.6)}" ry="${r(1 + rnd() * 0.6)}" fill="${rnd() < 0.5 ? "#a39d90" : "#787266"}" stroke="#5e594f" stroke-width=".2"/>`;
    /* Heuboden-Luke mit Heu, Aufzugsbalken mit Rolle */
    k += `<rect x="-9" y="-86" width="18" height="16" fill="#22140c"/>`;
    k += `<path d="M-9 -70 Q-6 -78 0 -77 Q6 -79 9 -70 Z" fill="${HEU}"/>` + heuStriche(-9, -78, 9, -70, 14);
    k += `<path d="M-8 -70 l-2 3 M-4 -70 l-1 3.4 M2 -70 l1 3 M6 -70 l2 2.6" stroke="#d4b25a" stroke-width=".6"/>`;
    k += `<path d="M9 -86 L16 -84 L16 -68 L9 -70 Z" fill="#7a3624"/>`;
    k += `<rect x="-2" y="-98" width="4" height="3" fill="#4a2c1a"/><rect x="-1.2" y="-95" width="2.4" height="2" fill="#3a2214"/><circle cx="0" cy="-92.4" r="1.2" fill="#555"/><line x1="0" y1="-91.4" x2="0" y2="-86" stroke="#c9b48a" stroke-width=".3"/>`;
    /* Tor: rechter Flügel zu, linker offen (innen Heu) */
    k += `<rect x="-21" y="-46" width="21" height="46" fill="${S.lg("tenne", [[0, "#1c120c"], [1, "#3a2818"]])}"/>`;
    k += `<path d="M-21 -2 L-21 -16 Q-14 -26 -6 -22 Q-2 -30 0 -24 L0 -2 Z" fill="${HEU_S}"/>` + heuStriche(-21, -24, 0, -2, 18);
    k += `<path d="M-21 0 L0 0 L0 -3 L-21 -3 Z" fill="#5a4a34"/>`;
    k += `<rect x="0" y="-46" width="21" height="46" fill="${S.lg("torfl", [[0, "#7a3624"], [1, "#5e281a"]], 0, 0, 1, 0)}"/>` + brett(0, 21, () => -46, 0);
    k += `<path d="M1 -44 L20 -44 L20 -40 L1 -40 Z M1 -6 L20 -6 L20 -2 L1 -2 Z M2 -6 L18 -40 L20 -40 L4 -6 Z" fill="#9a4a30"/>`;
    k += `<path d="M-21 -46 L-36 -49 L-36 4 L-21 0 Z" fill="${S.lg("torauf", [[0, "#6e2e1e"], [1, "#8a3c26"]], 0, 0, 1, 0)}"/>`;
    for (let i = 1; i < 5; i++) k += `<path d="M${r(-21 - i * 3)} ${r(-46 - i * 0.6)} L${r(-21 - i * 3)} ${r(i * 0.8)}" stroke="#3e2416" stroke-width=".45" opacity=".6"/>`;
    k += `<path d="M-22 -42 L-35 -44.5 M-22 -5 L-35 -2" stroke="#a65236" stroke-width="2.2"/>`;
    k += `<rect x="-22" y="-48" width="44" height="2.4" fill="#4a2a1a"/>`;
    /* Werkzeug an der Wand rechts vom Tor: Rechen und Sense; Hufeisen über dem Tor */
    k += `<rect x="27.4" y="-43" width="1.2" height="31" rx=".5" fill="#c9a26a"/><rect x="23" y="-45" width="10" height="2" rx=".5" fill="#a27a48"/>`;
    for (let i = 0; i < 7; i++) k += `<rect x="${r(23.4 + i * 1.5)}" y="-43" width=".5" height="2.6" fill="#8c6838"/>`;
    k += `<circle cx="28" cy="-46" r=".6" fill="#333"/>`;
    k += `<path d="M38 -12 Q36 -28 38.5 -44" stroke="#b48a54" stroke-width="1.3" fill="none"/><path d="M36.6 -26 l3 0" stroke="#8c6838" stroke-width="1"/><path d="M38.5 -44 Q30 -46 25 -40 Q31 -43 38.5 -42 Z" fill="${S.lg("sensblatt", [[0, "#e6eaec"], [1, "#8d969c"]])}"/><circle cx="38.5" cy="-45" r=".6" fill="#333"/>`;
    k += `<path d="M-2.4 -55 Q-2.6 -51 0 -50.6 Q2.6 -51 2.4 -55" stroke="#6b6b6b" stroke-width="1.1" fill="none"/>`;
    for (const [x, y] of [[-2.2, -53.6], [2.2, -53.6], [-1.4, -51.4], [1.4, -51.4]]) k += `<circle cx="${x}" cy="${y}" r=".22" fill="#222"/>`;
    const u = [
      { id: "heu", de: "das Heu", syl: "HEU", it: "il fieno", itSyl: "FIE-no", en: "hay", x: SCH.x, y: SCH.y - 70, kunst: flaeche(-9, -9, 18, 10), tipp: "Heu ist getrocknetes Gras. Es ist das Winterfutter für Kühe und Pferde." },
      { id: "hufeisen", de: "das Hufeisen", syl: "HUF-ei-sen", it: "il ferro di cavallo", itSyl: "FER-ro di ca-VAL-lo", en: "horseshoe", x: SCH.x, y: SCH.y - 50, kunst: flaeche(-3.6, -6, 7.2, 6.4), tipp: "Über der Tür soll das Hufeisen Glück bringen." },
      { id: "rechen", de: "der Rechen", syl: "RE-chen", it: "il rastrello", itSyl: "ra-STREL-lo", en: "rake", x: SCH.x + 28, y: SCH.y - 12, kunst: flaeche(-5.4, -34, 10.8, 34), tipp: "Mit dem Rechen zieht man Heu und Laub zusammen." },
      { id: "sense", de: "die Sense", syl: "SEN-se", it: "la falce", itSyl: "FAL-ce", en: "scythe", x: SCH.x + 36, y: SCH.y - 12, kunst: flaeche(-11.5, -34.5, 15, 34.5) },
    ];
    S.teil({ id: "scheune", de: "die Scheune", syl: "SCHEU-ne", it: "il granaio", itSyl: "gra-NA-io", en: "barn", x: SCH.x, y: SCH.y, steht: true, kunst: k,
      zoom: { x: 0, y: 30, w: 99, h: 66 }, unter: u, tipp: "In der Scheune lagern Heu, Stroh und Maschinen." });
  }

  /* =====================================================================
     DER STALL (Backstein, Stallfenster, zweiteilige Stalltür)
     ===================================================================== */
  {
    const x0 = 98, x1 = 218, yb = 117, cx = (x0 + x1) / 2, W = x1 - x0;
    S.def(`<pattern id="bh_ziegel" width="6" height="2" patternUnits="userSpaceOnUse"><rect width="6" height="2" fill="#9c4a32"/><path d="M0 1.9 H6 M0 .9 H6 M3 0 V.9 M0 .9 V1.9" stroke="#c9b9a4" stroke-width=".22"/><rect x=".2" y=".1" width="2.6" height=".7" fill="#b05a3c" opacity=".5"/><rect x="3.3" y="1.1" width="2.4" height=".7" fill="#87402a" opacity=".5"/></pattern>`);
    S.def(`<pattern id="bh_dach" width="3.2" height="2.6" patternUnits="userSpaceOnUse"><rect width="3.2" height="2.6" fill="#a2442a"/><path d="M0 2.5 H3.2" stroke="#5e2414" stroke-width=".5"/><path d="M0 0 Q1.6 1.4 3.2 0" stroke="#7a3020" stroke-width=".3" fill="none"/><rect x=".4" y=".6" width="1.2" height="1.4" fill="#c2603e" opacity=".35"/></pattern>`);
    let k = "";
    /* Dachfläche (Biberschwanz), Firstlüfter, Dachrinne */
    k += `<path d="M${-W / 2 - 3} -36 L${W / 2 + 3} -36 L${W / 2 - 2} -68 L${-W / 2 + 2} -68 Z" fill="url(#bh_dach)"/>`;
    k += `<path d="M${-W / 2 - 3} -36 L${W / 2 + 3} -36 L${W / 2 - 2} -68 L${-W / 2 + 2} -68 Z" fill="${S.lg("dachlicht", [[0, "#000", 0.25], [1, "#fff", 0.08]])}"/>`;
    k += `<rect x="${-W / 2 + 1}" y="-70" width="${W - 2}" height="2.6" rx="1" fill="#6a2a18"/>`;
    for (const lx of [-30, 20]) k += `<rect x="${lx - 3}" y="-76" width="6" height="7" fill="#7d858a"/><path d="M${lx - 4} -76 L${lx + 4} -76 L${lx} -79 Z" fill="#5d656a"/>`;
    /* Dachfenster */
    k += `<path d="M-6 -60 L6 -60 L6 -50 L-6 -50 Z" fill="#33454f"/><path d="M-6 -60 L6 -60 L6 -50 L-6 -50 Z" fill="none" stroke="#d8d4cc" stroke-width=".6"/><path d="M-5 -59 L0 -59 L-5 -53 Z" fill="#fff" opacity=".25"/>`;
    /* Wand */
    k += `<rect x="${-W / 2}" y="-36" width="${W}" height="36" fill="url(#bh_ziegel)"/>`;
    k += `<rect x="${-W / 2}" y="-36" width="${W}" height="36" fill="${S.lg("stallicht", [[0, "#000", 0.22], [0.25, "#000", 0], [1, "#000", 0.12]])}"/>`;
    k += `<rect x="${-W / 2}" y="-4" width="${W}" height="4" fill="#5d5a54"/>`;
    k += `<rect x="${-W / 2 - 2}" y="-37.4" width="${W + 4}" height="2" rx=".8" fill="${ALU}"/><rect x="${W / 2 - 1}" y="-36" width="1.6" height="36" fill="#8a939a"/>`;
    /* vier Stallfenster mit Segmentbogen */
    for (const fx of [-50, -30, -2, 18]) {
      k += `<path d="M${fx - 6} -14 L${fx - 6} -26 Q${fx} -29.6 ${fx + 6} -26 L${fx + 6} -14 Z" fill="#7a3a26"/>`;
      k += `<path d="M${fx - 5} -15 L${fx - 5} -25.4 Q${fx} -28.4 ${fx + 5} -25.4 L${fx + 5} -15 Z" fill="${S.lg("stallglas", [[0, "#2e3c44"], [1, "#151c20"]])}"/>`;
      k += `<path d="M${fx - 5} -21 H${fx + 5} M${fx - 1.7} -27.6 V-15 M${fx + 1.7} -27.6 V-15" stroke="#e8e4dc" stroke-width=".55"/><path d="M${fx - 5} -15 L${fx - 5} -25.4 Q${fx} -28.4 ${fx + 5} -25.4 L${fx + 5} -15 Z" fill="none" stroke="#efebe3" stroke-width=".8"/>`;
      k += `<rect x="${fx - 6.4}" y="-14.4" width="12.8" height="1.4" fill="#b8b2a6"/><path d="M${fx - 4} -25 L${fx - 1} -26.4 L${fx - 4} -18 Z" fill="#fff" opacity=".18"/>`;
    }
    /* zweiteilige Stalltür (oben offen) */
    k += `<rect x="34" y="-30" width="16" height="30" fill="#5a3a24"/><rect x="35" y="-29" width="14" height="13" fill="#140e0a"/>`;
    k += `<rect x="35" y="-15.6" width="14" height="15.6" fill="${S.lg("stalltuer", [[0, "#3f6b45"], [1, "#2c4f33"]], 0, 0, 1, 0)}"/><path d="M36 -14 L48 -2 M48 -14 L36 -2" stroke="#2a4530" stroke-width=".8"/><rect x="35" y="-16" width="14" height="1.2" fill="#2a4530"/>`;
    k += `<path d="M49 -29 L56 -27 L56 -17 L49 -16 Z" fill="${S.lg("tuerauf", [[0, "#2c4f33"], [1, "#4a7a50"]], 0, 0, 1, 0)}"/>`;
    k += `<ellipse cx="42" cy="-20" rx="5" ry="3" fill="#000" opacity=".4"/>`;
    S.teil({ id: "stall", de: "der Stall", syl: "STALL", it: "la stalla", itSyl: "STAL-la", en: "stable", x: cx, y: yb, steht: true, kunst: k,
      tipp: "Im Stall schlafen die Kühe. Morgens und abends werden sie gemolken." });
  }

  /* =====================================================================
     DIE MILCHKANNEN vor der Stalltür
     ===================================================================== */
  {
    const y = 131, s = sk(y);
    let k = "";
    const kanne = (x, deckel, sc = 1) => {
      const w = 0.34 * s * sc, h = 0.72 * s * sc;
      let g = schatten(x, 0.2, w * 0.7, 0.5, 0.3);
      g += `<path d="M${r(x - w / 2)} 0 L${r(x - w / 2)} ${r(-h * 0.62)} Q${r(x - w / 2)} ${r(-h * 0.78)} ${r(x - w * 0.26)} ${r(-h * 0.84)} L${r(x - w * 0.26)} ${r(-h * 0.96)} L${r(x + w * 0.26)} ${r(-h * 0.96)} L${r(x + w * 0.26)} ${r(-h * 0.84)} Q${r(x + w / 2)} ${r(-h * 0.78)} ${r(x + w / 2)} ${r(-h * 0.62)} L${r(x + w / 2)} 0 Z" fill="${ALU}"/>`;
      g += `<rect x="${r(x - w / 2)}" y="${r(-h * 0.3)}" width="${r(w)}" height="${r(h * 0.05)}" fill="#7d868d" opacity=".6"/><rect x="${r(x - w / 2)}" y="-.6" width="${r(w)}" height=".6" fill="#6d767d"/>`;
      if (deckel) g += `<rect x="${r(x - w * 0.32)}" y="${r(-h * 1.02)}" width="${r(w * 0.64)}" height="${r(h * 0.07)}" rx=".3" fill="#c4ccd2"/><path d="M${r(x - w * 0.12)} ${r(-h * 1.02)} q${r(w * 0.12)} -1 ${r(w * 0.24)} 0" stroke="#7d868d" stroke-width=".35" fill="none"/>`;
      else g += `<ellipse cx="${r(x)}" cy="${r(-h * 0.96)}" rx="${r(w * 0.26)}" ry=".4" fill="#4a5258"/>`;
      g += `<path d="M${r(x - w / 2)} ${r(-h * 0.7)} q-1.2 1 0 2.4 M${r(x + w / 2)} ${r(-h * 0.7)} q1.2 1 0 2.4" stroke="#8a939a" stroke-width=".4" fill="none"/>`;
      return g;
    };
    k += kanne(-6.5, true, 0.95) + kanne(0, false) + kanne(6.5, true);
    S.teil({ id: "milch", de: "die Milchkanne", syl: "MILCH-kan-ne", it: "il bidone del latte", itSyl: "bi-DO-ne del LAT-te", en: "milk churn", x: 190, y, steht: true, kunst: k,
      tipp: "In der Milchkanne wurde die Milch früher zur Molkerei gebracht." });
  }

  /* =====================================================================
     DER MISTHAUFEN auf der Dungplatte, DIE MISTGABEL darin
     ===================================================================== */
  {
    const y = 136;
    let k = schatten(0, 0.3, 26, 2, 0.3);
    k += `<path d="M-27 0 L27 0 L25 -2 L-25 -2 Z" fill="#a8a49c"/>`;
    k += `<path d="M-25 -2 L-25 -13 L-22 -13 L-22 -2 Z M-25 -13 L22 -15 L22 -12 L-22 -10.4 Z" fill="${S.lg("beton", [[0, "#b9b5ad"], [1, "#8e8a82"]])}"/>`;
    const berg = [[-24, -1], [-23, -6], [-20, -9], [-17, -13], [-12, -15], [-9, -19], [-4, -20], [-1, -22], [3, -20], [7, -20], [10, -16], [14, -15], [17, -11], [21, -8], [24, -4], [25, -1]];
    k += T.koerper(berg, S.lg("mist", [[0, "#6a4a2a"], [0.6, "#4a321a"], [1, "#2e1f10"]]), T.striche(110, -24, -21, 25, -1, 2.6, 0.9, "#d8b45a", 0.4, 0.8) + T.striche(50, -24, -21, 25, -1, -2, 1.2, "#e8cc7a", 0.3, 0.6) + T.striche(40, -24, -21, 25, -1, -1.6, 1, "#1a1008", 0.6, 0.6), { rw: 0.3 });
    k += `<path d="M-4 -22 q-2 -4 1 -7 q2 -3 0 -6 M4 -20 q2 -3 -1 -6" stroke="#fff" stroke-width=".8" opacity=".18" fill="none"/>`;
    S.teil({ id: "misthaufen", de: "der Misthaufen", syl: "MIST-hau-fen", it: "il letamaio", itSyl: "le-ta-MA-io", en: "dung heap", x: 124, y, steht: true, kunst: k,
      tipp: "Mist ist Stroh mit Kuhdung. Er kommt als Dünger auf das Feld." });
    /* Mistgabel: steckt mit den Zinken im Mist, Stiel schräg nach oben */
    let g = `<path d="M0 0 L13 -26" stroke="${S.lg("stiel", [[0, "#c9a26a"], [1, "#9a7444"]], 0, 0, 1, 0)}" stroke-width="1.3" stroke-linecap="round"/>`;
    g += `<path d="M11.6 -24.6 l3.2 -1.2 l.8 1.8 l-3.2 1.2 Z" fill="#7a5530"/>`;
    g += `<path d="M-2.6 1 L2.6 -1.2 M-2.4 1.2 L-2.8 3 M-.8 .5 L-1 2.4 M.8 -.2 L.8 1.8 M2.4 -.9 L2.6 1" stroke="#5c646a" stroke-width=".6" stroke-linecap="round"/>`;
    S.teil({ oben: true, id: "mistgabel", de: "die Mistgabel", syl: "MIST-ga-bel", it: "il forcone", itSyl: "for-CO-ne", en: "pitchfork", x: 129, y: y - 18, kunst: g + flaeche(-3, -27, 18, 29) });
  }

  /* =====================================================================
     DER TRAKTOR (älterer Schlepper) mit DEM BAUERN auf dem Sitz
     ===================================================================== */
  const TR = { x: 30, y: 137 };
  {
    const u = sk(TR.y);  // Einheiten je Meter
    const m = (v) => r(v * u);
    const GRUEN = S.lg("schlepper", [[0, "#4f9a52"], [0.5, "#2f7a3a"], [1, "#1f5a2a"]]);
    let k = schatten(0, 0.3, 1.7 * u, 0.12 * u, 0.35);
    const rad = (cx, cy, rr, felge) => {
      let g = `<circle cx="${m(cx)}" cy="${m(-cy)}" r="${m(rr)}" fill="#1e1e1e"/>`;
      g += `<circle cx="${m(cx)}" cy="${m(-cy)}" r="${m(rr * 0.93)}" fill="none" stroke="#3a3a3a" stroke-width="${m(rr * 0.12)}" stroke-dasharray="${m(0.06)} ${m(0.06)}"/>`;
      g += `<circle cx="${m(cx)}" cy="${m(-cy)}" r="${m(felge)}" fill="${S.rg("felge", [[0, "#e04a3a"], [0.8, "#b8261c"], [1, "#7a1810"]])}"/>`;
      g += `<circle cx="${m(cx)}" cy="${m(-cy)}" r="${m(felge * 0.4)}" fill="#8a1a12"/><circle cx="${m(cx)}" cy="${m(-cy)}" r="${m(felge * 0.15)}" fill="#d8d8d8"/>`;
      for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; g += `<circle cx="${r(m(cx) + Math.cos(a) * m(felge * 0.62))}" cy="${r(m(-cy) + Math.sin(a) * m(felge * 0.62))}" r="${m(0.025)}" fill="#5a120c"/>`; }
      return g;
    };
    /* ferner Hinterreifen (dunkel), Rahmen, Motor */
    k += `<circle cx="${m(-0.85)}" cy="${m(-0.66)}" r="${m(0.66)}" fill="#141414"/>`;
    k += `<rect x="${m(-0.7)}" y="${m(-0.85)}" width="${m(2.2)}" height="${m(0.35)}" fill="#3a3d3f"/>`;
    k += `<rect x="${m(0.1)}" y="${m(-0.82)}" width="${m(1.0)}" height="${m(0.3)}" fill="#55595c"/>`;
    k += `<path d="M${m(0.25)} ${m(-0.7)} h${m(0.7)}" stroke="#2a2c2e" stroke-width="${m(0.03)}" stroke-dasharray="${m(0.05)} ${m(0.05)}"/>`;
    /* Motorhaube mit Kühlergrill und Scheinwerfer */
    k += `<path d="M${m(-0.4)} ${m(-0.85)} L${m(-0.4)} ${m(-1.32)} Q${m(-0.38)} ${m(-1.42)} ${m(-0.26)} ${m(-1.42)} L${m(1.38)} ${m(-1.36)} Q${m(1.56)} ${m(-1.34)} ${m(1.58)} ${m(-1.2)} L${m(1.6)} ${m(-0.85)} Z" fill="${GRUEN}"/>`;
    k += `<path d="M${m(-0.3)} ${m(-1.36)} L${m(1.3)} ${m(-1.31)}" stroke="#8fd08a" stroke-width="${m(0.04)}" opacity=".6"/>`;
    for (let i = 0; i < 6; i++) k += `<rect x="${m(0.1 + i * 0.14)}" y="${m(-1.18)}" width="${m(0.06)}" height="${m(0.22)}" rx="${m(0.02)}" fill="#1f4a26"/>`;
    k += `<rect x="${m(1.5)}" y="${m(-1.28)}" width="${m(0.1)}" height="${m(0.4)}" fill="#c9cfd4"/>`;
    for (let i = 0; i < 4; i++) k += `<rect x="${m(1.51)}" y="${m(-1.24 + i * 0.09)}" width="${m(0.08)}" height="${m(0.03)}" fill="#555"/>`;
    k += `<ellipse cx="${m(1.42)}" cy="${m(-1.45)}" rx="${m(0.1)}" ry="${m(0.07)}" fill="#f6f2d8" stroke="#555" stroke-width="${m(0.02)}"/>`;
    /* Auspuff */
    k += `<rect x="${m(0.86)}" y="${m(-2.08)}" width="${m(0.07)}" height="${m(0.72)}" fill="#2a2a2a"/><path d="M${m(0.86)} ${m(-2.08)} l${m(0.09)} -${m(0.05)}" stroke="#2a2a2a" stroke-width="${m(0.07)}"/>`;
    /* Lenkrad, Sitz, Kotflügel */
    k += `<path d="M${m(-0.32)} ${m(-1.35)} L${m(-0.48)} ${m(-1.6)}" stroke="#2a2a2a" stroke-width="${m(0.05)}"/>`;
    k += `<ellipse cx="${m(-0.5)}" cy="${m(-1.62)}" rx="${m(0.18)}" ry="${m(0.05)}" fill="none" stroke="#1a1a1a" stroke-width="${m(0.04)}"/>`;
    k += rad(-0.85, 0.66, 0.66, 0.4);
    k += `<path d="M${m(-1.62)} ${m(-0.66)} A${m(0.77)} ${m(0.77)} 0 0 1 ${m(-0.08)} ${m(-0.66)} L${m(-0.08)} ${m(-0.56)} L${m(-0.16)} ${m(-0.56)} A${m(0.69)} ${m(0.69)} 0 0 0 ${m(-1.54)} ${m(-0.66)} Z" fill="${GRUEN}"/>`;
    k += `<path d="M${m(-1.1)} ${m(-1.42)} L${m(-0.8)} ${m(-1.42)} L${m(-0.78)} ${m(-1.48)} L${m(-1.1)} ${m(-1.5)} Z M${m(-1.12)} ${m(-1.5)} L${m(-1.18)} ${m(-1.82)} L${m(-1.08)} ${m(-1.82)} L${m(-1.02)} ${m(-1.5)} Z" fill="#1a1a1a"/>`;
    k += rad(1.2, 0.38, 0.38, 0.22);
    /* Anhängekupplung hinten */
    k += `<rect x="${m(-1.7)}" y="${m(-0.55)}" width="${m(0.2)}" height="${m(0.1)}" fill="#333"/>`;
    S.teil({ id: "traktor", de: "der Traktor", syl: "TRAK-tor", it: "il trattore", itSyl: "trat-TO-re", en: "tractor", x: TR.x, y: TR.y, steht: true, kunst: k,
      tipp: "Mit dem Traktor zieht der Bauer den Pflug und den Anhänger." });
    /* der Bauer auf dem Sitz */
    const mb = B.mensch({ id: "bh_bauer", geschlecht: "m", pose: "sitzen", blick: 80, frisur: "kurz", haarfarbe: "braun", haut: "hell", bart: "voll",
      kopfbedeckung: { stueck: "kappe", farbe: "#2f5a35" },
      kleidung: { oberteil: { stueck: "hemd", farbe: "#a8433a" }, unterteil: { stueck: "arbeitshose", farbe: "#2f4f7a" }, schuhe: { stueck: "gummistiefel" }, kopf: { stueck: "kappe", farbe: "#2f5a35" } } }, 1.78 * u);
    const sx = TR.x - 0.95 * u, sy = TR.y - 1.44 * u;
    const ox = sx - mb.z.sitz.x * mb.k, oy = sy - mb.z.sitz.y * mb.k;
    S.teil({ id: "bauer", de: "der Bauer", syl: "BAU-er", it: "il contadino", itSyl: "con-ta-DI-no", en: "farmer", x: ox, y: oy, kunst: mb.svg,
      tipp: "Der Bauer sagt: „Die Arbeit fängt um fünf Uhr früh an.“" });
  }

  /* =====================================================================
     DIE SCHUBKARRE am Misthaufen
     ===================================================================== */
  {
    const y = 139, u = sk(y), m = (v) => r(v * u);
    let k = schatten(0, 0.2, 0.7 * u, 0.08 * u, 0.3);
    k += `<path d="M${m(0.3)} ${m(-0.25)} L${m(0.42)} 0 M${m(0.05)} ${m(-0.25)} L${m(0.1)} 0" stroke="#2a2c2e" stroke-width="${m(0.04)}"/>`;
    k += `<path d="M${m(-0.5)} ${m(-0.28)} L${m(0.9)} ${m(-0.55)}" stroke="#4a4e52" stroke-width="${m(0.05)}" stroke-linecap="round"/>`;
    k += `<path d="M${m(-0.45)} ${m(-0.62)} L${m(0.55)} ${m(-0.62)} L${m(0.35)} ${m(-0.25)} L${m(-0.25)} ${m(-0.25)} Z" fill="${S.lg("wanne", [[0, "#c9d0d4"], [0.5, "#9aa3a9"], [1, "#7a8288"]], 0, 0, 1, 0)}"/>`;
    k += `<path d="M${m(-0.44)} ${m(-0.62)} Q${m(0)} ${m(-0.78)} ${m(0.54)} ${m(-0.62)} Z" fill="${HEU_S}"/>` + `<path d="M${m(-0.4)} ${m(-0.64)} q${m(0.3)} -${m(0.1)} ${m(0.6)} 0" stroke="#5a3e20" stroke-width="${m(0.04)}" fill="none"/>`;
    k += `<path d="M${m(-0.47)} ${m(-0.64)} L${m(0.57)} ${m(-0.64)}" stroke="#d8dee2" stroke-width="${m(0.04)}"/>`;
    k += `<circle cx="${m(-0.5)}" cy="${m(-0.2)}" r="${m(0.2)}" fill="#1e1e1e"/><circle cx="${m(-0.5)}" cy="${m(-0.2)}" r="${m(0.09)}" fill="#c43a2a"/>`;
    k += `<path d="M${m(0.85)} ${m(-0.56)} l${m(0.22)} -${m(0.04)}" stroke="#222" stroke-width="${m(0.07)}" stroke-linecap="round"/>`;
    S.teil({ id: "schubkarre", de: "die Schubkarre", syl: "SCHUB-kar-re", it: "la carriola", itSyl: "car-RIO-la", en: "wheelbarrow", x: 162, y, steht: true, kunst: k });
  }

  /* =====================================================================
     DER HÜHNERSTALL (auf Stelzen, mit Leiter und Legenest) — Lupe
     ===================================================================== */
  {
    const yb = 148, Z0 = Zb(yb), Xc = Xb(274, Z0);
    const X0 = Xc - 0.7, X1 = Xc + 0.7, Z1 = Z0 + 1.0;
    let k = "";
    const [gx, gy] = P(Xc, 0, Z0 + 0.5);
    k += schatten(gx, gy, 16, 2.2, 0.3);
    /* Stelzen */
    for (const [X, Z] of [[X0 + 0.05, Z1 - 0.05], [X1 - 0.05, Z1 - 0.05], [X0 + 0.05, Z0 + 0.05], [X1 - 0.05, Z0 + 0.05]]) { const a = P(X, 0, Z), b = P(X, 0.55, Z); k += `<path d="M${a[0]} ${a[1]} L${b[0]} ${b[1]}" stroke="#6a4a2c" stroke-width="1.4"/>`; }
    /* Kasten: Seite links, Front */
    k += kiste(X0, X1, 0.55, 1.35, Z0, Z1, { s: S.lg("hsseite", [[0, "#9a7046"], [1, "#7a5432"]], 0, 0, 1, 0), v: S.lg("hsfront", [[0, "#b8865a"], [1, "#9a6a40"]]) });
    /* Satteldach (First quer) */
    const D = (X, Y, Z) => P(X, Y, Z);
    k += poly([D(X0 - 0.08, 1.33, Z0 - 0.1), D(X1 + 0.08, 1.33, Z0 - 0.1), D(X1 + 0.08, 1.72, Z0 + 0.5), D(X0 - 0.08, 1.72, Z0 + 0.5)], S.lg("hsdach", [[0, "#5a4a44"], [1, "#3a302c"]]));
    k += poly([D(X0 - 0.08, 1.33, Z0 - 0.1), D(X0 - 0.08, 1.72, Z0 + 0.5), D(X0 - 0.08, 1.33, Z1 + 0.1)], "#4a3c36");
    /* Bretterfugen */
    const [fa, fb] = [P(X0, 1.35, Z0), P(X0, 0.55, Z0)];
    for (let i = 1; i < 8; i++) { const X = X0 + i * 0.175, a = P(X, 1.35, Z0), b = P(X, 0.55, Z0); k += `<path d="M${a[0]} ${a[1]} L${b[0]} ${b[1]}" stroke="#6e4a2a" stroke-width=".35" opacity=".7"/>`; }
    /* Legenest-Klappe offen: Stroh und Eier */
    const n0 = P(Xc + 0.05, 1.2, Z0), n1 = P(X1 - 0.08, 0.72, Z0);
    k += `<rect x="${n0[0]}" y="${n0[1]}" width="${r(n1[0] - n0[0])}" height="${r(n1[1] - n0[1])}" fill="#1e140c"/>`;
    const nw = n1[0] - n0[0], nh = n1[1] - n0[1];
    k += `<path d="M${n0[0]} ${r(n1[1])} Q${r(n0[0] + nw / 2)} ${r(n1[1] - nh * 0.55)} ${n1[0]} ${r(n1[1])} Z" fill="${HEU}"/>`;
    const eier = [[0.35, 0.8], [0.5, 0.72], [0.64, 0.8]];
    for (const [ex, ey] of eier) k += `<ellipse cx="${r(n0[0] + nw * ex)}" cy="${r(n0[1] + nh * ey)}" rx="1.1" ry="1.4" fill="${S.rg("ei", [[0, "#f6e2c8"], [1, "#c99a6a"]], 0.4, 0.35, 0.7)}"/>`;
    k += `<path d="M${n0[0]} ${n1[1]} L${n1[0]} ${n1[1]} L${r(n1[0] + 1)} ${r(n1[1] + 3.4)} L${r(n0[0] - 1)} ${r(n1[1] + 3.4)} Z" fill="#a8784c"/>`;
    /* Fenster mit Draht, Schlupfloch links mit Hühnerleiter */
    const w0 = P(X0 + 0.12, 1.2, Z0), w1 = P(Xc - 0.08, 0.85, Z0);
    k += `<rect x="${w0[0]}" y="${w0[1]}" width="${r(w1[0] - w0[0])}" height="${r(w1[1] - w0[1])}" fill="#2a2a24"/><path d="M${w0[0]} ${w0[1]} l${r(w1[0] - w0[0])} ${r(w1[1] - w0[1])} M${w1[0]} ${w0[1]} l${r(w0[0] - w1[0])} ${r(w1[1] - w0[1])}" stroke="#999" stroke-width=".2"/>`;
    const l0 = P(X0, 0.58, Z0 + 0.55), l1 = P(X0 - 0.75, 0, Z0 + 0.55);
    k += `<path d="M${l0[0]} ${l0[1]} L${l1[0]} ${l1[1]}" stroke="#9a7046" stroke-width="2.6"/>`;
    for (let i = 1; i < 5; i++) { const t = i / 5; k += `<path d="M${r(l0[0] + (l1[0] - l0[0]) * t - 1)} ${r(l0[1] + (l1[1] - l0[1]) * t - 0.4)} l2 .3" stroke="#6a4a2c" stroke-width=".5"/>`; }
    const loch = P(X0, 0.6, Z0 + 0.55);
    k += `<path d="M${loch[0]} ${loch[1]} l0 -4.6 l-.8 -.2 l0 4.8 Z" fill="#140c08"/>`;
    /* Küken am Fuß der Leiter (im ganzen Bild winzig) */
    const kk = sk(gy + 4) / 100;
    let kue = "";
    for (const [dx, dy, d] of [[-4, 4, 1], [-1, 5, -1], [2, 4.4, 1]]) kue += `<g transform="translate(${r(l1[0] + dx)} ${r(l1[1] + dy)})">${T.kueken(kk, d)}</g>`;
    k += kue;
    const cx = (P(X0, 0, Z0)[0] + P(X1, 0, Z0)[0]) / 2, cy = P(Xc, 0, Z0)[1];
    const unter = [
      { id: "ei", de: "das Ei", syl: "EI", it: "l'uovo", itSyl: "UO-vo", en: "egg", x: r(n0[0] + nw * 0.5), y: r(n0[1] + nh * 0.92), kunst: flaeche(-nw * 0.3, -nh * 0.3, nw * 0.6, nh * 0.32),
        tipp: "Ein Huhn legt fast jeden Tag ein Ei." },
      { id: "nest", de: "das Nest", syl: "NEST", it: "il nido", itSyl: "NI-do", en: "nest", x: r(n0[0] + nw * 0.5), y: r(n1[1]), kunst: flaeche(-nw * 0.5, -nh * 0.3, nw, nh * 0.3) + flaeche(-nw * 0.5 - 1, 0, nw + 2, 3.4) },
      { id: "kueken", de: "das Küken", syl: "KÜ-ken", it: "il pulcino", itSyl: "pul-CI-no", en: "chick", x: r(l1[0]), y: r(l1[1] + 5), kunst: flaeche(-6, -4, 11, 5) },
    ];
    S.teil({ id: "huehnerstall", de: "der Hühnerstall", syl: "HÜH-ner-stall", it: "il pollaio", itSyl: "pol-LA-io", en: "henhouse", x: r(cx), y: r(cy), steht: true, kunst: um(cx, cy, k),
      zoom: { x: 246, y: 108, w: 54, h: 36 }, unter: unter.map((t) => Object.assign(t, { x: t.x, y: t.y })),
      tipp: "Über die Hühnerleiter gehen die Hühner abends in den Stall." });
  }

  /* =====================================================================
     DIE KÄLBERHÜTTE (Kälberiglu) und DAS KALB
     ===================================================================== */
  {
    const yb = 158, Z0 = Zb(yb), Xc = Xb(220, Z0), X0 = Xc - 0.65, X1 = Xc + 0.65, Z1 = Z0 + 2.0;
    let k = "";
    const [gx, gy] = P(Xc, 0, Z0 + 1);
    k += schatten(gx, gy, 20, 3, 0.25);
    /* linke Seite (Richtung Fluchtpunkt) als gewölbte Haube */
    const a = P(X0, 0, Z0), b = P(X0, 0, Z1), c = P(X0, 1.25, Z1), d = P(X0, 1.4, Z0 + 0.4), e = P(X0, 1.3, Z0);
    k += `<path d="M${a[0]} ${a[1]} L${b[0]} ${b[1]} L${c[0]} ${c[1]} Q${d[0]} ${d[1] - 2} ${e[0]} ${e[1]} Z" fill="${S.lg("igluS", [[0, "#e8ebe8"], [1, "#c4c9c6"]], 0, 0, 1, 0)}"/>`;
    const f0 = P(X0, 0, Z0), f1 = P(X1, 0, Z0), ft = P(Xc, 1.42, Z0);
    k += `<path d="M${f0[0]} ${f0[1]} L${f0[0]} ${r(ft[1] + 6)} Q${f0[0]} ${ft[1]} ${ft[0]} ${ft[1]} Q${f1[0]} ${ft[1]} ${f1[0]} ${r(ft[1] + 6)} L${f1[0]} ${f1[1]} Z" fill="${S.lg("igluF", [[0, "#fbfcfb"], [1, "#dfe3e0"]])}"/>`;
    const o0 = P(Xc - 0.42, 0, Z0), o1 = P(Xc + 0.42, 1.0, Z0);
    k += `<path d="M${o0[0]} ${o0[1]} L${o0[0]} ${r(o1[1] + 4)} Q${r((o0[0] + o1[0]) / 2)} ${r(o1[1] - 2)} ${o1[0]} ${r(o1[1] + 4)} L${o1[0]} ${o0[1]} Z" fill="${S.lg("igluI", [[0, "#2a241c"], [1, "#4a3a24"]])}"/>`;
    k += `<path d="M${o0[0]} ${o0[1]} Q${r((o0[0] + o1[0]) / 2)} ${r(o0[1] - 5)} ${o1[0]} ${o0[1]} Z" fill="${HEU_S}"/>`;
    k += `<path d="M${f0[0]} ${r(ft[1] + 6)} Q${f0[0]} ${ft[1]} ${ft[0]} ${ft[1]}" stroke="#fff" stroke-width=".8" fill="none" opacity=".8"/>`;
    k += `<rect x="${r(ft[0] - 3)}" y="${r(ft[1] + 3)}" width="6" height="2.6" rx=".5" fill="#2a6ab0"/>`;
    S.teil({ id: "kaelberhuette", de: "die Kälberhütte", syl: "KÄL-ber-hüt-te", it: "la capannina per vitelli", itSyl: "ca-pan-NI-na per vi-TEL-li", en: "calf hutch", x: r(gx), y: yb, steht: true, kunst: um(gx, yb, k),
      tipp: "In den ersten Wochen wohnt jedes Kalb in einer eigenen Hütte an der frischen Luft." });
    S.teil({ id: "kalb", de: "das Kalb", syl: "KALB", it: "il vitello", itSyl: "vi-TEL-lo", en: "calf", x: 232, y: 165, kunst: T.kalb(sk(165) / 100, -1),
      tipp: "Das Kalb ist das Kind der Kuh." });
  }

  /* =====================================================================
     DIE HEUBALLEN (Quaderballen) und DIE KATZE darauf
     ===================================================================== */
  const HB = {};
  {
    const yb = 129, Z0 = Zb(yb), Xa = Xb(58, Z0);
    let k = "";
    const ballen = (X0, Y0, Z0b) => {
      const X1 = X0 + 0.9, Y1 = Y0 + 0.42, Z1 = Z0b + 0.5;
      let g = kiste(X0, X1, Y0, Y1, Z0b, Z1, { s: HEU_S, o: S.lg("heuoben", [[0, "#f0da8a"], [1, "#dcc06a"]]), v: HEU });
      const p0 = P(X0, Y1, Z0b), p1 = P(X1, Y0, Z0b);
      g += heuStriche(p0[0], p0[1], p1[0], p1[1], 16);
      for (const t of [0.3, 0.7]) { const a = P(X0 + t * 0.9, Y1, Z1), b = P(X0 + t * 0.9, Y1, Z0b), c = P(X0 + t * 0.9, Y0, Z0b); g += `<path d="M${a[0]} ${a[1]} L${b[0]} ${b[1]} L${c[0]} ${c[1]}" stroke="#e8e2d0" stroke-width=".35" fill="none"/>`; }
      return g;
    };
    const gp = P(Xa + 0.9, 0, Z0 + 0.25);
    k += schatten(gp[0], gp[1], 14, 1.4, 0.3);
    k += ballen(Xa, 0, Z0) + ballen(Xa + 0.9, 0, Z0) + ballen(Xa + 0.45, 0.42, Z0 + 0.02);
    HB.top = P(Xa + 0.95, 0.84, Z0 + 0.22);
    S.teil({ id: "heuballen", de: "der Heuballen", syl: "HEU-bal-len", it: "la balla di fieno", itSyl: "BAL-la di FIE-no", en: "hay bale", x: r(gp[0]), y: yb, steht: true, kunst: um(gp[0], yb, k),
      tipp: "Die Ballenpresse presst das Heu zu festen Ballen." });
  }

  /* =====================================================================
     DIE KUH (Holstein, schwarzbunt)
     ===================================================================== */
  S.teil({ id: "kuh", de: "die Kuh", syl: "KUH", it: "la vacca", itSyl: "VAC-ca", en: "cow", x: 100, y: 168, kunst: T.kuh(sk(168) / 100, 1),
    tipp: "Eine Milchkuh gibt am Tag etwa 25 bis 30 Liter Milch." });

  /* =====================================================================
     HUHN und HAHN
     ===================================================================== */
  S.teil({ id: "hahn", de: "der Hahn", syl: "HAHN", it: "il gallo", itSyl: "GAL-lo", en: "rooster", x: 176, y: 182, kunst: T.hahn(sk(182) / 100, -1),
    tipp: "Der Hahn kräht am Morgen: „Kikeriki!“" });
  S.teil({ id: "huhn", de: "das Huhn", syl: "HUHN", it: "la gallina", itSyl: "gal-LI-na", en: "hen", x: 154, y: 186, kunst: T.huhn(sk(186) / 100, 1) });

  /* =====================================================================
     DIE HUNDEHÜTTE und DER HOFHUND
     ===================================================================== */
  {
    const yb = 184, Z0 = Zb(yb), Xc = Xb(24, Z0), X0 = Xc - 0.5, X1 = Xc + 0.5, Z1 = Z0 + 1.1;
    let k = "";
    const gp = P(Xc, 0, Z0 + 0.5);
    k += schatten(gp[0], gp[1], 18, 2.6, 0.3);
    k += kiste(X0, X1, 0, 0.75, Z0, Z1, { s: S.lg("hhS", [[0, "#8a6440"], [1, "#6a4a2c"]], 0, 0, 1, 0) });
    /* Dach rechts (sichtbar) */
    const g1 = P(Xc, 1.08, Z0 - 0.08), g2 = P(Xc, 1.08, Z1 + 0.05), e1 = P(X1 + 0.1, 0.7, Z0 - 0.08), e2 = P(X1 + 0.1, 0.7, Z1 + 0.05);
    k += poly([g1, g2, e2, e1], S.lg("hhdach", [[0, "#7a3a28"], [1, "#5a2a1c"]]));
    /* Front mit Giebel und runder Öffnung */
    const a = P(X0, 0, Z0), b = P(X1, 0, Z0), c = P(X1, 0.75, Z0), t = P(Xc, 1.05, Z0), d = P(X0, 0.75, Z0);
    k += poly([a, b, c, t, d], S.lg("hhF", [[0, "#b8865a"], [1, "#94683e"]]));
    for (let i = 1; i < 6; i++) { const q = P(X0 + i / 6, 0, Z0), q2 = P(X0 + i / 6, 0.75 + (0.5 - Math.abs(i / 6 - 0.5)) * 0.6, Z0); k += `<path d="M${q[0]} ${q[1]} L${q2[0]} ${q2[1]}" stroke="#6e4a2a" stroke-width=".4" opacity=".7"/>`; }
    const oa = P(Xc - 0.22, 0, Z0), ob = P(Xc + 0.22, 0.55, Z0);
    k += `<path d="M${oa[0]} ${oa[1]} L${oa[0]} ${r(ob[1] + 4)} A${r((ob[0] - oa[0]) / 2)} ${r((ob[0] - oa[0]) / 2)} 0 0 1 ${ob[0]} ${r(ob[1] + 4)} L${ob[0]} ${oa[1]} Z" fill="#1a120c"/>`;
    const dl = P(X0 - 0.08, 0.7, Z0 - 0.08);
    k += `<path d="M${dl[0]} ${dl[1]} L${t[0]} ${r(t[1] - 1.4)} L${e1[0]} ${e1[1]}" stroke="#4a2218" stroke-width="2" fill="none" stroke-linejoin="round"/>`;
    k += `<path d="M${r(t[0] - 3)} ${r(t[1] + 5)} h6" stroke="#f2e6c8" stroke-width="2.2"/><text x="${t[0]}" y="${r(t[1] + 5.8)}" font-size="2" text-anchor="middle" fill="#5a3a1a" font-family="Georgia" font-style="italic">Rex</text>`;
    S.teil({ id: "hundehuette", de: "die Hundehütte", syl: "HUN-de-hüt-te", it: "la cuccia", itSyl: "CUC-cia", en: "kennel", x: r(gp[0]), y: yb, steht: true, kunst: um(gp[0], yb, k) });
  }
  S.teil({ id: "ente", de: "die Ente", syl: "EN-te", it: "l'anatra", itSyl: "A-na-tra", en: "duck", x: 200, y: 192, kunst: T.ente(sk(189) / 100, -1, { art: "peking" }),
    tipp: "Auf dem Hof watschelt sie über den Platz; schwimmen kann sie trotzdem — sie hat Schwimmhäute zwischen den Zehen." });

  /* =====================================================================
     DER BRUNNEN (Schwengelpumpe mit Steintrog)
     ===================================================================== */
  {
    const yb = 192, Z0 = Zb(yb), X0 = Xb(258, Z0), X1 = X0 + 1.4, Z1 = Z0 + 0.6;
    let k = "";
    const gp = P((X0 + X1) / 2 + 0.3, 0, Z0 + 0.3);
    k += schatten(gp[0], gp[1], 30, 3, 0.3);
    const STEIN = S.lg("sandstein", [[0, "#cdb79a"], [1, "#a8906e"]]);
    k += kiste(X0, X1, 0, 0.55, Z0, Z1, { s: "#9a8262", v: STEIN, o: "#c4ae90" });
    const i0 = P(X0 + 0.08, 0.55, Z0 + 0.08), i1 = P(X1 - 0.08, 0.55, Z0 + 0.08), i2 = P(X1 - 0.08, 0.55, Z1 - 0.08), i3 = P(X0 + 0.08, 0.55, Z1 - 0.08);
    k += poly([i0, i1, i2, i3], S.lg("wasser", [[0, "#5d8fae"], [1, "#9cc4da"]]));
    k += `<path d="M${r(i0[0] + 4)} ${r(i0[1] - 1)} l12 0" stroke="#fff" stroke-width=".6" opacity=".6"/>`;
    for (let i = 0; i < 18; i++) { const q = P(X0 + rnd() * 1.4, rnd() * 0.5, Z0); k += `<circle cx="${q[0]}" cy="${q[1]}" r=".4" fill="#8a7458" opacity=".6"/>`; }
    /* Pumpe: Säule aus Gusseisen, Schwengel, Auslauf über dem Trog */
    const pX = X1 + 0.12, pZ = Z0 + 0.3, u = F / pZ, b0 = P(pX, 0, pZ);
    const PU = S.lg("pumpe", [[0, "#3e5a44"], [0.5, "#5f8466"], [1, "#2c4030"]], 0, 0, 1, 0);
    k += `<rect x="${r(b0[0] - 0.14 * u)}" y="${r(b0[1] - 0.08 * u)}" width="${r(0.28 * u)}" height="${r(0.08 * u)}" fill="#7d7a72"/>`;
    k += `<path d="M${r(b0[0] - 0.08 * u)} ${r(b0[1] - 0.08 * u)} L${r(b0[0] - 0.07 * u)} ${r(b0[1] - 1.15 * u)} Q${r(b0[0])} ${r(b0[1] - 1.3 * u)} ${r(b0[0] + 0.07 * u)} ${r(b0[1] - 1.15 * u)} L${r(b0[0] + 0.08 * u)} ${r(b0[1] - 0.08 * u)} Z" fill="${PU}"/>`;
    k += `<path d="M${r(b0[0] - 0.06 * u)} ${r(b0[1] - 0.8 * u)} L${r(b0[0] - 0.36 * u)} ${r(b0[1] - 0.76 * u)} L${r(b0[0] - 0.38 * u)} ${r(b0[1] - 0.68 * u)}" stroke="${PU}" stroke-width="${r(0.06 * u)}" fill="none" stroke-linejoin="round"/>`;
    k += `<path d="M${r(b0[0])} ${r(b0[1] - 1.2 * u)} L${r(b0[0] + 0.55 * u)} ${r(b0[1] - 0.9 * u)}" stroke="#2c4030" stroke-width="${r(0.045 * u)}" stroke-linecap="round"/>`;
    k += `<circle cx="${r(b0[0])}" cy="${r(b0[1] - 1.22 * u)}" r="${r(0.04 * u)}" fill="#c9b04a"/>`;
    k += `<path d="M${r(b0[0] - 0.37 * u)} ${r(b0[1] - 0.66 * u)} q-.3 3 .2 5" stroke="#cfe6f2" stroke-width=".6" fill="none" opacity=".8"/>`;
    k += `<path d="M${r(b0[0] - 0.05 * u)} ${r(b0[1] - 1.1 * u)} L${r(b0[0] - 0.03 * u)} ${r(b0[1] - 0.2 * u)}" stroke="#fff" stroke-width=".5" opacity=".25"/>`;
    S.teil({ id: "brunnen", de: "der Brunnen", syl: "BRUN-nen", it: "il pozzo", itSyl: "POZ-zo", en: "well", x: r(gp[0]), y: yb, steht: true, kunst: um(gp[0], yb, k),
      tipp: "Mit dem Schwengel pumpt man Wasser aus dem Brunnen in den Trog." });
  }

  /* =====================================================================
     DER HOFHUND und DAS SCHWEIN (ganz vorn)
     ===================================================================== */
  S.teil({ id: "hund", de: "der Hofhund", syl: "HOF-hund", it: "il cane", itSyl: "CA-ne", en: "dog", x: 34, y: 195, kunst: T.hund(sk(195) / 100, 1, { art: "schaefer" }),
    tipp: "Der Hofhund passt auf den Hof auf und bellt, wenn jemand kommt." });
  S.teil({ id: "katze", de: "die Katze", syl: "KAT-ze", it: "il gatto", itSyl: "GAT-to", en: "cat", x: 238, y: 197, kunst: T.katze(sk(197) / 100, -1, { art: "tabby" }),
    tipp: "Die Hofkatze fängt Mäuse in der Scheune." });
  S.teil({ id: "schwein", de: "das Schwein", syl: "SCHWEIN", it: "il maiale", itSyl: "ma-IA-le", en: "pig", x: 114, y: 196, kunst: T.schwein(sk(196) / 100, -1),
    tipp: "Schweine suhlen sich im Schlamm: Das kühlt und schützt die Haut vor der Sonne." });

  const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/bauernhof.js"));
  console.log(aus);
}
if (require.main === module) baue();
