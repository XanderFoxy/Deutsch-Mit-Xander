#!/usr/bin/env node
/* =====================================================================
   DER BAUMARKT (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (Serviceseiten deutscher Baumarktketten: Holzzuschnitt,
   Farbmischservice; Ladenbau mit Schwerlastregalen und Lochwänden):
   - Eine hohe Halle mit SCHWERLASTREGALEN (orange Stützen, Traversen):
     unten die Ware zum Greifen, oben Paletten mit Nachschub. Zwischen
     den Regalen lange GÄNGE, über jedem ein Hängeschild mit Nummer.
   - HOLZZUSCHNITT: eine senkrechte PLATTENSÄGE an der Wand; der
     Fachverkäufer schneidet Platten millimetergenau zu. Davor Paletten
     mit Brettern und Latten.
   - WERKZEUGWAND (Lochwand) am Gondelkopf: Hammer, Säge, Zollstock,
     Schraubendreher, Zangen, Akkuschrauber hängen an Haken; davor der
     WARENTISCH (Aktionstisch) mit Kisten voller Schrauben, Dübel, Nägel.
   - FARBMISCHANLAGE: Automat mit vielen Farbdüsen, daneben der
     Schüttler; Farbfächer zum Aussuchen, Farbeimer, Pinsel und Rollen.
   - Großer Einkaufswagen mit Ablage; vorne SB-Kassen.
   Maßstab: Regal hinten ≈ 40 Einheiten je Meter, vorne ≈ 58 je Meter.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "baumarkt", titel: "Der Baumarkt", emoji: "🔩", thema: "Einkaufen", kuerzel: "b04e", fassung: 852 });
const rnd = zufall(8080);
const r = B.r;

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const ORANGE = S.lg("orange", [[0, "#f08a24"], [0.5, "#e2721a"], [1, "#c95f12"]], 0, 0, 1, 0);
const BLAU = S.lg("blau", [[0, "#2f6db5"], [1, "#1f4f8a"]]);
const STAHL = S.lg("stahl", [[0, "#eef1f3"], [0.45, "#c9cfd4"], [0.55, "#b5bcc2"], [1, "#e1e5e8"]], 0, 0, 1, 0);
const HOLZ = S.lg("holz", [[0, "#e6c48e"], [1, "#cfa66a"]]);
const LOCH = S.id("loch");
S.def(`<pattern id="${LOCH}" patternUnits="userSpaceOnUse" width="2.6" height="2.6"><rect width="2.6" height="2.6" fill="#d9cfbf"/><circle cx="1.3" cy="1.3" r=".42" fill="#7d7364"/></pattern>`);

/* =====================================================================
   KULISSE — Hallenboden, Gang nach hinten (rechts), Hallendecke
   ===================================================================== */
const WU = 130;
S.hinten(`<rect x="0" y="0" width="320" height="${WU}" fill="${S.lg("halle", [[0, "#6c7076"], [1, "#8a8e93"]])}"/>`);
/* Blick in den Gang: Regale in Fluchtperspektive, Licht am Ende */
{
  const gx0 = 254, gx1 = 294, vx = 274, vy = 78;
  let g = `<rect x="${gx0}" y="0" width="${gx1 - gx0}" height="${WU}" fill="${S.lg("gangluft", [[0, "#9aa0a6"], [1, "#c9ccce"]])}"/>`;
  g += `<path d="M${gx0} ${WU} L${vx - 3} ${vy + 10} L${vx + 3} ${vy + 10} L${gx1} ${WU} Z" fill="#b7b9b8"/>`;
  for (const s of [-1, 1]) {
    const xa = s < 0 ? gx0 : gx1, xb = vx + s * 3;
    g += `<path d="M${xa} 0 L${xb} ${vy - 22} L${xb} ${vy + 10} L${xa} ${WU} Z" fill="${S.lg("gr" + s, [[0, "#3c4a5c"], [1, "#56677b"]], s < 0 ? 0 : 1, 0, s < 0 ? 1 : 0, 0)}"/>`;
    for (const t of [0.25, 0.5, 0.72]) g += `<path d="M${xa} ${r(WU * t)} L${xb} ${r(vy - 22 + 32 * t)}" stroke="#e2721a" stroke-width=".8"/>`;
    for (let i = 0; i < 4; i++) { const t = i / 4; g += `<line x1="${r(xa + (xb - xa) * t)}" y1="${r(0 + (vy - 22) * t)}" x2="${r(xa + (xb - xa) * t)}" y2="${r(WU + (vy + 10 - WU) * t)}" stroke="#e2721a" stroke-width="${r(1.2 - t)}"/>`; }
  }
  g += `<rect x="${vx - 3}" y="${vy - 22}" width="6" height="32" fill="#e9ecee"/>`;
  S.hinten(g);
}
{
  let f = `<rect x="0" y="${WU}" width="320" height="${200 - WU}" fill="${S.lg("beton", [[0, "#9c9a95"], [1, "#b6b3ad"]])}"/>`;
  for (let i = 0; i < 36; i++) f += `<ellipse cx="${r(rnd() * 320)}" cy="${r(WU + 3 + rnd() * 66)}" rx="${r(2 + rnd() * 6)}" ry="${r(0.4 + rnd() * 0.8)}" fill="${rnd() < 0.5 ? "#c2bfb8" : "#8e8b85"}" opacity=".25"/>`;
  for (const [a, b] of [[40, -80], [160, 160], [280, 400]]) f += `<line x1="${a}" y1="${WU}" x2="${b}" y2="200" stroke="#85827c" stroke-width=".35"/>`;
  f += `<line x1="0" y1="158" x2="320" y2="158" stroke="#85827c" stroke-width=".35"/>`;
  /* gelbe Sicherheitslinie vor den Regalen */
  f += `<rect x="0" y="${WU + 2}" width="254" height="1.2" fill="#f2c94c" opacity=".9"/><rect x="294" y="${WU + 2}" width="26" height="1.2" fill="#f2c94c" opacity=".9"/>`;
  f += `<rect x="0" y="${WU}" width="320" height="${200 - WU}" fill="${S.lg("bl", [[0, "#000", 0.2], [0.35, "#000", 0], [1, "#fff", 0.08]])}"/>`;
  S.hinten(f);
}

/* =====================================================================
   DAS HOCHREGAL (Schwerlastregal) — Stützen, Traversen, Ware, Paletten
   ===================================================================== */
{
  let k = "";
  const felder = [[0, 86], [86, 172], [172, 254], [294, 323]];
  const ebenen = [92, 54, 14];   // Traversen (y)
  felder.forEach(([a, b], fi) => {
    /* obere Ebene: Paletten mit Folie */
    for (let x = a + 4; x + 22 < b; x += 26) {
      k += `<rect x="${x}" y="${ebenen[2] - 4}" width="22" height="3.4" fill="${HOLZ}"/><rect x="${x + 1}" y="${ebenen[2] - 15}" width="20" height="11" fill="${["#c9b48d", "#9fb6c9", "#d7d0c4"][(x + fi) % 3]}"/><rect x="${x + 1}" y="${ebenen[2] - 15}" width="20" height="11" fill="#fff" opacity=".22"/><line x1="${x + 1}" y1="${ebenen[2] - 9.5}" x2="${x + 21}" y2="${ebenen[2] - 9.5}" stroke="#8a7a5a" stroke-width=".3"/>`;
      k += `<rect x="${x}" y="${ebenen[1] - 4}" width="22" height="3.4" fill="${HOLZ}"/><rect x="${x + 1}" y="${ebenen[1] - 30}" width="20" height="26" fill="${["#d6b98e", "#c9a97b", "#e0cba6"][(x + fi + 1) % 3]}"/><rect x="${x + 1}" y="${ebenen[1] - 30}" width="20" height="26" fill="#fff" opacity=".18"/><line x1="${x + 11}" y1="${ebenen[1] - 30}" x2="${x + 11}" y2="${ebenen[1] - 4}" stroke="#a88a5a" stroke-width=".3"/><line x1="${x + 1}" y1="${ebenen[1] - 17}" x2="${x + 21}" y2="${ebenen[1] - 17}" stroke="#a88a5a" stroke-width=".3"/>`;
    }
    /* untere Ebene: Säcke und Kartons */
    for (let x = a + 4; x + 10 < b; x += 12) {
      const sack = (x + fi) % 3 === 0;
      k += sack ? `<path d="M${x} ${ebenen[0] - 1} L${x + 10} ${ebenen[0] - 1} Q${x + 11} ${ebenen[0] - 12} ${x + 9} ${ebenen[0] - 22} L${x + 1} ${ebenen[0] - 22} Q${x - 1} ${ebenen[0] - 12} ${x} ${ebenen[0] - 1} Z" fill="#e8e1d2"/><rect x="${x + 1}" y="${ebenen[0] - 15}" width="8" height="4" fill="#c0392b"/>`
        : `<rect x="${x}" y="${ebenen[0] - 18}" width="10" height="17" fill="${["#c99c5e", "#b88a4e", "#d4ab70"][(x + fi) % 3]}"/><rect x="${x + 1.4}" y="${ebenen[0] - 14}" width="7" height="4" fill="#fff" opacity=".7"/>`;
    }
    for (const y of ebenen) k += `<rect x="${a}" y="${y - 1}" width="${b - a}" height="3" fill="${ORANGE}"/><rect x="${a}" y="${y - 1}" width="${b - a}" height=".7" fill="#ffb066" opacity=".6"/>`;
    for (const x of [a, b - 3]) k += `<rect x="${x}" y="0" width="3" height="${WU}" fill="${BLAU}"/><rect x="${x + 0.6}" y="0" width=".6" height="${WU}" fill="#fff" opacity=".25"/>`;
    for (let y = 4; y < WU; y += 5) for (const x of [a + 1.5, b - 1.5]) k += `<rect x="${x - 0.4}" y="${y}" width=".8" height="1.6" fill="#163a66"/>`;
  });
  /* Prallschutz unten an den Stützen */
  for (const x of [0, 83, 86, 169, 172, 251, 294]) k += `<path d="M${x - 1} ${WU} L${x - 1} ${WU - 7} L${x + 4} ${WU - 7} L${x + 4} ${WU} Z" fill="#f2c94c"/><path d="M${x - 1} ${WU - 5} L${x + 4} ${WU - 3}" stroke="#222" stroke-width=".8"/>`;
  S.teil({ id: "bm_hochregal", de: "das Hochregal", syl: "HOCH-re-gal", it: "la scaffalatura", itSyl: "scaf-fa-la-TU-ra", en: "pallet rack", x: 0, y: 0, kunst: k,
    tipp: "Unten liegt die Ware zum Mitnehmen, oben auf den Paletten der Nachschub." });
}

/* =====================================================================
   DAS SCHILD — Hängeschild über dem Gang
   ===================================================================== */
{
  let k = `<line x1="-10" y1="-14" x2="-10" y2="-6" stroke="#2a2a2a" stroke-width=".4"/><line x1="10" y1="-14" x2="10" y2="-6" stroke="#2a2a2a" stroke-width=".4"/>`;
  k += `<rect x="-18" y="-6" width="36" height="14" rx="1" fill="#1f4f8a"/><rect x="-18" y="-6" width="11" height="14" rx="1" fill="#e2721a"/><text x="-12.5" y="4" font-size="8" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-weight="bold">14</text>`;
  k += `<text x="5.6" y="-.4" font-size="3.2" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-weight="bold">Farben</text><text x="5.6" y="4.6" font-size="3.2" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-weight="bold">Tapeten</text>`;
  S.teil({ id: "bm_schild", de: "das Schild", syl: "SCHILD", it: "il cartello", itSyl: "car-TEL-lo", en: "sign", x: 274, y: 20, kunst: k,
    tipp: "Jeder Gang hat eine Nummer – so findet man die Ware schneller." });
}

/* =====================================================================
   DIE PLATTENSÄGE (Holzzuschnitt) links
   ===================================================================== */
{
  let k = schatten(0, 0, 36, 2, 0.3);
  /* Rahmen, leicht nach hinten geneigt */
  k += `<path d="M-34 -6 L34 -6 L32 -88 L-32 -88 Z" fill="${S.lg("rahmen", [[0, "#4a5560"], [1, "#2f3840"]])}"/>`;
  k += `<path d="M-31 -9 L31 -9 L29.4 -85 L-29.4 -85 Z" fill="#3a444d"/>`;
  /* eingespannte Spanplatte */
  k += `<path d="M-28 -12 L18 -12 L17 -70 L-27 -70 Z" fill="${S.lg("platte", [[0, "#e8d6b0"], [1, "#d9c29a"]])}"/>`;
  for (let i = 0; i < 40; i++) k += `<rect x="${r(-26 + rnd() * 42)}" y="${r(-68 + rnd() * 54)}" width="${r(0.6 + rnd())}" height=".35" fill="#b99a64" opacity=".7"/>`;
  /* Stützrollen unten, Schiene */
  k += `<rect x="-34" y="-12" width="68" height="3.4" fill="${STAHL}"/>`;
  for (let x = -30; x <= 30; x += 6) k += `<circle cx="${x}" cy="-10.4" r="1.2" fill="#2a2d31"/>`;
  /* senkrechte Führung mit Sägeaggregat */
  k += `<rect x="20" y="-88" width="4" height="78" fill="${STAHL}"/><rect x="25" y="-88" width="4" height="78" fill="${STAHL}"/>`;
  k += `<rect x="17" y="-48" width="15" height="14" rx="1.4" fill="#d6dade"/><circle cx="24.5" cy="-41" r="5" fill="none" stroke="#9aa2a8" stroke-width=".8"/><rect x="18" y="-50.4" width="13" height="2.6" rx=".6" fill="#c0392b"/><text x="24.5" y="-48.4" font-size="1.6" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">STOP</text>`;
  /* Maßband oben, Absaugschlauch */
  k += `<rect x="-30" y="-84" width="58" height="2" fill="#f2c94c"/>`;
  for (let x = -29; x < 28; x += 2.4) k += `<line x1="${x}" y1="-84" x2="${x}" y2="${(x + 29) % 12 < 2 ? -82.4 : -83}" stroke="#222" stroke-width=".2"/>`;
  k += `<path d="M27 -88 Q27 -100 40 -100" stroke="#5a6a7a" stroke-width="2.6" fill="none"/>`;
  /* Schild „Holzzuschnitt“ */
  k += `<rect x="-24" y="-102" width="42" height="9" rx="1" fill="#e2721a"/><text x="-3" y="-95.6" font-size="4.6" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-weight="bold">Holzzuschnitt</text>`;
  S.teil({ id: "bm_plattensaege", de: "die Plattensäge", syl: "PLAT-ten-sä-ge", it: "la sezionatrice verticale", itSyl: "se-zio-na-TRI-ce ver-ti-CA-le", en: "panel saw", x: 38, y: 134, steht: true, kunst: k,
    tipp: "Hier schneidet der Baumarkt Holzplatten auf das gewünschte Maß zu." });
}

/* =====================================================================
   DIE LEITER — Aluminium-Stehleiter zwischen Säge und Werkzeugwand
   ===================================================================== */
{
  let k = schatten(0, 0, 12, 1.2, 0.28);
  k += `<path d="M-10 0 L-3 -66 L-1 -66 L-7.6 0 Z" fill="${STAHL}"/><path d="M10 0 L3 -66 L1 -66 L7.6 0 Z" fill="#b5bcc2"/>`;
  for (let i = 1; i <= 6; i++) { const y = -i * 9.4, w = 9 - i * 0.95; k += `<rect x="${r(-w)}" y="${r(y)}" width="${r(w * 1.15)}" height="1.6" rx=".3" fill="#d6dadd"/><rect x="${r(-w)}" y="${r(y + 1.4)}" width="${r(w * 1.15)}" height=".5" fill="#8d949a"/>`; }
  k += `<rect x="-4" y="-70" width="8" height="5" rx="1" fill="#e2721a"/><path d="M-5 -30 L5 -30" stroke="#c0392b" stroke-width=".5"/>`;
  k += `<rect x="-10.4" y="-1.6" width="3.6" height="1.6" rx=".5" fill="#2a2a2a"/><rect x="6.8" y="-1.6" width="3.6" height="1.6" rx=".5" fill="#2a2a2a"/>`;
  S.teil({ id: "bm_leiter", de: "die Leiter", syl: "LEI-ter", it: "la scala", itSyl: "SCA-la", en: "ladder", x: 88, y: 156, steht: true, kunst: k });
}

/* =====================================================================
   DIE WERKZEUGWAND (Lochwand am Gondelkopf) — Lupe: Hammer, Säge,
   Zollstock, Schraubendreher, Zange, Akkuschrauber
   ===================================================================== */
const WW = { x0: 100, x1: 178, top: 60, boden: 152 };
{
  const W = WW.x1 - WW.x0, cx = (WW.x0 + WW.x1) / 2, H = WW.boden - WW.top;
  let k = schatten(0, 0, W / 2 + 1, 1.6, 0.28);
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="${H}" fill="#3a3e44"/>`;
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="9" fill="#e2721a"/><text x="0" y="${-H + 6.6}" font-size="5.4" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-weight="bold" letter-spacing=".8">WERKZEUG</text>`;
  k += `<rect x="${-W / 2 + 2}" y="${-H + 11}" width="${W - 4}" height="${H - 34}" fill="url(#${LOCH})"/>`;
  k += `<rect x="${-W / 2 + 2}" y="${-H + 11}" width="${W - 4}" height="${H - 34}" fill="${S.lg("lochlicht", [[0, "#fff", 0.2], [1, "#000", 0.12]])}"/>`;
  k += `<rect x="${-W / 2}" y="-23" width="${W}" height="23" fill="#4a4f56"/><rect x="${-W / 2}" y="-23" width="${W}" height="1.4" fill="#6a7078"/>`;
  const cw = (W - 4) / 3, r1 = -H + 12, r2 = -H + 12 + (H - 36) / 2;
  const haken = (x, y) => `<path d="M${r(x)} ${r(y)} l0 2.2" stroke="#b5bcc2" stroke-width=".5"/>`;
  const col = (c) => -W / 2 + 2 + c * cw + cw / 2;
  const unter = [];
  const zone = () => flaeche(-cw / 2 + 0.4, -0.4, cw - 0.8, (H - 36) / 2 - 0.4);
  /* Hammer */
  {
    const x = col(0), y = r1 + 3;
    let g = "";
    for (const dx of [-6, 0, 6]) {
      g += haken(x + dx, y - 1);
      g += `<rect x="${r(x + dx - 0.9)}" y="${r(y + 3)}" width="1.8" height="17" rx=".6" fill="${S.lg("stiel", [[0, "#c8964f"], [1, "#9a6a2e"]], 0, 0, 1, 0)}"/><rect x="${r(x + dx - 1)}" y="${r(y + 14)}" width="2" height="6" rx=".6" fill="#2a2a2a"/>`;
      g += `<path d="M${r(x + dx - 4)} ${r(y + 1.4)} L${r(x + dx + 2.4)} ${r(y + 1.4)} L${r(x + dx + 2.4)} ${r(y + 4.2)} L${r(x + dx - 4)} ${r(y + 4.2)} Z" fill="#596068"/><path d="M${r(x + dx + 2.4)} ${r(y + 1.6)} Q${r(x + dx + 4.4)} ${r(y + 2)} ${r(x + dx + 4)} ${r(y + 5)}" stroke="#596068" stroke-width="1" fill="none"/>`;
    }
    k += g;
    unter.push({ id: "bm_hammer", de: "der Hammer", syl: "HAM-mer", it: "il martello", itSyl: "mar-TEL-lo", en: "hammer", x: cx + x, y: WW.boden + r1, kunst: zone() });
  }
  /* Säge (Fuchsschwanz) */
  {
    const x = col(1), y = r1 + 3;
    let g = "";
    for (const dx of [-4.6, 4.6]) {
      g += haken(x + dx, y - 1);
      g += `<path d="M${r(x + dx - 2.6)} ${r(y + 1)} L${r(x + dx + 2.6)} ${r(y + 1)} L${r(x + dx + 2.6)} ${r(y + 6.4)} L${r(x + dx - 2.6)} ${r(y + 6.4)} Z" fill="#c0392b"/><circle cx="${r(x + dx)}" cy="${r(y + 3.6)}" r="1.2" fill="#d9cfbf"/>`;
      g += `<path d="M${r(x + dx - 2.4)} ${r(y + 6.4)} L${r(x + dx + 2.4)} ${r(y + 6.4)} L${r(x + dx + 1)} ${r(y + 20)} L${r(x + dx - 1.4)} ${r(y + 20)} Z" fill="${STAHL}"/>`;
      for (let j = 0; j < 9; j++) g += `<path d="M${r(x + dx + 2.4 - j * 0.15)} ${r(y + 7 + j * 1.45)} l.6 .6 l-.6 .6" stroke="#7d868d" stroke-width=".2" fill="none"/>`;
    }
    k += g;
    unter.push({ id: "bm_saege", de: "die Säge", syl: "SÄ-ge", it: "la sega", itSyl: "SE-ga", en: "saw", x: cx + x, y: WW.boden + r1, kunst: zone() });
  }
  /* Zollstock (gelb, zusammengeklappt, in Blisterkarten) */
  {
    const x = col(2), y = r1 + 3;
    let g = "";
    for (const dx of [-6, 0, 6]) {
      g += haken(x + dx, y - 1) + `<rect x="${r(x + dx - 2.6)}" y="${r(y + 1)}" width="5.2" height="19" rx=".5" fill="#ffffff" stroke="#c9ced2" stroke-width=".2"/>`;
      g += `<rect x="${r(x + dx - 1.4)}" y="${r(y + 4)}" width="2.8" height="13" rx=".4" fill="#f2c94c"/>`;
      for (let j = 0; j < 9; j++) g += `<line x1="${r(x + dx - 1.4)}" y1="${r(y + 5 + j * 1.3)}" x2="${r(x + dx - (j % 2 ? 0.6 : 0.2))}" y2="${r(y + 5 + j * 1.3)}" stroke="#222" stroke-width=".2"/>`;
      g += `<text x="${r(x + dx + 0.8)}" y="${r(y + 12)}" font-size="1.2" fill="#c0392b" font-family="Arial" transform="rotate(90 ${r(x + dx + 0.8)} ${r(y + 12)})">2 m</text>`;
    }
    k += g;
    unter.push({ id: "bm_zollstock", de: "der Zollstock", syl: "ZOLL-stock", it: "il metro pieghevole", itSyl: "ME-tro pie-GHE-vo-le", en: "folding rule", x: cx + x, y: WW.boden + r1, kunst: zone(),
      tipp: "Der Zollstock ist zwei Meter lang und wird zusammengeklappt." });
  }
  /* Schraubendreher-Sets */
  {
    const x = col(0), y = r2 + 3;
    let g = "";
    for (const dx of [-5, 5]) {
      g += haken(x + dx, y - 1) + `<rect x="${r(x + dx - 4)}" y="${r(y + 1)}" width="8" height="18" rx=".6" fill="#ffffff" stroke="#c9ced2" stroke-width=".2"/>`;
      [["#c0392b", -2.4], ["#f2c94c", 0], ["#2f6db5", 2.4]].forEach(([f, d]) => {
        g += `<rect x="${r(x + dx + d - 0.9)}" y="${r(y + 3)}" width="1.8" height="6.4" rx=".7" fill="${f}"/><rect x="${r(x + dx + d - 0.3)}" y="${r(y + 9.4)}" width=".6" height="7" fill="#9aa2a8"/>`;
      });
    }
    k += g;
    unter.push({ id: "bm_schraubendreher", de: "der Schraubendreher", syl: "SCHRAU-ben-dre-her", it: "il cacciavite", itSyl: "cac-cia-VI-te", en: "screwdriver", x: cx + x, y: WW.boden + r2, kunst: zone() });
  }
  /* Zangen */
  {
    const x = col(1), y = r2 + 3;
    let g = "";
    for (const dx of [-5, 5]) {
      g += haken(x + dx, y - 1);
      g += `<path d="M${r(x + dx - 0.8)} ${r(y + 1)} L${r(x + dx + 0.8)} ${r(y + 1)} L${r(x + dx + 1.2)} ${r(y + 6)} L${r(x + dx - 1.2)} ${r(y + 6)} Z" fill="#596068"/><circle cx="${r(x + dx)}" cy="${r(y + 6.4)}" r=".8" fill="#7d868d"/>`;
      g += `<path d="M${r(x + dx - 0.6)} ${r(y + 7)} Q${r(x + dx - 3.6)} ${r(y + 12)} ${r(x + dx - 3)} ${r(y + 19)}" stroke="#c0392b" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M${r(x + dx + 0.6)} ${r(y + 7)} Q${r(x + dx + 3.6)} ${r(y + 12)} ${r(x + dx + 3)} ${r(y + 19)}" stroke="#c0392b" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
    }
    k += g;
    unter.push({ id: "bm_zange", de: "die Zange", syl: "ZAN-ge", it: "la pinza", itSyl: "PIN-za", en: "pliers", x: cx + x, y: WW.boden + r2, kunst: zone() });
  }
  /* Akkuschrauber im Präsentationshalter */
  {
    const x = col(2), y = r2 + 3;
    let g = haken(x - 3, y - 1) + haken(x + 3, y - 1);
    g += `<rect x="${r(x - 7)}" y="${r(y + 1)}" width="14" height="2.4" rx=".6" fill="#2a2a2a"/>`;
    g += `<path d="M${r(x - 6)} ${r(y + 4)} L${r(x + 3)} ${r(y + 4)} Q${r(x + 5)} ${r(y + 4)} ${r(x + 5)} ${r(y + 6.4)} L${r(x + 5)} ${r(y + 8)} L${r(x - 6)} ${r(y + 8)} Z" fill="${S.lg("akku", [[0, "#3fa34d"], [1, "#2a7a36"]])}"/>`;
    g += `<rect x="${r(x + 5)}" y="${r(y + 5)}" width="2.2" height="1.6" fill="#596068"/><rect x="${r(x + 7.2)}" y="${r(y + 5.5)}" width="1.6" height=".6" fill="#9aa2a8"/>`;
    g += `<path d="M${r(x - 3.4)} ${r(y + 8)} L${r(x - 0.6)} ${r(y + 8)} L${r(x)} ${r(y + 15)} L${r(x - 4)} ${r(y + 15)} Z" fill="#2a2a2a"/><rect x="${r(x - 5.4)}" y="${r(y + 15)}" width="7" height="4" rx=".6" fill="#2a7a36"/><rect x="${r(x - 1.2)}" y="${r(y + 8.6)}" width="1" height="2" rx=".3" fill="#f2c94c"/>`;
    g += `<rect x="${r(x - 7)}" y="${r(y + 20)}" width="14" height="2.6" rx=".3" fill="#fff"/><text x="${r(x)}" y="${r(y + 22)}" font-size="1.8" text-anchor="middle" fill="#c0392b" font-family="Arial" font-weight="bold">79,99 €</text>`;
    k += g;
    unter.push({ id: "bm_bohrmaschine_bm", de: "der Akkuschrauber", syl: "AK-ku-schrau-ber", it: "l'avvitatore", itSyl: "av-vi-ta-TO-re", en: "cordless drill", x: cx + x, y: WW.boden + r2, kunst: zone(),
      tipp: "Mit dem Akkuschrauber dreht man Schrauben ein – ganz ohne Kabel." });
  }
  /* Trenner */
  for (let c = 1; c < 3; c++) k += `<rect x="${r(-W / 2 + 2 + c * cw - 0.3)}" y="${-H + 11}" width=".6" height="${H - 34}" fill="#a69a86"/>`;
  k += `<rect x="${-W / 2 + 2}" y="${r(r2 - 0.6)}" width="${W - 4}" height=".6" fill="#a69a86"/>`;
  S.teil({ id: "bm_werkzeugwand", de: "die Werkzeugwand", syl: "WERK-zeug-wand", it: "la parete degli attrezzi", itSyl: "pa-RE-te DE-gli at-TREZ-zi", en: "tool wall", x: cx, y: WW.boden, steht: true, kunst: k,
    zoom: { x: WW.x0 - 6, y: WW.top + 6, w: W + 12, h: 60 }, unter });
}

/* =====================================================================
   DER WARENTISCH (Aktionstisch) — Lupe: Schrauben, Dübel, Nägel
   ===================================================================== */
{
  const X0 = 104, X1 = 176, Y = 178, top = -42, W = X1 - X0, cx = (X0 + X1) / 2;
  let k = schatten(0, 0, W / 2 + 2, 2, 0.3);
  k += `<rect x="${-W / 2}" y="${top + 4}" width="${W}" height="${-top - 4}" fill="${S.lg("tisch", [[0, "#e2721a"], [1, "#b9570f"]])}"/>`;
  k += `<rect x="${-W / 2 + 4}" y="${top + 12}" width="${W - 8}" height="16" rx="1" fill="#fff"/><text x="0" y="${top + 20}" font-size="5" text-anchor="middle" fill="#c0392b" font-family="Arial,sans-serif" font-weight="bold">AKTION</text><text x="0" y="${top + 25.4}" font-size="2.8" text-anchor="middle" fill="#333" font-family="Arial,sans-serif">Kleinteile ab 1,99 €</text>`;
  k += `<rect x="${-W / 2}" y="-3" width="${W}" height="3" fill="#3a2a1c"/>`;
  k += `<path d="M${-W / 2 - 1} ${top + 4} L${W / 2 + 1} ${top + 4} L${W / 2 - 1} ${top} L${-W / 2 + 1} ${top} Z" fill="#8a4410"/>`;
  /* drei Kisten auf dem Tisch */
  const kiste = (x, fuell) => `<path d="M${x - 11} ${top + 0.6} L${x + 11} ${top + 0.6} L${x + 10} ${top - 6} L${x - 10} ${top - 6} Z" fill="#5a6068"/><path d="M${x - 9.6} ${top - 5} L${x + 9.6} ${top - 5} L${x + 9} ${top - 7.4} L${x - 9} ${top - 7.4} Z" fill="#2a2d31"/>${fuell}<rect x="${x - 5}" y="${top - 3.6}" width="10" height="3" rx=".3" fill="#fff"/>`;
  const unter = [];
  {
    const x = -23;
    let f = "";
    for (let i = 0; i < 26; i++) { const sx = x - 8.6 + rnd() * 17.2, sy = top - 7 - rnd() * 1.6, a = Math.round(rnd() * 180); f += `<g transform="rotate(${a} ${r(sx)} ${r(sy)})"><rect x="${r(sx - 1.6)}" y="${r(sy - 0.25)}" width="3.2" height=".5" fill="#b5bcc2"/><rect x="${r(sx - 1.9)}" y="${r(sy - 0.55)}" width=".6" height="1.1" fill="#9aa2a8"/></g>`; }
    k += kiste(x, f) + `<text x="${x}" y="${top - 1.6}" font-size="1.7" text-anchor="middle" fill="#222" font-family="Arial" font-weight="bold">Schrauben</text>`;
    unter.push({ id: "bm_schraube_bm", de: "die Schraube", syl: "SCHRAU-be", it: "la vite", itSyl: "VI-te", en: "screw", x: cx + x, y: Y + top + 1, kunst: flaeche(-11, -11, 22, 11.6),
      tipp: "Holzschrauben, Spanplattenschrauben, Maschinenschrauben – für jedes Material die richtige." });
  }
  {
    const x = 0;
    let f = "";
    for (let i = 0; i < 22; i++) { const sx = x - 8.4 + rnd() * 16.8, sy = top - 7 - rnd() * 1.6, a = Math.round(rnd() * 180); f += `<rect x="${r(sx - 1.4)}" y="${r(sy - 0.5)}" width="2.8" height="1" rx=".4" fill="${i % 3 ? "#9e9e9e" : "#c9c9c9"}" transform="rotate(${a} ${r(sx)} ${r(sy)})"/>`; }
    k += kiste(x, f) + `<text x="${x}" y="${top - 1.6}" font-size="1.7" text-anchor="middle" fill="#222" font-family="Arial" font-weight="bold">Dübel</text>`;
    unter.push({ id: "bm_duebel", de: "der Dübel", syl: "DÜ-bel", it: "il tassello", itSyl: "tas-SEL-lo", en: "wall plug", x: cx + x, y: Y + top + 1, kunst: flaeche(-11, -11, 22, 11.6),
      tipp: "Erst bohren, dann den Dübel in die Wand stecken – dann hält die Schraube." });
  }
  {
    const x = 23;
    let f = "";
    for (let i = 0; i < 28; i++) { const sx = x - 8.6 + rnd() * 17.2, sy = top - 7 - rnd() * 1.6, a = Math.round(rnd() * 180); f += `<g transform="rotate(${a} ${r(sx)} ${r(sy)})"><rect x="${r(sx - 2)}" y="${r(sy - 0.15)}" width="4" height=".3" fill="#7d868d"/><circle cx="${r(sx - 2)}" cy="${r(sy)}" r=".4" fill="#7d868d"/></g>`; }
    k += kiste(x, f) + `<text x="${x}" y="${top - 1.6}" font-size="1.7" text-anchor="middle" fill="#222" font-family="Arial" font-weight="bold">Nägel</text>`;
    unter.push({ id: "bm_nagel", de: "der Nagel", syl: "NA-gel", it: "il chiodo", itSyl: "CHIO-do", en: "nail", x: cx + x, y: Y + top + 1, kunst: flaeche(-11, -11, 22, 11.6) });
  }
  S.teil({ id: "bm_warentisch", de: "der Warentisch", syl: "WA-ren-tisch", it: "il banco di vendita", itSyl: "BAN-co di VEN-di-ta", en: "display table", x: cx, y: Y, steht: true, kunst: k,
    zoom: { x: X0 - 3, y: Y + top - 22, w: W + 6, h: 50 }, unter });
}

/* =====================================================================
   DIE FARBMISCHANLAGE mit Schüttler; DER FARBEIMER, DER PINSEL
   ===================================================================== */
{
  let k = schatten(0, 0, 32, 2, 0.3);
  /* Tönautomat: Gehäuse mit Düsenkarussell oben */
  k += `<rect x="-26" y="-56" width="36" height="56" rx="1.4" fill="${S.lg("toener", [[0, "#ffffff"], [0.6, "#eceeee"], [1, "#c9cdcf"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-26" y="-56" width="36" height="5" rx="1.4" fill="#1f4f8a"/><text x="-8" y="-52.4" font-size="2.6" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">FARBMISCHSERVICE</text>`;
  /* Kanister (Farbtöne) im Karussell */
  const ft = ["#e74c3c", "#f39c12", "#f1c40f", "#27ae60", "#16a085", "#2980b9", "#8e44ad", "#2c3e50", "#7f5539", "#ffffff", "#c0392b", "#d35400"];
  for (let i = 0; i < 12; i++) { const x = -24 + i * 2.75; k += `<rect x="${r(x)}" y="-49" width="2.3" height="9" rx=".5" fill="${ft[i]}" stroke="#9aa2a8" stroke-width=".15"/><rect x="${r(x + 0.4)}" y="-41" width="1.5" height="1.6" fill="#596068"/>`; }
  k += `<rect x="-26" y="-39" width="36" height="1.4" fill="#9aa2a8"/>`;
  /* Ausgabefach mit Eimer unter der Düse */
  k += `<rect x="-20" y="-36" width="24" height="18" rx=".8" fill="#2a2d31"/><circle cx="-8" cy="-34" r="1.2" fill="#9aa2a8"/>`;
  k += `<path d="M-13 -19 L-3 -19 L-3.6 -29 L-12.4 -29 Z" fill="#f4f4f2"/><ellipse cx="-8" cy="-29" rx="4.4" ry=".9" fill="#d9d9d6"/><rect x="-12" y="-26" width="8" height="3" fill="#2f6db5"/>`;
  k += `<rect x="-20" y="-14" width="24" height="12" rx=".6" fill="none" stroke="#c9cdcf" stroke-width=".5"/><rect x="-11" y="-9" width="6" height="1" rx=".4" fill="#9aa2a8"/>`;
  /* Bildschirm mit Farbton */
  k += `<rect x="5" y="-36" width="4" height="7" fill="#2a2d31"/><rect x="5.6" y="-35.4" width="2.8" height="5.8" fill="#6fb3a0"/>`;
  /* Schüttler rechts */
  k += `<rect x="12" y="-34" width="18" height="34" rx="1" fill="${S.lg("schuettler", [[0, "#5a6068"], [1, "#3a3e44"]], 0, 0, 1, 0)}"/><rect x="14" y="-30" width="14" height="18" rx=".6" fill="#22252a"/><rect x="15" y="-29" width="12" height="16" fill="#3a3e44" opacity=".6"/><circle cx="21" cy="-6" r="1.6" fill="#5fd38a"/><rect x="16" y="-9" width="3" height="1" fill="#e74c3c"/>`;
  S.teil({ id: "bm_farbmischanlage", de: "die Farbmischanlage", syl: "FARB-misch-an-la-ge", it: "il tintometro", itSyl: "tin-TO-me-tro", en: "paint mixing machine", x: 206, y: 142, steht: true, kunst: k,
    tipp: "Die Maschine mischt aus wenigen Grundfarben jeden Farbton – danach wird der Eimer geschüttelt." });
}
{
  /* DER FARBEIMER — Stapel weißer Wandfarbe vor der Anlage */
  let k = schatten(0, 0, 14, 1.4, 0.3);
  const eimer = (x, y, w, h) => `<path d="M${x - w / 2} ${y} L${x + w / 2} ${y} L${x + w / 2 - 0.8} ${y - h} L${x - w / 2 + 0.8} ${y - h} Z" fill="${S.lg("eimer", [[0, "#ffffff"], [0.6, "#eceeee"], [1, "#c9cdcf"]], 0, 0, 1, 0)}"/><ellipse cx="${x}" cy="${y - h}" rx="${w / 2 - 0.8}" ry="1" fill="#e2e4e4"/><rect x="${x - w / 2 + 1}" y="${y - h * 0.68}" width="${w - 2}" height="${h * 0.36}" fill="#2f6db5"/><text x="${x}" y="${y - h * 0.44}" font-size="2" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">WEISS</text><path d="M${x - w / 2 + 0.8} ${y - h + 0.4} Q${x} ${y - h - 4} ${x + w / 2 - 0.8} ${y - h + 0.4}" stroke="#7d868d" stroke-width=".35" fill="none"/>`;
  k += eimer(-6.4, 0, 12, 11) + eimer(6.4, 0, 12, 11) + eimer(0, -11.4, 12, 11);
  S.teil({ id: "bm_farbeimer", de: "der Farbeimer", syl: "FARB-ei-mer", it: "il secchio di vernice", itSyl: "SEC-chio di ver-NI-ce", en: "paint tin", x: 190, y: 162, steht: true, kunst: k,
    tipp: "Für ein Zimmer von zwanzig Quadratmetern braucht man etwa zehn Liter Wandfarbe." });
}
{
  /* DER PINSEL — liegt auf dem oberen Eimer, daneben eine Farbrolle */
  let k = `<g transform="rotate(-14)"><rect x="-7" y="-1.2" width="7" height="1.6" rx=".6" fill="#c8964f"/><rect x="0" y="-1.5" width="2" height="2.2" fill="${STAHL}"/><path d="M2 -1.6 L6.4 -1.8 L6.4 1 L2 .8 Z" fill="#3a2a1c"/></g>`;
  S.teil({ oben: true, id: "bm_pinsel", de: "der Pinsel", syl: "PIN-sel", it: "il pennello", itSyl: "pen-NEL-lo", en: "brush", x: 190, y: 138.6, steht: true, kunst: k + flaeche(-8, -4, 16, 6) });
}

/* =====================================================================
   DIE SB-KASSE (rechts, vor dem Gang)
   ===================================================================== */
{
  let k = schatten(0, 0, 14, 1.4, 0.3);
  k += `<rect x="-11" y="-34" width="22" height="34" rx="1" fill="${S.lg("kasse", [[0, "#e9ecee"], [1, "#b9bfc4"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-12" y="-36" width="24" height="3" rx=".8" fill="#3a3e44"/><rect x="-8" y="-35.6" width="8" height="2.2" fill="#c0392b" opacity=".85"/>`;
  k += `<rect x="-2" y="-52" width="3" height="16" fill="#3a3e44"/><path d="M-9 -64 L9 -64 L9 -50 L-9 -50 Z" fill="#1d1f23"/><rect x="-8" y="-63" width="16" height="12" fill="${S.lg("kschirm", [[0, "#2f6db5"], [1, "#1f4f8a"]])}"/><text x="0" y="-58" font-size="2.2" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">Artikel</text><text x="0" y="-55" font-size="2.2" text-anchor="middle" fill="#fff" font-family="Arial">scannen</text>`;
  k += `<rect x="4" y="-33" width="5" height="7" rx=".6" fill="#2a2e33"/><rect x="4.6" y="-32.4" width="3.8" height="2.4" fill="#9cd3e8"/>`;
  k += `<rect x="-14" y="-25" width="10" height="2" fill="#596068"/><rect x="-13" y="-23" width="8" height="1" fill="#e74c3c" opacity=".8"/>`;
  /* Leuchte mit Nummer */
  k += `<rect x="9" y="-82" width="1.4" height="48" fill="#3a3e44"/><rect x="5.6" y="-88" width="8.2" height="7" rx="1" fill="#27ae60"/><text x="9.7" y="-82.6" font-size="5" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">3</text>`;
  k += `<text x="0" y="-12" font-size="3" text-anchor="middle" fill="#1f4f8a" font-family="Arial" font-weight="bold">SB-KASSE</text>`;
  S.teil({ id: "bm_kassenzone", de: "die Kasse", syl: "KAS-se", it: "la cassa", itSyl: "CAS-sa", en: "checkout", x: 304, y: 162, steht: true, kunst: k,
    tipp: "An der SB-Kasse scannt man selbst und bezahlt mit Karte." });
}

/* =====================================================================
   DER FACHVERKÄUFER an der Säge; PALETTE und BRETT davor
   ===================================================================== */
{
  const m = B.mensch({ id: "b04e_verk", geschlecht: "m", pose: "halten", blick: -42, frisur: "kurz", haarfarbe: "braun", haut: "hell", bart: true,
    kleidung: { oberteil: { stueck: "tshirt", farbe: "#e2721a" }, jacke: { stueck: "weste", farbe: "#1f4f8a" }, unterteil: { stueck: "arbeitshose" }, schuhe: { stueck: "stiefel", farbe: "schwarz" }, zubehoer: { stueck: "handschuhe", farbe: "#d8ad3a" } } }, 100);
  S.teil({ id: "bm_verkaeufer_bm", de: "der Fachverkäufer", syl: "FACH-ver-käu-fer", it: "il commesso", itSyl: "com-MES-so", en: "sales assistant", x: 64, y: 168, kunst: m.svg,
    tipp: "Er schneidet die Platte auf den Millimeter genau zu." });
}
{
  /* DIE PALETTE (Europalette) */
  let k = schatten(0, 0, 30, 1.6, 0.32);
  k += `<rect x="-28" y="-9" width="56" height="2.4" fill="${HOLZ}"/><rect x="-28" y="-2.4" width="56" height="2.4" fill="${HOLZ}"/>`;
  for (const x of [-28, -3.5, 21]) k += `<rect x="${x}" y="-6.6" width="7" height="4.2" fill="${S.lg("klotz", [[0, "#d8b483"], [1, "#b48a58"]])}"/><rect x="${x + 2.4}" y="-5.6" width="2.2" height="1.4" fill="#3a2a1c" opacity=".5"/>`;
  k += `<rect x="-26" y="-6.6" width="2" height="1" fill="#2a2a2a" opacity=".6"/><text x="-0" y="-4" font-size="1.4" text-anchor="middle" fill="#3a2a1c" font-family="Arial" font-weight="bold">EPAL</text>`;
  S.teil({ id: "bm_palette_bm", de: "die Palette", syl: "Pa-LET-te", it: "il bancale", itSyl: "ban-CA-le", en: "pallet", x: 28, y: 194, steht: true, kunst: k,
    tipp: "Eine Europalette ist 1,20 Meter lang und 80 Zentimeter breit." });
}
{
  /* DAS BRETT — Stapel Leimholzbretter auf der Palette */
  let k = "";
  for (let i = 0; i < 6; i++) {
    const y = -i * 2.6, dx = (i % 2 ? 0.8 : -0.6);
    k += `<rect x="${r(-27 + dx)}" y="${r(y - 2.6)}" width="54" height="2.6" fill="${S.lg("brett", [[0, "#ecd3a3"], [1, "#d4b07a"]])}"/><rect x="${r(-27 + dx)}" y="${r(y - 2.6)}" width="54" height=".5" fill="#fff" opacity=".35"/>`;
    k += `<rect x="${r(27 + dx - 1.4)}" y="${r(y - 2.6)}" width="1.4" height="2.6" fill="#c9a06a"/>`;
  }
  k += `<rect x="-6" y="-14" width="12" height="4" fill="#fff"/><text x="0" y="-11.2" font-size="2" text-anchor="middle" fill="#222" font-family="Arial" font-weight="bold">Fichte 18 mm</text>`;
  S.teil({ oben: true, id: "bm_holzbrett", de: "das Brett", syl: "BRETT", it: "l'asse", itSyl: "AS-se", en: "board", x: 28, y: 185, steht: true, kunst: k });
}

/* =====================================================================
   DER KUNDE mit dem FARBFÄCHER; DER EINKAUFSWAGEN
   ===================================================================== */
let kHand = null;
{
  const m = B.mensch({ id: "b04e_kunde", geschlecht: "m", pose: "halten", blick: 24, frisur: "locken", haarfarbe: "schwarz", haut: "mittel",
    kleidung: { oberteil: { stueck: "hemd", farbe: "#4f8a46" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" } } }, 102);
  const h = m.z.handR.x > m.z.handL.x ? m.z.handR : m.z.handL;
  kHand = { x: 252 + h.x * m.k, y: 180 + h.y * m.k };
  S.teil({ id: "bm_kunde_bm", de: "der Kunde", syl: "KUN-de", it: "il cliente", itSyl: "cli-EN-te", en: "customer", x: 252, y: 180, kunst: m.svg,
    tipp: "Er sucht für sein Wohnzimmer einen hellen Grünton aus." });
}
{
  /* DER FARBFÄCHER in der Hand des Kunden */
  let k = "";
  const fa = ["#e8f1e4", "#cfe3c6", "#a9cf9b", "#7fb26f", "#5a9150", "#3f6e38"];
  fa.forEach((f, i) => { k += `<rect x="-.8" y="-12" width="2.6" height="12" rx=".4" fill="${f}" stroke="#bbb" stroke-width=".12" transform="rotate(${-36 + i * 12} 0 0)"/>`; });
  k += `<circle cx="0" cy="0" r=".7" fill="#596068"/>`;
  S.teil({ oben: true, id: "bm_farbfaecher", de: "der Farbfächer", syl: "FARB-fä-cher", it: "la mazzetta colori", itSyl: "maz-ZET-ta co-LO-ri", en: "colour fan", x: r(kHand.x + 1), y: r(kHand.y + 1), kunst: k + flaeche(-8, -13, 16, 14),
    tipp: "Mit dem Farbfächer sucht man den Farbton aus; die Nummer gibt man an der Farbmischanlage an." });
}
{
  /* großer Baumarkt-Einkaufswagen, seitlich */
  const X = 291, Y = 196;
  let k = schatten(0, 0, 26, 1.8, 0.3);
  for (const x of [-20, 16]) k += `<circle cx="${x}" cy="-2.4" r="2.4" fill="#1b1b1e"/><circle cx="${x}" cy="-2.4" r=".8" fill="#888"/><rect x="${x - 0.6}" y="-8" width="1.2" height="4" fill="#7d848b"/>`;
  k += `<rect x="-24" y="-11" width="44" height="2" rx=".6" fill="#596068"/>`;
  k += `<path d="M-24 -11 L-26 -40 L22 -40 L20 -11 Z" fill="none" stroke="#7d848b" stroke-width="1"/>`;
  for (let x = -22; x <= 18; x += 4) k += `<line x1="${x}" y1="-38.6" x2="${x - 0.2}" y2="-12" stroke="#9aa2a8" stroke-width=".4"/>`;
  for (let y = -36; y <= -14; y += 4) k += `<line x1="-25" y1="${y}" x2="21" y2="${y}" stroke="#9aa2a8" stroke-width=".4"/>`;
  k += `<path d="M22 -40 L28 -46 L28 -48" stroke="#7d848b" stroke-width="1.2" fill="none"/><rect x="25" y="-50" width="7" height="2.6" rx="1.2" fill="#e2721a"/>`;
  /* im Wagen: ein Karton und eine Farbrolle */
  k += `<rect x="-20" y="-28" width="18" height="16" fill="${S.lg("ktn", [[0, "#d7b07a"], [1, "#b98f58"]])}"/><rect x="-17" y="-24" width="9" height="4" fill="#fff" opacity=".8"/>`;
  k += `<rect x="2" y="-30" width="12" height="4" rx="2" fill="#f4f1ea"/><path d="M14 -28 L18 -28 L18 -20" stroke="#596068" stroke-width=".8" fill="none"/><rect x="17" y="-20" width="2" height="7" rx=".6" fill="#2a2a2a"/>`;
  S.teil({ id: "bm_einkaufswagen_bm", de: "der Einkaufswagen", syl: "EIN-kaufs-wa-gen", it: "il carrello", itSyl: "car-REL-lo", en: "trolley", x: X, y: Y, steht: true, kunst: k });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/baumarkt.js"));
console.log(aus);
