#!/usr/bin/env node
/* =====================================================================
   DER UMZUG (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (Bußgeldkatalog „Halteverbot Umzug“, Merkblatt Stadt
   Karlsruhe „Haltverbotsschilder bei Umzug“, Ratgeber Umzugskartons):
   - Vor dem Haus wird eine HALTVERBOTSZONE eingerichtet: Zeichen 283
     (absolutes Haltverbot: blaue Scheibe, roter Rand, rotes Kreuz) auf
     einem mobilen Ständer mit Fußplatte, darunter Zusatzzeichen mit
     Datum und Uhrzeit, dazu ein Pfeil für Anfang/Ende der Zone. Die
     Schilder stehen mind. 3–4 Tage vorher.
   - Der UMZUGSWAGEN (Transporter mit Kofferaufbau) parkt am Bordstein,
     die Hecktüren sind ganz aufgeklappt und an der Seite eingehakt, eine
     Alu-RAMPE führt von der Ladefläche auf die Straße. Innen: Möbel mit
     SPANNGURTEN an der Zurrschiene gesichert, Matratze hochkant.
   - UMZUGSKARTONS aus Wellpappe mit Grifflöchern und Feldern „Raum /
     Inhalt“, mit Filzstift beschriftet (KÜCHE, BÜCHER, VORSICHT GLAS),
     mit braunem Klebeband verschlossen; SACKKARRE, blaue gesteppte
     MÖBELDECKEN, Rolle LUFTPOLSTERFOLIE.
   - Altbau (Gründerzeit) mit Haustür (zweiflügelig, Oberlicht), beide
     Flügel festgestellt; drinnen das TREPPENHAUS mit Holzgeländer und
     Briefkästen; neben der Tür das Klingelschild.
   - Bei der Wohnungsübergabe: Übergabeprotokoll, die KAUTION kommt
     zurück, die SCHLÜSSEL werden übergeben.
   PERSPEKTIVE: ein Fluchtpunkt (250 | 70), Kamera 2,4 m hoch, Brennweite
   250. Hausfront 11 m entfernt (≈ 23 Einheiten je Meter), Bordstein bei
   8 m, Umzugswagen 5,8–7,8 m. Alles wird mit P(X, Y, Z) projiziert.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "umzug", titel: "Der Umzug", emoji: "📦", thema: "Alltag", kuerzel: "b16a", fassung: 852 });
const rnd = zufall(2610);
const r = B.r;

/* ---------- Kamera ---------------------------------------------------- */
const F = 250, CAM = 2.4, HZ = 70, VX = 250;
const P = (X, Y, Z) => [r(VX + F * X / Z), r(HZ + F * (CAM - Y) / Z)];
const s = (Z) => F / Z;                                  // Einheiten je Meter in der Tiefe Z
const boden = (Z) => HZ + F * CAM / Z;                   // Bodenlinie in der Tiefe Z
const poly = (pts, fill, extra = "") => `<path d="M${pts.map((p) => p.join(" ")).join(" L")} Z" fill="${fill}"${extra}/>`;
/* Quader: sichtbare Flächen in der richtigen Reihenfolge (ox, oy = Ursprung des Teils) */
function quader(X0, X1, Y0, Y1, Z0, Z1, farben, ox = 0, oy = 0) {
  const q = (X, Y, Z) => { const [x, y] = P(X, Y, Z); return [r(x - ox), r(y - oy)]; };
  let g = "";
  if (Y1 < CAM) g += poly([q(X0, Y1, Z0), q(X1, Y1, Z0), q(X1, Y1, Z1), q(X0, Y1, Z1)], farben.oben);
  if (X1 < 0) g += poly([q(X1, Y0, Z0), q(X1, Y0, Z1), q(X1, Y1, Z1), q(X1, Y1, Z0)], farben.seite);
  if (X0 > 0) g += poly([q(X0, Y0, Z0), q(X0, Y0, Z1), q(X0, Y1, Z1), q(X0, Y1, Z0)], farben.seite);
  g += poly([q(X0, Y0, Z0), q(X1, Y0, Z0), q(X1, Y1, Z0), q(X0, Y1, Z0)], farben.vorne);
  return g;
}

/* ---------- Stoffe ---------------------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const PUTZ = S.lg("putz", [[0, "#efe2c4"], [0.6, "#e8d6b1"], [1, "#dcc59b"]]);
const SOCKEL = S.lg("sockel", [[0, "#a9a093"], [1, "#8b8276"]]);
const ASPHALT = S.lg("asphalt", [[0, "#5d6064"], [1, "#46494d"]]);
const GEHWEG = S.lg("gehweg", [[0, "#b9b5ad"], [1, "#a7a29a"]]);
const LACK = S.lg("lack", [[0, "#ffffff"], [0.5, "#eef1f3"], [1, "#d5dade"]]);
const LACK_S = S.lg("lacks", [[0, "#dde2e6"], [1, "#b8c0c6"]], 0, 0, 1, 0);
const ALU = S.lg("alu", [[0, "#e9edf0"], [0.45, "#bcc4ca"], [0.55, "#a8b1b8"], [1, "#d7dde1"]], 0, 0, 1, 0);
const PAPPE = S.lg("pappe", [[0, "#d7a868"], [1, "#bf8c4c"]]);
const PAPPE_O = S.lg("pappeo", [[0, "#e6bd80"], [1, "#d6a865"]]);
const PAPPE_S = S.lg("pappes", [[0, "#b27f42"], [1, "#9a6a34"]], 0, 0, 1, 0);
const TUERGRUEN = S.lg("tuergruen", [[0, "#3c5a46"], [1, "#2a4232"]], 0, 0, 1, 0);
const HOLZ = S.lg("holz", [[0, "#9a6a3c"], [1, "#74491f"]]);

/* =====================================================================
   KULISSE — Altbaufassade, Gehweg, Bordstein, Straße
   ===================================================================== */
const ZF = 11, GF = boden(ZF), SF = s(ZF);            // Hausfront: Bodenlinie ≈ 124,5
{
  let k = `<rect x="0" y="0" width="320" height="${r(GF)}" fill="${PUTZ}"/>`;
  k += `<rect x="0" y="0" width="320" height="${r(GF)}" fill="${S.rg("sonne", [[0, "#fff6e0", 0.5], [1, "#fff6e0", 0]], 0.75, 0.3, 0.7)}"/>`;
  /* Putzkörnung */
  for (let i = 0; i < 160; i++) k += `<circle cx="${r(rnd() * 320)}" cy="${r(rnd() * GF)}" r="${r(0.25 + rnd() * 0.5)}" fill="${rnd() < 0.5 ? "#d2bc92" : "#f8eed8"}" opacity=".55"/>`;
  /* Erdgeschoss mit Bandrustika (waagrechte Fugen), Gesims über dem EG */
  const eg = GF - 3.6 * SF;
  for (let y = GF - 0.6 * SF - 7; y > eg + 2; y -= 7) k += `<rect x="0" y="${r(y)}" width="320" height=".6" fill="#c8b087" opacity=".7"/>`;
  k += `<rect x="0" y="${r(eg - 3)}" width="320" height="4.4" fill="#f4ead3"/><rect x="0" y="${r(eg + 1.4)}" width="320" height="1.2" fill="#b89e74"/><rect x="0" y="${r(eg - 3.6)}" width="320" height=".8" fill="#fffaf0"/>`;
  /* Sockel aus Sandstein */
  k += `<rect x="0" y="${r(GF - 0.6 * SF)}" width="320" height="${r(0.6 * SF)}" fill="${SOCKEL}"/>`;
  for (let x = 0; x < 320; x += 17) k += `<rect x="${x}" y="${r(GF - 0.6 * SF)}" width=".5" height="${r(0.6 * SF)}" fill="#6f675d" opacity=".6"/>`;
  k += `<rect x="0" y="${r(GF - 0.6 * SF)}" width="320" height="1" fill="#c2b9ab"/>`;
  /* Fenster: EG und 1. OG, Achsabstand 2,6 m */
  const fenster = (cx, y0, y1, oben) => {
    const w = 1.2 * SF;
    let g = `<rect x="${r(cx - w / 2 - 3)}" y="${r(y0 - 3)}" width="${r(w + 6)}" height="${r(y1 - y0 + 4)}" fill="#f6eedc"/>`;
    if (oben) g += `<path d="M${r(cx - w / 2 - 5)} ${r(y0 - 3)} L${r(cx)} ${r(y0 - 10)} L${r(cx + w / 2 + 5)} ${r(y0 - 3)} Z" fill="#f3e8d0" stroke="#cdb68e" stroke-width=".5"/>`;
    g += `<rect x="${r(cx - w / 2)}" y="${r(y0)}" width="${r(w)}" height="${r(y1 - y0)}" fill="#f7f7f4"/>`;
    g += `<rect x="${r(cx - w / 2 + 1.4)}" y="${r(y0 + 1.4)}" width="${r(w - 2.8)}" height="${r(y1 - y0 - 2.8)}" fill="${S.lg("scheibe", [[0, "#8fa6b4"], [0.5, "#4f6878"], [1, "#2f4250"]])}"/>`;
    g += `<rect x="${r(cx - 0.6)}" y="${r(y0)}" width="1.2" height="${r(y1 - y0)}" fill="#f7f7f4"/><rect x="${r(cx - w / 2)}" y="${r(y0 + (y1 - y0) * 0.3)}" width="${r(w)}" height="1.1" fill="#f7f7f4"/>`;
    /* Gardine und Spiegelung */
    g += `<path d="M${r(cx - w / 2 + 1.4)} ${r(y0 + (y1 - y0) * 0.3 + 1.1)} h${r(w / 2 - 2)} v${r((y1 - y0) * 0.5)} q${r(-w / 4)} 3 ${r(-w / 2 + 2)} 0 Z" fill="#fbfaf6" opacity=".55"/>`;
    g += `<path d="M${r(cx + 2)} ${r(y0 + 1.4)} L${r(cx + 6)} ${r(y0 + 1.4)} L${r(cx + 1)} ${r(y1 - 2)} L${r(cx - 3)} ${r(y1 - 2)} Z" fill="#fff" opacity=".18"/>`;
    g += `<rect x="${r(cx - w / 2 - 4)}" y="${r(y1 + 0.6)}" width="${r(w + 8)}" height="2.2" fill="#e9dfc8"/><rect x="${r(cx - w / 2 - 4)}" y="${r(y1 + 2.6)}" width="${r(w + 8)}" height=".8" fill="#a99068"/>`;
    return g;
  };
  for (let n = -3; n <= 2; n++) {
    const cx = 176 + n * 2.6 * SF;
    k += fenster(cx, GF - 4.65 * SF - 30, GF - 4.65 * SF, true);           // 1. OG (oben angeschnitten)
    if (n !== 0) k += fenster(cx, GF - 2.75 * SF, GF - 1.05 * SF, false);  // Erdgeschoss
  }
  S.hinten(k);
}
const ZB = 8;                                          // Bordsteinkante
{
  /* Gehweg mit Betonplatten in Fluchtperspektive */
  const g0 = GF, g1 = boden(ZB);
  let k = `<rect x="0" y="${r(g0)}" width="320" height="${r(g1 - g0)}" fill="${GEHWEG}"/>`;
  for (let Z = ZF - 0.5; Z > ZB; Z -= 0.5) { const y = boden(Z); k += `<rect x="0" y="${r(y)}" width="320" height=".35" fill="#8c877f" opacity=".7"/>`; }
  for (let X = -14; X <= 4; X += 0.5) { const a = P(X, 0, ZF), b = P(X, 0, ZB); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#8c877f" stroke-width=".35" opacity=".6"/>`; }
  for (let i = 0; i < 70; i++) k += `<circle cx="${r(rnd() * 320)}" cy="${r(g0 + rnd() * (g1 - g0))}" r="${r(0.2 + rnd() * 0.3)}" fill="#7d786f" opacity=".35"/>`;
  /* Straße */
  k += `<rect x="0" y="${r(g1)}" width="320" height="${r(200 - g1)}" fill="${ASPHALT}"/>`;
  for (let i = 0; i < 260; i++) k += `<circle cx="${r(rnd() * 320)}" cy="${r(g1 + rnd() * (200 - g1))}" r="${r(0.2 + rnd() * 0.35)}" fill="${rnd() < 0.5 ? "#6d7175" : "#3a3c40"}" opacity=".6"/>`;
  /* Rinne aus Pflaster an der Bordsteinkante, Gully */
  k += `<rect x="0" y="${r(g1)}" width="320" height="${r(boden(ZB - 0.35) - g1)}" fill="#7b7770"/>`;
  for (let X = -14; X <= 4; X += 0.3) { const a = P(X, 0, ZB), b = P(X, 0, ZB - 0.35); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#5f5b55" stroke-width=".3"/>`; }
  { const a = P(0.6, 0, ZB - 0.05), b = P(1.1, 0, ZB - 0.35); k += `<rect x="${a[0]}" y="${a[1]}" width="${r(b[0] - a[0])}" height="${r(b[1] - a[1])}" fill="#2c2e31"/>`; for (let i = 1; i < 6; i++) k += `<line x1="${r(a[0] + i * (b[0] - a[0]) / 6)}" y1="${a[1]}" x2="${r(a[0] + i * (b[0] - a[0]) / 6)}" y2="${b[1]}" stroke="#55585c" stroke-width=".6"/>`; }
  /* Fahrbahnmarkierung (Leitlinie) vorne */
  for (let X = -12; X < 4; X += 3) { const a = P(X, 0, 4.9), b = P(X + 1.5, 0, 4.9); k += `<path d="M${a[0]} ${a[1]} L${b[0]} ${b[1]} L${b[0]} ${r(b[1] + 2.6)} L${a[0]} ${r(a[1] + 2.6)} Z" fill="#e8e6df" opacity=".85"/>`; }
  k += `<rect x="0" y="${r(g1)}" width="320" height="${r(200 - g1)}" fill="${S.lg("strlicht", [[0, "#000", 0.1], [1, "#fff", 0.04]])}"/>`;
  S.hinten(k);
}

/* =====================================================================
   1 — DIE HAUSNUMMER und 2 — DAS FENSTER (Erdgeschoss rechts)
   ===================================================================== */
{
  const [x, y] = P(-3.26 + 1.15, 2.95, ZF);
  let k = `<rect x="-4" y="-3" width="8" height="6" rx="1" fill="#1d3f7a" stroke="#fff" stroke-width=".5"/><text x="0" y="2" font-size="4.6" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-weight="bold">12</text>`;
  S.teil({ oben: true, id: "um_hausnummer", de: "die Hausnummer", syl: "HAUS-num-mer", it: "il numero civico", itSyl: "NU-me-ro CI-vi-co", en: "house number", x, y, kunst: k + flaeche(-5, -4, 10, 8) });
}
{
  const cx = 176 + 2 * 2.6 * SF, y0 = GF - 2.75 * SF, y1 = GF - 1.05 * SF, w = 1.2 * SF;
  /* das Fenster ist schon in der Kulisse gemalt — hier liegt die Trefferfläche darauf */
  S.teil({ id: "um_fenster", de: "das Fenster", syl: "FENS-ter", it: "la finestra", itSyl: "fi-NE-stra", en: "window", x: cx, y: y1,
    kunst: `<rect x="${r(-w / 2 - 3)}" y="${r(y0 - y1 - 3)}" width="${r(w + 6)}" height="${r(y1 - y0 + 6)}" fill="#fff" opacity=".001"/>` });
}

/* =====================================================================
   3 — DAS TREPPENHAUS (hinter der offenen Haustür) und 4 — DIE HAUSTÜR
   ===================================================================== */
const TX = -3.26, TW = 1.5, TSTUFE = 0.34;
{
  const [xl, yb] = P(TX - TW / 2, TSTUFE, ZF), [xr] = P(TX + TW / 2, TSTUFE, ZF), yt = yb - 2.55 * SF;
  const w = xr - xl, h = yb - yt, ox = (xl + xr) / 2;
  let k = `<g transform="translate(${r(-w / 2)} ${r(-h)})">`;
  /* Rückwand hell, Boden mit Altbaufliesen, Wandsockel */
  k += `<rect width="${r(w)}" height="${r(h)}" fill="${S.lg("thinten", [[0, "#efe6d2"], [1, "#d8cbb0"]])}"/>`;
  k += `<rect y="${r(h * 0.62)}" width="${r(w)}" height="${r(h * 0.38)}" fill="#c9a985"/><rect y="${r(h * 0.62)}" width="${r(w)}" height=".7" fill="#8a6a48"/>`;
  k += `<path d="M0 ${r(h * 0.86)} L${r(w)} ${r(h * 0.86)} L${r(w)} ${r(h)} L0 ${r(h)} Z" fill="#8a3b2a"/>`;
  for (let i = 0; i < 9; i++) k += `<rect x="${r(i * w / 9 + (i % 2) * 0.6)}" y="${r(h * 0.88)}" width="${r(w / 18)}" height="${r(h * 0.05)}" fill="#e6d7b9" opacity=".8"/>`;
  /* Treppe nach rechts oben: Holzstufen, Geländer mit Stäben und Handlauf */
  for (let i = 0; i < 8; i++) {
    const x = w * 0.42 + i * w * 0.075, y = h * 0.86 - i * h * 0.075;
    k += `<rect x="${r(x)}" y="${r(y - h * 0.075)}" width="${r(w - x)}" height="${r(h * 0.075)}" fill="${i % 2 ? "#8c5b30" : "#9a6738"}"/><rect x="${r(x)}" y="${r(y - h * 0.075)}" width="${r(w - x)}" height=".5" fill="#c69766"/>`;
  }
  for (let i = 0; i < 9; i++) { const x = w * 0.44 + i * w * 0.07, y = h * 0.86 - i * h * 0.07; k += `<rect x="${r(x)}" y="${r(y - h * 0.3)}" width=".55" height="${r(h * 0.3)}" fill="#2c2420"/>`; }
  k += `<path d="M${r(w * 0.42)} ${r(h * 0.54)} L${r(w + 1)} ${r(h * 0.54 - (w * 0.58) * (h / w) * 1.0)}" stroke="#5a3418" stroke-width="1.3" stroke-linecap="round"/>`;
  k += `<rect x="${r(w * 0.4)}" y="${r(h * 0.5)}" width="1.6" height="${r(h * 0.36)}" fill="#4a2c16"/><circle cx="${r(w * 0.4 + 0.8)}" cy="${r(h * 0.5)}" r="1.2" fill="#6b4422"/>`;
  /* Briefkastenanlage an der linken Wand, Lichtschalter, Deckenlampe */
  k += `<rect x="1.6" y="${r(h * 0.36)}" width="${r(w * 0.3)}" height="${r(h * 0.2)}" fill="#7f8b91" stroke="#5a656b" stroke-width=".3"/>`;
  for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) k += `<rect x="${r(2.2 + j * w * 0.15)}" y="${r(h * 0.37 + i * h * 0.064)}" width="${r(w * 0.13)}" height="${r(h * 0.055)}" fill="#97a3a9"/><rect x="${r(2.8 + j * w * 0.15)}" y="${r(h * 0.38 + i * h * 0.064)}" width="${r(w * 0.08)}" height=".5" fill="#2c3337"/>`;
  k += `<circle cx="${r(w * 0.36)}" cy="${r(h * 0.47)}" r=".8" fill="#ffb648"/>`;
  k += `<ellipse cx="${r(w * 0.5)}" cy="2.5" rx="3" ry="1.4" fill="#fff8de"/><ellipse cx="${r(w * 0.5)}" cy="4" rx="9" ry="5" fill="#fff6d8" opacity=".25"/>`;
  /* Schatten der Tiefe von links */
  k += `<rect width="${r(w)}" height="${r(h)}" fill="${S.lg("ttief", [[0, "#000", 0.28], [0.35, "#000", 0], [1, "#000", 0.1]], 0, 0, 1, 0)}"/>`;
  k += `</g>`;
  S.teil({ id: "um_treppenhaus", de: "das Treppenhaus", syl: "TREP-pen-haus", it: "la tromba delle scale", itSyl: "TROM-ba del-le SCA-le", en: "stairwell", x: ox, y: yb, kunst: k,
    tipp: "Im Treppenhaus: die Treppe mit Geländer und die Briefkästen der Mieter." });
  /* DIE HAUSTÜR: Rahmen mit Oberlicht, zwei Flügel nach innen geöffnet, Eingangsstufen */
  let d = "";
  const ob = 0.62 * SF;                                     // Oberlicht
  d += `<path d="M${r(-w / 2 - 3.2)} 0 L${r(-w / 2 - 3.2)} ${r(-h - ob - 3)} L${r(w / 2 + 3.2)} ${r(-h - ob - 3)} L${r(w / 2 + 3.2)} 0 L${r(w / 2)} 0 L${r(w / 2)} ${r(-h)} L${r(-w / 2)} ${r(-h)} L${r(-w / 2)} 0 Z" fill="#f2e8d2" stroke="#c7ad83" stroke-width=".4"/>`;
  d += `<rect x="${r(-w / 2)}" y="${r(-h - ob)}" width="${r(w)}" height="${r(ob)}" fill="#2c3a40"/>`;
  d += `<path d="M${r(-w / 2 + 1)} ${r(-h - 1)} A${r(w / 2 - 1)} ${r(ob - 2)} 0 0 1 ${r(w / 2 - 1)} ${r(-h - 1)} Z" fill="${S.lg("oberlicht", [[0, "#9fb4bf"], [1, "#4f6672"]])}"/>`;
  for (const a of [-0.6, -0.2, 0.2, 0.6]) d += `<line x1="0" y1="${r(-h - 1)}" x2="${r(a * w / 2)}" y2="${r(-h - ob + 1)}" stroke="#2c3a40" stroke-width=".5"/>`;
  d += `<rect x="${r(-w / 2)}" y="${r(-h - 1.2)}" width="${r(w)}" height="1.2" fill="#22302a"/>`;
  /* Flügel: schmale, schräg nach innen gedrehte Tafeln an beiden Seiten */
  for (const sx of [-1, 1]) {
    const x0 = sx * w / 2, x1 = sx * (w / 2 - 5.2);
    d += `<path d="M${r(x0)} ${r(-h)} L${r(x1)} ${r(-h + 3)} L${r(x1)} ${r(-1.5)} L${r(x0)} 0 Z" fill="${TUERGRUEN}" stroke="#1d2e24" stroke-width=".3"/>`;
    d += `<path d="M${r(x0 - sx * 0.8)} ${r(-h * 0.92)} L${r(x1 + sx * 0.8)} ${r(-h * 0.9 + 3)} L${r(x1 + sx * 0.8)} ${r(-h * 0.5)} L${r(x0 - sx * 0.8)} ${r(-h * 0.5)} Z" fill="#89a1ad" opacity=".75"/>`;
  }
  d += `<rect x="${r(-w / 2 - 1)}" y="-.8" width="${r(w + 2)}" height=".8" fill="#9a8e7e"/>`;
  /* zwei Sandsteinstufen */
  const st = TSTUFE * SF;
  d += `<rect x="${r(-w / 2 - 5)}" y="0" width="${r(w + 10)}" height="${r(st / 2)}" fill="#b1a796"/><rect x="${r(-w / 2 - 5)}" y="0" width="${r(w + 10)}" height=".6" fill="#d5ccbc"/>`;
  d += `<rect x="${r(-w / 2 - 8)}" y="${r(st / 2)}" width="${r(w + 16)}" height="${r(st / 2)}" fill="#a39886"/><rect x="${r(-w / 2 - 8)}" y="${r(st / 2)}" width="${r(w + 16)}" height=".6" fill="#cbc1b0"/>`;
  /* Türkeil hält den Flügel offen */
  d += `<path d="M${r(w / 2 - 6)} -.2 l3 -1.6 l0 1.6 Z" fill="#c9a253"/>`;
  S.teil({ id: "um_haustuer", de: "die Haustür", syl: "HAUS-tür", it: "il portone", itSyl: "por-TO-ne", en: "front door", x: ox, y: yb, kunst: d,
    tipp: "Beim Umzug bleibt die Haustür offen. Ein Keil hält sie fest." });
}
/* 5 — DIE KLINGEL (Klingelschild mit Sprechanlage) */
{
  const [x, y] = P(TX + TW / 2 + 0.45, 1.45, ZF);
  let k = `<rect x="-3.6" y="-8" width="7.2" height="16" rx=".8" fill="${ALU}" stroke="#7d868d" stroke-width=".3"/>`;
  for (let i = 0; i < 4; i++) k += `<circle cx="-2.2" cy="${r(-6 + i * 2.6)}" r=".55" fill="#e7f0f6" stroke="#5a656b" stroke-width=".2"/><rect x="-1.2" y="${r(-6.6 + i * 2.6)}" width="4" height="1.2" fill="#fbfbf6"/><rect x="-.9" y="${r(-6.15 + i * 2.6)}" width="${2 + (i % 2)}" height=".3" fill="#4a4a4a"/>`;
  for (let i = 0; i < 4; i++) k += `<rect x="-2" y="${r(4.5 + i * 0.7)}" width="4" height=".35" fill="#59636a"/>`;
  S.teil({ oben: true, id: "um_klingel", de: "die Klingel", syl: "KLIN-gel", it: "il campanello", itSyl: "cam-pa-NEL-lo", en: "doorbell", x, y, kunst: k,
    tipp: "Am Klingelschild steht bald ein neuer Name." });
}

/* =====================================================================
   6 — DIE STEHLAMPE und 7 — DIE ZIMMERPFLANZE (warten auf dem Gehweg)
   ===================================================================== */
{
  const Z = 10.2, k0 = s(Z);
  let k = schatten(0, 0, 0.3 * k0, 0.06 * k0, 0.3);
  k += `<ellipse cx="0" cy="-.6" rx="${r(0.16 * k0)}" ry="1.1" fill="#2d2f33"/>`;
  k += `<rect x="-.45" y="${r(-1.45 * k0)}" width=".9" height="${r(1.45 * k0)}" fill="${S.lg("lampstab", [[0, "#cfd3d6"], [1, "#7c8287"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${r(-0.2 * k0)} ${r(-1.45 * k0)} L${r(0.2 * k0)} ${r(-1.45 * k0)} L${r(0.13 * k0)} ${r(-1.72 * k0)} L${r(-0.13 * k0)} ${r(-1.72 * k0)} Z" fill="${S.lg("schirm", [[0, "#f6efe0"], [1, "#e1d4b9"]], 0, 0, 1, 0)}" stroke="#c9b893" stroke-width=".3"/>`;
  S.teil({ id: "um_stehlampe", de: "die Stehlampe", syl: "STEH-lam-pe", it: "la lampada da terra", itSyl: "LAM-pa-da da TER-ra", en: "floor lamp", x: P(-1.45, 0, Z)[0], y: boden(Z), steht: true, kunst: k });
}
{
  const Z = 9.7, k0 = s(Z);
  let k = schatten(0, 0, 0.3 * k0, 0.07 * k0, 0.3);
  k += `<path d="M${r(-0.2 * k0)} ${r(-0.42 * k0)} L${r(0.2 * k0)} ${r(-0.42 * k0)} L${r(0.16 * k0)} 0 L${r(-0.16 * k0)} 0 Z" fill="${S.lg("topf", [[0, "#e9e5dc"], [0.6, "#d4cec2"], [1, "#a9a296"]], 0, 0, 1, 0)}"/>`;
  /* Monstera: große, geschlitzte Blätter */
  const blatt = (x, y, a, gr) => `<g transform="translate(${r(x)} ${r(y)}) rotate(${a}) scale(${gr})"><path d="M0 0 C-5 -2 -6 -9 0 -12 C6 -9 5 -2 0 0 Z" fill="${S.lg("monst", [[0, "#3f8a45"], [1, "#245c2b"]])}"/><path d="M0 -.5 L0 -11" stroke="#9fd18f" stroke-width=".35"/><path d="M-4.6 -5 l2.6 .6 M4.6 -5 l-2.6 .6 M-4 -8.6 l2.2 .8 M4 -8.6 l-2.2 .8" stroke="#e9e5dc" stroke-width=".5"/></g>`;
  for (const [x, y, a, gr] of [[-3, -0.42 * k0, -50, 0.9], [3, -0.42 * k0, 45, 0.95], [0, -0.42 * k0 - 2, 5, 1.05], [-5, -0.42 * k0 + 1, -80, 0.7], [5, -0.42 * k0 + 1, 82, 0.7]]) {
    k += `<path d="M0 ${r(-0.42 * k0)} Q${r(x * 0.5)} ${r(y - 4)} ${r(x)} ${r(y - 2)}" stroke="#4d7a3a" stroke-width=".5" fill="none"/>` + blatt(x, y - 2, a, gr);
  }
  S.teil({ id: "um_pflanze", de: "die Zimmerpflanze", syl: "ZIM-mer-pflan-ze", it: "la pianta da appartamento", itSyl: "PIAN-ta da ap-par-ta-MEN-to", en: "houseplant", x: P(0.31, 0, Z)[0], y: boden(Z), steht: true, kunst: k });
}

/* =====================================================================
   8 — DIE MIETERIN (zieht aus, hält den Wohnungsschlüssel)
   ===================================================================== */
const MIETERIN = { Z: 10.3 };
{
  const Z = MIETERIN.Z, x = P(1.28, 0, Z)[0];
  const m = B.mensch({ id: "um_mieterin", geschlecht: "w", pose: "servieren", blick: -28, frisur: "zopf", haarfarbe: "hellbraun", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "pullover", farbe: "gelb" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" } } }, 1.68 * s(Z));
  S.teil({ id: "um_mieterin", de: "die Mieterin", syl: "MIE-te-rin", it: "l'inquilina", itSyl: "in-qui-LI-na", en: "tenant", x, y: boden(Z), kunst: m.svg,
    tipp: "Die Mieterin zieht aus. Sie gibt die Schlüssel ab." });
  MIETERIN.x = x; MIETERIN.m = m;
}
/* 9 — DER WOHNUNGSSCHLÜSSEL in ihrer erhobenen Hand */
{
  const m = MIETERIN.m, hand = [m.z.handL, m.z.handR].sort((a, b) => a.y - b.y)[0];
  const hx = MIETERIN.x + hand.x * m.k, hy = boden(MIETERIN.Z) + hand.y * m.k;
  let k = `<circle cx="0" cy="0" r="1.3" fill="none" stroke="#c9ccd0" stroke-width=".45"/>`;
  k += `<g transform="rotate(30)"><circle cx="0" cy="2.6" r="1.1" fill="#d4af37"/><rect x="-.35" y="3.4" width=".7" height="3.6" fill="#d4af37"/><rect x=".3" y="5.6" width=".9" height=".5" fill="#d4af37"/><rect x=".3" y="6.4" width=".7" height=".5" fill="#d4af37"/></g>`;
  k += `<g transform="rotate(-25)"><circle cx="0" cy="2.6" r="1" fill="#b8bcc0"/><rect x="-.3" y="3.4" width=".6" height="3" fill="#b8bcc0"/><rect x=".25" y="5.2" width=".7" height=".45" fill="#b8bcc0"/></g>`;
  S.teil({ oben: true, id: "um_wohnungsschluessel", de: "der Wohnungsschlüssel", syl: "WOH-nungs-schlüs-sel", it: "la chiave di casa", itSyl: "CHIA-ve di CA-sa", en: "flat key", x: hx - 1.2, y: hy + 0.2, kunst: k + flaeche(-3, -2, 6, 9.5),
    tipp: "Bei der Übergabe bekommt der Vermieter alle Schlüssel zurück." });
}

/* =====================================================================
   10 — DAS HALTEVERBOTSSCHILD (mobil, mit Datum) am Bordstein
   ===================================================================== */
{
  const Z = 8.15, k0 = s(Z), x = P(1.73, 0, Z)[0];
  let k = schatten(0, 0, 0.4 * k0, 0.07 * k0, 0.3);
  /* Fußplatte aus Gummi und Ständer */
  k += `<path d="M${r(-0.32 * k0)} 0 L${r(0.32 * k0)} 0 L${r(0.26 * k0)} ${r(-0.07 * k0)} L${r(-0.26 * k0)} ${r(-0.07 * k0)} Z" fill="#2a2a2c"/>`;
  k += `<rect x="-.8" y="${r(-2.2 * k0)}" width="1.6" height="${r(2.15 * k0)}" fill="${S.lg("pfosten", [[0, "#e4e6e8"], [1, "#9ea4a9"]], 0, 0, 1, 0)}"/>`;
  for (let i = 0; i < 5; i++) k += `<rect x="-.8" y="${r(-0.9 * k0 + i * 0.16 * k0)}" width="1.6" height="${r(0.08 * k0)}" fill="#c8302c"/>`;
  /* Zeichen 283 */
  const sy = -2.05 * k0, rr = 0.3 * k0;
  k += `<circle cx="0" cy="${r(sy)}" r="${r(rr + 0.6)}" fill="#fff"/><circle cx="0" cy="${r(sy)}" r="${r(rr)}" fill="#c8102e"/><circle cx="0" cy="${r(sy)}" r="${r(rr * 0.78)}" fill="#1f5aa6"/>`;
  k += `<path d="M${r(-rr * 0.62)} ${r(sy - rr * 0.62)} L${r(rr * 0.62)} ${r(sy + rr * 0.62)} M${r(rr * 0.62)} ${r(sy - rr * 0.62)} L${r(-rr * 0.62)} ${r(sy + rr * 0.62)}" stroke="#c8102e" stroke-width="${r(rr * 0.22)}"/>`;
  k += `<path d="M${r(-rr * 0.7)} ${r(sy - rr * 0.4)} A${r(rr * 0.8)} ${r(rr * 0.8)} 0 0 1 ${r(rr * 0.2)} ${r(sy - rr * 0.78)}" stroke="#fff" stroke-width=".5" opacity=".35" fill="none"/>`;
  /* Zusatzzeichen: Datum/Uhrzeit, Pfeil (Anfang der Zone) */
  const zw = 0.62 * k0, zh = 0.22 * k0, zy = sy + rr + 1.2;
  k += `<rect x="${r(-zw / 2)}" y="${r(zy)}" width="${r(zw)}" height="${r(zh)}" fill="#fff" stroke="#222" stroke-width=".35"/>`;
  k += `<text x="0" y="${r(zy + zh * 0.45)}" font-size="${r(zh * 0.36)}" text-anchor="middle" fill="#111" font-family="Arial,sans-serif" font-weight="bold">Sa 10.10.</text>`;
  k += `<text x="0" y="${r(zy + zh * 0.86)}" font-size="${r(zh * 0.36)}" text-anchor="middle" fill="#111" font-family="Arial,sans-serif" font-weight="bold">7–18 h</text>`;
  const ay = zy + zh + 0.7;
  k += `<rect x="${r(-zw / 2)}" y="${r(ay)}" width="${r(zw)}" height="${r(zh * 0.55)}" fill="#fff" stroke="#222" stroke-width=".35"/>`;
  k += `<path d="M${r(-zw * 0.32)} ${r(ay + zh * 0.27)} l2.4 -1.6 v1 h${r(zw * 0.5)} v1.2 h${r(-zw * 0.5)} v1 Z" fill="#111"/>`;
  k += `<text x="0" y="${r(ay + zh * 0.55 + 3.2)}" font-size="2.2" text-anchor="middle" fill="#c8302c" font-family="Arial" font-weight="bold">UMZUG</text>`.replace("UMZUG", "");
  S.teil({ id: "um_halteverbot", de: "das Halteverbotsschild", syl: "HAL-te-ver-bots-schild", it: "il cartello di divieto di sosta", itSyl: "car-TEL-lo di di-VIE-to di SO-sta", en: "no-stopping sign", x, y: boden(Z), steht: true, kunst: k,
    tipp: "Die Halteverbotszone für den Umzug muss man bei der Stadt beantragen. Die Schilder stehen schon Tage vorher." });
}

/* =====================================================================
   11 — DER BORDSTEIN (Kante zwischen Gehweg und Straße)
   ===================================================================== */
{
  const y0 = boden(ZB) - 0.12 * s(ZB), y1 = boden(ZB);
  let k = `<rect x="-160" y="${r(y0 - y1)}" width="320" height="${r(y1 - y0)}" fill="${S.lg("bord", [[0, "#cfcbc3"], [1, "#9c978f"]])}"/>`;
  for (let x = -160; x < 160; x += 1.0 * s(ZB)) k += `<rect x="${r(x)}" y="${r(y0 - y1)}" width=".5" height="${r(y1 - y0)}" fill="#7b766e"/>`;
  k += `<rect x="-160" y="${r(y0 - y1)}" width="320" height=".5" fill="#e8e5df"/>`;
  S.teil({ id: "um_bordstein", de: "der Bordstein", syl: "BORD-stein", it: "il cordolo", itSyl: "COR-do-lo", en: "kerb", x: 160, y: y1, kunst: k });
}

/* =====================================================================
   12 — DER TRANSPORTER (Umzugswagen mit Kofferaufbau) — Lupe: Laderaum
   ===================================================================== */
const VZ0 = 5.8, VZ1 = 7.8, VXH = -3.2, VBO = 0.78, VDA = 2.95;   // Heck bei X = -3,2
const laderaum = [];
let RAMPE_FUSS;
{
  const ox = P(VXH, 0, VZ0)[0], oy = boden(VZ0);
  const q = (X, Y, Z) => { const [x, y] = P(X, Y, Z); return [r(x - ox), r(y - oy)]; };
  let k = schatten(-56, 0.5, 54, 3.5, 0.45);
  /* --- Innenraum (durch die offene Hecktür) --- */
  const iw = [q(VXH, VBO, VZ0), q(VXH, VDA, VZ0), q(VXH, VDA, VZ1), q(VXH, VBO, VZ1)];
  k += poly(iw, "#5f564b");
  /* hintere Innenwand (Z = VZ1, frontal), Boden, Decke */
  k += poly([q(-4.6, VBO, VZ1), q(-4.6, VDA, VZ1), q(VXH, VDA, VZ1), q(VXH, VBO, VZ1)], S.lg("innenwand", [[0, "#cdc4b4"], [1, "#a39887"]]));
  k += poly([q(-4.6, VBO, VZ0), q(VXH, VBO, VZ0), q(VXH, VBO, VZ1), q(-4.6, VBO, VZ1)], S.lg("ladeboden", [[0, "#6d5a45"], [1, "#8a7358"]]));
  k += poly([q(-4.6, VDA, VZ0), q(VXH, VDA, VZ0), q(VXH, VDA, VZ1), q(-4.6, VDA, VZ1)], "#d9d4ca");
  /* Zurrschienen an der Innenwand */
  for (const Y of [1.35, 2.05]) { const a = q(-4.6, Y, VZ1 - 0.01), b = q(VXH, Y, VZ1 - 0.01); k += `<rect x="${a[0]}" y="${a[1]}" width="${r(b[0] - a[0])}" height="1.2" fill="#8f979d"/>`; for (let x = a[0] + 1; x < b[0]; x += 2.2) k += `<rect x="${r(x)}" y="${r(a[1] + 0.35)}" width="1.1" height=".5" rx=".2" fill="#3d4246"/>`; }
  /* Inhalt: Matratze hochkant, Kommode, Stuhl kopfüber, Spanngurt */
  const ZM = VZ1 - 0.12;
  const mat = [q(-4.6, VBO + 0.02, ZM), q(-4.6, VBO + 1.45, ZM), q(VXH - 0.08, VBO + 1.45, ZM), q(VXH - 0.08, VBO + 0.02, ZM)];
  k += poly(mat, S.lg("matratze", [[0, "#f3f1ea"], [1, "#d9d4c6"]]));
  for (let i = 1; i < 4; i++) { const a = q(-4.6, VBO + i * 0.36, ZM), b = q(VXH - 0.08, VBO + i * 0.36, ZM); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#c6bfae" stroke-width=".35"/>`; }
  for (let i = 0; i < 12; i++) { const a = q(-4.5 + (i % 4) * 0.33, VBO + 0.2 + Math.floor(i / 4) * 0.4, ZM); k += `<circle cx="${a[0]}" cy="${a[1]}" r=".35" fill="#bdb5a2"/>`; }
  { const a = q(-4.6, VBO + 1.45, ZM), b = q(VXH - 0.08, VBO + 1.45, ZM); k += `<rect x="${a[0]}" y="${a[1]}" width="${r(b[0] - a[0])}" height="1.4" fill="#7f9bb5"/>`; }
  const ZK = VZ1 - 0.55;
  k += quader(-4.6, VXH - 0.22, VBO, VBO + 0.82, ZK, ZK + 0.42, { vorne: S.lg("kommode", [[0, "#c79a63"], [1, "#a77a45"]]), oben: "#d8b07b", seite: "#94693a" }, ox, oy);
  for (let i = 0; i < 3; i++) {
    const a = q(-4.55, VBO + 0.06 + i * 0.25, ZK), b = q(VXH - 0.27, VBO + 0.29 + i * 0.25, ZK);
    k += `<rect x="${a[0]}" y="${b[1]}" width="${r(b[0] - a[0])}" height="${r(a[1] - b[1])}" fill="none" stroke="#7d5428" stroke-width=".45"/>`;
    const g = q(VXH - 0.62, VBO + 0.18 + i * 0.25, ZK); k += `<rect x="${r(g[0] - 2)}" y="${r(g[1] - 0.35)}" width="4" height=".8" rx=".4" fill="#e8dcc4"/>`;
  }
  /* Stuhl (Holz) auf der Kommode, Lehne hinten */
  const yS = VBO + 0.82, ZS = ZK + 0.2, SX0 = -3.98, SX1 = -3.46;
  { const bl = q(SX0, yS + 0.42, ZS + 0.18), br = q(SX1, yS + 0.42, ZS + 0.18), bt = q(SX0, yS + 0.88, ZS + 0.18);
    k += `<rect x="${r(bl[0] - 0.4)}" y="${bt[1]}" width="1" height="${r(bl[1] - bt[1])}" fill="#6b4422"/><rect x="${r(br[0] - 0.6)}" y="${bt[1]}" width="1" height="${r(bl[1] - bt[1])}" fill="#6b4422"/>`;
    for (const f of [0.1, 0.3]) k += `<rect x="${bl[0]}" y="${r(bt[1] + (bl[1] - bt[1]) * f)}" width="${r(br[0] - bl[0])}" height="1.3" rx=".4" fill="#8a5a2e"/>`;
    for (const [X, Z] of [[SX0 + 0.03, ZS + 0.16], [SX1 - 0.03, ZS + 0.16]]) { const a = q(X, yS, Z), c = q(X, yS + 0.42, Z); k += `<rect x="${r(a[0] - 0.4)}" y="${c[1]}" width=".8" height="${r(a[1] - c[1])}" fill="#5a3818"/>`; } }
  k += quader(SX0, SX1, yS + 0.42, yS + 0.46, ZS - 0.2, ZS + 0.2, { vorne: "#7a4c24", oben: "#a8743f", seite: "#6b4220" }, ox, oy);
  for (const X of [SX0 + 0.03, SX1 - 0.03]) { const a = q(X, yS, ZS - 0.18), c = q(X, yS + 0.42, ZS - 0.18); k += `<rect x="${r(a[0] - 0.45)}" y="${c[1]}" width=".9" height="${r(a[1] - c[1])}" fill="#6b4422"/>`; }
  /* Spanngurt (orange, mit Ratsche) quer über Matratze und Kommode */
  { const a = q(-4.6, 2.05, VZ1 - 0.02), b = q(VXH - 0.05, VBO + 0.6, ZK - 0.01); k += `<path d="M${a[0]} ${a[1]} L${b[0]} ${b[1]}" stroke="#f08a1c" stroke-width="1.6"/><path d="M${a[0]} ${r(a[1] - 0.4)} L${b[0]} ${r(b[1] - 0.4)}" stroke="#ffc37a" stroke-width=".35"/>`;
    const m2 = [r((a[0] + b[0]) / 2), r((a[1] + b[1]) / 2)]; k += `<rect x="${r(m2[0] - 2)}" y="${r(m2[1] - 1.4)}" width="4" height="2.8" rx=".5" fill="#aeb4b8" stroke="#5e6468" stroke-width=".3" transform="rotate(48 ${m2[0]} ${m2[1]})"/>`; }
  /* Schatten im Laderaum von links */
  k += poly(iw, S.lg("ladeschatten", [[0, "#000", 0.35], [0.4, "#000", 0], [1, "#000", 0]], 0, 0, 1, 0));
  /* --- Seitenwand des Koffers (vorne, Z = VZ0) mit eingehakter Hecktür --- */
  const sl = q(-5.82, VBO, VZ0), sr = q(VXH, VDA, VZ0);
  k += `<rect x="${sl[0]}" y="${sr[1]}" width="${r(sr[0] - sl[0])}" height="${r(sl[1] - sr[1])}" fill="${LACK}"/>`;
  for (let X = VXH - 1.2; X > -5.82; X -= 1.2) { const a = q(X, VDA, VZ0); k += `<rect x="${a[0]}" y="${a[1]}" width=".4" height="${r(sl[1] - sr[1])}" fill="#c9cfd4"/>`; }
  k += `<rect x="${sl[0]}" y="${sr[1]}" width="${r(sr[0] - sl[0])}" height="2.2" fill="#c7cdd2"/><rect x="${sl[0]}" y="${r(sl[1] - 2.6)}" width="${r(sr[0] - sl[0])}" height="2.6" fill="#b4bbc1"/>`;
  /* Aufschrift */
  { const a = q(-5.0, 2.05, VZ0); k += `<text x="${a[0]}" y="${a[1]}" font-size="9.5" text-anchor="middle" fill="#1f4f8a" font-family="Arial,sans-serif" font-weight="bold" letter-spacing=".3">UMZÜGE</text>`;
    const b = q(-5.0, 1.72, VZ0); k += `<text x="${b[0]}" y="${b[1]}" font-size="4.2" text-anchor="middle" fill="#e07b1a" font-family="Arial,sans-serif" font-weight="bold" letter-spacing=".4">TRANSPORTE · LAGERUNG</text>`;
    const c = q(-5.82, 1.25, VZ0), d = q(VXH - 1.05, 1.25, VZ0); k += `<rect x="${c[0]}" y="${c[1]}" width="${r(d[0] - c[0])}" height="3.2" fill="#1f4f8a"/><rect x="${c[0]}" y="${r(c[1] + 3.2)}" width="${r(d[0] - c[0])}" height="1.2" fill="#e07b1a"/>`; }
  /* Hecktür, ganz aufgeklappt und an der Seite eingehakt */
  { const a = q(VXH - 1.0, VDA - 0.04, VZ0 - 0.04), b = q(VXH - 0.03, VBO + 0.04, VZ0 - 0.04);
    k += `<rect x="${a[0]}" y="${a[1]}" width="${r(b[0] - a[0])}" height="${r(b[1] - a[1])}" rx=".6" fill="${LACK_S}" stroke="#9aa3aa" stroke-width=".4"/>`;
    for (const t of [0.3, 0.7]) k += `<rect x="${r(a[0] + (b[0] - a[0]) * t - 0.6)}" y="${r(a[1] + 2)}" width="1.2" height="${r(b[1] - a[1] - 4)}" fill="${ALU}"/><rect x="${r(a[0] + (b[0] - a[0]) * t - 1.4)}" y="${r((a[1] + b[1]) / 2)}" width="2.8" height="1.4" rx=".4" fill="#6d757b"/>`;
    k += `<rect x="${r(b[0] - 1)}" y="${r(a[1] + 6)}" width="1.6" height="2.4" fill="#4a4f53"/><rect x="${r(b[0] - 1)}" y="${r(b[1] - 9)}" width="1.6" height="2.4" fill="#4a4f53"/>`; }
  /* Rahmen des Hecks (Portal) */
  { const t1 = q(VXH, VDA, VZ0), t2 = q(VXH, VDA, VZ1), b1 = q(VXH, VBO, VZ0), b2 = q(VXH, VBO, VZ1);
    k += `<path d="M${b1[0]} ${b1[1]} L${t1[0]} ${t1[1]} L${t2[0]} ${t2[1]} L${b2[0]} ${b2[1]}" stroke="#aeb6bc" stroke-width="1.6" fill="none"/>`;
    k += `<path d="M${b1[0]} ${r(b1[1] + 1)} L${b2[0]} ${r(b2[1] + 1)}" stroke="#6e767c" stroke-width="2.2"/>`; }
  /* Fahrgestell, Heckleuchten, Unterfahrschutz, Kennzeichen, Hinterrad */
  { const a = q(-5.82, VBO, VZ0), b = q(VXH - 0.15, 0.55, VZ0);
    k += `<rect x="${a[0]}" y="${a[1]}" width="${r(b[0] - a[0])}" height="${r(b[1] - a[1])}" fill="#2c2f33"/>`;
    const l = q(VXH - 0.05, 0.62, VZ0); k += `<rect x="${r(l[0] - 4)}" y="${r(l[1] - 5)}" width="4.6" height="5" rx=".6" fill="#2a2a2a"/><rect x="${r(l[0] - 3.6)}" y="${r(l[1] - 4.6)}" width="1.8" height="4.2" fill="#d42a22"/><rect x="${r(l[0] - 1.8)}" y="${r(l[1] - 4.6)}" width="1.2" height="4.2" fill="#f0a020"/>`;
    const u1 = q(VXH + 0.01, 0.5, VZ0), u2 = q(VXH + 0.01, 0.5, VZ0 + 0.45); k += `<path d="M${u1[0]} ${u1[1]} L${u2[0]} ${u2[1]}" stroke="#3a3e42" stroke-width="2.4"/>`; }
  for (const X of [VXH - 1.05, VXH - 1.85]) {
    const c = q(X, 0.37, VZ0), rr = 0.37 * s(VZ0);
    k += `<circle cx="${c[0]}" cy="${c[1]}" r="${r(rr)}" fill="#1c1d1f"/><circle cx="${c[0]}" cy="${c[1]}" r="${r(rr * 0.55)}" fill="${S.rg("felge", [[0, "#d9dde0"], [1, "#7d858b"]])}"/><circle cx="${c[0]}" cy="${c[1]}" r="${r(rr * 0.18)}" fill="#55595d"/>`;
    for (let i = 0; i < 6; i++) { const w = i * Math.PI / 3; k += `<circle cx="${r(c[0] + Math.cos(w) * rr * 0.36)}" cy="${r(c[1] + Math.sin(w) * rr * 0.36)}" r=".7" fill="#4b5055"/>`; }
  }
  { const a = q(VXH - 2.4, 0.75, VZ0), b = q(VXH - 0.5, 0.75, VZ0); k += `<path d="M${a[0]} ${a[1]} Q${r((a[0] + b[0]) / 2)} ${r(a[1] - 6)} ${b[0]} ${b[1]}" fill="#222" opacity=".6"/>`; }
  /* Unter-Teile (Lupe) */
  const hit = (pts) => { const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]); return [Math.min(...xs), Math.min(...ys), Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)]; };
  const vis = (X0, X1, Y0, Y1, Z) => { const a = q(Math.max(X0, -4.3), Y1, Z), b = q(Math.min(X1, VXH), Y0, Z); return [Math.max(a[0], q(VXH, 0, VZ0)[0]), a[1], b[0] - Math.max(a[0], q(VXH, 0, VZ0)[0]), b[1] - a[1]]; };
  const u = (id, de, syl, it, itSyl, en, box, tipp) => { const [x, y, w, h] = box; laderaum.push({ id, de, syl, it, itSyl, en, x: ox + x + w / 2, y: oy + y + h, kunst: flaeche(-w / 2, -h, w, h), tipp }); };
  u("um_matratze", "die Matratze", "Ma-TRAT-ze", "il materasso", "ma-te-RAS-so", "mattress", vis(-4.6, VXH, VBO + 0.86, VBO + 1.45, ZM), "Die Matratze steht hochkant – so braucht sie wenig Platz.");
  u("um_kommode", "die Kommode", "Kom-MO-de", "il cassettone", "cas-set-TO-ne", "chest of drawers", vis(-4.6, VXH - 0.22, VBO, VBO + 0.78, ZK));
  u("um_stuhl", "der Stuhl", "STUHL", "la sedia", "SE-dia", "chair", vis(SX0, SX1, yS, yS + 0.88, ZS));
  u("um_spanngurt", "der Spanngurt", "SPANN-gurt", "la cinghia di fissaggio", "CIN-ghia di fis-SAG-gio", "ratchet strap", (() => { const a = q(-4.3, 1.86, VZ1), b = q(VXH - 0.1, 1.35, ZK); return [Math.max(a[0], q(VXH, 0, VZ0)[0]) , a[1] - 1.5, b[0] - Math.max(a[0], q(VXH, 0, VZ0)[0]), b[1] - a[1] + 3]; })(), "Mit dem Spanngurt wird die Ladung festgezurrt. Nichts darf rutschen.");
  const zl = P(VXH, VDA, VZ0), zr = P(VXH, VBO, VZ0);
  S.teil({ id: "um_transporter", de: "der Transporter", syl: "Trans-POR-ter", it: "il furgone", itSyl: "fur-GO-ne", en: "removal van", x: ox, y: oy, steht: true, kunst: k,
    zoom: { x: r(zl[0] - 22), y: r(zr[1] - 50), w: 66, h: 44 }, unter: laderaum,
    tipp: "Der Umzugswagen ist ein Transporter mit Kofferaufbau. Die Hecktüren sind ganz aufgeklappt." });
}

/* =====================================================================
   13 — DIE RAMPE (Alu, von der Ladefläche auf die Straße)
   ===================================================================== */
{
  const Zn = 6.55, Zf = 7.2, Xe = -0.85;
  const a = P(VXH, VBO, Zn), b = P(VXH, VBO, Zf), c = P(Xe, 0, Zf), d = P(Xe, 0, Zn);
  const ox = d[0], oy = d[1];
  const o = (p) => [r(p[0] - ox), r(p[1] - oy)];
  let k = schatten(-2, 0.5, 8, 1.5, 0.3);
  k += poly([o(a), o(b), o(c), o(d)], S.lg("rampe", [[0, "#dfe4e7"], [1, "#a9b2b8"]], 0, 0, 1, 1));
  /* Querrillen gegen Rutschen */
  for (let t = 0.06; t < 1; t += 0.07) { const p1 = [a[0] + (d[0] - a[0]) * t, a[1] + (d[1] - a[1]) * t], p2 = [b[0] + (c[0] - b[0]) * t, b[1] + (c[1] - b[1]) * t]; k += `<path d="M${r(p1[0] - ox)} ${r(p1[1] - oy)} L${r(p2[0] - ox)} ${r(p2[1] - oy)}" stroke="#8e979e" stroke-width=".45"/>`; }
  /* Seitenkante (vorne, sichtbar) */
  k += `<path d="M${o(a).join(" ")} L${o(d).join(" ")} L${r(o(d)[0])} ${r(o(d)[1] + 1.4)} L${r(o(a)[0])} ${r(o(a)[1] + 1.4)} Z" fill="#7f888f"/>`;
  S.teil({ id: "um_rampe", de: "die Rampe", syl: "RAM-pe", it: "la rampa", itSyl: "RAM-pa", en: "ramp", x: ox, y: oy, steht: true, kunst: k,
    tipp: "Über die Rampe rollt die Sackkarre in den Laderaum." });
  RAMPE_FUSS = [ox, oy];
}

/* =====================================================================
   14 — DIE MÖBELDECKEN (blau, gesteppt, gefaltet) vorne links
   ===================================================================== */
{
  const Z = 4.95, k0 = s(Z), x = P(-3.07, 0, Z)[0];
  let k = schatten(0, 0.4, 0.75 * k0, 0.08 * k0, 0.35);
  const farben = [["#2f5f9e", "#244b80"], ["#3b6fb0", "#2b5591"], ["#2a5590", "#1f416f"], ["#4a7bb8", "#35609a"]];
  for (let i = 0; i < 4; i++) {
    const y = -i * 0.07 * k0, w = 0.7 * k0 - i * 1.2, h = 0.07 * k0;
    k += `<path d="M${r(-w)} ${r(y)} Q${r(-w - 1.6)} ${r(y - h / 2)} ${r(-w)} ${r(y - h)} L${r(w)} ${r(y - h)} Q${r(w + 1.6)} ${r(y - h / 2)} ${r(w)} ${r(y)} Z" fill="${farben[i][0]}" stroke="${farben[i][1]}" stroke-width=".4"/>`;
    for (let x2 = -w + 3; x2 < w; x2 += 4) k += `<path d="M${r(x2)} ${r(y - 0.5)} l1.6 ${r(-h + 1)}" stroke="${farben[i][1]}" stroke-width=".3"/>`;
  }
  /* oberste Decke halb aufgefaltet hängt über */
  const yt = -4 * 0.07 * k0;
  k += `<path d="M${r(-0.62 * k0)} ${r(yt)} Q${r(-0.2 * k0)} ${r(yt - 2.8)} ${r(0.4 * k0)} ${r(yt - 0.6)} L${r(0.7 * k0)} ${r(yt + 0.05 * k0)} L${r(0.66 * k0)} ${r(yt + 0.2 * k0)} L${r(0.56 * k0)} ${r(yt + 0.02 * k0)} Z" fill="#3567a6"/>`;
  for (let i = 0; i < 6; i++) k += `<path d="M${r(-0.5 * k0 + i * 0.18 * k0)} ${r(yt - 1.2)} l2 1" stroke="#244b80" stroke-width=".3"/>`;
  S.teil({ id: "um_moebeldecke", de: "die Möbeldecke", syl: "MÖ-bel-de-cke", it: "la coperta da trasloco", itSyl: "co-PER-ta da tra-SLO-co", en: "moving blanket", x, y: boden(Z), steht: true, kunst: k,
    tipp: "Möbeldecken schützen Schränke und Tische vor Kratzern." });
}

/* =====================================================================
   15 — DIE LUFTPOLSTERFOLIE (Rolle, steht an der Ladekante)
   ===================================================================== */
{
  const Z = 5.0, k0 = s(Z), x = P(-1.85, 0, Z)[0];
  const rw = 0.17 * k0, h = 0.95 * k0;
  let k = schatten(0, 0.3, rw + 3, 1.6, 0.35);
  k += `<rect x="${r(-rw)}" y="${r(-h)}" width="${r(rw * 2)}" height="${r(h)}" rx="2" fill="${S.lg("folie", [[0, "#e6f2f6", 0.95], [0.35, "#ffffff", 0.9], [0.7, "#cfe2ea", 0.9], [1, "#a8c6d3", 0.95]], 0, 0, 1, 0)}"/>`;
  k += `<ellipse cx="0" cy="${r(-h)}" rx="${r(rw)}" ry="2" fill="#eef7fa" stroke="#b6d0da" stroke-width=".3"/><ellipse cx="0" cy="${r(-h)}" rx="2.4" ry=".8" fill="#9b7a52"/>`;
  for (let y = -h + 3; y < -1; y += 2.2) for (let x2 = -rw + 1.6; x2 < rw - 1; x2 += 2.2) k += `<circle cx="${r(x2 + ((y / 2.2) % 2 ? 1.1 : 0))}" cy="${r(y)}" r=".7" fill="#fff" opacity=".6" stroke="#b9d3dd" stroke-width=".15"/>`;
  /* abgerolltes Ende */
  k += `<path d="M${r(rw)} ${r(-h * 0.3)} q4 1 5 ${r(h * 0.3 - 0.5)} l-4 .4 Z" fill="#dcecf2" opacity=".85" stroke="#b6d0da" stroke-width=".25"/>`;
  S.teil({ id: "um_luftpolsterfolie", de: "die Luftpolsterfolie", syl: "LUFT-pols-ter-fo-lie", it: "il pluriball", itSyl: "plu-ri-BALL", en: "bubble wrap", x, y: boden(Z), steht: true, kunst: k,
    tipp: "Gläser und Teller wickelt man in Luftpolsterfolie." });
}

/* =====================================================================
   16 — DER UMZUGSHELFER und 17 — DIE SACKKARRE mit Kartons
   ===================================================================== */
{
  const Z = 5.95, x = P(-0.35, 0, Z)[0];
  const m = B.mensch({ id: "um_helfer", geschlecht: "m", pose: "halten", blick: -62, frisur: "kurz", haarfarbe: "schwarz", haut: "mittel", bart: true,
    kleidung: { oberteil: { stueck: "tshirt", farbe: "#1f4f8a" }, unterteil: { stueck: "arbeitshose", farbe: "grau" }, schuhe: { stueck: "stiefel" }, zubehoer: { stueck: "handschuhe", farbe: "orange" } } }, 1.8 * s(Z));
  S.teil({ id: "um_umzugshelfer", de: "der Umzugshelfer", syl: "UM-zugs-hel-fer", it: "il traslocatore", itSyl: "tra-slo-ca-TO-re", en: "removal helper", x, y: boden(Z), kunst: m.svg,
    tipp: "Der Umzugshelfer trägt Handschuhe und feste Schuhe." });
}
{
  const Z = 5.45, k0 = s(Z), x = P(-1.15, 0, Z)[0];
  /* Sackkarre nach hinten gekippt (zum Helfer hin), zwei Kartons darauf */
  const kipp = 18;
  let k = schatten(2, 0.4, 0.42 * k0, 0.06 * k0, 0.35);
  let g = "";
  const H = 1.18 * k0, Wd = 0.42 * k0;
  /* Kartons auf der Schaufel */
  const kt = (y0, h, txt, f) => `<rect x="${r(-Wd / 2 - 1)}" y="${r(y0 - h)}" width="${r(Wd + 2)}" height="${r(h)}" rx=".5" fill="${PAPPE}" stroke="#9a6a34" stroke-width=".3"/><rect x="${r(-Wd / 2 - 1)}" y="${r(y0 - h)}" width="${r(Wd + 2)}" height="1.6" fill="#c69a5c"/><rect x="-1.4" y="${r(y0 - h)}" width="2.8" height="${r(h * 0.35)}" fill="#a9763a" opacity=".55"/><ellipse cx="0" cy="${r(y0 - h * 0.72)}" rx="2.4" ry=".9" fill="#5c3b17"/><text x="0" y="${r(y0 - h * 0.25)}" font-size="${f}" text-anchor="middle" fill="#1d1d1d" font-family="'Marker Felt','Comic Sans MS',cursive" font-weight="bold">${txt}</text>`;
  g += kt(-2.2, 0.36 * k0, "BAD", 3.6) + kt(-2.2 - 0.36 * k0, 0.34 * k0, "FLUR", 3.4);
  /* Rahmen aus Stahlrohr mit Griffen, Schaufel unten */
  g += `<path d="M${r(-Wd / 2 - 2)} -1 L${r(-Wd / 2 - 2)} ${r(-H)} Q${r(-Wd / 2 - 2)} ${r(-H - 3)} ${r(-Wd / 2 + 1)} ${r(-H - 3)} M${r(Wd / 2 + 2)} -1 L${r(Wd / 2 + 2)} ${r(-H)} Q${r(Wd / 2 + 2)} ${r(-H - 3)} ${r(Wd / 2 - 1)} ${r(-H - 3)}" stroke="#c0392b" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
  g += `<rect x="${r(-Wd / 2 - 3)}" y="${r(-H - 4)}" width="3" height="2.2" rx="1" fill="#1d1d1d"/><rect x="${r(Wd / 2)}" y="${r(-H - 4)}" width="3" height="2.2" rx="1" fill="#1d1d1d"/>`;
  for (const y of [-H * 0.35, -H * 0.7]) g += `<rect x="${r(-Wd / 2 - 2)}" y="${r(y)}" width="${r(Wd + 4)}" height=".9" fill="#a93226" opacity=".9"/>`;
  g += `<rect x="${r(-Wd / 2 - 2.4)}" y="-2.4" width="${r(Wd + 4.8)}" height="2" fill="#7e868c"/>`;
  k += `<g transform="rotate(${kipp} 0 -1)">${g}</g>`;
  /* Räder mit Luftreifen */
  for (const dx of [-Wd / 2 - 3.4, Wd / 2 + 3.4]) k += `<circle cx="${r(dx + 2)}" cy="${r(-0.13 * k0)}" r="${r(0.13 * k0)}" fill="#1c1c1e"/><circle cx="${r(dx + 2)}" cy="${r(-0.13 * k0)}" r="${r(0.06 * k0)}" fill="#c0392b"/><circle cx="${r(dx + 2)}" cy="${r(-0.13 * k0)}" r="1" fill="#888"/>`;
  S.teil({ id: "um_sackkarre", de: "die Sackkarre", syl: "SACK-kar-re", it: "il carrello", itSyl: "car-REL-lo", en: "sack truck", x, y: boden(Z), steht: true, kunst: k,
    tipp: "Mit der Sackkarre fährt man schwere Kartons – man kippt sie nach hinten." });
}

/* =====================================================================
   18 — DER UMZUGSKARTON (Stapel, beschriftet) mit 19 — KLEBEBAND und
        20 — DIE KAUTION (Übergabeprotokoll auf dem Klemmbrett)
   ===================================================================== */
const KZ = 5.15, KX = 0.15;
{
  const ox = P(KX, 0, KZ)[0], oy = boden(KZ);
  const far = { vorne: PAPPE, oben: PAPPE_O, seite: PAPPE_S };
  let k = schatten(r(0.62 * s(KZ)), 0.5, r(0.75 * s(KZ)), 2.4, 0.4);
  const karton = (X0, Y0, txt, txt2) => {
    const X1 = X0 + 0.6, Y1 = Y0 + 0.34, Z0 = KZ, Z1 = KZ + 0.4;
    let g = quader(X0, X1, Y0, Y1, Z0, Z1, far, ox, oy);
    const [ax, ay] = P(X0, Y1, Z0), [bx, by] = P(X1, Y0, Z0), w = bx - ax, h = by - ay;
    const L = (v) => r(v - ox), T = (v) => r(v - oy);
    /* Klebeband über die Mitte des Deckels und vorne herunter */
    const [tx0, ty0] = P(X0 + 0.27, Y1, Z1), [tx1] = P(X0 + 0.33, Y1, Z1);
    g += `<path d="M${L(tx0)} ${T(ty0)} L${L(tx1)} ${T(ty0)} L${L(ax + w * 0.55)} ${T(ay)} L${L(ax + w * 0.45)} ${T(ay)} Z" fill="#a8743a" opacity=".85"/>`;
    g += `<rect x="${L(ax + w * 0.45)}" y="${T(ay)}" width="${r(w * 0.1)}" height="${r(h * 0.3)}" fill="#a8743a" opacity=".85"/>`;
    /* Griffloch, Druck „Raum / Inhalt“, Filzstift-Beschriftung */
    g += `<rect x="${L(ax + w * 0.38)}" y="${T(ay + h * 0.36)}" width="${r(w * 0.24)}" height="${r(h * 0.12)}" rx="1.2" fill="#4a2e12"/>`;
    g += `<rect x="${L(ax + w * 0.08)}" y="${T(ay + h * 0.52)}" width="${r(w * 0.84)}" height="${r(h * 0.38)}" fill="none" stroke="#7a5426" stroke-width=".3"/>`;
    g += `<text x="${L(ax + w * 0.12)}" y="${T(ay + h * 0.6)}" font-size="1.5" fill="#7a5426" font-family="Arial">Raum / Inhalt</text>`;
    g += `<text x="${L(ax + w / 2)}" y="${T(ay + h * 0.82)}" font-size="${r(h * 0.22)}" text-anchor="middle" fill="#14213d" font-family="'Marker Felt','Comic Sans MS',cursive" font-weight="bold">${txt}</text>`;
    if (txt2) g += `<text x="${L(ax + w * 0.85)}" y="${T(ay + h * 0.3)}" font-size="${r(h * 0.15)}" text-anchor="end" fill="#c0392b" font-family="'Marker Felt','Comic Sans MS',cursive" font-weight="bold">${txt2}</text>`;
    return g;
  };
  k += karton(KX + 0.62, 0, "BÜCHER", "schwer!");
  k += karton(KX, 0, "KÜCHE", "↑ OBEN");
  k += karton(KX + 0.05, 0.34, "Vorsicht GLAS!", "↑↑");
  S.teil({ id: "um_karton", de: "der Umzugskarton", syl: "UM-zugs-kar-ton", it: "lo scatolone", itSyl: "sca-to-LO-ne", en: "cardboard box", x: ox, y: oy, steht: true, kunst: k,
    tipp: "Jeden Karton beschriften: In welches Zimmer kommt er, was ist drin?" });
}
{
  /* Rolle Packband mit Abroller auf dem rechten Karton */
  const [x, y] = P(KX + 0.98, 0.34, KZ + 0.22);
  let k = schatten(0, 0.2, 5, 1, 0.3);
  k += `<ellipse cx="0" cy="-2.6" rx="4.6" ry="2.6" fill="#8c5a24"/><rect x="-4.6" y="-4.6" width="9.2" height="2" fill="#9c6a30"/><ellipse cx="0" cy="-4.6" rx="4.6" ry="2.6" fill="${S.rg("band", [[0, "#5b3a18"], [0.42, "#5b3a18"], [0.45, "#c99a5a"], [1, "#a8743a"]])}"/>`;
  k += `<ellipse cx="0" cy="-4.6" rx="2" ry="1.1" fill="#e9d8b8"/>`;
  k += `<path d="M3.8 -3.8 l3.6 -.6 l.4 1.4 l-3.4 .8 Z" fill="#c62f25"/><path d="M7 -4.6 l1.6 -.2" stroke="#d9dde0" stroke-width=".6"/>`;
  S.teil({ oben: true, id: "um_klebeband", de: "das Klebeband", syl: "KLE-be-band", it: "il nastro adesivo", itSyl: "NA-stro a-de-SI-vo", en: "packing tape", x, y, steht: true, kunst: k });
}
{
  /* Klemmbrett mit Übergabeprotokoll und Umschlag „Kaution“ auf dem oberen Karton */
  const [x, y] = P(KX + 0.36, 0.68, KZ + 0.2);
  let k = `<path d="M-7 0 L5.4 0 L7.4 -3.6 L-4.8 -3.6 Z" fill="#5a4636"/><path d="M-6.4 -.4 L5 -.4 L6.8 -3.3 L-4.4 -3.3 Z" fill="#fbfaf5"/>`;
  k += `<path d="M-1.2 -3.6 L2 -3.6 L2.2 -4.4 L-1 -4.4 Z" fill="#b6bcc1"/>`;
  for (let i = 0; i < 4; i++) k += `<path d="M${r(-5.4 + i * 0.5)} ${r(-0.9 - i * 0.6)} L${r(3.8 + i * 0.5)} ${r(-0.9 - i * 0.6)}" stroke="#8a8f94" stroke-width=".22"/>`;
  k += `<path d="M-1 -1.1 L7 -1.3 L7.8 1.2 L-.2 1.4 Z" fill="#f2e7c9" stroke="#b69b62" stroke-width=".25"/><text x="3.8" y=".7" font-size="1.6" text-anchor="middle" fill="#7a2e18" font-family="Arial" font-weight="bold" transform="rotate(-2 3.8 0)">KAUTION</text>`;
  S.teil({ oben: true, id: "um_kaution", de: "die Kaution", syl: "Kau-TI-ON", it: "la cauzione", itSyl: "cau-ZIO-ne", en: "deposit", x, y, kunst: k + flaeche(-7.5, -5, 16, 7),
    tipp: "Nach der Wohnungsübergabe zahlt der Vermieter die Kaution zurück – wenn alles in Ordnung ist." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/umzug.js"));
console.log(aus);
