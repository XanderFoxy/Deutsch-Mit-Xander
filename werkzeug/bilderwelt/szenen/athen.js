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
     Gebälk (sechs Säulen zerstört), man sieht hindurch auf die Nordseite.
     Restaurierung seit 1975: das Gerüst an der Westseite ist seit 2025/26
     fort (Arbeiten abgeschlossen), an der Nordseite wird weiter
     gearbeitet; im Inneren steht ein Baukran (UNSICHER: Lage/Höhe
     geschätzt).
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
     (heiliger Baum der Athene), Aleppo-Kiefern (Harz für Retsina),
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
  S.teil({ anker: [x, 90], id: "lykabettus", de: "der Lykabettus", syl: "ly-KA-bet-tus", it: "il Licabetto", itSyl: "li-ca-BET-to", en: "Mount Lycabettus", x: 0, y: 0, kunst: k,
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
/* Baumgruppe: gelappte Krone, unten dunkel, oben links golden (Abendsonne), ohne harte Kanten */
const baumgruppe = (x, y, w, h, dunkel = "#3c4a2c", mittel = "#55613a", licht = "#a7a160") => {
  let c = "";
  const n = Math.max(3, Math.round(w / 3.2));
  for (let i = 0; i < n; i++) { const t = n > 1 ? i / (n - 1) : 0.5, cx = x - w / 2 + t * w, cy = y - Math.sin(t * Math.PI) * h * 0.35 - h * 0.3, rr = w / n * 0.95 + rnd() * 0.6; c += `<circle cx="${r(cx)}" cy="${r(cy)}" r="${r(rr)}" fill="${dunkel}"/>`; }
  for (let i = 0; i < n - 1; i++) { const t = (i + 0.5) / (n - 1), cx = x - w / 2 + t * w - 0.5, cy = y - Math.sin(t * Math.PI) * h * 0.35 - h * 0.45, rr = w / n * 0.7; c += `<circle cx="${r(cx)}" cy="${r(cy)}" r="${r(rr)}" fill="${mittel}"/>`; }
  for (let i = 0; i < n - 1; i += 1) { const t = (i + 0.3) / (n - 1), cx = x - w / 2 + t * w - 0.8, cy = y - Math.sin(t * Math.PI) * h * 0.35 - h * 0.6, rr = w / n * 0.42; c += `<circle cx="${r(cx)}" cy="${r(cy)}" r="${r(rr)}" fill="${licht}" opacity=".9"/>`; }
  return c;
};
const zypresse = (x, y, h, w) => `<path d="M${r(x - w / 2)} ${r(y)} Q${r(x - w * 0.6)} ${r(y - h * 0.55)} ${r(x)} ${r(y - h)} Q${r(x + w * 0.6)} ${r(y - h * 0.55)} ${r(x + w / 2)} ${r(y)} Z" fill="#2f3d26"/><path d="M${r(x - w / 2)} ${r(y)} Q${r(x - w * 0.6)} ${r(y - h * 0.55)} ${r(x)} ${r(y - h)} Q${r(x - w * 0.15)} ${r(y - h * 0.5)} ${r(x - w * 0.1)} ${r(y)} Z" fill="#6f7444"/>`;
{
  let k = "";
  /* Mauerkrone von West nach Ost; im Westen der Aufgang (Fels, Treppe, Beulé-Tor) */
  const WEST = [[-215, 6, 116], [-200, 10, 121], [-185, 5, 127], [-170, 0, 133], [-155, 2, 139], [-146, -6, 143.5]];
  const KRONE = [[-146, -10, 143.5], [-142, -22, 143.5], [-126, -28, 149], [-100, -40, 150], [-70, -52, 151], [-30, -55, 151.5], [20, -52, 151.5], [70, -50, 151], [110, -48, 150.5], [152, -42, 150], [160, -44, 146]];
  const FUSS = KRONE.map(([e, n, z]) => [e, n - 3, z - 12]);
  const fussZ = (e) => 126 + 5 * Math.sin(e / 23) + 3 * Math.sin(e / 7.5);
  const OBEN = [...WEST, ...KRONE];
  const UNTEN = OBEN.map(([e, n, z]) => [e, n - 12, Math.min(z - 6, fussZ(e))]);
  const pp = (p) => { const [x, y] = pr(...p); return [klemm(x, 0, 400), y]; };
  /* Hang mit Bäumen bis unter die Kante des Hügels */
  const unten = UNTEN.map(pp);
  k += `<path d="${P([...unten, [400, unten[unten.length - 1][1]], [400, 216], [0, 216], [0, unten[0][1]]])}" fill="${S.lg("hang", [[0, "#7a7a4e"], [0.5, "#55603a"], [1, "#46522f"]])}"/>`;
  /* Fels: Kalkstein, Westflächen golden, Klüfte violett */
  const fels = [...OBEN.map(pp), ...unten.slice().reverse()];
  k += `<path d="${P(fels)}" fill="${S.lg("fels", [[0, "#e9c08e"], [0.3, "#cfa07e"], [0.65, "#b3897c"], [1, "#9a7a78"]], 0, 0, 1, 0)}"/>`;
  /* Felsflächen: helle Westfacetten, violette Klüfte, kurze unregelmäßige Risse */
  for (let i = 0; i < 70; i++) {
    const t = rnd() * (OBEN.length - 1.01), i0 = Math.floor(t), f = t - i0, A = OBEN[i0], Bq = OBEN[i0 + 1];
    const e = A[0] + (Bq[0] - A[0]) * f, n = A[1] + (Bq[1] - A[1]) * f - 6, zt = (A[2] + (Bq[2] - A[2]) * f) - (i0 >= WEST.length ? 13 : 2), zb = Math.min(zt - 3, fussZ(e));
    const z = zb + rnd() * (zt - zb), [x, y, u] = pr(e, n, z);
    if (x > 397 || x < 2) continue;
    const w = (1.5 + rnd() * 3.5) * u, h = (1 + rnd() * 3) * u, art = rnd();
    if (art < 0.45) k += `<path d="M${r(x)} ${r(y)} l${r(w * 0.3)} ${r(-h)} l${r(w * 0.7)} ${r(h * 0.2)} l${r(-w * 0.2)} ${r(h * 0.9)} Z" fill="#f2cf9e" opacity=".55"/>`;
    else if (art < 0.8) k += `<path d="M${r(x)} ${r(y)} l${r(w * 0.15)} ${r(-h)} l${r(w * 0.25)} ${r(h * 0.1)} l${r(-w * 0.05)} ${r(h * 1.1)} Z" fill="#7a5a64" opacity=".45"/>`;
    else k += `<path d="M${r(x)} ${r(y - h)} l${r((rnd() - 0.5) * 1.5)} ${r(h * 0.5)} l${r((rnd() - 0.5) * 1.5)} ${r(h * 0.6)}" stroke="#6e4e58" stroke-width=".35" fill="none" opacity=".7"/>`;
  }
  /* Südmauer (Kimon-Mauer) aus Quadern */
  const mauer = [...KRONE.map(pp), ...FUSS.slice().reverse().map(pp)];
  k += `<path d="${P(mauer)}" fill="${S.lg("mauer", [[0, "#f3cf9a"], [0.25, "#e2b58e"], [1, "#be9282"]], 0, 0, 1, 0)}"/>`;
  let fu = "";
  for (let j = 1; j < 8; j++) { const q = j / 8; fu += "M" + KRONE.map((p) => { const [x, y] = pp([p[0], p[1] - 3 * q, p[2] - 12 * q]); return `${r(x)} ${r(y)}`; }).join(" L") + " "; }
  k += `<path d="${fu}" stroke="#93706a" stroke-width=".2" fill="none" opacity=".5"/>`;
  for (let i = 0; i < 80; i++) { const t = rnd() * (KRONE.length - 1.01), i0 = Math.floor(t), f = t - i0, A = KRONE[i0], Bq = KRONE[i0 + 1], q = Math.floor(rnd() * 8) / 8; const p = pr(A[0] + (Bq[0] - A[0]) * f, A[1] + (Bq[1] - A[1]) * f - 3 * q, A[2] + (Bq[2] - A[2]) * f - 12 * q); if (p[0] > 398) continue; k += `<rect x="${r(p[0])}" y="${r(p[1])}" width=".2" height="${r(1.5 * p[2])}" fill="#93706a" opacity=".4"/>`; }
  /* Pflanzen am Mauerfuß, Wasserflecken */
  for (let i = 0; i < 30; i++) { const t = rnd() * (KRONE.length - 1.01), i0 = Math.floor(t), f = t - i0, A = FUSS[i0], Bq = FUSS[i0 + 1]; const [x, y, u] = pr(A[0] + (Bq[0] - A[0]) * f, A[1] + (Bq[1] - A[1]) * f, A[2] + (Bq[2] - A[2]) * f); if (x > 396) continue; k += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(1.4 * u)}" ry="${r(0.7 * u)}" fill="#6e7444" opacity=".85"/>`; }
  k += `<path d="M${KRONE.map((p) => { const [x, y] = pp(p); return `${r(x)} ${r(y)}`; }).join(" L")}" stroke="${M_HELL}" stroke-width=".6" fill="none"/>`;
  /* Bastion des Nike-Tempels: senkrechter Quaderturm, Westseite im Licht */
  const bas = [[-146, -10, 143.5], [-142, -22, 143.5], [-142, -22, 129], [-146, -10, 129]];
  k += `<path d="${Q(bas)}" fill="${S.lg("bastion", [[0, "#fbdba6"], [1, "#e7bd8c"]], 0, 0, 1, 0)}"/>`;
  for (let z = 131; z < 143; z += 1.5) k += `<path d="${L3([-146, -10, z], [-142, -22, z])}" stroke="#b48a6e" stroke-width=".2" opacity=".6"/>`;
  /* Westaufgang: Treppe zwischen Fels, unten das Beulé-Tor mit zwei Pylonen */
  for (let i = 0; i < 10; i++) { const e = -168 + i * 2.2, z = 133.5 + i * 0.95; k += `<path d="${L3([e, -4, z], [e, 10, z])}" stroke="${i % 2 ? "#f9e0b8" : "#c99e80"}" stroke-width=".45"/>`; }
  k += `<path d="${Q([[-176, -4, 128], [-168, -6, 128], [-168, -6, 135.5], [-176, -4, 135.5]])}" fill="#f2cc98"/><path d="${Q([[-176, 10, 128], [-168, 8, 128], [-168, 8, 135.5], [-176, 10, 135.5]])}" fill="#e9c08e"/>`;
  k += `<path d="${Q([[-172, -4, 128], [-172, 8, 128], [-172, 8, 133], [-172, -4, 133]])}" fill="#d9ad86"/><path d="${Q([[-172, 0.5, 128], [-172, 3.5, 128], [-172, 3.5, 131.5], [-172, 0.5, 131.5]])}" fill="#5e4648"/>`;
  /* Bäume am Hang (Kiefern, Ölbäume, Zypressen): hinten klein, vorn größer */
  for (let i = 0; i < 60; i++) {
    const j = Math.floor(rnd() * (unten.length - 1)), a = unten[j], b2 = unten[j + 1], f = rnd(), x = a[0] + (b2[0] - a[0]) * f, y = a[1] + (b2[1] - a[1]) * f + 2 + rnd() * 3;
    if (x < 1 || x > 399) continue;
    const w = 3.5 + rnd() * 4;
    k += rnd() < 0.18 ? zypresse(x, y + 2, w * 2, w * 0.38) : baumgruppe(x, y, w, w * 0.7);
  }
  for (let i = 0; i < 90; i++) {
    const x = rnd() * 404 - 2, t = rnd(), yU = (() => { let j = 0; while (j < unten.length - 1 && unten[j + 1][0] < x) j++; const a = unten[j], b2 = unten[Math.min(j + 1, unten.length - 1)]; return b2[0] === a[0] ? a[1] : a[1] + (b2[1] - a[1]) * klemm((x - a[0]) / (b2[0] - a[0]), 0, 1); })();
    const y = yU + 4 + t * (214 - yU - 4), w = 5 + (y - 150) * 0.12 + rnd() * 4, h = w * 0.7;
    if (x > 186 && x < 285 && y > 158 && y < 203) continue;
    k += rnd() < 0.15 ? zypresse(x, y, w * 1.9, w * 0.35) : baumgruppe(x, y, w, h);
  }
  akroUnter.push({ id: "mauer", de: "die Mauer", syl: "MAU-er", it: "le mura", itSyl: "MU-ra", en: "wall", x: r(pr(-30, -58, 141)[0]), y: r(pr(-30, -58, 141)[1]), kunst: flaeche(-40, -11, 80, 13),
    tipp: "Die Mauer um die Akropolis ist rund 2500 Jahre alt. Sie macht den Felsen zu einer Festung." });
  S.teil({ anker: [250, 140], id: "akropolis", de: "die Akropolis", syl: "a-KRO-po-lis", it: "l'Acropoli", itSyl: "a-CRO-po-li", en: "Acropolis", x: 0, y: 0, kunst: k,
    zoom: { x: 146, y: 104, w: 72, h: 48 }, unter: akroUnter,
    tipp: "„Akropolis“ heißt „Oberstadt“. Auf dem 156 Meter hohen Felsen standen die wichtigsten Tempel der Stadt." });
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
  k += `<path d="${Q([[E0 + 14, 16, ZB + 11], [E0 + 14, 0, ZB + 11], [E0 + 14, 0, ZB + 13.4], [E0 + 14, 8, ZB + 15.4], [E0 + 14, 16, ZB + 13.4]])}" fill="#d6aa88"/>`;
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
   5 — DAS ERECHTHEION mit der Korenhalle (Lupe: die Karyatide)
   ===================================================================== */
const erUnter = [];
{
  let k = "";
  const E0 = -37, E1 = -15, N0 = 43, N1 = 56, Z0 = 149, Z1 = 157.2, ZG = 159.4;
  /* Dachsilhouette mit Ostgiebel, Südwand (Streiflicht), Westfront (Licht) mit Halbsäulen und Fenstern */
  /* Nordwand innen (im Schatten) über die Südwand hinweg sichtbar */
  k += `<path d="${Q([[E0, N1, Z1], [E1, N1, Z1], [E1, N1, Z1 + 0.6], [E0, N1, Z1 + 0.6]])}" fill="#b98f80"/>`;
  k += `<path d="${Q([[E0, N0, Z0], [E1, N0, Z0], [E1, N0, Z1], [E0, N0, Z1]])}" fill="${S.lg("erechsued", [[0, "#e7bd94"], [1, "#c99c84"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="${L3([E0, N0, Z1 - 1.4], [E1, N0, Z1 - 1.4])}" stroke="#ad8470" stroke-width=".3"/>`;
  k += `<path d="${Q([[E0, N1, Z0 - 3], [E0, N0, Z0 - 3], [E0, N0, Z1], [E0, N1, Z1]])}" fill="${M_W}"/>`;
  for (const n of [45.5, 48.2, 50.8, 53.5]) { const a = pr(E0, n, Z0 + 1.2), b = pr(E0, n, Z1 - 1.4); k += `<rect x="${r(a[0] - 0.35)}" y="${r(b[1])}" width=".7" height="${r(a[1] - b[1])}" fill="#fff0cc"/>`; }
  for (const n of [46.8, 49.5, 52.1]) { const a = pr(E0, n, Z0 + 2.4), b = pr(E0, n, Z0 + 5.2); k += `<rect x="${r(a[0] - 0.5)}" y="${r(b[1])}" width="1" height="${r(a[1] - b[1])}" fill="#7a5a56"/>`; }
  k += `<path d="${Q([[E0 - 0.2, N1 + 0.2, Z1 - 1.2], [E0 - 0.2, N0 - 0.2, Z1 - 1.2], [E0 - 0.2, N0 - 0.2, Z1 + 0.3], [E0 - 0.2, N1 + 0.2, Z1 + 0.3]])}" fill="#fbe2b4"/>`;
  k += `<path d="${Q([[E0, N0, Z0 - 3], [E1, N0, Z0 - 3], [E1, N0, Z0], [E0, N0, Z0]])}" fill="#c99c84"/>`;
  k += `<path d="${L3([E0, N0, Z1 + 0.3], [E1, N0, Z1 + 0.3])}" stroke="${M_HELL}" stroke-width=".4"/>`;
  /* Korenhalle: Sockel, vier Mädchen vorn (zwei dahinter im Schatten), Gebälk und flaches Dach */
  const KE0 = -34, KE1 = -28.5, KN = 39.2, KZ = 150.4, KH = 1.8, MH = 2.3;
  k += `<path d="${Q([[KE0, KN, KZ], [KE1, KN, KZ], [KE1, KN, KZ + KH], [KE0, KN, KZ + KH]])}" fill="${S.lg("korensockel", [[0, "#f3cf9e"], [1, "#d4a98a"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="${Q([[KE0 + 0.4, KN + 2.6, KZ + KH], [KE1 - 0.4, KN + 2.6, KZ + KH], [KE1 - 0.4, KN + 2.6, KZ + KH + MH], [KE0 + 0.4, KN + 2.6, KZ + KH + MH]])}" fill="#7e5e5a"/>`;
  for (const e of [KE0 + 0.6, KE0 + 2.1, KE0 + 3.6, KE0 + 5.1]) {
    const a = pr(e, KN + 0.5, KZ + KH), b = pr(e, KN + 0.5, KZ + KH + MH), u = a[2], h = a[1] - b[1];
    /* Figur: Gewandfalten, Kopf, Korb-Kapitell */
    k += `<path d="M${r(a[0] - 0.36 * u)} ${r(a[1])} L${r(a[0] - 0.3 * u)} ${r(b[1] + h * 0.42)} Q${r(a[0] - 0.24 * u)} ${r(b[1] + h * 0.26)} ${r(a[0] - 0.14 * u)} ${r(b[1] + h * 0.22)} L${r(a[0] + 0.14 * u)} ${r(b[1] + h * 0.22)} Q${r(a[0] + 0.24 * u)} ${r(b[1] + h * 0.26)} ${r(a[0] + 0.3 * u)} ${r(b[1] + h * 0.42)} L${r(a[0] + 0.36 * u)} ${r(a[1])} Z" fill="${S.lg("kore", [[0, "#fff3d6"], [0.55, "#f0cd9e"], [1, "#b98e7c"]], 0, 0, 1, 0)}"/>`;
    k += `<path d="M${r(a[0] - 0.12 * u)} ${r(a[1])} L${r(a[0] - 0.1 * u)} ${r(b[1] + h * 0.5)} M${r(a[0] + 0.1 * u)} ${r(a[1])} L${r(a[0] + 0.1 * u)} ${r(b[1] + h * 0.5)}" stroke="#b58c78" stroke-width=".12"/>`;
    k += `<ellipse cx="${r(a[0])}" cy="${r(b[1] + h * 0.14)}" rx="${r(0.12 * u)}" ry="${r(0.15 * u)}" fill="#f6dcb2"/><rect x="${r(a[0] - 0.2 * u)}" y="${r(b[1])}" width="${r(0.4 * u)}" height="${r(0.07 * u)}" fill="#fff0cf"/>`;
  }
  k += `<path d="${Q([[KE0 - 0.2, KN, KZ + KH + MH], [KE1 + 0.2, KN, KZ + KH + MH], [KE1 + 0.2, KN, KZ + KH + MH + 1], [KE0 - 0.2, KN, KZ + KH + MH + 1]])}" fill="#f2cc98"/>`;
  k += `<path d="${L3([KE0 - 0.3, KN, KZ + KH + MH + 1], [KE1 + 0.3, KN, KZ + KH + MH + 1])}" stroke="${M_HELL}" stroke-width=".35"/>`;
  const [kx, ky] = pr((KE0 + KE1) / 2, KN, KZ + KH);
  erUnter.push({ id: "karyatide", de: "die Karyatide", syl: "ka-ry-a-TI-de", it: "la cariatide", itSyl: "ca-ri-A-ti-de", en: "caryatid", x: r(kx), y: r(ky + 1.2), kunst: flaeche(-5.2, -6.8, 10.4, 7.4),
    tipp: "Die Karyatiden sind Mädchenfiguren, die das Dach tragen. Hier stehen Kopien – die echten sind im Museum." });
  const [ex, ey] = pr(-26, N0, Z0);
  S.teil({ anker: [ex, ey], id: "erechtheion", de: "das Erechtheion", syl: "e-rech-THEI-on", it: "l'Eretteo", itSyl: "e-ret-TE-o", en: "Erechtheion", x: 0, y: 0, kunst: k,
    zoom: { x: 117, y: 90, w: 42, h: 28 }, unter: erUnter,
    tipp: "Das Erechtheion war ein Tempel für Athene und Poseidon. Hier soll Athene den ersten Olivenbaum geschenkt haben." });
}

/* =====================================================================
   6 — DER PARTHENON (Lupe: die Säule, der Giebel, der Kran)
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
  const gebaelk = (A, Bp, licht, trigl) => {
    const [ae, an] = A, [be, bn] = Bp;
    let g = `<path d="${Q([[ae, an, zC], [be, bn, zC], [be, bn, zA], [ae, an, zA]])}" fill="${licht ? "#f5d6a4" : "#dbb291"}"/>`;
    g += `<path d="${Q([[ae, an, zA], [be, bn, zA], [be, bn, zF], [ae, an, zF]])}" fill="${licht ? "#eccb98" : "#cfa487"}"/>`;
    if (trigl) for (let t = 0; t <= 1.0001; t += trigl) { const e = ae + (be - ae) * t, n = an + (bn - an) * t, p = pr(e, n, zF), q = pr(e, n, zA); g += `<rect x="${r(p[0] - 0.36 * p[2])}" y="${r(p[1])}" width="${r(0.72 * p[2])}" height="${r(q[1] - p[1])}" fill="${licht ? "#b98c6e" : "#a07a6a"}"/>`; }
    g += `<path d="${Q([[ae, an, zF], [be, bn, zF], [be, bn, zK], [ae, an, zK]])}" fill="${licht ? M_HELL : "#ead0b0"}"/>`;
    g += `<path d="${L3([ae, an, zF], [be, bn, zF])}" stroke="#8e6a5e" stroke-width=".3"/>`;
    return g;
  };
  /* Nordseite (hinten): Säulen und Gebälk, nur durch die Lücke sichtbar */
  for (let i = 16; i >= 0; i--) k += saeule(ECOL(i), 14.4, zS, zC, 0.92);
  k += gebaelk([e0, n1], [e1, n1], false, 67.4 / 16 / 69.5 / 2);
  /* Ostgiebel von innen (Westseite der Giebelwand, im Abendlicht) */
  k += `<path d="${Q([[e1, n0, zK], [e1, n1, zK], [e1, 0, zG]])}" fill="#efc896"/><path d="${L3([e1, n0, zK], [e1, 0, zG])} ${L3([e1, 0, zG], [e1, n1, zK])}" stroke="${M_HELL}" stroke-width=".45"/>`;
  for (let i = 0; i < 8; i++) k += saeule(33.7, NCOL(i), zS, zC, 0.95);
  k += gebaelk([e1, n1], [e1, n0], true, 1 / 14);
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
  k += gebaelk([ECOL(12) - 2.1, n0], [e1, n0], false, 67.4 / 16 / (e1 - ECOL(12) + 2.1) / 2);
  k += gebaelk([e0, n0], [ECOL(5) + 2.1, n0], false, 67.4 / 16 / (ECOL(5) + 2.1 - e0) / 2);
  /* Westfront: 8 Säulen von Norden nach Süden (die Südwestecke ist uns am nächsten) */
  for (let i = 7; i >= 0; i--) k += saeule(-33.7, NCOL(i));
  k += gebaelk([e0, n1], [e0, n0], true, 1 / 14);
  /* Westgiebel: Giebelfeld zurückgesetzt im Halbschatten, Figurenreste in den Ecken, Schräggesims hell */
  k += `<path d="${Q([[e0 + 0.5, n1 - 0.6, zK], [e0 + 0.5, n0 + 0.6, zK], [e0 + 0.5, 0, zG - 0.7]])}" fill="#d9ad8a"/>`;
  for (const [na, nb, h] of [[13.4, 10.2, 0.9], [-10.6, -13.6, 0.85]]) { const a = pr(e0 + 0.4, na, zK), b = pr(e0 + 0.4, nb, zK), c = pr(e0 + 0.4, (na + nb) / 2, zK + h); k += `<path d="M${r(a[0])} ${r(a[1])} Q${r(c[0])} ${r(c[1] - 0.4)} ${r(b[0])} ${r(b[1] - 0.3)} L${r(b[0])} ${r(b[1])} Z" fill="#f4d6a6"/>`; }
  for (const n of [5.6, 4.4]) { const a = pr(e0 + 0.4, n, zK), b = pr(e0 + 0.4, n, zK + 2.3); k += `<path d="M${r(a[0] - 0.5)} ${r(a[1])} Q${r(b[0] - 0.6)} ${r((a[1] + b[1]) / 2)} ${r(b[0])} ${r(b[1])} Q${r(b[0] + 0.6)} ${r((a[1] + b[1]) / 2)} ${r(a[0] + 0.5)} ${r(a[1])} Z" fill="#f0cf9e"/>`; }
  k += `<path d="${L3([e0, n1 + 0.4, zK], [e0, 0, zG])} ${L3([e0, 0, zG], [e0, n0 - 0.4, zK])}" stroke="${M_HELL}" stroke-width="1.1" stroke-linecap="round"/>`;
  k += `<path d="${L3([e0, n1 + 0.4, zK - 0.15], [e0, 0, zG - 0.25])} ${L3([e0, 0, zG - 0.25], [e0, n0 - 0.4, zK - 0.15])}" stroke="#b58a70" stroke-width=".3"/>`;
  /* Kran der Restaurierung im Inneren (Gittermast, Ausleger nach Westen) */
  const km = [6, 3], kz0 = zK - 1, kz1 = 186;
  let kran = "";
  { const a = pr(km[0], km[1], kz0), b = pr(km[0], km[1], kz1), w = 0.9 * a[2];
    kran += `<path d="M${r(a[0] - w)} ${r(a[1])} L${r(b[0] - w)} ${r(b[1])} M${r(a[0] + w)} ${r(a[1])} L${r(b[0] + w)} ${r(b[1])}" stroke="#e9dcae" stroke-width=".38"/>`;
    let zz = ""; for (let z = kz0, j = 0; z < kz1 - 1; z += 1.8, j++) { const p = pr(km[0], km[1], z), q = pr(km[0], km[1], z + 1.8); zz += `M${r(p[0] + (j % 2 ? w : -w))} ${r(p[1])} L${r(q[0] + (j % 2 ? -w : w))} ${r(q[1])} `; }
    kran += `<path d="${zz}" stroke="#d8c896" stroke-width=".2"/>`;
    const j0 = pr(km[0] - 26, km[1], kz1 - 0.6), j1 = pr(km[0] + 9, km[1], kz1 - 0.6), sp = pr(km[0], km[1], kz1 + 3);
    kran += `<path d="M${r(j1[0])} ${r(j1[1])} L${r(j0[0])} ${r(j0[1])}" stroke="#eadfb4" stroke-width=".7"/><path d="M${r(j0[0])} ${r(j0[1])} L${r(sp[0])} ${r(sp[1])} L${r(j1[0])} ${r(j1[1])}" stroke="#d8c896" stroke-width=".22" fill="none"/>`;
    kran += `<rect x="${r(j1[0] - 2)}" y="${r(j1[1])}" width="2.4" height="1.6" fill="#9a8e7c"/><rect x="${r(b[0] - 1.1)}" y="${r(b[1])}" width="1.6" height="1.3" fill="#5f6a74"/>`;
    const hk = pr(km[0] - 18, km[1], kz1 - 0.6);
    kran += `<path d="M${r(hk[0])} ${r(hk[1])} V${r(hk[1] + 9)}" stroke="#4a4a4a" stroke-width=".15"/><path d="M${r(hk[0] - 0.4)} ${r(hk[1] + 9)} h.8 l-.4 .7 Z" fill="#c9a43a"/>`; }
  k = kran + k;
  /* Abendlicht auf der Westseite: warmer Schimmer, Kanten der Ecksäule */
  const sw = pr(-33.7, -14.4, zS);
  parUnter.push({ id: "saeule", de: "die Säule", syl: "SÄU-le", it: "la colonna", itSyl: "co-LON-na", en: "column", x: r(sw[0]), y: r(sw[1]), kunst: flaeche(-2.2, -(sw[1] - pr(-33.7, -14.4, zC)[1]), 4.4, sw[1] - pr(-33.7, -14.4, zC)[1]),
    tipp: "Die dorischen Säulen sind über 10 Meter hoch. Sie sind in der Mitte etwas dicker – so wirken sie lebendig." });
  const gp = pr(e0, 0, zK);
  parUnter.push({ id: "giebel", de: "der Giebel", syl: "GIE-bel", it: "il frontone", itSyl: "fron-TO-ne", en: "pediment", x: r(gp[0]), y: r(gp[1]), kunst: flaeche(-21, -(gp[1] - pr(e0, 0, zG)[1]) - 1, 42, gp[1] - pr(e0, 0, zG)[1] + 1),
    tipp: "Im Giebel standen früher große Figuren: der Streit von Athene und Poseidon um die Stadt." });
  const kb = pr(km[0], km[1], zK + 1), kt = pr(km[0], km[1], kz1 + 3);
  parUnter.push({ id: "kran", de: "der Kran", syl: "KRAN", it: "la gru", itSyl: "GRU", en: "crane", x: r(kb[0]), y: r(kb[1]), kunst: flaeche(-(kb[0] - pr(km[0] - 26, km[1], kz1)[0]) - 1, -(kb[1] - kt[1]), (kb[0] - pr(km[0] - 26, km[1], kz1)[0]) + 6, kb[1] - kt[1]),
    tipp: "Seit 1975 wird der Parthenon Stein für Stein restauriert. Der Kran hebt die schweren Marmorblöcke." });
  const pc = pr(0, -15.45, zB);
  S.teil({ anker: [pc[0], pc[1]], id: "parthenon", de: "der Parthenon", syl: "PAR-the-non", it: "il Partenone", itSyl: "par-te-NO-ne", en: "Parthenon", x: 0, y: 0, kunst: k,
    zoom: { x: 166, y: 46, w: 114, h: 76 }, unter: parUnter,
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
    tipp: "Auf der Akropolis weht die griechische Flagge. Die neun Streifen stehen für die Silben von „Freiheit oder Tod“." });
}

/* =====================================================================
   8 — DAS THEATER: Odeion des Herodes Atticus (490–570 m)
   ===================================================================== */
{
  let k = "";
  const W0 = [-211, -108], W1 = [-119, -102], Z0 = 103, Z1 = 128;
  const at = (t, z) => [W0[0] + (W1[0] - W0[0]) * t, W0[1] + (W1[1] - W0[1]) * t, z];
  /* Sitzreihen (weißer Marmor) hinter der Bühnenwand, nur rechts sichtbar */
  /* hinter der Wand: Rand der Sitzreihen aus weißem Marmor, rechts wo die Wand niedriger ist */
  k += `<path d="${Q([[-140, -100, 120], [-112, -96, 120], [-108, -80, 127.5], [-138, -84, 127.5]])}" fill="#e9dccb"/>`;
  for (let j = 1; j < 6; j++) k += `<path d="${L3([-140 + j * 0.4, -100 + j * 3.2, 120 + j * 1.5], [-111 + j * 0.6, -96 + j * 3.2, 120 + j * 1.5])}" stroke="#b9a596" stroke-width=".35"/>`;
  /* obere Kante unregelmäßig (Ruine): oben Stufen, rechts niedriger */
  const kante = [[0, 128], [0.12, 128], [0.14, 126.5], [0.3, 126.5], [0.32, 127.6], [0.55, 127.6], [0.58, 125.8], [0.78, 125.8], [0.8, 123], [0.92, 123], [0.94, 120], [1, 120]];
  const um = [...kante.map(([t, z]) => pr(...at(t, z))), pr(...at(1, Z0)), pr(...at(0, Z0))];
  k += `<path d="${P(um)}" fill="${S.lg("odeion", [[0, "#e8c39b"], [0.3, "#d1a888"], [1, "#a8857a"]], 0, 0, 1, 0)}"/>`;
  /* Lagen aus Stein */
  for (let z = Z0 + 1.2; z < 127; z += 1.25) k += `<path d="${L3(at(0, z), at(z > 123 ? 0.78 : 1, z))}" stroke="#9c7a6c" stroke-width=".18" opacity=".55"/>`;
  /* drei Geschosse Bogenöffnungen: Erdgeschoss groß, oben kleiner */
  for (const [zu, zo, n, b] of [[104.5, 112.8, 7, 0.05], [114.6, 119.8, 14, 0.024], [121.2, 124.8, 14, 0.022]]) {
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n; if (zo > 123 && t > 0.8) continue;
      const a = pr(...at(t - b, zu)), c = pr(...at(t + b, zu)), d = pr(...at(t + b, zo - (zo - zu) * 0.28)), e = pr(...at(t - b, zo - (zo - zu) * 0.28)), top = pr(...at(t, zo));
      k += `<path d="M${r(a[0])} ${r(a[1])} L${r(e[0])} ${r(e[1])} Q${r(e[0])} ${r(top[1])} ${r(top[0])} ${r(top[1])} Q${r(d[0])} ${r(top[1])} ${r(d[0])} ${r(d[1])} L${r(c[0])} ${r(c[1])} Z" fill="${S.lg("bogenloch", [[0, "#4e3a40"], [1, "#7a5a58"]])}"/>`;
      k += `<path d="M${r(e[0])} ${r(e[1])} Q${r(e[0])} ${r(top[1])} ${r(top[0])} ${r(top[1])}" stroke="#ffe2b4" stroke-width=".3" fill="none"/>`;
    }
  }
  /* Lisenen zwischen den Öffnungen, Gesimse, dunkle Wetterflecken */
  for (const z of [113.6, 120.5]) k += `<path d="${L3(at(0, z), at(1, z))}" stroke="#f3d3a8" stroke-width=".55"/><path d="${L3(at(0, z - 0.4), at(1, z - 0.4))}" stroke="#8a6a62" stroke-width=".3"/>`;
  for (let i = 0; i < 12; i++) { const t = rnd(), z = 105 + rnd() * 18, a = pr(...at(t, z)); k += `<ellipse cx="${r(a[0])}" cy="${r(a[1])}" rx="${r(1 + rnd() * 2)}" ry="${r(2 + rnd() * 3)}" fill="#7a5e58" opacity=".18"/>`; }
  /* Westende im Licht */
  const wa = pr(...at(0, Z0)), wb = pr(...at(0, 128));
  k += `<path d="M${r(wa[0])} ${r(wa[1])} L${r(wb[0])} ${r(wb[1])} L${r(wb[0] - 3.5)} ${r(wb[1] + 1)} L${r(wa[0] - 3.5)} ${r(wa[1])} Z" fill="#f7d6a2"/>`;
  S.teil({ anker: [pr(...at(0.5, 115))[0], pr(...at(0.5, 115))[1]], id: "theater", de: "das Theater", syl: "the-A-ter", it: "il teatro", itSyl: "te-A-tro", en: "theatre", x: 0, y: 0, kunst: k,
    tipp: "Das Odeion des Herodes Atticus ist fast 1900 Jahre alt. Im Sommer gibt es hier Konzerte und Theater unter freiem Himmel." });
}

/* =====================================================================
   9 — DER HÜGEL (Philopappos): Felskuppe vorn, Kante bei rund 62 m
   ===================================================================== */
const KANTE = (x) => 205 + 4 * Math.sin(x / 37) + 2.5 * Math.sin(x / 13 + 1);
{
  const pts = [];
  for (let x = 0; x <= 400; x += 10) pts.push([x, KANTE(x)]);
  let k = `<path d="M0 260 ${pts.map(([x, y]) => `L${x} ${r(y)}`).join(" ")} L400 260 Z" fill="${S.lg("kuppe", [[0, "#e6c79c"], [0.4, "#d4b088"], [1, "#b48f72"]])}"/>`;
  /* große helle und dunkle Flecken im Fels (weich), niedrige Büsche (Thymian, Mastix) */
  for (let i = 0; i < 14; i++) { const x = rnd() * 400, y = KANTE(x) + 8 + rnd() * 46, w = 10 + rnd() * 26; k += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(w)}" ry="${r(w * 0.14)}" fill="${rnd() < 0.5 ? "#f3dcb4" : "#a98a70"}" opacity=".45" ${W15}/>`; }
  for (let i = 0; i < 9; i++) { const x = 20 + rnd() * 360, y = KANTE(x) + 4 + rnd() * 20, w = 4 + rnd() * 5; k += `<ellipse cx="${r(x + 1)}" cy="${r(y + 0.6)}" rx="${r(w * 0.6)}" ry="${r(w * 0.12)}" fill="#5a4030" opacity=".35"/>` + baumgruppe(x, y, w, w * 0.45, "#3e4a2a", "#5a6438", "#9c9a5a"); }
  /* trockenes Gras, Thymian, Steine */
  for (let i = 0; i < 70; i++) {
    const x = rnd() * 400, y = KANTE(x) + 2 + rnd() * 52, h = 1.2 + (y - 200) * 0.05 * (0.5 + rnd());
    k += `<path d="M${r(x)} ${r(y)} l${r(-0.6 - rnd())} ${r(-h)} M${r(x + 0.3)} ${r(y)} l${r(0.2)} ${r(-h * 1.2)} M${r(x + 0.6)} ${r(y)} l${r(0.8 + rnd())} ${r(-h)}" stroke="${rnd() < 0.6 ? "#d9b56e" : "#a99560"}" stroke-width=".35"/>`;
  }
  for (let i = 0; i < 26; i++) { const x = rnd() * 400, y = KANTE(x) + 4 + rnd() * 50, w = 0.8 + rnd() * 2.2; k += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(w)}" ry="${r(w * 0.5)}" fill="#b09078"/><ellipse cx="${r(x - w * 0.25)}" cy="${r(y - w * 0.2)}" rx="${r(w * 0.6)}" ry="${r(w * 0.3)}" fill="#efdcbc"/>`; }
  /* lange Schatten der Menschen: vom Betrachter weg, leicht nach rechts */
  for (const [x, y, l] of [[142, 238.6, 6]]) k += `<path d="M${r(x - 2)} ${r(y)} L${r(x + 2)} ${r(y)} L${r(x + 5)} ${r(y - l * 0.35)} L${r(x + 3)} ${r(y - l * 0.38)} Z" fill="#6a4a3a" opacity=".3" ${W04}/>`;
  /* Kante: Licht auf dem Grat */
  k += `<path d="M0 ${r(KANTE(0))} ${pts.map(([x, y]) => `L${x} ${r(y)}`).join(" ")}" stroke="#fbe6c0" stroke-width=".8" fill="none"/>`;
  S.teil({ anker: [200, 238], id: "huegel", de: "der Hügel", syl: "HÜ-gel", it: "la collina", itSyl: "col-LI-na", en: "hill", x: 0, y: 0, kunst: k,
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
  k += `<path d="${P([...links, ...rechts.reverse()])}" fill="#8f7462"/>`;
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
  /* lange Abendschatten der Menschen: vom Betrachter weg, leicht nach rechts */
  for (const [x, y, l] of [[286, 225.7, 14], [322, 228.3, 15]]) k += `<path d="M${r(x - 2.4)} ${r(y)} L${r(x + 2.4)} ${r(y)} L${r(x + 6)} ${r(y - l * 0.4)} L${r(x + 3.4)} ${r(y - l * 0.42)} Z" fill="#5a3a30" opacity=".35" ${W04}/>`;
  S.teil({ anker: [262, 246], id: "weg", de: "der Weg", syl: "WEG", it: "il sentiero", itSyl: "sen-TIE-ro", en: "path", x: 0, y: 0, kunst: k,
    tipp: "Die Wege aus alten Steinen hat der Architekt Dimitris Pikionis in den 1950er-Jahren angelegt. Jeder Stein ist anders." });
}

/* =====================================================================
   10 — DIE KIEFER: Aleppo-Kiefern am Hang und eine große vorn links
   ===================================================================== */
{
  let k = "";
  /* Kiefern am Hang zwischen Hügel und Akropolis: Schirmkronen, nur über der Kante sichtbar */
  S.def(`<clipPath id="${S.id("hang")}"><path d="M0 0 H400 V${r(KANTE(400))} ${Array.from({ length: 41 }, (_, i) => `L${400 - i * 10} ${r(KANTE(400 - i * 10))}`).join(" ")} Z"/></clipPath>`);
  let h = "";
  const krone = (x, y, w, hh, dunkel) => {
    let c = "";
    const n = 5 + Math.floor(w / 4);
    for (let i = 0; i < n; i++) { const t = i / (n - 1), cx = x - w / 2 + t * w + (rnd() - 0.5) * 2, cy = y - Math.sin(t * Math.PI) * hh * 0.5 + (rnd() - 0.5) * 1.4, rx = w / n * 1.25, ry = hh * (0.35 + rnd() * 0.15); c += `<ellipse cx="${r(cx)}" cy="${r(cy)}" rx="${r(rx)}" ry="${r(ry)}" fill="${dunkel}"/>`; }
    for (let i = 0; i < n - 1; i++) { const t = (i + 0.3) / (n - 1), cx = x - w / 2 + t * w, cy = y - Math.sin(t * Math.PI) * hh * 0.55 - hh * 0.18; c += `<ellipse cx="${r(cx - 0.6)}" cy="${r(cy)}" rx="${r(w / n * 0.8)}" ry="${r(hh * 0.22)}" fill="#8f9a56" opacity=".85"/>`; }
    return c;
  };
  const baum = [[8, 198, 22, 10], [34, 196, 16, 8], [60, 203, 20, 8], [92, 199, 26, 11], [128, 204, 18, 7], [160, 200, 20, 9], [186, 207, 14, 6], [300, 197, 22, 10], [330, 202, 18, 8], [356, 196, 24, 11], [388, 200, 20, 9], [236, 210, 18, 6], [268, 206, 16, 6]];
  for (const [x, y, w, hh] of baum) h += `<path d="M${r(x - 0.5)} ${r(y + 6)} L${r(x - 0.3)} ${r(y)} L${r(x + 0.3)} ${r(y)} L${r(x + 0.5)} ${r(y + 6)} Z" fill="#5a4636"/>` + krone(x, y, w, hh, "#41532f");
  k += `<g clip-path="url(#${S.id("hang")})">${h}</g>`;
  /* große Aleppo-Kiefer vorn links (45 m): schiefer Stamm, lockere Schirmkrone mit Himmelslöchern */
  const sx = 24, sy = KANTE(24) + 16;
  k += `<path d="M${sx - 8} ${r(sy + 1)} Q${sx - 4} ${r(sy - 4)} ${sx - 4.5} ${r(sy - 30)} Q${sx - 6} ${r(sy - 80)} ${sx + 4} ${r(sy - 125)} Q${sx + 12} ${r(sy - 160)} ${sx + 20} ${r(sy - 190)} L${sx + 25} ${r(sy - 188)} Q${sx + 18} ${r(sy - 158)} ${sx + 11} ${r(sy - 124)} Q${sx + 2} ${r(sy - 80)} ${sx + 4} ${r(sy - 30)} Q${sx + 4} ${r(sy - 4)} ${sx + 9} ${r(sy + 1)} Z" fill="${S.lg("kiefernstamm", [[0, "#c79a6e"], [0.45, "#8a6046"], [1, "#4a3428"]], 0, 0, 1, 0)}"/>`;
  for (let y = sy - 5; y > sy - 160; y -= 4 + rnd() * 3) { const t = (sy - y) / 190, x = sx + (t < 0.4 ? -1 : -1 + (t - 0.4) * 30) ; k += `<path d="M${r(x - 3)} ${r(y)} q1.6 -1.2 3.4 -.4 q1.2 .6 2.6 -.2" stroke="#3e2a20" stroke-width=".5" fill="none" opacity=".7"/><path d="M${r(x - 3.4)} ${r(y - 1.6)} q1.4 -.6 2.4 0" stroke="#e2b98a" stroke-width=".4" fill="none" opacity=".6"/>`; }
  k += `<ellipse cx="${sx + 6}" cy="${r(sy + 1)}" rx="14" ry="1.6" fill="#5a3e2e" opacity=".35"/>`;
  /* Äste */
  k += `<path d="M${sx + 9} ${r(sy - 140)} Q${sx + 30} ${r(sy - 160)} ${sx + 52} ${r(sy - 166)} M${sx + 12} ${r(sy - 160)} Q${sx - 4} ${r(sy - 178)} ${sx - 22} ${r(sy - 180)}" stroke="#5a3e2e" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
  /* Kronenbüschel: dunkle Nadelmassen, oben links golden angestrahlt, dazwischen Lücken */
  const BUESCHEL = [[-30, -178, 26, 11], [-6, -186, 30, 12], [22, -192, 30, 12], [46, -180, 26, 10], [66, -166, 18, 8], [6, -204, 24, 9], [34, -208, 20, 8], [-18, -198, 20, 8], [12, -172, 24, 8], [-40, -166, 16, 7], [52, -160, 16, 6]];
  const nadeln = (x, y, w, h, farbe, zack) => {
    const pts = [];
    for (let i = 0; i < 30; i++) { const a = i / 30 * Math.PI * 2, rr = (i % 2 ? 1 : 1 + zack) * (0.9 + rnd() * 0.15); pts.push([klemm(x + Math.cos(a) * w / 2 * rr, 0, 400), Math.max(y + Math.sin(a) * h / 2 * rr * (Math.sin(a) > 0 ? 0.7 : 1), 0.5)]); }
    return `<path d="${P(pts)}" fill="${farbe}"/>`;
  };
  for (const [dx, dy, w, hh] of BUESCHEL) {
    const x = sx + dx, y = sy + dy;
    k += nadeln(x, y, w, hh * 1.25, "#2c3f25", 0.16);
    k += nadeln(x - w * 0.08, y - hh * 0.12, w * 0.8, hh * 0.9, "#3f5630", 0.18);
    k += nadeln(x - w * 0.2, y - hh * 0.32, w * 0.42, hh * 0.42, "#8f9a52", 0.22);
  }
  S.teil({ anker: [40, 120], id: "kiefer", de: "die Kiefer", syl: "KIE-fer", it: "il pino", itSyl: "PI-no", en: "pine tree", x: 0, y: 0, kunst: k,
    tipp: "Auf den Hügeln von Athen wachsen Aleppo-Kiefern. Mit ihrem Harz macht man den griechischen Wein Retsina." });
}

/* =====================================================================
   11 — DER OLIVENBAUM (rechts, 50 m): knorriger Stamm, silbrige Krone
   ===================================================================== */
{
  const u = F / 50, x = 368, y = KANTE(368) + 15;
  let k = `<ellipse cx="${x + 4}" cy="${r(y - 1)}" rx="14" ry="1.6" fill="#6a4a3a" opacity=".25" ${W04}/>`;
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
    tipp: "Der Olivenbaum ist der heilige Baum der Athene. Nach der Sage schenkte sie ihn den Athenern – so gewann sie die Stadt." });
}

/* =====================================================================
   12 — DAS PICKNICK (Lupe: das Gyros, die Olive, die Wasserflasche)
   ===================================================================== */
const pickUnter = [];
const PK = { x: 186, d: 39 };
{
  const u = F / PK.d, y = HOR + (EYE - 145.5) * u, x = PK.x;
  let k = "";
  /* Tuch blau-weiß kariert, flach auf dem Fels */
  const w = 1.1 * u, t = 0.9 * 4.5 * u / PK.d * 1;
  k += `<path d="M${r(x - w / 2)} ${r(y)} L${r(x + w / 2)} ${r(y)} L${r(x + w / 2 - 2)} ${r(y - t * 2.6)} L${r(x - w / 2 + 2)} ${r(y - t * 2.6)} Z" fill="#f4f1ea"/>`;
  for (let i = 0; i < 8; i++) { const a = x - w / 2 + i * w / 8; k += `<path d="M${r(a + w / 32)} ${r(y)} L${r(a + w / 16 + w / 32 - 0.3)} ${r(y)} L${r(a + w / 16 + w / 32 - 0.3 + (a - x) * -0.07)} ${r(y - t * 2.6)} L${r(a + w / 32 + (a - x) * -0.07)} ${r(y - t * 2.6)} Z" fill="#2c66b8" opacity=".85"/>`; }
  k += `<path d="M${r(x - w / 2 + 1)} ${r(y - t * 1.3)} L${r(x + w / 2 - 1)} ${r(y - t * 1.3)}" stroke="#2c66b8" stroke-width="${r(t * 0.6)}" opacity=".6"/>`;
  /* Gyros-Pita in Papier, Pommes und Tomate schauen heraus */
  const gx = x - 6, gy = y - 0.8;
  let g = `<path d="M${r(gx - 3)} ${r(gy)} L${r(gx - 2.2)} ${r(gy - 4.6)} L${r(gx + 2.2)} ${r(gy - 4.6)} L${r(gx + 3)} ${r(gy)} Z" fill="#f3ead6"/>`;
  g += `<path d="M${r(gx - 2.2)} ${r(gy - 4.6)} Q${r(gx)} ${r(gy - 7)} ${r(gx + 2.2)} ${r(gy - 4.6)} Z" fill="#d9a85e"/><path d="M${r(gx - 1.2)} ${r(gy - 5.4)} l-.3 -1.6 M${r(gx - 0.3)} ${r(gy - 5.6)} l.1 -1.9 M${r(gx + 0.8)} ${r(gy - 5.4)} l.4 -1.5" stroke="#f2c64a" stroke-width=".45"/><circle cx="${r(gx + 1.3)}" cy="${r(gy - 5.2)}" r=".5" fill="#d8322a"/><path d="M${r(gx - 1.6)} ${r(gy - 4.9)} q.6 -.6 1.2 0" stroke="#5a8a3a" stroke-width=".4" fill="none"/>`;
  g += `<path d="M${r(gx - 2.6)} ${r(gy - 2.2)} L${r(gx + 2.6)} ${r(gy - 2.2)}" stroke="#2c66b8" stroke-width=".35"/>`;
  k += g;
  /* Schale mit Oliven (Kalamata, dunkelviolett) */
  const ox = x + 1, oy = y - 1;
  k += `<path d="M${r(ox - 2.6)} ${r(oy - 1.4)} Q${r(ox)} ${r(oy + 0.8)} ${r(ox + 2.6)} ${r(oy - 1.4)} Z" fill="#f6efe2"/><ellipse cx="${r(ox)}" cy="${r(oy - 1.4)}" rx="2.6" ry=".6" fill="#e2d8c6"/>`;
  for (const [dx, dy] of [[-1.3, -1.6], [-0.4, -1.9], [0.5, -1.7], [1.3, -1.5], [0, -2.3], [-0.9, -2.2], [0.9, -2.2]]) k += `<ellipse cx="${r(ox + dx)}" cy="${r(oy + dy)}" rx=".55" ry=".4" fill="${S.lg("olive", [[0, "#7a4a6a"], [1, "#3a1e30"]])}"/><circle cx="${r(ox + dx - 0.15)}" cy="${r(oy + dy - 0.15)}" r=".14" fill="#d8b8c8"/>`;
  /* Wasserflasche */
  const fx = x + 7.5, fy = y - 0.9;
  k += `<path d="M${r(fx - 1.1)} ${r(fy)} L${r(fx - 1.1)} ${r(fy - 4.4)} Q${r(fx - 1.1)} ${r(fy - 5.4)} ${r(fx - 0.5)} ${r(fy - 5.8)} L${r(fx - 0.5)} ${r(fy - 6.6)} L${r(fx + 0.5)} ${r(fy - 6.6)} L${r(fx + 0.5)} ${r(fy - 5.8)} Q${r(fx + 1.1)} ${r(fy - 5.4)} ${r(fx + 1.1)} ${r(fy - 4.4)} L${r(fx + 1.1)} ${r(fy)} Z" fill="${S.lg("flasche", [[0, "#e9f4f8", 0.9], [0.5, "#a9cfe0", 0.75], [1, "#6f9fb8", 0.85]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${r(fx - 0.55)}" y="${r(fy - 7.3)}" width="1.1" height=".8" fill="#2c66b8"/><rect x="${r(fx - 1.1)}" y="${r(fy - 3.4)}" width="2.2" height="1.3" fill="#f2f2ee"/><path d="M${r(fx - 0.6)} ${r(fy - 0.4)} V${r(fy - 4.6)}" stroke="#ffffff" stroke-width=".3" opacity=".8"/>`;
  pickUnter.push({ id: "gyros", de: "das Gyros", syl: "GY-ros", it: "il gyros", itSyl: "GHI-ros", en: "gyros", x: r(gx), y: r(gy + 0.4), kunst: flaeche(-3.4, -7.6, 6.8, 8),
    tipp: "Gyros ist Fleisch vom Drehspieß. In der Pita mit Tomaten, Zwiebeln, Tsatsiki und Pommes ist es ein beliebter Imbiss." });
  pickUnter.push({ id: "olive", de: "die Olive", syl: "o-LI-ve", it: "l'oliva", itSyl: "o-LI-va", en: "olive", x: r(ox), y: r(oy + 0.4), kunst: flaeche(-3, -3.4, 6, 3.8),
    tipp: "Griechenland ist eines der größten Olivenländer der Welt. Die dunklen Kalamata-Oliven sind besonders bekannt." });
  pickUnter.push({ id: "wasserflasche", de: "die Wasserflasche", syl: "WAS-ser-fla-sche", it: "la bottiglia d'acqua", itSyl: "bot-TI-glia DAC-qua", en: "water bottle", x: r(fx), y: r(fy + 0.4), kunst: flaeche(-1.8, -8, 3.6, 8.4),
    tipp: "Im Sommer wird es in Athen über 35 Grad heiß. Nimm immer Wasser mit auf die Akropolis!" });
  S.teil({ anker: [x, y], id: "picknick", de: "das Picknick", syl: "PICK-nick", it: "il picnic", itSyl: "PIC-nic", en: "picnic", x: 0, y: 0, kunst: k,
    zoom: { x: x - 16.5, y: y - 15, w: 33, h: 22 }, unter: pickUnter });
}

/* =====================================================================
   13 — DIE KATZE (getigert, sitzt auf dem Fels und schaut zur Burg)
   ===================================================================== */
{
  const u = F / 34, x = 140, y = HOR + (EYE - 146.2) * u, s = u / 100;   /* 1 Einheit hier = 1 cm */
  const FELL = S.lg("katze", [[0, "#f0b878"], [0.5, "#c8823f"], [1, "#7a4a24"]], 0, 0, 1, 0);
  let k = `<ellipse cx="2" cy="0" rx="${r(18 * s)}" ry="${r(2.4 * s)}" fill="#5a3a2a" opacity=".3"/><g transform="scale(${s.toFixed(4)})">`;
  k += `<path d="M14 -2 Q26 0 25 -6 Q24 -10 20 -8" stroke="#a8652e" stroke-width="3.2" fill="none" stroke-linecap="round"/>`;
  k += `<path d="M-9 0 Q-12 -10 -8 -18 Q-4 -24 2 -24 Q9 -24 12 -16 Q15 -8 13 0 Z" fill="${FELL}"/>`;
  k += `<path d="M-6 -6 q4 -2 8 0 M-7 -11 q4 -2 9 0 M-5 -16 q3 -2 8 0" stroke="#7a4420" stroke-width="1.4" fill="none" opacity=".75"/>`;
  k += `<ellipse cx="0" cy="-27" rx="7" ry="6" fill="${FELL}"/><path d="M-6 -30 L-6.5 -37 L-2 -32 Z M5.5 -30 L6.5 -37 L2 -32 Z" fill="#b8763a"/><path d="M-5.6 -31 L-5.8 -35 L-3.4 -32 Z" fill="#e8a8a0"/>`;
  k += `<path d="M-4 -24 q4 -2 8 0" stroke="#7a4420" stroke-width="1" fill="none" opacity=".7"/><path d="M-9 -2 Q-8 1 -4 0 M8 0 Q12 1 12 -2" stroke="#f6dcb6" stroke-width="1.6" fill="none"/>`;
  k += `<path d="M-8 -14 Q-10 -6 -8 -1" stroke="#ffe4b8" stroke-width="1.6" fill="none" opacity=".8"/></g>`;
  S.teil({ oben: true, id: "katze", de: "die Katze", syl: "KAT-ze", it: "il gatto", itSyl: "GAT-to", en: "cat", x, y: r(y), kunst: k + flaeche(-10 * s, -38 * s, 37 * s, 39 * s),
    tipp: "In Athen leben viele Katzen auf der Straße und an den alten Ruinen. Die Menschen füttern sie." });
}

/* =====================================================================
   14 — DIE TOURISTIN mit 15 — DEM SONNENHUT; 16 — DER TOURIST mit 17 — DER KAMERA
   ===================================================================== */
{
  const d = 46, u = F / d, x = 286, y = HOR + (EYE - 145.4) * u;
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
  S.teil({ oben: true, id: "sonnenhut", de: "der Sonnenhut", syl: "SON-nen-hut", it: "il cappello da sole", itSyl: "cap-PEL-lo da SO-le", en: "sun hat", x: r(hx), y: r(hy), kunst: h + flaeche(-22 * hs, -10 * hs, 44 * hs, 16 * hs),
    tipp: "Auf der Akropolis gibt es kaum Schatten. Ein Sonnenhut schützt vor der Sonne." });
}
{
  const d = 44, u = F / d, x = 322, y = HOR + (EYE - 145.5) * u;
  const foto = {
    lende: 1, brust: -3, nacken: 2, kopf: -6,
    schulterL: { vor: 66, seit: 14 }, ellbogenL: 100, unterarmL: 40, handL: 10, fingerL: 0.5,
    schulterR: { vor: 64, seit: 16 }, ellbogenR: 102, unterarmR: 40, handR: 10, fingerR: 0.5,
    huefteL: { vor: 3, seit: 3, dreh: -6 }, knieL: 3, fussL: 0, huefteR: { vor: -6, seit: 4, dreh: -10 }, knieR: 6, fussR: 4,
  };
  const m = B.mensch({ id: "ath_tour", geschlecht: "m", pose: foto, blick: 196, frisur: "kurz", haarfarbe: "dunkelbraun", haut: "hell",
    kleidung: { oberteil: { stueck: "hemd", farbe: "#7a9cc0" }, unterteil: { stueck: "shorts", farbe: "#6a6a5a" }, schuhe: { stueck: "turnschuh" }, zubehoer: { stueck: "rucksack", farbe: "#3a5a4a" } } }, 1.8 * u);
  S.teil({ id: "tourist", de: "der Tourist", syl: "tou-RIST", it: "il turista", itSyl: "tu-RI-sta", en: "tourist", x, y: r(y), kunst: vereinfache(m.svg, 1.8),
    tipp: "Der Tourist fotografiert den Parthenon. Kurz vor Sonnenuntergang leuchtet der Marmor golden." });
  /* die Kamera: Spiegelreflex mit Objektiv, von hinten gesehen (Display zu uns) */
  const hs = [m.z.handL, m.z.handR].filter(Boolean);
  const kx = x + hs.reduce((a, h) => a + h.x, 0) / hs.length * m.k, ky = y + Math.min(...hs.map((h) => h.y)) * m.k;
  const cw = 0.14 * u, ch = 0.1 * u;
  let c = `<rect x="${r(-cw / 2)}" y="${r(-ch / 2)}" width="${r(cw)}" height="${r(ch)}" rx=".4" fill="#24262a"/><rect x="${r(-cw * 0.32)}" y="${r(-ch * 0.62)}" width="${r(cw * 0.3)}" height="${r(ch * 0.2)}" fill="#2e3034"/>`;
  c += `<rect x="${r(-cw * 0.38)}" y="${r(-ch * 0.28)}" width="${r(cw * 0.56)}" height="${r(ch * 0.56)}" fill="${S.lg("display", [[0, "#7f97c4"], [0.6, "#e9c7a6"], [1, "#b8866a"]])}"/><rect x="${r(cw * 0.26)}" y="${r(-ch * 0.2)}" width="${r(cw * 0.12)}" height="${r(ch * 0.12)}" fill="#8a8e94"/>`;
  c += `<rect x="${r(-cw / 2)}" y="${r(-ch / 2)}" width="${r(cw)}" height=".3" fill="#5a5e64"/>`;
  S.teil({ oben: true, id: "kamera", de: "die Kamera", syl: "KA-me-ra", it: "la macchina fotografica", itSyl: "MAC-chi-na fo-to-GRA-fi-ca", en: "camera", x: r(kx), y: r(ky - ch * 0.2), kunst: c + flaeche(-cw / 2 - 1, -ch / 2 - 1, cw + 2, ch + 2) });
}

/* VORNE: Abendlicht von hinten links (fängt keinen Tipp ab) */
S.davor(`<rect width="400" height="260" fill="${S.lg("abendlicht", [[0, "#ffcf8a", 0.14], [0.55, "#ffcf8a", 0], [1, "#3a2a5a", 0.06]], 0, 1, 1, 0)}" pointer-events="none"/>`);

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/athen.js"));
console.log(aus);
