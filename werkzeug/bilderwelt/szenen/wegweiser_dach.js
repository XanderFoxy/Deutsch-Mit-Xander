#!/usr/bin/env node
/* =====================================================================
   WEGWEISER: DE · AT · CH (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   Die alte Szene war eine Wörtertafel: Wo meldet man sich an, wenn man
   nach Deutschland, Österreich oder in die Schweiz zieht? Der echte Ort
   dazu ist eine GRENZGÄNGER-INFOSTELLE am Bodensee (z. B. die Grenz-
   gänger-Beratung in Konstanz, die Infostellen der Kantone): Dort
   kommen Leute hin, die im Dreiländereck umziehen oder pendeln.

   RECHERCHE (Grenzgänger-Broschüre Kanton Thurgau, Grenzgänger-Beratung
   Konstanz, Meldegesetze der drei Länder):
   - Deutschland: Anmeldung beim BÜRGERAMT innerhalb von zwei Wochen
     (§ 17 Bundesmeldegesetz). Mitbringen: Ausweis und die WOHNUNGS-
     GEBERBESTÄTIGUNG vom Vermieter. Man bekommt eine MELDE-
     BESCHEINIGUNG.
   - Österreich: Anmeldung beim MELDEAMT (Meldeservice der Gemeinde)
     innerhalb von drei Tagen mit dem MELDEZETTEL, den auch der
     Unterkunftgeber unterschreibt.
   - Schweiz: Anmeldung bei der EINWOHNERKONTROLLE der Gemeinde, meist
     innerhalb von 14 Tagen. Schweizer geben ihren HEIMATSCHEIN ab,
     Ausländer bekommen einen AUSLÄNDERAUSWEIS (Ausweis B, G für
     Grenzgänger) im Kreditkartenformat.
   - So sieht so eine Infostelle aus: Empfangstheke mit Beraterin, hinter
     der Theke Stockfahnen der drei Länder, ein Leitsystem-WEGWEISER mit
     Pfeilen zu den Ämtern, Landkarte vom Bodensee, Schaukasten mit
     Musterdokumenten, Formularständer mit Vordrucken und Prospekten,
     Wartebank, Natursteinboden.
   BLICK: frontal auf die Rückwand, Fluchtpunkt in der Mitte (x = 160),
   Augenhöhe 1,6 m. Maßstab: Rückwand 38 Einheiten je Meter, Theke
   (1,08 m) ≈ 48 je Meter, Menschen 1,66–1,70 m.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "wegweiser_dach", titel: "Wegweiser: DE · AT · CH", emoji: "🧭", thema: "Behörden", kuerzel: "b09a", fassung: 852 });
const rnd = zufall(1648);
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
/* Rückwand (z = 0): x = 160 + 38·X, y = 130,8 − 38·H */
const WX = (X) => r(VX + X * S0), WY = (H) => r(HY + (E - H) * S0);
const T = (x, y, s, txt, f = "#fff", extra = "") => `<text x="${r(x)}" y="${r(y)}" font-size="${s}" fill="${f}" font-family="Arial,Helvetica,sans-serif"${extra ? " " + extra : ""}>${txt}</text>`;

/* ---------- Farben ---------------------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const SEEBLAU = "#1f5a7a", ANTHRA = "#2b3138";
const WAND = S.lg("wand", [[0, "#f4f2ed"], [1, "#e6e2d9"]]);
const SWAND = S.lg("swand", [[0, "#dcd7cc"], [1, "#e9e5dc"]], 0, 0, 1, 0);
const EICHE = S.lg("eiche", [[0, "#d6b98e"], [0.5, "#c9a877"], [1, "#b8955f"]], 0, 0, 1, 0);
const STAHL = S.lg("stahl", [[0, "#eef1f3"], [0.45, "#c9cfd4"], [0.55, "#b5bcc2"], [1, "#e1e5e8"]], 0, 0, 1, 0);
const WEISS_K = S.lg("weissk", [[0, "#ffffff"], [1, "#e9ecee"]]);
const FALTEN = S.lg("falten", [[0, "#000", 0.22], [0.18, "#fff", 0.2], [0.38, "#000", 0.12], [0.6, "#fff", 0.16], [0.82, "#000", 0.16], [1, "#000", 0.28]], 0, 0, 1, 0);

/* =====================================================================
   KULISSE — Decke mit Downlights, Rückwand, Seitenwände, Steinboden
   ===================================================================== */
const XL = -3.95, XR = 3.95, HD = 3.0;
{
  const WO = WY(HD), WU = WY(0);
  /* Decke */
  let k = `<rect x="0" y="0" width="320" height="${WO}" fill="${S.lg("decke", [[0, "#e9e8e4"], [1, "#f6f5f2"]])}"/>`;
  for (const [X, z] of [[-2.4, 0.9], [0, 0.9], [2.4, 0.9], [-2.4, 2.2], [0, 2.2], [2.4, 2.2]]) {
    const [cx, cy] = P(X, HD, z), s = sk(z) / S0;
    k += `<ellipse cx="${cx}" cy="${cy}" rx="${r(4.2 * s)}" ry="${r(1.1 * s)}" fill="#fffdf2"/><ellipse cx="${cx}" cy="${cy}" rx="${r(9 * s)}" ry="${r(2.4 * s)}" fill="#fff6d8" opacity=".25"/>`;
  }
  /* Rückwand mit Lichtverlauf */
  k += `<rect x="${WX(XL)}" y="${WO}" width="${r(WX(XR) - WX(XL))}" height="${r(WU - WO)}" fill="${WAND}"/>`;
  k += `<rect x="${WX(XL)}" y="${WO}" width="${r(WX(XR) - WX(XL))}" height="${r(WU - WO)}" fill="${S.rg("wandlicht", [[0, "#fffaf0", 0.6], [1, "#fffaf0", 0]], 0.5, 0.1, 0.7)}"/>`;
  /* Seebau-Band (Leitfarbe der Infostelle) */
  k += `<rect x="${WX(XL)}" y="${WY(2.98)}" width="${r(WX(XR) - WX(XL))}" height="${r(0.05 * S0)}" fill="${SEEBLAU}" opacity=".85"/>`;
  /* Seitenwände in Flucht */
  for (const [X, f] of [[XL, -1], [XR, 1]]) {
    const z1 = 1.2;
    k += poly([P(X, HD, 0), P(X, HD, z1), P(X, 0, z1), P(X, 0, 0)], SWAND);
    k += poly([P(X, 0.1, 0), P(X, 0.1, z1), P(X, 0, z1), P(X, 0, 0)], "#8d8a84");
  }
  /* Natursteinboden (Jura-Kalkstein, hellgrau-beige), Platten 60 cm */
  k += poly([P(XL, 0, 0), P(XR, 0, 0), P(XR, 0, 3.3), P(XL, 0, 3.3)], S.lg("boden", [[0, "#cdc7bb"], [1, "#b8b1a3"]]));
  let fu = "";
  for (let X = -6; X <= 6; X += 0.6) { const a = P(X, 0, 0), b = P(X, 0, 3.3); fu += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#a49c8d" stroke-width=".35"/>`; }
  for (let z = 0.6; z < 3.3; z += 0.6) { const a = P(-6, 0, z), b = P(6, 0, z); fu += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#a49c8d" stroke-width=".35"/>`; }
  /* Fossil-Sprenkel des Jurakalks */
  for (let i = 0; i < 160; i++) { const X = -4 + rnd() * 8, z = rnd() * 3.2, [x, y] = P(X, 0, z); fu += `<ellipse cx="${x}" cy="${y}" rx="${r(0.4 + rnd() * 0.7)}" ry="${r(0.2 + rnd() * 0.3)}" fill="${rnd() < 0.5 ? "#a79f90" : "#e0dbd0"}" opacity=".55"/>`; }
  k += fu;
  /* Bodenleitsystem für Blinde: geriffelte weiße Platten vom Eingang zur Infotheke */
  {
    const bahn = (Xa, Xb, za, zb) => {
      let g = poly([P(Xa, 0, za), P(Xb, 0, za), P(Xb, 0, zb), P(Xa, 0, zb)], "#eceae4");
      if (Xb - Xa >= 0.4) for (let z = za; z < zb; z += 0.05) { const a = P(Xa + 0.03, 0, z), b = P(Xb - 0.03, 0, z); g += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#c9c5bb" stroke-width=".35"/>`; }
      else for (let X = Xa + 0.05; X < Xb; X += 0.06) { const a = P(X, 0, za + 0.03), b = P(X, 0, zb - 0.03); g += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#c9c5bb" stroke-width=".35"/>`; }
      return g;
    };
    k += bahn(-0.15, 0.15, 1.75, 3.4);
    k += bahn(-0.15, 0.15, 1.45, 1.75).replace(/<line[^>]*>/g, "");
    for (let X = -0.12; X < 0.13; X += 0.08) for (let z = 1.48; z < 1.74; z += 0.08) { const [x, y] = P(X, 0, z); k += `<ellipse cx="${x}" cy="${y}" rx=".9" ry=".35" fill="#c9c5bb"/>`; }
    k += bahn(0.15, 0.7, 1.52, 1.68);
  }
  /* Sockelleiste und Spiegelung des Lichts im polierten Stein */
  k += `<rect x="${WX(XL)}" y="${r(WU - 2.6)}" width="${r(WX(XR) - WX(XL))}" height="2.6" fill="#8d8a84"/>`;
  k += `<rect x="0" y="${WU}" width="320" height="${r(200 - WU)}" fill="${S.lg("bodenlicht", [[0, "#000", 0.12], [0.45, "#000", 0], [1, "#fff", 0.08]])}"/>`;
  S.hinten(k);
}

/* =====================================================================
   1 — DIE UHR (Rückwand links oben)
   ===================================================================== */
{
  let k = `<circle r="6.6" fill="#3c4148"/><circle r="5.9" fill="${S.rg("ziffer", [[0, "#ffffff"], [1, "#eceae4"]])}"/>`;
  for (let i = 0; i < 12; i++) {
    const a = i * Math.PI / 6, l = i % 3 ? 0.7 : 1.3;
    k += `<line x1="${r(Math.sin(a) * 5.2)}" y1="${r(-Math.cos(a) * 5.2)}" x2="${r(Math.sin(a) * (5.2 - l))}" y2="${r(-Math.cos(a) * (5.2 - l))}" stroke="#222" stroke-width="${i % 3 ? 0.3 : 0.6}"/>`;
  }
  /* 9:40 Uhr — die Infostelle hat geöffnet */
  k += `<line x1="0" y1="0" x2="${r(Math.sin(9.67 * Math.PI / 6) * 3)}" y2="${r(-Math.cos(9.67 * Math.PI / 6) * 3)}" stroke="#1d1d1d" stroke-width=".8" stroke-linecap="round"/>`;
  k += `<line x1="0" y1="0" x2="${r(Math.sin(8 * Math.PI / 6) * 4.4)}" y2="${r(-Math.cos(8 * Math.PI / 6) * 4.4)}" stroke="#1d1d1d" stroke-width=".5" stroke-linecap="round"/>`;
  k += `<line x1="0" y1="0" x2="${r(Math.sin(2.4) * 4.6)}" y2="${r(-Math.cos(2.4) * 4.6)}" stroke="#c8102e" stroke-width=".25"/><circle r=".5" fill="#c8102e"/>`;
  k += `<path d="M-4 -4.2 A5.9 5.9 0 0 1 3 -5.1" stroke="#fff" stroke-width=".7" opacity=".7" fill="none"/>`;
  S.teil({ id: "uhr", de: "die Uhr", syl: "UHR", it: "l'orologio", itSyl: "o-ro-LO-gio", en: "clock", x: 29, y: 33, kunst: k });
}

/* =====================================================================
   2 — DER WEGWEISER (Leitsystem-Tafel) mit Lupe: die drei Ämter + Frist
   ===================================================================== */
const WW = { x0: WX(-3.07), x1: WX(-1.12), y0: WY(2.44), y1: WY(1.2) };
{
  const { x0, x1, y0, y1 } = WW, w = x1 - x0, h = y1 - y0;
  let k = schatten((x0 + x1) / 2, y1 + 1, w / 2, 1.2, 0.18);
  k += `<rect x="${x0 - 0.8}" y="${y0 - 0.8}" width="${r(w + 1.6)}" height="${r(h + 1.6)}" rx="1.4" fill="#9aa1a8"/>`;
  k += `<rect x="${x0}" y="${y0}" width="${r(w)}" height="${r(h)}" rx="1" fill="${S.lg("tafel", [[0, "#353c44"], [1, "#262b31"]])}"/>`;
  /* Kopf */
  k += `<rect x="${x0}" y="${y0}" width="${r(w)}" height="8.2" rx="1" fill="${SEEBLAU}"/>`;
  k += T(x0 + 3, y0 + 4.2, 3.4, "Anmelden im Dreiländereck", "#fff", 'font-weight="bold"');
  k += T(x0 + 3, y0 + 7.1, 2, "Wohnsitz melden · Wegweiser zu den Ämtern", "#cfe3ee");
  /* Spaltenköpfe */
  const fx = x1 - 15;
  k += T(x0 + 13, y0 + 11.6, 2, "AMT", "#9fb3c2", 'letter-spacing=".3"') + T(fx + 7.5, y0 + 11.6, 2, "FRIST", "#9fb3c2", 'text-anchor="middle" letter-spacing=".3"');
  k += `<line x1="${fx - 1.5}" y1="${y0 + 9.4}" x2="${fx - 1.5}" y2="${y1 - 2}" stroke="#4d5660" stroke-width=".35"/>`;
  /* drei Zeilen: Flagge, Pfeil, Amt + Ort, Frist */
  const zeilen = [
    ["de", "Bürgeramt", "Konstanz (D)", "2 Wochen", "←"],
    ["at", "Meldeamt", "Bregenz (A)", "3 Tage", "↑"],
    ["ch", "Einwohnerkontrolle", "Kreuzlingen (CH)", "14 Tage", "→"],
  ];
  const zh = (h - 15) / 3;
  zeilen.forEach(([land, amt, ort, frist, pf], i) => {
    const y = y0 + 13 + i * zh;
    if (i) k += `<line x1="${x0 + 2}" y1="${r(y - 0.6)}" x2="${x1 - 2}" y2="${r(y - 0.6)}" stroke="#4d5660" stroke-width=".3"/>`;
    /* Flagge klein */
    const fy = y + 1.6, fxx = x0 + 2.6;
    if (land === "de") k += `<rect x="${fxx}" y="${r(fy)}" width="7" height="1.6" fill="#111"/><rect x="${fxx}" y="${r(fy + 1.6)}" width="7" height="1.6" fill="#d00"/><rect x="${fxx}" y="${r(fy + 3.2)}" width="7" height="1.6" fill="#ffce00"/>`;
    if (land === "at") k += `<rect x="${fxx}" y="${r(fy)}" width="7" height="4.8" fill="#ed2939"/><rect x="${fxx}" y="${r(fy + 1.6)}" width="7" height="1.6" fill="#fff"/>`;
    if (land === "ch") k += `<rect x="${fxx + 1.1}" y="${r(fy)}" width="4.8" height="4.8" fill="#d52b1e"/><rect x="${fxx + 3.1}" y="${r(fy + 0.9)}" width=".9" height="3" fill="#fff"/><rect x="${fxx + 2.1}" y="${r(fy + 1.95)}" width="3" height=".9" fill="#fff"/>`;
    k += T(x0 + 13, y + 3.9, amt.length > 12 ? 2.7 : 3.1, amt, "#fff", 'font-weight="bold"');
    k += T(x0 + 13, y + 6.9, 2.1, ort, "#b9c6d0");
    /* Pfeil im weißen Feld (Leitsystem) */
    k += `<rect x="${fx - 9.4}" y="${r(y + 1.4)}" width="6" height="5.2" rx=".6" fill="#fff"/>` + T(fx - 6.4, y + 5.4, 4.2, pf, ANTHRA, 'text-anchor="middle" font-weight="bold"');
    k += T(fx + 7.5, y + 5.2, 2.6, frist, "#ffd166", 'text-anchor="middle" font-weight="bold"');
  });
  /* Wandhalter */
  for (const x of [x0 + 1.3, x1 - 1.3]) k += `<circle cx="${x}" cy="${y0 + 1.3}" r=".55" fill="#c9cfd4"/>`;
  const unter = [
    ["wg_buergeramt", "das Bürgeramt", "BÜR-ger-amt", "l'ufficio anagrafe", "uf-FI-cio a-NA-gra-fe", "citizens' office", "In Deutschland meldet man sich beim Bürgeramt an."],
    ["wg_meldeamt", "das Meldeamt", "MEL-de-amt", "l'ufficio di registrazione", "uf-FI-cio di re-gi-stra-ZIO-ne", "registration office", "In Österreich heißt es Meldeamt oder Meldeservice."],
    ["wg_einwohnerkontrolle", "die Einwohnerkontrolle", "EIN-woh-ner-kon-trol-le", "il controllo abitanti", "con-TROL-lo a-bi-TAN-ti", "residents' registry office", "In der Schweiz meldet man sich bei der Einwohnerkontrolle der Gemeinde an."],
  ].map(([id, de, syl, it, itSyl, en, tipp], i) => ({ id, de, syl, it, itSyl, en, tipp, x: r((x0 + fx - 10) / 2), y: r(y0 + 13 + (i + 1) * zh - 0.6),
    kunst: flaeche(-(fx - 10 - x0) / 2 + 0.6, -zh + 0.6, fx - 10 - x0 - 1.2, zh - 1) }));
  unter.push({ id: "wg_frist", de: "die Frist", syl: "FRIST", it: "il termine", itSyl: "TER-mi-ne", en: "deadline", x: r(fx + 6), y: r(y1 - 2),
    tipp: "Deutschland: 2 Wochen. Österreich: 3 Tage. Schweiz: meist 14 Tage.", kunst: flaeche(-7.6, -(y1 - 2 - y0 - 9.6), 15.2, y1 - 2 - y0 - 9.6) });
  const ax = (x0 + x1) / 2, ay = y1;
  S.teil({ id: "wegweiser", de: "der Wegweiser", syl: "WEG-wei-ser", it: "il cartello indicatore", itSyl: "car-TEL-lo in-di-ca-TO-re", en: "signpost", x: ax, y: ay, kunst: um(ax, ay, k),
    zoom: { x: r(x0 - 3), y: r(y0 - 2), w: r(w + 6), h: r((w + 6) / 1.5) },
    unter: unter.map((u) => u),
    tipp: "Der Wegweiser zeigt, welches Amt in welchem Land zuständig ist." });
}

/* =====================================================================
   3 — DAS SCHILD der Infostelle (über der Theke)
   ===================================================================== */
{
  const x0 = WX(0.95), x1 = WX(3.65), y0 = WY(2.88), y1 = WY(2.56);
  let k = `<rect x="${x0}" y="${y0}" width="${r(x1 - x0)}" height="${r(y1 - y0)}" rx="1" fill="${S.lg("schild", [[0, "#ffffff"], [1, "#eef1f3"]])}" stroke="#c9cfd4" stroke-width=".4"/>`;
  /* Logo: Wellen des Sees */
  k += `<circle cx="${x0 + 6.4}" cy="${r((y0 + y1) / 2)}" r="4" fill="${SEEBLAU}"/>`;
  for (const d of [-1, 0.6, 2.2]) k += `<path d="M${x0 + 3.4} ${r((y0 + y1) / 2 + d)} q1.5 -1 3 0 t3 0" stroke="#fff" stroke-width=".55" fill="none"/>`;
  k += T(x0 + 13, y0 + 6, 5, "Infostelle Bodensee", SEEBLAU, 'font-weight="bold"');
  k += T(x0 + 13, y0 + 10.2, 2.3, "Grenzgänger-Beratung · Wohnen &amp; Arbeiten in D · A · CH", "#5b6670");
  const ax = (x0 + x1) / 2, ay = y1;
  S.teil({ id: "schild", de: "das Schild", syl: "SCHILD", it: "l'insegna", itSyl: "in-SE-gna", en: "sign", x: ax, y: ay, kunst: um(ax, ay, k) });
}

/* =====================================================================
   4 — DER SCHAUKASTEN mit Musterdokumenten (Lupe)
   ===================================================================== */
const SK = { x0: WX(0.95), x1: WX(2.08), y0: WY(2.44), y1: WY(1.76) };
{
  const { x0, x1, y0, y1 } = SK, w = x1 - x0, h = y1 - y0;
  let k = `<rect x="${x0}" y="${y0}" width="${r(w)}" height="${r(h)}" rx=".8" fill="${STAHL}"/>`;
  k += `<rect x="${x0 + 1.2}" y="${y0 + 1.2}" width="${r(w - 2.4)}" height="${r(h - 2.4)}" fill="${S.lg("filz", [[0, "#3e5566"], [1, "#2f4352"]])}"/>`;
  k += T((x0 + x1) / 2, y0 + 4, 2.2, "MUSTER · Was brauche ich?", "#e9f1f5", 'text-anchor="middle" font-weight="bold" letter-spacing=".2"');
  const U = [];
  /* Meldebescheinigung (D): A4, weiß */
  {
    const bx = x0 + 3, by = y0 + 6, bw = 11, bh = 15.5;
    k += `<rect x="${bx + 0.4}" y="${by + 0.4}" width="${bw}" height="${bh}" fill="#000" opacity=".25"/><rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="#fbfbf8"/>`;
    k += `<rect x="${bx + 1}" y="${by + 1}" width="2.2" height="2.6" fill="#555" opacity=".7"/>` + T(bx + 4, by + 2.6, 1.15, "Stadt Konstanz", "#333");
    k += T(bx + bw / 2, by + 5.4, 1.08, "Meldebescheinigung", "#111", 'text-anchor="middle" font-weight="bold"');
    for (let i = 0; i < 6; i++) k += `<rect x="${bx + 1.2}" y="${r(by + 7 + i * 1.2)}" width="${r(bw - 2.4 - (i % 3) * 1.5)}" height=".35" fill="#9aa0a6"/>`;
    k += `<circle cx="${bx + bw - 3}" cy="${by + bh - 2.4}" r="1.6" fill="none" stroke="#3a5aa8" stroke-width=".35" opacity=".8"/>`;
    k += `<circle cx="${bx + bw / 2}" cy="${by - 0.2}" r=".6" fill="#c8102e"/>`;
    U.push({ id: "wg_meldebescheinigung", de: "die Meldebescheinigung", syl: "MEL-de-be-schei-ni-gung", it: "il certificato di residenza", itSyl: "cer-ti-FI-ca-to di re-si-DEN-za", en: "registration certificate",
      tipp: "Nach der Anmeldung bekommt man die Meldebescheinigung – man braucht sie oft, z. B. für die Bank.", x: bx + bw / 2, y: by + bh, kunst: flaeche(-bw / 2 - 0.4, -bh - 0.8, bw + 0.8, bh + 1.2) });
  }
  /* Heimatschein (CH): beige Urkunde mit Schweizerkreuz */
  {
    const bx = x0 + 16, by = y0 + 6, bw = 11, bh = 15.5;
    k += `<rect x="${bx + 0.4}" y="${by + 0.4}" width="${bw}" height="${bh}" fill="#000" opacity=".25"/><rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="${S.lg("urkunde", [[0, "#f6ecd2"], [1, "#eadbb6"]])}"/>`;
    k += `<rect x="${bx + 0.6}" y="${by + 0.6}" width="${bw - 1.2}" height="${bh - 1.2}" fill="none" stroke="#b08a4a" stroke-width=".3"/>`;
    k += `<rect x="${bx + bw / 2 - 1.8}" y="${by + 1.6}" width="3.6" height="3.6" fill="#d52b1e"/><rect x="${bx + bw / 2 - 0.35}" y="${by + 2.3}" width=".7" height="2.2" fill="#fff"/><rect x="${bx + bw / 2 - 1.1}" y="${by + 3.05}" width="2.2" height=".7" fill="#fff"/>`;
    k += T(bx + bw / 2, by + 7.4, 1.12, "HEIMATSCHEIN", "#5a3d16", 'text-anchor="middle" font-weight="bold" font-family="Georgia,serif"');
    for (let i = 0; i < 4; i++) k += `<rect x="${bx + 1.4}" y="${r(by + 8.8 + i * 1.3)}" width="${r(bw - 2.8 - (i % 2) * 2)}" height=".3" fill="#9c8558"/>`;
    k += `<circle cx="${bx + 3}" cy="${by + bh - 2.2}" r="1.5" fill="#c43a2c" opacity=".75"/>`;
    k += `<circle cx="${bx + bw / 2}" cy="${by - 0.2}" r=".6" fill="#c8102e"/>`;
    U.push({ id: "wg_heimatschein", de: "der Heimatschein", syl: "HEI-mat-schein", it: "l'atto di origine", itSyl: "AT-to di o-RI-gi-ne", en: "certificate of origin",
      tipp: "Schweizer geben den Heimatschein bei der Einwohnerkontrolle ihres Wohnorts ab.", x: bx + bw / 2, y: by + bh, kunst: flaeche(-bw / 2 - 0.4, -bh - 0.8, bw + 0.8, bh + 1.2) });
  }
  /* Ausländerausweis (CH): Karte im Kreditkartenformat */
  {
    const bx = x0 + 29.4, by = y0 + 9.5, bw = 10.6, bh = 6.8;
    k += `<rect x="${bx + 0.3}" y="${by + 0.4}" width="${bw}" height="${bh}" rx=".8" fill="#000" opacity=".3"/>`;
    k += `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx=".8" fill="${S.lg("ausweis", [[0, "#e7eef3"], [0.5, "#cfdde8"], [1, "#e0d9ea"]], 0, 0, 1, 1)}"/>`;
    k += `<rect x="${bx}" y="${by}" width="${bw}" height="1.6" rx=".6" fill="#d52b1e"/><rect x="${bx + 0.8}" y="${by + 0.35}" width=".9" height=".9" fill="#fff"/>`;
    k += T(bx + 2.2, by + 1.25, 0.95, "AUSLÄNDERAUSWEIS  B", "#fff", 'font-weight="bold"');
    k += `<rect x="${bx + 0.8}" y="${by + 2.3}" width="3" height="3.8" rx=".3" fill="#b8c2cc"/><circle cx="${bx + 2.3}" cy="${by + 3.6}" r=".9" fill="#7b6a5c"/><path d="M${bx + 0.9} ${by + 6} q1.4 -2 2.8 0 Z" fill="#46596b"/>`;
    for (let i = 0; i < 4; i++) k += `<rect x="${bx + 4.6}" y="${r(by + 2.7 + i * 0.95)}" width="${r(5 - (i % 2) * 1.4)}" height=".35" fill="#6b7682"/>`;
    k += `<circle cx="${bx + bw / 2}" cy="${by - 0.2}" r=".6" fill="#c8102e"/>`;
    k += T(bx + bw / 2, by + bh + 3.6, 1.25, "Ausweis G = Grenzgänger", "#cfdde8", 'text-anchor="middle"');
    U.push({ id: "wg_auslaenderausweis", de: "der Ausländerausweis", syl: "AUS-län-der-aus-weis", it: "il permesso per stranieri", itSyl: "per-MES-so per stra-NIE-ri", en: "residence permit card",
      tipp: "In der Schweiz bekommen Ausländer einen Ausländerausweis, z. B. den Ausweis B.", x: bx + bw / 2, y: by + bh, kunst: flaeche(-bw / 2 - 0.6, -bh - 1, bw + 1.2, bh + 5.2) });
  }
  /* Schloss am Rahmen */
  k += `<rect x="${x1 - 2.2}" y="${r((y0 + y1) / 2 - 1)}" width="1" height="2" rx=".3" fill="#6b737a"/>`;
  const ax = (x0 + x1) / 2, ay = y1;
  S.teil({ id: "schaukasten", de: "der Schaukasten", syl: "SCHAU-kas-ten", it: "la bacheca", itSyl: "ba-CHE-ca", en: "display case", x: ax, y: ay, kunst: um(ax, ay, k),
    zoom: { x: r(x0 - 3), y: r(y0 - 2.5), w: r(w + 6), h: r((w + 6) / 1.5) },
    unter: U.map((u) => Object.assign(u, { x: r(u.x), y: r(u.y) })),
    tipp: "Im Schaukasten hängen Muster: So sehen die Dokumente aus." });
  S.davor(`<path d="M${x0 + 4} ${y1 - 1.2} L${x0 + 12} ${y0 + 1.2} L${x0 + 16} ${y0 + 1.2} L${x0 + 8} ${y1 - 1.2} Z" fill="#fff" opacity=".14"/><path d="M${x1 - 12} ${y1 - 1.2} L${x1 - 6} ${y0 + 1.2} L${x1 - 4.4} ${y0 + 1.2} L${x1 - 10.4} ${y1 - 1.2} Z" fill="#fff" opacity=".1"/>`);
}

/* =====================================================================
   5 — DIE LANDKARTE vom Bodensee (Rückwand rechts)
   ===================================================================== */
{
  const x0 = WX(2.25), x1 = WX(3.66), y0 = WY(2.44), y1 = WY(1.72), w = x1 - x0, h = y1 - y0;
  let k = `<rect x="${x0 - 0.8}" y="${y0 - 0.8}" width="${r(w + 1.6)}" height="${r(h + 1.6)}" fill="#3a3f45"/>`;
  k += `<rect x="${x0}" y="${y0}" width="${r(w)}" height="${r(h)}" fill="${S.lg("land", [[0, "#e7ecd6"], [1, "#d9e2c4"]])}"/>`;
  /* Grenzen: D oben, CH unten links, A rechts unten */
  const X = (u) => r(x0 + u * w), Y = (v) => r(y0 + v * h);
  k += `<path d="M${X(0)} ${Y(0.62)} L${X(0.18)} ${Y(0.66)} L${X(0.64)} ${Y(0.82)} L${X(0.72)} ${Y(0.7)} L${X(0.8)} ${Y(0.62)} L${X(1)} ${Y(0.6)} L${X(1)} ${Y(1)} L${X(0)} ${Y(1)} Z" fill="#f3dcdc" opacity=".9"/>`;
  k += `<path d="M${X(0.72)} ${Y(0.7)} L${X(0.8)} ${Y(0.62)} L${X(1)} ${Y(0.6)} L${X(1)} ${Y(1)} L${X(0.66)} ${Y(1)} L${X(0.64)} ${Y(0.82)} Z" fill="#f6ecc9"/>`;
  /* der See: Obersee mit Überlinger See und Untersee */
  k += `<path d="M${X(0.2)} ${Y(0.5)} Q${X(0.32)} ${Y(0.36)} ${X(0.46)} ${Y(0.38)} Q${X(0.62)} ${Y(0.4)} ${X(0.78)} ${Y(0.5)} Q${X(0.84)} ${Y(0.6)} ${X(0.76)} ${Y(0.66)} Q${X(0.6)} ${Y(0.72)} ${X(0.42)} ${Y(0.62)} Q${X(0.3)} ${Y(0.58)} ${X(0.2)} ${Y(0.5)} Z" fill="${S.lg("see", [[0, "#7fb6d6"], [1, "#4f93bd"]])}"/>`;
  k += `<path d="M${X(0.36)} ${Y(0.42)} Q${X(0.26)} ${Y(0.3)} ${X(0.16)} ${Y(0.26)} L${X(0.18)} ${Y(0.32)} Q${X(0.27)} ${Y(0.37)} ${X(0.33)} ${Y(0.46)} Z" fill="#5f9fc7"/>`;
  k += `<path d="M${X(0.25)} ${Y(0.54)} Q${X(0.15)} ${Y(0.56)} ${X(0.05)} ${Y(0.5)} L${X(0.06)} ${Y(0.55)} Q${X(0.16)} ${Y(0.61)} ${X(0.26)} ${Y(0.58)} Z" fill="#5f9fc7"/>`;
  k += `<path d="M${X(0)} ${Y(0.62)} L${X(0.18)} ${Y(0.66)} L${X(0.64)} ${Y(0.82)} L${X(0.72)} ${Y(0.7)} L${X(0.8)} ${Y(0.62)} L${X(1)} ${Y(0.6)}" stroke="#a03a3a" stroke-width=".35" stroke-dasharray="1 .6" fill="none"/>`;
  k += `<path d="M${X(0.72)} ${Y(0.7)} L${X(0.66)} ${Y(1)}" stroke="#a03a3a" stroke-width=".35" stroke-dasharray="1 .6" fill="none"/>`;
  for (const [u, v, n] of [[0.33, 0.58, "Konstanz"], [0.85, 0.66, "Bregenz"], [0.3, 0.73, "Kreuzlingen"], [0.62, 0.36, "Friedrichshafen"]]) k += `<circle cx="${X(u)}" cy="${Y(v)}" r=".7" fill="#c8102e"/>` + T(X(u) + 1.1, Y(v) + 0.6, 1.5, n, "#2b2b2b");
  for (const [u, v, n] of [[0.1, 0.16, "DEUTSCHLAND"], [0.12, 0.93, "SCHWEIZ"], [0.74, 0.93, "ÖSTERREICH"]]) k += T(X(u), Y(v), 1.8, n, "#6a6a6a", 'font-weight="bold" letter-spacing=".3"');
  k += T(X(0.04), Y(0.08), 2, "Bodensee", SEEBLAU, 'font-weight="bold" font-style="italic"');
  k += `<path d="M${x0} ${y0} L${x0 + 9} ${y0} L${x0} ${y0 + 14} Z" fill="#fff" opacity=".12"/>`;
  const ax = (x0 + x1) / 2, ay = y1;
  S.teil({ id: "landkarte", de: "die Landkarte", syl: "LAND-kar-te", it: "la carta geografica", itSyl: "CAR-ta ge-o-GRA-fi-ca", en: "map", x: ax, y: ay, kunst: um(ax, ay, k),
    tipp: "Am Bodensee treffen sich Deutschland, Österreich und die Schweiz." });
}

/* =====================================================================
   6 — DER FORMULARSTÄNDER (links an der Wand) mit Lupe
   ===================================================================== */
{
  const X0 = -3.62, X1 = -3.12, z = 0.3, H1 = 1.52;
  const [ax, ay] = P((X0 + X1) / 2, 0, z);
  const s = sk(z);
  let k = schatten(ax, ay, 12, 1.2, 0.25);
  const [lx, ty] = P(X0, H1, z), [rx] = P(X1, H1, z);
  const w = rx - lx;
  /* Fuß und Rahmen aus Aluminium */
  k += `<rect x="${r(lx + 1)}" y="${r(ay - 1.4)}" width="${r(w - 2)}" height="1.4" rx=".5" fill="#8f979e"/>`;
  k += `<rect x="${r(lx)}" y="${r(ty)}" width="${r(w)}" height="${r(ay - ty - 1.2)}" rx=".6" fill="${S.lg("staender", [[0, "#cfd5da"], [1, "#aeb6bd"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${r(lx + 0.9)}" y="${r(ty + 0.9)}" width="${r(w - 1.8)}" height="${r(ay - ty - 3)}" fill="#e3e7ea"/>`;
  /* Fächer: 4 Reihen × 2 Spalten, schräge Acryl-Taschen */
  const reihen = 4, fh = (ay - ty - 6) / reihen, fw = (w - 2.4) / 2;
  const inhalt = [["form", "#ffffff", "Wohnungs-geber"], ["form", "#fff7f7", "Melde-zettel"], ["pro", "#2f7db3"], ["pro", "#e07b3a"], ["pro", "#4f9a5a"], ["pro", "#c8102e"], ["pro", "#7b5ea7"], ["pro", "#f0c419"]];
  const U = [];
  inhalt.forEach(([art, f, t], i) => {
    const c = i % 2, rr = Math.floor(i / 2);
    const x = lx + 1.2 + c * fw, y = ty + 1.6 + rr * fh;
    /* Blätter in der Tasche, oben herausschauend */
    k += `<rect x="${r(x + 0.8)}" y="${r(y)}" width="${r(fw - 1.8)}" height="${r(fh - 1)}" fill="${f}" stroke="#b9bfc5" stroke-width=".2"/>`;
    if (art === "form") {
      k += `<rect x="${r(x + 1.4)}" y="${r(y + 0.7)}" width="${r(fw - 3)}" height=".7" fill="${i ? "#c8102e" : "#333"}"/>`;
      const [a, b] = t.split("-");
      k += T(x + fw / 2 - 0.1, y + 2.6, 1.05, a, "#222", 'text-anchor="middle" font-weight="bold"') + T(x + fw / 2 - 0.1, y + 3.7, 1.05, b, "#222", 'text-anchor="middle" font-weight="bold"');
      for (let j = 0; j < 3; j++) k += `<rect x="${r(x + 1.4)}" y="${r(y + 4.5 + j * 0.9)}" width="${r(fw - 3.2)}" height=".25" fill="#9aa0a6"/>`;
    } else {
      k += `<rect x="${r(x + 0.8)}" y="${r(y)}" width="${r(fw - 1.8)}" height="2.2" fill="#fff" opacity=".35"/><circle cx="${r(x + fw / 2)}" cy="${r(y + 4.2)}" r="1.3" fill="#fff" opacity=".7"/>`;
    }
    /* Acryltasche davor (untere Hälfte) */
    k += `<rect x="${r(x + 0.4)}" y="${r(y + fh * 0.45)}" width="${r(fw - 1)}" height="${r(fh * 0.55)}" fill="#eef6f9" opacity=".55" stroke="#c4d0d6" stroke-width=".25"/>`;
    if (i === 0) U.push({ id: "wg_wohnungsgeberbestaetigung", de: "die Wohnungsgeberbestätigung", syl: "WOH-nungs-ge-ber-be-stä-ti-gung", it: "la conferma del locatore", itSyl: "con-FER-ma del lo-ca-TO-re", en: "landlord's confirmation",
      tipp: "Der Vermieter füllt sie aus. Ohne sie geht die Anmeldung in Deutschland nicht.", x: x + fw / 2, y: y + fh });
    if (i === 1) U.push({ id: "wg_meldezettel", de: "der Meldezettel", syl: "MEL-de-zet-tel", it: "il modulo di registrazione", itSyl: "MO-du-lo di re-gi-stra-ZIO-ne", en: "registration form",
      tipp: "In Österreich meldet man sich mit dem Meldezettel an – innerhalb von drei Tagen.", x: x + fw / 2, y: y + fh });
    if (i === 2) U.push({ id: "prospekt", de: "der Prospekt", syl: "pro-SPEKT", it: "l'opuscolo", itSyl: "o-PU-sco-lo", en: "brochure",
      tipp: "Im Prospekt steht alles Wichtige für Grenzgänger.", x: x + fw, y: y + fh * 3 });
  });
  U.forEach((u, i) => { u.kunst = i < 2 ? flaeche(-fw / 2, -fh + 0.2, fw, fh - 0.4) : flaeche(-fw, -fh * 3 + 0.4, fw * 2, fh * 3 - 0.6); });
  k += T(lx + w / 2, ty - 0.6, 1.3, "Formulare", "#555", 'text-anchor="middle"');
  S.teil({ id: "formularstaender", de: "der Formularständer", syl: "for-mu-LAR-stän-der", it: "l'espositore di moduli", itSyl: "e-spo-si-TO-re di MO-du-li", en: "form rack", x: ax, y: ay, steht: true, kunst: um(ax, ay, k),
    zoom: { x: r(lx - 8), y: r(ty - 2.5), w: r(w + 16), h: r((w + 16) / 1.5) },
    unter: U.map((u) => Object.assign(u, { x: r(u.x), y: r(u.y) })),
    tipp: "Hier liegen Formulare und Prospekte zum Mitnehmen." });
}

/* =====================================================================
   7 — DIE WARTEBANK unter dem Wegweiser
   ===================================================================== */
{
  const X0 = -2.85, X1 = -1.45, z0 = 0.32, z1 = 0.72;
  const [ax, ay] = P((X0 + X1) / 2, 0, z1);
  let k = schatten(ax, ay - 1, 30, 1.6, 0.22);
  /* Traverse und zwei Füße */
  for (const X of [X0 + 0.15, X1 - 0.15]) {
    const a = P(X, 0, (z0 + z1) / 2), b = P(X, 0.4, (z0 + z1) / 2);
    k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#5e656c" stroke-width="1.4"/>`;
    k += poly([P(X - 0.12, 0, z0 + 0.06), P(X + 0.12, 0, z0 + 0.06), P(X + 0.12, 0.02, z1 - 0.04), P(X - 0.12, 0.02, z1 - 0.04)], "#4f555b");
  }
  k += kiste(X0, X1, 0.37, 0.41, z0 + 0.1, z0 + 0.2, { vorn: "#6b737a", deckel: "#848c93" });
  /* drei Sitzschalen aus Buchen-Formholz */
  for (let i = 0; i < 3; i++) {
    const a = X0 + 0.04 + i * 0.47, b = a + 0.43;
    k += kiste(a, b, 0.84, 0.86, z0, z0 + 0.04, { vorn: "#b98d58", deckel: "#cfa36a" });
    k += poly([P(a, 0.44, z0 + 0.04), P(b, 0.44, z0 + 0.04), P(b - 0.01, 0.84, z0), P(a + 0.01, 0.84, z0)], S.lg("lehne", [[0, "#d7ad72"], [1, "#b98d58"]]));
    k += poly([P(a, 0.43, z1), P(b, 0.43, z1), P(b, 0.46, z0 + 0.04), P(a, 0.46, z0 + 0.04)], S.lg("sitz", [[0, "#c79a60"], [1, "#e0b87e"]]));
    k += poly([P(a, 0.41, z1), P(b, 0.41, z1), P(b, 0.43, z1), P(a, 0.43, z1)], "#9b7243");
  }
  S.teil({ id: "wartebank", de: "die Wartebank", syl: "WAR-te-bank", it: "la panca d'attesa", itSyl: "PAN-ca d'at-TE-sa", en: "waiting bench", x: ax, y: ay, steht: true, kunst: um(ax, ay, k) });
}

/* =====================================================================
   8 — DIE PFLANZE (Zimmerpalme im Kübel)
   ===================================================================== */
{
  const X = -1.08, z = 0.42;
  const [ax, ay] = P(X, 0, z), s = sk(z) / S0;
  let k = schatten(0, 0, 7, 1, 0.3);
  k += `<path d="M-5 0 L-5.6 -12 L5.6 -12 L5 0 Z" fill="${S.lg("kuebel", [[0, "#5b5f63"], [0.5, "#3e4246"], [1, "#2c2f32"]], 0, 0, 1, 0)}"/><rect x="-6" y="-13" width="12" height="1.6" rx=".6" fill="#4a4e52"/>`;
  k += `<ellipse cx="0" cy="-12.6" rx="5.3" ry=".9" fill="#3a2b1e"/>`;
  /* Kentiapalme: gebogene Wedel mit Fiedern */
  const wedel = [[-60, 26], [-35, 32], [-12, 36], [8, 35], [30, 31], [55, 26], [-80, 18], [78, 19]];
  wedel.forEach(([a, l], i) => {
    const rad = (a - 90) * Math.PI / 180, ex = Math.cos(rad) * l * 0.62, ey = -12 + Math.sin(rad) * l * 0.95, mx = ex * 0.45, my = -12 + (ey + 12) * 0.75 - 4;
    k += `<path d="M0 -12 Q${r(mx)} ${r(my)} ${r(ex)} ${r(ey)}" stroke="#3f6b2c" stroke-width=".55" fill="none"/>`;
    for (let t = 0.2; t < 1; t += 0.1) {
      const px = (1 - t) * (1 - t) * 0 + 2 * (1 - t) * t * mx + t * t * ex, py = (1 - t) * (1 - t) * -12 + 2 * (1 - t) * t * my + t * t * ey;
      const lf = 4.4 * (1 - t * 0.6);
      k += `<path d="M${r(px)} ${r(py)} l${r(-lf * 0.7)} ${r(lf * 0.75)} M${r(px)} ${r(py)} l${r(lf * 0.7)} ${r(lf * 0.75)}" stroke="${i % 2 ? "#4f8a3a" : "#3e7a32"}" stroke-width=".7" stroke-linecap="round"/>`;
    }
  });
  S.teil({ id: "pflanze", de: "die Pflanze", syl: "PFLAN-ze", it: "la pianta", itSyl: "PIAN-ta", en: "plant", x: ax, y: ay, steht: true, kunst: `<g transform="scale(${r(s * 1.05)})">${k}</g>` });
}

/* =====================================================================
   9 — DIE FAHNEN: Deutschland, Österreich, die Schweiz
   ===================================================================== */
{
  const z = 0.24, s = sk(z);
  const fahne = (land) => {
    /* Stockfahne mit Querstab, Bannerflagge (Hochformat), runder Fuß */
    const bw = 0.34 * s, bh = 0.94 * s, top = -2.22 * s, cl = -bw / 2;
    let k = schatten(0, 0, 7, 1.1, 0.3);
    k += `<ellipse cx="0" cy="-.6" rx="5.6" ry="1.4" fill="${S.lg("fuss", [[0, "#5d646b"], [1, "#2e3338"]])}"/><ellipse cx="0" cy="-1.2" rx="4.6" ry="1" fill="#8f979e"/>`;
    k += `<rect x="-.55" y="${r(top)}" width="1.1" height="${r(-top - 1)}" fill="${S.lg("stange", [[0, "#e7d9b2"], [0.5, "#c9a85a"], [1, "#8d6d2a"]], 0, 0, 1, 0)}"/>`;
    k += `<path d="M0 ${r(top - 4.2)} l1.3 3 l-1.3 1.2 l-1.3 -1.2 Z" fill="#d6b456"/><circle cx="0" cy="${r(top + 0.4)}" r="1" fill="#c9a85a"/>`;
    const qy = top + 2.4;
    k += `<rect x="${r(cl - 1)}" y="${r(qy - 0.5)}" width="${r(bw + 2)}" height="1" rx=".5" fill="#b8954a"/>`;
    /* Tuch mit leichtem Faltenwurf */
    const tuch = `M${r(cl)} ${r(qy)} L${r(cl + bw)} ${r(qy)} L${r(cl + bw + 0.4)} ${r(qy + bh)} Q${r(cl + bw * 0.75)} ${r(qy + bh - 1.4)} ${r(cl + bw / 2)} ${r(qy + bh)} Q${r(cl + bw * 0.25)} ${r(qy + bh + 1.4)} ${r(cl - 0.4)} ${r(qy + bh)} Z`;
    const id = S.id("tuch_" + land);
    S.def(`<clipPath id="${id}"><path d="${tuch}"/></clipPath>`);
    let st = "";
    if (land === "de") ["#111111", "#dd0000", "#ffce00"].forEach((f, i) => { st += `<rect x="${r(cl - 1 + i * (bw + 1.2) / 3)}" y="${r(qy)}" width="${r((bw + 1.2) / 3 + 0.2)}" height="${r(bh + 2)}" fill="${f}"/>`; });
    if (land === "at") ["#ed2939", "#ffffff", "#ed2939"].forEach((f, i) => { st += `<rect x="${r(cl - 1 + i * (bw + 1.2) / 3)}" y="${r(qy)}" width="${r((bw + 1.2) / 3 + 0.2)}" height="${r(bh + 2)}" fill="${f}"/>`; });
    if (land === "ch") {
      st += `<rect x="${r(cl - 1)}" y="${r(qy)}" width="${r(bw + 2)}" height="${r(bh + 2)}" fill="#d52b1e"/>`;
      const cy = qy + bw * 0.62, a = bw * 0.36, b = bw * 0.11;
      st += `<rect x="${r(-b)}" y="${r(cy - a)}" width="${r(2 * b)}" height="${r(2 * a)}" fill="#fff"/><rect x="${r(-a)}" y="${r(cy - b)}" width="${r(2 * a)}" height="${r(2 * b)}" fill="#fff"/>`;
    }
    k += `<g clip-path="url(#${id})">${st}<rect x="${r(cl - 1)}" y="${r(qy)}" width="${r(bw + 2)}" height="${r(bh + 2)}" fill="${FALTEN}"/></g>`;
    k += `<path d="${tuch}" fill="none" stroke="#000" stroke-width=".2" opacity=".35"/>`;
    /* Fransen unten (goldene Fransen sind bei Innenfahnen üblich) */
    k += `<path d="M${r(cl - 0.4)} ${r(qy + bh)} Q${r(cl + bw * 0.25)} ${r(qy + bh + 1.4)} ${r(cl + bw / 2)} ${r(qy + bh)} Q${r(cl + bw * 0.75)} ${r(qy + bh - 1.4)} ${r(cl + bw + 0.4)} ${r(qy + bh)}" stroke="#d6b456" stroke-width=".9" stroke-dasharray=".3 .3" fill="none"/>`;
    return k;
  };
  const daten = [
    ["de", -0.86, "wg_deutschland", "Deutschland", "DEUTSCH-land", "la Germania", "Ger-MA-nia", "Germany", "Schwarz, Rot, Gold – die Fahne von Deutschland."],
    ["at", -0.38, "wg_oesterreich", "Österreich", "Ö-ster-reich", "l'Austria", "AU-stria", "Austria", "Rot, Weiß, Rot – die Fahne von Österreich."],
    ["ch", 0.1, "wg_schweiz", "die Schweiz", "SCHWEIZ", "la Svizzera", "SVIZ-ze-ra", "Switzerland", "Ein weißes Kreuz auf Rot – die Fahne der Schweiz."],
  ];
  for (const [land, X, id, de, syl, it, itSyl, en, tipp] of daten) {
    const [ax, ay] = P(X, 0, z);
    S.teil({ id, de, syl, it, itSyl, en, x: ax, y: ay, steht: true, kunst: fahne(land), tipp });
  }
}

/* =====================================================================
   10 — DIE BERATERIN (steht hinter der Theke, zeigt zum Wegweiser)
   ===================================================================== */
{
  const [ax, ay] = P(2.12, 0, 0.62);
  const m = B.mensch({ id: "b09a_berat", geschlecht: "w", pose: "zeigen", blick: -52, frisur: "dutt", haarfarbe: "dunkelbraun", haut: "mittel", laecheln: true,
    kleidung: { oberteil: { stueck: "bluse", farbe: "#dfe9f0" }, jacke: { stueck: "jacke", farbe: SEEBLAU }, unterteil: { stueck: "hose", farbe: "#2f3035" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" }, zubehoer: { stueck: "brille" } } }, 1.67 * sk(0.62));
  S.teil({ id: "beraterin", de: "die Beraterin", syl: "be-RA-te-rin", it: "la consulente", itSyl: "con-su-LEN-te", en: "adviser", x: ax, y: ay, kunst: m.svg,
    tipp: "Die Beraterin sagt: „Das Bürgeramt ist gleich da links.“" });
}

/* =====================================================================
   11 — DIE INFOTHEKE (Empfangstheke mit erhöhter Ablage)
   ===================================================================== */
const TH = { X0: 0.78, X1: 3.08, z0: 1.02, z1: 1.46, H: 1.08 };
{
  const { X0, X1, z0, z1, H } = TH;
  const [ax, ay] = P((X0 + X1) / 2, 0, z1);
  let k = schatten(ax, ay, 52, 2, 0.22);
  /* Seitenfläche (links sichtbar) */
  k += poly([P(X0, 0, z1), P(X0, 0, z0), P(X0, H - 0.04, z0), P(X0, H - 0.04, z1)], "#c9cdd1");
  /* Front: weißer Mineralwerkstoff, unten Eichen-Sockel */
  k += poly([P(X0, 0.1, z1), P(X1, 0.1, z1), P(X1, H - 0.04, z1), P(X0, H - 0.04, z1)], WEISS_K);
  k += poly([P(X0, 0, z1), P(X1, 0, z1), P(X1, 0.1, z1), P(X0, 0.1, z1)], "#7b6a55");
  /* Eichen-Blende in der Mitte der Front, mit Info-Zeichen */
  k += poly([P(X0 + 0.1, 0.3, z1), P(X1 - 0.1, 0.3, z1), P(X1 - 0.1, 0.62, z1), P(X0 + 0.1, 0.62, z1)], EICHE);
  for (let X = X0 + 0.16; X < X1 - 0.12; X += 0.09) { const a = P(X, 0.31, z1), b = P(X, 0.61, z1); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#a3824f" stroke-width=".3" opacity=".55"/>`; }
  const [ix, iy] = P(X0 + 0.42, 0.78, z1);
  k += `<circle cx="${ix}" cy="${iy}" r="5.4" fill="${SEEBLAU}"/>` + T(ix, iy + 3.2, 8.4, "i", "#fff", 'text-anchor="middle" font-weight="bold" font-family="Georgia,serif"');
  const [tx, ty] = P(X0 + 0.66, 0.74, z1);
  k += T(tx, ty, 4.2, "Information", "#3b4249", 'font-weight="bold"') + T(tx, ty + 4, 2.4, "Informazione · Information", "#6b737a");
  /* Ablage oben: Platte mit Kante, leicht überstehend */
  k += poly([P(X0 - 0.03, H, z1 + 0.04), P(X1, H, z1 + 0.04), P(X1, H, z0), P(X0 - 0.03, H, z0)], S.lg("platte", [[0, "#d9cdb8"], [1, "#efe6d5"]]));
  k += poly([P(X0 - 0.03, H - 0.04, z1 + 0.04), P(X1, H - 0.04, z1 + 0.04), P(X1, H, z1 + 0.04), P(X0 - 0.03, H, z1 + 0.04)], "#a88a5e");
  /* LED-Lichtband unter der Ablage */
  k += poly([P(X0, H - 0.04, z1), P(X1, H - 0.04, z1), P(X1, H - 0.1, z1), P(X0, H - 0.1, z1)], S.lg("led", [[0, "#fff4d0", 0.7], [1, "#fff4d0", 0]]));
  S.teil({ id: "infotheke", de: "die Infotheke", syl: "IN-fo-the-ke", it: "il banco informazioni", itSyl: "BAN-co in-for-ma-ZIO-ni", en: "information desk", x: ax, y: ay, steht: true, kunst: um(ax, ay, k),
    tipp: "An der Infotheke bekommt man Auskunft – auf Deutsch, Italienisch oder Englisch." });
}

/* =====================================================================
   12 — AUF DER THEKE: Bildschirm, Stempel, Checkliste
   ===================================================================== */
{
  /* Bildschirm (zur Beraterin gedreht: wir sehen ihn schräg von hinten-links) */
  const [ax, ay] = P(2.78, TH.H, 1.18);
  let k = schatten(0, 0, 7, .8, .3);
  k += `<ellipse cx="0" cy="-.5" rx="4.4" ry=".9" fill="#2a2e33"/><rect x="-.8" y="-6" width="1.6" height="5.6" fill="#3a3f45"/>`;
  k += `<path d="M-9 -22 L8 -23.5 L8.6 -6.6 L-8.6 -5.6 Z" fill="#1c1f23"/>`;
  k += `<path d="M-8 -21 L7 -22.3 L7.5 -7.6 L-7.6 -6.7 Z" fill="${S.lg("bild", [[0, "#cfe3ee"], [1, "#9cc3d9"]])}"/>`;
  k += `<path d="M-8 -21 L7 -22.3 L7.1 -19.6 L-8 -18.4 Z" fill="${SEEBLAU}"/>`;
  for (let i = 0; i < 4; i++) k += `<path d="M-6.6 ${r(-16 + i * 2.2)} L${r(3 - (i % 2) * 3)} ${r(-16.7 + i * 2.2)}" stroke="#4f6b80" stroke-width=".55"/>`;
  k += `<path d="M-8 -21 L-3 -21.4 L-7.6 -12 Z" fill="#fff" opacity=".18"/>`;
  S.teil({ oben: true, id: "bildschirm", de: "der Bildschirm", syl: "BILD-schirm", it: "lo schermo", itSyl: "SCHER-mo", en: "screen", x: ax, y: ay, steht: true, kunst: k });
}
{
  /* Stempel mit Stempelkissen */
  const [ax, ay] = P(1.18, TH.H, 1.24);
  let k = schatten(0, 0, 6, .7, .25);
  k += `<rect x="-5.6" y="-1.6" width="6" height="1.6" rx=".4" fill="#2b2f6b"/><rect x="-5.2" y="-1.9" width="5.2" height=".5" rx=".2" fill="#3f4590"/>`;
  k += `<rect x="1.6" y="-2.2" width="3.6" height="2.2" rx=".3" fill="#4a3a2a"/><rect x="2.8" y="-5" width="1.2" height="2.8" fill="#6b5240"/><ellipse cx="3.4" cy="-6" rx="1.6" ry="1.3" fill="${S.rg("knauf", [[0, "#b07d55"], [1, "#5c3b22"]])}"/>`;
  S.teil({ oben: true, id: "stempel", de: "der Stempel", syl: "STEM-pel", it: "il timbro", itSyl: "TIM-bro", en: "stamp", x: ax, y: ay, steht: true, kunst: k + flaeche(-6.4, -8, 12.4, 8.6) });
}
{
  /* Checkliste auf dem Klemmbrett: Unterlagen nachprüfen */
  const [ax, ay] = P(1.62, TH.H, 1.3);
  let k = `<path d="M-6 0 L6 0 L5 -3.2 L-5 -3.2 Z" fill="#8a6a45"/>`;
  k += `<path d="M-5.4 -.3 L5.4 -.3 L4.5 -3 L-4.5 -3 Z" fill="#fbfbf8"/>`;
  k += `<rect x="-1.4" y="-3.6" width="2.8" height=".8" rx=".3" fill="#9aa3aa"/>`;
  for (let i = 0; i < 3; i++) k += `<path d="M${r(-4 + i * 0.3)} ${r(-2.5 + i * 0.75)} l.4 .35 l.7 -.7" stroke="#2f8a3e" stroke-width=".3" fill="none"/><line x1="${r(-2.6 + i * 0.3)}" y1="${r(-2.2 + i * 0.75)}" x2="${r(3.4 - i * 0.2)}" y2="${r(-2.2 + i * 0.75)}" stroke="#777" stroke-width=".22"/>`;
  /* Kugelschreiber daneben */
  k += `<line x1="6.4" y1="-.6" x2="11" y2="-2" stroke="#1f4f8a" stroke-width=".7" stroke-linecap="round"/><line x1="10.2" y1="-1.8" x2="11" y2="-2" stroke="#ddd" stroke-width=".7"/>`;
  S.teil({ oben: true, id: "wg_nachpruefen", de: "nachprüfen", syl: "NACH-prü-fen", it: "verificare", itSyl: "ve-ri-fi-CA-re", en: "to check", x: ax, y: ay, steht: true, kunst: k + flaeche(-6.6, -5, 18, 5.6),
    tipp: "Vor dem Termin alle Unterlagen nachprüfen: Ausweis, Formular, Bestätigung." });
}

/* =====================================================================
   13 — DIE GRENZGÄNGERIN (vorn, wartet an der Theke)
   ===================================================================== */
{
  const [ax, ay] = P(0.38, 0, 1.98);
  const m = B.mensch({ id: "b09a_gg", geschlecht: "w", pose: "kontrapost", blick: 62, frisur: "zopf", haarfarbe: "blond", haut: "hell",
    kleidung: { oberteil: { stueck: "pullover", farbe: "#8a3b4a" }, jacke: { stueck: "mantel", farbe: "#5a6b78" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "stiefel", farbe: "braun" }, zubehoer: { stueck: "tasche", farbe: "braun" } } }, 1.68 * sk(1.98));
  S.teil({ id: "grenzgaengerin", de: "die Grenzgängerin", syl: "GRENZ-gän-ge-rin", it: "la frontaliera", itSyl: "fron-ta-LIE-ra", en: "cross-border commuter", x: ax, y: ay, kunst: m.svg,
    tipp: "Sie wohnt in Konstanz und arbeitet in der Schweiz." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/wegweiser_dach.js"));
console.log(aus);
