#!/usr/bin/env node
/* =====================================================================
   DER FLUGHAFEN (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   XANDER (Funk 263/286): jeder Ort „identisch mit seinem Original“, alle
   Stationen logisch, jedes Ding einzeln antippbar, nichts blockiert.

   RECHERCHE (Abflughallen deutscher Flughäfen, z. B. Frankfurt T1,
   München T2, Hamburg; Ablauf Check-in / Gepäckaufgabe):
   - In der ABFLUGHALLE hängt die große ANZEIGETAFEL „Abflug/Departures“:
     Zeit, Ziel, Flug, Flugsteig, Bemerkung („Boarding“, „Gate offen“).
   - Die CHECK-IN-SCHALTER stehen in Reihen; über jedem Schalter ein
     Bildschirm mit Nummer und Fluggesellschaft. Zwischen zwei Schaltern
     liegt das GEPÄCKBAND mit eingebauter WAAGE (Anzeige in kg zur
     Kundschaft); das Band läuft durch eine Öffnung mit Gummilamellen in
     die Gepäckförderanlage. Der Koffer bekommt einen GEPÄCKANHÄNGER mit
     Strichcode, man bekommt die BORDKARTE und den REISEPASS zurück.
   - Daneben CHECK-IN-AUTOMATEN (Selbst-Check-in).
   - Zur SICHERHEITSKONTROLLE führt ein Gurtband-Leitsystem
     (ABSPERRUNG); dort Rollenband mit grauen WANNEN, RÖNTGENGERÄT
     (Tunnel mit Bleivorhang) und Torsonde (METALLDETEKTOR).
   - KOFFERWAGEN (Gepäckwagen) stehen in der Halle; gelbe/weiße
     hängende WEGWEISER mit Piktogrammen; große Glasfront zum Vorfeld:
     Flugzeug nase voran am Flugsteig, angedockt an die
     FLUGGASTBRÜCKE, gelbe Leitlinie auf dem Vorfeld, im Hintergrund der
     TOWER.
   Perspektive: echte Zentralprojektion, Augenhöhe 1,6 m, Brennweite
   320 Einheiten, Fluchtpunkt (160|98). Rückwand 23 m entfernt
   (≈ 14 Einheiten je Meter), Schalter 9,7 m (≈ 33 je Meter),
   Passagierin 8,4 m (≈ 38 je Meter, 1,68 m groß).
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "flughafen", titel: "Der Flughafen", emoji: "✈️", thema: "Unterwegs", kuerzel: "b06a", fassung: 852 });
const rnd = zufall(4120);
const r = B.r;

/* ---------- Projektion: X seitlich (m), Z Tiefe (m), H Höhe (m) ---------- */
const F = 320, AUGE = 1.6, VX = 160, VY = 98;
const P = (X, Z, H = 0) => [r(VX + X * F / Z), r(VY + (AUGE - H) * F / Z)];
const pt = (X, Z, H = 0) => P(X, Z, H).join(" ");
const poly = (pts, fill, extra = "") => `<path d="M${pts.map((p) => p.join(" ")).join(" L")} Z" fill="${fill}"${extra}/>`;
const T = (x, y, s, txt, fill, anchor = "start", w = "normal", fam = "Arial,Helvetica,sans-serif") =>
  `<text x="${r(x)}" y="${r(y)}" font-size="${s}" text-anchor="${anchor}" fill="${fill}" font-family="${fam}" font-weight="${w}">${txt}</text>`;
const absolut = (x, y, svg) => `<g transform="translate(${r(-x)} ${r(-y)})">${svg}</g>`;

/* ---------- Grundfarben ---------------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("wolke")}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.2"/></filter>`);
const WAND = S.lg("wand", [[0, "#ecebe7"], [1, "#dcd9d2"]]);
const DECKE = S.lg("decke", [[0, "#d7dde2"], [1, "#eef1f3"]]);
const STAHL = S.lg("stahl", [[0, "#eef1f3"], [0.45, "#c9cfd4"], [0.55, "#b5bcc2"], [1, "#e1e5e8"]], 0, 0, 1, 0);
const LACK = S.lg("lack", [[0, "#ffffff"], [0.55, "#eef1f4"], [1, "#c9d0d8"]]);
const BLAU = "#1d3563", GELB = "#f4c430";

/* =====================================================================
   KULISSE — Decke, Rückwand mit Glasfront und Vorfeld, Steinboden
   ===================================================================== */
const ZW = 23, HD = 7.07;                     // Rückwand-Abstand, Hallenhöhe
const WY = P(0, ZW)[1];                       // Rückwandfuß (≈ 120)
const DY = P(0, ZW, HD)[1];                   // Deckenkante (≈ 22)
{
  /* Decke: Lamellen zur Flucht, Lichtbänder */
  let k = `<rect x="0" y="0" width="320" height="${DY}" fill="${DECKE}"/>`;
  for (let X = -24; X <= 24; X += 1.2) {
    const a = P(X, ZW, HD), b = P(X, 3, HD);
    k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#b9c1c8" stroke-width=".35"/>`;
  }
  for (const X of [-7.2, -2.4, 2.4, 7.2]) {
    const a = P(X - 0.15, ZW, HD), b = P(X + 0.15, ZW, HD), c = P(X + 0.15, 4, HD), d = P(X - 0.15, 4, HD);
    k += poly([a, b, c, d], "#fffef6", ` opacity=".95"`);
  }
  for (const Z of [8, 11, 15, 19]) {
    const a = P(-30, Z, HD), b = P(30, Z, HD);
    k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#a9b2ba" stroke-width="${r(8 / Z)}"/>`;
  }
  k += `<rect x="0" y="${DY - 1.6}" width="320" height="1.6" fill="#9aa4ad"/>`;
  S.hinten(k);
}
/* Rückwand links und rechts, Glasfront in der Mitte (Vorfeld dahinter) */
const GL = P(-4.0, ZW)[0], GR = P(6.4, ZW)[0];   // ≈ 104 … 249
{
  let k = `<rect x="0" y="${DY}" width="320" height="${WY - DY}" fill="${WAND}"/>`;
  /* Natursteinplatten an der Wand */
  for (let H = 0; H < HD; H += 1.2) { const y = P(0, ZW, H)[1]; k += `<line x1="0" y1="${y}" x2="320" y2="${y}" stroke="#cbc7bf" stroke-width=".3"/>`; }
  for (let X = -12; X < 12; X += 1.8) { const x = P(X, ZW)[0]; k += `<line x1="${x}" y1="${DY}" x2="${x}" y2="${WY}" stroke="#cbc7bf" stroke-width=".3"/>`; }
  /* Himmel */
  k += `<rect x="${GL}" y="${DY}" width="${r(GR - GL)}" height="${r(VY - DY)}" fill="${S.lg("himmel", [[0, "#7fb1dc"], [0.7, "#b9d6ec"], [1, "#e4eef4"]])}"/>`;
  for (const [x, y, w] of [[130, 40, 16], [170, 32, 22], [222, 46, 14], [150, 60, 10], [205, 62, 18]]) k += `<ellipse cx="${x}" cy="${y}" rx="${w}" ry="${r(w * 0.22)}" fill="#fff" opacity=".75" filter="url(#${S.id("wolke")})"/>`;
  /* Horizont: Baumreihe, Hangars, ferne Gebäude */
  let baum = `M${GL} ${VY}`;
  for (let x = GL; x <= GR; x += 3) baum += ` L${x} ${r(VY - 1.6 - rnd() * 2.2)}`;
  k += `<path d="${baum} L${GR} ${VY} Z" fill="#5f7a5c"/>`;
  k += `<path d="M206 ${VY} L206 91 Q216 86.6 226 91 L226 ${VY} Z M228 ${VY} L228 92 Q237 88 246 92 L246 ${VY} Z" fill="#a5adb4"/><path d="M208 ${VY} L208 92.6 L224 92.6 L224 ${VY} Z" fill="#7d8790"/>`;
  k += `<rect x="108" y="94" width="18" height="4" fill="#b7bcc1"/><rect x="110" y="95" width="14" height=".8" fill="#8fa2b4"/>`;
  /* Vorfeld (Beton), Fugen zur Flucht, gelbe Leitlinie zur Bugnase */
  k += `<rect x="${GL}" y="${VY}" width="${r(GR - GL)}" height="${r(WY - VY)}" fill="${S.lg("vorfeld", [[0, "#a7abad"], [1, "#8f9497"]])}"/>`;
  for (let X = -60; X <= 80; X += 7.5) { const a = P(X, 400), b = P(X, ZW + 1); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#7d8285" stroke-width=".25"/>`; }
  for (const Z of [30, 40, 55, 80, 130]) { const y = P(0, Z)[1]; k += `<line x1="${GL}" y1="${y}" x2="${GR}" y2="${y}" stroke="#7d8285" stroke-width=".25"/>`; }
  { const a = P(7.6, 78), b = P(7.6, ZW + 1), c = P(7.9, ZW + 1), d = P(7.9, 78); k += poly([a, b, c, d], "#f2c230"); }
  { const a = P(4, 52), b = P(11.5, 52); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#d23b30" stroke-width=".5"/>`; }
  /* Gepäckschlepper mit zwei Wagen, Leitkegel */
  k += `<g><rect x="128" y="103" width="5" height="3" rx=".5" fill="#f2c230"/><rect x="129" y="101.2" width="2.6" height="2" fill="#2b3036"/><circle cx="129.4" cy="106.2" r=".8" fill="#222"/><circle cx="132" cy="106.2" r=".8" fill="#222"/>`;
  for (const x of [134, 140]) k += `<rect x="${x}" y="102.6" width="5.4" height="3.2" fill="#dfe3e6" stroke="#7d868d" stroke-width=".2"/><rect x="${x + 0.6}" y="103.4" width="2" height="1.8" fill="#4a6b8a"/><rect x="${x + 2.8}" y="103.2" width="2" height="2" fill="#b8473a"/><circle cx="${x + 1}" cy="106.1" r=".6" fill="#222"/><circle cx="${x + 4.4}" cy="106.1" r=".6" fill="#222"/>`;
  k += `</g><path d="M232 108 l.8 -2.6 l.8 2.6 Z M240 111 l.9 -3 l.9 3 Z" fill="#f07a1e"/>`;
  S.hinten(k);
}
/* Steinboden der Halle: 1,5-m-Platten in Flucht, glänzend */
{
  let k = `<rect x="0" y="${WY}" width="320" height="${200 - WY}" fill="${S.lg("boden", [[0, "#cfccc5"], [1, "#b8b3aa"]])}"/>`;
  /* Spiegelung der hellen Glasfront im polierten Boden */
  k += `<path d="M${GL} ${WY} L${GR} ${WY} L${P(6.4, 6)[0]} 200 L${P(-4, 6)[0]} 200 Z" fill="${S.lg("spiegel", [[0, "#ffffff", 0.3], [0.8, "#ffffff", 0]])}"/>`;
  for (let X = -15; X <= 15; X += 1.5) { const a = P(X, ZW), b = P(X, 4.5); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#9e988e" stroke-width=".3"/>`; }
  for (let Z = ZW - 1.5; Z > 4.5; Z -= 1.5) { const y = P(0, Z)[1]; k += `<line x1="0" y1="${y}" x2="320" y2="${y}" stroke="#9e988e" stroke-width="${r(0.15 + 2 / Z)}"/>`; }
  k += `<rect x="0" y="${WY - 0.6}" width="320" height="1.2" fill="#8c877e"/>`;
  k += `<rect x="0" y="${WY}" width="320" height="${200 - WY}" fill="${S.lg("bodenlicht", [[0, "#000", 0.12], [0.5, "#000", 0], [1, "#000", 0.08]])}"/>`;
  S.hinten(k);
}
/* Rückwand der Check-in-Insel (Z = 11): Marke der (erfundenen) Fluglinie und Öffnung zur Gepäckanlage */
const ZP = 11;
{
  const a = P(-5.8, ZP, 2.75), b = P(-1.3, ZP, 2.75), c = P(-1.3, ZP, 0), d = P(-5.8, ZP, 0);
  let k = poly([a, b, c, d], S.lg("insel", [[0, "#24406f"], [1, "#172b4d"]]));
  k += poly([P(-5.8, ZP, 2.75), P(-1.3, ZP, 2.75), P(-1.3, ZP, 2.6), P(-5.8, ZP, 2.6)], "#c9a45a");
  /* Logo „Aero Alpina“ zwischen den Bildschirmen */
  const m = P(-3.15, ZP, 2.35);
  k += `<path d="M${m[0] - 6} ${m[1] + 1.5} l4 -5 l2.4 2.6 l2 -2 l3.6 4.4 Z" fill="${GELB}"/>`;
  /* Öffnung für das Gepäckband mit Gummilamellen */
  const o1 = P(-3.5, ZP, 0.95), o2 = P(-2.8, ZP, 0.3);
  k += `<rect x="${o1[0]}" y="${o1[1]}" width="${r(o2[0] - o1[0])}" height="${r(o2[1] - o1[1])}" fill="#0d1526"/>`;
  for (let x = o1[0] + 0.4; x < o2[0]; x += 1.6) k += `<rect x="${r(x)}" y="${o1[1]}" width="1.3" height="${r(o2[1] - o1[1])}" fill="#2b2f36" stroke="#14171b" stroke-width=".15"/>`;
  S.hinten(k);
}

/* =====================================================================
   1 — DIE ANZEIGETAFEL (Abflug) an der Rückwand links
   ===================================================================== */
{
  const a = P(-10.9, ZW, 6.6), b = P(-4.3, ZW, 4.4);
  const x0 = a[0], y0 = a[1], w = b[0] - a[0], h = b[1] - a[1];
  let k = `<rect x="${r(x0 - 1)}" y="${r(y0 - 1)}" width="${r(w + 2)}" height="${r(h + 2)}" rx="1" fill="#3a4048"/>`;
  k += `<rect x="${r(x0)}" y="${r(y0)}" width="${r(w)}" height="${r(h)}" fill="#0b1626"/>`;
  k += `<rect x="${r(x0)}" y="${r(y0)}" width="${r(w)}" height="5.4" fill="#16325c"/>`;
  /* Flugzeug-Piktogramm (Abflug, steigend) */
  k += `<g transform="translate(${r(x0 + 4)} ${r(y0 + 2.8)}) rotate(-25)"><path d="M-2.6 0 L2.6 0 M-.4 0 L-1.6 -2 M-.4 0 L-1.6 2 M2 0 L1.4 -1 M2 0 L1.4 1" stroke="#fff" stroke-width=".7" stroke-linecap="round"/></g>`;
  k += T(x0 + 8, y0 + 4, 3.4, "Abflug", "#fff", "start", "bold") + T(x0 + 22, y0 + 4, 2.4, "Departures", "#b9cbe4");
  k += T(x0 + w - 2, y0 + 4, 3, "10:42", GELB, "end", "bold");
  const kopf = [["Zeit", 2], ["Ziel", 11], ["Flug", 45], ["Gate", 58], ["Bemerkung", 68]];
  kopf.forEach(([t, dx]) => { k += T(x0 + dx, y0 + 8, 1.9, t, "#8ea4c2"); });
  const zeilen = [["10:50", "Palma de Mallorca", "AX 412", "A12", "Boarding", "#7ee08a"],
    ["11:05", "Rom", "AX 318", "A08", "Gate offen", "#ffffff"],
    ["11:20", "Wien", "AX 1157", "A15", "pünktlich", "#ffffff"],
    ["11:35", "London", "AX 921", "B21", "pünktlich", "#ffffff"],
    ["11:50", "Istanbul", "AX 1408", "B04", "neu 12:30", "#ffb347"],
    ["12:10", "Lissabon", "AX 735", "A03", "pünktlich", "#ffffff"]];
  zeilen.forEach((z, i) => {
    const y = y0 + 11.6 + i * 3.5;
    if (i % 2 === 0) k += `<rect x="${r(x0)}" y="${r(y - 2.5)}" width="${r(w)}" height="3.5" fill="#fff" opacity=".04"/>`;
    k += T(x0 + 2, y, 2.3, z[0], GELB, "start", "bold") + T(x0 + 11, y, 2.3, z[1], "#fff") + T(x0 + 45, y, 2.3, z[2], "#d6e2f1") + T(x0 + 58, y, 2.3, z[3], GELB, "start", "bold") + T(x0 + 68, y, 2.1, z[4], z[5]);
  });
  k += `<path d="M${r(x0)} ${r(y0)} L${r(x0 + 22)} ${r(y0)} L${r(x0 + 8)} ${r(y0 + h)} L${r(x0)} ${r(y0 + h)} Z" fill="#fff" opacity=".05"/>`;
  S.teil({ id: "fh_anzeigetafel", de: "die Anzeigetafel", syl: "AN-zei-ge-ta-fel", it: "il tabellone", itSyl: "ta-bel-LO-ne", en: "departure board", x: r(x0 + w / 2), y: r(y0 + h), kunst: absolut(r(x0 + w / 2), r(y0 + h), k),
    tipp: "Auf der Anzeigetafel steht, wann der Flug geht und an welchem Flugsteig." });
}

/* =====================================================================
   2 — DIE UHR (hängt von der Decke)
   ===================================================================== */
{
  const c = P(-1.4, 12, 4.5);
  let k = `<line x1="0" y1="${-c[1]}" x2="0" y2="-9.5" stroke="#5d656d" stroke-width=".7"/>`;
  k += `<circle r="9.4" fill="#2b3036"/><circle r="8.3" fill="${S.rg("ziffer", [[0, "#ffffff"], [1, "#e9ecee"]])}"/>`;
  for (let i = 0; i < 12; i++) {
    const w = i * Math.PI / 6, l = i % 3 ? 1.2 : 2;
    k += `<line x1="${r(Math.sin(w) * 7.4)}" y1="${r(-Math.cos(w) * 7.4)}" x2="${r(Math.sin(w) * (7.4 - l))}" y2="${r(-Math.cos(w) * (7.4 - l))}" stroke="#111" stroke-width="${i % 3 ? 0.5 : 0.9}"/>`;
  }
  /* 10:42 */
  const hw = (10 + 42 / 60) * Math.PI / 6, mw = 42 * Math.PI / 30;
  k += `<line x1="0" y1="0" x2="${r(Math.sin(hw) * 4.3)}" y2="${r(-Math.cos(hw) * 4.3)}" stroke="#111" stroke-width="1.1" stroke-linecap="round"/>`;
  k += `<line x1="0" y1="0" x2="${r(Math.sin(mw) * 6.4)}" y2="${r(-Math.cos(mw) * 6.4)}" stroke="#111" stroke-width=".7" stroke-linecap="round"/>`;
  k += `<line x1="0" y1="1.6" x2="${r(Math.sin(1.2) * 5.6)}" y2="${r(-Math.cos(1.2) * 5.6)}" stroke="#c4271f" stroke-width=".35"/><circle r=".8" fill="#c4271f"/>`;
  k += `<path d="M-6 -5 A8 8 0 0 1 3 -7.6" stroke="#fff" stroke-width=".9" opacity=".6" fill="none"/>`;
  S.teil({ id: "fh_uhr", de: "die Uhr", syl: "UHR", it: "l'orologio", itSyl: "o-ro-LO-gio", en: "clock", x: c[0], y: c[1], kunst: k });
}

/* =====================================================================
   3 — DER WEGWEISER (gelbes Hängeschild mit Piktogrammen)
   ===================================================================== */
{
  const a = P(1.0, 12, 4.85), b = P(5.5, 12, 4.25);
  const w = b[0] - a[0], h = b[1] - a[1], x0 = a[0], y0 = a[1];
  let k = `<line x1="${r(x0 + 12)}" y1="0" x2="${r(x0 + 12)}" y2="${y0}" stroke="#5d656d" stroke-width=".6"/><line x1="${r(x0 + w - 12)}" y1="0" x2="${r(x0 + w - 12)}" y2="${y0}" stroke="#5d656d" stroke-width=".6"/>`;
  k += `<rect x="${x0}" y="${y0}" width="${r(w)}" height="${r(h)}" rx="1" fill="${S.lg("schildgelb", [[0, "#ffd84a"], [1, "#efbd1c"]])}"/>`;
  k += `<rect x="${x0}" y="${r(y0 + h - 1.2)}" width="${r(w)}" height="1.2" rx=".6" fill="#c99a12"/>`;
  /* Piktogramm Abflug */
  const fl = (x, y) => `<g transform="translate(${r(x)} ${r(y)}) rotate(-25)"><path d="M-4 0 L4 0 M-.6 0 L-2.6 -3.2 M-.6 0 L-2.6 3.2 M3 0 L2 -1.6 M3 0 L2 1.6" stroke="#111" stroke-width="1.2" stroke-linecap="round"/></g>`;
  k += `<rect x="${r(x0 + 2)}" y="${r(y0 + 2)}" width="${r(h - 4.4)}" height="${r(h - 4.4)}" rx=".6" fill="#111"/>` + fl(x0 + 2 + (h - 4.4) / 2, y0 + 2 + (h - 4.4) / 2).replace(/#111/g, "#ffd84a");
  k += T(x0 + h + 1, y0 + 7, 4.4, "A 1–24", "#111", "start", "bold") + T(x0 + h + 1, y0 + 11.6, 2.6, "Flugsteige · Gates", "#111");
  /* Piktogramm Sicherheitskontrolle (Person im Torrahmen) und Pfeil */
  const sx = x0 + w - 30, sy = y0 + 2;
  k += `<rect x="${r(sx)}" y="${r(sy)}" width="11" height="11" rx=".6" fill="#111"/><path d="M${r(sx + 2)} ${r(sy + 10)} L${r(sx + 2)} ${r(sy + 1.6)} L${r(sx + 9)} ${r(sy + 1.6)} L${r(sx + 9)} ${r(sy + 10)}" stroke="#ffd84a" stroke-width=".8" fill="none"/>`;
  k += `<circle cx="${r(sx + 5.5)}" cy="${r(sy + 3.8)}" r="1" fill="#ffd84a"/><path d="M${r(sx + 4.3)} ${r(sy + 10)} L${r(sx + 4.6)} ${r(sy + 5.2)} L${r(sx + 6.4)} ${r(sy + 5.2)} L${r(sx + 6.7)} ${r(sy + 10)} Z" fill="#ffd84a"/>`;
  k += `<path d="M${r(x0 + w - 15)} ${r(y0 + h / 2)} h9 m-3.6 -3.6 l3.6 3.6 l-3.6 3.6" stroke="#111" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  S.teil({ id: "fh_wegweiser", de: "der Wegweiser", syl: "WEG-wei-ser", it: "il cartello indicatore", itSyl: "car-TEL-lo in-di-ca-TO-re", en: "signpost", x: r(x0 + w / 2), y: r(y0 + h), kunst: absolut(r(x0 + w / 2), r(y0 + h), k),
    tipp: "Am Flughafen sind die Wegweiser oft gelb: Man sieht sie von Weitem." });
}

/* =====================================================================
   4 — DER TOWER (Kontrollturm, weit draußen)
   ===================================================================== */
{
  let k = `<path d="M-2 0 L-1.5 -34 L1.5 -34 L2 0 Z" fill="${S.lg("turm", [[0, "#d9dde0"], [1, "#9ea6ad"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-5 -34 L5 -34 L4 -36 L-4 -36 Z" fill="#b5bcc2"/>`;
  k += `<path d="M-6 -36 L6 -36 L5 -41 L-5 -41 Z" fill="${S.lg("kanzel", [[0, "#3c5d78"], [1, "#6f93b0"]])}"/>`;
  for (let i = -4; i <= 4; i += 2) k += `<line x1="${i}" y1="-36" x2="${i * 0.84}" y2="-41" stroke="#cfd6db" stroke-width=".3"/>`;
  k += `<path d="M-5.6 -41 L5.6 -41 L4.6 -43 L-4.6 -43 Z" fill="#e3e7ea"/><line x1="0" y1="-43" x2="0" y2="-48" stroke="#8a939a" stroke-width=".4"/><circle cx="0" cy="-48.4" r=".6" fill="#d23b30"/>`;
  S.teil({ id: "fh_tower", de: "der Tower", syl: "TO-wer", it: "la torre di controllo", itSyl: "TOR-re di con-TROL-lo", en: "control tower", x: 124, y: 100, kunst: k,
    tipp: "Im Tower sitzen die Fluglotsen. Sie sagen den Piloten, wann sie starten dürfen." });
}

/* =====================================================================
   5 — DAS FLUGZEUG (Kurzstreckenjet, Nase voran am Flugsteig)
   ===================================================================== */
const FZ = { cx: 184, g: 104, s: 3.0 };
{
  const { cx, g, s } = FZ;
  const cy = r(g - 4 * s), R = 1.98 * s;
  let k = "";
  /* Höhenleitwerk und Seitenleitwerk (weiter hinten, kleiner) */
  k += `<path d="M${cx - 13} 88.4 L${cx + 13} 88.4 L${cx + 12} 89.6 L${cx - 12} 89.6 Z" fill="#c7ced5"/>`;
  k += `<path d="M${cx - 0.9} ${cy - R + 1} L${cx - 0.5} 77.6 L${cx + 0.5} 77.6 L${cx + 0.9} ${cy - R + 1} Z" fill="${BLAU}"/><rect x="${cx - 0.5}" y="77.6" width="1" height="3" fill="${GELB}"/>`;
  /* Tragflächen mit V-Form und Winglets; man sieht die Unterseite */
  const wurzel = cy + 3.4;
  for (const sg of [-1, 1]) {
    const tipX = cx + sg * 17 * s, tipY = wurzel - 17 * s * 0.085;
    k += `<path d="M${cx} ${wurzel - 0.6} L${r(tipX)} ${r(tipY - 0.3)} L${r(tipX)} ${r(tipY + 0.5)} L${cx} ${wurzel + 1.4} Z" fill="${S.lg("fluegel", [[0, "#e9edf0"], [1, "#aeb7bf"]])}"/>`;
    k += `<path d="M${cx} ${wurzel - 0.6} L${r(tipX)} ${r(tipY - 0.3)}" stroke="#ffffff" stroke-width=".5"/>`;
    k += `<path d="M${r(tipX)} ${r(tipY + 0.5)} L${r(tipX + sg * 0.6)} ${r(tipY - 6.6)} L${r(tipX + sg * 1.4)} ${r(tipY - 6.6)} L${r(tipX + sg * 0.6)} ${r(tipY + 0.4)} Z" fill="${BLAU}"/>`;
    /* Triebwerk an Pylon unter der Tragfläche */
    const ex = r(cx + sg * 5.75 * s), ey = r(wurzel - 5.75 * s * 0.085 + 3.9);
    k += `<rect x="${r(ex - 0.6)}" y="${r(ey - 4.4)}" width="1.2" height="2" fill="#9aa3aa"/>`;
    k += `<circle cx="${ex}" cy="${ey}" r="3.6" fill="${S.rg("gondel", [[0, "#3a5a96"], [0.85, BLAU], [1, "#0f1d38"]])}"/>`;
    k += `<circle cx="${ex}" cy="${ey}" r="2.7" fill="#c9d0d6"/><circle cx="${ex}" cy="${ey}" r="2.3" fill="#2a2f35"/>`;
    for (let i = 0; i < 10; i++) { const w = i * Math.PI / 5; k += `<line x1="${ex}" y1="${ey}" x2="${r(ex + Math.cos(w) * 2.2)}" y2="${r(ey + Math.sin(w) * 2.2)}" stroke="#5b636b" stroke-width=".25"/>`; }
    k += `<circle cx="${ex}" cy="${ey}" r=".7" fill="#e7eaec"/><path d="M${r(ex - 2.8)} ${r(ey - 1.6)} A3.2 3.2 0 0 1 ${r(ex + 1)} ${r(ey - 3.1)}" stroke="#7c98c8" stroke-width=".5" fill="none"/>`;
    /* Hauptfahrwerk */
    const fx = r(cx + sg * 3.8 * s);
    k += `<rect x="${r(fx - 0.35)}" y="${r(wurzel + 1)}" width=".7" height="${r(g - wurzel - 3.2)}" fill="#8a939a"/>`;
    k += `<rect x="${r(fx - 1.9)}" y="${g - 3.4}" width="1.5" height="3.4" rx=".6" fill="#1d1f22"/><rect x="${r(fx + 0.4)}" y="${g - 3.4}" width="1.5" height="3.4" rx=".6" fill="#1d1f22"/>`;
  }
  /* Rumpf von vorn: Kreis mit Licht von oben, Radom, Cockpitfenster */
  k += `<circle cx="${cx}" cy="${cy}" r="${r(R)}" fill="${S.rg("rumpf", [[0, "#ffffff"], [0.7, "#eef1f4"], [1, "#b9c2ca"]], 0.45, 0.35, 0.7)}"/>`;
  k += `<ellipse cx="${cx}" cy="${r(cy + 1.6)}" rx="${r(R * 0.62)}" ry="${r(R * 0.5)}" fill="#e3e7eb"/>`;
  k += `<path d="M${r(cx - 4.4)} ${r(cy - 1.5)} L${r(cx - 1.7)} ${r(cy - 2.6)} L${r(cx - 0.3)} ${r(cy - 2.6)} L${r(cx - 0.3)} ${r(cy - 0.9)} L${r(cx - 4.2)} ${r(cy - 0.5)} Z M${r(cx + 4.4)} ${r(cy - 1.5)} L${r(cx + 1.7)} ${r(cy - 2.6)} L${r(cx + 0.3)} ${r(cy - 2.6)} L${r(cx + 0.3)} ${r(cy - 0.9)} L${r(cx + 4.2)} ${r(cy - 0.5)} Z" fill="#1b2633"/>`;
  k += `<path d="M${r(cx - 3.6)} ${r(cy - 1.4)} L${r(cx - 2)} ${r(cy - 2.2)}" stroke="#9fc2df" stroke-width=".35"/>`;
  k += `<circle cx="${cx}" cy="${r(cy - R + 0.2)}" r=".45" fill="#d23b30"/>`;
  /* Bugfahrwerk */
  k += `<rect x="${cx - 0.35}" y="${r(cy + R - 0.5)}" width=".7" height="${r(g - cy - R - 1.6)}" fill="#8a939a"/>`;
  k += `<rect x="${cx - 1.6}" y="${g - 2.4}" width="1.3" height="2.4" rx=".5" fill="#1d1f22"/><rect x="${cx + 0.3}" y="${g - 2.4}" width="1.3" height="2.4" rx=".5" fill="#1d1f22"/>`;
  k += `<circle cx="${cx}" cy="${r(cy + R - 1.1)}" r=".5" fill="#fffbe0"/>`;
  k = schatten(cx, g, 50, 1.6, 0.25) + k;
  S.teil({ id: "fh_flugzeug", de: "das Flugzeug", syl: "FLUG-zeug", it: "l'aereo", itSyl: "a-E-re-o", en: "aeroplane", x: cx, y: g, steht: true, kunst: absolut(cx, g, k),
    tipp: "Das Flugzeug steht mit der Nase zum Gebäude. Gleich steigen alle ein." });
}

/* =====================================================================
   6 — DER FLUGSTEIG (Fluggastbrücke mit Gate-Nummer)
   ===================================================================== */
{
  const { cx, s } = FZ;
  const tx = cx + 1.98 * s - 0.6;
  const A = [tx, 86.4], Bp = [tx, 95.2], C = [252, 101.4], D = [252, 80.6];
  let k = "";
  /* Antriebsstütze mit Rädern auf dem Vorfeld */
  k += `<rect x="219" y="96" width="1.4" height="15" fill="#6d757c"/><rect x="225" y="96" width="1.4" height="15" fill="#6d757c"/><rect x="216.6" y="110" width="12" height="2.6" rx="1" fill="#2b2f33"/>`;
  k += schatten(222.6, 112.8, 9, 1, 0.3);
  /* Tunnel: Seite, Dach, Fensterband, Teleskop-Stufen */
  k += poly([A, D, C, Bp], S.lg("bruecke", [[0, "#c2c9cf"], [0.5, "#aab3ba"], [1, "#8d969e"]]));
  k += poly([[tx + 6, 87.6], [252, 84], [252, 88.6], [tx + 6, 90.8]], "#2f4a63", ` opacity=".85"`);
  k += `<path d="M${tx + 7} 88.2 L${tx + 22} 86.6" stroke="#9fc2df" stroke-width=".4" opacity=".7"/>`;
  for (const x of [tx + 16, tx + 32]) {
    const t = (x - tx) / (252 - tx);
    k += `<line x1="${r(x)}" y1="${r(86.4 - t * 5.8)}" x2="${r(x)}" y2="${r(95.2 + t * 6.2)}" stroke="#6d757c" stroke-width=".6"/>`;
  }
  /* Kabine am Flugzeug mit Faltenbalg */
  k += `<path d="M${tx - 0.5} 85.6 L${tx + 6} 85 L${tx + 6} 96.6 L${tx - 0.5} 96 Z" fill="#7d868d"/>`;
  for (let i = 0; i < 4; i++) k += `<line x1="${r(tx + 0.4 + i * 1.2)}" y1="85.6" x2="${r(tx + 0.4 + i * 1.2)}" y2="96.2" stroke="#4a5158" stroke-width=".35"/>`;
  /* Gate-Nummer auf dem Tunnel */
  k += `<rect x="234" y="88.6" width="12" height="6" rx=".6" fill="${BLAU}"/>` + T(240, 93.2, 4.2, "A12", "#fff", "middle", "bold");
  S.teil({ id: "fh_gate", de: "der Flugsteig", syl: "FLUG-steig", it: "il gate", itSyl: "GATE", en: "gate", x: 222.6, y: 112.6, kunst: absolut(222.6, 112.6, k),
    tipp: "Am Flugsteig A12 geht man durch die Fluggastbrücke direkt ins Flugzeug." });
}

/* =====================================================================
   7 — DIE GLASFRONT (Pfosten, Riegel, Spiegelung) — über dem Vorfeld
   ===================================================================== */
{
  let k = "";
  for (let X = -4.0; X <= 6.41; X += 2.08) {
    const x = P(X, ZW)[0];
    k += `<rect x="${r(x - 0.8)}" y="${DY}" width="1.6" height="${r(WY - DY)}" fill="${S.lg("pfosten", [[0, "#7f8a94"], [0.5, "#c4ccd2"], [1, "#6b757e"]], 0, 0, 1, 0)}"/>`;
  }
  for (const H of [2.4, 4.8]) { const y = P(0, ZW, H)[1]; k += `<rect x="${GL}" y="${r(y - 0.5)}" width="${r(GR - GL)}" height="1" fill="#7f8a94"/>`; }
  k += `<rect x="${GL}" y="${r(WY - 2.6)}" width="${r(GR - GL)}" height="2.6" fill="#6b757e"/>`;
  /* Spiegelung im Glas: fängt keinen Tipp */
  k += `<g pointer-events="none" opacity=".5"><path d="M${GL + 8} ${WY - 3} L${GL + 34} ${DY} L${GL + 44} ${DY} L${GL + 18} ${WY - 3} Z" fill="#fff" opacity=".22"/><path d="M${GR - 60} ${WY - 3} L${GR - 40} ${DY} L${GR - 34} ${DY} L${GR - 54} ${WY - 3} Z" fill="#fff" opacity=".16"/></g>`;
  S.teil({ id: "fh_fenster", de: "die Glasfront", syl: "GLAS-front", it: "la vetrata", itSyl: "ve-TRA-ta", en: "glass front", x: r((GL + GR) / 2), y: WY, kunst: absolut(r((GL + GR) / 2), WY, k),
    tipp: "Durch die Glasfront sieht man das Vorfeld mit den Flugzeugen." });
}

/* =====================================================================
   8 — DIE SICHERHEITSKONTROLLE (hinten rechts) — Lupe: Röntgengerät,
       Wanne, Metalldetektor
   ===================================================================== */
const ZS = 21;
{
  const fy = P(0, ZS)[1];
  let k = "";
  /* Leuchtschild an der Wand */
  const s1 = P(6.8, ZW, 4.4), s2 = P(10.6, ZW, 3.6);
  k += `<rect x="${s1[0]}" y="${s1[1]}" width="${r(s2[0] - s1[0])}" height="${r(s2[1] - s1[1])}" rx=".8" fill="${S.lg("sksch", [[0, "#24406f"], [1, "#172b4d"]])}"/>`;
  k += `<rect x="${r(s1[0] + 1.4)}" y="${r(s1[1] + 1.6)}" width="8" height="8" rx=".5" fill="${GELB}"/><path d="M${r(s1[0] + 2.8)} ${r(s1[1] + 9)} V${r(s1[1] + 3)} H${r(s1[0] + 8)} V${r(s1[1] + 9)}" stroke="#111" stroke-width=".7" fill="none"/><circle cx="${r(s1[0] + 5.4)}" cy="${r(s1[1] + 4.7)}" r=".8" fill="#111"/><path d="M${r(s1[0] + 4.5)} ${r(s1[1] + 9)} L${r(s1[0] + 4.7)} ${r(s1[1] + 5.8)} L${r(s1[0] + 6.1)} ${r(s1[1] + 5.8)} L${r(s1[0] + 6.3)} ${r(s1[1] + 9)} Z" fill="#111"/>`;
  k += T(s1[0] + 11, s1[1] + 5, 3, "Sicherheitskontrolle", "#fff", "start", "bold") + T(s1[0] + 11, s1[1] + 8.8, 2.3, "Security Check", "#b9cbe4");
  /* Rollenband vor dem Röntgengerät */
  const r1 = P(6.4, ZS, 0.75), r2 = P(7.6, ZS, 0.75);
  k += schatten((r1[0] + 318) / 2, fy, 34, 1.1, 0.25);
  k += `<rect x="${r1[0]}" y="${r1[1]}" width="${r(r2[0] - r1[0])}" height="1.6" fill="${STAHL}"/>`;
  for (let x = r1[0] + 1; x < r2[0]; x += 1.4) k += `<line x1="${r(x)}" y1="${r1[1]}" x2="${r(x)}" y2="${r(r1[1] + 1.6)}" stroke="#7d868d" stroke-width=".25"/>`;
  for (const x of [r1[0] + 1.5, r2[0] - 2]) k += `<rect x="${r(x)}" y="${r(r1[1] + 1.6)}" width=".8" height="${r(fy - r1[1] - 1.6)}" fill="#7d868d"/>`;
  /* Röntgengerät mit Tunnel und Bleivorhang */
  const x1 = P(7.6, ZS, 1.55), x2 = P(8.9, ZS, 0);
  k += `<path d="M${x1[0]} ${x2[1]} L${x1[0]} ${r(x1[1] + 2)} Q${x1[0]} ${x1[1]} ${r(x1[0] + 2)} ${x1[1]} L${r(x2[0] - 2)} ${x1[1]} Q${x2[0]} ${x1[1]} ${x2[0]} ${r(x1[1] + 2)} L${x2[0]} ${x2[1]} Z" fill="${S.lg("roentgen", [[0, "#f3f4f2"], [1, "#c9cdcf"]])}"/>`;
  k += `<rect x="${r(x1[0] + 1)}" y="${r(r1[1] - 6)}" width="3.6" height="7.4" fill="#22262b"/>`;
  for (let i = 0; i < 4; i++) k += `<rect x="${r(x1[0] + 1.1 + i * 0.9)}" y="${r(r1[1] - 6)}" width=".8" height="7.4" fill="#3b4148" stroke="#16191c" stroke-width=".1"/>`;
  k += `<rect x="${r(x1[0] + 6)}" y="${r(x1[1] + 3)}" width="${r(x2[0] - x1[0] - 8)}" height="2" rx=".4" fill="#2f5f95"/>` + T((x1[0] + x2[0]) / 2 + 1, x1[1] + 4.6, 1.5, "X-RAY", "#fff", "middle", "bold");
  k += `<rect x="${r(x2[0] - 5)}" y="${r(x1[1] - 5.6)}" width="5" height="3.6" rx=".3" fill="#1a1d21"/><rect x="${r(x2[0] - 4.6)}" y="${r(x1[1] - 5.2)}" width="4.2" height="2.8" fill="#3b6f9e"/><rect x="${r(x2[0] - 2.8)}" y="${r(x1[1] - 2)}" width=".6" height="2" fill="#555"/>`;
  /* graue Wannen auf dem Band */
  const wanne = (x, y) => `<path d="M${r(x - 3.2)} ${r(y - 1.6)} L${r(x + 3.2)} ${r(y - 1.6)} L${r(x + 2.8)} ${r(y)} L${r(x - 2.8)} ${r(y)} Z" fill="#8f979e" stroke="#5f666d" stroke-width=".2"/><path d="M${r(x - 1.6)} ${r(y - 1.6)} q1 -1.4 2.4 -.6 l.8 .6 Z" fill="#2b3a52"/>`;
  k += wanne(r1[0] + 4, r1[1]) + wanne(r1[0] + 11.2, r1[1]);
  /* Auslaufrollen hinter dem Gerät */
  const r3 = P(9.1, ZS, 0.75);
  k += `<rect x="${x2[0]}" y="${r3[1]}" width="${r(r3[0] - x2[0])}" height="1.6" fill="${STAHL}"/>`;
  /* Torsonde (Metalldetektor) */
  const t1 = P(9.3, ZS, 2.15), t2 = P(10.3, ZS, 0);
  k += `<rect x="${t1[0]}" y="${t1[1]}" width="${r(t2[0] - t1[0])}" height="2.4" rx=".6" fill="#d9dde0"/>`;
  k += `<rect x="${t1[0]}" y="${t1[1]}" width="2.2" height="${r(t2[1] - t1[1])}" rx=".5" fill="${S.lg("tor", [[0, "#eef0f1"], [1, "#b5bcc2"]], 0, 0, 1, 0)}"/><rect x="${r(t2[0] - 2.2)}" y="${t1[1]}" width="2.2" height="${r(t2[1] - t1[1])}" rx=".5" fill="${S.lg("tor", [[0, "#eef0f1"], [1, "#b5bcc2"]], 0, 0, 1, 0)}"/>`;
  for (let i = 0; i < 6; i++) k += `<rect x="${r(t1[0] + 0.8)}" y="${r(t1[1] + 4 + i * 3.6)}" width=".6" height="2.2" fill="${i < 2 ? "#3ca35a" : "#5a636b"}"/>`;
  k += `<circle cx="${r((t1[0] + t2[0]) / 2)}" cy="${r(t1[1] + 1.2)}" r=".5" fill="#3ca35a"/>`;
  k += `<path d="M${r(t1[0] + 1)} ${t2[1]} L${r(t2[0] - 1)} ${t2[1]} L${r(t2[0] - 0.4)} ${r(t2[1] + 0.8)} L${r(t1[0] + 0.4)} ${r(t2[1] + 0.8)} Z" fill="#3b4148"/>`;
  const cxS = r((r1[0] + t2[0]) / 2);
  const unter = [
    { id: "fh_roentgengeraet", de: "das Röntgengerät", syl: "RÖNT-gen-ge-rät", it: "lo scanner a raggi X", itSyl: "SCAN-ner a RAG-gi ICS", en: "X-ray scanner", x: r((x1[0] + x2[0]) / 2), y: fy, kunst: flaeche(-(x2[0] - x1[0]) / 2 - 1, -(fy - x1[1]) - 6, x2[0] - x1[0] + 2, fy - x1[1] + 6),
      tipp: "Das Röntgengerät sieht in die Taschen hinein." },
    { id: "fh_wanne", de: "die Wanne", syl: "WAN-ne", it: "la vaschetta", itSyl: "va-SCHET-ta", en: "security tray", x: r(r1[0] + 7.6), y: r(r1[1] + 0.4), kunst: flaeche(-8, -3.6, 15.6, 4.4),
      tipp: "In die Wanne legt man Jacke, Gürtel und Handy." },
    { id: "fh_metalldetektor", de: "der Metalldetektor", syl: "me-TALL-de-tek-tor", it: "il metal detector", itSyl: "ME-tal de-TEC-tor", en: "metal detector", x: r((t1[0] + t2[0]) / 2), y: t2[1], kunst: flaeche(-(t2[0] - t1[0]) / 2 - 0.5, -(t2[1] - t1[1]) - 0.5, t2[0] - t1[0] + 1, t2[1] - t1[1] + 1.5),
      tipp: "Durch den Metalldetektor geht man ohne Schlüssel und Münzen." },
  ];
  S.teil({ id: "fh_sicherheitskontrolle", de: "die Sicherheitskontrolle", syl: "SI-cher-heits-kon-trol-le", it: "il controllo di sicurezza", itSyl: "con-TROL-lo di si-cu-REZ-za", en: "security check", x: cxS, y: fy, steht: true, kunst: absolut(cxS, fy, k),
    zoom: { x: 246, y: 76, w: 74, h: 49 }, unter,
    tipp: "Vor dem Flug wird das Handgepäck kontrolliert." });
}

/* =====================================================================
   9 — DER CHECK-IN-AUTOMAT (zwei Säulen vor der Wand)
   ===================================================================== */
{
  let k = "";
  const fy = P(0, 16)[1];
  for (const X of [4.1, 4.7]) {
    const [x] = P(X, 16), s = F / 16;
    const h = 1.5 * s, w = 0.42 * s;
    k += schatten(x, fy, w * 0.7, 0.8, 0.25);
    k += `<path d="M${r(x - w / 2)} ${fy} L${r(x - w / 2)} ${r(fy - h * 0.62)} L${r(x + w / 2)} ${r(fy - h * 0.62)} L${r(x + w / 2)} ${fy} Z" fill="${S.lg("saeule", [[0, "#e9ecee"], [1, "#b8bfc5"]], 0, 0, 1, 0)}"/>`;
    k += `<path d="M${r(x - w / 2 - 0.4)} ${r(fy - h * 0.62)} L${r(x - w / 2 + 0.6)} ${r(fy - h)} L${r(x + w / 2 - 0.6)} ${r(fy - h)} L${r(x + w / 2 + 0.4)} ${r(fy - h * 0.62)} Z" fill="#2b3036"/>`;
    k += `<path d="M${r(x - w / 2 + 0.6)} ${r(fy - h * 0.66)} L${r(x - w / 2 + 1.3)} ${r(fy - h * 0.96)} L${r(x + w / 2 - 1.3)} ${r(fy - h * 0.96)} L${r(x + w / 2 - 0.6)} ${r(fy - h * 0.66)} Z" fill="${S.lg("kiosk", [[0, "#4b8fd0"], [1, "#2a5d96"]])}"/>`;
    k += `<rect x="${r(x - 2)}" y="${r(fy - h * 0.86)}" width="4" height="1" rx=".3" fill="#fff" opacity=".85"/><rect x="${r(x - 2)}" y="${r(fy - h * 0.8)}" width="4" height="1" rx=".3" fill="${GELB}"/>`;
    k += `<rect x="${r(x - 2.2)}" y="${r(fy - h * 0.55)}" width="4.4" height=".7" fill="#1b1f23"/><rect x="${r(x - 1.4)}" y="${r(fy - h * 0.46)}" width="2.8" height="1.6" rx=".3" fill="#3a4048"/>`;
    k += `<rect x="${r(x - w / 2)}" y="${r(fy - h * 0.62)}" width="${r(w)}" height="1.6" fill="${BLAU}"/>`;
  }
  const [xm] = P(4.4, 16);
  S.teil({ id: "fh_automat", de: "der Check-in-Automat", syl: "CHECK-in-au-to-mat", it: "il chiosco del check-in", itSyl: "CHIO-sco del CHECK-in", en: "check-in kiosk", x: xm, y: fy, steht: true, kunst: absolut(xm, fy, k),
    tipp: "Am Automaten druckt man die Bordkarte selbst aus." });
}

/* =====================================================================
   10 — DIE ABSPERRUNG (Gurtband-Pfosten vor der Kontrolle)
   ===================================================================== */
{
  const Z = 13, fy = P(0, Z)[1], s = F / Z;
  let k = "";
  const xs = [0.3, 1.2, 2.1, 3.0].map((X) => P(X, Z)[0]);
  for (let i = 0; i < xs.length - 1; i++) {
    const a = xs[i], b = xs[i + 1], y = r(fy - 0.88 * s);
    k += `<path d="M${a} ${y} Q${r((a + b) / 2)} ${r(y + 1.6)} ${b} ${y}" stroke="${i % 2 ? "#b3261e" : BLAU}" stroke-width="1.3" fill="none"/>`;
  }
  xs.forEach((x) => {
    k += schatten(x, fy, 3, 0.6, 0.3);
    k += `<ellipse cx="${x}" cy="${r(fy - 0.4)}" rx="2.8" ry=".9" fill="#5a636b"/>`;
    k += `<rect x="${r(x - 0.7)}" y="${r(fy - 0.95 * s)}" width="1.4" height="${r(0.95 * s - 0.4)}" fill="${STAHL}"/>`;
    k += `<rect x="${r(x - 1)}" y="${r(fy - 0.95 * s - 0.8)}" width="2" height="1.4" rx=".5" fill="#3b4148"/>`;
  });
  const xm = r((xs[0] + xs[3]) / 2);
  S.teil({ id: "fh_absperrung", de: "die Absperrung", syl: "AB-sper-rung", it: "la transenna", itSyl: "tran-SEN-na", en: "queue barrier", x: xm, y: fy, steht: true, kunst: absolut(xm, fy, k),
    tipp: "Hier stellt man sich in einer Schlange an." });
}

/* =====================================================================
   11 — DER MITARBEITER AM SCHALTER (hinter Schalter 12)
   ===================================================================== */
const MA = P(-2.2, 10.75);
let handBordkarte = null;
{
  const m = B.mensch({ id: "fh_ma", geschlecht: "w", pose: "servieren", blick: 30, frisur: "dutt", haarfarbe: "schwarz", haut: "mittel", laecheln: true,
    kleidung: { oberteil: { stueck: "bluse", farbe: "weiss" }, jacke: { stueck: "jacke", farbe: "#1d3563" }, unterteil: { stueck: "anzughose" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" }, zubehoer: { stueck: "schal", farbe: "#f4c430" } } }, 1.70 * F / 10.75);
  const hand = [m.z.handL, m.z.handR].filter(Boolean).sort((a, b) => (a.y != null ? a.y : a[1]) - (b.y != null ? b.y : b[1]))[0];
  if (hand) handBordkarte = [MA[0] + (hand.x != null ? hand.x : hand[0]) * m.k, MA[1] + (hand.y != null ? hand.y : hand[1]) * m.k];
  S.teil({ id: "fh_mitarbeiter", de: "der Mitarbeiter am Schalter", syl: "MIT-ar-bei-ter am SCHAL-ter", it: "l'addetto al banco", itSyl: "ad-DET-to al BAN-co", en: "check-in agent", x: MA[0], y: MA[1], kunst: m.svg,
    tipp: "Sie fragt: „Haben Sie Flüssigkeiten im Koffer?“" });
}

/* Lage des Koffers auf dem Band (für den Gepäckanhänger in der Lupe) */
const KOFFER_GRIFF = (() => { const Zk = 9.5, [x, y] = P(-3.15, Zk, 0.3); return [r(x + 2.6), r(y - 0.66 * F / Zk - 1.3)]; })();
/* =====================================================================
   14 — DER CHECK-IN-SCHALTER (Schalter 11 geschlossen, Schalter 12 offen)
        Lupe: Bordkarte, Reisepass, Waage, Gepäckanhänger
   ===================================================================== */
{
  const Zf = 9.7, Zb = 10.4, Ht = 1.02;
  let k = "";
  /* Bildschirme über den Schaltern (an der Inselrückwand) */
  const schirm = (X0, X1, nr, zeile1, zeile2, offen) => {
    const a = P(X0, ZP - 0.05, 2.62), b = P(X1, ZP - 0.05, 2.2);
    let g = `<rect x="${r(a[0] - 0.8)}" y="${r(a[1] - 0.8)}" width="${r(b[0] - a[0] + 1.6)}" height="${r(b[1] - a[1] + 1.6)}" rx=".6" fill="#15181c"/>`;
    g += `<rect x="${a[0]}" y="${a[1]}" width="${r(b[0] - a[0])}" height="${r(b[1] - a[1])}" fill="${offen ? S.lg("schirm", [[0, "#2a4f86"], [1, "#1a355f"]]) : "#20262d"}"/>`;
    g += `<rect x="${a[0]}" y="${a[1]}" width="8" height="${r(b[1] - a[1])}" fill="${offen ? GELB : "#4a525b"}"/>` + T(a[0] + 4, a[1] + 8, 6, nr, offen ? BLAU : "#aab2ba", "middle", "bold");
    g += T(a[0] + 10, a[1] + 5, 2.5, zeile1, offen ? "#fff" : "#aab2ba", "start", "bold") + T(a[0] + 10, a[1] + 9.4, 2.2, zeile2, offen ? GELB : "#8a939a");
    return g;
  };
  k += schirm(-5.25, -3.75, "11", "Schalter", "geschlossen", false);
  k += schirm(-2.75, -1.35, "12", "Aero Alpina", "Palma · AX 412", true);
  /* zwei Schaltertische */
  const tisch = (X0, X1, offen) => {
    let g = "";
    /* rechte Seitenfläche */
    g += poly([P(X1, Zf, Ht), P(X1, Zb, Ht), P(X1, Zb, 0), P(X1, Zf, 0)], "#9aa3ab");
    /* Platte */
    g += poly([P(X0, Zf, Ht), P(X1, Zf, Ht), P(X1, Zb, Ht), P(X0, Zb, Ht)], S.lg("platte", [[0, "#f4f5f6"], [1, "#cfd5da"]]));
    /* Front: weiß lackiert, blaues Band, Nummer */
    g += poly([P(X0, Zf, Ht), P(X1, Zf, Ht), P(X1, Zf, 0), P(X0, Zf, 0)], LACK);
    g += poly([P(X0, Zf, 0.62), P(X1, Zf, 0.62), P(X1, Zf, 0.5), P(X0, Zf, 0.5)], BLAU);
    g += poly([P(X0, Zf, 0.12), P(X1, Zf, 0.12), P(X1, Zf, 0), P(X0, Zf, 0)], "#5d656d");
    g += poly([P(X0, Zf, Ht), P(X1, Zf, Ht), P(X1, Zf, Ht - 0.04), P(X0, Zf, Ht - 0.04)], "#ffffff");
    const n = P((X0 + X1) / 2, Zf, 0.82);
    g += `<rect x="${r(n[0] - 5)}" y="${r(n[1] - 3.6)}" width="10" height="6" rx="1" fill="${offen ? GELB : "#c9cfd4"}"/>` + T(n[0], n[1] + 1.3, 4.6, offen ? "12" : "11", BLAU, "middle", "bold");
    return g;
  };
  k += tisch(-4.9, -3.55, false) + tisch(-2.75, -1.6, true);
  /* Schalter 11: Aufsteller „geschlossen“ */
  {
    const p = P(-4.2, 9.9, Ht);
    k += `<path d="M${r(p[0] - 5)} ${p[1]} L${r(p[0] - 4)} ${r(p[1] - 5.4)} L${r(p[0] + 4)} ${r(p[1] - 5.4)} L${r(p[0] + 5)} ${p[1]} Z" fill="#b3261e"/>` + T(p[0], p[1] - 1.8, 1.8, "geschlossen", "#fff", "middle", "bold");
  }
  /* Schalter 12: Monitor (Rückseite), Bordkartendrucker */
  {
    const p = P(-2.62, 10.15, Ht);
    k += `<rect x="${r(p[0] - 6)}" y="${r(p[1] - 10)}" width="12" height="8" rx=".6" fill="#2b3036"/><rect x="${r(p[0] - 0.8)}" y="${r(p[1] - 2)}" width="1.6" height="2" fill="#3b4148"/><rect x="${r(p[0] - 3)}" y="${r(p[1] - 0.6)}" width="6" height=".8" fill="#3b4148"/>`;
    const q = P(-1.85, 9.85, Ht);
    k += `<rect x="${r(q[0] - 1)}" y="${r(q[1] - 3.2)}" width="7" height="3.2" rx=".5" fill="#4a525b"/><rect x="${r(q[0])}" y="${r(q[1] - 3.6)}" width="5" height=".8" fill="#f7f7f2"/>`;
  }
  /* WAAGE: Anzeige zur Kundschaft am linken Rand von Schalter 12 */
  const wg = P(-2.68, Zf + 0.05, Ht);
  k += `<rect x="${r(wg[0] - 0.4)}" y="${r(wg[1] - 3)}" width=".8" height="3" fill="#7d868d"/><rect x="${r(wg[0] - 5)}" y="${r(wg[1] - 8.6)}" width="10" height="5.8" rx=".6" fill="#1a1d21"/>`;
  k += `<rect x="${r(wg[0] - 4.3)}" y="${r(wg[1] - 7.9)}" width="8.6" height="4.4" rx=".3" fill="#0d2416"/>` + T(wg[0], wg[1] - 4.6, 3, "18,4 kg", "#7cff8a", "middle", "bold", "monospace");
  /* REISEPASS: offen auf der Platte, nahe der Kundin */
  const rp = P(-1.82, 9.82, Ht);
  k += `<path d="M${r(rp[0] - 4)} ${r(rp[1] + 0.4)} L${r(rp[0])} ${r(rp[1] + 0.6)} L${r(rp[0] + 0.3)} ${r(rp[1] - 2)} L${r(rp[0] - 3.5)} ${r(rp[1] - 2.2)} Z" fill="#7a1f2b"/>`;
  k += `<path d="M${r(rp[0])} ${r(rp[1] + 0.6)} L${r(rp[0] + 4)} ${r(rp[1] + 0.4)} L${r(rp[0] + 3.6)} ${r(rp[1] - 2.2)} L${r(rp[0] + 0.3)} ${r(rp[1] - 2)} Z" fill="#f2efe4"/><rect x="${r(rp[0] + 0.9)}" y="${r(rp[1] - 1.6)}" width="1.2" height="1.4" fill="#c9b79a"/>`;
  k += `<circle cx="${r(rp[0] - 1.8)}" cy="${r(rp[1] - 0.8)}" r=".5" fill="#d8b46a"/>`;
  /* BORDKARTE in der erhobenen Hand der Mitarbeiterin */
  const bk = handBordkarte || [MA[0] + 10, MA[1] - 30];
  k += `<g transform="translate(${r(bk[0] + 0.6)} ${r(bk[1] - 1.6)}) rotate(-8)"><rect x="-1" y="-2.4" width="8.4" height="3.6" rx=".3" fill="#ffffff" stroke="#9aa3aa" stroke-width=".15"/><rect x="-1" y="-2.4" width="8.4" height=".9" fill="${BLAU}"/><rect x="4.8" y="-1.2" width="2" height="2" fill="#333" opacity=".7"/><path d="M0 -.8 h3.6 M0 .1 h3" stroke="#555" stroke-width=".25"/></g>`;
  const ga = KOFFER_GRIFF;
  /* Lupe */
  const ax = P(-3.2, Zf)[0], ay = P(0, Zf)[1];
  const u = (id, de, syl, it, itSyl, en, cx, cy, w, h, tipp) => ({ id, de, syl, it, itSyl, en, x: r(cx), y: r(cy), kunst: flaeche(-w / 2, -h, w, h), tipp });
  const unter = [
    u("fh_bordkarte", "die Bordkarte", "BORD-kar-te", "la carta d'imbarco", "CAR-ta d'im-BAR-co", "boarding pass", bk[0] + 4, bk[1] + 1, 11, 6, "Auf der Bordkarte stehen Sitzplatz, Flugsteig und Boardingzeit."),
    u("fh_reisepass", "der Reisepass", "REI-se-pass", "il passaporto", "pas-sa-POR-to", "passport", rp[0], rp[1] + 1, 10, 5, "Für viele Länder braucht man den Reisepass, für die EU reicht auch der Personalausweis."),
    u("fh_waage", "die Waage", "WAA-ge", "la bilancia", "bi-LAN-cia", "scales", wg[0], wg[1] - 2.6, 11, 7, "Die Waage zeigt, wie schwer der Koffer ist. Meist sind 23 kg erlaubt."),
    u("fh_gepaeckanhaenger", "der Gepäckanhänger", "Ge-PÄCK-an-hän-ger", "l'etichetta del bagaglio", "e-ti-CHET-ta del ba-GA-glio", "baggage tag", ga[0] + 0.3, ga[1] + 10.4, 6, 9.6, "Der Strichcode zeigt, in welches Flugzeug der Koffer muss."),
  ];
  S.teil({ id: "fh_checkin", de: "der Check-in-Schalter", syl: "CHECK-in-SCHAL-ter", it: "il banco del check-in", itSyl: "BAN-co del CHECK-in", en: "check-in desk", x: r(ax), y: ay, steht: true, kunst: absolut(r(ax), ay, k),
    zoom: { x: 38, y: 92, w: 84, h: 56 }, unter,
    tipp: "Am Check-in-Schalter gibt man den Koffer ab und bekommt die Bordkarte." });
}

/* =====================================================================
   12 — DAS GEPÄCKBAND (mit Waage) zwischen den Schaltern
   ===================================================================== */
const BAND = { X0: -3.5, X1: -2.8, Z0: 9.0, Z1: ZP, H: 0.3 };
{
  const { X0, X1, Z0, Z1, H } = BAND;
  let k = "";
  /* Oberseite: schwarzes Gummiband mit Querrillen, Edelstahlkanten */
  k += poly([P(X0 - 0.06, Z0, H), P(X1 + 0.06, Z0, H), P(X1 + 0.06, Z1, H), P(X0 - 0.06, Z1, H)], STAHL);
  k += poly([P(X0, Z0, H), P(X1, Z0, H), P(X1, Z1, H), P(X0, Z1, H)], S.lg("gummi", [[0, "#1a1c1f"], [1, "#34383d"]]));
  for (let Z = Z0 + 0.2; Z < Z1; Z += 0.22) { const a = P(X0, Z, H), b = P(X1, Z, H); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#4a4f55" stroke-width=".25"/>`; }
  /* Front mit Wiegeplatte und Hinweis */
  k += poly([P(X0 - 0.06, Z0, H), P(X1 + 0.06, Z0, H), P(X1 + 0.06, Z0, 0), P(X0 - 0.06, Z0, 0)], S.lg("bandfront", [[0, "#d5dadd"], [1, "#9ea6ad"]]));
  const f = P((X0 + X1) / 2, Z0, 0.15);
  k += `<rect x="${r(f[0] - 7)}" y="${r(f[1] - 2.4)}" width="14" height="4.4" rx=".5" fill="${BLAU}"/>` + T(f[0], f[1] + 0.9, 2.3, "max. 32 kg", "#fff", "middle", "bold");
  /* rechte Seitenfläche (zur Bildmitte hin sichtbar) */
  k += poly([P(X1 + 0.06, Z0, H), P(X1 + 0.06, Z1, H), P(X1 + 0.06, Z1, 0), P(X1 + 0.06, Z0, 0)], "#8d969e");
  const a = P(X0, Z0), b = P(X1, Z0);
  k = schatten((a[0] + b[0]) / 2, a[1], (b[0] - a[0]) / 2 + 2, 1.2, 0.3) + k;
  /* hinter der Front von Schalter 12 verschwindet das Band */
  S.def(`<clipPath id="${S.id("bandclip")}"><rect x="-20" y="0" width="${r(P(-2.75, 9.7)[0] + 20)}" height="200"/></clipPath>`);
  k = `<g clip-path="url(#${S.id("bandclip")})">${k}</g>`;
  const xm = r((a[0] + b[0]) / 2);
  S.teil({ id: "fh_gepaeckband", de: "das Gepäckband", syl: "Ge-PÄCK-band", it: "il nastro bagagli", itSyl: "NA-stro ba-GA-gli", en: "baggage belt", x: xm, y: a[1], steht: true, kunst: absolut(xm, a[1], k),
    tipp: "Das Band wiegt den Koffer und bringt ihn dann zum Flugzeug." });
}

/* =====================================================================
   13 — DER KOFFER (aufrecht auf dem Gepäckband)
   ===================================================================== */
{
  const Zk = 9.5, s = F / Zk, [x, y] = P(-3.15, Zk, BAND.H);
  const w = 0.44 * s, h = 0.66 * s, d = 0.26 * s * 0.22;
  let k = `<ellipse cx="0" cy="-.3" rx="${r(w / 2 + 1)}" ry=".8" fill="#000" opacity=".35"/>`;
  /* Seitenfläche (Tiefe) rechts */
  k += `<path d="M${r(w / 2)} ${r(-h + 1)} L${r(w / 2 + d)} ${r(-h + 0.2)} L${r(w / 2 + d)} ${r(-1)} L${r(w / 2)} 0 Z" fill="#0f5f66"/>`;
  k += `<rect x="${r(-w / 2)}" y="${r(-h)}" width="${r(w)}" height="${r(h)}" rx="2" fill="${S.lg("koffer", [[0, "#2bb3b8"], [0.5, "#1c9aa0"], [1, "#127b81"]], 0, 0, 1, 0)}"/>`;
  for (const t of [-0.28, 0, 0.28]) k += `<rect x="${r(t * w - 0.5)}" y="${r(-h + 1.4)}" width="1" height="${r(h - 2.8)}" rx=".5" fill="#fff" opacity=".18"/>`;
  k += `<rect x="${r(-w / 2)}" y="${r(-h * 0.52)}" width="${r(w)}" height=".6" fill="#0d585e"/>`;
  k += `<rect x="${r(-w / 2 + 1.2)}" y="${r(-h + 0.6)}" width="2.2" height="${r(h - 1.4)}" rx="1" fill="#fff" opacity=".14"/>`;
  /* Griff oben, Rollen unten */
  k += `<path d="M-3 ${r(-h)} L-3 ${r(-h - 1.6)} L3 ${r(-h - 1.6)} L3 ${r(-h)}" stroke="#1e2226" stroke-width="1" fill="none"/>`;
  k += `<circle cx="${r(-w / 2 + 1.6)}" cy="0" r=".9" fill="#1e2226"/><circle cx="${r(w / 2 - 1.6)}" cy="0" r=".9" fill="#1e2226"/>`;
  let tag = "";
  const ga = KOFFER_GRIFF;
  /* GEPÄCKANHÄNGER am Koffergriff */
  tag += `<path d="M${ga[0]} ${ga[1]} q.6 1.6 .2 3" stroke="#e8e6dc" stroke-width=".5" fill="none"/><rect x="${r(ga[0] - 1.4)}" y="${r(ga[1] + 2.8)}" width="3.4" height="7" rx=".4" fill="#ffffff" stroke="#b9c0c6" stroke-width=".15"/><rect x="${r(ga[0] - 1.4)}" y="${r(ga[1] + 2.8)}" width="3.4" height="1.4" fill="#3ca35a"/>`;
  for (let i = 0; i < 7; i++) tag += `<rect x="${r(ga[0] - 1 + i * 0.4)}" y="${r(ga[1] + 5.2)}" width="${i % 2 ? 0.15 : 0.25}" height="2.6" fill="#222"/>`;
  tag += T(ga[0] + 0.3, ga[1] + 9.3, 1.1, "PMI", "#222", "middle", "bold");
  k += absolut(x, r(y - 0.6), tag);
  S.teil({ oben: true, id: "fh_koffer", de: "der Koffer", syl: "KOF-fer", it: "la valigia", itSyl: "va-LI-gia", en: "suitcase", x, y: r(y - 0.6), steht: true, kunst: k,
    tipp: "Der große Koffer fliegt unten im Bauch des Flugzeugs mit." });
}

/* =====================================================================
   15 — DIE PASSAGIERIN (vor Schalter 12) und 16 — DAS HANDGEPÄCK
   ===================================================================== */
{
  const p = P(-1.2, 8.4);
  const m = B.mensch({ id: "fh_pass", geschlecht: "w", pose: "stehen", blick: -48, frisur: "lang", haarfarbe: "braun", haut: "hell",
    kleidung: { oberteil: { stueck: "pullover", farbe: "creme" }, jacke: { stueck: "mantel", farbe: "#b98a52" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" }, zubehoer: { stueck: "tasche", farbe: "#5a3a24" } } }, 1.68 * F / 8.4);
  S.teil({ id: "fh_passagierin", de: "die Passagierin", syl: "Pas-sa-GIE-rin", it: "la passeggera", itSyl: "pas-seg-GE-ra", en: "passenger", x: p[0], y: p[1], kunst: m.svg,
    tipp: "Sie fliegt heute nach Palma de Mallorca." });
}
{
  const Z = 8.3, s = F / Z, [x, y] = P(-0.55, Z);
  const w = 0.36 * s, h = 0.55 * s, d = 0.2 * s * 0.3;
  let k = schatten(1, 0, w / 2 + 2, 1, 0.3);
  k += `<path d="M${r(-w / 2)} ${r(-h + 1)} L${r(-w / 2 - d)} ${r(-h)} L${r(-w / 2 - d)} -1.4 L${r(-w / 2)} 0 Z" fill="#20252b"/>`;
  k += `<rect x="${r(-w / 2)}" y="${r(-h)}" width="${r(w)}" height="${r(h)}" rx="2" fill="${S.lg("trolley", [[0, "#4a525c"], [0.5, "#353b42"], [1, "#24292e"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${r(-w / 2 + 1.6)}" y="${r(-h + 3)}" width="${r(w - 3.2)}" height="${r(h * 0.42)}" rx="1.2" fill="#2b3036" stroke="#555d66" stroke-width=".3"/>`;
  k += `<path d="M${r(-w / 2 + 2)} ${r(-h * 0.4)} h${r(w - 4)}" stroke="#555d66" stroke-width=".4"/>`;
  /* ausgezogener Teleskopgriff */
  k += `<rect x="-3.6" y="${r(-h - 17)}" width=".9" height="17" fill="${STAHL}"/><rect x="2.7" y="${r(-h - 17)}" width=".9" height="17" fill="${STAHL}"/><rect x="-4.2" y="${r(-h - 18.4)}" width="8.4" height="2" rx=".9" fill="#1e2226"/>`;
  k += `<circle cx="${r(-w / 2 + 1.4)}" cy="0" r="1.2" fill="#15181b"/><circle cx="${r(w / 2 - 1.4)}" cy="0" r="1.2" fill="#15181b"/>`;
  k += `<rect x="${r(-w / 2 + 0.6)}" y="${r(-h + 0.6)}" width="1.6" height="${r(h - 2)}" rx=".8" fill="#fff" opacity=".1"/>`;
  S.teil({ id: "fh_handgepaeck", de: "das Handgepäck", syl: "HAND-ge-päck", it: "il bagaglio a mano", itSyl: "ba-GA-glio a MA-no", en: "hand luggage", x, y, steht: true, kunst: k,
    tipp: "Das Handgepäck nimmt man mit in die Kabine. Flüssigkeiten nur bis 100 ml." });
}

/* =====================================================================
   17 — DER GEPÄCKWAGEN (Kofferwagen vorne rechts, von der Seite)
   ===================================================================== */
{
  const Z = 5.9, s = F / Z, [x0, y0] = P(1.45, Z), [x1] = P(2.6, Z);
  const L = x1 - x0, xm = r((x0 + x1) / 2);
  let k = schatten(0, 0, L / 2 + 4, 1.6, 0.3);
  const bx = (t) => r(-L / 2 + t * L);
  /* Räder */
  for (const t of [0.06, 0.78]) k += `<circle cx="${bx(t)}" cy="-2.6" r="2.6" fill="#1d2023"/><circle cx="${bx(t)}" cy="-2.6" r="1" fill="#9aa3aa"/>`;
  k += `<rect x="${bx(0.02)}" y="-6.8" width="${r(L * 0.84)}" height="1.6" rx=".6" fill="${STAHL}"/>`;
  k += `<rect x="${bx(0.02)}" y="-5.6" width="${r(L * 0.84)}" height="1.4" fill="#6f7a83"/>`;
  /* vorderes Gitter (Ablage) und Rahmen hoch zum Griff */
  k += `<path d="M${bx(0.02)} -6.6 L${bx(0)} -24 M${bx(0.86)} -6 L${bx(0.98)} ${r(-0.98 * s)}" stroke="#8d969e" stroke-width="1.4" stroke-linecap="round"/>`;
  k += `<path d="M${bx(0.02)} -14 L${bx(0.12)} -14" stroke="#8d969e" stroke-width=".8"/>`;
  /* Schiebebügel mit Bremsgriff */
  k += `<rect x="${r(bx(0.95) - 1.4)}" y="${r(-0.99 * s - 1.4)}" width="5.6" height="2.8" rx="1.4" fill="${BLAU}"/>`;
  k += `<path d="M${bx(0.93)} ${r(-0.9 * s)} L${r(bx(0.93) + 3.2)} ${r(-0.92 * s)}" stroke="#d23b30" stroke-width="1" stroke-linecap="round"/>`;
  /* Werbeschild am Rahmen */
  k += `<rect x="${r(bx(0.84) - 1)}" y="${r(-0.62 * s)}" width="${r(L * 0.12)}" height="10" rx=".8" fill="${GELB}"/>` + `<g transform="translate(${r(bx(0.84) + L * 0.05)} ${r(-0.62 * s + 5)}) rotate(-25)"><path d="M-2.4 0 L2.4 0 M-.4 0 L-1.5 -1.9 M-.4 0 L-1.5 1.9 M1.8 0 L1.2 -.9 M1.8 0 L1.2 .9" stroke="${BLAU}" stroke-width=".7" stroke-linecap="round"/></g>`;
  /* großer roter Koffer liegend und eine Reisetasche darauf */
  k += `<rect x="${bx(0.05)}" y="-21" width="${r(L * 0.72)}" height="14.2" rx="2.4" fill="${S.lg("koffer2", [[0, "#d04a3c"], [1, "#9c2f25"]])}"/>`;
  for (const t of [0.22, 0.4, 0.58]) k += `<rect x="${bx(t)}" y="-20" width="1" height="12.2" rx=".5" fill="#fff" opacity=".16"/>`;
  k += `<rect x="${r(bx(0.36))}" y="-22.4" width="6" height="1.6" rx=".8" fill="#2b2f33"/>`;
  k += `<path d="M${bx(0.12)} -21 Q${bx(0.12)} -31 ${bx(0.3)} -31.4 L${bx(0.56)} -31.4 Q${bx(0.68)} -31 ${bx(0.66)} -21 Z" fill="${S.lg("tasche", [[0, "#3e5f4a"], [1, "#2a4234"]])}"/>`;
  k += `<path d="M${bx(0.2)} -30 Q${bx(0.39)} -38 ${bx(0.58)} -30" stroke="#1f3026" stroke-width="1" fill="none"/>`;
  k += `<path d="M${bx(0.16)} -26.4 L${bx(0.64)} -26.4" stroke="#1f3026" stroke-width=".5"/>`;
  S.teil({ id: "fh_gepaeckwagen", de: "der Gepäckwagen", syl: "Ge-PÄCK-wa-gen", it: "il carrello portabagagli", itSyl: "car-REL-lo por-ta-ba-GA-gli", en: "luggage trolley", x: xm, y: y0, steht: true, kunst: k,
    tipp: "Auf den Gepäckwagen passen zwei große Koffer." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/flughafen.js"));
console.log(aus);
