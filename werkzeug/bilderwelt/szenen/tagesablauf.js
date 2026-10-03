#!/usr/bin/env node
/* =====================================================================
   DER TAGESABLAUF (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   Die alten Wörter sind TÄTIGKEITEN (aufstehen, frühstücken, zur Schule
   gehen, fernsehen …). Statt einer Bildergeschichte aus Kacheln zeigt die
   Szene einen echten Ort: die WOHNKÜCHE einer Familienwohnung am Morgen,
   von der aus man durch offene Türen ins Kinderzimmer, ins Bad und in den
   Flur sieht. Jede Tätigkeit hat ihre Station dort, wo sie wirklich
   passiert:
     aufstehen → der Wecker am Bett · schlafen gehen → das Bett
     sich waschen → das Waschbecken · die Zähne putzen → der Zahnputzbecher
     sich anziehen → die Garderobe · zur Schule gehen → das Kind mit Ranzen
     frühstücken → das Frühstück · zu Abend essen → der Esstisch
     zu Mittag essen → der Herd mit dem Topf
     die Hausaufgaben → Heft und Mäppchen am Küchentisch
     lernen → das Regal mit den Schulbüchern · fernsehen → der Fernseher
     spielen → der Spielteppich · aufräumen → die Spielzeugkiste
   RECHERCHE (Familienalltag in Deutschland, Ratgeber „Hausaufgaben am
   Küchentisch“, Grundschul-Morgenroutine): Schule beginnt meist um 8 Uhr,
   Frühstück gegen 7 Uhr (Brötchen, Müsli, Kakao); der Schulranzen mit
   Brotdose steht im Flur; der Familienkalender hängt am Kühlschrank;
   abends gibt es oft „Abendbrot“ am Esstisch.
   PERSPEKTIVE: Fluchtpunkt (160 | 95), Augenhöhe 1,2 m (Kinderhöhe),
   Brennweite 240. Rückwand 6 m entfernt (40 Einheiten je Meter), die
   Nachbarräume reichen bis 9 m. Esstisch 4,4–5,2 m.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "tagesablauf", titel: "Der Tagesablauf", emoji: "⏰", thema: "Alltag", kuerzel: "b16d", fassung: 852 });
const rnd = zufall(715);
const r = B.r;

const F = 240, CAM = 1.2, HZ = 95, VX = 160;
const P = (X, Y, Z) => [r(VX + F * X / Z), r(HZ + F * (CAM - Y) / Z)];
const s = (Z) => F / Z;
const boden = (Z) => HZ + F * CAM / Z;
const poly = (pts, fill, extra = "") => `<path d="M${pts.map((p) => p.join(" ")).join(" L")} Z" fill="${fill}"${extra}/>`;
function quader(X0, X1, Y0, Y1, Z0, Z1, farben, ox = 0, oy = 0) {
  const q = (X, Y, Z) => { const [x, y] = P(X, Y, Z); return [r(x - ox), r(y - oy)]; };
  let g = "";
  if (Y1 < CAM && farben.oben) g += poly([q(X0, Y1, Z0), q(X1, Y1, Z0), q(X1, Y1, Z1), q(X0, Y1, Z1)], farben.oben);
  if (Y0 > CAM && farben.unten) g += poly([q(X0, Y0, Z0), q(X1, Y0, Z0), q(X1, Y0, Z1), q(X0, Y0, Z1)], farben.unten);
  if (X1 < 0 && farben.seite) g += poly([q(X1, Y0, Z0), q(X1, Y0, Z1), q(X1, Y1, Z1), q(X1, Y1, Z0)], farben.seite);
  if (X0 > 0 && farben.seite) g += poly([q(X0, Y0, Z0), q(X0, Y0, Z1), q(X0, Y1, Z1), q(X0, Y1, Z0)], farben.seite);
  g += poly([q(X0, Y0, Z0), q(X1, Y0, Z0), q(X1, Y1, Z0), q(X0, Y1, Z0)], farben.vorne);
  return g;
}

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const HOLZ = S.lg("holz", [[0, "#d2a878"], [1, "#b98d5c"]]);
const HOLZ_D = S.lg("holzd", [[0, "#a77a4b"], [1, "#8a6038"]]);
const WEISS = S.lg("weiss", [[0, "#fbfbf9"], [1, "#e5e6e2"]]);
const STAHL = S.lg("stahl", [[0, "#eef1f3"], [0.5, "#c3cacf"], [1, "#e1e5e8"]], 0, 0, 1, 0);

const ZW = 6, ZN = 9, HR = 2.6;                      // Rückwand, Nachbarräume, Raumhöhe
const TUEREN = { kiz: [-1.3, -0.4], bad: [0.1, 1.0], flur: [2.8, 3.7] };
const TH = 2.05;

/* =====================================================================
   KULISSE — Nachbarräume (hinter den Türen), Rückwand mit Türöffnungen,
   Decke, Holzdielen
   ===================================================================== */
{
  let k = "";
  /* Nachbarräume: Rückwand bei Z = 9, Boden, jeweils eigener Belag */
  const raum = (X0, X1, wand, bodenF, deko) => {
    const [ca, cb] = P(X0, TH, ZW), [cc] = P(X1, 0, ZW), cid = S.id("raum" + X0);
    S.def(`<clipPath id="${cid}"><rect x="${r(ca - 3)}" y="${r(cb - 3)}" width="${r(cc - ca + 6)}" height="${r(boden(ZW) - cb + 4)}"/></clipPath>`);
    return `<g clip-path="url(#${cid})">` + raumInnen(X0, X1, wand, bodenF, deko) + `</g>`;
  };
  const raumInnen = (X0, X1, wand, bodenF, deko) => {
    const [a] = P(X0 - 1.2, 0, ZN), [b] = P(X1 + 2.6, 0, ZN), [, yo] = P(0, HR, ZN), yb = boden(ZN);
    let g = `<rect x="${r(a)}" y="${r(yo)}" width="${r(b - a)}" height="${r(yb - yo)}" fill="${wand}"/>`;
    const [c] = P(X0 - 1, 0, ZW), [d] = P(X1 + 2.4, 0, ZW);
    g += `<path d="M${r(a)} ${r(yb)} L${r(b)} ${r(yb)} L${r(d)} ${r(boden(ZW))} L${r(c)} ${r(boden(ZW))} Z" fill="${bodenF}"/>`;
    return g + (deko || "");
  };
  /* Kinderzimmer: hellblaue Wand, Teppichboden */
  k += raum(...TUEREN.kiz, S.lg("kizwand", [[0, "#cfe3ef"], [1, "#b9d3e3"]]), "#b9a68a",
    (() => { const [x, y] = P(-1.0, 1.75, ZN); let g = `<rect x="${r(x - 6)}" y="${r(y - 5)}" width="12" height="9" fill="#fff" stroke="#c9a46a" stroke-width=".6"/><path d="M${r(x - 5)} ${r(y + 3)} l4 -5 l3 3 l2 -2 l2 4 Z" fill="#7fb36a"/><circle cx="${r(x + 3)}" cy="${r(y - 2)}" r="1.2" fill="#f2c94c"/>`; for (let i = 0; i < 6; i++) g += `<circle cx="${r(P(-1.6 + i * 0.25, 0, ZN)[0])}" cy="${r(P(0, 2.2, ZN)[1])}" r=".7" fill="#f2c94c" opacity=".8"/>`; return g; })());
  /* Bad: weiße Fliesen, graue Bodenfliesen */
  {
    const [a] = P(TUEREN.bad[0] - 1.2, 0, ZN), [b] = P(TUEREN.bad[1] + 1.2, 0, ZN), [, yo] = P(0, HR, ZN), yb = boden(ZN);
    let deko = "";
    for (let Y = 0.25; Y < HR; Y += 0.25) { const [, y] = P(0, Y, ZN); deko += `<rect x="${r(a)}" y="${r(y)}" width="${r(b - a)}" height=".3" fill="#cfd6d8"/>`; }
    for (let X = TUEREN.bad[0] - 1.2; X < TUEREN.bad[1] + 1.2; X += 0.25) { const [x] = P(X, 0, ZN); deko += `<rect x="${r(x)}" y="${r(yo)}" width=".3" height="${r(yb - yo)}" fill="#cfd6d8"/>`; }
    k += raum(...TUEREN.bad, "#f1f4f4", "#9aa3a6", deko);
  }
  /* Flur: warmes Gelb, Holzboden, Wohnungstür seitlich angedeutet */
  k += raum(...TUEREN.flur, S.lg("flurwand", [[0, "#f3e3bf"], [1, "#e6d1a6"]]), "#a8784a",
    (() => { const [x0, y0] = P(4.95, 2.1, ZN), [x1, y1] = P(5.9, 0, ZN); return `<rect x="${r(x0)}" y="${r(y0)}" width="${r(x1 - x0)}" height="${r(y1 - y0)}" fill="#8a5a34"/><circle cx="${r(x0 + 3)}" cy="${r((y0 + y1) / 2)}" r=".9" fill="#d8c08a"/>`; })());
  /* Rückwand mit drei Türöffnungen (evenodd) */
  const wy0 = P(0, HR, ZW)[1], wy1 = boden(ZW);
  let loch = "";
  for (const [X0, X1] of Object.values(TUEREN)) { const [a, b] = P(X0, TH, ZW), [c] = P(X1, 0, ZW); loch += ` M${a} ${b} L${c} ${b} L${c} ${r(wy1)} L${a} ${r(wy1)} Z`; }
  k += `<path d="M0 ${r(wy0)} L320 ${r(wy0)} L320 ${r(wy1)} L0 ${r(wy1)} Z${loch}" fill-rule="evenodd" fill="${S.lg("wand", [[0, "#f6efe2"], [1, "#ece2cf"]])}"/>`;
  k += `<path d="M0 ${r(wy0)} L320 ${r(wy0)} L320 ${r(wy1)} L0 ${r(wy1)} Z${loch}" fill-rule="evenodd" fill="${S.rg("wandlicht", [[0, "#fff8e8", 0.6], [1, "#fff8e8", 0]], 0.35, 0.3, 0.7)}"/>`;
  /* Fußleiste */
  for (const [a, b] of [[0, P(TUEREN.kiz[0], 0, ZW)[0]], [P(TUEREN.kiz[1], 0, ZW)[0], P(TUEREN.bad[0], 0, ZW)[0]], [P(TUEREN.bad[1], 0, ZW)[0], P(TUEREN.flur[0], 0, ZW)[0]], [P(TUEREN.flur[1], 0, ZW)[0], 320]]) k += `<rect x="${r(a)}" y="${r(wy1 - 2.4)}" width="${r(b - a)}" height="2.4" fill="#fbfaf6" stroke="#d8d1c2" stroke-width=".2"/>`;
  /* Türzargen (weiß) und offene Türblätter (nach innen in den Nachbarraum) */
  for (const [X0, X1] of Object.values(TUEREN)) {
    const [a, b] = P(X0, TH, ZW), [c] = P(X1, 0, ZW);
    k += `<path d="M${r(a - 2)} ${r(wy1)} L${r(a - 2)} ${r(b - 2)} L${r(c + 2)} ${r(b - 2)} L${r(c + 2)} ${r(wy1)} L${c} ${r(wy1)} L${c} ${b} L${a} ${b} L${a} ${r(wy1)} Z" fill="#fdfdfb" stroke="#d8d1c2" stroke-width=".3"/>`;
    /* Laibung links (wir stehen rechts davon) bzw. rechts */
    const lai = (X) => { const p1 = P(X, TH, ZW), p2 = P(X, TH, ZW + 0.15), p3 = P(X, 0, ZW + 0.15), p4 = P(X, 0, ZW); return poly([p1, p2, p3, p4], "#e7e1d4"); };
    k += X1 < 0 ? lai(X0) : X0 > 0 ? lai(X1) : "";
    /* Türblatt: offen, an der Wand des Nachbarraums */
    const hX = X0 > 0 ? X1 : X0;
    const t1 = P(hX, TH - 0.02, ZW + 0.15), t2 = P(hX, TH - 0.02, ZW + 0.95), t3 = P(hX, 0.01, ZW + 0.95), t4 = P(hX, 0.01, ZW + 0.15);
    if (X0 < 2) k += poly([t1, t2, t3, t4], "#f4f2ec", ` stroke="#cfc8b8" stroke-width=".3"`);   /* die Flurtür liegt hinter der Wand */
  }
  /* Lichtschalter neben den Türen */
  for (const X of [TUEREN.kiz[1] + 0.12, TUEREN.bad[1] + 0.12, TUEREN.flur[0] - 0.14]) { const [x, y] = P(X, 1.05, ZW); k += `<rect x="${r(x - 1.6)}" y="${r(y - 1.6)}" width="3.2" height="3.2" rx=".4" fill="#fbfbf8" stroke="#cfc8b8" stroke-width=".25"/>`; }
  /* Decke */
  k += `<path d="M0 0 L320 0 L320 ${r(wy0)} L0 ${r(wy0)} Z" fill="${S.lg("decke", [[0, "#e9e4da"], [1, "#f4f0e8"]])}"/>`;
  k += `<rect x="0" y="${r(wy0 - 1.2)}" width="320" height="1.2" fill="#e0d8c8"/>`;
  /* Holzdielen in Fluchtperspektive */
  k += `<rect x="0" y="${r(wy1)}" width="320" height="${r(200 - wy1)}" fill="${S.lg("dielen", [[0, "#c79a64"], [1, "#b5874f"]])}"/>`;
  for (let X = -6; X <= 6; X += 0.18) { const a = P(X, 0, ZW), b = P(X, 0, 2.7); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#9c7041" stroke-width=".3" opacity=".7"/>`; }
  for (let i = 0; i < 40; i++) { const X = -6 + Math.floor(rnd() * 66) * 0.18, Z = 2.8 + rnd() * 3.1, a = P(X, 0, Z), b = P(X + 0.18, 0, Z); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#9c7041" stroke-width=".3" opacity=".6"/>`; }
  k += `<rect x="0" y="${r(wy1)}" width="320" height="${r(200 - wy1)}" fill="${S.lg("dielenlicht", [[0, "#fff", 0.05], [1, "#000", 0.08]])}"/>`;
  S.hinten(k);
}
/* Clip für Dinge hinter einer Türöffnung (lokale Koordinaten des Teils) */
function tuerClip(name, tuer, ox, oy) {
  const [a, b] = P(tuer[0], TH, ZW), [c] = P(tuer[1], 0, ZW), y1 = boden(ZW);
  S.def(`<clipPath id="${S.id(name)}"><rect x="${r(a - ox)}" y="${r(b - oy)}" width="${r(c - a)}" height="${r(y1 - b)}"/></clipPath>`);
  return `url(#${S.id(name)})`;
}

/* =====================================================================
   KINDERZIMMER (durch die Tür): 1 — DAS BETT (schlafen gehen), 2 — DER WECKER (aufstehen)
   ===================================================================== */
{
  const ox = P(-1.45, 0, 8.2)[0], oy = boden(8.2);
  const cp = tuerClip("cpbett", TUEREN.kiz, ox, oy);
  let k = quader(-2.95, -0.98, 0, 0.42, 8.0, 8.95, { vorne: HOLZ, oben: HOLZ, seite: HOLZ_D }, ox, oy);
  k += quader(-2.9, -1.02, 0.42, 0.52, 7.98, 8.93, { vorne: "#f4f4ee", oben: "#fbfbf6", seite: "#e3e3db" }, ox, oy);
  /* Bettdecke mit Sternen, Kopfkissen rechts, Kuscheltier */
  k += quader(-2.92, -1.42, 0.5, 0.6, 7.95, 8.95, { vorne: S.lg("decke2", [[0, "#3f6fb0"], [1, "#2f5a94"]]), oben: "#4a7cc0", seite: "#2a5089" }, ox, oy);
  for (let i = 0; i < 6; i++) { const [x, y] = P(-2.8 + i * 0.22, 0.55, 7.95); k += `<circle cx="${r(x - ox)}" cy="${r(y - oy)}" r=".7" fill="#f6d55c"/>`; }
  { const [x, y] = P(-1.2, 0.62, 8.5); k += `<ellipse cx="${r(x - ox)}" cy="${r(y - oy)}" rx="5" ry="2.4" fill="#ffffff" stroke="#dcdcd4" stroke-width=".3"/>`;
    const [x2, y2] = P(-1.62, 0.6, 8.1); k += `<circle cx="${r(x2 - ox)}" cy="${r(y2 - oy - 3)}" r="2.2" fill="#a8774a"/><circle cx="${r(x2 - ox)}" cy="${r(y2 - oy - 5.6)}" r="1.7" fill="#b48455"/><circle cx="${r(x2 - ox - 1.3)}" cy="${r(y2 - oy - 7)}" r=".7" fill="#a8774a"/><circle cx="${r(x2 - ox + 1.3)}" cy="${r(y2 - oy - 7)}" r=".7" fill="#a8774a"/>`; }
  /* Kopfteil an der Wand */
  { const a = P(-1.0, 0.95, 8.93), b = P(-0.96, 0, 8.93); k += `<rect x="${r(a[0] - ox - 1.4)}" y="${r(a[1] - oy)}" width="1.6" height="${r(b[1] - a[1])}" fill="${HOLZ_D}"/>`; }
  S.teil({ id: "schlafengehen", de: "schlafen gehen", syl: "SCHLA-fen GE-hen", it: "andare a dormire", itSyl: "an-DA-re a dor-MI-re", en: "to go to sleep", x: ox, y: oy, kunst: `<g clip-path="${cp}">${k}</g>`,
    tipp: "Um acht Uhr abends geht das Kind schlafen." });
}
{
  /* Nachttisch mit Wecker (7:00) neben dem Kopfende */
  const ox = P(-0.8, 0, 8.6)[0], oy = boden(8.6);
  const cp = tuerClip("cpwecker", TUEREN.kiz, ox, oy);
  let k = quader(-0.93, -0.67, 0, 0.45, 8.5, 8.9, { vorne: WEISS, oben: "#ffffff", seite: "#d9d9d2" }, ox, oy);
  const [wx, wy] = P(-0.8, 0.45, 8.6);
  const cx = r(wx - ox), cy = r(wy - oy - 3);
  k += `<circle cx="${r(cx - 1.6)}" cy="${r(cy - 2.6)}" r="1" fill="#d23b30"/><circle cx="${r(cx + 1.6)}" cy="${r(cy - 2.6)}" r="1" fill="#d23b30"/>`;
  k += `<circle cx="${cx}" cy="${cy}" r="2.8" fill="#d23b30"/><circle cx="${cx}" cy="${cy}" r="2.1" fill="#fffdf6"/>`;
  k += `<line x1="${cx}" y1="${cy}" x2="${cx}" y2="${r(cy - 1.6)}" stroke="#222" stroke-width=".35"/><line x1="${cx}" y1="${cy}" x2="${cx}" y2="${r(cy + 1.1)}" stroke="#222" stroke-width=".45"/>`;
  k += `<path d="M${r(cx - 1.6)} ${r(cy + 2.4)} l-.6 1 M${r(cx + 1.6)} ${r(cy + 2.4)} l.6 1" stroke="#7a1e18" stroke-width=".5"/>`;
  k += `<path d="M${r(cx + 3.4)} ${r(cy - 3)} q1 1 0 2 M${r(cx - 3.4)} ${r(cy - 3)} q-1 1 0 2" stroke="#d23b30" stroke-width=".35" fill="none"/>`;
  S.teil({ oben: true, id: "aufstehen", de: "aufstehen", syl: "AUF-ste-hen", it: "alzarsi", itSyl: "al-ZAR-si", en: "to get up", x: ox, y: oy, kunst: `<g clip-path="${cp}">${k}</g>` + flaeche(-4, -18, 8, 18),
    tipp: "Der Wecker klingelt um sieben Uhr: Aufstehen!" });
}

/* =====================================================================
   BAD (durch die Tür): 3 — DAS WASCHBECKEN (sich waschen), 4 — ZAHNPUTZBECHER
   ===================================================================== */
{
  const ox = P(0.62, 0, 8.7)[0], oy = boden(8.7);
  const cp = tuerClip("cpbad", TUEREN.bad, ox, oy);
  let k = "";
  /* Spiegel, Säulenwaschbecken, Handtuch am Haken */
  const [mx0, my0] = P(0.38, 1.85, 8.95), [mx1, my1] = P(0.88, 1.2, 8.95);
  k += `<rect x="${r(mx0 - ox)}" y="${r(my0 - oy)}" width="${r(mx1 - mx0)}" height="${r(my1 - my0)}" rx="1" fill="${S.lg("badspiegel", [[0, "#dfe9ec"], [1, "#a9bcc3"]], 0, 0, 1, 1)}" stroke="#c9d1d4" stroke-width=".4"/><path d="M${r(mx0 - ox + 2)} ${r(my0 - oy)} l3 0 l-4 ${r(my1 - my0)} l-3 0 Z" fill="#fff" opacity=".35"/>`;
  k += quader(0.55, 0.71, 0, 0.7, 8.6, 8.85, { vorne: WEISS, oben: "#fff", seite: "#dcdedd" }, ox, oy);
  k += quader(0.36, 0.9, 0.7, 0.85, 8.45, 8.95, { vorne: "#fbfbfa", oben: S.rg("bk", [[0, "#cfd6d8"], [1, "#ffffff"]]), seite: "#dcdedd" }, ox, oy);
  { const [x, y] = P(0.63, 0.85, 8.9); k += `<rect x="${r(x - ox - 0.6)}" y="${r(y - oy - 4)}" width="1.2" height="4" fill="${STAHL}"/><rect x="${r(x - ox - 0.6)}" y="${r(y - oy - 4)}" width="3" height="1" fill="${STAHL}"/>`; }
  { const [x, y] = P(1.02, 1.5, 8.95); k += `<path d="M${r(x - ox - 2.6)} ${r(y - oy)} L${r(x - ox + 2.6)} ${r(y - oy)} L${r(x - ox + 2.4)} ${r(y - oy + 9)} L${r(x - ox - 2.4)} ${r(y - oy + 9)} Z" fill="#e58a6b"/>`; }
  S.teil({ id: "waschen", de: "sich waschen", syl: "sich WA-schen", it: "lavarsi", itSyl: "la-VAR-si", en: "to wash", x: ox, y: oy, kunst: `<g clip-path="${cp}">${k}</g>`,
    tipp: "Morgens wäscht man sich das Gesicht am Waschbecken." });
}
{
  const [x, y] = P(0.8, 0.85, 8.55);
  let k = `<path d="M-1.4 -3.4 L1.4 -3.4 L1.2 0 L-1.2 0 Z" fill="#7fc4e0"/>`;
  k += `<g transform="rotate(-12)"><rect x="-1.1" y="-8" width=".7" height="6" fill="#e2574c"/><rect x="-1.3" y="-9.4" width="1.1" height="1.8" fill="#fff"/></g><g transform="rotate(14)"><rect x=".4" y="-7.6" width=".7" height="5.6" fill="#3d9a5b"/><rect x=".2" y="-9" width="1.1" height="1.8" fill="#fff"/></g>`;
  S.teil({ oben: true, id: "zaehneputzen", de: "die Zähne putzen", syl: "ZÄH-ne PUT-zen", it: "lavarsi i denti", itSyl: "la-VAR-si i DEN-ti", en: "to brush teeth", x, y, kunst: k + flaeche(-2.6, -9.6, 5.2, 9.8),
    tipp: "Nach dem Frühstück putzt man die Zähne – zwei Minuten lang." });
}

/* =====================================================================
   FLUR (durch die Tür): 5 — DIE GARDEROBE (sich anziehen), 6 — DAS KIND (zur Schule gehen)
   ===================================================================== */
{
  const ox = P(4.5, 0, 8.85)[0], oy = boden(8.85);
  const cp = tuerClip("cpflur", TUEREN.flur, ox, oy);
  let k = "";
  const q = (X, Y, Z) => { const [x, y] = P(X, Y, Z); return [r(x - ox), r(y - oy)]; };
  /* Hakenleiste mit Jacke, Mütze, Schal; Schuhbank darunter */
  const [h0, hy] = q(4.18, 1.65, 8.97), [h1] = q(4.88, 1.65, 8.97);
  k += `<rect x="${h0}" y="${r(hy - 1)}" width="${r(h1 - h0)}" height="2.4" rx=".5" fill="${HOLZ}"/>`;
  for (let i = 0; i < 4; i++) k += `<circle cx="${r(h0 + 2 + i * (h1 - h0 - 4) / 3)}" cy="${r(hy + 0.4)}" r=".7" fill="#555"/>`;
  k += `<path d="M${r(h0 + 1)} ${r(hy + 1)} L${r(h0 + 5)} ${r(hy + 1)} L${r(h0 + 6.4)} ${r(hy + 20)} L${r(h0 - 0.6)} ${r(hy + 20)} Z" fill="${S.lg("jacke", [[0, "#d65a3c"], [1, "#b2442a"]], 0, 0, 1, 0)}"/><path d="M${r(h0 + 3)} ${r(hy + 2)} L${r(h0 + 3)} ${r(hy + 19)}" stroke="#7a2a18" stroke-width=".4"/>`;
  k += `<path d="M${r(h0 + 9)} ${r(hy + 1)} L${r(h0 + 12.4)} ${r(hy + 1)} L${r(h0 + 13.4)} ${r(hy + 24)} L${r(h0 + 8)} ${r(hy + 24)} Z" fill="#3e556b"/>`;
  k += `<path d="M${r(h0 + 16)} ${r(hy + 1)} q2 3 0 7 q2 3 0 6" stroke="#e7b93c" stroke-width="1.6" fill="none"/><ellipse cx="${r(h1 - 2)}" cy="${r(hy + 3.4)}" rx="2.4" ry="2" fill="#5a8ac2"/><circle cx="${r(h1 - 2)}" cy="${r(hy + 1.2)}" r=".9" fill="#f1f1f1"/>`;
  k += quader(4.18, 4.88, 0, 0.42, 8.6, 8.95, { vorne: HOLZ, oben: "#d9b386", seite: HOLZ_D }, ox, oy);
  for (const [X, f] of [[4.26, "#2f3a4a"], [4.44, "#c0392b"], [4.62, "#3d6b8a"]]) { const [x, y] = q(X, 0, 8.55); k += `<path d="M${x} ${y} l0 -1.6 q1 -1.2 3 -.6 l2.4 1.2 l0 1 Z" fill="${f}"/>`; }
  S.teil({ id: "anziehen", de: "sich anziehen", syl: "sich AN-zie-hen", it: "vestirsi", itSyl: "ve-STIR-si", en: "to get dressed", x: ox, y: oy, kunst: `<g clip-path="${cp}">${k}</g>`,
    tipp: "An der Garderobe hängen Jacke, Mütze und Schal. Die Schuhe stehen darunter." });
}
{
  const Z = 8.1, x = P(4.62, 0, Z)[0], y = boden(Z);
  const m = B.mensch({ id: "tb_kind", geschlecht: "m", alter: "kind", pose: "gehen", blick: 70, frisur: "kurz", haarfarbe: "blond", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "pullover", farbe: "gruen" }, unterteil: { stueck: "jeans" }, jacke: { stueck: "jacke", farbe: "gelb" }, schuhe: { stueck: "turnschuh" }, zubehoer: { stueck: "rucksack", farbe: "rot" } } }, 1.3 * s(Z));
  const cp = tuerClip("cpkind", TUEREN.flur, x, y);
  S.teil({ id: "zurschulegehen", de: "zur Schule gehen", syl: "zur SCHU-le GE-hen", it: "andare a scuola", itSyl: "an-DA-re a SCUO-la", en: "to go to school", x, y, kunst: `<g clip-path="${cp}">${m.svg}</g>`,
    tipp: "Um halb acht geht das Kind mit dem Schulranzen zur Schule." });
}

/* =====================================================================
   KÜCHE an der Rückwand: 7 — DER KÜHLSCHRANK mit 8 — KALENDER,
   9 — DER HERD (zu Mittag essen), 10 — DIE SPÜLE
   ===================================================================== */
const KZ0 = ZW - 0.6, KZ1 = ZW;                      // Küchenzeile 60 cm tief
{
  const ox = P(-3.25, 0, KZ0)[0], oy = boden(KZ0);
  let k = schatten(0, 0.5, 14, 1.4, 0.3);
  k += quader(-3.55, -2.95, 0, 1.85, KZ0 - 0.05, KZ1, { vorne: S.lg("kuehl", [[0, "#f1f2f0"], [1, "#d6d8d5"]], 0, 0, 1, 0), seite: "#c5c8c4" }, ox, oy);
  const q = (X, Y) => { const [x, y] = P(X, Y, KZ0 - 0.05); return [r(x - ox), r(y - oy)]; };
  const [a, t] = q(-3.55, 1.85), [b] = q(-2.95, 0), [, mid] = q(0, 1.25);
  k += `<rect x="${a}" y="${r(mid)}" width="${r(b - a)}" height=".6" fill="#b9bcb8"/>`;
  k += `<rect x="${r(b - 3)}" y="${r(mid - 12)}" width="1.2" height="9" rx=".6" fill="#c9cdd0"/><rect x="${r(b - 3)}" y="${r(mid + 3)}" width="1.2" height="12" rx=".6" fill="#c9cdd0"/>`;
  /* Magnete, Kinderbild, Stundenplan */
  k += `<rect x="${r(a + 4)}" y="${r(mid + 8)}" width="9" height="7" fill="#fff" transform="rotate(-4 ${r(a + 4)} ${r(mid + 8)})"/><circle cx="${r(a + 6)}" cy="${r(mid + 12)}" r="1.4" fill="#f2c94c"/><path d="M${r(a + 5)} ${r(mid + 14.4)} l3 -3 l3 3" stroke="#3d9a5b" stroke-width=".6" fill="none"/>`;
  k += `<rect x="${r(a + 5)}" y="${r(mid + 19)}" width="11" height="8" fill="#eaf3fb"/><text x="${r(a + 10.5)}" y="${r(mid + 21)}" font-size="1.4" text-anchor="middle" fill="#2c5f9e" font-family="Arial" font-weight="bold">Stundenplan</text>`;
  for (let i = 0; i < 3; i++) for (let j = 0; j < 5; j++) k += `<rect x="${r(a + 5.6 + j * 2)}" y="${r(mid + 22 + i * 1.6)}" width="1.6" height="1.2" fill="${["#f6c3c3", "#c3dcf6", "#cdeec4", "#f6e7b0", "#e1d0f2"][(i + j) % 5]}"/>`;
  for (const [dx, dy, f] of [[6, 8, "#d23b30"], [14, 19, "#2d6fb3"]]) k += `<circle cx="${r(a + dx)}" cy="${r(mid + dy)}" r=".9" fill="${f}"/>`;
  S.teil({ id: "kuehlschrank", de: "der Kühlschrank", syl: "KÜHL-schrank", it: "il frigorifero", itSyl: "fri-go-RI-fe-ro", en: "fridge", x: ox, y: oy, steht: true, kunst: k });
}
{
  /* Familienkalender an der Kühlschranktür (oben), Oktober, ein Tag umkringelt */
  const [x, y] = P(-3.28, 1.42, KZ0 - 0.06);
  let k = `<rect x="-6.6" y="-12" width="13.2" height="12" fill="#fff" stroke="#c9c4b8" stroke-width=".25"/><rect x="-6.6" y="-12" width="13.2" height="3.2" fill="#d9822b"/><text x="0" y="-9.7" font-size="1.9" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">OKTOBER</text>`;
  for (let i = 0; i < 28; i++) { const cx = -5.8 + (i % 7) * 1.85, cy = -7.4 + Math.floor(i / 7) * 1.8; k += `<rect x="${r(cx)}" y="${r(cy)}" width="1.6" height="1.5" fill="${i % 7 > 4 ? "#f3e1cf" : "#f4f4f1"}"/>`; if (i === 2 || i === 9 || i === 16) k += `<rect x="${r(cx + 0.2)}" y="${r(cy + 0.9)}" width="1.2" height=".35" fill="#2d6fb3"/>`; }
  k += `<circle cx="${r(-5.8 + 4 * 1.85 + 0.8)}" cy="${r(-7.4 + 2 * 1.8 + 0.75)}" r="1.2" fill="none" stroke="#d23b30" stroke-width=".35"/>`;
  k += `<circle cx="0" cy="-12.6" r=".8" fill="#2d6fb3"/>`;
  S.teil({ oben: true, id: "kalender", de: "der Kalender", syl: "Ka-LEN-der", it: "il calendario", itSyl: "ca-len-DA-rio", en: "calendar", x, y, kunst: k,
    tipp: "Im Familienkalender stehen alle Termine: Schule, Sport, Arzt." });
}
{
  /* Küchenzeile: Unterschränke, Arbeitsplatte, Oberschränke, Dunstabzug — Kulissen-Möbel als Teil „die Spüle“ */
  const ox = P(-2.5, 0, KZ0)[0], oy = boden(KZ0);
  const q = (X, Y, Z) => { const [x, y] = P(X, Y, Z); return [r(x - ox), r(y - oy)]; };
  let k = schatten(0, 0.5, 38, 1.6, 0.25);
  /* Oberschränke */
  k += quader(-2.92, -1.6, 1.5, 2.25, ZW - 0.35, ZW, { vorne: S.lg("ober", [[0, "#8fb8a4"], [1, "#7aa58f"]]), unten: "#6b927f", seite: "#6b927f" }, ox, oy);
  for (const X of [-2.48, -2.04]) { const a = q(X, 2.25, ZW - 0.35), b = q(X, 1.5, ZW - 0.35); k += `<rect x="${r(a[0] - 0.2)}" y="${a[1]}" width=".4" height="${r(b[1] - a[1])}" fill="#5f8673"/>`; }
  for (const X of [-2.6, -2.36, -1.92, -1.7]) { const a = q(X, 1.56, ZW - 0.35); k += `<rect x="${r(a[0] - 0.4)}" y="${r(a[1] - 3)}" width=".8" height="3" rx=".4" fill="#e7e2d6"/>`; }
  /* Unterschränke */
  k += quader(-2.92, -1.6, 0.1, 0.86, KZ0 + 0.03, ZW, { vorne: S.lg("unter", [[0, "#8fb8a4"], [1, "#77a28c"]]), seite: "#6b927f" }, ox, oy);
  { const a = q(-2.92, 0.1, KZ0 + 0.03), b = q(-1.6, 0, KZ0 + 0.03); k += `<rect x="${a[0]}" y="${a[1]}" width="${r(b[0] - a[0])}" height="${r(b[1] - a[1])}" fill="#3f3a33"/>`; }
  for (const X of [-2.32, -1.98]) { const a = q(X, 0.86, KZ0 + 0.03), b = q(X, 0.1, KZ0 + 0.03); k += `<rect x="${r(a[0] - 0.2)}" y="${a[1]}" width=".4" height="${r(b[1] - a[1])}" fill="#5f8673"/>`; }
  for (const X of [-2.15, -1.79]) { const a = q(X, 0.78, KZ0 + 0.03); k += `<rect x="${r(a[0] - 3)}" y="${r(a[1])}" width="6" height=".9" rx=".4" fill="#e7e2d6"/>`; }
  /* Arbeitsplatte Holz */
  k += quader(-2.94, -1.58, 0.86, 0.9, KZ0, ZW, { vorne: "#b48452", oben: "#d6ab78", seite: "#9c6f42" }, ox, oy);
  /* Fliesenspiegel */
  { const a = q(-2.92, 1.5, ZW - 0.01), b = q(-1.6, 0.9, ZW - 0.01); k += `<rect x="${a[0]}" y="${a[1]}" width="${r(b[0] - a[0])}" height="${r(b[1] - a[1])}" fill="#f4f1ea"/>`; for (let Y = 1.0; Y < 1.5; Y += 0.1) { const c = q(0, Y, ZW); k += `<rect x="${a[0]}" y="${c[1]}" width="${r(b[0] - a[0])}" height=".25" fill="#d6d0c4"/>`; } }
  /* Spüle mit Wasserhahn (rechts) */
  { const a = q(-2.24, 0.9, KZ0 + 0.12), b = q(-1.96, 0.9, KZ0 + 0.12), c = q(-2.24, 0.9, KZ0 + 0.48);
    k += `<path d="M${a[0]} ${a[1]} L${b[0]} ${b[1]} L${r(b[0] + (c[0] - a[0]))} ${c[1]} L${c[0]} ${c[1]} Z" fill="${STAHL}" stroke="#9aa3aa" stroke-width=".3"/>`;
    const h = q(-2.1, 0.9, KZ0 + 0.5); k += `<rect x="${r(h[0] - 0.6)}" y="${r(h[1] - 7)}" width="1.2" height="7" fill="${STAHL}"/><path d="M${r(h[0])} ${r(h[1] - 7)} q0 -2 2.4 -2 l1.6 0 l0 1.4" stroke="#b5bcc2" stroke-width="1" fill="none"/>`; }
  /* Kaffeemaschine und Brotkasten auf der Arbeitsplatte */
  { const p = q(-1.84, 0.9, KZ0 + 0.35); k += `<rect x="${r(p[0] - 2)}" y="${r(p[1] - 11)}" width="7" height="11" rx="1" fill="#2c2f33"/><rect x="${r(p[0] - 1)}" y="${r(p[1] - 5)}" width="4.6" height="4.4" rx=".8" fill="#e6e6e2" opacity=".85"/><rect x="${r(p[0] - 0.4)}" y="${r(p[1] - 3)}" width="3.4" height="2.4" fill="#5a3a22"/>`; }
  S.teil({ id: "spuele", de: "die Spüle", syl: "SPÜ-le", it: "il lavello", itSyl: "la-VEL-lo", en: "sink", x: ox, y: oy, steht: true, kunst: k });
}
{
  /* DER HERD mit Kochfeld, Backofen und Topf (Nudeln fürs Mittagessen), Dunstabzug */
  const ox = P(-2.5, 0, KZ0)[0], oy = boden(KZ0);
  const q = (X, Y, Z) => { const [x, y] = P(X, Y, Z); return [r(x - ox), r(y - oy)]; };
  let k = "";
  const a = q(-2.88, 0.82, KZ0 + 0.02), b = q(-2.34, 0.12, KZ0 + 0.02);
  k += `<rect x="${a[0]}" y="${a[1]}" width="${r(b[0] - a[0])}" height="${r(b[1] - a[1])}" rx=".6" fill="#2a2d31"/>`;
  k += `<rect x="${r(a[0] + 2)}" y="${r(a[1] + 6)}" width="${r(b[0] - a[0] - 4)}" height="${r(b[1] - a[1] - 10)}" rx="1" fill="${S.lg("ofen", [[0, "#3b3530"], [1, "#1b1917"]])}"/><rect x="${r(a[0] + 2)}" y="${r(a[1] + 6)}" width="${r(b[0] - a[0] - 4)}" height="2" fill="#ffb04a" opacity=".25"/>`;
  k += `<rect x="${r(a[0] + 2)}" y="${r(a[1] + 2.4)}" width="${r(b[0] - a[0] - 4)}" height="1" rx=".5" fill="#9aa3aa"/>`;
  for (let i = 0; i < 4; i++) k += `<circle cx="${r(a[0] + 4 + i * (b[0] - a[0] - 8) / 3)}" cy="${r(a[1] + 1.2)}" r=".7" fill="#c9cdd0"/>`;
  /* Kochfeld (schwarzes Glas) */
  { const c = q(-2.88, 0.905, KZ0 + 0.06), d = q(-2.34, 0.905, KZ0 + 0.06), e = q(-2.34, 0.905, KZ0 + 0.55), f = q(-2.88, 0.905, KZ0 + 0.55);
    k += poly([c, d, e, f], "#1f2124"); }
  /* Topf mit Deckel, Dampf */
  { const p = q(-2.7, 0.905, KZ0 + 0.3);
    k += `<ellipse cx="${p[0]}" cy="${r(p[1] - 0.2)}" rx="4.6" ry=".8" fill="#ff5a2a" opacity=".55"/>`;
    k += `<path d="M${r(p[0] - 4)} ${r(p[1])} L${r(p[0] - 4)} ${r(p[1] - 6)} L${r(p[0] + 4)} ${r(p[1] - 6)} L${r(p[0] + 4)} ${r(p[1])} Z" fill="${STAHL}"/><ellipse cx="${p[0]}" cy="${r(p[1] - 6)}" rx="4.2" ry=".9" fill="#c9cfd4"/><rect x="${r(p[0] - 1)}" y="${r(p[1] - 7.6)}" width="2" height="1.2" rx=".5" fill="#2b2b2b"/>`;
    k += `<rect x="${r(p[0] - 6.4)}" y="${r(p[1] - 5)}" width="2.4" height=".9" rx=".4" fill="#2b2b2b"/><rect x="${r(p[0] + 4)}" y="${r(p[1] - 5)}" width="2.4" height=".9" rx=".4" fill="#2b2b2b"/>`;
    k += `<path d="M${r(p[0] - 1)} ${r(p[1] - 8)} q-1.4 -2 0 -3.6 q1.4 -1.6 0 -3.2 M${r(p[0] + 1.6)} ${r(p[1] - 8)} q1.2 -2 0 -3.4" stroke="#fff" stroke-width=".6" opacity=".6" fill="none"/>`;
    const p2 = q(-2.47, 0.905, KZ0 + 0.18); k += `<path d="M${r(p2[0] - 3.4)} ${r(p2[1])} L${r(p2[0] - 3)} ${r(p2[1] - 2.6)} L${r(p2[0] + 3)} ${r(p2[1] - 2.6)} L${r(p2[0] + 3.4)} ${r(p2[1])} Z" fill="#2d2f33"/><rect x="${r(p2[0] + 3)}" y="${r(p2[1] - 2.2)}" width="5" height=".8" rx=".4" fill="#2d2f33"/><ellipse cx="${p2[0]}" cy="${r(p2[1] - 2.6)}" rx="3" ry=".6" fill="#d33a2a"/>`; }
  /* Dunstabzugshaube */
  { const c = q(-2.9, 1.62, ZW - 0.45), d = q(-2.32, 1.5, ZW - 0.45), e = q(-2.7, 2.6, ZW - 0.1), f = q(-2.52, 1.62, ZW - 0.1);
    k += `<rect x="${r(e[0])}" y="${e[1]}" width="${r(f[0] - e[0])}" height="${r(f[1] - e[1])}" fill="${STAHL}"/>`;
    k += `<path d="M${c[0]} ${c[1]} L${d[0]} ${c[1]} L${d[0]} ${d[1]} L${c[0]} ${d[1]} Z" fill="${STAHL}"/><rect x="${c[0]}" y="${r(d[1] - 0.8)}" width="${r(d[0] - c[0])}" height=".8" fill="#7d868d"/>`; }
  S.teil({ id: "mittagessen", de: "zu Mittag essen", syl: "zu MIT-tag ES-sen", it: "pranzare", itSyl: "pran-ZA-re", en: "to have lunch", x: ox, y: oy, kunst: k,
    tipp: "Mittags gibt es Nudeln mit Tomatensoße – frisch vom Herd." });
}

/* =====================================================================
   11 — DIE UHR (Küchenuhr über der Kinderzimmertür): Viertel nach sieben
   ===================================================================== */
{
  const [x, y] = P(-0.85, 2.36, ZW);
  let k = `<circle r="6.4" fill="#2c3e50"/><circle r="5.6" fill="${S.rg("zb", [[0, "#ffffff"], [1, "#efeae0"]])}"/>`;
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; k += `<line x1="${r(Math.sin(a) * 4.9)}" y1="${r(-Math.cos(a) * 4.9)}" x2="${r(Math.sin(a) * (i % 3 ? 4.4 : 3.9))}" y2="${r(-Math.cos(a) * (i % 3 ? 4.4 : 3.9))}" stroke="#2c3e50" stroke-width="${i % 3 ? 0.3 : 0.55}"/>`; }
  const hA = (7.25 / 12) * 2 * Math.PI, mA = 0.25 * 2 * Math.PI;
  k += `<line x1="0" y1="0" x2="${r(Math.sin(hA) * 2.7)}" y2="${r(-Math.cos(hA) * 2.7)}" stroke="#1d2a36" stroke-width=".8" stroke-linecap="round"/><line x1="0" y1="0" x2="${r(Math.sin(mA) * 4.1)}" y2="${r(-Math.cos(mA) * 4.1)}" stroke="#1d2a36" stroke-width=".5" stroke-linecap="round"/>`;
  k += `<circle r=".5" fill="#d23b30"/><path d="M-3.6 -3.8 A5.4 5.4 0 0 1 2.6 -4.8" stroke="#fff" stroke-width=".6" opacity=".6" fill="none"/>`;
  S.teil({ id: "uhr", de: "die Uhr", syl: "UHR", it: "l'orologio", itSyl: "o-ro-LO-gio", en: "clock", x, y, kunst: k,
    tipp: "Es ist Viertel nach sieben – Zeit zum Frühstücken." });
}

/* =====================================================================
   12 — DAS REGAL mit Schulbüchern und Globus (lernen), 13 — DER FERNSEHER
   ===================================================================== */
{
  const ox = P(1.55, 0, ZW - 0.32)[0], oy = boden(ZW - 0.32);
  const q = (X, Y, Z) => { const [x, y] = P(X, Y, Z); return [r(x - ox), r(y - oy)]; };
  let k = schatten(0, 0.4, 10, 1.2, 0.25);
  k += quader(1.25, 1.85, 0, 1.75, ZW - 0.32, ZW, { vorne: "#f3efe6", oben: "#faf7f0", seite: "#d9d3c4" }, ox, oy);
  const fach = [[0.05, 0.55], [0.6, 1.1], [1.15, 1.7]];
  for (const [y0, y1] of fach) { const a = q(1.29, y1, ZW - 0.3), b = q(1.81, y0, ZW - 0.3); k += `<rect x="${a[0]}" y="${a[1]}" width="${r(b[0] - a[0])}" height="${r(b[1] - a[1])}" fill="#d8cfbd"/>`; }
  /* Bücher */
  const farben = ["#c0392b", "#2d6fb3", "#f2c94c", "#3d9a5b", "#8e44ad", "#e67e22", "#16a085", "#2c3e50"];
  for (const [fi, n] of [[0, 9], [1, 6]]) { const [y0] = fach[fi]; for (let i = 0; i < n; i++) { const X = 1.31 + i * 0.055, hgt = 0.3 + (i % 3) * 0.06; const a = q(X, y0 + hgt, ZW - 0.3), b = q(X + 0.045, y0, ZW - 0.3); k += `<rect x="${a[0]}" y="${a[1]}" width="${r(b[0] - a[0])}" height="${r(b[1] - a[1])}" fill="${farben[(i + fi * 3) % 8]}"/><rect x="${a[0]}" y="${r(a[1] + 2)}" width="${r(b[0] - a[0])}" height=".5" fill="#fff" opacity=".6"/>`; } }
  /* Globus im mittleren Fach, Ordner oben */
  { const c = q(1.7, 0.6, ZW - 0.3); k += `<rect x="${r(c[0] - 2)}" y="${r(c[1] - 1)}" width="4" height="1" fill="#8a6a3a"/><rect x="${r(c[0] - 0.3)}" y="${r(c[1] - 4)}" width=".6" height="3" fill="#8a6a3a"/><circle cx="${c[0]}" cy="${r(c[1] - 8)}" r="4.4" fill="#4a90c9"/><path d="M${r(c[0] - 3)} ${r(c[1] - 10)} q2 -1 3 1 q1 2 -1 3 Z M${r(c[0] + 1)} ${r(c[1] - 7)} q2 0 2 2 l-2 1 Z" fill="#6bbf59"/><path d="M${r(c[0] + 4.4)} ${r(c[1] - 8)} A4.4 4.4 0 0 1 ${r(c[0] - 1)} ${r(c[1] - 3.8)}" stroke="#8a6a3a" stroke-width=".5" fill="none"/>`; }
  for (let i = 0; i < 4; i++) { const a = q(1.32 + i * 0.12, 1.55, ZW - 0.3), b = q(1.42 + i * 0.12, 1.15, ZW - 0.3); k += `<rect x="${a[0]}" y="${a[1]}" width="${r(b[0] - a[0])}" height="${r(b[1] - a[1])}" fill="${["#2d6fb3", "#c0392b", "#3d9a5b", "#f2c94c"][i]}"/><rect x="${r(a[0] + 1)}" y="${r(a[1] + 3)}" width="${r(b[0] - a[0] - 2)}" height="3" fill="#fff"/>`; }
  S.teil({ id: "lernen", de: "lernen", syl: "LER-nen", it: "studiare", itSyl: "stu-DIA-re", en: "to learn", x: ox, y: oy, steht: true, kunst: k,
    tipp: "Im Regal stehen die Schulbücher, das Wörterbuch und der Globus." });
}
{
  const ox = P(2.3, 0, ZW - 0.42)[0], oy = boden(ZW - 0.42);
  const q = (X, Y, Z) => { const [x, y] = P(X, Y, Z); return [r(x - ox), r(y - oy)]; };
  let k = schatten(0, 0.4, 14, 1.4, 0.25);
  /* Lowboard */
  k += quader(1.95, 2.7, 0.08, 0.45, ZW - 0.42, ZW, { vorne: S.lg("lowb", [[0, "#5c4a3b"], [1, "#46382c"]]), oben: "#6d5949", seite: "#3f3227" }, ox, oy);
  for (const X of [2.2, 2.45]) { const a = q(X, 0.45, ZW - 0.42), b = q(X, 0.08, ZW - 0.42); k += `<rect x="${a[0]}" y="${a[1]}" width=".4" height="${r(b[1] - a[1])}" fill="#2f251c"/>`; }
  /* Fernseher auf Standfuß */
  const t0 = q(1.98, 1.22, ZW - 0.25), t1 = q(2.67, 0.6, ZW - 0.25), f = q(2.32, 0.45, ZW - 0.25);
  k += `<rect x="${r(f[0] - 4)}" y="${r(f[1] - 1)}" width="8" height="1" fill="#1c1c1e"/><rect x="${r(f[0] - 0.8)}" y="${r(t1[1])}" width="1.6" height="${r(f[1] - t1[1])}" fill="#2a2a2d"/>`;
  k += `<rect x="${t0[0]}" y="${t0[1]}" width="${r(t1[0] - t0[0])}" height="${r(t1[1] - t0[1])}" rx=".6" fill="#111214"/>`;
  k += `<rect x="${r(t0[0] + 0.8)}" y="${r(t0[1] + 0.8)}" width="${r(t1[0] - t0[0] - 1.6)}" height="${r(t1[1] - t0[1] - 1.6)}" fill="${S.lg("tv", [[0, "#1f2b38"], [1, "#0d1218"]], 0, 0, 1, 1)}"/>`;
  k += `<path d="M${r(t0[0] + 0.8)} ${r(t0[1] + 0.8)} L${r(t0[0] + 9)} ${r(t0[1] + 0.8)} L${r(t0[0] + 0.8)} ${r(t1[1] - 4)} Z" fill="#fff" opacity=".07"/>`;
  /* Fernbedienung */
  { const p = q(2.55, 0.45, ZW - 0.3); k += `<rect x="${r(p[0] - 2)}" y="${r(p[1] - 0.8)}" width="4" height=".9" rx=".4" fill="#222"/>`; }
  S.teil({ id: "fernsehen", de: "fernsehen", syl: "FERN-se-hen", it: "guardare la TV", itSyl: "guar-DA-re la ti-VÙ", en: "to watch TV", x: ox, y: oy, steht: true, kunst: k,
    tipp: "Nach den Hausaufgaben darf das Kind eine halbe Stunde fernsehen." });
}

/* =====================================================================
   14 — DIE LAMPE über dem Esstisch
   ===================================================================== */
const TISCH = { X0: -2.25, X1: -0.85, Z0: 4.5, Z1: 5.3, Y: 0.75 };
{
  const Zm = (TISCH.Z0 + TISCH.Z1) / 2, Xm = (TISCH.X0 + TISCH.X1) / 2, [x, y] = P(Xm, 1.75, Zm), [, yd] = P(0, HR, Zm);
  let k = `<line x1="0" y1="${r(yd - y)}" x2="0" y2="-7" stroke="#3a3a3a" stroke-width=".5"/>`;
  k += `<path d="M-9 0 Q-8 -7 0 -7.4 Q8 -7 9 0 Z" fill="${S.lg("lampe", [[0, "#e7c15a"], [1, "#c99a2e"]])}"/><ellipse cx="0" cy="0" rx="9" ry="1.6" fill="#fff6d2"/>`;
  k += `<path d="M-9 .5 L-24 40 L24 40 L9 .5 Z" fill="${S.lg("kegel", [[0, "#fff4cf", 0.12], [1, "#fff4cf", 0]])}" pointer-events="none"/>`;
  S.teil({ id: "lampe", de: "die Lampe", syl: "LAM-pe", it: "la lampada", itSyl: "LAM-pa-da", en: "lamp", x, y, kunst: k + flaeche(-9.5, -8, 19, 10) });
}

/* =====================================================================
   15 — DER ESSTISCH (zu Abend essen) mit 16 — STUHL, 17 — FRÜHSTÜCK,
   18 — HAUSAUFGABEN
   ===================================================================== */
{
  /* hinterer Stuhl (zur Küche hin) */
  const ox = P(-1.55, 0, TISCH.Z1 + 0.25)[0], oy = boden(TISCH.Z1 + 0.25);
  let k = quader(-1.78, -1.32, 0.45, 0.49, TISCH.Z1 + 0.05, TISCH.Z1 + 0.45, { vorne: HOLZ_D, oben: HOLZ, seite: HOLZ_D }, ox, oy);
  k += quader(-1.78, -1.32, 0.49, 0.95, TISCH.Z1 + 0.42, TISCH.Z1 + 0.46, { vorne: HOLZ, seite: HOLZ_D }, ox, oy);
  S.hinten(`<g transform="translate(${ox} ${oy})">${k}</g>`);
}
{
  const ox = P((TISCH.X0 + TISCH.X1) / 2, 0, TISCH.Z0)[0], oy = boden(TISCH.Z0);
  const q = (X, Y, Z) => { const [x, y] = P(X, Y, Z); return [r(x - ox), r(y - oy)]; };
  let k = schatten(0, 0.5, 40, 2.4, 0.3);
  /* Beine */
  for (const [X, Z] of [[TISCH.X0 + 0.06, TISCH.Z1 - 0.06], [TISCH.X1 - 0.06, TISCH.Z1 - 0.06], [TISCH.X0 + 0.06, TISCH.Z0 + 0.06], [TISCH.X1 - 0.06, TISCH.Z0 + 0.06]]) k += quader(X - 0.03, X + 0.03, 0, TISCH.Y - 0.04, Z - 0.03, Z + 0.03, { vorne: HOLZ_D, seite: "#7a5430" }, ox, oy);
  /* Platte mit Tischdecke-Läufer */
  k += quader(TISCH.X0, TISCH.X1, TISCH.Y - 0.04, TISCH.Y, TISCH.Z0, TISCH.Z1, { vorne: "#a77a4b", oben: S.lg("platte", [[0, "#e0b884"], [1, "#d1a571"]]), seite: "#8a6038" }, ox, oy);
  k += poly([q(-1.75, TISCH.Y + 0.001, TISCH.Z0), q(-1.35, TISCH.Y + 0.001, TISCH.Z0), q(-1.35, TISCH.Y + 0.001, TISCH.Z1), q(-1.75, TISCH.Y + 0.001, TISCH.Z1)], "#e9eef2");
  S.teil({ id: "abendessen", de: "zu Abend essen", syl: "zu A-bend ES-sen", it: "cenare", itSyl: "ce-NA-re", en: "to have dinner", x: ox, y: oy, steht: true, kunst: k,
    tipp: "Abends isst die Familie zusammen am Esstisch: Abendbrot mit Brot, Käse und Tee." });
}
{
  /* Stuhl am linken Tischende, seitlich: Lehne links */
  const Z = 4.9, ox = P(-2.5, 0, Z)[0], oy = boden(Z);
  let k = schatten(0, 0.4, 8, 1.2, 0.25);
  for (const [X, ZZ] of [[-2.68, Z + 0.2], [-2.32, Z + 0.2], [-2.68, Z - 0.2], [-2.32, Z - 0.2]]) k += quader(X - 0.02, X + 0.02, 0, 0.45, ZZ - 0.02, ZZ + 0.02, { vorne: HOLZ_D, seite: "#7a5430" }, ox, oy);
  k += quader(-2.71, -2.67, 0.45, 0.98, Z - 0.21, Z + 0.21, { vorne: HOLZ, seite: HOLZ_D }, ox, oy);
  k += quader(-2.71, -2.29, 0.45, 0.49, Z - 0.22, Z + 0.22, { vorne: HOLZ_D, oben: S.lg("sitz", [[0, "#c43d3d"], [1, "#a83232"]]), seite: "#7a5430" }, ox, oy);
  for (const Y of [0.7, 0.86]) k += quader(-2.715, -2.665, Y, Y + 0.06, Z - 0.2, Z + 0.2, { vorne: HOLZ_D, seite: HOLZ_D }, ox, oy);
  S.teil({ id: "stuhl", de: "der Stuhl", syl: "STUHL", it: "la sedia", itSyl: "SE-dia", en: "chair", x: ox, y: oy, steht: true, kunst: k });
}
{
  /* DAS FRÜHSTÜCK: Brötchenkorb, Müslischale mit Löffel, Kakaobecher, Marmelade */
  const [x, y] = P(-1.62, TISCH.Y, 4.75);
  let k = "";
  k += `<path d="M-14 0 L-6 0 L-5 -3 L-15 -3 Z" fill="#c89a5a"/><ellipse cx="-12.4" cy="-3.6" rx="2.2" ry="1.4" fill="#e3b064"/><ellipse cx="-8.6" cy="-3.8" rx="2.2" ry="1.4" fill="#d9a050"/><ellipse cx="-10.4" cy="-4.8" rx="2" ry="1.3" fill="#e9bb72"/>`;
  k += `<path d="M-3.4 -2.6 Q-3.4 0 0 0 Q3.4 0 3.4 -2.6 Z" fill="#fff" stroke="#d9d9d4" stroke-width=".25"/><ellipse cx="0" cy="-2.6" rx="3.4" ry=".9" fill="#f2e3c4"/>`;
  for (let i = 0; i < 7; i++) k += `<circle cx="${r(-2.4 + i * 0.8)}" cy="${r(-2.6 + (i % 2) * 0.3)}" r=".35" fill="${i % 3 ? "#c98b3c" : "#b8433c"}"/>`;
  k += `<path d="M1.6 -2.8 L4.6 -6.4" stroke="#c9cdd0" stroke-width=".6"/>`;
  k += `<rect x="5.6" y="-4.6" width="3.6" height="4.6" rx=".6" fill="#3d7cc4"/><path d="M9.2 -3.8 q1.6 0 1.6 1.4 q0 1.2 -1.6 1.2" stroke="#3d7cc4" stroke-width=".6" fill="none"/><ellipse cx="7.4" cy="-4.6" rx="1.8" ry=".45" fill="#7a4a2a"/>`;
  k += `<rect x="11.6" y="-3.4" width="2.8" height="3.4" rx=".4" fill="#b8213a" opacity=".9"/><rect x="11.4" y="-4.2" width="3.2" height="1" fill="#e6e1d0"/>`;
  S.teil({ oben: true, id: "fruehstuecken", de: "frühstücken", syl: "FRÜH-stü-cken", it: "colazione", itSyl: "co-la-ZIO-ne", en: "to have breakfast", x, y, kunst: k + flaeche(-15.5, -7, 30.5, 7.4),
    tipp: "Zum Frühstück gibt es Brötchen, Müsli und Kakao." });
}
{
  /* DIE HAUSAUFGABEN: aufgeschlagenes Heft, Mäppchen, Bleistift am rechten Tischende */
  const [x, y] = P(-1.06, TISCH.Y, 4.85);
  let k = `<path d="M-6 0 L0 -.6 L0 -2.4 L-5.4 -1.8 Z" fill="#fbfbf8" stroke="#c9c9c2" stroke-width=".2"/><path d="M0 -.6 L6 0 L5.4 -1.8 L0 -2.4 Z" fill="#f4f4ef" stroke="#c9c9c2" stroke-width=".2"/>`;
  for (let i = 0; i < 3; i++) k += `<path d="M${-4.8 + i * 0.3} ${r(-0.7 - i * 0.45)} L${-1 + i * 0.1} ${r(-1 - i * 0.45)}" stroke="#7aa6d6" stroke-width=".2"/><path d="M${1 + i * 0.1} ${r(-1 - i * 0.45)} L${4.8 - i * 0.3} ${r(-0.7 - i * 0.45)}" stroke="#7aa6d6" stroke-width=".2"/>`;
  k += `<text x="-3" y="-1" font-size=".9" fill="#333" font-family="'Comic Sans MS',cursive" transform="skewX(-30)">3+4=7</text>`;
  k += `<rect x="6.6" y="-1.6" width="5.4" height="1.6" rx=".8" fill="#e67e22"/><rect x="8.4" y="-1.7" width="1.6" height=".4" fill="#c9cdd0"/>`;
  k += `<path d="M-2 .6 L4 -.2" stroke="#f2c94c" stroke-width=".7"/><path d="M4 -.2 l.8 -.1" stroke="#333" stroke-width=".7"/>`;
  S.teil({ oben: true, id: "hausaufgaben", de: "die Hausaufgaben", syl: "HAUS-auf-ga-ben", it: "i compiti", itSyl: "COM-pi-ti", en: "homework", x, y, kunst: k + flaeche(-6.5, -4, 19, 5),
    tipp: "Nach dem Mittagessen macht das Kind die Hausaufgaben am Küchentisch." });
}

/* =====================================================================
   19 — DER SPIELTEPPICH (spielen) und 20 — DIE SPIELZEUGKISTE (aufräumen)
   ===================================================================== */
{
  const Z0 = 3.55, Z1 = 4.55, X0 = 0.05, X1 = 1.55;
  const ox = P((X0 + X1) / 2, 0, Z0)[0], oy = boden(Z0);
  const q = (X, Z) => { const [x, y] = P(X, 0.005, Z); return [r(x - ox), r(y - oy)]; };
  let k = poly([q(X0, Z0), q(X1, Z0), q(X1, Z1), q(X0, Z1)], S.lg("teppich", [[0, "#b8d4a0"], [1, "#9cc184"]]), ` stroke="#7fa86a" stroke-width=".6"`);
  /* Straßen auf dem Spielteppich */
  k += `<path d="M${q(X0 + 0.1, (Z0 + Z1) / 2).join(" ")} L${q(X1 - 0.1, (Z0 + Z1) / 2).join(" ")}" stroke="#7d8287" stroke-width="3"/><path d="M${q(X0 + 0.1, (Z0 + Z1) / 2).join(" ")} L${q(X1 - 0.1, (Z0 + Z1) / 2).join(" ")}" stroke="#fff" stroke-width=".4" stroke-dasharray="2 2"/>`;
  k += `<path d="M${q(X0 + 0.9, Z0 + 0.05).join(" ")} L${q(X0 + 0.9, Z1 - 0.05).join(" ")}" stroke="#7d8287" stroke-width="2.4"/>`;
  /* Holzeisenbahn mit Schienen, Bauklötze, Auto */
  const s1 = q(X0 + 0.15, Z0 + 0.22), s2 = q(X0 + 0.7, Z0 + 0.22);
  k += `<path d="M${s1[0]} ${s1[1]} L${s2[0]} ${s2[1]}" stroke="#c99a5a" stroke-width="2.6"/><path d="M${s1[0]} ${s1[1]} L${s2[0]} ${s2[1]}" stroke="#a87a42" stroke-width=".6" stroke-dasharray="1 1.4"/>`;
  for (let i = 0; i < 3; i++) { const p = q(X0 + 0.22 + i * 0.16, Z0 + 0.22); k += `<rect x="${r(p[0] - 3.4)}" y="${r(p[1] - 5)}" width="6.4" height="4.4" rx=".6" fill="${["#c0392b", "#2d6fb3", "#f2c94c"][i]}"/><circle cx="${r(p[0] - 1.8)}" cy="${r(p[1] - 0.4)}" r="1.1" fill="#333"/><circle cx="${r(p[0] + 1.6)}" cy="${r(p[1] - 0.4)}" r="1.1" fill="#333"/>`; if (i === 0) k += `<rect x="${r(p[0] - 3)}" y="${r(p[1] - 8)}" width="2.6" height="3.2" fill="#2c3e50"/>`; }
  const bk = [[X0 + 1.1, Z0 + 0.25, "#e74c3c"], [X0 + 1.25, Z0 + 0.3, "#3498db"], [X0 + 1.17, Z0 + 0.27, "#f1c40f", 1]];
  for (const [X, Z, f, oben] of bk) { const p = q(X, Z); const yy = oben ? -5 : 0; k += `<rect x="${r(p[0] - 2.6)}" y="${r(p[1] - 5 + yy)}" width="5.2" height="5" fill="${f}"/><path d="M${r(p[0] - 2.6)} ${r(p[1] - 5 + yy)} l1.4 -1.2 h5.2 l-1.4 1.2 Z" fill="#fff" opacity=".35"/>`; }
  { const p = q(X0 + 0.55, Z0 + 0.75); k += `<rect x="${r(p[0] - 3.4)}" y="${r(p[1] - 3.2)}" width="6.8" height="2.4" rx="1" fill="#27ae60"/><rect x="${r(p[0] - 1.8)}" y="${r(p[1] - 4.6)}" width="3.4" height="1.6" rx=".6" fill="#a9d6f5"/><circle cx="${r(p[0] - 2)}" cy="${r(p[1] - 0.8)}" r=".9" fill="#222"/><circle cx="${r(p[0] + 2)}" cy="${r(p[1] - 0.8)}" r=".9" fill="#222"/>`; }
  S.teil({ id: "spielen", de: "spielen", syl: "SPIE-len", it: "giocare", itSyl: "gio-CA-re", en: "to play", x: ox, y: oy, kunst: k,
    tipp: "Auf dem Spielteppich spielt das Kind mit der Eisenbahn und den Bauklötzen." });
}
{
  const Z = 4.15, ox = P(2.05, 0, Z)[0], oy = boden(Z);
  let k = schatten(0, 0.4, 14, 1.6, 0.3);
  /* Teddy und Ball schauen heraus (hinter der Vorderwand) */
  { const [x, y] = P(1.88, 0.42, Z + 0.25); k += `<circle cx="${r(x - ox)}" cy="${r(y - oy - 3)}" r="3.6" fill="#a8774a"/><circle cx="${r(x - ox - 2.6)}" cy="${r(y - oy - 6)}" r="1.3" fill="#a8774a"/><circle cx="${r(x - ox + 2.6)}" cy="${r(y - oy - 6)}" r="1.3" fill="#a8774a"/><circle cx="${r(x - ox - 1.2)}" cy="${r(y - oy - 3.6)}" r=".5" fill="#222"/><circle cx="${r(x - ox + 1.2)}" cy="${r(y - oy - 3.6)}" r=".5" fill="#222"/>`;
    const [x2, y2] = P(2.22, 0.42, Z + 0.2); k += `<circle cx="${r(x2 - ox)}" cy="${r(y2 - oy - 2)}" r="3.4" fill="#e74c3c"/><path d="M${r(x2 - ox - 3.4)} ${r(y2 - oy - 2)} q3.4 -2 6.8 0" stroke="#fff" stroke-width=".8" fill="none"/>`; }
  k += quader(1.7, 2.4, 0, 0.42, Z, Z + 0.45, { vorne: S.lg("kiste", [[0, "#f3c34a"], [1, "#e0a92a"]]), oben: "#7a5a24", seite: "#c99320" }, ox, oy);
  { const [a, b] = P(1.76, 0.36, Z), [c, d] = P(2.34, 0.06, Z); k += `<rect x="${r(a - ox)}" y="${r(b - oy)}" width="${r(c - a)}" height="${r(d - b)}" fill="none" stroke="#c99320" stroke-width=".6"/><text x="${r((a + c) / 2 - ox)}" y="${r((b + d) / 2 - oy + 1.6)}" font-size="3.8" text-anchor="middle" fill="#fff" font-family="Arial Rounded MT Bold,Arial" font-weight="bold">SPIELZEUG</text>`; }
  /* ein Bauklotz liegt noch daneben */
  { const [x, y] = P(1.55, 0, Z - 0.1); k += `<rect x="${r(x - ox - 2.4)}" y="${r(y - oy - 4.4)}" width="4.8" height="4.4" fill="#3498db"/><path d="M${r(x - ox - 2.4)} ${r(y - oy - 4.4)} l1.2 -1 h4.8 l-1.2 1 Z" fill="#fff" opacity=".35"/>`; }
  S.teil({ id: "aufraeumen", de: "aufräumen", syl: "AUF-räu-men", it: "mettere in ordine", itSyl: "MET-te-re in OR-di-ne", en: "to tidy up", x: ox, y: oy, steht: true, kunst: k,
    tipp: "Vor dem Abendessen wird aufgeräumt: Das Spielzeug kommt in die Kiste." });
}

{
  /* DER RAUCHMELDER an der Decke */
  const [x, y] = P(0.55, HR, 4.6);
  let k = `<ellipse cx="0" cy="0" rx="5" ry="1.4" fill="#e6e3dc"/><path d="M-4.4 0 L-4 2.2 Q0 3.4 4 2.2 L4.4 0 Z" fill="${WEISS}"/><ellipse cx="0" cy="2.4" rx="4" ry=".9" fill="#f6f6f3"/><circle cx="1.6" cy="2.4" r=".5" fill="#d23b30"/>`;
  for (let i = 0; i < 6; i++) k += `<rect x="${r(-3.4 + i * 1.1)}" y="1" width=".5" height="1" fill="#c9c6bd"/>`;
  S.teil({ id: "rauchmelder", de: "der Rauchmelder", syl: "RAUCH-mel-der", it: "il rilevatore di fumo", itSyl: "ri-le-va-TO-re di FU-mo", en: "smoke alarm", x, y, kunst: k,
    tipp: "In Deutschland braucht jede Wohnung Rauchmelder – in Schlafzimmern, Kinderzimmern und im Flur." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/tagesablauf.js"));
console.log(aus);
