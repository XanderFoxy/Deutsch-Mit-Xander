#!/usr/bin/env node
/* =====================================================================
   ATHEN (FASSUNG 854) — Bilderwelt neu, Städte der Welt
   ---------------------------------------------------------------------
   RECHERCHE (YSMA – Acropolis Restoration Service „Parthenon, completed
   interventions“; AP/ksat 11.10.2025 „Parthenon free of scaffolding“;
   artdependence „Restoration of Parthenon’s Western Facade completed“
   (Juni 2026); famous-historic-buildings „Odeon of Herodes Atticus“;
   Athens Festival „Odeon of Herodes Atticus“; Lagepläne/Koordinaten):
   - STANDORT: der Philopappos-Hügel (147 m), Südwesten der Akropolis
     (156 m). Wir stehen etwas erhöht (Auge 150 m) und blicken nach
     Nordosten (Peilung 58,5°). Parthenon rund 720 m entfernt.
     Echte Peilungen von hier: Propyläen 51°, Nike-Tempel 55°,
     Erechtheion 55°, Parthenon 60°, Fahne am Belvedere (Nordostecke)
     63°, Südostecke der Mauer 67°; Odeion des Herodes Atticus 57° in
     490–570 m; der Lykabettus (277 m) 54° in 2,55 km – also LINKS hinter
     dem Parthenon, über Erechtheion und Propyläen; dahinter, sehr blass,
     der Pentelikon (1109 m, 16,8 km), aus dessen Marmor der Parthenon ist.
   - ZEIT: später Nachmittag kurz vor Sonnenuntergang (Oktober). Die
     Sonne steht tief im Westsüdwesten, also hinter uns links: die
     Westfronten glühen golden, die langen Südseiten liegen im Streiflicht,
     Schatten fallen nach Ostnordost (vom Betrachter weg). Gegenüber der
     Sonne ein rosa „Venusgürtel“ über dem Horizont.
   - PARTHENON (447–432 v. Chr., dorisch, pentelischer Marmor): Stylobat
     69,5 × 30,9 m auf drei Stufen, 8 Säulen an den Schmalseiten, 17 an
     den Langseiten, Säulen 10,4 m (unten 1,9 m dick, mit Schwellung),
     Gebälk 3,3 m (Architrav, Fries mit Triglyphen und Metopen, Gesims),
     Giebel rund 3,5 m. Kein Dach mehr: 1687 explodierte darin ein
     Pulverlager – auf der Südseite fehlen seitdem in der Mitte Säulen und
     Gebälk (sechs Säulen zerstört), man sieht hindurch auf die Ostsäulen von innen.
     Restaurierung seit 1975: das Gerüst an der Westseite ist seit 2025/26
     fort (Arbeiten abgeschlossen); südlich vor dem Tempel liegen nummerierte
     Marmorblöcke der Restaurierung.
   - PROPYLÄEN (Torbau, Westseite, 6 dorische Säulen, Giebel), links der
     Nordflügel (Pinakothek), rechts davor auf der Bastion der kleine
     ionische Tempel der Athena Nike (4 Säulen vorn).
   - ERECHTHEION (ionisch) nördlich des Parthenons; an seiner Südseite die
     Korenhalle mit sechs Karyatiden (Mädchenfiguren als Stützen; heute
     Kopien, die Originale im Akropolismuseum, eine in London).
   - ODEION DES HERODES ATTICUS (161 n. Chr.): Bühnenhaus 92 m lang und
     28 m hoch, drei Geschosse mit Bogenöffnungen; heute Bühne des
     Athen-Festivals.
   - TYPISCHES: die griechische Flagge auf der Akropolis, Olivenbäume
     (heiliger Baum der Athene), Aleppo-Kiefern (ihr Harz duftet in der Hitze),
     Katzen an den Ausgrabungen, Picknick mit Gyros-Pita und Oliven,
     Touristen mit Sonnenhut und Kamera.
   Maßstab: Punkt (O, N, Z) in Metern (Osten/Norden vom Parthenon aus,
   Z über dem Meer), Betrachter bei (−625, −366), Auge 150 m, Horizont
   y = 110, Brennweite 1150: d = Tiefe, s = seitlich,
   x = 200 + s·1150/d, y = 110 + (150 − Z)·1150/d.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "athen", titel: "Athen", emoji: "🏛️", thema: "Länder", kuerzel: "ath", fassung: 854, breite: 400, hoehe: 260 });
{ const lg = S.lg, rg = S.rg, schon = {}; S.lg = (n, ...a) => schon["l" + n] || (schon["l" + n] = lg(n, ...a)); S.rg = (n, ...a) => schon["r" + n] || (schon["r" + n] = rg(n, ...a)); }
{ const teil = S.teil; S.teil = (t) => { if (t.anker) { const [ax, ay] = t.anker; t.kunst = `<g transform="translate(${B.r(t.x - ax)} ${B.r(t.y - ay)})">${t.kunst}</g>`; t.x = ax; t.y = ay; delete t.anker; } return teil(t); }; }
const rnd = zufall(447);
const r = B.r;
const F = 1150, EYE = 150, HOR = 110, BET = 58.5 * Math.PI / 180, VE = -625, VN = -366;
const FV = [Math.sin(BET), Math.cos(BET)], RV = [Math.cos(BET), -Math.sin(BET)];
/* Punkt im Gelände → Bild: [x, y, Einheiten je Meter, Tiefe] */
const pr = (E, N, Z) => { const dx = E - VE, dy = N - VN, d = dx * FV[0] + dy * FV[1], s = dx * RV[0] + dy * RV[1]; return [200 + s * F / d, HOR + (EYE - Z) * F / d, F / d, d]; };
const P = (pts) => pts.map(([x, y], i) => (i ? "L" : "M") + r(x) + " " + r(y)).join(" ") + " Z";
const Q = (pts3) => P(pts3.map((p) => pr(...p)));
const klemm = (v, a, b) => Math.max(a, Math.min(b, v));
const glatt = (pts, zu = true) => {
  let d = `M${r(pts[0][0])} ${r(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    d += ` C${r(p1[0] + (p2[0] - p0[0]) / 6)} ${r(p1[1] + (p2[1] - p0[1]) / 6)} ${r(p2[0] - (p3[0] - p1[0]) / 6)} ${r(p2[1] - (p3[1] - p1[1]) / 6)} ${r(p2[0])} ${r(p2[1])}`;
  }
  return d + (zu ? " Z" : "");
};
/* Linie zwischen zwei Geländepunkten */
const L3 = (a, b) => { const p = pr(...a), q = pr(...b); return `M${r(p[0])} ${r(p[1])} L${r(q[0])} ${r(q[1])}`; };
const vereinfache = (svg, stufe) => {
  const grenze = stufe > 1 ? 0.5 : 0.25;
  svg = svg.replace(/<(path|ellipse|line)\b[^>]*?\/>/g, (el) => { const sw = el.match(/stroke-width="([\d.]+)"/); return /fill="none"/.test(el) && sw && parseFloat(sw[1]) < grenze ? "" : el; });
  if (stufe > 1) { const f = stufe >= 1.8 ? 2 : 10; svg = svg.split(/(transform="[^"]*")/).map((t, i) => i % 2 ? t : t.replace(/(-?\d+\.\d+)/g, (m) => String(Math.round(parseFloat(m) * f) / f))).join(""); }
  return svg;
};

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("w04")}" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation=".4"/></filter>`);
S.def(`<filter id="${S.id("w15")}" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="1.5"/></filter>`);
const W04 = `filter="url(#${S.id("w04")})"`, W15 = `filter="url(#${S.id("w15")})"`;

/* Farben im Abendlicht: Westseiten golden, Südseiten im Streiflicht rosé, Schatten warm-violett */
const M_W = "#f6d39c", M_S = "#d9ae8c", M_D = "#9a7468", M_HELL = "#fff0cf";
const SAEULE = S.lg("saeule", [[0, "#fff1cf"], [0.3, "#f2cf9c"], [0.7, "#d3a585"], [1, "#a77c6c"]], 0, 0, 1, 0);

/* =====================================================================
   KULISSE — Abendhimmel im Nordosten, Wolken, ferne Berge
   ===================================================================== */
S.hinten(`<rect width="400" height="${HOR + 30}" fill="${S.lg("himmel", [[0, "#4a6aa6"], [0.35, "#7d97c6"], [0.62, "#b9b3cd"], [0.82, "#e4bfc0"], [1, "#f2cdb0"]])}"/>`);
/* Haufenwolken im Abendlicht: unten links golden (Sonne hinter uns, tief), oben rechts kühl */
{
  let w = "";
  const wolke = (x, y, s, nr) => {
    const L = [[-16, 0, 5], [-9, -3, 6.5], [-1, -5, 7.5], [8, -3.5, 6], [15, -1, 4.5], [-21, 1, 3.2]];
    const cid = S.id("wk" + nr);
    S.def(`<clipPath id="${cid}"><rect x="${r(x - 30 * s)}" y="${r(y - 20 * s)}" width="${r(60 * s)}" height="${r(21.4 * s)}"/></clipPath>`);
    w += `<g clip-path="url(#${cid})">`;
    for (const [dx, dy, rr] of L) w += `<circle cx="${r(x + dx * s)}" cy="${r(y + dy * s)}" r="${r(rr * s)}" fill="#b49cb4"/>`;
    for (const [dx, dy, rr] of L) w += `<circle cx="${r(x + (dx - 0.9) * s)}" cy="${r(y + (dy + 0.4) * s)}" r="${r(rr * 0.88 * s)}" fill="#e9c4bc"/>`;
    for (const [dx, dy, rr] of L.slice(0, 4)) w += `<circle cx="${r(x + (dx - 1.6) * s)}" cy="${r(y + (dy + 1) * s)}" r="${r(rr * 0.55 * s)}" fill="#ffe2c4"/>`;
    w += `</g>`;
  };
  wolke(300, 30, 1.05, 1); wolke(360, 58, 0.6, 2); wolke(42, 18, 0.7, 3); wolke(218, 22, 0.45, 4);
  S.hinten(w);
}
/* Pentelikon (16,8 km) – blass im Dunst, Grat mit Kuppen; darunter ferne Vororte */
{
  const pts = [[0, 100], [30, 92], [62, 80], [92, 70], [118, 60], [140, 55], [158, 50], [173, 46], [186, 49], [204, 52], [222, 58], [246, 66], [272, 74], [300, 82], [330, 90], [362, 96], [400, 101]];
  S.hinten(`<path d="${glatt(pts, false)} L400 112 L0 112 Z" fill="#b4a7c4" opacity=".42"/>`);
  S.hinten(`<path d="M150 112 Q260 101 400 104 L400 114 L150 114 Z" fill="#c9b4c0" opacity=".7"/>`);
  let v = "";
  for (let x = 160; x < 400; x += 2 + rnd() * 3) v += `<rect x="${r(x)}" y="${r(103.5 + rnd() * 3 - (x < 260 ? 0 : (x - 260) * 0.02))}" width="${r(1 + rnd() * 2)}" height="${r(1 + rnd() * 1.4)}" fill="${rnd() < 0.6 ? "#f3dccb" : "#cdb8c4"}" opacity=".75"/>`;
  S.hinten(v);
  /* Grund unter dem Horizont (Hang, Bäume) – nichts bleibt leer */
  S.hinten(`<rect y="${HOR}" width="400" height="${260 - HOR}" fill="${S.lg("grund", [[0, "#9a8a7c"], [0.4, "#5e6446"], [1, "#4a5038"]])}"/>`);
}

/* =====================================================================
   1 — DER LYKABETTUS (277 m, 2,55 km) mit der Kapelle Agios Georgios
   ===================================================================== */
const LYK = { x: 107.3, y: 52.8, u: 0.4503 };
const lykUnter = [];
{
  const { x, y, u } = LYK, yZ = (Z) => HOR - (Z - EYE) * u;
  /* Umriss: steiler Kegel, oben Fels; Halbbreiten aus den Höhenlinien (60 m bei 250 m, 180 m bei 200 m) */
  const links = [[x - 1.5, y + 0.6], [x - 5, yZ(268)], [x - 11, yZ(258)], [x - 19, yZ(248)], [x - 34, yZ(225)], [x - 52, yZ(200)], [x - 75, yZ(175)], [x - 100, yZ(150)]];
  const rechts = [[x + 1.5, y + 0.4], [x + 7, yZ(266)], [x + 14, yZ(255)], [x + 23, yZ(244)], [x + 38, yZ(222)], [x + 56, yZ(198)], [x + 80, yZ(176)], [x + 104, yZ(150)]];
  const um = [...links.reverse(), ...rechts];
  let k = `<path d="${glatt(um, false)} Z" fill="${S.lg("lykwald", [[0, "#8f9468"], [0.45, "#6a7652"], [1, "#4f5a44"]], 0, 0, 1, 0)}"/>`;
  /* Waldtupfen: links (Westen) im Abendlicht, rechts im Schatten */
  for (let i = 0; i < 70; i++) {
    const t = rnd(), Z = 195 + t * 62, hb = (Z > 250 ? 19 * (277 - Z) / 27 : Z > 200 ? 19 + 33 * (250 - Z) / 50 : 52) * 0.85;
    const xx = x + (rnd() * 2 - 1) * hb, yy = yZ(Z);
    k += `<ellipse cx="${r(xx)}" cy="${r(yy)}" rx="${r(1 + rnd() * 1.4)}" ry="${r(0.7 + rnd() * 0.8)}" fill="${xx < x ? (rnd() < 0.5 ? "#a3ad72" : "#7f9160") : (rnd() < 0.5 ? "#4f6044" : "#5e6e4e")}"/>`;
  }
  /* Felskuppe (grauer Kalk), Straße in Serpentinen, Kapelle mit Glockenturm, Terrasse */
  k += `<path d="M${r(x - 5)} ${r(yZ(266))} Q${r(x - 2)} ${r(y - 0.4)} ${r(x + 1)} ${r(y)} Q${r(x + 4)} ${r(y + 1)} ${r(x + 8)} ${r(yZ(265))} L${r(x + 6)} ${r(yZ(261))} L${r(x - 4)} ${r(yZ(262))} Z" fill="${S.lg("lykfels", [[0, "#f1d7bd"], [1, "#a9978f"]], 0, 0, 1, 0)}"/>`;
  const cx = x + 0.6, cy = y + 0.6;
  k += `<rect x="${r(cx - 2.2)}" y="${r(cy - 1.6)}" width="4.4" height="1.7" fill="#fff4e6"/><rect x="${r(cx + 0.6)}" y="${r(cy - 1.6)}" width="1.6" height="1.7" fill="#d9c6cc"/>`;
  k += `<path d="M${r(cx - 2.4)} ${r(cy - 1.6)} L${r(cx - 0.4)} ${r(cy - 2.5)} L${r(cx + 2.4)} ${r(cy - 1.6)} Z" fill="#b8573e"/>`;
  k += `<rect x="${r(cx - 2.6)}" y="${r(cy - 3.6)}" width="1.1" height="2.1" fill="#fff6ea"/><path d="M${r(cx - 2.7)} ${r(cy - 3.6)} L${r(cx - 2.05)} ${r(cy - 4.4)} L${r(cx - 1.4)} ${r(cy - 3.6)} Z" fill="#b8573e"/><rect x="${r(cx - 2.2)}" y="${r(cy - 3.2)}" width=".3" height=".5" fill="#6a4a40"/>`;
  k += `<rect x="${r(cx + 2.6)}" y="${r(cy - 0.7)}" width="5" height=".8" fill="#efe2d2"/><rect x="${r(cx + 2.6)}" y="${r(cy - 1.1)}" width="5" height=".35" fill="#ffffff"/>`;
  lykUnter.push({ id: "kapelle", de: "die Kapelle", syl: "ka-PEL-le", it: "la cappella", itSyl: "cap-PEL-la", en: "chapel", x: r(cx), y: r(cy + 0.2), kunst: flaeche(-3.4, -5, 7, 5.4),
    tipp: "Ganz oben steht die weiße Kapelle des heiligen Georg. Hinauf fährt eine Standseilbahn durch den Berg." });
  S.teil({ anker: [x, 90], id: "lykabettus", de: "der Lykabettus", syl: "ly-ka-BET-tus", it: "il Licabetto", itSyl: "li-ca-BET-to", en: "Mount Lycabettus", x: 0, y: 0, kunst: k,
    zoom: { x: x - 21, y: y - 6, w: 42, h: 28 }, unter: lykUnter,
    tipp: "Der Lykabettus ist mit 277 Metern der höchste Hügel mitten in Athen. Von oben sieht man bis zum Meer." });
}

/* =====================================================================
   2 — DIE STADT: weiße Häuser am Fuß des Lykabettus und im Nordwesten
   ===================================================================== */
{
  let k = "";
  /* Band hinter der Westseite der Akropolis (2–2,5 km, bis etwa 200 m Höhe) */
  const ober = (x) => 108 - 20 * Math.exp(-Math.pow((x - 100) / 70, 2));
  k += `<path d="M0 ${r(ober(0))} ${Array.from({ length: 21 }, (_, i) => { const x = i * 10; return `L${x} ${r(ober(x))}`; }).join(" ")} L200 120 L0 120 Z" fill="#d7c2bc"/>`;
  for (let i = 0; i < 230; i++) {
    const x = rnd() * 200, top = ober(x), y = top + 1 + Math.pow(rnd(), 0.8) * (118 - top), w = 1.2 + rnd() * 2.6, h = 0.8 + rnd() * 1.8;
    const hell = rnd();
    k += `<rect x="${r(x)}" y="${r(y - h)}" width="${r(w)}" height="${r(h)}" fill="${hell < 0.55 ? "#fbe7d4" : hell < 0.85 ? "#ecd3c6" : "#c7aeb4"}"/>`;
    if (rnd() < 0.5) k += `<rect x="${r(x + w * 0.62)}" y="${r(y - h)}" width="${r(w * 0.38)}" height="${r(h)}" fill="#b9a0ad" opacity=".75"/>`;
    if (rnd() < 0.15) k += `<ellipse cx="${r(x + w / 2)}" cy="${r(y - h * 0.3)}" rx="1.2" ry=".7" fill="#7e8a62"/>`;
  }
  /* Nordwesten links der Burg (1–2 km, tiefer) */
  for (let i = 0; i < 90; i++) {
    const x = rnd() * 52, y = 118 + rnd() * 74, w = 1.8 + rnd() * 4 * (y - 100) / 60, h = 1 + rnd() * 2.4 * (y - 100) / 60;
    k += `<rect x="${r(x)}" y="${r(y - h)}" width="${r(w)}" height="${r(h)}" fill="${rnd() < 0.6 ? "#f6ddc6" : "#d7bcb8"}"/><rect x="${r(x + w * 0.65)}" y="${r(y - h)}" width="${r(w * 0.35)}" height="${r(h)}" fill="#ab90a0" opacity=".7"/>`;
  }
  k += `<path d="M0 118 L56 118 L60 200 L0 200 Z" fill="${S.lg("stadtdunst", [[0, "#e7c4bb", 0.5], [1, "#e7c4bb", 0]])}"/>`;
  S.teil({ anker: [60, 112], id: "stadt", de: "die Stadt", syl: "STADT", it: "la città", itSyl: "cit-TÀ", en: "city", x: 0, y: 0, kunst: k,
    tipp: "Athen ist die Hauptstadt Griechenlands. Im Großraum leben fast vier Millionen Menschen." });
}

/* =====================================================================
   3 — DIE AKROPOLIS: Felsen, Bastion, Südmauer (Lupe: die Mauer)
   ===================================================================== */
const akroUnter = [];
/* Drei Baumformen als <use>-Vorlagen (Fuß unten in der Mitte, Breite ≈ 10): Ölbusch, Aleppo-Kiefer, Zypresse.
   Licht von links (Westsonne): helle Kappen links oben, Schattenseite rechts unten. */
{
  const kreis = (cx, cy, rr, f, o) => `<circle cx="${cx}" cy="${cy}" r="${rr}" fill="${f}"${o ? ` opacity="${o}"` : ""}/>`;
  let oel = `<path d="M-.5 0 L-.3 -2.4 L.4 -2.4 L.6 0 Z" fill="#5e4c3c"/>`;
  for (const [x, y, rr] of [[-3.2, -3.6, 2.6], [0, -5, 3.2], [3.2, -3.8, 2.6], [-1.6, -6.2, 2.2], [1.8, -6.4, 2.2]]) oel += kreis(x, y, rr, "#4f5a44");
  for (const [x, y, rr] of [[-3.4, -4.2, 1.8], [-0.6, -5.8, 2.2], [2.4, -4.6, 1.6], [-1.8, -6.8, 1.4]]) oel += kreis(x, y, rr, "#7d8a66");
  for (const [x, y, rr] of [[-3.8, -4.8, 1], [-1.2, -6.6, 1.2], [1.4, -6.9, 0.8]]) oel += kreis(x, y, rr, "#bcc39c", 0.9);
  let kie = `<path d="M-.4 0 Q-.2 -4 .8 -7.4 L1.4 -7.2 Q.6 -4 .5 0 Z" fill="#5a4232"/><path d="M.6 -6 Q-1.6 -7.6 -3.2 -8.2 M1 -6.8 Q3 -8.4 4.2 -8.6" stroke="#5a4232" stroke-width=".4" fill="none"/>`;
  for (const [x, y, w, h] of [[-3.2, -8.6, 3.4, 1.7], [0.8, -10.2, 4, 2], [3.8, -8.8, 3, 1.5], [-0.6, -8, 2.6, 1.2]]) kie += `<ellipse cx="${x}" cy="${y}" rx="${w}" ry="${h}" fill="#3a4e2c"/><ellipse cx="${r(x - w * 0.25)}" cy="${r(y - h * 0.35)}" rx="${r(w * 0.6)}" ry="${r(h * 0.55)}" fill="#64783f"/><ellipse cx="${r(x - w * 0.45)}" cy="${r(y - h * 0.55)}" rx="${r(w * 0.28)}" ry="${r(h * 0.28)}" fill="#a9a85e"/>`;
  const zyp = `<path d="M-1.3 0 Q-1.8 -6 0 -12 Q1.8 -6 1.3 0 Z" fill="#2d3b25"/><path d="M-1.3 0 Q-1.8 -6 0 -12 Q-.5 -6 -.2 0 Z" fill="#6a7244"/>`;
  S.def(`<g id="${S.id("t_oel")}">${oel}</g><g id="${S.id("t_kie")}">${kie}</g><g id="${S.id("t_zyp")}">${zyp}</g>`);
}
const baum = (x, y, gr, typ) => `<use href="#${S.id("t_" + typ)}" transform="translate(${r(x)} ${r(y)}) scale(${(gr / 10).toFixed(3)})"/>`;
const baumMix = (x, y, gr) => { const z = rnd(); return z < 0.17 ? baum(x, y, gr * 0.75, "zyp") : z < 0.6 ? baum(x, y, gr, "oel") : baum(x, y, gr * 1.1, "kie"); };
{
  let k = "";
  /* Mauerkrone von West nach Ost; im Westen der Aufgang (Fels, Treppe, Beulé-Tor) */
  const WEST = [[-215, 6, 116], [-200, 10, 121], [-185, 5, 127], [-170, 0, 133], [-155, 2, 139], [-146, -6, 143.5]];
  const KRONE = [[-146, -10, 143.5], [-142, -22, 143.5], [-126, -28, 149], [-100, -40, 150], [-70, -52, 151], [-30, -55, 151.5], [20, -52, 151.5], [70, -50, 151], [110, -48, 150.5], [152, -42, 150], [160, -44, 146]];
  const fussZ = (e) => 126 + 5 * Math.sin(e / 23) + 3 * Math.sin(e / 7.5);
  const mauerFuss = (e) => 12 + 1.6 * Math.sin(e / 5.3) + 1.2 * Math.sin(e / 2.1);
  const FUSS = KRONE.map(([e, n, z]) => [e, n - 3, z - mauerFuss(e)]);
  const OBEN = [...WEST, ...KRONE];
  const UNTEN = OBEN.map(([e, n, z]) => [e, n - 12, Math.min(z - 6, fussZ(e))]);
  const pp = (p) => { const [x, y] = pr(...p); return [klemm(x, 0, 400), y]; };
  /* Plateau: Kalksteinfläche hinter der Mauerkrone, steigt zur Mitte an (bis 156 m) – nichts scheint durch */
  const PLATEAU = [[-150, 14, 145], [-120, 24, 150], [-80, 40, 153], [-40, 46, 155], [0, 34, 155.6], [60, 26, 155.4], [110, 30, 155.8], [150, 36, 156], [166, 16, 152]];
  k += `<path d="${P([...KRONE.map(pp), ...PLATEAU.slice().reverse().map(pp)])}" fill="${S.lg("plateau", [[0, "#efd7ae"], [1, "#d9bfa4"]], 0, 0, 1, 0)}"/>`;
  for (let i = 0; i < 26; i++) { const e = -120 + rnd() * 270, n = -40 + rnd() * 60, [x, y, u] = pr(e, n, 151.6); if (x > 396) continue; k += `<rect x="${r(x)}" y="${r(y - 0.6 * u)}" width="${r((0.8 + rnd()) * u)}" height="${r(0.5 * u)}" fill="${rnd() < 0.6 ? "#fbe7c2" : "#c9a98c"}"/>`; }
  /* Hang mit Bäumen bis unter die Kante des Hügels */
  const unten = UNTEN.map(pp);
  k += `<path d="${P([...unten, [400, unten[unten.length - 1][1]], [400, 216], [0, 216], [0, unten[0][1]]])}" fill="${S.lg("hang", [[0, "#7a7a4e"], [0.5, "#55603a"], [1, "#46522f"]])}"/>`;
  /* Fels: grau-ockerfarbener Kalkstein; Westflächen warm-hell, Rücksprünge kühl-violett */
  const fels = [...OBEN.map(pp), ...unten.slice().reverse()];
  k += `<path d="${P(fels)}" fill="${S.lg("fels", [[0, "#e2c595"], [0.35, "#c9ae8e"], [0.7, "#ae9a8a"], [1, "#988a8c"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="${P(fels)}" fill="${S.lg("felslicht", [[0, "#ffcf8a", 0.16], [0.5, "#ffcf8a", 0], [1, "#3a2a3a", 0.22]])}"/>`;
  /* senkrechte Klüfte mit Lichtkante links (Westseite der Felsrippe) */
  for (let i = 0; i < 44; i++) {
    const t = rnd() * (OBEN.length - 1.01), i0 = Math.floor(t), f = t - i0, A = OBEN[i0], Bq = OBEN[i0 + 1];
    const e = A[0] + (Bq[0] - A[0]) * f, n = A[1] + (Bq[1] - A[1]) * f - 4, zt = (A[2] + (Bq[2] - A[2]) * f) - (i0 >= WEST.length ? mauerFuss(e) : 2), zb = Math.min(zt - 4, fussZ(e));
    const zc = zt - (zt - zb) * (0.35 + rnd() * 0.5), a = pr(e, n, zt), c = pr(e + (rnd() - 0.5) * 1.5, n - 2, zc), m = [(a[0] + c[0]) / 2 + (rnd() - 0.5) * 0.8, (a[1] + c[1]) / 2];
    if (a[0] > 396 || a[0] < 3) continue;
    const w = (0.3 + rnd() * 0.5) * a[2];
    k += `<path d="M${r(a[0])} ${r(a[1])} L${r(m[0])} ${r(m[1])} L${r(c[0])} ${r(c[1])} L${r(c[0] + w * 0.4)} ${r(c[1])} L${r(m[0] + w)} ${r(m[1])} L${r(a[0] + w * 0.8)} ${r(a[1])} Z" fill="#6c5e70" opacity=".45"/>`;
    k += `<path d="M${r(a[0] - 0.25)} ${r(a[1])} L${r(m[0] - 0.25)} ${r(m[1])}" stroke="#f3dcae" stroke-width=".3" fill="none" opacity=".6"/>`;
  }
  /* Schichtung: flache, leicht geneigte Bänder; warme Westflächen */
  for (let i = 0; i < 40; i++) {
    const t = rnd() * (OBEN.length - 1.01), i0 = Math.floor(t), f = t - i0, A = OBEN[i0], Bq = OBEN[i0 + 1];
    const e = A[0] + (Bq[0] - A[0]) * f, n = A[1] + (Bq[1] - A[1]) * f - 8, zt = (A[2] + (Bq[2] - A[2]) * f) - (i0 >= WEST.length ? 13 : 2), zb = Math.min(zt - 3, fussZ(e));
    const z = zb + rnd() * (zt - zb), [x, y, u] = pr(e, n, z);
    if (x > 396 || x < 3) continue;
    const w = (2 + rnd() * 4) * u, h = (0.8 + rnd() * 1.6) * u;
    k += rnd() < 0.6 ? `<path d="M${r(x)} ${r(y)} l${r(w * 0.25)} ${r(-h)} l${r(w * 0.75)} ${r(h * 0.15)} l${r(-w * 0.1)} ${r(h * 0.85)} Z" fill="#ecd4a6" opacity=".3"/><path d="M${r(x)} ${r(y)} l${r(w * 0.9)} ${r(h * 0.0)}" stroke="#7a6670" stroke-width=".3" opacity=".5"/>` : `<path d="M${r(x)} ${r(y)} q${r(w / 2)} ${r(-0.6)} ${r(w)} ${r(0.3)}" stroke="#7a6a72" stroke-width=".35" fill="none" opacity=".7"/>`;
  }
  /* Höhlen und Nischen am Südhang (dunkel, unten Lichtkante), Grasbüschel und Feigensträucher in Rissen */
  for (const [e, n, z, w, h] of [[-60, -66, 131, 5, 3.2], [-12, -68, 128.5, 3.4, 2.2], [48, -64, 133, 4.2, 2.6], [96, -60, 130, 3, 2]]) {
    const [x, y, u] = pr(e, n, z), ww = w * u, hh = h * u;
    k += `<path d="M${r(x - ww / 2)} ${r(y)} Q${r(x - ww * 0.55)} ${r(y - hh)} ${r(x)} ${r(y - hh * 1.05)} Q${r(x + ww * 0.6)} ${r(y - hh * 0.9)} ${r(x + ww / 2)} ${r(y)} Z" fill="#43363e"/><path d="M${r(x - ww / 2)} ${r(y)} H${r(x + ww / 2)}" stroke="#f0d7aa" stroke-width=".5"/>`;
  }
  for (let i = 0; i < 26; i++) { const t = rnd() * (OBEN.length - 1.01), i0 = Math.floor(t), f = t - i0, A = OBEN[i0], Bq = OBEN[i0 + 1]; const e = A[0] + (Bq[0] - A[0]) * f; const [x, y, u] = pr(e, A[1] - 8, fussZ(e) + 2 + rnd() * 8); if (x > 394 || x < 4) continue; k += baum(x, y, 2.2 * u * (0.7 + rnd() * 0.6), "oel"); }
  /* Südmauer (Kimon-Mauer) aus Quadern; darunter Roststreifen; Fuß mit dem Fels verzahnt */
  const mauer = [...KRONE.map(pp), ...FUSS.slice().reverse().map(pp)];
  k += `<path d="${P(mauer)}" fill="${S.lg("mauer", [[0, "#f3d4a2"], [0.25, "#e2bf98"], [1, "#bfa08e"]], 0, 0, 1, 0)}"/>`;
  let fu = "";
  for (let j = 1; j < 8; j++) { const q = j / 8; fu += "M" + KRONE.map((p) => { const [x, y] = pp([p[0], p[1] - 3 * q, p[2] - 11 * q]); return `${r(x)} ${r(y)}`; }).join(" L") + " "; }
  k += `<path d="${fu}" stroke="#93706a" stroke-width=".2" fill="none" opacity=".5"/>`;
  for (let i = 0; i < 70; i++) { const t = rnd() * (KRONE.length - 1.01), i0 = Math.floor(t), f = t - i0, A = KRONE[i0], Bq = KRONE[i0 + 1], q = Math.floor(rnd() * 7) / 8; const p = pr(A[0] + (Bq[0] - A[0]) * f, A[1] + (Bq[1] - A[1]) * f - 3 * q, A[2] + (Bq[2] - A[2]) * f - 11 * q); if (p[0] > 398) continue; k += `<rect x="${r(p[0])}" y="${r(p[1])}" width=".2" height="${r(1.4 * p[2])}" fill="#93706a" opacity=".4"/>`; }
  for (let i = 0; i < 22; i++) { const t = rnd() * (KRONE.length - 1.01), i0 = Math.floor(t), f = t - i0, A = FUSS[i0], Bq = FUSS[i0 + 1]; const [x, y, u] = pr(A[0] + (Bq[0] - A[0]) * f, A[1] + (Bq[1] - A[1]) * f, A[2] + (Bq[2] - A[2]) * f); if (x > 396) continue; k += `<rect x="${r(x)}" y="${r(y - 4 * u)}" width="${r(1.6 + rnd() * 2)}" height="${r((4 + rnd() * 6) * u)}" fill="${S.lg("rost", [[0, "#a8704a", 0.4], [1, "#a8704a", 0]])}"/>`; }
  for (let i = 0; i < 30; i++) { const t = rnd() * (KRONE.length - 1.01), i0 = Math.floor(t), f = t - i0, A = FUSS[i0], Bq = FUSS[i0 + 1]; const [x, y, u] = pr(A[0] + (Bq[0] - A[0]) * f, A[1] + (Bq[1] - A[1]) * f, A[2] + (Bq[2] - A[2]) * f); if (x > 396) continue; const w = (1.5 + rnd() * 3) * u; k += `<path d="M${r(x - w)} ${r(y + 1)} L${r(x - w * 0.5)} ${r(y - (0.6 + rnd()) * u)} L${r(x + w * 0.2)} ${r(y - (0.3 + rnd() * 1.6) * u)} L${r(x + w)} ${r(y + 1)} Z" fill="#c4b098"/>`; }
  k += `<path d="M${KRONE.map((p) => { const [x, y] = pp(p); return `${r(x)} ${r(y)}`; }).join(" L")}" stroke="${M_HELL}" stroke-width=".6" fill="none"/>`;
  /* Bastion des Nike-Tempels: senkrechter Quaderturm, Westseite im Licht */
  const bas = [[-146, -10, 143.5], [-142, -22, 143.5], [-142, -22, 129], [-146, -10, 129]];
  k += `<path d="${Q(bas)}" fill="${S.lg("bastion", [[0, "#fbdba6"], [1, "#e7bd8c"]], 0, 0, 1, 0)}"/>`;
  for (let z = 131; z < 143; z += 1.5) k += `<path d="${L3([-146, -10, z], [-142, -22, z])}" stroke="#b48a6e" stroke-width=".2" opacity=".6"/>`;
  /* Westaufgang: Treppe zwischen Fels, unten das Beulé-Tor mit zwei Pylonen */
  for (let i = 0; i < 10; i++) { const e = -168 + i * 2.2, z = 133.5 + i * 0.95; k += `<path d="${L3([e, -4, z], [e, 10, z])}" stroke="${i % 2 ? "#f9e0b8" : "#c99e80"}" stroke-width=".45"/>`; }
  k += `<path d="${Q([[-176, -4, 128], [-168, -6, 128], [-168, -6, 135.5], [-176, -4, 135.5]])}" fill="#f2cc98"/><path d="${Q([[-176, 10, 128], [-168, 8, 128], [-168, 8, 135.5], [-176, 10, 135.5]])}" fill="#e9c08e"/>`;
  k += `<path d="${Q([[-172, -4, 128], [-172, 8, 128], [-172, 8, 133], [-172, -4, 133]])}" fill="#d9ad86"/><path d="${Q([[-172, 0.5, 128], [-172, 3.5, 128], [-172, 3.5, 131.5], [-172, 0.5, 131.5]])}" fill="#5e4648"/>`;
  /* Bäume am Hang: Ölbüsche, Aleppo-Kiefern, Zypressen gemischt; hinten klein, vorn größer; Odeion frei */
  const yUnten = (x) => { let j = 0; while (j < unten.length - 1 && unten[j + 1][0] < x) j++; const a = unten[j], b2 = unten[Math.min(j + 1, unten.length - 1)]; return b2[0] === a[0] ? a[1] : a[1] + (b2[1] - a[1]) * klemm((x - a[0]) / (b2[0] - a[0]), 0, 1); };
  const baeume = [];
  for (let i = 0; i < 230; i++) {
    const y0 = rnd(), gr = 6 + y0 * 12 + rnd() * 3, x = gr / 2 + 2 + rnd() * (396 - gr), yU = yUnten(x), y = yU + 1 + Math.pow(y0, 0.9) * (215 - yU - 1);
    if (x > 88 && x < 258 && y > 163 && y < 206) continue;
    baeume.push([x, y, 6 + (y - 150) * 0.2 + rnd() * 3]);
  }
  /* Büsche entlang des Felsfußes: die Kante wird unregelmäßig und grün */
  for (let i = 0; i < 70; i++) {
    const x = 6 + rnd() * 388, y = yUnten(x) + 1 + rnd() * 3;
    baeume.push([x, y, 4 + rnd() * 4]);
  }
  baeume.sort((a, b2) => a[1] - b2[1]);
  for (const [x, y, g] of baeume) k += baumMix(x, y, g);
  akroUnter.push({ id: "mauer", de: "die Mauer", syl: "MAU-er", it: "le mura", itSyl: "MU-ra", en: "wall", x: r(pr(-104, -42, 138)[0]), y: r(pr(-104, -42, 138)[1]), kunst: flaeche(-24, -15, 48, 16),
    tipp: "Die Mauer um die Akropolis ist rund 2500 Jahre alt. Sie macht den Felsen zu einer Festung." });
  S.teil({ anker: [250, 140], id: "akropolis", de: "die Akropolis", syl: "a-KRO-po-lis", it: "l'Acropoli", itSyl: "a-CRO-po-li", en: "Acropolis", x: 0, y: 0, kunst: k,
    zoom: { x: 146, y: 98, w: 72, h: 48 }, unter: akroUnter,
    tipp: "„Akropolis“ heißt „Oberstadt“. Auf dem 156 Meter hohen Felsen standen die wichtigsten Tempel der Stadt." });
}

/* =====================================================================
   5 — DAS ERECHTHEION mit der Korenhalle (Lupe: die Karyatide)
   weiter weg als der Nike-Tempel → vor den Propyläen gezeichnet (liegt dahinter)
   ===================================================================== */
const erUnter = [];
{
  let k = "";
  const E0 = -37, E1 = -15, N0 = 43, N1 = 56, Z0 = 149, Z1 = 157.2;
  const MARMOR_S = S.lg("erechsued", [[0, "#f6dcae"], [1, "#e6c8a2"]], 0, 0, 1, 0);
  /* Ostvorhalle: sechs schlanke ionische Säulen (blass, Streiflicht), Gebälk darüber */
  for (let i = 5; i >= 0; i--) { const n = N0 + 0.2 + i * (N1 - N0 - 1) / 5, a = pr(-11.5, n, Z0 + 0.5), b = pr(-11.5, n, Z1 - 1.3); k += `<rect x="${r(a[0] - 0.33)}" y="${r(b[1])}" width=".66" height="${r(a[1] - b[1])}" fill="#ecd5b4"/><rect x="${r(a[0] + 0.05)}" y="${r(b[1])}" width=".28" height="${r(a[1] - b[1])}" fill="#c4a690"/>`; }
  k += `<path d="${Q([[-11.5, N0 - 0.3, Z1 - 1.3], [-11.5, N1, Z1 - 1.3], [-11.5, N1, Z1], [-11.5, N0 - 0.3, Z1]])}" fill="#ead2b0"/><path d="${Q([[-15, N0 - 0.3, Z1 - 1.3], [-11.5, N0 - 0.3, Z1 - 1.3], [-11.5, N0 - 0.3, Z1], [-15, N0 - 0.3, Z1]])}" fill="#dcc0a0"/>`;
  /* Fundament und Terrasse vor der Südwand */
  k += `<path d="${Q([[E0 - 2, N0 - 4, Z0 - 2.6], [E1 + 4, N0 - 4, Z0 - 2.6], [E1 + 4, N0 - 4, Z0 - 0.2], [E0 - 2, N0 - 4, Z0 - 0.2]])}" fill="#d9bfa0"/><path d="${L3([E0 - 2, N0 - 4, Z0 - 0.2], [E1 + 4, N0 - 4, Z0 - 0.2])}" stroke="#fbe6c2" stroke-width=".4"/>`;
  /* Nordwand innen (über die Südwand sichtbar), Südwand aus hellem Marmor mit Quaderlagen */
  k += `<path d="${Q([[E0, N1, Z1], [E1, N1, Z1], [E1, N1, Z1 + 0.6], [E0, N1, Z1 + 0.6]])}" fill="#c9a890"/>`;
  k += `<path d="${Q([[E0, N0, Z0], [E1, N0, Z0], [E1, N0, Z1], [E0, N0, Z1]])}" fill="${MARMOR_S}"/>`;
  let fu = "";
  for (let z = Z0 + 0.9; z < Z1 - 1.4; z += 0.9) fu += L3([E0, N0, z], [E1, N0, z]) + " ";
  for (let j = 0; j < 14; j++) { const e = E0 + 1 + rnd() * 20, z = Z0 + 0.9 * Math.floor(rnd() * 7); fu += L3([e, N0, z], [e, N0, z + 0.9]) + " "; }
  k += `<path d="${fu}" stroke="#c9a78a" stroke-width=".14" opacity=".8"/>`;
  k += `<path d="${Q([[E0, N0, Z1 - 1.3], [E1, N0, Z1 - 1.3], [E1, N0, Z1], [E0, N0, Z1]])}" fill="#f3dcb4"/><path d="${L3([E0, N0, Z1 - 1.3], [E1, N0, Z1 - 1.3])}" stroke="#b08a74" stroke-width=".25"/>`;
  /* Westfront im vollen Licht: unten glatt, oben vier Halbsäulen mit Fenstern dazwischen */
  k += `<path d="${Q([[E0, N1, Z0 - 3], [E0, N0, Z0 - 3], [E0, N0, Z1], [E0, N1, Z1]])}" fill="#f8dca6"/>`;
  k += `<path d="${L3([E0, N1, Z0 + 1.6], [E0, N0, Z0 + 1.6])}" stroke="#d2ad86" stroke-width=".3"/>`;
  for (const n of [45.5, 48.2, 50.8, 53.5]) { const a = pr(E0, n, Z0 + 1.6), b = pr(E0, n, Z1 - 1.3); k += `<rect x="${r(a[0] - 0.36)}" y="${r(b[1])}" width=".72" height="${r(a[1] - b[1])}" fill="#fff2d2"/><rect x="${r(a[0] + 0.12)}" y="${r(b[1])}" width=".24" height="${r(a[1] - b[1])}" fill="#d9b58e"/>`; }
  for (const n of [46.8, 49.5, 52.1]) { const a = pr(E0, n, Z0 + 2.4), b = pr(E0, n, Z0 + 5.2); k += `<rect x="${r(a[0] - 0.5)}" y="${r(b[1])}" width="1" height="${r(a[1] - b[1])}" fill="#7a5a56"/>`; }
  k += `<path d="${Q([[E0 - 0.2, N1 + 0.2, Z1 - 1.3], [E0 - 0.2, N0 - 0.2, Z1 - 1.3], [E0 - 0.2, N0 - 0.2, Z1 + 0.3], [E0 - 0.2, N1 + 0.2, Z1 + 0.3]])}" fill="#fff0cc"/>`;
  k += `<path d="${L3([E0, N0, Z1 + 0.3], [E1, N0, Z1 + 0.3])}" stroke="${M_HELL}" stroke-width=".4"/>`;
  /* Korenhalle am Westende der Südwand: hohe Brüstung, 4 Koren vorn + je eine dahinter, Gebälk mit Zahnschnitt, kein Giebel */
  const KE0 = -34.2, KE1 = -28.4, KN = 39.4, KZ = 149.6, KH = 1.8, MH = 2.3, KD = KZ + KH + MH;
  k += `<path d="${Q([[KE0, KN + 3.4, KZ], [KE0, KN, KZ], [KE0, KN, KD + 1.1], [KE0, KN + 3.4, KD + 1.1]])}" fill="#f9dfb0"/>`;
  k += `<path d="${Q([[KE0 + 0.4, KN + 3.4, KZ + KH], [KE1 - 0.4, KN + 3.4, KZ + KH], [KE1 - 0.4, KN + 3.4, KD], [KE0 + 0.4, KN + 3.4, KD]])}" fill="#d3b292"/>`;
  /* Schlagschatten der vorspringenden Halle auf der Südwand (nach Osten, rechts) */
  k += `<path d="${Q([[KE1, N0, KZ], [KE1 + 3.2, N0, KZ], [KE1 + 3.2, N0, KD - 0.6], [KE1 + 1.2, N0, KD + 1.1], [KE1, N0, KD + 1.1]])}" fill="#7e6260" opacity=".45"/>`;
  /* Kore als Vorlage (Höhe 10 = 2,3 m): Korb, Kopf mit Haar bis zu den Schultern, Gewand mit Falten, rechtes Knie vor; links Licht */
  S.def(`<g id="${S.id("kore")}"><path d="M-1.3 -9.4 L-1.5 -10 L1.5 -10 L1.3 -9.4 Z" fill="#f4dcb2"/><path d="M-1.1 -9.4 Q-1.4 -8 -1.6 -6.6 L1.6 -6.6 Q1.4 -8 1.1 -9.4 Z" fill="#c9a88c"/><ellipse cx="0" cy="-8.4" rx=".75" ry=".95" fill="#f6dcb4"/><path d="M-1.9 -6.8 Q-2 -3.4 -1.7 0 L1.7 0 Q2 -3.4 1.9 -6.8 Q1 -7.4 0 -7.4 Q-1 -7.4 -1.9 -6.8 Z" fill="#f9e2ba"/><path d="M0 -7.4 Q1 -7.4 1.9 -6.8 Q2 -3.4 1.7 0 L.2 0 Z" fill="#c4a088"/><path d="M-1.1 0 L-1.2 -5 M-.4 0 L-.4 -5.6 M.5 0 L.6 -4.6 M1.1 0 Q1.4 -1.6 1 -3.2" stroke="#b8957c" stroke-width=".18" fill="none"/><path d="M.2 -3.4 Q1 -3.1 1.4 -2.6" stroke="#fff2d8" stroke-width=".2" fill="none"/></g>`);
  const kore = (e, n, hell) => { const a = pr(e, n, KZ + KH), b = pr(e, n, KD); const sc = (a[1] - b[1]) / 10; return `<use href="#${S.id("kore")}" transform="translate(${r(a[0])} ${r(a[1])}) scale(${sc.toFixed(3)})"${hell ? "" : ` opacity=".75"`}/>`; };
  k += kore(KE0 + 0.5, KN + 2.3, false) + kore(KE1 - 0.5, KN + 2.3, false);
  for (let i = 0; i < 4; i++) k += kore(KE0 + 0.5 + i * (KE1 - KE0 - 1) / 3, KN + 0.5, true);
  /* Brüstung (Sockel) vorn: Südseite und Westseite */
  k += `<path d="${Q([[KE0, KN, KZ], [KE1, KN, KZ], [KE1, KN, KZ + KH], [KE0, KN, KZ + KH]])}" fill="${S.lg("korensockel", [[0, "#f8deae"], [1, "#e2c29c"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="${L3([KE0, KN, KZ + KH], [KE1, KN, KZ + KH])}" stroke="${M_HELL}" stroke-width=".3"/><path d="${L3([KE0, KN, KZ + 0.3], [KE1, KN, KZ + 0.3])}" stroke="#c4a184" stroke-width=".2"/>`;
  k += `<path d="${L3([KE0, KN, KZ], [KE0, KN, KZ + KH])}" stroke="#fff4d8" stroke-width=".45"/>`;
  /* dunkler Schlitz unter der Decke */
  k += `<path d="${Q([[KE0, KN, KD - 0.25], [KE1, KN, KD - 0.25], [KE1, KN, KD], [KE0, KN, KD]])}" fill="#5a4446"/>`;
  /* Gebälk mit Zahnschnitt, flaches Dach */
  k += `<path d="${Q([[KE0 - 0.2, KN - 0.1, KD], [KE1 + 0.2, KN - 0.1, KD], [KE1 + 0.2, KN - 0.1, KD + 1.1], [KE0 - 0.2, KN - 0.1, KD + 1.1]])}" fill="#f6dab0"/>`;
  for (let e = KE0; e <= KE1; e += 0.45) { const a = pr(e, KN - 0.1, KD + 0.7); k += `<rect x="${r(a[0])}" y="${r(a[1])}" width=".22" height=".3" fill="#b8957c"/>`; }
  k += `<path d="${L3([KE0 - 0.3, KN - 0.2, KD + 1.1], [KE1 + 0.3, KN - 0.2, KD + 1.1])}" stroke="${M_HELL}" stroke-width=".4"/>`;
  const [kx, ky] = pr((KE0 + KE1) / 2, KN, KZ + KH);
  erUnter.push({ id: "karyatide", de: "die Karyatide", syl: "ka-ry-a-TI-de", it: "la cariatide", itSyl: "ca-ri-A-ti-de", en: "caryatid", x: r(kx), y: r(ky + 1.5), kunst: flaeche(-3.4, -6.8, 6.8, 7.4),
    tipp: "Die Karyatiden sind Mädchenfiguren, die das Dach tragen. Hier stehen Kopien – die echten sind im Museum." });
  const [ex, ey] = pr(-26, N0, Z0);
  S.teil({ anker: [ex, ey], id: "erechtheion", de: "das Erechtheion", syl: "e-rech-THEI-on", it: "l'Eretteo", itSyl: "e-ret-TE-o", en: "Erechtheion", x: 0, y: 0, kunst: k,
    zoom: { x: 127, y: 96, w: 30, h: 20 }, unter: erUnter,
    tipp: "Das Erechtheion war ein Tempel für Athene und Poseidon. Hier soll Athene den ersten Olivenbaum geschenkt haben." });
}

/* =====================================================================
   4 — DIE PROPYLÄEN (Torbau) mit dem Nike-Tempel (Lupe)
   ===================================================================== */
const propUnter = [];
{
  let k = "";
  /* Nordflügel (Pinakothek): Westseite, drei Säulen zwischen Anten, dahinter Schatten */
  const ZB = 143, E0 = -133;
  k += `<path d="${Q([[E0 + 3, 32, ZB], [E0 + 3, 19, ZB], [E0 + 3, 19, ZB + 8], [E0 + 3, 32, ZB + 8]])}" fill="${M_W}"/>`;
  k += `<path d="${Q([[E0 + 3, 31, ZB + 0.5], [E0 + 3, 20, ZB + 0.5], [E0 + 3, 20, ZB + 6.4], [E0 + 3, 31, ZB + 6.4]])}" fill="#8e6a62"/>`;
  for (const n of [29.5, 25.5, 21.5]) { const a = pr(E0 + 3, n, ZB + 0.5), b = pr(E0 + 3, n, ZB + 6.4); k += `<path d="M${r(a[0] - 0.9)} ${r(a[1])} L${r(b[0] - 0.75)} ${r(b[1])} L${r(b[0] + 0.75)} ${r(b[1])} L${r(a[0] + 0.9)} ${r(a[1])} Z" fill="${SAEULE}"/>`; }
  k += `<path d="${Q([[E0 + 3, 32.5, ZB + 8], [E0 + 3, 18.5, ZB + 8], [E0 + 3, 18.5, ZB + 8.7], [E0 + 3, 32.5, ZB + 8.7]])}" fill="${M_HELL}"/>`;
  /* Mittelbau: 6 dorische Säulen, mittleres Joch breiter, Gebälk, Giebel; dahinter höhere Osthalle */
  k += `<path d="${Q([[E0 + 0.5, 17.5, ZB], [E0 + 0.5, -1.5, ZB], [E0 + 0.5, -1.5, ZB + 8.8], [E0 + 0.5, 17.5, ZB + 8.8]])}" fill="#7e5c58"/>`;
  for (const n of [16.6, 13, 9.6, 6.4, 3, -0.6]) {
    const a = pr(E0, n, ZB), b = pr(E0, n, ZB + 8.8), w0 = 0.8 * a[2], w1 = 0.64 * b[2];
    k += `<path d="M${r(a[0] - w0)} ${r(a[1])} L${r(b[0] - w1)} ${r(b[1])} L${r(b[0] + w1)} ${r(b[1])} L${r(a[0] + w0)} ${r(a[1])} Z" fill="${SAEULE}"/><rect x="${r(b[0] - w1 * 1.35)}" y="${r(b[1] - 0.6)}" width="${r(w1 * 2.7)}" height=".6" fill="${M_HELL}"/>`;
  }
  k += `<path d="${Q([[E0, 18, ZB + 8.8], [E0, -2, ZB + 8.8], [E0, -2, ZB + 11.2], [E0, 18, ZB + 11.2]])}" fill="${M_W}"/>`;
  k += `<path d="${L3([E0, 18, ZB + 10], [E0, -2, ZB + 10])}" stroke="#b78f74" stroke-width=".3"/>`;
  for (let n = 17; n > -2; n -= 1.6) { const a = pr(E0, n, ZB + 10), b = pr(E0, n, ZB + 11); k += `<rect x="${r(a[0])}" y="${r(b[1])}" width=".45" height="${r(a[1] - b[1])}" fill="#b28a72"/>`; }
  k += `<path d="${Q([[E0, 18.4, ZB + 11.2], [E0, -2.4, ZB + 11.2], [E0, 8, ZB + 13.4]])}" fill="#e7bf8e"/><path d="${L3([E0, 18.4, ZB + 11.2], [E0, 8, ZB + 13.4])} ${L3([E0, 8, ZB + 13.4], [E0, -2.4, ZB + 11.2])}" stroke="${M_HELL}" stroke-width=".55"/>`;
  /* Südflügel klein, zum Nike-Tempel hin */
  k += `<path d="${Q([[E0 + 2, -2, ZB], [E0 + 2, -9, ZB], [E0 + 2, -9, ZB + 7], [E0 + 2, -2, ZB + 7]])}" fill="#e9c393"/>`;
  for (const n of [-4, -7]) { const a = pr(E0 + 2, n, ZB), b = pr(E0 + 2, n, ZB + 6.2); k += `<rect x="${r(a[0] - 0.6)}" y="${r(b[1])}" width="1.2" height="${r(a[1] - b[1])}" fill="#fbe2b8"/><rect x="${r(a[0] + 0.6)}" y="${r(b[1])}" width="1" height="${r(a[1] - b[1])}" fill="#7e5c58"/>`; }
  /* Nike-Tempel (8,3 × 5,4 m): 4 ionische Säulen an der Westfront, Gebälk, flacher Giebel */
  const NE = -140, NN = -16, NZ = 143.5;
  k += `<path d="${Q([[NE + 0.6, NN + 2.6, NZ + 0.6], [NE + 8, NN + 2.6, NZ + 0.6], [NE + 8, NN + 2.6, NZ + 5], [NE + 0.6, NN + 2.6, NZ + 5]])}" fill="${M_S}"/>`;
  k += `<path d="${Q([[NE, NN - 2.7, NZ], [NE, NN + 2.7, NZ], [NE, NN + 2.7, NZ + 0.6], [NE, NN - 2.7, NZ + 0.6]])}" fill="${M_HELL}"/>`;
  k += `<path d="${Q([[NE + 1, NN - 2.2, NZ + 0.6], [NE + 1, NN + 2.2, NZ + 0.6], [NE + 1, NN + 2.2, NZ + 4.7], [NE + 1, NN - 2.2, NZ + 4.7]])}" fill="#8a6660"/>`;
  for (const n of [-2.2, -0.75, 0.75, 2.2]) { const a = pr(NE, NN + n, NZ + 0.6), b = pr(NE, NN + n, NZ + 4.7); k += `<rect x="${r(a[0] - 0.42)}" y="${r(b[1])}" width=".84" height="${r(a[1] - b[1])}" fill="${SAEULE}"/><rect x="${r(b[0] - 0.7)}" y="${r(b[1] - 0.25)}" width="1.4" height=".35" fill="${M_HELL}"/>`; }
  k += `<path d="${Q([[NE, NN - 2.8, NZ + 4.7], [NE, NN + 2.8, NZ + 4.7], [NE, NN + 2.8, NZ + 5.8], [NE, NN - 2.8, NZ + 5.8]])}" fill="${M_W}"/>`;
  k += `<path d="${Q([[NE, NN - 2.9, NZ + 5.8], [NE, NN + 2.9, NZ + 5.8], [NE, NN, NZ + 6.9]])}" fill="#ecc596"/><path d="${L3([NE, NN - 2.9, NZ + 5.8], [NE, NN, NZ + 6.9])} ${L3([NE, NN, NZ + 6.9], [NE, NN + 2.9, NZ + 5.8])}" stroke="${M_HELL}" stroke-width=".4"/>`;
  k += `<path d="${Q([[NE, NN + 2.9, NZ + 5.8], [NE + 8.3, NN + 2.9, NZ + 5.8], [NE + 8.3, NN + 2.9, NZ + 4.7], [NE, NN + 2.9, NZ + 4.7]])}" fill="#d9ad8a"/>`;
  const [nx, ny] = pr(NE, NN, NZ);
  propUnter.push({ id: "tempel", de: "der Tempel", syl: "TEM-pel", it: "il tempio", itSyl: "TEM-pio", en: "temple", x: r(nx + 2), y: r(ny), kunst: flaeche(-7, -15.5, 15, 16),
    tipp: "Der kleine Tempel ist der Siegesgöttin Athena Nike geweiht. Er steht auf einer hohen Bastion." });
  const [px, py] = pr(E0, 8, ZB);
  S.teil({ anker: [px, py], id: "propylaeen", de: "die Propyläen", syl: "pro-py-LÄ-en", it: "i Propilei", itSyl: "pro-pi-LE-i", en: "Propylaea", x: 0, y: 0, kunst: k,
    zoom: { x: 46, y: 88, w: 84, h: 56 }, unter: propUnter,
    tipp: "Die Propyläen sind das große Eingangstor der Akropolis. Durch sie gehen auch heute alle Besucher hinauf." });
}

/* =====================================================================
   6 — DER PARTHENON (Lupe: die Säule, der Giebel, der Marmorblock)
   ===================================================================== */
const parUnter = [];
{
  const e0 = -34.75, e1 = 34.75, n0 = -15.45, n1 = 15.45, zB = 150.1, zS = 151.6, zC = 162.03, zA = 163.38, zF = 164.73, zK = 165.3, zG = 168.8;
  const ECOL = (i) => -33.7 + i * 67.4 / 16, NCOL = (i) => -14.4 + i * 28.8 / 7;
  const FEHLT = new Set([6, 7, 8, 9, 10, 11]);   /* Südseite: 1687 zerstört */
  let k = "";
  const saeule = (E, N, z0 = zS, z1 = zC, hell = 1) => {
    const a = pr(E, N, z0), b = pr(E, N, z1), w0 = 0.95 * a[2], w1 = 0.74 * b[2], m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], wm = 0.9 * (a[2] + b[2]) / 2;
    let c = `<path d="M${r(a[0] - w0)} ${r(a[1])} Q${r(m[0] - wm * 1.04)} ${r(m[1])} ${r(b[0] - w1)} ${r(b[1])} L${r(b[0] + w1)} ${r(b[1])} Q${r(m[0] + wm * 1.04)} ${r(m[1])} ${r(a[0] + w0)} ${r(a[1])} Z" fill="${SAEULE}"${hell < 1 ? ` opacity="${hell}"` : ""}/>`;
    if (z1 === zC) {
      /* Kanneluren angedeutet, Kapitell (Echinus + Abakus) */
      c += `<path d="M${r(a[0] - w0 * 0.35)} ${r(a[1])} L${r(b[0] - w1 * 0.35)} ${r(b[1])} M${r(a[0] + w0 * 0.3)} ${r(a[1])} L${r(b[0] + w1 * 0.3)} ${r(b[1])}" stroke="#c89c80" stroke-width=".18" opacity=".7"/>`;
      const eh = 0.5 * b[2], ab = 1.05 * b[2];
      c += `<path d="M${r(b[0] - w1)} ${r(b[1])} L${r(b[0] - ab)} ${r(b[1] - eh)} L${r(b[0] + ab)} ${r(b[1] - eh)} L${r(b[0] + w1)} ${r(b[1])} Z" fill="#e2b98e"/><rect x="${r(b[0] - ab)}" y="${r(b[1] - eh - 0.38 * b[2])}" width="${r(2 * ab)}" height="${r(0.38 * b[2])}" fill="${M_HELL}"/>`;
    }
    return c;
  };
  /* Gebälk an einer Seite (Ebene) zwischen zwei Punkten in der Waagerechten */
  /* bruch: [Architrav, Fries, Gesims] – um so viele Meter endet das Band früher (abgebrochene Kante) */
  const gebaelk = (A, Bp, licht, trigl, bruchA = [0, 0, 0], bruchB = [0, 0, 0], blass = false) => {
    const [ae, an] = A, [be, bn] = Bp, L = Math.hypot(be - ae, bn - an), ux = (be - ae) / L, uy = (bn - an) / L;
    const P1 = (j) => [ae + ux * bruchA[j], an + uy * bruchA[j]], P2 = (j) => [be - ux * bruchB[j], bn - uy * bruchB[j]];
    const band = (j, z0, z1) => { const [a1, a2] = P1(j), [b1, b2] = P2(j); return Q([[a1, a2, z0], [b1, b2, z0], [b1, b2, z1], [a1, a2, z1]]); };
    const F1 = blass ? "#ead2b2" : licht ? "#f5d6a4" : "#dbb291", F2 = blass ? "#e2c7a8" : licht ? "#eccb98" : "#cfa487", F3 = blass ? "#f2e0c6" : licht ? M_HELL : "#ead0b0";
    let g = `<path d="${band(0, zC, zA)}" fill="${F1}"/><path d="${band(1, zA, zF)}" fill="${F2}"/>`;
    if (trigl) for (let t = 0; t <= 1.0001; t += trigl) { const e = ae + (be - ae) * t, n = an + (bn - an) * t, d1 = Math.hypot(e - ae, n - an); if (d1 < bruchA[1] || L - d1 < bruchB[1]) continue; const p = pr(e, n, zF), q = pr(e, n, zA); g += `<rect x="${r(p[0] - 0.36 * p[2])}" y="${r(p[1])}" width="${r(0.72 * p[2])}" height="${r(q[1] - p[1])}" fill="${blass ? "#c9ad96" : licht ? "#b98c6e" : "#a07a6a"}"/>`; }
    g += `<path d="${band(2, zF, zK)}" fill="${F3}"/>`;
    const [c1, c2] = P1(2), [d1, d2] = P2(2);
    g += `<path d="${L3([c1, c2, zF], [d1, d2, zF])}" stroke="#8e6a5e" stroke-width=".3"/>`;
    return g;
  };
  /* Ostgiebel und Ostsäulen von innen: weiter weg, blasser und kühler (durch die Lücke zu sehen) */
  k += `<path d="${Q([[e1, n0, zK], [e1, n1, zK], [e1, 0, zG]])}" fill="#ecd6b8"/><path d="${L3([e1, n0, zK], [e1, 0, zG])} ${L3([e1, 0, zG], [e1, n1, zK])}" stroke="#fbeedc" stroke-width=".4"/>`;
  for (let i = 0; i < 8; i++) k += saeule(33.7, NCOL(i), zS, zC, 0.7);
  k += gebaelk([e1, n1], [e1, n0], false, 1 / 14, [0, 0, 0], [0, 0, 0], true);
  /* dunkler Innenraum: niedrige Reste der Cellawand im Schatten */
  k += `<path d="${Q([[-14, -9.5, zS], [26, -9.5, zS], [26, -9.5, zS + 2.6], [18, -9.5, zS + 3.4], [6, -9.5, zS + 2.2], [-14, -9.5, zS + 3]])}" fill="#7e6260"/>`;
  /* Inneres: Schatten hinter der Westhalle (Opisthodom), Reste der Cellawand */
  k += `<path d="${Q([[-29.5, -11, zS], [-29.5, 11, zS], [-29.5, 11, zC], [-29.5, -11, zC]])}" fill="${S.lg("innen", [[0, "#5e4648"], [1, "#8c6a62"]])}"/>`;
  k += `<path d="${Q([[-23, -9.5, zS], [-23, 9.5, zS], [-23, 9.5, zC - 1], [-23, -9.5, zC - 1]])}" fill="#a07c6e" opacity=".8"/>`;
  k += `<path d="${Q([[-23, -2.5, zS], [-23, 2.5, zS], [-23, 2.5, zS + 7], [-23, -2.5, zS + 7]])}" fill="#4e3a3e"/>`;
  /* Stufen (Krepis): Westseite im Licht, Südseite dunkler */
  for (let j = 0; j < 3; j++) {
    const o = 1.4 - j * 0.7, za = zB + j * 0.5, zb = za + 0.5;
    k += `<path d="${Q([[e0 - o, n1 + o, za], [e0 - o, n0 - o, za], [e0 - o, n0 - o, zb], [e0 - o, n1 + o, zb]])}" fill="${j % 2 ? "#f4d39f" : "#fbe3b6"}"/>`;
    k += `<path d="${Q([[e0 - o, n0 - o, za], [e1 + o, n0 - o, za], [e1 + o, n0 - o, zb], [e0 - o, n0 - o, zb]])}" fill="${j % 2 ? "#cfa486" : "#ddb594"}"/>`;
  }
  /* Südkolonnade: von Osten (hinten) nach Westen; in der Mitte Säulenstümpfe */
  for (let i = 16; i >= 0; i--) k += FEHLT.has(i) ? (i % 2 ? saeule(ECOL(i), -14.4, zS, zS + 1.6) : saeule(ECOL(i), -14.4, zS, zS + 0.9)) : saeule(ECOL(i), -14.4);
  /* Gebälk Süd: zwei Stücke, die Mitte fehlt */
  k += gebaelk([ECOL(12) - 2.1, n0], [e1, n0], false, 67.4 / 16 / (e1 - ECOL(12) + 2.1) / 2, [0, 1.3, 2.6], [0, 0, 0]);
  k += gebaelk([e0, n0], [ECOL(5) + 2.1, n0], false, 67.4 / 16 / (ECOL(5) + 2.1 - e0) / 2, [0, 0, 0], [0.4, 1.8, 3.2]);
  /* Westfront: 8 Säulen von Norden nach Süden (die Südwestecke ist uns am nächsten) */
  for (let i = 7; i >= 0; i--) k += saeule(-33.7, NCOL(i));
  k += gebaelk([e0, n1], [e0, n0], true, 1 / 14);
  /* Westgiebel: Giebelfeld zurückgesetzt im Halbschatten, Figurenreste in den Ecken, Schräggesims hell */
  k += `<path d="${Q([[e0 + 0.5, n1 - 0.6, zK], [e0 + 0.5, n0 + 0.6, zK], [e0 + 0.5, 0, zG - 0.7]])}" fill="#d9ad8a"/>`;
  for (const [na, nb, h] of [[13.4, 10.2, 0.9], [-10.6, -13.6, 0.85]]) { const a = pr(e0 + 0.4, na, zK), b = pr(e0 + 0.4, nb, zK), c = pr(e0 + 0.4, (na + nb) / 2, zK + h); k += `<path d="M${r(a[0])} ${r(a[1])} Q${r(c[0])} ${r(c[1] - 0.4)} ${r(b[0])} ${r(b[1] - 0.3)} L${r(b[0])} ${r(b[1])} Z" fill="#f4d6a6"/>`; }
  for (const n of [5.6, 4.4]) { const a = pr(e0 + 0.4, n, zK), b = pr(e0 + 0.4, n, zK + 2.3); k += `<path d="M${r(a[0] - 0.5)} ${r(a[1])} Q${r(b[0] - 0.6)} ${r((a[1] + b[1]) / 2)} ${r(b[0])} ${r(b[1])} Q${r(b[0] + 0.6)} ${r((a[1] + b[1]) / 2)} ${r(a[0] + 0.5)} ${r(a[1])} Z" fill="#f0cf9e"/>`; }
  k += `<path d="${L3([e0, n1 + 0.4, zK], [e0, 0, zG])} ${L3([e0, 0, zG], [e0, n0 - 0.4, zK])}" stroke="${M_HELL}" stroke-width="1.1" stroke-linecap="round"/>`;
  k += `<path d="${L3([e0, n1 + 0.4, zK - 0.15], [e0, 0, zG - 0.25])} ${L3([e0, 0, zG - 0.25], [e0, n0 - 0.4, zK - 0.15])}" stroke="#b58a70" stroke-width=".3"/>`;
  /* nummerierte Marmorblöcke der Restaurierung südlich vor dem Tempel */
  const BLOECKE = [];
  for (let i = 0; i < 9; i++) for (const [n, z] of [[-21.5, 150.6], [-21.5, 151.3], [-21.5, 152]]) { const e = -22 + i * 5.6 + (z > 151 ? 0.4 : 0); if (z > 151.9 && rnd() < 0.5) continue; BLOECKE.push([e, n, z]); }
  for (const [e, n, z] of BLOECKE) {
    const b0 = [[e, n, z], [e + 1.5, n, z], [e + 1.5, n, z + 0.7], [e, n, z + 0.7]], top = [[e, n, z + 0.7], [e + 1.5, n, z + 0.7], [e + 1.5, n + 1, z + 0.7], [e, n + 1, z + 0.7]], west = [[e, n, z], [e, n + 1, z], [e, n + 1, z + 0.7], [e, n, z + 0.7]];
    k += `<path d="${Q(west)}" fill="#fff0d2"/><path d="${Q(b0)}" fill="#ead2b0"/><path d="${Q(top)}" fill="#f6e2c2"/>`;
    const m = pr(e + 0.7, n, z + 0.35); k += `<rect x="${r(m[0] - 0.3)}" y="${r(m[1] - 0.15)}" width=".6" height=".3" fill="#8a6a5a"/>`;
  }
  /* Abendlicht auf der Westseite: warmer Schimmer, Kanten der Ecksäule */
  const sw = pr(-33.7, -14.4, zS);
  parUnter.push({ id: "saeule", de: "die Säule", syl: "SÄU-le", it: "la colonna", itSyl: "co-LON-na", en: "column", x: r(sw[0]), y: r(sw[1]), kunst: flaeche(-2.2, -(sw[1] - pr(-33.7, -14.4, zC)[1]), 4.4, sw[1] - pr(-33.7, -14.4, zC)[1]),
    tipp: "Die dorischen Säulen sind über 10 Meter hoch. Sie sind in der Mitte etwas dicker – so wirken sie lebendig." });
  const gp = pr(e0, 0, zK);
  parUnter.push({ id: "giebel", de: "der Giebel", syl: "GIE-bel", it: "il frontone", itSyl: "fron-TO-ne", en: "pediment", x: r(gp[0]), y: r(gp[1]), kunst: flaeche(-21, -(gp[1] - pr(e0, 0, zG)[1]) - 1, 42, gp[1] - pr(e0, 0, zG)[1] + 1),
    tipp: "Im Giebel standen früher große Figuren: der Streit von Athene und Poseidon um die Stadt." });
  const bl0 = pr(-22, -21.5, 151.6), bl1 = pr(28, -21.5, 152.7);
  parUnter.push({ id: "marmorblock", de: "der Marmorblock", syl: "MAR-mor-block", it: "il blocco di marmo", itSyl: "BLOC-co di MAR-mo", en: "marble block", x: r((bl0[0] + bl1[0]) / 2), y: r(bl0[1] + 1), kunst: flaeche(-(bl1[0] - bl0[0]) / 2 - 1, -4.2, bl1[0] - bl0[0] + 2, 4.6),
    tipp: "Neben dem Parthenon liegen Hunderte nummerierte Marmorblöcke – wie ein riesiges Puzzle. Seit 1975 wird der Tempel restauriert." });
  const pc = pr(0, -15.45, zB);
  S.teil({ anker: [pc[0], pc[1]], id: "parthenon", de: "der Parthenon", syl: "PAR-the-non", it: "il Partenone", itSyl: "par-te-NO-ne", en: "Parthenon", x: 0, y: 0, kunst: k,
    zoom: { x: 166, y: 54, w: 114, h: 76 }, unter: parUnter,
    tipp: "Der Parthenon war der Tempel der Göttin Athene. Er wurde vor fast 2500 Jahren aus weißem Marmor gebaut." });
}

/* =====================================================================
   7 — DIE FLAGGE am Belvedere (Nordostecke)
   ===================================================================== */
{
  const a = pr(150, 35, 155), b = pr(150, 35, 168), u = a[2];
  const fw = 2.7 * u, fh = 1.8 * u, x0 = b[0] + 0.2, y0 = b[1] + 0.2;
  let k = `<path d="M${r(a[0])} ${r(a[1])} L${r(b[0])} ${r(b[1])}" stroke="#e6e0d6" stroke-width=".45"/><circle cx="${r(b[0])}" cy="${r(b[1] - 0.3)}" r=".35" fill="#f2d48a"/>`;
  /* weht nach rechts (Wind aus Westen): neun Streifen, Kreuz im blauen Feld */
  const welle = (x, y) => [x, y + Math.sin((x - x0) / fw * Math.PI * 1.6) * 0.35];
  let st = "";
  for (let i = 0; i < 9; i++) {
    const ya = y0 + i * fh / 9, yb = ya + fh / 9;
    const pts = [[x0, ya], [x0 + fw / 2, ya], [x0 + fw, ya], [x0 + fw, yb], [x0 + fw / 2, yb], [x0, yb]].map(([x, y]) => welle(x, y));
    st += `<path d="${P(pts)}" fill="${i % 2 ? "#ffffff" : "#1f5fb0"}"/>`;
  }
  st += `<path d="${P([[x0, y0], [x0 + fw * 0.37, y0], [x0 + fw * 0.37, y0 + fh * 5 / 9], [x0, y0 + fh * 5 / 9]].map(([x, y]) => welle(x, y)))}" fill="#1f5fb0"/>`;
  st += `<rect x="${r(x0)}" y="${r(y0 + fh * 2 / 9)}" width="${r(fw * 0.37)}" height="${r(fh / 9)}" fill="#ffffff"/><rect x="${r(x0 + fw * 0.37 / 2 - fh / 18)}" y="${r(y0)}" width="${r(fh / 9)}" height="${r(fh * 5 / 9)}" fill="#ffffff"/>`;
  k += st + `<path d="M${r(x0)} ${r(y0)} L${r(x0 + fw)} ${r(y0)}" stroke="#ffffff" stroke-width=".2" opacity=".6"/>`;
  S.teil({ oben: true, anker: [a[0], a[1]], id: "flagge", de: "die Flagge", syl: "FLAG-ge", it: "la bandiera", itSyl: "ban-DIE-ra", en: "flag", x: 0, y: 0, kunst: k + flaeche(a[0] - 1.2, b[1] - 0.8, fw + 2.2, a[1] - b[1] + 1),
    tipp: "Auf der Akropolis weht die griechische Flagge. Man sagt, die neun Streifen stehen für die Silben von „Freiheit oder Tod“." });
}

/* =====================================================================
   8 — DAS THEATER: Odeion des Herodes Atticus (Peilung 57°, 470–560 m)
   Zuschauerraum: Halbkreis aus weißem Marmor (Radius ≈ 38 m), steigt nach
   Norden zum Felsen an und ist uns zugewandt; davor (südlich) die lange
   Bühnenwand als Ruine: Mitte höher, unten drei große Bogentore, darüber
   zwei Reihen Bogenfenster, grau-braunes Mauerwerk.
   ===================================================================== */
{
  let k = "";
  const C = [-185, -78], R0 = 10, R1 = 38, zR = (rr) => 105 + (rr - R0) * 0.78;
  const bog = (rr, z, t0 = 0, t1 = 180) => { const pts = []; for (let t = t0; t <= t1 + 0.01; t += 9) { const a = t * Math.PI / 180; pts.push(pr(C[0] + rr * Math.cos(a), C[1] + rr * Math.sin(a), z)); } return pts; };
  /* Zuschauerraum: die Reihen enden an der Bühnenwand (etwas über den Halbkreis hinaus), alles mit der Cavea-Form beschnitten */
  const T0 = -14, T1 = 194;
  const aussen = bog(R1 + 1.5, zR(R1) + 0.8, T0, T1), innen = bog(R0, zR(R0), T0, T1);
  const caveaD = P([...aussen, ...innen.slice().reverse()]);
  S.def(`<clipPath id="${S.id("caveaclip")}"><path d="${caveaD}"/></clipPath>`);
  k += `<path d="${caveaD}" fill="${S.lg("cavea", [[0, "#f3e6d2"], [0.5, "#e2d2bf"], [1, "#c9b6a8"]], 0, 0, 1, 0)}"/>`;
  let reihen = "", schatten = "";
  for (let rr = R0 + 2.6; rr < R1; rr += 2.6) { if (Math.abs(rr - 25.6) < 1) continue; const pts = bog(rr, zR(rr), T0, T1); reihen += "M" + pts.map(([x, y]) => `${r(x)} ${r(y)}`).join(" L") + " "; schatten += "M" + pts.map(([x, y]) => `${r(x)} ${r(y + 0.45)}`).join(" L") + " "; }
  let gassen = "";
  for (const t of [40, 90, 140]) { const a = t * Math.PI / 180, p1 = pr(C[0] + R0 * Math.cos(a), C[1] + R0 * Math.sin(a), zR(R0)), p2 = pr(C[0] + R1 * Math.cos(a), C[1] + R1 * Math.sin(a), zR(R1)); gassen += `M${r(p1[0])} ${r(p1[1])} L${r(p2[0])} ${r(p2[1])} `; }
  const dia = bog(25.6, zR(25.6), T0, T1);
  k += `<g clip-path="url(#${S.id("caveaclip")})"><path d="${schatten}" stroke="#a8948a" stroke-width=".45" fill="none"/><path d="${reihen}" stroke="#fff7ea" stroke-width=".35" fill="none"/>`;
  k += `<path d="M${dia.map(([x, y]) => `${r(x)} ${r(y)}`).join(" L")}" stroke="#faf2e4" stroke-width="1.5" fill="none"/><path d="M${dia.map(([x, y]) => `${r(x)} ${r(y + 0.9)}`).join(" L")}" stroke="#a8948a" stroke-width=".4" fill="none"/>`;
  k += `<path d="${gassen}" stroke="#bba795" stroke-width="1.1"/><path d="${gassen}" stroke="#f6ecdc" stroke-width=".35" transform="translate(-.4 0)"/></g>`;
  k += `<path d="M${aussen.map(([x, y]) => `${r(x)} ${r(y)}`).join(" L")}" stroke="#9c8676" stroke-width=".7" fill="none"/>`;
  /* Orchestra (Halbrund, Platten) */
  k += `<path d="${P(bog(R0, zR(R0) - 0.6).concat([pr(C[0] - R0, C[1] - 3, zR(R0) - 0.6), pr(C[0] + R0, C[1] - 3, zR(R0) - 0.6)].reverse()))}" fill="#d8cdbd"/>`;
  /* Bühnenwand: lange Ruine, Oberkante unregelmäßig (Mitte höher) */
  const W0 = [-231, -103], W1 = [-139, -97], Z0 = 103;
  const at = (t, z) => [W0[0] + (W1[0] - W0[0]) * t, W0[1] + (W1[1] - W0[1]) * t, z];
  const KANTE_O = [[0, 118.5], [0.05, 119.5], [0.1, 121.8], [0.16, 122.4], [0.2, 124.6], [0.3, 125.2], [0.34, 127.6], [0.46, 128], [0.5, 127.2], [0.58, 127.9], [0.66, 125.6], [0.72, 124.8], [0.76, 122.2], [0.86, 121.4], [0.92, 118.8], [1, 117.2]];
  const um = [...KANTE_O.map(([t, z]) => pr(...at(t, z))), pr(...at(1, Z0)), pr(...at(0, Z0))];
  k += `<path d="${P(um)}" fill="${S.lg("odeion", [[0, "#dcc4a2"], [0.25, "#bba48e"], [1, "#998880"]], 0, 0, 1, 0)}"/>`;
  const zTop = (t) => { for (let i = 0; i < KANTE_O.length - 1; i++) if (t <= KANTE_O[i + 1][0]) return KANTE_O[i][1] + (KANTE_O[i + 1][1] - KANTE_O[i][1]) * (t - KANTE_O[i][0]) / (KANTE_O[i + 1][0] - KANTE_O[i][0]); return 117; };
  let lagen = "";
  for (let z = Z0 + 1.3; z < 127.5; z += 1.3) { let t0 = -1; for (let t = 0; t <= 1.0001; t += 0.02) { const ok = zTop(t) > z + 0.2; if (ok && t0 < 0) t0 = t; if ((!ok || t > 0.99) && t0 >= 0) { if (t - t0 > 0.03) lagen += L3(at(t0, z), at(t, z)) + " "; t0 = -1; } } }
  k += `<path d="${lagen}" stroke="#7e6c66" stroke-width=".18" opacity=".55"/>`;
  /* drei große Bogentore unten in der Mitte, darüber zwei Reihen Bogenfenster */
  const oeff = (t, b, zu, zo) => {
    const a = pr(...at(t - b, zu)), c = pr(...at(t + b, zu)), d = pr(...at(t + b, zo - (zo - zu) * 0.3)), e = pr(...at(t - b, zo - (zo - zu) * 0.3)), top = pr(...at(t, zo));
    return `<path d="M${r(a[0])} ${r(a[1])} L${r(e[0])} ${r(e[1])} Q${r(e[0])} ${r(top[1])} ${r(top[0])} ${r(top[1])} Q${r(d[0])} ${r(top[1])} ${r(d[0])} ${r(d[1])} L${r(c[0])} ${r(c[1])} Z" fill="${S.lg("bogenloch", [[0, "#3e3238"], [1, "#6a5654"]])}"/><path d="M${r(e[0])} ${r(e[1])} Q${r(e[0])} ${r(top[1])} ${r(top[0])} ${r(top[1])}" stroke="#f2dcb6" stroke-width=".3" fill="none"/>`;
  };
  for (const t of [0.38, 0.5, 0.62]) k += oeff(t, 0.045, 103.5, 113.5);
  for (const t of [0.12, 0.22, 0.78, 0.88]) k += oeff(t, 0.022, 104, 109.5);
  for (let i = 0; i < 16; i++) { const t = 0.04 + i * 0.061; if (zTop(t) > 120.6) k += oeff(t, 0.017, 115, 119.6); }
  for (let i = 0; i < 16; i++) { const t = 0.04 + i * 0.061; if (zTop(t) > 126) k += oeff(t, 0.016, 121.6, 125.4); }
  for (const z of [114.2, 120.8]) { let t1 = 0; while (t1 < 1 && zTop(t1) > z + 0.4) t1 += 0.01; k += `<path d="${L3(at(0.02, z), at(Math.min(t1, 1), z))}" stroke="#ecd5b0" stroke-width=".5"/>`; }
  for (let i = 0; i < 10; i++) { const t = rnd(), z = 105 + rnd() * 16, a = pr(...at(t, z)); k += `<ellipse cx="${r(a[0])}" cy="${r(a[1])}" rx="${r(1 + rnd() * 2)}" ry="${r(2 + rnd() * 3)}" fill="#5e4e4c" opacity=".16"/>`; }
  /* Westende im Licht (kurze Seitenwand), keine geschlossene Seite rechts */
  const wa = pr(...at(0, Z0)), wb = pr(...at(0, 118.5)), wc = pr(W0[0], W0[1] + 6, 118.5), wd = pr(W0[0], W0[1] + 6, Z0);
  k += `<path d="${P([wd, wc, wb, wa])}" fill="#ecd2a6"/>`;
  const mz = pr(...at(0.5, 112));
  S.teil({ anker: [mz[0], mz[1]], id: "theater", de: "das Theater", syl: "the-A-ter", it: "il teatro", itSyl: "te-A-tro", en: "theatre", x: 0, y: 0, kunst: k,
    tipp: "Das Odeion des Herodes Atticus ist fast 1900 Jahre alt. Im Sommer gibt es hier Konzerte und Theater unter freiem Himmel." });
}

/* =====================================================================
   9 — DER HÜGEL (Philopappos): Felskuppe vorn, Kante bei rund 62 m
   Lange Abendschatten: Sonne ≈ 6,5° hoch im Westsüdwesten (hinter uns links)
   → Schatten 8,8-mal so lang wie das Ding hoch ist, vom Betrachter weg und
   leicht nach rechts (Azimut 75°), bis sie über die Kante fallen.
   ===================================================================== */
const KANTE = (x) => 205 + 4 * Math.sin(x / 37) + 2.5 * Math.sin(x / 13 + 1);
const schattenBahn = (xf, yf, d, h, b0, b1) => {
  const Zg = EYE - (yf - HOR) * d / F, s0 = (xf - 200) * d / F, L = h * 8.8, li = [], re = [];
  for (let i = 0; i <= 14; i++) {
    const t = i / 14, dd = d + 0.959 * L * t, ss = s0 + 0.284 * L * t, b = (b0 + (b1 - b0) * t) / 2, u = F / dd, y = HOR + (EYE - Zg) * u;
    if (y < KANTE(200 + ss * u) + 0.6) break;
    li.push([200 + (ss - b) * u, y]); re.push([200 + (ss + b) * u, y]);
  }
  return li.length < 2 ? "" : P([...li, ...re.reverse()].map(([x, y]) => [klemm(x, 0, 400), y]));
};
/* Lagen vorn: Menschen, Bäume, Picknick, Katze (x, Fuß-y, Tiefe d) */
const LAGE = {
  tourin: { x: 286, d: 46 }, tour: { x: 322, d: 44 }, oliv: { x: 368, d: 50 }, kiefer: { x: 22, d: 45 },
  pick: { x: 96, d: 27, y: 246 }, katze: { x: 146, d: 27.5, y: 247 }, saeulenrest: { x: 196, d: 38, y: 234 },
};
LAGE.tourin.y = HOR + (EYE - 145.4) * F / LAGE.tourin.d; LAGE.tour.y = HOR + (EYE - 145.5) * F / LAGE.tour.d;
LAGE.oliv.y = KANTE(368) + 15; LAGE.kiefer.y = KANTE(22) + 17;
const SCHATTEN = [
  schattenBahn(LAGE.tourin.x, LAGE.tourin.y, LAGE.tourin.d, 1.66, 0.45, 0.3), schattenBahn(LAGE.tour.x, LAGE.tour.y, LAGE.tour.d, 1.8, 0.5, 0.32),
  schattenBahn(LAGE.oliv.x + 2, LAGE.oliv.y, LAGE.oliv.d, 4.2, 1.2, 6), schattenBahn(LAGE.kiefer.x + 2, LAGE.kiefer.y, LAGE.kiefer.d, 9, 1, 8),
  schattenBahn(LAGE.katze.x + 2, LAGE.katze.y, LAGE.katze.d, 0.32, 0.2, 0.12), schattenBahn(LAGE.saeulenrest.x + 2, LAGE.saeulenrest.y, LAGE.saeulenrest.d, 0.44, 1.5, 1.4),
  schattenBahn(LAGE.pick.x + 8, LAGE.pick.y - 3, LAGE.pick.d, 0.28, 0.5, 0.4),
].filter(Boolean).map((d) => `<path d="${d}" fill="#4a2e3e" opacity=".45" ${W04}/>`).join("");
{
  const pts = [];
  for (let x = 0; x <= 400; x += 10) pts.push([x, KANTE(x)]);
  let k = "";
  /* Bäume am Hang unter der Kante (nur ihre Kronen ragen über die Kante) */
  S.def(`<clipPath id="${S.id("hang")}"><path d="M0 0 H400 V${r(KANTE(400))} ${Array.from({ length: 41 }, (_, i) => `L${400 - i * 10} ${r(KANTE(400 - i * 10))}`).join(" ")} Z"/></clipPath>`);
  let h = "";
  for (const [x, y, g] of [[14, 214, 18], [36, 212, 14], [62, 216, 17], [92, 213, 20], [128, 216, 15], [214, 216, 15], [246, 214, 13], [270, 213, 12], [300, 214, 18], [332, 216, 15], [356, 212, 19], [384, 215, 15]]) h += baumMix(x, y, g);
  k += `<g clip-path="url(#${S.id("hang")})">${h}</g>`;
  k += `<path d="M0 260 ${pts.map(([x, y]) => `L${x} ${r(y)}`).join(" ")} L400 260 Z" fill="${S.lg("kuppe", [[0, "#e6c79c"], [0.4, "#d4b088"], [1, "#b48f72"]])}"/>`;
  /* Fels der Kuppe: große helle Platten (Westlicht), dunkle Mulden, Schichtfugen */
  for (let i = 0; i < 14; i++) { const w = 10 + rnd() * 26, x = w + 3 + rnd() * (394 - 2 * w), y = Math.min(KANTE(x) + 8 + rnd() * 46, 252); k += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(w)}" ry="${r(w * 0.14)}" fill="${rnd() < 0.5 ? "#f3dcb4" : "#a98a70"}" opacity=".45" ${W15}/>`; }
  for (let i = 0; i < 12; i++) { const x = rnd() * 370, y = Math.min(KANTE(x) + 10 + rnd() * 44, 255), w = 10 + rnd() * 24; k += `<path d="M${r(x)} ${r(y)} q${r(w * 0.3)} ${r(-1.2)} ${r(w * 0.6)} ${r(-0.4)} t${r(w * 0.4)} ${r(0.6)}" stroke="#9a7a66" stroke-width=".5" fill="none" opacity=".6"/><path d="M${r(x)} ${r(y - 0.6)} q${r(w * 0.3)} ${r(-1.2)} ${r(w * 0.6)} ${r(-0.4)}" stroke="#fbe8c6" stroke-width=".4" fill="none" opacity=".7"/>`; }
  /* trockenes Gras, Thymian, Steine */
  for (let i = 0; i < 70; i++) {
    const x = rnd() * 400, y = Math.min(KANTE(x) + 2 + rnd() * 52, 257), h2 = 1.2 + (y - 200) * 0.05 * (0.5 + rnd());
    k += `<path d="M${r(x)} ${r(y)} l${r(-0.6 - rnd())} ${r(-h2)} M${r(x + 0.3)} ${r(y)} l${r(0.2)} ${r(-h2 * 1.2)} M${r(x + 0.6)} ${r(y)} l${r(0.8 + rnd())} ${r(-h2)}" stroke="${rnd() < 0.6 ? "#d9b56e" : "#a99560"}" stroke-width=".35"/>`;
  }
  for (let i = 0; i < 7; i++) { const x = 160 + rnd() * 220, y = KANTE(x) + 3 + rnd() * 14; k += baum(x, y, 4 + rnd() * 3, "oel"); }
  for (let i = 0; i < 26; i++) { const x = rnd() * 400, y = Math.min(KANTE(x) + 4 + rnd() * 50, 256), w = 0.8 + rnd() * 2.2; k += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(w)}" ry="${r(w * 0.5)}" fill="#b09078"/><ellipse cx="${r(x - w * 0.25)}" cy="${r(y - w * 0.2)}" rx="${r(w * 0.6)}" ry="${r(w * 0.3)}" fill="#efdcbc"/>`; }
  /* lange Abendschatten */
  k += SCHATTEN;
  /* Steinbank im Stil von Pikionis: grobe Platte auf zwei Steinblöcken, Oberseite im Abendlicht */
  { const { x, y, d } = LAGE.saeulenrest, u = F / d, L = 1.5 * u, H = 0.44 * u, T = 2.2;
    for (const ox of [-L * 0.36, L * 0.28]) k += `<path d="M${r(x + ox - 3)} ${r(y)} L${r(x + ox - 2.6)} ${r(y - H + 2.6)} L${r(x + ox + 3.4)} ${r(y - H + 2.4)} L${r(x + ox + 3)} ${r(y + 0.2)} Z" fill="#a8907c"/><path d="M${r(x + ox - 3)} ${r(y)} L${r(x + ox - 2.6)} ${r(y - H + 2.6)} L${r(x + ox - 1.2)} ${r(y - H + 2.6)} L${r(x + ox - 1.4)} ${r(y)} Z" fill="#d9c0a0"/>`;
    k += `<path d="M${r(x - L / 2)} ${r(y - H + 2.6)} L${r(x + L / 2)} ${r(y - H + 2.2)} L${r(x + L / 2 - 1.4)} ${r(y - H - T + 2.2)} L${r(x - L / 2 + 1.2)} ${r(y - H - T + 2.4)} Z" fill="#f2dcb6"/>`;
    k += `<path d="M${r(x - L / 2)} ${r(y - H + 2.6)} L${r(x + L / 2)} ${r(y - H + 2.2)} L${r(x + L / 2)} ${r(y - H + 3.8)} L${r(x - L / 2)} ${r(y - H + 4.3)} Z" fill="#bca288"/>`;
    k += `<path d="M${r(x - L / 2 + 1.2)} ${r(y - H - T + 2.4)} L${r(x + L / 2 - 1.4)} ${r(y - H - T + 2.2)}" stroke="#fff4dc" stroke-width=".5"/><path d="M${r(x - 4)} ${r(y - H - 0.6)} l2 1.2 M${r(x + 8)} ${r(y - H - 0.2)} l-1.4 1" stroke="#a88a72" stroke-width=".35"/>`; }
  /* Kante: Licht auf dem Grat */
  k += `<path d="M0 ${r(KANTE(0))} ${pts.map(([x, y]) => `L${x} ${r(y)}`).join(" ")}" stroke="#fbe6c0" stroke-width=".8" fill="none"/>`;
  S.teil({ anker: [340, 245], id: "huegel", de: "der Hügel", syl: "HÜ-gel", it: "la collina", itSyl: "col-LI-na", en: "hill", x: 0, y: 0, kunst: k,
    tipp: "Wir stehen auf dem Philopappos-Hügel. Von hier sieht man die Akropolis am schönsten – vor allem bei Sonnenuntergang." });
}

/* =====================================================================
   9b — DER WEG: Pikionis-Pflaster (1954–57) aus unregelmäßigen Steinen
   ===================================================================== */
{
  let k = "";
  const MITTE = [[236, 264], [262, 246], [290, 234], [318, 225], [344, 213]];
  const breite = (y) => 9 + Math.pow((y - 213) / 51, 1.3) * 84;
  /* Mittellinie fein abtasten */
  const ML = [];
  for (let i = 0; i < MITTE.length - 1; i++) for (let t = 0; t < 1; t += 0.25) ML.push([MITTE[i][0] + (MITTE[i + 1][0] - MITTE[i][0]) * t, MITTE[i][1] + (MITTE[i + 1][1] - MITTE[i][1]) * t]);
  ML.push(MITTE[MITTE.length - 1]);
  const links = ML.map(([x, y]) => [x - breite(y) / 2, y]), rechts = ML.map(([x, y]) => [x + breite(y) / 2, y]);
  k += `<path d="${P([...links, ...rechts.slice().reverse()])}" fill="#8f7462"/>`;
  /* Steine: Reihen quer zum Weg, jede Reihe in 3–5 ungleiche Platten geteilt */
  const FARBEN = ["#efe2cb", "#e2cdb0", "#d2b597", "#c9a993", "#f3e8d6", "#bfa79a", "#e6c9a6", "#d8c2b4"];
  for (let i = 0; i < ML.length - 1; i++) {
    const [ax, ay] = ML[i], [bx, by] = ML[i + 1], n = 3 + Math.floor(rnd() * 3);
    const ba = breite(ay), bb = breite(by);
    let ta = 0;
    for (let j = 0; j < n; j++) {
      const tb = j === n - 1 ? 1 : Math.min(1, ta + (0.6 + rnd() * 0.8) / n);
      const g = 0.35 + (ay - 214) * 0.012;
      const p1 = [ax - ba / 2 + ba * ta + g, ay - g * 0.3], p2 = [ax - ba / 2 + ba * tb - g, ay - g * 0.3], p3 = [bx - bb / 2 + bb * tb - g, by + g * 0.3], p4 = [bx - bb / 2 + bb * ta + g, by + g * 0.3];
      const f = FARBEN[Math.floor(rnd() * FARBEN.length)];
      k += `<path d="${P([p1, p2, p3, p4])}" fill="${f}"/><path d="M${r(p4[0])} ${r(p4[1])} L${r(p1[0])} ${r(p1[1])} L${r(p2[0])} ${r(p2[1])}" stroke="#fff6e4" stroke-width="${r(0.2 + g * 0.3)}" fill="none" opacity=".8"/>`;
      ta = tb;
      if (ta >= 1) break;
    }
  }
  /* Randsteine */
  k += `<path d="${glatt(links, false)}" stroke="#c9a888" stroke-width="1.2" fill="none" opacity=".7"/>`;
  /* die langen Abendschatten liegen auch auf dem Pflaster */
  S.def(`<clipPath id="${S.id("wegclip")}"><path d="${P([...links, ...rechts.slice().reverse()])}"/></clipPath>`);
  k += `<g clip-path="url(#${S.id("wegclip")})">${SCHATTEN}</g>`;
  S.teil({ anker: [262, 246], id: "weg", de: "der Weg", syl: "WEG", it: "il sentiero", itSyl: "sen-TIE-ro", en: "path", x: 0, y: 0, kunst: k,
    tipp: "Die Wege aus alten Steinen hat der Architekt Dimitris Pikionis in den 1950er-Jahren angelegt. Jeder Stein ist anders." });
}

/* =====================================================================
   10 — DIE KIEFER: große Aleppo-Kiefer vorn links (45 m)
   krummer, nach rechts geneigter Stamm, oben in drei sich verjüngende Äste
   geteilt; jedes Nadelbüschel sitzt an einem Zweig; Borke nur im Stamm
   ===================================================================== */
{
  const { x: sx, y: sy } = LAGE.kiefer;
  let k = "";
  /* sich verjüngender Ast/Stamm als Fläche entlang einer Mittellinie */
  const glied = (pts, w0, w1) => { const L = [], R = []; pts.forEach((p, i) => { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, w = (w0 + (w1 - w0) * i / (pts.length - 1)) / 2; L.push([p[0] - dy / l * w, p[1] + dx / l * w]); R.push([p[0] + dy / l * w, p[1] - dx / l * w]); }); return glatt([...L, ...R.reverse()]); };
  const STAMM = [[sx + 1, sy + 1], [sx + 1, sy - 20], [sx + 4, sy - 60], [sx + 10, sy - 100], [sx + 16, sy - 128], [sx + 17, sy - 146]];
  const AESTE = [
    [[[sx + 17, sy - 144], [sx + 8, sy - 160], [sx - 6, sy - 170], [sx - 22, sy - 172]], 4, 1.2],
    [[[sx + 17, sy - 146], [sx + 18, sy - 166], [sx + 14, sy - 186], [sx + 8, sy - 198]], 3.6, 1],
    [[[sx + 16, sy - 140], [sx + 30, sy - 156], [sx + 46, sy - 170], [sx + 62, sy - 172]], 3.8, 1.1],
    [[[sx + 14, sy - 124], [sx + 30, sy - 132], [sx + 48, sy - 136], [sx + 60, sy - 134]], 2.6, 0.8],
  ];
  const stammD = glied(STAMM, 11, 5.5);
  k += `<path d="${stammD}" fill="${S.lg("kiefernstamm", [[0, "#cdb498"], [0.4, "#8c7664"], [1, "#4a3c34"]], 0, 0, 1, 0)}"/>`;
  for (const [pts, w0, w1] of AESTE) k += `<path d="${glied(pts, w0, w1)}" fill="#6a5444"/>`;
  /* Borke nur im Stamm: Längsrisse und Platten (Clip mit dem Stammumriss) */
  S.def(`<clipPath id="${S.id("stammclip")}"><path d="${stammD}"/></clipPath>`);
  let bo = "";
  for (let i = 0; i < 26; i++) { const t = rnd() * 0.95, seg = t * (STAMM.length - 1), j = Math.floor(seg), f = seg - j, A = STAMM[j], Bq = STAMM[j + 1], cx = A[0] + (Bq[0] - A[0]) * f + (rnd() - 0.5) * 7, cy = A[1] + (Bq[1] - A[1]) * f; bo += `M${r(cx)} ${r(cy)} l${r(0.6 + rnd() * 0.6)} ${r(-3 - rnd() * 5)} `; }
  k += `<g clip-path="url(#${S.id("stammclip")})"><path d="${bo}" stroke="#3e3028" stroke-width=".55" fill="none" opacity=".8"/></g>`;
  /* Nadelbüschel: flach, breiter als hoch, Rand aus feinen Nadelstrichen; je Büschel ein Zweig */
  const buesch = (x, y, w, h, vonX, vonY) => {
    let c = `<path d="M${r(vonX)} ${r(vonY)} Q${r((vonX + x) / 2)} ${r(Math.min(vonY, y) - 2)} ${r(x)} ${r(y + h * 0.2)}" stroke="#5a4636" stroke-width=".9" fill="none"/>`;
    const blob = (cx, cy, ww, hh, f) => { const pt = []; for (let i = 0; i < 20; i++) { const a = i / 20 * Math.PI * 2, rr = 0.85 + rnd() * 0.25; pt.push([klemm(cx + Math.cos(a) * ww / 2 * rr, 0, 400), Math.max(cy + Math.sin(a) * hh / 2 * rr, 0.5)]); } return `<path d="${glatt(pt)}" fill="${f}"/>`; };
    c += blob(x, y, w, h, "#435a30") + blob(x - w * 0.08, y - h * 0.12, w * 0.8, h * 0.7, "#6c8442") + blob(x - w * 0.2, y - h * 0.26, w * 0.42, h * 0.38, "#a1ae5c");
    let hell = "", dunkel = "";
    for (let i = 0; i < 26; i++) { const a = Math.PI + i / 25 * Math.PI, rx = Math.cos(a) * w / 2, ry = Math.sin(a) * h / 2, l = 1.2 + rnd() * 1.4; hell += `M${r(klemm(x + rx * 0.85, 0, 400))} ${r(Math.max(y + ry * 0.85, 0.3))} l${r(Math.cos(a + (rnd() - 0.5) * 0.6) * l)} ${r(Math.sin(a + (rnd() - 0.5) * 0.6) * l * 0.8)} `; }
    for (let i = 0; i < 16; i++) { const a = i / 15 * Math.PI, rx = Math.cos(a) * w / 2, ry = Math.sin(a) * h / 2, l = 1 + rnd(); dunkel += `M${r(klemm(x + rx * 0.85, 0, 400))} ${r(y + ry * 0.85)} l${r(Math.cos(a) * l * 0.5)} ${r(Math.sin(a) * l)} `; }
    return c + `<path d="${hell}" stroke="#93a656" stroke-width=".35" fill="none"/><path d="${dunkel}" stroke="#34452a" stroke-width=".35" fill="none"/>`;
  };
  const B2 = [
    [sx - 20, sy - 176, 30, 12, sx - 14, sy - 171], [sx - 6, sy - 168, 22, 10, sx + 2, sy - 165], [sx + 8, sy - 202, 26, 11, sx + 9, sy - 196],
    [sx + 18, sy - 186, 22, 10, sx + 15, sy - 180], [sx + 40, sy - 178, 30, 12, sx + 40, sy - 166], [sx + 62, sy - 176, 22, 10, sx + 58, sy - 171],
    [sx + 54, sy - 140, 24, 10, sx + 52, sy - 136], [sx + 32, sy - 140, 18, 8, sx + 32, sy - 132], [sx - 32, sy - 168, 16, 8, sx - 22, sy - 172],
  ];
  for (const [x, y, w, h, vx, vy] of B2) k += buesch(x, y, w, h, vx, vy);
  for (const [dx, dy] of [[-12, -170], [44, -170], [56, -134]]) k += `<ellipse cx="${sx + dx}" cy="${r(sy + dy)}" rx=".9" ry="1.4" fill="#7a5236"/><ellipse cx="${sx + dx - 0.3}" cy="${r(sy + dy - 0.4)}" rx=".4" ry=".6" fill="#c08a5a"/>`;
  S.teil({ anker: [sx + 10, sy - 90], id: "kiefer", de: "die Kiefer", syl: "KIE-fer", it: "il pino", itSyl: "PI-no", en: "pine tree", x: 0, y: 0, kunst: k,
    tipp: "Auf den Hügeln von Athen wachsen Aleppo-Kiefern. An heißen Tagen duftet ihr Harz in der ganzen Luft." });
}

/* =====================================================================
   11 — DER OLIVENBAUM (rechts, 50 m): knorriger Stamm, silbrige Krone
   ===================================================================== */
{
  const u = F / 50, x = 368, y = KANTE(368) + 15;
  let k = "";
  /* Stamm: gedreht, geteilt, mit Höhlungen */
  k += `<path d="M${x - 6} ${r(y)} Q${x - 2} ${r(y - 10)} ${x - 5} ${r(y - 22)} Q${x - 9} ${r(y - 34)} ${x - 14} ${r(y - 44)} L${x - 11} ${r(y - 45)} Q${x - 4} ${r(y - 34)} ${x - 1} ${r(y - 26)} Q${x + 2} ${r(y - 36)} ${x + 8} ${r(y - 46)} L${x + 11} ${r(y - 44)} Q${x + 5} ${r(y - 32)} ${x + 4} ${r(y - 20)} Q${x + 3} ${r(y - 8)} ${x + 7} ${r(y)} Z" fill="${S.lg("olivstamm", [[0, "#c9b496"], [0.4, "#8f7a64"], [1, "#4f4236"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${x - 2} ${r(y - 6)} q1.6 -6 -.6 -12 M${x + 2} ${r(y - 12)} q1.4 -5 -.2 -9" stroke="#3e342a" stroke-width=".7" fill="none"/><ellipse cx="${x}" cy="${r(y - 16)}" rx="1.2" ry="2.4" fill="#3a3028"/>`;
  /* Krone: gelappte Wolken aus silbergrünen Blättern, Unterseite dunkler, Löcher mit Himmel */
  const LAPPEN = [[-22, -54, 14, 9], [-6, -62, 16, 10], [12, -58, 15, 9], [26, -48, 12, 8], [-30, -44, 11, 7], [-12, -46, 12, 7], [8, -44, 12, 7], [30, -36, 9, 6], [-38, -34, 8, 5]];
  for (const [dx, dy, w, h] of LAPPEN) {
    const cx = x + dx, cy = y + dy;
    k += `<path d="M${r(klemm(cx - w, 0, 400))} ${r(cy + h * 0.3)} Q${r(klemm(cx - w * 1.05, 0, 400))} ${r(cy - h * 0.7)} ${r(klemm(cx - w * 0.4, 0, 400))} ${r(cy - h)} Q${r(klemm(cx + w * 0.2, 0, 400))} ${r(cy - h * 1.25)} ${r(klemm(cx + w * 0.7, 0, 400))} ${r(cy - h * 0.7)} Q${r(klemm(cx + w * 1.1, 0, 400))} ${r(cy - h * 0.1)} ${r(klemm(cx + w * 0.8, 0, 400))} ${r(cy + h * 0.45)} Q${r(cx)} ${r(cy + h * 0.8)} ${r(klemm(cx - w, 0, 400))} ${r(cy + h * 0.3)} Z" fill="#5a6a4c"/><path d="M${r(klemm(cx - w * 0.9, 0, 400))} ${r(cy + h * 0.25)} Q${r(cx)} ${r(cy + h * 0.75)} ${r(klemm(cx + w * 0.75, 0, 400))} ${r(cy + h * 0.4)}" stroke="#3e4a34" stroke-width="${r(h * 0.35)}" fill="none" opacity=".55"/>`;
    for (let i = 0; i < 9; i++) { const ax = cx + (rnd() - 0.6) * w * 1.4, ay = cy + (rnd() - 0.7) * h * 1.2; if (ax > 399) continue; k += `<ellipse cx="${r(ax)}" cy="${r(ay)}" rx="${r(1.2 + rnd() * 1.6)}" ry="${r(0.6 + rnd() * 0.6)}" transform="rotate(${r(-30 + rnd() * 60)} ${r(ax)} ${r(ay)})" fill="${rnd() < 0.5 ? "#a9b48c" : "#c9ccaa"}"/>`; }
  }
  for (const [dx, dy, rr] of [[-14, -50, 2.2], [4, -52, 1.8], [20, -44, 1.6], [-26, -40, 1.4]]) k += `<ellipse cx="${r(x + dx)}" cy="${r(y + dy)}" rx="${rr}" ry="${r(rr * 0.7)}" fill="#3e4634"/>`;
  k += `<path d="M${x - 11} ${r(y - 45)} Q${x - 18} ${r(y - 50)} ${x - 24} ${r(y - 52)} M${x + 9} ${r(y - 45)} Q${x + 16} ${r(y - 48)} ${x + 22} ${r(y - 46)} M${x - 1} ${r(y - 27)} Q${x + 1} ${r(y - 40)} ${x - 2} ${r(y - 52)}" stroke="#6e5c4a" stroke-width="1.3" fill="none" stroke-linecap="round"/>`;
  S.teil({ anker: [x, y], id: "olivenbaum", de: "der Olivenbaum", syl: "o-LI-ven-baum", it: "l'olivo", itSyl: "o-LI-vo", en: "olive tree", x: 0, y: 0, kunst: k,
    tipp: "Olivenbäume werden Hunderte Jahre alt. Aus ihren Früchten presst man Olivenöl." });
}

/* =====================================================================
   12 — DAS PICKNICK vorn links (Lupe: das Gyros, die Olive, die Wasserflasche)
   ===================================================================== */
const pickUnter = [];
{
  const { x: X, y: Y, d } = LAGE.pick, u = F / d, q = u / 29.5;   /* Dinge im Maßstab von 29,5 Einheiten je Meter gezeichnet, dann vergrößert */
  let k = "";
  /* Decke blau-weiß gestreift (Farben der Flagge), flach auf dem Fels, mit Falten */
  const w = 1.5 * u, t = 5.4;
  k += `<path d="M${r(X - w / 2)} ${r(Y)} L${r(X + w / 2)} ${r(Y + 0.6)} L${r(X + w / 2 - 4)} ${r(Y - t)} L${r(X - w / 2 + 3)} ${r(Y - t - 0.4)} Z" fill="#f6f2ea"/>`;
  for (let i = 0; i < 9; i++) { const f0 = (i + 0.25) / 9, f1 = (i + 0.7) / 9, xa = (f) => X - w / 2 + f * w, xb = (f) => X - w / 2 + 3 + f * (w - 7); k += `<path d="M${r(xa(f0))} ${r(Y + f0 * 0.6)} L${r(xa(f1))} ${r(Y + f1 * 0.6)} L${r(xb(f1))} ${r(Y - t - 0.4 + f1 * 0.4)} L${r(xb(f0))} ${r(Y - t - 0.4 + f0 * 0.4)} Z" fill="#2c66b8"/>`; }
  k += `<path d="M${r(X - w / 2 + 6)} ${r(Y - 1.6)} q12 -1.4 26 .4 M${r(X + 4)} ${r(Y - 3.8)} q8 -.8 16 .4" stroke="#ffffff" stroke-width=".6" fill="none" opacity=".5"/>`;
  /* Gegenstände (gezeichnet um 0/0, vergrößert um q) */
  let g = "";
  const gx = -6, gy = -0.8;
  g += `<path d="M${r(gx - 3)} ${r(gy)} L${r(gx - 2.2)} ${r(gy - 4.6)} L${r(gx + 2.2)} ${r(gy - 4.6)} L${r(gx + 3)} ${r(gy)} Z" fill="#f3ead6"/><path d="M${r(gx + 0.6)} ${r(gy)} L${r(gx + 1.2)} ${r(gy - 4.6)} L${r(gx + 2.2)} ${r(gy - 4.6)} L${r(gx + 3)} ${r(gy)} Z" fill="#d9ccb4"/>`;
  g += `<path d="M${r(gx - 2.2)} ${r(gy - 4.6)} Q${r(gx)} ${r(gy - 7)} ${r(gx + 2.2)} ${r(gy - 4.6)} Z" fill="#d9a85e"/><path d="M${r(gx - 1.2)} ${r(gy - 5.4)} l-.3 -1.6 M${r(gx - 0.3)} ${r(gy - 5.6)} l.1 -1.9 M${r(gx + 0.8)} ${r(gy - 5.4)} l.4 -1.5" stroke="#f2c64a" stroke-width=".45"/><circle cx="${r(gx + 1.3)}" cy="${r(gy - 5.2)}" r=".5" fill="#d8322a"/><path d="M${r(gx - 1.6)} ${r(gy - 4.9)} q.6 -.6 1.2 0" stroke="#5a8a3a" stroke-width=".4" fill="none"/>`;
  g += `<path d="M${r(gx - 2.6)} ${r(gy - 2.2)} L${r(gx + 2.6)} ${r(gy - 2.2)}" stroke="#2c66b8" stroke-width=".35"/>`;
  const ox = 1, oy = -1;
  g += `<path d="M${r(ox - 2.6)} ${r(oy - 1.4)} Q${r(ox)} ${r(oy + 0.8)} ${r(ox + 2.6)} ${r(oy - 1.4)} Z" fill="#f6efe2"/><ellipse cx="${r(ox)}" cy="${r(oy - 1.4)}" rx="2.6" ry=".6" fill="#e2d8c6"/>`;
  for (const [dx, dy] of [[-1.3, -1.6], [-0.4, -1.9], [0.5, -1.7], [1.3, -1.5], [0, -2.3], [-0.9, -2.2], [0.9, -2.2]]) g += `<ellipse cx="${r(ox + dx)}" cy="${r(oy + dy)}" rx=".55" ry=".4" fill="${S.lg("olive", [[0, "#7a4a6a"], [1, "#3a1e30"]])}"/><circle cx="${r(ox + dx - 0.15)}" cy="${r(oy + dy - 0.15)}" r=".14" fill="#d8b8c8"/>`;
  const fx = 7.5, fy = -0.9;
  g += `<path d="M${r(fx - 1.1)} ${r(fy)} L${r(fx - 1.1)} ${r(fy - 4.4)} Q${r(fx - 1.1)} ${r(fy - 5.4)} ${r(fx - 0.5)} ${r(fy - 5.8)} L${r(fx - 0.5)} ${r(fy - 6.6)} L${r(fx + 0.5)} ${r(fy - 6.6)} L${r(fx + 0.5)} ${r(fy - 5.8)} Q${r(fx + 1.1)} ${r(fy - 5.4)} ${r(fx + 1.1)} ${r(fy - 4.4)} L${r(fx + 1.1)} ${r(fy)} Z" fill="${S.lg("flasche", [[0, "#e9f4f8", 0.9], [0.5, "#a9cfe0", 0.75], [1, "#6f9fb8", 0.85]], 0, 0, 1, 0)}"/>`;
  g += `<rect x="${r(fx - 0.55)}" y="${r(fy - 7.3)}" width="1.1" height=".8" fill="#2c66b8"/><rect x="${r(fx - 1.1)}" y="${r(fy - 3.4)}" width="2.2" height="1.3" fill="#f2f2ee"/><path d="M${r(fx - 0.6)} ${r(fy - 0.4)} V${r(fy - 4.6)}" stroke="#ffffff" stroke-width=".3" opacity=".8"/>`;
  /* kleine Abendschatten der Dinge nach rechts oben */
  g = `<path d="M${gx + 2} ${gy} l6 -2.4 l1 .8 Z M${fx + 1} ${fy} l7 -2.6 l.8 .8 Z" fill="#4a2e3e" opacity=".3"/>` + g;
  const GX = X - 6, GY = Y - 2.5;
  k += `<g transform="translate(${r(GX)} ${r(GY)}) scale(${q.toFixed(3)})">${g}</g>`;
  const tf = (x0, y0) => [r(GX + x0 * q), r(GY + y0 * q)];
  const sc = (f) => `<g transform="scale(${q.toFixed(3)})">${f}</g>`;
  { const [x, y] = tf(gx, gy + 0.4); pickUnter.push({ id: "gyros", de: "das Gyros", syl: "GY-ros", it: "il gyros", itSyl: "GHI-ros", en: "gyros", x, y, kunst: sc(flaeche(-3.4, -7.6, 6.8, 8)),
    tipp: "Gyros ist Fleisch vom Drehspieß. In der Pita mit Tomaten, Zwiebeln, Tsatsiki und Pommes ist es ein beliebter Imbiss." }); }
  { const [x, y] = tf(ox, oy + 0.4); pickUnter.push({ id: "olive", de: "die Olive", syl: "o-LI-ve", it: "l'oliva", itSyl: "o-LI-va", en: "olive", x, y, kunst: sc(flaeche(-3, -3.4, 6, 3.8)),
    tipp: "Griechenland ist eines der größten Olivenländer der Welt. Die dunklen Kalamata-Oliven sind besonders bekannt." }); }
  { const [x, y] = tf(fx, fy + 0.4); pickUnter.push({ id: "wasserflasche", de: "die Wasserflasche", syl: "WAS-ser-fla-sche", it: "la bottiglia d'acqua", itSyl: "bot-TI-glia DAC-qua", en: "water bottle", x, y, kunst: sc(flaeche(-1.8, -8, 3.6, 8.4)),
    tipp: "Im Sommer wird es in Athen über 35 Grad heiß. Nimm immer Wasser mit auf die Akropolis!" }); }
  S.teil({ anker: [X, Y], id: "picknick", de: "das Picknick", syl: "PICK-nick", it: "il picnic", itSyl: "PIC-nic", en: "picnic", x: 0, y: 0, kunst: k,
    zoom: { x: r(X - 30), y: r(Y - 26), w: 48, h: 32 }, unter: pickUnter,
    tipp: "Auf dem Philopappos-Hügel machen viele Familien am Abend ein Picknick." });
}

/* =====================================================================
   13 — DIE KATZE (getigert, sitzt neben der Decke und schaut zum Gyros)
   ===================================================================== */
{
  const { x, y, d } = LAGE.katze, u = F / d, s = u / 100;   /* 1 Einheit hier = 1 cm */
  const FELL = S.lg("katze", [[0, "#f6c88e"], [0.45, "#d08a46"], [1, "#7a4a24"]], 0, 0, 1, 0);
  let k = `<g transform="scale(${s.toFixed(4)})">`;
  /* Schwanz um die Pfoten gelegt (rechts), Körper im Profil nach links, Kopf zum Gyros gedreht */
  k += `<path d="M10 -1 Q20 1 19 -6 Q18.4 -9 15 -8" stroke="#9c5e2c" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M18 -7 l1 -1.4" stroke="#5a3418" stroke-width="2.2" stroke-linecap="round"/>`;
  k += `<path d="M-8 0 Q-11 -9 -7 -17 Q-4 -22 1 -21 Q8 -20 11 -12 Q13 -5 11 0 Z" fill="${FELL}"/>`;
  k += `<path d="M2 -19 q3 3 2 8 M6 -17 q3 4 1.6 9 M9 -13 q2 4 .6 8" stroke="#7a4420" stroke-width="1.5" fill="none" opacity=".75"/>`;
  k += `<path d="M-7 0 Q-7.6 -5 -6 -9 M-3 0 Q-3.2 -4 -2.4 -6" stroke="#f9dcb0" stroke-width="1.6" fill="none"/>`;
  k += `<path d="M-14 -22 Q-15 -28 -9.6 -29.6 Q-4 -30.6 -2.4 -25.6 Q-2 -21 -6.6 -19.6 Q-12 -18.6 -14 -22 Z" fill="${FELL}"/>`;
  k += `<path d="M-12.6 -27.6 L-14 -34 L-9.4 -29.6 Z M-6.4 -29.8 L-4.6 -35.6 L-3 -28.6 Z" fill="#c07a3c"/><path d="M-12.4 -28.6 L-13.2 -32.4 L-10.6 -29.8 Z" fill="#eaa49c"/>`;
  k += `<ellipse cx="-11.6" cy="-24.8" rx="1.1" ry=".8" fill="#5c7a2e"/><ellipse cx="-11.8" cy="-24.8" rx=".3" ry=".7" fill="#141010"/><path d="M-14.2 -22.6 l-.8 .3 M-14 -22 q-3 0 -4.6 .8 M-14 -21.4 q-3 .8 -4.2 2" stroke="#fff4e0" stroke-width=".3" fill="none"/>`;
  k += `<path d="M-13 -26.2 q2 -1.4 4.6 -.6 M-6 -27 q1.4 1.6 .6 4" stroke="#7a4420" stroke-width=".9" fill="none" opacity=".7"/></g>`;
  S.teil({ oben: true, id: "katze", de: "die Katze", syl: "KAT-ze", it: "il gatto", itSyl: "GAT-to", en: "cat", x, y: r(y), kunst: k + flaeche(-19 * s, -37 * s, 41 * s, 38 * s),
    tipp: "In Athen leben viele Katzen auf der Straße und an den alten Ruinen. Diese hier hätte gern etwas vom Gyros." });
}

/* =====================================================================
   14 — DIE TOURISTIN mit 15 — DEM SONNENHUT; 16 — DER TOURIST mit 17 — DER KAMERA
   ===================================================================== */
{
  const { x, d, y } = LAGE.tourin, u = F / d;
  const m = B.mensch({ id: "ath_tourin", geschlecht: "w", blick: 192, frisur: "zopf", haarfarbe: "hellbraun", haut: "hell",
    pose: "kontrapost", kleidung: { kleid: { stueck: "sommerkleid", farbe: "#e9e1d0" }, schuhe: { stueck: "sandale", farbe: "braun" }, zubehoer: { stueck: "tasche", farbe: "#b5653a" } } }, 1.66 * u);
  S.teil({ id: "touristin", de: "die Touristin", syl: "tou-RIS-tin", it: "la turista", itSyl: "tu-RI-sta", en: "tourist", x, y: r(y), kunst: vereinfache(m.svg, 1.8),
    tipp: "Die Touristin bewundert die Akropolis im Abendlicht." });
  /* der Sonnenhut: breite Krempe aus Stroh mit schwarzem Band (eigenes Teil, liegt auf dem Kopf) */
  const sch = m.z.punkte.scheitel, hx = x + sch[0] * m.k, hy = y + (sch[1] + 4) * m.k, hs = m.k;
  let h = `<ellipse cx="0" cy="0" rx="${r(21 * hs)}" ry="${r(5 * hs)}" fill="${S.lg("stroh", [[0, "#fff0c4"], [0.6, "#e8cf8e"], [1, "#b8995a"]], 0, 0, 1, 0)}"/>`;
  h += `<path d="M${r(-10 * hs)} 0 Q${r(-10 * hs)} ${r(-9 * hs)} 0 ${r(-9.5 * hs)} Q${r(10 * hs)} ${r(-9 * hs)} ${r(10 * hs)} 0 Z" fill="${S.lg("stroh", [[0, "#fff0c4"], [0.6, "#e8cf8e"], [1, "#b8995a"]], 0, 0, 1, 0)}"/>`;
  h += `<path d="M${r(-10 * hs)} ${r(-1 * hs)} Q0 ${r(1.2 * hs)} ${r(10 * hs)} ${r(-1 * hs)} L${r(10 * hs)} ${r(-3.4 * hs)} Q0 ${r(-1.4 * hs)} ${r(-10 * hs)} ${r(-3.4 * hs)} Z" fill="#2a2420"/>`;
  h += `<path d="M${r(-19 * hs)} ${r(1.5 * hs)} Q0 ${r(6.5 * hs)} ${r(19 * hs)} ${r(1.5 * hs)}" stroke="#a8884c" stroke-width="${r(0.8 * hs)}" fill="none"/>`;
  S.teil({ oben: true, id: "sonnenhut", de: "der Sonnenhut", syl: "SON-nen-hut", it: "il cappello da sole", itSyl: "cap-PEL-lo da SO-le", en: "sun hat", x: r(hx), y: r(hy), kunst: h + flaeche(-4.6, -6, 9.2, 7.4),
    tipp: "Auf der Akropolis gibt es kaum Schatten. Ein Sonnenhut schützt vor der Sonne." });
}
{
  const { x, d, y } = LAGE.tour, u = F / d;
  const foto = {
    lende: 1, brust: -3, nacken: 2, kopf: -6,
    schulterL: { vor: 66, seit: 14 }, ellbogenL: 100, unterarmL: 40, handL: 10, fingerL: 0.5,
    schulterR: { vor: 64, seit: 16 }, ellbogenR: 102, unterarmR: 40, handR: 10, fingerR: 0.5,
    huefteL: { vor: 3, seit: 3, dreh: -6 }, knieL: 3, fussL: 0, huefteR: { vor: -6, seit: 4, dreh: -10 }, knieR: 6, fussR: 4,
  };
  const m = B.mensch({ id: "ath_tour", geschlecht: "m", pose: foto, blick: 196, frisur: "kurz", haarfarbe: "dunkelbraun", haut: "hell",
    kleidung: { oberteil: { stueck: "hemd", farbe: "#7a9cc0" }, unterteil: { stueck: "shorts", farbe: "#6a6a5a" }, schuhe: { stueck: "turnschuh" }, zubehoer: { stueck: "rucksack", farbe: "#3a5a4a" } } }, 1.8 * u);
  S.teil({ id: "tourist", de: "der Tourist", syl: "tou-RIST", it: "il turista", itSyl: "tu-RI-sta", en: "tourist", x, y: r(y), kunst: vereinfache(m.svg, 1.8),
    tipp: "Der Tourist ist mit dem Rucksack zu Fuß auf den Hügel gestiegen. Kurz vor Sonnenuntergang leuchtet der Marmor golden." });
  /* die Kamera: Spiegelreflex mit Objektiv, von hinten gesehen (Display zu uns) */
  const hs = [m.z.handL, m.z.handR].filter(Boolean);
  const kx = x + hs.reduce((a, h) => a + h.x, 0) / hs.length * m.k, ky = y + Math.min(...hs.map((h) => h.y)) * m.k;
  const cw = 0.14 * u, ch = 0.1 * u;
  let c = `<rect x="${r(-cw / 2)}" y="${r(-ch / 2)}" width="${r(cw)}" height="${r(ch)}" rx=".4" fill="#24262a"/><rect x="${r(-cw * 0.32)}" y="${r(-ch * 0.62)}" width="${r(cw * 0.3)}" height="${r(ch * 0.2)}" fill="#2e3034"/>`;
  c += `<rect x="${r(-cw * 0.38)}" y="${r(-ch * 0.28)}" width="${r(cw * 0.56)}" height="${r(ch * 0.56)}" fill="${S.lg("display", [[0, "#7f97c4"], [0.6, "#e9c7a6"], [1, "#b8866a"]])}"/><rect x="${r(cw * 0.26)}" y="${r(-ch * 0.2)}" width="${r(cw * 0.12)}" height="${r(ch * 0.12)}" fill="#8a8e94"/>`;
  c += `<rect x="${r(-cw / 2)}" y="${r(-ch / 2)}" width="${r(cw)}" height=".3" fill="#5a5e64"/>`;
  S.teil({ oben: true, id: "kamera", de: "die Kamera", syl: "KA-me-ra", it: "la macchina fotografica", itSyl: "MAC-chi-na fo-to-GRA-fi-ca", en: "camera", x: r(kx), y: r(ky - ch * 0.2), kunst: c + flaeche(-4.6, -3.6, 9.2, 7.2),
    tipp: "Mit der Kamera fotografiert er den Parthenon im Abendlicht." });
}

/* VORNE: Abendlicht von hinten links (fängt keinen Tipp ab) */
S.davor(`<rect width="400" height="260" fill="${S.lg("abendlicht", [[0, "#ffcf8a", 0.14], [0.55, "#ffcf8a", 0], [1, "#3a2a5a", 0.06]], 0, 1, 1, 0)}" pointer-events="none"/>`);

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/athen.js"));
console.log(aus);
