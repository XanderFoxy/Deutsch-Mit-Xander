#!/usr/bin/env node
/* =====================================================================
   DAS HOTEL (FASSUNG 852) — Bilderwelt neu: die Hotelrezeption mit Lobby
   ---------------------------------------------------------------------
   Die alten Wörter (Empfangsdame, Rezeption, Klingel, Schlüssel,
   Anmeldeformular, Sessel, Besucherin, Gast, Koffer, Gepäckwagen) meinen
   die EMPFANGSHALLE, nicht das Zimmer — gebaut wird also die Rezeption.

   RECHERCHE (IHK München/Oldenburg zum Meldeschein, Hotel-Fachblogs zum
   Check-in, Bilder deutscher 3–4-Sterne-Häuser):
   - Hinter dem EMPFANGSTRESEN (≈ 1,10 m hoch, Steinplatte, Holzfront)
     steht die Empfangsdame in dunklem Blazer. Auf dem Tresen: die
     Tischklingel aus Messing, der MELDESCHEIN mit Kugelschreiber (für
     ausländische Gäste weiter Pflicht, für Deutsche seit 2025 nicht mehr),
     Schlüsselkarten in einer Papierhülle, in traditionellen Häusern noch
     der Schlüssel mit schwerem Messinganhänger; der Bildschirm steht zur
     Mitarbeiterin gedreht.
   - An der Wand dahinter: Hotelname mit Sternen, die Reihe WELTZEITUHREN
     (Berlin, London, New York, Tokio), das SCHLÜSSELBRETT mit Fächern
     für Schlüssel und Post, auf dem Rückbuffet das Telefon.
   - Links der AUFZUG mit Stockwerksanzeige, davor der goldene
     GEPÄCKWAGEN mit Kleiderbügelstange.
   - Rechts die LOBBY: Sessel, Beistelltisch mit Zeitung, Stehlampe,
     Kübelpflanze, Prospektständer mit Stadtplänen, Teppich, Kronleuchter.
   Maßstab: Rückwand ≈ 45 Einheiten je Meter (Wandfuß y = 130),
   Tresenfront ≈ 51 je Meter, vorn ≈ 62 je Meter. Fluchtpunkt (160 | 92).
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "hotel", titel: "Das Hotel", emoji: "🛎️", thema: "Reisen", kuerzel: "b11a", fassung: 852 });
const rnd = zufall(4711);
const r = B.r;
const T = (x, y, s, t, f = "#222", a = "middle", w = "normal", fam = "Arial,Helvetica,sans-serif", extra = "") =>
  `<text x="${r(x)}" y="${r(y)}" font-size="${s}" text-anchor="${a}" fill="${f}" font-family="${fam}" font-weight="${w}"${extra}>${t}</text>`;
const stern = (cx, cy, R, f) => {
  let d = "";
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, q = i % 2 ? R * 0.42 : R; d += (i ? "L" : "M") + r(cx + Math.cos(a) * q) + " " + r(cy + Math.sin(a) * q); }
  return `<path d="${d}Z" fill="${f}"/>`;
};

/* ---------- Stoffe ---------------------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const WAND = S.lg("wand", [[0, "#f4ecdd"], [1, "#e6d9c2"]]);
const NUSS = S.lg("nuss", [[0, "#6a4126"], [0.5, "#7d4e2e"], [1, "#5a361f"]], 0, 0, 1, 0);
const NUSS_D = S.lg("nussd", [[0, "#4a2c18"], [1, "#2f1b0e"]]);
const MESSING = S.lg("messing", [[0, "#8a6a23"], [0.35, "#f3d77c"], [0.6, "#c9a23f"], [1, "#7a5a1c"]], 0, 0, 1, 0);
const MESSING_H = S.lg("messingh", [[0, "#f6e08f"], [0.5, "#c9a23f"], [1, "#7a5a1c"]]);
const STAHL = S.lg("stahl", [[0, "#dfe3e6"], [0.45, "#b9c0c6"], [0.55, "#a7afb6"], [1, "#d6dbdf"]], 0, 0, 1, 0);
const MARMOR = S.lg("marmor", [[0, "#f7f3ec"], [1, "#ddd5c8"]]);
const SAMT = S.lg("samt", [[0, "#2f6a55"], [0.55, "#245443"], [1, "#163a2e"]]);
const SAMT_V = S.lg("samtv", [[0, "#1b4436"], [0.5, "#2f6a55"], [1, "#1b4436"]], 0, 0, 1, 0);
const GLAS = S.lg("glas", [[0, "#ffffff", 0.3], [1, "#ffffff", 0.05]], 0, 0, 1, 1);

/* =====================================================================
   KULISSE — Decke, Wände (links Aufzugswand, Mitte Holzwand der
   Rezeption, rechts Lobbywand mit Kassetten), Marmorboden
   ===================================================================== */
const WU = 130, VP = { x: 160, y: 92 };
S.hinten(`<rect x="0" y="0" width="320" height="14" fill="${S.lg("decke", [[0, "#f3eee5"], [1, "#e4dccd"]])}"/><rect x="0" y="13" width="320" height="2" fill="#cbbd9f"/>`);
for (const x of [30, 100, 170, 230, 300]) S.hinten(`<ellipse cx="${x}" cy="6" rx="4" ry="1.2" fill="#fff7dc"/><ellipse cx="${x}" cy="6" rx="9" ry="2.6" fill="#fff3d0" opacity=".3"/>`);
/* linke Wand (Aufzug) und Lobbywand: heller Putz */
S.hinten(`<rect x="0" y="15" width="64" height="${WU - 15}" fill="${WAND}"/><rect x="206" y="15" width="114" height="${WU - 15}" fill="${WAND}"/>`);
/* Lobbywand: Kassetten im unteren Drittel, Stuckleiste oben */
{
  let k = `<rect x="206" y="15" width="114" height="3" fill="#efe5d2"/><rect x="206" y="18" width="114" height=".8" fill="#d2c3a6"/>`;
  k += `<rect x="206" y="88" width="114" height="1.6" fill="#e9dcc4"/><rect x="206" y="89.6" width="114" height=".6" fill="#c9b897"/>`;
  for (let x = 210; x < 318; x += 27) k += `<rect x="${x}" y="94" width="23" height="28" rx=".8" fill="none" stroke="#d4c5a8" stroke-width=".7"/><rect x="${x + 0.8}" y="94.8" width="21.4" height="1" fill="#fff" opacity=".5"/>`;
  /* Wandleuchten (Appliken) über der Lobby */
  S.hinten(k);
}
/* Holzwand hinter der Rezeption mit Fugen und Licht von oben */
{
  let k = `<rect x="64" y="15" width="142" height="${WU - 15}" fill="${NUSS}"/>`;
  for (let x = 64; x < 206; x += 11.8) k += `<rect x="${r(x)}" y="15" width=".7" height="${WU - 15}" fill="#3b2313" opacity=".55"/><rect x="${r(x + 0.7)}" y="15" width=".4" height="${WU - 15}" fill="#a87650" opacity=".35"/>`;
  for (let i = 0; i < 24; i++) { const x = 64 + rnd() * 142, y = 15 + rnd() * 100; k += `<path d="M${r(x)} ${r(y)} q.6 ${r(4 + rnd() * 6)} 0 ${r(10 + rnd() * 8)}" stroke="#4d2e19" stroke-width=".25" fill="none" opacity=".45"/>`; }
  k += `<rect x="64" y="15" width="142" height="${WU - 15}" fill="${S.lg("wandwash", [[0, "#ffe6b0", 0.42], [0.35, "#ffe6b0", 0.08], [1, "#000", 0.12]])}"/>`;
  k += `<rect x="62.6" y="15" width="1.4" height="${WU - 15}" fill="#c9a23f"/><rect x="206" y="15" width="1.4" height="${WU - 15}" fill="#c9a23f"/>`;
  S.hinten(k);
}
/* Rückbuffet hinter der Rezeption (wird vom Tresen größtenteils verdeckt) */
S.hinten(`<rect x="66" y="104" width="138" height="${WU - 104}" fill="${NUSS_D}"/><rect x="66" y="103" width="138" height="2" fill="#d9cfbf"/>`);
/* Sockelleiste */
S.hinten(`<rect x="0" y="${WU - 3}" width="64" height="3" fill="#bfae8f"/><rect x="206" y="${WU - 3}" width="114" height="3" fill="#bfae8f"/>`);
/* Marmorboden in Fluchtperspektive mit Spiegelung */
{
  let f = `<rect x="0" y="${WU}" width="320" height="${200 - WU}" fill="${S.lg("boden", [[0, "#d9cfbf"], [1, "#efe8dc"]])}"/>`;
  for (let i = -12; i <= 12; i++) { const xw = VP.x + i * 20; f += `<line x1="${xw}" y1="${WU}" x2="${r(VP.x + (xw - VP.x) * (200 - VP.y) / (WU - VP.y))}" y2="200" stroke="#b7aa94" stroke-width=".4"/>`; }
  for (const y of [134, 139.5, 146.5, 155.5, 167, 182, 200]) f += `<line x1="0" y1="${y}" x2="320" y2="${y}" stroke="#b7aa94" stroke-width=".4"/>`;
  for (let i = 0; i < 14; i++) { const x = rnd() * 320, y = WU + 3 + rnd() * 66; f += `<path d="M${r(x)} ${r(y)} q${r(3 + rnd() * 5)} ${r(-1 + rnd() * 2)} ${r(8 + rnd() * 8)} ${r(rnd() * 2)}" stroke="#c6b9a3" stroke-width=".3" fill="none" opacity=".7"/>`; }
  f += `<rect x="0" y="${WU}" width="320" height="${200 - WU}" fill="${S.lg("bodenlicht", [[0, "#000", 0.14], [0.35, "#000", 0], [1, "#fff", 0.1]])}"/>`;
  /* Spiegelung der Holzwand im polierten Stein */
  f += `<rect x="64" y="${WU}" width="142" height="14" fill="${S.lg("spiegel", [[0, "#7d4e2e", 0.3], [1, "#7d4e2e", 0]])}"/>`;
  S.hinten(f);
}

/* =====================================================================
   1 — DER KRONLEUCHTER (über der Lobby)
   ===================================================================== */
{
  let k = `<line x1="0" y1="-30" x2="0" y2="-14" stroke="#9c7b2c" stroke-width=".6"/><ellipse cx="0" cy="-30" rx="3" ry=".9" fill="${MESSING_H}"/>`;
  k += `<ellipse cx="0" cy="-2" rx="34" ry="14" fill="#fff1c9" opacity=".16" pointer-events="none"/>`;
  k += `<path d="M-1.4 -14 L1.4 -14 L2 -3 Q0 0 -2 -3 Z" fill="${MESSING}"/>`;
  k += `<ellipse cx="0" cy="-6" rx="13" ry="2.6" fill="none" stroke="${MESSING_H}" stroke-width="1.1"/>`;
  for (let i = 0; i < 6; i++) {
    const a = i / 6 * Math.PI * 2, x = Math.cos(a) * 13, y = -6 + Math.sin(a) * 2.6;
    k += `<rect x="${r(x - 0.7)}" y="${r(y - 5)}" width="1.4" height="5" fill="#fbf6ea"/><ellipse cx="${r(x)}" cy="${r(y - 6)}" rx="1.1" ry="1.6" fill="#fff4c4"/><circle cx="${r(x)}" cy="${r(y - 6)}" r="3" fill="#fff1c0" opacity=".35"/>`;
    for (let j = 0; j < 2; j++) k += `<path d="M${r(x - 2 + j * 4)} ${r(y + 0.6)} l.7 2.4 l-.7 1.2 l-.7 -1.2 Z" fill="#e8f2f6" stroke="#b9cbd1" stroke-width=".15"/>`;
  }
  for (let i = 0; i < 9; i++) k += `<path d="M${r(-8 + i * 2)} -1 l.8 2.8 l-.8 1.4 l-.8 -1.4 Z" fill="#eef6f9" stroke="#b9cbd1" stroke-width=".15"/>`;
  S.teil({ id: "ho_kronleuchter", de: "der Kronleuchter", syl: "KRON-leuch-ter", it: "il lampadario", itSyl: "lam-pa-DA-rio", en: "chandelier", x: 268, y: 32, kunst: k + flaeche(-15, -15, 30, 20) });
}

/* =====================================================================
   2 — DAS SCHILD (Hotelname mit vier Sternen) über der Rezeption
   ===================================================================== */
{
  let k = "";
  for (let i = 0; i < 4; i++) k += stern(-10.5 + i * 7, -9, 2.4, "#e7c766");
  k += T(0.3, 3.3, 9, "HOTEL LINDENHOF", "#3a2210", "middle", "bold", "Georgia,'Times New Roman',serif", ' letter-spacing="1.2"');
  k += T(0, 3, 9, "HOTEL LINDENHOF", MESSING_H, "middle", "bold", "Georgia,'Times New Roman',serif", ' letter-spacing="1.2"');
  k += `<rect x="-44" y="6" width="88" height=".6" fill="#c9a23f"/>`;
  k += T(0, 10.6, 2.6, "REZEPTION · RECEPTION", "#e7cf8a", "middle", "normal", "Georgia,serif", ' letter-spacing=".8"');
  S.teil({ id: "ho_schild", de: "das Schild", syl: "SCHILD", it: "l'insegna", itSyl: "in-SE-gna", en: "sign", x: 135, y: 32, kunst: k + flaeche(-46, -13, 92, 25),
    tipp: "Die Sterne zeigen die Klasse des Hotels: vier Sterne heißt „First Class“." });
}

/* =====================================================================
   3 — DIE UHR (Weltzeituhren: Berlin, London, New York, Tokio)
   ===================================================================== */
{
  const uhr = (cx, h, m, stadt) => {
    let g = `<circle cx="${cx}" cy="0" r="6.4" fill="${MESSING}"/><circle cx="${cx}" cy="0" r="5.6" fill="${S.rg("blatt", [[0, "#fffdf6"], [1, "#ece2cc"]])}"/>`;
    for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; g += `<line x1="${r(cx + Math.sin(a) * 4.9)}" y1="${r(-Math.cos(a) * 4.9)}" x2="${r(cx + Math.sin(a) * (i % 3 ? 4.4 : 3.9))}" y2="${r(-Math.cos(a) * (i % 3 ? 4.4 : 3.9))}" stroke="#2a1d12" stroke-width="${i % 3 ? 0.3 : 0.55}"/>`; }
    const ah = (h % 12 + m / 60) * Math.PI / 6, am = m * Math.PI / 30;
    g += `<line x1="${cx}" y1="0" x2="${r(cx + Math.sin(ah) * 2.8)}" y2="${r(-Math.cos(ah) * 2.8)}" stroke="#1d140c" stroke-width=".75" stroke-linecap="round"/>`;
    g += `<line x1="${cx}" y1="0" x2="${r(cx + Math.sin(am) * 4.3)}" y2="${r(-Math.cos(am) * 4.3)}" stroke="#1d140c" stroke-width=".45" stroke-linecap="round"/><circle cx="${cx}" cy="0" r=".5" fill="#b3261e"/>`;
    g += `<path d="M${cx - 4} -3.6 A5.6 5.6 0 0 1 ${cx + 2.5} -5" stroke="#fff" stroke-width=".6" opacity=".6" fill="none"/>`;
    g += `<rect x="${cx - 7.5}" y="8.2" width="15" height="3.6" rx=".5" fill="#2a170b" opacity=".8"/>` + T(cx, 10.9, 2.3, stadt, "#e7cf8a", "middle", "bold", "Arial", ' letter-spacing=".2"');
    return g;
  };
  /* Anfang Oktober: Sommerzeit — Berlin 15:10, London 14:10, New York 9:10, Tokio 22:10 */
  const k = uhr(-25.5, 15, 10, "BERLIN") + uhr(-8.5, 14, 10, "LONDON") + uhr(8.5, 9, 10, "NEW YORK") + uhr(25.5, 22, 10, "TOKIO");
  S.teil({ id: "ho_uhr", de: "die Uhr", syl: "UHR", it: "l'orologio", itSyl: "o-ro-LO-gio", en: "clock", x: 166, y: 56, kunst: k,
    tipp: "Die Uhren zeigen die Zeit in Berlin, London, New York und Tokio." });
}

/* =====================================================================
   4 — DAS SCHLÜSSELBRETT (Fächer mit Zimmernummern) — Lupe
   ===================================================================== */
{
  const X0 = 70, X1 = 124, Y0 = 44, Y1 = 100, cx = (X0 + X1) / 2;
  const sp = 6, zr = 5, fw = (X1 - X0 - 3) / sp, fh = (Y1 - Y0 - 5) / zr;
  let k = `<rect x="${X0 - cx - 1}" y="${Y0 - Y1 - 1}" width="${X1 - X0 + 2}" height="${Y1 - Y0 + 2}" rx="1" fill="#2a170b"/>`;
  k += `<rect x="${X0 - cx}" y="${Y0 - Y1}" width="${X1 - X0}" height="${Y1 - Y0}" fill="${NUSS_D}"/>`;
  const unter = [];
  for (let z = 0; z < zr; z++) for (let s = 0; s < sp; s++) {
    const x = X0 - cx + 1.5 + s * fw, y = Y0 - Y1 + 2.5 + z * fh, nr = 100 * (5 - z) + s + 1;
    k += `<rect x="${r(x + 0.4)}" y="${r(y + 0.4)}" width="${r(fw - 0.8)}" height="${r(fh - 0.8)}" fill="${S.lg("fach", [[0, "#1c0f06"], [1, "#3e2412"]])}"/>`;
    k += `<rect x="${r(x + 0.4)}" y="${r(y + fh - 2.6)}" width="${r(fw - 0.8)}" height="2.2" fill="#5a361f"/>`;
    k += `<rect x="${r(x + fw / 2 - 2.6)}" y="${r(y + fh - 2.3)}" width="5.2" height="1.6" rx=".3" fill="${MESSING_H}"/>` + T(x + fw / 2, y + fh - 1.05, 1.25, nr, "#3a2210", "middle", "bold");
    const art = (z * 7 + s * 3) % 5;
    if (art === 0 || art === 3) {
      /* Schlüssel mit Messinganhänger am Haken */
      k += `<circle cx="${r(x + fw / 2)}" cy="${r(y + 1.6)}" r=".35" fill="#c9a23f"/><line x1="${r(x + fw / 2)}" y1="${r(y + 1.6)}" x2="${r(x + fw / 2)}" y2="${r(y + 3.4)}" stroke="#c9a23f" stroke-width=".3"/>`;
      k += `<path d="M${r(x + fw / 2 - 1.1)} ${r(y + 3.4)} h2.2 l-.3 3.8 q-.8 .6 -1.6 0 Z" fill="${MESSING}"/>`;
    } else if (art === 1) {
      /* Post für den Gast */
      k += `<path d="M${r(x + 1)} ${r(y + fh - 2.6)} L${r(x + 1.4)} ${r(y + 2.6)} L${r(x + fw - 1.2)} ${r(y + 2.2)} L${r(x + fw - 1)} ${r(y + fh - 2.6)} Z" fill="#f6f2e8" stroke="#cfc6b3" stroke-width=".15"/><path d="M${r(x + 1.4)} ${r(y + 2.6)} L${r(x + fw / 2)} ${r(y + 4.4)} L${r(x + fw - 1.2)} ${r(y + 2.2)}" stroke="#c9bfa9" stroke-width=".2" fill="none"/>`;
    }
    if (z === 1 && s === 1) unter.push({ id: "ho_fach", de: "das Fach", syl: "FACH", it: "la casella", itSyl: "ca-SEL-la", en: "pigeonhole", x: cx + x + fw / 2, y: Y1 + y + fh, kunst: flaeche(-fw / 2, -fh, fw, fh) });
    if (art === 1 && z === 2 && !unter.find((u) => u.id === "ho_brief")) unter.push({ id: "ho_brief", de: "der Brief", syl: "BRIEF", it: "la lettera", itSyl: "LET-te-ra", en: "letter", x: cx + x + fw / 2, y: Y1 + y + fh, kunst: flaeche(-fw / 2, -fh, fw, fh),
      tipp: "Post für die Gäste kommt in das Fach mit der Zimmernummer." });
    if (z === 4 && s === 4) unter.push({ id: "ho_zimmernummer", de: "die Zimmernummer", syl: "ZIM-mer-num-mer", it: "il numero della camera", itSyl: "NU-me-ro del-la CA-me-ra", en: "room number", x: cx + x + fw / 2, y: Y1 + y + fh, kunst: flaeche(-3.4, -3, 6.8, 3.4),
      tipp: "Die erste Ziffer ist das Stockwerk: Zimmer 105 liegt im ersten Stock." });
  }
  k += `<rect x="${X0 - cx - 1}" y="${Y0 - Y1 - 1}" width="${X1 - X0 + 2}" height="1.6" fill="#8a5a33"/>`;
  S.teil({ id: "ho_schluesselbrett", de: "das Schlüsselbrett", syl: "SCHLÜS-sel-brett", it: "la bacheca delle chiavi", itSyl: "ba-CHE-ca DEL-le CHIA-vi", en: "key rack", x: cx, y: Y1, kunst: k,
    zoom: { x: X0 - 17, y: Y0 - 2, w: 88, h: 59 }, unter,
    tipp: "Im Schlüsselbrett hat jedes Zimmer ein Fach — für den Schlüssel und für Post." });
}

/* =====================================================================
   5 — DAS TELEFON (auf dem Rückbuffet)
   ===================================================================== */
{
  let k = schatten(0, 0, 6, .8, .3);
  k += `<path d="M-6 0 L6 0 L5 -5 L-5 -5 Z" fill="${S.lg("telgeh", [[0, "#3a3f45"], [1, "#16191c"]])}"/>`;
  k += `<rect x="-3.2" y="-4.4" width="4.6" height="2" rx=".3" fill="#7fb7c9"/>`;
  for (let i = 0; i < 6; i++) k += `<rect x="${r(2 + (i % 2) * 1.5)}" y="${r(-4.4 + Math.floor(i / 2) * 1.3)}" width="1.1" height=".9" rx=".2" fill="#8a9298"/>`;
  k += `<path d="M-6.4 -5 Q-6.6 -7.4 -4.6 -7.4 L4 -7.4 Q6 -7.4 5.8 -5 L4.2 -5.4 L-4.8 -5.4 Z" fill="#202428"/>`;
  k += `<path d="M-6.2 -1 q-2.4 1 -1.2 2.6" stroke="#202428" stroke-width=".4" fill="none"/>`;
  S.teil({ oben: true, id: "ho_telefon", de: "das Telefon", syl: "te-le-FON", it: "il telefono", itSyl: "te-LE-fo-no", en: "telephone", x: 132, y: 104, steht: true, kunst: k + flaeche(-7, -8.5, 14, 9) });
}

/* =====================================================================
   6 — DER AUFZUG (links, Edelstahltüren, Stockwerksanzeige, Taster)
   ===================================================================== */
{
  let k = `<rect x="-25" y="-100" width="50" height="100" fill="#cfc4b0"/>`;
  k += `<rect x="-23" y="-97" width="46" height="97" fill="${S.lg("aufzrahmen", [[0, "#c2c8cc"], [0.5, "#eef0f1"], [1, "#aeb5bb"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-20" y="-93" width="40" height="93" fill="#3d4247"/>`;
  for (const [x0, w] of [[-20, 19.8], [0.2, 19.8]]) {
    k += `<rect x="${x0}" y="-93" width="${w}" height="93" fill="${STAHL}"/>`;
    for (let i = 0; i < 9; i++) k += `<line x1="${r(x0 + 1 + i * 2.2)}" y1="-92" x2="${r(x0 + 1 + i * 2.2)}" y2="-1" stroke="#fff" stroke-width=".2" opacity=".35"/>`;
  }
  k += `<line x1="0" y1="-93" x2="0" y2="0" stroke="#5c6369" stroke-width=".5"/>`;
  /* Spiegelungen auf dem Edelstahl */
  k += `<path d="M-18 -93 L-10 -93 L-18 -40 Z" fill="#fff" opacity=".22"/><path d="M4 -93 L8 -93 L2 -50 Z" fill="#fff" opacity=".15"/>`;
  k += `<rect x="-20" y="-12" width="40" height="12" fill="${S.lg("aufzlicht", [[0, "#7d4e2e", 0], [1, "#7d4e2e", 0.18]])}"/>`;
  /* Stockwerksanzeige über der Tür */
  k += `<rect x="-9" y="-108" width="18" height="7" rx="1" fill="#15181b" stroke="#9aa3aa" stroke-width=".4"/>`;
  k += T(-2.5, -102.6, 5, "3", "#ffb43a", "middle", "bold", "'Courier New',monospace") + `<path d="M3 -102.8 L5.5 -102.8 L4.25 -105.6 Z" fill="#ffb43a"/>`;
  /* Rufknöpfe rechts neben der Tür */
  k += `<rect x="28" y="-54" width="5" height="11" rx=".8" fill="${STAHL}" stroke="#8d969e" stroke-width=".3"/>`;
  k += `<circle cx="30.5" cy="-50.5" r="1.3" fill="#e9edf0" stroke="#7d868d" stroke-width=".3"/><path d="M29.7 -50 L31.3 -50 L30.5 -51.4 Z" fill="#3a4047"/>`;
  k += `<circle cx="30.5" cy="-46.4" r="1.3" fill="#e9edf0" stroke="#ffb43a" stroke-width=".5"/><path d="M29.7 -46.9 L31.3 -46.9 L30.5 -45.5 Z" fill="#ff9b1a"/>`;
  k += `<rect x="-23" y="-1" width="46" height="2" fill="#8d969e"/>`;
  S.teil({ id: "ho_aufzug", de: "der Aufzug", syl: "AUF-zug", it: "l'ascensore", itSyl: "a-scen-SO-re", en: "lift", x: 32, y: WU, steht: true, kunst: k,
    tipp: "Mit dem Aufzug fährt man zu den Zimmern. Man sagt auch „der Fahrstuhl“." });
}

/* =====================================================================
   7 — DER PROSPEKTSTÄNDER (Lobby) — Lupe: Stadtplan, Prospekt, Postkarte
   ===================================================================== */
{
  const W = 32, H = 63;
  let k = schatten(0, 0, 17, 1.4, .3);
  k += `<rect x="-14" y="-2.4" width="28" height="2.4" rx=".6" fill="#2b2f33"/>`;
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="${H - 2}" rx="1" fill="${S.lg("pstaender", [[0, "#40464c"], [1, "#24282c"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${-W / 2 + 1}" y="${-H - 6}" width="${W - 2}" height="6" rx=".8" fill="#1f4f6b"/>` + T(0, -H - 1.9, 2.5, "Willkommen in der Stadt", "#fff", "middle", "bold");
  const farben = [["#e2574c", "#f6d24a"], ["#3c8fd1", "#ffffff"], ["#43a047", "#f1e9d0"], ["#f39c34", "#2d6fb3"], ["#8e5bb5", "#f6f2e8"], ["#1fa29a", "#fbe7a1"]];
  const unter = [];
  for (let z = 0; z < 4; z++) for (let s = 0; s < 3; s++) {
    const x = -W / 2 + 1.6 + s * 9.8, yb = -H + 15 + z * 14.6;
    /* Prospekte stecken in Acrylfächern, oben ragen sie heraus */
    const [a, b] = farben[(z * 3 + s) % farben.length];
    if (z === 0 && s === 2) {
      /* Postkarten (quer) mit Ansichten */
      for (let i = 0; i < 2; i++) k += `<rect x="${r(x + 0.4 + i * 0.6)}" y="${r(yb - 9 + i * 2.6)}" width="8" height="5.6" fill="#fff" stroke="#c9c2b4" stroke-width=".15"/><rect x="${r(x + 0.9 + i * 0.6)}" y="${r(yb - 8.5 + i * 2.6)}" width="7" height="4.6" fill="${S.lg("pk" + i, [[0, "#7fc4ea"], [0.6, "#bfe3f3"], [0.61, "#5b8f4a"], [1, "#3e6e33"]])}"/>`;
      k += `<path d="M${x + 2} ${yb - 3.6} l2 -2.4 l1.6 1.6 l1.4 -1 l1.6 1.8" stroke="#b5452f" stroke-width=".5" fill="none"/>`;
    } else if (z === 0 && s === 0) {
      /* Stadtplan, gefaltet, mit Straßenraster */
      k += `<rect x="${r(x + 0.5)}" y="${r(yb - 11)}" width="7.6" height="10" fill="#f7f1df"/>`;
      for (let i = 0; i < 4; i++) k += `<line x1="${r(x + 0.5)}" y1="${r(yb - 9.5 + i * 2.3)}" x2="${r(x + 8.1)}" y2="${r(yb - 10.4 + i * 2.3)}" stroke="#e8b85a" stroke-width=".4"/><line x1="${r(x + 1.6 + i * 2)}" y1="${r(yb - 11)}" x2="${r(x + 2.2 + i * 2)}" y2="${r(yb - 1)}" stroke="#f0f0f0" stroke-width=".5"/>`;
      k += `<path d="M${r(x + 0.5)} ${r(yb - 4)} q3 -1.6 7.6 -2.6" stroke="#6fb3dd" stroke-width=".9" fill="none"/><rect x="${r(x + 0.5)}" y="${r(yb - 11)}" width="7.6" height="2.2" fill="#c0392b"/>` + T(x + 4.3, yb - 9.4, 1.5, "Stadtplan", "#fff", "middle", "bold");
    } else {
      k += `<rect x="${r(x + 0.6)}" y="${r(yb - 11)}" width="7.4" height="10" fill="${a}"/><rect x="${r(x + 0.6)}" y="${r(yb - 7.6)}" width="7.4" height="3.6" fill="${b}" opacity=".85"/><rect x="${r(x + 1.4)}" y="${r(yb - 10.2)}" width="4" height=".8" fill="#fff" opacity=".8"/>`;
    }
    k += `<rect x="${r(x)}" y="${r(yb - 5)}" width="8.6" height="5" fill="#dfeef3" opacity=".35" stroke="#c8d6db" stroke-width=".2"/>`;
    if (z === 0 && s === 0) unter.push({ id: "ho_stadtplan", de: "der Stadtplan", syl: "STADT-plan", it: "la piantina della città", itSyl: "pian-TI-na DEL-la cit-TÀ", en: "city map", x: 222 + x + 4.3, y: 134 + yb, kunst: flaeche(-4.4, -11.4, 8.8, 11.6),
      tipp: "Den Stadtplan bekommt man an der Rezeption meistens kostenlos." });
    if (z === 0 && s === 1) unter.push({ id: "ho_prospekt", de: "der Prospekt", syl: "pro-SPEKT", it: "il dépliant", itSyl: "de-PLIANT", en: "brochure", x: 222 + x + 4.3, y: 134 + yb, kunst: flaeche(-4.4, -11.4, 8.8, 11.6) });
    if (z === 0 && s === 2) unter.push({ id: "ho_postkarte", de: "die Postkarte", syl: "POST-kar-te", it: "la cartolina", itSyl: "car-to-LI-na", en: "postcard", x: 222 + x + 4.3, y: 134 + yb, kunst: flaeche(-4.4, -9.6, 9.6, 9.8) });
  }
  k += `<path d="M${-W / 2 + 1} ${-H} L${-W / 2 + 6} ${-H} L${-W / 2 + 1} ${-H + 30} Z" fill="#fff" opacity=".07"/>`;
  S.teil({ id: "ho_prospektstaender", de: "der Prospektständer", syl: "pro-SPEKT-stän-der", it: "l'espositore di dépliant", itSyl: "e-spo-si-TO-re di de-PLIANT", en: "brochure rack", x: 222, y: 134, steht: true, kunst: k,
    zoom: { x: 192, y: 63, w: 60, h: 40 }, unter });
}

/* =====================================================================
   8 — DIE PFLANZE (Kentia-Palme im Kübel, Ecke der Lobby)
   ===================================================================== */
{
  let k = schatten(0, 0, 13, 1.6, .3);
  k += `<path d="M-10 -22 L10 -22 L8.6 0 L-8.6 0 Z" fill="${S.lg("kuebel", [[0, "#55595e"], [0.4, "#383c40"], [1, "#222528"]], 0, 0, 1, 0)}"/><rect x="-10.6" y="-23.4" width="21.2" height="2.4" rx=".6" fill="#4a4e53"/>`;
  k += `<ellipse cx="0" cy="-22.6" rx="9.6" ry="1.3" fill="#3a2a1c"/>`;
  const wedel = [[-70, 29, -1], [-46, 35, -1], [-22, 42, -1], [-4, 45, 1], [16, 40, 1], [38, 36, 1], [64, 30, 1], [-88, 22, -1], [84, 23, 1]];
  for (const [w, l, sx] of wedel) {
    const a = (w - 90) * Math.PI / 180, ex = Math.cos(a) * l, ey = -22 + Math.sin(a) * l, mx = Math.cos(a) * l * 0.55 + sx * 4, my = -22 + Math.sin(a) * l * 0.55 - 8;
    k += `<path d="M0 -22 Q${r(mx)} ${r(my)} ${r(ex)} ${r(ey + 10)}" stroke="#3d6b2c" stroke-width=".7" fill="none"/>`;
    for (let i = 2; i < 12; i += 1.5) {
      const t = i / 12, px = (1 - t) * (1 - t) * 0 + 2 * (1 - t) * t * mx + t * t * ex, py = (1 - t) * (1 - t) * -22 + 2 * (1 - t) * t * my + t * t * (ey + 10);
      const lang = 7 * Math.sin(t * Math.PI) + 1.5;
      for (const s of [-1, 1]) k += `<path d="M${r(px)} ${r(py)} q${r(s * lang * 0.5)} ${r(lang * 0.25)} ${r(s * lang * 0.7)} ${r(lang * 0.9)}" stroke="${(i + (s > 0 ? 1 : 0)) % 2 ? "#4f8a3a" : "#3f7a2f"}" stroke-width=".9" fill="none" stroke-linecap="round"/>`;
    }
  }
  S.teil({ id: "ho_pflanze", de: "die Pflanze", syl: "PFLAN-ze", it: "la pianta", itSyl: "PIAN-ta", en: "plant", x: 292, y: 135, steht: true, kunst: k });
}

/* =====================================================================
   9 — DER TEPPICH (Lobby)
   ===================================================================== */
{
  /* Viereck auf dem Boden: hinten y = 150, vorn y = 199 (relativ zu 262 | 199) */
  const P = (x, y) => `${r(x - 262)} ${r(y - 199)}`;
  const xb0 = 222, xb1 = 318, xf0 = 206, xf1 = 320;
  let k = `<path d="M${P(xb0, 150)} L${P(xb1, 150)} L${P(xf1, 199)} L${P(xf0, 199)} Z" fill="${S.lg("teppich", [[0, "#6e1f2a"], [1, "#8a2a36"]])}"/>`;
  const ein = (t) => { const yb = 150 + 2.4 * t, yf = 199 - 4 * t, l0 = xb0 + (xf0 - xb0) * (2.4 * t) / 49 + 3 * t, l1 = xb1 + (xf1 - xb1) * (2.4 * t) / 49 - 3 * t, f0 = xf0 - (xf0 - xb0) * (4 * t) / 49 + 4 * t, f1 = xf1 - (xf1 - xb1) * (4 * t) / 49 - 4 * t; return `M${P(l0, yb)} L${P(l1, yb)} L${P(f1, yf)} L${P(f0, yf)} Z`; };
  k += `<path d="${ein(1)}" fill="none" stroke="#d9b56a" stroke-width=".8"/><path d="${ein(2.2)}" fill="#7a2430" stroke="#c99a52" stroke-width=".4"/>`;
  for (let i = 0; i < 5; i++) { const y = 158 + i * 7.5; k += `<path d="M${P(250 - i * 3, y)} q12 -2.4 24 0 q-12 2.4 -24 0 Z" fill="#a8434e" opacity=".55"/>`; }
  for (let x = xf0 + 4; x < xf1; x += 3) k += `<line x1="${r(x - 262)}" y1="0" x2="${r(x - 262 + 0.3)}" y2="1.6" stroke="#e9d9b9" stroke-width=".4"/>`;
  S.teil({ id: "ho_teppich", de: "der Teppich", syl: "TEP-pich", it: "il tappeto", itSyl: "tap-PE-to", en: "rug", x: 262, y: 199, kunst: k });
}

/* =====================================================================
   10 — DIE STEHLAMPE (rechts hinter dem Beistelltisch)
   ===================================================================== */
{
  let k = schatten(0, 0, 8, 1.3, .3) + `<ellipse cx="0" cy="-1" rx="7" ry="1.8" fill="${MESSING_H}"/>`;
  k += `<rect x="-.7" y="-80" width="1.4" height="79" fill="${MESSING}"/>`;
  k += `<path d="M-8 -80 L8 -80 L10 -94 L-10 -94 Z" fill="${S.lg("schirm", [[0, "#fbf0d2"], [0.5, "#fff8e6"], [1, "#e9d6a8"]], 0, 0, 1, 0)}"/><ellipse cx="0" cy="-80" rx="8" ry="1.4" fill="#fff6d0"/>`;
  S.teil({ id: "ho_stehlampe", de: "die Stehlampe", syl: "STEH-lam-pe", it: "la lampada da terra", itSyl: "LAM-pa-da da TER-ra", en: "floor lamp", x: 308, y: 176, steht: true, kunst: k + flaeche(-3, -80, 6, 80) });
  S.davor(`<ellipse cx="308" cy="90" rx="20" ry="15" fill="#fff1c9" opacity=".18"/>`);
}

/* =====================================================================
   11 — DER SESSEL (Samt, Knopfheftung) und DIE BESUCHERIN darauf
   ===================================================================== */
const SES = { x: 254, y: 189, s: 58 };
{
  let k = schatten(0, 0, 28, 2.4, .35);
  for (const x of [-20, 20]) k += `<path d="M${x - 1.6} -6 L${x + 1.6} -6 L${x + 1} 0 L${x - 1} 0 Z" fill="#3a2414"/>`;
  /* Rückenlehne mit Knopfheftung */
  k += `<path d="M-22 -26 L-22 -54 Q-22 -62 -12 -62 L12 -62 Q22 -62 22 -54 L22 -26 Z" fill="${SAMT}"/>`;
  for (let z = 0; z < 3; z++) for (let s = 0; s < 5; s++) k += `<circle cx="${-14 + s * 7 + (z % 2) * 3.5}" cy="${-55 + z * 8}" r=".6" fill="#0f2a20"/>`;
  k += `<path d="M-18 -60 Q0 -62.4 18 -60" stroke="#5ea086" stroke-width=".8" opacity=".5" fill="none"/>`;
  /* Sitzkissen und Vorderseite */
  k += `<path d="M-20 -30 Q0 -33 20 -30 L21 -24 Q0 -21 -21 -24 Z" fill="#3c7c64"/>`;
  k += `<rect x="-22" y="-24.5" width="44" height="18.5" rx="3" fill="${SAMT_V}"/>`;
  k += `<path d="M-21 -7 L21 -7" stroke="#c9a23f" stroke-width=".5" stroke-dasharray=".6 .9"/>`;
  /* Armlehnen (gerollt) */
  for (const sx of [-1, 1]) {
    const x = sx * 24;
    k += `<path d="M${x - 5} -40 L${x + 5} -40 L${x + 5} -6 L${x - 5} -6 Z" fill="${SAMT_V}"/>`;
    k += `<ellipse cx="${x}" cy="-40" rx="5.6" ry="3.4" fill="${SAMT}"/><ellipse cx="${x}" cy="-40" rx="2.6" ry="2.2" fill="#1d4b3b" stroke="#0f2a20" stroke-width=".3"/>`;
  }
  S.teil({ id: "sessel", de: "der Sessel", syl: "SES-sel", it: "la poltrona", itSyl: "pol-TRO-na", en: "armchair", x: SES.x, y: SES.y, steht: true, kunst: k,
    tipp: "In der Lobby kann man sich hinsetzen und warten." });
}
{
  const m = B.mensch({ id: "ho_bes", geschlecht: "w", pose: "lesen", blick: 18, frisur: "lang", haarfarbe: "hellbraun", haut: "mittel",
    kleidung: { oberteil: { stueck: "bluse", farbe: "hellblau" }, unterteil: { stueck: "hose", farbe: "beige" }, schuhe: { stueck: "halbschuh", farbe: "braun" }, zubehoer: { stueck: "buch", farbe: "#b8473a" } } }, 1.66 * SES.s);
  const oy = SES.y - 0.46 * SES.s + m.z.sitz.y * -m.k;
  S.teil({ id: "besucherin", de: "die Besucherin", syl: "Be-SU-che-rin", it: "la visitatrice", itSyl: "vi-si-ta-TRI-ce", en: "visitor", x: SES.x, y: r(oy), kunst: m.svg,
    tipp: "Die Besucherin wartet in der Lobby auf einen Gast." });
}

/* =====================================================================
   12 — DER BEISTELLTISCH mit der ZEITUNG
   ===================================================================== */
{
  let k = schatten(0, 0, 12, 1.6, .3) + `<ellipse cx="0" cy="-1" rx="8" ry="2" fill="${MESSING_H}"/>`;
  k += `<rect x="-1.2" y="-31" width="2.4" height="30" fill="${MESSING}"/>`;
  k += `<ellipse cx="0" cy="-31" rx="15" ry="3.6" fill="${MARMOR}" stroke="#bfb3a0" stroke-width=".3"/><path d="M-15 -31 L-15 -29.6 A15 3.6 0 0 0 15 -29.6 L15 -31" fill="#cfc5b4"/>`;
  k += `<path d="M-10 -32.4 Q-2 -34 8 -33" stroke="#fff" stroke-width=".6" opacity=".7" fill="none"/>`;
  S.teil({ id: "ho_beistelltisch", de: "der Beistelltisch", syl: "BEI-stell-tisch", it: "il tavolino", itSyl: "ta-vo-LI-no", en: "side table", x: 294, y: 192, steht: true, kunst: k });
}
{
  let k = `<path d="M-8 -.4 L5 -1.4 L9 1 L-4 2 Z" fill="#f2efe6" stroke="#b9b2a2" stroke-width=".2"/>`;
  k += `<path d="M-7.5 -.6 L4.6 -1.5 L5.2 -.8 L-7 .2 Z" fill="#e6e1d4"/>`;
  k += `<path d="M-6 -2.6 L6 -3.6 L6.6 -1.2 L-5.4 -.2 Z" fill="#fbf9f3" stroke="#b9b2a2" stroke-width=".2"/>`;
  k += `<text x="0" y="-1.4" font-size="1.5" text-anchor="middle" fill="#1d1d1d" font-family="Georgia,serif" font-weight="bold" transform="rotate(-4.8 0 -1.4)">Tageblatt</text>`;
  k += `<path d="M-4.6 -.6 L4 -1.4 M-4.4 .1 L4.6 -.7" stroke="#8a8a8a" stroke-width=".2"/>`;
  S.teil({ oben: true, id: "ho_zeitung", de: "die Zeitung", syl: "ZEI-tung", it: "il giornale", itSyl: "gior-NA-le", en: "newspaper", x: 292, y: 161, kunst: k + flaeche(-9, -5, 18, 7.5) });
}

/* =====================================================================
   13 — DIE EMPFANGSDAME (hinter dem Tresen, dunkelblauer Blazer)
   ===================================================================== */
const TR = { x0: 66, x1: 206, oben: 118, kante: 126, fuss: 182 };
{
  const m = B.mensch({ id: "ho_empf", geschlecht: "w", pose: "stehen", blick: -28, frisur: "dutt", haarfarbe: "dunkelbraun", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "bluse", farbe: "weiss" }, jacke: { stueck: "jacke", farbe: "#1f2f4f" }, unterteil: { stueck: "hose", farbe: "#1f2f4f" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" }, zubehoer: { stueck: "schal", farbe: "#b8272a" } } }, 88);
  S.teil({ id: "empfangsdame", de: "die Empfangsdame", syl: "EMP-fangs-da-me", it: "la receptionist", itSyl: "re-cep-tio-NIST", en: "receptionist", x: 156, y: 170, kunst: m.svg,
    tipp: "Die Empfangsdame sagt: „Herzlich willkommen! Haben Sie reserviert?“" });
}

/* =====================================================================
   14 — DIE REZEPTION (Empfangstresen: Steinplatte, Nussbaumfront)
   ===================================================================== */
{
  const W = TR.x1 - TR.x0, H = TR.fuss - TR.kante, cx = (TR.x0 + TR.x1) / 2;
  let k = schatten(0, 0, W / 2 + 4, 2.2, .3);
  /* Platte (von leicht oben gesehen) und Kante */
  k += `<path d="M${-W / 2 + 3} ${TR.oben - TR.fuss} L${W / 2 - 3} ${TR.oben - TR.fuss} L${W / 2 + 1} ${-H} L${-W / 2 - 1} ${-H} Z" fill="${S.lg("platte", [[0, "#d9d1c3"], [1, "#f4efe6"]])}"/>`;
  for (let i = 0; i < 8; i++) { const x = -W / 2 + rnd() * W; k += `<path d="M${r(x)} ${r(-H - 6 + rnd() * 3)} q${r(4 + rnd() * 6)} ${r(1 + rnd())} ${r(10 + rnd() * 8)} ${r(-0.5 + rnd())}" stroke="#bdb2a0" stroke-width=".3" fill="none"/>`; }
  k += `<rect x="${-W / 2 - 1}" y="${-H}" width="${W + 2}" height="3" fill="${MARMOR}"/><rect x="${-W / 2 - 1}" y="${-H + 2.6}" width="${W + 2}" height=".6" fill="#a99d88"/>`;
  /* Front: Nussbaum mit Messingfuge und hinterleuchtetem Band */
  k += `<rect x="${-W / 2}" y="${-H + 3}" width="${W}" height="${H - 3}" fill="${NUSS}"/>`;
  for (let x = -W / 2 + 10; x < W / 2; x += 20) k += `<rect x="${r(x)}" y="${-H + 3}" width=".5" height="${H - 9}" fill="#3b2313" opacity=".6"/>`;
  k += `<rect x="${-W / 2}" y="${-H + 3}" width="${W}" height="4" fill="${S.lg("unterlicht", [[0, "#000", 0.35], [1, "#000", 0]])}"/>`;
  k += `<rect x="${-W / 2}" y="-22" width="${W}" height="2.2" fill="${S.lg("lichtband", [[0, "#fff1c4"], [1, "#e7b864"]])}"/><rect x="${-W / 2}" y="-19.8" width="${W}" height="3" fill="#ffe7a8" opacity=".25"/>`;
  k += `<rect x="${-W / 2}" y="-5" width="${W}" height="5" fill="#2a170b"/>`;
  /* Messing-Schriftzug in der Front */
  k += T(0, -28, 4.2, "REZEPTION", MESSING_H, "middle", "bold", "Georgia,serif", ' letter-spacing="1.6"');
  k += `<rect x="${-W / 2}" y="${-H + 3}" width="${W}" height="${H - 3}" fill="${S.lg("frontglanz", [[0, "#fff", 0.1], [0.3, "#fff", 0], [1, "#000", 0.15]])}"/>`;
  S.teil({ id: "rezeption", de: "die Rezeption", syl: "Re-zep-TI-ON", it: "la reception", itSyl: "re-CEP-tion", en: "reception", x: cx, y: TR.fuss, steht: true, kunst: k,
    tipp: "An der Rezeption checkt man ein und bekommt den Schlüssel." });
}
/* Standfläche auf der Tresenplatte */
const PL = 124;

/* =====================================================================
   15 — AUF DEM TRESEN: Klingel, Meldeschein, Kugelschreiber,
        Schlüsselkarte, Schlüssel, Bildschirm (zur Mitarbeiterin gedreht)
   ===================================================================== */
{
  /* DER BILDSCHIRM — Rückseite, leicht gedreht: ein Streifen Bild ist zu sehen */
  let k = schatten(0, 0, 7, .8, .3) + `<rect x="-4" y="-1.2" width="8" height="1.2" rx=".4" fill="#2b2f33"/><rect x="-1" y="-6" width="2" height="5" fill="#3a3f44"/>`;
  k += `<path d="M-11 -20 L10 -21.4 L10.6 -6.4 L-11 -5.6 Z" fill="${S.lg("monrueck", [[0, "#40464c"], [1, "#24282c"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-11 -20 L-12.6 -19.2 L-12.6 -6.2 L-11 -5.6 Z" fill="#7fb7d9"/><path d="M-11 -20 L-12.6 -19.2 L-12.6 -16 Z" fill="#fff" opacity=".4"/>`;
  k += `<circle cx="0" cy="-14" r="1.2" fill="#2f3438"/>`;
  S.teil({ oben: true, id: "ho_bildschirm", de: "der Bildschirm", syl: "BILD-schirm", it: "lo schermo", itSyl: "SCHER-mo", en: "screen", x: 184, y: PL - 1.5, steht: true, kunst: k });
}
{
  /* DIE KLINGEL — Tischklingel aus Messing */
  let k = schatten(0, .2, 5, .8, .35) + `<ellipse cx="0" cy="-.8" rx="4.6" ry="1.4" fill="#1d1d1d"/><rect x="-4.6" y="-1.8" width="9.2" height="1" fill="#2b2b2b"/>`;
  k += `<path d="M-4 -1.8 Q-4 -6.4 0 -6.6 Q4 -6.4 4 -1.8 Z" fill="${S.rg("glocke", [[0, "#fff3b8"], [0.45, "#e2bd55"], [1, "#8a6a23"]], 0.35, 0.3, 0.8)}"/>`;
  k += `<rect x="-.35" y="-8" width=".7" height="1.6" fill="#c9a23f"/><ellipse cx="0" cy="-8.2" rx="1.1" ry=".55" fill="${MESSING_H}"/>`;
  k += `<path d="M-2.6 -4.6 Q-1.8 -5.8 -.6 -6" stroke="#fff" stroke-width=".5" opacity=".8" fill="none"/>`;
  S.teil({ oben: true, id: "klingel", de: "die Klingel", syl: "KLIN-gel", it: "il campanello", itSyl: "cam-pa-NEL-lo", en: "bell", x: 78, y: PL, steht: true, kunst: k + flaeche(-5, -9, 10, 9.6),
    tipp: "Ist niemand da, drückt man auf die Klingel." });
}
{
  /* DAS ANMELDEFORMULAR — Meldeschein auf einer Schreibunterlage */
  let k = `<path d="M-10 -.4 L9 -.4 L7.6 -5.6 L-8.6 -5.6 Z" fill="#2c3238"/>`;
  k += `<path d="M-8 -1 L7 -1 L6 -5.2 L-7 -5.2 Z" fill="#fbfaf6"/><path d="M-7 -5.2 L6 -5.2 L5.8 -4.4 L-6.8 -4.4 Z" fill="#2d6fb3"/>`;
  k += T(-0.5, -4.55, .75, "MELDESCHEIN", "#fff", "middle", "bold");
  for (let i = 0; i < 4; i++) k += `<path d="M${r(-6.6 - i * 0.25)} ${r(-3.8 + i * 0.7)} L${r(5.6 + i * 0.25)} ${r(-3.8 + i * 0.7)}" stroke="#a7b3bd" stroke-width=".18"/>`;
  k += `<path d="M2 -1.6 q.8 -.6 1.4 0 q.6 .5 1.4 -.3" stroke="#1f3a8a" stroke-width=".22" fill="none"/>`;
  S.teil({ oben: true, id: "formular_ho", de: "das Anmeldeformular", syl: "AN-mel-de-for-mu-lar", it: "il modulo di registrazione", itSyl: "MO-du-lo di re-gi-stra-ZIO-ne", en: "registration form", x: 120, y: PL + 1.5, steht: true, kunst: k + flaeche(-10, -6.4, 20, 6.6),
    tipp: "Gäste aus dem Ausland füllen den Meldeschein aus und unterschreiben." });
}
{
  /* DER KUGELSCHREIBER — im Halter mit Kette */
  let k = schatten(0, .2, 3, .5, .3) + `<ellipse cx="0" cy="-.6" rx="2.6" ry=".9" fill="${MESSING_H}"/><rect x="-1.2" y="-2.4" width="2.4" height="1.8" rx=".4" fill="${MESSING}"/>`;
  k += `<path d="M-.4 -2.4 L1.8 -11.2 L2.7 -11 L.5 -2.2 Z" fill="#1f2a44"/><path d="M1.8 -11.2 L2.1 -12.4 L2.8 -12.2 L2.7 -11 Z" fill="${MESSING_H}"/>`;
  k += `<path d="M1.2 -1.6 q2.6 .6 2.8 -2.6" stroke="#c9a23f" stroke-width=".25" stroke-dasharray=".4 .3" fill="none"/>`;
  S.teil({ oben: true, id: "ho_kugelschreiber", de: "der Kugelschreiber", syl: "KU-gel-schrei-ber", it: "la penna a sfera", itSyl: "PEN-na a SFE-ra", en: "ballpoint pen", x: 135, y: PL, steht: true, kunst: k + flaeche(-3, -13, 6.6, 13.4) });
}
{
  /* DIE SCHLÜSSELKARTE — in der aufgestellten Kartenhülle */
  let k = schatten(0, .2, 5, .6, .3);
  k += `<path d="M-5.4 0 L5.4 0 L4.4 -7.6 L-4.4 -7.6 Z" fill="#f6f1e4" stroke="#c9bfa9" stroke-width=".2"/>`;
  k += `<rect x="-3.6" y="-10.6" width="7.2" height="4.6" rx=".5" fill="${S.lg("karte", [[0, "#2c5f8a"], [1, "#1a3b5a"]], 0, 0, 1, 1)}"/><path d="M-2.6 -9.6 h2.2" stroke="#e7c766" stroke-width=".5"/>`;
  k += `<path d="M2 -9.6 q.8 .6 0 1.4 M2.8 -9.9 q1.3 1 0 2" stroke="#fff" stroke-width=".25" fill="none" opacity=".8"/>`;
  k += T(0, -3.8, 1.5, "Zimmer 214", "#3a2210", "middle", "bold", "Georgia,serif") + T(0, -1.8, 1, "Hotel Lindenhof", "#8a6a23", "middle", "normal", "Georgia,serif");
  S.teil({ oben: true, id: "ho_schluesselkarte", de: "die Schlüsselkarte", syl: "SCHLÜS-sel-kar-te", it: "la chiave magnetica", itSyl: "CHIA-ve ma-GNE-ti-ca", en: "key card", x: 148, y: PL, steht: true, kunst: k,
    tipp: "Mit der Schlüsselkarte öffnet man die Zimmertür: einfach an das Schloss halten." });
}
{
  /* DER SCHLÜSSEL — klassischer Zimmerschlüssel mit schwerem Messinganhänger */
  let k = schatten(0, .2, 7, .6, .3);
  k += `<path d="M-6 -.3 Q-6.6 -3.4 -3.4 -3.6 L1 -3.6 Q3.4 -3.4 2.8 -.3 Z" fill="${S.rg("anh", [[0, "#fff0a8"], [0.5, "#d9b04a"], [1, "#7a5a1c"]], 0.35, 0.3, 0.9)}"/>`;
  k += T(-1.6, -1.3, 1.4, "214", "#4a3410", "middle", "bold", "Georgia,serif");
  k += `<circle cx="3.8" cy="-2" r=".9" fill="none" stroke="#c9a23f" stroke-width=".4"/>`;
  k += `<circle cx="5.6" cy="-2.2" r="1.2" fill="none" stroke="#b9c0c6" stroke-width=".6"/><path d="M6.8 -2.2 L11 -2.4 L11 -1.4 M9.4 -2.3 L9.4 -1.3" stroke="#b9c0c6" stroke-width=".6" fill="none"/>`;
  S.teil({ oben: true, id: "schluessel", de: "der Schlüssel", syl: "SCHLÜS-sel", it: "la chiave", itSyl: "CHIA-ve", en: "key", x: 166, y: PL, steht: true, kunst: k + flaeche(-7, -5, 19, 5.4) });
}

/* =====================================================================
   16 — DER GEPÄCKWAGEN (Messing, roter Teppichboden, Kleidersack)
   ===================================================================== */
{
  let k = schatten(0, 0, 32, 2.4, .35);
  /* hintere Stangen (dünner, weiter weg) */
  for (const x of [-22, 22]) k += `<rect x="${x - 0.6}" y="-104" width="1.2" height="88" fill="${MESSING}" opacity=".85"/>`;
  k += `<path d="M-22 -104 Q-22 -110 -16 -110 L16 -110 Q22 -110 22 -104" stroke="${MESSING_H}" stroke-width="1.2" fill="none"/>`;
  /* Kleidersack am Bügel */
  k += `<path d="M6 -110 q0 -2.4 2 -2.4 q2 0 2 2" stroke="#8d969e" stroke-width=".5" fill="none"/><path d="M8 -110 L1 -105 L15 -105 Z" fill="none" stroke="#8d969e" stroke-width=".5"/>`;
  k += `<path d="M1 -105.4 L15 -105.4 L16 -58 Q8 -55 0 -58 Z" fill="${S.lg("kleidersack", [[0, "#26324a"], [0.5, "#33415e"], [1, "#1b2436"]], 0, 0, 1, 0)}"/><line x1="8" y1="-104" x2="8.4" y2="-60" stroke="#8d969e" stroke-width=".4" stroke-dasharray="1 .5"/>`;
  /* Hartschalenkoffer (hinten) und Reisetasche (vorne) */
  k += `<rect x="-24" y="-60" width="24" height="44" rx="3" fill="${S.lg("hartschale", [[0, "#cfd6da"], [0.5, "#eef1f2"], [1, "#a9b3b9"]], 0, 0, 1, 0)}"/>`;
  for (let i = 0; i < 4; i++) k += `<rect x="${-21 + i * 6}" y="-57" width="1.2" height="38" rx=".5" fill="#9aa5ac" opacity=".55"/>`;
  k += `<rect x="-17" y="-63" width="10" height="3" rx="1.4" fill="none" stroke="#3a3f44" stroke-width="1"/>`;
  k += `<path d="M-2 -40 Q-2 -46 6 -46 L20 -46 Q27 -46 27 -40 L27 -16 L-2 -16 Z" fill="${S.lg("tasche", [[0, "#9a6436"], [1, "#6b4122"]])}"/>`;
  k += `<path d="M2 -46 Q10 -56 22 -46" stroke="#4a2c16" stroke-width="1.4" fill="none"/><line x1="-2" y1="-40" x2="27" y2="-40" stroke="#c9a23f" stroke-width=".4" stroke-dasharray="1 .6"/>`;
  /* Plattform mit rotem Teppich und Messingkante */
  k += `<path d="M-28 -16 L28 -16 L31 -11 L-31 -11 Z" fill="#8a2430"/>`;
  k += `<rect x="-31" y="-11" width="62" height="5" rx=".8" fill="${S.lg("kante", [[0, "#f3d77c"], [1, "#8a6a23"]])}"/>`;
  /* vordere Stangen und Bogen */
  for (const x of [-28, 28]) k += `<rect x="${x - 1}" y="-104" width="2" height="94" fill="${MESSING}"/>`;
  k += `<path d="M-28 -104 Q-28 -114 -18 -114 L18 -114 Q28 -114 28 -104" stroke="${MESSING}" stroke-width="2" fill="none"/>`;
  k += `<path d="M-28 -104 Q-28 -114 -18 -114 L18 -114" stroke="#fff6c9" stroke-width=".5" fill="none" opacity=".7"/>`;
  for (const x of [-28, 28]) k += `<ellipse cx="${x}" cy="-60" rx="1.8" ry=".9" fill="${MESSING_H}"/>`;
  /* Räder */
  for (const [x, y, rr] of [[-26, -3.6, 3.6], [26, -3.6, 3.6]]) k += `<circle cx="${x}" cy="${y}" r="${rr}" fill="#1d1d1d"/><circle cx="${x}" cy="${y}" r="1.4" fill="${MESSING_H}"/>`;
  S.teil({ id: "gepaeckwagen", de: "der Gepäckwagen", syl: "Ge-PÄCK-wa-gen", it: "il carrello", itSyl: "car-REL-lo", en: "luggage trolley", x: 33, y: 195, steht: true, kunst: k,
    tipp: "Mit dem Gepäckwagen bringt der Page die Koffer aufs Zimmer." });
}

/* =====================================================================
   17 — DER GAST (am Tresen) und DER KOFFER (Rollkoffer neben ihm)
   ===================================================================== */
{
  const m = B.mensch({ id: "ho_gast", geschlecht: "m", pose: "stehen", blick: 62, frisur: "kurz", haarfarbe: "schwarz", haut: "dunkel",
    kleidung: { oberteil: { stueck: "hemd", farbe: "hellblau" }, jacke: { stueck: "jacke", farbe: "beige" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "halbschuh", farbe: "braun" } } }, 110);
  S.teil({ id: "gast", de: "der Gast", syl: "GAST", it: "l'ospite", itSyl: "O-spi-te", en: "guest", x: 100, y: 196, kunst: m.svg,
    tipp: "Der Gast sagt: „Guten Tag, ich habe ein Zimmer reserviert.“" });
}
{
  let k = schatten(0, 0, 13, 1.6, .35);
  for (const x of [-8, 8]) k += `<circle cx="${x}" cy="-1.8" r="1.8" fill="#1d1d1d"/>`;
  k += `<rect x="-11" y="-44" width="22" height="41" rx="3" fill="${S.lg("rollkoffer", [[0, "#b8323c"], [0.45, "#d8434e"], [1, "#8a1f28"]], 0, 0, 1, 0)}"/>`;
  for (let i = 0; i < 3; i++) k += `<rect x="${-6 + i * 6 - 0.6}" y="-41" width="1.2" height="35" rx=".5" fill="#7a1a22" opacity=".5"/>`;
  k += `<rect x="-11" y="-25" width="22" height="1" fill="#6f1820"/>`;
  /* ausgezogener Teleskopgriff */
  k += `<rect x="-5" y="-62" width="1.2" height="18" fill="#9aa3aa"/><rect x="3.8" y="-62" width="1.2" height="18" fill="#9aa3aa"/><rect x="-6" y="-64" width="12" height="3" rx="1.4" fill="#2b2f33"/>`;
  k += `<path d="M-9 -42 L-6 -42 L-9 -20 Z" fill="#fff" opacity=".2"/>`;
  /* Kofferanhänger */
  k += `<path d="M9 -36 q2 2 1 5" stroke="#3a3f44" stroke-width=".4" fill="none"/><rect x="8.4" y="-31.4" width="4" height="5.6" rx=".6" fill="#f2d24a" transform="rotate(12 10 -28)"/>`;
  S.teil({ id: "koffer", de: "der Koffer", syl: "KOF-fer", it: "la valigia", itSyl: "va-LI-gia", en: "suitcase", x: 128, y: 197, steht: true, kunst: k });
}

/* Glanz auf dem polierten Boden vorn (fängt keinen Tipp ab) */
S.davor(`<rect x="0" y="186" width="320" height="14" fill="${S.lg("vorn", [[0, "#fff", 0], [1, "#fff", 0.08]])}" pointer-events="none"/>`);

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/hotel.js"));
console.log(aus);
