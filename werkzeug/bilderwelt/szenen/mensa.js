#!/usr/bin/env node
/* =====================================================================
   DIE MENSA (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (Speisepläne des Studentenwerks Dresden 2026, Mensa-Infos
   der Uni Münster und der Uni Duisburg-Essen):
   - LINIENAUSGABE: Am Anfang nimmt man ein TABLETT und das BESTECK
     (Messer, Gabel, Löffel im Besteckkasten), schiebt das Tablett auf
     der Tablettrutsche an der ESSENSAUSGABE entlang. Hinter dem
     Hustenschutz aus Glas stehen die warmen Speisen in GN-Behältern;
     die KÜCHENKRAFT gibt den TELLER heraus.
   - Über der Ausgabe der SPEISEPLAN auf Bildschirmen: Tagesgericht,
     vegan, Beilagen – mit drei Preisen: Studierende (ca. 2,35 €),
     Bedienstete, Gäste.
   - Am Ende die KASSE: Man zahlt mit der Mensakarte (CHIPKARTE, oft
     zugleich Studentenausweis) am Kartenleser – bar geht oft nicht.
   - Mittags ist die SCHLANGE lang; Absperrbänder leiten sie.
   - Lange ESSTISCHE mit STÜHLEN, auf dem Tisch Serviettenspender, Salz
     und Pfeffer. Nach dem Essen stellt man das Tablett auf das
     RÜCKGABEBAND (Tablettrückgabe), das es in die Spülküche fährt.
   BLICK: frontal auf die Ausgabe, Augenhöhe 1,6 m, Fluchtpunkt Mitte.
   Maßstab: Rückwand 36 Einheiten je Meter, Theke 0,9 m, Tisch 0,75 m.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "mensa", titel: "Die Mensa", emoji: "🍽️", thema: "Bildung", kuerzel: "b09e", fassung: 852 });
const rnd = zufall(235);
const r = B.r;

/* ---------- Kamera ---------------------------------------------------- */
const HY = 70, E = 1.6, D = 7, S0 = 36, VX = 160;
const sk = (z) => S0 * D / (D - z);
const P = (X, H, z) => [r(VX + X * sk(z)), r(HY + (E - H) * sk(z))];
function klipp(pts) {
  const kanten = [[(p) => p[0] >= 0, (a, b) => { const t = (0 - a[0]) / (b[0] - a[0]); return [0, a[1] + t * (b[1] - a[1])]; }],
    [(p) => p[0] <= 320, (a, b) => { const t = (320 - a[0]) / (b[0] - a[0]); return [320, a[1] + t * (b[1] - a[1])]; }],
    [(p) => p[1] >= 0, (a, b) => { const t = (0 - a[1]) / (b[1] - a[1]); return [a[0] + t * (b[0] - a[0]), 0]; }],
    [(p) => p[1] <= 200, (a, b) => { const t = (200 - a[1]) / (b[1] - a[1]); return [a[0] + t * (b[0] - a[0]), 200]; }]];
  let out = pts;
  for (const [drin, schnitt] of kanten) {
    const inp = out; out = [];
    for (let i = 0; i < inp.length; i++) {
      const a = inp[(i + inp.length - 1) % inp.length], b = inp[i];
      if (drin(b)) { if (!drin(a)) out.push(schnitt(a, b)); out.push(b); } else if (drin(a)) out.push(schnitt(a, b));
    }
    if (!out.length) return out;
  }
  return out.map((p) => [r(p[0]), r(p[1])]);
}
const poly = (pts, fill, extra = "") => { const q = klipp(pts); return q.length < 3 ? "" : `<path d="M${q.map((p) => p[0] + " " + p[1]).join(" L")} Z" fill="${fill}"${extra ? " " + extra : ""}/>`; };
const L = (a, b, w, f, ex = "") => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${f}" stroke-width="${w}" stroke-linecap="round"${ex}/>`;
const um = (ox, oy, svg) => `<g transform="translate(${r(-ox)} ${r(-oy)})">${svg}</g>`;
function kiste(X0, X1, H0, H1, z0, z1, f) {
  let g = "";
  if (X1 < 0 && f.seite) g += poly([P(X1, H0, z1), P(X1, H0, z0), P(X1, H1, z0), P(X1, H1, z1)], f.seite);
  if (X0 > 0 && f.seite) g += poly([P(X0, H0, z1), P(X0, H0, z0), P(X0, H1, z0), P(X0, H1, z1)], f.seite);
  if (H1 < E && f.deckel) g += poly([P(X0, H1, z1), P(X1, H1, z1), P(X1, H1, z0), P(X0, H1, z0)], f.deckel);
  if (f.vorn) g += poly([P(X0, H0, z1), P(X1, H0, z1), P(X1, H1, z1), P(X0, H1, z1)], f.vorn);
  return g;
}
const WX = (X) => r(VX + X * S0), WY = (H) => r(HY + (E - H) * S0);
const T = (x, y, s, txt, f = "#222", extra = "") => `<text x="${r(x)}" y="${r(y)}" font-size="${r(s)}" fill="${f}" font-family="Arial,Helvetica,sans-serif"${extra ? " " + extra : ""}>${txt}</text>`;
function blatt(X, z, w, t, dreh, h) {
  const c = Math.cos(dreh), s = Math.sin(dreh);
  return [[-w / 2, -t / 2], [w / 2, -t / 2], [w / 2, t / 2], [-w / 2, t / 2]].map(([a, b]) => P(X + a * c - b * s, h, z + a * s + b * c));
}
/* liegende Ellipse (Teller, Schüssel) in der Ebene H */
function ellipseB(X, z, rx, rz, h, n = 18) { const pts = []; for (let i = 0; i < n; i++) { const a = i / n * 2 * Math.PI; pts.push(P(X + Math.cos(a) * rx, h, z + Math.sin(a) * rz)); } return pts; }

/* ---------- Farben ---------------------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const GRUEN = "#5f9e2f", GRUEN_D = "#3f7a1d";
const STAHL = S.lg("stahl", [[0, "#eef1f3"], [0.45, "#c9cfd4"], [0.55, "#b5bcc2"], [1, "#e1e5e8"]], 0, 0, 1, 0);
const STAHL_H = S.lg("stahlh", [[0, "#dfe4e8"], [1, "#b9c1c7"]]);
const HOLZ = S.lg("holz", [[0, "#e2c597"], [1, "#d0ae78"]]);

/* =====================================================================
   KULISSE — Rasterdecke mit Pendelleuchten, Rückwand (unten Fliesen,
   oben grünes Band), Terrazzo-Boden
   ===================================================================== */
const XL = -4.3, XR = 4.3, HD = 3.2;
{
  const WO = WY(HD), WU = WY(0);
  let k = `<rect x="0" y="0" width="320" height="${WO}" fill="${S.lg("decke", [[0, "#e7e5df"], [1, "#f3f2ee"]])}"/>`;
  for (let X = -4; X <= 4.01; X += 0.6) k += L(P(X, HD, 0), P(X, HD, 3.5), 0.3, "#d5d2ca");
  /* Rückwand */
  k += `<rect x="${WX(XL)}" y="${WO}" width="${r(WX(XR) - WX(XL))}" height="${r(WU - WO)}" fill="${S.lg("wand", [[0, "#f3f1ea"], [1, "#e6e2d7"]])}"/>`;
  k += `<rect x="${WX(XL)}" y="${WY(3.0)}" width="${r(WX(XR) - WX(XL))}" height="${r(WY(2.92) - WY(3.0))}" fill="${GRUEN}"/>`;
  /* Fliesen hinter der Ausgabe (Küchenwand) */
  let fl = "";
  for (let H = 0.9; H < 2.0; H += 0.15) for (let X = -3.4; X < 1.25; X += 0.15) fl += `<rect x="${WX(X)}" y="${WY(H + 0.15)}" width="${r(0.15 * S0 - 0.3)}" height="${r(0.15 * S0 - 0.3)}" fill="#fbfbf9" stroke="#dcd8ce" stroke-width=".2"/>`;
  k += fl;
  /* Durchreiche zur Küche mit Edelstahlrahmen */
  k += `<rect x="${WX(-2.6)}" y="${WY(1.95)}" width="${r(1.4 * S0)}" height="${r(0.65 * S0)}" fill="${S.lg("kueche", [[0, "#cdd3d6"], [1, "#a9b1b6"]])}"/>`;
  for (const X of [-2.45, -2.05, -1.65]) k += `<rect x="${WX(X)}" y="${WY(1.82)}" width="${r(0.3 * S0)}" height="${r(0.42 * S0)}" fill="${STAHL}"/><circle cx="${WX(X + 0.15)}" cy="${WY(1.52)}" r="1.2" fill="#3a3f45"/>`;
  k += `<rect x="${WX(-2.6)}" y="${WY(1.95)}" width="${r(1.4 * S0)}" height="${r(0.65 * S0)}" fill="none" stroke="#9aa3aa" stroke-width="1"/>`;
  /* Seitenwände */
  k += poly([P(XL, HD, 0), P(XL, HD, 3), P(XL, 0, 3), P(XL, 0, 0)], "#ddd8cc") + poly([P(XR, HD, 0), P(XR, HD, 3), P(XR, 0, 3), P(XR, 0, 0)], "#ddd8cc");
  /* Terrazzo-Boden */
  k += poly([P(XL, 0, 0), P(XR, 0, 0), P(XR, 0, 4), P(XL, 0, 4)], S.lg("boden", [[0, "#c2bdb3"], [1, "#aea89d"]]));
  for (let X = -4.2; X <= 4.2; X += 0.6) k += L(P(X, 0, 0), P(X, 0, 4), 0.3, "#9b958a");
  for (let z = 0.6; z < 4; z += 0.6) k += L(P(XL, 0, z), P(XR, 0, z), 0.3, "#9b958a");
  for (let i = 0; i < 260; i++) { const X = XL + rnd() * 8.6, z = rnd() * 3.6, [x, y] = P(X, 0, z); if (x > 0 && x < 320 && y < 200) k += `<circle cx="${x}" cy="${y}" r="${r(0.2 + rnd() * 0.3)}" fill="${["#8a8378", "#e8e4dc", "#6d8a5c", "#b07a55"][i % 4]}" opacity=".55"/>`; }
  k += `<rect x="${WX(XL)}" y="${r(WU - 2.2)}" width="${r(WX(XR) - WX(XL))}" height="2.2" fill="#7b766c"/>`;
  k += `<rect x="0" y="${WU}" width="320" height="${r(200 - WU)}" fill="${S.lg("bl", [[0, "#000", 0.1], [0.5, "#000", 0], [1, "#fff", 0.07]])}"/>`;
  /* Pendelleuchten über dem Essbereich */
  for (const [X, z] of [[-2.2, 2.6], [1.8, 2.6]]) {
    const [x, y] = P(X, 2.35, z), [, yd] = P(X, HD, z), s = sk(z) / S0;
    k += `<line x1="${x}" y1="${yd}" x2="${x}" y2="${y}" stroke="#555" stroke-width=".3"/><path d="M${r(x - 6 * s)} ${r(y + 3 * s)} Q${x} ${r(y - 2 * s)} ${r(x + 6 * s)} ${r(y + 3 * s)} Z" fill="${GRUEN_D}"/><ellipse cx="${x}" cy="${r(y + 3 * s)}" rx="${r(6 * s)}" ry="${r(1 * s)}" fill="#fff6d6"/>`;
  }
  S.hinten(k);
}

/* =====================================================================
   1 — DER SPEISEPLAN (drei Bildschirme über der Ausgabe) mit Lupe
   ===================================================================== */
{
  const x0 = WX(-3.0), x1 = WX(1.0), y0 = WY(2.88), y1 = WY(2.24), w = x1 - x0;
  let k = `<rect x="${x0 - 1}" y="${y0 - 3.4}" width="${r(w + 2)}" height="2.6" fill="${GRUEN}"/>` + T((x0 + x1) / 2, y0 - 1.4, 2, "SPEISEPLAN · MITTWOCH", "#fff", 'text-anchor="middle" font-weight="bold" letter-spacing=".4"');
  const bw = (w - 4) / 3, U = [];
  const tafeln = [
    ["Tagesgericht", "Spaghetti Bolognese", "mit Parmesan", "2,35", "4,90", "5,88", "#c0392b", ["me_tagesgericht", "das Tagesgericht", "TA-ges-ge-richt", "il piatto del giorno", "PIAT-to del GIOR-no", "dish of the day", "Das Tagesgericht ist für Studierende am billigsten."]],
    ["vegan", "Gemüsecurry", "mit Reis", "2,60", "5,20", "6,24", GRUEN, ["vegan_gericht", "das vegane Gericht", "ve-GA-ne ge-RICHT", "il piatto vegano", "PIAT-to ve-GA-no", "vegan dish", "Vegan heißt: ohne Fleisch, Fisch, Milch und Ei."]],
    ["Beilagen", "Salat · Pommes", "Pudding", "0,90", "1,50", "1,80", "#2f6db5", ["beilage", "die Beilage", "BEI-la-ge", "il contorno", "con-TOR-no", "side dish", "Beilagen kann man zum Essen dazunehmen."]],
  ];
  tafeln.forEach(([kopf, a, b, p1, p2, p3, f, wort], i) => {
    const x = x0 + 1 + i * (bw + 1);
    k += `<rect x="${r(x)}" y="${y0}" width="${r(bw)}" height="${r(y1 - y0)}" rx=".6" fill="#16191c"/>`;
    k += `<rect x="${r(x + 0.8)}" y="${y0 + 0.8}" width="${r(bw - 1.6)}" height="${r(y1 - y0 - 1.6)}" fill="${S.lg("bild" + i, [[0, "#22303b"], [1, "#151d24"]])}"/>`;
    k += `<rect x="${r(x + 0.8)}" y="${y0 + 0.8}" width="${r(bw - 1.6)}" height="3.4" fill="${f}"/>` + T(x + 2, y0 + 3.4, 2.2, kopf, "#fff", 'font-weight="bold"');
    k += T(x + 2, y0 + 7.8, 2.4, a, "#fff", 'font-weight="bold"') + T(x + 2, y0 + 10.6, 1.9, b, "#cfd8de");
    k += T(x + 2, y0 + 15.4, 1.5, "Stud.", "#9fb3c2") + T(x + 2, y0 + 18.6, 2.6, p1 + " €", "#ffd166", 'font-weight="bold"');
    k += T(x + bw - 2, y0 + 15.4, 1.3, "Bed. " + p2 + " · Gäste " + p3, "#9fb3c2", 'text-anchor="end"');
    const [id, de, syl, it, itSyl, en, tipp] = wort;
    U.push({ id, de, syl, it, itSyl, en, tipp, x: r(x + bw / 2), y: r(y1), kunst: flaeche(-bw / 2, -(y1 - y0), bw, y1 - y0) });
  });
  const ax = (x0 + x1) / 2, ay = y1;
  S.teil({ id: "speiseplan", de: "der Speiseplan", syl: "SPEI-se-plan", it: "il menù", itSyl: "me-NÙ", en: "menu", x: ax, y: ay, kunst: um(ax, ay, k),
    zoom: { x: r(x0 - 3), y: r(y0 - 6), w: r(w + 6), h: r((w + 6) / 1.5) }, unter: U,
    tipp: "Auf dem Speiseplan stehen drei Preise: für Studierende, Bedienstete und Gäste." });
}

/* =====================================================================
   2 — DIE RÜCKGABE (Tablettrückgabe mit Band, rechts in der Wand)
   ===================================================================== */
{
  const x0 = WX(2.75), x1 = WX(4.05), y0 = WY(2.0), y1 = WY(0.78), w = x1 - x0;
  let k = `<rect x="${x0 - 1.4}" y="${y0 - 1.4}" width="${r(w + 2.8)}" height="${r(y1 - y0 + 1.4)}" fill="${STAHL}"/>`;
  k += `<rect x="${x0}" y="${y0}" width="${r(w)}" height="${r(y1 - y0)}" fill="${S.lg("spuele", [[0, "#5b6670"], [1, "#3c454d"]])}"/>`;
  /* Regalband: Etagen mit Tabletts, die nach links in die Spülküche fahren */
  for (let j = 0; j < 4; j++) {
    const y = y0 + 6 + j * 9;
    k += `<rect x="${x0}" y="${r(y)}" width="${r(w)}" height="1" fill="#9aa3aa"/>`;
    for (let i = 0; i < 2; i++) {
      if ((i + j) % 3 === 2) continue;
      const tx = x0 + 3 + i * 23;
      k += `<path d="M${r(tx)} ${r(y)} L${r(tx + 18)} ${r(y)} L${r(tx + 17)} ${r(y - 1.6)} L${r(tx + 1)} ${r(y - 1.6)} Z" fill="#8a5a3a"/>`;
      k += `<ellipse cx="${r(tx + 6)}" cy="${r(y - 2)}" rx="4" ry="1" fill="#f4f1ea"/><path d="M${r(tx + 12)} ${r(y - 1.6)} L${r(tx + 12.4)} ${r(y - 5)} L${r(tx + 14.4)} ${r(y - 5)} L${r(tx + 14.8)} ${r(y - 1.6)} Z" fill="#dfeef2" opacity=".85"/>`;
    }
  }
  /* Ablagebrett und Schild */
  k += `<rect x="${x0 - 2}" y="${y1 - 1.2}" width="${r(w + 4)}" height="2.2" fill="${STAHL}"/>`;
  k += `<rect x="${x0 + 4}" y="${y0 - 8}" width="${r(w - 8)}" height="5" rx=".6" fill="${GRUEN}"/>` + T((x0 + x1) / 2, y0 - 4.6, 2.3, "Tablettrückgabe", "#fff", 'text-anchor="middle" font-weight="bold"');
  k += `<path d="M${x0 + 6} ${y0 - 5.5} l-2 0 m0 0 l1 -1 m-1 1 l1 1" stroke="#fff" stroke-width=".4" fill="none"/>`;
  const ax = (x0 + x1) / 2, ay = y1 + 1;
  S.teil({ id: "me_rueckgabe", de: "die Rückgabe", syl: "RÜCK-ga-be", it: "la restituzione", itSyl: "re-sti-tu-ZIO-ne", en: "tray return", x: ax, y: ay, kunst: um(ax, ay, k),
    tipp: "Nach dem Essen stellt man das Tablett auf das Rückgabeband." });
}

/* =====================================================================
   3 — DIE KÜCHENKRAFT (hinter der Ausgabe) mit dem TELLER
   ===================================================================== */
const AUS = { X0: -3.1, X1: 0.95, z0: 0.45, z1: 1.0, H: 0.9 };
{
  const [ax, ay] = P(-1.15, 0, 0.22);
  const m = B.mensch({ id: "b09e_koch", geschlecht: "w", pose: "servieren", blick: 22, frisur: "dutt", haarfarbe: "schwarz", haut: "dunkel", laecheln: true,
    kleidung: { oberteil: { stueck: "kittel", farbe: "weiss" }, jacke: { stueck: "kittel", farbe: "weiss" }, schuerze: { stueck: "schuerze", farbe: GRUEN_D }, unterteil: { stueck: "hose", farbe: "#2f3035" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" }, kopf: { stueck: "kappe", farbe: GRUEN } } }, 1.66 * sk(0.22));
  S.teil({ id: "me_kuechenkraft", de: "die Küchenkraft", syl: "KÜ-chen-kraft", it: "l'addetta alla mensa", itSyl: "ad-DET-ta alla MEN-sa", en: "canteen worker", x: ax, y: ay, kunst: m.svg,
    tipp: "Die Küchenkraft fragt: „Mit Soße?“" });
  /* der Teller in ihrer erhobenen Hand, über dem Hustenschutz */
  const hand = [m.z.handL, m.z.handR].filter(Boolean).sort((a, b) => a.y - b.y)[0];
  const hx = ax + hand.x * m.k, hy = ay + hand.y * m.k;
  const s = sk(0.6) / S0;
  let t = `<ellipse cx="0" cy="0" rx="${r(5.4 * s)}" ry="${r(1.6 * s)}" fill="#f7f7f4" stroke="#cfcfc8" stroke-width=".25"/><ellipse cx="0" cy="${r(-0.2 * s)}" rx="${r(3.6 * s)}" ry="${r(1 * s)}" fill="#ecebe6"/>`;
  t += `<ellipse cx="${r(-0.6 * s)}" cy="${r(-0.6 * s)}" rx="${r(2.8 * s)}" ry="${r(1 * s)}" fill="#f0d58a"/>`;
  for (let i = 0; i < 7; i++) t += `<path d="M${r((-2.6 + i * 0.7) * s)} ${r(-0.5 * s)} q${r(0.5 * s)} ${r(-0.8 * s)} ${r(1 * s)} 0" stroke="#e2c26a" stroke-width=".3" fill="none"/>`;
  t += `<ellipse cx="${r(0.2 * s)}" cy="${r(-1 * s)}" rx="${r(1.8 * s)}" ry="${r(0.7 * s)}" fill="#a8341f"/><circle cx="${r(0.6 * s)}" cy="${r(-1.3 * s)}" r=".35" fill="#f4e9c8"/>`;
  S.teil({ oben: true, id: "me_teller_me", de: "der Teller", syl: "TEL-ler", it: "il piatto", itSyl: "PIAT-to", en: "plate", x: r(hx + 1), y: r(hy - 0.6), kunst: t + flaeche(-6 * s, -3 * s, 12 * s, 4.6 * s),
    tipp: "Der Teller kommt warm aus dem Tellerwärmer." });
}

/* =====================================================================
   4 — DIE ESSENSAUSGABE (Theke, Hustenschutz, Tablettrutsche) mit Lupe
   ===================================================================== */
{
  const { X0, X1, z0, z1, H } = AUS;
  const [ax, ay] = P((X0 + X1) / 2, 0, z1 + 0.18);
  let k = schatten(ax, ay, 70, 2.2, 0.2);
  /* Korpus: Edelstahl-Front mit grünem Band */
  k += poly([P(X1, 0, z1), P(X1, 0, z0), P(X1, H, z0), P(X1, H, z1)], "#9aa3aa");
  k += poly([P(X0, 0.1, z1), P(X1, 0.1, z1), P(X1, H, z1), P(X0, H, z1)], S.lg("front", [[0, "#dfe4e8"], [1, "#b5bdc3"]]));
  k += poly([P(X0, 0, z1), P(X1, 0, z1), P(X1, 0.1, z1), P(X0, 0.1, z1)], "#3a3f44");
  k += poly([P(X0, 0.32, z1), P(X1, 0.32, z1), P(X1, 0.5, z1), P(X0, 0.5, z1)], GRUEN);
  for (let X = X0 + 0.5; X < X1; X += 1.0) { const [x, y] = P(X, 0.41, z1); k += T(x, y + 1.2, 3, "Mensa", "#fff", 'text-anchor="middle" font-weight="bold" opacity=".85"'); }
  /* Thekenplatte mit Wärmebecken (GN-Behälter) */
  k += poly([P(X0, H, z1), P(X1, H, z1), P(X1, H, z0), P(X0, H, z0)], STAHL_H);
  const U = [];
  const speisen = [
    [-2.65, "Nudeln", (X) => { let g = ""; for (let i = 0; i < 14; i++) { const a = P(X - 0.2 + rnd() * 0.4, H - 0.01, 0.6 + rnd() * 0.2), b = [r(a[0] + 1.6), r(a[1] + rnd() * 0.6 - 0.3)]; g += `<path d="M${a[0]} ${a[1]} Q${r(a[0] + 0.8)} ${r(a[1] - 0.6)} ${b[0]} ${b[1]}" stroke="#ecd07a" stroke-width=".55" fill="none"/>`; } return g; }, "#f0d58a",
      ["nudeln", "die Nudeln", "NU-deln", "la pasta", "PA-sta", "pasta", "Heute gibt es Spaghetti."]],
    [-2.05, "Soße", null, "#a8341f", ["sosse", "die Soße", "SO-ße", "il sugo", "SU-go", "sauce", "Bolognese ist eine Soße mit Hackfleisch und Tomaten."]],
    [-1.45, "Curry", (X) => { let g = ""; for (let i = 0; i < 9; i++) { const [x, y] = P(X - 0.18 + rnd() * 0.36, H - 0.008, 0.62 + rnd() * 0.16); g += `<circle cx="${x}" cy="${y}" r=".5" fill="${["#e07b3a", "#4f9a3a", "#f2c94c"][i % 3]}"/>`; } return g; }, "#e2a33a",
      ["gemuese", "das Gemüse", "ge-MÜ-se", "la verdura", "ver-DU-ra", "vegetables", "Im Gemüsecurry sind Karotten, Erbsen und Paprika."]],
    [-0.85, "Reis", (X) => { let g = ""; for (let i = 0; i < 18; i++) { const [x, y] = P(X - 0.2 + rnd() * 0.4, H - 0.008, 0.6 + rnd() * 0.2); g += `<ellipse cx="${x}" cy="${y}" rx=".35" ry=".18" fill="#fffdf4"/>`; } return g; }, "#f4f0e2",
      ["reis", "der Reis", "REIS", "il riso", "RI-so", "rice", null]],
    [-0.25, "Pommes", (X) => { let g = ""; for (let i = 0; i < 14; i++) { const a = P(X - 0.2 + rnd() * 0.4, H - 0.006, 0.6 + rnd() * 0.2); g += `<rect x="${a[0]}" y="${a[1]}" width="1.8" height=".5" fill="#f2c14e" transform="rotate(${Math.round(rnd() * 60 - 30)} ${a[0]} ${a[1]})"/>`; } return g; }, "#e8b64a",
      ["pommes", "die Pommes", "POM-mes", "le patatine fritte", "pa-ta-TI-ne FRIT-te", "fries", "„Pommes“ ist kurz für Pommes frites."]],
    [0.4, "Salat", (X) => { let g = ""; for (let i = 0; i < 10; i++) { const [x, y] = P(X - 0.2 + rnd() * 0.4, H + 0.01, 0.6 + rnd() * 0.2); g += `<ellipse cx="${x}" cy="${y}" rx="1.2" ry=".6" fill="${i % 4 === 0 ? "#d84a3a" : i % 3 ? "#6fb04a" : "#9ed06a"}"/>`; } return g; }, "#7bbf54",
      ["salat", "der Salat", "sa-LAT", "l'insalata", "in-sa-LA-ta", "salad", null]],
  ];
  for (const [X, name, deko, farbe, wort] of speisen) {
    const a = X - 0.26, b = X + 0.26;
    k += poly([P(a, H + 0.005, 0.86), P(b, H + 0.005, 0.86), P(b, H + 0.005, 0.54), P(a, H + 0.005, 0.54)], "#7d868d");
    k += poly([P(a + 0.03, H, 0.84), P(b - 0.03, H, 0.84), P(b - 0.03, H, 0.56), P(a + 0.03, H, 0.56)], farbe);
    if (deko) k += deko(X);
    if (name === "Soße") k += poly([P(a + 0.05, H + 0.002, 0.8), P(b - 0.05, H + 0.002, 0.8), P(b - 0.05, H + 0.002, 0.6), P(a + 0.05, H + 0.002, 0.6)], "#c24a2a", 'opacity=".7"');
    /* Kelle / Schöpflöffel */
    const k0 = P(X + 0.1, H + 0.02, 0.72), k1 = P(X + 0.22, H + 0.28, 0.5);
    k += L(k0, k1, 0.45, "#9aa3aa");
    const [px, py] = P(X, H, 0.88);
    k += `<rect x="${r(px - 3.4)}" y="${r(py + 0.2)}" width="6.8" height="2.2" rx=".3" fill="#fff"/>` + T(px, py + 1.9, 1.5, name, "#333", 'text-anchor="middle"');
    const [id, de, syl, it, itSyl, en, tipp] = wort;
    const o = { id, de, syl, it, itSyl, en, x: px, y: r(py + 2.6), kunst: flaeche(-9, -8, 18, 9.6) };
    if (tipp) o.tipp = tipp;
    U.push(o);
  }
  /* Hustenschutz: Glasscheibe auf Edelstahlstützen, oben Wärmebrücke mit Licht */
  for (let X = X0 + 0.05; X <= X1; X += 1.0) k += L(P(X, H, z1 - 0.05), P(X, 1.42, z1 - 0.2), 0.8, "#9aa3aa");
  k += poly([P(X0, 1.42, z1 - 0.25), P(X1, 1.42, z1 - 0.25), P(X1, 1.47, z1 - 0.25), P(X0, 1.47, z1 - 0.25)], STAHL_H);
  k += poly([P(X0, 1.47, z1 - 0.25), P(X1, 1.47, z1 - 0.25), P(X1, 1.47, z0), P(X0, 1.47, z0)], "#d6dbdf");
  /* Tablettrutsche: drei Edelstahlrohre vor der Theke */
  for (const [hh, zz] of [[0.84, z1 + 0.08], [0.86, z1 + 0.18], [0.88, z1 + 0.28]]) k += L(P(X0 - 0.1, hh, zz), P(X1 + 0.05, hh, zz), 0.9, "#c9cfd4");
  for (let X = X0; X <= X1; X += 1.0) k += L(P(X, 0.84, z1 + 0.06), P(X, 0.84, z1 + 0.3), 0.7, "#aeb6bd") + L(P(X, 0.84, z1 + 0.2), P(X, 0.84, z1), 0.7, "#aeb6bd");
  S.teil({ id: "me_ausgabe", de: "die Essensausgabe", syl: "ES-sens-aus-ga-be", it: "la distribuzione dei pasti", itSyl: "di-stri-bu-ZIO-ne dei PA-sti", en: "servery", x: ax, y: ay, steht: true, kunst: um(ax, ay, k),
    zoom: { x: r(P(-3.0, H, 1)[0] - 2), y: r(P(-3.0, H, 1)[1] - 34), w: 156, h: 104 },
    unter: U,
    tipp: "An der Essensausgabe schiebt man das Tablett auf den Stangen entlang." });
  /* Glas des Hustenschutzes (vor allem, fängt keinen Tipp) */
  S.davor(poly([P(X0, 0.98, z1 - 0.02), P(X1, 0.98, z1 - 0.02), P(X1, 1.42, z1 - 0.24), P(X0, 1.42, z1 - 0.24)], "#e8f4f7", 'opacity=".22"') +
    poly([P(X0 + 0.4, 0.99, z1 - 0.03), P(X0 + 0.6, 0.99, z1 - 0.03), P(X0 + 0.8, 1.41, z1 - 0.23), P(X0 + 0.6, 1.41, z1 - 0.23)], "#fff", 'opacity=".25"'));
}

/* =====================================================================
   5 — DAS TABLETT (Stapel) und DAS BESTECK (Besteckkasten) am Anfang
   ===================================================================== */
const START = { X: -3.15, z: 1.42 };
{
  const { X, z } = START;
  const [ax, ay] = P(X, 0, z);
  let k = schatten(ax, ay, 12, 1.2, 0.25);
  /* Tablettwagen aus Edelstahl */
  k += kiste(X - 0.28, X + 0.28, 0.05, 0.82, z - 0.4, z, { vorn: S.lg("wagen", [[0, "#cfd5da"], [1, "#a9b1b8"]]), seite: "#9aa3aa", deckel: STAHL_H });
  for (const dx of [-0.24, 0.24]) { const [x, y] = P(X + dx, 0.02, z); k += `<circle cx="${x}" cy="${y}" r="1.3" fill="#2a2a2a"/>`; }
  k += T(P(X, 0.5, z)[0], P(X, 0.5, z)[1], 2.6, "Tabletts", "#555", 'text-anchor="middle"');
  /* Stapel brauner Tabletts */
  for (let i = 0; i < 9; i++) { const h = 0.82 + i * 0.025; k += kiste(X - 0.23, X + 0.23, h, h + 0.02, z - 0.36, z - 0.04, { vorn: i % 2 ? "#7a4a2a" : "#8a5a3a", deckel: "#9a6a44" }); }
  S.teil({ id: "me_tablett", de: "das Tablett", syl: "Ta-BLETT", it: "il vassoio", itSyl: "vas-SO-io", en: "tray", x: ax, y: ay, steht: true, kunst: um(ax, ay, k),
    tipp: "Zuerst nimmt man ein Tablett." });
}
{
  /* Besteckkasten oben auf dem Tablettstapel: Messer, Gabel, Löffel */
  const { X, z } = START, h = 1.05;
  const [ax, ay] = P(X, h, z - 0.15);
  const s = sk(z - 0.15) / S0;
  let k = `<path d="M${r(-8 * s)} 0 L${r(8 * s)} 0 L${r(7.4 * s)} ${r(-3.4 * s)} L${r(-7.4 * s)} ${r(-3.4 * s)} Z" fill="${STAHL}"/>`;
  for (let i = 0; i < 3; i++) {
    const cx = (-5 + i * 5) * s;
    k += `<rect x="${r(cx - 2.2 * s)}" y="${r(-3.2 * s)}" width="${r(4.4 * s)}" height="${r(1.2 * s)}" fill="#6b737a"/>`;
    for (let j = 0; j < 5; j++) {
      const x = cx + (-1.6 + j * 0.8) * s, top = (-7 - (j % 2) * 0.6) * s;
      if (i === 0) k += `<line x1="${r(x)}" y1="${r(-3 * s)}" x2="${r(x + 0.2 * s)}" y2="${r(top)}" stroke="#dfe4e8" stroke-width="${r(0.45 * s)}"/>`;
      if (i === 1) k += `<line x1="${r(x)}" y1="${r(-3 * s)}" x2="${r(x)}" y2="${r(top + 1.2 * s)}" stroke="#dfe4e8" stroke-width="${r(0.35 * s)}"/><path d="M${r(x - 0.5 * s)} ${r(top + 1.2 * s)} v${r(-1.2 * s)} M${r(x)} ${r(top + 1.2 * s)} v${r(-1.2 * s)} M${r(x + 0.5 * s)} ${r(top + 1.2 * s)} v${r(-1.2 * s)}" stroke="#dfe4e8" stroke-width="${r(0.18 * s)}"/>`;
      if (i === 2) k += `<line x1="${r(x)}" y1="${r(-3 * s)}" x2="${r(x)}" y2="${r(top + 1 * s)}" stroke="#dfe4e8" stroke-width="${r(0.35 * s)}"/><ellipse cx="${r(x)}" cy="${r(top + 0.6 * s)}" rx="${r(0.5 * s)}" ry="${r(0.8 * s)}" fill="#dfe4e8"/>`;
    }
  }
  k += `<path d="M${r(-8 * s)} 0 L${r(8 * s)} 0 L${r(7.4 * s)} ${r(-1.4 * s)} L${r(-7.4 * s)} ${r(-1.4 * s)} Z" fill="${GRUEN}"/>`;
  S.teil({ oben: true, id: "me_besteck_me", de: "das Besteck", syl: "Be-STECK", it: "le posate", itSyl: "po-SA-te", en: "cutlery", x: ax, y: ay, steht: true, kunst: k,
    tipp: "Messer, Gabel und Löffel – das ist das Besteck." });
}

/* =====================================================================
   6 — DIE SCHLANGE (wartende Studierende, Absperrband)
   ===================================================================== */
{
  const [ax, ay] = P(-2.25, 0, 1.72);
  const m = B.mensch({ id: "b09e_schlange", geschlecht: "m", pose: "stehen", blick: 150, frisur: "kurz", haarfarbe: "blond", haut: "hell",
    kleidung: { oberteil: { stueck: "hemd", farbe: "#6d8fb3" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" }, zubehoer: { stueck: "rucksack", farbe: "#b8473a" } } }, 1.8 * sk(1.72));
  /* Absperrpfosten mit Gurt vor ihm (leitet die Schlange) */
  let p = "";
  const pf = [P(-2.85, 0, 2.0), P(-1.65, 0, 2.0)], s = sk(2.0) / S0;
  for (const [x, y] of pf) p += `<ellipse cx="${r(x - ax)}" cy="${r(y - ay)}" rx="${r(3 * s)}" ry="${r(0.8 * s)}" fill="#2a2e33"/><rect x="${r(x - ax - 0.6 * s)}" y="${r(y - ay - 36 * s)}" width="${r(1.2 * s)}" height="${r(36 * s)}" fill="${STAHL}"/><ellipse cx="${r(x - ax)}" cy="${r(y - ay - 36 * s)}" rx="${r(1 * s)}" ry="${r(0.5 * s)}" fill="#dfe4e8"/>`;
  p += `<path d="M${r(pf[0][0] - ax)} ${r(pf[0][1] - ay - 33 * s)} Q${r((pf[0][0] + pf[1][0]) / 2 - ax)} ${r(pf[0][1] - ay - 31.5 * s)} ${r(pf[1][0] - ax)} ${r(pf[1][1] - ay - 33 * s)}" stroke="${GRUEN_D}" stroke-width="${r(1.4 * s)}" fill="none"/>`;
  S.teil({ id: "me_schlange", de: "die Schlange", syl: "SCHLAN-ge", it: "la fila", itSyl: "FI-la", en: "queue", x: ax, y: ay, kunst: m.svg + p,
    tipp: "Mittags ist die Schlange lang. Man stellt sich hinten an." });
}

/* =====================================================================
   7 — DIE KASSE mit Lupe (Chipkarte am Kartenleser, Kassenbon)
   ===================================================================== */
{
  const X0 = 1.35, X1 = 2.05, z0 = 0.95, z1 = 1.38, H = 0.9;
  const [ax, ay] = P((X0 + X1) / 2, 0, z1);
  let k = schatten(ax, ay, 14, 1.4, 0.25);
  k += kiste(X0, X1, 0, H, z0, z1, { vorn: S.lg("kasse", [[0, "#e4e8eb"], [1, "#bfc6cc"]]), seite: "#a9b1b8", deckel: STAHL_H });
  k += poly([P(X0, 0.32, z1), P(X1, 0.32, z1), P(X1, 0.46, z1), P(X0, 0.46, z1)], GRUEN);
  const [kx, ky] = P((X0 + X1) / 2, 0.7, z1);
  k += T(kx, ky, 3.2, "KASSE", "#3a3f44", 'text-anchor="middle" font-weight="bold"');
  /* Bildschirm zur Kundin, Kartenleser, Bon */
  const [mx, my] = P(X0 + 0.2, H, z0 + 0.2), s = sk(z0 + 0.2) / S0;
  k += `<rect x="${r(mx - 0.4)}" y="${r(my - 6 * s)}" width=".8" height="${r(6 * s)}" fill="#3a3f45"/><path d="M${r(mx - 6 * s)} ${r(my - 16 * s)} L${r(mx + 6 * s)} ${r(my - 16.6 * s)} L${r(mx + 6.4 * s)} ${r(my - 6 * s)} L${r(mx - 6.2 * s)} ${r(my - 5.6 * s)} Z" fill="#1c1f23"/>`;
  k += `<path d="M${r(mx - 5.2 * s)} ${r(my - 15.2 * s)} L${r(mx + 5.2 * s)} ${r(my - 15.7 * s)} L${r(mx + 5.5 * s)} ${r(my - 6.8 * s)} L${r(mx - 5.4 * s)} ${r(my - 6.5 * s)} Z" fill="${S.lg("kbild", [[0, "#e9f5e1"], [1, "#cfe8bf"]])}"/>`;
  k += T(mx, my - 12.6 * s, 1.5 * s, "Studierende", "#2b4a1a", 'text-anchor="middle"') + T(mx, my - 8.6 * s, 2.6 * s, "2,35 €", "#2b4a1a", 'text-anchor="middle" font-weight="bold"');
  const U = [];
  {
    const [cx, cy] = P(X1 - 0.18, H, z0 + 0.22);
    k += `<path d="M${r(cx - 3.2 * s)} ${cy} L${r(cx + 3.2 * s)} ${cy} L${r(cx + 3 * s)} ${r(cy - 5 * s)} L${r(cx - 3 * s)} ${r(cy - 5 * s)} Z" fill="#2a2e33"/>`;
    k += `<rect x="${r(cx - 2.4 * s)}" y="${r(cy - 4.6 * s)}" width="${r(4.8 * s)}" height="${r(1.8 * s)}" rx=".3" fill="#9cd3e8"/>`;
    /* die Mensakarte liegt auf dem Leser */
    k += `<rect x="${r(cx - 2.6 * s)}" y="${r(cy - 7.4 * s)}" width="${r(5.2 * s)}" height="${r(3.2 * s)}" rx=".5" fill="${S.lg("mkarte", [[0, "#7bc043"], [1, "#3f7a1d"]])}" transform="rotate(-8 ${cx} ${r(cy - 6 * s)})"/>`;
    k += `<rect x="${r(cx - 2 * s)}" y="${r(cy - 6.8 * s)}" width="${r(1.2 * s)}" height="${r(1 * s)}" fill="#e0c068" transform="rotate(-8 ${cx} ${r(cy - 6 * s)})"/>`;
    k += `<path d="M${r(cx + 3.6 * s)} ${r(cy - 8 * s)} q1 -1 0 -2 M${r(cx + 4.6 * s)} ${r(cy - 7.6 * s)} q1.8 -1.6 0 -3.2" stroke="#4aa8d8" stroke-width=".3" fill="none"/>`;
    U.push({ id: "me_chipkarte", de: "die Chipkarte", syl: "CHIP-kar-te", it: "la tessera", itSyl: "TES-se-ra", en: "cashless card", x: cx, y: r(cy + 0.4), kunst: flaeche(-4.4 * s, -9.4 * s, 9.6 * s, 9.8 * s),
      tipp: "Mit der Chipkarte zahlt man in der Mensa – Bargeld geht oft nicht." });
  }
  {
    const [bx, by] = P(X0 + 0.48, H, z1 - 0.06);
    k += `<path d="M${r(bx - 2 * s)} ${by} L${r(bx + 2 * s)} ${by} L${r(bx + 2.2 * s)} ${r(by - 0.6 * s)} L${r(bx - 1.6 * s)} ${r(by - 0.8 * s)} Z" fill="#fbfbf8"/><path d="M${r(bx - 2.4 * s)} ${r(by - 0.8 * s)} Q${r(bx - 1.4 * s)} ${r(by - 3 * s)} ${r(bx)} ${r(by - 3.2 * s)} L${r(bx + 1.6 * s)} ${r(by - 0.7 * s)} Z" fill="#f4f4f0" stroke="#d6d6d0" stroke-width=".15"/>`;
    U.push({ id: "kassenbon", de: "der Kassenbon", syl: "KAS-sen-bon", it: "lo scontrino", itSyl: "scon-TRI-no", en: "receipt", x: bx, y: r(by + 0.4), kunst: flaeche(-3 * s, -3.8 * s, 6 * s, 4.2 * s) });
  }
  const [zx, zy] = P(X0, H, z1);
  S.teil({ id: "kasse", de: "die Kasse", syl: "KAS-se", it: "la cassa", itSyl: "CAS-sa", en: "checkout", x: ax, y: ay, steht: true, kunst: um(ax, ay, k),
    zoom: { x: r(zx - 6), y: r(zy - 28), w: 48, h: 32 },
    unter: U.map((u) => Object.assign(u, { x: r(u.x), y: r(u.y) })),
    tipp: "An der Kasse zahlt man mit der Mensakarte." });
}

/* =====================================================================
   8 — DIE STUDENTIN mit vollem Tablett an der Kasse
   ===================================================================== */
{
  const [ax, ay] = P(0.92, 0, 1.82);
  const m = B.mensch({ id: "b09e_studentin", geschlecht: "w", pose: "halten", blick: 64, frisur: "lang", haarfarbe: "hellbraun", haut: "oliv", laecheln: true,
    kleidung: { oberteil: { stueck: "pullover", farbe: "#d98aa6" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" }, zubehoer: { stueck: "tasche", farbe: "#3a3a3a" } } }, 1.66 * sk(1.82));
  const hL = m.z.handL, hR = m.z.handR;
  const hx = ((hL.x + hR.x) / 2) * m.k, hy = (Math.min(hL.y, hR.y)) * m.k;
  const s = sk(1.82) / S0;
  /* Tablett mit Teller, Glas und Besteck */
  let t = `<g transform="translate(${r(hx)} ${r(hy + 0.6)})">`;
  t += `<path d="M${r(-11 * s)} 0 L${r(11 * s)} 0 L${r(9.6 * s)} ${r(-3.4 * s)} L${r(-9.6 * s)} ${r(-3.4 * s)} Z" fill="#8a5a3a"/><path d="M${r(-11 * s)} 0 L${r(11 * s)} 0 L${r(11 * s)} ${r(0.8 * s)} L${r(-11 * s)} ${r(0.8 * s)} Z" fill="#6b4226"/>`;
  t += `<ellipse cx="${r(-3 * s)}" cy="${r(-1.8 * s)}" rx="${r(5 * s)}" ry="${r(1.4 * s)}" fill="#f7f7f4"/><ellipse cx="${r(-3.4 * s)}" cy="${r(-2.1 * s)}" rx="${r(3 * s)}" ry="${r(0.9 * s)}" fill="#e2a33a"/><ellipse cx="${r(-2.4 * s)}" cy="${r(-2.4 * s)}" rx="${r(1.6 * s)}" ry="${r(0.5 * s)}" fill="#f4f0e2"/>`;
  t += `<path d="M${r(5 * s)} ${r(-1.4 * s)} L${r(4.6 * s)} ${r(-6 * s)} L${r(7.4 * s)} ${r(-6 * s)} L${r(7 * s)} ${r(-1.4 * s)} Z" fill="#dfeef2" opacity=".9"/><rect x="${r(4.8 * s)}" y="${r(-4.4 * s)}" width="${r(2.4 * s)}" height="${r(2.8 * s)}" fill="#f2b632" opacity=".8"/>`;
  t += `<line x1="${r(1.8 * s)}" y1="${r(-0.8 * s)}" x2="${r(3.4 * s)}" y2="${r(-3 * s)}" stroke="#c9cfd4" stroke-width="${r(0.4 * s)}"/><line x1="${r(2.6 * s)}" y1="${r(-0.8 * s)}" x2="${r(4.2 * s)}" y2="${r(-3 * s)}" stroke="#c9cfd4" stroke-width="${r(0.4 * s)}"/>`;
  t += `</g>`;
  S.teil({ id: "me_studentin", de: "die Studentin", syl: "Stu-DEN-tin", it: "la studentessa", itSyl: "stu-den-TES-sa", en: "student", x: ax, y: ay, kunst: m.svg + t,
    tipp: "Sie hat Gemüsecurry mit Reis und eine Apfelschorle." });
}

/* =====================================================================
   9 — DER ESSTISCH (vorn links) mit Lupe und DER STUHL davor
   ===================================================================== */
{
  const X0 = -3.6, X1 = -0.75, z0 = 2.55, z1 = 3.2, H = 0.75;
  const [ax, ay] = P((X0 + X1) / 2 + 0.6, 0, z1);
  let k = "";
  /* Stühle auf der anderen Seite (Lehnen sichtbar) */
  for (const X of [-3.1, -2.35, -1.6]) {
    k += poly([P(X - 0.2, 0.46, z0 - 0.42), P(X + 0.2, 0.46, z0 - 0.42), P(X + 0.2, 0.92, z0 - 0.44), P(X - 0.2, 0.92, z0 - 0.44)], S.lg("lehneF", [[0, "#3f7a1d"], [1, "#2f5f15"]]));
    k += poly([P(X - 0.2, 0.92, z0 - 0.44), P(X + 0.2, 0.92, z0 - 0.44), P(X + 0.2, 0.94, z0 - 0.42), P(X - 0.2, 0.94, z0 - 0.42)], "#6aa83a");
  }
  /* Tischbeine (Säulenfüße) und Platte */
  for (const X of [X0 + 0.4, X1 - 0.4]) k += L(P(X, 0, (z0 + z1) / 2), P(X, H - 0.03, (z0 + z1) / 2), 2.4, "#3a3f44") + poly([P(X - 0.3, 0.01, z0 + 0.15), P(X + 0.3, 0.01, z0 + 0.15), P(X + 0.3, 0.01, z1 - 0.15), P(X - 0.3, 0.01, z1 - 0.15)], "#2a2e33");
  k += kiste(X0, X1, H - 0.035, H, z0, z1, { vorn: "#b38a55", deckel: HOLZ, seite: "#a07a48" });
  k += L(P(X0, H, z1), P(X1, H, z1), 0.4, "#fff", ' opacity=".45"');
  const U = [];
  /* Tablett mit leerem Teller (jemand ist schon fertig) */
  k += poly(blatt(-2.9, 2.85, 0.46, 0.34, 0.08, H + 0.01), "#8a5a3a") + poly(ellipseB(-2.95, 2.85, 0.13, 0.11, H + 0.02), "#f7f7f4") + poly(ellipseB(-2.95, 2.85, 0.07, 0.06, H + 0.022), "#efe2c8");
  /* Serviettenspender, Salz, Pfeffer */
  const [sx, sy] = P(-2.05, H, 2.82), s = sk(2.82) / S0;
  k += `<path d="M${r(sx - 3 * s)} ${sy} L${r(sx + 3 * s)} ${sy} L${r(sx + 2.8 * s)} ${r(sy - 4 * s)} L${r(sx - 2.8 * s)} ${r(sy - 4 * s)} Z" fill="${STAHL}"/><path d="M${r(sx - 2.4 * s)} ${r(sy - 4 * s)} L${r(sx + 2.4 * s)} ${r(sy - 4 * s)} L${r(sx + 1.8 * s)} ${r(sy - 6 * s)} L${r(sx - 1.8 * s)} ${r(sy - 6 * s)} Z" fill="#fff"/>`;
  U.push({ id: "serviette", de: "die Serviette", syl: "Ser-VI-et-te", it: "il tovagliolo", itSyl: "to-va-GLIO-lo", en: "napkin", x: sx, y: r(sy + 0.5), kunst: flaeche(-3.6 * s, -6.6 * s, 7.2 * s, 7.2 * s) });
  for (const [dx, f, id, de, syl, it, itSyl, en, tipp] of [[1.55, "#ffffff", "salz", "das Salz", "SALZ", "il sale", "SA-le", "salt", "Bitte das Salz! – Bitte schön."], [2.75, "#3a3a3a", "pfeffer", "der Pfeffer", "PFEF-fer", "il pepe", "PE-pe", "pepper", null]]) {
    const x = sx + dx * 2.2 * s, y = sy;
    k += `<path d="M${r(x - 0.9 * s)} ${y} L${r(x + 0.9 * s)} ${y} L${r(x + 0.8 * s)} ${r(y - 3.4 * s)} L${r(x - 0.8 * s)} ${r(y - 3.4 * s)} Z" fill="#e8f2f5" opacity=".9"/><rect x="${r(x - 0.75 * s)}" y="${r(y - 2.4 * s)}" width="${r(1.5 * s)}" height="${r(2.2 * s)}" fill="${f}"/><ellipse cx="${x}" cy="${r(y - 3.6 * s)}" rx="${r(0.85 * s)}" ry="${r(0.45 * s)}" fill="#b5bcc2"/>`;
    const o = { id, de, syl, it, itSyl, en, x, y: r(y + 0.5), kunst: flaeche(-1.6 * s, -4.4 * s, 3.2 * s, 5 * s) };
    if (tipp) o.tipp = tipp;
    U.push(o);
  }
  const [zx, zy] = P(-3.35, H, 2.9);
  S.teil({ id: "me_esstisch", de: "der Esstisch", syl: "ESS-tisch", it: "il tavolo", itSyl: "TA-vo-lo", en: "dining table", x: ax, y: ay, steht: true, kunst: um(ax, ay, k),
    zoom: { x: Math.max(0, r(zx - 6)), y: r(zy - 26), w: 78, h: 52 },
    unter: U.map((u) => Object.assign(u, { x: r(u.x), y: r(u.y) })),
    tipp: "An den langen Tischen sitzen alle zusammen." });
}
{
  /* DER STUHL vor dem Tisch (von hinten gesehen) */
  const X = -1.55, z = 3.55;
  const [ax, ay] = P(X, 0, z);
  let k = schatten(ax, ay, 12, 1.2, 0.22);
  for (const [dx, dz] of [[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.18], [0.2, 0.18]]) k += L(P(X + dx, 0, z + dz), P(X + dx, 0.44, z + dz), 1.4, "#3a3f44");
  k += kiste(X - 0.22, X + 0.22, 0.42, 0.46, z - 0.22, z + 0.2, { vorn: "#2f5f15", deckel: S.lg("sitzM", [[0, "#5f9e2f"], [1, "#4a8a22"]]), seite: "#2f5f15" });
  for (const dx of [-0.18, 0.18]) k += L(P(X + dx, 0.46, z + 0.2), P(X + dx, 0.62, z + 0.22), 1.1, "#3a3f44");
  k += poly([P(X - 0.22, 0.6, z + 0.22), P(X + 0.22, 0.6, z + 0.22), P(X + 0.21, 0.9, z + 0.24), P(X - 0.21, 0.9, z + 0.24)], S.lg("lehneM", [[0, "#5f9e2f"], [1, "#3f7a1d"]]));
  k += poly([P(X - 0.21, 0.88, z + 0.24), P(X + 0.21, 0.88, z + 0.24), P(X + 0.21, 0.9, z + 0.24), P(X - 0.21, 0.9, z + 0.24)], "#8cc45a");
  S.teil({ id: "me_stuhl_me", de: "der Stuhl", syl: "STUHL", it: "la sedia", itSyl: "SE-dia", en: "chair", x: ax, y: ay, steht: true, kunst: um(ax, ay, k) });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/mensa.js"));
console.log(aus);
