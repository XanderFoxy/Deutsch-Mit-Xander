#!/usr/bin/env node
/* =====================================================================
   DIE SPRACHSCHULE (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (Webauftritte privater Sprachschulen und telc-Prüfungs-
   zentren, z. B. VOX Sprachschule, Sprachenzentrum FAU „Einstufung“):
   - Man kommt in einen EMPFANG (Rezeption) mit Theke. Dort macht man
     vor dem ersten Kurs den EINSTUFUNGSTEST (Niveau A1–C1 nach dem
     Europäischen Referenzrahmen); oft macht ihn eine Lehrkraft.
   - An der Wand: der KURSPLAN mit Kursen, Zeiten und Räumen, das
     ZERTIFIKAT als lizenziertes telc-Prüfungszentrum, eine Reihe kleiner
     FLAGGEN der unterrichteten Sprachen, eine WELTKARTE „Woher kommen
     unsere Teilnehmer?“ mit Stecknadeln. Ein PROSPEKTSTÄNDER.
   - Die Kursräume liegen hinter GLASWÄNDEN (mit Sichtschutz-Streifen):
     Man sieht das WHITEBOARD, den BEAMER an der Decke, Tische und
     Stühle; die Lehrerin erklärt, ein Teilnehmer sitzt schon da.
   BLICK: Fluchtpunkt in der Mitte, Augenhöhe 1,6 m. Links der Empfang
   vor der Rückwand, rechts – hinter einer Glaswand, die in die Tiefe
   läuft – der Kursraum.
   Maßstab: Rückwand 38 Einheiten je Meter, Theke (1,1 m) ≈ 46 je Meter,
   Menschen 1,66–1,78 m.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "sprachschule", titel: "Die Sprachschule", emoji: "🗣️", thema: "Bildung", kuerzel: "b09b", fassung: 852 });
const rnd = zufall(4711);
const r = B.r;

/* ---------- Kamera ---------------------------------------------------- */
const HY = 70, E = 1.6, D = 6, S0 = 38, VX = 160;
const sk = (z) => S0 * D / (D - z);
const P = (X, H, z) => [r(VX + X * sk(z)), r(HY + (E - H) * sk(z))];
const poly = (pts, fill, extra = "") => `<path d="M${pts.map((p) => p[0] + " " + p[1]).join(" L")} Z" fill="${fill}"${extra ? " " + extra : ""}/>`;
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
const T = (x, y, s, txt, f = "#fff", extra = "") => `<text x="${r(x)}" y="${r(y)}" font-size="${s}" fill="${f}" font-family="Arial,Helvetica,sans-serif"${extra ? " " + extra : ""}>${txt}</text>`;
/* flach liegendes Blatt: Mitte (X, z) auf Höhe h, Breite w, Tiefe t, Drehung */
function blatt(X, z, w, t, dreh, h) {
  const c = Math.cos(dreh), s = Math.sin(dreh);
  return [[-w / 2, -t / 2], [w / 2, -t / 2], [w / 2, t / 2], [-w / 2, t / 2]].map(([a, b]) => P(X + a * c - b * s, h, z + a * s + b * c));
}

/* ---------- Farben ---------------------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const ROT = "#d2452f", PETROL = "#1e6f7a";
const WAND = S.lg("wand", [[0, "#f6f3ec"], [1, "#e9e3d6"]]);
const KWAND = S.lg("kwand", [[0, "#eef3f1"], [1, "#dde7e3"]]);
const STAHL = S.lg("stahl", [[0, "#eef1f3"], [0.45, "#c9cfd4"], [0.55, "#b5bcc2"], [1, "#e1e5e8"]], 0, 0, 1, 0);
const BUCHE = S.lg("buche", [[0, "#e6cfa6"], [1, "#d2b483"]]);

/* =====================================================================
   KULISSE — Empfang (links) und Kursraum hinter der Glaswand (rechts)
   ===================================================================== */
const GX = 0.8;                       // Glaswand: Ebene X = 0,8 m
const HD = 3.0;
{
  const WO = WY(HD), WU = WY(0), XG = WX(GX);
  let k = `<rect x="0" y="0" width="320" height="${WO}" fill="${S.lg("decke", [[0, "#e8e6e0"], [1, "#f5f4f0"]])}"/>`;
  /* Deckenraster und Einbauleuchten (Empfang) */
  for (const z of [0.8, 1.9]) {
    for (const X of [-2.6, -0.9]) {
      const a = P(X - 0.3, HD, z - 0.3), b = P(X + 0.3, HD, z - 0.3), c = P(X + 0.3, HD, z + 0.3), d = P(X - 0.3, HD, z + 0.3);
      k += poly([a, b, c, d], "#fffdf4", 'stroke="#dcd9d0" stroke-width=".4"');
    }
  }
  /* Rückwand Empfang */
  k += `<rect x="0" y="${WO}" width="${XG}" height="${r(WU - WO)}" fill="${WAND}"/>`;
  k += `<rect x="0" y="${WO}" width="${XG}" height="${r(WU - WO)}" fill="${S.rg("wl", [[0, "#fffaf0", 0.55], [1, "#fffaf0", 0]], 0.45, 0.2, 0.7)}"/>`;
  k += `<rect x="0" y="${WY(1.0)}" width="${XG}" height="${r(WU - WY(1.0))}" fill="${ROT}" opacity=".08"/>`;
  /* Rückwand Kursraum (zarte Mintfarbe) */
  k += `<rect x="${XG}" y="${WO}" width="${r(320 - XG)}" height="${r(WU - WO)}" fill="${KWAND}"/>`;
  /* Böden: Empfang Vinyl in Eichenoptik, Kursraum Linoleum blaugrau */
  const zv = 3.4;
  k += poly([P(-6, 0, 0), P(GX, 0, 0), P(GX, 0, zv), P(-6, 0, zv)], S.lg("vinyl", [[0, "#c79f73"], [1, "#b48a5e"]]));
  for (let X = -4.4; X < GX; X += 0.2) { const a = P(X, 0, 0), b = P(X, 0, zv); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#9b7550" stroke-width=".3" opacity=".7"/>`; }
  for (let i = 0; i < 26; i++) { const X = -4.4 + Math.floor(rnd() * 26) * 0.2, z = rnd() * 3.2, a = P(X, 0, z), b = P(X + 0.2, 0, z); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#9b7550" stroke-width=".3" opacity=".7"/>`; }
  k += poly([P(GX, 0, 0), P(6, 0, 0), P(6, 0, zv), P(GX, 0, zv)], S.lg("lino", [[0, "#8fa0a8"], [1, "#7c8e97"]]));
  for (let i = 0; i < 120; i++) { const X = GX + rnd() * 3.4, z = rnd() * 3.2, [x, y] = P(X, 0, z); if (x < 320) k += `<circle cx="${x}" cy="${y}" r="${r(0.25 + rnd() * 0.3)}" fill="${rnd() < 0.5 ? "#a9b7be" : "#6c7c85"}" opacity=".5"/>`; }
  /* Sockelleisten */
  k += `<rect x="0" y="${r(WU - 2.4)}" width="320" height="2.4" fill="#7d7266"/>`;
  k += `<rect x="0" y="${WU}" width="320" height="${r(200 - WU)}" fill="${S.lg("bl", [[0, "#000", 0.12], [0.5, "#000", 0], [1, "#fff", 0.06]])}"/>`;
  S.hinten(k);
}

/* =====================================================================
   1 — DIE FLAGGEN der Sprachen (Leiste oben an der Rückwand)
   ===================================================================== */
{
  const y0 = WY(2.86), h = 9, w = 13, gap = 4.6, x0 = WX(-3.95);
  let k = `<rect x="${x0 - 2}" y="${y0 - 1.6}" width="${r(6 * (w + gap) + 1)}" height="1" rx=".5" fill="#8f979e"/>`;
  const fl = (x, art) => {
    let g = `<g transform="translate(${r(x)} ${y0})">`;
    if (art === "de") g += `<rect width="${w}" height="3" fill="#111"/><rect y="3" width="${w}" height="3" fill="#d00"/><rect y="6" width="${w}" height="3" fill="#ffce00"/>`;
    if (art === "fr") g += `<rect width="${w / 3}" height="${h}" fill="#0055a4"/><rect x="${r(w / 3)}" width="${r(w / 3)}" height="${h}" fill="#fff"/><rect x="${r(2 * w / 3)}" width="${r(w / 3)}" height="${h}" fill="#ef4135"/>`;
    if (art === "it") g += `<rect width="${w / 3}" height="${h}" fill="#009246"/><rect x="${r(w / 3)}" width="${r(w / 3)}" height="${h}" fill="#fff"/><rect x="${r(2 * w / 3)}" width="${r(w / 3)}" height="${h}" fill="#ce2b37"/>`;
    if (art === "es") g += `<rect width="${w}" height="${h}" fill="#aa151b"/><rect y="2.25" width="${w}" height="4.5" fill="#f1bf00"/><rect x="2.6" y="3.2" width="1.8" height="2.6" rx=".4" fill="#aa151b" opacity=".7"/>`;
    if (art === "pl") g += `<rect width="${w}" height="4.5" fill="#fff"/><rect y="4.5" width="${w}" height="4.5" fill="#dc143c"/>`;
    if (art === "gb") {
      g += `<rect width="${w}" height="${h}" fill="#012169"/><path d="M0 0 L${w} ${h} M${w} 0 L0 ${h}" stroke="#fff" stroke-width="1.8"/><path d="M0 0 L${w} ${h} M${w} 0 L0 ${h}" stroke="#c8102e" stroke-width=".6"/>`;
      g += `<path d="M${w / 2} 0 V${h} M0 ${h / 2} H${w}" stroke="#fff" stroke-width="3"/><path d="M${w / 2} 0 V${h} M0 ${h / 2} H${w}" stroke="#c8102e" stroke-width="1.8"/>`;
    }
    g += `<rect width="${w}" height="${h}" fill="${S.lg("flw", [[0, "#fff", 0.18], [0.5, "#000", 0.08], [1, "#fff", 0.12]], 0, 0, 1, 0)}"/><rect width="${w}" height="${h}" fill="none" stroke="#000" stroke-width=".2" opacity=".3"/>`;
    g += `<line x1="${r(w / 2)}" y1="-1.2" x2="${r(w / 2)}" y2="0" stroke="#8f979e" stroke-width=".4"/></g>`;
    return g;
  };
  ["de", "gb", "fr", "es", "it", "pl"].forEach((a, i) => { k += fl(x0 + i * (w + gap), a); });
  k += T(x0 + 3 * (w + gap) - gap / 2, y0 + h + 3.6, 2.4, "Deutsch · Englisch · Französisch · Spanisch · Italienisch · Polnisch", "#6b5f52", 'text-anchor="middle"');
  const ax = x0 + 3 * (w + gap), ay = y0 + h + 4.4;
  S.teil({ id: "flaggen", de: "die Flaggen", syl: "FLAG-gen", it: "le bandiere", itSyl: "ban-DIE-re", en: "flags", x: ax, y: ay, kunst: um(ax, ay, k),
    tipp: "Die Flaggen zeigen, welche Sprachen man hier lernen kann." });
}

/* =====================================================================
   2 — DIE WELTKARTE mit Stecknadeln (links)
   ===================================================================== */
{
  const x0 = WX(-4.0), x1 = WX(-2.55), y0 = WY(2.38), y1 = WY(1.5), w = x1 - x0, h = y1 - y0;
  const X = (u) => r(x0 + u * w), Y = (v) => r(y0 + v * h);
  let k = `<rect x="${x0 - 1}" y="${y0 - 1}" width="${r(w + 2)}" height="${r(h + 2)}" fill="#5a4636"/>`;
  k += `<rect x="${x0}" y="${y0}" width="${r(w)}" height="${r(h)}" fill="${S.lg("meer", [[0, "#cfe6f0"], [1, "#a9d0e2"]])}"/>`;
  const land = "#e9dcb4";
  /* grobe Kontinente (Mercator-Lage) */
  k += `<path d="M${X(0.05)} ${Y(0.22)} Q${X(0.12)} ${Y(0.12)} ${X(0.24)} ${Y(0.16)} L${X(0.3)} ${Y(0.24)} L${X(0.24)} ${Y(0.42)} L${X(0.2)} ${Y(0.5)} L${X(0.14)} ${Y(0.42)} Q${X(0.06)} ${Y(0.34)} ${X(0.05)} ${Y(0.22)} Z" fill="${land}"/>`;
  k += `<path d="M${X(0.22)} ${Y(0.52)} L${X(0.3)} ${Y(0.56)} L${X(0.32)} ${Y(0.68)} L${X(0.26)} ${Y(0.88)} L${X(0.23)} ${Y(0.72)} L${X(0.2)} ${Y(0.6)} Z" fill="${land}"/>`;
  k += `<path d="M${X(0.45)} ${Y(0.18)} L${X(0.56)} ${Y(0.14)} L${X(0.6)} ${Y(0.24)} L${X(0.52)} ${Y(0.32)} L${X(0.46)} ${Y(0.3)} Z" fill="${land}"/>`;
  k += `<path d="M${X(0.46)} ${Y(0.36)} L${X(0.6)} ${Y(0.36)} L${X(0.64)} ${Y(0.5)} L${X(0.58)} ${Y(0.74)} L${X(0.53)} ${Y(0.74)} L${X(0.5)} ${Y(0.54)} L${X(0.44)} ${Y(0.46)} Z" fill="${land}"/>`;
  k += `<path d="M${X(0.58)} ${Y(0.14)} L${X(0.84)} ${Y(0.12)} L${X(0.94)} ${Y(0.22)} L${X(0.86)} ${Y(0.34)} L${X(0.78)} ${Y(0.44)} L${X(0.7)} ${Y(0.42)} L${X(0.64)} ${Y(0.34)} L${X(0.6)} ${Y(0.26)} Z" fill="${land}"/>`;
  k += `<path d="M${X(0.8)} ${Y(0.62)} L${X(0.9)} ${Y(0.6)} L${X(0.93)} ${Y(0.72)} L${X(0.84)} ${Y(0.74)} Z" fill="${land}"/>`;
  /* Stecknadeln: Herkunft der Teilnehmer */
  const pins = [[0.5, 0.22, "#d2452f"], [0.54, 0.27, "#2f6db5"], [0.6, 0.38, "#3d9a5b"], [0.63, 0.3, "#f2a900"], [0.72, 0.36, "#d2452f"], [0.27, 0.62, "#7b4fa3"], [0.56, 0.52, "#2f6db5"], [0.82, 0.28, "#3d9a5b"], [0.14, 0.3, "#f2a900"], [0.67, 0.24, "#d2452f"]];
  for (const [u, v, f] of pins) k += `<line x1="${X(u)}" y1="${Y(v)}" x2="${r(X(u) + 0.5)}" y2="${r(Y(v) - 1.6)}" stroke="#666" stroke-width=".25"/><circle cx="${r(X(u) + 0.5)}" cy="${r(Y(v) - 1.8)}" r=".8" fill="${f}"/>`;
  k += `<rect x="${x0}" y="${y1 - 4.4}" width="${r(w)}" height="4.4" fill="#fff" opacity=".85"/>` + T((x0 + x1) / 2, y1 - 1.3, 2.3, "Woher kommen unsere Teilnehmer?", "#5a4636", 'text-anchor="middle" font-weight="bold"');
  const ax = (x0 + x1) / 2, ay = y1;
  S.teil({ id: "weltkarte", de: "die Weltkarte", syl: "WELT-kar-te", it: "il planisfero", itSyl: "pla-ni-SFE-ro", en: "world map", x: ax, y: ay, kunst: um(ax, ay, k),
    tipp: "Jede Nadel zeigt das Herkunftsland einer Teilnehmerin oder eines Teilnehmers." });
}

/* =====================================================================
   3 — DER STUNDENPLAN (Kursplan) an der Wand
   ===================================================================== */
{
  const x0 = WX(-2.38), x1 = WX(-0.98), y0 = WY(2.42), y1 = WY(1.42), w = x1 - x0, h = y1 - y0;
  let k = `<rect x="${x0}" y="${y0}" width="${r(w)}" height="${r(h)}" rx=".8" fill="#fff" stroke="#c9c2b6" stroke-width=".5"/>`;
  k += `<rect x="${x0}" y="${y0}" width="${r(w)}" height="6.4" rx=".8" fill="${ROT}"/>` + T(x0 + 2.4, y0 + 4.5, 3.2, "Kursplan Oktober", "#fff", 'font-weight="bold"');
  const zeilen = [["A1", "Intensivkurs", "Mo–Fr 9:00", "R 1"], ["A2", "Intensivkurs", "Mo–Fr 9:00", "R 2"], ["B1", "Abendkurs", "Di+Do 18:00", "R 2"], ["B2", "telc-Training", "Sa 10:00", "R 3"], ["C1", "Konversation", "Mi 18:30", "R 1"]];
  const farben = { A1: "#3d9a5b", A2: "#3d9a5b", B1: "#2f6db5", B2: "#2f6db5", C1: "#7b4fa3" };
  zeilen.forEach(([n, kurs, zeit, raum], i) => {
    const y = y0 + 9 + i * 5.4;
    k += `<rect x="${x0 + 1.6}" y="${r(y)}" width="5.2" height="3.8" rx=".6" fill="${farben[n]}"/>` + T(x0 + 4.2, y + 2.8, 2.3, n, "#fff", 'text-anchor="middle" font-weight="bold"');
    k += T(x0 + 8.4, y + 2.8, 2.3, kurs, "#333") + T(x0 + 27, y + 2.8, 2.1, zeit, "#555") + T(x1 - 2, y + 2.8, 2.1, raum, ROT, 'text-anchor="end" font-weight="bold"');
    k += `<line x1="${x0 + 1.6}" y1="${r(y + 4.6)}" x2="${x1 - 1.6}" y2="${r(y + 4.6)}" stroke="#e3ddd2" stroke-width=".3"/>`;
  });
  for (const x of [x0 + 2, x1 - 2]) k += `<circle cx="${r(x)}" cy="${y0 + 1.4}" r=".6" fill="#555"/>`;
  const ax = (x0 + x1) / 2, ay = y1;
  S.teil({ id: "sp_stundenplan", de: "der Stundenplan", syl: "STUN-den-plan", it: "l'orario", itSyl: "o-RA-rio", en: "timetable", x: ax, y: ay, kunst: um(ax, ay, k),
    tipp: "Auf dem Kursplan stehen Niveau, Tag, Uhrzeit und Raum." });
}

/* =====================================================================
   4 — DAS ZERTIFIKAT (telc-Prüfungszentrum, gerahmt)
   ===================================================================== */
{
  const x0 = WX(-0.72), x1 = WX(-0.12), y0 = WY(2.32), y1 = WY(1.58), w = x1 - x0, h = y1 - y0;
  let k = `<rect x="${x0 + 0.6}" y="${y0 + 0.8}" width="${r(w)}" height="${r(h)}" fill="#000" opacity=".15"/>`;
  k += `<rect x="${x0}" y="${y0}" width="${r(w)}" height="${r(h)}" fill="${S.lg("rahmen", [[0, "#3b3b3b"], [1, "#1f1f1f"]])}"/>`;
  k += `<rect x="${x0 + 1.4}" y="${y0 + 1.4}" width="${r(w - 2.8)}" height="${r(h - 2.8)}" fill="#fdfcf7"/>`;
  k += T((x0 + x1) / 2, y0 + 6.2, 2.6, "telc", "#0a5f9e", 'text-anchor="middle" font-weight="bold"');
  k += T((x0 + x1) / 2, y0 + 9.2, 1.45, "ZERTIFIKAT", "#333", 'text-anchor="middle" font-weight="bold" letter-spacing=".2"');
  k += T((x0 + x1) / 2, y0 + 11.4, 1.1, "Lizenziertes", "#555", 'text-anchor="middle"') + T((x0 + x1) / 2, y0 + 12.8, 1.1, "Prüfungszentrum", "#555", 'text-anchor="middle"');
  for (let i = 0; i < 3; i++) k += `<rect x="${x0 + 4}" y="${r(y0 + 14.8 + i * 1.1)}" width="${r(w - 8)}" height=".3" fill="#aaa"/>`;
  k += `<circle cx="${x1 - 5}" cy="${y1 - 4.4}" r="1.8" fill="#d6b456"/><path d="M${x1 - 6} ${y1 - 3} l-.6 2.2 l1 -.6 l.5 1 Z" fill="#c8102e"/>`;
  k += `<path d="M${x0 + 1.4} ${y0 + 1.4} L${x0 + 7} ${y0 + 1.4} L${x0 + 1.4} ${y0 + 9} Z" fill="#fff" opacity=".22"/>`;
  const ax = (x0 + x1) / 2, ay = y1;
  S.teil({ id: "sp_zertifikat", de: "das Zertifikat", syl: "Zer-ti-fi-KAT", it: "il certificato", itSyl: "cer-ti-FI-ca-to", en: "certificate", x: ax, y: ay, kunst: um(ax, ay, k),
    tipp: "Hier kann man auch die telc-Prüfung machen und bekommt ein Zertifikat." });
}

/* =====================================================================
   5 — KURSRAUM hinter der Glaswand: Whiteboard, Beamer
   ===================================================================== */
const WB = { X0: 1.48, X1: 3.78, H0: 1.16, H1: 2.28 };
{
  const x0 = WX(WB.X0), x1 = WX(WB.X1), y0 = WY(WB.H1), y1 = WY(WB.H0), w = x1 - x0, h = y1 - y0;
  let k = `<rect x="${x0 - 1.2}" y="${y0 - 1.2}" width="${r(w + 2.4)}" height="${r(h + 2.4)}" rx=".8" fill="${STAHL}"/>`;
  k += `<rect x="${x0}" y="${y0}" width="${r(w)}" height="${r(h)}" fill="${S.lg("wbf", [[0, "#ffffff"], [1, "#eef1f2"]], 0, 0, 1, 1)}"/>`;
  const hw = (x, y, s, t, f = "#1d3f8a", ex = "") => T(x, y, s, t, f, `font-family="'Segoe Print','Comic Sans MS',cursive"${ex ? " " + ex : ""}`);
  k += hw(x0 + 3, y0 + 6, 3.6, "Kurs A2 – Das Perfekt", "#c0392b", 'font-weight="bold"');
  k += `<line x1="${x0 + 3}" y1="${y0 + 7.3}" x2="${x0 + 44}" y2="${y0 + 7.3}" stroke="#c0392b" stroke-width=".4"/>`;
  k += hw(x0 + 3, y0 + 13, 2.8, "haben + Partizip II");
  k += hw(x0 + 5, y0 + 17.6, 2.6, "ich habe gelernt", "#1d1d1d") + hw(x0 + 5, y0 + 21.8, 2.6, "du hast gekauft", "#1d1d1d");
  k += hw(x0 + 47, y0 + 13, 2.8, "sein + Partizip II");
  k += hw(x0 + 49, y0 + 17.6, 2.6, "ich bin gefahren", "#1d1d1d") + hw(x0 + 49, y0 + 21.8, 2.6, "er ist gekommen", "#1d1d1d");
  k += `<line x1="${x0 + 44}" y1="${y0 + 10}" x2="${x0 + 44}" y2="${y0 + 25}" stroke="#888" stroke-width=".3"/>`;
  k += hw(x0 + 3, y0 + 30, 2.5, "Hausaufgabe: S. 34, Nr. 2", "#2e7d32");
  k += hw(x0 + 3, y0 + 35.6, 2.4, "Was hast du am Wochenende gemacht?", "#1d3f8a");
  /* Ablage mit Stiften und Schwamm */
  k += `<rect x="${x0 + 2}" y="${y1 + 1.2}" width="${r(w - 4)}" height="1.4" rx=".5" fill="#aeb6bd"/>`;
  for (const [dx, f] of [[8, "#1d3f8a"], [12, "#c0392b"], [16, "#2e7d32"], [20, "#111"]]) k += `<rect x="${x0 + dx}" y="${y1 + 0.4}" width="3.2" height=".9" rx=".4" fill="${f}"/>`;
  k += `<rect x="${x1 - 14}" y="${y1 - 0.6}" width="5" height="1.8" rx=".4" fill="#3b4b5c"/>`;
  k += `<path d="M${x0} ${y0} L${x0 + 18} ${y0} L${x0} ${y0 + 20} Z" fill="#fff" opacity=".2"/>`;
  const ax = (x0 + x1) / 2, ay = y1 + 2.6;
  S.teil({ id: "sp_whiteboard", de: "das Whiteboard", syl: "WHITE-board", it: "la lavagna bianca", itSyl: "la-VA-gna BIAN-ca", en: "whiteboard", x: ax, y: ay, kunst: um(ax, ay, k),
    tipp: "Am Whiteboard schreibt man mit Stiften, nicht mit Kreide." });
}
{
  /* Beamer an der Decke, Lichtkegel zum Whiteboard */
  const [ax, ay] = P(2.6, 2.72, 1.05);
  const [dx, dy] = P(2.6, HD, 1.05);
  let k = `<rect x="-.5" y="${r(dy - ay)}" width="1" height="${r(ay - dy - 3)}" fill="#9aa1a8"/>`;
  k += `<path d="M-8 -3.6 L8 -3.6 L9 2 L-9 2 Z" fill="${S.lg("beamer", [[0, "#f4f5f6"], [1, "#c9ced3"]])}"/><rect x="-9" y="1.4" width="18" height="1.4" rx=".5" fill="#b8bec4"/>`;
  k += `<ellipse cx="-4.4" cy="-.6" rx="2.6" ry="2" fill="#3a4148"/><ellipse cx="-4.4" cy="-.6" rx="1.6" ry="1.2" fill="${S.rg("linse", [[0, "#9bd0ff"], [1, "#1d2a38"]])}"/>`;
  for (let i = 0; i < 4; i++) k += `<line x1="${2 + i * 1.4}" y1="-2" x2="${2 + i * 1.4}" y2=".8" stroke="#9aa1a8" stroke-width=".35"/>`;
  k += `<circle cx="7" cy="-2" r=".4" fill="#4cd964"/>`;
  S.teil({ oben: true, id: "sp_beamer", de: "der Beamer", syl: "BEA-mer", it: "il proiettore", itSyl: "pro-iet-TO-re", en: "projector", x: ax, y: ay, kunst: k,
    tipp: "„Beamer“ sagt man nur im Deutschen – auf Englisch heißt er „projector“." });
}

/* =====================================================================
   6 — DIE LEHRERIN (im Kursraum, zeigt auf das Whiteboard)
   ===================================================================== */
{
  const [ax, ay] = P(1.12, 0, 0.42);
  const m = B.mensch({ id: "b09b_lehrerin", geschlecht: "w", pose: "zeigen", blick: 58, frisur: "lang", haarfarbe: "braun", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "bluse", farbe: "#f2efe6" }, jacke: { stueck: "jacke", farbe: "#6a4c7d" }, unterteil: { stueck: "hose", farbe: "#2f3035" }, schuhe: { stueck: "halbschuh", farbe: "braun" } } }, 1.68 * sk(0.42));
  S.teil({ id: "sp_lehrerin", de: "die Lehrerin", syl: "LEH-re-rin", it: "l'insegnante", itSyl: "in-se-GNAN-te", en: "teacher", x: ax, y: ay, kunst: m.svg,
    tipp: "Die Lehrerin erklärt das Perfekt: „Ich habe gelernt.“" });
}

/* =====================================================================
   7 — DER KURSTISCH mit Lupe (Kursbuch, Arbeitsblatt, Wörterliste)
   ===================================================================== */
const KT = { X0: 1.0, X1: 2.95, z0: 1.0, z1: 1.5, H: 0.74 };
{
  const { X0, X1, z0, z1, H } = KT;
  const [ax, ay] = P((X0 + X1) / 2, 0, z1);
  let k = "";
  /* Stahlrohrbeine (Kufen) */
  for (const X of [X0 + 0.06, X1 - 0.06]) {
    for (const z of [z0 + 0.05, z1 - 0.05]) { const a = P(X, 0, z), b = P(X, H - 0.03, z); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#4d555c" stroke-width="1.1"/>`; }
    k += `<line x1="${P(X, 0.02, z0 + 0.05)[0]}" y1="${P(X, 0.02, z0 + 0.05)[1]}" x2="${P(X, 0.02, z1 - 0.05)[0]}" y2="${P(X, 0.02, z1 - 0.05)[1]}" stroke="#4d555c" stroke-width="1"/>`;
  }
  k += kiste(X0, X1, H - 0.03, H, z0, z1, { vorn: "#a9865a", deckel: BUCHE, seite: "#b89466" });
  const U = [];
  /* Kursbuch (aufgeschlagen) */
  {
    const pts = blatt(1.5, 1.22, 0.42, 0.28, -0.08, H + 0.01);
    k += poly(pts, "#f8f6ef", 'stroke="#c8c2b5" stroke-width=".2"');
    const m0 = P(1.5, H + 0.01, 1.08), m1 = P(1.5, H + 0.01, 1.36);
    k += `<line x1="${m0[0]}" y1="${m0[1]}" x2="${m1[0]}" y2="${m1[1]}" stroke="#a49c8c" stroke-width=".35"/>`;
    const bild = blatt(1.38, 1.2, 0.14, 0.1, -0.08, H + 0.012);
    k += poly(bild, "#7fb3d5");
    const [bx, by] = P(1.5, H, 1.36);
    k += poly([P(1.29, H + 0.01, 1.37), P(1.71, H + 0.01, 1.34), P(1.71, H - 0.005, 1.35), P(1.29, H - 0.005, 1.38)], ROT);
    U.push({ id: "sp_kursbuch", de: "das Kursbuch", syl: "KURS-buch", it: "il libro di corso", itSyl: "LI-bro di COR-so", en: "course book", x: bx, y: by + 1,
      tipp: "Im Kursbuch stehen Texte, Dialoge und Übungen.", w: 22 });
  }
  /* Arbeitsblatt */
  {
    const pts = blatt(2.18, 1.2, 0.22, 0.3, 0.14, H + 0.008);
    k += poly(pts, "#ffffff", 'stroke="#c8c2b5" stroke-width=".2"');
    for (let i = 0; i < 5; i++) { const a = P(2.1 + i * 0.006, H + 0.01, 1.1 + i * 0.045), b = P(2.26 + i * 0.006, H + 0.01, 1.12 + i * 0.045); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#8a8a8a" stroke-width=".25"/>`; }
    const [bx, by] = P(2.18, H, 1.36);
    /* Bleistift */
    const p0 = P(2.05, H + 0.012, 1.4), p1 = P(2.3, H + 0.012, 1.42);
    k += `<line x1="${p0[0]}" y1="${p0[1]}" x2="${p1[0]}" y2="${p1[1]}" stroke="#f2b632" stroke-width=".8" stroke-linecap="round"/>`;
    U.push({ id: "sp_arbeitsblatt", de: "das Arbeitsblatt", syl: "AR-beits-blatt", it: "la scheda di lavoro", itSyl: "SCHE-da di la-VO-ro", en: "worksheet", x: bx, y: by + 1.4,
      tipp: "Auf dem Arbeitsblatt übt man die neuen Wörter.", w: 14 });
  }
  /* Wörterliste (Karteikarten-Liste, gelb) */
  {
    const pts = blatt(2.66, 1.22, 0.2, 0.26, -0.2, H + 0.008);
    k += poly(pts, "#fff5c2", 'stroke="#d8c98a" stroke-width=".2"');
    for (let i = 0; i < 6; i++) { const a = P(2.58, H + 0.01, 1.12 + i * 0.035), b = P(2.72, H + 0.01, 1.1 + i * 0.035); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#7a6a3a" stroke-width=".22"/>`; }
    const [bx, by] = P(2.66, H, 1.36);
    U.push({ id: "sp_woerterliste", de: "die Wörterliste", syl: "WÖR-ter-lis-te", it: "la lista di vocaboli", itSyl: "LI-sta di vo-CA-bo-li", en: "vocabulary list", x: bx, y: by + 1,
      tipp: "Auf der Wörterliste stehen die neuen Wörter mit Artikel.", w: 12 });
  }
  U.forEach((u) => { u.kunst = flaeche(-u.w / 2, -7, u.w, 8); delete u.w; });
  S.teil({ id: "sp_kurstisch", de: "der Kurstisch", syl: "KURS-tisch", it: "il banco", itSyl: "BAN-co", en: "course table", x: ax, y: ay, steht: true, kunst: um(ax, ay, k),
    zoom: { x: r(P(X0, H, z1)[0] - 4), y: r(P(X0, H, z1)[1] - 30), w: 96, h: 64 },
    unter: U.map((u) => Object.assign(u, { x: r(u.x), y: r(u.y) })) });
}

/* =====================================================================
   8 — DER KURSTEILNEHMER auf dem Stuhl, daneben der zweite Stuhl
   ===================================================================== */
const stuhl = (X, z, mitSitz) => {
  /* Freischwinger-Stuhl, Kunststoffschale, von hinten gesehen */
  let k = "";
  const L = (a, b, w, f = "#3f464d") => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${f}" stroke-width="${w}" stroke-linecap="round"/>`;
  for (const dx of [-0.2, 0.2]) {
    k += L(P(X + dx, 0, z - 0.42), P(X + dx, 0, z + 0.02), 0.9);
    k += L(P(X + dx, 0, z + 0.02), P(X + dx, 0.44, z - 0.02), 0.9);
  }
  if (mitSitz) k += kiste(X - 0.22, X + 0.22, 0.42, 0.46, z - 0.42, z, { vorn: "#1f5f6a", deckel: S.lg("sitz", [[0, "#2c7f8c"], [1, "#3a96a3"]]) });
  else k += kiste(X - 0.22, X + 0.22, 0.42, 0.46, z - 0.08, z, { vorn: "#1f5f6a", deckel: "#2c7f8c" });
  k += L(P(X - 0.19, 0.46, z), P(X - 0.19, 0.6, z + 0.02), 0.8) + L(P(X + 0.19, 0.46, z), P(X + 0.19, 0.6, z + 0.02), 0.8);
  k += poly([P(X - 0.22, 0.58, z + 0.03), P(X + 0.22, 0.58, z + 0.03), P(X + 0.21, 0.88, z + 0.05), P(X - 0.21, 0.88, z + 0.05)], S.lg("lehne", [[0, "#3a96a3"], [1, "#22707c"]]));
  k += poly([P(X - 0.21, 0.86, z + 0.05), P(X + 0.21, 0.86, z + 0.05), P(X + 0.21, 0.88, z + 0.05), P(X - 0.21, 0.88, z + 0.05)], "#5fb3bf");
  return k;
};
{
  const X = 1.42, z = 1.78;
  const [ax, ay] = P(X, 0, z - 0.2);
  const m = B.mensch({ id: "b09b_tn", geschlecht: "m", pose: "lesen", blick: 186, frisur: "kurz", haarfarbe: "schwarz", haut: "dunkel",
    kleidung: { oberteil: { stueck: "pullover", farbe: "#c27a2c" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" } } }, 1.76 * sk(z - 0.2));
  S.teil({ id: "sp_kursteilnehmer", de: "der Kursteilnehmer", syl: "KURS-teil-neh-mer", it: "il corsista", itSyl: "cor-SI-sta", en: "course participant", x: ax, y: ay, kunst: m.svg,
    tipp: "Er ist schon im Kurs A2 und liest im Kursbuch." });
}
{
  const X = 1.42, z = 1.78;
  const [ax, ay] = P(X, 0, z);
  S.teil({ id: "sp_stuhl_links", de: "der Stuhl", syl: "STUHL", it: "la sedia", itSyl: "SE-dia", en: "chair", x: ax, y: ay, steht: true, kunst: um(ax, ay, schatten(ax, ay - 1, 10, 1, 0.22) + stuhl(X, z, false)) });
}
{
  const X = 2.42, z = 1.86;
  const [ax, ay] = P(X, 0, z);
  S.teil({ id: "sp_stuhl_rechts", de: "der zweite Stuhl", syl: "ZWEI-te STUHL", it: "la seconda sedia", itSyl: "se-CON-da SE-dia", en: "second chair", x: ax, y: ay, steht: true, kunst: um(ax, ay, schatten(ax, ay - 1, 10, 1, 0.22) + stuhl(X, z, true)),
    tipp: "Der zweite Stuhl ist noch frei – gleich kommt die neue Teilnehmerin." });
}

/* =====================================================================
   9 — DIE RÜCKSEITE DES EMPFANGS: Prospektständer (vor der Glaswand)
   ===================================================================== */
{
  const X = 0.32, z = 0.42;
  const [ax, ay] = P(X, 0, z), s = sk(z);
  let k = schatten(0, 0, 8, 1, 0.25);
  const w = 0.42 * s, h = 1.42 * s;
  k += `<rect x="${r(-w / 2 + 1)}" y="-1.4" width="${r(w - 2)}" height="1.4" rx=".5" fill="#5d646b"/>`;
  k += `<rect x="${r(-w / 2)}" y="${r(-h)}" width="${r(w)}" height="${r(h - 1.2)}" rx=".6" fill="${S.lg("ps", [[0, "#3f464d"], [1, "#2b3036"]], 0, 0, 1, 0)}"/>`;
  const farben = [[ROT, "Deutsch A1"], ["#2f6db5", "English"], ["#3d9a5b", "Integration"], ["#f2a900", "Français"], ["#7b4fa3", "telc B1"], [PETROL, "Español"], ["#e07b3a", "Italiano"], ["#555", "Business"]];
  farben.forEach(([f, t], i) => {
    const c = i % 2, rr = Math.floor(i / 2), bw = (w - 3) / 2, bh = (h - 6) / 4;
    const x = -w / 2 + 1 + c * (bw + 1), y = -h + 1.6 + rr * bh;
    k += `<rect x="${r(x)}" y="${r(y)}" width="${r(bw)}" height="${r(bh - 1.4)}" fill="${f}"/><rect x="${r(x)}" y="${r(y)}" width="${r(bw)}" height="${r((bh - 1.4) * 0.38)}" fill="#fff" opacity=".85"/>`;
    k += T(x + bw / 2, y + (bh - 1.4) * 0.3, 1.05, t, "#222", 'text-anchor="middle" font-weight="bold"');
    k += `<rect x="${r(x - 0.3)}" y="${r(y + bh * 0.5)}" width="${r(bw + 0.6)}" height="${r(bh * 0.42)}" fill="#e8f2f5" opacity=".45"/>`;
  });
  S.teil({ id: "prospekt", de: "der Prospekt", syl: "pro-SPEKT", it: "l'opuscolo", itSyl: "o-PU-sco-lo", en: "brochure", x: ax, y: ay, steht: true, kunst: k,
    tipp: "Im Prospekt stehen alle Kurse und Preise." });
}

/* =====================================================================
   10 — DIE REZEPTION (Theke) mit Lupe: Einstufungstest, Kuli, Klingel
   ===================================================================== */
const RZ = { X0: -3.5, X1: -1.02, z0: 0.62, z1: 1.12, H: 1.1 };
{
  const { X0, X1, z0, z1, H } = RZ;
  const [ax, ay] = P((X0 + X1) / 2, 0, z1);
  let k = schatten(ax, ay, 50, 2, 0.22);
  k += poly([P(X1, 0, z1), P(X1, 0, z0), P(X1, H, z0), P(X1, H, z1)], "#b9b3a8");
  k += poly([P(X0, 0.08, z1), P(X1, 0.08, z1), P(X1, H - 0.04, z1), P(X0, H - 0.04, z1)], S.lg("rzf", [[0, "#fbfaf7"], [1, "#e8e4dc"]]));
  k += poly([P(X0, 0, z1), P(X1, 0, z1), P(X1, 0.08, z1), P(X0, 0.08, z1)], "#5f564c");
  /* rotes Band mit Logo */
  k += poly([P(X0, 0.5, z1), P(X1, 0.5, z1), P(X1, 0.62, z1), P(X0, 0.62, z1)], ROT);
  const [lx, ly] = P((X0 + X1) / 2, 0.82, z1);
  k += `<circle cx="${r(lx - 30)}" cy="${r(ly - 1.4)}" r="4.6" fill="${ROT}"/>` + T(lx - 30, ly + 0.4, 5, "„“", "#fff", 'text-anchor="middle" font-weight="bold" font-family="Georgia,serif"');
  k += T(lx - 23.5, ly, 5.2, "Sprachschule Lingua", "#3a3330", 'font-weight="bold"');
  k += T(lx - 23.5, ly + 4, 2.4, "Deutschkurse · Sprachkurse · telc-Prüfungen", "#7a6f64");
  /* Thekenplatte */
  k += poly([P(X0 - 0.03, H, z1 + 0.04), P(X1 + 0.03, H, z1 + 0.04), P(X1 + 0.03, H, z0), P(X0 - 0.03, H, z0)], S.lg("platte", [[0, "#cdb18a"], [1, "#e2ca9f"]]));
  k += poly([P(X0 - 0.03, H - 0.04, z1 + 0.04), P(X1 + 0.03, H - 0.04, z1 + 0.04), P(X1 + 0.03, H, z1 + 0.04), P(X0 - 0.03, H, z1 + 0.04)], "#9b7a4e");
  const U = [];
  /* Einstufungstest: Blatt mit Ankreuzfeldern */
  {
    const pts = blatt(-1.62, 0.86, 0.24, 0.32, 0.2, H + 0.005);
    k += poly(pts, "#ffffff", 'stroke="#bdb6a8" stroke-width=".2"');
    const [hx, hy] = P(-1.66, H, 0.74);
    k += T(hx, hy + 0.6, 1.1, "Einstufungstest", ROT, 'text-anchor="middle" font-weight="bold"');
    for (let i = 0; i < 4; i++) { const [x, y] = P(-1.7 + i * 0.006, H + 0.006, 0.8 + i * 0.05); k += `<rect x="${r(x - 2)}" y="${r(y)}" width=".8" height=".6" fill="none" stroke="#444" stroke-width=".2"/><rect x="${r(x - 0.6)}" y="${r(y + 0.15)}" width="${r(4 - (i % 2))}" height=".3" fill="#888"/>`; if (i !== 2) k += `<path d="M${r(x - 2)} ${r(y + 0.3)} l.35 .3 l.6 -.7" stroke="#1d3f8a" stroke-width=".25" fill="none"/>`; }
    const [bx, by] = P(-1.62, H, 1.0);
    U.push({ id: "einstufungstest", de: "der Einstufungstest", syl: "EIN-stu-fungs-test", it: "il test di livello", itSyl: "TEST di li-VEL-lo", en: "placement test", x: bx, y: by + 0.4, w: 15, h: 8,
      tipp: "Der Einstufungstest zeigt, welcher Kurs passt: A1, A2, B1 …" });
  }
  /* Kugelschreiber */
  {
    const a = P(-1.38, H + 0.01, 0.98), b = P(-1.22, H + 0.01, 0.9);
    k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#1d3f8a" stroke-width=".8" stroke-linecap="round"/><line x1="${a[0]}" y1="${a[1]}" x2="${r(a[0] + 0.8)}" y2="${r(a[1] - 0.4)}" stroke="#ddd" stroke-width=".8"/>`;
    U.push({ id: "kugelschreiber", de: "der Kugelschreiber", syl: "KU-gel-schrei-ber", it: "la penna a sfera", itSyl: "PEN-na a SFE-ra", en: "ballpoint pen", x: (a[0] + b[0]) / 2, y: a[1] + 1.4, w: 10, h: 4.6 });
  }
  /* Tischklingel */
  {
    const [cx, cy] = P(-2.3, H, 0.9);
    k += `<ellipse cx="${cx}" cy="${cy}" rx="3.2" ry=".9" fill="#2b2b2b"/><path d="M${cx - 2.6} ${cy - 0.2} Q${cx - 2.6} ${cy - 3.4} ${cx} ${cy - 3.5} Q${cx + 2.6} ${cy - 3.4} ${cx + 2.6} ${cy - 0.2} Z" fill="${S.rg("glocke", [[0, "#fff6d0"], [0.5, "#d9b44a"], [1, "#8d6d1f"]], 0.35, 0.3, 0.8)}"/><rect x="${cx - 0.35}" y="${cy - 4.6}" width=".7" height="1.2" fill="#555"/>`;
    k += `<rect x="${cx - 4.4}" y="${cy - 9.6}" width="8.8" height="3.6" rx=".4" fill="#fff" stroke="#bbb" stroke-width=".2"/>` + T(cx, cy - 7.2, 1.25, "Bitte klingeln", "#444", 'text-anchor="middle"');
    U.push({ id: "klingel", de: "die Klingel", syl: "KLIN-gel", it: "il campanello", itSyl: "cam-pa-NEL-lo", en: "bell", x: cx, y: cy + 1, w: 10, h: 11,
      tipp: "Ist niemand da? Dann klingeln Sie bitte." });
  }
  U.forEach((u) => { u.kunst = flaeche(-u.w / 2, -u.h, u.w, u.h); delete u.w; delete u.h; });
  const [zx, zy] = P(-2.9, H, z1);
  S.teil({ id: "rezeption", de: "die Rezeption", syl: "Re-zep-TION", it: "la reception", itSyl: "re-CEP-tion", en: "reception", x: ax, y: ay, steht: true, kunst: um(ax, ay, k),
    zoom: { x: r(zx), y: r(zy - 30), w: 84, h: 56 },
    unter: U.map((u) => Object.assign(u, { x: r(u.x), y: r(u.y) })),
    tipp: "An der Rezeption meldet man sich für einen Kurs an." });
}
{
  /* Laptop auf der Theke (zur Mitarbeiterseite gedreht: Rückseite mit Logo) */
  const [ax, ay] = P(-3.0, RZ.H, 0.84);
  let k = schatten(0, 0, 9, .9, .3);
  k += `<path d="M-9 0 L9 0 L9.6 -.8 L-9.6 -.8 Z" fill="#9aa1a8"/>`;
  k += `<path d="M-8.4 -.8 L8.4 -.8 L7.8 -13 L-7.8 -13 Z" fill="${S.lg("lap", [[0, "#d7dbdf"], [1, "#aab1b8"]], 0, 0, 1, 0)}"/>`;
  k += `<circle cx="0" cy="-7" r="1.6" fill="#fff" opacity=".7"/><path d="M-7.6 -12.6 L-3 -12.6 L-7.2 -5 Z" fill="#fff" opacity=".25"/>`;
  k += `<rect x="-6.4" y="-17.2" width="7" height="4.2" rx=".4" fill="#ffe46b" transform="rotate(-6 -3 -15)"/>` + T(-2.9, -14.6, 1.3, "Mo 9 Uhr!", "#333", 'text-anchor="middle" transform="rotate(-6 -3 -15)"');
  S.teil({ oben: true, id: "laptop", de: "der Laptop", syl: "LAP-top", it: "il portatile", itSyl: "por-TA-ti-le", en: "laptop", x: ax, y: ay, steht: true, kunst: k });
}

/* =====================================================================
   11 — DIE KURSTEILNEHMERIN (neu, an der Rezeption beim Einstufungstest)
   ===================================================================== */
{
  const [ax, ay] = P(-0.7, 0, 1.6);
  const m = B.mensch({ id: "b09b_tnin", geschlecht: "w", pose: "kontrapost", blick: -62, frisur: "locken", haarfarbe: "schwarz", haut: "oliv",
    kleidung: { oberteil: { stueck: "pullover", farbe: "#2f6db5" }, jacke: { stueck: "jacke", farbe: "#d8c7a6" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" }, zubehoer: { stueck: "rucksack", farbe: "#4f5a3a" } } }, 1.64 * sk(1.66));
  S.teil({ id: "sp_kursteilnehmerin", de: "die Kursteilnehmerin", syl: "KURS-teil-neh-me-rin", it: "la corsista", itSyl: "cor-SI-sta", en: "course participant", x: ax, y: ay, kunst: m.svg,
    tipp: "Sie ist neu und macht zuerst den Einstufungstest." });
}

/* =====================================================================
   GLASWAND zum Kursraum (vor dem Kursraum, fängt keinen Tipp ab)
   ===================================================================== */
{
  const zE = 3.4;
  let v = "";
  /* Glasfläche */
  v += poly([P(GX, HD, 0), P(GX, HD, zE), P(GX, 0, zE), P(GX, 0, 0)], S.lg("glas", [[0, "#e6f3f6", 0.16], [0.5, "#ffffff", 0.06], [1, "#e6f3f6", 0.2]], 0, 0, 1, 1));
  /* Spiegelstreifen */
  for (const [za, zb, o] of [[0.3, 0.55, 0.16], [0.75, 0.85, 0.1], [2.0, 2.4, 0.12]]) v += poly([P(GX, 2.7, za + 0.3), P(GX, 2.7, zb + 0.3), P(GX, 0.15, zb), P(GX, 0.15, za)], "#ffffff", `opacity="${o}"`);
  /* Sichtschutz-Punktband (Glasmarkierung) auf 1,45 m */
  for (let z = 0.06; z < zE; z += 0.09) { const [x, y] = P(GX, 1.47, z), s = sk(z) / S0; v += `<circle cx="${x}" cy="${y}" r="${r(0.9 * s)}" fill="#fff" opacity=".55"/>`; }
  for (let z = 0.06; z < zE; z += 0.09) { const [x, y] = P(GX, 1.4, z), s = sk(z) / S0; v += `<circle cx="${x}" cy="${y}" r="${r(0.6 * s)}" fill="#fff" opacity=".45"/>`; }
  /* Aluminiumrahmen: Pfosten, Riegel oben und unten */
  for (const z of [0, 1.15, 2.3]) { const a = P(GX, 0, z), b = P(GX, HD, z); v += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#9aa3aa" stroke-width="${r(1.3 * sk(z) / S0)}"/>`; }
  v += poly([P(GX, HD, 0), P(GX, HD, zE), P(GX, HD - 0.06, zE), P(GX, HD - 0.06, 0)], "#9aa3aa");
  v += poly([P(GX, 0.06, 0), P(GX, 0.06, zE), P(GX, 0, zE), P(GX, 0, 0)], "#7d868d");
  /* Raumschild auf dem Glas */
  const [tx, ty] = P(GX, 2.05, 1.6);
  v += `<g transform="translate(${tx} ${ty}) skewY(${r(Math.atan2(P(GX, 2.05, 1.8)[1] - ty, P(GX, 2.05, 1.8)[0] - tx) * 180 / Math.PI)})"><rect x="-1" y="-4" width="10" height="5.6" rx=".6" fill="${ROT}" opacity=".9"/>` + T(4, -0.1, 3.4, "R 2", "#fff", 'text-anchor="middle" font-weight="bold"') + `</g>`;
  S.davor(v);
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/sprachschule.js"));
console.log(aus);
