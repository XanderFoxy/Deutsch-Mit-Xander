#!/usr/bin/env node
/* =====================================================================
   DAS SCHNELLRESTAURANT (FASSUNG 852) — Bilderwelt neu
   ---------------------------------------------------------------------
   RECHERCHE (Berichte über Bestellterminals in deutschen Burger-Ketten,
   Anbieter von Kiosk-Bestellsystemen, Bilder heutiger Filialen):
   - Vorne links die BESTELLTERMINALS: hochkant gestellte Touchscreens
     auf einer Säule, darunter Kartenleser und Bon-Drucker. Man bestellt,
     zahlt bargeldlos und bekommt eine BESTELLNUMMER.
   - Über dem Tresen die MENÜTAFELN als Bildschirme; an der Wand die
     ANZEIGE „In Vorbereitung / Abholbereit“ mit den Nummern.
   - Hinter dem Tresen: Getränkeautomat (Zapfstation mit Bechern),
     Pommes unter der WÄRMELAMPE; am Tresen die Kassiererin mit Kasse,
     fertige Bestellung in der Papiertüte zum Mitnehmen.
   - Gastraum: Tische und Stühle, ein ABFALLSCHRANK mit Tablettablage,
     durch das Fenster sieht man den DRIVE-IN.
   Maßstab: Rückwand ≈ 46 Einheiten je Meter (Wandfuß y = 124),
   Tresen ≈ 52 je Meter, vorn ≈ 60 je Meter. Fluchtpunkt (160 | 90).
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "schnellrestaurant", titel: "Das Schnellrestaurant", emoji: "🍔", thema: "Essen & Trinken", kuerzel: "b11d", fassung: 852 });
const rnd = zufall(1955);
const r = B.r;
const T = (x, y, s, t, f = "#222", a = "middle", w = "normal", fam = "Arial,Helvetica,sans-serif", extra = "") =>
  `<text x="${r(x)}" y="${r(y)}" font-size="${s}" text-anchor="${a}" fill="${f}" font-family="${fam}" font-weight="${w}"${extra}>${t}</text>`;

/* ---------- Stoffe ---------------------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const ROT = "#c62828", SENF = "#f2b31e", DUNKEL = "#24262a";
const STAHL = S.lg("stahl", [[0, "#eef1f3"], [0.45, "#c9cfd4"], [0.55, "#b5bcc2"], [1, "#e1e5e8"]], 0, 0, 1, 0);
const HOLZ = S.lg("holz", [[0, "#b9844f"], [1, "#94653a"]], 0, 0, 1, 0);
const BUN = S.rg("bun", [[0, "#f2c070"], [0.6, "#d8913a"], [1, "#a8601d"]], 0.45, 0.3, 0.8);
const POMMES = S.lg("pommes", [[0, "#ffe08a"], [1, "#e9b44a"]]);
const SCHIRM = S.lg("schirm", [[0, "#2a2c31"], [1, "#121316"]]);

/* =====================================================================
   KULISSE — Decke mit Lichtband, Wand mit Holzlamellen, Fliesenboden
   ===================================================================== */
const WU = 124, VP = { x: 160, y: 90 };
S.hinten(`<rect x="0" y="0" width="320" height="10" fill="${S.lg("decke", [[0, "#3a3c42"], [1, "#2a2c31"]])}"/>`);
for (const x of [40, 120, 200, 280]) S.hinten(`<circle cx="${x}" cy="5" r="2.6" fill="#fff6d8"/><ellipse cx="${x}" cy="10" rx="14" ry="5" fill="#fff3cf" opacity=".18"/>`);
S.hinten(`<rect x="0" y="10" width="320" height="${WU - 10}" fill="${S.lg("wand", [[0, "#f4ece0"], [1, "#e6dccb"]])}"/>`);
/* Holzlamellen hinter dem Tresen, rote Wand links */
{
  let k = `<rect x="56" y="10" width="194" height="${WU - 10}" fill="${HOLZ}"/>`;
  for (let x = 58; x < 250; x += 4.4) k += `<rect x="${r(x)}" y="10" width="1.2" height="${WU - 10}" fill="#6e4422" opacity=".55"/>`;
  k += `<rect x="56" y="10" width="194" height="${WU - 10}" fill="${S.lg("lamellenlicht", [[0, "#000", 0.25], [0.3, "#000", 0], [1, "#000", 0.2]])}"/>`;
  k += `<rect x="0" y="10" width="56" height="${WU - 10}" fill="${ROT}"/><rect x="0" y="10" width="56" height="${WU - 10}" fill="${S.lg("rotlicht", [[0, "#fff", 0.12], [1, "#000", 0.15]])}"/>`;
  S.hinten(k);
}
/* Küchenrückwand und Rückbuffet (Oberkante y = 98) */
S.hinten(`<rect x="60" y="62" width="186" height="${WU - 62}" fill="#eceae5"/>` +
  Array.from({ length: 12 }, (_, i) => `<line x1="60" y1="${62 + i * 5}" x2="246" y2="${62 + i * 5}" stroke="#d2cfc7" stroke-width=".3"/>`).join("") +
  `<rect x="60" y="98" width="186" height="${WU - 98}" fill="${STAHL}"/><rect x="60" y="97" width="186" height="2" fill="#f4f6f7"/>`);
/* heller Fliesenboden */
{
  let f = `<rect x="0" y="${WU}" width="320" height="${200 - WU}" fill="${S.lg("boden", [[0, "#b3b0aa"], [1, "#d2cfc8"]])}"/>`;
  for (let i = -12; i <= 12; i++) { const xw = VP.x + i * 22; f += `<line x1="${xw}" y1="${WU}" x2="${r(VP.x + (xw - VP.x) * (200 - VP.y) / (WU - VP.y))}" y2="200" stroke="#97938b" stroke-width=".4"/>`; }
  for (const y of [128.5, 134, 141, 150, 162, 178, 200]) f += `<line x1="0" y1="${y}" x2="320" y2="${y}" stroke="#97938b" stroke-width=".4"/>`;
  f += `<rect x="0" y="${WU}" width="320" height="${200 - WU}" fill="${S.lg("bodenlicht", [[0, "#000", 0.18], [0.4, "#000", 0], [1, "#fff", 0.1]])}"/>`;
  S.hinten(f);
}

/* =====================================================================
   1 — DER DRIVE-IN (Blick durchs Fenster rechts)
   ===================================================================== */
{
  const X0 = 254, X1 = 318, Y0 = 22, Y1 = 98, cx = (X0 + X1) / 2, W = X1 - X0, H = Y1 - Y0;
  let k = `<rect x="${-W / 2 - 1.6}" y="${-H - 1.6}" width="${W + 3.2}" height="${H + 3.2}" fill="#5c646b"/>`;
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="${H}" fill="${S.lg("draussen", [[0, "#7cc0ea"], [0.55, "#d6eefa"], [0.56, "#8fae6a"], [0.62, "#7a9a58"], [0.63, "#6a6e74"], [1, "#55595e"]])}"/>`;
  k += `<ellipse cx="-14" cy="${-H + 12}" rx="10" ry="3" fill="#fff" opacity=".8"/><ellipse cx="12" cy="${-H + 20}" rx="8" ry="2.4" fill="#fff" opacity=".7"/>`;
  /* Fahrspur mit Pfeil */
  k += `<path d="M${-W / 2} -18 L${W / 2} -18" stroke="#f4f4ef" stroke-width=".7" stroke-dasharray="4 3"/><path d="M-6 -8 L6 -8 L6 -10 L11 -6.8 L6 -3.6 L6 -5.6 L-6 -5.6 Z" fill="#f4f4ef"/>`;
  /* Schild am Pfosten */
  k += `<rect x="-24.6" y="${-H + 30}" width="1.2" height="${H - 48}" fill="#7d868d"/><rect x="-30" y="${-H + 22}" width="14" height="10" rx="1" fill="${ROT}"/>` + T(-23, -H + 27, 2.6, "DRIVE-IN", "#fff", "middle", "bold") + `<path d="M-27 ${-H + 29.6} L-19 ${-H + 29.6} L-19 ${-H + 28.6} L-17 ${-H + 30} L-19 ${-H + 31.4} L-19 ${-H + 30.4} L-27 ${-H + 30.4} Z" fill="${SENF}"/>`;
  /* Auto am Bestellpunkt (Seitenansicht) */
  k += `<path d="M-6 -20 L-6 -27 Q-6 -29 -4 -29 L2 -29 L6 -34 Q7 -35 9 -35 L20 -35 Q22 -35 24 -30 L28 -29 Q31 -28.6 31 -26 L31 -20 Z" fill="${S.lg("auto", [[0, "#3f7fc4"], [1, "#24578f"]])}" transform="translate(-6 0)"/>`;
  k += `<path d="M8 -33.6 L13 -33.6 L13 -29.6 L4 -29.6 Z M14.4 -33.6 L19.6 -33.6 L22 -29.6 L14.4 -29.6 Z" fill="#cfe6f3" transform="translate(-6 0)"/>`;
  for (const x of [0, 20]) k += `<circle cx="${x}" cy="-20" r="3.2" fill="#1d1d1d"/><circle cx="${x}" cy="-20" r="1.3" fill="#9aa3aa"/>`;
  /* Bestellsäule */
  k += `<rect x="-26" y="-30" width="4" height="12" rx=".6" fill="${DUNKEL}"/><rect x="-25.4" y="-29" width="2.8" height="4" fill="#3c8fd1"/>`;
  /* Fensterkreuz und Spiegelung */
  k += `<rect x="-.8" y="${-H}" width="1.6" height="${H}" fill="#5c646b"/>`;
  k += `<path d="M${-W / 2} ${-H} L${-W / 2 + 16} ${-H} L${-W / 2} ${-H + 34} Z" fill="#fff" opacity=".18"/><path d="M6 ${-H} L12 ${-H} L${W / 2} ${-H + 30} L${W / 2} ${-H + 44} Z" fill="#fff" opacity=".12"/>`;
  k += `<rect x="${-W / 2 - 2}" y="0" width="${W + 4}" height="2.4" fill="#d9d6cf"/>`;
  S.teil({ id: "sr_drivein", de: "der Drive-in", syl: "DRIVE-in", it: "il drive-in", itSyl: "DRIVE-in", en: "drive-through", x: cx, y: Y1, kunst: k,
    tipp: "Am Drive-in bestellt man vom Auto aus und holt das Essen am Fenster ab." });
}

/* =====================================================================
   2 — DIE ANZEIGE (Bestellnummern: In Vorbereitung / Abholbereit)
   ===================================================================== */
{
  let k = `<rect x="-22" y="-16" width="44" height="32" rx="1.4" fill="#111"/><rect x="-20.6" y="-14.6" width="41.2" height="29.2" fill="${SCHIRM}"/>`;
  k += `<rect x="-20.6" y="-14.6" width="20.4" height="5.4" fill="#4a4d55"/><rect x=".2" y="-14.6" width="20.4" height="5.4" fill="#2e8a3e"/>`;
  k += T(-10.4, -10.8, 2.3, "In Vorbereitung", "#fff", "middle", "bold") + T(10.4, -10.8, 2.6, "Abholbereit", "#fff", "middle", "bold");
  [[112, 115], [117, 118], [121]].forEach((z, i) => z.forEach((n, j) => { k += T(-15 + j * 10, -3.4 + i * 6, 4.2, n, "#e6e6e6", "middle", "bold"); }));
  [[108, 109], [111]].forEach((z, i) => z.forEach((n, j) => { k += T(5.4 + j * 10, -3.4 + i * 6, 4.4, n, i === 0 && j === 0 ? SENF : "#7fe08a", "middle", "bold"); }));
  k += `<line x1="0" y1="-9" x2="0" y2="14" stroke="#4a4d55" stroke-width=".4"/>`;
  S.teil({ id: "sr_anzeige", de: "die Anzeige", syl: "AN-zei-ge", it: "il display", itSyl: "di-SPLAY", en: "display", x: 28, y: 44, kunst: k,
    tipp: "Steht die Bestellnummer unter „Abholbereit“, holt man das Essen am Tresen ab." });
}

/* =====================================================================
   3 — DIE MENÜTAFEL (drei Bildschirme über dem Tresen) — Lupe
   ===================================================================== */
{
  const X0 = 78, X1 = 242, Y0 = 13, Y1 = 50, cx = (X0 + X1) / 2, W = X1 - X0, H = Y1 - Y0;
  const sw = (W - 4) / 3;
  let k = "";
  const unter = [];
  const bilder = {
    burger: (x, y, s = 1) => `<g transform="translate(${r(x)} ${r(y)}) scale(${s})"><path d="M-7 -1 Q-7 -6.6 0 -6.8 Q7 -6.6 7 -1 Z" fill="${BUN}"/>${[[-3, -4.6], [0, -5.4], [3, -4.4], [-1.4, -3.4], [1.8, -3.2]].map(([a, b]) => `<ellipse cx="${a}" cy="${b}" rx=".4" ry=".22" fill="#fff6dc"/>`).join("")}<path d="M-7.4 -1 L7.4 -1 L6 1.4 L-6 1.4 Z" fill="#7ac142"/><path d="M-7 .2 L7 .2 L7.8 1.6 L-7.8 1.6 Z" fill="#f2b31e"/><rect x="-7" y="1.4" width="14" height="2.2" rx="1" fill="#5a2e16"/><path d="M-6.6 3.6 L6.6 3.6 Q6.6 5.8 0 5.8 Q-6.6 5.8 -6.6 3.6 Z" fill="${BUN}"/></g>`,
    pommes: (x, y, s = 1) => `<g transform="translate(${r(x)} ${r(y)}) scale(${s})"><path d="M-4.6 -1 L4.6 -1 L3.6 6 L-3.6 6 Z" fill="${ROT}"/>${[-3.4, -2, -.6, .8, 2.2, 3.4].map((a, i) => `<rect x="${a - 0.5}" y="${-6 + (i % 2)}" width="1" height="6" fill="${POMMES}" transform="rotate(${-8 + i * 3} 0 0)"/>`).join("")}</g>`,
    becher: (x, y, s = 1) => `<g transform="translate(${r(x)} ${r(y)}) scale(${s})"><path d="M-3.6 -6 L3.6 -6 L2.8 6 L-2.8 6 Z" fill="#fff"/><rect x="-3.8" y="-7" width="7.6" height="1.4" rx=".5" fill="#e6e6e6"/><path d="M-3.4 -2 L3.4 -2 L3.1 2 L-3.1 2 Z" fill="${ROT}"/><path d="M1 -7 L2.4 -11" stroke="#e8e0cc" stroke-width=".8"/></g>`,
    nuggets: (x, y) => `<rect x="${x - 6}" y="${y - 2}" width="12" height="7" rx="1" fill="${SENF}"/>${[[-3.6, -2.6], [0, -3.4], [3.4, -2.4], [-1.6, -1], [2, -.6]].map(([a, b]) => `<ellipse cx="${x + a}" cy="${y + b}" rx="2.2" ry="1.6" fill="#d9993e" stroke="#b8732a" stroke-width=".25"/>`).join("")}`,
    salat: (x, y) => `<ellipse cx="${x}" cy="${y + 2}" rx="8" ry="3" fill="#e9eef0"/><path d="M${x - 7} ${y + 2} Q${x} ${y - 6} ${x + 7} ${y + 2}" fill="#7ac142"/>${[[-3, -1], [2, -2], [4, 0], [-1, .6]].map(([a, b]) => `<circle cx="${x + a}" cy="${y + b}" r="1.2" fill="#d8352a"/>`).join("")}<path d="M${x - 4} ${y} q2 -2 4 0" stroke="#f2e6c0" stroke-width=".8" fill="none"/>`,
    wrap: (x, y) => `<g transform="rotate(-18 ${x} ${y})"><rect x="${x - 8}" y="${y - 3}" width="16" height="6.4" rx="3.2" fill="#f2dcae"/><path d="M${x + 5} ${y - 3} q3 3.2 0 6.4" fill="#7ac142"/><rect x="${x - 8}" y="${y - 3.2}" width="7" height="6.8" rx="1" fill="#fff"/></g>`,
    shake: (x, y) => `<path d="M${x - 3.6} ${y - 5} L${x + 3.6} ${y - 5} L${x + 2.8} ${y + 6} L${x - 2.8} ${y + 6} Z" fill="#f6c6d4"/><path d="M${x - 3.8} ${y - 5} Q${x} ${y - 9} ${x + 3.8} ${y - 5} Z" fill="#fff"/><circle cx="${x}" cy="${y - 8.4}" r="1" fill="#c8202a"/><path d="M${x + 1} ${y - 7} L${x + 2.6} ${y - 12}" stroke="${ROT}" stroke-width=".8"/>`,
    eis: (x, y) => `<path d="M${x - 5} ${y - 1} L${x + 5} ${y - 1} L${x + 3.4} ${y + 6} L${x - 3.4} ${y + 6} Z" fill="#fff" stroke="#ddd" stroke-width=".25"/><path d="M${x - 4.6} ${y - 1} Q${x - 3} ${y - 7} ${x} ${y - 7.6} Q${x + 3} ${y - 7} ${x + 4.6} ${y - 1} Z" fill="#fbf6e6"/><path d="M${x - 3.6} ${y - 3} q2 1.6 3.6 0 q1.8 -1.6 3.6 .2" stroke="#6b3a1e" stroke-width="1.1" fill="none"/>`,
  };
  const teile = [
    [0, "Burger", [["sr_cheeseburger", "der Cheeseburger", "CHEESE-bur-ger", "il cheeseburger", "CHEESE-bur-ger", "cheeseburger", "burger", "4,49 €", "Cheeseburger"], ["sr_wrap", "der Wrap", "WRAP", "il wrap", "WRAP", "wrap", "wrap", "4,99 €", "Wrap"]]],
    [1, "Menüs", [["sr_nuggets", "die Chicken-Nuggets", "CHI-cken-nug-gets", "le crocchette di pollo", "croc-CHET-te di POL-lo", "chicken nuggets", "nuggets", "5,49 €", "Nuggets"], ["sr_salat", "der Salat", "sa-LAT", "l'insalata", "in-sa-LA-ta", "salad", "salat", "4,79 €", "Salat"]]],
    [2, "Desserts", [["sr_milchshake", "der Milchshake", "MILCH-shake", "il frappè", "frap-PÈ", "milkshake", "shake", "3,29 €", "Milchshake"], ["sr_eisbecher", "der Eisbecher", "EIS-be-cher", "la coppa gelato", "COP-pa ge-LA-to", "sundae", "eis", "2,99 €", "Eisbecher"]]],
  ];
  for (const [i, kopf, liste] of teile) {
    const x = -W / 2 + i * (sw + 2), y = -H;
    k += `<rect x="${r(x - 0.6)}" y="${r(y - 0.6)}" width="${r(sw + 1.2)}" height="${H + 1.2}" rx="1" fill="#0d0e10"/>`;
    k += `<rect x="${r(x)}" y="${y}" width="${r(sw)}" height="${H}" fill="${SCHIRM}"/><rect x="${r(x)}" y="${y}" width="${r(sw)}" height="6.6" fill="${ROT}"/>` + T(x + sw / 2, y + 5, 4.4, kopf, "#fff", "middle", "bold", "'Arial Black',Arial,sans-serif");
    /* Mitte: großes Menübild */
    if (i === 1) {
      k += `<rect x="${r(x + 2)}" y="${y + 8}" width="${r(sw - 4)}" height="13" rx="1" fill="${S.rg("menulicht", [[0, "#ffe9b0"], [1, "#f2b31e"]])}"/>` + bilder.burger(x + 14, y + 15.6, 1) + bilder.pommes(x + 26, y + 14.4, 0.9) + bilder.becher(x + 36, y + 14.6, 0.9);
      k += T(x + sw - 4, y + 13, 2.6, "Menü", "#5a2e16", "end", "bold") + T(x + sw - 4, y + 18.4, 3.6, "8,99 €", ROT, "end", "bold");
    } else {
      k += `<rect x="${r(x + 2)}" y="${y + 8}" width="${r(sw - 4)}" height="13" rx="1" fill="#33363c"/>`;
      k += T(x + sw / 2, y + 13.4, 3, i === 0 ? "Doppelt lecker!" : "Süß &amp; kalt", SENF, "middle", "bold") + T(x + sw / 2, y + 18.6, 2.4, i === 0 ? "2 Burger für 7 €" : "Shake + Eis 5,49 €", "#fff", "middle", "normal");
    }
    liste.forEach(([id, de, syl, it, itSyl, en, b, preis, name], j) => {
      const bx = x + 2 + j * (sw - 4) / 2, by = y + 23, bw = (sw - 4) / 2 - 1;
      k += `<rect x="${r(bx)}" y="${by}" width="${r(bw)}" height="13" rx=".8" fill="#3a3d44"/>`;
      k += `<rect x="${r(bx + 0.8)}" y="${by + 0.8}" width="${r(bw - 1.6)}" height="8" rx=".6" fill="${S.rg("kachel" + i + j, [[0, "#fff6dc"], [1, "#e9d4a6"]])}"/>` + `<g transform="translate(${r(bx + bw / 2)} ${by + 4.8}) scale(.62)">${bilder[b](0, 0)}</g>`;
      k += T(bx + 1.2, by + 11.9, 1.9, name, "#fff", "start", "bold") + T(bx + bw - 1, by + 11.9, 2.1, preis, SENF, "end", "bold");
      unter.push({ id, de, syl, it, itSyl, en, x: cx + bx + bw / 2, y: Y1 + by + 13, kunst: flaeche(-bw / 2, -13, bw, 13.4) });
    });
    k += `<path d="M${r(x)} ${y} L${r(x + 10)} ${y} L${r(x)} ${y + 16} Z" fill="#fff" opacity=".06"/>`;
  }
  S.teil({ id: "sr_speisekarte_sr", de: "die Menütafel", syl: "Me-NÜ-ta-fel", it: "il tabellone del menù", itSyl: "ta-bel-LO-ne del me-NÙ", en: "menu board", x: cx, y: Y1, kunst: k,
    zoom: { x: X0 - 4, y: Y0 - 3, w: W + 8, h: 58 }, unter,
    tipp: "Auf der Menütafel stehen alle Burger, Menüs und Desserts mit Preis." });
}

/* =====================================================================
   4 — DER GETRÄNKEAUTOMAT und 5 — DIE WÄRMELAMPE (hinter dem Tresen)
   ===================================================================== */
{
  let k = schatten(0, 0, 15, 1.2, .3);
  k += `<rect x="-14" y="-28" width="28" height="28" rx="1.2" fill="${STAHL}"/><rect x="-14" y="-28" width="28" height="9" rx="1.2" fill="${DUNKEL}"/>`;
  const sorten = [["#3a1a10", "Cola"], ["#f08a24", "Orange"], ["#7ac142", "Zitrone"], ["#c9862a", "Eistee"], ["#7fc4ea", "Wasser"]];
  sorten.forEach(([f, t], i) => {
    const x = -11.2 + i * 5.6;
    k += `<rect x="${r(x - 2.4)}" y="-26.6" width="4.8" height="6.2" rx=".5" fill="${f}"/>` + T(x, -22.6, 1.15, t, "#fff", "middle", "bold");
    k += `<rect x="${r(x - 0.7)}" y="-19" width="1.4" height="2.6" fill="#7d868d"/>`;
  });
  k += `<path d="M-1.6 -14.6 L4.4 -14.6 L3.8 -5 L-1 -5 Z" fill="#fff" stroke="#ddd" stroke-width=".2"/><path d="M-1.4 -11 L4.2 -11 L3.9 -7.6 L-1.1 -7.6 Z" fill="${ROT}"/><line x1="1.4" y1="-16.4" x2="1.4" y2="-14.6" stroke="#f08a24" stroke-width=".6" opacity=".8"/>`;
  k += `<rect x="-13" y="-4.6" width="26" height="3" rx=".6" fill="#8d969e"/>`;
  for (let i = 0; i < 12; i++) k += `<line x1="${-12 + i * 2.2}" y1="-4.3" x2="${-12 + i * 2.2}" y2="-1.9" stroke="#5c646b" stroke-width=".3"/>`;
  /* Becherstapel daneben */
  for (let i = 0; i < 3; i++) k += `<path d="M${16 + i * 0.1} ${-2 - i * 6} L${22 - i * 0.1} ${-2 - i * 6} L${21.4} ${-8 - i * 6} L${16.6} ${-8 - i * 6} Z" fill="#fff" stroke="#ddd" stroke-width=".2"/>`;
  S.teil({ id: "sr_getraenkeautomat", de: "der Getränkeautomat", syl: "ge-TRÄN-ke-au-to-mat", it: "il distributore di bibite", itSyl: "di-stri-bu-TO-re di BI-bi-te", en: "drinks dispenser", x: 90, y: 98, steht: true, kunst: k,
    tipp: "Am Getränkeautomat werden die Becher gefüllt — mit Eis oder ohne." });
}
{
  let k = schatten(0, 0, 18, 1.2, .3);
  /* Pommes-Wanne aus Edelstahl mit Pommes und Tüten */
  k += `<rect x="-17" y="-9" width="34" height="9" rx=".8" fill="${STAHL}"/>`;
  k += `<path d="M-15 -9 L15 -9 L13 -13 L-13 -13 Z" fill="#c9cfd4"/>`;
  for (let i = 0; i < 22; i++) { const x = -12 + rnd() * 22, y = -14.4 + rnd() * 2; k += `<rect x="${r(x)}" y="${r(y)}" width="3.6" height=".9" rx=".4" fill="${POMMES}" transform="rotate(${Math.round(-35 + rnd() * 70)} ${r(x + 1.8)} ${r(y + 0.45)})"/>`; }
  for (let i = 0; i < 4; i++) { const x = -11 + i * 6.6; k += `<path d="M${x - 2.4} -9 L${x + 2.4} -9 L${x + 2} -3 L${x - 2} -3 Z" fill="${ROT}"/>`; for (let j = 0; j < 4; j++) k += `<rect x="${r(x - 1.8 + j * 1.1)}" y="-13" width=".8" height="4.6" fill="${POMMES}"/>`; }
  /* Haube mit zwei glühenden Lampen */
  k += `<rect x="-1" y="-30" width="2" height="8" fill="#8d969e"/><path d="M-18 -22 L18 -22 L15 -26 L-15 -26 Z" fill="${STAHL}"/>`;
  for (const x of [-8, 8]) k += `<ellipse cx="${x}" cy="-21.6" rx="5" ry="1.2" fill="#ff6a2a"/><ellipse cx="${x}" cy="-21.6" rx="3" ry=".6" fill="#ffd27a"/>`;
  k += `<path d="M-14 -21 L-17 -10 L17 -10 L14 -21 Z" fill="${S.lg("waerme", [[0, "#ff8a3a", 0.35], [1, "#ff8a3a", 0.04]])}"/>`;
  S.teil({ id: "sr_waermelampe", de: "die Wärmelampe", syl: "WÄR-me-lam-pe", it: "la lampada riscaldante", itSyl: "LAM-pa-da ri-scal-DAN-te", en: "heat lamp", x: 206, y: 98, steht: true, kunst: k,
    tipp: "Unter der Wärmelampe bleiben die Pommes heiß und knusprig." });
}

/* =====================================================================
   6 — DIE KASSIERERIN (hinter dem Tresen, Kappe und Polo)
   ===================================================================== */
{
  const m = B.mensch({ id: "sr_kass", geschlecht: "w", pose: "stehen", blick: -18, frisur: "zopf", haarfarbe: "braun", haut: "mittel", laecheln: true,
    kleidung: { oberteil: { stueck: "tshirt", farbe: ROT }, schuerze: { stueck: "schuerze", farbe: DUNKEL }, unterteil: { stueck: "hose", farbe: "schwarz" }, schuhe: { stueck: "turnschuh", farbe: "schwarz" }, kopf: { stueck: "kappe", farbe: ROT } } }, 86);
  S.teil({ id: "sr_kassiererin", de: "die Kassiererin", syl: "Kas-SIE-re-rin", it: "la cassiera", itSyl: "cas-SIE-ra", en: "cashier", x: 146, y: 166, kunst: m.svg,
    tipp: "Die Kassiererin fragt: „Zum Hieressen oder zum Mitnehmen?“" });
}

/* =====================================================================
   7 — DER TRESEN (rot mit Holzband und Leuchtschrift)
   ===================================================================== */
const TR = { x0: 58, x1: 238, oben: 117, kante: 123, fuss: 176 };
{
  const W = TR.x1 - TR.x0, H = TR.fuss - TR.kante, cx = (TR.x0 + TR.x1) / 2;
  let k = schatten(0, 0, W / 2 + 3, 2, .3);
  k += `<path d="M${-W / 2 + 2} ${TR.oben - TR.fuss} L${W / 2 - 2} ${TR.oben - TR.fuss} L${W / 2 + 1} ${-H} L${-W / 2 - 1} ${-H} Z" fill="${S.lg("platte", [[0, "#3a3c42"], [1, "#55585f"]])}"/>`;
  k += `<rect x="${-W / 2 - 1}" y="${-H}" width="${W + 2}" height="2.6" fill="#2a2c31"/>`;
  k += `<rect x="${-W / 2}" y="${-H + 2.6}" width="${W}" height="${H - 2.6}" fill="${S.lg("front", [[0, "#d23a30"], [1, "#a82420"]])}"/>`;
  k += `<rect x="${-W / 2}" y="${-H + 16}" width="${W}" height="10" fill="${HOLZ}"/>`;
  for (let x = -W / 2 + 2; x < W / 2; x += 3.4) k += `<rect x="${r(x)}" y="${-H + 16}" width=".8" height="10" fill="#6e4422" opacity=".5"/>`;
  k += T(0, -H + 12, 6.4, "BURGER HAUS", SENF, "middle", "bold", "'Arial Black',Arial,sans-serif", ' letter-spacing="1.2"');
  k += `<rect x="${-W / 2}" y="-5" width="${W}" height="5" fill="#2a2c31"/>`;
  k += `<rect x="${-W / 2}" y="${-H + 2.6}" width="${W}" height="${H - 7.6}" fill="${S.lg("frontglanz", [[0, "#fff", 0.1], [0.3, "#fff", 0], [1, "#000", 0.15]])}"/>`;
  S.teil({ id: "sr_tresen_sr", de: "der Tresen", syl: "TRE-sen", it: "il bancone", itSyl: "ban-CO-ne", en: "counter", x: cx, y: TR.fuss, steht: true, kunst: k });
}
const PL = 121;
{
  /* DIE KASSE — Touch-Kasse mit Kundendisplay */
  let k = schatten(0, .3, 10, 1, .3) + `<rect x="-9" y="-3" width="18" height="3" rx=".6" fill="#2b2f33"/><rect x="-1.2" y="-6" width="2.4" height="3" fill="#3a3f44"/>`;
  k += `<path d="M-10 -18 L10 -18 L11 -6 L-11 -6 Z" fill="#1d2125"/><path d="M-9 -17 L9 -17 L9.8 -7 L-9.8 -7 Z" fill="${S.lg("kbild", [[0, "#2c4e6b"], [1, "#1b3247"]])}"/>`;
  for (let i = 0; i < 6; i++) k += `<rect x="${r(-8.4 + (i % 3) * 5.8)}" y="${r(-16.2 + Math.floor(i / 3) * 4.4)}" width="5" height="3.8" rx=".4" fill="${[ROT, SENF, "#7ac142", "#d9993e", "#7fc4ea", "#f6c6d4"][i]}"/>`;
  k += `<rect x="4" y="-22.6" width="8" height="4.2" rx=".4" fill="#111"/>` + T(8, -19.6, 2, "8,99", "#7cff8a", "middle", "normal", "monospace");
  S.teil({ oben: true, id: "sr_kasse", de: "die Kasse", syl: "KAS-se", it: "la cassa", itSyl: "CAS-sa", en: "cash register", x: 112, y: PL, steht: true, kunst: k });
}
{
  /* DIE TÜTE — fertige Bestellung zum Mitnehmen, mit Bon */
  let k = schatten(0, .3, 7, .8, .3);
  k += `<path d="M-6 0 L6 0 L5.4 -15 L-5.4 -15 Z" fill="${S.lg("tuete", [[0, "#d9b07a"], [1, "#c49456"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-5.4 -15 L-4 -17 L4 -17 L5.4 -15 Z" fill="#b8874a"/><path d="M-5.4 -15 l1.4 1 l1.4 -1 l1.4 1 l1.4 -1 l1.4 1 l1.4 -1 l1.4 1 l1.2 -1" stroke="#a8763a" stroke-width=".3" fill="none"/>`;
  k += T(0, -7, 2, "BURGER", ROT, "middle", "bold", "'Arial Black',Arial,sans-serif") + T(0, -4.6, 2, "HAUS", ROT, "middle", "bold", "'Arial Black',Arial,sans-serif");
  k += `<rect x="3" y="-17.6" width="4" height="6" fill="#fff" transform="rotate(10 5 -14)"/>` + T(5, -14, 1.6, "117", "#222", "middle", "bold", "Arial", ' transform="rotate(10 5 -14)"');
  S.teil({ oben: true, id: "sr_tuete", de: "die Tüte", syl: "TÜ-te", it: "il sacchetto", itSyl: "sac-CHET-to", en: "paper bag", x: 214, y: PL, steht: true, kunst: k,
    tipp: "Zum Mitnehmen kommt das Essen in die Tüte. Auf dem Bon steht die Bestellnummer." });
}

/* =====================================================================
   8 — DIE BESTELLTERMINALS (vorn links, zwei Touchscreens auf Säulen)
   ===================================================================== */
{
  let k = "";
  for (const dx of [-15, 15]) {
    k += schatten(dx, 0, 11, 1.6, .35) + `<ellipse cx="${dx}" cy="-1" rx="9" ry="2" fill="#2b2f33"/>`;
    k += `<rect x="${dx - 3.4}" y="-60" width="6.8" height="59" fill="${S.lg("saeule", [[0, "#3a3d42"], [0.5, "#55595e"], [1, "#2b2f33"]], 0, 0, 1, 0)}"/>`;
    k += `<rect x="${dx - 11}" y="-104" width="22" height="46" rx="1.6" fill="#16181b"/>`;
    k += `<rect x="${dx - 9.6}" y="-102.4" width="19.2" height="38" fill="#fafafa"/>`;
    k += `<rect x="${dx - 9.6}" y="-102.4" width="19.2" height="5.4" fill="${ROT}"/>` + T(dx, -98.6, 2.4, "Bestellen", "#fff", "middle", "bold");
    for (let i = 0; i < 6; i++) {
      const x = dx - 8.8 + (i % 2) * 9, y = -95.4 + Math.floor(i / 2) * 9;
      k += `<rect x="${r(x)}" y="${r(y)}" width="8.4" height="8" rx=".6" fill="#f1ede4"/>`;
      k += ["burger", "pommes", "becher", "nuggets", "shake", "salat"][i] === "burger" ? `<ellipse cx="${r(x + 4.2)}" cy="${r(y + 3.6)}" rx="3" ry="1.8" fill="#d8913a"/><rect x="${r(x + 1.2)}" y="${r(y + 4.2)}" width="6" height="1" fill="#5a2e16"/>` :
        `<circle cx="${r(x + 4.2)}" cy="${r(y + 4)}" r="2.2" fill="${[ROT, ROT, "#fff", "#d9993e", "#f6c6d4", "#7ac142"][i]}" stroke="#ddd" stroke-width=".2"/>`;
    }
    k += `<rect x="${dx - 8.8}" y="-68.4" width="17.6" height="3.4" rx=".6" fill="#2e8a3e"/>` + T(dx, -65.9, 2, "Bezahlen", "#fff", "middle", "bold");
    /* Kartenleser und Bondrucker unter dem Bildschirm */
    k += `<rect x="${dx - 6}" y="-56" width="12" height="7" rx=".8" fill="#2b2f33"/><rect x="${dx - 4.4}" y="-55" width="5" height="3.4" rx=".3" fill="#9cd3e8"/><path d="M${dx + 2} -54 q1 -1 0 -2 M${dx + 3} -53.4 q1.8 -1.6 0 -3.2" stroke="#4aa8d8" stroke-width=".35" fill="none"/>`;
    k += `<rect x="${dx - 4}" y="-46" width="8" height="1.2" rx=".4" fill="#111"/><path d="M${dx - 2.6} -45 L${dx + 2.6} -45 L${dx + 2.2} -41 L${dx - 2.2} -41 Z" fill="#fff"/>`;
    k += `<path d="M${dx - 9.6} -102.4 L${dx - 3} -102.4 L${dx - 9.6} -88 Z" fill="#fff" opacity=".25"/>`;
  }
  S.teil({ id: "sr_bestellterminal", de: "das Bestellterminal", syl: "Be-STELL-ter-mi-nal", it: "il totem per ordinare", itSyl: "TO-tem per or-di-NA-re", en: "ordering terminal", x: 30, y: 194, steht: true, kunst: k,
    tipp: "Am Bestellterminal tippt man sein Essen an und bezahlt mit Karte." });
}

/* =====================================================================
   9 — DER MÜLLEIMER (Abfallschrank mit Tablettablage)
   ===================================================================== */
{
  let k = schatten(0, 0, 17, 1.6, .3);
  k += `<rect x="-15" y="-52" width="30" height="52" rx="1" fill="${HOLZ}"/><rect x="-15" y="-52" width="30" height="2" fill="#d2a46e"/>`;
  for (const [x, t, f] of [[-7.4, "Papier", "#2f63c4"], [7.4, "Rest", "#3a3d42"]]) {
    k += `<rect x="${x - 6}" y="-44" width="12" height="16" rx="1" fill="#2b2f33"/><rect x="${x - 5}" y="-43" width="10" height="5" rx=".6" fill="#111"/>`;
    k += `<rect x="${x - 5}" y="-36" width="10" height="3.4" rx=".4" fill="${f}"/>` + T(x, -33.8, 2, t, "#fff", "middle", "bold");
  }
  k += T(0, -22, 3.2, "DANKE!", "#fff", "middle", "bold", "'Arial Black',Arial,sans-serif");
  k += `<rect x="-15" y="-4" width="30" height="4" fill="#5a3a1e"/>`;
  /* gestapelte Tabletts oben */
  for (let i = 0; i < 4; i++) k += `<path d="M${-12 + i * 0.2} ${-52 - i * 1.4} L${12 + i * 0.2} ${-52 - i * 1.4} L${11.4} ${-53.2 - i * 1.4} L${-11.4} ${-53.2 - i * 1.4} Z" fill="${i % 2 ? "#a82420" : ROT}"/>`;
  S.teil({ id: "sr_muelleimer", de: "der Mülleimer", syl: "MÜLL-ei-mer", it: "il cestino", itSyl: "ce-STI-no", en: "bin", x: 250, y: 170, steht: true, kunst: k,
    tipp: "Nach dem Essen trennt man den Müll: Papier und Restmüll. Das Tablett kommt oben drauf." });
}

/* =====================================================================
   10 — SITZPLATZ: DER STUHL, DIE GÄSTIN, DER TISCH mit Tablett, Burger,
        Pommes, Pappbecher und Serviettenspender
   ===================================================================== */
const SI = { stuhl: 268, tisch: 298, y: 188, s: 58 };
{
  let k = schatten(0, 0, 14, 1.8, .3);
  for (const x of [-9, 9]) k += `<rect x="${x - 0.8}" y="-26" width="1.6" height="26" fill="#2b2f33"/>`;
  k += `<rect x="-11" y="-28" width="22" height="3.4" rx="1.2" fill="${HOLZ}"/>`;
  k += `<path d="M-12 -28 L-12 -58 Q-12 -61 -9 -61 L-6 -61 L-6 -28 Z" fill="${HOLZ}"/><rect x="-12" y="-61" width="6" height="3" rx="1" fill="#d2a46e"/>`;
  S.teil({ id: "sr_stuhl", de: "der Stuhl", syl: "STUHL", it: "la sedia", itSyl: "SE-dia", en: "chair", x: SI.stuhl, y: SI.y, steht: true, kunst: k });
}
{
  const m = B.mensch({ id: "sr_gaestin", geschlecht: "w", pose: "sitzen", blick: 70, frisur: "locken", haarfarbe: "schwarz", haut: "dunkel",
    kleidung: { oberteil: { stueck: "pullover", farbe: "gruen_d" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" } } }, 1.66 * SI.s);
  const oy = SI.y - 0.47 * SI.s + m.z.sitz.y * -m.k;
  S.teil({ id: "sr_gast_sr", de: "die Gästin", syl: "GÄS-tin", it: "la cliente", itSyl: "cli-EN-te", en: "guest", x: SI.stuhl + 2, y: r(oy), kunst: m.svg,
    tipp: "Sie isst hier: „Zum Hieressen, bitte.“" });
}
const TT = SI.y - 0.75 * SI.s;   /* Tischplatte */
{
  let k = schatten(0, 0, 16, 2, .3) + `<rect x="-10" y="-2" width="20" height="2" rx=".8" fill="#2b2f33"/>`;
  k += `<rect x="-1.4" y="${TT - SI.y + 3}" width="2.8" height="${SI.y - TT - 4}" fill="#3a3d42"/>`;
  k += `<path d="M-20 ${TT - SI.y - 3} L20 ${TT - SI.y - 3} L22 ${TT - SI.y + 2} L-22 ${TT - SI.y + 2} Z" fill="${S.lg("tplatte", [[0, "#efe6d6"], [1, "#d8cbb4"]])}"/>`;
  k += `<rect x="-22" y="${TT - SI.y + 2}" width="44" height="2" fill="${HOLZ}"/>`;
  S.teil({ id: "sr_tisch", de: "der Tisch", syl: "TISCH", it: "il tavolo", itSyl: "TA-vo-lo", en: "table", x: SI.tisch, y: SI.y, steht: true, kunst: k });
}
const TP = TT + 0.6;
{
  let k = `<path d="M-13 0 L13 0 L11.4 -4.4 L-11.4 -4.4 Z" fill="${S.lg("tablett", [[0, "#b52a22"], [1, "#d23a30"]])}"/><path d="M-13 0 L13 0 L13 .8 L-13 .8 Z" fill="#8a1c16"/>`;
  k += `<path d="M-10 -1 L10 -1 L9 -3.6 L-9 -3.6 Z" fill="#f6efe0" opacity=".9"/>`;
  S.teil({ oben: true, id: "sr_tablett", de: "das Tablett", syl: "TAB-lett", it: "il vassoio", itSyl: "vas-SO-io", en: "tray", x: SI.tisch + 1, y: TP, steht: true, kunst: k + flaeche(-13, -4.6, 26, 5.6) });
}
{
  let k = schatten(0, .2, 6, .6, .3);
  k += `<path d="M-5.6 -1 L5.6 -1 Q5.6 0 0 0 Q-5.6 0 -5.6 -1 Z" fill="${BUN}"/><rect x="-5.4" y="-2.6" width="10.8" height="1.8" rx=".8" fill="#5a2e16"/><path d="M-5.8 -2.8 L5.8 -2.8 L6.4 -1.8 L-6.4 -1.8 Z" fill="${SENF}"/><path d="M-6 -3.4 L6 -3.4 L5 -2.4 L-5 -2.4 Z" fill="#7ac142"/>`;
  k += `<path d="M-5.6 -3.4 Q-5.6 -8 0 -8.2 Q5.6 -8 5.6 -3.4 Z" fill="${BUN}"/>` + [[-2.4, -6.2], [0, -7], [2.4, -6], [-1, -5], [1.6, -4.8]].map(([a, b]) => `<ellipse cx="${a}" cy="${b}" rx=".4" ry=".22" fill="#fff6dc"/>`).join("");
  S.teil({ oben: true, id: "sr_burger", de: "der Burger", syl: "BUR-ger", it: "il panino", itSyl: "pa-NI-no", en: "burger", x: SI.tisch - 6, y: TP - 1.2, steht: true, kunst: k });
}
{
  let k = `<path d="M-3.4 -6 L3.4 -6 L2.6 0 L-2.6 0 Z" fill="${ROT}"/>`;
  for (let i = 0; i < 7; i++) k += `<rect x="${r(-2.8 + i * 0.9)}" y="${r(-10 + (i % 2) * 0.8)}" width=".8" height="5" fill="${POMMES}" transform="rotate(${-9 + i * 3} 0 -6)"/>`;
  k += `<path d="M-3.4 -6 L3.4 -6 L3.2 -4.8 L-3.2 -4.8 Z" fill="#fff"/>`;
  S.teil({ oben: true, id: "sr_pommes", de: "die Pommes", syl: "POM-mes", it: "le patatine fritte", itSyl: "pa-ta-TI-ne FRIT-te", en: "chips", x: SI.tisch + 3.6, y: TP - 1.6, steht: true, kunst: k + flaeche(-3.6, -10.4, 7.2, 10.6) });
}
{
  let k = `<path d="M-3 -12 L3 -12 L2.3 0 L-2.3 0 Z" fill="${S.lg("becher", [[0, "#ffffff"], [1, "#dcdcdc"]], 0, 0, 1, 0)}"/><path d="M-2.8 -8 L2.8 -8 L2.6 -4 L-2.6 -4 Z" fill="${ROT}"/>`;
  k += `<rect x="-3.3" y="-13" width="6.6" height="1.4" rx=".5" fill="#ececec"/><path d="M.6 -13 L1.8 -17.6" stroke="#e8e0cc" stroke-width=".9"/>`;
  S.teil({ oben: true, id: "sr_pappbecher", de: "der Pappbecher", syl: "PAPP-be-cher", it: "il bicchiere di carta", itSyl: "bic-CHIE-re di CAR-ta", en: "paper cup", x: SI.tisch + 10, y: TP - 1.8, steht: true, kunst: k + flaeche(-3.4, -17.8, 6.8, 18) });
}
{
  let k = schatten(0, .2, 4, .5, .3) + `<rect x="-3.6" y="-7" width="7.2" height="7" rx=".6" fill="${DUNKEL}"/><rect x="-2.6" y="-8.2" width="5.2" height="1.6" fill="#fbfbf7"/><path d="M-2.6 -8.2 q2.6 -1.4 5.2 0" fill="#fff"/>`;
  S.teil({ oben: true, id: "sr_serviettenspender", de: "der Serviettenspender", syl: "Ser-vi-ET-ten-spen-der", it: "il portatovaglioli", itSyl: "por-ta-to-va-GLIO-li", en: "napkin dispenser", x: SI.tisch + 15, y: TT - 2, steht: true, kunst: k });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/schnellrestaurant.js"));
console.log(aus);
