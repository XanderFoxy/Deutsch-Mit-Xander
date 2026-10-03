#!/usr/bin/env node
/* =====================================================================
   MEXIKO — CHICHÉN ITZÁ (FASSUNG 854) — Bilderwelt neu
   ---------------------------------------------------------------------
   XANDER (03.10.): „die bekanntesten Städte in anderen Ländern, die
   berühmt für irgendetwas sind … als Profi-Grafikdesigner auf
   Hollywood-Niveau … mit größter Sorgfalt und Präzision“.

   RECHERCHE (INAH-Daten zu El Castillo, Lageplan der Großen Plaza,
   Fotos der Tagundnachtgleiche, Berichte über die Händler in der
   Ruinenstätte, Tracht der Maya in Yucatán):
   - STANDORT: die Große Plaza von Chichén Itzá (Yucatán), nordnordwest-
     lich der Pyramide, am Rasen bei der Plattform der Venus. Blick nach
     SÜDSÜDOST auf EL CASTILLO, die Pyramide des Kukulcán: links die
     NORDSEITE mit der Haupttreppe, rechts die WESTSEITE (beide sind
     restauriert; Süd- und Ostseite sind noch teilweise Ruine).
   - El Castillo: 24 m hoch, mit dem Tempel 30 m, Grundfläche 55,3 m im
     Quadrat, NEUN Terrassen mit eingetieften rechteckigen Feldern. Auf
     jeder Seite eine Treppe mit 91 Stufen (4 × 91 + Plattform = 365).
     Am Fuß der Nordtreppe zwei große SCHLANGENKÖPFE mit offenem Maul
     (Kukulcán, die gefiederte Schlange). Oben der Tempel; sein Eingang
     im Norden ist durch zwei SCHLANGENSÄULEN dreigeteilt (Kopf unten,
     Rassel-Schwanz oben trägt den Türsturz).
   - Zur Tagundnachtgleiche (März/September) am späten Nachmittag steht
     die Sonne im Westsüdwesten: Die Westseite leuchtet warm, die Nord-
     seite liegt im Schatten, und die Terrassenecken werfen sieben
     Dreiecke aus Licht auf die Westwange der Nordtreppe – eine Schlange
     aus Licht, die zum steinernen Kopf hinabkriecht. Schatten fallen
     nach links (Osten).
   - Links (Osten) liegt der TEMPEL DER KRIEGER mit der „Gruppe der
     tausend Säulen“ davor. Er steht in Wirklichkeit weiter links; im
     Bild ist er wie auf einem Panorama an den Rand gerückt (Reihenfolge
     nach Himmelsrichtungen bleibt).
   - Auf den Wegen verkaufen Maya-Familien aus den Dörfern Kunsthand-
     werk: Jaguar-Pfeifen aus Ton (sie „brüllen“), Masken, bunte
     Totenköpfe (Calaveras, Tag der Toten) mit orangen Studentenblumen
     (Cempasúchil), Rasseln (Maracas), Hängematten (Yucatán ist berühmt
     dafür), gestreifte Sarapes/Ponchos, Sombreros, Piñatas, Fähnchen aus
     Seidenpapier (Papel picado). Der Stand hat ein Palmdach (Palapa).
     Die Verkäuferin trägt den HUIPIL: weißes Baumwollkleid mit bunt
     gestickten Blumen am viereckigen Halsausschnitt.
   - Mittagessen der Händlerin: Maistortillas im Tuch, Tacos mit
     Cochinita pibil und roten Zwiebeln, Guacamole im Steinmörser
     (Molcajete), Avocado, Limetten.
   - Pflanzen und Tiere: der heilige Kapokbaum (Ceiba, Yaxché) mit
     Brettwurzeln, die Agave Henequén (Fasern für Seile und Hängematten),
     Leguane sonnen sich auf den warmen Steinen. Mexikos Flagge: grün,
     weiß, rot, in der Mitte der Adler auf dem Nopal-Kaktus mit Schlange.
   BLICK: Augenhöhe 1,6 m, Horizont y = 132, Brennweite 300; die Pyramide
   ist im Raum gebaut (X Osten, Y oben, Z Norden) und ins Bild gerechnet.
   Einheiten je Meter am Boden vorn: s(y) = (y − 132) / 1,6 (Tisch y 196:
   40 → 0,74 m hoch = 30; Verkäuferin am Stand y 177: 28 → 1,56 m = 44).
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "mexiko", titel: "Mexiko", emoji: "🌵", thema: "Länder", kuerzel: "mex", fassung: 854 });
const rnd = zufall(1519);
const r = B.r;
const HY = 132;
const sy = (y) => (y - HY) / 1.6;
const um = (ox, oy, svg) => `<g transform="translate(${r(-ox)} ${r(-oy)})">${svg}</g>`;
const knapp = (svg) => svg.replace(/ (d|x1|y1|x2|y2|cx|cy|rx|ry)="([^"]*)"/g, (m, a, v) => ` ${a}="${v.replace(/-?\d+\.\d+/g, (n) => String(Math.round(+n)))}"`);
const pts = (a) => a.map(([x, y]) => `${r(x)} ${r(y)}`).join(" L");
B.mensch({}, 10);

/* ---------- Kamera: Betrachter NNW der Pyramide, 112 m vom Mittelpunkt ---------- */
const KAM = (() => {
  const b = 335 * Math.PI / 180, D = 112, fb = b - Math.PI, rb = fb + Math.PI / 2;
  return { vx: D * Math.sin(b), vz: D * Math.cos(b), fx: Math.sin(fb), fz: Math.cos(fb), rx: Math.sin(rb), rz: Math.cos(rb), F: 300, CX: 134 };
})();
const P = (X, Y, Z) => { const dx = X - KAM.vx, dz = Z - KAM.vz; const d = dx * KAM.fx + dz * KAM.fz, l = dx * KAM.rx + dz * KAM.rz; return [KAM.CX + KAM.F * l / d, HY - KAM.F * (Y - 1.6) / d]; };
const flaech = (a, fill, extra = "") => `<path d="M${pts(a.map((p) => P(...p)))} Z" fill="${fill}"${extra}/>`;

/* ---------- Stoffe ---------------------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("dunst")}" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="1.5"/></filter>`);
S.def(`<pattern id="${S.id("wald")}" width="3" height="2.2" patternUnits="userSpaceOnUse"><rect width="3" height="2.2" fill="#3f5f33"/><circle cx=".8" cy=".8" r=".8" fill="#4a6b3a"/><circle cx="2.3" cy="1.6" r=".85" fill="#36542c"/><circle cx="2.4" cy=".3" r=".5" fill="#56763f"/></pattern>`);
S.def(`<pattern id="${S.id("gras")}" width="4" height="1.6" patternUnits="userSpaceOnUse"><rect width="4" height="1.6" fill="#6f9440"/><path d="M.4 1.6 l.2 -1 M1.6 1.6 l-.1 -.9 M2.7 1.6 l.25 -1.1 M3.5 1.6 l-.15 -.8" stroke="#7d9f4b" stroke-width=".22"/></pattern>`);
S.def(`<pattern id="${S.id("palapa")}" width="3" height="2.4" patternUnits="userSpaceOnUse"><rect width="3" height="2.4" fill="#b8955a"/><path d="M0 .4 Q1.5 1.4 3 .4 M-1.5 1.6 Q0 2.6 1.5 1.6 M1.5 1.6 Q3 2.6 4.5 1.6" stroke="#8a6a38" stroke-width=".35" fill="none"/><path d="M.6 0 L.9 2.4 M2.2 0 L2 2.4" stroke="#d2b47a" stroke-width=".2"/></pattern>`);
S.def(`<pattern id="${S.id("sarape")}" width="12" height="2.6" patternUnits="userSpaceOnUse"><rect width="12" height="2.6" fill="#b52d3a"/><rect y=".2" width="12" height=".3" fill="#f1c232"/><rect y=".6" width="12" height=".5" fill="#1e7a6e"/><rect y="1.2" width="12" height=".2" fill="#f4efe2"/><rect y="1.5" width="12" height=".4" fill="#e07a2a"/><rect y="2" width="12" height=".25" fill="#2c3f8f"/></pattern>`);
const WALD = `url(#${S.id("wald")})`;
const DUNST = `url(#${S.id("dunst")})`;
const LICHT = S.lg("kalklicht", [[0, "#efd7a8"], [1, "#e0bf8a"]]);         /* Westseite in der Abendsonne */
const SCHATTEN = S.lg("kalkschatten", [[0, "#b2aa9a"], [1, "#9a9284"]]);  /* Nordseite im Schatten */

/* =====================================================================
   KULISSE — Abendhimmel, Wald am Horizont, Rasen der Plaza, Weg
   ===================================================================== */
{
  let k = `<rect width="320" height="${HY + 1}" fill="${S.lg("himmel", [[0, "#3a78bd"], [0.5, "#7fb3dc"], [0.85, "#e3d9bf"], [1, "#f4dcae"]])}"/>`;
  k += `<rect width="320" height="${HY + 1}" fill="${S.rg("abendsonne", [[0, "#fff1c8", 0.85], [0.25, "#ffe0a0", 0.35], [1, "#ffe0a0", 0]], 1.02, 0.55, 0.7)}"/>`;
  for (const [x, y, w] of [[60, 34, 22], [96, 20, 14], [222, 26, 12], [30, 60, 10], [252, 48, 9]]) {
    k += `<ellipse cx="${x}" cy="${y + 2}" rx="${w * 1.3}" ry="${r(w * 0.2)}" fill="#e6c9a8" opacity=".5" filter="${DUNST}"/>`;
    for (let i = 0; i < 4; i++) k += `<circle cx="${r(x - w * 0.7 + i * w * 0.46)}" cy="${r(y - Math.sin((i + 0.5) / 4 * Math.PI) * w * 0.3)}" r="${r(w * (0.28 + 0.12 * Math.sin((i + 0.5) / 4 * Math.PI)))}" fill="#fffaf0" opacity=".82" filter="${DUNST}"/>`;
  }
  /* Niedriger Trockenwald (Selva baja) rund um die Plaza */
  let d = `M0 ${HY + 1} L0 121`;
  for (let x = 0; x <= 320; x += 4) d += ` L${x} ${r(118 + Math.sin(x * 0.11) * 2 + Math.sin(x * 0.37) * 1.4 + rnd() * 2.2)}`;
  d += ` L320 ${HY + 1} Z`;
  k += `<path d="${d}" fill="${WALD}"/><path d="${d}" fill="${S.lg("waldluft", [[0, "#b9c9b6", 0.5], [1, "#5d7a47", 0.15]])}"/>`;
  for (const [x, h] of [[18, 10], [74, 7], [262, 9], [302, 12]]) k += `<ellipse cx="${x}" cy="${118 - h * 0.4}" rx="${h * 0.9}" ry="${h * 0.55}" fill="#4f6d3d" opacity=".9"/><ellipse cx="${x}" cy="${118 - h * 0.4}" rx="${h * 0.9}" ry="${h * 0.55}" fill="#b9c9b6" opacity=".35"/>`;
  /* Rasen der Großen Plaza mit Mähstreifen und trockenen Stellen */
  k += `<rect x="0" y="${HY}" width="320" height="${200 - HY}" fill="url(#${S.id("gras")})"/>`;
  k += `<rect x="0" y="${HY}" width="320" height="${200 - HY}" fill="${S.lg("rasen", [[0, "#cdd8a0", 0.55], [0.3, "#9cb35e", 0.15], [1, "#3f6a24", 0.25]])}"/>`;
  for (let i = 0; i < 12; i++) { const y = HY + 3 + Math.pow(rnd(), 1.3) * 62, x = rnd() * 320, s = sy(y); k += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(0.7 * s)}" ry="${r(0.1 * s)}" fill="#b8a76a" opacity=".22"/>`; }
  /* Weg aus weißem Kalkschotter zur Nordtreppe (Sacbé-Richtung) */
  const [fx, fy] = P(0, 0, 40);
  const [wx0, wy0] = P(-6, 0, 38), [wx1] = P(-2, 0, 38);
  k += `<path d="M${r(wx0)} ${r(wy0)} L${r(wx1)} ${r(wy0)} L178 200 L132 200 Z" fill="${S.lg("weg", [[0, "#d9cdb0"], [1, "#c9b993"]])}" opacity=".8"/>`;
  for (let i = 0; i < 30; i++) { const t = Math.pow(rnd(), 1.4), y = wy0 + (200 - wy0) * t, xl = wx0 + (132 - wx0) * t, xr = wx1 + (178 - wx1) * t, x = xl + rnd() * (xr - xl); k += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(0.15 + t * 0.5)}" fill="#a99b7c" opacity=".5"/>`; }
  /* Schatten der Pyramide fällt nach Osten (links) auf den Rasen */
  k += `<path d="M${pts([P(27.6, 0, 27.6), P(27.6, 0, -27.6), P(75, 0, -14), P(70, 0, 30)])} Z" fill="#2b3a1a" opacity=".25" filter="${DUNST}"/>`;
  S.hinten(k);
}

/* =====================================================================
   1 — DER TEMPEL (der Krieger) und 2 — DIE SÄULE (die „tausend Säulen“)
   ganz links (Osten), weiter weg
   ===================================================================== */
{
  const X0 = 16, Y0 = 128;
  let k = "";
  /* vier Stufen-Terrassen, Treppe zur Plaza (Westseite), Tempel oben */
  const stufen = [[-21, 0, 21, 4.2], [-18, 4.2, 18, 8.2], [-15.4, 8.2, 15.4, 12], [-13, 12, 13, 15.6]];
  for (const [a, y0, b, y1] of stufen.slice().reverse()) {
    k += `<path d="M${a} ${-y0} L${b} ${-y0} L${b - 1} ${-y1} L${a + 1} ${-y1} Z" fill="${S.lg("ktstein", [[0, "#cdb48a"], [1, "#b39a72"]], 0, 0, 1, 0)}"/>`;
    for (let x = a + 2.4; x < b - 2; x += 3.2) k += `<rect x="${r(x)}" y="${r(-y1 + 1)}" width="2" height="${r(y1 - y0 - 2)}" fill="#9c845e" opacity=".55"/>`;
  }
  k += `<path d="M-3.6 0 L3.6 0 L2.6 -15.6 L-2.6 -15.6 Z" fill="#d8c29a"/>`;
  for (let y = -1; y > -15.6; y -= 1.1) k += `<line x1="${r(-3.5 - y * 0.06)}" y1="${r(y)}" x2="${r(3.5 + y * 0.06)}" y2="${r(y)}" stroke="#a48c66" stroke-width=".3"/>`;
  k += `<path d="M-11 -15.6 L11 -15.6 L11 -22.4 L-11 -22.4 Z" fill="#bea47a"/><rect x="-11.6" y="-24" width="23.2" height="1.8" fill="#d6c095"/>`;
  k += `<rect x="-5" y="-21" width="10" height="5.4" fill="#4a3a28"/>`;
  /* zwei Schlangensäulen am Eingang, oben der Chac Mool (liegende Figur) */
  for (const x of [-3.4, 3.4]) k += `<rect x="${x - 0.7}" y="-21.4" width="1.4" height="5.8" fill="#d9c49c"/><path d="M${x - 1.1} -15.6 L${x + 1.1} -15.6 L${x + 1.4} -14.6 L${x - 1.4} -14.6 Z" fill="#c8b085"/>`;
  k += `<path d="M-2 -16.2 q1 -1.4 2.4 -1 q1 .2 1.6 1 Z" fill="#9c845e"/>`;
  k += `<rect x="-21" y="-15.6" width="42" height="15.6" fill="#e9d6b0" opacity=".2"/>`;
  S.teil({ id: "tempel", de: "der Tempel", syl: "TEM-pel", it: "il tempio", itSyl: "TEM-pio", en: "temple", x: X0, y: Y0, kunst: k,
    tipp: "Das ist der Tempel der Krieger. Oben liegt die steinerne Figur Chac Mool." });

  /* Säulenreihen vor dem Tempel (Pfeiler mit Reliefs, ohne Dach) */
  let s = "";
  for (let reihe = 0; reihe < 3; reihe++) {
    const yb = 4.6 + reihe * 2.4, h = 9 + reihe * 1.2, w = 1.7 + reihe * 0.25;
    for (let i = 0; i < 9; i++) {
      const x = -22 + i * (5.6 + reihe * 0.4) + reihe * 1.6;
      if (x > 30) continue;
      /* viereckige Pfeiler: Vorderseite im Schatten (Sonne von rechts hinten), rechte Seite hell */
      s += `<rect x="${r(x)}" y="${r(yb - h)}" width="${r(w * 0.72)}" height="${r(h)}" fill="#c3ab82"/><rect x="${r(x + w * 0.72)}" y="${r(yb - h)}" width="${r(w * 0.28)}" height="${r(h)}" fill="#ecd7ad"/>`;
      s += `<rect x="${r(x - 0.2)}" y="${r(yb - h - 0.6)}" width="${r(w + 0.4)}" height=".7" fill="#d4bd92"/><rect x="${r(x + w * 0.12)}" y="${r(yb - h + 1.6)}" width="${r(w * 0.48)}" height="${r(h * 0.55)}" fill="#a68e66" opacity=".45"/>`;
    }
  }
  S.teil({ id: "saeule", de: "die Säule", syl: "SÄU-le", it: "la colonna", itSyl: "co-LON-na", en: "column", x: X0 + 2, y: Y0, kunst: s,
    tipp: "Vor dem Tempel stehen so viele Säulen, dass man sie die „Tausend Säulen“ nennt." });
}

/* =====================================================================
   3 — DIE PYRAMIDE (El Castillo, Pyramide des Kukulcán) — Lupe:
       Treppe, Schlangenkopf, Schlangensäule, Terrasse
   ===================================================================== */
const W0 = 27.65, WT = 9.75, HT = 24, NT = 9, TH = HT / NT;
const wT = (i) => W0 - i * (W0 - WT) / NT;           /* halbe Breite am Fuß der Terrasse i */
const SB = 4.5, BAL = 0.95;                           /* halbe Treppenbreite, Wange */
const pyrUnter = [];
{
  let k = "";
  /* --- der Tempel oben (12 × 12 m, 6 m hoch) --- */
  const TW = 6, TY0 = HT, TY1 = 30;
  k += flaech([[-TW, TY0, TW], [TW, TY0, TW], [TW, TY1, TW], [-TW, TY1, TW]], SCHATTEN);
  k += flaech([[-TW, TY0, -TW], [-TW, TY0, TW], [-TW, TY1, TW], [-TW, TY1, -TW]], LICHT);
  /* Gesims und Fries */
  k += flaech([[-TW - 0.3, 28.2, TW + 0.3], [TW + 0.3, 28.2, TW + 0.3], [TW + 0.3, 28.9, TW + 0.3], [-TW - 0.3, 28.9, TW + 0.3]], "#b8b4a8");
  k += flaech([[-TW - 0.3, 28.2, -TW - 0.3], [-TW - 0.3, 28.2, TW + 0.3], [-TW - 0.3, 28.9, TW + 0.3], [-TW - 0.3, 28.9, -TW - 0.3]], "#f3dfb4");
  /* Fries mit eingetieften Feldern über dem Gesims, oben eine schmale Dachkante */
  for (let x = -TW + 0.4; x < TW - 0.8; x += 1.5) k += flaech([[x, 29.1, TW + 0.02], [x + 1.1, 29.1, TW + 0.02], [x + 1.1, 29.75, TW + 0.02], [x, 29.75, TW + 0.02]], "#857f72", ` opacity=".6"`);
  for (let z = -TW + 0.4; z < TW - 0.8; z += 1.5) k += flaech([[-TW - 0.02, 29.1, z], [-TW - 0.02, 29.1, z + 1.1], [-TW - 0.02, 29.75, z + 1.1], [-TW - 0.02, 29.75, z]], "#c9a874", ` opacity=".6"`);
  k += flaech([[-TW - 0.2, 29.9, TW + 0.2], [TW + 0.2, 29.9, TW + 0.2], [TW + 0.2, 30.15, TW + 0.2], [-TW - 0.2, 30.15, TW + 0.2]], "#c4bcab");
  k += flaech([[-TW - 0.2, 29.9, -TW - 0.2], [-TW - 0.2, 29.9, TW + 0.2], [-TW - 0.2, 30.15, TW + 0.2], [-TW - 0.2, 30.15, -TW - 0.2]], "#f6e3bd");
  /* Nordeingang: drei Öffnungen, zwei Schlangensäulen (Kopf unten, Rassel oben) */
  const tuer = (x0, x1, z, y1 = 27.4) => flaech([[x0, TY0 + 0.1, z], [x1, TY0 + 0.1, z], [x1, y1, z], [x0, y1, z]], "#2b2219");
  k += tuer(-3.4, -1.5, TW + 0.02) + tuer(-0.95, 0.95, TW + 0.02) + tuer(1.5, 3.4, TW + 0.02);
  for (const x of [-1.22, 1.22]) {
    k += flaech([[x - 0.27, TY0 + 0.6, TW + 0.05], [x + 0.27, TY0 + 0.6, TW + 0.05], [x + 0.27, 27.4, TW + 0.05], [x - 0.27, 27.4, TW + 0.05]], "#c7c2b4");
    k += flaech([[x - 0.45, TY0, TW + 0.5], [x + 0.45, TY0, TW + 0.5], [x + 0.4, TY0 + 0.75, TW + 0.2], [x - 0.4, TY0 + 0.75, TW + 0.2]], "#b5b0a2");
    const [a, b] = [P(x - 0.4, 27.45, TW + 0.05), P(x + 0.4, 27.9, TW + 0.05)];
    k += `<path d="M${r(a[0])} ${r(b[1])} L${r(b[0])} ${r(b[1])} L${r((a[0] + b[0]) / 2)} ${r(a[1] + 0.3)} Z" fill="#c7c2b4"/>`;
  }
  /* Westeingang (eine Tür) */
  k += flaech([[-TW - 0.02, TY0 + 0.1, 1.2], [-TW - 0.02, TY0 + 0.1, -1.2], [-TW - 0.02, 27.4, -1.2], [-TW - 0.02, 27.4, 1.2]], "#3a2c1f");
  const tempelFlaeche = [P(-TW, TY0, TW), P(TW, TY0, TW), P(TW, TY1, TW), P(-TW, TY1, -TW)];

  /* --- neun Terrassen: Nord- (Schatten) und Westwand (Licht), oben zuerst --- */
  for (let i = NT - 1; i >= 0; i--) {
    const w0 = wT(i), w1 = w0 - 0.62, y0 = i * TH, y1 = y0 + TH;
    /* Westwand */
    k += flaech([[-w0, y0, -w0], [-w0, y0, w0], [-w1, y1, w1], [-w1, y1, -w1]], LICHT);
    /* Nordwand links und rechts der Treppe */
    k += flaech([[-w0, y0, w0], [w0, y0, w0], [w1, y1, w1], [-w1, y1, w1]], SCHATTEN);
    /* Gesims oben an jeder Terrasse (hell an der Westseite) */
    k += flaech([[-w1 - 0.12, y1 - 0.42, -w1 - 0.12], [-w1 - 0.12, y1 - 0.42, w1 + 0.12], [-w1 - 0.12, y1, w1 + 0.12], [-w1 - 0.12, y1, -w1 - 0.12]], "#f6e3bd");
    k += flaech([[-w1 - 0.12, y1 - 0.42, w1 + 0.12], [w1 + 0.12, y1 - 0.42, w1 + 0.12], [w1 + 0.12, y1, w1 + 0.12], [-w1 - 0.12, y1, w1 + 0.12]], "#c4bcab");
    /* eingetiefte Felder */
    const fh0 = y0 + 0.55, fh1 = y1 - 0.75, sl = (y) => w0 - (w0 - w1) * (y - y0) / TH;
    const n = Math.max(2, Math.round((w0 - SB - BAL) / 2.6));
    for (let j = 0; j < n; j++) {
      const ua = SB + BAL + 0.5 + j * (w0 - SB - BAL - 0.9) / n, ub = ua + (w0 - SB - BAL - 0.9) / n - 0.55;
      for (const sg of [-1, 1]) {
        const xa = sg * ua, xb = sg * ub;
        k += flaech([[xa, fh0, sl(fh0)], [xb, fh0, sl(fh0)], [xb, fh1, sl(fh1)], [xa, fh1, sl(fh1)]], "#7c7468", ` opacity=".5"`);
      }
      for (const sg of [-1, 1]) k += flaech([[-sl(fh0), fh0, sg * ua], [-sl(fh0), fh0, sg * ub], [-sl(fh1), fh1, sg * ub], [-sl(fh1), fh1, sg * ua]], "#b98f5c", ` opacity=".5"`);
    }
  }
  /* Verwitterung: dunkle Flechtenstreifen */
  for (let i = 0; i < 70; i++) {
    const nord = rnd() < 0.6, y = rnd() * HT, w = W0 - (W0 - WT) * y / HT, u = (rnd() * 2 - 1) * w;
    if (nord && Math.abs(u) < SB + BAL + 0.3) continue;
    const [a, b] = nord ? [P(u, y, w + 0.05), P(u + 0.1, y - 0.8 - rnd(), w + 0.12)] : [P(-w - 0.05, y, u), P(-w - 0.12, y - 0.8 - rnd(), u)];
    k += `<line x1="${r(a[0])}" y1="${r(a[1])}" x2="${r(b[0])}" y2="${r(b[1])}" stroke="${nord ? "#5f5d55" : "#9a7f5a"}" stroke-width=".4" opacity=".45"/>`;
  }

  /* --- Westtreppe (Seitenwand nach Norden, im Schatten) --- */
  const ZF = WT + HT;                                 /* Fuß der Treppe (45°) */
  k += flaech([[-WT, HT, SB + BAL], [-ZF, 0, SB + BAL], [-W0, 0, SB + BAL]], "#aaa294");
  k += flaech([[-WT, HT, SB + BAL], [-ZF, 0, SB + BAL], [-ZF - 0.01, 0, -SB - BAL], [-WT - 0.01, HT, -SB - BAL]], S.lg("westtreppe", [[0, "#f2dcb0"], [1, "#e2c28e"]]));
  for (let st = 1; st < 91; st += 2) { const t = st / 91, xx = -(ZF - (ZF - WT) * t), yy = HT * t; const [a, b] = [P(xx, yy, SB), P(xx, yy, -SB)]; k += `<line x1="${r(a[0])}" y1="${r(a[1])}" x2="${r(b[0])}" y2="${r(b[1])}" stroke="#b08e5c" stroke-width=".25"/>`; }

  /* --- Nordtreppe: Westwange mit der „Schlange aus Licht“, Stufen, Wangen --- */
  const zS = (y) => ZF - y;                           /* Vorderkante der Treppe */
  /* Profil der Terrassen an der Treppenwange (gestuft) */
  const wange = [[-SB - BAL, HT + 0.5, WT], [-SB - BAL, 0.5, ZF]];
  const fussTerr = [];
  for (let i = 0; i < NT; i++) { fussTerr.push([-SB - BAL, i * TH, wT(i)]); fussTerr.push([-SB - BAL, (i + 1) * TH, wT(i) - 0.62]); }
  const seite = [[-SB - BAL, HT + 0.5, WT], [-SB - BAL, 0.5, ZF], [-SB - BAL, 0, ZF], ...fussTerr];
  k += flaech(seite, "#8d8a80");
  /* sieben Lichtdreiecke: die Terrassenecken werfen ihre Schatten auf die Wange */
  for (let i = 1; i < 8; i++) {
    const ya = (i - 0.15) * TH, yb = (i + 0.85) * TH;
    const za = zS(ya) + 0.5, zb = zS(yb) + 0.5, zt = wT(i) + 0.2;
    k += flaech([[-SB - BAL - 0.02, ya + 0.5, za], [-SB - BAL - 0.02, yb + 0.5, zb], [-SB - BAL - 0.02, ya + TH * 0.15, Math.max(zt, zS(ya) - 2.6)]], S.lg("lichtdreieck", [[0, "#ffe4ae"], [1, "#f0c98a"]]));
  }
  /* unterstes Stück der Wange bis zum Kopf: im Licht */
  k += flaech([[-SB - BAL - 0.02, TH * 0.85 + 0.5, zS(TH * 0.85)], [-SB - BAL - 0.02, 0.5, ZF], [-SB - BAL - 0.02, 0, ZF], [-SB - BAL - 0.02, 0, W0 + 0.6]], "#f2d09a");
  /* Stufen (über Augenhöhe sieht man nur die Setzstufen) */
  k += flaech([[-SB, HT, WT], [SB, HT, WT], [SB, 0, ZF], [-SB, 0, ZF]], S.lg("nordtreppe", [[0, "#b5b1a5"], [1, "#a29e92"]]));
  const stufenLinien = [];
  for (let st = 1; st < 91; st++) { const t = st / 91, zz = ZF - (ZF - WT) * t, yy = HT * t; const [a, b] = [P(-SB, yy, zz), P(SB, yy, zz)]; stufenLinien.push(`M${r(a[0])} ${r(a[1])} L${r(b[0])} ${r(b[1])}`); }
  k += `<path d="${stufenLinien.join(" ")}" stroke="#7e7b71" stroke-width=".22" opacity=".9"/>`;
  /* Wangen (Balustraden) beiderseits, oben glatt */
  for (const sg of [-1, 1]) k += flaech([[sg * SB, HT + 0.5, WT], [sg * (SB + BAL), HT + 0.5, WT], [sg * (SB + BAL), 0.5, ZF], [sg * SB, 0.5, ZF]], sg < 0 ? "#c9c3b2" : "#a8a497");
  /* --- die beiden Schlangenköpfe am Fuß der Nordtreppe --- */
  const kopf = (sg) => {
    /* Profil der Seite [z vor dem Treppenfuß, y]: Unterkiefer, offenes Maul,
       Oberlippe, eingerollte Schnauze, Brauenwulst */
    const xc = sg * (SB + BAL / 2), z0 = ZF - 0.4, lit = sg < 0, hw = 0.85;
    const prof = [[0, 0], [2.7, 0], [2.95, 0.12], [3.0, 0.38], [2.82, 0.5], [2.1, 0.62], [2.72, 1.0], [3.02, 1.16], [3.12, 1.46], [2.95, 1.78], [2.55, 1.9], [2.15, 2.04], [1.7, 2.22], [1.2, 2.12], [0.6, 2.22], [0, 2.06]];
    const seite = (x) => prof.map(([z, y]) => [x, y, z0 + z]);
    const LI = lit ? "#f0cc92" : "#aaa598", DU = lit ? "#d6a868" : "#928d80", SE = lit ? "#e8bd7e" : "#9f9a8d";
    let g = "";
    /* Schatten auf dem Rasen nach Osten */
    g += flaech([[xc - hw, 0, z0], [xc + hw + 3.2, 0, z0 + 0.4], [xc + hw + 3.4, 0, z0 + 3.1], [xc - hw, 0, z0 + 3]], "#2b3a1a", ` opacity=".28"`);
    /* Westseite (zur Sonne) */
    g += `<path d="M${pts(seite(xc - hw).map((p) => P(...p)))} Z" fill="${SE}"/>`;
    /* Oberseite (Kopf, über dem Auge) und Vorderseite der Schnauze */
    g += flaech([[xc - hw, 2.0, z0], [xc + hw, 2.0, z0], [xc + hw, 2.12, z0 + 0.9], [xc - hw, 2.12, z0 + 0.9]], DU);
    g += flaech([[xc - hw, 1.46, z0 + 3.12], [xc + hw, 1.46, z0 + 3.12], [xc + hw * 0.9, 1.8, z0 + 2.95], [xc - hw * 0.9, 1.8, z0 + 2.95]], DU);
    g += flaech([[xc - hw, 1.0, z0 + 2.72], [xc + hw, 1.0, z0 + 2.72], [xc + hw, 1.16, z0 + 3.02], [xc + hw, 1.46, z0 + 3.12], [xc - hw, 1.46, z0 + 3.12], [xc - hw, 1.16, z0 + 3.02]], LI);
    /* Unterkiefer vorn */
    g += flaech([[xc - hw, 0, z0 + 2.75], [xc + hw, 0, z0 + 2.75], [xc + hw, 0.38, z0 + 3.0], [xc - hw, 0.38, z0 + 3.0]], LI);
    /* offenes Maul (dunkel) mit Fangzähnen oben und unten */
    g += flaech([[xc - hw + 0.08, 0.42, z0 + 2.95], [xc + hw - 0.08, 0.42, z0 + 2.95], [xc + hw - 0.08, 1.0, z0 + 2.72], [xc - hw + 0.08, 1.0, z0 + 2.72]], "#2a1d14");
    g += flaech([[xc - hw + 0.2, 0.44, z0 + 2.9], [xc + hw - 0.2, 0.44, z0 + 2.9], [xc + hw - 0.25, 0.62, z0 + 2.4], [xc - hw + 0.25, 0.62, z0 + 2.4]], lit ? "#b4573a" : "#6e5a50");
    for (const t of [-0.62, 0.62]) {
      g += flaech([[xc + t - 0.12, 1.0, z0 + 2.73], [xc + t + 0.12, 1.0, z0 + 2.73], [xc + t, 0.55, z0 + 2.9]], "#f4ead2");
      g += flaech([[xc + t * 0.7 - 0.09, 0.42, z0 + 2.96], [xc + t * 0.7 + 0.09, 0.42, z0 + 2.96], [xc + t * 0.7, 0.7, z0 + 2.86]], "#f4ead2");
    }
    /* gespaltene Zunge liegt auf dem Boden vor dem Maul */
    g += flaech([[xc - 0.22, 0.02, z0 + 2.9], [xc + 0.22, 0.02, z0 + 2.9], [xc + 0.26, 0.02, z0 + 3.55], [xc + 0.04, 0.02, z0 + 3.25], [xc - 0.04, 0.02, z0 + 3.25], [xc - 0.26, 0.02, z0 + 3.55]], lit ? "#c9894c" : "#8a8172");
    /* Auge mit Brauenwulst, eingerollte Nasenschnecke, Schuppen/Federn */
    const [ex, ey] = P(xc - hw - 0.02, 1.45, z0 + 1.75);
    g += `<ellipse cx="${r(ex)}" cy="${r(ey)}" rx=".9" ry=".75" fill="${lit ? "#8a6236" : "#6a665c"}"/><ellipse cx="${r(ex + 0.2)}" cy="${r(ey)}" rx=".38" ry=".38" fill="#2a1d14"/>`;
    const [bx, by] = P(xc - hw - 0.02, 1.85, z0 + 2.05), [bx2, by2] = P(xc - hw - 0.02, 1.9, z0 + 1.25);
    g += `<path d="M${r(bx2)} ${r(by2)} Q${r((bx + bx2) / 2)} ${r(by - 1.2)} ${r(bx)} ${r(by)}" stroke="${DU}" stroke-width=".7" fill="none"/>`;
    const [nx, ny] = P(xc - hw - 0.02, 1.5, z0 + 2.62);
    g += `<path d="M${r(nx)} ${r(ny)} m-.6 0 a.6 .6 0 1 1 .6 .6 a.3 .3 0 1 1 -.3 -.3" stroke="${DU}" stroke-width=".35" fill="none"/>`;
    for (let i = 0; i < 6; i++) { const [qx, qy] = P(xc - hw - 0.02, 0.25 + (i % 2) * 0.3, z0 + 0.3 + i * 0.32); g += `<path d="M${r(qx - 0.5)} ${r(qy)} q.5 -.7 1 0" stroke="${DU}" stroke-width=".3" fill="none"/>`; }
    /* Federn hinter dem Kopf (die Schlange ist „gefiedert“) */
    for (let i = 0; i < 4; i++) { const [fx, fy] = P(xc - hw - 0.02, 2.05 + (i % 2) * 0.05, z0 + 0.25 + i * 0.36), [gx, gy] = P(xc - hw - 0.02, 1.35, z0 + 0.1 + i * 0.36); g += `<path d="M${r(fx)} ${r(fy)} Q${r(gx - 0.6)} ${r((fy + gy) / 2)} ${r(gx)} ${r(gy)}" stroke="${DU}" stroke-width=".35" fill="none"/>`; }
    /* Lippenlinie und Lichtkante */
    const lip = [[2.25, 0.56], [2.7, 0.98]].map(([z, y]) => P(xc - hw - 0.02, y, z0 + z));
    g += `<path d="M${pts(lip)}" stroke="#2a1d14" stroke-width=".35"/>`;
    return g;
  };
  k += kopf(1) + kopf(-1);
  /* Lichtsaum an der Westkante (Nordwestecke) */
  { const [a, b] = [P(-W0, 0, W0), P(-WT - 0.62, HT, WT + 0.62)]; k += `<line x1="${r(a[0])}" y1="${r(a[1])}" x2="${r(b[0])}" y2="${r(b[1])}" stroke="#fff1d0" stroke-width=".5" opacity=".6"/>`; }

  /* --- Lupe: Treppe, Stufe, Schlangenkopf, Terrasse --- */
  const [px0, py0] = P(0, 0, W0);
  const box = (punkte) => { const xs = punkte.map((p) => p[0]), ys = punkte.map((p) => p[1]); return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]; };
  {
    const [x0, y0, x1, y1] = box([P(-SB, 8, zS(8)), P(SB, 8, zS(8)), P(-SB, 17, zS(17)), P(SB, 17, zS(17))]);
    pyrUnter.push({ id: "treppe", de: "die Treppe", syl: "TREP-pe", it: "la scala", itSyl: "SCA-la", en: "staircase", x: (x0 + x1) / 2, y: y1, kunst: flaeche(-(x1 - x0) / 2, -(y1 - y0), x1 - x0, y1 - y0, 0.5),
      tipp: "Im März und September wirft die Sonne Dreiecke aus Licht auf die Treppe – wie eine Schlange, die herabkriecht." });
  }
  {
    const [x0, y0, x1, y1] = box([P(-SB, 2.4, zS(2.4)), P(SB, 2.4, zS(2.4)), P(-SB, 3.4, zS(3.4)), P(SB, 3.4, zS(3.4))]);
    pyrUnter.push({ id: "stufe", de: "die Stufe", syl: "STU-fe", it: "il gradino", itSyl: "gra-DI-no", en: "step", x: (x0 + x1) / 2, y: y1, kunst: flaeche(-(x1 - x0) / 2, -(y1 - y0), x1 - x0, y1 - y0, 0.3),
      tipp: "Jede Treppe hat 91 Stufen. Mit der Plattform oben sind es zusammen 365 – so viele, wie das Jahr Tage hat." });
  }
  {
    const kb = (sg) => { const xc = sg * (SB + BAL / 2), z0 = ZF - 0.4; return box([P(xc - 0.85, 0, z0), P(xc + 0.85, 0, z0), P(xc - 0.85, 2.1, z0), P(xc + 0.85, 2.1, z0), P(xc - 0.85, 0, z0 + 3.5), P(xc + 0.85, 0, z0 + 3.5), P(xc - 0.85, 2, z0 + 2.9), P(xc + 0.85, 2, z0 + 2.9)]); };
    const [a0, a1, a2, a3] = kb(-1), [b0, b1, b2, b3] = kb(1);
    const mx = (a0 + a2) / 2, my = a3;
    pyrUnter.push({ id: "schlangenkopf", de: "der Schlangenkopf", syl: "SCHLAN-gen-kopf", it: "la testa di serpente", itSyl: "TE-sta di ser-PEN-te", en: "serpent head", x: mx, y: my,
      kunst: flaeche(a0 - mx, a1 - my, a2 - a0, a3 - a1, 0.4) + flaeche(b0 - mx, b1 - my, b2 - b0, b3 - b1, 0.4),
      tipp: "Die Köpfe gehören zu Kukulcán, der gefiederten Schlange. Ihr Maul ist weit offen." });
  }
  {
    const w = wT(2), [x0, y0, x1, y1] = box([P(9, 2 * TH + 0.2, w - 0.05), P(20, 2 * TH + 0.2, w - 0.05), P(9, 3 * TH - 0.2, w - 0.6), P(20, 3 * TH - 0.2, w - 0.6)]);
    pyrUnter.push({ id: "terrasse", de: "die Terrasse", syl: "Ter-RAS-se", it: "la terrazza", itSyl: "ter-RAZ-za", en: "terrace", x: (x0 + x1) / 2, y: y1, kunst: flaeche(-(x1 - x0) / 2, -(y1 - y0), x1 - x0, y1 - y0, 0.4),
      tipp: "Die Pyramide hat neun Terrassen, eine über der anderen – mit eingetieften Feldern im Stein." });
  }
  S.teil({ id: "pyramide", de: "die Pyramide", syl: "Py-ra-MI-de", it: "la piramide", itSyl: "pi-RA-mi-de", en: "pyramid", x: px0, y: py0, kunst: um(px0, py0, k),
    zoom: { x: 48, y: 70, w: 105, h: 70 },
    unter: pyrUnter,
    tipp: "Die Pyramide des Kukulcán ist 30 Meter hoch. Oben steht ein Tempel; zwei Säulen in Form von Schlangen tragen seinen Eingang." });
}

/* =====================================================================
   4 — DER KAPOKBAUM (Ceiba) hinter dem Stand, Krone oben rechts
   ===================================================================== */
const STAND = { x0: 236, x1: 318, vorn: 192, hinten: 178 };
{
  const X = 292, Y = 150, s = sy(Y);            /* ≈ 11 Einheiten je Meter: Stamm 1,4 m, Krone ab 12 m */
  let k = "";
  /* Stamm: mächtig, glatt, graugrün, unten mit Brettwurzeln (hinter dem Stand) */
  k += `<path d="M-16 0 Q-9 -4 -8.4 -18 Q-7.2 -50 -5.6 -80 Q-5 -90 -9 -98 L-3 -96 Q0 -92 3 -96 L9 -99 Q5.6 -90 6 -80 Q7.6 -50 8.6 -18 Q9.4 -4 17 0 Q6 -3 0 -2 Q-6 -3 -16 0 Z" fill="${S.lg("ceiba", [[0, "#4f5a45"], [0.4, "#737d66"], [0.78, "#a5a288"], [1, "#878770"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-6 -20 Q-5 -50 -3.6 -82 M2 -24 Q2.6 -56 3.6 -84" stroke="#5a6450" stroke-width=".5" fill="none" opacity=".5"/>`;
  for (let i = 0; i < 9; i++) { const x = -5 + rnd() * 10, y = -14 - rnd() * 78; k += `<path d="M${r(x)} ${r(y)} q.4 -3 0 -6" stroke="#6a735c" stroke-width=".5" fill="none" opacity=".6"/>`; }
  /* waagrechte Äste in Stockwerken */
  const ast = (y, l, sg, d) => `<path d="M${sg * 4} ${y} Q${sg * l * 0.45} ${y - 3} ${sg * l} ${y - d}" stroke="#87907a" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  k += ast(-92, 44, -1, 10) + ast(-94, 24, 1, 8) + ast(-108, 36, -1, 12) + ast(-112, 22, 1, 9);
  /* Kronen-Stockwerke: breite, flache Laubwolken, unten dunkel, rechts von der Abendsonne hell */
  const KR = S.lg("krone", [[0, "#2f4a24"], [0.55, "#4e6f30"], [1, "#8fa652"]], 0, 0, 1, 0);
  const wolke = (cx, cy, rx, ry) => {
    let g = `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${KR}"/>`;
    for (let i = 0; i < 7; i++) { const t = i / 6, x = cx - rx * 0.85 + t * rx * 1.7, yy = cy - ry * 0.55 * Math.sin(t * Math.PI) - 1; g += `<ellipse cx="${r(x)}" cy="${r(yy)}" rx="${r(rx * 0.24)}" ry="${r(ry * 0.6)}" fill="${KR}"/>`; }
    g += `<path d="M${r(cx - rx * 0.92)} ${r(cy + ry * 0.2)} Q${cx} ${r(cy + ry * 1.25)} ${r(cx + rx * 0.92)} ${r(cy + ry * 0.2)}" fill="#1f3218" opacity=".45"/>`;
    for (let i = 0; i < 5; i++) g += `<path d="M${r(cx - rx * 0.6 + rnd() * rx * 1.2)} ${r(cy - ry * 0.3 + rnd() * ry * 0.4)} q1.6 -1.2 3.2 0" stroke="#a9bb6a" stroke-width=".6" fill="none" opacity=".55"/>`;
    return g;
  };
  k += wolke(-36, -100, 24, 7) + wolke(16, -98, 13, 6) + wolke(-8, -116, 28, 8.5) + wolke(-32, -126, 19, 6) + wolke(12, -128, 15, 6.5);
  const cid = S.id("baumclip");
  S.def(`<clipPath id="${cid}"><rect x="${-X}" y="${-Y}" width="320" height="${Y + 2}"/></clipPath>`);
  S.teil({ id: "kapokbaum", de: "der Kapokbaum", syl: "KA-pok-baum", it: "la ceiba", itSyl: "CEI-ba", en: "kapok tree", x: X, y: Y, kunst: `<g clip-path="url(#${cid})">${k}</g>`,
    tipp: "Für die Maya war der Kapokbaum (Ceiba) heilig: Er verbindet Himmel, Erde und Unterwelt." });
}

/* =====================================================================
   5 — DIE AGAVE (Henequén) vorn links und 6 — DER LEGUAN auf einem
       herabgefallenen Stein mit Relief
   ===================================================================== */
{
  const X = 34, Y = 190, s = sy(Y);              /* ≈ 36 Einheiten je Meter */
  let k = `<ellipse cx="-10" cy="-1" rx="22" ry="3.4" fill="#1b2a10" opacity=".28" filter="url(#bw_weich)"/>`;
  const blatt = (a, l, b, c) => {
    const ex = Math.cos(a) * l, ey = -Math.sin(a) * l;
    const nx = -Math.sin(a) * b, ny = -Math.cos(a) * b;
    return `<path d="M${r(nx)} ${r(ny)} Q${r(ex * 0.5 + nx * 0.8)} ${r(ey * 0.5 + ny * 0.8)} ${r(ex)} ${r(ey)} Q${r(ex * 0.5 - nx * 0.8)} ${r(ey * 0.5 - ny * 0.8)} ${r(-nx)} ${r(-ny)} Z" fill="${c}"/><path d="M${r(ex)} ${r(ey)} l${r(Math.cos(a) * 1.4)} ${r(-Math.sin(a) * 1.4)}" stroke="#4a3a22" stroke-width=".45"/>`;
  };
  const blaetter = [];
  for (let i = 0; i < 17; i++) blaetter.push([0.12 + i * (Math.PI - 0.24) / 16 + (rnd() - 0.5) * 0.08, (0.85 + rnd() * 0.35) * s * (0.7 + 0.3 * Math.sin(i / 16 * Math.PI))]);
  blaetter.sort((p, q) => Math.abs(q[0] - Math.PI / 2) - Math.abs(p[0] - Math.PI / 2));
  for (const [a, l] of blaetter) k += blatt(a, l, 1.8, a < Math.PI / 2 ? "url(#" + S.id("agaveL") + ")" : "url(#" + S.id("agaveD") + ")");
  S.lg("agaveL", [[0, "#6f9a88"], [1, "#a9c4b2"]], 0, 1, 0, 0);
  S.lg("agaveD", [[0, "#4f7666"], [1, "#7fa392"]], 0, 1, 0, 0);
  for (const [a, l] of [[1.4, 0.7 * s], [1.75, 0.62 * s]]) k += blatt(a, l, 1.5, "#87ae9b");
  S.teil({ id: "agave", de: "die Agave", syl: "A-GA-ve", it: "l'agave", itSyl: "A-ga-ve", en: "agave", x: X, y: Y, steht: true, kunst: k,
    tipp: "Aus den Fasern der Agave Henequén macht man in Yucatán Seile und Hängematten." });
}
const STEIN = { x: 82, y: 184 };
{
  const s = sy(STEIN.y);                          /* ≈ 32 Einheiten je Meter */
  const w = 0.9 * s, h = 0.42 * s, t = 0.18 * s;
  let k = `<path d="M${r(w / 2)} 0 L${r(-w / 2)} 0 L${r(-w / 2 - 22)} -3 L${r(w / 2 - 16)} -4 Z" fill="#2b3a1a" opacity=".3" filter="url(#bw_weich)"/>`;
  k += `<path d="M${r(-w / 2)} 0 L${r(w / 2)} 0 L${r(w / 2)} ${r(-h)} L${r(-w / 2)} ${r(-h)} Z" fill="${S.lg("block", [[0, "#9a917f"], [1, "#d8c9a6"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${r(-w / 2)} ${r(-h)} L${r(w / 2)} ${r(-h)} L${r(w / 2 - 2)} ${r(-h - t)} L${r(-w / 2 + 2.6)} ${r(-h - t)} Z" fill="#e3d4b0"/>`;
  /* Relief: Federschlange (Schuppen, Federn, Auge) */
  k += `<path d="M${r(-w / 2 + 2)} ${r(-h * 0.5)} q4 -4 8 0 t8 0 t8 0" stroke="#7d725e" stroke-width=".9" fill="none"/>`;
  for (let i = 0; i < 5; i++) k += `<path d="M${r(-w / 2 + 3 + i * 4.4)} ${r(-h * 0.22)} l1.4 -2.4 l1.4 2.4" stroke="#857a65" stroke-width=".5" fill="none"/>`;
  k += `<circle cx="${r(w / 2 - 4)}" cy="${r(-h * 0.6)}" r="1.4" fill="none" stroke="#7d725e" stroke-width=".6"/><circle cx="${r(w / 2 - 4)}" cy="${r(-h * 0.6)}" r=".5" fill="#6b604d"/>`;
  for (let i = 0; i < 7; i++) k += `<circle cx="${r(-w / 2 + rnd() * w)}" cy="${r(-rnd() * h)}" r="${r(0.3 + rnd() * 0.5)}" fill="#6f7a52" opacity=".5"/>`;
  S.hinten(`<g transform="translate(${STEIN.x} ${STEIN.y})">${k}</g>`);
  /* DER LEGUAN (Schwarzer Leguan, Ctenosaura) sonnt sich oben auf dem Stein */
  let g = "";
  const L = 0.62 * s;
  g += `<path d="M${r(-L * 0.25)} -1.4 Q${r(-L * 0.55)} -1.2 ${r(-L * 0.75)} -.6 Q${r(-L * 0.9)} -.2 ${r(-L)} .1 Q${r(-L * 0.85)} -.7 ${r(-L * 0.6)} -1.6 Q${r(-L * 0.4)} -2.4 ${r(-L * 0.2)} -2.6 Z" fill="#3f3f38"/>`;
  for (let i = 0; i < 6; i++) g += `<path d="M${r(-L * 0.3 - i * L * 0.11)} ${r(-1.9 + i * 0.25)} l.6 .2" stroke="#9c9a86" stroke-width=".7"/>`;
  g += `<path d="M${r(-L * 0.25)} -1.2 Q0 -1 ${r(L * 0.18)} -1.4 Q${r(L * 0.26)} -2.6 ${r(L * 0.1)} -3.4 Q${r(-L * 0.08)} -3.6 ${r(-L * 0.25)} -2.8 Z" fill="${S.lg("leguan", [[0, "#5c5a4c"], [1, "#9a9478"]])}"/>`;
  for (let i = 0; i < 4; i++) g += `<path d="M${r(-L * 0.2 + i * 2)} -1.6 l0 -1.6" stroke="#2c2b25" stroke-width=".7"/>`;
  g += `<path d="M${r(L * 0.16)} -1.6 Q${r(L * 0.34)} -1.5 ${r(L * 0.4)} -2.4 Q${r(L * 0.36)} -3.6 ${r(L * 0.2)} -3.5 Q${r(L * 0.12)} -2.8 ${r(L * 0.16)} -1.6 Z" fill="#6c6a58"/>`;
  g += `<circle cx="${r(L * 0.3)}" cy="-2.9" r=".38" fill="#1d1c18"/><circle cx="${r(L * 0.31)}" cy="-3" r=".12" fill="#e9e2c0"/>`;
  for (let i = 0; i < 7; i++) g += `<path d="M${r(-L * 0.18 + i * 1.6)} ${r(-3.3 - Math.sin(i / 6 * Math.PI) * 0.4)} l.4 -1.1 l.4 1.1" fill="#2c2b25"/>`;
  g += `<path d="M${r(-L * 0.05)} -1.4 l-1 1.5 m1.8 -1.4 l.6 1.4 M${r(L * 0.12)} -1.4 l.9 1.4" stroke="#4a4840" stroke-width=".8" stroke-linecap="round"/>`;
  g += `<path d="M${r(-L * 0.2)} -3.2 Q${r(L * 0.05)} -3.9 ${r(L * 0.32)} -3.3" stroke="#d9cfa8" stroke-width=".4" fill="none" opacity=".6"/>`;
  S.teil({ oben: true, id: "leguan", de: "der Leguan", syl: "LE-gu-an", it: "l'iguana", itSyl: "i-GUA-na", en: "iguana", x: STEIN.x + 2, y: STEIN.y - h - t * 0.55, kunst: g,
    tipp: "In Chichén Itzá sonnen sich viele Leguane auf den warmen Steinen." });
}

/* =====================================================================
   7 — DER STAND (Palapa-Dach) — Lupe: Maske, Totenkopf, Rassel, Jaguar
       8 — DIE VERKÄUFERIN im Huipil hinter dem Verkaufstisch
   ===================================================================== */
const SV = sy(STAND.vorn), SH = sy(STAND.hinten);   /* 37,5 und 28,75 Einheiten je Meter */
const DACH = STAND.vorn - 2.25 * SV;                  /* Unterkante des Daches vorn */
const TISCH_O = STAND.vorn - 6 - 0.8 * sy(STAND.vorn - 6);   /* Oberkante des Verkaufstisches vorn */
const standUnter = [];
{
  const { x0, x1, vorn, hinten } = STAND;
  const HOLZ = S.lg("pfosten", [[0, "#6b4a2c"], [0.5, "#8a6440"], [1, "#5a3c22"]], 0, 0, 1, 0);
  /* langer Schatten nach Osten (links), die Sonne steht tief im Westen */
  let k = `<path d="M${x0} ${vorn + 1} L${x1} ${vorn + 1} L${x1 - 6} ${hinten} L${x0 - 6} ${hinten - 4} L${x0 - 58} ${hinten - 2} L${x0 - 52} ${vorn - 2} Z" fill="#2b3a1a" opacity=".22" filter="url(#bw_weich)"/>`;
  /* hintere Pfosten, Rückwand aus Stoff im Schatten */
  k += `<rect x="${x0 + 8}" y="${r(hinten - 2.5 * SH)}" width="1.6" height="${r(2.5 * SH)}" fill="#5a3c22"/><rect x="${x1 - 6}" y="${r(hinten - 2.5 * SH)}" width="1.6" height="${r(2.5 * SH)}" fill="#5a3c22"/>`;
  k += `<rect x="${x0 + 9}" y="${r(hinten - 2.4 * SH)}" width="${x1 - x0 - 15}" height="${r(1.6 * SH)}" fill="${S.lg("rueckstoff", [[0, "#6a3a3a"], [1, "#4a2a2a"]])}"/>`;
  /* Seil für den Poncho zwischen den hinteren Pfosten */
  k += `<path d="M${x0 + 9} ${r(hinten - 2.2 * SH)} Q${(x0 + x1) / 2} ${r(hinten - 2.1 * SH)} ${x1 - 5} ${r(hinten - 2.2 * SH)}" stroke="#d8c8a0" stroke-width=".4" fill="none"/>`;
  /* Verkaufstisch mit besticktem Tuch */
  const tv = vorn - 6, th = TISCH_O;
  k += `<path d="M${x0 + 6} ${r(th)} L${x1 - 4} ${r(th)} L${x1 - 6} ${r(th - 6)} L${x0 + 9} ${r(th - 6)} Z" fill="${S.lg("tischplatte", [[0, "#e9dfc8"], [1, "#f6efdc"]])}"/>`;
  k += `<path d="M${x0 + 6} ${r(th)} L${x1 - 4} ${r(th)} L${x1 - 4} ${r(tv - 3)} Q${(x0 + x1) / 2} ${r(tv - 1)} ${x0 + 6} ${r(tv - 3)} Z" fill="#f4eee0"/>`;
  for (let x = x0 + 8; x < x1 - 6; x += 5.2) { const y = tv - 7; k += `<circle cx="${r(x)}" cy="${r(y)}" r="1.3" fill="${["#d6336c", "#f28c28", "#2f9e6e", "#7048e8"][Math.round(x) % 4]}"/><circle cx="${r(x)}" cy="${r(y)}" r=".5" fill="#f9d64a"/><path d="M${r(x - 2.6)} ${r(y + 0.3)} q1.3 -1 2.6 0 M${r(x)} ${r(y + 0.3)} q1.3 1 2.6 0" stroke="#3b8f4a" stroke-width=".4" fill="none"/>`; }
  k += `<rect x="${x0 + 6}" y="${r(tv - 4)}" width="${x1 - x0 - 10}" height="1" fill="#c8102e"/>`;
  for (let x = x0 + 9; x < x1 - 6; x += 7.8) { const y = th + 7; k += `<path d="M${r(x - 2.4)} ${r(y)} q1.2 -2.2 2.4 0 q1.2 2.2 2.4 0" stroke="#3b8f4a" stroke-width=".45" fill="none"/><circle cx="${r(x)}" cy="${r(y - 1.6)}" r="1" fill="${["#7048e8", "#d6336c", "#e8590c"][Math.round(x) % 3]}"/><circle cx="${r(x)}" cy="${r(y - 1.6)}" r=".38" fill="#f9d64a"/>`; }
  let spitze = "";
  for (let x = x0 + 6; x < x1 - 4; x += 1.6) spitze += `<path d="M${r(x)} ${r(tv - 3)} q.8 1.3 1.6 0" stroke="#f4eee0" stroke-width=".35" fill="none"/>`;
  k += spitze;
  /* --- Waren auf dem Tisch (Lupe) --- */
  const yT = th - 1.4;
  /* DIE MASKE — Lucha-Libre-Maske */
  {
    let g = "";
    for (const [x, c1, c2] of [[x0 + 13, "#1d4fa0", "#f1c232"], [x0 + 21.4, "#c8102e", "#ffffff"]]) {
      /* Kopfform von vorn, große Augenöffnungen mit Flammen-Rand, Mund frei, Naht in der Mitte */
      g += `<path d="M${x - 3.3} ${r(yT - 0.2)} Q${x - 3.8} ${r(yT - 5.2)} ${x - 2.4} ${r(yT - 6.8)} Q${x} ${r(yT - 8.2)} ${x + 2.4} ${r(yT - 6.8)} Q${x + 3.8} ${r(yT - 5.2)} ${x + 3.3} ${r(yT - 0.2)} Q${x} ${r(yT + 0.5)} ${x - 3.3} ${r(yT - 0.2)} Z" fill="${c1}"/>`;
      g += `<path d="M${x - 2.9} ${r(yT - 3.6)} Q${x - 2.6} ${r(yT - 6)} ${x - 0.5} ${r(yT - 4.6)} Q${x - 1} ${r(yT - 3.2)} ${x - 2.9} ${r(yT - 3.6)} Z M${x + 2.9} ${r(yT - 3.6)} Q${x + 2.6} ${r(yT - 6)} ${x + 0.5} ${r(yT - 4.6)} Q${x + 1} ${r(yT - 3.2)} ${x + 2.9} ${r(yT - 3.6)} Z" fill="${c2}"/>`;
      g += `<path d="M${x - 2.4} ${r(yT - 3.8)} Q${x - 2.1} ${r(yT - 5.2)} ${x - 0.9} ${r(yT - 4.5)} Q${x - 1.2} ${r(yT - 3.6)} ${x - 2.4} ${r(yT - 3.8)} Z M${x + 2.4} ${r(yT - 3.8)} Q${x + 2.1} ${r(yT - 5.2)} ${x + 0.9} ${r(yT - 4.5)} Q${x + 1.2} ${r(yT - 3.6)} ${x + 2.4} ${r(yT - 3.8)} Z" fill="#1a1a1a"/>`;
      g += `<ellipse cx="${x}" cy="${r(yT - 1.5)}" rx="1.3" ry=".75" fill="${c2}"/><ellipse cx="${x}" cy="${r(yT - 1.5)}" rx=".95" ry=".48" fill="#1a1a1a"/>`;
      g += `<path d="M${x} ${r(yT - 7.6)} L${x} ${r(yT - 5)} M${x - 1.6} ${r(yT - 6.8)} l.7 1.2 l.5 -.9 M${x + 1.6} ${r(yT - 6.8)} l-.7 1.2 l-.5 -.9" stroke="${c2}" stroke-width=".5" fill="none"/>`;
      g += `<path d="M${x - 2.6} ${r(yT - 6.2)} Q${x - 3.4} ${r(yT - 3)} ${x - 2.6} ${r(yT - 0.6)}" stroke="#fff" stroke-width=".4" opacity=".3" fill="none"/>`;
    }
    k += g;
    standUnter.push({ id: "maske", de: "die Maske", syl: "MAS-ke", it: "la maschera", itSyl: "MA-sche-ra", en: "mask", x: x0 + 17, y: yT, kunst: flaeche(-7.6, -7.6, 15.2, 8.2, 0.5),
      tipp: "Solche Masken tragen die Ringer beim Lucha Libre, dem mexikanischen Ringkampf." });
  }
  /* DER TOTENKOPF — bunt bemalte Calavera mit orangen Studentenblumen */
  {
    const x = x0 + 32.4;
    let g = "";
    for (let i = 0; i < 7; i++) { const a = Math.PI * (0.05 + i * 0.15); g += `<circle cx="${r(x + Math.cos(a) * 5.6)}" cy="${r(yT - 0.6 - Math.sin(a) * 1.4)}" r="1.25" fill="${i % 2 ? "#f28c28" : "#f6a821"}"/><circle cx="${r(x + Math.cos(a) * 5.6)}" cy="${r(yT - 0.6 - Math.sin(a) * 1.4)}" r=".45" fill="#c2541a"/>`; }
    g += `<path d="M${x - 3.4} ${r(yT - 3.4)} Q${x - 3.6} ${r(yT - 8)} ${x} ${r(yT - 8.4)} Q${x + 3.6} ${r(yT - 8)} ${x + 3.4} ${r(yT - 3.4)} Q${x + 2.6} ${r(yT - 2)} ${x + 1.6} ${r(yT - 1)} L${x - 1.6} ${r(yT - 1)} Q${x - 2.6} ${r(yT - 2)} ${x - 3.4} ${r(yT - 3.4)} Z" fill="#f8f4ea"/>`;
    g += `<circle cx="${x - 1.4}" cy="${r(yT - 4.6)}" r="1.1" fill="#2f9e6e"/><circle cx="${x + 1.4}" cy="${r(yT - 4.6)}" r="1.1" fill="#7048e8"/><circle cx="${x - 1.4}" cy="${r(yT - 4.6)}" r=".45" fill="#111"/><circle cx="${x + 1.4}" cy="${r(yT - 4.6)}" r=".45" fill="#111"/>`;
    g += `<path d="M${x - 0.4} ${r(yT - 3.4)} L${x} ${r(yT - 2.8)} L${x + 0.4} ${r(yT - 3.4)} Z" fill="#111"/><path d="M${x - 1.6} ${r(yT - 1.8)} h3.2" stroke="#111" stroke-width=".35"/>`;
    for (let i = 0; i < 5; i++) g += `<line x1="${r(x - 1.2 + i * 0.6)}" y1="${r(yT - 2.2)}" x2="${r(x - 1.2 + i * 0.6)}" y2="${r(yT - 1.4)}" stroke="#111" stroke-width=".2"/>`;
    g += `<path d="M${x - 2.2} ${r(yT - 7)} q1 -1 2.2 0 q1.2 -1 2.2 0" stroke="#d6336c" stroke-width=".6" fill="none"/><circle cx="${x}" cy="${r(yT - 6.6)}" r=".55" fill="#f1c232"/>`;
    k += g;
    standUnter.push({ id: "totenkopf", de: "der Totenkopf", syl: "TO-ten-kopf", it: "il teschio", itSyl: "TE-schio", en: "skull", x, y: yT, kunst: flaeche(-6.6, -8.8, 13.2, 9, 0.5),
      tipp: "Am Tag der Toten schmückt man bunte Totenköpfe (Calaveras) mit orangen Studentenblumen." });
  }
  /* DER JAGUAR — Pfeife aus Ton, gelb mit schwarzen Flecken */
  {
    const x = x0 + 41.6;
    /* sitzender Jaguar aus Ton (Pfeife): Körper, Kopf mit runden Ohren, Rosetten */
    const FELL = S.lg("jaguar", [[0, "#f4bd45"], [1, "#d88b1e"]]);
    let g = `<path d="M${x - 3.2} ${r(yT)} Q${x - 3.8} ${r(yT - 3)} ${x - 2} ${r(yT - 4.2)} L${x + 1.8} ${r(yT - 4.2)} Q${x + 3.4} ${r(yT - 2.6)} ${x + 2.8} ${r(yT)} Z" fill="${FELL}"/>`;
    g += `<path d="M${x + 2.6} ${r(yT - 0.6)} q2 .2 1.6 -2.2" stroke="#d88b1e" stroke-width=".7" fill="none" stroke-linecap="round"/>`;
    g += `<ellipse cx="${x - 0.6}" cy="${r(yT - 5.6)}" rx="2.6" ry="2.2" fill="${FELL}"/>`;
    g += `<circle cx="${x - 2.6}" cy="${r(yT - 7.4)}" r=".8" fill="#d88b1e"/><circle cx="${x + 1.4}" cy="${r(yT - 7.4)}" r=".8" fill="#d88b1e"/><circle cx="${x - 2.6}" cy="${r(yT - 7.4)}" r=".35" fill="#2a1d14"/><circle cx="${x + 1.4}" cy="${r(yT - 7.4)}" r=".35" fill="#2a1d14"/>`;
    g += `<ellipse cx="${x - 0.6}" cy="${r(yT - 4.6)}" rx="1.2" ry=".8" fill="#f8ead0"/><path d="M${x - 1} ${r(yT - 5.1)} L${x - 0.2} ${r(yT - 5.1)} L${x - 0.6} ${r(yT - 4.6)} Z" fill="#2a1d14"/><path d="M${x - 0.6} ${r(yT - 4.6)} v.5 M${x - 1.3} ${r(yT - 4)} q.7 .4 1.4 0" stroke="#2a1d14" stroke-width=".22" fill="none"/>`;
    g += `<path d="M${x - 1.8} ${r(yT - 6)} l.8 -.2 M${x + 0.6} ${r(yT - 6)} l-.8 -.2" stroke="#2a1d14" stroke-width=".35"/><circle cx="${x - 1.4}" cy="${r(yT - 5.8)}" r=".22" fill="#2a1d14"/><circle cx="${x + 0.2}" cy="${r(yT - 5.8)}" r=".22" fill="#2a1d14"/>`;
    for (const [dx, dy] of [[-2, -2], [0, -1.2], [1.6, -2.6], [-1, -3.4], [1.2, -0.8], [-2.4, -0.8], [-2.4, -6.4], [1.2, -6.6]]) g += `<circle cx="${r(x + dx)}" cy="${r(yT + dy)}" r=".45" fill="none" stroke="#2a1d14" stroke-width=".3"/><circle cx="${r(x + dx)}" cy="${r(yT + dy)}" r=".12" fill="#2a1d14"/>`;
    g += `<ellipse cx="${x - 1.8}" cy="${r(yT - 6.4)}" rx=".7" ry=".5" fill="#fff" opacity=".3"/>`;
    k += g;
    standUnter.push({ id: "jaguar", de: "der Jaguar", syl: "JA-gu-ar", it: "il giaguaro", itSyl: "gia-GUA-ro", en: "jaguar", x, y: yT, kunst: flaeche(-4.4, -8.4, 9.4, 8.8, 0.5),
      tipp: "Bläst man in den Jaguar aus Ton, brüllt er wie die große Raubkatze. Für die Maya war der Jaguar heilig." });
  }
  /* DIE RASSEL — zwei bemalte Maracas */
  {
    const x = x0 + 50;
    let g = "";
    for (const [dx, rot, c] of [[-1.6, -24, "#c8102e"], [2, 18, "#2f9e6e"]]) {
      g += `<g transform="translate(${x + dx} ${r(yT)}) rotate(${rot})"><rect x="-.5" y="-4" width="1" height="4" rx=".4" fill="#8a5a2a"/><ellipse cx="0" cy="-6.6" rx="2.6" ry="3" fill="${c}"/><path d="M-2.4 -6.8 q2.4 1.6 4.8 0" stroke="#f1c232" stroke-width=".55" fill="none"/><path d="M-2 -5.6 q2 1 4 0" stroke="#fff" stroke-width=".35" fill="none"/><ellipse cx="-.9" cy="-7.6" rx=".7" ry="1" fill="#fff" opacity=".35"/></g>`;
    }
    k += g;
    standUnter.push({ id: "rassel", de: "die Rassel", syl: "RAS-sel", it: "la maraca", itSyl: "ma-RA-ca", en: "maraca", x, y: yT, kunst: flaeche(-5.6, -10.4, 11.2, 10.8, 0.5),
      tipp: "Die Rasseln heißen auf Spanisch Maracas. In ihnen klappern Samen." });
  }
  /* vordere Pfosten */
  k += `<rect x="${x0 - 1}" y="${r(DACH - 4)}" width="2.4" height="${r(vorn - DACH + 4)}" fill="${HOLZ}"/><rect x="${x1 - 2}" y="${r(DACH - 4)}" width="2.4" height="${r(vorn - DACH + 4)}" fill="${HOLZ}"/>`;
  /* Palapa: Dach aus Palmblättern, vorn tiefer, ausgefranster Rand; Unterseite im Schatten */
  k += `<path d="M${x0 - 8} ${r(DACH)} L${x1 + 6} ${r(DACH)} L${x1 - 2} ${r(DACH - 15)} L${x0 + 6} ${r(DACH - 17)} Z" fill="url(#${S.id("palapa")})"/>`;
  k += `<path d="M${x0 - 8} ${r(DACH)} L${x1 + 6} ${r(DACH)} L${x1 - 2} ${r(DACH - 15)} L${x0 + 6} ${r(DACH - 17)} Z" fill="${S.lg("palapalicht", [[0, "#000", 0.25], [0.6, "#fff", 0], [1, "#ffe9b0", 0.3]], 0, 0, 1, 0)}"/>`;
  let fr = `M${x0 - 8} ${r(DACH)}`;
  for (let x = x0 - 8; x < x1 + 6; x += 2.2) fr += ` L${r(x + 1.1)} ${r(DACH + 2.4 + rnd() * 2.2)} L${r(x + 2.2)} ${r(DACH + 0.4)}`;
  k += `<path d="${fr} L${x1 + 6} ${r(DACH - 1)} L${x0 - 8} ${r(DACH - 1)} Z" fill="#a8844c"/>`;
  k += `<path d="M${x0 + 6} ${r(DACH - 17)} L${x1 - 2} ${r(DACH - 15)}" stroke="#7a5a30" stroke-width="1.2"/>`;
  S.teil({ id: "stand", de: "der Stand", syl: "STAND", it: "la bancarella", itSyl: "ban-ca-REL-la", en: "stall", x: (x0 + x1) / 2, y: vorn, steht: true, kunst: um((x0 + x1) / 2, vorn, k),
    zoom: { x: x0 + 2, y: TISCH_O - 24, w: 66, h: 44 },
    unter: standUnter,
    tipp: "An den Ständen verkaufen Maya-Familien ihr Kunsthandwerk." });
}

/* DIE HÄNGEMATTE — bunt gestreift, hängt vorn rechts vom Dachbalken */
{
  const X = STAND.x1 - 6.5, Y = DACH + 2;
  let k = `<path d="M-6 0 Q-7 22 -2 44 Q2 46 6 44 Q9 22 6 0 Q0 3 -6 0 Z" fill="${S.lg("haengematte", [[0, "#e63946"], [0.16, "#e63946"], [0.17, "#f4a261"], [0.33, "#f4a261"], [0.34, "#2a9d8f"], [0.5, "#2a9d8f"], [0.51, "#e9c46a"], [0.67, "#e9c46a"], [0.68, "#6a4c93"], [0.84, "#6a4c93"], [0.85, "#e63946"], [1, "#e63946"]], 0, 0, 1, 0)}"/>`;
  for (let i = 0; i < 9; i++) k += `<path d="M${-5.6 + i * 1.4} 1 Q${-6 + i * 1.5} 22 ${-2 + i * 0.5} 44" stroke="#000" stroke-width=".2" opacity=".25" fill="none"/>`;
  k += `<path d="M-6 0 Q0 3 6 0" stroke="#f4efe2" stroke-width=".7" fill="none"/><path d="M-6 0 L0 -4 L6 0 M-3 1 L0 -4 L3 1" stroke="#f4efe2" stroke-width=".3"/>`;
  k += `<path d="M-2 44 L-3 50 M0 45 L0 51 M2 45 L3 50 M4 44 L5.4 49" stroke="#f4efe2" stroke-width=".5"/>`;
  k += `<path d="M-6 0 Q-7 22 -2 44" stroke="#fff" stroke-width=".8" opacity=".3" fill="none"/>`;
  S.teil({ id: "haengematte", de: "die Hängematte", syl: "HÄN-ge-mat-te", it: "l'amaca", itSyl: "a-MA-ca", en: "hammock", x: X, y: Y, kunst: k,
    tipp: "In Yucatán schlafen viele Menschen in Hängematten – das ist kühler als ein Bett." });
}
/* DER PONCHO (Sarape) — hängt hinten über dem Seil */
{
  const X = STAND.x0 + 20, Y = STAND.hinten - 2.2 * SH;
  let k = `<path d="M-11 0 L11 0 L12 30 L-12 30 Z" fill="url(#${S.id("sarape")})" transform="translate(0 0)"/>`;
  k += `<path d="M-11 0 L11 0 L12 30 L-12 30 Z" fill="${S.lg("ponchofalten", [[0, "#000", 0.25], [0.3, "#000", 0], [0.6, "#fff", 0.08], [1, "#000", 0.2]], 0, 0, 1, 0)}"/>`;
  for (let x = -11; x <= 12; x += 1.6) k += `<line x1="${r(x)}" y1="30" x2="${r(x + 0.2)}" y2="32.6" stroke="#f1c232" stroke-width=".4"/>`;
  k += `<path d="M-3 14 L0 10 L3 14 L0 18 Z" fill="#f4efe2"/><path d="M-1.4 14 L0 12.4 L1.4 14 L0 15.6 Z" fill="#1e7a6e"/>`;
  S.teil({ id: "poncho", de: "der Poncho", syl: "PON-cho", it: "il poncho", itSyl: "PON-cio", en: "poncho", x: X, y: Y, kunst: k,
    tipp: "Den gestreiften Poncho nennt man in Mexiko auch Sarape." });
}
/* DIE VERKÄUFERIN — Maya-Frau im weißen Huipil mit gestickten Blumen */
{
  const X = STAND.x0 + 61, Y = STAND.hinten - 1;
  const m = B.mensch({ id: "mex_verk", geschlecht: "w", alter: "erwachsen", pose: "stehen", blick: -20, frisur: "dutt", haarfarbe: "schwarz", haut: "mittel", laecheln: true,
    kleidung: { kleid: { stueck: "abendkleid", farbe: "#f7f4ec" }, oberteil: { stueck: "tshirt", farbe: "#f7f4ec" } } }, 1.56 * sy(Y));
  const k0 = m.k, pk = (n) => [m.z.punkte[n][0] * k0, m.z.punkte[n][1] * k0];
  const [hx, hy] = pk("hals"), [slx, sly] = pk("schulterL"), [srx, sry] = pk("schulterR"), [bx, by] = pk("brust");
  /* viereckiger Halsausschnitt mit einem Band gestickter Blumen */
  const ya = hy + 0.6, yb = by + 1.2, xa = srx * 0.62 + hx * 0.38, xb = slx * 0.62 + hx * 0.38;
  let st = `<path d="M${r(xa)} ${r(ya)} L${r(xa)} ${r(yb)} L${r(xb)} ${r(yb)} L${r(xb)} ${r(ya)}" stroke="#f7f4ec" stroke-width="1.6" fill="none"/>`;
  st += `<path d="M${r(xa - 1)} ${r(ya)} L${r(xa - 1)} ${r(yb + 1)} L${r(xb + 1)} ${r(yb + 1)} L${r(xb + 1)} ${r(ya)}" stroke="#2f9e6e" stroke-width=".35" fill="none"/>`;
  const blume = (x, y, c) => `<circle cx="${r(x)}" cy="${r(y)}" r=".75" fill="${c}"/><circle cx="${r(x)}" cy="${r(y)}" r=".28" fill="#f9d64a"/>`;
  const farben = ["#d6336c", "#e8590c", "#7048e8", "#c2255c"];
  let n = 0;
  for (let y = ya + 0.8; y < yb; y += 1.6) { st += blume(xa - 0.4, y, farben[n++ % 4]) + blume(xb + 0.4, y, farben[n++ % 4]); }
  for (let x = xa + 1.2; x < xb - 0.6; x += 1.6) st += blume(x, yb + 0.5, farben[n++ % 4]);
  /* Haarband im Dutt */
  const cid = S.id("verkclip");
  S.def(`<clipPath id="${cid}" clipPathUnits="userSpaceOnUse"><rect x="-30" y="-80" width="60" height="${r(80 - (Y - TISCH_O) - 0.2)}"/></clipPath>`);
  S.teil({ id: "verkaeuferin", de: "die Verkäuferin", syl: "ver-KÄU-fe-rin", it: "la venditrice", itSyl: "ven-di-TRI-ce", en: "saleswoman", x: X, y: Y, kunst: `<g clip-path="url(#${cid})">${m.svg}${st}</g>`,
    tipp: "Sie trägt einen Huipil: ein weißes Kleid mit bunt gestickten Blumen – typisch für die Maya in Yucatán." });
}
/* DIE PIÑATA — Stern mit sieben Zacken, hängt vorn links unter dem Dach */
{
  const X = STAND.x0 + 7, Y = DACH + 12;
  let k = `<line x1="0" y1="-12" x2="0" y2="-5" stroke="#d8c8a0" stroke-width=".35"/>`;
  k += `<circle cx="0" cy="0" r="4.6" fill="${S.rg("pinata", [[0, "#ffd43b"], [1, "#f08c00"]], 0.4, 0.35)}"/>`;
  const farben = ["#e64980", "#4c6ef5", "#40c057", "#fab005", "#f03e3e", "#15aabf", "#be4bdb"];
  for (let i = 0; i < 7; i++) {
    const a = -Math.PI / 2 + i * 2 * Math.PI / 7, c = Math.cos(a), sn = Math.sin(a);
    k += `<path d="M${r(c * 3.6 - sn * 1.6)} ${r(sn * 3.6 + c * 1.6)} L${r(c * 11)} ${r(sn * 11)} L${r(c * 3.6 + sn * 1.6)} ${r(sn * 3.6 - c * 1.6)} Z" fill="${farben[i]}"/>`;
    k += `<path d="M${r(c * 11)} ${r(sn * 11)} l${r(c * 1.6 - 0.6)} ${r(sn * 1.6 + 2.6)} M${r(c * 11)} ${r(sn * 11)} l${r(c * 1.6 + 0.6)} ${r(sn * 1.6 + 2.8)}" stroke="${farben[(i + 2) % 7]}" stroke-width=".5"/>`;
  }
  k += `<circle cx="0" cy="0" r="4.6" fill="none" stroke="#e64980" stroke-width=".6" stroke-dasharray="1 .8"/><ellipse cx="-1.4" cy="-1.6" rx="1.4" ry="1" fill="#fff" opacity=".35"/>`;
  S.teil({ oben: true, id: "pinata", de: "die Piñata", syl: "Pi-ÑA-ta", it: "la pignatta", itSyl: "pi-GNAT-ta", en: "piñata", x: X, y: Y, kunst: k,
    tipp: "Die Piñata ist mit Süßigkeiten gefüllt. Mit verbundenen Augen schlägt man sie auf." });
}
/* DER SOMBRERO — zwei Strohhüte hängen am linken Pfosten */
{
  const X = STAND.x0 - 1, Y = DACH + 38;
  const hut = (dx, dy, rot, band) => `<g transform="translate(${dx} ${dy}) rotate(${rot})"><ellipse cx="0" cy="0" rx="9.6" ry="3.6" fill="${S.lg("stroh", [[0, "#f2d79a"], [1, "#c99a4e"]])}"/><ellipse cx="0" cy="-.2" rx="8.6" ry="2.8" fill="none" stroke="#b08440" stroke-width=".4"/><path d="M-3.6 -.6 Q-3.8 -6.4 0 -7 Q3.8 -6.4 3.6 -.6 Q0 .6 -3.6 -.6 Z" fill="${S.lg("krone2", [[0, "#e9c77e"], [1, "#c99a4e"]], 0, 0, 1, 0)}"/><path d="M-3.7 -1.6 Q0 -.6 3.7 -1.6" stroke="${band}" stroke-width="1.2" fill="none"/><path d="M-8 1.6 Q0 4.4 8 1.6" stroke="${band}" stroke-width=".6" fill="none"/></g>`;
  const k = hut(0, 0, -8, "#c8102e") + hut(1.4, 9.6, 6, "#2f9e6e") + `<circle cx="0" cy="-6.4" r=".6" fill="#555"/>`;
  S.teil({ oben: true, id: "sombrero", de: "der Sombrero", syl: "Som-BRE-ro", it: "il sombrero", itSyl: "som-BRE-ro", en: "sombrero", x: X, y: Y, kunst: k,
    tipp: "„Sombrero“ kommt von „sombra“ – Schatten. Die breite Krempe schützt vor der Sonne." });
}
/* DIE GIRLANDE (Papel picado) entlang der Dachkante */
{
  const X = STAND.x0 - 6, Y = DACH - 0.6;
  let k = `<path d="M0 0 Q${(STAND.x1 - STAND.x0 + 12) / 2} 4 ${STAND.x1 - STAND.x0 + 12} 0" stroke="#e9e1cc" stroke-width=".35" fill="none"/>`;
  const farben = ["#e64980", "#fab005", "#40c057", "#4c6ef5", "#f76707", "#be4bdb"];
  const L = STAND.x1 - STAND.x0 + 12;
  for (let i = 0; i < 12; i++) {
    const x = 2 + i * (L - 4) / 11, y = 4 * 4 * (x / L) * (1 - x / L) * 1;
    k += `<path d="M${r(x - 2.6)} ${r(y)} L${r(x + 2.6)} ${r(y)} L${r(x + 2.6)} ${r(y + 5)} L${r(x + 1.3)} ${r(y + 6)} L${r(x)} ${r(y + 5)} L${r(x - 1.3)} ${r(y + 6)} L${r(x - 2.6)} ${r(y + 5)} Z" fill="${farben[i % 6]}"/>`;
    k += `<circle cx="${r(x)}" cy="${r(y + 2.4)}" r=".7" fill="${S.id ? "#f8f4ea" : ""}" opacity=".85"/><path d="M${r(x - 1.6)} ${r(y + 1)} h.8 M${r(x + 0.8)} ${r(y + 1)} h.8 M${r(x - 1.4)} ${r(y + 4)} l.6 -.6 l.6 .6 M${r(x + 0.2)} ${r(y + 4)} l.6 -.6 l.6 .6" stroke="#f8f4ea" stroke-width=".35" fill="none" opacity=".85"/>`;
  }
  S.teil({ oben: true, id: "girlande", de: "die Girlande", syl: "Gir-LAN-de", it: "la ghirlanda", itSyl: "ghir-LAN-da", en: "paper bunting", x: X, y: Y, kunst: k,
    tipp: "Die bunten Fähnchen aus Seidenpapier heißen Papel picado – „gestanztes Papier“." });
}
/* DIE FLAGGE Mexikos an einer Stange über dem Dach */
{
  const X = STAND.x0 + 3, Y = DACH - 17;
  let k = `<rect x="-.35" y="-20" width=".7" height="20" fill="#8a6440"/><circle cx="0" cy="-20.4" r=".6" fill="#d9b23a"/>`;
  const fw = 16, fh = 9.2, y0 = -19.6;
  const welle = (x0, x1, c) => `<path d="M${x0} ${r(y0 + Math.sin(x0 / fw * Math.PI) * 0.9)} Q${r((x0 + x1) / 2)} ${r(y0 + Math.sin((x0 + x1) / 2 / fw * Math.PI) * 0.9 - 0.4)} ${x1} ${r(y0 + Math.sin(x1 / fw * Math.PI) * 0.9)} L${x1} ${r(y0 + fh + Math.sin(x1 / fw * Math.PI) * 0.9)} Q${r((x0 + x1) / 2)} ${r(y0 + fh + Math.sin((x0 + x1) / 2 / fw * Math.PI) * 0.9 - 0.4)} ${x0} ${r(y0 + fh + Math.sin(x0 / fw * Math.PI) * 0.9)} Z" fill="${c}"/>`;
  k += welle(0.4, fw / 3, "#006847") + welle(fw / 3, fw * 2 / 3, "#f6f3ea") + welle(fw * 2 / 3, fw, "#ce1126");
  /* Wappen: Adler auf dem Nopal mit Schlange */
  const cx = fw / 2, cy = y0 + fh / 2 + 0.7;
  k += `<path d="M${cx - 1.6} ${r(cy + 1.8)} q1.6 .8 3.2 0" stroke="#3b8f4a" stroke-width=".5" fill="none"/><ellipse cx="${cx}" cy="${r(cy + 1.1)}" rx=".7" ry=".5" fill="#3b8f4a"/>`;
  k += `<path d="M${cx - 1} ${r(cy + 0.8)} Q${cx - 1.8} ${r(cy - 1.4)} ${cx - 0.4} ${r(cy - 2)} Q${cx + 1.4} ${r(cy - 2.4)} ${cx + 1.2} ${r(cy - 0.6)} Q${cx + 0.8} ${r(cy + 0.8)} ${cx - 1} ${r(cy + 0.8)} Z" fill="#7a4a22"/>`;
  k += `<path d="M${cx - 0.6} ${r(cy - 0.2)} q.8 .6 1.6 -.2" stroke="#3b8f4a" stroke-width=".3" fill="none"/>`;
  k += `<path d="M0 ${y0} L${fw} ${y0} L${fw} ${r(y0 + fh)} L0 ${r(y0 + fh)} Z" fill="${S.lg("flaggelicht", [[0, "#000", 0.1], [0.5, "#fff", 0.08], [1, "#000", 0.12]], 0, 0, 1, 0)}" opacity=".9"/>`;
  S.teil({ oben: true, id: "flagge", de: "die Flagge", syl: "FLAG-ge", it: "la bandiera", itSyl: "ban-DIE-ra", en: "flag", x: X, y: Y, kunst: k,
    tipp: "Auf der Flagge Mexikos sitzt ein Adler auf einem Kaktus und frisst eine Schlange." });
}

/* =====================================================================
   9 — DER TISCH mit dem Mittagessen (Wachstuch) — Lupe: Tortilla, Taco,
       Avocado, Guacamole, Limette
   ===================================================================== */
const TI = { x: 202, y: 196 };
const tischUnter = [];
{
  const s = sy(TI.y);                            /* ≈ 40 Einheiten je Meter */
  const sh = sy(TI.y - 7);                       /* Hinterkante, 0,6 m weiter weg */
  const B1 = 0.5 * s, B2 = 0.5 * sh, HV = 0.74 * s, HH = 0.74 * sh;
  const yv = TI.y - HV, yh = TI.y - 7 - HH;
  let k = `<path d="M${r(B1)} 0 L${r(-B1)} 0 L${r(-B1 - 30)} -5 L${r(B1 - 26)} -6 Z" fill="#2b3a1a" opacity=".26" filter="url(#bw_weich)"/>`;
  /* Beine */
  for (const [x, y, h] of [[-B2 + 1.5, -7, HH], [B2 - 2.5, -7, HH], [-B1 + 1.5, 0, HV], [B1 - 2.5, 0, HV]]) k += `<rect x="${r(x)}" y="${r(y - h)}" width="1.2" height="${r(h)}" fill="#7a5532"/>`;
  /* Tischplatte mit Wachstuch (gelb mit Früchten) und Volant */
  const cid = S.id("wachstuch");
  S.def(`<pattern id="${cid}" width="6" height="4" patternUnits="userSpaceOnUse"><rect width="6" height="4" fill="#ffd43b"/><circle cx="1.5" cy="1.2" r=".9" fill="#e03131"/><path d="M1.5 .3 l.3 -.4" stroke="#2b8a3e" stroke-width=".3"/><ellipse cx="4.3" cy="2.8" rx=".9" ry=".6" fill="#f76707"/><path d="M3.6 .8 q.6 -.6 1.2 0" stroke="#2b8a3e" stroke-width=".5" fill="none"/></pattern>`);
  k += `<path d="M${r(-B1)} ${r(-HV)} L${r(B1)} ${r(-HV)} L${r(B2)} ${r(-7 - HH)} L${r(-B2)} ${r(-7 - HH)} Z" fill="url(#${cid})"/>`;
  k += `<path d="M${r(-B1)} ${r(-HV)} L${r(B1)} ${r(-HV)} L${r(B2)} ${r(-7 - HH)} L${r(-B2)} ${r(-7 - HH)} Z" fill="${S.lg("tuchglanz", [[0, "#fff", 0.2], [1, "#000", 0.05]])}"/>`;
  k += `<path d="M${r(-B1)} ${r(-HV)} L${r(B1)} ${r(-HV)} L${r(B1 + 0.6)} ${r(-HV + 5)} L${r(-B1 - 0.6)} ${r(-HV + 5)} Z" fill="url(#${cid})"/><path d="M${r(-B1)} ${r(-HV)} L${r(B1)} ${r(-HV)} L${r(B1 + 0.6)} ${r(-HV + 5)} L${r(-B1 - 0.6)} ${r(-HV + 5)} Z" fill="#000" opacity=".12"/>`;
  const y0 = -HV - 1.4;   /* Standfläche der Speisen (Mitte der Platte) */
  /* DIE TORTILLA — Stapel im Korb mit besticktem Tuch */
  {
    const x = -9, y = y0;
    let g = `<path d="M${x - 5.6} ${y - 3} L${x + 5.6} ${y - 3} L${x + 4.6} ${y} L${x - 4.6} ${y} Z" fill="${S.lg("korb", [[0, "#c99a4e"], [1, "#8a5f2a"]])}"/>`;
    for (let i = 0; i < 6; i++) g += `<line x1="${x - 5 + i * 2}" y1="${y - 3}" x2="${x - 4.2 + i * 1.7}" y2="${y}" stroke="#7a5022" stroke-width=".3"/>`;
    for (let i = 0; i < 4; i++) g += `<ellipse cx="${x + 0.4}" cy="${r(y - 3.4 - i * 0.55)}" rx="4.6" ry="1.1" fill="${i % 2 ? "#f1d9a2" : "#e9cc8c"}" stroke="#c9a464" stroke-width=".2"/>`;
    for (let i = 0; i < 5; i++) g += `<circle cx="${r(x - 2.6 + i * 1.4)}" cy="${r(y - 5.3 + (i % 2) * 0.3)}" r=".22" fill="#a87a3c"/>`;
    g += `<path d="M${x - 5.8} ${y - 3} Q${x - 7.4} ${y - 4.4} ${x - 6} ${y - 6.4} Q${x - 4} ${y - 5.4} ${x - 2.6} ${y - 6} L${x - 3.4} ${y - 3} Z" fill="#f8f4ea"/><circle cx="${x - 5.4}" cy="${y - 4.6}" r=".55" fill="#d6336c"/>`;
    k += g;
    tischUnter.push({ id: "tortilla", de: "die Tortilla", syl: "Tor-TIL-la", it: "la tortilla", itSyl: "tor-TI-glia", en: "tortilla", x: TI.x + x, y: TI.y + y, kunst: flaeche(-6.4, -6.8, 12.8, 7, 0.4),
      tipp: "Tortillas sind dünne Fladen aus Maismehl – frisch und warm im Tuch." });
  }
  /* DER TACO — drei Tacos mit Cochinita pibil und roten Zwiebeln auf dem Teller */
  {
    const x = 3, y = y0 + 0.4;
    let g = `<ellipse cx="${x}" cy="${y - 0.4}" rx="6" ry="1.5" fill="#f4f1ea" stroke="#5b8fd6" stroke-width=".35"/>`;
    for (const dx of [-3.2, 0, 3.2]) {
      g += `<path d="M${x + dx - 2} ${y - 0.8} Q${x + dx - 2.6} ${y - 4.4} ${x + dx} ${y - 4.8} Q${x + dx + 2.6} ${y - 4.4} ${x + dx + 2} ${y - 0.8} Z" fill="#ecd29a" stroke="#c9a464" stroke-width=".2"/>`;
      g += `<path d="M${x + dx - 1.5} ${y - 1.4} Q${x + dx - 1.6} ${y - 3.6} ${x + dx} ${y - 4} Q${x + dx + 1.6} ${y - 3.6} ${x + dx + 1.5} ${y - 1.4}" fill="#b5532a"/>`;
      g += `<path d="M${x + dx - 1} ${y - 3.4} q.6 -.4 1.2 0 M${x + dx} ${y - 2.6} q.6 -.4 1.2 0" stroke="#e64980" stroke-width=".35" fill="none"/><circle cx="${x + dx + 0.6}" cy="${y - 3.2}" r=".25" fill="#2b8a3e"/>`;
    }
    k += g;
    tischUnter.push({ id: "taco", de: "der Taco", syl: "TA-co", it: "il taco", itSyl: "TA-co", en: "taco", x: TI.x + x, y: TI.y + y, kunst: flaeche(-6.2, -5.2, 12.4, 5.6, 0.4),
      tipp: "In Yucatán isst man Tacos mit Cochinita pibil – Schweinefleisch mit roten Zwiebeln." });
  }
  /* DIE GUACAMOLE im Molcajete (Mörser aus Lavastein, drei Füße) */
  {
    const x = 13.4, y = y0 + 0.6;
    let g = `<path d="M${x - 2.6} ${y - 2.2} L${x - 1.6} ${y - 1.6} L${x - 2.2} ${y} L${x - 3.2} ${y} Z M${x + 2.6} ${y - 2.2} L${x + 1.6} ${y - 1.6} L${x + 2.2} ${y} L${x + 3.2} ${y} Z M${x - 0.6} ${y - 1.4} L${x + 0.6} ${y - 1.4} L${x + 0.5} ${y + 0.4} L${x - 0.5} ${y + 0.4} Z" fill="#33312e"/>`;
    g += `<path d="M${x - 3.8} ${y - 3.6} Q${x} ${y + 0.4} ${x + 3.8} ${y - 3.6} Z" fill="${S.lg("lava", [[0, "#5a5652"], [1, "#2e2c2a"]])}"/>`;
    for (let i = 0; i < 8; i++) g += `<circle cx="${r(x - 2.6 + rnd() * 5.2)}" cy="${r(y - 3 + rnd() * 1.6)}" r=".2" fill="#1d1c1a"/>`;
    g += `<ellipse cx="${x}" cy="${y - 3.6}" rx="3.8" ry="1" fill="#6fa83c"/><path d="M${x - 3} ${y - 3.8} Q${x} ${y - 5.2} ${x + 3} ${y - 3.8} Q${x} ${y - 3} ${x - 3} ${y - 3.8} Z" fill="#8cc152"/>`;
    g += `<circle cx="${x - 1}" cy="${y - 4.2}" r=".3" fill="#e03131"/><circle cx="${x + 0.8}" cy="${y - 4}" r=".28" fill="#f8f4ea"/><circle cx="${x + 0.1}" cy="${y - 4.5}" r=".25" fill="#2b8a3e"/>`;
    k += g;
    tischUnter.push({ id: "guacamole", de: "die Guacamole", syl: "Gu-a-ca-MO-le", it: "il guacamole", itSyl: "gua-ca-MO-le", en: "guacamole", x: TI.x + x, y: TI.y + y, kunst: flaeche(-4.2, -5.4, 8.4, 5.8, 0.4),
      tipp: "Guacamole ist zerdrückte Avocado mit Limette, Zwiebel und Chili – im Steinmörser Molcajete." });
  }
  /* DIE AVOCADO — eine halbe mit Kern und eine ganze */
  {
    const x = -14.6, y = y0 + 1.6;
    let g = `<ellipse cx="${x - 2.6}" cy="${y - 1.6}" rx="1.7" ry="2.2" fill="#2f4a1c" transform="rotate(-30 ${x - 2.6} ${y - 1.6})"/>`;
    g += `<path d="M${x} ${y} Q${x - 2.2} ${y - 0.4} ${x - 2} ${y - 2.6} Q${x - 1.4} ${y - 4.4} ${x + 0.2} ${y - 4.2} Q${x + 2} ${y - 3.8} ${x + 2} ${y - 1.6} Q${x + 1.8} ${y + 0.2} ${x} ${y} Z" fill="#355e1e"/>`;
    g += `<path d="M${x} ${y - 0.5} Q${x - 1.6} ${y - 0.8} ${x - 1.4} ${y - 2.6} Q${x - 1} ${y - 3.8} ${x + 0.2} ${y - 3.6} Q${x + 1.5} ${y - 3.3} ${x + 1.4} ${y - 1.6} Q${x + 1.3} ${y - 0.4} ${x} ${y - 0.5} Z" fill="#d8e88a"/>`;
    g += `<circle cx="${x}" cy="${y - 1.8}" r=".95" fill="#8a5a2a"/><circle cx="${x - 0.3}" cy="${y - 2.1}" r=".3" fill="#c48a52"/>`;
    k += g;
    tischUnter.push({ id: "avocado", de: "die Avocado", syl: "A-vo-CA-do", it: "l'avocado", itSyl: "a-vo-CA-do", en: "avocado", x: TI.x + x, y: TI.y + y, kunst: flaeche(-4.8, -4.8, 7.4, 5.2, 0.4),
      tipp: "Die Avocado stammt aus Mexiko. Schon die Maya und Azteken haben sie gegessen." });
  }
  /* DIE LIMETTE — halbiert und ganz */
  {
    const x = 9, y = y0 - 5.2;
    let g = `<circle cx="${x + 1.8}" cy="${y - 1.1}" r="1.2" fill="${S.rg("limette", [[0, "#94d82d"], [1, "#4c8a1a"]], 0.35, 0.3)}"/>`;
    g += `<ellipse cx="${x - 0.6}" cy="${y - 1}" rx="1.35" ry="1.1" fill="#5c940d"/><ellipse cx="${x - 0.6}" cy="${y - 1.1}" rx="1.1" ry=".85" fill="#d8f5a2"/>`;
    for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; g += `<line x1="${x - 0.6}" y1="${y - 1.1}" x2="${r(x - 0.6 + Math.cos(a) * 0.9)}" y2="${r(y - 1.1 + Math.sin(a) * 0.7)}" stroke="#a9e34b" stroke-width=".15"/>`; }
    k += g;
    tischUnter.push({ id: "limette", de: "die Limette", syl: "Li-MET-te", it: "la limetta", itSyl: "li-MET-ta", en: "lime", x: TI.x + x, y: TI.y + y, kunst: flaeche(-2.4, -2.8, 5.8, 3.2, 0.4),
      tipp: "In Mexiko kommt auf fast alles ein Spritzer Limettensaft." });
  }
  S.teil({ id: "tisch", de: "der Tisch", syl: "TISCH", it: "il tavolo", itSyl: "TA-vo-lo", en: "table", x: TI.x, y: TI.y, steht: true, kunst: k,
    zoom: { x: TI.x - 22, y: TI.y - HV - 17, w: 42, h: 28 },
    unter: tischUnter });
}

/* Abendlicht: warmer Schein von rechts (fängt nichts ab) */
S.davor(`<rect width="320" height="200" fill="${S.rg("abendlicht", [[0, "#ffd89a", 0.2], [0.5, "#ffd89a", 0.05], [1, "#ffd89a", 0]], 1, 0.45, 0.9)}"/>`);

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/mexiko.js"));
console.log(aus);
