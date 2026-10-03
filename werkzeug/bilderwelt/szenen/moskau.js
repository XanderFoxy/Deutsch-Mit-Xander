#!/usr/bin/env node
/* =====================================================================
   MOSKAU (FASSUNG 854) — Bilderwelt neu: Städte der Welt
   ---------------------------------------------------------------------
   XANDER (03.10.): „die bekannten Sehenswürdigkeiten … zu den bekanntesten
   Städten in anderen Ländern … als Profi-Grafikdesigner auf Hollywood-
   Niveau“ — und (Funk 291) „mit größter Sorgfalt und Präzision“.
   Politisch neutral: nur Architektur, Alltag und Kultur.

   RECHERCHE (Wikipedia „Red Square“, „Saint Basil's Cathedral“,
   „Spasskaya Tower“, „Kremlin Clock“, „GUM (department store)“,
   „Monument to Minin and Pozharsky“; Lonely Planet; MasterClass):
   - STANDORT: der ROTE PLATZ (330 m lang, 70 m breit, von Nordwest nach
     Südost). Der Betrachter steht am Nordende vor dem Historischen
     Museum und schaut nach Südosten: das Postkartenmotiv.
     Links (Nordosten) die lange Fassade des Kaufhauses GUM, rechts
     (Südwesten) die Kremlmauer mit dem Mausoleum und dem Senatsturm,
     dahinter die Blaufichten; am Ende rechts der SPASSKI-TURM, in der
     Mitte die BASILIUSKATHEDRALE, davor das Denkmal für Minin und
     Poscharski. Zwischen Kathedrale und Spasski-Turm sieht man weit
     hinten den runden Moskworezki-Turm (Beklemischew-Turm) an der Moskwa.
   - BASILIUSKATHEDRALE (1555–1561, 65 m): neun Kapellen auf einem
     gemeinsamen Sockel mit Galerien. In der Mitte ein hohes ZELTDACH
     mit kleiner goldener Kuppel, um es herum vier große und vier kleine
     achteckige Türme mit Kokoschniks (Kielbogen-Giebeln) und je einer
     ZWIEBELKUPPEL – jede anders: Spiralen, Zickzack, Rauten mit
     Spitzen, Rippen; Blau-Weiß über der Nordkapelle (Zyprian und
     Justina), Grün-Orange über der Dreifaltigkeitskapelle. Die bunten
     Farben gibt es erst seit dem 17. Jahrhundert. Roter Backstein mit
     weißem Steinschmuck. Links hinten der GLOCKENTURM mit grünem Zeltdach.
   - SPASSKI-TURM (71 m): unten zwei viereckige Geschosse mit weißem
     Steinschmuck und kleinen Ecktürmchen, darüber das Geschoss mit der
     Uhr (Zifferblatt 6,1 m, schwarz mit Gold, auf allen vier Seiten),
     zwei Achtecke mit Bogenöffnungen, das grüne Zeltdach und der rote
     STERN (seit 1935, 3,75 m Spannweite). Das Tor liegt auf der Seite
     zum Platz (hier fast verdeckt).
   - KREMLMAUER: roter Backstein, oben die Schwalbenschwanz-ZINNEN
     („M“-Form). Davor Blaufichten, das MAUSOLEUM (Stufenpyramide aus
     rotem Granit und schwarzem Labradorit, 12 m hoch) und dahinter der
     Senatsturm (34 m) mit grünem Zeltdach.
   - GUM (1890–1893, Pomeranzew/Schuchow): 242 m lange Fassade im
     neurussischen Stil aus hellem Marmor und Kalkstein, Sockel aus rotem
     finnischem Granit, drei Geschosse mit Bogenfenstern, kleine Türmchen
     mit grünen Dächern, in der Mitte ein hohes Portal.
   - DENKMAL für Minin und Poscharski (1818, Bronze auf Granit, 8,8 m):
     Minin steht und zeigt auf den Kreml, Fürst Poscharski sitzt mit
     Schild und Schwert.
   - TYPISCH: im Winter ein Markt auf dem Platz (Holzbuden): MATRJOSCHKA
     (Holzpuppen ineinander), TEE aus dem SAMOWAR im Teeglas mit
     Metallhalter, PELMENI mit Schmand, Tulaer LEBKUCHEN (Prjanik),
     Kringel (Baranki); die PELZMÜTZE mit Ohrenklappen (Uschanka), das
     bunte Kopftuch aus Pawlowski Possad; graue NEBELKRÄHEN.
   - LICHT: Ende Februar, früher Nachmittag; die Sonne steht tief im
     Südwesten (rechts, knapp hinter dem Betrachter, 20° hoch): Was nach
     rechts schaut, leuchtet; die Kremlmauer zeigt zum Platz und liegt
     im Schatten, ihr Schatten fällt nach links auf den Platz. Schnee auf
     Dächern, Simsen, Zinnen und Fichten; der Platz ist geräumt.
   Maßstab: Augenhöhe 1,7 m, Horizont y = 172, Brennweite F = 560
   (d = Entfernung, l = seitlich, Meter): x = 200 + F·l/d,
   y = 172 + F·(1,7 − h)/d. Kathedrale in 365 m (1,53 Einheiten je
   Meter), Spasski-Turm in 288 m, Mausoleum in 150 m, Marktstand in 21 m,
   Touristin in 16,5 m, Krähe in 11,5 m.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "moskau", titel: "Moskau", emoji: "🕌", thema: "Länder", kuerzel: "msk", fassung: 854, breite: 400, hoehe: 260 });
const rnd = zufall(1561);
const r = B.r;
const F = 560, HOR = 172, EYE = 1.7;
const X = (d, l) => 200 + F * l / d;
const Y = (d, h = 0) => HOR + F * (EYE - h) / d;
const P = (d, l, h = 0) => `${r(X(d, l))} ${r(Y(d, h))}`;
/* Vielecke und Linien werden auf das Bild (0…400 × 0…260) beschnitten — nichts ragt hinaus */
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
const poly = (pts, fill, extra = "") => { const q = klipp(pts); return q.length > 2 ? `<path d="M${q.join(" L")}Z" fill="${fill}"${extra}/>` : ""; };
const strecke = (a, b) => {   /* Linie a→b auf das Bild beschnitten */
  let [x1, y1] = a.split(" ").map(Number), [x2, y2] = b.split(" ").map(Number), t0 = 0, t1 = 1;
  const dx = x2 - x1, dy = y2 - y1;
  for (const [p, q] of [[-dx, x1 - BOX[0]], [dx, BOX[2] - x1], [-dy, y1 - BOX[1]], [dy, BOX[3] - y1]]) {
    if (p === 0) { if (q < 0) return ""; continue; }
    const t = q / p; if (p < 0) { if (t > t1) return ""; if (t > t0) t0 = t; } else { if (t < t0) return ""; if (t < t1) t1 = t; }
  }
  return `M${r(x1 + t0 * dx)} ${r(y1 + t0 * dy)} L${r(x1 + t1 * dx)} ${r(y1 + t1 * dy)}`;
};
/* Figuren klein halten: Koordinaten ganzzahlig (in Figur-Zentimetern) */
const kompakt = (svg, Q = 1) => {
  const rund = (n) => { const v = Math.round(+n / Q) * Q; return String(v === 0 ? 0 : v); };
  return svg.replace(/ d="([^"]+)"/g, (a, p) => ` d="${p.replace(/-?\d*\.?\d+/g, rund)}"`)
    .replace(/ (x|y|x1|y1|x2|y2|cx|cy|fx|fy)="(-?\d*\.?\d+)"/g, (a, k, n) => ` ${k}="${rund(n)}"`);
};

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("weichs")}" x="-20%" y="-60%" width="140%" height="220%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation=".35"/></filter>`);
S.def(`<filter id="${S.id("dunst")}" x="-5%" y="-30%" width="110%" height="160%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation=".5"/></filter>`);

/* Stoffe */
const ZIEGEL_L = S.lg("ziegl", [[0, "#c8644a"], [1, "#d97c5c"]], 0, 0, 1, 0);      /* zur Sonne */
const ZIEGEL_M = S.lg("ziegm", [[0, "#a9493a"], [1, "#b8563f"]], 0, 0, 1, 0);      /* von vorn, Streiflicht */
const ZIEGEL_S = S.lg("ziegs", [[0, "#6c3434"], [1, "#7b3b36"]], 0, 0, 1, 0);      /* Schattenseite */
const WEISS_L = "#f6efe2", WEISS_M = "#e6dccb", WEISS_S = "#b9b3b8";
const GRUEN_L = "#5d9b78", GRUEN_M = "#3f7a5c", GRUEN_S = "#2a5141";
const GOLD = S.lg("gold", [[0, "#fff1b0"], [0.45, "#e9bd4c"], [1, "#9a6a14"]], 0, 0, 1, 1);
const SCHNEE = "#f8fbff", SCHNEE_S = "#c9d6e8";
/* Rundung: Licht kommt von rechts (Sonne im Südwesten) */
const RUND = S.lg("rund", [[0, "#1e1430", 0.5], [0.35, "#1e1430", 0.12], [0.72, "#fff8e8", 0.18], [0.9, "#fff8e8", 0.05], [1, "#1e1430", 0.25]], 0, 0, 1, 0);
const ZWIEBEL_LICHT = S.rg("zwlicht", [[0, "#fffef6", 0.55], [0.3, "#fffef6", 0.08], [0.62, "#000", 0], [1, "#140a24", 0.5]], 0.68, 0.36, 0.72);

/* =====================================================================
   KULISSE — Winterhimmel, Wolken, ferne Stadt, Kremlbäume, Senat
   ===================================================================== */
S.hinten(`<rect width="400" height="182" fill="${S.lg("himmel", [[0, "#5f8fc4"], [0.45, "#93b7da"], [0.8, "#d9e2e6"], [1, "#f1e3cf"]])}"/>`);
/* die tiefe Sonne steht rechts außerhalb des Bildes */
S.hinten(`<rect width="400" height="182" fill="${S.rg("sonne", [[0, "#fff1d2", 0.85], [0.35, "#ffe9c4", 0.35], [1, "#ffe9c4", 0]], 1.05, 0.62, 0.75)}"/>`);
{
  /* Kumuluswolken: klare Formen, Licht von rechts, kühle Unterseite */
  /* Kumulus aus runden Ballen: kühle Schattenseite links unten, Sonne von rechts */
  const WS = S.lg("wks", [[0, "#aeb8cf"], [1, "#c9d0e0"]]), WL = S.lg("wkl", [[0, "#eef1f7"], [0.6, "#ffffff"], [1, "#fff6e8"]], 0, 0, 1, 0);
  const wolke = (x, y, w, h, seed) => {
    const z = zufall(seed), n = 7 + Math.floor(z() * 4), ball = [];
    for (let i = 0; i < n; i++) { const t = (i + 0.5) / n, rr = h * (0.22 + 0.5 * Math.pow(Math.sin(Math.PI * t), 1.5)) * (0.7 + z() * 0.6); ball.push([x - w / 2 + t * w + (z() - 0.5) * 2, y - rr * (0.6 + z() * 0.4), rr]); }
    for (let i = 0; i < 3; i++) { const t = 0.3 + z() * 0.4, rr = h * (0.3 + z() * 0.25); ball.push([x - w / 2 + t * w, y - h * 0.55 - rr * 0.5, rr]); }
    const kreise = (dx, dy, f) => ball.map(([cx, cy, rr]) => `M${r(cx + dx - rr * f)} ${r(cy + dy)} a${r(rr * f)} ${r(rr * f)} 0 1 0 ${r(2 * rr * f)} 0 a${r(rr * f)} ${r(rr * f)} 0 1 0 ${r(-2 * rr * f)} 0`).join("");
    let g = `<path d="${kreise(0, 0, 1)}M${r(x - w / 2)} ${r(y - h * 0.3)} h${w} v${r(h * 0.3)} h${-w}Z" fill="${WS}"/>`;
    g += `<path d="${kreise(h * 0.12, -h * 0.12, 0.86)}" fill="${WL}"/>`;
    g += `<path d="${kreise(h * 0.22, -h * 0.2, 0.55)}" fill="#fff" opacity=".7"/>`;
    return g;
  };
  S.hinten(wolke(70, 40, 46, 10, 3) + wolke(158, 26, 26, 6, 9) + wolke(338, 66, 40, 8, 21) + wolke(392, 34, 22, 6, 33));
  /* zarte Schleierwolken am Horizont */
  S.hinten(`<path d="M0 128 Q60 124 120 127 T240 125 T400 128 L400 132 Q300 130 200 132 T0 133 Z" fill="#fff" opacity=".35" filter="url(#${S.id("dunst")})"/>`);
}
{
  /* Ferne Stadt hinter der Kathedrale (Samoskworetschje jenseits der Moskwa), im Dunst */
  let g = "";
  const rz = zufall(77);
  for (let x = 120; x < 262; x += 3 + rz() * 4) {
    const w = 3 + rz() * 6, h = 4 + rz() * 7;
    g += `<rect x="${r(x)}" y="${r(175 - h)}" width="${r(w)}" height="${r(h)}" fill="${rz() < 0.5 ? "#a9b0c0" : "#b6bccb"}"/><rect x="${r(x)}" y="${r(175 - h)}" width="${r(w)}" height=".7" fill="#eef2f8"/>`;
  }
  /* ein ferner Kirchturm mit Goldkuppel und ein Hochhaus im Dunst */
  g += `<rect x="236" y="160" width="2.4" height="15" fill="#a3aabb"/><path d="M235.6 160 Q237.2 156.6 238.8 160 Z" fill="#d8bf7a"/><path d="M237.2 156.8 V155" stroke="#d8bf7a" stroke-width=".3"/>`;
  g += `<path d="M128 175 V158 h5 V152 h3 V146 h1 V152 h3 V158 h5 V175 Z" fill="#a7aebf" opacity=".85"/>`;
  S.hinten(`<g opacity=".9">${g}</g><rect x="0" y="146" width="400" height="30" fill="${S.lg("ferne", [[0, "#dfe6ef", 0], [1, "#e9eef4", 0.55]])}"/>`);
}
{
  /* Hinter der Kremlmauer: verschneite Baumkronen und der gelbe Senatspalast (rechts) */
  let g = "";
  const rz = zufall(5);
  for (let x = 262; x < 400; x += 2.5 + rz() * 3) {
    const y = 152 - (x - 262) * 0.12 - rz() * 5, rr = 2.5 + rz() * 3;
    g += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(rr)}" fill="#8b8a9a"/><circle cx="${r(x + 0.6)}" cy="${r(y - rr * 0.5)}" r="${r(rr * 0.6)}" fill="#e9eef6"/>`;
  }
  S.hinten(g);
  /* Senatspalast (gelb, weiße Säulen, grünes Dach mit Schnee) — Teil liegt hinter der Mauer */
  let s = `<path d="M352 138 L400 128 L400 168 L352 168 Z" fill="${S.lg("senat", [[0, "#e7c27c"], [1, "#d7ad62"]], 0, 0, 1, 0)}"/>`;
  s += `<path d="M352 138 L400 128 L400 124 L354 135 Z" fill="#7d9c8a"/><path d="M352 137.6 L400 127.6" stroke="${SCHNEE}" stroke-width="1.1"/>`;
  for (let i = 0; i < 8; i++) { const x = 356 + i * 5.6, y0 = 137.2 - (x - 352) * 0.208; s += `<rect x="${r(x)}" y="${r(y0 + 3)}" width="1.6" height="4" fill="#5a6476"/><rect x="${r(x)}" y="${r(y0 + 10)}" width="1.6" height="4" fill="#5a6476"/>`; }
  S.hinten(s);
}
{
  /* Moskworezki-Turm (Beklemischew-Turm, 46 m, rund, an der Moskwa) und die Mauer dorthin */
  const d = 420, l = 45, s = F / d, x = X(d, l), y = Y(d);
  let g = `<path d="M${r(X(296, 40))} ${r(Y(296, 10))} L${r(X(d, l))} ${r(Y(d, 10))} L${r(X(d, l))} ${r(Y(d))} L${r(X(296, 40))} ${r(Y(296))} Z" fill="#8f5a52"/>`;
  g += `<g transform="translate(${r(x)} ${r(y)}) scale(${s.toFixed(4)})">`;
  g += `<rect x="-6" y="-24" width="12" height="24" fill="${S.lg("bek", [[0, "#7c4a46"], [0.7, "#b06f5e"], [1, "#8d5a50"]], 0, 0, 1, 0)}"/>`;
  g += `<path d="M-6.6 -24 h13.2 v-2 h-13.2 Z" fill="#c7a99c"/><path d="M-4.2 -26 h8.4 v-6 h-8.4 Z" fill="#a8695a"/>`;
  g += `<path d="M-4.6 -32 L0 -44 L4.6 -32 Z" fill="${S.lg("bekz", [[0, "#3c6550"], [0.7, "#6f9f84"], [1, "#4b7660"]], 0, 0, 1, 0)}"/><path d="M0 -44 V-46" stroke="#d9b45a" stroke-width=".5"/>`;
  g += `<path d="M-6.6 -24 h13.2 M-4.6 -32 h9.2" stroke="${SCHNEE}" stroke-width=".9"/></g>`;
  S.hinten(`<g opacity=".92">${g}</g>`);
}

/* =====================================================================
   1 — DER ROTE PLATZ (Pflaster, Schnee, Schatten der Mauer)
   ===================================================================== */
{
  let k = `<path d="M0 ${r(Y(104))} L${r(X(277, -38))} ${r(Y(277))} L${r(X(350, -20))} ${r(Y(350))} L${r(X(350, 30))} ${r(Y(350))} L${r(X(288.5, 38))} ${r(Y(288.5))} L${r(X(106, 38))} ${r(Y(106))} L400 ${r(Y(106))} L400 260 L0 260 Z" fill="${S.lg("pflaster", [[0, "#8e8c93"], [0.25, "#6f6c74"], [1, "#4b474e"]])}"/>`;
  /* Pflasterreihen in Flucht: Längslinien zum Fluchtpunkt, Querreihen dichter in der Ferne */
  let lin = "";
  for (let l = -37; l <= 37; l += 1.6) lin += strecke(P(11, l), P(300, l));
  k += `<path d="${lin}" stroke="#35323a" stroke-width=".22" opacity=".45"/>`;
  let q = "";
  for (let d = 11; d < 200; d *= 1.045) q += `M${r(Math.max(0, X(d, -38)))} ${r(Y(d))} L${r(Math.min(400, X(d, 38)))} ${r(Y(d))}`;
  k += `<path d="${q}" stroke="#2f2c33" stroke-width=".18" opacity=".5"/>`;
  /* die hellen Steinbänder des Platzes (alle 12 m) */
  let hb = "";
  for (const d of [12, 24, 36, 48, 60, 72, 84, 96, 108, 132, 156, 180]) hb += `M${r(Math.max(0, X(d, -38)))} ${r(Y(d))} L${r(Math.min(400, X(d, 38)))} ${r(Y(d))}`;
  k += `<path d="${hb}" stroke="#a9a6ad" stroke-width=".55" opacity=".55"/>`;
  /* Steinkörnung im Vordergrund */
  let st = "";
  for (let i = 0; i < 260; i++) {
    const d = 11 + rnd() * 30, l = -16 + rnd() * 40, x = X(d, l), y = Y(d);
    if (x > 2 && x < 396) st += `M${r(x)} ${r(y)} h${r(0.4 + 24 / d)}`;
  }
  k += `<path d="${st}" stroke="#9a97a0" stroke-width=".35" opacity=".35"/>`;
  /* Glanz der nassen Steine zur Sonne hin (rechts) */
  k += `<path d="M200 ${HOR + 4} L400 ${HOR + 30} L400 260 L230 260 Z" fill="${S.lg("glanz", [[0, "#ffe9c8", 0], [1, "#ffe9c8", 0.16]], 0, 0, 1, 0)}"/>`;
  /* Schatten der Kremlmauer (12 m, Sonne 20° hoch → 33 m nach links) */
  k += poly([P(20, 5), P(288.5, 5), P(288.5, 38), P(20, 38)], "#1b2247", ` opacity=".3"`);
  /* Zinnen-Zähne am Schattenrand (nur nah sichtbar) */
  let zz = "";
  for (let d = 106; d < 200; d += 3) zz += `M${P(d, 5)} L${P(d + 0.1, 3.6)} L${P(d + 2.1, 3.6)} L${P(d + 2.1, 5)}Z`;
  k += `<path d="${zz}" fill="#1b2247" opacity=".3"/>`;
  /* Schnee: geräumte Haufen an der GUM-Seite, Reste im Pflaster */
  k += poly([P(100, -38), P(277, -38), P(277, -36), P(100, -36.2)], SCHNEE);
  k += poly([P(100, -36.2), P(277, -36), P(277, -35.5), P(100, -35.6)], SCHNEE_S, ` opacity=".7"`);
  /* festgetretene Schneereste: unregelmäßig, weicher Rand, Kanten bläulich */
  const fleck = (d, l, w, t) => {
    const n = 12, s0 = Math.round(d * 7 + l * 13);
    const pt = (f) => { const p = []; for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, rr = (0.7 + (((i + s0) * 7919) % 13) / 30) * f; p.push(P(d + Math.sin(a) * t * rr, l + Math.cos(a) * w * rr)); } return p; };
    return poly(pt(1), "#c9d4e6", ` filter="url(#${S.id("weichs")})"`) + poly(pt(0.82), SCHNEE, ` opacity=".9" filter="url(#${S.id("weichs")})"`);
  };
  k += fleck(12.6, -5.5, 3.2, 1.2) + fleck(15.5, 10, 2.6, 1.1) + fleck(25, -13, 4.5, 2.2) + fleck(31, 13, 3.4, 2.4) + fleck(46, -24, 5, 4) + fleck(70, 21, 4, 6) + fleck(11.8, 3.2, 1.4, 0.5) + fleck(38, -1, 2, 2);
  /* Schlagschatten der Dinge im Vordergrund (zur Bodenfläche) — Sonne rechts, knapp hinten */
  const schlag = (d, l, breite, lang, a = 0.32) => poly([P(d - 0.15, l + breite / 2), P(d + 0.15, l + breite / 2), P(d + 0.5, l - lang), P(d + 0.2, l - lang - 0.3), P(d - 0.15, l - breite / 2)], "#1b2247", ` opacity="${a}" filter="url(#bw_weich)"`);
  k += poly([P(21, -3.7), P(23.6, -3.7), P(24.6, -13.3), P(21, -13.3)], "#1b2247", ` opacity=".3"`);    /* Marktstand */
  k += schlag(19.5, -2.7, 0.5, 4.8) + schlag(16.5, 3.4, 0.45, 4.5) + schlag(11.5, 0.6, 0.18, 0.9, 0.25);
  S.teil({ id: "roter_platz", de: "der Rote Platz", syl: "RO-te PLATZ", it: "la Piazza Rossa", itSyl: "PIAZ-za ROS-sa", en: "Red Square", x: 0, y: 0, kunst: k,
    tipp: "„Krasnaja“ heißt auf Altrussisch auch „schön“: Der Rote Platz ist also der schöne Platz." });
}

/* =====================================================================
   2 — DIE BASILIUSKATHEDRALE (in Metern, 1,53 Einheiten je Meter)
   ===================================================================== */
const KB = { d: 365, l: -10 };
const KX = r(X(KB.d, KB.l)), KY = r(Y(KB.d)), KS = F / KB.d;
const KG = (svg) => `<g transform="translate(${KX} ${KY}) scale(${KS.toFixed(4)})">${svg}</g>`;
const KP = (u, h) => ({ x: r(KX + u * KS), y: r(KY - h * KS) });
let zwId = 0;
/* Zwiebelkuppel: Fuß bei (cx, -y0), Breite w, Höhe h; Muster je Kuppel anders */
function zwiebel(cx, y0, w, h, art, f1, f2) {
  const p = (a, b) => `${r(cx + a * w)} ${r(-y0 - b * h)}`;
  const kurve = (t) => [[-0.3 * t, 0], [-0.62 * t, 0.1], [-0.6 * t, 0.5], [-0.2 * t, 0.76], [-0.08 * t, 0.85], [-0.02 * t, 0.9], [0, 1]];
  const d = `M${p(-0.3, 0)} C${p(-0.62, 0.1)} ${p(-0.6, 0.5)} ${p(-0.2, 0.76)} C${p(-0.08, 0.85)} ${p(-0.02, 0.9)} ${p(0, 1)} C${p(0.02, 0.9)} ${p(0.08, 0.85)} ${p(0.2, 0.76)} C${p(0.6, 0.5)} ${p(0.62, 0.1)} ${p(0.3, 0)} Z`;
  const id = S.id("zw" + (zwId++));
  S.def(`<clipPath id="${id}"><path d="${d}"/></clipPath>`);
  let g = `<path d="${d}" fill="${f1}"/><g clip-path="url(#${id})">`;
  if (art === "spirale") {
    let s = "";
    for (let i = -7; i <= 7; i++) { const x = cx + i * w * 0.16; s += `M${r(x - w * 0.5)} ${r(-y0 + 0.5)} Q${r(x + w * 0.1)} ${r(-y0 - h * 0.45)} ${r(x + w * 0.45)} ${r(-y0 - h * 1.05)}`; }
    g += `<path d="${s}" stroke="${f2}" stroke-width="${r(w * 0.075)}" fill="none"/>`;
  } else if (art === "zickzack") {
    let s = "";
    for (let j = 0; j < 7; j++) {
      const y = -y0 - h * (0.08 + j * 0.13); s += `M${r(cx - w * 0.7)} ${r(y)}`;
      for (let i = 0; i < 10; i++) s += ` L${r(cx - w * 0.7 + (i + 0.5) * w * 0.14)} ${r(y - (i % 2 ? 0 : h * 0.06))}`;
    }
    g += `<path d="${s}" stroke="${f2}" stroke-width="${r(h * 0.045)}" fill="none" stroke-linejoin="miter"/>`;
  } else if (art === "rippen") {
    const ts = [-1, -0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75, 1];
    for (let i = 0; i < ts.length - 1; i += 2) {
      const a = kurve(ts[i]), b = kurve(ts[i + 1]).reverse();
      const pa = a.map(([u, v]) => p(u, v)), pb = b.map(([u, v]) => p(u, v));
      g += `<path d="M${pa[0]} C${pa[1]} ${pa[2]} ${pa[3]} C${pa[4]} ${pa[5]} ${pa[6]} L${pb[0]} C${pb[1]} ${pb[2]} ${pb[3]} C${pb[4]} ${pb[5]} ${pb[6]} Z" fill="${f2}"/>`;
    }
  } else if (art === "rauten") {
    /* Rauten mit Spitzen (wie ein Tannenzapfen): helle obere Hälfte, dunkle untere */
    let s1 = "", s2 = "";
    const sw = w * 0.16, sh = h * 0.13;
    for (let j = 0; j < 9; j++) for (let i = -5; i <= 5; i++) {
      const x = cx + i * sw + (j % 2 ? sw / 2 : 0), y = -y0 - j * sh * 0.82;
      s1 += `M${r(x - sw / 2)} ${r(y)} L${r(x)} ${r(y - sh / 2)} L${r(x + sw / 2)} ${r(y)}Z`;
      s2 += `M${r(x - sw / 2)} ${r(y)} L${r(x + sw / 2)} ${r(y)} L${r(x)} ${r(y + sh / 2)}Z`;
    }
    g += `<path d="${s2}" fill="${f2}"/><path d="${s1}" fill="#fff" opacity=".22"/>`;
    for (let j = 0; j < 9; j += 2) g += `<circle cx="${r(cx + w * 0.1)}" cy="${r(-y0 - j * sh * 0.82 - sh * 0.1)}" r="${r(w * 0.035)}" fill="#ffe9a0"/>`;
  } else if (art === "winkel") {
    let s = "";
    for (let j = 0; j < 8; j++) { const y = -y0 - h * (0.02 + j * 0.12); s += `M${r(cx - w * 0.7)} ${r(y - h * 0.12)} L${cx} ${r(y)} L${r(cx + w * 0.7)} ${r(y - h * 0.12)}`; }
    g += `<path d="${s}" stroke="${f2}" stroke-width="${r(h * 0.05)}" fill="none"/>`;
  }
  g += `</g><path d="${d}" fill="${ZWIEBEL_LICHT}"/>`;
  /* Glanzlicht rechts oben (Sonne) und Hals mit Goldring */
  g += `<path d="M${p(0.12, 0.66)} Q${p(0.38, 0.5)} ${p(0.36, 0.22)}" stroke="#fffdf2" stroke-width="${r(w * 0.05)}" opacity=".55" fill="none" stroke-linecap="round"/>`;
  g += `<rect x="${r(cx - w * 0.31)}" y="${r(-y0 - 0.1)}" width="${r(w * 0.62)}" height="${r(Math.max(0.5, h * 0.06))}" fill="${GOLD}"/>`;
  return g;
}
/* orthodoxes Kreuz (drei Querbalken, der untere schräg) in Gold */
function kreuz(cx, y0, s) {
  return `<path d="M${cx} ${r(-y0)} V${r(-y0 - 3.2 * s)} M${r(cx - 0.45 * s)} ${r(-y0 - 2.75 * s)} H${r(cx + 0.45 * s)} M${r(cx - 0.9 * s)} ${r(-y0 - 2.1 * s)} H${r(cx + 0.9 * s)} M${r(cx - 0.6 * s)} ${r(-y0 - 0.8 * s)} L${r(cx + 0.6 * s)} ${r(-y0 - 1.25 * s)}" stroke="#d9a93a" stroke-width="${r(0.28 * s * 10) / 10}" stroke-linecap="round"/>` +
    `<path d="M${r(cx + 0.12 * s)} ${r(-y0 - 0.3)} V${r(-y0 - 3 * s)}" stroke="#fff0b8" stroke-width="${r(0.1 * s * 10) / 10}"/>`;
}
/* Achteckiger Turm: drei sichtbare Seiten (links Schatten, Mitte Streiflicht, rechts Sonne) */
function achteck(cx, w, y0, y1, fl = ZIEGEL_S, fm = ZIEGEL_M, fr = ZIEGEL_L) {
  const a = w * 0.207, b = w / 2;
  return `<path d="M${r(cx - b)} ${-y0} L${r(cx - a)} ${-y0} L${r(cx - a)} ${-y1} L${r(cx - b)} ${-y1} Z" fill="${fl}"/>` +
    `<rect x="${r(cx - a)}" y="${-y1}" width="${r(2 * a)}" height="${r(y1 - y0)}" fill="${fm}"/>` +
    `<path d="M${r(cx + a)} ${-y0} L${r(cx + b)} ${-y0} L${r(cx + b)} ${-y1} L${r(cx + a)} ${-y1} Z" fill="${fr}"/>`;
}
const KOKL = S.lg("kokl", [[0, "#1e1430", 0.35], [0.5, "#000", 0], [1, "#fff6e0", 0.2]], 0, 0, 1, 0);
/* Kokoschniks: Reihe von Kielbögen (spitz zulaufende Giebel) */
function kokoschniks(cx, w, y, h, n, fill = ZIEGEL_M) {
  let s = "", o = "";
  for (let i = 0; i < n; i++) {
    const a = cx - w / 2 + i * w / n, b = a + w / n, m = (a + b) / 2, ww = b - a;
    s += `M${r(a)} ${-y} C${r(a)} ${r(-y - h * 0.55)} ${r(m - ww * 0.12)} ${r(-y - h * 0.5)} ${r(m)} ${r(-y - h)} C${r(m + ww * 0.12)} ${r(-y - h * 0.5)} ${r(b)} ${r(-y - h * 0.55)} ${r(b)} ${-y}Z`;
    const ia = a + ww * 0.18, ib = b - ww * 0.18;
    o += `M${r(ia)} ${r(-y)} C${r(ia)} ${r(-y - h * 0.45)} ${r(m - ww * 0.08)} ${r(-y - h * 0.42)} ${r(m)} ${r(-y - h * 0.78)} C${r(m + ww * 0.08)} ${r(-y - h * 0.42)} ${r(ib)} ${r(-y - h * 0.45)} ${r(ib)} ${r(-y)}`;
  }
  return `<path d="${s}" fill="${fill}" stroke="${WEISS_M}" stroke-width=".35"/><path d="${o}" fill="#e9dccb" opacity=".55"/>` +
    `<path d="${s}" fill="${KOKL}"/>`;
}
/* Trommel (Tambour) unter der Kuppel: Zylinder mit Blendbögen */
function trommel(cx, w, y0, y1, n = 5) {
  let g = `<rect x="${r(cx - w / 2)}" y="${-y1}" width="${r(w)}" height="${r(y1 - y0)}" fill="${ZIEGEL_M}"/><rect x="${r(cx - w / 2)}" y="${-y1}" width="${r(w)}" height="${r(y1 - y0)}" fill="${RUND}"/>`;
  let a = "";
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n, x = cx + Math.sin((t - 0.5) * Math.PI) * w / 2 * 0.9, bw = w / n * 0.45 * Math.cos((t - 0.5) * Math.PI);
    a += `M${r(x - bw / 2)} ${r(-y0 - 0.5)} V${r(-y1 + (y1 - y0) * 0.35)} Q${r(x)} ${r(-y1 + 0.3)} ${r(x + bw / 2)} ${r(-y1 + (y1 - y0) * 0.35)} V${r(-y0 - 0.5)}`;
  }
  g += `<path d="${a}" stroke="${WEISS_L}" stroke-width=".32" fill="#5f2c2a" fill-opacity=".45"/>`;
  g += `<rect x="${r(cx - w / 2 - 0.3)}" y="${r(-y1 - 0.5)}" width="${r(w + 0.6)}" height=".6" fill="${WEISS_L}"/><rect x="${r(cx - w / 2 - 0.3)}" y="${r(-y1 - 0.5)}" width="${r(w + 0.6)}" height=".25" fill="${SCHNEE}"/>`;
  return g;
}
/* Eine Kapelle mit Turm, Kokoschniks, Trommel und Kuppel */
function kapelle(c) {
  const { u, w, top, art, f1, f2 } = c;
  const body1 = top * 0.46, koko = body1 + top * 0.075, tr = koko + top * 0.15, kh = top * 0.23;
  let g = achteck(u, w, 10, body1);
  /* weiße Pilaster an den Kanten, ein Gesims, schmale Fenster */
  const a = w * 0.207;
  g += `<path d="M${r(u - a)} -10 V${r(-body1)} M${r(u + a)} -10 V${r(-body1)}" stroke="${WEISS_M}" stroke-width=".45"/>`;
  g += `<rect x="${r(u - w / 2)}" y="${r(-body1 * 0.72)}" width="${w}" height=".55" fill="${WEISS_M}"/>`;
  g += `<path d="M${r(u - 0.45)} ${r(-body1 * 0.66)} v-2.2 q.45 -.7 .9 0 v2.2 Z" fill="#2c1a22" stroke="${WEISS_L}" stroke-width=".25"/>`;
  g += kokoschniks(u, w, body1, top * 0.085, 3);
  g += achteck(u, w * 0.78, body1 + top * 0.02, koko);
  g += kokoschniks(u, w * 0.78, koko, top * 0.07, 3);
  g += trommel(u, w * 0.56, koko + top * 0.03, tr, 6);
  g += zwiebel(u, tr, w * 0.92, kh, art, f1, f2);
  g += kreuz(u, tr + kh, top > 40 ? 1 : 0.8);
  /* Schnee auf den Gesimsen */
  g += `<path d="M${r(u - w / 2)} ${r(-body1)} h${w} M${r(u - w * 0.39)} ${r(-koko)} h${r(w * 0.78)}" stroke="${SCHNEE}" stroke-width=".45" opacity=".9"/>`;
  return g;
}
const unterKathedrale = [];
{
  let k = "";
  /* Glockenturm (links hinten): viereckig, offene Bögen, grünes Zeltdach */
  {
    const u = -31;
    k += `<rect x="${u - 4}" y="-15" width="8" height="15" fill="${ZIEGEL_M}"/><rect x="${u - 4}" y="-15" width="2" height="15" fill="${ZIEGEL_S}"/>`;
    k += achteck(u, 8, 15, 23, ZIEGEL_S, ZIEGEL_M, ZIEGEL_L);
    for (const dx of [-1.7, 0, 1.7]) k += `<path d="M${r(u + dx - 0.6)} -16 v-4.6 q.6 -1.2 1.2 0 v4.6 Z" fill="#2b1820"/><path d="M${r(u + dx - 0.35)} -19.6 q.35 -.5 .7 0 v.7 h-.7 Z" fill="#c69c46"/>`;
    k += `<rect x="${u - 4.3}" y="-23.6" width="8.6" height=".8" fill="${WEISS_L}"/><rect x="${u - 4.3}" y="-23.9" width="8.6" height=".35" fill="${SCHNEE}"/>`;
    k += `<path d="M${u - 3.8} -23.6 L${u - 0.2} -33 L${u - 1.6} -23.6 Z" fill="${GRUEN_S}"/><path d="M${u - 1.6} -23.6 L${u - 0.2} -33 L${u + 0.2} -33 L${u + 1.6} -23.6 Z" fill="${GRUEN_M}"/><path d="M${u + 1.6} -23.6 L${u + 0.2} -33 L${u + 3.8} -23.6 Z" fill="${GRUEN_L}"/>`;
    k += `<path d="M${u - 1.6} -23.6 L${u - 0.2} -33 M${u + 1.6} -23.6 L${u + 0.2} -33" stroke="#9cc7ad" stroke-width=".18"/>`;
    k += `<path d="M${u - 1.6} -27 l.6 -1.6 l.6 1.6 Z M${u + 0.4} -29 l.5 -1.3 l.5 1.3 Z" fill="${WEISS_L}"/>`;
    k += zwiebel(u, 33, 1.8, 2.2, "glatt", GOLD, GOLD) + kreuz(u, 35.2, 0.6);
    unterKathedrale.push({ id: "glockenturm", de: "der Glockenturm", syl: "GLO-cken-turm", it: "il campanile", itSyl: "cam-pa-NI-le", en: "bell tower",
      x: KP(u, 0).x, y: KP(u, 0).y, kunst: flaeche(-5 * KS, -36 * KS, 10 * KS, 36 * KS, 0.6) });
  }
  /* Sockel und Galerien (0–11 m): weißer Steinsockel, Backstein mit Bogenfenstern, Schneedach.
     Die Galerie knickt an der Nordwestecke: links die Nordseite (Streiflicht), rechts die Westseite (Sonne). */
  k += `<path d="M-27 0 V-4 H28 V0 Z" fill="${WEISS_M}"/><path d="M4 0 V-4 H28 V0 Z" fill="${WEISS_L}"/><path d="M-27 -4 H28 V-3.4 H-27 Z" fill="#fffaf0"/>`;
  k += `<path d="M-27 -4 V-10.5 H4 V-4 Z" fill="${ZIEGEL_M}"/><path d="M4 -4 V-10.5 H28 V-4 Z" fill="${ZIEGEL_L}"/><path d="M-27 -4 V-10.5 H-22 V-4 Z" fill="${ZIEGEL_S}"/>`;
  k += `<path d="M4 0 V-10.5" stroke="#fff3df" stroke-width=".5"/>`;
  let bg = "";
  for (let u = -25.5; u < 26; u += 3.3) if (Math.abs(u - 4) > 1.2) bg += `M${r(u)} -4.6 V-8 Q${r(u + 0.9)} -9.4 ${r(u + 1.8)} -8 V-4.6 Z`;
  k += `<path d="${bg}" fill="#3a2a3a" stroke="${WEISS_L}" stroke-width=".35"/>`;
  k += `<path d="${bg}" fill="${S.lg("glasgal", [[0, "#9fb4d6", 0.35], [1, "#fff", 0]])}"/>`;
  let fs = "";
  for (let u = -25, i = 0; u < 27; u += 4.2, i++) fs += `M${r(u)} -1.1 v-1.5 q.5 -.6 1 0 v1.5 Z`;
  k += `<path d="${fs}" fill="#4a3a40"/>`;
  k += `<path d="M-28 -10.5 L-26 -12 L27 -12 L29 -10.5 Z" fill="${SCHNEE}"/><path d="M-28 -10.5 L29 -10.5 L29 -10 L-28 -10 Z" fill="${SCHNEE_S}"/>`;
  /* Kapellen von hinten nach vorn */
  k += kapelle({ u: 8, w: 9, top: 43, art: "rippen", f1: "#e0b13a", f2: "#3f7f4f" });          /* Süd (Nikolaus) */
  k += kapelle({ u: -21, w: 9.5, top: 42, art: "spirale", f1: "#3e8a57", f2: "#e7863a" });     /* Ost (Dreifaltigkeit): Grün-Orange */
  k += kapelle({ u: 18.5, w: 6.4, top: 34, art: "zickzack", f1: "#c9403a", f2: "#3f8a55" });  /* Südwest */
  /* Mittlerer Turm mit dem ZELTDACH (65 m) */
  {
    let z = achteck(0, 13, 10, 28);
    z += `<rect x="-6.5" y="-21" width="13" height=".6" fill="${WEISS_M}"/>`;
    for (const dx of [-1.2, 1.2]) z += `<path d="M${dx - 0.4} -15 v-3 q.4 -.8 .8 0 v3 Z" fill="#2c1a22" stroke="${WEISS_L}" stroke-width=".25"/>`;
    z += kokoschniks(0, 13, 28, 3.2, 4) + kokoschniks(0, 11.4, 30.6, 2.8, 4, ZIEGEL_L);
    z += achteck(0, 10.5, 31.5, 38.5, "#d9d0c4", "#f1e8da", "#fbf6ee");
    /* weiße Säulchen und Bögen am Tambour */
    let sb = "";
    for (const x of [-4.8, -2.2, 0, 2.2, 4.8]) sb += `M${x} -32 V-37.6`;
    z += `<path d="${sb}" stroke="#c9a96e" stroke-width=".35"/>`;
    z += kokoschniks(0, 10.5, 38.5, 2.2, 6, "#f1e8da");
    /* Zeltdach: drei sichtbare Flächen, weiß-orange Rautenmuster, Sternchen */
    const zt = 59, zb = 40.4, bw = 5.2, tw = 0.9;
    const L = `M${-bw} ${-zb} L${-tw} ${-zt} L${-tw * 0.4} ${-zt} L${-bw * 0.42} ${-zb} Z`;
    const M = `M${-bw * 0.42} ${-zb} L${-tw * 0.4} ${-zt} L${tw * 0.4} ${-zt} L${bw * 0.42} ${-zb} Z`;
    const R = `M${bw * 0.42} ${-zb} L${tw * 0.4} ${-zt} L${tw} ${-zt} L${bw} ${-zb} Z`;
    z += `<path d="${L}" fill="#d8c5ad"/><path d="${M}" fill="#efe1cc"/><path d="${R}" fill="#fbf3e6"/>`;
    S.def(`<clipPath id="${S.id("zelt")}"><path d="M${-bw} ${-zb} L${-tw} ${-zt} L${tw} ${-zt} L${bw} ${-zb} Z"/></clipPath>`);
    /* Rautennetz (rot-braune Fugen) und in jeder Raute ein kleiner Stern (grün/gold) */
    let rt = "", st = "";
    for (let j = 0; j < 12; j++) {
      const y = -zb - j * 1.55, w = bw * (1 - (j * 1.55) / (zt - zb)), n = Math.max(2, Math.round(w / 0.75));
      for (let i = 0; i <= n; i++) { const x = -w + i * 2 * w / n, x2 = -w * 0.92 + (i + 0.5) * 2 * w * 0.92 / n; rt += `M${r(x)} ${r(y)} L${r(x2)} ${r(y - 1.55)}`; if (i < n) rt += `M${r(x + 2 * w / n)} ${r(y)} L${r(x2)} ${r(y - 1.55)}`; if (i < n) st += `<circle cx="${r(x2)}" cy="${r(y - 0.6)}" r=".2" fill="${(i + j) % 2 ? "#3f7f4f" : "#d9a93a"}"/>`; }
    }
    z += `<g clip-path="url(#${S.id("zelt")})"><path d="${rt}" stroke="#b9653a" stroke-width=".16" opacity=".8"/>${st}</g>`;
    z += `<path d="M${-bw * 0.42} ${-zb} L${-tw * 0.4} ${-zt} M${bw * 0.42} ${-zb} L${tw * 0.4} ${-zt}" stroke="#c9b18c" stroke-width=".3"/>`;
    /* kleine „Hörfenster“ im Zelt */
    z += `<path d="M-2.4 -45 l.7 -1.6 l.7 1.6 Z M1.2 -49 l.6 -1.4 l.6 1.4 Z" fill="#d29a3a" stroke="#fff" stroke-width=".15"/>`;
    z += `<rect x="-1.1" y="-61.2" width="2.2" height="2.4" fill="${S.lg("ztr", [[0, "#c9b18c"], [1, "#fff7e8"]], 0, 0, 1, 0)}"/>`;
    z += zwiebel(0, 61.2, 2.8, 2.8, "glatt", GOLD, GOLD) + kreuz(0, 64, 0.62);
    k += z;
    unterKathedrale.push({ id: "zeltdach", de: "das Zeltdach", syl: "ZELT-dach", it: "il tetto a tenda", itSyl: "TET-to a TEN-da", en: "tent roof",
      x: KP(0, 0).x, y: KP(0, 0).y, kunst: flaeche(-5.4 * KS, -66 * KS, 10.8 * KS, 29 * KS, 0.6),
      tipp: "Das spitze Zeltdach in der Mitte ist 65 Meter hoch." });
  }
  k += kapelle({ u: -16, w: 6.4, top: 34, art: "winkel", f1: "#f4efe4", f2: "#c23b34" });        /* Nordost: Rot-Weiß */
  k += kapelle({ u: 21, w: 10, top: 46, art: "spirale", f1: "#3f8a4f", f2: "#f0c43c" });          /* West (Einzug in Jerusalem): größte */
  k += kapelle({ u: -7, w: 9.6, top: 44, art: "zickzack", f1: "#f4f6f8", f2: "#2f61a8" });      /* Nord (Zyprian und Justina): Blau-Weiß */
  k += kapelle({ u: 9, w: 6.6, top: 35, art: "rauten", f1: "#2f7a4f", f2: "#1d5236" });          /* Nordwest: grüne Rauten mit Spitzen */
  unterKathedrale.push({ id: "zwiebelkuppel", de: "die Zwiebelkuppel", syl: "ZWIE-bel-kup-pel", it: "la cupola a cipolla", itSyl: "CU-po-la a ci-POL-la", en: "onion dome",
    x: KP(-7, 0).x, y: KP(-7, 0).y, kunst: flaeche(-5 * KS, -44 * KS, 10 * KS, 12 * KS, 0.6),
    tipp: "Jede Kuppel hat eine andere Farbe und ein anderes Muster." });
  /* Vorbau mit Treppe (Nordseite) und kleinem Zeltdach */
  k += `<path d="M-14 -0.1 V-9 H-8 V-0.1 Z" fill="${ZIEGEL_M}"/><path d="M-14 -0.1 V-9 H-12.8 V-0.1 Z" fill="${ZIEGEL_S}"/><path d="M-12.4 -0.2 V-5.4 Q-11 -7.2 -9.6 -5.4 V-0.2 Z" fill="#33202a" stroke="${WEISS_L}" stroke-width=".35"/>`;
  k += `<path d="M-14.4 -9 L-11 -15 L-7.6 -9 Z" fill="${GRUEN_M}"/><path d="M-11 -15 L-7.6 -9 L-9.8 -9 Z" fill="${GRUEN_L}"/><path d="M-14.4 -9 L-11 -15" stroke="${SCHNEE}" stroke-width=".45"/>`;
  k += zwiebel(-11, 15, 1.5, 1.7, "glatt", GOLD, GOLD);
  /* Luftperspektive: zarter blauer Dunst über allem */
  S.teil({ id: "basiliuskathedrale", de: "die Basiliuskathedrale", syl: "BA-si-li-us-ka-the-dra-le", it: "la Cattedrale di San Basilio", itSyl: "cat-te-DRA-le di san ba-SI-lio", en: "St Basil's Cathedral",
    x: 0, y: 0, kunst: KG(k), zoom: { x: 108, y: 76, w: 153, h: 102 }, unter: unterKathedrale,
    tipp: "Die Basiliuskathedrale hat neun Kapellen. Sie wurde vor fast 500 Jahren gebaut." });
}

/* =====================================================================
   3 — DAS DENKMAL für Minin und Poscharski (vor der Kathedrale)
   ===================================================================== */
{
  const d = 328, l = -13, s = F / d;
  let k = `<g transform="scale(${s.toFixed(4)})">`;
  /* Granitsockel mit Bronzerelief, Schneekante */
  k += `<path d="M-2.6 0 V-4.4 H2.6 V0 Z" fill="${S.lg("sockel", [[0, "#6e6a72"], [0.6, "#a4a0a6"], [1, "#c9c5c8"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-2.9" y="-.5" width="5.8" height=".5" fill="#8a868c"/><rect x="-2.75" y="-4.65" width="5.5" height=".4" fill="#b9b5ba"/><rect x="-2.75" y="-4.85" width="5.5" height=".22" fill="${SCHNEE}"/>`;
  k += `<rect x="-1.9" y="-3.4" width="3.8" height="1.8" fill="#4f5a46"/><path d="M-1.6 -1.8 l.4 -1.2 l.3 1.2 M-.6 -1.8 l.3 -1.3 l.3 1.3 M.5 -1.8 l.4 -1.1 l.3 1.1" stroke="#7b8a66" stroke-width=".18"/>`;
  /* Bronze: Poscharski sitzt (links), Minin steht und zeigt nach rechts zum Kreml */
  const BR = S.lg("bronze", [[0, "#2c3428"], [0.6, "#4f5b44"], [1, "#7a8a5e"]], 0, 0, 1, 0);
  k += `<path d="M-2.1 -4.8 Q-2.2 -6.4 -1.5 -6.8 L-.6 -6.6 Q-.3 -5.6 -.5 -4.8 Z" fill="${BR}"/>`;
  k += `<ellipse cx="-2.15" cy="-5.9" rx=".55" ry=".85" fill="#3a4434" stroke="#6e7c55" stroke-width=".12"/>`;
  k += `<circle cx="-1.1" cy="-7.2" r=".38" fill="${BR}"/><path d="M-1.5 -6.8 L-.6 -6.8 L-.8 -5.4 L-1.6 -5.4 Z" fill="${BR}"/>`;
  k += `<path d="M.1 -4.8 L.4 -7.6 Q.6 -8.3 1.1 -8.2 L1.5 -7.6 L1.6 -4.8 Z" fill="${BR}"/><circle cx=".95" cy="-8.55" r=".38" fill="${BR}"/>`;
  k += `<path d="M1.3 -7.7 L2.7 -8.4" stroke="${BR}" stroke-width=".32" stroke-linecap="round"/><path d="M.3 -7.4 L-.3 -6.4" stroke="${BR}" stroke-width=".3"/>`;
  k += `<path d="M1.5 -7.6 L1.6 -4.9" stroke="#9aaa78" stroke-width=".18" opacity=".7"/></g>`;
  S.teil({ id: "denkmal", de: "das Denkmal", syl: "DENK-mal", it: "il monumento", itSyl: "mo-nu-MEN-to", en: "monument", x: r(X(d, l)), y: r(Y(d)), steht: true, kunst: k,
    tipp: "Das Denkmal zeigt Minin und Poscharski. Es ist über 200 Jahre alt." });
}

/* =====================================================================
   4 — DER SPASSKI-TURM mit Uhr und Stern (in Metern, 1,94 je Meter)
   ===================================================================== */
{
  const d = 288.5, s = F / d, ox = r(X(d, 40)), oy = r(Y(d));
  const SP = (u, h) => ({ x: r(ox + u * s), y: r(oy - h * s) });
  let k = "";
  /* Stockwerk 1 (0–28 m): Vorderseite im Streiflicht, schmale Seite zum Platz im Schatten */
  k += `<path d="M-7.6 0 V-28 H-6.5 V0 Z" fill="${ZIEGEL_S}"/><rect x="-6.5" y="-28" width="13" height="28" fill="${ZIEGEL_M}"/>`;
  k += `<rect x="-6.5" y="-28" width="13" height="28" fill="${S.lg("spw", [[0, "#000", 0.08], [0.7, "#fff1d8", 0.05], [1, "#fff1d8", 0.18]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-7.6" y="-1.4" width="14.1" height="1.4" fill="${WEISS_M}"/><rect x="-7.6" y="-9.4" width="14.1" height=".5" fill="${WEISS_M}"/>`;
  /* weiße Blendnischen und der Bogenfries */
  for (const u of [-3.4, 3.4]) k += `<path d="M${u - 1.1} -12 V-18.5 Q${u} -20.2 ${u + 1.1} -18.5 V-12 Z" fill="#8f3d33" stroke="${WEISS_L}" stroke-width=".35"/>`;
  let fr = "";
  for (let u = -6.2; u < 6.4; u += 1.05) fr += `M${r(u)} -24.4 v-1.4 q.5 -.8 1 0 v1.4`;
  k += `<path d="${fr}" stroke="${WEISS_L}" stroke-width=".28" fill="none"/>`;
  k += `<rect x="-7.8" y="-28" width="14.6" height="1.2" fill="${WEISS_L}"/><rect x="-7.8" y="-28.3" width="14.6" height=".35" fill="${SCHNEE}"/>`;
  /* weiße Zierbrüstung mit Spitzen und die Ecktürmchen (bis 34 m) mit goldenen Fähnchen */
  let zb = "";
  for (let u = -5; u <= 5; u += 1.25) zb += `M${r(u - 0.3)} -28 L${r(u)} -30.2 L${r(u + 0.3)} -28 Z`;
  k += `<path d="${zb}" fill="${WEISS_L}"/>`;
  for (const u of [-6.3, 6.3]) {
    k += `<rect x="${u - 0.9}" y="-32.5" width="1.8" height="4.5" fill="${u < 0 ? WEISS_M : WEISS_L}"/><path d="M${u - 1} -32.5 L${u} -35.4 L${u + 1} -32.5 Z" fill="${WEISS_L}"/>`;
    k += `<path d="M${u} -35.4 V-36.4" stroke="#d6a93a" stroke-width=".25"/><path d="M${u} -36.4 l.8 .3 l-.8 .3" fill="#e2b84a"/>`;
  }
  /* Uhrgeschoss (28–41 m) */
  k += `<path d="M-5.7 -28 V-41 H-5 V-28 Z" fill="${ZIEGEL_S}"/><rect x="-5" y="-41" width="10" height="13" fill="${ZIEGEL_M}"/>`;
  k += `<path d="M-5 -28 V-41 M5 -28 V-41" stroke="${WEISS_L}" stroke-width=".7"/>`;
  {
    /* Zifferblatt 6,1 m: schwarz, goldener Ring, goldene Stundenstriche; 14:20 Uhr */
    const cy = -34.5, R = 3.05;
    let u = `<circle cx="0" cy="${cy}" r="${R + 0.35}" fill="${GOLD}"/><circle cx="0" cy="${cy}" r="${R}" fill="#14161c"/>`;
    let st = "";
    for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6, r1 = R * 0.8, r2 = R * (i % 3 ? 0.92 : 0.95); st += `M${r(Math.sin(a) * r1 * 100) / 100} ${r((cy - Math.cos(a) * r1) * 100) / 100} L${r(Math.sin(a) * r2 * 100) / 100} ${r((cy - Math.cos(a) * r2) * 100) / 100}`; }
    u += `<path d="${st}" stroke="#e9c35a" stroke-width=".38"/>`;
    u += `<circle cx="0" cy="${cy}" r="${R * 0.62}" fill="none" stroke="#c9a24a" stroke-width=".12"/>`;
    const hA = (2 + 20 / 60) * Math.PI / 6, mA = 20 / 60 * Math.PI * 2;
    u += `<path d="M0 ${cy} L${r(Math.sin(hA) * 1.6 * 100) / 100} ${r((cy - Math.cos(hA) * 1.6) * 100) / 100} M0 ${cy} L${r(Math.sin(mA) * 2.4 * 100) / 100} ${r((cy - Math.cos(mA) * 2.4) * 100) / 100}" stroke="#f2cf68" stroke-width=".32" stroke-linecap="round"/>`;
    u += `<circle cx="0" cy="${cy}" r=".3" fill="#f2cf68"/><path d="M-2.2 -36.6 A3 3 0 0 1 1.4 -37.3" stroke="#fff" stroke-width=".25" opacity=".35" fill="none"/>`;
    k += u;
  }
  k += `<rect x="-5.6" y="-42.5" width="11.2" height="1.5" fill="${WEISS_L}"/><rect x="-5.6" y="-42.8" width="11.2" height=".4" fill="${SCHNEE}"/>`;
  for (const u of [-5.1, 5.1]) k += `<path d="M${u - 0.5} -42.5 V-44.2 L${u} -45.8 L${u + 0.5} -44.2 V-42.5 Z" fill="${WEISS_L}"/><circle cx="${u}" cy="-46" r=".25" fill="#e2b84a"/>`;
  /* Erstes Achteck (42,5–51 m) mit Bogenöffnungen und weißen Säulchen */
  k += achteck(0, 8, 42.5, 51, ZIEGEL_S, ZIEGEL_M, ZIEGEL_L);
  k += `<path d="M-1.2 -43.5 V-48.6 Q0 -50.2 1.2 -48.6 V-43.5 Z M-3.75 -43.5 V-48.4 Q-3.1 -49.6 -2.5 -48.4 V-43.5 Z M2.5 -43.5 V-48.4 Q3.1 -49.6 3.75 -48.4 V-43.5 Z" fill="#2a1a22"/>`;
  k += `<path d="M-1.66 -42.5 V-51 M1.66 -42.5 V-51 M-4 -42.5 V-51 M4 -42.5 V-51" stroke="${WEISS_L}" stroke-width=".45"/>`;
  /* weiße Bogenrahmen über den Öffnungen, Glocken im Dunkel, Zierspitzen am Achteck */
  k += `<path d="M-1.45 -48.3 Q0 -50.6 1.45 -48.3 M-3.85 -48.2 Q-3.1 -49.9 -2.4 -48.2 M2.4 -48.2 Q3.1 -49.9 3.85 -48.2" stroke="${WEISS_L}" stroke-width=".3" fill="none"/>`;
  k += `<path d="M-.7 -45.6 Q0 -47.2 .7 -45.6 Z" fill="#b08a3a"/><rect x="-1.66" y="-43.6" width="3.32" height=".35" fill="${WEISS_M}"/>`;
  for (const u of [-4, -1.66, 1.66, 4]) k += `<path d="M${u - 0.35} -51 L${u} -52.8 L${u + 0.35} -51 Z" fill="${WEISS_L}"/>`;
  k += `<rect x="-4.3" y="-51.6" width="8.6" height=".7" fill="${WEISS_L}"/><rect x="-4.3" y="-51.8" width="8.6" height=".3" fill="${SCHNEE}"/>`;
  /* Zweites Achteck (51,6–55 m) */
  k += achteck(0, 6.4, 51.6, 55, "#c9c0b8", WEISS_M, WEISS_L);
  k += `<path d="M-1.33 -52 V-54.6 M1.33 -52 V-54.6 M-.3 -52.2 v-1.8 q.3 -.5 .6 0 v1.8 Z" stroke="#8f3d33" stroke-width=".3" fill="#5a2a2a"/>`;
  /* Zeltdach, grün, mit hellen Gratlinien und Hörfenstern */
  k += `<path d="M-3.1 -55 L-.25 -66.6 L0 -66.6 L-1.3 -55 Z" fill="${GRUEN_S}"/><path d="M-1.3 -55 L0 -66.6 L1.3 -55 Z" fill="${GRUEN_M}"/><path d="M1.3 -55 L0 -66.6 L.25 -66.6 L3.1 -55 Z" fill="${GRUEN_L}"/>`;
  k += `<path d="M-1.3 -55 L0 -66.6 L1.3 -55" stroke="#8fc1a3" stroke-width=".18" fill="none"/>`;
  let ra = "";
  for (let j = 1; j < 6; j++) { const y = -55 - j * 2, w = 3.1 * (1 - j * 2 / 11.6); ra += `M${r(-w)} ${y} H${r(w)}`; }
  k += `<path d="${ra}" stroke="#1d3f31" stroke-width=".12" opacity=".6"/>`;
  k += `<path d="M-.6 -59 l.6 -1.4 l.6 1.4 Z" fill="${WEISS_L}"/>`;
  k += `<path d="M0 -66.6 V-67.8" stroke="#d6a93a" stroke-width=".3"/><circle cx="0" cy="-67.6" r=".4" fill="${GOLD}"/>`;
  /* der rote Stern (3,75 m): fünf Strahlen, jede Hälfte anders beleuchtet, Goldrand */
  {
    const cy = -70, R = 1.9, ri = 0.78;
    let licht = "", dunkel = "", rand = "";
    for (let i = 0; i < 5; i++) {
      const a = i * 2 * Math.PI / 5, aL = a - Math.PI / 5, aR = a + Math.PI / 5;
      const tip = [Math.sin(a) * R, cy - Math.cos(a) * R], L = [Math.sin(aL) * ri, cy - Math.cos(aL) * ri], Rr = [Math.sin(aR) * ri, cy - Math.cos(aR) * ri];
      const f = (q) => `${r(q[0] * 100) / 100} ${r(q[1] * 100) / 100}`;
      licht += `M0 ${cy} L${f(tip)} L${f(Rr)}Z`;
      dunkel += `M0 ${cy} L${f(L)} L${f(tip)}Z`;
      rand += `${i ? "L" : "M"}${f(tip)} L${f(Rr)} `;
    }
    k += `<path d="${dunkel}" fill="#8e1018"/><path d="${licht}" fill="#e2333a"/><path d="${rand}Z" fill="none" stroke="#e6bd4a" stroke-width=".22" stroke-linejoin="miter"/>`;
    k += `<circle cx=".5" cy="${cy - 0.6}" r=".35" fill="#fff" opacity=".5"/>`;
  }
  const P0 = SP(0, 0);
  S.teil({ id: "spasski_turm", de: "der Spasski-Turm", syl: "SPAS-ski-turm", it: "la Torre del Salvatore", itSyl: "TOR-re del sal-va-TO-re", en: "Spasskaya Tower",
    x: ox, y: oy, steht: true, kunst: `<g transform="scale(${s.toFixed(4)})">${k}</g>`,
    zoom: { x: 214, y: 34, w: 127, h: 85 },
    unter: [
      { id: "uhr", de: "die Uhr", syl: "UHR", it: "l'orologio", itSyl: "o-ro-LO-gio", en: "clock", x: P0.x, y: r(oy - 34.5 * s),
        kunst: flaecheEllipse(0, 0, 3.6 * s, 3.6 * s), tipp: "Die Uhr am Spasski-Turm zeigt die Moskauer Zeit. Ihr Zifferblatt ist sechs Meter groß." },
      { id: "stern", de: "der Stern", syl: "STERN", it: "la stella", itSyl: "STEL-la", en: "star", x: P0.x, y: r(oy - 70 * s),
        kunst: flaecheEllipse(0, 0, 2.3 * s, 2.3 * s), tipp: "Der Stern ist aus rotem Glas. Nachts leuchtet er." },
    ],
    tipp: "Der Spasski-Turm ist 71 Meter hoch. Er ist der berühmteste Turm des Kremls." });
}

/* =====================================================================
   5 — DIE KREMLMAUER mit Schwalbenschwanz-Zinnen und dem Senatsturm
   ===================================================================== */
{
  const L = 38, D0 = 106.5, D1 = 288.5;
  let k = "";
  /* Mauerkörper mit Zinnenkrone als ein Umriss */
  let u = `M${P(D0, L, 0)} L${P(D0, L, 10)}`;
  const zinnen = [];
  for (let d = D0 + 0.4; d + 2.1 < D1; d += 3) zinnen.push(d);
  for (const d of zinnen) u += ` L${P(d, L, 10)} L${P(d, L, 12)} L${P(d + 1.05, L, 11.25)} L${P(d + 2.1, L, 12)} L${P(d + 2.1, L, 10)}`;
  u += ` L${P(D1, L, 10)} L${P(D1, L, 0)} Z`;
  k += `<path d="${u}" fill="${S.lg("mauer", [[0, "#8a5149"], [0.5, "#7a3d36"], [1, "#6a302c"]], 270, 0, 400, 0, ' gradientUnits="userSpaceOnUse"')}"/>`;
  /* Himmelslicht oben, Fugen in Flucht */
  let fu = "";
  for (const h of [1.5, 3, 4.5, 6, 7.5, 9]) fu += `M${P(D0, L, h)} L${P(D1, L, h)}`;
  k += `<path d="${fu}" stroke="#5a2724" stroke-width=".22" opacity=".55"/>`;
  k += `<path d="M${P(D0, L, 9.6)} L${P(D1, L, 9.6)}" stroke="#a7675b" stroke-width=".5" opacity=".7"/>`;
  /* Schießscharten in den Zinnen und Schnee auf den Hörnern */
  let sl = "", sn = "";
  for (const d of zinnen) {
    sl += `M${P(d + 0.95, L, 10.3)} L${P(d + 0.95, L, 11)} L${P(d + 1.15, L, 11)} L${P(d + 1.15, L, 10.3)}Z`;
    sn += `M${P(d, L, 12)} L${P(d + 1.05, L, 11.25)} L${P(d + 2.1, L, 12)}`;
  }
  k += `<path d="${sl}" fill="#3a1c1e"/><path d="${sn}" stroke="${SCHNEE}" stroke-width=".55" fill="none" stroke-linejoin="round"/>`;
  /* Senatsturm (34 m) mitten über dem Mausoleum */
  {
    const d = 158, s = F / d, ox = r(X(d, 38.25)), oy = r(Y(d));
    let t = `<path d="M-6 0 V-19 H-4.25 V0 Z" fill="${ZIEGEL_S}"/><rect x="-4.25" y="-19" width="8.5" height="19" fill="#93473c"/>`;
    t += `<rect x="-4.25" y="-19" width="8.5" height="19" fill="${S.lg("sen", [[0, "#000", 0.1], [1, "#fff1d8", 0.12]], 0, 0, 1, 0)}"/>`;
    let zt = "";
    for (let i = 0; i < 4; i++) { const a = -4.25 + i * 2.2; zt += `M${r(a)} -19 V-21.4 L${r(a + 0.55)} -20.7 L${r(a + 1.1)} -21.4 V-19 Z`; }
    t += `<path d="${zt}" fill="#93473c"/><path d="M-6 -19 V-21.4 L-5.4 -20.7 L-4.8 -21.4 V-19 Z" fill="${ZIEGEL_S}"/>`;
    t += `<path d="${zt.replace(/V-19 Z/g, "")}" stroke="${SCHNEE}" stroke-width=".35" fill="none"/>`;
    /* weißer Bogenfries, Blendfenster, Ecklisenen */
    let bf = "";
    for (let u = -4; u < 4.2; u += 1.05) bf += `M${r(u)} -16.6 v-.9 q.5 -.7 1 0 v.9`;
    t += `<path d="${bf}" stroke="#d8c3b4" stroke-width=".25" fill="none"/><path d="M-4.25 -15.6 h8.5 M-4.25 -18.4 h8.5" stroke="#d8c3b4" stroke-width=".35"/>`;
    t += `<path d="M-.75 -8 v-3.4 q.75 -1.1 1.5 0 v3.4 Z M-.5 -3 v-2.2 q.5 -.7 1 0 v2.2 Z" fill="#3a1c1e" stroke="#d8c3b4" stroke-width=".25"/>`;
    t += `<path d="M-4.25 0 V-19 M4.25 0 V-19" stroke="#7a3a33" stroke-width=".5"/>`;
    /* Zeltdach aus grünen Ziegeln: linke Fläche im Schatten, Gratlinien, Hörfenster */
    t += `<path d="M-5.8 -21.6 L-.25 -33 L-1.9 -21.6 Z" fill="${GRUEN_S}"/><path d="M-1.9 -21.6 L-.25 -33 L.25 -33 L4.6 -21.6 Z" fill="${GRUEN_M}"/>`;
    let zr = "";
    for (let j = 1; j < 6; j++) { const y = -21.6 - j * 2, f = 1 - j * 2 / 11.4; zr += `M${r(-5.8 * f)} ${y} H${r(4.6 * f)}`; }
    t += `<path d="${zr}" stroke="#1f4a37" stroke-width=".14" opacity=".7"/><path d="M-1.9 -21.6 L-.25 -33" stroke="#9cc7ad" stroke-width=".2"/>`;
    t += `<path d="M.2 -25 l.8 -1.8 l.8 1.8 Z" fill="${WEISS_L}"/><path d="M-5.8 -21.6 L-.25 -33" stroke="${SCHNEE}" stroke-width=".3" opacity=".8"/>`;
    t += `<path d="M-6 -21.6 h10.8" stroke="${SCHNEE}" stroke-width=".55"/><path d="M0 -33 V-35.4" stroke="#d6a93a" stroke-width=".3"/><circle cx="0" cy="-34" r=".38" fill="${GOLD}"/>`;
    k += `<g transform="translate(${ox} ${oy}) scale(${s.toFixed(4)})">${t}</g>`;
  }
  /* Zarenturm-Ansatz: die Mauer läuft am Spasski-Turm vorbei nach hinten (Kulisse) */
  const zz = zinnen.filter((d) => d < 150);
  const zi = zz[Math.floor(zz.length * 0.45)];
  S.teil({ id: "kremlmauer", de: "die Kremlmauer", syl: "KREML-mau-er", it: "le mura del Cremlino", itSyl: "MU-ra del crem-LI-no", en: "Kremlin wall",
    x: 0, y: 0, kunst: k, zoom: { x: 318, y: 104, w: 82, h: 55 },
    unter: [{ id: "zinne", de: "die Zinne", syl: "ZIN-ne", it: "il merlo", itSyl: "MER-lo", en: "battlement", x: r(X(zi + 1.05, L)), y: r(Y(zi + 1.05, 11)),
      kunst: flaeche(-3.4, -3.4, 6.8, 6.4, 0.6), tipp: "Die Zinnen der Kremlmauer sehen aus wie ein Schwalbenschwanz." }],
    tipp: "Die Mauer des Kremls ist über zwei Kilometer lang und hat 20 Türme." });
}

/* =====================================================================
   6 — DIE FICHTEN (Blaufichten vor der Mauer, verschneit)
   ===================================================================== */
{
  let k = "";
  const FI = S.lg("fichte", [[0, "#1d3a3c"], [0.6, "#2f5a58"], [1, "#4f7e78"]], 0, 0, 1, 0), FS = S.lg("fs", [[0, "#9fb0cc", 0.6], [0.5, "#fff", 0], [1, "#fff", 0]], 0, 0, 1, 0);
  const baum = (d, h, seed) => {
    const z = zufall(seed), s = F / d, x = X(d, 34.6), y = Y(d);
    let g = `<g transform="translate(${r(x)} ${r(y)}) scale(${s.toFixed(4)})">`;
    g += `<rect x="-.18" y="-.9" width=".36" height=".9" fill="#3a2a24"/>`;
    /* gelappter Kegel: Astlagen, die unteren breiter, Himmelslücken dazwischen */
    let ast = "", schnee = "";
    const n = 7;
    for (let i = 0; i < n; i++) {
      const t0 = i / n, y0 = -0.6 - t0 * (h - 0.6), y1 = y0 - (h - 0.6) / n * 1.5;
      const w = (1 - t0) * h * 0.24 + 0.25, j = (z() - 0.5) * 0.3;
      ast += `M${r(-w + j)} ${r(y0)} Q${r(-w * 0.55)} ${r(y0 - 0.5)} ${r(-w * 0.2)} ${r(y1 + 0.3)} L0 ${r(y1)} L${r(w * 0.2)} ${r(y1 + 0.3)} Q${r(w * 0.55)} ${r(y0 - 0.5)} ${r(w + j)} ${r(y0)} Q${r(w * 0.5)} ${r(y0 - 0.25)} ${r(w * 0.3)} ${r(y0 + 0.15)} Q0 ${r(y0 - 0.2)} ${r(-w * 0.3)} ${r(y0 + 0.15)} Q${r(-w * 0.5)} ${r(y0 - 0.25)} ${r(-w + j)} ${r(y0)}Z`;
      schnee += `M${r(-w * 0.15)} ${r(y1 + 0.45)} Q${r(w * 0.4)} ${r(y0 - 0.7)} ${r(w * 0.95 + j)} ${r(y0 - 0.1)} Q${r(w * 0.5)} ${r(y0 - 0.35)} ${r(w * 0.1)} ${r(y0 - 0.1)} Q${r(-w * 0.4)} ${r(y0 - 0.5)} ${r(-w * 0.8)} ${r(y0 - 0.05)} Q${r(-w * 0.45)} ${r(y0 - 0.8)} ${r(-w * 0.15)} ${r(y1 + 0.45)}Z`;
    }
    g += `<path d="${ast}" fill="${FI}"/>`;
    g += `<path d="${schnee}" fill="${SCHNEE}" opacity=".92"/>`;
    g += `<path d="${schnee}" fill="${FS}"/>`;
    g += `<path d="M0 ${r(-h)} V${r(-h - 0.5)}" stroke="#2f5a58" stroke-width=".18"/></g>`;
    return g;
  };
  const reihe = [[105.5, 9.6], [112, 10.8], [119, 9.8], [126, 10.6], [133, 10], [140, 10.6], [147, 9.6]];
  for (let i = reihe.length - 1; i >= 0; i--) k += baum(reihe[i][0], reihe[i][1], 40 + i);
  S.teil({ id: "fichte", de: "die Fichte", syl: "FICH-te", it: "l'abete rosso", itSyl: "a-BE-te ROS-so", en: "spruce", x: 0, y: 0, kunst: k,
    tipp: "Vor der Kremlmauer stehen Blaufichten. Sie sind auch im Winter grün." });
}

/* =====================================================================
   7 — DAS MAUSOLEUM (Stufenpyramide aus rotem Granit und Labradorit)
   ===================================================================== */
{
  const D0 = 150, D1 = 174, L0 = 23, L1 = 36.5;
  const GR = S.lg("granit", [[0, "#7a3a33"], [1, "#8e4a3f"]], 0, 0, 1, 0), GRS = "#4e2a28", LAB = S.lg("labr", [[0, "#2a2a33"], [0.5, "#3b3e4c"], [1, "#24242b"]], 0, 0, 1, 0);
  S.def(`<pattern id="${S.id("koern")}" patternUnits="userSpaceOnUse" width="3" height="2.2"><circle cx=".6" cy=".5" r=".22" fill="#c08070" opacity=".5"/><circle cx="2.1" cy="1.5" r=".18" fill="#2a1414" opacity=".5"/><circle cx="1.5" cy=".2" r=".12" fill="#e0b0a0" opacity=".5"/></pattern>`);
  const stufen = [[0, 0.8, -0.3, "#5c5a60", "#47454b"], [0.8, 4, 0, GR, GRS], [4, 4.7, 0.3, LAB, "#1b1b21"], [4.7, 6.4, 1.1, GR, GRS], [6.4, 7, 1.4, LAB, "#1b1b21"], [7, 8.6, 2.1, GR, GRS], [8.6, 11, 3.2, "#2a2730", "#1b1a20"], [11, 12, 2.9, GR, GRS]];
  let k = "";
  for (const [h0, h1, i, fv, fs] of stufen) {
    /* Seite zum Platz (Schatten) und Stirnseite zum Betrachter (Streiflicht) */
    k += poly([P(D0 + i, L0 + i, h0), P(D1 - i, L0 + i, h0), P(D1 - i, L0 + i, h1), P(D0 + i, L0 + i, h1)], fs);
    k += poly([P(D0 + i, L0 + i, h0), P(D0 + i, L1 - i, h0), P(D0 + i, L1 - i, h1), P(D0 + i, L0 + i, h1)], fv);
    if (fv === GR) k += poly([P(D0 + i, L0 + i, h0), P(D0 + i, L1 - i, h0), P(D0 + i, L1 - i, h1), P(D0 + i, L0 + i, h1)], `url(#${S.id("koern")})`);
  }
  /* Fugen der Granitblöcke auf der Stirnseite */
  let fg = "";
  for (const h of [1.6, 2.4, 3.2]) fg += `M${P(D0, L0, h)} L${P(D0, L1, h)}`;
  for (const l of [26, 29.5, 33]) fg += `M${P(D0, l, 0.8)} L${P(D0, l, 4)}`;
  k += `<path d="${fg}" stroke="#5a2a26" stroke-width=".25" opacity=".7"/>`;
  /* der dunkle Eingang auf der Platzseite (Streiflicht) */
  k += poly([P(160, L0, 0.8), P(164, L0, 0.8), P(164, L0, 3.4), P(160, L0, 3.4)], "#111015");
  /* Pfeiler im Portikus oben und Schneekanten auf den Stufen */
  let pf = "";
  for (let j = 0; j < 5; j++) { const l = 23 + 3.6 + j * 2.25; pf += poly([P(D0 + 3.3, l, 8.6), P(D0 + 3.3, l + 0.9, 8.6), P(D0 + 3.3, l + 0.9, 11), P(D0 + 3.3, l, 11)], "#7a3a33"); }
  k += pf;
  let sn = "";
  for (const [h, i] of [[4, 0], [6.4, 1.1], [8.6, 2.2], [12, 3]]) sn += `M${P(D1 - i, L0 + i, h)} L${P(D0 + i, L0 + i, h)} L${P(D0 + i, L1 - i, h)}`;
  k += `<path d="${sn}" stroke="${SCHNEE}" stroke-width=".7" fill="none" stroke-linejoin="round"/>`;
  k += `<path d="M${P(D0, L1, 4)} L${P(D0, L0, 4)}" stroke="#b55a4c" stroke-width=".3" opacity=".6"/>`;
  S.teil({ id: "mausoleum", de: "das Mausoleum", syl: "mau-so-LE-um", it: "il mausoleo", itSyl: "mau-so-LE-o", en: "mausoleum", x: 0, y: 0, kunst: k,
    tipp: "Das Mausoleum ist aus rotem und schwarzem Stein gebaut, wie eine Treppe." });
}

/* =====================================================================
   8 — DAS KAUFHAUS GUM (242 m, links, in der Sonne)
   ===================================================================== */
{
  const L = -38, D0 = 106.5, D1 = 277, H = 20.5;
  let k = "";
  /* Dach (verschneit) hinter dem Gesims */
  k += poly([P(D0, L, H), P(D1, L, H), P(D1, L - 6, 23.6), P(D0, L - 6, 23.6)], SCHNEE);
  k += poly([P(D0, L - 3, 22), P(D1, L - 3, 22), P(D1, L - 6, 23.6), P(D0, L - 6, 23.6)], SCHNEE_S, ` opacity=".6"`);
  /* Fassade: oben heller Kalkstein, unten roter Granitsockel */
  k += poly([P(D0, L, 0), P(D1, L, 0), P(D1, L, H), P(D0, L, H)], S.lg("gum", [[0, "#f3e3c6"], [0.6, "#ead6b6"], [1, "#d9c6ab"]], 0, 0, 140, 0, ' gradientUnits="userSpaceOnUse"'));
  k += poly([P(D0, L, 0), P(D1, L, 0), P(D1, L, 1.4), P(D0, L, 1.4)], "#9c4f45");
  /* Gesimse und Stockwerksbänder */
  for (const [h, w, c] of [[7, 0.5, "#fffaf0"], [12.6, 0.45, "#fffaf0"], [18, 0.4, "#fffaf0"], [H, 0.9, "#c9b394"]]) {
    k += poly([P(D0, L, h - w), P(D1, L, h - w), P(D1, L, h), P(D0, L, h)], c);
  }
  k += `<path d="M${P(D0, L, H + 0.2)} L${P(D1, L, H + 0.2)}" stroke="${SCHNEE}" stroke-width=".8"/>`;
  /* Fensterachsen: Erdgeschoss mit Schaufenstern (Rundbögen), oben gepaarte Bogenfenster */
  let fen = "", glanz = "", pil = "", rahmen = "";
  const bogen = (d0, d1, h0, h1) => { const m = (d0 + d1) / 2; return `M${P(d0, L, h0)} L${P(d0, L, h1)} Q${P(m, L, h1 + (h1 - h0) * 0.35)} ${P(d1, L, h1)} L${P(d1, L, h0)}Z`; };
  for (let d = D0 + 0.1; d < D1 - 2; d += 4.4) {
    if (d > 146 && d < 166) continue;   /* Mittelportal */
    pil += `M${P(d, L, 1.4)} L${P(d, L, H - 0.9)}`;
    fen += bogen(d + 0.8, d + 3.6, 1.6, 5.2);
    rahmen += bogen(d + 0.65, d + 3.75, 1.5, 5.3);
    if (d < 200) { fen += bogen(d + 0.9, d + 1.95, 8, 10.6) + bogen(d + 2.45, d + 3.5, 8, 10.6) + bogen(d + 1, d + 3.4, 13.4, 16.4); }
    else fen += bogen(d + 1, d + 3.4, 8, 10.6) + bogen(d + 1, d + 3.4, 13.4, 16.4);
    if (d < 150) glanz += `M${P(d + 0.9, L, 1.7)} L${P(d + 2, L, 1.7)} L${P(d + 1.2, L, 4.4)} L${P(d + 0.9, L, 4.4)}Z`;
  }
  k += `<path d="${pil}" stroke="#fffaf0" stroke-width=".6" opacity=".8"/>`;
  k += `<path d="${rahmen}" fill="#fffaf0"/>`;
  k += `<path d="${fen}" fill="${S.lg("gumfen", [[0, "#3b4660"], [0.6, "#56657e"], [1, "#2e3446"]])}"/>`;
  k += `<path d="${glanz}" fill="#c9d8ee" opacity=".4"/>`;
  /* warmes Licht in den Schaufenstern */
  let wl = "";
  for (let d = D0 + 0.1; d < 200; d += 4.4) if (!(d > 146 && d < 166)) wl += `M${P(d + 1.2, L, 1.7)} L${P(d + 3.2, L, 1.7)} L${P(d + 3.2, L, 2.6)} L${P(d + 1.2, L, 2.6)}Z`;
  k += `<path d="${wl}" fill="#ffd27a" opacity=".55"/>`;
  /* Mittelportal (d 147–165): hoher Giebel mit großem Bogen, zwei Türme mit grünen Zeltdächern */
  {
    const a = 147, b = 165, m = 156;
    const gieb = `M${P(a, L, H)} L${P(a, L, 24.5)} C${P(a, L, 28.5)} ${P(m - 3, L, 28)} ${P(m, L, 31)} C${P(m + 3, L, 28)} ${P(b, L, 28.5)} ${P(b, L, 24.5)} L${P(b, L, H)}Z`;
    k += `<path d="${gieb}" fill="#efdcbc"/><path d="${gieb}" fill="none" stroke="#fffaf0" stroke-width=".7"/>`;
    k += `<path d="M${P(a, L, 24.5)} C${P(a, L, 28.5)} ${P(m - 3, L, 28)} ${P(m, L, 31)} C${P(m + 3, L, 28)} ${P(b, L, 28.5)} ${P(b, L, 24.5)}" stroke="${SCHNEE}" stroke-width="1" fill="none"/>`;
    k += `<path d="M${P(m, L, 31)} L${P(m, L, 33.5)}" stroke="#d6a93a" stroke-width=".5"/>`;
    k += `<path d="${bogen(a + 2.6, b - 2.6, 0.2, 8.2)}" fill="#2b3245"/><path d="${bogen(a + 1.8, b - 1.8, 0.2, 8.6)}" fill="none" stroke="#fffaf0" stroke-width=".7"/>`;
    k += `<path d="${bogen(a + 3, b - 3, 11, 22)}" fill="${S.lg("gumgr", [[0, "#56657e"], [1, "#2e3446"]])}"/><path d="${bogen(a + 2.6, b - 2.6, 10.8, 22.4)}" fill="none" stroke="#fffaf0" stroke-width=".55"/>`;
    k += `<path d="M${P(m, L, 11)} L${P(m, L, 23)} M${P(a + 3, L, 15.5)} L${P(b - 3, L, 15.5)}" stroke="#d9cdb8" stroke-width=".4"/>`;
    /* Schild ГУМ über dem Portal */
    const sx = X(m, L), sy = Y(m, 9.6);
    k += `<text x="${r(sx)}" y="${r(sy)}" font-size="${r(2.2 * F / m)}" text-anchor="middle" fill="#8a2a24" font-family="Georgia,'Times New Roman',serif" font-weight="bold" transform="skewY(-14) translate(0 ${r(sx * Math.tan(14 * Math.PI / 180))})">ГУМ</text>`;
  }
  /* Türmchen auf dem Dach: kleine Laternen mit grünen Zeltdächern und Goldspitzen */
  const turm = (d, hoch) => {
    const s = F / d, x = X(d, L), y = Y(d, H);
    const t0 = hoch ? 9 : 5.2, t1 = hoch ? 15 : 9.8;
    return `<g transform="translate(${r(x)} ${r(y)}) scale(${s.toFixed(4)})"><rect x="-1.5" y="${-t0}" width="3" height="${t0}" fill="#efdcbc"/><rect x="-1.5" y="${-t0}" width=".9" height="${t0}" fill="#d9c4a1"/>` +
      `<path d="M-.5 ${r(-t0 + 1.3)} v${r(t0 * 0.45)} h1 v${r(-t0 * 0.45)} Z" fill="#3b4660"/><rect x="-1.8" y="${r(-t0 - 0.5)}" width="3.6" height=".5" fill="${SCHNEE}"/>` +
      `<path d="M-1.6 ${-t0} L0 ${-t1} L1.6 ${-t0} Z" fill="${GRUEN_L}"/><path d="M-1.6 ${-t0} L0 ${-t1} L-.4 ${-t0} Z" fill="${GRUEN_M}"/><path d="M0 ${-t1} v-1.2" stroke="#d6a93a" stroke-width=".25"/></g>`;
  };
  for (const [d, hoch] of [[276, true], [237, false], [197, false], [168, true], [144, true], [117, false]]) k += turm(d, hoch);
  S.teil({ id: "kaufhaus", de: "das Kaufhaus", syl: "KAUF-haus", it: "il grande magazzino", itSyl: "GRAN-de ma-gaz-ZI-no", en: "department store",
    x: 0, y: 0, kunst: k, zoom: { x: 0, y: 104, w: 105, h: 70 },
    unter: [{ id: "schaufenster", de: "das Schaufenster", syl: "SCHAU-fens-ter", it: "la vetrina", itSyl: "ve-TRI-na", en: "shop window",
      x: r(X(100, L)), y: r(Y(100, 1.5)), kunst: flaeche(-7, -20, 14, 20, 0.6) }],
    tipp: "Das GUM ist ein großes Kaufhaus mit Glasdach. Es ist über 130 Jahre alt." });
}

/* =====================================================================
   9 — DER MARKTSTAND (Holzbude mit Schnitzwerk; 21 m vor dem Betrachter)
   ===================================================================== */
const STAND = { d: 21, l0: -6.9, l1: -3.7, theke: 1.05 };
{
  const { d, l0, l1, theke } = STAND, d1 = d + 2.4;
  let k = "";
  /* Rückwand und Regal (innen, im Schatten) */
  k += poly([P(d1, l0, 0.9), P(d1, l1, 0.9), P(d1, l1, 2.55), P(d1, l0, 2.55)], "#5a3424");
  k += poly([P(d1, l0, 1.9), P(d1, l1, 1.9), P(d1, l1, 1.98), P(d1, l0, 1.98)], "#8a5a38");
  /* im Regal: eine Reihe Matrjoschkas und Kringel (Baranki) an Schnüren */
  let rg = "";
  for (let i = 0; i < 7; i++) {
    const l = l0 + 0.3 + i * 0.42, x = X(d1, l), y = Y(d1, 1.98), s = F / d1, h = (0.15 + (i % 3) * 0.03) * s, w = h * 0.55;
    const c = ["#c8302c", "#2f5fa0", "#e0a23a", "#2f7a4f"][i % 4];
    rg += `<path d="M${r(x - w / 2)} ${r(y)} Q${r(x - w * 0.62)} ${r(y - h * 0.5)} ${r(x - w * 0.3)} ${r(y - h * 0.68)} Q${r(x)} ${r(y - h * 1.05)} ${r(x + w * 0.3)} ${r(y - h * 0.68)} Q${r(x + w * 0.62)} ${r(y - h * 0.5)} ${r(x + w / 2)} ${r(y)}Z" fill="${c}"/><circle cx="${r(x)}" cy="${r(y - h * 0.7)}" r="${r(w * 0.22)}" fill="#f2d6be"/>`;
  }
  for (let i = 0; i < 3; i++) {
    const l = l0 + 0.6 + i * 1.1, x = X(d1, l), y0 = Y(d1, 2.5), s = F / d1;
    rg += `<path d="M${r(x)} ${r(y0)} V${r(y0 + 0.5 * s)}" stroke="#d9c9a8" stroke-width=".25"/>`;
    for (let j = 0; j < 4; j++) rg += `<circle cx="${r(x)}" cy="${r(y0 + (0.12 + j * 0.11) * s)}" r="${r(0.05 * s)}" fill="none" stroke="#c98a3e" stroke-width="${r(0.025 * s * 10) / 10}"/>`;
  }
  k += rg;
  /* rechte Seitenwand (zur Sonne) und die Front mit Theke */
  k += poly([P(d, l1, 0), P(d1, l1, 0), P(d1, l1, 2.7), P(d, l1, 2.7)], "#b97a46");
  let br = "";
  for (let h = 0.2; h < 2.7; h += 0.24) br += `M${P(d, l1, h)} L${P(d1, l1, h)}`;
  k += `<path d="${br}" stroke="#8a5530" stroke-width=".3" opacity=".7"/>`;
  k += poly([P(d, l0, 0), P(d, l1, 0), P(d, l1, theke), P(d, l0, theke)], "#8e5634");
  let vb = "";
  for (let l = l0 + 0.2; l < l1; l += 0.22) vb += `M${P(d, l, 0.05)} L${P(d, l, theke - 0.1)}`;
  k += `<path d="${vb}" stroke="#6e3f22" stroke-width=".35" opacity=".6"/>`;
  /* bemalte Zierleiste an der Theke (rot mit Blumen wie Chochloma) */
  k += poly([P(d, l0, 0.62), P(d, l1, 0.62), P(d, l1, 0.88), P(d, l0, 0.88)], "#b3241f");
  let bl = "";
  for (let l = l0 + 0.25; l < l1; l += 0.45) bl += `<circle cx="${r(X(d, l))}" cy="${r(Y(d, 0.75))}" r="1.4" fill="#e8b33a"/><circle cx="${r(X(d, l + 0.22))}" cy="${r(Y(d, 0.75))}" r=".7" fill="#1d1a16"/>`;
  k += bl;
  /* Thekenplatte */
  k += poly([P(d - 0.25, l0 - 0.1, theke), P(d - 0.25, l1 + 0.1, theke), P(d + 0.5, l1 + 0.1, theke + 0.05), P(d + 0.5, l0 - 0.1, theke + 0.05)], "#c99561");
  k += poly([P(d - 0.25, l0 - 0.1, theke - 0.06), P(d - 0.25, l1 + 0.1, theke - 0.06), P(d - 0.25, l1 + 0.1, theke), P(d - 0.25, l0 - 0.1, theke)], "#7a4826");
  /* Pfosten und Dach mit geschnitztem Giebelbrett, Schnee auf dem Dach */
  for (const l of [l0, l1]) k += poly([P(d, l, theke), P(d, l + (l === l0 ? 0.14 : -0.14), theke), P(d, l + (l === l0 ? 0.14 : -0.14), 2.7), P(d, l, 2.7)], "#7a4826");
  const m = (l0 + l1) / 2;
  k += poly([P(d - 0.3, l0 - 0.35, 2.6), P(d - 0.3, m, 3.55), P(d - 0.3, l1 + 0.35, 2.6), P(d - 0.3, l1 + 0.15, 2.5), P(d - 0.3, m, 3.32), P(d - 0.3, l0 - 0.15, 2.5)], "#b3241f");
  k += poly([P(d - 0.3, l0 - 0.15, 2.5), P(d - 0.3, m, 3.32), P(d - 0.3, l1 + 0.15, 2.5)], "#f0e2c4");
  k += poly([P(d - 0.3, m, 3.55), P(d1 + 0.3, m, 3.55), P(d1 + 0.3, l1 + 0.35, 2.6), P(d - 0.3, l1 + 0.35, 2.6)], "#c9b49a");
  k += poly([P(d - 0.3, m, 3.62), P(d1 + 0.3, m, 3.62), P(d1 + 0.3, l1 + 0.4, 2.62), P(d - 0.3, l1 + 0.4, 2.62)], SCHNEE);
  k += `<path d="M${P(d - 0.3, l0 - 0.4, 2.62)} L${P(d - 0.3, m, 3.62)} L${P(d - 0.3, l1 + 0.4, 2.62)}" stroke="${SCHNEE}" stroke-width="2" fill="none" stroke-linejoin="round"/>`;
  /* geschnitzte Zacken am Giebel */
  let za = "";
  for (let i = 1; i < 12; i++) { const t = i / 12, l = l0 + (l1 - l0) * t, h = 2.5 + (1 - Math.abs(t - 0.5) * 2) * 0.82; za += `M${P(d - 0.3, l - 0.06, h)} L${P(d - 0.3, l, h - 0.12)} L${P(d - 0.3, l + 0.06, h)}`; }
  k += `<path d="${za}" stroke="#f0e2c4" stroke-width=".5" fill="none"/>`;
  /* Schild „ЧАЙ“ (Tee) und Lichterkette */
  const sx = X(d - 0.3, m), sy = Y(d - 0.3, 2.85);
  k += `<rect x="${r(sx - 11)}" y="${r(sy - 4.6)}" width="22" height="7" rx="1" fill="#f6ead0" stroke="#7a4826" stroke-width=".5"/><text x="${r(sx)}" y="${r(sy + 1)}" font-size="5.6" text-anchor="middle" fill="#b3241f" font-family="Georgia,'Times New Roman',serif" font-weight="bold" letter-spacing=".5">ЧАЙ</text>`;
  let lk = "";
  for (let i = 0; i <= 10; i++) { const t = i / 10, l = l0 + (l1 - l0) * t, h = 2.45 - Math.sin(Math.PI * t) * 0.12; lk += `<circle cx="${r(X(d - 0.32, l))}" cy="${r(Y(d - 0.32, h))}" r=".8" fill="#ffe08a"/>`; }
  k += `<path d="M${P(d - 0.32, l0, 2.45)} Q${P(d - 0.32, m, 2.2)} ${P(d - 0.32, l1, 2.45)}" stroke="#3a2a20" stroke-width=".25" fill="none"/>` + lk;
  S.teil({ id: "marktstand", de: "der Marktstand", syl: "MARKT-stand", it: "la bancarella", itSyl: "ban-ca-REL-la", en: "market stall", x: 0, y: 0, kunst: k,
    tipp: "Im Winter gibt es auf dem Roten Platz einen Markt mit Holzbuden." });
}

/* =====================================================================
   10 — DIE VERKÄUFERIN (hinter der Theke, buntes Kopftuch)
   ===================================================================== */
{
  const d = 22.2, l = -5.6, x = r(X(d, l)), y = r(Y(d));
  const m = B.mensch({ id: "msk_verk", geschlecht: "w", blick: 38, neigung: 3, frisur: "dutt", haarfarbe: "dunkelbraun", haut: "hell", laecheln: true, pose: "servieren",
    kleidung: { oberteil: { stueck: "pullover", farbe: "#e9e1cf" }, jacke: { stueck: "weste", farbe: "#6a2a2a" }, unterteil: { stueck: "hose", farbe: "schwarz" }, schuhe: { stueck: "stiefel" }, kopf: { stueck: "kopftuch", farbe: "#b8272a" } } }, r(1.64 * F / d));
  const theke = Y(STAND.d, STAND.theke) - y;
  const clip = S.id("verkclip");
  S.def(`<clipPath id="${clip}"><rect x="-40" y="-80" width="80" height="${r(80 + theke)}"/></clipPath>`);
  /* Blumenmuster auf dem Kopftuch (Pawlowski Possad) */
  const kx = m.z.kopf.x * m.k, ky = m.z.kopf.y * m.k;
  let tuch = "";
  for (const [dx, dy, c] of [[-1.6, -1.4, "#f2c84b"], [1.2, -2.2, "#2f6a3e"], [0.2, 0.6, "#f2c84b"], [-2.2, 1.4, "#f6efe0"], [2.1, 0.6, "#2f6a3e"]]) tuch += `<circle cx="${r(kx + dx)}" cy="${r(ky + dy)}" r=".55" fill="${c}"/>`;
  S.teil({ id: "verkaeuferin", de: "die Verkäuferin", syl: "ver-KÄU-fe-rin", it: "la venditrice", itSyl: "ven-di-TRI-ce", en: "saleswoman", x, y,
    kunst: `<g clip-path="url(#${clip})">${kompakt(m.svg, 2)}<g opacity=".9">${tuch}</g></g>`,
    zoom: { x: x - 21, y: y - 50, w: 42, h: 28 },
    unter: [{ id: "kopftuch", de: "das Kopftuch", syl: "KOPF-tuch", it: "il foulard", itSyl: "fu-LAR", en: "headscarf", x: r(x + kx), y: r(y + ky),
      kunst: flaecheEllipse(0, 0, 4.2, 4.6), tipp: "Bunte Tücher mit Blumen sind typisch russisch." }] });
}

/* =====================================================================
   11 — DER KUNDE mit Pelzmütze (Uschanka) und Teeglas
   ===================================================================== */
let KUNDE_HAND = null;
{
  const d = 19.5, l = -2.7, x = r(X(d, l)), y = r(Y(d));
  const pose = { kipp: 0, lende: 1, brust: 0, nacken: 4, kopf: -4, schulterL: { vor: 4, seit: 8 }, ellbogenL: 14, unterarmL: 10, handL: 6, fingerL: 0.4,
    schulterR: { vor: 16, seit: 8, dreh: 14 }, ellbogenR: 92, unterarmR: 30, handR: 8, fingerR: 0.72,
    huefteL: { vor: 3, seit: 3, dreh: -6 }, knieL: 3, fussL: 0, huefteR: { vor: -6, seit: 4, dreh: -6 }, knieR: 6, fussR: 2 };
  const m = B.mensch({ id: "msk_kunde", geschlecht: "m", blick: -62, neigung: 3, frisur: "kurz", haarfarbe: "dunkelbraun", haut: "hell", laecheln: true, pose,
    kleidung: { jacke: { stueck: "mantel", farbe: "#2e3a4c" }, unterteil: { stueck: "hose", farbe: "#3a3a40" }, schuhe: { stueck: "stiefel" }, zubehoer: { stueck: "schal", farbe: "#c8402c" } } }, r(1.8 * F / d));
  /* Uschanka: Fellmütze mit hochgebundenen Ohrenklappen (in Figur-Zentimetern) */
  const hx = m.z.kopf.x, hy = m.z.kopf.y;
  const FELL = S.lg("fell", [[0, "#3a2a20"], [0.5, "#6b4a32"], [1, "#8a6444"]], 0, 0, 1, 0);
  let hut = `<path d="M${r(hx - 12)} ${r(hy - 4)} Q${r(hx - 12)} ${r(hy - 19)} ${r(hx)} ${r(hy - 19.5)} Q${r(hx + 12)} ${r(hy - 19)} ${r(hx + 12)} ${r(hy - 4)} Z" fill="${FELL}"/>`;
  hut += `<path d="M${r(hx - 13)} ${r(hy - 2)} Q${r(hx - 14)} ${r(hy - 9)} ${r(hx - 11)} ${r(hy - 12)} L${r(hx - 8.5)} ${r(hy - 6)} Z" fill="#5a3e2a"/>`;
  hut += `<path d="M${r(hx - 12.5)} ${r(hy - 5)} Q${r(hx)} ${r(hy - 9.5)} ${r(hx + 12.5)} ${r(hy - 5)} L${r(hx + 12.5)} ${r(hy - 9.5)} Q${r(hx)} ${r(hy - 14)} ${r(hx - 12.5)} ${r(hy - 9.5)} Z" fill="#7a5638"/>`;
  let haar = "";
  for (let i = 0; i < 26; i++) { const a = rnd() * 2 - 1, b = rnd(); haar += `M${r(hx + a * 11)} ${r(hy - 6 - b * 12)} l${r(0.8 + rnd())} ${r(-1 - rnd())}`; }
  hut += `<path d="${haar}" stroke="#a07a54" stroke-width=".8" opacity=".6"/>`;
  hut += `<path d="M${r(hx - 9)} ${r(hy - 16)} Q${r(hx + 2)} ${r(hy - 20)} ${r(hx + 10)} ${r(hy - 12)}" stroke="#b08a60" stroke-width="1.4" opacity=".6" fill="none"/>`;
  hut += `<path d="M${r(hx - 8)} ${r(hy - 19)} Q${r(hx - 9)} ${r(hy - 22.5)} ${r(hx - 6)} ${r(hy - 22.5)} M${r(hx + 6)} ${r(hy - 19)} Q${r(hx + 7)} ${r(hy - 22.5)} ${r(hx + 4)} ${r(hy - 22.5)}" stroke="#3a2a20" stroke-width=".8" fill="none"/>`;
  KUNDE_HAND = { x: x + m.z.handR.x * m.k, y: y + m.z.handR.y * m.k };
  const hutP = { x: r(x + hx * m.k), y: r(y + (hy - 11) * m.k) };
  S.teil({ id: "kunde", de: "der Kunde", syl: "KUN-de", it: "il cliente", itSyl: "cli-EN-te", en: "customer", x, y,
    kunst: `<g transform="scale(${m.k.toFixed(4)})">${kompakt(m.svg, 2).replace(/^<g transform="scale\([^)]*\)">/, "<g>")}${hut}</g>`,
    zoom: { x: x - 21, y: y - 56, w: 42, h: 28 },
    unter: [{ id: "pelzmuetze", de: "die Pelzmütze", syl: "PELZ-müt-ze", it: "il colbacco", itSyl: "col-BAC-co", en: "fur hat", x: hutP.x, y: hutP.y,
      kunst: flaecheEllipse(0, 0, 4.6, 4), tipp: "Die Pelzmütze heißt auf Russisch „Uschanka“. Die Klappen wärmen die Ohren." }] });
}

/* =====================================================================
   12 — AUF DER THEKE: Samowar, Matrjoschka, Pelmeni, Lebkuchen
   ===================================================================== */
const THEKE_Y = (l) => Y(STAND.d + 0.15, STAND.theke + 0.03);
{
  /* Samowar (links auf der Theke): Messing, Hahn, Teekanne obenauf */
  const l = -6.45, x = r(X(STAND.d + 0.15, l)), y = r(THEKE_Y(l)), s = F / (STAND.d + 0.15);
  const MS = S.lg("messing", [[0, "#6b4a18"], [0.35, "#c9963c"], [0.6, "#ffe6a0"], [0.75, "#d9a446"], [1, "#7a5418"]], 0, 0, 1, 0);
  let k = `<g transform="scale(${s.toFixed(4)})">`;
  k += `<path d="M-.11 0 h.22 l.03 -.05 h-.28 Z M-.12 -.05 h.24 v-.03 h-.24 Z" fill="#7a5418"/>`;
  k += `<path d="M-.16 -.08 Q-.2 -.2 -.15 -.3 Q-.18 -.38 -.12 -.42 h.24 Q.18 -.38 .15 -.3 Q.2 -.2 .16 -.08 Z" fill="${MS}"/>`;
  k += `<path d="M-.13 -.42 h.26 v-.03 h-.26 Z" fill="#7a5418"/><path d="M-.06 -.45 Q-.08 -.53 0 -.55 Q.08 -.53 .06 -.45 Z" fill="#f2f0ea"/><path d="M-.05 -.5 q.05 -.02 .1 0" stroke="#2f5fa0" stroke-width=".012" fill="none"/>`;
  k += `<path d="M.15 -.22 h.07 v.03 h-.02 v.03" stroke="#a37428" stroke-width=".018" fill="none"/>`;
  k += `<path d="M-.19 -.33 q-.04 .02 -.02 .07 M.19 -.33 q.04 .02 .02 .07" stroke="#4a3418" stroke-width=".016" fill="none"/>`;
  k += `<path d="M-.02 -.58 q-.03 -.06 0 -.12 q.03 -.06 0 -.12" stroke="#fff" stroke-width=".012" opacity=".6" fill="none"/></g>`;
  S.teil({ oben: true, id: "samowar", de: "der Samowar", syl: "sa-mo-WAR", it: "il samovar", itSyl: "sa-mo-VAR", en: "samovar", x, y, steht: true, kunst: k,
    tipp: "Im Samowar wird Wasser für den Tee heiß gemacht." });
}
{
  /* Matrjoschka: drei Puppen nebeneinander, die große vorne rechts */
  const l = -4.25, x = r(X(STAND.d + 0.15, l)), y = r(THEKE_Y(l)), s = F / (STAND.d + 0.15);
  let k = `<g transform="scale(${s.toFixed(4)})">`;
  const puppe = (dx, h, rock) => {
    const w = h * 0.52;
    let g = `<path d="M${r((dx - w / 2) * 1000) / 1000} 0 Q${r((dx - w * 0.62) * 1000) / 1000} ${r(-h * 0.5 * 1000) / 1000} ${r((dx - w * 0.3) * 1000) / 1000} ${r(-h * 0.7 * 1000) / 1000} Q${dx} ${r(-h * 1.08 * 1000) / 1000} ${r((dx + w * 0.3) * 1000) / 1000} ${r(-h * 0.7 * 1000) / 1000} Q${r((dx + w * 0.62) * 1000) / 1000} ${r(-h * 0.5 * 1000) / 1000} ${r((dx + w / 2) * 1000) / 1000} 0 Z" fill="${rock}"/>`;
    g += `<ellipse cx="${dx}" cy="${r(-h * 0.72 * 1000) / 1000}" rx="${r(w * 0.25 * 1000) / 1000}" ry="${r(h * 0.15 * 1000) / 1000}" fill="#f5dcc6"/>`;
    g += `<path d="M${r((dx - w * 0.22) * 1000) / 1000} ${r(-h * 0.8 * 1000) / 1000} Q${dx} ${r(-h * 0.92 * 1000) / 1000} ${r((dx + w * 0.22) * 1000) / 1000} ${r(-h * 0.8 * 1000) / 1000}" stroke="#4a2a1a" stroke-width="${r(h * 0.04 * 1000) / 1000}" fill="none"/>`;
    g += `<ellipse cx="${dx}" cy="${r(-h * 0.36 * 1000) / 1000}" rx="${r(w * 0.3 * 1000) / 1000}" ry="${r(h * 0.2 * 1000) / 1000}" fill="#f8f0de"/>`;
    g += `<circle cx="${dx}" cy="${r(-h * 0.38 * 1000) / 1000}" r="${r(h * 0.08 * 1000) / 1000}" fill="#d9302c"/><circle cx="${r((dx + w * 0.08) * 1000) / 1000}" cy="${r(-h * 0.3 * 1000) / 1000}" r="${r(h * 0.05 * 1000) / 1000}" fill="#e9b23a"/>`;
    g += `<circle cx="${r((dx - w * 0.08) * 1000) / 1000}" cy="${r(-h * 0.7 * 1000) / 1000}" r="${r(h * 0.02 * 1000) / 1000}" fill="#c84a4a"/><circle cx="${r((dx + w * 0.08) * 1000) / 1000}" cy="${r(-h * 0.7 * 1000) / 1000}" r="${r(h * 0.02 * 1000) / 1000}" fill="#c84a4a"/>`;
    g += `<path d="M${r((dx + w * 0.1) * 1000) / 1000} ${r(-h * 0.95 * 1000) / 1000} Q${r((dx + w * 0.42) * 1000) / 1000} ${r(-h * 0.7 * 1000) / 1000} ${r((dx + w * 0.4) * 1000) / 1000} ${r(-h * 0.2 * 1000) / 1000}" stroke="#fff" stroke-width="${r(h * 0.035 * 1000) / 1000}" opacity=".45" fill="none"/>`;
    return g;
  };
  k += puppe(-0.17, 0.1, "#2f5fa0") + puppe(-0.08, 0.15, "#e0a23a") + puppe(0.06, 0.24, "#c8302c") + `</g>`;
  S.teil({ oben: true, id: "matrjoschka", de: "die Matrjoschka", syl: "ma-TRJOSCH-ka", it: "la matrioska", itSyl: "ma-tri-O-ska", en: "nesting doll", x, y, steht: true, kunst: k,
    tipp: "In einer Matrjoschka steckt eine kleinere Puppe, darin noch eine." });
}
{
  /* Pelmeni: Schale mit Teigtaschen und einem Klecks Schmand */
  const l = -5.1, x = r(X(STAND.d + 0.15, l)), y = r(THEKE_Y(l)), s = F / (STAND.d + 0.15);
  let k = `<g transform="scale(${s.toFixed(4)})">`;
  k += `<path d="M-.11 -.06 Q-.1 0 0 0 Q.1 0 .11 -.06 Z" fill="#f4f2ec"/><path d="M-.11 -.06 Q-.1 0 0 0 Q.1 0 .11 -.06" stroke="#2f5fa0" stroke-width=".008" fill="none"/>`;
  k += `<path d="M-.11 -.06 h.22 l-.005 .012 h-.21 Z" fill="#2f5fa0"/>`;
  for (const [dx, dy] of [[-0.06, -0.075], [0, -0.08], [0.06, -0.074], [-0.03, -0.095], [0.035, -0.096]]) k += `<ellipse cx="${dx}" cy="${dy}" rx=".03" ry=".018" fill="#f7ecd4" stroke="#d9c49c" stroke-width=".005"/>`;
  k += `<ellipse cx=".005" cy="-.108" rx=".025" ry=".012" fill="#fffdf6"/><path d="M-.04 -.1 l.004 -.01 M.05 -.098 l.006 -.009" stroke="#5a8a3a" stroke-width=".008"/></g>`;
  S.teil({ oben: true, id: "pelmeni", de: "die Pelmeni", syl: "pel-ME-ni", it: "i pelmeni", itSyl: "pel-ME-ni", en: "pelmeni", x, y, steht: true, kunst: k + flaeche(-3.5, -3.6, 7, 3.8, 0.6),
    tipp: "Pelmeni sind kleine Teigtaschen mit Fleisch. Man isst sie mit Schmand." });
}
{
  /* Tulaer Lebkuchen (Prjanik): flach, rechteckig, mit Zuckerguss-Muster, angelehnt */
  const l = -4.75, x = r(X(STAND.d + 0.15, l)), y = r(THEKE_Y(l)), s = F / (STAND.d + 0.15);
  let k = `<g transform="scale(${s.toFixed(4)})">`;
  k += `<path d="M-.07 0 L-.05 -.16 L.07 -.15 L.08 0 Z" fill="#9a5a2a"/><path d="M-.05 -.16 L.07 -.15 L.075 -.13 L-.048 -.142 Z" fill="#b8763a"/>`;
  k += `<path d="M-.035 -.03 Q.0 -.12 .055 -.03 M-.02 -.08 h.05 M0 -.13 v.03" stroke="#f6e8cc" stroke-width=".008" fill="none"/>`;
  k += `<circle cx=".01" cy="-.06" r=".015" fill="none" stroke="#f6e8cc" stroke-width=".006"/></g>`;
  S.teil({ oben: true, id: "lebkuchen", de: "der Lebkuchen", syl: "LEB-ku-chen", it: "il pan di zenzero", itSyl: "PAN di ZEN-ze-ro", en: "gingerbread", x, y, steht: true, kunst: k + flaeche(-2.2, -4.6, 4.6, 4.8, 0.6),
    tipp: "Der russische Lebkuchen heißt Prjanik. Er kommt oft aus der Stadt Tula." });
}
{
  /* Teeglas im Metallhalter (Podstakannik) in der Hand des Kunden */
  const x = r(KUNDE_HAND.x - 0.6), y = r(KUNDE_HAND.y + 1.2), s = F / 19.5;
  let k = `<g transform="scale(${s.toFixed(4)})">`;
  k += `<path d="M-.035 -.1 L-.03 0 H.03 L.035 -.1 Z" fill="#c9a050" opacity=".95"/><path d="M-.035 -.1 L-.03 0 H.03 L.035 -.1" stroke="#7a5418" stroke-width=".006" fill="none"/>`;
  k += `<path d="M-.033 -.04 h.066 M-.032 -.07 h.064" stroke="#7a5418" stroke-width=".005"/>`;
  k += `<path d="M-.038 -.13 L-.035 -.1 H.035 L.038 -.13 Z" fill="#e6e9ec" opacity=".8"/><path d="M-.035 -.12 H.035" stroke="#a5501e" stroke-width=".01"/>`;
  k += `<path d="M-.035 -.085 q-.03 0 -.03 .03 q0 .03 .03 .03" stroke="#a37428" stroke-width=".01" fill="none"/>`;
  k += `<path d="M0 -.14 q-.012 -.03 0 -.06 q.012 -.03 0 -.06" stroke="#fff" stroke-width=".007" opacity=".7" fill="none"/></g>`;
  S.teil({ oben: true, id: "teeglas", de: "das Teeglas", syl: "TEE-glas", it: "il bicchiere da tè", itSyl: "bic-CHIE-re da TÈ", en: "tea glass", x, y, steht: true, kunst: k + flaeche(-1.8, -4, 3.6, 4.2, 0.5),
    tipp: "In Russland trinkt man Tee oft aus einem Glas mit Metallhalter." });
}

/* =====================================================================
   13 — DIE TOURISTIN mit der Kamera (fotografiert die Kathedrale)
   ===================================================================== */
{
  const d = 16.5, l = 3.4, x = r(X(d, l)), y = r(Y(d));
  const pose = { kipp: 0, lende: 1, brust: 0, nacken: 2, kopf: 0, schulterL: { vor: 70, seit: 0, dreh: -30 }, ellbogenL: 120, unterarmL: 40, handL: 0, fingerL: 0.6,
    schulterR: { vor: 70, seit: 0, dreh: -30 }, ellbogenR: 120, unterarmR: 40, handR: 0, fingerR: 0.6, huefteL: { vor: 2, seit: 4 }, knieL: 2, fussL: 0, huefteR: { vor: -4, seit: 4 }, knieR: 4, fussR: 0 };
  const m = B.mensch({ id: "msk_tour", geschlecht: "w", blick: -140, neigung: 3, frisur: "lang", haarfarbe: "hellbraun", haut: "hell", pose,
    kleidung: { jacke: { stueck: "jacke", farbe: "#c0473a" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "stiefel" }, kopf: { stueck: "muetze", farbe: "#efe8dc" }, zubehoer: { stueck: "schal", farbe: "#2f5f95" } } }, r(1.66 * F / d));
  S.teil({ id: "touristin", de: "die Touristin", syl: "tou-RIS-tin", it: "la turista", itSyl: "tu-RI-sta", en: "tourist", x, y, kunst: kompakt(m.svg, 2),
    tipp: "Viele Touristen fotografieren die bunten Kuppeln." });
  const hx = x + (m.z.handL.x + m.z.handR.x) / 2 * m.k, hy = y + (m.z.handL.y + m.z.handR.y) / 2 * m.k;
  let k = `<rect x="-2.2" y="-1.5" width="4.4" height="3" rx=".6" fill="#22252b"/><rect x="-2.2" y="-1.5" width="4.4" height=".7" rx=".3" fill="#4a4f58"/>`;
  k += `<circle cx=".2" cy=".1" r="1.05" fill="#3a3f48"/><circle cx=".2" cy=".1" r=".55" fill="#1a2a3a"/><circle cx=".4" cy="-.1" r=".18" fill="#9fc0ff"/><rect x="-1.9" y="-2" width="1" height=".5" fill="#22252b"/>`;
  S.teil({ oben: true, id: "kamera", de: "die Kamera", syl: "KA-me-ra", it: "la macchina fotografica", itSyl: "MAC-chi-na fo-to-GRA-fi-ca", en: "camera", x: r(hx), y: r(hy), kunst: k });
}

/* =====================================================================
   14 — DIE KRÄHE (Nebelkrähe: grau, Kopf, Flügel und Schwanz schwarz)
   ===================================================================== */
{
  const d = 11.5, l = 0.6, x = r(X(d, l)), y = r(Y(d)), s = F / d;
  let k = `<g transform="scale(${s.toFixed(4)})">`;
  k += `<path d="M-.02 -.01 L-.03 -.09 M.03 -.01 L.02 -.09" stroke="#2a2a2e" stroke-width=".012"/><path d="M-.05 0 h.05 M0 0 h.06" stroke="#2a2a2e" stroke-width=".01"/>`;
  k += `<path d="M-.2 -.17 L-.1 -.15 Q-.02 -.08 .06 -.1 Q.13 -.12 .14 -.2 Q.12 -.25 .05 -.24 Q-.06 -.24 -.12 -.2 Z" fill="${S.lg("kraehe", [[0, "#7c7f86"], [1, "#b9bcc2"]], 0, 0, 0, 1)}"/>`;
  k += `<path d="M-.22 -.19 L-.1 -.16 L-.04 -.2 Q-.1 -.22 -.16 -.21 Z" fill="#1d1d22"/>`;
  k += `<path d="M-.1 -.205 Q-.02 -.24 .07 -.22 Q.02 -.17 -.06 -.155 Z" fill="#1d1d22"/>`;
  k += `<circle cx=".12" cy="-.24" r=".045" fill="#1d1d22"/><path d="M.16 -.25 L.22 -.235 L.16 -.225 Z" fill="#1d1d22"/><circle cx=".135" cy="-.25" r=".008" fill="#ddd"/>`;
  k += `<path d="M.08 -.21 Q.11 -.18 .14 -.2" stroke="#1d1d22" stroke-width=".03" fill="none"/></g>`;
  S.teil({ id: "kraehe", de: "die Krähe", syl: "KRÄ-he", it: "la cornacchia", itSyl: "cor-NAC-chia", en: "crow", x, y, steht: true, kunst: k + flaeche(-3.2, -3.6, 6.4, 3.8, 0.6),
    tipp: "In Moskau leben viele graue Nebelkrähen." });
}

/* =====================================================================
   DAVOR — Leben auf dem Platz: Spaziergänger in der Ferne (keine Tippfläche)
   ===================================================================== */
{
  S.def(`<g id="${S.id("mn")}"><path d="M-.13 0 V-.82 h.12 V0 Z M.02 0 V-.82 h.12 V0 Z" fill="#2c2b33"/><path d="M-.24 -.78 L-.22 -1.45 Q0 -1.55 .22 -1.45 L.24 -.78 Z" fill="currentColor"/><path d="M-.24 -.78 L-.22 -1.45 L-.12 -1.48 L-.14 -.78 Z" fill="#000" opacity=".25"/><circle cy="-1.6" r=".12" fill="#d8b096"/><path d="M-.14 -1.64 Q0 -1.82 .14 -1.64 Z" fill="#3a2a22"/></g>`);
  S.def(`<g id="${S.id("fr")}"><path d="M-.11 0 V-.6 h.1 V0 Z M.02 0 V-.6 h.1 V0 Z" fill="#2c2b33"/><path d="M-.27 -.6 L-.2 -1.42 Q0 -1.52 .2 -1.42 L.27 -.6 Z" fill="currentColor"/><path d="M-.27 -.6 L-.2 -1.42 L-.1 -1.45 L-.15 -.6 Z" fill="#000" opacity=".25"/><circle cy="-1.57" r=".12" fill="#d8b096"/><path d="M-.15 -1.6 Q0 -1.8 .15 -1.6 Z" fill="currentColor"/></g>`);
  const FARBEN = ["#2f3640", "#7a2a2a", "#3b4f6b", "#5a4a3a", "#c0473a", "#2d4a3c", "#d9cfc0", "#6b5b7a", "#1f2a3a", "#b8862e"];
  const leute = [];
  /* Gruppen: am GUM entlang, in der Mitte des Platzes, am Denkmal; Lücken dazwischen */
  for (const [d, l, n, sp] of [[205, -30, 4, 2], [240, -26, 3, 2], [262, -31, 3, 2], [120, -8, 3, 2.5], [150, -14, 4, 3], [180, 2, 3, 2], [215, -4, 5, 4], [255, 8, 4, 3], [300, -6, 6, 5], [318, -20, 4, 3], [95, 6, 2, 1.5], [70, -2, 2, 1.5], [62, 12, 2, 1.2], [140, 14, 3, 2]]) {
    for (let i = 0; i < n; i++) leute.push([d + (rnd() - 0.5) * sp * 3, l + (rnd() - 0.5) * sp * 2]);
  }
  leute.sort((a, b) => b[0] - a[0]);
  let g = "";
  for (const [d, l] of leute) {
    const x = X(d, l), y = Y(d), s = F / d;
    if (x < 118 || (x > 300 && d < 200) || x > 268) continue;
    const c = FARBEN[Math.floor(rnd() * FARBEN.length)], typ = rnd() < 0.5 ? "fr" : "mn";
    g += `<path d="M${r(x)} ${r(y)} l${r(-1.7 * s)} ${r(0.1 * s)} v${r(0.12 * s)} Z" fill="#1b2247" opacity=".25"/>`;
    g += `<use href="#${S.id(typ)}" transform="translate(${r(x)} ${r(y)}) scale(${(s * (0.95 + rnd() * 0.1)).toFixed(3)})" color="${c}"/>`;
  }
  S.davor(`<g pointer-events="none">${g}</g>`);
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/moskau.js"));
console.log(aus);
