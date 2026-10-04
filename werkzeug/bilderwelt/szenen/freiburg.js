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
     (Norden) das MÜNSTER: vorn das südliche Querhaus mit der Vorhalle (Chor
     und Hahnentürme liegen rechts außerhalb), dahinter das Langhaus, ganz
     hinten im Westen der Turm. So steht der
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
   Jahreszeit: Juni, Vormittag (Kirschen, Spargel), Sonne aus Ostsüdost (115°, 40° hoch).
   Maßstab: echte Kamera (Augenhöhe 1,6 m, y = 190 ist der Horizont; Bild 320 × 240,
   damit der 116 m hohe Turm ganz hineinpasst).
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "freiburg", titel: "Freiburg im Breisgau", emoji: "🌲", thema: "Deutschland", kuerzel: "fbg", fassung: 854, breite: 320, hoehe: 240 });
const rnd = zufall(1120);
/* gleiche Verlaufsnamen nur einmal anlegen (doppelte ids schalten Verläufe stumm) */
{ const L = S.lg, R = S.rg, C = {}; S.lg = (n, ...a) => C["l" + n] || (C["l" + n] = L(n, ...a)); S.rg = (n, ...a) => C["r" + n] || (C["r" + n] = R(n, ...a)); }
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
const rundeFigur = (svg, unten, fein) => {
  const k = +((svg.match(/scale\(([\d.]+)\)/) || [0, 1])[1]), lim = .1 / k;
  /* hinter einer Theke: Teile, die ganz unterhalb der Kante (Bildeinheiten, relativ zum Fuß) liegen, sieht niemand */
  if (unten != null) {
    const yc = unten / k + 8;
    svg = svg.replace(/<path[^>]* d="([MLQCSZ\d\s.,-]*)"[^>]*\/>/g, (m, d) => { const n = d.match(/-?[\d.]+/g) || []; for (let i = 1; i < n.length; i += 2) if (+n[i] < yc) return m; return ""; })
      .replace(/<ellipse[^>]* cy="(-?[\d.]+)"[^>]* ry="([\d.]+)"[^>]*\/>/g, (m, cy, ry) => (+cy - +ry > yc ? "" : m));
  }
  /* Haarsträhnen, Brauen und Nähte, die im Bild dünner als ein Viertelpixel wären, fallen weg */
  return svg.replace(/<path(?=[^>]*fill="none")[^>]*stroke-width="([\d.]+)"[^>]*\/>/g, (m, w) => (+w < lim ? "" : m))
    .replace(/ d="([^"]*)"/g, (m, d) => ` d="${d.replace(/-?\d+\.\d+/g, (n) => String(fein ? Math.round(+n * 2) / 2 : Math.round(+n)))}"`)
    .replace(/<(\w+)[^>]*>/g, (tag, n) => (/Gradient$/.test(n) && !/userSpaceOnUse/.test(tag) ? tag
      : tag.replace(/ (x1|y1|x2|y2|cx|cy|r|rx|ry|fx|fy)="(-?[\d.]+)"/g, (m, a, v) => ` ${a}="${Math.abs(+v) < 3 ? Math.round(+v * 10) / 10 : Math.round(+v * 2) / 2}"`)))
    /* Fingernägel und Knöchel (winzige Ellipsen an den Händen) sieht man in dieser Größe nicht */
    .replace(/<ellipse(?=[^>]*stroke-width="0\.07")(?=[^>]*opacity="\.85")[^>]*\/>/g, "");
};
/* Maßstab (Einheiten je Meter) und Fußpunkt eines Dings am Boden */
const fuss = (x, y) => { const p = pr(x, y, 0); return { x: p[0], y: p[1], s: FOC / tief(x, y) }; };
const SCH = [-0.906 * 1.19, 0.423 * 1.19];
const schlag = (x, y, w, h, op = .3) => `<path d="${poly([[x + w / 2, y, 0], [x - w / 2, y, 0], [x - w / 2 + SCH[0] * h, y + SCH[1] * h, 0], [x + w / 2 + SCH[0] * h, y + SCH[1] * h, 0]])}" fill="#2a1e14" opacity="${op}"/>`;

/* EINE Sonne für alles: Vormittag im Juni, aus Ostsüdost (Azimut 115°), 40° hoch. Im Bild kommt das Licht
   von links (etwas von hinten); Schlagschatten fallen nach rechts in die Tiefe (Westnordwest). */
const SONNE = [Math.sin(115 * Math.PI / 180), Math.cos(115 * Math.PI / 180)];
const hex3 = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mische = (a, b, t) => { const A = hex3(a), Bb = hex3(b); return "#" + A.map((v, i) => Math.round(v + (Bb[i] - v) * t).toString(16).padStart(2, "0")).join(""); };
/* Farbe einer senkrechten Fläche mit Außennormale (nx, ny): im Licht wärmer und heller, abgewandt kühler und dunkler */
const licht = (f, nx, ny) => { const l = nx * SONNE[0] + ny * SONNE[1]; return l > 0 ? mische(f, "#ffc49a", l * .42) : mische(f, "#2a1822", -l * .42 + .14); };
/* senkrechtes Prisma (Grundriss gegen den Uhrzeigersinn, von oben) z0…z1: nur die sichtbaren Seiten, hinten zuerst */
const prisma = (plan, z0, z1, f) => {
  const seiten = [];
  for (let i = 0; i < plan.length; i++) {
    const a = plan[i], b = plan[(i + 1) % plan.length], nx = b[1] - a[1], ny = a[0] - b[0], L = Math.hypot(nx, ny) || 1;
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
    if ((CAM[0] - mx) * nx + (CAM[1] - my) * ny <= 0) continue;
    seiten.push([tief(mx, my), `<path d="${poly([[a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]])}" fill="${licht(f, nx / L, ny / L)}"/>`]);
  }
  return seiten.sort((u, v) => v[0] - u[0]).map((u) => u[1]).join("");
};
/* Schlagschatten eines Körpers: seine Punkte (x, y, z) auf den Boden geworfen, als Umriss (konvexe Hülle) */
const wurf = (pts, op = .28) => {
  const q = pts.map(([x, y, z]) => [x + SCH[0] * z, y + SCH[1] * z]).concat(pts.map(([x, y]) => [x, y]));
  q.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const kr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], hi = [];
  for (const p of q) { while (lo.length > 1 && kr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
  for (const p of q.slice().reverse()) { while (hi.length > 1 && kr(hi[hi.length - 2], hi[hi.length - 1], p) <= 0) hi.pop(); hi.push(p); }
  const h = lo.slice(0, -1).concat(hi.slice(0, -1));
  return `<path d="${poly(h.map(([x, y]) => [x, y, 0]))}" fill="#2a1e14" opacity="${op}"/>`;
};

S.def(`<filter color-interpolation-filters="sRGB" id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
/* roter Buntsandstein des Münsters */
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
  /* Schönwetterwolken (Cumulus), klar gezeichnet: flacher Boden im Schatten, Quellköpfe oben im Licht von links */
  for (const [x, y, s] of [[60, 22, 1.1], [150, 38, 0.8], [200, 14, 0.9], [112, 72, 0.6], [178, 128, 1.2], [116, 148, 0.85], [228, 152, 0.75]]) {
    const K = [[0, -3.2, 6.2], [-8, -.8, 4.6], [8.5, -1.2, 5], [-14, 1.2, 3], [14.5, 1, 3.2], [-3.5, -5.5, 4.2], [4.5, -5, 3.6]];
    const kreis = (dx, dy, rr) => `M${r(x + (dx - rr) * s)} ${r(y + dy * s)}a${r(rr * s)} ${r(rr * s)} 0 1 0 ${r(2 * rr * s)} 0a${r(rr * s)} ${r(rr * s)} 0 1 0 ${r(-2 * rr * s)} 0`;
    const basis = `M${r(x - 17 * s)} ${r(y + 3.6 * s)}H${r(x + 17.5 * s)}a${r(1.5 * s)} ${r(1.2 * s)} 0 0 0 0 ${r(-2.4 * s)}H${r(x - 17 * s)}a${r(1.5 * s)} ${r(1.2 * s)} 0 0 0 0 ${r(2.4 * s)}`;
    w += `<path d="${K.map(([a, b, c]) => kreis(a, b + .9, c)).join("")}${basis}" fill="#c9d5e3"/>`;
    w += `<path d="${K.map(([a, b, c]) => kreis(a - .6, b - .4, c * .92)).join("")}" fill="#fbfcfd"/>`;
    w += `<path d="${K.slice(0, 3).map(([a, b, c]) => kreis(a - 1.6, b - 1.4, c * .55)).join("")}" fill="#fff"/>`;
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
   1 — DER MÜNSTERPLATZ (Rheinkiesel in Reihen, Granitbänder, die Häuser ringsum)
   ===================================================================== */
{
  /* Kieselpflaster: Kiesel liegen in Reihen. Ein Kiesel (≈ 7 cm) ist im Bild umso größer und umso weniger
     verkürzt, je weiter unten er liegt (d = Abstand unter dem Horizont): rx ≈ .044·d, ry ≈ rx·d/FOC.
     Fünf Muster in Stufen, weich ineinander geblendet — so werden die Kiesel nach hinten stufenlos kleiner. */
  const FARB = ["#b9ab97", "#a39582", "#cfc2ae", "#8f8270", "#c4b49c", "#9c8f80", "#d8ccb8"];
  /* Kacheln ohne eigenen Grund (der liegt einmal darunter) und mit Kieseln, die über alle vier Ränder
     weiterlaufen — so entstehen keine Nähte zwischen den Kacheln */
  const stufe = (i, d) => {
    const rx = .044 * d, ry = Math.max(.14, rx * d / FOC), n = 5, w = rx * 2.25 * n, Z = 6, h = ry * 2.5 * Z;
    let m = "";
    for (let z = 0; z < Z; z++) for (let j = 0; j < n; j++) {
      const x = (j + (z * .618) % 1 + (rnd() - .5) * .35) * w / n, y = (z + .5) * h / Z + (rnd() - .5) * ry * .7, ax = rx * (.7 + rnd() * .45), ay = ry * (.75 + rnd() * .45), f = FARB[Math.floor(rnd() * FARB.length)];
      for (const dx of [0, w, -w]) for (const dy of [0, h, -h]) {
        if ((dx && (x + dx < -ax || x + dx > w + ax)) || (dy && (y + dy < -ay * 1.3 || y + dy > h + ay * 1.3))) continue;
        m += `${d < 20 ? "" : `<ellipse cx="${r(x + dx)}" cy="${r(y + dy + ay * .25)}" rx="${r(ax)}" ry="${r(ay)}" fill="#5e5346" opacity=".5"/>`}<ellipse cx="${r(x + dx)}" cy="${r(y + dy)}" rx="${r(ax)}" ry="${r(ay)}" fill="${f}"/>`;
      }
    }
    S.def(`<pattern id="${S.id("kies" + i)}" width="${r(w)}" height="${r(h)}" patternUnits="userSpaceOnUse">${m}</pattern>`);
  };
  /* in der Ferne (über ≈ 60 m) keine einzelnen Kiesel mehr, nur feines Farbrauschen in ganzen Zeilen */
  const D = [12, 22, 40];
  D.forEach((d, i) => stufe(i, d));
  const boden = `M0 ${HOR - 4} H320 V240 H0 Z`;
  let k = `<path d="${boden}" fill="${S.lg("bodengrund", [[0, "#a49884"], [.1, "#8e8270"], [1, "#7d705f"]])}"/>`;
  const rau = FARB.map(() => "");
  for (let y = HOR - 3.6; y < HOR + 14; y += .45 + rnd() * .5) rau[Math.floor(rnd() * FARB.length)] += `M0 ${r(y)}H320`;
  rau.forEach((d, i) => { if (d) k += `<path d="${d}" stroke="${FARB[i]}" stroke-width=".3" opacity=".4"/>`; });
  for (let i = 0; i < D.length; i++) {
    const a = HOR + D[i] * .55, b = HOR + D[i] * .95;
    S.def(`<linearGradient id="${S.id("mk" + i)}" gradientUnits="userSpaceOnUse" x1="0" y1="${r(a)}" x2="0" y2="${r(b)}"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient><mask id="${S.id("m" + i)}"><rect width="320" height="240" fill="url(#${S.id("mk" + i)})"/></mask>`);
    k += `<path d="M0 ${r(a)} H320 V240 H0 Z" fill="url(#${S.id("kies" + i)})" mask="url(#${S.id("m" + i)})"/>`;
  }
  k += `<path d="${boden}" fill="${S.lg("bodenluft", [[0, "#e8e2d6", 0.55], [0.12, "#e8e2d6", 0.15], [0.5, "#fff3d8", 0], [1, "#3a2a1a", 0.12]])}"/>`;
  /* Granitbänder im Pflaster (gliedern den Platz in Felder) */
  let gb = "";
  for (const yb of [-62.5, -41.5]) gb += `<path d="${poly([[yb < -50 ? 56 : 50, yb - .2, 0], [-96, yb - .2, 0], [-96, yb + .2, 0], [yb < -50 ? 56 : 50, yb + .2, 0]])}"/>`;
  for (const xb of [37, 17, -3, -23, -43, -63]) gb += `<path d="${poly([[xb - .2, -78, 0], [xb + .2, -78, 0], [xb + .2, -22, 0], [xb - .2, -22, 0]])}"/>`;
  k += `<g fill="#c2bcb0" opacity=".85">${gb}</g>`;
  /* Schatten der Südzeile: Vormittagssonne aus Ostsüdost, 40° hoch — nur etwa 7 m breit, nach Westen verschoben */
  k += `<path d="${poly([[70, KYS, 0], [-96, KYS, 0], [-96 + SCH[0] * 14, KYS + SCH[1] * 14, 0], [70 + SCH[0] * 14, KYS + SCH[1] * 14, 0]])}" fill="#2a2018" opacity=".2"/>`;

  /* Westende des Platzes (Ebene x = −96, die Fassaden schauen zu uns): bis hinter den Turmfuß geschlossen.
     Jedes Haus mit Ladenzone, Fensterläden, eigener Traufe oder Giebel */
  const wq = (y0, z0, y1, z1, X = -96) => poly([[X, y0, z0], [X, y1, z0], [X, y1, z1], [X, y0, z1]]);
  const WEST = [[-80, -69, 15, "#e8d7b0", "t", "#4f6a4a"], [-69, -60, 13, "#d9b8a8", "g", "#6a4a3a"], [-60, -48, 16, "#efe4cc", "t", "#5a6a7a"], [-48, -39, 14, "#e2c290", "g", null], [-39, -27, 17, "#d8cdbd", "t", "#4f6a4a"], [-27, -17, 14, "#f0dcc0", "g", "#7a3a2a"], [-17, 4, 16, "#e6d2b6", "t", null]];
  for (const [y0, y1, h, f, art, laden] of WEST) {
    k += `<path d="${wq(y0, 0, y1, h)}" fill="${f}"/><path d="${wq(y0, 0, y1, h)}" fill="#3a2a1a" opacity=".08"/>`;
    const ym = (y0 + y1) / 2;
    if (art === "g") {
      k += `<path d="${poly([[-96, y0, h], [-96, y1, h], [-96, ym, h + 7.5]])}" fill="${f}"/><path d="${poly([[-96, y0 - .3, h - .2], [-96, ym, h + 7.8], [-96, y1 + .3, h - .2], [-96, y1 + .3, h + .3], [-96, ym, h + 8.3], [-96, y0 - .3, h + .3]])}" fill="#8a5446"/>`;
      k += `<path d="${wq(ym - .5, h + 2.4, ym + .5, h + 4.2)}" fill="#3c3e46"/>`;
    } else {
      k += `<path d="${poly([[-96, y0, h], [-96, y1, h], [-102, y1, h + 6.5], [-102, y0, h + 6.5]])}" fill="#8a5c4c"/><path d="${wq(y0 - .2, h - .4, y1 + .2, h + .2)}" fill="#c9b494"/>`;
      let gi = 0;
      for (let y = y0 + 2.2; y < y1 - 1.5; y += 4.2, gi++) {
        const art2 = (gi + Math.round(y0)) % 3;
        if (art2 === 0) k += `<path d="${poly([[-98.6, y, h + 2.6], [-98.6, y + 1.6, h + 2.6], [-98.6, y + 1.6, h + 4.4], [-98.6, y + .8, h + 5.2], [-98.6, y, h + 4.4]])}" fill="#ece4d4"/><path d="${poly([[-98.55, y + .4, h + 2.9], [-98.55, y + 1.2, h + 2.9], [-98.55, y + 1.2, h + 4.1], [-98.55, y + .4, h + 4.1]])}" fill="#4a4c54"/>`;
        else if (art2 === 1) k += `<path d="${poly([[-98.4, y - .4, h + 2.4], [-98.4, y + 2.4, h + 2.4], [-98.4, y + 2.4, h + 4], [-98.4, y - .4, h + 4]])}" fill="#d8ccb6"/><path d="${poly([[-98.35, y, h + 2.7], [-98.35, y + 2, h + 2.7], [-98.35, y + 2, h + 3.7], [-98.35, y, h + 3.7]])}" fill="#4a4c54"/><path d="${poly([[-98.3, y - .5, h + 4], [-98.3, y + 2.5, h + 4], [-100, y + 2.5, h + 5.1], [-100, y - .5, h + 5.1]])}" fill="#6e4a3e"/>`;
        else k += `<path d="${poly([[-99.4, y + .3, h + 3.4], [-99.4, y + 1.3, h + 3.4], [-100.3, y + 1.3, h + 4.4], [-100.3, y + .3, h + 4.4]])}" fill="#3e4250"/>`;
      }
    }
    /* Ladenzone: Gesims, Schaufenster, Tür, manchmal eine Markise */
    k += `<path d="${wq(y0, 3.8, y1, 4.3)}" fill="#fff" opacity=".4"/>`;
    const n = Math.max(2, Math.round((y1 - y0) / 3.4));
    for (let i = 0; i < n; i++) {
      const yy = y0 + (i + .5) * (y1 - y0) / n;
      k += `<path d="${wq(yy - 1.1, .3, yy + 1.1, 3.2)}" fill="${i === 1 ? "#5a4434" : "#3a3c42"}"/>`;
      for (let e = 0; e < (h > 15 ? 3 : 2); e++) {
        const z = 5 + e * 3.6;
        k += `<path d="${wq(yy - .55, z, yy + .55, z + 2.2)}" fill="#44464e"/>`;
        if (laden) k += `<path d="${wq(yy - 1.15, z, yy - .6, z + 2.2)}" fill="${laden}"/><path d="${wq(yy + .6, z, yy + 1.15, z + 2.2)}" fill="${laden}"/>`;
      }
    }
    if (laden) k += `<path d="${poly([[-96, y0 + .4, 3.6], [-96, y1 - .4, 3.6], [-94.2, y1 - .4, 2.7], [-94.2, y0 + .4, 2.7]])}" fill="${laden === "#7a3a2a" ? "#b84030" : "#d8cfb8"}"/>`;
  }
  /* Südzeile westlich des Kaufhauses — von West nach Ost gezeichnet (die näheren verdecken die ferneren):
     Eckhaus, Alte Wache (1733, Mansarddach), Wentzingerhaus (1761, heute Museum für Stadtgeschichte),
     Bürgerhaus, Erzbischöfliches Palais (Haus zum Ritter, 1756) direkt neben dem Kaufhaus.
     Die Nordfassaden liegen im Schatten; die Walmflächen nach Osten fangen die Vormittagssonne. */
  const fe = (x0, x1, z0, z1, f = "#44464e") => `<path d="${poly([[x0, KYS, z0], [x1, KYS, z0], [x1, KYS, z1], [x0, KYS, z1]])}" fill="${f}"/>`;
  const fassade = (x0, x1, h, farbe, gewaende) => {
    let g = fe(x0, x1, 0, h, farbe) + `<path d="${poly([[x0, KYS, 0], [x1, KYS, 0], [x1, KYS, h], [x0, KYS, h]])}" fill="${S.lg("hausschatten", [[0, "#2a2018", 0.2], [1, "#2a2018", 0.08]])}"/>`;
    g += fe(x0, x1, h - .5, h + .2, gewaende) + fe(x0, x1, 3.9, 4.3, gewaende);
    return g;
  };
  const fenster = (x0, x1, h, stock, n, gew, laden) => {
    let g = "";
    for (let e = 0; e < stock; e++) for (let i = 0; i < n; i++) {
      const xm = x0 + (i + .5) * (x1 - x0) / n, z0 = 4.9 + e * (h - 5.2) / stock;
      g += fe(xm - .78, xm + .78, z0 - .25, z0 + 2.65, gew) + fe(xm - .58, xm + .58, z0, z0 + 2.4);
      if (laden) g += fe(xm - 1.2, xm - .8, z0, z0 + 2.4, laden) + fe(xm + .8, xm + 1.2, z0, z0 + 2.4, laden);
    }
    return g;
  };
  /* Walmdach: Fläche zum Platz (Nord, im Schatten) und Walm nach Osten (in der Sonne), Lichtkante am Grat */
  const walm = (x0, x1, h, dh, ein, f) => {
    const fi = [x1 - ein, KYS - 6, h + dh];
    let g = `<path d="${poly([[x1, KYS, h], [x1, KYS - 12, h], fi])}" fill="${licht(f, .7, -.7)}"/>`;
    g += `<path d="${poly([[x0, KYS, h], [x1, KYS, h], fi, [x0 + ein, KYS - 6, h + dh]])}" fill="${mische(f, "#2a1a22", .18)}"/>`;
    g += `<path d="${linie([[x1, KYS, h], fi, [x0 + ein, KYS - 6, h + dh]])}" stroke="#e8b89a" stroke-width=".3" fill="none"/>`;
    return g;
  };
  /* Eckhaus im Südwesten */
  k += fassade(-96, -74, 13, "#e3b65e", "#c8a46a") + fenster(-96, -74, 13, 2, 6, "#c8a46a", "#4f6a4a") + walm(-96, -74, 13, 6, 3, "#8a5c4c");
  /* Alte Wache: kleiner Barockbau, rot-weiß gefasst, Mansarddach mit Gauben (Lichtkante am Knick) */
  {
    const x0 = -74, x1 = -58, h = 10;
    k += fassade(x0, x1, h, "#e8dccb", "#a8463a") + fenster(x0, x1, h, 2, 5, "#a8463a");
    for (const xe of [x0, x1 - .8]) k += fe(xe, xe + .8, 0, h, "#a8463a");
    k += `<path d="${poly([[x1, KYS, h], [x1 - .6, KYS - 1.4, h + 4.2], [x1 - .6, KYS - 10.6, h + 4.2], [x1, KYS - 12, h]])}" fill="${licht("#6e5450", 1, 0)}"/>`;
    k += `<path d="${poly([[x0, KYS, h], [x1, KYS, h], [x1 - .6, KYS - 1.4, h + 4.2], [x0 + .6, KYS - 1.4, h + 4.2]])}" fill="#5e4a46"/><path d="${poly([[x0 + .6, KYS - 1.4, h + 4.2], [x1 - .6, KYS - 1.4, h + 4.2], [x1 - 2, KYS - 6, h + 6.4], [x0 + 2, KYS - 6, h + 6.4]])}" fill="#7a5a50"/>`;
    k += `<path d="${linie([[x0 + .6, KYS - 1.4, h + 4.2], [x1 - .6, KYS - 1.4, h + 4.2], [x1 - .6, KYS - 10.6, h + 4.2]])}" stroke="#e8c0a8" stroke-width=".3" fill="none"/>`;
    for (let i = 0; i < 4; i++) { const xm = x0 + 2.6 + i * 3.6; k += `<path d="${poly([[xm - .7, KYS - .9, h + 1.2], [xm + .7, KYS - .9, h + 1.2], [xm + .7, KYS - .9, h + 3.2], [xm, KYS - .9, h + 3.9], [xm - .7, KYS - .9, h + 3.2]])}" fill="#ece4d4"/>` + `<path d="${poly([[xm - .4, KYS - .85, h + 1.4], [xm + .4, KYS - .85, h + 1.4], [xm + .4, KYS - .85, h + 2.9], [xm - .4, KYS - .85, h + 2.9]])}" fill="#44464e"/>`; }
    k += fe(-67, -65, 0, 3.4, "#3a2a22");
  }
  /* Wentzingerhaus: rötlicher Putz, helle Gewände, Mittelrisalit mit Dreiecksgiebel (Lichtkanten) */
  {
    const x0 = -58, x1 = -36, h = 16;
    k += fassade(x0, x1, h, "#d79a86", "#efe3d0") + fenster(x0, x1, h, 3, 6, "#efe3d0") + walm(x0, x1, h, 8, 2.5, "#8a5c4c");
    k += `<path d="${poly([[-50.5, KYS + .3, 0], [-43.5, KYS + .3, 0], [-43.5, KYS + .3, h], [-47, KYS + .3, h + 3], [-50.5, KYS + .3, h]])}" fill="#dfa48e"/>`;
    k += `<path d="${linie([[-50.5, KYS + .35, 0], [-50.5, KYS + .35, h], [-47, KYS + .35, h + 3], [-43.5, KYS + .35, h], [-43.5, KYS + .35, 0]])}" stroke="#f6ead8" stroke-width=".35" fill="none"/>`;
    for (let e = 0; e < 3; e++) { const z0 = 4.9 + e * 3.6; k += fe(-47.8, -46.2, z0 - .25, z0 + 2.65, "#efe3d0") + fe(-47.6, -46.4, z0, z0 + 2.4); }
    k += fe(-48.4, -45.6, 0, 3.4, "#efe3d0") + fe(-47.9, -46.1, 0, 3.1, "#3a2a22");
  }
  /* Bürgerhaus */
  k += fassade(-36, -18, 14, "#e9d3a6", "#c8b08e") + fenster(-36, -18, 14, 3, 5, "#c8b08e", "#5a6a4a") + walm(-36, -18, 14, 7, 2.5, "#7a5244");
  for (let i = 0; i < 3; i++) k += fe(-36 + 3.2 + i * 5.4, -36 + 5 + i * 5.4, 0, 3.2, "#3a3c42");
  /* Erzbischöfliches Palais: hell verputzter Barock, Sandsteingewände, Mittelportal mit dem
     schmiedeeisernen Balkon auf Konsolen darüber, Walmdach */
  {
    const x0 = -18, x1 = 8, h = 15;
    k += fassade(x0, x1, h, "#ece6da", "#c49a86") + fenster(x0, x1, h, 3, 7, "#c49a86") + walm(x0, x1, h, 6, 3, "#7a5244");
    const pm = -5;
    k += `<path d="${poly([[pm - 2.2, KYS, 0], [pm + 2.2, KYS, 0], [pm + 2.2, KYS, 3.4], [pm, KYS, 4.2], [pm - 2.2, KYS, 3.4]])}" fill="#c49a86"/><path d="${poly([[pm - 1.6, KYS, 0], [pm + 1.6, KYS, 0], [pm + 1.6, KYS, 3], [pm, KYS, 3.6], [pm - 1.6, KYS, 3]])}" fill="#3a2a22"/>`;
    /* Balkon: Platte mit Unterseite, drei Konsolen, Gitter mit Stäben und Schnörkeln, Seitengitter */
    const bz = 4.7, by = KYS + 1, bx0 = pm - 3.4, bx1 = pm + 3.4;
    for (const cx of [bx0 + .5, pm, bx1 - .5]) k += `<path d="${poly([[cx - .3, KYS + .1, bz - 1.2], [cx + .3, KYS + .1, bz - 1.2], [cx + .35, by - .1, bz - .2], [cx - .35, by - .1, bz - .2]])}" fill="#b08672"/>`;
    k += `<path d="${poly([[bx0, KYS, bz - .25], [bx1, KYS, bz - .25], [bx1, by, bz - .25], [bx0, by, bz - .25]])}" fill="#8a6a5c"/>`;
    k += `<path d="${poly([[bx0, by, bz - .25], [bx1, by, bz - .25], [bx1, by, bz], [bx0, by, bz]])}" fill="#d8b8a4"/>`;
    let gi = linie([[bx0, by, bz + 1.05], [bx1, by, bz + 1.05], [bx1, KYS, bz + 1.05]]) + " " + linie([[bx0, by, bz + .12], [bx1, by, bz + .12]]) + " ";
    for (let x = bx0 + .15; x < bx1; x += .3) gi += linie([[x, by, bz], [x, by, bz + 1.05]]) + " ";
    for (let y = KYS + .2; y < by; y += .3) gi += linie([[bx1, y, bz], [bx1, y, bz + 1.05]]) + " ";
    k += `<path d="${gi}" stroke="#1d1d1d" stroke-width=".09" fill="none"/>`;
    let sn = ""; for (let x = bx0 + .6; x < bx1 - .3; x += 1.2) { const c = pr(x, by, bz + .58), sc = FOC / tief(x, by); sn += `M${r(c[0] - sc * .3)} ${r(c[1])}a${r(sc * .3)} ${r(sc * .3)} 0 1 0 ${r(sc * .6)} 0a${r(sc * .3)} ${r(sc * .3)} 0 1 0 ${r(-sc * .6)} 0 `; }
    k += `<path d="${sn}" stroke="#1d1d1d" stroke-width=".1" fill="none"/>`;
  }
  /* Vormittagsdunst über dem fernen Platzende: Tiefe */
  k += `<rect x="0" y="140" width="320" height="56" fill="${S.lg("platzdunst", [[0, "#f4ece0", 0], [.7, "#f6eee2", .28], [1, "#f6eee2", .1]], 0, 0, 0, 1)}"/>`;
  S.teil({ id: "muensterplatz", de: "der Münsterplatz", syl: "MÜNS-ter-platz", it: "la piazza del Duomo", itSyl: "PIAZ-za del DUO-mo", en: "Cathedral Square", x: 0, y: 0, kunst: k,
    tipp: "Der Platz ist mit runden Kieseln aus dem Rhein gepflastert. Montags bis samstags ist hier Markt: auf der Nordseite die Bauern aus der Region, auf der Südseite die Händler." });
}

/* =====================================================================
   2 — DAS BÄCHLE (Wasserrinne: kommt am Südrand vor der Häuserzeile entlang,
       biegt beim Café ab und läuft vorn aus dem Bild)
   ===================================================================== */
const WEG = [[-96, -75], [51, -75], [52.6, -71], [57.6, -48], [61.4, -30]];
{
  const quer = (a, b, d) => { const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy); return [-dy / l * d, dx / l * d]; };
  const streifen = (d0, d1, z) => {
    let g = "";
    for (let i = 0; i < WEG.length - 1; i++) {
      const a = WEG[i], b = WEG[i + 1], q0 = quer(a, b, d0), q1 = quer(a, b, d1), ex = i < WEG.length - 2 ? .3 : 0;
      const t = [(b[0] - a[0]) / Math.hypot(b[0] - a[0], b[1] - a[1]) * ex, (b[1] - a[1]) / Math.hypot(b[0] - a[0], b[1] - a[1]) * ex];
      g += poly([[a[0] + q0[0], a[1] + q0[1], z], [b[0] + t[0] + q0[0], b[1] + t[1] + q0[1], z], [b[0] + t[0] + q1[0], b[1] + t[1] + q1[1], z], [a[0] + q1[0], a[1] + q1[1], z]]) + " ";
    }
    return g;
  };
  /* Granit-Einfassung, die Innenwand auf der fernen Seite (das Wasser liegt tiefer), die Wasserfläche */
  let k = `<path d="${streifen(-.55, .55, 0)}" fill="#cfcac0"/>`;
  k += `<path d="${streifen(-.32, -.2, -.02)}" fill="#6e6a62"/>`;
  k += `<path d="${streifen(-.3, .32, -.14)}" fill="${S.lg("baechle", [[0, "#6f98a8"], [0.5, "#9cc4d2"], [1, "#5d8696"]])}"/>`;
  /* Schatten der sonnenseitigen Kante auf dem Wasser, Lichtkante an der gegenüberliegenden Innenwand, Strömungslinien */
  let sw = "", lk = "", st = "";
  for (let i = 0; i < WEG.length - 1; i++) {
    const a = WEG[i], b = WEG[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1]), q = quer(a, b, 1), sd = q[0] * SONNE[0] + q[1] * SONNE[1] > 0 ? 1 : -1;
    const P3 = (t, o, z) => [a[0] + (b[0] - a[0]) * t + q[0] * o * sd, a[1] + (b[1] - a[1]) * t + q[1] * o * sd, z];
    sw += poly([P3(0, .3, -.14), P3(1, .3, -.14), P3(1, .17, -.14), P3(0, .17, -.14)]) + " ";
    lk += linie([P3(0, -.31, -.03), P3(1, -.31, -.03)]) + " ";
    for (let n = 0; n < L / 2.2; n++) { const t = rnd(), o = (rnd() - .5) * .4, l = (.5 + rnd()) / L; if (FOC / tief(...P3(t, o, 0).slice(0, 2)) > 2.5) st += linie([P3(t, o, -.14), P3(Math.min(1, t + l), o + (rnd() - .5) * .05, -.14)]) + " "; }
  }
  k += `<path d="${sw}" fill="#2a4a58" opacity=".35"/><path d="${lk}" stroke="#f4f0e4" stroke-width=".35" fill="none"/><path d="${st}" stroke="#e8f6fc" stroke-width=".18" opacity=".55" fill="none"/>`;
  /* Glitzern und kleine Wellen auf dem fließenden Wasser, Fugen der Granitsteine */
  let fu = "";
  for (let i = 0; i < WEG.length - 1; i++) {
    const a = WEG[i], b = WEG[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1]), q = quer(a, b, 1);
    for (let d = .6; d < L; d += 1.1) {
      const x = a[0] + (b[0] - a[0]) * d / L, y = a[1] + (b[1] - a[1]) * d / L, s = FOC / tief(x, y);
      if (s < 2.2) continue;
      fu += `${linie([[x + q[0] * .55, y + q[1] * .55, 0], [x + q[0] * .32, y + q[1] * .32, 0]])} ${linie([[x - q[0] * .55, y - q[1] * .55, 0], [x - q[0] * .32, y - q[1] * .32, 0]])} `;
      if (rnd() < .7) { const o = (rnd() - .5) * .3, p = pr(x + q[0] * o, y + q[1] * o, -.14); if (p[0] > 0 && p[0] < 320 && p[1] < 240) k += `<ellipse cx="${r(p[0])}" cy="${r(p[1])}" rx="${r(.08 * s)}" ry="${r(.02 * s)}" fill="#f4fcff" opacity=".7"/>`; }
    }
  }
  k += `<path d="${fu}" stroke="#8f8a80" stroke-width=".3"/>`;
  S.teil({ id: "baechle", de: "das Bächle", syl: "BÄCH-le", it: "il ruscelletto", itSyl: "ru-scel-LET-to", en: "little stream (Bächle)", x: 0, y: 0, kunst: k,
    tipp: "Die Bächle sind kleine Wasserrinnen in der Altstadt. Kinder lassen darin kleine Boote an einer Schnur schwimmen. Wer aus Versehen hineintritt, heiratet einmal jemanden aus Freiburg — so sagt man." });
}

/* =====================================================================
   3 — DAS KIESELMOSAIK (Freiburger Wappen, aus weißen, roten und schwarzen Kieseln gesetzt)
   ===================================================================== */
{
  const M = [60, -52.4], GR = 1.5;
  /* Ortskoordinaten: u nach rechts, v in die Tiefe (Meter) */
  /* das Wappen schaut zur Kamera: v zeigt vom Betrachter weg, u quer dazu */
  const LM = Math.hypot(M[0] - CAM[0], M[1] - CAM[1]), VV = [(M[0] - CAM[0]) / LM, (M[1] - CAM[1]) / LM], UU = [VV[1], -VV[0]];
  const W = (u, v) => [M[0] + GR * (u * UU[0] + 1.5 * v * VV[0]), M[1] + GR * (u * UU[1] + 1.5 * v * VV[1]), 0];
  const P2 = (u, v) => pr(...W(u, v));
  const schild = (u, v) => Math.abs(u) <= .62 && v <= .7 && (v >= -.05 || (u / .62) ** 2 + ((v + .05) / .75) ** 2 <= 1);
  /* Grundflächen (projiziert): schwarzer Rand, weißes Feld, rotes Kreuz */
  const umriss = (sc) => { const pts = []; for (let i = 0; i <= 16; i++) { const a = Math.PI * i / 16; pts.push(W(sc * .62 * Math.cos(a), -.05 - sc * .75 * Math.sin(a))); } pts.push(W(-sc * .62, .7 * sc + (1 - sc) * .2), W(sc * .62, .7 * sc + (1 - sc) * .2)); return poly(pts); };
  let k = `<path d="${umriss(1)}" fill="#e9e3d6"/>`;
  k += `<path d="${poly([W(-.12, .7), W(.12, .7), W(.12, -.78), W(-.12, -.78)])}" fill="#b0302a"/><path d="${poly([W(-.62, .26), W(.62, .26), W(.62, .02), W(-.62, .02)])}" fill="#b0302a"/>`;
  /* darauf die Kiesel: ein Muster aus Licht und Fugen über den Farbflächen (in Bildgröße der Kiesel hier vorn) */
  {
    const rx = .044 * 38, ry = rx * 38 / FOC, w = rx * 7, h = ry * 6;
    let m = "";
    for (let z = 0; z < 3; z++) for (let j = 0; j < 3; j++) {
      const x = (j + (z % 2) * .5 + (rnd() - .5) * .2) * w / 3, y = (z + .5) * h / 3;
      for (const dx of [0, w, -w]) { if (dx && (x + dx < -rx || x + dx > w + rx)) continue; m += `<ellipse cx="${r(x + dx)}" cy="${r(y + ry * .45)}" rx="${r(rx)}" ry="${r(ry * .7)}" fill="#000" opacity=".28"/><ellipse cx="${r(x + dx - rx * .2)}" cy="${r(y - ry * .25)}" rx="${r(rx * .55)}" ry="${r(ry * .4)}" fill="#fff" opacity=".35"/>`; }
    }
    S.def(`<pattern id="${S.id("kmos")}" width="${r(w)}" height="${r(h)}" patternUnits="userSpaceOnUse">${m}</pattern>`);
    k += `<path d="${umriss(1)}" fill="url(#${S.id("kmos")})"/>`;
  }
  S.teil({ id: "kieselmosaik", de: "das Kieselmosaik", syl: "KIE-sel-mo-sa-ik", it: "il mosaico di ciottoli", itSyl: "mo-SA-i-co di CIOT-to-li", en: "pebble mosaic", x: 0, y: 0, kunst: k,
    tipp: "In Freiburg liegen überall Bilder aus Rheinkieseln im Pflaster. Oft liegen sie vor Läden und zeigen, was es dort gibt. Dieses zeigt das Stadtwappen: ein rotes Kreuz auf Weiß." });
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
  t.push(RT(-8, 0, 0.6, 46, "#c98068"), RT(0.6, 0, 8, 46, "#dc9a7c"));
  for (const [u, f] of [[-9, "#b86e56"], [7, "#e4a68a"]]) t.push(`<path d="${PT([[u, 0], [u + 2, 0], [u + 2, 30], [u + 1.7, 34], [u + 1.7, 42], [u + 1, 46.6], [u + .3, 42], [u + .3, 34], [u, 30]])}" fill="${f}"/>`);
  t.push(`<path d="M${r(TX(.6))} ${r(TY(0))} V${r(TY(46))}" stroke="${HELL}" stroke-width="${r(TS * .35)}"/>`);
  /* Glockenstube: je Seite zwei hohe Schallfenster */
  for (const u of [-5.6, -2.2, 2.6, 5]) t.push(`<path d="${PT([[u - .9, 27.4], [u + .9, 27.4], [u + .9, 34.4], [u, 36.2], [u - .9, 34.4]])}" fill="${LOCH}"/><path d="M${r(TX(u))} ${r(TY(27.4))} V${r(TY(35.4))}" stroke="${u < 0 ? "#d9937a" : "#9c5240"}" stroke-width="${r(TS * .18)}"/>`);
  /* Uhr (Zifferblatt nach Osten: weiß, schwarze Ziffern, Mitte farbig) */
  const uhr = [TX(3.8), TY(41)], ur = TS * 1.6;
  t.push(`<circle cx="${r(uhr[0])}" cy="${r(uhr[1])}" r="${r(ur * 1.14)}" fill="${DUNKEL}"/><circle cx="${r(uhr[0])}" cy="${r(uhr[1])}" r="${r(ur)}" fill="#f4efe2"/><circle cx="${r(uhr[0])}" cy="${r(uhr[1])}" r="${r(ur * .58)}" fill="#2f4f8a"/>`);
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; t.push(`<line x1="${r(uhr[0] + Math.sin(a) * ur * .68)}" y1="${r(uhr[1] - Math.cos(a) * ur * .68)}" x2="${r(uhr[0] + Math.sin(a) * ur * .92)}" y2="${r(uhr[1] - Math.cos(a) * ur * .92)}" stroke="#1d1d1d" stroke-width="${r(ur * .1)}"/>`); }
  t.push(`<path d="M${r(uhr[0])} ${r(uhr[1])} l${r(ur * .38)} ${r(-ur * .22)} M${r(uhr[0])} ${r(uhr[1])} l${r(-ur * .08)} ${r(-ur * .62)}" stroke="#e8c35a" stroke-width="${r(ur * .13)}" stroke-linecap="round"/>`);
  t.push(RT(-9.2, 45.6, 9.2, 46.8, HELL));
  /* Wetterläufe unter Galerie und Gesimsen */
  for (const [u0, u1, zt, n] of [[-8, 8, 45.4, 10], [-8, 8, 27, 7]]) { let wl = ""; for (let i = 0; i < n; i++) { const u = u0 + rnd() * (u1 - u0), w = .3 + rnd() * 1.2, l = 3 + rnd() * 6; wl += `M${r(TX(u))} ${r(TY(zt))}h${r(w * TS)}l${r(w * .15 * TS)} ${r(l * TS)}h${r(-w * 1.3 * TS)}Z`; }
    t.push(`<path d="${wl}" fill="${S.lg("turmlauf", [[0, "#2a2020", .25], [.6, "#2a2020", .08], [1, "#2a2020", 0]], 0, 0, 0, 1)}"/>`); }
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
    t.push(RT(-6.8, z0, -3.3, z1, "#c27a62"), RT(-3.3, z0, 3.3, z1, "#dc9a7c"), RT(3.3, z0, 6.8, z1, "#a85e48"));
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
  /* der durchbrochene Maßwerkhelm (76,7–112,4 m): achteckige Pyramide, drei Seiten sichtbar. Er ist zu zwei Dritteln
     STEIN: jede Fläche ist in Zonen geteilt, und jedes Feld trägt zusammenhängendes Maßwerk — ein Kreis mit Dreipass,
     darunter zwei Lanzettbahnen am Mittelpfosten. Nur Kreis- und Bahnöffnungen sind Himmel (nach oben feiner). */
  {
    const z0 = 76.7, z1 = 112.4, hb = 6.8, c = hb * .414;
    const tt = (z) => 1 - (z - z0) / (z1 - z0);
    const kanten = (z) => [-hb * tt(z), -c * tt(z), c * tt(z), hb * tt(z)];
    const RIP = [.42, .34, .34, .42];                           // halbe Rippenbreite (m) an den Graten
    /* Zonen: so hoch wie das Mittelfeld breit ist — oben werden sie kleiner */
    const Z = [z0 + .45];
    while (Z[Z.length - 1] < z1 - 5) Z.push(Z[Z.length - 1] + Math.max(1.5, 1.75 * c * tt(Z[Z.length - 1])));
    Z[Z.length - 1] = Math.min(Z[Z.length - 1], z1 - 4.2);
    let loch = "", mw = "";
    const U = (u, z) => `${r(TX(u))} ${r(TY(z))}`;
    const ellipse = (u, z, ru, rz) => { const a = TX(u) + ru * TS, b = TY(z); return `M${r(a)} ${r(b)}A${r(ru * TS)} ${r(rz * TS)} 0 1 0 ${r(a - 2 * ru * TS)} ${r(b)}A${r(ru * TS)} ${r(rz * TS)} 0 1 0 ${r(a)} ${r(b)}Z`; };
    for (let i = 0; i < Z.length - 1; i++) {
      const band = Math.max(.22, .36 * tt(Z[i]));
      const za = Z[i] + band / 2, zb = Z[i + 1] - band / 2, h = zb - za;
      for (let f = 0; f < 3; f++) {
        /* Feldränder entlang der Rippen (u links/rechts als Funktion der Höhe) */
        const L = (z) => kanten(z)[f] + RIP[f] * tt(z) + .05, R = (z) => kanten(z)[f + 1] - RIP[f + 1] * tt(z) - .05;
        const wz = (z) => R(z) - L(z), mz = (z) => (L(z) + R(z)) / 2;
        if (wz(zb) < .35 || h < .6) continue;
        const sq = f === 1 ? 1 : .62;                             // Seitenflächen sind verkürzt
        /* drei Zonentypen im Wechsel (wie am Original): Dreipass über zwei Lanzetten, großer Vierpass,
           drei Lanzetten mit kleinem Rundfenster darüber */
        const typ = i % 3;
        const bahn = (f0, f1, zs, zt) => {
          const k0 = (z) => L(z) + wz(z) * f0, k1 = (z) => L(z) + wz(z) * f1;
          const zk = zt - Math.min((k1(zt) - k0(zt)) * .8, (zt - zs) * .5);
          const a0 = k0(zk), a1 = k1(zk), wb = a1 - a0, st = (zt - zk) / (.866 * wb);
          const pts = [[k0(zs), zs], [k1(zs), zs], [a1, zk]];
          for (let n = 1; n <= 4; n++) { const a = n / 4 * Math.PI / 3; pts.push([a0 + wb * Math.cos(a), zk + wb * Math.sin(a) * st]); }
          for (let n = 3; n >= 0; n--) { const a = n / 4 * Math.PI / 3; pts.push([a1 - wb * Math.cos(a), zk + wb * Math.sin(a) * st]); }
          return "M" + pts.map(([u, z]) => U(u, z)).join("L") + "Z ";
        };
        const pass = (zc, ru, rz, n, q) => { for (let j = 0; j < n; j++) { const w = -Math.PI / 2 + j * 2 * Math.PI / n + (n === 4 ? Math.PI / 4 : 0); mw += ellipse(mz(zc) + Math.cos(w) * ru * q, zc - Math.sin(w) * rz * q, ru * (1 - q) * 1.04, rz * (1 - q) * 1.04) + " "; } };
        if (typ === 1) {
          const rz = Math.min(h * .42, wz(zb) / sq * .46), zc = (za + zb) / 2, ru = Math.min(wz(zc) * .47, rz * sq);
          loch += ellipse(mz(zc), zc, ru, rz) + " ";
          if (rz > .3) pass(zc, ru, rz, 4, .5);
        } else if (typ === 2) {
          const rz = Math.min(h * .14, wz(zb) / sq * .3), zc = zb - rz - .08, ru = Math.min(wz(zc) * .3, rz * sq);
          loch += ellipse(mz(zc), zc, ru, rz) + " ";
          const zt = zc - rz - .12, zs = za + .05, m = .06;
          if (zt - zs > .5) { if (wz(zs) > 1.4) loch += bahn(0, 1 / 3 - m, zs, zt) + bahn(1 / 3 + m, 2 / 3 - m, zs, zt) + bahn(2 / 3 + m, 1, zs, zt); else loch += bahn(.12, .88, zs, zt); }
        } else {
          const rz = Math.min(h * .25, wz(zb) / sq * .44), zc = zb - rz - .06, ru = Math.min(wz(zc) * .47, rz * sq);
          const sp = Math.max(.1, ru * .16);
          loch += ellipse(mz(zc), zc, ru, rz) + " ";
          if (rz > .32) pass(zc, ru, rz, 3, .47);
          const zt = zc - rz - sp, zs = za + .05;
          if (zt - zs > .5) { const m = sp / Math.max(.4, wz(zs)) / 2; if (wz(zs) > 1.1) loch += bahn(0, .5 - m, zs, zt) + bahn(.5 + m, 1, zs, zt); else loch += bahn(.12, .88, zs, zt); }
        }
      }
    }
    /* die Pyramide als Stein, die Öffnungen ausgespart (evenodd: alle Öffnungen liegen getrennt) */
    S.def(`<clipPath id="${S.id("helmloch")}"><path d="${PT([[-hb, z0], [hb, z0], [0, z1]])} ${loch}" clip-rule="evenodd"/></clipPath>`);
    const cp = `clip-path="url(#${S.id("helmloch")})"`;
    const ka = kanten(z0);
    for (const [a, b, col] of [[0, 1, "#c8826a"], [1, 2, "#e0a284"], [2, 3, "#a85e48"]]) t.push(`<path ${cp} d="${PT([[ka[a], z0], [ka[b], z0], [0, z1]])}" fill="${col}"/>`);
    /* Schattenkante in jeder Öffnung (Laibung): innen unten dunkler — liest sich als Steindicke */
    t.push(`<path d="${loch}" fill="none" stroke="#6e3226" stroke-width="${r(TS * .09)}" opacity=".55" ${cp}/>`);
    t.push(`<path ${cp} d="${PT([[-hb, z0], [hb, z0], [0, z1]])}" fill="${S.lg("helmpatina", [[0, "#3a3436", .45], [.55, "#4a3a36", .12], [1, "#4a3a36", 0]], 0, 0, 0, 1)}"/>`);
    t.push(`<path d="${mw}" fill="none" stroke="#c87a60" stroke-width="${r(TS * .17)}"/>`);
    /* Bänder zwischen den Zonen: oben eine Lichtkante */
    let bd = "";
    for (const z of Z.slice(1)) { const k = kanten(z); bd += `M${U(k[0], z)}L${U(k[3], z)} `; }
    t.push(`<path d="${bd}" stroke="#f2bea2" stroke-width="${r(TS * .12)}" opacity=".8"/>`);
    /* Grate: kräftige Rippen (doppelt so breit wie das Maßwerk), Krabben als Blattknollen nach außen */
    for (const [j, col, kn] of [[0, "#eab49a", "#f6caa8"], [1, "#d8967a", "#eab096"], [2, "#b86a52", "#c98068"], [3, "#8a4636", "#a85a44"]]) {
      const u0 = kanten(z0)[j];
      t.push(`<path d="M${U(u0, z0)}L${U(0, z1)}" stroke="${col}" stroke-width="${r(TS * RIP[j] * 1.9)}" stroke-linecap="round"/>`);
      if (j === 1 || j === 2) continue;
      const sd = u0 < 0 ? -1 : 1;
      let kb = "";
      for (let z = z0 + 1.6; z < z1 - 1; z += 2.3) {
        const g = .55 + .45 * tt(z), uu = u0 * tt(z) + sd * RIP[j] * tt(z) * .6, x = TX(uu), y = TY(z), rr = TS * .5 * g;
        /* Blattknolle: runder Knauf mit zwei kleinen, nach oben gebogenen Blattlappen */
        const kx = x + sd * rr * .75, ky = y - rr * .2, q = rr * .55;
        kb += `M${r(kx - q)} ${r(ky)}a${r(q)} ${r(q)} 0 1 0 ${r(2 * q)} 0a${r(q)} ${r(q)} 0 1 0 ${r(-2 * q)} 0`;
        kb += `M${r(kx - q * .6)} ${r(ky - q * .6)}q${r(-q * .7)} ${r(-q * .9)} ${r(-q * .2)} ${r(-q * 1.6)}q${r(q * .5)} ${r(q * .5)} ${r(q * .5)} ${r(q * 1.4)}Z`;
        kb += `M${r(kx + q * .6)} ${r(ky - q * .6)}q${r(q * .7)} ${r(-q * .9)} ${r(q * .2)} ${r(-q * 1.6)}q${r(-q * .5)} ${r(q * .5)} ${r(-q * .5)} ${r(q * 1.4)}Z`;
        kb += `M${r(x)} ${r(y)}L${r(kx)} ${r(ky)} `;
      }
      t.push(`<path d="${kb}" fill="${kn}" stroke="${kn}" stroke-width="${r(TS * .12)}"/>`);
    }
    /* Kreuzblume (≈ 4 m): Stiel, zwei Blattkränze übereinander, Knospe */
    const kx = TX(0), y = (z) => TY(z);
    t.push(`<path d="M${r(kx - TS * .55)} ${r(y(z1 - .4))} L${r(kx - TS * .4)} ${r(y(116.8))} L${r(kx + TS * .4)} ${r(y(116.8))} L${r(kx + TS * .55)} ${r(y(z1 - .4))} Z" fill="#b4644d"/>`);
    for (const [zz, gr] of [[113, 1.15], [115.3, .85]]) {
      const L = TS * 1.6 * gr, yy = y(zz);
      for (const sd of [-1, 1]) t.push(`<path d="M${r(kx)} ${r(yy)} C${r(kx + sd * L * .4)} ${r(yy - L * .75)} ${r(kx + sd * L * 1.25)} ${r(yy - L * .35)} ${r(kx + sd * L * 1.05)} ${r(yy + L * .4)} C${r(kx + sd * L * .8)} ${r(yy + L * .05)} ${r(kx + sd * L * .5)} ${r(yy + L * .25)} ${r(kx)} ${r(yy + L * .3)} Z" fill="${sd < 0 ? "#eab096" : "#a85a44"}"/>`);
      /* das Blatt zu uns hin: eine runde Knolle mit Licht links */
      t.push(`<ellipse cx="${r(kx)}" cy="${r(yy + L * .08)}" rx="${r(L * .42)}" ry="${r(L * .36)}" fill="#d48a6e"/><ellipse cx="${r(kx - L * .12)}" cy="${r(yy - L * .02)}" rx="${r(L * .18)}" ry="${r(L * .14)}" fill="#f0b89e"/>`);
    }
    t.push(`<path d="M${r(kx)} ${r(y(117))} C${r(kx - TS * .8)} ${r(y(117.4))} ${r(kx - TS * .35)} ${r(y(118.8))} ${r(kx)} ${r(y(119.3))} C${r(kx + TS * .35)} ${r(y(118.8))} ${r(kx + TS * .8)} ${r(y(117.4))} ${r(kx)} ${r(y(117))} Z" fill="#d48a6e"/>`);
    TM.helm = { x: TX(0), y: TY(95), h: TS * 32, w: TS * 10 };
    TM.kb = { x: TX(0), y: TY(112.6), h: TS * 7 };
  }
  TM.uhr = { x: uhr[0], y: uhr[1], r: ur };
  const zx = 220, zy = 16;
  S.teil({ id: "muensterturm", de: "der Münsterturm", syl: "MÜNS-ter-turm", it: "il campanile del duomo", itSyl: "cam-pa-NI-le del DUO-mo", en: "Minster tower", x: 0, y: 0, kunst: t.join(""),
    tipp: "Der Turm ist 116 Meter hoch und war schon um 1330 fertig. Er ist der einzige große gotische Kirchturm in Deutschland, der schon im Mittelalter fertig wurde. Jacob Burckhardt nannte ihn „den schönsten Turm der Christenheit“.",
    zoom: { x: zx, y: zy, w: 320 - zx, h: r((320 - zx) / 1.5) },
    unter: [
      { id: "turmhelm", de: "der Turmhelm", syl: "TURM-helm", it: "la guglia", itSyl: "GU-glia", en: "spire", x: TM.helm.x, y: TM.helm.y, kunst: flaeche(-TM.helm.w / 2, -TM.helm.h / 2, TM.helm.w, TM.helm.h),
        tipp: "Der Helm ist aus Stein, aber durchbrochen wie Spitze — durch das Maßwerk sieht man den Himmel. So einen Helm gab es zuerst in Freiburg." },
      { id: "kreuzblume", de: "die Kreuzblume", syl: "KREUZ-blu-me", it: "il fiore crociato", itSyl: "FIO-re cro-CIA-to", en: "finial", x: TM.kb.x, y: TM.kb.y, kunst: flaeche(-2.4, -TM.kb.h - 1, 4.8, TM.kb.h + 1.4, 0.6),
        tipp: "Die Kreuzblume ist die steinerne Blume ganz oben auf der Spitze." },
    ] });
}

/* =====================================================================
   5 — DAS MÜNSTER (Langhaus mit Strebewerk, Querhaus mit der Renaissance-Vorhalle von 1620)
       Lupe: Wasserspeier
   Licht: Ost- und Südflächen in der Vormittagssonne, Unterseiten und Westflächen im Schatten.
   ===================================================================== */
{
  let k = "";
  const Y_SS = -15, Y_OG = -7, ZF = 35.5;
  const xs = (i) => -46 + i * 7.43;
  const ST0 = "#a65842";
  const SUED = licht(ST0, 0, -1), OST = licht(ST0, 1, 0), UNTEN = mische(ST0, "#2a1822", .42), KANTE = "#f2c0a2";
  /* Wetterspuren: grauschwarze Läufe unter Gesimsen; Steine in anderen Rottönen */
  /* Wetterläufe: zwei gestapelte Lagen (ganz lang schwach, oben kräftiger) — wirkt wie ein Verlauf nach unten,
     ist aber nur ein Pfad je Lage */
  let LAUF = 0;
  const spuren = (Y, x0, x1, ztop, n) => { let a = ""; for (let i = 0; i < n; i++) { const x = x0 + rnd() * (x1 - x0), w = .4 + rnd() * 1.1, l = 2 + rnd() * (ztop * .5); a += poly([[x, Y - .05, ztop], [x + w, Y - .05, ztop], [x + w * .8, Y - .05, ztop - l], [x + w * .2, Y - .05, ztop - l]]); } return `<path d="${a}" fill="${S.lg("lauf" + (++LAUF), [[0, "#26201e", .55], [.5, "#26201e", .2], [1, "#26201e", .05]], 0, 0, 0, 1)}"/>`; };
  const steine = (Y, x0, x1, z0, z1, n) => { const d = ["", "", "", ""]; for (let i = 0; i < n; i++) { const x = x0 + rnd() * (x1 - x0 - 1.4), z = z0 + rnd() * (z1 - z0 - .7); d[i % 4] += poly([[x, Y - .04, z], [x + 1.2, Y - .04, z], [x + 1.2, Y - .04, z + .6], [x, Y - .04, z + .6]]); } return d.map((q, i) => `<path d="${q}" fill="${["#d8957a", "#9a4c3a", "#c78a74", "#8a5248"][i]}" opacity=".35"/>`).join(""); };
  /* gotisches Fenster: n Bahnen mit Kleeblattbögen, oben eine Rose mit Vierpass */
  const fenster = (Y, xm, w, z0, z1, bahnen, steg = "#e0a286") => {
    const zk = z1 - w * .9;
    let g = `<path d="${poly([[xm - w / 2, Y, z0], ...fbogen(Y, xm, w, zk, z1, true, 8), [xm + w / 2, Y, z0]])}" fill="${S.lg("kirchfenster", [[0, "#4a4656"], [0.5, "#2a2430"], [1, "#1f1a20"]])}"/>`;
    const zb = zk - .2, sc = FOC / tief(xm, Y);
    let st = linie(fbogen(Y, xm, w, zk, z1, true, 8)) + " ";
    for (let i = 1; i < bahnen; i++) { const x = xm - w / 2 + i * w / bahnen; st += linie([[x, Y, z0], [x, Y, zb]]) + " "; }
    for (let i = 0; i < bahnen; i++) { const x = xm - w / 2 + (i + .5) * w / bahnen; st += linie(fbogen(Y, x, w / bahnen, zb - .1, zb + w / bahnen * .7, true, 6)) + " "; }
    g += `<path d="${st}" stroke="${steg}" stroke-width="${r(Math.max(.18, sc * .12))}" fill="none"/>`;
    /* Rose auf der Wand (perspektivisch verkürzt): Kreis, darin ein Vierpass */
    const ring = (cx, cz, rad) => { const pts = []; for (let j = 0; j <= 16; j++) { const a = j / 16 * Math.PI * 2; pts.push([cx + Math.cos(a) * rad, Y, cz + Math.sin(a) * rad]); } return linie(pts); };
    const zc = z1 - w * .52, rad = w * .3, rr = sc * rad;
    if (rr > .35) {
      let rs = ring(xm, zc, rad);
      if (rr > .9) for (let j = 0; j < 4; j++) { const a = j * Math.PI / 2 + Math.PI / 4; rs += " " + ring(xm + Math.cos(a) * rad * .46, zc + Math.sin(a) * rad * .46, rad * .44); }
      g += `<path d="${rs}" fill="none" stroke="${steg}" stroke-width="${r(Math.max(.16, rr * .11))}"/>`;
    }
    return g;
  };
  /* Wasserspeier als Fabeltier: Leib aus dem Pfeiler, Kopf mit offenem Maul */
  const speier = (a, b, sz) => {
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
    const p = (t, o) => [a[0] + dx * t + nx * o * sz, a[1] + dy * t + ny * o * sz];
    let g = `<path d="M${P(p(0, -.32))} Q${P(p(.5, -.42))} ${P(p(.78, -.3))} L${P(p(.78, .26))} Q${P(p(.4, .36))} ${P(p(0, .3))} Z" fill="#8a4434"/>`;
    g += `<path d="M${P(p(.7, -.36))} L${P(p(1.02, -.3))} L${P(p(1.08, -.05))} L${P(p(.86, -.02))} Z" fill="#b8664e"/>`;
    g += `<path d="M${P(p(.74, .06))} L${P(p(1, .28))} L${P(p(.92, .34))} L${P(p(.72, .24))} Z" fill="#6e3226"/>`;
    g += `<path d="M${P(p(.72, -.36))} l${r(-nx * sz * .2 - ux * sz * .1)} ${r(-ny * sz * .2 - uy * sz * .1)}" stroke="#6e3226" stroke-width="${r(sz * .08)}"/><circle cx="${r(p(.84, -.2)[0])}" cy="${r(p(.84, -.2)[1])}" r="${r(sz * .05)}" fill="#1d120e"/>`;
    g += `<path d="M${P(p(.25, .3))} l${r(ny * sz * .25)} ${r(-nx * sz * .25)} M${P(p(.5, .3))} l${r(ny * sz * .22)} ${r(-nx * sz * .22)}" stroke="#6e3226" stroke-width="${r(sz * .07)}"/>`;
    return g;
  };
  /* Fiale: kleine Turmspitze auf einem Pfeiler (zwei sichtbare Flächen, Krabben) */
  const fiale = (x, y0, y1, z0, z1, b) => {
    const ym = (y0 + y1) / 2;
    let g = `<path d="${poly([[x - b, y0, z0], [x + b, y0, z0], [x, ym, z1]])}" fill="${SUED}"/><path d="${poly([[x + b, y0, z0], [x + b, y1, z0], [x, ym, z1]])}" fill="${OST}"/>`;
    let kr = "";
    for (let z = z0 + .9; z < z1 - .6; z += 1.1) { const t = 1 - (z - z0) / (z1 - z0); kr += linie([[x - b * t, y0 + (ym - y0) * (1 - t), z], [x - b * t - .3, y0 + (ym - y0) * (1 - t), z + .35]]) + " " + linie([[x + b * t, y0 + (ym - y0) * (1 - t), z], [x + b * t + .3, y0 + (ym - y0) * (1 - t), z + .35]]) + " "; }
    return g + `<path d="${kr}" stroke="${KANTE}" stroke-width=".3" stroke-linecap="round"/>`;
  };
  /* Mittelschiff: Dach, Obergaden mit Maßwerkfenstern */
  k += `<path d="${poly([[-46, Y_OG, 26.6], [6, Y_OG, 26.6], [6, 0, ZF], [-46, 0, ZF]])}" fill="${S.lg("dachm", [[0, "#5d5250"], [1, "#7c6e68"]])}"/>`;
  let ds = ""; for (let x = -44; x < 6; x += 2.4) ds += linie([[x, Y_OG, 26.6], [x, 0, ZF]]) + " ";
  k += `<path d="${ds}" stroke="#4a4140" stroke-width=".2" opacity=".5"/>`;
  k += `<path d="${poly([[-46, Y_OG, 17.4], [6, Y_OG, 17.4], [6, Y_OG, 26.8], [-46, Y_OG, 26.8]])}" fill="${SUED}"/>`;
  k += steine(Y_OG, -46, 6, 17.6, 26.4, 10);
  for (let i = 0; i < 7; i++) k += fenster(Y_OG, xs(i) + 3.72, 3.4, 18.4, 25.8, 3);
  k += spuren(Y_OG, -46, 6, 26.6, 18);
  /* Seitenschiff: Pultdach, Wand mit vierbahnigen Maßwerkfenstern, Quaderfugen */
  k += `<path d="${poly([[-46, Y_SS, 12], [6, Y_SS, 12], [6, Y_OG, 17.4], [-46, Y_OG, 17.4]])}" fill="${S.lg("dachs", [[0, "#6a5d58"], [1, "#857570"]])}"/>`;
  k += `<path d="${poly([[-46, Y_SS, 0], [6, Y_SS, 0], [6, Y_SS, 12.2], [-46, Y_SS, 12.2]])}" fill="${SUED}"/>`;
  k += steine(Y_SS, -46, 6, .5, 11.5, 14);
  let qf = ""; for (let z = 1.2; z < 12; z += .9) qf += linie([[-46, Y_SS, z], [6, Y_SS, z]]) + " ";
  k += `<path d="${qf}" stroke="#7a3a2c" stroke-width=".12" opacity=".35"/>`;
  for (let i = 0; i < 7; i++) k += fenster(Y_SS, xs(i) + 3.72, 4.4, 2.2, 11, 4);
  k += spuren(Y_SS, -46, 6, 12.2, 22);
  /* Maßwerkbrüstungen an den Traufen */
  for (const [yy, z0] of [[Y_SS - .2, 12.2], [Y_OG - .2, 26.6]]) {
    k += `<path d="${poly([[-46, yy, z0], [6, yy, z0], [6, yy, z0 + 1.1], [-46, yy, z0 + 1.1]])}" fill="${licht("#c98068", 0, -1)}"/>`;
    let st = "";
    for (let x = -45.4; x < 6; x += 1.2) st += linie([[x, yy, z0 + .15], [x, yy, z0 + .95]]) + " ";
    k += `<path d="${st}" stroke="#8a4636" stroke-width=".22"/><path d="${linie([[-46, yy, z0 + 1.1], [6, yy, z0 + 1.1]])}" stroke="${KANTE}" stroke-width=".25"/>`;
  }
  /* je Joch: Strebebogen (quer zur Wand, gekrümmte Unterseite), Strebepfeiler mit Wasserschlägen, Fiale, Wasserspeier —
     von hinten nach vorn, damit die näheren die ferneren verdecken */
  const SP = [];
  const bogen = (xb) => { const pts = []; for (let j = 0; j <= 10; j++) { const t = j / 10 * Math.PI / 2; pts.push([xb, Y_OG - 8.4 * Math.cos(t), 14.8 + 9.4 * Math.sin(t)]); } return pts; };
  for (let i = 0; i <= 7; i++) {
    const xb = xs(i);
    /* Unterseite (Laibung) des Bogens: von unten zu sehen, im Schatten */
    const ib = bogen(xb + .3), iw = bogen(xb - .3);
    k += `<path d="${poly([...ib, ...iw.reverse()])}" fill="${UNTEN}"/>`;
    /* Ostfläche des Bogens im Licht */
    k += `<path d="${poly([[xb + .3, -16.1, 16.2], [xb + .3, -16.1, 18.8], [xb + .3, Y_OG, 26.4], ...bogen(xb + .3).reverse()])}" fill="${OST}"/>`;
    k += `<path d="${linie([[xb + .3, -16.1, 18.8], [xb + .3, Y_OG, 26.4]])}" stroke="${KANTE}" stroke-width=".28"/>`;
    /* Pfeiler: unten breiter, Wasserschläge als Lichtkanten */
    k += prisma([[xb - .85, -17.6], [xb + .85, -17.6], [xb + .85, Y_SS], [xb - .85, Y_SS]], 0, 9.6, ST0);
    k += prisma([[xb - .7, -16.8], [xb + .7, -16.8], [xb + .7, Y_SS], [xb - .7, Y_SS]], 9.6, 16.2, ST0);
    for (const [z, y0, b] of [[5, -17.6, .85], [9.6, -17.6, .85], [16.2, -16.8, .7]]) k += `<path d="${linie([[xb - b, y0 - .05, z], [xb + b, y0 - .05, z], [xb + b, Y_SS, z]])}" stroke="${KANTE}" stroke-width=".3" fill="none"/>`;
    k += `<path d="${linie([[xb - .55, -16.85, 13.2], [xb, -16.85, 15.4], [xb + .55, -16.85, 13.2]])}" stroke="${KANTE}" stroke-width=".26" fill="none"/>`;
    k += fiale(xb, -16.8, -15.2, 16.2, 22.4, .6);
    const w0 = pr(xb, -16.8, 14.4), w1 = pr(xb, -18.8, 14.6), ws = FOC / tief(xb, -18);
    k += speier(w0, w1, Math.max(.9, ws * 1.1));
    SP.push({ x: (w0[0] + w1[0]) / 2, y: (w0[1] + w1[1]) / 2 });
  }
  /* Querhaus: Dach, Ostwand im Licht, Südgiebel mit großem Fenster (vier Bahnen, Rose mit Vierpass) */
  const QY = -19;
  k += `<path d="${poly([[6, QY, 26.6], [18, QY, 26.6], [18, 0, ZF + 1], [6, 0, ZF + 1]])}" fill="${S.lg("dachq", [[0, "#5d5250"], [1, "#7c6e68"]])}"/>`;
  k += `<path d="${poly([[18, QY, 0], [18, -15, 0], [18, -15, 26.6], [18, QY, 26.6]])}" fill="${OST}"/>`;
  k += `<path d="${poly([[6, QY, 0], [18, QY, 0], [18, QY, 26.6], [12, QY, 36.4], [6, QY, 26.6]])}" fill="${SUED}"/>`;
  k += steine(QY, 6.5, 17.5, 1, 30, 30) + spuren(QY, 6.5, 17.5, 26.4, 14) + spuren(QY, 9, 15, 33, 4) + spuren(QY, 6.5, 17.5, 10.4, 10) + spuren(QY, 6.5, 17.5, 20, 6);
  let gs = ""; for (const z of [10.6, 26.6]) gs += linie([[6, QY - .1, z], [18, QY - .1, z], [18, -15, z]]) + " "; for (let z = 1.2; z < 26; z += .9) gs += linie([[6, QY, z], [18, QY, z]]) + " ";
  for (let z = 1.2; z < 11; z += .9) for (let x = 6.6 + (Math.round(z / .9) % 2) * .9; x < 18; x += 1.8) gs += linie([[x, QY, z], [x, QY, z + .9]]) + " ";
  k += `<path d="${gs}" stroke="#6e3226" stroke-width=".12" opacity=".38" fill="none"/>`;
  k += `<path d="${poly([[6.4, QY - .3, 27.2], [12, QY - .3, 36.4], [17.6, QY - .3, 27.2]])}" fill="none" stroke="${KANTE}" stroke-width=".6"/>`;
  let kr = ""; for (let t = .08; t < 1; t += .12) for (const sd of [-1, 1]) { const x = 12 + sd * 5.6 * (1 - t), z = 27.2 + 9.2 * t; kr += linie([[x, QY - .4, z], [x + sd * .5, QY - .4, z + .6]]) + " "; }
  k += `<path d="${kr}" stroke="#e4a58a" stroke-width=".45" stroke-linecap="round"/>`;
  { const a = pr(12, QY - .3, 36.4), b = pr(12, QY - .3, 38.2), qs = FOC / tief(12, QY); k += `<path d="M${P(a)} L${P(b)}" stroke="#c98068" stroke-width="${r(qs * .3)}"/><path d="M${r(b[0] - qs * .5)} ${r(b[1] + qs * .2)} q${r(qs * .5)} ${r(-qs * .9)} ${r(qs)} 0 M${r(b[0] - qs * .4)} ${r(b[1] - qs * .3)} h${r(qs * .8)}" stroke="#c98068" stroke-width="${r(qs * .22)}" fill="none"/>`; }
  k += fenster(QY, 12, 7, 11.4, 25.8, 4);
  /* Eckpfeiler des Querhauses mit Fialen; die Wasserspeier sitzen tief (die Turmuhr bleibt frei) */
  for (const xb of [6, 18]) {
    k += prisma([[xb - .9, QY - 1.8], [xb + .9, QY - 1.8], [xb + .9, QY], [xb - .9, QY]], 0, 24, ST0);
    let wl = ""; for (const z of [7, 14, 20]) wl += linie([[xb - .9, QY - 1.85, z], [xb + .9, QY - 1.85, z], [xb + .9, QY, z]]) + " ";
    k += `<path d="${wl}" stroke="${KANTE}" stroke-width=".32" fill="none"/>`;
    k += fiale(xb, QY - 1.8, QY, 24, xb < 10 ? 28.2 : 31.4, .7);
    /* Speier nur am fernen Eckpfeiler — am nahen ragte er vor das Querhausfenster */
    if (xb < 10) { const w0 = pr(xb, QY - 1.8, 15.6), w1 = pr(xb, QY - 4.2, 15.9), ws = FOC / tief(xb, QY - 2); k += speier(w0, w1, ws * 1.1); }
  }
  /* die Renaissance-Vorhalle (1620) vor dem Südportal: offene Halle mit Rundbögen, Pilastern, Gebälk und Balustrade */
  {
    const VX0 = 8.4, VX1 = 15.6, VY = QY - 4.4, VH = 7;
    k += wurf([[VX0, VY, VH + 1], [VX1, VY, VH + 1], [VX1, QY, VH + 1], [VX0, QY, VH + 1]], .22);
    const VST = "#c98a6c";
    k += prisma([[VX0, VY], [VX1, VY], [VX1, QY], [VX0, QY]], 0, VH, VST);
    /* Bogenöffnungen: vorn ein großer Rundbogen, an der Ostseite ein kleiner; innen dunkel, hinten das alte Portal */
    k += `<path d="${poly(toroeffnung(VY, 12, 3.6, 3.4, 5.2, false))}" fill="#3a2420"/>`;
    const ob = []; for (let j = 0; j <= 10; j++) { const a = Math.PI * j / 10; ob.push([VX1, QY - 2.2 + Math.cos(a) * 1.3, 3 + Math.sin(a) * 1.3]); }
    k += `<path d="${poly([[VX1, QY - .9, 0], ...ob, [VX1, QY - 3.5, 0]])}" fill="#4a2c26"/>`;
    k += `<path d="${linie(fbogen(VY - .05, 12, 3.9, 3.4, 5.45, false, 10))}" stroke="${KANTE}" stroke-width=".35" fill="none"/>`;
    /* Pilaster mit Beschlagwerk, Gebälk, Balustrade, Obelisken und Kugeln */
    for (const x of [VX0 + .25, 9.9, 14.1, VX1 - .25]) {
      k += `<path d="${poly([[x - .28, VY - .06, 0], [x + .28, VY - .06, 0], [x + .28, VY - .06, 5.7], [x - .28, VY - .06, 5.7]])}" fill="#dca084"/>`;
      k += `<path d="${poly([[x, VY - .08, 2.2], [x + .2, VY - .08, 2.6], [x, VY - .08, 3], [x - .2, VY - .08, 2.6]])}" fill="#a05a44"/>`;
    }
    k += `<path d="${poly([[VX0 - .15, VY - .15, 5.7], [VX1 + .15, VY - .15, 5.7], [VX1 + .15, VY - .15, VH], [VX0 - .15, VY - .15, VH]])}" fill="#d89a7e"/><path d="${linie([[VX0 - .15, VY - .16, 6.3], [VX1 + .15, VY - .16, 6.3], [VX1 + .15, QY, 6.3]])}" stroke="#8a4636" stroke-width=".2" fill="none"/>`;
    k += `<path d="${linie([[VX0, VY - .1, VH + 1.1], [VX1, VY - .1, VH + 1.1], [VX1, QY, VH + 1.1]])}" stroke="#d89a7e" stroke-width=".4" fill="none"/>`;
    let bl = ""; for (let x = VX0 + .3; x < VX1; x += .42) bl += linie([[x, VY - .1, VH], [x, VY - .1, VH + 1]]) + " "; for (let y = VY + .3; y < QY; y += .42) bl += linie([[VX1, y, VH], [VX1, y, VH + 1]]) + " ";
    k += `<path d="${bl}" stroke="#c27a62" stroke-width=".2"/>`;
    for (const [x, y] of [[VX0 + .2, VY], [12, VY], [VX1 - .2, VY], [VX1 - .2, QY - .4]]) {
      k += `<path d="${poly([[x - .25, y - .1, VH + 1.1], [x + .25, y - .1, VH + 1.1], [x, y - .1, VH + 2.6]])}" fill="#d89a7e"/>`;
      const b = pr(x, y - .1, VH + 2.8); k += `<circle cx="${r(b[0])}" cy="${r(b[1])}" r="${r(FOC / tief(x, y) * .2)}" fill="#e8b49a"/>`;
    }
  }
  const sp = SP[SP.length - 1];
  S.teil({ id: "muenster", de: "das Freiburger Münster", syl: "FREI-bur-ger MÜNS-ter", it: "la cattedrale di Friburgo", itSyl: "cat-te-DRA-le di fri-BUR-go", en: "Freiburg Minster",
    x: 0, y: 0, kunst: k, tipp: "Das Münster wurde ab etwa 1200 aus rotem Sandstein gebaut. Der Chor wurde erst 1513 geweiht. Vor dem Südeingang steht eine Vorhalle von 1620.",
    zoom: { x: 226, y: 112, w: 94, h: 63 },
    unter: [
      { id: "wasserspeier", de: "der Wasserspeier", syl: "WAS-ser-spei-er", it: "il doccione", itSyl: "doc-CIO-ne", en: "gargoyle", x: sp.x, y: sp.y, kunst: flaeche(-3, -2.4, 6, 4.4, 0.5),
        tipp: "Durch die Wasserspeier fließt das Regenwasser vom Dach. Am Münster sehen viele wie Tiere und Fratzen aus." },
    ] });
}

/* =====================================================================
   6 — DAS HISTORISCHE KAUFHAUS (Nordfassade im Schatten) mit Laubengang
       Lupe: Figur, Erker, Wappen
   ===================================================================== */
const KX0 = 8, KX1 = 44, KZE = 13.6;
const KAUF = {};
{
  let k = "";
  const KRF = S.lg("kaufrot", [[0, "#7c2016"], [0.5, "#922a1a"], [1, "#842418"]], 0, 0, 1, 0);
  const GL = S.lg("kaufglas", [[0, "#a9bccc"], [0.35, "#3f4a56"], [1, "#262c34"]]);
  const ST = "#c8a492";
  S.def(`<pattern id="${S.id("rauten")}" width="1.6" height="2" patternUnits="userSpaceOnUse"><rect width="1.6" height="2" fill="#2a2420"/><path d="M.8 0 L1.6 1 L.8 2 L0 1 Z" fill="#d6a62e"/><path d="M.8 .5 L1.2 1 L.8 1.5 L.4 1 Z" fill="#2f6e44"/><path d="M0 0 L.4 .5 L0 1 Z M1.6 1 L1.2 1.5 L1.6 2 Z" fill="#b8442a"/></pattern>`);
  const RAUTEN = `url(#${S.id("rauten")})`;
  const HELMLICHT = S.lg("helmlicht", [[0, "#fff", 0.25], [0.5, "#fff", 0], [1, "#000", 0.32]], 0, 0, 1, 0);
  /* --- Dach: glasierte Ziegel in regelmäßigem Rautenmuster (Reihen, lückenlos) --- */
  const dachN = [[KX0, KYS, KZE], [KX1, KYS, KZE], [KX1 - 5, KYS - 10, 27], [KX0 + 5, KYS - 10, 27]];
  const dachO = [[KX1, KYS, KZE], [KX1, KYS - 20, KZE], [KX1 - 5, KYS - 10, 27]];
  k += `<path d="${poly(dachO)}" fill="#4a3020"/>`;
  S.def(`<clipPath id="${S.id("dachclip")}"><path d="${poly(dachN)}"/></clipPath>`);
  let fl = `<path d="${poly(dachN)}" fill="#7a3a22"/>`;
  const RF = ["", "", "", ""];
  const dp = (x, v) => [x, KYS - 10 * v, KZE + 13.4 * v];
  const NR = 16, dv = 1 / NR, BW = 2.3, PAL = ["#d6a62e", "#2f6e44", "#1f1d1c", "#b8442a"];
  let fugen = "";
  for (let j = -1; j <= NR; j++) for (let i = -1; i < 18; i++) {
    const vm = (j + .5) * dv, x = KX0 + (i + (j % 2 ? .5 : 0)) * BW;
    const c = j % 4 === 0 ? 2 : ((i + (j >> 1)) % 2 ? 0 : (j % 4 === 2 ? 3 : 1));
    const pts = [dp(x, vm - dv), dp(x + BW / 2, vm), dp(x, vm + dv), dp(x - BW / 2, vm)];
    RF[c] += poly(pts);
  }
  RF.forEach((d, c) => { fl += `<path d="${d}" fill="${PAL[c]}"/>`; });
  for (let j = 0; j <= NR; j++) { const v = j * dv; fugen += linie([dp(KX0, v), dp(KX1, v)]) + " "; }
  k += `<g clip-path="url(#${S.id("dachclip")})">${fl}<path d="${fugen}" stroke="#2a1a12" stroke-width=".18" opacity=".5" fill="none"/><path d="${poly(dachN)}" fill="${S.lg("dachglanz", [[0, "#fff", 0.12], [0.5, "#000", 0.08], [1, "#000", 0.28]], 0, 0, 1, 0)}"/></g>`;
  k += `<path d="${linie([[KX1, KYS, KZE], [KX1 - 5, KYS - 10, 27], [KX0 + 5, KYS - 10, 27]])}" stroke="#3a2a20" stroke-width=".5" fill="none"/>`;
  /* Gauben „wie in Beaune“ */
  for (const gx of [17.5, 26, 34.5]) {
    const y0 = KYS - 1.6, z0 = KZE + 2.2;
    k += `<path d="${poly([[gx - 1.5, y0, z0], [gx + 1.5, y0, z0], [gx + 1.5, y0, z0 + 3.8], [gx, y0, z0 + 6], [gx - 1.5, y0, z0 + 3.8]])}" fill="${KRF}"/>`;
    k += `<path d="${poly([[gx - .8, y0, z0 + .6], [gx + .8, y0, z0 + .6], [gx + .8, y0, z0 + 3.4], [gx - .8, y0, z0 + 3.4]])}" fill="${GL}"/>`;
    const helm = poly([[gx - 1.9, y0, z0 + 3.6], [gx, y0, z0 + 6.2], [gx + 1.9, y0, z0 + 3.6], [gx, y0 - 2.2, z0 + 9.2]]);
    k += `<path d="${helm}" fill="${RAUTEN}"/><path d="${helm}" fill="${HELMLICHT}"/>`;
    const a = pr(gx, y0 - 2.2, z0 + 9.2), b = pr(gx, y0 - 2.2, z0 + 10.8);
    k += `<path d="M${P(a)} L${P(b)}" stroke="#d8b04a" stroke-width=".55"/><circle cx="${r(b[0])}" cy="${r(b[1])}" r=".5" fill="#e8c35a"/>`;
  }
  /* --- Fassade (Nordseite: im Schatten, kühleres Rot) --- */
  k += `<path d="${fq(KYS, KX0, 0, KX1, KZE)}" fill="${KRF}"/>`;
  k += `<path d="${fq(KYS, KX0, KZE - .8, KX1, KZE + .2)}" fill="${ST}"/><path d="${fq(KYS, KX0, 5.6, KX1, 6)}" fill="${ST}"/>`;
  /* Laubengang: vier Spitzbögen auf Pfeilern, hinten Schaufenster */
  for (const xm of [13.6, 21.2, 28.8, 36.4]) {
    k += `<path d="${poly(toroeffnung(KYS, xm, 6.2, 2.6, 5.3, true))}" fill="${S.lg("lauben", [[0, "#40261f"], [1, "#1f120e"]])}"/>`;
    k += `<path d="${linie(fbogen(KYS, xm, 6.8, 2.6, 5.7, true, 10))}" stroke="${ST}" stroke-width=".9" fill="none"/>`;
    k += `<path d="${fq(KYS - 3, xm - 1.6, .6, xm + 1.6, 2.8)}" fill="#c9a86a" opacity=".5"/>`;
  }
  for (const xm of [9.8, 17.4, 25, 32.6, 40.2]) k += `<path d="${fq(KYS + .2, xm - .7, 0, xm + .7, 5.6)}" fill="${S.lg("pfeiler", [[0, "#6e1e12"], [1, "#94301f"]], 0, 0, 1, 0)}"/>`;
  /* Balkon über dem Laubengang mit Maßwerkbrüstung; darauf die Wappenreihe */
  k += `<path d="${poly([[KX0 + 3.6, KYS + .5, 6], [KX1 - 3.6, KYS + .5, 6], [KX1 - 3.6, KYS + .5, 7.1], [KX0 + 3.6, KYS + .5, 7.1]])}" fill="${ST}"/>`;
  for (let x = KX0 + 4.1; x < KX1 - 3.8; x += 1.05) k += `<path d="${linie([[x, KYS + .5, 6.2], [x, KYS + .5, 6.9]])}" stroke="#7a3226" stroke-width=".4"/>`;
  /* fünf Fenster mit Kreuzstock */
  for (const xm of [12.4, 19.6, 26, 32.4, 39.6]) {
    k += `<path d="${fq(KYS, xm - 1.5, 7.5, xm + 1.5, 12.4)}" fill="${ST}"/><path d="${fq(KYS, xm - 1.2, 7.7, xm + 1.2, 12.2)}" fill="${GL}"/>`;
    k += `<path d="${linie([[xm, KYS, 7.7], [xm, KYS, 12.2]])} ${linie([[xm - 1.2, KYS, 10.4], [xm + 1.2, KYS, 10.4]])}" stroke="${ST}" stroke-width=".4"/>`;
  }
  /* die vier Habsburger, fast fensterhoch, farbig gefasst, unter Baldachinen; darunter Wappen */
  const figur = [];
  const WR = [["#c8202a", "#ffffff"], ["#e8c23a", "#1d1d1d"], ["#f2ead8", "#c8202a"], ["#c8202a", "#e8c23a"]];
  [[16, "#8a1f22", "#e8c35a"], [22.8, "#1f3f7a", "#c9a227"], [29.2, "#2a2a2a", "#e8c35a"], [36, "#3f6a2a", "#d8b04a"]].forEach(([xm, robe, gold], i) => {
    const y = KYS + .35, f0 = pr(xm, y, 7.3), f1 = pr(xm, y, 11.4), h = f0[1] - f1[1], x = f0[0];
    let g = `<path d="${poly([[xm - .95, y, 6.8], [xm + .95, y, 6.8], [xm + .55, y, 7.3], [xm - .55, y, 7.3]])}" fill="${ST}"/>`;
    /* Mantel, Hermelin, Zepter und Reichsapfel, Krone */
    g += `<path d="M${r(x - h * .2)} ${r(f0[1])} Q${r(x - h * .19)} ${r(f1[1] + h * .45)} ${r(x - h * .12)} ${r(f1[1] + h * .22)} Q${r(x)} ${r(f1[1] + h * .16)} ${r(x + h * .12)} ${r(f1[1] + h * .22)} Q${r(x + h * .19)} ${r(f1[1] + h * .45)} ${r(x + h * .2)} ${r(f0[1])} Z" fill="${robe}"/>`;
    g += `<path d="M${r(x - h * .05)} ${r(f1[1] + h * .25)} L${r(x - h * .07)} ${r(f0[1])} L${r(x + h * .07)} ${r(f0[1])} L${r(x + h * .05)} ${r(f1[1] + h * .25)} Z" fill="${gold}" opacity=".75"/>`;
    g += `<path d="M${r(x - h * .13)} ${r(f1[1] + h * .23)} Q${r(x)} ${r(f1[1] + h * .32)} ${r(x + h * .13)} ${r(f1[1] + h * .23)}" stroke="#f2ecdc" stroke-width="${r(h * .055)}" fill="none"/>`;
    g += `<path d="M${r(x + h * .13)} ${r(f1[1] + h * .5)} L${r(x + h * .19)} ${r(f1[1] + h * .1)}" stroke="#e8c35a" stroke-width="${r(h * .03)}"/><circle cx="${r(x - h * .12)}" cy="${r(f1[1] + h * .48)}" r="${r(h * .04)}" fill="#e8c35a"/>`;
    g += `<circle cx="${r(x)}" cy="${r(f1[1] + h * .11)}" r="${r(h * .07)}" fill="#e2b48e"/>`;
    g += `<path d="M${r(x - h * .075)} ${r(f1[1] + h * .07)} l${r(h * .02)} ${r(-h * .08)} ${r(h * .035)} ${r(h * .04)} ${r(h * .02)} ${r(-h * .055)} ${r(h * .02)} ${r(h * .055)} ${r(h * .035)} ${r(-h * .04)} ${r(h * .02)} ${r(h * .08)} Z" fill="#e8c35a"/>`;
    /* reicher Baldachin mit Fiale */
    g += `<path d="${poly([[xm - .95, y, 11.5], [xm + .95, y, 11.5], [xm + .95, y, 12.1], [xm + .55, y, 12.1], [xm + .3, y, 12.9], [xm, y, 13.5], [xm - .3, y, 12.9], [xm - .55, y, 12.1], [xm - .95, y, 12.1]])}" fill="${ST}"/>`;
    /* Baldachin: drei kleine Spitzbögen, darüber spitze Dächlein mit Fialen */
    { let bd = ""; for (const o of [-.55, 0, .55]) { bd += linie([[xm + o - .25, y, 11.5], [xm + o - .25, y, 11.75], [xm + o, y, 12], [xm + o + .25, y, 11.75], [xm + o + .25, y, 11.5]]) + " "; }
      g += `<path d="${bd}" stroke="#7a3226" stroke-width=".18" fill="none"/>`;
      for (const o of [-.75, .75]) g += `<path d="${poly([[xm + o - .14, y, 12.1], [xm + o + .14, y, 12.1], [xm + o, y, 13]])}" fill="${ST}"/>`; }
    /* Wappenschild in der Brüstung darunter */
    const w0 = pr(xm, KYS + .55, 6.15), w1 = pr(xm, KYS + .55, 6.95), wh = w0[1] - w1[1], [c1, c2] = WR[i];
    g += `<path d="M${r(w0[0] - wh * .42)} ${r(w1[1])} h${r(wh * .84)} v${r(wh * .5)} q0 ${r(wh * .42)} ${r(-wh * .42)} ${r(wh * .5)} q${r(-wh * .42)} ${r(-wh * .08)} ${r(-wh * .42)} ${r(-wh * .5)} Z" fill="${c1}" stroke="#d8b04a" stroke-width=".12"/><rect x="${r(w0[0] - wh * .42)}" y="${r(w1[1] + wh * .32)}" width="${r(wh * .84)}" height="${r(wh * .26)}" fill="${c2}"/>`;
    k += g;
    figur.push({ x, y: f0[1], h });
  });
  /* Erker auf Konsolen: polygonal, Maßwerkbrüstung, Wappen, Türmchen mit bunten Ziegeln */
  const wappen = [["#c8202a", "#ffffff"], ["#f2ead8", "#c8202a"]];
  const erker = (xa, xb, wi) => {
    const xm = (xa + xb) / 2, yv = KYS + 1.6, ze = KZE + 1.2, z0 = 6.4;
    /* Grundriss: halbes Achteck vor der Wand (gegen den Uhrzeigersinn) */
    const plan = [[xb, KYS], [xb - .5, KYS + 1.1], [xm + .7, yv], [xm - .7, yv], [xa + .5, KYS + 1.1], [xa, KYS]];
    const skal = (q) => plan.map(([x, y]) => [xm + (x - xm) * q, KYS + (y - KYS) * q]);
    let g = "";
    /* Konsole: nach unten schmaler werdende, profilierte Steinringe (von unten zu sehen) */
    /* profiliert: Deckplatte, Wulst, Kehle, Wulst, Kehle, unten ein Blattknauf */
    const LV = [[z0, 1.06], [z0 - .3, 1.06], [z0 - .45, .9], [z0 - .75, .96], [z0 - 1.05, .78], [z0 - 1.45, .66], [z0 - 1.65, .72], [z0 - 2.05, .5], [z0 - 2.45, .34], [z0 - 2.6, .4], [z0 - 3.1, .12]];
    for (let j = LV.length - 2; j >= 0; j--) {
      const [zo, qo] = LV[j], [zu, qu] = LV[j + 1], po = skal(qo), pu = skal(qu);
      for (let i = 0; i < po.length - 1; i++) {
        const nx = po[i + 1][1] - po[i][1], ny = po[i][0] - po[i + 1][0], L = Math.hypot(nx, ny) || 1;
        g += `<path d="${poly([[...pu[i], zu], [...pu[i + 1], zu], [...po[i + 1], zo], [...po[i], zo]])}" fill="${licht([LV[j + 1][1] > LV[j][1] ? "#a87866" : "#cfa08a"][0], nx / L, ny / L)}"/>`;
      }
    }
    /* Erkerkörper: fünf Seiten, rot verputzt; Brüstung mit Blendmaßwerk, Fenster mit Pfosten */
    g += prisma(plan, z0, ze, "#9a2c1c");
    for (let i = 0; i < plan.length - 1; i++) {
      const [ax, ay] = plan[i], [bx, by] = plan[i + 1], nx = by - ay, ny = ax - bx;
      if ((CAM[0] - (ax + bx) / 2) * nx + (CAM[1] - (ay + by) / 2) * ny <= 0) continue;
      const m = (t, z) => [ax + (bx - ax) * t, ay + (by - ay) * t, z];
      g += `<path d="${poly([m(.08, 7.1), m(.92, 7.1), m(.92, 8.7), m(.08, 8.7)])}" fill="${licht(ST, nx, ny)}"/>`;
      /* Blendmaßwerk: je Feld ein Spitzbogen mit Dreipass im Bogenfeld (Relief, dunkle Fugen) */
      { let bm = ""; const bo = (t0, t1) => { const pts = []; for (let n = 0; n <= 8; n++) { const q = n / 8, a = (Math.PI / 3) * (q < .5 ? 2 * q : 2 * (1 - q)); const t = q < .5 ? t0 + (t1 - t0) * (1 - Math.cos(a)) : t1 - (t1 - t0) * (1 - Math.cos(a)); pts.push(m(t, 7.95 + Math.sin(a) * .6)); } return linie([m(t0, 7.2), ...pts, m(t1, 7.2)]); };
        bm += bo(.14, .5) + " " + bo(.5, .86);
        for (const t of [.32, .68]) { const c = m(t, 8.2), rr = FOC / tief(c[0], c[1]) * .12; const p = pr(...c); bm += ` M${r(p[0] - rr)} ${r(p[1])}a${r(rr)} ${r(rr)} 0 1 0 ${r(2 * rr)} 0a${r(rr)} ${r(rr)} 0 1 0 ${r(-2 * rr)} 0`; }
        g += `<path d="${bm}" stroke="#8a3c2c" stroke-width=".16" fill="none"/>`; }
      g += `<path d="${poly([m(.16, 9.2), m(.84, 9.2), m(.84, 12.4), m(.5, 12.9), m(.16, 12.4)])}" fill="${GL}"/><path d="${linie([m(.5, 9.2), m(.5, 12.8)])}" stroke="${ST}" stroke-width=".22"/>`;
    }
    g += `<path d="${linie([...skal(1.04).map(([x, y]) => [x, y, z0])])}" stroke="#e8c0a8" stroke-width=".3" fill="none"/>`;
    const w0 = pr(xm, yv + .03, 7.15), w1 = pr(xm, yv + .03, 8.65), wh = w0[1] - w1[1], [c1, c2] = wappen[wi];
    g += `<path d="M${r(w0[0] - wh * .38)} ${r(w1[1])} h${r(wh * .76)} v${r(wh * .55)} q0 ${r(wh * .38)} ${r(-wh * .38)} ${r(wh * .45)} q${r(-wh * .38)} ${r(-wh * .07)} ${r(-wh * .38)} ${r(-wh * .45)} Z" fill="${c1}" stroke="#d8b04a" stroke-width="${r(wh * .05)}"/>`;
    g += wi === 0 ? `<rect x="${r(w0[0] - wh * .38)}" y="${r(w1[1] + wh * .33)}" width="${r(wh * .76)}" height="${r(wh * .3)}" fill="${c2}"/>` : `<path d="M${r(w0[0] - wh * .07)} ${r(w1[1])} h${r(wh * .14)} v${r(wh * .95)} h${r(-wh * .14)} Z M${r(w0[0] - wh * .38)} ${r(w1[1] + wh * .3)} h${r(wh * .76)} v${r(wh * .14)} h${r(-wh * .76)} Z" fill="${c2}"/>`;
    const tip = [xm, yv - .4, ze + 6.6];
    const helm = poly([[xa - .2, KYS, ze], [xa + .9, yv + .1, ze], [xm, yv + .2, ze], [xb - .9, yv + .1, ze], [xb + .2, KYS, ze], [...tip]]);
    g += `<path d="${helm}" fill="${RAUTEN}"/><path d="${helm}" fill="${HELMLICHT}"/>`;
    const tp = pr(...tip), tp2 = pr(tip[0], tip[1], tip[2] + 1.8);
    g += `<path d="M${P(tp)} L${P(tp2)}" stroke="#d8b04a" stroke-width=".6"/><circle cx="${r(tp2[0])}" cy="${r(tp2[1])}" r=".55" fill="#e8c35a"/>`;
    return g;
  };
  k += erker(KX0, KX0 + 3.6, 1) + erker(KX1 - 3.6, KX1, 0);
  KAUF.erker = pr(KX1 - 1.8, KYS + 1.4, 10.4);
  KAUF.wappen = pr(KX1 - 1.8, KYS + 1.6, 7.6);
  KAUF.figur = figur[3];
  S.teil({ id: "kaufhaus", de: "das Historische Kaufhaus", syl: "his-TO-ri-sche KAUF-haus", it: "lo storico emporio", itSyl: "STO-ri-co em-PO-rio", en: "Historical Merchants' Hall",
    x: 0, y: 0, kunst: k, tipp: "Das rote Kaufhaus ist fast 500 Jahre alt. Früher wurden hier die Waren der Händler gewogen und verzollt. Unten ist ein Laubengang.",
    zoom: { x: 14, y: 106, w: 96, h: 64 },
    unter: [
      { id: "figur", de: "die Figur", syl: "fi-GUR", it: "la statua", itSyl: "STA-tu-a", en: "statue", x: KAUF.figur.x, y: KAUF.figur.y, kunst: flaeche(-KAUF.figur.h * .3, -KAUF.figur.h * 1.12, KAUF.figur.h * .6, KAUF.figur.h * 1.15, 0.4),
        tipp: "Vier Habsburger stehen an der Fassade: Kaiser Maximilian I., sein Sohn Philipp der Schöne, Kaiser Karl V. und Kaiser Ferdinand I." },
      { id: "erker", de: "der Erker", syl: "ER-ker", it: "il bovindo", itSyl: "bo-VIN-do", en: "oriel", x: KAUF.erker[0], y: KAUF.erker[1], kunst: flaeche(-4, -15, 8, 13),
        tipp: "Der Erker ragt aus der Wand heraus und steht auf einer Konsole. Oben trägt er ein Türmchen aus bunten Ziegeln." },
      { id: "wappen", de: "das Wappen", syl: "WAP-pen", it: "lo stemma", itSyl: "STEM-ma", en: "coat of arms", x: KAUF.wappen[0], y: KAUF.wappen[1], kunst: flaeche(-2.4, -2.6, 4.8, 3.8, 0.6),
        tipp: "Rot-weiß-rot ist das Wappen von Österreich. Freiburg gehörte über 400 Jahre zu Habsburg (1368–1805)." },
    ] });
}

/* =====================================================================
   7 — DAS CAFÉ (Platzhaus im Osten, Tische auf dem Platz) — Lupe:
       Schwarzwälder Kirschtorte, Sonnenschirm
   ===================================================================== */
const CAFE = {};
{
  const X0 = 44, X1 = 64, H = 15;
  let k = `<path d="${fq(KYS, X0, 0, X1, H)}" fill="#e6d6b8"/><path d="${fq(KYS, X0, 0, X1, H)}" fill="${S.lg("cafeschatten", [[0, "#2a2018", 0.2], [1, "#2a2018", 0.08]])}"/>`;
  k += `<path d="${poly([[X0, KYS, H], [X1, KYS, H], [X1 - 1, KYS - 7, H + 6.4], [X0 + 1, KYS - 7, H + 6.4]])}" fill="${S.lg("cafedach", [[0, "#6b4a3e"], [1, "#8f6656"]])}"/>`;
  /* Gesimse, Fenster mit Gewänden und grünen Läden, Ladenzone mit Schaufenstern */
  k += `<path d="${fq(KYS, X0, H - .6, X1, H + .2)}" fill="#c8b08e"/><path d="${fq(KYS, X0, 4, X1, 4.6)}" fill="#c8b08e"/><path d="${fq(KYS, X0, 8.8, X1, 9.1)}" fill="#d4c0a0"/>`;
  for (let e = 0; e < 3; e++) for (let i = 0; i < 4; i++) {
    const xm = X0 + 2.8 + i * 4.8, z = 5.4 + e * 3.1;
    k += `<path d="${fq(KYS, xm - .9, z - .2, xm + .9, z + 2.3)}" fill="#cdb898"/><path d="${fq(KYS, xm - .7, z, xm + .7, z + 2.1)}" fill="#4a5058"/>`;
    k += `<path d="${fq(KYS, xm - 1.45, z, xm - .95, z + 2.1)}" fill="#3f6a44"/><path d="${fq(KYS, xm + .95, z, xm + 1.45, z + 2.1)}" fill="#3f6a44"/>`;
  }
  /* Ladenzone: Tür (Glas, Messinggriff), Schaufenster mit Tortenauslage auf drei Borden, Lichtreflex */
  k += `<path d="${fq(KYS, X0 + .3, 0, X0 + 1.7, 3.3)}" fill="#5a3a2a"/><path d="${fq(KYS, X0 + .5, .3, X0 + 1.5, 3)}" fill="#3a3a40"/><path d="${fq(KYS, X0 + 1.2, 1.4, X0 + 1.35, 1.6)}" fill="#d8b04a"/>`;
  for (let i = 0; i < 3; i++) {
    const xa = X0 + 2 + i * 5.6, xb = xa + 4.6;
    k += `<path d="${fq(KYS, xa - .2, .4, xb + .2, 3.5)}" fill="#5a3a2a"/><path d="${fq(KYS, xa, .6, xb, 3.3)}" fill="#3a3530"/>`;
    for (const z of [.9, 1.8, 2.6]) {
      k += `<path d="${fq(KYS, xa + .1, z - .08, xb - .1, z)}" fill="#d8d0c0"/>`;
      for (let x = xa + .4; x < xb - .3; x += .75) { const f = ["#3a2010", "#f4ece0", "#c86a8a", "#e8c070", "#7d0c1f"][Math.floor(rnd() * 5)]; k += `<path d="${fq(KYS, x, z, x + .5, z + .32)}" fill="${f}"/><path d="${fq(KYS, x, z + .32, x + .5, z + .38)}" fill="#fffaf0"/>`; }
    }
    k += `<path d="${poly([[xa + .6, KYS, 3.3], [xa + 1.6, KYS, 3.3], [xa + .9, KYS, .6], [xa - .1, KYS, .6]])}" fill="#fff" opacity=".18"/>`;
  }
  k += `<path d="${poly([[X0 + .5, KYS, 4.4], [X1 - .5, KYS, 4.4], [X1 - .5, KYS + 2.2, 3.5], [X0 + .5, KYS + 2.2, 3.5]])}" fill="#7a2a2a"/>`;
  for (let x = X0 + 1.5; x < X1 - .5; x += 2) k += `<path d="${poly([[x, KYS + .1, 4.35], [x + 1, KYS + .1, 4.35], [x + 1, KYS + 2.2, 3.5], [x, KYS + 2.2, 3.5]])}" fill="#efe3c8"/>`;
  const sc = pr(46.8, KYS + .1, 5.05), ss = FOC / tief(46.8, KYS);
  k += `<text x="${r(sc[0])}" y="${r(sc[1])}" font-size="${r(ss * 1.1)}" text-anchor="middle" fill="#7a2a2a" font-family="Georgia,serif" font-style="italic" font-weight="bold">Café</text>`;
  /* der Bistrotisch vor dem Café, zwei Stühle, daneben der Sonnenschirm auf eigenem Ständer */
  const stuhl = (x, y, sd) => {
    const f = fuss(x, y), s = f.s;
    let g = wurf([[x - .2, y, .9], [x + .2, y, .9], [x - .2, y + .4, .45], [x + .2, y + .4, .45]], .22);
    g += `<path d="M${r(f.x - .2 * s)} ${r(f.y)} L${r(f.x - .2 * s)} ${r(f.y - .46 * s)} M${r(f.x + .2 * s)} ${r(f.y)} L${r(f.x + .2 * s)} ${r(f.y - .46 * s)}" stroke="#2a2a2a" stroke-width="${r(.05 * s)}"/>`;
    g += `<path d="M${r(f.x - .24 * s)} ${r(f.y - .46 * s)} h${r(.48 * s)} l${r(-.05 * s)} ${r(-.06 * s)} h${r(-.38 * s)} Z" fill="#6a4a30"/>`;
    g += `<path d="M${r(f.x + sd * .2 * s)} ${r(f.y - .46 * s)} L${r(f.x + sd * .23 * s)} ${r(f.y - .9 * s)} M${r(f.x - sd * .1 * s)} ${r(f.y - .5 * s)} L${r(f.x - sd * .08 * s)} ${r(f.y - .86 * s)}" stroke="#2a2a2a" stroke-width="${r(.04 * s)}"/>`;
    g += `<path d="M${r(f.x - sd * .1 * s)} ${r(f.y - .78 * s)} L${r(f.x + sd * .23 * s)} ${r(f.y - .82 * s)} L${r(f.x + sd * .22 * s)} ${r(f.y - .66 * s)} L${r(f.x - sd * .1 * s)} ${r(f.y - .62 * s)} Z" fill="#6a4a30"/>`;
    return g;
  };
  const TX0 = 51, TY0 = -73.5, PX = 51.4, PY = -76.4;
  /* Schatten des Schirms (Dach rund 2,4 m hoch) */
  { const pts = []; for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; pts.push([PX + Math.cos(a) * 1.5, PY + Math.sin(a) * 1.5, 2.3]); } k += wurf(pts.map(([x, y, z]) => [x + SCH[0] * z, y + SCH[1] * z, 0]), .2); }
  k += stuhl(51.9, -74.3, 1);
  const f = fuss(TX0, TY0), s0 = f.s;
  k += wurf([[TX0 - .36, TY0, .75], [TX0 + .36, TY0, .75], [TX0, TY0 + .36, .75], [TX0, TY0 - .36, .75]], .25);
  k += `<path d="M${r(f.x)} ${r(f.y)} V${r(f.y - .74 * s0)}" stroke="#3a3a3a" stroke-width="${r(.06 * s0)}"/><path d="M${r(f.x - .25 * s0)} ${r(f.y)} h${r(.5 * s0)}" stroke="#3a3a3a" stroke-width="${r(.05 * s0)}"/>`;
  k += `<ellipse cx="${r(f.x)}" cy="${r(f.y - .75 * s0)}" rx="${r(.4 * s0)}" ry="${r(.1 * s0)}" fill="#ece6da" stroke="#9a9488" stroke-width="${r(.015 * s0)}"/>`;
  /* Kaffeetasse */
  k += `<path d="M${r(f.x + .2 * s0)} ${r(f.y - .78 * s0)} h${r(.1 * s0)} v${r(-.06 * s0)} h${r(-.1 * s0)} Z" fill="#fbfaf6"/><ellipse cx="${r(f.x + .25 * s0)}" cy="${r(f.y - .78 * s0)}" rx="${r(.08 * s0)}" ry="${r(.02 * s0)}" fill="#f2f0ea"/>`;
  /* die Schwarzwälder Kirschtorte auf dem Tortenständer (links auf dem Tisch): dunkle Schokoböden, Sahne,
     Schokoraspel an Rand und Deckel, zehn Sahnetupfen mit je einer Kirsche; vorn ein Stück herausgeschnitten */
  {
    const tx = f.x - .14 * s0, ty = f.y - .76 * s0, s = s0 * 1.6, tr = .15 * s, th = .12 * s;
    let g = `<path d="M${r(tx)} ${r(ty)} v${r(-.06 * s)}" stroke="#c9c2b4" stroke-width="${r(.02 * s)}"/><ellipse cx="${r(tx)}" cy="${r(ty - .06 * s)}" rx="${r(tr * 1.18)}" ry="${r(tr * .26)}" fill="#f2efe8"/>`;
    const y0 = ty - .065 * s;
    g += `<path d="M${r(tx - tr)} ${r(y0)} v${r(-th)} a${r(tr)} ${r(tr * .25)} 0 0 1 ${r(2 * tr)} 0 v${r(th)} a${r(tr)} ${r(tr * .25)} 0 0 1 ${r(-2 * tr)} 0 Z" fill="${S.lg("sahne", [[0, "#fbf8f1"], [0.7, "#efe9dc"], [1, "#d9d0bf"]], 0, 0, 1, 0)}"/>`;
    /* Schokoraspel am Rand: dichter Kranz unten */
    let ra = "";
    for (let i = 0; i < 44; i++) { const x = tx - tr + rnd() * 2 * tr, yy = y0 - rnd() * th * .55; ra += `M${r(x)} ${r(yy)}h${r(.016 * s)} `; }
    g += `<path d="${ra}" stroke="#3a2010" stroke-width="${r(.008 * s)}"/>`;
    /* angeschnitten: drei dunkle Böden, Sahne dazwischen, Kirschen in der Füllung */
    g += `<path d="M${r(tx - tr * .1)} ${r(y0 + tr * .05)} L${r(tx + tr * .55)} ${r(y0 + tr * .2)} L${r(tx + tr * .55)} ${r(y0 + tr * .2 - th)} L${r(tx - tr * .1)} ${r(y0 + tr * .05 - th)} Z" fill="#3a2010"/>`;
    for (const z of [.25, .55, .82]) g += `<path d="M${r(tx - tr * .1)} ${r(y0 + tr * .05 - th * z)} L${r(tx + tr * .55)} ${r(y0 + tr * .2 - th * z)}" stroke="#fbf6ea" stroke-width="${r(th * .14)}"/>`;
    for (const q of [.2, .5]) g += `<circle cx="${r(tx + tr * q)}" cy="${r(y0 + tr * (.08 + q * .2) - th * .4)}" r="${r(th * .07)}" fill="#8a1424"/>`;
    g += `<ellipse cx="${r(tx)}" cy="${r(y0 - th)}" rx="${r(tr)}" ry="${r(tr * .25)}" fill="#fffdf8"/>`;
    let de = "";
    for (let i = 0; i < 22; i++) { const a = rnd() * Math.PI * 2, q = Math.sqrt(rnd()) * .45; de += `M${r(tx + Math.cos(a) * tr * q)} ${r(y0 - th + Math.sin(a) * tr * .25 * q)}h${r(.014 * s)} `; }
    g += `<path d="${de}" stroke="#3a2010" stroke-width="${r(.009 * s)}"/>`;
    for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2, cx = tx + Math.cos(a) * tr * .76, cy = y0 - th + Math.sin(a) * tr * .19; g += `<circle cx="${r(cx)}" cy="${r(cy - .012 * s)}" r="${r(.024 * s)}" fill="#fffaf0"/><circle cx="${r(cx)}" cy="${r(cy - .034 * s)}" r="${r(.015 * s)}" fill="#7d0c1f"/><circle cx="${r(cx - .005 * s)}" cy="${r(cy - .039 * s)}" r="${r(.004 * s)}" fill="#fff" opacity=".8"/>`; }
    k += g;
    CAFE.torte = { x: tx, y: y0 - th * .5, s };
  }
  k += stuhl(50.1, -74.4, -1);
  /* der Sonnenschirm: Kreuzfuß, Mast neben dem Tisch, Bespannung rot-creme */
  {
    const p = fuss(PX, PY), s = p.s;
    k += `<path d="M${r(p.x - .35 * s)} ${r(p.y + .02 * s)} L${r(p.x + .35 * s)} ${r(p.y - .02 * s)} M${r(p.x - .15 * s)} ${r(p.y - .06 * s)} L${r(p.x + .15 * s)} ${r(p.y + .06 * s)}" stroke="#4a4a4a" stroke-width="${r(.07 * s)}" stroke-linecap="round"/>`;
    k += `<path d="M${r(p.x)} ${r(p.y)} V${r(p.y - 2.45 * s)}" stroke="#d8d2c4" stroke-width="${r(.05 * s)}"/>`;
    let g = "";
    for (let i = 0; i < 8; i++) { const a = -1.5 + i * .375, b = a + .375; g += `<path d="M${r(p.x)} ${r(p.y - 2.9 * s)} L${r(p.x + a * s)} ${r(p.y - 2.28 * s)} Q${r(p.x + (a + b) / 2 * s)} ${r(p.y - 2.18 * s)} ${r(p.x + b * s)} ${r(p.y - 2.28 * s)} Z" fill="${i % 2 ? "#f4ecd8" : "#7a2a2a"}"/>`; }
    k += g + `<path d="M${r(p.x - 1.5 * s)} ${r(p.y - 2.28 * s)} L${r(p.x)} ${r(p.y - 2.9 * s)} L${r(p.x + 1.5 * s)} ${r(p.y - 2.28 * s)}" stroke="#000" stroke-opacity=".15" stroke-width="${r(.04 * s)}" fill="none"/>`;
    CAFE.schirm = { x: p.x, y: p.y - 2.5 * s, s };
  }
  S.teil({ id: "cafe", de: "das Café", syl: "ca-FÉ", it: "il caffè", itSyl: "caf-FÈ", en: "café", x: 0, y: 0, kunst: k,
    tipp: "Rund um den Münsterplatz sitzt man im Café und schaut auf den Markt.",
    zoom: { x: 0, y: 168, w: 54, h: 36 },
    unter: [
      { id: "kirschtorte", de: "die Schwarzwälder Kirschtorte", syl: "SCHWARZ-wäl-der KIRSCH-tor-te", it: "la torta Foresta Nera", itSyl: "TOR-ta fo-RE-sta NE-ra", en: "Black Forest cake", x: Math.max(28, CAFE.torte.x), y: CAFE.torte.y, kunst: flaeche(CAFE.torte.x - Math.max(28, CAFE.torte.x) - 1.6, -1.6, 3.2, 2.6, 0.4),
        tipp: "Schokoladenbiskuit, Sahne und Kirschen — die berühmteste Torte aus dem Schwarzwald." },
      { id: "sonnenschirm", de: "der Sonnenschirm", syl: "SON-nen-schirm", it: "l'ombrellone", itSyl: "om-brel-LO-ne", en: "parasol", x: Math.max(18, CAFE.schirm.x), y: CAFE.schirm.y, kunst: flaeche(CAFE.schirm.x - Math.max(18, CAFE.schirm.x) - CAFE.schirm.s * 1.4, -CAFE.schirm.s * .4, CAFE.schirm.s * 2.8, CAFE.schirm.s * .6, 0.5) },
    ] });
}

/* ---------- die Stände im Hintergrund (gehören zum Wort „der Marktstand“) ---------- */
let FERNSTAENDE = "";
{
  let k = "";
  const zelt = (x, y, dach, waren) => {
    const f = fuss(x, y), s = f.s, w = 3 * s, h = 2.5 * s;
    let g = schlag(x, y, 3, 2.6, .28);
    for (const d of [-.47, .47]) g += `<path d="M${r(f.x + d * w)} ${r(f.y)} V${r(f.y - h)}" stroke="#bfbab0" stroke-width="${r(Math.max(.2, .05 * s))}"/>`;
    g += `<rect x="${r(f.x - w * .45)}" y="${r(f.y - .85 * s)}" width="${r(w * .9)}" height="${r(.85 * s)}" fill="#e9e4d8"/>`;
    for (let i = 0; i < 5; i++) g += `<rect x="${r(f.x - w * .42 + i * w * .17)}" y="${r(f.y - 1.05 * s)}" width="${r(w * .15)}" height="${r(.3 * s)}" fill="${waren[i % waren.length]}"/>`;
    g += `<path d="M${r(f.x - w * .56)} ${r(f.y - h)} L${r(f.x - w * .3)} ${r(f.y - h - .55 * s)} L${r(f.x + w * .3)} ${r(f.y - h - .55 * s)} L${r(f.x + w * .56)} ${r(f.y - h)} Z" fill="${dach[0]}"/>`;
    g += `<rect x="${r(f.x - w * .56)}" y="${r(f.y - h)}" width="${r(w * 1.12)}" height="${r(.32 * s)}" fill="${dach[1]}"/>`;
    return g;
  };
  const schirm = (x, y, farben, waren) => {
    const f = fuss(x, y), s = f.s;
    let g = schlag(x, y, 2.4, 2.6, .26);
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
  for (const [yr, x0, x1, dx] of [[-67, -46, 28, 8.4], [-57, -44, 26, 9], [-43, -40, 24, 9.4], [-31, -38, 26, 8.8]]) {
    for (let x = x0 + rnd() * 2; x < x1; x += dx + rnd() * 2.4) {
      const y = yr + (rnd() - .5) * 2.6;
      const p = pr(x, y, 0);
      if (p[0] < 128 && y < -60) continue;
      if (p[0] > 80 && p[0] < 162 && tief(x, y) < 34) continue;
      staende.push([x, y, rnd() < .3 ? "s" : "z", DACH[Math.floor(rnd() * DACH.length)], WAREN[Math.floor(rnd() * WAREN.length)]]);
    }
  }
  staende.sort((a, b) => tief(b[0], b[1]) - tief(a[0], a[1])).forEach(([x, y, art, d, w]) => { k += art === "s" ? schirm(x, y, d, w) : zelt(x, y, d, w); });
  FERNSTAENDE = k;
}

/* =====================================================================
   10 — DER MARKTSTAND (Händlerstand mit Schirm) — Lupe: Spargel, Kirschen
   ===================================================================== */
/* Ort im Weltraum neben einem Punkt: rechts (+) / zur Kamera hin (+), in Metern */
const neben = (x, y, re, vor) => [x + re * RV[0] - vor * FV[0], y + re * RV[1] - vor * FV[1]];
/* Schatten in Bildkoordinaten eines Teils, das bei (fx|fy) steht */
const schlagLokal = (f, x, y, w, h, op) => `<g transform="translate(${-f.x},${-f.y})">${schlag(x, y, w, h, op)}</g>`;
const MS = {};
{
  const f = fuss(52, -41), s = f.s, x = f.x, y = f.y;
  let k = FERNSTAENDE + schlag(52, -41, 3.2, 2.6, .26);
  /* Schatten des Marktschirms (Dach in 2,6 m Höhe) */
  { const c = neben(52, -41, .25, 0), pts = []; for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; pts.push([c[0] + Math.cos(a) * 1.6 + SCH[0] * 2.6, c[1] + Math.sin(a) * 1.6 + SCH[1] * 2.6, 0]); } k += wurf(pts, .34); }
  /* Schirmstange (hinter dem Tisch), Tisch mit Tuch */
  k += `<path d="M${r(x + .25 * s)} ${r(y - .3 * s)} V${r(y - 2.5 * s)}" stroke="#d8d2c4" stroke-width="${r(.06 * s)}"/>`;
  k += `<path d="M${r(x - 1.5 * s)} ${r(y)} V${r(y - .8 * s)} H${r(x + 1.5 * s)} V${r(y)}" fill="none" stroke="#5a4a3a" stroke-width="${r(.06 * s)}"/>`;
  k += `<rect x="${r(x - 1.55 * s)}" y="${r(y - .9 * s)}" width="${r(3.1 * s)}" height="${r(.55 * s)}" fill="#f2efe6"/><rect x="${r(x - 1.55 * s)}" y="${r(y - .4 * s)}" width="${r(3.1 * s)}" height="${r(.08 * s)}" fill="#c8382c"/>`;
  /* Gemüsekisten unter dem Tisch */
  k += `<rect x="${r(x - 1.3 * s)}" y="${r(y - .3 * s)}" width="${r(.7 * s)}" height="${r(.3 * s)}" fill="#a8824e"/><rect x="${r(x + .5 * s)}" y="${r(y - .28 * s)}" width="${r(.7 * s)}" height="${r(.28 * s)}" fill="#9a7444"/>`;
  /* Spargel: flache Holzkiste mit liegenden Bündeln (einzelne weiße Stangen, die Köpfe alle nach rechts,
     gelblich-violett, links die runden Schnittflächen, grüne Banderole) und ein aufrecht stehendes Bündel */
  const kx = x - 1.5 * s, ky = y - .9 * s, kw = .62 * s, SL = .24 * s, SD = .017 * s;
  k += `<path d="M${r(kx)} ${r(ky)} h${r(kw)} l${r(-.04 * s)} ${r(-.1 * s)} h${r(-kw + .08 * s)} Z" fill="#b48a52"/>`;
  /* ein liegendes Bündel als Zylinder (einmal gezeichnet, per <use> versetzt): runde Stirnseite mit den
     Stangenquerschnitten, Längslinien, gelblich-violette gerundete Köpfe alle nach rechts, grüne Banderole */
  {
    const R = 1, Lb = 7.2;
    let g = `<rect x="0" y="${-R}" width="${Lb}" height="${2 * R}" rx=".3" fill="${S.lg("spargelrund", [[0, "#fffdf4"], [.45, "#f2ecd8"], [1, "#c8bea0"]], 0, 0, 0, 1)}"/>`;
    g += `<path d="M.2 -.55H${Lb - .1}M.2 -.1H${Lb}M.2 .35H${Lb - .1}M.2 .75H${Lb - .3}" stroke="#d4caa8" stroke-width=".07"/>`;
    for (const [dy, dx] of [[-.78, .1], [-.38, .45], [.02, .2], [.42, .5], [.8, .15], [-.58, .7], [.22, .75]]) g += `<ellipse cx="${r(Lb + dx)}" cy="${dy}" rx=".55" ry=".3" fill="${dx > .4 ? "#c8a6b4" : "#dcc690"}"/><ellipse cx="${r(Lb + dx + .15)}" cy="${r(dy - .08)}" rx=".22" ry=".1" fill="#fff6e0" opacity=".7"/>`;
    g += `<ellipse cx="0" cy="0" rx=".55" ry="${R}" fill="#e6dcc0"/>`;
    for (const [dx, dy] of [[0, -.65], [0, -.2], [0, .25], [0, .68], [-.25, -.42], [-.25, .02], [-.25, .46], [.2, .05]]) g += `<circle cx="${dx}" cy="${dy}" r=".2" fill="#f4eed8" stroke="#c8bc98" stroke-width=".05"/>`;
    g += `<rect x="${Lb * .42}" y="${-R - .05}" width="1" height="${2 * R + .1}" fill="#3f7a4a"/><rect x="${Lb * .42}" y="${-R - .05}" width="1" height=".5" fill="#6aa070"/>`;
    S.def(`<g id="${S.id("spargelbund")}">${g}</g>`);
  }
  const buendel = (bx, by) => `<use href="#${S.id("spargelbund")}" transform="translate(${r(bx)} ${r(by)}) scale(${r(SL / 7.6 * 1000) / 1000})"/>`;
  k += buendel(kx + .04 * s, ky - .11 * s) + buendel(kx + .3 * s, ky - .12 * s) + buendel(kx + .1 * s, ky - .19 * s);
  {
    /* das stehende Bündel: Köpfe oben */
    const ux = kx + kw + .1 * s, uy = ky;
    let st = "", ko = "";
    for (let i = 0; i < 7; i++) { const xx = ux - SD * 3 + i * SD; st += `M${r(xx)} ${r(uy)}V${r(uy - SL)} `; ko += `<ellipse cx="${r(xx)}" cy="${r(uy - SL - SD * .4)}" rx="${r(SD * .58)}" ry="${r(SD * 1.1)}" fill="${i % 2 ? "#d8c08a" : "#c8a6b4"}"/>`; }
    k += `<ellipse cx="${r(ux)}" cy="${r(uy)}" rx="${r(SD * 3.6)}" ry="${r(SD * 1.2)}" fill="#e4dcc4"/><path d="${st}" stroke="#f6f2e2" stroke-width="${r(SD)}"/>${ko}<path d="M${r(ux - SD * 3.6)} ${r(uy - SL * .4)}H${r(ux + SD * 3.6)}" stroke="#3f7a4a" stroke-width="${r(SD * 2.2)}"/>`;
  }
  k += `<path d="M${r(kx)} ${r(ky)} h${r(kw)}" stroke="#8a643a" stroke-width="${r(.03 * s)}"/>`;
  MS.spargel = { x: x - 1.08 * s, y: y - .62 * s };
  /* Kirschen: Spankörbe (helle Holzspan-Geflechte mit Henkel), kleine dunkelrote Kirschen mit Stielen */
  for (let i = 0; i < 3; i++) {
    const cx = x - .38 * s + i * .42 * s, cy = y - .9 * s, bw = .34 * s, bh = .13 * s;
    let g = `<path d="M${r(cx - bw / 2)} ${r(cy - bh)} L${r(cx - bw / 2 + .03 * s)} ${r(cy)} H${r(cx + bw / 2 - .03 * s)} L${r(cx + bw / 2)} ${r(cy - bh)} Z" fill="#dcc08a"/>`;
    for (let j = 1; j < 4; j++) g += `<path d="M${r(cx - bw / 2 + .01 * s)} ${r(cy - bh + j * bh / 4)} H${r(cx + bw / 2 - .01 * s)}" stroke="#b89a60" stroke-width="${r(.008 * s)}"/>`;
    /* Kirschen: dichte Haufen, oben gewölbt */
    for (let j = 0; j < 19; j++) {
      const u = rnd() * 2 - 1, px = cx + u * bw * .46, py = cy - bh - .015 * s - (1 - u * u) * .05 * s + rnd() * .02 * s;
      g += `<circle cx="${r(px)}" cy="${r(py)}" r="${r(.016 * s)}" fill="${rnd() < .55 ? "#6e0a18" : "#8e1424"}"/>`;
      if (j % 3 === 0) g += `<path d="M${r(px)} ${r(py - .012 * s)} q${r(.01 * s)} ${r(-.03 * s)} ${r(.025 * s)} ${r(-.04 * s)}" stroke="#5a6a2a" stroke-width="${r(.004 * s)}" fill="none"/>`;
      if (j % 4 === 1) g += `<circle cx="${r(px - .005 * s)}" cy="${r(py - .006 * s)}" r="${r(.004 * s)}" fill="#fff" opacity=".7"/>`;
    }
    g += `<path d="M${r(cx - bw / 2 + .02 * s)} ${r(cy - bh)} Q${r(cx)} ${r(cy - bh - .2 * s)} ${r(cx + bw / 2 - .02 * s)} ${r(cy - bh)}" stroke="#c8a46a" stroke-width="${r(.014 * s)}" fill="none"/>`;
    k += g;
  }
  MS.kirschen = { x: x + .04 * s, y: y - 1.05 * s };
  /* Erdbeerschalen und Salat rechts */
  for (let i = 0; i < 2; i++) {
    const ex = x + .72 * s + i * .3 * s, ey = y - .9 * s;
    k += `<rect x="${r(ex - .12 * s)}" y="${r(ey - .07 * s)}" width="${r(.24 * s)}" height="${r(.07 * s)}" fill="#6a8a3a"/>`;
    for (let j = 0; j < 7; j++) k += `<circle cx="${r(ex - .09 * s + j * .03 * s)}" cy="${r(ey - .08 * s - (j % 2) * .015 * s)}" r="${r(.022 * s)}" fill="#d8302a"/>`;
  }
  for (let i = 0; i < 2; i++) k += `<circle cx="${r(x + 1.36 * s)}" cy="${r(y - 1 * s - i * .06 * s)}" r="${r(.11 * s - i * .03 * s)}" fill="${i ? "#9ac85a" : "#6a9a3a"}"/>`;
  /* Preistafeln */
  k += `<rect x="${r(x - .48 * s)}" y="${r(y - .72 * s)}" width="${r(1 * s)}" height="${r(.28 * s)}" fill="#2a2e2a"/><text x="${r(x + .02 * s)}" y="${r(y - .52 * s)}" font-size="${r(.16 * s)}" text-anchor="middle" fill="#f4f0e2" font-family="Comic Sans MS,cursive">Kirschen 6 €</text>`;
  k += `<rect x="${r(x - 1.52 * s)}" y="${r(y - .72 * s)}" width="${r(.96 * s)}" height="${r(.28 * s)}" fill="#2a2e2a"/><text x="${r(x - 1.04 * s)}" y="${r(y - .53 * s)}" font-size="${r(.125 * s)}" text-anchor="middle" fill="#f4f0e2" font-family="Comic Sans MS,cursive">Spargel 1 kg 12 €</text>`;
  /* großer Marktschirm (orange-weiß) */
  let sch = "";
  const ux = x + .25 * s;
  for (let i = 0; i < 8; i++) { const a = -1.6 + i * .4, b = a + .4; sch += `<path d="M${r(ux)} ${r(y - 2.95 * s)} L${r(ux + a * s)} ${r(y - 2.3 * s)} Q${r(ux + (a + b) / 2 * s)} ${r(y - 2.18 * s)} ${r(ux + b * s)} ${r(y - 2.3 * s)} Z" fill="${i % 2 ? "#f4efe2" : "#e0782a"}"/>`; }
  k += sch + `<path d="M${r(ux - 1.6 * s)} ${r(y - 2.3 * s)} L${r(ux)} ${r(y - 2.95 * s)} L${r(ux + 1.6 * s)} ${r(y - 2.3 * s)}" stroke="#000" stroke-opacity=".12" stroke-width="${r(.05 * s)}" fill="none"/>`;
  S.teil({ id: "marktstand", de: "der Marktstand", syl: "MARKT-stand", it: "la bancarella", itSyl: "ban-ca-REL-la", en: "market stall", x: 0, y: 0, kunst: k,
    tipp: "Auf der Nordseite, direkt am Münster, verkaufen Bauern aus der Region Obst, Gemüse und Blumen – alles frisch vom Hof.",
    zoom: { x: r(x - 26), y: r(y - 22), w: 48, h: 32 },
    unter: [
      { id: "spargel", de: "der Spargel", syl: "SPAR-gel", it: "l'asparago", itSyl: "a-SPA-ra-go", en: "asparagus", x: MS.spargel.x, y: MS.spargel.y, kunst: flaeche(-.46 * fuss(52, -41).s, -.42 * fuss(52, -41).s, .92 * fuss(52, -41).s, .52 * fuss(52, -41).s, 0.4),
        tipp: "Bis Ende Juni gibt es in Baden weißen Spargel. Er wächst unter der Erde und bleibt deshalb weiß." },
      { id: "kirschen", de: "die Kirschen", syl: "KIR-schen", it: "le ciliegie", itSyl: "ci-LIE-gie", en: "cherries", x: MS.kirschen.x, y: MS.kirschen.y, kunst: flaeche(-6, -1.6, 12, 3, 0.4),
        tipp: "Im Juni gibt es Kirschen vom Kaiserstuhl und aus dem Markgräflerland – im Spankorb." },
    ] });
}

/* =====================================================================
   11 — DER SOUVENIRSTAND (Holzbude: Kuckucksuhren, Bollenhut) — Lupe
   ===================================================================== */
const SV = {};
{
  const f = fuss(50, -60), s = f.s, x = f.x, y = f.y, W = 3 * s, H = 2.5 * s;
  const HOLZ = S.lg("budenholz", [[0, "#7a5230"], [0.5, "#9c6a3e"], [1, "#6e4626"]], 0, 0, 1, 0);
  let k = schlag(50, -60, 3, 2.6, .28);
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
  const UH = [[x - .38 * s, y - 1.35 * s, s * 1.1], [x + .38 * s, y - 1.4 * s, s * 1.3], [x + 1.04 * s, y - 1.3 * s, s * .95]];
  for (const [a, b, g] of UH) k += uhr(a, b, g);
  /* Theke mit Bollenhut auf dem Hutständer */
  k += `<rect x="${r(x - W / 2 - .1 * s)}" y="${r(y - .95 * s)}" width="${r(W + .2 * s)}" height="${r(.12 * s)}" fill="#c99a62"/><rect x="${r(x - W / 2)}" y="${r(y - .83 * s)}" width="${r(W)}" height="${r(.83 * s)}" fill="${HOLZ}"/>`;
  for (let i = 0; i < 6; i++) k += `<path d="M${r(x - W / 2 + (i + .5) * W / 6)} ${r(y - .8 * s)} V${r(y)}" stroke="#4a3220" stroke-width="${r(.03 * s)}"/>`;
  {
    /* der Bollenhut auf einem Hutkopf: breite weiße Krempe, darauf 14 rote Wollbollen (von vorn sieht man elf) */
    const bx = x - 1.02 * s, by = y - .95 * s, g = s * 1.25;
    k += `<path d="M${r(bx - .05 * g)} ${r(by)} v${r(-.18 * g)} h${r(.1 * g)} v${r(.18 * g)} Z" fill="#7a5230"/><ellipse cx="${r(bx)}" cy="${r(by - .24 * g)}" rx="${r(.08 * g)}" ry="${r(.1 * g)}" fill="#c99a62"/>`;
    k += `<ellipse cx="${r(bx)}" cy="${r(by - .3 * g)}" rx="${r(.3 * g)}" ry="${r(.075 * g)}" fill="${S.lg("krempe", [[0, "#ffffff"], [1, "#dcd6ca"]])}" stroke="#bdb6a6" stroke-width="${r(.01 * g)}"/>`;
    k += `<path d="M${r(bx - .07 * g)} ${r(by - .28 * g)} q-${r(.02 * g)} ${r(.14 * g)} ${r(.02 * g)} ${r(.22 * g)} M${r(bx + .07 * g)} ${r(by - .28 * g)} q${r(.02 * g)} ${r(.14 * g)} -${r(.02 * g)} ${r(.22 * g)}" stroke="#1d1d1d" stroke-width="${r(.018 * g)}" fill="none"/>`;
    const BO = S.rg("bolle", [[0, "#ff6a5a"], [0.6, "#d42a24"], [1, "#9a1414"]], 0.38, 0.32, 0.72);
    for (const [dx, dy, rr] of [[-.17, -.355, .045], [0, -.37, .047], [.17, -.355, .045], [-.085, -.335, .05], [.085, -.335, .05], [-.21, -.318, .042], [.21, -.318, .042], [0, -.318, .052], [-.1, -.4, .045], [.1, -.4, .045], [0, -.43, .045]]) k += `<circle cx="${r(bx + dx * g)}" cy="${r(by + dy * g)}" r="${r(rr * g)}" fill="${BO}"/>`;
    SV.hut = { x: bx, y: by - .36 * g, g };
  }
  /* Holzspielzeug auf der Theke */
  k += `<rect x="${r(x + .7 * s)}" y="${r(y - 1.12 * s)}" width="${r(.3 * s)}" height="${r(.17 * s)}" fill="#c8382c"/><rect x="${r(x + 1.05 * s)}" y="${r(y - 1.08 * s)}" width="${r(.24 * s)}" height="${r(.13 * s)}" fill="#3f7a4a"/><circle cx="${r(x + .45 * s)}" cy="${r(y - 1.02 * s)}" r="${r(.07 * s)}" fill="#d8a832"/>`;
  /* Dach: grün-weiß gestreift, Schild */
  k += `<path d="M${r(x - W / 2 - .25 * s)} ${r(y - H)} L${r(x)} ${r(y - H - .6 * s)} L${r(x + W / 2 + .25 * s)} ${r(y - H)} Z" fill="#2f6e44"/>`;
  for (let i = 0; i < 6; i++) k += `<path d="M${r(x - W / 2 - .25 * s + i * (W + .5 * s) / 6)} ${r(y - H)} h${r((W + .5 * s) / 12)} v${r(.22 * s)} h${r(-(W + .5 * s) / 12)} Z" fill="#f4efe2"/>`;
  k += `<rect x="${r(x - W / 2 - .25 * s)}" y="${r(y - H)}" width="${r(W + .5 * s)}" height="${r(.22 * s)}" fill="none" stroke="#2f6e44" stroke-width="${r(.03 * s)}"/>`;
  k += `<text x="${r(x)}" y="${r(y - H - .12 * s)}" font-size="${r(.24 * s)}" text-anchor="middle" fill="#f4efe2" font-family="Georgia,serif" font-weight="bold">Schwarzwald</text>`;
  /* je Uhr eine eigene Fläche; der Bollenhut sitzt frei darunter */
  const uf = UH.map(([a, b, g]) => flaeche(a - x - .24 * g, b - (y - 2 * s) - .55 * g, .48 * g, .9 * g, 0.3)).join("");
  S.teil({ id: "souvenirstand", de: "der Souvenirstand", syl: "su-ve-NIR-stand", it: "la bancarella di souvenir", itSyl: "ban-ca-REL-la di su-ve-NIR", en: "souvenir stall", x: 0, y: 0, kunst: k,
    tipp: "Hier gibt es Andenken aus dem Schwarzwald.",
    zoom: { x: r(x - 21), y: r(y - H - 7), w: 42, h: 28 },
    unter: [
      { id: "kuckucksuhr", de: "die Kuckucksuhr", syl: "KU-ckucks-uhr", it: "l'orologio a cucù", itSyl: "o-ro-LO-gio a cu-CÙ", en: "cuckoo clock", x: x, y: y - 2 * s, kunst: uf,
        tipp: "Jede volle Stunde springt ein kleiner Vogel heraus und ruft „Kuckuck“. Die Uhr läuft mit Gewichten wie Tannenzapfen." },
      { id: "bollenhut", de: "der Bollenhut", syl: "BOL-len-hut", it: "il cappello a pompon", itSyl: "cap-PEL-lo a pom-PON", en: "pompom hat (Bollenhut)", x: SV.hut.x, y: SV.hut.y, kunst: flaeche(-.27 * SV.hut.g, -.12 * SV.hut.g, .54 * SV.hut.g, .2 * SV.hut.g, 0.3),
        tipp: "Der Bollenhut gehört zur Tracht von drei Dörfern im Schwarzwald. Rote Bollen tragen unverheiratete Frauen." },
    ] });
}

/* =====================================================================
   12 — DER WURSTSTAND („Lange Rote“) mit 13 — DEM VERKÄUFER — Lupe: Brötchen
   ===================================================================== */
const WS = fuss(48.5, -46.5);
{
  const { x, y, s } = WS, W = 3.2 * s, H = 2.7 * s;
  let k = wurf([[46.9, -46.5, 2.8], [50.1, -46.5, 2.8], [50.1, -44.9, 2.8], [46.9, -44.9, 2.8]], .26);
  /* Bude: Rückwand, Seitenteile, Dach mit rot-weißer Markise */
  k += `<rect x="${r(x - W / 2)}" y="${r(y - H)}" width="${r(W)}" height="${r(H)}" fill="#f2efe8"/><rect x="${r(x - W / 2 + .1 * s)}" y="${r(y - H + .5 * s)}" width="${r(W - .2 * s)}" height="${r(1.2 * s)}" fill="#3a3430"/>`;
  k += `<rect x="${r(x - W / 2 - .2 * s)}" y="${r(y - H - .15 * s)}" width="${r(W + .4 * s)}" height="${r(.5 * s)}" fill="#c8202a"/>`;
  k += `<text x="${r(x)}" y="${r(y - H + .2 * s)}" font-size="${r(.34 * s)}" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-weight="bold" letter-spacing=".1">LANGE ROTE</text>`;
  for (let i = 0; i < 8; i++) k += `<path d="M${r(x - W / 2 - .2 * s + i * (W + .4 * s) / 8)} ${r(y - H + .35 * s)} h${r((W + .4 * s) / 8)} l${r(-.5 * (W + .4 * s) / 8)} ${r(.3 * s)} Z" fill="${i % 2 ? "#c8202a" : "#fff"}"/>`;
  WS.rauch = true;
  WS.k = k;
}
{
  const { x, y, s } = WS, tz = 1.05;
  const m = B.mensch({ id: "fbg_wurst", geschlecht: "m", pose: "servieren", blick: 14, frisur: "kurz", haarfarbe: "dunkelbraun", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "tshirt", farbe: "weiss" }, schuerze: { stueck: "schuerze", farbe: "rot" }, unterteil: { stueck: "hose", farbe: "schwarz" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" }, kopf: { stueck: "kappe", farbe: "rot" } } }, 1.76 * s);
  S.def(`<clipPath id="${S.id("theke")}"><rect x="-40" y="-60" width="80" height="${r(60 - tz * s - .2)}"/></clipPath>`);
  /* Brötchenkorb: geflochtener Korb, darin goldbraune Brötchen mit Einschnitt */
  const bk = { x: x + 1.15 * s, y: y - tz * s };
  let br = `<path d="M${r(bk.x - .3 * s)} ${r(bk.y)} l${r(-.04 * s)} ${r(-.2 * s)} h${r(.68 * s)} l${r(-.04 * s)} ${r(.2 * s)} Z" fill="#b88a50"/>`;
  for (let j = 1; j < 3; j++) br += `<path d="M${r(bk.x - .33 * s)} ${r(bk.y - j * .067 * s)} h${r(.66 * s)}" stroke="#8a6030" stroke-width="${r(.012 * s)}"/>`;
  for (let i = 0; i < 5; i++) {
    const cx = bk.x - .24 * s + i * .12 * s, cy = bk.y - .22 * s - (i % 2) * .03 * s;
    br += `<ellipse cx="${r(cx)}" cy="${r(cy)}" rx="${r(.075 * s)}" ry="${r(.045 * s)}" fill="${S.rg("broetchen", [[0, "#f0c070"], [0.7, "#d08a3a"], [1, "#a8642a"]], 0.4, 0.3, 0.7)}"/><path d="M${r(cx - .04 * s)} ${r(cy - .01 * s)} q${r(.04 * s)} ${r(-.02 * s)} ${r(.08 * s)} 0" stroke="#f6dca0" stroke-width="${r(.01 * s)}" fill="none"/>`;
  }
  /* Bude hinten, dann der Verkäufer, dann Grill und Theke davor */
  S.teil({ id: "wurststand", de: "der Wurststand", syl: "WURST-stand", it: "il chiosco delle salsicce", itSyl: "CHIO-sco del-le sal-SIC-ce", en: "sausage stand", x: 0, y: 0, kunst: WS.k + (() => {
      let g = `<rect x="${r(x - 1.7 * s)}" y="${r(y - tz * s)}" width="${r(3.4 * s)}" height="${r(tz * s)}" fill="${S.lg("thekeblech", [[0, "#e9e6de"], [1, "#c9c4b8"]])}"/>`;
      g += `<rect x="${r(x - 1.75 * s)}" y="${r(y - tz * s - .08 * s)}" width="${r(3.5 * s)}" height="${r(.1 * s)}" fill="#9aa3aa"/>`;
      /* Grillrost mit Langen Roten, Zwiebeln in der Pfanne, Brötchenkorb, Senf */
      g += `<rect x="${r(x - 1.5 * s)}" y="${r(y - tz * s - .18 * s)}" width="${r(1.6 * s)}" height="${r(.12 * s)}" fill="#2a2a2a"/>`;
      for (let i = 0; i < 5; i++) g += `<rect x="${r(x - 1.45 * s + (i % 2) * .08 * s)}" y="${r(y - tz * s - .26 * s - i * .028 * s)}" width="${r(1.5 * s)}" height="${r(.05 * s)}" rx="${r(.025 * s)}" fill="${i % 2 ? "#b8402a" : "#a8341f"}"/>`;
      g += `<ellipse cx="${r(x + .45 * s)}" cy="${r(y - tz * s - .1 * s)}" rx="${r(.32 * s)}" ry="${r(.08 * s)}" fill="#3a3a3a"/><ellipse cx="${r(x + .45 * s)}" cy="${r(y - tz * s - .13 * s)}" rx="${r(.26 * s)}" ry="${r(.05 * s)}" fill="#c8963a"/>`;
      g += br;
      /* Dampf über dem Grill: hell, wird nach oben breiter und verblasst (endet unter der Markise) */
      { const gx = x - .7 * s, gy = y - tz * s - .3 * s; let d = ""; for (let i = 0; i < 7; i++) { const t = i / 7, rr = (.13 + t * .2) * s; d += `M${r(gx + Math.sin(i * .9) * .14 * s - rr)} ${r(gy - t * .62 * s)}a${r(rr)} ${r(rr * .8)} 0 1 0 ${r(2 * rr)} 0a${r(rr)} ${r(rr * .8)} 0 1 0 ${r(-2 * rr)} 0`; }
        g += `<path d="${d}" fill="${S.lg("dampf", [[0, "#ffffff", 0], [.5, "#ffffff", .14], [1, "#ffffff", .32]], 0, 0, 0, 1)}"/>`; }
      g += `<rect x="${r(x + 1.55 * s)}" y="${r(y - tz * s - .32 * s)}" width="${r(.08 * s)}" height="${r(.3 * s)}" fill="#e8c23a"/>`;
      g += `<text x="${r(x)}" y="${r(y - tz * s * .45)}" font-size="${r(.24 * s)}" text-anchor="middle" fill="#c8202a" font-family="Arial,sans-serif" font-weight="bold">mit Zwiebeln</text>`;
      return g;
    })(), tipp: "Die „Lange Rote“ ist 35 Zentimeter lang — viel länger als das Brötchen. Man fragt: „Mit oder ohne Zwiebeln?“",
    zoom: { x: r(x - 18), y: r(y - 26), w: 36, h: 24 },
    unter: [
      { id: "broetchen", de: "das Brötchen", syl: "BRÖT-chen", it: "il panino", itSyl: "pa-NI-no", en: "bread roll", x: bk.x, y: bk.y - .12 * s, kunst: flaeche(-.38 * s, -.18 * s, .76 * s, .3 * s, 0.3),
        tipp: "Die Wurst kommt in ein Brötchen — aber sie ist so lang, dass sie links und rechts herausschaut." },
    ] });
  S.teil({ id: "verkaeufer", de: "der Verkäufer", syl: "ver-KÄU-fer", it: "il venditore", itSyl: "ven-di-TO-re", en: "vendor", x: x + .3 * s, y: y - .1 * s, kunst: `<g clip-path="url(#${S.id("theke")})">${rundeFigur(m.svg, -tz * s + .1 * s)}</g>`,
    tipp: "Der Verkäufer legt die Wurst ins Brötchen und gibt Senf dazu." });
}

/* =====================================================================
   14 — DER MANN mit 15 — DER LANGEN ROTEN im Brötchen
   ===================================================================== */
const MANN = { w: [53.5, -49.6] };
{
  const f = fuss(...MANN.w), s = f.s;
  const m = B.mensch({ id: "fbg_mann", geschlecht: "m", pose: "halten", blick: 22, frisur: "kurz", haarfarbe: "blond", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "tshirt", farbe: "blau" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" }, zubehoer: { stueck: "rucksack", farbe: "gruen_d" } } }, 1.8 * s);
  S.teil({ id: "mann", de: "der Mann", syl: "MANN", it: "l'uomo", itSyl: "UO-mo", en: "man", x: f.x, y: f.y, kunst: schlagLokal(f, ...MANN.w, .5, 1.8, .3) + rundeFigur(m.svg),
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
   16 — DIE TAUBEN (picken Krümel vor dem Wurststand)
   ===================================================================== */
{
  const nest = neben(...MANN.w, -1.6, 1.6), f = fuss(...nest), s = f.s;
  /* eine Stadttaube, etwa 32 cm lang: kleiner Kopf, grau-blauer Körper, zwei dunkle Flügelbinden,
     grün-violett schillernder Hals, dunkler Schnabel mit heller Wachshaut, rote Füße */
  const taube = (dx, dy, sp, pick) => {
    const g = s * .37, q = (a, b) => `${r(dx + sp * a * g)} ${r(dy + b * g)}`;
    let t = `<ellipse cx="${r(dx)}" cy="${r(dy + .01 * g)}" rx="${r(.36 * g)}" ry="${r(.05 * g)}" fill="#2a1e14" opacity=".25"/>`;
    /* kurze rote Beine und Zehen */
    t += `<path d="M${q(-.02, -.12)} L${q(-.03, 0)} M${q(.08, -.12)} L${q(.09, 0)} M${q(-.1, 0)} L${q(0, 0)} M${q(.04, 0)} L${q(.15, 0)}" stroke="#c8484a" stroke-width="${r(.03 * g)}" stroke-linecap="round"/>`;
    /* rundlicher Körper mit Schwanz, oben Licht */
    t += `<path d="M${q(-.56, -.24)} L${q(-.28, -.16)} Q${q(-.05, -.06)} ${q(.18, -.14)} Q${q(.34, -.22)} ${q(.3, -.36)} Q${q(.2, -.48)} ${q(-.04, -.44)} Q${q(-.24, -.38)} ${q(-.56, -.3)} Z" fill="${S.lg("taube", [[0, "#a4aebe"], [1, "#6a7486"]], 0, 0, 0, 1)}"/>`;
    /* Flügel mit zwei dunklen Binden, dunkle Schwanzbinde */
    t += `<path d="M${q(-.4, -.3)} Q${q(-.08, -.44)} ${q(.16, -.38)} Q${q(.04, -.24)} ${q(-.4, -.3)} Z" fill="#b6bfcc"/>`;
    t += `<path d="M${q(-.1, -.38)} L${q(-.18, -.29)} M${q(.01, -.38)} L${q(-.07, -.29)}" stroke="#30343e" stroke-width="${r(.035 * g)}"/><path d="M${q(-.55, -.24)} L${q(-.55, -.3)}" stroke="#30343e" stroke-width="${r(.05 * g)}"/>`;
    /* Hals (grün-violett schillernd) und kleiner Kopf — pickend: Kopf unten vorn */
    const kx = pick ? .4 : .27, ky = pick ? -.1 : -.6;
    t += `<path d="M${q(.04, -.42)} Q${q(.28, pick ? -.4 : -.48)} ${q(kx - .04, ky + .05)} L${q(kx + .05, ky - .02)} Q${q(.34, pick ? -.26 : -.36)} ${q(.26, -.26)} Z" fill="${S.lg("taubenhals", [[0, "#4f8a68"], [0.5, "#7a5a92"], [1, "#6a7486"]], 0, 0, 1, 1)}"/>`;
    t += `<circle cx="${r(dx + sp * kx * g)}" cy="${r(dy + ky * g)}" r="${r(.065 * g)}" fill="#7c8698"/>`;
    t += `<path d="M${q(kx + .05, ky + (pick ? .03 : .005))} l${r(sp * .085 * g)} ${r((pick ? .055 : .015) * g)}" stroke="#2a2a2e" stroke-width="${r(.028 * g)}" stroke-linecap="round"/><circle cx="${r(dx + sp * (kx + .06) * g)}" cy="${r(dy + (ky - .008) * g)}" r="${r(.017 * g)}" fill="#ece8de"/>`;
    t += `<circle cx="${r(dx + sp * (kx + .015) * g)}" cy="${r(dy + (ky - .02) * g)}" r="${r(.014 * g)}" fill="#d8582a"/>`;
    return t;
  };
  let k = "";
  /* Brotkrümel */
  for (let i = 0; i < 9; i++) k += `<circle cx="${r((rnd() - .5) * 1.4 * s)}" cy="${r((rnd() - .5) * .1 * s)}" r="${r(.012 * s)}" fill="#e8c890"/>`;
  k += taube(-.42 * s, -.02 * s, 1, true) + taube(.22 * s, .04 * s, -1, false) + taube(.62 * s, -.05 * s, 1, true);
  /* eine vierte Taube landet gerade: Flügel hoch */
  { const x = -.05 * s, y = -.34 * s, g = s * .37;
    k += `<path d="M${r(x - .3 * g)} ${r(y)} Q${r(x)} ${r(y + .12 * g)} ${r(x + .32 * g)} ${r(y - .02 * g)} Q${r(x + .1 * g)} ${r(y - .14 * g)} ${r(x - .3 * g)} ${r(y)} Z" fill="#8a94a6"/>`;
    k += `<path d="M${r(x - .05 * g)} ${r(y - .04 * g)} L${r(x - .45 * g)} ${r(y - .5 * g)} L${r(x - .1 * g)} ${r(y - .3 * g)} Z M${r(x + .08 * g)} ${r(y - .04 * g)} L${r(x + .3 * g)} ${r(y - .55 * g)} L${r(x + .2 * g)} ${r(y - .2 * g)} Z" fill="#a8b0c0"/>`;
    k += `<circle cx="${r(x + .36 * g)}" cy="${r(y - .06 * g)}" r="${r(.06 * g)}" fill="#6a7a8a"/><path d="M${r(x + .41 * g)} ${r(y - .05 * g)} l${r(.07 * g)} ${r(.02 * g)}" stroke="#2a2a2e" stroke-width="${r(.025 * g)}"/>`; }
  S.teil({ id: "taube", de: "die Taube", syl: "TAU-be", it: "il piccione", itSyl: "pic-CIO-ne", en: "pigeon", x: f.x, y: f.y, kunst: k + flaeche(-.62 * s, -.62 * s, 1.5 * s, .7 * s, 0.4),
    tipp: "Die Tauben warten auf Krümel. Wenn jemand ein Brötchen isst, kommen sie sofort." });
}

/* =====================================================================
   17 — DAS FAHRRAD (Hollandrad mit Korb, vorn links)
   ===================================================================== */
{
  const W = [61.4, -53.4], f = fuss(...W), s = f.s, R = .35 * s;
  const Rad = S.lg("rahmen", [[0, "#2f6e5a"], [1, "#1f4f40"]]);
  const hx = -.56 * s, vx = .56 * s, ay = -R;
  const sw = (w) => r(w * s);
  /* Schlagschatten: die zwei Räder als Ringe und der Rahmen, nach rechts hinten in die Tiefe */
  let sh = "";
  for (const o of [-.56, .56]) {
    const c = neben(...W, o, 0), pts = [];
    for (let j = 0; j <= 16; j++) { const a = j / 16 * Math.PI * 2, z = .35 + .35 * Math.sin(a); pts.push([c[0] + RV[0] * .35 * Math.cos(a) + SCH[0] * z, c[1] + RV[1] * .35 * Math.cos(a) + SCH[1] * z, 0]); }
    sh += linie(pts) + " ";
  }
  const gw = (o, z) => { const c = neben(...W, o, 0); return [c[0] + SCH[0] * z, c[1] + SCH[1] * z, 0]; };
  sh += linie([gw(-.56, .35), gw(0, .29), gw(-.24, .95), gw(-.56, .35)]) + " " + linie([gw(0, .29), gw(.47, .8), gw(.44, .98)]);
  let k = `<g transform="translate(${-f.x},${-f.y})"><path d="${sh}" stroke="#2a1e14" stroke-width="${r(.05 * s)}" opacity=".26" fill="none"/></g>`;
  /* Laufräder: Reifen, Felge, 36 Speichen, Nabe */
  for (const cx of [hx, vx]) {
    k += `<circle cx="${r(cx)}" cy="${r(ay)}" r="${r(R)}" fill="none" stroke="#1d1d1d" stroke-width="${sw(.045)}"/><circle cx="${r(cx)}" cy="${r(ay)}" r="${r(R * .9)}" fill="none" stroke="#b9bec2" stroke-width="${sw(.014)}"/>`;
    let sp = "";
    for (let i = 0; i < 18; i++) { const a = i * Math.PI / 9; sp += `M${r(cx + Math.cos(a) * .03 * s)} ${r(ay + Math.sin(a) * .03 * s)} L${r(cx + Math.cos(a + .35) * R * .89)} ${r(ay + Math.sin(a + .35) * R * .89)} `; }
    k += `<path d="${sp}" stroke="#c9cdd0" stroke-width="${sw(.005)}"/><circle cx="${r(cx)}" cy="${r(ay)}" r="${sw(.035)}" fill="#8a9096"/>`;
    /* Schutzblech, oben um das Rad */
    k += `<path d="M${r(cx - R * 1.06 * Math.cos(.35))} ${r(ay + R * 1.06 * Math.sin(.35))} A${r(R * 1.06)} ${r(R * 1.06)} 0 0 1 ${r(cx + R * 1.06 * Math.cos(.5))} ${r(ay - R * 1.06 * Math.sin(.5))}" stroke="#1f4f40" stroke-width="${sw(.03)}" fill="none"/>`;
  }
  /* Tretlager, Kettenblatt, Kette, Ritzel */
  const tl = [0, -.29 * s], st = [-.24 * s, -.9 * s], lk = [.44 * s, -.98 * s], lu = [.47 * s, -.8 * s];
  k += `<circle cx="${r(tl[0])}" cy="${r(tl[1])}" r="${sw(.1)}" fill="none" stroke="#7a8086" stroke-width="${sw(.015)}"/>`;
  k += `<path d="M${r(tl[0])} ${r(tl[1] - .1 * s)} L${r(hx)} ${r(ay - .04 * s)} M${r(tl[0])} ${r(tl[1] + .1 * s)} L${r(hx)} ${r(ay + .04 * s)}" stroke="#4a4e52" stroke-width="${sw(.012)}"/>`;
  k += `<circle cx="${r(hx)}" cy="${r(ay)}" r="${sw(.04)}" fill="none" stroke="#7a8086" stroke-width="${sw(.012)}"/>`;
  /* Kettenschutz (typisch Hollandrad) */
  k += `<path d="M${r(tl[0] + .12 * s)} ${r(tl[1] - .12 * s)} L${r(hx - .02 * s)} ${r(ay - .07 * s)} Q${r(hx - .07 * s)} ${r(ay)} ${r(hx)} ${r(ay + .02 * s)} L${r(tl[0] + .05 * s)} ${r(tl[1] - .02 * s)} Z" fill="#1f4f40" opacity=".9"/>`;
  /* Rahmen: Tiefeinsteiger — Sitzrohr, tiefes gebogenes Unterrohr, Kettenstreben, Sitzstreben, Steuerrohr, Gabel */
  k += `<path d="M${r(tl[0])} ${r(tl[1])} L${r(st[0])} ${r(st[1])} M${r(tl[0])} ${r(tl[1])} Q${r(.32 * s)} ${r(-.32 * s)} ${r(lu[0])} ${r(lu[1])} L${r(lk[0])} ${r(lk[1])} M${r(hx)} ${r(ay)} L${r(tl[0])} ${r(tl[1])} M${r(hx)} ${r(ay)} L${r(st[0] + .02 * s)} ${r(st[1] + .12 * s)} M${r(lu[0])} ${r(lu[1])} Q${r(.52 * s)} ${r(-.5 * s)} ${r(vx)} ${r(ay)}" stroke="${Rad}" stroke-width="${sw(.045)}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  /* Sattel mit Federn */
  k += `<path d="M${r(st[0])} ${r(st[1])} v${r(-.08 * s)}" stroke="#9aa0a6" stroke-width="${sw(.025)}"/><path d="M${r(st[0] - .14 * s)} ${r(st[1] - .1 * s)} q${r(.02 * s)} ${r(-.05 * s)} ${r(.14 * s)} ${r(-.05 * s)} h${r(.1 * s)} q${r(.02 * s)} ${r(.03 * s)} ${r(-.04 * s)} ${r(.06 * s)} Z" fill="#5a3a20"/>`;
  /* Lenker: Vorbau und nach hinten geschwungener Hollandlenker mit Griffen, Klingel */
  k += `<path d="M${r(lk[0])} ${r(lk[1])} l${r(-.04 * s)} ${r(-.12 * s)} q${r(-.18 * s)} ${r(-.04 * s)} ${r(-.24 * s)} ${r(.07 * s)}" stroke="#2a2a2a" stroke-width="${sw(.028)}" fill="none"/>`;
  k += `<path d="M${r(lk[0] - .27 * s)} ${r(lk[1] - .06 * s)} l${r(-.07 * s)} ${r(.03 * s)}" stroke="#5a3a20" stroke-width="${sw(.04)}" stroke-linecap="round"/><circle cx="${r(lk[0] - .12 * s)}" cy="${r(lk[1] - .13 * s)}" r="${sw(.025)}" fill="#c9cdd0"/>`;
  /* Kurbel mit zwei Pedalen */
  const ka = .9, kl = .17 * s;
  for (const sg of [1, -1]) {
    const px = tl[0] + sg * Math.cos(ka) * kl, py = tl[1] + sg * Math.sin(ka) * kl;
    k += `<path d="M${r(tl[0])} ${r(tl[1])} L${r(px)} ${r(py)}" stroke="#9aa0a6" stroke-width="${sw(.025)}" stroke-linecap="round"/><rect x="${r(px - .05 * s)}" y="${r(py - .015 * s)}" width="${sw(.1)}" height="${sw(.03)}" fill="#2a2a2a"/>`;
  }
  k += `<circle cx="${r(tl[0])}" cy="${r(tl[1])}" r="${sw(.025)}" fill="#5a6066"/>`;
  /* Gepäckträger, Rücklicht, Ständer */
  k += `<path d="M${r(hx - .2 * s)} ${r(-.72 * s)} H${r(st[0] + .02 * s)} M${r(hx - .18 * s)} ${r(-.72 * s)} L${r(hx)} ${r(ay)} M${r(hx - .2 * s)} ${r(-.68 * s)} H${r(st[0])}" stroke="#2a2a2a" stroke-width="${sw(.018)}"/>`;
  k += `<rect x="${r(hx - .28 * s)}" y="${r(-.74 * s)}" width="${sw(.07)}" height="${sw(.05)}" rx="${sw(.01)}" fill="#c8202a"/>`;
  k += `<path d="M${r(-.12 * s)} ${r(-.3 * s)} l${r(-.14 * s)} ${r(.3 * s)}" stroke="#555" stroke-width="${sw(.02)}"/>`;
  /* Korb vorn auf dem Gepäckträger mit Blumen vom Markt, darunter der Scheinwerfer */
  k += `<path d="M${r(lk[0] + .04 * s)} ${r(lk[1] + .02 * s)} h${r(.34 * s)} l${r(-.04 * s)} ${r(.25 * s)} h${r(-.26 * s)} Z" fill="#b8874a"/>`;
  for (let i = 0; i < 4; i++) k += `<path d="M${r(lk[0] + .1 * s + i * .07 * s)} ${r(lk[1] + .02 * s)} v${r(.25 * s)}" stroke="#8a5a2a" stroke-width="${sw(.008)}"/>`;
  /* im Korb: ein Bund weißer Spargel (schräg herausragend) und ein Strauß Sonnenblumen in Papier vom Markt */
  {
    const bx = lk[0] + .2 * s, by = lk[1] + .02 * s;
    let sg = "", kp = "";
    for (let i = 0; i < 6; i++) { const ox = (i - 2.5) * .016 * s; sg += `M${r(bx + ox)} ${r(by + .05 * s)}l${r(-.12 * s)} ${r(-.26 * s)} `; kp += `<ellipse cx="${r(bx + ox - .125 * s)}" cy="${r(by - .225 * s)}" rx="${r(.012 * s)}" ry="${r(.02 * s)}" fill="${i % 2 ? "#d8c08a" : "#c8a6b4"}"/>`; }
    k += `<path d="${sg}" stroke="#f6f2e2" stroke-width="${sw(.016)}"/>${kp}<path d="M${r(bx - .06 * s)} ${r(by - .08 * s)}l${r(.07 * s)} ${r(.03 * s)}" stroke="#3f7a4a" stroke-width="${sw(.03)}"/>`;
    k += `<path d="M${r(bx + .02 * s)} ${r(by + .08 * s)} L${r(bx + .2 * s)} ${r(by - .22 * s)} L${r(bx + .03 * s)} ${r(by - .26 * s)} Z" fill="#efe6d0"/>`;
    for (const [dx, dy] of [[.06, -.32], [.15, -.3], [.1, -.4]]) {
      const cx = bx + dx * s, cy = by + dy * s;
      k += `<path d="M${r(bx + .1 * s)} ${r(by - .1 * s)}L${r(cx)} ${r(cy)}" stroke="#4f7a3a" stroke-width="${sw(.01)}"/>`;
      let bl = ""; for (let j = 0; j < 10; j++) { const a = j / 10 * Math.PI * 2; bl += `M${r(cx)} ${r(cy)}l${r(Math.cos(a) * .045 * s)} ${r(Math.sin(a) * .045 * s)} `; }
      k += `<path d="${bl}" stroke="#f0c020" stroke-width="${sw(.022)}" stroke-linecap="round"/><circle cx="${r(cx)}" cy="${r(cy)}" r="${sw(.02)}" fill="#5a3a1a"/>`;
    }
  }
  k += `<path d="M${r(lu[0] + .03 * s)} ${r(lu[1] + .02 * s)} h${r(.07 * s)} l${r(.03 * s)} ${r(.03 * s)} l${r(-.03 * s)} ${r(.03 * s)} h${r(-.07 * s)} Z" fill="#d8dcdf" stroke="#555" stroke-width="${sw(.008)}"/><circle cx="${r(lu[0] + .12 * s)}" cy="${r(lu[1] + .05 * s)}" r="${sw(.018)}" fill="#fff8d0"/>`;
  S.teil({ id: "fahrrad", de: "das Fahrrad", syl: "FAHR-rad", it: "la bicicletta", itSyl: "bi-ci-CLET-ta", en: "bicycle", x: f.x, y: f.y, steht: true, kunst: k,
    tipp: "Freiburg ist Fahrradstadt und Solarstadt: Viele fahren Rad, und auf vielen Dächern liegen Solarzellen." });
}

/* =====================================================================
   18 — DIE KUNDIN (steht am Marktstand, mit dem Einkaufskorb) mit 19 — DEM KORB
   ===================================================================== */
{
  const W = neben(52, -41, 1.1, .9), f = fuss(...W), s = f.s;
  const m = B.mensch({ id: "fbg_kundin", geschlecht: "w", pose: "stehen", blick: 220, frisur: "zopf", haarfarbe: "hellbraun", haut: "hell",
    kleidung: { oberteil: { stueck: "bluse", farbe: "hellblau" }, unterteil: { stueck: "rock_knie", farbe: "beige" }, schuhe: { stueck: "sandale", farbe: "braun" } } }, 1.68 * s);
  S.teil({ id: "kundin", de: "die Kundin", syl: "KUN-din", it: "la cliente", itSyl: "cli-EN-te", en: "customer", x: f.x, y: f.y, kunst: schlagLokal(f, ...W, .5, 1.7, .3) + rundeFigur(m.svg),
    tipp: "Sie kauft auf dem Markt ein: Spargel, Kirschen und Erdbeeren." });
  /* der Einkaufskorb aus Weide hängt an ihrer rechten Hand: Henkel, Flechtwerk, oben Spargel und Salat */
  const h = m.z.handR.x > m.z.handL.x ? m.z.handR : m.z.handL, hx = h.x * m.k, hy = h.y * m.k;
  const bw = .42 * s, bh = .24 * s, oy = .12 * s;
  let k = `<path d="M${r(-bw * .42)} ${r(oy)} Q0 ${r(-.1 * s)} ${r(bw * .42)} ${r(oy)}" stroke="#8a5a2a" stroke-width="${sw2(s)}" fill="none"/>`;
  k += `<path d="M${r(-.04 * s)} ${r(oy - .04 * s)} q${r(.14 * s)} ${r(-.12 * s)} ${r(.3 * s)} ${r(-.05 * s)}" stroke="#f2eee0" stroke-width="${r(.03 * s)}" stroke-linecap="round"/>`;
  k += `<circle cx="${r(-.1 * s)}" cy="${r(oy - .02 * s)}" r="${r(.07 * s)}" fill="#7aa84a"/>`;
  k += `<path d="M${r(-bw / 2)} ${r(oy)} L${r(-bw * .4)} ${r(oy + bh)} H${r(bw * .4)} L${r(bw / 2)} ${r(oy)} Z" fill="#c09050"/>`;
  for (let j = 1; j < 4; j++) k += `<path d="M${r(-bw / 2 + j * .01 * s)} ${r(oy + j * bh / 4)} H${r(bw / 2 - j * .01 * s)}" stroke="#8a6030" stroke-width="${r(.012 * s)}"/>`;
  for (let j = -2; j <= 2; j++) k += `<path d="M${r(j * bw * .19)} ${r(oy)} L${r(j * bw * .16)} ${r(oy + bh)}" stroke="#a87a40" stroke-width="${r(.008 * s)}"/>`;
  S.teil({ id: "korb", de: "der Korb", syl: "KORB", it: "il cestino", itSyl: "ce-STI-no", en: "basket", x: f.x + hx, y: f.y + hy, kunst: k + flaeche(-bw / 2 - .3, -.02 * s, bw + .6, oy + bh + .04 * s, 0.3),
    tipp: "Im Korb trägt sie ihren Einkauf nach Hause." });
}
function sw2(s) { return r(.02 * s); }

/* Vorn rechts am Bächle: ein Kind hockt am Rand und lässt ein Bächleboot an der Schnur schwimmen
   (nur Zeichnung über allem — es fängt keinen Tipp ab; der Bächle-Tipp erzählt davon) */
{
  const A = WEG[3], Bp = WEG[4], at = (t) => [A[0] + (Bp[0] - A[0]) * t, A[1] + (Bp[1] - A[1]) * t];
  const L = Math.hypot(Bp[0] - A[0], Bp[1] - A[1]), qx = -(Bp[1] - A[1]) / L, qy = (Bp[0] - A[0]) / L;
  const bw = at(.135), boot = pr(bw[0], bw[1], -.12), sb = FOC / tief(...bw);
  const kw = [at(.23)[0] - qx * 1.0, at(.23)[1] - qy * 1.0], kf = fuss(...kw), ks = kf.s;
  const m = B.mensch({ id: "fbg_kind", geschlecht: "m", alter: "kind", pose: "hocken", blick: 300, frisur: "kurz", haarfarbe: "blond", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "tshirt", farbe: "gelb" }, unterteil: { stueck: "shorts", farbe: "blau" }, schuhe: { stueck: "turnschuh" } } }, 1.25 * ks);
  let g = wurf([[kw[0] - .3, kw[1], .8], [kw[0] + .3, kw[1], .8], [kw[0], kw[1] - .3, 0], [kw[0], kw[1] + .3, 0]], .25);
  /* das Boot: Holzrumpf, kleines weißes Segel, Bugwelle */
  const u = sb;
  g += `<ellipse cx="${r(boot[0])}" cy="${r(boot[1] + .02 * u)}" rx="${r(.3 * u)}" ry="${r(.05 * u)}" fill="#e8f6fc" opacity=".6"/>`;
  g += `<path d="M${r(boot[0] - .2 * u)} ${r(boot[1] - .07 * u)} h${r(.4 * u)} l${r(-.06 * u)} ${r(.08 * u)} h${r(-.3 * u)} Z" fill="#a8743e"/><path d="M${r(boot[0] - .2 * u)} ${r(boot[1] - .07 * u)} h${r(.4 * u)}" stroke="#d8a868" stroke-width="${r(.015 * u)}"/>`;
  g += `<path d="M${r(boot[0])} ${r(boot[1] - .07 * u)} V${r(boot[1] - .36 * u)}" stroke="#6a4a2a" stroke-width="${r(.012 * u)}"/><path d="M${r(boot[0] + .01 * u)} ${r(boot[1] - .35 * u)} L${r(boot[0] + .16 * u)} ${r(boot[1] - .1 * u)} H${r(boot[0] + .01 * u)} Z" fill="#fffaf0"/><path d="M${r(boot[0] - .01 * u)} ${r(boot[1] - .3 * u)} L${r(boot[0] - .12 * u)} ${r(boot[1] - .11 * u)} H${r(boot[0] - .01 * u)} Z" fill="#d84030"/>`;
  /* die Schnur von der Hand zum Bug, leicht durchhängend */
  const h = m.z.handL.x < m.z.handR.x ? m.z.handL : m.z.handR, hx = kf.x + h.x * m.k, hy = kf.y + h.y * m.k;
  g += `<path d="M${r(hx)} ${r(hy)} Q${r((hx + boot[0]) / 2)} ${r(Math.max(hy, boot[1]) + .1 * u)} ${r(boot[0] + .18 * u)} ${r(boot[1] - .06 * u)}" stroke="#f4f0e4" stroke-width="${r(.01 * u)}" fill="none"/>`;
  g += `<g transform="translate(${r(kf.x)},${r(kf.y)})">${rundeFigur(m.svg, null, true)}</g>`;
  S.davor(g);
}

/* Licht über allem: Vormittagssonne von links (Ostsüdost), leichte Vignette (fängt keinen Tipp ab) */
S.davor(`<rect width="320" height="240" fill="${S.rg("morgenlicht", [[0, "#fff6e0", .3], [1, "#fff6e0", 0]], 0, 0, .55)}"/><rect width="320" height="240" fill="${S.rg("sonne", [[0, "#fff4d6", 0.2], [0.55, "#fff4d6", 0.05], [1, "#fff4d6", 0]], 0, 0.1, 0.9)}"/><rect width="320" height="240" fill="${S.rg("vignette", [[0, "#000", 0], [0.72, "#000", 0], [1, "#1a1008", 0.2]], 0.5, 0.5, 0.75)}"/>`);


/* ---------- zum Schluss: Pfaddaten verkürzen (relative Befehle, 0,1 genau — spart ein Fünftel der Ladezeit) ---------- */
/* Pfaddaten verkürzen: relative Befehle, auf 0,1 gerundet (ohne Drift), kurze Zahlen */
const pfadKurz = (() => {
  const ARGS = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7, Z: 0 };
  const q = (v) => Math.round(v * 10) / 10;
  const zahl = (v) => { let s = String(q(v)); if (s === "-0") s = "0"; return s.replace(/^(-?)0\./, "$1."); };
  return (d) => {
    const tok = d.match(/[a-zA-Z]|-?(?:\d+\.?\d*|\.\d+)(?:e-?\d+)?/g);
    if (!tok) return d;
    let i = 0, cx = 0, cy = 0, sx = 0, sy = 0, rx = 0, ry = 0, srx = 0, sry = 0, cmd = null, last = "", out = "", prev = "";
    const schreib = (t) => {
      if (/^[a-zA-Z]$/.test(t)) { out += t; prev = ""; return; }
      if (prev === "") out += t;
      else if (t[0] === "-") out += t;
      else if (t[0] === "." && prev.includes(".")) out += t;
      else out += " " + t;
      prev = t;
    };
    while (i < tok.length) {
      if (/[a-zA-Z]/.test(tok[i])) cmd = tok[i++];
      else if (cmd === "M") cmd = "L"; else if (cmd === "m") cmd = "l";
      if (!cmd) return d;
      const U = cmd.toUpperCase(), rel = cmd !== U, n = ARGS[U];
      if (n === undefined) return d;
      const a = tok.slice(i, i + n).map(Number); i += n;
      if (a.length < n || a.some(isNaN)) return d;
      let z, teile = [];
      if (U === "Z") { z = "z"; cx = sx; cy = sy; rx = srx; ry = sry; }
      else if (U === "H") { const x = rel ? cx + a[0] : a[0], dx = q(x - rx); z = "h"; teile = [zahl(dx)]; rx = q(rx + dx); cx = x; }
      else if (U === "V") { const y = rel ? cy + a[0] : a[0], dy = q(y - ry); z = "v"; teile = [zahl(dy)]; ry = q(ry + dy); cy = y; }
      else if (U === "A") {
        const x = rel ? cx + a[5] : a[5], y = rel ? cy + a[6] : a[6], dx = q(x - rx), dy = q(y - ry);
        z = "a"; teile = [zahl(a[0]), zahl(a[1]), zahl(a[2]), a[3] ? "1" : "0", a[4] ? "1" : "0", zahl(dx), zahl(dy)];
        rx = q(rx + dx); ry = q(ry + dy); cx = x; cy = y;
      } else {
        const pts = []; for (let j = 0; j < n; j += 2) pts.push([rel ? cx + a[j] : a[j], rel ? cy + a[j + 1] : a[j + 1]]);
        const [ex, ey] = pts[pts.length - 1];
        if (out === "") { z = "M"; teile = [zahl(ex), zahl(ey)]; rx = q(ex); ry = q(ey); }
        else {
          z = U.toLowerCase();
          for (const [px, py] of pts) teile.push(zahl(px - rx), zahl(py - ry));
          rx = q(rx + q(ex - rx)); ry = q(ry + q(ey - ry));
        }
        cx = ex; cy = ey;
        if (U === "M") { sx = ex; sy = ey; srx = rx; sry = ry; }
      }
      /* gleicher Befehl wie davor: Buchstabe weglassen (nicht nach M/m und nicht bei z) */
      if (!(z === last && z !== "m" && z !== "M" && z !== "z")) schreib(z);
      for (const t of teile) schreib(t);
      last = z;
    }
    return out;
  };
})();
/* direkt aufeinanderfolgende Pfade mit gleichen Eigenschaften (deckend, ohne evenodd) zu einem Pfad zusammenfassen */
const fasseZusammen = (svg) => {
  let alt;
  do { alt = svg; svg = svg.replace(/<path d="([^"]*)"((?: [\w-]+="[^"]*")*)\/><path d="([^"]*)"\2\/>/g, (m, a, rest, b) => (/opacity|evenodd|class=|url\(/.test(rest) ? m : `<path d="${a} ${b}"${rest}/>`)); } while (svg !== alt);
  return svg;
};
const kuerzePfade = (svg) => fasseZusammen(svg).replace(/ d="([^"]*)"/g, (m, d) => ` d="${pfadKurz(d)}"`);
for (const t of S.teile) { t.kunst = kuerzePfade(t.kunst); for (const u of t.unter || []) u.kunst = kuerzePfade(u.kunst); }
for (const L of [S.defs, S.kulisse, S.vorne]) L.forEach((v, i) => { L[i] = kuerzePfade(v); });

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/freiburg.js"));
console.log(aus);
