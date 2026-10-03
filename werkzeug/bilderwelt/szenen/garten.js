#!/usr/bin/env node
/* =====================================================================
   DER GARTEN (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   XANDER (Funk 263/286): jeder Ort authentisch wie das echte Vorbild,
   alles logisch platziert, jedes Ding einzeln antippbar, nichts blockiert.

   RECHERCHE (Gartenplaner gartenjournal.net „Familiengarten“, Hausbau-
   Forum, Planungshinweise Landkreis Erding; Durchschnittsgarten in
   Deutschland ≈ 340 m²) — so sieht der Garten HINTER DEM
   EINFAMILIENHAUS aus:
   - Am Haus die TERRASSE (Betonplatten/Feinsteinzeug) vor der großen
     Terrassentür, darauf GARTENTISCH, GARTENSTÜHLE und SONNENSCHIRM;
     die Fenster haben Rollläden, am Fallrohr die REGENTONNE.
   - Davor der RASEN (gemäht, mit Mähstreifen), der RASENMÄHER.
   - An der Grundstücksgrenze links eine HECKE (Liguster/Thuja, ≈ 1,8 m),
     rechts ein Holzlattenzaun (≈ 1 m) mit GARTENTOR zum Seitenweg; dahinter
     die Thujahecke des Nachbarn.
   - Ein OBSTBAUM (Apfel, Halbstamm), oft mit VOGELHÄUSCHEN am Ast.
   - HOCHBEET (≈ 0,8 m) mit Salat, Möhren, Erdbeeren; in der Ecke der
     KOMPOSTER; SCHUBKARRE, HARKE, SPATEN/SCHAUFEL, GIESSKANNE, GARTEN-
     SCHLAUCH.
   - Kleiner Gartenteich mit Seerosen und Randsteinen, ein GARTENZWERG,
     eine GARTENBANK, ein Staudenbeet mit BLUMEN.
   Maßstab: Augenhöhe y = 95 (Auge 1,6 m), Brennweite 230 → Einheiten je
   Meter = 230 / Entfernung. Die „Plätze“ (Baum, Bank, Tor, freier Rasen)
   liegen 5,5–5,8 m vor dem Auge: ≈ 40–42 Einheiten je Meter, also ist eine
   Spielfigur von 74 Einheiten ein Erwachsener (≈ 1,75 m). Gartentor 1 m,
   Banksitz 0,45 m, Apfelbaum ≈ 3,8 m. Das Haus steht 19 m entfernt.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "garten", titel: "Der Garten", emoji: "🌳", thema: "Draußen", kuerzel: "gtn", fassung: 852 });
const rnd = zufall(4711);
const r = B.r;

const VX = 160, VY = 95, F = 230, AUGE = 1.6;
const sk = (d) => F / d;
const PX = (xw, d) => VX + xw * F / d;
const PY = (h, d) => VY + (AUGE - h) * F / d;
const P = (xw, h, d) => `${r(PX(xw, d))} ${r(PY(h, d))}`;
/* Vieleck an der Bildfläche abschneiden (Sutherland–Hodgman), damit nichts aus dem Bild ragt */
const schneide = (pts) => {
  const kante = (pp, innen, schnitt) => { const o = []; for (let i = 0; i < pp.length; i++) { const a = pp[i], b = pp[(i + 1) % pp.length]; const ia = innen(a), ib = innen(b); if (ia) o.push(a); if (ia !== ib) o.push(schnitt(a, b)); } return o; };
  const lerpX = (a, b, x) => [x, a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0])];
  const lerpY = (a, b, y) => [a[0] + (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]), y];
  let q = pts;
  q = kante(q, (a) => a[0] >= 0, (a, b) => lerpX(a, b, 0)); if (!q.length) return q;
  q = kante(q, (a) => a[0] <= 320, (a, b) => lerpX(a, b, 320)); if (!q.length) return q;
  q = kante(q, (a) => a[1] <= 200, (a, b) => lerpY(a, b, 200));
  return q;
};
const pfad = (pts) => pts.length ? "M" + pts.map((a) => r(a[0]) + " " + r(a[1])).join(" L") + " Z" : "";
const PP = (xw, h, d) => [PX(xw, d), PY(h, d)];
const G = (X, Y, svg) => `<g transform="translate(${r(-X)} ${r(-Y)})">${svg}</g>`;

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("dunst")}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation=".5"/></filter>`);
const HOLZ = S.lg("holz", [[0, "#b98a57"], [0.5, "#a0703f"], [1, "#835a31"]], 0, 0, 1, 0);
const HOLZ_G = S.lg("holzgrau", [[0, "#b9a888"], [1, "#94846a"]]);
const LAUB = S.rg("laub", [[0, "#9cc463"], [0.55, "#5f9140"], [1, "#2f5a24"]], 0.42, 0.32, 0.75);
const LAUB_D = S.rg("laubd", [[0, "#6f9e48"], [0.6, "#43732f"], [1, "#24461b"]], 0.45, 0.35, 0.75);
const ERDE = S.lg("erde", [[0, "#4f3522"], [1, "#6e4c31"]]);
const APFEL = S.rg("apfel", [[0, "#ff9a78"], [0.55, "#d3302a"], [1, "#8a1712"]], 0.35, 0.3, 0.75);
const THUJA = S.lg("thuja", [[0, "#3f6a35"], [1, "#2a4a26"]]);
const LIGUSTER = S.lg("liguster", [[0, "#6a9a48"], [0.5, "#4f8238"], [1, "#355f28"]]);
const STAHL = S.lg("stahl", [[0, "#eef1f3"], [0.45, "#c9cfd4"], [0.55, "#aeb6bd"], [1, "#e1e5e8"]], 0, 0, 1, 0);
S.def(`<pattern id="${S.id("gras")}" width="3" height="2.4" patternUnits="userSpaceOnUse"><rect width="3" height="2.4" fill="#76a548"/><path d="M.4 2.4 l.2 -1.3 M1.3 2.4 l-.2 -1.1 M2.2 2.4 l.3 -1.5" stroke="#5c8d38" stroke-width=".3"/><path d="M.9 2.4 l.1 -.9 M2.7 2.4 l-.1 -1" stroke="#9cc966" stroke-width=".25"/></pattern>`);
S.def(`<pattern id="${S.id("blatt")}" width="4" height="3.4" patternUnits="userSpaceOnUse"><rect width="4" height="3.4" fill="#4c7d36"/><ellipse cx="1" cy=".9" rx="1.1" ry=".7" fill="#679a47"/><ellipse cx="3" cy="2.3" rx="1.2" ry=".8" fill="#5a8c3e"/><ellipse cx="1.2" cy="2.9" rx=".9" ry=".5" fill="#3a6629"/></pattern>`);
S.def(`<pattern id="${S.id("thujam")}" width="3" height="4" patternUnits="userSpaceOnUse"><rect width="3" height="4" fill="#34592d"/><path d="M1.5 0 l-1 2 M1.5 1 l1 2 M.5 2 l1 2" stroke="#4d7a3e" stroke-width=".5"/></pattern>`);

/* =====================================================================
   KULISSE — Himmel, Nachbarschaft, Seitenweg hinter dem Zaun
   ===================================================================== */
S.hinten(`<rect x="0" y="0" width="320" height="130" fill="${S.lg("himmel", [[0, "#6fa6dc"], [0.55, "#a9cdee"], [1, "#e6f0f6"]])}"/>`);
/* Hintergrund: Baumkronen und Dächer der Nachbarhäuser am Horizont */
{
  let b = "";
  for (let i = 0; i < 22; i++) { const x = i * 15.5 + rnd() * 8, h = 14 + rnd() * 14; b += `<ellipse cx="${r(x)}" cy="${r(94 - h / 2)}" rx="${r(8 + rnd() * 6)}" ry="${r(h / 2 + 2)}" fill="${rnd() < 0.5 ? "#86a77a" : "#779a6c"}"/>`; }
  /* Nachbarhaus rechts (über der Thujahecke) */
  b += `<rect x="232" y="64" width="58" height="30" fill="#e8dfd0"/><path d="M226 66 L261 44 L296 66 Z" fill="#9a4f3a"/><path d="M226 66 L261 44 L296 66" stroke="#7a3a2a" stroke-width=".6" fill="none"/>`;
  for (const x of [240, 256, 272]) b += `<rect x="${x}" y="72" width="8" height="9" fill="#9fb4c4"/><rect x="${x}" y="72" width="8" height="3" fill="#8a8f96"/>`;
  b += `<rect x="0" y="80" width="320" height="16" fill="${S.lg("dunst", [[0, "#e6f0f6", 0.0], [1, "#e6f0f6", 0.45]])}"/>`;
  S.hinten(b);
}
/* Boden überall (keine Lücken): Rasengrün */
S.hinten(`<rect x="0" y="94" width="320" height="106" fill="#6f9c45"/>`);
/* Hinter dem Zaun rechts: Plattenweg (Seitenweg zum Vorgarten) und die Thujahecke des Nachbarn */
{
  let w = `<path d="M${P(3.35, 0, 30)} L${P(4.55, 0, 30)} L${P(4.55, 0, 3.6)} L${P(3.35, 0, 3.6)} Z" fill="${S.lg("weg", [[0, "#b8b2a6"], [1, "#9e978a"]])}"/>`;
  for (let d = 4; d < 30; d += 0.5) w += `<path d="M${P(3.35, 0, d)} L${P(4.55, 0, d)}" stroke="#7f786c" stroke-width="${r(Math.min(0.5, 0.02 * sk(d)))}"/>`;
  w += `<path d="M${P(3.95, 0, 30)} L${P(3.95, 0, 3.6)}" stroke="#7f786c" stroke-width=".4"/>`;
  /* Thujahecke 2 m, Innenseite sichtbar */
  let h = `M${P(4.6, 0, 30)}`;
  for (let d = 30; d >= 4.2; d *= 0.93) h += ` L${P(4.6, 2.0 + (rnd() - 0.5) * 0.08, d)}`;
  h += ` L${P(4.6, 2.0, 4.2)} L${P(4.6, 0, 4.2)} Z`;
  w += `<path d="${h}" fill="url(#${S.id("thujam")})"/><path d="${h}" fill="${S.lg("thujalicht", [[0, "#9ccf7a", 0.25], [0.5, "#000", 0], [1, "#000", 0.25]], 0, 0, 1, 0)}"/>`;
  S.hinten(w);
}

/* =====================================================================
   1 — DIE SONNE und DIE WOLKE
   ===================================================================== */
{
  let k = `<circle r="22" fill="${S.rg("sonnenhof", [[0, "#fff6c8", 0.75], [0.45, "#fff2b0", 0.25], [1, "#fff2b0", 0]])}"/>`;
  k += `<circle r="9" fill="${S.rg("sonne", [[0, "#fffbe6"], [0.6, "#ffe680"], [1, "#ffd23f"]])}"/>`;
  S.teil({ id: "sonne", de: "die Sonne", syl: "SON-ne", it: "il sole", itSyl: "SO-le", en: "sun", x: 292, y: 28, kunst: k + flaecheEllipse(0, 0, 11, 11) });
}
{
  const W = S.lg("wolke", [[0, "#ffffff"], [0.7, "#f3f7fa"], [1, "#d9e4ec"]]);
  let k = "";
  for (const [x, y, rx, ry] of [[-14, 2, 10, 6], [-4, -3, 11, 8], [8, -1, 10, 7], [17, 3, 8, 5], [2, 4, 18, 5]]) k += `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${W}"/>`;
  S.teil({ id: "wolke", de: "die Wolke", syl: "WOL-ke", it: "la nuvola", itSyl: "NU-vo-la", en: "cloud", x: 236, y: 24, kunst: k });
}

/* =====================================================================
   2 — DAS HAUS (Rückseite des Einfamilienhauses, 19 m entfernt)
   ===================================================================== */
const HAUS = { d: 19, xa: -6.8, xb: 2.4, traufe: 5.8 };
{
  const { d, xa, xb } = HAUS, Y = PY(0, d), X = PX((xa + xb) / 2, d);
  const x0 = PX(xa, d), x1 = PX(xb, d);
  let g = "";
  /* Dach: Traufe 0,5 m vor der Wand, First 5,5 m dahinter, Dachziegel rotbraun */
  const T = (t, xw) => P(xw, 5.7 + t * 4.4, 18.5 + t * 6);
  g += `<path d="M${T(0, xa - 0.5)} L${T(0, xb + 0.5)} L${T(1, xb + 0.5)} L${T(1, xa - 0.5)} Z" fill="${S.lg("dach", [[0, "#7d3427"], [0.5, "#9b4632"], [1, "#b2563b"]])}"/>`;
  for (let i = 1; i < 14; i++) { const t = i / 14; g += `<path d="M${T(t, xa - 0.5)} L${T(t, xb + 0.5)}" stroke="#5e241a" stroke-width=".35" opacity=".7"/>`; }
  for (let xw = xa - 0.3; xw < xb + 0.5; xw += 0.3) g += `<path d="M${T(0, xw)} L${T(1, xw)}" stroke="#6e2c20" stroke-width=".18" opacity=".5"/>`;
  /* Dachflächenfenster und Schornstein */
  g += `<path d="M${T(0.32, -4.4)} L${T(0.32, -3.4)} L${T(0.58, -3.4)} L${T(0.58, -4.4)} Z" fill="#4a4f55"/><path d="M${T(0.35, -4.3)} L${T(0.35, -3.5)} L${T(0.55, -3.5)} L${T(0.55, -4.3)} Z" fill="${S.lg("dfenster", [[0, "#cfe3f0"], [1, "#7c9db5"]])}"/>`;
  const sx = PX(0.9, 22.5), sy = PY(8.95, 22.5), sw = 0.6 * sk(22.5), sh = 1.6 * sk(22.5);
  g += `<rect x="${r(sx - sw / 2)}" y="${r(sy - sh)}" width="${r(sw)}" height="${r(sh)}" fill="#8a7f78"/><rect x="${r(sx - sw / 2 - 0.6)}" y="${r(sy - sh - 1)}" width="${r(sw + 1.2)}" height="1.2" fill="#5d5550"/>`;
  /* Ortgang und Dachrinne */
  g += `<path d="M${T(0, xa - 0.5)} L${T(1, xa - 0.5)}" stroke="#ece6da" stroke-width=".9"/><path d="M${T(0, xb + 0.5)} L${T(1, xb + 0.5)}" stroke="#ece6da" stroke-width=".9"/>`;
  g += `<path d="M${T(0, xa - 0.5)} L${T(0, xb + 0.5)}" stroke="#9aa1a7" stroke-width="1.6"/>`;
  /* Wand: weißer Putz, grauer Sockel */
  const yt = PY(HAUS.traufe, d);
  g += `<rect x="${r(x0)}" y="${r(yt)}" width="${r(x1 - x0)}" height="${r(Y - yt)}" fill="${S.lg("putz", [[0, "#f1ece2"], [1, "#e4dccd"]])}"/>`;
  g += `<rect x="${r(x0)}" y="${r(yt)}" width="${r(x1 - x0)}" height="4" fill="#000" opacity=".1"/>`;
  g += `<rect x="${r(x0)}" y="${r(PY(0.4, d))}" width="${r(x1 - x0)}" height="${r(0.4 * sk(d))}" fill="#9c968c"/>`;
  /* Fenster mit Rollläden: Obergeschoss */
  const fenster = (xw0, xw1, h0, h1, rolle) => {
    const a = PX(xw0, d), b = PX(xw1, d), o = PY(h1, d), u = PY(h0, d);
    let f = `<rect x="${r(a - 0.6)}" y="${r(o - 0.6)}" width="${r(b - a + 1.2)}" height="${r(u - o + 1.2)}" fill="#fbfbf9"/>`;
    f += `<rect x="${r(a)}" y="${r(o)}" width="${r(b - a)}" height="${r(u - o)}" fill="${S.lg("scheibe", [[0, "#dbe9f2"], [0.5, "#8fb0c6"], [1, "#56768c"]])}"/>`;
    f += `<path d="M${r(a)} ${r(u)} L${r(a + (b - a) * 0.5)} ${r(o)} L${r(a + (b - a) * 0.7)} ${r(o)} L${r(a + (b - a) * 0.2)} ${r(u)} Z" fill="#fff" opacity=".22"/>`;
    f += `<line x1="${r((a + b) / 2)}" y1="${r(o)}" x2="${r((a + b) / 2)}" y2="${r(u)}" stroke="#fbfbf9" stroke-width=".6"/>`;
    if (rolle) { const rh = (u - o) * rolle; f += `<rect x="${r(a)}" y="${r(o)}" width="${r(b - a)}" height="${r(rh)}" fill="#8b9096"/>`; for (let y = o + 0.7; y < o + rh; y += 0.7) f += `<line x1="${r(a)}" y1="${r(y)}" x2="${r(b)}" y2="${r(y)}" stroke="#6f747a" stroke-width=".18"/>`; }
    f += `<rect x="${r(a - 0.8)}" y="${r(u + 0.4)}" width="${r(b - a + 1.6)}" height=".8" fill="#c9c4bb"/>`;
    return f;
  };
  g += fenster(-6.1, -5.0, 3.85, 5.15, 0.3) + fenster(-3.8, -2.4, 3.85, 5.15, 0.0) + fenster(-1.2, 0.2, 3.85, 5.15, 0.55) + fenster(1.0, 1.9, 3.85, 5.15, 0.15);
  /* Erdgeschoss: Küchenfenster rechts, große Terrassentür links */
  g += fenster(-0.4, 1.0, 1.0, 2.2, 0.1);
  {
    const a = PX(-4.9, d), b = PX(-2.5, d), o = PY(2.25, d), u = PY(0.05, d);
    g += `<rect x="${r(a - 0.8)}" y="${r(o - 0.8)}" width="${r(b - a + 1.6)}" height="${r(u - o + 0.8)}" fill="#4a4f55"/>`;
    g += `<rect x="${r(a)}" y="${r(o)}" width="${r(b - a)}" height="${r(u - o)}" fill="${S.lg("tuerglas", [[0, "#cfe1ec"], [0.45, "#7e9db3"], [1, "#3f5566"]])}"/>`;
    g += `<rect x="${r(a + (b - a) * 0.08)}" y="${r(o + (u - o) * 0.3)}" width="${r((b - a) * 0.36)}" height="${r((u - o) * 0.6)}" fill="#e9e0cf" opacity=".35"/>`;
    g += `<line x1="${r((a + b) / 2)}" y1="${r(o)}" x2="${r((a + b) / 2)}" y2="${r(u)}" stroke="#4a4f55" stroke-width=".9"/>`;
    g += `<path d="M${r(a + 2)} ${r(u)} L${r(a + 10)} ${r(o)} L${r(a + 13)} ${r(o)} L${r(a + 5)} ${r(u)} Z" fill="#fff" opacity=".2"/>`;
    g += `<rect x="${r((a + b) / 2 - 2)}" y="${r(o + (u - o) * 0.5)}" width=".6" height="2.4" fill="#d8dce0"/>`;
    /* Rollladenkasten / Sturz */
    g += `<rect x="${r(a - 0.8)}" y="${r(o - 2.2)}" width="${r(b - a + 1.6)}" height="1.4" fill="#8b9096"/>`;
  }
  /* Außenlampe neben der Tür und Fallrohr links */
  g += `<rect x="${r(PX(-2.2, d))}" y="${r(PY(2.05, d))}" width="1.6" height="2.4" rx=".4" fill="#3b3f44"/><rect x="${r(PX(-2.2, d) + 0.3)}" y="${r(PY(2.05, d) + 0.5)}" width="1" height="1.4" fill="#fff4cf"/>`;
  g += `<rect x="${r(x0 + 1)}" y="${r(PY(5.7, d))}" width="1.3" height="${r(Y - PY(5.7, d) - 0.12 * sk(d) * 8)}" fill="#a8afb4"/>`;
  S.teil({ id: "haus", de: "das Haus", syl: "HAUS", it: "la casa", itSyl: "CA-sa", en: "house", x: X, y: Y, kunst: G(X, Y, g),
    tipp: "Der Garten liegt hinter dem Haus. Durch die große Tür geht man auf die Terrasse." });
}

/* =====================================================================
   3 — DIE HECKE (links an der Grundstücksgrenze, Liguster, 1,8 m)
   ===================================================================== */
{
  const xw = -6.8, dv = 9.36, dh = HAUS.d, Y = PY(0, 12), X = PX(xw, 12);
  let o = `M${P(xw + 0.3, 0, dh)}`;
  for (let d = dh; d >= dv; d *= 0.965) o += ` L${P(xw + 0.25, 1.8 + (rnd() - 0.5) * 0.12, d)}`;
  o += ` L${P(xw + 0.25, 1.8, dv)} L${P(xw + 0.3, 0, dv)} Z`;
  let g = `<path d="${o}" fill="${LIGUSTER}"/><path d="${o}" fill="url(#${S.id("blatt")})" opacity=".55"/>`;
  g += `<path d="${o}" fill="${S.lg("heckeschatten", [[0, "#000", 0.25], [0.6, "#000", 0.05], [1, "#fff6d0", 0.12]], 0, 0, 1, 0)}"/>`;
  g += `<path d="M${P(xw + 0.3, 0, dh)} L${P(xw + 0.3, 0, dv)}" stroke="#2a4a20" stroke-width="1.2" opacity=".5"/>`;
  S.teil({ id: "hecke", de: "die Hecke", syl: "HE-cke", it: "la siepe", itSyl: "SIE-pe", en: "hedge", x: X, y: Y, kunst: G(X, Y, g),
    tipp: "Die Hecke trennt den Garten vom Nachbarn. Sie wird zweimal im Jahr geschnitten." });
}

/* =====================================================================
   4 — DAS GRAS (der Rasen) — von der Terrasse bis ganz nach vorn
   ===================================================================== */
const ZAUN_X = 3.3;
{
  const X = VX, Y = PY(0, 7);
  const links = [[PX(-6.5, HAUS.d), PY(0, HAUS.d)], [PX(-6.5, 9.36), PY(0, 9.36)]];
  const dz = ZAUN_X * F / 160;   // wo der Zaunfuß den rechten Bildrand trifft
  let g = `<path d="M0 ${r(links[1][1])} L${r(links[1][0])} ${r(links[1][1])} L${r(links[0][0])} ${r(links[0][1])} L${P(ZAUN_X, 0, HAUS.d)} L320 ${r(PY(0, dz))} L320 200 L0 200 Z" fill="url(#${S.id("gras")})"/>`;
  /* Mähstreifen, zum Fluchtpunkt hin */
  for (let i = -8; i <= 6; i++) {
    if (i % 2) continue;
    const a = i * 0.7, b = a + 0.7;
    const q = schneide([PP(a, 0, HAUS.d - 2), PP(b, 0, HAUS.d - 2), PP(b, 0, 3.2), PP(a, 0, 3.2)]);
    if (q.length) g += `<path d="${pfad(q)}" fill="#c8e88a" opacity=".13"/>`;
  }
  g += `<rect x="0" y="${r(PY(0, HAUS.d))}" width="320" height="${r(200 - PY(0, HAUS.d))}" fill="${S.lg("rasenlicht", [[0, "#1d3315", 0.22], [0.35, "#1d3315", 0], [1, "#fff6d8", 0.08]])}"/>`;
  /* Gänseblümchen im Rasen */
  for (let i = 0; i < 14; i++) { const d = 3.6 + rnd() * 6, xw = -3 + rnd() * 5.5, s = sk(d); if (PX(xw, d) < 4 || PX(xw, d) > 300) continue; g += `<circle cx="${r(PX(xw, d))}" cy="${r(PY(0.02, d))}" r="${r(0.008 * s + 0.1)}" fill="#fbfbf4" opacity=".85"/>`; }
  S.teil({ id: "gras", de: "das Gras", syl: "GRAS", it: "l'erba", itSyl: "ER-ba", en: "grass", x: X, y: Y, kunst: G(X, Y, g),
    tipp: "Das Gras im Garten heißt Rasen. Im Sommer mäht man ihn jede Woche." });
}

/* =====================================================================
   5 — DIE REGENTONNE (am Fallrohr, linke Hausecke) und DER KOMPOSTER
   ===================================================================== */
{
  const d = 18.4, s = sk(d), X = PX(-6.25, d), Y = PY(0, d), H = 1.0 * s, W = 0.62 * s;
  let k = schatten(0, 0.3, W / 2 + 1.2, 0.9, 0.3);
  k += `<path d="M${r(-W / 2)} ${r(-H)} Q${r(-W / 2 - 0.9)} ${r(-H / 2)} ${r(-W / 2)} 0 L${r(W / 2)} 0 Q${r(W / 2 + 0.9)} ${r(-H / 2)} ${r(W / 2)} ${r(-H)} Z" fill="${S.lg("tonne", [[0, "#2c5a34"], [0.4, "#55905a"], [1, "#22462a"]], 0, 0, 1, 0)}"/>`;
  for (const t of [0.28, 0.72]) k += `<path d="M${r(-W / 2 - 0.4)} ${r(-H * t)} Q0 ${r(-H * t + 0.9)} ${r(W / 2 + 0.4)} ${r(-H * t)}" stroke="#1d3a22" stroke-width=".4" fill="none"/>`;
  k += `<ellipse cx="0" cy="${r(-H)}" rx="${r(W / 2)}" ry="1" fill="#1d3a22"/><ellipse cx="0" cy="${r(-H + 0.2)}" rx="${r(W / 2 - 0.6)}" ry=".6" fill="#55707c"/>`;
  /* Fallrohr-Abzweig in die Tonne */
  k += `<path d="M${r(-W / 2 - 1.8)} ${r(-H - 6)} L${r(-W / 2 - 1.8)} ${r(-H - 1.5)} L${r(-1)} ${r(-H - 0.4)}" stroke="#a8afb4" stroke-width="1.1" fill="none"/>`;
  k += `<rect x="${r(W / 2 - 2.2)}" y="${r(-H * 0.18)}" width="1.6" height=".8" fill="#c9a13f"/>`;
  S.teil({ id: "regentonne", de: "die Regentonne", syl: "RE-gen-ton-ne", it: "il bidone dell'acqua piovana", itSyl: "bi-DO-ne del-l'AC-qua pio-VA-na", en: "rain barrel", x: X, y: Y, steht: true, kunst: k,
    tipp: "Das Regenwasser vom Dach ist kostenlos — und die Pflanzen mögen es lieber als Leitungswasser." });
}
{
  const d = 13.4, s = sk(d), X = PX(-6.0, d), Y = PY(0, d), W = 0.95 * s, H = 0.8 * s, T = 0.16 * s;
  let k = schatten(0, 0.3, W / 2 + 1.5, 1.1, 0.3);
  k += `<path d="M${r(-W / 2)} ${r(-H)} L${r(W / 2)} ${r(-H)} L${r(W / 2 - 2)} ${r(-H - T)} L${r(-W / 2 + 2)} ${r(-H - T)} Z" fill="${ERDE}"/>`;
  for (let i = 0; i < 12; i++) k += `<ellipse cx="${r(-W / 2 + 2.5 + rnd() * (W - 5))}" cy="${r(-H - rnd() * T * 0.8)}" rx=".9" ry=".4" fill="${["#7a9a3a", "#c9a13f", "#e2d2a6", "#5a7a2a"][i % 4]}"/>`;
  for (let i = 0; i < 5; i++) k += `<rect x="${r(-W / 2)}" y="${r(-H + i * H / 5)}" width="${r(W)}" height="${r(H / 5 - 0.6)}" fill="${S.lg("kompostholz", [[0, "#a8834e"], [1, "#7a5a32"]])}"/>`;
  for (const x of [-W / 2 - 0.4, W / 2 - 1.4]) k += `<rect x="${r(x)}" y="${r(-H - 0.8)}" width="1.8" height="${r(H + 0.8)}" fill="#664a28"/>`;
  S.teil({ id: "komposter", de: "der Komposter", syl: "kom-POS-ter", it: "la compostiera", itSyl: "com-po-STIE-ra", en: "compost bin", x: X, y: Y, steht: true, kunst: k,
    tipp: "Rasenschnitt, Laub und Gemüsereste kommen hinein. Nach einem Jahr ist daraus gute Erde geworden." });
}

/* =====================================================================
   6 — DIE TERRASSE vor der Terrassentür (Lupe: Tisch, Stühle, Schirm)
   ===================================================================== */
const TER = { d0: 15.6, d1: HAUS.d, xa: -6.0, xb: -1.4 };
{
  const { d0, d1, xa, xb } = TER, X = PX((xa + xb) / 2, d0), Y = PY(0, d0);
  let g = `<path d="M${P(xa, 0.03, d1)} L${P(xb, 0.03, d1)} L${P(xb, 0.03, d0)} L${P(xa, 0.03, d0)} Z" fill="${S.lg("platten", [[0, "#bdb8ae"], [1, "#d6d1c6"]])}"/>`;
  for (let xw = xa; xw <= xb + 0.01; xw += 0.6) g += `<path d="M${P(xw, 0.03, d1)} L${P(xw, 0.03, d0)}" stroke="#9c968a" stroke-width=".22"/>`;
  for (let d = d0 + 0.6; d < d1; d += 0.6) g += `<path d="M${P(xa, 0.03, d)} L${P(xb, 0.03, d)}" stroke="#9c968a" stroke-width=".22"/>`;
  g += `<path d="M${P(xa, 0.03, d0)} L${P(xb, 0.03, d0)} L${P(xb, 0, d0)} L${P(xa, 0, d0)} Z" fill="#8e887c"/>`;
  const unter = [];
  /* der Gartentisch (Holz, 1,4 × 0,8 m, 0,74 m hoch) */
  {
    const d = 17.2, s = sk(d), cx = PX(-3.7, d), y0 = PY(0.03, d), tw = 1.3 * s, th = 0.74 * s;
    let t = schatten(cx, y0 + 0.2, tw / 2 + 1, 0.8, 0.3);
    for (const dx of [-tw / 2 + 1, tw / 2 - 1.6]) t += `<rect x="${r(cx + dx)}" y="${r(y0 - th)}" width=".7" height="${r(th)}" fill="#7a5532"/>`;
    t += `<path d="M${r(cx - tw / 2 - 0.6)} ${r(y0 - th)} L${r(cx + tw / 2 + 0.6)} ${r(y0 - th)} L${r(cx + tw / 2)} ${r(y0 - th - 1.6)} L${r(cx - tw / 2)} ${r(y0 - th - 1.6)} Z" fill="${HOLZ}"/>`;
    t += `<rect x="${r(cx - tw / 2 - 0.6)}" y="${r(y0 - th)}" width="${r(tw + 1.2)}" height=".7" fill="#6b4a2a"/>`;
    /* Kaffeetasse und Krug auf dem Tisch */
    t += `<rect x="${r(cx - 4)}" y="${r(y0 - th - 2.4)}" width="1.2" height="1.1" fill="#fff"/><path d="M${r(cx + 2)} ${r(y0 - th - 0.9)} l.2 -2.4 h1.6 l.2 2.4 Z" fill="#e6f1f5" opacity=".9"/><rect x="${r(cx + 2.2)}" y="${r(y0 - th - 2.4)}" width="1.6" height="1.4" fill="#f2c94c" opacity=".8"/>`;
    g += t;
    unter.push({ id: "gartentisch", de: "der Gartentisch", syl: "GAR-ten-tisch", it: "il tavolo da giardino", itSyl: "TA-vo-lo da giar-DI-no", en: "garden table", x: cx, y: y0,
      kunst: flaeche(-tw / 2 - 1, -th - 3, tw + 2, th + 3.4) });
  }
  /* zwei Gartenstühle (Klappstühle aus Holz) an den Tischenden */
  const stuhl = (xw, d, seite) => {
    const s = sk(d), cx = PX(xw, d), y0 = PY(0.03, d), sh = 0.45 * s, lh = 0.92 * s, sw = 0.45 * s;
    let t = schatten(cx, y0 + 0.2, sw / 2 + 0.6, 0.6, 0.3);
    /* Beine */
    t += `<path d="M${r(cx - sw / 2)} ${r(y0)} L${r(cx + sw / 2)} ${r(y0 - sh)} M${r(cx + sw / 2)} ${r(y0)} L${r(cx - sw / 2)} ${r(y0 - sh)}" stroke="#7a5532" stroke-width=".7"/>`;
    /* Sitz */
    t += `<rect x="${r(cx - sw / 2 - 0.3)}" y="${r(y0 - sh - 0.8)}" width="${r(sw + 0.6)}" height="1" rx=".3" fill="${HOLZ}"/>`;
    /* Lehne auf der Außenseite */
    const lx = cx + seite * (sw / 2);
    t += `<path d="M${r(lx)} ${r(y0)} L${r(lx + seite * 0.6)} ${r(y0 - lh)}" stroke="#7a5532" stroke-width=".8"/>`;
    for (let i = 0; i < 3; i++) t += `<path d="M${r(lx - seite * 0.2 + seite * (0.3 + i * 0.1))} ${r(y0 - lh + 0.8 + i * 1.6)} l${r(-seite * 2.6)} .6" stroke="${HOLZ}" stroke-width=".9"/>`;
    t += `<path d="M${r(lx)} ${r(y0 - lh + 0.5)} L${r(lx - seite * 3)} ${r(y0 - lh + 1.4)} L${r(lx - seite * 3)} ${r(y0 - sh + 0.4)}" stroke="#7a5532" stroke-width=".55" fill="none"/>`;
    return t;
  };
  g += stuhl(-5.05, 17.3, -1) + stuhl(-2.35, 17.1, 1);
  {
    const d = 17.2, s = sk(d), y0 = PY(0.03, d);
    unter.push({ id: "gartenstuhl", de: "der Gartenstuhl", syl: "GAR-ten-stuhl", it: "la sedia da giardino", itSyl: "SE-dia da giar-DI-no", en: "garden chair", x: PX(-2.35, d), y: y0,
      kunst: flaeche(-0.3 * s, -0.95 * s - 0.6, 0.62 * s, 0.95 * s + 1) });
  }
  /* der Sonnenschirm (Mittelmast im Ständer, Bespannung cremeweiß) */
  {
    const d = 17.6, s = sk(d), cx = PX(-3.7, d), y0 = PY(0.03, d), H = 2.3 * s, R = 1.25 * s;
    let t = `<ellipse cx="${r(cx)}" cy="${r(y0 - 0.3)}" rx="2.2" ry=".7" fill="#4a4f55"/><rect x="${r(cx - 0.35)}" y="${r(y0 - H)}" width=".7" height="${r(H)}" fill="#d8d2c4"/>`;
    const top = y0 - H - 1.6, rand = y0 - H + 3.4;
    t += `<path d="M${r(cx - R)} ${r(rand)} Q${r(cx - R * 0.5)} ${r(top + 1)} ${r(cx)} ${r(top)} Q${r(cx + R * 0.5)} ${r(top + 1)} ${r(cx + R)} ${r(rand)} Q${r(cx)} ${r(rand + 1.6)} ${r(cx - R)} ${r(rand)} Z" fill="${S.lg("schirm", [[0, "#fbf6e8"], [1, "#d9cfb6"]])}"/>`;
    for (const f of [-0.6, 0, 0.6]) t += `<path d="M${r(cx)} ${r(top)} Q${r(cx + f * R * 0.5)} ${r(top + 1.6)} ${r(cx + f * R)} ${r(rand + 0.9 - Math.abs(f) * 0.6)}" stroke="#c7bc9f" stroke-width=".3" fill="none"/>`;
    for (let i = 0; i < 8; i++) { const a = -R + i * R / 3.5; t += `<path d="M${r(cx + a)} ${r(rand + 0.75 - Math.abs(a / R) * 0.7)} q${r(R / 7)} 1.2 ${r(R / 3.5)} 0" fill="#eee5cf" stroke="#c7bc9f" stroke-width=".2"/>`; }
    t += `<circle cx="${r(cx)}" cy="${r(top - 0.4)}" r=".6" fill="#b8ad92"/>`;
    g += t;
    unter.push({ id: "sonnenschirm", de: "der Sonnenschirm", syl: "SON-nen-schirm", it: "l'ombrellone", itSyl: "om-brel-LO-ne", en: "parasol", x: cx, y: top + 4,
      kunst: flaeche(-R, -5, 2 * R, 7) });
  }
  /* Kübelpflanze (Oleander) am Rand */
  {
    const d = 16.0, s = sk(d), cx = PX(-1.75, d), y0 = PY(0.03, d);
    g += `<path d="M${r(cx - 2.4)} ${r(y0 - 4.6)} L${r(cx + 2.4)} ${r(y0 - 4.6)} L${r(cx + 1.8)} ${r(y0)} L${r(cx - 1.8)} ${r(y0)} Z" fill="#b5653f"/>`;
    for (let i = 0; i < 9; i++) g += `<ellipse cx="${r(cx - 3 + rnd() * 6)}" cy="${r(y0 - 6 - rnd() * 7)}" rx="1.8" ry="1.2" fill="${LAUB_D}"/>`;
    for (let i = 0; i < 6; i++) g += `<circle cx="${r(cx - 3 + rnd() * 6)}" cy="${r(y0 - 7 - rnd() * 6)}" r=".55" fill="#e87aa0"/>`;
  }
  const zx = PX(xa, d0) - 4, zw = PX(xb, d0) - zx + 6, zh = zw / 1.5;
  S.teil({ id: "terrasse", de: "die Terrasse", syl: "ter-RAS-se", it: "la terrazza", itSyl: "ter-RAZ-za", en: "patio", x: X, y: Y, steht: true, kunst: G(X, Y, g),
    zoom: { x: r(zx), y: r(PY(0, d0) - zh + 4), w: r(zw), h: r(zh) }, unter,
    tipp: "Auf der Terrasse frühstückt man im Sommer draußen." });
}

/* =====================================================================
   7 — DER ZAUN (rechts, Holzlattenzaun 1 m) und DAS GARTENTOR
   ===================================================================== */
const TOR = { dv: 5.05, dh: 5.95 };
const latte = (d, top, farbe) => {
  const s = sk(d), x = PX(ZAUN_X, d), w = 0.07 * s, oben = PY(top, d), unten = PY(0, d);
  return `<path d="M${r(x - w / 2)} ${r(unten)} L${r(x - w / 2)} ${r(oben + w * 0.5)} Q${r(x)} ${r(oben - w * 0.3)} ${r(x + w / 2)} ${r(oben + w * 0.5)} L${r(x + w / 2)} ${r(unten)} Z" fill="${farbe}" stroke="#7c6448" stroke-width="${r(Math.min(0.25, 0.008 * s))}"/>`;
};
{
  const dv = ZAUN_X * F / 156, dh = HAUS.d, Y = PY(0, 9), X = PX(ZAUN_X, 9);
  let g = "";
  /* Querriegel hinter den Latten, Abschnitt hinten und vorn */
  for (const [a, b] of [[dh, TOR.dh + 0.1], [TOR.dv - 0.1, dv]]) for (const h of [0.2, 0.75]) g += `<path d="M${P(ZAUN_X + 0.04, h, a)} L${P(ZAUN_X + 0.04, h, b)} L${P(ZAUN_X + 0.04, h + 0.08, b)} L${P(ZAUN_X + 0.04, h + 0.08, a)} Z" fill="#8a6e4c"/>`;
  /* Pfosten */
  for (const d of [17, 14.5, 12, 10, 8.2, 6.0, 5.0]) { if (d === 6.0 || d === 5.0) continue; const s = sk(d); g += `<rect x="${r(PX(ZAUN_X + 0.05, d) - 0.05 * s)}" y="${r(PY(1.08, d))}" width="${r(0.1 * s)}" height="${r(1.08 * s)}" fill="#6e5236"/>`; }
  /* Latten (von hinten nach vorn), Lücke für das Tor */
  let i = 0;
  for (let d = dh; d >= dv; d -= 0.12 * Math.max(0.6, d / 8)) {
    i++;
    if (d < TOR.dh + 0.08 && d > TOR.dv - 0.08) continue;
    g += latte(d, 1.0, i % 2 ? "#c9a878" : "#bf9d6c");
  }
  /* Licht auf den Lattenköpfen */
  g += `<path d="M${P(ZAUN_X, 0.97, dh)} L${P(ZAUN_X, 0.97, TOR.dh)}" stroke="#f1dcb2" stroke-width=".4" opacity=".6"/>`;
  S.teil({ id: "zaun", de: "der Zaun", syl: "ZAUN", it: "il recinto", itSyl: "re-CIN-to", en: "fence", x: X, y: Y, kunst: G(X, Y, g),
    tipp: "Ein Holzzaun aus Latten. Er ist etwa einen Meter hoch." });
}
{
  const Y = PY(0, (TOR.dv + TOR.dh) / 2), X = PX(ZAUN_X, (TOR.dv + TOR.dh) / 2);
  let g = "";
  /* zwei Torpfosten (9 cm, 1,15 m) mit Kappe */
  const pfosten = (d) => { const s = sk(d), x = PX(ZAUN_X, d), w = 0.1 * s; return `<rect x="${r(x - w / 2)}" y="${r(PY(1.15, d))}" width="${r(w)}" height="${r(1.15 * s)}" fill="${S.lg("pfosten", [[0, "#8a6a46"], [1, "#5e452c"]], 0, 0, 1, 0)}"/><rect x="${r(x - w / 2 - 0.4)}" y="${r(PY(1.15, d) - 1)}" width="${r(w + 0.8)}" height="1.2" fill="#4f3a25"/>`; };
  g += pfosten(TOR.dh);
  /* Torflügel: Rahmen, Z-Strebe, Latten, Klinke */
  const a = TOR.dh - 0.05, b = TOR.dv + 0.05;
  /* Latten mit Bogen oben (typisches Holz-Gartentor), dahinter nichts — davor (Gartenseite) Riegel und Z-Strebe */
  for (let d = a - 0.02; d >= b; d -= 0.1) { const t = (a - d) / (a - b); g += latte(d, 0.98 + 0.12 * Math.sin(Math.PI * t), "#d6b688"); }
  const X0 = ZAUN_X - 0.05;
  for (const h of [0.14, 0.76]) g += `<path d="M${P(X0, h, a)} L${P(X0, h, b)} L${P(X0, h + 0.1, b)} L${P(X0, h + 0.1, a)} Z" fill="${S.lg("riegel", [[0, "#9a7a52"], [1, "#7a5d3e"]])}"/>`;
  g += `<path d="M${P(X0, 0.24, a)} L${P(X0, 0.76, b)} L${P(X0, 0.86, b)} L${P(X0, 0.34, a)} Z" fill="#8a6a46"/>`;
  /* Scharniere hinten, Klinke vorn */
  for (const h of [0.2, 0.85]) g += `<rect x="${r(PX(ZAUN_X, a) - 1.2)}" y="${r(PY(h, a) - 0.4)}" width="2.4" height=".8" fill="#2e3236"/>`;
  {
    const x = PX(ZAUN_X - 0.07, b + 0.06), y = PY(0.9, b + 0.06);
    g += `<rect x="${r(x - 0.6)}" y="${r(y - 2)}" width="1.2" height="4" rx=".4" fill="#2e3236"/><path d="M${r(x)} ${r(y - 1)} l-3.4 .6" stroke="#3a3f44" stroke-width="1" stroke-linecap="round"/>`;
  }
  g += pfosten(TOR.dv - 0.03);
  S.teil({ id: "gartentor", de: "das Gartentor", syl: "GAR-ten-tor", it: "il cancello", itSyl: "can-CEL-lo", en: "garden gate", x: X, y: Y, kunst: G(X, Y, g),
    tipp: "Durch das Gartentor kommt man über den Seitenweg zur Straße." });
}

/* =====================================================================
   8 — DER RASENMÄHER (links, an der Hecke)
   ===================================================================== */
{
  const d = 7.3, s = sk(d), X = PX(-4.55, d), Y = PY(0, d);
  const W = 0.5 * s, H = 0.32 * s;
  let k = schatten(0, 0.3, W / 2 + 1.4, 1, 0.32);
  /* Räder */
  for (const sx of [-1, 1]) k += `<ellipse cx="${r(sx * (W / 2 - 0.4))}" cy="${r(-0.09 * s)}" rx="${r(0.05 * s)}" ry="${r(0.09 * s)}" fill="#232628"/><ellipse cx="${r(sx * (W / 2 - 0.4))}" cy="${r(-0.09 * s)}" rx="${r(0.025 * s)}" ry="${r(0.045 * s)}" fill="#8a9096"/>`;
  /* Gehäuse (Akku-Mäher, grün) mit Grasfangkorb hinten */
  k += `<path d="M${r(-W / 2 + 1)} ${r(-0.06 * s)} L${r(-W / 2 + 0.6)} ${r(-H * 0.75)} Q${r(-W / 2 + 1)} ${r(-H)} ${r(-W / 4)} ${r(-H)} L${r(W / 4)} ${r(-H)} Q${r(W / 2 - 1)} ${r(-H)} ${r(W / 2 - 0.6)} ${r(-H * 0.75)} L${r(W / 2 - 1)} ${r(-0.06 * s)} Z" fill="${S.lg("maeher", [[0, "#7cc04a"], [0.6, "#4f9a32"], [1, "#2f6a20"]])}"/>`;
  k += `<rect x="${r(-W / 4)}" y="${r(-H - 0.12 * s)}" width="${r(W / 2)}" height="${r(0.12 * s)}" rx="1" fill="#3a3f44"/>`;
  k += `<rect x="${r(-W / 2 + 1.4)}" y="${r(-H * 0.55)}" width="${r(W - 2.8)}" height="1" fill="#2f6a20"/><rect x="${r(-2)}" y="${r(-H * 0.85)}" width="4" height="1.6" rx=".4" fill="#f2c94c"/>`;
  /* Holm nach hinten oben (Griff 1 m hoch, 0,7 m hinter dem Gehäuse) */
  const gy = PY(1.0, d + 0.7) - Y, gx = PX(-4.55, d + 0.7) - X, gw = 0.46 * sk(d + 0.7);
  for (const sx of [-1, 1]) k += `<path d="M${r(sx * W / 3)} ${r(-H * 0.8)} L${r(gx + sx * gw / 2)} ${r(gy)}" stroke="#2b2f33" stroke-width=".9"/>`;
  k += `<path d="M${r(gx - gw / 2)} ${r(gy)} L${r(gx + gw / 2)} ${r(gy)}" stroke="#2b2f33" stroke-width="1.4" stroke-linecap="round"/><path d="M${r(gx - gw / 2 + 1)} ${r(gy + 1.2)} L${r(gx + gw / 2 - 1)} ${r(gy + 1.2)}" stroke="#d23b30" stroke-width=".7"/>`;
  S.teil({ id: "rasenmaeher", de: "der Rasenmäher", syl: "RA-sen-mä-her", it: "il tosaerba", itSyl: "to-sa-ER-ba", en: "lawnmower", x: X, y: Y, steht: true, kunst: k,
    tipp: "Sonntags und in der Mittagszeit darf man in Deutschland meist nicht Rasen mähen — wegen der Ruhezeit." });
}

/* =====================================================================
   9 — DAS HOCHBEET (Lupe: Salat, Möhre, Erdbeere), DIE SCHUBKARRE,
       DIE SCHAUFEL, DIE GÄRTNERIN mit DER HARKE
   ===================================================================== */
const HB = { dv: 9.0, dh: 9.8, xa: -0.6, xb: 1.0, h: 0.8 };
{
  const { dv, dh, xa, xb, h } = HB, X = PX((xa + xb) / 2, dv), Y = PY(0, dv);
  let g = schatten(X, Y + 0.3, (PX(xb, dv) - PX(xa, dv)) / 2 + 2, 1.2, 0.3);
  /* Erdoberfläche (von oben sichtbar, weil das Auge höher liegt) */
  g += `<path d="M${P(xa + 0.05, h - 0.04, dh)} L${P(xb - 0.05, h - 0.04, dh)} L${P(xb - 0.05, h - 0.04, dv)} L${P(xa + 0.05, h - 0.04, dv)} Z" fill="${ERDE}"/>`;
  /* Seitenwand rechts (nicht sichtbar, links liegt sie verdeckt) — Front aus Lärchenbohlen */
  const fa = PX(xa, dv), fb = PX(xb, dv), fo = PY(h, dv), fu = Y;
  for (let i = 0; i < 4; i++) { const y = fo + i * (fu - fo) / 4; g += `<rect x="${r(fa)}" y="${r(y)}" width="${r(fb - fa)}" height="${r((fu - fo) / 4 - 0.35)}" rx=".3" fill="${S.lg("bohle", [[0, "#c79a63"], [1, "#9a6e3e"]])}"/>`; }
  g += `<path d="M${P(xa, h, dv)} L${P(xa, h, dh)} L${P(xb, h, dh)} L${P(xb, h, dv)}" stroke="#8a5f33" stroke-width=".8" fill="none"/>`;
  g += `<rect x="${r(fa - 0.4)}" y="${r(fo - 0.6)}" width="${r(fb - fa + 0.8)}" height="1" fill="#b48650"/>`;
  for (const x of [fa + 0.3, fb - 1.3]) g += `<rect x="${r(x)}" y="${r(fo)}" width="1" height="${r(fu - fo)}" fill="#7a5530"/>`;
  const spalten = [xa + 0.05, xa + (xb - xa) / 3, xa + 2 * (xb - xa) / 3, xb - 0.05];
  const unter = [];
  const feld = (si, id, de, syl, it, itSyl, en, tipp, mal) => {
    const a = spalten[si], b = spalten[si + 1];
    for (const d of [dh - 0.12, (dv + dh) / 2, dv + 0.12]) for (let j = 0; j < 2; j++) { const xw = a + (b - a) * (j + 0.5) / 2; g += mal(PX(xw, d), PY(h - 0.04, d), sk(d)); }
    const ux = PX((a + b) / 2, dv), uy = PY(h, dv), w = PX(b, dv) - PX(a, dv);
    unter.push({ id, de, syl, it, itSyl, en, tipp, x: ux, y: uy, kunst: flaeche(-w / 2 + 0.3, -9, w - 0.6, 11) });
  };
  feld(0, "salat", "der Salat", "sa-LAT", "la lattuga", "lat-TU-ga", "lettuce", "Kopfsalat wächst schnell — nach sechs bis acht Wochen kann man ihn ernten.",
    (x, y, s) => `<ellipse cx="${r(x)}" cy="${r(y - 0.08 * s)}" rx="${r(0.13 * s)}" ry="${r(0.09 * s)}" fill="${S.rg("salat", [[0, "#e2f59a"], [0.6, "#93c94f"], [1, "#4f8a2a"]], 0.5, 0.4, 0.7)}"/><path d="M${r(x - 0.09 * s)} ${r(y - 0.1 * s)} q${r(0.09 * s)} ${r(-0.07 * s)} ${r(0.18 * s)} 0" stroke="#5f9a34" stroke-width=".25" fill="none"/>`);
  feld(1, "moehre", "die Möhre", "MÖH-re", "la carota", "ca-RO-ta", "carrot", "Die Möhre wächst in der Erde. Oben sieht man nur das grüne Kraut.",
    (x, y, s) => `<path d="M${r(x - 0.03 * s)} ${r(y)} l${r(0.03 * s)} ${r(0.03 * s)} l${r(0.03 * s)} ${r(-0.03 * s)} Z" fill="#ef7d1a"/>` + [-1, -0.4, 0.3, 0.9].map((q) => `<path d="M${r(x)} ${r(y)} q${r(q * 0.04 * s)} ${r(-0.1 * s)} ${r(q * 0.08 * s)} ${r(-0.2 * s)}" stroke="#5aa03a" stroke-width=".35" fill="none"/>`).join(""));
  feld(2, "erdbeere", "die Erdbeere", "ERD-bee-re", "la fragola", "FRA-go-la", "strawberry", "Diese Sorte trägt bis zum Herbst. Im Hochbeet bleiben die Früchte sauber.",
    (x, y, s) => [-0.07, 0, 0.07].map((dx, i) => `<path d="M${r(x)} ${r(y)} L${r(x + dx * s)} ${r(y - 0.07 * s)}" stroke="#4f8a2a" stroke-width=".2"/>` + [-0.03, 0, 0.03].map((e) => `<ellipse cx="${r(x + (dx + e) * s)}" cy="${r(y - (0.08 + (e ? 0 : 0.02)) * s)}" rx="${r(0.022 * s)}" ry="${r(0.016 * s)}" fill="${i === 1 ? "#5fa040" : "#4a8a34"}"/>`).join("")).join("") + `<path d="M${r(x - 0.05 * s)} ${r(y - 0.02 * s)} q.5 1.5 1 0 Z M${r(x + 0.06 * s)} ${r(y - 0.03 * s)} q.5 1.5 1 0 Z" fill="#e0262e"/>`);
  /* Erdbeerranken hängen vorn über die Bohle */
  for (const xw of [xb - 0.42, xb - 0.2]) { const x = PX(xw, dv), y = PY(h, dv); g += `<path d="M${r(x)} ${r(y - 0.5)} q1 2 .4 4" stroke="#4f8a2a" stroke-width=".35" fill="none"/><path d="M${r(x + 0.4)} ${r(y + 3.5)} q.6 1.6 1.2 0 Z" fill="#d8262e"/>`; }
  const zx = PX(xa, dv) - 6, zw = PX(xb, dv) - zx + 6;
  S.teil({ id: "hochbeet", de: "das Hochbeet", syl: "HOCH-beet", it: "l'orto rialzato", itSyl: "OR-to ri-al-ZA-to", en: "raised bed", x: X, y: Y, steht: true, kunst: G(X, Y, g),
    zoom: { x: r(zx), y: r(PY(h, dh) - 18), w: r(zw), h: r(zw / 1.5) }, unter,
    tipp: "Im Hochbeet arbeitet man ohne Bücken — und die Schnecken kommen schlechter heran." });
}
{
  /* DIE SCHUBKARRE (links vom Hochbeet, mit Kompost beladen) */
  const d = 9.25, s = sk(d), X = PX(-1.45, d), Y = PY(0, d);
  const L = 1.35 * s;
  let k = schatten(0, 0.3, L / 2, 1, 0.3);
  /* Rad vorn links, Holme nach rechts */
  const rx = -L / 2 + 0.17 * s, rr = 0.17 * s;
  k += `<circle cx="${r(rx)}" cy="${r(-rr)}" r="${r(rr)}" fill="#25282b"/><circle cx="${r(rx)}" cy="${r(-rr)}" r="${r(rr * 0.45)}" fill="#c9302c"/>`;
  k += `<path d="M${r(rx)} ${r(-rr)} L${r(L / 2)} ${r(-0.62 * s)}" stroke="#2f3a44" stroke-width=".8"/>`;
  k += `<path d="M${r(0.15 * s)} 0 L${r(0.18 * s)} ${r(-0.35 * s)}" stroke="#2f3a44" stroke-width=".7"/>`;
  /* Mulde (verzinkt) mit Kompost */
  k += `<path d="M${r(-L / 2 + 0.2 * s)} ${r(-0.6 * s)} L${r(0.3 * s)} ${r(-0.6 * s)} L${r(0.2 * s)} ${r(-0.32 * s)} L${r(-0.15 * s)} ${r(-0.3 * s)} Z" fill="${S.lg("mulde", [[0, "#d8dde0"], [1, "#8f989e"]])}"/>`;
  k += `<path d="M${r(-L / 2 + 0.24 * s)} ${r(-0.6 * s)} Q${r(-0.05 * s)} ${r(-0.75 * s)} ${r(0.28 * s)} ${r(-0.6 * s)} Z" fill="${ERDE}"/>`;
  k += `<path d="M${r(-L / 2 + 0.2 * s)} ${r(-0.6 * s)} L${r(0.3 * s)} ${r(-0.6 * s)}" stroke="#eef1f3" stroke-width=".5"/>`;
  k += `<rect x="${r(L / 2 - 1.6)}" y="${r(-0.66 * s)}" width="2.2" height="1.2" rx=".5" fill="#1d2023"/>`;
  S.teil({ id: "schubkarre", de: "die Schubkarre", syl: "SCHUB-kar-re", it: "la carriola", itSyl: "car-RIO-la", en: "wheelbarrow", x: X, y: Y, steht: true, kunst: k,
    tipp: "Mit der Schubkarre fährt man Erde, Kompost und Laub durch den Garten." });
  /* DIE SCHAUFEL — liegt schräg in der Karre: Blatt im Kompost, Stiel auf dem Holm */
  const sx = -0.22 * s, sy = -0.66 * s, ex = 0.62 * s, ey = -0.86 * s;
  let q = `<path d="M${r(sx)} ${r(sy)} L${r(ex)} ${r(ey)}" stroke="#a8763f" stroke-width=".8" stroke-linecap="round"/>`;
  q += `<path d="M${r(ex - 0.5)} ${r(ey - 1.2)} l1.2 2.2" stroke="#2b2f33" stroke-width=".9" stroke-linecap="round"/>`;
  q += `<path d="M${r(sx - 0.02 * s)} ${r(sy - 0.07 * s)} L${r(sx + 0.03 * s)} ${r(sy + 0.07 * s)} L${r(sx - 0.17 * s)} ${r(sy + 0.1 * s)} L${r(sx - 0.2 * s)} ${r(sy - 0.03 * s)} Z" fill="${STAHL}"/>`;
  S.teil({ oben: true, id: "schaufel", de: "die Schaufel", syl: "SCHAU-fel", it: "la paletta", itSyl: "pa-LET-ta", en: "spade", x: X, y: Y, kunst: q + flaeche(sx - 0.22 * s, ey - 2, ex - sx + 0.24 * s, sy - ey + 0.12 * s + 2),
    tipp: "Mit der Schaufel gräbt man ein Loch für eine neue Pflanze." });
}
const GAE = { d: 9.35, xw: 1.35 };
const gaertnerin = B.mensch({ id: "gtn_gaertnerin", geschlecht: "w", pose: "halten", blick: -48, frisur: "zopf", haarfarbe: "dunkelbraun", haut: "hell", laecheln: true,
  kleidung: { oberteil: { stueck: "tshirt", farbe: "gruen" }, unterteil: { stueck: "arbeitshose", farbe: "jeans" }, schuhe: { stueck: "gummistiefel", farbe: "gruen_d" }, kopf: { stueck: "hut", farbe: "beige" } } }, 1.68 * sk(GAE.d));
{
  const X = PX(GAE.xw, GAE.d), Y = PY(0, GAE.d);
  S.teil({ id: "gaertnerin", de: "die Gärtnerin", syl: "GÄRT-ne-rin", it: "la giardiniera", itSyl: "giar-di-NIE-ra", en: "gardener", x: X, y: Y, kunst: gaertnerin.svg,
    tipp: "Die Gärtnerin harkt die Erde neben dem Hochbeet." });
}
{
  /* DIE HARKE in der Hand der Gärtnerin, Zinken auf dem Boden vor ihr */
  const X = PX(GAE.xw, GAE.d), Y = PY(0, GAE.d), z = gaertnerin.z, k0 = gaertnerin.k, s = sk(GAE.d);
  const hand = [z.handL, z.handR].sort((a, b) => a.y - b.y)[0];
  const hx = hand.x * k0, hy = hand.y * k0;
  const fx = -0.35 * s, fy = 0.5;
  const dx = hx - fx, dy = hy - fy, l = Math.hypot(dx, dy), ux = dx / l, uy = dy / l;
  const tx = fx + ux * 1.5 * s, ty = fy + uy * 1.5 * s;
  let k = `<path d="M${r(fx)} ${r(fy - 0.5)} L${r(tx)} ${r(ty)}" stroke="#b07a45" stroke-width=".7" stroke-linecap="round"/>`;
  k += `<path d="M${r(fx - 0.2 * s)} ${r(fy - 0.4)} L${r(fx + 0.2 * s)} ${r(fy - 0.4)}" stroke="#4a4f55" stroke-width=".8" stroke-linecap="round"/>`;
  for (let i = 0; i <= 8; i++) { const x = fx - 0.19 * s + i * 0.0475 * s; k += `<line x1="${r(x)}" y1="${r(fy - 0.4)}" x2="${r(x)}" y2="${r(fy + 0.6)}" stroke="#4a4f55" stroke-width=".25"/>`; }
  S.teil({ oben: true, id: "harke", de: "die Harke", syl: "HAR-ke", it: "il rastrello", itSyl: "ra-STREL-lo", en: "rake", x: X, y: Y, kunst: k + flaeche(fx - 0.22 * s, Math.min(ty, fy) - 0.5, Math.abs(tx - fx) + 0.44 * s, Math.abs(ty - fy) + 1.6),
    tipp: "In Süddeutschland sagt man „der Rechen“, im Norden „die Harke“." });
}

/* =====================================================================
   10 — DER BAUM (Apfelbaum, Halbstamm) — Lupe: Apfel, Blatt, Ast;
        DAS VOGELHÄUSCHEN am Ast und DER VOGEL
   ===================================================================== */
const BAUM = { d: 5.6, xw: -2.9 };
{
  const s = sk(BAUM.d), X = PX(BAUM.xw, BAUM.d), Y = PY(0, BAUM.d);
  const KX = 6, KY = -116, KRX = 46, KRY = 38;   // Krone (relativ zum Stammfuß)
  /* Kronenschatten auf dem Rasen (Sonne steht rechts) */
  let k = `<ellipse cx="-2" cy="1" rx="40" ry="6" fill="#1d3315" opacity=".22" filter="url(#bw_weich)"/>` + schatten(-2, 0.5, 10, 2, 0.3);
  /* Stamm 1,8 m bis zur Krone, mit Rinde */
  const sw = 0.2 * s;
  k += `<path d="M${r(-sw / 2 - 1.4)} 0 Q${r(-sw / 2)} -20 ${r(-sw / 2 + 0.6)} -60 L${r(-sw / 2 + 1.2)} -76 L${r(sw / 2 + 0.4)} -76 L${r(sw / 2 + 0.4)} -60 Q${r(sw / 2 + 0.6)} -20 ${r(sw / 2 + 1.6)} 0 Z" fill="${S.lg("stamm", [[0, "#4f3d2c"], [0.45, "#7b6249"], [1, "#3e2f22"]], 0, 0, 1, 0)}"/>`;
  for (let i = 0; i < 14; i++) { const y = -4 - rnd() * 68; k += `<path d="M${r(-sw / 2 + 1 + rnd() * (sw - 2))} ${r(y)} q.4 -2 0 -4" stroke="#3a2b1e" stroke-width=".35" fill="none" opacity=".7"/>`; }
  /* Hauptäste in die Krone */
  const aeste = [[-1, -74, -26, -100], [1, -74, 28, -104], [0, -76, 4, -128], [-1, -82, -34, -120], [1, -82, 36, -122]];
  for (const [, x0, y0, x1, y1] of aeste.map((a) => [0, 0, a[1], a[2], a[3]])) k += `<path d="M0 ${y0} Q${r(x1 * 0.4)} ${r((y0 + y1) / 2 - 4)} ${x1} ${y1}" stroke="#5a4532" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
  /* Krone aus Laubballen, hinten dunkel, vorn hell */
  const ballen = [];
  for (let i = 0; i < 30; i++) { const a = rnd() * Math.PI * 2, rr = Math.sqrt(rnd()); ballen.push([KX + Math.cos(a) * rr * (KRX - 10), KY + Math.sin(a) * rr * (KRY - 9), 9 + rnd() * 7, 8 + rnd() * 5]); }
  ballen.sort((a, b) => a[1] - b[1]);
  ballen.forEach(([x, y, rx, ry], i) => { k += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(rx)}" ry="${r(ry)}" fill="${i < 12 ? LAUB_D : LAUB}"/>`; });
  /* Blattstruktur und Glanz */
  for (let i = 0; i < 110; i++) { const a = rnd() * Math.PI * 2, rr = Math.sqrt(rnd()); const x = KX + Math.cos(a) * rr * (KRX - 5), y = KY + Math.sin(a) * rr * (KRY - 5); k += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="1.3" ry=".7" fill="${rnd() < 0.5 ? "#a8d070" : "#3d6a2c"}" opacity=".7" transform="rotate(${Math.round(rnd() * 180)} ${r(x)} ${r(y)})"/>`; }
  /* Äpfel (8 cm → 3,3 Einheiten) */
  const aepfel = [];
  for (let i = 0; i < 17; i++) { const a = rnd() * Math.PI * 2, rr = 0.3 + 0.65 * Math.sqrt(rnd()); aepfel.push([KX + Math.cos(a) * rr * (KRX - 8), KY + 6 + Math.sin(a) * rr * (KRY - 10)]); }
  for (const [x, y] of aepfel) k += `<circle cx="${r(x)}" cy="${r(y)}" r="1.45" fill="${APFEL}"/><circle cx="${r(x - 0.5)}" cy="${r(y - 0.6)}" r=".45" fill="#fff" opacity=".45"/>`;
  /* DER AST unten rechts: tritt aus der Krone heraus, mit Äpfeln */
  const ast = { x0: 18, y0: -86, x1: 46, y1: -92 };
  k += `<path d="M${ast.x0} ${ast.y0} Q32 -84 ${ast.x1} ${ast.y1}" stroke="#5a4532" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M34 -86 q4 -1 7 -6" stroke="#5a4532" stroke-width="1" fill="none"/>`;
  for (const [x, y, w] of [[26, -88, 20], [33, -89, -30], [40, -93, 40], [44, -89, -10], [37, -84, 60], [29, -84, -50], [44, -96, 15]]) k += `<path d="M${x} ${y} q2.2 -1.5 4.4 0 q-2.2 1.5 -4.4 0 Z" fill="#4f8a35" transform="rotate(${w} ${x} ${y})"/>`;
  for (const [x, y] of [[30, -84.5], [38.5, -87.5], [42, -88]]) k += `<line x1="${x}" y1="${y - 2.2}" x2="${x}" y2="${y - 1.3}" stroke="#4a3624" stroke-width=".3"/><circle cx="${x}" cy="${y}" r="1.7" fill="${APFEL}"/><circle cx="${x - 0.5}" cy="${y - 0.6}" r=".45" fill="#fff" opacity=".5"/>`;
  /* DAS BLATT oben rechts: ein paar Blätter am Kronenrand, groß gezeichnet */
  const BL = { x: 44, y: -134 };
  for (const [dx, dy, w] of [[0, 0, -20], [4, 3, 25], [-3, 4, 70]]) k += `<path d="M${BL.x + dx} ${BL.y + dy} q2.6 -2 5.2 0 q-2.6 2 -5.2 0 Z" fill="#6fae45" stroke="#3d6a2c" stroke-width=".2" transform="rotate(${w} ${BL.x + dx} ${BL.y + dy})"/><path d="M${BL.x + dx} ${BL.y + dy} l5 0" stroke="#3d6a2c" stroke-width=".15" transform="rotate(${w} ${BL.x + dx} ${BL.y + dy})"/>`;
  /* Lupe: der Apfel (eine Traube Äpfel links), das Blatt, der Ast */
  const AP = { x: -18, y: -110 };
  for (const [dx, dy] of [[0, 0], [3.4, 1], [1.4, 3.2]]) k += `<circle cx="${AP.x + dx}" cy="${AP.y + dy}" r="1.8" fill="${APFEL}"/><circle cx="${AP.x + dx - 0.6}" cy="${AP.y + dy - 0.7}" r=".5" fill="#fff" opacity=".5"/>`;
  k += `<path d="M${AP.x + 1.4} ${AP.y - 4} l0 2 M${AP.x + 1.4} ${AP.y - 4} q-3 -1 -5 1" stroke="#4a3624" stroke-width=".4" fill="none"/><path d="M${AP.x + 2} ${AP.y - 3.6} q2.4 -2 4.8 0 q-2.4 2 -4.8 0 Z" fill="#5f9a40"/>`;
  const unter = [
    { id: "apfel", de: "der Apfel", syl: "AP-fel", it: "la mela", itSyl: "ME-la", en: "apple", x: X + AP.x + 1.5, y: Y + AP.y + 5.5, kunst: flaeche(-5, -10.5, 10, 11),
      tipp: "Im September sind die Äpfel reif. Man pflückt sie vorsichtig mit der Hand." },
    { id: "blatt", de: "das Blatt", syl: "BLATT", it: "la foglia", itSyl: "FO-glia", en: "leaf", x: X + BL.x + 2.5, y: Y + BL.y + 6, kunst: flaeche(-6, -10, 12, 10) },
    { id: "ast", de: "der Ast", syl: "AST", it: "il ramo", itSyl: "RA-mo", en: "branch", x: X + 32, y: Y - 82, kunst: flaeche(-14, -14, 30, 12),
      tipp: "Der Ast ist voller Äpfel. Ein schwerer Ast wird manchmal mit einem Stock gestützt." },
  ];
  S.teil({ id: "baum", de: "der Baum", syl: "BAUM", it: "l'albero", itSyl: "AL-be-ro", en: "tree", x: X, y: Y, kunst: k,
    zoom: { x: r(X + KX - KRX - 4), y: r(Y + KY - KRY - 3), w: 114, h: 76 }, unter,
    tipp: "Ein Apfelbaum. Im Frühling blüht er weiß und rosa, im Herbst trägt er Äpfel." });
  /* DAS VOGELHÄUSCHEN hängt an einem linken Ast */
  {
    const hx = -24, hy = -77;   /* Aufhängung (relativ zum Stammfuß) */
    let v = `<line x1="${hx}" y1="${hy - 9}" x2="${hx}" y2="${hy}" stroke="#3a2b1e" stroke-width=".3"/>`;
    v += `<path d="M${hx - 4.4} ${hy + 3} L${hx} ${hy} L${hx + 4.4} ${hy + 3} Z" fill="#7a3f2a"/><path d="M${hx - 4.4} ${hy + 3} L${hx} ${hy} L${hx + 4.4} ${hy + 3}" stroke="#5a2d1d" stroke-width=".5" fill="none"/>`;
    v += `<rect x="${hx - 3}" y="${hy + 3}" width="6" height="4.6" fill="${HOLZ}"/><rect x="${hx - 2.2}" y="${hy + 3.2}" width="4.4" height="2.4" fill="#4a3220" opacity=".5"/>`;
    v += `<rect x="${hx - 3.8}" y="${hy + 7.4}" width="7.6" height="1" fill="#8a5f33"/>`;
    for (let i = 0; i < 8; i++) v += `<circle cx="${r(hx - 2.6 + rnd() * 5.2)}" cy="${r(hy + 7.2 - rnd() * 0.6)}" r=".3" fill="#e6cf8f"/>`;
    S.teil({ oben: true, id: "vogelhaeuschen", de: "das Vogelhäuschen", syl: "VO-gel-häus-chen", it: "la casetta per uccelli", itSyl: "ca-SET-ta per uc-CEL-li", en: "bird feeder", x: X + hx, y: Y + hy + 8.4, kunst: `<g transform="translate(${-hx} ${-hy - 8.4})">${v + flaeche(hx - 4.6, hy - 1, 9.2, 9.6)}</g>`,
      tipp: "Im Winter bekommen die Vögel hier Körner und Meisenknödel." });
    /* DER VOGEL — eine Kohlmeise auf dem Futterbrett */
    const bx = hx + 2.6, by = hy + 7.4;
    let m = `<path d="M${bx - 1.6} ${by - 1.5} q1.6 -1.6 3.2 0 l1.4 .8 l-1.6 .3 q-1.4 1.2 -3 .2 Z" fill="${S.lg("meise", [[0, "#2f4c66"], [0.45, "#5c7f4a"], [0.46, "#e8cf3a"], [1, "#d8b82a"]])}"/>`;
    m += `<circle cx="${bx + 1}" cy="${by - 2.6}" r="1.2" fill="#1d1d1d"/><circle cx="${bx + 1.2}" cy="${by - 2.4}" r=".55" fill="#fbfbf6"/><path d="M${bx + 2.1} ${by - 2.6} l.8 .2 l-.8 .2 Z" fill="#2b2b2b"/><path d="M${bx - 1.6} ${by - 1.4} l-1.6 -.4" stroke="#3b4f63" stroke-width=".6"/>`;
    m += `<path d="M${bx} ${by - 0.6} l0 .6 M${bx + 0.6} ${by - 0.6} l0 .6" stroke="#5a5a5a" stroke-width=".2"/>`;
    S.teil({ oben: true, id: "vogel", de: "der Vogel", syl: "VO-gel", it: "l'uccello", itSyl: "uc-CEL-lo", en: "bird", x: X + bx, y: Y + by, kunst: `<g transform="translate(${-bx} ${-by})">${m + flaeche(bx - 3.4, by - 4, 6.8, 4.4)}</g>`,
      tipp: "Eine Kohlmeise. Sie hat einen schwarzen Kopf und einen gelben Bauch." });
  }
}

/* =====================================================================
   11 — DIE GARTENBANK (Holz, 1,2 m, Sitzhöhe 0,45 m)
   ===================================================================== */
const BANK = { dv: 5.5, dh: 6.0, xa: 1.0, xb: 2.2 };
{
  const { dv, dh, xa, xb } = BANK, X = PX((xa + xb) / 2, dv), Y = PY(0, dv);
  let g = schatten(X, Y + 0.4, (PX(xb, dv) - PX(xa, dv)) / 2 + 3, 1.6, 0.3);
  const lehne = dh + 0.05;
  /* hintere Beine und Lehnenpfosten */
  for (const xw of [xa + 0.04, xb - 0.04]) g += `<path d="M${P(xw - 0.03, 0, lehne)} L${P(xw - 0.03, 0.92, lehne)} L${P(xw + 0.03, 0.92, lehne)} L${P(xw + 0.03, 0, lehne)} Z" fill="#6a4a2c"/>`;
  /* Rückenlehne: 4 waagrechte Latten */
  for (let i = 0; i < 4; i++) { const h0 = 0.52 + i * 0.1; g += `<path d="M${P(xa, h0, lehne)} L${P(xb, h0, lehne)} L${P(xb, h0 + 0.075, lehne)} L${P(xa, h0 + 0.075, lehne)} Z" fill="${HOLZ}"/>`; }
  g += `<path d="M${P(xa - 0.02, 0.88, lehne)} L${P(xb + 0.02, 0.88, lehne)} Q${P((xa + xb) / 2, 0.97, lehne)} ${P(xa - 0.02, 0.88, lehne)} Z" fill="#a8783f"/>`;
  g += `<path d="M${P(xa - 0.02, 0.88, lehne)} Q${P((xa + xb) / 2, 0.97, lehne)} ${P(xb + 0.02, 0.88, lehne)} L${P(xb + 0.02, 0.86, lehne)} Q${P((xa + xb) / 2, 0.94, lehne)} ${P(xa - 0.02, 0.86, lehne)} Z" fill="${HOLZ}"/>`;
  /* Sitzfläche aus 4 Latten (von oben gesehen) */
  for (let i = 0; i < 4; i++) { const a = dh - i * 0.125, b = a - 0.1; g += `<path d="M${P(xa, 0.45, a)} L${P(xb, 0.45, a)} L${P(xb, 0.45, b)} L${P(xa, 0.45, b)} Z" fill="${i % 2 ? "#b8874e" : "#c08f55"}"/>`; }
  g += `<path d="M${P(xa, 0.45, dv)} L${P(xb, 0.45, dv)} L${P(xb, 0.41, dv)} L${P(xa, 0.41, dv)} Z" fill="#8a5f33"/>`;
  /* vordere Beine und Armlehnen */
  for (const xw of [xa + 0.04, xb - 0.04]) {
    g += `<path d="M${P(xw - 0.035, 0, dv + 0.02)} L${P(xw - 0.035, 0.66, dv + 0.02)} L${P(xw + 0.035, 0.66, dv + 0.02)} L${P(xw + 0.035, 0, dv + 0.02)} Z" fill="${S.lg("bein", [[0, "#8a5f33"], [1, "#5f3f22"]], 0, 0, 1, 0)}"/>`;
    g += `<path d="M${P(xw - 0.04, 0.66, dv - 0.03)} L${P(xw - 0.04, 0.66, lehne)} L${P(xw + 0.04, 0.66, lehne)} L${P(xw + 0.04, 0.66, dv - 0.03)} Z" fill="#b8874e"/><path d="M${P(xw - 0.04, 0.66, dv - 0.03)} L${P(xw + 0.04, 0.66, dv - 0.03)} L${P(xw + 0.04, 0.62, dv - 0.03)} L${P(xw - 0.04, 0.62, dv - 0.03)} Z" fill="#7a5530"/>`;
  }
  g += `<path d="M${P(xa, 0.12, dv + 0.02)} L${P(xb, 0.12, dv + 0.02)}" stroke="#5f3f22" stroke-width=".7"/>`;
  /* Kissen links */
  g += `<path d="M${P(xa + 0.1, 0.46, dh - 0.05)} L${P(xa + 0.48, 0.46, dh - 0.05)} L${P(xa + 0.48, 0.5, dv + 0.08)} L${P(xa + 0.1, 0.5, dv + 0.08)} Z" fill="#c9433a" opacity="0"/>`;
  S.teil({ id: "bank", de: "die Gartenbank", syl: "GAR-ten-bank", it: "la panchina", itSyl: "pan-CHI-na", en: "garden bench", x: X, y: Y, steht: true, kunst: G(X, Y, g),
    tipp: "Auf der Gartenbank ruht man sich nach der Gartenarbeit aus." });
}

/* =====================================================================
   12 — DER TEICH (vorn in der Mitte) und DER GARTENZWERG
   ===================================================================== */
const TEICH = { cx: 160, cy: 183, rx: 58, ry: 10 };
{
  const { cx, cy, rx, ry } = TEICH;
  let k = "";
  /* Randsteine hinten, Wasser, Randsteine vorn */
  const stein = (x, y, w, h, f) => `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(w)}" ry="${r(h)}" fill="${f || S.lg("stein", [[0, "#d6d0c4"], [1, "#958d80"]])}"/>`;
  for (let i = 0; i <= 18; i++) { const a = Math.PI + i * Math.PI / 18; k += stein(Math.cos(a) * (rx + 2), Math.sin(a) * (ry + 1.2) - 0.4, 3.2 + rnd() * 1.4, 1.6 + rnd() * 0.6); }
  k += `<ellipse cx="0" cy="0" rx="${rx}" ry="${ry}" fill="${S.lg("wasser", [[0, "#3c6a78"], [0.5, "#5b8fa0"], [1, "#a7cbd6"]])}"/>`;
  k += `<ellipse cx="0" cy="${r(-ry * 0.25)}" rx="${r(rx * 0.92)}" ry="${r(ry * 0.6)}" fill="${S.lg("spiegel", [[0, "#cfe6f2", 0.0], [1, "#cfe6f2", 0.35]])}"/>`;
  k += `<path d="M${-rx * 0.6} ${-ry * 0.1} q12 -1.2 24 0 M${rx * 0.1} ${ry * 0.25} q10 -1 20 0 M${-rx * 0.2} ${ry * 0.5} q8 -.8 16 0" stroke="#fff" stroke-width=".35" opacity=".55" fill="none"/>`;
  /* Seerosen */
  for (const [x, y, s, bl] of [[-30, -2, 1, true], [-18, 2, 0.8, false], [20, -3, 0.9, true], [30, 3, 1.1, false], [6, 4, 0.7, false]]) {
    k += `<path d="M${x} ${y} m${-4.2 * s} 0 a${4.2 * s} ${1.6 * s} 0 1 0 ${8.4 * s} 0 a${4.2 * s} ${1.6 * s} 0 1 0 ${-8.4 * s} 0 Z M${x} ${y} l${3.6 * s} ${-0.8 * s} l0 ${1 * s} Z" fill="#4f8f3a" fill-rule="evenodd"/>`;
    if (bl) k += `<path d="M${x - 1.6} ${y - 0.4} l.8 -2 l.8 1.4 l.8 -2.2 l.8 2.2 l.8 -1.4 l.8 2 Z" fill="#f4b6c8" stroke="#e38aa6" stroke-width=".2"/><circle cx="${x + 0.8}" cy="${y - 0.8}" r=".5" fill="#f6d34a"/>`;
  }
  /* Rohrkolben hinten links */
  for (const [x, h] of [[-46, 22], [-43, 26], [-40, 19], [-37, 24]]) k += `<path d="M${x} ${-ry + 1} q.6 ${-h / 2} 0 ${-h}" stroke="#5a8a3a" stroke-width=".55" fill="none"/><rect x="${x - 0.7}" y="${-ry + 1 - h * 0.86}" width="1.4" height="4.4" rx=".7" fill="#6b4226"/>`;
  for (const [x, w] of [[-48, -12], [-35, 14], [-41, -4]]) k += `<path d="M${x} ${-ry + 1} q${w * 0.4} -9 ${w} -16" stroke="#6a9a48" stroke-width=".7" fill="none"/>`;
  for (let i = 0; i <= 18; i++) { const a = i * Math.PI / 18; k += stein(Math.cos(a) * (rx + 1.5), Math.sin(a) * (ry + 1.8) + 0.6, 3.6 + rnd() * 1.6, 1.8 + rnd() * 0.7); }
  S.teil({ id: "teich", de: "der Teich", syl: "TEICH", it: "lo stagno", itSyl: "STA-gno", en: "pond", x: cx, y: cy, kunst: k,
    tipp: "Im Gartenteich wachsen Seerosen. Abends quaken hier manchmal die Frösche." });
}
{
  /* DER GARTENZWERG am rechten Teichrand */
  const d = 4.2, s = sk(d), X = TEICH.cx - TEICH.rx - 6, Y = TEICH.cy - 2;
  let k = schatten(0, 0.3, 0.12 * s, 0.8, 0.3);
  k += `<path d="M${r(-0.1 * s)} 0 L${r(0.1 * s)} 0 L${r(0.09 * s)} ${r(-0.1 * s)} L${r(-0.09 * s)} ${r(-0.1 * s)} Z" fill="#3a5a8a"/>`;
  k += `<rect x="${r(-0.105 * s)}" y="${r(-0.025 * s)}" width="${r(0.09 * s)}" height="${r(0.03 * s)}" rx=".5" fill="#4a3220"/><rect x="${r(0.015 * s)}" y="${r(-0.025 * s)}" width="${r(0.09 * s)}" height="${r(0.03 * s)}" rx=".5" fill="#4a3220"/>`;
  k += `<path d="M${r(-0.1 * s)} ${r(-0.09 * s)} Q${r(-0.12 * s)} ${r(-0.2 * s)} 0 ${r(-0.21 * s)} Q${r(0.12 * s)} ${r(-0.2 * s)} ${r(0.1 * s)} ${r(-0.09 * s)} Z" fill="#2f7f3a"/>`;
  k += `<rect x="${r(-0.1 * s)}" y="${r(-0.12 * s)}" width="${r(0.2 * s)}" height="${r(0.02 * s)}" fill="#3a2a1a"/><rect x="${r(-0.015 * s)}" y="${r(-0.122 * s)}" width="${r(0.03 * s)}" height="${r(0.024 * s)}" fill="#e2c35a"/>`;
  k += `<path d="M${r(-0.06 * s)} ${r(-0.19 * s)} Q0 ${r(-0.1 * s)} ${r(0.06 * s)} ${r(-0.19 * s)} L0 ${r(-0.13 * s)} Z" fill="#f4f1ea"/>`;
  k += `<circle cx="0" cy="${r(-0.22 * s)}" r="${r(0.045 * s)}" fill="#f0c8a8"/><circle cx="${r(0.01 * s)}" cy="${r(-0.212 * s)}" r=".5" fill="#e8907a"/>`;
  k += `<path d="M${r(-0.055 * s)} ${r(-0.235 * s)} Q${r(-0.02 * s)} ${r(-0.37 * s)} ${r(0.05 * s)} ${r(-0.38 * s)} Q${r(0.03 * s)} ${r(-0.31 * s)} ${r(0.055 * s)} ${r(-0.235 * s)} Z" fill="#d0021b"/>`;
  /* Angel über dem Wasser */
  k += `<path d="M${r(0.09 * s)} ${r(-0.14 * s)} L${r(0.42 * s)} ${r(-0.34 * s)}" stroke="#8a5f33" stroke-width=".5"/><path d="M${r(0.42 * s)} ${r(-0.34 * s)} q.6 3 .4 ${r(0.32 * s)}" stroke="#ddd" stroke-width=".15" fill="none"/>`;
  S.teil({ oben: true, id: "gartenzwerg", de: "der Gartenzwerg", syl: "GAR-ten-zwerg", it: "il nano da giardino", itSyl: "NA-no da giar-DI-no", en: "garden gnome", x: X, y: Y, kunst: k,
    tipp: "Der Gartenzwerg mit roter Mütze ist typisch deutsch — dieser angelt im Teich." });
}

/* =====================================================================
   13 — VORN: DIE BLUME (Staudenbeet), DER SCHMETTERLING,
        DIE GIESSKANNE, DER GARTENSCHLAUCH
   ===================================================================== */
{
  const X = 52, Y = 199;
  let k = `<path d="M-52 2 L-52 -12 Q-20 -20 18 -15 Q40 -12 46 2 Z" fill="${ERDE}"/>`;
  /* Rasenkante aus kleinen Steinen */
  for (let i = 0; i < 14; i++) { const t = i / 13, x = -50 + t * 94, y = -12.5 - Math.sin(t * Math.PI) * 4 + t * 8; k += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="3.4" ry="1.3" fill="#b9b2a4"/>`; }
  const pflanzen = [];
  for (let i = 0; i < 24; i++) pflanzen.push([-48 + rnd() * 90, -11 + rnd() * 12, i % 4]);
  pflanzen.sort((a, b) => a[1] - b[1]);
  for (const [x, y, art] of pflanzen) {
    k += `<path d="M${r(x)} ${r(y)} l-1.6 -5 M${r(x)} ${r(y)} l0 -7 M${r(x)} ${r(y)} l1.8 -5" stroke="#4f8a35" stroke-width=".5"/><ellipse cx="${r(x)}" cy="${r(y - 1.5)}" rx="3.2" ry="1.6" fill="${LAUB_D}"/>`;
    if (art === 0) for (const [dx, dy] of [[-1.6, -5.2], [0, -7.4], [1.8, -5.4]]) k += `<circle cx="${r(x + dx)}" cy="${r(y + dy)}" r="1.5" fill="#e0465a"/><circle cx="${r(x + dx)}" cy="${r(y + dy)}" r=".6" fill="#a31d33"/>`;
    else if (art === 1) for (const [dx, dy] of [[-1.6, -5.2], [0, -7.4], [1.8, -5.4]]) k += `<circle cx="${r(x + dx)}" cy="${r(y + dy)}" r="1.6" fill="#fbfbf4"/><circle cx="${r(x + dx)}" cy="${r(y + dy)}" r=".6" fill="#f2c21a"/>`;
    else if (art === 2) for (const dx of [-1.6, 0, 1.8]) k += `<path d="M${r(x + dx)} ${r(y - 3)} l0 -5" stroke="#8a68c8" stroke-width="1.1" stroke-linecap="round" stroke-dasharray=".7 .3"/>`;
    else for (const [dx, dy] of [[-1.6, -5.2], [1.8, -5.6]]) k += `<circle cx="${r(x + dx)}" cy="${r(y + dy)}" r="1.7" fill="#e88ab0"/><circle cx="${r(x + dx)}" cy="${r(y + dy)}" r=".7" fill="#8a4a20"/>`;
  }
  S.teil({ id: "blume", de: "die Blume", syl: "BLU-me", it: "il fiore", itSyl: "FIO-re", en: "flower", x: X, y: Y, kunst: k,
    tipp: "Im Blumenbeet blühen Rosen, Margeriten, Lavendel und Sonnenhut." });
}
{
  /* DER SCHMETTERLING — ein Tagpfauenauge über den Blumen */
  const x = 66, y = 171;
  let k = `<path d="M0 0 q-3.4 -3.6 -4.6 -.6 q-.6 1.6 4.6 .6 Z M0 0 q3.4 -3.6 4.6 -.6 q.6 1.6 -4.6 .6 Z" fill="#b8342a"/>`;
  k += `<path d="M0 .4 q-2.6 .4 -3 2.2 q1.6 .6 3 -2.2 Z M0 .4 q2.6 .4 3 2.2 q-1.6 .6 -3 -2.2 Z" fill="#7a2a20"/>`;
  k += `<circle cx="-3.2" cy="-1.6" r=".8" fill="#2a4a8a"/><circle cx="3.2" cy="-1.6" r=".8" fill="#2a4a8a"/><circle cx="-3.2" cy="-1.6" r=".35" fill="#f2d24a"/><circle cx="3.2" cy="-1.6" r=".35" fill="#f2d24a"/>`;
  k += `<path d="M0 -1 l0 3" stroke="#1d1d1d" stroke-width=".5"/><path d="M0 -1 q-.6 -1.4 -1.2 -1.8 M0 -1 q.6 -1.4 1.2 -1.8" stroke="#1d1d1d" stroke-width=".2" fill="none"/>`;
  S.teil({ oben: true, id: "schmetterling", de: "der Schmetterling", syl: "SCHMET-ter-ling", it: "la farfalla", itSyl: "far-FAL-la", en: "butterfly", x, y, kunst: k + flaeche(-5, -4, 10, 7),
    tipp: "Ein Tagpfauenauge: Die Flecken auf den Flügeln sehen aus wie Augen." });
}
{
  /* DIE GIESSKANNE — grüne Kunststoffkanne, 10 Liter */
  const d = 3.7, s = sk(d), X = 238, Y = 193;
  let k = schatten(0, 0.3, 0.2 * s, 1, 0.3);
  k += `<path d="M${r(-0.13 * s)} 0 L${r(0.13 * s)} 0 L${r(0.11 * s)} ${r(-0.3 * s)} L${r(-0.11 * s)} ${r(-0.3 * s)} Z" fill="${S.lg("kanne", [[0, "#2f8a4f"], [0.45, "#4fb36e"], [1, "#22663a"]], 0, 0, 1, 0)}"/>`;
  k += `<ellipse cx="0" cy="${r(-0.3 * s)}" rx="${r(0.11 * s)}" ry="1" fill="#1f5a33"/><path d="M${r(-0.08 * s)} ${r(-0.3 * s)} Q0 ${r(-0.44 * s)} ${r(0.1 * s)} ${r(-0.3 * s)}" stroke="#2f8a4f" stroke-width="1.6" fill="none"/>`;
  k += `<path d="M${r(-0.11 * s)} ${r(-0.06 * s)} L${r(-0.36 * s)} ${r(-0.34 * s)}" stroke="#2f8a4f" stroke-width="1.4" stroke-linecap="round"/>`;
  k += `<ellipse cx="${r(-0.38 * s)}" cy="${r(-0.36 * s)}" rx="1.8" ry="1.1" fill="#22663a" transform="rotate(-40 ${r(-0.38 * s)} ${r(-0.36 * s)})"/>`;
  k += `<path d="M${r(-0.08 * s)} ${r(-0.26 * s)} L${r(-0.08 * s)} ${r(-0.04 * s)}" stroke="#fff" stroke-width=".7" opacity=".3"/>`;
  S.teil({ id: "giesskanne", de: "die Gießkanne", syl: "GIESS-kan-ne", it: "l'annaffiatoio", itSyl: "an-naf-fia-TO-io", en: "watering can", x: X, y: Y, steht: true, kunst: k,
    tipp: "Am besten gießt man morgens oder abends — mittags verdunstet das Wasser zu schnell." });
}
{
  /* DER GARTENSCHLAUCH — liegt in Schlingen auf dem Rasen, mit Brause */
  const X = 284, Y = 190;
  let k = "";
  const schlinge = (cx, cy, rx, ry) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="#1f4f2a" stroke-width="2.2"/><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="#3f9a52" stroke-width="1.5"/><path d="M${cx - rx * 0.7} ${cy - ry * 0.75} q${rx * 0.7} ${-ry * 0.35} ${rx * 1.4} 0" stroke="#bfe8b8" stroke-width=".4" fill="none" opacity=".7"/>`;
  k += `<path d="M40 -6 Q30 -4 22 -2" stroke="#1f4f2a" stroke-width="2.2" fill="none"/><path d="M40 -6 Q30 -4 22 -2" stroke="#3f9a52" stroke-width="1.5" fill="none"/>`;
  k += schlinge(6, 0, 16, 4.4) + schlinge(3, 1, 13, 3.4);
  k += `<path d="M-10 1 Q-20 3 -26 1" stroke="#1f4f2a" stroke-width="2.2" fill="none"/><path d="M-10 1 Q-20 3 -26 1" stroke="#3f9a52" stroke-width="1.5" fill="none"/>`;
  /* Gartenbrause (Pistole) */
  k += `<path d="M-26 1 l-4 -.6 l-.6 -3.2 l1.6 -.4 l.6 2.2 l3 .4 Z" fill="#f2a01a"/><rect x="-33.6" y="-2.6" width="3.6" height="2" rx=".6" fill="#2b2f33"/>`;
  S.teil({ id: "gartenschlauch", de: "der Gartenschlauch", syl: "GAR-ten-schlauch", it: "il tubo da giardino", itSyl: "TU-bo da giar-DI-no", en: "garden hose", x: X, y: Y, steht: true, kunst: k + flaeche(-34, -6, 72, 11),
    tipp: "Mit dem Gartenschlauch geht das Gießen schneller als mit der Gießkanne." });
}

/* Licht: ein warmer Sonnenschimmer von rechts oben über allem (fängt keinen Tipp) */
S.davor(`<rect x="0" y="0" width="320" height="200" fill="${S.rg("licht", [[0, "#fff4d0", 0.16], [0.6, "#fff4d0", 0], [1, "#fff4d0", 0]], 0.9, 0.1, 0.9)}" pointer-events="none"/>`);

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/garten.js"));
console.log(aus);
