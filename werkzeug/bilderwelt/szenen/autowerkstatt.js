#!/usr/bin/env node
/* =====================================================================
   DIE AUTOWERKSTATT (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (Werkstattausstattung, Fachpresse autoservicepraxis.de,
   Autozeitung „Werkstatt einrichten“, DGUV-Regeln für Hebebühnen) —
   so sieht eine freie Kfz-Werkstatt in Deutschland aus:
   - Eine helle Halle mit grauem Industrieboden (Epoxid), gelben
     Markierungen um den Arbeitsplatz der HEBEBÜHNE. Am häufigsten die
     Zweisäulen-Hebebühne: zwei Säulen neben dem Auto, vier Tragarme
     greifen unter die Schweller; das Auto hängt so hoch, dass man
     darunter stehen kann. Die Räder hängen dabei frei.
   - An der Wand die WERKBANK mit SCHRAUBSTOCK, darüber eine Lochwand
     (Werkzeugbrett) mit Schlüsseln, Ratsche, Drehmomentschlüssel,
     Zangen, Schraubendrehern und Hammer.
   - Der rote WERKZEUGWAGEN mit Schubladen fährt mit zum Auto.
   - DIAGNOSEGERÄT: Laptop auf einem Wagen, das Kabel steckt im
     OBD-Anschluss unter dem Lenkrad.
   - Ölwechsel: unter dem Motor ein fahrbares Auffanggerät mit Trichter.
   - RANGIERWAGENHEBER, Reifenstapel (Einlagerung mit Namensschild),
     Druckluft-Schlauchaufroller an der Wand, Feuerlöscher (Pflicht).
   - Ein ROLLTOR zum Hof; draußen wartet ein Wagen auf die
     Hauptuntersuchung — die Plakette klebt hinten auf dem Kennzeichen.
   Maßstab (eine Augenhöhe, Fluchtpunkt 160/22):
   Rückwand ≈ 25 Einheiten je Meter (Hallenhöhe 4,2 m),
   Hebebühne ≈ 34–37 je Meter, vorne ≈ 43 je Meter.
   Mechaniker 1,80 m, Kundin 1,66 m, Werkbank 0,9 m.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "autowerkstatt", titel: "Die Autowerkstatt", emoji: "🔧", thema: "Arbeit", kuerzel: "b07a", fassung: 852 });
const rnd = zufall(4711);
const r = B.r;

/* Perspektive: Maßstab je Meter an einer Bodenlinie y, Fluchtpunkt 160/22 */
const VP = { x: 160, y: 22 };
const M = (y) => 0.25 * (y - VP.y);
const fx = (X, y) => VP.x + X * M(y);

/* ---------- Grundfarben und Stoffe ---------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const WAND = S.lg("wand", [[0, "#eef0ee"], [1, "#e1e4e2"]]);
const SOCKEL = S.lg("sockel", [[0, "#7d868c"], [1, "#69737a"]]);
const STAHL = S.lg("stahl", [[0, "#eef1f3"], [0.45, "#c9cfd4"], [0.55, "#b2b9bf"], [1, "#e1e5e8"]], 0, 0, 1, 0);
const STAHL_H = S.lg("stahlh", [[0, "#f2f4f5"], [0.5, "#c3c9ce"], [1, "#8e979e"]]);
const ROT = S.lg("rot", [[0, "#e0473a"], [0.5, "#c62f25"], [1, "#9a2119"]], 0, 0, 1, 0);
const SAEULE = S.lg("saeule", [[0, "#1f4f8f"], [0.35, "#3d77c0"], [0.6, "#2b62a8"], [1, "#173d70"]], 0, 0, 1, 0);
const LACK = S.lg("lack", [[0, "#5d8cc4"], [0.3, "#2f5f9a"], [0.52, "#dce9f6"], [0.56, "#2a5690"], [1, "#16304f"]]);
const SCHEIBE = S.lg("scheibe", [[0, "#5d7486"], [0.5, "#2a3a47"], [1, "#1a252e"]]);
const REIFEN = S.rg("reifen", [[0, "#3a3c40"], [0.75, "#232427"], [1, "#121314"]]);
const FELGE = S.rg("felge", [[0, "#f4f6f7"], [0.6, "#c4cbd0"], [1, "#8d969c"]]);
const GUMMI = S.lg("gummi", [[0, "#3b3d41"], [0.5, "#1e1f22"], [1, "#2c2e31"]]);

/* =====================================================================
   KULISSE — Halle: Decke mit Lichtbändern, Oberlichter, Wand mit
   grauem Sockel, Industrieboden in Fluchtperspektive, Blick durchs Tor.
   ===================================================================== */
const WAND_UNTEN = 122;
const TOR = { x0: 248, x1: 312, y0: 38, unten: 57 };   /* Rolltor: Öffnung bis 2,6 m */
{
  let k = `<rect x="0" y="0" width="320" height="13" fill="${S.lg("decke", [[0, "#cfd4d6"], [1, "#e4e7e8"]])}"/>`;
  /* Stahlträger und LED-Lichtbänder */
  for (const x of [0, 80, 160, 240, 320]) k += `<rect x="${x - 2}" y="0" width="4" height="13" fill="#9aa2a8"/>`;
  k += `<rect x="0" y="11.5" width="320" height="2" fill="#a7afb4"/>`;
  for (const x of [40, 120, 200, 280]) {
    k += `<rect x="${x - 22}" y="4" width="44" height="3" rx="1" fill="#f2f4f4" stroke="#b9c0c4" stroke-width=".3"/><rect x="${x - 21}" y="6.2" width="42" height="1" fill="#ffffff"/>`;
    k += `<path d="M${x - 21} 7 L${x - 40} 30 L${x + 40} 30 L${x + 21} 7 Z" fill="${S.lg("lichtkegel", [[0, "#ffffff", 0.35], [1, "#ffffff", 0]])}"/>`;
  }
  /* Rückwand */
  k += `<rect x="0" y="13" width="320" height="${WAND_UNTEN - 13}" fill="${WAND}"/>`;
  /* Oberlichter (Fensterband) — Tageslicht von oben */
  for (let x = 10; x < 300; x += 46) {
    if (x + 40 > TOR.x0 - 4 && x < TOR.x1 + 4) continue;
    k += `<rect x="${x}" y="17" width="40" height="11" rx=".6" fill="#8e979c"/><rect x="${x + 1}" y="18" width="38" height="9" fill="${S.lg("himmel", [[0, "#cfe6f5"], [1, "#eef6fb"]])}"/>`;
    k += `<line x1="${x + 20}" y1="18" x2="${x + 20}" y2="27" stroke="#8e979c" stroke-width=".8"/><path d="M${x + 3} 27 L${x + 10} 18 L${x + 14} 18 L${x + 7} 27 Z" fill="#fff" opacity=".45"/>`;
  }
  /* grauer Sockelanstrich bis 1,2 m (abwaschbar) */
  k += `<rect x="0" y="${WAND_UNTEN - 30}" width="320" height="30" fill="${SOCKEL}"/><rect x="0" y="${WAND_UNTEN - 30}" width="320" height=".8" fill="#5a6369"/>`;
  /* leichte Flecken im Putz */
  for (let i = 0; i < 90; i++) { const x = rnd() * 320, y = 14 + rnd() * 76; k += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(0.3 + rnd() * 0.5)}" fill="#cfd3d1" opacity=".5"/>`; }
  /* Blick durch das offene Rolltor: Hof mit Asphalt, gegenüber eine Hecke */
  k += `<rect x="${TOR.x0}" y="${TOR.unten}" width="${TOR.x1 - TOR.x0}" height="${WAND_UNTEN - TOR.unten}" fill="${S.lg("hof", [[0, "#8a9196"], [1, "#6c7378"]])}"/>`;
  k += `<rect x="${TOR.x0}" y="${TOR.unten}" width="${TOR.x1 - TOR.x0}" height="13" fill="${S.lg("hecke", [[0, "#5f8a4a"], [1, "#3f6a33"]])}"/>`;
  for (let i = 0; i < 26; i++) k += `<circle cx="${r(TOR.x0 + rnd() * (TOR.x1 - TOR.x0))}" cy="${r(TOR.unten + 1 + rnd() * 9)}" r="${r(1 + rnd() * 1.6)}" fill="${rnd() < 0.5 ? "#6f9a55" : "#4c7a3c"}"/>`;
  k += `<rect x="${TOR.x0}" y="${TOR.unten + 12}" width="${TOR.x1 - TOR.x0}" height="2" fill="#a3a9ad"/>`;
  k += `<rect x="${TOR.x0}" y="${TOR.unten + 14}" width="${TOR.x1 - TOR.x0}" height="${WAND_UNTEN - TOR.unten - 14}" fill="${S.lg("asphalt", [[0, "#767d82"], [1, "#5c6368"]])}"/>`;
  k += `<path d="M${TOR.x0 + 6} ${WAND_UNTEN} L${TOR.x0 + 16} ${TOR.unten + 16} M${TOR.x1 - 6} ${WAND_UNTEN} L${TOR.x1 - 14} ${TOR.unten + 16}" stroke="#e8e8e2" stroke-width=".7" opacity=".8"/>`;
  k += `<rect x="${TOR.x0}" y="${TOR.unten}" width="${TOR.x1 - TOR.x0}" height="${WAND_UNTEN - TOR.unten}" fill="${S.lg("draussenlicht", [[0, "#fff", 0.25], [1, "#fff", 0.05]])}"/>`;
  S.hinten(k);
}
/* Industrieboden (Epoxid, hellgrau) mit Fugen, gelber Markierung, Spiegelung */
{
  let f = `<rect x="0" y="${WAND_UNTEN}" width="320" height="${200 - WAND_UNTEN}" fill="${S.lg("boden", [[0, "#a9afb2"], [1, "#c2c7c9"]])}"/>`;
  /* Fugen zum Fluchtpunkt (alle 2 m) und quer (Tiefe 10, 8, 7 m) */
  for (let X = -12; X <= 12; X += 2) f += `<line x1="${r(fx(X, WAND_UNTEN))}" y1="${WAND_UNTEN}" x2="${r(fx(X, 200))}" y2="200" stroke="#8b9296" stroke-width=".3" opacity=".7"/>`;
  for (const y of [142, 172, 193.4]) f += `<line x1="0" y1="${y}" x2="320" y2="${y}" stroke="#8b9296" stroke-width=".3" opacity=".6"/>`;
  /* Spiegelung der Lichtbänder im glatten Boden */
  for (const x of [40, 120, 200, 280]) f += `<ellipse cx="${x}" cy="186" rx="26" ry="5" fill="#fff" opacity=".18" filter="url(#bw_weich)"/>`;
  /* gelbe Sicherheitsmarkierung um den Hebebühnen-Platz */
  const X0 = (96 - 160) / M(140), X1 = (252 - 160) / M(140);
  const p = (X, y) => `${r(fx(X, y))} ${y}`;
  f += `<path d="M${p(X0, 138)} L${p(X1, 138)} L${p(X1, 182)} L${p(X0, 182)} Z" fill="none" stroke="#e5b912" stroke-width="1.1" opacity=".9"/>`;
  /* weicher Schatten unter dem gehobenen Auto */
  f += `<ellipse cx="171" cy="158" rx="72" ry="6" fill="#1b120a" opacity=".12" filter="url(#bw_weich)"/>`;
  /* Ölfleck, sauber gebunden — nur ein Schatten davon */
  f += `<ellipse cx="112" cy="165" rx="9" ry="1.6" fill="#5e6266" opacity=".25"/>`;
  f += `<rect x="0" y="${WAND_UNTEN}" width="320" height="1" fill="#5e676c"/>`;
  f += `<rect x="0" y="${WAND_UNTEN}" width="320" height="${200 - WAND_UNTEN}" fill="${S.lg("bodenlicht", [[0, "#000", 0.12], [0.4, "#000", 0], [1, "#fff", 0.08]])}"/>`;
  S.hinten(f);
}

/* =====================================================================
   1 — DIE WANDUHR (Werkstattuhr über der Hebebühne)
   ===================================================================== */
{
  let k = `<circle r="7.5" fill="#2c3136"/><circle r="6.6" fill="${S.rg("ziffer", [[0, "#ffffff"], [1, "#e9ecee"]])}"/>`;
  for (let i = 0; i < 12; i++) {
    const a = i * Math.PI / 6;
    k += `<line x1="${r(Math.sin(a) * 5.7)}" y1="${r(-Math.cos(a) * 5.7)}" x2="${r(Math.sin(a) * (i % 3 ? 5 : 4.4))}" y2="${r(-Math.cos(a) * (i % 3 ? 5 : 4.4))}" stroke="#1d2125" stroke-width="${i % 3 ? 0.3 : 0.6}"/>`;
  }
  k += `<line x1="0" y1="0" x2="${r(Math.sin(10.75 * Math.PI / 6) * 3.2)}" y2="${r(-Math.cos(10.75 * Math.PI / 6) * 3.2)}" stroke="#1d2125" stroke-width=".8" stroke-linecap="round"/>`;
  k += `<line x1="0" y1="0" x2="${r(Math.sin(45 * Math.PI / 30) * 4.8)}" y2="${r(-Math.cos(45 * Math.PI / 30) * 4.8)}" stroke="#1d2125" stroke-width=".5" stroke-linecap="round"/>`;
  k += `<circle r=".6" fill="#c62f25"/><path d="M-4.4 -4.8 A6.6 6.6 0 0 1 3 -5.8" stroke="#fff" stroke-width=".7" opacity=".6" fill="none"/>`;
  S.teil({ id: "aw_uhr", de: "die Uhr", syl: "UHR", it: "l'orologio", itSyl: "o-ro-LO-gio", en: "clock", x: 172, y: 37, kunst: k,
    tipp: "Viertel vor elf: Um zwölf soll das Auto fertig sein." });
}

/* =====================================================================
   2 — DAS WERKZEUGBRETT (Lochwand) — Lupe mit dem Handwerkzeug
   ===================================================================== */
const LW = { x0: 6, x1: 80, y0: 54, y1: 95.5 };
{
  S.def(`<pattern id="${S.id("loch")}" width="2.2" height="2.2" patternUnits="userSpaceOnUse"><rect width="2.2" height="2.2" fill="#56708a"/><circle cx="1.1" cy="1.1" r=".38" fill="#2b3a49"/></pattern>`);
  const W = LW.x1 - LW.x0, H = LW.y1 - LW.y0, cx = (LW.x0 + LW.x1) / 2;
  let k = `<rect x="${-W / 2 - 1}" y="${-H - 1}" width="${W + 2}" height="${H + 1}" rx=".8" fill="#3b4c5c"/>`;
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="${H}" fill="url(#${S.id("loch")})"/>`;
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="${H}" fill="${S.lg("lochlicht", [[0, "#fff", 0.16], [1, "#000", 0.1]])}"/>`;
  /* Werkzeuge mit aufgemalten Umrissen (Schattenbrett), Haken oben */
  const haken = (x, y) => `<path d="M${r(x)} ${r(y)} v1.6 q0 .8 .8 .8" stroke="#c9cfd4" stroke-width=".45" fill="none"/>`;
  const unter = [];
  const lx = (x) => x - cx, ly = (y) => y - LW.y1;   /* Szene → lokal */
  /* a) Schraubenschlüssel (Ringmaulschlüssel-Satz, nach Größe) */
  let g = "";
  for (let i = 0; i < 7; i++) {
    const x = lx(12 + i * 3), y0 = ly(58), L = 9 + i * 0.9;
    g += haken(x - 0.4, y0 - 1.6);
    g += `<rect x="${r(x - 0.45)}" y="${r(y0 + 1.6)}" width=".9" height="${r(L - 3.2)}" fill="${STAHL}"/>`;
    g += `<circle cx="${r(x)}" cy="${r(y0 + 1.2)}" r="${r(1.1 + i * 0.05)}" fill="none" stroke="#d9dee2" stroke-width=".75"/>`;
    g += `<path d="M${r(x - 1.2)} ${r(y0 + L + 1.4)} L${r(x - 1.2)} ${r(y0 + L - 0.6)} Q${r(x)} ${r(y0 + L - 1.4)} ${r(x + 1.2)} ${r(y0 + L - 0.6)} L${r(x + 1.2)} ${r(y0 + L + 1.4)} L${r(x + 0.5)} ${r(y0 + L + 1.4)} L${r(x + 0.5)} ${r(y0 + L + 0.3)} L${r(x - 0.5)} ${r(y0 + L + 0.3)} L${r(x - 0.5)} ${r(y0 + L + 1.4)} Z" fill="#cfd5d9"/>`;
  }
  k += g;
  unter.push({ id: "aw_schluessel", de: "der Schraubenschlüssel", syl: "SCHRAU-ben-schlüs-sel", it: "la chiave inglese", itSyl: "CHIA-ve in-GLE-se", en: "spanner", x: 21, y: 75, kunst: flaeche(-11, -19, 22, 21),
    tipp: "Ringmaulschlüssel: auf der einen Seite ein Ring, auf der anderen ein offenes Maul." });
  /* b) Ratsche (Knarre) mit Nuss */
  g = haken(lx(40), ly(57));
  g += `<rect x="${r(lx(39.4))}" y="${r(ly(60))}" width="1.2" height="10" rx=".5" fill="${STAHL}"/><rect x="${r(lx(39.2))}" y="${r(ly(64))}" width="1.6" height="6" rx=".7" fill="#2a2d31"/>`;
  g += `<circle cx="${r(lx(40))}" cy="${r(ly(59))}" r="1.9" fill="#d9dee2" stroke="#9aa3aa" stroke-width=".3"/><circle cx="${r(lx(40))}" cy="${r(ly(59))}" r=".7" fill="#7d868d"/>`;
  g += `<rect x="${r(lx(38.9))}" y="${r(ly(73))}" width="2.2" height="2.6" rx=".4" fill="${STAHL}"/>`;
  k += g;
  unter.push({ id: "aw_ratsche", de: "die Ratsche", syl: "RAT-sche", it: "il cricchetto", itSyl: "cric-CHET-to", en: "ratchet", x: 40, y: 77, kunst: flaeche(-4, -21, 8, 22),
    tipp: "Die Ratsche heißt in der Werkstatt auch „Knarre“ — sie macht beim Drehen „klack-klack“." });
  /* c) Drehmomentschlüssel (lang, mit Skala am Griff) */
  g = haken(lx(48), ly(56));
  g += `<rect x="${r(lx(47.4))}" y="${r(ly(58.6))}" width="1.2" height="22" rx=".5" fill="${STAHL}"/>`;
  g += `<rect x="${r(lx(47.1))}" y="${r(ly(72))}" width="1.8" height="9" rx=".7" fill="#c62f25"/>`;
  for (let i = 0; i < 5; i++) g += `<line x1="${r(lx(47.1))}" y1="${r(ly(73 + i * 1.6))}" x2="${r(lx(47.8))}" y2="${r(ly(73 + i * 1.6))}" stroke="#fff" stroke-width=".2"/>`;
  g += `<circle cx="${r(lx(48))}" cy="${r(ly(58))}" r="1.5" fill="#d9dee2" stroke="#9aa3aa" stroke-width=".3"/>`;
  k += g;
  unter.push({ id: "aw_drehmoment", de: "der Drehmomentschlüssel", syl: "DREH-mo-ment-schlüs-sel", it: "la chiave dinamometrica", itSyl: "CHIA-ve di-na-mo-ME-tri-ca", en: "torque wrench", x: 48, y: 82, kunst: flaeche(-3.5, -27, 7, 28),
    tipp: "Damit werden die Radschrauben genau fest genug angezogen — nicht zu fest und nicht zu locker." });
  /* d) Schraubendreher (fünf, Griffe in Rot und Gelb) */
  g = "";
  for (let i = 0; i < 5; i++) {
    const x = lx(56 + i * 2.6), y = ly(58);
    g += `<rect x="${r(x - 0.9)}" y="${r(y)}" width="1.8" height="4.8" rx=".8" fill="${i % 2 ? "#e2b31d" : "#c62f25"}"/><rect x="${r(x - 0.9)}" y="${r(y + 3.4)}" width="1.8" height=".6" fill="#222"/>`;
    g += `<rect x="${r(x - 0.25)}" y="${r(y + 4.8)}" width=".5" height="${r(5 + i * 0.6)}" fill="#d9dee2"/>`;
  }
  g += `<rect x="${r(lx(54.6))}" y="${r(ly(57.6))}" width="13.4" height="1.4" rx=".4" fill="#9aa3aa"/>`;
  k += g;
  unter.push({ id: "aw_schraubendreher", de: "der Schraubendreher", syl: "SCHRAU-ben-dre-her", it: "il cacciavite", itSyl: "cac-cia-VI-te", en: "screwdriver", x: 61.2, y: 70, kunst: flaeche(-7.4, -13, 14.8, 14) });
  /* e) Zangen (Kombizange, Seitenschneider) */
  g = "";
  for (const [x, f] of [[70, "#c62f25"], [74.5, "#e2b31d"]]) {
    const X = lx(x), Y = ly(59);
    g += haken(X, Y - 2);
    g += `<path d="M${r(X - 0.9)} ${r(Y)} L${r(X + 0.9)} ${r(Y)} L${r(X + 0.6)} ${r(Y + 4)} L${r(X - 0.6)} ${r(Y + 4)} Z" fill="#9aa3aa"/><circle cx="${r(X)}" cy="${r(Y + 4.4)}" r=".7" fill="#7d868d"/>`;
    g += `<path d="M${r(X - 0.5)} ${r(Y + 4.8)} L${r(X - 1.8)} ${r(Y + 12)} L${r(X - 0.8)} ${r(Y + 12.2)} L${r(X)} ${r(Y + 5.2)} Z" fill="${f}"/><path d="M${r(X + 0.5)} ${r(Y + 4.8)} L${r(X + 1.8)} ${r(Y + 12)} L${r(X + 0.8)} ${r(Y + 12.2)} L${r(X)} ${r(Y + 5.2)} Z" fill="${f}"/>`;
  }
  k += g;
  unter.push({ id: "aw_zange", de: "die Zange", syl: "ZAN-ge", it: "la pinza", itSyl: "PIN-za", en: "pliers", x: 72.3, y: 73, kunst: flaeche(-5, -16, 10, 17) });
  /* f) Hammer (Schlosserhammer) */
  g = haken(lx(14), ly(80)) + haken(lx(26), ly(80));
  g += `<rect x="${r(lx(13))}" y="${r(ly(82.2))}" width="15" height="1.5" rx=".7" fill="${S.lg("stiel", [[0, "#d7a868"], [1, "#a8743a"]])}"/>`;
  g += `<path d="M${r(lx(27))} ${r(ly(79.6))} L${r(lx(30.2))} ${r(ly(79.6))} L${r(lx(30.2))} ${r(ly(86.6))} L${r(lx(27))} ${r(ly(86.6))} Z" fill="#59616a"/><rect x="${r(lx(27))}" y="${r(ly(79.6))}" width="3.2" height=".8" fill="#9aa3aa"/>`;
  k += g;
  unter.push({ id: "aw_hammer", de: "der Hammer", syl: "HAM-mer", it: "il martello", itSyl: "mar-TEL-lo", en: "hammer", x: 21.5, y: 90, kunst: flaeche(-9.5, -9, 19, 10) });
  /* g) Kleinteile: Kabelbinder-Rolle, Taschenlampe (nur Bild) */
  k += `<rect x="${r(lx(36))}" y="${r(ly(85))}" width="10" height="2" rx="1" fill="#2a2d31"/><circle cx="${r(lx(46.6))}" cy="${r(ly(84))}" r="2" fill="none" stroke="#f0f0ea" stroke-width=".7"/>`;
  k += `<rect x="${r(lx(52))}" y="${r(ly(82))}" width="16" height="4.2" rx=".6" fill="#e2b31d"/><text x="${r(lx(60))}" y="${r(ly(79))}" font-size="2" text-anchor="middle" fill="#1d2125" font-family="Arial" font-weight="bold">KFZ</text>`;
  S.teil({ id: "aw_werkzeugbrett", de: "das Werkzeugbrett", syl: "WERK-zeug-brett", it: "il pannello portautensili", itSyl: "pan-NEL-lo por-ta-u-TEN-si-li", en: "tool board", x: cx, y: LW.y1, kunst: k,
    zoom: { x: LW.x0 - 2, y: LW.y0 - 4, w: W + 4, h: 50 },
    unter,
    tipp: "Auf dem Werkzeugbrett hat jedes Werkzeug seinen festen Platz." });
}

/* =====================================================================
   3 — DIE WERKBANK mit Schubladen (an der Wand links)
   ===================================================================== */
const BANK = { x0: 4, x1: 82, oben: 100 };
{
  const W = BANK.x1 - BANK.x0, h = WAND_UNTEN - BANK.oben;
  let k = schatten(0, 0, W / 2 + 2, 1.6, 0.3);
  /* Platte aus Buche-Multiplex (von leicht oben gesehen) */
  k += `<path d="M${-W / 2 + 1} ${-h - 4.4} L${W / 2 - 1} ${-h - 4.4} L${W / 2} ${-h} L${-W / 2} ${-h} Z" fill="${S.lg("platte", [[0, "#d9b07a"], [1, "#c99a5f"]])}"/>`;
  k += `<rect x="${-W / 2}" y="${-h}" width="${W}" height="2.6" fill="${S.lg("kante", [[0, "#b98a50"], [1, "#9c703c"]])}"/>`;
  for (let i = 0; i < 6; i++) k += `<line x1="${-W / 2}" y1="${r(-h + 0.4 + i * 0.4)}" x2="${W / 2}" y2="${r(-h + 0.4 + i * 0.4)}" stroke="#8a5f30" stroke-width=".1" opacity=".6"/>`;
  /* Schubladenblöcke links und rechts, Mitte offen mit Fachboden */
  for (const [a, b] of [[-W / 2 + 1, -W / 2 + 23], [W / 2 - 23, W / 2 - 1]]) {
    k += `<rect x="${a}" y="${-h + 2.6}" width="${b - a}" height="${h - 3.6}" fill="${S.lg("blech", [[0, "#7f8a92"], [1, "#5f6a72"]])}"/>`;
    for (let i = 0; i < 4; i++) {
      const y = -h + 3.6 + i * 4.4;
      k += `<rect x="${a + 0.8}" y="${r(y)}" width="${b - a - 1.6}" height="3.8" rx=".4" fill="${S.lg("lade", [[0, "#93a0a9"], [1, "#77848d"]])}"/><rect x="${r((a + b) / 2 - 3)}" y="${r(y + 1.2)}" width="6" height="1" rx=".5" fill="#d9dee2"/>`;
    }
  }
  k += `<rect x="${-W / 2 + 24}" y="${-h + 2.6}" width="${W - 48}" height="${h - 3}" fill="#3e464c" opacity=".55"/>`;
  k += `<rect x="${-W / 2 + 24}" y="-6" width="${W - 48}" height="1.2" fill="#8d979e"/>`;
  /* auf dem Fachboden: Karton mit Ersatzteilen */
  k += `<rect x="-8" y="-12.6" width="13" height="6.6" fill="${S.lg("karton", [[0, "#cfa46a"], [1, "#a97c45"]])}"/><rect x="-8" y="-12.6" width="13" height="1" fill="#e0bd85"/><text x="-1.5" y="-8" font-size="2" text-anchor="middle" fill="#5a3a1f" font-family="Arial">Filter</text>`;
  k += `<rect x="${-W / 2 + 1}" y="-1.2" width="${W - 2}" height="1.2" fill="#3a4248"/>`;
  S.teil({ id: "aw_werkbank", de: "die Werkbank", syl: "WERK-bank", it: "il banco da lavoro", itSyl: "BAN-co da la-VO-ro", en: "workbench", x: (BANK.x0 + BANK.x1) / 2, y: WAND_UNTEN, steht: true, kunst: k });
}
/* DER SCHRAUBSTOCK — links auf der Werkbank */
{
  let k = schatten(0, -0.2, 6, .8, .3);
  k += `<rect x="-5" y="-2" width="10" height="2" rx=".4" fill="#3d4a55"/>`;
  k += `<path d="M-4 -2 L-4 -7.6 L-1.2 -7.6 L-1.2 -5 L1.6 -5 L1.6 -2 Z" fill="${S.lg("vise", [[0, "#4f7fb8"], [1, "#2b5687"]])}"/>`;
  k += `<rect x="1.2" y="-7.6" width="3.6" height="5.6" rx=".4" fill="${S.lg("vise2", [[0, "#4f7fb8"], [1, "#2b5687"]])}"/>`;
  k += `<rect x="-1.4" y="-8.4" width="2.8" height="1.6" fill="#9aa3aa"/><rect x="-1.4" y="-8.4" width="2.8" height=".4" fill="#d9dee2"/>`;
  k += `<rect x="4.8" y="-5.6" width="4.6" height="1" rx=".4" fill="${STAHL}"/><rect x="9" y="-7.6" width=".9" height="5" rx=".4" fill="${STAHL}"/>`;
  k += `<rect x="-0.6" y="-12" width="1.2" height="4" fill="#c2c7cb"/>`;
  S.teil({ oben: true, id: "aw_schraubstock", de: "der Schraubstock", syl: "SCHRAUB-stock", it: "la morsa", itSyl: "MOR-sa", en: "vice", x: 16, y: BANK.oben, steht: true, kunst: k + flaeche(-6, -13, 16, 13),
    tipp: "Im Schraubstock wird ein Werkstück festgeklemmt." });
}
/* DIE BREMSSCHEIBE (neu, auf der Werkbank) — liegt bereit zum Einbau */
{
  let k = schatten(0, 0, 6, .7, .25);
  k += `<ellipse cx="0" cy="-1.4" rx="5.4" ry="1.6" fill="#7d868d"/><ellipse cx="0" cy="-2" rx="5.4" ry="1.6" fill="${S.rg("disc", [[0, "#5c646b"], [0.42, "#5c646b"], [0.46, "#e3e7ea"], [1, "#aab2b8"]])}"/>`;
  k += `<ellipse cx="0" cy="-2.6" rx="2.2" ry=".7" fill="#4a5258"/><ellipse cx="0" cy="-2.7" rx=".9" ry=".3" fill="#2a2e32"/>`;
  k += `<rect x="6.4" y="-3.6" width="8" height="3.6" fill="${S.lg("karton2", [[0, "#2c64b0"], [1, "#1d4a85"]])}"/><rect x="6.4" y="-3.6" width="8" height=".6" fill="#4d84cf"/><text x="10.4" y="-1" font-size="1.6" text-anchor="middle" fill="#fff" font-family="Arial">BREMSE</text>`;
  S.teil({ oben: true, id: "aw_bremse", de: "die Bremsscheibe", syl: "BREMS-schei-be", it: "il disco freno", itSyl: "DI-sco FRE-no", en: "brake disc", x: 36, y: BANK.oben, steht: true, kunst: k,
    tipp: "Die neue Bremsscheibe kommt gleich hinten links ans Auto." });
}
/* DAS MOTORÖL — Kanister rechts auf der Werkbank */
{
  let k = schatten(0, 0, 8, .8, .25);
  for (const [x, f, h] of [[-4.8, "#e2b31d", 8.4], [0, "#1f62b0", 8.4], [4.8, "#e2b31d", 6]]) {
    k += `<path d="M${x - 2.1} 0 L${x - 2.1} ${-h + 1.6} Q${x - 2.1} ${-h} ${x - 0.5} ${-h} L${x + 2.1} ${-h} L${x + 2.1} 0 Z" fill="${f}"/>`;
    k += `<rect x="${x - 1.8}" y="${-h * 0.62}" width="3.6" height="${r(h * 0.36)}" fill="#fff" opacity=".85"/><text x="${x}" y="${r(-h * 0.38)}" font-size="1.3" text-anchor="middle" fill="#1d2125" font-family="Arial" font-weight="bold">5W-30</text>`;
    k += `<rect x="${x - 1.4}" y="${-h - 1.2}" width="1.4" height="1.2" fill="#2a2d31"/><path d="M${x - 1.6} ${-h + 0.6} L${x - 1.6} -1" stroke="#fff" stroke-width=".4" opacity=".4"/>`;
  }
  S.teil({ oben: true, id: "aw_oel", de: "das Motoröl", syl: "MO-tor-öl", it: "l'olio motore", itSyl: "O-lio mo-TO-re", en: "engine oil", x: 70, y: BANK.oben, steht: true, kunst: k,
    tipp: "Beim Ölwechsel kommen etwa vier bis fünf Liter frisches Motoröl in den Motor." });
}

/* =====================================================================
   4 — DER DRUCKLUFTSCHLAUCH (Schlauchaufroller) und DER FEUERLÖSCHER
   ===================================================================== */
{
  let k = `<rect x="-2" y="-11" width="4" height="3" fill="#59616a"/>`;
  k += `<circle cx="0" cy="0" r="8" fill="${S.rg("trommel", [[0, "#ffd34a"], [0.8, "#e2b31d"], [1, "#b88b0c"]])}"/><circle cx="0" cy="0" r="6.2" fill="#2a2d31"/>`;
  for (let i = 0; i < 4; i++) k += `<circle cx="0" cy="0" r="${r(2.6 + i * 0.9)}" fill="none" stroke="#3c5f9a" stroke-width=".8"/>`;
  k += `<circle cx="0" cy="0" r="1.6" fill="#e2b31d"/><circle cx="0" cy="0" r=".6" fill="#59616a"/>`;
  /* Schlauch hängt herab, am Ende die Ausblaspistole */
  k += `<path d="M5.2 4.6 Q7 9 4.6 13 Q3.8 14.4 4.6 15" stroke="#3c5f9a" stroke-width="1.1" fill="none"/>`;
  k += `<path d="M3.4 15 L6.6 15 L6.2 19 L4.6 19 Z" fill="#2a2d31"/><rect x="4.8" y="19" width=".8" height="3.6" fill="#c2c7cb"/>`;
  S.teil({ id: "aw_druckluft", de: "der Druckluftschlauch", syl: "DRUCK-luft-schlauch", it: "il tubo dell'aria compressa", itSyl: "TU-bo del-L'A-ria com-PRES-sa", en: "air hose", x: 89, y: 60, kunst: k,
    tipp: "Mit Druckluft laufen der Schlagschrauber und die Reifenfüllmessgeräte." });
}
{
  let k = `<rect x="-3.4" y="-24" width="6.8" height="6.8" rx=".5" fill="#c62f25"/><path d="M-1.4 -18.8 L-1.4 -22 Q-1.4 -22.8 -.4 -22.8 L1.2 -22.8 M-.2 -22.8 L1.6 -21.4" stroke="#fff" stroke-width=".55" fill="none"/><rect x="-1.9" y="-21" width="2.2" height="2.6" rx=".6" fill="#fff"/>`;
  k += `<rect x="-2.8" y="-13.6" width="5.6" height="1" fill="#59616a"/>`;
  k += `<rect x="-2.3" y="-14.4" width="4.6" height="14.4" rx="2" fill="${S.lg("loescher", [[0, "#e64a3c"], [0.45, "#d23628"], [1, "#9a2119"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-1.8" y="-10" width="3.6" height="4.6" fill="#fff" opacity=".85"/><rect x="-1.4" y="-9.2" width="2.8" height=".5" fill="#1d2125"/><rect x="-1.4" y="-8.2" width="2.8" height=".3" fill="#1d2125"/>`;
  k += `<rect x="-1" y="-16" width="2" height="1.8" fill="#2a2d31"/><path d="M1 -15.4 L3.4 -15.6" stroke="#2a2d31" stroke-width=".8"/><path d="M-1 -15 Q-4 -12 -3.2 -6" stroke="#1d2125" stroke-width=".6" fill="none"/>`;
  k += `<path d="M-1.6 -13 L-1.6 -1" stroke="#fff" stroke-width=".5" opacity=".35"/>`;
  S.teil({ id: "aw_feuerloescher", de: "der Feuerlöscher", syl: "FEU-er-lö-scher", it: "l'estintore", itSyl: "e-stin-TO-re", en: "fire extinguisher", x: 89, y: 110, kunst: k,
    tipp: "In jeder Werkstatt muss ein Feuerlöscher griffbereit hängen." });
}

/* =====================================================================
   5 — DER REIFEN (Stapel zur Einlagerung, mit Namensschild)
   ===================================================================== */
{
  let k = schatten(0, 0, 10, 1.4, .3);
  for (let i = 0; i < 4; i++) {
    const y = -i * 5.2;
    k += `<path d="M-8.4 ${r(y - 1.2)} L-8.4 ${r(y - 5.2)} A8.4 2.2 0 0 1 8.4 ${r(y - 5.2)} L8.4 ${r(y - 1.2)} A8.4 2.2 0 0 1 -8.4 ${r(y - 1.2)} Z" fill="${GUMMI}"/>`;
    for (let j = -3; j <= 3; j++) k += `<line x1="${r(j * 2.2)}" y1="${r(y - 0.2)}" x2="${r(j * 2.2)}" y2="${r(y - 4.4)}" stroke="#121314" stroke-width=".35" opacity=".7"/>`;
  }
  k += `<ellipse cx="0" cy="-21" rx="8.4" ry="2.2" fill="#2a2b2e"/><ellipse cx="0" cy="-21" rx="5" ry="1.3" fill="#141516"/>`;
  k += `<path d="M-6 -22.2 A8 2 0 0 1 6 -22.2" stroke="#5a5d62" stroke-width=".5" fill="none"/>`;
  /* Einlagerungsschild */
  k += `<rect x="-8" y="-13" width="6" height="4.2" fill="#fff" stroke="#9aa3aa" stroke-width=".2"/><text x="-5" y="-10.6" font-size="1.4" text-anchor="middle" fill="#c62f25" font-family="Arial" font-weight="bold">Weber</text><text x="-5" y="-9.2" font-size="1" text-anchor="middle" fill="#333" font-family="Arial">Sommer</text>`;
  S.teil({ id: "aw_reifen", de: "der Reifen", syl: "REI-fen", it: "la gomma", itSyl: "GOM-ma", en: "tyre", x: 104, y: 127, steht: true, kunst: k,
    tipp: "Im Frühling kommen die Sommerreifen drauf, im Herbst die Winterreifen — „von O bis O“: Oktober bis Ostern." });
}

/* =====================================================================
   6 — DAS ROLLTOR (halb offen) und draußen DER WAGEN zur Hauptuntersuchung
   ===================================================================== */
{
  const W = TOR.x1 - TOR.x0, cx = (TOR.x0 + TOR.x1) / 2;
  let k = "";
  /* Führungsschienen links und rechts */
  k += `<rect x="${-W / 2 - 3}" y="${TOR.y0 - WAND_UNTEN}" width="3" height="${WAND_UNTEN - TOR.y0}" fill="${STAHL}"/><rect x="${W / 2}" y="${TOR.y0 - WAND_UNTEN}" width="3" height="${WAND_UNTEN - TOR.y0}" fill="${STAHL}"/>`;
  k += `<rect x="${-W / 2 - 1.6}" y="${TOR.y0 - WAND_UNTEN}" width=".8" height="${WAND_UNTEN - TOR.y0}" fill="#7d868d"/><rect x="${W / 2 + 0.8}" y="${TOR.y0 - WAND_UNTEN}" width=".8" height="${WAND_UNTEN - TOR.y0}" fill="#7d868d"/>`;
  /* Wickelkasten oben */
  k += `<rect x="${-W / 2 - 4}" y="${TOR.y0 - WAND_UNTEN - 6}" width="${W + 8}" height="8" rx="1" fill="${STAHL_H}"/>`;
  /* Lamellen (Panzer) bis zur Unterkante */
  for (let y = TOR.y0 + 2; y < TOR.unten; y += 2.4) {
    k += `<rect x="${-W / 2}" y="${r(y - WAND_UNTEN)}" width="${W}" height="2.4" fill="${S.lg("lamelle", [[0, "#e8ebed"], [0.5, "#c7cdd1"], [1, "#a3abb1"]])}"/>`;
  }
  k += `<rect x="${-W / 2}" y="${TOR.unten - WAND_UNTEN - 1.8}" width="${W}" height="2.4" fill="#59616a"/><rect x="${-W / 2}" y="${TOR.unten - WAND_UNTEN + 0.4}" width="${W}" height="1" fill="#1d1f22"/>`;
  /* Bedientaster an der Wand */
  k += `<rect x="${-W / 2 - 9}" y="${-36}" width="4.4" height="7" rx=".6" fill="#e9eaea" stroke="#9aa3aa" stroke-width=".3"/><circle cx="${-W / 2 - 6.8}" cy="-33.6" r=".9" fill="#3ca35a"/><circle cx="${-W / 2 - 6.8}" cy="-31" r=".9" fill="#c62f25"/>`;
  /* Schwelle */
  k += `<rect x="${-W / 2 - 3}" y="-1" width="${W + 6}" height="1.6" fill="#59616a"/>`;
  S.teil({ id: "aw_rolltor", de: "das Rolltor", syl: "ROLL-tor", it: "la serranda", itSyl: "ser-RAN-da", en: "roller door", x: cx, y: WAND_UNTEN, steht: true, kunst: k,
    tipp: "Das Rolltor rollt sich oben im Kasten auf." });
}
{
  /* Kombi von hinten, auf dem Hof (≈ 20 Einheiten je Meter) */
  const kx = 282, ky = 104;
  let k = schatten(0, 0, 19, 1.6, .35);
  k += `<rect x="-16" y="-3.6" width="4.6" height="3.6" rx="1" fill="#1b1c1e"/><rect x="11.4" y="-3.6" width="4.6" height="3.6" rx="1" fill="#1b1c1e"/>`;
  k += `<path d="M-17.6 -5 L-17.8 -16 Q-17.4 -19 -14.6 -20 L-12.6 -27.6 Q-11.8 -29.6 -9.4 -29.8 L9.4 -29.8 Q11.8 -29.6 12.6 -27.6 L14.6 -20 Q17.4 -19 17.8 -16 L17.6 -5 Q17.4 -3 15 -3 L-15 -3 Q-17.4 -3 -17.6 -5 Z" fill="${S.lg("kombi", [[0, "#e9ecee"], [0.5, "#c9cfd3"], [1, "#9ea6ac"]])}"/>`;
  k += `<path d="M-11.6 -20 L-10 -27.2 Q-9.6 -28.4 -8.4 -28.4 L8.4 -28.4 Q9.6 -28.4 10 -27.2 L11.6 -20 Z" fill="${SCHEIBE}"/><path d="M-9 -27 L-5 -27 L-8.6 -21 L-10.4 -21 Z" fill="#fff" opacity=".25"/>`;
  k += `<rect x="-16.6" y="-18.4" width="5.2" height="4" rx=".8" fill="${S.lg("ruecklicht", [[0, "#ff5a4a"], [1, "#a3150c"]])}"/><rect x="11.4" y="-18.4" width="5.2" height="4" rx=".8" fill="${S.lg("ruecklicht2", [[0, "#ff5a4a"], [1, "#a3150c"]])}"/>`;
  k += `<rect x="-17.4" y="-8.6" width="34.8" height="4.8" rx="1.2" fill="#3a3d41"/><rect x="-1.6" y="-19.8" width="3.2" height="1" rx=".4" fill="#d9dee2"/>`;
  /* Kennzeichen: EU-Feld, „B“, Siegel mit HU-Plakette, „AW 852“ */
  k += `<rect x="-5.4" y="-13.4" width="10.8" height="2.6" rx=".3" fill="#fbfbf8" stroke="#1d2125" stroke-width=".2"/><rect x="-5.3" y="-13.3" width="1.2" height="2.4" fill="#1f4aa8"/>`;
  k += `<text x="-3.2" y="-11.3" font-size="1.7" fill="#1d2125" font-family="Arial" font-weight="bold">B</text><circle cx="-1" cy="-12.6" r=".55" fill="#d78a1d"/><circle cx="-1" cy="-11.4" r=".45" fill="#d9dee2"/><text x=".2" y="-11.3" font-size="1.7" fill="#1d2125" font-family="Arial" font-weight="bold">AW 852</text>`;
  k += `<path d="M-12 -28 L-6 -28" stroke="#fff" stroke-width=".5" opacity=".4"/>`;
  S.teil({ id: "aw_kombi", de: "der Kombi", syl: "KOM-bi", it: "la station wagon", itSyl: "STEI-scion UE-gon", en: "estate car", x: kx, y: ky, steht: true, kunst: k,
    zoom: { x: kx - 21, y: ky - 33, w: 42, h: 28 },
    unter: [
      { id: "aw_kennzeichen", de: "das Kennzeichen", syl: "KENN-zei-chen", it: "la targa", itSyl: "TAR-ga", en: "number plate", x: kx + 2.5, y: ky - 10.6, kunst: flaeche(-3.4, -3, 6.8, 3.2),
        tipp: "„B“ steht für Berlin. Jede Stadt und jeder Kreis hat eigene Buchstaben." },
      { id: "aw_tuev", de: "die Plakette", syl: "Pla-KET-te", it: "il bollino", itSyl: "bol-LI-no", en: "MOT sticker", x: kx - 1, y: ky - 10.8, kunst: flaeche(-1.3, -2.8, 2.6, 2.8),
        tipp: "Die bunte Plakette zeigt, wann das Auto wieder zur Hauptuntersuchung (TÜV) muss." },
      { id: "aw_ruecklicht", de: "das Rücklicht", syl: "RÜCK-licht", it: "il fanale posteriore", itSyl: "fa-NA-le po-ste-RIO-re", en: "rear light", x: kx - 14, y: ky - 14, kunst: flaeche(-3, -4.8, 6, 5.2) },
    ],
    tipp: "Dieser Wagen wartet auf die Hauptuntersuchung." });
}

/* =====================================================================
   7 — DAS AUTO auf der Hebebühne (Seitenansicht, Front links)
   Maßstab 34 je Meter; „Boden“ des Autos (virtuell) bei y = 99,
   die Schweller hängen auf 1,9 m. Hinten links ist das Rad ab:
   man sieht Bremsscheibe und Bremssattel.
   ===================================================================== */
const AUTO = { x: 171, y: 99 };
const RV = -44, RH = 46, RY = -8.5;   /* Radmitten (lokal) */
{
  let k = "";
  /* Radkästen innen dunkel */
  for (const x of [RV, RH]) k += `<path d="M${r(x + 12.2)} -6 A12.6 12.6 0 1 0 ${r(x - 12.2)} -6 Z" fill="${S.rg("radkasten", [[0, "#3a3d41"], [1, "#141517"]], 0.5, 0.7, 0.6)}"/>`;
  /* Fahrwerk hinten: Feder und Stoßdämpfer im Radkasten */
  for (let i = 0; i < 5; i++) k += `<ellipse cx="${RH}" cy="${r(-20.4 + i * 1.5)}" rx="2.4" ry=".55" fill="none" stroke="#8a9298" stroke-width=".55"/>`;
  k += `<rect x="${RH - 0.5}" y="-22" width="1" height="8" fill="#4a5258"/><rect x="${RH + 3.4}" y="-19" width="5" height="1.2" rx=".5" fill="#4a5258"/>`;
  /* Karosserie */
  const body = `M-74 -6 L-75.6 -17 Q-75.8 -22.6 -72 -24.6 L-44 -30.6 Q-37 -31.8 -33 -34 L-19.6 -45.4 Q-16 -48.2 -10 -48.6 L37 -48.8 Q45 -48.6 51 -45.6 L63.6 -37 Q71.8 -33.4 74.4 -28 L75.8 -13 Q76 -7.6 73 -6 L${r(RH + 12.2)} -6 A12.6 12.6 0 1 0 ${r(RH - 12.2)} -6 L${r(RV + 12.2)} -6 A12.6 12.6 0 1 0 ${r(RV - 12.2)} -6 Z`;
  k += `<path d="${body}" fill="${LACK}"/>`;
  /* Seitenschweller dunkler, Stoßfänger unten */
  k += `<path d="M${r(RV + 12.6)} -6 L${r(RH - 12.6)} -6 L${r(RH - 12.4)} -9.4 L${r(RV + 12.4)} -9.4 Z" fill="#14273f" opacity=".85"/>`;
  k += `<path d="M-74 -6 L-75.4 -14 L-64 -14 L-60 -6 Z" fill="#1c2c40" opacity=".55"/><path d="M73 -6 L75.6 -13 L62 -13 L60 -6 Z" fill="#1c2c40" opacity=".55"/>`;
  /* Fensterfläche, B- und C-Säule */
  k += `<path d="M-32.6 -33 L-19.4 -44.6 Q-16.2 -46.8 -11 -47 L34.4 -47 Q42 -46.6 46 -43.6 L55.4 -35.6 L-32.6 -33.4 Z" fill="${SCHEIBE}"/>`;
  /* Fahrerfenster ist heruntergelassen: innen Sitz und Kopfstütze */
  k += `<path d="M-29 -33.4 L-18 -43.4 Q-15.6 -45.2 -12 -45.2 L-0.6 -45.2 L-0.6 -33.6 Z" fill="#2b2f33"/>`;
  k += `<path d="M-8 -34 L-8 -40 Q-8 -42.6 -5.4 -42.6 L-3 -42.6 L-3 -34 Z" fill="#45494d"/><rect x="-7.4" y="-44.4" width="4" height="2.6" rx="1" fill="#45494d"/>`;
  k += `<path d="M-23 -34 Q-21 -38.6 -17.4 -38.4" stroke="#1b1d20" stroke-width="1.6" fill="none"/>`;
  k += `<rect x="-0.6" y="-47" width="3.4" height="14" fill="#14171a"/>`;
  k += `<path d="M38 -46.6 L46 -43.6 L55.4 -35.6 L40.6 -35.4 Z" fill="${S.lg("csaeule", [[0, "#3c6aa3"], [1, "#25476f"]])}"/>`;
  k += `<path d="M5 -45 L12 -45 L6 -35 L1 -35 Z" fill="#fff" opacity=".14"/><path d="M18 -45 L21 -45 L15 -35 L12 -35 Z" fill="#fff" opacity=".1"/>`;
  /* Zierleiste, Türfugen, Griffe, Spiegel, Tankdeckel */
  k += `<path d="M-33 -33.4 L56 -35.4" stroke="#0f1f33" stroke-width=".4" opacity=".7"/>`;
  k += `<path d="M-33 -33 Q-34 -22 -31.4 -9.6 M1.2 -33.4 L1 -9.6 M37.6 -34.6 Q39 -24 33.6 -14" stroke="#0f1f33" stroke-width=".45" fill="none" opacity=".75"/>`;
  k += `<rect x="-11" y="-29.4" width="4.6" height="1.2" rx=".6" fill="#163050"/><rect x="24" y="-29.8" width="4.6" height="1.2" rx=".6" fill="#163050"/>`;
  k += `<path d="M-33 -34 L-27.6 -35.6 Q-26 -34 -27.4 -31.8 L-31.6 -31.6 Z" fill="${S.lg("spiegel", [[0, "#3c6aa3"], [1, "#1d3a60"]])}"/>`;
  k += `<rect x="50" y="-29" width="4" height="3.4" rx="1" fill="none" stroke="#0f1f33" stroke-width=".35" opacity=".7"/>`;
  /* Scheinwerfer vorne, Rücklicht hinten, Seitenblinker */
  k += `<path d="M-75.4 -18.6 Q-75.2 -22.6 -71.6 -24 L-64 -25.4 Q-66 -21.4 -71 -19.4 Z" fill="${S.lg("scheinw", [[0, "#ffffff"], [1, "#bcd0de"]])}"/>`;
  k += `<path d="M75 -26.6 L70.6 -30.4 Q74 -29.6 74.6 -27.6 Z M75.2 -25 L76 -16 L73 -16.4 L72.4 -25 Z" fill="${S.lg("ruecklichta", [[0, "#ff5a4a"], [1, "#a3150c"]])}"/>`;
  k += `<rect x="-47" y="-27.6" width="3" height="1" rx=".5" fill="#ffb347"/>`;
  /* Spiegelung des Hallenlichts entlang der Flanke */
  k += `<path d="M-70 -24 L70 -30 L70 -28.4 L-70 -22.4 Z" fill="#fff" opacity=".18"/>`;
  /* Auspuff hinten unten */
  k += `<rect x="58" y="-5.8" width="14" height="2" rx=".8" fill="#4a5258"/><rect x="70" y="-6.2" width="5.4" height="2.8" rx="1.2" fill="${STAHL}"/><ellipse cx="75.4" cy="-4.8" rx=".7" ry="1.3" fill="#1d1f22"/>`;
  /* Vorderrad (hängt frei) */
  k += `<circle cx="${RV}" cy="${RY}" r="10.6" fill="${REIFEN}"/><circle cx="${RV}" cy="${RY}" r="10.6" fill="none" stroke="#000" stroke-width=".4" opacity=".5"/>`;
  k += `<circle cx="${RV}" cy="${RY}" r="7" fill="${FELGE}"/>`;
  for (let i = 0; i < 5; i++) {
    const a = i * 72 * Math.PI / 180 - Math.PI / 2;
    k += `<path d="M${r(RV + Math.cos(a - 0.22) * 2)} ${r(RY + Math.sin(a - 0.22) * 2)} L${r(RV + Math.cos(a - 0.16) * 6.6)} ${r(RY + Math.sin(a - 0.16) * 6.6)} L${r(RV + Math.cos(a + 0.16) * 6.6)} ${r(RY + Math.sin(a + 0.16) * 6.6)} L${r(RV + Math.cos(a + 0.22) * 2)} ${r(RY + Math.sin(a + 0.22) * 2)} Z" fill="#e7ebee"/>`;
    k += `<path d="M${r(RV + Math.cos(a + 0.36) * 2.6)} ${r(RY + Math.sin(a + 0.36) * 2.6)} L${r(RV + Math.cos(a + 0.36 + 0.5) * 6.4)} ${r(RY + Math.sin(a + 0.36 + 0.5) * 6.4)}" stroke="#3a3f44" stroke-width="1.6" opacity=".55"/>`;
  }
  k += `<circle cx="${RV}" cy="${RY}" r="1.8" fill="#7d868d"/><circle cx="${RV}" cy="${RY}" r=".8" fill="#2a2e32"/>`;
  /* Hinterrad ist ab: Radnabe mit Bremsscheibe und rotem Bremssattel */
  k += `<circle cx="${RH}" cy="${RY}" r="7.6" fill="${S.rg("bremsscheibe", [[0, "#58616a"], [0.44, "#58616a"], [0.47, "#c9cfd4"], [0.85, "#9fa8af"], [1, "#6c757c"]])}"/>`;
  k += `<circle cx="${RH}" cy="${RY}" r="6.8" fill="none" stroke="#8a5a3a" stroke-width=".6" opacity=".4"/>`;
  k += `<circle cx="${RH}" cy="${RY}" r="3.3" fill="#4a5258"/>`;
  for (let i = 0; i < 5; i++) { const a = i * 72 * Math.PI / 180; k += `<circle cx="${r(RH + Math.cos(a) * 2.2)}" cy="${r(RY + Math.sin(a) * 2.2)}" r=".45" fill="#c9cfd4"/>`; }
  k += `<path d="M${RH + 3.4} ${RY - 7.2} Q${RH + 8.6} ${RY - 5.4} ${RH + 8.4} ${RY + 0.4} L${RH + 5.4} ${RY + 0.6} Q${RH + 5.6} ${RY - 3.6} ${RH + 2.2} ${RY - 4.6} Z" fill="${S.lg("sattel", [[0, "#e0473a"], [1, "#9a2119"]])}"/>`;
  k += `<text x="${RH + 6.4}" y="${RY - 2.6}" font-size="1.1" fill="#fff" font-family="Arial" font-weight="bold" transform="rotate(62 ${RH + 6.4} ${RY - 2.6})">BREMBO</text>`;
  const zx = AUTO.x + 14, zy = AUTO.y - 42;
  S.teil({ id: "aw_auto_aw", de: "das Auto", syl: "AU-to", it: "l'automobile", itSyl: "au-to-MO-bi-le", en: "car", x: AUTO.x, y: AUTO.y, kunst: k,
    zoom: { x: zx, y: zy, w: 64, h: 43 },
    unter: [
      { id: "aw_bremssattel", de: "der Bremssattel", syl: "BREMS-sat-tel", it: "la pinza del freno", itSyl: "PIN-za del FRE-no", en: "brake caliper", x: AUTO.x + RH + 6, y: AUTO.y + RY + 1, kunst: flaeche(-3.4, -8.6, 6.4, 9),
        tipp: "Der Bremssattel drückt die Bremsbeläge gegen die Scheibe." },
      { id: "aw_radnabe", de: "die Radnabe", syl: "RAD-na-be", it: "il mozzo", itSyl: "MOZ-zo", en: "wheel hub", x: AUTO.x + RH - 2, y: AUTO.y + RY + 4, kunst: flaeche(-5, -8.8, 7, 9),
        tipp: "An die Radnabe wird das Rad mit fünf Radschrauben geschraubt." },
      { id: "aw_auspuff", de: "der Auspuff", syl: "AUS-puff", it: "il tubo di scappamento", itSyl: "TU-bo di scap-pa-MEN-to", en: "exhaust pipe", x: AUTO.x + 68, y: AUTO.y - 2.6, kunst: flaeche(-8, -4.4, 16, 4.8) },
      { id: "aw_scheibe", de: "die Scheibe", syl: "SCHEI-be", it: "il finestrino", itSyl: "fi-ne-STRI-no", en: "car window", x: AUTO.x + 20, y: AUTO.y - 34, kunst: flaeche(-12, -11, 24, 11) },
    ],
    tipp: "Das Auto hängt auf der Hebebühne fast zwei Meter hoch — so kommt man gut an die Unterseite." });
}

/* =====================================================================
   8 — DIE HEBEBÜHNE (Zweisäulen, vordere Säule mit Tragarmen)
   ===================================================================== */
{
  /* Säule steht bei y = 168 (≈ 36,5 je Meter), 2,8 m hoch */
  const H = 102, Wd = 13;
  let k = schatten(0, 0, 14, 1.8, .35);
  /* Bodenplatte zur hinteren Säule (in die Tiefe) */
  k += `<path d="M-9 0 L9 0 L6 -16 L-6 -16 Z" fill="${S.lg("bodenplatte", [[0, "#8d969c"], [1, "#6f777d"]])}"/>`;
  for (let i = 0; i < 4; i++) k += `<line x1="${-8 + i * 0.6}" y1="${r(-2 - i * 4)}" x2="${8 - i * 0.6}" y2="${r(-2 - i * 4)}" stroke="#5a6267" stroke-width=".35"/>`;
  /* Fußplatte mit gelb-schwarzer Warnmarkierung */
  k += `<rect x="-10" y="-2.4" width="20" height="2.4" rx=".4" fill="#2a2d31"/>`;
  for (let i = 0; i < 8; i++) k += `<path d="M${-10 + i * 2.6} -2.4 l1.3 0 l-1.4 2.4 l-1.3 0 Z" fill="#e5b912"/>`;
  /* Säule */
  k += `<rect x="${-Wd / 2}" y="${-H}" width="${Wd}" height="${H - 2.4}" fill="${SAEULE}"/>`;
  k += `<rect x="${-Wd / 2 + 1.2}" y="${-H + 2}" width="1.2" height="${H - 6}" fill="#fff" opacity=".2"/>`;
  k += `<rect x="${-Wd / 2 - 0.6}" y="${-H - 2}" width="${Wd + 1.2}" height="3" rx=".6" fill="#173d70"/>`;
  k += `<rect x="-2.6" y="${-H + 6}" width="5.2" height="${H - 12}" fill="#173d70" opacity=".55"/>`;
  /* Aufkleber „max. 3,5 t“ und Bedienkasten */
  k += `<rect x="-4.4" y="-62" width="8.8" height="5" rx=".4" fill="#fff"/><text x="0" y="-58.6" font-size="2.4" text-anchor="middle" fill="#1d2125" font-family="Arial" font-weight="bold">3,5 t</text>`;
  k += `<rect x="-5" y="-48" width="10" height="13" rx="1" fill="#e9eaea" stroke="#9aa3aa" stroke-width=".3"/><circle cx="0" cy="-43.6" r="1.8" fill="#c62f25"/><circle cx="0" cy="-43.6" r=".9" fill="#e64a3c"/><rect x="-3" y="-39.6" width="2.4" height="2.4" rx=".3" fill="#3ca35a"/><rect x=".6" y="-39.6" width="2.4" height="2.4" rx=".3" fill="#2a2d31"/>`;
  /* Schlitten mit zwei Tragarmen unter die Schweller (y_Szene ≈ 96) */
  const ay = 96 - 168;
  k += `<rect x="-7.6" y="${ay - 2}" width="15.2" height="12" rx="1" fill="${S.lg("schlitten", [[0, "#3d77c0"], [1, "#1f4f8f"]])}"/>`;
  k += `<path d="M-6 ${ay + 4} L-21 ${ay + 2} L-21 ${ay + 4.6} L-6 ${ay + 7} Z" fill="${STAHL_H}"/><path d="M6 ${ay + 4} L29 ${ay + 2} L29 ${ay + 4.6} L6 ${ay + 7} Z" fill="${STAHL_H}"/>`;
  for (const x of [-21, 29]) k += `<rect x="${x - 3.4}" y="${ay - 0.4}" width="6.8" height="2.6" rx="1" fill="#2a2d31"/><rect x="${x - 1}" y="${ay + 2}" width="2" height="2.6" fill="#7d868d"/>`;
  k += `<path d="M-7.6 ${ay + 8} L7.6 ${ay + 8}" stroke="#e5b912" stroke-width="1"/>`;
  /* Hydraulikschlauch */
  k += `<path d="M5 -48 Q8 -30 5 -8" stroke="#1d1f22" stroke-width=".8" fill="none"/>`;
  S.teil({ id: "aw_hebebuehne", de: "die Hebebühne", syl: "HE-be-büh-ne", it: "il ponte sollevatore", itSyl: "PON-te sol-le-va-TO-re", en: "car lift", x: 172, y: 168, steht: true, kunst: k,
    tipp: "Eine Zweisäulen-Hebebühne: vier Arme greifen unter das Auto und heben es hoch." });
}

/* =====================================================================
   9 — DIE AUFFANGWANNE (fahrbares Ölauffanggerät unter dem Motor)
   ===================================================================== */
{
  let k = schatten(0, 0, 11, 1.4, .3);
  for (const x of [-7, 7]) k += `<circle cx="${x}" cy="-1.4" r="1.4" fill="#1d1f22"/>`;
  k += `<path d="M-9 -3 L-9 -22 Q-9 -24 -7 -24 L7 -24 Q9 -24 9 -22 L9 -3 Z" fill="${S.lg("tank", [[0, "#e64a3c"], [0.4, "#d23628"], [1, "#8a1d15"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-9" y="-12" width="18" height="2" fill="#2a2d31"/><rect x="-6" y="-20" width="8" height="5" rx=".4" fill="#fff" opacity=".9"/><text x="-2" y="-16.6" font-size="1.7" text-anchor="middle" fill="#1d2125" font-family="Arial" font-weight="bold">ALTÖL</text>`;
  k += `<rect x="4" y="-21.4" width="3" height="5" rx=".6" fill="#1d1f22"/><rect x="4.6" y="-20.4" width="1.8" height="1.6" fill="#f2f2ea"/>`;
  /* Teleskoprohr und Trichter bis unter die Ölwanne des Motors */
  k += `<rect x="-1.1" y="-55" width="2.2" height="31" fill="${STAHL}"/><rect x="-1.6" y="-38" width="3.2" height="1.6" fill="#59616a"/>`;
  k += `<path d="M-10 -58.6 L10 -58.6 L6 -54.2 L-6 -54.2 Z" fill="${S.lg("trichter", [[0, "#e64a3c"], [1, "#9a2119"]])}"/><ellipse cx="0" cy="-58.6" rx="10" ry="1.4" fill="#2a1d18"/>`;
  k += `<path d="M-.8 -64 Q-.4 -61.4 -.6 -59.2" stroke="#2a1d18" stroke-width=".7" fill="none"/>`;
  k += `<path d="M-7.6 -22 L-7.6 -4" stroke="#fff" stroke-width=".7" opacity=".3"/>`;
  S.teil({ id: "aw_wanne", de: "die Auffangwanne", syl: "AUF-fang-wan-ne", it: "la vaschetta di raccolta", itSyl: "va-SCHET-ta di rac-COL-ta", en: "oil drain pan", x: 108, y: 162, steht: true, kunst: k,
    tipp: "Beim Ölwechsel läuft das alte Öl unten aus dem Motor in die Auffangwanne." });
}

/* =====================================================================
   10 — DAS DIAGNOSEGERÄT (Laptop auf Wagen, Kabel durchs Fenster)
   ===================================================================== */
{
  let k = schatten(0, 0, 12, 1.5, .3);
  for (const x of [-8, 8]) k += `<circle cx="${x}" cy="-1.6" r="1.6" fill="#1d1f22"/><circle cx="${x}" cy="-1.6" r=".6" fill="#7d868d"/>`;
  k += `<rect x="-1" y="-38" width="2" height="35" fill="${STAHL}"/><rect x="-10" y="-4" width="20" height="2" rx=".6" fill="#2a2d31"/>`;
  /* Fach mit dem Fahrzeug-Interface (VCI) */
  k += `<rect x="-9" y="-20" width="18" height="1.4" fill="#59616a"/><rect x="-6" y="-24.6" width="9" height="4.6" rx=".8" fill="#e5b912"/><circle cx="1" cy="-22.3" r=".7" fill="#3ca35a"/>`;
  /* Ablage mit Laptop */
  k += `<rect x="-11" y="-40" width="22" height="2.4" rx=".5" fill="#2a2d31"/>`;
  k += `<path d="M-9.4 -40 L9.4 -40 L8.6 -41.4 L-8.6 -41.4 Z" fill="#3a3f44"/>`;
  k += `<path d="M-8.6 -41.4 L-9.6 -55 L9.6 -55 L8.6 -41.4 Z" fill="#1d2125"/>`;
  k += `<path d="M-7.8 -42.4 L-8.6 -54 L8.6 -54 L7.8 -42.4 Z" fill="${S.lg("diagbild", [[0, "#173247"], [1, "#0d1f2e"]])}"/>`;
  k += `<rect x="-7.6" y="-53.2" width="15.2" height="1.6" fill="#e5b912"/><text x="0" y="-52" font-size="1.3" text-anchor="middle" fill="#1d2125" font-family="Arial" font-weight="bold">FEHLERSPEICHER</text>`;
  k += `<path d="M-7 -44 L-5 -46.4 L-3 -45 L-1 -49.4 L1 -47 L3 -48 L5 -45.6 L7 -46.6" stroke="#5ed06a" stroke-width=".5" fill="none"/>`;
  k += `<rect x="-7" y="-50.6" width="6" height="1.2" fill="#c62f25"/><text x="-4" y="-49.7" font-size=".9" text-anchor="middle" fill="#fff" font-family="Arial">P0171</text><rect x="0" y="-50.6" width="6" height="1.2" fill="#3ca35a"/><text x="3" y="-49.7" font-size=".9" text-anchor="middle" fill="#fff" font-family="Arial">OK</text>`;
  /* Kabel vom Interface zum OBD-Anschluss im Auto — fängt keinen Tipp ab */
  k += `<path d="M3 -22 Q16 -30 22 -50 Q36 -100 67 -115" stroke="#1d1f22" stroke-width=".8" fill="none" pointer-events="none"/>`;
  S.teil({ id: "aw_diagnose", de: "das Diagnosegerät", syl: "di-a-GNO-se-ge-rät", it: "il dispositivo di diagnosi", itSyl: "di-spo-si-TI-vo di di-A-gno-si", en: "diagnostic tool", x: 84, y: 177, steht: true, kunst: k,
    tipp: "Das Diagnosegerät liest den Fehlerspeicher des Autos aus." });
}

/* =====================================================================
   11 — DER WERKZEUGWAGEN (rot, sieben Schubladen, oben offen)
   ===================================================================== */
{
  let k = schatten(0, 0, 20, 2, .35);
  for (const x of [-14, 14]) k += `<rect x="${x - 1.6}" y="-4" width="3.2" height="2" fill="#59616a"/><circle cx="${x}" cy="-1.8" r="1.8" fill="#1d1f22"/><circle cx="${x}" cy="-1.8" r=".7" fill="#9aa3aa"/>`;
  k += `<rect x="-17" y="-40" width="34" height="36.6" rx="1.4" fill="${ROT}"/>`;
  /* Schubladen mit Alu-Griffleisten, die zweite steht offen */
  const hoehen = [3.4, 3.4, 3.4, 4.4, 4.4, 6.4, 6.4];
  let y = -37.6;
  hoehen.forEach((h, i) => {
    k += `<rect x="-15.6" y="${r(y)}" width="31.2" height="${r(h - 0.6)}" rx=".5" fill="${S.lg("schub", [[0, "#d63a2e"], [1, "#b02a20"]])}" stroke="#8a1d15" stroke-width=".25"/>`;
    k += `<rect x="-14" y="${r(y + 0.4)}" width="28" height=".9" rx=".4" fill="${STAHL}"/>`;
    if (i === 1) {
      /* offene Schublade: Nüsse und Bits auf Schaumstoff */
      k += `<rect x="-16.4" y="${r(y - 1.2)}" width="32.8" height="2.6" fill="#2a2d31"/>`;
      for (let j = 0; j < 12; j++) k += `<ellipse cx="${r(-14 + j * 2.5)}" cy="${r(y - 0.4)}" rx=".9" ry=".55" fill="#d9dee2"/>`;
    }
    y += h;
  });
  k += `<rect x="-17.6" y="-42.6" width="35.2" height="3" rx="1" fill="#2a2d31"/>`;
  /* oben in der Schale: Schlagschrauber und Nüsse */
  k += `<path d="M-12 -43 L-12 -47 Q-12 -48.6 -10.4 -48.6 L-3 -48.6 L-3 -46 L-6 -46 L-6 -43 Z" fill="#1d1f22"/><rect x="-3" y="-48" width="3.6" height="1.8" fill="${STAHL}"/><rect x="-11.6" y="-45" width="5" height="1.4" fill="#e5b912"/>`;
  for (let j = 0; j < 4; j++) k += `<rect x="${3 + j * 2.8}" y="-45" width="2" height="2.2" rx=".4" fill="${STAHL}"/>`;
  /* Schiebegriff seitlich */
  k += `<path d="M17 -38 L20.6 -38 L20.6 -30 L17 -30" stroke="${STAHL}" stroke-width="1.2" fill="none"/>`;
  k += `<rect x="-15" y="-39.4" width="1.4" height="34" fill="#fff" opacity=".18"/>`;
  k += `<text x="0" y="-6.6" font-size="2.2" text-anchor="middle" fill="#ffd5cf" font-family="Arial" font-weight="bold" letter-spacing=".3">PROFI-WERKZEUG</text>`;
  S.teil({ id: "aw_werkzeugwagen", de: "der Werkzeugwagen", syl: "WERK-zeug-wa-gen", it: "il carrello portautensili", itSyl: "car-REL-lo por-ta-u-TEN-si-li", en: "tool trolley", x: 44, y: 192, steht: true, kunst: k,
    tipp: "Der Werkzeugwagen hat Rollen — so ist das Werkzeug immer dort, wo gearbeitet wird." });
}

/* =====================================================================
   12 — DER WAGENHEBER (Rangierwagenheber) vorne in der Mitte
   ===================================================================== */
{
  let k = schatten(0, 0, 18, 1.6, .3);
  k += `<path d="M-14 -2 L12 -2 L14 -6.4 L-10 -8 Q-14 -8 -14 -5 Z" fill="${ROT}"/>`;
  k += `<rect x="-14" y="-4.2" width="26" height="1" fill="#8a1d15"/>`;
  for (const x of [-11, 10]) k += `<circle cx="${x}" cy="-1.8" r="1.8" fill="#1d1f22"/><circle cx="${x}" cy="-1.8" r=".7" fill="#9aa3aa"/>`;
  /* Hubarm und Teller */
  k += `<path d="M6 -6 L14 -13 L16 -12 L9 -5 Z" fill="#a8261c"/><rect x="12.4" y="-15.2" width="6" height="1.8" rx=".6" fill="#2a2d31"/>`;
  /* Pumpe und langer Hebel nach hinten oben */
  k += `<rect x="-10" y="-12" width="4" height="5" rx=".6" fill="#59616a"/>`;
  k += `<path d="M-8 -10 L-19 -27" stroke="${STAHL}" stroke-width="1.5" stroke-linecap="round"/><path d="M-19.3 -27.5 L-20.8 -30" stroke="#1d1f22" stroke-width="2.2" stroke-linecap="round"/>`;
  k += `<text x="-1" y="-4.8" font-size="1.8" fill="#fff" font-family="Arial" font-weight="bold">2 t</text>`;
  S.teil({ id: "aw_wagenheber", de: "der Wagenheber", syl: "WA-gen-he-ber", it: "il cric", itSyl: "CRIC", en: "jack", x: 168, y: 195, steht: true, kunst: k,
    tipp: "Mit dem Wagenheber hebt man eine Seite des Autos an — zum Beispiel beim Reifenwechsel." });
}

/* =====================================================================
   13 — DAS RAD (abgenommen, liegt neben der Hebebühne)
   ===================================================================== */
{
  let k = schatten(0, 0, 13, 2, .3);
  k += `<path d="M-12.4 -2 L-12.4 -5.4 A12.4 3.6 0 0 1 12.4 -5.4 L12.4 -2 A12.4 3.6 0 0 1 -12.4 -2 Z" fill="${GUMMI}"/>`;
  k += `<ellipse cx="0" cy="-5.4" rx="12.4" ry="3.6" fill="#26282b"/><ellipse cx="0" cy="-5.4" rx="8.2" ry="2.4" fill="${FELGE}"/>`;
  for (let i = 0; i < 5; i++) { const a = i * 72 * Math.PI / 180; k += `<line x1="0" y1="-5.4" x2="${r(Math.cos(a) * 7.6)}" y2="${r(-5.4 + Math.sin(a) * 2.2)}" stroke="#9aa3aa" stroke-width="1.1"/>`; }
  k += `<ellipse cx="0" cy="-5.4" rx="2" ry=".7" fill="#59616a"/><path d="M-10 -7.4 A11 3 0 0 1 4 -8.8" stroke="#5a5d62" stroke-width=".5" fill="none"/>`;
  S.teil({ id: "aw_rad", de: "das Rad", syl: "RAD", it: "la ruota", itSyl: "RUO-ta", en: "wheel", x: 214, y: 177, steht: true, kunst: k,
    tipp: "Ein Rad besteht aus Felge und Reifen." });
}

/* =====================================================================
   14 — DER MECHANIKER (Arbeitshose, Poloshirt) mit dem KOSTENVORANSCHLAG
        und DIE KUNDIN am Rolltor
   ===================================================================== */
{
  const m = B.mensch({ id: "aw_mech", geschlecht: "m", pose: "halten", blick: 62, frisur: "kurz", haarfarbe: "dunkelbraun", haut: "mittel", bart: true,
    kleidung: { oberteil: { stueck: "tshirt", farbe: "#3b4a5a" }, unterteil: { stueck: "arbeitshose", farbe: "#2f4f7a" }, schuhe: { stueck: "stiefel", farbe: "schwarz" } } }, 79);
  S.teil({ id: "aw_mechaniker", de: "der Mechaniker", syl: "Me-CHA-ni-ker", it: "il meccanico", itSyl: "mec-CA-ni-co", en: "mechanic", x: 246, y: 192, kunst: m.svg,
    tipp: "Er sagt: „Die Bremsen hinten sind runter. Das kostet etwa 280 Euro.“" });
  /* Klemmbrett in seinen Händen */
  const hs = [m.z.handL, m.z.handR].filter(Boolean);
  const hx = hs.reduce((s, h) => s + h.x, 0) / hs.length * m.k, hy = Math.min(...hs.map((h) => h.y)) * m.k;
  let k = `<g transform="translate(${r(hx + 1)} ${r(hy - 1)}) rotate(-8)"><rect x="-5" y="-12" width="10" height="13" rx=".6" fill="#7a5a36"/><rect x="-4.4" y="-11" width="8.8" height="11.4" fill="#fff"/><rect x="-2" y="-12.6" width="4" height="1.8" rx=".4" fill="${STAHL}"/>`;
  k += `<text x="0" y="-8.6" font-size="1.4" text-anchor="middle" fill="#1d2125" font-family="Arial" font-weight="bold">Kostenvoranschlag</text>`;
  for (let i = 0; i < 4; i++) k += `<line x1="-3.6" y1="${-6.8 + i * 1.5}" x2="${i === 3 ? 0 : 3.6}" y2="${-6.8 + i * 1.5}" stroke="#7d868d" stroke-width=".3"/>`;
  k += `<text x="3.6" y="-.8" font-size="1.4" text-anchor="end" fill="#c62f25" font-family="Arial" font-weight="bold">280,- €</text></g>`;
  S.teil({ oben: true, id: "aw_kostenvoranschlag", de: "der Kostenvoranschlag", syl: "KOS-ten-vor-an-schlag", it: "il preventivo", itSyl: "pre-ven-TI-vo", en: "cost estimate", x: 246, y: 192, kunst: k,
    tipp: "Vor der Reparatur bekommt man einen Kostenvoranschlag: So viel wird es ungefähr kosten." });
}
{
  const m = B.mensch({ id: "aw_kundin", geschlecht: "w", pose: "stehen", blick: -58, frisur: "lang", haarfarbe: "hellbraun", haut: "hell",
    kleidung: { oberteil: { stueck: "pullover", farbe: "creme" }, unterteil: { stueck: "jeans", farbe: "jeans" }, jacke: { stueck: "mantel", farbe: "#7a3b45" }, schuhe: { stueck: "stiefel", farbe: "braun" }, zubehoer: { stueck: "tasche", farbe: "schwarz" } } }, 72);
  S.teil({ id: "aw_kundin_aw", de: "die Kundin", syl: "KUN-din", it: "la cliente", itSyl: "cli-EN-te", en: "customer", x: 296, y: 195, kunst: m.svg,
    tipp: "Sie fragt: „Wann ist mein Auto fertig?“" });
}

/* Licht von oben über allem (fängt keinen Tipp ab) */
S.davor(`<rect x="0" y="0" width="320" height="200" fill="${S.rg("hallenlicht", [[0, "#fff", 0.07], [1, "#fff", 0]], 0.5, 0.1, 0.8)}"/>`);

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/autowerkstatt.js"));
console.log(aus);
