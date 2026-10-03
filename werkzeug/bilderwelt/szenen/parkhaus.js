#!/usr/bin/env node
/* =====================================================================
   DAS PARKHAUS (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   XANDER (Funk 263/286): jeder Ort „identisch mit seinem Original“, alle
   Stationen logisch, jedes Ding einzeln antippbar, nichts blockiert.

   RECHERCHE (Parkhäuser in Deutschland; Hersteller von Parktechnik wie
   Scheidt & Bachmann, Ablauf „Ticket ziehen – zahlen – ausfahren“):
   - Ein Parkdeck ist niedrig (lichte Höhe gut 2 m): Betondecke mit
     Unterzügen, Leuchtstoffröhren, graue BETONSÄULEN, Boden aus Beton
     mit weißen Linien; jeder STELLPLATZ hat eine Nummer.
   - An der Ausfahrt die SCHRANKE mit dem TICKETAUTOMATEN (Säule mit
     Schlitz: bezahltes Ticket einstecken), darüber ein gelb-schwarzer
     Balken mit der DURCHFAHRTSHÖHE (z. B. 2,00 m).
   - Eine RAMPE führt zur nächsten EBENE; jede Ebene hat eine Farbe und
     eine Nummer, die Reihen haben Buchstaben.
   - Am Fußgängerausgang (TREPPENHAUS) steht der KASSENAUTOMAT: Parkschein
     einstecken, mit Münzen, Scheinen oder Karte zahlen. Grüne
     FLUCHTWEG-Schilder (rennende Person, Pfeil) zeigen zum Ausgang.
   - Nahe am Ausgang: der BEHINDERTENPARKPLATZ (breiter, blaues Zeichen
     mit Rollstuhl). FEUERLÖSCHER an den Säulen.
   Perspektive: Blick über die Fahrgasse auf eine Reihe von Stellplätzen,
   Fluchtpunkt (140|92), Augenhöhe 1,6 m, Brennweite 300. Maßstab:
   Stellplätze in 13 m Abstand ≈ 23 Einheiten je Meter.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "parkhaus", titel: "Das Parkhaus", emoji: "🅿️", thema: "Unterwegs", kuerzel: "b06d", fassung: 852 });
const rnd = zufall(2207);
const r = B.r;

/* ---------- Projektion und Zuschnitt --------------------------------- */
const F = 300, AUGE = 1.6, VX = 140, VY = 92;
const P = (X, Z, H = 0) => [r(VX + X * F / Z), r(VY + (AUGE - H) * F / Z)];
const M = (Z) => F / Z;
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
/* Text auf einer Bodenfläche (liegt flach, Leserichtung +X) */
const bodenText = (X, Z, groesse, txt, farbe, extra = "") => {
  const o = P(X, Z), ex = P(X + 1, Z), ez = P(X, Z + 1);
  return `<text transform="matrix(${r((ex[0] - o[0]) * 10) / 100} ${r((ex[1] - o[1]) * 10) / 100} ${r((o[0] - ez[0]) * 10) / 100} ${r((o[1] - ez[1]) * 10) / 100} ${o[0]} ${o[1]})" font-size="${groesse * 10}" text-anchor="middle" fill="${farbe}" font-family="Arial" font-weight="bold"${extra}>${txt}</text>`;
};
/* Farbe abdunkeln/aufhellen (#rrggbb) */
const mische = (c, z, t) => { const a = parseInt(c.slice(1), 16), b = parseInt(z.slice(1), 16); const k = (s) => Math.round(((a >> s) & 255) * (1 - t) + ((b >> s) & 255) * t); return "#" + ((1 << 24) + (k(16) << 16) + (k(8) << 8) + k(0)).toString(16).slice(1); };

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const BETON = "#a9a6a0";

/* ---------- Ein Auto: Stirnseite (Front oder Heck) als fein gezeichnete
   Fläche in der Bildebene, Seite, Dach, Haube und Scheiben perspektivisch
   aus dem Raum. Zn = Abstand der Stirnseite, die zur Kamera zeigt. ------- */
function auto({ X, Zn, L, W, farbe, heck, kombi, kennz }) {
  const s = F / Zn, o = P(X, Zn, 0);
  const lack = (t) => mische(farbe, t > 0 ? "#ffffff" : "#000000", Math.abs(t));
  const id = S.id("lk" + farbe.slice(1) + (heck ? "h" : "f"));
  S.def(`<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${lack(0.25)}"/><stop offset=".45" stop-color="${farbe}"/><stop offset="1" stop-color="${lack(-0.3)}"/></linearGradient>`);
  const hw = W / 2;
  let g = "";
  /* Schatten */
  g += poly([P(X - hw - 0.1, Zn - 0.05), P(X + hw + 0.1, Zn - 0.05), P(X + hw + 0.1, Zn + L), P(X - hw - 0.1, Zn + L)], "#111", ` opacity=".5" filter="url(#bw_weich)"`);
  /* Seitenprofil (z: 0 = Stirnseite, h: Höhe) */
  const prof = heck
    ? (kombi ? [[0, 0.3], [0, 0.98], [0.12, 1.47], [L - 1.95, 1.47], [L - 1.15, 0.94], [L - 0.05, 0.8], [L, 0.62], [L, 0.3]]
      : [[0, 0.3], [0, 0.92], [0.35, 0.94], [1.0, 1.42], [L - 1.95, 1.43], [L - 1.15, 0.92], [L, 0.78], [L, 0.3]])
    : [[0, 0.3], [0, 0.78], [0.05, 0.84], [1.1, 0.92], [1.9, 1.42], [L - 1.0, 1.43], [L - 0.35, 0.94], [L, 0.9], [L, 0.3]];
  const fenster = heck
    ? (kombi ? [[0.2, 1.0], [0.25, 1.38], [L - 2.0, 1.4], [L - 1.3, 1.0]] : [[1.1, 1.0], [1.15, 1.36], [L - 2.0, 1.38], [L - 1.3, 1.0]])
    : [[1.3, 1.0], [1.95, 1.37], [L - 1.05, 1.37], [L - 0.5, 1.0]];
  const sx = X > 0 ? -1 : 1, Xs = X + sx * hw;
  const pz = (z, h, xs = Xs) => P(xs, Zn + z, h);
  g += poly(prof.map(([z, h]) => pz(z, h)), lack(-0.12));
  g += poly(fenster.map(([z, h]) => pz(z, h)), `url(#${S.id("autoglas")})`);
  { const zm = (fenster[1][0] + fenster[2][0]) / 2; g += linie(pz(zm, 1.0), pz(zm + 0.08, 1.38), lack(-0.35), r(0.06 * F / (Zn + zm))); }
  g += linie(pz(0.1, 0.62), pz(L - 0.1, 0.62), lack(-0.3), r(0.02 * s));
  /* Räder an der Seite */
  for (const zw of [0.85, L - 0.9]) {
    const c = pz(zw, 0.31), a = pz(zw - 0.31, 0.31), b = pz(zw, 0.62), rx = Math.abs(c[0] - a[0]), ry = Math.abs(c[1] - b[1]);
    g += `<ellipse cx="${c[0]}" cy="${c[1]}" rx="${r(rx * 1.22)}" ry="${r(ry * 1.15)}" fill="#1d1f22"/><ellipse cx="${c[0]}" cy="${c[1]}" rx="${r(rx)}" ry="${r(ry)}" fill="#141516"/><ellipse cx="${c[0]}" cy="${c[1]}" rx="${r(rx * 0.6)}" ry="${r(ry * 0.6)}" fill="#a9b0b6"/><ellipse cx="${c[0]}" cy="${c[1]}" rx="${r(rx * 0.2)}" ry="${r(ry * 0.2)}" fill="#5b636b"/>`;
  }
  /* Dach (von oben sichtbar) */
  const zr0 = heck ? (kombi ? 0.12 : 1.0) : 1.9, zr1 = heck ? L - 1.95 : L - 1.0, hr = kombi ? 1.47 : 1.43;
  g += poly([P(X - hw + 0.2, Zn + zr0, hr), P(X + hw - 0.2, Zn + zr0, hr), P(X + hw - 0.2, Zn + zr1, hr), P(X - hw + 0.2, Zn + zr1, hr)], lack(0.2));
  /* Haube bzw. Kofferraumdeckel zwischen Stirnseite und Scheibe */
  if (!heck) g += poly([P(X - hw + 0.05, Zn, 0.84), P(X + hw - 0.05, Zn, 0.84), P(X + hw - 0.08, Zn + 1.1, 0.92), P(X - hw + 0.08, Zn + 1.1, 0.92)], `url(#${id})`);
  else if (!kombi) g += poly([P(X - hw + 0.05, Zn, 0.92), P(X + hw - 0.05, Zn, 0.92), P(X + hw - 0.1, Zn + 0.35, 0.94), P(X - hw + 0.1, Zn + 0.35, 0.94)], lack(0.15));
  /* Scheibe zur Kamera (Windschutz- bzw. Heckscheibe) */
  const sch = heck
    ? (kombi ? [[0, 0.99, hw - 0.1], [0.12, 1.45, hw - 0.18]] : [[0.35, 0.95, hw - 0.12], [1.0, 1.42, hw - 0.2]])
    : [[1.1, 0.93, hw - 0.1], [1.9, 1.42, hw - 0.2]];
  const [[za, ha, wa], [zb, hb, wb]] = sch;
  const q = [P(X - wa, Zn + za, ha), P(X + wa, Zn + za, ha), P(X + wb, Zn + zb, hb), P(X - wb, Zn + zb, hb)];
  g += poly(q, lack(-0.35));
  const ein = q.map((p, i) => [r(p[0] + (i % 3 === 0 ? 1 : -1) * 0.04 * s), r(p[1] + (i < 2 ? -0.03 : 0.03) * s)]);
  g += poly(ein, `url(#${S.id("autoglas")})`);
  g += poly([ein[3], [r(ein[3][0] + (ein[2][0] - ein[3][0]) * 0.28), ein[3][1]], [r(ein[0][0] + (ein[1][0] - ein[0][0]) * 0.12), ein[0][1]], ein[0]], "#fff", ` opacity=".13"`);
  if (heck && kombi) { const m = [r((ein[0][0] + ein[1][0]) / 2), r(ein[0][1] - 0.05 * s)]; g += `<path d="M${m[0]} ${m[1]} l${r(-0.35 * s)} ${r(-0.2 * s)}" stroke="#15181b" stroke-width="${r(0.025 * s)}"/>`; }
  /* Stirnseite in Metern (x nach rechts, y = −Höhe) */
  const hT = heck ? (kombi ? 0.99 : 0.92) : 0.84;
  let n = "";
  /* Reifen unter der Karosserie */
  for (const sx2 of [-1, 1]) n += `<rect x="${r(sx2 * (hw - 0.27) - 0.12)}" y="-.34" width=".24" height=".34" rx=".06" fill="#16181a"/>`;
  n += `<path d="M${-hw + 0.06} -.22 L${hw - 0.06} -.22 Q${hw} -.22 ${hw} -.3 L${hw} ${-hT + 0.12} Q${hw} ${-hT} ${hw - 0.12} ${-hT} L${-hw + 0.12} ${-hT} Q${-hw} ${-hT} ${-hw} ${-hT + 0.12} L${-hw} -.3 Q${-hw} -.22 ${-hw + 0.06} -.22 Z" fill="url(#${id})"/>`;
  n += `<path d="M${-hw + 0.04} -.24 L${hw - 0.04} -.24 L${hw} -.4 L${-hw} -.4 Z" fill="${lack(-0.55)}"/>`;
  const pl = (y) => `<rect x="-.26" y="${y}" width=".52" height=".11" rx=".01" fill="#fafafa" stroke="#222" stroke-width=".006"/><rect x="-.26" y="${y}" width=".045" height=".11" fill="#1f4fa0"/><text x=".02" y="${r((y + 0.088) * 1000) / 1000}" font-size=".085" text-anchor="middle" fill="#111" font-family="Arial" font-weight="bold">${kennz}</text>`;
  if (!heck) {
    for (const sx2 of [-1, 1]) n += `<path d="M${sx2 * (hw - 0.06)} -.74 L${sx2 * (hw - 0.44)} -.72 L${sx2 * (hw - 0.48)} -.64 L${sx2 * (hw - 0.08)} -.62 Z" fill="#eef5fb" stroke="${lack(-0.5)}" stroke-width=".012"/><circle cx="${sx2 * (hw - 0.2)}" cy="-.68" r=".04" fill="#fffbe6"/>`;
    n += `<path d="M-.36 -.74 L.36 -.74 L.32 -.62 L-.32 -.62 Z" fill="#202326"/>`;
    for (let i = 1; i < 5; i++) n += `<line x1="-.33" y1="${r((-0.74 + i * 0.024) * 1000) / 1000}" x2=".33" y2="${r((-0.74 + i * 0.024) * 1000) / 1000}" stroke="#4a4f55" stroke-width=".006"/>`;
    n += `<path d="M-.55 -.38 L.55 -.38 L.5 -.3 L-.5 -.3 Z" fill="#1d1f22"/>`;
    n += pl(-0.53);
  } else {
    for (const sx2 of [-1, 1]) n += `<path d="M${sx2 * (hw - 0.03)} ${-hT + 0.04} L${sx2 * (hw - 0.03)} -.6 L${sx2 * (hw - 0.3)} -.6 L${sx2 * (hw - 0.3)} -.72 L${sx2 * (hw - 0.14)} -.74 L${sx2 * (hw - 0.14)} ${-hT + 0.04} Z" fill="#c4271f" stroke="#6e120d" stroke-width=".01"/>`;
    n += `<rect x="-.3" y="${-hT + 0.08}" width=".6" height=".04" rx=".02" fill="${lack(-0.4)}"/><circle cy="-.78" r=".05" fill="#cfd4d8"/>`;
    n += pl(-0.66);
    for (const sx2 of [-1, 1]) n += `<rect x="${sx2 * (hw - 0.2) - 0.08}" y="-.36" width=".16" height=".04" rx=".02" fill="#9b1b14"/>`;
  }
  n += `<path d="M${-hw + 0.08} ${-hT + 0.02} L${hw - 0.08} ${-hT + 0.02}" stroke="#fff" stroke-width=".02" opacity=".35"/>`;
  g += `<g transform="translate(${o[0]} ${o[1]}) scale(${r(s * 100) / 100})">${n}</g>`;
  /* Außenspiegel */
  const zsp = heck ? L - 1.2 : 1.15;
  for (const sx2 of [-1, 1]) { const a = P(X + sx2 * (hw + 0.14), Zn + zsp, 1.04), b = P(X + sx2 * (hw - 0.02), Zn + zsp, 0.94); g += `<rect x="${r(Math.min(a[0], b[0]))}" y="${r(Math.min(a[1], b[1]))}" width="${r(Math.abs(a[0] - b[0]))}" height="${r(Math.abs(a[1] - b[1]) + 0.04 * s)}" rx=".6" fill="${lack(-0.2)}"/>`; }
  return g;
}
S.def(`<linearGradient id="${S.id("autoglas")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5f7686"/><stop offset=".55" stop-color="#2a3843"/><stop offset="1" stop-color="#3d505e"/></linearGradient>`);

/* Raummaße */
const HD = 2.5, ZW = 18.3, ZB = 13.0;      // Deckenhöhe, Rückwand, Vorderkante der Stellplätze

/* =====================================================================
   KULISSE — Betondecke mit Unterzügen, Rückwand mit Öffnungen, Boden
   ===================================================================== */
{
  let k = `<rect width="320" height="200" fill="#8f8c86"/>`;
  /* Decke */
  k += poly([P(-30, 2.2, HD), P(30, 2.2, HD), P(30, ZW, HD), P(-30, ZW, HD)], S.lg("decke", [[0, "#9c9a95"], [1, "#c4c1ba"]]));
  for (let Z = 3; Z < ZW; Z += 0.8) k += linie(P(-30, Z, HD), P(30, Z, HD), "#8f8c86", r(Math.min(0.4, 2 / Z)));
  /* Unterzüge quer (in Z-Richtung) alle 5 m */
  for (const X of [-12.5, -7.5, -2.6, 2.4, 7.4, 12.4]) {
    k += poly([P(X - 0.2, 2.5, HD - 0.4), P(X + 0.2, 2.5, HD - 0.4), P(X + 0.2, ZW, HD - 0.4), P(X - 0.2, ZW, HD - 0.4)], "#b3b0a9");
    k += poly([P(X + (X < 0 ? 0.2 : -0.2), 2.5, HD), P(X + (X < 0 ? 0.2 : -0.2), ZW, HD), P(X + (X < 0 ? 0.2 : -0.2), ZW, HD - 0.4), P(X + (X < 0 ? 0.2 : -0.2), 2.5, HD - 0.4)], "#8a8781");
  }
  /* Sprinklerrohr (rot) */
  k += linie(P(-30, 9.5, HD - 0.15), P(30, 9.5, HD - 0.15), "#b3261e", "1.1");
  /* Leuchtstoffröhren */
  for (const Z of [6, 10, 14.5]) for (const X of [-7, -2.5, 2, 6.5, 11]) k += poly([P(X - 0.6, Z, HD - 0.03), P(X + 0.6, Z, HD - 0.03), P(X + 0.6, Z + 0.12, HD - 0.03), P(X - 0.6, Z + 0.12, HD - 0.03)], "#fffef0");
  /* Rückwand: Brüstung, offene Seite mit Tageslicht und Stadt, Pfeiler */
  k += poly(fZ(ZW, -30, 30, 0, HD), "#bdb9b1");
  k += poly(fZ(ZW, -30, 30, 1.05, HD - 0.35), S.lg("draussen", [[0, "#cfe3f1"], [0.7, "#eef3ec"], [1, "#d9e1d0"]]));
  for (const [x0, w, h, f] of [[-12, 4, 0.9, "#c9c1b2"], [-7, 5, 1.2, "#d9cdb8"], [-1.5, 3.5, 0.7, "#b7b2a8"], [3, 5, 1.1, "#d0c6b6"], [9, 4, 0.8, "#c2bcb1"]]) k += poly(fZ(ZW + 0.01, x0, x0 + w, 1.05, 1.05 + h), f);
  for (let X = -30; X < 30; X += 5) k += poly(fZ(ZW, X - 0.25, X + 0.25, 0, HD), "#a9a59d");
  k += poly(fZ(ZW, -30, 30, 0.95, 1.05), "#d8d4cb");
  /* Boden: Beton, Ölflecken, Fahrgasse mit Pfeilen */
  k += poly([P(-30, 2.2), P(30, 2.2), P(30, ZW), P(-30, ZW)], S.lg("boden", [[0, "#8e8c87"], [1, "#77756f"]]));
  for (let i = 0; i < 9; i++) { const X = -6 + rnd() * 14, Z = 14 + rnd() * 3.5, p = P(X, Z); k += `<ellipse cx="${p[0]}" cy="${p[1]}" rx="${r(2 + rnd() * 3)}" ry="${r(0.6 + rnd())}" fill="#3a3834" opacity=".25"/>`; }
  for (let i = 0; i < 220; i++) { const p = [rnd() * 320, 100 + rnd() * 100]; k += `<circle cx="${r(p[0])}" cy="${r(p[1])}" r="${r(0.2 + rnd() * 0.3)}" fill="${rnd() < 0.5 ? "#a19e97" : "#62605b"}" opacity=".5"/>`; }
  /* Fahrbahnpfeile in der Fahrgasse (weiß, flach) */
  for (const [X, Z] of [[1.5, 9.4], [6, 9.4]]) k += `<g opacity=".85">${bodenText(X, Z, 0.9, "◀", "#eeeeea")}</g>`;
  k += `<g opacity=".7">${bodenText(-0.2, 10.6, 0.5, "AUSFAHRT", "#eeeeea")}</g>`;
  /* Fußgängerüberweg (weiße Balken) quer über die Fahrgasse */
  for (let X = -2.4; X < 9; X += 0.9) k += poly(boden(X, X + 0.5, 7.2, 8.6, 0.004), "#ecebe6", ` opacity=".85"`);
  /* Entwässerungsrinne */
  k += poly(boden(-8, 12, 5.6, 5.75, 0.003), "#4a4844");
  for (let X = -6; X < 12; X += 0.25) k += linie(P(X, 5.6, 0.004), P(X, 5.75, 0.004), "#8e8c87", ".4");
  /* Lüftungsrohr (verzinkt) und Kabeltrasse unter der Decke */
  { const a = P(-30, 7.4, 2.32), b = P(30, 7.4, 2.32), d = 0.36 * M(7.4);
    k += poly([[a[0], a[1] - d / 2], [b[0], b[1] - d / 2], [b[0], b[1] + d / 2], [a[0], a[1] + d / 2]], S.lg("rohr", [[0, "#e9ecee"], [0.45, "#c3c9ce"], [1, "#8d969e"]]));
    for (let X = -12; X < 14; X += 2) { const c = P(X, 7.4, 2.32); k += linie([c[0], c[1] - d / 2], [c[0], c[1] + d / 2], "#9aa3aa", ".5"); } }
  k += poly([P(-30, 12, HD - 0.12), P(30, 12, HD - 0.12), P(30, 12.4, HD - 0.12), P(-30, 12.4, HD - 0.12)], "#7d868d");
  S.hinten(k);
}

/* =====================================================================
   1 — DIE LAMPE (Leuchtstoffröhren an der Decke) — als ein Ding
   ===================================================================== */
{
  let k = "";
  for (const X of [2]) { const a = P(X - 0.6, 6, HD - 0.03), b = P(X + 0.6, 6.12, HD - 0.03); k += `<rect x="${r(a[0] - 1)}" y="${r(a[1] - 2.2)}" width="${r(b[0] - a[0] + 2)}" height="4.6" rx="1" fill="#d7d9d6"/><rect x="${a[0]}" y="${r(a[1] - 1)}" width="${r(b[0] - a[0])}" height="2.2" rx="1" fill="#fffef4"/><rect x="${a[0]}" y="${r(a[1] - 1)}" width="${r(b[0] - a[0])}" height="2.2" rx="1" fill="#fffbd6" opacity=".6" filter="url(#bw_weich)"/>`; }
  const p = P(2, 6, HD);
  S.teil({ id: "ph_lampe", de: "die Lampe", syl: "LAM-pe", it: "la lampada", itSyl: "LAM-pa-da", en: "light", x: p[0], y: p[1], kunst: absolut(p[0], p[1], k),
    tipp: "Im Parkhaus brennt das Licht Tag und Nacht." });
}

/* =====================================================================
   2 — DIE RAMPE (links, zur Ebene 1 hinauf)
   ===================================================================== */
const RAMPE = { X0: -6.0, X1: -3.0 };
{
  const { X0, X1 } = RAMPE;
  let k = "";
  const Za = 10.5, Zb = ZW + 6, Hb = HD + 0.6;
  const H = (Z) => Math.max(0, (Z - Za) / (Zb - Za) * Hb);
  /* Fahrbahn der Rampe (steigt nach hinten), Rillen gegen Glätte */
  k += poly([P(X0, Za, 0), P(X1, Za, 0), P(X1, ZW, H(ZW)), P(X0, ZW, H(ZW))], S.lg("rampe", [[0, "#8a8781"], [1, "#a3a09a"]]));
  for (let Z = Za + 0.4; Z < ZW; Z += 0.4) k += linie(P(X0, Z, H(Z)), P(X1, Z, H(Z)), "#77746e", ".3");
  k += linie(P(X0 + 0.05, Za, 0), P(X0 + 0.05, ZW, H(ZW)), "#f2c230", "1");
  /* rechte Brüstung (Betonwand) mit gelb-schwarzer Kante */
  k += poly([P(X1, Za - 0.2, 0.9), P(X1, ZW, H(ZW) + 0.9), P(X1, ZW, H(ZW)), P(X1, Za - 0.2, 0)], "#b8b4ac");
  for (let i = 0; i < 6; i++) { const Z = Za - 0.2 + i * 0.25; k += poly([P(X1, Z, 0.9), P(X1, Z + 0.12, 0.9), P(X1, Z + 0.12, 0.0), P(X1, Z, 0.0)], i % 2 ? "#1d1f22" : "#f2c230"); }
  /* Schild „Ebene 1“ mit Pfeil nach oben */
  const s = P(X1 - 0.2, ZW - 1, HD - 0.4);
  k += `<rect x="${r(s[0] - 9)}" y="${r(s[1])}" width="18" height="7" rx=".8" fill="#2f6fb3"/>` + T(s[0] - 2, s[1] + 5, 4.2, "1", "#fff", "middle", "bold") + `<path d="M${r(s[0] + 4)} ${r(s[1] + 5.6)} v-4.4 m-1.6 1.6 l1.6 -1.6 l1.6 1.6" stroke="#fff" stroke-width=".8" fill="none"/>`;
  const f = P((X0 + X1) / 2, Za);
  S.teil({ id: "ph_rampe", de: "die Rampe", syl: "RAM-pe", it: "la rampa", itSyl: "RAM-pa", en: "ramp", x: f[0], y: f[1], kunst: absolut(f[0], f[1], k),
    tipp: "Über die Rampe fährt man auf die nächste Ebene." });
}

/* =====================================================================
   3 — DER BEHINDERTENPARKPLATZ und 4 — DER STELLPLATZ (Linien, Nummer)
   ===================================================================== */
const PL = { B: [-2.8, 0.7], A1: [0.7, 3.2], K: [3.2, 5.7] };
{
  const [X0, X1] = PL.B;
  let k = poly(boden(X0, X1, ZB, ZW - 0.1, 0.005), "#2f63a8", ` opacity=".25"`);
  for (const X of [X0, X1]) k += poly(boden(X - 0.06, X + 0.06, ZB, ZW - 0.1, 0.01), "#f2f2ee");
  /* Rollstuhl-Zeichen auf dem Boden */
  const c = X0 + 1.0;
  k += poly(boden(c - 0.75, c + 0.75, 14.2, 16.0, 0.01), "#1f4f9c");
  { const o = P(c, 15.1), ex = P(c + 1, 15.1), ez = P(c, 16.1);
    k += `<g transform="matrix(${r((ex[0] - o[0]) * 10) / 100} ${r((ex[1] - o[1]) * 10) / 100} ${r((o[0] - ez[0]) * 10) / 100} ${r((o[1] - ez[1]) * 10) / 100} ${o[0]} ${o[1]})"><circle cx="-1" cy="-6" r="1.3" fill="#fff"/><path d="M-1.2 -4.2 L-1.6 1 L3 1 L4.6 5" stroke="#fff" stroke-width="1.2" fill="none" stroke-linecap="round"/><path d="M-1.4 -2 L2.6 -2" stroke="#fff" stroke-width="1.1"/><circle cx="-.6" cy="3.6" r="3.6" fill="none" stroke="#fff" stroke-width="1"/></g>`; }
  /* Schild an der Rückwand */
  const a = P(c - 0.35, ZW - 0.02, 1.95), b = P(c + 0.35, ZW - 0.02, 1.25);
  k += `<rect x="${a[0]}" y="${a[1]}" width="${r(b[0] - a[0])}" height="${r(b[1] - a[1])}" rx=".6" fill="#1f4f9c" stroke="#fff" stroke-width=".4"/>`;
  { const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], s = (b[0] - a[0]) / 14; k += `<g transform="translate(${r(m[0])} ${r(m[1])}) scale(${r(s * 100) / 100})"><circle cx="-1" cy="-5" r="1.3" fill="#fff"/><path d="M-1.2 -3.4 L-1.6 1.4 L2.6 1.4 L4 5" stroke="#fff" stroke-width="1.2" fill="none" stroke-linecap="round"/><circle cx="-.6" cy="3.4" r="3" fill="none" stroke="#fff" stroke-width="1"/></g>`; }
  const f = P(c, ZB);
  S.teil({ id: "ph_behindertenplatz", de: "der Behindertenparkplatz", syl: "Be-HIN-der-ten-park-platz", it: "il posto per disabili", itSyl: "PO-sto per di-SA-bi-li", en: "disabled parking space", x: f[0], y: f[1], kunst: absolut(f[0], f[1], k),
    tipp: "Nur mit Ausweis im Fenster. Sonst wird abgeschleppt." });
}
{
  const [X0, X1] = PL.A1;
  let k = "";
  for (const X of [X0, X1, PL.K[1]]) k += poly(boden(X - 0.06, X + 0.06, ZB, ZW - 0.1, 0.01), "#f2f2ee");
  k += poly(boden(X0, PL.K[1], ZB - 0.06, ZB + 0.06, 0.01), "#f2f2ee", ` opacity=".7"`);
  /* Stellplatznummern an der Wand */
  for (const [X, n] of [[(X0 + X1) / 2, "C 12"], [(PL.K[0] + PL.K[1]) / 2, "C 13"], [(PL.B[0] + PL.B[1]) / 2 + 1.2, "C 11"]]) {
    const a = P(X - 0.42, ZW - 0.02, 2.12), b = P(X + 0.42, ZW - 0.02, 1.78);
    k += `<rect x="${a[0]}" y="${a[1]}" width="${r(b[0] - a[0])}" height="${r(b[1] - a[1])}" rx=".5" fill="#3a9a52"/>` + T((a[0] + b[0]) / 2, b[1] - 1.3, r((b[1] - a[1]) * 0.78), n, "#fff", "middle", "bold");
  }
  k += `<g opacity=".9">${bodenText((X0 + X1) / 2, ZB + 0.5, 0.55, "C 12", "#f2f2ee")}</g>`;
  const f = P((X0 + X1) / 2, ZB);
  S.teil({ id: "ph_stellplatz", de: "der Stellplatz", syl: "STELL-platz", it: "il posto auto", itSyl: "PO-sto AU-to", en: "parking space", x: f[0], y: f[1], kunst: absolut(f[0], f[1], k),
    tipp: "Zwischen die weißen Linien, nicht darauf. Jeder Platz hat eine Nummer." });
}

/* =====================================================================
   5 — DAS TREPPENHAUS (Tür in der Rückwand) mit 6 — DEM FLUCHTWEGSCHILD
       und 7 — DEM KASSENAUTOMATEN (Lupe: Parkschein, Münzeinwurf, Kartenleser)
   ===================================================================== */
{
  const X0 = 8.0, X1 = 9.1;
  let k = poly(fZ(ZW - 0.02, X0 - 0.5, X1 + 0.5, 0, HD - 0.35), "#cfcbc2");
  k += poly(fZ(ZW - 0.03, X0, X1, 0, 2.05), S.lg("tuer", [[0, "#4a6b8a"], [1, "#36536e"]]));
  k += poly(fZ(ZW - 0.04, X0 + 0.12, X1 - 0.12, 1.1, 1.9), "#c9dce8");
  { const g1 = P(X0 + 0.15, ZW - 0.05, 1.0), g2 = P(X0 + 0.45, ZW - 0.05, 1.0); k += linie(g1, g2, "#d9dde0", "1"); }
  k += T(P((X0 + X1) / 2, ZW, 2.2)[0], P(0, ZW, 2.12)[1], 2.6, "Treppenhaus", "#3b4148", "middle", "bold");
  const f = P((X0 + X1) / 2, ZW);
  S.teil({ id: "ph_treppenhaus", de: "das Treppenhaus", syl: "TREP-pen-haus", it: "la tromba delle scale", itSyl: "TROM-ba del-le SCA-le", en: "stairwell", x: f[0], y: f[1], steht: true, kunst: absolut(f[0], f[1], k),
    tipp: "Durch das Treppenhaus geht man zu Fuß hinaus." });
}
{
  /* Fluchtweg: grünes Leuchtschild, hängt quer über der Fahrgasse */
  const Z = 10.5, X0 = 3.4, X1 = 5.4, H0 = 2.0, H1 = 2.3;
  const a = P(X0, Z, H1), b = P(X1, Z, H0), w = b[0] - a[0], h = b[1] - a[1];
  let k = linie(P(X0 + 0.3, Z, H1), P(X0 + 0.3, Z, HD), "#5b5f63", ".5") + linie(P(X1 - 0.3, Z, H1), P(X1 - 0.3, Z, HD), "#5b5f63", ".5");
  k += `<rect x="${a[0]}" y="${a[1]}" width="${r(w)}" height="${r(h)}" rx=".6" fill="#1f9a4a" stroke="#e9f7ee" stroke-width=".5"/>`;
  /* Piktogramm: rennende Person zur Tür, Pfeil nach rechts */
  const s = h / 10, ox = a[0] + w * 0.12, oy = a[1] + h * 0.5;
  k += `<g transform="translate(${r(ox)} ${r(oy)}) scale(${r(s * 100) / 100})"><rect x="6" y="-4" width="4.4" height="8.6" fill="none" stroke="#fff" stroke-width=".9"/><circle cx="1.4" cy="-3.2" r="1.2" fill="#fff"/><path d="M1 -1.6 L.2 1.6 L-1.8 4 M.2 1.6 L2 3 L2.6 4.6 M1 -1 L3 0 M1 -1 L-1 -.2" stroke="#fff" stroke-width="1.1" fill="none" stroke-linecap="round"/></g>`;
  k += `<path d="M${r(a[0] + w * 0.55)} ${r(oy)} h${r(w * 0.32)} m-${r(h * 0.32)} -${r(h * 0.3)} l${r(h * 0.32)} ${r(h * 0.3)} l-${r(h * 0.32)} ${r(h * 0.3)}" stroke="#fff" stroke-width="${r(h * 0.14)}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  const m = P((X0 + X1) / 2, Z, H0);
  S.teil({ id: "ph_fluchtweg", de: "das Fluchtwegschild", syl: "FLUCHT-weg-schild", it: "il cartello dell'uscita di emergenza", itSyl: "car-TEL-lo del-lu-SCI-ta di e-mer-GEN-za", en: "emergency exit sign", x: m[0], y: m[1], kunst: absolut(m[0], m[1], k),
    tipp: "Das grüne Schild zeigt im Notfall den Weg nach draußen." });
}
const KA = { X0: 9.6, X1: 10.3, Z: ZW - 0.45 };
{
  const { X0, X1, Z } = KA, m = M(Z);
  const a = P(X0, Z, 1.8), b = P(X1, Z, 0), w = b[0] - a[0], h = b[1] - a[1], x = a[0], y = a[1];
  let k = schatten(x + w / 2, b[1], w * 0.7, 0.8, 0.3);
  k += `<rect x="${r(x)}" y="${r(y)}" width="${r(w)}" height="${r(h)}" rx=".8" fill="${S.lg("kasse", [[0, "#e6eaec"], [1, "#aeb6bc"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${r(x)}" y="${r(y)}" width="${r(w)}" height="${r(0.2 * m)}" rx=".8" fill="#1f4f9c"/>` + T(x + w / 2, y + 0.15 * m, r(0.13 * m), "KASSE", "#fff", "middle", "bold");
  k += `<rect x="${r(x + w * 0.14)}" y="${r(y + 0.3 * m)}" width="${r(w * 0.72)}" height="${r(0.28 * m)}" rx=".3" fill="#0d2436"/>` + T(x + w / 2, y + 0.48 * m, r(0.09 * m), "4,50 €", "#7cff8a", "middle", "bold", "monospace");
  /* Parkschein im Schlitz, Münzeinwurf, Kartenleser, Ausgabe */
  const ps = [x + w * 0.2, y + 0.72 * m], mu = [x + w * 0.62, y + 0.74 * m], kl = [x + w * 0.3, y + 0.98 * m];
  k += `<rect x="${r(ps[0] - 0.4)}" y="${r(ps[1] + 0.8)}" width="${r(w * 0.3)}" height=".5" fill="#111"/><rect x="${r(ps[0] + 0.2)}" y="${r(ps[1] - 1.6)}" width="${r(w * 0.22)}" height="2.6" fill="#f6f1df" stroke="#9a8f6a" stroke-width=".1"/>`;
  k += `<rect x="${r(mu[0])}" y="${r(mu[1])}" width="${r(w * 0.22)}" height="${r(w * 0.22)}" rx=".3" fill="#2b3036"/><rect x="${r(mu[0] + w * 0.09)}" y="${r(mu[1] + 0.3)}" width=".35" height="${r(w * 0.16)}" fill="#c9a227"/>`;
  k += `<rect x="${r(kl[0])}" y="${r(kl[1])}" width="${r(w * 0.4)}" height="${r(w * 0.18)}" rx=".3" fill="#2b3036"/><rect x="${r(kl[0] + w * 0.04)}" y="${r(kl[1] + w * 0.07)}" width="${r(w * 0.32)}" height=".3" fill="#9aa3aa"/>`;
  k += `<rect x="${r(x + w * 0.2)}" y="${r(y + 1.3 * m)}" width="${r(w * 0.6)}" height="${r(0.14 * m)}" rx=".5" fill="#15181b"/>`;
  k += `<rect x="${r(x + 0.4)}" y="${r(y + 0.4)}" width=".8" height="${r(h - 0.8)}" rx=".4" fill="#fff" opacity=".35"/>`;
  const un = (id, de, syl, it, itSyl, en, cx, cy, ww, hh, tipp) => ({ id, de, syl, it, itSyl, en, tipp, x: r(cx), y: r(cy + hh / 2), kunst: flaeche(-ww / 2, -hh, ww, hh) });
  const unter = [
    un("ph_parkschein", "der Parkschein", "PARK-schein", "il biglietto del parcheggio", "bi-GLIET-to", "parking ticket", ps[0] + w * 0.13, ps[1], 3.4, 4, "Darauf steht die Uhrzeit der Einfahrt. Er gehört ins Auto und nachher in den Automaten."),
    un("ph_muenzeinwurf", "der Münzeinwurf", "MÜNZ-ein-wurf", "la fessura per le monete", "fes-SU-ra per le mo-NE-te", "coin slot", mu[0] + w * 0.11, mu[1] + w * 0.11, 3.2, 3.2, "Hier wirft man die Münzen ein."),
    un("ph_kartenleser", "der Kartenleser", "KAR-ten-le-ser", "il lettore di carte", "let-TO-re di CAR-te", "card reader", kl[0] + w * 0.2, kl[1] + w * 0.09, 4.4, 2.6, "Man kann auch mit Karte zahlen."),
  ];
  const cx = r(x + w / 2);
  S.teil({ id: "ph_automat", de: "der Kassenautomat", syl: "KAS-sen-au-to-mat", it: "la cassa automatica", itSyl: "CAS-sa au-to-MA-ti-ca", en: "pay station", x: cx, y: b[1], steht: true, kunst: absolut(cx, b[1], k),
    zoom: { x: cx - 13.5, y: y - 2, w: 27, h: 18 }, unter,
    tipp: "Erst hier zahlen, dann zum Auto. Wer es vergisst, steht an der Schranke fest." });
}

/* =====================================================================
   10 — DAS AUTO (rückwärts eingeparkt) und 11 — DER KOMBI (vorwärts)
   ===================================================================== */
{
  const X = (PL.A1[0] + PL.A1[1]) / 2, Z = ZB + 0.2 + 2.15;
  const k = auto({ X, Zn: ZB + 0.2, L: 4.3, W: 1.8, heck: false, farbe: "#2f5f95", kennz: "M-DA 412" });
  const f = P(X, ZB + 0.2);
  S.teil({ id: "ph_auto1", de: "das Auto", syl: "AU-to", it: "l'automobile", itSyl: "au-to-MO-bi-le", en: "car", x: f[0], y: f[1], steht: true, kunst: absolut(f[0], f[1], k),
    tipp: "Rückwärts einparken ist hier normal — beim Herausfahren sieht man dann besser." });
}
{
  const X = (PL.K[0] + PL.K[1]) / 2 + 0.05, Z = ZB + 0.25 + 2.35;
  const k = auto({ X, Zn: ZB + 0.25, L: 4.7, W: 1.84, heck: true, kombi: true, farbe: "#c9ccce", kennz: "B-XA 2207" });
  const f = P(X, ZB + 0.25);
  S.teil({ id: "ph_auto2", de: "der Kombi", syl: "KOM-bi", it: "la familiare", itSyl: "fa-mi-LIA-re", en: "estate car", x: f[0], y: f[1], steht: true, kunst: absolut(f[0], f[1], k),
    tipp: "Der Kombi hat hinten viel Platz für Gepäck." });
}

/* =====================================================================
   8 — DIE SÄULEN (Beton, mit Ebene-Farbe) und 9 — DIE EBENE (Schild)
   ===================================================================== */
const SAEULEN = [[-2.95, ZB - 0.1], [3.2, ZB - 0.1]];
{
  let k = "";
  SAEULEN.forEach(([X, Z]) => {
    const d = 0.22;
    /* sichtbare Seite (zur Bildmitte) */
    const sx = X < 0 ? X + d : X - d;
    k += poly([P(sx, Z - d, HD - 0.4), P(sx, Z + d, HD - 0.4), P(sx, Z + d, 0), P(sx, Z - d, 0)], "#96938c");
    k += poly(fZ(Z - d, X - d, X + d, 0, HD - 0.4), S.lg("saeule", [[0, "#c9c6bf"], [0.5, "#b9b6ae"], [1, "#a8a59d"]], 0, 0, 1, 0));
    /* Farbband der Ebene (grün) mit gelb-schwarzem Anfahrschutz unten */
    k += poly(fZ(Z - d - 0.01, X - d, X + d, 1.3, 1.75), "#3a9a52");
    for (let i = 0; i < 4; i++) k += poly(fZ(Z - d - 0.01, X - d, X + d, i * 0.15, i * 0.15 + 0.075), "#1d1f22") + poly(fZ(Z - d - 0.01, X - d, X + d, i * 0.15 + 0.075, i * 0.15 + 0.15), "#f2c230");
  });
  const f = P(SAEULEN[1][0], SAEULEN[1][1] - 0.22);
  S.teil({ id: "ph_saeule", de: "die Säule", syl: "SÄU-le", it: "la colonna", itSyl: "co-LON-na", en: "pillar", x: f[0], y: f[1], steht: true, kunst: absolut(f[0], f[1], k),
    tipp: "Die Säulen tragen die Decke. Vorsicht beim Einparken!" });
}
{
  /* großes Ebene-Schild an der mittleren Säule: „0 C“ */
  const [X, Z] = SAEULEN[1], d = 0.23;
  const a = P(X - d - 0.25, Z - d - 0.03, 2.05), b = P(X + d + 0.25, Z - d - 0.03, 1.32);
  const w = b[0] - a[0], h = b[1] - a[1];
  let k = `<rect x="${a[0]}" y="${a[1]}" width="${r(w)}" height="${r(h)}" rx=".8" fill="#ffffff" stroke="#3a9a52" stroke-width=".7"/>`;
  k += `<rect x="${r(a[0] + 0.8)}" y="${r(a[1] + 0.8)}" width="${r(w / 2 - 1.2)}" height="${r(h - 1.6)}" rx=".5" fill="#3a9a52"/>` + T(a[0] + w / 4 + 0.2, b[1] - h * 0.22, r(h * 0.62), "0", "#fff", "middle", "bold");
  k += T(a[0] + w * 0.75, b[1] - h * 0.22, r(h * 0.62), "C", "#3a9a52", "middle", "bold");
  const m = [r((a[0] + b[0]) / 2), b[1]];
  S.teil({ oben: true, id: "ph_ebene", de: "die Ebene", syl: "E-be-ne", it: "il piano", itSyl: "PIA-no", en: "level", x: m[0], y: m[1], kunst: absolut(m[0], m[1], k),
    tipp: "Ebene 0, Reihe C — man muss sich merken, wo das Auto steht." });
}
{
  /* Feuerlöscher an der linken Säule */
  const [X, Z] = SAEULEN[0], p = P(X, Z - 0.24, 0.45), m = M(Z);
  let k = `<rect x="${r(-0.08 * m)}" y="${r(-0.56 * m)}" width="${r(0.16 * m)}" height="${r(0.56 * m)}" rx="1.2" fill="${S.lg("loescher", [[0, "#e0403a"], [1, "#a8231d"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${r(-0.05 * m)}" y="${r(-0.64 * m)}" width="${r(0.1 * m)}" height="${r(0.09 * m)}" fill="#2b2f33"/><path d="M${r(0.04 * m)} ${r(-0.6 * m)} q${r(0.1 * m)} 0 ${r(0.09 * m)} ${r(0.2 * m)}" stroke="#1d1f22" stroke-width=".7" fill="none"/>`;
  k += `<rect x="${r(-0.07 * m)}" y="${r(-0.38 * m)}" width="${r(0.14 * m)}" height="${r(0.12 * m)}" fill="#fff" opacity=".85"/>`;
  S.teil({ oben: true, id: "ph_feuerloescher", de: "der Feuerlöscher", syl: "FEU-er-lö-scher", it: "l'estintore", itSyl: "e-stin-TO-re", en: "fire extinguisher", x: p[0], y: p[1], kunst: k,
    tipp: "Mit dem Feuerlöscher löscht man ein kleines Feuer." });
}

/* =====================================================================
   12 — DIE DURCHFAHRTSHÖHE (gelb-schwarzer Balken über der Ausfahrt)
   ===================================================================== */
{
  const Z = 9.2, X0 = RAMPE.X0 - 0.3, X1 = RAMPE.X1 + 0.3, H0 = 2.0, H1 = 2.28;
  let k = linie(P(X1 - 0.3, Z, H1), P(X1 - 0.3, Z, HD), "#3b4148", ".8");
  const n = 14;
  for (let i = 0; i < n; i++) { const a = X0 + (X1 - X0) * i / n, b = X0 + (X1 - X0) * (i + 1) / n; k += poly([P(a, Z, H1), P(b, Z, H1), P(b + 0.12, Z, H0), P(a + 0.12, Z, H0)], i % 2 ? "#1d1f22" : "#f2c230"); }
  /* Verkehrszeichen 265 (Höhe) darunter */
  const c = P(X1 - 0.75, Z, 1.72), R = 0.24 * M(Z);
  k += linie(P(X1 - 0.75, Z, H0), [c[0], r(c[1] - R)], "#3b4148", ".6");
  k += `<circle cx="${c[0]}" cy="${c[1]}" r="${r(R)}" fill="#fff" stroke="#c4271f" stroke-width="${r(R * 0.2)}"/>` + T(c[0], c[1] + R * 0.3, r(R * 0.7), "2 m", "#111", "middle", "bold");
  k += `<path d="M${c[0]} ${r(c[1] - R * 0.78)} l-1 1.2 h2 Z M${c[0]} ${r(c[1] + R * 0.78)} l-1 -1.2 h2 Z" fill="#111"/>`;
  const m = P(X1 - 0.75, Z, 1.72 - 0.24);
  S.teil({ id: "ph_hoehe", de: "die Durchfahrtshöhe", syl: "DURCH-fahrts-hö-he", it: "l'altezza massima", itSyl: "al-TEZ-za MAS-si-ma", en: "height limit", x: m[0], y: m[1], kunst: absolut(m[0], m[1], k),
    tipp: "Über zwei Meter kommt niemand hinein — Wohnmobile bleiben draußen." });
}

/* =====================================================================
   13 — DER TICKETAUTOMAT und 14 — DIE SCHRANKE (Ausfahrt, vorne links)
   ===================================================================== */
const SCH = { X: RAMPE.X1 + 0.55, Z: 6.9 };
{
  const { X, Z } = SCH, p0 = P(X + 0.45, Z + 0.1);
  /* Schrankenantrieb (Kasten) und Baum quer über die Fahrbahn nach links */
  const m = M(Z + 0.1);
  let k = schatten(0, 0, 0.25 * m, 0.06 * m, 0.3);
  k += `<rect x="${r(-0.17 * m)}" y="${r(-1.0 * m)}" width="${r(0.34 * m)}" height="${r(1.0 * m)}" rx="1" fill="${S.lg("antrieb", [[0, "#f6d24a"], [1, "#d9a812"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${r(-0.12 * m)}" y="${r(-0.9 * m)}" width="${r(0.24 * m)}" height="${r(0.16 * m)}" fill="#1d1f22"/><circle cx="0" cy="${r(-0.82 * m)}" r="${r(0.04 * m)}" fill="#c4271f"/>`;
  const a = P(X + 0.45, Z + 0.1, 0.92), b = P(RAMPE.X0 - 0.5, Z + 0.1, 0.92);
  const d = 0.09 * m, n = 16;
  let baum = "";
  for (let i = 0; i < n; i++) {
    const X0 = X + 0.45 + (RAMPE.X0 - 0.5 - X - 0.45) * i / n, X1 = X + 0.45 + (RAMPE.X0 - 0.5 - X - 0.45) * (i + 1) / n;
    const q0 = P(X0, Z + 0.1, 0.92), q1 = P(X1, Z + 0.1, 0.92);
    baum += poly([[q0[0], q0[1] - d / 2], [q1[0], q1[1] - d / 2], [q1[0], q1[1] + d / 2], [q0[0], q0[1] + d / 2]], i % 2 ? "#c4271f" : "#ffffff");
  }
  k += absolut(p0[0], p0[1], baum);
  k += `<circle cx="0" cy="${r(a[1] - p0[1])}" r="${r(0.07 * m)}" fill="#3b4148"/>`;
  S.teil({ id: "ph_schranke", de: "die Schranke", syl: "SCHRAN-ke", it: "la sbarra", itSyl: "SBAR-ra", en: "barrier", x: p0[0], y: p0[1], steht: true, kunst: k,
    tipp: "Sie geht erst auf, wenn der Parkschein bezahlt ist." });
}

{
  const { X, Z } = SCH, m = M(Z), p = P(X, Z);
  let k = schatten(0, 0, 0.35 * m, 0.08 * m, 0.35);
  /* Insel-Bordstein */
  k += `<rect x="${r(-0.32 * m)}" y="${r(-0.12 * m)}" width="${r(0.64 * m)}" height="${r(0.12 * m)}" fill="#f2c230"/><rect x="${r(-0.32 * m)}" y="${r(-0.12 * m)}" width="${r(0.64 * m)}" height="${r(0.04 * m)}" fill="#fff" opacity=".4"/>`;
  /* Säule mit schrägem Bedienfeld zum Fahrerfenster */
  k += `<rect x="${r(-0.2 * m)}" y="${r(-1.32 * m)}" width="${r(0.4 * m)}" height="${r(1.2 * m)}" rx="1.4" fill="${S.lg("ticket", [[0, "#3b4148"], [0.5, "#5b636b"], [1, "#2b3036"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${r(-0.17 * m)}" y="${r(-1.26 * m)}" width="${r(0.34 * m)}" height="${r(0.16 * m)}" rx=".6" fill="#1f4f9c"/>` + T(0, -1.15 * m, r(0.075 * m), "AUSFAHRT", "#fff", "middle", "bold");
  k += `<rect x="${r(-0.13 * m)}" y="${r(-1.05 * m)}" width="${r(0.26 * m)}" height="${r(0.14 * m)}" rx=".4" fill="#0d2436"/>` + T(0, -0.95 * m, r(0.06 * m), "Ticket bitte", "#7cff8a", "middle", "bold");
  k += `<rect x="${r(-0.1 * m)}" y="${r(-0.84 * m)}" width="${r(0.2 * m)}" height="${r(0.03 * m)}" fill="#111"/><path d="M0 ${r(-0.76 * m)} l${r(-0.03 * m)} ${r(0.04 * m)} h${r(0.06 * m)} Z" fill="#f2c230"/>`;
  k += `<rect x="${r(-0.08 * m)}" y="${r(-0.68 * m)}" width="${r(0.16 * m)}" height="${r(0.12 * m)}" rx="1" fill="#2b3036"/><circle cx="0" cy="${r(-0.62 * m)}" r="${r(0.035 * m)}" fill="#c4271f"/>`;
  k += `<rect x="${r(-0.17 * m)}" y="${r(-1.3 * m)}" width="${r(0.05 * m)}" height="${r(1.15 * m)}" fill="#fff" opacity=".12"/>`;
  S.teil({ id: "ph_ticketautomat", de: "der Ticketautomat", syl: "TI-cket-au-to-mat", it: "la colonnina del biglietto", itSyl: "co-lon-NI-na del bi-GLIET-to", en: "ticket machine", x: p[0], y: p[1], steht: true, kunst: k,
    tipp: "An der Ausfahrt steckt man das bezahlte Ticket hier hinein." });
}
/* =====================================================================
   15 — DER FUSSGÄNGER (geht über den freien Platz) und
   16 — DIE AUTOFAHRERIN (zahlt am Kassenautomaten)
   ===================================================================== */
{
  const X = -0.6, Z = 10.6, p = P(X, Z);
  const m = B.mensch({ id: "ph_fuss", geschlecht: "m", pose: "gehen", blick: 70, frisur: "kurz", haarfarbe: "braun", haut: "mittel",
    kleidung: { oberteil: { stueck: "pullover", farbe: "#c9a227" }, jacke: { stueck: "jacke", farbe: "#2f5a35" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" }, zubehoer: { stueck: "rucksack", farbe: "#3b4148" } } }, 1.78 * M(Z));
  S.teil({ id: "ph_fussgaenger", de: "der Fußgänger", syl: "FUSS-gän-ger", it: "il pedone", itSyl: "pe-DO-ne", en: "pedestrian", x: p[0], y: p[1], kunst: m.svg,
    tipp: "Im Parkhaus geht man zwischen den Autos — langsam und mit Blick nach beiden Seiten." });
}
{
  const X = KA.X0 - 0.45, Z = KA.Z - 0.35, p = P(X, Z);
  const m = B.mensch({ id: "ph_kundin", geschlecht: "w", pose: "servieren", blick: 75, frisur: "lang", haarfarbe: "schwarz", haut: "hell",
    kleidung: { oberteil: { stueck: "bluse", farbe: "weiss" }, jacke: { stueck: "mantel", farbe: "#8a2f3a" }, unterteil: { stueck: "hose", farbe: "schwarz" }, schuhe: { stueck: "stiefel" }, zubehoer: { stueck: "tasche", farbe: "#2f3035" } } }, 1.68 * M(Z));
  S.teil({ id: "ph_kundin", de: "die Autofahrerin", syl: "AU-to-fah-re-rin", it: "l'automobilista", itSyl: "au-to-mo-bi-LI-sta", en: "driver", x: p[0], y: p[1], kunst: m.svg,
    tipp: "Sie steckt den Parkschein in den Automaten und zahlt." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/parkhaus.js"));
console.log(aus);
