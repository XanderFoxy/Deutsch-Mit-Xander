#!/usr/bin/env node
/* =====================================================================
   OST UND WEST (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   STANDORT: Berlin heute, Gedenkstätte Berliner Mauer an der Bernauer
   Straße. Man steht in einer Seitenstraße im früheren Westen (Wedding)
   und schaut nach Süden über die Bernauer Straße auf den erhaltenen
   Grenzstreifen; dahinter liegt der frühere Osten (Mitte).

   RECHERCHE (berlin.de Landesdenkmalamt, visitberlin, Gedenkstätte):
   - Nur an der Bernauer Straße ist ein Stück der Grenzanlage mit allen
     Teilen erhalten: GRENZMAUER (Betonsegmente mit Rohr obendrauf),
     Postenweg, Peitschenlampen, HINTERLANDMAUER, dazu ein WACHTURM
     (Rundturm mit achteckiger Kanzel und Scheinwerfer).
   - Wo die Mauer fehlt, zeigen rostige STAHLSTANGEN ihren Verlauf.
     An manchen Resten sieht man Löcher und Eisen: 1989/90 schlugen
     „Mauerspechte“ Stücke heraus.
   - Eine Freiluft-Ausstellung mit rostroten INFOSTELEN und alten Fotos
     (z. B. 10. November 1989: Menschen mit Fahnen auf der Mauer vor dem
     Brandenburger Tor).
   - Hinter dem Streifen im Osten: PLATTENBAUTEN (WBS 70) und eine
     KAUFHALLE (so hieß der Supermarkt in der DDR); am Horizont der
     FERNSEHTURM am Alexanderplatz.
   - Im Westen gründerzeitliche ALTBAUTEN mit Stuck und Balkonen,
     Werbung am Straßenrand; Berliner Gehweg: Granitplatten in der Mitte,
     kleines Mosaikpflaster am Rand.
   - In Berlin zeigt die Fußgängerampel fast überall das
     OST-AMPELMÄNNCHEN mit Hut.
   - Auf der Straße ein TRABANT (Oldtimer, für Stadtrundfahrten) und ein
     VW KÄFER — die Autos von Ost und West.
   Perspektive: Augenhöhe 1,6 m, Fluchtpunkt (160 | 112), Brennweite
   400 Einheiten: x = 160 + 400·L/d, Boden y = 112 + 640/d (L seitlich,
   d Entfernung in Metern). Mauer bei d = 44 m (3,6 m hoch).
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "ost_west", titel: "Ost und West", emoji: "🧱", thema: "Geschichte", kuerzel: "owx", fassung: 852 });
const rnd = zufall(1989);
const r = B.r;

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const VX = 160, VY = 112, F = 400, AUGE = 1.6;
const px = (L, d) => VX + F * L / d;
const py = (h, d) => VY - (h - AUGE) * F / d;
const P = (L, d, h = 0) => `${r(px(L, d))} ${r(py(h, d))}`;
const BETON = S.lg("beton", [[0, "#d9d6cf"], [0.5, "#cbc7bf"], [1, "#b6b1a8"]]);
const ROST = S.lg("rost", [[0, "#8a4a26"], [0.5, "#b0643a"], [1, "#6e3519"]], 0, 0, 1, 0);
const D_MAUER = 30;

/* =====================================================================
   KULISSE — Himmel, Osten hinter dem Streifen, Boden
   ===================================================================== */
S.hinten(`<rect width="320" height="${VY + 8}" fill="${S.lg("himmel", [[0, "#86b1da"], [0.7, "#c9dcea"], [1, "#e9ede9"]])}"/>`);
S.hinten(`<g fill="#fff"><ellipse cx="90" cy="20" rx="34" ry="4.6" opacity=".8"/><ellipse cx="108" cy="16" rx="14" ry="4.4"/><ellipse cx="280" cy="30" rx="26" ry="3" opacity=".6"/></g>`);
/* Boden-Grundton unter allem (Gehweg) */
S.hinten(`<rect y="${VY + 6}" width="320" height="${200 - VY - 6}" fill="#b5ada0"/>`);
/* zweiter Plattenbau rechts (Kulisse) */
{
  let g = `<rect x="266" y="64" width="62" height="54" fill="${S.lg("pb2", [[0, "#e4dccb"], [1, "#cfc6b2"]], 0, 0, 1, 0)}"/>`;
  for (let j = 0; j < 9; j++) for (let i = 0; i < 10; i++) g += `<rect x="${r(268 + i * 6)}" y="${r(66 + j * 5.6)}" width="3.4" height="2.6" fill="#6e7781"/>`;
  g += `<rect x="266" y="64" width="62" height="1.4" fill="#a59c8a"/>`;
  S.hinten(g);
}
/* Hinterlandmauer (weiß) und Grenzstreifen mit Postenweg */
{
  const d = 95;
  let g = `<rect x="0" y="${r(py(3.4, d))}" width="320" height="${r(py(0, d) - py(3.4, d))}" fill="#eceae4"/>`;
  for (let x = 2; x < 320; x += 4.4) g += `<line x1="${r(x)}" y1="${r(py(3.4, d))}" x2="${r(x)}" y2="${r(py(0, d))}" stroke="#d2cfc7" stroke-width=".3"/>`;
  g += `<rect x="0" y="${r(py(0, d))}" width="320" height="${r(py(0, D_MAUER) - py(0, d))}" fill="${S.lg("streifen", [[0, "#c9c0a8"], [1, "#a9b48d"]])}"/>`;
  /* Postenweg aus Lochplatten */
  g += `<rect x="0" y="${r(py(0, 50) - 0.8)}" width="320" height="1.6" fill="#a7a49c"/>`;
  for (let x = 0; x < 320; x += 3) g += `<rect x="${x + 0.6}" y="${r(py(0, 50) - 0.5)}" width="1" height=".9" fill="#8d8a83"/>`;
  /* Peitschenlampen */
  for (const x of [40, 132, 236, 300]) { const yb = py(0, 46), yt = py(4.6, 46); g += `<path d="M${x} ${r(yb)} L${x} ${r(yt)} Q${x} ${r(yt - 1.6)} ${x - 3} ${r(yt - 1.4)}" stroke="#5a5f63" stroke-width=".6" fill="none"/><rect x="${x - 4.6}" y="${r(yt - 2)}" width="2.4" height="1" rx=".4" fill="#4a4f53"/>`; }
  S.hinten(g);
}
/* Grünfläche rechts an der Ecke (Brache mit Bäumen, früher Westen) */
{
  /* (entfällt: die Ecke ist gepflastert) */
}

/* =====================================================================
   1 — DER FERNSEHTURM (am Horizont)
   ===================================================================== */
{
  let k = `<path d="M-1.4 0 L-.7 -36 L.7 -36 L1.4 0 Z" fill="${S.lg("ft", [[0, "#c9cdd1"], [0.5, "#eef0f2"], [1, "#a9aeb3"]], 0, 0, 1, 0)}"/>`;
  k += `<circle cx="0" cy="-40" r="4.6" fill="${S.rg("kugel", [[0, "#ffffff"], [0.5, "#c9ced3"], [1, "#8a9097"]], 0.35, 0.3, 0.75)}"/>`;
  k += `<path d="M-4.4 -41 h8.8 M-4.2 -39.4 h8.4" stroke="#8a9097" stroke-width=".35"/><rect x="-.5" y="-58" width="1" height="13.6" fill="#d7dadd"/><rect x="-.3" y="-60" width=".6" height="2.4" fill="#c33"/>`;
  k += `<rect x="-5" y="-62" width="10" height="62" fill="#e9ede9" opacity=".18"/>`;
  S.teil({ id: "fernsehturm", de: "der Fernsehturm", syl: "FERN-seh-turm", it: "la torre della televisione", itSyl: "TOR-re del-la te-le-vi-SIO-ne", en: "TV tower", x: 252, y: 108, steht: true, kunst: k + flaeche(-5, -60, 10, 60),
    tipp: "Der Fernsehturm am Alexanderplatz wurde 1969 in der DDR gebaut. Mit 368 Metern ist er das höchste Bauwerk Deutschlands." });
}

/* =====================================================================
   2 — DER PLATTENBAU (WBS 70, hinter dem Grenzstreifen)
   ===================================================================== */
{
  const W = 168, H = 84;
  let k = `<rect x="${-W / 2}" y="${-H}" width="${W}" height="${H}" fill="${S.lg("platte", [[0, "#ece4d2"], [1, "#d4cab4"]], 0, 0, 1, 0)}"/>`;
  /* Plattenfugen und Fensterraster, Loggien in zwei Achsen */
  let fug = "";
  for (let j = 0; j <= 11; j++) fug += `M${-W / 2} ${r(-H + j * 7.4)} h${W} `;
  for (let i = 0; i <= 28; i++) fug += `M${r(-W / 2 + i * 6)} ${-H} v${H} `;
  k += `<path d="${fug}" stroke="#bfb49c" stroke-width=".3"/>`;
  for (let j = 0; j < 11; j++) for (let i = 0; i < 28; i++) {
    const x = -W / 2 + i * 6 + 1.4, y = -H + j * 7.4 + 2;
    if (i % 7 === 3 || i % 7 === 4) k += `<rect x="${r(x - 1)}" y="${r(y - 0.6)}" width="5.6" height="4.6" fill="#7d8790"/><rect x="${r(x - 1)}" y="${r(y + 2.4)}" width="5.6" height="1.6" fill="${j % 2 ? "#d9a441" : "#7aa0b8"}"/>`;
    else k += `<rect x="${r(x)}" y="${r(y)}" width="3.2" height="3" fill="#5e6873"/>`;
  }
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="1.6" fill="#a59c8a"/>`;
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="${H}" fill="#e9ede9" opacity=".2"/>`;
  S.teil({ id: "plattenbau", de: "der Plattenbau", syl: "PLAT-ten-bau", it: "il palazzo prefabbricato", itSyl: "pa-LAZ-zo pre-fab-bri-CA-to", en: "prefab block", x: 150, y: 116.6, steht: true, kunst: k,
    tipp: "In der DDR gebaut: gleiche Teile aus Beton, an Ort und Stelle zusammengesetzt." });
}

/* =====================================================================
   3 — DIE KAUFHALLE (flacher Bau vor den Plattenbauten)
   ===================================================================== */
{
  const W = 104, H = 15;
  let k = `<rect x="${-W / 2}" y="${-H}" width="${W}" height="${H}" fill="#e7e2d6"/>`;
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="3.6" fill="#c8402f"/>`;
  k += `<text x="-41" y="${-H + 2.8}" font-size="3.2" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-weight="bold" letter-spacing=".8">KAUFHALLE</text>`;
  k += `<rect x="${-W / 2 + 2}" y="${-H + 5}" width="${W - 4}" height="7.4" fill="${S.lg("kfglas", [[0, "#8fb0c4"], [1, "#55707f"]])}"/>`;
  for (let x = -W / 2 + 2; x < W / 2; x += 6) k += `<line x1="${r(x)}" y1="${-H + 5}" x2="${r(x)}" y2="-2.6" stroke="#e7e2d6" stroke-width=".6"/>`;
  k += `<rect x="${W / 2 - 34}" y="-7" width="5" height="7" fill="#3e4c56"/>`;
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="${H}" fill="#e9ede9" opacity=".18"/>`;
  S.teil({ id: "hokaufhalle", de: "die Kaufhalle", syl: "KAUF-hal-le", it: "il supermercato", itSyl: "su-per-mer-CA-to", en: "shop", x: 266, y: 117.8, steht: true, kunst: k,
    tipp: "So hieß in der DDR der Supermarkt. Viele Leute sagen im Osten bis heute „Kaufhalle“." });
}

/* =====================================================================
   4 — DER WACHTURM (Rundturm im Grenzstreifen)
   ===================================================================== */
{
  let k = schatten(0, 0.3, 6, 0.8, 0.3);
  k += `<rect x="-3" y="-44" width="6" height="44" fill="${S.lg("turmschaft", [[0, "#b9b6ae"], [0.5, "#e2dfd8"], [1, "#a5a29a"]], 0, 0, 1, 0)}"/>`;
  for (let y = -40; y < 0; y += 4) k += `<line x1="-3" y1="${y}" x2="3" y2="${y}" stroke="#9a978f" stroke-width=".3"/>`;
  k += `<rect x="-.8" y="-12" width="1.6" height="1.6" fill="#555"/>`;
  /* achteckige Kanzel mit Fensterband */
  k += `<path d="M-8 -44 L8 -44 L9.4 -47 L9.4 -54 L8 -57 L-8 -57 L-9.4 -54 L-9.4 -47 Z" fill="#dedbd3"/>`;
  k += `<path d="M-9 -53.4 L9 -53.4 L9 -48.6 L-9 -48.6 Z" fill="${S.lg("kanzelglas", [[0, "#5c6d7a"], [1, "#2f3c46"]])}"/>`;
  for (const x of [-5.4, -1.8, 1.8, 5.4]) k += `<line x1="${x}" y1="-53.4" x2="${x}" y2="-48.6" stroke="#dedbd3" stroke-width=".5"/>`;
  k += `<path d="M-9.4 -57 L9.4 -57 L8 -59 L-8 -59 Z" fill="#a9a59c"/>`;
  /* Geländer und Scheinwerfer auf dem Dach */
  k += `<path d="M-8 -59 v-2.4 h16 v2.4" stroke="#55595c" stroke-width=".4" fill="none"/><rect x="-1.6" y="-63" width="3.2" height="2.6" rx=".6" fill="#3a3e41"/><circle cx="1.8" cy="-61.7" r=".9" fill="#d9dde0"/>`;
  k += `<rect x="-10" y="-64" width="20" height="64" fill="#e9ede9" opacity=".12"/>`;
  S.teil({ id: "wachturm", de: "der Wachturm", syl: "WACH-turm", it: "la torre di guardia", itSyl: "TOR-re di GUAR-dia", en: "watchtower", x: 196, y: r(py(0, 55)), steht: true, kunst: k,
    tipp: "Von hier oben beobachteten DDR-Grenzsoldaten den Grenzstreifen." });
}

/* =====================================================================
   5 — DIE MAUER (erhaltenes Stück, Betonsegmente mit Rohr)
   ===================================================================== */
const yMb = py(0, D_MAUER), yMt = py(3.6, D_MAUER);
{
  const x0 = 92, x1 = 160, H = yMb - yMt;
  let k = schatten(0, 0.4, (x1 - x0) / 2, 1.2, 0.3);
  k += `<rect x="${r(-(x1 - x0) / 2)}" y="${r(-H)}" width="${x1 - x0}" height="${r(H)}" fill="${BETON}"/>`;
  /* Segmente 1,2 m breit */
  const seg = 1.2 * F / D_MAUER;
  for (let x = -(x1 - x0) / 2; x < (x1 - x0) / 2; x += seg) k += `<line x1="${r(x)}" y1="${r(-H + 2)}" x2="${r(x)}" y2="0" stroke="#9c978d" stroke-width=".45"/>`;
  /* Rohr obendrauf */
  k += `<rect x="${r(-(x1 - x0) / 2 - 0.4)}" y="${r(-H - 2.6)}" width="${x1 - x0 + 0.8}" height="3" rx="1.5" fill="${S.lg("rohr", [[0, "#f0eee9"], [0.5, "#cdc9c1"], [1, "#a29d93"]])}"/>`;
  /* Verwitterung, Wasserspuren */
  for (let i = 0; i < 14; i++) { const x = -(x1 - x0) / 2 + rnd() * (x1 - x0); k += `<path d="M${r(x)} ${r(-H + 1)} q${r(rnd() - 0.5)} ${r(H * 0.3)} 0 ${r(H * (0.3 + rnd() * 0.4))}" stroke="#9c978d" stroke-width="${r(0.3 + rnd() * 0.5)}" opacity=".35" fill="none"/>`; }
  k += `<rect x="${r(-(x1 - x0) / 2)}" y="-2" width="${x1 - x0}" height="2" fill="#8f8a80"/>`;
  S.teil({ id: "mauer", de: "die Mauer", syl: "MAU-er", it: "il muro", itSyl: "MU-ro", en: "the Wall", x: (x0 + x1) / 2, y: yMb, steht: true, kunst: k,
    tipp: "Von 1961 bis 1989 teilte sie Berlin und Deutschland." });
}

/* =====================================================================
   6 — DIE STAHLSTANGEN (zeigen, wo die Mauer stand)
   ===================================================================== */
{
  const H = yMb - yMt;
  let k = "";
  /* zwei Abschnitte: Mitte (161–236) und rechts (278–320); Ursprung bei x = 198 */
  for (const [a, b] of [[161, 236], [278, 320]]) { for (let x = a; x <= b; x += 2.6) k += `<rect x="${r(x - 198 - 0.6)}" y="${r(-H - 0.4 + (rnd() - 0.5) * 0.6)}" width="1.2" height="${r(H + 0.4)}" fill="${ROST}"/>`; }
  k += `<rect x="-37" y="-1.4" width="76" height="1.4" fill="#8f8a80"/><rect x="80" y="-1.4" width="42" height="1.4" fill="#8f8a80"/>`;
  S.teil({ id: "stange", de: "die Stahlstange", syl: "STAHL-stan-ge", it: "la barra d'acciaio", itSyl: "BAR-ra d'ac-CIA-io", en: "steel rod", x: 198, y: yMb, kunst: k,
    tipp: "Wo die Mauer fehlt, zeigen rostige Stahlstangen, wo sie stand. Man kann hindurchsehen." });
}

/* =====================================================================
   7 — DER MAUERREST (beschädigtes Segment mit Löchern)
   ===================================================================== */
{
  const W = 36, H = yMb - yMt;
  let k = schatten(0, 0.4, W / 2, 1.2, 0.3);
  k += `<path d="M${-W / 2} 0 L${-W / 2} ${r(-H)} L${-W / 2 + 8} ${r(-H)} L${-W / 2 + 11} ${r(-H + 3)} L${-W / 2 + 15} ${r(-H + 1)} L${-W / 2 + 19} ${r(-H + 5)} L${-W / 2 + 22} ${r(-H + 2)} L${W / 2} ${r(-H)} L${W / 2} 0 Z" fill="${BETON}"/>`;
  k += `<rect x="${-W / 2 - 0.4}" y="${r(-H - 2.6)}" width="9" height="3" rx="1.5" fill="#d8d5ce"/><rect x="${W / 2 - 14}" y="${r(-H - 2.6)}" width="14.4" height="3" rx="1.5" fill="#d8d5ce"/>`;
  /* Löcher der Mauerspechte mit Bewehrungseisen */
  for (const [x, y, w, h] of [[-8, -20, 7, 6], [3, -14, 6, 8], [-12, -8, 5, 5], [8, -24, 5, 4]]) {
    k += `<path d="M${x} ${y} q${w * 0.2} ${-h * 0.4} ${w * 0.6} ${-h * 0.1} q${w * 0.4} ${h * 0.4} ${w * 0.3} ${h * 0.8} q${-w * 0.5} ${h * 0.4} ${-w * 0.9} 0 Z" fill="#77736b" stroke="#a9a59c" stroke-width=".4"/>`;
    k += `<path d="M${x + 0.6} ${y - h * 0.2} h${w * 0.7} M${x + w * 0.35} ${y - h * 0.4} v${h * 0.9}" stroke="#6e3519" stroke-width=".45"/>`;
  }
  k += `<rect x="${-W / 2}" y="-2" width="${W}" height="2" fill="#8f8a80"/>`;
  S.teil({ id: "mauerrest", de: "der Mauerrest", syl: "MAU-er-rest", it: "il resto del muro", itSyl: "RE-sto del MU-ro", en: "remains of the Wall", x: 257, y: yMb, steht: true, kunst: k,
    tipp: "Ein Stück Mauer blieb stehen — als Denkmal. Die Löcher schlugen 1989 die „Mauerspechte“ hinein." });
}

/* =====================================================================
   11 — DER ALTBAU (links jenseits der Bernauer Straße, Gründerzeit)
   ===================================================================== */
{
  const d = D_MAUER, s = F / d, yb = py(0, d), xr = 92;
  const y = (h) => r(yb - h * s);
  let k = "";
  /* Brandwand rechts (läuft nach hinten) */
  k += `<path d="M${xr} 0 L${r(px(-5.1, d + 14))} 0 L${r(px(-5.1, d + 14))} ${r(py(0, d + 14))} L${xr} ${r(yb)} Z" fill="${S.lg("brandwand", [[0, "#b9a58a"], [1, "#9c8a72"]])}"/>`;
  k += `<rect x="0" y="0" width="${xr}" height="${r(yb)}" fill="${S.lg("altbau", [[0, "#ead8b4"], [1, "#d9c193"]])}"/>`;
  /* Erdgeschoss mit Laden und Haustür, Rustika-Fugen */
  k += `<rect x="0" y="${y(4.2)}" width="${xr}" height="${r(4.2 * s)}" fill="#cdb689"/>`;
  for (let h = 0.6; h < 4.2; h += 0.6) k += `<line x1="0" y1="${y(h)}" x2="${xr}" y2="${y(h)}" stroke="#b39d70" stroke-width=".4"/>`;
  k += `<rect x="44" y="${y(3.4)}" width="42" height="${r(2.9 * s)}" fill="${S.lg("laden", [[0, "#5d7385"], [1, "#344452"]])}" stroke="#7a6545" stroke-width="1"/>`;
  k += `<rect x="44" y="${y(3.9)}" width="42" height="${r(0.42 * s)}" fill="#2c4a3a"/><text x="65" y="${r(yb - 3.6 * s)}" font-size="3.6" text-anchor="middle" fill="#f3e3b0" font-family="Georgia,serif">Späti</text>`;
  k += `<path d="M${10} ${y(0)} L10 ${y(3)} Q20 ${y(3.9)} 30 ${y(3)} L30 ${y(0)} Z" fill="${S.lg("altuer", [[0, "#6a4a2c"], [1, "#4a321c"]], 0, 0, 1, 0)}"/><path d="M20 ${y(0)} V${y(3.5)}" stroke="#3a2614" stroke-width=".6"/>`;
  /* Gurtgesims */
  k += `<rect x="0" y="${r(yb - 4.5 * s)}" width="${xr}" height="${r(0.3 * s)}" fill="#f4e8cc"/><rect x="0" y="${r(yb - 4.2 * s)}" width="${xr}" height="1" fill="#a68d63"/>`;
  /* Obergeschosse: Fenster mit Stuckverdachung, Balkon mit Gitter */
  for (const [h0, h1] of [[5.2, 7.4], [8.7, 10.9]]) {
    for (const x of [8, 38, 68]) {
      const w = 1.25 * s * 0.92;
      if (yb - h1 * s < -2) continue;
      k += `<rect x="${x}" y="${y(h1)}" width="${r(w)}" height="${r((h1 - h0) * s)}" fill="${S.lg("altfenster", [[0, "#5c7083"], [1, "#2f3b47"]])}" stroke="#f4ead2" stroke-width="1"/>`;
      k += `<path d="M${r(x + w / 2)} ${y(h1)} V${y(h0)} M${x} ${y(h1 - 0.7)} h${r(w)}" stroke="#f4ead2" stroke-width=".7"/>`;
      k += `<path d="M${x - 2} ${y(h1 + 0.25)} L${r(x + w / 2)} ${y(h1 + 0.7)} L${r(x + w + 2)} ${y(h1 + 0.25)} Z" fill="#f4e8cc" stroke="#c9b28a" stroke-width=".4"/>`;
      k += `<rect x="${x - 1}" y="${y(h0)}" width="${r(w + 2)}" height="1.6" fill="#f4e8cc"/>`;
    }
  }
  /* Balkon vor dem mittleren Fenster im 1. OG */
  k += `<rect x="30" y="${y(5.2)}" width="34" height="2" fill="#bfa77c"/><path d="M30 ${y(5.2)} v-12 h34 v12" stroke="#2f3438" stroke-width=".8" fill="none"/>`;
  for (let x = 32; x < 64; x += 2.6) k += `<line x1="${x}" y1="${r(yb - 5.2 * s - 11)}" x2="${x}" y2="${y(5.2)}" stroke="#2f3438" stroke-width=".4"/>`;
  k += `<path d="M38 ${r(yb - 5.2 * s - 6)} q4 -4 8 0 q4 4 8 0" stroke="#2f3438" stroke-width=".4" fill="none"/>`;
  for (let i = 0; i < 6; i++) k += `<circle cx="${33 + i * 5.6}" cy="${r(yb - 5.2 * s - 12.6)}" r="1.4" fill="${i % 2 ? "#d8282c" : "#4f7d3a"}"/>`;
  k += `<rect x="0" y="0" width="${xr}" height="${r(yb)}" fill="${S.lg("altlicht", [[0, "#fff", 0.1], [1, "#000", 0.08]], 0, 0, 1, 0)}"/>`;
  const unter = [
    { id: "balkon", de: "der Balkon", syl: "bal-KON", it: "il balcone", itSyl: "bal-CO-ne", en: "balcony", x: 47, y: r(yb - 5.2 * s), kunst: flaeche(-17, -13, 34, 15),
      tipp: "Auf dem Balkon wachsen Geranien. Viele Berliner Altbauwohnungen haben einen Balkon zur Straße." },
    { id: "spaeti", de: "der Späti", syl: "SPÄ-ti", it: "il minimarket aperto fino a tardi", itSyl: "mi-ni-MAR-ket a-PER-to FI-no a TAR-di", en: "late-night shop", x: 65, y: r(yb - 0.6 * s), kunst: flaeche(-21, -3.4 * s, 42, 2.8 * s),
      tipp: "Der Späti (Spätkauf) hat bis in die Nacht offen — typisch Berlin." },
  ];
  S.teil({ id: "altbau", de: "der Altbau", syl: "ALT-bau", it: "il palazzo storico", itSyl: "pa-LAZ-zo STO-ri-co", en: "old building", x: 0, y: 0, kunst: k,
    zoom: { x: 0, y: 44, w: 96, h: 64 }, unter,
    tipp: "Altbauten aus der Zeit um 1900 haben hohe Decken, Stuck und Balkone." });
}

const cx = (v) => r(Math.min(160, Math.max(-160, v)));
/* =====================================================================
   8 — DIE STRASSE (Bernauer Straße und Seitenstraße mit Berliner Gehweg)
   ===================================================================== */
{
  const yB0 = py(0, D_MAUER - 1.5), yB1 = py(0, 19.5);
  let k = "";
  /* Gehweg vor der Mauer, Fahrbahn der Bernauer Straße */
  k += `<rect x="-160" y="${r(py(0, D_MAUER) - 200)}" width="320" height="${r(yB0 - py(0, D_MAUER))}" fill="#c6c1b6"/>`;
  k += `<rect x="-160" y="${r(yB0 - 200)}" width="320" height="${r(yB1 - yB0)}" fill="${S.lg("asph", [[0, "#7c7a76"], [1, "#686662"]])}"/>`;
  k += `<line x1="-160" y1="${r(py(0, 24) - 200)}" x2="160" y2="${r(py(0, 24) - 200)}" stroke="#eee" stroke-width=".5" stroke-dasharray="6 6"/>`;
  /* Seitenstraße (wir stehen darin), Fahrbahn zwischen L = ±3,6 */
  k += `<path d="M${cx(px(-3.6, 19.5) - 160)} ${r(yB1 - 200)} L${cx(px(3.6, 19.5) - 160)} ${r(yB1 - 200)} L${cx(px(3.6, 7.3) - 160)} 0 L${cx(px(-3.6, 7.3) - 160)} 0 Z" fill="${S.lg("asph2", [[0, "#6e6c68"], [1, "#55534f"]])}"/>`;
  /* Gehwege links und rechts: Granitplatten in der Mitte, Mosaik am Rand */
  for (const s of [-1, 1]) {
    const a = 3.6, b = s < 0 ? 6 : 8.4;
    k += `<path d="M${cx(px(s * a, 19.5) - 160)} ${r(yB1 - 200)} L${cx(px(s * b, 19.5) - 160)} ${r(yB1 - 200)} L${cx(px(s * b, 7.3) - 160)} 0 L${cx(px(s * a, 7.3) - 160)} 0 Z" fill="#b5ada0"/>`;
    k += `<path d="M${cx(px(s * 4.4, 19.5) - 160)} ${r(yB1 - 200)} L${cx(px(s * 5.6, 19.5) - 160)} ${r(yB1 - 200)} L${cx(px(s * 5.6, 7.3) - 160)} 0 L${cx(px(s * 4.4, 7.3) - 160)} 0 Z" fill="#cfcac0"/>`;
    for (const d of [8.4, 9.8, 11.6, 14, 17]) k += `<line x1="${cx(px(s * 4.4, d) - 160)}" y1="${r(py(0, d) - 200)}" x2="${cx(px(s * 5.6, d) - 160)}" y2="${r(py(0, d) - 200)}" stroke="#a49d90" stroke-width=".4"/>`;
    k += `<path d="M${cx(px(s * a, 19.5) - 160)} ${r(yB1 - 200)} L${cx(px(s * a, 7.3) - 160)} 0" stroke="#e6e2da" stroke-width="1"/>`;
    /* Asphaltflicken */
    k += `<path d="M${r(px(s * 1.4, 11) - 160)} ${r(py(0, 11) - 200)} l14 -1 l3 4 l-16 1 Z" fill="#605e5a" opacity=".5"/>`;
  }
  /* Bordstein der Bernauer Straße */
  k += `<rect x="-160" y="${r(yB1 - 200)}" width="320" height="1" fill="#e6e2da"/><rect x="-160" y="${r(yB0 - 200 - 0.6)}" width="320" height=".8" fill="#e6e2da"/>`;
  /* Gullydeckel und Zebrastreifen über die Bernauer Straße */
  k += `<g transform="translate(${r(px(2.4, 13) - 160)} ${r(py(0, 13) - 200)}) scale(1 .35)" stroke="#eceae4" stroke-width="1.2" fill="none"><circle cx="-7" cy="-6" r="5"/><circle cx="7" cy="-6" r="5"/><path d="M-7 -6 L-2 -14 L5 -14 L7 -6 M-2 -14 L0 -6 L5 -14"/></g>`;
  k += `<ellipse cx="${r(px(2.2, 10.5) - 160)}" cy="${r(py(0, 10.5) - 200)}" rx="5" ry="1.4" fill="#3b3a37"/>`;
  S.teil({ id: "strasse", de: "die Straße", syl: "STRA-ße", it: "la strada", itSyl: "STRA-da", en: "street", x: 160, y: 200, kunst: k,
    tipp: "Die Bernauer Straße gehörte zum Westen. Die Häuser auf der anderen Seite lagen im Osten." });
}

/* DER ZEBRASTREIFEN über die Bernauer Straße */
{
  let k = "";
  for (let d = 20; d < 28.4; d += 1.1) k += `<path d="M${P(-2.6, d)} L${P(2.6, d)} L${P(2.6, d + 0.55)} L${P(-2.6, d + 0.55)} Z" fill="#eceae4"/>`;
  S.teil({ oben: true, id: "zebrastreifen", de: "der Zebrastreifen", syl: "ZE-bra-strei-fen", it: "le strisce pedonali", itSyl: "STRI-sce pe-do-NA-li", en: "zebra crossing", x: 0, y: 0, kunst: k,
    tipp: "Am Zebrastreifen müssen Autos halten, wenn jemand über die Straße gehen will." });
}

/* =====================================================================
   9 — DER TRABANT und 10 — DAS WESTAUTO (VW Käfer), geparkt
   ===================================================================== */
const sAuto = F / 21.5, yAuto = py(0, 21.5);
{
  /* Trabant 601: kantig, kurze Motorhaube, helles Pastellblau, weißes Dach */
  const s = sAuto, L = 3.55 * s, H = 1.44 * s;
  let k = schatten(0, 0.4, L / 2 + 1, 1.4, 0.35);
  k += `<path d="M${r(-L / 2)} ${r(-H * 0.28)} L${r(-L / 2)} ${r(-H * 0.55)} Q${r(-L / 2 + 0.5)} ${r(-H * 0.62)} ${r(-L / 2 + 3)} ${r(-H * 0.63)} L${r(-L * 0.24)} ${r(-H * 0.64)} L${r(-L * 0.14)} ${r(-H)} L${r(L * 0.26)} ${r(-H)} L${r(L * 0.36)} ${r(-H * 0.64)} L${r(L / 2 - 1)} ${r(-H * 0.6)} Q${r(L / 2)} ${r(-H * 0.55)} ${r(L / 2)} ${r(-H * 0.4)} L${r(L / 2)} ${r(-H * 0.28)} Z" fill="${S.lg("trabi", [[0, "#cfe3e8"], [1, "#9fc0c8"]])}"/>`;
  k += `<path d="M${r(-L * 0.15)} ${r(-H)} L${r(L * 0.26)} ${r(-H)} L${r(L * 0.27)} ${r(-H * 0.96)} L${r(-L * 0.15)} ${r(-H * 0.96)} Z" fill="#f2f2ee"/>`;
  k += `<path d="M${r(-L * 0.22)} ${r(-H * 0.66)} L${r(-L * 0.13)} ${r(-H * 0.94)} L${r(L * 0.04)} ${r(-H * 0.94)} L${r(L * 0.04)} ${r(-H * 0.66)} Z M${r(L * 0.07)} ${r(-H * 0.66)} L${r(L * 0.07)} ${r(-H * 0.94)} L${r(L * 0.24)} ${r(-H * 0.94)} L${r(L * 0.33)} ${r(-H * 0.66)} Z" fill="#3c4c58"/>`;
  k += `<path d="M${r(-L / 2)} ${r(-H * 0.36)} H${r(L / 2)}" stroke="#7e9ea6" stroke-width=".5"/><path d="M${r(-L * 0.12)} ${r(-H * 0.62)} v${r(H * 0.32)} M${r(L * 0.08)} ${r(-H * 0.62)} v${r(H * 0.32)}" stroke="#7e9ea6" stroke-width=".35"/>`;
  for (const x of [-L * 0.3, L * 0.3]) k += `<circle cx="${r(x)}" cy="${r(-H * 0.25)}" r="${r(H * 0.26)}" fill="#1e2124"/><circle cx="${r(x)}" cy="${r(-H * 0.25)}" r="${r(H * 0.13)}" fill="#d4d7da"/>`;
  k += `<rect x="${r(-L / 2 - 0.4)}" y="${r(-H * 0.34)}" width="2.2" height="1.4" rx=".4" fill="#c9cdd0"/><rect x="${r(L / 2 - 1.8)}" y="${r(-H * 0.34)}" width="2.2" height="1.4" rx=".4" fill="#c9cdd0"/>`;
  k += `<circle cx="${r(-L / 2 + 0.8)}" cy="${r(-H * 0.48)}" r=".9" fill="#fff8d6"/>`;
  k += `<path d="M${r(-L * 0.2)} ${r(-H * 0.68)} L${r(L * 0.3)} ${r(-H * 0.68)}" stroke="#fff" stroke-width=".4" opacity=".5"/>`;
  S.teil({ id: "trabant_ow", de: "der Trabant", syl: "Tra-BANT", it: "la Trabant", itSyl: "tra-BANT", en: "Trabant", x: 110, y: yAuto, steht: true, kunst: k,
    tipp: "Das Auto im Osten. Auf einen Trabant wartete man Jahre." });
}
{
  /* VW Käfer: runde Form, Kotflügel, Trittbrett, Rot */
  const s = sAuto, L = 4.07 * s, H = 1.5 * s;
  let k = schatten(0, 0.4, L / 2 + 1, 1.4, 0.35);
  /* Kotflügel */
  for (const x of [-L * 0.3, L * 0.32]) k += `<path d="M${r(x - H * 0.42)} ${r(-H * 0.22)} Q${r(x - H * 0.4)} ${r(-H * 0.62)} ${r(x)} ${r(-H * 0.64)} Q${r(x + H * 0.4)} ${r(-H * 0.62)} ${r(x + H * 0.42)} ${r(-H * 0.22)} Z" fill="#a8261f"/>`;
  /* Karosserie: Buckel */
  k += `<path d="M${r(-L / 2)} ${r(-H * 0.3)} Q${r(-L / 2)} ${r(-H * 0.62)} ${r(-L * 0.3)} ${r(-H * 0.7)} Q${r(-L * 0.12)} ${r(-H * 1.02)} ${r(L * 0.06)} ${r(-H)} Q${r(L * 0.3)} ${r(-H * 0.96)} ${r(L * 0.42)} ${r(-H * 0.6)} Q${r(L / 2)} ${r(-H * 0.5)} ${r(L / 2)} ${r(-H * 0.3)} Z" fill="${S.lg("kaefer", [[0, "#e04a3c"], [1, "#a8261f"]])}"/>`;
  k += `<path d="M${r(-L * 0.24)} ${r(-H * 0.68)} Q${r(-L * 0.1)} ${r(-H * 0.94)} ${r(L * 0.04)} ${r(-H * 0.93)} L${r(L * 0.04)} ${r(-H * 0.68)} Z M${r(L * 0.08)} ${r(-H * 0.68)} L${r(L * 0.08)} ${r(-H * 0.92)} Q${r(L * 0.24)} ${r(-H * 0.88)} ${r(L * 0.3)} ${r(-H * 0.68)} Z" fill="#3c4c58"/>`;
  k += `<path d="M${r(-L * 0.18)} ${r(-H * 0.4)} h${r(L * 0.36)}" stroke="#8a1e18" stroke-width=".4"/><rect x="${r(-L * 0.1)}" y="${r(-H * 0.6)}" width="1.6" height=".5" rx=".2" fill="#e6e6e6"/>`;
  k += `<path d="M${r(-L * 0.2)} ${r(-H * 0.22)} h${r(L * 0.4)}" stroke="#2a2a2a" stroke-width="1"/>`;
  for (const x of [-L * 0.3, L * 0.32]) k += `<circle cx="${r(x)}" cy="${r(-H * 0.22)}" r="${r(H * 0.25)}" fill="#1e2124"/><circle cx="${r(x)}" cy="${r(-H * 0.22)}" r="${r(H * 0.14)}" fill="#e3e6e8"/>`;
  k += `<rect x="${r(-L / 2 - 0.6)}" y="${r(-H * 0.36)}" width="2.6" height="1.2" rx=".5" fill="#e6e6e6"/><rect x="${r(L / 2 - 2)}" y="${r(-H * 0.36)}" width="2.6" height="1.2" rx=".5" fill="#e6e6e6"/>`;
  k += `<ellipse cx="${r(L / 2 - 1.2)}" cy="${r(-H * 0.55)}" rx="1" ry="1.3" fill="#fff8d6"/>`;
  k += `<rect x="${r(-L / 2 - 1.4)}" y="${r(-H * 0.3)}" width="3" height="1" rx=".5" fill="#d9dde0"/><rect x="${r(L / 2 - 1.6)}" y="${r(-H * 0.3)}" width="3" height="1" rx=".5" fill="#d9dde0"/>`;
  for (let i = 0; i < 4; i++) k += `<line x1="${r(-L * 0.44 + i * 1.1)}" y1="${r(-H * 0.5)}" x2="${r(-L * 0.42 + i * 1.1)}" y2="${r(-H * 0.4)}" stroke="#7a1a14" stroke-width=".4"/>`;
  k += `<path d="M${r(-L * 0.26)} ${r(-H * 0.76)} Q${r(-L * 0.1)} ${r(-H * 0.98)} ${r(L * 0.1)} ${r(-H * 0.96)}" stroke="#fff" stroke-width=".6" opacity=".45" fill="none"/>`;
  S.teil({ id: "westauto", de: "das Westauto", syl: "WEST-au-to", it: "l'auto dell'Ovest", itSyl: "AU-to del-l'O-vest", en: "car in the West", x: 204, y: yAuto + 0.6, steht: true, kunst: k,
    tipp: "Im Westen fuhr man Käfer, Kadett und Golf — das Wirtschaftswunder auf vier Rädern." });
}

/* =====================================================================
   12 — DIE INFOTAFEL (Infostele der Gedenkstätte) — mit Lupe
   ===================================================================== */
{
  const d = 29, L = -6.9, s = F / d, x = px(L, d), y = py(0, d);
  const W = 0.62 * s, H = 2.1 * s;
  const unter = [];
  let k = schatten(0, 0.3, W / 2 + 1, 0.8, 0.35);
  k += `<rect x="${r(-W / 2)}" y="${r(-H)}" width="${r(W)}" height="${r(H)}" fill="${ROST}"/>`;
  k += `<rect x="${r(-W / 2 + 0.6)}" y="${r(-H + 1)}" width="${r(W - 1.2)}" height="3" fill="#2b2b2b"/><text x="0" y="${r(-H + 3.2)}" font-size="1.6" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-weight="bold">10.11.1989</text>`;
  /* Foto: Menschen mit Fahnen auf der Mauer vor dem Brandenburger Tor */
  const fx = -W / 2 + 0.6, fy = -H + 4.6, fw = W - 1.2, fh = fw * 0.8;
  k += `<rect x="${r(fx)}" y="${r(fy)}" width="${r(fw)}" height="${r(fh)}" fill="${S.lg("foto", [[0, "#3c4652"], [1, "#6a6f75"]])}"/>`;
  const tx = 0, tyb = fy + fh * 0.62, tw = fw * 0.72, th = fh * 0.42;
  let tor = `<rect x="${r(tx - tw / 2)}" y="${r(tyb - th)}" width="${r(tw)}" height="${r(th * 0.2)}" fill="#c9c3b6"/>`;
  for (let i = 0; i < 6; i++) tor += `<rect x="${r(tx - tw / 2 + i * tw / 5.6)}" y="${r(tyb - th * 0.8)}" width="${r(tw / 14)}" height="${r(th * 0.8)}" fill="#c9c3b6"/>`;
  tor += `<path d="M${r(tx - tw * 0.18)} ${r(tyb - th)} L${r(tx - tw * 0.1)} ${r(tyb - th * 1.32)} L${r(tx + tw * 0.1)} ${r(tyb - th * 1.32)} L${r(tx + tw * 0.18)} ${r(tyb - th)} Z" fill="#b4ae9f"/><path d="M${r(tx - tw * 0.08)} ${r(tyb - th * 1.32)} l${r(tw * 0.06)} ${r(-th * 0.22)} l${r(tw * 0.06)} ${r(th * 0.22)}" fill="#8a8578"/>`;
  k += tor;
  unter.push({ id: "brandenburger_tor", de: "das Brandenburger Tor", syl: "BRAN-den-bur-ger TOR", it: "la Porta di Brandeburgo", itSyl: "POR-ta di bran-de-BUR-go", en: "Brandenburg Gate",
    x: x + tx, y: y + tyb, kunst: flaeche(-tw / 2, -th * 1.5, tw, th * 1.5),
    tipp: "Bis 1989 stand es im Sperrgebiet. Heute geht man hindurch." });
  /* Mauer im Foto mit Menschen und einer Fahne */
  const my = fy + fh * 0.86;
  k += `<rect x="${r(fx)}" y="${r(my - fh * 0.18)}" width="${r(fw)}" height="${r(fh * 0.32)}" fill="#a9a59c"/>`;
  for (let i = 0; i < 9; i++) { const hx = fx + 0.8 + i * (fw - 1.6) / 8; k += `<circle cx="${r(hx)}" cy="${r(my - fh * 0.22)}" r=".55" fill="#2a2a2a"/><rect x="${r(hx - 0.5)}" y="${r(my - fh * 0.2)}" width="1" height="1.4" fill="${["#3a4b6a", "#6a3a3a", "#2a2a2a"][i % 3]}"/>`; }
  const flx = fx + fw * 0.7, fly = my - fh * 0.24;
  k += `<line x1="${r(flx)}" y1="${r(fly)}" x2="${r(flx)}" y2="${r(fly - 4.6)}" stroke="#ddd" stroke-width=".25"/>`;
  k += `<rect x="${r(flx)}" y="${r(fly - 4.6)}" width="3.4" height=".8" fill="#111"/><rect x="${r(flx)}" y="${r(fly - 3.8)}" width="3.4" height=".8" fill="#d0021b"/><rect x="${r(flx)}" y="${r(fly - 3)}" width="3.4" height=".8" fill="#f5c400"/>`;
  unter.push({ id: "bundesflagge", de: "die Fahne", syl: "FAH-ne", it: "la bandiera", itSyl: "ban-DIE-ra", en: "flag", x: x + flx + 1.7, y: y + fly - 2.2, kunst: flaeche(-2.2, -3, 4.4, 3.4),
    tipp: "Schwarz, Rot, Gold: Am 10. November 1989 schwenkten die Menschen auf der Mauer Fahnen." });
  /* Text darunter */
  for (let i = 0; i < 6; i++) k += `<rect x="${r(fx)}" y="${r(fy + fh + 1.4 + i * 1.6)}" width="${r(fw * (i === 5 ? 0.6 : 1))}" height=".55" fill="#f0e6dc" opacity=".8"/>`;
  k += `<rect x="${r(-W / 2)}" y="${r(-H)}" width="1" height="${r(H)}" fill="#fff" opacity=".18"/>`;
  S.teil({ id: "infotafel", de: "die Infotafel", syl: "IN-fo-ta-fel", it: "il pannello informativo", itSyl: "pan-NEL-lo in-for-ma-TI-vo", en: "information board", x, y, steht: true, kunst: k,
    zoom: { x: x - 9, y: y - H - 1, w: 18, h: 12 }, unter,
    tipp: "Auf den rostroten Tafeln der Gedenkstätte erzählen Fotos, was hier geschah." });
}

/* =====================================================================
   13 — DAS AMPELMÄNNCHEN (Fußgängerampel an der Ecke, links)
   ===================================================================== */
{
  const d = 12, L = 4.3, s = F / d;
  let k = schatten(0, 0.3, 3, 0.7, 0.35);
  k += `<rect x="-.7" y="${r(-2.7 * s)}" width="1.4" height="${r(2.7 * s)}" fill="${S.lg("ampelmast", [[0, "#6c747b"], [0.5, "#a9b1b8"], [1, "#596168"]], 0, 0, 1, 0)}"/>`;
  const kh = 0.86 * s, kw = 0.32 * s, ky = -2.7 * s;
  k += `<rect x="${r(-kw / 2)}" y="${r(ky)}" width="${r(kw)}" height="${r(kh)}" rx="1" fill="#2f3438"/>`;
  /* oben rot: stehendes Ost-Ampelmännchen mit Hut (aus) */
  const feld = (cy, an, farbe, geht) => {
    let g = `<circle cx="0" cy="${r(cy)}" r="${r(kw * 0.38)}" fill="${an ? "#0d0d0d" : "#151515"}"/>`;
    const m = kw * 0.034, c = an ? farbe : "#4a2a2a";
    if (geht) g += `<g transform="translate(0 ${r(cy)}) scale(${r(m * 10) / 10})" fill="${c}"><path d="M-3 -6.6 h6 l-.6 1 h-4.8 Z"/><ellipse cx="0" cy="-7" rx="2.4" ry=".8"/><circle cx="0" cy="-4.2" r="1.6"/><path d="M-1.6 -2.4 h3 l2.6 3 -1 .8 -1.8 -1.6 .2 2.6 2 4 -1.4 .8 -2.4 -3.8 -1.6 3.8 -1.4 -.6 1.4 -4.6 .2 -2.6 -2 1.6 -.8 -1 Z"/></g>`;
    else g += `<g transform="translate(0 ${r(cy)}) scale(${r(m * 10) / 10})" fill="${c}"><path d="M-3 -6.6 h6 l-.6 1 h-4.8 Z"/><ellipse cx="0" cy="-7" rx="2.4" ry=".8"/><circle cx="0" cy="-4.2" r="1.6"/><path d="M-1.6 -2.4 h3.2 l4 1.2 v1.2 l-4 -.6 v2.6 l.6 5 h-1.6 l-.6 -4 -.6 4 h-1.6 l.6 -5 v-2.6 l-4 .6 v-1.2 Z"/></g>`;
    return g;
  };
  k += feld(ky + kh * 0.27, false, "#ff3b30", false) + feld(ky + kh * 0.73, true, "#4cff7a", true);
  k += `<rect x="${r(-kw / 2 - 0.4)}" y="${r(ky - 0.8)}" width="${r(kw + 0.8)}" height="1" rx=".4" fill="#2f3438"/>`;
  /* Taster für Fußgänger */
  k += `<rect x="-2.2" y="${r(-1.2 * s)}" width="4.4" height="5" rx=".8" fill="#f2c230"/><rect x="-1.4" y="${r(-1.2 * s + 1)}" width="2.8" height="1.2" fill="#2f3438"/>`;
  S.teil({ id: "ampelmaennchen", de: "das Ampelmännchen", syl: "AM-pel-männ-chen", it: "l'omino del semaforo", itSyl: "o-MI-no del se-MA-fo-ro", en: "pedestrian light", x: px(L, d), y: py(0, d), steht: true, kunst: k,
    tipp: "Das Ampelmännchen mit Hut kommt aus der DDR — es gibt es bis heute." });
}

/* =====================================================================
   14 — DIE WERBETAFEL (beleuchtete Plakatvitrine, rechts vorne)
   ===================================================================== */
{
  const d = 13, L = -4.2, s = F / d;
  const W = 1.25 * s, H = 1.8 * s, auf = 0.45 * s;
  let k = schatten(0, 0.3, W / 2 + 2, 1, 0.35);
  k += `<rect x="-1.4" y="${r(-auf - 1)}" width="2.8" height="${r(auf + 1)}" fill="#3a4045"/>`;
  k += `<rect x="${r(-W / 2 - 1.6)}" y="${r(-auf - H - 1.6)}" width="${r(W + 3.2)}" height="${r(H + 3.2)}" rx="1.2" fill="${S.lg("vitrine", [[0, "#5d666e"], [1, "#3a4045"]])}"/>`;
  k += `<rect x="${r(-W / 2)}" y="${r(-auf - H)}" width="${r(W)}" height="${r(H)}" fill="${S.lg("plakat", [[0, "#fdf3d6"], [1, "#f5c86a"]])}"/>`;
  /* Plakat: Werbung für ein Mauer-Fahrradtour-Angebot (erfundene Marke) */
  k += `<text x="0" y="${r(-auf - H + 9)}" font-size="5.2" text-anchor="middle" fill="#1f3f6e" font-family="Arial,sans-serif" font-weight="bold">BERLIN</text>`;
  k += `<text x="0" y="${r(-auf - H + 14.4)}" font-size="3.6" text-anchor="middle" fill="#1f3f6e" font-family="Arial,sans-serif">per Rad</text>`;
  k += `<circle cx="-6" cy="${r(-auf - H * 0.32)}" r="4.4" fill="none" stroke="#1f3f6e" stroke-width=".9"/><circle cx="7" cy="${r(-auf - H * 0.32)}" r="4.4" fill="none" stroke="#1f3f6e" stroke-width=".9"/><path d="M-6 ${r(-auf - H * 0.32)} L-1 ${r(-auf - H * 0.32 - 6)} L5 ${r(-auf - H * 0.32 - 6)} L7 ${r(-auf - H * 0.32)} M-1 ${r(-auf - H * 0.32 - 6)} L1 ${r(-auf - H * 0.32)} L5 ${r(-auf - H * 0.32 - 6)}" stroke="#c8402f" stroke-width="1" fill="none"/>`;
  k += `<text x="0" y="${r(-auf - 4)}" font-size="2.6" text-anchor="middle" fill="#1f3f6e" font-family="Arial,sans-serif">160 km Mauerweg</text>`;
  k += `<path d="M${r(-W / 2)} ${r(-auf - H)} L${r(-W / 2 + 10)} ${r(-auf - H)} L${r(-W / 2)} ${r(-auf - H + 22)} Z" fill="#fff" opacity=".3"/>`;
  S.teil({ id: "werbetafel", de: "die Werbetafel", syl: "WER-be-ta-fel", it: "il cartellone", itSyl: "car-tel-LO-ne", en: "billboard", x: px(L, d), y: py(0, d), steht: true, kunst: k,
    tipp: "Auf dem Plakat wirbt die Stadt für den Mauerweg: 160 Kilometer mit dem Rad entlang der früheren Grenze." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/ost_west.js"));
console.log(aus);
