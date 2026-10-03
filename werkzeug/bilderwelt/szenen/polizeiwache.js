#!/usr/bin/env node
/* =====================================================================
   DIE POLIZEIWACHE (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (Landesregierung NRW „NRW-Polizei komplett in blauer
   Uniform“, Sachsen seit 2011 blau, Bayern als letztes Land grün;
   Bilder heutiger Polizeiwachen) — so sieht eine Wache für Bürger aus:
   - Man kommt in einen kleinen Vorraum (Bürgerbereich) mit Wartestuhl
     und PINNWAND: Fahndungsplakate („Gesucht“, Phantombild), Vermisst-
     meldungen, Hinweise gegen Taschendiebe, „Notruf 110“.
   - Der WACHTRESEN ist durch eine SICHERHEITSSCHEIBE (Panzerglas, grün
     schimmernde Kante) vom Wachraum getrennt; man spricht durch ein
     Sprechgitter, Ausweis und Formulare gehen durch die DURCHREICHE.
   - Hinter der Scheibe: die Polizistin in Blau (hellblaues Diensthemd,
     dunkelblaue Weste/Hose mit „POLIZEI“), Computer, Telefon, das
     FUNKGERÄT in der Ladeschale; man nimmt die ANZEIGE auf und schreibt
     ein PROTOKOLL.
   - Durchs Fenster des Wachraums sieht man auf den Hof: der STREIFEN-
     WAGEN, silbern mit blauen Flächen, „POLIZEI“ und Blaulichtbalken.
   Maßstab: Kamera 1,96 m hoch, Horizont y = 60; Einheiten je Meter =
   (y − 60) / 1,96. Die Ebene von Scheibe und Bürgerwand liegt bei
   y = 150 (≈ 46 je Meter), der Tresen ragt 0,25 m davor, die Rückwand
   des Wachraums steht bei y = 112.
   Blick: von links, Fluchtpunkt (230 | 60) — der Tresen läuft nach
   rechts weg in den Wachraum. Farben: Weißgrau, Anthrazit, Polizeiblau.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "polizeiwache", titel: "Die Polizeiwache", emoji: "🚓", thema: "Behörden", kuerzel: "b08d", fassung: 852 });
const rnd = zufall(110);
const r = B.r;
const VP = { x: 230, y: 60 };
const SK = (y) => (y - VP.y) / 1.96;
const auf = (x0, y0, y) => VP.x + (x0 - VP.x) * (y - VP.y) / (y0 - VP.y);

function figur(spec, hoehe) {
  const m = B.mensch(spec, hoehe);
  const schritt = m.k < 0.42 ? 1 : 2;
  m.svg = m.svg.replace(/ data-teil="[^"]*"/g, "").replace(/ d="([^"]*)"/g, (q, d) => ` d="${d.replace(/-?\d+\.\d+/g, (n) => String(Math.round(+n * schritt) / schritt))}"`);
  return m;
}
const T = (x, y, s, txt, f = "#222", extra = "") => `<text x="${r(x)}" y="${r(y)}" font-size="${s}" fill="${f}" font-family="Arial,Helvetica,sans-serif" text-anchor="middle"${extra}>${txt}</text>`;

/* ---------- Farben ---------------------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const PBLAU = "#16336b";
const WAND = S.lg("wand", [[0, "#eef0f2"], [1, "#dde1e5"]]);
const STAHL = S.lg("stahl", [[0, "#eef1f3"], [0.45, "#c9cfd4"], [0.55, "#b5bcc2"], [1, "#e1e5e8"]], 0, 0, 1, 0);
const ANTHRAZIT = S.lg("anthr", [[0, "#4a4f56"], [1, "#30343a"]]);
const SCHWARZ = S.lg("geraet", [[0, "#3a3e44"], [1, "#1c1f23"]]);

/* =====================================================================
   KULISSE — Bürgerbereich (Decke, Wand links, Granitboden) und
   Wachraum hinter der Scheibe (Rückwand mit Fenster auf den Hof)
   ===================================================================== */
const EB = 150, GX = 118;                 // Ebene Tresen/Bürgerwand, linke Kante der Scheibe
const DECKE = EB - 2.7 * SK(EB);           // Deckenhöhe in der Ebene
const RW = 112, RWO = RW - 2.7 * SK(RW);   // Rückwand Wachraum: Fuß, Oberkante
const xRW0 = auf(GX, EB, RW), xRW1 = auf(320, EB, RW);
const FEN = { x0: 186, x1: 266, yo: RW - 2.25 * SK(RW), yu: RW - 0.9 * SK(RW) };
{
  /* Decke des Bürgerbereichs mit Leuchten zum Fluchtpunkt */
  let k = `<rect x="0" y="0" width="320" height="${r(DECKE + 1)}" fill="${S.lg("decke", [[0, "#e7e9ea"], [1, "#f3f4f4"]])}"/>`;
  for (const xb of [30, 120, 210, 300]) {
    const x2 = VP.x + (xb - VP.x) * (0 - VP.y) / (DECKE - VP.y);
    k += `<line x1="${xb}" y1="${r(DECKE)}" x2="${r(x2)}" y2="0" stroke="#cfd3d6" stroke-width=".35"/>`;
  }
  k += `<path d="M40 ${r(DECKE - 8)} L92 ${r(DECKE - 8)} L86 ${r(DECKE - 4)} L44 ${r(DECKE - 4)} Z" fill="#fbfdff" stroke="#d6dadd" stroke-width=".3"/>`;
  /* Wachraum: Decke, Seitenwände, Rückwand mit Fenster, Boden */
  const ext = (xp, yp, x) => VP.y + (yp - VP.y) * (x - VP.x) / (xp - VP.x);   // Fluchtlinie durch (xp|yp) bis x
  k += `<path d="M${GX} ${r(DECKE)} L320 ${r(DECKE)} L320 ${r(ext(xRW1, RWO, 320))} L${r(xRW1)} ${r(RWO)} L${r(xRW0)} ${r(RWO)} Z" fill="#e9ebec"/>`;
  k += `<path d="M${GX} ${r(DECKE)} L${r(xRW0)} ${r(RWO)} L${r(xRW0)} ${RW} L${GX} ${EB} Z" fill="#d9dde0"/>`;
  k += `<rect x="${r(xRW0)}" y="${r(RWO)}" width="${r(xRW1 - xRW0)}" height="${r(RW - RWO)}" fill="${S.lg("rw", [[0, "#f1f2f3"], [1, "#e3e6e8"]])}"/>`;
  k += `<path d="M${r(xRW1)} ${r(RWO)} L320 ${r(ext(xRW1, RWO, 320))} L320 ${r(ext(xRW1, RW, 320))} L${r(xRW1)} ${RW} Z" fill="#d4d8db"/>`;
  k += `<path d="M${GX} ${EB} L${r(xRW0)} ${RW} L${r(xRW1)} ${RW} L320 ${r(ext(xRW1, RW, 320))} L320 ${EB} Z" fill="#8c9296"/>`;
  /* Fenster: draußen der Hof — Himmel, Mauer, Asphalt (der Wagen ist ein eigenes Teil) */
  k += `<rect x="${FEN.x0}" y="${r(FEN.yo)}" width="${FEN.x1 - FEN.x0}" height="${r(FEN.yu - FEN.yo)}" fill="${S.lg("hof", [[0, "#bcd9ee"], [0.55, "#dfeaf0"], [0.56, "#a9a59c"], [0.7, "#bdb8ad"], [0.71, "#77797b"], [1, "#5f6264"]])}"/>`;
  k += `<rect x="${FEN.x0}" y="${r(FEN.yo + (FEN.yu - FEN.yo) * 0.36)}" width="${FEN.x1 - FEN.x0}" height="3" fill="#8fb57a" opacity=".7"/>`;
  /* Uhr und Stadtplan im Wachraum */
  k += `<circle cx="${r(xRW0 + 10)}" cy="${r(RWO + 9)}" r="4" fill="#2a2e33"/><circle cx="${r(xRW0 + 10)}" cy="${r(RWO + 9)}" r="3.4" fill="#fbfbfb"/><path d="M${r(xRW0 + 10)} ${r(RWO + 9)} l0 -2.4 M${r(xRW0 + 10)} ${r(RWO + 9)} l1.8 .8" stroke="#111" stroke-width=".4"/>`;
  k += `<rect x="${r(xRW0 + 2)}" y="${r(RWO + 16)}" width="16" height="12" fill="#f4f1e6" stroke="#8a8f94" stroke-width=".4"/>`;
  for (let i = 0; i < 6; i++) k += `<path d="M${r(xRW0 + 2.6 + rnd() * 14)} ${r(RWO + 16.6)} q${r(rnd() * 4 - 2)} 5 ${r(rnd() * 6 - 3)} 10.8" stroke="${i % 2 ? "#e0b44a" : "#c8ccd0"}" stroke-width=".5" fill="none"/>`;
  k += `<path d="M${r(xRW0 + 4)} ${r(RWO + 22)} q6 -3 12 1" stroke="#6aa6d8" stroke-width=".8" fill="none"/>`;
  /* Bürgerbereich: Wand links (in der Ebene), Sockel, Granitboden */
  k += `<rect x="0" y="${r(DECKE)}" width="${GX}" height="${r(EB - DECKE)}" fill="${WAND}"/>`;
  k += `<rect x="0" y="${r(EB - 0.9 * SK(EB))}" width="${GX}" height="${r(0.9 * SK(EB))}" fill="${S.lg("blauwand", [[0, "#2a4a86"], [1, "#1c3566"]])}"/><rect x="0" y="${r(EB - 0.9 * SK(EB))}" width="${GX}" height="1.2" fill="#c9d3e3"/>`;
  k += `<rect x="0" y="${EB - 3}" width="${GX}" height="3" fill="#22262b"/>`;
  k += `<path d="M0 ${EB} L320 ${EB} L320 200 L0 200 Z" fill="${S.lg("granit", [[0, "#5c6268"], [1, "#71777d"]])}"/>`;
  for (let i = -16; i <= 10; i++) { const xb = VP.x + i * 22; k += `<line x1="${r(xb)}" y1="${EB}" x2="${r(auf(xb, EB, 200))}" y2="200" stroke="#3c4146" stroke-width=".4" opacity=".7"/>`; }
  for (const y of [158, 168, 181, 198]) k += `<line x1="0" y1="${y}" x2="320" y2="${y}" stroke="#3c4146" stroke-width=".4" opacity=".6"/>`;
  for (let i = 0; i < 260; i++) k += `<circle cx="${r(rnd() * 320)}" cy="${r(EB + rnd() * 50)}" r="${r(0.2 + rnd() * 0.35)}" fill="${rnd() < 0.5 ? "#9aa1a7" : "#2e3236"}" opacity=".55"/>`;
  k += `<path d="M0 ${EB} L320 ${EB} L320 200 L0 200 Z" fill="${S.lg("granitlicht", [[0, "#000", 0.15], [0.5, "#fff", 0.05], [1, "#fff", 0.1]])}"/>`;
  S.hinten(k);
}

/* =====================================================================
   1 — DER STREIFENWAGEN (draußen auf dem Hof, durch das Fenster)
   ===================================================================== */
{
  const s = SK(91);          // Hof: ≈ 16 Einheiten je Meter
  const L = 4.9 * s, H = 1.5 * s;
  let k = `<ellipse cx="0" cy=".4" rx="${r(L / 2)}" ry="1.2" fill="#1b1d1f" opacity=".45"/>`;
  /* Karosserie (silber), Kombi */
  k += `<path d="M${r(-L / 2)} ${r(-H * 0.28)} Q${r(-L / 2)} ${r(-H * 0.55)} ${r(-L / 2 + 3)} ${r(-H * 0.58)} L${r(-L * 0.28)} ${r(-H * 0.6)} L${r(-L * 0.16)} ${r(-H * 0.98)} L${r(L * 0.36)} ${r(-H * 0.98)} Q${r(L * 0.44)} ${r(-H * 0.96)} ${r(L * 0.47)} ${r(-H * 0.7)} L${r(L / 2)} ${r(-H * 0.55)} L${r(L / 2)} ${r(-H * 0.2)} L${r(-L / 2)} ${r(-H * 0.2)} Z" fill="${S.lg("silber", [[0, "#f4f6f7"], [0.5, "#d4d9dd"], [1, "#aab1b7"]])}"/>`;
  /* blaue Flächen (Folierung) */
  k += `<path d="M${r(-L / 2)} ${r(-H * 0.28)} L${r(L / 2)} ${r(-H * 0.28)} L${r(L / 2)} ${r(-H * 0.48)} L${r(-L / 2 + 1)} ${r(-H * 0.48)} Z" fill="#1e4fa8"/>`;
  k += `<path d="M${r(-L * 0.3)} ${r(-H * 0.5)} L${r(L * 0.1)} ${r(-H * 0.5)} L${r(L * 0.06)} ${r(-H * 0.58)} L${r(-L * 0.28)} ${r(-H * 0.58)} Z" fill="#1e4fa8" opacity=".85"/>`;
  k += T(-L * 0.05, -H * 0.33, H * 0.13, "POLIZEI", "#ffffff", ' font-weight="bold" letter-spacing=".3"');
  /* Fenster */
  k += `<path d="M${r(-L * 0.13)} ${r(-H * 0.92)} L${r(L * 0.34)} ${r(-H * 0.92)} Q${r(L * 0.41)} ${r(-H * 0.9)} ${r(L * 0.43)} ${r(-H * 0.68)} L${r(-L * 0.24)} ${r(-H * 0.64)} Z" fill="${S.lg("scheiben", [[0, "#4b5a68"], [1, "#2a333c"]])}"/>`;
  k += `<path d="M${r(L * 0.08)} ${r(-H * 0.92)} L${r(L * 0.08)} ${r(-H * 0.66)} M${r(L * 0.24)} ${r(-H * 0.92)} L${r(L * 0.24)} ${r(-H * 0.67)}" stroke="#c9cfd4" stroke-width=".7"/>`;
  /* Blaulichtbalken */
  k += `<rect x="${r(-L * 0.06)}" y="${r(-H * 1.1)}" width="${r(L * 0.22)}" height="${r(H * 0.12)}" rx=".6" fill="#2a2e33"/><rect x="${r(-L * 0.05)}" y="${r(-H * 1.09)}" width="${r(L * 0.09)}" height="${r(H * 0.09)}" rx=".4" fill="#3d7bff"/><rect x="${r(L * 0.06)}" y="${r(-H * 1.09)}" width="${r(L * 0.09)}" height="${r(H * 0.09)}" rx=".4" fill="#3d7bff"/>`;
  k += `<ellipse cx="${r(L * 0.05)}" cy="${r(-H * 1.05)}" rx="${r(L * 0.15)}" ry="${r(H * 0.12)}" fill="#7fb0ff" opacity=".35" filter="url(#bw_weich)"/>`;
  /* Räder */
  for (const x of [-L * 0.31, L * 0.3]) k += `<circle cx="${r(x)}" cy="${r(-H * 0.2)}" r="${r(H * 0.22)}" fill="#1b1d1f"/><circle cx="${r(x)}" cy="${r(-H * 0.2)}" r="${r(H * 0.12)}" fill="#b9c0c6"/>`;
  k += `<path d="M${r(-L / 2 + 1)} ${r(-H * 0.55)} L${r(L / 2 - 1)} ${r(-H * 0.55)}" stroke="#fff" stroke-width=".5" opacity=".7"/>`;
  k += `<rect x="${r(L / 2 - 1.6)}" y="${r(-H * 0.5)}" width="1.6" height="${r(H * 0.1)}" fill="#fff4c4"/>`;
  S.teil({ id: "pw_streifenwagen", de: "der Streifenwagen", syl: "STREI-fen-wa-gen", it: "l'auto della polizia", itSyl: "AU-to della po-li-ZI-a", en: "patrol car", x: 228, y: 91, kunst: k,
    tipp: "Die Polizei in fast ganz Deutschland fährt blau-silberne Streifenwagen. Notruf: 110." });
  /* Fensterrahmen und Spiegelung darüber (Kulisse vor dem Wagen: als „davor“ würde er alles überdecken — hier reicht die Wand) */
}
{
  /* DAS FENSTER des Wachraums — Rahmen, Sprosse, Spiegelung (eigenes Teil) */
  let k = `<rect x="${FEN.x0 - 1.4}" y="${r(FEN.yo - 1.4)}" width="${FEN.x1 - FEN.x0 + 2.8}" height="${r(FEN.yu - FEN.yo + 2.8)}" fill="none" stroke="#9aa1a6" stroke-width="1.6"/>`;
  k += `<line x1="${(FEN.x0 + FEN.x1) / 2}" y1="${r(FEN.yo)}" x2="${(FEN.x0 + FEN.x1) / 2}" y2="${r(FEN.yu)}" stroke="#9aa1a6" stroke-width="1.1"/>`;
  k += `<path d="M${FEN.x0 + 2} ${r(FEN.yo)} L${FEN.x0 + 12} ${r(FEN.yo)} L${FEN.x0 + 2} ${r(FEN.yu - 4)} Z" fill="#fff" opacity=".2"/>`;
  k += `<rect x="${FEN.x0 - 3}" y="${r(FEN.yu + 1.4)}" width="${FEN.x1 - FEN.x0 + 6}" height="1.6" fill="#cfd3d6"/>`;
  const cx = (FEN.x0 + FEN.x1) / 2;
  S.teil({ id: "pw_fenster", de: "das Fenster", syl: "FENS-ter", it: "la finestra", itSyl: "fi-NE-stra", en: "window", x: cx, y: FEN.yu, kunst: `<g transform="translate(${-cx} ${r(-FEN.yu)})">${k}</g>` });
}

/* =====================================================================
   2 — DIE PINNWAND (Bürgerbereich) — Lupe: Fahndungsplakat,
       Phantombild, Vermisstenmeldung, Hinweis Taschendiebe
   ===================================================================== */
const pinnUnter = [];
{
  const cx = 38, cy = 92, w = 64, h = 40;
  let k = `<rect x="${-w / 2 - 1.4}" y="${-h / 2 - 1.4}" width="${w + 2.8}" height="${h + 2.8}" rx="1" fill="${STAHL}"/>`;
  k += `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="${S.lg("filz", [[0, "#2f4f7d"], [1, "#253f66"]])}"/>`;
  const plakat = (x, y, pw, ph, kopf, kf, dreh, inhalt) => `<g transform="rotate(${dreh} ${x} ${y})"><rect x="${x - pw / 2}" y="${y - ph / 2}" width="${pw}" height="${ph}" fill="#fdfdfb"/><rect x="${x - pw / 2}" y="${y - ph / 2}" width="${pw}" height="${r(ph * 0.17)}" fill="${kf}"/>${T(x, y - ph / 2 + ph * 0.13, r(ph * 0.11), kopf, "#fff", ' font-weight="bold"')}${inhalt}<circle cx="${x}" cy="${r(y - ph / 2 + 0.8)}" r=".6" fill="#e0a526"/></g>`;
  /* Fahndungsplakat mit Foto */
  {
    const x = -20, y = -6;
    let i = `<rect x="${x - 6}" y="${y - 6.6}" width="12" height="13" fill="#d9dcdf"/><circle cx="${x}" cy="${y - 2.4}" r="3.2" fill="#a88b74"/><path d="M${x - 3.2} ${y - 3.6} Q${x} ${y - 7.4} ${x + 3.2} ${y - 3.6} Q${x} ${y - 5.4} ${x - 3.2} ${y - 3.6} Z" fill="#3a2a20"/><path d="M${x - 5.6} ${y + 6.4} Q${x} ${y} ${x + 5.6} ${y + 6.4} Z" fill="#3e4652"/>`;
    i += T(x, y + 9.4, 1.6, "Belohnung 5.000 €", "#b8272a", ' font-weight="bold"') + `<rect x="${x - 6}" y="${y + 10.6}" width="12" height=".5" fill="#999"/>`;
    k += plakat(x, y + 1, 16, 24, "GESUCHT", "#b8272a", -1.5, i);
    pinnUnter.push({ id: "pw_fahndungsplakat", de: "das Fahndungsplakat", syl: "FAHN-dungs-pla-kat", it: "il manifesto di ricercato", itSyl: "ma-ni-FE-sto di ri-cer-CA-to", en: "wanted poster", x: cx + x, y: cy + y + 13, kunst: flaeche(-8.4, -24, 16.8, 24.4),
      tipp: "Auf dem Fahndungsplakat sucht die Polizei eine Person. Hinweise gibt man unter 110." });
  }
  /* Phantombild (Bleistiftzeichnung) */
  {
    const x = 0, y = -7;
    let i = `<rect x="${x - 5.6}" y="${y - 5}" width="11.2" height="11" fill="#f2f0ea"/><ellipse cx="${x}" cy="${y}" rx="3.4" ry="4.2" fill="none" stroke="#555" stroke-width=".35"/><path d="M${x - 3.4} ${y - 1} Q${x} ${y - 6} ${x + 3.4} ${y - 1}" stroke="#444" stroke-width=".6" fill="none"/>`;
    i += `<path d="M${x - 1.8} ${y - 0.2} h1.2 M${x + 0.6} ${y - 0.2} h1.2 M${x} ${y + 0.4} l-.4 1.4 h.8 M${x - 1} ${y + 2.6} q1 .5 2 0" stroke="#333" stroke-width=".3" fill="none"/>`;
    for (let n = 0; n < 8; n++) i += `<line x1="${r(x - 3 + n * 0.8)}" y1="${y + 3}" x2="${r(x - 3.6 + n * 0.8)}" y2="${y + 4}" stroke="#777" stroke-width=".2"/>`;
    i += T(x, y + 8, 1.3, "Wer kennt diesen Mann?", "#333");
    k += plakat(x, y + 1, 14, 20, "ZEUGEN", "#2e3a4a", 1, i);
    pinnUnter.push({ id: "pw_phantombild", de: "das Phantombild", syl: "fan-TOM-bild", it: "l'identikit", itSyl: "i-den-ti-KIT", en: "composite sketch", x: cx + x, y: cy + y + 11, kunst: flaeche(-7.4, -20, 14.8, 20.4),
      tipp: "Ein Phantombild wird nach den Angaben von Zeugen gezeichnet." });
  }
  /* Vermisstenmeldung */
  {
    const x = 20, y = -6;
    let i = `<rect x="${x - 5}" y="${y - 5.4}" width="10" height="10.6" fill="#dfe6ea"/><circle cx="${x}" cy="${y - 1.6}" r="2.8" fill="#e0b48f"/><path d="M${x - 3} ${y - 2.4} Q${x} ${y - 6.6} ${x + 3} ${y - 2.4} L${x + 3.2} ${y + 1} L${x - 3.2} ${y + 1} Z" fill="#b5873f"/><circle cx="${x}" cy="${y - 1.2}" r="2.2" fill="#e8bf9c"/><path d="M${x - 4.6} ${y + 5.2} Q${x} ${y + 0.6} ${x + 4.6} ${y + 5.2} Z" fill="#c0392b"/>`;
    i += T(x, y + 8.2, 1.4, "Lena, 14 Jahre", "#222", ' font-weight="bold"');
    k += plakat(x, y + 1, 14, 22, "VERMISST", "#e07a1f", 2, i);
    pinnUnter.push({ id: "pw_vermisstenmeldung", de: "die Vermisstenmeldung", syl: "ver-MISS-ten-mel-dung", it: "l'avviso di persona scomparsa", itSyl: "av-VI-so di per-SO-na scom-PAR-sa", en: "missing person notice", x: cx + x, y: cy + y + 12, kunst: flaeche(-7.4, -22, 14.8, 22.4) });
  }
  /* kleine Zettel unten: Taschendiebe, Notruf, Fahrradcodierung */
  k += `<g transform="rotate(-2 -22 14)"><rect x="-30" y="9" width="17" height="9" fill="#ffe36b"/>${T(-21.5, 12.4, 1.8, "Vorsicht", "#111", ' font-weight="bold"')}${T(-21.5, 15.2, 1.5, "Taschendiebe!", "#111")}</g>`;
  k += `<g transform="rotate(1.5 0 14)"><rect x="-8" y="9.6" width="16" height="8.4" fill="#ffffff"/>${T(0, 13, 1.6, "Fahrrad-", "#16336b", ' font-weight="bold"')}${T(0, 15.6, 1.6, "codierung Di 10 Uhr", "#16336b")}</g>`;
  k += `<g transform="rotate(-1 21 14)"><rect x="13" y="9" width="17" height="9" fill="#b8272a"/>${T(21.5, 13.4, 3.2, "110", "#fff", ' font-weight="bold"')}${T(21.5, 16.4, 1.4, "Notruf Polizei", "#fff")}</g>`;
  S.teil({ id: "pw_pinnwand", de: "die Pinnwand", syl: "PINN-wand", it: "la bacheca", itSyl: "ba-CHE-ca", en: "notice board", x: cx, y: cy + h / 2, kunst: `<g transform="translate(0 ${-h / 2})">${k}</g>`,
    zoom: { x: cx - w / 2 - 2, y: cy - h / 2 - 2, w: w + 4, h: h + 4 }, unter: pinnUnter.map((u) => Object.assign(u, {})) });
}

/* =====================================================================
   3 — DIE TÜR zum Wachraum (gesichert, mit Summer)
   ===================================================================== */
{
  const s = SK(EB), w = 0.95 * s, h = 2.05 * s;
  let k = `<rect x="${r(-w / 2 - 1.4)}" y="${r(-h - 1.4)}" width="${r(w + 2.8)}" height="${r(h + 1.4)}" fill="#8a9196"/>`;
  k += `<rect x="${r(-w / 2)}" y="${r(-h)}" width="${r(w)}" height="${r(h)}" fill="${S.lg("tuer", [[0, "#c9ced2"], [1, "#a9b0b5"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${r(-w / 2 + 3)}" y="${r(-h + 5)}" width="${r(w - 6)}" height="14" rx=".5" fill="#9fb3bf" stroke="#7d868d" stroke-width=".4"/><path d="M${r(-w / 2 + 3)} ${r(-h + 5)} l${r(w - 6)} 14" stroke="#7d868d" stroke-width=".25"/><path d="M${r(w / 2 - 3)} ${r(-h + 5)} l${r(-(w - 6))} 14" stroke="#7d868d" stroke-width=".25"/>`;
  k += `<rect x="${r(-w / 2 + 3)}" y="${r(-h + 22)}" width="${r(w - 6)}" height="6" fill="#fff"/>` + T(0, -h + 26.2, 2.4, "Kein Zutritt", "#b8272a", ' font-weight="bold"');
  k += `<rect x="${r(w / 2 - 5)}" y="${r(-h * 0.5)}" width="3.6" height="1.2" rx=".5" fill="${STAHL}"/><rect x="${r(w / 2 + 2.2)}" y="${r(-h * 0.56)}" width="2.4" height="3.6" rx=".4" fill="#2a2e33"/><circle cx="${r(w / 2 + 3.4)}" cy="${r(-h * 0.56 + 1)}" r=".5" fill="#3ca35a"/>`;
  S.teil({ id: "pw_tuer", de: "die Tür", syl: "TÜR", it: "la porta", itSyl: "POR-ta", en: "door", x: 95, y: EB, steht: true, kunst: k,
    tipp: "Diese Tür öffnet nur die Polizei — mit einem Summer." });
}

/* =====================================================================
   4 — DIE POLIZISTIN (hinter der Scheibe, am Tresen)
   ===================================================================== */
{
  const fy = 128, s = SK(fy);
  const m = figur({ id: "b08d_pol", geschlecht: "w", pose: "halten", blick: -14, frisur: "zopf", haarfarbe: "blond", haut: "hell",
    kleidung: { oberteil: { stueck: "polizeihemd" }, jacke: { stueck: "weste", farbe: "#1b2c4f" }, unterteil: { stueck: "anzughose", farbe: "#1b2c4f" }, schuhe: { stueck: "stiefel", farbe: "schwarz" }, zubehoer: { stueck: "buch", farbe: "#f4f4f0" } } }, s * 1.7);
  const b = m.z.punkte.brust;
  let auf_ = `<rect x="${r(b[0] * m.k - 4.2)}" y="${r(b[1] * m.k - 3.4)}" width="8.4" height="2.2" rx=".3" fill="#ffffff" opacity=".95"/>` + `<text x="${r(b[0] * m.k)}" y="${r(b[1] * m.k - 1.7)}" font-size="1.9" fill="${PBLAU}" font-family="Arial" font-weight="bold" text-anchor="middle">POLIZEI</text>`;
  /* Schulterklappe mit Sternen (Polizeimeisterin) */
  const sl = m.z.punkte.schulterL || m.z.punkte.schulterR;
  if (sl) auf_ += `<rect x="${r(sl[0] * m.k - 1.6)}" y="${r(sl[1] * m.k - 0.7)}" width="3.2" height="1.4" rx=".3" fill="#1b2c4f"/><circle cx="${r(sl[0] * m.k - 0.6)}" cy="${r(sl[1] * m.k)}" r=".35" fill="#cfd6df"/><circle cx="${r(sl[0] * m.k + 0.6)}" cy="${r(sl[1] * m.k)}" r=".35" fill="#cfd6df"/>`;
  S.teil({ id: "pw_polizistin", de: "die Polizistin", syl: "Po-li-ZIS-tin", it: "la poliziotta", itSyl: "po-li-ZIOT-ta", en: "police officer", x: 194, y: fy, kunst: m.svg + auf_,
    tipp: "In fast allen Bundesländern trägt die Polizei Blau — nur Bayern hatte lange Grün." });
}

/* =====================================================================
   5 — DER TRESEN (Edelstahl und Anthrazit) mit der Arbeitsfläche hinter
       der Scheibe — Lupe: Anzeige, Ausweis, Protokoll, Kugelschreiber
   ===================================================================== */
const TR = { x0: GX, x1: 320, yf: EB + 12, yb: 140 };   // Fußlinie vorn und hinten
const tresenUnter = [];
const SCH = { yb: 0 };
{
  const s = SK(TR.yf), hT = 1.05 * s, yb = TR.yb;    // Hinterkante (Fußlinie)
  const xb0 = auf(TR.x0, TR.yf, yb), xb1 = auf(TR.x1, TR.yf, yb), sb = SK(yb);
  const cx = (TR.x0 + TR.x1) / 2;
  const P = (x, y) => `${r(x - cx)} ${r(y - TR.yf)}`;
  let k = schatten(0, 0.5, (TR.x1 - TR.x0) / 2 + 2, 2, 0.3);
  /* linke Stirnseite (zum Betrachter gedreht) */
  k += `<path d="M${P(TR.x0, TR.yf)} L${P(TR.x0, TR.yf - hT)} L${P(xb0, yb - 1.05 * sb)} L${P(xb0, yb)} Z" fill="#3a3f45"/>`;
  /* Platte (Granit hell) */
  k += `<path d="M${P(TR.x0 - 1, TR.yf - hT)} L${P(TR.x1 + 1, TR.yf - hT)} L${P(xb1, yb - 1.05 * sb)} L${P(xb0, yb - 1.05 * sb)} Z" fill="${S.lg("tplatte", [[0, "#c9cdd0"], [1, "#e3e6e8"]])}"/>`;
  k += `<rect x="${r(TR.x0 - 1 - cx)}" y="${r(-hT)}" width="${TR.x1 - TR.x0 + 2}" height="2" fill="#9ea4a8"/>`;
  /* Front: Anthrazit, Edelstahlband, POLIZEI-Schriftzug, Stern */
  k += `<rect x="${r(TR.x0 - cx)}" y="${r(-hT + 2)}" width="${TR.x1 - TR.x0}" height="${r(hT - 2)}" fill="${ANTHRAZIT}"/>`;
  k += `<rect x="${r(TR.x0 - cx)}" y="${r(-hT + 8)}" width="${TR.x1 - TR.x0}" height="5" fill="${STAHL}"/>`;
  k += `<rect x="${r(TR.x0 - cx)}" y="-4" width="${TR.x1 - TR.x0}" height="4" fill="#1b1d20"/>`;
  k += T(30, -hT + 30, 7.4, "POLIZEI", "#e9eef5", ' font-weight="bold" letter-spacing="1.6"');
  /* Polizeistern (achtstrahlig, blau mit Wappenfeld) */
  {
    const sx = -44, sy = -hT + 27;
    let st = "";
    for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; st += `<path d="M${sx} ${sy} L${r(sx + Math.cos(a - 0.2) * 5)} ${r(sy + Math.sin(a - 0.2) * 5)} L${r(sx + Math.cos(a) * 9)} ${r(sy + Math.sin(a) * 9)} L${r(sx + Math.cos(a + 0.2) * 5)} ${r(sy + Math.sin(a + 0.2) * 5)} Z" fill="#2a5dbf"/>`; }
    st += `<circle cx="${sx}" cy="${sy}" r="5.4" fill="#e9eef5"/><path d="M${sx - 3} ${sy - 3} L${sx + 3} ${sy - 3} L${sx + 3} ${sy + 0.6} Q${sx + 3} ${sy + 3} ${sx} ${sy + 4} Q${sx - 3} ${sy + 3} ${sx - 3} ${sy + 0.6} Z" fill="#c8323d"/><path d="M${sx - 1.6} ${sy - 1.2} L${sx + 1.6} ${sy - 1.2} L${sx} ${sy + 2.4} Z" fill="#fff"/>`;
    k += st;
  }
  k += `<rect x="${r(TR.x0 - cx)}" y="${r(-hT + 2)}" width="${TR.x1 - TR.x0}" height="1.2" fill="#fff" opacity=".18"/>`;
  /* Arbeitsfläche hinter der Scheibe: Tastatur */
  const yP = (t) => TR.yf - hT + (yb - 1.05 * sb - (TR.yf - hT)) * t;   // Höhe der Platte zwischen vorn (0) und hinten (1)
  k += `<path d="M${P(262, yP(0.84))} L${P(282, yP(0.84))} L${P(283, yP(0.95))} L${P(261, yP(0.95))} Z" fill="#2a2e33"/>`;
  /* Dinge auf dem Tresen (Lupe) */
  const dok = [];
  {  /* Anzeigeformular in der Durchreiche (vorn, Bürgerseite) */
    const x = 228, y = yP(0.2);
    let g = `<path d="M${P(x - 6, y + 1.6)} L${P(x + 6, y + 1.6)} L${P(x + 5.4, y - 2.2)} L${P(x - 5.4, y - 2.2)} Z" fill="#fcfcfa" stroke="#c9ccc9" stroke-width=".15"/>`;
    g += `<rect x="${r(x - 5 - cx)}" y="${r(y - 1.8 - TR.yf)}" width="10" height=".7" fill="${PBLAU}"/>`;
    for (let i = 0; i < 3; i++) g += `<rect x="${r(x - 4.6 - cx)}" y="${r(y - 0.7 + i * 0.7 - TR.yf)}" width="${8 - i * 2}" height=".25" fill="#8a8f95"/>`;
    k += g;
    dok.push({ id: "pw_anzeige_pw", de: "die Anzeige", syl: "AN-zei-ge", it: "la denuncia", itSyl: "de-NUN-cia", en: "criminal complaint", x, y: y + 1.8, w: 13, h: 5,
      tipp: "Eine Anzeige kann man bei jeder Polizeiwache erstatten — auch online." });
  }
  {  /* Personalausweis (Bürgerseite) */
    const x = 180, y = yP(0.24);
    let g = `<path d="M${P(x - 3.4, y + 1.4)} L${P(x + 3.4, y + 1.4)} L${P(x + 3, y - 1.4)} L${P(x - 3, y - 1.4)} Z" fill="${S.lg("ausweis", [[0, "#e8eef5"], [0.5, "#f1ecd9"], [1, "#e3d7ee"]], 0, 0, 1, 0)}" stroke="#9aa5b0" stroke-width=".15"/>`;
    g += `<rect x="${r(x - 2.8 - cx)}" y="${r(y - 1 - TR.yf)}" width="1.6" height="2" fill="#a88b74"/><rect x="${r(x - 0.6 - cx)}" y="${r(y - 0.9 - TR.yf)}" width="3" height=".4" fill="#5a6a80"/><rect x="${r(x - 0.6 - cx)}" y="${r(y - 0.1 - TR.yf)}" width="2.4" height=".3" fill="#8a96a3"/>`;
    k += g;
    dok.push({ id: "pw_ausweis_pw", de: "der Ausweis", syl: "AUS-weis", it: "la carta d'identità", itSyl: "CAR-ta d'i-den-ti-TÀ", en: "ID card", x, y: y + 1.6, w: 8, h: 4.4 });
  }
  {  /* Kugelschreiber (Bürgerseite) */
    const x = 190, y = yP(0.12);
    k += `<path d="M${P(x - 3.4, y + 0.6)} L${P(x + 3, y - 0.4)}" stroke="#16336b" stroke-width=".8" stroke-linecap="round"/><path d="M${P(x + 3, y - 0.4)} l.8 -.15" stroke="#c9cfd4" stroke-width=".5"/>`;
    dok.push({ id: "pw_kugelschreiber", de: "der Kugelschreiber", syl: "KU-gel-schrei-ber", it: "la penna a sfera", itSyl: "PEN-na a SFE-ra", en: "ballpoint pen", x, y: y + 1.6, w: 8, h: 3.6 });
  }
  {  /* Protokoll (hinter der Scheibe, bei der Polizistin) */
    const x = 246, y = yP(0.84);
    let g = `<path d="M${P(x - 5, y + 1.6)} L${P(x + 5, y + 1.6)} L${P(x + 4.4, y - 2)} L${P(x - 4.4, y - 2)} Z" fill="#fbfbf8" stroke="#c9ccc9" stroke-width=".15"/>`;
    for (let i = 0; i < 4; i++) g += `<rect x="${r(x - 4 - cx)}" y="${r(y - 1.6 + i * 0.75 - TR.yf)}" width="${7.6 - (i % 2) * 2}" height=".25" fill="#5a6a80"/>`;
    k += g;
    dok.push({ id: "pw_protokoll", de: "das Protokoll", syl: "Pro-to-KOLL", it: "il verbale", itSyl: "ver-BA-le", en: "record of statement", x, y: y + 1.8, w: 11, h: 4.6,
      tipp: "Im Protokoll steht, was man ausgesagt hat. Am Ende unterschreibt man es." });
  }
  SCH.yb = yb; SCH.yP = yP; SCH.hT = hT;
  dok.forEach((d) => tresenUnter.push({ id: d.id, de: d.de, syl: d.syl, it: d.it, itSyl: d.itSyl, en: d.en, tipp: d.tipp, x: d.x, y: d.y, kunst: flaeche(-d.w / 2, -d.h, d.w, d.h, 0.6) }));
  S.teil({ id: "pw_tresen", de: "der Tresen", syl: "TRE-sen", it: "il bancone", itSyl: "ban-CO-ne", en: "front desk", x: cx, y: TR.yf, steht: true, kunst: k,
    zoom: { x: 140, y: 78, w: 150, h: 54 }, unter: tresenUnter,
    tipp: "Am Tresen der Wache spricht man durch die Scheibe mit der Polizei." });
}

/* =====================================================================
   6 — AUF DEM TRESEN hinter der Scheibe: Computer, Telefon, Funkgerät
   ===================================================================== */
{
  const y = SCH.yP(0.8);
  let k = schatten(0, 0.3, 7, 0.9, 0.3);
  k += `<path d="M-3.4 0 L3.4 0 L2.6 -1.2 L-2.6 -1.2 Z" fill="#30353a"/><rect x="-.9" y="-4.4" width="1.8" height="3.6" fill="#3a3f44"/>`;
  k += `<path d="M-10 -19 L10 -20 L10 -4.6 L-10 -4 Z" fill="#1c1f23"/><path d="M-9 -18 L9 -18.9 L9 -5.4 L-9 -5 Z" fill="${S.lg("bild", [[0, "#e7eef6"], [1, "#c9d7e6"]])}"/>`;
  k += `<path d="M-9 -18 L9 -18.9 L9 -17 L-9 -16.2 Z" fill="${PBLAU}"/>`;
  for (let i = 0; i < 5; i++) k += `<rect x="-7.6" y="${-14.6 + i * 1.8}" width="${10 - (i % 3) * 2}" height=".7" fill="#8a9bb0"/>`;
  k += `<rect x="3.4" y="-14.6" width="4.4" height="5.4" fill="#b9c3cf"/><path d="M-9 -18 L-3 -18.3 L-9 -10 Z" fill="#fff" opacity=".14"/>`;
  S.teil({ oben: true, id: "pw_computer_pw", de: "der Computer", syl: "Com-PU-ter", it: "il computer", itSyl: "com-PU-ter", en: "computer", x: 272, y, steht: true, kunst: k });
}
{
  const y = SCH.yP(0.7);
  let k = schatten(0, 0.2, 5, 0.7, 0.3);
  k += `<path d="M-4.6 0 L4.6 0 L4 -3.4 L-4 -3.4 Z" fill="${SCHWARZ}"/><rect x="-2" y="-3.2" width="4" height="1.6" rx=".3" fill="#9cc6d8"/>`;
  for (let i = 0; i < 6; i++) k += `<rect x="${-2.6 + (i % 3) * 1.8}" y="${-1.2 + Math.floor(i / 3) * 0.6}" width="1.2" height=".4" fill="#596068"/>`;
  k += `<path d="M-5 -3.6 Q-5.6 -6.2 -3.4 -6.2 L3.4 -6.2 Q5.6 -6.2 5 -3.6 L3.4 -3.6 Q3 -5 0 -5 Q-3 -5 -3.4 -3.6 Z" fill="#2a2e33"/>`;
  k += `<path d="M4.6 -1 q3 1 2 4" stroke="#2a2e33" stroke-width=".4" fill="none"/>`;
  S.teil({ oben: true, id: "pw_telefon", de: "das Telefon", syl: "TE-le-fon", it: "il telefono", itSyl: "te-LE-fo-no", en: "telephone", x: 297, y, steht: true, kunst: k + flaeche(-6, -7, 12, 7.4) });
}
{
  /* DAS FUNKGERÄT — Handfunkgerät (Digitalfunk) in der Ladeschale */
  const y = SCH.yP(0.66);
  let k = schatten(0, 0.2, 4, 0.6, 0.3);
  k += `<path d="M-3.4 0 L3.4 0 L3 -3 L-3 -3 Z" fill="#2a2e33"/><circle cx="2.2" cy="-1.4" r=".45" fill="#3ca35a"/>`;
  k += `<rect x="-2" y="-12.4" width="4" height="10.4" rx=".8" fill="${S.lg("funk", [[0, "#3d4248"], [1, "#1c1f23"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-1.4" y="-11.2" width="2.8" height="2" rx=".3" fill="#9fe39a"/><rect x="-1.4" y="-8.4" width="2.8" height="3.6" rx=".3" fill="#4a5058"/>`;
  for (let i = 0; i < 3; i++) k += `<line x1="-1.1" y1="${-7.9 + i * 1.1}" x2="1.1" y2="${-7.9 + i * 1.1}" stroke="#2a2e33" stroke-width=".35"/>`;
  k += `<rect x="-.4" y="-17" width=".9" height="4.8" rx=".4" fill="#1c1f23"/><circle cx="1.3" cy="-13" r=".7" fill="#e0a526"/>`;
  S.teil({ oben: true, id: "pw_funkgeraet", de: "das Funkgerät", syl: "FUNK-ge-rät", it: "la ricetrasmittente", itSyl: "ri-ce-tra-smit-TEN-te", en: "two-way radio", x: 310, y, steht: true, kunst: k + flaeche(-4, -17.4, 8, 17.6),
    tipp: "Mit dem Funkgerät spricht die Wache mit den Streifenwagen." });
}

/* =====================================================================
   7 — DIE SICHERHEITSSCHEIBE (Panzerglas bis zur Decke) mit Sprechgitter,
       Durchreiche und dem Schild „Notruf 110“
   ===================================================================== */
{
  const yo = DECKE + 1, yu = EB - 1.05 * SK(EB);
  const x0 = GX + 2, x1 = 320;
  let k = "";
  /* Profile oben und an den Stößen (grüne Glaskante) */
  k += `<rect x="${x0}" y="${r(yo)}" width="${x1 - x0}" height="2.4" fill="#8e979d"/>`;
  for (const x of [x0, 186, 254]) k += `<rect x="${x - 0.8}" y="${r(yo)}" width="1.6" height="${r(yu - yo)}" fill="#7fb8a3" opacity=".75"/><rect x="${x - 0.3}" y="${r(yo)}" width=".6" height="${r(yu - yo)}" fill="#e9fff6" opacity=".6"/>`;
  k += `<rect x="${x0}" y="${r(yu - 1.6)}" width="${x1 - x0}" height="1.6" fill="#8e979d"/>`;
  /* Sprechgitter */
  const gx = 168, gy = yu - 22;
  k += `<circle cx="${gx}" cy="${r(gy)}" r="4.4" fill="${STAHL}" stroke="#7d868d" stroke-width=".4"/>`;
  for (let i = 0; i < 19; i++) { const a = i * 2.4, d = Math.sqrt(i) * 0.9; k += `<circle cx="${r(gx + Math.cos(a) * d)}" cy="${r(gy + Math.sin(a) * d)}" r=".32" fill="#4a5258"/>`; }
  /* Spiegelstreifen */
  k += `<path d="M${x0 + 10} ${r(yo + 4)} L${x0 + 18} ${r(yo + 4)} L${x0 + 6} ${r(yu - 6)} L${x0 + 2} ${r(yu - 6)} Z" fill="#ffffff" opacity=".3"/>`;
  k += `<path d="M${x0 + 96} ${r(yo + 4)} L${x0 + 101} ${r(yo + 4)} L${x0 + 88} ${r(yu - 6)} L${x0 + 85} ${r(yu - 6)} Z" fill="#ffffff" opacity=".25"/>`;
  k += `<path d="M${x0 + 170} ${r(yo + 4)} L${x0 + 178} ${r(yo + 4)} L${x0 + 166} ${r(yu - 6)} L${x0 + 162} ${r(yu - 6)} Z" fill="#ffffff" opacity=".22"/>`;
  /* Hinweis auf der Scheibe: „Bitte hier sprechen“ */
  k += `<rect x="${gx - 8}" y="${r(gy + 6)}" width="16" height="3.6" rx=".4" fill="#ffffff" opacity=".9"/>` + T(gx, gy + 8.6, 1.9, "Bitte hier sprechen", PBLAU, ' font-weight="bold"');
  const cx = (x0 + x1) / 2;
  S.teil({ id: "pw_scheibe", de: "die Sicherheitsscheibe", syl: "SI-cher-heits-schei-be", it: "il vetro di sicurezza", itSyl: "VE-tro di si-cu-REZ-za", en: "security glass", x: cx, y: r(yu), kunst: `<g transform="translate(${-cx} ${r(-yu)})">${k}</g>`,
    tipp: "Die Scheibe ist aus Panzerglas. Man spricht durch das runde Gitter." });
  S.davor(`<rect x="${x0}" y="${r(yo)}" width="${x1 - x0}" height="${r(yu - yo)}" fill="${S.lg("glas", [[0, "#e9fff6", 0.16], [0.5, "#d6efe6", 0.06], [1, "#e9fff6", 0.14]], 0, 0, 1, 1)}"/>`);
  SCH.yu = yu; SCH.yo = yo;
}
{
  /* DER NOTRUF — Schild an der Scheibe oben links */
  let k = `<rect x="-15" y="-7" width="30" height="14" rx="1.2" fill="#c8202b"/><rect x="-13.8" y="-5.8" width="27.6" height="11.6" rx=".8" fill="none" stroke="#fff" stroke-width=".5"/>`;
  k += T(0, -1.4, 3, "NOTRUF", "#fff", ' font-weight="bold" letter-spacing=".6"') + T(-6, 4.6, 4.4, "110", "#fff", ' font-weight="bold"') + T(7, 4.6, 2.2, "Feuer 112", "#ffd9d9");
  S.teil({ id: "pw_notruf", de: "der Notruf", syl: "NOT-ruf", it: "la chiamata d'emergenza", itSyl: "chia-MA-ta d'e-mer-GEN-za", en: "emergency call", x: 148, y: r(SCH.yo + 14), kunst: k,
    tipp: "Im Notfall wählt man 110 (Polizei) oder 112 (Feuerwehr, Rettung) — kostenlos." });
}
{
  /* DIE DURCHREICHE — Edelstahlschale unter der Scheibe */
  const y = SCH.yu + 1.2;
  let k = `<path d="M-11 1.6 L11 1.6 L9 -3.4 L-9 -3.4 Z" fill="${STAHL}"/><path d="M-8 -2.8 L8 -2.8 L9.4 .8 L-9.4 .8 Z" fill="#9aa3aa"/>`;
  k += `<path d="M-9 -3.4 L9 -3.4" stroke="#6d777e" stroke-width=".6"/><path d="M-11 1.6 L11 1.6" stroke="#eef1f3" stroke-width=".5"/>`;
  S.teil({ oben: true, id: "pw_durchreiche", de: "die Durchreiche", syl: "DURCH-rei-che", it: "il passa-documenti", itSyl: "pas-sa-do-cu-MEN-ti", en: "pass-through tray", x: 206, y, kunst: k + flaeche(-11.4, -4, 22.8, 6) });
}

/* =====================================================================
   8 — DER WARTESTUHL (Bürgerbereich, Lochblech)
   ===================================================================== */
{
  const fy = 170, s = SK(fy);
  let k = schatten(0, 0.4, 12, 1.4, 0.3);
  const sh = 0.45 * s, lh = 0.86 * s, w = 0.5 * s;
  k += `<path d="M${r(-w / 2 + 1)} 0 L${r(-w / 2 + 2)} ${r(-sh)} M${r(w / 2 - 1)} 0 L${r(w / 2 - 2)} ${r(-sh)} M${r(-w / 2 + 3)} -3 L${r(-w / 2 + 3.4)} ${r(-sh)} M${r(w / 2 - 3)} -3 L${r(w / 2 - 3.4)} ${r(-sh)}" stroke="#2a2e33" stroke-width="1.2"/>`;
  k += `<path d="M${r(-w / 2)} ${r(-sh - 1.4)} L${r(w / 2)} ${r(-sh - 1.4)} L${r(w / 2 + 1)} ${r(-sh + 1)} L${r(-w / 2 - 1)} ${r(-sh + 1)} Z" fill="${S.lg("lochblech", [[0, "#a9b0b6"], [1, "#7d868d"]])}"/>`;
  k += `<path d="M${r(-w / 2 + 0.6)} ${r(-sh - 1.4)} L${r(-w / 2 + 1)} ${r(-lh)} L${r(w / 2 - 1)} ${r(-lh)} L${r(w / 2 - 0.6)} ${r(-sh - 1.4)} Z" fill="${S.lg("lochblech2", [[0, "#c3c9ce"], [1, "#98a0a6"]])}"/>`;
  let l = "";
  for (let y = -lh + 2; y < -sh - 2; y += 2) for (let x = -w / 2 + 2.6; x < w / 2 - 2; x += 2) l += `<circle cx="${r(x)}" cy="${r(y)}" r=".45" fill="#5d666c"/>`;
  k += l;
  S.teil({ id: "pw_wartestuhl_pw", de: "der Wartestuhl", syl: "WAR-te-stuhl", it: "la sedia d'attesa", itSyl: "SE-dia d'at-TE-sa", en: "waiting chair", x: 34, y: fy, steht: true, kunst: k });
}

/* =====================================================================
   9 — DIE BÜRGERIN (vor dem Tresen, erstattet eine Anzeige)
   ===================================================================== */
{
  const fy = 180, s = SK(fy);
  const m = figur({ id: "b08d_bue", geschlecht: "w", pose: "stehen", blick: 148, frisur: "lang", haarfarbe: "rot", haut: "hell",
    kleidung: { oberteil: { stueck: "pullover", farbe: "#d8ad3a" }, jacke: { stueck: "jacke", farbe: "#2f3035" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" }, zubehoer: { stueck: "rucksack", farbe: "#7a3b3b" } } }, s * 1.66);
  S.teil({ id: "pw_buergerin", de: "die Bürgerin", syl: "BÜR-ge-rin", it: "la cittadina", itSyl: "cit-ta-DI-na", en: "member of the public", x: 146, y: fy, kunst: m.svg,
    tipp: "Ihr Fahrrad wurde gestohlen. Sie erstattet eine Anzeige." });
}

/* =====================================================================
   10 — DAS SCHILD (hängt vor der Scheibe) und DIE ÜBERWACHUNGSKAMERA
   ===================================================================== */
{
  let k = `<line x1="-20" y1="-9" x2="-20" y2="-4" stroke="#8a9196" stroke-width=".5"/><line x1="20" y1="-9" x2="20" y2="-4" stroke="#8a9196" stroke-width=".5"/>`;
  k += `<rect x="-30" y="-4" width="60" height="11" rx="1" fill="${PBLAU}"/><rect x="-29" y="-3" width="58" height="9" rx=".6" fill="none" stroke="#c9d3e3" stroke-width=".35"/>`;
  k += T(0, 1.4, 3.6, "Anzeigenaufnahme", "#ffffff", ' font-weight="bold"') + T(0, 5, 2.2, "Auskunft · Fundsachen · Bitte hier warten", "#c9d3e3");
  S.teil({ id: "pw_schild", de: "das Schild", syl: "SCHILD", it: "il cartello", itSyl: "car-TEL-lo", en: "sign", x: 236, y: r(DECKE + 4), kunst: k });
}
{
  let k = `<rect x="-3.4" y="-1" width="6.8" height="1.6" rx=".4" fill="#e6e8ea"/><path d="M-3.6 .6 A3.6 3.6 0 0 0 3.6 .6 Z" fill="${S.rg("kuppel", [[0, "#5a646d"], [1, "#1c2126"]], 0.4, 0.3, 0.7)}"/>`;
  k += `<circle cx="-.6" cy="2" r=".9" fill="#0d1014"/><circle cx="-.9" cy="1.7" r=".3" fill="#9fc6ff" opacity=".8"/><path d="M-2.8 1 A3 3 0 0 0 -1 3.6" stroke="#fff" stroke-width=".4" opacity=".4" fill="none"/>`;
  S.teil({ oben: true, id: "pw_kamera", de: "die Überwachungskamera", syl: "Ü-ber-WA-chungs-ka-me-ra", it: "la telecamera di sorveglianza", itSyl: "te-le-CA-me-ra di sor-ve-GLIAN-za", en: "security camera", x: 70, y: 14, kunst: k + flaeche(-4.4, -1.4, 8.8, 6),
    tipp: "Der Vorraum der Wache wird mit Kameras überwacht." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/polizeiwache.js"));
console.log(aus);
