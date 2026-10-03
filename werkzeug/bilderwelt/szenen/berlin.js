#!/usr/bin/env node
/* =====================================================================
   BERLIN (FASSUNG 852) — Bilderwelt neu: eine echte Stadtansicht
   ---------------------------------------------------------------------
   RECHERCHE (Berlin.de/visitBerlin, Bauwerksdaten Structurae,
   Bundestag „Reichstagsgebäude“, Stiftung Berliner Mauer):
   - STANDORT: Nordufer der Spree am Hauptbahnhof (Washingtonplatz),
     Blick nach Süden über den Spreebogen. Die echten Richtungen von hier:
     Fernsehturm im Osten (links, 2,7 km), Reichstag im Südosten
     (0,6 km), das Brandenburger Tor knapp dahinter (0,9 km), die
     Siegessäule im Südwesten über den Bäumen des Tiergartens (rechts,
     1,7 km). Weitwinkel-Panorama, die Abstände sind gestaucht.
   - FERNSEHTURM: 368 m; Betonschaft, unten 32 m dick, nach oben schlanker;
     silberne Kugel (32 m) bei gut 200 m mit Fensterband (Aussicht und
     Telecafé) im unteren Teil; darüber Schaft und rot-weiße Antenne.
     Auf den Stahlplatten der Kugel spiegelt die Sonne ein Kreuz.
   - REICHSTAG: Neorenaissance aus hellem Sandstein, vier Ecktürme mit
     Deutschlandfahnen, Westportal mit sechs korinthischen Säulen und
     Giebel, im Fries „DEM DEUTSCHEN VOLKE“; seit 1999 die gläserne Kuppel
     (Foster) mit Rippen, Ringen und Rampen.
   - BRANDENBURGER TOR: 26 m hoch, zwölf dorische Säulen (sechs je Reihe,
     die mittlere Durchfahrt breiter), Attika mit Relief, oben die
     grün patinierte Quadriga (vier Pferde, Viktoria mit Stab, Eisernem
     Kreuz und Adler) — sie blickt nach Osten, von hier sieht man sie von
     hinten. Seitlich die niedrigen Torhäuser.
   - SIEGESSÄULE: 67 m; roter Granitsockel, Säulenhalle mit Mosaik,
     Säule mit drei Ringen aus vergoldeten Kanonenrohren, Aussichts-
     plattform, goldene Viktoria („Goldelse“).
   - VORNE auf der Uferpromenade: Mauersegmente (3,6 m hoch, 1,2 m breit,
     bemalt — solche Original-Segmente stehen in der ganzen Stadt),
     Litfaßsäule (Berliner Erfindung 1855), Gaslaterne, Buddy-Bär,
     Currywurst-Bude (Berliner Erfindung 1949), Fußgängerampel mit dem
     Ost-Ampelmännchen (Hut, gehend), Ausflugsschiff auf der Spree.
   Maßstab: Augenhöhe y = 118 (≈ 3,3 m über der Promenade, man steht an
   der Rampe zum Washingtonplatz). Vorne gilt: Einheiten je Meter =
   (y − 118) · 0,3. Ein Mensch an der Bude (Fuß y 184) ≈ 35 Einheiten.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "berlin", titel: "Berlin", emoji: "🐻", thema: "Deutschland", kuerzel: "b21a", fassung: 852 });
const rnd = zufall(1237);
const r = B.r;
const HOR = 118;
const km = (y) => (y - HOR) * 0.3;   /* Einheiten je Meter auf der Promenade */

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("wolke")}" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="2.2"/></filter>`);
S.def(`<filter id="${S.id("spiegel")}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="1.4 0.5"/></filter>`);
const SAND = S.lg("sand", [[0, "#e4dccb"], [0.5, "#d6ccb6"], [1, "#bfb39a"]]);
const SAND_V = S.lg("sandv", [[0, "#c9bea6"], [0.35, "#e6dece"], [0.7, "#d8ceb9"], [1, "#b9ad94"]], 0, 0, 1, 0);
const SAULE = S.lg("saule", [[0, "#bdb197"], [0.4, "#efe8da"], [0.75, "#d9cfba"], [1, "#a99c80"]], 0, 0, 1, 0);
const STAHL = S.lg("stahl", [[0, "#eef1f3"], [0.45, "#c9cfd4"], [0.55, "#b5bcc2"], [1, "#e1e5e8"]], 0, 0, 1, 0);
const GRUENSPAN = S.lg("gruenspan", [[0, "#7fb09c"], [0.5, "#5b8f7b"], [1, "#3e6b5a"]]);
const GOLD = S.lg("gold", [[0, "#fff1a8"], [0.35, "#f1c74a"], [0.7, "#c8921e"], [1, "#8f6210"]], 0, 0, 1, 1);
const EISEN = S.lg("eisen", [[0, "#2a3631"], [0.45, "#4b5b54"], [1, "#1f2925"]], 0, 0, 1, 0);

/* =====================================================================
   KULISSE — Himmel, ferne Stadt, Ufer gegenüber, Promenade
   ===================================================================== */
S.hinten(`<rect width="320" height="${HOR + 2}" fill="${S.lg("himmel", [[0, "#6f9fd0"], [0.55, "#a9c8e4"], [1, "#e4edf2"]])}"/>`);
S.hinten(`<circle cx="300" cy="18" r="60" fill="${S.rg("sonne", [[0, "#fff8dc", 0.55], [1, "#fff8dc", 0]])}"/>`);
{
  let w = "";
  for (const [x, y, s] of [[34, 26, 1], [120, 16, 0.8], [210, 34, 1.15], [268, 60, 0.7], [150, 52, 0.6]]) {
    w += `<g filter="url(#${S.id("wolke")})" opacity=".92">`;
    for (const [dx, dy, rx, ry] of [[0, 0, 16, 5], [-10, 1.5, 10, 4], [11, 1, 12, 4.5], [-3, -3.5, 9, 5], [6, -4, 7, 4.5]])
      w += `<ellipse cx="${r(x + dx * s)}" cy="${r(y + dy * s)}" rx="${r(rx * s)}" ry="${r(ry * s)}" fill="#fff"/>`;
    w += `<ellipse cx="${x}" cy="${r(y + 3 * s)}" rx="${r(18 * s)}" ry="${r(2.2 * s)}" fill="#dbe4ee"/></g>`;
  }
  S.hinten(w);
}
/* ferne Stadt Mitte im Dunst (links), dahinter nichts als Himmel */
{
  let c = "";
  const dunst = S.lg("dunst", [[0, "#b6c3cf"], [1, "#9fadbb"]]);
  let x = 0;
  while (x < 98) {
    const w = 6 + rnd() * 10, h = 5 + rnd() * 8;
    c += `<rect x="${r(x)}" y="${r(HOR - h)}" width="${r(w + 0.4)}" height="${r(h)}" fill="${dunst}"/>`;
    for (let i = 1; i < h / 2.4; i++) c += `<rect x="${r(x + 0.8)}" y="${r(HOR - h + i * 2.4)}" width="${r(w - 1.6)}" height=".5" fill="#8e9eae" opacity=".45"/>`;
    if (rnd() < 0.4) c += `<path d="M${r(x)} ${r(HOR - h)} L${r(x + w / 2)} ${r(HOR - h - 2.5)} L${r(x + w)} ${r(HOR - h)} Z" fill="#9aa6b2"/>`;
    x += w;
  }
  /* Bundestagsbauten am Spreebogen (Paul-Löbe-Haus): heller Sichtbeton, hohe Glasfugen */
  c += `<rect x="48" y="107" width="44" height="11" fill="${S.lg("beton", [[0, "#e7e4dd"], [1, "#c8c4ba"]])}"/>`;
  for (let i = 0; i < 7; i++) c += `<rect x="${50 + i * 6}" y="108.5" width="3.2" height="9.5" fill="${S.lg("glasfuge", [[0, "#a9c4d6"], [1, "#6d8596"]])}"/>`;
  c += `<rect x="48" y="106.4" width="44" height="1" fill="#f3f1ec"/>`;
  c += `<path d="M86 118 L86 104 Q92 102 98 104 L98 118 Z" fill="#d9d5cc"/><path d="M87 105 Q92 103.4 97 105" stroke="#9ab3c4" stroke-width="1.2" fill="none"/>`;
  S.hinten(c);
}
/* Ufer gegenüber: Rasen und Kaimauer aus Granit */
S.hinten(`<rect x="0" y="${HOR - 0.8}" width="320" height="1.6" fill="#7f9a5c"/><rect x="0" y="${HOR + 0.6}" width="320" height="1.6" fill="${S.lg("kai", [[0, "#cfc8bb"], [1, "#9d968a"]])}"/>`);
/* Uferpromenade: Granitplatten in Fluchtperspektive */
{
  const Y0 = 150;
  let f = `<rect x="0" y="${Y0}" width="320" height="${200 - Y0}" fill="${S.lg("pflaster", [[0, "#bdb8ae"], [1, "#a39d92"]])}"/>`;
  for (let i = -14; i <= 14; i++) f += `<line x1="${r(160 + i * 13.5)}" y1="${Y0}" x2="${r(160 + i * 31)}" y2="200" stroke="#857f75" stroke-width=".35" opacity=".7"/>`;
  for (const y of [153, 157, 162, 168, 175, 183, 192]) f += `<line x1="0" y1="${y}" x2="320" y2="${y}" stroke="#857f75" stroke-width=".35" opacity=".6"/>`;
  for (let i = 0; i < 160; i++) f += `<circle cx="${r(rnd() * 320)}" cy="${r(Y0 + 2 + rnd() * 48)}" r="${r(0.15 + rnd() * 0.3)}" fill="${rnd() < 0.5 ? "#e2ded6" : "#7d776d"}" opacity=".5"/>`;
  /* Kaikante aus Granit */
  f += `<rect x="0" y="${Y0 - 1}" width="320" height="2.6" fill="${S.lg("kante", [[0, "#ddd8ce"], [1, "#9a948a"]])}"/>`;
  f += `<rect x="0" y="${Y0}" width="320" height="50" fill="${S.lg("pflasterlicht", [[0, "#fff", 0.08], [1, "#000", 0.08]], 0, 0, 1, 0)}"/>`;
  S.hinten(f);
}

/* =====================================================================
   1 — DER FERNSEHTURM (links, weit hinten über Mitte)
   ===================================================================== */
{
  const FX = 62, FUSS = 107.2;
  let k = "";
  /* Schaft: unten dick, oben schlank (Betonsichtfläche) */
  k += `<path d="M-4.4 0 L-1.35 -46 L1.35 -46 L4.4 0 Z" fill="${S.lg("schaft", [[0, "#a7aaa8"], [0.35, "#e8e8e3"], [0.7, "#cfd0cb"], [1, "#8e918f"]], 0, 0, 1, 0)}"/>`;
  for (let y = -6; y > -44; y -= 6) k += `<line x1="${r(-4.4 + (-y / 46) * 3.05)}" y1="${y}" x2="${r(4.4 - (-y / 46) * 3.05)}" y2="${y}" stroke="#9a9d99" stroke-width=".18" opacity=".6"/>`;
  /* Schaft über der Kugel und Antenne mit rot-weißen Ringen */
  k += `<rect x="-1.2" y="-67" width="2.4" height="16" fill="${S.lg("schaft2", [[0, "#a7aaa8"], [0.4, "#ecece7"], [1, "#909390"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-1.6" y="-68.4" width="3.2" height="1.6" rx=".3" fill="#c9cbc7"/>`;
  for (let i = 0; i < 12; i++) {
    const y0 = -68.4 - i * 2.6, w = 1.25 - i * 0.07;
    k += `<rect x="${r(-w / 2)}" y="${r(y0 - 2.6)}" width="${r(w)}" height="2.6" fill="${i % 2 ? "#f4f4f2" : "#d2282e"}"/>`;
  }
  k += `<line x1="0" y1="-99.6" x2="0" y2="-101.5" stroke="#d2282e" stroke-width=".35"/>`;
  /* Kugel: silberne Stahlplatten, Fensterband unterhalb des Äquators */
  const KY = -51.5, KR = 5.6;
  k += `<circle cx="0" cy="${KY}" r="${KR}" fill="${S.rg("kugel", [[0, "#ffffff"], [0.35, "#dfe4e8"], [0.75, "#a3abb3"], [1, "#6f7881"]], 0.68, 0.32, 0.8)}"/>`;
  for (const t of [-0.6, -0.2, 0.2, 0.6]) k += `<ellipse cx="0" cy="${KY}" rx="${r(KR * Math.abs(t) + 0.01)}" ry="${KR}" fill="none" stroke="#7f8890" stroke-width=".14" opacity=".7"/>`;
  for (const t of [-0.66, -0.33, 0.33, 0.66]) { const w = KR * Math.sqrt(1 - t * t); k += `<line x1="${r(-w)}" y1="${r(KY + t * KR)}" x2="${r(w)}" y2="${r(KY + t * KR)}" stroke="#7f8890" stroke-width=".14" opacity=".7"/>`; }
  k += `<rect x="-5.5" y="${r(KY + 0.6)}" width="11" height="1.9" fill="#273340"/>`;
  for (let i = -5; i <= 5; i++) k += `<line x1="${i}" y1="${r(KY + 0.6)}" x2="${i}" y2="${r(KY + 2.5)}" stroke="#93a2b0" stroke-width=".15"/>`;
  k += `<rect x="-5.5" y="${r(KY + 0.6)}" width="11" height=".5" fill="#b7d3e8" opacity=".55"/>`;
  k += `<path d="M-5.3 ${r(KY + 1.2)} Q0 ${r(KY + 4.5)} 5.3 ${r(KY + 1.2)}" fill="none" stroke="#8e98a1" stroke-width=".2"/>`;
  /* das Sonnenkreuz auf der Kugel */
  k += `<path d="M2.1 ${r(KY - 4.4)} L2.1 ${r(KY - 0.6)} M0.6 ${r(KY - 3)} L3.6 ${r(KY - 3)}" stroke="#fff" stroke-width=".55" stroke-linecap="round" opacity=".95"/>`;
  k += `<circle cx="2.1" cy="${r(KY - 3)}" r="1.5" fill="#fff" opacity=".35"/>`;
  /* Dunst unten (der Fuß verschwindet hinter den Häusern von Mitte) */
  k += `<rect x="-4.6" y="-14" width="9.2" height="14" fill="${S.lg("fussdunst", [[0, "#b6c3cf", 0], [1, "#b6c3cf", 0.75]])}"/>`;
  S.teil({ id: "fernsehturm", de: "der Fernsehturm", syl: "FERN-seh-turm", it: "la torre della televisione", itSyl: "TOR-re del-la te-le-vi-SIO-ne", en: "TV tower",
    x: FX, y: FUSS, kunst: k, tipp: "Der Fernsehturm ist 368 Meter hoch — das höchste Bauwerk Deutschlands." });
}

/* =====================================================================
   2 — DIE SIEGESSÄULE (rechts, mitten im Tiergarten)
   ===================================================================== */
{
  let k = "";
  /* Granitsockel und Säulenhalle */
  k += `<rect x="-5" y="-4" width="10" height="4" fill="${S.lg("granit", [[0, "#9c4a3c"], [1, "#6a2b22"]])}"/>`;
  k += `<rect x="-4" y="-9.5" width="8" height="5.5" fill="#5a4a3a"/>`;
  k += `<rect x="-3.2" y="-9" width="6.4" height="4.6" fill="${S.lg("mosaik", [[0, "#d8a948"], [1, "#9a6a1e"]])}" opacity=".85"/>`;
  for (let i = 0; i < 7; i++) k += `<rect x="${r(-3.9 + i * 1.25)}" y="-9.5" width=".55" height="5.5" fill="#e6dccb"/>`;
  k += `<rect x="-4.4" y="-10.4" width="8.8" height="1" fill="#d9cfbd"/>`;
  /* Säule mit drei Ringen aus vergoldeten Kanonenrohren */
  k += `<path d="M-1.8 -10.4 L-1.55 -32 L1.55 -32 L1.8 -10.4 Z" fill="${SAULE}"/>`;
  for (const y of [-15, -21, -27]) {
    k += `<rect x="-2.2" y="${y - 1.4}" width="4.4" height="2.8" rx=".4" fill="${GOLD}"/>`;
    for (let i = 0; i < 6; i++) k += `<line x1="${r(-1.9 + i * 0.75)}" y1="${y - 1.2}" x2="${r(-1.9 + i * 0.75)}" y2="${y + 1.2}" stroke="#8f6210" stroke-width=".2"/>`;
    k += `<rect x="-2.2" y="${y + 1.4}" width="4.4" height=".35" fill="#7a5410"/>`;
  }
  for (let y = -12; y > -31; y -= 1.5) if (![-15, -21, -27].some((g) => Math.abs(g - y) < 2)) k += `<line x1="-1.6" y1="${y}" x2="1.6" y2="${y}" stroke="#b0a58e" stroke-width=".12"/>`;
  /* Kapitell und Aussichtsplattform mit Gitter */
  k += `<path d="M-1.6 -32 L-2.6 -33.6 L2.6 -33.6 L1.6 -32 Z" fill="${GOLD}"/><rect x="-2.8" y="-34.3" width="5.6" height=".8" fill="#d0c6b2"/>`;
  k += `<rect x="-2.8" y="-35.4" width="5.6" height="1.1" fill="none" stroke="#3d3b36" stroke-width=".2"/>`;
  k += `<rect x="-1" y="-36.4" width="2" height="2" fill="#d0c6b2"/>`;
  /* die goldene Viktoria mit Flügeln und Lorbeerkranz */
  k += `<path d="M-.7 -36.4 L-.9 -40.2 Q0 -41.6 .9 -40.2 L.7 -36.4 Z" fill="${GOLD}"/>`;
  k += `<path d="M-.4 -40 Q-3.4 -42.6 -3 -45.8 Q-1.6 -43.6 -.2 -41.6 Z" fill="${GOLD}"/><path d="M.4 -40 Q3 -42.4 2.6 -45.4 Q1.4 -43.4 .2 -41.6 Z" fill="${GOLD}"/>`;
  k += `<circle cx="0" cy="-41.6" r=".55" fill="${GOLD}"/><path d="M.4 -40.6 L1.6 -43.6" stroke="#e8b83a" stroke-width=".35"/><circle cx="1.7" cy="-44" r=".55" fill="none" stroke="#e8b83a" stroke-width=".25"/>`;
  k += `<path d="M-.5 -38.6 L-1.7 -36.6" stroke="#d9a630" stroke-width=".3"/>`;
  S.teil({ id: "siegessaeule", de: "die Siegessäule", syl: "SIE-ges-säu-le", it: "la Colonna della Vittoria", itSyl: "co-LON-na del-la vit-TO-ria", en: "Victory Column",
    x: 293, y: 112, kunst: k, tipp: "Oben steht eine goldene Figur. Die Berliner nennen sie „Goldelse“." });
}

/* =====================================================================
   3 — DER TIERGARTEN (Bäume rechts am Horizont)
   ===================================================================== */
{
  let k = "";
  const baum = (x, y, s, c1, c2) => {
    let g = "";
    for (const [dx, dy, rr] of [[0, 0, 4.2], [-3.2, 1.6, 3.2], [3.4, 1.4, 3.4], [-1.2, -2.2, 3], [1.8, -1.6, 3]])
      g += `<circle cx="${r(x + dx * s)}" cy="${r(y + dy * s)}" r="${r(rr * s)}" fill="${rnd() < 0.5 ? c1 : c2}"/>`;
    g += `<circle cx="${r(x + 1.5 * s)}" cy="${r(y - 1.6 * s)}" r="${r(1.6 * s)}" fill="#a9c27e" opacity=".45"/>`;
    return g;
  };
  const T1 = S.rg("baum1", [[0, "#86a861"], [1, "#4d6d3a"]], 0.6, 0.35, 0.7), T2 = S.rg("baum2", [[0, "#78985a"], [1, "#405e33"]], 0.6, 0.35, 0.7);
  for (let x = 204; x < 316; x += 6.5 + rnd() * 3) {
    const nah = Math.abs(x - 293) < 14;
    k += baum(x, 113 - (nah ? 2 : rnd() * 3), 0.85 + rnd() * 0.35, T1, T2);
  }
  k += `<rect x="198" y="114" width="122" height="4" fill="#4d6d3a"/>`;
  S.teil({ id: "tiergarten", de: "der Tiergarten", syl: "TIER-gar-ten", it: "il Tiergarten (il parco)", itSyl: "TIER-gar-ten", en: "Tiergarten park",
    x: 0, y: 0, kunst: k, tipp: "Der Tiergarten ist der große Park mitten in Berlin." });
}

/* =====================================================================
   4 — DAS BRANDENBURGER TOR (hinter dem Reichstag, rechts)
   ===================================================================== */
{
  const TX = 235, TY = 117.6;
  let k = "";
  /* Torhäuser links und rechts (niedriger, mit kleinen Säulenhallen) */
  for (const s of [-1, 1]) {
    const x0 = s < 0 ? -19.5 : 12.6;
    k += `<rect x="${x0}" y="-7" width="6.9" height="7" fill="${SAND}"/><rect x="${x0 - 0.3}" y="-7.8" width="7.5" height="1" fill="#efe8da"/>`;
    for (let i = 0; i < 2; i++) k += `<rect x="${r(x0 + 1.4 + i * 3)}" y="-6.6" width=".9" height="6.6" fill="${SAULE}"/>`;
    k += `<rect x="${r(x0 + 2.4)}" y="-6" width="1.9" height="6" fill="#8f8572" opacity=".55"/>`;
  }
  /* Durchfahrten: Blick auf den Pariser Platz */
  k += `<rect x="-12.4" y="-11" width="24.8" height="11" fill="${S.lg("durchblick", [[0, "#a49b8a"], [1, "#d5ccba"]])}"/>`;
  k += `<rect x="-12.4" y="-11" width="24.8" height="3" fill="#7f7767" opacity=".5"/>`;
  /* sechs dorische Säulen, die mittlere Durchfahrt ist breiter */
  for (const x of [-11.6, -7.4, -2.9, 2.9, 7.4, 11.6]) {
    k += `<path d="M${r(x - 0.75)} 0 L${r(x - 0.6)} -10.6 L${r(x + 0.6)} -10.6 L${r(x + 0.75)} 0 Z" fill="${SAULE}"/>`;
    k += `<line x1="${r(x - 0.25)}" y1="-10.4" x2="${r(x - 0.25)}" y2="-.2" stroke="#a99c80" stroke-width=".12"/><line x1="${r(x + 0.25)}" y1="-10.4" x2="${r(x + 0.25)}" y2="-.2" stroke="#a99c80" stroke-width=".12"/>`;
    k += `<rect x="${r(x - 0.95)}" y="-11" width="1.9" height=".5" fill="#e9e1d1"/>`;
  }
  k += `<rect x="-13.6" y="-.6" width="27.2" height=".8" fill="#c9bfab"/>`;
  /* Gebälk mit Triglyphen, Gesims */
  k += `<rect x="-12.9" y="-12.4" width="25.8" height="1.5" fill="${SAND}"/>`;
  k += `<rect x="-12.9" y="-14" width="25.8" height="1.6" fill="#ddd4c1"/>`;
  for (let x = -12.4; x < 12.6; x += 1.5) k += `<rect x="${r(x)}" y="-13.8" width=".5" height="1.2" fill="#a99c80"/>`;
  k += `<rect x="-13.4" y="-14.7" width="26.8" height=".8" fill="#f1ebdf"/>`;
  /* Attika in Stufen mit Reliefband */
  k += `<rect x="-12.6" y="-17.4" width="25.2" height="2.7" fill="${SAND}"/>`;
  k += `<rect x="-10.5" y="-16.8" width="21" height="1.5" fill="#cbbfa5"/>`;
  for (let i = 0; i < 14; i++) k += `<ellipse cx="${r(-9.8 + i * 1.5)}" cy="-16" rx=".45" ry=".6" fill="#b3a68b"/>`;
  k += `<rect x="-6.6" y="-19.2" width="13.2" height="1.9" fill="#ddd4c1"/><rect x="-7" y="-19.6" width="14" height=".5" fill="#f1ebdf"/>`;
  /* die Quadriga (von hinten: Viktoria im Wagen, davor die vier Pferde) */
  let q = "";
  for (const [dx, h] of [[-3.4, 0], [-1.2, 0.3], [1.2, 0.3], [3.4, 0]]) {
    q += `<path d="M${r(dx - 1)} -19.6 L${r(dx - 0.9)} -21.6 Q${r(dx - 0.6)} -22.8 ${r(dx + 0.4)} ${r(-23.4 - h)} L${r(dx + 0.9)} ${r(-24.4 - h)} L${r(dx + 1.3)} ${r(-23.2 - h)} Q${r(dx + 1.2)} -22 ${r(dx + 1)} -19.6 Z" fill="${GRUENSPAN}"/>`;
  }
  q += `<path d="M-1.6 -19.6 L-1.4 -21.6 L1.4 -21.6 L1.6 -19.6 Z" fill="#3e6b5a"/><circle cx="-1.5" cy="-20" r=".9" fill="none" stroke="#2f5547" stroke-width=".35"/><circle cx="1.5" cy="-20" r=".9" fill="none" stroke="#2f5547" stroke-width=".35"/>`;
  q += `<path d="M-.6 -21.6 L-.5 -24.4 Q0 -25.3 .5 -24.4 L.6 -21.6 Z" fill="${GRUENSPAN}"/><circle cx="0" cy="-25.1" r=".45" fill="#5b8f7b"/>`;
  q += `<path d="M-.4 -24 Q-2.4 -25 -2.2 -26.6 Q-1 -25.6 -.2 -24.8 Z M.4 -24 Q2.4 -25 2.2 -26.6 Q1 -25.6 .2 -24.8 Z" fill="#4c7f6b"/>`;
  q += `<line x1=".9" y1="-23.4" x2="1.4" y2="-28.6" stroke="#3e6b5a" stroke-width=".25"/><circle cx="1.45" cy="-28.9" r=".55" fill="none" stroke="#3e6b5a" stroke-width=".25"/><path d="M.9 -29.7 L1.45 -30.6 L2 -29.7 Z" fill="#3e6b5a"/>`;
  k += q;
  S.teil({ id: "brandenburgertor", de: "das Brandenburger Tor", syl: "BRAN-den-bur-ger TOR", it: "la Porta di Brandeburgo", itSyl: "POR-ta di bran-de-BUR-go", en: "Brandenburg Gate",
    x: TX, y: TY, kunst: k, tipp: "Das Brandenburger Tor ist das Wahrzeichen Berlins und Symbol der Einheit.",
    zoom: { x: TX - 24, y: TY - 33, w: 48, h: 34 },
    unter: [
      { id: "quadriga", de: "die Quadriga", syl: "qua-DRI-ga", it: "la quadriga", itSyl: "qua-DRI-ga", en: "quadriga", x: TX, y: TY - 19.6, kunst: flaeche(-5, -11.2, 10, 11.4),
        tipp: "Vier Pferde ziehen den Wagen der Siegesgöttin Viktoria." },
      { id: "saeule", de: "die Säule", syl: "SÄU-le", it: "la colonna", itSyl: "co-LON-na", en: "column", x: TX - 7.4, y: TY, kunst: flaeche(-1.2, -11, 2.4, 11, 0.4),
        tipp: "Das Tor hat zwölf Säulen, sechs in jeder Reihe." },
    ] });
}

/* =====================================================================
   5 — DER REICHSTAG (Mitte, jenseits der Spree)
   ===================================================================== */
{
  const RX = 154, RY = 117.6;
  let k = "";
  /* gläserne Kuppel: Rippen, Ringe, Rampen, Spiegelung des Himmels */
  k += `<path d="M-16 -26 C-16 -37 -9 -44.6 0 -44.6 C9 -44.6 16 -37 16 -26 Z" fill="${S.lg("kuppel", [[0, "#dbe8f1"], [0.45, "#9fb6c8"], [0.75, "#c9d9e6"], [1, "#eef4f8"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-12 -28 Q-6 -33 6 -36 M-13.5 -32 Q-2 -38 10 -40" stroke="#6f8597" stroke-width=".7" fill="none" opacity=".55"/>`;
  for (let i = -7; i <= 7; i++) { const x0 = i * 16 / 7.5; k += `<path d="M${r(x0)} -26 Q${r(x0 * 0.98)} -38.5 0 -44.6" stroke="#5d6f7d" stroke-width=".18" fill="none"/>`; }
  for (const t of [0.18, 0.36, 0.54, 0.7, 0.84]) { const y = -26 - t * 18.6, w = 16 * Math.sqrt(1 - t * t); k += `<path d="M${r(-w)} ${r(y)} Q0 ${r(y + 1.1)} ${r(w)} ${r(y)}" stroke="#5d6f7d" stroke-width=".18" fill="none"/>`; }
  k += `<path d="M5 -42 Q12 -38 13.6 -30" stroke="#fff" stroke-width="1.4" opacity=".55" fill="none" stroke-linecap="round"/>`;
  k += `<rect x="-2.4" y="-45.4" width="4.8" height="1" rx=".4" fill="#5d6f7d"/>`;
  k += `<rect x="-17" y="-27" width="34" height="2" fill="#bdb197"/>`;
  /* Mitteltrakt: Sockelgeschoss mit Bossenquadern, Hauptgeschoss mit Fenstern */
  k += `<rect x="-40" y="-22.4" width="80" height="22.4" fill="${SAND}"/>`;
  for (let y = -1.3; y > -8; y -= 1.3) k += `<line x1="-40" y1="${r(y)}" x2="40" y2="${r(y)}" stroke="#a99c80" stroke-width=".18"/>`;
  k += `<rect x="-40" y="-8.4" width="80" height=".8" fill="#ece5d6"/>`;
  const fenster = (x, y, w, h) => `<path d="M${r(x)} ${r(y)} L${r(x)} ${r(y - h + w / 2)} A${r(w / 2)} ${r(w / 2)} 0 0 1 ${r(x + w)} ${r(y - h + w / 2)} L${r(x + w)} ${r(y)} Z" fill="${S.lg("fenster", [[0, "#4a5967"], [1, "#2b3540"]])}"/><path d="M${r(x + 0.3)} ${r(y - h * 0.5)} L${r(x + w - 0.3)} ${r(y - h * 0.5)}" stroke="#9ba6ad" stroke-width=".12"/>`;
  for (const s of [-1, 1]) for (let i = 0; i < 4; i++) {
    const x = s * (19 + i * 5.3) - 1.2;
    k += fenster(x, -9.6, 2.4, 7.4) + fenster(x + 0.2, -2.4, 2, 3.4);
    k += `<rect x="${r(x - 1.4)}" y="-19" width=".7" height="9.6" fill="#e6dece"/>`;
  }
  k += `<rect x="-40" y="-22.4" width="80" height="2.6" fill="#ddd4c1"/><rect x="-40.6" y="-23.2" width="81.2" height="1" fill="#f1ebdf"/>`;
  for (let x = -39; x < 40; x += 1.6) k += `<rect x="${r(x)}" y="-24.8" width=".5" height="1.6" fill="#cfc5b0"/>`;
  k += `<rect x="-40" y="-25.2" width="80" height=".5" fill="#e6dece"/>`;
  /* vier Ecktürme (die vorderen zwei ganz zu sehen) */
  for (const s of [-1, 1]) {
    const x0 = s < 0 ? -54 : 40;
    k += `<rect x="${x0}" y="-31" width="14" height="31" fill="${s < 0 ? SAND : SAND_V}"/>`;
    for (let y = -1.3; y > -8; y -= 1.3) k += `<line x1="${x0}" y1="${r(y)}" x2="${x0 + 14}" y2="${r(y)}" stroke="#a99c80" stroke-width=".18"/>`;
    k += fenster(x0 + 2.4, -9.6, 2.6, 8) + fenster(x0 + 9, -9.6, 2.6, 8);
    k += `<rect x="${x0}" y="-19.6" width="14" height="1.2" fill="#ece5d6"/>`;
    k += fenster(x0 + 4.3, -20.4, 5.4, 8.6);
    for (const dx of [1.4, 2.6, 11.4, 12.6]) k += `<rect x="${r(x0 + dx - 0.35)}" y="-29.2" width=".7" height="8.8" fill="#efe8da"/>`;
    k += `<rect x="${x0 - 0.5}" y="-31" width="15" height="1.8" fill="#f1ebdf"/><rect x="${x0 - 0.2}" y="-32.2" width="14.4" height="1.2" fill="#d6ccb6"/>`;
    for (const dx of [0.6, 13.4]) k += `<path d="M${r(x0 + dx - 0.8)} -32.2 L${r(x0 + dx)} -34.4 L${r(x0 + dx + 0.8)} -32.2 Z" fill="#cfc5b0"/>`;
    /* Fahnenmast und Deutschlandfahne */
    const fx = x0 + 7;
    k += `<line x1="${fx}" y1="-32.2" x2="${fx}" y2="-41.6" stroke="#8a8f94" stroke-width=".35"/><circle cx="${fx}" cy="-41.7" r=".3" fill="#d8c27a"/>`;
    const w = (y) => `M${fx} ${r(y)} q2.2 -.9 3.6 0 t3.4 0`;
    k += `<path d="${w(-41.2)} L${fx + 7} -40 q-1.5 -.9 -3.4 0 t-3.6 0 Z" fill="#1d1d1d"/>`;
    k += `<path d="${w(-40)} L${fx + 7} -38.8 q-1.5 -.9 -3.4 0 t-3.6 0 Z" fill="#dd2a24"/>`;
    k += `<path d="${w(-38.8)} L${fx + 7} -37.6 q-1.5 -.9 -3.4 0 t-3.6 0 Z" fill="#f2c62f"/>`;
  }
  /* Westportal: Treppe, sechs Säulen, Inschrift, Giebel */
  k += `<path d="M-21 0 L21 0 L19 -2.6 L-19 -2.6 Z" fill="#e2dacb"/>`;
  for (let i = 1; i < 4; i++) k += `<line x1="${-21 + i * 0.6}" y1="${r(-i * 0.65)}" x2="${21 - i * 0.6}" y2="${r(-i * 0.65)}" stroke="#b5aa94" stroke-width=".18"/>`;
  k += `<rect x="-16.5" y="-8.4" width="33" height="5.8" fill="${SAND}"/>`;
  k += `<rect x="-15" y="-27" width="30" height="18.6" fill="#6f6857"/>`;
  k += `<path d="M-2.4 -8.4 L-2.4 -15 A2.4 2.4 0 0 1 2.4 -15 L2.4 -8.4 Z" fill="#2f2a22"/>`;
  for (let i = 0; i < 6; i++) {
    const x = -13 + i * 5.2;
    k += `<rect x="${r(x - 1)}" y="-25.8" width="2" height="17.4" fill="${SAULE}"/>`;
    k += `<path d="M${r(x - 1.5)} -25.6 L${r(x + 1.5)} -25.6 L${r(x + 1.2)} -27 L${r(x - 1.2)} -27 Z" fill="#e9e1d1"/><path d="M${r(x - 1.2)} -26.3 q.6 -.6 1.2 0 q.6 -.6 1.2 0" stroke="#b3a68b" stroke-width=".15" fill="none"/>`;
    k += `<rect x="${r(x - 1.3)}" y="-8.9" width="2.6" height=".6" fill="#d9cfbc"/>`;
  }
  k += `<rect x="-16.5" y="-29.6" width="33" height="2.6" fill="#e6dece"/>`;
  k += `<text x="0" y="-27.75" font-size="1.65" text-anchor="middle" fill="#3d3628" font-family="Georgia,'Times New Roman',serif" letter-spacing=".25">DEM DEUTSCHEN VOLKE</text>`;
  k += `<rect x="-17.2" y="-30.4" width="34.4" height=".9" fill="#f1ebdf"/>`;
  k += `<path d="M-17.2 -30.4 L0 -36.6 L17.2 -30.4 Z" fill="#e9e1d1"/><path d="M-14.4 -30.9 L0 -35.6 L14.4 -30.9 Z" fill="#cbbfa5"/>`;
  k += `<path d="M-7 -31.2 q2 -2 4 -1 q2 -1.6 3 0 q1.6 -1.6 3 0 q2 -1 4 1" stroke="#a99c80" stroke-width=".3" fill="none"/>`;
  k += `<path d="M-17.2 -30.4 L0 -36.6 L17.2 -30.4" stroke="#f6f1e7" stroke-width=".5" fill="none"/>`;
  /* Licht von rechts (Nachmittag), Schatten links */
  k += `<rect x="-54" y="-25.2" width="108" height="25.2" fill="${S.lg("rlicht", [[0, "#000", 0.12], [0.5, "#000", 0], [1, "#fff", 0.08]], 0, 0, 1, 0)}"/>`;
  S.teil({ id: "reichstag", de: "der Reichstag", syl: "REICHS-tag", it: "il Reichstag", itSyl: "REICH-stag", en: "Reichstag",
    x: RX, y: RY, kunst: k, tipp: "Im Reichstag arbeitet der Bundestag, das Parlament von Deutschland.",
    zoom: { x: RX - 58, y: RY - 64, w: 116, h: 70 },
    unter: [
      { id: "kuppel", de: "die Kuppel", syl: "KUP-pel", it: "la cupola", itSyl: "CU-po-la", en: "dome", x: RX, y: RY - 26.4, kunst: flaeche(-16, -18.6, 32, 18.4),
        tipp: "Die Kuppel ist aus Glas. Man kann oben auf einer Rampe hinaufgehen." },
      { id: "fahne", de: "die Fahne", syl: "FAH-ne", it: "la bandiera", itSyl: "ban-DIE-ra", en: "flag", x: RX - 47, y: RY - 37.4, kunst: flaeche(-0.6, -4.6, 8, 5),
        tipp: "Die deutsche Fahne ist schwarz, rot und gold." },
      { id: "inschrift", de: "die Inschrift", syl: "IN-schrift", it: "l'iscrizione", itSyl: "i-scri-ZIO-ne", en: "inscription", x: RX, y: RY - 27, kunst: flaeche(-16, -2.6, 32, 2.6, 0.4),
        tipp: "Über dem Eingang steht: „Dem deutschen Volke“." },
    ] });
}

/* =====================================================================
   6 — DIE SPREE (mit Spiegelungen)
   ===================================================================== */
{
  const Y0 = HOR + 2.2, Y1 = 150;
  let k = `<rect x="0" y="${Y0}" width="320" height="${Y1 - Y0}" fill="${S.lg("wasser", [[0, "#9cb4bf"], [0.35, "#6f8e98"], [1, "#3f5d63"]])}"/>`;
  /* Spiegelbilder von Reichstag, Kuppel und Fernsehturm, weich und gewellt */
  k += `<g filter="url(#${S.id("spiegel")})" opacity=".3">`;
  k += `<rect x="100" y="${Y0}" width="108" height="14" fill="#d9cfba"/><rect x="138" y="${Y0 + 14}" width="32" height="7" fill="#d9cfba"/><ellipse cx="154" cy="${Y0 + 22}" rx="12" ry="4" fill="#cfdde8"/>`;
  k += `<rect x="220" y="${Y0}" width="31" height="8" fill="#ddd4c1"/><rect x="58" y="${Y0}" width="8" height="6" fill="#c6c9c6"/>`;
  k += `</g>`;
  for (let i = 0; i < 120; i++) {
    const y = Y0 + 1 + Math.pow(rnd(), 0.8) * (Y1 - Y0 - 2), w = 1.5 + (y - Y0) * 0.22 * rnd() + 1;
    const x = rnd() * 320;
    k += `<path d="M${r(x)} ${r(y)} q${r(w / 2)} -.5 ${r(w)} 0" stroke="${rnd() < 0.6 ? "#e8f1f4" : "#2f4a50"}" stroke-width="${r(0.15 + (y - Y0) * 0.008)}" fill="none" opacity="${r(0.35 + rnd() * 0.35)}"/>`;
  }
  k += `<rect x="0" y="${Y0}" width="320" height="2.5" fill="#000" opacity=".12"/>`;
  S.teil({ id: "spree", de: "die Spree", syl: "SPREE", it: "la Sprea", itSyl: "SPRE-a", en: "River Spree", x: 0, y: 0, kunst: k,
    tipp: "Die Spree fließt mitten durch Berlin." });
}

/* =====================================================================
   7 — DAS AUSFLUGSSCHIFF (Spree-Rundfahrt, fährt nach links)
   ===================================================================== */
{
  let k = schatten(0, 0, 36, 1.4, 0.25);
  /* Bugwelle und Kielwasser */
  k += `<path d="M-38 -.4 q-3 .8 -6 .4 M40 .2 q6 .8 14 .2 M42 1 q8 .6 16 0" stroke="#eef5f7" stroke-width=".5" fill="none" opacity=".8"/>`;
  /* Rumpf: unten dunkelblau, oben weiß, spitzer Bug links */
  k += `<path d="M-38 -5 L36 -5 L37 -1 Q36 .4 34 .4 L-31 .4 Q-35 .2 -38 -5 Z" fill="${S.lg("rumpf", [[0, "#ffffff"], [0.55, "#eef1f3"], [0.56, "#1f3f78"], [1, "#16305e"]])}"/>`;
  k += `<rect x="-35" y="-3.3" width="70" height=".5" fill="#c9302c"/>`;
  /* Salondeck mit Panoramafenstern */
  k += `<path d="M-30 -5 L-27 -10.4 L33 -10.4 L34 -5 Z" fill="#f4f6f7"/>`;
  for (let x = -26; x < 32; x += 4) k += `<rect x="${x}" y="-9.6" width="3.3" height="3.6" rx=".3" fill="${S.lg("salon", [[0, "#7f9cb1"], [1, "#344d61"]])}"/>`;
  k += `<rect x="-27" y="-9.4" width="60" height=".6" fill="#fff" opacity=".35"/>`;
  /* Sonnendeck mit Reling, Gäste, Steuerhaus vorn */
  k += `<rect x="-27.5" y="-11.2" width="61" height=".8" fill="#dfe3e6"/>`;
  k += `<path d="M-26 -11.2 L-26 -13.6 L33 -13.6 L33 -11.2" stroke="#9aa3aa" stroke-width=".3" fill="none"/><line x1="-26" y1="-12.4" x2="33" y2="-12.4" stroke="#9aa3aa" stroke-width=".2"/>`;
  for (let x = -24; x < 33; x += 3) k += `<line x1="${x}" y1="-11.2" x2="${x}" y2="-13.6" stroke="#9aa3aa" stroke-width=".18"/>`;
  for (const [x, c] of [[-4, "#c9302c"], [2, "#2d6fb3"], [9, "#f2c62f"], [15, "#3ca35a"], [22, "#e6e6e6"]]) k += `<circle cx="${x}" cy="-13.2" r=".9" fill="#d9a07a"/><rect x="${x - 1}" y="-12.4" width="2" height="1.6" rx=".6" fill="${c}"/>`;
  k += `<path d="M-23 -11.2 L-22 -16 L-12 -16 L-11 -11.2 Z" fill="#fbfcfc"/><rect x="-21.6" y="-15.2" width="9.4" height="2.4" fill="#2e4658"/><rect x="-23" y="-16.6" width="12" height=".7" fill="#1f3f78"/>`;
  k += `<text x="6" y="-1.4" font-size="2.2" text-anchor="middle" fill="#f2f4f6" font-family="Arial,sans-serif" font-weight="bold" letter-spacing=".2">SPREE-RUNDFAHRT</text>`;
  /* Berliner Flagge am Heck */
  k += `<line x1="35" y1="-5" x2="35" y2="-12" stroke="#8a8f94" stroke-width=".3"/><rect x="35" y="-12" width="4" height="2.6" fill="#d7262b"/><rect x="35" y="-11.3" width="4" height="1.2" fill="#fff"/><circle cx="36.8" cy="-10.7" r=".35" fill="#222"/>`;
  S.teil({ id: "ausflugsschiff", de: "das Ausflugsschiff", syl: "AUS-flugs-schiff", it: "il battello turistico", itSyl: "bat-TEL-lo tu-RI-sti-co", en: "sightseeing boat",
    x: 48, y: 125.5, kunst: `<g transform="scale(.8)">${k}</g>`, tipp: "Mit dem Ausflugsschiff fährt man auf der Spree an den Sehenswürdigkeiten vorbei." });
}

/* =====================================================================
   8 — DIE ENTEN (zwei Stockenten im Wasser)
   ===================================================================== */
{
  let k = "";
  const ente = (x, y, s, erpel) => {
    let g = `<ellipse cx="${x}" cy="${r(y + 0.5 * s)}" rx="${r(3.4 * s)}" ry="${r(0.5 * s)}" fill="#2f4a50" opacity=".4"/>`;
    g += `<path d="M${r(x - 3 * s)} ${y} Q${r(x - 3.2 * s)} ${r(y - 2 * s)} ${r(x - 1 * s)} ${r(y - 2 * s)} L${r(x + 1.6 * s)} ${r(y - 1.8 * s)} Q${r(x + 3 * s)} ${r(y - 1.2 * s)} ${r(x + 2.6 * s)} ${y} Z" fill="${erpel ? "#9a8f86" : "#8a6a48"}"/>`;
    g += `<path d="M${r(x - 2.6 * s)} ${r(y - 1.6 * s)} Q${r(x - 0.4 * s)} ${r(y - 2.6 * s)} ${r(x + 1.4 * s)} ${r(y - 1.4 * s)}" stroke="${erpel ? "#5a4e46" : "#5e4630"}" stroke-width="${r(0.6 * s)}" fill="none"/>`;
    g += `<ellipse cx="${r(x + 2.1 * s)}" cy="${r(y - 3 * s)}" rx="${r(1.1 * s)}" ry="${r(1 * s)}" fill="${erpel ? "#1f6b46" : "#7a5a3a"}"/>`;
    g += `<path d="M${r(x + 2.9 * s)} ${r(y - 3 * s)} l${r(1.3 * s)} ${r(0.25 * s)} l${r(-1.2 * s)} ${r(0.5 * s)} Z" fill="${erpel ? "#e3c13b" : "#c9873a"}"/>`;
    if (erpel) g += `<path d="M${r(x + 1.3 * s)} ${r(y - 2.1 * s)} q.8 .2 1.6 0" stroke="#fff" stroke-width="${r(0.25 * s)}" fill="none"/>`;
    g += `<circle cx="${r(x + 2.4 * s)}" cy="${r(y - 3.2 * s)}" r="${r(0.18 * s)}" fill="#111"/>`;
    return g;
  };
  k += ente(-4, 0, 0.9, true) + ente(5, 1.4, 0.85, false);
  S.teil({ oben: true, id: "ente", de: "die Ente", syl: "EN-te", it: "l'anatra", itSyl: "A-na-tra", en: "duck", x: 186, y: 138, kunst: k });
}

/* =====================================================================
   9 — DAS GELÄNDER an der Kaikante
   ===================================================================== */
{
  let k = "";
  k += `<rect x="0" y="-10.6" width="320" height="1.3" rx=".6" fill="${S.lg("handlauf", [[0, "#6c7a74"], [0.4, "#3c4943"], [1, "#26302c"]])}"/>`;
  k += `<rect x="0" y="-6.2" width="320" height=".45" fill="#2f3a35"/><rect x="0" y="-2.6" width="320" height=".45" fill="#2f3a35"/>`;
  for (let x = 4; x < 320; x += 13) k += `<rect x="${x - 0.5}" y="-10" width="1" height="10" fill="${EISEN}"/><rect x="${x - 0.9}" y="-.8" width="1.8" height=".8" fill="#26302c"/>`;
  k += `<rect x="0" y="-10.5" width="320" height=".35" fill="#a2b0aa" opacity=".6"/>`;
  S.teil({ id: "gelaender", de: "das Geländer", syl: "ge-LÄN-der", it: "la ringhiera", itSyl: "rin-GHIE-ra", en: "railing", x: 0, y: 150, kunst: k });
}

/* =====================================================================
   10 — DIE MAUER (zwei bemalte Original-Segmente, rechts)
   ===================================================================== */
{
  const Y = 167, s = km(Y);   /* 14,7 Einheiten je Meter */
  const W = 1.2 * s, H = 3.6 * s;
  let k = schatten(0, 0.4, W + 4, 1.6, 0.35);
  k += `<rect x="${r(-W - 2)}" y="-1.4" width="${r(2 * W + 4)}" height="1.6" rx=".4" fill="#8f8a80"/>`;
  const BETON = S.lg("mauerbeton", [[0, "#c9c6bf"], [0.5, "#b4b0a8"], [1, "#9a968e"]], 0, 0, 1, 0);
  for (const dx of [-W, 0]) {
    k += `<path d="M${r(dx + 0.3)} -1.2 L${r(dx + 0.3)} ${r(-H + 1.6)} Q${r(dx + 0.3)} ${r(-H)} ${r(dx + 2)} ${r(-H)} L${r(dx + W - 2)} ${r(-H)} Q${r(dx + W - 0.3)} ${r(-H)} ${r(dx + W - 0.3)} ${r(-H + 1.6)} L${r(dx + W - 0.3)} -1.2 Z" fill="${BETON}"/>`;
  }
  /* Graffiti: Farbflächen, Gesicht, Herz, Schriftzug */
  k += `<path d="M${r(-W + 1)} -6 Q${r(-W / 2)} -16 0 -10 Q${r(W / 2)} -4 ${r(W - 1)} -14 L${r(W - 1)} -2 L${r(-W + 1)} -2 Z" fill="#2f86c9" opacity=".85"/>`;
  k += `<path d="M${r(-W + 1)} -30 Q-8 -40 -2 -34 Q4 -28 ${r(W - 1)} -40 L${r(W - 1)} -24 Q4 -18 -4 -22 Q-10 -26 ${r(-W + 1)} -20 Z" fill="#f2c62f" opacity=".85"/>`;
  k += `<circle cx="-9" cy="-25" r="5.6" fill="#f08a3c"/><circle cx="-11" cy="-26.4" r=".9" fill="#1d1d1d"/><circle cx="-7" cy="-26.4" r=".9" fill="#1d1d1d"/><path d="M-11.6 -23 q2.6 2.4 5.2 0" stroke="#1d1d1d" stroke-width=".7" fill="none"/>`;
  k += `<path d="M8 -26 c-2 -3 -6 -1 -4 2 l4 4 l4 -4 c2 -3 -2 -5 -4 -2 Z" fill="#d7262b"/>`;
  k += `<text x="0" y="-11" font-size="5.4" text-anchor="middle" fill="#fff" stroke="#1d1d1d" stroke-width=".35" font-family="'Arial Black',Arial,sans-serif" font-weight="bold" transform="rotate(-6 0 -11)">BERLIN</text>`;
  k += `<path d="M${r(-W + 2)} -45 q6 -3 12 1 M3 -46 q5 2 11 -2" stroke="#d7262b" stroke-width="1.1" fill="none"/>`;
  k += `<line x1="0" y1="${r(-H)}" x2="0" y2="-1.2" stroke="#6e6a63" stroke-width=".5"/>`;
  k += `<rect x="${r(-W)}" y="${r(-H)}" width="${r(2 * W)}" height="${r(H)}" fill="${S.lg("mauerlicht", [[0, "#000", 0.1], [0.6, "#000", 0], [1, "#fff", 0.1]], 0, 0, 1, 0)}"/>`;
  S.teil({ id: "mauer", de: "die Mauer", syl: "MAU-er", it: "il muro", itSyl: "MU-ro", en: "the Wall", x: 268, y: Y, steht: true, kunst: k,
    tipp: "Von 1961 bis 1989 teilte die Mauer Berlin in Ost und West." });
}

/* =====================================================================
   11 — DIE LITFASSSÄULE (ganz rechts)
   ===================================================================== */
{
  const Y = 183, s = km(Y), R = 0.62 * s;
  let k = schatten(0, 0.4, R + 3, 1.8, 0.35);
  const GRUEN = S.lg("litgruen", [[0, "#1d3a2c"], [0.4, "#3d6b54"], [1, "#16291f"]], 0, 0, 1, 0);
  k += `<rect x="${r(-R - 1)}" y="-4" width="${r(2 * R + 2)}" height="4" rx=".6" fill="${GRUEN}"/>`;
  k += `<rect x="${r(-R)}" y="-50" width="${r(2 * R)}" height="46" fill="#e9e3d6"/>`;
  /* Plakate: Konzert, Theater, Ausstellung */
  const pl = [[-50, -34, "#20304f", "#f2c62f", "KONZERT", "Philharmonie"], [-34, -20, "#b0232a", "#fff", "THEATER", "Volksbühne"], [-20, -4.4, "#e9b730", "#1d1d1d", "MUSEUM", "Museumsinsel"]];
  for (const [y0, y1, bg, fg, t1, t2] of pl) {
    k += `<rect x="${r(-R + 0.2)}" y="${y0 + 0.4}" width="${r(2 * R - 0.4)}" height="${y1 - y0 - 0.8}" fill="${bg}"/>`;
    k += `<text x="0" y="${r(y0 + (y1 - y0) * 0.5)}" font-size="3.6" text-anchor="middle" fill="${fg}" font-family="'Arial Black',Arial,sans-serif" font-weight="bold">${t1}</text>`;
    k += `<text x="0" y="${r(y0 + (y1 - y0) * 0.5 + 3.6)}" font-size="2.2" text-anchor="middle" fill="${fg}" font-family="Arial,sans-serif">${t2}</text>`;
  }
  k += `<rect x="${r(-R)}" y="-50" width="${r(2 * R)}" height="46" fill="${S.lg("zylinder", [[0, "#000", 0.35], [0.3, "#000", 0], [0.6, "#fff", 0.12], [1, "#000", 0.4]], 0, 0, 1, 0)}"/>`;
  /* Gesims und Kuppelhaube mit Spitze */
  k += `<rect x="${r(-R - 1.6)}" y="-53" width="${r(2 * R + 3.2)}" height="3" rx=".8" fill="${GRUEN}"/>`;
  k += `<path d="M${r(-R - 0.6)} -53 Q${r(-R)} -62 0 -63 Q${r(R)} -62 ${r(R + 0.6)} -53 Z" fill="${GRUEN}"/>`;
  k += `<rect x="-1" y="-66" width="2" height="3.2" fill="${GRUEN}"/><circle cx="0" cy="-66.6" r="1.2" fill="#c9a94a"/>`;
  k += `<path d="M${r(R * 0.25)} -61 Q${r(R * 0.7)} -59 ${r(R * 0.8)} -54" stroke="#7fae94" stroke-width=".8" fill="none" opacity=".6"/>`;
  S.teil({ id: "litfasssaeule", de: "die Litfaßsäule", syl: "LIT-faß-säu-le", it: "la colonna delle affissioni", itSyl: "co-LON-na del-le af-fis-SIO-ni", en: "advertising column",
    x: 305, y: Y, steht: true, kunst: k, tipp: "Ernst Litfaß hat die Säule 1855 in Berlin erfunden — für Plakate." });
}

/* =====================================================================
   12 — DIE LATERNE (Berliner Gaslaterne, links zwischen den Türmen)
   ===================================================================== */
{
  const Y = 177, s = km(Y);
  const H = 4.4 * s;
  let k = schatten(0, 0.3, 4, 1, 0.3);
  k += `<path d="M-2.6 0 L-2 -3 Q-1.6 -6 -1 -7 L1 -7 Q1.6 -6 2 -3 L2.6 0 Z" fill="${EISEN}"/>`;
  k += `<path d="M-.8 -7 L-.55 ${r(-H + 10)} L.55 ${r(-H + 10)} L.8 -7 Z" fill="${EISEN}"/>`;
  k += `<rect x="-1.4" y="-16" width="2.8" height="1.2" rx=".4" fill="#3a4741"/><rect x="-1.2" y="${r(-H + 10)}" width="2.4" height="1" fill="#3a4741"/>`;
  /* Leuchtenkopf: sechseckige Glaslaterne mit Dachhaube und Krone */
  const y0 = -H + 10;
  k += `<path d="M-2.4 ${r(y0)} L2.4 ${r(y0)} L3.6 ${r(y0 - 6.6)} L-3.6 ${r(y0 - 6.6)} Z" fill="${S.lg("lglas", [[0, "#fff6d6"], [1, "#e7d9a8"]])}" stroke="#26302c" stroke-width=".35"/>`;
  k += `<line x1="0" y1="${r(y0)}" x2="0" y2="${r(y0 - 6.6)}" stroke="#26302c" stroke-width=".3"/><line x1="-1.6" y1="${r(y0)}" x2="-2.4" y2="${r(y0 - 6.6)}" stroke="#26302c" stroke-width=".25"/><line x1="1.6" y1="${r(y0)}" x2="2.4" y2="${r(y0 - 6.6)}" stroke="#26302c" stroke-width=".25"/>`;
  k += `<path d="M-4.4 ${r(y0 - 6.6)} L4.4 ${r(y0 - 6.6)} L1.4 ${r(y0 - 9.4)} L-1.4 ${r(y0 - 9.4)} Z" fill="${EISEN}"/>`;
  k += `<circle cx="0" cy="${r(y0 - 10.2)}" r=".8" fill="#26302c"/>`;
  k += `<path d="M-2 ${r(y0 - 1)} L-3 ${r(y0 - 5.6)}" stroke="#fff" stroke-width=".5" opacity=".6"/>`;
  S.teil({ id: "laterne", de: "die Laterne", syl: "la-TER-ne", it: "il lampione", itSyl: "lam-PIO-ne", en: "street lamp", x: 82, y: Y, steht: true, kunst: k,
    tipp: "In Berlin brennen noch viele Laternen mit Gas." });
}

/* =====================================================================
   13 — DIE IMBISSBUDE (Currywurst, links vorn) und 14 — DER VERKÄUFER
   ===================================================================== */
const BUDE = { x: 38, y: 190 };
const THEKE_Y = BUDE.y - 1.1 * km(BUDE.y);   /* Theke 1,1 m hoch */
{
  const s = km(BUDE.y), W = 3.2 * s, H = 2.55 * s;
  let k = schatten(0, 0.6, W / 2 + 4, 2.2, 0.4);
  const ty = THEKE_Y - BUDE.y;
  /* Korpus */
  k += `<rect x="${r(-W / 2)}" y="${r(-H)}" width="${r(W)}" height="${r(H)}" rx="1" fill="${S.lg("bude", [[0, "#f3efe4"], [1, "#d8d1c0"]])}"/>`;
  /* Innenraum durch die offene Klappe: Fliesen, Speisekarte, Fritteuse, Grill */
  const ox = -W / 2 + 4, ow = W - 8, oy = -H + 7;
  k += `<rect x="${r(ox)}" y="${r(oy)}" width="${r(ow)}" height="${r(ty - oy)}" fill="#e9eef0"/>`;
  for (let y = oy + 2; y < ty; y += 2) k += `<line x1="${r(ox)}" y1="${r(y)}" x2="${r(ox + ow)}" y2="${r(y)}" stroke="#c9d3d8" stroke-width=".2"/>`;
  for (let x = ox + 2; x < ox + ow; x += 2) k += `<line x1="${r(x)}" y1="${r(oy)}" x2="${r(x)}" y2="${r(ty)}" stroke="#c9d3d8" stroke-width=".2"/>`;
  k += `<rect x="${r(ox + 2)}" y="${r(oy + 1.4)}" width="22" height="11" rx=".6" fill="#1e2a24"/>`;
  k += `<text x="${r(ox + 13)}" y="${r(oy + 4)}" font-size="1.9" text-anchor="middle" fill="#f6e7a1" font-family="Arial,sans-serif" font-weight="bold">SPEISEKARTE</text>`;
  for (const [i, t] of ["Currywurst … 3,50", "mit Pommes … 5,90", "Pommes … 2,80", "Bulette … 3,20"].entries()) k += `<text x="${r(ox + 3.4)}" y="${r(oy + 6.6 + i * 1.9)}" font-size="1.55" fill="#f4f0e6" font-family="Arial,sans-serif">${t}</text>`;
  k += `<rect x="${r(ox + ow - 20)}" y="${r(ty - 6)}" width="18" height="6" fill="${STAHL}"/><rect x="${r(ox + ow - 19)}" y="${r(ty - 5.6)}" width="7" height="1.4" fill="#d8b04a"/><rect x="${r(ox + ow - 10.4)}" y="${r(ty - 5.6)}" width="7" height="1.4" fill="#d8b04a"/>`;
  k += `<path d="M${r(ox + ow - 18)} ${r(ty - 6.5)} q1 -2 0 -3.4 M${r(ox + ow - 8)} ${r(ty - 6.5)} q1 -2 0 -3.6" stroke="#fff" stroke-width=".5" opacity=".6" fill="none"/>`;
  /* Markise (rot-weiß gestreift) und Schild auf dem Dach */
  const mw = ow + 6;
  for (let i = 0; i < 10; i++) {
    const x0 = -mw / 2 + i * mw / 10;
    k += `<path d="M${r(x0)} ${r(oy - 1)} L${r(x0 + mw / 10)} ${r(oy - 1)} L${r(x0 + mw / 10 + (x0 + mw / 20) * 0.06)} ${r(oy + 3.6)} L${r(x0 + x0 * 0.06)} ${r(oy + 3.6)} Z" fill="${i % 2 ? "#f6f3ee" : "#c9302c"}"/>`;
  }
  for (let i = 0; i < 10; i++) { const x = -mw / 2 * 1.06 + (i + 0.5) * mw * 1.06 / 10; k += `<path d="M${r(x - mw / 20 * 1.06)} ${r(oy + 3.6)} q${r(mw / 20 * 1.06)} 1.8 ${r(mw / 10 * 1.06)} 0" fill="${i % 2 ? "#f6f3ee" : "#c9302c"}"/>`; }
  k += `<rect x="${r(-W / 2 - 1)}" y="${r(-H - 9)}" width="${r(W + 2)}" height="9" rx="1" fill="${S.lg("budeschild", [[0, "#d7262b"], [1, "#a3171c"]])}"/>`;
  k += `<text x="0" y="${r(-H - 3.2)}" font-size="5.2" text-anchor="middle" fill="#ffd94a" font-family="'Arial Black',Arial,sans-serif" font-weight="bold" letter-spacing=".3">CURRYWURST</text>`;
  k += `<rect x="${r(-W / 2 - 1)}" y="${r(-H - 9)}" width="${r(W + 2)}" height="1.4" rx=".7" fill="#fff" opacity=".25"/>`;
  /* Theke und Front */
  k += `<rect x="${r(-W / 2 - 1.5)}" y="${r(ty - 1.2)}" width="${r(W + 3)}" height="2" rx=".5" fill="${STAHL}"/>`;
  k += `<rect x="${r(-W / 2)}" y="${r(ty + 0.8)}" width="${r(W)}" height="${r(-ty - 0.8)}" fill="${S.lg("front", [[0, "#c9302c"], [1, "#962023"]])}"/>`;
  k += `<text x="0" y="${r(ty + 9.4)}" font-size="3.4" text-anchor="middle" fill="#fff" font-family="Georgia,serif" font-style="italic" font-weight="bold">Berliner Imbiss</text>`;
  k += `<text x="0" y="${r(ty + 13.6)}" font-size="2.3" text-anchor="middle" fill="#ffd94a" font-family="Arial,sans-serif" letter-spacing=".3">SEIT 1949 · MIT ODER OHNE DARM</text>`;
  k += `<rect x="${r(-W / 2)}" y="-2" width="${r(W)}" height="2" fill="#2a2a2a"/>`;
  k += `<rect x="${r(-W / 2)}" y="${r(-H)}" width="2" height="${r(H)}" fill="#fff" opacity=".2"/>`;
  S.teil({ id: "imbissbude", de: "die Imbissbude", syl: "IM-biss-bu-de", it: "il chiosco", itSyl: "CHIO-sco", en: "snack stand", x: BUDE.x, y: BUDE.y, steht: true, kunst: k });
}
{
  /* Verkäufer hinter der Theke — nur oberhalb der Theke gezeichnet */
  const Y = BUDE.y - 6;
  const m = B.mensch({ id: "b21a_verk", geschlecht: "m", pose: "servieren", blick: 10, frisur: "kurz", haarfarbe: "dunkelbraun", haut: "mittel", laecheln: true,
    kleidung: { oberteil: { stueck: "tshirt", farbe: "weiss" }, schuerze: { stueck: "schuerze", farbe: "rot" }, unterteil: { stueck: "hose", farbe: "schwarz" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" }, kopf: { stueck: "kappe", farbe: "rot" } } }, 1.76 * km(Y));
  S.def(`<clipPath id="${S.id("hinterTheke")}"><rect x="-40" y="-60" width="80" height="${r(THEKE_Y - 1.2 - Y + 60)}"/></clipPath>`);
  S.teil({ id: "verkaeufer", de: "der Verkäufer", syl: "ver-KÄU-fer", it: "il venditore", itSyl: "ven-di-TO-re", en: "vendor", x: BUDE.x + 8, y: Y,
    kunst: `<g clip-path="url(#${S.id("hinterTheke")})">${m.svg}</g>`, tipp: "Der Verkäufer fragt: „Mit oder ohne Darm?“" });
}
{
  /* DIE CURRYWURST in der Pappschale, mit Soße, Currypulver und Piekser */
  let k = schatten(0, 0.1, 4.6, .6, .3);
  k += `<path d="M-4.6 -2.2 L4.6 -2.2 L3.8 0 L-3.8 0 Z" fill="${S.lg("pappe", [[0, "#ffffff"], [1, "#d9d6cf"]])}" stroke="#bcb6aa" stroke-width=".15"/>`;
  for (let i = 0; i < 6; i++) k += `<ellipse cx="${r(-3.2 + i * 1.3)}" cy="-2.5" rx=".75" ry=".55" fill="#a8582b" stroke="#6e3014" stroke-width=".12"/>`;
  k += `<path d="M-4 -2.6 Q-2 -3.6 0 -2.8 Q2 -3.8 4 -2.6 L4 -2.2 L-4 -2.2 Z" fill="#b5161c" opacity=".92"/>`;
  for (let i = 0; i < 14; i++) k += `<circle cx="${r(-3.6 + rnd() * 7.2)}" cy="${r(-3 + rnd() * 0.6)}" r=".14" fill="#e3a12a"/>`;
  k += `<line x1="1.4" y1="-2.8" x2="3.2" y2="-5.4" stroke="#d6b27a" stroke-width=".35"/>`;
  S.teil({ oben: true, id: "currywurst", de: "die Currywurst", syl: "CUR-ry-wurst", it: "la salsiccia al curry", itSyl: "sal-SIC-cia al CUR-ry", en: "curry sausage",
    x: BUDE.x - 14, y: THEKE_Y - 1.2, steht: true, kunst: k, tipp: "Die Currywurst wurde 1949 in Berlin erfunden." });
}
{
  /* DIE POMMES rot-weiß (Ketchup und Mayo) */
  let k = schatten(0, 0.1, 3.6, .6, .3);
  for (let i = 0; i < 11; i++) { const x = -2.6 + i * 0.52; k += `<rect x="${r(x)}" y="${r(-5.4 - rnd() * 1.6)}" width=".5" height="4" rx=".15" fill="${rnd() < 0.5 ? "#f4cf63" : "#e9b947"}" transform="rotate(${Math.round(-12 + rnd() * 24)} ${r(x)} -2)"/>`; }
  k += `<path d="M-3.2 -3.4 L3.2 -3.4 L2.6 0 L-2.6 0 Z" fill="${S.lg("pappe2", [[0, "#fdfdfb"], [1, "#d9d6cf"]])}" stroke="#bcb6aa" stroke-width=".15"/>`;
  k += `<path d="M-2.4 -4.6 q1.2 -.9 2.2 0 q.4 .5 -.2 .9 L-2.2 -3.6 Z" fill="#c4161c"/><path d="M.2 -4.4 q1.2 -.9 2.2 0 q.3 .6 -.3 .9 L.4 -3.6 Z" fill="#fbf6e6"/>`;
  k += `<text x="0" y="-1.2" font-size="1.3" text-anchor="middle" fill="#c9302c" font-family="Arial" font-weight="bold">rot-weiß</text>`;
  S.teil({ oben: true, id: "pommes", de: "die Pommes", syl: "POM-mes", it: "le patatine fritte", itSyl: "pa-ta-TI-ne FRIT-te", en: "fries",
    x: BUDE.x + 20, y: THEKE_Y - 1.2, steht: true, kunst: k, tipp: "„Rot-weiß“ heißt: mit Ketchup und Mayonnaise." });
}

/* =====================================================================
   15 — DER BÄR (bemalter Buddy-Bär auf Sockel)
   ===================================================================== */
{
  const Y = 193, s = km(Y);   /* 22,5 je Meter */
  let k = schatten(0, 0.5, 13, 2.2, 0.4);
  k += `<rect x="-11" y="-8" width="22" height="8" rx=".8" fill="${S.lg("baersockel", [[0, "#e4e0d8"], [1, "#b6b0a5"]])}"/>`;
  k += `<rect x="-11" y="-8" width="22" height="1.2" fill="#f5f2ec"/>`;
  k += `<text x="0" y="-2.6" font-size="2.4" text-anchor="middle" fill="#55504a" font-family="Arial,sans-serif" letter-spacing=".3">BUDDY BÄR</text>`;
  /* der Bär, aufrecht, beide Arme zum Gruß erhoben */
  const B1 = S.lg("baer", [[0, "#5aa6e0"], [0.5, "#2f7fc4"], [1, "#1f5b96"]], 0, 0, 1, 0);
  const H = 1.85 * s;
  k += `<path d="M-7 -8 L-6.4 -15 Q-8.8 ${r(-H * 0.45)} -6.4 ${r(-H * 0.62)} L6.4 ${r(-H * 0.62)} Q8.8 ${r(-H * 0.45)} 6.4 -15 L7 -8 Z" fill="${B1}"/>`;
  k += `<path d="M-6.6 -8 L-6.6 -14 Q-3.4 -15.6 -.6 -14 L-.6 -8 Z M.6 -8 L.6 -14 Q3.4 -15.6 6.6 -14 L6.6 -8 Z" fill="#2a6fae"/>`;
  k += `<path d="M-6 ${r(-H * 0.6)} Q-10 ${r(-H * 0.72)} -10.6 ${r(-H * 0.92)} Q-9.4 ${r(-H * 0.98)} -8 ${r(-H * 0.9)} Q-7 ${r(-H * 0.76)} -3.6 ${r(-H * 0.66)} Z" fill="${B1}"/>`;
  k += `<path d="M6 ${r(-H * 0.6)} Q10 ${r(-H * 0.72)} 10.6 ${r(-H * 0.92)} Q9.4 ${r(-H * 0.98)} 8 ${r(-H * 0.9)} Q7 ${r(-H * 0.76)} 3.6 ${r(-H * 0.66)} Z" fill="${B1}"/>`;
  k += `<ellipse cx="0" cy="${r(-H * 0.74)}" rx="5.4" ry="5" fill="${B1}"/>`;
  k += `<circle cx="-4.2" cy="${r(-H * 0.86)}" r="1.7" fill="${B1}"/><circle cx="4.2" cy="${r(-H * 0.86)}" r="1.7" fill="${B1}"/><circle cx="-4.2" cy="${r(-H * 0.86)}" r=".8" fill="#f2c62f"/><circle cx="4.2" cy="${r(-H * 0.86)}" r=".8" fill="#f2c62f"/>`;
  k += `<ellipse cx="0" cy="${r(-H * 0.7)}" rx="2.2" ry="1.6" fill="#f6f1e7"/><ellipse cx="0" cy="${r(-H * 0.72)}" rx=".9" ry=".6" fill="#1d1d1d"/>`;
  k += `<circle cx="-2" cy="${r(-H * 0.78)}" r=".55" fill="#1d1d1d"/><circle cx="2" cy="${r(-H * 0.78)}" r=".55" fill="#1d1d1d"/>`;
  /* Bemalung: Sterne, Herz, Brandenburger Tor auf dem Bauch */
  for (const [x, y] of [[-4, -0.5], [4, -0.42], [-3, -0.3], [3.6, -0.25]]) k += `<path d="M${x} ${r(H * y - 1)} l.5 1 1.1 .1 -.8 .7 .3 1.1 -1.1 -.6 -1.1 .6 .3 -1.1 -.8 -.7 1.1 -.1 Z" fill="#f2c62f"/>`;
  k += `<rect x="-3.4" y="${r(-H * 0.48)}" width="6.8" height="5.2" rx=".4" fill="#f6f1e7"/>`;
  for (let i = 0; i < 6; i++) k += `<rect x="${r(-3 + i * 1.15)}" y="${r(-H * 0.48 + 1.4)}" width=".45" height="3.4" fill="#2a6fae"/>`;
  k += `<rect x="-3.2" y="${r(-H * 0.48 + 0.6)}" width="6.4" height=".8" fill="#2a6fae"/>`;
  k += `<path d="M-1 ${r(-H * 0.36)} c-1 -1.4 -3 -.4 -2 1 l2 1.8 l2 -1.8 c1 -1.4 -1 -2.4 -2 -1 Z" fill="#d7262b" transform="translate(1 0)"/>`;
  k += `<path d="M-5.6 ${r(-H * 0.6)} Q-7.4 ${r(-H * 0.4)} -6 -15" stroke="#fff" stroke-width=".8" opacity=".3" fill="none"/>`;
  S.teil({ id: "baer", de: "der Bär", syl: "BÄR", it: "l'orso", itSyl: "OR-so", en: "bear", x: 220, y: Y, steht: true, kunst: k,
    tipp: "Der Bär ist das Wappentier von Berlin." });
}

/* =====================================================================
   16 — DIE BANK (Holzbank mit Gusseisenfüßen)
   ===================================================================== */
{
  const Y = 185, s = km(Y), W = 2 * s;
  let k = schatten(0, 0.4, W / 2 + 2, 1.6, 0.35);
  const HOLZ = S.lg("bankholz", [[0, "#b07a45"], [1, "#7d522a"]]);
  for (const sx of [-1, 1]) k += `<path d="M${r(sx * (W / 2 - 3))} 0 L${r(sx * (W / 2 - 3))} -9.4 L${r(sx * (W / 2 - 3) + sx * 0.6)} -18 L${r(sx * (W / 2 - 3) - sx * 1.4)} -18 L${r(sx * (W / 2 - 3) - sx * 1.4)} -9.4 L${r(sx * (W / 2 - 6))} 0 Z" fill="${EISEN}"/>`;
  for (let i = 0; i < 3; i++) k += `<rect x="${r(-W / 2)}" y="${r(-9.6 - i * 1.3)}" width="${r(W)}" height="1.1" rx=".3" fill="${HOLZ}"/>`;
  for (let i = 0; i < 3; i++) k += `<rect x="${r(-W / 2 + 0.5)}" y="${r(-17.6 + i * 2.2)}" width="${r(W - 1)}" height="1.7" rx=".4" fill="${HOLZ}"/>`;
  k += `<rect x="${r(-W / 2)}" y="-9.6" width="${r(W)}" height=".9" fill="#5e3c1e"/>`;
  k += `<rect x="${r(-W / 2 + 0.5)}" y="-17.6" width="${r(W - 1)}" height=".4" fill="#fff" opacity=".2"/>`;
  S.teil({ id: "bank", de: "die Bank", syl: "BANK", it: "la panchina", itSyl: "pan-CHI-na", en: "bench", x: 162, y: Y, steht: true, kunst: k });
}

/* =====================================================================
   17 — DIE AMPEL mit dem Ost-Ampelmännchen (vorn)
   ===================================================================== */
{
  const Y = 197, s = km(Y);   /* 23,7 je Meter */
  let k = schatten(0, 0.3, 3.4, .9, .35);
  k += `<rect x="-1.4" y="${r(-3 * s)}" width="2.8" height="${r(3 * s)}" fill="${S.lg("mast", [[0, "#4f565b"], [0.4, "#9aa2a8"], [1, "#454b50"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-1.6" y="${r(-3 * s - 1)}" width="3.2" height="1.2" rx=".5" fill="#3d4347"/>`;
  /* Anforderungstaster (gelber Kasten) */
  k += `<rect x="1.4" y="${r(-1.15 * s)}" width="4.4" height="6.4" rx=".6" fill="#f2c62f" stroke="#b8941e" stroke-width=".25"/><circle cx="3.6" cy="${r(-1.15 * s + 4.2)}" r="1.1" fill="#2a2a2a"/><text x="3.6" y="${r(-1.15 * s + 1.8)}" font-size="1.05" text-anchor="middle" fill="#2a2a2a" font-family="Arial">SIGNAL</text>`;
  /* Signalgeber: oben Rot (aus), unten Grün (an) */
  const gy = -2.15 * s;
  k += `<rect x="-4.8" y="${r(gy - 16)}" width="9.6" height="17.6" rx="1.2" fill="#2a2e31"/>`;
  k += `<rect x="-4" y="${r(gy - 15)}" width="8" height="7.4" rx=".8" fill="#3b1212"/>`;
  k += `<rect x="-4" y="${r(gy - 7)}" width="8" height="7.4" rx=".8" fill="${S.rg("gruenlicht", [[0, "#b9ffb0"], [0.6, "#38c95a"], [1, "#0f6b2a"]])}"/>`;
  /* Rotes Männchen (steht, Arme ausgebreitet) — dunkel */
  const rotM = (cx, cy) => `<g fill="#7a1f1f"><rect x="${cx - 1.9}" y="${cy - 3.1}" width="3.8" height=".45"/><rect x="${cx - 1}" y="${cy - 3.9}" width="2" height=".9" rx=".2"/><circle cx="${cx}" cy="${cy - 2.1}" r=".75"/><path d="M${cx - 2.9} ${cy - 1.1} L${cx + 2.9} ${cy - 1.1} L${cx + 2.9} ${cy - .4} L${cx + 1} ${cy - .5} L${cx + 1} ${cy + 1.2} L${cx + .9} ${cy + 3.2} L${cx - .9} ${cy + 3.2} L${cx - 1} ${cy + 1.2} L${cx - 1} ${cy - .5} L${cx - 2.9} ${cy - .4} Z"/></g>`;
  /* Grünes Männchen (geht, mit Hut) — leuchtet */
  const gruenM = (cx, cy) => `<g fill="#eaffde"><rect x="${cx - 1.6}" y="${cy - 3.1}" width="3.4" height=".42"/><rect x="${cx - .8}" y="${cy - 3.9}" width="1.9" height=".9" rx=".2"/><circle cx="${cx + .2}" cy="${cy - 2.1}" r=".72"/><ellipse cx="${cx + .1}" cy="${cy + .1}" rx="1.05" ry="1.5"/>` +
    `<path d="M${cx - .3} ${cy - .9} L${cx - 2.2} ${cy + .7}" stroke="#eaffde" stroke-width=".7" stroke-linecap="round"/><path d="M${cx + .6} ${cy - .9} L${cx + 2.3} ${cy + .2}" stroke="#eaffde" stroke-width=".7" stroke-linecap="round"/>` +
    `<path d="M${cx - .3} ${cy + 1.2} L${cx - 1.9} ${cy + 3.2}" stroke="#eaffde" stroke-width=".85" stroke-linecap="round"/><path d="M${cx + .4} ${cy + 1.2} L${cx + 1.9} ${cy + 3.2}" stroke="#eaffde" stroke-width=".85" stroke-linecap="round"/></g>`;
  k += rotM(0, r(gy - 11.3)) + gruenM(0, r(gy - 3.3));
  k += `<circle cx="0" cy="${r(gy - 3.3)}" r="9" fill="#7dff8c" opacity=".12"/>`;
  k += `<path d="M-5.2 ${r(gy - 14.6)} L-5.2 ${r(gy - 16.4)} L5.2 ${r(gy - 16.4)} L5.2 ${r(gy - 14.6)} Z M-5.2 ${r(gy - 7.1)} L5.2 ${r(gy - 7.1)} L5.2 ${r(gy - 8.6)} L-5.2 ${r(gy - 8.6)} Z" fill="#1a1d1f"/>`;
  S.teil({ id: "ampelmaennchen", de: "das Ampelmännchen", syl: "AM-pel-männ-chen", it: "l'omino del semaforo", itSyl: "o-MI-no del se-MA-fo-ro", en: "little traffic-light man",
    x: 118, y: Y, steht: true, kunst: k, tipp: "Das Ampelmännchen mit Hut kommt aus Ost-Berlin. Grün heißt: Du darfst gehen." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/berlin.js"));
console.log(aus);
