#!/usr/bin/env node
/* =====================================================================
   DIE MÜLLTRENNUNG (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (Abfallratgeber der Städte, Vattenfall „Irrtümer bei der
   Mülltrennung“, Stadt Stuttgart „neue Mülltonnen“, Mieterverein):
   - Am Mehrfamilienhaus steht der MÜLLPLATZ im Hof, die 240-Liter-Tonnen
     (zwei Räder hinten, Griff am Deckel) an der Hauswand:
       grau / anthrazit  = RESTMÜLL (Windeln, Asche, Staubsaugerbeutel)
       blau              = PAPIER / PAPPE (Zeitungen, Kartons gefaltet)
       braun             = BIOABFALL (Obst- und Gemüsereste, Kaffeesatz)
       gelb              = Leichtverpackungen: GELBE TONNE oder, wie hier,
                           der durchsichtige GELBE SACK (Joghurtbecher,
                           Dosen, Getränkekartons).
     Aufkleber auf den Tonnen nennen, was hinein darf.
   - GLAS kommt NICHT in die Tonnen, sondern in die öffentlichen
     Glascontainer am Gehweg, getrennt nach WEISS-, GRÜN- und BRAUNGLAS
     (blaues Glas → Grünglas). Einwurfzeiten werktags 7–20 Uhr.
   - PFANDFLASCHEN (Pfandzeichen) gehören zurück in den Laden, nicht in
     den Gelben Sack oder Container — sie werden im Kasten gesammelt.
   - SPERRMÜLL nur nach Anmeldung; der Hinweis und der ABFUHRKALENDER
     hängen im Schaukasten der Hausverwaltung.
   PERSPEKTIVE: Fluchtpunkt (160 | 86), Augenhöhe 1,6 m, Brennweite 230.
   Hauswand 7 m entfernt (≈ 33 Einheiten je Meter), Tonnen davor,
   Glascontainer auf dem Gehweg 9,6 m, gegenüberliegende Häuser 20 m.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "muelltrennung", titel: "Die Mülltrennung", emoji: "♻️", thema: "Alltag", kuerzel: "b16b", fassung: 852 });
const rnd = zufall(1974);
const r = B.r;

const F = 230, CAM = 1.6, HZ = 86, VX = 160;
const P = (X, Y, Z) => [r(VX + F * X / Z), r(HZ + F * (CAM - Y) / Z)];
const s = (Z) => F / Z;
const boden = (Z) => HZ + F * CAM / Z;
const poly = (pts, fill, extra = "") => `<path d="M${pts.map((p) => p.join(" ")).join(" L")} Z" fill="${fill}"${extra}/>`;
function quader(X0, X1, Y0, Y1, Z0, Z1, farben, ox = 0, oy = 0) {
  const q = (X, Y, Z) => { const [x, y] = P(X, Y, Z); return [r(x - ox), r(y - oy)]; };
  let g = "";
  if (Y1 < CAM && farben.oben) g += poly([q(X0, Y1, Z0), q(X1, Y1, Z0), q(X1, Y1, Z1), q(X0, Y1, Z1)], farben.oben);
  if (X1 < 0 && farben.seite) g += poly([q(X1, Y0, Z0), q(X1, Y0, Z1), q(X1, Y1, Z1), q(X1, Y1, Z0)], farben.seite);
  if (X0 > 0 && farben.seite) g += poly([q(X0, Y0, Z0), q(X0, Y0, Z1), q(X0, Y1, Z1), q(X0, Y1, Z0)], farben.seite);
  g += poly([q(X0, Y0, Z0), q(X1, Y0, Z0), q(X1, Y1, Z0), q(X0, Y1, Z0)], farben.vorne);
  return g;
}

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const ZW = 7, GW = boden(ZW), SW = s(ZW);            // Hauswand
const XE = 1.1, XECK = P(XE, 0, ZW)[0];              // Hausecke
const ZG = 9.6;                                      // Glascontainer
const ZO = 20;                                       // Häuser gegenüber

/* =====================================================================
   KULISSE — rechts der Blick auf die Straße, links die Hauswand, Hofpflaster
   ===================================================================== */
{
  let k = `<rect width="320" height="200" fill="${S.lg("himmel", [[0, "#b9d3e6"], [1, "#e4eef4"]])}"/>`;
  /* Häuser gegenüber (Z = 20) */
  const g0 = boden(ZO), so = s(ZO);
  const farben = ["#d9c7a8", "#c9d1c4", "#e3d3c1"];
  for (let i = 0; i < 3; i++) {
    const x0 = 150 + i * 62, top = g0 - (14 + (i % 2) * 2) * so;
    k += `<rect x="${x0}" y="${r(top)}" width="62" height="${r(g0 - top)}" fill="${farben[i]}"/><rect x="${x0}" y="${r(top)}" width="62" height="2" fill="#8d7f6c" opacity=".6"/>`;
    for (let f = 0; f < 4; f++) for (let w = 0; w < 4; w++) {
      const y = g0 - (2.6 + f * 3) * so, x = x0 + 6 + w * 14.5;
      k += `<rect x="${r(x)}" y="${r(y - 1.5 * so)}" width="${r(1.1 * so)}" height="${r(1.5 * so)}" fill="#556b7a"/><rect x="${r(x)}" y="${r(y - 1.5 * so)}" width="${r(1.1 * so)}" height="${r(1.5 * so)}" fill="none" stroke="#f4f1ea" stroke-width=".7"/>`;
    }
  }
  /* Gehweg gegenüber, Fahrbahn, unser Gehweg mit Bordstein */
  k += `<rect x="0" y="${r(g0)}" width="320" height="${r(boden(18) - g0)}" fill="#b5b0a7"/>`;
  k += `<rect x="0" y="${r(boden(18))}" width="320" height="${r(boden(10.2) - boden(18))}" fill="${S.lg("fahrbahn", [[0, "#6c6f73"], [1, "#55585c"]])}"/>`;
  k += `<rect x="0" y="${r(boden(10.2) - 1.2)}" width="320" height="1.2" fill="#d4d0c8"/>`;
  k += `<rect x="0" y="${r(boden(10.2))}" width="320" height="${r(200 - boden(10.2))}" fill="${S.lg("gehweg", [[0, "#bdb8ae"], [1, "#a9a49a"]])}"/>`;
  for (let Z = 10; Z > 3; Z -= 0.6) k += `<rect x="0" y="${r(boden(Z))}" width="320" height=".35" fill="#8e897f" opacity=".6"/>`;
  for (let X = -6; X <= 8; X += 0.6) { const a = P(X, 0, 10.2), b = P(X, 0, 3.2); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#8e897f" stroke-width=".3" opacity=".55"/>`; }
  /* Straßenbaum am Bordstein */
  { const Z = 12, [x, y] = P(5.0, 0, Z), so2 = s(Z);
    k += `<path d="M${r(x - 0.14 * so2)} ${r(y)} L${r(x - 0.1 * so2)} ${r(y - 3.4 * so2)} L${r(x + 0.1 * so2)} ${r(y - 3.4 * so2)} L${r(x + 0.14 * so2)} ${r(y)} Z" fill="${S.lg("stamm", [[0, "#7a6450"], [1, "#4f3e2e"]], 0, 0, 1, 0)}"/>`;
    k += `<path d="M${r(x)} ${r(y - 2.6 * so2)} l${r(-0.8 * so2)} ${r(-1 * so2)} M${r(x)} ${r(y - 3 * so2)} l${r(0.7 * so2)} ${r(-0.9 * so2)}" stroke="#5a4634" stroke-width="1.2"/>`;
    const KR = S.rg("krone", [[0, "#8dbb63"], [0.6, "#6a9a48"], [1, "#4b7a33"]], 0.4, 0.35, 0.7);
    for (let i = 0; i < 16; i++) { const a = rnd() * Math.PI * 2, d = rnd(); k += `<circle cx="${r(x + Math.cos(a) * d * 1.6 * so2)}" cy="${r(y - 4.6 * so2 + Math.sin(a) * d * 1.3 * so2)}" r="${r((0.6 + rnd() * 0.5) * so2)}" fill="${KR}"/>`; }
    for (let i = 0; i < 40; i++) k += `<circle cx="${r(x + (rnd() - 0.5) * 3.4 * so2)}" cy="${r(y - 4.6 * so2 + (rnd() - 0.5) * 2.8 * so2)}" r=".9" fill="${rnd() < 0.5 ? "#a9cf7f" : "#3f6a2b"}" opacity=".7"/>`; }
  S.hinten(k);
}
{
  /* Hauswand (Z = 7) bis zur Ecke, Sockel, Hochparterre-Fenster */
  let k = `<rect x="0" y="0" width="${r(XECK)}" height="${r(GW)}" fill="${S.lg("wand", [[0, "#e6e1d8"], [1, "#d3cdc2"]])}"/>`;
  for (let i = 0; i < 120; i++) k += `<circle cx="${r(rnd() * XECK)}" cy="${r(rnd() * GW)}" r="${r(0.3 + rnd() * 0.5)}" fill="${rnd() < 0.5 ? "#c4bdb1" : "#f3efe8"}" opacity=".5"/>`;
  k += `<rect x="0" y="${r(GW - 0.5 * SW)}" width="${r(XECK)}" height="${r(0.5 * SW)}" fill="${S.lg("sockel", [[0, "#9b978f"], [1, "#7f7b74"]])}"/>`;
  k += `<rect x="${r(XECK - 2)}" y="0" width="2" height="${r(GW)}" fill="#b9b2a6"/><rect x="${r(XECK - 0.6)}" y="0" width=".6" height="${r(GW)}" fill="#8c867c"/>`;
  for (const xc of [114, 165]) {
    const [, yt] = P(0, 2.95, ZW), [, yb] = P(0, 1.65, ZW), w = 1.0 * SW;
    k += `<rect x="${r(xc - w / 2 - 2)}" y="${r(yt - 2)}" width="${r(w + 4)}" height="${r(yb - yt + 4)}" fill="#f3f0ea"/>`;
    k += `<rect x="${r(xc - w / 2)}" y="${r(yt)}" width="${r(w)}" height="${r(yb - yt)}" fill="${S.lg("scheibe", [[0, "#9db3c0"], [1, "#4f6573"]])}"/>`;
    k += `<rect x="${r(xc - 0.5)}" y="${r(yt)}" width="1" height="${r(yb - yt)}" fill="#f3f0ea"/><path d="M${r(xc + 2)} ${r(yt + 1)} l4 0 l-6 ${r(yb - yt - 2)} l-4 0 Z" fill="#fff" opacity=".2"/>`;
    k += `<rect x="${r(xc - w / 2 - 3)}" y="${r(yb + 1.5)}" width="${r(w + 6)}" height="1.6" fill="#b7b2a8"/>`;
  }
  /* Fenster im 1. OG (unten angeschnitten) */
  for (const xc of [24, 69, 114, 165]) { const [, yb] = P(0, 3.9, ZW), w = 1.0 * SW; k += `<rect x="${r(xc - w / 2 - 2)}" y="0" width="${r(w + 4)}" height="${r(yb + 2)}" fill="#f3f0ea"/><rect x="${r(xc - w / 2)}" y="0" width="${r(w)}" height="${r(yb)}" fill="#5b7180"/><rect x="${r(xc - w / 2 - 3)}" y="${r(yb + 1.5)}" width="${r(w + 6)}" height="1.6" fill="#b7b2a8"/>`; }
  /* Hofleuchte über der Tür */
  { const [x, y] = P(-4.22, 2.5, ZW); k += `<rect x="${r(x - 2.6)}" y="${r(y - 3)}" width="5.2" height="3.6" rx="1.2" fill="#3a3d40"/><rect x="${r(x - 2)}" y="${r(y - 0.2)}" width="4" height="1.6" rx=".6" fill="#fff4cf"/>`; }
  /* Regenrohr an der Ecke */
  k += `<rect x="${r(XECK - 6)}" y="0" width="2.4" height="${r(GW - 2)}" fill="${S.lg("rohr", [[0, "#c8ccce"], [0.5, "#9aa0a4"], [1, "#7c8286"]], 0, 0, 1, 0)}"/><path d="M${r(XECK - 6)} ${r(GW - 3)} q0 3 -3 3 h-2 v-2 h1.6 q.9 0 .9 -1 Z" fill="#8f9599"/>`;
  /* Bodenschatten unter der Wand */
  k += `<rect x="0" y="${r(GW)}" width="${r(XECK)}" height="4" fill="${S.lg("wandschatten", [[0, "#000", 0.2], [1, "#000", 0]])}"/>`;
  S.hinten(k);
}

/* =====================================================================
   1 — DIE HINTERTÜR ist Kulisse; 2 — DER SCHAUKASTEN (Lupe)
   ===================================================================== */
{
  const [x0, y1] = P(-4.75, 0, ZW), [x1, y0] = P(-3.7, 2.15, ZW);
  let k = `<rect x="${r(x0 - 2)}" y="${r(y0 - 2)}" width="${r(x1 - x0 + 4)}" height="${r(y1 - y0 + 2)}" fill="#6c7378"/>`;
  k += `<rect x="${r(x0)}" y="${r(y0)}" width="${r(x1 - x0)}" height="${r(y1 - y0)}" fill="${S.lg("hoftuer", [[0, "#7f8f99"], [1, "#5d6b74"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${r(x0 + 3)}" y="${r(y0 + 3)}" width="${r(x1 - x0 - 6)}" height="${r((y1 - y0) * 0.45)}" fill="#a9bfcb"/><path d="M${r(x0 + 4)} ${r(y0 + 4)} l6 0 l-7 12 Z" fill="#fff" opacity=".25"/>`;
  k += `<rect x="${r(x1 - 5)}" y="${r((y0 + y1) / 2)}" width="3.4" height="1" rx=".4" fill="#d4d8db"/>`;
  k += `<rect x="${r(x0 - 4)}" y="${r(y1)}" width="${r(x1 - x0 + 8)}" height="3" fill="#a29e96"/>`;
  S.hinten(k);
}
const schaukasten = [];
{
  const [x0, y0] = P(-3.45, 2.05, ZW), [x1, y1] = P(-2.25, 1.32, ZW);
  const w = x1 - x0, h = y1 - y0, ox = (x0 + x1) / 2, oy = y1;
  let k = `<rect x="${r(-w / 2 - 1.5)}" y="${r(-h - 1.5)}" width="${r(w + 3)}" height="${r(h + 3)}" rx=".8" fill="${S.lg("schaurahmen", [[0, "#c9ced2"], [1, "#8c9399"]])}"/>`;
  k += `<rect x="${r(-w / 2)}" y="${r(-h)}" width="${r(w)}" height="${r(h)}" fill="#c9b48e"/>`;
  for (let i = 0; i < 40; i++) k += `<circle cx="${r(-w / 2 + rnd() * w)}" cy="${r(-h + rnd() * h)}" r=".3" fill="#a88f66" opacity=".7"/>`;
  /* Abfuhrkalender links: Monatsraster mit farbigen Punkten */
  const ka = { x: -w / 2 + 1.5, y: -h + 1.4, w: w * 0.52, h: h - 2.8 };
  k += `<rect x="${r(ka.x)}" y="${r(ka.y)}" width="${r(ka.w)}" height="${r(ka.h)}" fill="#fff" transform="rotate(-1.5 ${r(ka.x)} ${r(ka.y)})"/>`;
  k += `<rect x="${r(ka.x)}" y="${r(ka.y)}" width="${r(ka.w)}" height="2.6" fill="#2f7d3b"/><text x="${r(ka.x + ka.w / 2)}" y="${r(ka.y + 1.9)}" font-size="1.6" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">Abfuhrkalender 2026</text>`;
  const fb = ["#55595d", "#2a5ea8", "#7a5232", "#f2c318"];
  for (let i = 0; i < 35; i++) {
    const cx = ka.x + 1 + (i % 7) * (ka.w - 2) / 7, cy = ka.y + 4 + Math.floor(i / 7) * (ka.h - 5) / 5;
    k += `<rect x="${r(cx)}" y="${r(cy)}" width="${r((ka.w - 2) / 7 - 0.4)}" height="${r((ka.h - 5) / 5 - 0.4)}" fill="#f2f2ef" stroke="#c9c9c4" stroke-width=".1"/>`;
    if (i % 7 === 2 || i % 7 === 4) k += `<circle cx="${r(cx + 1)}" cy="${r(cy + 0.9)}" r=".55" fill="${fb[(i + Math.floor(i / 7)) % 4]}"/>`;
  }
  schaukasten.push({ id: "abfuhrkalender", de: "der Abfuhrkalender", syl: "AB-fuhr-ka-len-der", it: "il calendario della raccolta", itSyl: "ca-len-DA-rio del-la rac-COL-ta", en: "collection calendar",
    x: ox + ka.x + ka.w / 2, y: oy + ka.y + ka.h, kunst: flaeche(-ka.w / 2, -ka.h, ka.w, ka.h), tipp: "Im Abfuhrkalender steht, an welchem Tag welche Tonne geleert wird." });
  /* Sperrmüll-Hinweis rechts */
  const sp = { x: ka.x + ka.w + 1.2, y: -h + 1.2, w: w - ka.w - 4, h: h - 2.4 };
  k += `<rect x="${r(sp.x)}" y="${r(sp.y)}" width="${r(sp.w)}" height="${r(sp.h)}" fill="#fff6d6" transform="rotate(1.2 ${r(sp.x)} ${r(sp.y)})"/>`;
  k += `<rect x="${r(sp.x)}" y="${r(sp.y)}" width="${r(sp.w)}" height="3" fill="#c0392b"/><text x="${r(sp.x + sp.w / 2)}" y="${r(sp.y + 2.2)}" font-size="1.9" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">SPERRMÜLL</text>`;
  const zl = ["nur nach", "Anmeldung!", "Nicht in den", "Hof stellen.", "Abholung", "kostenlos"];
  zl.forEach((t, i) => { k += `<text x="${r(sp.x + sp.w / 2)}" y="${r(sp.y + 5.2 + i * 1.75)}" font-size="1.35" text-anchor="middle" fill="#333" font-family="Arial"${i === 1 ? ' font-weight="bold"' : ""}>${t}</text>`; });
  /* Sofa-Piktogramm */
  k += `<path d="M${r(sp.x + 2)} ${r(sp.y + sp.h - 1)} v-2 h${r(sp.w - 4)} v2 Z M${r(sp.x + 1.4)} ${r(sp.y + sp.h - 3.5)} h1 v2.5 h-1 Z M${r(sp.x + sp.w - 2.4)} ${r(sp.y + sp.h - 3.5)} h1 v2.5 h-1 Z" fill="#7a3a28"/>`;
  schaukasten.push({ id: "sperrmuell", de: "der Sperrmüll", syl: "SPERR-müll", it: "i rifiuti ingombranti", itSyl: "ri-FIU-ti in-gom-BRAN-ti", en: "bulky waste",
    x: ox + sp.x + sp.w / 2, y: oy + sp.y + sp.h, kunst: flaeche(-sp.w / 2, -sp.h, sp.w, sp.h), tipp: "Alte Möbel sind Sperrmüll. Die Abholung meldet man bei der Stadt an." });
  /* Glasscheibe */
  k += `<rect x="${r(-w / 2)}" y="${r(-h)}" width="${r(w)}" height="${r(h)}" fill="${S.lg("schauglas", [[0, "#fff", 0.28], [0.5, "#fff", 0.05], [1, "#fff", 0.15]], 0, 0, 1, 1)}"/>`;
  k += `<text x="0" y="${r(-h - 2.2)}" font-size="1.7" text-anchor="middle" fill="#55595d" font-family="Arial">Hausverwaltung</text>`;
  S.teil({ id: "schaukasten", de: "der Schaukasten", syl: "SCHAU-kas-ten", it: "la bacheca", itSyl: "ba-CHE-ca", en: "notice board", x: ox, y: oy, kunst: k,
    zoom: { x: r(ox - 30), y: r(oy - h - 14), w: 60, h: 40 }, unter: schaukasten });
}

/* =====================================================================
   3 — DER BESEN (lehnt an der Wand neben der Hoftür)
   ===================================================================== */
{
  const Z = 6.85, [x, y] = P(-1.0, 0, Z), so = s(Z);
  let k = schatten(0, 0, 4, 0.8, 0.3);
  k += `<g transform="rotate(-9)"><rect x="-.55" y="${r(-1.35 * so)}" width="1.1" height="${r(1.2 * so)}" fill="${S.lg("stiel", [[0, "#d6b07a"], [1, "#9c7342"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-4.6" y="${r(-0.17 * so)}" width="9.2" height="2.6" rx=".6" fill="#b5762d"/>`;
  for (let i = 0; i < 16; i++) k += `<rect x="${r(-4.3 + i * 0.57)}" y="${r(-0.17 * so + 2.4)}" width=".35" height="${r(0.1 * so)}" fill="#3b3229"/></g>`.replace("</g>", "");
  k += `</g>`;
  S.teil({ id: "besen", de: "der Besen", syl: "BE-sen", it: "la scopa", itSyl: "SCO-pa", en: "broom", x, y, steht: true, kunst: k,
    tipp: "Wer Kehrwoche hat, fegt auch den Müllplatz." });
}

/* =====================================================================
   4–7 — DIE TONNEN an der Hauswand: Bio, Papier, (Gelbe Säcke), Rest
   ===================================================================== */
const TZ0 = 6.2, TZ1 = 6.93, TH = 1.07, TB = 0.58;
function tonne(Xm, koerper, deckel, koerperSeite, aufkleber, offen) {
  const ox = P(Xm, 0, TZ0)[0], oy = boden(TZ0);
  const q = (X, Y, Z) => { const [x, y] = P(X, Y, Z); return [r(x - ox), r(y - oy)]; };
  const X0 = Xm - TB / 2, X1 = Xm + TB / 2;
  let k = schatten(0, 0.4, 0.4 * s(TZ0), 1.6, 0.4);
  /* Räder hinten (seitlich sichtbar) */
  for (const X of [X0 + 0.02, X1 - 0.02]) { const c = q(X, 0.1, TZ1 - 0.12); k += `<ellipse cx="${c[0]}" cy="${c[1]}" rx="1.4" ry="3.6" fill="#1d1d1f"/>`; }
  /* Korpus leicht konisch (oben breiter) */
  const ul = q(X0 + 0.04, 0.03, TZ0 + 0.04), ur = q(X1 - 0.04, 0.03, TZ0 + 0.04), ol = q(X0, TH - 0.06, TZ0), or = q(X1, TH - 0.06, TZ0);
  const sh = q(X1, TH - 0.06, TZ1), su = q(X1 - 0.04, 0.03, TZ1);
  if (X1 < 0) k += poly([ur, su, sh, or], koerperSeite);
  k += poly([ul, ur, or, ol], koerper);
  /* senkrechte Verstärkungsrippen, Griffleiste */
  for (const t of [0.2, 0.8]) k += `<path d="M${r(ol[0] + (or[0] - ol[0]) * t)} ${r(ol[1] + 3)} L${r(ul[0] + (ur[0] - ul[0]) * t)} ${r(ul[1] - 2)}" stroke="#000" stroke-width=".5" opacity=".18"/>`;
  k += `<rect x="${r(ol[0])}" y="${r(ol[1])}" width="${r(or[0] - ol[0])}" height="2.4" fill="#000" opacity=".15"/>`;
  k += `<rect x="${r(ul[0])}" y="${r(ul[1] - 2)}" width="${r(ur[0] - ul[0])}" height="2" fill="#000" opacity=".22"/>`;
  /* Glanz */
  k += `<path d="M${r(ol[0] + 2)} ${r(ol[1] + 3)} L${r(ol[0] + 4.5)} ${r(ol[1] + 3)} L${r(ul[0] + 3.5)} ${r(ul[1] - 3)} L${r(ul[0] + 1.6)} ${r(ul[1] - 3)} Z" fill="#fff" opacity=".14"/>`;
  /* Aufkleber */
  const ax = r((ol[0] + or[0]) / 2), ay = r(ol[1] + (ul[1] - ol[1]) * 0.36), aw = (or[0] - ol[0]) * 0.72;
  k += `<rect x="${r(ax - aw / 2)}" y="${r(ay - 3.6)}" width="${r(aw)}" height="9.4" rx=".6" fill="#fbfbf7"/>`;
  k += `<rect x="${r(ax - aw / 2)}" y="${r(ay - 3.6)}" width="${r(aw)}" height="2.6" rx=".6" fill="${aufkleber.farbe}"/>`;
  k += `<text x="${ax}" y="${r(ay - 1.6)}" font-size="1.9" text-anchor="middle" fill="${aufkleber.schrift || "#fff"}" font-family="Arial" font-weight="bold">${aufkleber.titel}</text>`;
  aufkleber.zeilen.forEach((t, i) => { k += `<text x="${ax}" y="${r(ay + 0.9 + i * 1.5)}" font-size="1.15" text-anchor="middle" fill="#333" font-family="Arial">${t}</text>`; });
  k += `<text x="${ax}" y="${r(ul[1] - 6)}" font-size="2" text-anchor="middle" fill="#fff" opacity=".7" font-family="Arial" font-weight="bold">Nr. 12</text>`;
  /* Deckel */
  const dl = q(X0 - 0.02, TH - 0.06, TZ0 - 0.03), dr = q(X1 + 0.02, TH - 0.06, TZ0 - 0.03);
  if (offen) {
    /* Deckel hochgeklappt an die Wand gelehnt, Öffnung dunkel */
    const bl = q(X0, TH - 0.04, TZ1), br = q(X1, TH - 0.04, TZ1);
    k += poly([q(X0, TH - 0.06, TZ0), q(X1, TH - 0.06, TZ0), br, bl], "#18191b");
    const tl = q(X0 - 0.02, TH + 0.66, TZ1 + 0.04), tr = q(X1 + 0.02, TH + 0.66, TZ1 + 0.04);
    k += poly([bl, br, tr, tl], deckel);
    k += `<rect x="${r(tl[0] + 2)}" y="${r(tl[1])}" width="${r(tr[0] - tl[0] - 4)}" height="1.6" rx=".6" fill="#000" opacity=".25"/>`;
    k += `<rect x="${r(dl[0])}" y="${r(dl[1] - 0.6)}" width="${r(dr[0] - dl[0])}" height="1.6" fill="#000" opacity=".25"/>`;
  } else {
    const hl = q(X0 - 0.02, TH, TZ1), hr = q(X1 + 0.02, TH, TZ1);
    k += poly([dl, dr, hr, hl], deckel);
    k += `<path d="M${dl[0]} ${dl[1]} L${dr[0]} ${dr[1]} L${dr[0]} ${r(dr[1] + 2.2)} L${dl[0]} ${r(dl[1] + 2.2)} Z" fill="${deckel}"/><path d="M${dl[0]} ${r(dl[1] + 2.2)} L${dr[0]} ${r(dr[1] + 2.2)}" stroke="#000" stroke-width=".5" opacity=".3"/>`;
    k += `<rect x="${r(dl[0] + (dr[0] - dl[0]) * 0.3)}" y="${r(dl[1] + 0.4)}" width="${r((dr[0] - dl[0]) * 0.4)}" height="1.1" rx=".5" fill="#000" opacity=".25"/>`;
    k += `<path d="M${r(dl[0] + 1)} ${r(dl[1] - 0.6)} L${r(dr[0] - 1)} ${r(dr[1] - 0.6)}" stroke="#fff" stroke-width=".5" opacity=".25"/>`;
  }
  return { ox, oy, k };
}
{
  const t = tonne(-2.95, S.lg("bio", [[0, "#7a5636"], [1, "#5b3e25"]], 0, 0, 1, 0), "#6b4a2d", "#4a311c",
    { farbe: "#6b4a2d", titel: "Bioabfall", zeilen: ["Obst · Gemüse", "Kaffeesatz", "keine Plastiktüten!"] });
  S.teil({ id: "biotonne", de: "der Biomüll", syl: "BI-o-müll", it: "l'umido", itSyl: "U-mi-do", en: "organic waste", x: t.ox, y: t.oy, steht: true, kunst: t.k,
    tipp: "In die braune Biotonne: Obst- und Gemüsereste, Kaffeesatz, Eierschalen." });
}
{
  const t = tonne(-2.2, S.lg("papier", [[0, "#2f68b5"], [1, "#204d8d"]], 0, 0, 1, 0), "#1f4a87", "#173a6c",
    { farbe: "#1f4a87", titel: "Papier · Pappe", zeilen: ["Zeitungen", "Kartons falten!", ""] });
  S.teil({ id: "papiertonne", de: "das Altpapier", syl: "ALT-pa-pier", it: "la carta", itSyl: "CAR-ta", en: "waste paper", x: t.ox, y: t.oy, steht: true, kunst: t.k,
    tipp: "In die blaue Tonne kommen Zeitungen, Hefte und gefaltete Kartons." });
}
/* Die Gelben Säcke (durchsichtig) — Lupe mit dem Inhalt */
const gelbUnter = [];
{
  const Z = 6.05, so = s(Z), ox = P(-1.32, 0, Z)[0], oy = boden(Z);
  let k = schatten(0, 0.4, 0.62 * so, 1.6, 0.35);
  const sack = (dx, dy, w, h, kipp, inhalt) => {
    let g = `<g transform="translate(${r(dx)} ${r(dy)}) rotate(${kipp})">`;
    /* Inhalt hinter der Folie */
    g += inhalt;
    g += `<path d="M${r(-w / 2)} 0 Q${r(-w / 2 - 2)} ${r(-h * 0.5)} ${r(-w * 0.3)} ${r(-h * 0.88)} L${r(-1.4)} ${r(-h)} L${r(1.4)} ${r(-h)} L${r(w * 0.3)} ${r(-h * 0.88)} Q${r(w / 2 + 2)} ${r(-h * 0.5)} ${r(w / 2)} 0 Z" fill="${S.lg("gelbsack", [[0, "#ffe14d", 0.62], [0.6, "#f5c400", 0.55], [1, "#e0a800", 0.7]], 0, 0, 1, 0)}" stroke="#d9a400" stroke-width=".3"/>`;
    g += `<path d="M-1.4 ${r(-h)} q-2 -2.6 -.4 -3.6 q1.4 1.2 1.8 1.4 q.6 -1.6 1.8 -1.2 q.6 1.8 -.4 3.4 Z" fill="#f2c200"/>`;
    g += `<path d="M${r(-w * 0.32)} ${r(-h * 0.75)} Q${r(-w * 0.42)} ${r(-h * 0.4)} ${r(-w * 0.34)} ${r(-h * 0.1)}" stroke="#fff" stroke-width=".7" opacity=".45" fill="none"/>`;
    g += `<path d="M${r(-w / 2 + 2)} ${r(-h * 0.55)} l${r(w * 0.3)} 2 M${r(w * 0.05)} ${r(-h * 0.3)} l${r(w * 0.3)} -1.6" stroke="#d9a400" stroke-width=".3" opacity=".7"/>`;
    return g + `</g>`;
  };
  const becher = (x, y) => `<path d="M${x - 2.4} ${y - 4} L${x + 2.4} ${y - 4} L${x + 1.8} ${y} L${x - 1.8} ${y} Z" fill="#f7f7f4"/><rect x="${x - 2.5}" y="${y - 4.5}" width="5" height=".8" fill="#d33b5c"/><text x="${x}" y="${y - 1.6}" font-size="1.2" text-anchor="middle" fill="#d33b5c" font-family="Arial" font-weight="bold">Joghurt</text>`;
  const dose = (x, y) => `<rect x="${x - 2.2}" y="${y - 5}" width="4.4" height="5" fill="${S.lg("dose", [[0, "#e9edf0"], [0.5, "#9aa3aa"], [1, "#d7dde1"]], 0, 0, 1, 0)}"/><rect x="${x - 2.2}" y="${y - 3.8}" width="4.4" height="2.4" fill="#c0392b"/><ellipse cx="${x}" cy="${y - 5}" rx="2.2" ry=".6" fill="#cfd5d9"/>`;
  const tetra = (x, y) => `<path d="M${x - 2} ${y} L${x - 2} ${y - 6.4} L${x} ${y - 7.6} L${x + 2} ${y - 6.4} L${x + 2} ${y} Z" fill="#f4f1e6"/><rect x="${x - 2}" y="${y - 5}" width="4" height="2.6" fill="#3b7dc4"/><text x="${x}" y="${y - 3.2}" font-size="1.05" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">MILCH</text>`;
  k += sack(-7, 0, 0.5 * so, 0.68 * so, -4, becher(-3, -5) + tetra(3, -2) + `<ellipse cx="-1" cy="-13" rx="4" ry="2" fill="#e3e8ea"/>`);
  k += sack(7, 0.2, 0.52 * so, 0.74 * so, 5, dose(-2, -3) + becher(3, -11) + `<rect x="1" y="-6" width="5" height="3" fill="#d9e2e6"/>`);
  gelbUnter.push({ id: "joghurtbecher", de: "der Joghurtbecher", syl: "JO-ghurt-be-cher", it: "il vasetto dello yogurt", itSyl: "va-SET-to del-lo YO-gurt", en: "yoghurt pot", x: ox - 10, y: oy - 3.5, kunst: flaeche(-3.6, -6.5, 7.2, 7.4), tipp: "Joghurtbecher nicht ausspülen – „löffelrein“ reicht." });
  gelbUnter.push({ id: "getraenkekarton", de: "der Getränkekarton", syl: "ge-TRÄN-ke-kar-ton", it: "il cartone per bevande", itSyl: "car-TO-ne per be-VAN-de", en: "drinks carton", x: ox - 4.2, y: oy - 0.8, kunst: flaeche(-3, -8.6, 6, 9) });
  gelbUnter.push({ id: "konservendose", de: "die Konservendose", syl: "kon-SER-ven-do-se", it: "la scatoletta", itSyl: "sca-to-LET-ta", en: "tin can", x: ox + 5.2, y: oy - 2.6, kunst: flaeche(-3.2, -6.4, 6.4, 7) });
  S.teil({ id: "gelbersack", de: "der Gelbe Sack", syl: "GEL-be SACK", it: "la plastica", itSyl: "PLA-sti-ca", en: "plastic packaging", x: ox, y: oy, steht: true, kunst: k,
    zoom: { x: r(ox - 27), y: r(oy - 34), w: 54, h: 36 }, unter: gelbUnter,
    tipp: "In den Gelben Sack kommen Verpackungen aus Plastik, Metall und Getränkekartons." });
}
let RESTX;
{
  const t = tonne(-0.45, S.lg("rest", [[0, "#5d6165"], [1, "#3e4145"]], 0, 0, 1, 0), "#2f3235", "#2b2e31",
    { farbe: "#3a3d40", titel: "Restmüll", zeilen: ["Windeln · Asche", "Staubsaugerbeutel", ""] }, true);
  S.teil({ id: "restmuell", de: "der Restmüll", syl: "REST-müll", it: "il rifiuto secco", itSyl: "ri-FIU-to SEC-co", en: "residual waste", x: t.ox, y: t.oy, steht: true, kunst: t.k,
    tipp: "Alles, was man nicht trennen kann, kommt in die graue Restmülltonne." });
  RESTX = t.ox;
}

/* =====================================================================
   8 — DER GLASCONTAINER (Weiß-, Grün-, Braunglas) auf dem Gehweg — Lupe
   ===================================================================== */
const glasUnter = [];
{
  const ox = P(4.25, 0, ZG)[0], oy = boden(ZG), so = s(ZG);
  let k = schatten(0, 0.3, 2.4 * so, 2.2, 0.35);
  const arten = [
    { id: "weissglas", de: "das Weißglas", syl: "WEISS-glas", it: "il vetro bianco", itSyl: "VE-tro BIAN-co", en: "clear glass", koerper: ["#eef0ef", "#c9cecd"], band: "#ffffff", schrift: "#333", titel: "Weißglas" },
    { id: "gruenglas", de: "das Grünglas", syl: "GRÜN-glas", it: "il vetro verde", itSyl: "VE-tro VER-de", en: "green glass", koerper: ["#3d8a4c", "#28653a"], band: "#2e7a3f", schrift: "#fff", titel: "Grünglas", tipp: "Blaues Glas kommt zum Grünglas." },
    { id: "braunglas", de: "das Braunglas", syl: "BRAUN-glas", it: "il vetro marrone", itSyl: "VE-tro mar-RO-ne", en: "brown glass", koerper: ["#8a5a32", "#653e1f"], band: "#7a4b26", schrift: "#fff", titel: "Braunglas" },
  ];
  [2, 1, 0].map((i) => [arten[i], i]).forEach(([a, i]) => {
    const X0 = 2.18 + i * 1.47 - 4.25, X1 = X0 + 1.38;
    const q = (X, Y, Z) => { const [x, y] = P(X + 4.25, Y, Z); return [r(x - ox), r(y - oy)]; };
    const G = S.lg("glasc" + i, [[0, a.koerper[0]], [1, a.koerper[1]]], 0, 0, 1, 0);
    /* sichtbare linke Seite (rechts vom Fluchtpunkt) */
    if (X0 + 4.25 > 0) k += poly([q(X0, 0.05, ZG), q(X0, 0.05, ZG + 1.3), q(X0, 1.62, ZG + 1.3), q(X0, 1.62, ZG)], a.koerper[1]);
    const [l, t] = q(X0, 1.62, ZG), [rr, b] = q(X1, 0.05, ZG);
    k += `<rect x="${l}" y="${t}" width="${r(rr - l)}" height="${r(b - t)}" rx="1" fill="${G}"/>`;
    /* gewölbtes Dach, Kranpilz */
    k += `<path d="M${l} ${t} Q${r((l + rr) / 2)} ${r(t - 4.4)} ${rr} ${t} Z" fill="${a.koerper[1]}"/>`;
    k += `<rect x="${r((l + rr) / 2 - 0.6)}" y="${r(t - 7)}" width="1.2" height="3.4" fill="#6d7377"/><ellipse cx="${r((l + rr) / 2)}" cy="${r(t - 7)}" rx="2.4" ry=".9" fill="#7d8387"/>`;
    /* Sockelfüße */
    k += `<rect x="${r(l + 1)}" y="${r(b)}" width="3" height="1.4" fill="#3b3e41"/><rect x="${r(rr - 4)}" y="${r(b)}" width="3" height="1.4" fill="#3b3e41"/>`;
    /* Einwurföffnungen mit Gummilamellen */
    for (const f of [0.3, 0.7]) {
      const cx = l + (rr - l) * f, cy = t + 6.5;
      k += `<circle cx="${r(cx)}" cy="${r(cy)}" r="3.6" fill="#2a2c2e"/><circle cx="${r(cx)}" cy="${r(cy)}" r="2.9" fill="#111"/>`;
      for (let j = 0; j < 8; j++) { const w = j * Math.PI / 4; k += `<line x1="${r(cx)}" y1="${r(cy)}" x2="${r(cx + Math.cos(w) * 2.9)}" y2="${r(cy + Math.sin(w) * 2.9)}" stroke="#3a3c3e" stroke-width=".35"/>`; }
    }
    /* Schild mit Farbe und Flaschensymbol */
    const sy = t + 12.5;
    k += `<rect x="${r(l + 2)}" y="${r(sy)}" width="${r(rr - l - 4)}" height="7.6" rx=".6" fill="#fdfdfb" stroke="#999" stroke-width=".2"/><rect x="${r(l + 2)}" y="${r(sy)}" width="${r(rr - l - 4)}" height="2.8" rx=".6" fill="${i === 0 ? "#d9dcdc" : a.band}"/>`;
    k += `<text x="${r((l + rr) / 2)}" y="${r(sy + 2.1)}" font-size="2" text-anchor="middle" fill="${a.schrift}" font-family="Arial" font-weight="bold">${a.titel}</text>`;
    const fc = i === 0 ? "#e9eef0" : i === 1 ? "#3c8a4a" : "#7c4b23";
    k += `<path d="M${r((l + rr) / 2 - 0.7)} ${r(sy + 3.4)} h1.4 v1 q1 .4 1 1.4 v1.8 h-3.4 v-1.8 q0 -1 1 -1.4 Z" fill="${fc}" stroke="#555" stroke-width=".15"/>`;
    /* Glanzkante */
    k += `<rect x="${r(l + 1)}" y="${r(t + 1)}" width="1.3" height="${r(b - t - 2)}" fill="#fff" opacity=".18"/>`;
    glasUnter.push({ id: a.id, de: a.de, syl: a.syl, it: a.it, itSyl: a.itSyl, en: a.en, tipp: a.tipp, x: ox + (l + rr) / 2, y: oy + b, kunst: flaeche(-(rr - l) / 2 + 0.5, -(b - t) + 1, rr - l - 1, b - t - 2) });
  });
  /* Einwurfzeiten-Schild am mittleren Container */
  { const q2 = P(2.18 + 1.47 + 0.69, 0.5, ZG); const x = q2[0] - ox, y = q2[1] - oy;
    k += `<rect x="${r(x - 7)}" y="${r(y - 2)}" width="14" height="7.2" rx=".5" fill="#fff" stroke="#888" stroke-width=".2"/><text x="${r(x)}" y="${r(y + 0.8)}" font-size="1.55" text-anchor="middle" fill="#c0392b" font-family="Arial" font-weight="bold">Einwurfzeiten</text>`;
    k += `<text x="${r(x)}" y="${r(y + 2.9)}" font-size="1.45" text-anchor="middle" fill="#222" font-family="Arial">Mo–Sa 7–20 Uhr</text><text x="${r(x)}" y="${r(y + 4.6)}" font-size="1.2" text-anchor="middle" fill="#222" font-family="Arial">sonn- u. feiertags nicht</text>`;
    glasUnter.push({ id: "einwurfzeiten", de: "die Einwurfzeiten", syl: "EIN-wurf-zei-ten", it: "gli orari di conferimento", itSyl: "o-RA-ri di con-fe-ri-MEN-to", en: "disposal hours", x: ox + x, y: oy + y + 5.4, kunst: flaeche(-7.5, -8, 15, 8.2),
      tipp: "Glas nur werktags von 7 bis 20 Uhr einwerfen – das ist laut." }); }
  S.teil({ id: "glascontainer", de: "der Glascontainer", syl: "GLAS-con-tai-ner", it: "la campana del vetro", itSyl: "cam-PA-na del VE-tro", en: "bottle bank", x: ox, y: oy, steht: true, kunst: k,
    zoom: { x: r(ox - 60), y: r(oy - 58), w: 112, h: 66 }, unter: glasUnter,
    tipp: "Glas wird nach Farben getrennt: weiß, grün, braun." });
}

/* =====================================================================
   9 — DIE NACHBARIN mit 10 — DEM MÜLLSACK (zur Restmülltonne)
   ===================================================================== */
{
  const Z = 5.1, x = P(0.62, 0, Z)[0];
  const m = B.mensch({ id: "mt_nachbarin", geschlecht: "w", pose: "halten", blick: -58, frisur: "kurz", haarfarbe: "grau", haut: "hell", alter: "alt",
    kleidung: { oberteil: { stueck: "pullover", farbe: "#7a4b6e" }, unterteil: { stueck: "hose", farbe: "grau" }, jacke: { stueck: "weste", farbe: "#3d5a73" }, schuhe: { stueck: "halbschuh", farbe: "braun" } } }, 1.64 * s(Z));
  S.teil({ id: "nachbarin", de: "die Nachbarin", syl: "NACH-ba-rin", it: "la vicina", itSyl: "vi-CI-na", en: "neighbour", x, y: boden(Z), kunst: m.svg,
    tipp: "Die Nachbarin bringt den Müll raus." });
  /* Müllsack: grauer, zugeknoteter Beutel, hängt vor ihren Händen */
  const hx = x - 0.466 * s(Z), hy = boden(Z) - 1.03 * s(Z);
  let k = `<path d="M-1.2 0 q-.8 -2.4 .2 -3 q.8 .8 1 1.2 q.8 -1.2 1.6 -.6 q.2 1.4 -.8 2.4 Z" fill="#3b3e42"/>`;
  k += `<path d="M-1.4 -.2 Q-6.6 2 -6.4 9 Q-6 14 0 14.4 Q6 14 6.2 9 Q6.4 2 1.4 -.2 Z" fill="${S.rg("sack", [[0, "#5b5f63"], [0.7, "#36393c"], [1, "#25272a"]], 0.4, 0.35, 0.8)}"/>`;
  k += `<path d="M-4.4 4 Q-5.4 8 -3.6 12" stroke="#fff" stroke-width=".6" opacity=".22" fill="none"/><path d="M-1 2 l1.4 5 M2.4 3 l.6 4" stroke="#1e2022" stroke-width=".4" opacity=".7"/>`;
  S.teil({ oben: true, id: "muellsack", de: "der Müllsack", syl: "MÜLL-sack", it: "il sacco della spazzatura", itSyl: "SAC-co del-la spaz-za-TU-ra", en: "rubbish bag", x: hx, y: hy, kunst: k });
}

/* =====================================================================
   11 — DER GETRÄNKEKASTEN mit 12 — DER PFANDFLASCHE (vorne links)
   ===================================================================== */
{
  const Z = 3.75, so = s(Z), ox = P(-2.2, 0, Z)[0], oy = boden(Z);
  let k = schatten(0, 0.4, 0.26 * so, 2, 0.4);
  k += quader(-2.45, -1.95, 0, 0.3, Z, Z + 0.33, { vorne: S.lg("kasten", [[0, "#2f6d3c"], [1, "#1f4f2b"]]), oben: "#173c20", seite: "#1c4426" }, ox, oy);
  /* braune Mehrwegflaschen im Kasten (4 × 3), hintere Reihe zuerst */
  for (let j = 2; j >= 0; j--) for (let i = 0; i < 4; i++) {
    const [bx, by] = P(-2.39 + i * 0.125, 0.3, Z + 0.06 + j * 0.105), x = r(bx - ox), y = r(by - oy);
    k += `<rect x="${r(x - 1.5)}" y="${r(y - 2.6)}" width="3" height="2.8" rx="1.2" fill="${S.lg("bier", [[0, "#5a2c0b"], [0.45, "#a85a1c"], [1, "#4a2408"]], 0, 0, 1, 0)}"/><rect x="${r(x - 0.9)}" y="${r(y - 6.6)}" width="1.8" height="4.4" fill="#7a3f12"/><rect x="${r(x - 1.05)}" y="${r(y - 7.3)}" width="2.1" height="1" rx=".3" fill="#c9a227"/><rect x="${r(x - 0.5)}" y="${r(y - 6.2)}" width=".4" height="3" fill="#fff" opacity=".3"/>`;
  }
  /* Griffloch und Brauerei-Schild */
  k += `<rect x="${r(-0.08 * so)}" y="${r(-0.24 * so)}" width="${r(0.16 * so)}" height="2.2" rx="1.1" fill="#123018"/>`;
  k += `<rect x="${r(-0.17 * so)}" y="${r(-0.15 * so)}" width="${r(0.34 * so)}" height="${r(0.1 * so)}" rx=".5" fill="#f3e9cf"/><text x="0" y="${r(-0.08 * so)}" font-size="2.6" text-anchor="middle" fill="#1f4f2b" font-family="Georgia,serif" font-weight="bold">Pils</text>`;
  for (let i = 0; i < 6; i++) k += `<rect x="${r(-0.24 * so + i * 0.085 * so)}" y="${r(-0.035 * so)}" width="${r(0.05 * so)}" height="1.2" fill="#123018"/>`;
  S.teil({ id: "getraenkekasten", de: "der Getränkekasten", syl: "ge-TRÄN-ke-kas-ten", it: "la cassa delle bibite", itSyl: "CAS-sa del-le BI-bi-te", en: "crate", x: ox, y: oy, steht: true, kunst: k,
    tipp: "Leere Mehrwegflaschen bringt man im Kasten zurück in den Getränkemarkt." });
}
{
  const Z = 3.6, so = s(Z), x = P(-1.6, 0, Z)[0], y = boden(Z);
  const h = 0.32 * so;
  let k = schatten(0, 0.3, 4.4, 1, 0.35);
  k += `<path d="M-3 0 L-3 ${r(-h * 0.62)} Q-3 ${r(-h * 0.78)} -1.2 ${r(-h * 0.88)} L-1.2 ${r(-h * 0.96)} L1.2 ${r(-h * 0.96)} L1.2 ${r(-h * 0.88)} Q3 ${r(-h * 0.78)} 3 ${r(-h * 0.62)} L3 0 Z" fill="${S.lg("pet", [[0, "#cfe8f2", 0.85], [0.4, "#ffffff", 0.7], [1, "#a9cfe0", 0.85]], 0, 0, 1, 0)}" stroke="#8fb7c8" stroke-width=".25"/>`;
  k += `<rect x="-1.4" y="${r(-h - 0.4)}" width="2.8" height="1.6" rx=".4" fill="#2b74c9"/>`;
  k += `<rect x="-3" y="${r(-h * 0.5)}" width="6" height="${r(h * 0.24)}" fill="#e8f2fa"/><text x="0" y="${r(-h * 0.36)}" font-size="1.5" text-anchor="middle" fill="#2b74c9" font-family="Arial" font-weight="bold">Wasser</text>`;
  /* Pfandzeichen (DPG) */
  k += `<circle cx="0" cy="${r(-h * 0.17)}" r="1.5" fill="#fff" stroke="#4a4a4a" stroke-width=".25"/><path d="M-.9 ${r(-h * 0.17 + 0.5)} q.9 -2 1.8 0" stroke="#3a8a3a" stroke-width=".45" fill="none"/><path d="M-.6 ${r(-h * 0.17 - 0.3)} l1.2 0" stroke="#3a8a3a" stroke-width=".35"/>`;
  k += `<path d="M-2.2 ${r(-h * 0.6)} L-2 -1.4" stroke="#fff" stroke-width=".7" opacity=".7"/>`;
  S.teil({ id: "pfandflasche", de: "die Pfandflasche", syl: "PFAND-fla-sche", it: "la bottiglia con cauzione", itSyl: "bot-TI-glia con cau-ZIO-ne", en: "deposit bottle", x, y, steht: true, kunst: k + flaeche(-3.4, -h - 1, 6.8, h + 1.4),
    tipp: "Flaschen mit Pfandzeichen bringt man zurück in den Laden: 25 Cent Pfand." });
}

/* =====================================================================
   13 — DER KARTON (zusammengefaltet) und 14 — DIE ZEITUNG (gebündelt)
   ===================================================================== */
{
  const Z = 4.35, ox = P(-0.85, 0, Z)[0], oy = boden(Z);
  let k = schatten(0, 0.6, 0.55 * s(Z), 2, 0.35);
  for (let i = 0; i < 3; i++) k += quader(-1.4 + i * 0.03, -0.3 - i * 0.02, i * 0.035, i * 0.035 + 0.03, Z + i * 0.02, Z + 0.55 - i * 0.03, { vorne: i % 2 ? "#b8854a" : "#c6945a", oben: i % 2 ? "#d6a868" : "#dfb577", seite: "#a87a42" }, ox, oy);
  for (let i = 0; i < 3; i++) { const [a, b] = P(-1.4 + i * 0.03, i * 0.035 + 0.015, Z + i * 0.02), [c] = P(-0.3 - i * 0.02, 0, Z); for (let x = a; x < c; x += 1.1) k += `<rect x="${r(x - ox)}" y="${r(b - oy - 0.6)}" width=".35" height="1.3" fill="#8e5f2c" opacity=".55"/>`; }
  /* aufgedruckte Pfeile und Klebebandreste auf dem obersten */
  { const [a, b] = P(-1.1, 0.1, Z + 0.25), [c, d] = P(-0.6, 0.1, Z + 0.3); k += `<text x="${r(c - ox + 3)}" y="${r(d - oy + 0.5)}" font-size="2.2" fill="#6b4520" font-family="Arial" font-weight="bold">↑↑</text>`; }
  S.teil({ id: "karton", de: "der Karton", syl: "kar-TON", it: "il cartone", itSyl: "car-TO-ne", en: "cardboard box", x: ox, y: oy, steht: true, kunst: k,
    tipp: "Kartons faltet man flach – dann passt mehr in die Papiertonne." });
}
{
  const Z = 4.48, [x, y] = P(-0.72, 0.1, Z + 0.22);
  let k = schatten(0, 0.2, 7, 1, 0.3);
  for (let i = 0; i < 5; i++) k += `<path d="M${r(-7 + i * 0.2)} ${r(-i * 1.1)} L${r(6 + i * 0.1)} ${r(-i * 1.1)} L${r(7.4 + i * 0.1)} ${r(-i * 1.1 - 2.6)} L${r(-5.6 + i * 0.2)} ${r(-i * 1.1 - 2.6)} Z" fill="${i % 2 ? "#e9e6dc" : "#f4f2ea"}" stroke="#bcb7aa" stroke-width=".25"/>`;
  /* oberste Zeitung mit Titel und Spalten */
  k += `<text x="0" y="-5.4" font-size="1.7" text-anchor="middle" fill="#222" font-family="Georgia,serif" font-weight="bold" transform="skewX(-20)">Tageszeitung</text>`;
  for (let i = 0; i < 4; i++) k += `<path d="M${r(-4.2 + i * 2.6)} -6.6 L${r(-5 + i * 2.6)} -4.6" stroke="#9a968c" stroke-width=".25"/>`;
  /* Paketschnur über Kreuz */
  k += `<path d="M-1 -.2 L-.2 -7.2 M-6.2 -3.2 L7 -3.6" stroke="#b07a3a" stroke-width=".5"/>`;
  S.teil({ oben: true, id: "zeitung", de: "die Zeitung", syl: "ZEI-tung", it: "il giornale", itSyl: "gior-NA-le", en: "newspaper", x, y, kunst: k + flaeche(-7.5, -8, 15.5, 8.4) });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/muelltrennung.js"));
console.log(aus);
