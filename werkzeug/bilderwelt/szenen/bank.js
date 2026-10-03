#!/usr/bin/env node
/* =====================================================================
   DIE BANK (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (Filialkonzepte der Sparkassen und Banken: SB-Bereich mit
   Geldautomat, Kontoauszugsdrucker und Überweisungsterminal;
   Servicetheke statt Glaskasse; Beratung in eigenen Räumen):
   - SB-BEREICH: die Automaten sind in die Wand eingebaut, darüber
     „SB-Service“. Am GELDAUTOMATEN: Bildschirm, Tasten, Karten-
     schlitz, Geldausgabe. Der KONTOAUSZUGSDRUCKER druckt die Auszüge.
   - SERVICETHEKE (Schalter) mit der Bankangestellten: Ein- und
     Auszahlung, Münzen und Geldscheine in der Geldschale, PIN-Pad
     (Kartenlesegerät), Formulare und Kugelschreiber; daneben eine
     Spardose für die Kinder (Weltspartag).
   - BERATUNG im eigenen Raum mit Glaswand (Diskretion): Schreibtisch,
     Bildschirm, Stühle, Ordner.
   - Dazu Prospektständer, Pflanzen, Sitzbank, Überwachungskamera.
   BLICK: Fluchtpunkt links der Mitte (x = 130): rechts die Seitenwand
   mit dem SB-Bereich in Flucht, hinten die Theke, links hinten der
   Beratungsraum hinter Glas. Augenhöhe 1,85 m.
   Maßstab: Rückwand 36 Einheiten je Meter, Theke 45 je Meter
   (Thekenhöhe 1,05 m), Bankangestellter 1,78 m, Kundin 1,68 m.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "bank", titel: "Die Bank", emoji: "🏦", thema: "Behörden", kuerzel: "b01c", fassung: 852 });
const rnd = zufall(1822);
const r = B.r;

/* ---------- Kamera ---------------------------------------------------- */
const HY = 55, E = 1.85, D = 6, S0 = 36, VX = 130;
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
/* Schrift auf der rechten Wand (in Flucht): von z0 nach z1 auf Höhe H */
const R = 3.33;
function wandText(z0, z1, H, txt, gr, farbe, extra = "") {
  const a = P(R, H, z0), b = P(R, H, z1), w = Math.hypot(b[0] - a[0], b[1] - a[1]), ang = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
  const sm = sk((z0 + z1) / 2) / S0;
  return `<text x="0" y="0" font-size="${r(gr * sm)}" textLength="${r(w)}" lengthAdjust="spacingAndGlyphs" fill="${farbe}" font-family="Arial" ${extra} transform="translate(${a[0]} ${a[1]}) skewY(${r(ang)})">${txt}</text>`;
}

/* ---------- Grundfarben ---------------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const ROT = "#d7000f";
const ROT_V = S.lg("rot", [[0, "#e8202c"], [1, "#b8000c"]]);
const WAND = S.lg("wand", [[0, "#f7f4ee"], [1, "#e9e3d8"]]);
const SWAND = S.lg("swand", [[0, "#eae4d9"], [1, "#d8d0c2"]], 0, 0, 1, 0);
const EICHE = S.lg("eiche", [[0, "#c79a63"], [0.5, "#b88a55"], [1, "#a77a47"]], 0, 0, 1, 0);
const STAHL = S.lg("stahl", [[0, "#eef1f3"], [0.45, "#c9cfd4"], [0.55, "#b5bcc2"], [1, "#e1e5e8"]], 0, 0, 1, 0);
const ANTHRAZIT = S.lg("anthrazit", [[0, "#4a4f55"], [1, "#2c3035"]]);
const GLAS = S.lg("glas", [[0, "#ffffff", 0.3], [0.45, "#e8f4f7", 0.06], [1, "#ffffff", 0.18]], 0, 0, 1, 1);

/* =====================================================================
   KULISSE — Decke mit Lichtlinien, Rückwand, rechte Wand, Steinboden,
   der Beratungsraum hinter Glas (Raum selbst)
   ===================================================================== */
const WU = P(0, 0, 0)[1], WO = P(0, 3.0, 0)[1];           // 121.6 / 13.6
const ZR = 2.21;                                            // rechte Wand verlässt das Bild
const XRW = P(R, 0, 0)[0];                                  // Ecke hinten rechts (x ≈ 250)
{
  let k = `<rect x="0" y="0" width="320" height="${WO}" fill="${S.lg("decke", [[0, "#dcd8d0"], [1, "#efebe4"]])}"/>`;
  /* Lichtlinien in der Decke (in die Tiefe) */
  for (const X of [-1.8, 0.4, 2.4]) { const a = P(X, 3.0, 0.1), b = P(X, 3.0, 1.6); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#fffdf2" stroke-width="1.6" stroke-linecap="round"/>`; }
  /* Steinboden 80 × 80 cm, hell, poliert */
  k += `<rect x="0" y="${WU}" width="320" height="${r(200 - WU)}" fill="${S.lg("boden", [[0, "#ddd3c4"], [1, "#cbbfae"]])}"/>`;
  for (let i = -8; i <= 6; i++) { const X = i * 0.8, a = P(X, 0, 0), b = P(X, 0, 3.3); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#b5a893" stroke-width=".35"/>`; }
  for (const z of [0.8, 1.6, 2.4]) k += `<line x1="0" y1="${P(0, 0, z)[1]}" x2="320" y2="${P(0, 0, z)[1]}" stroke="#b5a893" stroke-width=".35"/>`;
  k += `<rect x="0" y="${WU}" width="320" height="${r(200 - WU)}" fill="${S.lg("bodenglanz", [[0, "#fff", 0.0], [0.5, "#fff", 0.12], [1, "#000", 0.06]])}"/>`;
  /* Rückwand */
  k += `<rect x="0" y="${WO}" width="${XRW}" height="${r(WU - WO)}" fill="${WAND}"/>`;
  k += `<rect x="0" y="${r(WU - 2.2)}" width="${XRW}" height="2.2" fill="#8f877a"/>`;
  /* rechte Wand (SB-Bereich) */
  const rw = [P(R, 3.0, 0), P(R, 3.0, ZR + 0.05), P(R, 0, ZR + 0.05), P(R, 0, 0)];
  k += poly(rw, SWAND);
  k += poly([P(R, 0, 0), P(R, 0, ZR + 0.05), P(R, 0.08, ZR + 0.05), P(R, 0.08, 0)], "#8f877a");
  /* roter Streifen oben auf der rechten Wand, Aufschrift SB-Service */
  k += poly([P(R, 2.45, 0.3), P(R, 2.45, ZR + 0.05), P(R, 2.15, ZR + 0.05), P(R, 2.15, 0.3)], ROT_V);
  k += wandText(0.75, 1.95, 2.22, "SB-Service · 24 Stunden", 7, "#fff", 'font-weight="bold"');
  S.hinten(k);
}
/* Beratungsraum: Öffnung in der Rückwand, dahinter der Raum (z < 0) */
const BR = { X0: -3.61, X1: -1.6, H: 2.4, zt: -2.5 };
const [BRx0, BRy0] = P(BR.X0, BR.H, 0), [BRx1, BRy1] = P(BR.X1, 0, 0);
{
  S.def(`<clipPath id="${S.id("raum")}"><rect x="0" y="${BRy0}" width="${r(BRx1)}" height="${r(BRy1 - BRy0)}"/></clipPath>`);
  let k = "";
  const { X0, X1, zt } = BR;
  /* Rückwand des Raumes, linke Innenwand, Boden, Decke */
  k += poly([P(X0, 3.0, zt), P(X1, 3.0, zt), P(X1, 0, zt), P(X0, 0, zt)], S.lg("raumwand", [[0, "#efe9df"], [1, "#e1d8c9"]]));
  k += poly([P(X0, 3.0, 0), P(X0, 3.0, zt), P(X0, 0, zt), P(X0, 0, 0)], "#d9cfbf");
  k += poly([P(X0, 0, 0), P(X0, 0, zt), P(X1, 0, zt), P(X1, 0, 0)], S.lg("teppich", [[0, "#7d8693"], [1, "#6a7381"]]));
  /* Fenster in der Rückwand des Raumes, Bild an der Seitenwand */
  const [f0x, f0y] = P(-3.4, 2.3, zt), [f1x, f1y] = P(-2.35, 1.45, zt);
  k += `<rect x="${f0x}" y="${f0y}" width="${r(f1x - f0x)}" height="${r(f1y - f0y)}" fill="${S.lg("fenster", [[0, "#cfe3f0"], [1, "#e9f1f4"]])}" stroke="#bdb4a6" stroke-width=".8"/>`;
  k += `<line x1="${r((f0x + f1x) / 2)}" y1="${f0y}" x2="${r((f0x + f1x) / 2)}" y2="${f1y}" stroke="#bdb4a6" stroke-width=".6"/>`;
  k += poly([P(X0, 2.0, -1.9), P(X0, 2.0, -1.1), P(X0, 1.4, -1.1), P(X0, 1.4, -1.9)], "#7aa0b8", 'stroke="#fff" stroke-width=".6"');
  S.hinten(`<g clip-path="url(#${S.id("raum")})">${k}</g>`);
}

/* =====================================================================
   RECHTE WAND — Kontoauszugsdrucker, Kontoauszug, Geldautomat
   ===================================================================== */
function wandFeld(z0, z1, H0, H1, fill, extra) { return poly([P(R, H0, z0), P(R, H0, z1), P(R, H1, z1), P(R, H1, z0)], fill, extra); }
{
  const z0 = 0.62, z1 = 1.12;
  const [ax, ay] = P(R, 0, z1);
  let k = wandFeld(z0 - 0.04, z1 + 0.04, 0.0, 1.78, "#c9c2b6");
  k += wandFeld(z0, z1, 0.05, 1.72, S.lg("kad", [[0, "#5a6068"], [1, "#3a3f45"]]));
  k += wandFeld(z0 + 0.05, z1 - 0.05, 1.3, 1.6, "#0d2738");
  k += wandFeld(z0 + 0.07, z1 - 0.07, 1.33, 1.57, S.lg("kadbild", [[0, "#3aa0d8"], [1, "#1f6fa4"]]));
  k += wandText(z0 + 0.1, z1 - 0.12, 1.47, "Kontoauszug", 3.4, "#fff");
  k += wandFeld(z0 + 0.08, z1 - 0.08, 1.1, 1.18, "#15181b");
  k += wandFeld(z0 + 0.12, z1 - 0.18, 0.92, 0.96, "#1c1f23");
  k += wandFeld(z0 + 0.06, z1 - 0.06, 0.55, 0.85, "#4b5158");
  k += wandText(z0 + 0.06, z1 - 0.08, 1.9, "Kontoauszüge", 3.6, "#333", 'font-weight="bold"');
  S.teil({ id: "kontoauszugsdrucker", de: "der Kontoauszugsdrucker", syl: "KON-to-aus-zugs-dru-cker", it: "la stampante degli estratti conto", itSyl: "stam-PAN-te DE-gli e-STRAT-ti CON-to", en: "bank statement printer", x: ax, y: ay, steht: true, kunst: um(ax, ay, k),
    tipp: "Man steckt die Bankkarte hinein, und der Drucker druckt die Kontoauszüge." });
  /* Der Kontoauszug kommt aus dem Schlitz */
  let a = poly([P(R - 0.01, 1.15, z0 + 0.1), P(R - 0.01, 1.15, z1 - 0.1), P(R - 0.08, 1.02, z1 - 0.12), P(R - 0.08, 1.02, z0 + 0.12)], "#fbfbf8", 'stroke="#c9c7c0" stroke-width=".2"');
  const l0 = P(R - 0.04, 1.1, z0 + 0.14), l1 = P(R - 0.04, 1.1, z1 - 0.16);
  a += `<line x1="${l0[0]}" y1="${l0[1]}" x2="${l1[0]}" y2="${l1[1]}" stroke="#888" stroke-width=".3"/>`;
  const [qx, qy] = P(R - 0.05, 1.02, (z0 + z1) / 2);
  S.teil({ oben: true, id: "kontoauszug", de: "der Kontoauszug", syl: "KON-to-aus-zug", it: "l'estratto conto", itSyl: "e-STRAT-to CON-to", en: "bank statement", x: qx, y: qy, kunst: um(qx, qy, a) + flaeche(-4.5, -6.5, 9, 8),
    tipp: "Auf dem Kontoauszug stehen alle Einnahmen und Ausgaben des Kontos." });
}
{
  const z0 = 1.38, z1 = 2.02;
  const [ax, ay] = P(R, 0, z1);
  let k = wandFeld(z0 - 0.05, z1 + 0.05, 0, 1.86, "#c9c2b6");
  k += wandFeld(z0, z1, 0.04, 1.8, S.lg("atm", [[0, "#5a6068"], [0.6, "#3e434a"], [1, "#2c3035"]]));
  k += wandFeld(z0, z1, 1.66, 1.8, ROT_V);
  k += wandText(z0 + 0.1, z1 - 0.12, 1.69, "Geldautomat", 5.6, "#fff", 'font-weight="bold"');
  /* Bildschirm mit Sichtschutz */
  k += wandFeld(z0 + 0.06, z1 - 0.06, 1.22, 1.56, "#0d2738");
  k += wandFeld(z0 + 0.09, z1 - 0.09, 1.25, 1.53, S.lg("atmbild", [[0, "#e8202c"], [1, "#b8000c"]]));
  k += wandText(z0 + 0.13, z1 - 0.16, 1.42, "Willkommen", 3.6, "#fff");
  k += wandText(z0 + 0.13, z1 - 0.2, 1.33, "Karte einführen", 2.8, "#ffe1e1");
  /* Tastenfeld (Ablage, leicht schräg), Kartenschlitz, Geldausgabe */
  k += poly([P(R, 1.08, z0 + 0.05), P(R, 1.08, z1 - 0.05), P(R - 0.18, 1.0, z1 - 0.05), P(R - 0.18, 1.0, z0 + 0.05)], "#9aa2a8");
  for (let i = 0; i < 12; i++) {
    const zz = z0 + 0.2 + (i % 3) * 0.07, d = 0.05 + Math.floor(i / 3) * 0.032;
    const c = P(R - d, 1.06 - d * 0.42, zz);
    k += `<rect x="${r(c[0] - 0.9)}" y="${r(c[1] - 0.4)}" width="1.8" height=".9" rx=".25" fill="${i === 9 ? "#d23b30" : i === 11 ? "#3ca35a" : i === 10 ? "#f2c200" : "#2a2d31"}"/>`;
  }
  k += wandFeld(z0 + 0.1, z0 + 0.24, 1.14, 1.17, "#111");
  const kl = P(R, 1.155, z0 + 0.1);
  k += `<circle cx="${kl[0]}" cy="${kl[1]}" r=".6" fill="#3ca35a"/>`;
  k += wandFeld(z0 + 0.12, z1 - 0.12, 0.78, 0.86, "#15181b");
  k += wandFeld(z0 + 0.14, z1 - 0.14, 0.8, 0.84, "#2b2f34");
  /* Geldscheine in der Ausgabe */
  k += poly([P(R - 0.03, 0.86, z0 + 0.18), P(R - 0.03, 0.86, z1 - 0.18), P(R - 0.03, 0.9, z1 - 0.2), P(R - 0.03, 0.9, z0 + 0.2)], "#8fb4d6");
  k += wandText(z0 + 0.15, z1 - 0.14, 0.7, "Geldausgabe", 2.4, "#ddd");
  /* Spiegelung */
  k += poly([P(R, 1.8, z0 + 0.04), P(R, 1.8, z0 + 0.12), P(R, 0.1, z0 + 0.26), P(R, 0.1, z0 + 0.18)], "#fff", 'opacity=".07"');
  S.teil({ id: "geldautomat", de: "der Geldautomat", syl: "GELD-au-to-mat", it: "il bancomat", itSyl: "BAN-co-mat", en: "cash machine", x: ax, y: ay, steht: true, kunst: um(ax, ay, k),
    tipp: "Am Geldautomaten hebt man mit Karte und PIN Bargeld ab." });
}
{
  /* Überwachungskamera in der Ecke über dem SB-Bereich */
  const [cx, cy] = P(R - 0.1, 2.85, 0.45);
  let k = `<rect x="-1" y="-3" width="2" height="3" fill="#ddd"/><path d="M-5.6 -.4 L3.4 -.4 Q5 -.4 5 1.2 L5 3.4 Q5 4.6 3.4 4.6 L-5.6 4.6 Z" fill="${S.lg("kamera", [[0, "#f4f4f2"], [1, "#c9c9c5"]])}"/>`;
  k += `<rect x="-7.2" y="0" width="2" height="4.2" rx=".6" fill="#2a2d31"/><circle cx="-6.4" cy="2.1" r="1.1" fill="#4a7fc0"/><circle cx="3" cy="1" r=".5" fill="#d23b30"/>`;
  S.teil({ oben: true, id: "ueberwachungskamera", de: "die Überwachungskamera", syl: "Ü-ber-WA-chungs-ka-me-ra", it: "la telecamera di sorveglianza", itSyl: "te-le-CA-me-ra di sor-ve-GLIAN-za", en: "security camera", x: cx, y: cy, kunst: k + flaeche(-7.6, -3.4, 13, 8.4) });
}

/* =====================================================================
   RÜCKWAND — Schild, Uhr
   ===================================================================== */
{
  let k = `<rect x="-46" y="-8" width="92" height="16" rx="1.2" fill="${ROT_V}"/>`;
  k += `<circle cx="-36" cy="0" r="5.4" fill="#fff"/><circle cx="-36" cy="0" r="3.8" fill="${ROT}"/><text x="-36" y="2.3" font-size="6" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">€</text>`;
  k += `<text x="5" y="3.2" font-size="9" text-anchor="middle" fill="#fff" font-family="Arial,Helvetica,sans-serif" font-weight="bold">Stadtsparkasse</text>`;
  S.teil({ id: "schild", de: "das Schild", syl: "SCHILD", it: "l'insegna", itSyl: "in-SE-gna", en: "sign", x: 140, y: 29, kunst: k });
}
{
  let k = `<circle r="7" fill="#c9c2b6"/><circle r="6.2" fill="${S.rg("ziffer", [[0, "#ffffff"], [1, "#efebe4"]])}"/>`;
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6, q = i % 3 ? 4.8 : 4.1; k += `<line x1="${r(Math.sin(a) * 5.5)}" y1="${r(-Math.cos(a) * 5.5)}" x2="${r(Math.sin(a) * q)}" y2="${r(-Math.cos(a) * q)}" stroke="#333" stroke-width="${i % 3 ? 0.3 : 0.55}"/>`; }
  k += `<line x1="0" y1="0" x2="${r(Math.sin(11.25 * Math.PI / 6) * 3)}" y2="${r(-Math.cos(11.25 * Math.PI / 6) * 3)}" stroke="#222" stroke-width=".75" stroke-linecap="round"/><line x1="0" y1="0" x2="${r(Math.sin(3 * Math.PI / 6) * 4.6)}" y2="${r(-Math.cos(3 * Math.PI / 6) * 4.6)}" stroke="#222" stroke-width=".45" stroke-linecap="round"/><circle r=".5" fill="${ROT}"/>`;
  S.teil({ id: "uhr", de: "die Uhr", syl: "UHR", it: "l'orologio", itSyl: "o-ro-LO-gio", en: "clock", x: 214, y: 34, kunst: k });
}

/* =====================================================================
   DER BERATUNGSRAUM (Lupe: Schreibtisch, Stuhl, Bildschirm, Ordner)
   ===================================================================== */
{
  const [ax, ay] = [r((BRx0 + BRx1) / 2), BRy1];
  let k = "";
  const zt = BR.zt;
  /* Regal mit Ordnern an der Rückwand des Raumes */
  const ordner = kiste(-3.55, -2.4, 0, 1.2, zt, zt + 0.35, { vorn: "#e9e4da", deckel: "#f4f0e8" });
  let o = ordner;
  for (let reihe = 0; reihe < 2; reihe++) for (let i = 0; i < 12; i++) {
    const X = -3.5 + i * 0.09, h0 = 0.45 + reihe * 0.4;
    o += poly([P(X, h0, zt + 0.35), P(X + 0.075, h0, zt + 0.35), P(X + 0.075, h0 + 0.32, zt + 0.35), P(X, h0 + 0.32, zt + 0.35)], ["#c8102e", "#2f6db5", "#3d9a5b", "#c8102e", "#f2a900", "#2f6db5"][(i + reihe) % 6]);
    const c = P(X + 0.0375, h0 + 0.12, zt + 0.35);
    o += `<circle cx="${c[0]}" cy="${c[1]}" r=".7" fill="#fff" opacity=".8"/>`;
  }
  k += o;
  /* Bürostuhl hinter dem Schreibtisch */
  const stuhl = (X, z, hinten) => {
    let g = "";
    g += kiste(X - 0.22, X + 0.22, 0.42, 0.48, z - 0.22, z + 0.22, { vorn: "#2d3035", deckel: "#3d4147" });
    const [px, py] = P(X, 0.05, z), [, sy] = P(X, 0.42, z);
    g += `<rect x="${r(px - 0.5)}" y="${sy}" width="1" height="${r(py - sy)}" fill="#555"/><ellipse cx="${px}" cy="${py}" rx="${r(0.25 * sk(z))}" ry="1" fill="#2a2a2a"/>`;
    const zl = hinten ? z - 0.2 : z + 0.2;
    g += kiste(X - 0.21, X + 0.21, 0.55, 1.0, zl - 0.04, zl, { vorn: hinten ? "#2d3035" : "#3d4147", deckel: "#454a50" });
    return g;
  };
  const sBerater = stuhl(-2.7, -1.45, true);
  k += sBerater;
  /* Schreibtisch mit Bildschirm (Rückseite zu uns) */
  const tisch = kiste(-3.35, -2.05, 0.71, 0.75, -1.15, -0.45, { vorn: "#f2efe9", deckel: S.lg("tischplatte", [[0, "#e6e1d8"], [1, "#f6f3ee"]]), seite: "#d8d2c6" }) +
    kiste(-3.32, -3.26, 0, 0.71, -1.1, -0.5, { vorn: "#bfb8ab" }) + kiste(-2.14, -2.08, 0, 0.71, -1.1, -0.5, { vorn: "#bfb8ab", seite: "#a9a294" }) +
    kiste(-3.3, -2.1, 0.3, 0.7, -1.0, -0.98, { vorn: "#e6e1d8" });
  k += tisch;
  const [mx, my] = P(-2.62, 0.75, -0.95);
  const mon = `<rect x="${r(mx - 1.6)}" y="${r(my - 3.6)}" width="3.2" height="3.6" fill="#3a3d42"/><path d="M${r(mx - 7)} ${r(my - 13)} L${r(mx + 7)} ${r(my - 13)} L${r(mx + 7)} ${r(my - 3.4)} L${r(mx - 7)} ${r(my - 3.4)} Z" fill="${ANTHRAZIT}"/><ellipse cx="${mx}" cy="${r(my - 0.2)}" rx="3" ry=".6" fill="#3a3d42"/>`;
  k += mon;
  const [px, py] = P(-3.0, 0.75, -0.65);
  k += `<path d="M${r(px - 3)} ${r(py)} L${r(px + 3)} ${r(py)} L${r(px + 2.4)} ${r(py - 1.4)} L${r(px - 2.4)} ${r(py - 1.4)} Z" fill="#fff"/><path d="M${r(px + 3.4)} ${r(py - 0.3)} L${r(px + 6.4)} ${r(py - 1.2)}" stroke="#1f4f9a" stroke-width=".5"/>`;
  /* zwei Besucherstühle (Lehne zu uns) */
  const sB1 = stuhl(-3.05, -0.1, false), sB2 = stuhl(-2.35, -0.1, false);
  k += sB1 + sB2;
  k += flaeche(BRx0 + 1, BRy0 + 1, BRx1 - BRx0 - 2, BRy1 - BRy0 - 2);
  const rel = (pts) => { const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]); const x0 = Math.min(...xs), y0 = Math.min(...ys); return flaeche(x0 - ax, y0 - ay, Math.max(...xs) - x0, Math.max(...ys) - y0); };
  const unter = [
    { id: "schreibtisch", de: "der Schreibtisch", syl: "SCHREIB-tisch", it: "la scrivania", itSyl: "scri-va-NI-a", en: "desk",
      kunst: rel([P(-3.35, 0.75, -0.45), P(-2.95, 0.3, -0.45)]) },
    { id: "stuhl", de: "der Stuhl", syl: "STUHL", it: "la sedia", itSyl: "SE-dia", en: "chair", kunst: rel([P(-2.56, 1.0, -0.1), P(-2.14, 0.05, -0.1)]),
      tipp: "Im Beratungsraum sitzt man am Tisch und spricht in Ruhe über Geld." },
    { id: "bildschirm", de: "der Bildschirm", syl: "BILD-schirm", it: "lo schermo", itSyl: "SCHER-mo", en: "screen", kunst: rel([[mx - 7, my - 13], [mx + 7, my - 3.4]]) },
    { id: "aktenordner", de: "der Aktenordner", syl: "AK-ten-ord-ner", it: "il raccoglitore", itSyl: "rac-co-gli-TO-re", en: "ring binder", kunst: rel([P(-3.55, 1.2, zt + 0.35), P(-2.45, 0.45, zt + 0.35)]) },
  ].map((u) => Object.assign(u, { x: ax, y: ay }));
  S.teil({ id: "beratungsraum", de: "der Beratungsraum", syl: "be-RA-tungs-raum", it: "la sala consulenza", itSyl: "SA-la con-su-LEN-za", en: "consultation room", x: ax, y: ay, steht: true,
    kunst: um(ax, ay, `<g clip-path="url(#${S.id("raum")})">${k}</g>`), zoom: { x: 0, y: 32, w: 84, h: 56 }, unter,
    tipp: "Für einen Kredit oder ein neues Konto bekommt man einen Termin im Beratungsraum." });
}

/* =====================================================================
   PROSPEKTSTÄNDER und PFLANZE (rechts hinten an der Rückwand)
   ===================================================================== */
{
  const X0 = 1.95, X1 = 2.45, z = 0.35;
  const [ax, ay] = P((X0 + X1) / 2, 0, z);
  let k = schatten(ax, ay, 10, 1.2, 0.28);
  k += kiste(X0, X1, 0, 1.45, z - 0.25, z, { vorn: "#e9e6e0", seite: "#cfcac1", deckel: "#f4f2ee" });
  const farben = [ROT, "#2f6db5", "#3d9a5b", "#f2a900", "#7b4fa3", "#e06a2c"];
  for (let reihe = 0; reihe < 3; reihe++) for (let i = 0; i < 2; i++) {
    const Xa = X0 + 0.04 + i * 0.22, h0 = 0.2 + reihe * 0.42;
    k += poly([P(Xa, h0, z + 0.03), P(Xa + 0.19, h0, z + 0.03), P(Xa + 0.19, h0 + 0.36, z), P(Xa, h0 + 0.36, z)], "#fff", 'stroke="#ccc" stroke-width=".2"');
    const c = P(Xa + 0.02, h0 + 0.33, z + 0.01), d = P(Xa + 0.17, h0 + 0.22, z + 0.01);
    k += `<rect x="${c[0]}" y="${c[1]}" width="${r(d[0] - c[0])}" height="${r(d[1] - c[1])}" fill="${farben[(reihe * 2 + i) % 6]}"/>`;
    const e = P(Xa + 0.02, h0 + 0.16, z + 0.02);
    k += `<rect x="${e[0]}" y="${e[1]}" width="${r((d[0] - c[0]) * 0.8)}" height=".5" fill="#999"/>`;
  }
  const [tx, ty] = P((X0 + X1) / 2, 1.45, z);
  k += `<rect x="${r(tx - 9)}" y="${r(ty - 5)}" width="18" height="5" fill="${ROT_V}"/><text x="${tx}" y="${r(ty - 1.5)}" font-size="2.8" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">Info</text>`;
  S.teil({ id: "prospekt", de: "der Prospekt", syl: "pro-SPEKT", it: "il dépliant", itSyl: "de-pli-ANT", en: "brochure", x: ax, y: ay, steht: true, kunst: um(ax, ay, k),
    tipp: "Im Prospekt steht alles über Konto, Sparen und Kredit." });
}
{
  const [px, py] = P(2.95, 0, 0.35);
  let k = schatten(0, 0, 9, 1.2, 0.3);
  k += `<path d="M-6 0 L6 0 L7 -12 L-7 -12 Z" fill="${S.lg("topf", [[0, "#5a5f66"], [1, "#3a3f45"]], 0, 0, 1, 0)}"/><rect x="-7.4" y="-13" width="14.8" height="1.6" rx=".6" fill="#6b7178"/>`;
  const blatt = (a, l, b) => `<path d="M0 -13 Q${r(Math.sin(a) * l * 0.4 - b)} ${r(-13 - Math.cos(a) * l * 0.5)} ${r(Math.sin(a) * l)} ${r(-13 - Math.cos(a) * l)} Q${r(Math.sin(a) * l * 0.6 + b)} ${r(-13 - Math.cos(a) * l * 0.4)} 0 -13 Z" fill="${S.lg("blatt", [[0, "#5f9e4a"], [1, "#2f6a2c"]])}"/>`;
  for (let i = 0; i < 13; i++) { const a = -1.2 + i * 0.2 + (rnd() - 0.5) * 0.1; k += blatt(a * 0.7, 22 + rnd() * 12 - Math.abs(a) * 6, 2.4); }
  for (let i = 0; i < 6; i++) { const a = -0.9 + i * 0.36; k += `<path d="M0 -13 Q${r(Math.sin(a) * 5)} ${r(-13 - 10)} ${r(Math.sin(a) * 13)} ${r(-13 - Math.cos(a) * 26)}" stroke="#2f5a26" stroke-width=".5" fill="none" opacity=".6"/>`; }
  S.teil({ id: "pflanze", de: "die Pflanze", syl: "PFLAN-ze", it: "la pianta", itSyl: "PIAN-ta", en: "plant", x: px, y: py, steht: true, kunst: k });
}

/* =====================================================================
   DER BANKANGESTELLTE (hinter der Theke)
   ===================================================================== */
{
  const [bx, by] = P(-0.15, 0, 0.35);
  const m = B.mensch({ id: "b01c_bankang", geschlecht: "m", pose: "stehen", blick: -30, frisur: "kurz", haarfarbe: "schwarz", haut: "dunkel", laecheln: true,
    kleidung: { oberteil: { stueck: "hemd", farbe: "#dfe8f2" }, unterteil: { stueck: "anzughose" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" } } }, 1.78 * sk(0.35));
  S.teil({ id: "bankangestellter", de: "der Bankangestellte", syl: "BANK-an-ge-stell-te", it: "l'impiegato di banca", itSyl: "im-pie-GA-to di BAN-ca", en: "bank clerk", x: bx, y: by, kunst: m.svg,
    tipp: "Der Bankangestellte zahlt Geld aus und beantwortet Fragen." });
}

/* =====================================================================
   DER SCHALTER (Servicetheke aus Eiche, helle Platte)
   ===================================================================== */
const TK = { X0: -1.25, X1: 1.5, zh: 0.72, zv: 1.25, H: 1.05 };
{
  const { X0, X1, zh, zv, H } = TK;
  const [ax, ay] = P((X0 + X1) / 2, 0, zv);
  let k = poly([P(X0 - 0.05, 0, zv + 0.14), P(X1 + 0.05, 0, zv + 0.14), P(X1, 0, zv), P(X0, 0, zv)], "#1b120a", 'opacity=".2" filter="url(#bw_weich)"');
  k += kiste(X0, X1, 0, H - 0.04, zh, zv, { vorn: EICHE, seite: "#9c7142" });
  for (let X = X0 + 0.25; X < X1 - 0.1; X += 0.25) { const a = P(X, 0.08, zv), b = P(X, H - 0.05, zv); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#8f6539" stroke-width=".3"/>`; }
  k += kiste(X0, X1, 0, 0.08, zh, zv, { vorn: "#3a3530", seite: "#2c2824" });
  k += kiste(X0, X1, 0.62, 0.68, zh, zv, { vorn: ROT_V, seite: "#a8000b" });
  k += kiste(X0 - 0.03, X1 + 0.03, H - 0.04, H, zh - 0.03, zv + 0.03, { vorn: "#f4f2ee", deckel: S.lg("platte", [[0, "#dedad2"], [1, "#f6f4ef"]]), seite: "#e4e0d8" });
  /* Kassenautomat (Personalseite, links) */
  k += kiste(X0 + 0.05, X0 + 0.5, H, H + 0.32, zh, zh + 0.32, { vorn: ANTHRAZIT, deckel: "#5a6068", seite: "#2c3035" });
  const [kx, ky] = P(X0 + 0.12, H + 0.26, zh + 0.32);
  k += `<rect x="${kx}" y="${ky}" width="5" height="2.4" fill="#5ab7e0"/>`;
  const [sx, sy] = P(X0 + 0.27, H + 0.33, zh + 0.32);
  k += `<rect x="${r(sx - 9)}" y="${r(sy - 6)}" width="18" height="5.2" rx=".6" fill="#fff" stroke="#ccc" stroke-width=".25"/><text x="${sx}" y="${r(sy - 2.2)}" font-size="3" text-anchor="middle" fill="${ROT}" font-family="Arial" font-weight="bold">Kasse</text>`;
  S.teil({ id: "schalter", de: "der Schalter", syl: "SCHAL-ter", it: "lo sportello", itSyl: "spor-TEL-lo", en: "counter", x: ax, y: ay, steht: true, kunst: um(ax, ay, k),
    tipp: "Am Schalter zahlt man Geld ein oder hebt Geld ab." });
}

/* =====================================================================
   AUF DEM SCHALTER: Spardose, Formular, Kugelschreiber, Geldschale mit
   Geldscheinen und Münzen, Kartenlesegerät mit Bankkarte
   ===================================================================== */
const HT = TK.H;
{
  /* DAS SPARSCHWEIN — rote Spardose */
  const [sx, sy] = P(-1.05, HT, 1.1);
  let k = schatten(0, 0, 5, .7, .3);
  k += `<ellipse cx="0" cy="-4.4" rx="5.4" ry="4" fill="${S.rg("schwein", [[0, "#ff6b6b"], [0.6, "#e0303a"], [1, "#a8141f"]], 0.4, 0.35, 0.7)}"/>`;
  k += `<ellipse cx="5.2" cy="-4.4" rx="1.3" ry="1.5" fill="#e0303a"/><circle cx="5.4" cy="-4.6" r=".25" fill="#7a0b12"/><circle cx="5.4" cy="-4" r=".25" fill="#7a0b12"/>`;
  k += `<path d="M2.4 -8 L3.4 -10 L4 -7.6 Z" fill="#c8202a"/><circle cx="3" cy="-5.6" r=".45" fill="#111"/>`;
  k += `<rect x="-3.4" y="-1.4" width="1.4" height="1.6" fill="#b8141f"/><rect x="1.4" y="-1.4" width="1.4" height="1.6" fill="#b8141f"/>`;
  k += `<rect x="-1.6" y="-8.5" width="2.6" height=".5" fill="#6a0a10"/><path d="M-5.4 -4.6 q-1.6 -.6 -1.2 -2" stroke="#e0303a" stroke-width=".5" fill="none"/>`;
  k += `<ellipse cx="-1.6" cy="-6.4" rx="2" ry="1" fill="#fff" opacity=".35"/>`;
  S.teil({ oben: true, id: "sparschwein", de: "das Sparschwein", syl: "SPAR-schwein", it: "il salvadanaio", itSyl: "sal-va-da-NA-io", en: "piggy bank", x: sx, y: sy, steht: true, kunst: k,
    tipp: "Am Weltspartag bringen Kinder ihr Sparschwein zur Bank." });
}
{
  /* DAS FORMULAR — Überweisung, schräg liegend, mit KUGELSCHREIBER */
  const q = [P(-0.82, HT + 0.003, 1.22), P(-0.5, HT + 0.003, 1.24), P(-0.47, HT + 0.003, 0.96), P(-0.78, HT + 0.003, 0.94)];
  const [fx, fy] = P(-0.66, HT, 1.24);
  let k = poly(q, "#fbfbf8", 'stroke="#cfccc4" stroke-width=".2"');
  for (let i = 0; i < 6; i++) { const t = 0.2 + i * 0.12, a = [q[3][0] + (q[0][0] - q[3][0]) * t, q[3][1] + (q[0][1] - q[3][1]) * t], b = [q[2][0] + (q[1][0] - q[2][0]) * t, q[2][1] + (q[1][1] - q[2][1]) * t]; k += `<line x1="${r(a[0] + 1)}" y1="${r(a[1])}" x2="${r(b[0] - 1)}" y2="${r(b[1])}" stroke="${i === 0 ? ROT : "#e3a0a4"}" stroke-width="${i === 0 ? 0.6 : 0.3}"/>`; }
  S.teil({ oben: true, id: "formular", de: "das Formular", syl: "For-mu-LAR", it: "il modulo", itSyl: "MO-du-lo", en: "form", x: fx, y: fy, steht: true, kunst: um(fx, fy, k) + flaeche(q[3][0] - fx, q[3][1] - fy - 1.6, q[1][0] - q[3][0], q[1][1] - q[3][1] + 2.2),
    tipp: "Für eine Überweisung füllt man ein Formular aus – oder macht es online." });
  const [kx, ky] = P(-0.42, HT, 1.2);
  let g = `<path d="M-3.6 -.4 L5.4 -2.6 L5.8 -1.8 L-3.2 .3 Z" fill="${ROT}"/><path d="M5.4 -2.6 L6.8 -2.6 L5.8 -1.8 Z" fill="#ccc"/><rect x="-4.4" y="-.6" width="1.2" height="1" fill="#eee"/>`;
  S.teil({ oben: true, id: "kugelschreiber", de: "der Kugelschreiber", syl: "KU-gel-schrei-ber", it: "la penna", itSyl: "PEN-na", en: "pen", x: kx, y: ky, steht: true, kunst: g + flaeche(-5, -3.6, 12.4, 4.6) });
}
{
  /* DIE GELDSCHALE mit GELDSCHEINEN und MÜNZEN */
  const [gx, gy] = P(-0.08, HT, 1.2);
  let k = `<path d="M-9 0 L9 0 L10.4 -3 L-10.4 -3 Z" fill="${S.lg("schale", [[0, "#6a7078"], [1, "#4a4f55"]])}"/><path d="M-10.4 -3 L10.4 -3 L9.8 -3.6 L-9.8 -3.6 Z" fill="#8a9097"/>`;
  /* Geldscheine: 50 € (orange), 20 € (blau), 10 € (rot) */
  [["#e9a25a", "#c87a32", "50"], ["#8fb4d6", "#5f88b1", "20"], ["#e4949a", "#c25b63", "10"]].forEach(([f, d, w], i) => {
    const x = -8.4 + i * 1.8, y = -3.3 - i * 0.6;
    k += `<path d="M${r(x)} ${r(y)} L${r(x + 11)} ${r(y - 0.6)} L${r(x + 12.2)} ${r(y - 3.4)} L${r(x + 1.2)} ${r(y - 2.8)} Z" fill="${f}" stroke="${d}" stroke-width=".25"/>`;
    k += `<text x="${r(x + 2.6)}" y="${r(y - 0.9)}" font-size="1.7" fill="${d}" font-family="Arial" font-weight="bold" transform="rotate(-3 ${r(x + 2.6)} ${r(y - 0.9)})">${w}</text><circle cx="${r(x + 8)}" cy="${r(y - 1.8)}" r=".9" fill="#fff" opacity=".45"/>`;
  });
  S.teil({ oben: true, id: "geldschein", de: "der Geldschein", syl: "GELD-schein", it: "la banconota", itSyl: "ban-co-NO-ta", en: "banknote", x: gx, y: gy, steht: true, kunst: k,
    tipp: "Euro-Geldscheine gibt es zu 5, 10, 20, 50, 100 und 200 Euro." });
  const [mx, my] = P(0.32, HT, 1.18);
  let m = "";
  [[-2.6, 6, "#c9a227"], [1.2, 4, "#d6b84a"], [4.4, 3, "#b87333"], [-0.4, 2, "#c7c9cc"]].forEach(([x, n, f]) => {
    for (let i = 0; i < n; i++) m += `<ellipse cx="${x}" cy="${r(-0.5 - i * 0.7)}" rx="1.8" ry=".7" fill="${f}" stroke="${i === n - 1 ? "#fff8" : "#7a5a12"}" stroke-width=".15"/>`;
    m += `<ellipse cx="${x}" cy="${r(-0.5 - (n - 1) * 0.7)}" rx="1.1" ry=".35" fill="#fff" opacity=".3"/>`;
  });
  S.teil({ oben: true, id: "muenze", de: "die Münze", syl: "MÜN-ze", it: "la moneta", itSyl: "mo-NE-ta", en: "coin", x: mx, y: my, steht: true, kunst: m + flaeche(-4.8, -5.6, 11.4, 6),
    tipp: "Eine Euro-Münze hat eine europäische und eine nationale Seite." });
}
{
  /* DAS KARTENLESEGERÄT (PIN-Pad) mit der BANKKARTE */
  const [kx, ky] = P(0.62, HT, 1.2);
  let k = schatten(0, 0, 3.4, .6, .3);
  k += `<path d="M-3 0 L3 0 L3.4 -10.4 Q3.4 -11.4 2.4 -11.4 L-2.4 -11.4 Q-3.4 -11.4 -3.4 -10.4 Z" fill="#2a2e33"/>`;
  k += `<rect x="-2.5" y="-10.6" width="5" height="3.2" rx=".3" fill="#9cd3e8"/><text x="0" y="-8.4" font-size="1.3" text-anchor="middle" fill="#0b3b52" font-family="Arial">PIN</text>`;
  for (let i = 0; i < 12; i++) k += `<rect x="${r(-2.2 + (i % 3) * 1.6)}" y="${r(-6.6 + Math.floor(i / 3) * 1.4)}" width="1.1" height=".9" rx=".2" fill="${i === 9 ? "#d23b30" : i === 11 ? "#3ca35a" : "#596068"}"/>`;
  S.teil({ oben: true, id: "kartenlesegeraet", de: "das Kartenlesegerät", syl: "KAR-ten-le-se-ge-rät", it: "il lettore di carte", itSyl: "let-TO-re di CAR-te", en: "card reader", x: kx, y: ky, steht: true, kunst: k,
    tipp: "Die PIN tippt man geheim ein – niemand darf zusehen." });
  /* Bankkarte liegt davor */
  const [bx, by] = P(0.82, HT, 1.24);
  let b = `<path d="M-4 0 L3.4 0 L4.4 -2.6 L-3 -2.6 Z" fill="${S.lg("karte", [[0, "#e8202c"], [1, "#9c0010"]], 0, 0, 1, 0)}" stroke="#7a000b" stroke-width=".2"/>`;
  b += `<rect x="-2.2" y="-2" width="1.6" height="1.1" rx=".2" fill="#e8c35a"/><path d="M-.2 -.6 h3" stroke="#fff" stroke-width=".3" opacity=".8"/>`;
  S.teil({ oben: true, id: "bankkarte", de: "die Bankkarte", syl: "BANK-kar-te", it: "la carta di credito", itSyl: "CAR-ta di CRE-di-to", en: "bank card", x: bx, y: by, steht: true, kunst: b + flaeche(-4.4, -4, 9.4, 4.6),
    tipp: "Mit der Bankkarte (Girocard) zahlt man im Laden und holt Geld am Automaten." });
}

/* =====================================================================
   DIE KUNDIN (vor dem Schalter, rechts) und DIE SITZBANK (vorne links)
   ===================================================================== */
{
  const z = 1.72, [kx, ky] = P(1.12, 0, z);
  const m = B.mensch({ id: "b01c_kundin", geschlecht: "w", pose: "stehen", blick: -118, frisur: "lang", haarfarbe: "rot", haut: "hell",
    kleidung: { oberteil: { stueck: "bluse", farbe: "creme" }, jacke: { stueck: "mantel", farbe: "#7a3b3b" }, unterteil: { stueck: "hose", farbe: "schwarz" }, schuhe: { stueck: "stiefel" }, zubehoer: { stueck: "tasche", farbe: "braun" } } }, 1.68 * sk(z));
  S.teil({ id: "kundin", de: "die Kundin", syl: "KUN-din", it: "la cliente", itSyl: "cli-EN-te", en: "customer", x: kx, y: ky, kunst: m.svg,
    tipp: "Die Kundin sagt: „Ich möchte 200 Euro abheben, bitte.“" });
}
{
  const X0 = -1.75, X1 = -0.55, z0 = 2.1, z1 = 2.45;
  const [ax, ay] = P((X0 + X1) / 2, 0, z1);
  let k = schatten(ax, ay, 34, 2, 0.28);
  for (const X of [X0 + 0.08, X1 - 0.12]) k += kiste(X, X + 0.05, 0, 0.4, z0 + 0.04, z1 - 0.04, { vorn: "#2a2d31", seite: "#1d1f22" });
  k += kiste(X0, X1, 0.4, 0.47, z0, z1, { vorn: "#7a5634", deckel: S.lg("sitz", [[0, "#5f6b78"], [1, "#7a8796"]]), seite: "#5d4027" });
  k += kiste(X0 + 0.02, X1 - 0.02, 0.47, 0.53, z0 + 0.02, z1 - 0.02, { vorn: "#56616d", deckel: S.lg("polster", [[0, "#6c7886"], [1, "#8a97a6"]]), seite: "#4a545f" });
  S.teil({ id: "sitzbank", de: "die Sitzbank", syl: "SITZ-bank", it: "la panchina", itSyl: "pan-CHI-na", en: "bench", x: ax, y: ay, steht: true, kunst: um(ax, ay, k),
    tipp: "„Bank“ hat zwei Bedeutungen: das Geldinstitut und die Sitzbank." });
}

/* =====================================================================
   VORNE: Glaswand des Beratungsraums mit Milchglasband und Tür
   ===================================================================== */
{
  let v = `<rect x="0" y="${BRy0}" width="${BRx1}" height="${r(BRy1 - BRy0)}" fill="${GLAS}"/>`;
  const [, mb0] = P(0, 1.55, 0), [, mb1] = P(0, 1.25, 0);
  v += `<rect x="0" y="${mb0}" width="${BRx1}" height="${r(mb1 - mb0)}" fill="#fff" opacity=".55"/>`;
  v += `<text x="${r(BRx1 / 2)}" y="${r((mb0 + mb1) / 2 + 1.4)}" font-size="3.6" text-anchor="middle" fill="#8a8378" font-family="Arial" letter-spacing="1">BERATUNG</text>`;
  v += `<path d="M6 ${r(BRy1 - 2)} L22 ${BRy0} L28 ${BRy0} L12 ${r(BRy1 - 2)} Z" fill="#fff" opacity=".12"/>`;
  v += `<rect x="0" y="${r(BRy0 - 1.4)}" width="${r(BRx1 + 1)}" height="1.6" fill="#9aa2a8"/>`;
  for (const x of [0, 40, BRx1 - 0.6]) v += `<rect x="${r(x)}" y="${BRy0}" width="1.2" height="${r(BRy1 - BRy0)}" fill="#9aa2a8"/>`;
  v += `<rect x="35.6" y="${r((mb0 + mb1) / 2 + 4)}" width="1" height="8" rx=".4" fill="#d9dde0"/>`;
  S.davor(`<g pointer-events="none">${v}</g>`);
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/bank.js"));
console.log(aus);
