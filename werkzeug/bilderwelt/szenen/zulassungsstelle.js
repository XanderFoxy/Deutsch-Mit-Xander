#!/usr/bin/env node
/* =====================================================================
   DIE ZULASSUNGSSTELLE (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (verwaltung.bund.de „Fahrzeugkennzeichen erhalten“, FZV
   Anlage 4/5, Kreis-Seiten „Prüf- und Siegelplaketten“, Utsch zur
   Plakettenentstempelung) — so läuft es in der Kfz-Zulassungsstelle:
   - Man zieht eine Wartenummer; über jedem SCHALTER hängt eine Anzeige
     „248 → Schalter 5“. Der Beamte sitzt am Schreibtisch-Schalter mit
     Bildschirm, Kartenterminal (Gebühren) und Stempel.
   - Man bringt mit: Zulassungsbescheinigung Teil I (Fahrzeugschein) und
     Teil II (Fahrzeugbrief), die eVB-Nummer der Versicherung, den HU-
     Bericht. Die Behörde teilt das Kennzeichen zu.
   - Die SCHILDER prägt ein privater SCHILDERDIENST, der fast immer direkt
     daneben liegt: Rohlinge (520 × 110 mm, weiß, links das blaue EU-Feld
     mit „D“), eine PRÄGEPRESSE drückt Buchstaben und Ziffern in die
     FE-Schrift, die Heißprägung färbt sie schwarz.
   - Mit den fertigen Schildern geht man zurück an den Schalter: Die
     Behörde klebt die STEMPELPLAKETTE (Landeswappen, Name der Behörde)
     auf, hinten kommt die runde HU-PLAKETTE dazu.
   Maßstab: Rückwand ≈ 40 Einheiten je Meter, Schreibtisch vorn ≈ 52 je
   Meter (0,75 m), Menschen 1,65–1,80 m.
   Blick: von leicht links, Fluchtpunkt (110 | 76): links eine schmale
   Wand mit Fenster; rechts, durch einen Pfeiler getrennt, der gelbe
   Schilderdienst. Farbe: Amtsweiß mit Verkehrsschild-Blau, Steinboden.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "zulassungsstelle", titel: "Die Zulassungsstelle", emoji: "🚗", thema: "Behörden", kuerzel: "b08b", fassung: 852 });
const rnd = zufall(5208);
const r = B.r;

function figur(spec, hoehe) {
  const m = B.mensch(spec, hoehe);
  const schritt = m.k < 0.42 ? 1 : 2;
  m.svg = m.svg.replace(/ data-teil="[^"]*"/g, "").replace(/ d="([^"]*)"/g, (q, d) => ` d="${d.replace(/-?\d+\.\d+/g, (n) => String(Math.round(+n * schritt) / schritt))}"`);
  return m;
}
const T = (x, y, s, txt, f = "#222", extra = "") => `<text x="${r(x)}" y="${r(y)}" font-size="${s}" fill="${f}" font-family="Arial,Helvetica,sans-serif" text-anchor="middle"${extra}>${txt}</text>`;

/* ---------- Farben ---------------------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const WAND = S.lg("wand", [[0, "#f2efe9"], [1, "#e2ddd4"]]);
const BLAU = "#1f4f9c";
const STAHL = S.lg("stahl", [[0, "#eef1f3"], [0.45, "#c9cfd4"], [0.55, "#b5bcc2"], [1, "#e1e5e8"]], 0, 0, 1, 0);
const GRAU = S.lg("grau", [[0, "#b9bec2"], [1, "#9aa0a5"]], 0, 0, 1, 0);
const PLATTE = S.lg("platte", [[0, "#e4e1da"], [1, "#cbc6bc"]]);
const GELB = S.lg("gelb", [[0, "#ffd21f"], [1, "#f2b800"]]);
const SCHWARZ = S.lg("geraet", [[0, "#3a3e44"], [1, "#1c1f23"]]);
const SCHILD = S.lg("schild", [[0, "#ffffff"], [0.5, "#f1f2f2"], [1, "#dcdfe0"]]);

/* Das deutsche Kennzeichen (FE-Schrift): Breite w, Mitte unten (0|0) */
function kennzeichen(w, text, plaketten = true, hu = false, rand = 0) {
  const h = w * 110 / 520;
  let g = `<rect x="${r(-w / 2)}" y="${r(-h)}" width="${r(w)}" height="${r(h)}" rx="${r(h * 0.12)}" fill="#1b1b1b"/>`;
  g += `<rect x="${r(-w / 2 + h * 0.05)}" y="${r(-h + h * 0.05)}" width="${r(w - h * 0.1)}" height="${r(h * 0.9)}" rx="${r(h * 0.1)}" fill="${SCHILD}"/>`;
  g += `<rect x="${r(-w / 2 + h * 0.05)}" y="${r(-h + h * 0.05)}" width="${r(h * 0.36)}" height="${r(h * 0.9)}" rx="${r(h * 0.08)}" fill="#1f3f95"/>`;
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; g += `<circle cx="${r(-w / 2 + h * 0.23 + Math.sin(a) * h * 0.12)}" cy="${r(-h * 0.66 - Math.cos(a) * h * 0.12)}" r="${r(h * 0.022)}" fill="#ffd617"/>`; }
  g += `<text x="${r(-w / 2 + h * 0.23)}" y="${r(-h * 0.14)}" font-size="${r(h * 0.32)}" fill="#fff" font-family="Arial" font-weight="bold" text-anchor="middle">D</text>`;
  const [ort, rest] = text.split(" ");
  const fs = h * 0.72;
  g += `<text x="${r(-w / 2 + h * 0.5)}" y="${r(-h * 0.2)}" font-size="${r(fs)}" fill="#111" font-family="'DIN Condensed','Arial Narrow',Arial,sans-serif" font-weight="bold" textLength="${r(h * 0.62 * ort.length)}" lengthAdjust="spacingAndGlyphs">${ort}</text>`;
  if (plaketten) {
    const px = -w / 2 + h * 0.62 + h * 0.62 * ort.length + h * 0.3;
    if (hu) g += `<circle cx="${r(px)}" cy="${r(-h * 0.7)}" r="${r(h * 0.2)}" fill="#f2c200" stroke="#7a6a20" stroke-width="${r(h * 0.015)}"/><path d="M${r(px)} ${r(-h * 0.7)} L${r(px)} ${r(-h * 0.9)} A${r(h * 0.2)} ${r(h * 0.2)} 0 0 1 ${r(px + h * 0.19)} ${r(-h * 0.76)} Z" fill="#111" opacity=".75"/>`;
    g += `<circle cx="${r(px)}" cy="${r(-h * (hu ? 0.28 : 0.5))}" r="${r(h * 0.19)}" fill="${S.rg("siegel", [[0, "#ffffff"], [0.6, "#e5ecf3"], [1, "#9fb3c8"]])}" stroke="#5f7894" stroke-width="${r(h * 0.015)}"/><circle cx="${r(px)}" cy="${r(-h * (hu ? 0.28 : 0.5))}" r="${r(h * 0.07)}" fill="#c2302a"/>`;
    g += `<text x="${r(px + h * 0.3)}" y="${r(-h * 0.2)}" font-size="${r(fs)}" fill="#111" font-family="'DIN Condensed','Arial Narrow',Arial,sans-serif" font-weight="bold" textLength="${r(w / 2 - h * 0.12 - px - h * 0.3)}" lengthAdjust="spacingAndGlyphs">${rest.replace("_", " ")}</text>`;
  } else g += `<text x="${r(-w / 2 + h * 0.55 + h * 0.62 * ort.length + h * 0.32)}" y="${r(-h * 0.2)}" font-size="${r(fs)}" fill="#111" font-family="'DIN Condensed','Arial Narrow',Arial,sans-serif" font-weight="bold" textLength="${r(w / 2 - h * 0.12 - rand - (-w / 2 + h * 0.55 + h * 0.62 * ort.length + h * 0.32))}" lengthAdjust="spacingAndGlyphs">${rest.replace("_", " ")}</text>`;
  g += `<rect x="${r(-w / 2 + h * 0.08)}" y="${r(-h + h * 0.08)}" width="${r(w - h * 0.16)}" height="${r(h * 0.16)}" rx="${r(h * 0.06)}" fill="#fff" opacity=".45"/>`;
  return g;
}

/* =====================================================================
   KULISSE — Decke mit Lichtbändern, linke Wand, Rückwand, Steinboden
   ===================================================================== */
const VP = { x: 110, y: 76 };
const WU = 116, WO = 14, LW = 16, PF = 208;   // Pfeiler zwischen Amt und Schilderdienst
{
  let k = `<rect x="0" y="0" width="320" height="${WO + 1}" fill="#f4f3f0"/>`;
  /* zwei Lichtbänder, die zum Fluchtpunkt laufen */
  for (const xb of [70, 170, 262]) {
    const t = (0 - VP.y) / (WO - VP.y), x2 = VP.x + (xb - VP.x) * t;
    k += `<path d="M${xb - 3} ${WO - 1} L${xb + 3} ${WO - 1} L${r(VP.x + (xb + 3 - VP.x) * t)} 0 L${r(VP.x + (xb - 3 - VP.x) * t)} 0 Z" fill="#ffffff" stroke="#d9d7d2" stroke-width=".3"/>`;
    k += `<path d="M${xb - 3} ${WO - 1} L${xb + 3} ${WO - 1} L${r(VP.x + (xb + 3 - VP.x) * t)} 0 L${r(VP.x + (xb - 3 - VP.x) * t)} 0 Z" fill="#fffbe6" opacity=".5" filter="url(#bw_weich)"/>`;
  }
  /* Rückwand Amt */
  k += `<rect x="${LW}" y="${WO}" width="${PF - LW}" height="${WU - WO}" fill="${WAND}"/>`;
  k += `<rect x="${LW}" y="${WO}" width="${PF - LW}" height="${WU - WO}" fill="${S.rg("licht", [[0, "#ffffff", 0.45], [1, "#ffffff", 0]], 0.5, 0.15, 0.7)}"/>`;
  /* Verkehrsblaues Band mit Hinweisschild */
  k += `<rect x="${LW}" y="66" width="${PF - LW}" height="3" fill="${BLAU}"/>`;
  k += `<rect x="64" y="20" width="96" height="11" rx="1" fill="${BLAU}"/>` + T(112, 27.4, 5, "Kfz-Zulassung", "#ffffff", ' font-weight="bold"') + `<rect x="66" y="21.6" width="92" height="7.8" rx=".6" fill="none" stroke="#ffffff" stroke-width=".4"/>`;
  k += T(112, 35, 2.4, "Schalter 1 – 6 · An-, Um- und Abmeldung", "#1f4f9c");
  /* Rückwand Schilderdienst (warmes Gelb) */
  k += `<rect x="${PF}" y="${WO}" width="${320 - PF}" height="${WU - WO}" fill="${S.lg("wandsd", [[0, "#f6efd8"], [1, "#e9dfbf"]])}"/>`;
  /* Sockelleiste */
  k += `<rect x="${LW}" y="${WU - 3}" width="${320 - LW}" height="3" fill="#8f8a80"/>`;
  /* linke Wand mit schmalem Fenster */
  const yo = (x) => WO + (x - LW) * (WO - VP.y) / (LW - VP.x), yu = (x) => WU + (x - LW) * (WU - VP.y) / (LW - VP.x);
  k += `<path d="M0 ${r(yo(0))} L${LW} ${WO} L${LW} ${WU} L0 ${r(yu(0))} Z" fill="#dcd8cf"/>`;
  const f = (x, t) => yo(x) + (yu(x) - yo(x)) * t;
  k += `<path d="M2 ${r(f(2, 0.15))} L13 ${r(f(13, 0.15))} L13 ${r(f(13, 0.6))} L2 ${r(f(2, 0.6))} Z" fill="${S.lg("himmel", [[0, "#cfe6f4"], [1, "#eef5f7"]])}" stroke="#a9a59c" stroke-width=".8"/>`;
  k += `<path d="M7.5 ${r(f(7.5, 0.15))} L7.5 ${r(f(7.5, 0.6))}" stroke="#a9a59c" stroke-width=".6"/>`;
  /* Steinboden, große Platten 60 × 60 */
  k += `<path d="M0 ${r(yu(0))} L${LW} ${WU} L320 ${WU} L320 200 L0 200 Z" fill="${S.lg("boden", [[0, "#cfc5b3"], [1, "#b5a994"]])}"/>`;
  for (let i = -10; i <= 18; i++) {
    const xb = VP.x + i * 16; if (xb < LW - 40) continue;
    const t = (200 - VP.y) / (WU - VP.y);
    k += `<line x1="${r(Math.max(xb, xb))}" y1="${WU}" x2="${r(VP.x + (xb - VP.x) * t)}" y2="200" stroke="#9a8f7c" stroke-width=".35" opacity=".7"/>`;
  }
  for (const y of [119.5, 124, 129.5, 136.5, 145.5, 157, 172, 192]) k += `<line x1="0" y1="${y}" x2="320" y2="${y}" stroke="#9a8f7c" stroke-width=".35" opacity=".6"/>`;
  for (let i = 0; i < 120; i++) k += `<circle cx="${r(rnd() * 320)}" cy="${r(WU + 2 + rnd() * 84)}" r="${r(0.25 + rnd() * 0.4)}" fill="${rnd() < 0.5 ? "#e4dccb" : "#8f846f"}" opacity=".5"/>`;
  k += `<path d="M0 ${r(yu(0))} L${LW} ${WU} L320 ${WU} L320 200 L0 200 Z" fill="${S.lg("bodenlicht", [[0, "#000", 0.12], [0.4, "#000", 0], [1, "#fff", 0.08]])}"/>`;
  /* Pfeiler zwischen Amt und Schilderdienst (mit Tiefe zum Betrachter) */
  k += `<rect x="${PF - 3}" y="${WO}" width="7" height="${WU - WO}" fill="#e7e3da"/><path d="M${PF + 4} ${WO} L${PF + 9} ${WO - 2} L${PF + 9} ${WU + 4} L${PF + 4} ${WU} Z" fill="#cfcac0"/>`;
  S.hinten(k);
}

/* =====================================================================
   1 — DER AKTENSCHRANK (Stahlschrank mit Hängeregistratur) und
       DER AKTENORDNER (Ordnerreihe darauf)
   ===================================================================== */
{
  let k = schatten(0, 0.3, 20, 1.4, 0.3);
  k += `<rect x="-18" y="-72" width="36" height="72" rx=".8" fill="${GRAU}"/>`;
  k += `<rect x="-18" y="-72" width="36" height="2" fill="#d2d6d9"/>`;
  for (let i = 0; i < 4; i++) {
    const y = -69 + i * 17;
    k += `<rect x="-16" y="${y}" width="32" height="15.4" rx=".6" fill="${S.lg("lade", [[0, "#c9cdd1"], [1, "#a9afb4"]])}" stroke="#868c91" stroke-width=".35"/>`;
    k += `<rect x="-5" y="${y + 3}" width="10" height="2" rx=".8" fill="${STAHL}" stroke="#7d868d" stroke-width=".25"/>`;
    k += `<rect x="-3" y="${y + 7}" width="6" height="3.4" fill="#fffef8" stroke="#888" stroke-width=".2"/>` + T(0, y + 9.4, 1.6, ["A – F", "G – L", "M – R", "S – Z"][i], "#333");
  }
  k += `<rect x="-17" y="-1.4" width="34" height="1.4" fill="#5e6368"/>`;
  S.teil({ id: "zu_aktenschrank", de: "der Aktenschrank", syl: "AK-ten-schrank", it: "l'armadio dei fascicoli", itSyl: "ar-MA-dio dei fa-SCI-co-li", en: "filing cabinet", x: 40, y: 118, steht: true, kunst: k,
    tipp: "In den Schubladen hängen die Fahrzeugakten — alphabetisch nach Namen." });
}
{
  let k = "";
  const farben = ["#1f4f9c", "#c0392b", "#1f4f9c", "#2e7d4f", "#e0a526", "#1f4f9c"];
  farben.forEach((c, i) => {
    const x = -15 + i * 5.2, h = 13;
    k += `<rect x="${x}" y="${-h}" width="4.8" height="${h}" rx=".4" fill="${c}"/><rect x="${x + 0.6}" y="${-h + 2}" width="3.6" height="4.6" fill="#fbfaf5"/>`;
    k += `<rect x="${x + 0.9}" y="${-h + 3}" width="3" height=".5" fill="#555"/><rect x="${x + 0.9}" y="${-h + 4.2}" width="2.2" height=".5" fill="#888"/>`;
    k += `<circle cx="${x + 2.4}" cy="${-3.4}" r="1.1" fill="#f4f4f2" stroke="#999" stroke-width=".2"/><rect x="${x}" y="${-h}" width="1" height="${h}" fill="#fff" opacity=".15"/>`;
  });
  k += `<path d="M16 -11 L19.6 -10 L19.6 0 L16 0 Z" fill="#c0392b"/>`;
  S.teil({ oben: true, id: "zu_aktenordner_zu", de: "der Aktenordner", syl: "AK-ten-ord-ner", it: "il raccoglitore", itSyl: "rac-co-gli-TO-re", en: "ring binder", x: 38, y: 46, steht: true, kunst: k });
}

/* =====================================================================
   2 — DIE WARTENUMMER (LED-Anzeige über Schalter 5)
   ===================================================================== */
{
  let k = `<line x1="-14" y1="-19" x2="-14" y2="-12" stroke="#777" stroke-width=".4"/><line x1="14" y1="-19" x2="14" y2="-12" stroke="#777" stroke-width=".4"/>`;
  k += `<rect x="-22" y="-12" width="44" height="17" rx="1.2" fill="#1a1c1f"/>`;
  k += `<rect x="-20.5" y="-10.5" width="18" height="14" fill="#0b0b0b"/><rect x="-1.5" y="-10.5" width="20" height="14" fill="#0b0b0b"/>`;
  k += T(-11.5, -6, 2.4, "Schalter", "#9fb3c8") + `<text x="-11.5" y="1.8" font-size="8" fill="#e8f0ff" font-family="Arial" font-weight="bold" text-anchor="middle">5</text>`;
  k += T(8.5, -6, 2.4, "Nummer", "#ffb3a6") + `<text x="8.5" y="1.8" font-size="7.4" fill="#ff4a2a" font-family="'Courier New',monospace" font-weight="bold" text-anchor="middle">248</text>`;
  k += `<rect x="-1.5" y="-10.5" width="20" height="14" fill="#ff4a2a" opacity=".08"/>`;
  S.teil({ id: "zu_wartenummer_zu", de: "die Wartenummer", syl: "WAR-te-num-mer", it: "il numero d'attesa", itSyl: "NU-me-ro d'at-TE-sa", en: "queue number", x: 112, y: 52, kunst: k,
    tipp: "Die Nummer 248 ist dran: bitte zu Schalter 5." });
}

/* =====================================================================
   3 — DER BEAMTE (sitzt am Schalter 5)
   ===================================================================== */
const D = { x0: 62, x1: 168, yb: 113, yf: 122, yu: 162 };   // Schreibtisch-Schalter
{
  /* Rückenlehne des Bürostuhls schaut neben ihm hervor */
  let k = `<path d="M-10 -46 Q-10 -51 -4 -51 L6 -51 Q10 -51 10 -46 L9 -24 L-9 -24 Z" fill="${SCHWARZ}"/>`;
  S.hinten(`<g transform="translate(122,146)">${k}</g>`);
  const m = figur({ id: "b08b_bea", geschlecht: "m", pose: "sitzen", blick: 12, frisur: "glatze", haarfarbe: "grau", haut: "hell", bart: true,
    kleidung: { oberteil: { stueck: "hemd", farbe: "weiss" }, jacke: { stueck: "weste", farbe: "#55606b" }, unterteil: { stueck: "anzughose", farbe: "grau" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" }, zubehoer: { stueck: "brille" } } }, 94);
  S.teil({ id: "zu_beamter", de: "der Beamte", syl: "Be-AM-te", it: "il funzionario", itSyl: "fun-zio-NA-rio", en: "official", x: 116, y: 146, kunst: m.svg,
    tipp: "Der Beamte teilt das Kennzeichen zu und klebt die Stempelplakette auf." });
}
/* Bildschirm (dem Beamten zugewandt) */
{
  let k = schatten(0, 0.3, 8, 1, 0.3);
  k += `<path d="M-4 0 L4 0 L3 -1.2 L-3 -1.2 Z" fill="#30353a"/><rect x="-1" y="-5" width="2" height="4" fill="#3a3f44"/>`;
  k += `<path d="M-11 -21 L9 -22.6 L9 -5.6 L-11 -4.8 Z" fill="#1c1f23"/>`;
  k += `<path d="M-10 -20 L8 -21.4 L8 -6.4 L-10 -5.8 Z" fill="${S.lg("bild", [[0, "#eef3f8"], [1, "#d3dfea"]])}"/>`;
  k += `<path d="M-10 -20 L8 -21.4 L8 -19.6 L-10 -18.3 Z" fill="${BLAU}"/>`;
  k += kennzeichenMini(-1, -13.4);
  for (let i = 0; i < 3; i++) k += `<rect x="-8" y="${-10.6 + i * 1.6}" width="${12 - i * 2}" height=".7" fill="#9aabb6"/>`;
  k += `<path d="M-10 -20 L-3 -20.4 L-10 -11 Z" fill="#fff" opacity=".14"/>`;
  S.teil({ oben: true, id: "zu_bildschirm", de: "der Bildschirm", syl: "BILD-schirm", it: "lo schermo", itSyl: "SCHER-mo", en: "screen", x: 82, y: 116, steht: true, kunst: k });
}
function kennzeichenMini(x, y) { return `<g transform="translate(${x} ${y}) scale(.6)">${kennzeichen(20, "HH AB_1234", false)}</g>`; }

/* =====================================================================
   4 — DER SCHALTER (Schreibtisch mit Milchglas-Trennwänden) — Lupe
   ===================================================================== */
const schalterUnter = [];
{
  const cx = (D.x0 + D.x1) / 2, W = D.x1 - D.x0, H = D.yu - D.yb, yT = -(D.yu - D.yf);
  let k = schatten(0, 0.5, W / 2 + 3, 2, 0.3);
  /* Milchglas-Trennwände links und rechts (auf dem Tisch) */
  for (const sx of [-1, 1]) {
    const x = sx * (W / 2 - 1);
    k += `<path d="M${x} ${yT} L${x} ${yT - 34} L${x - sx * 7} ${-H - 30} L${x - sx * 7} ${-H} Z" fill="${S.lg("milch", [[0, "#ffffff", 0.75], [1, "#e4ebee", 0.6]])}" stroke="#a9b2b7" stroke-width=".6"/>`;
    k += `<path d="M${x} ${yT} L${x} ${yT - 34} L${x - sx * 7} ${-H - 30} L${x - sx * 7} ${-H}" stroke="#8e999f" stroke-width=".9" fill="none"/>`;
    for (let i = 1; i < 5; i++) k += `<path d="M${x} ${r(yT - i * 6.8)} L${x - sx * 7} ${r(-H - i * 6)}" stroke="#ffffff" stroke-width=".5" opacity=".7"/>`;
  }
  k += `<rect x="${W / 2 - 4.6}" y="${yT - 30}" width="3.6" height="8" rx=".5" fill="${BLAU}"/>` + T(W / 2 - 2.8, yT - 24, 5, "5", "#fff", ' font-weight="bold"');
  /* Tischplatte */
  k += `<path d="M${-W / 2 + 5} ${-H} L${W / 2 - 5} ${-H} L${W / 2 + 1} ${yT} L${-W / 2 - 1} ${yT} Z" fill="${PLATTE}"/>`;
  k += `<rect x="${-W / 2 - 1}" y="${yT}" width="${W + 2}" height="2" fill="#a9a398"/>`;
  /* Front: Verkehrsblau mit Nummer und Hinweisschild */
  k += `<rect x="${-W / 2}" y="${yT + 2}" width="${W}" height="${-yT - 2}" fill="${S.lg("front", [[0, "#2a5daa"], [1, "#1b4384"]])}"/>`;
  k += `<rect x="${-W / 2}" y="${yT + 2}" width="${W}" height="1.4" fill="#fff" opacity=".22"/>`;
  for (let x = -W / 2 + 13; x < W / 2; x += 13) k += `<line x1="${x}" y1="${yT + 4}" x2="${x}" y2="-3" stroke="#173a73" stroke-width=".5"/>`;
  k += `<rect x="${-W / 2}" y="-3" width="${W}" height="3" fill="#2a2e33"/>`;
  k += `<rect x="-20" y="${yT + 9}" width="40" height="12" rx="1" fill="#ffffff"/>` + T(0, yT + 14, 2.8, "Schalter 5", BLAU, ' font-weight="bold"') + T(0, yT + 18.6, 2, "Zulassung · Kennzeichen", "#4a5a70");
  /* Tastatur */
  k += `<path d="M-14 ${-H + 4} L4 ${-H + 4} L5 ${-H + 6.6} L-15 ${-H + 6.6} Z" fill="#2a2e33"/>`;
  /* Dokumente — einzeln in der Lupe */
  const dok = [];
  {  /* Fahrzeugschein = Zulassungsbescheinigung Teil I (grünlich, gefaltet) */
    const x = -36, y = yT - 3.4;
    let g = `<path d="M${x - 6} ${y + 2.8} L${x + 6} ${y + 2.8} L${x + 5.4} ${y - 2.6} L${x - 5.4} ${y - 2.6} Z" fill="${S.lg("zb1", [[0, "#e3f1df"], [1, "#cfe6c9"]], 0, 0, 1, 0)}" stroke="#8fb08a" stroke-width=".15"/>`;
    g += `<line x1="${x}" y1="${y - 2.6}" x2="${x}" y2="${y + 2.8}" stroke="#9fbf98" stroke-width=".2"/>`;
    g += `<rect x="${x - 5}" y="${y - 2}" width="4.4" height=".6" fill="#3d6e3a"/>`;
    for (let i = 0; i < 4; i++) g += `<rect x="${x - 5}" y="${r(y - 0.9 + i * 0.9)}" width="${3.6 - (i % 2)}" height=".25" fill="#6b8a66"/><rect x="${x + 0.6}" y="${r(y - 0.9 + i * 0.9)}" width="${4 - (i % 2)}" height=".25" fill="#6b8a66"/>`;
    k += g;
    dok.push({ id: "zu_fahrzeugschein", de: "der Fahrzeugschein", syl: "FAHR-zeug-schein", it: "il libretto di circolazione", itSyl: "li-BRET-to di cir-co-la-ZIO-ne", en: "vehicle registration", x, y, w: 13, h: 7,
      tipp: "Amtlich heißt er „Zulassungsbescheinigung Teil I“. Man hat ihn beim Fahren dabei." });
  }
  {  /* Fahrzeugbrief = Teil II (fliederfarben, Sicherheitsdruck) */
    const x = -22, y = yT - 3.2;
    let g = `<path d="M${x - 5} ${y + 2.8} L${x + 5} ${y + 2.8} L${x + 4.5} ${y - 3} L${x - 4.5} ${y - 3} Z" fill="${S.lg("zb2", [[0, "#ece3f2"], [1, "#d9cbe6"]])}" stroke="#a593b8" stroke-width=".15"/>`;
    for (let i = 0; i < 5; i++) g += `<path d="M${x - 4.4} ${r(y - 2.4 + i * 1.2)} q2.2 -.6 4.4 0 t4.4 0" stroke="#c4b2d6" stroke-width=".2" fill="none"/>`;
    g += `<rect x="${x - 3.6}" y="${y - 2.2}" width="7.2" height=".6" fill="#5a3f78"/><rect x="${x - 3.6}" y="${y + 1.2}" width="3" height=".3" fill="#7a6a8a"/>`;
    k += g;
    dok.push({ id: "zu_fahrzeugbrief", de: "der Fahrzeugbrief", syl: "FAHR-zeug-brief", it: "il certificato di proprietà", itSyl: "cer-ti-fi-CA-to di pro-prie-TÀ", en: "vehicle title", x, y, w: 11, h: 7,
      tipp: "„Zulassungsbescheinigung Teil II“ — er bleibt sicher zu Hause, nicht im Auto." });
  }
  {  /* eVB-Nummer der Versicherung */
    const x = -9, y = yT - 3;
    let g = `<path d="M${x - 4} ${y + 2.6} L${x + 4} ${y + 2.6} L${x + 3.6} ${y - 2.6} L${x - 3.6} ${y - 2.6} Z" fill="#fbfbf8" stroke="#c9ccc9" stroke-width=".15"/>`;
    g += `<rect x="${x - 3.2}" y="${y - 2.1}" width="6.4" height=".8" fill="#0e7a6b"/>` + T(x, y + 0.2, 1.3, "eVB-Nr.", "#333", ' font-weight="bold"');
    g += `<text x="${x}" y="${y + 1.8}" font-size="1.4" fill="#0e7a6b" font-family="'Courier New',monospace" font-weight="bold" text-anchor="middle">K7X4Q2B</text>`;
    k += g;
    dok.push({ id: "zu_versicherung", de: "die Versicherungsnummer", syl: "Ver-SI-che-rungs-num-mer", it: "il numero di assicurazione", itSyl: "NU-me-ro di as-si-cu-ra-ZIO-ne", en: "insurance number", x, y, w: 9, h: 6.4,
      tipp: "Die eVB-Nummer zeigt: Das Auto ist versichert. Ohne sie gibt es keine Zulassung." });
  }
  {  /* Plakettenbogen: HU-Plakette (rund, Jahresfarbe) */
    const x = 2, y = yT - 2.8;
    let g = `<path d="M${x - 3.6} ${y + 2.4} L${x + 3.6} ${y + 2.4} L${x + 3.2} ${y - 2.4} L${x - 3.2} ${y - 2.4} Z" fill="#fdfcf6" stroke="#c9ccc9" stroke-width=".15"/>`;
    g += `<ellipse cx="${x - 1.4}" cy="${y}" rx="1.6" ry="1.4" fill="#f2c200" stroke="#7a6a20" stroke-width=".12"/><path d="M${x - 1.4} ${y} L${x - 1.4} ${y - 1.4} A1.6 1.4 0 0 1 ${x + 0.1} ${y - 0.5} Z" fill="#222" opacity=".7"/>`;
    g += `<ellipse cx="${x + 1.8}" cy="${y}" rx="1.6" ry="1.4" fill="#e07a2e" stroke="#7a4a20" stroke-width=".12"/>`;
    k += g;
    dok.push({ id: "zu_plakette", de: "die Plakette", syl: "Pla-KET-te", it: "il bollino", itSyl: "bol-LI-no", en: "inspection sticker", x, y, w: 8.4, h: 6,
      tipp: "Die runde HU-Plakette kommt hinten aufs Kennzeichen. Oben steht der Monat der nächsten Prüfung." });
  }
  {  /* Stempelplakette (Siegel mit Landeswappen) */
    const x = 12, y = yT - 2.8;
    let g = `<path d="M${x - 3.4} ${y + 2.4} L${x + 3.4} ${y + 2.4} L${x + 3} ${y - 2.4} L${x - 3} ${y - 2.4} Z" fill="#fdfcf6" stroke="#c9ccc9" stroke-width=".15"/>`;
    for (const dx of [-1.5, 1.5]) g += `<ellipse cx="${x + dx}" cy="${y}" rx="1.4" ry="1.25" fill="${S.rg("siegel2", [[0, "#ffffff"], [1, "#a9bcd0"]])}" stroke="#5f7894" stroke-width=".12"/><ellipse cx="${x + dx}" cy="${y}" rx=".5" ry=".45" fill="#c2302a"/>`;
    k += g;
    dok.push({ id: "zu_stempelplakette", de: "die Stempelplakette", syl: "STEM-pel-pla-ket-te", it: "il sigillo della targa", itSyl: "si-GIL-lo DEL-la TAR-ga", en: "registration seal", x, y, w: 8, h: 6,
      tipp: "Erst mit der Stempelplakette der Zulassungsstelle ist das Kennzeichen gültig." });
  }
  {  /* Stempel */
    const x = -49, y = yT - 6;
    let g = `<rect x="${x - 2.2}" y="${y + 0.6}" width="4.4" height="2" rx=".4" fill="#3a3a3a"/><rect x="${x - 0.8}" y="${y - 3}" width="1.6" height="3.8" fill="#2c3440"/><ellipse cx="${x}" cy="${y - 3.4}" rx="1.6" ry="1.4" fill="${S.rg("knauf", [[0, "#5a6a80"], [1, "#222a35"]])}"/>`;
    g += `<path d="M${x + 3} ${y + 2.8} L${x + 9} ${y + 2.8} L${x + 8.6} ${y + 1} L${x + 3.4} ${y + 1} Z" fill="#2d3238"/><path d="M${x + 3.8} ${y + 2.3} L${x + 8.2} ${y + 2.3} L${x + 8} ${y + 1.4} L${x + 4} ${y + 1.4} Z" fill="#b8272a"/>`;
    k += g;
    dok.push({ id: "zu_stempel_zu", de: "der Stempel", syl: "STEM-pel", it: "il timbro", itSyl: "TIM-bro", en: "stamp", x: x + 3, y: y - 0.2, w: 12, h: 8 });
  }
  dok.forEach((d) => schalterUnter.push({ id: d.id, de: d.de, syl: d.syl, it: d.it, itSyl: d.itSyl, en: d.en, tipp: d.tipp, x: cx + d.x, y: D.yu + d.y + d.h / 2, kunst: flaeche(-d.w / 2, -d.h, d.w, d.h, 0.6) }));
  S.teil({ id: "zu_schalter_zu", de: "der Schalter", syl: "SCHAL-ter", it: "lo sportello", itSyl: "spor-TEL-lo", en: "counter", x: cx, y: D.yu, steht: true, kunst: k,
    zoom: { x: D.x0 + 2, y: 96, w: 102, h: 68 }, unter: schalterUnter,
    tipp: "Hier meldet man sein Auto an, um oder ab." });
}
/* Kartenterminal und Nummernschild auf dem Tisch (eigene Teile) */
{
  let k = schatten(0, 0.2, 4, 0.7, 0.3);
  k += `<path d="M-3 0 L3 0 L3.4 -9 Q3.4 -10 2.4 -10 L-2.4 -10 Q-3.4 -10 -3.4 -9 Z" fill="#2a2e33"/>`;
  k += `<rect x="-2.4" y="-9.2" width="4.8" height="3.2" rx=".3" fill="#9cd3e8"/>` + T(0, -7, 1.3, "28,50 €", "#0b3b52");
  for (let i = 0; i < 12; i++) k += `<rect x="${-2.2 + (i % 3) * 1.6}" y="${-5.4 + Math.floor(i / 3) * 1.2}" width="1.2" height=".9" rx=".2" fill="${i === 9 ? "#d23b30" : i === 11 ? "#3ca35a" : "#596068"}"/>`;
  S.teil({ oben: true, id: "zu_kartenterminal", de: "das Kartenterminal", syl: "KAR-ten-ter-mi-nal", it: "il terminale POS", itSyl: "ter-mi-NA-le POS", en: "card terminal", x: 101, y: D.yb + 4, steht: true, kunst: k + flaeche(-4, -11, 8, 11),
    tipp: "Die Gebühr bezahlt man hier meist mit Karte." });
}
{
  /* Das neue Nummernschild — an die Trennwand gelehnt, noch ohne Plakette */
  let k = schatten(0, 0.2, 14, 0.8, 0.3);
  k += `<g transform="skewX(-6)">${kennzeichen(28, "HH AB_1234", true)}</g>`;
  S.teil({ oben: true, id: "zu_nummernschild_zu", de: "das Nummernschild", syl: "NUM-mern-schild", it: "la targa", itSyl: "TAR-ga", en: "number plate", x: 152, y: D.yf - 0.4, steht: true, kunst: k,
    tipp: "Amtlich: das Kennzeichen. Es wird im Schilderdienst nebenan geprägt." });
}

/* =====================================================================
   5 — DER SCHILDERDIENST (rechts): Schild, Schilderwand, Werkbank,
       Prägemaschine, Heißprägemaschine
   ===================================================================== */
{
  /* großes gelbes Ladenschild */
  let k = `<rect x="-52" y="-9" width="104" height="18" rx="1.2" fill="${GELB}"/><rect x="-52" y="-9" width="104" height="18" rx="1.2" fill="none" stroke="#1b1b1b" stroke-width=".8"/>`;
  k += T(0, 1.6, 8.4, "SCHILDER", "#141414", ' font-weight="bold" letter-spacing="1.4"') + T(0, 7, 3, "Kennzeichen sofort · 2 Stück ab 25 €", "#141414", ' font-weight="bold"');
  k += `<path d="M-52 -9 L-30 -9 L-46 9 L-52 9 Z" fill="#fff" opacity=".18"/>`;
  S.teil({ id: "zu_schilderdienst", de: "der Schilderdienst", syl: "SCHIL-der-dienst", it: "il servizio targhe", itSyl: "ser-VI-zio TAR-ghe", en: "number plate shop", x: 266, y: 27, kunst: k,
    tipp: "Der Schilderdienst ist eine private Firma direkt neben der Zulassungsstelle." });
}
const wandUnter = [];
{
  /* Lochwand mit Rohlingen und Musterschildern */
  const x0 = 222, x1 = 316, y0 = 40, y1 = 92;
  const cx = (x0 + x1) / 2;
  let k = `<rect x="${x0 - cx}" y="${y0 - y1}" width="${x1 - x0}" height="${y1 - y0}" rx=".8" fill="${S.lg("lochwand", [[0, "#e9e6df"], [1, "#d9d4ca"]])}" stroke="#b5ae9f" stroke-width=".5"/>`;
  let loch = "";
  for (let y = y0 + 2; y < y1 - 1; y += 3) for (let x = x0 + 2; x < x1 - 1; x += 3) loch += `<circle cx="${r(x - cx)}" cy="${r(y - y1)}" r=".3" fill="#a8a194"/>`;
  k += loch;
  /* oben: Rohlinge in drei Größen (Stapel an Haken) */
  const rohl = (x, y, w) => { const h = w * 110 / 520; let g = ""; for (let i = 3; i >= 0; i--) g += `<rect x="${r(x - w / 2 + i * 0.5)}" y="${r(y - h - i * 0.6)}" width="${r(w)}" height="${r(h)}" rx="${r(h * 0.12)}" fill="${i ? "#e3e5e6" : SCHILD}" stroke="#9aa0a5" stroke-width=".25"/><rect x="${r(x - w / 2 + i * 0.5 + h * 0.06)}" y="${r(y - h - i * 0.6 + h * 0.06)}" width="${r(h * 0.34)}" height="${r(h * 0.88)}" rx="${r(h * 0.06)}" fill="#1f3f95"/>`; return g; };
  const rx = x0 - cx + 22, ry = y0 - y1 + 14;
  k += rohl(rx, ry, 30);
  wandUnter.push({ id: "zu_rohling", de: "der Rohling", syl: "ROH-ling", it: "la targa vergine", itSyl: "TAR-ga VER-gi-ne", en: "blank plate", x: cx + rx, y: y1 + ry + 1, kunst: flaeche(-17, -11, 34, 12),
    tipp: "Ein Rohling ist ein leeres Schild — noch ohne Buchstaben und Ziffern." });
  /* Musterschilder: E-Kennzeichen, Saisonkennzeichen, Oldtimer */
  const muster = [
    { id: "zu_e_kennzeichen", de: "das E-Kennzeichen", syl: "E-kenn-zei-chen", it: "la targa per auto elettriche", itSyl: "TAR-ga per AU-to e-LET-tri-che", en: "electric vehicle plate", text: "M EV_204E", x: 22, y: 26, tipp: "Das „E“ am Ende zeigt: ein Elektroauto. Es darf oft gratis parken." },
    { id: "zu_saisonkennzeichen", de: "das Saisonkennzeichen", syl: "sä-ZONG-kenn-zei-chen", it: "la targa stagionale", itSyl: "TAR-ga sta-gio-NA-le", en: "seasonal plate", text: "B CS_88", x: 22, y: 41, saison: true, tipp: "Rechts stehen die Monate, in denen das Fahrzeug fahren darf — z. B. 04 bis 10." },
    { id: "zu_oldtimerkennzeichen", de: "das Oldtimerkennzeichen", syl: "OLD-tai-mer-kenn-zei-chen", it: "la targa per auto d'epoca", itSyl: "TAR-ga per AU-to d'E-po-ca", en: "classic car plate", text: "K OT_64H", x: 66, y: 41, tipp: "Das „H“ steht für „historisch“: das Auto ist über 30 Jahre alt." },
  ];
  muster.forEach((mm) => {
    const x = x0 - cx + mm.x, y = y0 - y1 + mm.y, w = 34;
    k += `<circle cx="${r(x - 8)}" cy="${r(y - 8.4)}" r=".7" fill="#777"/><circle cx="${r(x + 8)}" cy="${r(y - 8.4)}" r=".7" fill="#777"/>`;
    k += `<g transform="translate(${r(x)} ${r(y)})">${kennzeichen(w, mm.text, false, false, mm.saison ? 4.4 : 0)}</g>`;
    if (mm.saison) k += `<rect x="${r(x + w / 2 - 5)}" y="${r(y - 6.4)}" width="3.6" height="5.6" fill="#fff" stroke="#111" stroke-width=".25"/>` + `<text x="${r(x + w / 2 - 3.2)}" y="${r(y - 3.8)}" font-size="1.9" text-anchor="middle" font-family="Arial" font-weight="bold">04</text><text x="${r(x + w / 2 - 3.2)}" y="${r(y - 1.4)}" font-size="1.9" text-anchor="middle" font-family="Arial" font-weight="bold">10</text>`;
    wandUnter.push({ id: mm.id, de: mm.de, syl: mm.syl, it: mm.it, itSyl: mm.itSyl, en: mm.en, tipp: mm.tipp, x: cx + x, y: y1 + y + 1, kunst: flaeche(-w / 2 - 1, -9, w + 2, 10) });
  });
  /* Preisliste rechts oben */
  k += `<rect x="${x1 - cx - 30}" y="${y0 - y1 + 4}" width="26" height="18" fill="#fffdf2" stroke="#999" stroke-width=".3"/>` + T(x1 - cx - 17, y0 - y1 + 8.4, 2.4, "PREISE", "#141414", ' font-weight="bold"');
  ["1 Schild ……… 14 €", "2 Schilder …… 25 €", "Halter ………… 6 €", "Reservierung … 3 €"].forEach((t, i) => { k += T(x1 - cx - 17, y0 - y1 + 11.6 + i * 2.6, 1.7, t, "#333"); });
  S.teil({ id: "zu_schilderwand", de: "die Schilderwand", syl: "SCHIL-der-wand", it: "la parete delle targhe", itSyl: "pa-RE-te DEL-le TAR-ghe", en: "plate display wall", x: cx, y: y1, kunst: k,
    zoom: { x: x0 - 4, y: y0 - 4, w: x1 - x0 + 6, h: 64 }, unter: wandUnter });
}
const WB = { x0: 216, x1: 320, yt: 124, yu: 160 };   // Werkbank des Schilderdienstes
{
  const cx = (WB.x0 + WB.x1) / 2, W = WB.x1 - WB.x0, H = WB.yu - WB.yt;
  let k = schatten(0, 0.4, W / 2, 1.8, 0.3);
  k += `<path d="M${-W / 2 + 4} ${-H - 6} L${W / 2 + 2} ${-H - 6} L${W / 2 + 2} ${-H} L${-W / 2} ${-H} Z" fill="${S.lg("wbplatte", [[0, "#c8a77a"], [1, "#b08c5c"]])}"/>`;
  k += `<rect x="${-W / 2}" y="${-H}" width="${W + 2}" height="2.2" fill="#8e6c43"/>`;
  k += `<rect x="${-W / 2}" y="${-H + 2.2}" width="${W + 2}" height="${H - 2.2}" fill="${S.lg("wbfront", [[0, "#3b3f45"], [1, "#2a2d31"]])}"/>`;
  for (let i = 0; i < 3; i++) k += `<rect x="${-W / 2 + 4 + i * 33}" y="${-H + 6}" width="29" height="${H - 10}" rx=".6" fill="none" stroke="#4d5258" stroke-width=".6"/><rect x="${-W / 2 + 15 + i * 33}" y="${-H + 9}" width="7" height="1.2" rx=".5" fill="${STAHL}"/>`;
  k += `<rect x="${-W / 2}" y="-2" width="${W + 2}" height="2" fill="#16181b"/>`;
  /* Schilderhalter-Kartons und ein Stapel Rohlinge auf der Werkbank */
  k += `<path d="M${W / 2 - 26} ${-H - 2} L${W / 2 - 6} ${-H - 2} L${W / 2 - 6} ${-H - 10} L${W / 2 - 26} ${-H - 10} Z" fill="#c69a5c"/><path d="M${W / 2 - 26} ${-H - 10} L${W / 2 - 22} ${-H - 13} L${W / 2 - 2} ${-H - 13} L${W / 2 - 6} ${-H - 10} Z" fill="#d8b07a"/>`;
  k += T(W / 2 - 16, -H - 4.6, 2.2, "Halter", "#4a3418", ' font-weight="bold"');
  S.teil({ id: "zu_werkbank", de: "die Werkbank", syl: "WERK-bank", it: "il banco da lavoro", itSyl: "BAN-co da la-VO-ro", en: "workbench", x: cx, y: WB.yu, steht: true, kunst: k });
}
{
  /* DIE PRÄGEMASCHINE — Hydraulikpresse mit Prägestempeln, ein Schild im Werkzeug */
  let k = schatten(0, 0.3, 18, 1.4, 0.35);
  k += `<rect x="-17" y="-5" width="34" height="5" rx=".6" fill="${S.lg("pb", [[0, "#5d7f8e"], [1, "#3e5a66"]])}"/>`;
  /* C-Gestell */
  k += `<path d="M-15 -5 L-15 -36 Q-15 -39 -12 -39 L14 -39 Q17 -39 17 -36 L17 -28 L-7 -28 L-7 -12 L17 -12 L17 -5 Z" fill="${S.lg("presse", [[0, "#6f95a5"], [0.5, "#55798a"], [1, "#3e5a66"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-15 -36 Q-15 -39 -12 -39 L14 -39" stroke="#9cc0cf" stroke-width=".8" fill="none"/>`;
  /* Zylinder und Stempelkopf */
  k += `<rect x="3" y="-28" width="8" height="5" fill="${STAHL}"/><rect x="-6" y="-23" width="23" height="3" rx=".4" fill="#30353a"/>`;
  /* Schild im Werkzeug, Buchstaben schon erhaben */
  k += `<g transform="translate(5.5 -13.2)">${kennzeichen(22, "HH AB_1234", false)}</g>`;
  k += `<rect x="-6" y="-13" width="23" height="1.6" fill="#30353a"/>`;
  /* Bedienpult mit Zweihand-Tastern und Not-Aus */
  k += `<rect x="-14" y="-33" width="7" height="9" rx=".6" fill="#2a2e33"/><circle cx="-10.5" cy="-30" r="1.7" fill="#f2c200"/><circle cx="-10.5" cy="-30" r="1.1" fill="#d32f2f"/><circle cx="-12.2" cy="-26" r=".8" fill="#3ca35a"/><circle cx="-8.8" cy="-26" r=".8" fill="#3ca35a"/>`;
  k += `<rect x="-2" y="-37" width="16" height="4" fill="#f2c200"/>` + T(6, -34.1, 2.2, "PRÄGEPRESSE", "#141414", ' font-weight="bold"');
  k += `<rect x="-15" y="-36" width="2" height="31" fill="#fff" opacity=".18"/>`;
  S.teil({ id: "zu_praegemaschine", de: "die Prägemaschine", syl: "PRÄ-ge-ma-schi-ne", it: "la pressa per targhe", itSyl: "PRES-sa per TAR-ghe", en: "embossing press", x: 246, y: WB.yt - 1.5, steht: true, kunst: k,
    tipp: "Die Prägemaschine drückt Buchstaben und Ziffern in das Blech. Danach werden sie schwarz gefärbt." });
}
{
  /* DIE HEIßPRÄGEMASCHINE — färbt die erhabenen Zeichen mit schwarzer Folie */
  let k = schatten(0, 0.3, 13, 1.2, 0.3);
  k += `<rect x="-13" y="-6" width="26" height="6" rx=".8" fill="#e3e6e8" stroke="#a9b0b5" stroke-width=".3"/>`;
  k += `<rect x="-11" y="-18" width="22" height="12" rx="1" fill="${S.lg("heiss", [[0, "#f3f4f5"], [1, "#c9ced2"]], 0, 0, 1, 0)}" stroke="#a9b0b5" stroke-width=".3"/>`;
  k += `<circle cx="-7" cy="-21" r="3.2" fill="#1c1c1c"/><circle cx="-7" cy="-21" r="1.2" fill="#777"/><circle cx="7" cy="-21" r="3.2" fill="#1c1c1c"/><circle cx="7" cy="-21" r="1.2" fill="#777"/>`;
  k += `<path d="M-7 -17.8 L7 -17.8" stroke="#1c1c1c" stroke-width="1.2"/>`;
  k += `<rect x="-8" y="-12" width="16" height="3" rx=".4" fill="#d93a2b"/>` + T(0, -9.9, 1.8, "160 °C", "#fff", ' font-weight="bold"');
  k += `<g transform="translate(0 -1)">${kennzeichen(20, "HH AB_1234", false)}</g>`;
  S.teil({ id: "zu_heisspraege", de: "die Heißprägemaschine", syl: "HEISS-prä-ge-ma-schi-ne", it: "la stampatrice a caldo", itSyl: "stam-pa-TRI-ce a CAL-do", en: "hot stamping machine", x: 292, y: WB.yt - 1.5, steht: true, kunst: k });
}

/* =====================================================================
   6 — DIE HALTERIN (bringt die neuen Schilder zum Abstempeln)
   ===================================================================== */
{
  const m = figur({ id: "b08b_hal", geschlecht: "w", pose: "stehen", blick: -64, frisur: "pony", haarfarbe: "blond", haut: "hell",
    kleidung: { oberteil: { stueck: "rollkragen", farbe: "#d8c7a6" }, jacke: { stueck: "mantel", farbe: "#2f5a35" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "stiefel", farbe: "braun" }, zubehoer: { stueck: "tasche", farbe: "#6b3a2a" } } }, 98);
  S.teil({ id: "zu_kundin_zu", de: "die Halterin", syl: "HAL-te-rin", it: "l'intestataria", itSyl: "in-te-sta-TA-ria", en: "registered keeper", x: 190, y: 176, kunst: m.svg,
    tipp: "Die Halterin ist die Person, auf die das Auto angemeldet ist." });
}

/* =====================================================================
   7 — DER WARTESTUHL (vorne links, Reihe aus Holz-Schalensitzen)
   ===================================================================== */
{
  let k = schatten(0, 0.4, 14, 1.6, 0.3);
  const s = 60;
  /* Stahlkufe (Freischwinger) */
  k += `<path d="M-11 0 L11 0 Q13 0 12 -2 L9 ${-0.43 * s}" stroke="#a9b0b5" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
  k += `<path d="M-11 0 Q-13 0 -12 -2 L-9 ${-0.43 * s}" stroke="#c9cfd4" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
  /* Sitz und Lehne: Buchenformholz */
  const holz = S.lg("buche", [[0, "#e2b98a"], [1, "#b98a58"]]);
  k += `<path d="M-13 ${-0.45 * s - 2} L13 ${-0.45 * s - 2} L14 ${-0.45 * s + 1} Q0 ${-0.45 * s + 3} -14 ${-0.45 * s + 1} Z" fill="${holz}"/>`;
  k += `<path d="M-12 ${-0.45 * s - 2.5} L-11.4 ${-0.86 * s} Q0 ${-0.9 * s} 11.4 ${-0.86 * s} L12 ${-0.45 * s - 2.5} Q0 ${-0.45 * s - 1} -12 ${-0.45 * s - 2.5} Z" fill="${holz}"/>`;
  k += `<path d="M-10 ${-0.84 * s} Q0 ${-0.88 * s} 10 ${-0.84 * s}" stroke="#f3d6b2" stroke-width=".8" fill="none"/>`;
  k += `<rect x="-6" y="${-0.72 * s}" width="12" height="2" rx="1" fill="#8a6038" opacity=".35"/>`;
  S.teil({ id: "zu_wartestuhl_zu", de: "der Wartestuhl", syl: "WAR-te-stuhl", it: "la sedia d'attesa", itSyl: "SE-dia d'at-TE-sa", en: "waiting chair", x: 36, y: 194, steht: true, kunst: k });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/zulassungsstelle.js"));
console.log(aus);
