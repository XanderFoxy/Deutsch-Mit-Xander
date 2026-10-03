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
function kappe(p, x0 = -3, y0 = -3, x1 = 323, y1 = 203) {
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
  return `<path d="M${pts(q)} Z" fill="#26341a" opacity="${a}" filter="url(#bw_weich)"/>`;
};
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
S.def(`<pattern id="${S.id("gras")}" width="4" height="1.6" patternUnits="userSpaceOnUse"><rect width="4" height="1.6" fill="#6f9440"/><path d="M.4 1.6 l.2 -1 M1.6 1.6 l-.1 -.9 M2.7 1.6 l.25 -1.1 M3.5 1.6 l-.15 -.8" stroke="#7d9f4b" stroke-width=".22"/></pattern>`);
S.def(`<pattern id="${S.id("palapa")}" width="3" height="2.4" patternUnits="userSpaceOnUse"><rect width="3" height="2.4" fill="#b8955a"/><path d="M0 .4 Q1.5 1.4 3 .4 M-1.5 1.6 Q0 2.6 1.5 1.6 M1.5 1.6 Q3 2.6 4.5 1.6" stroke="#8a6a38" stroke-width=".35" fill="none"/><path d="M.6 0 L.9 2.4 M2.2 0 L2 2.4" stroke="#d2b47a" stroke-width=".2"/></pattern>`);
S.def(`<pattern id="${S.id("sarape")}" width="12" height="2.6" patternUnits="userSpaceOnUse"><rect width="12" height="2.6" fill="#b52d3a"/><rect y=".2" width="12" height=".3" fill="#f1c232"/><rect y=".6" width="12" height=".5" fill="#1e7a6e"/><rect y="1.2" width="12" height=".2" fill="#f4efe2"/><rect y="1.5" width="12" height=".4" fill="#e07a2a"/><rect y="2" width="12" height=".25" fill="#2c3f8f"/></pattern>`);
const WALD = `url(#${S.id("wald")})`;
const DUNST = `url(#${S.id("dunst")})`;
const LICHT = S.lg("kalklicht", [[0, "#f4cf8e"], [1, "#e4ae6a"]]);         /* Westseite im goldenen Abendlicht */
const SCHATTEN = S.lg("kalkschatten", [[0, "#aea596"], [1, "#958c7e"]]);  /* Nordseite im Schatten */

/* =====================================================================
   KULISSE — später Nachmittag: warmer Himmel, Wolken mit goldenen
   Rändern (Sonne rechts außerhalb), Wald, Rasen, lange Schatten, Weg
   ===================================================================== */
const W0 = 27.65, WT = 9.75, HT = 24, NT = 9, TH = HT / NT;
const KT = { x: 108, z: -46, h: 20, stufen: 4, sh: 3, tw: 10 };   /* Tempel der Krieger (an den Rand gerückt) */
{
  let k = `<rect width="320" height="${HY + 1}" fill="${S.lg("himmel", [[0, "#3c70b4"], [0.45, "#7ea9d2"], [0.78, "#e2c9a6"], [1, "#f4c48a"]])}"/>`;
  k += `<rect width="320" height="${HY + 1}" fill="${S.rg("abendsonne", [[0, "#ffe2a8", 0.9], [0.3, "#ffc978", 0.4], [1, "#ffc978", 0]], 1.05, 0.62, 0.75)}"/>`;
  for (const [x, y, w] of [[60, 34, 22], [96, 20, 14], [222, 26, 12], [30, 62, 10], [266, 44, 9]]) {
    k += `<ellipse cx="${x}" cy="${y + 2.4}" rx="${w * 1.25}" ry="${r(w * 0.22)}" fill="#b49aa6" opacity=".45" filter="${DUNST}"/>`;
    for (let i = 0; i < 4; i++) {
      const cx = x - w * 0.7 + i * w * 0.46, cy = y - Math.sin((i + 0.5) / 4 * Math.PI) * w * 0.3, rr = w * (0.28 + 0.12 * Math.sin((i + 0.5) / 4 * Math.PI));
      k += `<circle cx="${r(cx)}" cy="${r(cy)}" r="${r(rr)}" fill="#fbf1e2" opacity=".85" filter="${DUNST}"/>`;
      /* goldener Rand auf der Sonnenseite (rechts) */
      k += `<path d="M${r(cx + rr * 0.2)} ${r(cy - rr * 0.95)} A${r(rr)} ${r(rr)} 0 0 1 ${r(cx + rr * 0.9)} ${r(cy + rr * 0.3)}" stroke="#ffc46e" stroke-width="${r(rr * 0.22)}" fill="none" opacity=".75" filter="${DUNST}"/>`;
    }
  }
  /* Niedriger Trockenwald (Selva baja) rund um die Plaza */
  let d = `M0 ${HY + 1} L0 121`;
  for (let x = 0; x <= 320; x += 4) d += ` L${x} ${r(118 + Math.sin(x * 0.11) * 2 + Math.sin(x * 0.37) * 1.4 + rnd() * 2.2)}`;
  d += ` L320 ${HY + 1} Z`;
  k += `<path d="${d}" fill="${WALD}"/><path d="${d}" fill="${S.lg("waldluft", [[0, "#d6c4a8", 0.5], [1, "#5d7a47", 0.15]])}"/>`;
  /* Rasen der Großen Plaza, im warmen Streiflicht */
  k += `<rect x="0" y="${HY}" width="320" height="${200 - HY}" fill="url(#${S.id("gras")})"/>`;
  k += `<rect x="0" y="${HY}" width="320" height="${200 - HY}" fill="${S.lg("rasen", [[0, "#e6d29a", 0.5], [0.3, "#a8b35e", 0.15], [1, "#3f6a24", 0.25]])}"/>`;
  for (let i = 0; i < 12; i++) { const y = HY + 3 + Math.pow(rnd(), 1.3) * 62, x = rnd() * 320, s = sy(y); k += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(0.7 * s)}" ry="${r(0.1 * s)}" fill="#b8a76a" opacity=".22"/>`; }
  /* festgetretener Kalkboden (Sascab) unter den Händlerständen am Wegrand – dort steht auch der Esstisch */
  k += `<path d="M178 200 Q182 182 206 176 Q236 171 270 172 Q306 173 322 178 L322 200 Z" fill="${S.lg("sascab", [[0, "#d2bf94", 0.55], [1, "#c4ad7c", 0.85]])}" filter="${DUNST}"/>`;
  for (let i = 0; i < 26; i++) { const x = 186 + rnd() * 134, y = 176 + rnd() * 24; k += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(0.25 + rnd() * 0.4)}" ry=".18" fill="#9c8a62" opacity=".5"/>`; }
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
  /* ein herabgefallener Stein mit Relief (Federschlange) am Wegrand */
  {
    const sx0 = 96, sy0 = 186, s = sy(sy0), w = 0.9 * s, h = 0.42 * s, t = 0.18 * s;
    let g = bildSchatten(sx0, sy0, 0.42, 0.9, 0.3);
    g += `<path d="M${r(-w / 2)} 0 L${r(w / 2)} 0 L${r(w / 2)} ${r(-h)} L${r(-w / 2)} ${r(-h)} Z" fill="${S.lg("block", [[0, "#9a917f"], [1, "#e2cfa6"]], 0, 0, 1, 0)}"/>`;
    g += `<path d="M${r(-w / 2)} ${r(-h)} L${r(w / 2)} ${r(-h)} L${r(w / 2 - 2)} ${r(-h - t)} L${r(-w / 2 + 2.6)} ${r(-h - t)} Z" fill="#ead9b2"/>`;
    g += `<path d="M${r(-w / 2 + 2)} ${r(-h * 0.5)} q4 -4 8 0 t8 0 t8 0" stroke="#7d725e" stroke-width=".9" fill="none"/>`;
    for (let i = 0; i < 5; i++) g += `<path d="M${r(-w / 2 + 3 + i * 4.4)} ${r(-h * 0.22)} l1.4 -2.4 l1.4 2.4" stroke="#857a65" stroke-width=".5" fill="none"/>`;
    g += `<circle cx="${r(w / 2 - 4)}" cy="${r(-h * 0.6)}" r="1.4" fill="none" stroke="#7d725e" stroke-width=".6"/><circle cx="${r(w / 2 - 4)}" cy="${r(-h * 0.6)}" r=".5" fill="#6b604d"/>`;
    for (let i = 0; i < 7; i++) g += `<circle cx="${r(-w / 2 + rnd() * w)}" cy="${r(-rnd() * h)}" r="${r(0.3 + rnd() * 0.5)}" fill="#6f7a52" opacity=".5"/>`;
    k += `<g transform="translate(${sx0} ${sy0})">${g}</g>`;
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
    k += flaech([[CXk - b + 1, y0 + 1.4, CZk + b + 0.02], [CXk + b - 1, y0 + 1.4, CZk + b + 0.02], [CXk + b - 1, y0 + 2.4, CZk + b + 0.02], [CXk - b + 1, y0 + 2.4, CZk + b + 0.02]], "#7d7464", ` opacity=".5"`);
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
    tipp: "Oben vor dem Tempel der Krieger liegt die Steinfigur Chac Mool mit einer Schale auf dem Bauch." });

  /* Säulenreihen vor der Westseite: viereckige Pfeiler, Westseite im Licht, Nordseite im Schatten */
  const saeulen = [];
  for (let reihe = 0; reihe < 4; reihe++) for (let j = 0; j < 14; j++) saeulen.push([CXk - 26 - reihe * 3.6, CZk - 20 + j * 3.4]);
  saeulen.sort((a, b) => { const da = (a[0] - KAM.vx) * KAM.fx + (a[1] - KAM.vz) * KAM.fz, db = (b[0] - KAM.vx) * KAM.fx + (b[1] - KAM.vz) * KAM.fz; return db - da; });
  let sa = "";
  let anker = null;
  for (const [X, Z] of saeulen) {
    const [x] = P(X, 0, Z);
    if (x < -3 || x > 60) continue;
    sa += flaech([[X - 0.45, 0, Z - 0.45], [X - 0.45, 0, Z + 0.45], [X - 0.45, 3, Z + 0.45], [X - 0.45, 3, Z - 0.45]], "#ecc890");
    sa += flaech([[X - 0.45, 0, Z + 0.45], [X + 0.45, 0, Z + 0.45], [X + 0.45, 3, Z + 0.45], [X - 0.45, 3, Z + 0.45]], "#9c8f78");
    sa += flaech([[X - 0.55, 3, Z - 0.55], [X - 0.55, 3, Z + 0.55], [X - 0.55, 3.35, Z + 0.55], [X - 0.55, 3.35, Z - 0.55]], "#f2d8a8");
    if (!anker || x > anker[0]) anker = P(X, 1.6, Z);
  }
  S.teil({ id: "saeule", de: "die Säule", syl: "SÄU-le", it: "la colonna", itSyl: "co-LON-na", en: "column", x: anker[0], y: anker[1], kunst: um(anker[0], anker[1], sa),
    tipp: "Vor dem Tempel stehen so viele Säulen, dass man sie die „Tausend Säulen“ nennt." });
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
      if (Math.abs(u) > SB + BAL + 0.4) k += flaech([[u - 0.3, y1 - 0.45, w1 + 0.02], [u + 0.3, y1 - 0.45, w1 + 0.02], [u + 0.25, y1 - 0.45 - lang, w1 + 0.02], [u - 0.25, y1 - 0.45 - lang, w1 + 0.02]], "#3d3a33", ` opacity=".15"`);
      const v = (rnd() * 2 - 1) * (w1 - 1);
      if (Math.abs(v) > SB + BAL + 0.4) k += flaech([[-w1 - 0.02, y1 - 0.45, v - 0.3], [-w1 - 0.02, y1 - 0.45, v + 0.3], [-w1 - 0.02, y1 - 0.45 - lang, v + 0.25], [-w1 - 0.02, y1 - 0.45 - lang, v - 0.25]], "#7a5a34", ` opacity=".15"`);
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
    g += flaech([[xc - hw, 1.78, z0 + 3.12], [xc + hw, 1.78, z0 + 3.12], [xc + hw, 2.1, z0 + 3.3], [xc - hw, 2.1, z0 + 3.3]], DU);
    g += flaech([[xc - hw, 1.08, z0 + 2.95], [xc + hw, 1.08, z0 + 2.95], [xc + hw, 1.78, z0 + 3.12], [xc - hw, 1.78, z0 + 3.12]], LI);
    g += flaech([[xc - hw, 0, z0 + 2.95], [xc + hw, 0, z0 + 2.95], [xc + hw, 0.48, z0 + 3.0], [xc - hw, 0.48, z0 + 3.0]], LI);
    /* Maul: dunkel, oben zwei lange Fangzähne, unten kleinere */
    g += flaech([[xc - hw + 0.08, 0.5, z0 + 2.98], [xc + hw - 0.08, 0.5, z0 + 2.98], [xc + hw - 0.08, 1.08, z0 + 2.95], [xc - hw + 0.08, 1.08, z0 + 2.95]], "#2a1d14");
    for (const t of [-0.6, 0.6]) {
      g += flaech([[xc + t - 0.14, 1.08, z0 + 2.96], [xc + t + 0.14, 1.08, z0 + 2.96], [xc + t, 0.5, z0 + 3.0]], "#f1e4c6");
      g += flaech([[xc + t * 0.4 - 0.08, 0.5, z0 + 3.0], [xc + t * 0.4 + 0.08, 0.5, z0 + 3.0], [xc + t * 0.4, 0.74, z0 + 2.98]], "#f1e4c6");
    }
    /* Zunge hängt aus dem Maul über den Unterkiefer auf den Boden, gespalten */
    g += flaech([[xc - 0.24, 0.62, z0 + 3.0], [xc + 0.24, 0.62, z0 + 3.0], [xc + 0.26, 0.03, z0 + 3.02], [xc - 0.26, 0.03, z0 + 3.02]], lit ? "#c98250" : "#87796a");
    g += flaech([[xc - 0.26, 0.02, z0 + 3.02], [xc + 0.26, 0.02, z0 + 3.02], [xc + 0.3, 0.02, z0 + 3.7], [xc + 0.04, 0.02, z0 + 3.35], [xc - 0.04, 0.02, z0 + 3.35], [xc - 0.3, 0.02, z0 + 3.7]], lit ? "#c98250" : "#87796a");
    /* Nasenschnecke (hochgerollt) als Spirale auf der Seite */
    const [nx, ny] = P(xc - hw - 0.02, 2.12, z0 + 3.0);
    g += `<path d="M${r(nx - 0.9)} ${r(ny + 0.5)} q.2 -1.4 1.1 -1.3 q.9 .2 .6 1 q-.3 .6 -.8 .3" stroke="${DU}" stroke-width=".4" fill="none"/>`;
    /* Auge: eckige, tiefe Augenhöhle unter schwerem Brauenwulst */
    g += `<path d="M${pts([P(xc - hw - 0.02, 1.7, z0 + 1.55), P(xc - hw - 0.02, 1.7, z0 + 2.25), P(xc - hw - 0.02, 1.32, z0 + 2.2), P(xc - hw - 0.02, 1.32, z0 + 1.6)])} Z" fill="${lit ? "#7a5530" : "#5f5b51"}"/>`;
    g += `<path d="M${pts([P(xc - hw - 0.03, 1.98, z0 + 1.4), P(xc - hw - 0.03, 2.0, z0 + 2.4), P(xc - hw - 0.03, 1.78, z0 + 2.45), P(xc - hw - 0.03, 1.76, z0 + 1.45)])} Z" fill="${HE}"/>`;
    /* Federbusch hinter dem Kopf: senkrechte Federn mit runden Enden */
    for (let i = 0; i < 5; i++) { const z = z0 + 0.15 + i * 0.32; const [a, b] = [P(xc - hw - 0.03, 2.2, z), P(xc - hw - 0.03, 1.0, z + 0.05)]; g += `<path d="M${r(a[0])} ${r(a[1])} L${r(b[0])} ${r(b[1])}" stroke="${DU}" stroke-width=".55" stroke-linecap="round"/>`; }
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
      tipp: "Im März und September wirft die Sonne Dreiecke aus Licht auf die Treppe – wie eine Schlange, die herabkriecht." });
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
  /* Westeingang (eine Tür) */
  k += flaech([[-TW - 0.02, TY0 + 0.1, 1.2], [-TW - 0.02, TY0 + 0.1, -1.2], [-TW - 0.02, 27.4, -1.2], [-TW - 0.02, 27.4, 1.2]], "#3a2c1f");
  const [x0, y0] = P(0, 26, TW), [x1, y1] = P(-1.22, TY0, TW + 1.5), [x2] = P(1.22, TY0, TW + 1.5), sh = y1 - P(-1.22, 27.4, TW + 0.1)[1];
  const [ra, rb2] = [P(-TW - 0.3, TY0, TW + 1.4), P(TW + 0.3, 30.2, TW + 1.4)];
  const unter = [{ id: "schlangensaeule", de: "die Schlangensäule", syl: "SCHLAN-gen-säu-le", it: "la colonna serpentina", itSyl: "co-LON-na ser-pen-TI-na", en: "serpent column", x: x1, y: y1, kunst: [-1.22, 1.22].map((xs) => { const h = P(xs, TY0, TW + 1.5)[0], o = P(xs, 27.4, TW + 0.1)[0], a = Math.min(h, o) - 0.75, b = Math.max(h, o) + 0.75; return flaeche(a - x1, -sh, b - a, sh + 0.3, 0.2); }).join(""),
    tipp: "Zwei Säulen in Form von Schlangen tragen den Eingang: unten der Kopf, oben die Schwanzrassel." }];
  const zx = (ra[0] + rb2[0]) / 2, zyM = (y0 + y1) / 2 - 1;
  S.teil({ oben: true, id: "tempel", de: "der Tempel", syl: "TEM-pel", it: "il tempio", itSyl: "TEM-pio", en: "temple", x: x0, y: y0, kunst: um(x0, y0, k),
    zoom: { x: r(zx - 15), y: r(zyM - 10), w: 30, h: 20 },
    unter,
    tipp: "Oben auf der Pyramide steht ein Tempel für Kukulcán. Sein Eingang zeigt nach Norden." });
}

/* =====================================================================
   5 — DER KAPOKBAUM (Ceiba) links vom Stand: hoher glatter Stamm mit
       Brettwurzeln, Äste in Stockwerken, flache lockere Laubschirme
   ===================================================================== */
{
  const X = 237, Y = 141, s = sy(Y);            /* ≈ 5,6 Einheiten je Meter */
  let k = bildSchatten(X, Y, 18, 1.6, 0.18);
  /* Brettwurzeln */
  k += `<path d="M-13 0 Q-7 -1 -4.4 -7 L-3 -12 L3 -12 L4.6 -7 Q8 -1 15 0 Q8 .6 5 -.6 Q2 1 0 -.4 Q-2 1 -5 -.6 Q-8 .6 -13 0 Z" fill="${S.lg("wurzel", [[0, "#5b6650"], [0.5, "#7f8a72"], [1, "#b9b498"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-9 -.4 Q-5 -2 -3.6 -8 M9.6 -.3 Q5.6 -2 3.8 -8" stroke="#4d5743" stroke-width=".5" fill="none" opacity=".6"/>`;
  /* Stamm: glatt, graugrün, Licht von rechts; geht oben in die Hauptäste über */
  const TOP = -14 * s;
  k += `<path d="M-3 -11 Q-2.6 -40 -2.2 ${r(TOP + 6)} Q-2.4 ${r(TOP + 2)} -5 ${r(TOP - 1)} L-1.2 ${r(TOP - 2)} L1.6 ${r(TOP - 4)} L2.6 ${r(TOP - 1.5)} L6 ${r(TOP)} Q2.6 ${r(TOP + 2)} 2.4 ${r(TOP + 6)} Q2.8 -40 3.2 -11 Z" fill="${S.lg("ceiba", [[0, "#55604a"], [0.45, "#7c866c"], [0.8, "#b8b294"], [1, "#9a9a82"]], 0, 0, 1, 0)}"/>`;
  for (let i = 0; i < 7; i++) { const y = -16 - rnd() * (-TOP - 22); k += `<path d="M${r(-1.6 + rnd() * 3.2)} ${r(y)} q.3 -3 0 -5" stroke="#5a6450" stroke-width=".4" fill="none" opacity=".55"/>`; }
  /* Hauptäste: fast waagrecht, an den Enden die Laubschirme (zwei Stockwerke) */
  const aeste = [[-5, TOP - 1, -38, TOP - 8], [6, TOP, 34, TOP - 6], [-1.2, TOP - 2, -20, TOP - 22], [1.6, TOP - 4, 22, TOP - 24], [0, TOP - 3, 2, TOP - 34]];
  for (const [ax, ay, ex, ey] of aeste) k += `<path d="M${ax} ${r(ay)} Q${r((ax + ex) / 2)} ${r(ay - 1)} ${ex} ${r(ey)}" stroke="#7a836a" stroke-width="${ey < TOP - 20 ? 1.1 : 1.6}" fill="none" stroke-linecap="round"/>`;
  const KR = S.lg("krone", [[0, "#2f4a24"], [0.55, "#4e6f30"], [1, "#9aaa52"]], 0, 0, 1, 0);
  const schirm = (cx, cy, rx, ry) => {
    let g = "";
    /* locker: einzelne Laubbüschel mit Lücken, unten dunkel, oben rechts goldenes Licht */
    for (let i = 0; i < 11; i++) {
      const t = i / 10, x = cx - rx + t * rx * 2, y = cy - Math.sin(t * Math.PI) * ry * 0.6 + (rnd() - 0.5) * ry * 0.4;
      if (rnd() < 0.15) continue;
      g += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(rx * (0.16 + rnd() * 0.08))}" ry="${r(ry * (0.5 + rnd() * 0.25))}" fill="${KR}"/>`;
    }
    g += `<path d="M${r(cx - rx * 0.9)} ${r(cy + ry * 0.15)} Q${cx} ${r(cy + ry * 0.9)} ${r(cx + rx * 0.9)} ${r(cy + ry * 0.15)}" stroke="#1f3218" stroke-width="${r(ry * 0.5)}" fill="none" opacity=".35"/>`;
    return g;
  };
  k += schirm(-38, TOP - 9, 16, 5) + schirm(34, TOP - 7, 13, 4.5) + schirm(-20, TOP - 23, 14, 4.5) + schirm(22, TOP - 25, 12, 4.2) + schirm(2, TOP - 35, 15, 5);
  const ax0 = 0, ay0 = -60;   /* Bezugspunkt: Stamm über dem Dach */
  S.teil({ id: "kapokbaum", de: "der Kapokbaum", syl: "KA-pok-baum", it: "la ceiba", itSyl: "CEI-ba", en: "kapok tree", x: X + ax0, y: Y + ay0, kunst: `<g transform="translate(${-ax0} ${-ay0})">${k}</g>`,
    tipp: "Für die Maya war der Kapokbaum (Ceiba) heilig: Er verbindet Himmel, Erde und Unterwelt." });
}

/* =====================================================================
   6 — DIE TOURISTEN (Besucher zur Tagundnachtgleiche, mit Führerin und
       Schirm) — im Raum maßstäblich, lange Schatten nach links
   ===================================================================== */
{
  const figur = (x, y, kl, haut, hut, arm) => {
    const s = sy(y), h = 1.7 * s;
    let g = bildSchatten(x, y, 1.7, 0.45, 0.22).replace("<path", `<path transform="translate(${r(x)} ${r(y)})"`);
    const X = (v) => r(x + v * s), Y = (v) => r(y - v * s);
    g += `<path d="M${X(-0.1)} ${Y(0)} L${X(-0.08)} ${Y(0.82)} M${X(0.1)} ${Y(0)} L${X(0.08)} ${Y(0.82)}" stroke="${kl[1]}" stroke-width="${r(0.13 * s)}" stroke-linecap="round"/>`;
    g += `<path d="M${X(-0.2)} ${Y(0.8)} L${X(0.2)} ${Y(0.8)} L${X(0.22)} ${Y(1.42)} Q${X(0)} ${Y(1.5)} ${X(-0.22)} ${Y(1.42)} Z" fill="${kl[0]}"/>`;
    g += `<path d="M${X(0.14)} ${Y(1.4)} L${X(0.04)} ${Y(1.4)} L${X(0.04)} ${Y(0.85)} L${X(0.2)} ${Y(0.85)} Z" fill="#000" opacity=".12"/>`;
    g += `<path d="M${X(-0.2)} ${Y(1.38)} l${r(arm[0] * s)} ${r(-arm[1] * s)} M${X(0.2)} ${Y(1.38)} l${r(arm[2] * s)} ${r(-arm[3] * s)}" stroke="${haut}" stroke-width="${r(0.08 * s)}" stroke-linecap="round"/>`;
    g += `<circle cx="${X(0)}" cy="${Y(1.58)}" r="${r(0.11 * s)}" fill="${haut}"/>`;
    if (hut) g += `<ellipse cx="${X(0)}" cy="${Y(1.67)}" rx="${r(0.2 * s)}" ry="${r(0.04 * s)}" fill="${hut}"/><path d="M${X(-0.1)} ${Y(1.66)} a${r(0.1 * s)} ${r(0.09 * s)} 0 0 1 ${r(0.2 * s)} 0 Z" fill="${hut}"/>`;
    else g += `<path d="M${X(-0.11)} ${Y(1.6)} a${r(0.11 * s)} ${r(0.11 * s)} 0 0 1 ${r(0.22 * s)} 0 Z" fill="#3a2a1e"/>`;
    /* goldener Lichtsaum rechts (Sonne im Westen) */
    g += `<path d="M${X(0.21)} ${Y(1.4)} L${X(0.2)} ${Y(0.82)}" stroke="#ffe0a6" stroke-width="${r(0.03 * s)}" opacity=".8"/>`;
    return g;
  };
  let k = "";
  /* Gruppe 1 links am Weg (Familie), Gruppe 2 mit der Führerin und dem Schirm, Gruppe 3 vor der Westseite */
  k += figur(36, 146, ["#f4f1e8", "#5a6a8a"], "#d9a37a", "#e9e2c8", [-0.1, -0.5, 0.1, -0.5]) + figur(42, 146.6, ["#2f8fbf", "#e9e2d0"], "#a87050", null, [-0.12, -0.5, 0.25, 0.1]);
  k += figur(48, 147.4, ["#f4f1e8", "#f4f1e8"], "#e8bf9a", "#f1e9d2", [-0.1, -0.5, 0.1, -0.5]);
  k += figur(118, 149, ["#f4f1e8", "#3f4a5a"], "#c99062", "#2f6a3e", [-0.1, -0.45, 0.3, 0.55]);
  /* Schirm der Führerin (damit die Gruppe sie findet) */
  { const s = sy(149), x = 118 + 0.5 * s, y = 149 - 1.93 * s; k += `<line x1="${r(x)}" y1="${r(y)}" x2="${r(x)}" y2="${r(y - 0.6 * s)}" stroke="#444" stroke-width=".25"/><path d="M${r(x - 0.5 * s)} ${r(y - 0.5 * s)} Q${r(x)} ${r(y - 0.85 * s)} ${r(x + 0.5 * s)} ${r(y - 0.5 * s)} Z" fill="#e8590c"/>`; }
  k += figur(126, 148.4, ["#f4f1e8", "#e9e2d0"], "#e0b48c", "#f1e9d2", [-0.12, -0.5, 0.12, -0.5]) + figur(132.6, 148.8, ["#c2255c", "#2a3a5a"], "#8a5a3b", null, [-0.12, -0.5, 0.12, -0.5]);
  k += figur(188, 144.6, ["#f4f1e8", "#f4f1e8"], "#d7a179", null, [-0.2, 0.45, 0.12, -0.5]) + figur(194, 145, ["#7fb3d5", "#3f4a5a"], "#e8bf9a", "#f1e9d2", [-0.12, -0.5, 0.12, -0.5]);
  const [ax, ay] = [126, 140];
  S.teil({ id: "touristen", de: "die Touristen", syl: "Tou-RIS-ten", it: "i turisti", itSyl: "tu-RI-sti", en: "tourists", x: ax, y: ay, kunst: um(ax, ay, k),
    tipp: "Zur Tagundnachtgleiche kommen Tausende Besucher, um die Schlange aus Licht zu sehen. Hinaufklettern darf man nicht." });
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
    for (let t = 0.2; t < 0.9; t += 0.12) for (const sg of [-1, 1]) { const wx = (t < 0.55 ? 1 - t / 0.55 * 0.25 : 0.75 * (1 - (t - 0.55) / 0.45)) * w * 0.97; z += `M${r(tx * t + sg * nx * wx)} ${r(H0 + (ty - H0) * t + sg * ny * wx)} l${r(sg * nx * 0.7)} ${r(sg * ny * 0.7 - 0.2)}`; }
    k += `<path d="${z}" stroke="#4a3a24" stroke-width=".3"/>`;
    k += `<path d="M${r(tx)} ${r(ty)} l${r(tx / len * 1.8)} ${r((ty - H0) / len * 1.8)}" stroke="#2e2416" stroke-width=".5" stroke-linecap="round"/>`;
  }
  S.teil({ id: "agave", de: "die Agave", syl: "A-GA-ve", it: "l'agave", itSyl: "a-GA-ve", en: "agave", x: X, y: Y - 0.7 * s, kunst: `<g transform="translate(0 ${r(0.7 * s)})">${k}</g>`,
    tipp: "Aus den Fasern der Agave Henequén macht man in Yucatán Seile und Hängematten." });
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
  g += `<path d="M${r(-L * 0.05)} -1.4 l-1 1.5 m1.8 -1.4 l.6 1.4 M${r(L * 0.12)} -1.4 l.9 1.4" stroke="#4a4840" stroke-width=".8" stroke-linecap="round"/>`;
  g += `<path d="M${r(-L * 0.2)} -3.2 Q${r(L * 0.05)} -3.9 ${r(L * 0.32)} -3.3" stroke="#f0d8a0" stroke-width=".4" fill="none" opacity=".7"/>`;
  g += `<path d="M${r(-L * 0.22)} -.4 L${r(L * 0.3)} -.4 L${r(L * 0.3 - 20)} .2 L${r(-L * 0.22 - 18)} .2 Z" fill="#26341a" opacity=".22"/>`;
  S.teil({ oben: true, id: "leguan", de: "der Leguan", syl: "LE-gu-an", it: "l'iguana", itSyl: "i-GUA-na", en: "iguana", x: sx0 + 2, y: sy0 - h - t * 0.55, kunst: g,
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
    tischUnter.push({ id: "tortilla", de: "die Tortilla", syl: "Tor-TIL-la", it: "la tortilla", itSyl: "tor-TI-glia", en: "tortilla", x: TI.x + x, y: TI.y + y, kunst: flaeche(-6.4, -6.8, 12.8, 7, 0.4),
      tipp: "Tortillas sind dünne Fladen aus Maismehl – frisch und warm im Tuch." });
  }
  /* DER TACO — drei weiche, gefaltete Maistortillas mit Cochinita pibil und rosa Zwiebeln */
  {
    const x = 3, y = y0 + 0.4;
    let g = `<ellipse cx="${x}" cy="${y - 0.4}" rx="6" ry="1.5" fill="#f4f1ea" stroke="#5b8fd6" stroke-width=".35"/>`;
    for (const dx of [-3.2, 0, 3.2]) {
      /* dünne Tortilla, U-förmig gefaltet; hinten sieht man die Füllung */
      g += `<path d="M${x + dx - 2.4} ${y - 0.9} Q${x + dx - 2.2} ${y - 3.6} ${x + dx} ${y - 3.9} Q${x + dx + 2.2} ${y - 3.6} ${x + dx + 2.4} ${y - 0.9} Q${x + dx} ${y - 0.4} ${x + dx - 2.4} ${y - 0.9} Z" fill="#b45a2c"/>`;
      for (let i = 0; i < 6; i++) g += `<path d="M${r(x + dx - 1.6 + i * 0.6)} ${r(y - 3.3 + (i % 2) * 0.3)} l.3 .9" stroke="#8a3c1a" stroke-width=".2"/>`;
      g += `<path d="M${x + dx - 1.4} ${y - 3.3} q.5 -.4 1 0 M${x + dx + 0.2} ${y - 3.5} q.5 -.4 1 0 M${x + dx - 0.6} ${y - 2.9} q.5 -.4 1 0" stroke="#f08cb8" stroke-width=".3" fill="none"/>`;
      g += `<path d="M${x + dx - 2.4} ${y - 0.9} Q${x + dx - 2.6} ${y - 2.6} ${x + dx - 1.6} ${y - 2.6} Q${x + dx} ${y - 1.6} ${x + dx + 1.6} ${y - 2.6} Q${x + dx + 2.6} ${y - 2.6} ${x + dx + 2.4} ${y - 0.9} Q${x + dx} ${y - 0.2} ${x + dx - 2.4} ${y - 0.9} Z" fill="#efd8a0" stroke="#d2b06c" stroke-width=".12"/>`;
      for (let i = 0; i < 4; i++) g += `<circle cx="${r(x + dx - 1.4 + i * 0.9)}" cy="${r(y - 1.3 - (i % 2) * 0.5)}" r=".18" fill="#b98a46" opacity=".8"/>`;
    }
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
    tischUnter.push({ id: "guacamole", de: "die Guacamole", syl: "Gu-a-ca-MO-le", it: "il guacamole", itSyl: "gua-ca-MO-le", en: "guacamole", x: TI.x + x, y: TI.y + y, kunst: flaeche(-4.2, -5.4, 8.4, 5.8, 0.4),
      tipp: "Guacamole ist zerdrückte Avocado mit Limette, Zwiebel und Chili – im Steinmörser Molcajete." });
  }
  /* DIE AVOCADO — eine halbe mit Kern und eine ganze, ganz auf der Platte */
  {
    const x = -15.4, y = y0 - 3;
    let g = `<ellipse cx="${x - 2.4}" cy="${y - 1.4}" rx="1.6" ry="2" fill="#2f4a1c" transform="rotate(-30 ${x - 2.4} ${y - 1.4})"/>`;
    g += `<path d="M${x} ${y} Q${x - 2.2} ${y - 0.4} ${x - 2} ${y - 2.6} Q${x - 1.4} ${y - 4.4} ${x + 0.2} ${y - 4.2} Q${x + 2} ${y - 3.8} ${x + 2} ${y - 1.6} Q${x + 1.8} ${y + 0.2} ${x} ${y} Z" fill="#355e1e"/>`;
    g += `<path d="M${x} ${y - 0.5} Q${x - 1.6} ${y - 0.8} ${x - 1.4} ${y - 2.6} Q${x - 1} ${y - 3.8} ${x + 0.2} ${y - 3.6} Q${x + 1.5} ${y - 3.3} ${x + 1.4} ${y - 1.6} Q${x + 1.3} ${y - 0.4} ${x} ${y - 0.5} Z" fill="#d8e88a"/>`;
    g += `<circle cx="${x}" cy="${y - 1.8}" r=".95" fill="#8a5a2a"/><circle cx="${x - 0.3}" cy="${y - 2.1}" r=".3" fill="#c48a52"/>`;
    k += g;
    tischUnter.push({ id: "avocado", de: "die Avocado", syl: "A-vo-CA-do", it: "l'avocado", itSyl: "a-vo-CA-do", en: "avocado", x: TI.x + x, y: TI.y + y, kunst: flaeche(-4.4, -4.8, 7, 5.2, 0.4),
      tipp: "Die Avocado stammt aus Mexiko. Schon die Maya und Azteken haben sie gegessen." });
  }
  /* DIE LIMETTE — halbiert und ganz, auf der Platte neben dem Mörser */
  {
    const x = 7.2, y = y0 - 4.6;
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
    tipp: "Zu Mittag isst die Verkäuferin an ihrem Tisch: Tacos, Tortillas und Guacamole." });
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
  k += `<path d="M${x0 + 4} ${r(th)} L${xt1} ${r(th)} L${xt1 - 2} ${r(th - 6)} L${x0 + 7} ${r(th - 6)} Z" fill="${S.lg("tischplatte", [[0, "#e9dfc8"], [1, "#f6efdc"]])}"/>`;
  k += `<path d="M${x0 + 4} ${r(th)} L${xt1} ${r(th)} L${xt1} ${r(tv - 3)} Q${(x0 + xt1) / 2} ${r(tv - 1)} ${x0 + 4} ${r(tv - 3)} Z" fill="#f4eee0"/>`;
  for (let x = x0 + 7; x < xt1 - 2; x += 5.2) { const y = tv - 7; k += `<circle cx="${r(x)}" cy="${r(y)}" r="1.3" fill="${["#d6336c", "#f28c28", "#2f9e6e", "#7048e8"][Math.round(x) % 4]}"/><circle cx="${r(x)}" cy="${r(y)}" r=".5" fill="#f9d64a"/><path d="M${r(x - 2.6)} ${r(y + 0.3)} q1.3 -1 2.6 0 M${r(x)} ${r(y + 0.3)} q1.3 1 2.6 0" stroke="#3b8f4a" stroke-width=".4" fill="none"/>`; }
  k += `<rect x="${x0 + 4}" y="${r(tv - 4)}" width="${xt1 - x0 - 4}" height="1" fill="#c8102e"/>`;
  let spitze = "";
  for (let x = x0 + 4; x < xt1; x += 1.6) spitze += `<path d="M${r(x)} ${r(tv - 3)} q.8 1.3 1.6 0" stroke="#f4eee0" stroke-width=".35" fill="none"/>`;
  k += spitze;
  const yT = th - 1.4;
  /* DIE MASKE — zwei geschnitzte Maya-Holzmasken (eine naturbelassen, eine jadegrün bemalt):
     Kopfschmuck mit Federn, Mandelaugen, kräftige Nase, Ohrpflöcke */
  {
    let g = "";
    for (const [x, holz, dunkel, schmuck] of [[x0 + 9, "#b07a45", "#6e4422", "#2f8f6a"], [x0 + 16.4, "#3f8f72", "#1f5a46", "#c8402e"]]) {
      const yo = yT - 0.2;
      g += `<path d="M${r(x - 3)} ${r(yo - 5.6)} Q${r(x - 3.3)} ${r(yo - 1.6)} ${r(x - 1.4)} ${r(yo)} L${r(x + 1.4)} ${r(yo)} Q${r(x + 3.3)} ${r(yo - 1.6)} ${r(x + 3)} ${r(yo - 5.6)} Z" fill="${holz}"/>`;
      g += `<path d="M${r(x - 3)} ${r(yo - 5.6)} Q${r(x - 3.3)} ${r(yo - 1.6)} ${r(x - 1.4)} ${r(yo)} L${r(x - 0.6)} ${r(yo)} Q${r(x - 2.4)} ${r(yo - 2)} ${r(x - 2.2)} ${r(yo - 5.6)} Z" fill="${dunkel}" opacity=".45"/>`;
      /* Kopfschmuck: Stirnband und drei Federn */
      g += `<path d="M${r(x - 3.4)} ${r(yo - 5.4)} L${r(x + 3.4)} ${r(yo - 5.4)} L${r(x + 3)} ${r(yo - 6.6)} L${r(x - 3)} ${r(yo - 6.6)} Z" fill="${schmuck}"/>`;
      g += `<path d="M${r(x - 2.2)} ${r(yo - 6.6)} q-.8 -1.6 -.2 -2.6 q.9 1 .9 2.6 Z M${r(x - 0.5)} ${r(yo - 6.6)} q-.3 -2 .5 -3.1 q.8 1.1 .5 3.1 Z M${r(x + 1.4)} ${r(yo - 6.6)} q.1 -1.6 .9 -2.6 q.5 1 -.2 2.6 Z" fill="#f1c232"/>`;
      g += `<circle cx="${r(x)}" cy="${r(yo - 6)}" r=".45" fill="#f4ead2"/>`;
      /* Mandelaugen, Brauen, Nase, Mund, Ohrpflöcke */
      g += `<path d="M${r(x - 2.3)} ${r(yo - 3.9)} q.8 -.8 1.6 0 q-.8 .45 -1.6 0 Z M${r(x + 0.7)} ${r(yo - 3.9)} q.8 -.8 1.6 0 q-.8 .45 -1.6 0 Z" fill="#1a120a"/>`;
      g += `<path d="M${r(x - 2.5)} ${r(yo - 4.7)} q1 -.6 2 0 M${r(x + 0.5)} ${r(yo - 4.7)} q1 -.6 2 0" stroke="${dunkel}" stroke-width=".35" fill="none"/>`;
      g += `<path d="M${r(x - 0.3)} ${r(yo - 4.2)} L${r(x - 0.7)} ${r(yo - 2.3)} Q${r(x)} ${r(yo - 1.9)} ${r(x + 0.7)} ${r(yo - 2.3)} L${r(x + 0.3)} ${r(yo - 4.2)} Z" fill="${dunkel}" opacity=".55"/>`;
      g += `<path d="M${r(x - 1.1)} ${r(yo - 1.2)} h2.2" stroke="#1a120a" stroke-width=".45"/>`;
      g += `<circle cx="${r(x - 3.3)}" cy="${r(yo - 3)}" r=".75" fill="${schmuck}"/><circle cx="${r(x + 3.3)}" cy="${r(yo - 3)}" r=".75" fill="${schmuck}"/><circle cx="${r(x - 3.3)}" cy="${r(yo - 3)}" r=".28" fill="#f4ead2"/><circle cx="${r(x + 3.3)}" cy="${r(yo - 3)}" r=".28" fill="#f4ead2"/>`;
    }
    k += g;
    standUnter.push({ id: "maske", de: "die Maske", syl: "MAS-ke", it: "la maschera", itSyl: "MA-sche-ra", en: "mask", x: x0 + 12.7, y: yT, kunst: flaeche(-7.4, -9.6, 14.8, 10, 0.5),
      tipp: "In den Maya-Dörfern rund um Chichén Itzá schnitzen Handwerker Masken aus Holz und bemalen sie." });
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
      tipp: "Zum Tag der Toten schmückt man Altäre mit bunten Totenköpfen aus Zucker und orangen Studentenblumen." });
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
    const x = x0 + 39.4;
    let g = "";
    for (const [dx, rot, c] of [[-1.4, -20, "#c8102e"], [1.6, 16, "#2f9e6e"]]) g += `<g transform="translate(${x + dx} ${r(yT)}) rotate(${rot})"><rect x="-.45" y="-3.6" width=".9" height="3.6" rx=".4" fill="#8a5a2a"/><ellipse cx="0" cy="-6" rx="2.3" ry="2.7" fill="${c}"/><path d="M-2.1 -6.2 q2.1 1.4 4.2 0" stroke="#f1c232" stroke-width=".5" fill="none"/><path d="M-1.8 -5.1 q1.8 .9 3.6 0" stroke="#fff" stroke-width=".3" fill="none"/><ellipse cx="-.8" cy="-6.9" rx=".6" ry=".9" fill="#fff" opacity=".35"/></g>`;
    k += g;
    standUnter.push({ id: "rassel", de: "die Rassel", syl: "RAS-sel", it: "la maraca", itSyl: "ma-RA-ca", en: "maraca", x, y: yT, kunst: flaeche(-4.6, -9.6, 9.6, 10, 0.5),
      tipp: "Die Rasseln heißen auf Spanisch Maracas. In ihnen klappern Samen." });
  }
  /* DIE FLAGGE — Papierfähnchen Mexikos im Tonbecher (Adler auf dem Nopal mit Schlange) */
  {
    const x = x0 + 4.4;
    let g = `<path d="M${x - 1.6} ${r(yT)} L${x + 1.6} ${r(yT)} L${x + 1.9} ${r(yT - 3)} L${x - 1.9} ${r(yT - 3)} Z" fill="#a85a32"/><path d="M${x - 1.9} ${r(yT - 3)} L${x + 1.9} ${r(yT - 3)}" stroke="#f1c232" stroke-width=".35"/>`;
    for (const [dx, rot] of [[-0.4, -9], [0.6, 7]]) {
      g += `<g transform="translate(${r(x + dx)} ${r(yT - 2.6)}) rotate(${rot})"><line x1="0" y1="0" x2="0" y2="-11" stroke="#7a5532" stroke-width=".25"/>`;
      g += `<rect x="0" y="-11" width="2.4" height="4" fill="#006847"/><rect x="2.4" y="-11" width="2.4" height="4" fill="#f6f3ea"/><rect x="4.8" y="-11" width="2.4" height="4" fill="#ce1126"/>`;
      /* Wappen: Nopal (grün), Adler (braun, Flügel offen), Schlange im Schnabel */
      g += `<path d="M3.1 -7.6 q.5 -.6 1 0 M3.6 -7.6 v-.6" stroke="#2b8a3e" stroke-width=".28" fill="none"/><ellipse cx="3.6" cy="-8.4" rx=".42" ry=".3" fill="#2b8a3e"/>`;
      g += `<path d="M2.9 -9.4 l.7 .5 l.7 -.5 l-.2 .7 l-.5 .5 l-.5 -.5 Z" fill="#7a4a22"/><circle cx="3.75" cy="-9.55" r=".18" fill="#7a4a22"/><path d="M3.95 -9.5 q.4 .2 .3 .5 q-.2 .2 .1 .4" stroke="#3b8f4a" stroke-width=".12" fill="none"/></g>`;
    }
    k += g;
    standUnter.push({ id: "flagge", de: "die Flagge", syl: "FLAG-ge", it: "la bandiera", itSyl: "ban-DIE-ra", en: "flag", x, y: yT, kunst: flaeche(-2.2, -15.2, 10, 15.4, 0.5),
      tipp: "Auf der Flagge Mexikos sitzt ein Adler auf einem Kaktus und hält eine Schlange im Schnabel." });
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
    /* am Nagel hängend, leicht nach vorn gekippt: Krempe als Ellipse, die Krone ragt zum Betrachter (man sieht ihre Seite) */
    const ry = R * 0.86, hk = krone * (fein ? 0.7 : 1.05), kt = fein ? krone * 0.92 : krone * 0.72;
    let g = `<line x1="${dx}" y1="${r(dy - ry - 1.6)}" x2="${dx}" y2="${r(dy - ry + 0.6)}" stroke="#d8c8a0" stroke-width=".3"/><circle cx="${dx}" cy="${r(dy - ry - 1.8)}" r=".45" fill="#666"/>`;
    g += `<ellipse cx="${r(dx + 0.8)}" cy="${r(dy + 1.3)}" rx="${R}" ry="${r(ry)}" fill="#2a1410" opacity=".3"/>`;
    g += `<ellipse cx="${dx}" cy="${dy}" rx="${R}" ry="${r(ry)}" fill="${stroh}"/>`;
    g += `<ellipse cx="${dx}" cy="${dy}" rx="${r(R - 0.5)}" ry="${r(ry - 0.5)}" fill="none" stroke="${fein ? "#c9b483" : "#9a6c2e"}" stroke-width="${fein ? ".2" : ".45"}" opacity=".7"/>`;
    for (let i = 1; i < (fein ? 5 : 3); i++) { const f = krone / R + (1 - krone / R) * i / (fein ? 5 : 3); g += `<ellipse cx="${dx}" cy="${r(dy + (1 - f) * 0.6)}" rx="${r(R * f)}" ry="${r(ry * f)}" fill="none" stroke="#a07a3c" stroke-width=".14" opacity=".45"/>`; }
    if (!fein) for (let a = 0; a < 16; a++) { const w = a * Math.PI / 8; g += `<line x1="${r(dx + Math.cos(w) * krone)}" y1="${r(dy + Math.sin(w) * krone * 0.86)}" x2="${r(dx + Math.cos(w) * (R - 0.7))}" y2="${r(dy + Math.sin(w) * (ry - 0.7))}" stroke="#b08440" stroke-width=".18" opacity=".55"/>`; }
    /* Krone: Seitenwand (im Schatten) vom Band bis zur Kuppe, die tiefer liegt */
    g += `<path d="M${r(dx - krone)} ${dy} L${r(dx - kt)} ${r(dy + hk)} A${r(kt)} ${r(kt * 0.8)} 0 0 0 ${r(dx + kt)} ${r(dy + hk)} L${r(dx + krone)} ${dy} Z" fill="${fein ? "#d7c59a" : "#b98a44"}"/>`;
    g += `<path d="M${r(dx - krone - 0.05)} ${r(dy + 0.1)} A${r(krone + 0.05)} ${r(krone * 0.8)} 0 0 0 ${r(dx + krone + 0.05)} ${r(dy + 0.1)} L${r(dx + krone - 0.1)} ${r(dy + 1)} A${krone} ${r(krone * 0.8)} 0 0 1 ${r(dx - krone + 0.1)} ${r(dy + 1)} Z" fill="${band}"/>`;
    g += `<ellipse cx="${dx}" cy="${r(dy + hk)}" rx="${r(kt)}" ry="${r(kt * 0.8)}" fill="${S.rg(fein ? "jipi" : "krone2", fein ? [[0, "#fbf3dc"], [1, "#e2d1a6"]] : [[0, "#f6dc9c"], [1, "#c99a4e"]], 0.4, 0.35)}"/>`;
    if (!fein) g += `<path d="M${r(dx - kt * 0.7)} ${r(dy + hk)} Q${dx} ${r(dy + hk - kt * 0.5)} ${r(dx + kt * 0.7)} ${r(dy + hk)}" stroke="#a87c3a" stroke-width=".3" fill="none"/>`;
    g += `<ellipse cx="${r(dx + kt * 0.3)}" cy="${r(dy + hk - kt * 0.3)}" rx="${r(kt * 0.35)}" ry="${r(kt * 0.2)}" fill="#fff" opacity=".35"/>`;
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
  const m = B.mensch({ id: "mex_verk", geschlecht: "w", alter: "erwachsen", pose: "stehen", blick: -24, frisur: "dutt", haarfarbe: "schwarz", haut: "mittel", laecheln: true,
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
    kunst: `<g transform="translate(0 ${r(Y - AY)})">${hinten}${halb(m.svg)}${st}</g>`,
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

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/mexiko.js"));
console.log(aus);
