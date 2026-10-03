#!/usr/bin/env node
/* =====================================================================
   DAS MÖBELHAUS (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (Möbelhäuser mit Ausstellung und SB-Lager, Berichte über
   Musterküchen und „Wohnwelten“):
   - Die Ausstellung besteht aus KOJEN: kleine, an drei Seiten offene
     Zimmer mit Rückwand und Seitenwänden, fertig eingerichtet
     (Wohnküche mit Esstisch, Wohnzimmer, Schlafzimmer), jede mit eigener
     Wandfarbe und eigenem Boden.
   - Davor der GANG mit Pfeilen auf dem Boden (der Rundweg) und
     Hängeschildern (Lieferung & Montage, Kasse, SB-Lager).
   - An jedem Möbel ein großes PREISSCHILD mit Name, Maßen, Preis und
     LAGERORT (Regal und Fach im SB-Lager). Dazu gibt es Bestellzettel,
     Bleistift und Papier-Maßband zum Mitnehmen.
   - Mitnahmemöbel holt man flach verpackt im Karton auf dem flachen
     Plattformwagen; Lieferung und Aufbau kosten extra.
   Maßstab: Rückwand ≈ 42 Einheiten je Meter, Gang vorne ≈ 60 je Meter.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "moebelhaus", titel: "Das Möbelhaus", emoji: "🛋️", thema: "Einkaufen", kuerzel: "b04d", fassung: 852 });
const rnd = zufall(1404);
const r = B.r;

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("glow")}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2"/></filter>`);
const EICHE = S.lg("eiche", [[0, "#d8b483"], [0.5, "#c89f6c"], [1, "#b48a58"]], 0, 0, 1, 0);
const WEISS = S.lg("weiss", [[0, "#ffffff"], [1, "#e5e3de"]]);
const KARTON = S.lg("karton", [[0, "#d7b07a"], [1, "#b98f58"]]);
const CHROM = S.lg("chrom", [[0, "#f4f6f8"], [0.4, "#c3c9ce"], [0.55, "#9ea6ad"], [1, "#e4e8eb"]], 0, 0, 1, 0);

/* =====================================================================
   KULISSE — Hallendecke, drei Kojen (Wände in Fluchtperspektive),
   eigene Böden, davor der Gang mit Pfeilen
   ===================================================================== */
const WU = 116, VPX = 160, VPY = -20, KANTE = 150, WTOP = 16;
const px = (x0, y) => VPX + (x0 - VPX) * (y - VPY) / (WU - VPY);
S.hinten(`<rect x="0" y="0" width="320" height="200" fill="#3b3d42"/>`);
S.hinten(`<rect x="0" y="0" width="320" height="${WTOP}" fill="${S.lg("halle", [[0, "#2a2c30"], [1, "#44474d"]])}"/>`);
for (const x of [20, 80, 140, 200, 260, 310]) S.hinten(`<line x1="${x}" y1="0" x2="${x}" y2="4" stroke="#1d1e21" stroke-width=".4"/><rect x="${x - 3}" y="4" width="6" height="1.6" rx=".6" fill="#1d1e21"/><ellipse cx="${x}" cy="6" rx="3" ry=".7" fill="#fff6dc"/>`);
const KOJEN = [
  { x0: -10, x1: 96, wand: [["#f1efe9"], ["#e3dfd6"]], boden: "fliese" },
  { x0: 96, x1: 214, wand: [["#e8dccb"], ["#d8c8b1"]], boden: "parkett" },
  { x0: 218, x1: 334, wand: [["#a9bccb"], ["#8fa5b7"]], boden: "teppich" },
];
KOJEN.forEach((k, i) => {
  S.hinten(`<rect x="${k.x0}" y="${WTOP}" width="${k.x1 - k.x0}" height="${WU - WTOP}" fill="${S.lg("kw" + i, [[0, k.wand[0][0]], [1, k.wand[1][0]]])}"/>`);
  S.hinten(`<rect x="${k.x0}" y="${WTOP}" width="${k.x1 - k.x0}" height="${WU - WTOP}" fill="${S.rg("kl" + i, [[0, "#fffaf0", 0.45], [1, "#fffaf0", 0]], 0.5, 0.1, 0.8)}"/>`);
  S.hinten(`<rect x="${k.x0}" y="${WU - 2.4}" width="${k.x1 - k.x0}" height="2.4" fill="#f7f5f0"/>`);
  /* Boden der Koje */
  const a = px(k.x0, KANTE), b = px(k.x1, KANTE);
  let f = `<path d="M${k.x0} ${WU} L${k.x1} ${WU} L${r(b)} ${KANTE} L${r(a)} ${KANTE} Z" fill="${k.boden === "fliese" ? "#d9d6d0" : k.boden === "parkett" ? "#c49a69" : "#cfc4b2"}"/>`;
  if (k.boden === "fliese") {
    for (let x = k.x0; x <= k.x1; x += 14) f += `<line x1="${x}" y1="${WU}" x2="${r(px(x, KANTE))}" y2="${KANTE}" stroke="#b4b0a8" stroke-width=".3"/>`;
    for (const y of [124, 134, 147]) f += `<line x1="${r(px(k.x0, y))}" y1="${y}" x2="${r(px(k.x1, y))}" y2="${y}" stroke="#b4b0a8" stroke-width=".3"/>`;
  } else if (k.boden === "parkett") {
    for (let x = k.x0; x <= k.x1; x += 5) f += `<line x1="${x}" y1="${WU}" x2="${r(px(x, KANTE))}" y2="${KANTE}" stroke="#94693e" stroke-width=".25" opacity=".7"/>`;
    for (const [y, o] of [[120, 0], [125, 2], [131, 1], [138, 0], [146, 2]]) for (let x = k.x0 + o * 5; x < k.x1; x += 15) f += `<line x1="${r(px(x, y))}" y1="${y}" x2="${r(px(x + 5, y))}" y2="${y}" stroke="#94693e" stroke-width=".25" opacity=".7"/>`;
  } else {
    for (let j = 0; j < 60; j++) f += `<circle cx="${r(k.x0 + rnd() * (k.x1 - k.x0))}" cy="${r(WU + 2 + rnd() * 32)}" r=".35" fill="#b9ad98" opacity=".6"/>`;
  }
  f += `<path d="M${k.x0} ${WU} L${k.x1} ${WU} L${r(b)} ${KANTE} L${r(a)} ${KANTE} Z" fill="${S.lg("kb" + i, [[0, "#000", 0.16], [1, "#000", 0]])}"/>`;
  S.hinten(f);
});
/* der Gang: heller Boden, Randlinie, Pfeile des Rundwegs */
{
  let g = `<rect x="0" y="${KANTE}" width="320" height="${200 - KANTE}" fill="${S.lg("gang", [[0, "#cfd0cd"], [1, "#bcbdb9"]])}"/>`;
  g += `<rect x="0" y="${KANTE}" width="320" height="1.6" fill="#55585e"/>`;
  for (let i = -8; i <= 8; i++) g += `<line x1="${160 + i * 26}" y1="${KANTE + 1.6}" x2="${160 + i * 42}" y2="200" stroke="#a7a8a4" stroke-width=".3"/>`;
  for (const y of [166, 186]) g += `<line x1="0" y1="${y}" x2="320" y2="${y}" stroke="#a7a8a4" stroke-width=".3"/>`;
  g += `<path d="M0 158 L320 158" stroke="#f2c94c" stroke-width=".8" stroke-dasharray="6 4"/>`;
  for (const x of [118, 196]) g += `<path d="M${x - 9} 176 L${x + 2} 176 L${x + 2} 173.4 L${x + 9} 177.4 L${x + 2} 181.4 L${x + 2} 178.8 L${x - 9} 178.8 Z" fill="#ffffff" opacity=".85"/>`;
  g += `<rect x="0" y="${KANTE}" width="320" height="${200 - KANTE}" fill="${S.lg("gl", [[0, "#000", 0.12], [0.5, "#000", 0], [1, "#fff", 0.08]])}"/>`;
  S.hinten(g);
}

/* =====================================================================
   KOJE 1 — DIE MUSTERKÜCHE (Lupe: Kühlschrank, Herd, Backofen, Spüle,
   Dunstabzugshaube), davor Esstisch, Stühle und Hängelampe
   ===================================================================== */
{
  const front = S.lg("front", [[0, "#9db3a0"], [1, "#86a08a"]]);
  let k = "";
  const Y = WU, ap = 78;   // Arbeitsplatte (0,9 m)
  /* Kühlschrank (Edelstahl, frei stehend) links */
  k += `<rect x="-4" y="-86" width="20" height="86" rx="1" fill="${S.lg("ks", [[0, "#e9ecee"], [0.5, "#c6ccd1"], [1, "#a9b0b6"]], 0, 0, 1, 0)}"/><line x1="-4" y1="-56" x2="16" y2="-56" stroke="#8d949a" stroke-width=".5"/><rect x="12.6" y="-80" width="1.2" height="18" rx=".6" fill="#8d949a"/><rect x="12.6" y="-50" width="1.2" height="12" rx=".6" fill="#8d949a"/><rect x="-2" y="-84" width="1.2" height="82" fill="#fff" opacity=".45"/>`;
  /* Unterschränke mit Griffleisten */
  k += `<rect x="16" y="${ap - Y + 2}" width="76" height="${Y - ap - 6}" fill="${front}"/><rect x="16" y="-4" width="76" height="4" fill="#3d4440"/>`;
  for (const x of [16, 54, 73]) k += `<line x1="${x}" y1="${ap - Y + 2}" x2="${x}" y2="-4" stroke="#6f8873" stroke-width=".5"/>`;
  k += `<line x1="54" y1="${ap - Y + 14}" x2="73" y2="${ap - Y + 14}" stroke="#6f8873" stroke-width=".5"/>`;
  for (const [x, y] of [[57, ap - Y + 5], [57, ap - Y + 17], [76, ap - Y + 5]]) k += `<rect x="${x}" y="${y}" width="12" height=".9" rx=".4" fill="#d6d9d4"/>`;
  /* Backofen unter dem Kochfeld */
  k += `<rect x="20" y="${ap - Y + 4}" width="30" height="26" rx=".8" fill="#24262a"/><rect x="22.4" y="${ap - Y + 11}" width="25.2" height="16" rx="1" fill="${S.lg("ofen", [[0, "#3c3f44"], [1, "#151619"]])}"/><rect x="23" y="${ap - Y + 7}" width="24" height="1" rx=".5" fill="${CHROM}"/><rect x="26" y="${ap - Y + 5}" width="8" height="1.6" fill="#0e3b2a"/><text x="30" y="${ap - Y + 6.4}" font-size="1.4" text-anchor="middle" fill="#7ce0a8" font-family="monospace">180°</text><path d="M23 ${ap - Y + 12} L33 ${ap - Y + 12} L23 ${ap - Y + 22} Z" fill="#fff" opacity=".08"/>`;
  /* Arbeitsplatte Eiche, Kochfeld, Spüle mit Armatur */
  k += `<rect x="15" y="${ap - Y - 1}" width="78" height="3.2" fill="${EICHE}"/>`;
  k += `<rect x="21" y="${ap - Y - 1.6}" width="28" height="1.2" rx=".4" fill="#141518"/>`;
  for (const x of [26, 35, 44]) k += `<ellipse cx="${x}" cy="${ap - Y - 1}" rx="3" ry=".35" fill="#2d2f33"/>`;
  k += `<rect x="60" y="${ap - Y - 1.2}" width="22" height="1" rx=".4" fill="#9aa2a8"/><path d="M73 ${ap - Y - 1.2} L73 ${ap - Y - 9} Q73 ${ap - Y - 12} 69 ${ap - Y - 12} L67 ${ap - Y - 12} L67 ${ap - Y - 10.6}" stroke="#c3c9ce" stroke-width="1.1" fill="none" stroke-linecap="round"/><rect x="74" y="${ap - Y - 5}" width="2.4" height=".8" rx=".3" fill="#c3c9ce"/>`;
  /* Nischenrückwand und Hängeschränke */
  k += `<rect x="16" y="${ap - Y - 24}" width="76" height="23" fill="${S.lg("nische", [[0, "#efe9df"], [1, "#e2d9cb"]])}"/>`;
  k += `<rect x="54" y="-92" width="38" height="30" fill="${front}"/><line x1="73" y1="-92" x2="73" y2="-62" stroke="#6f8873" stroke-width=".5"/><rect x="54" y="-62" width="38" height="1.4" fill="#3d4440" opacity=".5"/>`;
  k += `<rect x="16" y="-92" width="8" height="30" fill="${front}"/>`;
  /* Kaminhaube über dem Kochfeld */
  k += `<rect x="31.6" y="-98" width="6.8" height="24" fill="${S.lg("kamin", [[0, "#c6ccd1"], [1, "#e9ecee"]], 0, 0, 1, 0)}"/><path d="M22 -66 L48 -66 L46 -74 L24 -74 Z" fill="${S.lg("haube", [[0, "#e9ecee"], [1, "#a9b0b6"]])}"/><rect x="22" y="-66" width="26" height="1.4" fill="#7d868d"/><ellipse cx="35" cy="-64.8" rx="9" ry=".6" fill="#fff8dc" opacity=".9"/>`;
  /* Deko: Kräutertopf, Schneidebrett, Schild „Musterküche“ */
  k += `<rect x="83" y="${ap - Y - 5.4}" width="4" height="4" rx=".6" fill="#efe9df"/><circle cx="84" cy="${ap - Y - 6.4}" r="1.6" fill="#4e9150"/><circle cx="86.4" cy="${ap - Y - 7}" r="1.8" fill="#3f7d43"/>`;
  k += `<rect x="52" y="${ap - Y - 10}" width="6" height="9" rx="1" fill="#b98f58" transform="rotate(8 55 ${ap - Y - 5})"/>`;
  k += `<line x1="6" y1="-116" x2="6" y2="-111" stroke="#1d1e21" stroke-width=".4"/><line x1="34" y1="-116" x2="34" y2="-111" stroke="#1d1e21" stroke-width=".4"/><rect x="0" y="-111" width="40" height="9" rx="1" fill="#c62f2f"/><text x="20" y="-105" font-size="3.4" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-weight="bold">MUSTERKÜCHE −30 %</text>`;
  const unter = [
    { id: "mh_kuehlschrank", de: "der Kühlschrank", syl: "KÜHL-schrank", it: "il frigorifero", itSyl: "fri-go-RI-fe-ro", en: "fridge", x: 6, y: Y - 30, kunst: flaeche(-9.6, -54, 19.2, 56) },
    { id: "mh_dunstabzug", de: "die Dunstabzugshaube", syl: "DUNST-ab-zugs-hau-be", it: "la cappa", itSyl: "CAP-pa", en: "cooker hood", x: 35, y: Y - 64, kunst: flaeche(-13, -34, 26, 34) },
    { id: "mh_herd", de: "der Herd", syl: "HERD", it: "il piano cottura", itSyl: "PIA-no cot-TU-ra", en: "hob", x: 35, y: ap + 1, kunst: flaeche(-14, -12, 28, 13),
      tipp: "Ein Induktionsherd wird nur dort heiß, wo der Topf steht." },
    { id: "mh_backofen", de: "der Backofen", syl: "BACK-o-fen", it: "il forno", itSyl: "FOR-no", en: "oven", x: 35, y: ap + 31, kunst: flaeche(-15, -28, 30, 28) },
    { id: "mh_spuele", de: "die Spüle", syl: "SPÜ-le", it: "il lavello", itSyl: "la-VEL-lo", en: "sink", x: 71, y: ap + 1, kunst: flaeche(-12, -14, 24, 15) },
  ];
  S.teil({ id: "mh_kueche", de: "die Musterküche", syl: "MUS-ter-kü-che", it: "la cucina espositiva", itSyl: "cu-CI-na", en: "display kitchen", x: 0, y: Y, steht: true, kunst: k,
    zoom: { x: 0, y: 16, w: 110, h: 100 }, unter,
    tipp: "Sie ist aufgebaut, damit man sie ansehen kann — mitnehmen kann man nur die Kartons." });
}
{
  /* DER STUHL — zwei Holzstühle hinter dem Esstisch */
  let k = "";
  for (const x of [-12, 12]) {
    k += `<rect x="${x - 6}" y="-34" width="12" height="3" rx="1.4" fill="${S.lg("lehne", [[0, "#6b4a2e"], [1, "#4e341f"]])}"/>`;
    k += `<rect x="${x - 5.6}" y="-31" width="1.4" height="31" fill="#5a3d24"/><rect x="${x + 4.2}" y="-31" width="1.4" height="31" fill="#5a3d24"/><rect x="${x - 5.6}" y="-27" width="11.2" height="1" fill="#5a3d24"/>`;
    k += `<rect x="${x - 6.4}" y="-16" width="12.8" height="2.6" rx=".8" fill="#c8a06e"/>`;
  }
  S.teil({ id: "mh_stuhl", de: "der Stuhl", syl: "STUHL", it: "la sedia", itSyl: "SE-dia", en: "chair", x: 34, y: 134, steht: true, kunst: k });
}
{
  /* DER ESSTISCH — Eiche massiv, für vier */
  let k = schatten(0, 0, 32, 2, 0.3);
  k += `<path d="M-30 -27 L30 -27 L32.4 -23.4 L-32.4 -23.4 Z" fill="${S.lg("et", [[0, "#c69c69"], [1, "#d8b483"]])}"/><rect x="-32.4" y="-23.4" width="64.8" height="2.6" fill="${EICHE}"/>`;
  for (const x of [-29, 26]) k += `<rect x="${x}" y="-21" width="3" height="21" fill="${S.lg("bein", [[0, "#b48a58"], [1, "#8c6538"]], 0, 0, 1, 0)}"/>`;
  /* Gedeck: Vase und Schale */
  k += `<path d="M-2 -27 L2 -27 L2.6 -32 Q0 -34 -2.6 -32 Z" fill="#e8e3da"/><path d="M0 -33 q-2 -4 -1 -7 M0 -33 q2 -3 3 -6 M0 -33 v-7" stroke="#6a8f5a" stroke-width=".4" fill="none"/><circle cx="-1" cy="-40" r="1" fill="#e9c46a"/><circle cx="3" cy="-39" r=".9" fill="#f4a261"/><circle cx="0" cy="-40.6" r=".9" fill="#fff"/>`;
  k += `<path d="M10 -27 Q14 -24.6 18 -27 Z" fill="#3a4a5c"/><path d="M-18 -27 Q-14 -24.6 -10 -27 Z" fill="#3a4a5c"/>`;
  S.teil({ id: "mh_esstisch", de: "der Esstisch", syl: "ESS-tisch", it: "il tavolo da pranzo", itSyl: "TA-vo-lo da PRAN-zo", en: "dining table", x: 36, y: 142, steht: true, kunst: k });
}
{
  /* DIE HÄNGELAMPE über dem Esstisch */
  let k = `<line x1="0" y1="-60" x2="0" y2="-9" stroke="#2a2a2a" stroke-width=".35"/>`;
  k += `<path d="M-7 0 Q-7 -9 0 -9 Q7 -9 7 0 Z" fill="${S.lg("lampe", [[0, "#2f3a35"], [1, "#1c2420"]])}"/><ellipse cx="0" cy="0" rx="7" ry="1.4" fill="#fff4cf"/>`;
  k += `<path d="M-7 .6 L-16 22 L16 22 L7 .6 Z" fill="${S.lg("kegel", [[0, "#fff4cf", 0.3], [1, "#fff4cf", 0]])}"/>`;
  S.teil({ id: "mh_haengelampe", de: "die Hängelampe", syl: "HÄN-ge-lam-pe", it: "la lampada a sospensione", itSyl: "LAM-pa-da a so-spen-SIO-ne", en: "pendant lamp", x: 46, y: 72, kunst: k + flaeche(-8, -12, 16, 14) });
}

/* =====================================================================
   KOJE 2 — WOHNZIMMER: Bild, Bücherregal (Lupe), Stehlampe, Teppich,
   Sofa mit Kissen, Couchtisch, Preisschild
   ===================================================================== */
{
  let k = `<rect x="-19" y="-14" width="38" height="28" fill="#2b2622"/><rect x="-17.6" y="-12.6" width="35.2" height="25.2" fill="#fbf8f2"/>`;
  k += `<rect x="-14" y="-9" width="28" height="18" fill="${S.lg("bild", [[0, "#e9c46a"], [0.5, "#f4a261"], [1, "#2a9d8f"]])}"/>`;
  k += `<path d="M-14 9 L-6 -1 L0 4 L7 -4 L14 4 L14 9 Z" fill="#264653" opacity=".85"/><circle cx="8" cy="-5" r="2.6" fill="#fff4cf" opacity=".9"/>`;
  S.teil({ id: "mh_bild", de: "das Bild", syl: "BILD", it: "il quadro", itSyl: "QUA-dro", en: "picture", x: 140, y: 52, kunst: k });
}
{
  /* DAS BÜCHERREGAL — Lupe: Buch, Vase, Bilderrahmen */
  const X0 = 186, X1 = 212, Y1 = WU, H = 84, W = X1 - X0, cx = (X0 + X1) / 2;
  let k = schatten(0, 0, W / 2 + 1, 1.2, 0.25);
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="${H}" fill="${S.lg("rk", [[0, "#f6f4ef"], [1, "#dedbd4"]], 0, 0, 1, 0)}"/>`;
  const boeden = [-H + 2, -H + 22, -H + 42, -H + 62, -2];
  for (let i = 0; i < 4; i++) k += `<rect x="${-W / 2 + 1.4}" y="${boeden[i] + 1.4}" width="${W - 2.8}" height="${boeden[i + 1] - boeden[i] - 1.4}" fill="${S.lg("rfach", [[0, "#d9d4ca"], [1, "#ece8e0"]])}"/>`;
  for (const b of boeden) k += `<rect x="${-W / 2}" y="${b}" width="${W}" height="1.6" fill="#ffffff"/>`;
  /* Bücher: zwei Fächer */
  const buecher = (y, x0, n) => { let g = ""; let x = x0; for (let i = 0; i < n; i++) { const w = 1.6 + rnd() * 1.2, h = 12 + rnd() * 5, f = ["#7a1f3d", "#2f4f6f", "#c9a227", "#3b6e4f", "#a0522d", "#5b3a6e", "#e0dcd3"][Math.floor(rnd() * 7)]; g += `<rect x="${r(x)}" y="${r(y - h)}" width="${r(w)}" height="${r(h)}" fill="${f}"/><rect x="${r(x + 0.2)}" y="${r(y - h + 2)}" width="${r(w - 0.4)}" height=".5" fill="#fff" opacity=".4"/>`; x += w + 0.15; } return g; };
  k += buecher(boeden[1], -W / 2 + 2, 10) + buecher(boeden[3], -W / 2 + 6, 8);
  k += `<g transform="rotate(-14 ${W / 2 - 4} ${boeden[3]})"><rect x="${W / 2 - 8}" y="${boeden[3] - 14}" width="2.4" height="14" fill="#2f4f6f"/></g>`;
  /* Vase mit Zweigen */
  k += `<path d="M-3 ${boeden[2]} L3 ${boeden[2]} Q4.4 ${boeden[2] - 6} 1.4 ${boeden[2] - 9} L-1.4 ${boeden[2] - 9} Q-4.4 ${boeden[2] - 6} -3 ${boeden[2]} Z" fill="${S.lg("vase", [[0, "#5b8fa8"], [1, "#2f5f75"]], 0, 0, 1, 0)}"/><path d="M0 ${boeden[2] - 9} q-2 -6 -5 -9 M0 ${boeden[2] - 9} q1 -6 4 -8" stroke="#6b4a2e" stroke-width=".4" fill="none"/>`;
  /* Bilderrahmen unten */
  k += `<rect x="-6" y="${boeden[4] - 14}" width="12" height="14" fill="#2b2622"/><rect x="-4.6" y="${boeden[4] - 12.6}" width="9.2" height="11.2" fill="#f4efe6"/><circle cx="0" cy="${boeden[4] - 8.6}" r="2" fill="#d7a179"/><path d="M-3.6 ${boeden[4] - 1.4} Q0 ${boeden[4] - 7} 3.6 ${boeden[4] - 1.4} Z" fill="#3d6e9e"/>`;
  const unter = [
    { id: "mh_buch", de: "das Buch", syl: "BUCH", it: "il libro", itSyl: "LI-bro", en: "book", x: cx, y: Y1 - H + 22, kunst: flaeche(-W / 2 + 1.4, -18.6, W - 2.8, 18.6) },
    { id: "mh_vase", de: "die Vase", syl: "VA-se", it: "il vaso", itSyl: "VA-so", en: "vase", x: cx, y: Y1 - H + 42, kunst: flaeche(-W / 2 + 1.4, -18.6, W - 2.8, 18.6) },
    { id: "mh_bilderrahmen", de: "der Bilderrahmen", syl: "BIL-der-rah-men", it: "la cornice", itSyl: "cor-NI-ce", en: "picture frame", x: cx, y: Y1 - 2, kunst: flaeche(-W / 2 + 1.4, -18.6, W - 2.8, 18.6) },
  ];
  S.teil({ id: "mh_buecherregal", de: "das Bücherregal", syl: "BÜ-cher-re-gal", it: "la libreria", itSyl: "li-bre-RI-a", en: "bookcase", x: cx, y: Y1, steht: true, kunst: k,
    zoom: { x: X0 - 30, y: Y1 - H - 4, w: 90, h: 60 + 30 }, unter });
}
{
  /* DIE STEHLAMPE — hinter der rechten Sofalehne */
  let k = schatten(0, 0, 5, .8, .25);
  k += `<ellipse cx="0" cy="-.6" rx="5" ry="1.2" fill="#2a2a2a"/><rect x="-.5" y="-58" width="1" height="57.4" fill="#2a2a2a"/>`;
  k += `<path d="M-7 -56 L7 -56 L5 -68 L-5 -68 Z" fill="${S.lg("schirm", [[0, "#fbf3df"], [1, "#e8dcc0"]], 0, 0, 1, 0)}"/><ellipse cx="0" cy="-56" rx="7" ry="1" fill="#fff6d8"/>`;
  k += `<circle cx="0" cy="-60" r="12" fill="#fff4cf" opacity=".25" filter="url(#${S.id("glow")})"/>`;
  S.teil({ id: "mh_stehlampe", de: "die Stehlampe", syl: "STEH-lam-pe", it: "la lampada da terra", itSyl: "LAM-pa-da da TER-ra", en: "floor lamp", x: 183, y: 121, steht: true, kunst: k });
}
{
  /* DER TEPPICH — unter Sofa und Couchtisch */
  let k = `<path d="M-46 -24 L46 -24 L56 0 L-56 0 Z" fill="${S.lg("tep", [[0, "#b8a58c"], [1, "#cdbb9f"]])}"/>`;
  k += `<path d="M-43 -22 L43 -22 L51.6 -2 L-51.6 -2 Z" fill="none" stroke="#8a7458" stroke-width=".6"/>`;
  for (let i = 0; i < 40; i++) k += `<circle cx="${r(-50 + rnd() * 100)}" cy="${r(-22 + rnd() * 20)}" r=".3" fill="#a08c70" opacity=".6"/>`;
  for (let x = -54; x <= 54; x += 2.4) k += `<line x1="${x}" y1="0" x2="${x}" y2="1.4" stroke="#d9c9ae" stroke-width=".35"/>`;
  S.teil({ id: "mh_teppich", de: "der Teppich", syl: "TEP-pich", it: "il tappeto", itSyl: "tap-PE-to", en: "rug", x: 144, y: 149, kunst: k });
}
{
  /* DAS SOFA — Dreisitzer in Salbeigrün */
  const STOFF = S.lg("stoff", [[0, "#8fa89a"], [0.6, "#7a9686"], [1, "#647e70"]]);
  let k = schatten(0, 0, 42, 2.2, 0.3);
  for (const x of [-36, 36]) k += `<rect x="${x - 1}" y="-5" width="2" height="5" fill="#3a2a1c"/>`;
  k += `<rect x="-40" y="-36" width="80" height="18" rx="3" fill="${S.lg("sr", [[0, "#86a090"], [1, "#6a8476"]])}"/>`;
  for (const x of [-26, 0, 26]) k += `<rect x="${x - 12.6}" y="-34" width="25.2" height="16" rx="3.4" fill="${S.lg("rk2", [[0, "#9ab4a5"], [0.6, "#82a090"], [1, "#6c8879"]])}"/>`;
  k += `<rect x="-41" y="-20" width="82" height="15" rx="2" fill="${STOFF}"/>`;
  for (const x of [-26, 0, 26]) k += `<rect x="${x - 12.8}" y="-21" width="25.6" height="6.4" rx="2.2" fill="${S.lg("sk", [[0, "#a3bcae"], [1, "#7a9686"]])}"/>`;
  for (const x of [-44, 37]) k += `<rect x="${x}" y="-28" width="7.4" height="23" rx="3" fill="${S.lg("sa", [[0, "#7a9686"], [0.4, "#9ab4a5"], [1, "#647e70"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-36 -33 Q-26 -34.6 -16 -33" stroke="#fff" stroke-width=".6" opacity=".25" fill="none"/>`;
  S.teil({ id: "mh_sofa", de: "das Sofa", syl: "SO-fa", it: "il divano", itSyl: "di-VA-no", en: "sofa", x: 140, y: 132, steht: true, kunst: k,
    tipp: "Probesitzen ist ausdrücklich erlaubt." });
}
{
  /* DAS KISSEN — zwei Zierkissen auf dem Sofa */
  let k = "";
  for (const [x, f, a] of [[-31, "#e9c46a", -8], [30, "#c96d5a", 8]]) {
    k += `<g transform="translate(${x} 0) rotate(${a})"><path d="M-6 0 Q-6.6 -5 -5.6 -10 Q0 -11 5.6 -10 Q6.6 -5 6 0 Q0 1 -6 0 Z" fill="${f}"/><path d="M-4 -8 Q0 -5 4 -8" stroke="#000" stroke-width=".3" opacity=".2" fill="none"/></g>`;
  }
  S.teil({ oben: true, id: "mh_kissen", de: "das Kissen", syl: "KIS-sen", it: "il cuscino", itSyl: "cu-SCI-no", en: "cushion", x: 140, y: 114.6, kunst: k });
}
{
  /* DER COUCHTISCH — runder Holztisch mit Zeitschriften */
  let k = schatten(0, 0, 18, 1.6, 0.3);
  for (const x of [-12, -4, 4, 12]) k += `<rect x="${x - 0.8}" y="-12" width="1.6" height="12" fill="#6b4a2e"/>`;
  k += `<ellipse cx="0" cy="-13" rx="18" ry="3.6" fill="${S.lg("ct", [[0, "#9a6c3f"], [1, "#7e5530"]])}"/><ellipse cx="0" cy="-13.6" rx="17.4" ry="3" fill="${S.lg("ct2", [[0, "#b98a58"], [1, "#a47647"]])}"/>`;
  k += `<rect x="-8" y="-15.6" width="9" height="1.4" rx=".3" fill="#f4f1ea" transform="rotate(-4 -3 -15)"/><rect x="3" y="-15.2" width="5" height="1.8" rx=".6" fill="#e8e3da"/><circle cx="5.5" cy="-16.2" r="1.4" fill="#2a9d8f"/>`;
  S.teil({ id: "mh_couchtisch", de: "der Couchtisch", syl: "COUCH-tisch", it: "il tavolino", itSyl: "ta-vo-LI-no", en: "coffee table", x: 144, y: 146, steht: true, kunst: k });
}

/* =====================================================================
   KOJE 3 — SCHLAFZIMMER: Nachttisch, Bett (140 × 200)
   ===================================================================== */
{
  let k = schatten(0, 0, 7, 1, .25);
  k += `<rect x="-6" y="-14" width="12" height="13" rx=".6" fill="${S.lg("nt", [[0, "#f6f4ef"], [1, "#dcd8d0"]], 0, 0, 1, 0)}"/><line x1="-6" y1="-8" x2="6" y2="-8" stroke="#c9c4b9" stroke-width=".4"/><rect x="-1.6" y="-11.6" width="3.2" height=".7" rx=".3" fill="#b5ad9e"/><rect x="-5" y="-1" width="1" height="1" fill="#6b4a2e"/><rect x="4" y="-1" width="1" height="1" fill="#6b4a2e"/>`;
  k += `<rect x="-.4" y="-21" width=".8" height="7" fill="#c9a227"/><path d="M-4 -20 L4 -20 L2.6 -25 L-2.6 -25 Z" fill="#fbf3df"/><ellipse cx="0" cy="-14.4" rx="2.6" ry=".6" fill="#c9a227"/>`;
  S.teil({ id: "mh_nachttisch", de: "der Nachttisch", syl: "NACHT-tisch", it: "il comodino", itSyl: "co-mo-DI-no", en: "bedside table", x: 296, y: 120, steht: true, kunst: k });
}
{
  /* DAS BETT — Polsterbett mit Kopfteil, Decke und zwei Kissen */
  const yb = 116, yf = 142, X0 = 226, X1 = 284, M = (X0 + X1) / 2;
  const xl = (x, y) => r(px(x, y));
  let k = "";
  /* Kopfteil an der Wand */
  k += `<rect x="${X0}" y="82" width="${X1 - X0}" height="32" rx="3" fill="${S.lg("kopfteil", [[0, "#5a6f83"], [1, "#465a6d"]])}"/>`;
  for (let x = X0 + 8; x < X1 - 4; x += 9.6) k += `<line x1="${r(x)}" y1="84" x2="${r(x)}" y2="112" stroke="#3a4b5c" stroke-width=".5"/>`;
  k += schatten(xl(M, yf), yf, 36, 1.6, 0.28);
  /* Rahmen und Matratze in Fluchtperspektive */
  k += `<path d="M${X0} ${yb - 6} L${X1} ${yb - 6} L${xl(X1 + 2, yf)} ${yf - 12} L${xl(X0 - 2, yf)} ${yf - 12} Z" fill="#f4f1ea"/>`;
  k += `<path d="M${xl(X0 - 2, yf)} ${yf - 12} L${xl(X1 + 2, yf)} ${yf - 12} L${xl(X1 + 2, yf)} ${yf - 3} L${xl(X0 - 2, yf)} ${yf - 3} Z" fill="${S.lg("bettfront", [[0, "#5a6f83"], [1, "#3e5163"]])}"/>`;
  for (const x of [X0 + 4, M + 1]) k += `<rect x="${x}" y="${yb - 14}" width="24" height="9" rx="3.6" fill="${S.lg("kis", [[0, "#ffffff"], [1, "#e6e2da"]])}"/>`;
  k += `<path d="M${X0 + 2} ${yb - 4} L${X1 - 2} ${yb - 4} L${xl(X1 + 4, yf)} ${yf - 13} L${xl(X0 - 4, yf)} ${yf - 13} Z" fill="${S.lg("decke", [[0, "#e7ddc8"], [1, "#d6c8ae"]])}"/>`;
  k += `<path d="M${xl(X0 - 4, yf)} ${yf - 13} L${xl(X1 + 4, yf)} ${yf - 13} L${xl(X1 + 4, yf)} ${yf - 7} Q${xl(M, yf)} ${yf - 5} ${xl(X0 - 4, yf)} ${yf - 7} Z" fill="#cbbb9e"/>`;
  k += `<path d="M${X0 + 4} ${yb - 2} L${X1 - 4} ${yb - 2}" stroke="#fff" stroke-width=".8" opacity=".5"/>`;
  k += `<path d="M${xl(X0 - 2, 134)} 134 L${xl(X1 + 2, 134)} 134 L${xl(X1 + 4, yf)} ${yf - 12.6} L${xl(X0 - 4, yf)} ${yf - 12.6} Z" fill="#7a8fa3"/>`;
  for (const x of [X0 + 2, X1 - 4]) k += `<rect x="${xl(x, yf)}" y="${yf - 3}" width="1.6" height="3" fill="#3a2a1c"/>`;
  S.teil({ id: "mh_bett", de: "das Bett", syl: "BETT", it: "il letto", itSyl: "LET-to", en: "bed", x: 0, y: 0, kunst: k,
    tipp: "Das Maß steht auf dem Schild: 140 mal 200 — das ist das übliche deutsche Maß." });
}

/* =====================================================================
   DIE WAND — die Seitenwände der Kojen (Stirnseiten zum Gang). Sie stehen
   vor den Möbeln der Nachbarkoje und werden darum nach ihnen gezeichnet.
   ===================================================================== */
{
  let k = "";
  for (const xb of [96, 214]) {
    const xf = px(xb, KANTE), ytf = WTOP - (KANTE - WU) * 0.32, s = xb < 160 ? -1 : 1;
    k += `<path d="M${xb} ${WTOP} L${r(xf)} ${r(ytf)} L${r(xf)} ${KANTE} L${xb} ${WU} Z" fill="${S.lg("sw" + xb, [[0, "#f3f1ec"], [1, "#d9d6cf"]], 0, 0, 1, 0)}"/>`;
    k += `<path d="M${xb} ${WU} L${r(xf)} ${KANTE}" stroke="#bdb8ae" stroke-width=".5"/>`;
    k += `<path d="M${xb + 4 * -s} ${WTOP} L${xb} ${WTOP} L${r(xf)} ${r(ytf)} L${r(xf + 5 * -s)} ${r(ytf)} Z" fill="#ffffff"/>`;
    k += `<rect x="${r(Math.min(xf, xf + 5 * -s))}" y="${r(ytf)}" width="5" height="${r(KANTE - ytf)}" fill="${S.lg("st" + xb, [[0, "#ffffff"], [1, "#ecebe7"]], 0, 0, 1, 0)}"/>`;
  }
  S.teil({ id: "mh_wand", de: "die Wand", syl: "WAND", it: "la parete", itSyl: "pa-RE-te", en: "wall", x: 0, y: 0, kunst: k,
    tipp: "Jede Koje ist wie ein kleines Zimmer mit drei Wänden." });
}

/* =====================================================================
   DIE LIEFERUNG — Hängeschild über dem Gang
   ===================================================================== */
{
  let k = `<line x1="-14" y1="-14" x2="-14" y2="-6" stroke="#1d1e21" stroke-width=".4"/><line x1="14" y1="-14" x2="14" y2="-6" stroke="#1d1e21" stroke-width=".4"/>`;
  k += `<rect x="-29" y="-6" width="58" height="13" rx="1.2" fill="#f2c94c"/><rect x="-29" y="-6" width="58" height="13" rx="1.2" fill="none" stroke="#c9a227" stroke-width=".4"/>`;
  k += `<g transform="translate(-23 1)"><rect x="-4" y="-3.6" width="6" height="4.4" fill="#1d2a3a"/><path d="M2 -2.4 L4.6 -2.4 L5.6 -.6 L5.6 .8 L2 .8 Z" fill="#1d2a3a"/><circle cx="-2.4" cy="1.2" r="1" fill="#1d2a3a"/><circle cx="3.6" cy="1.2" r="1" fill="#1d2a3a"/></g>`;
  k += `<text x="5" y="-.6" font-size="3.4" text-anchor="middle" fill="#1d2a3a" font-family="Arial,sans-serif" font-weight="bold">Lieferung &amp; Montage</text><text x="5" y="3.6" font-size="2.6" text-anchor="middle" fill="#1d2a3a" font-family="Arial,sans-serif">Info-Theke · Kasse →</text>`;
  S.teil({ id: "mh_lieferung", de: "die Lieferung", syl: "LIE-fe-rung", it: "la consegna", itSyl: "con-SE-gna", en: "delivery", x: 280, y: 20, kunst: k,
    tipp: "Selbst abholen ist billiger — aber dafür braucht man ein Auto." });
}

/* =====================================================================
   DAS PREISSCHILD — großes Schild am Sofa (Kundenstopper)
   ===================================================================== */
{
  let k = schatten(0, 0, 6, .8, .3);
  k += `<rect x="-.6" y="-20" width="1.2" height="20" fill="${CHROM}"/><ellipse cx="0" cy="-.4" rx="5" ry="1" fill="#9aa2a8"/>`;
  k += `<rect x="-10" y="-40" width="20" height="22" rx=".8" fill="#ffffff" stroke="#c9c4b9" stroke-width=".3"/><rect x="-10" y="-40" width="20" height="4.4" rx=".8" fill="#c62f2f"/>`;
  k += `<text x="0" y="-36.8" font-size="2.6" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">SOFA „LENA“</text>`;
  k += `<text x="0" y="-32.6" font-size="1.7" text-anchor="middle" fill="#555" font-family="Arial">3-Sitzer · B 212 × T 92 cm</text>`;
  k += `<text x="0" y="-26.4" font-size="5.2" text-anchor="middle" fill="#c62f2f" font-family="Arial" font-weight="bold">899,–</text>`;
  k += `<rect x="-8.4" y="-24.4" width="16.8" height="5" rx=".4" fill="#f2c94c"/><text x="0" y="-22.4" font-size="1.6" text-anchor="middle" fill="#1d2a3a" font-family="Arial" font-weight="bold">LAGERORT</text><text x="0" y="-20.2" font-size="1.7" text-anchor="middle" fill="#1d2a3a" font-family="Arial">Regal 14 · Fach 3</text>`;
  S.teil({ id: "mh_preisschild", de: "das Preisschild", syl: "PREIS-schild", it: "il cartellino", itSyl: "car-tel-LI-no", en: "price tag", x: 199, y: 156, steht: true, kunst: k,
    tipp: "Der Preis steht immer mit Mehrwertsteuer — anders als in manchen Ländern." });
}

/* =====================================================================
   DER KUNDE mit dem MASSBAND am Sofa; DIE VERKÄUFERIN im Gang
   ===================================================================== */
let handK = null;
{
  const m = B.mensch({ id: "b04d_kunde", geschlecht: "m", pose: "halten", blick: 52, frisur: "kurz", haarfarbe: "blond", haut: "hell",
    kleidung: { oberteil: { stueck: "pullover", farbe: "#7a3b3b" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" } } }, 102);
  const h = [m.z.handL, m.z.handR].sort((a, b) => b.x - a.x)[0];
  handK = { x: 100 + h.x * m.k, y: 166 + h.y * m.k };
  S.teil({ id: "mh_kunde", de: "der Kunde", syl: "KUN-de", it: "il cliente", itSyl: "cli-EN-te", en: "customer", x: 100, y: 166, kunst: m.svg,
    tipp: "Er misst nach, ob das Sofa durch die Wohnungstür passt." });
}
{
  /* Papier-Maßband: von der Hand bis an die Sofalehne */
  const x0 = handK.x, y0 = handK.y, x1 = 98, y1 = 106;
  let k = `<path d="M0 0 L${r(x1 - x0)} ${r(y1 - y0)}" stroke="#f2d54c" stroke-width="1.3"/>`;
  const n = 7;
  for (let i = 1; i < n; i++) { const t = i / n; k += `<line x1="${r((x1 - x0) * t - 0.4)}" y1="${r((y1 - y0) * t)}" x2="${r((x1 - x0) * t + 0.4)}" y2="${r((y1 - y0) * t)}" stroke="#333" stroke-width=".25"/>`; }
  k += `<rect x="-1.4" y="-1.4" width="2.8" height="2.8" rx=".5" fill="#f2c94c" stroke="#a88a1c" stroke-width=".2"/>`;
  S.teil({ oben: true, id: "mh_massband", de: "das Maßband", syl: "MASS-band", it: "il metro a nastro", itSyl: "ME-tro a NA-stro", en: "tape measure", x: x0, y: y0, kunst: k + flaeche(Math.min(0, x1 - x0) - 2, Math.min(0, y1 - y0) - 2, Math.abs(x1 - x0) + 4, Math.abs(y1 - y0) + 4),
    tipp: "Vor dem Kauf: die Tür messen, das Treppenhaus messen, den Platz messen." });
}
{
  const m = B.mensch({ id: "b04d_verk", geschlecht: "w", pose: "zeigen", blick: -58, frisur: "dutt", haarfarbe: "dunkelbraun", haut: "mittel", laecheln: true,
    kleidung: { oberteil: { stueck: "bluse", farbe: "weiss" }, unterteil: { stueck: "hose", farbe: "#2a3242" }, jacke: { stueck: "weste", farbe: "#2a3242" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" } } }, 100);
  let k = m.svg;
  const p = m.z.punkte.brustmuskelR || m.z.punkte.brust;
  k += `<rect x="${r(p[0] * m.k - 2)}" y="${r(p[1] * m.k - 1)}" width="4" height="1.6" rx=".3" fill="#f2c94c"/>`;
  S.teil({ id: "mh_verkaeuferin", de: "die Verkäuferin", syl: "Ver-KÄU-fe-rin", it: "la commessa", itSyl: "com-MES-sa", en: "sales assistant", x: 230, y: 182, kunst: k,
    tipp: "Sie erklärt, was im Preis drin ist und was Aufbau und Lieferung extra kosten." });
}

/* =====================================================================
   DER EINKAUFSWAGEN (Plattformwagen) mit dem REGAL IM KARTON und dem
   BESTELLZETTEL — vorne im Gang
   ===================================================================== */
{
  const X = 44, Y = 194;
  let k = schatten(0, 0, 34, 2, 0.32);
  for (const x of [-28, -8, 12, 30]) k += `<rect x="${x - 0.8}" y="-6" width="1.6" height="2" fill="#555"/><circle cx="${x}" cy="-2.4" r="2.4" fill="#1b1b1e"/><circle cx="${x}" cy="-2.4" r=".8" fill="#888"/>`;
  k += `<path d="M-34 -10 L34 -10 L32 -6 L-32 -6 Z" fill="${S.lg("platt", [[0, "#5a5f66"], [1, "#3a3e44"]])}"/><rect x="-34" y="-11" width="68" height="1.6" fill="#7d848b"/>`;
  k += `<rect x="-35" y="-44" width="1.8" height="34" fill="${CHROM}"/><rect x="-31" y="-44" width="1.8" height="34" fill="${CHROM}"/><rect x="-36" y="-45" width="8.6" height="2.2" rx="1" fill="#f2c94c"/>`;
  S.teil({ id: "mh_einkaufswagen", de: "der Einkaufswagen", syl: "EIN-kaufs-wa-gen", it: "il carrello", itSyl: "car-REL-lo", en: "trolley", x: X, y: Y, steht: true, kunst: k,
    tipp: "Im Möbelhaus ist er flach — damit die Kartons daraufliegen." });
  let b = schatten(0, 0, 28, 1, 0.25);
  b += `<rect x="-28" y="-10" width="58" height="10" fill="${KARTON}"/><path d="M-28 -10 L30 -10 L28 -12.4 L-26 -12.4 Z" fill="#e3c08c"/>`;
  b += `<rect x="-26" y="-8.6" width="14" height="6.6" fill="#fff"/><text x="-19" y="-5.8" font-size="1.8" text-anchor="middle" fill="#222" font-family="Arial" font-weight="bold">REGAL</text><text x="-19" y="-3.4" font-size="1.4" text-anchor="middle" fill="#555" font-family="Arial">1 / 2 · 24 kg</text>`;
  b += `<path d="M-6 -10 L-6 0 M14 -10 L14 0" stroke="#c19a63" stroke-width=".6"/><rect x="4" y="-8" width="16" height="2" fill="#b4875a" opacity=".5"/>`;
  b += `<g transform="translate(22 -5)"><rect x="-3" y="-3" width="6" height="5" fill="none" stroke="#222" stroke-width=".3"/><path d="M-2 0 L0 -2 L2 0" stroke="#222" stroke-width=".3" fill="none"/></g>`;
  S.teil({ oben: true, id: "mh_regal", de: "das Regal im Karton", syl: "Re-GAL im Kar-TON", it: "lo scaffale in scatola", itSyl: "scaf-FA-le", en: "flat-pack shelf", x: X + 1, y: Y - 11, steht: true, kunst: b,
    tipp: "Flachverpackt und selbst zusammenbauen — dafür ist es billiger." });
  let z = `<g transform="rotate(-6)"><rect x="-6" y="-1.4" width="12" height="1.4" fill="#ffffff" stroke="#c9c4b9" stroke-width=".15"/><rect x="-5" y="-1.2" width="6" height=".3" fill="#888"/></g><path d="M-1 -1.6 L8 -3" stroke="#d8b45a" stroke-width=".7" stroke-linecap="round"/>`;
  S.teil({ oben: true, id: "mh_bestellzettel", de: "der Bestellzettel", syl: "Be-STELL-zet-tel", it: "il modulo d'ordine", itSyl: "MO-du-lo", en: "order slip", x: X + 18, y: Y - 23, steht: true, kunst: z + flaeche(-7, -4, 15, 5),
    tipp: "Nummer, Regal und Fach — damit findet man das Ding im Lager." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/moebelhaus.js"));
console.log(aus);
