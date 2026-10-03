#!/usr/bin/env node
/* =====================================================================
   DER SPIELPLATZ (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (DIN EN 1176/1177 „Spielplatzgeräte und Spielplatzböden“,
   TÜV-Spielplatzprüfung, Fachartikel „Fallschutz auf Spielplätzen“):
   - Ein öffentlicher Spielplatz ist EINGEZÄUNT (meist grüner Doppel-
     stabmattenzaun) und hat ein TOR, das von selbst zufällt. Am Eingang
     hängt das SCHILD „Spielplatz“ mit Regeln: für Kinder bis 14 Jahre,
     Hunde verboten, Rauchen verboten.
   - Unter allen Geräten mit Fallhöhe liegt FALLSCHUTZ: geprüfter
     RINDENMULCH (Holzschnitzel) oder gewaschener Sand, 30–40 cm tief.
   - Typische Geräte: SPIELTURM aus Robinienholz mit Dach, LEITER und
     Edelstahl-RUTSCHE; Doppel-SCHAUKEL mit Brettsitz und NESTSCHAUKEL;
     Balken-WIPPE mit Reifen als Puffer; WIPPTIER auf einer Feder;
     SANDKASTEN mit Holzrahmen (Eimer, Schaufel, Förmchen).
   - Am Rand: BANK für die Eltern, MÜLLEIMER, Bäume für Schatten.
   BLICK: vom vorderen Rasen über den Sandkasten zum Zaun, Augenhöhe
   1,6 m. Maßstab: Zaun 16 Einheiten je Meter (11 m entfernt), vorn am
   Sandkasten ≈ 65 je Meter.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "spielplatz", titel: "Der Spielplatz", emoji: "🛝", thema: "Freizeit", kuerzel: "b10d", fassung: 852 });
const rnd = zufall(1176);
const r = B.r;

/* ---------- Kamera ---------------------------------------------------- */
const HY = 66.4, E = 1.6, D = 11, S0 = 16, VX = 160;
const sk = (z) => S0 * D / (D - z);
const P = (X, H, z) => [r(VX + X * sk(z)), r(HY + (E - H) * sk(z))];
const poly = (pts, fill, extra = "") => `<path d="M${pts.map((p) => p[0] + " " + p[1]).join(" L")} Z" fill="${fill}"${extra ? " " + extra : ""}/>`;
const um = (ox, oy, svg) => `<g transform="translate(${r(-ox)} ${r(-oy)})">${svg}</g>`;
const linie = (a, b, farbe, w, extra = "") => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${farbe}" stroke-width="${r(w)}"${extra}/>`;
/* Vieleck am Bildrand (x = 0 … 320) abschneiden */
function clipX(pts) {
  let out = pts;
  for (const [g, innen] of [[0, (x) => x >= 0], [320, (x) => x <= 320]]) {
    const a = out; out = [];
    for (let i = 0; i < a.length; i++) {
      const p = a[i], q = a[(i + 1) % a.length], pi = innen(p[0]), qi = innen(q[0]);
      if (pi) out.push(p);
      if (pi !== qi) { const t = (g - p[0]) / (q[0] - p[0]); out.push([g, r(p[1] + t * (q[1] - p[1]))]); }
    }
  }
  return out;
}
const ring = (X, z, R, H = 0, n = 32, Rz = R) => Array.from({ length: n }, (_, i) => { const a = i / n * Math.PI * 2; return P(X + Math.cos(a) * R, H, z + Math.sin(a) * Rz); });
/* Figuren schlanker: Koordinaten auf halbe Zentimeter runden (unsichtbar
   bei dieser Größe, spart ein Drittel der Datei – die Seite lädt schneller) */
const h2 = (n) => String(Math.round(parseFloat(n) * 2) / 2);
const schlank = (svg) => svg.replace(/( d=")([^"]*)"/g, (a, b, c) => b + c.replace(/-?\d*\.\d+/g, h2) + '"')
  .replace(/ (cx|cy|x1|y1|x2|y2|x|y)="(-?\d*\.\d+)"/g, (a, b, c) => ` ${b}="${h2(c)}"`)
  .replace(/ (r|rx|ry|width|height)="(\d*\.\d+)"/g, (a, b, c) => ` ${b}="${parseFloat(c) < 1.5 ? c : h2(c)}"`);
const figur = (spec, hoehe) => { const m = B.mensch(spec, hoehe); return { svg: `<g transform="scale(${m.k.toFixed(4)})">${schlank(m.z.svg)}</g>`, k: m.k, z: m.z }; };

/* ---------- Haltungen ------------------------------------------------- */
B.mensch({}, 10);
const MP = globalThis.DMA_MENSCH.POSEN;
MP.b10d_buddeln = Object.assign({}, MP.knien, { lende: 10, brust: 10, nacken: 10, kopf: 8,
  schulterR: { vor: 48, seit: 12 }, ellbogenR: 30, unterarmR: -30, handR: 0, fingerR: 0.7,
  schulterL: { vor: 30, seit: 16 }, ellbogenL: 36, unterarmL: -40, handL: 0, fingerL: 0.4 });

/* ---------- Grundfarben ---------------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const HOLZ = S.lg("robinie", [[0, "#b98a52"], [0.5, "#a77840"], [1, "#8c6232"]], 0, 0, 1, 0);
const STAHL = S.lg("stahl", [[0, "#f2f4f5"], [0.4, "#c9cfd4"], [0.6, "#a9b1b8"], [1, "#e1e5e8"]]);
const ZAUNGRUEN = "#2f5a3e";
S.def(`<pattern id="${S.id("mulch")}" width="4" height="2.4" patternUnits="userSpaceOnUse"><rect width="4" height="2.4" fill="#8a5c34"/><rect x=".3" y=".4" width="1.4" height=".5" rx=".2" fill="#a8723f"/><rect x="2.2" y="1.4" width="1.2" height=".45" rx=".2" fill="#6e4524"/><rect x="1.6" y=".1" width=".9" height=".4" rx=".2" fill="#b98652"/><rect x=".8" y="1.6" width=".8" height=".4" rx=".2" fill="#5f3a1e"/></pattern>`);
S.def(`<pattern id="${S.id("sand")}" width="3" height="2" patternUnits="userSpaceOnUse"><rect width="3" height="2" fill="#e6cf9c"/><circle cx=".6" cy=".5" r=".25" fill="#d4b97f"/><circle cx="2.1" cy="1.4" r=".2" fill="#f2e2b8"/><circle cx="1.5" cy=".9" r=".15" fill="#c9ab70"/></pattern>`);
S.def(`<pattern id="${S.id("gras")}" width="3" height="2" patternUnits="userSpaceOnUse"><rect width="3" height="2" fill="#77a94e"/><path d="M.4 2 l.2 -1 M1.4 2 l-.1 -1.2 M2.4 2 l.25 -.9" stroke="#8fc062" stroke-width=".3"/><path d="M.9 2 l-.2 -.8 M2 2 l.1 -.7" stroke="#5f8f3c" stroke-width=".3"/></pattern>`);
const MULCH = `url(#${S.id("mulch")})`, SAND = `url(#${S.id("sand")})`, GRAS = `url(#${S.id("gras")})`;

/* =====================================================================
   KULISSE — Himmel, Wohnhäuser, Hecke, Rasen
   ===================================================================== */
{
  let k = `<rect x="0" y="0" width="320" height="${HY + 2}" fill="${S.lg("himmel", [[0, "#6fb2e6"], [0.7, "#bfe0f5"], [1, "#e8f4fb"]])}"/>`;
  for (const [cx, cy, s] of [[48, 14, 1], [205, 9, 1.3], [292, 24, 0.8]]) k += `<g opacity=".92"><ellipse cx="${cx}" cy="${cy}" rx="${r(14 * s)}" ry="${r(4 * s)}" fill="#fff"/><ellipse cx="${r(cx - 6 * s)}" cy="${r(cy - 2.6 * s)}" rx="${r(7 * s)}" ry="${r(4.4 * s)}" fill="#fff"/><ellipse cx="${r(cx + 5 * s)}" cy="${r(cy - 3.4 * s)}" rx="${r(8 * s)}" ry="${r(5 * s)}" fill="#fff"/><ellipse cx="${cx}" cy="${r(cy + 2)}" rx="${r(13 * s)}" ry="${r(2 * s)}" fill="#dfeaf2"/></g>`;
  /* Wohnhäuser hinter dem Spielplatz */
  const haus = (X0, X1, Hh, farbe, dach) => {
    const z = -14, [x0, y0] = P(X0, Hh, z), [x1, yb] = P(X1, 0, z), s = sk(z);
    let g = `<rect x="${x0}" y="${y0}" width="${r(x1 - x0)}" height="${r(yb - y0)}" fill="${farbe}"/>`;
    g += `<path d="M${r(x0 - 1)} ${y0} L${r((x0 + x1) / 2)} ${r(y0 - 2.2 * s)} L${r(x1 + 1)} ${y0} Z" fill="${dach}"/>`;
    for (let f = 0; f < 3; f++) for (let i = 0; i < Math.floor((X1 - X0) / 1.6); i++) g += `<rect x="${r(x0 + 2 + i * 1.6 * s)}" y="${r(y0 + 3 + f * 2.9 * s)}" width="${r(0.9 * s)}" height="${r(1.2 * s)}" fill="#a9c4d6"/><rect x="${r(x0 + 2 + i * 1.6 * s)}" y="${r(y0 + 3 + f * 2.9 * s + 1.2 * s)}" width="${r(0.9 * s)}" height=".5" fill="#fff" opacity=".7"/>`;
    return g;
  };
  k += haus(-26, -12, 9.5, "#e8d8bf", "#9a4a36") + haus(-8, 6, 10.5, "#efe6d6", "#7d3d2e") + haus(10, 26, 9, "#dcc9b0", "#9a4a36");
  /* ferne Bäume und Hecke hinter dem Zaun */
  for (let i = 0; i < 24; i++) { const X = -14 + i * 1.25 + rnd() * 0.6, [cx, cy] = P(X, 2.4 + rnd() * 1.5, -1.5), rr = (1.2 + rnd() * 0.8) * sk(-1.5); k += `<circle cx="${cx}" cy="${cy}" r="${r(rr)}" fill="${["#4f7f3a", "#5c8e42", "#456f33"][i % 3]}"/>`; }
  k += `<rect x="0" y="${r(P(0, 1.5, -0.6)[1])}" width="320" height="${r(P(0, 0, -0.6)[1] - P(0, 1.5, -0.6)[1] + 1)}" rx="3" fill="${S.lg("hecke", [[0, "#5b8f3e"], [1, "#3f6f2c"]])}"/>`;
  for (let i = 0; i < 60; i++) { const [cx, cy] = P(-11 + i * 0.37, 1.45, -0.6); k += `<circle cx="${cx}" cy="${cy}" r="${r(1.5 + rnd())}" fill="${rnd() < 0.5 ? "#68a047" : "#4c7f35"}"/>`; }
  /* Rasen */
  const yR = P(0, 0, -0.6)[1];
  k += `<rect x="0" y="${yR}" width="320" height="${r(200 - yR)}" fill="${GRAS}"/>`;
  k += `<rect x="0" y="${yR}" width="320" height="${r(200 - yR)}" fill="${S.lg("rasenlicht", [[0, "#2f5a1e", 0.25], [0.3, "#2f5a1e", 0], [1, "#fff", 0.08]])}"/>`;
  /* Gänseblümchen im Rasen vorn */
  for (let i = 0; i < 34; i++) { const [cx, cy] = P(-3 + rnd() * 6, 0, 6 + rnd() * 2.8); if (cy < 120) continue; const q = sk(6 + (cy - 120) / 20) / 60; k += `<circle cx="${cx}" cy="${cy}" r="${r(0.9 * q)}" fill="#fff"/><circle cx="${cx}" cy="${cy}" r="${r(0.35 * q)}" fill="#f6c434"/>`; }
  /* Pflasterweg vom Tor zum Sandkasten */
  k += poly([P(-0.45, 0, 0.05), P(0.45, 0, 0.05), P(0.6, 0, 6.5), P(-0.6, 0, 6.5)], "#b9b4aa");
  for (let z = 0.3; z < 6.5; z += 0.3) k += linie(P(-0.46 - z * 0.022, 0, z), P(0.46 + z * 0.022, 0, z), "#8f8a80", 0.25, ' opacity=".7"');
  S.hinten(k);
}

/* =====================================================================
   1 — DER ZAUN (Doppelstabmatten, grün) mit 2 — DEM TOR und 3 — SCHILD
   ===================================================================== */
const TOR = { X0: -0.6, X1: 0.6 };
{
  let k = "";
  const H = 1.2, [, y0] = P(0, H, 0), [, yb] = P(0, 0, 0), s = sk(0);
  S.def(`<pattern id="${S.id("stab")}" width="${r(0.2 * s)}" height="10" patternUnits="userSpaceOnUse"><rect x="0" width=".55" height="10" fill="${ZAUNGRUEN}"/></pattern>`);
  for (const [a, b] of [[-9.98, TOR.X0 - 0.05], [TOR.X1 + 0.05, 9.98]]) {
    const [xa] = P(a, 0, 0), [xb] = P(b, 0, 0);
    k += `<rect x="${xa}" y="${y0}" width="${r(xb - xa)}" height="${r(yb - y0)}" fill="url(#${S.id("stab")})"/>`;
    for (const t of [0.08, 0.92]) k += `<rect x="${xa}" y="${r(y0 + (yb - y0) * t - 0.5)}" width="${r(xb - xa)}" height="1" fill="${ZAUNGRUEN}"/>`;
  }
  for (let X = -9.5; X <= 9.5; X += 2.5) { if (X > TOR.X0 - 0.3 && X < TOR.X1 + 0.3) continue; const [px] = P(X, 0, 0); k += `<rect x="${r(px - 0.8)}" y="${r(y0 - 1)}" width="1.6" height="${r(yb - y0 + 1)}" fill="#24452f"/>`; }
  const [ax, ay] = P(5, 0, 0);
  S.teil({ id: "sp_zaun", de: "der Zaun", syl: "ZAUN", it: "la recinzione", itSyl: "re-cin-ZIO-ne", en: "fence", x: ax, y: ay, kunst: um(ax, ay, k),
    tipp: "Der Zaun schützt die Kinder: So laufen sie nicht auf die Straße." });
}
{
  const [x0, y0] = P(TOR.X0, 1.2, 0), [x1, yb] = P(TOR.X1, 0, 0);
  let k = "";
  for (const x of [x0, x1]) k += `<rect x="${r(x - 1.3)}" y="${r(y0 - 3)}" width="2.6" height="${r(yb - y0 + 3)}" fill="#24452f"/>`;
  k += `<rect x="${r(x0 + 1)}" y="${r(y0 + 1)}" width="${r(x1 - x0 - 2)}" height="${r(yb - y0 - 2)}" fill="none" stroke="${ZAUNGRUEN}" stroke-width="1.1"/>`;
  for (let x = x0 + 3; x < x1 - 1.5; x += 2.4) k += `<rect x="${r(x)}" y="${r(y0 + 1.5)}" width=".55" height="${r(yb - y0 - 3)}" fill="${ZAUNGRUEN}"/>`;
  k += `<rect x="${r(x1 - 4.2)}" y="${r((y0 + yb) / 2 - 1.2)}" width="3" height="2.4" rx=".5" fill="#e8c23a"/><rect x="${r(x1 - 3.6)}" y="${r((y0 + yb) / 2 - 0.3)}" width="2.6" height=".7" fill="#333"/>`;
  const [ax, ay] = [r((x0 + x1) / 2), yb];
  S.teil({ id: "sp_tor", de: "das Tor", syl: "TOR", it: "il cancello", itSyl: "can-CEL-lo", en: "gate", x: ax, y: ay, kunst: um(ax, ay, k),
    tipp: "Das Tor fällt von selbst zu." });
}
{
  const [p0] = P(-2.1, 0, 0), [p1] = P(-1.3, 0, 0), [, yb] = P(0, 0, 0), [, yt] = P(0, 2.3, 0);
  const [bx0, by0] = P(-2.2, 2.3, 0), [bx1, by1] = P(-1.2, 1.32, 0);
  const w = bx1 - bx0, h = by1 - by0;
  let k = "";
  for (const x of [p0, p1]) k += `<rect x="${r(x - 0.6)}" y="${yt}" width="1.2" height="${r(yb - yt)}" fill="${STAHL}"/>`;
  k += `<rect x="${bx0}" y="${by0}" width="${r(w)}" height="${r(h)}" rx=".6" fill="#fff" stroke="#2f8a3e" stroke-width="1"/>`;
  /* Piktogramm: Kind auf der Rutsche */
  const cx = bx0 + w / 2, cy = by0 + 4;
  k += `<path d="M${r(cx - 4)} ${r(cy + 2)} L${r(cx + 3)} ${r(cy - 2.4)} M${r(cx - 4)} ${r(cy + 2)} h-1.2" stroke="#2f8a3e" stroke-width=".8" fill="none"/><circle cx="${r(cx + 0.8)}" cy="${r(cy - 2.6)}" r=".9" fill="#2f8a3e"/><path d="M${r(cx + 0.6)} ${r(cy - 1.6)} l-2.2 2 l2 .6" stroke="#2f8a3e" stroke-width=".7" fill="none"/>`;
  k += `<text x="${r(cx)}" y="${r(by0 + 9.4)}" font-size="2.7" text-anchor="middle" fill="#2f8a3e" font-family="Arial" font-weight="bold">Spielplatz</text>`;
  k += `<text x="${r(cx)}" y="${r(by0 + 11.6)}" font-size="1.15" text-anchor="middle" fill="#333" font-family="Arial">für Kinder bis 14 Jahre</text>`;
  /* Verbotszeichen: Hund, Zigarette, Glasflasche */
  [["hund", -3.8], ["rauch", 0], ["glas", 3.8]].forEach(([t, dx]) => {
    const ix = cx + dx, iy = by0 + 13.8;
    k += `<circle cx="${r(ix)}" cy="${r(iy)}" r="1.5" fill="#fff" stroke="#c62d22" stroke-width=".4"/>`;
    if (t === "hund") k += `<path d="M${r(ix - 1)} ${r(iy + 0.6)} h1.6 l.3 -1 l.5 .1 v-.4 l-.6 -.2 l-.3 .4 h-1.3 Z" fill="#222"/>`;
    else if (t === "rauch") k += `<rect x="${r(ix - 1)}" y="${r(iy - 0.15)}" width="1.8" height=".4" fill="#222"/><path d="M${r(ix + 0.9)} ${r(iy - 0.4)} q.3 -.4 0 -.8" stroke="#888" stroke-width=".2" fill="none"/>`;
    else k += `<path d="M${r(ix - 0.3)} ${r(iy - 1)} h.6 v.5 q.4 .3 .4 .7 v1 h-1.4 v-1 q0 -.4 .4 -.7 Z" fill="#222"/>`;
    k += `<line x1="${r(ix - 1.05)}" y1="${r(iy - 1.05)}" x2="${r(ix + 1.05)}" y2="${r(iy + 1.05)}" stroke="#c62d22" stroke-width=".4"/>`;
  });
  const [ax, ay] = P(-1.7, 0, 0);
  S.teil({ id: "sp_schild", de: "das Schild", syl: "SCHILD", it: "il cartello", itSyl: "car-TEL-lo", en: "sign", x: ax, y: ay, kunst: um(ax, ay, k),
    tipp: "Auf dem Schild steht: Spielplatz für Kinder bis 14 Jahre. Hunde sind verboten." });
}

/* =====================================================================
   4 — DER BAUM (junge Linde, rechts hinten, spendet Schatten)
   ===================================================================== */
{
  const X = 6.2, z = 1.0, s = sk(z);
  const [bx, by] = P(X, 0, z);
  let k = `<ellipse cx="${bx}" cy="${r(by + 1)}" rx="${r(2.2 * s)}" ry="${r(0.4 * s)}" fill="#2f4a1e" opacity=".22"/>`;
  k += `<path d="M${r(bx - 0.2 * s)} ${by} Q${r(bx - 0.14 * s)} ${r(by - 1.6 * s)} ${r(bx - 0.1 * s)} ${r(by - 2.6 * s)} L${r(bx + 0.12 * s)} ${r(by - 2.6 * s)} Q${r(bx + 0.15 * s)} ${r(by - 1.6 * s)} ${r(bx + 0.24 * s)} ${by} Z" fill="${S.lg("stamm", [[0, "#5a4632"], [0.5, "#7a6248"], [1, "#4a3828"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${bx} ${r(by - 2.3 * s)} L${r(bx - 0.9 * s)} ${r(by - 3.3 * s)} M${bx} ${r(by - 2.4 * s)} L${r(bx + 0.8 * s)} ${r(by - 3.4 * s)}" stroke="#5a4632" stroke-width="${r(0.1 * s)}"/>`;
  /* Krone ganz im Bild (x ≤ 319, y ≥ 1) */
  const blaetter = [[0, -3.9, 1.5, "#4f8a3a"], [-1.3, -3.3, 1.1, "#5c9a44"], [1.2, -3.3, 1.1, "#46803a"], [-0.7, -4.6, 1.05, "#63a24a"], [0.7, -4.6, 1.0, "#5c9a44"], [0, -2.9, 1.0, "#4a8236"]];
  for (const [dx, dy, rr, c] of blaetter) k += `<circle cx="${r(bx + dx * s)}" cy="${r(by + dy * s)}" r="${r(rr * s)}" fill="${c}"/>`;
  for (const [dx, dy, rr] of [[-0.6, -4.9, 0.45], [-1.4, -3.6, 0.4], [0.4, -4.1, 0.4]]) k += `<circle cx="${r(bx + dx * s)}" cy="${r(by + dy * s)}" r="${r(rr * s)}" fill="#8cc466" opacity=".45"/>`;
  S.teil({ id: "sp_baum", de: "der Baum", syl: "BAUM", it: "l'albero", itSyl: "AL-be-ro", en: "tree", x: bx, y: by, kunst: um(bx, by, k),
    tipp: "Unter dem Baum ist im Sommer Schatten." });
}

/* =====================================================================
   5 — DER RINDENMULCH (Fallschutz unter Turm und Schaukel)
   ===================================================================== */
{
  const blob = (X0, X1, z0, z1) => { const pts = []; const n = 28; for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, c = Math.cos(a), si = Math.sin(a); const e = 0.86 + 0.14 * Math.pow(Math.abs(c), 0.3) ; pts.push(P((X0 + X1) / 2 + Math.sign(c) * Math.pow(Math.abs(c), 0.35) * (X1 - X0) / 2 * e, 0, (z0 + z1) / 2 + Math.sign(si) * Math.pow(Math.abs(si), 0.35) * (z1 - z0) / 2)); } return pts; };
  const A = clipX(blob(-8.4, -0.9, 1.1, 4.0)), Bb = clipX(blob(0.85, 5.9, 1.9, 4.6));
  let k = poly(A, MULCH) + poly(Bb, MULCH);
  k += poly(A, "none", 'stroke="#5f3e22" stroke-width=".5" opacity=".6"') + poly(Bb, "none", 'stroke="#5f3e22" stroke-width=".5" opacity=".6"');
  const [ax, ay] = P(3.4, 0, 4.6);
  S.teil({ id: "sp_rindenmulch", de: "der Rindenmulch", syl: "RIN-den-mulch", it: "la corteccia triturata", itSyl: "cor-TEC-cia tri-tu-RA-ta", en: "bark mulch", x: ax, y: ay, steht: true, kunst: um(ax, ay, k),
    tipp: "Der Rindenmulch ist weich: Wer herunterfällt, tut sich nicht so weh." });
}

/* =====================================================================
   6 — DAS KLETTERGERÜST (Spielturm aus Robinie), 7 — LEITER, 8 — RUTSCHE
   ===================================================================== */
const TU = { X0: -6.5, X1: -4.9, z0: 1.5, z1: 3.0, HP: 1.5 };
{
  const { X0, X1, z0, z1, HP } = TU;
  let k = poly([P(X0 - 0.2, 0, z1 + 0.3), P(X1 + 0.4, 0, z1 + 0.3), P(X1 + 0.6, 0, z0), P(X0, 0, z0)], "#000", 'opacity=".18" filter="url(#bw_weich)"');
  const pfosten = (X, z, H1) => linie(P(X, 0, z), P(X, H1, z), HOLZ, 0.14 * sk(z), ' stroke-linecap="round"');
  /* hintere Pfosten */
  k += pfosten(X0, z0, 2.5) + pfosten(X1, z0, 2.5);
  /* Plattform (Bodenbretter, von unten sieht man die Unterseite nicht – Augenhöhe 1,6 m ≈ Plattform) */
  k += poly([P(X0, HP, z1), P(X1, HP, z1), P(X1, HP, z0), P(X0, HP, z0)], "#8c6232");
  k += poly([P(X0, HP - 0.12, z1), P(X1, HP - 0.12, z1), P(X1, HP, z1), P(X0, HP, z1)], "#9a6c3a");
  k += poly([P(X1, HP - 0.12, z1), P(X1, HP - 0.12, z0), P(X1, HP, z0), P(X1, HP, z1)], "#7d5629");
  /* Brüstung hinten und links: Bretter mit Bullauge */
  k += poly([P(X0, HP, z0), P(X1, HP, z0), P(X1, HP + 0.8, z0), P(X0, HP + 0.8, z0)], S.lg("bruest", [[0, "#2f8a3e"], [1, "#22702f"]]));
  { const [cx, cy] = P((X0 + X1) / 2, HP + 0.42, z0); k += `<circle cx="${cx}" cy="${cy}" r="${r(0.22 * sk(z0))}" fill="#8cc6e8" stroke="#1b5a26" stroke-width=".6"/>`; }
  /* Kletterwand vorn unter der Plattform */
  k += poly([P(X0 + 0.05, 0.05, z1), P(X0 + 0.85, 0.05, z1), P(X0 + 0.85, HP - 0.12, z1), P(X0 + 0.05, HP - 0.12, z1)], S.lg("wand", [[0, "#e8c23a"], [1, "#d9a51f"]]));
  for (let i = 0; i < 9; i++) { const [gx, gy] = P(X0 + 0.15 + (i % 3) * 0.28 + (Math.floor(i / 3) % 2) * 0.1, 0.25 + Math.floor(i / 3) * 0.4, z1); k += `<ellipse cx="${gx}" cy="${gy}" rx="1.3" ry="1" fill="${["#d6402f", "#2b5fa8", "#3a9a4c"][i % 3]}"/>`; }
  /* vordere Pfosten */
  k += pfosten(X0, z1, 2.5) + pfosten(X1, z1, 2.5);
  /* Brüstung vorn links (oben), Geländerstäbe */
  k += poly([P(X0, HP + 0.65, z1), P(X0 + 0.85, HP + 0.65, z1), P(X0 + 0.85, HP + 0.8, z1), P(X0, HP + 0.8, z1)], "#22702f");
  for (let i = 1; i < 5; i++) k += linie(P(X0 + i * 0.17, HP, z1), P(X0 + i * 0.17, HP + 0.65, z1), HOLZ, 0.05 * sk(z1));
  /* Dach: Satteldach, rot, First entlang z */
  const xm = (X0 + X1) / 2, HD = 2.4, HF = 3.2;
  k += poly([P(X0 - 0.2, HD, z1 + 0.2), P(xm, HF, z1 + 0.2), P(xm, HF, z0 - 0.2), P(X0 - 0.2, HD, z0 - 0.2)], "#9e2f22");
  k += poly([P(xm, HF, z1 + 0.2), P(X1 + 0.2, HD, z1 + 0.2), P(X1 + 0.2, HD, z0 - 0.2), P(xm, HF, z0 - 0.2)], S.lg("dach", [[0, "#d6503a"], [1, "#b83a2a"]]));
  k += poly([P(X0 - 0.2, HD, z1 + 0.2), P(xm, HF, z1 + 0.2), P(X1 + 0.2, HD, z1 + 0.2), P(X1 + 0.05, HD - 0.08, z1 + 0.2), P(xm, HF - 0.12, z1 + 0.2), P(X0 - 0.05, HD - 0.08, z1 + 0.2)], "#7d2418");
  k += poly([P(X0, HD - 0.08, z1 + 0.19), P(xm, HF - 0.12, z1 + 0.19), P(X1, HD - 0.08, z1 + 0.19)], S.lg("giebel", [[0, "#c79a62"], [1, "#a77840"]]));
  const [ax, ay] = P(xm, 0, z1);
  S.teil({ id: "klettergeruest", de: "das Klettergerüst", syl: "KLET-ter-ge-rüst", it: "il castello da arrampicata", itSyl: "ca-STEL-lo da ar-ram-pi-CA-ta", en: "climbing frame", x: ax, y: ay, steht: true, kunst: um(ax, ay, k),
    tipp: "Am Klettergerüst gibt es eine Kletterwand mit bunten Griffen." });
}
{
  /* Leiter vorn rechts am Turm, schräg angelehnt */
  const { X1, z1, HP } = TU;
  const Xa = X1 - 0.65, Xb = X1 - 0.1, zb = z1 + 0.75;
  let k = "";
  for (const X of [Xa, Xb]) k += linie(P(X, 0, zb), P(X, HP + 0.6, z1), HOLZ, 0.07 * sk(zb), ' stroke-linecap="round"');
  for (let i = 1; i <= 5; i++) { const t = i / 6, H = t * HP, z = zb - t * (zb - z1) * (HP / (HP + 0.6)); k += linie(P(Xa, H, z), P(Xb, H, z), "#8c6232", 0.05 * sk(z)); }
  const [ax, ay] = P((Xa + Xb) / 2, 0, zb);
  S.teil({ oben: true, id: "sp_leiter", de: "die Leiter", syl: "LEI-ter", it: "la scala", itSyl: "SCA-la", en: "ladder", x: ax, y: ay, kunst: um(ax, ay, k) + flaeche(P(Xa, 0, zb)[0] - ax - 1, P(0, HP + 0.6, z1)[1] - ay, P(Xb, 0, zb)[0] - P(Xa, 0, zb)[0] + 2, ay - P(0, HP + 0.6, z1)[1]),
    tipp: "Über die Leiter klettert man auf den Turm." });
}
{
  /* Edelstahlrutsche nach rechts, mit Auslauf */
  const { X1, HP } = TU, zr = 2.25, br = 0.25;
  const bahn = (X) => X <= -1.9 ? HP - (X - X1) / (-1.9 - X1) * (HP - 0.35) : 0.35 - (X + 1.9) * 0.05;
  const xs = []; for (let X = X1; X <= -1.25; X += 0.2) xs.push(X);
  let k = poly([...xs.map((X) => P(X, bahn(X) - 0.05, zr + br)), ...xs.slice().reverse().map((X) => P(X, bahn(X) - 0.05, zr - br))], "#000", 'opacity=".15"');
  /* Schatten am Boden */
  k += poly([P(X1 + 0.2, 0, zr + 0.4), P(-1.25, 0, zr + 0.4), P(-1.25, 0, zr - 0.2), P(X1 + 0.2, 0, zr - 0.2)], "#000", 'opacity=".14" filter="url(#bw_weich)"');
  /* Stütze am Auslauf */
  k += linie(P(-1.6, 0, zr), P(-1.6, bahn(-1.6), zr), "#9aa3aa", 0.06 * sk(zr));
  /* Bahn (Innenseite) und Seitenwand vorn */
  k += poly([...xs.map((X) => P(X, bahn(X), zr - br)), ...xs.slice().reverse().map((X) => P(X, bahn(X), zr + br))], STAHL);
  k += poly([...xs.map((X) => P(X, bahn(X) + 0.16, zr + br)), ...xs.slice().reverse().map((X) => P(X, bahn(X) - 0.04, zr + br))], S.lg("rutschwand", [[0, "#e9edf0"], [0.5, "#bfc6cc"], [1, "#9aa3aa"]]));
  k += `<path d="M${xs.map((X) => P(X, bahn(X) + 0.16, zr + br).join(" ")).join(" L")}" stroke="#ffffff" stroke-width=".6" fill="none" opacity=".8"/>`;
  k += `<path d="M${xs.map((X) => P(X, bahn(X) + 0.16, zr - br).join(" ")).join(" L")}" stroke="#d9dee2" stroke-width=".8" fill="none"/>`;
  const [ax, ay] = P(-1.6, 0, zr + br);
  S.teil({ id: "rutsche", de: "die Rutsche", syl: "RUT-sche", it: "lo scivolo", itSyl: "SCI-vo-lo", en: "slide", x: ax, y: ay, steht: true, kunst: um(ax, ay, k),
    tipp: "Die Rutsche ist aus Edelstahl: Im Sommer kann sie heiß werden." });
}

/* =====================================================================
   9 — DIE SCHAUKEL (Gestell + Brettsitz) und 10 — DIE NESTSCHAUKEL
   ===================================================================== */
const SC = { X0: 1.1, X1: 5.0, z: 3.2, HB: 2.5 };
{
  const { X0, X1, z, HB } = SC;
  let k = "";
  /* hintere Beine, Balken, vordere Beine */
  const bein = (X, dz) => linie(P(X, 0, z + dz), P(X, HB, z), "#2b5fa8", 0.1 * sk(z + dz), ' stroke-linecap="round"');
  k += bein(X0, -0.75) + bein(X1, -0.75);
  k += linie(P(X0 - 0.1, HB, z), P(X1 + 0.1, HB, z), "#2b5fa8", 0.12 * sk(z), ' stroke-linecap="round"') + linie(P(X0 - 0.1, HB + 0.03, z), P(X1 + 0.1, HB + 0.03, z), "#5b8fd8", 0.03 * sk(z));
  k += bein(X0, 0.75) + bein(X1, 0.75);
  for (const X of [X0, X1]) { k += `<ellipse cx="${P(X, 0, z + 0.75)[0]}" cy="${P(X, 0, z + 0.75)[1]}" rx="2" ry=".6" fill="#555" opacity=".5"/>`; }
  /* Brettsitz an zwei Ketten */
  const sx = 2.05, Hs = 0.45;
  for (const dx of [-0.22, 0.22]) k += linie(P(sx + dx, HB, z), P(sx + dx, Hs, z), "#8a9298", 0.3, ' stroke-dasharray=".9 .35"');
  k += poly([P(sx - 0.25, Hs, z + 0.1), P(sx + 0.25, Hs, z + 0.1), P(sx + 0.25, Hs, z - 0.1), P(sx - 0.25, Hs, z - 0.1)], "#2a2a2a");
  k += poly([P(sx - 0.25, Hs, z + 0.1), P(sx + 0.25, Hs, z + 0.1), P(sx + 0.25, Hs - 0.04, z + 0.1), P(sx - 0.25, Hs - 0.04, z + 0.1)], "#d6402f");
  const [ax, ay] = P((X0 + X1) / 2, 0, z + 0.75);
  S.teil({ id: "schaukel", de: "die Schaukel", syl: "SCHAU-kel", it: "l'altalena", itSyl: "al-ta-LE-na", en: "swing", x: ax, y: ay, steht: true, kunst: um(ax, ay, k) + flaeche(P(sx - 0.3, 0, z)[0] - ax, P(0, HB, z)[1] - ay, 0.6 * sk(z), P(0, Hs - 0.1, z)[1] - P(0, HB, z)[1]),
    tipp: "Die Schaukel hat einen weichen Sitz aus Gummi." });
}
{
  const { z, HB } = SC, nx = 3.95, Hn = 0.55, R = 0.5;
  let k = "";
  const auf = [[-0.35, -0.12], [0.35, -0.12], [-0.35, 0.12], [0.35, 0.12]];
  for (const [dx, dz] of auf) k += linie(P(nx + dx * 0.4, HB, z), P(nx + dx * 1.3, Hn + 0.02, z + dz * 2.5), "#c8a165", 0.35);
  /* Netzring */
  const ringA = ring(nx, z, R, Hn, 28), ringI = ring(nx, z, R - 0.08, Hn + 0.01, 28);
  k += poly(ringA, "#e27a2e");
  k += poly(ringI, "#3c3c3c", 'opacity=".9"');
  for (let i = 0; i < 14; i++) { const a = ringI[i * 2], b = ringI[(i * 2 + 14) % 28]; k += linie(a, b, "#d9c49a", 0.25); }
  k += poly(ringA.slice(0, 15), "none", 'stroke="#b8561c" stroke-width="1"');
  const [ax, ay] = P(nx, Hn, z + R);
  S.teil({ id: "sp_nestschaukel", de: "die Nestschaukel", syl: "NEST-schau-kel", it: "l'altalena a nido", itSyl: "al-ta-LE-na a NI-do", en: "basket swing", x: ax, y: ay, kunst: um(ax, ay, k),
    tipp: "In der Nestschaukel können mehrere Kinder zusammen schaukeln." });
}

/* =====================================================================
   11 — DAS WIPPTIER (Pferd auf einer Feder)
   ===================================================================== */
{
  const X = -1.45, z = 5.0, s = sk(z);
  const [bx, by] = P(X, 0, z);
  let k = schatten(bx, by, 0.35 * s, 1.2, 0.3);
  k += `<rect x="${r(bx - 0.25 * s)}" y="${r(by - 0.04 * s)}" width="${r(0.5 * s)}" height="${r(0.05 * s)}" fill="#7d868c"/>`;
  for (let i = 0; i < 6; i++) k += `<ellipse cx="${bx}" cy="${r(by - 0.06 * s - i * 0.055 * s)}" rx="${r(0.1 * s)}" ry="${r(0.025 * s)}" fill="none" stroke="#e8c23a" stroke-width="${r(0.03 * s)}"/>`;
  /* Pferdekörper (Seitenansicht, nach links) */
  const y0 = by - 0.4 * s;
  k += `<path d="M${r(bx - 0.32 * s)} ${r(y0 - 0.08 * s)} Q${r(bx - 0.36 * s)} ${r(y0 - 0.38 * s)} ${r(bx - 0.24 * s)} ${r(y0 - 0.42 * s)} L${r(bx - 0.12 * s)} ${r(y0 - 0.2 * s)} Q${bx} ${r(y0 - 0.22 * s)} ${r(bx + 0.3 * s)} ${r(y0 - 0.18 * s)} Q${r(bx + 0.4 * s)} ${r(y0 - 0.05 * s)} ${r(bx + 0.28 * s)} ${r(y0 + 0.04 * s)} L${r(bx - 0.2 * s)} ${r(y0 + 0.04 * s)} Z" fill="${S.lg("pferd", [[0, "#f0f0ec"], [1, "#c9c9c2"]])}" stroke="#9a9a92" stroke-width=".3"/>`;
  k += `<path d="M${r(bx - 0.24 * s)} ${r(y0 - 0.42 * s)} Q${r(bx - 0.08 * s)} ${r(y0 - 0.4 * s)} ${r(bx - 0.1 * s)} ${r(y0 - 0.22 * s)}" stroke="#d6402f" stroke-width="${r(0.05 * s)}" fill="none"/>`;
  k += `<path d="M${r(bx - 0.25 * s)} ${r(y0 - 0.41 * s)} l${r(0.01 * s)} ${r(-0.07 * s)} l${r(0.04 * s)} ${r(0.06 * s)} Z" fill="#f0f0ec" stroke="#9a9a92" stroke-width=".2"/><ellipse cx="${r(bx - 0.33 * s)}" cy="${r(y0 - 0.12 * s)}" rx="${r(0.04 * s)}" ry="${r(0.035 * s)}" fill="#d9a0a0"/><circle cx="${r(bx - 0.34 * s)}" cy="${r(y0 - 0.12 * s)}" r=".35" fill="#7a4a4a"/>`;
  k += `<circle cx="${r(bx - 0.27 * s)}" cy="${r(y0 - 0.33 * s)}" r=".6" fill="#222"/><path d="M${r(bx + 0.3 * s)} ${r(y0 - 0.16 * s)} q${r(0.12 * s)} ${r(0.05 * s)} ${r(0.1 * s)} ${r(0.22 * s)}" stroke="#d6402f" stroke-width="${r(0.04 * s)}" fill="none"/>`;
  k += `<rect x="${r(bx - 0.06 * s)}" y="${r(y0 - 0.25 * s)}" width="${r(0.18 * s)}" height="${r(0.05 * s)}" rx="1" fill="#2b5fa8"/><path d="M${r(bx - 0.2 * s)} ${r(y0 - 0.3 * s)} h${r(0.09 * s)}" stroke="#333" stroke-width="${r(0.03 * s)}" stroke-linecap="round"/>`;
  k += `<path d="M${r(bx - 0.08 * s)} ${r(y0 + 0.04 * s)} v${r(0.1 * s)} M${r(bx + 0.18 * s)} ${r(y0 + 0.04 * s)} v${r(0.1 * s)}" stroke="#f0f0ec" stroke-width="${r(0.05 * s)}"/>`;
  S.teil({ id: "sp_wipptier", de: "das Wipptier", syl: "WIPP-tier", it: "il dondolo a molla", itSyl: "DON-do-lo a MOL-la", en: "spring rider", x: bx, y: by, steht: true, kunst: um(bx, by, k),
    tipp: "Das Wipptier sitzt auf einer dicken Feder und wippt hin und her." });
}

/* =====================================================================
   12 — DER MÜLLEIMER, 13 — DIE BANK, 14 — DIE MUTTER
   ===================================================================== */
{
  const X = 4.62, z = 5.75, s = sk(z);
  const [bx, by] = P(X, 0, z);
  let k = schatten(bx, by, 0.25 * s, 1, 0.3);
  k += `<rect x="${r(bx - 0.03 * s)}" y="${r(by - 0.95 * s)}" width="${r(0.06 * s)}" height="${r(0.95 * s)}" fill="#5d646b"/>`;
  k += `<path d="M${r(bx - 0.2 * s)} ${r(by - 0.85 * s)} L${r(bx + 0.2 * s)} ${r(by - 0.85 * s)} L${r(bx + 0.18 * s)} ${r(by - 0.3 * s)} L${r(bx - 0.18 * s)} ${r(by - 0.3 * s)} Z" fill="${S.lg("muell", [[0, "#3f7a4a"], [0.5, "#4f9a5c"], [1, "#2f5f3a"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${r(bx - 0.23 * s)} ${r(by - 0.85 * s)} Q${bx} ${r(by - 1.0 * s)} ${r(bx + 0.23 * s)} ${r(by - 0.85 * s)} Z" fill="#2f5f3a"/><rect x="${r(bx - 0.12 * s)}" y="${r(by - 0.82 * s)}" width="${r(0.24 * s)}" height="${r(0.07 * s)}" rx=".5" fill="#1b2a1e"/>`;
  for (let i = 0; i < 4; i++) k += `<rect x="${r(bx - 0.15 * s + i * 0.09 * s)}" y="${r(by - 0.7 * s)}" width="${r(0.02 * s)}" height="${r(0.34 * s)}" fill="#2f5f3a"/>`;
  S.teil({ id: "sp_muelleimer", de: "der Mülleimer", syl: "MÜLL-ei-mer", it: "il cestino", itSyl: "ce-STI-no", en: "bin", x: bx, y: by, steht: true, kunst: um(bx, by, k),
    tipp: "Den Müll wirft man in den Mülleimer." });
}
const BA = { X0: 2.55, X1: 4.2, z: 6.0, Hs: 0.45 };
function bank(teilVorn) {
  const { X0, X1, z, Hs } = BA, zf = z + 0.22, zb = z - 0.22;
  let k = "";
  if (!teilVorn) {
    k += poly([P(X0, 0, zf + 0.15), P(X1, 0, zf + 0.15), P(X1 + 0.1, 0, zb), P(X0 + 0.1, 0, zb)], "#000", 'opacity=".2" filter="url(#bw_weich)"');
    /* Lehne: drei Latten, Stahlfüße */
    for (const X of [X0 + 0.15, X1 - 0.15]) k += linie(P(X, 0, zb), P(X, Hs + 0.45, zb - 0.06), "#3a3f45", 0.06 * sk(z));
    for (let i = 0; i < 3; i++) k += poly([P(X0, Hs + 0.12 + i * 0.11, zb - 0.02), P(X1, Hs + 0.12 + i * 0.11, zb - 0.02), P(X1, Hs + 0.2 + i * 0.11, zb - 0.04), P(X0, Hs + 0.2 + i * 0.11, zb - 0.04)], S.lg("latte" + i, [[0, "#c8955a"], [1, "#a8743e"]]));
    /* Sitzlatten */
    for (let i = 0; i < 4; i++) { const za = zb + i * 0.11, zc = za + 0.09; k += poly([P(X0, Hs, za), P(X1, Hs, za), P(X1, Hs, zc), P(X0, Hs, zc)], i % 2 ? "#c08a50" : "#cc9a5e"); }
  } else {
    k += poly([P(X0, Hs, zf), P(X1, Hs, zf), P(X1, Hs - 0.04, zf), P(X0, Hs - 0.04, zf)], "#9a6a36");
    for (const X of [X0 + 0.15, X1 - 0.15]) k += poly([P(X - 0.03, 0, zf), P(X + 0.03, 0, zf), P(X + 0.03, Hs - 0.04, zf), P(X - 0.03, Hs - 0.04, zf)], "#3a3f45");
  }
  return k;
}
{
  const [ax, ay] = P((BA.X0 + BA.X1) / 2, 0, BA.z + 0.22);
  S.teil({ id: "sp_bank", de: "die Bank", syl: "BANK", it: "la panchina", itSyl: "pan-CHI-na", en: "bench", x: ax, y: ay, steht: true, kunst: um(ax, ay, bank(false) + bank(true)),
    tipp: "Auf der Bank sitzen die Eltern und passen auf." });
}
{
  const X = 3.1, z = BA.z + 0.02;
  const m = figur({ id: "b10d_mutter", geschlecht: "w", pose: "sitzen", blick: -18, frisur: "pony", haarfarbe: "hellbraun", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "tshirt", farbe: "#e9e6de" }, jacke: { stueck: "jacke", farbe: "#c95f6e" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" }, zubehoer: { stueck: "tasche", farbe: "braun" } } }, 1.67 * sk(z));
  const Hs = -m.z.sitz.y * m.k / sk(z);
  const [fx, fy] = P(X, BA.Hs - Hs, z);
  S.teil({ id: "mutter_sp", de: "die Mutter", syl: "MUT-ter", it: "la mamma", itSyl: "MAM-ma", en: "mother", x: fx, y: fy, kunst: m.svg,
    tipp: "Die Mutter ruft: „Noch fünf Minuten, dann gehen wir nach Hause!“" });
  /* Sitzkante der Bank vor ihren Beinen bleibt sichtbar (gehört zur Bank) */
}

/* =====================================================================
   15 — DIE WIPPE (Balkenwippe mit Reifen)
   ===================================================================== */
{
  const z = 6.3, Xp = -2.75, L = 1.25, Hp = 0.55, neig = -0.22;
  const s = sk(z);
  let k = schatten(...P(Xp, 0, z), 1.5 * s, 1.6, 0.25);
  /* Reifen unter den Enden */
  for (const X of [Xp - L + 0.15, Xp + L - 0.15]) { const [rx, ry] = P(X, 0, z); k += `<ellipse cx="${rx}" cy="${r(ry - 0.07 * s)}" rx="${r(0.2 * s)}" ry="${r(0.08 * s)}" fill="#2a2a2a"/><ellipse cx="${rx}" cy="${r(ry - 0.1 * s)}" rx="${r(0.1 * s)}" ry="${r(0.035 * s)}" fill="#555"/>`; }
  /* Lagerbock */
  k += poly([P(Xp - 0.3, 0, z), P(Xp + 0.3, 0, z), P(Xp + 0.08, Hp, z), P(Xp - 0.08, Hp, z)], S.lg("bock", [[0, "#d6402f"], [1, "#a8321f"]], 0, 0, 1, 0));
  /* Balken (geneigt: links unten) */
  const ende = (t) => P(Xp + t * L, Hp + t * L * Math.sin(neig) * -1, z);
  const a = ende(-1), b = ende(1);
  k += `<path d="M${a[0]} ${a[1]} L${b[0]} ${b[1]}" stroke="#b8844a" stroke-width="${r(0.14 * s)}" stroke-linecap="round"/>`;
  k += linie(a, b, "#a8743e", 0.14 * s, ' stroke-linecap="round" opacity=".001"');
  k += `<path d="M${a[0]} ${r(a[1] - 0.05 * s)} L${b[0]} ${r(b[1] - 0.05 * s)}" stroke="#dcae74" stroke-width="${r(0.03 * s)}"/>`;
  /* Sitze und Haltegriffe */
  for (const t of [-0.85, 0.85]) {
    const p = ende(t), g = ende(t * 0.62);
    k += `<rect x="${r(p[0] - 0.13 * s)}" y="${r(p[1] - 0.1 * s)}" width="${r(0.26 * s)}" height="${r(0.05 * s)}" rx="1" fill="#2b5fa8"/>`;
    k += `<path d="M${g[0]} ${g[1]} v${r(-0.32 * s)} m${r(-0.08 * s)} 0 h${r(0.16 * s)}" stroke="#e8c23a" stroke-width="${r(0.035 * s)}" fill="none" stroke-linecap="round"/>`;
  }
  k += `<circle cx="${ende(0)[0]}" cy="${ende(0)[1]}" r="${r(0.05 * s)}" fill="#555"/>`;
  const [ax, ay] = P(Xp, 0, z);
  S.teil({ id: "wippe", de: "die Wippe", syl: "WIP-pe", it: "l'altalena a bilico", itSyl: "al-ta-LE-na a BI-li-co", en: "seesaw", x: ax, y: ay, steht: true, kunst: um(ax, ay, k),
    tipp: "Auf der Wippe braucht man einen Partner: Einer geht hoch, der andere runter." });
}

/* =====================================================================
   16 — DER SANDKASTEN (Holzrahmen) — Lupe: Sandburg, Eimer, Schaufel,
   Förmchen; 17 — DAS KIND; 18 — DER BALL
   ===================================================================== */
const SK = { X0: -1.5, X1: 1.7, z0: 6.55, z1: 8.0, Hr: 0.22, Hs: 0.13 };
const sandUnter = [];
{
  const { X0, X1, z0, z1, Hr, Hs } = SK, b = 0.14;
  let k = "";
  /* Sandfläche */
  k += poly([P(X0, Hs, z0), P(X1, Hs, z0), P(X1, Hs, z1), P(X0, Hs, z1)], SAND);
  k += poly([P(X0, Hs, z0), P(X1, Hs, z0), P(X1, Hs, z1), P(X0, Hs, z1)], S.lg("sandlicht", [[0, "#000", 0.12], [0.3, "#000", 0], [1, "#fff", 0.1]]));
  /* Spuren im Sand */
  for (let i = 0; i < 7; i++) { const [cx, cy] = P(X0 + 0.3 + rnd() * (X1 - X0 - 0.6), Hs, z0 + 0.2 + rnd() * (z1 - z0 - 0.4)); k += `<ellipse cx="${cx}" cy="${cy}" rx="${r(2 + rnd() * 2)}" ry="${r(0.6 + rnd() * 0.4)}" fill="#c9ab70" opacity=".5"/>`; }
  /* Holzbalken: hinten, links, rechts (Innenseiten), Oberseiten */
  const balken = (pts, f) => poly(pts, f);
  k += balken([P(X0, Hs, z0 + b), P(X1, Hs, z0 + b), P(X1, Hr, z0 + b), P(X0, Hr, z0 + b)], "#9a6c3a");
  k += balken([P(X0, Hr, z0), P(X1, Hr, z0), P(X1, Hr, z0 + b), P(X0, Hr, z0 + b)], "#c8955a");
  k += balken([P(X0 + b, Hs, z0 + b), P(X0 + b, Hs, z1 - b), P(X0 + b, Hr, z1 - b), P(X0 + b, Hr, z0 + b)], "#9a6c3a");
  k += balken([P(X1 - b, Hs, z0 + b), P(X1 - b, Hs, z1 - b), P(X1 - b, Hr, z1 - b), P(X1 - b, Hr, z0 + b)], "#8c6232");
  k += balken([P(X0, Hr, z0), P(X0 + b, Hr, z0), P(X0 + b, Hr, z1), P(X0, Hr, z1)], "#c8955a");
  k += balken([P(X1 - b, Hr, z0), P(X1, Hr, z0), P(X1, Hr, z1), P(X1 - b, Hr, z1)], "#c8955a");
  /* Sandburg mit Türmen und Fähnchen */
  {
    const [cx, cy] = P(-0.55, Hs, 7.1), s = sk(7.1);
    let g = `<path d="M${r(cx - 0.3 * s)} ${cy} Q${cx} ${r(cy + 0.05 * s)} ${r(cx + 0.3 * s)} ${cy} L${r(cx + 0.22 * s)} ${r(cy - 0.12 * s)} L${r(cx - 0.22 * s)} ${r(cy - 0.12 * s)} Z" fill="#d4b77c"/>`;
    for (const [dx, h, w] of [[-0.16, 0.24, 0.1], [0.16, 0.22, 0.1], [0, 0.32, 0.12]]) {
      g += `<path d="M${r(cx + (dx - w / 2) * s)} ${r(cy - 0.1 * s)} L${r(cx + (dx - w / 2.6) * s)} ${r(cy - h * s)} L${r(cx + (dx + w / 2.6) * s)} ${r(cy - h * s)} L${r(cx + (dx + w / 2) * s)} ${r(cy - 0.1 * s)} Z" fill="${S.lg("burg", [[0, "#ecd7a6"], [1, "#caa968"]], 0, 0, 1, 0)}"/>`;
      for (let j = -1; j <= 1; j++) g += `<rect x="${r(cx + (dx + j * w / 4 - 0.015) * s)}" y="${r(cy - (h + 0.035) * s)}" width="${r(0.03 * s)}" height="${r(0.04 * s)}" fill="#dcc08a"/>`;
    }
    g += `<path d="M${cx} ${r(cy - 0.32 * s)} v${r(-0.16 * s)}" stroke="#6b4a2c" stroke-width=".5"/><path d="M${cx} ${r(cy - 0.48 * s)} l${r(0.09 * s)} ${r(0.03 * s)} l${r(-0.09 * s)} ${r(0.03 * s)} Z" fill="#d6402f"/>`;
    g += `<rect x="${r(cx - 0.035 * s)}" y="${r(cy - 0.08 * s)}" width="${r(0.07 * s)}" height="${r(0.08 * s)}" rx="${r(0.03 * s)}" fill="#a88a52"/>`;
    k += g;
    sandUnter.push({ id: "sp_sandburg", de: "die Sandburg", syl: "SAND-burg", it: "il castello di sabbia", itSyl: "ca-STEL-lo di SAB-bia", en: "sandcastle", x: cx, y: cy + 1, kunst: flaeche(-0.32 * s, -0.5 * s - 1, 0.64 * s, 0.5 * s + 2),
      tipp: "Mit nassem Sand hält die Sandburg besser." });
  }
  /* Eimer (rot, mit Henkel) */
  {
    const [cx, cy] = P(-1.12, Hs, 7.45), s = sk(7.45), w = 0.2 * s, h = 0.18 * s;
    let g = `<ellipse cx="${cx}" cy="${r(cy + 0.5)}" rx="${r(w * 0.55)}" ry="${r(w * 0.12)}" fill="#000" opacity=".2"/>`;
    g += `<path d="M${r(cx - w / 2)} ${r(cy - h)} L${r(cx + w / 2)} ${r(cy - h)} L${r(cx + w * 0.4)} ${cy} L${r(cx - w * 0.4)} ${cy} Z" fill="${S.lg("eimer", [[0, "#e0553f"], [0.5, "#f07a5a"], [1, "#b33b2a"]], 0, 0, 1, 0)}"/>`;
    g += `<ellipse cx="${cx}" cy="${r(cy - h)}" rx="${r(w / 2)}" ry="${r(w * 0.14)}" fill="#8a2a1c"/><ellipse cx="${cx}" cy="${r(cy - h + 0.6)}" rx="${r(w * 0.42)}" ry="${r(w * 0.09)}" fill="#d4b77c"/>`;
    g += `<path d="M${r(cx - w / 2)} ${r(cy - h + 1)} Q${cx} ${r(cy - h - w * 0.6)} ${r(cx + w / 2)} ${r(cy - h + 1)}" stroke="#f6c434" stroke-width=".7" fill="none"/>`;
    k += g;
    sandUnter.push({ id: "sp_eimer", de: "der Eimer", syl: "EI-mer", it: "il secchiello", itSyl: "sec-CHIEL-lo", en: "bucket", x: cx, y: cy + 1, kunst: flaeche(-w / 2 - 0.5, -h - w * 0.6, w + 1, h + w * 0.6 + 1.5) });
  }
  /* Schaufel (blau), liegt im Sand */
  {
    const [cx, cy] = P(0.15, Hs, 7.5), s = sk(7.5);
    let g = `<g transform="rotate(-18 ${cx} ${cy})"><rect x="${r(cx - 0.2 * s)}" y="${r(cy - 0.015 * s)}" width="${r(0.22 * s)}" height="${r(0.03 * s)}" rx="${r(0.015 * s)}" fill="#2b5fa8"/><path d="M${r(cx + 0.02 * s)} ${r(cy - 0.05 * s)} L${r(cx + 0.16 * s)} ${r(cy - 0.06 * s)} Q${r(cx + 0.21 * s)} ${cy} ${r(cx + 0.16 * s)} ${r(cy + 0.06 * s)} L${r(cx + 0.02 * s)} ${r(cy + 0.05 * s)} Z" fill="#3b78c8"/><rect x="${r(cx - 0.24 * s)}" y="${r(cy - 0.03 * s)}" width="${r(0.06 * s)}" height="${r(0.06 * s)}" rx="${r(0.02 * s)}" fill="#1f4f8f"/></g>`;
    k += g;
    sandUnter.push({ id: "sp_schaufel", de: "die Schaufel", syl: "SCHAU-fel", it: "la paletta", itSyl: "pa-LET-ta", en: "spade", x: cx, y: cy + 0.08 * s, kunst: flaeche(-0.26 * s, -0.18 * s, 0.5 * s, 0.26 * s) });
  }
  /* Sandförmchen: Fisch, Stern, Kuchen – und was daraus geworden ist */
  {
    const [cx, cy] = P(-0.5, Hs, 7.52), s = sk(7.52);
    let g = `<path d="M${r(cx - 0.12 * s)} ${cy} q${r(0.06 * s)} ${r(-0.05 * s)} ${r(0.12 * s)} 0 l${r(0.04 * s)} ${r(-0.03 * s)} v${r(0.06 * s)} l${r(-0.04 * s)} ${r(-0.03 * s)} q${r(-0.06 * s)} ${r(0.05 * s)} ${r(-0.12 * s)} 0 Z" fill="#3bb3c3"/>`;
    const st = (x, y, rr, f) => { let p = ""; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, q = i % 2 ? rr * 0.45 : rr; p += `${i ? "L" : "M"}${r(x + Math.cos(a) * q)} ${r(y + Math.sin(a) * q * 0.55)} `; } return `<path d="${p}Z" fill="${f}"/>`; };
    g += st(cx + 0.18 * s, cy - 0.01 * s, 0.07 * s, "#f6c434");
    g += `<path d="M${r(cx - 0.02 * s)} ${r(cy + 0.03 * s)} l${r(0.04 * s)} ${r(-0.06 * s)} h${r(0.08 * s)} l${r(0.04 * s)} ${r(0.06 * s)} Z" fill="#e86aa0"/>`;
    /* gestürzte Sandformen */
    g += st(cx + 0.36 * s, cy + 0.02 * s, 0.065 * s, "#d4b77c");
    g += `<path d="M${r(cx - 0.32 * s)} ${r(cy + 0.03 * s)} q${r(0.06 * s)} ${r(-0.05 * s)} ${r(0.12 * s)} 0 l${r(0.04 * s)} ${r(-0.03 * s)} v${r(0.06 * s)} l${r(-0.04 * s)} ${r(-0.03 * s)} q${r(-0.06 * s)} ${r(0.05 * s)} ${r(-0.12 * s)} 0 Z" fill="#cdb075"/>`;
    k += g;
    sandUnter.push({ id: "sp_foermchen", de: "die Sandförmchen", syl: "SAND-förm-chen", it: "le formine", itSyl: "for-MI-ne", en: "sand moulds", x: cx + 0.04 * s, y: cy + 0.06 * s, kunst: flaeche(-0.38 * s, -0.12 * s, 0.84 * s, 0.17 * s),
      tipp: "Mit den Förmchen macht man Fische und Sterne aus Sand." });
  }
  /* vorderer Balken (Außenseite und Oberkante) */
  k += balken([P(X0, 0, z1), P(X1, 0, z1), P(X1, Hr, z1), P(X0, Hr, z1)], S.lg("vbalken", [[0, "#c8955a"], [1, "#9a6c3a"]]));
  k += balken([P(X0, Hr, z1 - b), P(X1, Hr, z1 - b), P(X1, Hr, z1), P(X0, Hr, z1)], "#dcae74");
  for (let i = 1; i < 6; i++) { const X = X0 + i * (X1 - X0) / 6; k += linie(P(X, 0.02, z1), P(X, Hr - 0.02, z1), "#8c6232", 0.3, ' opacity=".5"'); }
  const [ax, ay] = P((X0 + X1) / 2, 0, z1);
  const [zx0] = P(X0, 0, 7.6), [, zy0] = P(0, 0.6, 7.3);
  S.teil({ id: "sandkasten", de: "der Sandkasten", syl: "SAND-kas-ten", it: "la sabbiera", itSyl: "sab-BIE-ra", en: "sandpit", x: ax, y: ay, steht: true, kunst: um(ax, ay, k),
    zoom: { x: 80, y: 108, w: 96, h: 64 }, unter: sandUnter });
}
{
  /* Das Kind kniet im Sand und buddelt, mit Sonnenkappe */
  const X = 0.75, z = 7.3;
  const kd = figur({ id: "b10d_kind", alter: "kind", geschlecht: "m", pose: "b10d_buddeln", blick: -42, frisur: "kurz", haarfarbe: "blond", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "tshirt", farbe: "#f2c94c" }, unterteil: { stueck: "shorts", farbe: "#2f5f95" }, schuhe: { stueck: "sandale", farbe: "#2b5fa8" }, kopf: { stueck: "kappe", farbe: "#d6402f" } } }, 1.1 * sk(z));
  const [fx, fy] = P(X, SK.Hs, z);
  S.teil({ id: "kind_sp", de: "das Kind", syl: "KIND", it: "il bambino", itSyl: "bam-BI-no", en: "child", x: fx, y: fy, kunst: kd.svg,
    tipp: "Das Kind baut eine Sandburg." });
}
{
  /* DAS LAUFRAD liegt nicht, es steht links neben dem Sandkasten */
  const z = 7.7, s = sk(z), [bx, by] = P(-2.35, 0, z), R = 0.15 * s;
  let k = schatten(bx, by, 0.5 * s, 1.2, 0.28);
  const rad = (x) => `<circle cx="${r(x)}" cy="${r(by - R)}" r="${r(R)}" fill="#2a2a2a"/><circle cx="${r(x)}" cy="${r(by - R)}" r="${r(R * 0.72)}" fill="#cfd4d8"/><circle cx="${r(x)}" cy="${r(by - R)}" r="${r(R * 0.62)}" fill="#e8ecef"/><circle cx="${r(x)}" cy="${r(by - R)}" r="${r(R * 0.15)}" fill="#7d868c"/>`;
  const xh = bx - 0.32 * s, xv = bx + 0.3 * s;
  k += rad(xh) + rad(xv);
  /* Rahmen (grün), Sattel, Lenker */
  k += `<path d="M${r(xh)} ${r(by - R)} L${r(bx - 0.08 * s)} ${r(by - 0.33 * s)} L${r(xv - 0.06 * s)} ${r(by - 0.4 * s)} L${r(xv)} ${r(by - R)}" stroke="#3a9a4c" stroke-width="${r(0.035 * s)}" fill="none" stroke-linejoin="round"/>`;
  k += `<path d="M${r(xh + 0.02 * s)} ${r(by - R)} L${r(bx - 0.06 * s)} ${r(by - 0.3 * s)} L${r(xv - 0.02 * s)} ${r(by - 0.36 * s)}" stroke="#2f7f3e" stroke-width="${r(0.02 * s)}" fill="none"/>`;
  k += `<path d="M${r(bx - 0.08 * s)} ${r(by - 0.33 * s)} v${r(-0.08 * s)}" stroke="#9aa3aa" stroke-width="${r(0.025 * s)}"/><path d="M${r(bx - 0.2 * s)} ${r(by - 0.43 * s)} q${r(0.12 * s)} ${r(-0.03 * s)} ${r(0.2 * s)} ${r(0.01 * s)} l${r(-0.02 * s)} ${r(0.03 * s)} h${r(-0.17 * s)} Z" fill="#222"/>`;
  k += `<path d="M${r(xv - 0.06 * s)} ${r(by - 0.4 * s)} l${r(-0.04 * s)} ${r(-0.14 * s)}" stroke="#9aa3aa" stroke-width="${r(0.025 * s)}"/><path d="M${r(xv - 0.16 * s)} ${r(by - 0.55 * s)} h${r(0.12 * s)}" stroke="#222" stroke-width="${r(0.035 * s)}" stroke-linecap="round"/>`;
  S.teil({ id: "sp_laufrad", de: "das Laufrad", syl: "LAUF-rad", it: "la bici senza pedali", itSyl: "BI-ci SEN-za pe-DA-li", en: "balance bike", x: bx, y: by, kunst: um(bx, by, k),
    tipp: "Das Laufrad hat keine Pedale: Kleine Kinder stoßen sich mit den Füßen ab." });
}
{
  const [cx, cy] = P(2.15, 0, 8.25), s = sk(8.25), R = 0.11 * s;
  let k = `<ellipse cx="0" cy="0" rx="${r(R * 1.1)}" ry="${r(R * 0.3)}" fill="#1f3a14" opacity=".3" filter="url(#bw_weich)"/>`;
  k += `<circle cx="0" cy="${r(-R)}" r="${r(R)}" fill="#fff"/>`;
  k += `<path d="M0 ${r(-2 * R)} A${r(R)} ${r(R)} 0 0 1 ${r(R)} ${r(-R)} L0 ${r(-R)} Z" fill="#d6402f"/><path d="M${r(-R)} ${r(-R)} A${r(R)} ${r(R)} 0 0 1 0 ${r(-2 * R)} L0 ${r(-R)} Z" fill="#2b5fa8"/><path d="M0 0 A${r(R)} ${r(R)} 0 0 1 ${r(-R)} ${r(-R)} L0 ${r(-R)} Z" fill="#f6c434"/>`;
  k += `<circle cx="0" cy="${r(-R)}" r="${r(R)}" fill="${S.rg("ballglanz", [[0, "#fff", 0.5], [0.4, "#fff", 0], [1, "#000", 0.25]], 0.35, 0.3, 0.75)}"/>`;
  S.teil({ id: "ball_sp", de: "der Ball", syl: "BALL", it: "la palla", itSyl: "PAL-la", en: "ball", x: cx, y: cy, kunst: k });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/spielplatz.js"));
console.log(aus);
