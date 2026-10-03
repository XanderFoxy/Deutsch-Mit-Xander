#!/usr/bin/env node
/* =====================================================================
   DAS POSTAMT (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (Deutsche Post: Filialen/Partnerfilialen, Modernisierung
   mit neuen Etiketten- und Bondruckern; Porto seit 1.1.2025):
   - Ein durchgehender SCHALTER mit mehreren Plätzen, über jedem eine
     Nummer; seit 2020 Glasscheiben mit einer DURCHREICHE unten.
   - Auf der Kundenseite: die PAKETWAAGE mit Anzeige zur Kundschaft,
     das Kartenlesegerät, ein Kugelschreiber an der Kette, ein kleiner
     Aufsteller mit den neuen Sonderbriefmarken.
   - Auf der Personalseite: Bildschirm, ETIKETTENDRUCKER (der Paket-
     aufkleber kommt aus dem Drucker), dahinter gelbe ROLLBEHÄLTER, in
     denen die Pakete gesammelt werden.
   - Im Raum: ein VERKAUFSREGAL mit Postkarten, Glückwunschkarten,
     Umschlägen, Versandtaschen und Kartons (Packsets S/M/L), ein
     PACKTISCH mit Klebeband und Schere, eine Absperrung „Bitte hier
     warten“ (Diskretionsabstand), Formulare in einem Wandhalter.
   - Draußen vor dem Schaufenster: der gelbe BRIEFKASTEN (Leerung durch
     den Postboten) und die PACKSTATION.
   - Porto 2025: Standardbrief 0,95 €, Postkarte 0,95 €, Kompaktbrief
     1,10 €, Großbrief 1,80 €, Maxibrief 2,90 €.
   BLICK: leicht erhöhte Kamera (Augenhöhe 2,2 m), Fluchtpunkt in der
   Mitte; links die Glasfront zur Straße, rechts der lange Schalter.
   Maßstab: Rückwand 34 Einheiten je Meter, Schalterfront 51 je Meter
   (Schalterhöhe 1,05 m), Postbeamter 1,70 m.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "postamt", titel: "Das Postamt", emoji: "📮", thema: "Unterwegs", kuerzel: "b01a", fassung: 852 });
const rnd = zufall(1490);
const r = B.r;

/* ---------- Kamera: ein Fluchtpunkt, Rückwand bei z = 0 --------------- */
const HY = 50, E = 2.2, D = 6, S0 = 34, VX = 160;
const sk = (z) => S0 * D / (D - z);                       // Einheiten je Meter in der Tiefe z
const P = (X, H, z) => [r(VX + X * sk(z)), r(HY + (E - H) * sk(z))];
const poly = (pts, fill, extra = "") => `<path d="M${pts.map((p) => p[0] + " " + p[1]).join(" L")} Z" fill="${fill}"${extra ? " " + extra : ""}/>`;
const um = (ox, oy, svg) => `<g transform="translate(${r(-ox)} ${r(-oy)})">${svg}</g>`;
/* Quader im Raum: Vorderseite, Deckel (unter Augenhöhe) und die sichtbare Seite */
function kiste(X0, X1, H0, H1, z0, z1, f) {
  let g = "";
  if (X1 < 0 && f.seite) g += poly([P(X1, H0, z1), P(X1, H0, z0), P(X1, H1, z0), P(X1, H1, z1)], f.seite);
  if (X0 > 0 && f.seite) g += poly([P(X0, H0, z1), P(X0, H0, z0), P(X0, H1, z0), P(X0, H1, z1)], f.seite);
  if (H1 < E && f.deckel) g += poly([P(X0, H1, z1), P(X1, H1, z1), P(X1, H1, z0), P(X0, H1, z0)], f.deckel);
  g += poly([P(X0, H0, z1), P(X1, H0, z1), P(X1, H1, z1), P(X0, H1, z1)], f.vorn);
  return g;
}

/* ---------- Grundfarben und Stoffe ---------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const GELB = "#ffcc00";
const GELB_V = S.lg("gelb", [[0, "#ffd83a"], [0.6, "#f9c600"], [1, "#e0b000"]]);
const WAND = S.lg("wand", [[0, "#f4f3ef"], [1, "#e3e0d8"]]);
const DECKE = S.lg("decke", [[0, "#e9e8e4"], [1, "#f6f5f2"]]);
const STAHL = S.lg("stahl", [[0, "#eef1f3"], [0.45, "#c9cfd4"], [0.55, "#b5bcc2"], [1, "#e1e5e8"]], 0, 0, 1, 0);
const ALU = S.lg("alu", [[0, "#d9dde0"], [1, "#9aa2a8"]], 0, 0, 1, 0);
const FRONT = S.lg("front", [[0, "#f3f3f1"], [0.7, "#dedcd7"], [1, "#c9c6bf"]]);
const KARTON = S.lg("karton", [[0, "#d2a46a"], [1, "#b78849"]]);
const KARTON_D = "#9e7038";
const GLAS = S.lg("glas", [[0, "#ffffff", 0.34], [0.45, "#e8f4f7", 0.07], [1, "#ffffff", 0.2]], 0, 0, 1, 1);
const HORN = (x, y, k, f = "#111") => `<g transform="translate(${x} ${y}) scale(${k})"><path d="M-6 1.6 Q-6 -3 -1.6 -3 L3 -3 L6 -5.4 L6 3.4 L3 1 L-1.6 1 Q-3 1 -3 2.4 Q-3 3.6 -1.6 3.6 L1.2 3.6 L1.2 5 L-1.6 5 Q-6 5 -6 1.6 Z" fill="${f}"/><circle cx="-1.2" cy="-.9" r="1" fill="${f === "#111" ? GELB : "#111"}"/></g>`;

/* =====================================================================
   KULISSE — Rasterdecke, Rückwand mit Glasfront, Steinboden
   ===================================================================== */
const WAND_UNTEN = P(0, 0, 0)[1];        // 124.8
const DECKE_Y = P(0, 3.2, 0)[1];         // 16
{
  let k = `<rect x="0" y="0" width="320" height="${DECKE_Y}" fill="${DECKE}"/>`;
  /* Rasterdecke 62,5 cm mit eingelassenen LED-Feldern */
  for (let i = -12; i <= 12; i++) { const X = i * 0.625; k += `<line x1="${r(VX + X * S0)}" y1="${DECKE_Y}" x2="${r(VX + X * 50)}" y2="0" stroke="#cfcdc7" stroke-width=".35"/>`; }
  for (const z of [0.625, 1.25]) k += `<line x1="0" y1="${P(0, 3.2, z)[1]}" x2="320" y2="${P(0, 3.2, z)[1]}" stroke="#cfcdc7" stroke-width=".35"/>`;
  for (const X of [-3.125, -0.625, 1.875, 4.375]) k += poly([P(X, 3.2, 0.625), P(X + 0.625, 3.2, 0.625), P(X + 0.625, 3.2, 0), P(X, 3.2, 0)], "#fffef6", 'stroke="#e4e2da" stroke-width=".3"');
  k += `<rect x="0" y="${DECKE_Y - 1.2}" width="320" height="1.2" fill="#d4d1c9"/>`;
  /* Rückwand */
  k += `<rect x="0" y="${DECKE_Y}" width="320" height="${r(WAND_UNTEN - DECKE_Y)}" fill="${WAND}"/>`;
  k += `<rect x="0" y="${DECKE_Y}" width="320" height="${r(WAND_UNTEN - DECKE_Y)}" fill="${S.rg("wandlicht", [[0, "#fffdf2", 0.6], [1, "#fffdf2", 0]], 0.6, 0.1, 0.6)}"/>`;
  /* Personalbereich: gelbes Wandfeld hinter dem Schalter */
  k += `<rect x="166" y="${DECKE_Y}" width="154" height="${r(WAND_UNTEN - DECKE_Y)}" fill="#ecebe6"/>`;
  k += `<rect x="166" y="70" width="154" height="${r(WAND_UNTEN - 70)}" fill="${S.lg("personalwand", [[0, "#e4e2dc"], [1, "#d6d3cb"]])}"/>`;
  k += `<rect x="102" y="${r(WAND_UNTEN - 2.4)}" width="218" height="2.4" fill="#9a968e"/>`;
  /* Tür ins Lager (Personal), rechts hinten */
  k += `<rect x="300" y="${r(WAND_UNTEN - 71)}" width="22" height="71" fill="#cdc9bf"/><rect x="302" y="${r(WAND_UNTEN - 69)}" width="20" height="69" fill="${S.lg("lagertuer", [[0, "#bdb8ad"], [1, "#a9a397"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="304" y="${r(WAND_UNTEN - 50)}" width="12" height="5" rx=".5" fill="#f6f5f0"/><text x="310" y="${r(WAND_UNTEN - 46.8)}" font-size="1.6" text-anchor="middle" fill="#444" font-family="Arial">Nur Personal</text>`;
  S.hinten(k);
}
/* Glasfront mit Blick auf die Straße (links): Schiebetür und Schaufenster */
const FX0 = 2, FX1 = 100, FY0 = P(0, 2.7, 0)[1];      // Oberkante Glas
{
  S.def(`<clipPath id="${S.id("aussen")}"><rect x="${FX0}" y="${FY0}" width="${FX1 - FX0}" height="${r(WAND_UNTEN - FY0)}"/></clipPath>`);
  let a = "";
  /* gegenüberliegende Häuserzeile (z = -13 m) */
  const yHaus = P(0, 0, -13)[1];
  a += `<rect x="0" y="${FY0}" width="110" height="${r(yHaus - FY0)}" fill="${S.lg("haus", [[0, "#dcc7a3"], [1, "#cdb48b"]])}"/>`;
  for (const x of [6, 26, 46, 66, 86]) {
    a += `<rect x="${x}" y="${FY0}" width="10" height="3" fill="#7d8c99"/>`;
    a += `<rect x="${x - 3}" y="${r(yHaus - 20)}" width="16" height="16" fill="${S.lg("schaufenster2", [[0, "#5d6f7c"], [1, "#8ea2ae"]])}" stroke="#8a7457" stroke-width=".6"/>`;
  }
  a += `<path d="M0 ${r(yHaus - 23)} L110 ${r(yHaus - 23)} L110 ${r(yHaus - 20)} L0 ${r(yHaus - 20)} Z" fill="#a33b32"/>`;
  a += `<text x="36" y="${r(yHaus - 21)}" font-size="2" fill="#fff" font-family="Arial" font-weight="bold">BLUMEN · OPTIK</text>`;
  /* Gehweg gegenüber, Straße, unser Gehweg mit Pflaster */
  const yG = P(0, 0, -10)[1], yK = P(0, 0, -3)[1];
  a += `<rect x="0" y="${r(yHaus)}" width="110" height="${r(yG - yHaus)}" fill="#bdb8ae"/>`;
  a += `<rect x="0" y="${r(yG)}" width="110" height="${r(yK - yG)}" fill="${S.lg("strasse", [[0, "#5d6063"], [1, "#4a4d50"]])}"/>`;
  a += `<path d="M0 ${r((yG + yK) / 2)} H110" stroke="#f1f1ea" stroke-width=".8" stroke-dasharray="8 6"/>`;
  a += `<rect x="0" y="${r(yK)}" width="110" height="${r(WAND_UNTEN - yK)}" fill="${S.lg("gehweg", [[0, "#b9b5ad"], [1, "#cfcac0"]])}"/>`;
  a += `<rect x="0" y="${r(yK - 0.8)}" width="110" height="1.6" fill="#e2ded6"/>`;
  for (const z of [-2.4, -1.8, -1.2, -0.6]) a += `<line x1="0" y1="${P(0, 0, z)[1]}" x2="110" y2="${P(0, 0, z)[1]}" stroke="#a29d93" stroke-width=".3"/>`;
  for (let i = -7; i <= -1; i++) { const X = i * 0.6; a += `<line x1="${P(X, 0, -3)[0]}" y1="${r(yK)}" x2="${P(X, 0, 0)[0]}" y2="${r(WAND_UNTEN)}" stroke="#a29d93" stroke-width=".3"/>`; }
  /* ein Baum am Straßenrand */
  a += `<rect x="58" y="${r(yK - 26)}" width="1.6" height="26" fill="#5a4630"/><ellipse cx="59" cy="${r(yK - 32)}" rx="11" ry="9" fill="${S.rg("baum", [[0, "#7fae5a"], [1, "#4d7f39"]])}"/>`;
  S.hinten(`<g clip-path="url(#${S.id("aussen")})">${a}</g>`);
  /* Rahmen unten (Sockel der Glasfront) und Pfeiler */
  S.hinten(`<rect x="0" y="${r(WAND_UNTEN - 2.6)}" width="${FX1 + 2}" height="2.6" fill="#7d8287"/>`);
  S.hinten(`<rect x="0" y="${DECKE_Y}" width="${FX1 + 2}" height="${r(FY0 - DECKE_Y)}" fill="#e9e7e1"/>`);
  S.hinten(`<rect x="${FX1}" y="${DECKE_Y}" width="16" height="${r(WAND_UNTEN - DECKE_Y)}" fill="${S.lg("pfeiler", [[0, "#efede8"], [1, "#d9d6cf"]], 0, 0, 1, 0)}"/>`);
}
/* Steinboden 60 × 60 cm in Fluchtperspektive */
{
  let f = `<rect x="0" y="${WAND_UNTEN}" width="320" height="${r(200 - WAND_UNTEN)}" fill="${S.lg("boden", [[0, "#cfccc5"], [1, "#bab6ad"]])}"/>`;
  for (let i = -16; i <= 16; i++) { const X = i * 0.6; f += `<line x1="${P(X, 0, 0)[0]}" y1="${WAND_UNTEN}" x2="${P(X, 0, 3.05)[0]}" y2="${P(X, 0, 3.05)[1]}" stroke="#9f9b92" stroke-width=".35"/>`; }
  for (const z of [0.6, 1.2, 1.8, 2.4]) f += `<line x1="0" y1="${P(0, 0, z)[1]}" x2="320" y2="${P(0, 0, z)[1]}" stroke="#9f9b92" stroke-width=".35"/>`;
  f += `<rect x="0" y="${WAND_UNTEN}" width="320" height="${r(200 - WAND_UNTEN)}" fill="${S.lg("bodenlicht", [[0, "#000", 0.12], [0.4, "#000", 0], [1, "#fff", 0.08]])}"/>`;
  S.hinten(f);
}

/* =====================================================================
   DRAUSSEN: PACKSTATION, POSTBOTE, BRIEFKASTEN (hinter der Glasfront)
   ===================================================================== */
{
  /* Packstation: gelbe Fächerwand mit Bedienteil in der Mitte */
  const z = -2.2, X0 = -5.6, X1 = -3.45, H = 1.95;
  const [x0, yu] = P(X0, 0, z), [x1] = P(X1, 0, z), yo = P(0, H, z)[1];
  let k = schatten((x0 + x1) / 2, yu, (x1 - x0) / 2 + 2, 1.4, 0.3);
  k += `<rect x="${x0}" y="${r(yo)}" width="${r(x1 - x0)}" height="${r(yu - yo)}" rx=".8" fill="${GELB_V}"/>`;
  k += `<rect x="${x0}" y="${r(yo)}" width="${r(x1 - x0)}" height="3.2" rx=".6" fill="#e9b800"/>`;
  k += `<text x="${r((x0 + x1) / 2)}" y="${r(yo + 2.4)}" font-size="2.2" text-anchor="middle" fill="#c8102e" font-family="Arial" font-weight="bold" font-style="italic">Packstation</text>`;
  const cols = 5, w = (x1 - x0 - 2) / cols;
  for (let c = 0; c < cols; c++) {
    const cx = x0 + 1 + c * w;
    if (c === 2) {
      k += `<rect x="${r(cx + 0.4)}" y="${r(yo + 8)}" width="${r(w - 0.8)}" height="10" rx=".6" fill="#3a3d42"/><rect x="${r(cx + 1.2)}" y="${r(yo + 9)}" width="${r(w - 2.4)}" height="5.6" fill="#7cc4e6"/>`;
      k += `<rect x="${r(cx + 1.4)}" y="${r(yo + 20)}" width="${r(w - 2.8)}" height="3" rx=".4" fill="#2a2d31"/>`;
      continue;
    }
    for (let j = 0; j < 6; j++) { const hh = (yu - yo - 6) / 6; k += `<rect x="${r(cx + 0.3)}" y="${r(yo + 4 + j * hh)}" width="${r(w - 0.6)}" height="${r(hh - 0.6)}" rx=".3" fill="none" stroke="#c99f00" stroke-width=".35"/><rect x="${r(cx + w - 2)}" y="${r(yo + 4 + j * hh + hh / 2 - 0.6)}" width=".8" height="1.2" fill="#8a7000"/>`; }
  }
  S.teil({ id: "packstation", de: "die Packstation", syl: "PACK-sta-tion", it: "la stazione pacchi", itSyl: "sta-ZIO-ne PAC-chi", en: "parcel locker", x: (x0 + x1) / 2, y: yu, steht: true, kunst: um((x0 + x1) / 2, yu, k),
    tipp: "An der Packstation holt man Pakete rund um die Uhr ab." });
}
{
  /* Der Postbote leert den Briefkasten: gelbe Jacke, dunkelblaue Hose */
  const z = -1.2, [px, py] = P(-3.05, 0, z);
  const m = B.mensch({ id: "b01a_bote", geschlecht: "m", pose: "halten", blick: 100, frisur: "kurz", haarfarbe: "braun", haut: "mittel",
    kleidung: { oberteil: { stueck: "hemd", farbe: "#f6c800" }, jacke: { stueck: "jacke", farbe: "#f2c200" }, unterteil: { stueck: "hose", farbe: "#22304d" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" }, kopf: { stueck: "kappe", farbe: "#22304d" } } }, 1.8 * sk(z));
  S.teil({ id: "postbote", de: "der Postbote", syl: "POST-bo-te", it: "il postino", itSyl: "po-STI-no", en: "postman", x: px, y: py, kunst: m.svg,
    tipp: "Der Postbote leert den Briefkasten und bringt die Briefe zum Briefzentrum." });
}
{
  /* Der gelbe Briefkasten am Pfosten, mit Posthorn und Leerungszeiten */
  const z = -0.7, s = sk(z), [bx, by] = P(-2.42, 0, z);
  const w = 0.44 * s, h = 0.62 * s, pf = 0.68 * s;
  let k = schatten(0, 0, w * 0.7, 1, 0.3);
  k += `<rect x="-1.2" y="${r(-pf)}" width="2.4" height="${r(pf)}" fill="${ALU}"/>`;
  k += `<path d="M${r(-w / 2)} ${r(-pf)} L${r(-w / 2)} ${r(-pf - h + 3)} Q${r(-w / 2)} ${r(-pf - h)} 0 ${r(-pf - h)} Q${r(w / 2)} ${r(-pf - h)} ${r(w / 2)} ${r(-pf - h + 3)} L${r(w / 2)} ${r(-pf)} Z" fill="${GELB_V}" stroke="#c99f00" stroke-width=".3"/>`;
  k += `<rect x="${r(-w / 2 + 1.5)}" y="${r(-pf - h + 5)}" width="${r(w - 3)}" height="1.8" rx=".8" fill="#2a2a2a"/>`;
  k += `<text x="0" y="${r(-pf - h + 9.4)}" font-size="1.7" text-anchor="middle" fill="#111" font-family="Arial" font-weight="bold">Briefe</text>`;
  k += HORN(0, r(-pf - h + 13.4), 0.55);
  k += `<rect x="${r(-w / 2 + 2)}" y="${r(-pf - 5)}" width="${r(w - 4)}" height="3.6" fill="#fff"/><text x="0" y="${r(-pf - 3.6)}" font-size="1" text-anchor="middle" fill="#333" font-family="Arial">Leerung</text><text x="0" y="${r(-pf - 2.2)}" font-size="1" text-anchor="middle" fill="#333" font-family="Arial">Mo–Fr 17:30</text>`;
  k += `<path d="M${r(-w / 2 + 0.8)} ${r(-pf - h + 3)} L${r(-w / 2 + 0.8)} ${r(-pf - 1)}" stroke="#fff3a6" stroke-width=".7" opacity=".8"/>`;
  S.teil({ id: "briefkasten", de: "der Briefkasten", syl: "BRIEF-kas-ten", it: "la cassetta postale", itSyl: "cas-SET-ta po-STA-le", en: "letterbox", x: bx, y: by, steht: true, kunst: k,
    tipp: "Der Briefkasten der Post ist gelb. Auf dem Schild steht, wann er geleert wird." });
}

/* =====================================================================
   RÜCKWAND: SCHILD, UHR, PLAKAT, FORMULARE
   ===================================================================== */
{
  let k = `<rect x="-77" y="-7" width="154" height="14" fill="${GELB_V}"/><rect x="-77" y="6" width="154" height="1" fill="#d6aa00"/>`;
  k += HORN(-62, -0.4, 0.95);
  k += `<text x="-52" y="3.4" font-size="9" fill="#111" font-family="Arial,Helvetica,sans-serif" font-weight="bold" font-style="italic">Post</text>`;
  k += `<text x="40" y="2.2" font-size="3.6" text-anchor="middle" fill="#111" font-family="Arial,sans-serif" letter-spacing=".3">Briefe · Pakete · Briefmarken</text>`;
  S.teil({ id: "schild", de: "das Schild", syl: "SCHILD", it: "l'insegna", itSyl: "in-SE-gna", en: "sign", x: 243, y: 26, kunst: k });
}
{
  let k = `<circle r="7.6" fill="#2b2b2b"/><circle r="6.8" fill="${S.rg("ziffer", [[0, "#ffffff"], [1, "#ebebe7"]])}"/>`;
  for (let i = 0; i < 12; i++) {
    const a = i * Math.PI / 6, q = i % 3 ? 5.2 : 4.4;
    k += `<line x1="${r(Math.sin(a) * 6)}" y1="${r(-Math.cos(a) * 6)}" x2="${r(Math.sin(a) * q)}" y2="${r(-Math.cos(a) * q)}" stroke="#222" stroke-width="${i % 3 ? 0.3 : 0.6}"/>`;
  }
  /* zehn nach zehn – Vormittag in der Filiale */
  k += `<line x1="0" y1="0" x2="${r(Math.sin(10.17 * Math.PI / 6) * 3.3)}" y2="${r(-Math.cos(10.17 * Math.PI / 6) * 3.3)}" stroke="#111" stroke-width=".8" stroke-linecap="round"/>`;
  k += `<line x1="0" y1="0" x2="${r(Math.sin(2 * Math.PI / 6) * 5)}" y2="${r(-Math.cos(2 * Math.PI / 6) * 5)}" stroke="#111" stroke-width=".5" stroke-linecap="round"/>`;
  k += `<circle r=".6" fill="#c8102e"/><path d="M-4.4 -5 A6.8 6.8 0 0 1 3.4 -5.8" stroke="#fff" stroke-width=".7" opacity=".6" fill="none"/>`;
  S.teil({ id: "uhr", de: "die Uhr", syl: "UHR", it: "l'orologio", itSyl: "o-ro-LO-gio", en: "clock", x: 182, y: 46, kunst: k });
}
{
  /* Plakat mit den Portopreisen 2025 */
  let k = `<rect x="-21" y="-17" width="42" height="34" fill="#fffef8" stroke="#bdb8ab" stroke-width=".4"/>`;
  k += `<rect x="-21" y="-17" width="42" height="9" fill="${GELB_V}"/>`;
  k += HORN(-15.5, -12.6, 0.42);
  k += `<text x="2" y="-11.4" font-size="3.6" text-anchor="middle" fill="#111" font-family="Arial" font-weight="bold">Unsere Preise</text>`;
  const zeilen = [["Postkarte", "0,95 €"], ["Standardbrief", "0,95 €"], ["Kompaktbrief", "1,10 €"], ["Großbrief", "1,80 €"], ["Maxibrief", "2,90 €"]];
  zeilen.forEach(([a, b], i) => {
    const y = -3.6 + i * 4.2;
    k += `<text x="-18" y="${r(y)}" font-size="2.6" fill="#222" font-family="Arial">${a}</text><text x="18" y="${r(y)}" font-size="2.6" text-anchor="end" fill="#222" font-family="Arial" font-weight="bold">${b}</text>`;
    k += `<line x1="-18" y1="${r(y + 1.2)}" x2="18" y2="${r(y + 1.2)}" stroke="#e1ddd2" stroke-width=".25"/>`;
  });
  k += `<text x="0" y="15.6" font-size="1.7" text-anchor="middle" fill="#777" font-family="Arial">gültig seit 1. Januar 2025</text>`;
  S.teil({ id: "plakat", de: "das Plakat", syl: "pla-KAT", it: "il manifesto", itSyl: "ma-ni-FE-sto", en: "poster", x: 139, y: 41, kunst: k,
    tipp: "Ein Standardbrief kostet in Deutschland 95 Cent." });
}
{
  /* Formularhalter aus Acryl am Pfeiler, drei Fächer */
  let k = "";
  for (let i = 0; i < 3; i++) {
    const y = i * 8.4;
    k += `<rect x="-5.2" y="${r(y - 1.6)}" width="10.4" height="7.4" fill="${["#ffffff", "#fff3b0", "#e4eef8"][i]}" stroke="#c9c5bb" stroke-width=".25"/>`;
    k += `<rect x="-4" y="${r(y - 0.4)}" width="6" height=".6" fill="#555"/>`;
    for (let j = 0; j < 3; j++) k += `<rect x="-4" y="${r(y + 1 + j * 1.3)}" width="${r(8 - j * 1.5)}" height=".35" fill="#999"/>`;
    k += `<path d="M-6 ${r(y + 1.6)} L6 ${r(y + 1.6)} L6 ${r(y + 6.2)} L-6 ${r(y + 6.2)} Z" fill="#e8f1f4" opacity=".55" stroke="#aebfc6" stroke-width=".3"/>`;
  }
  S.teil({ id: "formular", de: "das Formular", syl: "For-mu-LAR", it: "il modulo", itSyl: "MO-du-lo", en: "form", x: 108, y: 76, kunst: k,
    tipp: "Für ein Einschreiben oder einen Nachsendeauftrag füllt man ein Formular aus." });
}

/* =====================================================================
   PERSONALBEREICH: ROLLBEHÄLTER mit gesammelten Paketen
   ===================================================================== */
{
  const z0 = 0.15, z1 = 0.75, X0 = 2.75, X1 = 3.85, H = 1.65;
  let k = "";
  /* Pakete im Behälter (Quader in Perspektive), von hinten nach vorne */
  const pak = [[2.8, 3.3, 0, 0.45], [3.32, 3.8, 0, 0.5], [2.8, 3.35, 0.47, 0.85], [3.36, 3.8, 0.52, 0.8], [2.85, 3.25, 0.87, 1.2], [3.28, 3.78, 0.82, 1.14], [2.95, 3.5, 1.22, 1.45]];
  pak.forEach(([a, b, h0, h1], i) => {
    k += kiste(a, b, h0, h1, z0 + 0.05, z1 - 0.05, { vorn: i % 3 === 2 ? "#e9d9b8" : KARTON, deckel: "#d9b47c", seite: KARTON_D });
    const [lx, ly] = P(a + 0.06, h1 - 0.05, z1 - 0.05);
    k += `<rect x="${lx}" y="${ly}" width="5" height="3.4" fill="#fff"/><rect x="${r(lx + 0.6)}" y="${r(ly + 0.6)}" width="3.8" height=".5" fill="#222"/><rect x="${r(lx + 0.6)}" y="${r(ly + 1.5)}" width="2.6" height=".35" fill="#777"/>`;
  });
  /* Gitter des Rollbehälters (gelb), vorne und seitlich */
  const f = (X, H2, z) => P(X, H2, z);
  for (let i = 0; i <= 6; i++) { const X = X0 + (X1 - X0) * i / 6, a = f(X, 0.08, z1), b = f(X, H, z1); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#e6b800" stroke-width="${i % 6 ? 0.4 : 0.9}"/>`; }
  for (const H2 of [0.08, 0.55, 1.1, H]) { const a = f(X0, H2, z1), b = f(X1, H2, z1); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#e6b800" stroke-width="${H2 === H ? 0.9 : 0.45}"/>`; }
  for (const H2 of [0.55, 1.1, H]) { const a = f(X0, H2, z0), b = f(X0, H2, z1); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#d4a900" stroke-width=".45"/>`; }
  const [ax, ay] = P((X0 + X1) / 2, 0, z1);
  S.teil({ id: "rollbehaelter", de: "der Rollbehälter", syl: "ROLL-be-häl-ter", it: "il roll container", itSyl: "roll con-TAI-ner", en: "roll cage", x: ax, y: ay, steht: true, kunst: um(ax, ay, k),
    tipp: "Im Rollbehälter sammelt die Post die Pakete. Am Abend holt der Lkw sie ab." });
}

/* =====================================================================
   DAS VERKAUFSREGAL — Postkarten, Glückwunschkarten, Umschläge,
   Versandtaschen, Kartons (Lupe)
   ===================================================================== */
const REG = { X0: -1.08, X1: 0.07, z0: 0.62, z1: 1.0 };
const regalUnter = [];
{
  const { X0, X1, z0, z1 } = REG;
  const [ax, ay] = P((X0 + X1) / 2, 0, z1);
  let k = schatten(0, 0, 26, 1.6, 0.32);
  /* Korpus: Rückwand (hell), Seitenwand rechts sichtbar */
  k = um(-ax, -ay, k);
  k += poly([P(X1, 0, z1), P(X1, 0, z0), P(X1, 1.8, z0), P(X1, 1.8, z1)], "#c9c6c0");
  k += poly([P(X0, 0, z0), P(X1, 0, z0), P(X1, 1.8, z0), P(X0, 1.8, z0)], S.lg("regalrueck", [[0, "#f2f1ec"], [1, "#dcd9d2"]]));
  k += kiste(X0, X1, 1.78, 1.84, z0, z1, { vorn: "#fbfbf9", deckel: "#ffffff", seite: "#d9d7d1" });
  k += `<text x="${P((X0 + X1) / 2, 1.8, z1)[0]}" y="${r(P(0, 1.8, z1)[1] - 1.4)}" font-size="0"> </text>`;
  /* Böden */
  const boeden = [0.12, 0.67, 1.22];
  for (const H of boeden) k += kiste(X0, X1, H - 0.03, H, z0, z1, { vorn: "#f7f7f4", deckel: "#e6e4de" });
  k += kiste(X0, X1, 0, 0.09, z0, z1, { vorn: "#55585c" });
  /* Seitenwangen vorne */
  k += kiste(X0 - 0.03, X0, 0, 1.84, z0, z1, { vorn: "#ecebe7" });
  k += kiste(X1 - 0.03, X1, 0, 1.84, z0, z1, { vorn: "#ecebe7", seite: "#cfccc6" });
  /* gelbe Regalleiste mit Preisen */
  for (const H of boeden) {
    const [x0, y0] = P(X0, H - 0.03, z1), [x1] = P(X1, H, z1);
    k += `<rect x="${x0}" y="${r(y0 - 0.2)}" width="${r(x1 - x0)}" height="1.6" fill="${GELB}"/>`;
  }
  const zm = z1 - 0.06;          // Ware steht vorn auf dem Boden
  const ware = (X, H, w, h) => [P(X, H, zm), P(X + w, H, zm), P(X + w, H + h, zm), P(X, H + h, zm)];
  /* Reihe 1 links: Postkarten im Schrägständer */
  let g = "";
  const motiv = [["#7fb7e6", "#d4ae5e"], ["#8cc1ea", "#5c8f4a"], ["#f2b36b", "#2f5d8a"], ["#a8d4f0", "#b54b3b"], ["#6aa6d8", "#e7e2d4"], ["#9cc9ea", "#7a5a3a"]];
  motiv.forEach(([himmel, stadt], i) => {
    const X = X0 + 0.05 + (i % 3) * 0.17, H = 1.27 + Math.floor(i / 3) * 0.2;
    const q = ware(X, H, 0.15, 0.17);
    g += poly(q, himmel, 'stroke="#fff" stroke-width=".35"');
    const [a, b] = [q[0], q[1]];
    g += `<path d="M${a[0] + 0.4} ${a[1] - 0.4} L${a[0] + 0.4} ${a[1] - 2.6} L${a[0] + 1.6} ${a[1] - 2.6} L${a[0] + 1.6} ${a[1] - 4} L${a[0] + 2.6} ${a[1] - 4.6} L${a[0] + 3.4} ${a[1] - 3} L${a[0] + 4.6} ${a[1] - 3} L${a[0] + 4.6} ${a[1] - 2} L${b[0] - 0.4} ${b[1] - 2} L${b[0] - 0.4} ${b[1] - 0.4} Z" fill="${stadt}"/>`;
  });
  k += g;
  regalUnter.push({ id: "postkarte", de: "die Postkarte", syl: "POST-kar-te", it: "la cartolina", itSyl: "car-to-LI-na", en: "postcard",
    q: [X0 + 0.04, 1.23, 0.53, 0.47], tipp: "Eine Postkarte kostet 95 Cent Porto." });
  /* Reihe 1 rechts: Glückwunschkarten (aufgestellt, mit Umschlag) */
  g = "";
  const kfarbe = ["#d94f6b", "#f0c84a", "#5aa0d8", "#7cc07a", "#b07ad0"];
  kfarbe.forEach((c, i) => {
    const X = X0 + 0.6 + i * 0.1, H = 1.25;
    const q = ware(X, H, 0.09, 0.22 + (i % 2) * 0.04);
    g += poly(q, c, 'stroke="#fff" stroke-width=".25"');
    const [cx, cy] = [(q[0][0] + q[1][0]) / 2, (q[0][1] + q[2][1]) / 2];
    g += i % 2 ? `<path d="M${r(cx)} ${r(cy + 1.2)} l-1.2 -1.3 a.7 .7 0 0 1 1.2 -.8 a.7 .7 0 0 1 1.2 .8 Z" fill="#fff"/>` : `<circle cx="${r(cx)}" cy="${r(cy)}" r="1.1" fill="#fff" opacity=".85"/>`;
  });
  const [tx, ty] = P(X0 + 0.83, 1.62, zm);
  g += `<text x="${tx}" y="${ty}" font-size="1.7" text-anchor="middle" fill="#9a2f48" font-family="Georgia" font-style="italic">Alles Gute</text>`;
  k += g;
  regalUnter.push({ id: "glueckwunschkarte", de: "die Glückwunschkarte", syl: "GLÜCK-wunsch-kar-te", it: "il biglietto d'auguri", itSyl: "bi-GLIET-to d'au-GU-ri", en: "greeting card",
    q: [X0 + 0.58, 1.23, 0.5, 0.47] });
  /* Reihe 2 links: Briefumschläge in Packungen */
  g = "";
  for (let i = 0; i < 3; i++) {
    const X = X0 + 0.05 + i * 0.165, q = ware(X, 0.69, 0.15, 0.36 - i * 0.04);
    g += poly(q, "#fbfbf8", 'stroke="#c9c7c0" stroke-width=".3"');
    const [a, b, c] = [q[0], q[1], q[2]];
    g += `<path d="M${a[0]} ${c[1]} L${r((a[0] + b[0]) / 2)} ${r(c[1] + 3)} L${b[0]} ${c[1]}" stroke="#c9c7c0" stroke-width=".3" fill="none"/>`;
    g += `<rect x="${r(a[0] + 0.6)}" y="${r(a[1] - 4)}" width="${r(b[0] - a[0] - 1.2)}" height="2.6" fill="${GELB}"/><text x="${r((a[0] + b[0]) / 2)}" y="${r(a[1] - 2.1)}" font-size="1.6" text-anchor="middle" fill="#111" font-family="Arial" font-weight="bold">${["C6", "DL", "C5"][i]}</text>`;
  }
  k += g;
  regalUnter.push({ id: "umschlag", de: "der Umschlag", syl: "UM-schlag", it: "la busta", itSyl: "BU-sta", en: "envelope", q: [X0 + 0.04, 0.68, 0.52, 0.47] });
  /* Reihe 2 rechts: Versandtaschen mit Luftpolster */
  g = "";
  for (let i = 0; i < 3; i++) {
    const X = X0 + 0.6 + i * 0.16, q = ware(X, 0.69, 0.15, 0.42 - i * 0.03);
    g += poly(q, i === 1 ? "#f3f1ea" : "#d8b98a", 'stroke="#a88c5e" stroke-width=".3"');
    g += `<rect x="${r(q[3][0])}" y="${r(q[3][1])}" width="${r(q[1][0] - q[0][0])}" height="1.4" fill="${i === 1 ? "#e2ded3" : "#c9a674"}"/>`;
    for (let j = 0; j < 9; j++) g += `<circle cx="${r(q[0][0] + 1 + (j % 3) * 2)}" cy="${r(q[0][1] - 2 - Math.floor(j / 3) * 2.2)}" r=".45" fill="#fff" opacity=".35"/>`;
  }
  k += g;
  regalUnter.push({ id: "versandtasche", de: "die Versandtasche", syl: "ver-SAND-ta-sche", it: "la busta imbottita", itSyl: "BU-sta im-bot-TI-ta", en: "padded envelope",
    q: [X0 + 0.58, 0.68, 0.5, 0.47], tipp: "In der Versandtasche schützt ein Luftpolster den Inhalt." });
  /* Reihe 3: Kartons in drei Größen (gefaltet und aufgebaut) */
  g = "";
  [[X0 + 0.05, X0 + 0.35, 0.3, "S"], [X0 + 0.38, X0 + 0.72, 0.38, "M"], [X0 + 0.75, X1 - 0.06, 0.48, "L"]].forEach(([a, b, h, gr]) => {
    g += kiste(a, b, 0.13, 0.13 + h, z0 + 0.05, z1 - 0.04, { vorn: KARTON, deckel: "#dcb47c", seite: KARTON_D });
    const [lx, ly] = P(a + 0.03, 0.13 + h - 0.05, z1 - 0.04), [rx] = P(b - 0.03, 0, z1);
    g += `<rect x="${lx}" y="${ly}" width="${r(rx - lx)}" height="3.2" fill="${GELB}"/><text x="${r((lx + rx) / 2)}" y="${r(ly + 2.4)}" font-size="2.2" text-anchor="middle" fill="#111" font-family="Arial" font-weight="bold">${gr}</text>`;
    const [ux, uy] = P(a + 0.03, 0.18, z1 - 0.04);
    g += `<line x1="${ux}" y1="${uy}" x2="${r(rx)}" y2="${uy}" stroke="#8d6230" stroke-width=".3"/>`;
  });
  k += g;
  regalUnter.push({ id: "karton", de: "der Karton", syl: "kar-TON", it: "lo scatolone", itSyl: "sca-to-LO-ne", en: "cardboard box", q: [X0 + 0.04, 0.13, 1.06, 0.52],
    tipp: "Die Kartons gibt es in den Größen S, M und L – passend für ein Paket." });
  /* Schild oben am Regal */
  const [sx0, sy0] = P(X0, 1.84, z1), [sx1] = P(X1, 1.84, z1);
  k += `<rect x="${sx0}" y="${r(sy0 - 5)}" width="${r(sx1 - sx0)}" height="5" fill="#222"/><text x="${r((sx0 + sx1) / 2)}" y="${r(sy0 - 1.4)}" font-size="3" text-anchor="middle" fill="${GELB}" font-family="Arial" font-weight="bold">Alles zum Verschicken</text>`;
  const unter = regalUnter.map((u) => {
    const [X, H, w, h] = u.q, [x0, y1] = P(X, H, z1), [x1, y0] = P(X + w, H + h, z1);
    const o = Object.assign({}, u, { x: ax, y: ay, kunst: flaeche(x0 - ax, y0 - ay, x1 - x0, y1 - y0) });
    delete o.q; return o;
  });
  S.teil({ id: "regal", de: "das Regal", syl: "re-GAL", it: "lo scaffale", itSyl: "scaf-FA-le", en: "shelf", x: ax, y: ay, steht: true, kunst: um(ax, ay, k),
    zoom: { x: 86, y: 60, w: 114, h: 76 }, unter,
    tipp: "Im Regal gibt es alles zum Verschicken: Karten, Umschläge und Kartons." });
}

/* =====================================================================
   DER POSTBEAMTE (hinter dem Schalter 1)
   ===================================================================== */
const ZT = { hinten: 1.2, glas: 1.55, vorn: 2.0, H: 1.05 };
{
  const [bx, by] = P(0.7, 0, 0.95);
  const m = B.mensch({ id: "b01a_beamter", geschlecht: "m", pose: "stehen", blick: 14, frisur: "kurz", haarfarbe: "dunkelbraun", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "hemd", farbe: "#f4c400" }, unterteil: { stueck: "anzughose", farbe: "#22304d" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" }, zubehoer: { stueck: "brille" } } }, 1.72 * sk(0.95));
  S.teil({ id: "beamter", de: "der Postbeamte", syl: "POST-be-am-te", it: "l'impiegato", itSyl: "im-pie-GA-to", en: "postal clerk", x: bx, y: by, kunst: m.svg,
    tipp: "Der Postbeamte wiegt das Paket und klebt den Paketschein auf." });
}

/* =====================================================================
   DER SCHALTER (zwei Plätze mit Glasscheibe) — Lupe: Ablage, Glas,
   Durchreiche
   ===================================================================== */
const XL = 0.157, XM = 2.0, XR = 3.6;         // linkes Ende, Trennwand, rechts aus dem Bild
const DR = [0.5, 0.86];                      // Durchreiche an Platz 1 (X)
{
  const { hinten: zh, glas: zg, vorn: zv, H } = ZT;
  const [ax, ay] = P(1.0, 0, zv);
  const cut = (p) => [Math.min(p[0], 322), p[1]];
  let k = poly([P(XL - 0.05, 0, zv + 0.12), cut(P(XR, 0, zv + 0.12)), cut(P(XR, 0, zv)), P(XL, 0, zv)], "#1b120a", 'opacity=".18" filter="url(#bw_weich)"');
  /* Arbeitsplatte (hell) mit Vorderkante */
  k += poly([P(XL, H, zv), cut(P(XR, H, zv)), cut(P(XR, H, zh)), P(XL, H, zh)], S.lg("platte", [[0, "#cfcdc8"], [1, "#efeeea"]]));
  k += poly([P(XL, H - 0.035, zv), cut(P(XR, H - 0.035, zv)), cut(P(XR, H, zv)), P(XL, H, zv)], "#f8f8f6");
  /* linke Stirnseite (schmal sichtbar) */
  k += poly([P(XL, 0, zv), P(XL, 0, zh), P(XL, H, zh), P(XL, H, zv)], "#bdbab3");
  /* Front: helle Paneele, gelbes Band, dunkler Sockel */
  k += poly([P(XL, 0.1, zv), cut(P(XR, 0.1, zv)), cut(P(XR, H - 0.035, zv)), P(XL, H - 0.035, zv)], FRONT);
  k += poly([P(XL, 0.62, zv), cut(P(XR, 0.62, zv)), cut(P(XR, 0.72, zv)), P(XL, 0.72, zv)], GELB_V);
  k += poly([P(XL, 0, zv), cut(P(XR, 0, zv)), cut(P(XR, 0.1, zv)), P(XL, 0.1, zv)], "#4e5155");
  for (let X = XL + 0.9; X < 3.5; X += 0.9) { const a = P(X, 0.1, zv), b = P(X, H - 0.04, zv); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#bfbcb5" stroke-width=".35"/>`; }
  /* Posthorn auf der Front von Platz 1 */
  const [hx, hy] = P(0.7, 0.88, zv);
  k += HORN(hx, hy, 1.15);
  /* Glasaufsatz: Rahmen aus Aluminium (Glas selbst in „vorne“), Nummern */
  const gTop = 1.75;
  for (const X of [XL + 0.02, XM, XR]) {
    const a = P(X, H, zg), b = P(X, gTop, zg);
    if (a[0] > 322) continue;
    k += `<rect x="${r(a[0] - 0.7)}" y="${b[1]}" width="1.4" height="${r(a[1] - b[1])}" fill="${ALU}"/>`;
  }
  /* Trennwand zwischen den Plätzen (quer, in Perspektive) */
  k += poly([P(XM, H, zh), P(XM, H, zv - 0.05), P(XM, gTop - 0.1, zv - 0.05), P(XM, gTop, zh)], "#dfe9ec", 'opacity=".55" stroke="#9aa2a8" stroke-width=".4"');
  const [t0x, t0y] = P(XL, gTop, zg), [t1x] = P(XR, gTop, zg);
  k += `<rect x="${t0x}" y="${r(t0y - 1)}" width="${r(Math.min(t1x, 322) - t0x)}" height="1.4" fill="${ALU}"/>`;
  [[0.7, "1", true], [2.85, "2", false]].forEach(([X, n, an]) => {
    const [nx, ny] = P(X, gTop, zg);
    k += `<rect x="${r(nx - 5)}" y="${r(ny - 8)}" width="10" height="7" rx=".8" fill="#2b2b2b"/><rect x="${r(nx - 4.2)}" y="${r(ny - 7.2)}" width="8.4" height="5.4" rx=".5" fill="${an ? GELB : "#6a6a6a"}"/>`;
    k += `<text x="${r(nx)}" y="${r(ny - 2.8)}" font-size="4.6" text-anchor="middle" fill="#111" font-family="Arial" font-weight="bold">${n}</text>`;
  });
  /* Platz 2 geschlossen: Aufsteller hinter der Scheibe */
  const [gx, gy] = P(3.0, H, zh + 0.1);
  k += `<path d="M${r(gx - 9)} ${gy} L${r(gx - 8)} ${r(gy - 9)} L${r(gx + 8)} ${r(gy - 9)} L${r(gx + 9)} ${gy} Z" fill="#fff" stroke="#bbb" stroke-width=".3"/>`;
  k += `<text x="${r(gx)}" y="${r(gy - 5.4)}" font-size="2.2" text-anchor="middle" fill="#c8102e" font-family="Arial" font-weight="bold">Geschlossen</text><text x="${r(gx)}" y="${r(gy - 2.6)}" font-size="1.4" text-anchor="middle" fill="#333" font-family="Arial">Bitte Schalter 1</text>`;
  /* Durchreiche: Ausschnitt unten in der Scheibe */
  const [d0x, d0y] = P(DR[0], H, zg), [d1x, d1y] = P(DR[1], H + 0.12, zg);
  k += `<rect x="${d0x}" y="${d1y}" width="${r(d1x - d0x)}" height="${r(d0y - d1y)}" fill="none" stroke="${ALU}" stroke-width=".7"/>`;
  /* Ablage-Kante (Kundenseite) */
  k += poly([P(XL, H + 0.005, zg), cut(P(XR, H + 0.005, zg)), cut(P(XR, H + 0.025, zg)), P(XL, H + 0.025, zg)], "#9aa2a8");
  const rel = (q) => { const [X0, H0, X1, H1, z] = q, [x0, y1] = P(X0, H0, z), [x1, y0] = P(X1, H1, z); return flaeche(x0 - ax, y0 - ay, x1 - x0, y1 - y0); };
  S.teil({ id: "schalter", de: "der Schalter", syl: "SCHAL-ter", it: "lo sportello", itSyl: "spor-TEL-lo", en: "counter", x: ax, y: ay, steht: true, kunst: um(ax, ay, k),
    zoom: { x: 166, y: 64, w: 90, h: 60 },
    unter: [
      { id: "glasscheibe", de: "die Glasscheibe", syl: "GLAS-schei-be", it: "il vetro", itSyl: "VE-tro", en: "glass pane", x: ax, y: ay, kunst: rel([XL + 0.1, H + 0.2, XM - 0.1, gTop - 0.05, zg]),
        tipp: "Die Glasscheibe schützt die Mitarbeiter am Schalter." },
      { id: "durchreiche", de: "die Durchreiche", syl: "DURCH-rei-che", it: "la fessura", itSyl: "fes-SU-ra", en: "hatch", x: ax, y: ay, kunst: rel([DR[0], H, DR[1], H + 0.13, zg]),
        tipp: "Durch die Durchreiche gibt man Geld, Karte und Briefe." },
      { id: "ablage", de: "die Ablage", syl: "AB-la-ge", it: "il ripiano", itSyl: "ri-PIA-no", en: "ledge", x: ax, y: ay, kunst: (() => { const [x0, y1] = P(XL + 0.05, H, zv), [x1] = P(XM - 0.05, H, zv), y0 = P(0, H, zg)[1]; return flaeche(x0 - ax, y0 - ay, x1 - x0, y1 - y0 + 1.4); })() },
    ],
    tipp: "Am Schalter gibt man Briefe und Pakete ab und kauft Briefmarken." });
}

/* =====================================================================
   AUF DEM SCHALTER — Personalseite (hinter dem Glas) und Kundenseite
   ===================================================================== */
const ZH = ZT.hinten, ZG = ZT.glas, ZV = ZT.vorn, HT = ZT.H;
{
  /* DER BILDSCHIRM — von hinten gesehen, zum Beamten gedreht */
  const [mx, my] = P(1.62, HT, 1.32);
  let k = schatten(0, 0, 6, .8, .25);
  k += `<rect x="-3" y="-1" width="6" height="1" rx=".4" fill="#3a3d42"/><rect x="-.8" y="-5" width="1.6" height="4" fill="#4a4e54"/>`;
  k += `<path d="M-8.4 -16 L8.4 -16 L8 -5 L-8 -5 Z" fill="${S.lg("monitor", [[0, "#3b3f45"], [1, "#24272b"]])}"/>`;
  k += `<rect x="-2.6" y="-12" width="5.2" height="3.4" rx=".6" fill="#2d3035"/><path d="M-8 -15.6 L-3 -15.6 L-8 -9 Z" fill="#fff" opacity=".07"/>`;
  S.teil({ oben: true, id: "bildschirm", de: "der Bildschirm", syl: "BILD-schirm", it: "lo schermo", itSyl: "SCHER-mo", en: "screen", x: mx, y: my, steht: true, kunst: k });
}
{
  /* DER ETIKETTENDRUCKER — der Paketaufkleber kommt heraus */
  const [ex, ey] = P(1.02, HT, 1.32);
  let k = schatten(0, 0, 5.4, .8, .25);
  k += `<path d="M-5 0 L5 0 L5 -6.4 Q5 -8.4 3 -8.4 L-3 -8.4 Q-5 -8.4 -5 -6.4 Z" fill="${S.lg("drucker", [[0, "#f2f2f0"], [1, "#c8c8c4"]])}"/>`;
  k += `<rect x="-5" y="-4" width="10" height="1" fill="#3a3d42"/><circle cx="3.4" cy="-1.8" r=".6" fill="#3ca35a"/>`;
  k += `<path d="M-3.4 -4 L3.4 -4 L3.8 1.4 L-3 1.6 Z" fill="#fff" stroke="#ccc" stroke-width=".2"/>`;
  for (let i = 0; i < 9; i++) k += `<rect x="${r(-2.6 + i * 0.6)}" y="-1.4" width="${i % 3 ? 0.25 : 0.4}" height="2" fill="#222"/>`;
  S.teil({ oben: true, id: "etikettendrucker", de: "der Etikettendrucker", syl: "e-ti-KET-ten-dru-cker", it: "la stampante di etichette", itSyl: "stam-PAN-te di e-ti-CHET-te", en: "label printer", x: ex, y: ey, steht: true, kunst: k,
    tipp: "Der Etikettendrucker druckt den Aufkleber mit Adresse und Sendungsnummer." });
}
{
  /* DIE WAAGE — Paketwaage auf der Kundenseite, Anzeige zur Kundschaft */
  const A = 1.0, Bx = 1.4;
  const pl = [P(A, HT + 0.02, 1.62), P(Bx, HT + 0.02, 1.62), P(Bx, HT + 0.02, 1.95), P(A, HT + 0.02, 1.95)];
  const [wx, wy] = P((A + Bx) / 2, HT, 1.95);
  let k = poly([P(A, HT, 1.95), P(Bx, HT, 1.95), P(Bx, HT + 0.02, 1.95), P(A, HT + 0.02, 1.95)], "#7d868d");
  k += poly([pl[3], pl[2], pl[1], pl[0]], STAHL, 'stroke="#8f979e" stroke-width=".25"');
  /* Kundenanzeige rechts neben der Wiegefläche, schräg zur Kundschaft */
  const [sx, sy] = P(Bx + 0.12, HT, 1.9);
  k += `<path d="M${r(sx - 4.4)} ${sy} L${r(sx + 4.4)} ${sy} L${r(sx + 4)} ${r(sy - 8)} L${r(sx - 4)} ${r(sy - 8)} Z" fill="#2a2d31"/>`;
  k += `<rect x="${r(sx - 3.3)}" y="${r(sy - 7.2)}" width="6.6" height="3.4" fill="#0f1d14"/>`;
  k += `<text x="${r(sx + 3)}" y="${r(sy - 4.6)}" font-size="2.3" text-anchor="end" fill="#7cff8a" font-family="monospace">3,48</text><text x="${r(sx)}" y="${r(sy - 1.4)}" font-size="1.4" text-anchor="middle" fill="#ccc" font-family="Arial">kg</text>`;
  S.teil({ oben: true, id: "waage", de: "die Waage", syl: "WAA-ge", it: "la bilancia", itSyl: "bi-LAN-cia", en: "scales", x: wx, y: wy, steht: true, kunst: um(wx, wy, k),
    tipp: "Auf der Waage wird das Paket gewogen: Das Gewicht bestimmt den Preis." });
}
{
  /* DAS PAKET — auf der Waage, mit Paketaufkleber */
  const k0 = kiste(1.06, 1.34, HT + 0.03, HT + 0.25, 1.68, 1.9, { vorn: KARTON, deckel: "#dcb47c", seite: KARTON_D });
  const [px, py] = P(1.2, HT + 0.03, 1.9);
  let k = k0;
  const [lx, ly] = P(1.1, HT + 0.2, 1.9);
  k += `<rect x="${lx}" y="${ly}" width="7.4" height="5" fill="#fff"/><rect x="${r(lx + 0.6)}" y="${r(ly + 0.6)}" width="3" height=".9" fill="${GELB}"/>`;
  for (let i = 0; i < 10; i++) k += `<rect x="${r(lx + 0.6 + i * 0.6)}" y="${r(ly + 2)}" width="${i % 3 ? 0.25 : 0.4}" height="1.8" fill="#222"/>`;
  const [bx0, by0] = P(1.06, HT + 0.25, 1.79), [bx1, by1] = P(1.34, HT + 0.25, 1.79);
  k += `<line x1="${bx0}" y1="${by0}" x2="${bx1}" y2="${by1}" stroke="#a7834f" stroke-width="1.4" opacity=".7"/>`;
  S.teil({ oben: true, id: "paket", de: "das Paket", syl: "Pa-KET", it: "il pacco", itSyl: "PAC-co", en: "parcel", x: px, y: py, steht: true, kunst: um(px, py, k) });
}
{
  /* DAS KARTENLESEGERÄT — in der Ladeschale, zur Kundschaft gedreht */
  const [kx, ky] = P(0.32, HT, 1.85);
  let k = schatten(0, 0, 3.4, .6, .3);
  k += `<rect x="-3.4" y="-2" width="6.8" height="2" rx=".6" fill="#2a2e33"/>`;
  k += `<path d="M-2.8 -1.4 L2.8 -1.4 L3.2 -11.6 Q3.2 -12.6 2.2 -12.6 L-2.2 -12.6 Q-3.2 -12.6 -3.2 -11.6 Z" fill="#33373d"/>`;
  k += `<rect x="-2.3" y="-11.8" width="4.6" height="3.4" rx=".3" fill="#9cd3e8"/><text x="0" y="-9.6" font-size="1.3" text-anchor="middle" fill="#0b3b52" font-family="Arial">5,49 €</text>`;
  for (let i = 0; i < 12; i++) k += `<rect x="${r(-2.1 + (i % 3) * 1.6)}" y="${r(-7.6 + Math.floor(i / 3) * 1.3)}" width="1.1" height=".9" rx=".2" fill="${i === 9 ? "#d23b30" : i === 11 ? "#3ca35a" : "#5c636b"}"/>`;
  S.teil({ oben: true, id: "kartenlesegeraet", de: "das Kartenlesegerät", syl: "KAR-ten-le-se-ge-rät", it: "il lettore di carte", itSyl: "let-TO-re di CAR-te", en: "card reader", x: kx, y: ky, steht: true, kunst: k });
}
{
  /* DER BRIEF — an die Scheibe gelehnt, frankiert und adressiert */
  const [bx, by] = P(1.78, HT, 1.72);
  let k = `<path d="M-6.6 0 L6.6 0 L7.6 -7 L-5.6 -7 Z" fill="#fbfbf8" stroke="#cfccc4" stroke-width=".25"/>`;
  k += `<rect x="3.8" y="-6.4" width="2.4" height="2.8" fill="#4a7fc0" stroke="#fff" stroke-width=".25" stroke-dasharray=".3 .2"/>`;
  k += `<path d="M-2 -4 h6 M-2.2 -2.9 h5 M-2.4 -1.8 h5.6" stroke="#2b3a66" stroke-width=".3"/>`;
  S.teil({ oben: true, id: "brief", de: "der Brief", syl: "BRIEF", it: "la lettera", itSyl: "LET-te-ra", en: "letter", x: bx, y: by, steht: true, kunst: k + flaeche(-6.8, -7.6, 15, 8),
    tipp: "Ein Brief braucht eine Adresse und eine Briefmarke." });
}
{
  /* DIE BRIEFMARKE — Aufsteller mit den neuen Sondermarken */
  const [mx, my] = P(2.3, HT, 1.84);
  let k = schatten(0, 0, 5, .6, .25);
  k += `<path d="M-5.4 0 L5.4 0 L5 -1 L-5 -1 Z" fill="#c9d6db"/>`;
  k += `<path d="M-5 -1 L5 -1 L5.6 -12.4 L-4.4 -12.4 Z" fill="#e8f2f5" opacity=".6" stroke="#9fb2bb" stroke-width=".3"/>`;
  k += `<rect x="-3.8" y="-11.6" width="8.4" height="9.6" fill="#fff"/>`;
  const farben = ["#c8102e", "#2f6db5", "#3d9a5b", "#f2a900", "#7b4fa3", "#e06a2c"];
  for (let i = 0; i < 6; i++) {
    const x = -3.3 + (i % 3) * 2.7, y = -11.1 + Math.floor(i / 3) * 4.4;
    k += `<rect x="${r(x)}" y="${r(y)}" width="2.3" height="3.8" fill="${farben[i]}" stroke="#fff" stroke-width=".3" stroke-dasharray=".35 .25"/>`;
    k += `<circle cx="${r(x + 1.15)}" cy="${r(y + 1.6)}" r=".6" fill="#fff" opacity=".7"/><text x="${r(x + 1.15)}" y="${r(y + 3.4)}" font-size=".8" text-anchor="middle" fill="#fff" font-family="Arial">95</text>`;
  }
  S.teil({ oben: true, id: "briefmarke", de: "die Briefmarke", syl: "BRIEF-mar-ke", it: "il francobollo", itSyl: "fran-co-BOL-lo", en: "stamp", x: mx, y: my, steht: true, kunst: k,
    tipp: "Die Briefmarke klebt man oben rechts auf den Umschlag." });
}
{
  /* DER KUGELSCHREIBER — an der Kette, Platz 2 */
  const [kx, ky] = P(2.62, HT, 1.85);
  let k = `<ellipse cx="-3" cy="-.4" rx="2" ry=".7" fill="#555"/><path d="M-3 -.6 q2 -1.8 4 -.6 q1.6 1 3 .1" stroke="#9aa2a8" stroke-width=".35" fill="none" stroke-dasharray=".5 .3"/>`;
  k += `<path d="M2.6 -.9 L9.4 -2.6 L9.8 -1.8 L3 -.2 Z" fill="#1f4f9a"/><path d="M9.4 -2.6 L10.6 -2.5 L9.8 -1.8 Z" fill="#ddd"/>`;
  S.teil({ oben: true, id: "kugelschreiber", de: "der Kugelschreiber", syl: "KU-gel-schrei-ber", it: "la penna", itSyl: "PEN-na", en: "ballpoint pen", x: kx, y: ky, steht: true, kunst: k + flaeche(-5.4, -4.4, 16.6, 5) });
}

/* =====================================================================
   DER PACKTISCH (vorne links) mit Klebeband und Schere
   ===================================================================== */
const PT = { X0: -2.75, X1: -1.6, z0: 1.7, z1: 2.3, H: 0.9 };
{
  const { X0, X1, z0, z1, H } = PT;
  const [ax, ay] = P((X0 + X1) / 2, 0, z1);
  let k = schatten(ax, ay, 34, 2.4, 0.3);
  k += kiste(X0, X1, 0, H - 0.04, z0, z1, { vorn: S.lg("packtischfront", [[0, "#e6e3dc"], [1, "#cbc7bf"]]), seite: "#b9b5ac" });
  k += kiste(X0 - 0.02, X1 + 0.02, H - 0.04, H, z0 - 0.02, z1 + 0.02, { vorn: "#8a6a45", deckel: S.lg("packplatte", [[0, "#c79a68"], [1, "#d8b07e"]]), seite: "#6f5434" });
  /* gelbe Blende mit Aufschrift, Fach für Packpapier */
  const [bx0, by0] = P(X0, H - 0.12, z1), [bx1, by1] = P(X1, H - 0.04, z1);
  k += `<rect x="${bx0}" y="${by1}" width="${r(bx1 - bx0)}" height="${r(by0 - by1)}" fill="${GELB}"/><text x="${r((bx0 + bx1) / 2)}" y="${r(by0 - 1.5)}" font-size="3" text-anchor="middle" fill="#111" font-family="Arial" font-weight="bold">Packtisch</text>`;
  const [fx0, fy0] = P(X0 + 0.08, 0.2, z1), [fx1, fy1] = P(X1 - 0.08, 0.6, z1);
  k += `<rect x="${fx0}" y="${fy1}" width="${r(fx1 - fx0)}" height="${r(fy0 - fy1)}" fill="#a8a49b"/>`;
  for (let i = 0; i < 3; i++) k += `<ellipse cx="${r(fx0 + 8 + i * 14)}" cy="${r(fy0 - 5)}" rx="5.4" ry="5" fill="${["#d8c39b", "#f2efe6", "#c6a46c"][i]}" stroke="#8f7a55" stroke-width=".3"/><circle cx="${r(fx0 + 8 + i * 14)}" cy="${r(fy0 - 5)}" r="1.4" fill="#7d6a4a"/>`;
  S.teil({ id: "packtisch", de: "der Packtisch", syl: "PACK-tisch", it: "il tavolo per imballare", itSyl: "TA-vo-lo per im-bal-LA-re", en: "packing table", x: ax, y: ay, steht: true, kunst: um(ax, ay, k),
    tipp: "Am Packtisch packt man sein Paket ein und klebt es zu." });
}
{
  /* DAS KLEBEBAND — im Handabroller auf dem Packtisch */
  const [kx, ky] = P(-2.4, PT.H, 2.05);
  let k = schatten(0, 0, 5, .7, .3);
  k += `<path d="M-5.6 0 L4 0 L6 -3.2 L5.4 -4 L-4.4 -1.6 Z" fill="#c8102e"/><path d="M-6 0 L-5 -4.6 L-4.2 -4.6 L-4.6 0 Z" fill="#3a3a3a"/>`;
  k += `<circle cx="-.4" cy="-4.6" r="4" fill="${S.rg("band", [[0, "#7a5a33"], [0.45, "#c79a56"], [1, "#e0bd80"]])}"/><circle cx="-.4" cy="-4.6" r="2.2" fill="#e7e1d4"/><circle cx="-.4" cy="-4.6" r="1.2" fill="#c8102e"/>`;
  S.teil({ oben: true, id: "klebeband", de: "das Klebeband", syl: "KLE-be-band", it: "il nastro adesivo", itSyl: "NA-stro a-de-SI-vo", en: "packing tape", x: kx, y: ky, steht: true, kunst: k });
}
{
  /* DIE SCHERE — liegt auf dem Packtisch */
  const [sx, sy] = P(-1.95, PT.H, 2.1);
  let k = `<path d="M-1 -1.4 L8 -3.4 L8.2 -2.6 L-.8 -.8 Z" fill="${STAHL}" stroke="#7d868d" stroke-width=".2"/><path d="M-1 -.9 L7.6 .6 L7.4 1.3 L-1.2 -.2 Z" fill="#dfe3e6" stroke="#7d868d" stroke-width=".2"/>`;
  k += `<ellipse cx="-3.6" cy="-2" rx="2.4" ry="1.5" fill="none" stroke="#1f4f9a" stroke-width="1"/><ellipse cx="-3.4" cy=".9" rx="2.4" ry="1.4" fill="none" stroke="#1f4f9a" stroke-width="1"/>`;
  S.teil({ oben: true, id: "schere", de: "die Schere", syl: "SCHE-re", it: "le forbici", itSyl: "FOR-bi-ci", en: "scissors", x: sx, y: sy, steht: true, kunst: k + flaeche(-6.6, -4.4, 15.6, 6.6) });
}

/* =====================================================================
   DIE ABSPERRUNG — Gurtpfosten „Bitte hier warten“ vor dem Schalter
   ===================================================================== */
{
  const z = 2.6, posts = [0.27, 1.32];
  const [ax, ay] = P(0.8, 0, z);
  let k = "";
  const [g0x, g0y] = P(posts[0], 0.9, z), [g1x, g1y] = P(posts[1], 0.9, z);
  k += `<path d="M${g0x} ${g0y} Q${r((g0x + g1x) / 2)} ${r(g0y + 2.2)} ${g1x} ${g1y}" stroke="#1f3f8a" stroke-width="2.2" fill="none"/>`;
  k += `<path d="M${g0x} ${r(g0y - 0.6)} Q${r((g0x + g1x) / 2)} ${r(g0y + 1.6)} ${g1x} ${r(g1y - 0.6)}" stroke="#4f6fc0" stroke-width=".4" fill="none"/>`;
  const mx = (g0x + g1x) / 2;
  k += `<rect x="${r(mx - 13)}" y="${r(g0y + 2.4)}" width="26" height="8" rx=".8" fill="#fff" stroke="#1f3f8a" stroke-width=".5"/>`;
  k += `<text x="${r(mx)}" y="${r(g0y + 5.8)}" font-size="2.8" text-anchor="middle" fill="#1f3f8a" font-family="Arial" font-weight="bold">Bitte hier warten</text><text x="${r(mx)}" y="${r(g0y + 8.8)}" font-size="1.9" text-anchor="middle" fill="#555" font-family="Arial">Diskretion – Abstand halten</text>`;
  for (const X of posts) {
    const [px, py] = P(X, 0, z), [, ty] = P(X, 0.95, z);
    k += schatten(px, py, 7, 1.2, 0.3);
    k += `<ellipse cx="${px}" cy="${r(py - 0.6)}" rx="6.4" ry="1.6" fill="#3a3d42"/><ellipse cx="${px}" cy="${r(py - 1.2)}" rx="5.6" ry="1.3" fill="#5a5e64"/>`;
    k += `<rect x="${r(px - 1.3)}" y="${ty}" width="2.6" height="${r(py - 1.2 - ty)}" fill="${STAHL}"/>`;
    k += `<rect x="${r(px - 1.8)}" y="${r(ty - 1)}" width="3.6" height="2.4" rx=".8" fill="#2f3237"/>`;
  }
  S.teil({ id: "absperrung", de: "die Absperrung", syl: "ab-SPER-rung", it: "la transenna", itSyl: "tran-SEN-na", en: "queue barrier", x: ax, y: ay, steht: true, kunst: um(ax, ay, k),
    tipp: "Hinter der Absperrung wartet man, bis der Schalter frei ist." });
}

/* =====================================================================
   VORNE: Glas der Schalter, Glasfront mit Rahmen und Spiegelungen
   ===================================================================== */
{
  let v = "";
  const gTop = 1.75;
  /* Schalterglas, Platz 1 mit Durchreiche, Platz 2 ganz */
  const [a0x, a0y] = P(XL + 0.02, HT, ZG), [a1x, a1y] = P(XM, gTop, ZG), [b1x] = P(XR, gTop, ZG);
  const [d0x] = P(DR[0], HT, ZG), [d1x, d1y] = P(DR[1], HT + 0.12, ZG);
  v += `<path d="M${a0x} ${a1y} H${a1x} V${a0y} H${d1x} V${d1y} H${d0x} V${a0y} H${a0x} Z" fill="${GLAS}"/>`;
  v += `<rect x="${a1x}" y="${a1y}" width="${r(Math.min(b1x, 320) - a1x)}" height="${r(a0y - a1y)}" fill="${GLAS}"/>`;
  v += `<path d="M${r(a0x + 8)} ${r(a0y - 2)} L${r(a0x + 22)} ${a1y} L${r(a0x + 28)} ${a1y} L${r(a0x + 14)} ${r(a0y - 2)} Z" fill="#fff" opacity=".14"/>`;
  v += `<path d="M${r(a1x + 20)} ${r(a0y - 2)} L${r(a1x + 32)} ${a1y} L${r(a1x + 35)} ${a1y} L${r(a1x + 23)} ${r(a0y - 2)} Z" fill="#fff" opacity=".12"/>`;
  /* Glasfront: Tür (zwei Flügel) und Schaufenster, Rahmen, Aufkleber —
     ausgespart, wo der Packtisch davor steht */
  const { X0: q0, X1: q1, z0: w0, z1: w1, H: qh } = PT;
  const tisch = [P(q0 - 0.02, qh, w1 + 0.02), P(q0 - 0.02, qh, w0 - 0.02), P(q1 + 0.02, qh, w0 - 0.02), P(q1 + 0.02, 0, w0), P(q1, 0, w1), P(q0, 0, w1)];
  S.def(`<clipPath id="${S.id("ohnetisch")}"><path clip-rule="evenodd" d="M0 0 H320 V200 H0 Z M${tisch.map((p) => p.join(" ")).join(" L")} Z"/></clipPath>`);
  v += `<g clip-path="url(#${S.id("ohnetisch")})">`;
  v += `<rect x="${FX0}" y="${FY0}" width="${FX1 - FX0}" height="${r(WAND_UNTEN - FY0)}" fill="${S.lg("frontglas", [[0, "#dff0f6", 0.28], [0.5, "#ffffff", 0.06], [1, "#dff0f6", 0.18]], 0, 0, 1, 1)}"/>`;
  v += `<path d="M10 ${r(WAND_UNTEN - 3)} L34 ${r(FY0)} L44 ${r(FY0)} L20 ${r(WAND_UNTEN - 3)} Z" fill="#fff" opacity=".1"/><path d="M60 ${r(WAND_UNTEN - 3)} L84 ${r(FY0)} L90 ${r(FY0)} L66 ${r(WAND_UNTEN - 3)} Z" fill="#fff" opacity=".1"/>`;
  const tuerOben = P(0, 2.1, 0)[1];
  v += `<rect x="${FX0}" y="${r(tuerOben - 3)}" width="40" height="3" fill="#8a9096"/><rect x="${FX0}" y="${FY0}" width="${FX1 - FX0}" height="1.4" fill="#8a9096"/>`;
  for (const x of [FX0, 22, 42, FX1 - 1]) v += `<rect x="${r(x)}" y="${x === 22 ? r(tuerOben) : FY0}" width="${x === 22 ? 0.8 : 1.6}" height="${r(WAND_UNTEN - (x === 22 ? tuerOben : FY0))}" fill="#8a9096"/>`;
  v += `<rect x="9" y="${r(tuerOben + 22)}" width="8" height="8" rx="4" fill="${GELB}" opacity=".9"/>`;
  v += `<text x="13" y="${r(tuerOben + 27)}" font-size="2" text-anchor="middle" fill="#111" font-family="Arial" font-weight="bold">auto</text>`;
  v += `<rect x="26" y="${r(tuerOben + 18)}" width="13" height="10" rx=".5" fill="#fff" opacity=".85"/><text x="32.5" y="${r(tuerOben + 21)}" font-size="1.5" text-anchor="middle" fill="#111" font-family="Arial" font-weight="bold">Öffnungszeiten</text>`;
  v += `<text x="32.5" y="${r(tuerOben + 23.6)}" font-size="1.2" text-anchor="middle" fill="#333" font-family="Arial">Mo–Fr 9–18 Uhr</text><text x="32.5" y="${r(tuerOben + 25.8)}" font-size="1.2" text-anchor="middle" fill="#333" font-family="Arial">Sa 9–13 Uhr</text></g>`;
  S.davor(`<g pointer-events="none">${v}</g>`);
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/postamt.js"));
console.log(aus);
