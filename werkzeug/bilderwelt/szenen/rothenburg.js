#!/usr/bin/env node
/* =====================================================================
   ROTHENBURG OB DER TAUBER (FASSUNG 854) — Bilderwelt neu: Sehenswürdigkeit
   ---------------------------------------------------------------------
   XANDER (03.10.): „die bekannten Sehenswürdigkeiten … als Profi-
   Grafikdesigner auf Hollywood-Niveau … mit größter Sorgfalt und
   Präzision auf höchstem Niveau“.

   STANDORT: das PLÖNLEIN („kleiner Platz“) am Südende der Oberen
   Schmiedgasse — eines der bekanntesten Fotomotive Deutschlands. Man
   steht in der Gasse (Augenhöhe 1,65 m) und schaut nach Süden auf die
   Gabelung. Sommerabend: die Sonne steht tief im Westen (Azimut 275°,
   18° hoch, rechts). Ein Sonnenmodell (schattenH) rechnet die Schatten
   der giebelständigen rechten Zeile: die Gasse liegt im Schatten, auf
   den Fassaden links und am gelben Haus steigt die Schattenkante als
   Sägezahn der Giebel an, nur Obergeschosse, Giebel und der obere
   Siebersturm leuchten. Durch die Seitengasse rechts fällt ein Lichtband
   quer über das Pflaster. Die Laternen brennen, gleich beginnt die
   Nachtwächterführung.

   RECHERCHE (rothenburg-tourismus.de, Wikipedia „Plönlein“,
   „Siebersturm“, „Kobolzeller Tor“, „Rothenburger Schneeballen“;
   Fachwissen, Unsicheres markiert):
   - In der Gabel steht das schmale, keilförmige, GELBE FACHWERKHAUS,
     Giebel zur Gasse: Erdgeschoss verputzt, darüber Fachwerk mit
     vorkragenden Geschossen, steiles Ziegeldach, Ladeluke im Giebel,
     Blumenkästen mit Geranien. Davor der kleine Plönleinbrunnen.
   - RECHTS führt die Gasse leicht BERGAUF zum SIEBERSTURM (1385), einem
     Torturm der zweiten Stadterweiterung zum Spitalviertel: unten
     Buckelquader und die spitzbogige Durchfahrt, darüber verputzt mit
     Eckquadern, steiles Zeltdach mit Gauben, Knauf und Wetterfahne.
   - LINKS fällt die KOBOLZELLER STEIGE steil ab zum KOBOLZELLER TOR
     (1360; Doppeltor mit Zwinger, Bruchsteinmauerwerk); dahinter das
     Taubertal. Beide Seiten der Steige sind bebaut; ihre Traufen
     treppen sich nach unten.
   - STADTMAUER: rund 3,4 km, über 2 km mit überdachtem WEHRGANG
     (Holzstützen, Ziegeldach, Schießscharten).
   - Typisch: Fachwerk, Fensterläden, Blumenkästen, Kopfsteinpflaster in
     Segmentbögen, schmiedeeiserne Ausleger (Bäcker: Brezel mit Krone;
     Gasthof: goldener Hirsch — UNSICHER, welches Gasthaus genau hier
     steht; Motiv frei gewählt), der NACHTWÄCHTER (schwarzer Umhang,
     Schlapphut, Hellebarde, Laterne, Horn), ROTHENBURGER SCHNEEBALLEN
     (Mürbeteigstreifen, zur Kugel geformt und gebacken, mit Puderzucker
     oder Schokolade), Weihnachtsschmuck das ganze Jahr.
   KAMERA: Fluchtpunkt (268 | 158), Brennweite 210 Einheiten. Gasse eben,
   rechte Gasse steigt ab 21 m als Rampe mit 7 % (bis 1,7 m) zum
   Siebersturm. Die Steige fällt ab der Platzkante erst 6,5 %, ab der
   Kante 12 m weiter 21 %: dahinter sind nur noch Dächer (Querhaus an der
   Biegung) und Helm und Obergeschoss des Kobolzeller Tors zu sehen
   (≈ 13 m tiefer, 80 m entfernt; Gefälle UNSICHER, Größenordnung aus
   Fachwissen). Plönleinhaus in
   22 m ≈ 9,5 je Meter, Siebersturm in 45 m ≈ 4,7, Nachtwächter in 7,4 m
   ≈ 28 je Meter (1,78 m ≈ 50 Einheiten).
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "rothenburg", titel: "Rothenburg ob der Tauber", emoji: "🏘️", thema: "Deutschland", kuerzel: "rtb", fassung: 854, breite: 400, hoehe: 260 });
const rnd = zufall(1274);
const r = B.r;

/* ---------- Kamera -------------------------------------------------- */
const VPX = 268, HOR = 158, F = 210, EYE = 1.65;
/* Boden: Gasse eben, rechte Gasse zum Siebersturm steigt */
const gG = (X, D) => (D > 21 && X > -3.8 && X < 4.6) ? Math.min(1.7, (D - 21) * 0.07) : 0;   /* sanfte Rampe, 7 % */
/* Punkt: X quer (m, + rechts), D Abstand (m), H Höhe über dem Boden, g Bodenhöhe */
const P = (X, D, H, g) => [VPX + F * X / D, HOR - ((g === undefined ? gG(X, D) : g) + H - EYE) * F / D];
const pt = (q) => `${r(q[0])} ${r(q[1])}`;
const poly = (...qs) => "M" + qs.map(pt).join(" L") + " Z";
/* Vieleck auf das Bild beschneiden (Sutherland–Hodgman) */
/* Strecke auf das Bild beschneiden (Liang–Barsky); null, wenn ganz draußen */
function strecke(a, b, x0 = -1, y0 = -1, x1 = 401, y1 = 261) {
  let t0 = 0, t1 = 1; const dx = b[0] - a[0], dy = b[1] - a[1];
  for (const [p, q] of [[-dx, a[0] - x0], [dx, x1 - a[0]], [-dy, a[1] - y0], [dy, y1 - a[1]]]) {
    if (p === 0) { if (q < 0) return null; continue; }
    const t = q / p;
    if (p < 0) { if (t > t1) return null; if (t > t0) t0 = t; } else { if (t < t0) return null; if (t < t1) t1 = t; }
  }
  return [[a[0] + dx * t0, a[1] + dy * t0], [a[0] + dx * t1, a[1] + dy * t1]];
}
const pz = (...qs) => { const z = zuschnitt(qs); return z.length > 2 ? poly(...z) : "M0 0"; };
function zuschnitt(pts, x0 = -1, y0 = -1, x1 = 401, y1 = 261) {
  const kanten = [[(p) => p[0] >= x0, (a, b) => [x0, a[1] + (b[1] - a[1]) * (x0 - a[0]) / (b[0] - a[0])]], [(p) => p[0] <= x1, (a, b) => [x1, a[1] + (b[1] - a[1]) * (x1 - a[0]) / (b[0] - a[0])]],
    [(p) => p[1] >= y0, (a, b) => [a[0] + (b[0] - a[0]) * (y0 - a[1]) / (b[1] - a[1]), y0]], [(p) => p[1] <= y1, (a, b) => [a[0] + (b[0] - a[0]) * (y1 - a[1]) / (b[1] - a[1]), y1]]];
  let out = pts;
  for (const [innen, schnitt] of kanten) {
    const inp = out; out = [];
    for (let i = 0; i < inp.length; i++) {
      const a = inp[(i + inp.length - 1) % inp.length], b = inp[i];
      if (innen(b)) { if (!innen(a)) out.push(schnitt(a, b)); out.push(b); } else if (innen(a)) out.push(schnitt(a, b));
    }
    if (!out.length) break;
  }
  return out;
}
/* Kobolzeller Steige: von der linken Vorderecke des Plönleinhauses schräg nach links vorn, fällt 14 % */
const SD = [-0.5, 0.866], SN = [0.866, 0.5], S0 = [-9.5, 22];
/* Steige: ab der Platzkante (t = −6) erst 6,5 %, ab der Kante (t = 6) kippt sie auf 21 % weg */
const steigeG = (t) => t < -6 ? 0 : t < 6 ? -0.065 * (t + 6) : -0.78 - 0.21 * (t - 6);
const SX = (t, w) => [S0[0] + SD[0] * t - SN[0] * w, S0[1] + SD[1] * t - SN[1] * w];   /* w: 0 Südseite … 5 Nordseite */
const PS = (t, w, H) => { const [X, D] = SX(t, w); return P(X, D, H, steigeG(t)); };

/* ---------- Sonne: Sommerabend, tief im Westen (Azimut 275°, 18° hoch) ----------
   Blick nach Süden: Westen ist rechts. Die rechte Zeile (giebelständig, First
   quer zur Gasse) wirft ihren Schatten über die ganze Gasse; nur durch die
   Seitengasse fällt ein Lichtband aufs Pflaster. Auf den Fassaden links steigt
   die Schattenkante als Sägezahn der Giebel an. schattenH(X, D) = Höhe (absolut),
   bis zu der ein Punkt im Schatten liegt. */
const RECHTS = [
  { d0: 4.6, d1: 9.6, traufe: 9.6, first: 14.2, putz: "#e8d6b8", fw: true, gasthof: true },
  { d0: 9.6, d1: 14.0, traufe: 10.2, first: 15, putz: "#e9e1d0", fw: false, laden: true },
  { d0: 16.6, d1: 21, traufe: 11, first: 16.4, putz: "#e6c17e", fw: true },
  { d0: 21, d1: 30, traufe: 10.4, first: 15.6, putz: "#c9cfd2", fw: false },
  { d0: 30, d1: 47, traufe: 11.4, first: 17, putz: "#ead9b8", fw: true },
];
const SONNE = { x: Math.sin(95 * Math.PI / 180), d: Math.cos(95 * Math.PI / 180), tan: Math.tan(18 * Math.PI / 180) };
const DACH = [{ d0: -8, d1: 4.6, traufe: 10, first: 14.6 }, ...RECHTS];
const HR = (D) => { for (const h of DACH) if (D >= h.d0 && D <= h.d1) { const dm = (h.d0 + h.d1) / 2, half = (h.d1 - h.d0) / 2; return gG(4, D) + h.traufe + (h.first - h.traufe) * (1 - Math.abs(D - dm) / half); } return -99; };
const schattenH = (X, D) => { let m = -99; for (let sx = 0; sx <= 6; sx += 0.5) { const dist = (4 + sx - X) / SONNE.x; if (dist < 0) continue; m = Math.max(m, HR(D + SONNE.d * dist) - SONNE.tan * dist); } return m; };
/* Schatten (kühl) und Abendlicht (warm) auf einer Wand: Q(u, h) projiziert, sh(u) = Schattenhöhe, u von a bis b */
function lichtWand(Q, sh, a, b, h0, h1, n = 48, opS = 0.34, opL = 0.2) {
  const unten = [], kante = [], oben = [];
  for (let i = 0; i <= n; i++) { const u = a + (b - a) * i / n, h = Math.max(h0, Math.min(h1, sh(u))); unten.push(Q(u, h0)); kante.push(Q(u, h)); oben.push(Q(u, h1)); }
  return `<path d="${pz(...unten, ...kante.slice().reverse())}" fill="${SCHATTEN}" opacity="${opS}"/><path d="${pz(...kante, ...oben.slice().reverse())}" fill="#ffb45c" opacity="${opL}"/>`;
}

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("glimm")}" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="2.4"/></filter>`);
S.def(`<filter id="${S.id("wolke")}" x="-20%" y="-80%" width="140%" height="260%"><feGaussianBlur stdDeviation="1"/></filter>`);
S.def(`<filter id="${S.id("dunst")}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation=".6"/></filter>`);

/* ---------- Stoffe -------------------------------------------------- */
const BALKEN = "#5a2a1c", BALKEN_L = "#7a3a26";
const GLAS = S.lg("glas", [[0, "#6e7f98"], [0.55, "#3c4a5e"], [1, "#2a3240"]]);
const GLAS_ABEND = S.lg("glasabend", [[0, "#e9b8a8"], [0.5, "#8a8fb0"], [1, "#3c4660"]]);   /* spiegelt den Abendhimmel */
const GLAS_LICHT = S.lg("glaslicht", [[0, "#ffe9a8"], [1, "#f2b35a"]]);                  /* innen brennt Licht */
const GOLD = S.lg("gold", [[0, "#f6dd84"], [1, "#b48a2c"]]);
const EISEN = "#24221f";
S.def(`<pattern id="${S.id("dachz")}" width="2.4" height="1.6" patternUnits="userSpaceOnUse"><rect width="2.4" height="1.6" fill="#a54a2e"/><path d="M0 1.55 H2.4" stroke="#6e2a18" stroke-width=".35"/><path d="M0 0 Q1.2 1 2.4 0" stroke="#c4664a" stroke-width=".25" fill="none"/></pattern>`);
const DACHZ = `url(#${S.id("dachz")})`;
S.def(`<pattern id="${S.id("bruch")}" width="5" height="3.2" patternUnits="userSpaceOnUse"><rect width="5" height="3.2" fill="#c9b18a"/><path d="M0 1.1 Q1.2 .8 2.2 1.2 L2.4 0 M2.2 1.2 Q3.6 1.5 5 1 M0 2.3 Q1 2.6 1.6 2.2 L1.4 1.1 M1.6 2.2 Q3 2 3.6 2.6 L3.8 1.4 M3.6 2.6 Q4.4 2.4 5 2.3 M2.8 3.2 L3 2.5" stroke="#8a7354" stroke-width=".18" fill="none"/><path d="M.3 .2 h1.6 v.7 h-1.6 Z M3 1.6 h1.4 v.8 h-1.4 Z" fill="#dcc7a2" opacity=".6"/></pattern>`);
const BRUCH = `url(#${S.id("bruch")})`;
S.def(`<pattern id="${S.id("putz")}" width="3" height="3" patternUnits="userSpaceOnUse"><circle cx=".6" cy=".8" r=".25" fill="#000" opacity=".06"/><circle cx="2.1" cy="2.2" r=".3" fill="#fff" opacity=".1"/><circle cx="1.8" cy=".4" r=".2" fill="#000" opacity=".05"/></pattern>`);
const PUTZ = `url(#${S.id("putz")})`;
/* Abendschatten (kühl) und Abendsonne (golden) als Überlagerung */
const SCHATTEN = "#2c3656";

/* Fenster als Viereck a (oben links) b (oben rechts) c (unten rechts) d (unten links), Laibung, Sprossen */
function fensterQ(a, b, c, d, opt = {}) {
  const glas = opt.licht ? GLAS_LICHT : opt.abend ? GLAS_ABEND : GLAS;
  let g = `<path d="${poly(a, b, c, d)}" fill="${glas}" stroke="${opt.rahmen || "#f4efe4"}" stroke-width="${opt.rb || 0.5}"/>`;
  const m1 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], m2 = [(d[0] + c[0]) / 2, (d[1] + c[1]) / 2];
  const l1 = [(a[0] + d[0]) / 2, (a[1] + d[1]) / 2], l2 = [(b[0] + c[0]) / 2, (b[1] + c[1]) / 2];
  g += `<path d="M${pt(m1)} L${pt(m2)} M${pt(l1)} L${pt(l2)}" stroke="${opt.rahmen || "#f4efe4"}" stroke-width="${r((opt.rb || 0.5) * 0.6)}"/>`;
  /* Laibung: dunkle Kante oben und auf der Schattenseite */
  g += `<path d="M${pt(a)} L${pt(b)}" stroke="#1a1410" stroke-width="${r((opt.rb || 0.5) * 0.9)}" opacity=".35"/>`;
  if (opt.licht) g += `<path d="${poly(a, b, c, d)}" fill="#ffd27a" opacity=".25" filter="url(#${S.id("glimm")})"/>`;
  return g;
}
function blumen(d, c, s = 1) {
  const w = c[0] - d[0];
  let g = `<path d="M${r(d[0] - 0.4 * s)} ${r(d[1] + 0.2)} L${r(c[0] + 0.4 * s)} ${r(c[1] + 0.2)} L${r(c[0] + 0.2 * s)} ${r(c[1] + 1.6 * s)} L${r(d[0] - 0.2 * s)} ${r(d[1] + 1.6 * s)} Z" fill="#6b4a2e"/>`;
  const n = Math.max(3, Math.round(w / (1.1 * s)));
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n, x = d[0] + (c[0] - d[0]) * t, y = d[1] + (c[1] - d[1]) * t;
    g += `<circle cx="${r(x)}" cy="${r(y - 0.3 * s)}" r="${r(0.75 * s)}" fill="#3f6e2e"/><circle cx="${r(x + (rnd() - 0.5) * s)}" cy="${r(y - 0.9 * s)}" r="${r(0.55 * s)}" fill="${rnd() < 0.75 ? "#d6283a" : "#f2557a"}"/><circle cx="${r(x + (rnd() - 0.5) * s * 1.4)}" cy="${r(y - 0.5 * s)}" r="${r(0.4 * s)}" fill="#e83a4c"/>`;
  }
  return g;
}
/* Fenster auf der Fassade der rechten bzw. linken Zeile (Ebene X = const) */
/* Schrift Buchstabe für Buchstabe: Lage nach geschätzter Zeichenbreite (statt gleicher Abstände) */
const ZB = (c) => c === " " ? 0.5 : "il.·,'|".includes(c) ? 0.32 : "fjrt".includes(c) ? 0.42 : "mwMW".includes(c) ? 0.9 : c === c.toUpperCase() && /[A-ZÄÖÜ]/.test(c) ? 0.72 : 0.56;
const zeichenLage = (txt) => { const w = [...txt].map(ZB), sum = w.reduce((a, b) => a + b, 0); let acc = 0; return w.map((b) => { const m = (acc + b / 2) / sum; acc += b; return m; }); };
const wandFenster = (X, d0, d1, h0, h1, opt) => fensterQ(P(X, d0, h1), P(X, d1, h1), P(X, d1, h0), P(X, d0, h0), opt);

/* =====================================================================
   KULISSE — Abendhimmel mit Wolkenbändern, Taubertal im Dunst
   ===================================================================== */
S.hinten(`<rect y="-2" width="400" height="200" fill="${S.lg("himmel", [[0, "#34548e"], [0.4, "#7690bd"], [0.72, "#dcb6a6"], [0.9, "#f4cfa2"], [1, "#f6dcb0"]])}"/>`);
{
  /* Abendwolken in Bändern (Altocumulus): klare, gewellte Oberkante, flache rosa Unterseite von der tiefen Sonne */
  const WG = S.lg("wolkeband", [[0, "#9a97bd"], [0.55, "#c9a2b4"], [1, "#f7b99c"]]);
  let c = "";
  for (const [x, y, w, h] of [[150, 20, 92, 5], [222, 9, 64, 3.6], [96, 42, 70, 4], [246, 34, 50, 3], [184, 55, 40, 2.4], [52, 24, 48, 3], [330, 16, 60, 3.4]]) {
    const n = Math.max(4, Math.round(w / 9)), x0 = x - w / 2;
    let d = `M${r(x0)} ${r(y + h * 0.55)}`;
    for (let i = 0; i < n; i++) { const xa = x0 + w * i / n, xb = x0 + w * (i + 1) / n, top = y - h * (0.5 + 0.5 * Math.sin((i + 0.5) / n * Math.PI)) * (0.75 + rnd() * 0.5); d += ` Q${r((xa + xb) / 2)} ${r(top)} ${r(xb)} ${r(y + (i === n - 1 ? h * 0.55 : -h * 0.05))}`; }
    d += ` Q${r(x)} ${r(y + h * 0.95)} ${r(x0)} ${r(y + h * 0.55)} Z`;
    c += `<path d="${d}" fill="${WG}" opacity=".92"/><path d="M${r(x0 + w * 0.12)} ${r(y + h * 0.7)} Q${r(x)} ${r(y + h * 1.02)} ${r(x0 + w * 0.9)} ${r(y + h * 0.66)}" stroke="#ffd7b4" stroke-width=".5" fill="none" opacity=".9"/>`;
  }
  S.hinten(c);
}
/* Taubertal: bewaldeter Gegenhang hinter dem Kobolzeller Tor (≈ 600 m), sehr dunstig */
{
  let c = `<path d="M80 156 Q110 148 138 151 Q160 147 186 152 L186 190 L80 190 Z" fill="${S.lg("tal", [[0, "#8fa48a"], [1, "#6c8462"]])}"/>`;
  for (let i = 0; i < 44; i++) { const x = 82 + rnd() * 102, y = 152 + rnd() * 28; c += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(1.3 + rnd() * 1.3)}" ry="${r(1 + rnd() * 0.8)}" fill="${["#738c64", "#829b6c", "#62795a", "#9aae7c"][i % 4]}"/>`; }
  c += `<path d="M80 150 L186 150 L186 190 L80 190 Z" fill="${S.lg("taldunst", [[0, "#f3d4b0", 0.55], [1, "#f3d4b0", 0.15]])}"/>`;
  S.hinten(c);
}

/* =====================================================================
   1 — DER SIEBERSTURM (1385) am Ende der rechten Gasse, leicht erhöht
       Lupe: das Wappen, die Wetterfahne
   ===================================================================== */
const ST = { d: 45, L0: -3.6, L1: 3.6, traufe: 21, spitze: 29 };
{
  const g0 = gG(0, ST.d);
  const Q = (L, H) => P(L, ST.d, H, g0);
  const [xl, yb] = Q(ST.L0, 0), [xr] = Q(ST.L1, 0), [, yt] = Q(0, ST.traufe), [xm, ys] = Q(0, ST.spitze), s = F / ST.d;
  let k = "";
  /* Schaft: unten Buckelquader (Relief), oben verputzt mit Eckquadern */
  k += `<rect x="${r(xl)}" y="${r(yt)}" width="${r(xr - xl)}" height="${r(yb - yt)}" fill="${S.lg("sieber", [[0, "#ead6b2"], [0.6, "#dcc29a"], [1, "#c9ab80"]])}"/>`;
  k += `<rect x="${r(xl)}" y="${r(yt)}" width="${r(xr - xl)}" height="${r(yb - yt)}" fill="${PUTZ}"/>`;
  /* Buckelquader: Lagen verschieden hoch, Steine verschieden lang; Buckel mit Licht oben links und Schatten unten rechts */
  {
    const zq = zufall(1385);
    let h = 0.15, lage = 0, steine = "", licht = "", dunkel = "";
    while (h < 7.9) {
      const lh = 0.5 + zq() * 0.28;
      let L = ST.L0 + (lage % 2 ? 0.2 + zq() * 0.4 : 0);
      if (lage % 2) { const [x0, y0] = Q(ST.L0, h + lh - 0.04), [x1, y1] = Q(L - 0.04, h + 0.04); steine += `<rect x="${r(x0)}" y="${r(y0)}" width="${r(x1 - x0)}" height="${r(y1 - y0)}" rx=".4"/>`; }
      while (L < ST.L1 - 0.15) {
        const len = Math.min(ST.L1 - L, 0.6 + zq() * 0.75);
        const [x0, y0] = Q(L + 0.04, h + lh - 0.04), [x1, y1] = Q(L + len - 0.04, h + 0.04);
        steine += `<rect x="${r(x0)}" y="${r(y0)}" width="${r(x1 - x0)}" height="${r(y1 - y0)}" rx=".5"/>`;
        licht += `M${r(x0 + 0.3)} ${r(y0 + 0.3)} H${r(x1 - 0.5)} `;
        dunkel += `M${r(x0 + 0.5)} ${r(y1 - 0.3)} H${r(x1 - 0.3)} V${r(y0 + 0.5)} `;
        L += len;
      }
      h += lh; lage++;
    }
    k += `<rect x="${r(xl)}" y="${r(Q(0, h)[1])}" width="${r(xr - xl)}" height="${r(yb - Q(0, h)[1])}" fill="#8e7a5c"/>`;
    k += `<g fill="#d8c29c">${steine}</g><path d="${licht}" stroke="#f4e6c8" stroke-width=".35" fill="none"/><path d="${dunkel}" stroke="#7a6446" stroke-width=".45" fill="none"/>`;
  }
  /* Eckquader oben: abwechselnd lang und kurz, an der Kante verzahnt */
  for (let h = 8.4, i = 0; h < ST.traufe - 0.4; h += 0.66, i++) {
    for (const [L, sg] of [[ST.L0, 1], [ST.L1, -1]]) {
      const w2 = ((i + (sg > 0 ? 0 : 1)) % 2 ? 0.55 : 1.05) * s, [x0, y0] = Q(L, h + 0.64), [, y1] = Q(L, h);
      k += `<rect x="${r(sg > 0 ? x0 : x0 - w2)}" y="${r(y0)}" width="${r(w2)}" height="${r(y1 - y0)}" fill="#efe0c0" stroke="#b39a74" stroke-width=".15"/>`;
    }
  }
  /* Fenster: schmale Rechteckfenster mit Gewände, unregelmäßig */
  for (const [h, Ls] of [[10.2, [0]], [13.6, [-1.6, 1.4]], [17, [-1.5, 1.5]], [19.4, [-0.2]]]) for (const L of Ls) {
    const a = Q(L - 0.45, h + 1.4), c = Q(L + 0.45, h);
    k += `<rect x="${r(a[0] - 0.6)}" y="${r(a[1] - 0.6)}" width="${r(c[0] - a[0] + 1.2)}" height="${r(c[1] - a[1] + 1.2)}" fill="#c9b08a"/><rect x="${r(a[0])}" y="${r(a[1])}" width="${r(c[0] - a[0])}" height="${r(c[1] - a[1])}" fill="#3a3028"/>`;
  }
  /* Gesims mit Schattenkante, Dach mit Traufüberstand, Gauben, Knauf, Wetterfahne */
  k += `<rect x="${r(xl - 1.4)}" y="${r(yt - 1.4)}" width="${r(xr - xl + 2.8)}" height="1.6" fill="#cbb48e"/><rect x="${r(xl)}" y="${r(yt + 0.2)}" width="${r(xr - xl)}" height="1.4" fill="#000" opacity=".22"/>`;
  k += `<path d="M${r(xl - 2.6)} ${r(yt - 0.6)} L${r(xm)} ${r(ys)} L${r(xr + 2.6)} ${r(yt - 0.6)} Z" fill="${DACHZ}"/>`;
  k += `<path d="M${r(xm)} ${r(ys)} L${r(xr + 2.6)} ${r(yt - 0.6)} L${r(xm + 3)} ${r(yt - 0.6)} Z" fill="#ffb060" opacity=".28"/>`;
  k += `<path d="M${r(xm)} ${r(ys)} L${r(xl - 2.6)} ${r(yt - 0.6)} L${r(xm - 4)} ${r(yt - 0.6)} Z" fill="#000" opacity=".16"/>`;
  k += `<path d="M${r(xl - 2.6)} ${r(yt - 0.6)} L${r(xr + 2.6)} ${r(yt - 0.6)}" stroke="#6e2a18" stroke-width=".8"/>`;
  for (const [L, H, w] of [[-1.3, 23.2, 1.1], [1.5, 23.2, 1.1], [0.1, 26, 0.8]]) {
    const [gx, gy] = Q(L, H), gw = w * s, gh = w * 1.3 * s;
    k += `<path d="M${r(gx - gw)} ${r(gy + gh)} L${r(gx - gw)} ${r(gy + gh * 0.3)} L${r(gx)} ${r(gy - gh * 0.3)} L${r(gx + gw)} ${r(gy + gh * 0.3)} L${r(gx + gw)} ${r(gy + gh)} Z" fill="#a54a2e"/><path d="M${r(gx - gw)} ${r(gy + gh * 0.3)} L${r(gx)} ${r(gy - gh * 0.3)} L${r(gx + gw)} ${r(gy + gh * 0.3)}" stroke="#6e2a18" stroke-width=".5" fill="none"/><rect x="${r(gx - gw * 0.55)}" y="${r(gy + gh * 0.4)}" width="${r(gw * 1.1)}" height="${r(gh * 0.5)}" fill="#3a3028"/>`;
  }
  k += `<line x1="${r(xm)}" y1="${r(ys)}" x2="${r(xm)}" y2="${r(ys - 9)}" stroke="#4a3a1a" stroke-width=".55"/><circle cx="${r(xm)}" cy="${r(ys - 2.6)}" r="1.1" fill="${GOLD}"/>`;
  k += `<path d="M${r(xm)} ${r(ys - 8.6)} L${r(xm + 5)} ${r(ys - 7.6)} L${r(xm + 4)} ${r(ys - 6.4)} L${r(xm)} ${r(ys - 6.6)} Z" fill="${GOLD}"/><path d="M${r(xm - 1.6)} ${r(ys - 5.2)} h3.2" stroke="#4a3a1a" stroke-width=".3"/>`;
  /* Abendlicht: oberhalb ≈ 11 m golden, darunter liegt der Turm im Schatten der Gasse */
  k += lichtWand((L, H) => Q(L, H), (L) => schattenH(L, ST.d) - g0, ST.L0, ST.L1, 0, ST.traufe, 16, 0.3, 0.22);
  /* Wappen über dem Tor: Stadtwappen (rote Burg auf Silber), plastisch */
  const [wx, wy] = Q(0, 7.4);
  k += `<path d="M${r(wx - 3.4)} ${r(wy - 4.2)} h6.8 v4.2 q0 3 -3.4 4.2 q-3.4 -1.2 -3.4 -4.2 Z" fill="#8a6a3a"/><path d="M${r(wx - 2.8)} ${r(wy - 3.6)} h5.6 v3.6 q0 2.4 -2.8 3.5 q-2.8 -1.1 -2.8 -3.5 Z" fill="#f4efe4"/>`;
  k += `<path d="M${r(wx - 1.9)} ${r(wy + 1.4)} v-3 h.8 v.8 h.6 v-.8 h1 v.8 h.6 v-.8 h.8 v3 Z" fill="#b8282e"/><rect x="${r(wx - 0.4)}" y="${r(wy + 0.2)}" width=".8" height="1.2" fill="#f4efe4"/>`;
  k += `<path d="M${r(wx + 2.8)} ${r(wy - 3.6)} v3.6 q0 2.4 -2.8 3.5" stroke="#5a4020" stroke-width=".4" fill="none"/>`;
  S.teil({ id: "siebersturm", de: "der Siebersturm", syl: "SIE-bers-turm", it: "la torre Sieber", itSyl: "TOR-re SIE-ber", en: "Sieber Tower", x: 0, y: 0, kunst: k,
    tipp: "Der Siebersturm (1385) war ein Tor der Stadtmauer. Heute führt die Gasse durch ihn zum Spital.",
    zoom: { x: r(xm - 30), y: r(ys - 12), w: 60, h: 40 },
    unter: [
      { id: "wetterfahne", de: "die Wetterfahne", syl: "WET-ter-fah-ne", it: "la banderuola", itSyl: "ban-de-RUO-la", en: "weather vane", x: xm, y: ys, kunst: flaeche(-3, -10, 9, 9),
        tipp: "Die Wetterfahne dreht sich mit dem Wind." },
    ] });
  /* DER TORBOGEN: spitzbogige Durchfahrt mit tiefer Laibung, hinten die Spitalgasse im Licht */
  /* Durchfahrt als echter Tunnel: Außenbogen in der Front (D 45), Innenbogen 6,5 m tiefer; man sieht beide
     Laibungen, das Gewölbe und hinten die Spitalgasse im Abendlicht */
  const T = (X, D, H) => P(X, D, H, g0), DA = ST.d, DI = ST.d + 6.5;
  const bogenPkt = (D, w, n = 10) => { const out = []; for (let i = 0; i <= n; i++) { const t2 = i / n; out.push(T(-w + 2 * w * t2, D, 3.5 + 2.1 * (1 - Math.pow(Math.abs(2 * t2 - 1), 1.7)))); } return out; };
  const aussen = bogenPkt(DA, 1.8), innen = bogenPkt(DI, 1.8), gewaende = bogenPkt(DA - 0.02, 2.2);
  const [ax, ay] = T(-1.8, DA, 0), [bx] = T(1.8, DA, 0);
  let t = `<path d="${poly(T(-2.2, DA - 0.02, 0), ...gewaende, T(2.2, DA - 0.02, 0))}" fill="#cdb48a"/><path d="${poly(T(-2.2, DA - 0.02, 0), ...gewaende, T(2.2, DA - 0.02, 0))}" fill="${SCHATTEN}" opacity=".25"/>`;
  for (let i = 1; i < 10; i += 2) t += `<path d="M${pt(aussen[i])} L${pt(gewaende[i])}" stroke="#9c8462" stroke-width=".25"/>`;
  /* hinten: helle Spitalgasse mit Hausfronten */
  t += `<path d="${poly(T(-1.8, DI, 0), ...innen, T(1.8, DI, 0))}" fill="${S.lg("spital", [[0, "#ffd9a0"], [1, "#e9b878"]])}"/>`;
  t += `<path d="${poly(T(-1.2, DI + 8, 0), T(-1.2, DI + 8, 4.4), T(0.4, DI + 8, 5.4), T(1.6, DI + 8, 4.6), T(1.6, DI + 8, 0))}" fill="#d9a06a" opacity=".8"/>`;
  /* Gewölbe, Laibungen, Boden: dunkel, zur Mitte hin am dunkelsten; Licht von hinten auf dem Boden */
  t += `<path d="${poly(...aussen, ...innen.slice().reverse())}" fill="#1a1512"/>`;
  t += `<path d="${poly(T(-1.8, DA, 0), T(-1.8, DA, 3.5), T(-1.8, DI, 3.5), T(-1.8, DI, 0))}" fill="#3a3028"/><path d="${poly(T(1.8, DA, 0), T(1.8, DA, 3.5), T(1.8, DI, 3.5), T(1.8, DI, 0))}" fill="#4a3d32"/>`;
  t += `<path d="${poly(T(-1.8, DA, 0), T(1.8, DA, 0), T(1.8, DI, 0), T(-1.8, DI, 0))}" fill="${S.lg("tunnelboden", [[0, "#3a3028"], [1, "#a8804e"]])}"/>`;
  t += `<path d="M${pt(T(-1.8, DA, 3.5))} L${pt(T(-1.8, DI, 3.5))} M${pt(T(1.8, DA, 3.5))} L${pt(T(1.8, DI, 3.5))}" stroke="#6a5a48" stroke-width=".35"/>`;
  t += `<path d="M${aussen.map(pt).join(" L")}" stroke="#0e0b09" stroke-width=".9" fill="none" opacity=".7"/>`;
  void ax; void ay; void bx;
  S.teil({ oben: true, id: "torbogen", de: "der Torbogen", syl: "TOR-bo-gen", it: "l'arco della porta", itSyl: "AR-co DEL-la POR-ta", en: "archway", x: 0, y: 0, kunst: t,
    tipp: "Durch diesen Torbogen fuhren früher die Fuhrwerke.",
    zoom: { x: r(xm - 31), y: r(wy - 9), w: 62, h: 41 },
    unter: [
      { id: "wappen", de: "das Wappen", syl: "WAP-pen", it: "lo stemma", itSyl: "STEM-ma", en: "coat of arms", x: wx, y: wy + 4, kunst: flaeche(-3.6, -8.4, 7.2, 8.6),
        tipp: "Das Wappen von Rothenburg zeigt eine rote Burg." },
    ] });
}

/* =====================================================================
   2 — DAS KOBOLZELLER TOR (Doppeltor mit Zwinger, unten an der Steige;
       die Stadtmauer selbst ist von hier hinter den Häusern verborgen)
   ===================================================================== */
const KTt = 70, KT = (() => { const [X, D] = SX(KTt, 2.5); return { X, D, g: steigeG(KTt), s: F / D }; })();
{
  const Q = (dX, H, dD = 0) => P(KT.X + dX, KT.D + dD, H, KT.g);
  let k = "";
  /* innerer Torturm: Bruchstein, Spitzbogen, kleine Fenster, steiles Zeltdach */
  const w = 3.2, [x0] = Q(-w, 0), [x1] = Q(w, 0), [, yb] = Q(0, 0), [, yt] = Q(0, 17), [xm, ys] = Q(0, 25);
  k += `<rect x="${r(x0)}" y="${r(yt)}" width="${r(x1 - x0)}" height="${r(yb - yt)}" fill="${BRUCH}"/>`;
  k += `<rect x="${r(x1 - 3)}" y="${r(yt)}" width="3" height="${r(yb - yt)}" fill="#000" opacity=".18"/><rect x="${r(x0)}" y="${r(yt)}" width="2" height="${r(yb - yt)}" fill="#ffd6a0" opacity=".2"/>`;
  for (const [H, dx] of [[11, -0.6], [14.5, 0.8], [17, -0.2]]) { const [fx, fy] = Q(dx, H); k += `<rect x="${r(fx - 0.7)}" y="${r(fy)}" width="1.4" height="2.4" fill="#2e261e"/>`; }
  k += `<path d="M${r(x0 - 1.6)} ${r(yt)} L${r(xm)} ${r(ys)} L${r(x1 + 1.6)} ${r(yt)} Z" fill="${DACHZ}"/><path d="M${r(xm)} ${r(ys)} L${r(x1 + 1.6)} ${r(yt)} L${r(xm + 2)} ${r(yt)} Z" fill="#000" opacity=".2"/>`;
  k += `<line x1="${r(xm)}" y1="${r(ys)}" x2="${r(xm)}" y2="${r(ys - 2.6)}" stroke="#5a4a2a" stroke-width=".35"/><circle cx="${r(xm)}" cy="${r(ys - 1.4)}" r=".6" fill="${GOLD}"/>`;
  /* Spitzbogen-Durchgang unten (nur der obere Teil schaut über die Steige) */
  const [, ab] = Q(0, 4.2);
  k += `<path d="M${r(xm - 4)} ${r(yb)} L${r(xm - 4)} ${r(ab + 3)} Q${r(xm - 4)} ${r(ab - 1)} ${r(xm)} ${r(ab - 2)} Q${r(xm + 4)} ${r(ab - 1)} ${r(xm + 4)} ${r(ab + 3)} L${r(xm + 4)} ${r(yb)} Z" fill="#2a221c"/>`;
  /* Schießscharten oben, Dunst aus dem Taubertal legt sich über den fernen Turm */
  for (const dx of [-1.8, 1.8]) { const [fx, fy] = Q(dx, 15.4); k += `<rect x="${r(fx - 0.3)}" y="${r(fy)}" width=".6" height="1.6" fill="#2e261e"/>`; }
  S.def(`<clipPath id="${S.id("kbclip")}"><rect x="${r(x0)}" y="${r(yt)}" width="${r(x1 - x0)}" height="${r(yb - yt)}"/><path d="M${r(x0 - 1.6)} ${r(yt)} L${r(xm)} ${r(ys)} L${r(x1 + 1.6)} ${r(yt)} Z"/></clipPath>`);
  k += `<rect clip-path="url(#${S.id("kbclip")})" x="${r(x0 - 2)}" y="${r(ys - 3)}" width="${r(x1 - x0 + 4)}" height="${r(yb - ys + 3)}" fill="${S.lg("taldunst2", [[0, "#f6d6b4", 0.25], [1, "#f6d6b4", 0.55]])}"/>`;
  S.teil({ id: "kobolzellertor", de: "das Kobolzeller Tor", syl: "KO-bol-zel-ler TOR", it: "la porta Kobolzell", itSyl: "POR-ta KO-bol-zell", en: "Kobolzell Gate", x: 0, y: 0, kunst: k,
    tipp: "Das Kobolzeller Tor (1360) ist ein Tor in der Stadtmauer. Hinter ihm geht es steil hinunter ins Taubertal." });
}
/* =====================================================================
   4 — DAS HAUS: die Häuser an der Kobolzeller Steige (Traufen treppen
       sich nach unten) — Nordseite fast streifend, Südseite schräg
   ===================================================================== */
{
  let k = "";
  /* Jedes Haus hat EIN Geschoss-Niveau (gh); der Sockel gleicht die Steigung aus. So springen Traufen und
     Fensterreihen von Haus zu Haus deutlich nach unten. */
  const PSh = (t, w, H, g) => { const [X, D] = SX(t, w); return P(X, D, H, g); };
  const haus = (t0, t1, w, traufe, first, putz, fw, sonne) => {
    let g = "";
    const gh = steigeG((t0 + t1) / 2), Q = (t, H) => PSh(t, w, H, gh);
    const fuss0 = PSh(t0, w, 0, steigeG(t0)), fuss1 = PSh(t1, w, 0, steigeG(t1));
    g += `<path d="${pz(fuss0, fuss1, Q(t1, traufe), Q(t0, traufe))}" fill="${putz}"/><path d="${pz(fuss0, fuss1, Q(t1, traufe), Q(t0, traufe))}" fill="${PUTZ}"/>`;
    /* Sockel (gleicht den Hang aus) */
    g += `<path d="${pz(fuss0, fuss1, Q(t1, 0.6), Q(t0, 0.6))}" fill="#a8946f"/>`;
    /* Dach: Traufe zur Gasse, First dahinter */
    const off = w > 2.5 ? 4.5 : -4.5;
    g += `<path d="${pz(Q(t0, traufe), Q(t1, traufe), PSh(t1, w + off, first, gh), PSh(t0, w + off, first, gh))}" fill="${DACHZ}"/>${(() => { const q = strecke(Q(t0, traufe), Q(t1, traufe)); return q ? `<path d="M${pt(q[0])} L${pt(q[1])}" stroke="#5e2414" stroke-width=".7"/>` : ""; })()}`;
    if (fw) { let p = ""; for (const h of [3.2, 6]) p += `M${pt(Q(t0, h))} L${pt(Q(t1, h))} `; for (let i = 0; i <= 4; i++) { const t = t0 + (t1 - t0) * i / 4; p += `M${pt(Q(t, 3.2))} L${pt(Q(t, traufe))} `; } g += `<path d="${p}" stroke="${BALKEN}" stroke-width=".6" fill="none"/>`; }
    for (const [h0, h1] of (sonne ? [[4, 5.3], [6.7, 7.9]] : [[1.3, 2.5], [4, 5.3], [6.7, 7.9]])) if (h1 < traufe) for (const f of [0.2, 0.55]) { const ta = t0 + (t1 - t0) * f, tb = ta + (t1 - t0) * 0.16; g += fensterQ(Q(ta, h1), Q(tb, h1), Q(tb, h0), Q(ta, h0), { rb: 0.3, licht: rnd() < 0.3, abend: rnd() < 0.3 }); }
    /* Licht: Nordseite schaut zur Abendsonne, Südseite liegt im eigenen Schatten */
    if (sonne) g += lichtWand((t, H) => Q(t, H), (t) => { const [X, D] = SX(t, w); return schattenH(X, D) - gh; }, t0, t1, 0, traufe, 10, 0.3, 0.2);
    else g += `<path d="${pz(fuss0, fuss1, Q(t1, traufe), Q(t0, traufe))}" fill="${SCHATTEN}" opacity=".34"/>`;
    return g;
  };
  /* Südseite (rechts der Steige, Schattenseite): von unten (hinten) nach oben zeichnen */
  for (const [t0, t1, tr, fi, f, fw] of [[31, 40, 9, 14, "#e6d2b0", 0], [22, 31, 9.6, 15, "#dfb8a0", 1], [13.6, 22, 9.2, 15, "#efe2c4", 0], [0, 13.6, 8.4, 16.6, "#e9b54c", 1]]) k += haus(t0, t1, 0, tr, fi, f, fw, false);
  /* Nordseite (links, fast streifend, in der Abendsonne) */
  for (const [t0, t1, tr, fi, f, fw] of [[30, 40, 9, 14, "#e8d8b8", 0], [20, 30, 10, 15, "#d8a898", 1], [10, 20, 9.6, 15, "#ede0c2", 0], [-2, 10, 10.4, 16, "#e2c890", 1], [-12.4, -2, 11, 16.6, "#f0dcc0", 0]]) k += haus(t0, t1, 5, tr, fi, f, fw, true);
  /* Querhaus an der Biegung der Steige: verdeckt den unteren Teil des Kobolzeller Tors */
  {
    const tq = 46, gq = steigeG(tq), Qq = (w, H, dt = 0) => PSh(tq + dt, w, H, gq);
    k += `<path d="${pz(Qq(-2, 0), Qq(7, 0), Qq(7, 6.5), Qq(-2, 6.5))}" fill="#e9d6b4"/><path d="${pz(Qq(-2, 0), Qq(7, 0), Qq(7, 6.5), Qq(-2, 6.5))}" fill="${PUTZ}"/>`;
    k += `<path d="${pz(Qq(-2.3, 6.5), Qq(7.3, 6.5), Qq(7.3, 10.5, 4), Qq(-2.3, 10.5, 4))}" fill="${DACHZ}"/><path d="${pz(Qq(-2.3, 6.5), Qq(7.3, 6.5), Qq(7.3, 10.5, 4), Qq(-2.3, 10.5, 4))}" fill="#ffb060" opacity=".12"/>`;
    for (const w of [-0.8, 1.2, 3.4, 5.4]) for (const [h0, h1] of [[1.2, 2.3], [3.8, 5.0]]) k += fensterQ(Qq(w, h1), Qq(w + 0.9, h1), Qq(w + 0.9, h0), Qq(w, h0), { rb: 0.3, licht: rnd() < 0.35, abend: rnd() < 0.3 });
    k += `<path d="${pz(Qq(-2, 0), Qq(7, 0), Qq(7, 6.5), Qq(-2, 6.5))}" fill="${SCHATTEN}" opacity=".22"/>`;
    /* Dunst aus dem Tal über dem Dach */
    k += `<path d="${pz(Qq(-2.3, 6.5), Qq(7.3, 6.5), Qq(7.3, 10.5, 4), Qq(-2.3, 10.5, 4))}" fill="#f6d8b6" opacity=".3"/>`;
    { let d = ""; for (let i = 1; i < 6; i++) { const H = 6.5 + 4 * i / 6, dt = 4 * i / 6, q = strecke(Qq(-2.3, H, dt), Qq(7.3, H, dt)); if (q) d += `M${pt(q[0])} L${pt(q[1])} `; } k += `<path d="${d}" stroke="#7a3a24" stroke-width=".3" opacity=".5"/>`; }
    { const q = strecke(Qq(-2.3, 10.5, 4), Qq(7.3, 10.5, 4)); if (q) k += `<path d="M${pt(q[0])} L${pt(q[1])}" stroke="#6e2a18" stroke-width=".7"/>`; }
  }
  S.teil({ id: "haus", de: "das Haus", syl: "HAUS", it: "la casa", itSyl: "CA-sa", en: "house", x: 0, y: 0, kunst: k,
    tipp: "Die Häuser an der Kobolzeller Steige stehen immer weiter unten – die Gasse ist sehr steil." });
}

/* =====================================================================
   6 — DAS FACHWERKHAUS am Plönlein: schmal, keilförmig, gelb
       Lupe: der Giebel, das Fachwerk, der Blumenkasten
   ===================================================================== */
const PH = { d: 22, L0: -9.5, L1: -3.5 };
let PLOEN = "";
const PLOEN_UNTER = [];
{
  const vk = 0.28;                       /* Vorkragung je Geschoss (m), mit Knaggen */
  const traufe = 8.4, first = 16.6, Lm = (PH.L0 + PH.L1) / 2;
  const d1 = PH.d - vk, d2 = PH.d - 2 * vk, d3 = PH.d - 2 * vk - 0.12;   /* Ebenen der Geschosse */
  const GELB = S.lg("ploengelb", [[0, "#f6cf6a"], [1, "#eab64a"]]);
  let k = "";
  /* rechte Seitenwand entlang der Gasse zum Siebersturm (Keilform: lang, steigender Boden) */
  {
    const Lw = PH.L1, D0 = PH.d, D1 = 36;
    const W = (D, H, e = 0) => P(Lw + e, D, H);
    k += `<path d="${poly(W(D0, 0), W(D1, 0), W(D1, 3.2), W(D0, 3.2))}" fill="#e8bd58"/>`;
    k += `<path d="${poly(W(d1, 3.2, vk), W(D1, 3.2, vk), W(D1, traufe, 2 * vk), W(d2, traufe, 2 * vk))}" fill="${S.lg("ploenseite", [[0, "#f7d06c"], [1, "#e9b54c"]], 0, 0, 1, 0)}"/>`;
    let p = "";
    for (const h of [3.2, 5.8, traufe]) p += `M${pt(W(d1, h, vk))} L${pt(W(D1, h, vk))} `;
    for (let i = 0; i <= 5; i++) { const D = d1 + (D1 - d1) * i / 5; p += `M${pt(W(D, 3.2, vk))} L${pt(W(D, traufe, vk))} `; }
    for (const [Da, Db] of [[d1, 24.4], [31, 33.6]]) p += `M${pt(W(Da, 3.2, vk))} L${pt(W(Db, 5.8, vk))} M${pt(W(Db, 5.8, vk))} L${pt(W(Da, traufe, vk))} `;
    k += `<path d="${p}" stroke="${BALKEN_L}" stroke-width=".9" fill="none"/>`;
    for (const [Da, Db, ha, hb, licht] of [[25.4, 27.2, 4, 5.2, 0], [28.8, 30.4, 4, 5.2, 1], [25.4, 27.2, 6.5, 7.7, 0], [28.8, 30.4, 6.5, 7.7, 0], [26, 27.6, 0.9, 2.3, 0]]) k += fensterQ(W(Da, hb, vk), W(Db, hb, vk), W(Db, ha, vk), W(Da, ha, vk), { rb: 0.4, licht });
    /* Dachfläche rechts (Ziegel), Rinne und Fallrohr */
    k += `<path d="${poly(W(d3, traufe, 2.5 * vk), W(D1, traufe, 2.5 * vk), P(Lm, D1, first), P(Lm, d3, first))}" fill="${DACHZ}"/>`;
    k += `<path d="M${pt(W(d3, traufe, 2.6 * vk))} L${pt(W(D1, traufe, 2.6 * vk))}" stroke="#8a8f94" stroke-width=".7"/><path d="M${pt(W(23.4, traufe, 2.6 * vk))} L${pt(W(23.4, 5.9, 2 * vk))} L${pt(W(23.4, 3.4, 2 * vk))} L${pt(W(23.4, 3.1, vk))} L${pt(W(23.4, 3.1, 0.05))} L${pt(W(23.4, 0.3, 0.05))}" stroke="#8a8f94" stroke-width=".55" fill="none"/>`;
    /* Abendsonne von rechts: Schattenkante aus dem Sonnenmodell (die Wand schaut nach Westen) */
    k += lichtWand((D, h) => W(D, h, h > 3.2 ? vk : 0), (D) => schattenH(Lw, D) - gG(Lw, D), D0, D1, 0, traufe, 18);
    k += `<path d="${poly(W(d3, traufe, 2.5 * vk), W(D1, traufe, 2.5 * vk), P(Lm, D1, first), P(Lm, d3, first))}" fill="#ffb060" opacity=".22"/>`;
  }
  const s = F / PH.d;
  const X = (L, d) => VPX + L * F / d, Y = (h, d) => HOR - (h - EYE) * F / d;
  const e3 = 2.5 * vk;
  const gieb = [[X(PH.L0 - e3, d3), Y(traufe, d3)], [X(Lm, d3), Y(first, d3)], [X(PH.L1 + e3, d3), Y(traufe, d3)]];
  /* Baukörper: EG und Obergeschosse in derselben Farbe und demselben Putz, Giebel */
  const KOERPER = [[0, 3.2, PH.d, 0], [3.2, 5.8, d1, vk], [5.8, traufe, d2, 2 * vk]];
  const rechteck = ([h0, h1, dd, e]) => `<rect x="${r(X(PH.L0 - e, dd))}" y="${r(Y(h1, dd))}" width="${r(X(PH.L1 + e, dd) - X(PH.L0 - e, dd))}" height="${r(Y(h0, dd) - Y(h1, dd))}"/>`;
  S.def(`<clipPath id="${S.id("ploenclip")}">${KOERPER.map(rechteck).join("")}<path d="${poly(...gieb)}"/></clipPath>`);
  k += `<g fill="${GELB}">${KOERPER.map(rechteck).join("")}<path d="${poly(...gieb)}"/></g><g fill="${PUTZ}">${KOERPER.map(rechteck).join("")}<path d="${poly(...gieb)}"/></g>`;
  /* Sockel aus Sandstein */
  k += `<rect x="${r(X(PH.L0, PH.d))}" y="${r(Y(0.55, PH.d))}" width="${r(X(PH.L1, PH.d) - X(PH.L0, PH.d))}" height="${r(0.55 * s)}" fill="#b9a07a"/>`;
  /* Schwellen, Rähme, Ständer und Streben — unregelmäßige Achsen; Knaggen unter den Vorkragungen */
  let p = "";
  const sw = (h, dd, e) => `M${r(X(PH.L0 - e, dd))} ${r(Y(h, dd))} L${r(X(PH.L1 + e, dd))} ${r(Y(h, dd))} `;
  p += sw(3.2, d1, vk) + sw(3.4, d1, vk) + sw(5.8, d2, 2 * vk) + sw(6.0, d2, 2 * vk) + sw(traufe, d3, e3);
  const FW_LINIEN = [];
  const GESCHOSSE = [[3.4, 5.8, d1, vk, [0, 0.21, 0.5, 0.74, 1], [[0, 0.21], [0.74, 1]]], [6.0, traufe, d2, 2 * vk, [0, 0.3, 0.56, 0.82, 1], [[0.56, 0.82]]]];
  for (const [h0, h1, dd, e, st, kreuze] of GESCHOSSE) {
    const Lx = (t) => PH.L0 - e + (PH.L1 - PH.L0 + 2 * e) * t;
    for (const t of st) p += `M${r(X(Lx(t), dd))} ${r(Y(h0, dd))} L${r(X(Lx(t), dd))} ${r(Y(h1, dd))} `;
    for (const [ta, tb] of kreuze) { p += `M${r(X(Lx(ta), dd))} ${r(Y(h0, dd))} L${r(X(Lx(tb), dd))} ${r(Y(h1, dd))} M${r(X(Lx(tb), dd))} ${r(Y(h0, dd))} L${r(X(Lx(ta), dd))} ${r(Y(h1, dd))} `; FW_LINIEN.push([[X(Lx(ta), dd), Y(h1, dd)], [X(Lx(tb), dd), Y(h0, dd)]]); }
    /* Fußstreben (halbe „Mann“-Figur) am Eckständer */
    p += `M${r(X(Lx(0.3), dd))} ${r(Y(h0, dd))} L${r(X(Lx(0.21) + 0.02, dd))} ${r(Y(h0 + 0.9, dd))} `;
    /* Knaggen: kleine Holzkonsolen unter dem vorkragenden Geschoss */
    for (const t of st) { const xa = X(Lx(t) + (t === 0 ? e : t === 1 ? -e : 0), dd + e), x2 = X(Lx(t), dd), y0 = Y(h0 - 0.2, dd), y1 = Y(h0 - 0.75, dd + e); k += `<path d="M${r(xa - 0.5)} ${r(y1)} L${r(xa + 0.5)} ${r(y1)} Q${r(x2 + 0.7)} ${r((y0 + y1) / 2)} ${r(x2 + 0.7)} ${r(y0)} L${r(x2 - 0.7)} ${r(y0)} Q${r(x2 - 0.7)} ${r((y0 + y1) / 2)} ${r(xa - 0.5)} ${r(y1)} Z" fill="${BALKEN}"/>`; }
  }
  const gl = (h) => { const t = (h - traufe) / (first - traufe); return [PH.L0 - e3 + (Lm - PH.L0 + e3) * t, PH.L1 + e3 - (PH.L1 + e3 - Lm) * t]; };
  for (const h of [11, 13.4, 15.2]) { const [a2, b2] = gl(h); p += `M${r(X(a2, d3))} ${r(Y(h, d3))} L${r(X(b2, d3))} ${r(Y(h, d3))} `; }
  for (const t of [0.26, 0.64]) { const L = PH.L0 + (PH.L1 - PH.L0) * t; p += `M${r(X(L, d3))} ${r(Y(traufe, d3))} L${r(X(L, d3))} ${r(Y(13.4, d3))} `; }
  p += `M${r(X(Lm, d3))} ${r(Y(13.4, d3))} L${r(X(Lm, d3))} ${r(Y(first, d3))} `;
  { const [a2] = gl(11), [, b2] = gl(11); p += `M${r(X(a2, d3))} ${r(Y(11, d3))} L${r(X(PH.L0 + 1.4, d3))} ${r(Y(traufe, d3))} M${r(X(b2, d3))} ${r(Y(11, d3))} L${r(X(PH.L1 - 1.9, d3))} ${r(Y(traufe, d3))} `; }
  k += `<path d="${p}" stroke="${BALKEN}" stroke-width="1.2" fill="none" stroke-linecap="square"/>`;
  /* Schattenkanten unter den Vorkragungen und Balkenköpfe der Deckenbalken */
  for (const [h, dd, e] of [[3.2, d1, vk], [5.8, d2, 2 * vk], [traufe, d3, e3]]) {
    const xa = X(PH.L0 - e, dd), xb = X(PH.L1 + e, dd), y = Y(h, dd);
    k += `<rect x="${r(xa)}" y="${r(y)}" width="${r(xb - xa)}" height="1.3" fill="#000" opacity=".26"/>`;
    for (let i = 0; i <= 11; i++) { const x = xa + (xb - xa) * i / 11; k += `<rect x="${r(x - 0.55)}" y="${r(y + 0.15)}" width="1.1" height="1" fill="${BALKEN_L}"/>`; }
  }
  /* Ortgang mit Ziegelkante und Windbrett */
  k += `<path d="M${r(gieb[0][0] - 2.2)} ${r(gieb[0][1] + 1.1)} L${pt(gieb[1])} L${r(gieb[2][0] + 2.2)} ${r(gieb[2][1] + 1.1)}" stroke="#7a3220" stroke-width="2.4" fill="none" stroke-linejoin="round"/>`;
  k += `<path d="M${r(gieb[0][0] - 2.2)} ${r(gieb[0][1] + 1.1)} L${pt(gieb[1])} L${r(gieb[2][0] + 2.2)} ${r(gieb[2][1] + 1.1)}" stroke="#c96a48" stroke-width=".6" fill="none" stroke-linejoin="round" transform="translate(0 -.9)"/>`;
  /* Fenster: unregelmäßig gesetzt und verschieden groß; Blumenkästen nur an einigen */
  const win = (Lc, h0, h1, w, dd, opt = {}) => {
    const a2 = [X(Lc - w / 2, dd), Y(h1, dd)], b2 = [X(Lc + w / 2, dd), Y(h1, dd)], c2 = [X(Lc + w / 2, dd), Y(h0, dd)], d2_ = [X(Lc - w / 2, dd), Y(h0, dd)];
    return fensterQ(a2, b2, c2, d2_, Object.assign({ rb: 0.7, rahmen: "#f6f1e4" }, opt)) + (opt.kasten ? blumen(d2_, c2, 1.1) : "");
  };
  const KASTEN = [];
  k += win(-8.45, 4.05, 5.3, 1.0, d1, { kasten: 1, abend: 1 }) + win(-6.3, 3.95, 5.35, 1.3, d1, { kasten: 1, licht: 1 }) + win(-4.25, 4.3, 5.15, 0.6, d1);
  KASTEN.push([X(-6.3 - 0.65, d1), Y(3.95, d1), X(-6.3 + 0.65, d1) - X(-6.3 - 0.65, d1)]);
  k += win(-7.75, 6.55, 7.8, 1.05, d2, { kasten: 1 }) + win(-5.55, 6.65, 7.75, 0.95, d2, { abend: 1 }) + win(-4.35, 6.8, 7.6, 0.55, d2);
  k += win(-7.2, 9.3, 10.4, 0.85, d3) + win(-5.75, 9.5, 10.5, 0.8, d3, { abend: 1 }) + win(-6.55, 11.9, 12.8, 0.7, d3);
  { const lx0 = X(-6.85, d3), lx1 = X(-6.2, d3), ly0 = Y(14.9, d3), ly1 = Y(13.95, d3); k += `<rect x="${r(lx0)}" y="${r(ly0)}" width="${r(lx1 - lx0)}" height="${r(ly1 - ly0)}" fill="#4a2a1a" stroke="${BALKEN}" stroke-width=".5"/>`; const bx = X(-6.52, d3 - 1.1), by = Y(15.35, d3 - 1.1); k += `<path d="M${r(X(-6.52, d3))} ${r(Y(15.35, d3))} L${r(bx)} ${r(by)}" stroke="${BALKEN}" stroke-width="1.1"/><path d="M${r(bx)} ${r(by)} v4.4" stroke="#6a5a48" stroke-width=".3"/><circle cx="${r(bx)}" cy="${r(by + 0.6)}" r=".55" fill="none" stroke="#3a3a3a" stroke-width=".3"/>`; }
  /* Erdgeschoss: rundbogige Haustür mit Oberlicht, Stufe, zwei ungleiche Fenster, Hausnummer */
  k += `<path d="M${r(X(-5.1, PH.d))} ${r(Y(0, PH.d))} L${r(X(-5.1, PH.d))} ${r(Y(1.9, PH.d))} Q${r(X(-5.1, PH.d))} ${r(Y(2.55, PH.d))} ${r(X(-4.45, PH.d))} ${r(Y(2.55, PH.d))} Q${r(X(-3.8, PH.d))} ${r(Y(2.55, PH.d))} ${r(X(-3.8, PH.d))} ${r(Y(1.9, PH.d))} L${r(X(-3.8, PH.d))} ${r(Y(0, PH.d))} Z" fill="${S.lg("tuer", [[0, "#6b4428"], [1, "#4a2c18"]])}" stroke="#c9a46a" stroke-width=".6"/>`;
  k += `<rect x="${r(X(-5.3, PH.d))}" y="${r(Y(0.18, PH.d))}" width="${r(X(-3.6, PH.d) - X(-5.3, PH.d))}" height="1.5" fill="#b9a07a"/><circle cx="${r(X(-4.0, PH.d))}" cy="${r(Y(1.1, PH.d))}" r=".5" fill="${GOLD}"/>`;
  k += `<rect x="${r(X(-5.75, PH.d))}" y="${r(Y(2.9, PH.d))}" width="2.4" height="1.6" rx=".3" fill="#2a4a7a"/><text x="${r(X(-5.75, PH.d) + 1.2)}" y="${r(Y(2.9, PH.d) + 1.25)}" font-size="1.3" text-anchor="middle" fill="#fff" font-family="Arial">7</text>`;
  k += win(-8.55, 1.05, 2.35, 1.05, PH.d, { licht: 1 }) + win(-6.75, 1.2, 2.3, 0.8, PH.d, { abend: 1 });
  /* Abendlicht aus dem Sonnenmodell: Schattenkante der rechten Zeile (Sägezahn), darüber warm — nur auf dem Haus */
  k += `<g clip-path="url(#${S.id("ploenclip")})">${lichtWand((u, h) => P(u, PH.d - 0.3, h, 0), (u) => schattenH(u, PH.d), PH.L0 - 1, PH.L1 + 1, 0, first + 0.5, 30, 0.3, 0.24)}</g>`;
  PLOEN = k;
  PLOEN_UNTER.push({ id: "giebel", de: "der Giebel", syl: "GIE-bel", it: "il frontone", itSyl: "fron-TO-ne", en: "gable", pts: gieb,
    tipp: "Bei vielen Häusern in Rothenburg zeigt der Giebel zur Gasse." });
  PLOEN_UNTER.push({ id: "fachwerk", de: "das Fachwerk", syl: "FACH-werk", it: "il graticcio", itSyl: "gra-TIC-cio", en: "timber framing", linie: FW_LINIEN,
    tipp: "Fachwerk: ein Gerüst aus Holzbalken. Die Felder dazwischen sind verputzt." });
  PLOEN_UNTER.push({ id: "blumenkasten", de: "der Blumenkasten", syl: "BLU-men-kas-ten", it: "la fioriera", itSyl: "fio-RIE-ra", en: "flower box", box: KASTEN[0],
    tipp: "Im Sommer blühen in den Blumenkästen rote Geranien." });
}
{
  const unter = PLOEN_UNTER.map((u) => {
    if (u.pts) { const cx = u.pts.reduce((s2, p2) => s2 + p2[0], 0) / 3, cy = Math.max(...u.pts.map((p2) => p2[1])); return { id: u.id, de: u.de, syl: u.syl, it: u.it, itSyl: u.itSyl, en: u.en, tipp: u.tipp, x: cx, y: cy, kunst: `<path class="bw-flaeche" d="M${u.pts.map((p2) => `${r(p2[0] - cx)} ${r(p2[1] - cy)}`).join(" L")} Z" fill="rgba(255,255,255,0.001)"/>` }; }
    if (u.linie) { const [a, b] = u.linie[0]; const cx = (a[0] + b[0]) / 2, cy = b[1]; let g = ""; for (const [p1, p2] of u.linie) g += `<path class="bw-flaeche" d="M${r(p1[0] - cx)} ${r(p1[1] - cy)} L${r(p2[0] - cx)} ${r(p2[1] - cy)}" stroke="rgba(255,255,255,0.001)" stroke-width="3.2" fill="none"/>`; return { id: u.id, de: u.de, syl: u.syl, it: u.it, itSyl: u.itSyl, en: u.en, tipp: u.tipp, x: cx, y: cy, kunst: g }; }
    const [bx, by, bw] = u.box; return { id: u.id, de: u.de, syl: u.syl, it: u.it, itSyl: u.itSyl, en: u.en, tipp: u.tipp, x: bx + bw / 2, y: by + 2.4, kunst: flaeche(-bw / 2 - 1, -3.6, bw + 2, 4.4) };
  });
  S.teil({ id: "fachwerkhaus", de: "das Fachwerkhaus", syl: "FACH-werk-haus", it: "la casa a graticcio", itSyl: "CA-sa a gra-TIC-cio", en: "half-timbered house", x: 0, y: 0, kunst: PLOEN,
    tipp: "Das schmale gelbe Fachwerkhaus am Plönlein ist eines der bekanntesten Fotomotive Deutschlands.",
    zoom: { x: 150, y: 40, w: 120, h: 105 }, unter });
}

/* =====================================================================
   7 — DER BRUNNEN (Plönleinbrunnen, mit Blumen)
   ===================================================================== */
{
  const d = 18.6, s = F / d, [x, y] = P(-6.6, d, 0);
  let k = schatten(0, 0.6, 1.6 * s, 0.25 * s, 0.3);
  k += `<path d="M${r(-1.3 * s)} 0 L${r(-1.3 * s)} ${r(-0.75 * s)} Q0 ${r(-0.95 * s)} ${r(1.3 * s)} ${r(-0.75 * s)} L${r(1.3 * s)} 0 Z" fill="${S.lg("trog", [[0, "#b49a72"], [0.5, "#cdb48a"], [1, "#94805e"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${r(-1.3 * s)} ${r(-0.75 * s)} Q0 ${r(-0.95 * s)} ${r(1.3 * s)} ${r(-0.75 * s)} Q0 ${r(-0.62 * s)} ${r(-1.3 * s)} ${r(-0.75 * s)} Z" fill="#dcc8a2"/>`;
  k += `<path d="M${r(-1.15 * s)} ${r(-0.76 * s)} Q0 ${r(-0.9 * s)} ${r(1.15 * s)} ${r(-0.76 * s)} Q0 ${r(-0.68 * s)} ${r(-1.15 * s)} ${r(-0.76 * s)} Z" fill="#7a92a8"/>`;
  for (let i = 0; i < 3; i++) k += `<rect x="${r(-1.3 * s + 0.2)}" y="${r(-0.6 * s + i * 0.22 * s)}" width="${r(2.6 * s - 0.4)}" height=".3" fill="#7f6a4a" opacity=".5"/>`;
  k += `<rect x="${r(-0.18 * s)}" y="${r(-1.9 * s)}" width="${r(0.36 * s)}" height="${r(1.1 * s)}" fill="${S.lg("saeule", [[0, "#a88e66"], [0.4, "#d6c19a"], [1, "#8c7452"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${r(-0.28 * s)}" y="${r(-2 * s)}" width="${r(0.56 * s)}" height="${r(0.14 * s)}" fill="#ccb690"/>`;
  k += `<path d="M${r(0.15 * s)} ${r(-1.45 * s)} l${r(0.35 * s)} ${r(0.05 * s)}" stroke="#4a4a46" stroke-width=".7"/><path d="M${r(0.5 * s)} ${r(-1.4 * s)} q.6 2 .2 ${r(0.55 * s)}" stroke="#cfe6ea" stroke-width=".7" fill="none" opacity=".9"/>`;
  for (let i = 0; i < 18; i++) { const a = rnd() * Math.PI * 2, rr = rnd() * 0.42 * s; k += `<circle cx="${r(Math.cos(a) * rr)}" cy="${r(-2.15 * s + Math.sin(a) * rr * 0.6 - 0.12 * s)}" r="${r(0.13 * s)}" fill="${i % 3 ? "#d6283a" : "#3f6e2e"}"/>`; }
  for (let i = 0; i < 10; i++) k += `<circle cx="${r(-1.2 * s + rnd() * 2.4 * s)}" cy="${r(-0.82 * s)}" r="${r(0.1 * s)}" fill="${i % 2 ? "#e2384a" : "#4f7e36"}"/>`;
  k += `<rect x="${r(-1.4 * s)}" y="${r(-2.3 * s)}" width="${r(2.8 * s)}" height="${r(2.3 * s)}" fill="${SCHATTEN}" opacity=".12"/>`;
  S.teil({ id: "brunnen", de: "der Brunnen", syl: "BRUN-nen", it: "la fontana", itSyl: "fon-TA-na", en: "fountain", x, y, steht: true, kunst: k,
    tipp: "Der kleine Brunnen am Plönlein ist im Sommer voller Blumen." });
}

/* =====================================================================
   KULISSE vorn — die Häuserzeilen der Oberen Schmiedgasse
   (rechts westlich, Fassaden nach Osten: im Schatten; links das Bäckerhaus)
   ===================================================================== */
{
  let c = "";
  const L = 4;
  /* Seitengasse (Lücke) zwischen 14,0 und 16,6 m: die Seitenwand dahinter steht in der Abendsonne, ihr Boden leuchtet */
  c += `<path d="${poly(P(L, 16.6, 0), P(L + 3, 16.6, 0), P(L + 3, 16.6, 11.6), P(L, 16.6, 11.6))}" fill="${S.lg("gassenwand", [[0, "#f7d29a"], [1, "#e9b878"]])}"/>`;
  c += `<path d="${poly(P(L, 14, 0), P(L + 3, 14, 0), P(L + 3, 16.6, 0), P(L, 16.6, 0))}" fill="#e7c48e"/>`;
  for (const hh of [3, 6.2]) c += `<path d="${poly(P(L + 0.4, 16.6, hh + 1.2), P(L + 1.3, 16.6, hh + 1.2), P(L + 1.3, 16.6, hh), P(L + 0.4, 16.6, hh))}" fill="${GLAS_ABEND}"/>`;
  for (const h of RECHTS.slice().reverse()) {
    const dm = (h.d0 + h.d1) / 2, q = (d, H) => P(L, d, H), sk = 10 / dm;
    /* vordere Dachfläche (zeigt zur Gasse hin nach Norden, steiler als unser Blick: sichtbar), Rinne an der Traufe */
    { const T = 13; c += `<path d="${pz(q(h.d0, h.traufe), P(T, h.d0, h.traufe), P(T, dm, h.first), q(dm, h.first))}" fill="${DACHZ}"/><path d="${pz(q(h.d0, h.traufe), P(T, h.d0, h.traufe), P(T, dm, h.first), q(dm, h.first))}" fill="#ffb060" opacity=".16"/>`;
      const g2 = strecke(q(h.d0, h.traufe - 0.15), P(T, h.d0, h.traufe - 0.15)); if (g2) c += `<path d="M${pt(g2[0])} L${pt(g2[1])}" stroke="#8a8f94" stroke-width="${r(Math.max(0.4, 0.8 * sk))}"/>`; }
    c += `<path d="${poly(q(h.d0, 0), q(h.d0, h.traufe), q(dm, h.first), q(h.d1, h.traufe), q(h.d1, 0))}" fill="${h.putz}"/><path d="${poly(q(h.d0, 0), q(h.d0, h.traufe), q(dm, h.first), q(h.d1, h.traufe), q(h.d1, 0))}" fill="${PUTZ}"/>`;
    /* Ortgang mit Ziegelkante und Schatten */
    /* Ortgang: Schattenkante auf dem Putz, Ziegelband mit Dicke, helle Oberkante */
    c += `<path d="M${pt(q(h.d0, h.traufe - 0.55))} L${pt(q(dm, h.first - 0.3))} L${pt(q(h.d1, h.traufe - 0.55))}" stroke="#2a2a36" stroke-width="${r(Math.max(0.5, 0.9 * sk))}" fill="none" opacity=".35" stroke-linejoin="round"/>`;
    c += `<path d="M${pt(q(h.d0 - 0.25, h.traufe - 0.15))} L${pt(q(dm, h.first + 0.35))} L${pt(q(h.d1 + 0.25, h.traufe - 0.15))}" stroke="#7a3220" stroke-width="${r(Math.max(0.9, 2.2 * sk))}" fill="none" stroke-linejoin="round"/>`;
    c += `<path d="M${pt(q(h.d0 - 0.25, h.traufe + 0.05))} L${pt(q(dm, h.first + 0.6))} L${pt(q(h.d1 + 0.25, h.traufe + 0.05))}" stroke="#c4664a" stroke-width="${r(Math.max(0.3, 0.6 * sk))}" fill="none" stroke-linejoin="round"/>`;
    if (h.fw) {
      let p = "";
      for (const hh of [3.2, 6, 8.8]) p += `M${pt(q(h.d0, hh))} L${pt(q(h.d1, hh))} `;
      for (let i = 0; i <= 5; i++) { const d = h.d0 + (h.d1 - h.d0) * i / 5; p += `M${pt(q(d, 3.2))} L${pt(q(d, h.traufe))} `; }
      for (let i = 0; i < 5; i += 2) { const da = h.d0 + (h.d1 - h.d0) * i / 5, db = h.d0 + (h.d1 - h.d0) * (i + 1) / 5; p += `M${pt(q(da, 3.2))} L${pt(q(db, 6))} M${pt(q(db, 6))} L${pt(q(da, 8.8))} `; }
      c += `<path d="${p}" stroke="${BALKEN}" stroke-width="${r(Math.max(0.5, 1.1 * 10 / dm))}" fill="none"/>`;
    }
    /* Fenster mit Laibung, teils Läden, teils Licht */
    const breit = rnd() < 0.5, zwei = (h.d1 - h.d0) < 6 && rnd() < 0.6;
    for (const [ha, hb] of [[3.9, breit ? 5.4 : 5.2], [6.7, breit ? 7.9 : 8.2], [h.traufe + 1, h.traufe + 2.2]]) {
      const n = hb > h.traufe ? 1 : zwei ? 2 : 3;
      for (let i = 0; i < n; i++) {
        const t0 = n === 1 ? 0.42 : n === 2 ? 0.2 + i * 0.42 : 0.12 + i * 0.3, t1 = t0 + (hb > h.traufe ? 0.12 : breit ? 0.18 : 0.12), da = h.d0 + (h.d1 - h.d0) * t0, db = h.d0 + (h.d1 - h.d0) * t1;
        c += wandFenster(L, da, db, ha, hb, { rb: r(Math.max(0.3, 0.5 * 10 / dm)), licht: rnd() < 0.2, abend: rnd() < 0.3 });
        if (n === 3 && i !== 1 && h.d0 > 9 && ha < 5) { for (const [e0, e1] of [[da - (db - da) * 0.5, da], [db, db + (db - da) * 0.5]]) c += `<path d="${poly(q(e0, hb), q(e1, hb), q(e1, ha), q(e0, ha))}" fill="#3f6a48" stroke="#1e3e24" stroke-width=".3"/>`; }
        if (hb < h.traufe && i === 1) c += blumen(q(da, ha), q(db, ha), r(Math.max(0.5, 10 / dm)));
      }
    }
    /* Erdgeschoss: Haustür mit Gewände, Oberlicht und Stufe; Sandsteinsockel; Rinne und Fallrohr */
    if (!h.laden && !h.gasthof) {
      const ta = h.d0 + (h.d1 - h.d0) * 0.6, tb = h.d0 + (h.d1 - h.d0) * 0.76;
      c += `<path d="${poly(q(ta - 0.15, 2.5), q(tb + 0.15, 2.5), q(tb + 0.15, 0), q(ta - 0.15, 0))}" fill="#cdb48a"/><path d="${poly(q(ta, 2.3), q(tb, 2.3), q(tb, 0.2), q(ta, 0.2))}" fill="#5a3a24"/><path d="${poly(q(ta, 2.3), q(tb, 2.3), q(tb, 1.9), q(ta, 1.9))}" fill="${GLAS_ABEND}"/>`;
      c += `<path d="${poly(q(ta - 0.3, 0.2), q(tb + 0.3, 0.2), P(L - 0.5, tb + 0.3, 0.2), P(L - 0.5, ta - 0.3, 0.2))}" fill="#a8916c"/>`;
      c += wandFenster(L, h.d0 + (h.d1 - h.d0) * 0.15, h.d0 + (h.d1 - h.d0) * 0.4, 0.9, 2.2, { rb: r(Math.max(0.3, 0.5 * 10 / dm)) });
    }
    /* Sandsteinsockel mit Fugen und Abdeckplatte */
    c += `<path d="${poly(q(h.d0, 0.8), q(h.d1, 0.8), q(h.d1, 0), q(h.d0, 0))}" fill="#b49a72"/><path d="M${pt(q(h.d0, 0.8))} L${pt(q(h.d1, 0.8))}" stroke="#d8c4a0" stroke-width="${r(Math.max(0.3, 0.5 * sk))}"/>`;
    { let f = ""; for (let d = h.d0 + 0.6; d < h.d1; d += 0.9) f += `M${pt(q(d, 0))} L${pt(q(d, 0.75))} `; c += `<path d="${f}M${pt(q(h.d0, 0.4))} L${pt(q(h.d1, 0.4))}" stroke="#8a7354" stroke-width="${r(Math.max(0.15, 0.25 * sk))}" fill="none"/>`; }
    c += `<path d="M${pt(q(h.d1 - 0.2, h.traufe))} L${pt(q(h.d1 - 0.2, 0.2))}" stroke="#7d8388" stroke-width="${r(Math.max(0.4, 0.9 * 10 / dm))}"/>`;
    c += `<path d="M${pt(q(h.d0, 0))} L${pt(q(h.d0, h.traufe))}" stroke="#000" stroke-width=".4" opacity=".25"/>`;
    /* Hausnummer */
    { const [nx, ny] = q(h.d0 + 0.4, 2.8); const ns = 0.3 * F / h.d0; c += `<rect x="${r(nx)}" y="${r(ny)}" width="${r(ns * 1.2)}" height="${r(ns)}" fill="#2a4a7a"/>`; }
  }
  /* die ganze Zeile liegt im Abendschatten (die Sonne steht hinter ihr) */
  for (const h of RECHTS) { const dm = (h.d0 + h.d1) / 2; c += `<path d="${poly(P(L, h.d0, 0), P(L, h.d0, h.traufe), P(L, dm, h.first), P(L, h.d1, h.traufe), P(L, h.d1, 0))}" fill="${SCHATTEN}" opacity=".3"/>`; }
  S.hinten(c);
}
const LL = -8;
{
  /* Bäckerhaus links: Fachwerk über dem Laden, liegt im Schatten der Gasse */
  let c = "";
  const d0 = 3.2, d1 = 9.3;
  c += `<path d="${poly(P(LL, d0, 22), P(LL, d1, 22), P(LL, d1, 0), P(LL, d0, 0))}" fill="${S.lg("linkshaus", [[0, "#f0d8aa"], [1, "#e4c48c"]], 0, 0, 1, 0)}"/><path d="${poly(P(LL, d0, 22), P(LL, d1, 22), P(LL, d1, 0), P(LL, d0, 0))}" fill="${PUTZ}"/>`;
  let p = "";
  for (const hh of [3.3, 3.55, 6.3, 6.55, 9.3]) p += `M${pt(P(LL, d0, hh))} L${pt(P(LL, d1, hh))} `;
  const n = 6;
  for (let i = 0; i <= n; i++) { const d = 5.6 + (d1 - 5.6) * i / n; p += `M${pt(P(LL, d, 3.55))} L${pt(P(LL, d, 6.3))} M${pt(P(LL, d, 6.55))} L${pt(P(LL, d, 9.3))} `; }
  for (let i = 1; i < n; i += 2) { const da = 5.6 + (d1 - 5.6) * (i - 1) / n, dm = 5.6 + (d1 - 5.6) * i / n, db = 5.6 + (d1 - 5.6) * (i + 1) / n; p += `M${pt(P(LL, da, 3.55))} L${pt(P(LL, dm, 5.2))} L${pt(P(LL, db, 3.55))} M${pt(P(LL, da, 6.55))} L${pt(P(LL, dm, 8.2))} L${pt(P(LL, db, 6.55))} `; }
  c += `<path d="${p}" stroke="${BALKEN}" stroke-width="2.2" fill="none"/>`;
  for (const [ta, tb] of [[6.15, 6.6]]) c += fensterQ(P(LL, ta, 5.6), P(LL, tb, 5.6), P(LL, tb, 4.2), P(LL, ta, 4.2), { rb: 1.1, abend: 1 }) + blumen(P(LL, ta, 4.2), P(LL, tb, 4.2), 2.2);
  for (const [ta, tb, l] of [[6.15, 6.6, 0], [7.4, 7.85, 1], [8.55, 9, 0]]) c += fensterQ(P(LL, ta, 8.6), P(LL, tb, 8.6), P(LL, tb, 7.2), P(LL, ta, 7.2), { rb: 1.1, licht: l, abend: !l });
  c += `<path d="${poly(P(LL, d0, 0.5), P(LL, d1, 0.5), P(LL, d1, 0), P(LL, d0, 0))}" fill="#a8916c"/>`;
  for (let i = 0; i < 9; i++) { const a = P(LL, d1, i * 1.1), b = P(LL, d1, i * 1.1 + 0.9); c += `<path d="M${r(a[0] - 2.4)} ${r(a[1])} L${r(a[0])} ${r(a[1])} L${r(b[0])} ${r(b[1])} L${r(b[0] - 2.4)} ${r(b[1])} Z" fill="#d8c19a" opacity=".8"/>`; }
  /* Laden links vom Schaufenster: Tür mit Glocke */
  c += `<path d="${poly(P(LL, 5.3, 2.6), P(LL, 6.1, 2.6), P(LL, 6.1, 0.45), P(LL, 5.3, 0.45))}" fill="#4a2c18"/><path d="${poly(P(LL, 5.42, 2.4), P(LL, 5.98, 2.4), P(LL, 5.98, 1.2), P(LL, 5.42, 1.2))}" fill="${GLAS_LICHT}"/>`;
  /* Abendsonne: Sägezahn-Schatten der rechten Giebel steigt auf der Fassade an */
  c += lichtWand((u, h) => P(LL, u, h, 0), (u) => schattenH(LL, u), d0, d1, 0, 22, 30, 0.3, 0.24);
  S.hinten(c);
}

/* =====================================================================
   8 — DAS KOPFSTEINPFLASTER: Segmentbögen, Steingröße ∝ 1/Abstand,
       Fugen laufen zum Fluchtpunkt (Bänder mit je ganzen Steinreihen)
   ===================================================================== */
{
  /* Steinreihen als Segmentbögen (1,6 m breit, 20 cm Stich, zum Betrachter gewölbt). Jede Reihe ist ein
     Pfad über die Bögen; die Steine sind Striche mit Strichmuster (Länge ∝ 1/Abstand) — stufenlos, ohne Nähte. */
  const RH = 0.15, PER = 1.7, AMP = 0.15;
  const yD = (D) => HOR + EYE * F / D;
  const flaecheP = zuschnitt([[-1, 262], P(LL, 3.4, 0), P(LL, 9.3, 0), PS(-11.7, 5, 0), PS(-6, 5, 0), PS(-6, 0, 0), P(PH.L0, PH.d, 0), P(PH.L1, PH.d, 0), P(PH.L1, 21.05, 0, 0), P(4, 21.05, 0, 0), P(4, 3.3, 0), [401, 262]]);
  S.def(`<clipPath id="${S.id("pflclip")}"><path d="${poly(...flaecheP)}"/></clipPath>`);
  const reihe = (Dc) => {
    const xa = Math.max(-15, -258 * Dc / F), xb = Math.min(4.2, 125 * Dc / F), X0 = Math.floor(xa / PER) * PER;
    const Pq = (X, D) => P(X, D, 0, 0), lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
    let d = "";
    for (let X = X0; X < xb; X += PER) {
      let p0 = [X, Dc], p1 = [X + PER / 2, Dc - 2 * AMP], p2 = [X + PER, Dc];
      const t0 = Math.max(0, (xa - X) / PER), t1 = Math.min(1, (xb - X) / PER);
      if (t1 < 1) { const q1 = lerp(p0, p1, t1), q2 = lerp(p1, p2, t1); p2 = lerp(q1, q2, t1); p1 = q1; }
      if (t0 > 0) { const s0 = t0 / t1, q1 = lerp(p0, p1, s0), q2 = lerp(p1, p2, s0); p0 = lerp(q1, q2, s0); p1 = q2; }
      d += (d ? "" : `M${pt(Pq(...p0))}`) + ` Q${pt(Pq(...p1))} ${pt(Pq(...p2))}`;
    }
    return d;
  };
  const STEINE = ["#ab9c84", "#b6a68c", "#a0917b", "#bcab92", "#998b77", "#ae9e86"];
  let b = "", D = 3.4, i = 0;
  for (; D < 22; D += RH, i++) {
    const Dc = D + RH / 2, dy = yD(D) - yD(D + RH);
    if (dy < 0.62) break;
    const m = F / Dc, da = `${r(0.14 * m)} ${r(0.028 * m)} ${r(0.115 * m)} ${r(0.028 * m)}`;
    b += `<path d="${reihe(Dc)}" stroke="${STEINE[i % 6]}" stroke-width="${r(dy * 0.8)}" stroke-dasharray="${da}" stroke-dashoffset="${r((i % 3) * 0.07 * m)}" fill="none"/>`;
  }
  /* ferne Zone: nur noch die Fugen der Bögen, so dicht, wie das Auge sie trennt */
  const yNah = yD(D);
  let f = "";
  for (let acc = 0; D < 22; D += RH) { acc += yD(D) - yD(D + RH); if (acc >= 0.78) { f += reihe(D) + " "; acc = 0; } }
  let k = `<path d="${poly(...flaecheP)}" fill="#998b77"/><g clip-path="url(#${S.id("pflclip")})"><rect x="-1" y="${r(yNah)}" width="402" height="${r(262 - yNah)}" fill="#76695a"/>${b}<path d="${f}" stroke="#5e554a" stroke-width=".26" fill="none" opacity=".8"/>`;
  /* Rinne aus Granit-Längssteinen in der Mitte, nass glänzend */
  k += `<path d="${poly(P(-0.2, 3.3, 0, 0), P(0.2, 3.3, 0, 0), P(0.2, 21, 0, 0), P(-0.2, 21, 0, 0))}" fill="#7a736a"/>`;
  { let q = ""; for (let d = 3.5; d < 21; d += 0.6) q += `M${pt(P(-0.2, d, 0, 0))} L${pt(P(0.2, d, 0, 0))} `; k += `<path d="${q}" stroke="#4e483f" stroke-width=".3"/>`; }
  k += `<path d="M${pt(P(-0.2, 3.3, 0, 0))} L${pt(P(-0.2, 21, 0, 0))} M${pt(P(0.2, 3.3, 0, 0))} L${pt(P(0.2, 21, 0, 0))}" stroke="#4a443c" stroke-width=".4"/>`;
  k += `<path d="M${pt(P(0.02, 3.3, 0, 0))} L${pt(P(0.02, 21, 0, 0))}" stroke="#dfe6ea" stroke-width=".5" opacity=".45"/>`;
  /* Kanaldeckel mit Stadtwappen-Relief im Vordergrund */
  { const [cx, cy] = P(-1.6, 5.2, 0, 0), sx = F / 5.2 * 0.32, sy = sx * (yD(5.04) - yD(5.36)) / (F / 5.2 * 0.64); k += `<ellipse cx="${r(cx)}" cy="${r(cy)}" rx="${r(sx + 0.8)}" ry="${r(sy + 0.5)}" fill="#5a544c"/><ellipse cx="${r(cx)}" cy="${r(cy)}" rx="${r(sx)}" ry="${r(sy)}" fill="#3e3a35"/><ellipse cx="${r(cx)}" cy="${r(cy)}" rx="${r(sx * 0.62)}" ry="${r(sy * 0.62)}" fill="none" stroke="#6a6258" stroke-width=".5"/><path d="M${r(cx - sx * 0.9)} ${r(cy)} H${r(cx + sx * 0.9)} M${r(cx)} ${r(cy - sy * 0.9)} V${r(cy + sy * 0.9)}" stroke="#6a6258" stroke-width=".4"/>`; }
  /* Abendschatten: die ganze Gasse liegt im Schatten der rechten Zeile; durch die Seitengasse fällt ein Lichtband */
  k += `<rect x="-1" y="${HOR - 2}" width="402" height="${263 - HOR}" fill="${SCHATTEN}" opacity=".26"/>`;
  {
    const lo = [], hi = [];
    for (let X = 4; X >= -9.5; X -= 0.5) {
      let a2 = null, b2 = null;
      for (let d = 12; d < 22; d += 0.05) { const lit = schattenH(X, d) <= 0; if (lit && a2 === null) a2 = d; if (lit) b2 = d; }
      if (a2 !== null) { lo.push(P(X, a2, 0, 0)); hi.push(P(X, b2, 0, 0)); }
    }
    if (lo.length > 1) k += `<path d="${poly(...lo, ...hi.slice().reverse())}" fill="#ffc477" opacity=".5"/>`;
  }
  k += `<rect x="-1" y="${HOR - 2}" width="402" height="${263 - HOR}" fill="${S.lg("pflnah", [[0, "#000", 0], [0.6, "#000", 0.04], [1, "#120c08", 0.2]])}"/></g>`;
  /* rechte Gasse zum Siebersturm: sanfte Rampe (7 %), feines Pflaster, Bordstein steigt mit */
  S.def(`<pattern id="${S.id("fern")}" width="1.4" height=".9" patternUnits="userSpaceOnUse"><rect width="1.4" height=".9" fill="#8f8474"/><ellipse cx=".35" cy=".3" rx=".3" ry=".16" fill="#a3967f"/><ellipse cx="1.05" cy=".72" rx=".28" ry=".15" fill="#9a8d7a"/><ellipse cx="1.1" cy=".22" rx=".2" ry=".12" fill="#7f7466"/></pattern>`);
  const G = [P(PH.L1, 21.05, 0, 0), P(4, 21.05, 0, 0), P(4, 44.6, 0), P(-3.5, 44.6, 0)];
  k += `<path d="${poly(...G)}" fill="url(#${S.id("fern")})"/>`;
  k += `<path d="M${pt(P(3.6, 21.05, 0.12, 0))} L${pt(P(3.6, 44.6, 0.12))}" stroke="#cbb898" stroke-width=".6"/><path d="M${pt(P(-3.3, 21.05, 0.12, 0))} L${pt(P(-3.3, 44.6, 0.12))}" stroke="#b9a684" stroke-width=".5"/>`;
  k += `<path d="${poly(...G)}" fill="${SCHATTEN}" opacity=".3"/>`;
  S.teil({ id: "pflaster", de: "das Kopfsteinpflaster", syl: "KOPF-stein-pflas-ter", it: "il selciato", itSyl: "sel-CIA-to", en: "cobblestones", x: 0, y: 0, kunst: k,
    tipp: "Die Pflastersteine liegen in Bögen. Rechts steigt die Gasse sanft zum Siebersturm an." });
}

/* =====================================================================
   5 — DIE GASSE (Kobolzeller Steige: fällt hinter der Kante sichtbar ab)
   ===================================================================== */
{
  /* Die Steige: ab der Platzkante fällt sie; Bordsteine und Pflasterbögen fluchten auf einen Punkt UNTER dem
     Horizont. An der Kante (t = 20) kippt sie steil weg — dahinter tauchen nur noch Dächer und der Torturm auf. */
  const TK = 6, L = [], R = [];
  for (let t = -6; t <= TK + 0.01; t += 1) { L.push(PS(t, 5, 0)); R.push(PS(t, 0, 0)); }
  let k = `<path d="${poly(...L, ...R.slice().reverse())}" fill="${S.lg("steige", [[0, "#837868"], [1, "#9a8d7a"]], 0, 0, 0, 1)}"/>`;
  /* Pflasterbögen quer zur Steige: so dicht, wie das Auge sie trennt */
  { let d = "", yAlt = 999; for (let t = -6; t < TK; t += 0.15) { const y = PS(t, 2.5, 0)[1]; if (yAlt - y < 0.7) continue; yAlt = y; d += `M${pt(PS(t, 0.1, 0))} Q${pt(PS(t - 0.35, 2.5, 0))} ${pt(PS(t, 4.9, 0))} `; } k += `<path d="${d}" stroke="#5f564b" stroke-width=".28" fill="none" opacity=".8"/>`; }
  /* Rinne in der Mitte, Bordsteine — alle fluchten abwärts */
  k += `<path d="M${pt(PS(-6, 2.5, 0))} L${pt(PS(TK, 2.5, 0))}" stroke="#575046" stroke-width=".9" opacity=".7"/>`;
  k += `<path d="M${L.map(pt).join(" L")}" stroke="#cdbb98" stroke-width=".7" fill="none"/><path d="M${R.map(pt).join(" L")}" stroke="#cdbb98" stroke-width=".7" fill="none"/>`;
  /* Mäuerchen an der Platzkante rechts: der Platz bleibt eben, die Steige sinkt daneben ab */
  k += `<path d="${poly(PS(-6, 0, 0), PS(0, 0, 0), PS(0, 0, 0.39 + 0.22), PS(-6, 0, 0.22))}" fill="#9c8a6c"/><path d="M${pt(PS(-6, 0, 0.22))} L${pt(PS(0, 0, 0.61))}" stroke="#cdbb98" stroke-width=".5"/>`;
  /* die Kante: heller Grat, dahinter warmer Dunst aus dem Tal */
  k += `<path d="M${pt(PS(TK, 5, 0))} L${pt(PS(TK, 0, 0))}" stroke="#ddcdaa" stroke-width=".8"/>`;
  k += `<path d="${poly(...L, ...R.slice().reverse())}" fill="${SCHATTEN}" opacity=".26"/>`;
  S.teil({ id: "gasse", de: "die Gasse", syl: "GAS-se", it: "il vicolo", itSyl: "VI-co-lo", en: "lane", x: 0, y: 0, kunst: k,
    tipp: "Die Kobolzeller Steige ist eine steile Gasse. Sie führt hinunter zum Kobolzeller Tor." });
}

/* =====================================================================
   9 — DIE BÄCKEREI (Laden links vorn) — Lupe: der Schneeballen, die Brezel
   ===================================================================== */
{
  const d0 = 6.4, d1 = 9.05;
  let k = "";
  k += `<path d="${poly(P(LL, d0 - 0.15, 2.85), P(LL, d1 + 0.15, 2.85), P(LL, d1 + 0.15, 0.45), P(LL, d0 - 0.15, 0.45))}" fill="#5a3a22"/>`;
  k += `<path d="${poly(P(LL, d0, 2.7), P(LL, d1, 2.7), P(LL, d1, 0.6), P(LL, d0, 0.6))}" fill="${S.lg("ladenlicht", [[0, "#ffe7b0"], [1, "#e8b46a"]])}"/>`;
  /* Auslage: Schneeballen als Knäuel aus breiten Teigbändern (Puderzucker, Schokolade, Nuss), einige in Klarsichttüten, dazu Brezeln */
  const ball = (x, y, rr, art) => {
    const f = { zucker: ["#f6f1e8", "#cfc3ae", "#e8dfcf"], schoko: ["#5a3218", "#2e1a0c", "#7a4a2a"], nuss: ["#c98a46", "#7a4a22", "#e0b070"] }[art];
    let g = `<circle cx="${r(x)}" cy="${r(y - rr)}" r="${r(rr)}" fill="${f[1]}"/>`;
    for (const [a, b2, c2] of [[-0.55, -1.45, 0.52], [0.5, -1.25, 0.47], [-0.1, -0.65, 0.58], [0.6, -0.55, 0.36]]) g += `<ellipse cx="${r(x + a * rr)}" cy="${r(y + b2 * rr)}" rx="${r(c2 * rr)}" ry="${r(c2 * rr * 0.55)}" fill="${f[0]}" transform="rotate(${Math.round((a + b2) * 40)} ${r(x + a * rr)} ${r(y + b2 * rr)})"/>`;
    if (art === "zucker") for (let i = 0; i < 2; i++) g += `<circle cx="${r(x + (rnd() - 0.5) * rr * 1.4)}" cy="${r(y - rr + (rnd() - 0.5) * rr * 1.2)}" r="${r(rr * 0.08)}" fill="#fff"/>`;
    g += `<circle cx="${r(x - rr * 0.35)}" cy="${r(y - rr * 1.4)}" r="${r(rr * 0.25)}" fill="${f[2]}" opacity=".7"/>`;
    return g;
  };
  const boden = [0.95, 1.55, 2.15];
  const pos = [];
  boden.forEach((hb, bi) => {
    k += `<path d="${poly(P(LL, d0, hb), P(LL, d1, hb), P(LL, d1, hb - 0.06), P(LL, d0, hb - 0.06))}" fill="#c8b9a2"/>`;
    for (let i = 0; i < 8; i++) {
      const d = d0 + 0.22 + i * (d1 - d0 - 0.44) / 7, [x, y] = P(LL, d, hb), rr = 0.085 * F / d;
      if (bi === 1 && i % 3 === 2) {
        const q = (dx, dy) => `${r(x + dx * rr)} ${r(y + dy * rr)}`;
        k += `<path d="M${q(-1.5, -0.4)} C${q(-2.1, -1.6)} ${q(-1.2, -2.6)} ${q(-0.2, -2.1)} L${q(0.5, -0.9)} M${q(1.5, -0.4)} C${q(2.1, -1.6)} ${q(1.2, -2.6)} ${q(0.2, -2.1)} L${q(-0.5, -0.9)} M${q(-1.5, -0.4)} Q${q(0, 0.5)} ${q(1.5, -0.4)}" stroke="#8a4614" stroke-width="${r(rr * 0.55)}" fill="none" stroke-linecap="round"/>`;
        for (const [dx, dy] of [[-1.2, -1.6], [0.9, -1.9], [0, -0.1]]) k += `<circle cx="${r(x + dx * rr)}" cy="${r(y + dy * rr)}" r="${r(rr * 0.12)}" fill="#fffaf0"/>`;
        pos.push(["brezel", x, y]);
      } else {
        const art = ["zucker", "schoko", "zucker", "nuss"][(i + bi) % 4];
        k += ball(x, y, rr, art);
        if (bi === 2 && i % 4 === 1) k += `<path d="M${r(x - rr * 1.3)} ${r(y)} L${r(x - rr * 1.4)} ${r(y - rr * 2.4)} Q${r(x)} ${r(y - rr * 3)} ${r(x + rr * 1.4)} ${r(y - rr * 2.4)} L${r(x + rr * 1.3)} ${r(y)} Z" fill="#e8f4f8" opacity=".35" stroke="#fff" stroke-width=".2"/><path d="M${r(x - rr * 0.4)} ${r(y - rr * 2.75)} l${r(rr * 0.4)} ${r(-rr * 0.5)} l${r(rr * 0.4)} ${r(rr * 0.5)}" stroke="#c8202c" stroke-width="${r(rr * 0.15)}" fill="none"/>`;
        if (bi === 2 && i === 1) pos.push(["schneeball", x, y]);
      }
    }
  });
  { const [x, y] = P(LL, 7.6, 1.55); k += `<rect x="${r(x - 8.4)}" y="${r(y + 0.4)}" width="16.8" height="2.4" rx=".3" fill="#fff" stroke="#b8a37a" stroke-width=".2"/><text x="${r(x)}" y="${r(y + 2.2)}" font-size="1.6" text-anchor="middle" fill="#3a2a18" font-family="Arial" font-weight="bold">Schneeballen 3,50 €</text>`; }
  k += `<path d="${poly(P(LL, d0 + 0.2, 2.7), P(LL, d0 + 0.6, 2.7), P(LL, d0 + 1.1, 0.6), P(LL, d0 + 0.7, 0.6))}" fill="#fff" opacity=".22"/>`;
  /* Ladenschild: Schrift perspektivisch (jeder Buchstabe auf seiner Tiefe) */
  k += `<path d="${poly(P(LL, d0 - 0.1, 3.3), P(LL, d1 + 0.1, 3.3), P(LL, d1 + 0.1, 2.9), P(LL, d0 - 0.1, 2.9))}" fill="#3e2414"/>`;
  {
    const txt = "Bäckerei · Konditorei", n = txt.length, lage = zeichenLage(txt);
    for (let i = 0; i < n; i++) {
      const d = d0 + 0.15 + (d1 - d0 - 0.3) * lage[i], [x, y] = P(LL, d, 2.98), fs = 0.32 * F / d;
      const [, yt] = P(LL, d, 3.24), sk = Math.atan2((P(LL, d + 0.1, 2.98)[1] - y), (P(LL, d + 0.1, 2.98)[0] - x)) * 180 / Math.PI;
      if (txt[i] !== " ") k += `<text x="${r(x)}" y="${r(y)}" font-size="${r(fs)}" text-anchor="middle" fill="#e8c56a" font-family="Georgia,serif" font-weight="bold" transform="rotate(${r(sk)} ${r(x)} ${r(y)})">${txt[i]}</text>`;
      void yt;
    }
  }
  /* Bäckerzeichen: schmiedeeiserner Ausleger mit vergoldeter Brezel unter einer Krone */
  {
    /* Ausleger knapp über dem Ladenschild (nicht hinter Laden und Blumenkasten), Zeichen hängt an zwei Ketten am Ende */
    const [x0, y0] = P(LL, 6.5, 3.62), [x1] = P(-6.5, 6.5, 3.62);
    k += `<rect x="${r(x0 - 0.9)}" y="${r(y0 - 3.5)}" width="1.8" height="8" fill="${EISEN}"/><path d="M${r(x0)} ${r(y0)} L${r(x1)} ${r(y0)}" stroke="${EISEN}" stroke-width="1.1"/>`;
    k += `<path d="M${r(x0)} ${r(y0 + 4.2)} Q${r(x0 + (x1 - x0) * 0.45)} ${r(y0 + 3.4)} ${r(x1 - 6)} ${r(y0 + 0.4)}" stroke="${EISEN}" stroke-width=".7" fill="none"/>`;
    for (const t of [0.28, 0.55]) { const x = x0 + (x1 - x0) * t; k += `<path d="M${r(x)} ${r(y0)} q-2 -3 0 -4.4 q2 1 .4 2.6" stroke="${EISEN}" stroke-width=".5" fill="none"/>`; }
    k += `<circle cx="${r(x1)}" cy="${r(y0)}" r=".8" fill="${EISEN}"/>`;
    const cx = x1 - 2.6, sc = 3.3, top = y0 + 2.2, q = (dx, dy) => `${r(cx + dx * sc)} ${r(top + 4.4 + 9 + dy * sc)}`;
    /* Ketten */
    k += `<path d="M${r(cx - 2.6)} ${r(y0 + 0.4)} L${r(cx - 2.6)} ${r(top + 0.6)} M${r(cx + 2.6)} ${r(y0 + 0.4)} L${r(cx + 2.6)} ${r(top + 0.6)}" stroke="#3a3530" stroke-width=".35" stroke-dasharray=".5 .3"/>`;
    /* Krone (vergoldet) und darunter die Brezel; dunkler Abdruck dahinter für Tiefe */
    const krone = (dx, dy, f, st) => `<path d="M${r(cx - 3 + dx)} ${r(top + 4.2 + dy)} L${r(cx - 3.2 + dx)} ${r(top + 0.8 + dy)} L${r(cx - 1.5 + dx)} ${r(top + 2.6 + dy)} L${r(cx + dx)} ${r(top + dy)} L${r(cx + 1.5 + dx)} ${r(top + 2.6 + dy)} L${r(cx + 3.2 + dx)} ${r(top + 0.8 + dy)} L${r(cx + 3 + dx)} ${r(top + 4.2 + dy)} Z" fill="${f}"${st}/>`;
    const brezelD = `M${q(-1.5, -0.4)} C${q(-2.1, -1.6)} ${q(-1.2, -2.6)} ${q(-0.2, -2.1)} L${q(0.5, -0.9)} M${q(1.5, -0.4)} C${q(2.1, -1.6)} ${q(1.2, -2.6)} ${q(0.2, -2.1)} L${q(-0.5, -0.9)} M${q(-1.5, -0.4)} Q${q(0, 0.5)} ${q(1.5, -0.4)}`;
    k += `<g transform="translate(.8 .6)" opacity=".35">${krone(0, 0, "#1a140c", "")}<path d="${brezelD}" stroke="#1a140c" stroke-width="2" fill="none" stroke-linecap="round"/></g>`;
    k += krone(0, 0, GOLD, ` stroke="#8a6a2a" stroke-width=".25"`) + `<circle cx="${r(cx)}" cy="${r(top - 0.3)}" r=".5" fill="${GOLD}"/>`;
    k += `<path d="M${r(cx)} ${r(top + 4.2)} L${r(cx)} ${r(top + 6)}" stroke="#3a3530" stroke-width=".35"/>`;
    k += `<path d="${brezelD}" stroke="${GOLD}" stroke-width="2" fill="none" stroke-linecap="round"/><path d="${brezelD}" stroke="#fff3c0" stroke-width=".4" fill="none" stroke-linecap="round" opacity=".5" transform="translate(-.3 -.4)"/>`;
  }
  const sb = pos.find((p2) => p2[0] === "schneeball"), br = pos.find((p2) => p2[0] === "brezel");
  S.teil({ id: "baeckerei", de: "die Bäckerei", syl: "bä-cke-REI", it: "il panificio", itSyl: "pa-ni-FI-cio", en: "bakery", x: 0, y: 0, kunst: k,
    tipp: "Am Bäckerzeichen – einer Brezel mit Krone – erkennt man von Weitem die Bäckerei.",
    zoom: { x: 0, y: 136, w: 96, h: 64 },
    unter: [
      { id: "schneeballen", de: "der Schneeballen", syl: "SCHNEE-bal-len", it: "lo Schneeball (dolce di Rothenburg)", itSyl: "SCHNEE-ball (DOL-ce di Rothenburg)", en: "Schneeball pastry", x: sb[1], y: sb[2], kunst: flaeche(-7, -9, 14, 9.4),
        tipp: "Der Rothenburger Schneeballen (Mehrzahl: die Schneeballen) ist ein Gebäck aus Teigstreifen – mit Puderzucker oder Schokolade." },
      { id: "brezel", de: "die Brezel", syl: "BRE-zel", it: "il pretzel", itSyl: "PRET-zel", en: "pretzel", x: br[1], y: br[2], kunst: flaeche(-6, -7, 12, 7.4) },
    ] });
}
{
  /* 10 — DER FENSTERLADEN: zwei grüne Läden am Fenster über der Bäckerei (Fläche = nur die Läden) */
  const L = LL, da = 7.4, db = 7.85, ha = 4.2, hb = 5.6;
  let k = fensterQ(P(L, da, hb), P(L, db, hb), P(L, db, ha), P(L, da, ha), { rb: 1.1, licht: 1 });
  for (const [a, b] of [[da - 0.42, da - 0.04], [db + 0.04, db + 0.42]]) {
    k += `<path d="${poly(P(L, a, hb + 0.05), P(L, b, hb + 0.05), P(L, b, ha - 0.05), P(L, a, ha - 0.05))}" fill="${S.lg("laden", [[0, "#3f7a4a"], [1, "#2c5a36"]])}" stroke="#1e3e24" stroke-width=".4"/>`;
    for (let i = 1; i < 6; i++) { const h = ha + (hb - ha) * i / 6; k += `<path d="M${pt(P(L, a + 0.03, h))} L${pt(P(L, b - 0.03, h - 0.08))}" stroke="#1e3e24" stroke-width=".35"/>`; }
    k += `<path class="bw-flaeche" d="${poly(P(L, a, hb + 0.05), P(L, b, hb + 0.05), P(L, b, ha - 0.05), P(L, a, ha - 0.05))}" fill="rgba(255,255,255,0.001)"/>`;
  }
  k += `<path d="${poly(P(L, da - 0.45, hb + 0.1), P(L, db + 0.45, hb + 0.1), P(L, db + 0.45, ha - 0.1), P(L, da - 0.45, ha - 0.1))}" fill="${SCHATTEN}" opacity=".22" pointer-events="none"/>`;
  k += blumen(P(L, da, ha), P(L, db, ha), 2.2);
  S.teil({ oben: true, id: "fensterladen", de: "der Fensterladen", syl: "FENS-ter-la-den", it: "l'imposta", itSyl: "im-PO-sta", en: "shutter", x: 0, y: 0, kunst: k,
    tipp: "Mit den Fensterläden schützt man das Zimmer vor Sonne und Kälte." });
}

/* =====================================================================
   11 — DAS SCHAUFENSTER mit Weihnachtsschmuck (rechts, zweites Haus)
        Inhalt steht hinter der Scheibe in der Ebene des Fensters
        Lupe: der Nussknacker, die Christbaumkugel, der Stern
   ===================================================================== */
{
  const L = 4, d0 = 10.1, d1 = 13.9, h0 = 0.6, h1 = 2.7, Li = 4.35;   /* Li: Auslage 35 cm hinter der Scheibe */
  let k = `<path d="${poly(P(L, d0 - 0.15, h1 + 0.25), P(L, d1 + 0.15, h1 + 0.25), P(L, d1 + 0.15, h0 - 0.15), P(L, d0 - 0.15, h0 - 0.15))}" fill="#6e1e22"/>`;
  S.def(`<clipPath id="${S.id("sfclip")}"><path d="${poly(P(L, d0, h1), P(L, d1, h1), P(L, d1, h0), P(L, d0, h0))}"/></clipPath>`);
  k += `<g clip-path="url(#${S.id("sfclip")})">`;
  k += `<path d="${poly(P(Li, d0, h1), P(Li, d1, h1), P(Li, d1, h0), P(Li, d0, h0))}" fill="${S.lg("weihnachtslicht", [[0, "#fff1c8"], [1, "#f2c278"]])}"/>`;
  /* Fensterbank mit roter Decke und Auslage */
  k += `<path d="${poly(P(Li - 0.05, d0, h0 + 0.12), P(Li - 0.05, d1, h0 + 0.12), P(Li + 0.3, d1, h0 + 0.12), P(Li + 0.3, d0, h0 + 0.12))}" fill="#b02028"/>`;
  /* Tannengirlande mit Lichtern oben */
  for (let i = 0; i < 14; i++) { const d = d0 + (d1 - d0) * i / 13, [x, y] = P(Li, d, h1 - 0.1); k += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(1.3 * 10 / d)}" fill="#2f5a32"/><circle cx="${r(x)}" cy="${r(y + 0.7)}" r=".35" fill="#ffe27a"/>`; }
  /* Weihnachtsbaum (hinten) */
  { const d = 13.2, [x, y] = P(Li + 0.3, d, h0 + 0.12), s = F / d;
    k += `<rect x="${r(x - 0.04 * s)}" y="${r(y - 0.16 * s)}" width="${r(0.08 * s)}" height="${r(0.16 * s)}" fill="#5a3a22"/>`;
    for (const [y0, y1, w] of [[0.12, 0.75, 0.4], [0.55, 1.15, 0.3], [0.95, 1.55, 0.2]]) k += `<path d="M${r(x - w * s)} ${r(y - y0 * s)} Q${r(x - w * 0.4 * s)} ${r(y - (y0 + 0.1) * s)} ${r(x)} ${r(y - y1 * s)} Q${r(x + w * 0.4 * s)} ${r(y - (y0 + 0.1) * s)} ${r(x + w * s)} ${r(y - y0 * s)} Q${r(x)} ${r(y - (y0 - 0.06) * s)} ${r(x - w * s)} ${r(y - y0 * s)} Z" fill="#2c5a30"/><path d="M${r(x - w * 0.9 * s)} ${r(y - y0 * s)} Q${r(x - w * 0.4 * s)} ${r(y - (y0 + 0.12) * s)} ${r(x - 0.3)} ${r(y - y1 * s + 0.6)}" stroke="#5f8a4a" stroke-width=".35" fill="none"/>`; for (let i = 0; i < 7; i++) k += `<circle cx="${r(x + (rnd() - 0.5) * 0.45 * s)}" cy="${r(y - (0.2 + rnd() * 1) * s)}" r=".6" fill="${["#c8202c", "#e8b830", "#e8e8ee"][i % 3]}"/>`; k += `<path d="M${r(x)} ${r(y - 1.62 * s)} l.5 1 l-1 0 Z" fill="#f2c83a"/>`; }
  /* Nussknacker: in der Fensterebene, mit Tiefe projiziert */
  const KN = P(Li, 11.5, h0 + 0.12);
  {
    const [x, y] = KN, s = F / 11.5;
    const Q = (dd, H) => P(Li, 11.5 + dd, h0 + 0.12 + H);
    k += `<path d="${poly(Q(-0.1, 0.3), Q(0.1, 0.3), Q(0.1, 0), Q(-0.1, 0))}" fill="#1a1a1a"/>`;
    k += `<path d="${poly(Q(-0.14, 0.75), Q(0.14, 0.75), Q(0.14, 0.3), Q(-0.14, 0.3))}" fill="#c8202c"/><path d="M${pt(Q(-0.14, 0.52))} L${pt(Q(0.14, 0.52))}" stroke="#f2c83a" stroke-width=".7"/>`;
    k += `<path d="${poly(Q(-0.11, 0.98), Q(0.11, 0.98), Q(0.11, 0.75), Q(-0.11, 0.75))}" fill="#f2d2b0"/><path d="${poly(Q(-0.11, 0.86), Q(0.11, 0.86), Q(0.11, 0.77), Q(-0.11, 0.77))}" fill="#f6f4ee"/>`;
    k += `<path d="${poly(Q(-0.12, 1.24), Q(0.12, 1.24), Q(0.12, 0.98), Q(-0.12, 0.98))}" fill="#1a1a1a"/><circle cx="${r(Q(0, 1.24)[0])}" cy="${r(Q(0, 1.24)[1])}" r="${r(0.03 * s)}" fill="#f2c83a"/>`;
    k += `<circle cx="${r(Q(-0.04, 0.92)[0])}" cy="${r(Q(0, 0.92)[1])}" r=".25" fill="#1a1a1a"/><circle cx="${r(Q(0.04, 0.92)[0])}" cy="${r(Q(0, 0.92)[1])}" r=".25" fill="#1a1a1a"/>`;
    /* Gesicht: rote Wangen, weißer Schnurrbart, großer Mund mit Zähnen; Arme mit Händen an den Seiten; Goldband an der Mütze */
    k += `<circle cx="${r(Q(-0.07, 0.88)[0])}" cy="${r(Q(0, 0.88)[1])}" r=".35" fill="#e8848a" opacity=".8"/><circle cx="${r(Q(0.07, 0.88)[0])}" cy="${r(Q(0, 0.88)[1])}" r=".35" fill="#e8848a" opacity=".8"/>`;
    k += `<path d="M${pt(Q(-0.08, 0.86))} Q${pt(Q(0, 0.83))} ${pt(Q(0.08, 0.86))}" stroke="#fff" stroke-width=".6" fill="none"/><path d="M${pt(Q(-0.05, 0.81))} L${pt(Q(0.05, 0.81))}" stroke="#7a1a1a" stroke-width=".45"/>`;
    for (const sg of [-1, 1]) k += `<path d="${poly(Q(sg * 0.14, 0.74), Q(sg * 0.2, 0.74), Q(sg * 0.2, 0.42), Q(sg * 0.14, 0.42))}" fill="#a81a24"/><circle cx="${r(Q(sg * 0.17, 0.4)[0])}" cy="${r(Q(0, 0.4)[1])}" r=".45" fill="#f2d2b0"/>`;
    k += `<path d="M${pt(Q(-0.12, 1.02))} L${pt(Q(0.12, 1.02))}" stroke="#f2c83a" stroke-width=".55"/>`;
    void x; void y;
  }
  /* Christbaumkugeln an Fäden, Stern am Faden */
  const KU = [];
  for (const [d, h, f] of [[12.1, 2.15, "#c8202c"], [12.5, 1.9, "#e8b830"], [12.9, 2.2, "#2f6ab0"], [12.3, 1.6, "#e8e8ee"]]) {
    const [x, y] = P(Li, d, h), [, yo] = P(Li, d, h1 - 0.12), rr = 0.11 * F / d;
    k += `<line x1="${r(x)}" y1="${r(yo)}" x2="${r(x)}" y2="${r(y - rr)}" stroke="#d9b86a" stroke-width=".25"/><circle cx="${r(x)}" cy="${r(y)}" r="${r(rr)}" fill="${f}"/><circle cx="${r(x - rr * 0.35)}" cy="${r(y - rr * 0.35)}" r="${r(rr * 0.3)}" fill="#fff" opacity=".7"/>`;
    KU.push([x, y]);
  }
  const STERN = P(Li, 13.55, 2.2);
  { const [x, y] = STERN, rr = 0.2 * F / 13.55, [, yo] = P(Li, 13.55, h1 - 0.12); k += `<line x1="${r(x)}" y1="${r(yo)}" x2="${r(x)}" y2="${r(y - rr)}" stroke="#d9b86a" stroke-width=".25"/>`; let st = ""; for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5 - Math.PI / 2, q = i % 2 ? rr * 0.42 : rr; st += `${i ? "L" : "M"}${r(x + Math.cos(a) * q)} ${r(y + Math.sin(a) * q)} `; } k += `<path d="${st}Z" fill="#f6d65a" stroke="#c99a2a" stroke-width=".2"/><circle cx="${r(x)}" cy="${r(y)}" r="${r(rr * 1.6)}" fill="#ffe7a0" opacity=".35"/>`; }
  k += `</g>`;
  /* Laibung: die Wandstärke verdeckt den Rand der Auslage */
  k += `<path d="${poly(P(L, d1, h1), P(Li, d1, h1), P(Li, d1, h0), P(L, d1, h0))}" fill="#4e1418"/>`;
  /* Schild über dem Fenster, Schrift perspektivisch */
  k += `<path d="${poly(P(L, d0, 3.4), P(L, d1, 3.4), P(L, d1, 3.0), P(L, d0, 3.0))}" fill="#6e1e22"/>`;
  { const txt = "Weihnachten", n = txt.length, lage = zeichenLage(txt); for (let i = 0; i < n; i++) { const d = d1 - 0.2 - (d1 - d0 - 0.4) * lage[i], [x, y] = P(L, d, 3.08), fs = 0.27 * F / d; const nx = P(L, d - 0.1, 3.08), sk = Math.atan2(nx[1] - y, nx[0] - x) * 180 / Math.PI; k += `<text x="${r(x)}" y="${r(y)}" font-size="${r(fs)}" text-anchor="middle" fill="#f2d27a" font-family="Georgia,serif" font-weight="bold" transform="rotate(${r(sk)} ${r(x)} ${r(y)})">${txt[i]}</text>`; } }
  const [ax, ay] = P(L, d0 - 0.2, h1 + 0.5), [bx, by] = P(L, d1 + 0.2, h0 - 0.1);
  void ax; void ay; void bx; void by;
  S.teil({ id: "schaufenster", de: "das Schaufenster", syl: "SCHAU-fens-ter", it: "la vetrina", itSyl: "ve-TRI-na", en: "shop window", x: 0, y: 0, kunst: k,
    tipp: "In Rothenburg kann man das ganze Jahr Weihnachtsschmuck kaufen.",
    zoom: { x: r(KN[0] - 18), y: r(KN[1] - 26), w: 39, h: 26 },
    unter: [
      { id: "nussknacker", de: "der Nussknacker", syl: "NUSS-kna-cker", it: "lo schiaccianoci", itSyl: "schiac-cia-NO-ci", en: "nutcracker", x: KN[0], y: KN[1], kunst: flaeche(-3, -1.3 * F / 11.5, 6, 1.3 * F / 11.5),
        tipp: "Der Nussknacker knackt Nüsse mit seinem großen Mund. Er kommt aus dem Erzgebirge." },
    ] });
  /* Spiegelung auf der Scheibe (fängt keinen Tipp) */
  S.davor(`<path d="${poly(P(L, d0 + 0.3, h1), P(L, d0 + 0.7, h1), P(L, d0 + 1.3, h0), P(L, d0 + 0.9, h0))}" fill="#fff" opacity=".22"/><path d="${poly(P(L, d0 + 2.1, h1), P(L, d0 + 2.3, h1), P(L, d0 + 2.7, h0), P(L, d0 + 2.5, h0))}" fill="#fff" opacity=".14"/>`);
}

/* =====================================================================
   12 — DIE TÜR des Gasthofs, 13 — DAS WIRTSHAUSSCHILD, 14 — DER TISCH
   ===================================================================== */
{
  const L = 4, ta = 6.9, tb = 7.7;
  let k = `<path d="${poly(P(L, ta - 0.2, 2.75), P(L, tb + 0.2, 2.75), P(L, tb + 0.2, 0), P(L, ta - 0.2, 0))}" fill="#cdb48a"/>`;
  k += `<path d="${poly(P(L, ta, 2.5), P(L, tb, 2.5), P(L, tb, 0.18), P(L, ta, 0.18))}" fill="${S.lg("gasttuer", [[0, "#6b3a1e"], [1, "#4a2412"]])}"/>`;
  k += `<path d="${poly(P(L, ta, 2.5), P(L, tb, 2.5), P(L, tb, 2.05), P(L, ta, 2.05))}" fill="${GLAS_LICHT}"/>`;
  for (const [h0, h1] of [[0.4, 1.1], [1.25, 1.9]]) k += `<path d="${poly(P(L, ta + 0.1, h1), P(L, tb - 0.1, h1), P(L, tb - 0.1, h0), P(L, ta + 0.1, h0))}" fill="none" stroke="#2a1408" stroke-width=".5"/>`;
  { const [x, y] = P(L, tb - 0.15, 1.15); k += `<circle cx="${r(x)}" cy="${r(y)}" r=".8" fill="${GOLD}"/>`; }
  k += `<path d="${poly(P(L, ta - 0.3, 0.2), P(L, tb + 0.3, 0.2), P(L - 0.45, tb + 0.3, 0.2), P(L - 0.45, ta - 0.3, 0.2))}" fill="#a8916c"/><path d="M${pt(P(L - 0.45, ta - 0.3, 0.2))} L${pt(P(L - 0.45, tb + 0.3, 0.2))}" stroke="#7a6a50" stroke-width=".6"/>`;
  /* Schriftzug über der Tür, Buchstabe für Buchstabe auf der Wand (Leserichtung von hinten nach vorn) */
  { const txt = "Zum Hirschen", n = txt.length, lage = zeichenLage(txt), da = 9.35, db = 7.0;
    for (let i = 0; i < n; i++) { if (txt[i] === " ") continue; const d = da + (db - da) * lage[i], [x, y] = P(L, d, 2.95), fs = 0.24 * F / d, nx = P(L, d - 0.1, 2.95), sk = Math.atan2(nx[1] - y, nx[0] - x) * 180 / Math.PI; k += `<text x="${r(x)}" y="${r(y)}" font-size="${r(fs)}" text-anchor="middle" fill="#3a2a14" font-family="Georgia,serif" font-weight="bold" transform="rotate(${r(sk)} ${r(x)} ${r(y)})">${txt[i]}</text>`; } }
  /* Speisekarte an der Wand */
  k += `<path d="${poly(P(L, 8.3, 2.1), P(L, 8.9, 2.1), P(L, 8.9, 1.2), P(L, 8.3, 1.2))}" fill="#2e3a2a" stroke="#7a5a38" stroke-width=".5"/>`;
  for (let i = 0; i < 4; i++) k += `<path d="M${pt(P(L, 8.36, 1.95 - i * 0.18))} L${pt(P(L, 8.84, 1.95 - i * 0.18))}" stroke="#f4efe4" stroke-width=".35"/>`;
  k += `<path d="${poly(P(L, ta - 0.2, 2.75), P(L, tb + 0.2, 2.75), P(L, tb + 0.2, 0), P(L, ta - 0.2, 0))}" fill="${SCHATTEN}" opacity=".2"/>`;
  S.teil({ id: "tuer", de: "die Tür", syl: "TÜR", it: "la porta", itSyl: "POR-ta", en: "door", x: 0, y: 0, kunst: k,
    tipp: "Durch diese Tür geht es in den Gasthof. Daneben hängt die Speisekarte." });
}
{
  const [x0, y0] = P(4, 6.9, 4.1), [x1] = P(2.9, 6.9, 4.1);
  let k = `<rect x="${r(x0 - 1.2)}" y="${r(y0 - 5)}" width="2.4" height="10" fill="${EISEN}"/><path d="M${r(x0)} ${r(y0)} L${r(x1)} ${r(y0)}" stroke="${EISEN}" stroke-width="1.2"/>`;
  k += `<path d="M${r(x0)} ${r(y0 + 5)} Q${r((x0 + x1) / 2)} ${r(y0 + 4)} ${r(x1 + 3)} ${r(y0 + 0.5)}" stroke="${EISEN}" stroke-width=".7" fill="none"/>`;
  for (const t of [0.3, 0.6]) { const x = x0 + (x1 - x0) * t; k += `<path d="M${r(x)} ${r(y0)} q2.4 -3.6 0 -5.2 q-2.4 1.2 -.5 3" stroke="${EISEN}" stroke-width=".55" fill="none"/>`; }
  const cx = x1 + 6, cy = y0 + 12;
  k += `<line x1="${r(cx - 4)}" y1="${r(y0)}" x2="${r(cx - 4)}" y2="${r(cy - 7)}" stroke="${EISEN}" stroke-width=".4"/><line x1="${r(cx + 4)}" y1="${r(y0)}" x2="${r(cx + 4)}" y2="${r(cy - 7)}" stroke="${EISEN}" stroke-width=".4"/>`;
  k += `<circle cx="${r(cx)}" cy="${r(cy)}" r="7.6" fill="none" stroke="${EISEN}" stroke-width="1"/><circle cx="${r(cx)}" cy="${r(cy)}" r="6.4" fill="none" stroke="${GOLD}" stroke-width=".4"/>`;
  k += `<g transform="translate(${r(cx)} ${r(cy + 1)}) scale(-1 1)"><path d="M-3.6 2.4 L-3.2 -.4 Q-2 -1.6 1.6 -1.2 L2.6 -2.8 L3.4 -2.6 L3 -1 Q3.4 .2 2.6 .6 L2.4 2.4 L1.8 2.4 L1.8 .8 L-2.2 .8 L-2.6 2.4 Z" fill="${GOLD}"/><path d="M2.6 -2.8 l-.6 -2 l.9 .8 l.2 -1.4 l.6 1.6 M3.4 -2.6 l.9 -1.8 l.1 1.2 l1 -1" stroke="#c9a640" stroke-width=".35" fill="none"/></g>`;
  k += `<rect x="${r(cx - 6)}" y="${r(cy + 8.4)}" width="12" height="3.4" rx=".6" fill="#2e4a2a" stroke="${GOLD}" stroke-width=".3"/><text x="${r(cx)}" y="${r(cy + 10.9)}" font-size="2.3" text-anchor="middle" fill="#f0d27a" font-family="Georgia,serif" font-weight="bold">Gasthof</text>`;
  S.teil({ oben: true, id: "wirtshausschild", de: "das Wirtshausschild", syl: "WIRTS-haus-schild", it: "l'insegna della locanda", itSyl: "in-SE-gna DEL-la lo-CAN-da", en: "inn sign", x: 0, y: 0, kunst: k,
    tipp: "Das schmiedeeiserne Schild mit dem goldenen Hirsch zeigt: Hier ist ein Gasthof." });
}
{
  /* Tisch mit zwei Stühlen vor dem Gasthof */
  const d = 6.5, [x, y] = P(2.7, d, 0), s = F / d;
  let k = schatten(0, 0.5, 0.6 * s, 0.1 * s, 0.3);
  const st = (dx, dd) => { let [sx, sy] = P(2.7 + dx, d + dd, 0); const ss = F / (d + dd); sx -= x; sy -= y; let g = ""; g += `<path d="M${r(sx - 0.2 * ss)} ${r(sy)} L${r(sx - 0.2 * ss)} ${r(sy - 0.45 * ss)} M${r(sx + 0.2 * ss)} ${r(sy)} L${r(sx + 0.2 * ss)} ${r(sy - 0.45 * ss)}" stroke="#2c2a26" stroke-width=".7"/><rect x="${r(sx - 0.24 * ss)}" y="${r(sy - 0.48 * ss)}" width="${r(0.48 * ss)}" height="${r(0.06 * ss)}" fill="#6b4a2e"/><path d="M${r(sx + (dx > 0 ? 0.2 : -0.2) * ss)} ${r(sy - 0.48 * ss)} L${r(sx + (dx > 0 ? 0.22 : -0.22) * ss)} ${r(sy - 0.95 * ss)}" stroke="#2c2a26" stroke-width=".7"/><rect x="${r(sx + (dx > 0 ? 0.12 : -0.3) * ss)}" y="${r(sy - 0.95 * ss)}" width="${r(0.18 * ss)}" height="${r(0.3 * ss)}" fill="#6b4a2e"/>`; return [g, sx - x, sy - y]; };
  const [s1] = st(-0.7, 0.4), [s2] = st(0.75, -0.2);
  k += s1;
  k += `<path d="M${r(-0.04 * s)} 0 L${r(-0.04 * s)} ${r(-0.72 * s)} M${r(0.04 * s)} 0 L${r(0.04 * s)} ${r(-0.72 * s)}" stroke="#2c2a26" stroke-width="1" transform="translate(0 0)"/><path d="M${r(-0.2 * s)} 0 L${r(0.2 * s)} 0" stroke="#2c2a26" stroke-width="1"/>`;
  k += `<ellipse cx="0" cy="${r(-0.74 * s)}" rx="${r(0.4 * s)}" ry="${r(0.08 * s)}" fill="#7a5636"/><ellipse cx="0" cy="${r(-0.76 * s)}" rx="${r(0.38 * s)}" ry="${r(0.07 * s)}" fill="#f2ede0"/>`;
  /* Bierglas und Windlicht auf dem Tisch */
  k += `<rect x="${r(-0.15 * s)}" y="${r(-0.92 * s)}" width="${r(0.07 * s)}" height="${r(0.16 * s)}" fill="#f2b73a" opacity=".9"/><rect x="${r(-0.15 * s)}" y="${r(-0.94 * s)}" width="${r(0.07 * s)}" height="${r(0.03 * s)}" fill="#fff"/><circle cx="${r(0.1 * s)}" cy="${r(-0.82 * s)}" r="${r(0.05 * s)}" fill="#ffd27a"/><circle cx="${r(0.1 * s)}" cy="${r(-0.82 * s)}" r="${r(0.14 * s)}" fill="#ffd27a" opacity=".35" filter="url(#${S.id("glimm")})"/>`;
  k += s2;
  S.teil({ id: "tisch", de: "der Tisch", syl: "TISCH", it: "il tavolo", itSyl: "TA-vo-lo", en: "table", x, y, steht: true, kunst: k,
    tipp: "Vor dem Gasthof stehen ein Tisch und Stühle. Am Sommerabend sitzt man draußen." });
}
{
  /* 15 — DIE STRASSENLATERNE: Wandlaterne aus Schmiedeeisen (brennt schon) */
  const [x0, y0] = P(4, 16.9, 4.2), s = F / 16.9;
  let k = `<path d="M${r(x0)} ${r(y0)} L${r(x0 - 0.9 * s)} ${r(y0 - 0.3 * s)}" stroke="${EISEN}" stroke-width=".8"/><path d="M${r(x0)} ${r(y0 + 0.5 * s)} Q${r(x0 - 0.4 * s)} ${r(y0 + 0.1 * s)} ${r(x0 - 0.7 * s)} ${r(y0 - 0.25 * s)}" stroke="${EISEN}" stroke-width=".5" fill="none"/>`;
  const lx = x0 - 0.9 * s, ly = y0 - 0.2 * s;
  k += `<circle cx="${r(lx)}" cy="${r(ly + 0.4 * s)}" r="${r(0.9 * s)}" fill="#ffcc66" opacity=".45" filter="url(#${S.id("glimm")})"/>`;
  k += `<path d="M${r(lx - 0.22 * s)} ${r(ly + 0.05 * s)} L${r(lx + 0.22 * s)} ${r(ly + 0.05 * s)} L${r(lx + 0.16 * s)} ${r(ly + 0.6 * s)} L${r(lx - 0.16 * s)} ${r(ly + 0.6 * s)} Z" fill="#ffe7a2" stroke="${EISEN}" stroke-width=".5"/><path d="M${r(lx - 0.3 * s)} ${r(ly + 0.05 * s)} L${r(lx)} ${r(ly - 0.18 * s)} L${r(lx + 0.3 * s)} ${r(ly + 0.05 * s)} Z" fill="${EISEN}"/>`;
  S.teil({ oben: true, id: "strassenlaterne", de: "die Straßenlaterne", syl: "STRAS-sen-la-ter-ne", it: "il lampione", itSyl: "lam-PIO-ne", en: "street lamp", x: 0, y: 0, kunst: k + flaeche(lx - 6, ly - 4, 12, 9),
    tipp: "Am Abend gehen die alten Straßenlaternen an." });
}

/* =====================================================================
   16 — DIE TOURISTIN (fotografiert das Plönlein mit dem Handy)
   ===================================================================== */
{
  /* eigene Haltung „fotografieren“: beide Hände heben das Handy vor das Gesicht (nur in dieser Bau-Datei) */
  const MZ = (() => { B.mensch({ id: "x", geschlecht: "w", pose: "stehen", blick: 0, kleidung: {} }, 10); return globalThis.DMA_MENSCH; })();
  MZ.POSEN.rtb_foto = { lende: 1, brust: -1, nacken: 4, kopf: 2, schulterL: { vor: 62, seit: 14 }, ellbogenL: 118, unterarmL: 40, handL: 4, fingerL: 0.55, schulterR: { vor: 60, seit: 16 }, ellbogenR: 120, unterarmR: 40, handR: 4, fingerR: 0.55, huefteL: { vor: 3, seit: 3, dreh: -6 }, knieL: 3, fussL: 0, huefteR: { vor: -3, seit: 2.5, dreh: -6 }, knieR: 2, fussR: 0 };
  const d = 10.4, [x, y] = P(-1.4, d, 0), s = F / d;
  const m = B.mensch({ id: "rtb_touristin", geschlecht: "w", pose: "rtb_foto", blick: 186, frisur: "zopf", haarfarbe: "hellbraun", haut: "hell",
    kleidung: { oberteil: { stueck: "pullover", farbe: "#3d6a8a" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" } } }, 1.68 * s);
  const H = (n) => { const q = m.z.punkte[n]; return [q[0] * m.k, q[1] * m.k]; };
  const [, sy] = H("scheitel"), hl = H("handL"), hr = H("handR"), hx = (hl[0] + hr[0]) / 2 + 0.8;
  let k = schatten(3, 0.4, 0.3 * s, 0.07 * s, 0.25) + m.svg;
  /* Handy hoch vor dem Gesicht: von hinten sieht man über dem Kopf den Bildschirm mit dem gelben Haus */
  const pw = 0.075 * s, ph = 0.15 * s, px = hx - pw / 2, py = sy - ph * 0.55;
  k += `<rect x="${r(px - 0.25)}" y="${r(py - 0.25)}" width="${r(pw + 0.5)}" height="${r(ph + 0.5)}" rx=".5" fill="#1c1d20"/><rect x="${r(px)}" y="${r(py)}" width="${r(pw)}" height="${r(ph)}" fill="#5f7fb0"/>`;
  k += `<path d="M${r(px + pw * 0.15)} ${r(py + ph)} L${r(px + pw * 0.15)} ${r(py + ph * 0.45)} L${r(px + pw * 0.5)} ${r(py + ph * 0.18)} L${r(px + pw * 0.85)} ${r(py + ph * 0.45)} L${r(px + pw * 0.85)} ${r(py + ph)} Z" fill="#f2c45c"/><path d="M${r(px + pw * 0.15)} ${r(py + ph * 0.45)} L${r(px + pw * 0.5)} ${r(py + ph * 0.18)} L${r(px + pw * 0.85)} ${r(py + ph * 0.45)}" stroke="#a24a2a" stroke-width=".3" fill="none"/>`;
  S.teil({ id: "touristin", de: "die Touristin", syl: "tou-RIS-tin", it: "la turista", itSyl: "tu-RI-sta", en: "tourist", x, y, kunst: k,
    tipp: "Die Touristin fotografiert das Plönlein mit dem Handy.",
    zoom: { x: r(x - 26), y: r(y + sy - 6), w: 52, h: 34 },
    unter: [
      { id: "handy", de: "das Handy", syl: "HAN-dy", it: "il cellulare", itSyl: "cel-lu-LA-re", en: "mobile phone", x: x + px + pw / 2, y: y + py + ph + 0.4, kunst: flaeche(-pw / 2 - 1.2, -ph - 1.4, pw + 2.4, ph + 2.2),
        tipp: "Mit dem Handy macht sie ein Foto. Auf dem Bildschirm sieht man schon das gelbe Haus." },
    ] });
}

/* =====================================================================
   17 — DER NACHTWÄCHTER mit 18 — DER HELLEBARDE (in der Hand) und
   19 — DER LATERNE
   ===================================================================== */
const NW = (() => { const d = 7.4, [x, y] = P(1.0, d, 0); return { x, y, s: F / d }; })();
/* gebaut wird in 7,4 m Abstand, gestellt wird er näher (5,9 m): alles um NF vergrößert, Fußpunkt neu */
const NF = 7.4 / 5.9, NWp = (() => { const [x, y] = P(1.0, 5.9, 0); return { x, y }; })(), NS = (g) => `<g transform="scale(${r(NF * 1000) / 1000})">${g}</g>`;
const nw = B.mensch({ id: "rtb_nachtwaechter", geschlecht: "m", pose: "stehen", blick: 330, frisur: "kurz", haarfarbe: "grau", haut: "hell",
  kleidung: { oberteil: { stueck: "hemd", farbe: "#2a2830" }, unterteil: { stueck: "hose", farbe: "schwarz" }, schuhe: { stueck: "stiefel", farbe: "#1a1a1a" }, kopf: { stueck: "hut", farbe: "#17161a" } } }, 1.78 * NW.s);
const NP = (n) => { const q = nw.z.punkte[n]; return [q[0] * nw.k, q[1] * nw.k]; };
const HAENDE = [NP("handL"), NP("handR")].sort((a, b) => a[0] - b[0]);
/* Hellebarde: in der Hand, oben leicht nach außen geneigt; hinter dem Umhang verdeckt */
const STANGE = (() => {
  const [hx, hy] = HAENDE[0], sch = [NP("schulterL"), NP("schulterR")].sort((a, b) => a[0] - b[0])[0];
  const kx = 0.085;   /* dx je dy: oben leicht nach außen geneigt, frei vom Gesicht */
  void sch;
  const X = (y) => hx + (y - hy) * kx;
  const sy = Math.min(NP("schulterL")[1], NP("schulterR")[1]);
  return { hx, hy, X, kx, fuss: [X(0), 0], top: [X(-2.5 * NW.s), -2.5 * NW.s], umhangU: sy + 13.5, schulter: sy - 0.5 };
})();
{
  let k = schatten(10, 0.5, 14, 2.4, 0.35) + nw.svg;
  /* Pelerine (weiter Umhang) über den Schultern */
  const [sl, slY] = NP("schulterL"), [sr, srY] = NP("schulterR"), [hx, hy] = NP("hals");
  const lo = Math.min(sl, sr), hi = Math.max(sl, sr), oy = Math.min(slY, srY);
  k += `<path d="M${r(hx - 3)} ${r(hy + 1)} Q${r(lo - 2)} ${r(oy + 1)} ${r(lo - 3.4)} ${r(oy + 13)} Q${r((lo + hi) / 2)} ${r(oy + 15)} ${r(hi + 3.4)} ${r(oy + 13)} Q${r(hi + 2)} ${r(oy + 1)} ${r(hx + 3)} ${r(hy + 1)} Z" fill="${S.lg("umhang", [[0, "#2a2830"], [0.5, "#16151a"], [1, "#0e0d10"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${r(hx - 2.6)} ${r(hy + 1.4)} Q${r(hx)} ${r(hy + 3)} ${r(hx + 2.6)} ${r(hy + 1.4)}" stroke="#d8d4cc" stroke-width=".7" fill="none"/>`;
  k += `<path d="M${r(hi + 2.6)} ${r(oy + 6)} Q${r(hi + 2)} ${r(oy + 3)} ${r(hi)} ${r(oy + 1.4)}" stroke="#ffcf8a" stroke-width=".5" fill="none" opacity=".35"/>`;
  /* breite Krempe des Schlapphuts — hoch genug, dass die Augen darunter sichtbar bleiben */
  const [kx, ky2] = NP("scheitel");
  k += `<ellipse cx="${r(kx)}" cy="${r(ky2 + 1.5)}" rx="6.8" ry="1.05" fill="#141317"/><path d="M${r(kx - 6.4)} ${r(ky2 + 1.4)} Q${r(kx)} ${r(ky2 + 0.6)} ${r(kx + 6.4)} ${r(ky2 + 1.4)}" stroke="#3a3840" stroke-width=".3" fill="none"/>`;
  /* Horn am Gürtel: Kuhhorn mit Messingbeschlag und Mundstück, am Lederriemen */
  const [bx, by] = NP("huefteL"), [qx, qy] = NP("schulterR");
  k += `<path d="M${r(qx)} ${r(qy + 1)} L${r(bx + 0.4)} ${r(by - 1.2)}" stroke="#5a3a1e" stroke-width=".7"/>`;
  const HORN = `M${r(bx - 1)} ${r(by - 1.6)} Q${r(bx + 2.6)} ${r(by - 1.2)} ${r(bx + 3.6)} ${r(by + 2.4)} L${r(bx + 5.2)} ${r(by + 1.6)} L${r(bx + 5)} ${r(by + 4.6)} L${r(bx + 2.4)} ${r(by + 3.4)} Q${r(bx + 1.6)} ${r(by + 0.4)} ${r(bx - 1)} ${r(by - 0.6)} Z`;
  k += `<path d="${HORN}" fill="${S.lg("horn", [[0, "#efe0bc"], [0.6, "#c9a46a"], [1, "#7a5a2a"]], 0, 0, 1, 1)}" stroke="#5a4020" stroke-width=".25"/>`;
  k += `<path d="M${r(bx + 3.4)} ${r(by + 2.2)} L${r(bx + 2.6)} ${r(by + 3.3)}" stroke="#c9a640" stroke-width=".8"/><circle cx="${r(bx - 1)}" cy="${r(by - 1.1)}" r=".55" fill="#c9a640"/>`;
  k += `<ellipse cx="${r(bx + 5.1)}" cy="${r(by + 3.1)}" rx=".55" ry="1.5" fill="#3a2a14"/>`;
  S.teil({ id: "nachtwaechter", de: "der Nachtwächter", syl: "NACHT-wäch-ter", it: "la guardia notturna", itSyl: "GUAR-dia not-TUR-na", en: "night watchman", x: NWp.x, y: NWp.y, kunst: NS(k),
    tipp: "Am Abend führt der Nachtwächter mit Schlapphut und Horn die Gäste durch die Altstadt.",
    zoom: { x: r(NWp.x + (kx - 30) * NF), y: r(NWp.y + (ky2 - 6) * NF), w: r(60 * NF), h: r(40 * NF) },
    unter: [
      { id: "hut", de: "der Hut", syl: "HUT", it: "il cappello", itSyl: "cap-PEL-lo", en: "hat", x: NWp.x + kx * NF, y: NWp.y + (ky2 + 3) * NF, kunst: NS(flaeche(-7.2, -8, 14.4, 7.6)),
        tipp: "Der Nachtwächter trägt einen breiten schwarzen Schlapphut." },
      { id: "horn", de: "das Horn", syl: "HORN", it: "il corno", itSyl: "COR-no", en: "horn", x: NWp.x + (bx + 2) * NF, y: NWp.y + (by + 4.8) * NF, kunst: NS(flaeche(-3.6, -7, 8, 7.6)),
        tipp: "Mit dem Horn bläst der Nachtwächter zur vollen Stunde." },
    ] });
}
{
  /* Hellebarde: schräg an die Schulter gelehnt; zwischen Hand und Schulter verdeckt der Umhang die Stange */
  const { hx, hy, X, kx, fuss, top, umhangU, schulter } = STANGE;
  const ox = r(hx), oy = r(hy - 6);   /* Ankerpunkt des Teils: an der Hand */
  const STAHL = S.lg("stahl", [[0, "#e8ecef"], [0.5, "#aab3ba"], [1, "#7a838a"]], 0, 0, 1, 0);
  const winkel = Math.atan(kx) * 180 / Math.PI;
  const holz = S.lg("stange", [[0, "#5a3a22"], [0.5, "#9a7048"], [1, "#4a2e18"]], 0, 0, 1, 0);
  let k = `<path d="M${r(fuss[0])} 0 L${r(X(umhangU))} ${r(umhangU)} M${r(X(schulter))} ${r(schulter)} L${r(top[0])} ${r(top[1])}" stroke="#4a2e18" stroke-width="1.5" stroke-linecap="round"/><path d="M${r(fuss[0] - 0.3)} 0 L${r(X(umhangU) - 0.3)} ${r(umhangU)} M${r(X(schulter) - 0.3)} ${r(schulter)} L${r(top[0] - 0.3)} ${r(top[1])}" stroke="#a87c50" stroke-width=".45"/>`;
  void holz;
  /* Klinge als Gruppe, entlang der Stange gedreht */
  k += `<g transform="translate(${r(top[0])} ${r(top[1])}) rotate(${r(-winkel)})"><path d="M-.7 0 L0 -10 L.7 0 Z" fill="${STAHL}"/><path d="M.6 1 L6.4 -1.6 Q7.4 3 6.2 7.4 L.6 5 Z" fill="${STAHL}" stroke="#5a6268" stroke-width=".25"/><path d="M-.6 2 L-3.6 .4 L-3 2.2 L-.6 3.6 Z" fill="${STAHL}"/><rect x="-.9" y="5" width="1.8" height="1.2" fill="#c9a640"/><path d="M6.2 -1 L6.8 5" stroke="#fff" stroke-width=".4" opacity=".6"/></g>`;
  /* Faust um die Stange */
  k += `<ellipse cx="${r(hx)}" cy="${r(hy - 0.6)}" rx="1.3" ry="1.15" fill="#e8c4a2"/><path d="M${r(hx - 1.1)} ${r(hy - 1)} h2.2 M${r(hx - 1.1)} ${r(hy - 0.3)} h2.2" stroke="#c49a7a" stroke-width=".25"/>`;
  /* Trefferfläche: schmale Polster um die sichtbaren Stücke und um die Klinge */
  k += `<path class="bw-flaeche" d="M${r(fuss[0] - 1.6)} 0 L${r(fuss[0] + 1.6)} 0 L${r(X(umhangU) + 1.6)} ${r(umhangU)} L${r(X(umhangU) - 1.6)} ${r(umhangU)} Z M${r(top[0] - 4.5)} ${r(top[1] - 10)} L${r(top[0] + 7.6)} ${r(top[1] - 10)} L${r(X(schulter) + 1.8)} ${r(schulter)} L${r(X(schulter) - 1.8)} ${r(schulter)} Z" fill="rgba(255,255,255,0.001)"/>`;
  S.teil({ oben: true, id: "hellebarde", de: "die Hellebarde", syl: "hel-le-BAR-de", it: "l'alabarda", itSyl: "a-la-BAR-da", en: "halberd", x: NWp.x + ox * NF, y: NWp.y + oy * NF, kunst: NS(`<g transform="translate(${-ox} ${-oy})">${k}</g>`),
    tipp: "Die Hellebarde ist halb Axt, halb Spieß. Damit schützte der Nachtwächter früher die Stadt." });
}
{
  const [hx, hy] = HAENDE[1];
  const lx = hx + 0.6, ly = hy + 7;
  let k = `<circle cx="${r(lx)}" cy="${r(ly)}" r="12" fill="#ffcc66" opacity=".45" filter="url(#${S.id("glimm")})"/>`;
  k += `<path d="M${r(hx)} ${r(hy - 0.4)} Q${r(lx + 1.6)} ${r(hy + 1.2)} ${r(lx)} ${r(ly - 5.2)}" stroke="#7a5a2a" stroke-width=".4" fill="none"/>`;
  k += `<path d="M${r(lx - 2.4)} ${r(ly - 3.6)} L${r(lx)} ${r(ly - 5.6)} L${r(lx + 2.4)} ${r(ly - 3.6)} Z" fill="${GOLD}"/>`;
  k += `<rect x="${r(lx - 2.2)}" y="${r(ly - 3.6)}" width="4.4" height="6.8" fill="#fff3c4"/><rect x="${r(lx - 0.5)}" y="${r(ly - 1)}" width="1" height="3" fill="#f6f1e4"/><path d="M${r(lx)} ${r(ly - 2.6)} q.6 .8 0 1.6 q-.6 -.8 0 -1.6 Z" fill="#ff9a2a"/>`;
  k += `<path d="M${r(lx - 2.2)} ${r(ly - 3.6)} v6.8 M${r(lx + 2.2)} ${r(ly - 3.6)} v6.8 M${r(lx)} ${r(ly - 3.6)} v6.8" stroke="#8a6a2a" stroke-width=".35"/>`;
  k += `<rect x="${r(lx - 2.6)}" y="${r(ly + 3.2)}" width="5.2" height="1" fill="${GOLD}"/>`;
  const ox = r(lx), oy = r(ly + 4.4);
  S.teil({ oben: true, id: "laterne", de: "die Laterne", syl: "la-TER-ne", it: "la lanterna", itSyl: "lan-TER-na", en: "lantern", x: NWp.x + ox * NF, y: NWp.y + oy * NF, kunst: NS(`<g transform="translate(${-ox} ${-oy})">${k + flaeche(lx - 3, ly - 6, 6, 11)}</g>`),
    tipp: "Früher gab es keine Straßenlampen. Der Nachtwächter trug eine Laterne." });
}
/* Vordergrund links: Holzkübel mit Geranien vor der Bäckerei (Dekor, fängt keinen Tipp) */
{
  const d = 4.6, [x, y] = P(-4.9, d, 0, 0), s = F / d;
  let c = schatten(0, 0.6, 0.42 * s, 0.07 * s, 0.4);
  c += `<path d="M${r(-0.32 * s)} ${r(-0.5 * s)} L${r(0.32 * s)} ${r(-0.5 * s)} L${r(0.27 * s)} 0 L${r(-0.27 * s)} 0 Z" fill="${S.lg("kuebel", [[0, "#5e3c22"], [0.5, "#80542e"], [1, "#462a14"]], 0, 0, 1, 0)}"/>`;
  for (const h of [-0.12, -0.38]) c += `<path d="M${r(-0.3 * s)} ${r(h * s)} L${r(0.3 * s)} ${r(h * s)}" stroke="#3a3a3a" stroke-width="${r(0.025 * s)}"/>`;
  for (let i = 0; i < 26; i++) { const a2 = rnd() * Math.PI, rr = 0.1 + rnd() * 0.24; c += `<circle cx="${r(Math.cos(a2) * rr * s * 1.3)}" cy="${r((-0.55 - Math.sin(a2) * rr * 0.8) * s)}" r="${r((0.045 + rnd() * 0.03) * s)}" fill="${i % 3 ? "#3f6e2e" : "#5a8a3a"}"/>`; }
  for (let i = 0; i < 16; i++) { const a2 = rnd() * Math.PI, rr = 0.08 + rnd() * 0.22; c += `<circle cx="${r(Math.cos(a2) * rr * s * 1.3)}" cy="${r((-0.62 - Math.sin(a2) * rr * 0.8) * s)}" r="${r(0.04 * s)}" fill="${rnd() < 0.7 ? "#d6283a" : "#f2557a"}"/>`; }
  S.davor(`<g transform="translate(${r(x)} ${r(y)})">${c}</g>`);
}
/* Abendstimmung über allem: oben warmer Schein, unten kühler */
S.davor(`<rect width="400" height="260" fill="${S.lg("abendschein", [[0, "#ffb070", 0.08], [0.5, "#ffb070", 0], [1, "#203050", 0.08]])}"/>`);

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/rothenburg.js"));
console.log(aus);
