#!/usr/bin/env node
/* =====================================================================
   DIE STADT (FASSUNG 852) — Bilderwelt neu, Navigations-Szene
   ---------------------------------------------------------------------
   XANDER (Funk 263/286): jeder Ort authentisch wie das Vorbild, alles
   logisch platziert, jedes Ding einzeln antippbar.

   RECHERCHE (Stadtgrundriss deutscher Mittelstädte, z. B. Schwäbisch
   Hall, Wernigerode, Meißen, Göttingen; Luftbilder vom Aussichtsturm):
   - Mitte: die ALTSTADT — dicht gedrängte Giebelhäuser mit roten
     Ziegeldächern, der Marktplatz mit Marktständen und Brunnen, daneben
     die Marktkirche mit hohem, grünem Kupferhelm.
   - Um die Altstadt ein RING (wo früher die Stadtmauer stand), daran die
     Gründerzeit-Erweiterung: neues Rathaus mit Turm und Fahne,
     Amtsgericht mit Säulen, Verwaltungsbauten (Behördenviertel); auf der
     anderen Seite Stadttheater (Säulenvorhalle + hoher Bühnenturm),
     Museum mit Kuppel, Stadthalle (Kulturviertel).
   - Außen: Wohngebiete (Mehrfamilienhäuser und Einfamilienhäuser mit
     Gärten), das GEWERBEGEBIET mit flachen Blechhallen, Solardächern,
     Lkw-Höfen; der BAHNHOF lag im 19. Jh. am damaligen Stadtrand, davor
     Gleisfeld, Bahnsteigdächer, Park-and-ride; dahinter Felder,
     Wald und Windräder auf den Hügeln.
   - Der Fluss mit Steinbrücke und Uferpark (Wiesen, Bäume, Fußweg,
     Ausflugsschiff). Am Aussichtspunkt steht ein grüner Wegweiser.
   Sicht: Schrägluftbild von Süden (vom Aussichtsturm am Fluss),
   Maßstab nimmt nach hinten ab: s(y) = 0,45 … 1,2.
   ===================================================================== */
"use strict";
const path = require("path");
const B = require("../bau");
const { neueSzene, schatten, zufall } = B;
const r = B.r;

const S = neueSzene({ id: "stadt", titel: "Die Stadt", emoji: "🏙️", thema: "Alltag", kuerzel: "sdt", fassung: 852 });
const rnd = zufall(1871);
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);

const s = (y) => 0.45 + (y - 30) * 0.0045;          // Maßstab je Bildhöhe
const hx = (c) => parseInt(c.slice(1), 16);
const dunkel = (c, f) => { const n = hx(c); const k = (v) => Math.max(0, Math.min(255, Math.round(v * f))); return "#" + [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => k(v).toString(16).padStart(2, "0")).join(""); };

/* ---------- Bausteine ------------------------------------------------- */
/* Ein Haus im Schrägluftbild: Vorderwand, Seitenwand (zur Bildmitte),
   Dach (sattel | flach | walm), Fensterreihen als gestrichelte Linien. */
function haus(x, y, o) {
  const k = o.k || s(y), b = o.b * k, h = o.h * k, t = (o.t || o.b * 0.8) * k;
  const sg = x < 160 ? 1 : -1, dx = sg * t * 0.22, dy = -t * 0.5;
  const w = o.w || "#efe6d6", d = o.d || "#b4533a";
  const xl = x - b / 2, xr = x + b / 2, xs = sg > 0 ? xr : xl, top = y - h;
  let g = `<path d="M${r(xl + 1 * k)} ${r(y)}h${r(b)}l${r(2.6 * k)} ${r(1.1 * k)}h${r(-b)}Z" fill="#203018" opacity=".22"/>`;
  g += `<path d="M${r(xs)} ${r(y)}V${r(top)}l${r(dx)} ${r(dy)}V${r(y + dy)}Z" fill="${dunkel(w, 0.72)}"/>`;
  g += `<rect x="${r(xl)}" y="${r(top)}" width="${r(b)}" height="${r(h)}" fill="${w}"/>`;
  if (o.fen !== 0) {
    const st = Math.max(1, Math.floor(o.h / 3.2)), fw = o.fw || 0.7 * k;
    for (let i = 0; i < st; i++) {
      const fy = top + (i + 0.45) * h / st;
      g += `<line x1="${r(xl + 0.9 * k)}" y1="${r(fy)}" x2="${r(xr - 0.5 * k)}" y2="${r(fy)}" stroke="${o.fc || "#5d6f7d"}" stroke-width="${r(Math.min(h / st * 0.5, 1.15 * k))}" stroke-dasharray="${r(fw)} ${r(fw * 1.25)}"/>`;
    }
  }
  if (o.dach === "flach") {
    g += `<path d="M${r(xl)} ${r(top)}H${r(xr)}l${r(dx)} ${r(dy)}H${r(xl + dx)}Z" fill="${d}"/>`;
    g += `<path d="M${r(xl)} ${r(top)}H${r(xr)}" stroke="${dunkel(d, 0.7)}" stroke-width="${r(0.5 * k)}"/>`;
  } else {
    const rh = (o.rh || o.b * 0.32) * k, mx = dx / 2, my = dy / 2 - rh;
    if (o.dach === "walm") {
      g += `<path d="M${r(xl)} ${r(top)}H${r(xr)}L${r(xr - b * 0.22 + mx)} ${r(top + my)}H${r(xl + b * 0.22 + mx)}Z" fill="${d}"/>`;
      g += `<path d="M${r(xs)} ${r(top)}l${r(dx)} ${r(dy)}L${r(xs - sg * b * 0.22 + mx)} ${r(top + my)}Z" fill="${dunkel(d, 0.75)}"/>`;
    } else {
      g += `<path d="M${r(xs)} ${r(top)}l${r(dx)} ${r(dy)}L${r(xs + mx)} ${r(top + my)}Z" fill="${dunkel(w, 0.8)}"/>`;
      g += `<path d="M${r(xl)} ${r(top)}H${r(xr)}l${r(mx)} ${r(my)}H${r(xl + mx)}Z" fill="${d}"/>`;
    }
    g += `<path d="M${r(xl + mx)} ${r(top + my)}H${r(xr + mx)}" stroke="#fff" stroke-width="${r(0.35 * k)}" opacity=".35"/>`;
  }
  return g;
}
const BAUM = S.rg("baum", [[0, "#8fbf5a"], [0.55, "#4f8a35"], [1, "#2f5a22"]], 0.38, 0.32, 0.7);
const BAUM2 = S.rg("baum2", [[0, "#a9c86a"], [0.6, "#6b9a3e"], [1, "#3e6526"]], 0.38, 0.32, 0.7);
function baum(x, y, g = 1, art) {
  const k = s(y) * g;
  return `<ellipse cx="${r(x + 1.6 * k)}" cy="${r(y + 0.3)}" rx="${r(2.6 * k)}" ry="${r(1 * k)}" fill="#1d2a12" opacity=".25"/><circle cx="${r(x)}" cy="${r(y - 2.2 * k)}" r="${r(2.5 * k)}" fill="${art ? BAUM2 : BAUM}"/>`;
}
function auto(x, y, f, quer) {
  const k = s(y);
  return quer ? `<rect x="${r(x)}" y="${r(y - 1.6 * k)}" width="${r(1.6 * k)}" height="${r(3 * k)}" rx="${r(0.5 * k)}" fill="${f}"/>`
    : `<rect x="${r(x)}" y="${r(y - 1.1 * k)}" width="${r(3.2 * k)}" height="${r(1.6 * k)}" rx="${r(0.5 * k)}" fill="${f}"/>`;
}
const AUTOFARBEN = ["#c9ccd0", "#2c3e57", "#a12b25", "#f2f2ee", "#4a4f55", "#1f5d8a", "#d8d2c0", "#222"];
const grund = (d, fill, extra = "") => `<path d="${d}" fill="${fill}" stroke="#dcd8cc" stroke-width=".9" stroke-linejoin="round"${extra}/>`;
/* Punkte auf einer Ellipse (Ring um die Altstadt) */
const ell = (cx, cy, rx, ry, a0, a1, n) => { const p = []; for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; p.push(`${r(cx + Math.cos(a) * rx)} ${r(cy + Math.sin(a) * ry)}`); } return p; };
const MX = 162, MY = 98;          // Mitte der Altstadt
const RING = { rx: 50, ry: 41 };   // Außenkante des Rings
const winkelBeiY = (y, unten) => { const v = Math.asin(Math.max(-1, Math.min(1, (y - MY) / RING.ry))); return unten ? v : v; };

/* teil(): Kunst in Bildkoordinaten, verschoben auf den Ankerpunkt */
function teil(t, kunst) {
  t.kunst = `<g transform="translate(${-t.x} ${-t.y})">${kunst}</g>`;
  S.teil(t);
}

/* =====================================================================
   KULISSE: Himmel, Hügel mit Wald und Windrädern, Felder, Straßennetz
   ===================================================================== */
S.hinten(`<rect width="320" height="40" fill="${S.lg("himmel", [[0, "#7fb2e0"], [0.7, "#c4ddef"], [1, "#e8eef0"]])}"/>`);
S.hinten(`<g fill="#fff" opacity=".75"><ellipse cx="60" cy="9" rx="20" ry="3.2"/><ellipse cx="74" cy="7.4" rx="11" ry="3"/><ellipse cx="236" cy="12" rx="24" ry="3"/><ellipse cx="252" cy="10" rx="10" ry="2.6"/></g>`);
S.hinten(`<path d="M0 26 Q40 16 90 22 T190 19 T270 21 T320 18 V34 H0Z" fill="#9db7a8"/>`);
S.hinten(`<path d="M0 30 Q50 22 110 27 T210 25 T320 26 V36 H0Z" fill="${S.lg("wald", [[0, "#5b7d4c"], [1, "#466a3a"]])}"/>`);
{ let w = ""; for (const [x, y] of [[34, 24], [46, 22.5], [284, 21], [296, 22]]) w += `<path d="M${x} ${y}v-6" stroke="#f4f6f6" stroke-width=".35"/><path d="M${x} ${y - 6}l-2.2 -1.1M${x} ${y - 6}l2.1 -1.2M${x} ${y - 6}l.1 2.4" stroke="#f4f6f6" stroke-width=".3"/>`; S.hinten(w); }
/* Grundfläche = Straßen (alles, was zwischen den Vierteln frei bleibt) */
S.hinten(`<rect y="30" width="320" height="170" fill="#7f8382"/>`);
/* Ring um die Altstadt mit Mittellinie, Ausfallstraßen mit Mittellinie */
S.hinten(`<ellipse cx="${MX}" cy="${MY}" rx="47.5" ry="38.6" fill="none" stroke="#f3f1e6" stroke-width=".3" stroke-dasharray="1.2 1.2"/>`);
S.hinten(`<path d="M0 59H320M162 139V157M117 109H0M207 109H320" stroke="#f3f1e6" stroke-width=".3" stroke-dasharray="1.2 1.2"/>`);
/* Autos auf den Straßen */
{ let a = ""; [[30, 59.6, 0], [88, 59.6, 1], [205, 58.4, 2], [270, 59.6, 3], [40, 109.8, 4], [282, 108.4, 5], [160.4, 148, 6, 1], [163, 142, 7, 1]].forEach(([x, y, i, q]) => { a += auto(x, y, AUTOFARBEN[i], q); }); S.hinten(a); }

/* =====================================================================
   1 — DER STADTRAND mit Bahnhof, Gleisfeld, Park-and-ride, Feldern
   ===================================================================== */
{
  let g = grund("M-2 31.5 L322 30 V57 H-2Z", S.lg("rand", [[0, "#b8b78f"], [1, "#a9aa8c"]]));
  /* Felder hinten */
  const felder = [["#d8c56a", 0, 70], ["#8fae5c", 70, 120], ["#c9b35a", 222, 270], ["#a3bb6a", 270, 320]];
  for (const [f, a, b] of felder) g += `<path d="M${a} 31.6 L${b} 31.2 L${b} 37 L${a} 37 Z" fill="${f}"/>`;
  g += `<path d="M0 34.2H70M222 34H320" stroke="#000" stroke-width=".2" opacity=".2"/>`;
  /* Gleisfeld: Schotter und fünf Gleise */
  g += `<rect x="0" y="43" width="320" height="8" fill="#8a8072"/>`;
  for (let i = 0; i < 5; i++) g += `<path d="M0 ${r(44 + i * 1.5)}H320" stroke="#4c4740" stroke-width=".55" stroke-dasharray="${i % 2 ? "" : "0.4 .25"}"/>`;
  /* Bahnsteige mit Dächern */
  g += `<rect x="96" y="45.6" width="128" height="1.2" fill="#c9c4b8"/><rect x="100" y="45.1" width="120" height=".9" fill="#5f6f7a"/>`;
  g += `<rect x="96" y="48.6" width="128" height="1.2" fill="#c9c4b8"/><rect x="100" y="48.1" width="120" height=".9" fill="#5f6f7a"/>`;
  /* Regionalzug (rot) und ICE (weiß) */
  g += `<rect x="40" y="43.2" width="46" height="1.9" rx=".8" fill="#c8251c"/><path d="M40 43.6H86" stroke="#2b2b2b" stroke-width=".5" stroke-dasharray="1.4 .6"/>`;
  g += `<rect x="230" y="46.3" width="62" height="1.9" rx=".9" fill="#f1f1ee"/><path d="M230 47.2H292" stroke="#c8251c" stroke-width=".35"/><path d="M231 46.8H291" stroke="#2b2b2b" stroke-width=".45" stroke-dasharray="1.6 .5"/>`;
  /* Bahnhofsgebäude (Gründerzeit, Uhrturm) */
  g += haus(160, 57, { b: 64, h: 9, t: 8, w: "#e2c9a2", d: "#7d8a8f", k: 0.62, dach: "walm", fc: "#4d5a63" });
  g += haus(160, 57, { b: 18, h: 13, t: 10, w: "#e8d2ad", d: "#6f7d82", k: 0.62, dach: "walm", fc: "#4d5a63" });
  g += `<rect x="158.2" y="44" width="3.6" height="5.6" fill="#e8d2ad"/><path d="M157.8 44 L160 41.3 L162.2 44Z" fill="#6f7d82"/><circle cx="160" cy="46.2" r="1.1" fill="#fff" stroke="#3a3a3a" stroke-width=".25"/>`;
  g += `<rect x="146" y="55" width="28" height="1.6" fill="#24557a"/><text x="160" y="56.3" font-size="1.4" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">Hauptbahnhof</text>`;
  /* Park-and-ride rechts, Häuser links */
  g += `<rect x="200" y="51.5" width="40" height="5" fill="#7e807d"/>`;
  for (let i = 0; i < 14; i++) g += auto(201 + (i % 7) * 5.6, 53.4 + Math.floor(i / 7) * 2.6, AUTOFARBEN[(i * 3) % 8], 1);
  for (let i = 0; i < 6; i++) g += haus(14 + i * 13, 56.5, { b: 9, h: 5, w: ["#efe6d6", "#e9dcc4", "#f4efe6"][i % 3], d: ["#a54a33", "#8e3b2a", "#5f5f63"][i % 3], k: 0.6 });
  for (const x of [262, 276, 290, 304]) g += haus(x, 56.5, { b: 10, h: 5, w: "#e6e2da", d: "#7a4033", k: 0.6 });
  for (const [x, y] of [[8, 40.5], [16, 41], [118, 40.5], [212, 40.8], [300, 40.5], [312, 41]]) g += baum(x, y, 0.9);
  teil({ id: "sv_rand", de: "der Stadtrand", syl: "STADT-rand", it: "la periferia", itSyl: "pe-ri-fe-RI-a", en: "the edge of town", x: 120, y: 54,
    tipp: "Antippen führt in dieses Viertel hinein.", lupe: "viertel_rand" }, g);
}

/* =====================================================================
   2 — DAS BEHÖRDENVIERTEL (links): neues Rathaus, Amtsgericht, Ämter
   ===================================================================== */
const ringPunkte = (y0, y1, seite) => {
  const a0 = Math.asin((y0 - MY) / RING.ry), a1 = Math.asin((y1 - MY) / RING.ry);
  return seite < 0 ? ell(MX, MY, RING.rx, RING.ry, Math.PI - a0, Math.PI - a1, 10) : ell(MX, MY, RING.rx, RING.ry, a0, a1, 10);
};
{
  let g = grund(`M-2 62 L${ringPunkte(62, 106, -1).join(" L")} L-2 107Z`, S.lg("beh", [[0, "#d3cdbd"], [1, "#c9c2b0"]]));
  /* Rasen und Platz vor dem Rathaus */
  g += `<path d="M10 92 H70 L72 104 H8Z" fill="#7da653"/><path d="M38 92V104M10 98H71" stroke="#d9d4c3" stroke-width=".8"/>`;
  g += `<circle cx="38.5" cy="98" r="2" fill="#b9d4e4" stroke="#d9d4c3" stroke-width=".5"/>`;
  /* Bürogebäude hinten (Glas, Flachdach) */
  g += haus(14, 72, { b: 18, h: 13, w: "#9fb6c7", d: "#b9bbb6", dach: "flach", fc: "#5f7d92" });
  g += haus(106, 74, { b: 16, h: 10, w: "#d9d2c4", d: "#b9bbb6", dach: "flach" });
  /* Amtsgericht (Säulen, Freitreppe) */
  g += haus(86, 86, { b: 22, h: 9, w: "#e7dfcc", d: "#6d7b7f", dach: "walm", fen: 0 });
  { const k = s(86); for (let i = 0; i < 6; i++) g += `<rect x="${r(86 - 8.6 * k + i * 3.3 * k)}" y="${r(86 - 7.2 * k)}" width="${r(0.9 * k)}" height="${r(6.4 * k)}" fill="#fbf7ec"/>`;
    g += `<path d="M${r(86 - 10 * k)} ${r(86 - 7.2 * k)}L86 ${r(86 - 10.4 * k)}L${r(86 + 10 * k)} ${r(86 - 7.2 * k)}Z" fill="#efe8d8" stroke="#bdb39c" stroke-width=".25"/><rect x="${r(86 - 9 * k)}" y="85" width="${r(18 * k)}" height="1" fill="#d8d0bd"/>`; }
  /* Neues Rathaus mit Turm und Fahne */
  g += haus(42, 90, { b: 36, h: 13, t: 16, w: "#e9d8b4", d: "#5d6f6c", dach: "walm", fc: "#4f5e66" });
  { const k = s(90), tx = 42, ty = 90 - 13 * k;
    g += `<rect x="${r(tx - 3.2 * k)}" y="${r(ty - 16 * k)}" width="${r(6.4 * k)}" height="${r(16 * k)}" fill="#e2cfa8"/><rect x="${r(tx + 3.2 * k)}" y="${r(ty - 16 * k)}" width="${r(1.5 * k)}" height="${r(16 * k)}" fill="#b8a582"/>`;
    g += `<circle cx="${tx}" cy="${r(ty - 12 * k)}" r="${r(1.7 * k)}" fill="#fff" stroke="#6b5b3d" stroke-width=".3"/><path d="M${tx} ${r(ty - 12 * k)}v-1M${tx} ${r(ty - 12 * k)}h.8" stroke="#222" stroke-width=".25"/>`;
    g += `<path d="M${r(tx - 3.6 * k)} ${r(ty - 16 * k)}L${tx} ${r(ty - 23 * k)}L${r(tx + 4.7 * k)} ${r(ty - 16 * k)}Z" fill="#4f7f73"/>`;
    g += `<path d="M${tx} ${r(ty - 23 * k)}v-4.2" stroke="#555" stroke-width=".3"/><path d="M${tx} ${r(ty - 23 * k - 4.2)}h3v.7h-3z" fill="#111"/><path d="M${tx} ${r(ty - 23 * k - 3.5)}h3v.7h-3z" fill="#d22"/><path d="M${tx} ${r(ty - 23 * k - 2.8)}h3v.7h-3z" fill="#f2c200"/>`; }
  g += haus(64, 74, { b: 20, h: 11, w: "#f0ebe1", d: "#a8493a", dach: "sattel" });
  g += haus(36, 70, { b: 14, h: 10, w: "#e4ddd0", d: "#8c3f2f" });
  /* weitere Ämter (Landratsamt, Finanzamt) und Polizei */
  g += haus(12, 88, { b: 16, h: 10, w: "#ece6da", d: "#6b7378", dach: "walm" });
  g += haus(118, 66, { b: 14, h: 8, w: "#e2e6e6", d: "#a9aca8", dach: "flach", fc: "#4f6f86" });
  g += haus(100, 94, { b: 14, h: 7, w: "#e8e8e2", d: "#2f5b8c", dach: "flach", fc: "#2f5b8c" });
  /* Parkplatz mit Autos */
  g += `<rect x="2" y="95" width="6" height="11" fill="#8b8d89"/>`;
  for (let i = 0; i < 4; i++) g += auto(2.6, 98 + i * 2.4, AUTOFARBEN[i + 1]);
  for (const [x, y] of [[90, 103], [110, 104], [26, 79], [76, 99], [52, 75], [80, 76], [124, 78], [22, 103]]) g += baum(x, y);
  teil({ id: "sv_behoerden", de: "das Behördenviertel", syl: "Be-HÖR-den-vier-tel", it: "il quartiere degli uffici", itSyl: "quar-TIE-re degli uf-FI-ci", en: "the government quarter", x: 40, y: 92,
    tipp: "Antippen führt in dieses Viertel hinein.", lupe: "viertel_behoerden" }, g);
}

/* =====================================================================
   3 — DAS KULTURVIERTEL (rechts): Stadttheater, Museum, Stadthalle
   ===================================================================== */
{
  let g = grund(`M322 62 L${ringPunkte(62, 106, 1).join(" L")} L322 107Z`, S.lg("kul", [[0, "#ddd2c2"], [1, "#d2c6b3"]]));
  /* Theaterplatz mit Rasen und Wasserbecken */
  g += `<path d="M232 92 H300 L302 104 H230Z" fill="#d6cfbf"/><rect x="248" y="96" width="30" height="5" rx="1" fill="#93c1d9" stroke="#efe9da" stroke-width=".6"/>`;
  g += `<path d="M232 92h14l-1 12h-15z M286 92h14l2 12h-16z" fill="#80a957"/>`;
  /* Stadthalle (modern, geschwungenes Dach) hinten rechts */
  g += haus(296, 72, { b: 26, h: 9, w: "#d8e2e6", d: "#eef0ee", dach: "flach", fc: "#6f8c9c" });
  g += `<path d="M${r(296 - 13 * s(72))} ${r(72 - 9 * s(72))} Q296 ${r(72 - 15 * s(72))} ${r(296 + 13 * s(72))} ${r(72 - 9 * s(72))}" fill="#f7f7f4" stroke="#c2c7c8" stroke-width=".3"/>`;
  /* Museum mit Kupferkuppel */
  g += haus(238, 74, { b: 26, h: 10, w: "#eadfca", d: "#7d8b86", dach: "walm", fc: "#56636b" });
  { const k = s(74); g += `<path d="M${r(238 - 5 * k)} ${r(74 - 12.6 * k)} A${r(5 * k)} ${r(5.4 * k)} 0 0 1 ${r(238 + 5 * k)} ${r(74 - 12.6 * k)}Z" fill="${S.lg("kuppel", [[0, "#8fc4b0"], [1, "#4f8c79"]], 0, 0, 1, 0)}"/><path d="M238 ${r(74 - 18 * k)}v-1.6" stroke="#4f8c79" stroke-width=".5"/>`; }
  /* Stadttheater: Säulenvorhalle + hoher Bühnenturm */
  { const x = 266, y = 92, k = s(y);
    g += haus(x + 4, y - 4, { b: 14, h: 22, t: 12, w: "#d9cdb4", d: "#8a9a95", dach: "sattel", rh: 3, fen: 0 });
    g += haus(x, y, { b: 34, h: 12, t: 18, w: "#efe5cf", d: "#7f8f8a", dach: "walm", fc: "#a0874f" });
    for (let i = 0; i < 6; i++) g += `<rect x="${r(x - 9 * k + i * 3.5 * k)}" y="${r(y - 9.4 * k)}" width="${r(1 * k)}" height="${r(9 * k)}" fill="#fffaf0"/>`;
    g += `<path d="M${r(x - 10.6 * k)} ${r(y - 9.4 * k)}L${x} ${r(y - 13.4 * k)}L${r(x + 10.6 * k)} ${r(y - 9.4 * k)}Z" fill="#f6efdf" stroke="#c2b493" stroke-width=".25"/>`;
    g += `<rect x="${r(x - 11 * k)}" y="${r(y - 0.6)}" width="${r(22 * k)}" height="1.2" fill="#ddd3bf"/>`;
    g += `<rect x="${r(x - 7 * k)}" y="${r(y - 3.8 * k)}" width="${r(14 * k)}" height="${r(1.2 * k)}" fill="#a21f2c"/>`; }
  g += haus(216, 68, { b: 16, h: 8, w: "#f1ebe0", d: "#9c4a36" });
  g += haus(268, 68, { b: 14, h: 9, w: "#e9e2d3", d: "#7c3a2c" });
  g += haus(306, 92, { b: 14, h: 8, w: "#eee8dc", d: "#a54a33" });
  for (const [x, y] of [[214, 82], [222, 99], [312, 103], [290, 84], [252, 84], [282, 72], [206, 92]]) g += baum(x, y);
  teil({ id: "sv_kultur", de: "das Kulturviertel", syl: "Kul-TUR-vier-tel", it: "il quartiere della cultura", itSyl: "quar-TIE-re della cul-TU-ra", en: "the cultural quarter", x: 264, y: 90,
    tipp: "Antippen führt in dieses Viertel hinein.", lupe: "viertel_kultur" }, g);
}

/* =====================================================================
   4 — DIE INNENSTADT (Mitte): Altstadt, Marktplatz, Marktkirche
   ===================================================================== */
{
  /* Wallanlagen: grüner Gürtel mit Bäumen, wo früher die Stadtmauer stand */
  let g = `<ellipse cx="${MX}" cy="${MY}" rx="45" ry="36.4" fill="#7fae55" stroke="#dcd8cc" stroke-width=".9"/>`;
  g += `<ellipse cx="${MX}" cy="${MY}" rx="40.5" ry="32.4" fill="${S.lg("alt", [[0, "#cbbfa8"], [1, "#bfb39b"]])}" stroke="#a4975f" stroke-width=".4"/>`;
  { const wall = []; for (let i = 0; i < 30; i++) { const a = Math.PI * 2 * i / 30 + 0.05; wall.push([MX + Math.cos(a) * 42.8, MY + Math.sin(a) * 34.4]); }
    wall.filter(([, y]) => y < MY).forEach(([x, y]) => { g += baum(x, y, 0.75, x > MX); }); }
  /* Gassen */
  g += `<path d="M120 100 Q140 96 162 98 T205 96 M162 62 Q158 80 162 98 T162 134 M130 76 L194 120 M130 122 L196 74" stroke="#d8ccb3" stroke-width="1.1" fill="none"/>`;
  /* Marktplatz (Pflaster) mit Ständen und Brunnen */
  const MP = { x: 150, y: 101, w: 26, h: 12 };
  g += `<rect x="${MP.x - MP.w / 2}" y="${MP.y - MP.h / 2}" width="${MP.w}" height="${MP.h}" fill="#e3d6bc"/>`;
  g += `<rect x="${MP.x - MP.w / 2}" y="${MP.y - MP.h / 2}" width="${MP.w}" height="${MP.h}" fill="none" stroke="#c9b997" stroke-width=".4"/>`;
  g += `<circle cx="${MP.x}" cy="${MP.y}" r="1.6" fill="#8fbcd4" stroke="#9c8f77" stroke-width=".4"/>`;
  for (let i = 0; i < 6; i++) { const x = MP.x - 10 + (i % 3) * 7 + (i > 2 ? 3 : 0), y = MP.y - 3.2 + Math.floor(i / 3) * 6; g += `<path d="M${x - 2.4} ${y}h4.8l-.6 -1.5h-3.6z" fill="${i % 2 ? "#d8473b" : "#2f8a4f"}"/><path d="M${x - 1.6} ${y}v-1.5M${x} ${y}v-1.5M${x + 1.6} ${y}v-1.5" stroke="#fff" stroke-width=".5"/>`; }
  /* Altstadthäuser: dicht, Giebel, rote Ziegel — von hinten nach vorne */
  const WAND = ["#f2e8d5", "#efe0c4", "#e9d3b5", "#f4efe6", "#e6d9c9", "#f0d9c0", "#eae4d6", "#dccbb2"];
  const DACH = ["#b5523b", "#a4472f", "#8e3b2a", "#c0643f", "#9c4a36", "#7c3a2c"];
  const kircheY = 94;
  let kircheGemalt = false;
  const kirche = () => {
    const x = 178, y = kircheY, k = s(y);
    let c = haus(x - 2, y, { b: 24, h: 10, t: 9, w: "#d9c7a4", d: "#7e3a2c", dach: "sattel", rh: 6, fen: 0 });
    /* hohe Spitzbogenfenster */
    for (let i = 0; i < 4; i++) c += `<path d="M${r(x - 10 * k + i * 4.6 * k)} ${r(y - 2 * k)}v${r(-5 * k)}q${r(0.7 * k)} ${r(-1.2 * k)} ${r(1.4 * k)} 0v${r(5 * k)}z" fill="#5c6a7a"/>`;
    /* Turm mit grünem Kupferhelm */
    const tx = x + 12 * k, tb = 5.6 * k;
    c += `<rect x="${r(tx - tb / 2)}" y="${r(y - 30 * k)}" width="${r(tb)}" height="${r(30 * k)}" fill="${S.lg("turm", [[0, "#e2d1ae"], [1, "#c8b48e"]], 0, 0, 1, 0)}"/>`;
    c += `<rect x="${r(tx - 1 * k)}" y="${r(y - 26 * k)}" width="${r(2 * k)}" height="${r(3.4 * k)}" rx="${r(k)}" fill="#4d5866"/><circle cx="${r(tx)}" cy="${r(y - 20 * k)}" r="${r(1.5 * k)}" fill="#f6f1e2" stroke="#7a6a4a" stroke-width=".25"/>`;
    c += `<path d="M${r(tx - tb / 2 - 0.4)} ${r(y - 30 * k)}L${r(tx)} ${r(y - 47 * k)}L${r(tx + tb / 2 + 0.4)} ${r(y - 30 * k)}Z" fill="${S.lg("helm", [[0, "#9fd2bd"], [0.6, "#5f9c86"], [1, "#3e7461"]], 0, 0, 1, 0)}"/>`;
    c += `<path d="M${r(tx)} ${r(y - 47 * k)}v-2.4M${r(tx - 0.9)} ${r(y - 47 * k - 1.6)}h1.8" stroke="#c9a227" stroke-width=".4"/>`;
    return c;
  };
  /* Häuserzeilen (Blockrand): Haus an Haus, ab und zu eine Gasse */
  const zeilen = [];
  for (let y = 69; y <= 134; y += 7) {
    const halb = 38.5 * Math.sqrt(Math.max(0, 1 - ((y - 3 - MY) / 30) ** 2));
    const reihe = [];
    let x = MX - halb + 3, n = 0;
    while (x < MX + halb - 3) {
      const b = 6.2 + rnd() * 2.8, xx = x + b * s(y) / 2;
      const frei = (Math.abs(xx - MP.x) < MP.w / 2 + 2 && y > MP.y - MP.h / 2 - 1 && y < MP.y + MP.h / 2 + 6) || (xx > 164 && xx < 194 && y > 72 && y < 99);
      if (!frei && xx < MX + halb - 2) reihe.push([xx, y, b]);
      x += b * s(y) + (++n % 4 === 0 ? 1.6 : 0);
    }
    reihe.sort((p, q) => Math.abs(q[0] - 160) - Math.abs(p[0] - 160));
    zeilen.push(reihe);
  }
  let i = 0;
  for (const reihe of zeilen) {
    if (!kircheGemalt && reihe.length && reihe[0][1] > kircheY) { g += kirche(); kircheGemalt = true; }
    for (const [x, y, b] of reihe) { g += haus(x, y, { b, h: 6.5 + rnd() * 3, t: 6, w: WAND[(i * 3) % WAND.length], d: DACH[(i * 5) % DACH.length], rh: 3.4, fw: 0.55 }); i++; }
  }
  if (!kircheGemalt) g += kirche();
  { for (let i = 0; i < 30; i++) { const a = Math.PI * 2 * i / 30 + 0.05, x = MX + Math.cos(a) * 42.8, y = MY + Math.sin(a) * 34.4; if (y >= MY && Math.abs(x - MX) > 4) g += baum(x, y, 0.85, x > MX); } }
  teil({ id: "sv_innenstadt", de: "die Innenstadt", syl: "IN-nen-stadt", it: "il centro", itSyl: "CEN-tro", en: "the town centre", x: 146, y: 112,
    tipp: "Antippen führt in dieses Viertel hinein.", lupe: "viertel_innenstadt" }, g);
}

/* =====================================================================
   5 — DAS WOHNVIERTEL (unten links): Mehrfamilienhäuser, Einfamilienhäuser
   ===================================================================== */
{
  let g = grund(`M-2 113 L${ringPunkte(113, 136, -1).join(" L")} L150 154 L-2 154Z`, S.lg("wohn", [[0, "#9fbf73"], [1, "#8fb366"]]));
  /* Wohnstraßen */
  g += `<path d="M0 132 H134 M60 113 V154" stroke="#b4b4ae" stroke-width="2"/>`;
  /* hinten: Mehrfamilienhäuser (Zeilenbau, 4 Geschosse) */
  for (let i = 0; i < 4; i++) g += haus(8 + i * 14, 124, { b: 12, h: 11, t: 7, w: ["#eae2d2", "#f2e7d0", "#e3e6e8", "#efd9c1"][i], d: ["#8d4535", "#6d6f73", "#a24e37", "#7a4033"][i] });
  for (let i = 0; i < 4; i++) g += haus(72 + i * 13, 124, { b: 10, h: 7, t: 7, w: "#f4efe6", d: ["#a54a33", "#5a5d62", "#8e3b2a", "#b0563a"][i] });
  /* vorne: Einfamilienhäuser mit Gärten und Bäumen */
  for (let i = 0; i < 9; i++) {
    const x = 7 + i * 15.6, y = 150;
    if (x > 140) break;
    g += `<rect x="${r(x - 6.6)}" y="${r(y - 15)}" width="13" height="14.6" fill="${i % 2 ? "#a6c77b" : "#98bd6c"}"/>`;
    g += haus(x, y - 4, { b: 8, h: 5, t: 7, w: ["#fbf6ec", "#f2e3c8", "#e8eef0"][i % 3], d: ["#b0563a", "#4d5157", "#8e3b2a"][i % 3], rh: 3 });
    if (i % 2 === 0) g += baum(x + 4.6, y - 0.6, 0.9, 1);
  }
  /* Spielplatz */
  for (const [x, y] of [[66, 128], [126, 128], [28, 116], [120, 116]]) g += baum(x, y);
  teil({ id: "sv_wohnen", de: "das Wohnviertel", syl: "WOHN-vier-tel", it: "il quartiere residenziale", itSyl: "quar-TIE-re re-si-den-ZIA-le", en: "the residential quarter", x: 50, y: 140,
    tipp: "Antippen führt in dieses Viertel hinein.", lupe: "viertel_wohnen" }, g);
}

/* =====================================================================
   6 — DAS GEWERBEGEBIET (unten rechts): Hallen, Solardächer, Lkw
   ===================================================================== */
{
  let g = grund(`M322 113 L${ringPunkte(113, 136, 1).join(" L")} L174 154 L322 154Z`, S.lg("gew", [[0, "#b3b5b0"], [1, "#a8aaa4"]]));
  const SOLAR = S.def(`<pattern id="sdt_solar" width="2" height="1.4" patternUnits="userSpaceOnUse"><rect width="2" height="1.4" fill="#2c4a73"/><path d="M0 0H2M0 0V1.4" stroke="#9db4cf" stroke-width=".18"/></pattern>`) || "url(#sdt_solar)";
  /* große Blechhallen */
  const hallen = [[226, 125, 34, 8, "#c9d0d4", "#8e989e"], [276, 123, 44, 9, "#e3e1da", "#9aa1a5"], [304, 146, 26, 9, "#bcc8cf", "#7f8c93"], [252, 148, 36, 10, "#d6d2c7", "#8b9499"], [200, 148, 26, 8, "#e9e5dc", "#a9b0b3"]];
  hallen.forEach(([x, y, b, h, w, d], i) => {
    g += haus(x, y, { b, h, t: 14, w, d, dach: "flach", fen: 0 });
    const k = s(y), sg = x < 160 ? 1 : -1;
    /* Sektionaltore und Fensterband */
    for (let j = 0; j < 3; j++) g += `<rect x="${r(x - b * k / 2 + 2 * k + j * 6 * k)}" y="${r(y - 5 * k)}" width="${r(4 * k)}" height="${r(5 * k)}" fill="#7d878d"/>`;
    g += `<rect x="${r(x - b * k / 2)}" y="${r(y - h * k + 1 * k)}" width="${r(b * k)}" height="${r(1 * k)}" fill="#6e8ea6" opacity=".8"/>`;
    /* Solarmodule auf dem Dach */
    if (i % 2 === 0) { const t = 14 * k, dx = sg * t * 0.22, dy = -t * 0.5; g += `<path d="M${r(x - b * k / 2 + 1.5 * k + dx * 0.2)} ${r(y - h * k + dy * 0.2)}h${r(b * k - 3 * k)}l${r(dx * 0.6)} ${r(dy * 0.6)}h${r(-(b * k - 3 * k))}z" fill="url(#sdt_solar)"/>`; }
  });
  /* Schornstein mit Dampf, Silo */
  g += `<rect x="296" y="98" width="3" height="20" fill="#b9a99a"/><rect x="296" y="100" width="3" height="1.2" fill="#c0392b"/><path d="M297.5 98 q-3 -3 1 -6 q4 -3 -1 -6" stroke="#fff" stroke-width="2.2" opacity=".55" fill="none" stroke-linecap="round"/>`;
  g += `<rect x="246" y="107" width="5" height="12" rx="2" fill="#d9dcdc"/><rect x="251" y="107" width="1.4" height="12" fill="#aeb3b4"/>`;
  /* Lkw und Parkplätze */
  g += `<rect x="226" y="130" width="12" height="3.2" fill="#f0f0ec"/><rect x="238" y="130.6" width="3" height="2.6" fill="#2c5f9e"/>`;
  g += `<rect x="270" y="130" width="12" height="3.2" fill="#e8e1cf"/><rect x="282" y="130.6" width="3" height="2.6" fill="#b3261e"/>`;
  for (let i = 0; i < 8; i++) g += auto(214 + i * 4.2, 139, AUTOFARBEN[i % 8], 1);
  for (const [x, y] of [[212, 119], [316, 136], [188, 136]]) g += baum(x, y);
  teil({ id: "sv_gewerbe", de: "das Gewerbegebiet", syl: "Ge-WER-be-ge-biet", it: "la zona industriale", itSyl: "ZO-na in-du-STRIA-le", en: "the industrial estate", x: 262, y: 140,
    tipp: "Antippen führt in dieses Viertel hinein.", lupe: "viertel_gewerbe" }, g);
}

/* =====================================================================
   7 — AM WASSER UND IM GRÜNEN: Fluss, Steinbrücke, Uferpark
   ===================================================================== */
{
  let g = grund("M-2 157 L322 157 V202 H-2Z", S.lg("wiese", [[0, "#86b35a"], [1, "#6f9e47"]]));
  /* der Fluss */
  const FLUSS = "M0 164 C60 160 110 170 170 168 S270 160 320 163 V181 C270 178 220 186 160 185 S60 178 0 182Z";
  g += `<path d="${FLUSS}" fill="${S.lg("fluss", [[0, "#5d93b5"], [0.5, "#4b84a8"], [1, "#3f7597"]])}"/>`;
  g += `<path d="M0 164 C60 160 110 170 170 168 S270 160 320 163" stroke="#d9cfae" stroke-width="1.2" fill="none"/>`;
  g += `<path d="M0 182 C60 178 160 185 160 185 S270 178 320 181" stroke="#d9cfae" stroke-width="1.2" fill="none"/>`;
  for (let i = 0; i < 18; i++) { const x = rnd() * 300 + 6, y = 168 + rnd() * 11; g += `<path d="M${r(x)} ${r(y)}h${r(3 + rnd() * 5)}" stroke="#cfe5f1" stroke-width=".4" opacity=".6"/>`; }
  /* Uferweg und Bäume am Ufer */
  g += `<path d="M0 189 C80 186 200 194 320 188" stroke="#d8cba5" stroke-width="1.6" fill="none"/>`;
  for (let i = 0; i < 12; i++) { const x = 6 + i * 27 + rnd() * 6; if (x > 140 && x < 184) continue; g += baum(x, 161.5, 1.15, i % 3 === 0); }
  for (const x of [20, 70, 104, 276, 306]) g += baum(x, 196, 1.2, x % 2);
  /* Steinbrücke mit Bögen, Straße darüber */
  g += `<path d="M151 157 H173 V190 H151Z" fill="#c2b59b"/><path d="M153 157 H171 V190 H153Z" fill="#7f8382"/>`;
  g += `<path d="M162 157 V190" stroke="#f3f1e6" stroke-width=".3" stroke-dasharray="1.2 1.2"/>`;
  g += `<path d="M151.6 157V190M172.4 157V190" stroke="#e0d5bd" stroke-width=".9"/>`;
  /* Brückenpfeiler mit Eisbrechern, Schatten der Bögen auf dem Wasser */
  for (const y of [170, 178]) g += `<path d="M151 ${y - 1.2}l-2.6 1.2l2.6 1.2zM173 ${y - 1.2}l2.6 1.2l-2.6 1.2z" fill="#a89c84"/>`;
  g += `<path d="M173 167 h4 M173 175 h4 M173 183 h3" stroke="#2c5674" stroke-width="1.6" opacity=".5"/>`;
  /* Ausflugsschiff und Bootssteg */
  g += `<path d="M206 172 h26 l-2 3 h-22 z" fill="#f4f4f0"/><rect x="210" y="169.4" width="16" height="2.6" fill="#e6eef2"/><path d="M211 170.6 h14" stroke="#4a6b80" stroke-width=".8" stroke-dasharray="1.2 .6"/><path d="M206 174.4h26" stroke="#24557a" stroke-width=".5"/>`;
  g += `<rect x="98" y="182" width="2" height="5" fill="#8a6a45"/><rect x="92" y="180" width="14" height="2.4" fill="#a07a50"/><path d="M93 177.6 q4 -1.2 8 0 l-1 1.4 h-6z" fill="#c0392b"/>`;
  teil({ id: "sv_gruen", de: "am Wasser und im Grünen", syl: "am WAS-ser", it: "vicino all'acqua", itSyl: "vi-CI-no all'AC-qua", en: "by the water", x: 70, y: 186,
    tipp: "Antippen führt in dieses Viertel hinein.", lupe: "viertel_gruen" }, g);
}

/* =====================================================================
   8 — DER WEGWEISER am Aussichtspunkt (vorne rechts)
   ===================================================================== */
{
  const x = 246, y = 199;
  let g = schatten(x + 3, y - 0.6, 7, 1.4, 0.35);
  g += `<rect x="${x - 0.9}" y="${y - 34}" width="1.8" height="34" fill="${S.lg("pfosten", [[0, "#46613f"], [0.5, "#2f4a2b"], [1, "#22361f"]], 0, 0, 1, 0)}"/>`;
  g += `<path d="M${x - 1.2} ${y - 34}h2.4l-1.2 -1.6z" fill="#22361f"/>`;
  const schilder = [["Innenstadt", 1, "1,2 km"], ["Bahnhof", -1, "2,5 km"], ["Rathaus", 1, "1,8 km"], ["Theater", -1, "2,1 km"]];
  schilder.forEach(([t, sg, km], i) => {
    const yy = y - 31 + i * 5.2, L = 25;
    const p = sg > 0 ? `M${x} ${yy}h${L}l2.4 2.1l-2.4 2.1h${-L}z` : `M${x} ${yy}h${-L}l-2.4 2.1l2.4 2.1h${L}z`;
    g += `<path d="${p}" fill="#fbfbf6" stroke="#2f4a2b" stroke-width=".45"/>`;
    g += `<text x="${x + sg * 1.4}" y="${yy + 3}" font-size="2.5" text-anchor="${sg > 0 ? "start" : "end"}" fill="#22361f" font-family="Arial" font-weight="bold">${t}</text>`;
    g += `<text x="${x + sg * (L - 0.6)}" y="${yy + 3}" font-size="1.9" text-anchor="${sg > 0 ? "end" : "start"}" fill="#22361f" font-family="Arial">${km}</text>`;
  });
  /* korrigiert: Silben ohne Artikel und mit Betonung (alt: „der Weg-wei-ser“, „il car-tel-lo in-di-ca-to-re“) */
  teil({ id: "wegweiser", de: "der Wegweiser", syl: "WEG-wei-ser", it: "il cartello indicatore", itSyl: "car-TEL-lo in-di-ca-TO-re", en: "the signpost", x: 246, y: 199,
    tipp: "Der Wegweiser zeigt, wohin es geht und wie weit es ist." }, g);
}

/* Dunst über der Ferne (Luftperspektive) — fängt keinen Tipp ab */
S.davor(`<rect y="22" width="320" height="40" fill="${S.lg("dunst", [[0, "#dfe9ef", 0.45], [1, "#dfe9ef", 0]])}"/>`);

console.log(S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/stadt.js")));
