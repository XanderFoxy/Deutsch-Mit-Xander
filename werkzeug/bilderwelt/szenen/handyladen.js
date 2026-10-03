#!/usr/bin/env node
/* =====================================================================
   DER HANDYLADEN (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (Shopkonzepte der Mobilfunkanbieter, Fachpresse Ladenbau,
   Berichte über neue Shops):
   - Mitten im Laden der PRÄSENTATIONSTISCH: Smartphones und Tablets
     liegen schräg auf Haltern, jedes Gerät mit Sicherungskabel
     (Diebstahlsicherung, lädt zugleich) und Preisschild; daneben der
     Router fürs Internet zu Hause.
   - An der Wand die ZUBEHÖRWAND (Lochwand/Lamellenwand mit Haken):
     Handyhüllen, Schutzglas, Ladekabel, Ladegeräte, Kopfhörer,
     Powerbanks in Blisterverpackungen.
   - Ein großer BILDSCHIRM mit den TARIFEN: Datenvolumen in GB,
     monatliche Grundgebühr, Laufzeit (24 Monate oder monatlich).
   - Hinten die BERATUNGSTHEKE: Bildschirm für den Berater,
     Kartenterminal; hier wird der Vertrag unterschrieben, der Ausweis
     geprüft und die SIM-Karte ausgegeben. Dahinter die HANDYWAND mit
     den Geräten im Halter.
   - Helles Licht, Betonboden, Farbe des Anbieters als Akzent.
   Maßstab: Rückwand ≈ 45 Einheiten je Meter, vorne ≈ 60 je Meter.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "handyladen", titel: "Der Handyladen", emoji: "📱", thema: "Einkaufen", kuerzel: "b04c", fassung: 852 });
const rnd = zufall(5566);
const r = B.r;

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const AKZENT = "#0f7c8c", AKZENT_H = "#19a3b5";
const WAND = S.lg("wand", [[0, "#f5f6f6"], [1, "#e6e8e9"]]);
const DECKE = S.lg("decke", [[0, "#3a3e44"], [1, "#2b2e33"]]);
const HOLZ = S.lg("holz", [[0, "#d6b98e"], [0.5, "#c9a97b"], [1, "#b8966a"]], 0, 0, 1, 0);
const WEISS = S.lg("weiss", [[0, "#ffffff"], [1, "#e4e6e7"]]);
const ALU = S.lg("alu", [[0, "#eef1f3"], [0.5, "#c3c9ce"], [1, "#e1e5e8"]], 0, 0, 1, 0);
const GLAS = (n, a, b) => S.lg(n, [[0, a], [1, b]], 0, 0, 1, 1);
const SCHIRME = [GLAS("s1", "#5b7cfa", "#a855f7"), GLAS("s2", "#0ea5a4", "#1e3a8a"), GLAS("s3", "#f97316", "#db2777"), GLAS("s4", "#22c55e", "#0f766e"), GLAS("s5", "#1f2937", "#475569"), GLAS("s6", "#38bdf8", "#6366f1")];

/* =====================================================================
   KULISSE — offene dunkle Decke mit Schienenstrahlern, helle Wand,
   Akzentstreifen, geschliffener Betonboden
   ===================================================================== */
const WU = 124;
S.hinten(`<rect x="0" y="0" width="320" height="14" fill="${DECKE}"/>`);
S.hinten(`<rect x="0" y="6" width="320" height="1.2" fill="#15171a"/>`);
for (const x of [24, 62, 128, 176, 236, 290]) S.hinten(`<rect x="${x - 1.6}" y="7" width="3.2" height="3" rx=".6" fill="#15171a"/><path d="M${x - 1.6} 10 L${x + 1.6} 10 L${x + 2.4} 13 L${x - 2.4} 13 Z" fill="#202327"/><ellipse cx="${x}" cy="13" rx="2.4" ry=".6" fill="#fffbe9"/>`);
S.hinten(`<rect x="0" y="14" width="320" height="${WU - 14}" fill="${WAND}"/>`);
S.hinten(`<rect x="0" y="14" width="320" height="2.2" fill="${AKZENT}"/>`);
S.hinten(`<rect x="0" y="14" width="320" height="${WU - 14}" fill="${S.rg("wl", [[0, "#ffffff", 0.6], [1, "#ffffff", 0]], 0.5, 0.15, 0.7)}"/>`);
S.hinten(`<rect x="0" y="${WU - 3}" width="320" height="3" fill="#3a3e44"/>`);
{
  let f = `<rect x="0" y="${WU}" width="320" height="${200 - WU}" fill="${S.lg("beton", [[0, "#b8b6b1"], [1, "#a29f99"]])}"/>`;
  for (let i = 0; i < 40; i++) f += `<ellipse cx="${r(rnd() * 320)}" cy="${r(WU + 4 + rnd() * 72)}" rx="${r(2 + rnd() * 6)}" ry="${r(0.4 + rnd() * 0.8)}" fill="${rnd() < 0.5 ? "#c4c2bd" : "#a3a09a"}" opacity=".22"/>`;
  for (const [a, b] of [[60, -40], [160, 160], [260, 360]]) f += `<line x1="${a}" y1="${WU}" x2="${b}" y2="200" stroke="#8c8984" stroke-width=".35"/>`;
  f += `<line x1="0" y1="152" x2="320" y2="152" stroke="#8c8984" stroke-width=".35"/>`;
  f += `<rect x="0" y="${WU}" width="320" height="${200 - WU}" fill="${S.lg("bl", [[0, "#000", 0.15], [0.4, "#000", 0], [1, "#fff", 0.1]])}"/>`;
  /* Lichtspiegelungen der Strahler im polierten Beton */
  for (const x of [62, 176, 290]) f += `<ellipse cx="${x}" cy="${WU + 8}" rx="9" ry="3" fill="#fff" opacity=".18" filter="url(#bw_weich)"/>`;
  S.hinten(f);
}

/* =====================================================================
   DIE ZUBEHÖRWAND — Lupe: Handyhülle, Schutzglas, Ladekabel, Ladegerät,
   Kopfhörer, Powerbank
   ===================================================================== */
{
  const X0 = 4, X1 = 104, Y0 = 20, W = X1 - X0, H = WU - Y0, cx = (X0 + X1) / 2;
  let k = `<rect x="${-W / 2}" y="${-H}" width="${W}" height="${H}" fill="#e9ebec"/>`;
  /* Lamellenwand: graue Nuten */
  S.def(`<pattern id="${S.id("nut")}" patternUnits="userSpaceOnUse" width="10" height="3.6"><rect width="10" height="3.6" fill="#d9dcde"/><rect y="2.6" width="10" height="1" fill="#9ea4a9"/><rect y="2.4" width="10" height=".3" fill="#fff" opacity=".7"/></pattern>`);
  k += `<rect x="${-W / 2 + 2}" y="${-H + 7}" width="${W - 4}" height="${H - 33}" fill="url(#${S.id("nut")})"/>`;
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="6" fill="${AKZENT}"/><text x="0" y="${-H + 4.3}" font-size="3.2" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-weight="bold" letter-spacing="1.4">ZUBEHÖR</text>`;
  const cw = (W - 4) / 3, row = [-H + 8, -H + 44];
  const hook = (x, y) => `<rect x="${r(x - 0.3)}" y="${r(y)}" width=".6" height="3" fill="#8d949a"/>`;
  /* Blister-Packung */
  const blister = (x, y, w, h, inhalt) => `<rect x="${r(x - w / 2)}" y="${r(y)}" width="${w}" height="${h}" rx=".6" fill="#ffffff" stroke="#c9ced2" stroke-width=".2"/><circle cx="${r(x)}" cy="${r(y + 1.4)}" r=".6" fill="#8d949a"/>${inhalt}<rect x="${r(x - w / 2 + 0.4)}" y="${r(y + h - 2.4)}" width="${w - 0.8}" height="1.8" fill="${AKZENT}" opacity=".85"/><rect x="${r(x - w / 2 + 0.5)}" y="${r(y + 2.6)}" width=".6" height="${r(h - 5.6)}" fill="#fff" opacity=".7"/>`;
  const unter = [];
  const zone = (c, q) => flaeche(-cw / 2 + 0.6, -0.2, cw - 1.2, 35);
  const ux = (c) => cx - W / 2 + 2 + c * cw + cw / 2, uy = (q) => WU + row[q];
  const fach = (c, q, fn) => { for (let j = 0; j < 2; j++) for (let i = 0; i < 3; i++) { const x = -W / 2 + 2 + c * cw + 5.2 + i * ((cw - 10.4) / 2), y = row[q] + 1 + j * 17; k += hook(x, y - 1) + fn(x, y + 1.6, i, j); } };
  /* Handyhüllen in vielen Farben */
  const hf = ["#e2566c", "#2f3a44", "#3d8fd6", "#f2c94c", "#9b59b6", "#4caf50"];
  fach(0, 0, (x, y, i, j) => blister(x, y, 8, 14.6, `<rect x="${r(x - 2.4)}" y="${r(y + 2.6)}" width="4.8" height="8.4" rx="1" fill="${hf[(i + j * 3) % 6]}"/><circle cx="${r(x - 1.2)}" cy="${r(y + 3.8)}" r=".6" fill="#222" opacity=".6"/>`));
  unter.push({ id: "ha_huelle", de: "die Handyhülle", syl: "HAN-dy-hül-le", it: "la cover", itSyl: "CO-ver", en: "phone case", x: ux(0), y: uy(0), kunst: zone(0, 0),
    tipp: "Die Hülle schützt das Handy, wenn es herunterfällt." });
  /* Schutzglas (Panzerglas) */
  fach(1, 0, (x, y) => blister(x, y, 8, 14.6, `<rect x="${r(x - 2.6)}" y="${r(y + 2.4)}" width="5.2" height="8.8" rx="1" fill="#dff1f6" stroke="#8fb9c8" stroke-width=".25"/><path d="M${r(x - 2)} ${r(y + 9)} L${r(x + 1.6)} ${r(y + 3.4)}" stroke="#fff" stroke-width=".5"/>`));
  unter.push({ id: "ha_schutzglas", de: "das Schutzglas", syl: "SCHUTZ-glas", it: "il vetro protettivo", itSyl: "VE-tro pro-tet-TI-vo", en: "screen protector", x: ux(1), y: uy(0), kunst: zone(1, 0),
    tipp: "Das Schutzglas klebt man auf den Bildschirm – dann bekommt er keine Kratzer." });
  /* Ladekabel, aufgerollt */
  const kf = ["#ffffff", "#2f3a44", "#ffffff", "#e2566c", "#ffffff", "#3d8fd6"];
  fach(2, 0, (x, y, i, j) => blister(x, y, 8, 14.6, `<circle cx="${r(x)}" cy="${r(y + 6.6)}" r="2.6" fill="none" stroke="${kf[(i + j * 3) % 6] === "#ffffff" ? "#cfd3d6" : kf[(i + j * 3) % 6]}" stroke-width="1"/><circle cx="${r(x)}" cy="${r(y + 6.6)}" r="1.4" fill="none" stroke="${kf[(i + j * 3) % 6] === "#ffffff" ? "#dfe2e4" : kf[(i + j * 3) % 6]}" stroke-width=".7"/><rect x="${r(x + 1.6)}" y="${r(y + 2.4)}" width="1.2" height="2" rx=".3" fill="#9aa2a8"/>`));
  unter.push({ id: "ha_kabel", de: "das Ladekabel", syl: "LA-de-ka-bel", it: "il cavo di ricarica", itSyl: "CA-vo di ri-CA-ri-ca", en: "charging cable", x: ux(2), y: uy(0), kunst: zone(2, 0),
    tipp: "Die meisten neuen Handys haben einen USB-C-Anschluss." });
  /* Ladegeräte (Netzteile) */
  fach(0, 1, (x, y) => blister(x, y, 8, 14.6, `<rect x="${r(x - 2.2)}" y="${r(y + 3)}" width="4.4" height="5.4" rx=".8" fill="#f4f5f6" stroke="#bfc4c8" stroke-width=".25"/><rect x="${r(x - 1.3)}" y="${r(y + 8.4)}" width=".6" height="1.6" fill="#9aa2a8"/><rect x="${r(x + 0.7)}" y="${r(y + 8.4)}" width=".6" height="1.6" fill="#9aa2a8"/><rect x="${r(x - 0.8)}" y="${r(y + 4)}" width="1.6" height=".6" fill="#555"/>`));
  unter.push({ id: "ha_ladegeraet", de: "das Ladegerät", syl: "LA-de-ge-rät", it: "il caricabatterie", itSyl: "ca-ri-ca-bat-te-RI-e", en: "charger", x: ux(0), y: uy(1), kunst: zone(0, 1),
    tipp: "Neue Handys kommen oft ohne Ladegerät – das kauft man extra." });
  /* Kopfhörer: oben Bügelkopfhörer, unten kabellose In-Ears */
  fach(1, 1, (x, y, i, j) => j === 0
    ? blister(x, y, 8, 14.6, `<path d="M${r(x - 2.6)} ${r(y + 8)} Q${r(x - 2.8)} ${r(y + 2.6)} ${r(x)} ${r(y + 2.6)} Q${r(x + 2.8)} ${r(y + 2.6)} ${r(x + 2.6)} ${r(y + 8)}" stroke="${i === 1 ? "#e2566c" : "#2f3a44"}" stroke-width=".8" fill="none"/><rect x="${r(x - 3.4)}" y="${r(y + 6.6)}" width="2" height="3.4" rx=".8" fill="${i === 1 ? "#e2566c" : "#2f3a44"}"/><rect x="${r(x + 1.4)}" y="${r(y + 6.6)}" width="2" height="3.4" rx=".8" fill="${i === 1 ? "#e2566c" : "#2f3a44"}"/>`)
    : blister(x, y, 8, 14.6, `<rect x="${r(x - 2.2)}" y="${r(y + 4)}" width="4.4" height="4.4" rx="1.6" fill="#fafafa" stroke="#c9ced2" stroke-width=".25"/><path d="M${r(x - 2.2)} ${r(y + 5.8)} h4.4" stroke="#c9ced2" stroke-width=".25"/><circle cx="${r(x)}" cy="${r(y + 5)}" r=".3" fill="#5fd38a"/>`));
  unter.push({ id: "ha_kopfhoerer", de: "die Kopfhörer", syl: "KOPF-hö-rer", it: "le cuffie", itSyl: "CUF-fie", en: "headphones", x: ux(1), y: uy(1), kunst: zone(1, 1) });
  /* Powerbanks */
  fach(2, 1, (x, y, i, j) => blister(x, y, 8, 14.6, `<rect x="${r(x - 2)}" y="${r(y + 2.6)}" width="4" height="7.6" rx=".9" fill="${(i + j) % 2 ? "#2f3a44" : "#d9dcde"}"/><rect x="${r(x - 1)}" y="${r(y + 3.6)}" width="2" height=".6" fill="${AKZENT_H}"/><rect x="${r(x - 1)}" y="${r(y + 4.6)}" width="2" height=".6" fill="${AKZENT_H}"/><rect x="${r(x - 1)}" y="${r(y + 5.6)}" width="2" height=".6" fill="${AKZENT_H}" opacity=".4"/>`));
  unter.push({ id: "ha_powerbank", de: "die Powerbank", syl: "PO-wer-bank", it: "il power bank", itSyl: "PO-wer bank", en: "power bank", x: ux(2), y: uy(1), kunst: zone(2, 1),
    tipp: "Mit der Powerbank lädt man das Handy unterwegs." });
  /* Trenner zwischen den Spalten */
  for (let c = 1; c < 3; c++) k += `<rect x="${r(-W / 2 + 2 + c * cw - 0.4)}" y="${-H + 7}" width=".8" height="${H - 33}" fill="#fff"/>`;
  /* Unterschrank mit Vorrat */
  k += `<rect x="${-W / 2}" y="-26" width="${W}" height="26" fill="${WEISS}"/><rect x="${-W / 2}" y="-26" width="${W}" height="1.6" fill="${HOLZ}"/>`;
  for (let i = 0; i < 3; i++) k += `<rect x="${r(-W / 2 + 2 + i * cw + 0.6)}" y="-22" width="${r(cw - 1.2)}" height="18" rx=".6" fill="none" stroke="#d3d6d8" stroke-width=".4"/><rect x="${r(-W / 2 + 2 + i * cw + cw / 2 - 4)}" y="-20" width="8" height=".9" rx=".4" fill="#9ea4a9"/>`;
  S.teil({ id: "ha_zubehoerwand", de: "die Zubehörwand", syl: "ZU-be-hör-wand", it: "la parete degli accessori", itSyl: "pa-RE-te DE-gli ac-ces-SO-ri", en: "accessories wall", x: cx, y: WU, steht: true, kunst: k,
    zoom: { x: 0, y: 18, w: 112, h: 80 }, unter });
}

/* =====================================================================
   DER TARIF — großer Bildschirm; Lupe: Datenvolumen, Grundgebühr, Laufzeit
   ===================================================================== */
{
  const X0 = 114, X1 = 200, Y0 = 24, Y1 = 86, W = X1 - X0, H = Y1 - Y0, cx = (X0 + X1) / 2;
  let k = `<rect x="${-W / 2 - 1.6}" y="${-H - 1.6}" width="${W + 3.2}" height="${H + 3.2}" rx="1.2" fill="#15171a"/>`;
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="${H}" fill="${S.lg("tv", [[0, "#0d4f5a"], [1, "#07323a"]])}"/>`;
  k += `<text x="0" y="${-H + 7.4}" font-size="4.8" text-anchor="middle" fill="#ffffff" font-family="Arial,sans-serif" font-weight="bold">Unsere Tarife</text>`;
  const karten = [["S", "10 GB", "19,99 €", "24 Monate"], ["M", "40 GB", "29,99 €", "24 Monate"], ["L", "unbegrenzt", "44,99 €", "monatlich kündbar"]];
  const kw = (W - 8) / 3;
  karten.forEach(([n, gb, preis, lz], i) => {
    const x = -W / 2 + 2 + i * (kw + 2), top = i === 1;
    k += `<rect x="${r(x)}" y="${-H + 11}" width="${r(kw)}" height="${H - 13}" rx="1.4" fill="${top ? "#ffffff" : "#e9f4f5"}"/>`;
    if (top) k += `<rect x="${r(x)}" y="${-H + 11}" width="${r(kw)}" height="3.2" rx="1.2" fill="#f2c94c"/><text x="${r(x + kw / 2)}" y="${-H + 13.5}" font-size="2.2" text-anchor="middle" fill="#3a2a00" font-family="Arial" font-weight="bold">BELIEBT</text>`;
    k += `<text x="${r(x + kw / 2)}" y="${-H + 20}" font-size="3.6" text-anchor="middle" fill="${AKZENT}" font-family="Arial" font-weight="bold">Tarif ${n}</text>`;
    k += `<text x="${r(x + kw / 2)}" y="${-H + 29}" font-size="${gb.length > 6 ? 3.4 : 5.6}" text-anchor="middle" fill="#14232a" font-family="Arial" font-weight="bold">${gb}</text><text x="${r(x + kw / 2)}" y="${-H + 32.4}" font-size="1.9" text-anchor="middle" fill="#5a6a70" font-family="Arial">Datenvolumen 5G</text>`;
    k += `<line x1="${r(x + 3)}" y1="${-H + 34.6}" x2="${r(x + kw - 3)}" y2="${-H + 34.6}" stroke="#c9d6d9" stroke-width=".3"/>`;
    k += `<text x="${r(x + kw / 2)}" y="${-H + 41}" font-size="4.4" text-anchor="middle" fill="#14232a" font-family="Arial" font-weight="bold">${preis}</text><text x="${r(x + kw / 2)}" y="${-H + 44.2}" font-size="1.9" text-anchor="middle" fill="#5a6a70" font-family="Arial">im Monat</text>`;
    k += `<rect x="${r(x + 2.6)}" y="${-H + 47.6}" width="${r(kw - 5.2)}" height="4.4" rx="2.2" fill="${top ? AKZENT : "#ffffff"}" stroke="${AKZENT}" stroke-width=".3"/><text x="${r(x + kw / 2)}" y="${-H + 50.6}" font-size="${lz.length > 10 ? 1.8 : 2.2}" text-anchor="middle" fill="${top ? "#ffffff" : AKZENT}" font-family="Arial">${lz}</text>`;
  });
  k += `<path d="M${-W / 2} ${-H} L${-W / 2 + 22} ${-H} L${-W / 2} ${-H + 30} Z" fill="#fff" opacity=".08"/>`;
  const zeile = (y0, h) => flaeche(-W / 2 + 1, y0, W - 2, h);
  const unter = [
    { id: "ha_datenvolumen", de: "das Datenvolumen", syl: "DA-ten-vo-lu-men", it: "il traffico dati", itSyl: "TRAF-fi-co DA-ti", en: "data allowance", x: cx, y: Y1 - H + 33, kunst: zeile(-11, 12),
      tipp: "Ist es aufgebraucht, wird das Internet langsam — abgeschaltet wird es nicht." },
    { id: "ha_grundgebuehr", de: "die Grundgebühr", syl: "GRUND-ge-bühr", it: "il canone mensile", itSyl: "CA-no-ne men-SI-le", en: "monthly fee", x: cx, y: Y1 - H + 45, kunst: zeile(-10, 10.6),
      tipp: "Die Grundgebühr zahlt man jeden Monat, auch wenn man wenig telefoniert." },
    { id: "ha_laufzeit", de: "die Laufzeit", syl: "LAUF-zeit", it: "la durata del contratto", itSyl: "du-RA-ta del con-TRAT-to", en: "contract term", x: cx, y: Y1 - H + 53, kunst: zeile(-7, 8),
      tipp: "Bei 24 Monaten Laufzeit kann man erst danach kündigen." },
  ];
  S.teil({ id: "ha_tarif", de: "der Tarif", syl: "Ta-RIF", it: "la tariffa", itSyl: "ta-RIF-fa", en: "tariff", x: cx, y: Y1, kunst: k,
    zoom: { x: X0 - 4, y: Y0 - 2, w: W + 8, h: H + 4 }, unter,
    tipp: "Vergleichen lohnt sich: Prepaid ohne Laufzeit oder Vertrag mit vierundzwanzig Monaten." });
}

/* ein Smartphone von vorn (Bildschirm mit Hintergrundbild) */
const phone = (x, y, w, h, schirm, rahmen = "#1d1f23") =>
  `<rect x="${r(x - w / 2)}" y="${r(y - h)}" width="${w}" height="${h}" rx="${r(w * 0.18)}" fill="${rahmen}"/>` +
  `<rect x="${r(x - w / 2 + 0.45)}" y="${r(y - h + 0.45)}" width="${r(w - 0.9)}" height="${r(h - 0.9)}" rx="${r(w * 0.14)}" fill="${schirm}"/>` +
  `<rect x="${r(x - 0.9)}" y="${r(y - h + 0.8)}" width="1.8" height=".5" rx=".25" fill="#000"/>` +
  `<path d="M${r(x - w / 2 + 0.8)} ${r(y - h * 0.3)} L${r(x + w / 2 - 0.8)} ${r(y - h * 0.75)} L${r(x + w / 2 - 0.8)} ${r(y - h * 0.6)} L${r(x - w / 2 + 0.8)} ${r(y - h * 0.15)} Z" fill="#fff" opacity=".14"/>`;

/* =====================================================================
   DIE HANDYWAND hinter der Theke — Lupe: Seniorenhandy, Smartwatch
   ===================================================================== */
{
  const X0 = 210, X1 = 316, Y0 = 22, Y1 = 104, W = X1 - X0, H = Y1 - Y0, cx = (X0 + X1) / 2;
  let k = `<rect x="${-W / 2}" y="${-H}" width="${W}" height="${H}" rx="1" fill="${WEISS}"/>`;
  k += `<rect x="${-W / 2 + 2}" y="${-H + 2}" width="${W - 4}" height="${H - 4}" fill="${S.lg("hw", [[0, "#f8fafb"], [1, "#e9eef0"]])}"/>`;
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="1.4" fill="${AKZENT}"/>`;
  const reihen = [-H + 22, -H + 46];
  reihen.forEach((y, ri) => {
    k += `<rect x="${-W / 2 + 3}" y="${y + 3}" width="${W - 6}" height="1.6" fill="${HOLZ}"/>`;
    for (let i = 0; i < 9; i++) {
      const x = -W / 2 + 8 + i * ((W - 16) / 8), w = ri ? 6.2 : 6.8, h = ri ? 12.4 : 13.4;
      k += `<rect x="${r(x - 1.6)}" y="${y + 0.6}" width="3.2" height="2.4" rx=".5" fill="#2a2d31"/><path d="M${r(x)} ${y + 3} q1.2 2 -.6 3.6" stroke="#2a2d31" stroke-width=".35" fill="none"/>`;
      k += phone(x, y + 0.6, w, h, SCHIRME[(i + ri * 2) % 6], i % 3 === 2 ? "#c9ccd0" : "#1d1f23");
      k += `<rect x="${r(x - 3)}" y="${y + 5.6}" width="6" height="2.2" rx=".3" fill="#fff" stroke="#d3d6d8" stroke-width=".15"/><text x="${r(x)}" y="${y + 7.3}" font-size="1.5" text-anchor="middle" fill="#14232a" font-family="Arial" font-weight="bold">${["999", "849", "349", "1099", "229", "699", "179", "549", "299"][(i + ri * 4) % 9]} €</text>`;
    }
  });
  /* unten links: Seniorenhandys mit großen Tasten; daneben Smartwatches */
  const y3 = -H + 72;
  k += `<rect x="${-W / 2 + 3}" y="${y3 + 3}" width="${W - 6}" height="1.6" fill="${HOLZ}"/>`;
  for (let i = 0; i < 3; i++) {
    const x = -W / 2 + 9 + i * 11;
    k += `<rect x="${r(x - 3.6)}" y="${y3 - 14}" width="7.2" height="14" rx="1.6" fill="${i === 1 ? "#b8473a" : "#e9ebec"}" stroke="#9ea4a9" stroke-width=".25"/><rect x="${r(x - 2.6)}" y="${y3 - 12.8}" width="5.2" height="4" rx=".4" fill="${SCHIRME[i]}"/>`;
    for (let j = 0; j < 9; j++) k += `<rect x="${r(x - 2.6 + (j % 3) * 1.8)}" y="${r(y3 - 8 + Math.floor(j / 3) * 2.2)}" width="1.5" height="1.7" rx=".3" fill="#3a3e44"/>`;
    k += `<rect x="${r(x - 1.2)}" y="${y3 - 1.2}" width="2.4" height="1" rx=".4" fill="#d23b30"/>`;
  }
  for (let i = 0; i < 3; i++) {
    const x = -W / 2 + 48 + i * 10;
    k += `<path d="M${r(x - 1.8)} ${y3 - 16} L${r(x + 1.8)} ${y3 - 16} L${r(x + 1.8)} ${y3} L${r(x - 1.8)} ${y3} Z" fill="${["#2f3a44", "#d98aa6", "#4f8a46"][i]}"/>`;
    k += `<rect x="${r(x - 3)}" y="${y3 - 10.6}" width="6" height="7" rx="1.8" fill="#16181b"/><rect x="${r(x - 2.4)}" y="${y3 - 10}" width="4.8" height="5.8" rx="1.4" fill="${SCHIRME[(i + 3) % 6]}"/><text x="${r(x)}" y="${y3 - 6.4}" font-size="1.7" text-anchor="middle" fill="#fff" font-family="Arial">10:42</text>`;
  }
  const unter = [
    { id: "ha_seniorenhandy", de: "das Seniorenhandy", syl: "se-ni-O-ren-han-dy", it: "il cellulare per anziani", itSyl: "cel-lu-LA-re per an-ZIA-ni", en: "senior phone", x: X0 + 22, y: Y1 - H + 72 + 2, kunst: flaeche(-18, -18, 36, 20),
      tipp: "Große Tasten, laut und einfach – mit einer Notruftaste." },
    { id: "ha_smartwatch", de: "die Smartwatch", syl: "SMART-watch", it: "lo smartwatch", itSyl: "SMART-watch", en: "smartwatch", x: X0 + 58, y: Y1 - H + 72 + 2, kunst: flaeche(-16, -20, 32, 22) },
  ];
  S.teil({ id: "ha_regal", de: "die Handywand", syl: "HAN-dy-wand", it: "l'espositore di telefoni", itSyl: "e-spo-si-TO-re", en: "phone display", x: cx, y: Y1, kunst: k,
    zoom: { x: X0 - 2, y: Y0 + 30, w: 90, h: 58 }, unter,
    tipp: "Die Geräte hängen fest — man darf sie ausprobieren, aber nicht mitnehmen." });
}

/* =====================================================================
   DER BERATER (hinter der Theke)
   ===================================================================== */
{
  const m = B.mensch({ id: "b04c_berater", geschlecht: "m", pose: "halten", blick: -48, frisur: "kurz", haarfarbe: "schwarz", haut: "dunkel", laecheln: true, bart: true,
    kleidung: { oberteil: { stueck: "hemd", farbe: AKZENT }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" } } }, 94);
  let k = m.svg;
  /* Namensschild */
  const p = m.z.punkte.brustmuskelL || m.z.punkte.brust;
  k += `<rect x="${r(p[0] * m.k - 2.2)}" y="${r(p[1] * m.k - 1)}" width="4.4" height="1.8" rx=".3" fill="#fff"/><rect x="${r(p[0] * m.k - 2.2)}" y="${r(p[1] * m.k - 1)}" width="1" height="1.8" fill="${AKZENT}"/>`;
  /* er zeigt der Kundin ein neues Handy */
  const h = [m.z.handL, m.z.handR].sort((a, b) => a.x - b.x)[0];
  k += `<g transform="translate(${r(h.x * m.k - 0.6)} ${r(h.y * m.k - 1)}) rotate(-12)">${phone(0, 0, 4.2, 8.4, SCHIRME[2])}</g>`;
  S.teil({ id: "ha_berater", de: "der Berater", syl: "Be-RA-ter", it: "il consulente", itSyl: "con-su-LEN-te", en: "sales adviser", x: 292, y: 154, kunst: k,
    tipp: "Er erklärt den Unterschied zwischen Prepaid und Vertrag." });
}

/* =====================================================================
   DIE THEKE (Beratungstheke) — Lupe: Vertrag, Ausweis, SIM-Karte,
   Kartenterminal
   ===================================================================== */
{
  const X0 = 224, X1 = 318, Y = 178, top = -60, W = X1 - X0, cx = (X0 + X1) / 2;
  let k = schatten(0, 0, W / 2 + 1, 2.2, 0.32);
  /* Platte von leicht oben */
  k += `<path d="M${-W / 2 + 2} ${top - 4} L${W / 2 - 2} ${top - 4} L${W / 2} ${top} L${-W / 2} ${top} Z" fill="${S.lg("platte", [[0, "#cfb187"], [1, "#e0c79f"]])}"/>`;
  k += `<rect x="${-W / 2}" y="${top}" width="${W}" height="2.2" fill="#f7f7f6"/>`;
  /* Front: weiß, mit Akzentband und Logo */
  k += `<rect x="${-W / 2}" y="${top + 2.2}" width="${W}" height="${-top - 6.2}" fill="${WEISS}"/>`;
  k += `<rect x="${-W / 2}" y="${top + 16}" width="${W}" height="14" fill="${AKZENT}"/><rect x="${-W / 2}" y="${top + 16}" width="${W}" height="1" fill="${AKZENT_H}"/>`;
  k += `<text x="0" y="${top + 25.6}" font-size="6" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-weight="bold" letter-spacing=".6">funk<tspan fill="#bff3f8">punkt</tspan></text>`;
  k += `<g transform="translate(-30 ${top + 23})" fill="none" stroke="#fff" stroke-width=".7"><path d="M-2.6 0 a2.6 2.6 0 0 1 5.2 0"/><path d="M-4.6 0 a4.6 4.6 0 0 1 9.2 0"/><circle cx="0" cy="0" r=".7" fill="#fff"/></g>`;
  k += `<rect x="${-W / 2}" y="-4" width="${W}" height="4" fill="#3a3e44"/>`;
  k += `<rect x="${-W / 2}" y="${top + 2.2}" width="${W}" height="2.4" fill="${S.lg("lichtk", [[0, "#000", 0.12], [1, "#000", 0]])}"/>`;
  /* Bildschirm des Beraters (Rückseite) rechts */
  k += `<rect x="${W / 2 - 18}" y="${top - 1.6}" width="10" height="1.4" rx=".4" fill="#9aa2a8"/><rect x="${W / 2 - 13.8}" y="${top - 7}" width="1.6" height="5.6" fill="#9aa2a8"/><path d="M${W / 2 - 22} ${top - 20} L${W / 2 - 4} ${top - 20} L${W / 2 - 4.6} ${top - 6.4} L${W / 2 - 21.4} ${top - 6.4} Z" fill="${S.lg("mrueck", [[0, "#3a3e44"], [1, "#24272b"]])}"/><circle cx="${W / 2 - 13}" cy="${top - 13}" r="1.4" fill="#4a4e54"/>`;
  const oben = top - 1.6;
  const unter = [];
  /* Vertrag mit Kugelschreiber */
  {
    const x = -W / 2 + 14;
    k += `<path d="M${x - 7} ${oben + 1} L${x + 6} ${oben + 1} L${x + 5.4} ${oben - 2.2} L${x - 6.2} ${oben - 2.2} Z" fill="#fbfbf8" stroke="#cfd3d6" stroke-width=".15"/><path d="M${x - 6.6} ${oben + 0.6} L${x + 5.6} ${oben + 0.6} L${x + 5} ${oben - 1.8} L${x - 5.8} ${oben - 1.8} Z" fill="#ffffff"/>`;
    for (let i = 0; i < 3; i++) k += `<line x1="${x - 5}" y1="${r(oben - 1.2 + i * 0.6)}" x2="${x + 3.4}" y2="${r(oben - 1.2 + i * 0.6)}" stroke="#9aa2a8" stroke-width=".18"/>`;
    k += `<path d="M${x - 4.4} ${oben - 1.6} l2 -.2" stroke="${AKZENT}" stroke-width=".4"/><path d="M${x + 1} ${oben + 0.2} L${x + 8} ${oben - 1.6}" stroke="#1f2a44" stroke-width=".7" stroke-linecap="round"/>`;
    k += `<text x="${x}" y="${oben - 3}" font-size="1.4" text-anchor="middle" fill="#14232a" font-family="Arial" opacity="0">.</text>`;
    unter.push({ id: "ha_vertrag", de: "der Vertrag", syl: "Ver-TRAG", it: "il contratto", itSyl: "con-TRAT-to", en: "contract", x: cx + x, y: Y + oben, kunst: flaeche(-7.4, -6, 14.8, 7.4),
      tipp: "Vor dem Unterschreiben: Laufzeit, Kündigungsfrist und Grundgebühr lesen." });
  }
  /* Ausweis */
  {
    const x = -W / 2 + 30;
    k += `<path d="M${x - 4} ${oben + 0.8} L${x + 4} ${oben + 0.8} L${x + 3.6} ${oben - 1.6} L${x - 3.6} ${oben - 1.6} Z" fill="${S.lg("ausweis", [[0, "#d9e6d2"], [1, "#b9d0c4"]], 0, 0, 1, 0)}"/><rect x="${x - 3.2}" y="${oben - 1.3}" width="1.8" height="1.6" fill="#8b6f5a"/><line x1="${x - 0.8}" y1="${oben - 0.8}" x2="${x + 3}" y2="${oben - 0.8}" stroke="#55606a" stroke-width=".2"/><line x1="${x - 0.8}" y1="${oben - 0.1}" x2="${x + 2.4}" y2="${oben - 0.1}" stroke="#55606a" stroke-width=".2"/>`;
    unter.push({ id: "ha_ausweis", de: "der Ausweis", syl: "AUS-weis", it: "il documento", itSyl: "do-cu-MEN-to", en: "ID card", x: cx + x, y: Y + oben, kunst: flaeche(-6.4, -6, 12.8, 7.4),
      tipp: "Ohne Ausweis geht gar nichts — auch nicht bei Prepaid." });
  }
  /* SIM-Karte im Träger */
  {
    const x = -W / 2 + 44;
    k += `<rect x="${x - 3.4}" y="${oben - 4.6}" width="6.8" height="4.4" rx=".4" fill="#ffffff" stroke="#c9ced2" stroke-width=".2" transform="rotate(-6 ${x} ${oben - 2})"/><rect x="${x - 2.2}" y="${oben - 4}" width="2.4" height="3" rx=".3" fill="${AKZENT}" transform="rotate(-6 ${x} ${oben - 2})"/><rect x="${x - 1.6}" y="${oben - 3.4}" width="1.2" height="1.4" rx=".2" fill="#e5c76b" transform="rotate(-6 ${x} ${oben - 2})"/>`;
    unter.push({ id: "ha_sim", de: "die SIM-Karte", syl: "SIM-Kar-te", it: "la scheda SIM", itSyl: "SCHE-da SIM", en: "SIM card", x: cx + x, y: Y + oben, kunst: flaeche(-6.4, -7, 12.8, 8.4),
      tipp: "Ohne Ausweis gibt es keine: die Karte muss auf einen Namen angemeldet werden." });
  }
  /* Kartenterminal */
  {
    const x = -W / 2 + 58;
    k += `<path d="M${x - 2.4} ${oben + 0.6} L${x + 2.4} ${oben + 0.6} L${x + 2.8} ${oben - 8} Q${x + 2.8} ${oben - 9} ${x + 1.8} ${oben - 9} L${x - 1.8} ${oben - 9} Q${x - 2.8} ${oben - 9} ${x - 2.8} ${oben - 8} Z" fill="#2a2e33"/><rect x="${x - 2}" y="${oben - 8.2}" width="4" height="2.6" rx=".3" fill="#9cd3e8"/>`;
    for (let i = 0; i < 9; i++) k += `<rect x="${r(x - 1.8 + (i % 3) * 1.3)}" y="${r(oben - 4.8 + Math.floor(i / 3) * 1.1)}" width=".9" height=".7" rx=".15" fill="${i === 6 ? "#d23b30" : i === 8 ? "#3ca35a" : "#596068"}"/>`;
    unter.push({ id: "ha_kartenterminal", de: "das Kartenterminal", syl: "KAR-ten-ter-mi-nal", it: "il terminale POS", itSyl: "ter-mi-NA-le POS", en: "card terminal", x: cx + x, y: Y + oben, kunst: flaeche(-6.4, -10.4, 12.8, 11.8) });
  }
  S.teil({ id: "ha_theke", de: "die Theke", syl: "THE-ke", it: "il bancone", itSyl: "ban-CO-ne", en: "counter", x: cx, y: Y, steht: true, kunst: k,
    zoom: { x: X0 + 1, y: Y + top - 26, w: 69, h: 46 }, unter,
    tipp: "Hier wird beraten, unterschrieben und die Karte eingesteckt." });
}

/* =====================================================================
   DER PRÄSENTATIONSTISCH — Lupe: Handy, Tablet, Router, Preisschild
   ===================================================================== */
{
  const X0 = 96, X1 = 206, Y = 174, top = -56, W = X1 - X0, cx = (X0 + X1) / 2;
  let k = schatten(0, 0, W / 2 + 2, 2.4, 0.32);
  /* Korpus weiß, Sockel dunkel, Platte Eiche mit Kabelkanal */
  k += `<rect x="${-W / 2 + 4}" y="${top + 3}" width="${W - 8}" height="${-top - 3}" fill="${WEISS}"/><rect x="${-W / 2 + 4}" y="-3" width="${W - 8}" height="3" fill="#3a3e44"/>`;
  k += `<rect x="${-W / 2 + 4}" y="${top + 3}" width="${W - 8}" height="3" fill="#000" opacity=".1"/>`;
  k += `<rect x="${-W / 2 + 8}" y="${top + 16}" width="${W - 16}" height="22" rx="1" fill="none" stroke="#dcdfe1" stroke-width=".5"/><text x="0" y="${top + 29.4}" font-size="4.6" text-anchor="middle" fill="${AKZENT}" font-family="Arial,sans-serif" font-weight="bold" letter-spacing=".4">Einfach ausprobieren!</text>`;
  k += `<path d="M${-W / 2 + 3} ${top - 6} L${W / 2 - 3} ${top - 6} L${W / 2} ${top + 0.4} L${-W / 2} ${top + 0.4} Z" fill="${S.lg("tplatte", [[0, "#c9a97b"], [1, "#dcc195"]])}"/>`;
  k += `<rect x="${-W / 2}" y="${top + 0.4}" width="${W}" height="2.6" fill="${HOLZ}"/>`;
  const auf = top - 2;
  const unter = [];
  /* Halter mit Sicherungskabel, darauf ein Gerät (leicht schräg) */
  const halter = (x, w, h, schirm, rahmen) => {
    let g = `<path d="M${r(x)} ${auf} q-1 3 -4 3.4 q-4 .6 -6 3" stroke="#2a2d31" stroke-width=".45" fill="none" opacity=".8"/>`;
    g += `<rect x="${r(x - 2.2)}" y="${auf - 1.4}" width="4.4" height="1.6" rx=".5" fill="#2a2d31"/><rect x="${r(x - 0.5)}" y="${auf - 4}" width="1" height="2.8" fill="#3a3e44"/>`;
    g += phone(x, auf - 3.6, w, h, schirm, rahmen);
    return g;
  };
  /* drei Smartphones */
  [[-44, 0, "#1d1f23"], [-34, 1, "#c9ccd0"], [-24, 2, "#1d1f23"]].forEach(([x, s, f]) => { k += halter(x, 6.4, 12.4, SCHIRME[s], f); });
  unter.push({ id: "ha_handy", de: "das Handy", syl: "HAN-dy", it: "il cellulare", itSyl: "cel-lu-LA-re", en: "mobile phone", x: cx - 34, y: Y + auf, kunst: flaeche(-14.6, -18, 29.2, 18.4),
    tipp: "In Deutschland sagt man „Handy“ — auf Englisch heißt das ganz anders." });
  /* Tablet (quer) */
  {
    const x = -4;
    k += `<rect x="${r(x - 2.6)}" y="${auf - 1.4}" width="5.2" height="1.6" rx=".5" fill="#2a2d31"/><rect x="${r(x - 0.6)}" y="${auf - 4}" width="1.2" height="2.8" fill="#3a3e44"/>`;
    k += `<rect x="${x - 10}" y="${auf - 17}" width="20" height="13.6" rx="1.4" fill="#1d1f23"/><rect x="${x - 9.3}" y="${auf - 16.3}" width="18.6" height="12.2" rx=".9" fill="${SCHIRME[3]}"/>`;
    for (let i = 0; i < 8; i++) k += `<rect x="${r(x - 7.6 + (i % 4) * 4.2)}" y="${r(auf - 14.6 + Math.floor(i / 4) * 4)}" width="2.6" height="2.6" rx=".7" fill="#fff" opacity=".85"/>`;
    k += `<path d="M${x - 9} ${auf - 6} L${x + 4} ${auf - 16} L${x + 8} ${auf - 16} L${x - 5} ${auf - 4.6} Z" fill="#fff" opacity=".12"/>`;
    unter.push({ id: "ha_tablet", de: "das Tablet", syl: "TAB-let", it: "il tablet", itSyl: "TA-blet", en: "tablet", x: cx + x, y: Y + auf, kunst: flaeche(-11, -18, 22, 18.4) });
  }
  /* Router mit Antennen */
  {
    const x = 26;
    k += `<path d="M${x - 9} ${auf} L${x + 9} ${auf} L${x + 8} ${auf - 9} L${x - 8} ${auf - 9} Z" fill="${S.lg("router", [[0, "#ffffff"], [1, "#d9dcde"]], 0, 0, 1, 0)}"/>`;
    for (const dx of [-6, 6]) k += `<rect x="${x + dx - 0.7}" y="${auf - 17}" width="1.4" height="8.4" rx=".7" fill="#e9ebec" stroke="#c3c9ce" stroke-width=".2"/>`;
    for (let i = 0; i < 5; i++) k += `<circle cx="${r(x - 5 + i * 2.5)}" cy="${auf - 4}" r=".5" fill="${i < 4 ? "#5fd38a" : "#f2c94c"}"/>`;
    k += `<text x="${x}" y="${auf - 6.2}" font-size="1.7" text-anchor="middle" fill="#55606a" font-family="Arial">WLAN</text>`;
    unter.push({ id: "ha_router", de: "der Router", syl: "ROU-ter", it: "il router", itSyl: "ROU-ter", en: "router", x: cx + x, y: Y + auf, kunst: flaeche(-10, -18, 20, 18.4),
      tipp: "Für das Internet in der Wohnung. Meistens dauert der Anschluss zwei bis vier Wochen." });
  }
  /* Preisschilder an der Vorderkante */
  {
    const tags = [[-44, "899 €"], [-34, "649 €"], [-24, "1099 €"], [-4, "449 €"], [26, "199 €"]];
    for (const [x, p] of tags) k += `<rect x="${x - 4}" y="${top + 0.6}" width="8" height="2.2" rx=".3" fill="#fff" stroke="#c9ced2" stroke-width=".15"/><text x="${x}" y="${top + 2.3}" font-size="1.6" text-anchor="middle" fill="#14232a" font-family="Arial" font-weight="bold">${p}</text>`;
    unter.push({ id: "ha_preisschild", de: "das Preisschild", syl: "PREIS-schild", it: "il cartellino del prezzo", itSyl: "car-tel-LI-no del PREZ-zo", en: "price tag", x: cx, y: Y + top + 3.4, kunst: flaeche(-W / 2 + 2, -3, W - 4, 4.2) });
  }
  S.teil({ id: "ha_tisch", de: "der Präsentationstisch", syl: "prä-sen-ta-TI-ons-tisch", it: "il tavolo espositivo", itSyl: "TA-vo-lo e-spo-si-TI-vo", en: "display table", x: cx, y: Y, steht: true, kunst: k,
    zoom: { x: cx - 52, y: Y + top - 26, w: 99, h: 33 + 33 }, unter,
    tipp: "Jedes Gerät hängt an einem Kabel: Es lädt und ist gegen Diebstahl gesichert." });
}

/* =====================================================================
   DIE KUNDIN — an der Ecke der Theke, wendet sich dem Berater zu
   ===================================================================== */
{
  const m = B.mensch({ id: "b04c_kundin", geschlecht: "w", pose: "halten", blick: 62, frisur: "lang", haarfarbe: "hellbraun", haut: "hell",
    kleidung: { oberteil: { stueck: "pullover", farbe: "gelb" }, unterteil: { stueck: "jeans" }, jacke: { stueck: "jacke", farbe: "#3c4a5c" }, schuhe: { stueck: "turnschuh" }, zubehoer: { stueck: "tasche", farbe: "braun" } } }, 102);
  S.teil({ id: "ha_kundin", de: "die Kundin", syl: "KUN-din", it: "la cliente", itSyl: "cli-EN-te", en: "customer", x: 214, y: 190, kunst: m.svg,
    tipp: "Sie braucht eine deutsche Nummer, um überhaupt einen Termin beim Amt machen zu können." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/handyladen.js"));
console.log(aus);
