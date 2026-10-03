#!/usr/bin/env node
/* =====================================================================
   MUSIKINSTRUMENTE (FASSUNG 852) — Bilderwelt neu: das Musikhaus
   ---------------------------------------------------------------------
   Früher eine lange Seite mit Kacheln, jetzt ein echter Ort: der
   Verkaufsraum eines deutschen Musikhauses (Fachhandel mit Klavieren,
   Gitarren, Streichern, Blasinstrumenten und Schlagzeug).

   RECHERCHE (Musikhäuser in Deutschland und Österreich, z. B. ein
   Traditionshaus, 1905 als Klavierhaus gegründet, heute mit Gitarren-,
   Bläser-, Tasten- und Band-Abteilung):
   - An der Rückwand die GITARRENWAND: Konzert- und E-Gitarren hängen an
     Wandhaltern (Kopf oben), jede mit Preisschild.
   - Daneben ein KLAVIER (Pianino) an der Wand, darauf ein Metronom;
     über dem Klavier hängen GEIGEN an Haltern.
   - Ein Wandregal mit Glasböden für BLASINSTRUMENTE: Trompete,
     Saxofon, Querflöte, Klarinette, Blockflöten, Mundharmonika und
     Triangel (Kleinpercussion).
   - Ein SCHLAGZEUG steht auf einem Podest, davor ein Cello auf dem
     Ständer, eine Hakenharfe, ein Akkordeon auf dem Hocker.
   - Vorne ein FLÜGEL mit aufgestelltem Deckel und Noten, eine Djembe
     (Trommel) und ein Xylofon mit Schlägeln.
   Maßstab: Rückwand ≈ 40 Einheiten je Meter (Wand 3 m), Augenhöhe
   1,6 m → Horizont y = 68; Cello ≈ 51, Harfe ≈ 67, Flügel ≈ 76, vorn ≈ 80.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "instrumente", titel: "Musikinstrumente", emoji: "🎸", thema: "Musik", kuerzel: "b26e", fassung: 852 });
const rnd = zufall(440);
const r = B.r;
{ const lg0 = S.lg, rg0 = S.rg, c = {}; S.lg = (n, ...a) => c[n] || (c[n] = lg0(n, ...a)); S.rg = (n, ...a) => c["r" + n] || (c["r" + n] = rg0(n, ...a)); }
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);

const HORIZONT = 68, WAND_UNTEN = 132;
const sAuf = (y) => (y - HORIZONT) / 1.6;
const FICHTE = S.rg("fichte", [[0, "#f3cf8a"], [0.6, "#dca95c"], [1, "#b07a36"]], 0.5, 0.55, 0.6);
const AHORN = S.rg("ahorn", [[0, "#e08a3a"], [0.6, "#b85a1c"], [1, "#7a3510"]], 0.45, 0.45, 0.65);
const PALI = S.lg("pali", [[0, "#4a2a16"], [1, "#2a160a"]]);
const MESSING = S.lg("messing", [[0, "#fff1b0"], [0.35, "#e8c25a"], [0.7, "#b8892a"], [1, "#f2d27a"]], 0, 0, 1, 0);
const SILBER = S.lg("silber", [[0, "#ffffff"], [0.4, "#c9ced3"], [0.7, "#9aa2a9"], [1, "#eef1f3"]], 0, 0, 0, 1);
const LACK = S.lg("lack", [[0, "#3a3d42"], [0.5, "#16181b"], [1, "#0b0c0e"]]);
const CHROM = S.lg("chrom", [[0, "#ffffff"], [0.5, "#aab2b9"], [1, "#e6e9ec"]], 0, 0, 1, 0);

/* =====================================================================
   KULISSE — Decke mit Strahlern, dunkelgrüne Wand, Parkett
   ===================================================================== */
S.hinten(`<rect width="320" height="14" fill="${S.lg("decke", [[0, "#2a2d30"], [1, "#3a3d40"]])}"/>`);
S.hinten(`<rect x="0" y="14" width="320" height="${WAND_UNTEN - 14}" fill="${S.lg("wand", [[0, "#3d5c58"], [1, "#2c4542"]])}"/>`);
{
  let k = `<rect x="0" y="4.4" width="320" height=".9" fill="#111"/>`;
  for (const x of [30, 100, 170, 230, 290]) {
    k += `<rect x="${x - 1.6}" y="5" width="3.2" height="4" rx=".6" fill="#555a60"/><ellipse cx="${x}" cy="9.2" rx="1.6" ry=".6" fill="#fff6dc"/>`;
    k += `<path d="M${x - 1.6} 9.4 L${x - 22} 80 L${x + 22} 80 L${x + 1.6} 9.4 Z" fill="${S.lg("kegel", [[0, "#fff1c8", 0.22], [1, "#fff1c8", 0]])}"/>`;
  }
  /* Holzlamellen hinter der Gitarrenwand */
  k += `<rect x="2" y="20" width="78" height="${WAND_UNTEN - 20}" fill="${S.lg("lamelle", [[0, "#8a5a30"], [1, "#6b4322"]])}"/>`;
  for (let x = 4; x < 80; x += 3) k += `<rect x="${x}" y="20" width="1" height="${WAND_UNTEN - 20}" fill="#4e2f17" opacity=".5"/>`;
  k += `<rect x="0" y="${WAND_UNTEN - 3}" width="320" height="3" fill="#1d2a28"/>`;
  /* Poster und Schilder */
  k += `<rect x="248" y="26" width="58" height="9" rx="1" fill="#d8b04a"/><text x="277" y="32.6" font-size="5" text-anchor="middle" fill="#2a1a10" font-family="Georgia,serif" font-weight="bold">Drums</text>`;
  k += `<rect x="152" y="18" width="80" height="7" rx="1" fill="#d8b04a"/><text x="192" y="23.4" font-size="4.4" text-anchor="middle" fill="#2a1a10" font-family="Georgia,serif" font-weight="bold">Blasinstrumente</text>`;
  k += `<rect x="6" y="14" width="70" height="6" fill="#2a1a10"/><text x="41" y="18.6" font-size="4" text-anchor="middle" fill="#d8b04a" font-family="Georgia,serif" font-weight="bold" letter-spacing=".6">GITARREN</text>`;
  S.hinten(k);
}
/* Parkett (Fischgrät angedeutet) in Fluchtperspektive */
{
  let f = `<rect x="0" y="${WAND_UNTEN}" width="320" height="${200 - WAND_UNTEN}" fill="${S.lg("parkett", [[0, "#9a6a3a"], [1, "#b57d45"]])}"/>`;
  const yT = (d) => HORIZONT + 1.6 * 400 / d;
  for (let d = 10; d > 3.1; d -= 0.5) { const y = yT(d); if (y > WAND_UNTEN && y < 200) f += `<line x1="0" y1="${r(y)}" x2="320" y2="${r(y)}" stroke="#7a4f26" stroke-width=".35" opacity=".6"/>`; }
  for (let i = -14; i <= 14; i++) { const xw = 160 + i * 12, t = (200 - HORIZONT) / (WAND_UNTEN - HORIZONT); f += `<line x1="${xw}" y1="${WAND_UNTEN}" x2="${r(160 + (xw - 160) * t)}" y2="200" stroke="#7a4f26" stroke-width=".3" opacity=".45"/>`; }
  f += `<rect x="0" y="${WAND_UNTEN}" width="320" height="${200 - WAND_UNTEN}" fill="${S.lg("parkettlicht", [[0, "#000", 0.2], [0.5, "#fff", 0.04], [1, "#000", 0.05]])}"/>`;
  /* Teppich unter dem Flügel */
  f += `<path d="M10 166 L130 166 L140 196 L0 196 L0 172 Z" fill="#7a2e2a" opacity=".85"/><path d="M12 168 L128 168 L136 194 L2 194" stroke="#d8b04a" stroke-width=".5" fill="none" opacity=".6"/>`;
  S.hinten(f);
}

/* ---------- Instrument-Formen ---------- */
/* Gitarre: hängend, Kopf oben; Ursprung = Wandhalter; Länge 40 (dann skaliert) */
const KORPUS = "M0 16 C6 16 7 20 6 23 C5 26 4.2 27 5 29 C8 32 8 39 0 40 C-8 39 -8 32 -5 29 C-4.2 27 -5 26 -6 23 C-7 20 -6 16 0 16 Z";
const halter = `<path d="M-2.4 -.6 L-1.6 2 M2.4 -.6 L1.6 2" stroke="#222" stroke-width=".8" stroke-linecap="round"/><rect x="-1.2" y="-2" width="2.4" height="2" rx=".4" fill="#333"/>`;
const gitarre = (holz) => {
  let g = `<path d="M-1.8 1.2 L1.8 1.2 L1.4 7 L-1.4 7 Z" fill="${PALI}"/>`;
  for (let i = 0; i < 3; i++) g += `<circle cx="-2.2" cy="${2.4 + i * 1.6}" r=".45" fill="${CHROM}"/><circle cx="2.2" cy="${2.4 + i * 1.6}" r=".45" fill="${CHROM}"/>`;
  g += `<rect x="-1.2" y="7" width="2.4" height="11" fill="${PALI}"/>`;
  for (let i = 0; i < 6; i++) g += `<line x1="-1.2" y1="${8 + i * 1.6}" x2="1.2" y2="${8 + i * 1.6}" stroke="#c9ced3" stroke-width=".15"/>`;
  g += `<path d="${KORPUS}" fill="${holz}" stroke="#5a3210" stroke-width=".35"/>`;
  g += `<circle cx="0" cy="24.6" r="2.4" fill="#1a0f08"/><circle cx="0" cy="24.6" r="2.9" fill="none" stroke="#7a4a22" stroke-width=".35"/>`;
  g += `<rect x="-3" y="33.4" width="6" height="1.3" rx=".4" fill="${PALI}"/>`;
  for (let i = 0; i < 6; i++) g += `<line x1="${-0.75 + i * 0.3}" y1="1.6" x2="${-0.75 + i * 0.3}" y2="34" stroke="#eee" stroke-width=".08"/>`;
  g += `<path d="M-5 19 C-6 22 -5 25 -4 27" stroke="#fff" stroke-width=".6" opacity=".25" fill="none"/>`;
  return g;
};
const egitarre = (farbe) => {
  let g = `<path d="M-1.4 .8 L2 .8 L2.4 6.6 L-1 6.6 Z" fill="#e8c890"/>`;
  for (let i = 0; i < 6; i++) g += `<circle cx="2.6" cy="${1.4 + i * 0.95}" r=".35" fill="${CHROM}"/>`;
  g += `<rect x="-1.1" y="6.6" width="2.2" height="13" fill="#e8c890"/>`;
  for (let i = 0; i < 7; i++) g += `<line x1="-1.1" y1="${7.6 + i * 1.6}" x2="1.1" y2="${7.6 + i * 1.6}" stroke="#a8743f" stroke-width=".15"/>`;
  g += `<path d="M-2 19 L-4 15.4 Q-6 14 -6.6 17 Q-7.6 22 -5.6 26 Q-8.2 30 -7 35 Q-5 40 0 40 Q6 40 7 35 Q8 30 6 27 Q7.6 24 6.6 19.6 Q6 16.6 4 18.2 L2 20 Z" fill="${farbe}" stroke="#111" stroke-width=".3"/>`;
  g += `<path d="M-3.6 21 Q-5 26 -3.4 30 Q-4 35 0 37 Q4 36 3.4 31 L1.6 22 Z" fill="#f4f1ea"/>`;
  for (const y of [24, 28, 32]) g += `<rect x="-2" y="${y}" width="4" height="1.3" rx=".5" fill="#eee" stroke="#999" stroke-width=".15"/>`;
  g += `<rect x="-2.4" y="34.6" width="4.8" height="1" fill="${CHROM}"/><circle cx="4.4" cy="33" r=".7" fill="#eee"/><circle cx="3.2" cy="35.6" r=".7" fill="#eee"/>`;
  for (let i = 0; i < 6; i++) g += `<line x1="${-0.75 + i * 0.3}" y1="1" x2="${-0.75 + i * 0.3}" y2="35" stroke="#eee" stroke-width=".08"/>`;
  g += `<path d="M-5.6 18 Q-6.6 22 -5 25" stroke="#fff" stroke-width=".6" opacity=".3" fill="none"/>`;
  return g;
};
const preis = (x, y, t) => `<rect x="${x - 4}" y="${y}" width="8" height="3.2" rx=".3" fill="#fffdf4"/><text x="${x}" y="${y + 2.4}" font-size="2" text-anchor="middle" fill="#8a1c1c" font-family="Arial" font-weight="bold">${t}</text>`;

/* =====================================================================
   1 — DIE GITARRE (zwei Konzertgitarren) und 2 — DIE E-GITARRE (zwei)
   ===================================================================== */
{
  let k = "";
  for (const [x, holz, p] of [[-8, FICHTE, "249 €"], [8, S.rg("fichte2", [[0, "#f6dca2"], [0.6, "#e2b46c"], [1, "#b98446"]], 0.5, 0.55, 0.6), "389 €"]]) {
    k += `<g transform="translate(${x} 0)">${halter}${gitarre(holz)}</g>` + preis(x, 42, p);
  }
  S.teil({ id: "gitarre", de: "die Gitarre", syl: "Gi-TAR-re", it: "la chitarra", itSyl: "chi-TAR-ra", en: "guitar", x: 20, y: 30, kunst: k,
    tipp: "Die Gitarre hat sechs Saiten." });
}
{
  let k = "";
  for (const [x, f, p] of [[-8, S.lg("sunburst", [[0, "#f2b24a"], [0.55, "#c0501c"], [1, "#2a0f05"]], 0.5, 0.5, 0.5, 1), "599 €"], [8, S.lg("rot", [[0, "#e8343a"], [1, "#8a0f14"]]), "449 €"]]) {
    k += `<g transform="translate(${x} 0)">${halter}${egitarre(f)}</g>` + preis(x, 42, p);
  }
  S.teil({ id: "egitarre", de: "die E-Gitarre", syl: "E-gi-tar-re", it: "la chitarra elettrica", itSyl: "chi-TAR-ra e-LET-tri-ca", en: "electric guitar", x: 60, y: 30, kunst: k,
    tipp: "Die E-Gitarre braucht einen Verstärker, sonst ist sie sehr leise." });
}

/* =====================================================================
   3 — DIE GEIGE (drei Geigen hängen über dem Klavier)
   ===================================================================== */
const geige = (s) => {
  /* Länge ≈ 24 bei s = 1: Schnecke oben, Korpus unten */
  let g = `<circle cx="0" cy="1.2" r="1.2" fill="${AHORN}"/><rect x="-.7" y="1.6" width="1.4" height="3" fill="${AHORN}"/>`;
  g += `<rect x="-.6" y="4.4" width="1.2" height="7" fill="#1a0f08"/>`;
  g += `<path d="M0 10 C4 10 4.6 12 4 13.6 C3.2 15 3 15.4 3.6 16.6 C5.4 18.4 5 23.4 0 24 C-5 23.4 -5.4 18.4 -3.6 16.6 C-3 15.4 -3.2 15 -4 13.6 C-4.6 12 -4 10 0 10 Z" fill="${AHORN}" stroke="#4a1f08" stroke-width=".3"/>`;
  g += `<path d="M-1.8 14.6 q-.6 2 .2 3.6 M1.8 14.6 q.6 2 -.2 3.6" stroke="#1a0f08" stroke-width=".35" fill="none"/>`;
  g += `<rect x="-.6" y="11" width="1.2" height="6" fill="#1a0f08"/><rect x="-1.4" y="18.6" width="2.8" height=".6" fill="#e8c890"/><path d="M-1 20 L1 20 L.6 23 L-.6 23 Z" fill="#1a0f08"/>`;
  g += `<path d="M-3 12 C-4 14 -3.4 15 -2.6 16" stroke="#ffd0a0" stroke-width=".5" opacity=".4" fill="none"/>`;
  return `<g transform="scale(${s})">${g}</g>`;
};
{
  let k = "";
  for (const x of [-18, 0, 18]) k += `<g transform="translate(${x} 0)">${halter}${geige(1)}</g>`;
  /* Bögen an einer Leiste daneben */
  k += `<rect x="26" y="-1" width="1.2" height="26" fill="#333"/><line x1="24" y1="0" x2="24" y2="25" stroke="#5a3210" stroke-width=".5"/><line x1="25" y1="0" x2="25" y2="25" stroke="#e8e0c8" stroke-width=".3"/>`;
  k += preis(0, 27, "ab 189 €");
  S.teil({ id: "geige", de: "die Geige", syl: "GEI-ge", it: "il violino", itSyl: "vio-LI-no", en: "violin", x: 108, y: 30, kunst: k,
    tipp: "Die Geige spielt man mit einem Bogen. Man sagt auch „Violine“." });
}

/* =====================================================================
   4 — DAS KLAVIER (Pianino an der Wand) und 5 — DAS METRONOM darauf
   ===================================================================== */
{
  const W = 60, H = 50;
  let k = schatten(0, 0, 32, 1.4, .35);
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="${H}" rx="1" fill="${LACK}"/>`;
  k += `<rect x="${-W / 2 - 1}" y="${-H - 1.4}" width="${W + 2}" height="2.4" rx=".6" fill="#2a2d31"/>`;
  k += `<rect x="${-W / 2 + 4}" y="${-H + 6}" width="${W - 8}" height="16" rx="1" fill="#0d0e10" stroke="#3a3d42" stroke-width=".4"/>`;
  k += `<text x="0" y="${-H + 30.6}" font-size="2.6" text-anchor="middle" fill="#d8b04a" font-family="Georgia,serif" letter-spacing=".5">SCHÄFER &amp; SÖHNE</text>`;
  /* Tastatur (52 weiße Tasten angedeutet) */
  const ky = -H + 28.6;
  k += `<rect x="${-W / 2 - 1}" y="${ky - 0.6}" width="${W + 2}" height="1.2" fill="#2a2d31"/>`;
  k += `<rect x="${-W / 2 + 2}" y="${ky + 0.6}" width="${W - 4}" height="3.6" fill="#f6f2e8"/>`;
  for (let i = 0; i <= 36; i++) k += `<line x1="${r(-W / 2 + 2 + i * (W - 4) / 36)}" y1="${ky + 0.6}" x2="${r(-W / 2 + 2 + i * (W - 4) / 36)}" y2="${ky + 4.2}" stroke="#b9b2a2" stroke-width=".12"/>`;
  for (let i = 0; i < 36; i++) if ([0, 1, 3, 4, 5].includes(i % 7)) k += `<rect x="${r(-W / 2 + 2 + (i + 0.7) * (W - 4) / 36)}" y="${ky + 0.6}" width="${r((W - 4) / 36 * 0.6)}" height="2.2" fill="#111"/>`;
  k += `<rect x="${-W / 2 + 1}" y="${ky + 4.2}" width="${W - 2}" height="2.4" fill="#16181b"/>`;
  /* Füße, Pedale */
  k += `<rect x="${-W / 2 + 1}" y="-4" width="5" height="4" fill="#0b0c0e"/><rect x="${W / 2 - 6}" y="-4" width="5" height="4" fill="#0b0c0e"/>`;
  for (const x of [-3, 0, 3]) k += `<rect x="${x - 0.9}" y="-2.4" width="1.8" height="1.2" rx=".3" fill="${MESSING}"/>`;
  k += `<path d="M${-W / 2 + 2} ${-H + 2} L${-W / 2 + 12} ${-H + 2} L${-W / 2 + 2} -6 Z" fill="#fff" opacity=".05"/>`;
  /* Klavierbank davor */
  k += `<rect x="-14" y="-17" width="28" height="3.4" rx=".8" fill="#1d1f22"/><rect x="-12" y="-14" width="2" height="14" fill="#0b0c0e"/><rect x="10" y="-14" width="2" height="14" fill="#0b0c0e"/>`;
  S.teil({ id: "klavier", de: "das Klavier", syl: "Kla-VIER", it: "il pianoforte", itSyl: "pia-no-FOR-te", en: "piano", x: 112, y: 132, steht: true, kunst: k,
    tipp: "Das Klavier hat 88 Tasten – weiße und schwarze." });
}
{
  let k = schatten(0, 0, 4, .5, .3);
  k += `<path d="M-3.4 0 L3.4 0 L1.4 -10 L-1.4 -10 Z" fill="${S.lg("metronom", [[0, "#8a4a22"], [1, "#5a2e12"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-2.2 -1.4 L2.2 -1.4 L1 -8.6 L-1 -8.6 Z" fill="#f2e6c8"/>`;
  k += `<line x1="0" y1="-2" x2="1.8" y2="-9.4" stroke="${CHROM}" stroke-width=".35"/><rect x="1" y="-7.4" width="1" height="1" fill="${MESSING}"/>`;
  S.teil({ oben: true, id: "metronom", de: "das Metronom", syl: "Me-tro-NOM", it: "il metronomo", itSyl: "me-TRO-no-mo", en: "metronome", x: 132, y: 81.4, steht: true, kunst: k,
    tipp: "Das Metronom tickt im Takt und hilft beim Üben." });
}

/* =====================================================================
   6 — DAS REGAL mit Glasböden (Blasinstrumente) — Lupe: Trompete,
       Saxofon, Querflöte, Klarinette, Blockflöte, Mundharmonika, Triangel
   ===================================================================== */
const RG = { x0: 150, x1: 236, y1: WAND_UNTEN };
const GB = [52, 76];       // Glasböden (Oberkante)
{
  const W = RG.x1 - RG.x0, cx = (RG.x0 + RG.x1) / 2;
  const X = (x) => r(x - cx), Y = (y) => r(y - RG.y1);
  let k = "";
  /* Rückwand hell, Glasböden mit Konsolen, LED-Leiste */
  k += `<rect x="${X(RG.x0)}" y="${Y(28)}" width="${W}" height="${r(RG.y1 - 28 - 36)}" fill="${S.lg("regalrw", [[0, "#efe6d2"], [1, "#d8cbb0"]])}"/>`;
  for (const b of GB) {
    k += `<rect x="${X(RG.x0 + 1)}" y="${Y(b)}" width="${W - 2}" height="1.4" fill="#cfe6ee" opacity=".9"/><rect x="${X(RG.x0 + 1)}" y="${Y(b) + 1.4}" width="${W - 2}" height=".5" fill="#9ab8c4"/>`;
    for (const x of [RG.x0 + 6, RG.x1 - 6]) k += `<path d="M${X(x)} ${Y(b) + 1.9} l0 3 l-2 -3 Z" fill="${CHROM}"/>`;
    k += `<rect x="${X(RG.x0 + 1)}" y="${Y(b) - 22}" width="${W - 2}" height="2" fill="${S.lg("led", [[0, "#fff6d8", 0.8], [1, "#fff6d8", 0]])}"/>`;
  }
  /* Unterschrank mit Schubladen (Saiten, Blätter, Noten) */
  k += `<rect x="${X(RG.x0)}" y="${Y(96)}" width="${W}" height="36" fill="${S.lg("schrank", [[0, "#6b4322"], [1, "#4e2f17"]])}"/><rect x="${X(RG.x0)}" y="${Y(96)}" width="${W}" height="2" fill="#8a5a30"/>`;
  for (let i = 0; i < 3; i++) k += `<rect x="${X(RG.x0 + 2 + i * 28)}" y="${Y(100)}" width="26" height="10" rx=".8" fill="none" stroke="#2a160a" stroke-width=".5"/><rect x="${X(RG.x0 + 12 + i * 28)}" y="${Y(104.4)}" width="6" height="1.2" rx=".6" fill="${MESSING}"/>`;
  /* Notenhefte auf dem Unterschrank */
  for (let i = 0; i < 6; i++) k += `<rect x="${X(RG.x0 + 4 + i * 4.6)}" y="${Y(96) - 11 + (i % 2)}" width="4" height="${11 - (i % 2)}" fill="${["#c0392b", "#2f6fb8", "#e8c25a", "#3fa34d", "#8c4fa0", "#f4f1ea"][i]}"/>`;
  const unter = [];
  const u = (id, de, syl, it, itSyl, en, x0, x1, y0, yb, tipp) => unter.push({ id, de, syl, it, itSyl, en, tipp, x: (x0 + x1) / 2, y: yb, kunst: flaeche(-(x1 - x0) / 2, -(yb - y0), x1 - x0, yb - y0 + 0.6) });

  /* Boden 1: Trompete (liegend, Schallstück rechts) */
  {
    const b = GB[0], x = RG.x0 + 6;
    let t = `<path d="M${X(x)} ${Y(b - 5.4)} L${X(x + 14)} ${Y(b - 5.4)}" stroke="${MESSING}" stroke-width="1.1"/>`;
    t += `<path d="M${X(x + 3)} ${Y(b - 2.2)} L${X(x + 13)} ${Y(b - 2.2)} Q${X(x + 15)} ${Y(b - 2.2)} ${X(x + 15)} ${Y(b - 3.8)} Q${X(x + 15)} ${Y(b - 5.4)} ${X(x + 13)} ${Y(b - 5.4)}" stroke="${MESSING}" stroke-width="1" fill="none"/>`;
    t += `<path d="M${X(x + 3)} ${Y(b - 2.2)} Q${X(x + 1)} ${Y(b - 2.2)} ${X(x + 1)} ${Y(b - 3.8)} Q${X(x + 1)} ${Y(b - 5.4)} ${X(x + 3)} ${Y(b - 5.4)}" stroke="${MESSING}" stroke-width="1" fill="none"/>`;
    t += `<path d="M${X(x + 14)} ${Y(b - 6)} L${X(x + 20)} ${Y(b - 8.6)} L${X(x + 20)} ${Y(b - 2)} L${X(x + 14)} ${Y(b - 4.8)} Z" fill="${MESSING}"/><ellipse cx="${X(x + 20)}" cy="${Y(b - 5.3)}" rx="1" ry="3.3" fill="#b8892a"/>`;
    for (const dx of [6, 8, 10]) t += `<rect x="${X(x + dx) - 0.5}" y="${Y(b - 8)}" width="1" height="3.6" fill="${SILBER}"/><circle cx="${X(x + dx)}" cy="${Y(b - 8.4)}" r=".7" fill="#f4f1ea"/>`;
    t += `<rect x="${X(x - 1.6)}" y="${Y(b - 6)}" width="1.8" height="1.2" rx=".4" fill="${SILBER}"/>`;
    t += `<path d="M${X(x + 4)} ${Y(b)} l1 -2 h8 l1 2 Z" fill="#2a2d31"/>`;
    k += t;
    u("trompete", "die Trompete", "Trom-PE-te", "la tromba", "TROM-ba", "trumpet", x - 2, x + 22, b - 12, b, "Die Trompete hat drei Ventile.");
  }
  /* Boden 1: Saxofon auf Ständer */
  {
    const b = GB[0], x = RG.x0 + 38;
    let t = `<path d="M${X(x - 3)} ${Y(b)} L${X(x)} ${Y(b - 4)} L${X(x + 3)} ${Y(b)}" stroke="#2a2d31" stroke-width=".7" fill="none"/>`;
    t += `<path d="M${X(x - 1)} ${Y(b - 22)} Q${X(x - 2.6)} ${Y(b - 24)} ${X(x - 4.6)} ${Y(b - 23)}" stroke="${MESSING}" stroke-width=".9" fill="none"/><rect x="${X(x - 5.6)}" y="${Y(b - 23.4)}" width="1.2" height=".8" fill="#111"/>`;
    t += `<path d="M${X(x - 1.6)} ${Y(b - 22)} L${X(x - 0.4)} ${Y(b - 22)} L${X(x + 0.6)} ${Y(b - 6)} Q${X(x + 0.6)} ${Y(b - 2.6)} ${X(x + 4)} ${Y(b - 3)} Q${X(x + 6.4)} ${Y(b - 3.6)} ${X(x + 6.4)} ${Y(b - 7)} L${X(x + 6)} ${Y(b - 12)} L${X(x + 9)} ${Y(b - 13)} L${X(x + 7.6)} ${Y(b - 7)} Q${X(x + 7.6)} ${Y(b - 1.4)} ${X(x + 3.4)} ${Y(b - 1.2)} Q${X(x - 1.6)} ${Y(b - 1.4)} ${X(x - 1.6)} ${Y(b - 6)} Z" fill="${MESSING}"/>`;
    t += `<ellipse cx="${X(x + 7.5)}" cy="${Y(b - 12.6)}" rx="1.6" ry=".6" fill="#8a6a1a" transform="rotate(-18 ${X(x + 7.5)} ${Y(b - 12.6)})"/>`;
    for (let i = 0; i < 6; i++) t += `<circle cx="${X(x - 0.4 + i * 0.12)}" cy="${Y(b - 19 + i * 2.4)}" r=".55" fill="#f4f1ea" stroke="#b8892a" stroke-width=".15"/>`;
    k += t;
    u("saxofon", "das Saxofon", "SA-xo-fon", "il sassofono", "sas-SO-fo-no", "saxophone", x - 7, x + 10, b - 25, b, "Das Saxofon ist aus Messing, gehört aber zu den Holzblasinstrumenten.");
  }
  /* Boden 1: Querflöte auf zwei Gabeln */
  {
    const b = GB[0], x = RG.x0 + 56;
    let t = `<path d="M${X(x + 3)} ${Y(b)} v-3 M${X(x + 23)} ${Y(b)} v-3" stroke="#2a2d31" stroke-width=".6"/>`;
    t += `<rect x="${X(x)}" y="${Y(b - 4.4)}" width="27" height="1.2" rx=".5" fill="${SILBER}"/>`;
    for (let i = 0; i < 9; i++) t += `<circle cx="${X(x + 8 + i * 2)}" cy="${Y(b - 4.8)}" r=".6" fill="#e1e5e8" stroke="#8a929a" stroke-width=".12"/>`;
    t += `<rect x="${X(x + 2.4)}" y="${Y(b - 4.9)}" width="1.8" height=".7" rx=".3" fill="#c9ced3"/>`;
    k += t;
    u("querfloete", "die Querflöte", "QUER-flö-te", "il flauto traverso", "FLAU-to tra-VER-so", "flute", x - 1, x + 28, b - 10, b, "Die Querflöte hält man beim Spielen seitlich.");
  }
  /* Boden 2: Klarinette auf einem Kegelständer */
  {
    const b = GB[1], x = RG.x0 + 10;
    let t = `<path d="M${X(x - 3)} ${Y(b)} L${X(x)} ${Y(b - 3)} L${X(x + 3)} ${Y(b)} Z" fill="#2a2d31"/>`;
    t += `<path d="M${X(x - 0.7)} ${Y(b - 21)} L${X(x + 0.7)} ${Y(b - 21)} L${X(x + 0.7)} ${Y(b - 5.4)} L${X(x + 2)} ${Y(b - 2.6)} L${X(x - 2)} ${Y(b - 2.6)} L${X(x - 0.7)} ${Y(b - 5.4)} Z" fill="#141518"/>`;
    t += `<path d="M${X(x - 0.5)} ${Y(b - 23.6)} L${X(x + 0.5)} ${Y(b - 23.6)} L${X(x + 0.6)} ${Y(b - 21)} L${X(x - 0.6)} ${Y(b - 21)} Z" fill="#2a2d31"/>`;
    for (const yy of [b - 20.4, b - 14, b - 9]) t += `<rect x="${X(x - 0.85)}" y="${Y(yy)}" width="1.7" height=".5" fill="${SILBER}"/>`;
    for (let i = 0; i < 6; i++) t += `<circle cx="${X(x + 0.2)}" cy="${Y(b - 18.6 + i * 2.3)}" r=".35" fill="${SILBER}"/>`;
    k += t;
    u("klarinette", "die Klarinette", "Kla-ri-NET-te", "il clarinetto", "cla-ri-NET-to", "clarinet", x - 5, x + 5, b - 24, b);
  }
  /* Boden 2: Blockflöten in einem Halter */
  {
    const b = GB[1], x = RG.x0 + 26;
    let t = `<rect x="${X(x - 7)}" y="${Y(b - 3)}" width="14" height="3" rx=".6" fill="#8a5a30"/>`;
    for (const [dx, h, f] of [[-4.4, 13, "#e8c890"], [0, 11, "#c99a5c"], [4.4, 9, "#a8743f"]]) {
      t += `<rect x="${X(x + dx - 0.8)}" y="${Y(b - 3 - h)}" width="1.6" height="${h}" rx=".6" fill="${f}"/><rect x="${X(x + dx - 1)}" y="${Y(b - 3 - h)}" width="2" height="2.6" rx=".8" fill="${f}" stroke="#7a4a22" stroke-width=".15"/>`;
      t += `<rect x="${X(x + dx - 0.5)}" y="${Y(b - 3 - h + 3.2)}" width="1" height=".7" fill="#3a2010"/>`;
      for (let i = 0; i < 4; i++) t += `<circle cx="${X(x + dx)}" cy="${Y(b - 3 - h + 5.4 + i * 1.5)}" r=".28" fill="#3a2010"/>`;
    }
    k += t;
    u("blockfloete", "die Blockflöte", "BLOCK-flö-te", "il flauto dolce", "FLAU-to DOL-ce", "recorder", x - 7.6, x + 7.6, b - 18, b, "Viele Kinder lernen in der Schule Blockflöte.");
  }
  /* Boden 2: Mundharmonika im offenen Etui */
  {
    const b = GB[1], x = RG.x0 + 46;
    let t = `<path d="M${X(x - 6)} ${Y(b)} L${X(x + 6)} ${Y(b)} L${X(x + 6)} ${Y(b - 2.4)} L${X(x - 6)} ${Y(b - 2.4)} Z" fill="#1d3f7a"/><path d="M${X(x - 6)} ${Y(b - 2.4)} L${X(x + 6)} ${Y(b - 2.4)} L${X(x + 5)} ${Y(b - 7.4)} L${X(x - 5)} ${Y(b - 7.4)} Z" fill="#2f5d8f"/>`;
    t += `<rect x="${X(x - 4.6)}" y="${Y(b - 2.8)}" width="9.2" height="2" rx=".3" fill="${SILBER}"/>`;
    for (let i = 0; i < 10; i++) t += `<rect x="${X(x - 4.2 + i * 0.9)}" y="${Y(b - 2.1)}" width=".5" height=".6" fill="#2a2d31"/>`;
    k += t;
    u("mundharmonika", "die Mundharmonika", "MUND-har-mo-ni-ka", "l'armonica a bocca", "ar-MO-ni-ca a BOC-ca", "harmonica", x - 7, x + 7, b - 9, b);
  }
  /* Boden 2: Triangel an einem kleinen Galgen */
  {
    const b = GB[1], x = RG.x0 + 66;
    let t = `<path d="M${X(x - 4)} ${Y(b)} h8 M${X(x - 3)} ${Y(b)} v-18 h7" stroke="#2a2d31" stroke-width=".6" fill="none"/>`;
    t += `<line x1="${X(x + 3)}" y1="${Y(b - 18)}" x2="${X(x + 3)}" y2="${Y(b - 15.6)}" stroke="#c0392b" stroke-width=".3"/>`;
    t += `<path d="M${X(x + 3)} ${Y(b - 15.6)} L${X(x + 7.6)} ${Y(b - 6.6)} L${X(x - 1.4)} ${Y(b - 6.6)} L${X(x + 2.2)} ${Y(b - 14)}" stroke="${SILBER}" stroke-width=".7" fill="none" stroke-linejoin="round"/>`;
    t += `<line x1="${X(x + 9)}" y1="${Y(b - 2)}" x2="${X(x + 10)}" y2="${Y(b - 10)}" stroke="${SILBER}" stroke-width=".45"/>`;
    k += t;
    u("triangel", "der Triangel", "TRI-an-gel", "il triangolo", "tri-AN-go-lo", "triangle", x - 4, x + 11, b - 19, b, "Der Triangel ist ein Dreieck aus Metall. Man sagt auch „die Triangel“.");
  }
  S.teil({ id: "regal", de: "das Regal", syl: "re-GAL", it: "lo scaffale", itSyl: "scaf-FA-le", en: "shelf", x: cx, y: RG.y1, steht: true, kunst: k,
    zoom: { x: RG.x0 - 14, y: 22, w: 114, h: 76 }, unter,
    tipp: "Im Regal liegen die Blasinstrumente – man spielt sie mit dem Atem." });
}

/* =====================================================================
   7 — DAS SCHLAGZEUG (auf einem Podest an der Rückwand rechts)
   ===================================================================== */
{
  const s = 40;          // Einheiten je Meter an der Wand
  let k = `<rect x="-36" y="-14" width="72" height="14" fill="${S.lg("podest", [[0, "#2a2d31"], [1, "#16181b"]])}"/><rect x="-36" y="-14" width="72" height="1.4" fill="#4a4e54"/>`;
  const P = -14;         // Podestoberkante
  const kessel = S.lg("kessel", [[0, "#2f6fb8"], [0.5, "#1d4f8f"], [1, "#0f2f5a"]], 0, 0, 1, 0);
  /* Becken auf Ständern: Crash links, Ride rechts, Hi-Hat ganz links */
  const becken = (x, y, rx, a) => `<line x1="${x}" y1="${y}" x2="${x}" y2="${P}" stroke="${CHROM}" stroke-width=".6"/><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${r(rx * 0.18)}" fill="${S.lg("becken", [[0, "#fff1b0"], [0.5, "#d8a838"], [1, "#a8781a"]], 0, 0, 1, 0)}" transform="rotate(${a} ${x} ${y})"/>`;
  k += becken(-22, P - 46, 9, -10) + becken(22, P - 42, 10, 8);
  k += `<line x1="-30" y1="${P - 30}" x2="-30" y2="${P}" stroke="${CHROM}" stroke-width=".6"/><ellipse cx="-30" cy="${P - 30}" rx="6" ry="1" fill="#d8a838"/><ellipse cx="-30" cy="${P - 31.2}" rx="6" ry="1" fill="#e8c25a"/>`;
  /* Hängetoms */
  for (const [x, rr] of [[-8, 6], [8, 6.6]]) k += `<rect x="${x - rr}" y="${P - 34}" width="${rr * 2}" height="9" rx="1" fill="${kessel}"/><ellipse cx="${x}" cy="${P - 34}" rx="${rr}" ry="1.4" fill="#f4f1ea"/><rect x="${x - rr}" y="${P - 26.4}" width="${rr * 2}" height=".8" fill="${CHROM}"/>`;
  /* Bassdrum mit Fell vorne */
  k += `<circle cx="0" cy="${P - 11.2}" r="11.2" fill="${kessel}"/><circle cx="0" cy="${P - 11.2}" r="9.8" fill="${S.rg("fell", [[0, "#ffffff"], [1, "#e6e1d6"]])}"/>`;
  k += `<circle cx="0" cy="${P - 11.2}" r="11.2" fill="none" stroke="${CHROM}" stroke-width=".8"/>`;
  k += `<text x="0" y="${P - 9.6}" font-size="4" text-anchor="middle" fill="#1d4f8f" font-family="Georgia,serif" font-weight="bold" font-style="italic">Beat</text>`;
  for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5; k += `<rect x="${r(Math.cos(a) * 10.6 - 0.4)}" y="${r(P - 11.2 + Math.sin(a) * 10.6 - 0.4)}" width=".8" height=".8" fill="${CHROM}"/>`; }
  /* Snare links, Standtom rechts */
  k += `<rect x="-24" y="${P - 20}" width="12" height="5" rx=".8" fill="${SILBER}"/><ellipse cx="-18" cy="${P - 20}" rx="6" ry="1.2" fill="#f4f1ea"/><path d="M-21 ${P - 15} L-24 ${P} M-15 ${P - 15} L-12 ${P}" stroke="${CHROM}" stroke-width=".5"/>`;
  k += `<rect x="12" y="${P - 20}" width="15" height="14" rx="1" fill="${kessel}"/><ellipse cx="19.5" cy="${P - 20}" rx="7.5" ry="1.4" fill="#f4f1ea"/><path d="M13 ${P - 6} v6 M26 ${P - 6} v6" stroke="${CHROM}" stroke-width=".6"/>`;
  /* Hocker dahinter, Sticks */
  k += `<line x1="-5" y1="${P - 33}" x2="4" y2="${P - 38}" stroke="#e8c890" stroke-width=".6"/><line x1="-3" y1="${P - 32}" x2="6" y2="${P - 36}" stroke="#e8c890" stroke-width=".6"/>`;
  k += preis(30, -10, "1290 €");
  S.teil({ id: "schlagzeug", de: "das Schlagzeug", syl: "SCHLAG-zeug", it: "la batteria", itSyl: "bat-te-RI-a", en: "drum kit", x: 278, y: 132, steht: true, kunst: k,
    tipp: "Zum Schlagzeug gehören Trommeln und Becken." });
}

/* =====================================================================
   8 — DAS CELLO (auf einem Ständer, ≈ 51 je Meter)
   ===================================================================== */
{
  const y = 150;
  let k = schatten(0, 0, 9, 1, .3);
  k += `<path d="M-6 0 L0 -6 L6 0" stroke="#2a2d31" stroke-width=".8" fill="none"/><line x1="0" y1="-6" x2="0" y2="-28" stroke="#2a2d31" stroke-width=".8"/>`;
  k += `<line x1="0" y1="0" x2="0" y2="-4" stroke="${CHROM}" stroke-width=".6"/>`;
  const sk = r(1.22 * sAuf(y) / 24 * 100) / 100;       // Geigenform (Länge 24) auf 1,22 m
  k += `<g transform="translate(0 ${r(-24 * sk - 3.6)}) scale(${sk})">${geige(1)}</g>`;
  S.teil({ id: "cello", de: "das Cello", syl: "CEL-lo", it: "il violoncello", itSyl: "vio-lon-CEL-lo", en: "cello", x: 236, y, steht: true, kunst: k,
    tipp: "Das Cello ist viel größer als die Geige. Man spielt es im Sitzen." });
}

/* =====================================================================
   9 — DIE HARFE (Hakenharfe, ≈ 67 je Meter, 1,2 m hoch)
   ===================================================================== */
{
  const y = 176, s = sAuf(y);
  const H = 1.2 * s;
  let k = schatten(4, 0, 22, 1.4, .3);
  /* Resonanzkörper schräg von unten links nach oben rechts */
  k += `<path d="M-6 0 L2 0 L24 ${r(-H * 0.78)} L18 ${r(-H * 0.8)} Z" fill="${S.lg("harfenkorpus", [[0, "#c8853a"], [1, "#8a4a1c"]], 0, 0, 1, 0)}"/>`;
  /* Säule links, Hals oben (geschwungen) */
  k += `<rect x="-14" y="${r(-H)}" width="4" height="${r(H)}" rx="1.4" fill="${S.lg("saeule", [[0, "#b8702a"], [0.5, "#e0a050"], [1, "#9a5a1c"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-13 ${r(-H + 2)} Q-6 ${r(-H - 6)} 4 ${r(-H + 4)} Q12 ${r(-H + 12)} 22 ${r(-H * 0.82)} L20 ${r(-H * 0.76)} Q10 ${r(-H + 18)} 2 ${r(-H + 9)} Q-6 ${r(-H)} -12 ${r(-H + 6)} Z" fill="${S.lg("hals", [[0, "#e0a050"], [1, "#9a5a1c"]])}"/>`;
  /* Saiten (rot = C, blau = F) */
  for (let i = 0; i < 18; i++) {
    const t = i / 17, xs = -8 + t * 28;
    const yOben = -H + 6 + Math.sin(t * Math.PI) * -2 + t * (H * 0.2) + (t < 0.4 ? t * 6 : 2.4);
    const yUnten = r(-(xs + 6) * (H * 0.78) / 26 + 0.4);
    if (yUnten < yOben + 2) continue;
    k += `<line x1="${r(xs)}" y1="${r(yOben)}" x2="${r(xs)}" y2="${yUnten}" stroke="${i % 7 === 0 ? "#c0392b" : i % 7 === 3 ? "#2f6fb8" : "#f4ead0"}" stroke-width=".3"/>`;
  }
  k += `<rect x="-16" y="-2" width="20" height="2" rx=".6" fill="#7a3f14"/>`;
  k += `<path d="M-13 ${r(-H + 4)} L-13 -4" stroke="#fff" stroke-width=".6" opacity=".3"/>`;
  S.teil({ id: "harfe", de: "die Harfe", syl: "HAR-fe", it: "l'arpa", itSyl: "AR-pa", en: "harp", x: 186, y, steht: true, kunst: k,
    tipp: "Die Harfe zupft man mit den Fingern. Die roten Saiten zeigen den Ton C." });
}

/* =====================================================================
   10 — DER FLÜGEL (vorne links, Deckel offen) und 11 — DIE NOTEN
   ===================================================================== */
{
  const y = 190, s = sAuf(y);
  const L = 1.5 * s, K = 1.0 * s, Kd = 0.3 * s;        // Länge, Höhe bis Deckel, Zargenhöhe
  const x0 = -L / 2, x1 = L / 2, top = -K;
  let k = schatten(0, 0, L / 2 + 6, 2.4, .35);
  /* Beine und Lyra mit Pedalen */
  for (const x of [x0 + 8, x1 - 10]) k += `<path d="M${r(x - 3)} ${r(top + Kd)} L${r(x + 3)} ${r(top + Kd)} L${r(x + 2)} -2 L${r(x - 2)} -2 Z" fill="${LACK}"/><rect x="${r(x - 2.6)}" y="-2.4" width="5.2" height="2.4" rx="1" fill="${MESSING}"/>`;
  k += `<path d="M${r(x0 + 22)} ${r(top + Kd)} L${r(x0 + 30)} ${r(top + Kd)} L${r(x0 + 28)} -4 L${r(x0 + 24)} -4 Z" fill="${LACK}"/>`;
  for (const dx of [23.4, 26, 28.6]) k += `<rect x="${r(x0 + dx - 0.9)}" y="-4.6" width="1.8" height="1.2" rx=".4" fill="${MESSING}"/>`;
  /* Zarge (Korpus) */
  k += `<path d="M${r(x0)} ${r(top)} L${r(x1 - 14)} ${r(top)} Q${r(x1)} ${r(top)} ${r(x1)} ${r(top + Kd * 0.6)} L${r(x1)} ${r(top + Kd)} L${r(x0)} ${r(top + Kd)} Z" fill="${LACK}"/>`;
  k += `<path d="M${r(x0 + 2)} ${r(top + 2)} L${r(x1 - 16)} ${r(top + 2)}" stroke="#fff" stroke-width=".8" opacity=".15"/>`;
  /* Tastatur vorne links (Tastenklappe offen) */
  k += `<rect x="${r(x0 - 6)}" y="${r(top + 3)}" width="8" height="${r(Kd - 6)}" fill="#16181b"/>`;
  k += `<rect x="${r(x0 - 6)}" y="${r(top + 1)}" width="8" height="2.4" fill="#f6f2e8"/><rect x="${r(x0 - 6)}" y="${r(top + 1)}" width="8" height="1" fill="#111"/>`;
  /* Notenpult */
  k += `<path d="M${r(x0 + 6)} ${r(top)} L${r(x0 + 10)} ${r(top - 18)} L${r(x0 + 34)} ${r(top - 18)} L${r(x0 + 30)} ${r(top)} Z" fill="#1d1f22"/>`;
  /* Deckel, an der Stütze geöffnet (zeigt die Flügelform) */
  k += `<path d="M${r(x0 + 30)} ${r(top)} Q${r(x0 + 50)} ${r(top - 44)} ${r(x1 - 22)} ${r(top - 40)} Q${r(x1 - 4)} ${r(top - 36)} ${r(x1)} ${r(top - 6)} L${r(x1 - 4)} ${r(top)} Z" fill="${S.lg("deckel", [[0, "#3a3d42"], [0.6, "#16181b"], [1, "#0b0c0e"]], 0, 0, 1, 1)}"/>`;
  k += `<path d="M${r(x0 + 34)} ${r(top - 4)} Q${r(x0 + 52)} ${r(top - 40)} ${r(x1 - 22)} ${r(top - 37)}" stroke="#fff" stroke-width="1" opacity=".18" fill="none"/>`;
  k += `<line x1="${r(x1 - 30)}" y1="${r(top)}" x2="${r(x1 - 26)}" y2="${r(top - 34)}" stroke="#2a2d31" stroke-width="1"/>`;
  /* Saiten und Rahmen im Inneren (golden) unter dem Deckel */
  k += `<path d="M${r(x0 + 32)} ${r(top - 1)} L${r(x1 - 6)} ${r(top - 1)}" stroke="#d8a838" stroke-width="1.6"/>`;
  k += `<text x="${r(x0 + 50)}" y="${r(top + Kd - 6)}" font-size="3.4" fill="#d8b04a" font-family="Georgia,serif" letter-spacing=".5">SCHÄFER &amp; SÖHNE</text>`;
  k += preis(x1 - 10, top + Kd + 3, "18.900 €");
  S.teil({ id: "fluegel", de: "der Flügel", syl: "FLÜ-gel", it: "il pianoforte a coda", itSyl: "pia-no-FOR-te a CO-da", en: "grand piano", x: 62, y, steht: true, kunst: k,
    tipp: "Der Flügel heißt so, weil seine Form wie ein Vogelflügel aussieht." });
  /* DIE NOTEN auf dem Pult */
  const nx = 62 + x0 + 20, ny = y + top - 2;
  let n = `<path d="M-10 0 L-7 -14 L1 -14 L-2 0 Z" fill="#fbfaf5" stroke="#cfc8b8" stroke-width=".2"/><path d="M-2 0 L1 -14 L9 -14 L6 0 Z" fill="#f6f4ec" stroke="#cfc8b8" stroke-width=".2"/>`;
  for (let i = 0; i < 4; i++) for (const [a, b2] of [[-9, -2.6], [-1, 5.4]]) n += `<path d="M${r(a + 0.6 + (3 - i) * 0.0 + i * 0)} ${r(-2.6 - i * 3)} L${r(b2 + 0.6 + i * 0)} ${r(-2.6 - i * 3)}" stroke="#555" stroke-width=".12" transform="translate(${r(i * 0.62)} 0)"/>`;
  for (let i = 0; i < 9; i++) n += `<circle cx="${r(-7.6 + i * 1.6 + (i > 4 ? 1.2 : 0))}" cy="${r(-3.4 - (i % 4) * 2.6)}" r=".4" fill="#222"/>`;
  S.teil({ oben: true, id: "noten", de: "die Noten", syl: "NO-ten", it: "lo spartito", itSyl: "spar-TI-to", en: "sheet music", x: nx, y: ny, kunst: n,
    tipp: "Auf den Noten steht, was man spielen soll." });
}

/* =====================================================================
   12 — DIE TROMMEL (Djembe, vorne Mitte)
   ===================================================================== */
{
  const y = 197, s = sAuf(y);
  const H = 0.6 * s, R = 0.17 * s;
  let k = schatten(0, 0, R + 4, 1.6, .35);
  k += `<path d="M${r(-R)} ${r(-H)} Q${r(-R)} ${r(-H * 0.55)} ${r(-R * 0.4)} ${r(-H * 0.45)} L${r(-R * 0.5)} 0 L${r(R * 0.5)} 0 L${r(R * 0.4)} ${r(-H * 0.45)} Q${r(R)} ${r(-H * 0.55)} ${r(R)} ${r(-H)} Z" fill="${S.lg("djembe", [[0, "#7a3f14"], [0.5, "#b8702a"], [1, "#6b3410"]], 0, 0, 1, 0)}"/>`;
  /* Seilspannung (Zickzack) */
  let z = `M${r(-R)} ${r(-H + 3)}`;
  for (let i = 0; i <= 10; i++) z += ` L${r(-R * 0.9 + i * R * 0.18)} ${r(i % 2 ? -H * 0.5 : -H + 3)}`;
  k += `<path d="${z}" stroke="#e8d8b0" stroke-width=".7" fill="none"/>`;
  k += `<rect x="${r(-R)}" y="${r(-H * 0.52)}" width="${r(R * 2)}" height="1.2" fill="#e8d8b0"/>`;
  k += `<ellipse cx="0" cy="${r(-H)}" rx="${r(R)}" ry="${r(R * 0.22)}" fill="${S.rg("ziegenfell", [[0, "#f6ead0"], [1, "#d8c49a"]])}" stroke="#a8743f" stroke-width=".5"/>`;
  k += `<path d="M${r(-R * 0.7)} ${r(-H * 0.9)} Q${r(-R * 0.8)} ${r(-H * 0.6)} ${r(-R * 0.3)} ${r(-H * 0.48)}" stroke="#fff" stroke-width=".8" opacity=".2" fill="none"/>`;
  S.teil({ id: "trommel", de: "die Trommel", syl: "TROM-mel", it: "il tamburo", itSyl: "tam-BU-ro", en: "drum", x: 140, y, steht: true, kunst: k,
    tipp: "Diese Trommel heißt Djembe und kommt aus Westafrika." });
}

/* =====================================================================
   13 — DAS XYLOFON (Holzplatten auf einem Ständer, vorne)
   ===================================================================== */
{
  const y = 192, s = sAuf(y);
  const W = 0.62 * s, Hst = 0.5 * s;
  let k = schatten(0, 0, W / 2 + 3, 1.6, .32);
  /* Ständer */
  k += `<path d="M${r(-W / 2 + 4)} 0 L${r(-W / 2 + 8)} ${r(-Hst)} M${r(W / 2 - 4)} 0 L${r(W / 2 - 8)} ${r(-Hst)} M${r(-W / 2 + 8)} 0 L${r(-W / 2 + 4)} ${r(-Hst)} M${r(W / 2 - 8)} 0 L${r(W / 2 - 4)} ${r(-Hst)}" stroke="#4e2f17" stroke-width="1.2"/>`;
  /* Rahmen (trapezförmig, von leicht oben) */
  k += `<path d="M${r(-W / 2)} ${r(-Hst)} L${r(W / 2)} ${r(-Hst + 3)} L${r(W / 2)} ${r(-Hst - 3)} L${r(-W / 2)} ${r(-Hst - 9)} Z" fill="#6b4322"/>`;
  /* Klangplatten aus Holz (Palisander), links lang, rechts kurz */
  const n = 13;
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1), x = -W / 2 + 2 + t * (W - 6), h = 9 - t * 4.4, yc = -Hst - 3 + t * 2.4;
    k += `<rect x="${r(x)}" y="${r(yc - h / 2)}" width="${r((W - 6) / n - 0.5)}" height="${r(h)}" rx=".4" fill="${S.lg("platte", [[0, "#c88a52"], [1, "#8a4a22"]], 0, 0, 1, 0)}"/>`;
    k += `<circle cx="${r(x + (W - 6) / n / 2 - 0.25)}" cy="${r(yc - h / 2 + 1)}" r=".35" fill="#2a160a"/><circle cx="${r(x + (W - 6) / n / 2 - 0.25)}" cy="${r(yc + h / 2 - 1)}" r=".35" fill="#2a160a"/>`;
  }
  /* Schlägel */
  k += `<line x1="${r(W / 2 - 14)}" y1="${r(-Hst - 1)}" x2="${r(W / 2 + 4)}" y2="${r(-Hst + 4)}" stroke="#e8c890" stroke-width=".7"/><circle cx="${r(W / 2 - 14)}" cy="${r(-Hst - 1)}" r="1.6" fill="#c0392b"/>`;
  k += `<line x1="${r(W / 2 - 18)}" y1="${r(-Hst + 1)}" x2="${r(W / 2 + 2)}" y2="${r(-Hst + 6)}" stroke="#e8c890" stroke-width=".7"/><circle cx="${r(W / 2 - 18)}" cy="${r(-Hst + 1)}" r="1.6" fill="#c0392b"/>`;
  S.teil({ id: "xylofon", de: "das Xylofon", syl: "XY-lo-fon", it: "lo xilofono", itSyl: "xi-LO-fo-no", en: "xylophone", x: 214, y, steht: true, kunst: k,
    tipp: "Beim Xylofon schlägt man mit Schlägeln auf Platten aus Holz." });
}

/* =====================================================================
   14 — DAS AKKORDEON (auf einem Hocker, vorne rechts)
   ===================================================================== */
{
  const y = 194, s = sAuf(y);
  const Hh = 0.5 * s;
  let k = schatten(0, 0, 16, 1.6, .32);
  k += `<path d="M-12 0 L-10 ${r(-Hh)} M12 0 L10 ${r(-Hh)} M-6 0 L-6 ${r(-Hh)} M6 0 L6 ${r(-Hh)}" stroke="#2a1a10" stroke-width="1.4"/>`;
  k += `<rect x="-13" y="${r(-Hh - 3)}" width="26" height="3.4" rx="1.4" fill="${S.lg("hocker", [[0, "#8a5a30"], [1, "#5a3518"]])}"/>`;
  const B0 = -Hh - 3, Ha = 0.42 * s;
  /* Diskantteil (links, Klaviertasten), Balg (Mitte), Bassteil (rechts, Knöpfe) */
  k += `<rect x="-15" y="${r(B0 - Ha)}" width="9" height="${r(Ha)}" rx="1" fill="${S.lg("akkrot", [[0, "#e8343a"], [1, "#8a0f14"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-13.4" y="${r(B0 - Ha + 2)}" width="5" height="${r(Ha - 4)}" fill="#f6f2e8"/>`;
  for (let i = 0; i < 9; i++) k += `<line x1="-13.4" y1="${r(B0 - Ha + 2 + i * (Ha - 4) / 9)}" x2="-8.4" y2="${r(B0 - Ha + 2 + i * (Ha - 4) / 9)}" stroke="#b9b2a2" stroke-width=".15"/>`;
  for (let i = 0; i < 9; i++) if (i % 7 !== 2 && i % 7 !== 6) k += `<rect x="-13.4" y="${r(B0 - Ha + 2.7 + i * (Ha - 4) / 9)}" width="3" height="1.1" fill="#111"/>`;
  for (let i = 0; i < 12; i++) k += `<rect x="${r(-6 + i)}" y="${r(B0 - Ha + 0.6)}" width=".9" height="${r(Ha - 1.2)}" fill="${i % 2 ? "#2a2d31" : "#f4f1ea"}"/>`;
  k += `<rect x="6" y="${r(B0 - Ha)}" width="9" height="${r(Ha)}" rx="1" fill="${S.lg("akkrot", [[0, "#e8343a"], [1, "#8a0f14"]], 0, 0, 1, 0)}"/>`;
  for (let i = 0; i < 5; i++) for (let j = 0; j < 3; j++) k += `<circle cx="${8.4 + j * 2}" cy="${r(B0 - Ha + 4 + i * 4.6)}" r=".6" fill="#f4f1ea"/>`;
  k += `<rect x="-15" y="${r(B0 - Ha)}" width="9" height="1.4" fill="${CHROM}"/><rect x="6" y="${r(B0 - Ha)}" width="9" height="1.4" fill="${CHROM}"/>`;
  k += `<path d="M-15 ${r(B0 - Ha + 4)} Q-20 ${r(B0 - Ha * 0.5)} -15 ${r(B0 - 4)}" stroke="#2a1a10" stroke-width="1" fill="none"/>`;
  S.teil({ id: "akkordeon", de: "das Akkordeon", syl: "Ak-KOR-de-on", it: "la fisarmonica", itSyl: "fi-sar-MO-ni-ca", en: "accordion", x: 286, y, steht: true, kunst: k,
    tipp: "Beim Akkordeon zieht und drückt man den Balg – so kommt Luft hinein." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/instrumente.js"));
console.log(aus);
