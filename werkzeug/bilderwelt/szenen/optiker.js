#!/usr/bin/env node
/* =====================================================================
   DER OPTIKER (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (Ladenbau für Augenoptik, Hersteller von Refraktionseinheiten,
   Beschreibung Messplatz/Refraktionsraum):
   - Die BRILLENWAND: helle, beleuchtete Wandregale, die Fassungen liegen
     einzeln auf Glas- oder Acrylleisten, nach Damen, Herren, Kinder,
     Sonnen- und Lesebrillen geordnet; unten Schubladen mit Vorrat.
   - Der BERATUNGSTISCH (Anpasstisch): Tischspiegel, Tablett mit der
     ausgesuchten Brille, Musterglas, Brillenpass, Etui, Kontaktlinsen.
   - Daneben auf dem Gerätetisch das AUTOREFRAKTOMETER (Messgerät mit
     Kinnstütze, Bildschirm auf der Seite des Optikers).
   - Der MESSPLATZ (Refraktion): Säule mit Schwenkarm, daran der
     PHOROPTER mit den runden Glasrädern vor den Augen; der Kunde sitzt
     auf dem Stuhl und liest die SEHTAFEL an der Wand (Buchstaben werden
     nach unten kleiner, unten der Rot-Grün-Test). Die Augenoptikerin
     steht daneben und dreht die Gläser.
   Maßstab: Rückwand ≈ 45 Einheiten je Meter, vorne ≈ 58 je Meter.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "optiker", titel: "Der Optiker", emoji: "👓", thema: "Gesundheit", kuerzel: "b04b", fassung: 852 });
const rnd = zufall(2020);
const r = B.r;
/* Rückenfigur: zentimetergenaue Pfade reichen (Datei bleibt klein) */
const grob = (svg) => svg.replace(/ d="([^"]*)"/g, (m, d) => ' d="' + d.replace(/(-?\d+)\.\d+/g, (z) => String(Math.round(parseFloat(z)))) + '"');

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("glow")}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2"/></filter>`);
const WAND = S.lg("wand", [[0, "#f6f5f2"], [1, "#e9e7e2"]]);
const WAND2 = S.lg("wand2", [[0, "#e3e9ec"], [1, "#d3dbe0"]]);
const DECKE = S.lg("decke", [[0, "#f7f6f3"], [1, "#e8e6e1"]]);
const EICHE = S.lg("eiche", [[0, "#e2c79f"], [0.5, "#d4b585"], [1, "#c2a171"]], 0, 0, 1, 0);
const WEISS = S.lg("weiss", [[0, "#ffffff"], [1, "#e6e5e1"]]);
const CHROM = S.lg("chrom", [[0, "#f4f6f8"], [0.4, "#c3c9ce"], [0.55, "#9ea6ad"], [1, "#e4e8eb"]], 0, 0, 1, 0);
const GERAET = S.lg("geraet", [[0, "#fbfbfa"], [0.6, "#e9eae8"], [1, "#c9ccca"]], 0, 0, 1, 0);
const POLSTER = S.lg("polster", [[0, "#4b5a68"], [0.4, "#33404c"], [1, "#222b33"]], 0, 0, 1, 0);

/* =====================================================================
   KULISSE — helle Wände, rechts der Messplatz in Blaugrau, Fliesenboden
   ===================================================================== */
const WU = 124, VPX = 160, VPY = 40;
S.hinten(`<rect x="0" y="0" width="320" height="13" fill="${DECKE}"/><rect x="0" y="12" width="320" height="1.4" fill="#d9d6cf"/>`);
for (const x of [30, 90, 210, 270]) S.hinten(`<circle cx="${x}" cy="6.5" r="2" fill="#fffdf6"/><ellipse cx="${x}" cy="6.5" rx="7" ry="2.4" fill="#fff8e4" opacity=".3"/>`);
S.hinten(`<rect x="0" y="13.4" width="320" height="${WU - 13.4}" fill="${WAND}"/>`);
S.hinten(`<rect x="228" y="13.4" width="92" height="${WU - 13.4}" fill="${WAND2}"/><rect x="227" y="13.4" width="1.4" height="${WU - 13.4}" fill="#c9d1d6"/>`);
S.hinten(`<rect x="0" y="13.4" width="320" height="${WU - 13.4}" fill="${S.rg("wl", [[0, "#fffdf5", 0.6], [1, "#fffdf5", 0]], 0.45, 0.1, 0.7)}"/>`);
S.hinten(`<rect x="0" y="${WU - 3.4}" width="320" height="3.4" fill="#f9f8f6"/><rect x="0" y="${WU - 3.4}" width="320" height=".5" fill="#c8c5be"/>`);
{
  /* große helle Feinsteinzeug-Fliesen (60 × 60) */
  const xAt = (x0, y) => VPX + (x0 - VPX) * (y - VPY) / (WU - VPY);
  let f = `<rect x="0" y="${WU}" width="320" height="${200 - WU}" fill="${S.lg("boden", [[0, "#d7d5d0"], [1, "#c9c6c0"]])}"/>`;
  for (let i = -12; i <= 12; i++) { const a = 160 + i * 26; f += `<line x1="${a}" y1="${WU}" x2="${r(xAt(a, 200))}" y2="200" stroke="#a9a59e" stroke-width=".35"/>`; }
  for (const y of [131, 141, 155, 175, 200]) f += `<line x1="0" y1="${y}" x2="320" y2="${y}" stroke="#a9a59e" stroke-width=".35"/>`;
  f += `<rect x="0" y="${WU}" width="320" height="${200 - WU}" fill="${S.lg("bodenlicht", [[0, "#000", 0.14], [0.4, "#000", 0], [1, "#fff", 0.12]])}"/>`;
  /* Spiegelung der Brillenwand im polierten Boden */
  f += `<rect x="8" y="${WU}" width="96" height="16" fill="${S.lg("bodensp", [[0, "#fff", 0.35], [1, "#fff", 0]])}"/>`;
  S.hinten(f);
}
/* Gerätetisch (weiß, an der Wand) für das Messgerät */
S.hinten(`<ellipse cx="200" cy="133" rx="17" ry="1.6" fill="#1b120a" opacity=".2" filter="url(#bw_weich)"/><rect x="185" y="100" width="30" height="3" rx=".8" fill="${EICHE}"/><rect x="186.5" y="103" width="27" height="29" fill="${WEISS}"/><rect x="186.5" y="103" width="27" height="1.2" fill="#000" opacity=".08"/><rect x="198" y="110" width="4" height="1" rx=".5" fill="#b9b6ae"/><rect x="198" y="121" width="4" height="1" rx=".5" fill="#b9b6ae"/><line x1="186.5" y1="117" x2="213.5" y2="117" stroke="#d6d4ce" stroke-width=".4"/>`);

/* =====================================================================
   DIE LAMPE — lange LED-Pendelleuchte über dem Beratungstisch
   ===================================================================== */
{
  let k = `<line x1="-24" y1="-14" x2="-24" y2="-2" stroke="#555" stroke-width=".35"/><line x1="24" y1="-14" x2="24" y2="-2" stroke="#555" stroke-width=".35"/>`;
  k += `<rect x="-30" y="-2.4" width="60" height="3.4" rx="1.2" fill="${S.lg("lb", [[0, "#3a3b3f"], [1, "#1e1f22"]])}"/><rect x="-29" y=".4" width="58" height="1" rx=".4" fill="#fffbe9"/>`;
  k += `<path d="M-29 1.4 L-40 22 L40 22 L29 1.4 Z" fill="${S.lg("kegel", [[0, "#fff8df", 0.35], [1, "#fff8df", 0]])}"/>`;
  S.teil({ id: "op_lampe", de: "die Lampe", syl: "LAM-pe", it: "la lampada", itSyl: "LAM-pa-da", en: "lamp", x: 145, y: 27, kunst: k + flaeche(-31, -4, 62, 6) });
}
/* DAS SCHILD mit dem Namen des Geschäfts */
{
  let k = `<text x="0" y="0" font-size="8.4" text-anchor="middle" fill="#2c3e50" font-family="Georgia,'Times New Roman',serif" letter-spacing="1.2">OPTIK SOMMER</text>`;
  k += `<line x1="-30" y1="3" x2="30" y2="3" stroke="#b08a4e" stroke-width=".4"/><text x="0" y="7" font-size="2.6" text-anchor="middle" fill="#7a8a96" font-family="Arial,sans-serif" letter-spacing=".8">AUGENOPTIK · KONTAKTLINSEN · SEHTEST</text>`;
  k += `<g transform="translate(-49 -2.6)"><circle cx="-3" cy="0" r="2.6" fill="none" stroke="#2c3e50" stroke-width=".8"/><circle cx="3.4" cy="0" r="2.6" fill="none" stroke="#2c3e50" stroke-width=".8"/><path d="M-.4 0 q.8 -.9 1.6 0" stroke="#2c3e50" stroke-width=".6" fill="none"/></g>`;
  S.teil({ id: "op_schild", de: "das Schild", syl: "SCHILD", it: "l'insegna", itSyl: "in-SE-gna", en: "sign", x: 164, y: 50, kunst: k + flaeche(-53, -8, 99, 17) });
}

/* =====================================================================
   DIE BRILLENWAND — Lupe: Fassungen, Sonnen-, Kinder- und Lesebrillen
   ===================================================================== */
/* eine Brille von vorn: Form, Farbe des Rands, Glasfarbe */
function brille(x, y, w, form, rand, glas, dick = 0.55) {
  const lw = w * 0.42, lh = form === "rund" ? lw : form === "pilot" ? lw * 0.86 : lw * 0.7;
  let g = "";
  for (const s of [-1, 1]) {
    const cx = x + s * (w * 0.27);
    let d;
    if (form === "rund") d = `M${r(cx - lw / 2)} ${r(y)} a${r(lw / 2)} ${r(lh / 2)} 0 1 0 ${r(lw)} 0 a${r(lw / 2)} ${r(lh / 2)} 0 1 0 ${r(-lw)} 0 Z`;
    else if (form === "pilot") d = `M${r(cx - lw / 2)} ${r(y - lh * 0.45)} L${r(cx + lw / 2)} ${r(y - lh * 0.45)} Q${r(cx + lw / 2 + s * 0.2)} ${r(y + lh * 0.55)} ${r(cx)} ${r(y + lh * 0.55)} Q${r(cx - lw / 2)} ${r(y + lh * 0.55)} ${r(cx - lw / 2)} ${r(y - lh * 0.45)} Z`;
    else if (form === "katze") d = `M${r(cx - lw / 2)} ${r(y - lh * 0.3)} Q${r(cx)} ${r(y - lh * 0.55)} ${r(cx + lw / 2 + s * 0.6)} ${r(y - lh * 0.65)} Q${r(cx + lw / 2)} ${r(y + lh * 0.5)} ${r(cx)} ${r(y + lh * 0.5)} Q${r(cx - lw / 2)} ${r(y + lh * 0.45)} ${r(cx - lw / 2)} ${r(y - lh * 0.3)} Z`;
    else if (form === "halb") d = `M${r(cx - lw / 2)} ${r(y - lh * 0.1)} L${r(cx + lw / 2)} ${r(y - lh * 0.1)} Q${r(cx + lw / 2)} ${r(y + lh * 0.5)} ${r(cx)} ${r(y + lh * 0.5)} Q${r(cx - lw / 2)} ${r(y + lh * 0.5)} ${r(cx - lw / 2)} ${r(y - lh * 0.1)} Z`;
    else d = `M${r(cx - lw / 2)} ${r(y - lh / 2)} h${r(lw)} v${r(lh)} h${r(-lw)} Z`;
    g += `<path d="${d}" fill="${glas}" stroke="${rand}" stroke-width="${dick}" stroke-linejoin="round"/>`;
  }
  g += `<path d="M${r(x - w * 0.06)} ${r(y - lh * 0.25)} q${r(w * 0.06)} ${r(-w * 0.05)} ${r(w * 0.12)} 0" stroke="${rand}" stroke-width="${dick}" fill="none"/>`;
  g += `<line x1="${r(x - w * 0.5)}" y1="${r(y - lh * 0.3)}" x2="${r(x - w * 0.53)}" y2="${r(y - lh * 0.1)}" stroke="${rand}" stroke-width="${dick}"/><line x1="${r(x + w * 0.5)}" y1="${r(y - lh * 0.3)}" x2="${r(x + w * 0.53)}" y2="${r(y - lh * 0.1)}" stroke="${rand}" stroke-width="${dick}"/>`;
  return g;
}
{
  const X0 = 6, X1 = 104, Y0 = 18, Y1 = WU, W = X1 - X0, H = Y1 - Y0, cx = (X0 + X1) / 2;
  let k = schatten(0, 0, W / 2 + 2, 1.6, 0.25);
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="${H}" fill="${WEISS}"/>`;
  k += `<rect x="${-W / 2 + 3}" y="${-H + 6}" width="${W - 6}" height="${H - 32}" fill="${EICHE}"/>`;
  k += `<rect x="${-W / 2 + 3}" y="${-H + 6}" width="${W - 6}" height="${H - 32}" fill="${S.lg("bwlicht", [[0, "#fffbe8", 0.55], [0.5, "#fffbe8", 0.05], [1, "#000", 0.08]])}"/>`;
  k += `<rect x="${-W / 2 + 3}" y="${-H + 6}" width="${W - 6}" height="1.2" fill="#fffbe9"/>`;
  /* Kopfleiste mit Rubriken-Schildchen */
  k += `<text x="0" y="${-H + 4.4}" font-size="2.8" text-anchor="middle" fill="#7a8a96" font-family="Arial,sans-serif" letter-spacing="1">FASSUNGEN · SONNENBRILLEN · KINDER</text>`;
  const reihen = [
    { y: -H + 18, art: "damen" }, { y: -H + 32, art: "herren" }, { y: -H + 46, art: "sonne" }, { y: -H + 60, art: "kinder" }, { y: -H + 74, art: "lese" },
  ];
  const farben = { damen: ["#7a1f3d", "#c9a227", "#1d1d1f", "#a0522d", "#5b3a6e", "#e0b0b8", "#2f4f6f", "#8b5a2b"],
    herren: ["#1d1d1f", "#5a5f66", "#3b2a1c", "#1f3a5f", "#8a8f96", "#2e2e30", "#6b4a2e", "#20343f"],
    sonne: ["#1d1d1f", "#c9a227", "#6b4a2e", "#b7babd", "#1d1d1f", "#7a1f3d", "#c9a227", "#3b2a1c"],
    kinder: ["#e2566c", "#3d8fd6", "#f2c94c", "#4caf50", "#9b59b6", "#ff8a3d", "#3d8fd6", "#e2566c"],
    lese: ["#1d1d1f", "#7a1f3d", "#1f3a5f", "#3b2a1c", "#5a5f66", "#a0522d", "#1d1d1f", "#2f4f6f"] };
  const formen = { damen: ["katze", "rund", "eckig", "katze", "eckig", "rund", "katze", "eckig"], herren: ["eckig", "pilot", "eckig", "rund", "eckig", "eckig", "pilot", "rund"],
    sonne: ["pilot", "eckig", "rund", "pilot", "katze", "eckig", "rund", "pilot"], kinder: ["rund", "eckig", "rund", "eckig", "rund", "eckig", "rund", "eckig"], lese: ["halb", "halb", "eckig", "halb", "halb", "eckig", "halb", "halb"] };
  reihen.forEach((rw) => {
    /* Acrylleiste mit Lichtkante */
    k += `<rect x="${-W / 2 + 4}" y="${rw.y + 2.6}" width="${W - 8}" height="1.6" fill="#f5f8f9" opacity=".9"/><rect x="${-W / 2 + 4}" y="${rw.y + 4.2}" width="${W - 8}" height=".6" fill="#000" opacity=".12"/>`;
    for (let i = 0; i < 8; i++) {
      const x = -W / 2 + 10 + i * ((W - 20) / 7), w = rw.art === "kinder" ? 8.2 : 10;
      const glas = rw.art === "sonne" ? (i % 3 === 1 ? "#5a4a2a" : "#2a2d33") : "#e8f2f5";
      const op = rw.art === "sonne" ? "" : "";
      k += brille(r(x), rw.y, w, formen[rw.art][i], farben[rw.art][i], glas, rw.art === "halb" ? 0.4 : 0.6) + op;
    }
  });
  /* Glanz auf den Gläsern der Sonnenbrillen */
  k += `<rect x="${-W / 2 + 4}" y="${-H + 43}" width="${W - 8}" height="1" fill="#fff" opacity=".12"/>`;
  /* Unterschrank mit Schubladen */
  k += `<rect x="${-W / 2}" y="-26" width="${W}" height="26" fill="${WEISS}"/>`;
  for (let i = 0; i < 4; i++) {
    const x = -W / 2 + 2 + i * ((W - 4) / 4);
    k += `<rect x="${r(x + 0.6)}" y="-24" width="${r((W - 4) / 4 - 1.2)}" height="10" rx=".6" fill="none" stroke="#d6d4ce" stroke-width=".4"/><rect x="${r(x + (W - 4) / 8 - 3)}" y="-19.6" width="6" height=".9" rx=".4" fill="#b9b6ae"/>`;
    k += `<rect x="${r(x + 0.6)}" y="-12" width="${r((W - 4) / 4 - 1.2)}" height="10" rx=".6" fill="none" stroke="#d6d4ce" stroke-width=".4"/><rect x="${r(x + (W - 4) / 8 - 3)}" y="-7.6" width="6" height=".9" rx=".4" fill="#b9b6ae"/>`;
  }
  k += `<rect x="${-W / 2}" y="-26" width="${W}" height="1.6" fill="${EICHE}"/>`;
  const zone = (rw, n = 1) => flaeche(-W / 2 + 3, -7.5, W - 6, 13.4 * n);
  const unter = [
    { id: "op_fassung", de: "die Fassung", syl: "FAS-sung", it: "la montatura", itSyl: "mon-ta-TU-ra", en: "frame", x: cx, y: Y1 - H + 18 + 6, kunst: flaeche(-W / 2 + 3, -12.5, W - 6, 26.8),
      tipp: "Das Gestell. Von der Kasse gibt es dafür kaum noch Geld." },
    { id: "op_sonnenbrille", de: "die Sonnenbrille", syl: "SON-nen-bril-le", it: "gli occhiali da sole", itSyl: "oc-CHIA-li da SO-le", en: "sunglasses", x: cx, y: Y1 - H + 46, kunst: zone(),
      tipp: "Auch Sonnenbrillen gibt es mit Sehstärke." },
    { id: "op_kinderbrille", de: "die Kinderbrille", syl: "KIN-der-bril-le", it: "gli occhiali per bambini", itSyl: "oc-CHIA-li per bam-BI-ni", en: "children's glasses", x: cx, y: Y1 - H + 60, kunst: zone() },
    { id: "op_lesebrille", de: "die Lesebrille", syl: "LE-se-bril-le", it: "gli occhiali da lettura", itSyl: "oc-CHIA-li da let-TU-ra", en: "reading glasses", x: cx, y: Y1 - H + 74, kunst: zone(),
      tipp: "Ab etwa 45 Jahren braucht fast jeder zum Lesen eine Brille." },
  ];
  S.teil({ id: "op_brillenwand", de: "die Brillenwand", syl: "BRIL-len-wand", it: "l'espositore", itSyl: "e-spo-si-TO-re", en: "frame display", x: cx, y: Y1, steht: true, kunst: k,
    zoom: { x: X0 - 2, y: Y0 + 2, w: W + 4, h: 68 }, unter,
    tipp: "Alle Fassungen darf man aufsetzen. Der Spiegel steht daneben." });
}

/* =====================================================================
   DIE SEHTAFEL (beleuchtet, an der Wand des Messplatzes)
   ===================================================================== */
{
  let k = `<rect x="-22" y="-50" width="44" height="50" rx="1.6" fill="#2a2d31"/>`;
  k += `<rect x="-20.4" y="-48.4" width="40.8" height="46.8" fill="${S.rg("tafel", [[0, "#ffffff"], [1, "#eef1f2"]], 0.5, 0.4, 0.8)}"/>`;
  const zeilen = [["E", 9, "0,1"], ["F P", 5.6, "0,2"], ["T O Z", 4, "0,3"], ["L P E D", 3, "0,5"], ["P E C F D", 2.3, "0,7"], ["E D F C Z P", 1.8, "0,8"], ["F E L O P Z D", 1.4, "1,0"]];
  let y = -48.4 + 2;
  zeilen.forEach(([t, sz, v]) => {
    y += sz * 0.74 + 1.5;
    k += `<text x="-1" y="${r(y)}" font-size="${sz}" text-anchor="middle" fill="#111" font-family="Arial,Helvetica,sans-serif" font-weight="bold" letter-spacing="${r(sz * 0.25)}">${t}</text>`;
    k += `<text x="18.6" y="${r(y)}" font-size="1.3" text-anchor="end" fill="#8a8f96" font-family="Arial,sans-serif">${v}</text>`;
  });
  /* Rot-Grün-Test unten */
  k += `<rect x="-18" y="-9.6" width="18" height="6.4" fill="#c62f2f"/><rect x="0" y="-9.6" width="18" height="6.4" fill="#2f9a4a"/>`;
  for (const [x, f] of [[-9, "#111"], [9, "#111"]]) k += `<circle cx="${x}" cy="-6.4" r="2" fill="none" stroke="${f}" stroke-width=".7"/><circle cx="${x}" cy="-6.4" r=".9" fill="none" stroke="${f}" stroke-width=".5"/>`;
  k += `<path d="M-20 -48 L-8 -48 L-20 -30 Z" fill="#fff" opacity=".25"/>`;
  S.teil({ id: "op_sehtafel", de: "die Sehtafel", syl: "SEH-ta-fel", it: "la tavola optometrica", itSyl: "TA-vo-la", en: "eye chart", x: 272, y: 74, kunst: k,
    tipp: "Von unten nach oben wird es kleiner. Wie weit man kommt, ist die Sehstärke." });
}

/* =====================================================================
   DAS MESSGERÄT (Autorefraktometer) auf dem Gerätetisch
   ===================================================================== */
{
  let k = schatten(0, 0, 13, 1.2, 0.28);
  /* Grundplatte mit Joystick */
  k += `<path d="M-13 0 L13 0 L12 -3.4 L-12 -3.4 Z" fill="${GERAET}"/><rect x="5" y="-7" width="1.6" height="3.6" fill="#444"/><circle cx="5.8" cy="-7.6" r="1.4" fill="#2a2b2f"/>`;
  /* Messkopf */
  k += `<path d="M-8 -3.4 L-8 -17 Q-8 -20 -5 -20 L6 -20 Q9 -20 9 -17 L9 -10 L4 -3.4 Z" fill="${GERAET}"/>`;
  k += `<rect x="-7" y="-17" width="6" height="6" rx="1" fill="#2a2d31"/><circle cx="-4" cy="-14" r="1.6" fill="#3b6f8e"/><circle cx="-4.5" cy="-14.6" r=".5" fill="#fff" opacity=".7"/>`;
  /* Bildschirm auf der Seite des Optikers */
  k += `<rect x="2" y="-19" width="8.6" height="6.6" rx=".6" fill="#1e2125" transform="rotate(10 6 -16)"/><rect x="2.8" y="-18.3" width="7" height="5.2" fill="${S.lg("bild", [[0, "#2b6c8a"], [1, "#163a4c"]])}" transform="rotate(10 6 -16)"/>`;
  k += `<text x="6.2" y="-15" font-size="1.4" text-anchor="middle" fill="#bfe7f5" font-family="monospace" transform="rotate(10 6 -16)">R -1.25</text><text x="6.2" y="-13.4" font-size="1.4" text-anchor="middle" fill="#bfe7f5" font-family="monospace" transform="rotate(10 6 -16)">L -1.00</text>`;
  /* Kinn- und Stirnstütze auf der Kundenseite */
  k += `<rect x="-12.6" y="-24" width="1.2" height="21" fill="#9aa2a8"/><rect x="-12.6" y="-24" width="6" height="1.2" rx=".5" fill="#9aa2a8"/><rect x="-14" y="-9" width="5" height="1.6" rx=".6" fill="#f2f0ea"/><rect x="-13.6" y="-10.2" width="4.2" height="1.2" fill="#fff"/>`;
  k += `<path d="M-6.6 -19 L-1 -19" stroke="#fff" stroke-width=".6" opacity=".7"/>`;
  S.teil({ id: "op_geraet", de: "das Messgerät", syl: "MESS-ge-rät", it: "l'autorefrattometro", itSyl: "au-to-re-frat-TO-me-tro", en: "refractometer", x: 200, y: 100, steht: true, kunst: k,
    tipp: "Man legt das Kinn auf und schaut hinein. Das dauert zwei Minuten und tut nicht weh." });
}

/* =====================================================================
   DER BERATUNGSTISCH — Lupe: Brille, Musterglas, Brillenpass,
   Kontaktlinsen, Etui. Daneben der Tischspiegel.
   ===================================================================== */
const TISCH = { x0: 100, x1: 188, top: 126, boden: 172 };
{
  const W = TISCH.x1 - TISCH.x0, cx = (TISCH.x0 + TISCH.x1) / 2, H = TISCH.boden - TISCH.top;
  let k = schatten(0, 0, W / 2, 2.2, 0.3);
  /* Beine (weiß, schlank, leicht ausgestellt) */
  for (const x of [-W / 2 + 5, W / 2 - 5]) k += `<path d="M${x - 1.3} ${-H + 4} L${x + 1.3} ${-H + 4} L${x + (x < 0 ? -0.4 : 1.6)} 0 L${x + (x < 0 ? -2 : 0)} 0 Z" fill="#efeee9"/>`;
  /* Platte, von leicht oben: Eiche mit weißer Kante */
  k += `<path d="M${-W / 2 + 3} ${-H - 4} L${W / 2 - 3} ${-H - 4} L${W / 2} ${-H} L${-W / 2} ${-H} Z" fill="${S.lg("platte", [[0, "#d9be93"], [1, "#e8d3ae"]])}"/>`;
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="2.4" fill="#f6f5f1"/><rect x="${-W / 2}" y="${-H + 2.4}" width="${W}" height=".6" fill="#000" opacity=".1"/>`;
  /* Schublade unter der Platte */
  k += `<rect x="${-W / 2 + 8}" y="${-H + 3}" width="${W - 16}" height="5" fill="#f2f1ed"/><rect x="-5" y="${-H + 5}" width="10" height=".9" rx=".4" fill="#b9b6ae"/>`;
  const oben = -H - 1.2;
  const unter = [];
  /* Tablett mit Samt, darauf die ausgesuchte Brille */
  {
    const x = -6;
    k += `<path d="M${x - 6} ${oben + 0.6} L${x + 6} ${oben + 0.6} L${x + 5.2} ${oben - 1.6} L${x - 5.2} ${oben - 1.6} Z" fill="#26323d"/>`;
    k += brille(x, oben - 3.6, 9, "eckig", "#2f4f6f", "#eef6f8", 0.6);
    k += `<path d="M${x - 4.6} ${oben - 2.6} L${x - 7} ${oben - 0.8} M${x + 4.6} ${oben - 2.6} L${x + 7} ${oben - 0.8}" stroke="#2f4f6f" stroke-width=".5"/>`;
    unter.push({ id: "op_brille", de: "die Brille", syl: "BRIL-le", it: "gli occhiali", itSyl: "oc-CHIA-li", en: "glasses", x: cx + x, y: TISCH.boden + oben, kunst: flaeche(-5.6, -8, 11.2, 8.8),
      tipp: "Zwei Teile: die Fassung und die Gläser. Bezahlt werden meist beide getrennt." });
  }
  /* Musterglas im Ständer */
  {
    const x = 5.4;
    k += `<rect x="${x - 2.4}" y="${oben - 0.8}" width="4.8" height="1" rx=".4" fill="#9aa2a8"/><rect x="${x - 0.3}" y="${oben - 3}" width=".6" height="2.4" fill="#9aa2a8"/>`;
    k += `<ellipse cx="${x}" cy="${oben - 6.4}" rx="3.4" ry="3.6" fill="${S.rg("linse", [[0, "#ffffff", 0.9], [0.7, "#d9eef4", 0.7], [1, "#9cc6d3", 0.9]], 0.4, 0.35, 0.7)}" stroke="#9cc6d3" stroke-width=".3"/><path d="M${x - 1.8} ${oben - 8} q1 -1.2 2.4 -1.2" stroke="#fff" stroke-width=".5" fill="none"/>`;
    unter.push({ id: "op_brillenglas", de: "das Brillenglas", syl: "BRIL-len-glas", it: "la lente", itSyl: "LEN-te", en: "lens", x: cx + x, y: TISCH.boden + oben, kunst: flaeche(-5.2, -11, 10.4, 11.6),
      tipp: "Gute Gläser sind entspiegelt und dünn geschliffen." });
  }
  /* Brillenpass */
  {
    const x = 16;
    k += `<g transform="rotate(-6 ${x} ${oben})"><rect x="${x - 4.2}" y="${oben - 2.4}" width="8.4" height="2.4" fill="#fdfcf8" stroke="#c9c4b8" stroke-width=".15"/><rect x="${x - 4.2}" y="${oben - 2.4}" width="8.4" height=".7" fill="#2c6e9e"/></g>`;
    k += `<rect x="${x - 3.6}" y="${oben - 7.6}" width="7.2" height="4.6" rx=".3" fill="#fdfcf8" stroke="#c9c4b8" stroke-width=".15" transform="rotate(-8 ${x} ${oben - 5})"/><text x="${x}" y="${oben - 6}" font-size="1.2" text-anchor="middle" fill="#2c6e9e" font-family="Arial" transform="rotate(-8 ${x} ${oben - 5})">BRILLENPASS</text><text x="${x}" y="${oben - 4.1}" font-size="1" text-anchor="middle" fill="#555" font-family="monospace" transform="rotate(-8 ${x} ${oben - 5})">R -1,25  L -1,00</text>`;
    unter.push({ id: "op_brillenpass", de: "der Brillenpass", syl: "BRIL-len-pass", it: "il documento della vista", itSyl: "do-cu-MEN-to", en: "prescription card", x: cx + x, y: TISCH.boden + oben, kunst: flaeche(-5.2, -10, 10.4, 10.6),
      tipp: "Darauf stehen die Werte: minus heißt kurzsichtig, plus heißt weitsichtig." });
  }
  /* Kontaktlinsen: Schachteln und Pflegemittel */
  {
    const x = 26.6;
    k += `<rect x="${x - 4.6}" y="${oben - 4}" width="5" height="4" fill="#e9f4fb" stroke="#9bc1d8" stroke-width=".2"/><rect x="${x - 4.6}" y="${oben - 4}" width="5" height="1.2" fill="#3d8fd6"/>`;
    k += `<rect x="${x - 4.2}" y="${oben - 7}" width="5" height="3" fill="#e9f4fb" stroke="#9bc1d8" stroke-width=".2"/><rect x="${x - 4.2}" y="${oben - 7}" width="5" height="1" fill="#2fae8f"/>`;
    k += `<path d="M${x + 1.2} ${oben} L${x + 1.2} ${oben - 7.6} Q${x + 1.2} ${oben - 8.6} ${x + 2.4} ${oben - 8.6} L${x + 3.4} ${oben - 8.6} Q${x + 4.6} ${oben - 8.6} ${x + 4.6} ${oben - 7.6} L${x + 4.6} ${oben} Z" fill="#f6fbfd" stroke="#9bc1d8" stroke-width=".2"/><rect x="${x + 2.2}" y="${oben - 10.2}" width="1.4" height="1.6" fill="#3d8fd6"/><rect x="${x + 1.2}" y="${oben - 5.4}" width="3.4" height="2.4" fill="#3d8fd6" opacity=".7"/>`;
    unter.push({ id: "op_kontaktlinsen", de: "die Kontaktlinsen", syl: "Kon-TAKT-lin-sen", it: "le lenti a contatto", itSyl: "LEN-ti a con-TAT-to", en: "contact lenses", x: cx + x, y: TISCH.boden + oben, kunst: flaeche(-5.4, -11, 10.8, 11.6),
      tipp: "Weiche Linsen für den Tag, harte für lange. Beide brauchen eine eigene Flüssigkeit." });
  }
  /* Etui, offen */
  {
    const x = 36.4;
    k += `<path d="M${x - 4.4} ${oben} L${x + 4.4} ${oben} Q${x + 5} ${oben - 2.4} ${x + 4} ${oben - 3} L${x - 4} ${oben - 3} Q${x - 5} ${oben - 2.4} ${x - 4.4} ${oben} Z" fill="#7a1f3d"/>`;
    k += `<path d="M${x - 4} ${oben - 3} Q${x} ${oben - 8.4} ${x + 4} ${oben - 3} Z" fill="#8f2a4a"/><path d="M${x - 3.4} ${oben - 3.1} Q${x} ${oben - 7.4} ${x + 3.4} ${oben - 3.1} Z" fill="#d9c7a6"/>`;
    unter.push({ id: "op_etui", de: "das Brillenetui", syl: "BRIL-len-e-tui", it: "l'astuccio", itSyl: "a-STUC-cio", en: "glasses case", x: cx + x, y: TISCH.boden + oben, kunst: flaeche(-4.6, -10, 9.2, 10.6) });
  }
  S.teil({ id: "op_beratungstisch", de: "der Beratungstisch", syl: "be-RA-tungs-tisch", it: "il tavolo di consulenza", itSyl: "TA-vo-lo di con-su-LEN-za", en: "consultation table", x: cx, y: TISCH.boden, steht: true, kunst: k,
    zoom: { x: cx - 30, y: TISCH.top - 20, w: 72, h: 48 }, unter,
    tipp: "Am Tisch wird die neue Brille angepasst: Die Bügel werden warm gemacht und gebogen." });
}
{
  /* DER SPIEGEL — runder Tischspiegel auf Fuß */
  let k = schatten(0, 0, 5, .8, .3);
  k += `<ellipse cx="0" cy="-.7" rx="5" ry="1.2" fill="#c9cdd0"/><rect x="-.7" y="-8" width="1.4" height="7.4" fill="${CHROM}"/>`;
  k += `<ellipse cx="0" cy="-17" rx="8" ry="9.6" fill="#2a2d31"/><ellipse cx="0" cy="-17" rx="7" ry="8.6" fill="${S.lg("sp", [[0, "#e9eef0"], [0.5, "#c6cfd2"], [1, "#a8b2b6"]])}"/>`;
  k += `<path d="M-4 -23 L1 -25.4 L-4.6 -11 L-6.4 -14 Z" fill="#fff" opacity=".35"/><ellipse cx="2" cy="-14" rx="2.6" ry="3" fill="#d7c2a6" opacity=".35"/>`;
  S.teil({ oben: true, id: "op_spiegel", de: "der Spiegel", syl: "SPIE-gel", it: "lo specchio", itSyl: "SPEC-chio", en: "mirror", x: TISCH.x0 + 13, y: TISCH.top - 1, steht: true, kunst: k,
    tipp: "„Steht mir die?“ — die wichtigste Frage beim Optiker." });
}

/* =====================================================================
   DER MESSPLATZ: Phoropter an der Säule, Stuhl, Kunde (von hinten)
   ===================================================================== */
const MP = { x: 272, stuhl: 172 };
const kundeFig = B.mensch({ id: "b04b_kunde", geschlecht: "m", alter: "alt", pose: "sitzen", blick: 180, frisur: "glatze", haarfarbe: "grau", haut: "hell",
  kleidung: { oberteil: { stueck: "pullover", farbe: "#6b7f5a" }, unterteil: { stueck: "hose", farbe: "grau" }, schuhe: { stueck: "halbschuh" } } }, 102);
const kundeOrigin = { x: MP.x, y: MP.stuhl - 29 - kundeFig.z.sitz.y * kundeFig.k };
const kopfK = { x: MP.x + kundeFig.z.kopf.x * kundeFig.k, y: kundeOrigin.y + kundeFig.z.kopf.y * kundeFig.k };
{
  /* Säule rechts hinten, Schwenkarm, Phoropter vor den Augen des Kunden */
  const sx = 306, sy = 156;
  let k = schatten(0, 0, 9, 1.2, 0.3);
  k += `<ellipse cx="0" cy="-1" rx="8" ry="2" fill="#d8dadb"/><rect x="-3" y="-60" width="6" height="59" fill="${GERAET}"/><rect x="-3" y="-60" width="1.4" height="59" fill="#fff" opacity=".6"/>`;
  k += `<rect x="-4" y="-34" width="8" height="5" rx=".8" fill="#2a2d31"/><circle cx="0" cy="-31.5" r=".9" fill="#5fd38a"/>`;
  const px = kopfK.x - sx, py = kopfK.y - sy;
  k += `<path d="M0 -58 L${r(px + 3)} -58 L${r(px + 3)} ${r(py - 9.6)}" stroke="#c3c9ce" stroke-width="1.8" fill="none" stroke-linejoin="round"/>`;
  /* Phoropter (Rückseite, Kundenseite): zwei Flügel mit Glasrädern */
  k += `<g transform="translate(${r(px)} ${r(py)}) scale(.8) translate(${r(-px)} ${r(-py)})">`;
  for (const s of [-1, 1]) {
    const wx = px + s * 9;
    k += `<path d="M${r(wx - 7)} ${r(py - 10)} Q${r(wx)} ${r(py - 13)} ${r(wx + 7)} ${r(py - 10)} L${r(wx + 7.6)} ${r(py + 5)} Q${r(wx)} ${r(py + 9)} ${r(wx - 7.6)} ${r(py + 5)} Z" fill="${S.lg("phor", [[0, "#3a3e44"], [0.5, "#24272b"], [1, "#16181b"]], 0, 0, 1, 0)}"/>`;
    k += `<circle cx="${r(wx + s * 2)}" cy="${r(py - 1)}" r="5.4" fill="#2f3338" stroke="#5a6068" stroke-width=".5"/>`;
    for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5; k += `<circle cx="${r(wx + s * 2 + Math.cos(a) * 4.2)}" cy="${r(py - 1 + Math.sin(a) * 4.2)}" r=".55" fill="#c8cdd2"/>`; }
    k += `<circle cx="${r(wx + s * 2)}" cy="${r(py - 1)}" r="1.8" fill="#6aa8c4" opacity=".7"/>`;
    k += `<rect x="${r(wx + s * 6 - 1.4)}" y="${r(py - 8)}" width="2.8" height="4" rx="1" fill="#c8cdd2"/>`;
  }
  k += `<rect x="${r(px - 3)}" y="${r(py - 13)}" width="6" height="4" rx="1" fill="#2a2d31"/></g>`;
  S.teil({ id: "op_phoropter", de: "der Phoropter", syl: "Pho-ROP-ter", it: "il forottero", itSyl: "fo-ROT-te-ro", en: "phoropter", x: sx, y: sy, steht: true, kunst: k,
    tipp: "Im Phoropter stecken viele Gläser. Die Optikerin wechselt sie, bis der Kunde scharf sieht." });
}
{
  const s = kundeFig.k;
  S.def(`<clipPath id="${S.id("kclip")}"><rect x="-40" y="-140" width="80" height="110"/></clipPath>`);
  S.teil({ id: "op_kunde", de: "der Kunde", syl: "KUN-de", it: "il cliente", itSyl: "cli-EN-te", en: "customer", x: kundeOrigin.x, y: kundeOrigin.y,
    kunst: `<g clip-path="url(#${S.id("kclip")})">${grob(kundeFig.svg)}</g>`,
    tipp: "Er sitzt beim Sehtest und liest die Buchstaben vor." });
}

{
  /* DER STUHL — Messplatzstuhl, von hinten */
  const X = MP.x, Y = MP.stuhl;
  let k = schatten(0, 0, 18, 2, 0.32);
  for (const a of [-1, -0.4, 0.4, 1]) k += `<path d="M0 -6 L${r(a * 15)} ${Math.abs(a) < 0.5 ? -0.8 : -1.6}" stroke="#2a2d31" stroke-width="1.8" stroke-linecap="round"/><circle cx="${r(a * 15)}" cy="${Math.abs(a) < 0.5 ? -0.4 : -1.2}" r="1.2" fill="#141416"/>`;
  k += `<path d="M-3 -6 L-2.6 -24 L2.6 -24 L3 -6 Z" fill="${CHROM}"/>`;
  k += `<rect x="-19" y="-33" width="38" height="10" rx="3" fill="${POLSTER}"/>`;
  k += `<path d="M-15 -29 L-15.4 -56 Q-15.4 -60 -11 -60 L11 -60 Q15.4 -60 15.4 -56 L15 -29 Z" fill="${POLSTER}"/>`;
  k += `<path d="M-13 -58 Q0 -60 13 -58" stroke="#fff" stroke-width=".6" opacity=".2" fill="none"/><path d="M-15 -42 L15 -42" stroke="#1b2229" stroke-width=".5" opacity=".6"/>`;
  for (const s of [-1, 1]) k += `<rect x="${s > 0 ? 15.6 : -22.6}" y="-41" width="7" height="4" rx="1.8" fill="${POLSTER}"/><path d="M${s * 19} -37 L${s * 19} -31" stroke="#c3c9ce" stroke-width="1.4"/>`;
  S.teil({ id: "op_stuhl", de: "der Stuhl", syl: "STUHL", it: "la sedia", itSyl: "SE-dia", en: "chair", x: X, y: Y, steht: true, kunst: k });
}
/* =====================================================================
   DIE AUGENOPTIKERIN — steht neben dem Messplatz und stellt die Gläser ein
   ===================================================================== */
{
  const m = B.mensch({ id: "b04b_optikerin", geschlecht: "w", pose: "zeigen", blick: 58, frisur: "zopf", haarfarbe: "schwarz", haut: "mittel", laecheln: true,
    kleidung: { oberteil: { stueck: "bluse", farbe: "weiss" }, unterteil: { stueck: "hose", farbe: "#28344a" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" }, zubehoer: { stueck: "brille" } } }, 96);
  S.teil({ id: "op_optikerin", de: "die Augenoptikerin", syl: "AU-gen-op-ti-ke-rin", it: "l'ottica", itSyl: "OT-ti-ca", en: "optician", x: 238, y: 171, kunst: m.svg,
    tipp: "Sie misst, berät und passt die Brille an." });
}

{
  /* DER BRILLENSTÄNDER — Drehturm mit Sonnenbrillen, vorne im Laden */
  let k = schatten(0, 0, 15, 2, 0.32);
  k += `<ellipse cx="0" cy="-1.4" rx="13" ry="2.6" fill="${S.lg("fuss", [[0, "#3a3d42"], [1, "#16181b"]])}"/><rect x="-1.2" y="-82" width="2.4" height="81" fill="${CHROM}"/>`;
  for (let t = 0; t < 5; t++) {
    const y = -20 - t * 14;
    k += `<path d="M-13 ${y} L13 ${y} L12 ${y + 2.2} L-12 ${y + 2.2} Z" fill="#f2f2ef"/><ellipse cx="0" cy="${y}" rx="13" ry="1.6" fill="#fafaf8"/><rect x="-13" y="${y + 2.2}" width="26" height=".5" fill="#000" opacity=".15"/>`;
    const fs = ["#1d1d1f", "#c9a227", "#6b4a2e", "#7a1f3d", "#b7babd", "#1d1d1f"], fo = ["pilot", "eckig", "rund", "katze", "pilot", "eckig"];
    for (let i = 0; i < 3; i++) {
      const x = -8.4 + i * 8.4, f = fs[(i + t) % 6];
      k += brille(x, y - 3, 7.4, fo[(i + t * 2) % 6], f, (i + t) % 3 === 2 ? "#5a4a2a" : "#2a2d33", 0.5);
      k += `<path d="M${r(x - 2.4)} ${y - 4.6} l1 -.6" stroke="#fff" stroke-width=".35" opacity=".45"/>`;
    }
  }
  k += `<rect x="-11" y="-98" width="22" height="9" rx="1" fill="#2c3e50"/><text x="0" y="-92.4" font-size="3.4" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-weight="bold" letter-spacing=".4">SONNE</text><text x="0" y="-89.8" font-size="1.7" text-anchor="middle" fill="#f2c94c" font-family="Arial,sans-serif">UV 400 · ab 39 €</text>`;
  S.teil({ id: "op_brillenstaender", de: "der Brillenständer", syl: "BRIL-len-stän-der", it: "l'espositore girevole", itSyl: "e-spo-si-TO-re gi-RE-vo-le", en: "glasses stand", x: 30, y: 192, steht: true, kunst: k,
    tipp: "Der Ständer dreht sich – so sieht man alle Sonnenbrillen." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/optiker.js"));
console.log(aus);
