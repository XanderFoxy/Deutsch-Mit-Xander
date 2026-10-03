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
   Gabelung. Sommerabend gegen acht: die Sonne steht tief im Nordwesten
   (≈ 300°, 7° hoch, hinter uns rechts). Die Gasse liegt im Schatten der
   westlichen Häuserzeile; nur Giebel, Dächer und der obere Siebersturm
   leuchten golden. Durch eine Lücke rechts fällt ein Lichtstreifen schräg
   über das Pflaster bis an das gelbe Haus. Die Laternen brennen schon,
   gleich beginnt die Nachtwächterführung.

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
   rechte Gasse steigt ab 21 m um 10 % (bis 2,4 m), die Steige fällt um
   14 % (Kobolzeller Tor ≈ 10 m tiefer, 80 m entfernt). Plönleinhaus in
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
const gG = (X, D) => (D > 21 && X > -3.8 && X < 4.6) ? Math.min(2.4, (D - 21) * 0.1) : 0;
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
const steigeG = (t) => -0.143 * Math.max(0, t - 2);
const SX = (t, w) => [S0[0] + SD[0] * t - SN[0] * w, S0[1] + SD[1] * t - SN[1] * w];   /* w: 0 Südseite … 5 Nordseite */
const PS = (t, w, H) => { const [X, D] = SX(t, w); return P(X, D, H, steigeG(t)); };

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
const ZB = (c) => "il.·,'| ".includes(c) ? 0.32 : "fjrt".includes(c) ? 0.42 : "mwMW".includes(c) ? 0.9 : c === c.toUpperCase() && /[A-ZÄÖÜ]/.test(c) ? 0.72 : 0.56;
const zeichenLage = (txt) => { const w = [...txt].map(ZB), sum = w.reduce((a, b) => a + b, 0); let acc = 0; return w.map((b) => { const m = (acc + b / 2) / sum; acc += b; return m; }); };
const wandFenster = (X, d0, d1, h0, h1, opt) => fensterQ(P(X, d0, h1), P(X, d1, h1), P(X, d1, h0), P(X, d0, h0), opt);

/* =====================================================================
   KULISSE — Abendhimmel mit Wolkenbändern, Taubertal im Dunst
   ===================================================================== */
S.hinten(`<rect y="-2" width="400" height="200" fill="${S.lg("himmel", [[0, "#34548e"], [0.4, "#7690bd"], [0.72, "#dcb6a6"], [0.9, "#f4cfa2"], [1, "#f6dcb0"]])}"/>`);
{
  /* geschichtete Abendwolken: oben grau-violett, Unterseite rosa von der tiefen Sonne */
  let c = "";
  for (const [x, y, w, s] of [[150, 18, 70, 1], [214, 8, 50, 0.8], [110, 40, 54, 0.7], [236, 34, 40, 0.6], [178, 56, 36, 0.5], [60, 28, 40, 0.6]]) {
    c += `<ellipse cx="${x}" cy="${y}" rx="${w / 2}" ry="${r(3.2 * s)}" fill="#8f8fb2" opacity=".75"/>`;
    c += `<ellipse cx="${x + 3}" cy="${r(y + 1.6 * s)}" rx="${r(w / 2 - 4)}" ry="${r(1.7 * s)}" fill="#f5a98e" opacity=".9"/>`;
    c += `<ellipse cx="${x + 6}" cy="${r(y + 2.4 * s)}" rx="${r(w / 3)}" ry="${r(0.9 * s)}" fill="#ffd2a8"/>`;
  }
  S.hinten(`<g filter="url(#${S.id("wolke")})">${c}</g>`);
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
  const [, y9] = Q(0, 8);
  for (let h = 0.2, z = 0; h < 8; h += 0.62, z++) for (let L = ST.L0 + (z % 2 ? 0.45 : 0); L < ST.L1 - 0.2; L += 0.9) {
    const [x0, y0] = Q(L, h + 0.58), [x1, y1] = Q(Math.min(ST.L1, L + 0.86), h + 0.04);
    k += `<rect x="${r(x0)}" y="${r(y0)}" width="${r(x1 - x0)}" height="${r(y1 - y0)}" rx=".5" fill="#dcc6a0" stroke="#9c8462" stroke-width=".22"/><path d="M${r(x0 + 0.4)} ${r(y1 - 0.4)} L${r(x0 + 0.4)} ${r(y0 + 0.4)} L${r(x1 - 0.4)} ${r(y0 + 0.4)}" stroke="#f4e6c8" stroke-width=".3" fill="none"/>`;
  }
  for (let h = 8.4; h < ST.traufe - 0.6; h += 1.3) { const w2 = (Math.round(h / 1.3) % 2 ? 0.8 : 1.4) * s; for (const [L, sg] of [[ST.L0, 1], [ST.L1, -1]]) { const [x0, y0] = Q(L, h + 1.1), [, y1] = Q(L, h); k += `<rect x="${r(sg > 0 ? x0 : x0 - w2)}" y="${r(y0)}" width="${r(w2)}" height="${r(y1 - y0 - 0.3)}" fill="#efe0c0" stroke="#b39a74" stroke-width=".15"/>`; } }
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
  const [, y11] = Q(0, 11);
  k += `<rect x="${r(xl)}" y="${r(y11)}" width="${r(xr - xl)}" height="${r(yb - y11)}" fill="${SCHATTEN}" opacity=".3"/>`;
  k += `<rect x="${r(xl)}" y="${r(yt)}" width="${r(xr - xl)}" height="${r(y11 - yt)}" fill="${S.lg("turmgold", [[0, "#ffb85a", 0.22], [1, "#ffb85a", 0.08]])}"/>`;
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
  const [ax, ay] = Q(-1.8, 0), [bx] = Q(1.8, 0), [, ty] = Q(0, 3.6), [, sy] = Q(0, 5.6), [, iy] = Q(0, 4.6);
  let t = `<path d="M${r(ax - 1.4)} ${r(ay)} L${r(ax - 1.4)} ${r(ty)} Q${r(ax - 1.4)} ${r(sy - 1.6)} ${r((ax + bx) / 2)} ${r(sy - 1.8)} Q${r(bx + 1.4)} ${r(sy - 1.6)} ${r(bx + 1.4)} ${r(ty)} L${r(bx + 1.4)} ${r(ay)} Z" fill="#cdb48a"/>`;
  t += `<path d="M${r(ax)} ${r(ay)} L${r(ax)} ${r(ty)} Q${r(ax)} ${r(sy)} ${r((ax + bx) / 2)} ${r(sy)} Q${r(bx)} ${r(sy)} ${r(bx)} ${r(ty)} L${r(bx)} ${r(ay)} Z" fill="#2a2220"/>`;
  /* Laibung: links Schatten, rechts schwaches Licht; hinten die helle Öffnung */
  const ix0 = ax + (bx - ax) * 0.22, ix1 = bx - (bx - ax) * 0.18;
  t += `<path d="M${r(ix0)} ${r(ay - 0.6)} L${r(ix0)} ${r(iy + 1.6)} Q${r((ix0 + ix1) / 2)} ${r(iy - 0.4)} ${r(ix1)} ${r(iy + 1.6)} L${r(ix1)} ${r(ay - 0.6)} Z" fill="${S.lg("spital", [[0, "#ffd9a0"], [1, "#e9b878"]])}"/>`;
  t += `<path d="M${r(ix0 + 1)} ${r(ay - 0.6)} L${r(ix0 + 1)} ${r(ay - 6)} L${r(ix0 + 3.4)} ${r(ay - 8)} L${r(ix1 - 0.6)} ${r(ay - 6.6)} L${r(ix1 - 0.6)} ${r(ay - 0.6)} Z" fill="#d9a06a" opacity=".85"/>`;
  t += `<path d="M${r(ax)} ${r(ay)} L${r(ix0)} ${r(ay - 0.6)} L${r(ix0)} ${r(iy + 1.6)} Q${r(ax + 0.4)} ${r(iy)} ${r(ax)} ${r(ty)} Z" fill="#14100e" opacity=".7"/>`;
  t += `<path d="M${r(ax - 1.4)} ${r(ay)} L${r(bx + 1.4)} ${r(ay)}" stroke="#8a7d6c" stroke-width=".6"/>`;
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
  /* Vortor (Zwinger) dahinter links (liegt tiefer und weiter weg), niedriger mit eigenem Dach */
  const [v0] = Q(-8, 0, 6), [v1] = Q(-3.6, 0, 6), [, vb] = Q(-6, 0, 6), [, vt] = Q(-6, 9, 6), [vm, vs] = Q(-5.8, 13, 6);
  k += `<rect x="${r(v0)}" y="${r(vt)}" width="${r(v1 - v0)}" height="${r(vb - vt)}" fill="${BRUCH}"/><rect x="${r(v0)}" y="${r(vt)}" width="${r(v1 - v0)}" height="${r(vb - vt)}" fill="#000" opacity=".08"/>`;
  k += `<path d="M${r(v0 - 1)} ${r(vt)} L${r(vm)} ${r(vs)} L${r(v1 + 1)} ${r(vt)} Z" fill="${DACHZ}"/>`;
  /* innerer Torturm: Bruchstein, Spitzbogen, kleine Fenster, steiles Zeltdach */
  const w = 3.2, [x0] = Q(-w, 0), [x1] = Q(w, 0), [, yb] = Q(0, 0), [, yt] = Q(0, 19), [xm, ys] = Q(0, 27);
  k += `<rect x="${r(x0)}" y="${r(yt)}" width="${r(x1 - x0)}" height="${r(yb - yt)}" fill="${BRUCH}"/>`;
  k += `<rect x="${r(x1 - 3)}" y="${r(yt)}" width="3" height="${r(yb - yt)}" fill="#000" opacity=".18"/><rect x="${r(x0)}" y="${r(yt)}" width="2" height="${r(yb - yt)}" fill="#ffd6a0" opacity=".2"/>`;
  for (const [H, dx] of [[11, -0.6], [14.5, 0.8], [17, -0.2]]) { const [fx, fy] = Q(dx, H); k += `<rect x="${r(fx - 0.7)}" y="${r(fy)}" width="1.4" height="2.4" fill="#2e261e"/>`; }
  k += `<path d="M${r(x0 - 1.6)} ${r(yt)} L${r(xm)} ${r(ys)} L${r(x1 + 1.6)} ${r(yt)} Z" fill="${DACHZ}"/><path d="M${r(xm)} ${r(ys)} L${r(x1 + 1.6)} ${r(yt)} L${r(xm + 2)} ${r(yt)} Z" fill="#000" opacity=".2"/>`;
  k += `<line x1="${r(xm)}" y1="${r(ys)}" x2="${r(xm)}" y2="${r(ys - 2.6)}" stroke="#5a4a2a" stroke-width=".35"/><circle cx="${r(xm)}" cy="${r(ys - 1.4)}" r=".6" fill="${GOLD}"/>`;
  /* Spitzbogen-Durchgang unten (nur der obere Teil schaut über die Steige) */
  const [, ab] = Q(0, 4.2);
  k += `<path d="M${r(xm - 4)} ${r(yb)} L${r(xm - 4)} ${r(ab + 3)} Q${r(xm - 4)} ${r(ab - 1)} ${r(xm)} ${r(ab - 2)} Q${r(xm + 4)} ${r(ab - 1)} ${r(xm + 4)} ${r(ab + 3)} L${r(xm + 4)} ${r(yb)} Z" fill="#2a221c"/>`;
  S.teil({ id: "kobolzellertor", de: "das Kobolzeller Tor", syl: "KO-bol-zel-ler TOR", it: "la porta Kobolzell", itSyl: "POR-ta KO-bol-zell", en: "Kobolzell Gate", x: 0, y: 0, kunst: k,
    tipp: "Das Kobolzeller Tor (1360) ist ein Tor in der Stadtmauer. Hinter ihm geht es steil hinunter ins Taubertal." });
}
/* =====================================================================
   4 — DAS HAUS: die Häuser an der Kobolzeller Steige (Traufen treppen
       sich nach unten) — Nordseite fast streifend, Südseite schräg
   ===================================================================== */
{
  let k = "";
  const haus = (t0, t1, w, traufe, first, putz, fw) => {
    let g = "";
    const a = PS(t0, w, 0), b = PS(t1, w, 0), c = PS(t1, w, traufe), d = PS(t0, w, traufe), tm = (t0 + t1) / 2;
    g += `<path d="${pz(a, b, c, d)}" fill="${putz}"/><path d="${pz(a, b, c, d)}" fill="${PUTZ}"/>`;
    /* Dach: Traufe zur Gasse, First dahinter (vom Betrachter weg) */
    const off = w > 2.5 ? 4.5 : -4.5;
    g += `<path d="${pz(d, c, PS(t1, w + off, first), PS(t0, w + off, first))}" fill="${DACHZ}"/>${(() => { const q = strecke(d, c); return q ? `<path d="M${pt(q[0])} L${pt(q[1])}" stroke="#5e2414" stroke-width=".6"/>` : ""; })()}`;
    if (fw) { let p = ""; for (const h of [3.2, 6]) p += `M${pt(PS(t0, w, h))} L${pt(PS(t1, w, h))} `; for (let i = 0; i <= 4; i++) { const t = t0 + (t1 - t0) * i / 4; p += `M${pt(PS(t, w, 3.2))} L${pt(PS(t, w, traufe))} `; } g += `<path d="${p}" stroke="${BALKEN}" stroke-width=".6" fill="none"/>`; }
    for (const [h0, h1] of [[1, 2.4], [4, 5.4], [6.8, 8.1]]) if (h1 < traufe) for (const f of [0.25, 0.65]) { const ta = t0 + (t1 - t0) * f, tb = ta + (t1 - t0) * 0.14; g += fensterQ(PS(ta, w, h1), PS(tb, w, h1), PS(tb, w, h0), PS(ta, w, h0), { rb: 0.3, licht: rnd() < 0.25 }); }
    g += `<path d="${poly(a, b, PS(t1, w, 0.5), PS(t0, w, 0.5))}" fill="#9a8a72"/>`;
    return g;
  };
  /* Südseite (hinter dem Plönleinhaus, schaut zu uns): von unten nach oben zeichnen */
  for (const [t0, t1, tr, fi, f, fw] of [[52, 64, 9, 14, "#e6d2b0", 0], [40, 52, 10, 15, "#dfb8a0", 1], [27, 40, 10, 15.6, "#efe2c4", 0], [13.6, 27, 9.4, 15, "#d9c08a", 1], [0, 13.6, 8.4, 16.6, "#e9b54c", 1]]) k += haus(t0, t1, 0, tr, fi, f, fw);
  /* Nordseite (fast streifend, links): zeigt vor allem Traufen und Dächer */
  for (const [t0, t1, tr, fi, f, fw] of [[46, 60, 9, 14, "#e8d8b8", 0], [30, 46, 10, 15, "#d8a898", 1], [14, 30, 9.6, 15, "#ede0c2", 0], [-2, 14, 10.4, 16, "#e2c890", 1], [-12.4, -2, 11, 16.6, "#f0dcc0", 0]]) k += haus(t0, t1, 5, tr, fi, f, fw);
  /* alles liegt am Abend im Schatten der Häuser */
  k += `<path d="${pz(PS(-11.7, 5, 11), PS(60, 5, 11), PS(60, 5, 0), PS(-11.7, 5, 0))}" fill="${SCHATTEN}" opacity=".28"/>`;
  k += `<path d="${pz(PS(13.6, 0, 10), PS(64, 0, 10), PS(64, 0, 0), PS(13.6, 0, 0))}" fill="${SCHATTEN}" opacity=".3"/>`;
  S.teil({ id: "haus", de: "das Haus", syl: "HAUS", it: "la casa", itSyl: "CA-sa", en: "house", x: 0, y: 0, kunst: k,
    tipp: "Die Häuser an der Kobolzeller Steige stehen immer tiefer – die Gasse ist sehr steil." });
}

/* =====================================================================
   6 — DAS FACHWERKHAUS am Plönlein: schmal, keilförmig, gelb
       Lupe: der Giebel, das Fachwerk, der Blumenkasten
   ===================================================================== */
const PH = { d: 22, L0: -9.5, L1: -3.5 };
let PLOEN = "";
const PLOEN_UNTER = [];
{
  const vk = 0.45;                       /* Vorkragung je Geschoss (m) */
  const traufe = 8.4, first = 16.6, Lm = (PH.L0 + PH.L1) / 2;
  const d1 = PH.d - vk, d2 = PH.d - 2 * vk, d3 = PH.d - 2 * vk - 0.25;   /* Ebenen der Geschosse */
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
    /* Schatten der Häuser gegenüber bis ≈ 9,4 m, darüber Abendsonne */
    k += `<path d="${poly(W(D0, 0), W(D1, 0), W(D1, 9.4, 2 * vk), W(D0, 9.4, 2 * vk))}" fill="${SCHATTEN}" opacity=".3"/>`;
    k += `<path d="${poly(W(d3, traufe, 2.5 * vk), W(D1, traufe, 2.5 * vk), P(Lm, D1, first), P(Lm, d3, first))}" fill="#ffb060" opacity=".22"/>`;
  }
  const s = F / PH.d;
  const X = (L, d) => VPX + L * F / d, Y = (h, d) => HOR - (h - EYE) * F / d;
  /* Erdgeschoss (verputzt), 1. und 2. Stock mit Vorkragung, Giebel */
  k += `<rect x="${r(X(PH.L0, PH.d))}" y="${r(Y(3.2, PH.d))}" width="${r(X(PH.L1, PH.d) - X(PH.L0, PH.d))}" height="${r(Y(0, PH.d) - Y(3.2, PH.d))}" fill="${S.lg("ploenEG", [[0, "#f0c868"], [1, "#d9ab4c"]])}"/>`;
  for (const [h0, h1, dd, e] of [[3.2, 5.8, d1, vk], [5.8, traufe, d2, 2 * vk]]) k += `<rect x="${r(X(PH.L0 - e, dd))}" y="${r(Y(h1, dd))}" width="${r(X(PH.L1 + e, dd) - X(PH.L0 - e, dd))}" height="${r(Y(h0, dd) - Y(h1, dd))}" fill="${GELB}"/>`;
  const e3 = 2.5 * vk;
  const gieb = [[X(PH.L0 - e3, d3), Y(traufe, d3)], [X(Lm, d3), Y(first, d3)], [X(PH.L1 + e3, d3), Y(traufe, d3)]];
  k += `<path d="${poly(...gieb)}" fill="${GELB}"/>`;
  k += `<path d="${poly(...gieb)}" fill="${PUTZ}"/><rect x="${r(X(PH.L0 - 2 * vk, d2))}" y="${r(Y(traufe, d2))}" width="${r(X(PH.L1 + 2 * vk, d2) - X(PH.L0 - 2 * vk, d2))}" height="${r(Y(0, PH.d) - Y(traufe, d2))}" fill="${PUTZ}"/>`;
  /* Schattenkanten unter den Vorkragungen und Balkenköpfe */
  for (const [h, dd, e] of [[3.2, d1, vk], [5.8, d2, 2 * vk], [traufe, d3, e3]]) {
    const xa = X(PH.L0 - e, dd), xb = X(PH.L1 + e, dd), y = Y(h, dd);
    k += `<rect x="${r(xa)}" y="${r(y)}" width="${r(xb - xa)}" height="1.6" fill="#000" opacity=".3"/>`;
    for (let i = 0; i <= 9; i++) { const x = xa + (xb - xa) * i / 9; k += `<rect x="${r(x - 0.7)}" y="${r(y + 0.2)}" width="1.4" height="1.2" fill="${BALKEN}"/>`; }
  }
  /* Fachwerk: Schwellen, Rähme, Ständer, Streben (unregelmäßige Achsen wie am Original) */
  let p = "";
  const sw = (h, dd, e) => `M${r(X(PH.L0 - e, dd))} ${r(Y(h, dd))} L${r(X(PH.L1 + e, dd))} ${r(Y(h, dd))} `;
  p += sw(3.2, d1, vk) + sw(3.42, d1, vk) + sw(5.8, d2, 2 * vk) + sw(6.02, d2, 2 * vk) + sw(traufe, d3, e3);
  const staender = [0, 0.27, 0.5, 0.68, 1];
  const FW_LINIEN = [];
  for (const [h0, h1, dd, e] of [[3.42, 5.8, d1, vk], [6.02, traufe, d2, 2 * vk]]) {
    for (const t of staender) { const L = PH.L0 - e + (PH.L1 - PH.L0 + 2 * e) * t; p += `M${r(X(L, dd))} ${r(Y(h0, dd))} L${r(X(L, dd))} ${r(Y(h1, dd))} `; }
    for (const [ta, tb] of [[0, 0.27], [0.68, 1]]) { const La = PH.L0 - e + (PH.L1 - PH.L0 + 2 * e) * ta, Lb = PH.L0 - e + (PH.L1 - PH.L0 + 2 * e) * tb; p += `M${r(X(La, dd))} ${r(Y(h0, dd))} L${r(X(Lb, dd))} ${r(Y(h1, dd))} M${r(X(Lb, dd))} ${r(Y(h0, dd))} L${r(X(La, dd))} ${r(Y(h1, dd))} `; FW_LINIEN.push([[X(La, dd), Y(h1, dd)], [X(Lb, dd), Y(h0, dd)]]); }
  }
  const gl = (h) => { const t = (h - traufe) / (first - traufe); return [PH.L0 - e3 + (Lm - PH.L0 + e3) * t, PH.L1 + e3 - (PH.L1 + e3 - Lm) * t]; };
  for (const h of [11, 13.4, 15.2]) { const [a, b] = gl(h); p += `M${r(X(a, d3))} ${r(Y(h, d3))} L${r(X(b, d3))} ${r(Y(h, d3))} `; }
  for (const t of [0.3, 0.7]) { const L = PH.L0 + (PH.L1 - PH.L0) * t; p += `M${r(X(L, d3))} ${r(Y(traufe, d3))} L${r(X(L, d3))} ${r(Y(13.4, d3))} `; }
  p += `M${r(X(Lm, d3))} ${r(Y(13.4, d3))} L${r(X(Lm, d3))} ${r(Y(first, d3))} `;
  { const [a] = gl(11), [, b] = gl(11); p += `M${r(X(a, d3))} ${r(Y(11, d3))} L${r(X(PH.L0 + 1.6, d3))} ${r(Y(traufe, d3))} M${r(X(b, d3))} ${r(Y(11, d3))} L${r(X(PH.L1 - 1.6, d3))} ${r(Y(traufe, d3))} `; }
  k += `<path d="${p}" stroke="${BALKEN}" stroke-width="1.25" fill="none" stroke-linecap="square"/>`;
  /* Ortgang mit Ziegelkante und Windbrett, Schattenkante */
  k += `<path d="M${r(gieb[0][0] - 2.4)} ${r(gieb[0][1] + 1.2)} L${pt(gieb[1])} L${r(gieb[2][0] + 2.4)} ${r(gieb[2][1] + 1.2)}" stroke="#7a3220" stroke-width="2.6" fill="none" stroke-linejoin="round"/>`;
  k += `<path d="M${r(gieb[0][0] - 2.4)} ${r(gieb[0][1] + 1.2)} L${pt(gieb[1])} L${r(gieb[2][0] + 2.4)} ${r(gieb[2][1] + 1.2)}" stroke="#c96a48" stroke-width=".6" fill="none" stroke-linejoin="round" transform="translate(0 -.9)"/>`;
  /* Fenster: unregelmäßig, mit Blumenkästen; Giebel mit Ladeluke und Aufzugsbalken */
  const win = (Lc, h0, h1, w, dd, opt = {}) => {
    const a = [X(Lc - w / 2, dd), Y(h1, dd)], b = [X(Lc + w / 2, dd), Y(h1, dd)], c = [X(Lc + w / 2, dd), Y(h0, dd)], d = [X(Lc - w / 2, dd), Y(h0, dd)];
    return fensterQ(a, b, c, d, Object.assign({ rb: 0.75, rahmen: "#f6f1e4" }, opt)) + (opt.kasten ? blumen(d, c, 1.15) : "");
  };
  const KASTEN = [];
  k += win(-8.1, 4, 5.3, 1.1, d1, { kasten: 1, abend: 1 }) + win(-5.3, 4, 5.3, 1.1, d1, { kasten: 1, licht: 1 }) + win(-4.15, 4.2, 5.1, 0.6, d1);
  KASTEN.push([X(-5.3 - 0.55, d1), Y(4, d1), X(-5.3 + 0.55, d1) - X(-5.3 - 0.55, d1)]);
  k += win(-7.9, 6.6, 7.9, 1.1, d2, { kasten: 1 }) + win(-5.2, 6.6, 7.9, 1.1, d2, { kasten: 1, abend: 1 });
  k += win(-7.4, 9.4, 10.5, 0.9, d3) + win(-5.6, 9.4, 10.5, 0.9, d3, { abend: 1 }) + win(-6.5, 11.9, 12.9, 0.8, d3);
  { const lx0 = X(-6.85, d3), lx1 = X(-6.15, d3), ly0 = Y(14.9, d3), ly1 = Y(13.9, d3); k += `<rect x="${r(lx0)}" y="${r(ly0)}" width="${r(lx1 - lx0)}" height="${r(ly1 - ly0)}" fill="#4a2a1a" stroke="${BALKEN}" stroke-width=".5"/>`; const bx = X(-6.5, d3 - 1.2), by = Y(15.4, d3 - 1.2); k += `<path d="M${r(X(-6.5, d3))} ${r(Y(15.4, d3))} L${r(bx)} ${r(by)}" stroke="${BALKEN}" stroke-width="1.1"/><path d="M${r(bx)} ${r(by)} v5" stroke="#6a5a48" stroke-width=".3"/><circle cx="${r(bx)}" cy="${r(by + 0.6)}" r=".6" fill="none" stroke="#3a3a3a" stroke-width=".3"/>`; }
  /* Erdgeschoss: rundbogige Haustür mit Oberlicht, Fenster, Stufe, Sockel, Hausnummer */
  k += `<path d="M${r(X(-5.2, PH.d))} ${r(Y(0, PH.d))} L${r(X(-5.2, PH.d))} ${r(Y(1.9, PH.d))} Q${r(X(-5.2, PH.d))} ${r(Y(2.55, PH.d))} ${r(X(-4.5, PH.d))} ${r(Y(2.55, PH.d))} Q${r(X(-3.8, PH.d))} ${r(Y(2.55, PH.d))} ${r(X(-3.8, PH.d))} ${r(Y(1.9, PH.d))} L${r(X(-3.8, PH.d))} ${r(Y(0, PH.d))} Z" fill="${S.lg("tuer", [[0, "#6b4428"], [1, "#4a2c18"]])}" stroke="#c9a46a" stroke-width=".6"/>`;
  k += `<rect x="${r(X(-5.4, PH.d))}" y="${r(Y(0.18, PH.d))}" width="${r(X(-3.6, PH.d) - X(-5.4, PH.d))}" height="1.6" fill="#b9a07a"/><circle cx="${r(X(-4.05, PH.d))}" cy="${r(Y(1.1, PH.d))}" r=".5" fill="${GOLD}"/>`;
  k += `<rect x="${r(X(-3.95, PH.d))}" y="${r(Y(2.9, PH.d))}" width="2.4" height="1.6" rx=".3" fill="#2a4a7a"/><text x="${r(X(-3.95, PH.d) + 1.2)}" y="${r(Y(2.9, PH.d) + 1.25)}" font-size="1.3" text-anchor="middle" fill="#fff" font-family="Arial">7</text>`;
  k += win(-8.5, 1.1, 2.3, 1, PH.d, { licht: 1 }) + win(-6.8, 1.1, 2.3, 1, PH.d, { abend: 1 });
  k += `<rect x="${r(X(PH.L0, PH.d))}" y="${r(Y(0.5, PH.d))}" width="${r(X(PH.L1, PH.d) - X(PH.L0, PH.d))}" height="${r(0.5 * s)}" fill="#b9a07a"/>`;
  /* Abendlicht: unten Schatten, Giebel oberhalb ≈ 9,4 m golden; der Lichtstreifen aus der Gassenlücke */
  const ys = Y(9.4, d3);
  /* Schatten nur auf dem Baukörper (je Geschoss), Giebel oberhalb 9,4 m golden */
  k += `<rect x="${r(X(PH.L0, PH.d))}" y="${r(Y(3.2, PH.d))}" width="${r(X(PH.L1, PH.d) - X(PH.L0, PH.d))}" height="${r(Y(0, PH.d) - Y(3.2, PH.d))}" fill="${SCHATTEN}" opacity=".24"/>`;
  for (const [h0, h1, dd, e] of [[3.2, 5.8, d1, vk], [5.8, traufe, d2, 2 * vk]]) k += `<rect x="${r(X(PH.L0 - e, dd))}" y="${r(Y(h1, dd))}" width="${r(X(PH.L1 + e, dd) - X(PH.L0 - e, dd))}" height="${r(Y(h0, dd) - Y(h1, dd))}" fill="${SCHATTEN}" opacity=".24"/>`;
  { const [a, b] = gl(9.4); k += `<path d="${poly(gieb[0], gieb[2], [X(b, d3), ys], [X(a, d3), ys])}" fill="${SCHATTEN}" opacity=".24"/><path d="${poly([X(a, d3), ys], [X(b, d3), ys], gieb[1])}" fill="#ffb24a" opacity=".2"/>`; }
  /* wo der Lichtstreifen aus der Gassenlücke den Sockel trifft: warmer Fleck unten */
  k += `<path d="${poly(P(-7.8, PH.d, 0), P(-5.8, PH.d, 0), P(-6.1, PH.d, 1.3), P(-7.6, PH.d, 1.5))}" fill="#ffc86a" opacity=".3"/>`;
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
const RECHTS = [
  { d0: 4.6, d1: 9.6, traufe: 9.6, first: 14.2, putz: "#e8d6b8", fw: true, gasthof: true },
  { d0: 9.6, d1: 14.6, traufe: 10.2, first: 15, putz: "#e9e1d0", fw: false, laden: true },
  { d0: 16.4, d1: 21, traufe: 11, first: 16.4, putz: "#e6c17e", fw: true },
  { d0: 21, d1: 30, traufe: 10.4, first: 15.6, putz: "#c9cfd2", fw: false },
  { d0: 30, d1: 44, traufe: 11.4, first: 17, putz: "#ead9b8", fw: true },
];
{
  let c = "";
  const L = 4;
  /* Seitengasse (Lücke) zwischen 14,6 und 16,4 m: dahinter Licht */
  c += `<path d="${poly(P(L, 14.6, 0), P(L + 6, 15.4, 0), P(L + 6, 15.4, 11), P(L, 14.6, 11))}" fill="#e8cfa0"/><path d="${poly(P(L, 16.4, 0), P(L + 6, 15.4, 0), P(L + 6, 15.4, 11), P(L, 16.4, 11))}" fill="#c8a880"/>`;
  for (const h of RECHTS.slice().reverse()) {
    const dm = (h.d0 + h.d1) / 2, q = (d, H) => P(L, d, H);
    c += `<path d="${poly(q(h.d0, 0), q(h.d0, h.traufe), q(dm, h.first), q(h.d1, h.traufe), q(h.d1, 0))}" fill="${h.putz}"/><path d="${poly(q(h.d0, 0), q(h.d0, h.traufe), q(dm, h.first), q(h.d1, h.traufe), q(h.d1, 0))}" fill="${PUTZ}"/>`;
    /* Ortgang mit Ziegelkante und Schatten */
    c += `<path d="M${pt(q(h.d0, h.traufe - 0.2))} L${pt(q(dm, h.first + 0.4))} L${pt(q(h.d1, h.traufe - 0.2))}" stroke="#8d3d26" stroke-width="${r(Math.max(0.8, 1.8 * 10 / dm))}" fill="none" stroke-linejoin="round"/>`;
    if (h.fw) {
      let p = "";
      for (const hh of [3.2, 6, 8.8]) p += `M${pt(q(h.d0, hh))} L${pt(q(h.d1, hh))} `;
      for (let i = 0; i <= 5; i++) { const d = h.d0 + (h.d1 - h.d0) * i / 5; p += `M${pt(q(d, 3.2))} L${pt(q(d, h.traufe))} `; }
      for (let i = 0; i < 5; i += 2) { const da = h.d0 + (h.d1 - h.d0) * i / 5, db = h.d0 + (h.d1 - h.d0) * (i + 1) / 5; p += `M${pt(q(da, 3.2))} L${pt(q(db, 6))} M${pt(q(db, 6))} L${pt(q(da, 8.8))} `; }
      c += `<path d="${p}" stroke="${BALKEN}" stroke-width="${r(Math.max(0.5, 1.1 * 10 / dm))}" fill="none"/>`;
    }
    /* Fenster mit Laibung, teils Läden, teils Licht */
    for (const [ha, hb] of [[3.9, 5.3], [6.7, 8.1], [h.traufe + 1, h.traufe + 2.2]]) {
      const n = hb > h.traufe ? 1 : 3;
      for (let i = 0; i < n; i++) {
        const t0 = n === 1 ? 0.42 : 0.12 + i * 0.3, t1 = t0 + 0.16, da = h.d0 + (h.d1 - h.d0) * t0, db = h.d0 + (h.d1 - h.d0) * t1;
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
    c += `<path d="${poly(q(h.d0, 0.6), q(h.d1, 0.6), q(h.d1, 0), q(h.d0, 0))}" fill="#a8916c"/><path d="${poly(q(h.d0, 0.6), q(h.d1, 0.6), q(h.d1, 0), q(h.d0, 0))}" fill="${PUTZ}"/>`;
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
  c += `<path d="${poly(P(LL, d0, 22), P(LL, d1, 22), P(LL, d1, 0), P(LL, d0, 0))}" fill="${SCHATTEN}" opacity=".26"/>`;
  S.hinten(c);
}

/* =====================================================================
   8 — DAS KOPFSTEINPFLASTER: Segmentbögen, Steingröße ∝ 1/Abstand,
       Fugen laufen zum Fluchtpunkt (Bänder mit je ganzen Steinreihen)
   ===================================================================== */
{
  const RH = 0.14, PER = 1.2;    /* Reihenhöhe und Bogenbreite (m) */
  const bogen = (x) => 0.04 * (1 - Math.pow(((x % PER) + PER) % PER / (PER / 2) - 1, 2));
  /* Kachel mit n Reihen: einzelne Steine (nah) oder nur Fugen (fern) */
  const kacheln = {};
  const kachel = (n) => {
    if (kacheln[n]) return kacheln[n];
    const z = zufall(100 + n);
    let g = `<rect width="${PER * 2}" height="${r(n * RH * 1000) / 1000}" fill="#8b8072"/>`;
    if (n <= 2) {
      for (let row = 0; row < n; row++) for (let x = (row % 2) * 0.07; x < PER * 2; x += 0.12 + z() * 0.05) {
        const w = 0.1 + z() * 0.03, y = row * RH + 0.025 + bogen(x);
        g += `<rect x="${r(x * 1000) / 1000}" y="${r(y * 1000) / 1000}" width="${r(w * 1000) / 1000}" height=".09" rx=".025" fill="${["#a39684", "#9a8e7e", "#b0a28c", "#8f8577", "#a8977c", "#968a7e"][Math.floor(z() * 6)]}"/>`;
      }
    } else {
      let d = "";
      for (let row = 0; row < n; row++) { d += `M0 ${r((row * RH + 0.012) * 1000) / 1000}`; for (let x = 0.1; x <= PER * 2 + 0.01; x += 0.1) d += ` L${r(x * 100) / 100} ${r((row * RH + 0.012 + bogen(x)) * 1000) / 1000}`; }
      g += `<rect width="${PER * 2}" height="${r(n * RH * 1000) / 1000}" fill="#a09380" opacity=".7"/><path d="${d}" stroke="#6e6457" stroke-width=".02" fill="none"/>`;
    }
    const id = "pk" + n;
    S.def(`<pattern id="${S.id(id)}" width="${PER * 2}" height="${r(n * RH * 1000) / 1000}" patternUnits="userSpaceOnUse">${g}</pattern>`);
    kacheln[n] = id;
    return id;
  };
  const yD = (D) => HOR + EYE * F / D;
  const flaecheP = zuschnitt([[-1, 262], P(LL, 3.4, 0), P(LL, 9.3, 0), PS(-11.7, 5, 0), PS(2.4, 5, 0), PS(2.4, 0, 0), P(PH.L0, PH.d, 0), P(PH.L1, PH.d, 0), P(PH.L1, 21.05, 0, 0), P(4, 21.05, 0, 0), P(4, 3.3, 0), [401, 262]]);
  S.def(`<clipPath id="${S.id("pflclip")}"><path d="${poly(...flaecheP)}"/></clipPath>`);
  let b = "";
  let D = 3.2, n = 1, nr = 0;
  while (D < 22.2 && nr < 90) {
    const h = yD(D) - yD(D + n * RH);
    if (h < 2.2 && n < 64) { n *= 2; continue; }
    const Df = D + n * RH, sx = F / ((D + Df) / 2), sy = (yD(D) - yD(Df)) / (n * RH);
    const id = kachel(Math.min(n, 64)), bid = "pb" + nr++;
    S.def(`<pattern id="${S.id(bid)}" href="#${S.id(id)}" patternTransform="translate(${VPX} ${r(yD(Df))}) scale(${r(sx * 100) / 100} ${r(sy * 100) / 100})"/>`);
    b += `<rect x="-1" y="${r(yD(Df))}" width="402" height="${r(Math.min(261, yD(D) + 0.15) - yD(Df))}" fill="url(#${S.id(bid)})"/>`;
    D = Df;
  }
  let k = `<path d="${poly(...flaecheP)}" fill="#8f8474"/><g clip-path="url(#${S.id("pflclip")})">${b}`;
  /* Rinne aus Granitplatten in der Mitte (läuft zum Fluchtpunkt) */
  k += `<path d="${poly(P(-0.17, 3.3, 0), P(0.17, 3.3, 0), P(0.17, 21, 0), P(-0.17, 21, 0))}" fill="#6e665a" opacity=".32"/>`;
  k += `<path d="M${pt(P(0.17, 3.3, 0))} L${pt(P(0.17, 21, 0))}" stroke="#b3a690" stroke-width=".35" opacity=".6"/>`;
  for (let d = 3.6; d < 21; d *= 1.14) k += `<path d="M${pt(P(-0.17, d, 0))} L${pt(P(0.17, d, 0))}" stroke="#4e483f" stroke-width=".25" opacity=".6"/>`;
  /* Abendschatten über der ganzen Gasse, Lichtstreifen aus der Lücke rechts (schräg nach links vorn) */
  k += `<rect x="-1" y="${HOR - 2}" width="402" height="${263 - HOR}" fill="${SCHATTEN}" opacity=".3"/>`;
  const strahl = (Dx) => [P(4, Dx, 0), P(-7.8 + (Dx - 15.2) * 1.7, 22, 0)];
  const [a1, a2] = strahl(15.2), [b1, b2] = strahl(16.4);
  k += `<path d="${poly(a1, b1, b2, a2)}" fill="#ffcc78" opacity=".5"/><path d="${poly(a1, b1, b2, a2)}" fill="#fff0c0" opacity=".2" filter="url(#${S.id("dunst")})"/>`;
  k += `<rect x="-1" y="${HOR - 2}" width="402" height="${263 - HOR}" fill="${S.lg("pflnah", [[0, "#000", 0], [0.6, "#000", 0.04], [1, "#120c08", 0.22]])}"/></g>`;
  /* rechte Gasse zum Siebersturm: steigt sichtbar an (Fugenreihen, Bordstein, Rinne) */
  const G = [P(PH.L1, 21.05, 0, 0), P(4, 21.05, 0, 0), P(4, 44.6, 0), P(-3.5, 44.6, 0)];
  k += `<path d="${poly(...G)}" fill="${S.lg("gasserechts", [[0, "#9a8c78"], [1, "#857868"]])}"/>`;
  for (let d = 21.6; d < 44.6; d += 0.8) k += `<path d="M${pt(P(-3.5, d, 0))} Q${pt(P(0.2, d - 0.3, 0))} ${pt(P(4, d, 0))}" stroke="#6e6457" stroke-width=".25" fill="none" opacity=".8"/>`;
  k += `<path d="M${pt(P(3.6, 21.05, 0.12, 0))} L${pt(P(3.6, 44.6, 0.12))}" stroke="#cbb898" stroke-width=".6"/>`;
  k += `<path d="${poly(...G)}" fill="${SCHATTEN}" opacity=".26"/>`;
  S.teil({ id: "pflaster", de: "das Kopfsteinpflaster", syl: "KOPF-stein-pflas-ter", it: "il selciato", itSyl: "sel-CIA-to", en: "cobblestones", x: 0, y: 0, kunst: k,
    tipp: "Die Pflastersteine liegen in Bögen. Rechts steigt die Gasse sanft zum Siebersturm an." });
}

/* =====================================================================
   5 — DIE GASSE (Kobolzeller Steige: fällt hinter der Kante sichtbar ab)
   ===================================================================== */
{
  /* Die Steige ist ab der Kuppe (t ≈ 2) verdeckt: man sieht nur den Anfang und die Kante, dahinter fallen Häuser und Tor weg */
  const TK = 2.4, L = [], R = [];
  for (let t = -11.7; t <= TK + 0.01; t += (TK + 11.7) / 6) { L.push(PS(t, 5, 0)); R.push(PS(t, 0, 0)); }
  let k = `<path d="${poly(...L, ...R.slice().reverse())}" fill="${S.lg("steige", [[0, "#4a4038", 0.28], [1, "#6a5e50", 0.12]], 0, 0, 0, 1)}"/>`;
  /* Pflasterbögen quer zur Steige, zur Kuppe hin enger */
  for (let t = -11; t < TK; t += Math.max(0.5, (TK - t) * 0.16)) { const a2 = PS(t, 0.1, 0), b2 = PS(t, 4.9, 0), m2 = PS(t + 0.25, 2.5, 0); k += `<path d="M${pt(a2)} Q${pt(m2)} ${pt(b2)}" stroke="#6e6457" stroke-width="${r(Math.max(0.15, 0.5 * 12 / (SX(t, 2.5)[1])))}" fill="none" opacity=".75"/>`; }
  /* Rinne in der Mitte und Bordsteine, die zur Kuppe laufen */
  k += `<path d="M${pt(PS(-11.7, 2.5, 0))} L${pt(PS(TK, 2.5, 0))}" stroke="#5a5248" stroke-width="1.1" opacity=".55"/>`;
  k += `<path d="M${L.map(pt).join(" L")}" stroke="#c9b898" stroke-width=".6" fill="none"/><path d="M${R.map(pt).join(" L")}" stroke="#c9b898" stroke-width=".6" fill="none"/>`;
  /* die Kuppe: heller Grat, dahinter fällt die Gasse steil ab (warmer Dunst aus dem Tal) */
  k += `<path d="M${pt(PS(TK, 5, 0))} L${pt(PS(TK, 0, 0))}" stroke="#d8c8a8" stroke-width=".7"/>`;
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
    for (const [a, b2, c2] of [[-0.6, -1.5, 0.5], [0.5, -1.3, 0.45], [-0.1, -0.7, 0.55], [0.55, -0.5, 0.35], [-0.65, -0.6, 0.38]]) g += `<ellipse cx="${r(x + a * rr)}" cy="${r(y + b2 * rr)}" rx="${r(c2 * rr)}" ry="${r(c2 * rr * 0.55)}" fill="${f[0]}" transform="rotate(${Math.round((a + b2) * 40)} ${r(x + a * rr)} ${r(y + b2 * rr)})"/>`;
    if (art === "zucker") for (let i = 0; i < 4; i++) g += `<circle cx="${r(x + (rnd() - 0.5) * rr * 1.4)}" cy="${r(y - rr + (rnd() - 0.5) * rr * 1.2)}" r="${r(rr * 0.08)}" fill="#fff"/>`;
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
        if (bi === 1 && i === 1) pos.push(["schneeball", x, y]);
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
    const [x0, y0] = P(LL, 6.5, 3.9), [x1] = P(-6.6, 6.5, 3.9);
    k += `<rect x="${r(x0 - 1)}" y="${r(y0 - 5)}" width="2.2" height="10" fill="${EISEN}"/><path d="M${r(x0)} ${r(y0)} L${r(x1)} ${r(y0)}" stroke="${EISEN}" stroke-width="1.2"/>`;
    k += `<path d="M${r(x0)} ${r(y0 + 5)} Q${r((x0 + x1) / 2)} ${r(y0 + 4)} ${r(x1 - 3)} ${r(y0 + 0.5)}" stroke="${EISEN}" stroke-width=".7" fill="none"/>`;
    for (const t of [0.3, 0.6]) { const x = x0 + (x1 - x0) * t; k += `<path d="M${r(x)} ${r(y0)} q-2.4 -3.6 0 -5.2 q2.4 1.2 .5 3" stroke="${EISEN}" stroke-width=".55" fill="none"/>`; }
    const cx = x1 - 4, cy = y0 + 13, q = (dx, dy) => `${r(cx + dx * 4.6)} ${r(cy + dy * 4.6)}`;
    k += `<line x1="${r(cx)}" y1="${r(y0)}" x2="${r(cx)}" y2="${r(cy - 11)}" stroke="${EISEN}" stroke-width=".5"/>`;
    k += `<path d="M${r(cx - 4)} ${r(cy - 7)} L${r(cx - 4)} ${r(cy - 11)} L${r(cx - 2)} ${r(cy - 8.6)} L${r(cx)} ${r(cy - 11.6)} L${r(cx + 2)} ${r(cy - 8.6)} L${r(cx + 4)} ${r(cy - 11)} L${r(cx + 4)} ${r(cy - 7)} Z" fill="${GOLD}" stroke="#8a6a2a" stroke-width=".3"/>`;
    k += `<path d="M${q(-1.5, -0.4)} C${q(-2.1, -1.6)} ${q(-1.2, -2.6)} ${q(-0.2, -2.1)} L${q(0.5, -0.9)} M${q(1.5, -0.4)} C${q(2.1, -1.6)} ${q(1.2, -2.6)} ${q(0.2, -2.1)} L${q(-0.5, -0.9)} M${q(-1.5, -0.4)} Q${q(0, 0.5)} ${q(1.5, -0.4)}" stroke="${GOLD}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
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
  { const d = 13.2, [x, y] = P(Li + 0.3, d, h0 + 0.12), s = F / d; k += `<path d="M${r(x - 0.38 * s)} ${r(y)} L${r(x)} ${r(y - 1.5 * s)} L${r(x + 0.38 * s)} ${r(y)} Z" fill="#2c5a30"/>`; for (let i = 0; i < 7; i++) k += `<circle cx="${r(x + (rnd() - 0.5) * 0.45 * s)}" cy="${r(y - (0.2 + rnd() * 1) * s)}" r=".6" fill="${["#c8202c", "#e8b830", "#e8e8ee"][i % 3]}"/>`; k += `<path d="M${r(x)} ${r(y - 1.62 * s)} l.5 1 l-1 0 Z" fill="#f2c83a"/>`; }
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
  const zh = Math.max(by - ay + 8, (Math.abs(bx - ax) + 18) / 1.5), zw = zh * 1.5;
  S.teil({ id: "schaufenster", de: "das Schaufenster", syl: "SCHAU-fens-ter", it: "la vetrina", itSyl: "ve-TRI-na", en: "shop window", x: 0, y: 0, kunst: k,
    tipp: "In Rothenburg kann man das ganze Jahr Weihnachtsschmuck kaufen.",
    zoom: { x: r(Math.min(ax, bx) - (zw - Math.abs(bx - ax)) / 2), y: r(ay - 4), w: r(zw), h: r(zh) },
    unter: [
      { id: "nussknacker", de: "der Nussknacker", syl: "NUSS-kna-cker", it: "lo schiaccianoci", itSyl: "schiac-cia-NO-ci", en: "nutcracker", x: KN[0], y: KN[1], kunst: flaeche(-3, -1.3 * F / 11.5, 6, 1.3 * F / 11.5),
        tipp: "Der Nussknacker knackt Nüsse mit seinem großen Mund. Er kommt aus dem Erzgebirge." },
      { id: "christbaumkugel", de: "die Christbaumkugel", syl: "CHRIST-baum-ku-gel", it: "la pallina di Natale", itSyl: "pal-LI-na di na-TA-le", en: "Christmas bauble", x: KU[0][0], y: KU[0][1], kunst: flaeche(-3, -3, 6, 6) },
      { id: "stern", de: "der Stern", syl: "STERN", it: "la stella", itSyl: "STEL-la", en: "star", x: STERN[0], y: STERN[1], kunst: flaeche(-3.4, -3.4, 6.8, 6.8) },
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
  const d = 10.4, [x, y] = P(-2.6, d, 0), s = F / d;
  const m = B.mensch({ id: "rtb_touristin", geschlecht: "w", pose: "halten", blick: 186, frisur: "zopf", haarfarbe: "hellbraun", haut: "hell",
    kleidung: { oberteil: { stueck: "pullover", farbe: "#3d6a8a" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" } } }, 1.68 * s);
  const H = (n) => { const q = m.z.punkte[n]; return [q[0] * m.k, q[1] * m.k]; };
  const hl = H("handL"), hr = H("handR"), hx = (hl[0] + hr[0]) / 2, hy = Math.min(hl[1], hr[1]);
  let k = schatten(3, 0.4, 0.3 * s, 0.07 * s, 0.25) + m.svg;
  /* Handy über den Händen, Bildschirm zeigt das gelbe Haus */
  k += `<rect x="${r(hx - 0.05 * s)}" y="${r(hy - 0.17 * s)}" width="${r(0.1 * s)}" height="${r(0.15 * s)}" rx=".3" fill="#1c1d20"/><rect x="${r(hx - 0.04 * s)}" y="${r(hy - 0.16 * s)}" width="${r(0.08 * s)}" height="${r(0.13 * s)}" fill="#f2c45c"/><path d="M${r(hx - 0.03 * s)} ${r(hy - 0.08 * s)} L${r(hx)} ${r(hy - 0.14 * s)} L${r(hx + 0.03 * s)} ${r(hy - 0.08 * s)}" stroke="#7a3220" stroke-width=".25" fill="none"/>`;
  S.teil({ id: "touristin", de: "die Touristin", syl: "tou-RIS-tin", it: "la turista", itSyl: "tu-RI-sta", en: "tourist", x, y, kunst: k,
    tipp: "Die Touristin fotografiert das Plönlein mit dem Handy." });
}

/* =====================================================================
   17 — DER NACHTWÄCHTER mit 18 — DER HELLEBARDE (in der Hand) und
   19 — DER LATERNE
   ===================================================================== */
const NW = (() => { const d = 7.4, [x, y] = P(1.0, d, 0); return { x, y, s: F / d }; })();
const nw = B.mensch({ id: "rtb_nachtwaechter", geschlecht: "m", pose: "stehen", blick: 330, frisur: "kurz", haarfarbe: "grau", haut: "hell", bart: "voll",
  kleidung: { oberteil: { stueck: "hemd", farbe: "weiss" }, jacke: { stueck: "mantel", farbe: "#1e1c21" }, unterteil: { stueck: "hose", farbe: "schwarz" }, schuhe: { stueck: "stiefel", farbe: "#1a1a1a" }, kopf: { stueck: "hut", farbe: "#17161a" } } }, 1.78 * NW.s);
const NP = (n) => { const q = nw.z.punkte[n]; return [q[0] * nw.k, q[1] * nw.k]; };
const HAENDE = [NP("handL"), NP("handR")].sort((a, b) => a[0] - b[0]);
{
  let k = schatten(10, 0.5, 14, 2.4, 0.35) + nw.svg;
  /* Pelerine (weiter Umhang) über den Schultern */
  const [sl, slY] = NP("schulterL"), [sr, srY] = NP("schulterR"), [hx, hy] = NP("hals");
  const lo = Math.min(sl, sr), hi = Math.max(sl, sr), oy = Math.min(slY, srY);
  k += `<path d="M${r(hx - 3)} ${r(hy + 1)} Q${r(lo - 2)} ${r(oy + 1)} ${r(lo - 3.4)} ${r(oy + 13)} Q${r((lo + hi) / 2)} ${r(oy + 15)} ${r(hi + 3.4)} ${r(oy + 13)} Q${r(hi + 2)} ${r(oy + 1)} ${r(hx + 3)} ${r(hy + 1)} Z" fill="${S.lg("umhang", [[0, "#2a2830"], [0.5, "#16151a"], [1, "#0e0d10"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${r(hx - 2.6)} ${r(hy + 1.4)} Q${r(hx)} ${r(hy + 3)} ${r(hx + 2.6)} ${r(hy + 1.4)}" stroke="#d8d4cc" stroke-width=".7" fill="none"/>`;
  k += `<path d="M${r(hi + 2.6)} ${r(oy + 6)} Q${r(hi + 2)} ${r(oy + 3)} ${r(hi)} ${r(oy + 1.4)}" stroke="#ffcf8a" stroke-width=".5" fill="none" opacity=".35"/>`;
  /* breite Krempe des Schlapphuts */
  const [kx, ky2] = NP("scheitel");
  k += `<ellipse cx="${r(kx)}" cy="${r(ky2 + 2.4)}" rx="7.4" ry="1.5" fill="#141317"/><path d="M${r(kx - 7)} ${r(ky2 + 2.2)} Q${r(kx)} ${r(ky2 + 1.2)} ${r(kx + 7)} ${r(ky2 + 2.2)}" stroke="#3a3840" stroke-width=".3" fill="none"/>`;
  /* Horn am Gürtel */
  const [bx, by] = NP("huefteR");
  k += `<path d="M${r(bx - 1)} ${r(by)} q3 1 4 4 l-1.4 .4 q-.8 -2.4 -3 -3.2 Z" fill="#c9a46a" stroke="#7a5a2a" stroke-width=".25"/>`;
  S.teil({ id: "nachtwaechter", de: "der Nachtwächter", syl: "NACHT-wäch-ter", it: "la guardia notturna", itSyl: "GUAR-dia not-TUR-na", en: "night watchman", x: NW.x, y: NW.y, kunst: k,
    tipp: "Am Abend führt der Nachtwächter mit Schlapphut und Horn die Gäste durch die Altstadt.",
    zoom: { x: r(NW.x + kx - 26), y: r(NW.y + ky2 - 8), w: 52, h: 34 },
    unter: [
      { id: "hut", de: "der Hut", syl: "HUT", it: "il cappello", itSyl: "cap-PEL-lo", en: "hat", x: NW.x + kx, y: NW.y + ky2, kunst: flaeche(-7.8, -5, 15.6, 9),
        tipp: "Der Nachtwächter trägt einen breiten schwarzen Schlapphut." },
    ] });
}
{
  /* Hellebarde: die linke Hand umfasst die Stange; Fläche nur Stange und Klinge */
  const [hx, hy] = HAENDE[0];
  const top = -2.45 * NW.s;
  let k = `<rect x="${r(hx - 0.75)}" y="${r(top)}" width="1.5" height="${r(-top)}" rx=".5" fill="${S.lg("stange", [[0, "#5a3a22"], [0.5, "#9a7048"], [1, "#4a2e18"]], 0, 0, 1, 0)}"/>`;
  const STAHL = S.lg("stahl", [[0, "#e8ecef"], [0.5, "#aab3ba"], [1, "#7a838a"]], 0, 0, 1, 0);
  k += `<path d="M${r(hx - 0.7)} ${r(top)} L${r(hx)} ${r(top - 10)} L${r(hx + 0.7)} ${r(top)} Z" fill="${STAHL}"/>`;
  k += `<path d="M${r(hx + 0.6)} ${r(top + 1)} L${r(hx + 6.4)} ${r(top - 1.6)} Q${r(hx + 7.4)} ${r(top + 3)} ${r(hx + 6.2)} ${r(top + 7.4)} L${r(hx + 0.6)} ${r(top + 5)} Z" fill="${STAHL}" stroke="#5a6268" stroke-width=".25"/>`;
  k += `<path d="M${r(hx - 0.6)} ${r(top + 2)} L${r(hx - 3.6)} ${r(top + 0.4)} L${r(hx - 3)} ${r(top + 2.2)} L${r(hx - 0.6)} ${r(top + 3.6)} Z" fill="${STAHL}"/>`;
  k += `<rect x="${r(hx - 0.9)}" y="${r(top + 5)}" width="1.8" height="1.2" fill="#c9a640"/><path d="M${r(hx + 6.2)} ${r(top - 1)} L${r(hx + 6.8)} ${r(top + 5)}" stroke="#fff" stroke-width=".4" opacity=".6"/>`;
  /* Faust um die Stange */
  k += `<ellipse cx="${r(hx)}" cy="${r(hy - 0.6)}" rx="1.3" ry="1.1" fill="#e8c4a2"/><path d="M${r(hx - 1.1)} ${r(hy - 1)} h2.2 M${r(hx - 1.1)} ${r(hy - 0.3)} h2.2" stroke="#c49a7a" stroke-width=".25"/>`;
  k += `<path class="bw-flaeche" d="M${r(hx - 1.4)} ${r(hy - 4)} L${r(hx + 1.4)} ${r(hy - 4)} L${r(hx + 1.4)} ${r(top + 8)} L${r(hx + 7.4)} ${r(top + 7.4)} L${r(hx + 7.4)} ${r(top - 10)} L${r(hx - 4)} ${r(top - 10)} L${r(hx - 4)} ${r(top + 8)} L${r(hx - 1.4)} ${r(top + 8)} Z" fill="rgba(255,255,255,0.001)"/>`;
  S.teil({ oben: true, id: "hellebarde", de: "die Hellebarde", syl: "hel-le-BAR-de", it: "l'alabarda", itSyl: "a-la-BAR-da", en: "halberd", x: NW.x, y: NW.y, kunst: k,
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
  S.teil({ oben: true, id: "laterne", de: "die Laterne", syl: "la-TER-ne", it: "la lanterna", itSyl: "lan-TER-na", en: "lantern", x: NW.x, y: NW.y, kunst: k + flaeche(lx - 3, ly - 6, 6, 11),
    tipp: "Früher gab es keine Straßenlampen. Der Nachtwächter trug eine Laterne." });
}

/* Abendstimmung über allem: oben warmer Schein, unten kühler */
S.davor(`<rect width="400" height="260" fill="${S.lg("abendschein", [[0, "#ffb070", 0.08], [0.5, "#ffb070", 0], [1, "#203050", 0.08]])}"/>`);

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/rothenburg.js"));
console.log(aus);
