#!/usr/bin/env node
/* =====================================================================
   DER FRIEDHOF (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   XANDER (Funk 263/286): jeder Ort authentisch wie das echte Vorbild,
   alles logisch platziert, jedes Ding einzeln antippbar, nichts blockiert.

   RECHERCHE (Friedhofspläne Stadt Köln und Germering, Hinweise zur
   Grabpflege) — so sieht ein deutscher Friedhof aus:
   - Gräber stehen in GRABFELDERN, die von HECKEN (Hainbuche, Eibe) und
     Bäumen (Linden) eingefasst sind. Dazwischen KIESWEGE.
   - Ein Wahlgrab: GRABSTEIN aus Granit am Kopfende (Name, Geburts- und
     Sterbejahr), davor das GRABBEET mit Steinkante, Bodendeckern und
     Blumen, ein GRABLICHT (rote Kerze im Glas), oft eine GRABLATERNE,
     eine VASE, eine Engelsfigur.
   - Ein frisches Grab nach der Beerdigung: ein Erdhügel mit KRÄNZEN und
     Schleifen, ein schlichtes HOLZKREUZ, bis der Stein gesetzt wird.
   - Urnengräber sind klein; daneben eine URNENWAND (Kolumbarium).
   - An den Wegen die WASSERSTELLE (Schöpfbecken mit WASSERHAHN) und ein
     Ständer mit GIESSKANNEN und HARKE für alle.
   - Die TRAUERHALLE (Kapelle mit Dachreiter und Glocke) am Eingang.
   - Überall BÄNKE zum Verweilen.
   Maßstab: Augenhöhe y = 88, Brennweite 220 → Einheiten je Meter =
   220 / Entfernung. Gräber (6 m) ≈ 37 je Meter, Weg vorne ≈ 55 je Meter.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "friedhof", titel: "Der Friedhof", emoji: "🕯️", thema: "Leben", kuerzel: "b13c", fassung: 852 });
const rnd = zufall(1950);
const r = B.r;

const VX = 160, VY = 88, F = 220, AUGE = 1.6;
const sk = (d) => F / d;
const PX = (xw, d) => VX + xw * F / d;
const PY = (h, d) => VY + (AUGE - h) * F / d;
const P = (xw, h, d) => `${r(PX(xw, d))} ${r(PY(h, d))}`;
/* Teil in Bildkoordinaten zeichnen, Anker (X, Y) */
const G = (X, Y, svg) => `<g transform="translate(${r(-X)} ${r(-Y)})">${svg}</g>`;

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const GRANIT = S.lg("granit", [[0, "#5b5f66"], [0.5, "#3c4047"], [1, "#2a2d33"]], 0, 0, 1, 1);
const HOLZ = S.lg("holz", [[0, "#9a6b3e"], [1, "#6e4824"]], 0, 0, 1, 0);
const ERDE = S.lg("erde", [[0, "#6b4a30"], [1, "#4a3220"]]);
const LAUB = S.rg("laub", [[0, "#7fa65a"], [0.6, "#4f7a36"], [1, "#2f5222"]], 0.4, 0.35, 0.7);
const HECKE = S.lg("hecke", [[0, "#4f7a3a"], [1, "#2c4a24"]]);
const ZINK = S.lg("zink", [[0, "#9aa3aa"], [0.45, "#d9dee2"], [1, "#8a939a"]], 0, 0, 1, 0);
const KANNE = S.lg("kanne", [[0, "#3f8f4a"], [0.5, "#5cb066"], [1, "#2c6b35"]], 0, 0, 1, 0);
const FLAMME = S.rg("flamme", [[0, "#fffbe0"], [0.45, "#ffd46b"], [1, "#ff9a2a", 0]], 0.5, 0.6, 0.6);
S.def(`<pattern id="${S.id("blatt")}" width="5" height="4" patternUnits="userSpaceOnUse"><rect width="5" height="4" fill="#3d6630"/><ellipse cx="1.2" cy="1" rx="1.3" ry=".8" fill="#5a8a42"/><ellipse cx="3.8" cy="2.6" rx="1.4" ry=".9" fill="#4c7a39"/><ellipse cx="1.6" cy="3.4" rx="1" ry=".6" fill="#2f5426"/></pattern>`);
S.def(`<pattern id="${S.id("kies")}" width="6" height="3" patternUnits="userSpaceOnUse"><rect width="6" height="3" fill="#cfc4b0"/><circle cx="1" cy=".8" r=".45" fill="#e8dfcd"/><circle cx="3.6" cy="1.9" r=".5" fill="#a99c86"/><circle cx="5.2" cy=".6" r=".35" fill="#f2ebdc"/><circle cx="2.2" cy="2.5" r=".35" fill="#b7aa93"/><circle cx="4.6" cy="2.7" r=".3" fill="#ded3bf"/></pattern>`);
S.def(`<pattern id="${S.id("gras")}" width="4" height="3" patternUnits="userSpaceOnUse"><rect width="4" height="3" fill="#6f9a48"/><path d="M.5 3 l.3 -1.6 M1.6 3 l-.2 -1.3 M2.8 3 l.4 -1.8 M3.6 3 l-.2 -1.1" stroke="#507a33" stroke-width=".35"/><path d="M1.1 3 l.2 -1 M3.2 3 l-.1 -1.2" stroke="#8fbd5e" stroke-width=".3"/></pattern>`);

/* =====================================================================
   KULISSE — Himmel, ferne Bäume, Rasen
   ===================================================================== */
S.hinten(`<rect x="0" y="0" width="320" height="110" fill="${S.lg("himmel", [[0, "#9cbcd8"], [0.7, "#dfe8ee"], [1, "#f1efe6"]])}"/>`);
S.hinten(`<ellipse cx="70" cy="18" rx="34" ry="6" fill="#fff" opacity=".6"/><ellipse cx="250" cy="28" rx="28" ry="5" fill="#fff" opacity=".5"/>`);
/* ferne Baumreihe */
{
  let b = "";
  for (let i = 0; i < 26; i++) { const x = i * 13 + rnd() * 6, h = 16 + rnd() * 14; b += `<ellipse cx="${r(x)}" cy="${r(VY + 6 - h / 2)}" rx="${r(8 + rnd() * 5)}" ry="${r(h / 2 + 4)}" fill="${rnd() < 0.5 ? "#7e9a74" : "#6c8a64"}" opacity=".85"/>`; }
  b += `<rect x="0" y="${VY + 2}" width="320" height="16" fill="#7e9a74"/>`;
  S.hinten(b);
}
/* Rasen bis vorne */
S.hinten(`<rect x="0" y="${VY + 8}" width="320" height="${200 - VY - 8}" fill="url(#${S.id("gras")})"/><rect x="0" y="${VY + 8}" width="320" height="${200 - VY - 8}" fill="${S.lg("rasenlicht", [[0, "#2b3a20", 0.25], [0.5, "#2b3a20", 0], [1, "#fff6d8", 0.08]])}"/>`);

/* =====================================================================
   1 — DIE TRAUERHALLE (Kapelle mit Dachreiter, hinten)
   ===================================================================== */
{
  const d = 26, s = sk(d), y0 = PY(0, d), X = PX(-0.3, d);
  const W = 12 * s, Hw = 4.6 * s, Hd = 3.4 * s;
  let k = `<rect x="${r(-W / 2)}" y="${r(-Hw)}" width="${r(W)}" height="${r(Hw)}" fill="${S.lg("halle", [[0, "#efe5d2"], [1, "#d8cab0"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${r(-W / 2 - 2)} ${r(-Hw)} L0 ${r(-Hw - Hd)} L${r(W / 2 + 2)} ${r(-Hw)} Z" fill="${S.lg("dach", [[0, "#8a4434"], [1, "#6a3024"]])}"/>`;
  k += `<path d="M${r(-W / 2 - 2)} ${r(-Hw)} L0 ${r(-Hw - Hd)}" stroke="#4e2219" stroke-width=".6"/>`;
  /* Dachreiter mit Glocke und Kreuz */
  k += `<rect x="-3" y="${r(-Hw - Hd - 7)}" width="6" height="8" fill="#e6dac3"/><path d="M-1.6 ${r(-Hw - Hd - 5)} q1.6 -2.4 3.2 0 v2.6 h-3.2 Z" fill="#3a3a3a"/><circle cx="0" cy="${r(-Hw - Hd - 2.6)}" r=".7" fill="#c9a13f"/>`;
  k += `<path d="M-4 ${r(-Hw - Hd - 7)} L0 ${r(-Hw - Hd - 13)} L4 ${r(-Hw - Hd - 7)} Z" fill="#6e7d70"/><path d="M0 ${r(-Hw - Hd - 13)} v-5 M-1.6 ${r(-Hw - Hd - 16.2)} h3.2" stroke="#3a3a3a" stroke-width=".55"/>`;
  /* Rundfenster und hohe Fenster */
  k += `<circle cx="0" cy="${r(-Hw + 4)}" r="3.4" fill="#5f7d93" stroke="#cbbd9f" stroke-width="1"/>`;
  for (const x of [-W * 0.35, -W * 0.2, W * 0.2, W * 0.35]) k += `<path d="M${r(x - 2)} ${r(-Hw * 0.12)} L${r(x - 2)} ${r(-Hw * 0.6)} Q${r(x)} ${r(-Hw * 0.72)} ${r(x + 2)} ${r(-Hw * 0.6)} L${r(x + 2)} ${r(-Hw * 0.12)} Z" fill="#4f6b80"/>`;
  k += `<path d="M-5 0 L-5 ${r(-Hw * 0.62)} Q0 ${r(-Hw * 0.82)} 5 ${r(-Hw * 0.62)} L5 0 Z" fill="#5a3a22"/>`;
  k += `<rect x="${r(-W / 2)}" y="${r(-Hw)}" width="${r(W)}" height="${r(Hw)}" fill="${S.lg("halleschatten", [[0, "#000", 0], [1, "#000", 0.1]])}"/>`;
  S.teil({ id: "fh_trauerhalle", de: "die Trauerhalle", syl: "TRAU-er-hal-le", it: "la cappella cimiteriale", itSyl: "cap-PEL-la", en: "funeral chapel", x: X, y: y0, kunst: k,
    tipp: "Hier findet die Trauerfeier statt, bevor man zum Grab geht." });
}

/* =====================================================================
   2 — DER BAUM (alte Linde links, hinter der Hecke)
   ===================================================================== */
{
  const d = 8.6, s = sk(d), X = PX(-3.0, d), Y = PY(0, d);
  let k = `<path d="M-3.6 0 Q-3 -20 -2.2 -44 L2.4 -44 Q3 -20 4 0 Z" fill="${S.lg("stamm", [[0, "#5a4632"], [0.5, "#7a6248"], [1, "#4a3828"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-1 -40 Q-10 -56 -18 -62 M1.4 -42 Q8 -60 14 -66" stroke="#5a4632" stroke-width="2.4" fill="none"/>`;
  for (let i = 0; i < 22; i++) {
    const a = rnd() * Math.PI * 2, rr = rnd() * 30, x = Math.cos(a) * rr * 1.25, y = -76 + Math.sin(a) * rr * 0.8;
    k += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(13 + rnd() * 9)}" ry="${r(11 + rnd() * 7)}" fill="${LAUB}"/>`;
  }
  for (let i = 0; i < 40; i++) { const x = -40 + rnd() * 80, y = -104 + rnd() * 54; k += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(1.6 + rnd() * 2)}" fill="${rnd() < 0.5 ? "#9cc06f" : "#2f5222"}" opacity=".22"/>`; }
  S.teil({ id: "baum", de: "der Baum", syl: "BAUM", it: "l'albero", itSyl: "AL-be-ro", en: "tree", x: X, y: Y, kunst: k,
    tipp: "Alte Linden spenden auf dem Friedhof Schatten und Ruhe." });
}

/* =====================================================================
   3 — DIE URNENWAND (rechts hinten, Kolumbarium aus Naturstein)
   ===================================================================== */
{
  const d = 11, s = sk(d), X = PX(2.9, d), Y = PY(0, d), W = 4.6 * s, H = 2.2 * s;
  let k = schatten(0, 0.4, W / 2 + 2, 1.4, 0.25);
  k += `<rect x="${r(-W / 2)}" y="${r(-H)}" width="${r(W)}" height="${r(H)}" fill="${S.lg("urnenwand", [[0, "#d6cebf"], [1, "#b3aa98"]])}"/>`;
  k += `<rect x="${r(-W / 2 - 1)}" y="${r(-H - 2)}" width="${r(W + 2)}" height="2.4" fill="#a39a88"/>`;
  const nx = 7, ny = 3, cw = (W - 4) / nx, ch = (H - 6) / ny;
  for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
    const x = -W / 2 + 2 + i * cw, y = -H + 2 + j * ch, frei = (i * 3 + j) % 5 === 4;
    k += `<rect x="${r(x + 0.4)}" y="${r(y + 0.4)}" width="${r(cw - 0.8)}" height="${r(ch - 0.8)}" fill="${frei ? "#c9c0ae" : GRANIT}" stroke="#8d8576" stroke-width=".25"/>`;
    if (!frei) k += `<rect x="${r(x + cw * 0.2)}" y="${r(y + ch * 0.35)}" width="${r(cw * 0.6)}" height=".5" fill="#d8d2c4"/><rect x="${r(x + cw * 0.3)}" y="${r(y + ch * 0.55)}" width="${r(cw * 0.4)}" height=".4" fill="#a8a294"/>`;
    if (!frei && (i + j) % 3 === 0) k += `<path d="M${r(x + cw * 0.78)} ${r(y + ch - 1)} l0 -2.4" stroke="#4f7a36" stroke-width=".5"/><circle cx="${r(x + cw * 0.78)}" cy="${r(y + ch - 3.6)}" r=".9" fill="#e4567a"/>`;
  }
  k += `<rect x="${r(-W / 2)}" y="-1.6" width="${r(W)}" height="1.6" fill="#8d8576"/>`;
  S.teil({ id: "fh_urnenwand", de: "die Urnenwand", syl: "UR-nen-wand", it: "il colombario", itSyl: "co-lom-BA-rio", en: "columbarium wall", x: X, y: Y, kunst: k,
    tipp: "Eine Wand mit kleinen Kammern. Darin steht je eine Urne." });
}

/* =====================================================================
   4 — DIE HECKE (Hainbuche, teilt das Grabfeld ab)
   ===================================================================== */
{
  const d = 7.0, s = sk(d), Y = PY(0, d), H = 1.05 * s;
  let k = `<path d="M-160 0 L-160 ${r(-H + 3)}`;
  for (let x = -160; x < 160; x += 8) k += ` Q${x + 4} ${r(-H - 2 - (x % 16 ? 0 : 1.5))} ${x + 8} ${r(-H + 1)}`;
  k += ` L160 0 Z" fill="${HECKE}"/>`;
  k += `<rect x="-162" y="${r(-H)}" width="324" height="${r(H)}" fill="url(#${S.id("blatt")})" opacity=".55"/>`;
  k += `<rect x="-162" y="${r(-H - 2)}" width="324" height="8" fill="${S.lg("heckelicht", [[0, "#cfe0a0", 0.35], [1, "#cfe0a0", 0]])}"/>`;
  k += `<rect x="-162" y="-4" width="324" height="4" fill="#1f3518" opacity=".4"/>`;
  S.teil({ id: "fh_hecke", de: "die Hecke", syl: "HE-cke", it: "la siepe", itSyl: "SIE-pe", en: "hedge", x: VX, y: Y, kunst: k,
    tipp: "Hecken teilen den Friedhof in ruhige Felder." });
}

/* =====================================================================
   5 — DER KIESWEG (vorne quer durchs Bild)
   ===================================================================== */
const WEG = { d0: 3.0, d1: 4.15 };
{
  const y0 = PY(0, WEG.d1), y1 = 200;
  let k = `<rect x="-160" y="0" width="320" height="${r(y1 - y0)}" fill="url(#${S.id("kies")})"/>`;
  S.def(`<pattern id="${S.id("kies2")}" href="#${S.id("kies")}" patternTransform="scale(1.7)"/>`);
  k += `<rect x="-160" y="${r(PY(0, 3.6) - y0)}" width="320" height="${r(y1 - PY(0, 3.6))}" fill="url(#${S.id("kies2")})"/>`;
  k += `<rect x="-160" y="0" width="320" height="${r(y1 - y0)}" fill="${S.lg("weglicht", [[0, "#5a4a30", 0.18], [0.3, "#5a4a30", 0], [1, "#fff", 0.1]])}"/>`;
  k += `<rect x="-160" y="0" width="320" height="1.4" fill="#8c8170"/>`;
  /* Rasenkante vorne */
  k += `<rect x="-160" y="${r(PY(0, WEG.d0) - y0)}" width="320" height="${r(y1 - PY(0, WEG.d0) + 1)}" fill="url(#${S.id("gras")})"/><rect x="-160" y="${r(PY(0, WEG.d0) - y0)}" width="320" height="1.2" fill="#8a9a5a"/>`;
  S.teil({ id: "fh_weg", de: "der Kiesweg", syl: "KIES-weg", it: "il vialetto di ghiaia", itSyl: "via-LET-to", en: "gravel path", x: VX, y: y0, kunst: k,
    tipp: "Kies knirscht — deshalb hört man hier jeden Schritt." });
}

/* =====================================================================
   6 — DIE GRÄBER: Grabbeete (Grab, zweite Grabstelle, Urnengrab)
   ===================================================================== */
const D_V = 4.35, D_H = 5.95;     /* Grabstellen: vorne / Kopfende */
const beet = (xa, xb, dv, dh, fuell) => {
  /* Steinkante (Einfassung) und Fläche */
  let g = `<path d="M${P(xa, 0.1, dh)} L${P(xb, 0.1, dh)} L${P(xb, 0.1, dv)} L${P(xa, 0.1, dv)} Z" fill="#c9c2b4"/>`;
  g += `<path d="M${P(xa, 0, dv)} L${P(xb, 0, dv)} L${P(xb, 0.1, dv)} L${P(xa, 0.1, dv)} Z" fill="#a8a092"/>`;
  g += `<path d="M${P(xa + 0.07, 0.11, dh - 0.07)} L${P(xb - 0.07, 0.11, dh - 0.07)} L${P(xb - 0.07, 0.11, dv + 0.07)} L${P(xa + 0.07, 0.11, dv + 0.07)} Z" fill="${fuell}"/>`;
  return g;
};
/* Pflanzen auf dem Beet: Bodendecker-Tupfen und Blumen */
const pflanzen = (xa, xb, dv, dh, farben, n) => {
  let g = "";
  for (let i = 0; i < n; i++) {
    const t = rnd(), u = rnd(), d = dv + 0.1 + u * (dh - dv - 0.3), xw = xa + 0.12 + t * (xb - xa - 0.24), s = sk(d);
    const x = PX(xw, d), y = PY(0.12, d);
    g += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(0.09 * s)}" ry="${r(0.05 * s)}" fill="${rnd() < 0.5 ? "#3f6b2e" : "#5a8a3c"}"/>`;
    if (farben && rnd() < 0.55) g += `<circle cx="${r(x)}" cy="${r(y - 0.04 * s)}" r="${r(0.035 * s)}" fill="${farben[Math.floor(rnd() * farben.length)]}"/>`;
  }
  return g;
};
const GR1 = { a: -2.05, b: -0.9 }, GR2 = { a: -0.1, b: 1.05 }, GR3 = { a: 1.35, b: 2.15 };
{
  const X = PX((GR1.a + GR1.b) / 2, D_V), Y = PY(0, D_V);
  let g = beet(GR1.a, GR1.b, D_V, D_H, S.lg("beet1", [[0, "#4a6b34"], [1, "#3a5a2a"]]));
  g += pflanzen(GR1.a, GR1.b, D_V, D_H, ["#d9283a", "#f0f0e8", "#d9283a"], 34);
  S.teil({ id: "fh_grab", de: "das Grab", syl: "GRAB", it: "la tomba", itSyl: "TOM-ba", en: "grave", x: X, y: Y, steht: true, kunst: G(X, Y, g),
    tipp: "Die Grabstelle wird bepflanzt und gepflegt. Dafür zahlt man Grabgebühr." });
}
{
  /* frisches Grab: Erdhügel, mit Tannengrün abgedeckt */
  const X = PX((GR2.a + GR2.b) / 2, D_V), Y = PY(0, D_V);
  let g = `<path d="M${P(GR2.a, 0, D_V)} Q${P(GR2.a - 0.05, 0.32, (D_V + D_H) / 2)} ${P((GR2.a + GR2.b) / 2, 0.42, (D_V + D_H) / 2 - 0.2)} Q${P(GR2.b + 0.05, 0.32, (D_V + D_H) / 2)} ${P(GR2.b, 0, D_V)} Z" fill="${ERDE}"/>`;
  g += `<path d="M${P(GR2.a, 0, D_H)} L${P(GR2.b, 0, D_H)} L${P(GR2.b, 0.3, (D_V + D_H) / 2)} L${P(GR2.a, 0.3, (D_V + D_H) / 2)} Z" fill="#5a3e28"/>`;
  for (let i = 0; i < 26; i++) {
    const xw = GR2.a + 0.1 + rnd() * (GR2.b - GR2.a - 0.2), d = D_V + 0.15 + rnd() * 1.3, s = sk(d);
    g += `<path d="M${r(PX(xw, d) - 0.12 * s)} ${r(PY(0.25, d))} q${r(0.12 * s)} ${r(-0.08 * s)} ${r(0.24 * s)} 0" stroke="${rnd() < 0.5 ? "#2f5a2a" : "#3e7034"}" stroke-width="${r(0.05 * s)}" fill="none"/>`;
  }
  S.teil({ id: "fh_grab2", de: "die zweite Grabstelle", syl: "ZWEI-te GRAB-stel-le", it: "la seconda tomba", itSyl: "se-CON-da TOM-ba", en: "second grave", x: X, y: Y, steht: true, kunst: G(X, Y, g),
    tipp: "Ein frisches Grab: Der Stein kommt erst nach einem Jahr, bis dahin steht ein Holzkreuz." });
}
/* Urnengrab mit Liegeplatte — Lupe mit Grablaterne, Engel, Vase, Blumenschale */
{
  const X = PX((GR3.a + GR3.b) / 2, D_V), Y = PY(0, D_V);
  let g = beet(GR3.a, GR3.b, D_V + 0.3, D_H - 0.4, S.lg("beet3", [[0, "#556b3a"], [1, "#44592e"]]));
  g += pflanzen(GR3.a, GR3.b, D_V + 0.3, D_H - 0.4, null, 16);
  /* Liegeplatte (heller Granit) */
  g += `<path d="M${P(GR3.a + 0.12, 0.16, D_H - 0.55)} L${P(GR3.b - 0.12, 0.16, D_H - 0.55)} L${P(GR3.b - 0.12, 0.16, D_H - 1.15)} L${P(GR3.a + 0.12, 0.16, D_H - 1.15)} Z" fill="${S.lg("platte", [[0, "#d9d3c6"], [1, "#b4ac9c"]])}"/>`;
  g += `<text x="${r(PX((GR3.a + GR3.b) / 2, D_H - 0.85))}" y="${r(PY(0.16, D_H - 0.85) + 0.6)}" font-size="2.4" text-anchor="middle" fill="#5d564a" font-family="Georgia,serif">Anna Roth</text>`;
  const unter = [];
  const u = (o, xw, d, w, h) => { const ux = PX(xw, d), uy = PY(0.12, d); unter.push(Object.assign(o, { x: ux, y: uy, kunst: flaeche(-w / 2, -h, w, h + 1) })); return [ux, uy, sk(d)]; };
  /* Grablaterne (schwarzes Metall, rotes Licht) */
  {
    const [x, y, s] = u({ id: "grablaterne", de: "die Grablaterne", syl: "GRAB-la-ter-ne", it: "la lanterna", itSyl: "lan-TER-na", en: "grave lantern", tipp: "In der Laterne brennt das Licht auch bei Wind und Regen." }, GR3.a + 0.22, D_H - 0.35, 7, 13);
    const w = 0.13 * s, h = 0.3 * s;
    g += `<rect x="${r(x - w / 2 - 0.6)}" y="${r(y - 1)}" width="${r(w + 1.2)}" height="1" fill="#2b2d30"/><rect x="${r(x - w / 2)}" y="${r(y - h)}" width="${r(w)}" height="${r(h - 1)}" fill="#3b2a1e" opacity=".35" stroke="#2b2d30" stroke-width=".6"/>`;
    g += `<rect x="${r(x - 1)}" y="${r(y - h * 0.55)}" width="2" height="${r(h * 0.4)}" fill="#c0272d"/><ellipse cx="${r(x)}" cy="${r(y - h * 0.62)}" rx=".7" ry="1.2" fill="${FLAMME}"/>`;
    g += `<path d="M${r(x - w / 2 - 0.8)} ${r(y - h)} L${r(x)} ${r(y - h - 3)} L${r(x + w / 2 + 0.8)} ${r(y - h)} Z" fill="#2b2d30"/><circle cx="${r(x)}" cy="${r(y - h - 3.6)}" r=".7" fill="none" stroke="#2b2d30" stroke-width=".4"/>`;
  }
  /* Engel (kleine Sandsteinfigur) */
  {
    const [x, y, s] = u({ id: "engel", de: "der Engel", syl: "EN-gel", it: "l'angelo", itSyl: "AN-ge-lo", en: "angel", tipp: "Ein kleiner Engel aus Stein wacht über das Grab." }, GR3.b - 0.25, D_H - 0.35, 8, 14);
    const h = 0.38 * s;
    g += `<rect x="${r(x - 2.6)}" y="${r(y - 1.6)}" width="5.2" height="1.6" fill="#b9ad96"/>`;
    g += `<path d="M${r(x - 1.8)} ${r(y - 1.6)} Q${r(x - 2)} ${r(y - h * 0.6)} ${r(x - 0.9)} ${r(y - h * 0.78)} L${r(x + 0.9)} ${r(y - h * 0.78)} Q${r(x + 2)} ${r(y - h * 0.6)} ${r(x + 1.8)} ${r(y - 1.6)} Z" fill="${S.lg("sandfig", [[0, "#e4d8bf"], [1, "#b9ad96"]], 0, 0, 1, 0)}"/>`;
    g += `<path d="M${r(x - 0.8)} ${r(y - h * 0.72)} Q${r(x - 5)} ${r(y - h * 0.9)} ${r(x - 3.4)} ${r(y - h * 0.4)} Q${r(x - 2)} ${r(y - h * 0.55)} ${r(x - 0.8)} ${r(y - h * 0.55)} Z M${r(x + 0.8)} ${r(y - h * 0.72)} Q${r(x + 5)} ${r(y - h * 0.9)} ${r(x + 3.4)} ${r(y - h * 0.4)} Q${r(x + 2)} ${r(y - h * 0.55)} ${r(x + 0.8)} ${r(y - h * 0.55)} Z" fill="#d6c9ad"/>`;
    g += `<circle cx="${r(x)}" cy="${r(y - h * 0.86)}" r="${r(h * 0.11)}" fill="#e8dcc4"/><path d="M${r(x - 0.7)} ${r(y - h * 0.62)} l.7 .7 l.7 -.7" stroke="#a89c84" stroke-width=".3" fill="none"/>`;
  }
  /* Grabvase mit weißen Rosen */
  {
    const [x, y, s] = u({ id: "grabvase", de: "die Grabvase", syl: "GRAB-va-se", it: "il vaso da tomba", itSyl: "VA-so da TOM-ba", en: "grave vase", tipp: null }, GR3.a + 0.55, D_H - 0.3, 6, 11);
    const h = 0.22 * s;
    g += `<path d="M${r(x - 1.3)} ${r(y)} L${r(x + 1.3)} ${r(y)} L${r(x + 1.1)} ${r(y - h)} L${r(x - 1.1)} ${r(y - h)} Z" fill="${GRANIT}"/>`;
    for (let i = 0; i < 5; i++) { const a = -0.8 + i * 0.4; g += `<line x1="${r(x)}" y1="${r(y - h)}" x2="${r(x + Math.sin(a) * 3)}" y2="${r(y - h - Math.cos(a) * 4)}" stroke="#3f6b2e" stroke-width=".35"/><circle cx="${r(x + Math.sin(a) * 3.2)}" cy="${r(y - h - Math.cos(a) * 4.2)}" r=".9" fill="#f6f2e6" stroke="#ddd5c2" stroke-width=".15"/>`; }
  }
  /* Blumenschale (Stiefmütterchen) vorne */
  {
    const [x, y, s] = u({ id: "blumenschale", de: "die Blumenschale", syl: "BLU-men-scha-le", it: "la ciotola di fiori", itSyl: "CIO-to-la di FIO-ri", en: "flower bowl", tipp: null }, (GR3.a + GR3.b) / 2, D_V + 0.55, 9, 6);
    const w = 0.32 * s;
    g += `<path d="M${r(x - w / 2)} ${r(y - 1.6)} Q${r(x)} ${r(y + 1.6)} ${r(x + w / 2)} ${r(y - 1.6)} Z" fill="#8a6a4a"/><ellipse cx="${r(x)}" cy="${r(y - 1.6)}" rx="${r(w / 2)}" ry="1" fill="#4a3220"/>`;
    for (let i = 0; i < 7; i++) g += `<circle cx="${r(x - w * 0.38 + i * w * 0.126)}" cy="${r(y - 2.4 - (i % 2) * 0.9)}" r="1" fill="${["#7b4ab0", "#f2d13a", "#e8e4f2"][i % 3]}"/>`;
  }
  S.teil({ id: "urnengrab", de: "das Urnengrab", syl: "UR-nen-grab", it: "la tomba per l'urna", itSyl: "TOM-ba per L'UR-na", en: "urn grave", x: X, y: Y, steht: true, kunst: G(X, Y, g),
    zoom: { x: PX(GR3.a, D_V) - 8, y: PY(0.6, D_H) - 4, w: 60, h: 40 }, unter,
    tipp: "Ein Urnengrab ist klein: Darin liegt nur die Urne mit der Asche." });
}

/* =====================================================================
   7 — DER GRABSTEIN (Granit, Kopfende Grab 1) und DAS GRABKREUZ, DER KRANZ
   ===================================================================== */
{
  const d = D_H - 0.15, s = sk(d), xw = (GR1.a + GR1.b) / 2, X = PX(xw, d), Y = PY(0.1, d);
  const W = 0.72 * s, H = 0.95 * s;
  let k = schatten(0, 0.3, W / 2 + 1, 1, 0.3);
  k += `<rect x="${r(-W / 2 - 1)}" y="-2.2" width="${r(W + 2)}" height="2.2" fill="#4a4d53"/>`;
  k += `<path d="M${r(-W / 2)} -2.2 L${r(-W / 2)} ${r(-H + 4)} Q${r(-W / 2)} ${r(-H)} ${r(-W / 2 + 6)} ${r(-H - 1)} Q0 ${r(-H - 3)} ${r(W / 2 - 6)} ${r(-H - 1)} Q${r(W / 2)} ${r(-H)} ${r(W / 2)} ${r(-H + 4)} L${r(W / 2)} -2.2 Z" fill="${GRANIT}"/>`;
  k += `<path d="M${r(-W / 2 + 1.4)} ${r(-H + 4)} Q${r(-W / 2 + 2)} ${r(-H + 1)} ${r(-W / 2 + 7)} ${r(-H)}" stroke="#9aa0a8" stroke-width=".7" fill="none" opacity=".7"/>`;
  const t = (y, sz, txt, f = "#e6d8a8") => `<text x="0" y="${r(y)}" font-size="${sz}" text-anchor="middle" fill="${f}" font-family="Georgia,'Times New Roman',serif">${txt}</text>`;
  k += t(-H * 0.68, 3.2, "Familie") + t(-H * 0.54, 3.6, "Weber");
  k += `<path d="M-4 ${r(-H * 0.48)} h8" stroke="#c9b06a" stroke-width=".3"/>`;
  k += t(-H * 0.38, 2.2, "Hans Weber", "#d8d2c4") + t(-H * 0.3, 1.9, "1938 – 2019", "#b9b3a6") + t(-H * 0.2, 2.2, "Maria Weber", "#d8d2c4") + t(-H * 0.12, 1.9, "1941 – 2023", "#b9b3a6");
  k += `<path d="M-1 ${r(-H * 0.88)} h2 M0 ${r(-H * 0.92)} v3" stroke="#c9b06a" stroke-width=".55"/>`;
  S.teil({ id: "fh_grabstein", de: "der Grabstein", syl: "GRAB-stein", it: "la lapide", itSyl: "LA-pi-de", en: "gravestone", x: X, y: Y, steht: true, kunst: k,
    tipp: "Darauf stehen der Name und zwei Jahreszahlen." });
}
{
  const d = D_H - 0.1, s = sk(d), X = PX((GR2.a + GR2.b) / 2, d), Y = PY(0.05, d), H = 1.15 * s;
  let k = schatten(0, 0.2, 4, .8, 0.3);
  k += `<rect x="-1.2" y="${r(-H)}" width="2.4" height="${r(H)}" fill="${HOLZ}"/><rect x="${r(-0.3 * s)}" y="${r(-H * 0.78)}" width="${r(0.6 * s)}" height="2.4" fill="${HOLZ}"/>`;
  k += `<rect x="-3.2" y="${r(-H * 0.6)}" width="6.4" height="3.6" rx=".4" fill="#e9e3d4"/><text x="0" y="${r(-H * 0.6 + 1.7)}" font-size="1.3" text-anchor="middle" fill="#3a2a1a" font-family="Georgia">Karl Brandt</text><text x="0" y="${r(-H * 0.6 + 3)}" font-size="1.1" text-anchor="middle" fill="#5a4a3a" font-family="Georgia">1944 – 2026</text>`;
  k += `<path d="M-1.2 ${r(-H)} L1.2 ${r(-H)} L0 ${r(-H - 1.4)} Z" fill="#6e4824"/>`;
  S.teil({ id: "fh_grabkreuz", de: "das Grabkreuz", syl: "GRAB-kreuz", it: "la croce", itSyl: "CRO-ce", en: "grave cross", x: X, y: Y, steht: true, kunst: k,
    tipp: "Ein Kreuz aus Stein oder Holz statt einer Platte." });
}
{
  /* Kranz aus Tannengrün mit weißen Blüten und Schleife, liegt flach auf dem Hügel */
  const d = (D_V + D_H) / 2 - 0.15, s = sk(d), X = PX((GR2.a + GR2.b) / 2 - 0.05, d), Y = PY(0.4, d), R = 0.3 * s, q = 0.26;
  let k = `<ellipse cx="0" cy="0" rx="${r(R)}" ry="${r(R * q)}" fill="none" stroke="#2f5a2a" stroke-width="${r(R * 0.3)}"/>`;
  k += `<ellipse cx="0" cy="${r(-R * 0.03)}" rx="${r(R)}" ry="${r(R * q)}" fill="none" stroke="#4f8a3e" stroke-width="${r(R * 0.12)}" stroke-dasharray="1 1.2"/>`;
  for (const a of [-2.6, -2.0, -1.3, -0.5, 0.3, 2.4]) k += `<ellipse cx="${r(Math.cos(a) * R)}" cy="${r(Math.sin(a) * R * q - 0.6)}" rx="${r(R * 0.11)}" ry="${r(R * 0.08)}" fill="#f4f1ea" stroke="#d8d2c4" stroke-width=".2"/>`;
  k += `<path d="M${r(R * 0.55)} ${r(R * q * 0.6)} L${r(R * 0.95)} ${r(R * q + 3.4)} L${r(R * 0.7)} ${r(R * q + 3)} Z M${r(R * 0.45)} ${r(R * q * 0.7)} L${r(R * 0.42)} ${r(R * q + 3.8)} L${r(R * 0.2)} ${r(R * q + 3.2)} Z" fill="#f4f1ea" stroke="#cfc8b6" stroke-width=".2"/>`;
  S.teil({ oben: true, id: "fh_kranz", de: "der Kranz", syl: "KRANZ", it: "la corona", itSyl: "co-RO-na", en: "wreath", x: X, y: Y, kunst: k + flaeche(-R - 1, -R * q - 2, 2 * R + 2, 2 * R * q + 6),
    tipp: "Ein Kranz aus Tannengrün mit Schleife." });
}
{
  /* Grablicht: rote Kerze im Glas vorne rechts auf Grab 1 */
  const d = D_V + 0.3, s = sk(d), X = PX(GR1.b - 0.2, d), Y = PY(0.11, d), w = 0.08 * s, h = 0.14 * s;
  let k = `<path d="M${r(-w / 2)} 0 L${r(w / 2)} 0 L${r(w / 2 + 0.3)} ${r(-h)} L${r(-w / 2 - 0.3)} ${r(-h)} Z" fill="${S.lg("grablicht", [[0, "#e23a3a"], [0.5, "#b3161c"], [1, "#7a0c10"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${r(-w / 2 - 0.4)}" y="${r(-h - 1)}" width="${r(w + 0.8)}" height="1.1" rx=".3" fill="#c9a13f"/>`;
  k += `<ellipse cx="0" cy="${r(-h * 0.55)}" rx="${r(w * 0.3)}" ry="${r(h * 0.25)}" fill="#ffcf6b" opacity=".85"/><path d="M${r(-w / 2 + 0.6)} -.6 L${r(-w / 2 + 0.9)} ${r(-h + 0.6)}" stroke="#fff" stroke-width=".5" opacity=".5"/>`;
  S.teil({ oben: true, id: "fh_grablicht", de: "das Grablicht", syl: "GRAB-licht", it: "il lumino", itSyl: "lu-MI-no", en: "grave light", x: X, y: Y, kunst: k + flaeche(-4, -h - 2, 8, h + 2.5),
    tipp: "Eine kleine rote Kerze im Glas. Sie brennt mehrere Tage." });
}

/* =====================================================================
   8 — DIE BANK mit dem MANN (rechts, vor der Hecke)
   ===================================================================== */
const BK = { d: 6.3, xw: 3.35 };
const bs = sk(BK.d);
const mann = B.mensch({ id: "b13c_mann", geschlecht: "m", pose: "sitzen_zurueck", blick: -22, frisur: "kurz", haarfarbe: "weiss", haut: "hell", alter: "alt",
  kleidung: { oberteil: { stueck: "hemd", farbe: "hellblau" }, jacke: { stueck: "jacke", farbe: "beige" }, unterteil: { stueck: "anzughose", farbe: "grau" }, schuhe: { stueck: "halbschuh", farbe: "braun" }, kopf: { stueck: "hut", farbe: "grau" } } }, 1.74 * bs);
const SITZ = -mann.z.sitz.y * mann.k;
{
  const X = PX(BK.xw, BK.d), Y = PY(0, BK.d), W = 1.6 * bs, LH = 0.42 * bs;
  let k = schatten(0, 0.5, W / 2 + 2, 1.6, 0.3);
  /* gusseiserne Seitenteile (dunkelgrün) */
  for (const sx of [-1, 1]) {
    const x = sx * (W / 2 - 2);
    k += `<path d="M${r(x - 2.4)} 0 Q${r(x - 1)} ${r(-SITZ * 0.5)} ${r(x)} ${r(-SITZ)} L${r(x)} ${r(-SITZ - LH)} M${r(x + 2.4)} 0 Q${r(x + 1)} ${r(-SITZ * 0.5)} ${r(x)} ${r(-SITZ)}" stroke="#2c4a34" stroke-width="1.3" fill="none"/>`;
    k += `<path d="M${r(x - 3)} ${r(-SITZ - 1)} Q${r(x)} ${r(-SITZ - 4)} ${r(x + 3)} ${r(-SITZ - 1)}" stroke="#2c4a34" stroke-width="1" fill="none"/>`;
  }
  /* Lehne: drei Latten, Sitz: Latten von oben */
  for (let i = 0; i < 3; i++) k += `<rect x="${r(-W / 2)}" y="${r(-SITZ - LH + i * LH / 3)}" width="${r(W)}" height="${r(LH / 3 - 1)}" rx=".5" fill="${S.lg("latte", [[0, "#b98a52"], [1, "#8a5f30"]])}"/>`;
  for (let i = 0; i < 3; i++) k += `<rect x="${r(-W / 2)}" y="${r(-SITZ + i * 1.3 - 0.4)}" width="${r(W)}" height="1.1" rx=".4" fill="${i === 2 ? "#8a5f30" : "#a87a44"}"/>`;
  k += `<rect x="${r(-W / 2 + 4)}" y="${r(-SITZ - LH + 1.2)}" width="7" height="1.6" rx=".2" fill="#c9a13f" opacity=".8"/>`;
  S.teil({ id: "fh_bank", de: "die Bank", syl: "BANK", it: "la panchina", itSyl: "pan-CHI-na", en: "bench", x: X, y: Y, steht: true, kunst: k,
    tipp: "Auf dem Friedhof stehen überall Bänke — man darf sich hinsetzen und bleiben." });
}
{
  const X = PX(BK.xw + 0.35, BK.d - 0.15), Y = PY(0, BK.d - 0.15);
  S.teil({ id: "fh_mann", de: "der Mann auf der Bank", syl: "MANN auf der BANK", it: "l'uomo sulla panchina", itSyl: "UO-mo SUL-la pan-CHI-na", en: "man on the bench", x: X, y: Y, kunst: mann.svg,
    tipp: "Er hat den Arm auf die Lehne gelegt und sitzt einfach da." });
}

/* =====================================================================
   9 — DIE WASSERSTELLE: WASSERHAHN, GIESSKANNEN, HARKE (links am Weg)
   ===================================================================== */
const WS = { d: 4.8, xw: -3.05 };
{
  const s = sk(WS.d), X = PX(WS.xw, WS.d), Y = PY(0, WS.d), H = 1.0 * s;
  let k = schatten(0, 0.5, 0.45 * s, 1.6, 0.3);
  /* Schöpfbecken aus Naturstein */
  k += `<path d="M${r(-0.35 * s)} 0 L${r(0.35 * s)} 0 L${r(0.38 * s)} ${r(-0.45 * s)} L${r(-0.38 * s)} ${r(-0.45 * s)} Z" fill="${S.lg("becken", [[0, "#b9b1a2"], [1, "#8d8576"]], 0, 0, 1, 0)}"/>`;
  k += `<ellipse cx="0" cy="${r(-0.45 * s)}" rx="${r(0.38 * s)}" ry="${r(0.06 * s)}" fill="#c9c2b4"/><ellipse cx="0" cy="${r(-0.45 * s + 0.3)}" rx="${r(0.32 * s)}" ry="${r(0.045 * s)}" fill="#6f8ea0"/>`;
  /* Ständer mit Wasserhahn */
  k += `<rect x="${r(0.2 * s)}" y="${r(-H)}" width="${r(0.09 * s)}" height="${r(H - 0.45 * s)}" fill="${S.lg("pfosten", [[0, "#6a6f74"], [0.5, "#9aa1a6"], [1, "#55595d"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${r(0.22 * s)} ${r(-H + 0.12 * s)} L${r(0.02 * s)} ${r(-H + 0.12 * s)} L${r(0.02 * s)} ${r(-H + 0.2 * s)}" stroke="#b07a2a" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
  k += `<rect x="${r(0.12 * s)}" y="${r(-H + 0.06 * s)}" width="2.2" height="1" rx=".4" fill="#c0272d"/>`;
  k += `<path d="M${r(0.02 * s)} ${r(-H + 0.22 * s)} L${r(0.02 * s)} ${r(-0.47 * s)}" stroke="#bfe0f0" stroke-width=".6" opacity=".6" stroke-dasharray="1.2 .8"/>`;
  S.teil({ id: "fh_wasserhahn", de: "der Wasserhahn", syl: "WAS-ser-hahn", it: "il rubinetto", itSyl: "ru-bi-NET-to", en: "water tap", x: X, y: Y, steht: true, kunst: k,
    tipp: "Hier holt man das Wasser für die Gießkanne." });
}
const RACK = { d: 5.0, xw: -2.4 };
{
  /* Gießkannenständer: Metallrohr mit Haken, drei grüne Kannen */
  const s = sk(RACK.d), X = PX(RACK.xw, RACK.d), Y = PY(0, RACK.d), H = 1.15 * s, W = 0.75 * s;
  /* der Ständer gehört zu den Kannen (Gießkannenständer) */
  let k = schatten(0, 0.4, W / 2 + 1, 1.2, 0.25) + `<rect x="${r(-W / 2)}" y="${r(-H)}" width="${r(W)}" height="1.4" rx=".6" fill="#55595d"/><rect x="${r(-W / 2)}" y="${r(-H)}" width="1.4" height="${r(H)}" fill="#55595d"/><rect x="${r(W / 2 - 1.4)}" y="${r(-H)}" width="1.4" height="${r(H)}" fill="#55595d"/>` + [-W * 0.3, W * 0.2].map((x) => `<path d="M${r(x)} ${r(-H + 1.2)} l0 2 q0 1 -1 1" stroke="#55595d" stroke-width=".5" fill="none"/>`).join("");
  const kanne = (x, y, f) => `<path d="M${r(x - 2.6)} ${r(y)} L${r(x + 2.6)} ${r(y)} L${r(x + 2.2)} ${r(y + 6.6)} L${r(x - 2.2)} ${r(y + 6.6)} Z" fill="${f}"/><path d="M${r(x - 2)} ${r(y)} Q${r(x)} ${r(y - 3.2)} ${r(x + 2)} ${r(y)}" stroke="${f}" stroke-width=".8" fill="none"/><path d="M${r(x + 2.4)} ${r(y + 4.6)} L${r(x + 6.2)} ${r(y + 1)}" stroke="${f}" stroke-width="1"/><ellipse cx="${r(x + 6.4)}" cy="${r(y + 0.8)}" rx=".9" ry=".6" fill="#2c6b35"/><path d="M${r(x - 1.8)} ${r(y + 1)} L${r(x - 1.6)} ${r(y + 5.8)}" stroke="#fff" stroke-width=".5" opacity=".35"/>`;
  k += kanne(-W * 0.3, -H * 0.82, KANNE) + kanne(W * 0.2, -H * 0.82, KANNE);
  S.teil({ id: "fh_giesskanne", de: "die Gießkanne", syl: "GIESS-kan-ne", it: "l'annaffiatoio", itSyl: "an-naf-fia-TO-io", en: "watering can", x: X, y: Y, kunst: k,
    tipp: "Am Wasserhahn steht eine für alle. Man stellt sie zurück." });
  /* Harke am Ständer */
  let hk = `<line x1="${r(W * 0.46)}" y1="${r(-H * 0.95)}" x2="${r(W * 0.36)}" y2="-1" stroke="#b98a52" stroke-width=".9"/><rect x="${r(W * 0.46 - 3.4)}" y="${r(-H * 0.98)}" width="6.8" height="1.2" fill="#55595d"/>`;
  for (let i = 0; i < 7; i++) hk += `<line x1="${r(W * 0.46 - 3.1 + i)}" y1="${r(-H * 0.98 + 1.2)}" x2="${r(W * 0.46 - 3.1 + i)}" y2="${r(-H * 0.98 + 2.6)}" stroke="#55595d" stroke-width=".4"/>`;
  S.teil({ oben: true, id: "harke", de: "die Harke", syl: "HAR-ke", it: "il rastrello", itSyl: "ra-STREL-lo", en: "rake", x: X, y: Y, kunst: hk + flaeche(W * 0.46 - 4, -H, 8, H),
    tipp: "Mit der Harke zieht man den Kies und das Beet wieder glatt." });
}

/* =====================================================================
   10 — DIE FRAU AM GRAB (kniet links neben Grab 1, pflegt die Pflanzen)
   ===================================================================== */
{
  const d = D_V + 0.3, s = sk(d), X = PX(-0.5, d), Y = PY(0, d);
  const m = B.mensch({ id: "b13c_frau", geschlecht: "w", pose: "knien", blick: -64, frisur: "dutt", haarfarbe: "braun", haut: "hell",
    kleidung: { oberteil: { stueck: "pullover", farbe: "gruen_d" }, unterteil: { stueck: "hose", farbe: "beige" }, jacke: { stueck: "weste", farbe: "grau" }, schuhe: { stueck: "stiefel", farbe: "braun" } } }, 1.66 * s);
  S.teil({ id: "fh_frau", de: "die Frau am Grab", syl: "FRAU am GRAB", it: "la donna alla tomba", itSyl: "DON-na AL-la TOM-ba", en: "woman at the grave", x: X, y: Y, kunst: m.svg,
    tipp: "Sie gießt die Blumen und nimmt das welke Laub weg." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/friedhof.js"));
console.log(aus);
