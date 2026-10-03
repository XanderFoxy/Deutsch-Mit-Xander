#!/usr/bin/env node
/* =====================================================================
   IN DER KIRCHE (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   XANDER (Funk 263/286): jeder Ort authentisch wie das echte Vorbild,
   alles logisch platziert, jedes Ding einzeln antippbar, nichts blockiert.

   RECHERCHE (Eisenacher Regulativ / EKD-Kirchbautag zur Ordnung des
   Kirchenraums; „Was steht auf dem Altar einer evangelischen Kirche“;
   Kirchenbank mit Ablage für Gesangbuch und Bibel):
   - Blick durch den MITTELGANG (roter Läufer) nach Osten zum ALTARRAUM,
     der drei Stufen höher liegt. Hinter dem Altar die Apsis mit drei
     bunten KIRCHENFENSTERN (Bleiglas).
   - Auf dem ALTAR: Altartuch und farbiges Antependium (grün in der
     Trinitatiszeit), das KREUZ, zwei ALTARKERZEN, die aufgeschlagene
     BIBEL, ein BLUMENSTRAUSS.
   - Die KANZEL steht am Pfeiler des Chorbogens zur Gemeinde hin, mit
     Treppe und SCHALLDECKEL darüber.
   - Der TAUFSTEIN steht vor dem Altarraum, vor den Augen der Gemeinde.
   - Die LIEDTAFEL hängt gut sichtbar vorn und zeigt die Liednummern aus
     dem Evangelischen Gesangbuch.
   - KIRCHENBÄNKE links und rechts vom Mittelgang; an der Rückseite jeder
     Bank eine Ablage für die GESANGBÜCHER.
   - Im Seitenschiff: ORGEL auf der EMPORE, darunter die Tür zur SAKRISTEI;
     links der KERZENSTÄNDER mit Opferlichtern und der OPFERSTOCK.
   - Die PFARRERIN im schwarzen Talar mit weißem Beffchen.
   Maßstab: Augenhöhe y = 92, Brennweite 270 → Einheiten je Meter =
   270 / Entfernung. Chorbogen 12 m entfernt ≈ 22,5 je Meter, hinterste
   Bank (4,6 m) ≈ 59 je Meter.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "kirche_innen", titel: "In der Kirche", emoji: "⛪", thema: "Kultur", kuerzel: "b13b", fassung: 852 });
const rnd = zufall(1517);
const r = B.r;

const VX = 160, VY = 92, F = 270, AUGE = 1.6;
const sk = (d) => F / d;
const PX = (xw, d) => VX + xw * F / d;                 /* Weltmeter → Bild */
const PY = (h, d) => VY + (AUGE - h) * F / d;
const P = (xw, h, d) => `${r(PX(xw, d))} ${r(PY(h, d))}`;
const OST = 12;          /* Ostwand / Chorbogen */
const CHOR_H = 0.45;     /* Altarraum drei Stufen höher */

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const PUTZ = S.lg("putz", [[0, "#f6f1e6"], [1, "#e6dccb"]]);
const SANDSTEIN = S.lg("sandstein", [[0, "#d9b98f"], [1, "#b8946a"]], 0, 0, 1, 0);
const EICHE = S.lg("eiche", [[0, "#8a5a32"], [0.5, "#74481f"], [1, "#5c3816"]]);
const EICHE_V = S.lg("eichev", [[0, "#6a4220"], [0.5, "#8a5a32"], [1, "#5c3816"]], 0, 0, 1, 0);
const GOLD = S.lg("gold", [[0, "#f7e39a"], [0.4, "#d4a93c"], [0.7, "#a8791e"], [1, "#e8c45c"]], 0, 0, 1, 1);
const MESSING = S.lg("messing", [[0, "#f3dc8c"], [0.45, "#c9a13f"], [0.6, "#a8822a"], [1, "#e6c66a"]], 0, 0, 1, 0);
const KERZE = S.lg("kerze", [[0, "#fffdf3"], [0.6, "#f4ecd6"], [1, "#d9cdae"]], 0, 0, 1, 0);
const FLAMME = S.rg("flamme", [[0, "#fffbe0"], [0.45, "#ffd46b"], [1, "#ff9a2a", 0]], 0.5, 0.6, 0.6);

/* =====================================================================
   KULISSE — Ostwand mit Chorbogen, Apsis, Seitenschiffe, Boden, Bänke
   ===================================================================== */
const yO = PY(0, OST);                         /* Fußboden an der Ostwand (128) */
/* Ostwand (Putz) über die ganze Breite */
S.hinten(`<rect x="0" y="0" width="320" height="${r(yO)}" fill="${PUTZ}"/>`);
S.hinten(`<rect x="0" y="0" width="320" height="${r(yO)}" fill="${S.lg("ostlicht", [[0, "#fff8e6", 0.0], [0.5, "#fff8e6", 0.25], [1, "#c8b89a", 0.2]])}"/>`);
/* Apsis hinter dem Chorbogen (16 m), mit Gewölbe und Fenstern als Teil */
const AB = { l: PX(-2.4, OST), rr: PX(2.4, OST), kampf: PY(5.2, OST) };
const ARAD = (AB.rr - AB.l) / 2;
{
  const dA = 16, yA = PY(CHOR_H, dA);
  let a = `<rect x="${r(AB.l)}" y="0" width="${r(AB.rr - AB.l)}" height="${r(yO)}" fill="${S.lg("apsis", [[0, "#efe4cf"], [0.6, "#e7d8bd"], [1, "#d8c4a2"]], 0, 0, 1, 0)}"/>`;
  /* Gewölbekappen der Apsis */
  a += `<path d="M${r(AB.l)} 0 L${r(AB.l)} 12 Q160 -2 ${r(AB.rr)} 12 L${r(AB.rr)} 0 Z" fill="#e3d4b8"/>`;
  /* Chorboden: Teppich und Steinplatten */
  a += `<path d="M${r(AB.l)} ${r(yA)} L${r(AB.rr)} ${r(yA)} L${r(AB.rr)} ${r(PY(CHOR_H, OST))} L${r(AB.l)} ${r(PY(CHOR_H, OST))} Z" fill="${S.lg("chorboden", [[0, "#a99579"], [1, "#c2ad8c"]])}"/>`;
  a += `<path d="M${P(-1.6, CHOR_H, dA)} L${P(1.6, CHOR_H, dA)} L${P(1.6, CHOR_H, OST)} L${P(-1.6, CHOR_H, OST)} Z" fill="#7e1f27" opacity=".85"/>`;
  a += `<rect x="${r(AB.l)}" y="${r(yA - 1)}" width="${r(AB.rr - AB.l)}" height="1" fill="#8a7658"/>`;
  S.hinten(a);
}
/* Chorbogen: Sandsteinlaibung (Rundbogen, oben angeschnitten) */
{
  const l = AB.l, rr = AB.rr, k = AB.kampf;
  let c = `<path d="M${r(l - 8)} ${r(yO)} L${r(l - 8)} ${r(k)} A${r(ARAD + 8)} ${r(ARAD + 8)} 0 0 1 ${r(rr + 8)} ${r(k)} L${r(rr + 8)} ${r(yO)} L${r(rr)} ${r(yO)} L${r(rr)} ${r(k)} A${r(ARAD)} ${r(ARAD)} 0 0 0 ${r(l)} ${r(k)} L${r(l)} ${r(yO)} Z" fill="${SANDSTEIN}"/>`;
  c += `<rect x="${r(l - 9.5)}" y="${r(k - 2)}" width="11" height="3" fill="#c8a477"/><rect x="${r(rr - 1.5)}" y="${r(k - 2)}" width="11" height="3" fill="#c8a477"/>`;
  for (let y = k + 9; y < yO; y += 9) c += `<line x1="${r(l - 8)}" y1="${r(y)}" x2="${r(l)}" y2="${r(y)}" stroke="#a07f58" stroke-width=".35"/><line x1="${r(rr)}" y1="${r(y)}" x2="${r(rr + 8)}" y2="${r(y)}" stroke="#a07f58" stroke-width=".35"/>`;
  S.hinten(c);
}
/* Seitenschiffe: linkes Seitenschiff (Wand an der Ostseite in Licht), rechtes mit Empore */
S.hinten(`<rect x="0" y="0" width="${r(PX(-4.5, OST))}" height="${r(yO)}" fill="${S.lg("ssl", [[0, "#efe7d8"], [1, "#ddd0b9"]], 0, 0, 1, 0)}"/>`);
S.hinten(`<rect x="${r(PX(4.5, OST))}" y="0" width="${r(320 - PX(4.5, OST))}" height="${r(yO)}" fill="${S.lg("ssr", [[0, "#ddd0b9"], [1, "#efe7d8"]], 0, 0, 1, 0)}"/>`);
/* Pfeiler zwischen Mittelschiff und Seitenschiffen (an der Ostwand) */
for (const xw of [-4.5, 4.5]) {
  const x = PX(xw, OST);
  S.hinten(`<rect x="${r(x - 6)}" y="0" width="12" height="${r(yO)}" fill="${SANDSTEIN}"/><rect x="${r(x - 6)}" y="0" width="1.4" height="${r(yO)}" fill="#ecd3ac"/><rect x="${r(x - 7.5)}" y="${r(yO - 4)}" width="15" height="4" fill="#b08c62"/>`);
}
/* Epitaph im linken Seitenschiff (Steintafel) */
S.hinten(`<rect x="8" y="30" width="26" height="30" rx="1" fill="#cbbfa8"/><path d="M8 30 L21 22 L34 30 Z" fill="#bcae94"/><rect x="11" y="34" width="20" height="21" fill="#e2d8c4"/>` + [0, 1, 2, 3, 4, 5].map((i) => `<rect x="13" y="${37 + i * 3}" width="${16 - (i % 2) * 4}" height=".6" fill="#8d7f66"/>`).join(""));
/* Fußboden: Sandsteinplatten in Flucht, dazu Holzpodeste unter den Bänken */
{
  let f = `<rect x="0" y="${r(yO)}" width="320" height="${r(200 - yO)}" fill="${S.lg("boden", [[0, "#c9b597"], [1, "#b39c7c"]])}"/>`;
  for (let xw = -8; xw <= 8; xw += 1) f += `<line x1="${r(PX(xw, OST))}" y1="${r(yO)}" x2="${r(PX(xw, 3.2))}" y2="${r(PY(0, 3.2))}" stroke="#8f7a5c" stroke-width=".35" opacity=".6"/>`;
  for (let d = 11; d > 3; d -= 1) f += `<line x1="0" y1="${r(PY(0, d))}" x2="320" y2="${r(PY(0, d))}" stroke="#8f7a5c" stroke-width="${r(0.2 + 1.6 / d)}" opacity=".55"/>`;
  /* Holzpodeste (Bankreihen) links und rechts */
  f += `<path d="M${P(-4.5, 0, 11.2)} L${P(-1.05, 0, 11.2)} L${P(-1.05, 0, 3.2)} L${P(-4.5, 0, 3.2)} Z" fill="#7a5634"/><path d="M${P(1.05, 0, 11.2)} L${P(4.5, 0, 11.2)} L${P(4.5, 0, 3.2)} L${P(1.05, 0, 3.2)} Z" fill="#7a5634"/>`;
  f += `<rect x="0" y="${r(yO)}" width="320" height="${r(200 - yO)}" fill="${S.lg("bodenlicht", [[0, "#2a1d10", 0.12], [0.5, "#2a1d10", 0], [1, "#000", 0.08]])}"/>`;
  /* Stufen zum Altarraum */
  for (let i = 3; i >= 1; i--) {
    const d = OST - (3 - i) * 0.32 - 0.02, h = i * 0.15;
    f += `<path d="M${P(-2.4, h, d)} L${P(2.4, h, d)} L${P(2.4, h - 0.15, d)} L${P(-2.4, h - 0.15, d)} Z" fill="${i % 2 ? "#cdb38c" : "#c2a77f"}"/><path d="M${P(-2.4, h, d)} L${P(2.4, h, d)}" stroke="#e8d3ad" stroke-width=".5"/>`;
    f += `<path d="M${P(-2.4, h, d)} L${P(2.4, h, d)} L${P(2.4, h, d + 0.32)} L${P(-2.4, h, d + 0.32)} Z" fill="#d8c3a0"/>`;
  }
  S.hinten(f);
}
/* Kirchenbänke (Rückseiten). Was hinter einer Bank steht, wird an ihrer
   Oberkante abgeschnitten (deck), damit die Kulissen-Bänke richtig davor liegen. */
const REIHEN = [9.5, 8.4, 7.3, 6.2, 5.1, 4.1];
const TEILBANK = { "-1_6.2": 1, "1_5.1": 1, "-1_4.1": 1 };
const bank = (seite, d, extra) => {
  const s = sk(d);
  let a = seite < 0 ? -4.0 : 1.05, b = seite < 0 ? -1.05 : 4.0;
  a = Math.max(a, (-3 - VX) / s); b = Math.min(b, (323 - VX) / s);
  const tief = 0.55, inn = seite < 0 ? b : a;
  let g = "";
  g += `<path d="M${P(a, 0.88, d)} L${P(b, 0.88, d)} L${P(b, 0.05, d)} L${P(a, 0.05, d)} Z" fill="${EICHE}"/>`;
  const n = Math.max(2, Math.round((b - a) / 0.85));
  for (let i = 0; i < n; i++) {
    const x0 = a + (b - a) * (i + 0.08) / n, x1 = a + (b - a) * (i + 0.92) / n;
    g += `<path d="M${P(x0, 0.78, d)} L${P(x1, 0.78, d)} L${P(x1, 0.38, d)} L${P(x0, 0.38, d)} Z" fill="#5d3a1a" opacity=".5"/>`;
  }
  g += `<path d="M${P(a, 0.9, d)} L${P(b, 0.9, d)} L${P(b, 0.83, d)} L${P(a, 0.83, d)} Z" fill="#a8774a"/>`;
  g += `<path d="M${P(a, 0.83, d)} L${P(b, 0.83, d)} L${P(b, 0.9, d)} L${P(a, 0.9, d)} Z" fill="#3e2510" opacity=".6"/>`;
  g += `<path d="M${P(a, 0.05, d)} L${P(b, 0.05, d)} L${P(b, 0, d)} L${P(a, 0, d)} Z" fill="#3e2510"/>`;
  /* Bankwange am Gang mit geschwungenem Kopf */
  if (Math.abs(inn) < 1.2) {
    g += `<path d="M${P(inn, 0, d)} L${P(inn, 0.94, d)} Q${P(inn, 1.08, d + tief * 0.35)} ${P(inn, 1.0, d + tief)} L${P(inn, 0, d + tief)} Z" fill="${EICHE_V}" stroke="#3e2510" stroke-width=".3"/>`;
    g += `<path d="M${P(inn, 0.2, d + 0.1)} L${P(inn, 0.74, d + 0.1)} L${P(inn, 0.74, d + tief - 0.1)} L${P(inn, 0.2, d + tief - 0.1)} Z" fill="none" stroke="#a1703f" stroke-width=".35"/>`;
  }
  if (extra) g += extra;
  return g;
};
const BAENKE = [];
for (const d of REIHEN) for (const sd of [-1, 1]) {
  const s = sk(d), a = sd < 0 ? -4.0 : 1.05, b = sd < 0 ? -1.05 : 4.0;
  BAENKE.push({ d, sd, x0: PX(a, d), x1: PX(b, d), top: PY(0.9, d) });
}
/* Sichtbarer Bereich eines Dings in d Metern: alles über den Oberkanten der Bänke davor */
let deckNr = 0;
const deck = (dDing, ox, oy) => {
  const vor = BAENKE.filter((p) => p.d < dDing - 0.005);
  const xs = new Set([-60, 380]);
  vor.forEach((p) => { xs.add(p.x0); xs.add(p.x1); });
  const arr = [...xs].sort((u, v) => u - v);
  let rects = "";
  for (let i = 0; i < arr.length - 1; i++) {
    const m = (arr[i] + arr[i + 1]) / 2;
    let top = 400;
    vor.forEach((p) => { if (m > p.x0 && m < p.x1) top = Math.min(top, p.top); });
    rects += `<rect x="${r(arr[i] - ox - 0.05)}" y="${r(-300 - oy)}" width="${r(arr[i + 1] - arr[i] + 0.1)}" height="${r(top + 300)}"/>`;
  }
  const id = S.id("deck" + (++deckNr));
  S.def(`<clipPath id="${id}">${rects}</clipPath>`);
  return `url(#${id})`;
};
{
  let k = "";
  for (const d of REIHEN) for (const sd of [-1, 1]) if (!TEILBANK[sd + "_" + d]) k += bank(sd, d);
  S.hinten(k);
}

/* =====================================================================
   1 — DIE KIRCHENFENSTER (Apsis, drei Lanzettfenster aus Bleiglas)
   ===================================================================== */
S.def(`<pattern id="${S.id("blei")}" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="4" fill="#2b5fa8"/><rect x=".25" y=".25" width="1.6" height="1.6" fill="#3f7fd0"/><rect x="2.15" y=".25" width="1.6" height="1.6" fill="#c9372c"/><rect x=".25" y="2.15" width="1.6" height="1.6" fill="#e8b23a"/><rect x="2.15" y="2.15" width="1.6" height="1.6" fill="#2f8f5a"/></pattern>`);
{
  const dA = 16, s = sk(dA), y0 = PY(CHOR_H + 2.0, dA), hF = 3.7 * s, wF = 0.95 * s;
  let k = "";
  for (const xw of [-1.55, 0, 1.55]) {
    const cx = PX(xw, dA) - VX, mitte = xw === 0;
    const hh = mitte ? hF + 6 : hF;
    const form = `M${r(cx - wF / 2)} 0 L${r(cx - wF / 2)} ${r(-hh + wF / 2)} Q${r(cx - wF / 2)} ${r(-hh - 1)} ${r(cx)} ${r(-hh - 3)} Q${r(cx + wF / 2)} ${r(-hh - 1)} ${r(cx + wF / 2)} ${r(-hh + wF / 2)} L${r(cx + wF / 2)} 0 Z`;
    k += `<path d="${form}" fill="#d2c3a6" stroke="#b7a07a" stroke-width="1.6"/>`;
    k += `<path d="${form}" fill="url(#${S.id("blei")})"/>`;
    k += `<path d="${form}" fill="${S.lg("fensterlicht", [[0, "#fff6d8", 0.55], [0.5, "#fff6d8", 0.1], [1, "#fff6d8", 0.3]])}"/>`;
    /* Medaillon: im mittleren Fenster ein Kreuz im Kreis, außen Blumen */
    k += `<circle cx="${r(cx)}" cy="${r(-hh * 0.55)}" r="${r(wF * 0.36)}" fill="#f2d36b" stroke="#2b2620" stroke-width=".5"/>`;
    if (mitte) k += `<path d="M${r(cx - 0.8)} ${r(-hh * 0.55 - 4.4)} h1.6 v3.2 h3 v1.6 h-3 v4.6 h-1.6 v-4.6 h-3 v-1.6 h3 Z" fill="#b3261e"/>`;
    else k += `<circle cx="${r(cx)}" cy="${r(-hh * 0.55)}" r="2" fill="#c9372c"/><circle cx="${r(cx)}" cy="${r(-hh * 0.55)}" r=".9" fill="#f7e39a"/>`;
    for (const t of [0.25, 0.8]) k += `<line x1="${r(cx - wF / 2)}" y1="${r(-hh * t)}" x2="${r(cx + wF / 2)}" y2="${r(-hh * t)}" stroke="#2b2620" stroke-width=".7"/>`;
    k += `<line x1="${r(cx)}" y1="0" x2="${r(cx)}" y2="${r(-hh * 0.4)}" stroke="#2b2620" stroke-width=".5"/>`;
  }
  S.teil({ id: "kr_fenster", de: "das Kirchenfenster", syl: "KIR-chen-fens-ter", it: "la vetrata", itSyl: "ve-TRA-ta", en: "stained glass window", x: VX, y: y0, kunst: k,
    tipp: "Buntes Glas in Blei gefasst. Bei Sonne malt es Farbe auf den Boden." });
}

/* =====================================================================
   2 — DIE PFARRERIN (links neben dem Altar, schwarzer Talar, Beffchen)
   ===================================================================== */
{
  const d = 14.1, s = sk(d), y = PY(CHOR_H, d);
  const m = B.mensch({ id: "b13b_pfarrerin", geschlecht: "w", pose: "halten", blick: 12, frisur: "kurz", haarfarbe: "grau", haut: "hell", laecheln: true,
    kleidung: { kleid: { stueck: "abendkleid", farbe: "schwarz" }, jacke: { stueck: "mantel", farbe: "schwarz" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" }, zubehoer: { stueck: "buch", farbe: "schwarz" } } }, 1.68 * s);
  const kx = m.z.kopf.x * m.k, ky = m.z.kopf.y * m.k;
  /* Beffchen: zwei weiße Leinenstreifen am Kragen */
  const bef = `<path d="M${r(kx - 0.9)} ${r(ky + 4.2)} L${r(kx - 0.2)} ${r(ky + 4.2)} L${r(kx - 0.1)} ${r(ky + 7.2)} L${r(kx - 1)} ${r(ky + 7.2)} Z M${r(kx + 0.2)} ${r(ky + 4.2)} L${r(kx + 0.9)} ${r(ky + 4.2)} L${r(kx + 1)} ${r(ky + 7.2)} L${r(kx + 0.1)} ${r(ky + 7.2)} Z" fill="#fdfdfb" stroke="#d9d9d4" stroke-width=".1"/>`;
  S.teil({ id: "kr_pfarrerin", de: "die Pfarrerin", syl: "PFAR-re-rin", it: "la pastora", itSyl: "pa-STO-ra", en: "pastor", x: PX(-1.75, d), y, tiefe: d, kunst: m.svg + bef,
    tipp: "Sie hält den Gottesdienst und predigt von der Kanzel." });
}

/* =====================================================================
   3 — DER ALTAR mit Kreuz, Kerzen, Bibel, Blumen (Lupe)
   ===================================================================== */
{
  const d = 14.5, s = sk(d), y = PY(CHOR_H, d), W = 2.2 * s, H = 1.0 * s, x = VX;
  let k = schatten(0, 0.4, W / 2 + 2, 1.6, 0.3);
  /* Steinblock, darüber weißes Altartuch, vorne grünes Antependium */
  k += `<rect x="${r(-W / 2)}" y="${r(-H)}" width="${r(W)}" height="${r(H)}" fill="${S.lg("altarstein", [[0, "#e2d2b4"], [1, "#bfa985"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${r(-W / 2 - 0.6)}" y="${r(-H - 0.8)}" width="${r(W + 1.2)}" height="2.4" fill="#fbfaf5"/>`;
  k += `<path d="M${r(-W / 2 + 4)} ${r(-H + 1.4)} L${r(W / 2 - 4)} ${r(-H + 1.4)} L${r(W / 2 - 4)} ${r(-2)} L${r(-W / 2 + 4)} ${r(-2)} Z" fill="${S.lg("antependium", [[0, "#3a7d44"], [1, "#245a2d"]])}"/>`;
  k += `<path d="M${r(-W / 2 + 4)} -2 L${r(W / 2 - 4)} -2" stroke="${GOLD}" stroke-width=".8"/><path d="M-2.2 ${r(-H / 2 - 3)} h1.6 v-2.4 h1.2 v2.4 h1.6 v1.2 h-1.6 v4.4 h-1.2 v-4.4 h-1.6 Z" fill="${GOLD}"/>`;
  const top = -H - 0.8;
  const unter = [];
  const u = (o, ux, w, h) => unter.push(Object.assign(o, { x: x + ux, y: y + top, kunst: flaeche(-w / 2, -h, w, h + 1) }));
  /* Kreuz (Mitte) */
  k += `<rect x="-2" y="${r(top - 1.4)}" width="4" height="1.4" fill="${GOLD}"/><rect x="-.55" y="${r(top - 12)}" width="1.1" height="10.8" fill="${GOLD}"/><rect x="-3.4" y="${r(top - 9.4)}" width="6.8" height="1.1" fill="${GOLD}"/>`;
  u({ id: "kreuz", de: "das Kreuz", syl: "KREUZ", it: "la croce", itSyl: "CRO-ce", en: "cross", tipp: "Das Kreuz erinnert an Jesus Christus." }, 0, 9, 13);
  /* zwei Altarkerzen in Messingleuchtern */
  for (const sx of [-1, 1]) {
    const cx = sx * 9.5;
    k += `<path d="M${cx - 1.6} ${r(top)} L${cx + 1.6} ${r(top)} L${cx + 0.5} ${r(top - 1.6)} L${cx + 0.4} ${r(top - 3)} L${cx + 1.3} ${r(top - 3.4)} L${cx - 1.3} ${r(top - 3.4)} L${cx - 0.4} ${r(top - 3)} L${cx - 0.5} ${r(top - 1.6)} Z" fill="${MESSING}"/>`;
    k += `<rect x="${cx - 0.8}" y="${r(top - 10)}" width="1.6" height="6.6" fill="${KERZE}"/><ellipse cx="${cx}" cy="${r(top - 11.2)}" rx="1.1" ry="1.8" fill="${FLAMME}"/><ellipse cx="${cx}" cy="${r(top - 10.8)}" rx=".35" ry=".8" fill="#fff"/>`;
  }
  u({ id: "altarkerze", de: "die Altarkerze", syl: "AL-tar-ker-ze", it: "il cero dell'altare", itSyl: "CE-ro del-l'al-TA-re", en: "altar candle", tipp: "Brennen die Altarkerzen, beginnt der Gottesdienst." }, -9.5, 6, 13);
  /* aufgeschlagene Bibel auf Pult */
  k += `<path d="M2.4 ${r(top)} L7.6 ${r(top)} L7 ${r(top - 1.6)} L3 ${r(top - 1.6)} Z" fill="#5c3816"/><path d="M2.6 ${r(top - 1.6)} Q3.8 ${r(top - 2.6)} 5 ${r(top - 1.9)} Q6.2 ${r(top - 2.6)} 7.4 ${r(top - 1.6)} L7.4 ${r(top - 1.2)} L2.6 ${r(top - 1.2)} Z" fill="#fbf6ea" stroke="#8a6a3a" stroke-width=".2"/><rect x="4.8" y="${r(top - 1.9)}" width=".4" height="2" fill="#b3261e"/>`;
  u({ id: "bibel", de: "die Bibel", syl: "BI-bel", it: "la Bibbia", itSyl: "BIB-bia", en: "Bible", tipp: "Aus der Bibel wird im Gottesdienst vorgelesen." }, 5, 6, 4);
  /* Blumenstrauß in Vase rechts außen */
  {
    const cx = 15.2;
    k += `<path d="M${cx - 1.3} ${r(top)} L${cx + 1.3} ${r(top)} L${cx + 1} ${r(top - 3.6)} L${cx - 1} ${r(top - 3.6)} Z" fill="#e9eef0" stroke="#b9c3c8" stroke-width=".2"/>`;
    for (let i = 0; i < 9; i++) { const a = -1.1 + i * 0.27; k += `<line x1="${cx}" y1="${r(top - 3.4)}" x2="${r(cx + Math.sin(a) * 4)}" y2="${r(top - 3.4 - Math.cos(a) * 4.4)}" stroke="#3f7d3a" stroke-width=".35"/><circle cx="${r(cx + Math.sin(a) * 4.2)}" cy="${r(top - 3.4 - Math.cos(a) * 4.6)}" r="${r(0.8 + (i % 3) * 0.2)}" fill="${["#f6f2e6", "#e9b13a", "#d9485a"][i % 3]}"/>`; }
  }
  u({ id: "blumenstrauss", de: "der Blumenstrauß", syl: "BLU-men-strauß", it: "il mazzo di fiori", itSyl: "MAZ-zo di FIO-ri", en: "bouquet", tipp: null }, 15.2, 8, 9);
  /* Altartuch als eigenes Lupen-Teil (vorne über die Kante) */
  u({ id: "altartuch", de: "das Altartuch", syl: "AL-tar-tuch", it: "la tovaglia d'altare", itSyl: "to-VA-glia d'al-TA-re", en: "altar cloth", tipp: "Das grüne Tuch vorn zeigt die Farbe der Kirchenjahreszeit." }, -6, 8, 1.6);
  unter[unter.length - 1].y = y - H / 2;
  unter[unter.length - 1].kunst = flaeche(-12, -3, 18, 8);
  S.teil({ id: "kr_altar", de: "der Altar", syl: "AL-tar", it: "l'altare", itSyl: "al-TA-re", en: "altar", x, y, steht: true, kunst: k,
    zoom: { x: x - 30, y: y + top - 16, w: 60, h: 40 }, unter,
    tipp: "Der Tisch im Chorraum. Darauf stehen Kerzen und das Kreuz." });
}

/* =====================================================================
   4 — DIE ORGEL auf der EMPORE (rechtes Seitenschiff) und DIE SAKRISTEITÜR
   ===================================================================== */
const EMP = { d: 12, h: 2.6 };
{
  const d = 12.6, s = sk(d), x0 = PX(4.95, d), x1 = PX(7.4, d), yB = PY(EMP.h, d);
  const W = x1 - x0, cx = (x0 + x1) / 2;
  const T = -yB;
  let k = `<rect x="${r(-W / 2)}" y="${r(T)}" width="${r(W)}" height="${r(-T)}" fill="${S.lg("gehaeuse", [[0, "#6b3f1c"], [0.5, "#8a5a2c"], [1, "#5a3416"]], 0, 0, 1, 0)}"/>`;
  /* drei Pfeifentürme: Mitte hoch, außen tiefer; Zinnpfeifen mit Labien */
  const turm = (tx, tw, ty, n) => {
    let g = `<rect x="${r(tx - tw / 2 - 1)}" y="${r(ty - 2)}" width="${r(tw + 2)}" height="2.4" fill="#4a2a10"/><path d="M${r(tx - tw / 2 - 1.5)} ${r(ty - 2)} L${r(tx)} ${r(ty - 6)} L${r(tx + tw / 2 + 1.5)} ${r(ty - 2)} Z" fill="${GOLD}" opacity=".9"/>`;
    for (let i = 0; i < n; i++) {
      const px = tx - tw / 2 + (i + 0.5) * tw / n, lang = 1 - Math.abs(i - (n - 1) / 2) / n * 0.6;
      const top = ty, unten = ty + 30 * lang + 10;
      g += `<rect x="${r(px - tw / n * 0.38)}" y="${r(top)}" width="${r(tw / n * 0.76)}" height="${r(unten - top)}" rx=".5" fill="${S.lg("zinn", [[0, "#8e979e"], [0.35, "#eef2f4"], [0.6, "#b9c1c7"], [1, "#7c858c"]], 0, 0, 1, 0)}"/>`;
      g += `<path d="M${r(px - tw / n * 0.3)} ${r(unten + 3)} L${r(px)} ${r(unten + 5.4)} L${r(px + tw / n * 0.3)} ${r(unten + 3)} Z" fill="#3b4045"/><rect x="${r(px - tw / n * 0.38)}" y="${r(unten + 3)}" width="${r(tw / n * 0.76)}" height="5" rx=".4" fill="#aab2b8"/>`;
    }
    return g;
  };
  k += turm(-W * 0.31, W * 0.28, T + 14, 5) + turm(W * 0.31, W * 0.28, T + 14, 5) + turm(0, W * 0.3, T + 7, 5);
  /* Spieltisch-Nische und Schnitzwerk */
  k += `<rect x="${r(-W / 2)}" y="-14" width="${r(W)}" height="14" fill="#5a3416"/><rect x="${r(-W / 2 + 3)}" y="-12" width="${r(W - 6)}" height="9" fill="#3a2410"/>`;
  for (const sx of [-1, 1]) k += `<path d="M${r(sx * W / 2)} ${r(T + 4)} q${sx * -4} 6 0 12 q${sx * -4} 6 0 12" stroke="${GOLD}" stroke-width=".9" fill="none"/>`;
  S.teil({ id: "kr_orgel", de: "die Orgel", syl: "OR-gel", it: "l'organo", itSyl: "OR-ga-no", en: "organ", x: cx, y: yB, kunst: k,
    tipp: "Die größte aller Pfeifen ist mehrere Meter lang, die kleinste so groß wie ein Bleistift." });
}
{
  /* Sakristeitür unter der Empore */
  const d = OST, x0 = PX(5.6, d), x1 = PX(6.6, d), y0 = PY(0, d), y1 = PY(2.2, d), W = x1 - x0;
  let k = `<path d="M${r(-W / 2 - 1.6)} 0 L${r(-W / 2 - 1.6)} ${r(y1 - y0 + 3)} Q0 ${r(y1 - y0 - 6)} ${r(W / 2 + 1.6)} ${r(y1 - y0 + 3)} L${r(W / 2 + 1.6)} 0 Z" fill="${SANDSTEIN}"/>`;
  k += `<path d="M${r(-W / 2)} 0 L${r(-W / 2)} ${r(y1 - y0 + 4)} Q0 ${r(y1 - y0 - 3.4)} ${r(W / 2)} ${r(y1 - y0 + 4)} L${r(W / 2)} 0 Z" fill="${EICHE}"/>`;
  for (const t of [-0.25, 0.25]) k += `<rect x="${r(t * W - W * 0.17)}" y="${r((y1 - y0) * 0.85)}" width="${r(W * 0.34)}" height="${r(-(y1 - y0) * 0.7)}" fill="none" stroke="#3e2510" stroke-width=".4"/>`;
  k += `<rect x="${r(W / 2 - 4)}" y="${r((y1 - y0) * 0.45)}" width="2.6" height=".8" rx=".3" fill="${MESSING}"/>`;
  for (const t of [0.25, 0.7]) k += `<rect x="${r(-W / 2)}" y="${r((y1 - y0) * t)}" width="${r(W * 0.4)}" height=".8" fill="#2b2f33"/>`;
  S.teil({ id: "sakristeitur", de: "die Sakristeitür", syl: "sa-kri-STEI-tür", it: "la porta della sagrestia", itSyl: "POR-ta del-la sa-gre-STI-a", en: "vestry door", x: (x0 + x1) / 2, y: y0, tiefe: d, kunst: k,
    tipp: "In der Sakristei zieht die Pfarrerin den Talar an." });
}
{
  /* Empore: Brüstung mit Feldern, Stützen bis zum Boden */
  const d = EMP.d, xa = PX(4.62, d), xb = 322, yB = PY(EMP.h, d), yT = PY(EMP.h + 1.0, d), yF = PY(0, d);
  const cx = (xa + xb) / 2;
  let k = `<path d="M${r(xa - cx)} ${r(yB - yF)} L${r(xb - cx)} ${r(yB - yF)} L${r(xb - cx)} ${r(yB - yF + 2.4)} L${r(xa - cx)} ${r(yB - yF + 2.4)} Z" fill="#5a3416"/>`;
  k += `<rect x="${r(xa - cx)}" y="${r(yT - yF)}" width="${r(xb - xa)}" height="${r(yB - yT)}" fill="${S.lg("bruestung", [[0, "#a77a48"], [1, "#7a5230"]])}"/>`;
  const n = 3, fw = (xb - xa) / n;
  for (let i = 0; i < n; i++) k += `<rect x="${r(xa - cx + i * fw + 2)}" y="${r(yT - yF + 3)}" width="${r(fw - 4)}" height="${r(yB - yT - 6)}" fill="${S.lg("feld", [[0, "#efe3c8"], [1, "#d9c6a0"]])}" stroke="${GOLD}" stroke-width=".5"/>`;
  k += `<rect x="${r(xa - cx - 1)}" y="${r(yT - yF - 1.6)}" width="${r(xb - xa + 2)}" height="2" rx=".6" fill="#6b4322"/>`;
  for (const x of [xa + 2, xb - 6]) k += `<rect x="${r(x - cx - 1.5)}" y="${r(yB - yF + 2.4)}" width="3" height="${r(yF - yB - 2.4)}" fill="${S.lg("stuetze", [[0, "#8a5a32"], [1, "#5c3816"]], 0, 0, 1, 0)}"/>`;
  S.teil({ id: "empore", de: "die Empore", syl: "em-PO-re", it: "la cantoria", itSyl: "can-to-RI-a", en: "gallery", x: cx, y: yF, tiefe: d, kunst: k,
    tipp: "Die Empore ist ein Balkon in der Kirche. Dort stehen die Orgel und der Chor." });
}

/* =====================================================================
   5 — DIE LIEDTAFEL (rechter Pfeiler des Chorbogens)
   ===================================================================== */
{
  const d = OST - 0.05, s = sk(d), x = PX(3.4, d), yU = PY(2.0, d), W = 0.72 * s, H = 1.15 * s;
  let k = `<rect x="${r(-W / 2)}" y="${r(-H)}" width="${r(W)}" height="${r(H)}" rx="1" fill="${S.lg("tafelholz", [[0, "#5c3816"], [1, "#3e2510"]])}"/>`;
  k += `<path d="M${r(-W / 2 - 1)} ${r(-H)} Q0 ${r(-H - 5)} ${r(W / 2 + 1)} ${r(-H)} Z" fill="#4a2a10"/>`;
  [449, 324, 171, 503].forEach((n, i) => {
    const y = -H + 3.6 + i * (H - 5) / 4;
    k += `<rect x="${r(-W / 2 + 2)}" y="${r(y)}" width="${r(W - 4)}" height="${r((H - 5) / 4 - 1)}" fill="#1f1610"/><text x="0" y="${r(y + (H - 5) / 4 - 2.2)}" font-size="4.4" text-anchor="middle" fill="#f4ecd6" font-family="Georgia,'Times New Roman',serif">${n}</text>`;
  });
  S.teil({ id: "liedtafel", de: "die Liedtafel", syl: "LIED-ta-fel", it: "il tabellone dei canti", itSyl: "ta-bel-LO-ne dei CAN-ti", en: "hymn board", x, y: yU, kunst: k,
    tipp: "Die Nummern zeigen, welche Lieder heute im Gesangbuch gesungen werden." });
}

/* =====================================================================
   6 — DIE KANZEL (linker Pfeiler des Chorbogens) mit Treppe und Schalldeckel
   ===================================================================== */
{
  const d = 11.3, s = sk(d), x = PX(-3.15, d), yF = PY(0, d);
  const yKu = PY(2.1, d) - yF, yKo = PY(3.15, d) - yF, W = 1.15 * s;
  let k = schatten(0, 0.5, 6, 1.2, 0.3);
  /* Treppe mit Geländer, von links unten */
  for (let i = 0; i < 9; i++) {
    const t = i / 9, sx = -W * 1.25 + t * W * 0.8, sy = -t * (-yKu);
    k += `<rect x="${r(sx)}" y="${r(sy - 3)}" width="${r(W * 0.32)}" height="3" fill="${i % 2 ? "#6b4322" : "#7a5230"}"/>`;
  }
  k += `<path d="M${r(-W * 1.25)} -10 L${r(-W * 0.45)} ${r(yKu - 8)}" stroke="#5c3816" stroke-width="1.4"/><path d="M${r(-W * 1.25)} 0 L${r(-W * 1.25)} -10" stroke="#5c3816" stroke-width="1.4"/>`;
  for (let i = 1; i < 6; i++) { const t = i / 6; k += `<line x1="${r(-W * 1.25 + t * W * 0.8)}" y1="${r(-10 + t * (yKu + 2))}" x2="${r(-W * 1.25 + t * W * 0.8)}" y2="${r(t * yKu - 1)}" stroke="#7a5230" stroke-width=".5"/>`; }
  /* Kanzelfuß (Säule) */
  k += `<rect x="-2.6" y="${r(yKu)}" width="5.2" height="${r(-yKu)}" fill="${SANDSTEIN}"/><rect x="-4" y="-2" width="8" height="2" fill="#b08c62"/>`;
  /* Korb: polygonal, Felder mit Gold, Brüstung */
  k += `<path d="M${r(-W / 2)} ${r(yKo)} L${r(W / 2)} ${r(yKo)} L${r(W / 2 - 1)} ${r(yKu - 2)} Q0 ${r(yKu + 4)} ${r(-W / 2 + 1)} ${r(yKu - 2)} Z" fill="${EICHE_V}"/>`;
  for (const t of [-0.32, 0, 0.32]) k += `<rect x="${r(t * W - W * 0.12)}" y="${r(yKo + 3)}" width="${r(W * 0.24)}" height="${r(yKu - yKo - 7)}" fill="#5c3816" stroke="${GOLD}" stroke-width=".45"/>`;
  k += `<rect x="${r(-W / 2 - 1)}" y="${r(yKo - 1.8)}" width="${r(W + 2)}" height="2.2" rx=".6" fill="#8a5a32"/>`;
  /* Kanzelbehang (grün) und Pult */
  k += `<path d="M-3.4 ${r(yKo + 0.4)} L3.4 ${r(yKo + 0.4)} L3 ${r(yKo + 8)} L-3 ${r(yKo + 8)} Z" fill="#2f6b38"/><path d="M-3 ${r(yKo + 7)} L3 ${r(yKo + 7)}" stroke="${GOLD}" stroke-width=".5"/>`;
  /* Schalldeckel darüber (achteckig, mit Taube) */
  const ySd = PY(4.9, d) - yF;
  k += `<rect x="${r(-W * 0.3)}" y="${r(ySd + 3)}" width="${r(W * 0.6)}" height="${r(yKo - ySd - 3)}" fill="${EICHE_V}"/><rect x="${r(-W * 0.22)}" y="${r(ySd + 6)}" width="${r(W * 0.44)}" height="${r(yKo - ySd - 11)}" fill="#5c3816" stroke="${GOLD}" stroke-width=".45"/><path d="M-1.6 ${r((ySd + yKo) / 2 - 3)} h3.2 M0 ${r((ySd + yKo) / 2 - 5.5)} v7" stroke="${GOLD}" stroke-width=".8"/>`;
  k += `<path d="M${r(-W * 0.62)} ${r(ySd + 3)} L${r(W * 0.62)} ${r(ySd + 3)} L${r(W * 0.55)} ${r(ySd)} L${r(-W * 0.55)} ${r(ySd)} Z" fill="${EICHE_V}"/><rect x="${r(-W * 0.62)}" y="${r(ySd + 3)}" width="${r(W * 1.24)}" height="1.6" fill="${GOLD}"/>`;
  k += `<path d="M${r(-W * 0.55)} ${r(ySd)} Q0 ${r(ySd - 7)} ${r(W * 0.55)} ${r(ySd)} Z" fill="#7a5230"/><path d="M-2.4 ${r(ySd - 7)} q2.4 -1.6 4.8 0 l-2.4 1.2 Z" fill="#fbfaf5"/>`;
  S.teil({ id: "kr_kanzel", de: "die Kanzel", syl: "KAN-zel", it: "il pulpito", itSyl: "PUL-pi-to", en: "pulpit", x, y: yF, tiefe: d, kunst: k,
    tipp: "Von hier wird gepredigt — erhöht, damit man es hinten hört." });
}

/* =====================================================================
   7 — DER KERZENSTÄNDER mit DEN KERZEN, DER OPFERSTOCK (linkes Seitenschiff)
   ===================================================================== */
const KZ = { d: 12.3, xw: -6.6 };
{
  const s = sk(KZ.d), W = 1.2 * s, H = 0.95 * s;
  let k = schatten(0, 0.5, W / 2 + 2, 1.3, 0.3);
  k += `<path d="M${r(-W / 2 + 2)} 0 L${r(-W / 2 + 4)} ${r(-H * 0.75)} M${r(W / 2 - 2)} 0 L${r(W / 2 - 4)} ${r(-H * 0.75)}" stroke="#2b2620" stroke-width="1.2"/>`;
  /* schräges Eisenblech mit Sand, zwei Stufen */
  k += `<path d="M${r(-W / 2)} ${r(-H * 0.72)} L${r(W / 2)} ${r(-H * 0.72)} L${r(W / 2 - 2)} ${r(-H)} L${r(-W / 2 + 2)} ${r(-H)} Z" fill="${S.lg("blech", [[0, "#4a4440"], [1, "#2b2620"]])}"/>`;
  k += `<rect x="${r(-W / 2)}" y="${r(-H * 0.74)}" width="${r(W)}" height="1.6" fill="#1d1a17"/>`;
  k += `<path d="M${r(-W / 2 + 2)} ${r(-H)} L${r(W / 2 - 2)} ${r(-H)}" stroke="#c9a13f" stroke-width=".6"/>`;
  S.teil({ id: "kerzenstaender", de: "der Kerzenständer", syl: "KER-zen-stän-der", it: "il candeliere", itSyl: "can-de-LIE-re", en: "candle stand", x: PX(KZ.xw, KZ.d), y: PY(0, KZ.d), steht: true, tiefe: KZ.d, kunst: k });
}
{
  const s = sk(KZ.d), W = 1.2 * s, H = 0.95 * s;
  let k = "";
  const pos = [];
  for (let i = 0; i < 7; i++) pos.push([-W / 2 + 3.5 + i * (W - 7) / 6, -H * 0.76]);
  for (let i = 0; i < 6; i++) pos.push([-W / 2 + 5 + i * (W - 10) / 5, -H * 0.9]);
  pos.forEach(([x, y], i) => {
    const brennt = i % 4 !== 3;
    k += `<rect x="${r(x - 0.75)}" y="${r(y - 3.2)}" width="1.5" height="3.2" fill="${i % 5 === 1 ? "#d9485a" : KERZE}"/>`;
    if (brennt) k += `<ellipse cx="${r(x)}" cy="${r(y - 4.4)}" rx=".75" ry="1.3" fill="${FLAMME}"/><ellipse cx="${r(x)}" cy="${r(y - 4.2)}" rx=".22" ry=".55" fill="#fff"/>`;
  });
  k += `<ellipse cx="0" cy="${r(-H * 0.86)}" rx="${r(W / 2 + 2)}" ry="9" fill="#ffd46b" opacity=".12" filter="url(#bw_weich)"/>`;
  S.teil({ oben: true, id: "kr_kerze", de: "die Kerze", syl: "KER-ze", it: "la candela", itSyl: "can-DE-la", en: "candle", x: PX(KZ.xw, KZ.d), y: PY(0, KZ.d), tiefe: KZ.d, kunst: k + flaeche(-W / 2, -H - 6, W, 9),
    tipp: "Viele zünden eine an und stellen sie zu den anderen." });
}
{
  const d = 11.8, s = sk(d), H = 1.05 * s;
  let k = schatten(0, 0.4, 4, 1, 0.3);
  k += `<rect x="-1.5" y="${r(-H * 0.7)}" width="3" height="${r(H * 0.7)}" fill="${EICHE_V}"/><rect x="-3.2" y="-1.4" width="6.4" height="1.4" fill="#3e2510"/>`;
  k += `<rect x="-4.6" y="${r(-H)}" width="9.2" height="${r(H * 0.32)}" rx=".6" fill="${S.lg("opfer", [[0, "#7a5230"], [1, "#4a2a10"]])}"/>`;
  k += `<path d="M-4.6 ${r(-H + 2.4)} h9.2 M-4.6 ${r(-H * 0.75)} h9.2" stroke="#2b2f33" stroke-width=".8"/><rect x="-1.8" y="${r(-H - 0.4)}" width="3.6" height=".7" fill="#1a1612"/><rect x="-.8" y="${r(-H * 0.84)}" width="1.6" height="1.8" rx=".3" fill="${MESSING}"/>`;
  S.teil({ id: "kr_opferstock", de: "der Opferstock", syl: "OP-fer-stock", it: "la cassetta delle offerte", itSyl: "cas-SET-ta", en: "offering box", x: PX(-5.4, d), y: PY(0, d), steht: true, tiefe: d, kunst: k,
    tipp: "Der Kasten für das Geld, das man spendet." });
}

/* =====================================================================
   8 — DAS TAUFBECKEN (Taufstein vorn im Altarraum, rechts)
   ===================================================================== */
{
  const d = 12.7, s = sk(d), H = 1.0 * s, W = 0.85 * s;
  let k = schatten(0, 0.5, W / 2 + 2, 1.6, 0.32);
  k += `<path d="M${r(-W * 0.36)} 0 L${r(W * 0.36)} 0 L${r(W * 0.3)} -3 L${r(W * 0.14)} -4 L${r(W * 0.14)} ${r(-H * 0.6)} L${r(-W * 0.14)} ${r(-H * 0.6)} L${r(-W * 0.14)} -4 L${r(-W * 0.3)} -3 Z" fill="${SANDSTEIN}"/>`;
  k += `<path d="M${r(-W / 2)} ${r(-H)} L${r(W / 2)} ${r(-H)} Q${r(W * 0.46)} ${r(-H * 0.62)} ${r(W * 0.14)} ${r(-H * 0.58)} L${r(-W * 0.14)} ${r(-H * 0.58)} Q${r(-W * 0.46)} ${r(-H * 0.62)} ${r(-W / 2)} ${r(-H)} Z" fill="${S.lg("becken", [[0, "#e8d2ab"], [0.5, "#d2b48a"], [1, "#a8875f"]], 0, 0, 1, 0)}"/>`;
  for (const t of [-0.25, 0, 0.25]) k += `<path d="M${r(t * W)} ${r(-H + 1)} L${r(t * W * 0.5)} ${r(-H * 0.62)}" stroke="#a8875f" stroke-width=".4"/>`;
  /* Messing-Taufschale und Deckel mit Knauf */
  k += `<ellipse cx="0" cy="${r(-H)}" rx="${r(W / 2)}" ry="2" fill="#d6be94"/><ellipse cx="0" cy="${r(-H - 0.3)}" rx="${r(W * 0.4)}" ry="1.4" fill="${MESSING}"/>`;
  k += `<path d="M${r(-W * 0.32)} ${r(-H - 0.6)} Q0 ${r(-H - 6)} ${r(W * 0.32)} ${r(-H - 0.6)} Z" fill="${MESSING}"/><circle cx="0" cy="${r(-H - 5.4)}" r="1" fill="${GOLD}"/>`;
  S.teil({ id: "kr_taufbecken", de: "das Taufbecken", syl: "TAUF-be-cken", it: "il fonte battesimale", itSyl: "FON-te bat-te-si-MA-le", en: "font", x: PX(1.45, d), y: PY(CHOR_H, d), steht: true, kunst: k, tiefe: d,
    tipp: "Darin wird ein Kind getauft. Der Taufstein steht vorn, vor den Augen der Gemeinde." });
}

/* =====================================================================
   9 — DER MITTELGANG (roter Läufer bis zu den Stufen)
   ===================================================================== */
{
  const dA = 11.25, dB = 4.0;
  let k = `<path d="M${P(-0.6, 0, dA)} L${P(0.6, 0, dA)} L${P(0.6, 0, dB)} L${P(-0.6, 0, dB)} Z" fill="${S.lg("laeufer", [[0, "#7a1c24"], [1, "#a3272f"]])}" transform="translate(${-VX} ${-PY(0, dB)})"/>`;
  k += `<path d="M${P(-0.52, 0, dA)} L${P(-0.52, 0, dB)} M${P(0.52, 0, dA)} L${P(0.52, 0, dB)}" stroke="#d9a548" stroke-width=".5" transform="translate(${-VX} ${-PY(0, dB)})"/>`;
  S.teil({ id: "kr_mittelgang", de: "der Mittelgang", syl: "MIT-tel-gang", it: "la navata centrale", itSyl: "na-VA-ta cen-TRA-le", en: "aisle", x: VX, y: PY(0, dB), kunst: k,
    tipp: "Der Weg in der Mitte — dort geht das Brautpaar hinein." });
}

/* =====================================================================
   10 — DIE GEMEINDE (Menschen in den Bänken, von hinten gesehen)
   ===================================================================== */
const leute = [
  /* [x in m, Reihe, Haar, Jacke, Haarform] */
  [-3.3, 8.4, "#3b2a1e", "#4a5a78", "kurz"], [-2.4, 8.4, "#c9c4bc", "#7b5a7e", "dutt"], [2.1, 8.4, "#8a5a2c", "#5f6b4a", "lang"],
  [-1.6, 7.3, "#b98a4a", "#a33a3a", "dutt"], [-3.1, 7.3, "#1d1a17", "#30343a", "kurz"],
  [3.0, 7.3, "#6b4a2e", "#3e5f7a", "kurz"], [1.8, 7.3, "#bfb8ad", "#6e6a63", "kurz"], [3.2, 6.2, "#4a3424", "#c47a2a", "kind"],
];
{
  const oy = PY(0, 6.2);
  let k = "";
  for (const [xw, d, haar, jacke, form] of leute) {
    const s = sk(d), x = PX(xw, d + 0.3) - VX, kind = form === "kind";
    const hKopf = kind ? 1.18 : 1.36, kopfR = 0.105 * s;
    const yK = PY(hKopf, d + 0.3) - oy, ySch = PY(hKopf - 0.27, d + 0.3) - oy, yUnten = PY(0.8, d + 0.3) - oy;
    const sw = (kind ? 0.17 : 0.25) * s;
    let p = `<path d="M${r(x - sw)} ${r(yUnten)} L${r(x - sw)} ${r(ySch + kopfR * 0.8)} Q${r(x - sw)} ${r(ySch)} ${r(x - sw * 0.5)} ${r(ySch - kopfR * 0.15)} L${r(x + sw * 0.5)} ${r(ySch - kopfR * 0.15)} Q${r(x + sw)} ${r(ySch)} ${r(x + sw)} ${r(ySch + kopfR * 0.8)} L${r(x + sw)} ${r(yUnten)} Z" fill="${jacke}"/>`;
    p += `<path d="M${r(x - sw)} ${r(ySch + kopfR)} L${r(x - sw * 0.7)} ${r(yUnten)}" stroke="#000" stroke-width=".35" opacity=".2"/>`;
    p += `<rect x="${r(x - kopfR * 0.42)}" y="${r(yK + kopfR * 0.55)}" width="${r(kopfR * 0.84)}" height="${r(kopfR * 0.9)}" fill="#dcb08c"/>`;
    p += `<path d="M${r(x - kopfR * 0.55)} ${r(ySch - kopfR * 0.12)} Q${r(x)} ${r(ySch + kopfR * 0.25)} ${r(x + kopfR * 0.55)} ${r(ySch - kopfR * 0.12)}" fill="${jacke}" stroke="#000" stroke-width=".25" stroke-opacity=".3"/>`;
    p += `<ellipse cx="${r(x)}" cy="${r(yK)}" rx="${r(kopfR)}" ry="${r(kopfR * 1.15)}" fill="${form === "glatze" ? "#e3bb98" : haar}"/>`;
    p += `<ellipse cx="${r(x - kopfR * 1.0)}" cy="${r(yK + kopfR * 0.2)}" rx="${r(kopfR * 0.18)}" ry="${r(kopfR * 0.3)}" fill="#d9a888"/><ellipse cx="${r(x + kopfR * 1.0)}" cy="${r(yK + kopfR * 0.2)}" rx="${r(kopfR * 0.18)}" ry="${r(kopfR * 0.3)}" fill="#d9a888"/>`;
    if (form === "glatze") p += `<path d="M${r(x - kopfR)} ${r(yK + kopfR * 0.1)} q${r(kopfR)} ${r(kopfR * 0.9)} ${r(kopfR * 2)} 0" stroke="${haar}" stroke-width="${r(kopfR * 0.45)}" fill="none"/>`;
    if (form === "lang") p += `<path d="M${r(x - kopfR)} ${r(yK)} Q${r(x - kopfR * 1.2)} ${r(ySch + kopfR)} ${r(x - kopfR * 0.9)} ${r(ySch + kopfR * 1.3)} L${r(x + kopfR * 0.9)} ${r(ySch + kopfR * 1.3)} Q${r(x + kopfR * 1.2)} ${r(ySch + kopfR)} ${r(x + kopfR)} ${r(yK)} Z" fill="${haar}"/>`;
    if (form === "dutt") p += `<circle cx="${r(x)}" cy="${r(yK - kopfR * 0.25)}" r="${r(kopfR * 0.45)}" fill="${haar}" stroke="#a49d92" stroke-width=".2"/>`;
    if (form === "kurz" || form === "kind") p += `<path d="M${r(x - kopfR * 0.95)} ${r(yK + kopfR * 0.3)} Q${r(x)} ${r(yK + kopfR * 0.9)} ${r(x + kopfR * 0.95)} ${r(yK + kopfR * 0.3)}" stroke="${haar}" stroke-width="${r(kopfR * 0.3)}" fill="none"/>`;
    p += `<ellipse cx="${r(x - kopfR * 0.3)}" cy="${r(yK - kopfR * 0.5)}" rx="${r(kopfR * 0.4)}" ry="${r(kopfR * 0.25)}" fill="#fff" opacity=".2"/>`;
    k += `<g clip-path="${deck(d + 0.01, VX, oy)}">${p}</g>`;
  }
  S.teil({ id: "kr_gemeinde", de: "die Gemeinde", syl: "Ge-MEIN-de", it: "la comunità", itSyl: "co-mu-ni-TÀ", en: "congregation", x: VX, y: oy, kunst: k,
    tipp: "Alle, die zum Gottesdienst gekommen sind." });
}

/* =====================================================================
   11 — DIE KIRCHENBÄNKE zum Antippen: mittlere, Kirchenbank, hintere
   ===================================================================== */
const bankTeil = (id, de, syl, it, itSyl, en, seite, d, tipp) => {
  const g = bank(seite, d);
  const bx = PX(seite < 0 ? -2.5 : 2.5, d), by = PY(0, d);
  S.teil({ id, de, syl, it, itSyl, en, x: bx, y: by, steht: true, tiefe: d, kunst: `<g transform="translate(${r(-bx)} ${r(-by)})">${g}</g>`, tipp });
};
bankTeil("kr_bank2", "die mittlere Kirchenbank", "MITT-le-re KIR-chen-bank", "il banco di mezzo", "BAN-co di MEZ-zo", "middle pew", -1, 6.2, null);
bankTeil("kr_bank3", "die Kirchenbank", "KIR-chen-bank", "il banco", "BAN-co", "pew", 1, 5.1, "Hier sitzt die Gemeinde.");
bankTeil("kr_bank1", "die hintere Kirchenbank", "HIN-te-re KIR-chen-bank", "il banco in fondo", "BAN-co in FON-do", "back pew", -1, 4.1,
  "In der letzten Reihe sitzt man hinten in der Kirche.");

/* =====================================================================
   12 — DAS GESANGBUCH (auf der Ablage der vordersten Bank rechts)
   ===================================================================== */
{
  const d = 4.1, x = PX(1.75, d), y = PY(0.9, d), s = sk(d);
  const bw = 0.15 * s, bt = 0.035 * s;
  let k = schatten(0, 0, bw * 1.3, 1, 0.25);
  for (let i = 0; i < 2; i++) {
    const y0 = -i * bt, dx = i * 1.2;
    k += `<path d="M${r(-bw / 2 + dx)} ${r(y0)} L${r(bw / 2 + dx)} ${r(y0)} L${r(bw / 2 + dx)} ${r(y0 - bt)} L${r(-bw / 2 + dx)} ${r(y0 - bt)} Z" fill="${i ? "#1f3557" : "#2a2a2e"}"/>`;
    k += `<path d="M${r(-bw / 2 + dx + 0.6)} ${r(y0 - 0.5)} L${r(bw / 2 + dx - 0.6)} ${r(y0 - 0.5)}" stroke="#f4ecd6" stroke-width="${r(bt * 0.35)}" opacity=".9"/>`;
    k += `<rect x="${r(dx - 0.5)}" y="${r(y0 - bt + 0.3)}" width="1" height="${r(bt - 0.6)}" fill="${GOLD}"/>`;
  }
  /* ein drittes Buch steht schräg an der Lehne */
  k += `<g transform="translate(${r(bw * 1.1)} 0) rotate(-14)"><rect x="-1.4" y="${r(-bw)}" width="2.8" height="${r(bw)}" fill="#7a1c24"/><text x="0" y="${r(-bw * 0.5)}" font-size="1.6" text-anchor="middle" fill="${"#e8c45c"}" font-family="Georgia" transform="rotate(-90 0 ${r(-bw * 0.5)})">EG</text></g>`;
  S.teil({ oben: true, id: "kr_gesangbuch", de: "das Gesangbuch", syl: "Ge-SANG-buch", it: "il libro dei canti", itSyl: "LI-bro dei CAN-ti", en: "hymn book", x, y, kunst: k,
    tipp: "Darin stehen die Lieder mit Nummern. Die Nummern hängen vorn an der Tafel." });
}

/* Was hinter Bänken steht, an deren Oberkante abschneiden */
for (const t of S.teile) if (t.tiefe) t.kunst = `<g clip-path="${deck(t.tiefe, t.x, t.y)}">${t.kunst}</g>`;

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/kirche_innen.js"));
console.log(aus);
