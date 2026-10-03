#!/usr/bin/env node
/* =====================================================================
   FREIBURG IM BREISGAU (FASSUNG 854) — Bilderwelt neu: eine echte Stadtansicht
   ---------------------------------------------------------------------
   RECHERCHE (Münsterbauverein / Uni Freiburg „Das Münster“, Structurae
   „Freiburger Münster“ und „Historisches Kaufhaus“, Stadt Freiburg
   „Historisches Kaufhaus“, Münstermarkt Freiburg (FWTM), Schwarzwald-
   Tourismus „Münstermarkt“, visit.freiburg.de „Lange Rote“):
   - STANDORT: der Münsterplatz, Südostteil (bei der Einmündung der
     Schusterstraße), Blick nach Westen über den Markt. Links (Süden)
     die Häuserzeile der Südseite mit dem HISTORISCHEN KAUFHAUS, rechts
     (Norden) das MÜNSTER: vorn der Chor mit den Hahnentürmen, dahinter
     Querhaus und Langhaus, ganz hinten im Westen der Turm. So steht der
     Turm frei über den Dächern; das Kaufhaus sieht man schräg von Osten.
     Die Schwarzwaldhöhen (Schlossberg, Roßkopf) liegen hier im Rücken
     (Osten) — der Schwarzwald steckt darum in den Dingen des Markts.
   - MÜNSTERTURM: 116 m, roter Sandstein, 1330 fertig, „der schönste Turm
     der Christenheit“ (Jacob Burckhardt). Unten ein Vierkant mit
     Strebepfeilern, Glockenstube und Uhr (Zifferblätter nach Osten und
     Norden), darüber die STERNGALERIE (Zwölfeck als Übergang), dann das
     ACHTECK (≈ 33 m, hohe Maßwerkfenster, Wimperge, Fialen), darüber der
     ganz DURCHBROCHENE MASSWERKHELM — in Freiburg erfunden —, oben die
     Kreuzblume. Aussichtsplattform bei ≈ 70 m.
   - HISTORISCHES KAUFHAUS (1520–32, Lienhart Müller): Südseite des
     Platzes, leuchtend rote Fassade, unten ein Laubengang mit Bögen,
     darüber der Balkon und zwischen den Fenstern vier Habsburger
     (Maximilian I., Philipp der Schöne, Karl V., Ferdinand I., Hans Sixt
     von Staufen 1530/31), an den Ecken zwei Erker mit Wappen und Türmchen
     aus bunt glasierten Ziegeln; Dach 1880/84 mit Gauben „wie in Beaune“.
   - MÜNSTERMARKT (Mo–Sa): Nordseite Bauern der Region, Südseite Händler
     (Keramik, Bürsten, Holzwaren …). Die „LANGE ROTE“: 35 cm lange rote
     Bratwurst im Brötchen, mit oder ohne Zwiebeln, Senf.
   - BÄCHLE: offene Wasserrinnen am Rand der Straßen und des Platzes.
     KIESELMOSAIKE aus Rheinkieseln im Pflaster. Typisch für den
     Schwarzwald: Kuckucksuhr, Bollenhut (rote Bollen = unverheiratet),
     Schwarzwälder Kirschtorte; Freiburg: Fahrradstadt und Solarstadt.
   Jahreszeit: Juni, Vormittag (Kirschen, Spargel), Sonne von links hinten.
   Maßstab: echte Kamera (Augenhöhe 1,6 m, y = 190 ist der Horizont; Bild 320 × 240,
   damit der 116 m hohe Turm ganz hineinpasst).
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "freiburg", titel: "Freiburg im Breisgau", emoji: "🌲", thema: "Deutschland", kuerzel: "fbg", fassung: 854, breite: 320, hoehe: 240 });
const rnd = zufall(1120);
const r = B.r;

/* ---------- Kamera (Meter: x Ost, y Nord, z Höhe) ---------- */
const HOR = 190, FOC = 150, CAM = [66, -46, 1.6], BLICK = 196 * Math.PI / 180;
const FV = [Math.cos(BLICK), Math.sin(BLICK)], RV = [Math.sin(BLICK), -Math.cos(BLICK)];
const tief = (x, y) => (x - CAM[0]) * FV[0] + (y - CAM[1]) * FV[1];
const pr = (x, y, z) => { const dx = x - CAM[0], dy = y - CAM[1], f = dx * FV[0] + dy * FV[1], l = dx * RV[0] + dy * RV[1]; return [160 + FOC * l / f, HOR - FOC * (z - CAM[2]) / f]; };
const P = (p) => `${r(p[0])} ${r(p[1])}`;
/* Polygone werden an der Nahebene (1 m vor der Kamera) und am Bildrand beschnitten:
   nichts ragt aus dem Bild, die Trefferflächen bleiben im Bild */
const NAH = 1, RAHMEN = [-1, -1, 321, 241];
const tiefe3 = (p) => (p[0] - CAM[0]) * FV[0] + (p[1] - CAM[1]) * FV[1];
const nahClip = (pts, offen) => {
  const raus = [];
  const n = pts.length, m = offen ? n - 1 : n;
  for (let i = 0; i < m; i++) {
    const a = pts[i], b = pts[(i + 1) % n], fa = tiefe3(a) - NAH, fb = tiefe3(b) - NAH;
    if (fa >= 0) { if (!offen || i === 0 || raus.length === 0) raus.push(a); }
    if ((fa >= 0) !== (fb >= 0)) { const t = fa / (fa - fb); raus.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]); }
    if (offen && fb >= 0) raus.push(b);
  }
  return raus;
};
const randClip = (pts) => {
  let out = pts;
  const kanten = [[(p) => p[0] >= RAHMEN[0], (a, b) => (RAHMEN[0] - a[0]) / (b[0] - a[0])], [(p) => p[0] <= RAHMEN[2], (a, b) => (RAHMEN[2] - a[0]) / (b[0] - a[0])],
    [(p) => p[1] >= RAHMEN[1], (a, b) => (RAHMEN[1] - a[1]) / (b[1] - a[1])], [(p) => p[1] <= RAHMEN[3], (a, b) => (RAHMEN[3] - a[1]) / (b[1] - a[1])]];
  for (const [innen, t] of kanten) {
    const inp = out; out = [];
    for (let i = 0; i < inp.length; i++) {
      const a = inp[i], b = inp[(i + 1) % inp.length];
      if (innen(a)) { out.push(a); if (!innen(b)) { const k = t(a, b); out.push([a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]); } }
      else if (innen(b)) { const k = t(a, b); out.push([a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]); }
    }
    if (!out.length) break;
  }
  return out;
};
const poly = (pts) => {
  const q = randClip(nahClip(pts, false).map((p) => pr(p[0], p[1], p[2])));
  return q.length > 2 ? "M" + q.map(P).join(" L") + " Z" : "M0 0";
};
const linie = (pts) => {
  const q = nahClip(pts, true).map((p) => pr(p[0], p[1], p[2])).filter((p) => p[0] > -3 && p[0] < 323 && p[1] > -3 && p[1] < 243);
  return q.length > 1 ? "M" + q.map(P).join(" L") : "M0 0";
};
/* Menschen klein im Bild: Pfaddaten auf ganze Zentimeter runden (unsichtbar, halbiert die Datei) */
const rundeFigur = (svg) => svg.replace(/ d="([^"]*)"/g, (m, d) => ` d="${d.replace(/-?\d+\.\d+/g, (n) => String(Math.round(+n)))}"`);
/* Maßstab (Einheiten je Meter) und Fußpunkt eines Dings am Boden */
const fuss = (x, y) => { const p = pr(x, y, 0); return { x: p[0], y: p[1], s: FOC / tief(x, y) }; };

S.def(`<filter color-interpolation-filters="sRGB" id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter color-interpolation-filters="sRGB" id="${S.id("wolke")}" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="2.4"/></filter>`);
/* roter Buntsandstein des Münsters — Sonne von links hinten (Süden) */
const SAND = S.lg("sand", [[0, "#c27a62"], [0.5, "#b4644d"], [1, "#9c5240"]], 0, 0, 1, 0);
const SAND_L = S.lg("sandl", [[0, "#d9937a"], [1, "#c27a62"]], 0, 0, 1, 0);
const SAND_D = S.lg("sandd", [[0, "#8a4636"], [1, "#6e3529"]], 0, 0, 1, 0);
const KR = "#a3301f";                                 // Kaufhausrot
const STEIN = "#d8b4a0";                              // Gewände am Kaufhaus
const DACHZ = "#5a4a44";
const LOCH = "#2e1f1c";
const KYS = -80;                                      // Fassadenebene der Südseite (Kaufhaus)

/* =====================================================================
   KULISSE — Himmel, ferne Dächer am Westende des Platzes
   ===================================================================== */
S.hinten(`<rect width="320" height="${HOR + 6}" fill="${S.lg("himmel", [[0, "#4f86c6"], [0.55, "#9cc0e2"], [1, "#e4ecee"]])}"/>`);
{
  let w = "";
  for (const [x, y, s] of [[60, 20, 1.1], [150, 36, 0.8], [196, 12, 0.9], [118, 70, 0.6], [178, 128, 1.3], [118, 146, 0.9], [226, 150, 0.8]]) {
    w += `<g filter="url(#${S.id("wolke")})" opacity=".92">`;
    for (const [dx, dy, rx, ry] of [[0, 0, 17, 4.6], [-11, 1.5, 10, 3.4], [11, 1, 12, 3.8], [-3, -3.4, 9, 4.4], [5, -2.8, 7, 3.8]])
      w += `<ellipse cx="${r(x + dx * s)}" cy="${r(y + dy * s)}" rx="${r(rx * s)}" ry="${r(ry * s)}" fill="#fff"/>`;
    w += `<ellipse cx="${x}" cy="${r(y + 3 * s)}" rx="${r(17 * s)}" ry="${r(2.2 * s)}" fill="#dfe5ec"/></g>`;
  }
  /* Mauersegler über dem Platz */
  for (const [x, y, g] of [[150, 64, 1], [158, 70, .8], [166, 61, .9], [205, 88, .7], [140, 92, .6], [176, 76, .75]]) w += `<path d="M${x - 2.4 * g} ${y} q${r(1.2 * g)} ${r(-.9 * g)} ${r(2.4 * g)} 0 q${r(1.2 * g)} ${r(-.9 * g)} ${r(2.4 * g)} 0 q${r(-1.2 * g)} ${r(-.2 * g)} ${r(-2.4 * g)} ${r(.5 * g)} q${r(-1.2 * g)} ${r(-.7 * g)} ${r(-2.4 * g)} ${r(-.5 * g)} Z" fill="#2a2e36" opacity=".8"/>`;
  S.hinten(w);
}

/* ---------- Bauteile einer Fassade (Ebene y = Y, Breite entlang x) ---------- */
const fq = (Y, x0, z0, x1, z1) => poly([[x0, Y, z0], [x1, Y, z0], [x1, Y, z1], [x0, Y, z1]]);
/* Bogen (Spitzbogen = gleichseitig, Rundbogen = Halbkreis), Kämpfer z0, Scheitel zk */
const fbogen = (Y, xm, w, z0, zk, spitz, n = 8) => {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    let x, z;
    if (spitz) {
      /* jede Hälfte ein Kreisbogen mit Radius w (gleichseitiger Spitzbogen), Höhe auf zk gestreckt */
      const a = (Math.PI / 3) * (t < 0.5 ? 2 * t : 2 * (1 - t));
      x = t < 0.5 ? xm + w / 2 - w * Math.cos(a) : xm - w / 2 + w * Math.cos(a);
      z = z0 + w * Math.sin(a) * (zk - z0) / (0.866 * w);
    } else { const a = Math.PI * (1 - t); x = xm + Math.cos(a) * w / 2; z = z0 + Math.sin(a) * (zk - z0); }
    pts.push([x, Y, z]);
  }
  return pts;
};
/* Bodenbogen-Öffnung: von z=0 senkrecht bis zum Kämpfer, dann der Bogen */
const toroeffnung = (Y, xm, w, zKampf, zScheitel, spitz) => [[xm - w / 2, Y, 0], ...fbogen(Y, xm, w, zKampf, zScheitel, spitz, 10), [xm + w / 2, Y, 0]];

/* =====================================================================
   1 — DER MÜNSTERPLATZ (Kieselpflaster, Schatten, Häuser am Rand)
   ===================================================================== */
{
  /* Kieselpflaster aus Rheinkieseln: drei Muster, vorn grob, hinten fein */
  const kiesel = (n, w, h, rx, ry) => {
    let m = "";
    for (let i = 0; i < n; i++) {
      const x = rnd() * w, y = rnd() * h, f = ["#b9ab97", "#a39582", "#cfc2ae", "#8f8270", "#c4b49c", "#9c8f80"][Math.floor(rnd() * 6)];
      for (const dx of [0, w, -w]) { if (dx && (x + dx < -rx || x + dx > w + rx)) continue; m += `<ellipse cx="${r(x + dx)}" cy="${r(y)}" rx="${r(rx * (0.7 + rnd() * 0.6))}" ry="${r(ry * (0.7 + rnd() * 0.6))}" fill="${f}"/>`; }
    }
    return m;
  };
  S.def(`<pattern id="${S.id("kies1")}" width="3.4" height="1.1" patternUnits="userSpaceOnUse"><rect width="3.4" height="1.1" fill="#8a7d6c"/>${kiesel(9, 3.4, 1.1, .3, .12)}</pattern>`);
  S.def(`<pattern id="${S.id("kies2")}" width="7.4" height="2.6" patternUnits="userSpaceOnUse"><rect width="7.4" height="2.6" fill="#857866"/>${kiesel(12, 7.4, 2.6, .62, .28)}</pattern>`);
  S.def(`<pattern id="${S.id("kies3")}" width="14.6" height="5.6" patternUnits="userSpaceOnUse"><rect width="14.6" height="5.6" fill="#7f7261"/>${kiesel(14, 14.6, 5.6, 1.25, .55)}</pattern>`);
  S.def(`<linearGradient id="${S.id("m2g")}" gradientUnits="userSpaceOnUse" x1="0" y1="194" x2="0" y2="204"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient><mask id="${S.id("m2")}"><rect width="320" height="240" fill="url(#${S.id("m2g")})"/></mask>`);
  S.def(`<linearGradient id="${S.id("m3g")}" gradientUnits="userSpaceOnUse" x1="0" y1="206" x2="0" y2="220"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient><mask id="${S.id("m3")}"><rect width="320" height="240" fill="url(#${S.id("m3g")})"/></mask>`);
  const boden = `M0 ${HOR - 4} H320 V240 H0 Z`;
  let k = `<path d="${boden}" fill="url(#${S.id("kies1")})"/><path d="${boden}" fill="url(#${S.id("kies2")})" mask="url(#${S.id("m2")})"/><path d="${boden}" fill="url(#${S.id("kies3")})" mask="url(#${S.id("m3")})"/>`;
  k += `<path d="${boden}" fill="${S.lg("bodenluft", [[0, "#e8e2d6", 0.55], [0.12, "#e8e2d6", 0.15], [0.5, "#fff3d8", 0], [1, "#3a2a1a", 0.12]])}"/>`;
  /* Schatten der Südzeile (Mittagssonne aus Süden) */
  k += `<path d="${poly([[-96, KYS, 0], [70, KYS, 0], [70, KYS + 11, 0], [-96, KYS + 11, 0]])}" fill="#2a2018" opacity=".2"/>`;
  /* Westende des Platzes: Häuser quer zum Blick */
  for (const [y0, y1, h, f, giebel] of [[-78, -66, 14, "#e8d7b0", 0], [-66, -56, 12, "#d9c4a8", 1], [-56, -44, 15, "#efe4cc", 0], [-44, -32, 13, "#e2c9a0", 0], [-32, -20, 15, "#d8cdbd", 1]]) {
    k += `<path d="${poly([[-96, y0, 0], [-96, y1, 0], [-96, y1, h], [-96, y0, h]])}" fill="${f}"/>`;
    if (giebel) k += `<path d="${poly([[-96, y0, h], [-96, y1, h], [-96, (y0 + y1) / 2, h + 7]])}" fill="${f}"/><path d="${poly([[-96, y0, h], [-96, (y0 + y1) / 2, h + 7], [-96, y1, h]])}" fill="none" stroke="#8a5c4c" stroke-width=".5"/><path d="${poly([[-96, (y0 + y1) / 2 - .6, h + 2], [-96, (y0 + y1) / 2 + .6, h + 2], [-96, (y0 + y1) / 2 + .6, h + 3.6], [-96, (y0 + y1) / 2 - .6, h + 3.6]])}" fill="#4a4a50"/>`;
    else k += `<path d="${poly([[-96, y0, h], [-96, y1, h], [-101, y1, h + 6], [-101, y0, h + 6]])}" fill="#8a5c4c"/><path d="${poly([[-98, (y0 + y1) / 2 - .8, h + 2.6], [-98, (y0 + y1) / 2 + .8, h + 2.6], [-98, (y0 + y1) / 2 + .8, h + 4.2], [-98, (y0 + y1) / 2 - .8, h + 4.2]])}" fill="#ece4d4"/>`;
    k += `<path d="${poly([[-96, y0, 3.6], [-96, y1, 3.6], [-96, y1, 4], [-96, y0, 4]])}" fill="#fff" opacity=".35"/>`;
    for (let i = 0; i < 3; i++) for (let e = 0; e < 3; e++) { const y = y0 + (i + .5) * (y1 - y0) / 3 - .6, z = (e ? 4.6 + (e - 1) * 4 : .4), hh = e ? 2.2 : 3; k += `<path d="${poly([[-96, y, z], [-96, y + 1.2, z], [-96, y + 1.2, z + hh], [-96, y, z + hh]])}" fill="${e ? "#4a4a50" : "#6a5040"}"/>`; }
  }
  /* Südzeile westlich des Kaufhauses (Alte Wache, Palais) und der Nachbar im Osten */
  const haus = (x0, x1, h, dach, farbe, stock = 3) => {
    let g = `<path d="${poly([[x0, KYS, 0], [x1, KYS, 0], [x1, KYS, h], [x0, KYS, h]])}" fill="${farbe}"/>`;
    g += `<path d="${poly([[x0, KYS, 0], [x1, KYS, 0], [x1, KYS, h], [x0, KYS, h]])}" fill="${S.lg("hausschatten", [[0, "#2a2018", 0.16], [1, "#2a2018", 0.04]])}"/>`;
    g += `<path d="${poly([[x0, KYS, h], [x1, KYS, h], [x1 - 1, KYS - 6, h + dach], [x0 + 1, KYS - 6, h + dach]])}" fill="${S.lg("dach_h", [[0, "#6b4a3e"], [1, "#8a6050"]])}"/>`;
    const n = Math.max(2, Math.round((x1 - x0) / 3.6));
    for (let e = 0; e < stock; e++) for (let i = 0; i < n; i++) {
      const xm = x0 + (i + 0.5) * (x1 - x0) / n, z0 = 1.6 + e * (h - 1.6) / stock;
      g += `<path d="${poly([[xm - .6, KYS, z0 + .5], [xm + .6, KYS, z0 + .5], [xm + .6, KYS, z0 + 2.5], [xm - .6, KYS, z0 + 2.5]])}" fill="#4a4a50"/>`;
    }
    return g;
  };
  k += haus(-96, -66, 13, 6, "#e3b65e") + haus(-66, -40, 14, 7, "#e9dfc8") + haus(-40, -14, 15, 7, "#efd27a") + haus(-14, 8, 14, 7, "#ead2b4");
  S.teil({ id: "muensterplatz", de: "der Münsterplatz", syl: "MÜNS-ter-platz", it: "la piazza del Duomo", itSyl: "PIAZ-za del DUO-mo", en: "Cathedral Square", x: 0, y: 0, kunst: k,
    tipp: "Der Platz ist mit runden Kieseln aus dem Rhein gepflastert. Montags bis samstags ist hier Markt." });
}

/* =====================================================================
   2 — DIE BÄCHLE (Wasserrinne im Pflaster, läuft vorn links nach hinten)
   ===================================================================== */
{
  const YB = -50.5, xa = 62.5, xb = -6;
  const band = (y0, y1, z = 0) => poly([[xa, y0, z], [xb, y0, z], [xb, y1, z], [xa, y1, z]]);
  let k = `<path d="${band(YB - .42, YB + .42)}" fill="#c9c5bc"/>`;
  k += `<path d="${band(YB - .26, YB + .26, -.02)}" fill="${S.lg("baechle", [[0, "#5d7f8c"], [0.5, "#8fb3bf"], [1, "#4a6b78"]])}"/>`;
  /* Lichtreflexe auf dem fließenden Wasser */
  for (let i = 0; i < 26; i++) { const x = xb + 2 + (xa - xb - 2.5) * Math.pow(rnd(), 0.5), p = pr(x, YB + (rnd() - .5) * .3, 0), s = FOC / tief(x, YB); k += `<ellipse cx="${r(p[0])}" cy="${r(p[1])}" rx="${r(.12 * s)}" ry="${r(.025 * s + .05)}" fill="#f2fbff" opacity=".8"/>`; }
  /* Fugen der Granitsteine am Rand */
  for (let x = xa - .6; x > xb; x -= 1.2) { const a = pr(x, YB - .42, 0), b = pr(x, YB - .26, 0), c = pr(x, YB + .26, 0), d = pr(x, YB + .42, 0); k += `<path d="M${P(a)} L${P(b)} M${P(c)} L${P(d)}" stroke="#8f8a80" stroke-width="${r(Math.max(.15, .02 * FOC / tief(x, YB)))}"/>`; }
  S.teil({ id: "baechle", de: "das Bächle", syl: "BÄCH-le", it: "il ruscelletto", itSyl: "ru-scel-LET-to", en: "little stream (Bächle)", x: 0, y: 0, kunst: k,
    tipp: "Wer aus Versehen ins Bächle tritt, heiratet einmal jemanden aus Freiburg — so sagt man." });
}

/* =====================================================================
   3 — DAS KIESELMOSAIK (Freiburger Wappen aus Rheinkieseln im Pflaster)
   ===================================================================== */
{
  const M = [59.8, -47.4], c = pr(M[0], M[1], 0), s = FOC / tief(M[0], M[1]), rx = 0.8 * s, ry = rx * (CAM[2] / tief(M[0], M[1])) * 1.05;
  let g = `<circle r="1" fill="#3e3a36"/><circle r=".9" fill="#ece6da"/>`;
  for (let i = 0; i < 28; i++) { const a = i / 28 * Math.PI * 2; g += `<circle cx="${r(Math.cos(a) * .95 * 100) / 100}" cy="${r(Math.sin(a) * .95 * 100) / 100}" r=".045" fill="${i % 2 ? "#6b6560" : "#c9c0b0"}"/>`; }
  /* Wappenschild mit dem roten Georgskreuz */
  g += `<path d="M-.5 -.62 H.5 V.05 Q.5 .5 0 .7 Q-.5 .5 -.5 .05 Z" fill="#f6f2ea" stroke="#3e3a36" stroke-width=".05"/><path d="M-.11 -.62 H.11 V.68 H-.11 Z M-.5 -.2 H.5 V.02 H-.5 Z" fill="#c0302a"/>`;
  for (let i = 0; i < 40; i++) { const x = (rnd() - .5) * 1.6, y = (rnd() - .5) * 1.6; if (x * x + y * y < .7) g += `<circle cx="${r(x * 100) / 100}" cy="${r(y * 100) / 100}" r=".03" fill="#000" opacity=".12"/>`; }
  const k = `<g transform="translate(${r(c[0])} ${r(c[1])}) scale(${r(rx * 10) / 10} ${r(ry * 100) / 100})">${g}</g>`;
  S.teil({ id: "kieselmosaik", de: "das Kieselmosaik", syl: "KIE-sel-mo-sa-ik", it: "il mosaico di ciottoli", itSyl: "mo-SA-i-co di CIOT-to-li", en: "pebble mosaic", x: 0, y: 0, kunst: k,
    tipp: "Die Mosaike sind aus Kieseln vom Rhein. Dieses zeigt das Freiburger Wappen: ein rotes Kreuz auf Weiß." });
}

/* =====================================================================
   4 — DER MÜNSTERTURM (116 m) — Lupe: Turmhelm, Kreuzblume, Maßwerk
   ===================================================================== */
const TURM = { x: -54, y: 0 };
const T0 = pr(TURM.x, TURM.y, 0), TS = FOC / tief(TURM.x, TURM.y);
const TY = (z) => HOR - TS * (z - CAM[2]);
const TX = (u) => T0[0] + TS * u;
const PT = (pts) => "M" + pts.map(([u, z]) => `${r(TX(u))} ${r(TY(z))}`).join(" L") + " Z";
const RT = (u0, z0, u1, z1, f) => `<path d="${PT([[u0, z0], [u1, z0], [u1, z1], [u0, z1]])}" fill="${f}"/>`;
const TM = {};
{
  const t = [];
  const DUNKEL = "#7d3c30", HELL = "#e4a58a";
  /* Vierkant 0–46 m: Südseite (links, Sonne) und Ostseite; Eckstrebepfeiler mit Absätzen */
  t.push(RT(-8, 0, 0.6, 46, SAND_L), RT(0.6, 0, 8, 46, SAND));
  for (const [u, f] of [[-9, SAND_L], [7, SAND_D]]) t.push(`<path d="${PT([[u, 0], [u + 2, 0], [u + 2, 30], [u + 1.7, 34], [u + 1.7, 42], [u + 1, 46.6], [u + .3, 42], [u + .3, 34], [u, 30]])}" fill="${f}"/>`);
  t.push(`<path d="M${r(TX(.6))} ${r(TY(0))} V${r(TY(46))}" stroke="${HELL}" stroke-width="${r(TS * .35)}"/>`);
  /* Glockenstube: je Seite zwei hohe Schallfenster */
  for (const u of [-5.6, -2.2, 2.6, 5]) t.push(`<path d="${PT([[u - .9, 27.4], [u + .9, 27.4], [u + .9, 34.4], [u, 36.2], [u - .9, 34.4]])}" fill="${LOCH}"/><path d="M${r(TX(u))} ${r(TY(27.4))} V${r(TY(35.4))}" stroke="${u < 0 ? "#d9937a" : "#9c5240"}" stroke-width="${r(TS * .18)}"/>`);
  /* Uhr (Zifferblatt nach Osten: weiß, schwarze Ziffern, Mitte farbig) */
  const uhr = [TX(3.8), TY(41)], ur = TS * 1.6;
  t.push(`<circle cx="${r(uhr[0])}" cy="${r(uhr[1])}" r="${r(ur * 1.14)}" fill="${DUNKEL}"/><circle cx="${r(uhr[0])}" cy="${r(uhr[1])}" r="${r(ur)}" fill="#f4efe2"/><circle cx="${r(uhr[0])}" cy="${r(uhr[1])}" r="${r(ur * .58)}" fill="#2f4f8a"/>`);
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; t.push(`<line x1="${r(uhr[0] + Math.sin(a) * ur * .68)}" y1="${r(uhr[1] - Math.cos(a) * ur * .68)}" x2="${r(uhr[0] + Math.sin(a) * ur * .92)}" y2="${r(uhr[1] - Math.cos(a) * ur * .92)}" stroke="#1d1d1d" stroke-width="${r(ur * .1)}"/>`); }
  t.push(`<path d="M${r(uhr[0])} ${r(uhr[1])} l${r(ur * .38)} ${r(-ur * .22)} M${r(uhr[0])} ${r(uhr[1])} l${r(-ur * .08)} ${r(-ur * .62)}" stroke="#e8c35a" stroke-width="${r(ur * .13)}" stroke-linecap="round"/>`);
  t.push(RT(-9.2, 45.6, 9.2, 46.8, HELL));
  /* Sterngalerie (46–49 m): Zwölfeck-Stern mit Maßwerkbrüstung, Fialen an den Spitzen */
  {
    const zz = 46.8, zh = 49.4;
    const zack = [[-9.6, zh], [-7.8, zh - .9], [-6.2, zh], [-4.3, zh - .9], [-2.5, zh], [0, zh - .9], [2.5, zh], [4.3, zh - .9], [6.2, zh], [7.8, zh - .9], [9.6, zh]];
    t.push(`<path d="${PT([[-9.6, zz], ...zack, [9.6, zz]])}" fill="${SAND}"/>`);
    for (let u = -9.1; u < 9.4; u += 1.05) t.push(`<path d="M${r(TX(u))} ${r(TY(zz + .4))} V${r(TY(zh - 1.2))}" stroke="${DUNKEL}" stroke-width="${r(TS * .26)}"/>`);
    for (const u of [-9.6, -6.2, -2.5, 2.5, 6.2, 9.6]) t.push(`<path d="${PT([[u - .45, zh - .2], [u + .45, zh - .2], [u + .3, zh + 3.4], [u, zh + 5.6], [u - .3, zh + 3.4]])}" fill="${u < 0 ? SAND_L : SAND}"/>`);
    TM.stern = { x: TX(0), y: TY(48), w: TS * 20 };
  }
  /* große Eckfialen auf den Ecken des Vierkants, sie begleiten das Achteck */
  for (const u of [-8.3, 8.3]) t.push(`<path d="${PT([[u - 1, 48], [u + 1, 48], [u + .8, 60], [u + .4, 62], [u, 67], [u - .4, 62], [u - .8, 60]])}" fill="${u < 0 ? SAND_L : SAND_D}"/>`);
  /* Achteck 49–76 m: hohe Maßwerkfenster mit Wimpergen, Fialen an den Kanten */
  {
    const z0 = 49.4, z1 = 76;
    t.push(RT(-6.8, z0, -3.3, z1, SAND_L), RT(-3.3, z0, 3.3, z1, SAND), RT(3.3, z0, 6.8, z1, SAND_D));
    for (const [u, w] of [[-5.05, 1.7], [0, 3], [5.05, 1.7]]) {
      t.push(`<path d="${PT([[u - w / 2, 52.4], [u + w / 2, 52.4], [u + w / 2, 68.6], [u, 71.4], [u - w / 2, 68.6]])}" fill="${S.lg("turmfenster", [[0, "#a9c8e4"], [0.35, "#3a2a26"], [1, "#2a1c18"]])}"/>`);
      const st = u > 0 ? "#8a4636" : "#d9937a";
      t.push(`<path d="M${r(TX(u))} ${r(TY(52.4))} V${r(TY(70.4))}" stroke="${st}" stroke-width="${r(TS * .22)}"/>`);
      for (const z of [58, 64]) t.push(`<path d="M${r(TX(u - w / 2))} ${r(TY(z))} H${r(TX(u + w / 2))}" stroke="${st}" stroke-width="${r(TS * .16)}"/>`);
      if (w > 2) t.push(`<circle cx="${r(TX(u))}" cy="${r(TY(69.2))}" r="${r(TS * .55)}" fill="none" stroke="${st}" stroke-width="${r(TS * .16)}"/>`);
      t.push(`<path d="${PT([[u - w / 2 - .6, 71], [u, 77.2], [u + w / 2 + .6, 71]])}" fill="none" stroke="${u > 0 ? "#8a4636" : "#e4a58a"}" stroke-width="${r(TS * .32)}"/>`);
    }
    for (const u of [-6.8, -3.3, 3.3, 6.8]) t.push(`<path d="${PT([[u - .38, 66], [u + .38, 66], [u + .22, 73.4], [u, 77.6], [u - .22, 73.4]])}" fill="${u < 0 ? SAND_L : SAND}"/>`);
    t.push(RT(-7.2, 75.6, 7.2, 76.7, HELL));
    TM.masswerk = { x: TX(0), y: TY(69.5), h: TS * 6, w: TS * 3.6 };
  }
  /* der durchbrochene Maßwerkhelm (76–113 m): achteckige Pyramide, drei Seiten sichtbar, Felder offen —
     der Himmel scheint durch; in den Feldern Maßwerk (Kreise, Dreipässe); Grate mit Krabben; Kreuzblume */
  {
    const z0 = 76.7, z1 = 112.4, hb = 6.8, c = hb * .414;
    const tt = (z) => 1 - (z - z0) / (z1 - z0);
    const kanten = (z) => [-hb * tt(z), -c * tt(z), c * tt(z), hb * tt(z)];
    let d = PT([[-hb, z0], [hb, z0], [0, z1]]), mw = "";
    const Z = []; for (let i = 0; i <= 8; i++) Z.push(z0 + .5 + (z1 - z0 - 4.2) * (1 - Math.pow(1 - i / 8, 1.3)));
    for (let i = 0; i < 8; i++) {
      const za = Z[i] + .28, zb = Z[i + 1] - .28;
      if (zb - za < .5) continue;
      const ka = kanten(za), kb = kanten(zb);
      for (let f = 0; f < 3; f++) {
        const rib = f === 1 ? .32 : .26;
        const a0 = ka[f] + rib, a1 = ka[f + 1] - rib, b0 = kb[f] + rib, b1 = kb[f + 1] - rib;
        if (b1 - b0 < .25 || a1 - a0 < .4) continue;
        d += ` M${r(TX(a0))} ${r(TY(za))} L${r(TX(a1))} ${r(TY(za))} L${r(TX(b1))} ${r(TY(zb))} L${r(TX(b0))} ${r(TY(zb))} Z`;
        /* Maßwerk im Feld: Kreis mit Dreipass oben, Pfosten darunter */
        const w = (b1 - b0), h = zb - za, mx = (a0 + a1 + b0 + b1) / 4;
        const rho = Math.min(w * .42, h * .3);
        if (rho > .2) {
          const cz = zb - rho - .1, R = rho * TS, cx = TX(mx), cy = TY(cz);
          mw += `M${r(cx + R)} ${r(cy)} A${r(R)} ${r(R)} 0 1 0 ${r(cx - R)} ${r(cy)} A${r(R)} ${r(R)} 0 1 0 ${r(cx + R)} ${r(cy)} `;
          if (rho > .45) for (let j = 0; j < 3; j++) { const ang = -Math.PI / 2 + j * 2 * Math.PI / 3, px = cx + Math.cos(ang) * R * .42, py = cy + Math.sin(ang) * R * .42, rr = R * .4; mw += `M${r(px + rr)} ${r(py)} A${r(rr)} ${r(rr)} 0 1 0 ${r(px - rr)} ${r(py)} A${r(rr)} ${r(rr)} 0 1 0 ${r(px + rr)} ${r(py)} `; }
          const pf = f === 1 && w > 2 ? [mx - w * .2, mx + w * .2] : [mx];
          for (const u of pf) mw += `M${r(TX(u + (a0 + a1 - b0 - b1) / 4 * 0))} ${r(TY(za))} L${r(TX(u))} ${r(TY(cz - rho))} `;
          mw += `M${r(TX(mx - rho))} ${r(TY(cz - rho * .2))} Q${r(TX(mx))} ${r(TY(za + h * .1))} ${r(TX(mx + rho))} ${r(TY(cz - rho * .2))} `;
        }
      }
    }
    t.push(`<path d="${d}" fill-rule="evenodd" fill="${S.lg("helm", [[0, "#e6a688"], [0.42, "#c27258"], [0.62, "#a85a44"], [1, "#7d3c30"]], 0, 0, 1, 0)}"/>`);
    t.push(`<path d="${mw}" fill="none" stroke="#c27258" stroke-width="${r(TS * .17)}"/>`);
    /* Grate (vier sichtbar) mit Krabben */
    for (const [u, col] of [[-hb, "#f0b89e"], [-c, "#d48a6e"], [c, "#9c5240"], [hb, "#7d3c30"]]) {
      t.push(`<path d="M${r(TX(u))} ${r(TY(z0))} L${r(TX(0))} ${r(TY(z1))}" stroke="${col}" stroke-width="${r(TS * (Math.abs(u) > c ? .5 : .38))}"/>`);
      for (let z = z0 + 2.2; z < z1 - 1.2; z += 2.6) { const uu = u * tt(z), sd = u < 0 ? -1 : 1; t.push(`<path d="M${r(TX(uu))} ${r(TY(z))} q${r(TS * sd * .7)} ${r(-TS * .1)} ${r(TS * sd * .5)} ${r(-TS * .7)}" stroke="${col}" stroke-width="${r(TS * .28)}" fill="none" stroke-linecap="round"/>`); }
    }
    /* Kreuzblume: vier kräftige Steinblätter und Knospe */
    const kb = (u, z) => [TX(u), TY(z)];
    const [kx, ky] = kb(0, 113);
    t.push(`<path d="M${r(kx - TS * .35)} ${r(TY(112.2))} L${r(kx - TS * .3)} ${r(TY(116))} L${r(kx + TS * .3)} ${r(TY(116))} L${r(kx + TS * .35)} ${r(TY(112.2))} Z" fill="#b4644d"/>`);
    for (const [dz, sd, gr] of [[113.1, -1, 1], [113.1, 1, 1], [115, -1, .75], [115, 1, .75]]) {
      const y = TY(dz), L = TS * 1.7 * gr;
      t.push(`<path d="M${r(kx)} ${r(y)} C${r(kx + sd * L * .5)} ${r(y - L * .7)} ${r(kx + sd * L * 1.2)} ${r(y - L * .2)} ${r(kx + sd * L)} ${r(y + L * .35)} C${r(kx + sd * L * .7)} ${r(y + L * .05)} ${r(kx + sd * L * .4)} ${r(y + L * .2)} ${r(kx)} ${r(y + L * .25)} Z" fill="${sd < 0 ? "#eab096" : "#a85a44"}"/>`);
    }
    t.push(`<path d="M${r(kx)} ${r(TY(116))} C${r(kx - TS * .7)} ${r(TY(116.4))} ${r(kx - TS * .3)} ${r(TY(117.6))} ${r(kx)} ${r(TY(118))} C${r(kx + TS * .3)} ${r(TY(117.6))} ${r(kx + TS * .7)} ${r(TY(116.4))} ${r(kx)} ${r(TY(116))} Z" fill="#d48a6e"/>`);
    TM.helm = { x: TX(0), y: TY(96), h: TS * 30, w: TS * 9 };
    TM.kb = { x: TX(0), y: TY(112.2), h: TS * 5 };
  }
  TM.uhr = { x: uhr[0], y: uhr[1], r: ur };
  const zx = 188, zy = 10;
  S.teil({ id: "muensterturm", de: "der Münsterturm", syl: "MÜNS-ter-turm", it: "il campanile del duomo", itSyl: "cam-pa-NI-le del DUO-mo", en: "Minster tower", x: 0, y: 0, kunst: t.join(""),
    tipp: "Der Turm ist 116 Meter hoch und war schon um 1330 fertig — als einziger großer gotischer Kirchturm Deutschlands noch im Mittelalter. Jacob Burckhardt nannte ihn „den schönsten Turm auf Erden“.",
    zoom: { x: zx, y: zy, w: 320 - zx, h: r((320 - zx) / 1.5) },
    unter: [
      { id: "turmhelm", de: "der Turmhelm", syl: "TURM-helm", it: "la guglia", itSyl: "GU-glia", en: "spire", x: TM.helm.x, y: TM.helm.y, kunst: flaeche(-TM.helm.w / 2, -TM.helm.h / 2, TM.helm.w, TM.helm.h),
        tipp: "Der Helm ist ganz durchbrochen — man sieht den Himmel hindurch. So einen Helm gab es zuerst in Freiburg." },
      { id: "kreuzblume", de: "die Kreuzblume", syl: "KREUZ-blu-me", it: "il fiore crociato", itSyl: "FIO-re cro-CIA-to", en: "finial", x: TM.kb.x, y: TM.kb.y, kunst: flaeche(-2.4, -TM.kb.h - 1, 4.8, TM.kb.h + 1.4, 0.6),
        tipp: "Die Kreuzblume ist die steinerne Blume ganz oben auf der Spitze." },
    ] });
}

/* =====================================================================
   5 — DAS MÜNSTER (Langhaus mit Strebewerk, Querhaus) — Lupe: Uhr, Wasserspeier
   ===================================================================== */
{
  let k = "";
  const Y_SS = -15, Y_OG = -7, ZF = 35.5;
  const xs = (i) => -46 + i * 7.43;
  const PATINA = S.lg("patina", [[0, "#2a1814", 0.55], [0.6, "#2a1814", 0.18], [1, "#2a1814", 0]]);
  /* Wetterspuren: dunkle Läufe von den Gesimsen herab */
  const spuren = (Y, x0, x1, ztop, n) => { let g = ""; for (let i = 0; i < n; i++) { const x = x0 + rnd() * (x1 - x0), w = .4 + rnd() * 1.1, l = 2 + rnd() * (ztop * .6); g += `<path d="${poly([[x, Y - .05, ztop], [x + w, Y - .05, ztop], [x + w * .8, Y - .05, ztop - l], [x + w * .2, Y - .05, ztop - l]])}" fill="${PATINA}"/>`; } return g; };
  /* gotisches Fenster mit Maßwerk: n Bahnen, Kleeblattbögen, Rose oben */
  const fenster = (Y, xm, w, z0, z1, bahnen) => {
    let g = `<path d="${poly([[xm - w / 2, Y, z0], ...fbogen(Y, xm, w, z1 - w * .9, z1, true, 8)])}" fill="${S.lg("kirchfenster", [[0, "#3e3a46"], [0.5, "#2a2430"], [1, "#1f1a20"]])}"/>`;
    const zb = z1 - w * .9 - .2, ro = w * .28;
    let st = "";
    for (let i = 1; i < bahnen; i++) { const x = xm - w / 2 + i * w / bahnen; st += linie([[x, Y, z0], [x, Y, zb]]) + " "; }
    for (let i = 0; i < bahnen; i++) { const x = xm - w / 2 + (i + .5) * w / bahnen; st += linie(fbogen(Y, x, w / bahnen, zb - .1, zb + w / bahnen * .7, true, 6)) + " "; }
    k += "";
    const c = pr(xm, Y, z1 - w * .55), rr = FOC / tief(xm, Y) * ro;
    g += `<path d="${st}" stroke="#d9937a" stroke-width="${r(Math.max(.2, FOC / tief(xm, Y) * .12))}" fill="none"/>`;
    if (rr > .35) g += `<circle cx="${r(c[0])}" cy="${r(c[1])}" r="${r(rr)}" fill="none" stroke="#d9937a" stroke-width="${r(Math.max(.18, rr * .16))}"/>`;
    return g;
  };
  /* Wasserspeier als Fabeltier: Leib aus dem Pfeiler, Kopf mit offenem Maul */
  const speier = (a, b, sz) => {
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
    const p = (t, o) => [a[0] + dx * t + nx * o * sz, a[1] + dy * t + ny * o * sz];
    let g = `<path d="M${P(p(0, -.32))} Q${P(p(.5, -.42))} ${P(p(.78, -.3))} L${P(p(.78, .26))} Q${P(p(.4, .36))} ${P(p(0, .3))} Z" fill="#8a4434"/>`;
    g += `<path d="M${P(p(.7, -.36))} L${P(p(1.02, -.3))} L${P(p(1.08, -.05))} L${P(p(.86, -.02))} Z" fill="#a85a44"/>`;
    g += `<path d="M${P(p(.74, .06))} L${P(p(1, .28))} L${P(p(.92, .34))} L${P(p(.72, .24))} Z" fill="#6e3226"/>`;
    g += `<path d="M${P(p(.72, -.36))} l${r(-nx * sz * .2 - ux * sz * .1)} ${r(-ny * sz * .2 - uy * sz * .1)}" stroke="#6e3226" stroke-width="${r(sz * .08)}"/><circle cx="${r(p(.84, -.2)[0])}" cy="${r(p(.84, -.2)[1])}" r="${r(sz * .05)}" fill="#1d120e"/>`;
    g += `<path d="M${P(p(.25, .3))} l${r(ny * sz * .25)} ${r(-nx * sz * .25)} M${P(p(.5, .3))} l${r(ny * sz * .22)} ${r(-nx * sz * .22)}" stroke="#6e3226" stroke-width="${r(sz * .07)}"/>`;
    return g;
  };
  /* Dach des Mittelschiffs und Obergaden mit Maßwerkfenstern */
  k += `<path d="${poly([[-46, Y_OG, 26.6], [6, Y_OG, 26.6], [6, 0, ZF], [-46, 0, ZF]])}" fill="${S.lg("dachm", [[0, "#5d5250"], [1, "#7c6e68"]])}"/>`;
  for (let x = -44; x < 6; x += 2.4) k += `<path d="${linie([[x, Y_OG, 26.6], [x, 0, ZF]])}" stroke="#4a4140" stroke-width=".2" opacity=".5"/>`;
  k += `<path d="${poly([[-46, Y_OG, 17.4], [6, Y_OG, 17.4], [6, Y_OG, 26.8], [-46, Y_OG, 26.8]])}" fill="${SAND_L}"/>`;
  for (let i = 0; i < 7; i++) k += fenster(Y_OG, xs(i) + 3.72, 3.2, 18.6, 25.6, 2);
  k += spuren(Y_OG, -46, 6, 26.6, 9);
  /* Pultdach des Seitenschiffs, Seitenschiffwand mit Fenstern */
  k += `<path d="${poly([[-46, Y_SS, 12], [6, Y_SS, 12], [6, Y_OG, 17.4], [-46, Y_OG, 17.4]])}" fill="${S.lg("dachs", [[0, "#6a5d58"], [1, "#857570"]])}"/>`;
  k += `<path d="${poly([[-46, Y_SS, 0], [6, Y_SS, 0], [6, Y_SS, 12.2], [-46, Y_SS, 12.2]])}" fill="${SAND_L}"/>`;
  for (let z = 1.6; z < 12; z += 1.5) k += `<path d="${linie([[-46, Y_SS, z], [6, Y_SS, z]])}" stroke="#8a4636" stroke-width=".18" opacity=".3"/>`;
  for (let i = 0; i < 7; i++) k += fenster(Y_SS, xs(i) + 3.72, 3.6, 2.6, 10.8, 3);
  k += spuren(Y_SS, -46, 6, 12.2, 12);
  /* Maßwerkbrüstungen an den Traufen von Seitenschiff und Obergaden */
  for (const [yy, z0, x0] of [[Y_SS - .2, 12.2, -46], [Y_OG - .2, 26.6, -46]]) {
    k += `<path d="${poly([[x0, yy, z0], [6, yy, z0], [6, yy, z0 + 1.1], [x0, yy, z0 + 1.1]])}" fill="${SAND_L}"/>`;
    let st = "";
    for (let x = x0 + .6; x < 6; x += 1.2) st += linie([[x, yy, z0 + .15], [x, yy, z0 + .95]]) + " ";
    k += `<path d="${st}" stroke="#8a4636" stroke-width=".22"/>`;
  }
  /* Strebepfeiler (Wasserschläge, Wimperg, Fiale), schlanke Strebebögen, Wasserspeier */
  const SP = [];
  for (let i = 0; i <= 7; i++) {
    const xb = xs(i);
    const unten = [], oben = [];
    for (let j = 0; j <= 8; j++) { const t = j / 8, y = -17.4 + t * (Y_OG - -17.4); oben.push([xb, y, 16.4 + t * 9.4]); unten.push([xb, y, 15 + t * 9.6 - Math.sin(t * Math.PI) * 1.6]); }
    k += `<path d="${poly([...oben, ...unten.reverse()])}" fill="${SAND}"/><path d="${linie(oben)}" stroke="#f0b89e" stroke-width=".3"/>`;
    k += `<path d="${poly([[xb + .8, -17.8, 0], [xb + .8, Y_SS, 0], [xb + .8, Y_SS, 14.4], [xb + .8, -17.8, 14.4]])}" fill="${SAND_D}"/>`;
    k += `<path d="${poly([[xb - .8, -17.8, 0], [xb + .8, -17.8, 0], [xb + .8, -17.8, 14.4], [xb - .8, -17.8, 14.4]])}" fill="${SAND_L}"/>`;
    for (const z of [5, 9.6]) k += `<path d="${poly([[xb - .85, -17.9, z], [xb + .85, -17.9, z], [xb + .85, -17.9, z + .4], [xb - .85, -17.9, z + .4]])}" fill="#f0b89e"/>`;
    k += `<path d="${linie([[xb - .7, -17.9, 12.2], [xb, -17.9, 14.2], [xb + .7, -17.9, 12.2]])}" stroke="#f0b89e" stroke-width=".28" fill="none"/>`;
    k += `<path d="${poly([[xb - .55, -17.8, 14.4], [xb + .55, -17.8, 14.4], [xb + .35, -17.8, 17.4], [xb, -17.8, 20.6], [xb - .35, -17.8, 17.4]])}" fill="${SAND_L}"/>`;
    for (const z of [15.6, 17, 18.4, 19.6]) { const sk = 1 - (z - 14.4) / 6.4; k += `<path d="${linie([[xb - .5 * sk - .3, -17.8, z + .3], [xb - .5 * sk, -17.8, z]])} ${linie([[xb + .5 * sk + .3, -17.8, z + .3], [xb + .5 * sk, -17.8, z]])}" stroke="#d9937a" stroke-width=".3"/>`; }
    const w0 = pr(xb, -17.8, 12.9), w1 = pr(xb, -19.8, 13.1), ws = FOC / tief(xb, -18);
    k += speier(w0, w1, Math.max(.9, ws * 1.1));
    SP.push({ x: (w0[0] + w1[0]) / 2, y: (w0[1] + w1[1]) / 2 });
  }
  /* Querhaus: Südgiebel mit Stufenportal (Gewände, Tympanon) und großem Maßwerkfenster; Ostwand im Schatten */
  const QY = -19;
  k += `<path d="${poly([[6, QY, 26.6], [18, QY, 26.6], [18, 0, ZF + 1], [6, 0, ZF + 1]])}" fill="${S.lg("dachq", [[0, "#5d5250"], [1, "#7c6e68"]])}"/>`;
  k += `<path d="${poly([[18, QY, 0], [18, -15, 0], [18, -15, 26.6], [18, QY, 26.6]])}" fill="${SAND_D}"/>`;
  k += `<path d="${poly([[6, QY, 0], [18, QY, 0], [18, QY, 26.6], [12, QY, 36.4], [6, QY, 26.6]])}" fill="${SAND_L}"/>`;
  k += spuren(QY, 6.5, 17.5, 26.4, 6) + spuren(QY, 9, 15, 33, 2);
  k += `<path d="${poly(toroeffnung(QY, 12, 6.6, 4.4, 9.6, true))}" fill="#7d3c30"/><path d="${poly(toroeffnung(QY, 12, 5.2, 4.4, 8.8, true))}" fill="#a85a44"/><path d="${poly(toroeffnung(QY, 12, 3.8, 4.4, 8, true))}" fill="${LOCH}"/>`;
  for (const [w, zk, c] of [[6, 9.4, "#e4a58a"], [4.6, 8.6, "#e4a58a"]]) k += `<path d="${linie(fbogen(QY, 12, w, 4.4, zk, true, 10))}" stroke="${c}" stroke-width=".45" fill="none"/>`;
  k += `<path d="${poly([[10.1, QY - .05, 4.4], [13.9, QY - .05, 4.4], [13.9, QY - .05, 5], [12, QY - .05, 7.4], [10.1, QY - .05, 5]])}" fill="#c27a62"/>`;
  for (const x of [8.9, 9.6, 14.4, 15.1]) k += `<path d="${linie([[x, QY - .1, 0], [x, QY - .1, 4.4]])}" stroke="#e4a58a" stroke-width=".4"/>`;
  k += `<path d="${linie([[11.6, QY - .1, 0], [11.6, QY - .1, 4.4]])}" stroke="#c27a62" stroke-width=".6"/>`;
  k += `<path d="${poly([[6.4, QY - .3, 27.2], [12, QY - .3, 36.4], [17.6, QY - .3, 27.2]])}" fill="none" stroke="#e4a58a" stroke-width=".6"/>`;
  for (let t = .08; t < 1; t += .12) for (const sd of [-1, 1]) { const x = 12 + sd * 5.6 * (1 - t), z = 27.2 + 9.2 * t; k += `<path d="${linie([[x, QY - .4, z], [x + sd * .5, QY - .4, z + .6]])}" stroke="#d9937a" stroke-width=".45" stroke-linecap="round"/>`; }
  { const a = pr(12, QY - .3, 36.4), b = pr(12, QY - .3, 38.2), qs = FOC / tief(12, QY); k += `<path d="M${P(a)} L${P(b)}" stroke="#c98068" stroke-width="${r(qs * .3)}"/><path d="M${r(b[0] - qs * .5)} ${r(b[1] + qs * .2)} q${r(qs * .5)} ${r(-qs * .9)} ${r(qs)} 0 M${r(b[0] - qs * .4)} ${r(b[1] - qs * .3)} h${r(qs * .8)}" stroke="#c98068" stroke-width="${r(qs * .22)}" fill="none"/>`; }
  k += fenster(QY, 12, 7, 12.4, 25.8, 4);
  for (const xb of [6, 18]) {
    k += `<path d="${poly([[xb + .9, QY - 1.8, 0], [xb + .9, QY, 0], [xb + .9, QY, 24], [xb + .9, QY - 1.8, 24]])}" fill="${SAND_D}"/>`;
    k += `<path d="${poly([[xb - .9, QY - 1.8, 0], [xb + .9, QY - 1.8, 0], [xb + .9, QY - 1.8, 24], [xb - .9, QY - 1.8, 24]])}" fill="${SAND_L}"/>`;
    for (const z of [7, 14, 20]) k += `<path d="${poly([[xb - .95, QY - 1.9, z], [xb + .95, QY - 1.9, z], [xb + .95, QY - 1.9, z + .45], [xb - .95, QY - 1.9, z + .45]])}" fill="#f0b89e"/>`;
    k += `<path d="${poly([[xb - .6, QY - 1.8, 24], [xb + .6, QY - 1.8, 24], [xb + .3, QY - 1.8, 28], [xb, QY - 1.8, 31.4], [xb - .3, QY - 1.8, 28]])}" fill="${SAND_L}"/>`;
    const w0 = pr(xb, QY - 1.8, 21.8), w1 = pr(xb, QY - 4.4, 22.2), ws = FOC / tief(xb, QY - 2);
    k += speier(w0, w1, ws * 1.1);
    SP.push({ x: (w0[0] + w1[0]) / 2, y: (w0[1] + w1[1]) / 2 });
  }
  const sp = SP[SP.length - 1];
  S.teil({ id: "muenster", de: "das Freiburger Münster", syl: "FREI-bur-ger MÜNS-ter", it: "la cattedrale di Friburgo", itSyl: "cat-te-DRA-le di fri-BUR-go", en: "Freiburg Minster",
    x: 0, y: 0, kunst: k, tipp: "Das Münster wurde ab etwa 1200 aus rotem Sandstein gebaut. Der Chor wurde erst 1513 geweiht.",
    zoom: { x: 206, y: 104, w: 114, h: 76 },
    unter: [
      { id: "uhr", de: "die Uhr", syl: "UHR", it: "l'orologio", itSyl: "o-ro-LO-gio", en: "clock", x: TM.uhr.x, y: TM.uhr.y, kunst: flaecheEllipse(0, 0, TM.uhr.r * 1.3, TM.uhr.r * 1.3) },
      { id: "wasserspeier", de: "der Wasserspeier", syl: "WAS-ser-spei-er", it: "il doccione", itSyl: "doc-CIO-ne", en: "gargoyle", x: sp.x, y: sp.y, kunst: flaeche(-3, -2.4, 6, 4.4, 0.5),
        tipp: "Durch die Wasserspeier fließt das Regenwasser vom Dach. Am Münster sehen viele wie Tiere und Fratzen aus." },
    ] });
}

/* =====================================================================
   6 — DAS HISTORISCHE KAUFHAUS — Lupe: Kaiserfigur, Erker, Wappen
   ===================================================================== */
const KX0 = 8, KX1 = 44, KZE = 13.6;
const KAUF = {};
{
  let k = "";
  const KRF = S.lg("kaufrot", [[0, "#8e2618"], [0.5, "#a3301f"], [1, "#952a1b"]], 0, 0, 1, 0);
  const GL = S.lg("kaufglas", [[0, "#b6cde0"], [0.35, "#45525e"], [1, "#2a3038"]]);
  /* bunt glasierte Ziegel als feines Rautenmuster für Türmchen und Gauben */
  S.def(`<pattern id="${S.id("rauten")}" width="1.6" height="2" patternUnits="userSpaceOnUse"><rect width="1.6" height="2" fill="#2a2420"/><path d="M.8 0 L1.6 1 L.8 2 L0 1 Z" fill="#d6a62e"/><path d="M.8 .5 L1.2 1 L.8 1.5 L.4 1 Z" fill="#2f6e44"/><path d="M0 0 L.4 .5 L0 1 Z M1.6 1 L1.2 1.5 L1.6 2 Z" fill="#b8442a"/></pattern>`);
  const RAUTEN = `url(#${S.id("rauten")})`;
  const HELMLICHT = S.lg("helmlicht", [[0, "#fff", 0.22], [0.5, "#fff", 0], [1, "#000", 0.32]], 0, 0, 1, 0);
  /* --- Dach: Walmdach mit bunt glasierten Ziegeln im Rautenmuster --- */
  const dachN = [[KX0, KYS, KZE], [KX1, KYS, KZE], [KX1 - 5, KYS - 10, 27], [KX0 + 5, KYS - 10, 27]];
  const dachO = [[KX1, KYS, KZE], [KX1, KYS - 20, KZE], [KX1 - 5, KYS - 10, 27]];
  k += `<path d="${poly(dachO)}" fill="#5a3a22"/>`;
  S.def(`<clipPath id="${S.id("dachclip")}"><path d="${poly(dachN)}"/></clipPath>`);
  let fl = `<path d="${poly(dachN)}" fill="#6a3a22"/>`;
  const dp = (x, v) => [x, KYS - 10 * v, KZE + 13.4 * v];
  for (let j = 0; j < 12; j++) for (let i = 0; i < 21; i++) {
    const v0 = j / 12, v1 = (j + 1) / 12, vm = (v0 + v1) / 2, x = KX0 + (i + (j % 2) * 0.5) * 1.8;
    const farbe = ["#d6a62e", "#2f6e44", "#1f1d1c", "#b8442a"][(i + j) % 4];
    fl += `<path d="${poly([dp(x, v0), dp(x + .9, vm), dp(x, v1), dp(x - .9, vm)])}" fill="${farbe}"/>`;
  }
  k += `<g clip-path="url(#${S.id("dachclip")})">${fl}<path d="${poly(dachN)}" fill="${S.lg("dachglanz", [[0, "#fff", 0.18], [0.5, "#fff", 0], [1, "#000", 0.18]], 0, 0, 1, 0)}"/></g>`;
  k += `<path d="${linie([[KX1, KYS, KZE], [KX1 - 5, KYS - 10, 27], [KX0 + 5, KYS - 10, 27]])}" stroke="#3a2a20" stroke-width=".5" fill="none"/>`;
  /* Gauben „wie in Beaune“: hohe Giebelgauben mit spitzen Helmen und Knäufen */
  for (const gx of [17.5, 26, 34.5]) {
    const y0 = KYS - 1.6, z0 = KZE + 2.2;
    k += `<path d="${poly([[gx - 1.5, y0, z0], [gx + 1.5, y0, z0], [gx + 1.5, y0, z0 + 3.8], [gx, y0, z0 + 6], [gx - 1.5, y0, z0 + 3.8]])}" fill="${KRF}"/>`;
    k += `<path d="${poly([[gx - .8, y0, z0 + .6], [gx + .8, y0, z0 + .6], [gx + .8, y0, z0 + 3.4], [gx - .8, y0, z0 + 3.4]])}" fill="${GL}"/>`;
    const helm = poly([[gx - 1.9, y0, z0 + 3.6], [gx, y0, z0 + 6.2], [gx + 1.9, y0, z0 + 3.6], [gx, y0 - 2.2, z0 + 9.2]]);
    k += `<path d="${helm}" fill="${RAUTEN}"/><path d="${helm}" fill="${HELMLICHT}"/>`;
    const a = pr(gx, y0 - 2.2, z0 + 9.2), b = pr(gx, y0 - 2.2, z0 + 10.8);
    k += `<path d="M${P(a)} L${P(b)}" stroke="#d8b04a" stroke-width=".55"/><circle cx="${r(b[0])}" cy="${r(b[1])}" r=".5" fill="#e8c35a"/>`;
  }
  /* --- Fassade: leuchtend rot, im Schatten der Mittagssonne --- */
  k += `<path d="${fq(KYS, KX0, 0, KX1, KZE)}" fill="${KRF}"/>`;
  k += `<path d="${fq(KYS, KX0, KZE - .8, KX1, KZE + .2)}" fill="${STEIN}"/><path d="${fq(KYS, KX0, 5.6, KX1, 6)}" fill="${STEIN}"/>`;
  /* Balkon über dem Laubengang mit Maßwerkbrüstung */
  k += `<path d="${poly([[KX0 + 3.6, KYS + .5, 6], [KX1 - 3.6, KYS + .5, 6], [KX1 - 3.6, KYS + .5, 7.1], [KX0 + 3.6, KYS + .5, 7.1]])}" fill="${STEIN}"/>`;
  for (let x = KX0 + 4.1; x < KX1 - 3.8; x += 1.05) k += `<path d="${linie([[x, KYS + .5, 6.2], [x, KYS + .5, 6.9]])}" stroke="#8a3a2c" stroke-width=".4"/>`;
  /* fünf Fenster des Obergeschosses mit Kreuzstock */
  for (const xm of [12.4, 19.6, 26, 32.4, 39.6]) {
    k += `<path d="${fq(KYS, xm - 1.5, 7.5, xm + 1.5, 12.4)}" fill="${STEIN}"/><path d="${fq(KYS, xm - 1.2, 7.7, xm + 1.2, 12.2)}" fill="${GL}"/>`;
    k += `<path d="${linie([[xm, KYS, 7.7], [xm, KYS, 12.2]])} ${linie([[xm - 1.2, KYS, 10.4], [xm + 1.2, KYS, 10.4]])}" stroke="${STEIN}" stroke-width=".4"/>`;
  }
  /* die vier Habsburger: Maximilian I., Philipp der Schöne, Karl V., Ferdinand I. — bemalt, unter Baldachinen */
  const kaiser = [];
  [[16, "#8a1f22"], [22.8, "#1f3f7a"], [29.2, "#2a2a2a"], [36, "#3f6a2a"]].forEach(([xm, robe], i) => {
    const y = KYS + .35, f0 = pr(xm, y, 7.5), f1 = pr(xm, y, 10.3), h = f0[1] - f1[1], x = f0[0];
    let g = `<path d="${poly([[xm - .9, y, 7], [xm + .9, y, 7], [xm + .5, y, 7.5], [xm - .5, y, 7.5]])}" fill="${STEIN}"/>`;
    g += `<path d="M${r(x - h * .16)} ${r(f0[1])} L${r(x - h * .11)} ${r(f1[1] + h * .3)} Q${r(x)} ${r(f1[1] + h * .22)} ${r(x + h * .11)} ${r(f1[1] + h * .3)} L${r(x + h * .16)} ${r(f0[1])} Z" fill="${robe}"/>`;
    g += `<path d="M${r(x - h * .13)} ${r(f1[1] + h * .34)} Q${r(x)} ${r(f1[1] + h * .42)} ${r(x + h * .13)} ${r(f1[1] + h * .34)}" stroke="#e8dcc2" stroke-width="${r(h * .06)}" fill="none"/>`;
    g += `<path d="M${r(x + h * .1)} ${r(f1[1] + h * .36)} L${r(x + h * .16)} ${r(f1[1] + h * .05)}" stroke="#e8c35a" stroke-width="${r(h * .035)}"/><circle cx="${r(x - h * .06)}" cy="${r(f1[1] + h * .5)}" r="${r(h * .045)}" fill="#e8c35a"/>`;
    g += `<circle cx="${r(x)}" cy="${r(f1[1] + h * .16)}" r="${r(h * .09)}" fill="#e2b48e"/>`;
    g += `<path d="M${r(x - h * .09)} ${r(f1[1] + h * .1)} l${r(h * .03)} ${r(-h * .1)} ${r(h * .045)} ${r(h * .05)} ${r(h * .03)} ${r(-h * .07)} ${r(h * .03)} ${r(h * .07)} ${r(h * .045)} ${r(-h * .05)} ${r(h * .03)} ${r(h * .1)} Z" fill="#e8c35a"/>`;
    g += `<path d="${poly([[xm - .85, y, 10.5], [xm + .85, y, 10.5], [xm + .85, y, 11.3], [xm + .5, y, 11.3], [xm + .3, y, 12.2], [xm, y, 13.2], [xm - .3, y, 12.2], [xm - .5, y, 11.3], [xm - .85, y, 11.3]])}" fill="${STEIN}"/>`;
    g += `<path d="${linie([[xm - .6, y, 10.6], [xm, y, 11.1], [xm + .6, y, 10.6]])}" stroke="#8a3a2c" stroke-width=".3" fill="none"/>`;
    k += g;
    kaiser.push({ x, y: f0[1], h });
  });
  /* Erker an den Ecken: drei Seiten, Fenster, Wappen, Türmchen mit bunten Ziegeln */
  const wappen = [["#c8202a", "#ffffff", "#c8202a"], ["#f2ead8", "#c8202a", "#f2ead8"]];
  const erker = (xa, xb, wi) => {
    const yv = KYS + 1.4, xm = (xa + xb) / 2, ze = KZE + 1.2;
    let g = `<path d="${poly([[xa, KYS, 5.8], [xb, KYS, 5.8], [xb - .9, yv, 5.8], [xm, yv + .2, 4.2], [xa + .9, yv, 5.8]])}" fill="${STEIN}"/>`;
    g += `<path d="${poly([[xa, KYS, 5.8], [xa + .9, yv, 5.8], [xa + .9, yv, ze], [xa, KYS, ze]])}" fill="#7e2214"/>`;
    g += `<path d="${poly([[xa + .9, yv, 5.8], [xb - .9, yv, 5.8], [xb - .9, yv, ze], [xa + .9, yv, ze]])}" fill="${KRF}"/>`;
    g += `<path d="${poly([[xb - .9, yv, 5.8], [xb, KYS, 5.8], [xb, KYS, ze], [xb - .9, yv, ze]])}" fill="#b23a28"/>`;
    g += `<path d="${poly([[xa + 1.2, yv, 9], [xb - 1.2, yv, 9], [xb - 1.2, yv, 12.2], [xa + 1.2, yv, 12.2]])}" fill="${GL}"/>`;
    /* Wappenschild */
    const w0 = pr(xm, yv, 6.3), w1 = pr(xm, yv, 8.4), wh = w0[1] - w1[1], [c1, c2] = wappen[wi];
    g += `<path d="M${r(w0[0] - wh * .38)} ${r(w1[1])} h${r(wh * .76)} v${r(wh * .55)} q0 ${r(wh * .38)} ${r(-wh * .38)} ${r(wh * .45)} q${r(-wh * .38)} ${r(-wh * .07)} ${r(-wh * .38)} ${r(-wh * .45)} Z" fill="${c1}" stroke="#d8b04a" stroke-width="${r(wh * .05)}"/>`;
    g += wi === 0 ? `<rect x="${r(w0[0] - wh * .38)}" y="${r(w1[1] + wh * .33)}" width="${r(wh * .76)}" height="${r(wh * .3)}" fill="${c2}"/>` : `<path d="M${r(w0[0] - wh * .07)} ${r(w1[1])} h${r(wh * .14)} v${r(wh * .95)} h${r(-wh * .14)} Z M${r(w0[0] - wh * .38)} ${r(w1[1] + wh * .3)} h${r(wh * .76)} v${r(wh * .14)} h${r(-wh * .76)} Z" fill="${c2}"/>`;
    /* Türmchen: spitzer Helm, bunte Rauten, goldener Knauf */
    const tip = [xm, yv - .4, ze + 6.6];
    const helm = poly([[xa - .2, KYS, ze], [xa + .9, yv + .1, ze], [xm, yv + .2, ze], [xb - .9, yv + .1, ze], [xb + .2, KYS, ze], [...tip]]);
    g += `<path d="${helm}" fill="${RAUTEN}"/><path d="${helm}" fill="${HELMLICHT}"/>`;
    g += `<path d="${linie([[xa + .9, yv + .1, ze], [...tip]])}" stroke="#1f1d1c" stroke-width=".3" opacity=".6"/>`;
    const tp = pr(...tip), tp2 = pr(tip[0], tip[1], tip[2] + 1.8);
    g += `<path d="M${P(tp)} L${P(tp2)}" stroke="#d8b04a" stroke-width=".6"/><circle cx="${r(tp2[0])}" cy="${r(tp2[1])}" r=".55" fill="#e8c35a"/>`;
    return g;
  };
  k += erker(KX0, KX0 + 3.6, 1) + erker(KX1 - 3.6, KX1, 0);
  /* Wasserspeier an der Traufe */

  KAUF.erker = pr(KX1 - 1.8, KYS + 1.4, 10.4);
  KAUF.wappen = pr(KX1 - 1.8, KYS + 1.4, 7.4);
  KAUF.kaiser = kaiser[3];
  const zoom = { x: 14, y: 110, w: 96, h: 64 };
  S.teil({ id: "kaufhaus", de: "das Historische Kaufhaus", syl: "his-TO-ri-sche KAUF-haus", it: "lo storico emporio", itSyl: "STO-ri-co em-PO-rio", en: "Historical Merchants' Hall",
    x: 0, y: 0, kunst: k, tipp: "Das rote Kaufhaus ist fast 500 Jahre alt. Früher wurden hier die Waren der Händler gewogen und verzollt.",
    zoom,
    unter: [
      { id: "kaiserfigur", de: "die Kaiserfigur", syl: "KAI-ser-fi-gur", it: "la statua dell'imperatore", itSyl: "STA-tu-a del-lim-pe-ra-TO-re", en: "emperor statue", x: KAUF.kaiser.x, y: KAUF.kaiser.y, kunst: flaeche(-KAUF.kaiser.h * .32, -KAUF.kaiser.h * 1.3, KAUF.kaiser.h * .64, KAUF.kaiser.h * 1.35, 0.4),
        tipp: "Vier Habsburger stehen an der Fassade: Maximilian I., Philipp der Schöne, Karl V. und Ferdinand I." },
      { id: "erker", de: "der Erker", syl: "ER-ker", it: "il bovindo", itSyl: "bo-VIN-do", en: "oriel", x: KAUF.erker[0], y: KAUF.erker[1], kunst: flaeche(-5, -16, 10, 22),
        tipp: "Der Erker ragt aus der Wand heraus. Oben trägt er ein Türmchen aus bunten Ziegeln." },
      { id: "wappen", de: "das Wappen", syl: "WAP-pen", it: "lo stemma", itSyl: "STEM-ma", en: "coat of arms", x: KAUF.wappen[0], y: KAUF.wappen[1], kunst: flaeche(-3, -3.4, 6, 5, 0.6),
        tipp: "Rot-weiß-rot ist das Wappen von Österreich. Freiburg gehörte fast 400 Jahre zu Habsburg." },
    ] });
}

/* =====================================================================
   7 — DER LAUBENGANG (vier Spitzbögen im Erdgeschoss des Kaufhauses)
   ===================================================================== */
{
  let k = "";
  for (const xm of [13.6, 21.2, 28.8, 36.4]) {
    k += `<path d="${poly(toroeffnung(KYS, xm, 6.2, 2.6, 5.3, true))}" fill="${S.lg("lauben", [[0, "#40261f"], [1, "#1f120e"]])}"/>`;
    k += `<path d="${linie(fbogen(KYS, xm, 6.8, 2.6, 5.7, true, 10))}" stroke="${STEIN}" stroke-width=".9" fill="none"/>`;
    /* hinten im Gang: Schaufenster und Lampen */
    k += `<path d="${fq(KYS - 3, xm - 1.6, .6, xm + 1.6, 2.8)}" fill="#c9a86a" opacity=".55"/>`;
  }
  for (const xm of [9.8, 17.4, 25, 32.6, 40.2]) k += `<path d="${fq(KYS + .2, xm - .7, 0, xm + .7, 5.6)}" fill="${S.lg("pfeiler", [[0, "#7e2214"], [1, "#a8352a"]], 0, 0, 1, 0)}"/>`;
  S.teil({ id: "laubengang", de: "der Laubengang", syl: "LAU-ben-gang", it: "il porticato", itSyl: "por-ti-CA-to", en: "arcade", x: 0, y: 0, kunst: k,
    tipp: "Unter dem Laubengang konnten die Händler auch bei Regen trocken stehen." });
}

/* =====================================================================
   8 — DAS CAFÉ (Nachbarhaus im Osten, mit Sonnenschirmen davor)
   ===================================================================== */
{
  const X0 = 44, X1 = 64, H = 15;
  let k = `<path d="${fq(KYS, X0, 0, X1, H)}" fill="#e9dcc2"/><path d="${fq(KYS, X0, 0, X1, H)}" fill="${S.lg("cafeschatten", [[0, "#2a2018", 0.16], [1, "#2a2018", 0.05]])}"/>`;
  k += `<path d="${poly([[X0, KYS, H], [X1, KYS, H], [X1 - 1, KYS - 7, H + 6.4], [X0 + 1, KYS - 7, H + 6.4]])}" fill="${S.lg("cafedach", [[0, "#6b4a3e"], [1, "#8f6656"]])}"/>`;
  k += `<path d="${fq(KYS, X0, H - .5, X1, H + .2)}" fill="#cbb89a"/><path d="${fq(KYS, X0, 3.8, X1, 4.2)}" fill="#cbb89a"/>`;
  for (let e = 0; e < 3; e++) for (let i = 0; i < 5; i++) { const xm = X0 + 2 + i * 4, z = 5.4 + e * 3.2; k += `<path d="${fq(KYS, xm - .7, z, xm + .7, z + 2.2)}" fill="#4a5058"/><path d="${fq(KYS, xm - 1, z - .2, xm + 1, z)}" fill="#cbb89a"/>`; }
  for (let i = 0; i < 4; i++) { const xm = X0 + 3 + i * 4.6; k += `<path d="${fq(KYS, xm - 1.4, .4, xm + 1.4, 3.2)}" fill="#3a3530"/>`; }
  /* Markise und Schild */
  k += `<path d="${poly([[X0 + .5, KYS, 4.4], [X1 - .5, KYS, 4.4], [X1 - .5, KYS + 2.2, 3.4], [X0 + .5, KYS + 2.2, 3.4]])}" fill="#7a2a2a"/>`;
  for (let x = X0 + 1.5; x < X1 - .5; x += 2) k += `<path d="${poly([[x, KYS + .1, 4.35], [x + 1, KYS + .1, 4.35], [x + 1, KYS + 2.2, 3.4], [x, KYS + 2.2, 3.4]])}" fill="#efe3c8"/>`;
  const sc = pr(46.8, KYS + .1, 5.05), ss = FOC / tief(46.8, KYS);
  k += `<text x="${r(sc[0])}" y="${r(sc[1])}" font-size="${r(ss * 1.1)}" text-anchor="middle" fill="#7a2a2a" font-family="Georgia,serif" font-style="italic" font-weight="bold">Café</text>`;
  /* Tische mit Sonnenschirmen vor dem Haus (im Schatten der Häuser) */
  for (const [x, y] of [[48.6, -74.4], [46.4, -77.6]]) {
    const f = fuss(x, y), s = f.s;
    k += `<path d="M${r(f.x)} ${r(f.y)} V${r(f.y - 2.3 * s)}" stroke="#d8d2c4" stroke-width="${r(.08 * s)}"/>`;
    k += `<path d="M${r(f.x - 1.4 * s)} ${r(f.y - 2.1 * s)} Q${r(f.x)} ${r(f.y - 2.9 * s)} ${r(f.x + 1.4 * s)} ${r(f.y - 2.1 * s)} Z" fill="#efe3c8"/><path d="M${r(f.x - 1.4 * s)} ${r(f.y - 2.1 * s)} h${r(2.8 * s)}" stroke="#7a2a2a" stroke-width="${r(.12 * s)}"/>`;
    k += `<ellipse cx="${r(f.x)}" cy="${r(f.y - .74 * s)}" rx="${r(.45 * s)}" ry="${r(.12 * s)}" fill="#c9c2b4"/><path d="M${r(f.x)} ${r(f.y)} V${r(f.y - .74 * s)}" stroke="#3a3a3a" stroke-width="${r(.06 * s)}"/>`;
    for (const d of [-.6, .6]) k += `<path d="M${r(f.x + d * s)} ${r(f.y)} v${r(-.45 * s)} h${r(.25 * s * Math.sign(d))} v${r(-.4 * s)}" stroke="#3a3a3a" stroke-width="${r(.05 * s)}" fill="none"/>`;
  }
  S.teil({ id: "cafe", de: "das Café", syl: "ca-FÉ", it: "il caffè", itSyl: "caf-FÈ", en: "café", x: 0, y: 0, kunst: k,
    tipp: "Rund um den Münsterplatz sitzt man im Café und schaut auf den Markt." });
}

/* =====================================================================
   9 — DER WOCHENMARKT (Stände im Hintergrund: Händler der Südseite)
   ===================================================================== */
{
  let k = "";
  const zelt = (x, y, dach, waren) => {
    const f = fuss(x, y), s = f.s, w = 3 * s, h = 2.5 * s;
    let g = schatten(f.x, f.y, w * .55, .25 * s, .25);
    for (const d of [-.47, .47]) g += `<path d="M${r(f.x + d * w)} ${r(f.y)} V${r(f.y - h)}" stroke="#bfbab0" stroke-width="${r(Math.max(.2, .05 * s))}"/>`;
    /* Tisch mit Waren in bunten Kisten */
    g += `<rect x="${r(f.x - w * .45)}" y="${r(f.y - .85 * s)}" width="${r(w * .9)}" height="${r(.85 * s)}" fill="#e9e4d8"/>`;
    for (let i = 0; i < 5; i++) g += `<rect x="${r(f.x - w * .42 + i * w * .17)}" y="${r(f.y - 1.05 * s)}" width="${r(w * .15)}" height="${r(.3 * s)}" fill="${waren[i % waren.length]}"/>`;
    /* Zeltdach mit Behang */
    g += `<path d="M${r(f.x - w * .56)} ${r(f.y - h)} L${r(f.x - w * .3)} ${r(f.y - h - .55 * s)} L${r(f.x + w * .3)} ${r(f.y - h - .55 * s)} L${r(f.x + w * .56)} ${r(f.y - h)} Z" fill="${dach[0]}"/>`;
    g += `<rect x="${r(f.x - w * .56)}" y="${r(f.y - h)}" width="${r(w * 1.12)}" height="${r(.32 * s)}" fill="${dach[1]}"/>`;
    return g;
  };
  const schirm = (x, y, farben, waren) => {
    const f = fuss(x, y), s = f.s;
    let g = schatten(f.x, f.y, 1.4 * s, .22 * s, .22);
    g += `<rect x="${r(f.x - 1.2 * s)}" y="${r(f.y - .85 * s)}" width="${r(2.4 * s)}" height="${r(.85 * s)}" fill="#e9e4d8"/>`;
    for (let i = 0; i < 4; i++) g += `<rect x="${r(f.x - 1.15 * s + i * .58 * s)}" y="${r(f.y - 1.05 * s)}" width="${r(.5 * s)}" height="${r(.25 * s)}" fill="${waren[i % waren.length]}"/>`;
    g += `<path d="M${r(f.x)} ${r(f.y)} V${r(f.y - 2.4 * s)}" stroke="#d8d2c4" stroke-width="${r(Math.max(.2, .05 * s))}"/>`;
    for (let i = 0; i < 6; i++) { const a0 = -1.5 + i * .5; g += `<path d="M${r(f.x)} ${r(f.y - 2.8 * s)} L${r(f.x + a0 * s)} ${r(f.y - 2.25 * s)} L${r(f.x + (a0 + .5) * s)} ${r(f.y - 2.25 * s)} Z" fill="${farben[i % 2]}"/>`; }
    return g;
  };
  const WEISS = ["#f4f1ea", "#e6e1d6"], ROTW = ["#c8382c", "#f4f1ea"], GRUEN = ["#2f6e44", "#f0ece0"], BLAU = ["#2f5f95", "#f0ece0"];
  const DACH = [WEISS, WEISS, ROTW, GRUEN, WEISS, BLAU];
  const WAREN = [["#d8a832", "#8a5a3a", "#c8382c"], ["#7a9a3a", "#c8382c", "#e8d090"], ["#5a7fae", "#e8e2d0", "#9a6a3a"], ["#d86a2a", "#7a9a3a", "#f0e0b0"], ["#e0a030", "#5a8a3a", "#b84a6a"]];
  const staende = [];
  for (const [yr, x0, x1, dx] of [[-67, -46, 28, 7.6], [-57, -44, 26, 8.2], [-43, -40, 24, 8.6], [-31, -38, 26, 8]]) {
    for (let x = x0 + rnd() * 2; x < x1; x += dx + rnd() * 2.4) {
      const y = yr + (rnd() - .5) * 2.6;
      const p = pr(x, y, 0);
      if (p[0] < 128 && y < -60) continue;                       // Laubengang frei lassen
      if (p[0] > 100 && p[0] < 162 && tief(x, y) < 30) continue; // nicht direkt hinter dem Wurststand
      staende.push([x, y, rnd() < .3 ? "s" : "z", DACH[Math.floor(rnd() * DACH.length)], WAREN[Math.floor(rnd() * WAREN.length)]]);
    }
  }
  staende.sort((a, b) => tief(b[0], b[1]) - tief(a[0], a[1])).forEach(([x, y, art, d, w]) => { k += art === "s" ? schirm(x, y, d, w) : zelt(x, y, d, w); });
  /* ein paar Tauben auf dem Pflaster */
  for (const [x, y] of [[57.2, -45.6], [58.4, -45], [56, -44.4]]) {
    const f = fuss(x, y), s = f.s;
    k += `<ellipse cx="${r(f.x)}" cy="${r(f.y - .12 * s)}" rx="${r(.15 * s)}" ry="${r(.09 * s)}" fill="#8a8f98"/><circle cx="${r(f.x + .13 * s)}" cy="${r(f.y - .22 * s)}" r="${r(.05 * s)}" fill="#6a7078"/><path d="M${r(f.x + .17 * s)} ${r(f.y - .22 * s)} l${r(.05 * s)} ${r(.01 * s)}" stroke="#d8a832" stroke-width="${r(.02 * s)}"/><path d="M${r(f.x - .05 * s)} ${r(f.y - .14 * s)} q${r(.08 * s)} ${r(-.06 * s)} ${r(.16 * s)} 0" stroke="#5a6a7a" stroke-width="${r(.03 * s)}" fill="none"/>`;
  }
  S.teil({ id: "wochenmarkt", de: "der Wochenmarkt", syl: "WO-chen-markt", it: "il mercato settimanale", itSyl: "mer-CA-to set-ti-ma-NA-le", en: "weekly market", x: 0, y: 0, kunst: k,
    tipp: "Auf der Nordseite verkaufen Bauern aus der Region, auf der Südseite Händler: Keramik, Bürsten, Holzwaren." });
}

/* =====================================================================
   10 — DER MARKTSTAND (Bauernstand mit Schirm) — Lupe: Spargel,
        Kirschen, Schwarzwälder Kirschtorte
   ===================================================================== */
const MS = {};
{
  const f = fuss(52, -41), s = f.s, x = f.x, y = f.y;
  let k = schatten(x, y, 1.9 * s, .3 * s, .3);
  /* Schirmstange (hinter dem Tisch), Tisch mit Tuch */
  k += `<path d="M${r(x + .25 * s)} ${r(y - .3 * s)} V${r(y - 2.5 * s)}" stroke="#d8d2c4" stroke-width="${r(.06 * s)}"/>`;
  k += `<path d="M${r(x - 1.5 * s)} ${r(y)} V${r(y - .8 * s)} H${r(x + 1.5 * s)} V${r(y)}" fill="none" stroke="#5a4a3a" stroke-width="${r(.06 * s)}"/>`;
  k += `<rect x="${r(x - 1.55 * s)}" y="${r(y - .9 * s)}" width="${r(3.1 * s)}" height="${r(.55 * s)}" fill="#f2efe6"/><rect x="${r(x - 1.55 * s)}" y="${r(y - .4 * s)}" width="${r(3.1 * s)}" height="${r(.08 * s)}" fill="#c8382c"/>`;
  /* Spargel: weiße Bündel mit Banderole (links) */
  for (let i = 0; i < 3; i++) {
    const bx = x - 1.25 * s + i * .3 * s;
    k += `<path d="M${r(bx)} ${r(y - .9 * s)} l${r(.1 * s)} ${r(-.55 * s)} h${r(.18 * s)} l${r(.1 * s)} ${r(.55 * s)} Z" fill="#f4f0e2"/><path d="M${r(bx + .1 * s)} ${r(y - 1.45 * s)} q${r(.09 * s)} ${r(-.08 * s)} ${r(.18 * s)} 0" fill="#e6dcb8"/><rect x="${r(bx + .03 * s)}" y="${r(y - 1.15 * s)}" width="${r(.32 * s)}" height="${r(.07 * s)}" fill="#3f7a4a"/>`;
  }
  MS.spargel = { x: x - 1.05 * s, y: y - 1.15 * s };
  /* Kirschen in Holzkörben (Mitte) */
  for (let i = 0; i < 2; i++) {
    const kx = x - .3 * s + i * .55 * s;
    k += `<path d="M${r(kx - .24 * s)} ${r(y - .9 * s)} l${r(-.04 * s)} ${r(-.22 * s)} h${r(.56 * s)} l${r(-.04 * s)} ${r(.22 * s)} Z" fill="#b88a50"/>`;
    for (let j = 0; j < 9; j++) k += `<circle cx="${r(kx - .2 * s + (j % 5) * .1 * s)}" cy="${r(y - 1.14 * s - Math.floor(j / 5) * .07 * s)}" r="${r(.055 * s)}" fill="${j % 3 ? "#7d0c1f" : "#a01a2a"}"/>`;
  }
  MS.kirschen = { x: x, y: y - 1.1 * s };
  /* Schwarzwälder Kirschtorte auf der Tortenplatte (rechts) */
  {
    const tx = x + 1.05 * s, ty = y - .9 * s, tr = .2 * s * 1.35, th = .12 * s * 1.35;
    k += `<path d="M${r(tx)} ${r(ty)} v${r(-.12 * s)}" stroke="#c9c2b4" stroke-width="${r(.05 * s)}"/><ellipse cx="${r(tx)}" cy="${r(ty - .12 * s)}" rx="${r(tr * 1.15)}" ry="${r(tr * .28)}" fill="#e6e1d6"/>`;
    k += `<path d="M${r(tx - tr)} ${r(ty - .13 * s)} v${r(-th)} a${r(tr)} ${r(tr * .25)} 0 0 1 ${r(2 * tr)} 0 v${r(th)} a${r(tr)} ${r(tr * .25)} 0 0 1 ${r(-2 * tr)} 0 Z" fill="${S.lg("sahne", [[0, "#fbf8f1"], [0.7, "#efe9dc"], [1, "#d9d0bf"]], 0, 0, 1, 0)}"/>`;
    k += `<path d="M${r(tx - tr)} ${r(ty - .13 * s - th * .35)} h${r(2 * tr)} v${r(th * .3)} h${r(-2 * tr)} Z" fill="#5a321a" opacity=".85"/>`;
    k += `<ellipse cx="${r(tx)}" cy="${r(ty - .13 * s - th)}" rx="${r(tr)}" ry="${r(tr * .25)}" fill="#fffdf8"/>`;
    for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2, cx = tx + Math.cos(a) * tr * .65, cy = ty - .13 * s - th + Math.sin(a) * tr * .16; k += `<circle cx="${r(cx)}" cy="${r(cy - .03 * s)}" r="${r(.03 * s)}" fill="#7d0c1f"/>`; }
    for (let i = 0; i < 10; i++) k += `<rect x="${r(tx - tr * .6 + rnd() * tr * 1.2)}" y="${r(ty - .13 * s - th - .02 * s + rnd() * .03 * s)}" width="${r(.03 * s)}" height="${r(.012 * s)}" fill="#3a2010"/>`;
    MS.torte = { x: tx, y: ty - .13 * s };
  }
  /* Preistafel */
  k += `<rect x="${r(x - .4 * s)}" y="${r(y - .72 * s)}" width="${r(.8 * s)}" height="${r(.28 * s)}" fill="#2a2e2a"/><text x="${r(x)}" y="${r(y - .52 * s)}" font-size="${r(.16 * s)}" text-anchor="middle" fill="#f4f0e2" font-family="Comic Sans MS,cursive">Kirschen 6 €</text>`;
  /* großer Marktschirm (orange-weiß) */
  let sch = "";
  const ux = x + .25 * s;
  for (let i = 0; i < 8; i++) { const a = -1.6 + i * .4, b = a + .4; sch += `<path d="M${r(ux)} ${r(y - 2.95 * s)} L${r(ux + a * s)} ${r(y - 2.3 * s)} Q${r(ux + (a + b) / 2 * s)} ${r(y - 2.18 * s)} ${r(ux + b * s)} ${r(y - 2.3 * s)} Z" fill="${i % 2 ? "#f4efe2" : "#e0782a"}"/>`; }
  k += sch + `<path d="M${r(ux - 1.6 * s)} ${r(y - 2.3 * s)} L${r(ux)} ${r(y - 2.95 * s)} L${r(ux + 1.6 * s)} ${r(y - 2.3 * s)}" stroke="#000" stroke-opacity=".12" stroke-width="${r(.05 * s)}" fill="none"/>`;
  S.teil({ id: "marktstand", de: "der Marktstand", syl: "MARKT-stand", it: "la bancarella", itSyl: "ban-ca-REL-la", en: "market stall", x: 0, y: 0, kunst: k,
    tipp: "Die Bauern bringen frisches Obst und Gemüse vom Kaiserstuhl und aus dem Schwarzwald.",
    zoom: { x: r(x - 30), y: r(y - 34), w: 60, h: 40 },
    unter: [
      { id: "spargel", de: "der Spargel", syl: "SPAR-gel", it: "l'asparago", itSyl: "a-SPA-ra-go", en: "asparagus", x: MS.spargel.x, y: MS.spargel.y, kunst: flaeche(-2.2, -3.4, 4.4, 4.6, 0.5),
        tipp: "Im Frühling gibt es in Baden weißen Spargel — er wächst unter der Erde." },
      { id: "kirschtorte", de: "die Schwarzwälder Kirschtorte", syl: "SCHWARZ-wäl-der KIRSCH-tor-te", it: "la torta Foresta Nera", itSyl: "TOR-ta fo-RE-sta NE-ra", en: "Black Forest cake", x: MS.torte.x, y: MS.torte.y, kunst: flaeche(-2.6, -2.4, 5.2, 3.2, 0.5),
        tipp: "Schokoladenbiskuit, Sahne, Kirschen und ein Schuss Kirschwasser — die berühmteste Torte aus dem Schwarzwald." },
    ] });
}

/* =====================================================================
   11 — DER SOUVENIRSTAND (Holzbude: Kuckucksuhren, Bollenhut) — Lupe
   ===================================================================== */
const SV = {};
{
  const f = fuss(54, -62), s = f.s, x = f.x, y = f.y, W = 3 * s, H = 2.5 * s;
  const HOLZ = S.lg("budenholz", [[0, "#7a5230"], [0.5, "#9c6a3e"], [1, "#6e4626"]], 0, 0, 1, 0);
  let k = schatten(x, y, W * .55, .25 * s, .3);
  k += `<rect x="${r(x - W / 2)}" y="${r(y - H)}" width="${r(W)}" height="${r(H)}" fill="${HOLZ}"/>`;
  k += `<rect x="${r(x - W / 2 + .12 * s)}" y="${r(y - H + .35 * s)}" width="${r(W - .24 * s)}" height="${r(1.25 * s)}" fill="#4a3220"/>`;
  /* drei Kuckucksuhren: Chalet-Gehäuse, Zifferblatt, Vogel, Pendel, Tannenzapfen-Gewichte */
  const uhr = (cx, cy, g) => {
    let u = `<path d="M${r(cx - .2 * g)} ${r(cy)} V${r(cy - .3 * g)} L${r(cx)} ${r(cy - .48 * g)} L${r(cx + .2 * g)} ${r(cy - .3 * g)} V${r(cy)} Z" fill="#5a3418"/>`;
    u += `<path d="M${r(cx - .27 * g)} ${r(cy - .27 * g)} L${r(cx)} ${r(cy - .52 * g)} L${r(cx + .27 * g)} ${r(cy - .27 * g)}" stroke="#2f1c0c" stroke-width="${r(.05 * g)}" fill="none"/>`;
    u += `<circle cx="${r(cx)}" cy="${r(cy - .14 * g)}" r="${r(.09 * g)}" fill="#f2ead2"/><path d="M${r(cx)} ${r(cy - .14 * g)} l0 ${r(-.06 * g)} M${r(cx)} ${r(cy - .14 * g)} l${r(.05 * g)} 0" stroke="#1d140c" stroke-width="${r(.015 * g)}"/>`;
    u += `<rect x="${r(cx - .04 * g)}" y="${r(cy - .36 * g)}" width="${r(.08 * g)}" height="${r(.07 * g)}" fill="#1d140c"/><circle cx="${r(cx)}" cy="${r(cy - .335 * g)}" r="${r(.02 * g)}" fill="#d8a832"/>`;
    u += `<path d="M${r(cx - .2 * g)} ${r(cy - .03 * g)} q${r(.05 * g)} ${r(-.06 * g)} ${r(.1 * g)} 0 q${r(.05 * g)} ${r(-.06 * g)} ${r(.1 * g)} 0" stroke="#3f7a3a" stroke-width="${r(.025 * g)}" fill="none"/>`;
    u += `<path d="M${r(cx)} ${r(cy)} V${r(cy + .26 * g)}" stroke="#c9a227" stroke-width="${r(.015 * g)}"/><circle cx="${r(cx)}" cy="${r(cy + .27 * g)}" r="${r(.035 * g)}" fill="#c9a227"/>`;
    for (const d of [-.08, .08]) u += `<path d="M${r(cx + d * g)} ${r(cy)} V${r(cy + .18 * g)}" stroke="#8a8a8a" stroke-width="${r(.01 * g)}"/><ellipse cx="${r(cx + d * g)}" cy="${r(cy + .22 * g)}" rx="${r(.03 * g)}" ry="${r(.06 * g)}" fill="#5a3418"/>`;
    return u;
  };
  k += uhr(x - .85 * s, y - 1.35 * s, s * 1.1) + uhr(x, y - 1.4 * s, s * 1.35) + uhr(x + .85 * s, y - 1.3 * s, s);
  SV.uhr = { x: x, y: y - 1.5 * s };
  /* Theke mit Bollenhut auf dem Hutständer */
  k += `<rect x="${r(x - W / 2 - .1 * s)}" y="${r(y - .95 * s)}" width="${r(W + .2 * s)}" height="${r(.12 * s)}" fill="#c99a62"/><rect x="${r(x - W / 2)}" y="${r(y - .83 * s)}" width="${r(W)}" height="${r(.83 * s)}" fill="${HOLZ}"/>`;
  for (let i = 0; i < 6; i++) k += `<path d="M${r(x - W / 2 + (i + .5) * W / 6)} ${r(y - .8 * s)} V${r(y)}" stroke="#4a3220" stroke-width="${r(.03 * s)}"/>`;
  {
    /* der Bollenhut auf einem Hutkopf: breite weiße Krempe, darauf 14 rote Wollbollen (von vorn sieht man elf) */
    const bx = x - .95 * s, by = y - .95 * s, g = s * 1.35;
    k += `<path d="M${r(bx - .05 * g)} ${r(by)} v${r(-.18 * g)} h${r(.1 * g)} v${r(.18 * g)} Z" fill="#7a5230"/><ellipse cx="${r(bx)}" cy="${r(by - .24 * g)}" rx="${r(.08 * g)}" ry="${r(.1 * g)}" fill="#c99a62"/>`;
    k += `<ellipse cx="${r(bx)}" cy="${r(by - .3 * g)}" rx="${r(.3 * g)}" ry="${r(.075 * g)}" fill="${S.lg("krempe", [[0, "#ffffff"], [1, "#dcd6ca"]])}" stroke="#bdb6a6" stroke-width="${r(.01 * g)}"/>`;
    k += `<path d="M${r(bx - .07 * g)} ${r(by - .28 * g)} q-${r(.02 * g)} ${r(.14 * g)} ${r(.02 * g)} ${r(.22 * g)} M${r(bx + .07 * g)} ${r(by - .28 * g)} q${r(.02 * g)} ${r(.14 * g)} -${r(.02 * g)} ${r(.22 * g)}" stroke="#1d1d1d" stroke-width="${r(.018 * g)}" fill="none"/>`;
    const BO = S.rg("bolle", [[0, "#ff6a5a"], [0.6, "#d42a24"], [1, "#9a1414"]], 0.38, 0.32, 0.72);
    for (const [dx, dy, rr] of [[-.17, -.355, .045], [0, -.37, .047], [.17, -.355, .045], [-.085, -.335, .05], [.085, -.335, .05], [-.21, -.318, .042], [.21, -.318, .042], [0, -.318, .052], [-.1, -.4, .045], [.1, -.4, .045], [0, -.43, .045]]) k += `<circle cx="${r(bx + dx * g)}" cy="${r(by + dy * g)}" r="${r(rr * g)}" fill="${BO}"/>`;
    SV.hut = { x: bx, y: by - .36 * g };
  }
  /* Holzspielzeug auf der Theke */
  k += `<rect x="${r(x + .7 * s)}" y="${r(y - 1.12 * s)}" width="${r(.3 * s)}" height="${r(.17 * s)}" fill="#c8382c"/><rect x="${r(x + 1.05 * s)}" y="${r(y - 1.08 * s)}" width="${r(.24 * s)}" height="${r(.13 * s)}" fill="#3f7a4a"/><circle cx="${r(x + .45 * s)}" cy="${r(y - 1.02 * s)}" r="${r(.07 * s)}" fill="#d8a832"/>`;
  /* Dach: grün-weiß gestreift, Schild */
  k += `<path d="M${r(x - W / 2 - .25 * s)} ${r(y - H)} L${r(x)} ${r(y - H - .6 * s)} L${r(x + W / 2 + .25 * s)} ${r(y - H)} Z" fill="#2f6e44"/>`;
  for (let i = 0; i < 6; i++) k += `<path d="M${r(x - W / 2 - .25 * s + i * (W + .5 * s) / 6)} ${r(y - H)} h${r((W + .5 * s) / 12)} v${r(.22 * s)} h${r(-(W + .5 * s) / 12)} Z" fill="#f4efe2"/>`;
  k += `<rect x="${r(x - W / 2 - .25 * s)}" y="${r(y - H)}" width="${r(W + .5 * s)}" height="${r(.22 * s)}" fill="none" stroke="#2f6e44" stroke-width="${r(.03 * s)}"/>`;
  k += `<text x="${r(x)}" y="${r(y - H - .12 * s)}" font-size="${r(.24 * s)}" text-anchor="middle" fill="#f4efe2" font-family="Georgia,serif" font-weight="bold">Schwarzwald</text>`;
  S.teil({ id: "souvenirstand", de: "der Souvenirstand", syl: "su-ve-NIR-stand", it: "la bancarella di souvenir", itSyl: "ban-ca-REL-la di su-ve-NIR", en: "souvenir stall", x: 0, y: 0, kunst: k,
    tipp: "Hier gibt es Andenken aus dem Schwarzwald.",
    zoom: { x: r(x - 30), y: r(y - H - 14), w: 60, h: 40 },
    unter: [
      { id: "kuckucksuhr", de: "die Kuckucksuhr", syl: "KU-ckucks-uhr", it: "l'orologio a cucù", itSyl: "o-ro-LO-gio a cu-CÙ", en: "cuckoo clock", x: SV.uhr.x, y: SV.uhr.y, kunst: flaeche(-12, -6, 24, 13),
        tipp: "Jede volle Stunde springt ein kleiner Vogel heraus und ruft „Kuckuck“. Die Uhr läuft mit Gewichten wie Tannenzapfen." },
      { id: "bollenhut", de: "der Bollenhut", syl: "BOL-len-hut", it: "il cappello a pompon", itSyl: "cap-PEL-lo a pom-PON", en: "pompom hat (Bollenhut)", x: SV.hut.x, y: SV.hut.y, kunst: flaeche(-4.6, -3.2, 9.2, 4.6, 0.6),
        tipp: "Der Bollenhut gehört zur Tracht im Schwarzwald. Rote Bollen tragen unverheiratete Frauen." },
    ] });
}

/* =====================================================================
   12 — DER WURSTSTAND („Lange Rote“) mit 13 — DEM VERKÄUFER
   ===================================================================== */
const WS = fuss(50, -54);
{
  const { x, y, s } = WS, W = 3.2 * s, H = 2.7 * s;
  let k = schatten(x, y, W * .55, .28 * s, .3);
  /* Bude: Rückwand, Seitenteile, Dach mit rot-weißer Markise */
  k += `<rect x="${r(x - W / 2)}" y="${r(y - H)}" width="${r(W)}" height="${r(H)}" fill="#f2efe8"/><rect x="${r(x - W / 2 + .1 * s)}" y="${r(y - H + .5 * s)}" width="${r(W - .2 * s)}" height="${r(1.2 * s)}" fill="#3a3430"/>`;
  k += `<rect x="${r(x - W / 2 - .2 * s)}" y="${r(y - H - .15 * s)}" width="${r(W + .4 * s)}" height="${r(.5 * s)}" fill="#c8202a"/>`;
  k += `<text x="${r(x)}" y="${r(y - H + .2 * s)}" font-size="${r(.34 * s)}" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-weight="bold" letter-spacing=".1">LANGE ROTE</text>`;
  for (let i = 0; i < 8; i++) k += `<path d="M${r(x - W / 2 - .2 * s + i * (W + .4 * s) / 8)} ${r(y - H + .35 * s)} h${r((W + .4 * s) / 8)} l${r(-.5 * (W + .4 * s) / 8)} ${r(.3 * s)} Z" fill="${i % 2 ? "#c8202a" : "#fff"}"/>`;
  /* Rauch vom Grill */
  k += `<path d="M${r(x - .6 * s)} ${r(y - 1.4 * s)} q${r(-.3 * s)} ${r(-.5 * s)} 0 ${r(-1 * s)} q${r(.3 * s)} ${r(-.5 * s)} 0 ${r(-1 * s)}" stroke="#fff" stroke-width="${r(.25 * s)}" opacity=".35" fill="none" stroke-linecap="round"/>`;
  WS.k = k;
}
{
  const { x, y, s } = WS, tz = 1.05;
  const m = B.mensch({ id: "fbg_wurst", geschlecht: "m", pose: "servieren", blick: 14, frisur: "kurz", haarfarbe: "dunkelbraun", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "tshirt", farbe: "weiss" }, schuerze: { stueck: "schuerze", farbe: "rot" }, unterteil: { stueck: "hose", farbe: "schwarz" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" }, kopf: { stueck: "kappe", farbe: "rot" } } }, 1.76 * s);
  S.def(`<clipPath id="${S.id("theke")}"><rect x="-40" y="-60" width="80" height="${r(60 - tz * s - .2)}"/></clipPath>`);
  /* Bude hinten, dann der Verkäufer, dann Grill und Theke davor */
  S.teil({ id: "wurststand", de: "der Wurststand", syl: "WURST-stand", it: "il chiosco delle salsicce", itSyl: "CHIO-sco del-le sal-SIC-ce", en: "sausage stand", x: 0, y: 0, kunst: WS.k + (() => {
      let g = `<rect x="${r(x - 1.7 * s)}" y="${r(y - tz * s)}" width="${r(3.4 * s)}" height="${r(tz * s)}" fill="${S.lg("theke", [[0, "#e9e6de"], [1, "#c9c4b8"]])}"/>`;
      g += `<rect x="${r(x - 1.75 * s)}" y="${r(y - tz * s - .08 * s)}" width="${r(3.5 * s)}" height="${r(.1 * s)}" fill="#9aa3aa"/>`;
      /* Grillrost mit Langen Roten, Zwiebeln in der Pfanne, Brötchenkorb, Senf */
      g += `<rect x="${r(x - 1.5 * s)}" y="${r(y - tz * s - .18 * s)}" width="${r(1.6 * s)}" height="${r(.12 * s)}" fill="#2a2a2a"/>`;
      for (let i = 0; i < 5; i++) g += `<rect x="${r(x - 1.45 * s + (i % 2) * .08 * s)}" y="${r(y - tz * s - .26 * s - i * .028 * s)}" width="${r(1.5 * s)}" height="${r(.05 * s)}" rx="${r(.025 * s)}" fill="${i % 2 ? "#b8402a" : "#a8341f"}"/>`;
      g += `<ellipse cx="${r(x + .45 * s)}" cy="${r(y - tz * s - .1 * s)}" rx="${r(.32 * s)}" ry="${r(.08 * s)}" fill="#3a3a3a"/><ellipse cx="${r(x + .45 * s)}" cy="${r(y - tz * s - .13 * s)}" rx="${r(.26 * s)}" ry="${r(.05 * s)}" fill="#c8963a"/>`;
      g += `<path d="M${r(x + .9 * s)} ${r(y - tz * s)} l${r(.05 * s)} ${r(-.2 * s)} h${r(.5 * s)} l${r(.05 * s)} ${r(.2 * s)} Z" fill="#b88a50"/>`;
      for (let i = 0; i < 4; i++) g += `<ellipse cx="${r(x + 1.03 * s + i * .12 * s)}" cy="${r(y - tz * s - .22 * s)}" rx="${r(.07 * s)}" ry="${r(.045 * s)}" fill="#e8b866"/>`;
      g += `<rect x="${r(x + 1.55 * s)}" y="${r(y - tz * s - .32 * s)}" width="${r(.08 * s)}" height="${r(.3 * s)}" fill="#e8c23a"/>`;
      g += `<text x="${r(x)}" y="${r(y - tz * s * .45)}" font-size="${r(.24 * s)}" text-anchor="middle" fill="#c8202a" font-family="Arial,sans-serif" font-weight="bold">mit Zwiebeln</text>`;
      return g;
    })(), tipp: "Die „Lange Rote“ ist 35 Zentimeter lang — viel länger als das Brötchen. Man fragt: „Mit oder ohne Zwiebeln?“" });
  S.teil({ id: "verkaeufer", de: "der Verkäufer", syl: "ver-KÄU-fer", it: "il venditore", itSyl: "ven-di-TO-re", en: "vendor", x: x + .3 * s, y: y - .1 * s, kunst: `<g clip-path="url(#${S.id("theke")})">${rundeFigur(m.svg)}</g>`,
    tipp: "Der Verkäufer legt die Wurst ins Brötchen und gibt Senf dazu." });
}

/* =====================================================================
   14 — DER MANN mit 15 — DER LANGEN ROTEN im Brötchen
   ===================================================================== */
{
  const f = fuss(54.4, -46.4), s = f.s;
  const m = B.mensch({ id: "fbg_mann", geschlecht: "m", pose: "halten", blick: 22, frisur: "kurz", haarfarbe: "blond", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "tshirt", farbe: "blau" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" }, zubehoer: { stueck: "rucksack", farbe: "gruen_d" } } }, 1.8 * s);
  S.teil({ id: "mann", de: "der Mann", syl: "MANN", it: "l'uomo", itSyl: "UO-mo", en: "man", x: f.x, y: f.y, kunst: rundeFigur(m.svg),
    tipp: "Er hat sich eine Lange Rote gekauft und isst sie gleich auf dem Platz." });
  const hl = m.z.handL, hr = m.z.handR, hx = (hl.x + hr.x) / 2 * m.k, hy = Math.min(hl.y, hr.y) * m.k;
  /* die Wurst: 35 cm, ragt links und rechts weit aus dem Brötchen (etwas vergrößert) */
  const L = .35 * s * 1.5, b = .16 * s * 1.5;
  let k = `<g transform="rotate(-6)">`;
  k += `<rect x="${r(-L / 2)}" y="${r(-.045 * s * 1.5)}" width="${r(L)}" height="${r(.05 * s * 1.6)}" rx="${r(.025 * s * 1.6)}" fill="${S.lg("wurst", [[0, "#d0502e"], [1, "#9a2a18"]])}"/>`;
  k += `<path d="M${r(-b / 2)} ${r(.03 * s)} Q${r(-b / 2)} ${r(-.08 * s)} 0 ${r(-.09 * s)} Q${r(b / 2)} ${r(-.08 * s)} ${r(b / 2)} ${r(.03 * s)} Z" fill="#e2a25a"/><path d="M${r(-b / 2)} ${r(.03 * s)} h${r(b)}" stroke="#b8763a" stroke-width="${r(.015 * s)}"/>`;
  k += `<path d="M${r(-b * .4)} ${r(-.03 * s)} q${r(b * .2)} ${r(-.03 * s)} ${r(b * .4)} 0 q${r(b * .2)} ${r(-.03 * s)} ${r(b * .4)} 0" stroke="#e8c23a" stroke-width="${r(.012 * s)}" fill="none"/>`;
  k += `<ellipse cx="${r(-b * .1)}" cy="${r(-.06 * s)}" rx="${r(.04 * s)}" ry="${r(.015 * s)}" fill="#c8963a"/></g>`;
  S.teil({ oben: true, id: "lange_rote", de: "die Lange Rote", syl: "LAN-ge RO-te", it: "la Lange Rote (salsiccia)", itSyl: "sal-SIC-cia", en: "Lange Rote (long sausage)", x: f.x + hx, y: f.y + hy - .02 * s, kunst: k + flaeche(-L / 2 - .5, -1.6, L + 1, 2.6, 0.4),
    tipp: "Die Lange Rote ist das „knackigste Wahrzeichen“ von Freiburg." });
}

/* =====================================================================
   16 — DAS FAHRRAD (Hollandrad mit Korb, vorn links am Bächle)
   ===================================================================== */
{
  const f = fuss(61.4, -53.4), s = f.s, R = .34 * s;
  const Rad = S.lg("rahmen", [[0, "#2f6e5a"], [1, "#1f4f40"]]);
  const hx = -.55 * s, vx = .55 * s, ay = -R;
  let k = schatten(0, .2, .9 * s, .06 * s, .3);
  for (const cx of [hx, vx]) {
    k += `<circle cx="${r(cx)}" cy="${r(ay)}" r="${r(R)}" fill="none" stroke="#1d1d1d" stroke-width="${r(.05 * s)}"/><circle cx="${r(cx)}" cy="${r(ay)}" r="${r(R * .9)}" fill="none" stroke="#b9bec2" stroke-width="${r(.012 * s)}"/>`;
    for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; k += `<line x1="${r(cx)}" y1="${r(ay)}" x2="${r(cx + Math.cos(a) * R * .9)}" y2="${r(ay + Math.sin(a) * R * .9)}" stroke="#c9cdd0" stroke-width="${r(.006 * s)}"/>`; }
    k += `<path d="M${r(cx - R * 1.05)} ${r(ay + .02 * s)} A${r(R * 1.05)} ${r(R * 1.05)} 0 0 1 ${r(cx + R * .8)} ${r(ay - R * .6)}" stroke="#1f4f40" stroke-width="${r(.035 * s)}" fill="none"/>`;
  }
  /* Tiefeinsteiger-Rahmen */
  const tr = [-.1 * s, -.48 * s], st = [-.22 * s, -.9 * s], lk = [.42 * s, -.98 * s];
  k += `<path d="M${r(hx)} ${r(ay)} L${r(tr[0])} ${r(tr[1])} L${r(st[0])} ${r(st[1])} M${r(tr[0])} ${r(tr[1])} Q${r(.15 * s)} ${r(-.5 * s)} ${r(lk[0])} ${r(lk[1])} L${r(vx)} ${r(ay)} M${r(hx)} ${r(ay)} L${r(st[0] + .03 * s)} ${r(st[1] + .15 * s)}" stroke="${Rad}" stroke-width="${r(.05 * s)}" fill="none" stroke-linecap="round"/>`;
  k += `<path d="M${r(st[0] - .12 * s)} ${r(st[1] - .03 * s)} h${r(.24 * s)}" stroke="#5a3a20" stroke-width="${r(.06 * s)}" stroke-linecap="round"/>`;
  k += `<path d="M${r(lk[0])} ${r(lk[1])} l${r(-.06 * s)} ${r(-.12 * s)} q${r(-.2 * s)} ${r(-.05 * s)} ${r(-.22 * s)} ${r(.06 * s)}" stroke="#2a2a2a" stroke-width="${r(.03 * s)}" fill="none"/>`;
  /* Korb vorn mit Blumen vom Markt */
  k += `<path d="M${r(lk[0] + .02 * s)} ${r(lk[1] + .06 * s)} h${r(.34 * s)} l${r(-.04 * s)} ${r(.25 * s)} h${r(-.26 * s)} Z" fill="#b8874a"/>`;
  for (let i = 0; i < 4; i++) k += `<path d="M${r(lk[0] + .08 * s + i * .07 * s)} ${r(lk[1] + .06 * s)} v${r(.25 * s)}" stroke="#8a5a2a" stroke-width="${r(.008 * s)}"/>`;
  for (const [dx, c] of [[.1, "#e8c23a"], [.18, "#d84a6a"], [.26, "#f4efe2"]]) k += `<circle cx="${r(lk[0] + dx * s)}" cy="${r(lk[1] + .02 * s)}" r="${r(.045 * s)}" fill="${c}"/>`;
  k += `<path d="M${r(lk[0] + .1 * s)} ${r(lk[1] + .04 * s)} l${r(-.04 * s)} ${r(-.1 * s)}" stroke="#3f7a3a" stroke-width="${r(.015 * s)}"/>`;
  /* Ständer, Licht, Gepäckträger */
  k += `<path d="M${r(-.15 * s)} ${r(-.4 * s)} l${r(-.12 * s)} ${r(.4 * s)}" stroke="#555" stroke-width="${r(.02 * s)}"/><circle cx="${r(vx + .1 * s)}" cy="${r(-.62 * s)}" r="${r(.035 * s)}" fill="#f4efe2" stroke="#555" stroke-width="${r(.008 * s)}"/>`;
  k += `<path d="M${r(hx - .1 * s)} ${r(-.78 * s)} h${r(.4 * s)}" stroke="#2a2a2a" stroke-width="${r(.025 * s)}"/>`;
  S.teil({ id: "fahrrad", de: "das Fahrrad", syl: "FAHR-rad", it: "la bicicletta", itSyl: "bi-ci-CLET-ta", en: "bicycle", x: f.x, y: f.y, steht: true, kunst: k,
    tipp: "Freiburg ist Fahrradstadt und Solarstadt: Viele fahren Rad, und auf vielen Dächern liegen Solarzellen." });
}

/* =====================================================================
   17 — DIE KUNDIN (geht mit ihrer Einkaufstasche zum Markt, vorn rechts)
   ===================================================================== */
{
  const f = fuss(57.8, -42.2), s = f.s;
  const m = B.mensch({ id: "fbg_kundin", geschlecht: "w", pose: "gehen", blick: 158, frisur: "zopf", haarfarbe: "hellbraun", haut: "hell",
    kleidung: { oberteil: { stueck: "bluse", farbe: "hellblau" }, unterteil: { stueck: "rock_knie", farbe: "beige" }, schuhe: { stueck: "sandale", farbe: "braun" }, zubehoer: { stueck: "tasche", farbe: "braun" } } }, 1.68 * s);
  S.teil({ id: "kundin", de: "die Kundin", syl: "KUN-din", it: "la cliente", itSyl: "cli-EN-te", en: "customer", x: f.x, y: f.y, kunst: schatten(0, 0, .35 * s, .07 * s, .28) + rundeFigur(m.svg),
    tipp: "Sie kauft auf dem Markt ein: Spargel, Kirschen und frisches Brot." });
}

/* Licht über allem: Mittagssonne von links (Süden), leichte Vignette (fängt keinen Tipp ab) */
S.davor(`<rect width="320" height="240" fill="${S.rg("sonne", [[0, "#fff4d6", 0.2], [0.55, "#fff4d6", 0.05], [1, "#fff4d6", 0]], 0, 0.1, 0.9)}"/><rect width="320" height="240" fill="${S.rg("vignette", [[0, "#000", 0], [0.72, "#000", 0], [1, "#1a1008", 0.2]], 0.5, 0.5, 0.75)}"/>`);

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/freiburg.js"));
console.log(aus);
