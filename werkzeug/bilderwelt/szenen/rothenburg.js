#!/usr/bin/env node
/* =====================================================================
   ROTHENBURG OB DER TAUBER (FASSUNG 854) — Bilderwelt neu: Sehenswürdigkeit
   ---------------------------------------------------------------------
   XANDER (03.10.): „die bekannten Sehenswürdigkeiten … als Profi-
   Grafikdesigner auf Hollywood-Niveau … mit größter Sorgfalt und
   Präzision auf höchstem Niveau“.

   STANDORT: das PLÖNLEIN („kleiner Platz“) am Südende der Oberen
   Schmiedgasse — eines der bekanntesten Fotomotive Deutschlands. Man
   steht in der Gasse und schaut nach Süden auf die Gabelung.
   Sommerabend kurz vor acht: die Sonne steht im Westen (rechts), die
   nach Westen schauenden Fassaden links leuchten warm, die Laternen
   gehen an — gleich beginnt die Nachtwächterführung.

   RECHERCHE (rothenburg-tourismus.de, Wikipedia „Plönlein“,
   „Siebersturm“, „Kobolzeller Tor“, „Rothenburger Schneeballen“):
   - In der Gabelung steht das schmale, GELBE FACHWERKHAUS mit dem
     Giebel zur Gasse: unten Putz/Stein, darüber dunkelrotbraunes
     Fachwerk mit vorkragenden Geschossen, steiles Ziegeldach, Fenster
     mit Blumenkästen (Geranien). Davor der kleine Plönleinbrunnen.
   - RECHTS geht es geradeaus und leicht bergauf zum SIEBERSTURM (1385),
     einem Torturm der zweiten Stadterweiterung: quadratisch, unten die
     spitzbogige Tordurchfahrt, steiles Ziegeldach mit Knauf und
     Wetterfahne. Die Gasse dahinter führt zum Spital.
   - LINKS fällt die Kobolzeller Steige steil ab zum KOBOLZELLER TOR
     (1360) mit Turm und Zwinger; dahinter das grüne Taubertal.
   - STADTMAUER: rund 3,4 km, davon über 2 km mit überdachtem WEHRGANG
     (Holzstützen, Ziegeldach, Schießscharten) — man kann fast um die
     ganze Altstadt laufen.
   - Typisch: Fachwerk, Fensterläden, Blumenkästen, Kopfsteinpflaster,
     schmiedeeiserne Wirtshausschilder (Ausleger), der NACHTWÄCHTER mit
     schwarzem Umhang, Schlapphut, Hellebarde und Laterne (Führung jeden
     Abend), ROTHENBURGER SCHNEEBALLEN (Mürbeteigstreifen, zur Kugel
     geformt, gebacken, mit Puderzucker oder Schokolade) in den
     Bäckereien, Weihnachtsschmuck das ganze Jahr in den Schaufenstern.
   Perspektive: ein Fluchtpunkt (272 | 158) in Richtung Siebersturm;
   Augenhöhe 1,65 m; 210 Einheiten Brennweite (Haus am Plönlein in 22 m
   ≈ 9,5 je Meter, Siebersturm in 45 m ≈ 4,7 je Meter, Nachtwächter in
   6,2 m ≈ 34 je Meter). Die Gasse zum Siebersturm steigt um 1,6 m.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "rothenburg", titel: "Rothenburg ob der Tauber", emoji: "🏘️", thema: "Deutschland", kuerzel: "rtb", fassung: 854, breite: 400, hoehe: 260 });
const rnd = zufall(1274);
const r = B.r;

/* ---------- Perspektive ------------------------------------------- */
const VPX = 272, HOR = 158, F = 210, EYE = 1.65;
const anstieg = (d) => (d <= 22 ? 0 : Math.min(1.6, (d - 22) * 0.07));
/* Punkt in der Welt: L quer (m, + rechts), d Abstand (m), h Höhe über Boden (m) */
const P = (L, d, h) => [VPX + L * F / d, HOR - (h + anstieg(d) - EYE) * F / d];
const pt = (q) => `${r(q[0])} ${r(q[1])}`;
const poly = (...qs) => "M" + qs.map(pt).join(" L") + " Z";

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("glimm")}" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="2.2"/></filter>`);
S.def(`<filter id="${S.id("dunst")}" x="-20%" y="-60%" width="140%" height="220%"><feGaussianBlur stdDeviation="1.1"/></filter>`);

/* ---------- Stoffe ------------------------------------------------- */
const BALKEN = "#5e2a1c", BALKEN_L = "#7a3a26";
const ZIEGEL = S.lg("ziegel", [[0, "#b75a3a"], [1, "#8d3d26"]]);
const GLAS = S.lg("glas", [[0, "#55667a"], [1, "#2c3644"]]);
const GLAS_LICHT = S.lg("glaslicht", [[0, "#ffe9a8"], [1, "#f2b35a"]]);
const GOLD = S.lg("gold", [[0, "#f6dd84"], [1, "#b48a2c"]]);
const SANDSTEIN = S.lg("sandstein", [[0, "#dcc5a0"], [1, "#bfa47c"]]);
const EISEN = "#24221f";
S.def(`<pattern id="${S.id("dachz")}" width="2.4" height="1.6" patternUnits="userSpaceOnUse"><rect width="2.4" height="1.6" fill="#a54a2e"/><path d="M0 1.55 H2.4" stroke="#6e2a18" stroke-width=".35"/><path d="M0 0 Q1.2 1 2.4 0" stroke="#c4664a" stroke-width=".25" fill="none"/></pattern>`);
const DACHZ = `url(#${S.id("dachz")})`;
S.def(`<pattern id="${S.id("quader")}" width="4" height="1.8" patternUnits="userSpaceOnUse"><path d="M0 1.75 H4 M2 0 V.9 M0 .9 H4 M0 .9 V1.8" stroke="#8e7656" stroke-width=".14" fill="none"/></pattern>`);
const QUADER = `url(#${S.id("quader")})`;

/* Fenster in einer Fassade (Viereck aus vier Punkten), mit Sprossen und Rahmen */
function fensterQ(a, b, c, d, opt = {}) {
  /* a oben links, b oben rechts, c unten rechts, d unten links */
  let g = `<path d="${poly(a, b, c, d)}" fill="${opt.licht ? GLAS_LICHT : GLAS}" stroke="${opt.rahmen || "#f4efe4"}" stroke-width="${opt.rb || 0.5}"/>`;
  const m1 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], m2 = [(d[0] + c[0]) / 2, (d[1] + c[1]) / 2];
  const l1 = [(a[0] + d[0]) / 2, (a[1] + d[1]) / 2], l2 = [(b[0] + c[0]) / 2, (b[1] + c[1]) / 2];
  g += `<path d="M${pt(m1)} L${pt(m2)} M${pt(l1)} L${pt(l2)}" stroke="${opt.rahmen || "#f4efe4"}" stroke-width="${r((opt.rb || 0.5) * 0.6)}"/>`;
  if (!opt.licht) g += `<path d="M${pt(d)} L${pt([(a[0] + m1[0]) / 2, (a[1] + m1[1]) / 2])}" stroke="#fff" stroke-width=".3" opacity=".25"/>`;
  return g;
}
/* Blumenkasten mit Geranien unter einem Fenster (d unten links, c unten rechts) */
function blumen(d, c, s = 1) {
  const w = c[0] - d[0];
  let g = `<path d="M${r(d[0] - 0.4 * s)} ${r(d[1] + 0.2)} L${r(c[0] + 0.4 * s)} ${r(c[1] + 0.2)} L${r(c[0] + 0.2 * s)} ${r(c[1] + 1.6 * s)} L${r(d[0] - 0.2 * s)} ${r(d[1] + 1.6 * s)} Z" fill="#6b4a2e"/>`;
  for (let i = 0; i < Math.max(3, Math.round(w / (1.2 * s))); i++) {
    const t = (i + 0.5) / Math.max(3, Math.round(w / (1.2 * s))), x = d[0] + (c[0] - d[0]) * t, y = d[1] + (c[1] - d[1]) * t;
    g += `<circle cx="${r(x)}" cy="${r(y - 0.3 * s)}" r="${r(0.75 * s)}" fill="#3f6e2e"/><circle cx="${r(x + (rnd() - 0.5) * s)}" cy="${r(y - 0.9 * s)}" r="${r(0.55 * s)}" fill="${rnd() < 0.75 ? "#d6283a" : "#f2557a"}"/>`;
  }
  return g;
}

/* =====================================================================
   KULISSE — Abendhimmel, Taubertal, die Häuser der Gasse
   ===================================================================== */
S.hinten(`<rect y="-20" width="400" height="220" fill="${S.lg("himmel", [[0, "#3f6aa8"], [0.45, "#87a9cf"], [0.8, "#efd2a6"], [1, "#f6dcae"]])}"/>`);
{
  let c = "";
  for (const [x, y, w, o] of [[150, 22, 46, 0.8], [196, 12, 30, 0.6], [120, 40, 36, 0.55], [230, 34, 24, 0.5]]) {
    c += `<ellipse cx="${x}" cy="${y}" rx="${w / 2}" ry="${r(w * 0.07)}" fill="#f7c9a6" opacity="${o}"/><ellipse cx="${x - 4}" cy="${y - 1}" rx="${w / 3}" ry="${r(w * 0.05)}" fill="#ffe6c8" opacity="${o}"/>`;
  }
  S.hinten(`<g filter="url(#${S.id("dunst")})">${c}</g>`);
}
/* Taubertal hinter dem Kobolzeller Tor: bewaldeter Gegenhang im Abenddunst */
{
  let c = `<path d="M70 156 Q96 142 124 146 Q146 140 166 148 L166 190 L70 190 Z" fill="${S.lg("tal", [[0, "#8aa07a"], [1, "#5f7a52"]])}"/>`;
  for (let i = 0; i < 60; i++) { const x = 72 + rnd() * 92, y = 146 + rnd() * 34; c += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(1.6 + rnd() * 1.6)}" ry="${r(1.2 + rnd())}" fill="${["#6f8a5c", "#7f9a66", "#5d7650", "#8faa72"][i % 4]}"/>`; }
  c += `<path d="M70 150 Q110 140 166 146 L166 190 L70 190 Z" fill="${S.lg("taldunst", [[0, "#f3d9b0", 0.45], [1, "#f3d9b0", 0.1]])}"/>`;
  /* Dächer der Häuser an der Steige, tiefer unten */
  for (const [x, y, w] of [[88, 176, 14], [102, 178, 12], [140, 177, 13], [154, 179, 10]]) c += `<path d="M${x} ${y} L${x + w / 2} ${y - 6} L${x + w} ${y} Z" fill="${ZIEGEL}"/><path d="M${x + w / 2} ${y - 6} L${x + w} ${y} L${x + w * 0.6} ${y} Z" fill="#000" opacity=".15"/>`;
  S.hinten(c);
}

/* --- Häuser rechts (Ostseite der Gasse, im Schatten): Giebel zur Gasse --- */
const RECHTS = [
  { d0: 5.4, d1: 9.6, traufe: 9.5, first: 14, putz: "#d9a49a", fw: true },
  { d0: 9.6, d1: 14.4, traufe: 10, first: 15, putz: "#e9e1d0", fw: false, laden: true },
  { d0: 14.4, d1: 21, traufe: 11, first: 16.4, putz: "#e6c17e", fw: true },
  { d0: 21, d1: 30, traufe: 10.4, first: 15.6, putz: "#c9cfd2", fw: false },
  { d0: 30, d1: 44, traufe: 11.4, first: 17, putz: "#ead9b8", fw: true },
];
{
  let c = "";
  const L = 4;
  for (const h of RECHTS.slice().reverse()) {
    const dm = (h.d0 + h.d1) / 2;
    const umr = [P(L, h.d0, 0), P(L, h.d0, h.traufe), P(L, dm, h.first), P(L, h.d1, h.traufe), P(L, h.d1, 0)];
    c += `<path d="${poly(...umr)}" fill="${h.putz}"/>`;
    /* Ortgang (Ziegel) am Giebel */
    c += `<path d="M${pt(P(L, h.d0, h.traufe - 0.2))} L${pt(P(L, dm, h.first + 0.4))} L${pt(P(L, h.d1, h.traufe - 0.2))}" stroke="#8d3d26" stroke-width="${r(1.6 * 10 / dm)}" fill="none" stroke-linejoin="round"/>`;
    /* Fachwerk in den Obergeschossen */
    if (h.fw) {
      let p = "";
      for (const hh of [3.2, 6, 8.8]) p += `M${pt(P(L, h.d0, hh))} L${pt(P(L, h.d1, hh))} `;
      const n = 5;
      for (let i = 0; i <= n; i++) { const d = h.d0 + (h.d1 - h.d0) * i / n; p += `M${pt(P(L, d, 3.2))} L${pt(P(L, d, h.traufe))} `; }
      for (let i = 0; i < n; i += 2) { const da = h.d0 + (h.d1 - h.d0) * i / n, db = h.d0 + (h.d1 - h.d0) * (i + 1) / n; p += `M${pt(P(L, da, 3.2))} L${pt(P(L, db, 6))} M${pt(P(L, db, 6))} L${pt(P(L, da, 8.8))} `; }
      c += `<path d="${p}" stroke="${BALKEN}" stroke-width="${r(0.9 * 10 / dm)}" fill="none"/>`;
    }
    /* Fenster der Obergeschosse */
    for (const [ha, hb] of [[3.9, 5.3], [6.7, 8.1], [h.traufe + 1, h.traufe + 2.2]]) {
      const k = hb > h.traufe ? 1 : 3;
      for (let i = 0; i < k; i++) {
        const t0 = k === 1 ? 0.42 : 0.12 + i * 0.3, t1 = t0 + (k === 1 ? 0.16 : 0.16);
        const da = h.d0 + (h.d1 - h.d0) * t0, db = h.d0 + (h.d1 - h.d0) * t1;
        c += fensterQ(P(L, da, hb), P(L, db, hb), P(L, db, ha), P(L, da, ha), { rb: r(0.5 * 10 / dm) });
        if (hb < h.traufe && i === 1) c += blumen(P(L, da, ha), P(L, db, ha), r(10 / dm));
      }
    }
    /* Erdgeschoss: Haustür und Fenster (der Laden im zweiten Haus ist ein eigenes Teil) */
    if (!h.laden) {
      const ta = h.d0 + (h.d1 - h.d0) * 0.6, tb = h.d0 + (h.d1 - h.d0) * 0.78;
      c += `<path d="${poly(P(L, ta, 2.2), P(L, tb, 2.2), P(L, tb, 0), P(L, ta, 0))}" fill="#5a3a24"/>`;
      c += fensterQ(P(L, h.d0 + (h.d1 - h.d0) * 0.15, 2.2), P(L, h.d0 + (h.d1 - h.d0) * 0.4, 2.2), P(L, h.d0 + (h.d1 - h.d0) * 0.4, 0.9), P(L, h.d0 + (h.d1 - h.d0) * 0.15, 0.9), { rb: r(0.5 * 10 / dm) });
    }
    /* Sockel */
    c += `<path d="${poly(P(L, h.d0, 0.5), P(L, h.d1, 0.5), P(L, h.d1, 0), P(L, h.d0, 0))}" fill="#9a8a72"/>`;
    c += `<path d="M${pt(P(L, h.d0, 0))} L${pt(P(L, h.d0, h.traufe))}" stroke="#000" stroke-width=".4" opacity=".25"/>`;
  }
  /* Schatten: die Ostseite liegt am Abend im Schatten (kühl) */
  for (const h of RECHTS) { const dm = (h.d0 + h.d1) / 2; c += `<path d="${poly(P(L, h.d0, 0), P(L, h.d0, h.traufe), P(L, dm, h.first), P(L, h.d1, h.traufe), P(L, h.d1, 0))}" fill="${S.lg("schattenrechts", [[0, "#2e3a5a", 0.3], [1, "#2e3a5a", 0.16]], 0, 0, 1, 0)}"/>`; }
  /* Wandlaterne (brennt schon) am ersten Haus */
  const la = P(L, 8.4, 3.6);
  c += `<path d="M${pt(P(L, 8.4, 3.9))} L${r(la[0] - 4)} ${r(la[1] - 1)}" stroke="${EISEN}" stroke-width=".6"/>`;
  c += `<circle cx="${r(la[0] - 4.4)}" cy="${r(la[1] + 2.6)}" r="6" fill="#ffd27a" opacity=".45" filter="url(#${S.id("glimm")})"/>`;
  c += `<path d="M${r(la[0] - 6)} ${r(la[1])} L${r(la[0] - 2.8)} ${r(la[1])} L${r(la[0] - 3.2)} ${r(la[1] + 4.4)} L${r(la[0] - 5.6)} ${r(la[1] + 4.4)} Z" fill="#ffe7a2" stroke="${EISEN}" stroke-width=".5"/><path d="M${r(la[0] - 6.4)} ${r(la[1])} L${r(la[0] - 4.4)} ${r(la[1] - 1.6)} L${r(la[0] - 2.4)} ${r(la[1])} Z" fill="${EISEN}"/>`;
  S.hinten(c);
}

/* --- Haus links vorn (Westseite der Gasse, in der Abendsonne): Bäckerei im
       Erdgeschoss, darüber Fachwerk — die Hauswand reicht über den Bildrand --- */
const LL = -8;
{
  let c = "";
  const d0 = 5.6, d1 = 9;
  c += `<path d="${poly(P(LL, d0, 22), P(LL, d1, 22), P(LL, d1, 0), P(LL, d0, 0))}" fill="${S.lg("linkshaus", [[0, "#f3dcae"], [1, "#e9c88e"]], 0, 0, 1, 0)}"/>`;
  /* Fachwerk über dem Erdgeschoss: Schwellen, Ständer, Streben (Mann-Figur) */
  let p = "";
  for (const hh of [3.3, 3.55, 6.3, 6.55, 9.3]) p += `M${pt(P(LL, d0, hh))} L${pt(P(LL, d1, hh))} `;
  const n = 6;
  for (let i = 0; i <= n; i++) { const d = d0 + (d1 - d0) * i / n; p += `M${pt(P(LL, d, 3.55))} L${pt(P(LL, d, 6.3))} M${pt(P(LL, d, 6.55))} L${pt(P(LL, d, 9.3))} `; }
  for (let i = 1; i < n; i += 2) { const da = d0 + (d1 - d0) * (i - 1) / n, dm = d0 + (d1 - d0) * i / n, db = d0 + (d1 - d0) * (i + 1) / n; p += `M${pt(P(LL, da, 3.55))} L${pt(P(LL, dm, 5.2))} L${pt(P(LL, db, 3.55))} M${pt(P(LL, da, 6.55))} L${pt(P(LL, dm, 8.2))} L${pt(P(LL, db, 6.55))} `; }
  c += `<path d="${p}" stroke="${BALKEN}" stroke-width="2.2" fill="none"/>`;
  /* Fenster im ersten Stock (mit Blumenkasten) — das zweite hat Läden (eigenes Teil) */
  for (const [ta, tb] of [[0.2, 0.33], [0.7, 0.83]]) {
    const da = d0 + (d1 - d0) * ta, db = d0 + (d1 - d0) * tb;
    c += fensterQ(P(LL, da, 5.6), P(LL, db, 5.6), P(LL, db, 4.2), P(LL, da, 4.2), { rb: 1.1 });
    c += blumen(P(LL, da, 4.2), P(LL, db, 4.2), 2.2);
  }
  for (const [ta, tb] of [[0.2, 0.33], [0.45, 0.58], [0.7, 0.83]]) {
    const da = d0 + (d1 - d0) * ta, db = d0 + (d1 - d0) * tb;
    c += fensterQ(P(LL, da, 8.6), P(LL, db, 8.6), P(LL, db, 7.2), P(LL, da, 7.2), { rb: 1.1 });
  }
  /* Erdgeschoss: Sandsteinsockel, Ladenfassade (Teil „Bäckerei“ zeichnet Fenster und Schild) */
  c += `<path d="${poly(P(LL, d0, 0.5), P(LL, d1, 0.5), P(LL, d1, 0), P(LL, d0, 0))}" fill="#a8916c"/>`;
  /* Hauskante zum Plönlein (Eckquader) */
  for (let i = 0; i < 9; i++) { const a = P(LL, d1, i * 1.1), b = P(LL, d1, i * 1.1 + 0.9); c += `<path d="M${r(a[0] - 2.4)} ${r(a[1])} L${r(a[0])} ${r(a[1])} L${r(b[0])} ${r(b[1])} L${r(b[0] - 2.4)} ${r(b[1])} Z" fill="#d8c19a" opacity=".8"/>`; }
  /* Abendsonne: oben warmes Licht, unten liegt die Wand schon im Schatten der Häuser gegenüber */
  c += `<path d="${poly(P(LL, d0, 22), P(LL, d1, 22), P(LL, d1, 5.4), P(LL, d0, 6.6))}" fill="${S.lg("abendwand", [[0, "#ff9a3c", 0.1], [0.6, "#ffb45a", 0.2], [1, "#ffcf7a", 0.12]])}"/>`;
  c += `<path d="${poly(P(LL, d0, 6.6), P(LL, d1, 5.4), P(LL, d1, 0), P(LL, d0, 0))}" fill="#23304e" opacity=".22"/>`;
  c += `<path d="M${pt(P(LL, d0, 6.6))} L${pt(P(LL, d1, 5.4))}" stroke="#ffcf8a" stroke-width="1.2" opacity=".35"/>`;
  S.hinten(c);
}

const KT = { x: 128, s: 3 };          /* Mitte, Einheiten je Meter (≈ 70 m entfernt) */
const ky = (h) => HOR - (h - 12 - EYE) * KT.s;
/* =====================================================================
   3 — DIE STADTMAUER mit überdachtem Wehrgang (Lupe: der Wehrgang,
       die Schießscharte)
   ===================================================================== */
{
  let k = "";
  const mauer = (x0, x1, y0, y1) => {
    /* y0 Oberkante der Mauer links, y1 rechts (leicht fallend zur Steige) */
    let g = `<path d="M${x0} ${y0} L${x1} ${y1} L${x1} 182 L${x0} 182 Z" fill="${S.lg("mauer", [[0, "#d6c29e"], [1, "#b49a72"]])}"/>`;
    g += `<path d="M${x0} ${y0} L${x1} ${y1} L${x1} 182 L${x0} 182 Z" fill="${QUADER}" opacity=".8"/>`;
    /* Schießscharten */
    for (let x = x0 + 3; x < x1 - 2; x += 7) { const y = y0 + (y1 - y0) * (x - x0) / (x1 - x0); g += `<rect x="${r(x)}" y="${r(y + 3.4)}" width=".8" height="2.6" fill="#2e261e"/>`; }
    /* Wehrgang: Holzstützen, Brüstung, Ziegeldach */
    const dy = -4.6;
    g += `<path d="M${x0} ${r(y0 + dy)} L${x1} ${r(y1 + dy)} L${x1} ${r(y1 + dy + 1.6)} L${x0} ${r(y0 + dy + 1.6)} Z" fill="#3a2a1e"/>`;
    for (let x = x0 + 1; x <= x1 - 0.5; x += 3.4) { const y = y0 + (y1 - y0) * (x - x0) / (x1 - x0); g += `<rect x="${r(x)}" y="${r(y + dy + 1.4)}" width=".6" height="${r(-dy - 1.2)}" fill="#6a4a2e"/>`; }
    g += `<path d="M${x0 - 1} ${r(y0 + dy + 0.2)} L${x1 + 1} ${r(y1 + dy + 0.2)} L${x1 + 0.4} ${r(y1 + dy - 2.6)} L${x0 - 0.4} ${r(y0 + dy - 2.6)} Z" fill="${DACHZ}"/>`;
    g += `<path d="M${x0 - 1} ${r(y0 + dy + 0.2)} L${x1 + 1} ${r(y1 + dy + 0.2)}" stroke="#6e2a18" stroke-width=".5"/>`;
    return g;
  };
  k += mauer(86, KT.x - 9.6 - 8, 168.6, 170.4) + mauer(KT.x + 9.6, 156, 166.6, 169.6);
  const MX = 86, MY = 148;
  S.teil({ id: "stadtmauer", de: "die Stadtmauer", syl: "STADT-mau-er", it: "le mura", itSyl: "MU-ra", en: "town wall", x: 0, y: 0, kunst: k,
    tipp: "Auf dem überdachten Wehrgang kann man fast um die ganze Altstadt laufen.",
    zoom: { x: MX, y: MY, w: 72, h: 48 },
    unter: [
      { id: "wehrgang", de: "der Wehrgang", syl: "WEHR-gang", it: "il camminamento di ronda", itSyl: "cam-mi-na-MEN-to di RON-da", en: "wall walk", x: 146, y: 165, kunst: flaeche(-8, -5, 12, 5.4),
        tipp: "Auf dem Wehrgang liefen früher die Wächter um die Stadt." },
      { id: "schiessscharte", de: "die Schießscharte", syl: "SCHIESS-schar-te", it: "la feritoia", itSyl: "fe-ri-TO-ia", en: "arrow slit", x: 101, y: 175, kunst: flaeche(-5, -3, 10, 6),
        tipp: "Durch die schmalen Schießscharten schossen die Verteidiger." },
    ] });
}

/* =====================================================================
   2 — DAS KOBOLZELLER TOR (unten links, am Ende der Steige)
   ===================================================================== */
{
  let k = "";
  const w = 6.4 * KT.s;
  /* Turmschaft (Bruchstein, hell) mit kleinen Fenstern, Spitzbogen-Durchgang unten */
  k += `<rect x="${r(KT.x - w / 2)}" y="${r(ky(19))}" width="${r(w)}" height="${r(ky(4) - ky(19))}" fill="${SANDSTEIN}"/>`;
  k += `<rect x="${r(KT.x - w / 2)}" y="${r(ky(19))}" width="${r(w)}" height="${r(ky(4) - ky(19))}" fill="${QUADER}" opacity=".7"/>`;
  k += `<rect x="${r(KT.x + w / 2 - 4)}" y="${r(ky(19))}" width="4" height="${r(ky(4) - ky(19))}" fill="#000" opacity=".12"/>`;
  for (const h of [9, 13.5, 17]) k += `<rect x="${r(KT.x - 1)}" y="${r(ky(h + 1.2))}" width="2" height="${r(1.2 * KT.s)}" fill="#3a3028"/>`;
  k += `<rect x="${r(KT.x - w / 2 - 0.6)}" y="${r(ky(19.2))}" width="${r(w + 1.2)}" height="1" fill="#cbb48e"/>`;
  /* steiles Zeltdach mit Knauf */
  k += `<path d="M${r(KT.x - w / 2 - 1.4)} ${r(ky(19))} L${r(KT.x)} ${r(ky(28))} L${r(KT.x + w / 2 + 1.4)} ${r(ky(19))} Z" fill="${DACHZ}"/>`;
  k += `<path d="M${r(KT.x)} ${r(ky(28))} L${r(KT.x + w / 2 + 1.4)} ${r(ky(19))} L${r(KT.x + 2)} ${r(ky(19))} Z" fill="#000" opacity=".18"/>`;
  k += `<line x1="${KT.x}" y1="${r(ky(28))}" x2="${KT.x}" y2="${r(ky(30))}" stroke="#5a4a2a" stroke-width=".35"/><circle cx="${KT.x}" cy="${r(ky(28.9))}" r=".6" fill="${GOLD}"/>`;
  /* Vortor mit Spitzbogen (zur Feldseite), halb verdeckt */
  k += `<rect x="${r(KT.x - w / 2 - 8)}" y="${r(ky(9))}" width="8" height="${r(ky(4) - ky(9))}" fill="${SANDSTEIN}"/><path d="M${r(KT.x - w / 2 - 8.6)} ${r(ky(9))} L${r(KT.x - w / 2 - 4)} ${r(ky(12.6))} L${r(KT.x - w / 2 + 0.6)} ${r(ky(9))} Z" fill="${DACHZ}"/>`;
  /* Dächer der Häuser an der Steige (tiefer unten) verdecken den Turmfuß */
  for (const [x, y, w] of [[90, 178, 18], [106, 180, 16], [116, 177, 22], [136, 179, 18], [148, 181, 12]]) {
    k += `<path d="M${x} ${y + 3} L${x + 2} ${y - 4} L${x + w - 2} ${y - 4} L${x + w} ${y + 3} Z" fill="${DACHZ}"/><path d="M${x + 2} ${y - 4} L${x + w - 2} ${y - 4}" stroke="#6e2a18" stroke-width=".6"/>`;
    k += `<rect x="${x + w * 0.7}" y="${y - 7}" width="1.6" height="3.4" fill="#8a5a42"/>`;
  }
  S.teil({ id: "kobolzellertor", de: "das Kobolzeller Tor", syl: "KO-bol-zel-ler TOR", it: "la porta Kobolzell", itSyl: "POR-ta KO-bol-zell", en: "Kobolzell Gate", x: 0, y: 0, kunst: k,
    tipp: "Durch das Kobolzeller Tor (1360) geht es steil hinunter ins Taubertal." });
}

/* =====================================================================
   1 — DAS KOPFSTEINPFLASTER (Gasse und Plönlein)
   ===================================================================== */
S.def(`<pattern id="${S.id("pfl")}" width="6" height="4" patternUnits="userSpaceOnUse"><rect width="6" height="4" fill="#6f6558"/><rect x=".3" y=".3" width="2.5" height="1.5" rx=".7" fill="#a59682"/><rect x="3.2" y=".3" width="2.5" height="1.5" rx=".7" fill="#b3a48e"/><rect x="-1.2" y="2.2" width="2.5" height="1.5" rx=".7" fill="#9c8d79"/><rect x="1.7" y="2.2" width="2.5" height="1.5" rx=".7" fill="#ad9e88"/><rect x="4.6" y="2.2" width="2.5" height="1.5" rx=".7" fill="#a29380"/></pattern>`);
const DY = 16;   /* das ganze Bild sitzt 16 Einheiten tiefer: weniger leere Gasse, mehr Himmel */
const PFLASTER = [[0, 262 - DY], P(LL, 6.18, 0), P(LL, 6.6, 0), P(LL, 9, 0), [85, 180], [156, 177], P(-12, 22, 0), P(-3, 22, 0), P(-3, 34, 0), P(-3.5, 45, 0), P(3.5, 45, 0), P(4, 44, 0), P(4, 6.4, 0), [400, 262 - DY]];
{
  let k = `<path d="${poly(...PFLASTER)}" fill="#8a7d6c"/>`;
  const baender = [[HOR, 168, 0.35], [168, 178, 0.5], [178, 192, 0.7], [192, 210, 1], [210, 228, 1.4], [228, 262 - DY, 1.9]];
  S.def(`<clipPath id="${S.id("pflclip")}"><path d="${poly(...PFLASTER)}"/></clipPath>`);
  let b = "";
  baender.forEach(([a, e, s], i) => {
    S.def(`<pattern id="${S.id("pfl" + i)}" href="#${S.id("pfl")}" patternTransform="translate(${VPX} 0) scale(${s} ${s * 0.75})"/>`);
    b += `<rect x="0" y="${a}" width="400" height="${e - a}" fill="url(#${S.id("pfl" + i)})"/>`;
  });
  k += `<g clip-path="url(#${S.id("pflclip")})">${b}`;
  /* Laufplatten aus Granit (zwei Bahnen, wie in vielen Altstadtgassen) mit Fugen */
  for (const [La, Lb] of [[-4.6, -3.6], [2.2, 3.2]]) {
    /* nahes Ende am Bildrand abschneiden (keine Fläche außerhalb des Bildes) */
    const dRand = (L) => (L > 0 ? L * F / (399 - VPX) : 4.2);
    const nahA = La > 0 ? P(La, Math.max(dRand(La), 4.05), 0) : P(La, 4.2, 0), nahB = Lb > 0 ? P(Lb, dRand(Lb), 0) : P(Lb, 4.2, 0);
    k += `<path d="${poly(nahA, ...(La > 0 ? [[399, nahA[1]], [399, nahB[1]]] : []), nahB, P(Lb, 22, 0), P(La, 22, 0))}" fill="${S.lg("platte" + La, [[0, "#b9ad99"], [1, "#a39782"]])}"/>`;
    let f = "";
    for (let d = Math.max(4.6, dRand(Lb) + 0.1); d < 22; d *= 1.09) f += `M${pt(P(La, d, 0))} L${pt(P(Lb, d, 0))} `;
    k += `<path d="${f}" stroke="#6f6658" stroke-width=".35"/><path d="M${pt(nahA)} L${pt(P(La, 22, 0))} M${pt(nahB)} L${pt(P(Lb, 22, 0))}" stroke="#5e554a" stroke-width=".5"/>`;
  }
  /* Kanaldeckel (Gusseisen) und Moos in den Fugen am Hausrand */
  { const [x, y] = P(-0.6, 7.4, 0), s2 = F / 7.4; k += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(0.32 * s2)}" ry="${r(0.07 * s2)}" fill="#3e3a34" stroke="#7a7266" stroke-width=".4"/><path d="M${r(x - 0.24 * s2)} ${r(y)} h${r(0.48 * s2)} M${r(x)} ${r(y - 0.05 * s2)} v${r(0.1 * s2)}" stroke="#5a554c" stroke-width=".4"/>`; }
  for (let i = 0; i < 26; i++) { const d = 6.4 + rnd() * 9, L = rnd() < 0.5 ? -7.7 : 3.7; const [x, y] = P(L, d, 0); k += `<ellipse cx="${r(x)}" cy="${r(y - 0.3)}" rx="${r(0.6 + rnd())}" ry=".35" fill="#6f7a4a" opacity=".55"/>`; }
  /* Rinne in der Mitte der Gasse, Abendlicht von rechts, Glanz */
  k += `<path d="M${VPX - 6} ${262 - DY} L${VPX - 1} 166 L${VPX + 1} 166 L${VPX + 10} ${262 - DY} Z" fill="#5b5248" opacity=".25"/>`;
  k += `<rect y="${HOR - 2}" width="400" height="${262 - DY - HOR + 2}" fill="${S.lg("pfllicht", [[0, "#ffdca0", 0.28], [0.3, "#ffdca0", 0.04], [1, "#1c2540", 0.3]])}"/>`;
  k += `<path d="M150 178 Q200 172 262 168 L286 168 L330 176 Q240 186 150 182 Z" fill="#ffcf8a" opacity=".16"/></g>`;
  S.teil({ id: "pflaster", de: "das Kopfsteinpflaster", syl: "KOPF-stein-pflas-ter", it: "il selciato", itSyl: "sel-CIA-to", en: "cobblestones", x: 0, y: 0, kunst: k,
    tipp: "Die Gassen der Altstadt sind mit Kopfsteinpflaster belegt." });
}

/* =====================================================================
   4 — DER SIEBERSTURM (1385) am Ende der Gasse — Lupe: das Dach, die
       Wetterfahne; 5 — DER TORBOGEN (die Durchfahrt)
   ===================================================================== */
const ST = { d: 45, L0: -3.5, L1: 3.5, traufe: 24, spitze: 33 };
{
  const s = F / ST.d;
  const [xl, yb] = P(ST.L0, ST.d, 0), [xr] = P(ST.L1, ST.d, 0), [, yt] = P(0, ST.d, ST.traufe), [, ys] = P(0, ST.d, ST.spitze);
  let k = "";
  /* Schaft: unten Buckelquader, oben verputzt */
  k += `<rect x="${r(xl)}" y="${r(yt)}" width="${r(xr - xl)}" height="${r(yb - yt)}" fill="${S.lg("sieber", [[0, "#e6cfa6"], [0.6, "#d8bd91"], [1, "#c7a97a"]])}"/>`;
  k += `<rect x="${r(xl)}" y="${r(P(0, ST.d, 9)[1])}" width="${r(xr - xl)}" height="${r(yb - P(0, ST.d, 9)[1])}" fill="${QUADER}"/>`;
  for (let h = 0.4; h < ST.traufe - 0.6; h += 1.3) { const a = P(ST.L0, ST.d, h), b = P(ST.L0, ST.d, h + 1.1), c2 = P(ST.L1, ST.d, h), d2 = P(ST.L1, ST.d, h + 1.1), w2 = (Math.round(h / 1.3) % 2 ? 0.9 : 1.5) * s; k += `<rect x="${r(a[0])}" y="${r(b[1])}" width="${r(w2)}" height="${r(a[1] - b[1] - 0.3)}" fill="#e9d8b6" opacity=".7"/><rect x="${r(c2[0] - w2)}" y="${r(d2[1])}" width="${r(w2)}" height="${r(c2[1] - d2[1] - 0.3)}" fill="#f2deb4" opacity=".7"/>`; }
  for (let i = 0; i < 40; i++) k += `<circle cx="${r(xl + 2 + rnd() * (xr - xl - 4))}" cy="${r(yt + 2 + rnd() * (P(0, ST.d, 9)[1] - yt - 4))}" r="${r(0.2 + rnd() * 0.3)}" fill="${rnd() < 0.5 ? "#c9b08a" : "#efe0c2"}" opacity=".6"/>`;
  k += `<rect x="${r(xr - 4)}" y="${r(yt)}" width="4" height="${r(yb - yt)}" fill="#ffd28a" opacity=".28"/>`;
  k += `<rect x="${r(xl)}" y="${r(yt)}" width="5" height="${r(yb - yt)}" fill="#2e3a5a" opacity=".12"/>`;
  /* Fenster: kleine Rechtecke in den Geschossen, oben ein Erkerchen */
  for (const [h, n] of [[10.5, 1], [14, 2], [17.5, 2], [21, 3]]) {
    for (let i = 0; i < n; i++) {
      const L = n === 1 ? 0 : -1.6 + i * (3.2 / (n - 1));
      const a = P(L - 0.45, ST.d, h + 1.3), c = P(L + 0.45, ST.d, h);
      k += `<rect x="${r(a[0])}" y="${r(a[1])}" width="${r(c[0] - a[0])}" height="${r(c[1] - a[1])}" fill="#3a3028" stroke="#efe2c6" stroke-width=".35"/>`;
    }
  }
  /* Uhr? Nein — das Wappen der Stadt (rote Burg auf Weiß) über dem Tor */
  { const [wx, wy] = P(0, ST.d, 8); k += `<path d="M${r(wx - 2)} ${r(wy - 2.6)} h4 v2.6 q0 1.8 -2 2.6 q-2 -.8 -2 -2.6 Z" fill="#f4efe4" stroke="#8a6a3a" stroke-width=".2"/><path d="M${r(wx - 1.3)} ${r(wy + 0.6)} v-2 h.6 v.6 h.4 v-.6 h.6 v.6 h.4 v-.6 h.6 v2 Z" fill="#b8282e"/>`; }
  /* Gesims und steiles Zeltdach mit Gauben, Knauf, Wetterfahne */
  k += `<rect x="${r(xl - 1)}" y="${r(yt - 1.2)}" width="${r(xr - xl + 2)}" height="1.4" fill="#cbb48e"/>`;
  const [xm] = P(0, ST.d, 0);
  k += `<path d="M${r(xl - 2)} ${r(yt)} L${r(xm)} ${r(ys)} L${r(xr + 2)} ${r(yt)} Z" fill="${DACHZ}"/>`;
  k += `<path d="M${r(xm)} ${r(ys)} L${r(xr + 2)} ${r(yt)} L${r(xm + 3)} ${r(yt)} Z" fill="#ffb060" opacity=".18"/>`;
  k += `<path d="M${r(xm)} ${r(ys)} L${r(xl - 2)} ${r(yt)} L${r(xm - 4)} ${r(yt)} Z" fill="#000" opacity=".15"/>`;
  for (const [L, h] of [[-1.2, 26.4], [1.4, 26.4], [0.1, 29.4]]) { const [gx, gy] = P(L, ST.d, h); k += `<path d="M${r(gx - 1.6)} ${r(gy + 2.6)} L${r(gx - 1.6)} ${r(gy + 0.6)} L${r(gx)} ${r(gy - 0.8)} L${r(gx + 1.6)} ${r(gy + 0.6)} L${r(gx + 1.6)} ${r(gy + 2.6)} Z" fill="#a54a2e"/><rect x="${r(gx - 0.7)}" y="${r(gy + 0.8)}" width="1.4" height="1.6" fill="#3a3028"/>`; }
  k += `<line x1="${r(xm)}" y1="${r(ys)}" x2="${r(xm)}" y2="${r(ys - 9)}" stroke="#4a3a1a" stroke-width=".5"/><circle cx="${r(xm)}" cy="${r(ys - 2.6)}" r="1.1" fill="${GOLD}"/>`;
  k += `<path d="M${r(xm)} ${r(ys - 8.6)} L${r(xm + 5)} ${r(ys - 7.6)} L${r(xm + 4)} ${r(ys - 6.4)} L${r(xm)} ${r(ys - 6.6)} Z" fill="${GOLD}"/><path d="M${r(xm - 1.6)} ${r(ys - 5.4)} h3.2" stroke="#4a3a1a" stroke-width=".3"/>`;
  S.teil({ id: "siebersturm", de: "der Siebersturm", syl: "SIE-bers-turm", it: "la torre Sieber", itSyl: "TOR-re SIE-ber", en: "Sieber Tower", x: 0, y: 0, kunst: k,
    tipp: "Der Siebersturm (1385) war ein Stadttor. Durch ihn geht es zum Spital.",
    zoom: { x: r(xm - 30), y: r(ys - 16), w: 60, h: 40 },
    unter: [
      { id: "dach", de: "das Dach", syl: "DACH", it: "il tetto", itSyl: "TET-to", en: "roof", x: xm, y: yt, kunst: flaeche(-14, -(yt - ys) + 4, 28, yt - ys - 4),
        tipp: "Die Dächer in Rothenburg sind mit roten Ziegeln gedeckt." },
      { id: "wetterfahne", de: "die Wetterfahne", syl: "WET-ter-fah-ne", it: "la banderuola", itSyl: "ban-de-RUO-la", en: "weather vane", x: xm, y: ys, kunst: flaeche(-3, -10, 9, 8),
        tipp: "Die Wetterfahne dreht sich mit dem Wind." },
    ] });
  /* DER TORBOGEN: spitzbogige Durchfahrt mit Blick in die Spitalgasse */
  const [ax, ay] = P(-1.8, ST.d, 0), [bx] = P(1.8, ST.d, 0), [, ty] = P(0, ST.d, 4.6), [, sy] = P(0, ST.d, 6.2);
  let t = `<path d="M${r(ax - 1.2)} ${r(ay)} L${r(ax - 1.2)} ${r(ty)} Q${r(ax - 1.2)} ${r(sy - 1.2)} ${r((ax + bx) / 2)} ${r(sy - 1.2)} Q${r(bx + 1.2)} ${r(sy - 1.2)} ${r(bx + 1.2)} ${r(ty)} L${r(bx + 1.2)} ${r(ay)} Z" fill="#cfb68c"/>`;
  t += `<path d="M${r(ax)} ${r(ay)} L${r(ax)} ${r(ty)} Q${r(ax)} ${r(sy)} ${r((ax + bx) / 2)} ${r(sy)} Q${r(bx)} ${r(sy)} ${r(bx)} ${r(ty)} L${r(bx)} ${r(ay)} Z" fill="${S.lg("durchfahrt", [[0, "#2a2220"], [0.7, "#5a4636"], [1, "#d8b07a"]])}"/>`;
  /* hinten im Licht: Häuser der Spitalgasse */
  t += `<path d="M${r(ax + 2)} ${r(ay)} L${r(ax + 2)} ${r(ay - 7)} L${r(ax + 5)} ${r(ay - 9)} L${r(ax + 8)} ${r(ay - 7)} L${r(ax + 8)} ${r(ay)} Z" fill="#e9c88e" opacity=".9"/>`;
  t += `<path d="M${r(ax)} ${r(ay)} L${r(bx)} ${r(ay)}" stroke="#8a7d6c" stroke-width=".6"/>`;
  S.teil({ oben: true, id: "torbogen", de: "der Torbogen", syl: "TOR-bo-gen", it: "l'arco della porta", itSyl: "AR-co DEL-la POR-ta", en: "archway", x: 0, y: 0, kunst: t,
    tipp: "Unter dem Torbogen fuhren früher die Fuhrwerke in die Stadt." });
}

/* =====================================================================
   6 — DAS FACHWERKHAUS am Plönlein (gelb, Giebel zur Gasse)
       Lupe: das Fachwerk, der Giebel, der Blumenkasten, das Fenster
   ===================================================================== */
const PH = { d: 22, L0: -12, L1: -3 };
{
  const s = F / PH.d;
  const X = (L) => VPX + L * s, Y = (h) => HOR - (h - EYE) * s;
  const GELB = S.lg("ploengelb", [[0, "#f6cf6a"], [1, "#e9b649"]]);
  const GELB_S = S.lg("ploengelbs", [[0, "#e4ad44"], [1, "#d39a36"]]);
  const vk = 0.22;   /* Vorkragung je Geschoss (m) */
  const gesch = [[0, 3.2, 0], [3.2, 5.9, 1], [5.9, 8.6, 2]];
  const traufe = 8.6, first = 16.4, Lm = (PH.L0 + PH.L1) / 2;
  let k = "";
  /* Seitenwand rechts (zur Gasse zum Siebersturm), in der Abendsonne */
  k += `<path d="${poly(P(PH.L1 + 2 * vk, PH.d, traufe), P(PH.L1 + 2 * vk, 34, traufe), P(PH.L1, 34, 0), P(PH.L1, PH.d, 0))}" fill="${S.lg("ploenseite", [[0, "#ffd77a"], [1, "#f2c05a"]], 0, 0, 1, 0)}"/>`;
  {
    let p = "";
    for (const hh of [3.2, 5.9, 8.6]) p += `M${pt(P(PH.L1 + vk, PH.d, hh))} L${pt(P(PH.L1 + vk, 34, hh))} `;
    for (let i = 0; i <= 4; i++) { const d = PH.d + 12 * i / 4; p += `M${pt(P(PH.L1 + vk, d, 3.2))} L${pt(P(PH.L1 + vk, d, traufe))} `; }
    k += `<path d="${p}" stroke="${BALKEN_L}" stroke-width="1" fill="none"/>`;
    for (const [da, db, ha, hb] of [[24, 26.4, 4, 5.2], [29, 31, 4, 5.2], [24, 26.4, 6.7, 7.9], [29, 31, 6.7, 7.9]]) k += fensterQ(P(PH.L1 + vk, da, hb), P(PH.L1 + vk, db, hb), P(PH.L1 + vk, db, ha), P(PH.L1 + vk, da, ha), { rb: 0.4 });
  }
  /* Dachfläche rechts (Ziegel) */
  k += `<path d="${poly(P(PH.L1 + 0.5, PH.d - 0.3, traufe), P(Lm, PH.d - 0.3, first), P(Lm, 34, first), P(PH.L1 + 0.5, 34, traufe))}" fill="${DACHZ}"/>`;
  k += `<path d="${poly(P(PH.L1 + 0.5, PH.d - 0.3, traufe), P(Lm, PH.d - 0.3, first), P(Lm, 34, first), P(PH.L1 + 0.5, 34, traufe))}" fill="#ffb060" opacity=".14"/>`;
  /* Giebelfront: Geschosse mit Vorkragung */
  for (const [h0, h1, i] of gesch) {
    const e = i * vk;
    k += `<rect x="${r(X(PH.L0 - e))}" y="${r(Y(h1))}" width="${r(X(PH.L1 + e) - X(PH.L0 - e))}" height="${r(Y(h0) - Y(h1))}" fill="${i ? GELB : S.lg("ploenEG", [[0, "#f0c868"], [1, "#d9ab4c"]])}"/>`;
    if (i) k += `<rect x="${r(X(PH.L0 - e))}" y="${r(Y(h0) - 1)}" width="${r(X(PH.L1 + e) - X(PH.L0 - e))}" height="1.6" fill="#000" opacity=".22"/>`;
  }
  /* Giebeldreieck (zwei Dachgeschosse) */
  const e3 = 3 * vk;
  k += `<path d="M${r(X(PH.L0 - e3))} ${r(Y(traufe))} L${r(X(Lm))} ${r(Y(first))} L${r(X(PH.L1 + e3))} ${r(Y(traufe))} Z" fill="${GELB}"/>`;
  /* Fachwerk: Schwellen, Rähme, Ständer, Streben, Andreaskreuze */
  let p = "";
  const sw = (h, e) => `M${r(X(PH.L0 - e))} ${r(Y(h))} L${r(X(PH.L1 + e))} ${r(Y(h))} `;
  p += sw(3.2, vk) + sw(3.45, vk) + sw(5.9, 2 * vk) + sw(6.15, 2 * vk) + sw(8.6, e3);
  const staender = [0, 0.2, 0.42, 0.58, 0.8, 1];
  for (const [h0, h1, e] of [[3.45, 5.9, vk], [6.15, 8.6, 2 * vk]]) for (const t of staender) { const L = PH.L0 - e + (PH.L1 - PH.L0 + 2 * e) * t; p += `M${r(X(L))} ${r(Y(h0))} L${r(X(L))} ${r(Y(h1))} `; }
  for (const [h0, h1, e] of [[3.45, 5.9, vk], [6.15, 8.6, 2 * vk]]) {
    for (const [ta, tb] of [[0, 0.2], [0.8, 1]]) { const La = PH.L0 - e + (PH.L1 - PH.L0 + 2 * e) * ta, Lb = PH.L0 - e + (PH.L1 - PH.L0 + 2 * e) * tb; p += `M${r(X(La))} ${r(Y(h0))} L${r(X(Lb))} ${r(Y(h1))} M${r(X(Lb))} ${r(Y(h0))} L${r(X(La))} ${r(Y(h1))} `; }
  }
  /* Giebel: Kehlbalken, Ständer, Streben */
  const giebelL = (h) => { const t = (h - traufe) / (first - traufe); return [PH.L0 - e3 + (Lm - PH.L0 + e3) * t, PH.L1 + e3 - (PH.L1 + e3 - Lm) * t]; };
  for (const h of [11.2, 13.6]) { const [a, b] = giebelL(h); p += `M${r(X(a))} ${r(Y(h))} L${r(X(b))} ${r(Y(h))} `; }
  for (const t of [0.3, 0.5, 0.7]) { const L = PH.L0 + (PH.L1 - PH.L0) * t; const [a, b] = giebelL(t === 0.5 ? 15.4 : 13.6); p += `M${r(X(L))} ${r(Y(traufe))} L${r(X(L))} ${r(Y(t === 0.5 ? 15.4 : Math.min(13.6, traufe + (first - traufe) * (1 - Math.abs(t - 0.5) * 2))))} `; void a; void b; }
  { const [a] = giebelL(11.2), [, b] = giebelL(11.2); p += `M${r(X(a))} ${r(Y(11.2))} L${r(X(PH.L0 + 2.6))} ${r(Y(traufe))} M${r(X(b))} ${r(Y(11.2))} L${r(X(PH.L1 - 2.6))} ${r(Y(traufe))} `; }
  k += `<path d="${p}" stroke="${BALKEN}" stroke-width="1.3" fill="none" stroke-linecap="square"/>`;
  /* Ortgang mit Ziegelkante und Windbrett */
  k += `<path d="M${r(X(PH.L0 - e3 - 0.5))} ${r(Y(traufe - 0.3))} L${r(X(Lm))} ${r(Y(first + 0.5))} L${r(X(PH.L1 + e3 + 0.5))} ${r(Y(traufe - 0.3))}" stroke="#7a3220" stroke-width="2.6" fill="none" stroke-linejoin="round"/>`;
  k += `<path d="M${r(X(PH.L0 - e3 - 0.5))} ${r(Y(traufe - 0.3))} L${r(X(Lm))} ${r(Y(first + 0.5))} L${r(X(PH.L1 + e3 + 0.5))} ${r(Y(traufe - 0.3))}" stroke="#c96a48" stroke-width=".6" fill="none" stroke-linejoin="round" transform="translate(0 -.9)"/>`;
  /* Fenster mit Blumenkästen (1. und 2. Stock), Giebelfenster, Ladeluke */
  const win = (Lc, h0, h1, w, kasten) => {
    const a = [X(Lc - w / 2), Y(h1)], b = [X(Lc + w / 2), Y(h1)], c = [X(Lc + w / 2), Y(h0)], d = [X(Lc - w / 2), Y(h0)];
    return fensterQ(a, b, c, d, { rb: 0.7, rahmen: "#f6f1e4" }) + (kasten ? blumen(d, c, 1.1) : "");
  };
  for (const Lc of [-10.6, -7.5, -4.4]) k += win(Lc, 4, 5.3, 1.2, true);
  for (const Lc of [-10.6, -7.5, -4.4]) k += win(Lc, 6.7, 8, 1.2, true);
  for (const Lc of [-9.4, -5.6]) k += win(Lc, 9.4, 10.6, 1.1, false);
  k += win(-7.5, 12, 13.1, 1, false);
  k += `<rect x="${r(X(-7.85))}" y="${r(Y(15))}" width="${r(0.7 * s)}" height="${r(0.8 * s)}" fill="#4a2a1a"/>`;
  /* Erdgeschoss: rundbogige Haustür, Fenster, Sockel */
  k += `<path d="M${r(X(-5.4))} ${r(Y(0))} L${r(X(-5.4))} ${r(Y(1.8))} Q${r(X(-5.4))} ${r(Y(2.5))} ${r(X(-4.65))} ${r(Y(2.5))} Q${r(X(-3.9))} ${r(Y(2.5))} ${r(X(-3.9))} ${r(Y(1.8))} L${r(X(-3.9))} ${r(Y(0))} Z" fill="${S.lg("tuer", [[0, "#6b4428"], [1, "#4a2c18"]])}" stroke="#c9a46a" stroke-width=".6"/>`;
  k += `<circle cx="${r(X(-4.2))}" cy="${r(Y(1.1))}" r=".5" fill="${GOLD}"/>`;
  for (const Lc of [-10.4, -7.8]) k += win(Lc, 1.1, 2.3, 1.1, false);
  k += `<rect x="${r(X(PH.L0))}" y="${r(Y(0.5))}" width="${r(X(PH.L1) - X(PH.L0))}" height="${r(0.5 * s)}" fill="#b9a07a"/>`;
  /* Abendlicht: die Nordfront liegt im weichen Schatten, Licht von rechts streift die Kante */
  k += `<path d="M${r(X(PH.L0))} ${r(Y(0))} L${r(X(PH.L0 - e3))} ${r(Y(traufe))} L${r(X(Lm))} ${r(Y(first))} L${r(X(PH.L1 + e3))} ${r(Y(traufe))} L${r(X(PH.L1))} ${r(Y(0))} Z" fill="${S.lg("frontlicht", [[0, "#5a4a7a", 0.1], [0.75, "#5a4a7a", 0.02], [1, "#ffcc70", 0.18]], 0, 0, 1, 0)}"/>`;
  S.teil({ id: "fachwerkhaus", de: "das Fachwerkhaus", syl: "FACH-werk-haus", it: "la casa a graticcio", itSyl: "CA-sa a gra-TIC-cio", en: "half-timbered house", x: 0, y: 0, kunst: k,
    tipp: "Das gelbe Fachwerkhaus am Plönlein ist eines der bekanntesten Fotomotive Deutschlands.",
    zoom: { x: 148, y: 60, w: 108, h: 72 },
    unter: [
      { id: "giebel", de: "der Giebel", syl: "GIE-bel", it: "il frontone", itSyl: "fron-TO-ne", en: "gable", x: X(Lm), y: Y(11.4), kunst: flaeche(-26, 0, 52, Y(traufe) - Y(11.4) - 1),
        tipp: "Viele Häuser in Rothenburg zeigen mit dem Giebel zur Gasse." },
      { id: "fachwerk", de: "das Fachwerk", syl: "FACH-werk", it: "il graticcio", itSyl: "gra-TIC-cio", en: "timber framing", x: X(PH.L1 + vk), y: Y(5.9), kunst: flaeche(-0.2 * 9.4 * s, 0.6, 0.2 * 9.4 * s, 13),
        tipp: "Fachwerk: ein Gerüst aus Holzbalken, die Felder dazwischen sind verputzt." },
      { id: "fenster", de: "das Fenster", syl: "FENS-ter", it: "la finestra", itSyl: "fi-NE-stra", en: "window", x: X(-7.5), y: Y(8), kunst: flaeche(-0.8 * s, -0.2, 1.6 * s, 1.3 * s) },
      { id: "blumenkasten", de: "der Blumenkasten", syl: "BLU-men-kas-ten", it: "la fioriera", itSyl: "fio-RIE-ra", en: "flower box", x: X(-4.4), y: Y(6.7), kunst: flaeche(-0.9 * s, -1.4, 1.8 * s, 3.6),
        tipp: "Im Sommer blühen in fast jedem Blumenkasten rote Geranien." },
    ] });
}

/* =====================================================================
   7 — DER BRUNNEN (Plönleinbrunnen, mit Blumen)
   ===================================================================== */
{
  const d = 18, s = F / d, [x, y] = P(-7.4, d, 0);
  let k = schatten(0, 0.6, 1.6 * s, 0.25 * s, 0.3);
  /* Trog aus Sandstein, leicht gerundet, Wasser mit Spiegelung */
  k += `<path d="M${r(-1.3 * s)} 0 L${r(-1.3 * s)} ${r(-0.75 * s)} Q0 ${r(-0.95 * s)} ${r(1.3 * s)} ${r(-0.75 * s)} L${r(1.3 * s)} 0 Z" fill="${S.lg("trog", [[0, "#c9ae84"], [0.5, "#dcc49a"], [1, "#a88e66"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${r(-1.3 * s)} ${r(-0.75 * s)} Q0 ${r(-0.95 * s)} ${r(1.3 * s)} ${r(-0.75 * s)} Q0 ${r(-0.62 * s)} ${r(-1.3 * s)} ${r(-0.75 * s)} Z" fill="#e6d3ae"/>`;
  k += `<path d="M${r(-1.15 * s)} ${r(-0.76 * s)} Q0 ${r(-0.9 * s)} ${r(1.15 * s)} ${r(-0.76 * s)} Q0 ${r(-0.68 * s)} ${r(-1.15 * s)} ${r(-0.76 * s)} Z" fill="#5f8a8c"/>`;
  for (let i = 0; i < 3; i++) k += `<rect x="${r(-1.3 * s + 0.2)}" y="${r(-0.6 * s + i * 0.22 * s)}" width="${r(2.6 * s - 0.4)}" height=".3" fill="#8f7856" opacity=".5"/>`;
  /* Brunnensäule mit Wasserrohr und Blumenschmuck */
  k += `<rect x="${r(-0.18 * s)}" y="${r(-1.9 * s)}" width="${r(0.36 * s)}" height="${r(1.1 * s)}" fill="${S.lg("saeule", [[0, "#b99e74"], [0.4, "#e2cda4"], [1, "#9c825c"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${r(-0.28 * s)}" y="${r(-2 * s)}" width="${r(0.56 * s)}" height="${r(0.14 * s)}" fill="#d9c39b"/>`;
  k += `<path d="M${r(0.15 * s)} ${r(-1.45 * s)} l${r(0.35 * s)} ${r(0.05 * s)}" stroke="#4a4a46" stroke-width=".7"/><path d="M${r(0.5 * s)} ${r(-1.4 * s)} q.6 2 .2 ${r(0.55 * s)}" stroke="#cfe6ea" stroke-width=".7" fill="none" opacity=".9"/>`;
  for (let i = 0; i < 16; i++) { const a = rnd() * Math.PI * 2, rr = rnd() * 0.42 * s; k += `<circle cx="${r(Math.cos(a) * rr)}" cy="${r(-2.15 * s + Math.sin(a) * rr * 0.6 - 0.12 * s)}" r="${r(0.13 * s)}" fill="${i % 3 ? "#d6283a" : "#3f6e2e"}"/>`; }
  for (let i = 0; i < 10; i++) k += `<circle cx="${r(-1.2 * s + rnd() * 2.4 * s)}" cy="${r(-0.82 * s)}" r="${r(0.1 * s)}" fill="${i % 2 ? "#e2384a" : "#4f7e36"}"/>`;
  S.teil({ id: "brunnen", de: "der Brunnen", syl: "BRUN-nen", it: "la fontana", itSyl: "fon-TA-na", en: "fountain", x, y, steht: true, kunst: k,
    tipp: "Der kleine Brunnen am Plönlein ist im Sommer voller Blumen." });
}

/* =====================================================================
   8 — DIE BÄCKEREI (Laden links vorn) — Lupe: der Schneeball, die Brezel
   ===================================================================== */
{
  const d0 = 6.25, d1 = 8.7;
  let k = "";
  /* Ladenfront: Holzrahmen, große Scheibe, Schild „Bäckerei“ darüber */
  k += `<path d="${poly(P(LL, d0 - 0.15, 2.85), P(LL, d1 + 0.15, 2.85), P(LL, d1 + 0.15, 0.45), P(LL, d0 - 0.15, 0.45))}" fill="#5a3a22"/>`;
  k += `<path d="${poly(P(LL, d0, 2.7), P(LL, d1, 2.7), P(LL, d1, 0.6), P(LL, d0, 0.6))}" fill="${S.lg("ladenlicht", [[0, "#ffe7b0"], [1, "#e8b46a"]])}"/>`;
  /* Auslage: drei Böden mit Schneeballen (Puderzucker, Schokolade, Nuss) und Brezeln */
  const boden = [0.95, 1.55, 2.15];
  boden.forEach((hb, bi) => {
    k += `<path d="${poly(P(LL, d0, hb), P(LL, d1, hb), P(LL, d1, hb - 0.06), P(LL, d0, hb - 0.06))}" fill="#c8b9a2"/>`;
    for (let i = 0; i < 9; i++) {
      const d = d0 + 0.18 + i * (d1 - d0 - 0.36) / 8, [x, y] = P(LL, d, hb), s = F / d;
      const rr = 0.085 * s;
      if (bi === 1 && i % 3 === 2) {
        /* Brezel: dicker Bauch unten, zwei Schlaufen, verschlungene Arme in der Mitte */
        const q = (dx, dy) => `${r(x + dx * rr)} ${r(y + dy * rr)}`;
        k += `<path d="M${q(-1.5, -0.4)} C${q(-2.1, -1.6)} ${q(-1.2, -2.6)} ${q(-0.2, -2.1)} L${q(0.5, -0.9)} M${q(1.5, -0.4)} C${q(2.1, -1.6)} ${q(1.2, -2.6)} ${q(0.2, -2.1)} L${q(-0.5, -0.9)} M${q(-1.5, -0.4)} Q${q(0, 0.5)} ${q(1.5, -0.4)}" stroke="#8a4614" stroke-width="${r(rr * 0.55)}" fill="none" stroke-linecap="round"/>`;
        for (const [dx, dy] of [[-1.2, -1.6], [0.9, -1.9], [0, -0.1], [-1.5, -0.6]]) k += `<circle cx="${r(x + dx * rr)}" cy="${r(y + dy * rr)}" r="${r(rr * 0.12)}" fill="#fffaf0"/>`;
      } else {
        /* Schneeball: Kugel aus Teigbändern, Puderzucker oder Schokolade */
        const f = [["#f7f3ec", "#c9bfae", "#e8dfcf"], ["#5a3218", "#2e1a0c", "#7a4a2a"], ["#f7f3ec", "#c9bfae", "#e8dfcf"]][(i + bi) % 3];
        k += `<circle cx="${r(x)}" cy="${r(y - rr)}" r="${r(rr)}" fill="${f[0]}" stroke="${f[1]}" stroke-width=".2"/>`;
        k += `<path d="M${r(x - rr * 0.9)} ${r(y - rr * 1.3)} q${r(rr * 0.5)} ${r(rr * 0.5)} ${r(rr * 0.9)} 0 t${r(rr * 0.9)} 0 M${r(x - rr * 0.95)} ${r(y - rr * 0.8)} q${r(rr * 0.5)} ${r(-rr * 0.5)} ${r(rr * 0.95)} 0 t${r(rr * 0.95)} 0 M${r(x - rr * 0.6)} ${r(y - rr * 1.75)} q${r(rr * 0.6)} ${r(rr * 0.4)} ${r(rr * 1.2)} 0" stroke="${f[1]}" stroke-width="${r(rr * 0.12)}" fill="none"/>`;
        k += `<circle cx="${r(x - rr * 0.35)}" cy="${r(y - rr * 1.4)}" r="${r(rr * 0.35)}" fill="${f[2]}" opacity=".7"/>`;
      }
    }
  });
  /* Preisschildchen und Glasspiegelung */
  { const [x, y] = P(LL, 7.3, 1.55); k += `<rect x="${r(x - 8.4)}" y="${r(y + 0.4)}" width="16.8" height="2.4" rx=".3" fill="#fff" stroke="#b8a37a" stroke-width=".2"/><text x="${r(x)}" y="${r(y + 2.2)}" font-size="1.6" text-anchor="middle" fill="#3a2a18" font-family="Arial" font-weight="bold">Schneeballen 3,50 €</text>`; }
  k += `<path d="${poly(P(LL, d0 + 0.2, 2.7), P(LL, d0 + 0.6, 2.7), P(LL, d0 + 1.1, 0.6), P(LL, d0 + 0.7, 0.6))}" fill="#fff" opacity=".22"/>`;
  k += `<path d="${poly(P(LL, d0 + 1.5, 2.7), P(LL, d0 + 1.7, 2.7), P(LL, d0 + 2, 0.6), P(LL, d0 + 1.8, 0.6))}" fill="#fff" opacity=".14"/>`;
  /* Schild: dunkles Holz, goldene Schrift (perspektivisch gezogen) */
  const a = P(LL, d0, 3.25), b = P(LL, d1, 3.25), c = P(LL, d0, 2.95);
  k += `<path d="${poly(P(LL, d0 - 0.1, 3.3), P(LL, d1 + 0.1, 3.3), P(LL, d1 + 0.1, 2.9), P(LL, d0 - 0.1, 2.9))}" fill="#3e2414"/>`;
  {
    const ux = (b[0] - a[0]) / 40, uy = (b[1] - a[1]) / 40, vy = (c[1] - a[1]) / 4;
    k += `<text transform="matrix(${r(ux * 10) / 10} ${r(uy * 100) / 100} 0 ${r(vy * 10) / 10} ${r(a[0])} ${r(a[1])})" x="20" y="3.1" font-size="3.4" text-anchor="middle" fill="#e8c56a" font-family="Georgia,serif" font-weight="bold" letter-spacing=".3">Bäckerei · Konditorei</text>`;
  }
  S.teil({ id: "baeckerei", de: "die Bäckerei", syl: "bä-cke-REI", it: "il panificio", itSyl: "pa-ni-FI-cio", en: "bakery", x: 0, y: 0, kunst: k,
    tipp: "In der Bäckerei gibt es die berühmten Rothenburger Schneeballen.",
    zoom: { x: 0, y: 122, w: 96, h: 64 },
    unter: [
      (() => { const [x, y] = P(LL, 6.9, 2.15); return { id: "schneeball", de: "der Schneeball", syl: "SCHNEE-ball", it: "la palla di neve (dolce)", itSyl: "PAL-la di NE-ve (DOL-ce)", en: "snowball pastry", x, y, kunst: flaeche(-8, -6, 16, 6.4),
        tipp: "Der Rothenburger Schneeball: Teigstreifen zur Kugel geformt, gebacken, mit Puderzucker." }; })(),
      (() => { const [x, y] = P(LL, 7.65, 1.55); return { id: "brezel", de: "die Brezel", syl: "BRE-zel", it: "il pretzel", itSyl: "PRET-zel", en: "pretzel", x, y, kunst: flaeche(-4, -5, 8, 5.4) }; })(),
    ] });
}

/* =====================================================================
   9 — DAS WIRTSHAUSSCHILD (schmiedeeiserner Ausleger mit goldenem Hirsch)
   ===================================================================== */
{
  const [x0, y0] = P(LL, 8.4, 4.25), [x1] = P(-6.1, 8.4, 4.25);
  let k = "";
  /* Wandplatte, Ausleger mit Ranken */
  k += `<rect x="${r(x0 - 1)}" y="${r(y0 - 4)}" width="2" height="8" fill="${EISEN}"/>`;
  k += `<path d="M${r(x0)} ${r(y0)} L${r(x1)} ${r(y0)}" stroke="${EISEN}" stroke-width="1"/>`;
  k += `<path d="M${r(x0)} ${r(y0 + 3.6)} Q${r((x0 + x1) / 2)} ${r(y0 + 3)} ${r(x1 - 2)} ${r(y0 + 0.4)}" stroke="${EISEN}" stroke-width=".6" fill="none"/>`;
  for (const t of [0.25, 0.5, 0.75]) { const x = x0 + (x1 - x0) * t; k += `<path d="M${r(x)} ${r(y0)} q-2 -3 0 -4.4 q2 1 .4 2.6" stroke="${EISEN}" stroke-width=".45" fill="none"/>`; }
  k += `<path d="M${r(x0 + 3)} ${r(y0 + 2.6)} q3 -1.4 2 -4" stroke="${EISEN}" stroke-width=".45" fill="none"/>`;
  /* Ring mit goldenem Hirsch, darunter Tafel „Gasthof“ */
  const cx = x1 - 6, cy = y0 + 11;
  k += `<line x1="${r(cx - 4)}" y1="${r(y0)}" x2="${r(cx - 4)}" y2="${r(cy - 7)}" stroke="${EISEN}" stroke-width=".4"/><line x1="${r(cx + 4)}" y1="${r(y0)}" x2="${r(cx + 4)}" y2="${r(cy - 7)}" stroke="${EISEN}" stroke-width=".4"/>`;
  k += `<circle cx="${r(cx)}" cy="${r(cy)}" r="7.6" fill="none" stroke="${EISEN}" stroke-width="1"/><circle cx="${r(cx)}" cy="${r(cy)}" r="6.4" fill="none" stroke="${GOLD}" stroke-width=".4"/>`;
  k += `<g transform="translate(${r(cx)} ${r(cy + 1)})"><path d="M-3.6 2.4 L-3.2 -.4 Q-2 -1.6 1.6 -1.2 L2.6 -2.8 L3.4 -2.6 L3 -1 Q3.4 .2 2.6 .6 L2.4 2.4 L1.8 2.4 L1.8 .8 L-2.2 .8 L-2.6 2.4 Z" fill="${GOLD}"/><path d="M2.6 -2.8 l-.6 -2 l.9 .8 l.2 -1.4 l.6 1.6 M3.4 -2.6 l.9 -1.8 l.1 1.2 l1 -1" stroke="#c9a640" stroke-width=".35" fill="none"/></g>`;
  k += `<rect x="${r(cx - 6)}" y="${r(cy + 8.4)}" width="12" height="3.4" rx=".6" fill="#2e4a2a" stroke="${GOLD}" stroke-width=".3"/><text x="${r(cx)}" y="${r(cy + 10.9)}" font-size="2.3" text-anchor="middle" fill="#f0d27a" font-family="Georgia,serif" font-weight="bold">Gasthof</text>`;
  S.teil({ oben: true, id: "wirtshausschild", de: "das Wirtshausschild", syl: "WIRTS-haus-schild", it: "l'insegna della locanda", itSyl: "in-SE-gna DEL-la lo-CAN-da", en: "inn sign", x: 0, y: 0, kunst: k,
    tipp: "Schmiedeeiserne Schilder zeigen schon von Weitem: Hier ist ein Gasthaus." });
}

/* =====================================================================
   10 — DER FENSTERLADEN (grüne Läden am Haus links)
   ===================================================================== */
{
  const L = LL, da = 5.95 + 0.45 * 3.4 - 0.4, db = da + 0.45, ha = 4.2, hb = 5.6;
  let k = fensterQ(P(L, da, hb), P(L, db, hb), P(L, db, ha), P(L, da, ha), { rb: 1.1 });
  /* zwei geöffnete Läden, an die Wand geklappt (in der Fassadenebene) */
  for (const [a, b] of [[da - 0.42, da - 0.04], [db + 0.04, db + 0.42]]) {
    k += `<path d="${poly(P(L, a, hb + 0.05), P(L, b, hb + 0.05), P(L, b, ha - 0.05), P(L, a, ha - 0.05))}" fill="${S.lg("laden", [[0, "#3f7a4a"], [1, "#2c5a36"]])}" stroke="#1e3e24" stroke-width=".4"/>`;
    for (let i = 1; i < 6; i++) { const h = ha + (hb - ha) * i / 6; k += `<path d="M${pt(P(L, a + 0.03, h))} L${pt(P(L, b - 0.03, h - 0.08))}" stroke="#1e3e24" stroke-width=".35"/>`; }
  }
  S.teil({ oben: true, id: "fensterladen", de: "der Fensterladen", syl: "FENS-ter-la-den", it: "l'imposta", itSyl: "im-PO-sta", en: "shutter", x: 0, y: 0, kunst: k,
    tipp: "Mit den Fensterläden schützt man das Zimmer vor Sonne und Kälte." });
}

/* =====================================================================
   11 — DAS SCHAUFENSTER mit Weihnachtsschmuck (rechts) — Lupe:
        die Christbaumkugel, der Nussknacker, der Stern
   ===================================================================== */
{
  const L = 4, d0 = 10.1, d1 = 13.6, h0 = 0.55, h1 = 2.75;
  let k = `<path d="${poly(P(L, d0 - 0.15, h1 + 0.25), P(L, d1 + 0.15, h1 + 0.25), P(L, d1 + 0.15, h0 - 0.1), P(L, d0 - 0.15, h0 - 0.1))}" fill="#6e1e22"/>`;
  k += `<path d="${poly(P(L, d0, h1), P(L, d1, h1), P(L, d1, h0), P(L, d0, h0))}" fill="${S.lg("weihnachtslicht", [[0, "#fff1c8"], [1, "#f2c278"]])}"/>`;
  /* Tannengirlande oben, Lichterkette */
  for (let i = 0; i < 14; i++) { const d = d0 + (d1 - d0) * i / 13, [x, y] = P(L, d, h1 - 0.12); k += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(1.3 * 10 / d)}" fill="#2f5a32"/><circle cx="${r(x)}" cy="${r(y + 0.6)}" r=".35" fill="#ffe27a"/>`; }
  /* kleiner Weihnachtsbaum mit Kugeln */
  { const [x, y] = P(L, 12.6, h0 + 0.1), s = F / 12.6; k += `<path d="M${r(x - 0.42 * s)} ${r(y)} L${r(x)} ${r(y - 1.6 * s)} L${r(x + 0.42 * s)} ${r(y)} Z" fill="#2c5a30"/>`; for (let i = 0; i < 7; i++) k += `<circle cx="${r(x + (rnd() - 0.5) * 0.5 * s)}" cy="${r(y - (0.2 + rnd() * 1.1) * s)}" r=".7" fill="${["#c8202c", "#e8b830", "#e8e8ee"][i % 3]}"/>`; k += `<path d="M${r(x)} ${r(y - 1.75 * s)} l.5 1 l-1 0 Z" fill="#f2c83a"/>`; }
  /* Nussknacker (rote Uniform, schwarze Stiefel, hohe Mütze) */
  const KN = P(L, 10.8, h0 + 0.05);
  { const [x, y] = KN, s = F / 10.8 * 0.95;
    k += `<rect x="${r(x - 0.12 * s)}" y="${r(y - 0.3 * s)}" width="${r(0.1 * s)}" height="${r(0.3 * s)}" fill="#1a1a1a"/><rect x="${r(x + 0.02 * s)}" y="${r(y - 0.3 * s)}" width="${r(0.1 * s)}" height="${r(0.3 * s)}" fill="#1a1a1a"/>`;
    k += `<rect x="${r(x - 0.16 * s)}" y="${r(y - 0.75 * s)}" width="${r(0.32 * s)}" height="${r(0.46 * s)}" fill="#c8202c"/><rect x="${r(x - 0.16 * s)}" y="${r(y - 0.52 * s)}" width="${r(0.32 * s)}" height="${r(0.04 * s)}" fill="#f2c83a"/>`;
    k += `<rect x="${r(x - 0.12 * s)}" y="${r(y - 0.98 * s)}" width="${r(0.24 * s)}" height="${r(0.24 * s)}" rx="${r(0.04 * s)}" fill="#f2d2b0"/><rect x="${r(x - 0.12 * s)}" y="${r(y - 0.84 * s)}" width="${r(0.24 * s)}" height="${r(0.1 * s)}" fill="#f6f4ee"/>`;
    k += `<rect x="${r(x - 0.13 * s)}" y="${r(y - 1.24 * s)}" width="${r(0.26 * s)}" height="${r(0.27 * s)}" fill="#1a1a1a"/><circle cx="${r(x)}" cy="${r(y - 1.27 * s)}" r="${r(0.035 * s)}" fill="#f2c83a"/>`;
    k += `<circle cx="${r(x - 0.05 * s)}" cy="${r(y - 0.92 * s)}" r=".25" fill="#1a1a1a"/><circle cx="${r(x + 0.05 * s)}" cy="${r(y - 0.92 * s)}" r=".25" fill="#1a1a1a"/>`; }
  /* Christbaumkugeln an Bändern, Stern (Herrnhuter Art) */
  const KU = [];
  for (const [d, h, f] of [[11.5, 2.2, "#c8202c"], [11.9, 1.95, "#e8b830"], [12.25, 2.25, "#2f6ab0"], [11.7, 1.6, "#e8e8ee"]]) {
    const [x, y] = P(L, d, h), [, yo] = P(L, d, h1 - 0.1), rr = 0.11 * F / d;
    k += `<line x1="${r(x)}" y1="${r(yo)}" x2="${r(x)}" y2="${r(y - rr)}" stroke="#d9b86a" stroke-width=".2"/><circle cx="${r(x)}" cy="${r(y)}" r="${r(rr)}" fill="${f}"/><circle cx="${r(x - rr * 0.35)}" cy="${r(y - rr * 0.35)}" r="${r(rr * 0.3)}" fill="#fff" opacity=".7"/>`;
    KU.push([x, y]);
  }
  const STERN = P(L, 13.05, 2.2);
  { const [x, y] = STERN, rr = 0.2 * F / 13.05; let st = ""; for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5 - Math.PI / 2, q = i % 2 ? rr * 0.42 : rr; st += `${i ? "L" : "M"}${r(x + Math.cos(a) * q)} ${r(y + Math.sin(a) * q)} `; } k += `<path d="${st}Z" fill="#f6d65a" stroke="#c99a2a" stroke-width=".2"/><circle cx="${r(x)}" cy="${r(y)}" r="${r(rr * 1.6)}" fill="#ffe7a0" opacity=".35"/>`; }
  /* Schild über dem Fenster und Spiegelung */
  { const a = P(L, d1, 3.35), b = P(L, d0, 3.35), c = P(L, d1, 3.05); const ux = (b[0] - a[0]) / 40, uy = (b[1] - a[1]) / 40, vy = (c[1] - a[1]) / 4;
    k += `<path d="${poly(P(L, d0, 3.4), P(L, d1, 3.4), P(L, d1, 3.0), P(L, d0, 3.0))}" fill="#6e1e22"/>`;
    k += `<text transform="matrix(${r(ux * 10) / 10} ${r(uy * 100) / 100} 0 ${r(vy * 10) / 10} ${r(a[0])} ${r(a[1])})" x="20" y="3.1" font-size="3.2" text-anchor="middle" fill="#f2d27a" font-family="Georgia,serif" font-weight="bold">Weihnachtsschmuck</text>`; }
  k += `<path d="${poly(P(L, d0 + 0.3, h1), P(L, d0 + 0.6, h1), P(L, d0 + 1.1, h0), P(L, d0 + 0.8, h0))}" fill="#fff" opacity=".2"/>`;
  const [ax, ay] = P(L, d0 - 0.2, h1 + 0.5), [bx, by] = P(L, d1 + 0.2, h0 - 0.1);
  const zw = Math.max(bx - ax, ax - bx) + 18, zh = by - ay + 8;
  const zoomH = Math.max(zh, zw / 1.5), zoomW = zoomH * 1.5;
  S.teil({ id: "schaufenster", de: "das Schaufenster", syl: "SCHAU-fens-ter", it: "la vetrina", itSyl: "ve-TRI-na", en: "shop window", x: 0, y: 0, kunst: k,
    tipp: "In Rothenburg kann man das ganze Jahr Weihnachtsschmuck kaufen.",
    zoom: { x: r(Math.min(ax, bx) - (zoomW - Math.abs(bx - ax)) / 2), y: r(ay - 4), w: r(zoomW), h: r(zoomH) },
    unter: [
      { id: "nussknacker", de: "der Nussknacker", syl: "NUSS-kna-cker", it: "lo schiaccianoci", itSyl: "schiac-cia-NO-ci", en: "nutcracker", x: KN[0], y: KN[1], kunst: flaeche(-3, -1.3 * F / 10.8, 6, 1.3 * F / 10.8),
        tipp: "Der Nussknacker knackt Nüsse mit seinem großen Mund. Er kommt aus dem Erzgebirge." },
      { id: "christbaumkugel", de: "die Christbaumkugel", syl: "CHRIST-baum-ku-gel", it: "la pallina di Natale", itSyl: "pal-LI-na di na-TA-le", en: "Christmas bauble", x: KU[0][0], y: KU[0][1], kunst: flaeche(-3, -3, 6, 6) },
      { id: "stern", de: "der Stern", syl: "STERN", it: "la stella", itSyl: "STEL-la", en: "star", x: STERN[0], y: STERN[1], kunst: flaeche(-3.4, -3.4, 6.8, 6.8) },
    ] });
}

/* =====================================================================
   12 — DER NACHTWÄCHTER mit 13 — DER HELLEBARDE und 14 — DER LATERNE
   ===================================================================== */
const NW = (() => { const d = 6.2, [x, y] = P(1.0, d, 0); return { x, y, s: F / d }; })();
const nw = B.mensch({ id: "rtb_nachtwaechter", geschlecht: "m", pose: "stehen", blick: -18, frisur: "kurz", haarfarbe: "grau", haut: "hell", bart: "voll",
  kleidung: { oberteil: { stueck: "hemd", farbe: "weiss" }, jacke: { stueck: "mantel", farbe: "#1e1c21" }, unterteil: { stueck: "hose", farbe: "schwarz" }, schuhe: { stueck: "stiefel", farbe: "#1a1a1a" }, kopf: { stueck: "hut", farbe: "#17161a" } } }, 1.8 * NW.s);
const NP = (n) => { const q = nw.z.punkte[n]; return [q[0] * nw.k, q[1] * nw.k]; };
{
  let k = schatten(0, 0.5, 14, 2.4, 0.35) + nw.svg;
  /* weiter Umhang über den Schultern (Pelerine) */
  const [sl, slY] = NP("schulterL"), [sr, srY] = NP("schulterR"), [hx, hy] = NP("hals");
  const lo = Math.min(sl, sr), hi = Math.max(sl, sr), oy = Math.min(slY, srY);
  k += `<path d="M${r(hx - 3)} ${r(hy + 1)} Q${r(lo - 2)} ${r(oy + 1)} ${r(lo - 3.4)} ${r(oy + 13)} Q${r((lo + hi) / 2)} ${r(oy + 15)} ${r(hi + 3.4)} ${r(oy + 13)} Q${r(hi + 2)} ${r(oy + 1)} ${r(hx + 3)} ${r(hy + 1)} Z" fill="${S.lg("umhang", [[0, "#2a2830"], [0.5, "#16151a"], [1, "#0e0d10"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${r(hx - 2.6)} ${r(hy + 1.4)} Q${r(hx)} ${r(hy + 3)} ${r(hx + 2.6)} ${r(hy + 1.4)}" stroke="#d8d4cc" stroke-width=".7" fill="none"/>`;
  k += `<path d="M${r(lo - 2.6)} ${r(oy + 6)} Q${r(lo - 2)} ${r(oy + 3)} ${r(lo)} ${r(oy + 1.4)}" stroke="#ffcf8a" stroke-width=".5" fill="none" opacity=".35"/>`;
  /* breite Krempe des Schlapphuts */
  const [kx, ky2] = NP("scheitel");
  k += `<ellipse cx="${r(kx)}" cy="${r(ky2 + 2.4)}" rx="7.4" ry="1.5" fill="#141317"/><path d="M${r(kx - 7)} ${r(ky2 + 2.2)} Q${r(kx)} ${r(ky2 + 1.2)} ${r(kx + 7)} ${r(ky2 + 2.2)}" stroke="#3a3840" stroke-width=".3" fill="none"/>`;
  /* Horn am Gürtel */
  const [bx, by] = NP("huefteR");
  k += `<path d="M${r(bx - 1)} ${r(by)} q3 1 4 4 l-1.4 .4 q-.8 -2.4 -3 -3.2 Z" fill="#c9a46a" stroke="#7a5a2a" stroke-width=".25"/>`;
  S.teil({ id: "nachtwaechter", de: "der Nachtwächter", syl: "NACHT-wäch-ter", it: "la guardia notturna", itSyl: "GUAR-dia not-TUR-na", en: "night watchman", x: NW.x, y: NW.y, kunst: k,
    tipp: "Am Abend führt der Nachtwächter die Gäste durch die Altstadt und erzählt Geschichten von früher." });
}
{
  /* Hellebarde: Stange in der linken Bildhand, oben Beil, Spitze und Haken */
  const hands = [NP("handL"), NP("handR")].sort((a, b) => a[0] - b[0]);
  const [hx, hy] = hands[0];
  const top = -2.45 * NW.s;
  let k = `<rect x="${r(hx - 0.75)}" y="${r(top)}" width="1.5" height="${r(-top)}" rx=".5" fill="${S.lg("stange", [[0, "#5a3a22"], [0.5, "#9a7048"], [1, "#4a2e18"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${r(hx - 0.7)} ${r(top)} L${r(hx)} ${r(top - 10)} L${r(hx + 0.7)} ${r(top)} Z" fill="${S.lg("stahl", [[0, "#e8ecef"], [0.5, "#aab3ba"], [1, "#7a838a"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${r(hx + 0.6)} ${r(top + 1)} L${r(hx + 6.4)} ${r(top - 1.6)} Q${r(hx + 7.4)} ${r(top + 3)} ${r(hx + 6.2)} ${r(top + 7.4)} L${r(hx + 0.6)} ${r(top + 5)} Z" fill="url(#${S.id("stahl")})" stroke="#5a6268" stroke-width=".25"/>`;
  k += `<path d="M${r(hx - 0.6)} ${r(top + 2)} L${r(hx - 3.6)} ${r(top + 0.4)} L${r(hx - 3)} ${r(top + 2.2)} L${r(hx - 0.6)} ${r(top + 3.6)} Z" fill="url(#${S.id("stahl")})"/>`;
  k += `<rect x="${r(hx - 0.9)}" y="${r(top + 5)}" width="1.8" height="1.2" fill="#c9a640"/><path d="M${r(hx + 6.2)} ${r(top - 1)} L${r(hx + 6.8)} ${r(top + 5)}" stroke="#fff" stroke-width=".4" opacity=".6"/>`;
  S.teil({ oben: true, id: "hellebarde", de: "die Hellebarde", syl: "hel-le-BAR-de", it: "l'alabarda", itSyl: "a-la-BAR-da", en: "halberd", x: NW.x, y: NW.y, kunst: k + flaeche(hx - 4, top - 10, 12, -top + 10 - (hy < 0 ? 0 : 0)),
    tipp: "Mit der Hellebarde – halb Axt, halb Spieß – schützte der Nachtwächter früher die Stadt." });
}
{
  /* Laterne: Messinggehäuse mit Kerze, hängt an der rechten Bildhand, glimmt */
  const hands = [NP("handL"), NP("handR")].sort((a, b) => a[0] - b[0]);
  const [hx, hy] = hands[1];
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

/* Abendlicht und Dunst über allem */
S.davor(`<rect width="400" height="260" fill="${S.lg("abendschein", [[0, "#ff9a4a", 0], [0.6, "#ff9a4a", 0.05], [1, "#ffb060", 0.12]], 0, 0, 1, 0)}"/>`);

/* alles um DY nach unten schieben (Kulisse als Gruppe, Teile über ihre Lage) */
S.kulisse = [`<g transform="translate(0 ${DY})">${S.kulisse.join("")}</g>`];
for (const t of S.teile) {
  t.y += DY;
  if (t.zoom) t.zoom = Object.assign({}, t.zoom, { y: r(t.zoom.y + DY) });
  if (t.unter) for (const u of t.unter) u.y += DY;
}
const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/rothenburg.js"));
console.log(aus);
