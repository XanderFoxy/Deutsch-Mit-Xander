#!/usr/bin/env node
/* =====================================================================
   TECHNIK & ENERGIE (FASSUNG 852) — Bilderwelt neu: der Elektronikmarkt
   ---------------------------------------------------------------------
   Früher eine Sammlung von Kacheln, jetzt ein echter Ort, an dem all diese
   Dinge wirklich nebeneinander vorkommen: die Abteilung eines deutschen
   Elektronikmarkts.

   RECHERCHE (Ladenbau Elektronikmarkt, z. B. TV-Wand-Projekte großer
   Elektronikketten, Diebstahlsicherung für Vorführgeräte):
   - Die TV-WAND: dunkle Präsentationswand, oben die großen, unten die
     kleineren Fernseher, alle zeigen dasselbe leuchtende Naturvideo; unter
     jedem Gerät Preisschild und das farbige EU-Energielabel. Davor ein
     schwarzes Podest (Lowboard) mit Soundbar und Fernbedienung zum
     Ausprobieren.
   - Der PRÄSENTATIONSTISCH in der Mitte: Laptops, Tablet und Smartphones
     sind eingeschaltet, stehen auf Sicherungs-Haltern und hängen an
     Spiralkabeln (Diebstahlsicherung, lädt zugleich den Akku).
   - Die ZUBEHÖRWAND (Lochwand mit Haken): Ladegeräte, Kabel, Powerbanks,
     Batterien, Taschenlampen, LED-Lampen in Blisterpackungen.
   - Ein REGAL „Computer & Gaming“ mit Router, Kamera, Spielkonsole, Drucker.
   - Große Party-Lautsprecher stehen auf dem Boden; die Stromversorgung
     kommt aus Steckdosen an Säulen und Wänden.
   - Schwarze, offene Decke mit Stromschienen-Strahlern, hängende
     Abteilungsschilder, hellgrauer Fliesenboden.
   Maßstab: Rückwand ≈ 40 Einheiten je Meter (Wand 3 m), Augenhöhe 1,6 m
   → Horizont y = 68; Tisch vorn ≈ 57 je Meter, Säule ≈ 74 je Meter.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "technik", titel: "Technik & Energie", emoji: "🔌", thema: "Technik", kuerzel: "b26a", fassung: 852 });
const rnd = zufall(4711);
const r = B.r;

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const WAND = S.lg("wand", [[0, "#e9ecef"], [1, "#d9dde1"]]);
const DECKE = S.lg("decke", [[0, "#1d1f23"], [1, "#2b2e33"]]);
const SCHWARZ = S.lg("schwarz", [[0, "#3a3e44"], [0.5, "#24272b"], [1, "#16181b"]]);
const ALU = S.lg("alu", [[0, "#f2f4f6"], [0.45, "#cfd4d9"], [0.55, "#bcc3c9"], [1, "#e4e8eb"]], 0, 0, 1, 0);
const WEISS = S.lg("weiss", [[0, "#ffffff"], [1, "#e7e9ec"]]);
const ROT = "#d7262e";
const HORIZONT = 68, WAND_UNTEN = 132;

/* Fernsehbild (ein Bergsee) als Symbol: alle Fernseher zeigen dasselbe Video */
S.def(`<symbol id="${S.id("tvbild")}" viewBox="0 0 160 90" preserveAspectRatio="none">
<rect width="160" height="90" fill="${S.lg("tvhimmel", [[0, "#2f7fd0"], [0.6, "#8cc6f0"], [1, "#f6d9a8"]])}"/>
<circle cx="118" cy="30" r="9" fill="#fff4c9"/><circle cx="118" cy="30" r="20" fill="#fff4c9" opacity=".25"/>
<path d="M0 56 L22 30 L34 40 L56 14 L78 44 L92 34 L112 52 L130 36 L160 54 L160 60 L0 60 Z" fill="#4c6a86"/>
<path d="M56 14 L50 22 L56 20 L62 24 Z M22 30 L18 35 L24 34 Z M130 36 L126 41 L134 40 Z" fill="#ffffff"/>
<path d="M0 58 L30 46 L60 54 L96 44 L130 52 L160 48 L160 62 L0 62 Z" fill="#2f6b3c"/>
<rect y="60" width="160" height="30" fill="${S.lg("tvsee", [[0, "#3b8fb9"], [1, "#1d4f78"]])}"/>
<path d="M0 60 L22 76 L34 70 L56 86 L78 66 L92 72 L112 62 L130 70 L160 61 Z" fill="#41617c" opacity=".55"/>
<path d="M10 70 h30 M70 76 h40 M120 82 h28" stroke="#cfe8f6" stroke-width="1.2" opacity=".6"/>
</symbol>`);

/* =====================================================================
   KULISSE — Decke, Rückwand, Boden in Fluchtperspektive, Säule vorn links
   ===================================================================== */
S.hinten(`<rect x="0" y="0" width="320" height="16" fill="${DECKE}"/>`);
{
  let d = "";
  /* Stromschienen mit Strahlern, Lichtkegel auf die Wand */
  d += `<rect x="0" y="5" width="320" height="1" fill="#0d0e10"/>`;
  for (const x of [20, 70, 120, 170, 220, 270, 305]) {
    d += `<rect x="${x - 1.4}" y="5.6" width="2.8" height="3.6" rx=".6" fill="#3c4046"/><ellipse cx="${x}" cy="9.4" rx="1.6" ry=".6" fill="#fff8e3"/>`;
  }
  S.hinten(d);
}
S.hinten(`<rect x="0" y="16" width="320" height="${WAND_UNTEN - 16}" fill="${WAND}"/>`);
S.hinten(`<rect x="0" y="16" width="320" height="${WAND_UNTEN - 16}" fill="${S.rg("wandlicht", [[0, "#ffffff", 0.55], [1, "#ffffff", 0]], 0.5, 0.05, 0.7)}"/>`);
{
  let k = "";
  for (const x of [20, 70, 120, 170, 220, 270, 305]) k += `<path d="M${x - 2} 10 L${x - 16} 60 L${x + 16} 60 L${x + 2} 10 Z" fill="#fffbe9" opacity=".12"/>`;
  /* Sockelleiste */
  k += `<rect x="0" y="${WAND_UNTEN - 3}" width="320" height="3" fill="#9aa1a8"/>`;
  S.hinten(k);
}
/* Boden: große hellgraue Fliesen, Fugen laufen zum Fluchtpunkt (160|68) */
{
  let f = `<rect x="0" y="${WAND_UNTEN}" width="320" height="${200 - WAND_UNTEN}" fill="${S.lg("boden", [[0, "#c3c7cb"], [1, "#a9aeb3"]])}"/>`;
  for (let i = -8; i <= 8; i++) {
    const xw = 160 + i * 24;                       // Fuge an der Wand
    const t = (200 - HORIZONT) / (WAND_UNTEN - HORIZONT);
    f += `<line x1="${xw}" y1="${WAND_UNTEN}" x2="${r(160 + (xw - 160) * t)}" y2="200" stroke="#8e949a" stroke-width=".35" opacity=".7"/>`;
  }
  /* Querfugen: Abstand wächst nach vorne (je 0,6 m Tiefe) */
  for (const d of [10.6, 11.2, 11.8, 12.4, 13.0, 13.6, 14.2, 14.8, 15.4, 16]) {
    const yy = HORIZONT + (WAND_UNTEN - HORIZONT) * 10 / (10 - (d - 10) * 0.55 * 1.6);
    if (yy < 200) f += `<line x1="0" y1="${r(yy)}" x2="320" y2="${r(yy)}" stroke="#8e949a" stroke-width=".35" opacity=".6"/>`;
  }
  f += `<rect x="0" y="${WAND_UNTEN}" width="320" height="${200 - WAND_UNTEN}" fill="${S.lg("bodenglanz", [[0, "#ffffff", 0.0], [0.5, "#ffffff", 0.12], [1, "#ffffff", 0]], 0, 0, 1, 0)}"/>`;
  /* Spiegelung der TV-Wand im glänzenden Boden */
  f += `<rect x="30" y="${WAND_UNTEN + 1}" width="104" height="10" fill="#3a6f9a" opacity=".07"/>`;
  S.hinten(f);
}
/* hängende Abteilungsschilder */
{
  let k = "";
  const schild = (x, w, txt) => {
    k += `<line x1="${x - w / 2 + 4}" y1="0" x2="${x - w / 2 + 4}" y2="17" stroke="#555" stroke-width=".3"/><line x1="${x + w / 2 - 4}" y1="0" x2="${x + w / 2 - 4}" y2="17" stroke="#555" stroke-width=".3"/>`;
    k += `<rect x="${x - w / 2}" y="17" width="${w}" height="7.4" rx="1" fill="${ROT}"/><rect x="${x - w / 2}" y="17" width="${w}" height="1.2" rx=".6" fill="#ff6a6a" opacity=".5"/>`;
    k += `<text x="${x}" y="22.6" font-size="4.2" text-anchor="middle" fill="#fff" font-family="Arial,Helvetica,sans-serif" font-weight="bold" letter-spacing=".3">${txt}</text>`;
  };
  schild(186, 40, "ZUBEHÖR");
  schild(275, 56, "COMPUTER &amp; GAMING");
  S.hinten(k);
}
/* Säule vorne links (Fuß bei y 186, ≈ 74 Einheiten je Meter) */
S.hinten(`<rect x="0" y="0" width="22" height="187" fill="${S.lg("saeule", [[0, "#d5d9dd"], [0.7, "#eef0f2"], [1, "#c4c9ce"]], 0, 0, 1, 0)}"/>
<rect x="20.6" y="0" width="1.4" height="187" fill="#aab0b6"/><rect x="0" y="180" width="22" height="7" fill="#8f969c"/>
<ellipse cx="11" cy="187" rx="16" ry="1.6" fill="#000" opacity=".12"/>`);
/* Lowboard unter der TV-Wand mit Soundbar */
S.hinten(`<rect x="30" y="110" width="104" height="22" fill="${SCHWARZ}"/><rect x="30" y="109" width="104" height="2" rx=".6" fill="#4b5057"/>
<rect x="30" y="129" width="104" height="3" fill="#0c0d0f"/>
<rect x="56" y="105.8" width="42" height="3.4" rx="1.6" fill="${S.lg("soundbar", [[0, "#4a4e55"], [1, "#1c1e21"]])}"/>
<rect x="57" y="106.6" width="40" height="1.6" rx=".8" fill="#2a2d31"/><circle cx="77" cy="107.4" r=".4" fill="#ffffff" opacity=".6"/>
<text x="82" y="122" font-size="3" text-anchor="middle" fill="#9aa1a8" font-family="Arial" letter-spacing=".8">TV · SOUND · HEIMKINO</text>`);

/* =====================================================================
   1 — DER FERNSEHER (die TV-Wand, alle Geräte zeigen das gleiche Video)
   ===================================================================== */
{
  let k = `<rect x="-54" y="-80" width="108" height="80" rx="1" fill="${S.lg("tvwand", [[0, "#34383e"], [1, "#22252a"]])}"/>`;
  k += `<rect x="-54" y="-80" width="108" height="9" fill="#1b1d21"/><text x="0" y="-73.6" font-size="4.6" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold" letter-spacing=".6">TV &amp; AUDIO</text>`;
  const tv = (x, y, w, h, preis, kl, kf) => {
    let g = `<rect x="${x - 0.7}" y="${y - 0.7}" width="${w + 1.4}" height="${h + 1.4}" rx=".6" fill="#0b0b0c"/>`;
    g += `<use href="#${S.id("tvbild")}" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
    g += `<path d="M${x} ${y} L${x + w * 0.35} ${y} L${x} ${y + h * 0.6} Z" fill="#fff" opacity=".1"/>`;
    /* Preisschild und Energielabel darunter */
    g += `<rect x="${r(x + w / 2 - 6.5)}" y="${r(y + h + 1.6)}" width="9" height="4" rx=".3" fill="#fff"/><text x="${r(x + w / 2 - 2)}" y="${r(y + h + 4.6)}" font-size="2.6" text-anchor="middle" fill="${ROT}" font-family="Arial" font-weight="bold">${preis}</text>`;
    g += `<path d="M${r(x + w / 2 + 3.4)} ${r(y + h + 1.6)} h3.2 l1.2 2 l-1.2 2 h-3.2 Z" fill="${kf}"/><text x="${r(x + w / 2 + 5)}" y="${r(y + h + 4.6)}" font-size="2.4" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">${kl}</text>`;
    return g;
  };
  k += tv(-52, -68, 50, 28, "1299 €", "E", "#f2c21b");
  k += tv(2, -68, 50, 28, "1599 €", "F", "#f08a1d");
  k += tv(-52, -32, 32, 18, "499 €", "E", "#f2c21b");
  k += tv(-16, -32, 32, 18, "549 €", "D", "#c4d52a");
  k += tv(20, -32, 32, 18, "429 €", "F", "#f08a1d");
  S.teil({ id: "fernseher", de: "der Fernseher", syl: "FERN-se-her", it: "il televisore", itSyl: "te-le-vi-SO-re", en: "television", x: 82, y: 102, kunst: k,
    tipp: "An der TV-Wand zeigen alle Fernseher dasselbe Bild – so kann man sie gut vergleichen." });
}

/* =====================================================================
   2 — DIE FERNBEDIENUNG (auf einem kleinen Acrylständer auf dem Lowboard)
   ===================================================================== */
{
  let k = schatten(0, 0, 4, .6, .3);
  k += `<path d="M-3.4 0 L3.4 0 L2.6 -1.4 L-2.6 -1.4 Z" fill="#dfe9ee" opacity=".7"/>`;
  k += `<g transform="rotate(-14)"><rect x="-1.6" y="-11" width="3.2" height="10" rx="1.2" fill="${S.lg("fb", [[0, "#4b5058"], [1, "#1f2226"]], 0, 0, 1, 0)}"/>`;
  k += `<circle cx="0" cy="-9.4" r=".5" fill="${ROT}"/><circle cx="0" cy="-6.6" r="1" fill="#5b6169"/><circle cx="0" cy="-6.6" r=".45" fill="#2a2d31"/>`;
  for (let i = 0; i < 6; i++) k += `<rect x="${-1.1 + (i % 2) * 1.4}" y="${-4.8 + Math.floor(i / 2) * 1.1}" width=".8" height=".6" rx=".2" fill="#8a9098"/>`;
  k += `<rect x="-1.4" y="-10.8" width=".6" height="9.4" rx=".3" fill="#fff" opacity=".18"/></g>`;
  S.teil({ oben: true, id: "fernbedienung", de: "die Fernbedienung", syl: "FERN-be-die-nung", it: "il telecomando", itSyl: "te-le-co-MAN-do", en: "remote control", x: 122, y: 109.4, steht: true, kunst: k });
}

/* =====================================================================
   3 — DIE STECKDOSE an der Säule und 4 — DER STECKER darin
   ===================================================================== */
const DOSE = { x: 11, y: 104 };
{
  let k = `<rect x="-8.6" y="-4.4" width="17.2" height="8.8" rx="1.4" fill="${WEISS}" stroke="#c3c8cd" stroke-width=".3"/>`;
  for (const dx of [-4.2, 4.2]) {
    k += `<circle cx="${dx}" cy="0" r="3.3" fill="#eef0f2" stroke="#cdd2d6" stroke-width=".3"/><circle cx="${dx}" cy="0" r="2.5" fill="${S.rg("dosentopf", [[0, "#d2d6da"], [1, "#f4f5f6"]])}"/>`;
    k += `<rect x="${dx - 0.4}" y="-3.1" width=".8" height=".9" fill="#b9bfc5"/><rect x="${dx - 0.4}" y="2.2" width=".8" height=".9" fill="#b9bfc5"/>`;
  }
  k += `<circle cx="2.8" cy="-.2" r=".55" fill="#3a3d42"/><circle cx="5.6" cy="-.2" r=".55" fill="#3a3d42"/>`;   // rechte Dose ist frei
  k += `<rect x="-8" y="-4" width="16" height="1.2" rx=".6" fill="#fff" opacity=".7"/>`;
  S.teil({ id: "steckdose", de: "die Steckdose", syl: "STECK-do-se", it: "la presa", itSyl: "PRE-sa", en: "socket", x: DOSE.x, y: DOSE.y, kunst: k,
    tipp: "In Deutschland hat die Steckdose 230 Volt." });
}
{
  /* Schuko-Stecker steckt links, Kabel läuft zum Lautsprecher hinunter */
  let k = `<path d="M-4.2 2.6 C-4.6 10 -3 22 -1 34 C1 50 10 70 22 80" stroke="#1d1f22" stroke-width="1.1" fill="none" stroke-linecap="round"/>`;
  k += `<circle cx="-4.2" cy="0" r="2.7" fill="${S.rg("steckerk", [[0, "#4a4e55"], [1, "#16181b"]], 0.4, 0.35, 0.7)}"/>`;
  k += `<rect x="-5.4" y="1.4" width="2.4" height="2.8" rx=".8" fill="#24272b"/>`;
  k += `<circle cx="-5" cy="-.8" r=".7" fill="#fff" opacity=".25"/>`;
  S.teil({ oben: true, id: "stecker", de: "der Stecker", syl: "STE-cker", it: "la spina", itSyl: "SPI-na", en: "plug", x: DOSE.x, y: DOSE.y, kunst: k + flaeche(-7.5, -3.4, 7, 9) });
}

/* =====================================================================
   5 — DAS ZUBEHÖR (Lochwand) mit Lupe: Ladegerät, Kabel, Akku, Batterie,
       Taschenlampe, Glühbirne
   ===================================================================== */
const ZW = { x0: 142, x1: 230, y0: 30, y1: 132 };
{
  const W = ZW.x1 - ZW.x0, H = ZW.y1 - ZW.y0, cx = (ZW.x0 + ZW.x1) / 2;
  const top = -H;            // Wandoberkante relativ zum Fußpunkt
  let k = `<rect x="${-W / 2}" y="${top}" width="${W}" height="68" rx=".8" fill="${S.lg("lochwand", [[0, "#f7f8f9"], [1, "#e2e5e8"]])}"/>`;
  /* Lochraster als Muster */
  S.def(`<pattern id="${S.id("loch")}" width="2.4" height="2.4" patternUnits="userSpaceOnUse"><circle cx="1.2" cy="1.2" r=".28" fill="#b8bec4"/></pattern>`);
  k += `<rect x="${-W / 2}" y="${top}" width="${W}" height="68" fill="url(#${S.id("loch")})"/>`;
  k += `<rect x="${-W / 2 - 1}" y="${top - 1}" width="${W + 2}" height="2" fill="#9ca3aa"/><rect x="${-W / 2 - 1}" y="${top + 67}" width="${W + 2}" height="2" fill="#9ca3aa"/>`;
  /* Unterschrank mit Schubladen */
  k += `<rect x="${-W / 2}" y="${top + 69}" width="${W}" height="${H - 69}" fill="${S.lg("unterschr", [[0, "#ffffff"], [1, "#dfe2e6"]])}"/>`;
  for (let i = 0; i < 3; i++) k += `<rect x="${r(-W / 2 + 2 + i * (W - 4) / 3)}" y="${top + 72}" width="${r((W - 4) / 3 - 2)}" height="12" rx=".8" fill="none" stroke="#c4c9ce" stroke-width=".4"/><rect x="${r(-W / 2 + 2 + i * (W - 4) / 3 + (W - 4) / 6 - 5)}" y="${top + 77}" width="8" height="1.2" rx=".6" fill="#9ca3aa"/>`;

  /* Blister an Haken: (x, y) = Hakenpunkt relativ zum Fußpunkt */
  const haken = (x, y) => `<line x1="${r(x)}" y1="${r(y)}" x2="${r(x)}" y2="${r(y + 2.2)}" stroke="#7d858c" stroke-width=".5"/><rect x="${r(x - 2.4)}" y="${r(y + 4)}" width="4.8" height="1.6" rx=".3" fill="#fff" stroke="#c9ced3" stroke-width=".15"/>`;
  const blister = (x, y, w, h, karte, innen, preis) => {
    let g = haken(x, y - 4.6 - h);
    g += `<rect x="${r(x - w / 2)}" y="${r(y - h - 2.4)}" width="${w}" height="${r(h + 2.4)}" rx=".8" fill="${karte}"/>`;
    g += `<rect x="${r(x - 1.2)}" y="${r(y - h - 1.6)}" width="2.4" height="1" rx=".5" fill="#fff" opacity=".8"/>`;
    g += innen;
    g += `<rect x="${r(x - w / 2 + 1)}" y="${r(y - h)}" width="${w - 2}" height="${r(h - 1)}" rx="1.2" fill="#fff" opacity=".18"/>`;
    g += `<rect x="${r(x - 3.4)}" y="${r(y + 0.6)}" width="6.8" height="2.6" rx=".3" fill="#fffbe0"/><text x="${r(x)}" y="${r(y + 2.5)}" font-size="1.9" text-anchor="middle" fill="${ROT}" font-family="Arial" font-weight="bold">${preis}</text>`;
    return g;
  };
  const unter = [];
  const plaetze = [
    /* Reihe 1 */
    { id: "ladegeraet", x: -32, y: top + 26, w: 14, h: 16, karte: "#1f6fb2", preis: "19,99",
      innen: (x, y) => `<rect x="${x - 3.6}" y="${y - 12}" width="7.2" height="7.8" rx="1.2" fill="${WEISS}"/><rect x="${x - 2}" y="${y - 15}" width="1" height="3.2" fill="#c7ccd1"/><rect x="${x + 1}" y="${y - 15}" width="1" height="3.2" fill="#c7ccd1"/><rect x="${x - 1.4}" y="${y - 6.8}" width="2.8" height="1" rx=".3" fill="#5d646b"/><text x="${x}" y="${y - 1.4}" font-size="2" text-anchor="middle" fill="#fff" font-family="Arial">USB-C 20W</text>`,
      de: "das Ladegerät", syl: "LA-de-ge-rät", it: "il caricabatterie", itSyl: "ca-ri-ca-bat-te-RI-e", en: "charger", tipp: "Mit dem Ladegerät lädt man das Handy auf." },
    { id: "kabel", x: -10, y: top + 26, w: 14, h: 16, karte: "#2b2f35", preis: "12,99",
      innen: (x, y) => `<ellipse cx="${x}" cy="${y - 8}" rx="4.4" ry="4" fill="none" stroke="#f4f5f6" stroke-width="1.1"/><ellipse cx="${x}" cy="${y - 8}" rx="2.8" ry="2.5" fill="none" stroke="#e1e4e7" stroke-width="1"/><rect x="${x + 3.4}" y="${y - 4.6}" width="2" height="3" rx=".5" fill="#c7ccd1"/><text x="${x}" y="${y - 1.2}" font-size="2" text-anchor="middle" fill="#fff" font-family="Arial">2 m</text>`,
      de: "das Kabel", syl: "KA-bel", it: "il cavo", itSyl: "CA-vo", en: "cable" },
    { id: "akku", x: 12, y: top + 26, w: 14, h: 16, karte: "#0f8a5f", preis: "29,99",
      innen: (x, y) => `<rect x="${x - 3}" y="${y - 13}" width="6" height="10" rx="1.4" fill="${S.lg("powerbank", [[0, "#5a6068"], [1, "#2a2d31"]], 0, 0, 1, 0)}"/><rect x="${x - 1.6}" y="${y - 6.2}" width="3.2" height=".7" fill="#69e08a"/><rect x="${x - 1.6}" y="${y - 7.4}" width="3.2" height=".7" fill="#69e08a"/><rect x="${x - 1.6}" y="${y - 8.6}" width="3.2" height=".7" fill="#69e08a"/><text x="${x}" y="${y - 0.8}" font-size="1.8" text-anchor="middle" fill="#fff" font-family="Arial">10000 mAh</text>`,
      de: "der Akku", syl: "AK-ku", it: "la batteria", itSyl: "bat-te-RI-a", en: "battery", tipp: "Ein Akku lässt sich immer wieder aufladen – hier als Powerbank." },
    { id: "batterie", x: 33, y: top + 26, w: 13, h: 16, karte: "#f1b417", preis: "6,49",
      innen: (x, y) => [-3, -1, 1, 3].map((d) => `<rect x="${x + d - 0.8}" y="${y - 13}" width="1.6" height="9" rx=".5" fill="${S.lg("zelle", [[0, "#2b2b2b"], [0.5, "#5a5a5a"], [1, "#1a1a1a"]], 0, 0, 1, 0)}"/><rect x="${x + d - 0.8}" y="${y - 7}" width="1.6" height="3" fill="#c9862a"/><rect x="${x + d - 0.3}" y="${y - 13.6}" width=".6" height=".7" fill="#c7ccd1"/>`).join("") + `<text x="${x}" y="${y - 1}" font-size="2.2" text-anchor="middle" fill="#2b2b2b" font-family="Arial" font-weight="bold">AA</text>`,
      de: "die Batterie", syl: "Bat-te-RIE", it: "la pila", itSyl: "PI-la", en: "battery cell", tipp: "Leere Batterien gehören nicht in den Hausmüll, sondern in die Sammelbox." },
    /* Reihe 2 */
    { id: "taschenlampe", x: -24, y: top + 52, w: 16, h: 16, karte: "#33373d", preis: "14,99",
      innen: (x, y) => `<g transform="rotate(-30 ${x} ${y - 8})"><rect x="${x - 1.6}" y="${y - 14}" width="3.2" height="11" rx=".8" fill="${ALU}"/><path d="M${x - 2.6} ${y - 3} L${x + 2.6} ${y - 3} L${x + 2} ${y - 5.4} L${x - 2} ${y - 5.4} Z" fill="#9aa2a9"/><ellipse cx="${x}" cy="${y - 2.8}" rx="2.6" ry=".9" fill="#fffbe0"/><rect x="${x - .5}" y="${y - 11}" width="1" height="2" rx=".3" fill="${ROT}"/></g><path d="M${x + 3} ${y - 4} L${x + 7.6} ${y - 1.6} L${x + 7.6} ${y - 6.4} Z" fill="#fff6c0" opacity=".5"/>`,
      de: "die Taschenlampe", syl: "TA-schen-lam-pe", it: "la torcia", itSyl: "TOR-cia", en: "torch" },
    { id: "gluehbirne", x: 0, y: top + 52, w: 14, h: 16, karte: "#f4f4f2", preis: "3,99",
      innen: (x, y) => `<circle cx="${x}" cy="${y - 10}" r="3.8" fill="${S.rg("birne", [[0, "#fffbe0"], [0.7, "#fff1a8"], [1, "#e8d58a"]], 0.4, 0.35, 0.7)}" stroke="#d8c78a" stroke-width=".2"/><path d="M${x - 1.4} ${y - 6.6} L${x + 1.4} ${y - 6.6} L${x + 1.2} ${y - 4.8} L${x - 1.2} ${y - 4.8} Z" fill="#fff1a8"/><rect x="${x - 1.4}" y="${y - 4.8}" width="2.8" height="2.4" fill="${ALU}"/><path d="M${x - 1.4} ${y - 4.2} h2.8 M${x - 1.4} ${y - 3.3} h2.8" stroke="#8d959c" stroke-width=".3"/><path d="M${x - 1} ${y - 9} q1 -2 2 0" stroke="#e0a42a" stroke-width=".35" fill="none"/><text x="${x}" y="${y - 0.6}" font-size="1.8" text-anchor="middle" fill="#444" font-family="Arial">E27 · LED</text>`,
      de: "die Glühbirne", syl: "GLÜH-bir-ne", it: "la lampadina", itSyl: "lam-pa-DI-na", en: "light bulb", tipp: "Heute kauft man fast nur noch LED-Lampen – sie brauchen viel weniger Strom." },
  ];
  plaetze.forEach((p) => {
    k += blister(p.x, p.y, p.w, p.h, p.karte, p.innen(p.x, p.y), p.preis);
    unter.push({ id: p.id, de: p.de, syl: p.syl, it: p.it, itSyl: p.itSyl, en: p.en, tipp: p.tipp, x: cx + p.x, y: ZW.y1 + p.y + 3.4,
      kunst: flaeche(-p.w / 2 - 0.6, -p.h - 8.4, p.w + 1.2, p.h + 8.6) });
  });
  /* weitere Ware (ohne eigenes Wort): Kopfhörer-Kartons, Speicherkarten, Mehrfachstecker */
  k += blister(24, top + 52, 12, 14, "#7b3fa0", `<rect x="21" y="${top + 52 - 12}" width="6" height="8" rx=".6" fill="#2a2d31"/><rect x="22" y="${top + 52 - 11}" width="4" height="2.6" fill="#f1b417"/><text x="24" y="${top + 52 - 1}" font-size="1.8" text-anchor="middle" fill="#fff" font-family="Arial">128 GB</text>`, "15,99");
  k += blister(-40, top + 52, 6, 14, "#c9ced3", `<rect x="-42" y="${top + 52 - 12}" width="4" height="9" rx=".6" fill="#fff"/><circle cx="-40" cy="${top + 52 - 10}" r=".7" fill="#555"/><circle cx="-40" cy="${top + 52 - 7}" r=".7" fill="#555"/><circle cx="-40" cy="${top + 52 - 4}" r=".7" fill="#555"/>`, "9,99");
  S.teil({ id: "zubehoer", de: "das Zubehör", syl: "ZU-be-hör", it: "gli accessori", itSyl: "ac-ces-SO-ri", en: "accessories", x: cx, y: ZW.y1, steht: true, kunst: k,
    zoom: { x: ZW.x0 - 9, y: ZW.y0 - 2, w: W + 18, h: 71 },
    unter,
    tipp: "An der Zubehörwand hängen Kabel, Ladegeräte und Batterien." });
}

/* =====================================================================
   6 — DAS REGAL „Computer & Gaming“ mit Router, Kamera, Spielkonsole,
       Drucker (rechts an der Rückwand)
   ===================================================================== */
const RG = { x0: 236, x1: 316, y0: 30, y1: WAND_UNTEN };
const BRETT = [58, 88, 120];         // Oberkanten der Regalböden
{
  const W = RG.x1 - RG.x0, H = RG.y1 - RG.y0;
  let k = `<rect x="${-W / 2}" y="${-H}" width="${W}" height="${H}" fill="${S.lg("regalrueck", [[0, "#f3f4f5"], [1, "#dde0e3"]])}"/>`;
  k += `<rect x="${-W / 2}" y="${-H}" width="2.4" height="${H}" fill="#b9c0c6"/><rect x="${W / 2 - 2.4}" y="${-H}" width="2.4" height="${H}" fill="#b9c0c6"/>`;
  for (const b of BRETT) {
    const y = b - RG.y1;
    k += `<rect x="${-W / 2}" y="${y}" width="${W}" height="2.2" fill="${S.lg("brett", [[0, "#ffffff"], [1, "#c9ced3"]])}"/><rect x="${-W / 2}" y="${y + 2.2}" width="${W}" height="1" fill="#000" opacity=".1"/>`;
    /* Preisleiste */
    k += `<rect x="${-W / 2 + 2.4}" y="${y + 0.6}" width="${W - 4.8}" height="1.2" fill="#e8ebee"/>`;
  }
  /* Kartons als Lagerware (Kulisse des Regals) */
  const karton = (x, b, w, h, f, t) => `<rect x="${x}" y="${r(b - RG.y1 - h)}" width="${w}" height="${h}" rx=".4" fill="${f}"/><rect x="${x}" y="${r(b - RG.y1 - h)}" width="${w}" height="1" fill="#fff" opacity=".25"/><text x="${r(x + w / 2)}" y="${r(b - RG.y1 - h / 2 + 1)}" font-size="2" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">${t}</text>`;
  k += karton(-38, BRETT[0], 9, 12, "#1d5fa3", "WLAN") + karton(-28, BRETT[0], 9, 12, "#1d5fa3", "WLAN");
  k += karton(16, BRETT[1], 10, 13, "#26292e", "GAME") + karton(27, BRETT[1], 10, 13, "#26292e", "GAME");
  k += karton(-38, BRETT[2], 14, 12, "#3d6fb8", "PRINT") + karton(22, BRETT[2], 15, 12, "#3d6fb8", "PRINT");
  k += karton(18, BRETT[0], 7, 8, "#222", "FOTO") + karton(26, BRETT[0], 7, 8, "#222", "FOTO");
  k += `<rect x="${-W / 2}" y="-6" width="${W}" height="6" fill="#4e555c"/>`;
  S.teil({ id: "regal", de: "das Regal", syl: "re-GAL", it: "lo scaffale", itSyl: "scaf-FA-le", en: "shelf", x: (RG.x0 + RG.x1) / 2, y: RG.y1, steht: true, kunst: k });
}
{
  /* DER ROUTER — weiß, mit Antennen und Lämpchen */
  let k = schatten(0, 0, 8, .7, .25);
  k += `<rect x="-7" y="-4.6" width="14" height="4.6" rx="1" fill="${WEISS}" stroke="#cfd4d9" stroke-width=".2"/>`;
  for (const [x, a] of [[-5.4, -12], [5.4, 12], [0, 0]]) k += `<rect x="${x - 0.6}" y="-13" width="1.2" height="9" rx=".6" fill="#f4f5f6" stroke="#cfd4d9" stroke-width=".2" transform="rotate(${a} ${x} -4.4)"/>`;
  for (let i = 0; i < 5; i++) k += `<circle cx="${-4.4 + i * 2.2}" cy="-2" r=".4" fill="${i < 4 ? "#3fcf6a" : "#3b8de0"}"/>`;
  k += `<path d="M9 -10 q2 2 0 4 M10.6 -11.4 q3.4 3.4 0 6.8" stroke="#3b8de0" stroke-width=".35" fill="none" opacity=".7"/>`;
  S.teil({ oben: true, id: "router", de: "der Router", syl: "ROU-ter", it: "il router", itSyl: "ROU-ter", en: "router", x: 256, y: BRETT[0], steht: true, kunst: k,
    tipp: "Der Router bringt das Internet per WLAN in die ganze Wohnung." });
}
{
  /* DIE KAMERA — Systemkamera mit Objektiv auf einem kleinen Sockel */
  let k = `<rect x="-5" y="-1.2" width="10" height="1.2" fill="#2a2d31"/>`;
  k += `<rect x="-4.4" y="-6.6" width="8.8" height="5.4" rx=".8" fill="${S.lg("kamera", [[0, "#3d4148"], [1, "#16181b"]])}"/>`;
  k += `<rect x="-2.6" y="-8" width="4" height="1.6" rx=".4" fill="#2a2d31"/><circle cx="0" cy="-3.9" r="2.4" fill="#1b1d20" stroke="#5c636b" stroke-width=".4"/><circle cx="0" cy="-3.9" r="1.3" fill="${S.rg("linse", [[0, "#5b8ad0"], [1, "#0d1a2c"]], 0.35, 0.35, 0.7)}"/><circle cx="-.5" cy="-4.4" r=".4" fill="#fff" opacity=".6"/>`;
  k += `<rect x="2.6" y="-6.2" width="1.2" height=".8" rx=".2" fill="${ROT}"/>`;
  S.teil({ oben: true, id: "kamera", de: "die Kamera", syl: "KA-me-ra", it: "la fotocamera", itSyl: "fo-to-CA-me-ra", en: "camera", x: 299, y: BRETT[0], steht: true, kunst: k });
}
{
  /* DIE SPIELKONSOLE — aufrecht stehend, mit Controller davor */
  let k = schatten(0, 0, 9, .7, .25);
  k += `<path d="M-6 0 L-6 -15 Q-6 -16 -5 -16 L-1 -16 L-1 0 Z" fill="${WEISS}" stroke="#cfd4d9" stroke-width=".2"/>`;
  k += `<rect x="-1" y="-16" width="2.2" height="16" fill="#1d1f23"/><path d="M1.2 0 L1.2 -16 L4 -16 Q5 -16 5 -15 L5 0 Z" fill="${WEISS}" stroke="#cfd4d9" stroke-width=".2"/>`;
  k += `<rect x="-.4" y="-14" width="1" height=".8" fill="#5aa8ff"/>`;
  /* Controller */
  k += `<path d="M6 0 Q5.4 -3.6 7.4 -3.8 L12.6 -3.8 Q14.6 -3.6 14 0 Q12.6 .6 11.6 -.8 L8.4 -.8 Q7.4 .6 6 0 Z" fill="${S.lg("ctrl", [[0, "#4a4f57"], [1, "#1c1e22"]])}"/>`;
  k += `<circle cx="8.2" cy="-2.4" r=".55" fill="#7e858d"/><circle cx="11.8" cy="-2.4" r=".55" fill="#7e858d"/><circle cx="10" cy="-3" r=".3" fill="#5aa8ff"/>`;
  S.teil({ oben: true, id: "spielkonsole", de: "die Spielkonsole", syl: "SPIEL-kon-so-le", it: "la console per videogiochi", itSyl: "CON-so-le per vi-de-o-GIO-chi", en: "games console", x: 258, y: BRETT[1], steht: true, kunst: k });
}
{
  /* DER DRUCKER — Tintenstrahl-Multifunktionsgerät mit Papier */
  let k = schatten(0, 0, 11, .8, .25);
  k += `<rect x="-10" y="-8" width="20" height="8" rx="1" fill="${S.lg("drucker", [[0, "#4b5058"], [1, "#22252a"]])}"/>`;
  k += `<rect x="-10" y="-9.4" width="20" height="2" rx=".8" fill="#5b6169"/><rect x="-9" y="-9" width="18" height=".6" fill="#7b828a"/>`;
  k += `<path d="M-6 -9.4 L-5 -14 L5 -14 L6 -9.4 Z" fill="#fbfbfa" stroke="#d5d8db" stroke-width=".2"/>`;
  k += `<rect x="-7" y="-4.2" width="14" height="1.6" rx=".3" fill="#16181b"/><rect x="-6" y="-3" width="12" height="1.4" fill="#fbfbfa"/>`;
  k += `<rect x="5" y="-7" width="3.4" height="2" rx=".3" fill="#5fc1e8"/><circle cx="-7.4" cy="-6" r=".5" fill="#3fcf6a"/>`;
  S.teil({ oben: true, id: "drucker", de: "der Drucker", syl: "DRU-cker", it: "la stampante", itSyl: "stam-PAN-te", en: "printer", x: 271, y: BRETT[2], steht: true, kunst: k });
}

/* =====================================================================
   7 — DER PRÄSENTATIONSTISCH (Mitte) mit Laptop, Maus, Tablet,
       Smartphones und Kopfhörern — alles an Sicherungskabeln
   ===================================================================== */
const TISCH = { x0: 92, x1: 228, fuss: 164, platte: 110 };
{
  const W = TISCH.x1 - TISCH.x0, H = TISCH.fuss - TISCH.platte;
  let k = schatten(0, 0, W / 2 + 4, 2.2, .3);
  /* Platte von leicht oben: hinten schmaler */
  k += `<path d="M${-W / 2 + 3} ${-H - 5} L${W / 2 - 3} ${-H - 5} L${W / 2} ${-H} L${-W / 2} ${-H} Z" fill="${S.lg("platte", [[0, "#f6f7f8"], [1, "#e0e3e6"]])}"/>`;
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="2.4" fill="#cfd4d9"/>`;
  /* Korpus weiß, rotes Band, Text */
  k += `<rect x="${-W / 2 + 2}" y="${-H + 2.4}" width="${W - 4}" height="${H - 6.4}" fill="${S.lg("korpus", [[0, "#ffffff"], [1, "#e4e7ea"]])}"/>`;
  k += `<rect x="${-W / 2 + 2}" y="${-H + 14}" width="${W - 4}" height="10" fill="${ROT}"/><rect x="${-W / 2 + 2}" y="${-H + 14}" width="${W - 4}" height="1.6" fill="#ff7b7b" opacity=".45"/>`;
  k += `<text x="0" y="${-H + 21.4}" font-size="6" text-anchor="middle" fill="#fff" font-family="Arial,Helvetica,sans-serif" font-weight="bold" letter-spacing=".5">Testen erlaubt!</text>`;
  k += `<text x="0" y="${-H + 32}" font-size="3.4" text-anchor="middle" fill="#6b737b" font-family="Arial" letter-spacing=".3">Laptops · Tablets · Smartphones · Audio</text>`;
  k += `<rect x="${-W / 2 + 2}" y="-4" width="${W - 4}" height="4" fill="#3d4349"/>`;
  /* Spiralkabel der Diebstahlsicherung verschwinden in der Platte */
  for (const x of [-40, -12, 10, 24, 46]) k += `<circle cx="${x}" cy="${-H - 2}" r=".9" fill="#2a2d31"/>`;
  S.teil({ id: "tisch", de: "der Tisch", syl: "TISCH", it: "il tavolo", itSyl: "TA-vo-lo", en: "table", x: (TISCH.x0 + TISCH.x1) / 2, y: TISCH.fuss, steht: true, kunst: k,
    tipp: "Auf dem Präsentationstisch darf man alles ausprobieren." });
}
const AUF = TISCH.platte - 2.2;     // Standhöhe der Geräte (Mitte der Platte)
const spirale = (x0, y0, x1, y1) => {
  /* Spiralkabel als Zickzack-Locken */
  let d = `M${x0} ${y0}`;
  const n = 7;
  for (let i = 1; i <= n; i++) { const t = i / n, x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t; d += ` q${i % 2 ? 1 : -1} .4 ${r((x1 - x0) / n)} ${r((y1 - y0) / n)}`; }
  return `<path d="${d}" stroke="#2a2d31" stroke-width=".45" fill="none"/>`;
};
{
  /* DER LAPTOP — aufgeklappt, Bildschirm leuchtet */
  let k = schatten(0, 0, 11, .8, .3);
  k += `<path d="M-10 0 L10 0 L8.6 -2.6 L-8.6 -2.6 Z" fill="${ALU}"/><path d="M-10 0 L10 0 L10 .5 L-10 .5 Z" fill="#9aa2a9"/>`;
  for (let i = 0; i < 3; i++) k += `<path d="M${-8 + i * .3} ${-2.2 + i * .7} L${8 - i * .3} ${-2.2 + i * .7}" stroke="#7d858c" stroke-width=".35" stroke-dasharray=".7 .3"/>`;
  k += `<path d="M-8.6 -2.6 L-9.4 -15 L9.4 -15 L8.6 -2.6 Z" fill="#2a2d31"/>`;
  k += `<path d="M-8 -3.6 L-8.7 -14.2 L8.7 -14.2 L8 -3.6 Z" fill="${S.lg("lapbild", [[0, "#2563b9"], [0.6, "#58a4e8"], [1, "#a8d8f5"]])}"/>`;
  k += `<rect x="-6.6" y="-12.4" width="5" height="3.6" rx=".3" fill="#fff" opacity=".85"/><rect x="-.6" y="-12.4" width="6.6" height="2" rx=".3" fill="#fff" opacity=".6"/><rect x="-.6" y="-9.8" width="6.6" height="1" rx=".3" fill="#fff" opacity=".45"/>`;
  k += `<rect x="-8.2" y="-5" width="16.4" height="1" fill="#0d1a2c" opacity=".55"/>`;
  k += `<path d="M-8.7 -14.2 L-3 -14.2 L-8 -6 Z" fill="#fff" opacity=".12"/>`;
  k += spirale(9.6, -0.4, 13, 1.4);
  /* Preisschild am Aufsteller */
  k += `<rect x="-14.6" y="-5.6" width="4.4" height="5.6" rx=".3" fill="#fff" stroke="#ccc" stroke-width=".15"/><text x="-12.4" y="-2.4" font-size="1.5" text-anchor="middle" fill="${ROT}" font-family="Arial" font-weight="bold">799 €</text>`;
  S.teil({ oben: true, id: "laptop", de: "der Laptop", syl: "LAP-top", it: "il portatile", itSyl: "por-TA-ti-le", en: "laptop", x: 122, y: AUF, steht: true, kunst: k });
}
{
  /* DIE COMPUTERMAUS — neben dem Laptop, mit Kabel */
  let k = `<ellipse cx="0" cy="-.2" rx="2.4" ry=".7" fill="#000" opacity=".2"/>`;
  k += `<path d="M-2.2 0 Q-2.4 -2.6 0 -2.8 Q2.4 -2.6 2.2 0 Z" fill="${S.lg("maus", [[0, "#5b6169"], [1, "#1d1f23"]])}"/>`;
  k += `<line x1="0" y1="-2.8" x2="0" y2="-1.6" stroke="#9aa2a9" stroke-width=".25"/><ellipse cx="-.8" cy="-2" rx=".6" ry=".3" fill="#fff" opacity=".3"/>`;
  k += `<path d="M0 -2.8 q-.6 -1.4 -3.2 -1.2" stroke="#2a2d31" stroke-width=".3" fill="none"/>`;
  S.teil({ oben: true, id: "computermaus", de: "die Computermaus", syl: "com-PU-ter-maus", it: "il mouse", itSyl: "MOU-se", en: "computer mouse", x: 138, y: AUF + 0.6, steht: true, kunst: k + flaeche(-3, -4, 6, 4.6) });
}
{
  /* DAS TABLET — auf einem Sicherungsständer, etwas schräg */
  let k = schatten(0, 0, 6, .6, .3);
  k += `<rect x="-3" y="-1.4" width="6" height="1.4" rx=".4" fill="#3d4349"/><rect x="-.8" y="-6" width="1.6" height="5" fill="#5b6169"/>`;
  k += `<g transform="rotate(-6 0 -12)"><rect x="-8" y="-19" width="16" height="12" rx="1.2" fill="#1d1f23"/>`;
  k += `<rect x="-7" y="-18" width="14" height="10" rx=".5" fill="${S.lg("tabbild", [[0, "#ff9a3c"], [0.5, "#ff5e7a"], [1, "#7a3cff"]], 0, 0, 1, 1)}"/>`;
  for (let i = 0; i < 8; i++) k += `<rect x="${-6 + (i % 4) * 3.2}" y="${-16.8 + Math.floor(i / 4) * 3.4}" width="2" height="2" rx=".5" fill="#fff" opacity=".75"/>`;
  k += `<path d="M-7 -18 L-1 -18 L-7 -11 Z" fill="#fff" opacity=".14"/></g>`;
  k += spirale(3, -.6, 7, 1.2);
  S.teil({ oben: true, id: "tablet", de: "das Tablet", syl: "TAB-let", it: "il tablet", itSyl: "TAB-let", en: "tablet", x: 156, y: AUF, steht: true, kunst: k });
}
{
  /* DAS SMARTPHONE — drei Geräte auf Sicherungshaltern (Alarmsockel) */
  let k = "";
  const farben = [["#2d3a4a", "#5fb0ff"], ["#e9e4dc", "#5ad1a8"], ["#5a2a6e", "#ffb347"]];
  farben.forEach(([geh, bild], i) => {
    const x = -8 + i * 8;
    k += schatten(x, 0, 3, .4, .3);
    k += `<rect x="${x - 2}" y="-1.6" width="4" height="1.6" rx=".6" fill="#2a2d31"/><circle cx="${x}" cy="-.8" r=".35" fill="#3fcf6a"/>`;
    k += `<rect x="${x - 2.5}" y="-12.2" width="5" height="10" rx="1" fill="${geh}"/><rect x="${x - 2.1}" y="-11.6" width="4.2" height="8.8" rx=".6" fill="${S.lg("handy" + i, [[0, bild], [1, "#1c2b4a"]])}"/>`;
    k += `<rect x="${x - .8}" y="-11.4" width="1.6" height=".5" rx=".25" fill="#0b0b0c"/>`;
    for (let j = 0; j < 4; j++) k += `<rect x="${r(x - 1.7 + (j % 2) * 1.9)}" y="${r(-9.8 + Math.floor(j / 2) * 2)}" width="1.4" height="1.4" rx=".35" fill="#fff" opacity=".7"/>`;
    k += `<path d="M${x - 2.1} -11.6 L${x} -11.6 L${x - 2.1} -8 Z" fill="#fff" opacity=".15"/>`;
    k += `<rect x="${x - 2.2}" y="1" width="4.4" height="2.2" rx=".2" fill="#fff" stroke="#ccc" stroke-width=".1"/><text x="${x}" y="2.6" font-size="1.3" text-anchor="middle" fill="${ROT}" font-family="Arial" font-weight="bold">${[699, 449, 329][i]} €</text>`;
  });
  S.teil({ oben: true, id: "smartphone", de: "das Smartphone", syl: "SMART-phone", it: "lo smartphone", itSyl: "SMART-phone", en: "smartphone", x: 182, y: AUF, steht: true, kunst: k,
    tipp: "Die Vorführgeräte hängen an einem Sicherungskabel – das lädt zugleich den Akku." });
}
{
  /* DIE KOPFHÖRER — auf einem Kopfhörerständer */
  let k = schatten(0, 0, 6, .6, .3);
  k += `<ellipse cx="0" cy="-.6" rx="4.4" ry="1" fill="#3d4349"/><rect x="-.6" y="-15" width="1.2" height="14.4" fill="${ALU}"/>`;
  k += `<path d="M-4.6 -9 Q-5.4 -18.6 0 -18.8 Q5.4 -18.6 4.6 -9" stroke="#1d1f23" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
  k += `<path d="M-3.6 -16.4 Q0 -18.6 3.6 -16.4" stroke="#7d858c" stroke-width=".4" fill="none"/>`;
  for (const s of [-1, 1]) {
    k += `<rect x="${s < 0 ? -7.4 : 3.6}" y="-12.4" width="3.8" height="7" rx="1.8" fill="${S.lg("muschel", [[0, "#4a4f57"], [1, "#16181b"]], 0, 0, 1, 0)}"/>`;
    k += `<rect x="${s < 0 ? -4 : 3.2}" y="-11.6" width=".8" height="5.4" rx=".4" fill="#5b6169"/>`;
  }
  k += `<rect x="-6.8" y="-11.8" width=".8" height="5.6" rx=".4" fill="#fff" opacity=".2"/>`;
  S.teil({ oben: true, id: "kopfhoerer", de: "die Kopfhörer", syl: "KOPF-hö-rer", it: "le cuffie", itSyl: "CUF-fie", en: "headphones", x: 210, y: AUF, steht: true, kunst: k,
    tipp: "Die Kopfhörer darf man aufsetzen und Probe hören." });
}

/* =====================================================================
   8 — DER LAUTSPRECHER (Party-Lautsprecher auf dem Boden, vorne links)
       Fuß bei y 190 → ≈ 76 Einheiten je Meter; 0,55 m hoch
   ===================================================================== */
{
  let k = schatten(0, 0, 17, 2, .35);
  k += `<rect x="-13" y="-42" width="26" height="42" rx="3" fill="${S.lg("box", [[0, "#3a3e44"], [0.5, "#202327"], [1, "#121417"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-8" y="-45" width="16" height="4" rx="2" fill="#2a2d31"/><rect x="-6" y="-44.2" width="12" height="2.4" rx="1.2" fill="#121417"/>`;
  /* zwei Membranen mit leuchtendem Ring */
  for (const [cy, rr] of [[-27, 8.6], [-9.6, 6]]) {
    k += `<circle cx="0" cy="${cy}" r="${rr + 1.2}" fill="none" stroke="#2fd0ff" stroke-width=".9" opacity=".85"/><circle cx="0" cy="${cy}" r="${rr + 2.6}" fill="none" stroke="#2fd0ff" stroke-width="1.6" opacity=".18"/>`;
    k += `<circle cx="0" cy="${cy}" r="${rr}" fill="${S.rg("membran", [[0, "#5a6068"], [0.35, "#2a2d31"], [1, "#0d0e10"]], 0.45, 0.4, 0.7)}"/>`;
    k += `<circle cx="0" cy="${cy}" r="${r(rr * 0.3)}" fill="#3d4349"/><circle cx="${r(-rr * 0.25)}" cy="${r(cy - rr * 0.3)}" r="${r(rr * 0.18)}" fill="#fff" opacity=".18"/>`;
  }
  k += `<rect x="-11" y="-40" width="2" height="38" rx="1" fill="#fff" opacity=".06"/>`;
  k += `<rect x="-6" y="-1.6" width="12" height="1.6" fill="#0b0c0e"/>`;
  k += `<rect x="16" y="-12" width="12" height="7" rx=".5" fill="#fff" stroke="#ccc" stroke-width=".2"/><text x="22" y="-7.6" font-size="2.8" text-anchor="middle" fill="${ROT}" font-family="Arial" font-weight="bold">349 €</text><line x1="22" y1="-5" x2="22" y2="0" stroke="#999" stroke-width=".4"/>`;
  S.teil({ id: "lautsprecher", de: "der Lautsprecher", syl: "LAUT-spre-cher", it: "l'altoparlante", itSyl: "al-to-par-LAN-te", en: "loudspeaker", x: 46, y: 190, steht: true, kunst: k });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/technik.js"));
console.log(aus);
