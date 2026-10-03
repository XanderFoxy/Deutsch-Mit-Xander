#!/usr/bin/env node
/* =====================================================================
   HAUSTIERE (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (Heimtierhaltung in Deutschland: Industrieverband
   Heimtierbedarf, Tierschutzbund-Merkblätter zu Kleintieren, Vögeln,
   Fischen, Landschildkröten):
   - Die beliebtesten Heimtiere: Katze, Hund, Kleintiere (Kaninchen,
     Meerschweinchen, Hamster), Ziervögel (Wellensittich), Zierfische im
     Aquarium, Landschildkröten.
   - Kaninchen und Meerschweinchen nie allein und nicht im kleinen Käfig:
     ein Gehege mit Häuschen, Heu und Auslauf. Der Hamster ist nachtaktiv,
     lebt allein in einem großen Käfig mit Laufrad und Schlafhaus.
   - Wellensittiche zu zweit im Vogelkäfig mit Sitzstangen; das Aquarium
     mit Kies, Wasserpflanzen, Filter und Licht; die Griechische
     Landschildkröte im Terrarium mit Wärmelampe.
   - Für Hund und Katze: Körbchen, Näpfe, Kratzbaum, Katzentoilette,
     Leine, Futter, Bürste, Spielzeug.
   Ort: das Wohnzimmer einer tierlieben Familie. Augenhöhe 1,3 m,
   Horizont y = 88; Rückwand 8 m entfernt (40 Einheiten je Meter,
   Fußleiste bei y = 140).
   ===================================================================== */
"use strict";
const path = require("path");
const B = require("../bau");
const { neueSzene, flaeche, schatten, zufall } = B;
const r = B.r;
const { tierKasten } = require("./bauernhof");

const S = neueSzene({ id: "haustiere", titel: "Haustiere", emoji: "🐹", thema: "Tiere", kuerzel: "b18e", fassung: 852 });
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const T = tierKasten(S, 6262);
const rnd = zufall(8080);

const F = 320, HY = 88, E = 1.3, ZW = 8;
const P = (X, Y, Z) => [r(160 + X * F / Z), r(HY + (E - Y) * F / Z)];
const sZ = (Z) => F / Z;
const poly = (pts, fill, extra = "") => `<path d="M${pts.map((q) => q.join(" ")).join("L")}Z" fill="${fill}"${extra}/>`;
const um = (x, y, svg) => `<g transform="translate(${r(-x)} ${r(-y)})">${svg}</g>`;
function kiste(X0, X1, Y0, Y1, Z0, Z1, f) {
  let g = "";
  if (f.s && X0 > 0) g += poly([P(X0, Y0, Z0), P(X0, Y0, Z1), P(X0, Y1, Z1), P(X0, Y1, Z0)], f.s);
  if (f.s && X1 < 0) g += poly([P(X1, Y0, Z0), P(X1, Y0, Z1), P(X1, Y1, Z1), P(X1, Y1, Z0)], f.s);
  if (f.o && Y1 < E) g += poly([P(X0, Y1, Z0), P(X1, Y1, Z0), P(X1, Y1, Z1), P(X0, Y1, Z1)], f.o);
  if (f.v) g += poly([P(X0, Y0, Z0), P(X1, Y0, Z0), P(X1, Y1, Z0), P(X0, Y1, Z0)], f.v);
  return g;
}
const HOLZ = S.lg("holz", [[0, "#c8a070"], [1, "#a47c4c"]]);
const HOLZ_O = S.lg("holzo", [[0, "#dcb888"], [1, "#c8a070"]]);
const HOLZ_S = "#94683e";
const CHROM = S.lg("chrom", [[0, "#f2f4f6"], [0.5, "#b8c0c6"], [1, "#e2e6ea"]], 0, 0, 1, 0);
const gitter = (x0, y0, x1, y1, d, farbe, w = 0.35) => { let g = ""; for (let x = x0 + d; x < x1 - 0.2; x += d) g += `M${r(x)} ${r(y0)}V${r(y1)}`; return `<path d="${g}" stroke="${farbe}" stroke-width="${w}"/>`; };

/* =====================================================================
   KULISSE: Decke, Wand (Raufaser, hell), Fußleiste, Holzdielen
   ===================================================================== */
{
  const [, yd] = P(0, 2.6, ZW), [, yb] = P(0, 0, ZW);
  let g = `<rect x="0" y="0" width="320" height="${yd}" fill="${S.lg("decke", [[0, "#ece8e0"], [1, "#f6f2ea"]])}"/>`;
  g += `<rect x="0" y="${yd}" width="320" height="${r(yb - yd)}" fill="${S.lg("wand", [[0, "#f2e6cc"], [1, "#ead8b6"]])}"/>`;
  g += `<rect x="0" y="${yd}" width="320" height="${r(yb - yd)}" fill="${S.rg("wandlicht", [[0, "#fff8e8", 0.5], [1, "#fff8e8", 0]], 0.3, 0.3, 0.7)}"/>`;
  let pz = "";
  for (let i = 0; i < 160; i++) pz += `<circle cx="${r(rnd() * 320)}" cy="${r(yd + rnd() * (yb - yd))}" r="${r(0.2 + rnd() * 0.3)}" fill="${rnd() < 0.5 ? "#dccaa6" : "#fbf4e2"}" opacity=".6"/>`;
  g += pz;
  g += `<rect x="0" y="${r(yd)}" width="320" height="1.6" fill="#e0d8c8"/>`;
  /* Pendelleuchte über dem Raum */
  const [lx, ly] = P(0.2, 1.95, 5.5);
  g += `<path d="M${lx} 0 V${r(ly - 9)}" stroke="#5a5a5a" stroke-width=".4"/><path d="M${r(lx - 12)} ${ly} Q${r(lx - 11)} ${r(ly - 10)} ${lx} ${r(ly - 10)} Q${r(lx + 11)} ${r(ly - 10)} ${r(lx + 12)} ${ly} Z" fill="${S.lg("lampe", [[0, "#f2e2c0"], [1, "#d8c49a"]])}"/><ellipse cx="${lx}" cy="${ly}" rx="12" ry="2" fill="#fff6d8"/><ellipse cx="${lx}" cy="${r(ly + 1)}" rx="20" ry="5" fill="#fff6d8" opacity=".25" filter="url(#bw_weich)"/>`;
  /* Dielenboden in Fluchtperspektive */
  g += `<path d="M0 ${yb} L320 ${yb} L320 200 L0 200 Z" fill="${S.lg("dielen", [[0, "#a87a4a"], [1, "#c8965e"]])}"/>`;
  let dl = "";
  for (let i = -14; i <= 14; i++) { const a = P(i * 0.3, 0, ZW), b = P(i * 0.3, 0, 3.5); dl += `M${a[0]} ${a[1]}L${b[0]} ${b[1]}`; }
  g += `<path d="${dl}" stroke="#7a5430" stroke-width=".35" opacity=".7"/>`;
  for (let i = 0; i < 70; i++) { const X = -4 + rnd() * 8, Z = 4 + rnd() * 4, a = P(X, 0, Z), b = P(X, 0, Z + 0.6); g += `<path d="M${a[0]} ${a[1]}L${b[0]} ${b[1]}" stroke="#d8aa70" stroke-width=".3" opacity=".5"/>`; }
  g += `<path d="M0 ${yb} L320 ${yb} L320 200 L0 200 Z" fill="${S.lg("dielenlicht", [[0, "#000", 0.15], [0.3, "#000", 0], [1, "#fff", 0.06]])}"/>`;
  g += `<rect x="0" y="${r(yb - 3)}" width="320" height="3" fill="#f6f2ea"/><rect x="0" y="${r(yb - 0.4)}" width="320" height=".6" fill="#c8bca8"/>`;
  /* Teppich unter dem Hundekörbchen */
  g += poly([P(-1.9, 0, 5.8), P(0.4, 0, 5.8), P(0.4, 0, 7.2), P(-1.9, 0, 7.2)], S.lg("teppich", [[0, "#5a7a9a"], [1, "#4a6a8a"]]));
  g += poly([P(-1.8, 0, 5.9), P(0.3, 0, 5.9), P(0.3, 0, 7.1), P(-1.8, 0, 7.1)], "none", ` stroke="#d8e2ea" stroke-width=".5"`);
  S.hinten(g);
}

/* =====================================================================
   1 — DAS FENSTER (links) mit Vorhängen
   ===================================================================== */
{
  const [x0, y0] = P(-3.6, 2.25, ZW), [x1, y1] = P(-2.05, 0.95, ZW);
  let k = `<rect x="${r(x0 - 1.5)}" y="${r(y0 - 1.5)}" width="${r(x1 - x0 + 3)}" height="${r(y1 - y0 + 3)}" fill="#f6f4ee"/>`;
  k += `<rect x="${x0}" y="${y0}" width="${r(x1 - x0)}" height="${r(y1 - y0)}" fill="${S.lg("draussen", [[0, "#8ec4ea"], [0.65, "#cfe6f4"], [0.66, "#9ac07a"], [1, "#7aa85a"]])}"/>`;
  k += `<ellipse cx="${r(x0 + 14)}" cy="${r(y0 + 30)}" rx="10" ry="8" fill="#5a8a44"/><ellipse cx="${r(x0 + 44)}" cy="${r(y0 + 32)}" rx="12" ry="7" fill="#4f7a3a"/><rect x="${r(x0 + 30)}" y="${r(y0 + 26)}" width="8" height="7" fill="#e8dcc8"/><path d="M${r(x0 + 29)} ${r(y0 + 26)} l5 -4 l5 4 Z" fill="#a8503a"/>`;
  k += `<path d="M${r((x0 + x1) / 2)} ${y0} V${y1} M${x0} ${r(y0 + (y1 - y0) * 0.38)} H${x1}" stroke="#f6f4ee" stroke-width="1.6"/>`;
  k += `<path d="M${r(x0 + 3)} ${r(y1 - 3)} L${r(x0 + 12)} ${r(y0 + 3)} L${r(x0 + 17)} ${r(y0 + 3)} L${r(x0 + 8)} ${r(y1 - 3)} Z" fill="#fff" opacity=".25"/>`;
  k += `<rect x="${r(x0 - 3)}" y="${r(y1 + 1.4)}" width="${r(x1 - x0 + 6)}" height="2" fill="#e8e4dc"/>`;
  /* Vorhänge links und rechts */
  const vh = (x, sx) => `<path d="M${r(x)} ${r(y0 - 4)} Q${r(x + sx * 7)} ${r((y0 + y1) / 2)} ${r(x + sx * 4)} ${r(y1 + 8)} L${r(x - sx * 3)} ${r(y1 + 8)} Z" fill="${S.lg("vorhang", [[0, "#c8584a"], [0.5, "#e07a64"], [1, "#b84a3c"]], 0, 0, 1, 0)}"/>`;
  k += vh(x0 - 1, 1) + vh(x1 + 1, -1);
  k += `<rect x="${r(x0 - 6)}" y="${r(y0 - 5.4)}" width="${r(x1 - x0 + 12)}" height="1.4" rx=".7" fill="#7a6a5a"/>`;
  const cx = (x0 + x1) / 2;
  S.teil({ id: "fenster", de: "das Fenster", syl: "FENS-ter", it: "la finestra", itSyl: "fi-NE-stra", en: "window", x: r(cx), y: r(y1 + 3.4), kunst: um(cx, y1 + 3.4, k) });
}

/* =====================================================================
   2 — DIE LEINE am Haken, DAS REGAL (Lupe: Futterdose, Bürste, Spielmaus)
   ===================================================================== */
{
  const [x, y] = P(-1.85, 1.65, ZW);
  let k = `<rect x="-2.4" y="-1.4" width="4.8" height="2.4" rx=".6" fill="#8a6a44"/><circle cx="0" cy="0" r=".7" fill="#c4ccd2"/>`;
  k += `<path d="M0 .6 Q-2.6 8 -.6 15 Q1.6 9 0 .6" stroke="#d23b30" stroke-width="1" fill="none"/><path d="M-.6 15 l0 3" stroke="#d23b30" stroke-width="1"/><rect x="-1.4" y="17.4" width="1.8" height="2.4" rx=".5" fill="${CHROM}"/>`;
  k += `<path d="M.6 1 Q3.6 6 1.4 10 Q-.6 6 .6 1" stroke="#2a6ab0" stroke-width="1.6" fill="none"/><circle cx="1.6" cy="10.4" r=".7" fill="#e8c020"/>`;
  S.teil({ id: "leine", de: "die Leine", syl: "LEI-ne", it: "il guinzaglio", itSyl: "guin-ZA-glio", en: "lead", x, y: y + 20, kunst: um(0, 20, k),
    tipp: "Rote Leine und blaues Halsband – gleich geht es mit dem Hund raus." });
}
{
  const X0 = -1.5, X1 = -0.55, Y = 1.75, Z = ZW;
  const [x0, y0] = P(X0, Y, Z), [x1] = P(X1, Y, Z);
  let k = `<rect x="${x0}" y="${y0}" width="${r(x1 - x0)}" height="2" fill="${HOLZ}"/><rect x="${x0}" y="${y0}" width="${r(x1 - x0)}" height=".6" fill="#e2c49a"/>`;
  k += `<path d="M${r(x0 + 4)} ${r(y0 + 2)} l0 3 l3 -3 M${r(x1 - 4)} ${r(y0 + 2)} l0 3 l-3 -3" stroke="#5a5a5a" stroke-width=".5" fill="none"/>`;
  /* Futterdose (Katzenfutter), Bürste, Spielmaus, Leckerli-Glas */
  const FD = [x0 + 6, y0];
  k += `<rect x="${r(FD[0] - 3)}" y="${r(y0 - 5)}" width="6" height="5" rx=".6" fill="${CHROM}"/><rect x="${r(FD[0] - 3)}" y="${r(y0 - 4)}" width="6" height="3" fill="#e8742a"/><path d="M${r(FD[0] - 1.6)} ${r(y0 - 3.2)} l1 -.8 l.6 .8 l1 -.8" stroke="#fff" stroke-width=".3" fill="none"/><ellipse cx="${r(FD[0])}" cy="${r(y0 - 5)}" rx="3" ry=".5" fill="#dfe4e8"/>`;
  const BU = [x0 + 15, y0];
  k += `<rect x="${r(BU[0] - 4.6)}" y="${r(y0 - 1.6)}" width="6" height="1.6" rx=".7" fill="#8a5a2a"/><rect x="${r(BU[0] + 1)}" y="${r(y0 - 1.2)}" width="3.6" height="1" rx=".4" fill="#6a4020"/><path d="M${r(BU[0] - 4)} ${r(y0 - 1.6)} v-1.2 M${r(BU[0] - 3)} ${r(y0 - 1.6)} v-1.2 M${r(BU[0] - 2)} ${r(y0 - 1.6)} v-1.2 M${r(BU[0] - 1)} ${r(y0 - 1.6)} v-1.2 M${r(BU[0])} ${r(y0 - 1.6)} v-1.2" stroke="#f2f0e8" stroke-width=".35"/>`;
  const SM = [x0 + 25, y0];
  k += `<ellipse cx="${r(SM[0])}" cy="${r(y0 - 1.3)}" rx="2.4" ry="1.4" fill="#9a9aa2"/><circle cx="${r(SM[0] + 2.2)}" cy="${r(y0 - 1.8)}" r=".8" fill="#c8b0b4"/><circle cx="${r(SM[0] + 2.9)}" cy="${r(y0 - 1.4)}" r=".25" fill="#141414"/><path d="M${r(SM[0] - 2.4)} ${r(y0 - 1)} q-2 1 -3 -.4" stroke="#d23b30" stroke-width=".35" fill="none"/>`;
  k += `<rect x="${r(x1 - 7)}" y="${r(y0 - 6)}" width="4.4" height="6" rx="1" fill="#e2f0f4" opacity=".7" stroke="#9ab0b8" stroke-width=".3"/><rect x="${r(x1 - 7.4)}" y="${r(y0 - 7)}" width="5.2" height="1.4" rx=".5" fill="#d23b30"/>`;
  for (let i = 0; i < 6; i++) k += `<rect x="${r(x1 - 6.4 + (i % 3) * 1.2)}" y="${r(y0 - 4.6 + Math.floor(i / 3) * 1.8)}" width="1" height="1.4" rx=".3" fill="#a8683a"/>`;
  const cx = (x0 + x1) / 2;
  S.teil({ id: "regal", de: "das Regal", syl: "re-GAL", it: "lo scaffale", itSyl: "scaf-FA-le", en: "shelf", x: r(cx), y: r(y0 + 2), kunst: um(cx, y0 + 2, k),
    zoom: { x: r(x0 - 3), y: r(y0 - 18), w: r(x1 - x0 + 6), h: r((x1 - x0 + 6) * 2 / 3) },
    unter: [
      { id: "futterdose", de: "die Futterdose", syl: "FUT-ter-do-se", it: "il barattolo di cibo", itSyl: "ba-RAT-to-lo di CI-bo", en: "food tin", x: r(FD[0]), y: r(y0), kunst: flaeche(-3.4, -5.6, 6.8, 5.8), tipp: "In der Futterdose ist Nassfutter für die Katze." },
      { id: "buerste", de: "die Bürste", syl: "BÜRS-te", it: "la spazzola", itSyl: "SPAZ-zo-la", en: "brush", x: r(BU[0]), y: r(y0), kunst: flaeche(-5, -3.4, 10, 3.6), tipp: "Mit der Bürste kämmt man lose Haare aus dem Fell." },
      { id: "spielmaus", de: "die Spielmaus", syl: "SPIEL-maus", it: "il topolino", itSyl: "to-po-LI-no", en: "toy mouse", x: r(SM[0]), y: r(y0), kunst: flaeche(-5.6, -3.4, 9, 3.6), tipp: "Eine Maus aus Stoff – die Katze jagt sie durch die ganze Wohnung." },
    ],
    tipp: "Auf dem Regal steht das Zubehör für die Tiere." });
}

/* =====================================================================
   3 — DAS BILD, DIE UHR, DER KALENDER, DAS POSTER
   ===================================================================== */
{
  const [x0, y0] = P(-0.3, 2.2, ZW), [x1, y1] = P(0.75, 1.55, ZW);
  let k = `<rect x="${r(x0 - 1.2)}" y="${r(y0 - 1.2)}" width="${r(x1 - x0 + 2.4)}" height="${r(y1 - y0 + 2.4)}" fill="#6a4a2a"/><rect x="${x0}" y="${y0}" width="${r(x1 - x0)}" height="${r(y1 - y0)}" fill="${S.lg("bildhimmel", [[0, "#f2d8a0"], [1, "#e8b878"]])}"/>`;
  const w = x1 - x0, h = y1 - y0;
  k += `<path d="M${x0} ${r(y0 + h * 0.7)} Q${r(x0 + w * 0.4)} ${r(y0 + h * 0.6)} ${x1} ${r(y0 + h * 0.66)} L${x1} ${y1} L${x0} ${y1} Z" fill="#8aa85a"/>`;
  /* ein Pferd auf der Koppel (Ölbild) */
  k += `<g transform="translate(${r(x0 + w * 0.5)} ${r(y0 + h * 0.86)}) scale(${r(w / 400 * 1.1)})">${T.pferd(1, 1).replace(/<ellipse[^>]*filter="url\(#bw_weich\)"\/>/, "")}</g>`;
  S.teil({ id: "bild", de: "das Bild", syl: "BILD", it: "il quadro", itSyl: "QUA-dro", en: "picture", x: r((x0 + x1) / 2), y: r(y1 + 1.2), kunst: um((x0 + x1) / 2, y1 + 1.2, k) });
}
{
  const [x, y] = P(1.25, 2.05, ZW);
  let k = `<circle r="6.4" fill="#2a2a2a"/><circle r="5.6" fill="${S.rg("zifferblatt", [[0, "#ffffff"], [1, "#ece8e0"]])}"/>`;
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; k += `<line x1="${r(Math.sin(a) * 4.8)}" y1="${r(-Math.cos(a) * 4.8)}" x2="${r(Math.sin(a) * (i % 3 ? 4.2 : 3.6))}" y2="${r(-Math.cos(a) * (i % 3 ? 4.2 : 3.6))}" stroke="#2a2a2a" stroke-width="${i % 3 ? 0.3 : 0.6}"/>`; }
  k += `<line x1="0" y1="0" x2="${r(Math.sin(4 * Math.PI / 6) * 2.8)}" y2="${r(-Math.cos(4 * Math.PI / 6) * 2.8)}" stroke="#1a1a1a" stroke-width=".7" stroke-linecap="round"/><line x1="0" y1="0" x2="0" y2="-4.4" stroke="#1a1a1a" stroke-width=".45" stroke-linecap="round"/><circle r=".5" fill="#d23b30"/>`;
  S.teil({ id: "uhr", de: "die Uhr", syl: "UHR", it: "l'orologio", itSyl: "o-ro-LO-gio", en: "clock", x, y, kunst: k,
    tipp: "Um vier Uhr bekommen die Tiere ihr Futter." });
}
{
  const [x0, y0] = P(1.75, 2.05, ZW), [x1, y1] = P(2.3, 1.3, ZW);
  const w = x1 - x0, h = y1 - y0;
  let k = `<rect x="${x0}" y="${y0}" width="${r(w)}" height="${r(h)}" fill="#fff" stroke="#d0ccc4" stroke-width=".3"/><rect x="${x0}" y="${y0}" width="${r(w)}" height="${r(h * 0.42)}" fill="#7aa8c8"/>`;
  k += `<g transform="translate(${r(x0 + w / 2)} ${r(y0 + h * 0.38)}) scale(${r(w / 34)})">${T.katze(1, 1, { art: "grau", pose: "liegen" }).replace(/<ellipse[^>]*filter="url\(#bw_weich\)"\/>/, "")}</g>`;
  k += `<text x="${r(x0 + w / 2)}" y="${r(y0 + h * 0.52)}" font-size="2" text-anchor="middle" fill="#333" font-family="Arial" font-weight="bold">MÄRZ</text>`;
  for (let i = 0; i < 20; i++) { const cx = x0 + 2 + (i % 5) * (w - 4) / 4.4, cy = y0 + h * 0.62 + Math.floor(i / 5) * h * 0.09; k += `<rect x="${r(cx - 0.8)}" y="${r(cy - 0.6)}" width="1.6" height="1.2" fill="${i === 12 ? "#d23b30" : "#e8e4dc"}"/>`; }
  k += `<path d="M${r(x0 + w * 0.3)} ${r(y0 - 1)} v2 M${r(x0 + w * 0.7)} ${r(y0 - 1)} v2" stroke="#555" stroke-width=".4"/>`;
  S.teil({ id: "kalender", de: "der Kalender", syl: "Ka-LEN-der", it: "il calendario", itSyl: "ca-len-DA-rio", en: "calendar", x: r(x0 + w / 2), y: r(y1), kunst: um(x0 + w / 2, y1, k),
    tipp: "Rot markiert: Am Dienstag geht die Katze zum Tierarzt." });
}
{
  const [x0, y0] = P(2.6, 2.15, ZW), [x1, y1] = P(3.45, 1.2, ZW);
  const w = x1 - x0, h = y1 - y0;
  let k = `<rect x="${x0}" y="${y0}" width="${r(w)}" height="${r(h)}" fill="${S.lg("poster", [[0, "#2a4a6a"], [1, "#1a2a40"]])}"/>`;
  k += `<g transform="translate(${r(x0 + w * 0.42)} ${r(y0 + h * 0.8)}) scale(${r(w / 80)})">${T.hund(1, 1, { art: "beagle", pose: "sitzen" }).replace(/<ellipse[^>]*filter="url\(#bw_weich\)"\/>/, "")}</g>`;
  k += `<text x="${r(x0 + w / 2)}" y="${r(y0 + 5)}" font-size="3.2" text-anchor="middle" fill="#f2c62e" font-family="Arial" font-weight="bold">HUNDERASSEN</text>`;
  k += `<text x="${r(x0 + w / 2)}" y="${r(y1 - 2)}" font-size="2.2" text-anchor="middle" fill="#fff" font-family="Arial">Der Beagle</text>`;
  for (const [x, y] of [[x0 + 1, y0 + 1], [x1 - 1, y0 + 1]]) k += `<circle cx="${r(x)}" cy="${r(y)}" r=".5" fill="#c4ccd2"/>`;
  S.teil({ id: "poster", de: "das Poster", syl: "POS-ter", it: "il poster", itSyl: "PO-ster", en: "poster", x: r(x0 + w / 2), y: r(y1), kunst: um(x0 + w / 2, y1, k) });
}

/* =====================================================================
   4 — DIE KOMMODE mit AQUARIUM (Lupe) und HAMSTERKÄFIG (Lupe)
   ===================================================================== */
const KO = { X0: -1.55, X1: 0.75, Y: 0.8, Z0: 7.45, Z1: 8 };
{
  let k = "";
  const gp = P((KO.X0 + KO.X1) / 2, 0, KO.Z0 + 0.2);
  k += kiste(KO.X0, KO.X1, 0.08, KO.Y, KO.Z0, KO.Z1, { o: HOLZ_O, v: HOLZ });
  const [a0, a1] = [P(KO.X0, 0.08, KO.Z0), P(KO.X1, KO.Y, KO.Z0)];
  for (const X of [KO.X0 + 0.05, KO.X1 - 0.05]) { const p = P(X, 0, KO.Z0 + 0.03), q = P(X, 0.08, KO.Z0 + 0.03); k += `<path d="M${p[0]} ${p[1]} L${q[0]} ${q[1]}" stroke="#5a3a1a" stroke-width="1.6"/>`; }
  /* drei Schubladen mit Griffen */
  const n = 3, wX = (KO.X1 - KO.X0) / n;
  for (let i = 0; i < n; i++) {
    const p = P(KO.X0 + i * wX + 0.03, KO.Y - 0.05, KO.Z0), q = P(KO.X0 + (i + 1) * wX - 0.03, 0.12, KO.Z0);
    k += `<rect x="${p[0]}" y="${p[1]}" width="${r(q[0] - p[0])}" height="${r(q[1] - p[1])}" fill="none" stroke="#8a6440" stroke-width=".5"/>`;
    k += `<rect x="${r((p[0] + q[0]) / 2 - 3)}" y="${r(p[1] + 4)}" width="6" height="1.2" rx=".6" fill="${CHROM}"/>`;
  }
  k += `<rect x="${a0[0]}" y="${a1[1]}" width="${r(a1[0] - a0[0])}" height="1" fill="#fff" opacity=".2"/>`;
  S.teil({ id: "kommode", de: "die Kommode", syl: "Kom-MO-de", it: "il cassettone", itSyl: "cas-set-TO-ne", en: "chest of drawers", x: gp[0], y: gp[1], steht: true, kunst: um(gp[0], gp[1], k) });
}
{
  /* Aquarium (60 Liter) auf der Kommode */
  const X0 = KO.X0 + 0.05, X1 = X0 + 0.9, Y0 = KO.Y, Y1 = KO.Y + 0.48, Z = KO.Z0 + 0.12;
  const [x0, y0] = P(X0, Y1, Z), [x1, y1] = P(X1, Y0, Z), w = x1 - x0, h = y1 - y0;
  let k = `<rect x="${x0}" y="${r(y0 - 2.4)}" width="${r(w)}" height="2.4" rx=".6" fill="#2a2a2a"/><rect x="${r(x0 + 2)}" y="${r(y0 - 0.8)}" width="${r(w - 4)}" height=".5" fill="#f6f2c8"/>`;
  k += `<rect x="${x0}" y="${y0}" width="${r(w)}" height="${r(h)}" fill="${S.lg("aqua", [[0, "#8ac8d8"], [0.6, "#4a9ab0"], [1, "#2a6a80"]])}"/>`;
  k += `<rect x="${x0}" y="${r(y0 + 1.6)}" width="${r(w)}" height="1" fill="#c8eef6" opacity=".7"/>`;
  /* Kies, Pflanzen, Stein, Filter */
  k += `<path d="M${x0} ${y1} L${x0} ${r(y1 - 3)} Q${r(x0 + w / 2)} ${r(y1 - 4.6)} ${x1} ${r(y1 - 2.4)} L${x1} ${y1} Z" fill="${S.lg("kies", [[0, "#d8c49a"], [1, "#a8946a"]])}"/>`;
  for (let i = 0; i < 40; i++) k += `<circle cx="${r(x0 + 1 + rnd() * (w - 2))}" cy="${r(y1 - 0.6 - rnd() * 2.4)}" r=".35" fill="${["#c8b48a", "#8a7a5a", "#e8dcc0"][Math.floor(rnd() * 3)]}"/>`;
  const PF = [x0 + w * 0.24, y1 - 3];
  let pf = "";
  for (let i = 0; i < 7; i++) { const x = PF[0] - 3 + i, hh = 8 + rnd() * 8; pf += `M${r(x)} ${r(PF[1])} q${r(-1 + rnd() * 2)} ${r(-hh / 2)} ${r(-1.6 + rnd() * 3.2)} ${r(-hh)}`; }
  k += `<path d="${pf}" stroke="#3a9a4a" stroke-width="1.1" fill="none" stroke-linecap="round"/><path d="${pf}" stroke="#7ad06a" stroke-width=".35" fill="none" transform="translate(.3 0)"/>`;
  let pf2 = "";
  for (let i = 0; i < 5; i++) { const x = x0 + w * 0.78 + i * 1.2, hh = 6 + rnd() * 6; pf2 += `M${r(x)} ${r(y1 - 2.6)} q${r(rnd() * 2)} ${r(-hh / 2)} ${r(-1 + rnd() * 2)} ${r(-hh)}`; }
  k += `<path d="${pf2}" stroke="#5aaa3a" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
  k += `<ellipse cx="${r(x0 + w * 0.55)}" cy="${r(y1 - 3.4)}" rx="4" ry="2" fill="#7a7a7a"/><ellipse cx="${r(x0 + w * 0.54)}" cy="${r(y1 - 4.2)}" rx="2.4" ry=".8" fill="#a8a8a8"/>`;
  k += `<rect x="${r(x1 - 3.4)}" y="${r(y0 + 2)}" width="2.2" height="8" rx=".6" fill="#3a3a3a"/>`;
  for (let i = 0; i < 6; i++) k += `<circle cx="${r(x1 - 2.2 + Math.sin(i) * 0.4)}" cy="${r(y0 + 10 + i * 1.6)}" r="${r(0.3 + i * 0.05)}" fill="none" stroke="#e8f6fa" stroke-width=".2"/>`;
  /* Goldfische und Neonsalmler */
  const fischlein = (x, y, l, farbe, dir) => `<g transform="translate(${r(x)} ${r(y)}) scale(${dir} 1)"><path d="M${r(-l / 2)} 0 L${r(-l * 0.8)} ${r(-l * 0.25)} L${r(-l * 0.8)} ${r(l * 0.25)} Z" fill="${farbe}" opacity=".85"/><ellipse cx="0" cy="0" rx="${r(l / 2)}" ry="${r(l * 0.24)}" fill="${farbe}"/><circle cx="${r(l * 0.3)}" cy="${r(-l * 0.04)}" r="${r(l * 0.05)}" fill="#141414"/></g>`;
  const GF = [x0 + w * 0.42, y0 + h * 0.4];
  k += fischlein(GF[0], GF[1], 5, "#f07a2a", 1) + fischlein(x0 + w * 0.7, y0 + h * 0.55, 4.2, "#f8a040", -1);
  for (const [fx, fy] of [[0.2, 0.3], [0.28, 0.36], [0.62, 0.26], [0.56, 0.34]]) k += `<g transform="translate(${r(x0 + w * fx)} ${r(y0 + h * fy)})"><ellipse cx="0" cy="0" rx="1.2" ry=".35" fill="#4ac8e8"/><rect x="-.6" y=".05" width="1.2" height=".25" fill="#e8302a"/></g>`;
  /* Glasrahmen und Spiegelung */
  k += `<path d="M${r(x0 + 3)} ${r(y1 - 1)} L${r(x0 + 9)} ${r(y0 + 2)} L${r(x0 + 12)} ${r(y0 + 2)} L${r(x0 + 6)} ${r(y1 - 1)} Z" fill="#fff" opacity=".2"/>`;
  k += `<rect x="${x0}" y="${y0}" width="${r(w)}" height="${r(h)}" fill="none" stroke="#2a2a2a" stroke-width=".8"/><rect x="${r(x0 - 0.5)}" y="${r(y1 - 0.6)}" width="${r(w + 1)}" height="1.4" fill="#2a2a2a"/>`;
  const cx = (x0 + x1) / 2;
  S.teil({ id: "aquarium", de: "das Aquarium", syl: "A-QUA-ri-um", it: "l'acquario", itSyl: "ac-QUA-rio", en: "aquarium", x: r(cx), y: r(y1 + 0.8), kunst: um(cx, y1 + 0.8, k),
    zoom: { x: r(x0 - 2), y: r(y0 - 4), w: r(w + 4), h: r((w + 4) * 2 / 3) },
    unter: [
      { id: "goldfisch", de: "der Goldfisch", syl: "GOLD-fisch", it: "il pesce rosso", itSyl: "PE-sce ROS-so", en: "goldfish", x: r(GF[0]), y: r(GF[1] + 2), kunst: flaeche(-5, -4, 9, 4.4), tipp: "Goldfische können über zehn Jahre alt werden." },
      { id: "wasserpflanze", de: "die Wasserpflanze", syl: "WAS-ser-pflan-ze", it: "la pianta acquatica", itSyl: "PIAN-ta ac-QUA-ti-ca", en: "water plant", x: r(PF[0]), y: r(PF[1]), kunst: flaeche(-5, -14, 9, 14), tipp: "Wasserpflanzen machen Sauerstoff für die Fische." },
    ],
    tipp: "Im Aquarium sorgen Filter und Licht für sauberes Wasser." });
}
{
  /* Hamsterkäfig mit Laufrad und Schlafhaus */
  const X0 = -0.45, X1 = 0.62, Y0 = KO.Y, Y1 = KO.Y + 0.42, Z = KO.Z0 + 0.1;
  const [x0, y0] = P(X0, Y1, Z), [x1, y1] = P(X1, Y0, Z), w = x1 - x0, h = y1 - y0;
  let k = `<rect x="${x0}" y="${r(y1 - 4)}" width="${r(w)}" height="4" rx=".6" fill="${S.lg("wanne", [[0, "#4a9ad0"], [1, "#2a6aa0"]])}"/>`;
  k += `<rect x="${r(x0 + 0.6)}" y="${r(y0 + 0.6)}" width="${r(w - 1.2)}" height="${r(h - 4.6)}" fill="#f6f2e6" opacity=".25"/>`;
  k += `<path d="M${x0} ${r(y1 - 3.6)} Q${r(x0 + w / 2)} ${r(y1 - 5.2)} ${x1} ${r(y1 - 3.6)} Z" fill="#f2e6c4"/>`;
  /* Laufrad */
  const LR = [x0 + w * 0.72, y1 - 4 - 6.2];
  k += `<path d="M${r(LR[0])} ${r(LR[1])} L${r(LR[0] + 1.6)} ${r(y1 - 4)} M${r(LR[0])} ${r(LR[1])} L${r(LR[0] - 1.6)} ${r(y1 - 4)}" stroke="#7a848a" stroke-width=".6"/>`;
  k += `<circle cx="${r(LR[0])}" cy="${r(LR[1])}" r="5.6" fill="none" stroke="#e85a8a" stroke-width="1.2"/><circle cx="${r(LR[0])}" cy="${r(LR[1])}" r="4.6" fill="none" stroke="#f2a0c0" stroke-width=".4"/>`;
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; k += `<path d="M${r(LR[0])} ${r(LR[1])} L${r(LR[0] + Math.cos(a) * 5)} ${r(LR[1] + Math.sin(a) * 5)}" stroke="#e85a8a" stroke-width=".25"/>`; }
  /* Schlafhaus aus Holz */
  k += `<rect x="${r(x0 + 2)}" y="${r(y1 - 9.4)}" width="9" height="5.4" fill="${HOLZ}"/><path d="M${r(x0 + 1.4)} ${r(y1 - 9.4)} L${r(x0 + 6.5)} ${r(y1 - 12.4)} L${r(x0 + 11.6)} ${r(y1 - 9.4)} Z" fill="#8a5a30"/><path d="M${r(x0 + 4.6)} ${r(y1 - 4)} v-2.4 a1.9 1.9 0 0 1 3.8 0 v2.4 Z" fill="#2a1a0e"/>`;
  /* Hamster am Napf */
  const HA = [x0 + w * 0.46, y1 - 4.2];
  k += `<ellipse cx="${r(HA[0] + 4)}" cy="${r(HA[1] - 0.2)}" rx="1.8" ry=".6" fill="${CHROM}"/><circle cx="${r(HA[0] + 3.6)}" cy="${r(HA[1] - 0.6)}" r=".35" fill="#c8a040"/><circle cx="${r(HA[0] + 4.4)}" cy="${r(HA[1] - 0.6)}" r=".35" fill="#8a6a2a"/>`;
  k += `<g transform="translate(${r(HA[0])} ${r(HA[1])})">${T.hamster(sZ(Z) / 100, 1)}</g>`;
  /* Trinkflasche und Gitter */
  k += `<rect x="${r(x1 - 2.2)}" y="${r(y0 + 2)}" width="1.6" height="6" rx=".6" fill="#cfe8f2" opacity=".85" stroke="#7aa0b0" stroke-width=".2"/><path d="M${r(x1 - 1.4)} ${r(y0 + 8)} l-.8 2.4" stroke="#9aa3aa" stroke-width=".4"/>`;
  k += gitter(x0, y0, x1, y1 - 4, 1.5, "#c4ccd2", 0.3);
  k += `<path d="M${x0} ${y0} H${x1} M${x0} ${r(y0 + h * 0.45)} H${x1}" stroke="#c4ccd2" stroke-width=".5"/><rect x="${x0}" y="${y0}" width="${r(w)}" height="${r(h - 4)}" fill="none" stroke="#aab2b8" stroke-width=".6"/>`;
  const cx = (x0 + x1) / 2;
  S.teil({ id: "kaefig", de: "der Käfig", syl: "KÄ-fig", it: "la gabbia", itSyl: "GAB-bia", en: "cage", x: r(cx), y: r(y1 + 0.6), kunst: um(cx, y1 + 0.6, k),
    zoom: { x: r(x0 - 2), y: r(y0 - 3), w: r(w + 4), h: r((w + 4) * 2 / 3) },
    unter: [
      { id: "hamster", de: "der Hamster", syl: "HAMS-ter", it: "il criceto", itSyl: "cri-CE-to", en: "hamster", x: r(HA[0]), y: r(HA[1] + 0.4), kunst: flaeche(-3, -4.4, 6.4, 4.8), tipp: "Der Hamster stopft Futter in seine Backentaschen." },
      { id: "laufrad", de: "das Laufrad", syl: "LAUF-rad", it: "la ruota", itSyl: "RUO-ta", en: "hamster wheel", x: r(LR[0]), y: r(LR[1] + 6), kunst: flaeche(-6, -12, 12, 12), tipp: "Nachts läuft der Hamster im Laufrad viele Kilometer." },
    ],
    tipp: "Darin schläft der Hamster am Tag." });
}

/* =====================================================================
   5 — DER VOGELKÄFIG mit zwei WELLENSITTICHEN
   ===================================================================== */
const VK = {};
{
  const X = 1.3, Z = 7.5, s = sZ(Z), [x, y] = P(X, 0, Z), m = (v) => r(v * s);
  let k = schatten(0, 0.2, m(0.25), 1, 0.3);
  /* Ständer */
  k += `<path d="M${m(-0.22)} 0 L0 ${m(-0.08)} L${m(0.22)} 0" stroke="#3a3a3a" stroke-width="1" fill="none"/><rect x="${m(-0.015)}" y="${m(-1.0)}" width="${m(0.03)}" height="${m(0.95)}" fill="#3a3a3a"/>`;
  /* Käfig: Bodenschale, Rückseite (Gitter), Sitzstangen, Napf */
  const yb = -1.0, yt = -1.62, bw = 0.24;
  k += `<rect x="${m(-bw)}" y="${m(yb - 0.07)}" width="${m(2 * bw)}" height="${m(0.07)}" rx="1" fill="#e8e4dc"/>`;
  k += `<path d="M${m(-bw)} ${m(yb - 0.07)} L${m(-bw)} ${m(yt + 0.12)} Q0 ${m(yt - 0.08)} ${m(bw)} ${m(yt + 0.12)} L${m(bw)} ${m(yb - 0.07)} Z" fill="#f6f2ea" opacity=".2"/>`;
  k += `<path d="M${m(-bw)} ${m(-1.32)} H${m(bw)} M${m(-bw)} ${m(-1.18)} H${m(bw * 0.2)}" stroke="#b8946a" stroke-width="1"/>`;
  k += `<rect x="${m(bw - 0.08)}" y="${m(-1.12)}" width="${m(0.06)}" height="${m(0.04)}" fill="#e8c020"/><circle cx="${m(-bw + 0.06)}" cy="${m(-1.5)}" r="1.4" fill="#e85a8a"/><path d="M${m(-bw + 0.06)} ${m(-1.58)} v-2" stroke="#999" stroke-width=".3"/>`;
  k += `<circle cx="0" cy="${m(yt - 0.06)}" r="1.2" fill="none" stroke="#c4ccd2" stroke-width=".6"/>`;
  VK.stange = [x, y + m(-1.32)];
  VK.stange2 = [x + m(-bw * 0.4), y + m(-1.18)];
  VK.box = [m(-bw), m(yt - 0.1), m(bw), m(yb - 0.07)];
  S.teil({ id: "vogelkaefig", de: "der Vogelkäfig", syl: "VO-gel-kä-fig", it: "la gabbia per uccelli", itSyl: "GAB-bia per uc-CEL-li", en: "birdcage", x, y, steht: true, kunst: k,
    tipp: "Wellensittiche brauchen Gesellschaft – darum leben hier zwei." });
  /* Gitter vorn (über den Vögeln, fängt keinen Tipp ab) */
  const [bx0, by0, bx1, by1] = VK.box;
  let v = `<g pointer-events="none" transform="translate(${x} ${y})">`;
  let gi = "";
  for (let gx = bx0 + 1.3; gx < bx1; gx += 1.3) { const t = gx / bx1, top = by0 + 2.4 * t * t; gi += `M${r(gx)} ${r(top + 1)}V${r(by1)}`; }
  v += `<path d="${gi}" stroke="#d8dee2" stroke-width=".3"/><path d="M${r(bx0)} ${r(by1)} L${r(bx0)} ${r(by0 + 2.6)} Q0 ${r(by0 - 1)} ${r(bx1)} ${r(by0 + 2.6)} L${r(bx1)} ${r(by1)}" stroke="#d8dee2" stroke-width=".6" fill="none"/></g>`;
  S.davor(v);
}
{
  const k = sZ(7.5) / 100;
  let g = T.wellensittich(k * 1.2, 1);
  g += `<g transform="translate(${r(VK.stange2[0] - VK.stange[0] + 1)} ${r(VK.stange2[1] - VK.stange[1])})">${T.wellensittich(k * 1.15, -1, { farbe: "blau" })}</g>`;
  S.teil({ oben: true, id: "wellensittich", de: "der Wellensittich", syl: "WEL-len-sit-tich", it: "il pappagallino", itSyl: "pap-pa-gal-LI-no", en: "budgie", x: r(VK.stange[0] - 2), y: r(VK.stange[1]), kunst: g,
    tipp: "Wellensittiche kommen aus Australien. Sie können Wörter nachplappern." });
}

/* =====================================================================
   6 — DER KRATZBAUM (Ecke rechts) mit DER KATZE, DIE KATZENTOILETTE
   ===================================================================== */
const KB = {};
{
  const Z = 7.3, X = 3.3, s = sZ(Z), [x, y] = P(X, 0, Z), m = (v) => r(v * s);
  const SISAL = S.lg("sisal", [[0, "#d8c49a"], [0.5, "#ece0c0"], [1, "#b8a47a"]], 0, 0, 1, 0);
  const PL = S.lg("pluesch", [[0, "#c8b8a8"], [1, "#9a8a78"]]);
  let k = schatten(0, 0.2, m(0.35), 1, 0.3);
  k += `<rect x="${m(-0.34)}" y="${m(-0.07)}" width="${m(0.68)}" height="${m(0.07)}" rx="1" fill="${PL}"/>`;
  k += `<rect x="${m(-0.05)}" y="${m(-1.45)}" width="${m(0.1)}" height="${m(1.38)}" fill="${SISAL}"/><rect x="${m(0.17)}" y="${m(-0.8)}" width="${m(0.08)}" height="${m(0.73)}" fill="${SISAL}"/>`;
  let ri = "";
  for (let v = 0.12; v < 1.45; v += 0.05) ri += `M${m(-0.05)} ${m(-v)}h${m(0.1)}`;
  k += `<path d="${ri}" stroke="#a8946a" stroke-width=".25"/>`;
  k += `<rect x="${m(-0.34)}" y="${m(-1.0)}" width="${m(0.36)}" height="${m(0.22)}" rx="${m(0.07)}" fill="${PL}"/><ellipse cx="${m(-0.16)}" cy="${m(-0.89)}" rx="${m(0.07)}" ry="${m(0.07)}" fill="#3a3430"/>`;
  k += `<ellipse cx="${m(0.12)}" cy="${m(-0.8)}" rx="${m(0.22)}" ry="${m(0.045)}" fill="${PL}"/>`;
  k += `<ellipse cx="0" cy="${m(-1.45)}" rx="${m(0.26)}" ry="${m(0.055)}" fill="${PL}"/><path d="M${m(-0.26)} ${m(-1.45)} q${m(0.26)} ${m(0.07)} ${m(0.52)} 0" stroke="#7a6a58" stroke-width=".3" fill="none"/>`;
  k += `<path d="M${m(0.24)} ${m(-0.79)} v${m(0.2)}" stroke="#d23b30" stroke-width=".3"/><circle cx="${m(0.24)}" cy="${m(-0.57)}" r="1" fill="#e8c8c8"/>`;
  KB.top = [x, y - 1.45 * s];
  S.teil({ id: "kratzbaum", de: "der Kratzbaum", syl: "KRATZ-baum", it: "il tiragraffi", itSyl: "ti-ra-GRAF-fi", en: "scratching post", x, y, steht: true, kunst: k,
    tipp: "Am Kratzbaum schärft die Katze ihre Krallen – nicht am Sofa." });
  S.teil({ oben: true, id: "katze", de: "die Katze", syl: "KAT-ze", it: "il gatto", itSyl: "GAT-to", en: "cat", x: KB.top[0], y: r(KB.top[1]), kunst: T.katze(s / 100 * 1.1, -1, { art: "tabby", pose: "sitzen" }),
    tipp: "Katzen schlafen bis zu 16 Stunden am Tag – am liebsten ganz oben." });
}
{
  const X0 = 2.25, X1 = 2.85, Z0 = 6.8, Z1 = 7.3;
  const g0 = P((X0 + X1) / 2, 0, Z0 + 0.2);
  let k = schatten(g0[0], g0[1], 16, 1.6, 0.3);
  k += kiste(X0, X1, 0, 0.18, Z0, Z1, { s: "#5a9aa8", v: S.lg("klo", [[0, "#7ab8c8"], [1, "#4a8a9a"]]) });
  const a = P(X0, 0.18, Z0), b = P(X1, 0.18, Z0), c = P(X1 - 0.05, 0.42, Z0 + 0.2), d = P(X0 + 0.05, 0.42, Z0 + 0.2), e = P(X0, 0.18, Z1);
  k += poly([a, b, c, d], S.lg("klod", [[0, "#9ad0dc"], [1, "#6aa8b8"]]));
  k += poly([a, d, P(X0 + 0.05, 0.42, Z1 - 0.1), e], "#6aaabb");
  const o = P((X0 + X1) / 2, 0.28, Z0 + 0.08);
  k += `<ellipse cx="${o[0]}" cy="${o[1]}" rx="4" ry="3.4" fill="#2a3a40"/><ellipse cx="${o[0]}" cy="${r(o[1] + 2)}" rx="3.4" ry="1" fill="#e8e0d0"/>`;
  S.teil({ id: "katzentoilette", de: "die Katzentoilette", syl: "KAT-zen-toi-let-te", it: "la lettiera", itSyl: "let-TIE-ra", en: "litter box", x: g0[0], y: g0[1], steht: true, kunst: um(g0[0], g0[1], k),
    tipp: "Die Katze geht dort hinein – die Streu darin saugt alles auf." });
}

/* =====================================================================
   7 — DAS TERRARIUM (unter dem Fenster) mit DER SCHILDKRÖTE
   ===================================================================== */
const TE = { X0: -3.55, X1: -2.25, Z0: 7.0, Z1: 7.7, Y0: 0.3, Y1: 0.62 };
{
  let k = "";
  const g0 = P((TE.X0 + TE.X1) / 2, 0, TE.Z0 + 0.3);
  k += schatten(g0[0], g0[1], 26, 2, 0.3);
  /* Untertisch */
  for (const X of [TE.X0 + 0.05, TE.X1 - 0.05]) { const p = P(X, 0, TE.Z0 + 0.04), q = P(X, TE.Y0, TE.Z0 + 0.04); k += `<path d="M${p[0]} ${p[1]} L${q[0]} ${q[1]}" stroke="${HOLZ_S}" stroke-width="1.8"/>`; }
  k += kiste(TE.X0, TE.X1, TE.Y0 - 0.05, TE.Y0, TE.Z0, TE.Z1, { s: HOLZ_S, v: HOLZ });
  /* Boden mit Erde, Steinen, Kräutern; Wände aus Holz und Glas */
  k += poly([P(TE.X0, TE.Y0, TE.Z0), P(TE.X1, TE.Y0, TE.Z0), P(TE.X1, TE.Y0, TE.Z1), P(TE.X0, TE.Y0, TE.Z1)], S.lg("erde", [[0, "#9a7a4a"], [1, "#7a5a32"]]));
  k += poly([P(TE.X0, TE.Y0, TE.Z1), P(TE.X1, TE.Y0, TE.Z1), P(TE.X1, TE.Y1, TE.Z1), P(TE.X0, TE.Y1, TE.Z1)], HOLZ);
  k += poly([P(TE.X1, TE.Y0, TE.Z0), P(TE.X1, TE.Y0, TE.Z1), P(TE.X1, TE.Y1, TE.Z1), P(TE.X1, TE.Y1, TE.Z0)], "#b8905e");
  for (let i = 0; i < 8; i++) { const [px, py] = P(TE.X0 + 0.1 + rnd() * 1.1, TE.Y0, TE.Z0 + 0.1 + rnd() * 0.55); k += `<ellipse cx="${px}" cy="${py}" rx="${r(1 + rnd() * 1.4)}" ry="${r(0.6 + rnd() * 0.6)}" fill="#a8a094"/>`; }
  for (let i = 0; i < 5; i++) { const [px, py] = P(TE.X0 + 0.2 + i * 0.22, TE.Y0, TE.Z1 - 0.1); k += `<path d="M${px} ${py} l-1.6 -4 M${px} ${py} l0 -5 M${px} ${py} l1.6 -4" stroke="#5a9a3a" stroke-width=".7"/>`; }
  /* Wärmelampe */
  const lp = P(TE.X0 + 0.9, TE.Y1 + 0.45, TE.Z0 + 0.35), la = P(TE.X0 + 0.9, TE.Y1, TE.Z1);
  k += `<path d="M${la[0]} ${la[1]} L${la[0]} ${r(lp[1] - 3)} L${lp[0]} ${r(lp[1] - 3)}" stroke="#3a3a3a" stroke-width=".7" fill="none"/><path d="M${r(lp[0] - 3)} ${lp[1]} Q${lp[0]} ${r(lp[1] - 5)} ${r(lp[0] + 3)} ${lp[1]} Z" fill="#3a3a3a"/><ellipse cx="${lp[0]}" cy="${lp[1]}" rx="2.4" ry=".8" fill="#ffd27a"/>`;
  k += `<path d="M${r(lp[0] - 2.4)} ${lp[1]} L${r(lp[0] - 10)} ${r(lp[1] + 14)} L${r(lp[0] + 10)} ${r(lp[1] + 14)} L${r(lp[0] + 2.4)} ${lp[1]} Z" fill="#ffd27a" opacity=".18"/>`;
  /* Vorderwand aus Glas */
  const f0 = P(TE.X0, TE.Y1, TE.Z0), f1 = P(TE.X1, TE.Y0, TE.Z0);
  k += `<rect x="${f0[0]}" y="${f0[1]}" width="${r(f1[0] - f0[0])}" height="${r(f1[1] - f0[1])}" fill="#e2f0f4" opacity=".15" stroke="${HOLZ_S}" stroke-width=".8"/>`;
  k += `<path d="M${r(f0[0] + 4)} ${r(f1[1] - 1)} L${r(f0[0] + 9)} ${r(f0[1] + 1)}" stroke="#fff" stroke-width=".8" opacity=".35"/>`;
  S.teil({ id: "terrarium", de: "das Terrarium", syl: "Ter-RA-ri-um", it: "il terrario", itSyl: "ter-RA-rio", en: "terrarium", x: g0[0], y: g0[1], steht: true, kunst: um(g0[0], g0[1], k),
    tipp: "Die Wärmelampe im Terrarium ist wie die Sonne für die Schildkröte." });
  const [sx, sy] = P(TE.X0 + 0.55, TE.Y0, TE.Z0 + 0.32);
  S.teil({ oben: true, id: "schildkroete", de: "die Schildkröte", syl: "SCHILD-krö-te", it: "la tartaruga", itSyl: "tar-ta-RU-ga", en: "tortoise", x: sx, y: sy, kunst: T.schildkroete(sZ(TE.Z0 + 0.32) / 100 * 1.15, 1),
    tipp: "Eine Griechische Landschildkröte. Sie kann über 50 Jahre alt werden." });
}

/* =====================================================================
   8 — DER FUTTERSACK neben der Kommode
   ===================================================================== */
{
  const Z = 7.0, [x, y] = P(-1.85, 0, Z), s = sZ(Z), m = (v) => r(v * s);
  let k = schatten(0, 0.2, m(0.25), 1, 0.3);
  k += `<path d="M${m(-0.2)} 0 L${m(-0.22)} ${m(-0.42)} Q${m(-0.2)} ${m(-0.52)} ${m(-0.13)} ${m(-0.55)} L${m(0.15)} ${m(-0.53)} Q${m(0.22)} ${m(-0.5)} ${m(0.22)} ${m(-0.42)} L${m(0.2)} 0 Z" fill="${S.lg("sack", [[0, "#5a8a3a"], [0.5, "#7aaa4a"], [1, "#4a7a2a"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${m(-0.13)} ${m(-0.55)} L${m(-0.08)} ${m(-0.6)} L${m(0.1)} ${m(-0.59)} L${m(0.15)} ${m(-0.53)}" fill="#6a9a3a" stroke="#3a6a2a" stroke-width=".3"/>`;
  k += `<rect x="${m(-0.15)}" y="${m(-0.38)}" width="${m(0.3)}" height="${m(0.16)}" rx="1" fill="#fff"/><text x="0" y="${m(-0.28)}" font-size="${m(0.055)}" text-anchor="middle" fill="#3a6a2a" font-family="Arial" font-weight="bold">Kleintier</text>`;
  k += `<g transform="translate(0 ${m(-0.14)}) scale(${r(s / 100 * 0.35)})">${T.kaninchen(1, 1, { art: "weiss" }).replace(/<ellipse[^>]*filter="url\(#bw_weich\)"\/>/, "")}</g>`;
  S.teil({ id: "futtersack", de: "der Futtersack", syl: "FUT-ter-sack", it: "il sacco di cibo", itSyl: "SAC-co di CI-bo", en: "bag of feed", x, y, steht: true, kunst: k,
    tipp: "Kaninchen und Meerschweinchen brauchen vor allem Heu und frisches Gemüse." });
}

/* =====================================================================
   9 — DAS KÖRBCHEN mit DEM HUND, DER FUTTERNAPF
   ===================================================================== */
{
  const Z = 6.3, X = -0.75, s = sZ(Z), [x, y] = P(X, 0, Z), m = (v) => r(v * s);
  let k = schatten(0, 0.2, m(0.62), m(0.06), 0.3);
  k += `<path d="M${m(-0.6)} 0 Q${m(-0.66)} ${m(-0.2)} ${m(-0.5)} ${m(-0.28)} L${m(0.5)} ${m(-0.28)} Q${m(0.66)} ${m(-0.2)} ${m(0.6)} 0 Z" fill="${S.lg("koerbchen", [[0, "#8a5a8a"], [1, "#6a3a6a"]])}"/>`;
  k += `<ellipse cx="0" cy="${m(-0.2)}" rx="${m(0.52)}" ry="${m(0.08)}" fill="${S.lg("kissen", [[0, "#e8dcc8"], [1, "#c8b8a0"]])}"/>`;
  k += `<path d="M${m(-0.55)} ${m(-0.27)} Q0 ${m(-0.36)} ${m(0.55)} ${m(-0.27)}" stroke="#a87aa8" stroke-width="1.6" fill="none"/>`;
  for (let i = 0; i < 9; i++) k += `<circle cx="${m(-0.44 + i * 0.11)}" cy="${m(-0.14)}" r=".6" fill="#f2e6f2" opacity=".6"/>`;
  S.teil({ id: "koerbchen", de: "das Körbchen", syl: "KÖRB-chen", it: "la cuccia", itSyl: "CUC-cia", en: "dog bed", x, y, steht: true, kunst: k });
  S.teil({ oben: true, id: "hund", de: "der Hund", syl: "HUND", it: "il cane", itSyl: "CA-ne", en: "dog", x: x - m(0.06), y: y - m(0.1), kunst: T.hund(s / 100 * 0.78, 1, { art: "labrador", pose: "liegen" }),
    tipp: "Ein Labrador. Er wartet darauf, dass jemand die Leine holt." });
  const [nx, ny] = P(0.0, 0, 5.9), rn = 0.13 * sZ(5.9);
  let n = schatten(0, 0.2, rn * 1.1, 0.8, 0.3) + `<path d="M${r(-rn)} ${r(-rn * 0.45)} L${r(-rn * 0.8)} 0 L${r(rn * 0.8)} 0 L${r(rn)} ${r(-rn * 0.45)} Z" fill="${S.lg("napf", [[0, "#d84a3a"], [1, "#a8302a"]], 0, 0, 1, 0)}"/><ellipse cx="0" cy="${r(-rn * 0.45)}" rx="${r(rn)}" ry="${r(rn * 0.3)}" fill="#e8e4e0"/><ellipse cx="0" cy="${r(-rn * 0.45)}" rx="${r(rn * 0.78)}" ry="${r(rn * 0.22)}" fill="#8a5a2a"/>`;
  for (let i = 0; i < 7; i++) n += `<circle cx="${r(-rn * 0.5 + rnd() * rn)}" cy="${r(-rn * 0.5 + rnd() * rn * 0.15)}" r=".5" fill="#6a3a1a"/>`;
  S.teil({ id: "napf", de: "der Futternapf", syl: "FUT-ter-napf", it: "la ciotola", itSyl: "CIO-to-la", en: "food bowl", x: nx, y: ny, steht: true, kunst: n });
}

/* =====================================================================
   10 — DAS GEHEGE mit KANINCHEN und MEERSCHWEINCHEN (vorn links)
   ===================================================================== */
const GE = { X0: -2.25, X1: -0.95, Z0: 4.75, Z1: 5.7 };
{
  let k = "";
  k += poly([P(GE.X0, 0, GE.Z0), P(GE.X1, 0, GE.Z0), P(GE.X1, 0, GE.Z1), P(GE.X0, 0, GE.Z1)], S.lg("streu", [[0, "#e8d4a0"], [1, "#d8c088"]]));
  let st = "";
  for (let i = 0; i < 80; i++) { const [px, py] = P(GE.X0 + rnd() * (GE.X1 - GE.X0), 0, GE.Z0 + rnd() * (GE.Z1 - GE.Z0)); st += `M${px} ${py}l${r(-1 + rnd() * 2)} ${r(-0.4 + rnd() * 0.8)}`; }
  k += `<path d="${st}" stroke="#b8964a" stroke-width=".35"/>`;
  /* Gitter hinten und rechts (0,5 m), Holzhaus, Heu */
  const wand = (X0, Z0, X1, Z1) => {
    const a = P(X0, 0, Z0), b = P(X1, 0, Z1), c = P(X1, 0.5, Z1), d = P(X0, 0.5, Z0);
    let gi = "";
    for (let t = 0; t <= 1.001; t += 0.05) { const p = P(X0 + (X1 - X0) * t, 0, Z0 + (Z1 - Z0) * t), q = P(X0 + (X1 - X0) * t, 0.5, Z0 + (Z1 - Z0) * t); gi += `M${p[0]} ${p[1]}L${q[0]} ${q[1]}`; }
    return `<path d="${gi}" stroke="#8a949a" stroke-width=".3"/><path d="M${d[0]} ${d[1]} L${c[0]} ${c[1]} M${a[0]} ${a[1]} L${b[0]} ${b[1]}" stroke="#6a747a" stroke-width=".7"/>`;
  };
  k += wand(GE.X0, GE.Z1, GE.X1, GE.Z1) + wand(GE.X1, GE.Z1, GE.X1, GE.Z0);
  const hX0 = GE.X0 + 0.08, hX1 = hX0 + 0.42, hZ0 = GE.Z1 - 0.38, hZ1 = GE.Z1 - 0.04;
  k += kiste(hX0, hX1, 0, 0.26, hZ0, hZ1, { o: "#8a5a30", v: S.lg("haus", [[0, "#d8b07a"], [1, "#b88a52"]]) });
  const e0 = P(hX0 + 0.12, 0, hZ0), e1 = P(hX0 + 0.3, 0.16, hZ0);
  k += `<path d="M${e0[0]} ${e0[1]} L${e0[0]} ${r(e1[1] + 2)} A${r((e1[0] - e0[0]) / 2)} ${r((e1[0] - e0[0]) / 2)} 0 0 1 ${e1[0]} ${r(e1[1] + 2)} L${e1[0]} ${e0[1]} Z" fill="#2a1e14"/>`;
  const hp = P(GE.X1 - 0.3, 0, GE.Z1 - 0.2);
  k += `<path d="M${r(hp[0] - 8)} ${hp[1]} Q${hp[0]} ${r(hp[1] - 8)} ${r(hp[0] + 8)} ${hp[1]} Z" fill="#d8c070"/>` + T.striche(30, hp[0] - 8, hp[1] - 7, hp[0] + 8, hp[1], 2, -0.6, "#f2e2a0", 0.35, 0.8);
  k += `<path d="M${r(hp[0] - 2)} ${r(hp[1] - 4)} l3 -1 l1.4 .6 l-3 1.2 Z" fill="#e8742a"/><path d="M${r(hp[0] + 1.4)} ${r(hp[1] - 4.4)} l1.6 -1.4" stroke="#4a9a3a" stroke-width=".6"/>`;
  /* vorne niedriges Brett */
  k += poly([P(GE.X0, 0, GE.Z0), P(GE.X1, 0, GE.Z0), P(GE.X1, 0.1, GE.Z0), P(GE.X0, 0.1, GE.Z0)], HOLZ);
  k += poly([P(GE.X1, 0, GE.Z0), P(GE.X1, 0, GE.Z1), P(GE.X1, 0.1, GE.Z1), P(GE.X1, 0.1, GE.Z0)], HOLZ_S);
  const [cx, cy] = P((GE.X0 + GE.X1) / 2, 0, GE.Z0);
  S.teil({ id: "gehege", de: "das Gehege", syl: "Ge-HE-ge", it: "il recinto", itSyl: "re-CIN-to", en: "enclosure", x: cx, y: cy, steht: true, kunst: um(cx, cy, k),
    tipp: "Im Gehege haben die Kleintiere Platz zum Hoppeln und ein Häuschen zum Verstecken." });
}
{
  const Z = 5.35, [x, y] = P(-1.5, 0, Z);
  S.teil({ id: "kaninchen", de: "das Kaninchen", syl: "Ka-NIN-chen", it: "il coniglio", itSyl: "co-NI-glio", en: "rabbit", x, y, kunst: T.kaninchen(sZ(Z) / 100, -1, { art: "widder" }),
    tipp: "Ein Widder-Kaninchen: Seine Ohren hängen nach unten." });
  const Z2 = 5.0, [x2, y2] = P(-2.0, 0, Z2);
  S.teil({ id: "meerschweinchen", de: "das Meerschweinchen", syl: "MEER-schwein-chen", it: "la cavia", itSyl: "CA-via", en: "guinea pig", x: x2, y: y2, kunst: T.meerschweinchen(sZ(Z2) / 100, 1, { pal: ["#f6f2ea", "#b8784a", "#f6f2ea"] }),
    tipp: "Meerschweinchen pfeifen, wenn sie sich freuen." });
}

/* =====================================================================
   11 — DER WELPE mit DEM KNOCHEN, DAS KIND
   ===================================================================== */
{
  const Z = 4.9, [x, y] = P(0.25, 0, Z), s = sZ(Z);
  S.teil({ id: "welpe", de: "der Welpe", syl: "WEL-pe", it: "il cucciolo", itSyl: "CUC-cio-lo", en: "puppy", x, y, kunst: T.welpe(s / 100 * 1.05, 1, { farbe: ["#3a3230", "#1e1a18"] }),
    tipp: "Der Welpe ist zehn Wochen alt und kaut alles an." });
  const [kx, ky] = P(0.62, 0, 4.85);
  let k = schatten(0, 0.2, 5, 0.7, 0.3);
  k += `<g transform="rotate(-8)"><rect x="-3.6" y="-2.2" width="7.2" height="1.6" rx=".8" fill="#f2ead8"/><circle cx="-3.8" cy="-2.6" r="1.2" fill="#f2ead8"/><circle cx="-3.8" cy="-.8" r="1.2" fill="#f2ead8"/><circle cx="3.8" cy="-2.6" r="1.2" fill="#f2ead8"/><circle cx="3.8" cy="-.8" r="1.2" fill="#f2ead8"/><path d="M-3 -1.8 h6" stroke="#d8ccb4" stroke-width=".4"/></g>`;
  S.teil({ oben: true, id: "knochen", de: "der Knochen", syl: "KNO-chen", it: "l'osso", itSyl: "OS-so", en: "bone", x: kx, y: ky, kunst: k + flaeche(-5.6, -4.6, 11.2, 5),
    tipp: "Ein Kauknochen aus Rinderhaut – gut für die Zähne." });
}
{
  const Z = 5.0, [x, y] = P(1.05, 0, Z), s = sZ(Z);
  const m = B.mensch({ id: "b18e_kind", alter: "kind", geschlecht: "w", pose: "schneidersitz", blick: -55, frisur: "zopf", haarfarbe: "blond", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "pullover", farbe: "#e8742a" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" } } }, 1.32 * s);
  S.teil({ id: "kind", de: "das Kind", syl: "KIND", it: "il bambino", itSyl: "bam-BI-no", en: "child", x, y, kunst: schatten(0, 0.3, 12, 1.4, 0.3) + m.svg,
    tipp: "Das Kind sagt: „Komm her, kleiner Welpe!“" });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/haustiere.js"));
console.log(aus);
