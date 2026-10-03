#!/usr/bin/env node
/* =====================================================================
   IM WALD (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (planet-wissen „Tiere im Wald“, Waldfibel der FNR, LfL
   Merkblatt Vogelschutz):
   - Der typische deutsche Wald ist ein MISCHWALD: Rotbuche (glatte,
     silbergraue Rinde), Stieleiche (tief gefurchte Rinde, gelappte
     Blätter, Eicheln am Stiel), Fichte (rötliche Rinde, hängende Zapfen)
     und Weißtanne (Zapfen stehen aufrecht, Nadeln unten weiß gestreift).
   - Ein geschotterter FORSTWEG führt hindurch; an der Kreuzung ein
     WEGWEISER mit gelben Schildern und Wanderzeichen. Am Wegrand liegen
     HOLZSTAPEL (Polter) mit aufgesprühter Nummer. Am Rand einer Lichtung
     steht der HOCHSITZ des Jägers.
   - Am Boden: Farn, Moos, Heidelbeeren, Baumstümpfe mit Pilzen,
     Fliegenpilz und Steinpilz (unter Fichten und Buchen), der
     AMEISENHAUFEN der Roten Waldameise aus Fichtennadeln.
   - Tiere: Reh (rotbraun im Sommer, weißer „Spiegel“), Rothirsch mit
     Geweih, Wildschwein (frisst Eicheln und Bucheckern), Rotfuchs,
     Feldhase, Eichhörnchen mit Pinselohren, Buntspecht, Waldkauz in der
     Baumhöhle, Igel, Tagpfauenauge.
   Maßstab: Augenhöhe 1,6 m, Horizont y = 100. Am Boden bei y misst ein
   Meter (y − 100) / 1,6 Einheiten: Lichtung (y ≈ 115) 9, Weg (y ≈ 150)
   31, vorn (y ≈ 195) 59.
   ===================================================================== */
"use strict";
const path = require("path");
const B = require("../bau");
const { neueSzene, flaeche, schatten, zufall } = B;
const r = B.r;
const { tierKasten } = require("./bauernhof");

const S = neueSzene({ id: "wald", titel: "Im Wald", emoji: "🌲", thema: "Natur", kuerzel: "b18b", fassung: 852 });
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="b18b_dunst" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.2"/></filter>`);
const T = tierKasten(S, 777);
const { glatt, koerper, form, linie, striche, auge } = T;
const rnd = zufall(2024);

/* ---------- Raum ---------- */
const F = 300, HY = 100, E = 1.6;
const P = (X, Y, Z) => [r(160 + X * F / Z), r(HY + (E - Y) * F / Z)];
const Zb = (y) => F * E / (y - HY);
const sk = (y) => (y - HY) / E;
const poly = (pts, fill, extra = "") => `<path d="M${pts.map((q) => q.join(" ")).join("L")}Z" fill="${fill}"${extra}/>`;
const um = (x, y, svg) => `<g transform="translate(${r(-x)} ${r(-y)})">${svg}</g>`;
const skal = (k, dir, svg) => `<g transform="scale(${Math.round(dir * k * 10000) / 10000} ${Math.round(k * 10000) / 10000})">${svg}</g>`;
const fertig = (svg, k, dir, laenge) => schatten(0, 0.2, laenge * k / 2, Math.max(0.6, laenge * k * 0.06), 0.3) + skal(k, dir, svg);

const RINDE_B = S.lg("buche", [[0, "#7d817c"], [0.25, "#b9bdb6"], [0.55, "#a3a8a1"], [1, "#6a6e69"]], 0, 0, 1, 0);
const RINDE_E = S.lg("eiche", [[0, "#3e3226"], [0.35, "#6a5a48"], [0.6, "#5a4a3a"], [1, "#2e241a"]], 0, 0, 1, 0);
const MOOS = S.lg("moos", [[0, "#8fb84a"], [1, "#4f7a2a"]]);
const LAUB = ["#3f6e2c", "#4f8236", "#5e9440", "#2f5a24", "#6fa84a"];

/* Weg: Mittellinie biegt nach hinten links, Breite 2,6 m */
const wegX = (Z) => 0.25 - Math.max(0, Z - 8) * 0.075;
const WEGB = 1.3;

/* =====================================================================
   KULISSE: Blätterdach, ferne Stämme im Dunst, Waldboden, Lichtung
   ===================================================================== */
S.hinten(`<rect x="0" y="0" width="320" height="200" fill="${S.lg("luft", [[0, "#cfe3c8"], [0.5, "#e2ecd2"], [1, "#b9c9a0"]])}"/>`);
{
  /* ferne Stämme: drei Lagen, je weiter hinten desto heller */
  let g = "";
  for (const [Z, n, farbe, op] of [[60, 40, "#9aa592", 0.6], [40, 30, "#808a76", 0.7], [26, 18, "#68705e", 0.8]]) {
    const yb = HY + E * F / Z;
    for (let i = 0; i < n; i++) {
      const x = rnd() * 330 - 5, w = (0.25 + rnd() * 0.3) * F / Z;
      if (Math.abs(x - (160 + wegX(Z) * F / Z)) < 1.6 * F / Z) continue;
      g += `<rect x="${r(x)}" y="0" width="${r(w)}" height="${r(yb)}" fill="${farbe}" opacity="${op}"/>`;
    }
  }
  S.hinten(g);
  /* Blätterdach */
  let d = "";
  for (let i = 0; i < 70; i++) { const x = rnd() * 340 - 10, y = rnd() * 34 - 6; d += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(10 + rnd() * 16)}" ry="${r(6 + rnd() * 8)}" fill="${LAUB[Math.floor(rnd() * 5)]}" opacity=".9"/>`; }
  for (let i = 0; i < 40; i++) { const x = rnd() * 330, y = 20 + rnd() * 30; d += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(6 + rnd() * 10)}" ry="${r(3 + rnd() * 5)}" fill="${LAUB[Math.floor(rnd() * 5)]}" opacity=".55"/>`; }
  S.hinten(d);
  /* Waldboden mit Laub, Lichtung hinten links heller */
  let b = `<path d="M0 ${HY - 2} L320 ${HY - 2} L320 200 L0 200 Z" fill="${S.lg("boden", [[0, "#8a9a62"], [0.35, "#6f7a44"], [1, "#5a4a2e"]])}"/>`;
  b += `<ellipse cx="80" cy="113" rx="70" ry="9" fill="#b9c77a" opacity=".55" filter="url(#b18b_dunst)"/>`;
  for (let i = 0; i < 420; i++) {
    const y = HY + 2 + Math.pow(rnd(), 0.7) * 100, x = rnd() * 320, q = (y - HY) / 60;
    b += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(0.4 * q + rnd() * 0.5 * q)}" ry="${r(0.2 * q + rnd() * 0.25 * q)}" fill="${["#8a5a2a", "#a8783a", "#6a4a24", "#c49a52", "#4f6a2c"][Math.floor(rnd() * 5)]}" opacity=".75"/>`;
  }
  S.hinten(b);
}

/* =====================================================================
   1 — DIE TANNE (Weißtanne, hinten rechts) und DIE FICHTE
   ===================================================================== */
function nadelbaum(x, yb, s, hoehe, breite, art) {
  /* art "tanne": waagerechte, flache Zweige, Zapfen aufrecht; "fichte": hängende Zweige, Zapfen hängend.
     Was über den oberen Bildrand ginge, wird nicht gezeichnet. */
  const H = hoehe * s, Wb = breite * s / 2, oben = Math.min(H, yb);
  const dunkel = art === "fichte" ? "#203a1c" : "#1c3622", mittel = art === "fichte" ? "#2f5428" : "#2a4f30", hell = art === "fichte" ? "#4f7a3c" : "#5a8a5a";
  let k = `<rect x="${r(-0.12 * s)}" y="${r(-oben)}" width="${r(0.24 * s)}" height="${r(oben)}" fill="${art === "fichte" ? "#6e4a34" : "#8a8a84"}"/>`;
  const etagen = 18;
  for (let i = 0; i < etagen; i++) {
    const t = i / (etagen - 1), y = -0.1 * H - t * 0.9 * H;
    if (y < -oben + 0.3 * s) continue;
    const w = Wb * (1 - t * 0.95) * (0.8 + rnd() * 0.3);
    const haeng = art === "fichte" ? 0.22 : 0.07;
    for (const sx of [-1, 1]) {
      /* Zweigmasse mit gezackter Unterkante */
      const n = 7; let d = `M0 ${r(y - 0.3 * s)}`;
      d += `Q${r(sx * w * 0.5)} ${r(y - 0.25 * s)} ${r(sx * w)} ${r(y + w * haeng)}`;
      for (let j = n; j >= 0; j--) { const u = j / n, xx = sx * w * u, yy = y + w * haeng * u * u + (j % 2 ? 0.42 : 0.2) * s * (0.6 + u * 0.6); d += `L${r(xx)} ${r(yy)}`; }
      k += `<path d="${d}Z" fill="${i % 2 ? dunkel : mittel}"/>`;
      k += `<path d="M0 ${r(y - 0.26 * s)} Q${r(sx * w * 0.5)} ${r(y - 0.2 * s)} ${r(sx * w * 0.95)} ${r(y + w * haeng)}" stroke="${hell}" stroke-width="${r(0.06 * s)}" fill="none" opacity=".8"/>`;
    }
    k += striche(Math.round(w / 1.2), -w, y - 0.2 * s, w, y + 0.3 * s, 0.3 * s * 0.1, 0.4 * s * 0.1, hell, 0.25, 0.6);
  }
  for (let i = 0; i < 7; i++) {
    const t = 0.45 + rnd() * 0.5, y = -t * H, sx = (rnd() < 0.5 ? -1 : 1) * Wb * (1 - t) * (0.3 + rnd() * 0.5);
    if (y < -oben + 0.4 * s) continue;
    if (art === "tanne") k += `<rect x="${r(sx - 0.05 * s)}" y="${r(y - 0.32 * s)}" width="${r(0.1 * s)}" height="${r(0.3 * s)}" rx="${r(0.05 * s)}" fill="#6b5a3a"/>`;
    else k += `<rect x="${r(sx - 0.05 * s)}" y="${r(y + 0.1 * s)}" width="${r(0.1 * s)}" height="${r(0.32 * s)}" rx="${r(0.05 * s)}" fill="#8a4a2a"/>`;
  }
  return schatten(0, 0, Wb * 0.6, 0.15 * s, 0.25) + k;
}
{
  const yb = 116, s = sk(yb);
  S.teil({ id: "tanne", de: "die Tanne", syl: "TAN-ne", it: "l'abete", itSyl: "a-BE-te", en: "fir tree", x: 228, y: yb, steht: true, kunst: nadelbaum(228, yb, s, 10, 4.4, "tanne"),
    tipp: "Bei der Tanne stehen die Zapfen aufrecht auf den Zweigen." });
}

/* =====================================================================
   2 — DER HIRSCH auf der Lichtung, DER HOCHSITZ am Rand
   ===================================================================== */
function hirschkuh(o) {
  /* Reh und Hirsch: gleicher Bauplan; o.g = Größe, o.geweih */
  const g = o.g || 1;
  const P2 = (pts) => pts.map(([x, y, e]) => (e ? [x * g, y * g, 1] : [x * g, y * g]));
  const FELL = S.lg(o.name, o.farben);
  let s = "";
  s += form(P2([[24, -46], [26, -30], [25, -12], [26, -3], [28, 0, 1], [23, 0, 1], [21, -4], [20, -14], [18, -30], [16, -44]]), o.farben[2][1]);
  s += form(P2([[-28, -48], [-30, -36], [-33, -26], [-31, -12], [-30, -3], [-28, 0, 1], [-33, 0, 1], [-35, -4], [-36, -12], [-38, -24], [-42, -36], [-44, -48]]), o.farben[2][1]);
  const K = P2([[-48, -64], [-30, -69], [0, -67], [18, -71], [28, -78], [34, -88], [40, -98], [45, -102], [51, -103], [58, -97], [65, -91], [68, -88], [67, -85], [62, -84.5], [55, -86], [48, -88], [42, -86], [36, -76], [30, -62], [29, -50],
    [29, -44], [29, -30], [28, -12], [29, -3], [31, 0, 1], [25, 0, 1], [24, -4], [23, -14], [22, -30], [20, -42], [10, -43], [-10, -42], [-26, -46],
    [-30, -44], [-33, -36], [-37, -26], [-36, -12], [-35, -3], [-33, 0, 1], [-38, 0, 1], [-39, -4], [-40, -12], [-42, -24], [-46, -32], [-50, -46], [-51, -58]]);
  let f = "";
  f += form(P2([[-54, -70], [-44, -66], [-42, -50], [-50, -44], [-56, -54]]), o.spiegel);
  f += form(P2([[30, -80], [42, -86], [36, -70], [30, -60]]), o.hals || "none", o.hals ? "" : ` opacity="0"`);
  f += form(P2([[-24, -45], [18, -44], [16, -41], [-22, -42]]), "#f2ead8", ` opacity=".3"`);
  f += form(P2([[46, -88], [58, -86], [54, -82], [44, -84]]), "#f4efe6", ` opacity=".8"`);
  f += striche(46, -48 * g, -70 * g, 30 * g, -42 * g, 2.4 * g, 0.6 * g, "#000", 0.4 * g, 0.18);
  f += `<path d="M${r(16 * g)} ${r(-66 * g)} q${r(-6 * g)} ${r(10 * g)} ${r(2 * g)} ${r(22 * g)} M${r(-32 * g)} ${r(-64 * g)} q${r(-8 * g)} ${r(10 * g)} ${r(-2 * g)} ${r(20 * g)}" stroke="#000" stroke-opacity=".14" stroke-width="${r(1.4 * g)}" fill="none"/>`;
  f += `<path d="M${r(23 * g)} 0 l${r(1 * g)} ${r(-3.6 * g)} h${r(4 * g)} l${r(1.5 * g)} ${r(3.6 * g)} Z M${r(-38 * g)} 0 l${r(1 * g)} ${r(-3.6 * g)} h${r(4 * g)} l${r(1 * g)} ${r(3.6 * g)} Z" fill="#2a2420"/>`;
  s += koerper(K, FELL, f, { rw: 0.6 * g });
  /* Ohren, Auge, Nase */
  s += form(P2([[45, -101], [39, -110], [38, -116, 1], [44, -110], [48, -102]]), o.farben[1][1]);
  s += form(P2([[47, -102], [44, -112], [45, -118, 1], [50, -110], [51, -103]]), o.farben[0][1]);
  s += `<path d="M${r(46 * g)} ${r(-104 * g)} l${r(-1 * g)} ${r(-8 * g)}" stroke="#f0e2cc" stroke-width="${r(0.8 * g)}" opacity=".7"/>`;
  s += auge(55 * g, -95 * g, 1.8 * g, "#1a120c");
  s += `<ellipse cx="${r(67 * g)}" cy="${r(-87 * g)}" rx="${r(1.8 * g)}" ry="${r(1.6 * g)}" fill="#141414"/>`;
  if (o.geweih) {
    /* Geweih des Rothirschs (Zwölfender): Stange mit Aug-, Eis-, Mittelsprosse und Krone */
    const st = (d) => `<path d="${d}" stroke="#6a5038" stroke-width="${r(2.6 * g)}" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#d8c8a4" stroke-width="${r(0.8 * g)}" fill="none" stroke-linecap="round" opacity=".6" transform="translate(${r(-0.4 * g)} ${r(-0.4 * g)})"/>`;
    const G = (x, y) => `${r(x * g)} ${r(y * g)}`;
    s += st(`M${G(48, -104)} C${G(40, -124)} ${G(30, -140)} ${G(26, -160)} M${G(45, -110)} Q${G(52, -114)} ${G(58, -116)} M${G(42, -118)} Q${G(50, -122)} ${G(55, -126)} M${G(34, -134)} Q${G(42, -138)} ${G(46, -144)} M${G(28, -150)} Q${G(32, -160)} ${G(36, -164)} M${G(27, -154)} Q${G(20, -162)} ${G(18, -168)}`);
    s += st(`M${G(50, -104)} C${G(46, -122)} ${G(40, -136)} ${G(38, -154)} M${G(44, -128)} Q${G(52, -130)} ${G(56, -134)} M${G(39, -146)} Q${G(44, -154)} ${G(46, -160)}`);
  }
  return s;
}
{
  const yb = 115, s = sk(yb);
  S.teil({ id: "hirsch", de: "der Hirsch", syl: "HIRSCH", it: "il cervo", itSyl: "CER-vo", en: "stag", x: 88, y: yb,
    kunst: fertig(hirschkuh({ name: "hirsch", g: 1.75, geweih: true, spiegel: "#e8d8b8", hals: "#4a3626", farben: [[0, "#8a5e3c"], [0.6, "#6e4a2e"], [1, "#4a3220"]] }), s / 100, 1, 200),
    tipp: "Im Herbst röhrt der Hirsch laut. Sein Geweih wirft er jedes Jahr ab." });
}
{
  /* Hochsitz (offene Leiter-Kanzel mit Dach) */
  const yb = 117, s = sk(yb), m = (v) => r(v * s);
  let k = schatten(0, 0, m(1), m(0.12), 0.3);
  const HO = "#6a4e32", HL = "#8a6a46";
  k += `<path d="M${m(-0.8)} 0 L${m(-0.5)} ${m(-3)} M${m(0.8)} 0 L${m(0.5)} ${m(-3)}" stroke="${HO}" stroke-width="${m(0.12)}"/>`;
  k += `<path d="M${m(-0.75)} ${m(-0.8)} L${m(0.6)} ${m(-2)} M${m(0.75)} ${m(-0.8)} L${m(-0.6)} ${m(-2)}" stroke="${HO}" stroke-width="${m(0.06)}"/>`;
  k += `<rect x="${m(-0.62)}" y="${m(-3.9)}" width="${m(1.24)}" height="${m(0.95)}" fill="${HL}"/>`;
  for (let i = 1; i < 6; i++) k += `<path d="M${m(-0.62 + i * 0.2)} ${m(-3.9)} v${m(0.95)}" stroke="${HO}" stroke-width="${m(0.03)}"/>`;
  k += `<rect x="${m(-0.5)}" y="${m(-3.75)}" width="${m(1)}" height="${m(0.3)}" fill="#1e1610"/>`;
  k += `<path d="M${m(-0.8)} ${m(-3.9)} L0 ${m(-4.35)} L${m(0.8)} ${m(-3.9)} Z" fill="#4a5a3a"/>`;
  k += `<rect x="${m(-0.7)}" y="${m(-2.98)}" width="${m(1.4)}" height="${m(0.08)}" fill="${HO}"/>`;
  /* Leiter nach vorn */
  k += `<path d="M${m(-0.35)} ${m(0.2)} L${m(-0.25)} ${m(-2.95)} M${m(0.25)} ${m(0.2)} L${m(0.25)} ${m(-2.95)}" stroke="${HL}" stroke-width="${m(0.07)}"/>`;
  for (let i = 0; i < 9; i++) k += `<path d="M${m(-0.33 + i * 0.01)} ${m(-0.1 - i * 0.32)} H${m(0.25)}" stroke="${HL}" stroke-width="${m(0.04)}"/>`;
  S.teil({ id: "hochsitz", de: "der Hochsitz", syl: "HOCH-sitz", it: "la torretta di caccia", itSyl: "tor-RET-ta di CAC-cia", en: "hunting stand", x: 128, y: yb, steht: true, kunst: k,
    tipp: "Vom Hochsitz aus beobachtet der Jäger das Wild." });
}

/* =====================================================================
   3 — DER WANDERWEG (Forstweg aus Schotter)
   ===================================================================== */
{
  let li = [], re = [];
  for (let Z = 4.82; Z <= 70; Z *= 1.12) { li.push(P(wegX(Z) - WEGB, 0, Z)); re.push(P(wegX(Z) + WEGB, 0, Z)); }
  const pts = [...li, ...re.reverse()];
  let k = `<path d="${glatt(pts)}" fill="${S.lg("weg", [[0, "#c9bd9a"], [0.5, "#b3a582"], [1, "#9a8a68"]])}"/>`;
  let st = "";
  for (let i = 0; i < 260; i++) { const Z = 4.9 * Math.pow(10, rnd() * 1.1), X = wegX(Z) + (rnd() * 2 - 1) * WEGB * 0.95, [x, y] = P(X, 0, Z), q = 3 / Z; st += `<ellipse cx="${x}" cy="${y}" rx="${r(0.06 * F * q / 3 * (0.6 + rnd()))}" ry="${r(0.03 * F * q / 3 * (0.6 + rnd()))}" fill="${rnd() < 0.5 ? "#e2d8bc" : "#8a7a5a"}" opacity=".7"/>`; }
  k += st;
  /* Grasstreifen in der Mitte, Fahrspuren */
  let mi = [];
  for (let Z = 4.82; Z <= 60; Z *= 1.15) mi.push(P(wegX(Z) - 0.15, 0, Z));
  for (let Z = 60; Z >= 4.82; Z /= 1.15) mi.push(P(wegX(Z) + 0.15, 0, Z));
  k += `<path d="${glatt(mi)}" fill="#7f8a4a" opacity=".55"/>`;
  S.teil({ id: "wanderweg", de: "der Wanderweg", syl: "WAN-der-weg", it: "il sentiero", itSyl: "sen-TIE-ro", en: "trail", x: 170, y: 200, kunst: um(170, 200, k),
    tipp: "Auf dem Wanderweg bleibt man – so stört man die Tiere nicht." });
}

/* =====================================================================
   4 — DER HOLZSTAPEL am Wegrand
   ===================================================================== */
{
  const yb = 124, s = sk(yb);
  let k = schatten(0, 0, 22, 1.4, 0.3);
  const rr = 0.17 * s;
  const reihen = [[7, 0], [6, 1], [5, 2], [3, 3]];
  for (const [n, j] of reihen) {
    for (let i = 0; i < n; i++) {
      const x = (i - (n - 1) / 2) * rr * 2.05 + (j % 2 ? 0 : 0), y = -rr - j * rr * 1.75;
      k += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(rr)}" fill="#6a4a2c"/><circle cx="${r(x - 0.1)}" cy="${r(y - 0.1)}" r="${r(rr * 0.86)}" fill="${S.rg("hirn", [[0, "#ecd2a0"], [0.8, "#d6b27a"], [1, "#b88c52"]])}"/>`;
      k += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(rr * 0.5)}" fill="none" stroke="#c19a62" stroke-width=".2"/><circle cx="${r(x)}" cy="${r(y)}" r=".2" fill="#9a6a3a"/>`;
    }
  }
  k += `<text x="0" y="${r(-rr * 3)}" font-size="${r(rr * 1.3)}" text-anchor="middle" fill="#e23a2a" font-family="Arial" font-weight="bold" opacity=".85">17</text>`;
  k += `<path d="M${r(-rr * 3)} ${r(-rr * 5.2)} l${r(rr * 1.4)} ${r(rr * 0.6)}" stroke="#e23a2a" stroke-width=".5" opacity=".8"/>`;
  S.teil({ id: "holzstapel", de: "der Holzstapel", syl: "HOLZ-sta-pel", it: "la catasta di legna", itSyl: "ca-TA-sta di LE-gna", en: "log pile", x: 208, y: yb, steht: true, kunst: k,
    tipp: "Die Stämme liegen am Weg, bis sie ins Sägewerk gebracht werden." });
}

/* =====================================================================
   5 — DIE EICHE (links, mit Baumhöhle) und DIE EULE darin
   ===================================================================== */
const EI = { x: 58, y: 152 };
{
  const s = sk(EI.y), w = 0.75 * s;
  let k = schatten(0, 0, w * 1.1, 0.15 * s, 0.35);
  k += `<path d="M${r(-w / 2 - 3)} 0 Q${r(-w / 2)} -6 ${r(-w / 2 + 1)} -14 L${r(-w / 2 + 2)} -110 L${r(w / 2 - 1)} -110 L${r(w / 2)} -14 Q${r(w / 2 + 1)} -6 ${r(w / 2 + 4)} 0 Z" fill="${RINDE_E}"/>`;
  /* tiefe Furchen der Eichenrinde */
  let fu = "";
  for (let i = 0; i < 16; i++) { const x = -w / 2 + 2 + rnd() * (w - 4); let y = -2; fu += `M${r(x)} ${y}`; while (y > -108) { y -= 3 + rnd() * 4; fu += `L${r(x + (rnd() - 0.5) * 1.6)} ${r(y)}`; } }
  k += `<path d="${fu}" stroke="#1e160e" stroke-width=".7" fill="none" opacity=".75"/>`;
  k += `<path d="${fu}" stroke="#8a7a62" stroke-width=".35" fill="none" opacity=".5" transform="translate(.6 0)"/>`;
  /* Äste in die Krone */
  k += `<path d="M-4 -100 Q-14 -112 -26 -118 M3 -104 Q14 -116 22 -126 M0 -108 L-2 -130" stroke="#3e3226" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  /* Krone: Eichenlaub-Massen */
  let kr = "";
  for (let i = 0; i < 26; i++) { const a = rnd() * Math.PI, d = rnd(); kr += `<ellipse cx="${r(Math.cos(a) * 40 * d)}" cy="${r(-128 - Math.sin(a) * 18 * d)}" rx="${r(10 + rnd() * 8)}" ry="${r(6 + rnd() * 5)}" fill="${LAUB[Math.floor(rnd() * 5)]}"/>`; }
  k += kr;
  /* Moos am Fuß */
  k += `<path d="M${r(-w / 2 - 3)} 0 Q${r(-w / 2)} -6 ${r(-w / 2 + 1)} -12 L${r(-w / 2 + 6)} -4 Q0 -2 ${r(w / 2 + 4)} 0 Z" fill="${MOOS}" opacity=".85"/>`;
  /* Baumhöhle */
  k += `<ellipse cx="2" cy="-72" rx="6" ry="9" fill="#3a2a1a"/><ellipse cx="2" cy="-72" rx="4.6" ry="7.6" fill="#120a06"/>`;
  S.teil({ id: "eiche", de: "die Eiche", syl: "EI-che", it: "la quercia", itSyl: "QUER-cia", en: "oak", x: EI.x, y: EI.y, steht: true, kunst: k,
    tipp: "Die Eiche kann über 500 Jahre alt werden. Ihre Früchte heißen Eicheln." });
}
{
  /* Waldkauz in der Baumhöhle, tagsüber, von vorn */
  const k = sk(EI.y) / 100;
  let s = "";
  const K = [[0, -36], [-9, -33], [-12, -24], [-11, -12], [-8, -2], [0, 1], [8, -2], [11, -12], [12, -24], [9, -33]];
  let f = "";
  for (let i = 0; i < 40; i++) { const x = -10 + rnd() * 20, y = -18 + rnd() * 18; f += `<path d="M${r(x)} ${r(y)} l0 2.4" stroke="#3a2614" stroke-width=".7" opacity=".6"/>`; }
  f += `<path d="M-11 -14 Q-6 -20 0 -14 Q6 -20 11 -14" stroke="#e8d0a0" stroke-width="1" fill="none" opacity=".5"/>`;
  s += koerper(K, S.lg("kauz", [[0, "#9a6e42"], [1, "#6a4a2c"]]), f, { rw: 0.5 });
  /* Gesichtsschleier, Augen, Schnabel */
  s += `<path d="M0 -34 Q-9 -34 -9 -26 Q-9 -19 0 -18 Q9 -19 9 -26 Q9 -34 0 -34 Z" fill="${S.rg("schleier", [[0, "#d8b888"], [1, "#9a7048"]])}"/>`;
  s += `<path d="M0 -33 L0 -21" stroke="#6a4a2c" stroke-width=".6"/>`;
  s += auge(-3.6, -27, 2, "#140c08") + auge(3.6, -27, 2, "#140c08");
  s += `<path d="M-1 -24.5 L1 -24.5 L0 -21.4 Z" fill="#d8c48a"/>`;
  s += `<path d="M-6 -30.6 q2.4 -1.2 4.8 0 M1.2 -30.6 q2.4 -1.2 4.8 0" stroke="#5a3a20" stroke-width=".6" fill="none"/>`;
  S.teil({ oben: true, id: "eule", de: "die Eule", syl: "EU-le", it: "il gufo", itSyl: "GU-fo", en: "owl", x: EI.x + 2, y: EI.y - 64, kunst: skal(k, 1, s),
    tipp: "Ein Waldkauz. Am Tag schläft er in der Baumhöhle, nachts jagt er Mäuse." });
}
{
  /* DER AST der Eiche mit Blättern und Eicheln — Lupe */
  const eichenblatt = (x, y, l, wnk, farbe) => {
    const pts = [[0, 0], [0.18, -0.16], [0.26, -0.1], [0.36, -0.26], [0.46, -0.16], [0.58, -0.3], [0.7, -0.18], [0.82, -0.24], [1, 0], [0.82, 0.24], [0.7, 0.18], [0.58, 0.3], [0.46, 0.16], [0.36, 0.26], [0.26, 0.1], [0.18, 0.16]].map(([a, b]) => [a * l, b * l]);
    return `<g transform="translate(${r(x)} ${r(y)}) rotate(${r(wnk)})"><path d="${glatt(pts)}" fill="${farbe}"/><path d="M0 0 L${r(l * 0.92)} 0" stroke="#2a4a1a" stroke-width="${r(l * 0.03)}"/></g>`;
  };
  const eichel = (x, y, s) => `<g transform="translate(${r(x)} ${r(y)})"><ellipse cx="0" cy="${r(1.6 * s)}" rx="${r(1 * s)}" ry="${r(1.5 * s)}" fill="${S.lg("eichel", [[0, "#a8a040"], [1, "#6a6a20"]], 0, 0, 1, 0)}"/><path d="M${r(-1.15 * s)} ${r(0.7 * s)} Q0 ${r(-0.5 * s)} ${r(1.15 * s)} ${r(0.7 * s)} Q0 ${r(1.2 * s)} ${r(-1.15 * s)} ${r(0.7 * s)} Z" fill="#7a5a34"/><path d="M0 ${r(-0.3 * s)} l0 ${r(-1 * s)}" stroke="#5a4a2a" stroke-width="${r(0.3 * s)}"/></g>`;
  let k = `<path d="M-50 4 Q-30 -2 -10 2 Q10 6 34 2 Q46 0 56 4" stroke="#4a3a2a" stroke-width="3.2" fill="none" stroke-linecap="round"/>`;
  k += `<path d="M-10 2 Q0 12 6 18 M20 4 Q28 14 36 16 M34 2 Q44 -6 52 -8" stroke="#4a3a2a" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
  const bl = [[-44, 4, 13, 70], [-36, 2, 12, -40], [-26, 2, 13, 100], [-18, 1, 12, -60], [-6, 6, 13, 80], [2, 14, 12, 40], [8, 18, 12, 110], [14, 4, 13, -30], [24, 8, 12, 60], [32, 15, 13, 20], [38, 16, 12, 100], [40, -2, 12, -70], [48, -6, 13, -20], [54, 4, 12, 50]];
  bl.forEach(([x, y, l, w], i) => { k += eichenblatt(x, y, l, w, LAUB[i % 5]); });
  const BL = { x: 24, y: 8 };
  k += eichenblatt(BL.x, BL.y, 16, 60, "#5e9a3c");
  const EIC = [[2, 16], [5, 17.5], [36, 16]];
  for (const [x, y] of EIC) k += eichel(x, y, 1.2);
  const ax = 118, ay = 24;
  S.teil({ id: "ast", de: "der Ast", syl: "AST", it: "il ramo", itSyl: "RA-mo", en: "branch", x: ax, y: ay, kunst: k,
    zoom: { x: 60, y: 10, w: 120, h: 80 },
    unter: [
      { id: "blatt", de: "das Blatt", syl: "BLATT", it: "la foglia", itSyl: "FO-glia", en: "leaf", x: ax + BL.x, y: ay + BL.y + 6, kunst: flaeche(-4, -10, 18, 14), tipp: "Das Eichenblatt hat runde Lappen am Rand." },
      { id: "eichel", de: "die Eichel", syl: "EI-chel", it: "la ghianda", itSyl: "GHIAN-da", en: "acorn", x: ax + 3.5, y: ay + 20, kunst: flaeche(-4, -4, 8, 8), tipp: "Eicheln fressen Wildschweine, Eichhörnchen und Eichelhäher." },
    ],
    tipp: "Am Ast wachsen die Blätter und die Früchte." });
}

/* =====================================================================
   6 — DER WEGWEISER an der Wegkreuzung
   ===================================================================== */
{
  const yb = 137, s = sk(yb), m = (v) => r(v * s);
  let k = schatten(0, 0, m(0.25), m(0.06), 0.3);
  k += `<rect x="${m(-0.06)}" y="${m(-2.2)}" width="${m(0.12)}" height="${m(2.2)}" fill="${S.lg("pfosten", [[0, "#9a7a52"], [1, "#6a4e30"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${m(-0.07)} ${m(-2.2)} L0 ${m(-2.3)} L${m(0.07)} ${m(-2.2)} Z" fill="#5a3e24"/>`;
  const schild = (y, dir, text, km, marke) => {
    const w = 0.9, h = 0.18, x0 = dir > 0 ? 0.06 : -0.06 - w;
    const spitze = dir > 0 ? `L${m(x0 + w + 0.12)} ${m(y + h / 2)}` : "";
    const spitzeL = dir < 0 ? `L${m(x0 - 0.12)} ${m(y + h / 2)}` : "";
    let g = `<path d="M${m(x0)} ${m(y)} L${m(x0 + w)} ${m(y)} ${spitze} L${m(x0 + w)} ${m(y + h)} L${m(x0)} ${m(y + h)} ${spitzeL} Z" fill="#f2c62e" stroke="#7a6014" stroke-width=".25"/>`;
    g += `<text x="${m(x0 + (dir > 0 ? 0.08 : 0.12))}" y="${m(y + 0.125)}" font-size="${m(0.1)}" fill="#1a1a1a" font-family="Arial" font-weight="bold">${text}</text>`;
    g += `<text x="${m(x0 + w - (dir > 0 ? 0.02 : -0.02))}" y="${m(y + 0.125)}" font-size="${m(0.09)}" text-anchor="end" fill="#1a1a1a" font-family="Arial">${km}</text>`;
    if (marke) g += `<path d="M${m(x0 + w * 0.62)} ${m(y + 0.03)} l${m(0.05)} ${m(0.06)} l${m(-0.05)} ${m(0.06)} l${m(-0.05)} ${m(-0.06)} Z" fill="#2a5aa8"/>`;
    return g;
  };
  k += schild(-2.12, 1, "Waldsee", "2,5 km", true) + schild(-1.9, -1, "Forsthaus", "1,2 km", false) + schild(-1.68, 1, "Rundweg", "4 km", true);
  k += `<rect x="${m(-0.1)}" y="${m(-1.4)}" width="${m(0.2)}" height="${m(0.14)}" fill="#fff"/><path d="M${m(-0.04)} ${m(-1.33)} l${m(0.04)} ${m(-0.05)} l${m(0.04)} ${m(0.05)} l${m(-0.04)} ${m(0.05)} Z" fill="#2a5aa8"/>`;
  S.teil({ id: "wegweiser", de: "der Wegweiser", syl: "WEG-wei-ser", it: "il cartello indicatore", itSyl: "car-TEL-lo in-di-ca-TO-re", en: "signpost", x: 112, y: yb, steht: true, kunst: k,
    tipp: "Der Wegweiser zeigt, wohin der Weg führt und wie weit es ist." });
}

/* =====================================================================
   7 — DIE FICHTE (rechts) und DER AMEISENHAUFEN an ihrem Fuß
   ===================================================================== */
{
  const yb = 131, s = sk(yb);
  S.teil({ id: "fichte", de: "die Fichte", syl: "FICH-te", it: "l'abete rosso", itSyl: "a-BE-te ROS-so", en: "spruce", x: 280, y: yb, steht: true, kunst: nadelbaum(280, yb, s, 9, 4.1, "fichte"),
    tipp: "Die Fichte ist der häufigste Baum in Deutschland. Ihre Zapfen hängen nach unten." });
}
{
  const yb = 140, s = sk(yb);
  let k = schatten(0, 0, 0.9 * s, 0.1 * s, 0.35);
  const pts = [[-0.85, 0], [-0.7, -0.22], [-0.45, -0.55], [-0.2, -0.78], [0, -0.84], [0.22, -0.76], [0.5, -0.5], [0.72, -0.2], [0.88, 0]].map(([a, b]) => [a * s, b * s]);
  let f = striche(220, -0.85 * s, -0.84 * s, 0.88 * s, 0, 1.4, 0.5, "#c08a4a", 0.35, 0.75) + striche(160, -0.85 * s, -0.84 * s, 0.88 * s, 0, -1.2, 0.6, "#2a1a0c", 0.35, 0.7);
  f += `<ellipse cx="${r(-0.2 * s)}" cy="${r(-0.6 * s)}" rx="${r(0.4 * s)}" ry="${r(0.15 * s)}" fill="#fff" opacity=".12"/>`;
  /* Ameisen auf dem Haufen */
  for (let i = 0; i < 26; i++) { const x = (-0.7 + rnd() * 1.4) * s, y = -(0.05 + rnd() * 0.6) * s; f += `<ellipse cx="${r(x)}" cy="${r(y)}" rx=".5" ry=".22" fill="#2a0e06" transform="rotate(${Math.round(rnd() * 180)} ${r(x)} ${r(y)})"/>`; }
  k += koerper(pts, S.lg("haufen", [[0, "#9a6a3a"], [1, "#6a4424"]]), f, { rw: 0.3 });
  /* eine Ameise groß (für die Lupe): Rote Waldameise */
  const ameise = (x, y, k2) => `<g transform="translate(${r(x)} ${r(y)}) scale(${k2})"><ellipse cx="-2.6" cy="0" rx="2" ry="1.4" fill="#2a1008"/><ellipse cx="0" cy="-.2" rx="1.3" ry=".8" fill="#9a3a1a"/><circle cx="2.2" cy="-.6" r="1.1" fill="#7a2a12"/><path d="M-1.4 .4 l-1.4 2 M0 .4 l0 2.2 M1 .4 l1.4 2 M-1.4 -.6 l-1.4 -1.6 M0 -.8 l.2 -1.8 M1 -.6 l1.6 -1.4 M2.8 -1.2 l1.4 -1.6" stroke="#2a1008" stroke-width=".3" fill="none"/></g>`;
  const AM = [0.35 * s, -0.42 * s];
  k += ameise(AM[0], AM[1], 0.5);
  S.teil({ id: "ameisenhaufen", de: "der Ameisenhaufen", syl: "A-mei-sen-hau-fen", it: "il formicaio", itSyl: "for-mi-CA-io", en: "anthill", x: 296, y: yb, steht: true, kunst: k,
    zoom: { x: 266, y: 108, w: 54, h: 36 },
    unter: [{ id: "ameise", de: "die Ameise", syl: "A-mei-se", it: "la formica", itSyl: "for-MI-ca", en: "ant", x: 296 + AM[0], y: yb + AM[1] + 1.4, kunst: flaeche(-3, -3, 6, 4), tipp: "Die Rote Waldameise trägt Nadeln und Zweige zu ihrem Haufen." }],
    tipp: "In einem Ameisenhaufen leben Hunderttausende Ameisen." });
}

/* =====================================================================
   8 — DAS REH (auf dem Weg), DER HASE, DER FUCHS
   ===================================================================== */
{
  const yb = 136, s = sk(yb);
  S.teil({ id: "reh", de: "das Reh", syl: "REH", it: "il capriolo", itSyl: "ca-PRIO-lo", en: "roe deer", x: 176, y: yb,
    kunst: fertig(hirschkuh({ name: "reh", g: 1, spiegel: "#f4ead2", farben: [[0, "#c27a3c"], [0.6, "#a8602a"], [1, "#7a4220"]] }), s / 100, -1, 110),
    tipp: "Das Reh ist kleiner als der Hirsch. Hinten hat es einen weißen Fleck, den „Spiegel“." });
}
function hase() {
  let s = "";
  const K = [[-20, -2], [-24, -9], [-23, -18], [-16, -26], [-4, -30], [6, -30], [11, -31], [16, -32.5], [21, -30], [25.5, -25.5], [26, -23], [24, -22], [20, -21.5], [15, -21.5], [12, -18], [12.5, -9], [13.5, -2], [16, -0.6], [16, 0, 1], [9, 0, 1], [6, -2], [2, -1], [0, 0, 1], [-18, 0, 1]];
  let f = striche(60, -24, -32, 22, -2, 1.8, 0.4, "#2a1a0c", 0.35, 0.45) + striche(30, -24, -32, 22, -2, 1.6, 0.3, "#f0dcb4", 0.35, 0.5);
  f += `<path d="M-6 -8 Q-16 -12 -18 -2" stroke="#4a3018" stroke-width=".6" fill="none" opacity=".5"/>`;
  f += form([[-10, -10], [10, -12], [12, 0], [-14, 0]], "#e8dcc4", ` opacity=".35"`);
  s += koerper(K, S.lg("hase", [[0, "#a4825a"], [0.6, "#8a6a44"], [1, "#6a4e30"]]), f, { rw: 0.4 });
  s += form([[12, -31], [4, -40], [-2, -46.5], [0, -47], [8, -41], [15, -33]], "#8a6a44");
  s += form([[14, -32], [8, -42], [4, -48.5], [6, -48.8], [12, -43], [17, -33]], "#9a7a52");
  s += `<path d="M4 -48.5 L6 -48.8 L7.4 -46 L5 -45.4 Z M-2 -46.5 L0 -47 L1.4 -44.4 L-.8 -44 Z" fill="#1a120c"/>`;
  s += auge(19, -27.5, 1.5, "#b8862a", { pupille: true });
  s += `<path d="M24.6 -24.6 l1 .6" stroke="#4a3018" stroke-width=".6"/>`;
  s += `<path d="M24 -23.4 l6 -1 M24 -23 l6 .6" stroke="#f4f0e8" stroke-width=".15"/>`;
  return s;
}
{
  const yb = 150, s = sk(yb);
  S.teil({ id: "hase", de: "der Hase", syl: "HA-se", it: "la lepre", itSyl: "LE-pre", en: "hare", x: 196, y: yb, kunst: fertig(hase(), s / 100, -1, 46),
    tipp: "Der Feldhase hat lange Ohren mit schwarzen Spitzen." });
}
function fuchs() {
  let s = "";
  const ROT = S.lg("fuchs", [[0, "#e08a3a"], [0.6, "#c86a24"], [1, "#9a4a14"]]);
  s += form([[18, -24], [19, -10], [20, -2], [22, 0, 1], [17, 0, 1], [15, -4], [14, -22]], "#2a1a12");
  s += form([[-24, -26], [-27, -16], [-29, -6], [-28, -2], [-26, 0, 1], [-31, 0, 1], [-33, -6], [-34, -14], [-36, -24]], "#2a1a12");
  /* Lunte (Schwanz) */
  s += koerper([[-34, -32], [-48, -32], [-62, -28], [-74, -22], [-80, -18], [-78, -14], [-68, -14], [-54, -18], [-40, -22], [-33, -24]], ROT,
    form([[-82, -22], [-72, -20], [-72, -12], [-82, -12]], "#f4efe6") + striche(30, -78, -32, -36, -14, -2.4, 0.6, "#7a3a10", 0.4, 0.5), { rw: 0.4 });
  const K = [[-34, -36], [-12, -38], [12, -38], [20, -41], [26, -46], [30, -50], [32, -51], [33.5, -61, 1], [37, -53], [40, -53], [46, -49], [55, -45.5], [58, -44], [57, -42], [52, -41], [46, -40], [40, -38], [34, -35], [28, -28],
    [26, -24], [25, -10], [26, -3], [28, 0, 1], [23, 0, 1], [21, -4], [21, -18], [18, -24], [0, -25], [-20, -27],
    [-24, -28], [-27, -18], [-29, -8], [-28, -2], [-26, 0, 1], [-31, 0, 1], [-33, -6], [-34, -14], [-37, -24], [-39, -32]];
  let f = "";
  f += form([[40, -42], [56, -44], [52, -40], [42, -36], [34, -32], [30, -24], [26, -30]], "#f4efe6");
  f += form([[20, -12], [30, -12], [30, 2], [18, 2]], "#2a1a12") + form([[-36, -10], [-24, -10], [-24, 2], [-36, 2]], "#2a1a12");
  f += striche(50, -36, -40, 30, -26, 2.4, 0.5, "#7a3a10", 0.4, 0.4);
  s += koerper(K, ROT, f, { rw: 0.45 });
  s += `<path d="M32.4 -51 L33.5 -60 L36.4 -53 Z" fill="#2a1a12"/>`;
  s += auge(42.5, -48, 1.2, "#c8901a", { pupille: true, schlitz: true, flach: 0.8 });
  s += `<ellipse cx="57.6" cy="-43.6" rx="1.3" ry="1.1" fill="#141414"/>`;
  return s;
}
{
  const yb = 156, s = sk(yb);
  S.teil({ id: "fuchs", de: "der Fuchs", syl: "FUCHS", it: "la volpe", itSyl: "VOL-pe", en: "fox", x: 134, y: yb, kunst: fertig(fuchs(), s / 100, -1, 130),
    tipp: "Der Rotfuchs hat einen buschigen Schwanz mit weißer Spitze." });
}

/* =====================================================================
   9 — DER BACH (rechts vorn) und DER STEIN
   ===================================================================== */
{
  const mitte = [[318, 136], [304, 146], [290, 158], [281, 172], [275, 186], [272, 198]];
  const breite = [3, 5, 8, 12, 15, 18];
  const li = mitte.map(([x, y], i) => [x - breite[i] / 2, y + breite[i] * 0.1]), re = mitte.map(([x, y], i) => [x + breite[i] / 2, y - breite[i] * 0.1]);
  /* nasses Ufer, Wasser mit Himmelsspiegelung, Strömungslinien, Steine */
  const uli = li.map(([x, y]) => [x - 2, y]), ure = re.map(([x, y]) => [Math.min(320, x + 2), y]);
  let k = `<path d="${glatt([...uli, ...ure.reverse()])}" fill="#3a3020" opacity=".6"/>`;
  k += `<path d="${glatt([...li, ...re.reverse()])}" fill="${S.lg("wasser", [[0, "#9ab8b0"], [0.4, "#5a8078"], [1, "#2e4a44"]], 1, 0, 0, 0.3)}"/>`;
  let wl = "";
  for (let i = 0; i < 16; i++) { const t = rnd() * 0.9 + 0.05, j = Math.floor(t * 5), u = t * 5 - j, [x0, y0] = mitte[j], [x1, y1] = mitte[j + 1], x = x0 + (x1 - x0) * u + (rnd() - 0.5) * breite[j] * 0.6, y = y0 + (y1 - y0) * u, l = 1 + breite[j] * 0.15; wl += `M${r(x)} ${r(y)}q${r(-l * 0.3)} ${r(l * 0.6)} ${r(-l * 0.2)} ${r(l * 1.4)}`; }
  k += `<path d="${wl}" stroke="#e8f4f2" stroke-width=".45" fill="none" opacity=".7" stroke-linecap="round"/>`;
  for (const [x, y, a] of [[297, 152, 1.6], [283, 176, 2.4], [268, 194, 3], [291, 166, 1.8], [286, 182, 1.4]]) k += `<ellipse cx="${x}" cy="${y}" rx="${a}" ry="${r(a * 0.5)}" fill="#7a7a6a"/><ellipse cx="${r(x - a * 0.2)}" cy="${r(y - a * 0.2)}" rx="${r(a * 0.5)}" ry="${r(a * 0.2)}" fill="#c4c4b4"/><path d="M${r(x - a)} ${r(y + a * 0.3)} q${a} ${r(a * 0.4)} ${r(a * 2)} 0" stroke="#fff" stroke-width=".35" fill="none" opacity=".6"/>`;
  S.teil({ id: "bach", de: "der Bach", syl: "BACH", it: "il ruscello", itSyl: "ru-SCEL-lo", en: "brook", x: 284, y: 200, kunst: um(284, 200, k),
    tipp: "Der Bach bringt frisches Wasser für die Tiere." });
}

/* =====================================================================
   10 — DAS WILDSCHWEIN
   ===================================================================== */
function wildschwein() {
  /* Keiler beim Wühlen: Kopf tief, Schnauze am Boden, hoher Widerrist mit Borstenkamm */
  let s = "";
  const FELL = S.lg("wildsau", [[0, "#5e4e40"], [0.55, "#40342a"], [1, "#2a2018"]]);
  const dreh = (pts, cx, cy, wnk) => { const a = wnk * Math.PI / 180, c = Math.cos(a), sn = Math.sin(a); return pts.map(([x, y, e]) => { if (x < cx) return e ? [x, y, e] : [x, y]; const dx = x - cx, dy = y - cy; const q = [cx + dx * c - dy * sn, cy + dx * sn + dy * c]; return e ? [...q, e] : q; }); };
  s += form([[26, -30], [25, -12], [26, -2], [28, 0, 1], [22, 0, 1], [20, -4], [19, -26]], "#1e160e");
  s += form([[-34, -32], [-38, -18], [-38, -4], [-36, 0, 1], [-42, 0, 1], [-44, -8], [-46, -20], [-50, -34]], "#1e160e");
  const kopf = [[18, -88], [28, -84], [36, -78], [46, -70], [58, -60], [70, -50], [77, -45], [82, -43], [83, -36], [80, -32], [72, -31], [62, -32], [52, -34], [42, -38], [34, -38], [30, -34]];
  const K = [[-58, -54], [-50, -64], [-34, -72], [-12, -80], [6, -88], ...dreh(kopf, 24, -72, 28),
    [29, -30], [28, -12], [29, -3], [31, 0, 1], [24, 0, 1], [22, -4], [22, -14], [20, -28], [0, -30], [-28, -30],
    [-34, -33], [-38, -20], [-38, -6], [-37, 0, 1], [-44, 0, 1], [-46, -8], [-48, -20], [-54, -32], [-58, -42]];
  let f = striche(150, -58, -90, 70, -26, 1, 2.8, "#140e08", 0.6, 0.6) + striche(70, -58, -90, 70, -26, 0.8, 2.4, "#9a8a72", 0.45, 0.45);
  /* Borstenkamm auf dem Rücken */
  let bo = "";
  for (let x = -46; x < 22; x += 2) { const y = x < 6 ? -66 - (x + 46) / 52 * 22 : -88; bo += `M${x} ${r(y + 3)}l${r(-1)} ${r(-4.5)}`; }
  f += `<path d="${bo}" stroke="#140e08" stroke-width="1.2" stroke-linecap="round"/>`;
  f += `<path d="M24 -76 q-8 20 2 40" stroke="#000" stroke-opacity=".22" stroke-width="3" fill="none"/>`;
  f += `<path d="M-40 -60 q-10 14 -6 28" stroke="#000" stroke-opacity=".18" stroke-width="3" fill="none"/>`;
  s += koerper(K, FELL, f, { rw: 0.6 });
  /* Borsten stehen über die Rückenlinie hinaus */
  let bk = "";
  for (let x = -40; x < 20; x += 2.6) { const y = x < 6 ? -66 - (x + 46) / 52 * 22 : -88; bk += `M${x} ${r(y)}l${r(-0.8)} ${r(-3.4)}`; }
  s += `<path d="${bk}" stroke="#1a120c" stroke-width=".9" stroke-linecap="round"/>`;
  const Q = (x, y) => dreh([[x, y]], 24, -72, 28)[0].map(r);
  const oh = [[30, -82], [27, -96], [30, -98, 1], [38, -86], [38, -80]];
  s += form(dreh(oh, 24, -72, 28), "#2a2018");
  const sn = Q(82.5, -39.5), au = Q(42, -64), za = Q(64, -33), zb = Q(70, -40);
  s += `<ellipse cx="${sn[0]}" cy="${sn[1]}" rx="2.4" ry="3.6" fill="#3a2a22" transform="rotate(28 ${sn[0]} ${sn[1]})"/><ellipse cx="${sn[0]}" cy="${sn[1]}" rx=".6" ry=".9" fill="#000"/>`;
  s += `<path d="M${za[0]} ${za[1]} Q${r(za[0] + 1)} ${r(za[1] - 6)} ${zb[0]} ${zb[1]}" stroke="#f2ead8" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
  s += auge(au[0], au[1], 1.2, "#2a1a10");
  s += `<path d="M-58 -54 q-2 6 -1 14" stroke="#1a120c" stroke-width="1.4" fill="none"/><path d="M-60 -42 l-1.4 5 l2.6 0 Z" fill="#1a120c"/>`;
  /* aufgewühlte Erde vor der Schnauze */
  s += `<ellipse cx="${r(sn[0] + 2)}" cy="-1" rx="10" ry="2.4" fill="#3e2c18"/><circle cx="${r(sn[0] + 6)}" cy="-3" r="1.4" fill="#4a3420"/><circle cx="${r(sn[0] - 4)}" cy="-2.6" r="1" fill="#4a3420"/>`;
  return s;
}
{
  const yb = 161, s = sk(yb);
  S.teil({ id: "wildschwein", de: "das Wildschwein", syl: "WILD-schwein", it: "il cinghiale", itSyl: "cin-GHIA-le", en: "wild boar", x: 234, y: yb, kunst: fertig(wildschwein(), s / 100, 1, 145),
    tipp: "Das Wildschwein wühlt mit der Schnauze im Boden nach Eicheln und Würmern." });
}

/* =====================================================================
   11 — DER BAUMSTUMPF (mit Moos, Pilzen, Zapfen) und DAS EICHHÖRNCHEN
   ===================================================================== */
const ST = { x: 76, y: 172 };
{
  const s = sk(ST.y), w = 0.62 * s, h = 0.42 * s;
  let k = schatten(0, 0, w * 0.75, 0.1 * s, 0.35);
  k += `<path d="M${r(-w / 2 - 4)} 0 Q${r(-w / 2)} -3 ${r(-w / 2 + 1)} ${r(-h)} L${r(w / 2 - 1)} ${r(-h)} Q${r(w / 2)} -3 ${r(w / 2 + 5)} 0 Z" fill="${RINDE_E}"/>`;
  let fu = "";
  for (let i = 0; i < 10; i++) { const x = -w / 2 + 2 + i * (w - 4) / 9; fu += `M${r(x)} -1 L${r(x + (rnd() - 0.5) * 2)} ${r(-h + 2)}`; }
  k += `<path d="${fu}" stroke="#1e160e" stroke-width=".6" opacity=".7"/>`;
  /* Schnittfläche mit Jahresringen */
  k += `<ellipse cx="0" cy="${r(-h)}" rx="${r(w / 2 - 0.6)}" ry="${r(w * 0.16)}" fill="#b8925a"/>`;
  for (let i = 1; i < 6; i++) k += `<ellipse cx="${r(-1 + i * 0.1)}" cy="${r(-h)}" rx="${r((w / 2 - 1) * i / 6)}" ry="${r(w * 0.16 * i / 6)}" fill="none" stroke="#8a6a3a" stroke-width=".25"/>`;
  k += `<path d="M-2 ${r(-h)} l${r(w * 0.3)} ${r(-w * 0.04)}" stroke="#5a3a1a" stroke-width=".3"/>`;
  /* Moos am Fuß und an der Seite */
  const MO = [-w / 2 - 3, -2];
  k += `<path d="M${r(-w / 2 - 4)} 0 Q${r(-w / 2 - 1)} -4 ${r(-w / 2 + 1)} -12 Q${r(-w / 2 + 6)} -10 ${r(-w / 2 + 8)} -4 Q${r(-w / 2 + 12)} -2 ${r(-w / 2 + 14)} 0 Z" fill="${MOOS}"/>`;
  k += striche(40, -w / 2 - 4, -12, -w / 2 + 14, 0, 0.2, -1, "#b8d870", 0.35, 0.8);
  /* Pilzgruppe (Stockschwämmchen) an der rechten Seite */
  const PI = [w / 2 - 2, -6];
  let pi = "";
  for (const [dx, dy, sc] of [[0, 0, 1], [2.6, 1.6, 0.8], [-2, 1.2, 0.7], [1.2, -3, 0.75]]) {
    const x = PI[0] + dx, y = PI[1] + dy;
    pi += `<path d="M${r(x - 0.4 * sc)} ${r(y)} L${r(x - 0.3 * sc)} ${r(y - 2.4 * sc)} L${r(x + 0.4 * sc)} ${r(y - 2.4 * sc)} L${r(x + 0.5 * sc)} ${r(y)} Z" fill="#e2c89a"/>`;
    pi += `<path d="M${r(x - 2.2 * sc)} ${r(y - 2.2 * sc)} Q${r(x)} ${r(y - 4.6 * sc)} ${r(x + 2.2 * sc)} ${r(y - 2.2 * sc)} Z" fill="${S.lg("stock", [[0, "#d8903a"], [1, "#a8601a"]])}"/>`;
  }
  k += pi;
  /* Fichtenzapfen auf der Schnittfläche */
  const ZA = [-w * 0.22, -h - 0.4];
  k += `<g transform="translate(${r(ZA[0])} ${r(ZA[1])}) rotate(-80)"><ellipse cx="0" cy="0" rx="1.3" ry="3.4" fill="#8a4a2a"/><path d="M-1.2 -2 l2.4 .8 M-1.3 -.6 l2.6 .8 M-1.3 .8 l2.6 .8 M-1.1 2.2 l2.2 .6" stroke="#5a2a14" stroke-width=".35"/></g>`;
  S.teil({ id: "baumstumpf", de: "der Baumstumpf", syl: "BAUM-stumpf", it: "il ceppo", itSyl: "CEP-po", en: "tree stump", x: ST.x, y: ST.y, steht: true, kunst: k,
    zoom: { x: ST.x - 30, y: ST.y - 36, w: 60, h: 40 },
    unter: [
      { id: "moos", de: "das Moos", syl: "MOOS", it: "il muschio", itSyl: "MU-schio", en: "moss", x: ST.x + MO[0] + 8, y: ST.y, kunst: flaeche(-9, -12, 18, 12), tipp: "Moos speichert Wasser wie ein Schwamm." },
      { id: "pilz", de: "der Pilz", syl: "PILZ", it: "il fungo", itSyl: "FUN-go", en: "mushroom", x: ST.x + PI[0] + 0.5, y: ST.y + PI[1] + 2, kunst: flaeche(-5, -9, 10, 9) },
      { id: "zapfen", de: "der Zapfen", syl: "ZAP-fen", it: "la pigna", itSyl: "PI-gna", en: "cone", x: ST.x + ZA[0], y: ST.y + ZA[1] + 1.6, kunst: flaeche(-4.5, -3, 9, 3.6), tipp: "Das Eichhörnchen frisst die Samen aus dem Zapfen." },
    ],
    tipp: "Aus dem alten Baumstumpf wachsen Moos und Pilze." });
}
function eichhoernchen() {
  let s = "";
  const ROT = S.lg("hoernchen", [[0, "#c86a32"], [1, "#9a4a1c"]]);
  s += koerper([[-5, -3], [-12, -6], [-17, -12], [-18, -20], [-16, -28], [-12, -33], [-7, -35], [-4, -33], [-8, -30], [-12, -26], [-13, -18], [-10, -11], [-5, -8]], ROT,
    striche(40, -18, -35, -4, -3, 1, -1.6, "#e8a060", 0.35, 0.6), { rw: 0.3 });
  const K = [[7, -1], [1, 0], [-5, -2], [-7, -7], [-6, -13], [-3, -18], [0, -21], [1, -24], [1.6, -26.6], [1.2, -30.5, 1], [3.6, -27.4], [6, -27.6], [9, -25.5], [10.5, -23.6], [9.6, -22.6], [7.5, -22], [5, -21], [4.4, -18], [6.6, -16.4], [7.4, -14.6], [5.4, -13.4], [4.4, -10], [6, -6.4], [8.6, -3.6], [9, -1.4]];
  let f = form([[4, -21], [8, -22], [6.4, -16], [4.6, -10], [5.4, -6], [2, -6], [2, -18]], "#f4ead8");
  f += striche(30, -7, -28, 8, -1, 0.6, -1.4, "#7a3410", 0.3, 0.5);
  s += koerper(K, ROT, f, { rw: 0.3 });
  s += `<path d="M1.6 -26.6 l-.8 -5.4 M1.2 -27 l.4 -5 M2 -27 l-1.8 -4.4" stroke="#6a2a0c" stroke-width=".4"/>`;
  s += auge(6, -24.6, 0.9, "#120a06");
  s += `<ellipse cx="7.8" cy="-14.6" rx="1.4" ry="1" fill="#7a4a24"/>`;
  return s;
}
{
  const s = sk(ST.y), h = 0.42 * s;
  S.teil({ oben: true, id: "eichhoernchen", de: "das Eichhörnchen", syl: "EICH-hörn-chen", it: "lo scoiattolo", itSyl: "sco-IAT-to-lo", en: "squirrel", x: ST.x + 3, y: ST.y - h - 0.6, kunst: skal(s / 100 * 1.05, 1, eichhoernchen()),
    tipp: "Das Eichhörnchen versteckt Nüsse für den Winter – und vergisst viele davon." });
}

/* =====================================================================
   12 — DIE BUCHE (vorn links, „der Baum“), DIE WURZEL, DER SPECHT
   ===================================================================== */
const BU = { x: 18, y: 192 };
{
  const s = sk(BU.y), w = 0.62 * s;
  let k = `<path d="M${r(-w / 2)} 0 L${r(-w / 2 + 1)} -192 L${r(w / 2 - 1)} -192 L${r(w / 2)} 0 Z" fill="${RINDE_B}"/>`;
  /* glatte Buchenrinde: helle Flecken, Querrisse, Flechten */
  let fl = "";
  for (let i = 0; i < 30; i++) fl += `<ellipse cx="${r(-w / 2 + 2 + rnd() * (w - 4))}" cy="${r(-10 - rnd() * 178)}" rx="${r(1 + rnd() * 3)}" ry="${r(0.6 + rnd() * 1.4)}" fill="${rnd() < 0.6 ? "#d4d8cf" : "#8a9a7a"}" opacity=".5"/>`;
  for (let i = 0; i < 18; i++) { const y = -10 - rnd() * 185, x = -w / 2 + 3 + rnd() * (w - 10); fl += `<path d="M${r(x)} ${r(y)} q2 -.6 4 0" stroke="#5a5e58" stroke-width=".35" fill="none" opacity=".7"/>`; }
  k += fl;
  k += `<rect x="${r(-w / 2)}" y="-192" width="${r(w * 0.2)}" height="192" fill="#000" opacity=".15"/>`;
  k += `<path d="M${r(w / 2 - 6)} -192 L${r(w / 2 - 5)} 0" stroke="#e8ece4" stroke-width="2" opacity=".25"/>`;
  S.teil({ id: "baum", de: "der Baum", syl: "BAUM", it: "l'albero", itSyl: "AL-be-ro", en: "tree", x: BU.x, y: BU.y, steht: true, kunst: k,
    tipp: "Eine Rotbuche – der häufigste Laubbaum in Deutschland. Ihre Rinde ist glatt und grau." });
}
{
  const s = sk(BU.y), w = 0.62 * s;
  let k = schatten(12, 0, w * 0.8, 3, 0.35);
  /* Wurzelanlauf: der Stamm wird unten breit, dicke Wurzeln laufen über den Boden */
  const L = -w / 2, R = w / 2;
  const RB = S.lg("buchewurzel", [[0, "#7d817c"], [0.25, "#b9bdb6"], [0.55, "#a3a8a1"], [1, "#6a6e69"]], r(L), 0, r(R), 0, ' gradientUnits="userSpaceOnUse"');
  k += `<path d="M${r(L)} 2 L${r(L)} -16 Q${r(L + 2)} -20 ${r(L + 4)} -22 L${r(R - 3)} -22 Q${r(R)} -12 ${r(R + 8)} -5 Q${r(R + 18)} -1 ${r(R + 34)} 3 Q${r(R + 20)} 5 ${r(R + 10)} 2 Q${r(R + 8)} 5 ${r(R + 14)} 7 Q${r(R + 2)} 7 ${r(R - 4)} 3 Q${r(L + 10)} 6 ${r(L)} 2 Z" fill="${RB}"/>`;
  k += `<path d="M${r(R - 2)} -14 Q${r(R + 6)} -6 ${r(R + 30)} 2.4" stroke="#5a5e58" stroke-width="1" fill="none" opacity=".55"/>`;
  k += `<path d="M${r(R - 6)} -6 Q${r(R + 4)} 1 ${r(R + 12)} 6" stroke="#5a5e58" stroke-width=".8" fill="none" opacity=".5"/>`;
  k += `<path d="M${r(L + 6)} -10 Q${r(L + 10)} -2 ${r(L + 16)} 3" stroke="#5a5e58" stroke-width=".8" fill="none" opacity=".45"/>`;
  k += `<path d="M${r(R + 2)} -7 Q${r(R + 14)} -3 ${r(R + 26)} 1.6 L${r(R + 16)} 1.6 Q${r(R + 8)} -1 ${r(R)} -2 Z" fill="${MOOS}" opacity=".9"/>`;
  k += `<path d="M${r(L)} -4 Q${r(L + 8)} -8 ${r(L + 14)} -3 Q${r(L + 8)} 1 ${r(L)} 1 Z" fill="${MOOS}" opacity=".85"/>`;
  k += striche(30, L, -10, R + 26, 2, 0.2, -1, "#b8d870", 0.3, 0.7);
  k += `<path d="M${r(L)} 2 L${r(L)} -12 Q${r(R)} -12 ${r(R + 10)} -4 Q${r(R + 20)} 0 ${r(R + 34)} 3 Q${r(R + 14)} 6 ${r(R)} 4 Q0 7 ${r(L)} 2 Z" fill="${S.lg("wurzelschatten", [[0, "#000", 0], [1, "#2a1a0a", 0.4]])}"/>`;
  for (let i = 0; i < 26; i++) { const x = L + rnd() * (R + 30 - L), y = 1 + rnd() * 6; k += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(0.8 + rnd())}" ry=".5" fill="${["#8a5a2a", "#a8783a", "#6a4a24"][Math.floor(rnd() * 3)]}"/>`; }
  S.teil({ id: "wurzel", de: "die Wurzel", syl: "WUR-zel", it: "la radice", itSyl: "ra-DI-ce", en: "root", x: BU.x, y: BU.y, steht: true, kunst: k,
    tipp: "Mit den Wurzeln hält sich der Baum fest und trinkt Wasser aus dem Boden." });
}
function specht() {
  /* Buntspecht, Männchen, senkrecht am Stamm, Blick nach links zum Stamm */
  let s = "";
  const K = [[-6.5, -18.6], [-2.6, -19.8], [0, -22], [2.8, -20.4], [3.6, -15], [3.4, -8], [2.6, -2], [1.4, 4], [0.6, 7], [-0.4, 3], [-1.6, -3], [-2.2, -10], [-2.6, -15], [-3.2, -17.4]];
  let f = "";
  f += form([[0.4, -16], [4, -16], [4, 8], [0.6, 8]], "#141414");
  f += `<ellipse cx="1.6" cy="-11" rx="1.2" ry="3" fill="#f6f4ee"/>`;
  for (let i = 0; i < 5; i++) f += `<circle cx="${r(2.6 - (i % 2) * 0.6)}" cy="${r(-6 + i * 1.6)}" r=".35" fill="#f6f4ee"/>`;
  f += form([[-3, -6], [1, -6], [1, 2], [-1, 3]], "#d8303a");
  f += form([[1.6, -21.6], [3.6, -20], [3.2, -18.4], [1.2, -19.6]], "#d8303a");
  f += form([[-1, -21.8], [1.6, -21.6], [1.4, -19.4], [-0.6, -19.6]], "#141414");
  f += `<path d="M-2.6 -16.6 Q0 -15.6 2.8 -17.4" stroke="#141414" stroke-width=".8" fill="none"/>`;
  s += koerper(K, "#f0e8dc", f, { rw: 0.25 });
  s += `<path d="M-2.8 -18.9 L-7.2 -18.6 L-2.8 -17.8 Z" fill="#3a3a3a"/>`;
  s += auge(-1.2, -18.8, 0.6, "#3a1010");
  s += `<path d="M-1 -1 l-1.6 .4 M-1 0 l-1.6 1.4" stroke="#4a4a4a" stroke-width=".4"/>`;
  return s;
}
{
  const s = sk(BU.y), w = 0.62 * s;
  S.teil({ oben: true, id: "specht", de: "der Specht", syl: "SPECHT", it: "il picchio", itSyl: "PIC-chio", en: "woodpecker", x: BU.x + w / 2 + 2.4, y: 98, kunst: skal(s / 100 * 1.15, 1, specht()),
    tipp: "Der Buntspecht klopft mit dem Schnabel Löcher in die Rinde – man hört es weit." });
}

/* =====================================================================
   13 — DER FLIEGENPILZ, DER STEINPILZ, DER IGEL
   ===================================================================== */
{
  const yb = 186, s = sk(yb) / 100;
  let k = schatten(0, 0, 6, 0.8, 0.3);
  const m = (v) => r(v * s);
  k += `<path d="M${m(-2.2)} 0 Q${m(-3)} ${m(-8)} ${m(-1.8)} ${m(-16)} L${m(1.8)} ${m(-16)} Q${m(3)} ${m(-8)} ${m(2.4)} 0 Z" fill="${S.lg("stiel1", [[0, "#f6f2e6"], [1, "#d8d2c0"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${m(-2.4)} ${m(-10)} Q0 ${m(-8.4)} ${m(2.4)} ${m(-10)} L${m(2.8)} ${m(-8.6)} Q0 ${m(-7)} ${m(-2.8)} ${m(-8.6)} Z" fill="#f2eee2"/>`;
  k += `<path d="M${m(-3.4)} 0 Q0 ${m(-3)} ${m(3.6)} 0 Z" fill="#eae4d4"/>`;
  k += `<path d="M${m(-7.6)} ${m(-14.6)} Q${m(-7)} ${m(-22)} 0 ${m(-22.6)} Q${m(7)} ${m(-22)} ${m(7.6)} ${m(-14.6)} Q0 ${m(-13)} ${m(-7.6)} ${m(-14.6)} Z" fill="${S.rg("fliegen", [[0, "#f04a2a"], [0.7, "#d8281a"], [1, "#a01a10"]], 0.4, 0.3, 0.8)}"/>`;
  for (const [x, y, a] of [[-4, -18, 0.9], [-1, -20.6, 0.8], [2.6, -19, 1], [5, -16.4, 0.7], [-5.8, -15.6, 0.6], [0.6, -16.6, 0.7]]) k += `<ellipse cx="${m(x)}" cy="${m(y)}" rx="${m(a)}" ry="${m(a * 0.7)}" fill="#fbf8ee"/>`;
  k += `<path d="M${m(-5)} ${m(-20)} Q${m(-2)} ${m(-22)} ${m(1)} ${m(-21.8)}" stroke="#fff" stroke-width="${m(0.5)}" opacity=".45" fill="none"/>`;
  S.teil({ id: "fliegenpilz", de: "der Fliegenpilz", syl: "FLIE-gen-pilz", it: "l'ovolo malefico", itSyl: "O-vo-lo ma-LE-fi-co", en: "fly agaric", x: 96, y: yb, steht: true, kunst: k,
    tipp: "Der Fliegenpilz ist giftig! Rot mit weißen Punkten – nicht essen." });
}
{
  const yb = 193, s = sk(yb) / 100, m = (v) => r(v * s);
  let k = schatten(0, 0, 6, 0.8, 0.3);
  k += `<path d="M${m(-3.4)} 0 Q${m(-4.4)} ${m(-6)} ${m(-2.6)} ${m(-11)} L${m(2.6)} ${m(-11)} Q${m(4.6)} ${m(-6)} ${m(3.6)} 0 Z" fill="${S.lg("stiel2", [[0, "#efe4c8"], [1, "#cbb88e"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${m(-2)} ${m(-8)} l${m(4)} ${m(0)} M${m(-2.4)} ${m(-6)} l${m(4.6)} 0" stroke="#d8c8a0" stroke-width="${m(0.3)}"/>`;
  k += `<path d="M${m(-6.6)} ${m(-10)} Q${m(-6.4)} ${m(-16.6)} 0 ${m(-17)} Q${m(6.4)} ${m(-16.6)} ${m(6.6)} ${m(-10)} Q0 ${m(-8.6)} ${m(-6.6)} ${m(-10)} Z" fill="${S.rg("steinpilz", [[0, "#a8683a"], [0.7, "#7a4422"], [1, "#5a3018"]], 0.4, 0.3, 0.8)}"/>`;
  k += `<path d="M${m(-6.4)} ${m(-10.2)} Q0 ${m(-8.4)} ${m(6.4)} ${m(-10.2)}" stroke="#e0d4a4" stroke-width="${m(0.6)}" fill="none"/>`;
  k += `<path d="M${m(-4)} ${m(-15)} Q${m(-1)} ${m(-16.6)} ${m(2)} ${m(-16.2)}" stroke="#fff" stroke-width="${m(0.5)}" opacity=".35" fill="none"/>`;
  S.teil({ id: "steinpilz", de: "der Steinpilz", syl: "STEIN-pilz", it: "il porcino", itSyl: "por-CI-no", en: "porcini", x: 110, y: yb, steht: true, kunst: k,
    tipp: "Der Steinpilz ist ein beliebter Speisepilz mit braunem Hut und dickem Stiel." });
}
function igel() {
  let s = "";
  s += `<path d="M-6 -2 l-.6 2 M6 -2 l.6 2 M10 -2 l.8 2" stroke="#4a3626" stroke-width="1.4" stroke-linecap="round"/>`;
  s += koerper([[10, -2], [13, -3.6], [16.6, -4], [17.6, -3.4], [16.6, -2.2], [13, -1], [9, -1]], "#9a7a5a", "", { rw: 0.3 });
  const K = [[-14, -1], [-15, -6], [-12, -11], [-5, -14], [3, -14], [9, -11], [12.4, -6.6], [12, -2.4], [6, -1], [-6, -1]];
  let f = "";
  /* Stacheln: von der Mitte nach außen, dunkel mit hellen Spitzen */
  let d1 = "", d2 = "";
  for (let i = 0; i < 160; i++) {
    const a = Math.PI * (0.98 + rnd() * 1.04), rr = 4 + rnd() * 9, x = -1 + Math.cos(a) * rr * 1.25, y = -2 + Math.sin(a) * rr * 0.95, l = 3 + rnd() * 2;
    const dx = Math.cos(a) * l * 0.9 - 0.8, dy = Math.sin(a) * l * 0.6;
    d1 += `M${r(x)} ${r(y)}l${r(dx)} ${r(dy)}`; d2 += `M${r(x + dx * 0.7)} ${r(y + dy * 0.7)}l${r(dx * 0.3)} ${r(dy * 0.3)}`;
  }
  f += `<path d="${d1}" stroke="#2a1e14" stroke-width=".55" stroke-linecap="round"/><path d="${d2}" stroke="#e8dcc4" stroke-width=".5" stroke-linecap="round"/>`;
  s += koerper(K, "#5a4632", f, { rw: 0.3 });
  s += `<ellipse cx="17.7" cy="-3.6" rx=".9" ry=".7" fill="#141414"/>`;
  s += auge(13.4, -4.6, 0.6, "#120a06");
  return s;
}
{
  const yb = 190, s = sk(yb);
  S.teil({ id: "igel", de: "der Igel", syl: "I-gel", it: "il riccio", itSyl: "RIC-cio", en: "hedgehog", x: 152, y: yb, kunst: fertig(igel(), s / 100, 1, 30),
    tipp: "Bei Gefahr rollt sich der Igel zu einer Stachelkugel zusammen." });
}

/* =====================================================================
   14 — DER FARN (rechts vorn) und DER STRAUCH (Heidelbeeren) mit Lupe
   ===================================================================== */
{
  const yb = 200;
  let k = "";
  const wedel = (x0, y0, l, wnk, farbe) => {
    let g = "", d = "";
    const a = wnk * Math.PI / 180;
    const P2 = (t) => [x0 + Math.cos(a) * l * t + Math.sin(t * 2.4) * l * 0.08 * (wnk > -90 ? 1 : -1), y0 + Math.sin(a) * l * t + t * t * l * 0.18];
    const pts = []; for (let t = 0; t <= 1.001; t += 0.1) pts.push(P2(t));
    g += `<path d="${glatt(pts, false)}" stroke="#4a6a24" stroke-width=".6" fill="none"/>`;
    for (let t = 0.06; t < 1; t += 0.055) {
      const [x, y] = P2(t), bl = l * 0.2 * Math.sin(Math.PI * Math.min(1, t * 1.1)) + 0.6;
      for (const sx of [-1, 1]) { const b = a + sx * 1.15; d += `M${r(x)} ${r(y)}q${r(Math.cos(b) * bl * 0.5)} ${r(Math.sin(b) * bl * 0.5 - 0.6)} ${r(Math.cos(b) * bl)} ${r(Math.sin(b) * bl + 0.4)}`; }
    }
    g += `<path d="${d}" stroke="${farbe}" stroke-width="1.6" stroke-linecap="round" fill="none"/>`;
    return g;
  };
  for (const [l, w, f] of [[40, -150, "#4f8a2c"], [44, -125, "#5e9a34"], [42, -100, "#4a8028"], [38, -75, "#5e9a34"], [34, -55, "#3f7a24"], [30, -165, "#3f7a24"]]) k += wedel(0, 0, l, w, f);
  S.teil({ id: "farn", de: "der Farn", syl: "FARN", it: "la felce", itSyl: "FEL-ce", en: "fern", x: 236, y: yb, steht: true, kunst: k,
    tipp: "Farne haben keine Blüten. Sie vermehren sich mit Sporen unter den Blättern." });
}
{
  const yb = 199, x0 = 48;
  let k = "";
  const blaetter = [];
  for (let i = 0; i < 70; i++) { const a = Math.PI * (1.05 + rnd() * 0.9), d = rnd(); blaetter.push([Math.cos(a) * 26 * d, -2 + Math.sin(a) * 22 * d]); }
  k += `<path d="M-10 0 Q-12 -10 -16 -18 M0 0 Q2 -12 -2 -22 M10 0 Q14 -10 18 -16" stroke="#4a5a24" stroke-width=".9" fill="none"/>`;
  for (const [x, y] of blaetter) k += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="2.4" ry="1.4" fill="${["#3f7a2c", "#4f8a34", "#5e9a3c", "#2f6a24"][Math.floor(rnd() * 4)]}" transform="rotate(${Math.round(rnd() * 180)} ${r(x)} ${r(y)})"/>`;
  const BE = [[-8, -10], [-6, -9], [-7, -7.4], [6, -14], [8, -13], [12, -6], [-14, -4], [2, -18], [3.6, -17]];
  for (const [x, y] of BE) k += `<circle cx="${x}" cy="${y}" r="1.25" fill="${S.rg("heidel", [[0, "#6a7ab8"], [0.6, "#2a3a7a"], [1, "#1a2050"]], 0.35, 0.3, 0.8)}"/><circle cx="${x - 0.3}" cy="${y - 0.4}" r=".3" fill="#c8d0e8" opacity=".8"/>`;
  /* Tagpfauenauge auf einem Blatt */
  const SM = [14, -20];
  const fluegel = (sx) => `<path d="M0 0 Q${sx * 3} -4.6 ${sx * 6} -3.6 Q${sx * 6.4} -1 ${sx * 4} .4 Q${sx * 4.6} 2.6 ${sx * 3} 4 Q${sx * 1} 3.6 0 1 Z" fill="#a8301e"/><circle cx="${sx * 4.2}" cy="-2.2" r="1.4" fill="#2a2a4a"/><circle cx="${sx * 4.2}" cy="-2.2" r=".9" fill="#5a7ac8"/><circle cx="${sx * 4.4}" cy="-2.4" r=".4" fill="#f2d24a"/><path d="M${sx * 3.2} 2.4 a1 1 0 1 0 .1 .1" fill="#2a2a3a"/>`;
  k += `<g transform="translate(${SM[0]} ${SM[1]}) rotate(-12)">${fluegel(-1)}${fluegel(1)}<rect x="-.35" y="-2" width=".7" height="5" rx=".35" fill="#1a1410"/><path d="M0 -2 l-1 -2 M0 -2 l1 -2" stroke="#1a1410" stroke-width=".2"/></g>`;
  S.teil({ id: "strauch", de: "der Strauch", syl: "STRAUCH", it: "il cespuglio", itSyl: "ce-SPU-glio", en: "bush", x: x0, y: yb, steht: true, kunst: k,
    zoom: { x: x0 - 30, y: yb - 40, w: 60, h: 40 },
    unter: [
      { id: "beere", de: "die Beere", syl: "BEE-re", it: "la bacca", itSyl: "BAC-ca", en: "berry", x: x0 - 7, y: yb - 6, kunst: flaeche(-4, -6, 8, 6), tipp: "Heidelbeeren sind blau und süß. Im Juli kann man sie sammeln." },
      { id: "schmetterling", de: "der Schmetterling", syl: "SCHMET-ter-ling", it: "la farfalla", itSyl: "far-FAL-la", en: "butterfly", x: x0 + SM[0], y: yb + SM[1] + 4, kunst: flaeche(-6.6, -9, 13.2, 9.6), tipp: "Ein Tagpfauenauge: Die Flecken auf den Flügeln sehen aus wie Augen." },
    ],
    tipp: "Ein Heidelbeerstrauch – er wird nur kniehoch." });
}

/* =====================================================================
   VORNE: Lichtstrahlen durch das Blätterdach (fangen keinen Tipp ab)
   ===================================================================== */
const STRAHL = S.lg("strahl", [[0, "#fffbe0", 0.5], [1, "#fffbe0", 0]]);
S.davor(`<g opacity=".5" pointer-events="none"><path d="M190 0 L214 0 L250 150 L196 150 Z" fill="${STRAHL}"/><path d="M240 0 L254 0 L300 120 L270 120 Z" fill="${STRAHL}"/><path d="M120 0 L130 0 L150 110 L128 110 Z" fill="${STRAHL}"/></g>`);

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/wald.js"));
console.log(aus);
