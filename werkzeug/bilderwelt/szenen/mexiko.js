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
     Am Fuß der Nordtreppe zwei massige SCHLANGENKÖPFE aus Stein: offenes
     Maul mit Fangzähnen, heraushängende Zunge, hochgerollte Nasenschnecke,
     Federbusch (Kukulcán, die gefiederte Schlange). Oben der Tempel; sein
     Eingang im Norden ist durch zwei SCHLANGENSÄULEN dreigeteilt (Kopf
     unten am Boden, Rassel-Schwanz oben trägt den Türsturz).
   - Zur Tagundnachtgleiche (März/September) gegen 16:30 Uhr steht die
     Sonne ≈ 20° hoch im Westen: Die Westseite leuchtet golden, die Nord-
     seite liegt im Schatten, und die Terrassenecken werfen sieben
     Dreiecke aus Licht auf die Westwange der Nordtreppe – eine Schlange
     aus Licht, die zum steinernen Kopf hinabkriecht. Schatten fallen
     lang (≈ 2,75-mal so lang wie hoch) nach Ostnordost, im Bild nach
     links; der Schatten der Pyramide reicht ≈ 80 m weit über den Rasen.
     Tausende Besucher kommen; auf die Pyramide klettern darf man seit
     2006 nicht mehr.
   - Links (Osten) liegt der TEMPEL DER KRIEGER: vier Stufen mit Reliefs
     (Krieger, Jaguare, Adler), breite Treppe nach Westen zur Plaza, oben
     der Tempel mit zwei Schlangensäulen am Eingang, davor der liegende
     Chac Mool mit erhobenem Kopf und Schale auf dem Bauch, an den Ecken
     Masken des Regengottes Chaac. Davor die „Tausend Säulen“: Reihen
     viereckiger Pfeiler. In Wirklichkeit steht er weiter links; im Bild
     ist er (im Raum gebaut, mit derselben Kamera) wie auf einem Panorama
     an den Rand gerückt.
   - Auf den Wegen verkaufen Maya-Familien aus den Dörfern Kunsthand-
     werk: Jaguar-Pfeifen aus rotbraunem Ton (sie „brüllen“), Masken,
     bunte Totenköpfe (Calaveras, Tag der Toten), Rasseln (Maracas),
     Hängematten (Yucatán ist berühmt dafür: Netz mit vielen Schnüren,
     „brazos“, die zu einer Schlaufe zusammenlaufen), Sarapes (bunte
     Decken), Hüte. In Yucatán trägt man den feinen JIPI-HUT aus Palmstroh
     (aus Bécal, Campeche); den breiten Sombrero kennt man aus ganz Mexiko.
     Kleine Papierfähnchen Mexikos stecken in einem Becher. Der Stand hat
     ein Palmdach (Palapa).
     Die Verkäuferin trägt den HUIPIL: weißes Baumwollkleid mit bunt
     gestickten Blumen am viereckigen Halsausschnitt und am Saum, darunter
     den Unterrock (Fustán) mit Spitze; das lange Haar ist zum Knoten
     gebunden, mit Band.
   - Mittagessen der Händlerin an ihrem Stand: Maistortillas im bestickten
     Tuch (Servilleta), weiche Tacos mit Cochinita pibil und rosa Zwiebeln,
     Guacamole im Steinmörser (Molcajete), Avocado, Limetten.
   - Pflanzen und Tiere: der heilige Kapokbaum (Ceiba, Yaxché): hoher,
     glatter, graugrüner Stamm mit Brettwurzeln, fast waagrechte Äste in
     Stockwerken mit flachen Laubschirmen; die Agave Henequén (dicke,
     graugrüne Schwertblätter mit gezähntem Rand und Enddorn, alte
     Pflanzen auf kurzem Stamm, Fasern für Seile und Hängematten);
     Leguane sonnen sich auf den warmen Steinen. Mexikos Flagge: grün,
     weiß, rot, in der Mitte der Adler auf dem Nopal-Kaktus mit Schlange.
   BLICK: Augenhöhe 1,6 m, Horizont y = 132, Brennweite 300; alle Bauten
   und der Besucherweg sind im Raum gebaut (X Osten, Y oben, Z Norden) und
   ins Bild gerechnet. Einheiten je Meter am Boden: s(y) = (y − 132) / 1,6
   (Tisch y 194: 39 → 0,74 m hoch = 29; Verkäuferin y 177: 28 → 1,56 m = 44;
   Besucher y 147: 9,4 → 1,7 m = 16).
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
const halb = (svg) => svg.replace(/ (d|x1|y1|x2|y2|cx|cy|rx|ry)="([^"]*)"/g, (m, a, v) => ` ${a}="${v.replace(/-?\d+\.\d+/g, (n) => String(Math.round(+n * 2) / 2))}"`);
const pts = (a) => a.map(([x, y]) => `${r(x)} ${r(y)}`).join(" L");
B.mensch({}, 10);

/* ---------- Kamera: Betrachter NNW der Pyramide, 112 m vom Mittelpunkt ---------- */
const KAM = (() => {
  const b = 335 * Math.PI / 180, D = 112, fb = b - Math.PI, rb = fb + Math.PI / 2;
  return { vx: D * Math.sin(b), vz: D * Math.cos(b), fx: Math.sin(fb), fz: Math.cos(fb), rx: Math.sin(rb), rz: Math.cos(rb), F: 300, CX: 134 };
})();
const P = (X, Y, Z) => { const dx = X - KAM.vx, dz = Z - KAM.vz; const d = dx * KAM.fx + dz * KAM.fz, l = dx * KAM.rx + dz * KAM.rz; return [KAM.CX + KAM.F * l / d, HY - KAM.F * (Y - 1.6) / d]; };
/* Bildpunkt am Boden → Raum */
const BODEN = (x, y) => { const d = KAM.F * 1.6 / (y - HY), l = (x - KAM.CX) * d / KAM.F; return [KAM.vx + d * KAM.fx + l * KAM.rx, KAM.vz + d * KAM.fz + l * KAM.rz]; };
/* Vieleck auf den Bildrahmen kappen (Sutherland–Hodgman), damit nichts aus dem Bild ragt */
function kappe(p, x0 = 0, y0 = -3, x1 = 320, y1 = 203) {
  const schnitt = (p, innen, quer) => { const o = []; for (let i = 0; i < p.length; i++) { const a = p[i], b = p[(i + 1) % p.length], ia = innen(a), ib = innen(b); if (ia) o.push(a); if (ia !== ib) o.push(quer(a, b)); } return o; };
  const qx = (x) => (a, b) => [x, a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0])], qy = (y) => (a, b) => [a[0] + (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]), y];
  p = schnitt(p, (q) => q[0] >= x0, qx(x0)); if (p.length) p = schnitt(p, (q) => q[0] <= x1, qx(x1));
  if (p.length) p = schnitt(p, (q) => q[1] >= y0, qy(y0)); if (p.length) p = schnitt(p, (q) => q[1] <= y1, qy(y1));
  return p;
}
const flaech = (a, fill, extra = "") => { const q = kappe(a.map((p) => P(...p))); return q.length > 2 ? `<path d="M${pts(q)} Z" fill="${fill}"${extra}/>` : ""; };
/* Sonne: 20° hoch im Westen (Azimut 260°) — Schatten fallen nach Ostnordost, 2,75 × Höhe */
const SD = [0.985 * 2.75, 0.174 * 2.75];
const schattenAuf = (X, Y, Z) => [X + Y * SD[0], 0, Z + Y * SD[1]];
/* Schatten eines Dings im Bild: Fuß bei (x|y) im Bild, Höhe h (m), Breite b (m) */
const bildSchatten = (x, y, h, b, a = 0.24) => {
  const [X, Z] = BODEN(x, y), d = b / 2;
  const q = kappe([[X, Z - d], [X, Z + d], [X + h * SD[0], Z + d + h * SD[1]], [X + h * SD[0], Z - d + h * SD[1]]].map(([u, v]) => P(u, 0, v)), 1, -3, 319, 203).map(([u, v]) => [u - x, v - y]);
  return `<path d="M${pts(q)} Z" fill="${LANGSCHATTEN}" opacity="${r(Math.min(1, a / 0.24))}"/>`;
};
/* langer, schmaler Schatten vom Fuß nach links in die Tiefe: am Fuß kräftig, am Ende weich */
S.def(`<linearGradient id="${S.id("langschatten")}" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#1f2c14" stop-opacity=".34"/><stop offset=".7" stop-color="#1f2c14" stop-opacity=".16"/><stop offset="1" stop-color="#1f2c14" stop-opacity="0"/></linearGradient>`);
const LANGSCHATTEN = `url(#${S.id("langschatten")})`;

const huelle = (punkte) => {
  const p = punkte.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const kreuz = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const u = [], o = [];
  for (const q of p) { while (u.length >= 2 && kreuz(u[u.length - 2], u[u.length - 1], q) <= 0) u.pop(); u.push(q); }
  for (const q of p.slice().reverse()) { while (o.length >= 2 && kreuz(o[o.length - 2], o[o.length - 1], q) <= 0) o.pop(); o.push(q); }
  return u.slice(0, -1).concat(o.slice(0, -1));
};

/* ---------- Stoffe ---------------------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("dunst")}" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="1.5"/></filter>`);
S.def(`<pattern id="${S.id("wald")}" width="3" height="2.2" patternUnits="userSpaceOnUse"><rect width="3" height="2.2" fill="#3f5f33"/><circle cx=".8" cy=".8" r=".8" fill="#4a6b3a"/><circle cx="2.3" cy="1.6" r=".85" fill="#36542c"/><circle cx="2.4" cy=".3" r=".5" fill="#56763f"/></pattern>`);
S.def(`<pattern id="${S.id("gras")}" width="13" height="6.2" patternUnits="userSpaceOnUse"><rect width="13" height="6.2" fill="#6f9440"/><path d="M4.2 1.2l0.14 -0.6M7.0 2.4l-0.40 -0.9M0.5 2.8l-0.39 -0.6M5.5 5.0l-0.34 -0.7M8.2 5.7l0.07 -0.8M12.7 0.7l0.32 -0.7M1.9 1.1l-0.17 -1.0M2.3 3.7l0.13 -0.8M7.1 0.8l-0.40 -0.7M8.8 2.8l-0.17 -0.9M5.9 2.1l0.26 -0.9M3.2 3.6l0.02 -1.0M9.5 2.0l0.43 -0.7M5.4 4.6l-0.31 -0.8M0.5 4.1l0.24 -0.9M11.4 2.2l0.18 -0.9" stroke="#7d9f4b" stroke-width=".2" opacity=".7"/></pattern>`);
S.def(`<pattern id="${S.id("palapa")}" width="3" height="2.4" patternUnits="userSpaceOnUse"><rect width="3" height="2.4" fill="#b8955a"/><path d="M0 .4 Q1.5 1.4 3 .4 M-1.5 1.6 Q0 2.6 1.5 1.6 M1.5 1.6 Q3 2.6 4.5 1.6" stroke="#8a6a38" stroke-width=".35" fill="none"/><path d="M.6 0 L.9 2.4 M2.2 0 L2 2.4" stroke="#d2b47a" stroke-width=".2"/></pattern>`);
S.def(`<pattern id="${S.id("sarape")}" width="12" height="2.6" patternUnits="userSpaceOnUse"><rect width="12" height="2.6" fill="#b52d3a"/><rect y=".2" width="12" height=".3" fill="#f1c232"/><rect y=".6" width="12" height=".5" fill="#1e7a6e"/><rect y="1.2" width="12" height=".2" fill="#f4efe2"/><rect y="1.5" width="12" height=".4" fill="#e07a2a"/><rect y="2" width="12" height=".25" fill="#2c3f8f"/></pattern>`);
const WALD = `url(#${S.id("wald")})`;
const DUNST = `url(#${S.id("dunst")})`;
S.def(`<linearGradient id="${S.id("spurN")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3d3a33" stop-opacity=".22"/><stop offset="1" stop-color="#3d3a33" stop-opacity="0"/></linearGradient><linearGradient id="${S.id("spurW")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a5a34" stop-opacity=".22"/><stop offset="1" stop-color="#7a5a34" stop-opacity="0"/></linearGradient>`);
const LICHT = S.lg("kalklicht", [[0, "#f4cf8e"], [1, "#e4ae6a"]]);         /* Westseite im goldenen Abendlicht */
const SCHATTEN = S.lg("kalkschatten", [[0, "#aea596"], [1, "#958c7e"]]);  /* Nordseite im Schatten */

/* =====================================================================
   KULISSE — später Nachmittag: warmer Himmel, Wolken mit goldenen
   Rändern (Sonne rechts außerhalb), Wald, Rasen, lange Schatten, Weg
   ===================================================================== */
const W0 = 27.65, WT = 9.75, HT = 24, NT = 9, TH = HT / NT;
let STEIN = "";
const KT = { x: 108, z: -46, h: 20, stufen: 4, sh: 3, tw: 10 };   /* Tempel der Krieger (an den Rand gerückt) */
{
  let k = `<rect width="320" height="${HY + 1}" fill="${S.lg("himmel", [[0, "#3c70b4"], [0.45, "#7ea9d2"], [0.78, "#e2c9a6"], [1, "#f4c48a"]])}"/>`;
  k += `<rect width="320" height="${HY + 1}" fill="${S.rg("abendsonne", [[0, "#ffe2a8", 0.9], [0.3, "#ffc978", 0.4], [1, "#ffc978", 0]], 1.05, 0.62, 0.75)}"/>`;
  /* Abendwolken: flach und zerfasert, Bauch flach und grauviolett, Oberseite hell und kühl,
     zur Sonne (rechts) ein rosa-goldener Rand; kein Schatten auf dem Himmel */
  const WB = S.lg("wolkebauch", [[0, "#f6f1ec"], [0.5, "#e3dae0"], [1, "#a99cb0"]]), WR = S.lg("wolkerand", [[0, "#ffffff", 0], [0.7, "#ffd9b0", 0], [1, "#ffb98a", 0.85]], 0, 0, 1, 0);
  for (const [x, y, w] of [[62, 34, 24], [98, 20, 13], [224, 26, 13], [32, 62, 10], [268, 44, 9]]) {
    const bu = []; let u = -w;
    while (u < w) { const rr = w * (0.17 + rnd() * 0.2) * (1 - Math.abs(u) / w * 0.4); bu.push([u, rr]); u += rr * (1 + rnd() * 0.6); }
    let d = `M${r(x - w)} ${y}`;
    bu.forEach(([u2, rr], i) => { const xe = i === bu.length - 1 ? x + w : x + (u2 + bu[i + 1][0]) / 2 + rr * 0.2; d += ` A${r(rr * 1.3)} ${r(rr)} 0 0 1 ${r(xe)} ${r(y - (i === bu.length - 1 ? 0 : rr * (0.5 + 0.5 * (1 - Math.abs(u2) / w))))}`; });
    d += " Z";
    k += `<path d="${d}" fill="${WB}"/><path d="${d}" fill="${WR}"/>`;
    k += `<path d="M${r(x - w * 1.25)} ${r(y + 0.6)} H${r(x - w * 0.6)} M${r(x + w * 0.5)} ${r(y + 0.9)} H${r(x + w * 1.3)}" stroke="#d9cbd0" stroke-width=".5" stroke-linecap="round" opacity=".7"/>`;
  }
  /* Yucatán ist flach: eine gerade Baumlinie, oben nur kleine Kronenbuckel, dunstig blaugrün */
  let d = `M0 ${HY + 1} L0 127.5`;
  /* hinter dem Tempel der Krieger (Ostseite der Plaza) stehen die Bäume näher: Baumlinie dort höher */
  const hoch = (x) => x < 70 ? 7.5 * Math.min(1, (70 - x) / 22) : 0;
  for (let x = 0; x <= 320; x += 2.5) d += ` Q${r(x + 1.25)} ${r(126.2 - hoch(x + 1.25) - rnd() * 1.6)} ${r(x + 2.5)} ${r(127.6 - hoch(x + 2.5) + rnd() * 0.6)}`;
  d += ` L320 ${HY + 1} Z`;
  k += `<path d="${d}" fill="${WALD}"/><path d="${d}" fill="${S.lg("waldluft", [[0, "#b9c4bc", 0.62], [1, "#7d9a86", 0.35]])}"/>`;
  /* Rasen der Großen Plaza, im warmen Streiflicht */
  k += `<rect x="0" y="${HY}" width="320" height="${200 - HY}" fill="url(#${S.id("gras")})"/>`;
  k += `<rect x="0" y="${HY}" width="320" height="${200 - HY}" fill="${S.lg("rasen", [[0, "#e6d29a", 0.5], [0.3, "#a8b35e", 0.15], [1, "#3f6a24", 0.25]])}"/>`;
  for (let i = 0; i < 12; i++) { const y = HY + 3 + Math.pow(rnd(), 1.3) * 62, x = rnd() * 320, s = sy(y); k += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(0.7 * s)}" ry="${r(0.1 * s)}" fill="#b8a76a" opacity=".22"/>`; }
  /* festgetretener Kalkboden (Sascab) unter den Händlerständen am Wegrand – dort steht auch der Esstisch */
  k += `<path d="M164 200 Q168 184 192 178 Q226 170 270 171 Q306 173 322 178 L322 200 Z" fill="${S.lg("sascab", [[0, "#dccaa0", 0.75], [1, "#cdb486", 0.95]])}" filter="${DUNST}"/>`;
  for (let i = 0; i < 26; i++) { const x = 176 + rnd() * 144, y = 177 + rnd() * 23; k += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(0.25 + rnd() * 0.4)}" ry=".18" fill="#9c8a62" opacity=".5"/>`; }
  /* Schatten der Pyramide: Hülle aus Fuß und den Schattenpunkten von Plattform und Tempel */
  const sp = [];
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) { sp.push([sx * W0, 0, sz * W0], schattenAuf(sx * WT, HT, sz * WT), schattenAuf(sx * 6, 30, sz * 6)); }
  k += `<path d="M${pts(huelle(sp.map(([X, , Z]) => [X, Z])).map(([X, Z]) => P(X, 0, Z)))} Z" fill="#203016" opacity=".3" filter="${DUNST}"/>`;
  /* Besucherweg aus weißem Kalkschotter: von der Nordtreppe im Bogen zum Betrachter (im Raum gerechnet) */
  const mitte = [[0, 36], [-4, 46], [-11, 56], [-19, 65], [-27, 73], [-33, 79], [-37.5, 84], [-41, 88.5], [-43.5, 92], [-45.2, 95]];
  const links = [], rechts = [];
  mitte.forEach(([X, Z], i) => {
    const [X2, Z2] = mitte[Math.min(i + 1, mitte.length - 1)], [X1, Z1] = mitte[Math.max(i - 1, 0)];
    const dx = X2 - X1, dz = Z2 - Z1, l = Math.hypot(dx, dz), nx = -dz / l * 1.3, nz = dx / l * 1.3;
    links.push(P(X + nx, 0, Z + nz)); rechts.push(P(X - nx, 0, Z - nz));
  });
  const weg = [...links, ...rechts.reverse()];
  k += `<path d="M${pts(weg)} Z" fill="${S.lg("weg", [[0, "#ddd0b0"], [1, "#cdbb94"]])}" opacity=".85"/>`;
  for (let i = 0; i < 46; i++) {
    const t = rnd(), j = Math.min(mitte.length - 2, Math.floor(t * (mitte.length - 1))), f = t * (mitte.length - 1) - j;
    const X = mitte[j][0] + (mitte[j + 1][0] - mitte[j][0]) * f + (rnd() - 0.5) * 2.2, Z = mitte[j][1] + (mitte[j + 1][1] - mitte[j][1]) * f;
    const [x, y] = P(X, 0, Z), s = sy(y);
    k += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(Math.max(0.15, 0.05 * s))}" ry="${r(Math.max(0.08, 0.025 * s))}" fill="#a99b7c" opacity=".55"/>`;
  }
  /* Schatten des Tempels der Krieger */
  const kh = [];
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) kh.push([KT.x + sx * 20, KT.z + sz * 20], schattenAuf(KT.x + sx * 12, 12, KT.z + sz * 12).filter((_, i) => i !== 1));
  k += `<path d="M${pts(huelle(kh).map(([X, Z]) => P(X, 0, Z)))} Z" fill="#203016" opacity=".25" filter="${DUNST}"/>`;
  /* langer Schatten des Kapokbaums (liegt auf dem Rasen, unter allem anderen) */
  k += `<g transform="translate(237 141)">${bildSchatten(237, 141, 18, 1.6, 0.18)}</g>`;
  /* ein herabgefallener Stein mit Relief (Federschlange) am Wegrand */
  {
    const sx0 = 96, sy0 = 186, s = sy(sy0), w = 0.9 * s, h = 0.42 * s, t = 0.18 * s;
    let g = bildSchatten(sx0, sy0, 0.42, 0.9, 0.3);
    /* Quader (deckend): Vorderseite, Oberseite teilt mit ihr die Kante und weicht zum Fluchtpunkt
       nach rechts oben zurück, rechts die schmale Seitenfläche; Kanten gerundet und abgeplatzt */
    const W2 = w / 2, dx = 2.2;
    g += `<path d="M${r(-W2 + 0.8)} ${r(-h)} L${r(W2 - 0.8)} ${r(-h)} L${r(W2 - 0.8 + dx)} ${r(-h - t)} L${r(-W2 + 1.6 + dx)} ${r(-h - t)} Q${r(-W2 + 0.4 + dx)} ${r(-h - t + 0.2)} ${r(-W2 + 0.8)} ${r(-h)} Z" fill="#ecdcb6"/>`;
    g += `<path d="M${r(W2 - 0.8)} ${r(-h)} L${r(W2 - 0.8 + dx)} ${r(-h - t)} L${r(W2 + dx)} ${r(-t * 0.8)} L${r(W2)} 0 Z" fill="#b5a682"/>`;
    g += `<path d="M${r(-W2 + 1)} 0 L${r(W2 - 1)} 0 Q${r(W2)} 0 ${r(W2)} -1 L${r(W2)} ${r(-h + 2)} L${r(W2 - 1.4)} ${r(-h + 0.3)} L${r(W2 - 2.6)} ${r(-h)} L${r(-W2 + 0.8)} ${r(-h)} Q${r(-W2 + 0.1)} ${r(-h + 0.2)} ${r(-W2 + 0.1)} ${r(-h + 1.2)} L${r(-W2)} -1 Q${r(-W2)} 0 ${r(-W2 + 1)} 0 Z" fill="${S.lg("block", [[0, "#a59b86"], [0.7, "#d2c19a"], [1, "#e2d0a8"]], 0, 0, 1, 0)}"/>`;
    g += `<path d="M${r(-W2)} -3 L${r(-W2 + 1.6)} -1.6 L${r(-W2 + 0.6)} 0 Z" fill="#8f8672"/>`;
    /* Relief: Kukulcán – breiter Leib mit Rautenschuppen, Federbüschel am Rücken, Kopf wie an der Treppe
       (Nasenschnecke, offenes Maul, Zunge); Licht oben, Schattenkante unten */
    const yb = -h * 0.48, leib = `M${r(-W2 + 2)} ${r(yb + 1.2)} C${r(-W2 + 6)} ${r(yb - 4)} ${r(-W2 + 10)} ${r(yb + 4.6)} ${r(-1.5)} ${r(yb)} S${r(4)} ${r(yb - 3.6)} ${r(W2 - 9.5)} ${r(yb - 0.3)}`;
    g += `<path d="${leib}" stroke="#6f6553" stroke-width="3.6" fill="none" transform="translate(.3 .5)"/><path d="${leib}" stroke="#e7d6ad" stroke-width="3.4" fill="none"/>`;
    g += `<path d="${leib}" stroke="#a69a7e" stroke-width="2.2" fill="none" stroke-dasharray=".9 .9"/>`;
    g += `<path d="${leib}" stroke="#f5e8c6" stroke-width=".5" fill="none" transform="translate(0 -1.3)"/>`;
    let fed = "";
    for (let i = 0; i < 6; i++) { const x = -W2 + 4.5 + i * (w - 16) / 5, y = yb - 2.4 + Math.sin(i * 1.4) * 1.1; fed += `M${r(x)} ${r(y)} l-.5 -1.6 M${r(x + 0.6)} ${r(y)} l.1 -1.8 M${r(x + 1.2)} ${r(y)} l.6 -1.5`; }
    g += `<path d="${fed}" stroke="#d6c398" stroke-width=".55" stroke-linecap="round"/>`;
    /* Kopf vom Typ der Treppenköpfe: eckige Schnauze, oben die Nasenschnecke, weit offenes Maul mit zwei
       Fangzähnen, breite herausgestreckte Zunge, dahinter der Federbusch; erhaben (Licht oben, Schatten unten) */
    const kx = W2 - 9.5, ky = yb - 0.4;
    const kopfP = `M${r(kx - 0.8)} ${r(ky - 2.6)} L${r(kx + 3.4)} ${r(ky - 2.8)} L${r(kx + 4.6)} ${r(ky - 1.8)} L${r(kx + 4.6)} ${r(ky - 0.9)} L${r(kx + 1.6)} ${r(ky - 0.5)} L${r(kx + 1.6)} ${r(ky + 0.6)} L${r(kx + 4.4)} ${r(ky + 1)} L${r(kx + 4.2)} ${r(ky + 2)} L${r(kx - 0.8)} ${r(ky + 2.2)} Z`;
    g += `<path d="${kopfP}" fill="#6f6553" transform="translate(.3 .45)"/><path d="${kopfP}" fill="#e7d6ad"/>`;
    g += `<path d="M${r(kx + 1.6)} ${r(ky - 0.5)} L${r(kx + 4.6)} ${r(ky - 0.9)} L${r(kx + 4.4)} ${r(ky + 1)} L${r(kx + 1.6)} ${r(ky + 0.6)} Z" fill="#7a6e5a"/>`;
    g += `<path d="M${r(kx + 2.4)} ${r(ky - 0.6)} l.3 .8 l.3 -.85 M${r(kx + 3.5)} ${r(ky - 0.75)} l.3 .85 l.3 -.9" fill="#f4ead2"/>`;
    g += `<path d="M${r(kx + 1.8)} ${r(ky + 0.15)} L${r(kx + 6)} ${r(ky + 0.3)} L${r(kx + 6.6)} ${r(ky - 0.1)} L${r(kx + 6.2)} ${r(ky + 0.55)} L${r(kx + 6.6)} ${r(ky + 1.1)} L${r(kx + 5.9)} ${r(ky + 0.75)} L${r(kx + 1.8)} ${r(ky + 0.6)} Z" fill="#dccb9f" stroke="#6f6553" stroke-width=".25"/>`;
    g += `<path d="M${r(kx + 1.6)} ${r(ky - 2.8)} q.2 -1.4 1.3 -1.2 q.9 .3 .5 1.1 q-.4 .5 -.9 .1" stroke="#6f6553" stroke-width=".35" fill="none"/>`;
    g += `<path d="M${r(kx + 0.2)} ${r(ky - 1.5)} h1 v.7 h-1 Z" fill="none" stroke="#6f6553" stroke-width=".3"/><path d="M${r(kx - 0.3)} ${r(ky - 2.2)} h1.8" stroke="#f5e8c6" stroke-width=".35"/>`;
    for (let i = 0; i < 5; i++) g += `<path d="M${r(kx - 0.8)} ${r(ky - 1.8 + i * 0.9)} l-1.8 ${r(-1.2 + i * 0.5)}" stroke="#d6c398" stroke-width=".7" stroke-linecap="round"/>`;
    /* Flechten: deckend, graugrün und gelblich, nur am unteren Rand und in den Vertiefungen */
    for (let i = 0; i < 7; i++) { const x = -W2 + 1.2 + rnd() * (w - 3), y = -0.5 - rnd() * 1.6; g += `<path d="M${r(x)} ${r(y)} q.5 -.6 1 -.1 q.5 -.2 .6 .4 q-.8 .5 -1.6 -.3 Z" fill="${rnd() < 0.5 ? "#7f8a5c" : "#b9b07a"}"/>`; }
    STEIN = `<g transform="translate(${sx0} ${sy0})">${g}</g>`;
  }
  S.hinten(k);
}

/* =====================================================================
   1 — DER TEMPEL DER KRIEGER (im Raum gebaut: vier Stufen, Westtreppe,
       Tempel mit Schlangensäulen, Chac Mool, Chaac-Masken) und
   2 — DIE SÄULE (Reihen viereckiger Pfeiler davor)
   ===================================================================== */
{
  const { x: CXk, z: CZk } = KT;
  const LI = S.lg("ktlicht", [[0, "#efc98a"], [1, "#dcae6c"]]), SC = "#a39a86";
  let k = "";
  /* vier Stufen: geneigter Sockel (Talud) und senkrechtes Feld (Tablero) mit Reliefband */
  for (let i = 0; i < 4; i++) {
    const a = 20 - i * 1.7, b = a - 0.5, y0 = i * 3, y1 = y0 + 3;
    k += flaech([[CXk - a, y0, CZk - a], [CXk - a, y0, CZk + a], [CXk - b, y1, CZk + b], [CXk - b, y1, CZk - b]], LI);
    k += flaech([[CXk - a, y0, CZk + a], [CXk + a, y0, CZk + a], [CXk + b, y1, CZk + b], [CXk - b, y1, CZk + b]], SC);
    k += flaech([[CXk - b - 0.02, y0 + 1.4, CZk - b + 1], [CXk - b - 0.02, y0 + 1.4, CZk + b - 1], [CXk - b - 0.02, y0 + 2.4, CZk + b - 1], [CXk - b - 0.02, y0 + 2.4, CZk - b + 1]], "#b98c54", ` opacity=".55"`);
    /* Nordseite: Talud unten, darüber Reliefplatten und ein helles Gesims an der Stufenkante */
    for (let px = CXk - b + 0.8; px < CXk + b - 2; px += 2.6) k += flaech([[px, y0 + 1.25, CZk + b + 0.02], [px + 1.9, y0 + 1.25, CZk + b + 0.02], [px + 1.9, y0 + 2.45, CZk + b + 0.02], [px, y0 + 2.45, CZk + b + 0.02]], "#7d7464", ` opacity=".5"`);
    k += flaech([[CXk - b - 0.1, y1 - 0.4, CZk + b + 0.08], [CXk + b, y1 - 0.4, CZk + b + 0.08], [CXk + b, y1, CZk + b + 0.08], [CXk - b - 0.1, y1, CZk + b + 0.08]], "#c9c1ae");
  }
  /* Westtreppe mit Wangen (zur Plaza), Stufen im Licht */
  const TB = 5.5;
  k += flaech([[CXk - 13.2, 12, CZk + TB], [CXk - 25, 0, CZk + TB], [CXk - 25, 0, CZk - TB], [CXk - 13.2, 12, CZk - TB]], S.lg("kttreppe", [[0, "#f4d29a"], [1, "#e2b878"]]));
  for (let st = 1; st < 24; st++) { const t = st / 24; const [a, b] = [P(CXk - 25 + 11.8 * t, 12 * t, CZk + TB), P(CXk - 25 + 11.8 * t, 12 * t, CZk - TB)]; k += `<line x1="${r(a[0])}" y1="${r(a[1])}" x2="${r(b[0])}" y2="${r(b[1])}" stroke="#b48d58" stroke-width=".15"/>`; }
  k += flaech([[CXk - 13.2, 12.4, CZk + TB], [CXk - 25, 0.4, CZk + TB], [CXk - 25, 0, CZk + TB + 1], [CXk - 13.2, 12, CZk + TB + 1]], "#cfa970");
  /* Tempel oben (Mauern, das Dach ist eingestürzt): Westfront mit Eingang */
  const tz = 9, tx = 8.5;
  k += flaech([[CXk - tx, 12, CZk - tz], [CXk - tx, 12, CZk + tz], [CXk - tx, 17.5, CZk + tz], [CXk - tx, 17.5, CZk - tz]], LI);
  k += flaech([[CXk - tx, 12, CZk + tz], [CXk + tx, 12, CZk + tz], [CXk + tx, 17.5, CZk + tz], [CXk - tx, 17.5, CZk + tz]], SC);
  k += flaech([[CXk - tx - 0.02, 12, CZk - 3.4], [CXk - tx - 0.02, 12, CZk + 3.4], [CXk - tx - 0.02, 16.2, CZk + 3.4], [CXk - tx - 0.02, 16.2, CZk - 3.4]], "#3d2f22");
  /* Schlangensäulen am Eingang: Kopf am Boden, Schaft, Rassel oben */
  for (const z of [-1.5, 1.5]) {
    k += flaech([[CXk - tx - 0.1, 12.4, CZk + z - 0.5], [CXk - tx - 0.1, 12.4, CZk + z + 0.5], [CXk - tx - 0.1, 16.2, CZk + z + 0.5], [CXk - tx - 0.1, 16.2, CZk + z - 0.5]], "#e3bd82");
    k += flaech([[CXk - tx - 1.8, 12, CZk + z - 0.6], [CXk - tx - 1.8, 12, CZk + z + 0.6], [CXk - tx - 0.1, 12.9, CZk + z + 0.6], [CXk - tx - 0.1, 12.9, CZk + z - 0.6]], "#d9ad6c");
  }
  /* Chaac-Masken an den Ecken (gestapelt, mit Rüsselnase) */
  for (const z of [-tz + 0.8, tz - 0.8]) for (let j = 0; j < 3; j++) { const [mx, my] = P(CXk - tx - 0.05, 13 + j * 1.5, CZk + z); k += `<rect x="${r(mx - 0.5)}" y="${r(my - 0.45)}" width="1" height=".9" fill="#c99b5c"/><path d="M${r(mx)} ${r(my)} q.6 .1 .4 -.6" stroke="#8a6a3e" stroke-width=".25" fill="none"/>`; }
  /* Chac Mool vor dem Eingang: liegend, Knie hoch, Kopf zur Plaza gedreht, Schale auf dem Bauch */
  { const [cx, cy] = P(CXk - tx - 3.2, 12, CZk); k += `<path d="M${r(cx - 1.4)} ${r(cy)} l.3 -.6 l.8 .1 l.5 -.8 l.4 .8 l.8 0 l.3 .5 Z" fill="#d6b07a"/><circle cx="${r(cx - 1.2)}" cy="${r(cy - 0.8)}" r=".32" fill="#d6b07a"/>`; }
  /* Gesims, Verwitterung */
  k += flaech([[CXk - tx - 0.2, 17.5, CZk - tz - 0.2], [CXk - tx - 0.2, 17.5, CZk + tz + 0.2], [CXk - tx - 0.2, 18, CZk + tz + 0.2], [CXk - tx - 0.2, 18, CZk - tz - 0.2]], "#f3d8a6");
  S.teil({ id: "kriegertempel", de: "der Tempel der Krieger", syl: "TEM-pel der KRIE-ger", it: "il Tempio dei Guerrieri", itSyl: "TEM-pio dei guer-RIE-ri", en: "Temple of the Warriors", x: 23, y: 112, kunst: um(23, 112, k),
    tipp: "Der Tempel der Krieger hat vier Stufen. Eine breite Treppe führt hinauf zum Eingang." });

  /* Säulenreihen vor der Westseite: viereckige Pfeiler, Westseite im Licht, Nordseite im Schatten */
  const saeulen = [];
  for (let reihe = 0; reihe < 5; reihe++) for (let j = 0; j < 21; j++) saeulen.push([CXk - 26 - reihe * 3.6, CZk - 20 + j * 3.4]);
  saeulen.sort((a, b) => { const da = (a[0] - KAM.vx) * KAM.fx + (a[1] - KAM.vz) * KAM.fz, db = (b[0] - KAM.vx) * KAM.fx + (b[1] - KAM.vz) * KAM.fz; return db - da; });
  let sa = "";
  let anker = null;
  for (const [X, Z] of saeulen) {
    const [x] = P(X, 0, Z);
    if (x < -3 || x > 60) continue;
    const pl = (a2) => { const q = kappe(a2.map((p) => P(...p))); return q.length > 2 ? `M${pts(q)}Z` : ""; };
    sa += `<path d="${pl([[X - 0.56, 0, Z - 0.56], [X - 0.56, 0, Z + 0.56], [X - 0.56, 3.1, Z + 0.56], [X - 0.56, 3.1, Z - 0.56]])}" fill="#ecc890"/>`;
    sa += `<path d="${pl([[X - 0.56, 0, Z + 0.56], [X + 0.56, 0, Z + 0.56], [X + 0.56, 3.1, Z + 0.56], [X - 0.56, 3.1, Z + 0.56]])}M${pl([[X - 0.68, 3.1, Z + 0.68], [X + 0.68, 3.1, Z + 0.68], [X + 0.68, 3.5, Z + 0.68], [X - 0.68, 3.5, Z + 0.68]]).slice(1)}" fill="#a39780"/>`;
    sa += `<path d="${pl([[X - 0.68, 3.1, Z - 0.68], [X - 0.68, 3.1, Z + 0.68], [X - 0.68, 3.5, Z + 0.68], [X - 0.68, 3.5, Z - 0.68]])}" fill="#f4dcae"/>`;
    sa += `<path d="${pl([[X - 0.56, 2.95, Z + 0.57], [X + 0.56, 2.95, Z + 0.57], [X + 0.56, 3.1, Z + 0.57], [X - 0.56, 3.1, Z + 0.57]])}" fill="#5e5546"/>`;
    if (x > 10 && x < 18 && (!anker || x > anker[0])) anker = P(X, 3, Z);
  }
  S.teil({ id: "saeule", de: "die Säule", syl: "SÄU-le", it: "la colonna", itSyl: "co-LON-na", en: "column", x: anker[0], y: anker[1], kunst: um(anker[0], anker[1], sa),
    tipp: "Hier stehen so viele Säulen, dass man den Platz die „Gruppe der Tausend Säulen“ nennt." });
}

/* =====================================================================
   3 — DIE PYRAMIDE (El Castillo, Pyramide des Kukulcán) — Lupe:
       Treppe, Stufe, Schlangenkopf, Terrasse
   ===================================================================== */
const wT = (i) => W0 - i * (W0 - WT) / NT;           /* halbe Breite am Fuß der Terrasse i */
const SB = 4.5, BAL = 0.95;                           /* halbe Treppenbreite, Wange */
const ZF = WT + HT;                                   /* Fuß der Treppen (45°) */
const pyrUnter = [];
{
  let k = "";
  /* --- neun Terrassen: Nord- (Schatten) und Westwand (Licht), oben zuerst --- */
  for (let i = NT - 1; i >= 0; i--) {
    const w0 = wT(i), w1 = w0 - 0.62, y0 = i * TH, y1 = y0 + TH;
    k += flaech([[-w0, y0, -w0], [-w0, y0, w0], [-w1, y1, w1], [-w1, y1, -w1]], LICHT);
    k += flaech([[-w0, y0, w0], [w0, y0, w0], [w1, y1, w1], [-w1, y1, w1]], SCHATTEN);
    /* Gesims oben an jeder Terrasse */
    k += flaech([[-w1 - 0.12, y1 - 0.42, -w1 - 0.12], [-w1 - 0.12, y1 - 0.42, w1 + 0.12], [-w1 - 0.12, y1, w1 + 0.12], [-w1 - 0.12, y1, -w1 - 0.12]], "#f8dfae");
    k += flaech([[-w1 - 0.12, y1 - 0.42, w1 + 0.12], [w1 + 0.12, y1 - 0.42, w1 + 0.12], [w1 + 0.12, y1, w1 + 0.12], [-w1 - 0.12, y1, w1 + 0.12]], "#c2b9a8");
    /* eingetiefte Felder */
    const fh0 = y0 + 0.55, fh1 = y1 - 0.75, sl = (y) => w0 - (w0 - w1) * (y - y0) / TH;
    const n = Math.max(2, Math.round((w0 - SB - BAL) / 2.6));
    for (let j = 0; j < n; j++) {
      const ua = SB + BAL + 0.5 + j * (w0 - SB - BAL - 0.9) / n, ub = ua + (w0 - SB - BAL - 0.9) / n - 0.55;
      for (const sg of [-1, 1]) k += flaech([[sg * ua, fh0, sl(fh0)], [sg * ub, fh0, sl(fh0)], [sg * ub, fh1, sl(fh1)], [sg * ua, fh1, sl(fh1)]], "#7c7468", ` opacity=".5"`);
      for (const sg of [-1, 1]) k += flaech([[-sl(fh0), fh0, sg * ua], [-sl(fh0), fh0, sg * ub], [-sl(fh1), fh1, sg * ub], [-sl(fh1), fh1, sg * ua]], "#b4844e", ` opacity=".5"`);
    }
    /* weiche Laufspuren unter dem Gesims (Regen) */
    for (let j = 0; j < 4; j++) {
      const u = (rnd() * 2 - 1) * (w1 - 1), lang = 0.6 + rnd() * 1.4;
      /* Laufspuren: verschieden breit und lang, manche doppelt, manche nur ein Fleck, unten ausgefranst; nicht überall */
      const eine = (fn, c, du, b, l2) => { const L2 = [], R2 = []; for (let t = 0; t <= 1.001; t += 0.2) { const w2 = b * (1 - t * 0.25) + (rnd() - 0.5) * 0.1; L2.push(fn(du - w2, -t * l2)); R2.unshift(fn(du + w2, -t * l2 - (t > 0.9 ? rnd() * 0.25 : 0))); } const q = kappe([...L2, ...R2]); return q.length > 2 ? `<path d="M${pts(q)} Z" fill="url(#${S.id(c)})"/>` : ""; };
      const spur = (fn, c) => { if (rnd() < 0.4) return ""; const art = rnd(); if (art < 0.25) return eine(fn, c, 0, 0.12 + rnd() * 0.06, lang) + eine(fn, c, 0.38, 0.1 + rnd() * 0.05, lang * (0.5 + rnd() * 0.5)); if (art < 0.45) return eine(fn, c, 0, 0.3 + rnd() * 0.2, 0.35 + rnd() * 0.3); return eine(fn, c, 0, 0.15 + rnd() * 0.25, lang * (0.6 + rnd() * 0.8)); };
      if (Math.abs(u) > SB + BAL + 0.4) k += spur((a, t) => P(u + a, y1 - 0.45 + t, w1 + 0.02), "spurN");
      const v = (rnd() * 2 - 1) * (w1 - 1);
      if (Math.abs(v) > SB + BAL + 0.4) k += spur((a, t) => P(-w1 - 0.02, y1 - 0.45 + t, v + a), "spurW");
    }
    /* Lichtsaum an der Nordwestecke dieser Terrasse (gestuft, nicht durchgezogen) */
    const [a, b] = [P(-w0, y0, w0), P(-w1, y1 - 0.42, w1)];
    k += `<line x1="${r(a[0])}" y1="${r(a[1])}" x2="${r(b[0])}" y2="${r(b[1])}" stroke="#fff0c8" stroke-width=".45" opacity=".75"/>`;
  }
  /* oberste Plattform */
  k += flaech([[-WT, HT, -WT], [-WT, HT, WT], [WT, HT, WT], [WT, HT, -WT]], "#cbbd9e");

  /* --- Westtreppe (Seitenwand nach Norden, im Schatten) --- */
  k += flaech([[-WT, HT, SB + BAL], [-ZF, 0, SB + BAL], [-W0, 0, SB + BAL]], "#a69c8c");
  k += flaech([[-WT, HT, SB + BAL], [-ZF, 0, SB + BAL], [-ZF - 0.01, 0, -SB - BAL], [-WT - 0.01, HT, -SB - BAL]], S.lg("westtreppe", [[0, "#f6d79e"], [1, "#e6b97a"]]));
  for (let st = 1; st < 91; st += 2) { const t = st / 91, xx = -(ZF - (ZF - WT) * t), yy = HT * t; const [a, b] = [P(xx, yy, SB), P(xx, yy, -SB)]; k += `<line x1="${r(a[0])}" y1="${r(a[1])}" x2="${r(b[0])}" y2="${r(b[1])}" stroke="#b48a54" stroke-width=".25"/>`; }

  /* --- Nordtreppe: Westwange mit der „Schlange aus Licht“, Stufen, Wangen --- */
  const zS = (y) => ZF - y;
  const fussTerr = [];
  for (let i = 0; i < NT; i++) { fussTerr.push([-SB - BAL, i * TH, wT(i)]); fussTerr.push([-SB - BAL, (i + 1) * TH, wT(i) - 0.62]); }
  k += flaech([[-SB - BAL, HT + 0.5, WT], [-SB - BAL, 0.5, ZF], [-SB - BAL, 0, ZF], ...fussTerr], "#8d8a80");
  for (let i = 1; i < 8; i++) {
    const ya = (i - 0.15) * TH, yb = (i + 0.85) * TH;
    const za = zS(ya) + 0.5, zb = zS(yb) + 0.5, zt = wT(i) + 0.2;
    k += flaech([[-SB - BAL - 0.02, ya + 0.5, za], [-SB - BAL - 0.02, yb + 0.5, zb], [-SB - BAL - 0.02, ya + TH * 0.15, Math.max(zt, zS(ya) - 2.6)]], S.lg("lichtdreieck", [[0, "#ffe1a4"], [1, "#f2c27c"]]));
  }
  k += flaech([[-SB - BAL - 0.02, TH * 0.85 + 0.5, zS(TH * 0.85)], [-SB - BAL - 0.02, 0.5, ZF], [-SB - BAL - 0.02, 0, ZF], [-SB - BAL - 0.02, 0, W0 + 0.6]], "#f2cc90");
  k += flaech([[-SB, HT, WT], [SB, HT, WT], [SB, 0, ZF], [-SB, 0, ZF]], S.lg("nordtreppe", [[0, "#b3ad9f"], [1, "#9f998c"]]));
  const stufenLinien = [];
  for (let st = 1; st < 91; st++) { const t = st / 91, zz = ZF - (ZF - WT) * t, yy = HT * t; const [a, b] = [P(-SB, yy, zz), P(SB, yy, zz)]; stufenLinien.push(`M${r(a[0])} ${r(a[1])} L${r(b[0])} ${r(b[1])}`); }
  k += `<path d="${stufenLinien.join(" ")}" stroke="#7e7b71" stroke-width=".22" opacity=".9"/>`;
  for (const sg of [-1, 1]) k += flaech([[sg * SB, HT + 0.5, WT], [sg * (SB + BAL), HT + 0.5, WT], [sg * (SB + BAL), 0.5, ZF], [sg * SB, 0.5, ZF]], sg < 0 ? "#cdbfa2" : "#a8a497");

  /* --- die beiden Schlangenköpfe: massige, kantige Steinköpfe --- */
  const kopf = (sg) => {
    const xc = sg * (SB + BAL / 2), z0 = ZF - 0.3, lit = sg < 0, hw = 0.88;
    /* Profil [z vor dem Treppenfuß, y]: Unterkiefer, Maul, Oberkiefer, hochgerollte Nase, Brauenwulst, Federbusch */
    const prof = [[0, 0], [2.6, 0], [2.95, 0.12], [3.0, 0.48], [2.35, 0.56], [2.3, 0.98], [2.95, 1.08], [3.1, 1.4], [3.12, 1.78], [3.3, 2.1], [3.18, 2.42], [2.86, 2.38], [2.72, 2.02], [2.2, 2.1], [1.9, 2.32], [1.2, 2.26], [0.5, 2.5], [0, 2.3]];
    const LI = lit ? "#f2cc8e" : "#aca698", DU = lit ? "#cf9c5c" : "#8f8a7d", SE = lit ? "#e6b676" : "#9d978a", HE = lit ? "#fbe2b2" : "#bdb8ab";
    let g = "";
    g += flaech([[xc - hw, 0, z0], [xc + hw + 6.5, 0, z0 + 1.1], [xc + hw + 8.5, 0, z0 + 3.9], [xc - hw, 0, z0 + 3.1]], "#203016", ` opacity=".3"`);
    g += `<path d="M${pts(prof.map(([z, y]) => P(xc - hw, y, z0 + z)))} Z" fill="${SE}"/>`;
    /* Oberseite und Stirnflächen */
    g += flaech([[xc - hw, 2.3, z0], [xc + hw, 2.3, z0], [xc + hw, 2.5, z0 + 0.5], [xc - hw, 2.5, z0 + 0.5]], DU);
    /* Vorderansicht der Schnauze im Raum: gerundeter Oberkiefer mit Brauenwulst, weit offenes Maul,
       zwei große gebogene Fangzähne, Unterkiefer, gespaltene Zunge aus Stein bis auf den Boden */
    const V = (u, v, dz = 0) => P(xc + u, v, z0 + 3.02 + dz + (v > 1 ? (v - 1) * 0.1 : 0));
    const bogen = (u0, u1, v0, v1, n = 8) => { const o = []; for (let i = 0; i <= n; i++) { const a = Math.PI * i / n; o.push(V(u0 + (u1 - u0) * (1 - Math.cos(a)) / 2, v0 + (v1 - v0) * Math.sin(a))); } return o; };
    /* Oberkiefer: vorspringende Schnauze, oben die hochgerollte Nasenschnecke */
    /* die Schnauze springt oben ≈ 0,5 m über den Unterkiefer vor: Seitenfläche und Unterkante sichtbar */
    const OV = 0.5, Vo = (u, v) => V(u, v, OV);
    g += `<path d="M${pts([V(-hw, 1.4), V(-hw, 2.2), Vo(-hw, 2.2), Vo(-hw, 1.4)])} Z" fill="${SE}"/>`;
    g += `<path d="M${pts([Vo(-hw, 1.4), Vo(hw, 1.4), V(hw, 1.4), V(-hw, 1.4)])} Z" fill="#3a2e22"/>`;
    g += `<path d="M${pts([Vo(-hw, 1.4), ...bogen(-hw, hw, 1.95, 2.2).map((p2, i, a2) => P(xc + (-hw + 2 * hw * i / (a2.length - 1)), 0, 0) && p2).map(([x2, y2]) => [x2 + (Vo(0, 2)[0] - V(0, 2)[0]), y2 + (Vo(0, 2)[1] - V(0, 2)[1])]), Vo(hw, 1.4)])} Z" fill="${LI}"/>`;
    for (const t of [-1, 1]) { const c0 = V(t * 0.45, 2.02, 0.53); g += `<path d="M${r(c0[0] - t * 0.7)} ${r(c0[1] + 0.25)} q${r(t * 0.1)} -1 ${r(t * 0.8)} -.9 q${r(t * 0.6)} .2 ${r(t * 0.35)} .8 q${r(-t * 0.25)} .35 ${r(-t * 0.5)} .05" stroke="${DU}" stroke-width=".38" fill="none"/>`; }
    /* Unterkiefer */
    g += `<path d="M${pts([V(-hw, 0.36), V(-hw, 0.06), V(hw, 0.06), V(hw, 0.36)])} Z" fill="${LI}"/>`;
    /* Maul: weit offen, ≈ 60 % der Vorderseite */
    g += `<path d="M${pts([V(-hw + 0.06, 1.42), V(hw - 0.06, 1.42), V(hw - 0.1, 0.4), V(0, 0.34), V(-hw + 0.1, 0.4)])} Z" fill="#2a1d14"/>`;
    /* lange, gebogene Fangzähne oben, kleine Zähne unten */
    for (const t of [-1, 1]) {
      const [a1, a2] = [V(t * 0.7, 1.42), V(t * 0.42, 1.42)], sp = V(t * 0.5, 0.62), kr = V(t * 0.72, 0.92);
      g += `<path d="M${r(a1[0])} ${r(a1[1])} Q${r(kr[0])} ${r(kr[1])} ${r(sp[0])} ${r(sp[1])} L${r(a2[0])} ${r(a2[1])} Z" fill="#f1e4c6"/>`;
      for (const u of [0.2, 0.62]) g += flaech([[xc + t * u - 0.07, 0.4, z0 + 3.03], [xc + t * u + 0.07, 0.4, z0 + 3.03], [xc + t * u, 0.6, z0 + 3.03]], "#e9dcbd");
    }
    /* Zunge aus Stein: breites, flaches Band aus dem Maul über den Unterkiefer bis auf den Boden, vorn gespalten */
    /* Zunge: wölbt sich aus dem Maul über den Unterkiefer und wird zum Boden hin breiter, vorn tief gespalten */
    g += flaech([[xc - 0.22, 0.9, z0 + 3.06], [xc + 0.22, 0.9, z0 + 3.06], [xc + 0.3, 0.42, z0 + 3.2], [xc + 0.36, 0.04, z0 + 3.3], [xc - 0.36, 0.04, z0 + 3.3], [xc - 0.3, 0.42, z0 + 3.2]], LI, ` stroke="#3a2e22" stroke-width=".12"`);
    g += flaech([[xc - 0.36, 0.03, z0 + 3.3], [xc + 0.36, 0.03, z0 + 3.3], [xc + 0.46, 0.03, z0 + 4.3], [xc + 0.12, 0.03, z0 + 3.75], [xc - 0.12, 0.03, z0 + 3.75], [xc - 0.46, 0.03, z0 + 4.3]], SE, ` stroke="#3a2e22" stroke-width=".12"`);
    g += `<path d="M${pts([P(xc - 0.2, 0.86, z0 + 3.08), P(xc - 0.26, 0.42, z0 + 3.22)])}" stroke="${HE}" stroke-width=".18"/><path d="M${pts([P(xc, 0.6, z0 + 3.15), P(xc, 0.04, z0 + 3.31)])}" stroke="#7a6a52" stroke-width=".1"/>`;
    /* Nasenschnecke (hochgerollt) als Spirale auf der Seite */
    const [nx, ny] = P(xc - hw - 0.02, 2.12, z0 + 3.0);
    g += `<path d="M${r(nx - 0.9)} ${r(ny + 0.5)} q.2 -1.4 1.1 -1.3 q.9 .2 .6 1 q-.3 .6 -.8 .3" stroke="${DU}" stroke-width=".4" fill="none"/>`;
    /* Auge: eckige, tiefe Augenhöhle unter schwerem Brauenwulst */
    { const [ex, ey] = P(xc - hw - 0.02, 1.5, z0 + 1.9), [ex2] = P(xc - hw - 0.02, 1.5, z0 + 2.3); const er = Math.max(0.6, Math.abs(ex2 - ex)); g += `<ellipse cx="${r(ex)}" cy="${r(ey)}" rx="${r(er)}" ry="${r(er * 1.1)}" fill="none" stroke="${lit ? "#7a5530" : "#5f5b51"}" stroke-width=".4"/><circle cx="${r(ex)}" cy="${r(ey)}" r="${r(er * 0.4)}" fill="${lit ? "#7a5530" : "#5f5b51"}"/>`; }
    g += `<path d="M${pts([P(xc - hw - 0.03, 1.98, z0 + 1.4), P(xc - hw - 0.03, 2.0, z0 + 2.4), P(xc - hw - 0.03, 1.78, z0 + 2.45), P(xc - hw - 0.03, 1.76, z0 + 1.45)])} Z" fill="${HE}"/>`;
    /* Federbusch hinter dem Kopf: senkrechte Federn mit runden Enden */
    for (let i = 0; i < 5; i++) { const z = z0 + 0.1 + i * 0.3; const [a, b] = [P(xc - hw - 0.03, 2.25, z + 0.45), P(xc - hw - 0.03, 0.9, z)]; g += `<path d="M${r(a[0])} ${r(a[1])} L${r(b[0])} ${r(b[1])}" stroke="${DU}" stroke-width=".55" stroke-linecap="round"/>`; }
    /* Kerbe von Ober- und Unterlippe, Lichtkante oben */
    g += `<path d="M${pts([P(xc - hw - 0.02, 0.56, z0 + 2.35), P(xc - hw - 0.02, 0.98, z0 + 2.3)])}" stroke="#2a1d14" stroke-width=".35"/>`;
    g += `<path d="M${pts([P(xc - hw - 0.02, 2.48, z0 + 0.5), P(xc - hw - 0.02, 2.26, z0 + 1.2), P(xc - hw - 0.02, 2.32, z0 + 1.9)])}" stroke="${HE}" stroke-width=".35" fill="none"/>`;
    return g;
  };
  k += kopf(1) + kopf(-1);

  /* --- Lupe: Treppe, Stufe, Schlangenkopf, Terrasse --- */
  const [px0, py0] = P(0, 0, W0);
  const box = (punkte) => { const xs = punkte.map((p) => p[0]), ys = punkte.map((p) => p[1]); return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]; };
  {
    const [x0, y0, x1, y1] = box([P(-SB, 8, zS(8)), P(SB, 8, zS(8)), P(-SB, 17, zS(17)), P(SB, 17, zS(17))]);
    pyrUnter.push({ id: "treppe", de: "die Treppe", syl: "TREP-pe", it: "la scala", itSyl: "SCA-la", en: "staircase", x: (x0 + x1) / 2, y: y1, kunst: flaeche(-(x1 - x0) / 2, -(y1 - y0), x1 - x0, y1 - y0, 0.5),
      tipp: "Im März und September wirft die Sonne Dreiecke aus Licht auf die Seitenwand der Treppe – wie eine Schlange, die zum Kopf hinunterkriecht." });
  }
  {
    const [x0, y0, x1, y1] = box([P(-SB, 2.4, zS(2.4)), P(SB, 2.4, zS(2.4)), P(-SB, 3.4, zS(3.4)), P(SB, 3.4, zS(3.4))]);
    pyrUnter.push({ id: "stufe", de: "die Stufe", syl: "STU-fe", it: "il gradino", itSyl: "gra-DI-no", en: "step", x: (x0 + x1) / 2, y: y1, kunst: flaeche(-(x1 - x0) / 2, -(y1 - y0), x1 - x0, y1 - y0, 0.3),
      tipp: "Jede Treppe hat 91 Stufen. Mit der Plattform oben sind es zusammen 365 – so viele, wie das Jahr Tage hat." });
  }
  {
    const kb = (sg) => { const xc = sg * (SB + BAL / 2), z0 = ZF - 0.3; return box([P(xc - 0.88, 0, z0), P(xc + 0.88, 0, z0), P(xc - 0.88, 2.5, z0), P(xc + 0.88, 2.5, z0), P(xc - 0.88, 0, z0 + 3.4), P(xc + 0.88, 0, z0 + 3.4), P(xc - 0.88, 2.4, z0 + 3.3), P(xc + 0.88, 2.4, z0 + 3.3)]); };
    const [a0, a1, a2, a3] = kb(-1), [b0, b1, b2, b3] = kb(1);
    const mx = (a0 + a2) / 2, my = a3;
    pyrUnter.push({ id: "schlangenkopf", de: "der Schlangenkopf", syl: "SCHLAN-gen-kopf", it: "la testa di serpente", itSyl: "TE-sta di ser-PEN-te", en: "serpent head", x: mx, y: my,
      kunst: flaeche(a0 - mx, a1 - my, a2 - a0, a3 - a1, 0.4) + flaeche(b0 - mx, b1 - my, b2 - b0, b3 - b1, 0.4),
      tipp: "Die Köpfe gehören zu Kukulcán, der gefiederten Schlange. Das Maul ist weit offen, die Zunge hängt heraus." });
  }
  {
    const w = wT(2), [x0, y0, x1, y1] = box([P(9, 2 * TH + 0.2, w - 0.05), P(20, 2 * TH + 0.2, w - 0.05), P(9, 3 * TH - 0.2, w - 0.6), P(20, 3 * TH - 0.2, w - 0.6)]);
    pyrUnter.push({ id: "terrasse", de: "die Terrasse", syl: "Ter-RAS-se", it: "la terrazza", itSyl: "ter-RAZ-za", en: "terrace", x: (x0 + x1) / 2, y: y1, kunst: flaeche(-(x1 - x0) / 2, -(y1 - y0), x1 - x0, y1 - y0, 0.4),
      tipp: "Die Pyramide hat neun Terrassen, eine über der anderen – mit eingetieften Feldern im Stein." });
  }
  const [ax, ay] = P(14, 9, W0 - 4);
  S.teil({ id: "pyramide", de: "die Pyramide", syl: "Py-ra-MI-de", it: "la piramide", itSyl: "pi-RA-mi-de", en: "pyramid", x: ax, y: ay, kunst: um(ax, ay, k),
    zoom: { x: 48, y: 70, w: 105, h: 70 },
    unter: pyrUnter,
    tipp: "Die Pyramide des Kukulcán ist 30 Meter hoch. Klettern darf man nicht mehr – man bewundert sie von unten." });
}

/* =====================================================================
   4 — DER TEMPEL oben auf der Pyramide — Lupe: die Schlangensäule
   ===================================================================== */
{
  const TW = 6, TY0 = HT, TY1 = 30;
  let k = "";
  k += flaech([[-TW, TY0, TW], [TW, TY0, TW], [TW, TY1, TW], [-TW, TY1, TW]], SCHATTEN);
  k += flaech([[-TW, TY0, -TW], [-TW, TY0, TW], [-TW, TY1, TW], [-TW, TY1, -TW]], LICHT);
  k += flaech([[-TW - 0.3, 28.2, TW + 0.3], [TW + 0.3, 28.2, TW + 0.3], [TW + 0.3, 28.9, TW + 0.3], [-TW - 0.3, 28.9, TW + 0.3]], "#b8b2a4");
  k += flaech([[-TW - 0.3, 28.2, -TW - 0.3], [-TW - 0.3, 28.2, TW + 0.3], [-TW - 0.3, 28.9, TW + 0.3], [-TW - 0.3, 28.9, -TW - 0.3]], "#f6dcab");
  for (let x = -TW + 0.4; x < TW - 0.8; x += 1.5) k += flaech([[x, 29.1, TW + 0.02], [x + 1.1, 29.1, TW + 0.02], [x + 1.1, 29.75, TW + 0.02], [x, 29.75, TW + 0.02]], "#857f72", ` opacity=".6"`);
  for (let z = -TW + 0.4; z < TW - 0.8; z += 1.5) k += flaech([[-TW - 0.02, 29.1, z], [-TW - 0.02, 29.1, z + 1.1], [-TW - 0.02, 29.75, z + 1.1], [-TW - 0.02, 29.75, z]], "#c49c62", ` opacity=".6"`);
  k += flaech([[-TW - 0.2, 29.9, TW + 0.2], [TW + 0.2, 29.9, TW + 0.2], [TW + 0.2, 30.15, TW + 0.2], [-TW - 0.2, 30.15, TW + 0.2]], "#c4bcab");
  k += flaech([[-TW - 0.2, 29.9, -TW - 0.2], [-TW - 0.2, 29.9, TW + 0.2], [-TW - 0.2, 30.15, TW + 0.2], [-TW - 0.2, 30.15, -TW - 0.2]], "#f8dfae");
  /* Nordeingang: drei Öffnungen unter dem Türsturz */
  const tuer = (x0, x1, z) => flaech([[x0, TY0 + 0.1, z], [x1, TY0 + 0.1, z], [x1, 27.4, z], [x0, 27.4, z]], "#2b2219");
  k += tuer(-3.4, -1.55, TW + 0.02) + tuer(-0.9, 0.9, TW + 0.02) + tuer(1.55, 3.4, TW + 0.02);
  k += flaech([[-3.6, 27.4, TW + 0.04], [3.6, 27.4, TW + 0.04], [3.6, 27.9, TW + 0.04], [-3.6, 27.9, TW + 0.04]], "#a39d8f");
  /* die zwei Schlangensäulen: Kopf mit offenem Maul am Boden, gefiederter Schaft, Rassel oben nach vorn gebogen */
  for (const x of [-1.22, 1.22]) {
    const zf = TW + 0.1;
    /* Schaft: Schlangenleib mit Federschuppen (Winkel) */
    k += flaech([[x - 0.34, TY0 + 0.8, zf], [x + 0.34, TY0 + 0.8, zf], [x + 0.34, 27.1, zf], [x - 0.34, 27.1, zf]], "#cfc7b3");
    k += flaech([[x + 0.12, TY0 + 0.8, zf + 0.01], [x + 0.34, TY0 + 0.8, zf + 0.01], [x + 0.34, 27.1, zf + 0.01], [x + 0.12, 27.1, zf + 0.01]], "#a39b88", ` opacity=".55"`);
    let fe = "";
    for (let y = TY0 + 1.1; y < 26.9; y += 0.36) { const [a, m, c] = [P(x - 0.3, y + 0.16, zf + 0.02), P(x, y, zf + 0.02), P(x + 0.3, y + 0.16, zf + 0.02)]; fe += `M${r(a[0])} ${r(a[1])} L${r(m[0])} ${r(m[1])} L${r(c[0])} ${r(c[1])}`; }
    k += `<path d="${fe}" stroke="#8a8372" stroke-width=".07" fill="none"/>`;
    /* Kopf am Boden: massiger Block, ragt nach vorn, Maul weit offen mit Fangzähnen, Auge, Nasenschnecke, Federbusch */
    const zk = TW + 1.5, hk = 1.05, bk = 0.55;
    k += flaech([[x - bk, TY0, zf], [x - bk, TY0, zk], [x - bk, TY0 + hk, zk - 0.1], [x - bk, TY0 + hk, zf]], "#e3c48e");
    k += flaech([[x - bk, TY0 + hk, zf], [x + bk, TY0 + hk, zf], [x + bk, TY0 + hk, zk - 0.1], [x - bk, TY0 + hk, zk - 0.1]], "#d3ccb8");
    k += flaech([[x - bk, TY0, zk], [x + bk, TY0, zk], [x + bk, TY0 + hk, zk - 0.1], [x - bk, TY0 + hk, zk - 0.1]], "#bdb5a1");
    k += flaech([[x - bk + 0.1, TY0 + 0.15, zk + 0.01], [x + bk - 0.1, TY0 + 0.15, zk + 0.01], [x + bk - 0.1, TY0 + 0.55, zk + 0.01], [x - bk + 0.1, TY0 + 0.55, zk + 0.01]], "#2b2219");
    for (const dx of [-0.3, 0.3]) { const [u, v] = P(x + dx, TY0 + 0.55, zk + 0.02), [u2, v2] = P(x + dx, TY0 + 0.15, zk + 0.02); k += `<path d="M${r(u - 0.12)} ${r(v)} L${r(u + 0.12)} ${r(v)} L${r(u)} ${r(v + 0.32)} Z M${r(u2 - 0.1)} ${r(v2)} L${r(u2 + 0.1)} ${r(v2)} L${r(u2)} ${r(v2 - 0.25)} Z" fill="#f2ead6"/>`; }
    { const [u, v] = P(x, TY0 + 0.45, zk + 0.02); k += `<path d="M${r(u - 0.1)} ${r(v - 0.1)} q.05 .35 -.12 .5 q.1 .05 .3 -.1" stroke="#9c3b2e" stroke-width=".12" fill="none"/>`; }
    for (const dx of [-0.32, 0.32]) { const [u, v] = P(x + dx, TY0 + 0.82, zk - 0.05); k += `<circle cx="${r(u)}" cy="${r(v)}" r=".13" fill="#2b2219"/><path d="M${r(u - 0.2)} ${r(v - 0.18)} q.2 -.12 .4 0" stroke="#7d7464" stroke-width=".06" fill="none"/>`; }
    { const [u, v] = P(x, TY0 + hk, zk - 0.05); k += `<path d="M${r(u - 0.18)} ${r(v + 0.05)} q-.05 -.3 .18 -.32 q.2 .02 .14 .2 q-.08 .1 -.16 0" stroke="#7d7464" stroke-width=".07" fill="none"/>`; }
    { const [u, v] = P(x, TY0 + hk, zf + 0.3); k += `<path d="M${r(u - 0.45)} ${r(v)} q.1 -.35 .25 -.05 q.1 -.4 .2 0 q.1 -.4 .2 0 q.15 -.3 .25 .05" fill="#ece3cc" stroke="#9c9584" stroke-width=".04"/>`; }
    /* Rassel: Schwanz biegt oben nach vorn und trägt den Sturz, mit Ringen */
    k += flaech([[x - 0.38, 27.0, zf], [x + 0.38, 27.0, zf], [x + 0.38, 27.4, zf + 0.9], [x - 0.38, 27.4, zf + 0.9]], "#ddd5c1");
    k += flaech([[x - 0.38, 27.4, zf + 0.9], [x + 0.38, 27.4, zf + 0.9], [x + 0.38, 27.4, zf + 0.9], [x + 0.38, 27.0, zf + 0.9], [x - 0.38, 27.0, zf + 0.9]], "#bdb5a1");
    for (const t of [0.2, 0.4, 0.6, 0.8]) { const [a, b] = [P(x - 0.38, 27.0 + t * 0.4, zf + t * 0.9), P(x + 0.38, 27.0 + t * 0.4, zf + t * 0.9)]; k += `<line x1="${r(a[0])}" y1="${r(a[1])}" x2="${r(b[0])}" y2="${r(b[1])}" stroke="#8a8372" stroke-width=".08"/>`; }
  }
  /* Fries über dem Eingang: eingetieftes Feld mit der Andeutung einer Maske (Augen, Rüsselnase) */
  k += flaech([[-2.6, 28.25, TW + 0.03], [2.6, 28.25, TW + 0.03], [2.6, 29.0, TW + 0.03], [-2.6, 29.0, TW + 0.03]], "#8a8476");
  k += flaech([[-0.9, 28.4, TW + 0.05], [-0.45, 28.4, TW + 0.05], [-0.45, 28.75, TW + 0.05], [-0.9, 28.75, TW + 0.05]], "#5f5a50") + flaech([[0.45, 28.4, TW + 0.05], [0.9, 28.4, TW + 0.05], [0.9, 28.75, TW + 0.05], [0.45, 28.75, TW + 0.05]], "#5f5a50");
  k += flaech([[-0.2, 28.3, TW + 0.05], [0.2, 28.3, TW + 0.05], [0.25, 28.85, TW + 0.05], [-0.25, 28.85, TW + 0.05]], "#b8b2a4");
  /* Westeingang (eine Tür) */
  k += flaech([[-TW - 0.02, TY0 + 0.1, 1.2], [-TW - 0.02, TY0 + 0.1, -1.2], [-TW - 0.02, 27.4, -1.2], [-TW - 0.02, 27.4, 1.2]], "#3a2c1f");
  const [x0, y0] = P(0, 26, TW), [x1, y1] = P(-1.22, TY0, TW + 1.5), [x2] = P(1.22, TY0, TW + 1.5), sh = y1 - P(-1.22, 27.4, TW + 0.1)[1];
  const [ra, rb2] = [P(-TW - 0.3, TY0, TW + 1.4), P(TW + 0.3, 30.2, TW + 1.4)];
  const unter = [{ id: "schlangensaeule", de: "die Schlangensäule", syl: "SCHLAN-gen-säu-le", it: "la colonna serpentina", itSyl: "co-LON-na ser-pen-TI-na", en: "serpent column", x: x1, y: y1, kunst: [-1.22, 1.22].map((xs) => { const h = P(xs, TY0, TW + 1.5)[0], o = P(xs, 27.4, TW + 0.1)[0], a = Math.min(h, o) - 0.75, b = Math.max(h, o) + 0.75; return flaeche(a - x1, -sh, b - a, sh + 0.3, 0.2); }).join(""),
    tipp: "Zwei Säulen in Form von Schlangen tragen den Eingang: unten der Kopf, oben die Schwanzrassel." }];
  const zx = (ra[0] + rb2[0]) / 2, zyM = (y0 + y1) / 2 - 1;
  S.teil({ oben: true, id: "tempel", de: "der Tempel", syl: "TEM-pel", it: "il tempio", itSyl: "TEM-pio", en: "temple", x: x0, y: y0, kunst: um(x0, y0, k),
    zoom: { x: r(zx - 19.5), y: r(zyM - 15), w: 30, h: 20 },
    unter,
    tipp: "Oben auf der Pyramide steht ein Tempel für Kukulcán. Sein Eingang zeigt nach Norden." });
}

/* =====================================================================
   5 — DER KAPOKBAUM (Ceiba) links vom Stand: hoher glatter Stamm mit
       Brettwurzeln, Äste in Stockwerken, flache lockere Laubschirme
   ===================================================================== */
{
  const X = 237, Y = 141, s = sy(Y);            /* ≈ 5,6 Einheiten je Meter */
  let k = "";
  /* Brettwurzeln */
  k += `<path d="M-13 0 Q-7 -1 -4.4 -7 L-3 -12 L3 -12 L4.6 -7 Q8 -1 15 0 Q8 .6 5 -.6 Q2 1 0 -.4 Q-2 1 -5 -.6 Q-8 .6 -13 0 Z" fill="${S.lg("wurzel", [[0, "#5b6650"], [0.5, "#7f8a72"], [1, "#b9b498"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-9 -.4 Q-5 -2 -3.6 -8 M9.6 -.3 Q5.6 -2 3.8 -8" stroke="#4d5743" stroke-width=".5" fill="none" opacity=".6"/>`;
  /* Stamm: glatt, graugrün, Licht von rechts; geht oben in die Hauptäste über */
  const TOP = -14 * s;
  k += `<path d="M-3 -11 Q-2.6 -40 -2.2 ${r(TOP + 6)} Q-2.1 ${r(TOP)} -1.1 ${r(TOP - 3)} L1.1 ${r(TOP - 3.4)} Q2.2 ${r(TOP)} 2.4 ${r(TOP + 6)} Q2.8 -40 3.2 -11 Z" fill="${S.lg("ceiba", [[0, "#55604a"], [0.45, "#7c866c"], [0.8, "#b8b294"], [1, "#9a9a82"]], 0, 0, 1, 0)}"/>`;
  for (let i = 0; i < 7; i++) { const y = -16 - rnd() * (-TOP - 22); k += `<path d="M${r(-1.6 + rnd() * 3.2)} ${r(y)} q.3 -3 0 -5" stroke="#5a6450" stroke-width=".4" fill="none" opacity=".55"/>`; }
  /* Stamm: rechts goldene Lichtkante (Abendsonne), links kühler Schatten */
  k += `<path d="M2.9 -12 Q2.5 -40 2.3 ${r(TOP + 6)}" stroke="#f0d38c" stroke-width=".8" fill="none" opacity=".8"/><path d="M-2.7 -12 Q-2.4 -40 -2.1 ${r(TOP + 6)}" stroke="#3f4a3c" stroke-width="1.1" fill="none" opacity=".5"/>`;
  /* Äste: 4 dicke Hauptäste in verschiedenen Höhen, fast waagerecht, nach außen zwei- bis dreimal gegabelt,
     dünner werdend, die Enden biegen leicht nach oben */
  const ASTF = S.lg("ast", [[0, "#5d6852"], [0.6, "#8e917a"], [1, "#c9b98a"]]);
  const T = TOP, enden = [];
  let aeste = "";
  const ast = (x0, y0, wnk, len, d, tiefe) => {
    const x1 = x0 + Math.cos(wnk) * len, y1 = y0 + Math.sin(wnk) * len, nx = -Math.sin(wnk), ny = Math.cos(wnk), d1 = d * 0.62;
    const mx = (x0 + x1) / 2, my = (y0 + y1) / 2 + len * 0.06;
    aeste += `M${r(x0 + nx * d)} ${r(y0 + ny * d)} Q${r(mx + nx * (d + d1) / 2)} ${r(my + ny * (d + d1) / 2)} ${r(x1 + nx * d1)} ${r(y1 + ny * d1)} L${r(x1 - nx * d1)} ${r(y1 - ny * d1)} Q${r(mx - nx * (d + d1) / 2)} ${r(my - ny * (d + d1) / 2)} ${r(x0 - nx * d)} ${r(y0 - ny * d)} Z`;
    if (tiefe === 0) { enden.push([x1, y1]); return; }
    const auf = Math.cos(wnk) > 0 ? -1 : 1;
    ast(x1, y1, wnk + auf * (0.18 + rnd() * 0.12), len * 0.62, d1, tiefe - 1);
    ast(x1, y1, wnk - auf * (0.32 + rnd() * 0.2), len * 0.55, d1 * 0.9, tiefe - 1);
  };
  ast(-1.2, T + 9, Math.PI + 0.12, 15, 1.3, 2);
  ast(1.2, T + 5, -0.1, 16, 1.25, 2);
  ast(-1, T + 1, Math.PI + 0.32, 12, 1.05, 2);
  ast(1, T - 2, -0.36, 11, 1, 2);
  ast(0, T - 3, -Math.PI / 2 - 0.08, 9, 0.9, 1);
  /* die Äste wachsen hinter der Stammkante hervor (Stamm darüber), an jedem Ast eine weiche Verdickung */
  {
    const st = k.indexOf('<path d="M-3 -11 Q-2.6 -40');
    k = k.slice(0, st) + `<path d="${aeste}" fill="${ASTF}"/>` + k.slice(st);
    const hw = (y) => y > T + 6 ? 2.25 : 1.1 + Math.max(0, (y - (T - 3))) / 9 * 1.15;
    for (const [y0, sg, d] of [[T + 9, -1, 1.3], [T + 5, 1, 1.25], [T + 1, -1, 1.05], [T - 2, 1, 1]]) {
      const xa = sg * (hw(y0 - d - 1.5) - 0.35), xb = sg * (hw(y0 + d + 1.8) - 0.35), xe = sg * (hw(y0) + 2.6);
      k += `<path d="M${r(xa)} ${r(y0 - d - 1.5)} Q${r(xa + sg * 1.2)} ${r(y0 - d * 0.95)} ${r(xe)} ${r(y0 - d * 0.82)} L${r(xe)} ${r(y0 + d * 0.82)} Q${r(xb + sg * 1.2)} ${r(y0 + d * 0.95)} ${r(xb)} ${r(y0 + d + 1.8)} Z" fill="#8e917a"/>`;
      k += `<path d="M${r(xe)} ${r(y0 + d * 0.82)} Q${r(xb + sg * 1.2)} ${r(y0 + d * 0.95)} ${r(xb)} ${r(y0 + d + 1.8)}" stroke="#5d6852" stroke-width=".4" fill="none"/>`;
    }
  }
  const lagen = [[], [], [], []];
  /* zwei flache Laubstockwerke auf den Hauptästen (Unterseite kühl, Oberkante golden) */
  for (const [x0, x1, y] of [[-30, 30, T - 8], [-20, 22, T - 15]]) {
    for (let x = x0; x < x1; x += 2.2 + rnd() * 1.6) {
      if (rnd() < 0.22) continue;
      const yy = y + (rnd() - 0.5) * 1.6, rr = 1 + rnd() * 1.1;
      lagen[0].push(`<ellipse cx="${r(x)}" cy="${r(yy + rr * 0.25)}" rx="${r(rr * 1.45)}" ry="${r(rr * 0.5)}"/>`);
      lagen[rnd() < 0.5 ? 1 : 2].push(`<ellipse cx="${r(x)}" cy="${r(yy)}" rx="${r(rr * 1.5)}" ry="${r(rr * 0.55)}"/>`);
      if (x > 0 && rnd() < 0.6) lagen[3].push(`<ellipse cx="${r(x + rr * 0.4)}" cy="${r(yy - rr * 0.3)}" rx="${r(rr * 0.9)}" ry="${r(rr * 0.3)}"/>`);
    }
  }
  for (const [ex, ey] of enden) {
    for (let i = 0; i < 9; i++) {
      const x = ex + (rnd() - 0.5) * 9, y = ey - 1.2 + (rnd() - 0.5) * 2.2, rr = 0.9 + rnd() * 1.1;
      lagen[y > ey ? 0 : x > ex + 1.5 ? 3 : rnd() < 0.5 ? 1 : 2].push(`<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(rr * 1.5)}" ry="${r(rr * 0.75)}"/>`);
    }
  }
  ["#5a6b55", "#6c8a42", "#7f9c4c", "#bdb563"].forEach((c, i) => { k += `<g fill="${c}">${lagen[i].join("")}</g>`; });
  const ax0 = 0, ay0 = -60;   /* Bezugspunkt: Stamm über dem Dach */
  S.teil({ id: "kapokbaum", de: "der Kapokbaum", syl: "KA-pok-baum", it: "la ceiba", itSyl: "CEI-ba", en: "kapok tree", x: X + ax0, y: Y + ay0, kunst: `<g transform="translate(${-ax0} ${-ay0})">${k}</g>`,
    tipp: "Für die Maya war der Kapokbaum (Ceiba) heilig: Er verbindet Himmel, Erde und Unterwelt." });
}

/* =====================================================================
   6 — DIE TOURISTEN (Besucher zur Tagundnachtgleiche, mit Führerin und
       Schirm) — im Raum maßstäblich, lange Schatten nach links
   ===================================================================== */
/* Figuren der Bibliothek, für kleine Größen vereinfacht: Zahlen auf q Einheiten gerundet, winzige
   Teile weggelassen, Verläufe durch ihre Mittelfarbe ersetzt (klein und schnell) */
const GQ = 4, GM = 7;
/* Pfad zu Vieleck: Kurven durch End- und Mittelpunkte ersetzen, auf q runden, doppelte und
   gerade durchlaufende Punkte streichen */
const vereinfache = (d, q) => {
  const tok = d.match(/[A-Za-z]|-?\d*\.?\d+(?:e-?\d+)?/g) || [];
  if (tok.some((t) => /^[a-zHVATt]$/.test(t))) return null;
  /* FASSUNG R5: Punkte erst in voller Genauigkeit sammeln, dann Douglas–Peucker mit Toleranz q/2,
     zuletzt auf ganze Figur-Einheiten runden: Diagonalen bleiben Diagonalen (keine Treppenkanten) */
  const teile = []; let pkt = [], cmd = "", i = 0, cx = 0, cy = 0;
  const neu = (x, y) => { cx = x; cy = y; pkt.push([x, y]); };
  while (i < tok.length) {
    if (/[A-Z]/.test(tok[i])) { cmd = tok[i++]; if (cmd === "Z") { if (pkt.length) teile.push(pkt); pkt = []; continue; } if (cmd === "M") { if (pkt.length) teile.push(pkt); pkt = []; } }
    const n = (k) => +tok[i + k];
    if (cmd === "M" || cmd === "L") { neu(n(0), n(1)); i += 2; if (cmd === "M") cmd = "L"; }
    else if (cmd === "C") { neu((cx + 3 * n(0) + 3 * n(2) + n(4)) / 8, (cy + 3 * n(1) + 3 * n(3) + n(5)) / 8); neu(n(4), n(5)); i += 6; }
    else if (cmd === "S") { neu((cx + 3 * n(0) + 4 * n(2)) / 8, (cy + 3 * n(1) + 4 * n(3)) / 8); neu(n(2), n(3)); i += 4; }
    else if (cmd === "Q") { neu((cx + 2 * n(0) + n(2)) / 4, (cy + 2 * n(1) + n(3)) / 4); neu(n(2), n(3)); i += 4; }
    else return null;
  }
  if (pkt.length) teile.push(pkt);
  const eps = q * 0.45;
  const dp = (p) => { if (p.length < 3) return p; const [a, b] = [p[0], p[p.length - 1]], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1e-9; let mi = 0, md = 0; for (let j = 1; j < p.length - 1; j++) { const dd = Math.abs((p[j][0] - a[0]) * dy - (p[j][1] - a[1]) * dx) / l; if (dd > md) { md = dd; mi = j; } } return md > eps ? dp(p.slice(0, mi + 1)).slice(0, -1).concat(dp(p.slice(mi))) : [a, b]; };
  const dpz = (p) => { if (p.length < 4) return p; let mi = 0, md = -1; for (let j = 1; j < p.length; j++) { const dd = Math.hypot(p[j][0] - p[0][0], p[j][1] - p[0][1]); if (dd > md) { md = dd; mi = j; } } return dp(p.slice(0, mi + 1)).slice(0, -1).concat(dp(p.slice(mi).concat([p[0]]))).slice(0, -1); };
  return teile.map((p) => { const o = dpz(p).map(([x, y]) => [Math.round(x), Math.round(y)]).filter((a, j, arr) => !j || a[0] !== arr[j - 1][0] || a[1] !== arr[j - 1][1]); return o.length > 1 ? "M" + o.map((a) => a.join(" ")).join("L") + "Z" : ""; }).join("");
};
const grob = (svg, q, min, verlaeufe = false) => {
  const rund = (v) => v.replace(/-?\d*\.?\d+(e-?\d+)?/g, (n) => String(Math.round(+n / q) * q));
  svg = svg.replace(/<(path|ellipse|circle|line|rect)\b[^>]*\/>/g, (el) => {
    const d = el.match(/ d="([^"]*)"/);
    if (d && !/[a-z]/.test(d[1].replace(/e-?\d/g, ""))) { const v = (d[1].match(/-?\d*\.?\d+/g) || []).map(Number), xs = v.filter((_, i) => i % 2 === 0), ys = v.filter((_, i) => i % 2);
      if (xs.length && Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) < min) return ""; }
    const rr = el.match(/ (?:r|rx)="([^"]*)"/); if (rr && !d && +rr[1] * 2 < min * 0.6) return "";
    if (d) { const v = vereinfache(d[1], q); if (v !== null) { if (!v) return ""; const offen = /fill="none"/.test(el); return el.replace(/ d="[^"]*"/, ` d="${offen ? v.replace(/Z/g, "") : v}"`); } }
    return el.replace(/ (d|x1|y1|x2|y2|cx|cy|rx|ry|r|x|y|width|height)="([^"]*)"/g, (m, a2, v) => ` ${a2}="${rund(v)}"`);
  });
  if (verlaeufe) return svg;
  const farbe = {};
  svg = svg.replace(/<(linearGradient|radialGradient)\b[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/\1>/g, (m, t, id, inner) => { const st = [...inner.matchAll(/stop-color="([^"]+)"/g)].map((x) => x[1]); farbe[id] = st[Math.floor(st.length / 2)] || "#888"; return ""; });
  return svg.replace(/url\(#([^)]+)\)/g, (m, id) => farbe[id] || m).replace(/<defs><\/defs>/g, "");
};
/* Abendlicht auf Figuren: Sonne rechts (Westen, tief) — Körper kühler und dunkler, rechts ein goldener Saum */
S.def(`<filter id="${S.id("abend")}" x="-20%" y="-10%" width="140%" height="120%" color-interpolation-filters="sRGB"><feComponentTransfer in="SourceGraphic" result="d"><feFuncR type="linear" slope=".8"/><feFuncG type="linear" slope=".79"/><feFuncB type="linear" slope=".86"/></feComponentTransfer><feOffset in="SourceAlpha" dx="-.2" dy=".1" result="v"/><feComposite in="SourceAlpha" in2="v" operator="out" result="kante"/><feFlood flood-color="#ffcb70" flood-opacity=".7"/><feComposite in2="kante" operator="in" result="l"/><feMerge><feMergeNode in="d"/><feMergeNode in="l"/></feMerge></filter>`);
const ABEND = `url(#${S.id("abend")})`;
const langSchatten = (x, y, h, b) => {
  const [X, Z] = BODEN(x, y), d = b / 2;
  const q = kappe([[X, Z - d], [X, Z + d], [X + h * SD[0], Z + d * 0.6 + h * SD[1]], [X + h * SD[0], Z - d * 0.6 + h * SD[1]]].map(([u, v]) => P(u, 0, v)), 0, 0, 320, 200);
  return q.length > 2 ? `<path d="M${pts(q)} Z" fill="url(#${S.id("menschschatten")})"/>` : "";
};
S.def(`<linearGradient id="${S.id("menschschatten")}" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#1f2c14" stop-opacity=".46"/><stop offset=".6" stop-color="#1f2c14" stop-opacity=".26"/><stop offset="1" stop-color="#1f2c14" stop-opacity="0"/></linearGradient>`);
{
  let k = "", sch = "";
  /* Augen und Brauen klein und getrennt (die Vereinfachung lässt die winzigen Augenformen weg) */
  const augen = (m, brille) => {
    const P2 = m.z.punkte, k2 = m.k, [ax2, ay2] = P2.auge, [nx2] = P2.nase, d = (nx2 - ax2) * 1.7, e2 = [ax2 + d, ay2];
    const sc = (v) => r(v * k2 * 100) / 100;
    if (brille) return `<g fill="#1b1b1f"><ellipse cx="${sc(ax2)}" cy="${sc(ay2)}" rx="${sc(1.3)}" ry="${sc(1)}"/><ellipse cx="${sc(e2[0])}" cy="${sc(ay2)}" rx="${sc(1.2)}" ry="${sc(1)}"/></g><path d="M${sc(ax2 + 1.2)} ${sc(ay2)}H${sc(e2[0] - 1.1)}" stroke="#1b1b1f" stroke-width="${sc(0.4)}"/><circle cx="${sc(ax2 + 0.5)}" cy="${sc(ay2 - 0.4)}" r="${sc(0.3)}" fill="#fff"/>`;
    return `<g fill="#241812"><circle cx="${sc(ax2)}" cy="${sc(ay2)}" r="${sc(0.55)}"/><circle cx="${sc(e2[0])}" cy="${sc(ay2)}" r="${sc(0.5)}"/></g><path d="M${sc(ax2 - 1)} ${sc(ay2 - 1.6)}h${sc(1.9)}M${sc(e2[0] - 0.9)} ${sc(ay2 - 1.6)}h${sc(1.8)}" stroke="#3a2a1e" stroke-width="${sc(0.35)}"/>`;
  };
  const figur = (x, y, spec, m0) => {
    const s = sy(y), h = (spec.alter === "kind" ? 1.3 : spec.alter === "alt" ? 1.66 : spec.geschlecht === "w" ? 1.65 : 1.76) * s;
    const sp2 = Object.assign({}, spec); delete sp2.sonnenbrille; const m = m0 || B.mensch(Object.assign({ haut: "mittel", laecheln: true, ohneSchatten: true }, sp2), h);
    sch += langSchatten(x, y, h / s, 1.1);
    return { m, svg: `<g transform="translate(${r(x)} ${r(y)})" filter="${ABEND}">${grob(m.svg, GQ, GM)}${augen(m, spec.sonnenbrille)}</g>`, x, y };
  };
  const kl = (o, u, hut, schuh = "turnschuh") => Object.assign({ oberteil: { stueck: "tshirt", farbe: o }, unterteil: { stueck: u[0], farbe: u[1] }, schuhe: { stueck: schuh, farbe: "braun" } }, hut ? { kopf: { stueck: "hut", farbe: hut } } : {});
  /* Gruppe 1: Familie am Weg, das Kind sitzt dem Vater auf den Schultern */
  const vater = figur(80, 146.4, { id: "mx_vater", geschlecht: "m", alter: "erwachsen", pose: "stehen", blick: 20, frisur: "kurz", haarfarbe: "braun", kleidung: kl("#f4f1e8", ["shorts", "beige"], "#e9e2c8") });
  const kind = B.mensch({ id: "mx_kind", geschlecht: "w", alter: "kind", haut: "mittel", laecheln: true, ohneSchatten: true, frisur: "zopf", haarfarbe: "braun", blick: 20,
    pose: { lende: 4, brust: 2, nacken: 4, kopf: -4, schulterL: { vor: 40, seit: 24 }, ellbogenL: 90, unterarmL: 0, handL: 0, fingerL: 0.5, schulterR: { vor: 40, seit: 24 }, ellbogenR: 90, unterarmR: 0, handR: 0, fingerR: 0.5, huefteL: { vor: 70, seit: 34, dreh: 0 }, knieL: 80, fussL: 10, huefteR: { vor: 70, seit: 34, dreh: 0 }, knieR: 80, fussR: 10 },
    kleidung: { oberteil: { stueck: "tshirt", farbe: "#e8590c" }, unterteil: { stueck: "shorts", farbe: "#2f5f95" } } }, 1.3 * sy(146.4));
  {
    const vm = vater.m, [nx, ny] = vm.z.punkte.nacken, [gx, gy] = kind.z.punkte.gesaess;
    const dx = 80 + nx * vm.k - gx * kind.k, dy = 146.4 + ny * vm.k - gy * kind.k - 0.6;
    /* Kopf des Vaters noch einmal über dem Kind (er sitzt davor) */
    const kopfY = (ny * vm.k) / vm.k + 2;
    const kopf = vm.svg.replace(/<(path|ellipse|circle)\b[^>]*\/>/g, (el) => { const v = (el.match(/ (?:d|cy)="([^"]*)"/) || [, ""])[1].match(/-?\d*\.?\d+/g) || []; const ys = el.includes(' d="') ? v.filter((_, i) => i % 2).map(Number) : v.map(Number); return ys.length && Math.max(...ys) < kopfY ? el : ""; });
    k += vater.svg + `<g transform="translate(${r(dx)} ${r(dy)})" filter="${ABEND}">${grob(kind.svg, GQ, GM)}</g>` + `<g transform="translate(80 146.4)" filter="${ABEND}">${grob(kopf, GQ, GM)}${augen(vm)}</g>`;
  }
  k += figur(87.5, 147, { id: "mx_mutter", geschlecht: "w", alter: "erwachsen", pose: "kontrapost", blick: -14, frisur: "zopf", haarfarbe: "dunkelbraun", kleidung: kl("#7fb3d5", ["hose", "#e9e2d0"], "#f1e9d2") }).svg;
  /* Gruppe 2: Führerin mit erhobenem Schirm (damit die Gruppe sie findet) und zwei Besucher */
  const fuehrerin = figur(118, 149, { id: "mx_guide", geschlecht: "w", alter: "erwachsen", pose: "winken", blick: 10, frisur: "dutt", haarfarbe: "schwarz", haut: "dunkel", kleidung: kl("#f4f1e8", ["hose", "#3f4a5a"], "#2f6a3e") });
  k += fuehrerin.svg;
  { const fm = fuehrerin.m, hx = 118 + fm.z.handR.x * fm.k, hy = 149 + fm.z.handR.y * fm.k, s = sy(149); k += `<line x1="${r(hx)}" y1="${r(hy + 0.3)}" x2="${r(hx)}" y2="${r(hy - 0.7 * s)}" stroke="#444" stroke-width=".22"/><path d="M${r(hx - 0.5 * s)} ${r(hy - 0.55 * s)} Q${r(hx)} ${r(hy - 0.9 * s)} ${r(hx + 0.5 * s)} ${r(hy - 0.55 * s)} Z" fill="#e8590c"/>`; }
  k += figur(126.5, 148.4, { id: "mx_t1", geschlecht: "m", alter: "alt", pose: "stehen", blick: 30, frisur: "kurz", haarfarbe: "grau", haut: "hell", kleidung: kl("#f4f1e8", ["hose", "#e9e2d0"], "#f1e9d2") }).svg;
  k += figur(133, 148.8, { id: "mx_t2", sonnenbrille: true, geschlecht: "w", alter: "erwachsen", pose: "stehen", blick: 40, frisur: "lang", haarfarbe: "schwarz", kleidung: kl("#c2255c", ["hose", "#2a3a5a"], null, "sandale") }).svg;
  /* Gruppe 3 vor der Westseite */
  k += figur(188, 144.6, { id: "mx_t3", sonnenbrille: true, geschlecht: "m", alter: "jugendlich", pose: "gehen", blick: -30, frisur: "kurz", haarfarbe: "schwarz", kleidung: Object.assign(kl("#f4f1e8", ["shorts", "#3f4a5a"]), { kopf: { stueck: "kappe", farbe: "#c8102e" } }) }).svg;
  k += figur(194, 145, { id: "mx_t4", geschlecht: "w", alter: "erwachsen", pose: "stehen", blick: 30, frisur: "lang", haarfarbe: "blond", haut: "hell", kleidung: kl("#f4f1e8", ["rock", "#7fb3d5"], "#f1e9d2", "sandale") }).svg;
  /* zwei weitere kleine Gruppen weiter hinten auf dem Rasen (≈ 8 Einheiten hoch: Kopf mit Haar, Hemd mit
     Ärmeln, Arme mit Händen, Beine, Schuhe; manche mit Hut oder Kamera) */
  const klein = (x, y, hemd, hose, haut, haar, hut, kamera, schritt) => {
    const s = sy(y), H = 1.72 * s, X = (v) => r(x + v * s), Y = (v) => r(y - v * s);
    sch += langSchatten(x, y, 1.72, 1.1);
    let g = `<path d="M${X(-0.09)} ${Y(0)} L${X(-0.08 - schritt)} ${Y(0)} L${X(-0.1)} ${Y(0.84)} L${X(0.1)} ${Y(0.84)} L${X(0.08 + schritt)} ${Y(0)} L${X(0.11)} ${Y(0)} L${X(0.13)} ${Y(0.86)} L${X(-0.13)} ${Y(0.86)} Z" fill="${hose}"/>`;
    g += `<path d="M${X(-0.14 - schritt)} ${Y(0)} h${r(0.13 * s)} v${r(-0.05 * s)} h${r(-0.1 * s)} Z M${X(0.04 + schritt)} ${Y(0)} h${r(0.13 * s)} v${r(-0.05 * s)} h${r(-0.1 * s)} Z" fill="#3a2f28"/>`;
    g += `<path d="M${X(-0.16)} ${Y(0.82)} L${X(0.16)} ${Y(0.82)} L${X(0.2)} ${Y(1.42)} L${X(0.26)} ${Y(1.3)} L${X(0.21)} ${Y(1.44)} Q${X(0)} ${Y(1.5)} ${X(-0.21)} ${Y(1.44)} L${X(-0.26)} ${Y(1.3)} L${X(-0.2)} ${Y(1.42)} Z" fill="${hemd}"/>`;
    const armR = kamera ? `M${X(0.22)} ${Y(1.32)} L${X(0.16)} ${Y(1.2)} L${X(0.06)} ${Y(1.38)}` : `M${X(0.24)} ${Y(1.32)} L${X(0.27)} ${Y(0.9)}`;
    g += `<path d="M${X(-0.24)} ${Y(1.32)} L${X(-0.27)} ${Y(0.9)} ${armR}" stroke="${haut}" stroke-width="${r(0.075 * s)}" stroke-linecap="round" fill="none"/>`;
    if (kamera) g += `<rect x="${X(-0.04)}" y="${Y(1.44)}" width="${r(0.14 * s)}" height="${r(0.09 * s)}" fill="#222"/>`;
    g += `<rect x="${X(-0.035)}" y="${Y(1.53)}" width="${r(0.07 * s)}" height="${r(0.06 * s)}" fill="${haut}"/><ellipse cx="${X(0)}" cy="${Y(1.62)}" rx="${r(0.09 * s)}" ry="${r(0.11 * s)}" fill="${haut}"/>`;
    g += hut ? `<ellipse cx="${X(0)}" cy="${Y(1.7)}" rx="${r(0.18 * s)}" ry="${r(0.035 * s)}" fill="${hut}"/><path d="M${X(-0.09)} ${Y(1.69)} Q${X(0)} ${Y(1.83)} ${X(0.09)} ${Y(1.69)} Z" fill="${hut}"/>` : `<path d="M${X(-0.095)} ${Y(1.6)} Q${X(-0.1)} ${Y(1.76)} ${X(0)} ${Y(1.75)} Q${X(0.1)} ${Y(1.76)} ${X(0.095)} ${Y(1.62)} L${X(0.06)} ${Y(1.68)} L${X(-0.07)} ${Y(1.67)} Z" fill="${haar}"/>`;
    return g;
  };
  let kl2 = "";
  kl2 += klein(150, 141.2, "#f4f1e8", "#3f4a5a", "#c99062", "#2a1d16", "#f1e9d2", true, 0.06) + klein(154, 141.5, "#f6d21e", "#f4f1e8", "#8a5a3b", "#1a1210", null, false, 0);
  kl2 += klein(204, 142.4, "#f4f1e8", "#e9e2d0", "#e8bf9a", "#6b4a32", "#e9e2c8", false, 0.05) + klein(208.4, 142.8, "#2f9e6e", "#f4f1e8", "#d7a179", "#1a1210", null, true, 0) + klein(211.6, 143.2, "#f4f1e8", "#7fb3d5", "#a87050", "#1a1210", null, false, 0.07);
  k = `<g filter="${ABEND}">${kl2}</g>` + k;
  /* in der Ferne: dichte Menschenlinie am Fuß der Pyramide (viele in Weiß), vor der Treppe frei */
  let menge = "";
  const kleid = ["#f4f1e8", "#f4f1e8", "#f4f1e8", "#7fb3d5", "#e8590c", "#f4f1e8", "#c2255c", "#f6d21e", "#f4f1e8", "#2f9e6e"];
  /* lockere Fläche in 4 versetzten Reihen mit Lücken, die meisten mit dem Rücken zu uns (sie schauen zur
     Nordtreppe), Höhen gestreut, einige sitzen, einige halten das Handy hoch, dazwischen Sonnenschirme */
  const haare = ["#2a1d16", "#1a1210", "#5a3a26", "#8a6a3a", "#bfa070", "#3a2a1e"], hautF = ["#c99062", "#8a5a3b", "#e8bf9a", "#a87050"];
  /* je Farbe ein einziger Pfad (klein und schnell); Reihen von hinten nach vorn */
  for (const [yr, x0, x1] of [[136.5, 44, 206], [137.4, 43, 206], [138.3, 42, 204], [139.3, 40, 200]]) {
    const F2 = {}, add = (k2, d) => { (F2[k2] = F2[k2] || []).push(d); };
    for (let x = x0 + rnd() * 2; x < x1; x += 1.5 + rnd() * 1.5) {
      if ((x > 54 && x < 104) || rnd() < 0.18) continue;
      const y = yr + (rnd() - 0.5) * 0.5, s = sy(y), sitzt = rnd() < 0.1, h = (sitzt ? 0.95 : 1.5 + rnd() * 0.45) * s, c = kleid[Math.floor(rnd() * kleid.length)], w = 0.42 * s, haut = hautF[Math.floor(rnd() * 4)];
      if (!sitzt) add("s" + (rnd() < 0.5 ? "#3f4a5a" : "#e9e2d0") + "|" + r(w * 0.4), `M${r(x - w * 0.3)} ${r(y)}V${r(y - h * 0.5)}M${r(x + w * 0.3)} ${r(y)}V${r(y - h * 0.5)}`);
      else add("f#e9e2d0", `M${r(x - w * 0.7)} ${r(y)}H${r(x + w * 0.7)}L${r(x + w * 0.5)} ${r(y - h * 0.25)}H${r(x - w * 0.5)}Z`);
      const yt = y - h * (sitzt ? 0.22 : 0.5);
      add("f" + c, `M${r(x - w / 2)} ${r(yt)}H${r(x + w / 2)}L${r(x + w * 0.42)} ${r(y - h * 0.84)}H${r(x - w * 0.42)}Z`);
      if (rnd() < 0.035) { add("s" + haut + "|" + r(w * 0.22), `M${r(x + w * 0.42)} ${r(y - h * 0.8)}L${r(x + w * 0.5)} ${r(y - h * 1.08)}`); add("f#222", `M${r(x + w * 0.4)} ${r(y - h * 1.18)}h${r(w * 0.22)}v${r(w * 0.3)}h${r(-w * 0.22)}Z`); }
      const kr = h * 0.075, ky = y - h * 0.91;
      if (rnd() < 0.25) add("f#efe6cc", `M${r(x - w * 0.42)} ${r(ky - kr * 0.3)}h${r(w * 0.84)}v${r(w * 0.12)}h${r(-w * 0.84)}ZM${r(x - kr)} ${r(ky)}a${r(kr)} ${r(kr)} 0 0 1 ${r(2 * kr)} 0a${r(kr)} ${r(kr)} 0 0 1 ${r(-2 * kr)} 0Z`);
      else add("f" + haare[Math.floor(rnd() * haare.length)], `M${r(x - kr)} ${r(ky)}a${r(kr)} ${r(kr)} 0 0 1 ${r(2 * kr)} 0a${r(kr)} ${r(kr)} 0 0 1 ${r(-2 * kr)} 0Z`);
    }
    for (const [k2, ds] of Object.entries(F2)) menge += k2[0] === "s" ? `<path d="${ds.join("")}" stroke="${k2.slice(1).split("|")[0]}" stroke-width="${k2.split("|")[1]}"/>` : `<path d="${ds.join("")}" fill="${k2.slice(1)}"/>`;
  }
  for (const [x, y, c] of [[70 - 26, 137.2, "#e8590c"], [132, 137.6, "#2f6fb0"], [176, 136.8, "#c2255c"]]) { const s = sy(y); menge += `<line x1="${r(x)}" y1="${r(y - 1.2 * s)}" x2="${r(x)}" y2="${r(y - 2.1 * s)}" stroke="#444" stroke-width=".15"/><path d="M${r(x - 0.5 * s)} ${r(y - 1.95 * s)} Q${r(x)} ${r(y - 2.35 * s)} ${r(x + 0.5 * s)} ${r(y - 1.95 * s)} Z" fill="${c}"/>`; }
  /* gemeinsames Schattenband der Menge, nach links */
  for (const [xa, xb] of [[40, 55], [103, 206]]) sch += `<path d="M${xb} 139.9 L${xa} 139.5 L${xa - 15} 138.7 L${xb - 15} 139.1 Z" fill="url(#${S.id("menschschatten")})"/>`;
  S.hinten(sch);
  const [ax, ay] = [126, 140];
  S.teil({ id: "touristen", de: "die Touristen", syl: "Tou-RIS-ten", it: "i turisti", itSyl: "tu-RI-sti", en: "tourists", x: ax, y: ay, kunst: um(ax, ay, `<g filter="${ABEND}">${menge}</g>` + k),
    tipp: "Klatscht man vor der Treppe in die Hände, antwortet ein Echo – es klingt wie der Ruf des Quetzal-Vogels." });
}

/* =====================================================================
   7 — DIE AGAVE (Henequén) vorn links: räumliche Rosette aus dicken
       Schwertblättern mit gezähntem Rand und dunklem Enddorn, auf kurzem
       Stamm mit vertrockneten unteren Blättern
   ===================================================================== */
{
  const X = 40, Y = 182, s = sy(Y);              /* ≈ 31 Einheiten je Meter */
  let k = bildSchatten(X, Y, 1.4, 2.2, 0.26);
  /* kurzer Stamm mit dürren, herabhängenden Blättern */
  k += `<path d="M-4 0 L-3.4 ${r(-0.35 * s)} L3.4 ${r(-0.35 * s)} L4 0 Z" fill="#7a6a4e"/>`;
  /* dürre Blätter: hängen eng am Stamm herab, braun-grau */
  for (let i = 0; i < 8; i++) { const sg = i % 2 ? 1 : -1, o = 1.6 + (i >> 1) * 1.1, top = -0.33 * s + (i >> 1) * 0.6; k += `<path d="M${r(sg * (o - 1.4))} ${r(top)} Q${r(sg * (o + 1.2))} ${r(top + 3)} ${r(sg * (o + 2.4))} ${r(-0.4 - (i >> 1) * 0.5)} L${r(sg * (o + 0.6))} ${r(-0.2 - (i >> 1) * 0.5)} Q${r(sg * o)} ${r(top + 4)} ${r(sg * (o - 1.4))} ${r(top + 1.6)} Z" fill="${i % 3 ? "#9b8558" : "#7d6a45"}"/>`; }
  const H0 = -0.35 * s;
  const blaetter = [];
  for (let i = 0; i < 17; i++) {
    const az = i * 2 * Math.PI / 17 + rnd() * 0.15, el = (i % 3 === 0 ? 62 : i % 3 === 1 ? 38 : 18) * Math.PI / 180 + (rnd() - 0.5) * 0.15, L = (1.05 + rnd() * 0.35) * s;
    blaetter.push({ az, el, L, z: Math.cos(az) * Math.cos(el) });
  }
  blaetter.sort((a, b) => a.z - b.z);
  for (const b of blaetter) {
    /* Spitze im Bild: x = sin(az)·cos(el), y = −sin(el); z (zum Betrachter) verkürzt die Länge */
    const tx = Math.sin(b.az) * Math.cos(b.el) * b.L, ty = H0 - Math.sin(b.el) * b.L * 0.95 + Math.cos(b.az) * Math.cos(b.el) * b.L * 0.18;
    const len = Math.hypot(tx, ty - H0), nx = -(ty - H0) / len, ny = tx / len, w = 0.155 * s * (0.6 + 0.4 * Math.abs(Math.sin(b.az)) + 0.3 * Math.max(0, b.z));
    const vorne = b.z > 0.2, c = vorne ? "#a2b394" : (b.z < -0.3 ? "#5e7556" : "#82987a");
    /* Blatt: breiter Grund, verjüngt zur Spitze, leicht gekehlt */
    const p = [[nx * w, H0 + ny * w], [tx * 0.55 + nx * w * 0.75, H0 + (ty - H0) * 0.55 + ny * w * 0.75], [tx, ty], [tx * 0.55 - nx * w * 0.75, H0 + (ty - H0) * 0.55 - ny * w * 0.75], [-nx * w, H0 - ny * w]];
    k += `<path d="M${pts(p)} Z" fill="${c}"/>`;
    k += `<path d="M0 ${r(H0)} L${r(tx * 0.92)} ${r(H0 + (ty - H0) * 0.92)}" stroke="${vorne ? "#c4cfb2" : "#6a8262"}" stroke-width="${r(w * 0.25)}" opacity=".6"/>`;
    /* Randzähne und Enddorn */
    let z = "";
    for (let t = 0.2; t < 0.9; t += 0.12) for (const sg of [-1, 1]) { const wx = (t < 0.55 ? 1 - t / 0.55 * 0.25 : 0.75 * (1 - (t - 0.55) / 0.45)) * w * 0.97; z += `M${r(tx * t + sg * nx * wx)} ${r(H0 + (ty - H0) * t + sg * ny * wx)} l${r(sg * nx * 0.32 + tx / len * 0.12)} ${r(sg * ny * 0.32 + (ty - H0) / len * 0.12)}`; }
    k += `<path d="${z}" stroke="#3e2f1c" stroke-width=".26"/>`;
    k += `<path d="M${r(tx)} ${r(ty)} l${r(tx / len * 1.2)} ${r((ty - H0) / len * 1.2)}" stroke="#1e160c" stroke-width=".55" stroke-linecap="round"/>`;
  }
  S.teil({ id: "agave", de: "die Agave", syl: "A-GA-ve", it: "l'agave", itSyl: "a-GA-ve", en: "agave", x: X, y: Y - 0.7 * s, kunst: `<g transform="translate(0 ${r(0.7 * s)})">${k}</g>`,
    tipp: "Aus den Fasern der Agave Henequén macht man in Yucatán Seile, Säcke und Taschen." });
}

/* =====================================================================
   8 — DER LEGUAN sonnt sich auf dem herabgefallenen Stein; sein
       Schwanz hängt über die Kante
   ===================================================================== */
{
  const sx0 = 96, sy0 = 186, s = sy(sy0), h = 0.42 * s, t = 0.18 * s;
  const L = 0.62 * s;
  let g = "";
  /* Schwanz: über die Steinoberseite, dann über die linke Kante nach unten */
  g += `<path d="M${r(-L * 0.22)} -1.6 Q${r(-L * 0.5)} -1.5 ${r(-L * 0.62)} -.6 Q${r(-L * 0.72)} 1.2 ${r(-L * 0.7)} 4.6 Q${r(-L * 0.72)} 5.6 ${r(-L * 0.76)} 6.4 Q${r(-L * 0.66)} 4 ${r(-L * 0.6)} 1 Q${r(-L * 0.52)} -.6 ${r(-L * 0.2)} -2.6 Z" fill="#3f3f38"/>`;
  for (let i = 0; i < 5; i++) g += `<path d="M${r(-L * 0.3 - i * L * 0.08)} ${r(-1.9 + i * 0.6)} l.7 .1" stroke="#9c9a86" stroke-width=".6"/>`;
  g += `<path d="M${r(-L * 0.25)} -1.2 Q0 -1 ${r(L * 0.18)} -1.4 Q${r(L * 0.26)} -2.6 ${r(L * 0.1)} -3.4 Q${r(-L * 0.08)} -3.6 ${r(-L * 0.25)} -2.8 Z" fill="${S.lg("leguan", [[0, "#5c5a4c"], [1, "#a29a78"]])}"/>`;
  for (let i = 0; i < 4; i++) g += `<path d="M${r(-L * 0.2 + i * 2)} -1.6 l0 -1.6" stroke="#2c2b25" stroke-width=".7"/>`;
  g += `<path d="M${r(L * 0.16)} -1.6 Q${r(L * 0.34)} -1.5 ${r(L * 0.4)} -2.4 Q${r(L * 0.36)} -3.6 ${r(L * 0.2)} -3.5 Q${r(L * 0.12)} -2.8 ${r(L * 0.16)} -1.6 Z" fill="#6c6a58"/>`;
  g += `<circle cx="${r(L * 0.3)}" cy="-2.9" r=".38" fill="#1d1c18"/><circle cx="${r(L * 0.31)}" cy="-3" r=".12" fill="#e9e2c0"/>`;
  for (let i = 0; i < 7; i++) g += `<path d="M${r(-L * 0.18 + i * 1.6)} ${r(-3.3 - Math.sin(i / 6 * Math.PI) * 0.4)} l.4 -1.1 l.4 1.1" fill="#2c2b25"/>`;
  /* kurze, seitlich abgewinkelte Beine: der Bauch liegt flach auf dem warmen Stein */
  g += `<path d="M${r(-L * 0.12)} -1.5 l-1.3 .5 l-.4 .9 M${r(L * 0.02)} -1.4 l1 .6 l.2 .8 M${r(L * 0.12)} -1.5 l1.2 .4 l.5 .8" stroke="#4a4840" stroke-width=".7" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
  g += `<path d="M${r(-L * 0.2)} -3.2 Q${r(L * 0.05)} -3.9 ${r(L * 0.32)} -3.3" stroke="#f0d8a0" stroke-width=".4" fill="none" opacity=".7"/>`;
  g += `<path d="M${r(-L * 0.22)} -.4 L${r(L * 0.3)} -.4 L${r(L * 0.3 - 20)} .2 L${r(-L * 0.22 - 18)} .2 Z" fill="#26341a" opacity=".22"/>`;
  S.teil({ oben: true, id: "leguan", de: "der Leguan", syl: "LE-gu-an", it: "l'iguana", itSyl: "i-GUA-na", en: "iguana", x: sx0 + 2, y: sy0 - h - t * 0.55 + 0.9, kunst: g,
    tipp: "In Chichén Itzá sonnen sich viele Leguane auf den warmen Steinen." });
}

/* =====================================================================
   9 — DER TISCH der Händlerin neben dem Stand (Mittagessen) — Lupe:
       Tortilla, Taco, Guacamole, Avocado, Limette
   ===================================================================== */
const TI = { x: 214, y: 194 };
const tischUnter = [];
{
  const s = sy(TI.y);                            /* ≈ 39 Einheiten je Meter */
  const sh = sy(TI.y - 7);
  const B1 = 0.5 * s, B2 = 0.5 * sh, HV = 0.74 * s, HH = 0.74 * sh;
  let k = bildSchatten(TI.x, TI.y, 0.74, 1, 0.24);
  for (const [x, y, h] of [[-B2 + 1.5, -7, HH], [B2 - 2.5, -7, HH], [-B1 + 1.5, 0, HV], [B1 - 2.5, 0, HV]]) k += `<rect x="${r(x)}" y="${r(y - h)}" width="1.2" height="${r(h)}" fill="#7a5532"/>`;
  const cid = S.id("wachstuch");
  S.def(`<pattern id="${cid}" width="6" height="4" patternUnits="userSpaceOnUse"><rect width="6" height="4" fill="#ffd43b"/><circle cx="1.5" cy="1.2" r=".9" fill="#e03131"/><path d="M1.5 .3 l.3 -.4" stroke="#2b8a3e" stroke-width=".3"/><ellipse cx="4.3" cy="2.8" rx=".9" ry=".6" fill="#f76707"/><path d="M3.6 .8 q.6 -.6 1.2 0" stroke="#2b8a3e" stroke-width=".5" fill="none"/></pattern>`);
  k += `<path d="M${r(-B1)} ${r(-HV)} L${r(B1)} ${r(-HV)} L${r(B2)} ${r(-7 - HH)} L${r(-B2)} ${r(-7 - HH)} Z" fill="url(#${cid})"/>`;
  k += `<path d="M${r(-B1)} ${r(-HV)} L${r(B1)} ${r(-HV)} L${r(B2)} ${r(-7 - HH)} L${r(-B2)} ${r(-7 - HH)} Z" fill="${S.lg("tuchglanz", [[0, "#fff", 0.2], [1, "#000", 0.05]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${r(-B1)} ${r(-HV)} L${r(B1)} ${r(-HV)} L${r(B1 + 0.6)} ${r(-HV + 5)} L${r(-B1 - 0.6)} ${r(-HV + 5)} Z" fill="url(#${cid})"/><path d="M${r(-B1)} ${r(-HV)} L${r(B1)} ${r(-HV)} L${r(B1 + 0.6)} ${r(-HV + 5)} L${r(-B1 - 0.6)} ${r(-HV + 5)} Z" fill="#000" opacity=".14"/>`;
  const y0 = -HV - 1.4;
  /* DIE TORTILLA — Stapel im Korb, halb zugedeckt mit der bestickten Servilleta */
  {
    const x = -9, y = y0;
    let g = `<path d="M${x - 5.6} ${y - 3} L${x + 5.6} ${y - 3} L${x + 4.6} ${y} L${x - 4.6} ${y} Z" fill="${S.lg("korb", [[0, "#c99a4e"], [1, "#8a5f2a"]])}"/>`;
    for (let i = 0; i < 6; i++) g += `<line x1="${x - 5 + i * 2}" y1="${y - 3}" x2="${x - 4.2 + i * 1.7}" y2="${y}" stroke="#7a5022" stroke-width=".3"/>`;
    for (let i = 0; i < 4; i++) g += `<ellipse cx="${x + 0.4}" cy="${r(y - 3.4 - i * 0.55)}" rx="4.6" ry="1.1" fill="${i % 2 ? "#f1d9a2" : "#e9cc8c"}" stroke="#c9a464" stroke-width=".2"/>`;
    for (let i = 0; i < 5; i++) g += `<circle cx="${r(x - 2.6 + i * 1.4)}" cy="${r(y - 5.3 + (i % 2) * 0.3)}" r=".22" fill="#a87a3c"/>`;
    /* Servilleta: weißes Tuch über der linken Hälfte, Rand mit gestickten Blumen */
    g += `<path d="M${x - 5.9} ${y - 3} Q${x - 6.4} ${y - 5.2} ${x - 4.4} ${y - 6.2} L${x - 0.6} ${y - 6.4} Q${x + 0.4} ${y - 4.6} ${x - 0.4} ${y - 2.8} L${x - 2} ${y - 1.2} L${x - 4.4} ${y - 1.4} Z" fill="#f8f4ea"/>`;
    g += `<path d="M${x - 0.6} ${y - 6.4} Q${x + 0.4} ${y - 4.6} ${x - 0.4} ${y - 2.8} L${x - 2} ${y - 1.2}" stroke="#3b8f4a" stroke-width=".25" fill="none"/>`;
    for (const [dx, dy, c] of [[-0.4, -5.6, "#d6336c"], [0, -4.4, "#7048e8"], [-0.6, -3.2, "#e8590c"], [-1.6, -1.8, "#d6336c"], [-3.2, -1.5, "#2f9e6e"]]) g += `<circle cx="${r(x + dx)}" cy="${r(y + dy)}" r=".4" fill="${c}"/><circle cx="${r(x + dx)}" cy="${r(y + dy)}" r=".14" fill="#f9d64a"/>`;
    k += g;
    tischUnter.push({ id: "tortilla", de: "die Tortilla", syl: "Tor-TIL-la", it: "la tortilla", itSyl: "tor-TIL-la", en: "tortilla", x: TI.x + x, y: TI.y + y, kunst: flaeche(-6.4, -6.8, 12.8, 7, 0.4),
      tipp: "Tortillas sind dünne Fladen aus Maismehl – frisch und warm im Tuch." });
  }
  /* DER TACO — drei weiche, gefaltete Maistortillas mit Cochinita pibil und rosa Zwiebeln */
  {
    const x = 3, y = y0 + 0.4;
    let g = `<ellipse cx="${x}" cy="${y - 0.4}" rx="6" ry="1.5" fill="#f4f1ea" stroke="#5b8fd6" stroke-width=".35"/>`;
    for (const [dx, rot] of [[-3, -16], [-0.4, -10], [2.4, -18]]) {
      g += `<g transform="rotate(${rot} ${x + dx} ${y - 1})">`;
      /* Füllung (Cochinita pibil, Fleischfasern) quillt oben aus der gefalteten Tortilla */
      g += `<path d="M${x + dx - 2.3} ${y - 2.6} Q${x + dx - 2.1} ${y - 3.9} ${x + dx} ${y - 3.8} Q${x + dx + 2.1} ${y - 3.9} ${x + dx + 2.3} ${y - 2.6} Z" fill="#b45a2c"/>`;
      for (let i = 0; i < 6; i++) g += `<path d="M${r(x + dx - 1.7 + i * 0.65)} ${r(y - 3.6 + (i % 2) * 0.2)} l.35 .8" stroke="#7e3416" stroke-width=".18"/>`;
      g += `<path d="M${x + dx - 1.5} ${y - 3.4} q.5 -.4 1 0 M${x + dx + 0.3} ${y - 3.6} q.5 -.4 1 0 M${x + dx - 0.5} ${y - 3.1} q.5 -.4 1 0" stroke="#f08cb8" stroke-width=".3" fill="none"/>`;
      /* dünne, weiche Maistortilla: von der Seite ein Halbmond, oben offen */
      g += `<path d="M${x + dx - 2.5} ${y - 2.7} A2.5 1.9 0 0 0 ${x + dx + 2.5} ${y - 2.7} L${x + dx + 2.2} ${y - 2.5} A2.2 1.5 0 0 1 ${x + dx - 2.2} ${y - 2.5} Z" fill="#e2c486"/>`;
      g += `<path d="M${x + dx - 2.2} ${y - 2.5} A2.2 1.5 0 0 0 ${x + dx + 2.2} ${y - 2.5} Z" fill="#f0dca8"/>`;
      for (let i = 0; i < 4; i++) g += `<circle cx="${r(x + dx - 1.3 + i * 0.85)}" cy="${r(y - 1.5 - (i % 2) * 0.45)}" r=".16" fill="#b98a46" opacity=".8"/>`;
      g += `</g>`;
    }
    g += `<ellipse cx="${x}" cy="${y - 2}" rx="6.4" ry="2.4" fill="${S.lg("tacolicht", [[0, "#3a1a08", 0.22], [0.55, "#fff", 0], [1, "#fff4d0", 0.3]], 0, 0, 1, 0)}"/>`;
    k += g;
    tischUnter.push({ id: "taco", de: "der Taco", syl: "TA-co", it: "il taco", itSyl: "TA-co", en: "taco", x: TI.x + x, y: TI.y + y, kunst: flaeche(-6.2, -5, 12.4, 5.4, 0.4),
      tipp: "In Yucatán isst man Tacos mit Cochinita pibil – Schweinefleisch mit rosa Zwiebeln." });
  }
  /* DIE GUACAMOLE im Molcajete (Mörser aus Lavastein, drei Füße) */
  {
    const x = 12.6, y = y0 + 0.6;
    let g = `<path d="M${x - 2.6} ${y - 2.2} L${x - 1.6} ${y - 1.6} L${x - 2.2} ${y} L${x - 3.2} ${y} Z M${x + 2.6} ${y - 2.2} L${x + 1.6} ${y - 1.6} L${x + 2.2} ${y} L${x + 3.2} ${y} Z M${x - 0.6} ${y - 1.4} L${x + 0.6} ${y - 1.4} L${x + 0.5} ${y + 0.4} L${x - 0.5} ${y + 0.4} Z" fill="#33312e"/>`;
    g += `<path d="M${x - 3.8} ${y - 3.6} Q${x} ${y + 0.4} ${x + 3.8} ${y - 3.6} Z" fill="${S.lg("lava", [[0, "#5a5652"], [1, "#2e2c2a"]])}"/>`;
    for (let i = 0; i < 8; i++) g += `<circle cx="${r(x - 2.6 + rnd() * 5.2)}" cy="${r(y - 3 + rnd() * 1.6)}" r=".2" fill="#1d1c1a"/>`;
    g += `<ellipse cx="${x}" cy="${y - 3.6}" rx="3.8" ry="1" fill="#6fa83c"/><path d="M${x - 3} ${y - 3.8} Q${x} ${y - 5.2} ${x + 3} ${y - 3.8} Q${x} ${y - 3} ${x - 3} ${y - 3.8} Z" fill="#8cc152"/>`;
    g += `<circle cx="${x - 1}" cy="${y - 4.2}" r=".3" fill="#e03131"/><circle cx="${x + 0.8}" cy="${y - 4}" r=".28" fill="#f8f4ea"/><circle cx="${x + 0.1}" cy="${y - 4.5}" r=".25" fill="#2b8a3e"/>`;
    k += g;
    tischUnter.push({ id: "guacamole", de: "die Guacamole", syl: "Gua-ca-MO-le", it: "il guacamole", itSyl: "gua-ca-MO-le", en: "guacamole", x: TI.x + x, y: TI.y + y, kunst: flaeche(-4.2, -5.4, 8.4, 5.8, 0.4),
      tipp: "Guacamole ist zerdrückte Avocado mit Limette, Zwiebel und Chili – im Steinmörser Molcajete." });
  }
  /* DIE AVOCADO — eine halbe mit Kern und eine ganze, ganz auf der Platte */
  {
    const x = -15.2, y = y0 + 1;
    let g = `<ellipse cx="${x - 2.4}" cy="${y - 1.4}" rx="1.6" ry="2" fill="#2f4a1c" transform="rotate(-30 ${x - 2.4} ${y - 1.4})"/>`;
    g += `<path d="M${x} ${y} Q${x - 2.2} ${y - 0.4} ${x - 2} ${y - 2.6} Q${x - 1.4} ${y - 4.4} ${x + 0.2} ${y - 4.2} Q${x + 2} ${y - 3.8} ${x + 2} ${y - 1.6} Q${x + 1.8} ${y + 0.2} ${x} ${y} Z" fill="#355e1e"/>`;
    g += `<path d="M${x} ${y - 0.5} Q${x - 1.6} ${y - 0.8} ${x - 1.4} ${y - 2.6} Q${x - 1} ${y - 3.8} ${x + 0.2} ${y - 3.6} Q${x + 1.5} ${y - 3.3} ${x + 1.4} ${y - 1.6} Q${x + 1.3} ${y - 0.4} ${x} ${y - 0.5} Z" fill="#d8e88a"/>`;
    g += `<circle cx="${x}" cy="${y - 1.8}" r=".95" fill="${S.rg("kern", [[0, "#c48a52"], [0.6, "#8a5a2a"], [1, "#5e3a18"]], 0.35, 0.3)}"/><circle cx="${x - 0.3}" cy="${y - 2.1}" r=".25" fill="#f0c890"/>`;
    /* glänzende Schale der ganzen Avocado, Schatten auf dem Wachstuch */
    g += `<ellipse cx="${x - 2.1}" cy="${y - 2.2}" rx=".35" ry=".7" fill="#8fb46a" opacity=".7" transform="rotate(-30 ${x - 2.1} ${y - 2.2})"/><ellipse cx="${x - 3.6}" cy="${y + 0.2}" rx="2.4" ry=".45" fill="#5a3a1a" opacity=".3"/>`;
    k = k + g;
    tischUnter.push({ id: "avocado", de: "die Avocado", syl: "A-vo-CA-do", it: "l'avocado", itSyl: "a-vo-CA-do", en: "avocado", x: TI.x + x, y: TI.y + y, kunst: flaeche(-4.4, -4.8, 7, 5.2, 0.4),
      tipp: "Die Avocado stammt aus Mexiko. Schon die Maya und Azteken haben sie gegessen." });
  }
  /* DIE LIMETTE — halbiert und ganz, auf der Platte neben dem Mörser */
  {
    const x = -0.6, y = y0 + 1.3;
    let g = `<circle cx="${x + 1.8}" cy="${y - 1.1}" r="1.15" fill="${S.rg("limette", [[0, "#94d82d"], [1, "#4c8a1a"]], 0.35, 0.3)}"/>`;
    g += `<ellipse cx="${x - 0.6}" cy="${y - 0.75}" rx="1.35" ry=".75" fill="#5c940d"/><ellipse cx="${x - 0.6}" cy="${y - 0.95}" rx="1.1" ry=".55" fill="#d8f5a2"/>`;
    for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; g += `<line x1="${x - 0.6}" y1="${y - 0.95}" x2="${r(x - 0.6 + Math.cos(a) * 0.9)}" y2="${r(y - 0.95 + Math.sin(a) * 0.45)}" stroke="#a9e34b" stroke-width=".15"/>`; }
    k += g;
    tischUnter.push({ id: "limette", de: "die Limette", syl: "Li-MET-te", it: "la limetta", itSyl: "li-MET-ta", en: "lime", x: TI.x + x, y: TI.y + y, kunst: flaeche(-2.4, -2.6, 5.8, 3, 0.4),
      tipp: "In Mexiko kommt auf fast alles ein Spritzer Limettensaft." });
  }
  S.teil({ id: "tisch", de: "der Tisch", syl: "TISCH", it: "il tavolo", itSyl: "TA-vo-lo", en: "table", x: TI.x, y: TI.y - HV * 0.5, steht: true, kunst: `<g transform="translate(0 ${r(HV * 0.5)})">${k}</g>`,
    zoom: { x: TI.x - 22, y: TI.y - HV - 15, w: 42, h: 28 },
    unter: tischUnter,
    tipp: "Zwischendurch isst die Verkäuferin an ihrem Tisch: Tacos, Tortillas und Guacamole." });
}

/* =====================================================================
   10 — DER STAND (Palapa) — Lupe: Maske, Totenkopf, Jaguar, Rassel,
        Flagge; dazu Decke (Sarape), Hüte, Hängematte, Piñata und die
        Verkäuferin im Huipil
   ===================================================================== */
const STAND = { x0: 246, x1: 310, vorn: 192, hinten: 178 };
const SV = sy(STAND.vorn), SH = sy(STAND.hinten);
const DACH = STAND.vorn - 2.25 * SV;
const TISCH_O = STAND.vorn - 6 - 0.8 * sy(STAND.vorn - 6);
const standUnter = [];
{
  const { x0, x1, vorn, hinten } = STAND;
  const HOLZ = S.lg("pfosten", [[0, "#6b4a2c"], [0.5, "#8a6440"], [1, "#5a3c22"]], 0, 0, 1, 0);
  S.hinten(`<g transform="translate(${(x0 + x1) / 2} ${vorn})">${bildSchatten((x0 + x1) / 2, vorn, 2.4, 3.2, 0.22)}</g>`);
  let k = "";
  k += `<rect x="${x0 + 8}" y="${r(hinten - 2.5 * SH)}" width="1.6" height="${r(2.5 * SH)}" fill="#5a3c22"/><rect x="${x1 - 6}" y="${r(hinten - 2.5 * SH)}" width="1.6" height="${r(2.5 * SH)}" fill="#5a3c22"/>`;
  k += `<rect x="${x0 + 9}" y="${r(hinten - 2.4 * SH)}" width="${x1 - x0 - 15}" height="${r(1.75 * SH)}" fill="${S.lg("rueckstoff", [[0, "#6a3a3a"], [1, "#4a2a2a"]])}"/>`;
  k += `<path d="M${x0 + 9} ${r(hinten - 2.2 * SH)} Q${(x0 + x1) / 2} ${r(hinten - 2.1 * SH)} ${x1 - 5} ${r(hinten - 2.2 * SH)}" stroke="#d8c8a0" stroke-width=".4" fill="none"/>`;
  /* Verkaufstisch mit besticktem Tuch (links), daneben steht die Verkäuferin */
  const tv = vorn - 6, th = TISCH_O, xt1 = x0 + 44;
  k += `<path d="M${x0 + 4} ${r(th)} L${xt1} ${r(th)} L${xt1 - 2} ${r(th - 6)} L${x0 + 7} ${r(th - 6)} Z" fill="${S.lg("tischplatte", [[0, "#ddd2b9"], [1, "#efe4c8"]])}"/>`;
  k += `<path d="M${x0 + 4} ${r(th)} L${xt1} ${r(th)} L${xt1} ${r(tv - 3)} Q${(x0 + xt1) / 2} ${r(tv - 1)} ${x0 + 4} ${r(tv - 3)} Z" fill="${S.lg("tuchnord", [[0, "#cfc5b1"], [0.85, "#ddd3bf"], [1, "#f0d7a0"]], 0, 0, 1, 0)}"/>`;
  for (let x = x0 + 7; x < xt1 - 2; x += 5.2) { const y = tv - 7; k += `<circle cx="${r(x)}" cy="${r(y)}" r="1.3" fill="${["#d6336c", "#f28c28", "#2f9e6e", "#7048e8"][Math.round(x) % 4]}"/><circle cx="${r(x)}" cy="${r(y)}" r=".5" fill="#f9d64a"/><path d="M${r(x - 2.6)} ${r(y + 0.3)} q1.3 -1 2.6 0 M${r(x)} ${r(y + 0.3)} q1.3 1 2.6 0" stroke="#3b8f4a" stroke-width=".4" fill="none"/>`; }
  k += `<rect x="${x0 + 4}" y="${r(tv - 4)}" width="${xt1 - x0 - 4}" height="1" fill="#c8102e"/>`;
  let spitze = "";
  for (let x = x0 + 4; x < xt1; x += 1.6) spitze += `<path d="M${r(x)} ${r(tv - 3)} q.8 1.3 1.6 0" stroke="#f4eee0" stroke-width=".35" fill="none"/>`;
  k += spitze;
  const yT = th - 1.4;
  /* kleine Schlagschatten der Waren auf das Tischtuch (Sonne rechts → nach links) */
  for (const [dx, b] of [[9.5, 3.4], [16.4, 3.2], [25, 3.2], [32.6, 3.2], [43.4, 2.4]]) k += `<ellipse cx="${r(x0 + dx - 1.6)}" cy="${r(yT - 0.1)}" rx="${b}" ry=".55" fill="#5a4a36" opacity=".35"/>`;
  /* DIE MASKE — zwei geschnitzte Holzmasken der Maya-Schnitzer: eine Jaguarmaske (Ohren, Rosetten,
     Fangzähne) und eine Maske des Regengottes Chaac mit langer, hochgerollter Rüsselnase */
  {
    let g = "";
    { const x = x0 + 9.5, yo = yT - 0.2;
      g += `<path d="M${r(x - 3)} ${r(yo - 5.4)} Q${r(x - 3.4)} ${r(yo - 1.4)} ${r(x - 1.2)} ${r(yo)} L${r(x + 1.2)} ${r(yo)} Q${r(x + 3.4)} ${r(yo - 1.4)} ${r(x + 3)} ${r(yo - 5.4)} Q${x} ${r(yo - 6.6)} ${r(x - 3)} ${r(yo - 5.4)} Z" fill="#d89a3a"/>`;
      g += `<path d="M${r(x - 3)} ${r(yo - 5.3)} l-.5 -1.6 l1.8 .7 Z M${r(x + 3)} ${r(yo - 5.3)} l.5 -1.6 l-1.8 .7 Z" fill="#a8641e"/>`;
      for (const [dx, dy] of [[-2, -4.6], [2, -4.6], [-2.4, -2.4], [2.4, -2.4], [0, -5.6]]) g += `<circle cx="${r(x + dx)}" cy="${r(yo + dy)}" r=".45" fill="none" stroke="#3a2010" stroke-width=".25"/>`;
      g += `<path d="M${r(x - 2.1)} ${r(yo - 3.6)} q.8 -.7 1.5 0 q-.7 .35 -1.5 0 Z M${r(x + 0.6)} ${r(yo - 3.6)} q.8 -.7 1.5 0 q-.7 .35 -1.5 0 Z" fill="#2f8f6a"/><path d="M${r(x - 0.6)} ${r(yo - 2.8)} L${r(x + 0.6)} ${r(yo - 2.8)} L${x} ${r(yo - 2.1)} Z" fill="#3a2010"/>`;
      g += `<path d="M${r(x - 1.5)} ${r(yo - 1.3)} Q${x} ${r(yo - 0.5)} ${r(x + 1.5)} ${r(yo - 1.3)}" stroke="#3a2010" stroke-width=".35" fill="#7a2a1a"/><path d="M${r(x - 0.9)} ${r(yo - 1.25)} l.25 .7 l.25 -.6 M${r(x + 0.4)} ${r(yo - 1.25)} l.25 .6 l.25 -.7" fill="#f4ead2"/>`; }
    { const x = x0 + 16.4, yo = yT - 0.2;
      g += `<path d="M${r(x - 2.8)} ${r(yo - 6)} L${r(x + 2.8)} ${r(yo - 6)} L${r(x + 3)} ${r(yo - 0.6)} Q${x} ${r(yo + 0.3)} ${r(x - 3)} ${r(yo - 0.6)} Z" fill="${S.lg("chaacholz", [[0, "#2f7d63"], [1, "#4aa383"]], 0, 0, 1, 0)}"/>`;
      g += `<path d="M${r(x - 2.8)} ${r(yo - 6)} L${r(x + 2.8)} ${r(yo - 6)} L${r(x + 2.8)} ${r(yo - 5.2)} L${r(x - 2.8)} ${r(yo - 5.2)} Z" fill="#c8402e"/>`;
      g += `<circle cx="${r(x - 1.4)}" cy="${r(yo - 4.1)}" r=".9" fill="#f4ead2"/><circle cx="${r(x + 1.4)}" cy="${r(yo - 4.1)}" r=".9" fill="#f4ead2"/><circle cx="${r(x - 1.4)}" cy="${r(yo - 4.1)}" r=".4" fill="#1a120a"/><circle cx="${r(x + 1.4)}" cy="${r(yo - 4.1)}" r=".4" fill="#1a120a"/>`;
      /* Rüsselnase: hängt herab und rollt sich vorn nach oben */
      g += `<path d="M${r(x - 0.5)} ${r(yo - 3.6)} L${r(x - 0.5)} ${r(yo - 1.6)} Q${r(x - 0.5)} ${r(yo - 0.4)} ${r(x + 0.7)} ${r(yo - 0.6)} Q${r(x + 1.6)} ${r(yo - 1.1)} ${r(x + 1)} ${r(yo - 1.8)} Q${r(x + 0.5)} ${r(yo - 1.9)} ${r(x + 0.5)} ${r(yo - 1.5)} L${r(x + 0.5)} ${r(yo - 3.6)} Z" fill="#c8402e"/>`;
      g += `<path d="M${r(x - 2.4)} ${r(yo - 1)} h1.4 M${r(x + 1.4)} ${r(yo - 1)} h1" stroke="#1a120a" stroke-width=".35"/><circle cx="${r(x - 3.2)}" cy="${r(yo - 3)}" r=".7" fill="#c8402e"/><circle cx="${r(x + 3.2)}" cy="${r(yo - 3)}" r=".7" fill="#c8402e"/>`; }
    k += g;
    standUnter.push({ id: "maske", de: "die Maske", syl: "MAS-ke", it: "la maschera", itSyl: "MA-sche-ra", en: "mask", x: x0 + 12.7, y: yT, kunst: flaeche(-7.4, -9.6, 14.8, 10, 0.5),
      tipp: "Die Schnitzer aus den Maya-Dörfern machen Masken aus Holz: einen Jaguar und Chaac, den Regengott mit der Rüsselnase." });
  }
  /* DER TOTENKOPF — bunt bemalte Calavera (Ton) */
  {
    const x = x0 + 25;
    let g = `<path d="M${x - 3.2} ${r(yT - 3.4)} Q${x - 3.4} ${r(yT - 8)} ${x} ${r(yT - 8.4)} Q${x + 3.4} ${r(yT - 8)} ${x + 3.2} ${r(yT - 3.4)} Q${x + 2.5} ${r(yT - 2)} ${x + 1.6} ${r(yT - 0.4)} L${x - 1.6} ${r(yT - 0.4)} Q${x - 2.5} ${r(yT - 2)} ${x - 3.2} ${r(yT - 3.4)} Z" fill="#f8f4ea"/>`;
    g += `<circle cx="${x - 1.35}" cy="${r(yT - 4.6)}" r="1.05" fill="#2f9e6e"/><circle cx="${x + 1.35}" cy="${r(yT - 4.6)}" r="1.05" fill="#7048e8"/><circle cx="${x - 1.35}" cy="${r(yT - 4.6)}" r=".42" fill="#111"/><circle cx="${x + 1.35}" cy="${r(yT - 4.6)}" r=".42" fill="#111"/>`;
    g += `<path d="M${x - 0.4} ${r(yT - 3.3)} L${x} ${r(yT - 2.7)} L${x + 0.4} ${r(yT - 3.3)} Z" fill="#111"/><path d="M${x - 1.5} ${r(yT - 1.6)} h3" stroke="#111" stroke-width=".35"/>`;
    for (let i = 0; i < 5; i++) g += `<line x1="${r(x - 1.1 + i * 0.55)}" y1="${r(yT - 2)}" x2="${r(x - 1.1 + i * 0.55)}" y2="${r(yT - 1.2)}" stroke="#111" stroke-width=".2"/>`;
    g += `<path d="M${x - 2.1} ${r(yT - 7)} q1 -1 2.1 0 q1.1 -1 2.1 0" stroke="#d6336c" stroke-width=".6" fill="none"/><circle cx="${x}" cy="${r(yT - 6.6)}" r=".55" fill="#f1c232"/>`;
    k += g;
    standUnter.push({ id: "totenkopf", de: "der Totenkopf", syl: "TO-ten-kopf", it: "il teschio", itSyl: "TE-schio", en: "skull", x, y: yT, kunst: flaeche(-3.8, -8.8, 7.6, 9, 0.5),
      tipp: "Bunte Totenköpfe aus Ton erinnern an den Tag der Toten im November. Dann schmückt man Altäre mit Zuckerschädeln und orangefarbenen Studentenblumen." });
  }
  /* DER JAGUAR — sitzende Pfeife aus rotbraunem Ton, aufgemalte Rosetten, Maul mit Fangzähnen, Mundstück am Schwanz */
  {
    const x = x0 + 32.6;
    const TON = S.lg("terrakotta", [[0, "#c8693a"], [1, "#8e3f1f"]]);
    let g = `<path d="M${x - 2.8} ${r(yT)} Q${x - 3.4} ${r(yT - 2.8)} ${x - 2} ${r(yT - 4.4)} L${x + 1.4} ${r(yT - 4.4)} Q${x + 3} ${r(yT - 2.8)} ${x + 2.6} ${r(yT)} Z" fill="${TON}"/>`;
    g += `<path d="M${x + 2.4} ${r(yT - 0.5)} q2 0 2.2 -1.4 q.1 -.8 .9 -.9" stroke="#8e3f1f" stroke-width=".8" fill="none" stroke-linecap="round"/><ellipse cx="${x + 5.5}" cy="${r(yT - 2.85)}" rx=".45" ry=".35" fill="#5a2a14"/>`;
    g += `<path d="M${x - 3.2} ${r(yT - 4.6)} Q${x - 3.4} ${r(yT - 7.6)} ${x - 0.6} ${r(yT - 7.8)} Q${x + 2} ${r(yT - 7.6)} ${x + 1.8} ${r(yT - 4.6)} Q${x - 0.6} ${r(yT - 3.6)} ${x - 3.2} ${r(yT - 4.6)} Z" fill="${TON}"/>`;
    g += `<path d="M${x - 2.6} ${r(yT - 7.2)} l-.3 -1 l1 .5 Z M${x + 1.2} ${r(yT - 7.3)} l.3 -1 l-1 .5 Z" fill="#8e3f1f"/>`;
    g += `<path d="M${x - 2} ${r(yT - 5)} Q${x - 0.7} ${r(yT - 4)} ${x + 0.6} ${r(yT - 5)} L${x + 0.4} ${r(yT - 4.2)} Q${x - 0.7} ${r(yT - 3.4)} ${x - 1.8} ${r(yT - 4.2)} Z" fill="#3a1a0c"/>`;
    g += `<path d="M${x - 1.6} ${r(yT - 4.95)} l.25 .7 l.25 -.65 M${x + 0.1} ${r(yT - 4.95)} l.25 .65 l.25 -.7" fill="#f4ead2"/>`;
    g += `<path d="M${x - 2.2} ${r(yT - 6.4)} l.9 .3 M${x + 1} ${r(yT - 6.4)} l-.9 .3" stroke="#f1c232" stroke-width=".35"/><circle cx="${x - 1.5}" cy="${r(yT - 6)}" r=".25" fill="#111"/><circle cx="${x + 0.3}" cy="${r(yT - 6)}" r=".25" fill="#111"/>`;
    for (const [dx, dy] of [[-1.8, -1.6], [0, -0.9], [1.3, -2.4], [-0.8, -3.1], [1.4, -0.8], [-2.2, -0.6], [-2.4, -6.8], [1.2, -6.9]]) g += `<circle cx="${r(x + dx)}" cy="${r(yT + dy)}" r=".45" fill="none" stroke="#1d120a" stroke-width=".3"/><circle cx="${r(x + dx)}" cy="${r(yT + dy)}" r=".15" fill="#f1c232"/>`;
    k += g;
    standUnter.push({ id: "jaguar", de: "der Jaguar", syl: "JA-gu-ar", it: "il giaguaro", itSyl: "gia-GUA-ro", en: "jaguar", x, y: yT, kunst: flaeche(-3.8, -8.6, 10, 9, 0.5),
      tipp: "Bläst man in den Jaguar aus Ton, brüllt er wie die große Raubkatze. Für die Maya war der Jaguar heilig." });
  }
  /* DIE RASSEL — zwei bemalte Maracas */
  {
    const x = x0 + 43.4;
    let g = "";
    for (const [dx, rot, c] of [[-1.4, -20, "#c8102e"], [1.6, 16, "#2f9e6e"]]) g += `<g transform="translate(${x + dx} ${r(yT)}) rotate(${rot})"><rect x="-.45" y="-3.6" width=".9" height="3.6" rx=".4" fill="#8a5a2a"/><ellipse cx="0" cy="-6" rx="2.3" ry="2.7" fill="${c}"/><path d="M-2.1 -6.2 q2.1 1.4 4.2 0" stroke="#f1c232" stroke-width=".5" fill="none"/><path d="M-1.8 -5.1 q1.8 .9 3.6 0" stroke="#fff" stroke-width=".3" fill="none"/><ellipse cx="-.8" cy="-6.9" rx=".6" ry=".9" fill="#fff" opacity=".35"/></g>`;
    k += g;
    standUnter.push({ id: "rassel", de: "die Rassel", syl: "RAS-sel", it: "la maraca", itSyl: "ma-RA-ca", en: "maraca", x, y: yT, kunst: flaeche(-4.6, -9.6, 9.6, 10, 0.5),
      tipp: "Die Rasseln heißen auf Spanisch Maracas. In ihnen klappern Samen." });
  }
  /* DIE FLAGGE — Papierfähnchen Mexikos im Tonbecher (Adler auf dem Nopal mit Schlange) */
  {
    const x = x0 + 2.9;
    let g = `<path d="M${x - 1.6} ${r(yT)} L${x + 1.6} ${r(yT)} L${x + 1.9} ${r(yT - 3)} L${x - 1.9} ${r(yT - 3)} Z" fill="#a85a32"/><path d="M${x - 1.9} ${r(yT - 3)} L${x + 1.9} ${r(yT - 3)}" stroke="#f1c232" stroke-width=".35"/>`;
    for (const [dx, rot] of [[-0.4, -9], [0.6, 7]]) {
      g += `<g transform="translate(${r(x + dx)} ${r(yT - 2.6)}) rotate(${rot})"><line x1="0" y1="0" x2="0" y2="-11" stroke="#7a5532" stroke-width=".25"/>`;
      g += `<rect x="0" y="-11" width="2.4" height="4" fill="#006847"/><rect x="2.4" y="-11" width="2.4" height="4" fill="#f6f3ea"/><rect x="4.8" y="-11" width="2.4" height="4" fill="#ce1126"/>`;
      /* Wappen: Nopal (grün), Adler (braun, Flügel offen), Schlange im Schnabel */
      g += `<path d="M3.1 -7.6 q.5 -.6 1 0 M3.6 -7.6 v-.6" stroke="#2b8a3e" stroke-width=".28" fill="none"/><ellipse cx="3.6" cy="-8.4" rx=".42" ry=".3" fill="#2b8a3e"/>`;
      g += `<path d="M2.9 -9.4 l.7 .5 l.7 -.5 l-.2 .7 l-.5 .5 l-.5 -.5 Z" fill="#7a4a22"/><circle cx="3.75" cy="-9.55" r=".18" fill="#7a4a22"/><path d="M3.95 -9.5 q.4 .2 .3 .5 q-.2 .2 .1 .4" stroke="#3b8f4a" stroke-width=".12" fill="none"/></g>`;
    }
    k += g;
    standUnter.push({ id: "flagge", de: "die Flagge", syl: "FLAG-ge", it: "la bandiera", itSyl: "ban-DIE-ra", en: "flag", x, y: yT, kunst: flaeche(-2.2, -3.4, 4.4, 3.6, 0.4) + flaeche(-1.2, -15.2, 9.6, 5.4, 0.4),
      tipp: "Auf der Flagge Mexikos sitzt ein Adler auf einem Kaktus und hält eine Schlange im Schnabel." });
  }
  /* Licht und Material: Rundung (Licht rechts), Glanz auf glasiertem Ton, Schnitzkerben im Holz */
  {
    const RUND = S.lg("warenlicht", [[0, "#2a1a0e", 0.28], [0.5, "#ffffff", 0], [0.85, "#fff2d0", 0.25], [1, "#fff2d0", 0.05]], 0, 0, 1, 0);
    for (const [dx, w2, h2] of [[9.5, 3.3, 6.2], [16.4, 3, 6], [25, 3.4, 8.4], [32.6, 3.6, 8]]) k += `<ellipse cx="${r(x0 + dx)}" cy="${r(yT - h2 / 2 - 0.2)}" rx="${w2}" ry="${r(h2 / 2)}" fill="${RUND}"/>`;
    k += `<path d="M${r(x0 + 26.5)} ${r(yT - 7.6)} q1.2 .8 1.1 2.6 M${r(x0 + 34)} ${r(yT - 7.2)} q.9 .6 .9 1.8 M${r(x0 + 34.3)} ${r(yT - 3.6)} q.6 .6 .4 1.8" stroke="#fffaf0" stroke-width=".35" fill="none" stroke-linecap="round" opacity=".85"/>`;
    k += `<path d="M${r(x0 + 7)} ${r(yT - 5.6)} q.4 2 .2 4.6 M${r(x0 + 11.8)} ${r(yT - 5.4)} q.3 2 -.1 4.4 M${r(x0 + 14.6)} ${r(yT - 5.8)} q.3 2.2 .1 4.8 M${r(x0 + 18.4)} ${r(yT - 5.6)} q-.2 2 0 4.4" stroke="#3a2412" stroke-width=".14" fill="none" opacity=".45"/>`;
  }
  /* vordere Pfosten */
  k += `<rect x="${x0 - 1}" y="${r(DACH - 4)}" width="2.4" height="${r(vorn - DACH + 4)}" fill="${HOLZ}"/><rect x="${x1 - 2}" y="${r(DACH - 4)}" width="2.4" height="${r(vorn - DACH + 4)}" fill="${HOLZ}"/>`;
  /* Palapa: Dach aus Palmblättern, vorn tiefer, ausgefranster Rand; Unterseite im Schatten */
  k += `<path d="M${x0 - 3} ${r(DACH)} L${x1 + 4} ${r(DACH)} L${x1 - 3} ${r(DACH - 15)} L${x0 + 6} ${r(DACH - 17)} Z" fill="url(#${S.id("palapa")})"/>`;
  k += `<path d="M${x0 - 3} ${r(DACH)} L${x1 + 4} ${r(DACH)} L${x1 - 3} ${r(DACH - 15)} L${x0 + 6} ${r(DACH - 17)} Z" fill="${S.lg("palapalicht", [[0, "#000", 0.25], [0.6, "#fff", 0], [1, "#ffd890", 0.35]], 0, 0, 1, 0)}"/>`;
  let fr = `M${x0 - 3} ${r(DACH)}`;
  for (let x = x0 - 3; x < x1 + 4; x += 2.2) fr += ` L${r(x + 1.1)} ${r(DACH + 2.4 + rnd() * 2.2)} L${r(x + 2.2)} ${r(DACH + 0.4)}`;
  k += `<path d="${fr} L${x1 + 4} ${r(DACH - 1)} L${x0 - 3} ${r(DACH - 1)} Z" fill="#a8844c"/>`;
  k += `<path d="M${x0 + 6} ${r(DACH - 17)} L${x1 - 3} ${r(DACH - 15)}" stroke="#7a5a30" stroke-width="1.2"/>`;
  /* Nägel für die Hüte und Haken für die Hängematte */
  S.teil({ id: "stand", de: "der Stand", syl: "STAND", it: "la bancarella", itSyl: "ban-ca-REL-la", en: "stall", x: x0 + 30, y: vorn - 10, steht: true, kunst: um(x0 + 30, vorn - 10, k),
    zoom: { x: x0 - 2, y: TISCH_O - 26, w: 54, h: 36 },
    unter: standUnter,
    tipp: "An den Ständen verkaufen Maya-Familien aus den Dörfern ihr Kunsthandwerk." });
}

/* DIE DECKE (Sarape) — hängt hinten über dem Seil */
{
  const X = STAND.x0 + 20, Y = STAND.hinten - 2.2 * SH;
  let k = `<path d="M-10 0 L10 0 L11 30 L-11 30 Z" fill="url(#${S.id("sarape")})"/>`;
  k += `<path d="M-10 0 L10 0 L11 30 L-11 30 Z" fill="${S.lg("deckenfalten", [[0, "#000", 0.25], [0.3, "#000", 0], [0.6, "#fff", 0.08], [1, "#000", 0.2]], 0, 0, 1, 0)}"/>`;
  for (let x = -10; x <= 11; x += 1.6) k += `<line x1="${r(x)}" y1="30" x2="${r(x + 0.2)}" y2="32.6" stroke="#f1c232" stroke-width=".4"/>`;
  k += `<path d="M-3 14 L0 10 L3 14 L0 18 Z" fill="#f4efe2"/><path d="M-1.4 14 L0 12.4 L1.4 14 L0 15.6 Z" fill="#1e7a6e"/>`;
  S.teil({ id: "decke", de: "die Decke", syl: "DE-cke", it: "la coperta", itSyl: "co-PER-ta", en: "blanket", x: X, y: Y + 12, kunst: `<g transform="translate(0 -12)">${k}</g>`,
    tipp: "Diese bunte Decke heißt in Mexiko Sarape. Man kann sie auch als Umhang tragen." });
}
/* DER SOMBRERO und der Jipi-Hut — hängen an Nägeln an der Rückwand (von vorn: die Krempe ein Kreis) */
{
  const X = STAND.x0 + 37.4, Y = STAND.hinten - 2.1 * SH + 6;
  const hut = (dx, dy, R, krone, stroh, band, fein) => {
    /* Dreiviertelansicht, an einer Schnur vom Nagel: Krempe als flache Ellipse (vorn etwas aufgebogen),
       Krone darüber mit Schattenseite links, umlaufendes Hutband mit Zickzack, gestickte Borte am Rand */
    const ry = R * 0.3, kh = fein ? krone * 1.25 : krone * 2.1, kt = krone * (fein ? 0.85 : 0.62);
    let g = `<line x1="${dx}" y1="${r(dy - kh - 3.2)}" x2="${dx}" y2="${r(dy - kh + 0.2)}" stroke="#d8c8a0" stroke-width=".3"/><circle cx="${dx}" cy="${r(dy - kh - 3.4)}" r=".45" fill="#666"/>`;
    g += `<ellipse cx="${r(dx + 0.9)}" cy="${r(dy + 1.6)}" rx="${R}" ry="${r(ry * 1.1)}" fill="#2a1410" opacity=".28"/>`;
    /* Krempe: hinterer Rand, dann Fläche, vorn hochgebogener Rand */
    g += `<ellipse cx="${dx}" cy="${dy}" rx="${R}" ry="${r(ry)}" fill="${stroh}"/>`;
    g += `<path d="M${r(dx - R)} ${dy} A${R} ${r(ry)} 0 0 0 ${r(dx + R)} ${dy} L${r(dx + R - 0.3)} ${r(dy - 0.6)} A${r(R - 0.3)} ${r(ry - 0.4)} 0 0 1 ${r(dx - R + 0.3)} ${r(dy - 0.6)} Z" fill="${fein ? "#e2d3ad" : "#d9b06a"}"/>`;
    if (!fein) { let bo = ""; for (let i = 0; i <= 16; i++) { const a = Math.PI * i / 16, x = dx - Math.cos(a) * (R - 0.5), y = dy + Math.sin(a) * (ry - 0.2) - 0.3; bo += `${i ? "L" : "M"}${r(x)} ${r(y + (i % 2 ? -0.35 : 0.2))}`; } g += `<path d="${bo}" stroke="#c8102e" stroke-width=".35" fill="none"/>`; }
    else g += `<ellipse cx="${dx}" cy="${r(dy - 0.1)}" rx="${r(R - 0.8)}" ry="${r(ry - 0.3)}" fill="none" stroke="#c9b483" stroke-width=".15"/>`;
    /* Krone */
    g += `<path d="M${r(dx - krone)} ${r(dy - 0.4)} L${r(dx - kt)} ${r(dy - kh)} Q${dx} ${r(dy - kh - krone * 0.45)} ${r(dx + kt)} ${r(dy - kh)} L${r(dx + krone)} ${r(dy - 0.4)} Q${dx} ${r(dy + ry * 0.35)} ${r(dx - krone)} ${r(dy - 0.4)} Z" fill="${S.lg(fein ? "jipiK" : "kroneK", fein ? [[0, "#cdbb8f"], [0.5, "#f3e7c6"], [1, "#fbf3dc"]] : [[0, "#b08440"], [0.5, "#e2bd78"], [1, "#f6dc9c"]], 0, 0, 1, 0)}"/>`;
    if (!fein) g += `<path d="M${dx} ${r(dy - kh - krone * 0.2)} L${dx} ${r(dy - kh * 0.55)}" stroke="#b08440" stroke-width=".3"/>`;
    /* Hutband */
    const hb = fein ? 0.9 : 1.3, yb = dy - 0.6 - hb;
    g += `<path d="M${r(dx - krone + 0.05)} ${r(dy - 0.6)} Q${dx} ${r(dy + ry * 0.25 - 0.4)} ${r(dx + krone - 0.05)} ${r(dy - 0.6)} L${r(dx + krone - 0.25)} ${r(yb)} Q${dx} ${r(yb + ry * 0.25)} ${r(dx - krone + 0.25)} ${r(yb)} Z" fill="${band}"/>`;
    if (!fein) { let zz = ""; for (let i = 0; i <= 10; i++) { const x = dx - krone + 0.4 + i * (2 * krone - 0.8) / 10; zz += `${i ? "L" : "M"}${r(x)} ${r(yb + hb * (i % 2 ? 0.25 : 0.75) + ry * 0.12)}`; } g += `<path d="${zz}" stroke="#f1c232" stroke-width=".3" fill="none"/>`; }
    return g;
  };
  const k = hut(-1.5, 2, 7.2, 3, S.lg("stroh", [[0, "#f2d79a"], [1, "#c99a4e"]]), "#c8102e", false) + hut(6.6, 12, 4.4, 2.2, "#efe2bf", "#1d1d1f", true);
  S.teil({ oben: true, id: "sombrero", de: "der Sombrero", syl: "Som-BRE-ro", it: "il sombrero", itSyl: "som-BRE-ro", en: "sombrero", x: X, y: Y, kunst: k,
    tipp: "Den breiten Sombrero kennt man aus ganz Mexiko. In Yucatán trägt man den feinen Jipi-Hut aus Palmstroh." });
}
/* DIE HÄNGEMATTE — zusammengerafftes buntes Netz, viele Schnüre („brazos“) laufen oben zur Schlaufe am Haken */
{
  const X = STAND.x1 - 4, Y = DACH + 1.6;
  let k = `<path d="M-.6 -.6 q.6 -1.4 1.2 0" stroke="#666" stroke-width=".5" fill="none"/><ellipse cx="0" cy="1.4" rx=".9" ry="1.2" fill="none" stroke="#f4efe2" stroke-width=".5"/>`;
  let schnuere = "";
  for (let i = 0; i < 16; i++) { const t = i / 15; schnuere += `M0 2.4 L${r(-2.8 + t * 5.6)} 13`; }
  k += `<path d="${schnuere}" stroke="#f4efe2" stroke-width=".18" opacity=".9"/>`;
  /* Netzbahn: gerafft, längs gestreift, unten wieder zusammengebunden */
  const bahn = `M-2.8 13 Q-3.8 26 -2.2 38 Q0 41 2.2 38 Q3.8 26 2.8 13 Q0 14.4 -2.8 13 Z`;
  k += `<path d="${bahn}" fill="${S.lg("haengematte", [[0, "#e63946"], [0.2, "#e63946"], [0.21, "#f4a261"], [0.4, "#f4a261"], [0.41, "#2a9d8f"], [0.6, "#2a9d8f"], [0.61, "#e9c46a"], [0.8, "#e9c46a"], [0.81, "#6a4c93"], [1, "#6a4c93"]], 0, 0, 1, 0)}"/>`;
  let netz = "";
  for (let y = 15; y < 38; y += 1.4) netz += `M-3 ${y} l1 .7 l1 -.7 l1 .7 l1 -.7 l1 .7 l1 -.7`;
  k += `<path d="${netz}" stroke="#fff" stroke-width=".15" opacity=".45" fill="none"/>`;
  k += `<path d="${bahn}" fill="${S.lg("mattefalten", [[0, "#000", 0.25], [0.5, "#fff", 0.1], [1, "#000", 0.2]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-1 39.6 L-1.6 45 M0 40 L0 46 M1 39.6 L1.6 45" stroke="#f4efe2" stroke-width=".4"/>`;
  S.teil({ oben: true, id: "haengematte", de: "die Hängematte", syl: "HÄN-ge-mat-te", it: "l'amaca", itSyl: "a-MA-ca", en: "hammock", x: X, y: Y + 26, kunst: `<g transform="translate(0 -26)">${k}</g>`,
    tipp: "In Yucatán schlafen viele Menschen in Hängematten – das ist kühler als ein Bett." });
}
/* DIE VERKÄUFERIN — Maya-Frau im Huipil: Blumenstickerei am viereckigen Ausschnitt und am Saum,
   darunter der Fustán mit Spitze; langes Haar zum Knoten gebunden, mit Band */
{
  const X = STAND.x0 + 52, Y = STAND.hinten - 1;
  const m = B.mensch({ id: "mex_verk", geschlecht: "w", alter: "erwachsen", pose: "stehen", blick: -24, frisur: "dutt", haarfarbe: "schwarz", haut: "mittel", laecheln: true, ohneSchatten: true,
    kleidung: { kleid: { stueck: "abendkleid", farbe: "#f7f4ec" }, oberteil: { stueck: "tshirt", farbe: "#f7f4ec" }, schuhe: { stueck: "sandale", farbe: "braun" } } }, 1.56 * sy(Y));
  const k0 = m.k, pk = (n) => [m.z.punkte[n][0] * k0, m.z.punkte[n][1] * k0];
  const [hx, hy] = pk("hals"), [slx] = pk("schulterL"), [srx] = pk("schulterR"), [, by] = pk("brust");
  const [hlx] = pk("huefteL"), [hrx] = pk("huefteR"), [, kny] = pk("knieL"), [, kny2] = pk("knoechelL");
  /* Haarknoten hinten mit rotem Band (hinter dem Kopf gezeichnet) */
  const [hkx, hky] = pk("hinterkopf");
  let hinten = `<ellipse cx="${r(hkx + 1.2)}" cy="${r(hky + 1.6)}" rx="2" ry="1.7" fill="#231a16"/><path d="M${r(hkx + 0.2)} ${r(hky + 0.6)} q1 1.6 2.4 .4" stroke="#c8102e" stroke-width=".6" fill="none"/>`;
  /* viereckiger Halsausschnitt mit gestickten Blumen */
  const ya = hy + 0.6, yb = by + 1.2, xa = srx * 0.62 + hx * 0.38, xb = slx * 0.62 + hx * 0.38;
  let st = `<path d="M${r(xa - 1)} ${r(ya)} L${r(xa - 1)} ${r(yb + 1)} L${r(xb + 1)} ${r(yb + 1)} L${r(xb + 1)} ${r(ya)}" stroke="#2f9e6e" stroke-width=".35" fill="none"/>`;
  const blume = (x, y, c) => `<circle cx="${r(x)}" cy="${r(y)}" r=".72" fill="${c}"/><circle cx="${r(x)}" cy="${r(y)}" r=".26" fill="#f9d64a"/>`;
  const farben = ["#d6336c", "#e8590c", "#7048e8", "#c2255c"];
  let n = 0;
  for (let y = ya + 0.8; y < yb; y += 1.6) st += blume(xa - 0.4, y, farben[n++ % 4]) + blume(xb + 0.4, y, farben[n++ % 4]);
  for (let x = xa + 1.2; x < xb - 0.6; x += 1.6) st += blume(x, yb + 0.5, farben[n++ % 4]);
  /* Saum des Huipil (Wadenmitte): Blumenband mit Blattranke */
  const ys = kny + (kny2 - kny) * 0.45, hb = Math.abs(hlx - hrx) * 0.62 + 2.2, hm = (hlx + hrx) / 2;
  st += `<path d="M${r(hm - hb)} ${r(ys - 1.4)} Q${r(hm)} ${r(ys - 0.8)} ${r(hm + hb)} ${r(ys - 1.4)}" stroke="#3b8f4a" stroke-width=".35" fill="none"/>`;
  for (let x = hm - hb + 0.8; x < hm + hb - 0.4; x += 1.7) st += blume(x, ys - 1.1 + (x - hm) * (x - hm) * -0.004, farben[n++ % 4]);
  st += `<path d="M${r(hm - hb)} ${r(ys)} Q${r(hm)} ${r(ys + 0.7)} ${r(hm + hb)} ${r(ys)}" stroke="#d9d3c3" stroke-width=".5" fill="none"/>`;
  /* Fustán: weißer Unterrock mit Spitzenkante über den Knöcheln */
  let sp = "";
  for (let x = hm - hb + 0.6; x < hm + hb - 0.4; x += 1.2) sp += `M${r(x)} ${r(kny2 - 2.2)} q.6 1 1.2 0`;
  st += `<path d="${sp}" stroke="#cfc8b6" stroke-width=".35" fill="none"/><path d="M${r(hm - hb + 0.6)} ${r(kny2 - 2.6)} H${r(hm + hb - 0.4)}" stroke="#e2dccd" stroke-width=".3" stroke-dasharray=".5 .4"/>`;
  const AY = Y - 30;
  S.hinten(`<g transform="translate(${r(X)} ${r(Y)})">${bildSchatten(X, Y, 1.56, 0.45, 0.2)}</g>`);
  S.teil({ id: "verkaeuferin", de: "die Verkäuferin", syl: "ver-KÄU-fe-rin", it: "la venditrice", itSyl: "ven-di-TRI-ce", en: "saleswoman", x: X, y: AY,
    kunst: `<g transform="translate(0 ${r(Y - AY)})" filter="${ABEND}">${hinten}${grob(m.svg, 0.5, 0.8, true)}${st}</g>`,
    tipp: "Sie trägt einen Huipil: ein weißes Kleid mit bunt gestickten Blumen – typisch für die Maya in Yucatán." });
}
/* DIE PIÑATA — Stern mit sieben Zacken, hängt an einer Schnur vom Dachbalken */
{
  const X = STAND.x0 + 7, Y = DACH + 11;
  let k = `<line x1="0" y1="${r(-11 - 3.2)}" x2="0" y2="-4.6" stroke="#d8c8a0" stroke-width=".35"/><circle cx="0" cy="-14.6" r=".5" fill="#666"/>`;
  k += `<circle cx="0" cy="0" r="4.6" fill="${S.rg("pinata", [[0, "#ffd43b"], [1, "#f08c00"]], 0.4, 0.35)}"/>`;
  const farben = ["#e64980", "#4c6ef5", "#40c057", "#fab005", "#f03e3e", "#15aabf", "#be4bdb"];
  for (let i = 0; i < 7; i++) {
    const a = -Math.PI / 2 + i * 2 * Math.PI / 7, c = Math.cos(a), sn = Math.sin(a);
    k += `<path d="M${r(c * 3.6 - sn * 1.6)} ${r(sn * 3.6 + c * 1.6)} L${r(c * 10)} ${r(sn * 10)} L${r(c * 3.6 + sn * 1.6)} ${r(sn * 3.6 - c * 1.6)} Z" fill="${farben[i]}"/>`;
    k += `<path d="M${r(c * 10)} ${r(sn * 10)} l${r(c * 1.6 - 0.6)} ${r(sn * 1.6 + 2.6)} M${r(c * 10)} ${r(sn * 10)} l${r(c * 1.6 + 0.6)} ${r(sn * 1.6 + 2.8)}" stroke="${farben[(i + 2) % 7]}" stroke-width=".5"/>`;
  }
  k += `<circle cx="0" cy="0" r="4.6" fill="none" stroke="#e64980" stroke-width=".6" stroke-dasharray="1 .8"/><ellipse cx="-1.4" cy="-1.6" rx="1.4" ry="1" fill="#fff" opacity=".35"/>`;
  S.teil({ oben: true, id: "pinata", de: "die Piñata", syl: "Pi-ÑA-ta", it: "la pignatta", itSyl: "pi-GNAT-ta", en: "piñata", x: X, y: Y, kunst: k,
    tipp: "Die Piñata ist mit Süßigkeiten gefüllt. Mit verbundenen Augen schlägt man sie auf." });
}

/* Abendlicht: warmer Schein von rechts (fängt nichts ab) */
S.davor(`<rect width="320" height="200" fill="${S.rg("abendlicht", [[0, "#ffcf86", 0.24], [0.5, "#ffcf86", 0.06], [1, "#ffcf86", 0]], 1, 0.45, 0.9)}"/>`);

/* der Reliefstein liegt über den langen Bodenschatten (sie fallen nicht durch ihn hindurch) */
S.hinten(STEIN);
/* Silbenschreibung einheitlich: nur die betonten Silben groß, alles andere klein */
const silben = (t) => { if (!t) return t; const st = t.split(/([- ])/); const gross = (x) => x.length && x === x.toUpperCase() && x !== x.toLowerCase(); const lang = st.some((x) => gross(x) && x.length > 1); return st.map((x) => (/^[- ]$/.test(x) ? x : (gross(x) && (x.length > 1 || !lang || /[À-ÖÙ-Ý]/.test(x)) ? x : x.toLowerCase()))).join(""); };
for (const t of S.teile) for (const u of [t, ...(t.unter || [])]) { u.syl = silben(u.syl); u.itSyl = silben(u.itSyl); }
const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/mexiko.js"));
console.log(aus);
