#!/usr/bin/env node
/* =====================================================================
   SPORT & HOBBYS (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   Die alte Szene zeigte lauter Sport- und Hobbydinge nebeneinander (Ski,
   Schlitten, Surfbrett, Angel, Gitarre, Klavier, Pinsel, Schachbrett …).
   Ein echter Ort, an dem all das zusammenkommt: der TAG DER VEREINE in
   der Sporthalle.
   RECHERCHE (Berichte „Sporthalle wird Schaufenster“, Schwäbische Zeitung;
   „Tag der Vereine“; Ausstattung von Schulsporthallen):
   - Gemeinden und Schulen laden einmal im Jahr zum „Markt“ oder „Tag der
     Vereine“ in die Sporthalle: Sport-, Musik- und Kulturvereine bauen
     Stände auf, man darf ausprobieren (Klettern, Schach, Musik …).
   - Die Halle: Sportboden mit farbigen Linien (Basketball-Zone,
     Handball-Torraum 6 m), Prallschutzwand aus Holzlatten bis 2 m, darüber
     Oberlichter; an der Stirnwand der BASKETBALLKORB (Ring 3,05 m), davor
     ein HANDBALLTOR 3 × 2 m; KLETTERWAND mit Weichbodenmatte; BALLWAGEN.
   - Vereine nehmen gern Turngeräte als Stand: Sprungkasten, Bänke.
   Stände hier: Alpenverein (Kletterwand, Rucksack, Helm, Ski, Schlitten),
   Musik- und Kunstschule (Klavier, Gitarre, Staffelei mit Pinseln),
   Schwimm- und Angelverein (Kasten, Surfbrett, Angel, Schwimmbrille),
   TSV (Infostand mit Pokal, Medaille, Stoppuhr, Turnschuhen, Hantel,
   Tennisschläger; Fußball), Schachclub (Tisch mit Schachbrett).
   Maßstab (Zentralperspektive, Blick von der Tribüne): Augenhöhe 3 m,
   Fluchtpunkt (160 | 50), Einheiten je Meter = 348 / Abstand:
   Stirnwand (19 m) ≈ 18, Infostand (8,6 m) ≈ 40.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "sport", titel: "Sport & Hobbys", emoji: "⚽", thema: "Freizeit", kuerzel: "b14c", fassung: 852 });
const rnd = zufall(1890);
const r = B.r;
const knapp = (svg) => svg.replace(/ (d|x1|y1|x2|y2|cx|cy|rx|ry)="([^"]*)"/g, (m, a, v) => ` ${a}="${v.replace(/-?\d+\.\d+/g, (n) => String(Math.round(+n)))}"`);
const mensch = (spec, h) => { const m = B.mensch(spec, h); m.svg = knapp(m.svg); return m; };

/* ---------- Perspektive ---------------------------------------------- */
const VX = 160, YH = 50, H = 3.0, F = 348;
const s = (d) => F / d;
const X = (xm, d) => VX + xm * F / d;
const Y = (d, h = 0) => YH + (H - h) * F / d;
const P = (xm, d, h = 0) => [X(xm, d), Y(d, h)];
const pt = (xm, d, h = 0) => `${r(X(xm, d))} ${r(Y(d, h))}`;
const D_W = 19, W_L = -8, W_R = 8;
const poly = (pp) => "M" + pp.map(([a, b]) => `${r(a)} ${r(b)}`).join(" L") + " Z";
function quader(x0, x1, d0, d1, h0, h1, f) {
  let o = "";
  if (x0 > 0 && f.seite) o += `<path d="${poly([P(x0, d0, h0), P(x0, d1, h0), P(x0, d1, h1), P(x0, d0, h1)])}" fill="${f.seite}"/>`;
  if (x1 < 0 && f.seite) o += `<path d="${poly([P(x1, d0, h0), P(x1, d1, h0), P(x1, d1, h1), P(x1, d0, h1)])}" fill="${f.seite}"/>`;
  if (h1 < H && f.deckel) o += `<path d="${poly([P(x0, d0, h1), P(x1, d0, h1), P(x1, d1, h1), P(x0, d1, h1)])}" fill="${f.deckel}"/>`;
  if (f.front) o += `<path d="${poly([P(x0, d0, h0), P(x1, d0, h0), P(x1, d0, h1), P(x0, d0, h1)])}" fill="${f.front}"/>`;
  return o;
}
const abs = (ax, ay, k) => `<g transform="translate(${r(-ax)} ${r(-ay)})">${k}</g>`;
const wand = (xm0, xm1, h0, h1, d = D_W - 0.02) => poly([P(xm0, d, h1), P(xm1, d, h1), P(xm1, d, h0), P(xm0, d, h0)]);

/* ---------- Farben ---------------------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const STAHL = S.lg("stahl", [[0, "#eef1f3"], [0.45, "#c3cad0"], [0.55, "#a7b0b7"], [1, "#dfe4e7"]], 0, 0, 1, 0);
const HOLZ = S.lg("holz", [[0, "#d9b27a"], [1, "#c09358"]]);
const LEDER = S.lg("leder", [[0, "#a8683a"], [1, "#7e4a26"]]);
S.def(`<pattern id="${S.id("latten")}" width="2.2" height="10" patternUnits="userSpaceOnUse"><rect width="2.2" height="10" fill="#d8b47e"/><rect width=".35" height="10" fill="#9c7444"/><rect x=".9" width=".5" height="10" fill="#e5c48f" opacity=".6"/></pattern>`);

/* =====================================================================
   KULISSE — Stirnwand mit Prallwand und Oberlichtern, Sportboden, Linien
   ===================================================================== */
{
  const dL0 = -W_L * F / VX, dR0 = W_R * F / (320 - VX);
  let k = `<rect x="0" y="0" width="320" height="${r(Y(D_W) + 1)}" fill="${S.lg("oben", [[0, "#dfe4e6"], [1, "#cdd4d7"]])}"/>`;
  /* Oberlichter */
  k += `<path d="${wand(W_L, W_R, 5.0, 6.4)}" fill="${S.lg("licht", [[0, "#a9d2ee"], [1, "#e6f2f8"]])}"/>`;
  let sp = "";
  for (let xm = W_L; xm <= W_R; xm += 1.0) sp += `M${pt(xm, D_W, 5.0)} L${pt(xm, D_W, 6.4)}`;
  k += `<path d="${sp}" stroke="#7d8990" stroke-width=".7"/><path d="M${pt(W_L, D_W, 5.0)} L${pt(W_R, D_W, 5.0)}" stroke="#7d8990" stroke-width="1"/>`;
  /* Hallenbinder (Leimholz) oben */
  k += `<rect x="0" y="0" width="320" height="2.5" fill="#b78e5a"/>`;
  /* Prallwand aus Holzlatten bis 2 m, Sockel */
  k += `<path d="${wand(W_L, W_R, 0, 2.0)}" fill="url(#${S.id("latten")})"/>`;
  k += `<path d="${wand(W_L, W_R, 1.95, 2.05)}" fill="#8a6237"/><path d="${wand(W_L, W_R, 0, 0.15)}" fill="#6b4a2a"/>`;
  /* Seitenwände (schmal sichtbar) */
  k += `<path d="M${pt(W_L, D_W, 7)} L${pt(W_L, D_W)} L0 ${r(Y(dL0))} L0 ${r(Y(dL0, 7))} Z" fill="#c4cbce"/>`;
  k += `<path d="M${pt(W_R, D_W, 7)} L${pt(W_R, D_W)} L320 ${r(Y(dR0))} L320 ${r(Y(dR0, 7))} Z" fill="#c4cbce"/>`;
  k += `<path d="M${pt(W_L, D_W, 2)} L${pt(W_L, D_W)} L0 ${r(Y(dL0))} L0 ${r(Y(dL0, 2))} Z" fill="#c69e68"/>`;
  k += `<path d="M${pt(W_R, D_W, 2)} L${pt(W_R, D_W)} L320 ${r(Y(dR0))} L320 ${r(Y(dR0, 2))} Z" fill="#c69e68"/>`;
  /* Musik- und Kunstschule: Schild an der Prallwand */
  k += `<path d="${wand(4.1, 7.6, 2.25, 2.75)}" fill="#ffffff"/><text x="${r(X(5.85, D_W))}" y="${r(Y(D_W, 2.42))}" font-size="2.8" text-anchor="middle" fill="#8a2a5a" font-family="Georgia,serif" font-weight="bold">Musik- und Kunstschule</text>`;
  /* Sportboden: Eiche hell, Fluchtlinien der Dielen */
  k += `<path d="M0 ${r(Y(dL0))} L${pt(W_L, D_W)} L${pt(W_R, D_W)} L320 ${r(Y(dR0))} L320 200 L0 200 Z" fill="${S.lg("boden", [[0, "#d9b886"], [1, "#e4c697"]])}"/>`;
  let lin = "";
  for (let xm = -12; xm <= 12; xm += 0.5) lin += `M${pt(xm, D_W)} L${pt(xm, 6.5)}`;
  k += `<path d="${lin}" stroke="#b8925c" stroke-width=".25" opacity=".5"/>`;
  /* Handball-Torraum (6 m, blau) vor dem Tor */
  let tr = "";
  for (let a = 0; a <= 90; a += 6) { const t = a * Math.PI / 180; tr += (a ? " L" : "M") + pt(-1.5 - 6 * Math.cos(t), D_W - 6 * Math.sin(t)); }
  for (let a = 90; a >= 0; a -= 6) { const t = a * Math.PI / 180; tr += " L" + pt(1.5 + 6 * Math.cos(t), D_W - 6 * Math.sin(t)); }
  k += `<path d="${tr}" stroke="#2f6fd0" stroke-width=".9" fill="none"/>`;
  /* Basketball-Zone (orange) und Freiwurfkreis */
  k += `<path d="M${pt(-2.45, D_W)} L${pt(-2.45, D_W - 5.8)} L${pt(2.45, D_W - 5.8)} L${pt(2.45, D_W)}" stroke="#e07b22" stroke-width=".8" fill="none"/>`;
  let fk = "";
  for (let a = 0; a <= 180; a += 10) { const t = a * Math.PI / 180; fk += (a ? " L" : "M") + pt(1.8 * Math.cos(t), D_W - 5.8 - 1.8 * Math.sin(t)); }
  k += `<path d="${fk}" stroke="#e07b22" stroke-width=".8" fill="none"/>`;
  /* Seitenlinie Volleyball (grün) und Mittellinie (schwarz) */
  k += `<path d="M${pt(-6.5, D_W)} L${pt(-6.5, 6.5)} M${pt(6.5, D_W)} L${pt(6.5, 6.5)}" stroke="#3c9a4a" stroke-width=".7"/>`;
  k += `<path d="M0 ${r(Y(10.5))} H320" stroke="#2b2b2b" stroke-width=".7" opacity=".7"/>`;
  k += `<path d="M0 ${r(Y(dL0))} L${pt(W_L, D_W)} L${pt(W_R, D_W)} L320 ${r(Y(dR0))} L320 200 L0 200 Z" fill="${S.lg("glanz", [[0, "#fff", 0.25], [0.5, "#fff", 0.05], [1, "#7a5a30", 0.12]])}"/>`;
  /* Transparent „Tag der Vereine“ an der Stirnwand */
  k += `<path d="${wand(-4.6, 4.6, 4.15, 4.85)}" fill="${S.lg("banner", [[0, "#1f5fae"], [1, "#174a8a"]])}"/>`;
  k += `<text x="${VX}" y="${r(Y(D_W, 4.36))}" font-size="8" text-anchor="middle" fill="#ffffff" font-family="Arial Black,Arial" font-weight="900" letter-spacing=".4">TAG DER VEREINE</text>`;
  k += `<text x="${r(X(4.1, D_W))}" y="${r(Y(D_W, 4.4))}" font-size="3" text-anchor="middle" fill="#ffd23f" font-family="Arial" font-weight="bold">Mach mit!</text>`;
  for (const xm of [-4.6, 4.6]) k += `<path d="M${pt(xm, D_W, 4.85)} L${pt(xm * 1.08, D_W, 5.0)}" stroke="#555" stroke-width=".3"/>`;
  S.hinten(k);
}

/* =====================================================================
   1 — DIE KLETTERWAND (Alpenverein) mit Griffen und Toprope-Seilen
   ===================================================================== */
{
  const x0 = -7.6, x1 = -4.1, d = D_W - 0.05;
  let k = `<path d="${wand(x0, x1, 0, 5.5, d)}" fill="${S.lg("kw", [[0, "#cfc4b2"], [1, "#b9ad99"]], 0, 0, 1, 0)}"/>`;
  /* Paneele */
  let pn = "";
  for (let xm = x0; xm <= x1 + 0.01; xm += (x1 - x0) / 3) pn += `M${pt(xm, d, 0)} L${pt(xm, d, 5.5)}`;
  for (let h = 1.1; h < 5.5; h += 1.1) pn += `M${pt(x0, d, h)} L${pt(x1, d, h)}`;
  k += `<path d="${pn}" stroke="#a2967f" stroke-width=".35"/>`;
  /* Griffe in vier Routen (Farbe = Schwierigkeit) */
  const routen = [["#e8453c", -7.25], ["#2f86d0", -6.4], ["#f2c230", -5.5], ["#38c172", -4.6]];
  routen.forEach(([f, xr]) => {
    for (let h = 0.4; h < 5.3; h += 0.42 + rnd() * 0.25) {
      const [x, y] = P(xr + (rnd() - 0.5) * 0.6, d, h), g = 0.7 + rnd() * 0.9;
      k += `<path d="M${r(x - g)} ${r(y)} Q${r(x - g)} ${r(y - g * 1.1)} ${r(x)} ${r(y - g)} Q${r(x + g * 1.2)} ${r(y - g * 0.6)} ${r(x + g * 0.8)} ${r(y + g * 0.3)} Z" fill="${f}" stroke="#000" stroke-opacity=".2" stroke-width=".15"/>`;
    }
  });
  /* Umlenkungen oben und zwei Seile */
  for (const xm of [-6.8, -4.9]) {
    const [xa, ya] = P(xm, d, 5.35), [xb, yb] = P(xm + 0.15, d - 1.2, 0.4);
    k += `<circle cx="${r(xa)}" cy="${r(ya)}" r=".8" fill="#9aa3aa"/><path d="M${r(xa - 0.4)} ${r(ya)} L${r(xb - 0.8)} ${r(yb)} M${r(xa + 0.4)} ${r(ya)} L${r(xb + 0.8)} ${r(yb)}" stroke="${xm < -6 ? "#2f6fd0" : "#d23a33"}" stroke-width=".45"/>`;
  }
  /* Schild Alpenverein */
  k += `<path d="${wand(-7.4, -4.3, 3.3, 3.9, d - 0.01)}" fill="#ffffff"/><text x="${r(X(-5.85, d))}" y="${r(Y(d, 3.65))}" font-size="2.6" text-anchor="middle" fill="#1f6a3a" font-family="Arial" font-weight="bold">Alpenverein Talstadt</text><text x="${r(X(-5.85, d))}" y="${r(Y(d, 3.42))}" font-size="1.7" text-anchor="middle" fill="#333" font-family="Arial">Klettern ab 6 Jahren</text>`;
  const [ax, ay] = P((x0 + x1) / 2, d);
  S.teil({ id: "kletterwand", de: "die Kletterwand", syl: "KLET-ter-wand", it: "la parete d'arrampicata", itSyl: "pa-RE-te d'ar-ram-PI-ca-ta", en: "climbing wall", x: ax, y: ay, kunst: abs(ax, ay, k),
    tipp: "An der Kletterwand ist man immer mit einem Seil gesichert." });
}

/* =====================================================================
   2 — DIE WEICHBODENMATTE vor der Kletterwand
   ===================================================================== */
const MATTE = { x0: -7.5, x1: -4.2, d0: 17.0, d1: 18.9, h: 0.42 };
{
  const { x0, x1, d0, d1, h } = MATTE;
  let k = quader(x0, x1, d0, d1, 0, h, { deckel: S.lg("mdeck", [[0, "#3c84d8"], [1, "#2f6fc0"]]), front: S.lg("mfront", [[0, "#2a62aa"], [1, "#1f4d88"]]), seite: "#1f4d88" });
  k += `<path d="M${pt(x0 + 0.1, d0, h * 0.5)} L${pt(x1 - 0.1, d0, h * 0.5)}" stroke="#7fb0ea" stroke-width=".3" stroke-dasharray="1 .8"/>`;
  for (const xm of [x0 + 0.3, x1 - 0.3]) k += `<path d="M${pt(xm, d0, h * 0.75)} q1 1.2 2 0" stroke="#d9e6f5" stroke-width=".5" fill="none"/>`;
  const [ax, ay] = P((x0 + x1) / 2, d0);
  S.teil({ id: "weichbodenmatte", de: "die Weichbodenmatte", syl: "WEICH-bo-den-mat-te", it: "il materassone", itSyl: "ma-te-ras-SO-ne", en: "crash mat", x: ax, y: ay, steht: true, kunst: abs(ax, ay, k),
    tipp: "Die dicke Weichbodenmatte fängt einen weich auf." });
}
{
  /* DER RUCKSACK — liegt auf der Matte */
  const d = 17.7, sc = s(d), [x, y] = P(-6.75, d, MATTE.h);
  const w = 0.36 * sc, hh = 0.55 * sc;
  let k = schatten(0, 0, w / 2 + 1, 0.7, 0.3);
  k += `<path d="M${r(-w / 2)} 0 L${r(-w / 2)} ${r(-hh * 0.75)} Q${r(-w / 2)} ${r(-hh)} 0 ${r(-hh)} Q${r(w / 2)} ${r(-hh)} ${r(w / 2)} ${r(-hh * 0.75)} L${r(w / 2)} 0 Z" fill="${S.lg("ruck", [[0, "#e2662f"], [1, "#b24618"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${r(-w / 2)} ${r(-hh * 0.72)} Q0 ${r(-hh * 0.6)} ${r(w / 2)} ${r(-hh * 0.72)} L${r(w / 2)} ${r(-hh * 0.82)} Q0 ${r(-hh * 1.02)} ${r(-w / 2)} ${r(-hh * 0.82)} Z" fill="#8f3612"/>`;
  k += `<rect x="${r(-w * 0.32)}" y="${r(-hh * 0.42)}" width="${r(w * 0.64)}" height="${r(hh * 0.3)}" rx=".5" fill="#c9521f" stroke="#7d2f0e" stroke-width=".2"/>`;
  k += `<path d="M${r(-w * 0.2)} ${r(-hh)} q${r(w * 0.2)} -1.2 ${r(w * 0.4)} 0" stroke="#2b2b2b" stroke-width=".4" fill="none"/>`;
  S.teil({ oben: true, id: "rucksack", de: "der Rucksack", syl: "RUCK-sack", it: "lo zaino", itSyl: "ZAI-no", en: "rucksack", x, y, kunst: k });
}
{
  /* DER HELM — Kletterhelm auf der Matte */
  const d = 17.4, sc = s(d), [x, y] = P(-5.0, d, MATTE.h), R = 0.15 * sc;
  let k = schatten(0, 0, R + 0.8, 0.6, 0.3);
  k += `<path d="M${r(-R)} 0 Q${r(-R)} ${r(-R * 1.5)} 0 ${r(-R * 1.5)} Q${r(R)} ${r(-R * 1.5)} ${r(R)} 0 Z" fill="${S.rg("helm", [[0, "#fff27a"], [0.6, "#f2c230"], [1, "#b88a10"]], 0.4, 0.3, 0.8)}"/>`;
  k += `<path d="M${r(-R * 0.4)} ${r(-R * 1.3)} L${r(R * 0.4)} ${r(-R * 1.3)}" stroke="#7a5a08" stroke-width=".3"/><path d="M${r(-R)} 0 Q0 ${r(R * 0.25)} ${r(R)} 0" stroke="#2b2b2b" stroke-width=".4" fill="none"/>`;
  S.teil({ oben: true, id: "helm", de: "der Helm", syl: "HELM", it: "il casco", itSyl: "CA-sco", en: "helmet", x, y, kunst: k,
    tipp: "Beim Klettern und Skifahren schützt der Helm den Kopf." });
}

/* =====================================================================
   3 — DER SKI (ein Paar, an die Wand gelehnt) und DER SCHLITTEN
   ===================================================================== */
{
  const d = D_W - 0.25, sc = s(d), [x, y] = P(-3.7, d);
  const L = 1.72 * sc;
  let k = schatten(1.5, 0, 4, 0.7, 0.3);
  for (const [dx, f] of [[0, "#d23a33"], [2.4, "#2f6fd0"]]) {
    k += `<g transform="rotate(5 ${dx} 0)"><path d="M${dx - 0.9} 0 L${dx - 0.9} ${r(-L + 1.5)} Q${dx} ${r(-L - 0.8)} ${dx + 0.9} ${r(-L + 1.5)} L${dx + 0.9} 0 Z" fill="${f}"/><path d="M${dx - 0.3} -1 L${dx - 0.3} ${r(-L + 2)}" stroke="#fff" stroke-width=".35" opacity=".7"/><rect x="${dx - 1.1}" y="${r(-L * 0.45)}" width="2.2" height="2" rx=".4" fill="#2b2b2b"/><rect x="${dx - 1}" y="${r(-L * 0.35)}" width="2" height="1" fill="#9aa3aa"/></g>`;
  }
  /* Skistöcke */
  k += `<path d="M4.2 0 L5.4 ${r(-1.2 * sc)} M5 0 L6.4 ${r(-1.18 * sc)}" stroke="#4a4f55" stroke-width=".45"/><circle cx="4.4" cy="-1.2" r=".8" fill="none" stroke="#2b2b2b" stroke-width=".3"/>`;
  S.teil({ id: "ski", de: "der Ski", syl: "SKI", it: "lo sci", itSyl: "SCI", en: "ski", x, y, steht: true, kunst: k });
}
{
  const d = 17.2, sc = s(d), [x0, y] = P(-3.55, d), L = 1.0 * sc, hh = 0.32 * sc;
  let k = schatten(L / 2, 0, L / 2 + 1, 0.8, 0.3);
  /* zwei Kufen aus Holz, vorn hochgebogen, Sitz aus Latten */
  for (const [dy, op] of [[-0.6, 0.75], [0, 1]]) {
    k += `<path d="M0 ${dy} L${r(L * 0.82)} ${dy} Q${r(L)} ${dy} ${r(L)} ${r(dy - hh * 0.7)} Q${r(L)} ${r(dy - hh)} ${r(L * 0.92)} ${r(dy - hh * 0.95)}" stroke="#7e4a26" stroke-width="1" fill="none" opacity="${op}"/>`;
    for (const t of [0.15, 0.5, 0.78]) k += `<path d="M${r(L * t)} ${dy} L${r(L * t + 0.5)} ${r(dy - hh * 0.75)}" stroke="#9a6234" stroke-width=".8" opacity="${op}"/>`;
  }
  k += `<path d="M${r(L * 0.08)} ${r(-hh * 0.8)} L${r(L * 0.86)} ${r(-hh * 0.8)} L${r(L * 0.86)} ${r(-hh * 0.95)} L${r(L * 0.08)} ${r(-hh * 0.95)} Z" fill="${HOLZ}"/>`;
  for (let t = 0.12; t < 0.86; t += 0.12) k += `<line x1="${r(L * t)}" y1="${r(-hh * 0.95)}" x2="${r(L * t)}" y2="${r(-hh * 0.8)}" stroke="#8a5a2e" stroke-width=".25"/>`;
  k += `<path d="M${r(L * 0.92)} ${r(-hh * 0.95)} q2 -1.6 3.2 .6" stroke="#c9a227" stroke-width=".35" fill="none"/>`;
  S.teil({ id: "schlitten", de: "der Schlitten", syl: "SCHLIT-ten", it: "la slitta", itSyl: "SLIT-ta", en: "sledge", x: x0, y, steht: true, kunst: k,
    tipp: "Im Winter fährt der Alpenverein zum Rodeln in die Berge." });
}

/* =====================================================================
   4 — DAS TOR (Handballtor 3 × 2 m) und DER BASKETBALLKORB darüber
   ===================================================================== */
{
  const d = 18.35, dn = D_W - 0.05;
  let k = schatten(X(0, d), Y(d), 1.6 * s(d), 1.2, 0.25);
  /* Netz: Rückwand und Seiten */
  let netz = "";
  for (let xm = -1.5; xm <= 1.5; xm += 0.2) netz += `M${pt(xm, dn, 0)} L${pt(xm, dn, 1.95)}`;
  for (let h = 0; h <= 1.95; h += 0.2) netz += `M${pt(-1.5, dn, h)} L${pt(1.5, dn, h)}`;
  for (let h = 0; h <= 2; h += 0.25) netz += `M${pt(-1.5, d, h)} L${pt(-1.5, dn, Math.min(h, 1.95))} M${pt(1.5, d, h)} L${pt(1.5, dn, Math.min(h, 1.95))}`;
  k += `<path d="${netz}" stroke="#f4f4f0" stroke-width=".22" opacity=".9"/>`;
  /* Pfosten und Latte rot-weiß (8 cm) */
  const pf = (xa, xb, ha, hb) => quader(xa, xb, d - 0.04, d + 0.04, ha, hb, { front: "#f4f4f0", seite: "#d9d9d4" });
  k += pf(-1.58, -1.5, 0, 2.08) + pf(1.5, 1.58, 0, 2.08) + pf(-1.58, 1.58, 2.0, 2.08);
  let st = "";
  for (let i = 0; i < 10; i += 2) {
    st += `<path d="${poly([P(-1.58, d - 0.04, i * 0.2), P(-1.5, d - 0.04, i * 0.2), P(-1.5, d - 0.04, i * 0.2 + 0.2), P(-1.58, d - 0.04, i * 0.2 + 0.2)])}" fill="#d23a33"/>`;
    st += `<path d="${poly([P(1.5, d - 0.04, i * 0.2), P(1.58, d - 0.04, i * 0.2), P(1.58, d - 0.04, i * 0.2 + 0.2), P(1.5, d - 0.04, i * 0.2 + 0.2)])}" fill="#d23a33"/>`;
  }
  for (let i = 0; i < 15; i += 2) st += `<path d="${poly([P(-1.5 + i * 0.2, d - 0.04, 2.0), P(-1.3 + i * 0.2, d - 0.04, 2.0), P(-1.3 + i * 0.2, d - 0.04, 2.08), P(-1.5 + i * 0.2, d - 0.04, 2.08)])}" fill="#d23a33"/>`;
  k += st;
  const [ax, ay] = P(0, d);
  S.teil({ id: "tor", de: "das Tor", syl: "TOR", it: "la porta", itSyl: "POR-ta", en: "goal", x: ax, y: ay, steht: true, kunst: abs(ax, ay, k),
    tipp: "In der Halle spielt man Handball und Hallenfußball auf dieses Tor." });
}
{
  const d = D_W - 0.25, dr = d - 0.45;
  let k = "";
  /* Wandausleger */
  k += `<path d="M${pt(-0.6, D_W, 3.2)} L${pt(-0.6, d, 3.2)} M${pt(0.6, D_W, 3.2)} L${pt(0.6, d, 3.2)} M${pt(-0.6, D_W, 3.8)} L${pt(-0.6, d, 3.5)} M${pt(0.6, D_W, 3.8)} L${pt(0.6, d, 3.5)}" stroke="#555b61" stroke-width=".8"/>`;
  /* Brett (Plexiglas mit Rahmen und Zielquadrat) */
  k += `<path d="${poly([P(-0.9, d, 2.9), P(0.9, d, 2.9), P(0.9, d, 3.95), P(-0.9, d, 3.95)])}" fill="${S.lg("brett", [[0, "#ffffff", 0.85], [1, "#dfeaf0", 0.85]])}" stroke="#d23a33" stroke-width=".9"/>`;
  k += `<path d="${poly([P(-0.3, d, 3.05), P(0.3, d, 3.05), P(0.3, d, 3.5), P(-0.3, d, 3.5)])}" fill="none" stroke="#d23a33" stroke-width=".6"/>`;
  /* Ring (3,05 m) und Netz */
  const [rx, ry] = P(0, dr, 3.05), R = 0.23 * s(dr);
  k += `<path d="M${r(rx)} ${r(Y(d, 3.05))} L${r(rx)} ${r(ry)}" stroke="#e05a1a" stroke-width=".7"/>`;
  let nz = "";
  for (let i = 0; i <= 8; i++) { const t = i / 8; nz += `M${r(rx - R + 2 * R * t)} ${r(ry)} L${r(rx - R * 0.6 + 1.2 * R * (1 - t))} ${r(ry + 0.42 * s(dr))}`; }
  k += `<path d="${nz}" stroke="#f4f4f0" stroke-width=".3"/><path d="M${r(rx - R * 0.6)} ${r(ry + 0.42 * s(dr))} L${r(rx + R * 0.6)} ${r(ry + 0.42 * s(dr))}" stroke="#f4f4f0" stroke-width=".3"/>`;
  k += `<ellipse cx="${r(rx)}" cy="${r(ry)}" rx="${r(R)}" ry="${r(R * 0.15)}" fill="none" stroke="#e05a1a" stroke-width=".8"/>`;
  const [ax, ay] = P(0, d, 2.9);
  S.teil({ id: "basketballkorb", de: "der Basketballkorb", syl: "BAS-ket-ball-korb", it: "il canestro", itSyl: "ca-NE-stro", en: "basketball hoop", x: ax, y: ay, kunst: abs(ax, ay, k),
    tipp: "Der Ring hängt genau 3,05 Meter hoch." });
}

/* =====================================================================
   5 — DER BALLWAGEN (Volleybälle und Handbälle)
   ===================================================================== */
{
  const x0 = 2.3, x1 = 3.15, d0 = 18.0, d1 = 18.6, hh = 0.95;
  let k = schatten(X((x0 + x1) / 2, d0), Y(d0), 9, 1, 0.3);
  const [bx0, by] = P(x0, d0), [bx1] = P(x1, d0), sc = s(d0);
  /* Bälle zuerst (hinter dem Gitter) */
  const farben = [["#f4f4f0", "#2f6fd0"], ["#ffd23f", "#2f6fd0"], ["#e8453c", "#f4f4f0"], ["#f4f4f0", "#2f6fd0"], ["#ffd23f", "#2f6fd0"], ["#e07b22", "#2b2b2b"], ["#f4f4f0", "#2f6fd0"], ["#38c172", "#f4f4f0"]];
  farben.forEach(([a, b], i) => {
    const x = bx0 + 2.3 + (i % 4) * (bx1 - bx0 - 4.6) / 3 + (Math.floor(i / 4) ? 1.3 : 0), y = by - hh * sc + 2.2 + Math.floor(i / 4) * -2.4 + 1.5;
    k += `<circle cx="${r(x)}" cy="${r(y)}" r="2.2" fill="${a}"/><path d="M${r(x - 2)} ${r(y - 0.6)} q2 1.4 4 0 M${r(x - 0.5)} ${r(y - 2.1)} q-1 2 .4 4.2" stroke="${b}" stroke-width=".45" fill="none"/>`;
  });
  k += `<rect x="${r(bx0)}" y="${r(by - hh * sc + 2)}" width="${r(bx1 - bx0)}" height="${r(hh * sc - 3.4)}" fill="none" stroke="#5c6167" stroke-width=".7"/>`;
  let g = "";
  for (let x = bx0 + 1.6; x < bx1; x += 1.6) g += `M${r(x)} ${r(by - hh * sc + 2)} V${r(by - 1.4)}`;
  k += `<path d="${g}" stroke="#7d848a" stroke-width=".3"/>`;
  k += `<path d="M${r(bx0)} ${r(by - hh * sc + 6.4)} H${r(bx1)}" stroke="#7d848a" stroke-width=".3"/>`;
  for (const x of [bx0 + 1, bx1 - 1]) k += `<circle cx="${r(x)}" cy="${r(by - 0.7)}" r=".8" fill="#2b2b2b"/>`;
  k += `<path d="M${r(bx1)} ${r(by - hh * sc + 2)} l2 -2.4" stroke="#5c6167" stroke-width=".7"/>`;
  const [ax, ay] = P((x0 + x1) / 2, d0);
  S.teil({ id: "ballwagen", de: "der Ballwagen", syl: "BALL-wa-gen", it: "il carrello dei palloni", itSyl: "car-REL-lo dei pal-LO-ni", en: "ball cart", x: ax, y: ay, steht: true, kunst: abs(ax, ay, k) });
}

/* =====================================================================
   6 — MUSIK- UND KUNSTSCHULE: KLAVIER, GITARRE, STAFFELEI (Lupe: Pinsel)
   ===================================================================== */
{
  const x0 = 3.7, x1 = 5.2, d0 = 18.4, d1 = D_W - 0.02;
  let k = schatten(X((x0 + x1) / 2, d0), Y(d0), 15, 1.1, 0.35);
  k += quader(x0, x1, d0, d1, 0, 1.25, { deckel: "#2a1a12", front: S.lg("klav", [[0, "#3a2418"], [0.5, "#24150d"], [1, "#160c07"]], 0, 0, 1, 0), seite: "#1d110a" });
  /* Tastatur und Tastenklappe */
  k += quader(x0 + 0.05, x1 - 0.05, d0 - 0.28, d0, 0.7, 0.76, { deckel: "#f6f4ee", front: "#1d110a" });
  const [tx0, ty] = P(x0 + 0.05, d0 - 0.28, 0.76), [tx1] = P(x1 - 0.05, d0 - 0.28, 0.76), [, ty2] = P(x0, d0, 0.76);
  let ta = "";
  for (let i = 0; i < 26; i++) { const t = (i + 0.6) / 26; if ([1, 2, 4, 5, 6].includes(i % 7)) ta += `<rect x="${r(tx0 + (tx1 - tx0) * t - 0.3)}" y="${r(ty2 - 0.2)}" width=".5" height="${r(ty - ty2 + 0.1)}" fill="#111"/>`; }
  k += ta;
  k += quader(x0 + 0.05, x1 - 0.05, d0 - 0.3, d0 - 0.26, 0.4, 0.7, { front: "#24150d" });
  /* Notenpult mit Noten, Kerzenhalter-Glanz */
  const [nx, ny] = P((x0 + x1) / 2, d0, 0.95);
  k += `<rect x="${r(nx - 4)}" y="${r(ny - 3.6)}" width="8" height="4.2" fill="#f7f3e6"/>`;
  for (let i = 0; i < 4; i++) k += `<path d="M${r(nx - 3.4)} ${r(ny - 3 + i)} H${r(nx + 3.4)}" stroke="#555" stroke-width=".12"/>`;
  k += `<path d="${poly([P(x0 + 0.1, d0, 1.2), P(x0 + 0.4, d0, 1.2), P(x0 + 0.2, d0, 0.85), P(x0, d0, 0.85)])}" fill="#fff" opacity=".1"/>`;
  /* Pedale */
  const [px, py] = P((x0 + x1) / 2, d0 - 0.05, 0.05);
  k += `<rect x="${r(px - 2)}" y="${r(py - 0.5)}" width="1.2" height=".6" fill="#c9a227"/><rect x="${r(px + 0.8)}" y="${r(py - 0.5)}" width="1.2" height=".6" fill="#c9a227"/>`;
  const [ax, ay] = P((x0 + x1) / 2, d0);
  S.teil({ id: "klavier", de: "das Klavier", syl: "Kla-VIER", it: "il pianoforte", itSyl: "pia-no-FOR-te", en: "piano", x: ax, y: ay, steht: true, kunst: abs(ax, ay, k),
    tipp: "Ein Klavier hat 88 Tasten: 52 weiße und 36 schwarze." });
}
{
  /* DIE GITARRE — auf einem Gitarrenständer */
  const d = 17.9, sc = s(d), [x, y] = P(5.75, d), L = 1.0 * sc;
  let k = schatten(0, 0, 3.5, 0.7, 0.3);
  k += `<path d="M-2.6 0 L0 ${r(-L * 0.35)} L2.6 0 M0 ${r(-L * 0.35)} L0 ${r(-L * 0.62)}" stroke="#2b2b2b" stroke-width=".5" fill="none"/>`;
  const kx = 0, ky = -L * 0.28;
  k += `<g transform="rotate(-8 0 0)"><path d="M${r(kx)} ${r(ky + L * 0.05)} c${r(-L * 0.2)} 0 ${r(-L * 0.2)} ${r(-L * 0.18)} ${r(-L * 0.1)} ${r(-L * 0.22)} c${r(-L * 0.06)} ${r(-L * 0.05)} ${r(-L * 0.06)} ${r(-L * 0.16)} ${r(L * 0.1)} ${r(-L * 0.16)} c${r(L * 0.16)} 0 ${r(L * 0.16)} ${r(L * 0.11)} ${r(L * 0.1)} ${r(L * 0.16)} c${r(L * 0.1)} ${r(L * 0.04)} ${r(L * 0.1)} ${r(L * 0.22)} ${r(-L * 0.1)} ${r(L * 0.22)} Z" fill="${S.lg("git", [[0, "#e9a85a"], [1, "#b8742e"]], 0, 0, 1, 0)}" stroke="#5a3218" stroke-width=".3"/>`;
  k += `<circle cx="${r(kx)}" cy="${r(ky - L * 0.2)}" r="${r(L * 0.045)}" fill="#2b1a10"/>`;
  k += `<rect x="${r(kx - L * 0.025)}" y="${r(ky - L * 0.75)}" width="${r(L * 0.05)}" height="${r(L * 0.45)}" fill="#5a3218"/><rect x="${r(kx - L * 0.04)}" y="${r(ky - L * 0.86)}" width="${r(L * 0.08)}" height="${r(L * 0.12)}" rx=".4" fill="#3a2010"/>`;
  k += `<path d="M${r(kx - 0.3)} ${r(ky - L * 0.75)} V${r(ky - L * 0.02)} M${r(kx + 0.3)} ${r(ky - L * 0.75)} V${r(ky - L * 0.02)}" stroke="#e6e6e0" stroke-width=".12"/></g>`;
  S.teil({ id: "gitarre", de: "die Gitarre", syl: "Gi-TAR-re", it: "la chitarra", itSyl: "chi-TAR-ra", en: "guitar", x, y, steht: true, kunst: k });
}
{
  /* DIE STAFFELEI mit Leinwand; auf der Ablage Pinsel und Farbpalette (Lupe) */
  const d = 18.1, sc = s(d), [x, y] = P(6.95, d), Hs = 1.7 * sc;
  let k = schatten(0, 0, 5, 0.8, 0.3);
  k += `<path d="M-4 0 L-0.6 ${r(-Hs)} M4 0 L0.6 ${r(-Hs)} M0 ${r(-Hs * 0.55)} L1.5 1.5" stroke="#a87b45" stroke-width=".8" stroke-linecap="round"/>`;
  const lw = 0.62 * sc, lh = 0.5 * sc, ly = -Hs * 0.5;
  k += `<rect x="${r(-lw / 2)}" y="${r(ly - lh)}" width="${r(lw)}" height="${r(lh)}" fill="#fbfaf5" stroke="#d8d2c2" stroke-width=".3"/>`;
  /* Bild: Berge und See */
  k += `<rect x="${r(-lw / 2 + 0.6)}" y="${r(ly - lh + 0.6)}" width="${r(lw - 1.2)}" height="${r(lh - 1.2)}" fill="${S.lg("bild", [[0, "#9fd0f0"], [1, "#e9f4fa"]])}"/>`;
  k += `<path d="M${r(-lw / 2 + 0.6)} ${r(ly - 2.6)} L${r(-lw * 0.2)} ${r(ly - lh * 0.75)} L${r(lw * 0.05)} ${r(ly - lh * 0.45)} L${r(lw * 0.25)} ${r(ly - lh * 0.7)} L${r(lw / 2 - 0.6)} ${r(ly - 2.6)} Z" fill="#6a8fb0"/><path d="M${r(-lw * 0.27)} ${r(ly - lh * 0.66)} L${r(-lw * 0.2)} ${r(ly - lh * 0.75)} L${r(-lw * 0.13)} ${r(ly - lh * 0.66)} Z" fill="#fff"/>`;
  k += `<rect x="${r(-lw / 2 + 0.6)}" y="${r(ly - 2.6)}" width="${r(lw - 1.2)}" height="2" fill="#3c8fc0"/>`;
  /* Ablage mit Pinselbecher und Palette */
  k += `<rect x="${r(-lw / 2 - 0.5)}" y="${r(ly)}" width="${r(lw + 1)}" height=".9" fill="#8a5a2e"/>`;
  k += `<rect x="1.8" y="${r(ly - 2.4)}" width="1.8" height="2.4" fill="#cfd8dc"/>`;
  for (const [dx, f] of [[0.2, "#d23a33"], [0.8, "#2f6fd0"], [1.3, "#f2c230"]]) k += `<path d="M${r(1.9 + dx)} ${r(ly - 2.2)} L${r(1.5 + dx * 1.6)} ${r(ly - 5.8)}" stroke="#c49a5c" stroke-width=".35"/><path d="M${r(1.5 + dx * 1.6)} ${r(ly - 5.8)} l-.2 -.9" stroke="${f}" stroke-width=".5"/>`;
  k += `<ellipse cx="-2.2" cy="${r(ly - 0.5)}" rx="2.4" ry=".9" fill="#e8d2a8"/>` + ["#d23a33", "#2f6fd0", "#f2c230", "#38c172"].map((f, i) => `<circle cx="${r(-3.6 + i * 0.9)}" cy="${r(ly - 0.6)}" r=".35" fill="${f}"/>`).join("");
  const unter = [
    { id: "pinsel", de: "der Pinsel", syl: "PIN-sel", it: "il pennello", itSyl: "pen-NEL-lo", en: "paintbrush", x: x + 2.7, y: y + ly, kunst: flaeche(-2.4, -6.4, 4.8, 6.6),
      tipp: "Mit dem Pinsel malt man mit Wasserfarben oder Acrylfarben." },
    { id: "farbpalette", de: "die Farbpalette", syl: "FARB-pa-let-te", it: "la tavolozza", itSyl: "ta-vo-LOZ-za", en: "palette", x: x - 2.2, y: y + ly, kunst: flaeche(-2.8, -1.8, 5.2, 2.4) },
    { id: "leinwand", de: "die Leinwand", syl: "LEIN-wand", it: "la tela", itSyl: "TE-la", en: "canvas", x, y: y + ly - 1, kunst: flaeche(-lw / 2, -lh + 1, lw, lh - 1) },
  ];
  S.teil({ id: "staffelei", de: "die Staffelei", syl: "staf-fe-LEI", it: "il cavalletto", itSyl: "ca-val-LET-to", en: "easel", x, y, steht: true, kunst: k,
    zoom: { x: r(x - 21), y: r(y - Hs - 3), w: 42, h: 28 }, unter, tipp: "Auf der Staffelei steht das Bild beim Malen." });
}

/* =====================================================================
   7 — DER JUNGE (wirft den Basketball auf den Korb)
   ===================================================================== */
let BALLPUNKT = null;
{
  const d = 14.2, sc = s(d), [x, y] = P(-1.65, d);
  const m = mensch({ id: "b14c_jg", alter: "kind", geschlecht: "m", pose: "werfen", blick: 150, frisur: "kurz", haarfarbe: "braun", haut: "mittel",
    kleidung: { oberteil: { stueck: "tshirt", farbe: "#2f6fd0" }, unterteil: { stueck: "shorts", farbe: "schwarz" }, schuhe: { stueck: "turnschuh" } } }, 1.42 * sc);
  const hand = [m.z.handL, m.z.handR].filter(Boolean).sort((a, b) => (a.y != null ? a.y : a[1]) - (b.y != null ? b.y : b[1]))[0];
  BALLPUNKT = [x + (hand.x != null ? hand.x : hand[0]) * m.k, y + (hand.y != null ? hand.y : hand[1]) * m.k, sc];
  S.teil({ id: "junge", de: "der Junge", syl: "JUN-ge", it: "il ragazzo", itSyl: "ra-GAZ-zo", en: "boy", x, y, kunst: schatten(0, 0, 5, 1, 0.3) + m.svg,
    tipp: "Der Junge probiert Basketball aus – vielleicht wird er Mitglied im Verein." });
}
{
  const [bx, by, sc] = BALLPUNKT, R = 0.12 * sc * 1.15;
  let k = `<circle cx="0" cy="${r(-R)}" r="${r(R)}" fill="${S.rg("bball", [[0, "#f59a4a"], [0.7, "#e0661c"], [1, "#a8460c"]], 0.38, 0.32, 0.75)}"/>`;
  k += `<path d="M${r(-R)} ${r(-R)} H${r(R)} M0 ${r(-2 * R)} V0 M${r(-R * 0.7)} ${r(-R * 1.7)} Q0 ${r(-R)} ${r(-R * 0.7)} ${r(-R * 0.3)} M${r(R * 0.7)} ${r(-R * 1.7)} Q0 ${r(-R)} ${r(R * 0.7)} ${r(-R * 0.3)}" stroke="#2b1a10" stroke-width=".25" fill="none"/>`;
  S.teil({ oben: true, id: "basketball", de: "der Basketball", syl: "BAS-ket-ball", it: "la pallacanestro", itSyl: "pal-la-ca-NE-stro", en: "basketball", x: bx, y: by - 0.4, kunst: k,
    tipp: "Beim Basketball wirft man den Ball in den Korb." });
}

/* =====================================================================
   8 — SCHWIMM- UND ANGELVEREIN: KASTEN, SURFBRETT, ANGEL, SCHWIMMBRILLE
   ===================================================================== */
const KASTEN = { x0: -3.75, x1: -2.25, d0: 9.4, d1: 10.3, h: 1.1 };
{
  /* DAS SURFBRETT — steht aufrecht links neben dem Kasten */
  const d = 10.0, sc = s(d), [x, y] = P(-4.25, d), L = 2.1 * sc, w = 0.56 * sc;
  let k = schatten(0, 0, w / 2 + 2, 1.2, 0.3);
  k += `<path d="M0 0 C${r(-w * 0.55)} ${r(-L * 0.08)} ${r(-w * 0.55)} ${r(-L * 0.6)} 0 ${r(-L)} C${r(w * 0.55)} ${r(-L * 0.6)} ${r(w * 0.55)} ${r(-L * 0.08)} 0 0 Z" fill="${S.lg("surf", [[0, "#ffffff"], [0.5, "#f1f6f8"], [1, "#c9d8de"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M0 -1 C${r(-w * 0.18)} ${r(-L * 0.2)} ${r(-w * 0.18)} ${r(-L * 0.6)} 0 ${r(-L + 1)} C${r(w * 0.18)} ${r(-L * 0.6)} ${r(w * 0.18)} ${r(-L * 0.2)} 0 -1 Z" fill="#2f9ad8"/>`;
  k += `<path d="M${r(-w * 0.42)} ${r(-L * 0.3)} Q0 ${r(-L * 0.27)} ${r(w * 0.42)} ${r(-L * 0.3)}" stroke="#f07a1a" stroke-width="1.4" fill="none"/>`;
  k += `<path d="M${r(-w * 0.3)} ${r(-L * 0.7)} C${r(-w * 0.45)} ${r(-L * 0.4)} ${r(-w * 0.45)} ${r(-L * 0.15)} ${r(-w * 0.25)} ${r(-L * 0.05)}" stroke="#fff" stroke-width=".7" opacity=".7" fill="none"/>`;
  S.teil({ id: "surfbrett", de: "das Surfbrett", syl: "SURF-brett", it: "la tavola da surf", itSyl: "TA-vo-la da SURF", en: "surfboard", x, y, steht: true, kunst: k });
}
{
  /* DER KASTEN — Sprungkasten als Stand */
  const { x0, x1, d0, d1, h } = KASTEN;
  let k = schatten(X((x0 + x1) / 2, d0), Y(d0), (X(x1, d0) - X(x0, d0)) / 2 + 3, 1.6, 0.35);
  const seg = [0, 0.22, 0.42, 0.62, 0.82];
  seg.forEach((h0, i) => {
    const h1 = i < seg.length - 1 ? seg[i + 1] : 0.82;
    if (i < seg.length - 1) k += quader(x0 + i * 0.012, x1 - i * 0.012, d0 + i * 0.012, d1 - i * 0.012, h0, h1, { front: S.lg("kh" + i, [[0, "#e2bc80"], [1, "#c99b5c"]]), seite: "#b88a4e" });
  });
  for (const h0 of seg.slice(1)) k += `<path d="M${pt(x0, d0, h0)} L${pt(x1, d0, h0)}" stroke="#8a6237" stroke-width=".5"/>`;
  /* Grifflöcher */
  for (const hh of [0.32, 0.52]) { const [gx, gy] = P((x0 + x1) / 2, d0, hh); k += `<rect x="${r(gx - 4)}" y="${r(gy - 1)}" width="8" height="2" rx="1" fill="#3a2410"/>`; }
  /* Lederpolster oben */
  k += quader(x0 + 0.04, x1 - 0.04, d0 + 0.04, d1 - 0.04, 0.82, h, { deckel: LEDER, front: S.lg("ledf", [[0, "#8e5530"], [1, "#6b3c1d"]]), seite: "#6b3c1d" });
  /* Zettel am Kasten */
  const [zx, zy] = P((x0 + x1) / 2, d0, 0.78);
  k += `<rect x="${r(zx - 12)}" y="${r(zy)}" width="24" height="5.2" fill="#ffffff" stroke="#c8cdd1" stroke-width=".2"/><text x="${r(zx)}" y="${r(zy + 2.2)}" font-size="2" text-anchor="middle" fill="#1f5fae" font-family="Arial" font-weight="bold">Schwimm- und Angelverein</text><text x="${r(zx)}" y="${r(zy + 4.3)}" font-size="1.6" text-anchor="middle" fill="#333" font-family="Arial">Talstadt e. V.</text>`;
  const [ax, ay] = P((x0 + x1) / 2, d0);
  S.teil({ id: "kasten", de: "der Kasten", syl: "KAS-ten", it: "la cavallina", itSyl: "ca-val-LI-na", en: "vaulting box", x: ax, y: ay, steht: true, kunst: abs(ax, ay, k),
    tipp: "Über den Kasten springt man im Sportunterricht." });
}
{
  /* DIE ANGEL — liegt zerlegt auf dem Kasten */
  const { x0, x1, d0, d1, h } = KASTEN, dm = (d0 + d1) / 2;
  const [xa, ya] = P(x0 + 0.15, dm, h + 0.03), [xb, yb] = P(x1 + 0.55, dm - 0.15, h + 0.03);
  let k = `<path d="M${r(xa)} ${r(ya)} L${r(xb)} ${r(yb)}" stroke="${S.lg("rute", [[0, "#2b2b2b"], [1, "#6b5a3a"]], 0, 0, 1, 0)}" stroke-width="1.1" stroke-linecap="round"/>`;
  k += `<path d="M${r(xa)} ${r(ya)} L${r(xa + 9)} ${r(ya - 0.1)}" stroke="#8a5a2e" stroke-width="1.9" stroke-linecap="round"/>`;
  for (const t of [0.3, 0.5, 0.7, 0.88]) k += `<circle cx="${r(xa + (xb - xa) * t)}" cy="${r(ya + (yb - ya) * t - 0.7)}" r=".35" fill="none" stroke="#c9cfd4" stroke-width=".2"/>`;
  /* Rolle */
  k += `<circle cx="${r(xa + 6)}" cy="${r(ya + 1.6)}" r="1.6" fill="${STAHL}" stroke="#5c6167" stroke-width=".3"/><path d="M${r(xa + 6)} ${r(ya + 1.6)} l1.6 .4" stroke="#2b2b2b" stroke-width=".35"/>`;
  /* Schnur mit Pose und Haken */
  k += `<path d="M${r(xb)} ${r(yb)} q1 5 -0.6 8" stroke="#bbb" stroke-width=".15" fill="none"/><ellipse cx="${r(xb - 0.4)}" cy="${r(yb + 6)}" rx=".5" ry="1" fill="#e8453c"/>`;
  const [ax, ay] = P((x0 + x1) / 2, dm, h);
  S.teil({ oben: true, id: "angel", de: "die Angel", syl: "AN-gel", it: "la canna da pesca", itSyl: "CAN-na da PE-sca", en: "fishing rod", x: ax, y: ay, kunst: abs(ax, ay, k),
    tipp: "Zum Angeln braucht man in Deutschland einen Angelschein." });
}
{
  const { x0, d0, d1, h } = KASTEN, [x, y] = P(x0 + 0.4, d0 + 0.2, h);
  let b = `<path d="M-5 -1 Q0 -3 5 -1" stroke="#222" stroke-width=".5" fill="none"/>`;
  for (const sx of [-1, 1]) b += `<ellipse cx="${sx * 2}" cy="-.9" rx="1.8" ry="1.15" fill="${S.lg("glas2", [[0, "#9ff0ff"], [1, "#2c7fa8"]])}" stroke="#ff6a2b" stroke-width=".6"/><ellipse cx="${sx * 2 - 0.5}" cy="-1.3" rx=".6" ry=".25" fill="#fff" opacity=".7"/>`;
  S.teil({ oben: true, id: "schwimmbrille", de: "die Schwimmbrille", syl: "SCHWIMM-bril-le", it: "gli occhialini", itSyl: "oc-chia-LI-ni", en: "swimming goggles", x, y, kunst: schatten(0, 0, 4.5, 0.6, 0.2) + b });
}

/* =====================================================================
   9 — DER INFOSTAND des TSV (Lupe: Pokal, Medaille, Stoppuhr,
       Turnschuhe, Hantel, Tennisschläger)
   ===================================================================== */
const TISCH = { x0: -1.35, x1: 1.0, d0: 8.6, d1: 9.3, h: 0.76 };
{
  const { x0, x1, d0, d1, h } = TISCH;
  let k = schatten(X((x0 + x1) / 2, d0), Y(d0), (X(x1, d0) - X(x0, d0)) / 2 + 3, 2, 0.35);
  /* Tischdecke bis zum Boden */
  k += quader(x0, x1, d0, d1, 0.02, h, { deckel: "#ffffff", front: S.lg("decke", [[0, "#ffffff"], [1, "#e3e8ec"]]), seite: "#d6dde2" });
  k += `<path d="${poly([P(x0, d0, h - 0.05), P(x1, d0, h - 0.05), P(x1, d0, h - 0.13), P(x0, d0, h - 0.13)])}" fill="#1f5fae"/>`;
  for (let xm = x0 + 0.2; xm < x1; xm += 0.3) k += `<path d="M${pt(xm, d0, h - 0.13)} L${pt(xm + 0.03, d0, 0.03)}" stroke="#cfd6db" stroke-width=".4"/>`;
  const [tx, ty] = P((x0 + x1) / 2, d0, 0.45);
  k += `<circle cx="${r(tx - 33)}" cy="${r(ty - 1)}" r="6" fill="#1f5fae"/><text x="${r(tx - 33)}" y="${r(ty + 1)}" font-size="4.6" text-anchor="middle" fill="#fff" font-family="Arial Black,Arial" font-weight="900">TSV</text>`;
  k += `<text x="${r(tx + 5)}" y="${r(ty - 1.5)}" font-size="5" text-anchor="middle" fill="#1f5fae" font-family="Arial Black,Arial" font-weight="900">TSV Talstadt 1890 e. V.</text>`;
  k += `<text x="${r(tx + 5)}" y="${r(ty + 3.5)}" font-size="3" text-anchor="middle" fill="#333" font-family="Arial">Turnen · Leichtathletik · Tennis · Fußball</text>`;
  /* Dinge auf dem Tisch */
  const auf = (xm, dd) => P(xm, dd, h);
  const items = [];
  /* POKAL */
  {
    const [x, y] = auf(x0 + 0.25, d0 + 0.45), sc = s(d0 + 0.45);
    let g = `<rect x="${r(x - 2.6)}" y="${r(y - 2.4)}" width="5.2" height="2.4" fill="#2b2b2b"/><rect x="${r(x - 0.6)}" y="${r(y - 5)}" width="1.2" height="2.6" fill="#d9b13a"/>`;
    g += `<path d="M${r(x - 3.4)} ${r(y - 12.5)} L${r(x + 3.4)} ${r(y - 12.5)} Q${r(x + 3.2)} ${r(y - 6)} ${r(x)} ${r(y - 5)} Q${r(x - 3.2)} ${r(y - 6)} ${r(x - 3.4)} ${r(y - 12.5)} Z" fill="${S.lg("gold", [[0, "#fff1a8"], [0.4, "#e7c14a"], [1, "#a8821c"]], 0, 0, 1, 0)}"/>`;
    g += `<path d="M${r(x - 3.3)} ${r(y - 11.6)} q-2.4 .4 -1.2 3 q.8 1 1.8 .6 M${r(x + 3.3)} ${r(y - 11.6)} q2.4 .4 1.2 3 q-.8 1 -1.8 .6" stroke="#d9b13a" stroke-width=".6" fill="none"/>`;
    k += g;
    items.push({ id: "pokal", de: "der Pokal", syl: "Po-KAL", it: "la coppa", itSyl: "COP-pa", en: "trophy", x, y, kunst: flaeche(-5, -13, 10, 13.4), tipp: "Den Pokal hat die Fußball-Jugend gewonnen." });
  }
  /* MEDAILLE am Band, auf einem Kissen */
  {
    const [x, y] = auf(x0 + 0.62, d0 + 0.3);
    let g = `<ellipse cx="${r(x)}" cy="${r(y - 0.6)}" rx="4.4" ry="1.3" fill="#1f5fae"/>`;
    g += `<path d="M${r(x - 2.6)} ${r(y - 1.2)} L${r(x - 0.6)} ${r(y - 4)} M${r(x + 2.6)} ${r(y - 1.2)} L${r(x + 0.6)} ${r(y - 4)}" stroke="#d23a33" stroke-width="1.1"/>`;
    g += `<circle cx="${r(x)}" cy="${r(y - 3.6)}" r="2.2" fill="${S.rg("med", [[0, "#fff1a8"], [0.6, "#e7c14a"], [1, "#a8821c"]], 0.4, 0.35, 0.8)}" stroke="#a8821c" stroke-width=".2"/><text x="${r(x)}" y="${r(y - 2.9)}" font-size="2" text-anchor="middle" fill="#7a5a10" font-family="Arial" font-weight="bold">1</text>`;
    k += g;
    items.push({ id: "medaille", de: "die Medaille", syl: "Me-DAIL-le", it: "la medaglia", itSyl: "me-DA-glia", en: "medal", x, y, kunst: flaeche(-5, -6.6, 10, 7) });
  }
  /* STOPPUHR */
  {
    const [x, y] = auf(x0 + 0.9, d0 + 0.25);
    let g = `<circle cx="${r(x)}" cy="${r(y - 2.6)}" r="2.6" fill="${S.lg("stopp", [[0, "#5c6167"], [1, "#2b2e32"]])}"/><circle cx="${r(x)}" cy="${r(y - 2.6)}" r="1.9" fill="#e9f2df"/>`;
    g += `<text x="${r(x)}" y="${r(y - 2.2)}" font-size="1.1" text-anchor="middle" fill="#1d1f22" font-family="monospace">0:12,8</text>`;
    g += `<rect x="${r(x - 0.5)}" y="${r(y - 6)}" width="1" height="1" fill="#9aa3aa"/><path d="M${r(x - 0.8)} ${r(y - 6.2)} q.8 -1.6 1.6 0" stroke="#d23a33" stroke-width=".4" fill="none"/>`;
    k += g;
    items.push({ id: "stoppuhr", de: "die Stoppuhr", syl: "STOPP-uhr", it: "il cronometro", itSyl: "cro-NO-me-tro", en: "stopwatch", x, y, kunst: flaeche(-3.4, -7, 6.8, 7.4), tipp: "Mit der Stoppuhr misst man die Zeit beim Laufen." });
  }
  /* TURNSCHUHE (ein Paar) */
  {
    const [x, y] = auf(x0 + 1.3, d0 + 0.35);
    let g = "";
    for (const dx of [-3.4, 2.6]) {
      g += `<path d="M${r(x + dx - 3.2)} ${r(y)} L${r(x + dx + 3.4)} ${r(y)} Q${r(x + dx + 3.8)} ${r(y - 1.6)} ${r(x + dx + 2.2)} ${r(y - 2)} L${r(x + dx + 0.6)} ${r(y - 2.4)} L${r(x + dx - 1.2)} ${r(y - 4)} L${r(x + dx - 3.2)} ${r(y - 3.6)} Z" fill="#f4f4f0" stroke="#9aa3aa" stroke-width=".2"/>`;
      g += `<path d="M${r(x + dx - 3.2)} ${r(y - 0.6)} H${r(x + dx + 3.6)}" stroke="#2f6fd0" stroke-width=".7"/><path d="M${r(x + dx - 1.5)} ${r(y - 2.4)} l3 .3" stroke="#d23a33" stroke-width=".6"/>`;
    }
    k += g;
    items.push({ id: "turnschuh", de: "die Turnschuhe", syl: "TURN-schu-he", it: "le scarpe da ginnastica", itSyl: "SCAR-pe da gin-NA-sti-ca", en: "trainers", x, y, kunst: flaeche(-7, -4.6, 14, 5) });
  }
  /* HANTEL */
  {
    const [x, y] = auf(x0 + 1.72, d0 + 0.4);
    let g = `<rect x="${r(x - 3)}" y="${r(y - 1.6)}" width="6" height=".8" fill="#b9c0c6"/>`;
    for (const dx of [-3, 2]) g += `<rect x="${r(x + dx - 0.5)}" y="${r(y - 3)}" width="1.6" height="3" rx=".4" fill="#2b2e32"/>`;
    k += g;
    items.push({ id: "hantel", de: "die Hantel", syl: "HAN-tel", it: "il manubrio", itSyl: "ma-NU-brio", en: "dumbbell", x, y, kunst: flaeche(-4, -3.6, 8, 4) });
  }
  /* TENNISSCHLÄGER mit Ball */
  {
    const [x, y] = auf(x0 + 2.1, d0 + 0.3);
    let g = `<g transform="rotate(-18 ${r(x)} ${r(y)})"><ellipse cx="${r(x - 2)}" cy="${r(y - 1.6)}" rx="3.6" ry="1.4" fill="none" stroke="#2f6fd0" stroke-width=".7"/>`;
    for (let i = -2; i <= 2; i++) g += `<path d="M${r(x - 2 + i * 1.2)} ${r(y - 2.8)} V${r(y - 0.4)}" stroke="#ddd" stroke-width=".12"/>`;
    g += `<path d="M${r(x + 1.6)} ${r(y - 1.6)} L${r(x + 6.6)} ${r(y - 1.4)}" stroke="#2b2b2b" stroke-width="1"/></g>`;
    g += `<circle cx="${r(x + 4)}" cy="${r(y - 1.2)}" r="1.1" fill="#d7ec3a"/><path d="M${r(x + 3.1)} ${r(y - 1.6)} q.9 .7 1.8 0" stroke="#fff" stroke-width=".2" fill="none"/>`;
    k += g;
    items.push({ id: "tennisschlaeger", de: "der Tennisschläger", syl: "TEN-nis-schlä-ger", it: "la racchetta", itSyl: "rac-CHET-ta", en: "tennis racket", x, y, kunst: flaeche(-6, -4, 12, 4.6) });
  }
  const [ax, ay] = P((x0 + x1) / 2, d0);
  const [zx0, zy0] = P(x0 - 0.1, d0, h + 0.4), [zx1] = P(x1 + 0.1, d0, 0);
  const zw = zx1 - zx0, zh = zw / 1.5;
  S.teil({ id: "infostand", de: "der Infostand", syl: "IN-fo-stand", it: "lo stand informativo", itSyl: "STAND in-for-ma-TI-vo", en: "information stand", x: ax, y: ay, steht: true, kunst: abs(ax, ay, k),
    zoom: { x: r(zx0), y: r(zy0 - 2), w: r(zw), h: r(zh) }, unter: items,
    tipp: "Am Infostand erzählt der Sportverein, was man bei ihm alles machen kann." });
}
{
  /* DER FUSSBALL — liegt vor dem Infostand */
  const d = 7.7, sc = s(d), [x, y] = P(1.35, d), R = 0.11 * sc;
  let k = schatten(0, 0, R + 0.6, 0.9, 0.35);
  k += `<circle cx="0" cy="${r(-R)}" r="${r(R)}" fill="${S.rg("fb", [[0, "#ffffff"], [0.7, "#ecefef"], [1, "#b9c0c3"]], 0.38, 0.32, 0.8)}"/>`;
  const pent = (cx, cy, rr) => "M" + [0, 1, 2, 3, 4].map((i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / 5; return `${r(cx + Math.cos(a) * rr)} ${r(cy + Math.sin(a) * rr)}`; }).join(" L") + " Z";
  k += `<path d="${pent(0, -R, R * 0.32)}" fill="#1d1f22"/>`;
  for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i * 2 * Math.PI / 5; k += `<path d="${pent(Math.cos(a) * R * 0.78, -R + Math.sin(a) * R * 0.78, R * 0.2)}" fill="#1d1f22" opacity=".9"/>`; }
  S.teil({ id: "fussball", de: "der Fußball", syl: "FUSS-ball", it: "il pallone", itSyl: "pal-LO-ne", en: "football", x, y, steht: true, kunst: k });
}

/* =====================================================================
   10 — DER SCHACHCLUB: TISCH mit SCHACHBRETT
   ===================================================================== */
const SCH = { x0: 2.5, x1: 3.7, d0: 9.0, d1: 9.8, h: 0.75 };
{
  const { x0, x1, d0, d1, h } = SCH;
  let k = schatten(X((x0 + x1) / 2, d0), Y(d0), (X(x1, d0) - X(x0, d0)) / 2 + 2, 1.6, 0.3);
  for (const [xm, dd] of [[x0 + 0.06, d0 + 0.06], [x1 - 0.06, d0 + 0.06], [x0 + 0.06, d1 - 0.06], [x1 - 0.06, d1 - 0.06]]) k += quader(xm - 0.025, xm + 0.025, dd - 0.025, dd + 0.025, 0, h - 0.04, { front: "#5c6167", seite: "#45494e" });
  k += quader(x0, x1, d0, d1, h - 0.04, h, { deckel: S.lg("platte", [[0, "#d9c2a0"], [1, "#c6aa82"]]), front: "#8a6a44", seite: "#7a5a38" });
  /* Schild */
  const [sx, sy] = P((x0 + x1) / 2, d0, h - 0.06);
  k += `<rect x="${r(sx - 11)}" y="${r(sy)}" width="22" height="6" fill="#ffffff" stroke="#c8cdd1" stroke-width=".2"/><text x="${r(sx)}" y="${r(sy + 2.6)}" font-size="2.4" text-anchor="middle" fill="#1d1f22" font-family="Georgia,serif" font-weight="bold">♞ Schachclub Springer</text><text x="${r(sx)}" y="${r(sy + 4.9)}" font-size="1.7" text-anchor="middle" fill="#555" font-family="Arial">Spiel eine Partie mit uns!</text>`;
  const [ax, ay] = P((x0 + x1) / 2, d0);
  S.teil({ id: "tisch", de: "der Tisch", syl: "TISCH", it: "il tavolo", itSyl: "TA-vo-lo", en: "table", x: ax, y: ay, steht: true, kunst: abs(ax, ay, k) });
}
{
  const { x0, x1, d0, d1, h } = SCH, a = 0.42, xc = (x0 + x1) / 2 - 0.12, dc = (d0 + d1) / 2;
  let k = "";
  /* Brett 8 × 8 in Perspektive */
  k += `<path d="${poly([P(xc - a / 2 - 0.03, dc - a / 2 - 0.03, h + 0.01), P(xc + a / 2 + 0.03, dc - a / 2 - 0.03, h + 0.01), P(xc + a / 2 + 0.03, dc + a / 2 + 0.03, h + 0.01), P(xc - a / 2 - 0.03, dc + a / 2 + 0.03, h + 0.01)])}" fill="#5a3218"/>`;
  for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) {
    if ((i + j) % 2) continue;
    const u0 = xc - a / 2 + i * a / 8, v0 = dc - a / 2 + j * a / 8;
    k += `<path d="${poly([P(u0, v0, h + 0.012), P(u0 + a / 8, v0, h + 0.012), P(u0 + a / 8, v0 + a / 8, h + 0.012), P(u0, v0 + a / 8, h + 0.012)])}" fill="#f1e2c4"/>`;
  }
  /* Figuren: hinten zuerst */
  const fig = (u, v, weiss, gross) => { const [x, y] = P(xc - a / 2 + (u + 0.5) * a / 8, dc - a / 2 + (v + 0.5) * a / 8, h + 0.012), sc = s(dc), hh = (gross ? 0.075 : 0.045) * sc, w = 0.018 * sc;
    return `<path d="M${r(x - w)} ${r(y)} L${r(x - w * 0.5)} ${r(y - hh * 0.7)} L${r(x + w * 0.5)} ${r(y - hh * 0.7)} L${r(x + w)} ${r(y)} Z" fill="${weiss ? "#f4efe2" : "#2b2320"}" stroke="#000" stroke-opacity=".3" stroke-width=".1"/><circle cx="${r(x)}" cy="${r(y - hh * 0.8)}" r="${r(w * 0.6)}" fill="${weiss ? "#f4efe2" : "#2b2320"}"/>`; };
  const stellung = [[3, 7, 0, 1], [4, 7, 0, 1], [0, 6, 0, 0], [1, 6, 0, 0], [5, 6, 0, 0], [6, 5, 0, 0], [7, 6, 0, 0], [4, 4, 0, 0], [2, 5, 0, 1], [3, 3, 1, 0], [4, 3, 1, 0], [5, 2, 1, 1], [0, 1, 1, 0], [1, 1, 1, 0], [6, 1, 1, 0], [7, 1, 1, 0], [3, 0, 1, 1], [4, 0, 1, 1]];
  stellung.sort((p, q) => q[1] - p[1]).forEach(([u, v, w, g]) => { k += fig(u, v, w, g); });
  /* Schachuhr daneben */
  const [ux, uy] = P(xc + a / 2 + 0.2, dc, h);
  k += `<path d="M${r(ux - 3.4)} ${r(uy)} L${r(ux - 3)} ${r(uy - 3.4)} L${r(ux + 3)} ${r(uy - 3.4)} L${r(ux + 3.4)} ${r(uy)} Z" fill="#6b3c1d"/><circle cx="${r(ux - 1.5)}" cy="${r(uy - 1.7)}" r="1.1" fill="#f4f4f0"/><circle cx="${r(ux + 1.5)}" cy="${r(uy - 1.7)}" r="1.1" fill="#f4f4f0"/><rect x="${r(ux - 2)}" y="${r(uy - 4.2)}" width="1" height=".8" fill="#c9a227"/>`;
  const [ax, ay] = P(xc, d0 + 0.2, h);
  S.teil({ oben: true, id: "schachbrett", de: "das Schachbrett", syl: "SCHACH-brett", it: "la scacchiera", itSyl: "scac-CHIE-ra", en: "chessboard", x: ax, y: ay, kunst: abs(ax, ay, k),
    tipp: "Ein Schachbrett hat 64 Felder, 32 helle und 32 dunkle." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/sport.js"));
console.log(aus);
