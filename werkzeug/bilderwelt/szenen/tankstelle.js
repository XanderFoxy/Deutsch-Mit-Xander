#!/usr/bin/env node
/* =====================================================================
   DIE TANKSTELLE (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   XANDER (Funk 263/286): jeder Ort „identisch mit seinem Original“, alle
   Stationen logisch, jedes Ding einzeln antippbar, nichts blockiert.

   RECHERCHE (Tankstellenmarkt Deutschland, DIN EN 13012 Zapfventile,
   Aufbau einer Tankstelle):
   - Über den TANKINSELN ein großes flaches VORDACH mit hellen Leuchten,
     getragen von wenigen Stützen. Auf jeder Insel eine ZAPFSÄULE mit
     Anzeige (Betrag, Liter, Preis je Liter), Sortenschildern (Super E5,
     Super E10, Diesel) und mehreren SCHLÄUCHEN mit ZAPFPISTOLEN.
   - Auf der Insel: MÜLLEIMER, EIMER mit Wasser und Abzieher für die
     Scheiben, FEUERLÖSCHER an der Stütze.
   - Am Rand der PREISMAST (hohe Stele mit den Literpreisen), die
     LUFTSTATION (Luftdruck prüfen), eine LADESÄULE für Elektroautos,
     die WASCHANLAGE mit Bürsten und Ampel.
   - Im SHOP (Glasfront) zahlt man an der KASSE beim KASSIERER: „Säule
     drei, bitte.“
   - Der FAHRER tankt selbst: TANKDECKEL auf, Zapfpistole hinein.
   Perspektive: Zwei-Fluchtpunkt-Ansicht, die Kamera steht neben der
   Tankinsel und schaut 20° nach rechts; Augenhöhe 1,6 m, Brennweite 300.
   Maßstab: Fahrer in 11,6 m Abstand ≈ 26 Einheiten je Meter.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "tankstelle", titel: "Die Tankstelle", emoji: "⛽", thema: "Unterwegs", kuerzel: "b06e", fassung: 852 });
const rnd = zufall(5150);
const r = B.r;

/* ---------- Projektion mit Gierwinkel, Zuschnitt am Bildrand --------- */
const F = 300, AUGE = 1.6, VX = 160, VY = 100, TH = 20 * Math.PI / 180, CO = Math.cos(TH), SI = Math.sin(TH);
const zc = (X, Z) => X * SI + Z * CO;
const P = (X, Z, H = 0) => { const xc = X * CO - Z * SI, z = zc(X, Z); return [r(VX + xc * F / z), r(VY + (AUGE - H) * F / z)]; };
const M = (X, Z) => F / zc(X, Z);
const RX0 = -0.5, RX1 = 320.5, RY0 = -0.5, RY1 = 200.5;
function rahmen(pts) {
  const kanten = [[(p) => p[0] >= RX0, (a, b) => [RX0, a[1] + (b[1] - a[1]) * (RX0 - a[0]) / (b[0] - a[0])]],
    [(p) => p[0] <= RX1, (a, b) => [RX1, a[1] + (b[1] - a[1]) * (RX1 - a[0]) / (b[0] - a[0])]],
    [(p) => p[1] >= RY0, (a, b) => [a[0] + (b[0] - a[0]) * (RY0 - a[1]) / (b[1] - a[1]), RY0]],
    [(p) => p[1] <= RY1, (a, b) => [a[0] + (b[0] - a[0]) * (RY1 - a[1]) / (b[1] - a[1]), RY1]]];
  let q = pts;
  for (const [drin, schnitt] of kanten) {
    const n = [];
    for (let i = 0; i < q.length; i++) {
      const a = q[i], b = q[(i + 1) % q.length];
      if (drin(a)) { n.push(a); if (!drin(b)) n.push(schnitt(a, b)); } else if (drin(b)) n.push(schnitt(a, b));
    }
    q = n;
    if (!q.length) break;
  }
  return q.map((p) => [r(p[0]), r(p[1])]);
}
const poly = (pts, fill, extra = "") => { const q = rahmen(pts); return q.length < 3 ? "" : `<path d="M${q.map((p) => p.join(" ")).join(" L")} Z" fill="${fill}"${extra}/>`; };
function linie(a, b, farbe, w, extra = "") {
  let t0 = 0, t1 = 1; const dx = b[0] - a[0], dy = b[1] - a[1];
  for (const [p, q] of [[-dx, a[0] - RX0], [dx, RX1 - a[0]], [-dy, a[1] - RY0], [dy, RY1 - a[1]]]) {
    if (p === 0) { if (q < 0) return ""; continue; }
    const t = q / p; if (p < 0) t0 = Math.max(t0, t); else t1 = Math.min(t1, t);
  }
  if (t0 > t1) return "";
  return `<line x1="${r(a[0] + dx * t0)}" y1="${r(a[1] + dy * t0)}" x2="${r(a[0] + dx * t1)}" y2="${r(a[1] + dy * t1)}" stroke="${farbe}" stroke-width="${w}"${extra}/>`;
}
const fX = (X, Z0, Z1, H0, H1) => [P(X, Z0, H1), P(X, Z1, H1), P(X, Z1, H0), P(X, Z0, H0)];
const fZ = (Z, X0, X1, H0, H1) => [P(X0, Z, H1), P(X1, Z, H1), P(X1, Z, H0), P(X0, Z, H0)];
const boden = (X0, X1, Z0, Z1, H = 0) => [P(X0, Z0, H), P(X1, Z0, H), P(X1, Z1, H), P(X0, Z1, H)];
const T = (x, y, s, txt, fill, anchor = "start", w = "normal", fam = "Arial,Helvetica,sans-serif") =>
  `<text x="${r(x)}" y="${r(y)}" font-size="${s}" text-anchor="${anchor}" fill="${fill}" font-family="${fam}" font-weight="${w}">${txt}</text>`;
const absolut = (x, y, svg) => `<g transform="translate(${r(-x)} ${r(-y)})">${svg}</g>`;
const kasten = (pts) => { const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]); return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]; };
/* Text auf einer Fläche bei festem Z (Leserichtung +X) */
const textZ = (Z, X0, X1, H, hoehe, txt, farbe, w = "bold") => {
  const a = P(X0, Z, H), b = P(X1, Z, H), L = 40, h = hoehe * M((X0 + X1) / 2, Z) / 7;
  return `<text transform="matrix(${r((b[0] - a[0]) / L * 100) / 100} ${r((b[1] - a[1]) / L * 100) / 100} 0 ${r(h * 100) / 100} ${a[0]} ${a[1]})" font-size="7" textLength="${L}" lengthAdjust="spacingAndGlyphs" fill="${farbe}" font-family="Arial" font-weight="${w}">${txt}</text>`;
};
const mische = (c, z, t) => { const a = parseInt(c.slice(1), 16), b = parseInt(z.slice(1), 16); const k = (s) => Math.round(((a >> s) & 255) * (1 - t) + ((b >> s) & 255) * t); return "#" + ((1 << 24) + (k(16) << 16) + (k(8) << 8) + k(0)).toString(16).slice(1); };

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("wolke")}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.4"/></filter>`);
const STAHL = S.lg("stahl", [[0, "#eef1f3"], [0.45, "#c9cfd4"], [0.55, "#b5bcc2"], [1, "#e1e5e8"]], 0, 0, 1, 0);
const ROT = "#c8281e", BLAU = "#1f4f9c";

/* Lage der Dinge (Meter) */
const INSEL = { X0: 0.8, X1: 6.2, Z0: 9.6, Z1: 10.4 };
const AUTO = { X0: 3.5, L: 4.45, Z: 11.3, W: 1.8 };
const DACH = { X0: -1, X1: 12.5, Z0: 6.0, Z1: 16.0, H: 5.0 };

/* =====================================================================
   KULISSE — Himmel, Bäume, Straße, Vorplatz (Beton)
   ===================================================================== */
{
  let k = `<rect width="320" height="${VY + 2}" fill="${S.lg("himmel", [[0, "#6aa6dc"], [0.7, "#acd0ec"], [1, "#e3eef4"]])}"/>`;
  for (const [x, y, w] of [[60, 22, 26], [150, 12, 30], [250, 30, 22], [300, 10, 18], [110, 48, 16]]) k += `<ellipse cx="${x}" cy="${y}" rx="${w}" ry="${r(w * 0.24)}" fill="#fff" opacity=".85" filter="url(#${S.id("wolke")})"/>`;
  let baum = `M0 ${VY + 2}`;
  for (let x = 0; x <= 320; x += 5) baum += ` L${x} ${r(VY - 8 - rnd() * 9)}`;
  k += `<path d="${baum} L320 ${VY + 2} Z" fill="#4f7a45"/>`;
  baum = `M0 ${VY + 2}`;
  for (let x = 0; x <= 320; x += 4) baum += ` L${x} ${r(VY - 3 - rnd() * 4)}`;
  k += `<path d="${baum} L320 ${VY + 2} Z" fill="#3e6537"/>`;
  /* Vorplatz: Betonplatten mit Fugen */
  k += `<rect x="0" y="${VY}" width="320" height="${200 - VY}" fill="${S.lg("platz", [[0, "#a7a7a2"], [1, "#c4c3bd"]])}"/>`;
  for (let X = -10; X < 40; X += 3) k += linie(P(X, Math.max(3, (0.8 - X * SI) / CO + 0.5)), P(X, 60), "#9a9a95", ".3");
  for (let Z = 4; Z < 60; Z += 3) k += linie(P(Math.max(-15, (0.8 - Z * CO) / SI), Z), P(40, Z), "#9a9a95", r(Math.min(0.4, 3 / Z)));
  for (let i = 0; i < 10; i++) { const X = 1 + rnd() * 8, Z = 9 + rnd() * 6, p = P(X, Z); k += `<ellipse cx="${p[0]}" cy="${p[1]}" rx="${r(1.5 + rnd() * 3)}" ry="${r(0.5 + rnd() * 0.8)}" fill="#55534e" opacity=".22"/>`; }
  S.hinten(k);
}

/* =====================================================================
   1 — DIE WASCHANLAGE (rechts hinten, Bürsten, Ampel)
   ===================================================================== */
{
  const X0 = 10.5, X1 = 15.2, Z0 = 19.5, Z1 = 28, H = 4.3;
  let k = poly(fX(X0, Z0, Z1, 0, H), S.lg("waschseite", [[0, "#dfe3e6"], [1, "#b9c0c6"]]));
  k += poly(fZ(Z0, X0, X1, 0, H), "#eef1f3");
  k += poly(fZ(Z0, X0, X1, H - 0.9, H), BLAU);
  k += textZ(Z0, X0 + 0.5, X1 - 0.5, H - 0.25, 0.55, "WASCHANLAGE", "#fff");
  /* Einfahrt mit Bürsten (blau, rot), dahinter Dunkel */
  k += poly(fZ(Z0, X0 + 0.5, X1 - 0.5, 0, 3.0), "#2a3036");
  for (const [X, f] of [[X0 + 1.1, "#2f74c0"], [X1 - 1.1, "#c4271f"]]) {
    const a = P(X - 0.35, Z0 + 0.6, 2.9), b = P(X + 0.35, Z0 + 0.6, 0.1);
    k += `<rect x="${a[0]}" y="${a[1]}" width="${r(b[0] - a[0])}" height="${r(b[1] - a[1])}" rx="${r((b[0] - a[0]) / 2)}" fill="${f}"/>`;
    for (let y = a[1] + 1.2; y < b[1]; y += 1.6) k += `<line x1="${a[0]}" y1="${r(y)}" x2="${b[0]}" y2="${r(y + 0.6)}" stroke="#fff" stroke-width=".35" opacity=".35"/>`;
  }
  { const a = P(X0 + 1.4, Z0 + 1.2, 2.6), b = P(X1 - 1.4, Z0 + 1.2, 2.25); k += `<rect x="${a[0]}" y="${a[1]}" width="${r(b[0] - a[0])}" height="${r(b[1] - a[1])}" rx="${r((b[1] - a[1]) / 2)}" fill="#2f74c0"/>`; }
  /* Ampel: grün */
  { const c = P(X0 + 0.25, Z0 - 0.05, 2.2), m = M(X0, Z0); k += `<rect x="${r(c[0] - 0.12 * m)}" y="${r(c[1] - 0.3 * m)}" width="${r(0.24 * m)}" height="${r(0.6 * m)}" rx=".6" fill="#1d1f22"/><circle cx="${c[0]}" cy="${r(c[1] - 0.15 * m)}" r="${r(0.07 * m)}" fill="#5a1d1a"/><circle cx="${c[0]}" cy="${r(c[1] + 0.15 * m)}" r="${r(0.07 * m)}" fill="#3cf06a"/>`; }
  const f = P((X0 + X1) / 2, Z0);
  k = poly(boden(X0 - 0.3, X1 + 0.3, Z0 - 0.4, Z0, 0.003), "#000", ` opacity=".15"`) + k;
  S.teil({ id: "tk_waschanlage", de: "die Waschanlage", syl: "WASCH-an-la-ge", it: "l'autolavaggio", itSyl: "au-to-la-VAG-gio", en: "car wash", x: f[0], y: f[1], steht: true, kunst: absolut(f[0], f[1], k),
    tipp: "Bei Grün fährt man hinein. Die Bürsten waschen das Auto." });
}

/* =====================================================================
   2 — DER PREISMAST (Preistafel hoch am Mast, rechts)
   ===================================================================== */
{
  const X = 22, Z = 24, m = M(X, Z), p = P(X, Z);
  let k = schatten(0, 0, 0.8 * m, 0.15 * m, 0.25);
  k += `<rect x="${r(-0.35 * m)}" y="${r(-4.0 * m)}" width="${r(0.7 * m)}" height="${r(4.0 * m)}" fill="${S.lg("mast", [[0, "#9aa3aa"], [0.5, "#e1e5e8"], [1, "#7d868d"]], 0, 0, 1, 0)}"/>`;
  const x0 = -0.9 * m, w = 1.8 * m, y0 = -6.9 * m, h = 3.1 * m;
  k += `<rect x="${r(x0)}" y="${r(y0)}" width="${r(w)}" height="${r(h)}" rx="1" fill="#f6f7f8" stroke="#9aa3aa" stroke-width=".4"/>`;
  k += `<rect x="${r(x0)}" y="${r(y0)}" width="${r(w)}" height="${r(0.8 * m)}" rx="1" fill="${ROT}"/>` + T(0, y0 + 0.56 * m, r(0.42 * m), "AutoPunkt", "#fff", "middle", "bold");
  const preise = [["Super E5", "1,85", "#2f8a4a"], ["Super E10", "1,79", "#2f8a4a"], ["Diesel", "1,69", "#1d1f22"]];
  preise.forEach(([t, pr, f], i) => {
    const y = y0 + (1.05 + i * 0.68) * m;
    k += `<rect x="${r(x0 + 0.08 * m)}" y="${r(y)}" width="${r(0.72 * m)}" height="${r(0.52 * m)}" rx=".4" fill="${f}"/>` + T(x0 + 0.44 * m, y + 0.33 * m, r(0.15 * m), t, "#fff", "middle", "bold");
    k += `<rect x="${r(x0 + 0.86 * m)}" y="${r(y)}" width="${r(0.86 * m)}" height="${r(0.52 * m)}" rx=".4" fill="#111"/>` + T(x0 + 1.6 * m, y + 0.41 * m, r(0.31 * m), pr, "#ffb21e", "end", "bold", "monospace") + T(x0 + 1.6 * m, y + 0.2 * m, r(0.14 * m), "9", "#ffb21e", "start", "bold", "monospace");
  });
  S.teil({ id: "tk_preistafel_tk", de: "die Preistafel", syl: "PREIS-ta-fel", it: "il listino prezzi", itSyl: "li-STI-no PREZ-zi", en: "price board", x: p[0], y: p[1], steht: true, kunst: k,
    tipp: "Die Preise ändern sich oft — sogar mehrmals am Tag." });
}

/* =====================================================================
   3 — DER SHOP (Glasfront, Theke) — Lupe: Kasse, Regal, Kaffee
   ===================================================================== */
const SHOP = { X0: -5, X1: 7.5, Z: 22.5, H: 3.9 };
{
  const { X0, X1, Z, H } = SHOP;
  let k = poly(fZ(Z, X0, X1, 0, H + 0.6), "#e9e6df");
  /* Innenraum durch die Scheiben: Rückwand mit Regalen, Theke, Licht */
  k += poly(fZ(Z + 0.02, X0 + 0.3, X1 - 0.3, 0.05, H - 0.4), S.lg("innen", [[0, "#fbf3df"], [1, "#e7d6b4"]]));
  for (const [X, w] of [[-1.7, 2.6], [3.3, 2.4], [X1 - 2.6, 2.3]]) {
    for (let i = 0; i < 4; i++) {
      const h0 = 0.3 + i * 0.55;
      k += poly(fZ(Z + 0.01, X, X + w, h0, h0 + 0.05), "#9aa3aa");
      for (let j = 0; j < 9; j++) { const xx = X + 0.1 + j * (w - 0.2) / 9; k += poly(fZ(Z + 0.01, xx, xx + (w - 0.2) / 10, h0 + 0.05, h0 + 0.33 + (j % 3) * 0.05), ["#c4271f", "#2f74c0", "#f2c230", "#3ca35a", "#e0802e", "#7a4fa0"][(i * 9 + j) % 6]); }
    }
  }
  /* Theke mit KASSE (rechts im Laden) */
  const th = [-1.4, 1.1];
  k += poly(fZ(Z - 0.02, th[0], th[1], 0, 1.0), S.lg("theke", [[0, "#8a5a30"], [1, "#6b4322"]]));
  k += poly(fZ(Z - 0.03, th[0] - 0.05, th[1] + 0.05, 0.98, 1.06), "#d9d4c8");
  const ka = P(th[0] + 0.55, Z - 0.04, 1.06), m = M(th[0], Z);
  k += `<rect x="${r(ka[0] - 0.2 * m)}" y="${r(ka[1] - 0.42 * m)}" width="${r(0.44 * m)}" height="${r(0.3 * m)}" rx=".4" fill="#1d2125"/><rect x="${r(ka[0] - 0.17 * m)}" y="${r(ka[1] - 0.39 * m)}" width="${r(0.38 * m)}" height="${r(0.22 * m)}" fill="#2f74c0"/><rect x="${r(ka[0] - 0.24 * m)}" y="${r(ka[1] - 0.1 * m)}" width="${r(0.5 * m)}" height="${r(0.1 * m)}" fill="#3b4148"/>`;
  /* Kaffeeautomat an der Wand */
  const kf = P(2.95, Z + 0.01, 1.0);
  k += `<rect x="${r(kf[0] - 0.25 * m)}" y="${r(kf[1] - 0.8 * m)}" width="${r(0.5 * m)}" height="${r(0.8 * m)}" rx=".5" fill="#2b2f33"/><rect x="${r(kf[0] - 0.17 * m)}" y="${r(kf[1] - 0.7 * m)}" width="${r(0.34 * m)}" height="${r(0.16 * m)}" fill="#e0802e"/><rect x="${r(kf[0] - 0.1 * m)}" y="${r(kf[1] - 0.3 * m)}" width="${r(0.2 * m)}" height="${r(0.15 * m)}" fill="#f6f1df"/>`;
  /* Glasfront: Pfosten, Schiebetür, Spiegelung */
  for (let X = X0; X <= X1 + 0.01; X += 1.25) k += poly(fZ(Z - 0.05, X - 0.05, X + 0.05, 0, H - 0.4), "#59636c");
  k += poly(fZ(Z - 0.05, X0, X1, H - 0.45, H - 0.35), "#59636c");
  k += poly(fZ(Z - 0.06, X0 + 3.75, X0 + 6.25, 0, 2.3), "none", ` stroke="#3b4148" stroke-width=".6"`);
  k += poly([P(X0 + 0.5, Z - 0.06, 0.2), P(X0 + 1.4, Z - 0.06, H - 0.5), P(X0 + 1.9, Z - 0.06, H - 0.5), P(X0 + 1.0, Z - 0.06, 0.2)], "#fff", ` opacity=".18"`);
  k += poly([P(X1 - 3.0, Z - 0.06, 0.2), P(X1 - 2.4, Z - 0.06, H - 0.5), P(X1 - 2.1, Z - 0.06, H - 0.5), P(X1 - 2.7, Z - 0.06, 0.2)], "#fff", ` opacity=".14"`);
  /* Blende mit Schriftzug */
  k += poly(fZ(Z - 0.08, X0 - 0.2, X1 + 0.2, H - 0.35, H + 0.6), S.lg("blende", [[0, "#d63a2e"], [1, "#a8231d"]]));
  k += textZ(Z - 0.09, -2.3, 1.6, H - 0.02, 0.62, "AutoPunkt", "#fff");
  k += textZ(Z - 0.09, 3.6, 6.6, H - 0.02, 0.5, "SHOP 24 h", "#ffe28a");
  const f = P((X0 + X1) / 2, Z);
  const un = (id, de, syl, it, itSyl, en, b, tipp) => { const cx = r((b[0] + b[2]) / 2); return { id, de, syl, it, itSyl, en, tipp, x: cx, y: r(b[3]), kunst: flaeche(b[0] - cx, b[1] - b[3], b[2] - b[0], b[3] - b[1]) }; };
  const kb = [ka[0] - 0.26 * m, ka[1] - 0.46 * m, ka[0] + 0.28 * m, ka[1] + 0.02 * m];
  const unter = [
    un("tk_kasse_tk", "die Kasse", "KAS-se", "la cassa", "CAS-sa", "till", kb, "„Säule drei, bitte.“ — An der Kasse zahlt man das Benzin."),
    un("tk_regal", "das Regal", "re-GAL", "lo scaffale", "scaf-FA-le", "shelf", kasten(fZ(Z, -1.7, -0.9, 1.1, 2.3)), "Im Regal gibt es Getränke, Süßes und Öl fürs Auto."),
    un("tk_kaffeeautomat", "der Kaffeeautomat", "KAF-fee-au-to-mat", "la macchinetta del caffè", "mac-chi-NET-ta del caf-FÈ", "coffee machine", [kf[0] - 0.27 * m, kf[1] - 0.82 * m, kf[0] + 0.27 * m, kf[1]], null),
  ];
  k = poly(boden(X0, X1, Z - 0.5, Z, 0.003), "#000", ` opacity=".12"`) + k;
  S.teil({ id: "tk_shop", de: "der Shop", syl: "SHOP", it: "il negozio", itSyl: "ne-GO-zio", en: "shop", x: f[0], y: f[1], steht: true, kunst: absolut(f[0], f[1], k),
    zoom: { x: 14, y: 62, w: 96, h: 64 }, unter,
    tipp: "Im Shop kann man auch Brötchen, Kaffee und Zeitungen kaufen." });
}

/* =====================================================================
   4 — DER KASSIERER (hinter der Theke im Shop)
   ===================================================================== */
{
  const X = 0.45, Z = SHOP.Z + 0.3, p = P(X, Z);
  const m = B.mensch({ id: "tk_kass", geschlecht: "m", pose: "stehen", blick: 10, frisur: "kurz", haarfarbe: "schwarz", haut: "mittel",
    kleidung: { oberteil: { stueck: "hemd", farbe: "rot" }, unterteil: { stueck: "hose", farbe: "schwarz" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" } } }, 1.76 * M(X, Z));
  /* Theke verdeckt die Beine: nur der Teil über der Theke ist zu sehen */
  const cut = P(X, SHOP.Z - 0.02, 1.0)[1] - p[1];
  S.def(`<clipPath id="${S.id("kassclip")}"><rect x="-30" y="-80" width="60" height="${r(80 + cut)}"/></clipPath>`);
  S.teil({ id: "tk_kassierer", de: "der Kassierer", syl: "Kas-SIE-rer", it: "il cassiere", itSyl: "cas-SIE-re", en: "cashier", x: p[0], y: p[1], kunst: `<g clip-path="url(#${S.id("kassclip")})">${m.svg}</g>`,
    tipp: "Er fragt: „Welche Säule?“" });
}

/* =====================================================================
   5 — DAS VORDACH mit Stützen und Leuchten
   ===================================================================== */
{
  const { X0, X1, Z0, Z1, H } = DACH;
  let k = poly([P(X0, Z0, H), P(X1, Z0, H), P(X1, Z1, H), P(X0, Z1, H)], S.lg("dachunten", [[0, "#e9ecee"], [1, "#d0d5d9"]]));
  for (let X = X0 + 1; X < X1; X += 1.5) k += linie(P(X, Z0, H), P(X, Z1, H), "#bcc3c8", ".4");
  /* LED-Leuchten im Raster */
  for (let Z = Z0 + 1.5; Z < Z1; Z += 2.5) for (let X = X0 + 1.2; X < X1 - 0.5; X += 2.6) k += poly([P(X, Z, H - 0.01), P(X + 0.7, Z, H - 0.01), P(X + 0.7, Z + 0.7, H - 0.01), P(X, Z + 0.7, H - 0.01)], "#fffef4");
  /* Blende innen (hinten und links sichtbar) */
  k += poly(fZ(Z1, X0, X1, H, H + 0.85), S.lg("blendeinnen", [[0, "#c9cfd4"], [1, "#e1e5e8"]]));
  k += poly(fZ(Z1 + 0.01, X0, X1, H + 0.6, H + 0.85), ROT);
  k += poly(fX(X0, Z0, Z1, H, H + 0.85), "#c4cacf");
  /* Stützen auf den Inseln */
  for (const [X, Z] of [[INSEL.X0 + 0.15, 10.0], [11.2, 10.0]]) {
    const m = M(X, Z), b = P(X, Z), t = P(X, Z, H);
    k += poly([[b[0] - 0.2 * m, t[1]], [b[0] + 0.2 * m, t[1]], [b[0] + 0.2 * m, b[1]], [b[0] - 0.2 * m, b[1]]], S.lg("stuetze", [[0, "#9aa3aa"], [0.5, "#eef1f3"], [1, "#8d969e"]], 0, 0, 1, 0));
    k += `<rect x="${r(b[0] - 0.2 * m)}" y="${r(b[1] - 1.1 * m)}" width="${r(0.4 * m)}" height="${r(0.25 * m)}" fill="${ROT}"/>`;
  }
  const f = P((X0 + X1) / 2, Z1, H);
  S.teil({ id: "tk_vordach", de: "das Vordach", syl: "VOR-dach", it: "la pensilina", itSyl: "pen-si-LI-na", en: "canopy", x: f[0], y: f[1], kunst: absolut(f[0], f[1], k),
    tipp: "Unter dem Vordach tankt man auch bei Regen trocken." });
}

/* =====================================================================
   6 — DIE LADESÄULE (Strom für Elektroautos, links vorne)
   ===================================================================== */
{
  const X = -0.9, Z = 8.3, m = M(X, Z), p = P(X, Z);
  let k = schatten(0, 0, 0.45 * m, 0.1 * m, 0.3);
  k += `<rect x="${r(-0.28 * m)}" y="${r(-1.75 * m)}" width="${r(0.56 * m)}" height="${r(1.75 * m)}" rx="1.4" fill="${S.lg("lade", [[0, "#f4f6f7"], [1, "#c9d0d6"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${r(-0.28 * m)}" y="${r(-1.75 * m)}" width="${r(0.56 * m)}" height="${r(0.22 * m)}" rx="1.4" fill="#2f8a4a"/>`;
  k += `<path d="M${r(-0.05 * m)} ${r(-1.71 * m)} l${r(0.08 * m)} 0 l${r(-0.05 * m)} ${r(0.08 * m)} l${r(0.06 * m)} 0 l${r(-0.12 * m)} ${r(0.11 * m)} l${r(0.04 * m)} ${r(-0.08 * m)} l${r(-0.05 * m)} 0 Z" fill="#fff"/>`;
  k += `<rect x="${r(-0.2 * m)}" y="${r(-1.42 * m)}" width="${r(0.4 * m)}" height="${r(0.3 * m)}" rx=".4" fill="#0d2436"/>` + T(0, -1.24 * m, r(0.1 * m), "22 kW", "#7cff8a", "middle", "bold");
  k += `<circle cx="${r(-0.08 * m)}" cy="${r(-0.92 * m)}" r="${r(0.07 * m)}" fill="#2b2f33"/><path d="M${r(-0.08 * m)} ${r(-0.86 * m)} q${r(-0.25 * m)} ${r(0.5 * m)} ${r(0.05 * m)} ${r(0.8 * m)} q${r(0.3 * m)} ${r(0.1 * m)} ${r(0.25 * m)} ${r(-0.5 * m)}" stroke="#1d1f22" stroke-width="${r(0.05 * m)}" fill="none"/>`;
  k += `<rect x="${r(-0.25 * m)}" y="${r(-1.7 * m)}" width="${r(0.06 * m)}" height="${r(1.6 * m)}" fill="#fff" opacity=".5"/>`;
  S.teil({ id: "tk_ladesaeule", de: "die Ladesäule", syl: "LA-de-säu-le", it: "la colonnina di ricarica", itSyl: "co-lon-NI-na di ri-CA-ri-ca", en: "charging station", x: p[0], y: p[1], steht: true, kunst: k,
    tipp: "Hier tanken Elektroautos Strom." });
}

/* =====================================================================
   7 — DAS AUTO (an der Säule, Seite zur Kamera) — Lupe: Tankdeckel,
       Reifen, Scheibenwischer
   ===================================================================== */
{
  const { X0, L, Z, W } = AUTO;
  const farbe = "#a8322a", lack = (t) => mische(farbe, t > 0 ? "#ffffff" : "#000000", Math.abs(t));
  const pz = (x, h, z = Z) => P(X0 + x, z, h);
  let k = poly([P(X0 - 0.1, Z - 0.1), P(X0 + L + 0.1, Z - 0.1), P(X0 + L + 0.1, Z + W), P(X0 - 0.1, Z + W)], "#111", ` opacity=".45" filter="url(#bw_weich)"`);
  /* Heck (zur Kamera schräg sichtbar) */
  k += poly([P(X0, Z, 0.95), P(X0, Z + W, 0.95), P(X0, Z + W, 0.3), P(X0, Z, 0.3)], lack(-0.2));
  k += poly([P(X0, Z + 0.05, 0.85), P(X0, Z + 0.45, 0.85), P(X0, Z + 0.45, 0.68), P(X0, Z + 0.05, 0.68)], "#c4271f");
  k += poly([P(X0, Z + W - 0.45, 0.85), P(X0, Z + W - 0.05, 0.85), P(X0, Z + W - 0.05, 0.68), P(X0, Z + W - 0.45, 0.68)], "#c4271f");
  k += poly([P(X0 + 0.35, Z + 0.15, 0.97), P(X0 + 0.35, Z + W - 0.15, 0.97), P(X0 + 1.0, Z + W - 0.2, 1.4), P(X0 + 1.0, Z + 0.2, 1.4)], `url(#${S.id("autoglas")})`);
  /* Dach und Haube von oben */
  k += poly([pz(1.0, 1.42, Z + 0.15), pz(L - 2.0, 1.43, Z + 0.15), pz(L - 2.0, 1.43, Z + W - 0.15), pz(1.0, 1.42, Z + W - 0.15)], lack(0.2));
  k += poly([pz(0, 0.95, Z + 0.05), pz(0.35, 0.97, Z + 0.1), pz(0.35, 0.97, Z + W - 0.1), pz(0, 0.95, Z + W - 0.05)], lack(0.1));
  /* Seite: Profil einer Kompaktlimousine */
  const prof = [[0, 0.32], [0, 0.72], [0.06, 0.95], [0.35, 0.98], [1.0, 1.42], [L - 2.0, 1.44], [L - 1.2, 0.98], [L - 0.15, 0.86], [L, 0.72], [L, 0.32]];
  k += poly(prof.map(([x, h]) => pz(x, h)), S.lg("autoseite", [[0, lack(0.25)], [0.5, farbe], [1, lack(-0.35)]]));
  k += poly([pz(0.05, 0.5), pz(L - 0.05, 0.5), pz(L - 0.05, 0.32), pz(0.05, 0.32)], lack(-0.45));
  const fe = [[1.08, 1.0], [1.12, 1.36], [L - 2.05, 1.38], [L - 1.32, 1.0]];
  k += poly(fe.map(([x, h]) => pz(x, h)), `url(#${S.id("autoglas")})`);
  k += linie(pz(2.25, 1.0), pz(2.2, 1.38), lack(-0.4), "1.2");
  k += poly([pz(1.2, 1.02), pz(1.25, 1.33), pz(1.6, 1.34), pz(1.4, 1.02)], "#fff", ` opacity=".14"`);
  /* Türfugen, Griffe, Zierleiste */
  for (const x of [2.25, 3.35]) k += linie(pz(x, 0.42), pz(x - 0.04, 0.98), lack(-0.45), ".5");
  for (const x of [1.95, 3.05]) { const a = pz(x, 0.88), b = pz(x + 0.22, 0.88); k += linie(a, b, lack(-0.5), "1.1"); }
  k += linie(pz(0.2, 0.78), pz(L - 0.2, 0.8), lack(0.35), ".4", ` opacity=".7"`);
  /* TANKDECKEL offen (rechts hinten) */
  const td = pz(0.55, 0.83);
  k += `<ellipse cx="${td[0]}" cy="${td[1]}" rx="2.3" ry="2.6" fill="#2b2f33"/><circle cx="${td[0]}" cy="${td[1]}" r="1.1" fill="#6d757c"/>`;
  k += `<path d="M${r(td[0] - 2.3)} ${r(td[1] - 2.4)} L${r(td[0] - 5.6)} ${r(td[1] - 1.8)} L${r(td[0] - 5.6)} ${r(td[1] + 2.2)} L${r(td[0] - 2.3)} ${r(td[1] + 2.6)} Z" fill="${lack(-0.15)}" stroke="${lack(-0.5)}" stroke-width=".3"/>`;
  /* Räder */
  const rad = (x) => {
    const c = pz(x, 0.32), a = pz(x - 0.32, 0.32), rx = Math.abs(c[0] - a[0]), ry = 0.32 * M(X0 + x, Z);
    return `<ellipse cx="${c[0]}" cy="${c[1]}" rx="${r(rx * 1.18)}" ry="${r(ry * 1.15)}" fill="${lack(-0.6)}"/><ellipse cx="${c[0]}" cy="${c[1]}" rx="${r(rx)}" ry="${r(ry)}" fill="#141516"/><ellipse cx="${c[0]}" cy="${c[1]}" rx="${r(rx * 0.62)}" ry="${r(ry * 0.62)}" fill="${S.rg("felge", [[0, "#eef1f3"], [1, "#8d969e"]])}"/>` +
      Array.from({ length: 5 }, (_, i) => { const w = i * 2 * Math.PI / 5; return `<line x1="${c[0]}" y1="${c[1]}" x2="${r(c[0] + Math.cos(w) * rx * 0.55)}" y2="${r(c[1] + Math.sin(w) * ry * 0.55)}" stroke="#7d868d" stroke-width=".7"/>`; }).join("") + `<ellipse cx="${c[0]}" cy="${c[1]}" rx="${r(rx * 0.16)}" ry="${r(ry * 0.16)}" fill="#3b4148"/>`;
  };
  const rx1 = 0.85, rx2 = L - 0.95;
  k += rad(rx1) + rad(rx2);
  /* Scheinwerfer vorn (Ecke), Spiegel, SCHEIBENWISCHER auf der Frontscheibe */
  k += poly([pz(L - 0.02, 0.76), pz(L - 0.4, 0.8), pz(L - 0.42, 0.7), pz(L - 0.02, 0.66)], "#eef5fb", ` stroke="#7d868d" stroke-width=".3"`);
  { const a = pz(L - 2.05, 1.05), b = pz(L - 1.85, 1.12); k += `<rect x="${r(Math.min(a[0], b[0]) - 1)}" y="${r(b[1] - 2.2)}" width="${r(Math.abs(b[0] - a[0]) + 2.4)}" height="2.6" rx=".8" fill="${lack(-0.15)}"/>`; }
  const sw = [pz(L - 1.3, 1.02, Z + 0.3), pz(L - 1.75, 1.32, Z + 0.55)];
  k += linie(sw[0], sw[1], "#15181b", ".9");
  k += poly([pz(L - 1.2, 0.99, Z + 0.15), pz(L - 2.0, 1.42, Z + 0.25), pz(L - 2.0, 1.42, Z + W - 0.25), pz(L - 1.2, 0.99, Z + W - 0.15)], `url(#${S.id("autoglas")})`, ` opacity=".85"`);
  k += linie(sw[0], sw[1], "#15181b", ".9");
  /* Lupe */
  const un = (id, de, syl, it, itSyl, en, b, tipp) => { const cx = r((b[0] + b[2]) / 2); return { id, de, syl, it, itSyl, en, tipp, x: cx, y: r(b[3]), kunst: flaeche(b[0] - cx, b[1] - b[3], b[2] - b[0], b[3] - b[1]) }; };
  const r2 = pz(rx2, 0.32), r2a = pz(rx2 - 0.4, 0), r2b = pz(rx2 + 0.4, 0.7);
  const unter = [
    un("tk_tankdeckel", "der Tankdeckel", "TANK-de-ckel", "lo sportello del serbatoio", "spor-TEL-lo del ser-ba-TO-io", "fuel cap", [td[0] - 6, td[1] - 3.4, td[0] + 3, td[1] + 3.4], "Erst den Tankdeckel öffnen, dann die Zapfpistole hinein."),
    un("tk_reifen", "der Reifen", "REI-fen", "lo pneumatico", "pneu-MA-ti-co", "tyre", [Math.min(r2a[0], r2b[0]), r2b[1], Math.max(r2a[0], r2b[0]), r2a[1]], "Den Luftdruck der Reifen prüft man an der Luftstation."),
    un("tk_scheibenwischer", "der Scheibenwischer", "SCHEI-ben-wi-scher", "il tergicristallo", "ter-gi-cri-STAL-lo", "windscreen wiper", [Math.min(sw[0][0], sw[1][0]) - 2, Math.min(sw[0][1], sw[1][1]) - 1.5, Math.max(sw[0][0], sw[1][0]) + 2, Math.max(sw[0][1], sw[1][1]) + 1.5], "Der Scheibenwischer wischt bei Regen die Scheibe frei."),
  ];
  const f = pz(L / 2, 0);
  S.teil({ id: "tk_auto_tk", de: "das Auto", syl: "AU-to", it: "l'automobile", itSyl: "au-to-MO-bi-le", en: "car", x: f[0], y: f[1], steht: true, kunst: absolut(f[0], f[1], k),
    zoom: { x: 140, y: 92, w: 108, h: 72 }, unter,
    tipp: "Erst Motor aus, dann tanken." });
}
S.def(`<linearGradient id="${S.id("autoglas")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5f7686"/><stop offset=".55" stop-color="#2a3843"/><stop offset="1" stop-color="#3d505e"/></linearGradient>`);

/* =====================================================================
   8 — DIE ZAPFSÄULE auf der Insel — Lupe: Anzeige, Schlauch
   ===================================================================== */
const SAEULE = { X: 2.4, Z: 10.0, B: 1.15, T: 0.5, H: 2.0 };
let schlauchEnde = null;
{
  const { X0, X1, Z0, Z1 } = INSEL;
  /* Inselsockel mit gelb-schwarzem Anfahrschutz (als Teil der Säule gezeichnet) */
  let k = poly([P(X0, Z0, 0.16), P(X1, Z0, 0.16), P(X1, Z1, 0.16), P(X0, Z1, 0.16)], "#d9d6cf");
  k += poly(fZ(Z0, X0, X1, 0, 0.16), "#b9b5ad");
  k += poly(fX(X0, Z0, Z1, 0, 0.16), "#a9a59d");
  for (const X of [X0 + 0.1, X1 - 0.1]) { const a = P(X, Z0 + 0.1, 0.16), m = M(X, Z0); k += `<rect x="${r(a[0] - 0.06 * m)}" y="${r(a[1] - 0.8 * m)}" width="${r(0.12 * m)}" height="${r(0.8 * m)}" fill="#f2c230"/><rect x="${r(a[0] - 0.06 * m)}" y="${r(a[1] - 0.55 * m)}" width="${r(0.12 * m)}" height="${r(0.15 * m)}" fill="#1d1f22"/><rect x="${r(a[0] - 0.06 * m)}" y="${r(a[1] - 0.25 * m)}" width="${r(0.12 * m)}" height="${r(0.15 * m)}" fill="#1d1f22"/>`; }
  /* Säulenkörper */
  const { X, Z, B: Bw, T: Td, H } = SAEULE, xa = X - Bw / 2, xb = X + Bw / 2, za = Z - Td / 2;
  k += poly(fX(xa, za, za + Td, 0.16, H), "#b5bcc2");
  k += poly(fZ(za, xa, xb, 0.16, H), S.lg("saeule", [[0, "#f4f6f7"], [0.6, "#e3e7ea"], [1, "#c9d0d6"]], 0, 0, 1, 0));
  k += poly(fZ(za - 0.01, xa, xb, H - 0.32, H), ROT);
  k += textZ(za - 0.02, xa + 0.15, xb - 0.15, H - 0.1, 0.2, "AutoPunkt", "#fff");
  /* Anzeige: Betrag, Liter, Preis */
  const an = fZ(za - 0.02, xa + 0.15, xb - 0.15, 1.35, 1.65);
  k += poly(an, "#0d1a14");
  { const a = an[0], b = an[2], w = b[0] - a[0], h = b[1] - a[1];
    k += T(a[0] + w * 0.08, a[1] + h * 0.42, r(h * 0.3), "EUR", "#7cff8a") + T(b[0] - w * 0.06, a[1] + h * 0.42, r(h * 0.36), "62,41", "#7cff8a", "end", "bold", "monospace");
    k += T(a[0] + w * 0.08, a[1] + h * 0.88, r(h * 0.3), "Liter", "#7cff8a") + T(b[0] - w * 0.06, a[1] + h * 0.88, r(h * 0.36), "34,86", "#7cff8a", "end", "bold", "monospace"); }
  /* Säulennummer und Sortenwahl */
  { const c = P(X, za - 0.02, 1.2), m = M(X, za); k += `<circle cx="${c[0]}" cy="${c[1]}" r="${r(0.09 * m)}" fill="${BLAU}"/>` + T(c[0], c[1] + 0.05 * m, r(0.13 * m), "3", "#fff", "middle", "bold"); }
  const sorten = [["E5", "#2f8a4a"], ["E10", "#2f8a4a"], ["D", "#1d1f22"]];
  sorten.forEach(([t, f], i) => { const a = P(xa + 0.15 + i * 0.3, za - 0.02, 1.05), b = P(xa + 0.4 + i * 0.3, za - 0.02, 0.88); k += `<rect x="${a[0]}" y="${a[1]}" width="${r(b[0] - a[0])}" height="${r(b[1] - a[1])}" rx=".4" fill="${f}"/>` + T((a[0] + b[0]) / 2, b[1] - (b[1] - a[1]) * 0.28, r((b[1] - a[1]) * 0.55), t, "#fff", "middle", "bold"); });
  /* Zapfpistolen im Halter (links) und der Schlauch zur Pistole des Fahrers */
  for (let i = 0; i < 2; i++) { const a = P(xa - 0.02, za + 0.1 + i * 0.16, 1.0); k += `<path d="M${a[0]} ${a[1]} l-1.4 0 l-.6 2.6 l1.2 0 Z" fill="${i ? "#1d1f22" : "#2f8a4a"}"/>`; }
  for (let i = 0; i < 2; i++) { const a = P(xa, za + 0.1 + i * 0.16, 1.0), b = P(xa - 0.05, za + 0.1 + i * 0.16, 0.4); k += `<path d="M${a[0]} ${a[1]} Q${r(b[0] - 3)} ${r(b[1] + 2)} ${r(b[0] + 1)} ${r(b[1] - 6)}" stroke="#1d1f22" stroke-width=".8" fill="none"/>`; }
  k += `<rect x="${r(P(xa, za, 1.3)[0] + 1)}" y="${r(P(xa, za, H - 0.4)[1])}" width="1" height="${r(P(xa, za, 0.4)[1] - P(xa, za, H - 0.4)[1])}" fill="#fff" opacity=".35"/>`;
  /* Feuerlöscher-Kasten an der Säulenseite fällt weg: der Feuerlöscher steht an der Stütze */
  schlauchEnde = P(xb + 0.02, za + 0.2, 1.55);
  const f = P(X, Z0);
  S.teil({ id: "tk_zapfsaeule", de: "die Zapfsäule", syl: "ZAPF-säu-le", it: "la colonnina", itSyl: "co-lon-NI-na", en: "petrol pump", x: f[0], y: f[1], steht: true, kunst: absolut(f[0], f[1], k),
    zoom: { x: P(xa, za)[0] - 6, y: P(X, za, H)[1] - 4, w: 54, h: 36 },
    unter: [
      { id: "tk_anzeige", de: "die Anzeige", syl: "AN-zei-ge", it: "il display", itSyl: "di-SPLAY", en: "display", ...(() => { const b = kasten(an), cx = r((b[0] + b[2]) / 2); return { x: cx, y: r(b[3]), kunst: flaeche(b[0] - cx, b[1] - b[3], b[2] - b[0], b[3] - b[1]) }; })(), tipp: "Die Anzeige zeigt Liter und Euro — sie läuft beim Tanken mit." },
      { id: "tk_sorte", de: "die Sorte", syl: "SOR-te", it: "il tipo di carburante", itSyl: "TI-po di car-bu-RAN-te", en: "fuel type", ...(() => { const b = kasten([P(xa + 0.15, za, 1.05), P(xa + 1.0, za, 0.88)]), cx = r((b[0] + b[2]) / 2); return { x: cx, y: r(b[3]), kunst: flaeche(b[0] - cx, b[1] - b[3], b[2] - b[0], b[3] - b[1]) }; })(), tipp: "Super oder Diesel? Die falsche Sorte schadet dem Motor." },
    ],
    tipp: "Säule 3: Hier tankt man Super E5, Super E10 oder Diesel." });
}

/* =====================================================================
   9 — DER MÜLLEIMER, 10 — DER EIMER, 11 — DER FEUERLÖSCHER (Insel)
   ===================================================================== */
{
  const X = INSEL.X0 + 0.75, Z = INSEL.Z0 + 0.3, m = M(X, Z), p = P(X, Z, 0.16);
  let k = schatten(0, 0, 0.25 * m, 0.06 * m, 0.3);
  k += `<rect x="${r(-0.2 * m)}" y="${r(-0.85 * m)}" width="${r(0.4 * m)}" height="${r(0.85 * m)}" rx="1" fill="${S.lg("muell", [[0, "#5b636b"], [0.5, "#9aa3aa"], [1, "#4a525b"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${r(-0.22 * m)} ${r(-0.85 * m)} Q0 ${r(-1.05 * m)} ${r(0.22 * m)} ${r(-0.85 * m)} Z" fill="#3b4148"/><rect x="${r(-0.12 * m)}" y="${r(-0.75 * m)}" width="${r(0.24 * m)}" height="${r(0.08 * m)}" fill="#1d1f22"/>`;
  S.teil({ id: "tk_muelleimer_tk", de: "der Mülleimer", syl: "MÜLL-ei-mer", it: "il cestino", itSyl: "ce-STI-no", en: "bin", x: p[0], y: p[1], steht: true, kunst: k });
}
{
  const X = INSEL.X0 + 1.2, Z = INSEL.Z0 + 0.25, m = M(X, Z), p = P(X, Z, 0.16);
  let k = `<path d="M${r(-0.16 * m)} ${r(-0.34 * m)} L${r(0.16 * m)} ${r(-0.34 * m)} L${r(0.13 * m)} 0 L${r(-0.13 * m)} 0 Z" fill="${S.lg("eimer", [[0, "#2f74c0"], [1, "#1f4f9c"]], 0, 0, 1, 0)}"/>`;
  k += `<ellipse cx="0" cy="${r(-0.34 * m)}" rx="${r(0.16 * m)}" ry="${r(0.04 * m)}" fill="#9fd0ee"/>`;
  k += `<line x1="${r(-0.02 * m)}" y1="${r(-0.3 * m)}" x2="${r(0.1 * m)}" y2="${r(-0.75 * m)}" stroke="#1d1f22" stroke-width="${r(0.03 * m)}"/><rect x="${r(-0.1 * m)}" y="${r(-0.38 * m)}" width="${r(0.2 * m)}" height="${r(0.05 * m)}" rx=".3" fill="#1d1f22"/>`;
  S.teil({ oben: true, id: "tk_eimer", de: "der Eimer", syl: "EI-mer", it: "il secchio", itSyl: "SEC-chio", en: "bucket", x: p[0], y: p[1], steht: true, kunst: k + flaeche(-0.17 * m, -0.78 * m, 0.34 * m, 0.78 * m),
    tipp: "Im Eimer ist Wasser mit einem Abzieher für die Scheiben." });
}
{
  const X = INSEL.X0 + 0.15, Z = 9.78, m = M(X, Z), p = P(X, Z, 0.75);
  let k = `<rect x="${r(-0.08 * m)}" y="${r(-0.5 * m)}" width="${r(0.16 * m)}" height="${r(0.5 * m)}" rx="1" fill="${S.lg("loescher", [[0, "#e0403a"], [1, "#a8231d"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${r(-0.05 * m)}" y="${r(-0.58 * m)}" width="${r(0.1 * m)}" height="${r(0.09 * m)}" fill="#2b2f33"/><rect x="${r(-0.07 * m)}" y="${r(-0.34 * m)}" width="${r(0.14 * m)}" height="${r(0.1 * m)}" fill="#fff" opacity=".85"/>`;
  S.teil({ oben: true, id: "tk_feuerloescher", de: "der Feuerlöscher", syl: "FEU-er-lö-scher", it: "l'estintore", itSyl: "e-stin-TO-re", en: "fire extinguisher", x: p[0], y: p[1], kunst: k,
    tipp: "An jeder Tankstelle hängt ein Feuerlöscher griffbereit." });
}

/* =====================================================================
   12 — DER FAHRER (tankt) und 13 — DIE ZAPFPISTOLE mit Schlauch
   ===================================================================== */
let pistole = null;
{
  const X = AUTO.X0 + 0.0, Z = 10.85, p = P(X, Z);
  const m = B.mensch({ id: "tk_fahrer", geschlecht: "m", pose: "servieren", blick: 72, frisur: "kurz", haarfarbe: "grau", haut: "hell",
    kleidung: { oberteil: { stueck: "hemd", farbe: "weiss" }, jacke: { stueck: "jacke", farbe: "#2a3f5f" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "halbschuh", farbe: "braun" } } }, 1.8 * M(X, Z));
  const hand = [m.z.handL, m.z.handR].filter(Boolean).sort((a, b) => (a.y != null ? a.y : a[1]) - (b.y != null ? b.y : b[1]))[0];
  if (hand) pistole = [p[0] + (hand.x != null ? hand.x : hand[0]) * m.k, p[1] + (hand.y != null ? hand.y : hand[1]) * m.k];
  S.teil({ id: "tk_fahrer", de: "der Fahrer", syl: "FAH-rer", it: "il conducente", itSyl: "con-du-CEN-te", en: "driver", x: p[0], y: p[1], kunst: m.svg,
    tipp: "Er tankt selbst — an deutschen Tankstellen ist das normal." });
}
{
  /* Pistole von der Hand bis in den Tankstutzen; Schlauch hängt zur Säule */
  const h = pistole || [160, 120], td = P(AUTO.X0 + 0.55, AUTO.Z, 0.83), se = schlauchEnde;
  let k = `<path d="M${se[0]} ${se[1]} Q${r((se[0] + h[0]) / 2)} ${r(Math.max(se[1], h[1]) + 22)} ${r(h[0] - 1)} ${r(h[1] + 1.5)}" stroke="#1d1f22" stroke-width="1.1" fill="none"/>`;
  k += `<path d="M${r(h[0] - 1.6)} ${r(h[1] - 1.2)} L${r(h[0] + 2.2)} ${r(h[1] - 1.8)} L${r(td[0] - 0.6)} ${r(td[1] - 0.3)} L${r(td[0] - 0.4)} ${r(td[1] + 0.5)} L${r(h[0] + 2.2)} ${r(h[1] + 0.2)} L${r(h[0] + 0.4)} ${r(h[1] + 2.6)} L${r(h[0] - 1.4)} ${r(h[1] + 2.2)} Z" fill="#2f8a4a" stroke="#1b5a2f" stroke-width=".25"/>`;
  k += `<path d="M${r(h[0] + 0.6)} ${r(h[1] + 0.4)} q.8 1.6 -.6 1.8" stroke="#c9cfd4" stroke-width=".5" fill="none"/>`;
  const x0 = Math.min(h[0] - 2, td[0] - 1), x1 = Math.max(h[0] + 3, td[0] + 1), y0 = Math.min(h[1], td[1]) - 3, y1 = Math.max(h[1], td[1]) + 4;
  S.teil({ oben: true, id: "tk_zapfpistole", de: "die Zapfpistole", syl: "ZAPF-pis-to-le", it: "la pistola di rifornimento", itSyl: "pi-STO-la di ri-for-ni-MEN-to", en: "nozzle", x: r(h[0]), y: r(h[1]), kunst: absolut(r(h[0]), r(h[1]), k + flaeche(x0, y0, x1 - x0, y1 - y0)),
    tipp: "Die Zapfpistole schaltet von selbst ab, wenn der Tank voll ist." });
}

/* =====================================================================
   14 — DER LUFTDRUCK (Luftstation mit Schlauch, vorne links)
   ===================================================================== */
{
  const X = 7.3, Z = 7.7, m = M(X, Z), p = P(X, Z);
  let k = schatten(0, 0, 0.4 * m, 0.1 * m, 0.3);
  k += `<rect x="${r(-0.06 * m)}" y="${r(-1.1 * m)}" width="${r(0.12 * m)}" height="${r(1.1 * m)}" fill="#5b636b"/>`;
  k += `<rect x="${r(-0.24 * m)}" y="${r(-1.55 * m)}" width="${r(0.48 * m)}" height="${r(0.5 * m)}" rx="1.6" fill="${S.lg("luft", [[0, "#3a8fd0"], [1, "#1f5fa0"]], 0, 0, 1, 0)}"/>`;
  k += `<circle cx="0" cy="${r(-1.32 * m)}" r="${r(0.15 * m)}" fill="#fbfbf7" stroke="#1d1f22" stroke-width=".4"/>`;
  for (let i = 0; i < 9; i++) { const w = (-130 + i * 32.5) * Math.PI / 180; k += `<line x1="${r(Math.sin(w) * 0.12 * m)}" y1="${r(-1.32 * m - Math.cos(w) * 0.12 * m)}" x2="${r(Math.sin(w) * 0.1 * m)}" y2="${r(-1.32 * m - Math.cos(w) * 0.1 * m)}" stroke="#222" stroke-width=".3"/>`; }
  k += `<line x1="0" y1="${r(-1.32 * m)}" x2="${r(0.07 * m)}" y2="${r(-1.4 * m)}" stroke="#c4271f" stroke-width=".5"/>` + T(0, -1.11 * m, r(0.07 * m), "LUFT", "#fff", "middle", "bold");
  k += `<rect x="${r(-0.18 * m)}" y="${r(-1.13 * m)}" width="${r(0.12 * m)}" height="${r(0.06 * m)}" rx=".3" fill="#2b2f33"/><rect x="${r(0.06 * m)}" y="${r(-1.13 * m)}" width="${r(0.12 * m)}" height="${r(0.06 * m)}" rx=".3" fill="#2b2f33"/>`;
  k += `<path d="M${r(0.2 * m)} ${r(-1.2 * m)} q${r(0.4 * m)} ${r(0.3 * m)} ${r(0.25 * m)} ${r(0.9 * m)} q${r(-0.15 * m)} ${r(0.35 * m)} ${r(-0.45 * m)} ${r(0.25 * m)}" stroke="#1d1f22" stroke-width="${r(0.04 * m)}" fill="none"/>`;
  k += `<rect x="${r(-0.27 * m)}" y="${r(-0.15 * m)}" width="${r(0.12 * m)}" height="${r(0.08 * m)}" rx=".3" fill="#1d1f22"/>`;
  S.teil({ id: "tk_luftdruck", de: "der Luftdruck", syl: "LUFT-druck", it: "la pressione delle gomme", itSyl: "pres-SIO-ne delle GOM-me", en: "tyre pressure", x: p[0], y: p[1], steht: true, kunst: k,
    tipp: "An der Luftstation prüft man den Luftdruck der Reifen — kostenlos." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/tankstelle.js"));
console.log(aus);
