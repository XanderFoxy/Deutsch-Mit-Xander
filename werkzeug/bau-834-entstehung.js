/* =====================================================================
   FASSUNG 834 — „WIE EIN KIND ENTSTEHT“ ALS SCHULBUCHTAFEL
   ---------------------------------------------------------------------
   XANDER (Funk 213): „die Entstehung des Lebens soll viel detaillierter
   alles sein mit den Organen innere und äußere“.

   Neun Tafeln in der Reihenfolge der Entwicklung, jede mit Lupe:
     1 die Samenzelle   2 die Eizelle      3 die Befruchtung
     4 der Weg zur Eizelle (Gebärmutter, Eileiter, Eierstock — Schema)
     5 die Einnistung   6 die Zellteilung  7 die Schwangerschaft
     8 das Wachstum (Embryo → Fötus, Monat für Monat)   9 die Geburt
   Tafel 5 war vorher „der Geschlechtsverkehr“ mit einer Zeichnung des
   Akts. Sie ist ersetzt: der Auftrag verlangt Befruchtung als
   Zellschema, keine sexuellen Handlungen.
   Das Ungeborene wird mit figuren/mensch.js gezeichnet (Haltung
   „foetus“), also mit demselben Skelett wie alle Menschen der Seite.
   Aufgerufen von werkzeug/bau-834-lehrbuch.js.
   ===================================================================== */
"use strict";
const L = require("./bau-834-lehrbuch.js");
const { M, r1, flaeche, esc } = L;

const SCHRIFT = 'font-family="Helvetica, Arial, sans-serif"';
const kreis = (x, y, r, f, s, w, extra) => '<circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="' + r1(r) + '" fill="' + f + '"' + (s ? ' stroke="' + s + '" stroke-width="' + (w || 0.4) + '"' : "") + (extra || "") + "/>";
const ellipse = (x, y, rx, ry, f, s, w, dreh, extra) => '<ellipse cx="' + r1(x) + '" cy="' + r1(y) + '" rx="' + r1(rx) + '" ry="' + r1(ry) + '" fill="' + f + '"' + (s ? ' stroke="' + s + '" stroke-width="' + (w || 0.4) + '"' : "") + (dreh ? ' transform="rotate(' + dreh + " " + r1(x) + " " + r1(y) + ')"' : "") + (extra || "") + "/>";
const pfad = (d, f, s, w, extra) => '<path d="' + d + '" fill="' + (f || "none") + '"' + (s ? ' stroke="' + s + '" stroke-width="' + (w || 0.4) + '" stroke-linecap="round" stroke-linejoin="round"' : "") + (extra || "") + "/>";
/* weiche Kurve durch Punkte */
function kurve(pts, zu) {
  const n = pts.length, P = (i) => zu ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))];
  let d = "M" + r1(pts[0][0]) + " " + r1(pts[0][1]);
  for (let i = 0; i < (zu ? n : n - 1); i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    d += "C" + r1(p1[0] + (p2[0] - p0[0]) / 6) + " " + r1(p1[1] + (p2[1] - p0[1]) / 6) + " " + r1(p2[0] - (p3[0] - p1[0]) / 6) + " " + r1(p2[1] - (p3[1] - p1[1]) / 6) + " " + r1(p2[0]) + " " + r1(p2[1]);
  }
  return d + (zu ? "Z" : "");
}
function welle(x0, y0, x1, amp, wellen, schritte) {
  const pts = [];
  for (let i = 0; i <= schritte; i++) {
    const t = i / schritte;
    pts.push([x0 + (x1 - x0) * t, y0 + Math.sin(t * wellen * Math.PI * 2) * amp * (1 - t * 0.55)]);
  }
  return pts;
}
const FARBE = {
  zelle: "#f6e6c1", zelleR: "#c9a86a", kern: "#7d5ea5", kernR: "#4f3a73", huelle: "#e2eef3", huelleR: "#9cbccb",
  kranz: "#f0d49a", kranzR: "#b8914a", samen: "#d6e6ef", samenR: "#3e6b86", kappe: "#a9cde3",
  muskel: "#cf7f7a", muskelR: "#9e4f4b", schleim: "#f4c0b8", schleimR: "#d9938a", hoehle: "#fbe3de",
  eierstock: "#f0d3b0", eierstockR: "#b88c5c", blut: "#c0392b", vene: "#3b6fb6", wasser: "rgba(190,224,238,.75)", wasserR: "#8fbdd0",
  kuchen: "#a8433f", kuchenR: "#7a2c29", nabel: "#e3a9a0", knochen: "#efe6d2", knochenR: "#b8a785",
};

/* Ein Pfeil (für Wege und Reihenfolgen) */
function pfeil(pts, farbe, w, gestrichelt) {
  const n = pts.length, a = pts[n - 2], b = pts[n - 1];
  const wi = Math.atan2(b[1] - a[1], b[0] - a[0]), s = 2.2 * (w || 0.5) / 0.5;
  const spitze = "M" + r1(b[0] - Math.cos(wi - 0.45) * s) + " " + r1(b[1] - Math.sin(wi - 0.45) * s) + "L" + r1(b[0]) + " " + r1(b[1]) + "L" + r1(b[0] - Math.cos(wi + 0.45) * s) + " " + r1(b[1] - Math.sin(wi + 0.45) * s);
  return pfad(kurve(pts), "none", farbe, w || 0.5, gestrichelt ? ' stroke-dasharray="1.6 1.2"' : "") + pfad(spitze, "none", farbe, w || 0.5);
}

/* Das Ungeborene: ein Säugling in der Haltung „foetus“, eingerollt. */
function foetus(x, y, hoehe, dreh, id) {
  const r = M.zeichne({ alter: "saeugling", geschlecht: "w", haut: "rosa", frisur: "kahl", pose: "foetus", blick: 90, id });
  const b = r.box, h = b.y1 - b.y0, w = b.x1 - b.x0;
  const k = hoehe / Math.max(h, w * 0.9);
  const mx = (b.x0 + b.x1) / 2, my = (b.y0 + b.y1) / 2;
  const kopf = r.kopf;
  const inBild = (px, py) => {
    const dx = (px - mx) * k, dy = (py - my) * k, a = (dreh || 0) * Math.PI / 180;
    return [x + dx * Math.cos(a) - dy * Math.sin(a), y + dx * Math.sin(a) + dy * Math.cos(a)];
  };
  const bauch = r.punkte.nabel;
  return {
    svg: '<g transform="translate(' + r1(x) + "," + r1(y) + ") rotate(" + (dreh || 0) + ") scale(" + k.toFixed(4) + ") translate(" + r1(-mx) + "," + r1(-my) + ')">' + r.svg + "</g>",
    kopf: inBild(kopf.x, kopf.y), nabel: inBild(bauch[0], bauch[1]), k,
  };
}

/* Das Ungeborene so legen, dass sein Kopf an einer bestimmten Stelle
   liegt (vor dem Muttermund, im Geburtskanal). */
function foetusAmKopf(kx, ky, hoehe, dreh, id) {
  const probe = foetus(0, 0, hoehe, dreh, id);
  return foetus(kx - probe.kopf[0], ky - probe.kopf[1], hoehe, dreh, id);
}

/* Die frühe Embryo-Form (4. und 8. Woche) als Lehrbuch-Silhouette */
function embryo(x, y, s, alter) {
  const f = "#f1c7b6", r = "#b8836f";
  if (alter === 1) {
    /* C-förmig, Kopfanlage, Schwanzknospe, Armknospe */
    const d = kurve([[x + 2.4 * s, y - 3.2 * s], [x - 0.5 * s, y - 3.9 * s], [x - 2.9 * s, y - 1.6 * s], [x - 2.6 * s, y + 1.6 * s], [x - 0.4 * s, y + 3.1 * s], [x + 1.6 * s, y + 2.0 * s], [x + 0.9 * s, y + 0.6 * s], [x - 0.9 * s, y + 0.4 * s], [x - 0.6 * s, y - 1.3 * s], [x + 1.2 * s, y - 1.6 * s]], true);
    return pfad(d, f, r, 0.3) + kreis(x - 0.4 * s, y - 2.3 * s, 0.35 * s, "#8e5b52");
  }
  /* 8. Woche: großer Kopf, Arme und Beine mit Händen und Füßen, Auge */
  let svg = ellipse(x + 0.2 * s, y - 1.9 * s, 2.3 * s, 2.1 * s, f, r, 0.3);
  svg += pfad(kurve([[x - 1.6 * s, y - 0.6 * s], [x - 1.9 * s, y + 1.4 * s], [x - 0.6 * s, y + 3.0 * s], [x + 1.4 * s, y + 2.4 * s], [x + 1.9 * s, y + 0.4 * s], [x + 1.0 * s, y - 0.4 * s]], true), f, r, 0.3);
  svg += pfad(kurve([[x + 1.2 * s, y + 0.6 * s], [x + 2.4 * s, y + 1.1 * s], [x + 2.2 * s, y + 1.7 * s]]), "none", r, 0.55 * s);
  svg += pfad(kurve([[x + 0.6 * s, y + 2.5 * s], [x + 1.6 * s, y + 3.4 * s], [x + 2.5 * s, y + 3.2 * s]]), "none", r, 0.6 * s);
  svg += kreis(x + 1.1 * s, y - 2.1 * s, 0.35 * s, "#5d3b33");
  return svg;
}

/* ================================================================
   DIE NEUN TAFELN — jede in eigenen Koordinaten um (0,0), ±50 × ±44.
   Rückgabe: { svg, teile: { unterId: [x, y, seite] } }  seite: "l"/"r"
   ================================================================ */
const TAFEL = {};

TAFEL.e_samenzelle = () => {
  let s = "";
  /* Schwanz (Geißel), dann Mittelstück, dann Kopf mit Kappe und Kern */
  const w = welle(-10, 0, 44, 4, 2.3, 40);
  s += pfad(kurve(w.slice(0, 16)), "none", FARBE.samenR, 1.3) + pfad(kurve(w.slice(15, 30)), "none", FARBE.samenR, 0.9) + pfad(kurve(w.slice(29)), "none", FARBE.samenR, 0.55);
  s += pfad(kurve(w.slice(0, 16)), "none", FARBE.samen, 0.6);
  s += '<rect x="-19" y="-2.4" width="11" height="4.8" rx="2.2" fill="#b8d0de" stroke="' + FARBE.samenR + '" stroke-width=".4"/>';
  for (let i = 0; i < 6; i++) s += pfad("M" + (-18 + i * 1.8) + " -2.2L" + (-16.8 + i * 1.8) + " 2.2", "none", "#7f9fb3", 0.35);
  s += ellipse(-27, 0, 9.5, 6.4, FARBE.samen, FARBE.samenR, 0.5);
  s += pfad("M-30.5 -6C-35 -5 -37.2 -2 -37.2 0C-37.2 2 -35 5 -30.5 6C-32.6 3.5 -33 -3.5 -30.5 -6Z", FARBE.kappe, FARBE.samenR, 0.35);
  s += ellipse(-25.5, 0, 6.2, 4.3, FARBE.kern, FARBE.kernR, 0.4) + ellipse(-27, -1.3, 2, 1.2, "rgba(255,255,255,.35)");
  /* Maßstab: eine Samenzelle ist 0,06 mm lang */
  s += '<path d="M-38 30H0" stroke="#8a7a66" stroke-width=".4"/><path d="M-38 28.5V31.5M0 28.5V31.5" stroke="#8a7a66" stroke-width=".4"/>'
    + '<text x="-19" y="36" font-size="3.4" ' + SCHRIFT + ' fill="#7a6a56" text-anchor="middle">0,06 mm</text>';
  return { svg: s, teile: { sz_kopf: [-27, -5.5, "l"], sz_kappe: [-35.5, 0, "l"], sz_kern: [-24, 1.5, "l"], sz_mittel: [-13.5, 1, "r"], sz_schwanz: [22, -2.5, "r"] } };
};

TAFEL.e_eizelle = () => {
  let s = "";
  for (let i = 0; i < 26; i++) {
    const a = i / 26 * Math.PI * 2, rr = 34.5 + (i % 2) * 1.6;
    s += ellipse(Math.cos(a) * rr, Math.sin(a) * rr, 3.8, 2.8, FARBE.kranz, FARBE.kranzR, 0.35, a * 180 / Math.PI + 90);
    s += kreis(Math.cos(a) * rr, Math.sin(a) * rr, 0.8, "#b6883f");
  }
  s += kreis(0, 0, 30, FARBE.huelle, FARBE.huelleR, 0.6) + kreis(0, 0, 26, "none", FARBE.huelleR, 0.35);
  s += '<defs><radialGradient id="ez_pl" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#fff6de"/><stop offset="1" stop-color="' + FARBE.zelle + '"/></radialGradient></defs>';
  s += kreis(0, 0, 25.4, "url(#ez_pl)", FARBE.zelleR, 0.5);
  for (let i = 0; i < 70; i++) {
    const a = i * 2.39996, rr = 3 + Math.sqrt(i / 70) * 20;
    s += kreis(Math.cos(a) * rr, Math.sin(a) * rr, 0.45, "#d9bd82");
  }
  s += kreis(5, -4, 7.4, FARBE.kern, FARBE.kernR, 0.5) + kreis(6.8, -5.6, 2, "#5a4380") + kreis(3, -6.5, 1.6, "rgba(255,255,255,.28)");
  s += kreis(-14.5, -20.5, 2.4, "#efe0bd", FARBE.zelleR, 0.35);   // Polkörperchen
  s += '<text x="0" y="45" font-size="3.4" ' + SCHRIFT + ' fill="#7a6a56" text-anchor="middle">0,12 mm</text>';
  return { svg: s, teile: { ez_zelle: [-17, 12, "l"], ez_kern: [5, -4, "r"], ez_huelle: [21, 19.5, "r"], ez_kranz: [-26, -24, "l"], ez_plasma: [-7, 12, "l"] } };
};

TAFEL.e_befruchtung = () => {
  let s = "";
  for (let i = 0; i < 18; i++) {
    const a = i / 18 * Math.PI * 2 + 0.2, rr = 28;
    if (i % 3 === 0) continue;
    s += ellipse(Math.cos(a) * rr, Math.sin(a) * rr, 3.2, 2.4, FARBE.kranz, FARBE.kranzR, 0.3, a * 180 / Math.PI + 90);
  }
  s += kreis(0, 0, 24.5, FARBE.huelle, FARBE.huelleR, 0.55) + kreis(0, 0, 21, FARBE.zelle, FARBE.zelleR, 0.5);
  /* zwei Vorkerne: der der Eizelle und der der Samenzelle */
  s += kreis(-4.5, 1, 5.2, FARBE.kern, FARBE.kernR, 0.45) + kreis(5, -1, 4.6, "#6c83b6", "#43598c", 0.45);
  /* Samenzellen von außen — eine dringt ein */
  const samen = (a, dist, lang) => {
    const cx = Math.cos(a) * dist, cy = Math.sin(a) * dist;
    const dx = Math.cos(a), dy = Math.sin(a);
    const t = [];
    for (let i = 0; i <= 12; i++) { const u = i / 12; t.push([cx + dx * (3 + u * lang) + -dy * Math.sin(u * 9) * 1.4, cy + dy * (3 + u * lang) + dx * Math.sin(u * 9) * 1.4]); }
    return pfad(kurve(t), "none", FARBE.samenR, 0.45) + ellipse(cx, cy, 3.2, 2.1, FARBE.samen, FARBE.samenR, 0.4, a * 180 / Math.PI);
  };
  [[-2.4, 34, 14], [-1.4, 35, 12], [0.9, 36, 13], [2.5, 34, 11], [3.6, 36, 12]].forEach((q) => { s += samen(q[0], q[1], q[2]); });
  s += samen(-0.55, 23, 16);
  return { svg: s, teile: { bf_eizelle: [-12, 12, "l"], bf_huelle: [-17.5, -15.5, "l"], bf_kranz: [-26, 8, "l"], bf_samen: [25, 33, "r"], bf_eindringen: [20, -12, "r"], bf_kern: [5, -1, "r"], bf_befruchtung: [-4.5, 1, "l"] } };
};

TAFEL.e_weg = () => {
  let s = "";
  /* Gebärmutter (Schema von vorn): Muskelwand, Schleimhaut, Höhle */
  const aussen = kurve([[-17, -18], [0, -21], [17, -18], [19, -6], [12, 8], [6, 16], [-6, 16], [-12, 8], [-19, -6]], true);
  s += pfad(aussen, FARBE.muskel, FARBE.muskelR, 0.6);
  s += pfad(kurve([[-13, -14.5], [0, -16.5], [13, -14.5], [13, -5], [8, 6], [4, 12], [-4, 12], [-8, 6], [-13, -5]], true), FARBE.schleim, FARBE.schleimR, 0.4);
  s += pfad(kurve([[-10, -12], [0, -13], [10, -12], [4, 2], [1.5, 11], [-1.5, 11], [-4, 2]], true), FARBE.hoehle, "#e0aaa2", 0.3);
  /* Gebärmutterhals, Muttermund, oberer Teil der Scheide (Schema) */
  s += '<rect x="-6" y="15" width="12" height="9" rx="2" fill="' + FARBE.muskel + '" stroke="' + FARBE.muskelR + '" stroke-width=".5"/>';
  s += pfad("M-1.2 15V24M1.2 15V24", "none", "#e0aaa2", 0.6);
  s += '<path d="M-8 24H8L9.5 40H-9.5Z" fill="#e7a8a0" stroke="' + FARBE.muskelR + '" stroke-width=".45"/>' + pfad("M-2 24.5V39.5M2 24.5V39.5", "none", "#d38e86", 0.4);
  /* Eileiter mit Trichter, Eierstöcke */
  [-1, 1].forEach((sg) => {
    s += pfad(kurve([[sg * 16, -15], [sg * 24, -21], [sg * 33, -20], [sg * 39, -13], [sg * 40, -6]]), "none", FARBE.muskelR, 3.2) + pfad(kurve([[sg * 16, -15], [sg * 24, -21], [sg * 33, -20], [sg * 39, -13], [sg * 40, -6]]), "none", "#e7a19a", 2);
    for (let i = 0; i < 5; i++) s += pfad("M" + sg * (38 + i * 0.8) + " -6l" + sg * (i - 2) * 0.9 + " 4", "none", FARBE.muskelR, 0.5);
    s += ellipse(sg * 33, 4, 8.5, 5.4, FARBE.eierstock, FARBE.eierstockR, 0.5, sg * -20);
    s += kreis(sg * 31, 3, 1.6, "#f7e8cf", FARBE.eierstockR, 0.3) + kreis(sg * 35.5, 5.5, 1.1, "#f7e8cf", FARBE.eierstockR, 0.3);
    s += pfad("M" + sg * 26 + " 2L" + sg * 17 + " -3", "none", "#d9b58c", 0.8);   // Eierstockband
  });
  /* Eisprung links: die Eizelle wandert in den Trichter */
  s += kreis(-39, -2.5, 2.1, FARBE.zelle, FARBE.kranzR, 0.35) + kreis(-39, -2.5, 0.9, FARBE.kern);
  s += kreis(-29, -20.5, 1.5, FARBE.zelle, FARBE.kranzR, 0.3);
  /* Weg der Samenzellen: durch Muttermund und Höhle in den Eileiter */
  s += pfeil([[0, 37], [0, 22], [-2, 5], [-7, -9], [-17, -17], [-27, -21]], "#3e6b86", 0.55, true);
  for (let i = 0; i < 4; i++) s += ellipse(-1.4 + i * 1.2, 30 - i * 3, 0.9, 0.6, FARBE.samen, FARBE.samenR, 0.25, -90);
  /* Einnistung oben in der Schleimhaut */
  s += kreis(6, -11.5, 2, "#f3dcae", "#b8914a", 0.35);
  return { svg: s, teile: {
    w_gebaermutter: [15, -10, "r"], w_hoehle: [0, -6, "r"], w_schleimhaut: [-11.5, -8, "l"], w_einnistung: [6, -11.5, "r"],
    w_muttermund: [0, 24, "r"], w_scheide: [-6, 34, "l"], w_eileiter: [25, -21, "r"], w_trichter: [40.5, -5, "r"],
    w_eierstock: [33, 4, "r"], w_ampulle: [-27, -21, "l"], w_eizelle: [-39, -2.5, "l"], w_samenzelle: [1.5, 27, "r"], w_weg: [-4, 5, "l"],
  } };
};

TAFEL.e_einnistung = () => {
  let s = "";
  /* Schnitt durch die Gebärmutterschleimhaut: oben die Höhle, darunter
     die Schleimhaut mit Drüsen und Gefäßen, ganz unten die Muskelwand. */
  s += '<rect x="-46" y="-8" width="92" height="36" fill="' + FARBE.schleim + '"/>';
  s += '<rect x="-46" y="28" width="92" height="12" fill="' + FARBE.muskel + '"/>';
  for (let i = 0; i < 8; i++) s += pfad("M" + (-44 + i * 12) + " 30Q" + (-38 + i * 12) + " 34 " + (-32 + i * 12) + " 31", "none", FARBE.muskelR, 0.35);
  s += pfad(kurve([[-46, -8], [-34, -10], [-22, -7.5], [-10, -9.5], [2, -7], [14, -9.8], [26, -7.2], [38, -9.5], [46, -8]]), "none", FARBE.schleimR, 0.7);
  /* Drüsen */
  [-38, -26, 22, 34].forEach((x) => { s += pfad(kurve([[x, -8], [x + 1.5, 2], [x - 1.2, 12], [x + 1, 22]]), "none", "#e8a79d", 1.6) + pfad(kurve([[x, -8], [x + 1.5, 2], [x - 1.2, 12], [x + 1, 22]]), "none", "#fbe0da", 0.6); });
  /* Blutgefäße */
  s += pfad(kurve([[-46, 20], [-30, 17], [-18, 21], [-6, 18], [8, 22], [22, 18], [46, 21]]), "none", FARBE.blut, 1.1);
  s += pfad(kurve([[-46, 24], [-28, 26], [-12, 23], [6, 26], [24, 23], [46, 25]]), "none", FARBE.vene, 1.1);
  s += pfad(kurve([[-6, 18], [-4, 10], [-8, 3]]), "none", FARBE.blut, 0.6) + pfad(kurve([[10, 21], [8, 12], [11, 4]]), "none", FARBE.blut, 0.6);
  /* Die Keimblase, halb eingesunken */
  s += kreis(0, -12, 14.5, "#f7ecd3", "#b8914a", 0.5);
  for (let i = 0; i < 28; i++) { const a = i / 28 * Math.PI * 2; s += ellipse(Math.cos(a) * 12.8, -12 + Math.sin(a) * 12.8, 2.2, 1.3, "#efdcb2", "#b8914a", 0.25, a * 180 / Math.PI + 90); }
  s += kreis(0, -12, 11, "#fdf7ea");
  /* Embryoblast: die Zellgruppe, aus der das Kind wird (unten, zur Schleimhaut) */
  for (let i = 0; i < 9; i++) s += kreis(-4 + (i % 3) * 4, -4 + Math.floor(i / 3) * -3.2, 2.1, "#f0d49a", "#b8914a", 0.3);
  /* Trophoblast wächst in die Schleimhaut */
  s += pfad(kurve([[-10, -1], [-8, 5], [-3, 8], [3, 8], [8, 5], [10, -1]]), "rgba(214,160,90,.35)", "#b8914a", 0.35, ' stroke-dasharray="1 .8"');
  s += '<text x="-44" y="-30" font-size="3.2" ' + SCHRIFT + ' fill="#7a6a56">etwa 7. Tag</text>';
  return { svg: s, teile: {
    en_keimblase: [-9, -19, "l"], en_trophoblast: [12.5, -18, "r"], en_embryoblast: [0, -8, "r"], en_hoehle: [-3, -17, "l"],
    en_schleimhaut: [-30, 6, "l"], en_blutgefaess: [30, 19, "r"], en_einnistung: [6, 6, "r"],
  } };
};

TAFEL.e_teilung = () => {
  let s = "";
  /* Das Stück Eileiter, durch das die Zellen wandern, bis in die Gebärmutter */
  s += pfad(kurve([[-48, -8], [-20, -14], [10, -12], [34, -4], [48, 4]]), "none", "#e7a19a", 24) + pfad(kurve([[-48, -8], [-20, -14], [10, -12], [34, -4], [48, 4]]), "none", "#fbe5df", 18);
  s += '<rect x="30" y="6" width="18" height="30" fill="' + FARBE.schleim + '"/>' + pfad(kurve([[30, 10], [36, 8], [42, 10], [48, 8]]), "none", FARBE.schleimR, 0.6);
  const zelle = (x, y, r) => kreis(x, y, r, FARBE.zelle, FARBE.zelleR, 0.35) + kreis(x, y, r * 0.35, FARBE.kern);
  const kugel = (x, y, rr, pts) => kreis(x, y, rr + 1.6, FARBE.huelle, FARBE.huelleR, 0.35) + pts.map((q) => zelle(x + q[0], y + q[1], q[2])).join("");
  s += kugel(-38, -10, 4.5, [[0, 0, 4.4]]) + kreis(-39.5, -10, 1.3, FARBE.kern) + kreis(-36.5, -10, 1.2, "#6c83b6");
  s += kugel(-23, -12.5, 4.5, [[-2.2, 0, 2.4], [2.2, 0, 2.4]]);
  s += kugel(-8, -12.5, 4.5, [[-2, -2, 2], [2, -2, 2], [-2, 2, 2], [2, 2, 2]]);
  s += kugel(7, -10.5, 4.6, [[-2.6, -2.4, 1.5], [0, -3.2, 1.5], [2.6, -2.4, 1.5], [-3, 0.3, 1.5], [0, 0, 1.5], [3, 0.3, 1.5], [-2, 2.8, 1.5], [1.2, 3, 1.5]]);
  /* Keimblase: hohl, mit Zellhaufen innen */
  s += kreis(22, -4, 6.5, "#f7ecd3", "#b8914a", 0.4) + kreis(22, -4, 4.8, "#fdf7ea") + kreis(19.6, -3.5, 1.4, "#f0d49a", "#b8914a", 0.2) + kreis(20.3, -1.6, 1.3, "#f0d49a", "#b8914a", 0.2);
  s += kreis(38, 10, 4.6, "#f7ecd3", "#b8914a", 0.4);
  [[-31, -11], [-16, -13], [-0.5, -12], [14.5, -8], [29, 3]].forEach((q) => { s += pfeil([[q[0] - 1.6, q[1]], [q[0] + 1.6, q[1] + 0.2]], "#8a6a4a", 0.45); });
  ["1. Tag", "2.", "3.", "4.", "5.", "7."].forEach((t, i) => { s += '<text x="' + [-38, -23, -8, 7, 22, 38][i] + '" y="' + [-18, -20, -20, -18.5, -13, 20][i] + '" font-size="2.8" ' + SCHRIFT + ' fill="#7a6a56" text-anchor="middle">' + t + "</text>"; });
  return { svg: s, teile: {
    t_zygote: [-38, -10, "l"], t_teilung: [-23, -12.5, "l"], t_vierzeller: [-8, -12.5, "l"], t_maulbeere: [7, -10.5, "r"],
    t_keimblase: [22, -4, "r"], t_eileiter: [-14, 2, "l"], t_schleimhaut: [42, 26, "r"], t_einnistung: [38, 10, "r"],
  } };
};

TAFEL.e_schwanger = () => {
  let s = "";
  /* Gebärmutter im Längsschnitt, Kind mit dem Kopf nach unten */
  const wand = kurve([[0, -40], [22, -35], [30, -14], [27, 12], [14, 30], [6, 36], [-6, 36], [-14, 30], [-27, 12], [-30, -14], [-22, -35]], true);
  s += pfad(wand, FARBE.muskel, FARBE.muskelR, 0.7);
  s += pfad(kurve([[0, -36], [19, -31.5], [26, -13], [23, 10], [11, 26.5], [0, 30.5], [-11, 26.5], [-23, 10], [-26, -13], [-19, -31.5]], true), FARBE.wasser, FARBE.wasserR, 0.45);
  /* Mutterkuchen oben rechts */
  s += pfad(kurve([[6, -35.5], [18, -32], [24, -20], [18, -22], [10, -28]], true), FARBE.kuchen, FARBE.kuchenR, 0.5);
  for (let i = 0; i < 5; i++) s += pfad("M" + (9 + i * 3) + " " + (-31 + i * 2.2) + "l2 2", "none", "#d46a63", 0.4);
  /* Gebärmutterhals und geschlossener Muttermund */
  s += '<rect x="-5" y="34" width="10" height="8" rx="2" fill="' + FARBE.muskel + '" stroke="' + FARBE.muskelR + '" stroke-width=".5"/>' + pfad("M0 34V42", "none", FARBE.muskelR, 0.8);
  const f = foetusAmKopf(-2, 19, 42, 168, "sw");
  s += f.svg;
  /* Nabelschnur vom Mutterkuchen zum Nabel, gedreht */
  const nb = f.nabel;
  const pts = [[16, -24], [16, -12], [10, -8], [nb[0] + 4, nb[1] - 2], nb];
  s += pfad(kurve(pts), "none", "#b5646b", 2.6) + pfad(kurve(pts), "none", FARBE.nabel, 1.6) + pfad(kurve(pts), "none", "#b5646b", 0.4, ' stroke-dasharray="1 1.2"');
  return { svg: s, teile: {
    g_kind: [-6, -8, "l"], g_kopf: [f.kopf[0], f.kopf[1], "l"], g_blase: [-23, -18, "l"], g_wasser: [18, 8, "r"],
    g_kuchen: [16, -29, "r"], g_nabel: [14, -12, "r"], g_wand: [26, 16, "r"], g_muttermund: [0, 40, "r"],
  } };
};

TAFEL.e_wachstum = () => {
  let s = "";
  /* Größe zum Vergleich — Monat für Monat, maßstäblich zueinander */
  s += '<path d="M-48 32H48" stroke="#b9a88c" stroke-width=".5"/>';
  const stufen = [
    { x: -42, mon: "1.", h: 2.4, art: 1 }, { x: -33, mon: "2.", h: 5, art: 2 },
    { x: -22, mon: "3.", h: 9 }, { x: -7, mon: "5.", h: 14 }, { x: 12, mon: "7.", h: 20 }, { x: 35, mon: "9. Monat", h: 26 },
  ];
  const mitte = {};
  stufen.forEach((st, i) => {
    const y = 31 - st.h / 2;
    if (st.art) s += embryo(st.x, y, st.h / 6.5, st.art);
    else s += foetus(st.x, y, st.h, -8, "wa" + i).svg;
    mitte[i] = [st.x, y];
    s += '<text x="' + st.x + '" y="38.5" font-size="2.9" ' + SCHRIFT + ' fill="#7a6a56" text-anchor="middle">' + st.mon + "</text>";
  });
  s += pfeil([[-44, -30], [0, -34], [44, -30]], "#8a6a4a", 0.5);
  return { svg: s, teile: {
    wa_embryo: [mitte[1][0], mitte[1][1], "l"], wa_foetus: [mitte[3][0], mitte[3][1], "l"], wa_wachsen: [0, -33.5, "r"],
    wa_monat: [20, 38, "r"], wa_reif: [mitte[5][0], mitte[5][1], "r"],
  } };
};

TAFEL.e_geburt = () => {
  let s = "";
  /* Becken (Knochenring) hinter dem Geburtskanal */
  s += pfad(kurve([[-30, 6], [-24, -4], [-12, -2], [-10, 16], [-18, 30], [-30, 26]], true), FARBE.knochen, FARBE.knochenR, 0.5);
  s += pfad(kurve([[30, 6], [24, -4], [12, -2], [10, 16], [18, 30], [30, 26]], true), FARBE.knochen, FARBE.knochenR, 0.5);
  /* Gebärmutter, unten weit offen */
  const wand = kurve([[0, -44], [20, -40], [28, -22], [26, -2], [16, 12], [9, 18], [-9, 18], [-16, 12], [-26, -2], [-28, -22], [-20, -40]], true);
  s += pfad(wand, FARBE.muskel, FARBE.muskelR, 0.7);
  s += pfad(kurve([[0, -40], [17, -36], [24, -21], [22, -3], [13, 9], [7, 16], [-7, 16], [-13, 9], [-22, -3], [-24, -21], [-17, -36]], true), FARBE.wasser, FARBE.wasserR, 0.4);
  s += pfad(kurve([[-14, -38], [-2, -41], [8, -39], [2, -34], [-8, -34]], true), FARBE.kuchen, FARBE.kuchenR, 0.4);
  /* Geburtskanal */
  s += '<path d="M-9 17L-11 42H11L9 17Z" fill="#e7a8a0" stroke="' + FARBE.muskelR + '" stroke-width=".45"/>';
  const f = foetusAmKopf(0, 11, 42, 176, "gb");
  s += f.svg;
  s += pfad(kurve([[0, -34], [-6, -26], [f.nabel[0] - 3, f.nabel[1] - 3], f.nabel]), "none", "#b5646b", 1.8) + pfad(kurve([[0, -34], [-6, -26], [f.nabel[0] - 3, f.nabel[1] - 3], f.nabel]), "none", FARBE.nabel, 1.1);
  /* Wehen: die Muskelwand drückt von oben */
  [[-26, -34], [26, -34], [0, -48]].forEach((q) => { s += pfeil([q, [q[0] * 0.7, q[1] + 6]], "#9e4f4b", 0.6); });
  return { svg: s, teile: {
    gb_wehen: [26, -34, "r"], gb_kind: [-10, -14, "l"], gb_kopf: [f.kopf[0], f.kopf[1], "r"], gb_muttermund: [-8.5, 17.5, "l"],
    gb_kanal: [0, 34, "r"], gb_becken: [-24, 18, "l"], gb_nachgeburt: [-2, -38, "l"], gb_geburt: [12, -22, "r"],
  } };
};

/* Wörter der neuen Tafel „die Einnistung“ */
const EINNISTUNG = {
  id: "e_einnistung", de: "die Einnistung", syl: "EIN-nis-tung", it: "l'impianto", itSyl: "im-PIAN-to", en: "implantation",
  unter: [
    { id: "en_keimblase", de: "die Keimblase", syl: "KEIM-bla-se", it: "la blastocisti", itSyl: "bla-sto-CI-sti", en: "blastocyst" },
    { id: "en_trophoblast", de: "der Trophoblast", syl: "Tro-pho-BLAST", it: "il trofoblasto", itSyl: "tro-fo-BLA-sto", en: "trophoblast" },
    { id: "en_embryoblast", de: "der Embryoblast", syl: "Em-bry-o-BLAST", it: "l'embrioblasto", itSyl: "em-brio-BLA-sto", en: "embryoblast" },
    { id: "en_hoehle", de: "die Keimblasenhöhle", syl: "KEIM-bla-sen-höh-le", it: "la cavità della blastocisti", itSyl: "ca-vi-TÀ", en: "blastocyst cavity" },
    { id: "en_schleimhaut", de: "die Gebärmutterschleimhaut", syl: "ge-BÄR-mut-ter-schleim-haut", it: "l'endometrio", itSyl: "en-do-ME-trio", en: "uterine lining" },
    { id: "en_blutgefaess", de: "das Blutgefäß", syl: "BLUT-ge-fäß", it: "il vaso sanguigno", itSyl: "VA-so san-GUI-gno", en: "blood vessel" },
    { id: "en_einnistung", de: "die Einnistung", syl: "EIN-nis-tung", it: "l'impianto", itSyl: "im-PIAN-to", en: "implantation" },
  ],
};

function bau() {
  const S = L.lade("entstehung");
  const d = S.d;
  const B = d.breite, H = d.hoehe;
  const reihe = ["e_samenzelle", "e_eizelle", "e_befruchtung", "e_weg", "e_einnistung", "e_teilung", "e_schwanger", "e_wachstum", "e_geburt"];
  /* Die alte Tafel 5 ersetzen */
  const i5 = d.teile.findIndex((t) => t.id === "e_verkehr");
  if (i5 >= 0) d.teile.splice(i5, 1, Object.assign({}, EINNISTUNG, { x: 0, y: 0, kunst: "" }));
  const nachId = {};
  d.teile.forEach((t) => { nachId[t.id] = t; });
  if (!nachId.e_einnistung) { d.teile.splice(4, 0, Object.assign({}, EINNISTUNG, { x: 0, y: 0, kunst: "" })); nachId.e_einnistung = d.teile[4]; }
  const neu = reihe.map((id) => nachId[id]);
  d.teile = neu;

  const zw = 116, zh = 106;
  let kulisse = '<rect x="0" y="0" width="' + B + '" height="' + H + '" fill="#f6f0e7"/>';
  for (let x = 12; x < B; x += 12) kulisse += '<line x1="' + x + '" y1="0" x2="' + x + '" y2="' + H + '" stroke="#ece3d5" stroke-width=".45"/>';
  for (let y = 12; y < H; y += 12) kulisse += '<line x1="0" y1="' + y + '" x2="' + B + '" y2="' + y + '" stroke="#ece3d5" stroke-width=".45"/>';
  let beschr = "";
  neu.forEach((t, n) => {
    const cx = 58 + (n % 3) * zw, cy = 54 + Math.floor(n / 3) * zh;
    kulisse += '<rect x="' + (cx - 55) + '" y="' + (cy - 50) + '" width="110" height="100" rx="6" fill="#fdfaf5" stroke="#e0d3bf" stroke-width=".7"/>';
    kulisse += '<circle cx="' + (cx - 49) + '" cy="' + (cy - 44) + '" r="3.6" fill="#e9dcc6"/><text x="' + (cx - 49) + '" y="' + (cy - 42.8) + '" font-size="3.6" ' + SCHRIFT + ' font-weight="700" fill="#7a6a56" text-anchor="middle">' + (n + 1) + "</text>";
    if (n % 3 < 2) kulisse += '<path d="M' + (cx + 55.5) + " " + cy + "h3.5m-1.6 -1.6l1.6 1.6l-1.6 1.6" + '" stroke="#c7b597" stroke-width=".6" fill="none"/>';
    const tf = TAFEL[t.id]();
    /* Die Zeichnung etwas kleiner, damit links und rechts Platz für die
       Wörter bleibt; die Wörter liegen ÜBER der Zeichnung (in der Tafel
       selbst), mit hellem Rand, damit man sie lesen kann. */
    const SK = 0.8;
    Object.keys(tf.teile).forEach((uid) => { tf.teile[uid] = [tf.teile[uid][0] * SK, tf.teile[uid][1] * SK + 3, tf.teile[uid][2]]; });
    t.x = cx; t.y = cy;
    t.kunst = '<g transform="translate(0,3) scale(' + SK + ')">' + tf.svg + "</g>";
    t.zoom = { x: cx - 55, y: cy - 50, w: 110, h: 100 };
    /* Die Einzelteile: gleiche ids und Wörter, neue Stellen */
    const alte = {};
    (t.unter || []).forEach((u) => { alte[u.id] = u; });
    const quelle = t.id === "e_einnistung" ? EINNISTUNG.unter : (t.unter || []);
    const ids = Object.keys(tf.teile);
    t.unter = ids.map((uid) => {
      const u = Object.assign({}, alte[uid] || quelle.find((q) => q.id === uid) || { id: uid });
      const p = tf.teile[uid];
      u.x = r1(cx + p[0]); u.y = r1(cy + p[1]);
      u.kunst = flaeche(7, 6);
      return u;
    });
    /* Beschriftungen: links und rechts am Tafelrand, nach der Höhe sortiert */
    ["l", "r"].forEach((seite) => {
      const liste = ids.filter((uid) => tf.teile[uid][2] === seite).sort((a, b) => tf.teile[a][1] - tf.teile[b][1]);
      liste.forEach((uid, k) => {
        const p = tf.teile[uid];
        const u = t.unter.find((q) => q.id === uid);
        const ty = cy - 38 + (k + 0.5) * (80 / Math.max(liste.length, 1));
        const tx = seite === "l" ? cx - 53 : cx + 53;
        t.kunst += L.beschriftung([p[0], p[1]], [tx - cx, ty - cy], u.de || uid, 2.9, seite === "l" ? "start" : "end");
      });
    });
  });
  d.kulisse = kulisse + beschr;
  d.zahl = d.teile.length;
  L.speichere(S);
  const groesse = JSON.stringify(d).length;
  console.log("entstehung: " + d.teile.length + " Tafeln, " + d.teile.reduce((a, t) => a + t.unter.length, 0) + " Einzelteile, " + (groesse / 1024).toFixed(0) + " KB");
}
module.exports = { bau, foetus };
