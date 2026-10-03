#!/usr/bin/env node
/* =====================================================================
   DER SPORTPLATZ (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   XANDER (Funk 263/286): jeder Ort authentisch wie das echte Vorbild,
   alles logisch platziert, jedes Ding einzeln antippbar, nichts blockiert.

   RECHERCHE (Stadionwelt „Kompendium Sportplatz 2024“, Sportstättenbau
   Dresden, Ausstattungskataloge Sportplatz; FIFA-Regel 1 Spielfeld):
   - Ein Amateur-Sportplatz: KUNSTRASEN mit hellen Mähstreifen, weiße
     Linien: Torlinie, TORRAUM (5,5 m), Strafraum (16,5 m), Elfmeterpunkt.
     Spielfeld eines Kreisliga-Platzes: 45–68 × 90–105 m.
   - Das TOR: 7,32 m breit, 2,44 m hoch, weiß, mit Kastennetz (TORNETZ).
     An jeder Ecke eine ECKFAHNE (mind. 1,5 m hoch).
   - Hinter dem Tor die rote Kunststoff-LAUFBAHN (Tartan), dahinter ein
     hoher BALLFANGZAUN. Am Rand FLUTLICHTMASTEN (15–20 m).
   - Hinter dem Platz das VEREINSHEIM mit Vereinsname und den KABINEN,
     eine ANZEIGETAFEL (Heim – Gast), eine kleine überdachte TRIBÜNE.
   - Training: Der TRAINER mit TRILLERPFEIFE, HÜTCHEN für den Slalom,
     eine SPORTTASCHE mit Trikot, Schienbeinschonern und Torwart-
     handschuhen, ein Träger mit WASSERFLASCHEN.
   Blick vom Strafraum aufs Tor (Kamera 12 m vor der Torlinie, 9,5 m
   rechts der Tormitte, Augenhöhe 1,7 m, Brennweite 120).
   Maßstab: Einheiten je Meter = 120 / Entfernung; Tor ≈ 10 je Meter.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "sportplatz", titel: "Der Sportplatz", emoji: "⚽", thema: "Freizeit", kuerzel: "b13e", fassung: 852 });
const rnd = zufall(1921);
const r = B.r;

/* Welt: X quer (0 = Tormitte), Z vom Tor zur Kamera (0 = Torlinie), H hoch */
const VX = 160, VY = 90, F = 120, AUGE = 1.7, CX = 9.5, CZ = 12;
const dd = (Z) => CZ - Z;
const sk = (Z) => F / dd(Z);
const PX = (X, Z) => VX + (X - CX) * F / dd(Z);
const PY = (H, Z) => VY + (AUGE - H) * F / dd(Z);
const P = (X, H, Z) => `${r(PX(X, Z))} ${r(PY(H, Z))}`;
const G = (X, Y, svg) => `<g transform="translate(${r(-X)} ${r(-Y)})">${svg}</g>`;
const HB = 22.5;   /* halbe Platzbreite (45 m, Kreisliga) */

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const WEISS = S.lg("weiss", [[0, "#ffffff"], [0.5, "#f1f3f4"], [1, "#c9ced2"]], 0, 0, 1, 0);
const ROT = S.lg("tartan", [[0, "#a8412f"], [1, "#c4553c"]]);
const ORANGE = S.lg("huetchen", [[0, "#ff9a3c"], [0.5, "#ff7a1a"], [1, "#d55a0a"]], 0, 0, 1, 0);

/* =====================================================================
   KULISSE — Himmel, Bäume, Kunstrasen mit Mähstreifen, Linien, Laufbahn
   ===================================================================== */
S.hinten(`<rect x="0" y="0" width="320" height="104" fill="${S.lg("himmel", [[0, "#6fa8dc"], [0.7, "#c8def0"], [1, "#e9f1f6"]])}"/>`);
S.hinten(`<ellipse cx="230" cy="20" rx="32" ry="6" fill="#fff" opacity=".8"/><ellipse cx="250" cy="16" rx="18" ry="5" fill="#fff" opacity=".85"/><ellipse cx="70" cy="34" rx="22" ry="4" fill="#fff" opacity=".6"/>`);
{
  let b = "";
  for (let i = 0; i < 22; i++) { const x = i * 15 + rnd() * 7, h = 16 + rnd() * 18; b += `<ellipse cx="${r(x)}" cy="${r(99 - h / 2)}" rx="${r(9 + rnd() * 6)}" ry="${r(h / 2 + 3)}" fill="${rnd() < 0.5 ? "#5f8a52" : "#4f7a44"}"/>`; }
  S.hinten(b);
}
/* Rasen (Kunstrasen) bis vorne, Umfeld hinter dem Tor */
S.hinten(`<rect x="0" y="96" width="320" height="104" fill="#4f9a3e"/>`);
{
  /* Mähstreifen parallel zur Torlinie: Bänder je 5 m */
  let m = "";
  for (let z = 0; z < CZ - 1.2; z += 5) {
    const y0 = PY(0, z), y1 = PY(0, Math.min(z + 2.5, CZ - 0.6));
    m += `<rect x="0" y="${r(y0)}" width="320" height="${r(Math.min(200, y1) - y0)}" fill="#62b04f" opacity=".45"/>`;
  }
  m += `<rect x="0" y="${r(PY(0, 0))}" width="320" height="${r(200 - PY(0, 0))}" fill="${S.lg("rasenlicht", [[0, "#1f3a18", 0.18], [0.4, "#1f3a18", 0], [1, "#fff", 0.06]])}"/>`;
  /* Linien: Torlinie, Torraum, Strafraum-Seite, Seitenlinie an der Ecke, Eckviertelkreis */
  const L = (pts, w) => `<path d="M${pts.map((p) => P(p[0], 0, p[1])).join(" L")}" stroke="#f4f6f2" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
  m += L([[-HB, 0], [HB, 0]], 0.8);
  m += L([[-9.16, 0], [-9.16, 5.5], [9.16, 5.5], [9.16, 0]], 1);
  m += L([[20.16, 0], [20.16, 11.2]], 1.2);
  m += L([[HB, 0], [HB, 11]], 1);
  let bogen = "";
  for (let i = 0; i <= 8; i++) { const a = Math.PI / 2 + i / 8 * Math.PI / 2; bogen += (i ? " L" : "M") + P(HB + Math.cos(a), 0, Math.sin(a)); }
  m += `<path d="${bogen}" stroke="#f4f6f2" stroke-width=".7" fill="none"/>`;
  /* Umfeld hinter der Torlinie (Rasen) und die rote Laufbahn mit Bahnlinien */
  m += `<path d="M0 ${r(PY(0, -3.6))} L320 ${r(PY(0, -3.6))} L320 96 L0 96 Z" fill="#5d8f45"/>`;
  m += `<path d="M0 ${r(PY(0, -4))} L${P(25.5, 0, -4)} Q${P(26.5, 0, -4)} ${P(26.6, 0, -2.5)} L${P(26.6, 0, 0.8)} L${P(33.6, 0, 0.8)} L${P(33.6, 0, -6)} Q${P(33.4, 0, -11)} ${P(27, 0, -11)} L0 ${r(PY(0, -11))} Z" fill="${ROT}"/>`;
  for (const z of [-5.2, -6.4, -7.6, -8.8, -10]) m += `<path d="M0 ${r(PY(0, z))} L${P(27 + (z + 4) * -0.95, 0, z)}" stroke="#f3e6dc" stroke-width=".25" opacity=".9"/>`;
  S.hinten(m);
}

/* =====================================================================
   1 — DIE FLUTLICHTMASTEN (rechte Ecke) und DER BALLFANGZAUN
   ===================================================================== */
{
  const X = 27, Z = -13, s = sk(Z), x = PX(X, Z), y = PY(0, Z), H = 17 * s;
  let k = schatten(0, 0.3, 4, 1, 0.3);
  k += `<path d="M-1.6 0 L-.8 ${r(-H)} L.8 ${r(-H)} L1.6 0 Z" fill="${S.lg("mast", [[0, "#9aa3aa"], [0.5, "#e1e5e8"], [1, "#7c858c"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-9" y="${r(-H - 10)}" width="18" height="10" rx=".8" fill="#3a3f45"/>`;
  for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) k += `<rect x="${-8 + i * 5.6}" y="${r(-H - 9.2 + j * 4.6)}" width="5" height="4" rx=".4" fill="${S.lg("led", [[0, "#ffffff"], [1, "#dfe9ef"]])}" stroke="#2b2f33" stroke-width=".3"/>`;
  k += `<rect x="-1.2" y="${r(-H)}" width="2.4" height="2" fill="#3a3f45"/>`;
  S.teil({ id: "flutlichtmast", de: "der Flutlichtmast", syl: "FLUT-licht-mast", it: "il palo della luce", itSyl: "PA-lo del-la LU-ce", en: "floodlight mast", x, y, kunst: k,
    tipp: "Mit Flutlicht kann man auch abends trainieren." });
}
{
  /* Ballfangzaun hinter der Laufbahn: Pfosten und feines Netz */
  const Z = -12, y0 = PY(0, Z), y1 = PY(4, Z);
  let k = `<rect x="-160" y="${r(y1 - y0)}" width="${r(PX(26, Z))}" height="${r(y0 - y1)}" fill="url(#${S.id("masche")})" opacity=".6"/>`;
  S.def(`<pattern id="${S.id("masche")}" width="2" height="2" patternUnits="userSpaceOnUse"><path d="M0 0 L2 2 M2 0 L0 2" stroke="#38464f" stroke-width=".18" opacity=".55"/></pattern>`);
  for (let X = -22; X <= 26; X += 6) k += `<rect x="${r(PX(X, Z) - 160 - 0.4)}" y="${r(y1 - y0)}" width=".8" height="${r(y0 - y1)}" fill="#59636b"/>`;
  k += `<rect x="-160" y="${r(y1 - y0)}" width="${r(PX(26, Z))}" height=".6" fill="#59636b"/>`;
  S.teil({ id: "ballfangzaun", de: "der Ballfangzaun", syl: "BALL-fang-zaun", it: "la rete di recinzione", itSyl: "RE-te di re-cin-ZIO-ne", en: "ball stop fence", x: 160, y: y0, kunst: k,
    tipp: "Der hohe Zaun fängt die Bälle, die übers Tor fliegen." });
}

/* =====================================================================
   2 — DAS VEREINSHEIM, DIE KABINE, DIE ANZEIGETAFEL, DIE TRIBÜNE (hinten)
   ===================================================================== */
{
  const Z = -18, s = sk(Z), xa = PX(-13, Z), xb = PX(3, Z), y = PY(0, Z), W = xb - xa, H = 4.2 * s;
  let k = schatten(0, 0.3, W / 2 + 2, 1.2, 0.25);
  k += `<rect x="${r(-W / 2)}" y="${r(-H)}" width="${r(W)}" height="${r(H)}" fill="${S.lg("vh", [[0, "#f2ece0"], [1, "#d9cfbd"]])}"/>`;
  k += `<rect x="${r(-W / 2 - 1)}" y="${r(-H - 1.6)}" width="${r(W + 2)}" height="2" fill="#7a7f84"/>`;
  k += `<rect x="${r(-W / 2 + 3)}" y="${r(-H + 1.4)}" width="${r(W - 6)}" height="5" fill="#b3261e"/><text x="0" y="${r(-H + 5.1)}" font-size="3.4" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold" letter-spacing=".3">SV Rot-Weiß 1921 e.V.</text>`;
  for (let i = 0; i < 5; i++) k += `<rect x="${r(-W / 2 + 4 + i * (W - 8) / 5)}" y="${r(-H * 0.55)}" width="${r((W - 8) / 5 - 2)}" height="${r(H * 0.32)}" fill="${S.lg("glas", [[0, "#cfe3ee"], [1, "#7fa6bd"]])}" stroke="#8a8f96" stroke-width=".3"/>`;
  /* Terrasse mit Sonnenschirm */
  k += `<rect x="${r(-W / 2)}" y="-1.6" width="${r(W)}" height="1.6" fill="#a8a194"/>`;
  k += `<path d="M${r(-W * 0.3 - 7)} ${r(-H * 0.62)} Q${r(-W * 0.3)} ${r(-H * 0.8)} ${r(-W * 0.3 + 7)} ${r(-H * 0.62)} Z" fill="#b3261e"/><line x1="${r(-W * 0.3)}" y1="${r(-H * 0.62)}" x2="${r(-W * 0.3)}" y2="0" stroke="#5a5f64" stroke-width=".4"/>`;
  S.teil({ id: "vereinsheim", de: "das Vereinsheim", syl: "ver-EINS-heim", it: "la sede del club", itSyl: "SE-de del CLUB", en: "clubhouse", x: (xa + xb) / 2, y, kunst: k,
    tipp: "Im Vereinsheim trifft man sich nach dem Spiel." });
}
{
  const Z = -17, s = sk(Z), xa = PX(3.4, Z), xb = PX(12.5, Z), y = PY(0, Z), W = xb - xa, H = 3.1 * s;
  let k = `<rect x="${r(-W / 2)}" y="${r(-H)}" width="${r(W)}" height="${r(H)}" fill="${S.lg("kab", [[0, "#e4ddcf"], [1, "#cbc1ad"]])}"/><rect x="${r(-W / 2 - 0.6)}" y="${r(-H - 1.2)}" width="${r(W + 1.2)}" height="1.6" fill="#7a7f84"/>`;
  for (const [t, txt] of [[-0.25, "HEIM"], [0.25, "GAST"]]) {
    k += `<rect x="${r(t * W - 3.4)}" y="${r(-2.1 * s)}" width="6.8" height="${r(2.1 * s)}" fill="${t < 0 ? "#b3261e" : "#2a5ea8"}"/><rect x="${r(t * W - 3)}" y="${r(-2.1 * s - 3.2)}" width="6" height="2.6" fill="#fff"/><text x="${r(t * W)}" y="${r(-2.1 * s - 1.2)}" font-size="1.8" text-anchor="middle" fill="#2b2f33" font-family="Arial" font-weight="bold">${txt}</text>`;
  }
  for (let i = 0; i < 4; i++) k += `<rect x="${r(-W / 2 + 2 + i * (W - 4) / 4)}" y="${r(-H + 1.2)}" width="${r((W - 4) / 4 - 1.4)}" height="1.6" fill="#9cc3d8"/>`;
  S.teil({ id: "sp_kabine", de: "die Kabine", syl: "Ka-BI-ne", it: "lo spogliatoio", itSyl: "spo-glia-TO-io", en: "changing room", x: (xa + xb) / 2, y, kunst: k,
    tipp: "In der Kabine zieht sich die Mannschaft um und duscht nach dem Spiel." });
}
{
  const Z = -14, s = sk(Z), x = PX(17.5, Z), y = PY(0, Z), W = 5.6 * s, H = 1.9 * s, hP = 2.4 * s;
  let k = schatten(0, 0.3, W / 2, 1, 0.25);
  for (const sx of [-0.35, 0.35]) k += `<rect x="${r(sx * W - 0.7)}" y="${r(-hP)}" width="1.4" height="${r(hP)}" fill="#59636b"/>`;
  k += `<rect x="${r(-W / 2)}" y="${r(-hP - H)}" width="${r(W)}" height="${r(H)}" rx=".6" fill="#16191c"/>`;
  k += `<text x="${r(-W / 4)}" y="${r(-hP - H + 3.2)}" font-size="2.2" text-anchor="middle" fill="#f4f1ea" font-family="Arial" font-weight="bold">HEIM</text><text x="${r(W / 4)}" y="${r(-hP - H + 3.2)}" font-size="2.2" text-anchor="middle" fill="#f4f1ea" font-family="Arial" font-weight="bold">GAST</text>`;
  k += `<text x="${r(-W / 4)}" y="${r(-hP - 1.4)}" font-size="5.2" text-anchor="middle" fill="#ffb02e" font-family="monospace" font-weight="bold">2</text><text x="${r(W / 4)}" y="${r(-hP - 1.4)}" font-size="5.2" text-anchor="middle" fill="#ffb02e" font-family="monospace" font-weight="bold">1</text><text x="0" y="${r(-hP - 1.8)}" font-size="2.6" text-anchor="middle" fill="#ffb02e" font-family="monospace">:</text>`;
  S.teil({ id: "anzeigetafel", de: "die Anzeigetafel", syl: "AN-zei-ge-ta-fel", it: "il tabellone", itSyl: "ta-bel-LO-ne", en: "scoreboard", x, y, kunst: k,
    tipp: "Die Anzeigetafel zeigt den Spielstand: Heim gegen Gast." });
}
{
  /* kleine überdachte Tribüne rechts hinten (vier Stufen Sitzplätze) */
  const Z = -9, s = sk(Z), xa = PX(29, Z), xb = PX(38, Z), y = PY(0, Z), W = xb - xa, H = 3.6 * s;
  let k = schatten(0, 0.4, W / 2, 1.2, 0.25);
  k += `<path d="M${r(-W / 2)} 0 L${r(-W / 2)} ${r(-0.6 * s)} L${r(W / 2)} ${r(-0.6 * s)} L${r(W / 2)} 0 Z" fill="#b5b0a6"/>`;
  for (let i = 0; i < 4; i++) {
    const y0 = -0.6 * s - i * 0.5 * s;
    k += `<rect x="${r(-W / 2)}" y="${r(y0 - 0.5 * s)}" width="${r(W)}" height="${r(0.5 * s)}" fill="${i % 2 ? "#c9c3b7" : "#bdb7aa"}"/>`;
    for (let j = 0; j < 10; j++) k += `<rect x="${r(-W / 2 + 1 + j * (W - 2) / 10)}" y="${r(y0 - 0.5 * s - 0.4)}" width="${r((W - 2) / 10 - 0.8)}" height="${r(0.25 * s)}" rx=".3" fill="${(i + j) % 7 === 0 ? "#f4f1ea" : "#b3261e"}"/>`;
  }
  k += `<path d="M${r(-W / 2 - 2)} ${r(-H)} L${r(W / 2 + 2)} ${r(-H)} L${r(W / 2 + 2)} ${r(-H + 1.6)} L${r(-W / 2 - 2)} ${r(-H + 1.6)} Z" fill="#59636b"/>`;
  for (const t of [-0.45, 0, 0.45]) k += `<rect x="${r(t * W - 0.5)}" y="${r(-H + 1.6)}" width="1" height="${r(H - 0.6 * s - 2 * s - 1.6)}" fill="#7c858c"/>`;
  k += `<rect x="${r(-W / 2)}" y="${r(-H + 1.6)}" width="${r(W)}" height="${r(H * 0.1)}" fill="#000" opacity=".15"/>`;
  S.teil({ id: "sp_tribuene", de: "die Tribüne", syl: "Tri-BÜ-ne", it: "la tribuna", itSyl: "tri-BU-na", en: "stand", x: (xa + xb) / 2, y, kunst: k,
    tipp: "Auf der Tribüne sitzen die Zuschauer — überdacht, falls es regnet." });
}

/* =====================================================================
   3 — DIE LAUFBAHN (Tartan, rot) als Teil — nur die Fläche hinter dem Tor
   ===================================================================== */
{
  const x = PX(10, -7.5), y = PY(0, -4);
  S.def(`<clipPath id="${S.id("bild")}"><rect x="0" y="0" width="320" height="200"/></clipPath>`);
  let g = `<path d="M0 ${r(PY(0, -4))} L${P(25.5, 0, -4)} Q${P(26.5, 0, -4)} ${P(26.6, 0, -2.5)} L320 ${r(PY(0, -1.5))} L320 ${r(PY(0, -7))} Q${P(31, 0, -11)} ${P(27, 0, -11)} L0 ${r(PY(0, -11))} Z" fill="${ROT}" opacity=".001"/>`;
  g = `<g clip-path="url(#${S.id("bild")})">${g}</g>`;
  S.teil({ id: "laufbahn", de: "die Laufbahn", syl: "LAUF-bahn", it: "la pista", itSyl: "PI-sta", en: "running track", x, y, kunst: G(x, y, g),
    tipp: "Die rote Laufbahn aus Kunststoff federt — hier trainieren die Leichtathleten." });
}

/* =====================================================================
   4 — DAS TOR mit TORNETZ, DIE ECKFAHNE, DER TORRAUM
   ===================================================================== */
const TOR = { b: 3.66, h: 2.44, tief: 2.0, hNetz: 1.6 };
{
  /* Tornetz (Kastennetz): Rückwand, Seiten, Dach — feine Maschen */
  S.def(`<pattern id="${S.id("netz")}" width="1.4" height="1.4" patternUnits="userSpaceOnUse"><path d="M0 0 H1.4 M0 0 V1.4" stroke="#f4f6f2" stroke-width=".16" opacity=".8"/></pattern>`);
  const x = PX(0, 0), y = PY(0, 0);
  const b = TOR.b, h = TOR.h, t = -TOR.tief, hn = TOR.hNetz;
  let g = "";
  const flaecheNetz = (pts) => `<path d="M${pts.map((p) => P(p[0], p[1], p[2])).join(" L")} Z" fill="url(#${S.id("netz")})"/><path d="M${pts.map((p) => P(p[0], p[1], p[2])).join(" L")} Z" fill="#ffffff" opacity=".06"/>`;
  g += flaecheNetz([[-b, 0, t], [b, 0, t], [b, hn, t], [-b, hn, t]]);
  g += flaecheNetz([[-b, h, 0], [b, h, 0], [b, hn, t], [-b, hn, t]]);
  g += flaecheNetz([[b, 0, 0], [b, h, 0], [b, hn, t], [b, 0, t]]);
  g += flaecheNetz([[-b, 0, 0], [-b, h, 0], [-b, hn, t], [-b, 0, t]]);
  /* Netzbügel hinten */
  g += `<path d="M${P(-b, 0, t)} L${P(-b, hn, t)} L${P(b, hn, t)} L${P(b, 0, t)}" stroke="#c9ced2" stroke-width=".5" fill="none"/>`;
  g += `<path d="M${P(-b, h, 0)} L${P(-b, hn, t)} M${P(b, h, 0)} L${P(b, hn, t)}" stroke="#c9ced2" stroke-width=".45"/>`;
  S.teil({ id: "tornetz", de: "das Tornetz", syl: "TOR-netz", it: "la rete della porta", itSyl: "RE-te del-la POR-ta", en: "goal net", x, y, kunst: G(x, y, g),
    tipp: "Das Netz fängt den Ball — dann sieht jeder: Tor!" });
}
{
  const x = PX(0, 0), y = PY(0, 0), s = sk(0), b = TOR.b, h = TOR.h, w = 0.12 * s;
  let g = "";
  /* Pfosten und Latte (weiß, rund) */
  for (const X of [-b, b]) g += `<rect x="${r(PX(X, 0) - w / 2)}" y="${r(PY(h, 0) - w / 2)}" width="${r(w)}" height="${r(h * s + w / 2)}" fill="${WEISS}"/>`;
  g += `<rect x="${r(PX(-b, 0) - w / 2)}" y="${r(PY(h, 0) - w / 2)}" width="${r((2 * b) * s + w)}" height="${r(w)}" fill="${S.lg("latte", [[0, "#ffffff"], [1, "#c9ced2"]])}"/>`;
  g += `<ellipse cx="${r(PX(-b, 0))}" cy="${r(PY(0, 0))}" rx="${r(w)}" ry=".5" fill="#000" opacity=".25"/><ellipse cx="${r(PX(b, 0))}" cy="${r(PY(0, 0))}" rx="${r(w)}" ry=".5" fill="#000" opacity=".25"/>`;
  S.teil({ id: "sp_tor", de: "das Tor", syl: "TOR", it: "la porta", itSyl: "POR-ta", en: "goal", x, y, kunst: G(x, y, g),
    tipp: "Das Tor ist 7,32 Meter breit und 2,44 Meter hoch." });
}
{
  const x = PX(HB, 0), y = PY(0, 0), s = sk(0), H = 1.5 * s;
  let k = schatten(0, 0.2, 2, .5, .3) + `<rect x="-.35" y="${r(-H)}" width=".7" height="${r(H)}" fill="${S.lg("stange", [[0, "#ffd84a"], [1, "#c9a020"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M.35 ${r(-H)} Q3 ${r(-H + 0.6)} 5.4 ${r(-H - 0.4)} L5.4 ${r(-H + 3.4)} Q3 ${r(-H + 4.4)} .35 ${r(-H + 3.6)} Z" fill="#e8262e"/><path d="M.35 ${r(-H)} Q3 ${r(-H + 0.6)} 5.4 ${r(-H - 0.4)} L5.4 ${r(-H + 1.4)} Q3 ${r(-H + 2.4)} .35 ${r(-H + 1.8)} Z" fill="#ffd84a"/>`;
  S.teil({ id: "sp_eckfahne", de: "die Eckfahne", syl: "ECK-fah-ne", it: "la bandierina", itSyl: "ban-die-RI-na", en: "corner flag", x, y, kunst: k + flaeche(-1, -H - 1, 7, H + 1),
    tipp: "An der Eckfahne wird der Eckstoß ausgeführt." });
}
{
  /* Torraum: die Linie 5,5 m vor dem Tor (als Teil: der Bereich der Linie) */
  const x = PX(0, 5.5), y = PY(0, 5.5);
  const xa = CX - 160 * dd(5.5) / F;   /* dort tritt die Torraumlinie links aus dem Bild */
  const L = `<path d="M${P(xa, 0, 5.5)} L${P(9.16, 0, 5.5)} L${P(9.16, 0, 0)}" stroke="#f4f6f2" stroke-width="1.2" fill="none"/>`;
  const xl = (Z) => Math.max(0, PX(-9.16, Z));
  const hit = `<path d="M${r(xl(0.2))} ${r(PY(0, 0.2))} L${P(9.16, 0, 0.2)} L${P(9.16, 0, 5.5)} L${r(xl(5.5))} ${r(PY(0, 5.5))} Z" fill="#fff" opacity=".001"/>`;
  S.teil({ id: "torraum", de: "der Torraum", syl: "TOR-raum", it: "l'area di porta", itSyl: "A-re-a di POR-ta", en: "goal area", x, y, kunst: G(x, y, hit + L),
    tipp: "Im Torraum, 5,5 Meter vor dem Tor, ist der Torwart besonders geschützt." });
}

/* =====================================================================
   5 — DIE SPIELERIN (im Tor, Torwarthandschuhe), DER SPIELER mit BALL
   ===================================================================== */
{
  const X = -0.6, Z = 0.5, s = sk(Z);
  const m = B.mensch({ id: "b13e_spielerin", geschlecht: "w", pose: "haende_huefte", blick: -12, frisur: "zopf", haarfarbe: "braun", haut: "mittel",
    kleidung: { oberteil: { stueck: "pullover", farbe: "gelb" }, unterteil: { stueck: "shorts", farbe: "schwarz" }, schuhe: { stueck: "turnschuh", farbe: "schwarz" }, zubehoer: { stueck: "handschuhe", farbe: "gruen_d" } } }, 1.7 * s);
  S.teil({ id: "sp_spielerin", de: "die Spielerin", syl: "SPIE-le-rin", it: "la giocatrice", itSyl: "gio-ca-TRI-ce", en: "player", x: PX(X, Z), y: PY(0, Z), kunst: m.svg,
    tipp: "Heute steht sie im Tor — als Torwart trägt sie ein anderes Trikot und Handschuhe." });
}
{
  const X = 8.4, Z = 5.6, s = sk(Z);
  const m = B.mensch({ id: "b13e_spieler", geschlecht: "m", pose: "laufen", blick: -48, frisur: "kurz", haarfarbe: "schwarz", haut: "dunkel",
    kleidung: { oberteil: { stueck: "tshirt", farbe: "rot" }, unterteil: { stueck: "shorts", farbe: "weiss" }, schuhe: { stueck: "turnschuh", farbe: "schwarz" } } }, 1.8 * s);
  /* Rückennummer-Andeutung */
  S.teil({ id: "sp_spieler", de: "der Spieler", syl: "SPIE-ler", it: "il giocatore", itSyl: "gio-ca-TO-re", en: "player", x: PX(X, Z), y: PY(0, Z), kunst: m.svg,
    tipp: "Er dribbelt durch die Hütchen und schießt dann aufs Tor." });
}
{
  /* Der Ball rollt vor dem Spieler */
  const X = 7.7, Z = 6.3, s = sk(Z), R = 0.11 * s, x = PX(X, Z), y = PY(0, Z);
  let k = schatten(0, 0, R * 1.2, R * 0.3, 0.35);
  k += `<circle cx="0" cy="${r(-R)}" r="${r(R)}" fill="${S.rg("ball", [[0, "#ffffff"], [0.7, "#e8eaec"], [1, "#9aa3aa"]], 0.35, 0.3, 0.8)}"/>`;
  const fuenf = (cx, cy, rr) => { let p = ""; for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i * 2 * Math.PI / 5; p += (i ? " L" : "M") + `${r(cx + Math.cos(a) * rr)} ${r(cy + Math.sin(a) * rr)}`; } return `<path d="${p} Z" fill="#1d1d1d"/>`; };
  k += fuenf(R * 0.1, -R * 1.05, R * 0.34) + fuenf(-R * 0.7, -R * 0.55, R * 0.22) + fuenf(R * 0.75, -R * 0.6, R * 0.2) + fuenf(-R * 0.25, -R * 1.85, R * 0.16);
  S.teil({ oben: true, id: "sp_ball", de: "der Fußball", syl: "FUSS-ball", it: "il pallone", itSyl: "pal-LO-ne", en: "football", x, y, kunst: k + flaeche(-R - 1, -2 * R - 1, 2 * R + 2, 2 * R + 2),
    tipp: "Ein Fußball wiegt etwa 430 Gramm." });
}

/* =====================================================================
   6 — DIE HÜTCHEN (Slalom) — vor dem Spieler
   ===================================================================== */
{
  const pos = [[7.2, 7.3], [8.3, 8.1], [7.0, 8.9], [8.1, 9.6]];
  const x = PX(7.6, 8.5), y = PY(0, 8.5);
  let g = "";
  for (const [X, Z] of pos) {
    const s = sk(Z), cx = PX(X, Z), cy = PY(0, Z), w = 0.1 * s, h = 0.23 * s;
    g += `<ellipse cx="${r(cx)}" cy="${r(cy)}" rx="${r(w * 1.5)}" ry="${r(w * 0.4)}" fill="#d55a0a"/><path d="M${r(cx - w)} ${r(cy)} L${r(cx - w * 0.15)} ${r(cy - h)} L${r(cx + w * 0.15)} ${r(cy - h)} L${r(cx + w)} ${r(cy)} Z" fill="${ORANGE}"/><path d="M${r(cx - w * 0.55)} ${r(cy - h * 0.45)} L${r(cx + w * 0.55)} ${r(cy - h * 0.45)}" stroke="#fff" stroke-width="${r(0.025 * s)}"/>`;
  }
  S.teil({ oben: true, id: "huetchen", de: "das Hütchen", syl: "HÜT-chen", it: "il cinesino", itSyl: "ci-ne-SI-no", en: "training cone", x, y, kunst: G(x, y, g),
    tipp: "Um die Hütchen dribbelt man im Slalom." });
}

/* =====================================================================
   7 — DER TRAINER mit TRILLERPFEIFE (rechts vorne)
   ===================================================================== */
const TR = { X: 11.7, Z: 8.7 };
const trainer = B.mensch({ id: "b13e_trainer", geschlecht: "m", pose: "zeigen", blick: -40, frisur: "kurz", haarfarbe: "grau", haut: "hell", bart: "stoppel",
  kleidung: { oberteil: { stueck: "tshirt", farbe: "weiss" }, jacke: { stueck: "jacke", farbe: "rot" }, unterteil: { stueck: "hose", farbe: "schwarz" }, schuhe: { stueck: "turnschuh", farbe: "weiss" }, kopf: { stueck: "kappe", farbe: "rot" } } }, 1.82 * sk(TR.Z));
{
  S.teil({ id: "sp_trainer", de: "der Trainer", syl: "TRAI-ner", it: "l'allenatore", itSyl: "al-le-na-TO-re", en: "coach", x: PX(TR.X, TR.Z), y: PY(0, TR.Z), kunst: trainer.svg,
    tipp: "Der Trainer zeigt, wie die Übung geht." });
}
{
  const z = trainer.z, k0 = trainer.k, kx = z.kopf.x * k0, ky = z.kopf.y * k0, kr = 11 * k0;
  /* Pfeife hängt an der Kordel vor der Brust */
  const px = kx + kr * 0.2, py = ky + kr * 3.4;
  let k = `<path d="M${r(kx - kr * 0.7)} ${r(ky + kr * 1.3)} Q${r(px - 1)} ${r(py - 2)} ${r(px)} ${r(py - 0.6)} Q${r(px + 1)} ${r(py - 2)} ${r(kx + kr * 0.7)} ${r(ky + kr * 1.3)}" stroke="#1d1d1d" stroke-width=".3" fill="none"/>`;
  k += `<rect x="${r(px - 1.6)}" y="${r(py - 0.6)}" width="2.6" height="1.5" rx=".7" fill="${S.lg("pfeife", [[0, "#f1f3f4"], [0.5, "#9aa3aa"], [1, "#e1e5e8"]])}"/><rect x="${r(px + 0.8)}" y="${r(py - 0.4)}" width="1.4" height=".9" fill="#c9ced2"/>`;
  S.teil({ oben: true, id: "sp_pfeife", de: "die Trillerpfeife", syl: "TRIL-ler-pfei-fe", it: "il fischietto", itSyl: "fi-SCHIET-to", en: "whistle", x: PX(TR.X, TR.Z), y: PY(0, TR.Z), kunst: k + flaeche(px - 3, py - 2.5, 6, 4.5),
    tipp: "Ein Pfiff — und alle hören zu." });
}

/* =====================================================================
   8 — DIE WASSERFLASCHE (Flaschenträger) und DIE SPORTTASCHE (Lupe)
   ===================================================================== */
{
  const X = 9.0, Z = 9.3, s = sk(Z), x = PX(X, Z), y = PY(0, Z), W = 0.42 * s, H = 0.12 * s;
  let k = schatten(0, 0.3, W / 2 + 2, 1.2, 0.3);
  /* Flaschenträger (Kunststoffkorb) mit sechs Trinkflaschen */
  for (let i = 0; i < 6; i++) {
    const bx = -W / 2 + W * (i + 0.5) / 6, bh = 0.24 * s, bw = W / 7;
    k += `<rect x="${r(bx - bw / 2)}" y="${r(-H - bh)}" width="${r(bw)}" height="${r(bh)}" rx="${r(bw * 0.25)}" fill="${S.lg("flasche" + (i % 2), i % 2 ? [[0, "#2a5ea8"], [0.5, "#5a8ed8"], [1, "#1d4580"]] : [[0, "#b3261e"], [0.5, "#e2534a"], [1, "#7e1a14"]], 0, 0, 1, 0)}"/>`;
    k += `<rect x="${r(bx - bw * 0.3)}" y="${r(-H - bh - bw * 0.5)}" width="${r(bw * 0.6)}" height="${r(bw * 0.55)}" rx=".3" fill="#f4f1ea"/>`;
  }
  k += `<rect x="${r(-W / 2 - 1)}" y="${r(-H - 0.08 * s)}" width="${r(W + 2)}" height="${r(H + 0.08 * s)}" rx="1" fill="${S.lg("korb", [[0, "#3a3f45"], [1, "#1d2125"]])}"/>`;
  k += `<path d="M${r(-W / 2 + 1)} ${r(-H - 0.08 * s)} Q0 ${r(-H - 0.45 * s)} ${r(W / 2 - 1)} ${r(-H - 0.08 * s)}" stroke="#3a3f45" stroke-width="1" fill="none"/>`;
  S.teil({ id: "sp_wasserflasche", de: "die Wasserflasche", syl: "WAS-ser-fla-sche", it: "la bottiglia d'acqua", itSyl: "bot-TI-glia d'AC-qua", en: "water bottle", x, y, steht: true, kunst: k,
    tipp: "Beim Training viel trinken — jeder hat seine eigene Flasche." });
}
{
  const X = 10.0, Z = 9.75, s = sk(Z), x = PX(X, Z), y = PY(0, Z), W = 0.62 * s, H = 0.3 * s;
  let k = schatten(0, 0.4, W / 2 + 3, 1.6, 0.32);
  k += `<path d="M${r(-W / 2)} 0 Q${r(-W / 2 - 2)} ${r(-H / 2)} ${r(-W / 2 + 2)} ${r(-H)} L${r(W / 2 - 2)} ${r(-H)} Q${r(W / 2 + 2)} ${r(-H / 2)} ${r(W / 2)} 0 Z" fill="${S.lg("tasche", [[0, "#2b2f33"], [1, "#16191c"]])}"/>`;
  k += `<path d="M${r(-W / 2 + 3)} ${r(-H)} L${r(W / 2 - 3)} ${r(-H)}" stroke="#b3261e" stroke-width="1.2"/><path d="M${r(-W * 0.25)} ${r(-H)} Q0 ${r(-H - 10)} ${r(W * 0.25)} ${r(-H)}" stroke="#2b2f33" stroke-width="1.4" fill="none"/>`;
  k += `<text x="0" y="${r(-H * 0.35)}" font-size="${r(0.06 * s)}" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">SV RW</text>`;
  const unter = [];
  /* Trikot liegt gefaltet oben auf der Tasche */
  {
    const tx = -W * 0.18, ty = -H - 0.5;
    k += `<path d="M${r(tx - 9)} ${r(ty)} L${r(tx - 7)} ${r(ty - 3.2)} L${r(tx - 3)} ${r(ty - 4)} Q${r(tx)} ${r(ty - 2.6)} ${r(tx + 3)} ${r(ty - 4)} L${r(tx + 7)} ${r(ty - 3.2)} L${r(tx + 9)} ${r(ty)} Z" fill="#d0021b"/><text x="${r(tx)}" y="${r(ty - 0.6)}" font-size="2.6" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">10</text>`;
    unter.push({ id: "sp_trikot", de: "das Trikot", syl: "TRI-kot", it: "la maglia", itSyl: "MA-glia", en: "shirt", tipp: "Das Trikot hat die Farben des Vereins und eine Rückennummer.", x: x + tx, y: y + ty, kunst: flaeche(-10, -5, 20, 6) });
  }
  /* Schienbeinschoner lehnen an der Tasche */
  {
    const tx = W * 0.32, ty = -0.4;
    k += `<path d="M${r(tx - 2)} ${r(ty)} Q${r(tx - 3)} ${r(ty - 5)} ${r(tx - 1)} ${r(ty - 8)} L${r(tx + 1.6)} ${r(ty - 8)} Q${r(tx + 2.4)} ${r(ty - 4)} ${r(tx + 1.4)} ${r(ty)} Z" fill="#f4f1ea" stroke="#9aa3aa" stroke-width=".3"/><path d="M${r(tx + 1)} ${r(ty)} Q${r(tx + 0.4)} ${r(ty - 5)} ${r(tx + 2.4)} ${r(ty - 8)} L${r(tx + 5)} ${r(ty - 8)} Q${r(tx + 5.6)} ${r(ty - 4)} ${r(tx + 4.4)} ${r(ty)} Z" fill="#e9ecee" stroke="#9aa3aa" stroke-width=".3"/><rect x="${r(tx - 1.6)}" y="${r(ty - 6)}" width="3" height=".9" fill="#2a5ea8"/>`;
    unter.push({ id: "schienbeinschoner", de: "der Schienbeinschoner", syl: "SCHIEN-bein-scho-ner", it: "il parastinchi", itSyl: "pa-ra-STIN-chi", en: "shin guard", tipp: "Schienbeinschoner schützen die Beine vor Tritten.", x: x + tx + 1.8, y: y + ty, kunst: flaeche(-5, -9, 10, 9.5) });
  }
  /* Torwarthandschuhe vor der Tasche */
  {
    const tx = -W * 0.42, ty = 1.4;
    for (const [dx, f] of [[0, "#2f7f3a"], [3.4, "#3a9a48"]]) k += `<path d="M${r(tx + dx - 1.6)} ${r(ty)} L${r(tx + dx - 1.8)} ${r(ty - 3)} L${r(tx + dx - 1.2)} ${r(ty - 5.6)} L${r(tx + dx - 0.4)} ${r(ty - 3.4)} L${r(tx + dx)} ${r(ty - 6)} L${r(tx + dx + 0.6)} ${r(ty - 3.4)} L${r(tx + dx + 1.4)} ${r(ty - 5.4)} L${r(tx + dx + 1.8)} ${r(ty - 2.6)} L${r(tx + dx + 1.6)} ${r(ty)} Z" fill="${f}" stroke="#1d4a24" stroke-width=".2"/><rect x="${r(tx + dx - 1.7)}" y="${r(ty - 1)}" width="3.4" height="1" fill="#f4f1ea"/>`;
    unter.push({ id: "torwarthandschuhe", de: "die Torwarthandschuhe", syl: "TOR-wart-hand-schu-he", it: "i guanti da portiere", itSyl: "GUAN-ti da por-TIE-re", en: "goalkeeper gloves", tipp: "Mit den dicken Handschuhen hält der Torwart den Ball fest.", x: x + tx + 1.7, y: y + ty, kunst: flaeche(-4.5, -7, 9, 7.5) });
  }
  S.teil({ id: "sporttasche", de: "die Sporttasche", syl: "SPORT-ta-sche", it: "la borsa sportiva", itSyl: "BOR-sa spor-TI-va", en: "sports bag", x, y, steht: true, kunst: k,
    zoom: { x: r(x - W / 2 - 10), y: r(y - H - 18), w: r(W + 20), h: r((W + 20) / 1.5) }, unter,
    tipp: "In der Sporttasche: Trikot, Schienbeinschoner und Handschuhe." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/sportplatz.js"));
console.log(aus);
