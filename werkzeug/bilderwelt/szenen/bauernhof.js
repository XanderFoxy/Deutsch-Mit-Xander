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
    S.def(`<clipPath id="${id}"><path d="${d}"/></clipPath>`);
    const [x0, y0, x1, y1] = box(pts);
    let s = `<path d="${d}" fill="${fill}"/>`;
    s += `<g clip-path="url(#${id})">${innen}`;
    if (o.vol !== false) s += `<rect x="${r(x0)}" y="${r(y0)}" width="${r(x1 - x0)}" height="${r(y1 - y0)}" fill="${VOL()}"/>`;
    s += `</g>`;
    if (o.rand !== false) s += `<path d="${d}" fill="none" stroke="${o.rand || "#000"}" stroke-opacity="${o.randA || 0.35}" stroke-width="${o.rw || 1}"/>`;
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
  const T = tierKasten(S);
  const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/bauernhof.js"));
  console.log(aus);
}
if (require.main === module) baue();
