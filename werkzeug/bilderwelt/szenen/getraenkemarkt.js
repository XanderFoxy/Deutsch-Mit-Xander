#!/usr/bin/env node
/* =====================================================================
   DER GETRÄNKEMARKT (FASSUNG 852) — Bilderwelt neu
   ---------------------------------------------------------------------
   RECHERCHE (Fachpresse Lebensmittelpraxis: Kaufland-Getränkemarkt,
   „Getränkewelt“ Chemnitz, Tomra-Leergutautomaten; Ladenbau Getränke-
   fachmarkt) — so sieht ein deutscher Getränkemarkt aus:
   - Eine HALLE mit Hallendecke und langen Lichtbändern, grauer
     Industrie-Fliesenboden, viel Platz zum Fahren.
   - Kästen stehen als BLOCKSTAPEL direkt auf der EUROPALETTE
     (1,20 m × 0,80 m, 14,4 cm hoch, acht Kästen je Lage), vier bis fünf
     Lagen hoch; oben ein Preisschild bzw. „Angebot“-Aufsteller.
   - An der Wand SCHWERLASTREGALE (blaue Ständer, orange Traversen) mit
     Wein, Sekt, Einweg-Sixpacks aus Plastik und Partyfässern.
   - Ein KÜHLREGAL mit Glastüren für kalte Getränke (Limo, Dosen,
     Eistee, Bier).
   - Die LEERGUTANNAHME: Rücknahmeautomat mit runder Flaschenöffnung,
     Bildschirm und Bon-Taste, daneben die KASTENANNAHME mit
     Rollenband am Boden. Der Automat druckt den PFANDBON, den man an
     der Kasse einlöst (Mehrweg 8–15 ct je Flasche, Kasten 1,50 €,
     Einweg 25 ct).
   - Kistenwagen (flache Einkaufswagen für zwei Kästen), Sackkarre für
     das Personal, die KASSE vorne am Ausgang.
   Maßstab: Rückwand ≈ 40 Einheiten je Meter, Palettenreihe (y 158)
   ≈ 49 je Meter, ganz vorne (y 195) ≈ 57 je Meter. Fluchtpunkt der
   Bodenlinien hoch über dem Bild (wir schauen leicht von oben).
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "getraenkemarkt", titel: "Der Getränkemarkt", emoji: "🧃", thema: "Einkaufen", kuerzel: "b05a", fassung: 852 });
const rnd = zufall(4711);
const r = B.r;
/* jeder Verlauf nur einmal in <defs> (auch wenn er in Schleifen gebraucht wird) */
{ const lg = S.lg, rg = S.rg, c = {}; S.lg = (n, ...a) => c[n] || (c[n] = lg(n, ...a)); S.rg = (n, ...a) => c["r" + n] || (c["r" + n] = rg(n, ...a)); }

/* ---------- Farben und Stoffe --------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const WAND = S.lg("wand", [[0, "#eef0ee"], [1, "#dfe2df"]]);
const STAHL = S.lg("stahl", [[0, "#eef1f3"], [0.45, "#c9cfd4"], [0.55, "#b5bcc2"], [1, "#e1e5e8"]], 0, 0, 1, 0);
const BLAU_ST = S.lg("blaust", [[0, "#2f5d9a"], [0.5, "#3f72b5"], [1, "#264c80"]], 0, 0, 1, 0);
const ORANGE = S.lg("orange", [[0, "#f39a2b"], [1, "#d4741a"]]);
const HOLZ = S.lg("holz", [[0, "#d9b98a"], [1, "#b8925e"]]);
const GLAS = S.lg("glas", [[0, "#ffffff", 0.3], [0.45, "#e8f4f7", 0.06], [1, "#ffffff", 0.16]], 0, 0, 1, 1);
const GRUEN_GL = S.lg("gruengl", [[0, "#2f6b3a"], [0.4, "#4f9a5b"], [1, "#22502b"]], 0, 0, 1, 0);
const BRAUN_GL = S.lg("braungl", [[0, "#4a2508"], [0.4, "#7a3f12"], [1, "#3a1c06"]], 0, 0, 1, 0);
const KLAR_GL = S.lg("klargl", [[0, "#b9d3dc"], [0.4, "#eaf5f8"], [1, "#9fbcc6"]], 0, 0, 1, 0);

const WAND_UNTEN = 120;
const VPY = -60;                                   // Fluchtpunkt der Bodenlinien (160, -60)
const mass = (y) => 40 * (y - VPY) / (WAND_UNTEN - VPY);   // Einheiten je Meter in Tiefe y

/* =====================================================================
   KULISSE — Hallendecke, Rückwand, Boden
   ===================================================================== */
{
  let k = `<rect x="0" y="0" width="320" height="16" fill="${S.lg("decke", [[0, "#b9bec2"], [1, "#d4d8da"]])}"/>`;
  /* Trapezblech der Hallendecke */
  for (let x = 0; x < 320; x += 6) k += `<rect x="${x}" y="0" width="3" height="16" fill="#aeb3b7" opacity=".5"/>`;
  /* Stahlträger */
  k += `<rect x="0" y="12" width="320" height="3" fill="${S.lg("traeger", [[0, "#6e7479"], [1, "#4b5054"]])}"/>`;
  k += `<rect x="0" y="16" width="320" height="${WAND_UNTEN - 16}" fill="${WAND}"/>`;
  k += `<rect x="0" y="16" width="320" height="${WAND_UNTEN - 16}" fill="${S.rg("wandlicht", [[0, "#ffffff", 0.5], [1, "#ffffff", 0]], 0.5, 0.1, 0.7)}"/>`;
  /* Markenband der Kette (erfundener Name) */
  k += `<rect x="0" y="17" width="320" height="10" fill="${S.lg("band", [[0, "#1f6e3f"], [1, "#17572f"]])}"/>`;
  k += `<rect x="0" y="27" width="320" height="1.4" fill="#f2c230"/>`;
  k += `<text x="60" y="24.6" font-size="6" font-weight="bold" fill="#fff" font-family="Arial,sans-serif" letter-spacing=".6">Getränke Huber</text>`;
  k += `<text x="200" y="24.2" font-size="4" fill="#d9f0df" font-family="Arial,sans-serif" letter-spacing=".5">Wasser · Saft · Bier · Wein</text>`;
  /* Wandsockel (Rammschutz) */
  k += `<rect x="0" y="${WAND_UNTEN - 6}" width="320" height="6" fill="#8b9196"/><rect x="0" y="${WAND_UNTEN - 6}" width="320" height="1" fill="#b9bfc3"/>`;
  /* Boden: graue Industriefliesen, Fluchtlinien zum Fluchtpunkt */
  k += `<rect x="0" y="${WAND_UNTEN}" width="320" height="${200 - WAND_UNTEN}" fill="${S.lg("boden", [[0, "#a3a6a6"], [1, "#8c9090"]])}"/>`;
  for (let i = -14; i <= 14; i++) {
    const x0 = 160 + i * 14, x1 = 160 + i * 14 * (200 - VPY) / (WAND_UNTEN - VPY);
    k += `<line x1="${r(x0)}" y1="${WAND_UNTEN}" x2="${r(x1)}" y2="200" stroke="#6f7474" stroke-width=".3" opacity=".6"/>`;
  }
  /* Querfugen: Abstand wächst nach vorn (0,35 m Fliese) */
  for (let d = 0.35; d < 4; d += 0.35) {
    const y = VPY + (WAND_UNTEN - VPY) * (1 + d * 0.33);
    if (y > 200) break;
    k += `<line x1="0" y1="${r(y)}" x2="320" y2="${r(y)}" stroke="#6f7474" stroke-width=".3" opacity=".55"/>`;
  }
  k += `<rect x="0" y="${WAND_UNTEN}" width="320" height="${200 - WAND_UNTEN}" fill="${S.lg("bodenlicht", [[0, "#000", 0.16], [0.4, "#000", 0], [1, "#fff", 0.06]])}"/>`;
  k += `<rect x="0" y="${WAND_UNTEN}" width="320" height="1" fill="#5d6262"/>`;
  /* Notausgang-Schild rechts oben */
  k += `<rect x="296" y="34" width="18" height="8" rx=".6" fill="#1d8f4a"/><path d="M299 40 l2 -4 l2 1 l1 3 M301 36 l-1 -1" stroke="#fff" stroke-width=".7" fill="none"/><path d="M306 38 h6 m-2 -2 l2 2 l-2 2" stroke="#fff" stroke-width=".7" fill="none"/>`;
  S.hinten(k);
}

/* ---------- Hilfen: Flaschen und Kästen ---------------------------- */
/* Flasche (Front) mit Fuß bei (x, y); h = Höhe, b = Breite */
function flasche(x, y, h, b, glas, deckel, etikett, form = "normal") {
  const hals = form === "wein" ? 0.36 : form === "sekt" ? 0.38 : 0.3, schulter = form === "wein" ? 0.06 : 0.12;
  const hb = b * 0.32, yS = y - h * (1 - hals), yH = y - h * (1 - schulter) + h * 0;
  let g = `<path d="M${r(x - b / 2)} ${r(y)} L${r(x - b / 2)} ${r(yS)} Q${r(x - b / 2)} ${r(yS - h * 0.12)} ${r(x - hb / 2)} ${r(yS - h * 0.2)} L${r(x - hb / 2)} ${r(y - h + h * 0.04)} L${r(x + hb / 2)} ${r(y - h + h * 0.04)} L${r(x + hb / 2)} ${r(yS - h * 0.2)} Q${r(x + b / 2)} ${r(yS - h * 0.12)} ${r(x + b / 2)} ${r(yS)} L${r(x + b / 2)} ${r(y)} Z" fill="${glas}"/>`;
  g += `<rect x="${r(x - hb / 2 - 0.1)}" y="${r(y - h)}" width="${r(hb + 0.2)}" height="${r(h * 0.06)}" rx=".2" fill="${deckel}"/>`;
  if (form === "sekt") g += `<rect x="${r(x - hb / 2 - 0.1)}" y="${r(y - h)}" width="${r(hb + 0.2)}" height="${r(h * 0.2)}" fill="#d8b44a"/>`;
  if (etikett) g += `<rect x="${r(x - b / 2)}" y="${r(y - h * 0.5)}" width="${r(b)}" height="${r(h * 0.26)}" fill="${etikett}"/>`;
  g += `<rect x="${r(x - b / 2 + b * 0.18)}" y="${r(yS - h * 0.05)}" width="${r(b * 0.14)}" height="${r(h * 0.5)}" fill="#fff" opacity=".35"/>`;
  void yH;
  return g;
}
/* Getränkekasten, Vorderseite: links unten (x, y) = Fuß; w×h */
function kasten(x, y, w, h, farbe, dunkel, logo, flaschen) {
  let g = "";
  if (flaschen) {
    /* Flaschenhälse mit Verschlüssen schauen oben heraus */
    const n = 4;
    for (let i = 0; i < n; i++) {
      const fx = x + w * (i + 0.5) / n;
      g += `<rect x="${r(fx - w * 0.045)}" y="${r(y - h - h * 0.32)}" width="${r(w * 0.09)}" height="${r(h * 0.36)}" fill="${flaschen[0]}"/>`;
      g += `<rect x="${r(fx - w * 0.06)}" y="${r(y - h - h * 0.36)}" width="${r(w * 0.12)}" height="${r(h * 0.1)}" rx=".2" fill="${flaschen[1]}"/>`;
    }
  }
  g += `<rect x="${r(x)}" y="${r(y - h)}" width="${r(w)}" height="${r(h)}" rx=".8" fill="${farbe}"/>`;
  /* Rippen und Griffloch */
  g += `<rect x="${r(x + w * 0.3)}" y="${r(y - h + h * 0.12)}" width="${r(w * 0.4)}" height="${r(h * 0.16)}" rx="${r(h * 0.08)}" fill="${dunkel}"/>`;
  g += `<rect x="${r(x + 0.6)}" y="${r(y - h * 0.62)}" width="${r(w - 1.2)}" height="${r(h * 0.52)}" rx=".5" fill="${dunkel}" opacity=".35"/>`;
  if (logo) g += `<text x="${r(x + w / 2)}" y="${r(y - h * 0.26)}" font-size="${r(h * 0.22)}" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-weight="bold">${logo}</text>`;
  g += `<rect x="${r(x)}" y="${r(y - h)}" width="${r(w)}" height="${r(h * 0.08)}" fill="#fff" opacity=".28"/>`;
  g += `<rect x="${r(x)}" y="${r(y - 0.7)}" width="${r(w)}" height=".7" fill="#000" opacity=".25"/>`;
  return g;
}
/* Blockstapel: spalten×lagen Kästen, Fuß Mitte (0,0). Oben die Deckfläche mit Verschlüssen. */
function stapel(cx, spalten, lagen, kw, kh, farbe, dunkel, logo, flaschen) {
  const W = spalten * kw;
  let g = "";
  /* Deckfläche (leicht von oben gesehen) mit Verschlusskappen */
  const top = -lagen * kh, tief = kh * 0.75;
  const sh = (x) => x + (160 - (cx + x)) * (tief / (top + 158 - VPY)) * 1.2;
  g += `<path d="M${r(-W / 2)} ${r(top)} L${r(W / 2)} ${r(top)} L${r(sh(W / 2))} ${r(top - tief)} L${r(sh(-W / 2))} ${r(top - tief)} Z" fill="${dunkel}"/>`;
  for (let j = 0; j < 4; j++) for (let i = 0; i < spalten * 4; i++) {
    const t = (j + 0.5) / 4, xa = -W / 2 + kw * (i + 0.5) / 4;
    const x = xa + (sh(xa) - xa) * t, y = top - tief * t;
    g += `<ellipse cx="${r(x)}" cy="${r(y - 0.6)}" rx="${r(kw * 0.08 * (1 - t * 0.2))}" ry="${r(kw * 0.045)}" fill="${flaschen[1]}"/>`;
  }
  for (let l = 0; l < lagen; l++) for (let s = 0; s < spalten; s++) {
    g += kasten(-W / 2 + s * kw + 0.15, -l * kh, kw - 0.3, kh - 0.25, farbe, dunkel, logo, l === lagen - 1 ? flaschen : null);
  }
  return g;
}

/* =====================================================================
   1 — DIE LAMPE (Lichtbänder unter der Hallendecke)
   ===================================================================== */
{
  let k = "";
  for (const x of [-110, 0, 110]) {
    k += `<line x1="${x - 18}" y1="-8" x2="${x - 18}" y2="-3" stroke="#555" stroke-width=".4"/><line x1="${x + 18}" y1="-8" x2="${x + 18}" y2="-3" stroke="#555" stroke-width=".4"/>`;
    k += `<rect x="${x - 24}" y="-3" width="48" height="3.2" rx="1" fill="${S.lg("leuchte", [[0, "#d8dcdf"], [1, "#9aa1a6"]])}"/>`;
    k += `<rect x="${x - 23}" y="-.2" width="46" height="1.6" rx=".8" fill="#fffef4"/>`;
    k += `<path d="M${x - 23} 1.4 L${x - 40} 22 L${x + 40} 22 L${x + 23} 1.4 Z" fill="${S.lg("kegel", [[0, "#fffbe6", 0.16], [1, "#fffbe6", 0]])}"/>`;
  }
  k += flaeche(-136, -4, 52, 7) + flaeche(-26, -4, 52, 7) + flaeche(84, -4, 52, 7);
  S.teil({ id: "lampe", de: "die Lampe", syl: "LAM-pe", it: "la lampada", itSyl: "LAM-pa-da", en: "lamp", x: 160, y: 8, kunst: k });
}

/* =====================================================================
   2 — DAS SCHILD „Leergut-Annahme“ über dem Automaten
   ===================================================================== */
{
  let k = `<line x1="-20" y1="-14" x2="-20" y2="-7" stroke="#666" stroke-width=".4"/><line x1="20" y1="-14" x2="20" y2="-7" stroke="#666" stroke-width=".4"/>`;
  k += `<rect x="-30" y="-7" width="60" height="13" rx="1.4" fill="${S.lg("schild", [[0, "#2a7f4a"], [1, "#1c6038"]])}"/>`;
  k += `<rect x="-28.6" y="-5.6" width="57.2" height="10.2" rx="1" fill="none" stroke="#f2c230" stroke-width=".4"/>`;
  /* Kreislaufpfeil (Mehrweg) */
  k += `<g transform="translate(-21 -.6)"><path d="M-3 1 A3.2 3.2 0 1 1 1.6 3" stroke="#fff" stroke-width="1" fill="none"/><path d="M.4 1.6 L2.6 3.6 L.2 4.6 Z" fill="#fff"/></g>`;
  k += `<text x="4" y="1" font-size="5.2" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-weight="bold">Leergut-Annahme</text>`;
  k += `<text x="4" y="4.4" font-size="2.3" text-anchor="middle" fill="#f6e7a1" font-family="Arial,sans-serif">Flaschen ← · Kästen →</text>`;
  S.teil({ id: "schild", de: "das Schild", syl: "SCHILD", it: "il cartello", itSyl: "car-TEL-lo", en: "sign", x: 258, y: 40, kunst: k });
}

/* =====================================================================
   3 — DAS KÜHLREGAL (links, drei Glastüren) — Lupe
   ===================================================================== */
const KR = { x0: 4, x1: 100, y0: 38, y1: WAND_UNTEN };
{
  const W = KR.x1 - KR.x0, H = KR.y1 - KR.y0, cx = (KR.x0 + KR.x1) / 2;
  let k = "";
  /* Leuchtkasten oben */
  k += `<rect x="${-W / 2}" y="${-H - 8}" width="${W}" height="8" rx="1" fill="${S.lg("kuehlkopf", [[0, "#2b6fb0"], [1, "#1f548a"]])}"/>`;
  k += `<text x="0" y="${-H - 2.4}" font-size="4.6" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-weight="bold" letter-spacing=".4">❄ Kalte Getränke</text>`;
  /* Korpus */
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="${H}" fill="#2a2f35"/>`;
  k += `<rect x="${-W / 2 + 2}" y="${-H + 2}" width="${W - 4}" height="${H - 8}" fill="${S.lg("kuehlinnen", [[0, "#f4fbff"], [1, "#cfdde6"]])}"/>`;
  const tw = (W - 4) / 3, boeden = [-H + 21, -H + 39, -H + 57, -H + 75];
  /* Böden mit Preisschienen */
  for (const b of boeden) k += `<rect x="${-W / 2 + 2}" y="${b}" width="${W - 4}" height="1.6" fill="#9aa7b0"/><rect x="${-W / 2 + 2}" y="${b + 1.6}" width="${W - 4}" height="1.2" fill="#f4f6f7"/>`;
  const reihe = (tx, b, fn, n) => { let g = ""; for (let i = 0; i < n; i++) g += fn(tx + 2.4 + i * (tw - 4.8) / (n - 1), b); return g; };
  const unter = [];
  const tuer = (i) => -W / 2 + 2 + i * tw;
  /* Tür 1: Limonade (oben), kleine Wasserflaschen (unten) */
  for (const b of [boeden[0], boeden[1]]) k += reihe(tuer(0) + 1, b, (x, y) => flasche(x, y, 15, 4.2, i2(x) ? "#f0b52a" : "#e8742a", "#e23b2b", "#ffffff", "normal"), 6);
  for (const b of [boeden[2], boeden[3]]) k += reihe(tuer(0) + 1, b, (x, y) => flasche(x, y, 12, 3.6, KLAR_GL, "#2f78c4", "#3d8fd6"), 7);
  /* Tür 2: Dosen (oben), Eistee-Flaschen (unten) */
  for (const b of [boeden[0], boeden[1]]) k += reihe(tuer(1) + 1, b, (x, y) => dose(x, y), 7);
  for (const b of [boeden[2], boeden[3]]) k += reihe(tuer(1) + 1, b, (x, y) => flasche(x, y, 14, 4.2, "#c47a2c", "#f2f2f2", "#ffd84a"), 6);
  /* Tür 3: Bierflaschen (braunes Glas, Kronkorken) */
  for (const b of boeden) k += reihe(tuer(2) + 1, b, (x, y) => flasche(x, y, 15, 3.8, BRAUN_GL, "#c9a227", "#f1e3b8"), 7);
  function i2(x) { return Math.round(x) % 2 === 0; }
  function dose(x, y) {
    return `<rect x="${r(x - 2.1)}" y="${r(y - 7.6)}" width="4.2" height="7.6" rx=".6" fill="${S.lg("dose", [[0, "#8e1622"], [0.4, "#d32a3a"], [1, "#7a111b"]], 0, 0, 1, 0)}"/><rect x="${r(x - 2.1)}" y="${r(y - 7.6)}" width="4.2" height="1" rx=".4" fill="#c9cfd4"/><rect x="${r(x - 2.1)}" y="${r(y - 4.8)}" width="4.2" height="1.2" fill="#fff" opacity=".8"/>`;
  }
  /* Türrahmen und Griffe */
  for (let i = 0; i <= 3; i++) k += `<rect x="${r(tuer(i) - 1)}" y="${-H + 1}" width="2" height="${H - 6}" fill="#3a4047"/>`;
  for (let i = 0; i < 3; i++) k += `<rect x="${r(tuer(i) + tw - 4)}" y="${-H + 26}" width="1.4" height="22" rx=".7" fill="${STAHL}"/>`;
  k += `<rect x="${-W / 2}" y="-6" width="${W}" height="6" fill="#1d2126"/>`;
  for (let x = -W / 2 + 3; x < W / 2 - 2; x += 2.4) k += `<rect x="${r(x)}" y="-4.6" width="1.2" height="3.4" rx=".4" fill="#3d444b"/>`;
  /* Lupe: Wortflächen */
  const fl = (id, de, syl, it, itSyl, en, i, b0, b1, tipp) => unter.push({ id, de, syl, it, itSyl, en, tipp, x: cx + tuer(i) + tw / 2, y: KR.y1 + boeden[b1] + 2,
    kunst: flaeche(-tw / 2 + 1, -(boeden[b1] - boeden[b0]) - 17, tw - 2, boeden[b1] - boeden[b0] + 18) });
  fl("limonade", "die Limonade", "Li-mo-NA-de", "la limonata", "li-mo-NA-ta", "lemonade", 0, 0, 1, "Limonade nennt man kurz „Limo“ — Orangenlimo, Zitronenlimo, Cola …");
  fl("dose", "die Dose", "DO-se", "la lattina", "lat-TI-na", "can", 1, 0, 1, "Auch auf Getränkedosen sind 25 Cent Pfand.");
  fl("eistee", "der Eistee", "EIS-tee", "il tè freddo", "TÈ FRED-do", "iced tea", 1, 2, 3, null);
  fl("gm_bierflasche", "die Bierflasche", "BIER-fla-sche", "la bottiglia di birra", "bot-TI-glia di BIR-ra", "beer bottle", 2, 0, 3, "Braunes Glas schützt das Bier vor Licht.");
  S.teil({ id: "kuehlregal", de: "das Kühlregal", syl: "KÜHL-re-gal", it: "il frigorifero", itSyl: "fri-go-RI-fe-ro", en: "drinks fridge", x: cx, y: KR.y1, steht: true, kunst: k,
    zoom: { x: 0, y: 28, w: 138, h: 92 }, unter, tipp: "Hinter den Glastüren stehen die kalten Getränke." });
  S.davor(`<g pointer-events="none">${[0, 1, 2].map((i) => { const x = KR.x0 + 2 + i * tw; return `<rect x="${r(x + 1)}" y="${KR.y0 + 1}" width="${r(tw - 2)}" height="${H - 7}" fill="${GLAS}"/><path d="M${r(x + 4)} ${KR.y1 - 8} L${r(x + 14)} ${KR.y0 + 2} L${r(x + 18)} ${KR.y0 + 2} L${r(x + 8)} ${KR.y1 - 8} Z" fill="#fff" opacity=".14"/>`; }).join("")}</g>`);
}

/* =====================================================================
   4 — DAS REGAL (Schwerlastregal hinter den Paletten) — Lupe
   ===================================================================== */
const RG = { x0: 106, x1: 218, y0: 32, y1: WAND_UNTEN };
{
  const W = RG.x1 - RG.x0, H = RG.y1 - RG.y0, cx = (RG.x0 + RG.x1) / 2;
  let k = "";
  const trav = [-H + 22, -H + 44, -H + 66];          // Oberkanten der Traversen (y 54, 76, 98)
  /* Rückwand-Gitter */
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="${H}" fill="#c9cdd0" opacity=".35"/>`;
  /* Böden aus Holz */
  for (const t of trav) k += `<rect x="${-W / 2}" y="${t - 1}" width="${W}" height="1.4" fill="${HOLZ}"/>`;
  /* Ebene 1: Weinflaschen (links), Sekt (rechts) */
  for (let i = 0; i < 11; i++) k += flasche(-W / 2 + 4 + i * 4.6, trav[0] - 1, 17, 4, i % 3 === 2 ? GRUEN_GL : "#4a0f1f", "#7d1730", i % 3 === 2 ? "#f3ecd2" : "#efe3c8", "wein");
  for (let i = 0; i < 9; i++) k += flasche(6 + i * 5.4, trav[0] - 1, 18, 4.6, GRUEN_GL, "#d8b44a", "#1d2f5c", "sekt");
  /* Ebene 2: Einweg-Sixpacks (links), Partyfässer (rechts) */
  for (let s = 0; s < 3; s++) {
    const x0 = -W / 2 + 3 + s * 16;
    for (let j = 0; j < 3; j++) k += flasche(x0 + 2.6 + j * 5, trav[1] - 1, 17, 4.6, S.lg("pet", [[0, "#9fd0e8", 0.9], [0.4, "#e8f6fc", 0.9], [1, "#8cc2dc", 0.9]], 0, 0, 1, 0), "#2f78c4", "#3d8fd6");
    k += `<rect x="${x0}" y="${trav[1] - 9}" width="15" height="7" fill="#dff1fa" opacity=".35"/><rect x="${x0 + 5}" y="${trav[1] - 17.6}" width="5" height="1.6" rx=".6" fill="#e6e6e6" opacity=".8"/>`;
  }
  for (let i = 0; i < 3; i++) {
    const fx = 12 + i * 15;
    k += `<rect x="${fx - 6}" y="${trav[1] - 16}" width="12" height="15" rx="2" fill="${S.lg("fass", [[0, "#8a9298"], [0.35, "#eef1f3"], [0.6, "#c4cbd0"], [1, "#7c858b"]], 0, 0, 1, 0)}"/>`;
    k += `<rect x="${fx - 6}" y="${trav[1] - 12}" width="12" height="5" fill="#1d5f9a"/><text x="${fx}" y="${trav[1] - 8.6}" font-size="2.2" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">5 l</text>`;
    k += `<rect x="${fx - 1.6}" y="${trav[1] - 17.2}" width="3.2" height="1.4" rx=".4" fill="#333"/>`;
  }
  /* Ebene 3: Weinkartons (halb verdeckt) */
  for (let i = 0; i < 6; i++) k += `<rect x="${-W / 2 + 3 + i * 18}" y="${trav[2] - 13}" width="16" height="12" fill="${HOLZ}" stroke="#9b7a4b" stroke-width=".3"/><text x="${-W / 2 + 11 + i * 18}" y="${trav[2] - 5.5}" font-size="2.2" text-anchor="middle" fill="#6b4a22" font-family="Georgia">Vino</text>`;
  /* Preisschilder an der Traversenvorderkante */
  /* Ständer (blau) und Traversen (orange) */
  for (const x of [-W / 2, 0, W / 2]) {
    k += `<rect x="${x - 1.8}" y="${-H}" width="3.6" height="${H}" fill="${BLAU_ST}"/>`;
    for (let y = -H + 3; y < 0; y += 3) k += `<rect x="${x - 0.5}" y="${y}" width="1" height="1.4" fill="#1a3557"/>`;
  }
  for (const t of trav) {
    k += `<rect x="${-W / 2}" y="${t}" width="${W}" height="3.4" fill="${ORANGE}"/>`;
    for (let i = 0; i < 8; i++) k += `<rect x="${r(-W / 2 + 4 + i * 13.6)}" y="${t + 0.4}" width="7" height="2.6" fill="#fff"/><text x="${r(-W / 2 + 7.5 + i * 13.6)}" y="${t + 2.4}" font-size="1.7" text-anchor="middle" fill="#222" font-family="Arial" font-weight="bold">${(["4,99", "6,49", "3,99", "8,99", "7,49", "2,79", "12,99", "5,29"])[(i + trav.indexOf(t) * 3) % 8]}</text>`;
  }
  const unter = [
    { id: "weinflasche", de: "die Weinflasche", syl: "WEIN-fla-sche", it: "la bottiglia di vino", itSyl: "bot-TI-glia di VI-no", en: "wine bottle", x: cx - W / 4, y: RG.y1 + trav[0], kunst: flaeche(-W / 4 + 2, -19, W / 2 - 4, 19.5) },
    { id: "sektflasche", de: "die Sektflasche", syl: "SEKT-fla-sche", it: "la bottiglia di spumante", itSyl: "bot-TI-glia di spu-MAN-te", en: "sparkling wine bottle", x: cx + W / 4, y: RG.y1 + trav[0], kunst: flaeche(-W / 4 + 2, -19, W / 2 - 4, 19.5) },
    { id: "plastikflasche", de: "die Plastikflasche", syl: "PLAS-tik-fla-sche", it: "la bottiglia di plastica", itSyl: "bot-TI-glia di PLA-sti-ca", en: "plastic bottle", x: cx - W / 4, y: RG.y1 + trav[1], kunst: flaeche(-W / 4 + 2, -19, W / 2 - 4, 19.5),
      tipp: "Auf Einwegflaschen aus Plastik sind 25 Cent Pfand." },
    { id: "fass", de: "das Fass", syl: "FASS", it: "il fusto", itSyl: "FU-sto", en: "keg", x: cx + W / 4, y: RG.y1 + trav[1], kunst: flaeche(-W / 4 + 2, -19, W / 2 - 4, 19.5),
      tipp: "Ein Partyfass hat fünf Liter Bier und einen eigenen Zapfhahn." },
  ];
  S.teil({ id: "regal", de: "das Regal", syl: "re-GAL", it: "lo scaffale", itSyl: "scaf-FA-le", en: "shelf", x: cx, y: RG.y1, steht: true, kunst: k,
    zoom: { x: RG.x0 - 4, y: RG.y0 - 2, w: W + 8, h: 80 }, unter });
}

/* =====================================================================
   5 — DER PFANDAUTOMAT mit Kastenannahme (rechts hinten)
   ===================================================================== */
const PA = { x: 238, y: WAND_UNTEN };
{
  let k = schatten(14, 0, 34, 1.5, 0.3);
  /* Wandverkleidung der Leergutannahme */
  k += `<rect x="-22" y="-78" width="74" height="78" fill="${S.lg("verkl", [[0, "#dfe6e2"], [1, "#c7d0cb"]])}"/>`;
  /* Flaschenautomat */
  k += `<rect x="-18" y="-74" width="30" height="74" rx="2" fill="${S.lg("autogeh", [[0, "#d9dde0"], [0.5, "#f2f4f5"], [1, "#b7bdc1"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-18" y="-74" width="30" height="9" rx="2" fill="${S.lg("autokopf", [[0, "#2c8a4f"], [1, "#1d6a3a"]])}"/>`;
  k += `<text x="-3" y="-67.8" font-size="3.6" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">PFAND</text>`;
  /* Bildschirm */
  k += `<rect x="-13" y="-61" width="20" height="13" rx="1" fill="#1a1f24"/><rect x="-12" y="-60" width="18" height="11" rx=".6" fill="${S.lg("autobild", [[0, "#e9f6ee"], [1, "#bfe3cb"]])}"/>`;
  k += `<text x="-3" y="-56" font-size="2.2" text-anchor="middle" fill="#1d6a3a" font-family="Arial" font-weight="bold">Ihr Pfand:</text><text x="-3" y="-51.4" font-size="3.6" text-anchor="middle" fill="#123" font-family="Arial" font-weight="bold">2,40 €</text>`;
  /* Flaschenöffnung: runde Öffnung mit Leuchtring */
  k += `<circle cx="-3" cy="-36" r="7" fill="#8f979c"/><circle cx="-3" cy="-36" r="5.8" fill="#4fb3e8"/><circle cx="-3" cy="-36" r="4.8" fill="${S.rg("loch", [[0, "#0b0d0f"], [1, "#2a2f33"]])}"/>`;
  k += `<rect x="-11" y="-30.4" width="16" height="1.4" rx=".6" fill="#8f979c"/>`;
  /* Bon-Taste (grün) und Bon-Ausgabe */
  k += `<circle cx="7.4" cy="-41" r="2" fill="#3cb35a"/><circle cx="7" cy="-41.6" r=".7" fill="#fff" opacity=".6"/><text x="7.4" y="-37" font-size="1.8" text-anchor="middle" fill="#333" font-family="Arial">Bon</text>`;
  k += `<rect x="3" y="-26.6" width="9" height="1.4" rx=".5" fill="#1a1f24"/>`;
  k += `<rect x="-18" y="-6" width="30" height="6" fill="#9aa1a6"/>`;
  k += `<path d="M-17 -72 L-12 -72 L-17 -20 Z" fill="#fff" opacity=".25"/>`;
  /* Kastenannahme: Öffnung am Boden mit Rollenband */
  k += `<rect x="14" y="-50" width="36" height="50" rx="1.6" fill="${S.lg("kastgeh", [[0, "#c9ced2"], [1, "#e9ecee"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="14" y="-50" width="36" height="7" rx="1.6" fill="#1d6a3a"/><text x="32" y="-45.3" font-size="3" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">KÄSTEN</text>`;
  k += `<rect x="17" y="-38" width="30" height="34" rx="1" fill="#22272b"/>`;
  k += `<rect x="18" y="-37" width="28" height="10" fill="${S.lg("kastinnen", [[0, "#11151a"], [1, "#2c3238"]])}"/>`;
  for (let i = 0; i < 7; i++) k += `<rect x="${18 + i * 4.2}" y="-6.4" width="3.4" height="2.4" rx="1.2" fill="${STAHL}"/>`;
  k += `<rect x="16" y="-4" width="32" height="4" fill="#6d757b"/>`;
  k += `<circle cx="44" cy="-41" r="1.4" fill="#3cb35a"/>`;
  S.teil({ id: "gm_pfandautomat", de: "der Pfandautomat", syl: "PFAND-au-to-mat", it: "il distributore del vuoto", itSyl: "di-stri-bu-TO-re del VUO-to", en: "deposit machine", x: PA.x, y: PA.y, steht: true, kunst: k,
    tipp: "Der Automat liest das Pfandzeichen auf jeder Flasche und zählt das Pfand zusammen." });
}
{
  /* DER PFANDBON hängt aus der Bon-Ausgabe */
  let k = `<path d="M-3.6 0 L3.6 0 L3.8 9 Q2 10 0 9.4 Q-2 10 -3.8 9 Z" fill="#fbfbf7" stroke="#cfcfc8" stroke-width=".2"/>`;
  k += `<path d="M-2.6 2.2 h5.2 M-2.6 3.6 h3.6 M-2.6 5 h4.6" stroke="#8a8a8a" stroke-width=".3"/><text x="0" y="7.8" font-size="1.7" text-anchor="middle" fill="#222" font-family="monospace" font-weight="bold">2,40 €</text>`;
  S.teil({ oben: true, id: "gm_pfandbon", de: "der Pfandbon", syl: "PFAND-bon", it: "lo scontrino del vuoto", itSyl: "scon-TRI-no del VUO-to", en: "deposit receipt", x: PA.x + 7.5, y: PA.y - 25.6, kunst: k,
    tipp: "Den Pfandbon löst man an der Kasse ein — er wird vom Einkauf abgezogen." });
}
{
  /* DAS LEERGUT — ein Kasten leerer Flaschen auf dem Rollenband der Kastenannahme */
  let k = "";
  for (let i = 0; i < 5; i++) k += flasche(-9.6 + i * 4.8, -7, 13, 3.8, i % 2 ? GRUEN_GL : KLAR_GL, i === 2 ? "none" : "#2f78c4", null);
  k += kasten(-12, 0, 24, 9, S.lg("leerk", [[0, "#3a8a4a"], [1, "#2a6a38"]]), "#1f4f29", "", null);
  S.teil({ oben: true, id: "gm_leergut_gm", de: "das Leergut", syl: "LEER-gut", it: "il vuoto a rendere", itSyl: "VUO-to a REN-de-re", en: "empties", x: PA.x + 32, y: PA.y - 6.4, kunst: k,
    tipp: "Leergut sind die leeren Flaschen und Kästen. Für eine Mehrwegflasche gibt es 8 bis 15 Cent zurück, für den Kasten 1,50 €." });
}

/* =====================================================================
   7 — DIE PALETTE, darauf DAS MINERALWASSER (Blockstapel) und DAS ANGEBOT
   ===================================================================== */
const PAL_Y = 158, M1 = mass(PAL_Y);                 // ≈ 48,9 Einheiten je Meter
const PAL_H = 0.144 * M1, KW = 0.4 * M1, KH = 0.27 * M1;
function palette(w) {
  let g = schatten(0, 0, w / 2 + 3, 2, 0.35);
  const top = -PAL_H, tief = 5;
  g += `<path d="M${-w / 2} ${r(top)} L${w / 2} ${r(top)} L${w / 2 - 1} ${r(top - tief)} L${-w / 2 + 1} ${r(top - tief)} Z" fill="#c9a571"/>`;
  g += `<rect x="${-w / 2}" y="${r(top)}" width="${w}" height="${r(PAL_H * 0.28)}" fill="${S.lg("palbrett", [[0, "#e2c28d"], [1, "#c29d63"]])}"/>`;
  g += `<rect x="${-w / 2}" y="${r(-PAL_H * 0.28)}" width="${w}" height="${r(PAL_H * 0.28)}" fill="${S.lg("palbrett", [[0, "#e2c28d"], [1, "#c29d63"]])}"/>`;
  /* Klötze mit EPAL-Brandzeichen, dazwischen die Gabelöffnungen */
  for (const x of [-w / 2, -w / 2 + w / 2 - 3.5, w / 2 - 7]) {
    g += `<rect x="${r(x)}" y="${r(top + PAL_H * 0.28)}" width="7" height="${r(PAL_H * 0.44)}" fill="#b98f57"/>`;
    g += `<text x="${r(x + 3.5)}" y="${r(top + PAL_H * 0.62)}" font-size="1.5" text-anchor="middle" fill="#5a3c18" font-family="Arial" font-weight="bold">EPAL</text>`;
  }
  g += `<rect x="${-w / 2 + 7}" y="${r(top + PAL_H * 0.28)}" width="${r(w / 2 - 10.5)}" height="${r(PAL_H * 0.44)}" fill="#3b2f22"/><rect x="${r(3.5)}" y="${r(top + PAL_H * 0.28)}" width="${r(w / 2 - 10.5)}" height="${r(PAL_H * 0.44)}" fill="#3b2f22"/>`;
  return g;
}
const W1 = { x: 136, w: 1.2 * M1 };
{
  S.teil({ id: "gm_palette_gm", de: "die Palette", syl: "Pa-LET-te", it: "il bancale", itSyl: "ban-CA-le", en: "pallet", x: W1.x, y: PAL_Y, steht: true, kunst: palette(W1.w),
    tipp: "Eine Europalette ist 1,20 m lang und 80 cm breit. Darauf passen acht Kästen in jeder Lage." });
}
{
  const k = stapel(W1.x, 3, 4, KW, KH, S.lg("wasserk", [[0, "#2f7ec9"], [1, "#1f5e9c"]]), "#174a7c", "Quelle", [KLAR_GL, "#2f78c4"]);
  S.teil({ id: "gm_sprudel", de: "das Mineralwasser", syl: "Mi-ne-RAL-was-ser", it: "l'acqua minerale", itSyl: "AC-qua mi-ne-RA-le", en: "mineral water", x: W1.x, y: PAL_Y - PAL_H, steht: true, kunst: k,
    tipp: "Ein Kasten Mineralwasser hat zwölf Glasflaschen zu 0,7 Litern." });
}
{
  /* Angebots-Aufsteller, auf den Stapel gesteckt */
  let k = `<rect x="-.5" y="-6" width="1" height="6" fill="#888"/>`;
  k += `<path d="M-14 -24 L14 -24 L14 -6 L-14 -6 Z" fill="${S.lg("angebot", [[0, "#ffe14a"], [1, "#f4c51e"]])}" stroke="#d01f1f" stroke-width="1"/>`;
  k += `<rect x="-14" y="-24" width="28" height="6" fill="#d01f1f"/><text x="0" y="-19.6" font-size="4.2" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">ANGEBOT</text>`;
  k += `<text x="0" y="-13" font-size="6" text-anchor="middle" fill="#d01f1f" font-family="Arial" font-weight="bold">4,99 €</text>`;
  k += `<text x="0" y="-8.4" font-size="2" text-anchor="middle" fill="#333" font-family="Arial">12 × 0,7 l · zzgl. 3,30 € Pfand</text>`;
  S.teil({ oben: true, id: "gm_preisschild_gm", de: "das Angebot", syl: "AN-ge-bot", it: "l'offerta", itSyl: "of-FER-ta", en: "special offer", x: W1.x - 6, y: PAL_Y - PAL_H - 4 * KH - 3, kunst: k,
    tipp: "Im Angebot ist das Wasser billiger. Das Pfand kommt immer dazu." });
}

/* =====================================================================
   8 — DER BIERKASTEN-Stapel (zweite Palette)
   ===================================================================== */
{
  const x = 196, w = 1.2 * M1;
  let k = palette(w);
  k += `<g transform="translate(0 ${r(-PAL_H)})">${stapel(x, 3, 4, KW, KH, S.lg("bierk", [[0, "#7a3d1c"], [1, "#5a2a12"]]), "#3f1d0b", "Pils", [BRAUN_GL, "#c9a227"])}</g>`;
  /* Preisschild an der obersten Lage */
  k += `<rect x="-9" y="${r(-PAL_H - 4 * KH + 1)}" width="18" height="7" rx=".6" fill="#fff" stroke="#999" stroke-width=".2"/><text x="0" y="${r(-PAL_H - 4 * KH + 4.4)}" font-size="2.3" text-anchor="middle" fill="#222" font-family="Arial" font-weight="bold">Pils 20 × 0,5 l</text><text x="0" y="${r(-PAL_H - 4 * KH + 7.2)}" font-size="2.6" text-anchor="middle" fill="#c01b1b" font-family="Arial" font-weight="bold">13,99 €</text>`;
  S.teil({ id: "bierkasten", de: "der Bierkasten", syl: "BIER-kas-ten", it: "la cassa di birra", itSyl: "CAS-sa di BIR-ra", en: "beer crate", x, y: PAL_Y, steht: true, kunst: k,
    tipp: "In einem Bierkasten stehen meist zwanzig Flaschen zu einem halben Liter." });
}

/* =====================================================================
   9 — DER MITARBEITER hinter der Kasse, 10 — DIE KASSE (vorne rechts)
   ===================================================================== */
{
  const m = B.mensch({ id: "b05a_mitarb", geschlecht: "m", pose: "stehen", blick: -20, frisur: "kurz", haarfarbe: "schwarz", haut: "hell", bart: true,
    kleidung: { oberteil: { stueck: "tshirt", farbe: "gruen_d" }, unterteil: { stueck: "arbeitshose" }, jacke: { stueck: "weste", farbe: "gruen" }, schuhe: { stueck: "halbschuh" } } }, 1.8 * mass(172));
  S.teil({ id: "gm_mitarbeiter_gm", de: "der Mitarbeiter", syl: "MIT-ar-bei-ter", it: "il dipendente", itSyl: "di-pen-DEN-te", en: "member of staff", x: 300, y: 172, kunst: m.svg,
    tipp: "Der Mitarbeiter sitzt an der Kasse und füllt die Paletten auf." });
}
{
  const MK = mass(195), hT = 0.9 * MK;
  let k = schatten(0, 0, 44, 2, 0.35);
  /* Kassentisch: Platte, Front, Sockel */
  k += `<path d="M-42 ${r(-hT)} L42 ${r(-hT)} L40 ${r(-hT - 6)} L-40 ${r(-hT - 6)} Z" fill="${S.lg("kplatte", [[0, "#d9dcde"], [1, "#b7bcbf"]])}"/>`;
  /* Kassenband (Förderband) auf der Platte, mit Warentrenner */
  k += `<path d="M-40 ${r(-hT - 0.6)} L4 ${r(-hT - 0.6)} L4 ${r(-hT - 5.4)} L-38.6 ${r(-hT - 5.4)} Z" fill="#26292c"/>`;
  k += `<rect x="-24" y="${r(-hT - 4.8)}" width="10" height="1.6" rx=".5" fill="#3b7fc4"/>`;
  k += `<rect x="-42" y="${r(-hT)}" width="84" height="${r(hT)}" fill="${S.lg("kfront", [[0, "#2c8a4f"], [1, "#1d6a3a"]])}"/>`;
  k += `<rect x="-42" y="${r(-hT)}" width="84" height="1.4" fill="#e9ecee"/>`;
  k += `<rect x="-42" y="-4" width="84" height="4" fill="#1a1d20"/>`;
  k += `<text x="-8" y="${r(-hT / 2 + 1)}" font-size="5.4" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold" letter-spacing=".5">Getränke Huber</text>`;
  k += `<text x="-8" y="${r(-hT / 2 + 5.4)}" font-size="2.4" text-anchor="middle" fill="#f2c230" font-family="Arial">Danke für Ihren Einkauf!</text>`;
  /* Kassenbildschirm und Kartenterminal rechts */
    k += `<rect x="25.4" y="${r(-hT - 12)}" width="2.4" height="7" fill="#3a3f44"/>`;
  k += `<path d="M18 ${r(-hT - 24)} L36 ${r(-hT - 24)} L36.6 ${r(-hT - 11)} L17.4 ${r(-hT - 11)} Z" fill="#1d2125"/>`;
  k += `<rect x="19.2" y="${r(-hT - 22.8)}" width="15.6" height="10.4" fill="${S.lg("kbild", [[0, "#2c4e6b"], [1, "#1b3247"]])}"/>`;
  k += `<text x="27" y="${r(-hT - 18.4)}" font-size="1.9" text-anchor="middle" fill="#cfe" font-family="Arial">Pfandbon −2,40</text><text x="27" y="${r(-hT - 14.4)}" font-size="2.6" text-anchor="middle" fill="#9fe39a" font-family="Arial" font-weight="bold">8,89 €</text>`;
  k += `<path d="M7 ${r(-hT - 6)} L12 ${r(-hT - 6)} L12.4 ${r(-hT - 15)} L6.6 ${r(-hT - 15)} Z" fill="#2a2e33"/><rect x="7.4" y="${r(-hT - 14.2)}" width="4.6" height="3" fill="#9cd3e8"/>`;
  S.teil({ id: "kasse", de: "die Kasse", syl: "KAS-se", it: "la cassa", itSyl: "CAS-sa", en: "checkout", x: 272, y: 195, steht: true, kunst: k,
    tipp: "An der Kasse bezahlt man und gibt den Pfandbon ab." });
}

/* =====================================================================
   11 — DIE SACKKARRE mit zwei Kästen SAFT (vorne Mitte)
   ===================================================================== */
const SK = { x: 190, y: 196 };
{
  const MS = mass(SK.y);
  let k = schatten(0, 0, 14, 1.6, 0.35);
  const h = 1.2 * MS;
  /* Rahmen: zwei Holme, oben Griffbügel, unten Schaufel */
  k += `<path d="M-9 ${r(-h)} Q-9 ${r(-h - 4)} -5 ${r(-h - 4)} L5 ${r(-h - 4)} Q9 ${r(-h - 4)} 9 ${r(-h)}" stroke="#20262b" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  k += `<rect x="-10" y="${r(-h)}" width="2.2" height="${r(h - 2)}" rx="1" fill="${S.lg("sk", [[0, "#3f8fd8"], [1, "#2a6aa8"]], 0, 0, 1, 0)}"/><rect x="7.8" y="${r(-h)}" width="2.2" height="${r(h - 2)}" rx="1" fill="${S.lg("sk", [[0, "#3f8fd8"], [1, "#2a6aa8"]], 0, 0, 1, 0)}"/>`;
  for (const y of [-h * 0.75, -h * 0.5, -h * 0.25]) k += `<rect x="-8" y="${r(y)}" width="16" height="1.2" fill="#2a6aa8"/>`;
  k += `<path d="M-11 -3 L11 -3 L13 -0.6 L-13 -0.6 Z" fill="${STAHL}"/>`;
  /* Räder */
  for (const x of [-11.5, 11.5]) k += `<circle cx="${x}" cy="-3.6" r="4" fill="#1b1d1f"/><circle cx="${x}" cy="-3.6" r="1.8" fill="#c9cfd4"/><circle cx="${x}" cy="-3.6" r=".6" fill="#555"/>`;
  S.teil({ id: "gm_sackkarre_gm", de: "die Sackkarre", syl: "SACK-kar-re", it: "il carrello a mano", itSyl: "car-REL-lo a MA-no", en: "sack barrow", x: SK.x, y: SK.y, steht: true, kunst: k,
    tipp: "Mit der Sackkarre fährt man mehrere Kästen auf einmal." });
}
{
  const MS = mass(SK.y), kw = 0.4 * MS, kh = 0.27 * MS;
  let k = "";
  k += kasten(-kw / 2, 0, kw, kh, S.lg("saftk", [[0, "#f39a2b"], [1, "#d4741a"]]), "#a65512", "Saft", null);
  k += kasten(-kw / 2, -kh, kw, kh, S.lg("saftk", [[0, "#f39a2b"], [1, "#d4741a"]]), "#a65512", "Saft", [S.lg("saftfl", [[0, "#e88a1a"], [0.5, "#ffc35a"], [1, "#d06f10"]], 0, 0, 1, 0), "#2a8a3a"]);
  S.teil({ oben: true, id: "gm_saft", de: "der Saft", syl: "SAFT", it: "il succo", itSyl: "SUC-co", en: "juice", x: SK.x, y: SK.y - 3.4, kunst: k,
    tipp: "Orangensaft und Apfelsaft gibt es im Getränkemarkt kastenweise." });
}

/* =====================================================================
   12 — DER EINKAUFSWAGEN (Kistenwagen) mit DEM KASTEN (vorne links)
   ===================================================================== */
const EW = { x: 82, y: 194 };
{
  const MS = mass(EW.y);
  let k = schatten(0, 0, 34, 2, 0.35);
  const L = 1.1 * MS, hP = 0.32 * MS;
  /* Rollen */
  for (const x of [-L / 2 + 4, L / 2 - 4]) k += `<rect x="${r(x - 0.8)}" y="-6" width="1.6" height="3" fill="#777"/><circle cx="${r(x)}" cy="-2.6" r="2.6" fill="#1b1d1f"/><circle cx="${r(x)}" cy="-2.6" r="1" fill="#bbb"/>`;
  /* Fahrgestell: Längsholm unten, Stützen zur Ladefläche */
  k += `<rect x="${r(-L / 2 + 2)}" y="-7" width="${r(L - 4)}" height="1.6" rx=".6" fill="#9aa3aa"/>`;
  for (const x of [-L / 2 + 4, 0, L / 2 - 4]) k += `<rect x="${r(x - 0.7)}" y="${r(-hP + 2)}" width="1.4" height="${r(hP - 8)}" fill="#aeb6bd"/>`;
  /* Ladefläche mit Gitterrand, Schiebebügel links (Kundin schiebt von links) */
  k += `<rect x="${r(-L / 2)}" y="${r(-hP)}" width="${r(L)}" height="3" rx="1" fill="${STAHL}"/>`;
  k += `<rect x="${r(-L / 2)}" y="${r(-hP - 8)}" width="${r(L)}" height="1.2" fill="#c9cfd4"/>`;
  for (let x = -L / 2; x <= L / 2; x += 4) k += `<rect x="${r(x)}" y="${r(-hP - 8)}" width=".6" height="8" fill="#aeb6bd"/>`;
  /* Schiebebügel: zwei Rohre schräg nach hinten oben, roter Griff */
  k += `<path d="M${r(-L / 2)} -6 L${r(-L / 2)} ${r(-hP - 8)} L${r(-L / 2 - 5)} ${r(-0.98 * MS)}" stroke="#aeb6bd" stroke-width="1.6" fill="none" stroke-linejoin="round"/>`;
  k += `<rect x="${r(-L / 2 - 7.5)}" y="${r(-0.98 * MS - 1.6)}" width="5" height="3.2" rx="1.4" fill="#d01f1f"/>`;
  S.teil({ id: "einkaufswagen", de: "der Einkaufswagen", syl: "EIN-kaufs-wa-gen", it: "il carrello della spesa", itSyl: "car-REL-lo del-la SPE-sa", en: "shopping trolley", x: EW.x, y: EW.y, steht: true, kunst: k,
    tipp: "Im Getränkemarkt ist der Einkaufswagen flach — für zwei bis drei Kästen." });
}
{
  const MS = mass(EW.y), kw = 0.4 * MS, kh = 0.27 * MS, hP = 0.32 * MS;
  let k = kasten(-kw / 2, 0, kw, kh, S.lg("wasserk2", [[0, "#2f9a5a"], [1, "#1f7442"]]), "#145a30", "Sprudel", [KLAR_GL, "#d01f1f"]);
  S.teil({ oben: true, id: "gm_kasten", de: "der Kasten", syl: "KAS-ten", it: "la cassa di bottiglie", itSyl: "CAS-sa di bot-TI-glie", en: "crate of bottles", x: EW.x + 6, y: EW.y - hP, kunst: k,
    tipp: "Für den Kasten selbst zahlt man auch Pfand: 1,50 €." });
}

/* =====================================================================
   6 — DIE KUNDIN schiebt den Kistenwagen (vorne links)
   ===================================================================== */
{
  const m = B.mensch({ id: "b05a_kundin", geschlecht: "w", pose: "halten", blick: 62, frisur: "zopf", haarfarbe: "dunkelbraun", haut: "mittel",
    kleidung: { oberteil: { stueck: "pullover", farbe: "hellblau" }, unterteil: { stueck: "jeans" }, jacke: { stueck: "jacke", farbe: "rot" }, schuhe: { stueck: "turnschuh" }, zubehoer: { stueck: "tasche", farbe: "braun" } } }, 1.66 * mass(197));
  S.teil({ id: "gm_kundin_gm", de: "die Kundin", syl: "KUN-din", it: "la cliente", itSyl: "cli-EN-te", en: "customer", x: 17, y: 197, kunst: m.svg,
    tipp: "Die Kundin hat ihren Pfandbon schon — jetzt holt sie einen neuen Kasten Wasser." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/getraenkemarkt.js"));
console.log(aus);
