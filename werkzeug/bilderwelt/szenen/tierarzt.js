#!/usr/bin/env node
/* =====================================================================
   BEIM TIERARZT (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (Praxisausstattung Kleintierpraxis: Hersteller von
   Tierarzt-Behandlungstischen und Tierwaagen, Bundestierärztekammer zum
   EU-Heimtierausweis, Ratgeber „Katze zum Tierarzt bringen“):
   - Der BEHANDLUNGSRAUM ist gefliest und leicht zu desinfizieren. In
     der Mitte steht der EDELSTAHL-BEHANDLUNGSTISCH (oft als Hubtisch
     mit Säule), darüber die Untersuchungsleuchte.
   - Kleine Tiere werden auf dem Tisch gewogen oder auf einer flachen
     BODENWAAGE (Plattform mit Anzeige) – Hunde stellen sich darauf.
   - An der Wand: Arbeitszeile mit WASCHBECKEN, DESINFEKTIONSMITTEL-
     Spender, Handschuhboxen, Computer für die Patientenakte; ein
     MEDIKAMENTENSCHRANK mit Glastüren (Tabletten, Salben, Verband).
   - Die Tierärztin trägt Kasack/Kittel und das STETHOSKOP um den Hals;
     auf dem Tisch liegen der IMPFPASS (EU-Heimtierausweis, blau), die
     SPRITZE in der Nierenschale, das Thermometer, Leckerli zur Belohnung.
   - Die Halterin hält den Hund an der LEINE; eine Katze wartet in ihrer
     TRANSPORTBOX auf der WARTEBANK. Praxen verkaufen auch TIERFUTTER.
   BLICK: frontal in den Raum, Augenhöhe 1,5 m; links die Tür, rechts
   die Wartebank. Maßstab: Rückwand 38 Einheiten je Meter, Tisch ≈ 60.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "tierarzt", titel: "Beim Tierarzt", emoji: "🐾", thema: "Gesundheit", kuerzel: "b10e", fassung: 852 });
const rnd = zufall(1862);
const r = B.r;

/* ---------- Kamera ---------------------------------------------------- */
const HY = 64, E = 1.5, D = 5.5, S0 = 38, VX = 160;
const sk = (z) => S0 * D / (D - z);
const P = (X, H, z) => [r(VX + X * sk(z)), r(HY + (E - H) * sk(z))];
const poly = (pts, fill, extra = "") => `<path d="M${pts.map((p) => p[0] + " " + p[1]).join(" L")} Z" fill="${fill}"${extra ? " " + extra : ""}/>`;
const um = (ox, oy, svg) => `<g transform="translate(${r(-ox)} ${r(-oy)})">${svg}</g>`;
const rz = (X0, X1, H0, H1, z, fill, extra = "") => { const s = sk(z); return `<rect x="${r(VX + X0 * s)}" y="${r(HY + (E - H1) * s)}" width="${r((X1 - X0) * s)}" height="${r((H1 - H0) * s)}" fill="${fill}"${extra ? " " + extra : ""}/>`; };
const linie = (a, b, farbe, w, extra = "") => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${farbe}" stroke-width="${r(w)}"${extra}/>`;
function kiste(X0, X1, H0, H1, z0, z1, f) {
  let g = "";
  if (X1 < 0 && f.seite) g += poly([P(X1, H0, z1), P(X1, H0, z0), P(X1, H1, z0), P(X1, H1, z1)], f.seite);
  if (X0 > 0 && f.seite) g += poly([P(X0, H0, z1), P(X0, H0, z0), P(X0, H1, z0), P(X0, H1, z1)], f.seite);
  if (H1 < E && f.deckel) g += poly([P(X0, H1, z1), P(X1, H1, z1), P(X1, H1, z0), P(X0, H1, z0)], f.deckel);
  if (H0 > E && f.boden) g += poly([P(X0, H0, z1), P(X1, H0, z1), P(X1, H0, z0), P(X0, H0, z0)], f.boden);
  if (f.vorn) g += poly([P(X0, H0, z1), P(X1, H0, z1), P(X1, H1, z1), P(X0, H1, z1)], f.vorn);
  return g;
}
/* Figuren schlanker: Koordinaten auf halbe Zentimeter runden (unsichtbar
   bei dieser Größe, spart ein Drittel der Datei – die Seite lädt schneller) */
const h2 = (n) => String(Math.round(parseFloat(n) * 2) / 2);
const schlank = (svg) => svg.replace(/( d=")([^"]*)"/g, (a, b, c) => b + c.replace(/-?\d*\.\d+/g, h2) + '"')
  .replace(/ (cx|cy|x1|y1|x2|y2|x|y)="(-?\d*\.\d+)"/g, (a, b, c) => ` ${b}="${h2(c)}"`)
  .replace(/ (r|rx|ry|width|height)="(\d*\.\d+)"/g, (a, b, c) => ` ${b}="${parseFloat(c) < 1.5 ? c : h2(c)}"`);
const figur = (spec, hoehe) => { const m = B.mensch(spec, hoehe); return { svg: `<g transform="scale(${m.k.toFixed(4)})">${schlank(m.z.svg)}</g>`, k: m.k, z: m.z }; };

/* ---------- Tiere: Hund und Katze (übernommen aus dem Tier-Baukasten des
   Bauernhofs, hier als Kopie, damit diese Szene allein gebaut wird) ---- */
function tierKasten(S, seed = 4711) {
  const rnd = zufall(seed);
  const G = {};
  const lg = (n, stops, x1 = 0, y1 = 0, x2 = 0, y2 = 1) => G["l" + n] || (G["l" + n] = S.lg("t" + n, stops, x1, y1, x2, y2));
  const rg = (n, stops, cx = 0.5, cy = 0.5, rr = 0.5) => G["r" + n] || (G["r" + n] = S.rg("t" + n, stops, cx, cy, rr));
  /* glatte Linie durch Punkte (Catmull-Rom); [x, y, 1] = Ecke */
  const glatt = (pts, zu = true, sp = 1) => {
    const n = pts.length, P = (i) => (zu ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
    let d = `M${r(pts[0][0])} ${r(pts[0][1])}`;
    for (let i = 0; i < (zu ? n : n - 1); i++) {
      const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
      const c1 = p1[2] ? p1 : [p1[0] + (p2[0] - p0[0]) / 6 * sp, p1[1] + (p2[1] - p0[1]) / 6 * sp];
      const c2 = p2[2] ? p2 : [p2[0] - (p3[0] - p1[0]) / 6 * sp, p2[1] - (p3[1] - p1[1]) / 6 * sp];
      d += `C${r(c1[0])} ${r(c1[1])} ${r(c2[0])} ${r(c2[1])} ${r(p2[0])} ${r(p2[1])}`;
    }
    return d + (zu ? "Z" : "");
  };
  const box = (pts) => { const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]); return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]; };
  const VOL = () => lg("vol", [[0, "#fff", 0.2], [0.35, "#fff", 0], [0.7, "#000", 0.1], [1, "#000", 0.34]]);
  let nr = 0;
  /* Körper: Umriss + (geklippt) Zeichnung + Volumen-Verlauf + feiner Rand */
  const koerper = (pts, fill, innen = "", o = {}) => {
    const d = glatt(pts);
    const id = S.id("tk" + nr++);
    S.def(`<clipPath id="${id}"><path d="${d}"/></clipPath>`);
    const [x0, y0, x1, y1] = box(pts);
    let s = `<path d="${d}" fill="${fill}"/>`;
    s += `<g clip-path="url(#${id})">${innen}`;
    if (o.vol !== false) s += `<rect x="${r(x0)}" y="${r(y0)}" width="${r(x1 - x0)}" height="${r(y1 - y0)}" fill="${VOL()}"/>`;
    s += `</g>`;
    if (o.rand !== false) s += `<path d="${d}" fill="none" stroke="${o.rand || "#000"}" stroke-opacity="${o.randA || 0.35}" stroke-width="${o.rw || 1}"/>`;
    return s;
  };
  const form = (pts, fill, extra = "") => `<path d="${glatt(pts)}" fill="${fill}"${extra}/>`;
  const linie = (pts, farbe, w, extra = "") => `<path d="${glatt(pts, false)}" fill="none" stroke="${farbe}" stroke-width="${w}" stroke-linecap="round"${extra}/>`;
  /* Fell/Federn: kurze Striche in einem Feld, alle in einem Pfad */
  const striche = (n, x0, y0, x1, y1, dx, dy, farbe, w, op = 0.5) => {
    let d = "";
    for (let i = 0; i < n; i++) {
      const x = x0 + rnd() * (x1 - x0), y = y0 + rnd() * (y1 - y0), s = 0.6 + rnd() * 0.8;
      d += `M${r(x)} ${r(y)}l${r(dx * s)} ${r(dy * s)}`;
    }
    return `<path d="${d}" stroke="${farbe}" stroke-width="${w}" stroke-opacity="${op}" fill="none" stroke-linecap="round"/>`;
  };
  /* Auge: Lid, Augapfel, Iris/Pupille, Glanzlicht */
  const auge = (x, y, rr, iris = "#2a1a10", o = {}) => {
    let s = `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(rr * 1.25)}" ry="${r(rr * (o.flach || 1))}" fill="${o.lid || "#1a120c"}"/>`;
    s += `<ellipse cx="${r(x + rr * 0.08)}" cy="${r(y)}" rx="${r(rr * 0.95)}" ry="${r(rr * 0.85 * (o.flach || 1))}" fill="${iris}"/>`;
    if (o.pupille) s += `<ellipse cx="${r(x + rr * 0.1)}" cy="${r(y)}" rx="${r(rr * (o.schlitz ? 0.22 : 0.45))}" ry="${r(rr * 0.8 * (o.flach || 1))}" fill="#080605"/>`;
    s += `<circle cx="${r(x + rr * 0.35)}" cy="${r(y - rr * 0.35)}" r="${r(rr * 0.28)}" fill="#fff" opacity=".85"/>`;
    return s;
  };
  /* Zusammensetzen: Schatten (Szeneneinheiten) + skalierte Zeichnung */
  const fertig = (svg, k, dir, laenge, hit) => {
    const L = laenge * k / 2;
    return schatten(0, 0.2, L * 0.95, Math.max(0.8, L * 0.12), 0.32) + `<g transform="scale(${r4(dir * k)} ${r4(k)})">${svg}</g>` + (hit || "");
  };
  const r4 = (n) => Math.round(n * 10000) / 10000;

  /* ---------------- HUF / KLAUE (Paarhufer zweigeteilt) ---------------- */
  const klaue = (x, w, h, farbe = "#2b2522") => `<path d="M${r(x - w / 2)} 0 L${r(x - w / 2 + 1)} ${r(-h)} L${r(x + w / 2 - 1.5)} ${r(-h)} L${r(x + w / 2 + 1)} 0 Z" fill="${farbe}"/><line x1="${r(x + w * 0.15)}" y1="0" x2="${r(x + w * 0.05)}" y2="${r(-h)}" stroke="#000" stroke-width=".6" opacity=".5"/>`;

  /* =================== DIE KUH (Holstein, schwarzbunt) =================== */

  /* =================== DER HUND =================== */
  /* art: "schaefer" (schwarz-loh, Stehohren), "labrador" (gelb), "mischling" (braun-weiß), "dackel"
     pose: "stehen" | "sitzen" | "liegen" */
  function hund(k, dir = 1, o = {}) {
    const art = o.art || "schaefer", pose = o.pose || "stehen";
    const FARBE = { schaefer: ["#b9773a", "#8a5222"], labrador: ["#e2bf82", "#c49a5a"], mischling: ["#7a4c2c", "#55331d"], schwarz: ["#2b2624", "#191514"], dackel: ["#9a5326", "#6e3612"], beagle: ["#c08443", "#8d5a28"] }[art];
    const F = lg("hund_" + art, [[0, FARBE[0]], [1, FARBE[1]]]);
    const dk = art === "dackel" ? 0.55 : art === "beagle" ? 0.74 : 1; /* Beinlänge (Beagle: kurzbeinig, Schulterhöhe ≈ 38 cm) */
    let s = "";
    if (pose === "stehen") {
      const by = (y) => (y > -36 ? y * dk : y - 36 * (dk - 1)); /* Beine kürzen, Körper absenken */
      const B2 = (pts) => pts.map(([x, y, e]) => (e ? [x, by(y), e] : [x, by(y)]));
      s += form(B2([[28, -36], [28, -10], [30, -2], [31, 0, 1], [24, 0, 1], [23, -5], [22, -30]]), FARBE[1]);
      s += form(B2([[-30, -40], [-34, -26], [-40, -14], [-38, -4], [-35, 0, 1], [-42, 0, 1], [-45, -8], [-46, -16], [-46, -38]]), FARBE[1]);
      /* Rute */
      const rute = art === "schaefer" ? [[-46, -56], [-54, -46], [-56, -30], [-52, -20]] : art === "labrador" ? [[-46, -56], [-56, -50], [-62, -44]] : [[-46, -56], [-56, -62], [-60, -72]];
      s += `<path d="${glatt(B2(rute), false)}" stroke="${art === "schaefer" ? "#3a2a1e" : FARBE[1]}" stroke-width="${art === "schaefer" ? 8 : 4.5}" fill="none" stroke-linecap="round"/>`;
      const K = B2([[-46, -58], [-30, -60], [0, -61], [22, -64], [32, -70], [40, -78], [44, -82], [52, -84], [58, -80], [70, -76], [76, -74], [77, -70], [72, -66], [62, -66], [54, -66], [46, -62], [38, -54], [34, -44],
        [33, -34], [33, -10], [35, -3], [37, 0, 1], [27, 0, 1], [26, -5], [25, -12], [24, -28], [20, -34], [4, -35], [-14, -39],
        [-24, -42], [-31, -30], [-37, -18], [-35, -6], [-31, 0, 1], [-41, 0, 1], [-43, -6], [-45, -16], [-49, -30], [-51, -46]]);
      let f = "";
      if (art === "schaefer") {
        f += form(B2([[-60, -66], [30, -70], [36, -58], [20, -44], [-10, -46], [-40, -48], [-58, -46]]), "#24201d");
        f += form([[60, -88], [80, -76], [76, -62], [58, -64]], "#1e1a18");
        f += form([[40, -90], [54, -88], [52, -76], [42, -70]], "#3a2c22", ` opacity=".6"`);
      }
      if (art === "mischling") f += form(B2([[24, -60], [44, -62], [56, -64], [70, -64], [62, -52], [40, -40], [32, -12], [24, -14], [26, -40]]), "#f1ebe1");
      if (art === "beagle") { f += form(B2([[-40, -66], [20, -66], [16, -50], [-30, -48]]), "#2a2420"); f += form(B2([[60, -82], [66, -80], [78, -74], [74, -64], [60, -64]]), "#f1ebe1") + form(B2([[-60, -40], [40, -40], [40, 4], [-60, 4]]), "#f1ebe1"); }
      f += striche(40, -46, -64, 34, -38, 2.4, 0.8, "#000", 0.4, 0.2);
      f += `<path d="M24 -60 q-6 14 2 22 M-30 -58 q-8 14 -2 30" stroke="#000" stroke-opacity=".15" stroke-width="1.6" fill="none"/>`;
      s += koerper(K, F, f, { rw: 0.6 });
      /* Kopfdetails */
      const hy = by(-80) + 80;
      if (art === "schaefer") s += form([[47, -82 + hy], [46.5, -93 + hy], [49, -97 + hy, 1], [54, -89 + hy], [55, -83 + hy]], "#2a2420");
      else s += form([[48, -84], [56, -86], [58, -76], [54, -64], [48, -66], [46, -76]].map(([x, y]) => [x, by(y)]), FARBE[1]);
      s += auge(62, by(-79), 1.6, "#3a2410");
      s += `<ellipse cx="76.5" cy="${r(by(-73.5))}" rx="2" ry="1.6" fill="#111"/>`;
      s += `<path d="M70 ${r(by(-67))} q-6 2 -12 0" stroke="#2a1a10" stroke-width=".6" fill="none"/>`;
      return fertig(s, k, dir, 110);
    }
    if (pose === "sitzen") {
      s += form([[-18, -24], [-26, -26], [-34, -18], [-36, -6], [-30, 0, 1], [-14, 0, 1], [-10, -8]], FARBE[1]);
      const K = [[-24, -20], [-20, -40], [-6, -56], [8, -66], [14, -74], [20, -78], [28, -76], [38, -70], [42, -68], [43, -64], [38, -61], [30, -61], [24, -58], [20, -48],
        [20, -30], [20, -8], [22, -2], [24, 0, 1], [14, 0, 1], [14, -6], [12, -24], [6, -26], [0, -12], [2, -4], [6, 0, 1], [-22, 0, 1], [-30, -6]];
      let f = "";
      if (art === "schaefer") { f += form([[-30, -30], [-6, -58], [6, -60], [0, -36], [-20, -18]], "#24201d"); f += form([[30, -80], [46, -68], [40, -56], [28, -60]], "#1e1a18"); }
      if (art === "mischling") f += form([[16, -60], [26, -62], [40, -60], [34, -50], [24, -40], [22, 2], [12, 2], [14, -40]], "#f1ebe1");
      if (art === "beagle") { f += form([[-30, -34], [-6, -52], [0, -40], [-20, -20]], "#2a2420"); f += form([[22, -56], [40, -64], [44, -58], [26, -48], [22, 2], [12, 2], [14, -40]], "#f1ebe1"); }
      f += striche(30, -28, -66, 24, -4, 1, 2.4, "#000", 0.4, 0.2);
      s += koerper(K, F, f, { rw: 0.6 });
      s += `<path d="M-30 -2 q-10 0 -12 -6" stroke="${art === "schaefer" ? "#3a2a1e" : FARBE[1]}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
      if (art === "schaefer") s += form([[16, -76], [14, -92], [16, -96, 1], [22, -86], [23, -78]], "#2a2420");
      else s += form([[16, -78], [24, -80], [26, -70], [22, -58], [16, -60], [14, -70]], FARBE[1]);
      s += auge(30, -72, 1.5, "#3a2410");
      s += `<ellipse cx="42.4" cy="-66" rx="1.8" ry="1.5" fill="#111"/>`;
      return fertig(s, k, dir, 70);
    }
    /* liegen */
    const K = [[-50, -18], [-36, -26], [-10, -28], [12, -30], [22, -34], [30, -40], [38, -42], [48, -38], [56, -34], [57, -30], [52, -27], [44, -27], [40, -22], [42, -14], [60, -10], [64, -6], [62, -1], [44, 0], [24, 0], [-40, 0], [-52, -6]];
    let f = "";
    if (art === "schaefer") { f += form([[-56, -24], [20, -36], [24, -24], [-50, -14]], "#24201d"); f += form([[40, -46], [60, -32], [52, -24], [40, -28]], "#1e1a18"); }
    if (art === "mischling") f += form([[30, -28], [44, -28], [42, -14], [64, -8], [64, 2], [40, 2], [32, -16]], "#f1ebe1");
    f += striche(30, -48, -28, 30, -4, 2.4, 0.4, "#000", 0.4, 0.2);
    s += koerper(K, F, f, { rw: 0.6 });
    s += `<path d="M-50 -4 q-10 2 -16 -2" stroke="${FARBE[1]}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    if (art === "schaefer") s += form([[28, -40], [26, -54], [28, -58, 1], [34, -48], [35, -40]], "#2a2420");
    else s += form([[28, -42], [36, -44], [38, -34], [34, -24], [28, -26], [26, -34]], FARBE[1]);
    s += auge(44, -36, 1.4, "#3a2410");
    s += `<ellipse cx="56" cy="-31" rx="1.8" ry="1.4" fill="#111"/>`;
    return fertig(s, k, dir, 115);
  }

  /* =================== DIE KATZE (Hauskatze) =================== */
  /* art: "tabby" (braun getigert), "rot", "schwarzweiss", "grau", "schildpatt"; pose: "sitzen" | "liegen" | "stehen" */
  function katze(k, dir = 1, o = {}) {
    const art = o.art || "tabby", pose = o.pose || "sitzen";
    const FB = { tabby: ["#9c8466", "#6e5a44", "#3e3022"], rot: ["#e0a060", "#c27a3a", "#9a5520"], schwarzweiss: ["#2a2626", "#181516", null], grau: ["#9aa0a6", "#767c84", "#4e545c"], schildpatt: ["#3a2c24", "#2a201a", null] }[art];
    const F = lg("katze_" + art, [[0, FB[0]], [1, FB[1]]]);
    const streifen = (pts) => FB[2] ? pts.map((p) => linie(p, FB[2], 1.6, ` opacity=".75"`)).join("") : "";
    let s = "", f = "";
    if (pose === "sitzen") {
      /* Schwanz um die Pfoten gelegt */
      s += `<path d="M-13 -2 Q-6 2 6 0.6 Q12 0 14 -1.6" stroke="${FB[1]}" stroke-width="3.2" fill="none" stroke-linecap="round"/>`;
      const K = [[12, -17], [11, -9], [13, -2], [15, -0.6], [14, 0, 1], [6, 0, 1], [-4, 0], [-11, -1], [-15, -5], [-16, -11], [-14, -18], [-8, -24], [-1, -27], [4, -28.5], [5.5, -33.5], [7, -37.5, 1], [10.5, -33], [14, -32.5], [16, -36, 1], [17.5, -31], [19.5, -27.5], [21, -25], [20, -23.5], [18, -22.5], [14.5, -21]];
      f += streifen([[[-14, -14], [-8, -16]], [[-14, -9], [-6, -10]], [[-13, -4], [-6, -6]], [[-10, -22], [-6, -18]], [[-4, -25], [-2, -20]], [[4, -26], [6, -22]], [[10, -31], [11, -28]], [[13, -31], [13, -28]], [[11, -8], [14, -8]], [[11, -4], [14, -4]]]);
      if (art === "schwarzweiss") f += form([[10, -22], [18, -22], [20, -24], [16, -18], [14, -2], [15, 1], [6, 1], [10, -10]], "#f1eee8");
      if (art === "schildpatt") f += form([[-16, -16], [-6, -26], [0, -18], [-10, -6]], "#c2782e") + form([[8, -30], [14, -34], [16, -26], [10, -24]], "#d79a4a");
      f += striche(30, -15, -27, 15, -2, 0.4, 1.6, "#000", 0.3, 0.2);
      f += `<path d="M9 -15 Q8.4 -8 8.6 -1 M-2 -13 Q-12 -12 -12 -2" stroke="#000" stroke-opacity=".28" stroke-width=".5" fill="none"/>`;
      s += koerper(K, F, f, { rw: 0.35 });
      s += `<path d="M14.6 -32.6 L15.6 -34.8 L16.4 -32" fill="#d79a92" opacity=".7"/>`;
      s += auge(17.2, -28.4, 1.15, art === "schwarzweiss" ? "#9ab53a" : "#b9a12a", { pupille: true, schlitz: true, flach: 0.8 });
      s += `<path d="M20.2 -25.6 l.9 .4 l-.8 .5 Z" fill="#c98a86"/>`;
      s += `<path d="M19 -24.4 l7 -1.4 M19 -24 l7 .2 M19 -23.6 l6.4 1.4" stroke="#fff" stroke-width=".15" opacity=".8"/>`;
      return fertig(s, k, dir, 30);
    }
    if (pose === "liegen") {
      s += `<path d="M-22 -2 Q-30 -2 -30 -8 Q-28 -12 -24 -10" stroke="${FB[1]}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
      const K = [[-22, -2], [-24, -8], [-20, -14], [-8, -16], [4, -15], [10, -16], [12, -20], [13, -24.5, 1], [15.5, -21], [19, -21], [21, -24.5, 1], [22, -19.5], [24, -16], [25, -14], [23, -12.5], [20, -11], [19, -6], [24, -3], [26, -1], [24, 0], [8, 0], [-14, 0]];
      f += streifen([[[-18, -12], [-14, -6]], [[-12, -14], [-9, -7]], [[-6, -15], [-4, -8]], [[0, -15], [1, -9]], [[14, -21], [15, -18]]]);
      if (art === "schwarzweiss") f += form([[16, -12], [24, -14], [22, -10], [26, -1], [10, 1], [16, -6]], "#f1eee8");
      f += striche(26, -22, -16, 20, -1, 1.6, 0.3, "#000", 0.3, 0.2);
      s += koerper(K, F, f, { rw: 0.35 });
      s += auge(21, -16.6, 0.95, "#b9a12a", { pupille: true, schlitz: true, flach: 0.7 });
      s += `<path d="M24.2 -14.2 l.8 .4 l-.7 .4 Z" fill="#c98a86"/>`;
      return fertig(s, k, dir, 52);
    }
    /* stehen / gehen */
    s += `<path d="M10 -14 L11 -1 M-14 -14 L-17 -1" stroke="${FB[1]}" stroke-width="3" stroke-linecap="round"/>`;
    s += `<path d="M-20 -20 Q-30 -22 -32 -34 Q-32 -40 -28 -42" stroke="${FB[1]}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    const K = [[-21, -20], [-10, -23], [6, -22], [14, -24], [18, -29], [19, -33.5, 1], [21.5, -30], [25, -30], [27.5, -33.5, 1], [28, -28], [30, -25], [31, -23.5], [29, -22], [25, -20], [19, -16], [16, -12], [15, -2], [16, 0, 1], [12, 0, 1], [12, -4], [10, -13], [-12, -13], [-14, -2], [-12, 0, 1], [-17, 0, 1], [-18, -4], [-20, -12]];
    f += streifen([[[-16, -21], [-14, -15]], [[-10, -22], [-8, -15]], [[-4, -22], [-3, -15]], [[2, -22], [3, -15]], [[20, -30], [21, -27]]]);
    if (art === "schwarzweiss") f += form([[22, -20], [30, -22], [24, -16], [18, -12], [14, -14]], "#f1eee8");
    f += striche(26, -20, -24, 28, -12, 1.6, 0.3, "#000", 0.3, 0.2);
    s += koerper(K, F, f, { rw: 0.35 });
    s += auge(26.8, -26.4, 1, "#b9a12a", { pupille: true, schlitz: true, flach: 0.75 });
    return fertig(s, k, dir, 52);
  }

  return { glatt, koerper, form, linie, striche, auge, fertig, lg, rg, hund, katze };
}
const T = tierKasten(S, 1862);

/* ---------- Haltungen ------------------------------------------------- */
B.mensch({}, 10);
const MP = globalThis.DMA_MENSCH.POSEN;
MP.b10e_untersuchen = Object.assign({}, MP.stehen, { lende: 8, brust: 8, nacken: 14, kopf: 12,
  schulterL: { vor: 48, seit: 16 }, ellbogenL: 50, unterarmL: -40, handL: 0, fingerL: 0.3,
  schulterR: { vor: 44, seit: 14 }, ellbogenR: 54, unterarmR: -40, handR: 0, fingerR: 0.3 });
MP.b10e_leine = Object.assign({}, MP.stehen, { schulterR: { vor: 30, seit: 12 }, ellbogenR: 50, unterarmR: 10, handR: 0, fingerR: 0.75 });

/* ---------- Grundfarben ---------------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const STAHL = S.lg("stahl", [[0, "#f2f4f5"], [0.35, "#cfd5da"], [0.6, "#aab2b9"], [1, "#e4e8eb"]]);
const STAHL_H = S.lg("stahlh", [[0, "#dfe3e6"], [0.5, "#f6f8f9"], [1, "#b9c0c6"]], 0, 0, 1, 0);
const WEISS = S.lg("weiss", [[0, "#ffffff"], [1, "#e8ecec"]]);
const RW = 2.6;                        /* Seitenwände bei X = ±2,6 m */
const ZW = D * (1 - S0 * RW / 160);    /* bis dahin sind sie im Bild */
S.def(`<pattern id="${S.id("fliese")}" width="${r(0.3 * S0)}" height="${r(0.3 * S0)}" patternUnits="userSpaceOnUse"><rect width="${r(0.3 * S0)}" height="${r(0.3 * S0)}" fill="#eef4f2"/><path d="M0 .2 H${r(0.3 * S0)} M.2 0 V${r(0.3 * S0)}" stroke="#cfdcd8" stroke-width=".4"/></pattern>`);
/* Vieleck am Bildrand abschneiden (x = 0 … 320, y ≥ 0) */
function clip(pts) {
  let out = pts;
  for (const [ach, g, innen] of [[0, 0, (v) => v >= 0], [0, 320, (v) => v <= 320], [1, 0, (v) => v >= 0]]) {
    const a = out; out = [];
    for (let i = 0; i < a.length; i++) {
      const p = a[i], q = a[(i + 1) % a.length], pi = innen(p[ach]), qi = innen(q[ach]);
      if (pi) out.push(p);
      if (pi !== qi) { const t = (g - p[ach]) / (q[ach] - p[ach]); const n = [p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])]; out.push([r(n[0]), r(n[1])]); }
    }
  }
  return out;
}
const polyC = (pts, fill, extra = "") => { const c = clip(pts); return c.length > 2 ? poly(c, fill, extra) : ""; };

/* =====================================================================
   KULISSE — Decke, gefließte Wände (Rückwand und Seiten), heller Boden,
   Hängeschränke, Poster
   ===================================================================== */
{
  const H3 = 2.7;
  let k = `<rect x="0" y="0" width="320" height="200" fill="${S.lg("decke", [[0, "#e6e8e4"], [1, "#f1f3ef"]])}"/>`;
  /* Boden: hellgrauer Kautschuk mit Sprenkeln */
  k += poly([P(-RW, 0, 0), P(RW, 0, 0), P(RW, 0, ZW), [320, 200], [0, 200], P(-RW, 0, ZW)], S.lg("boden", [[0, "#b9c2c4"], [1, "#a3adb0"]]));
  k += `<rect x="0" y="${P(0, 0, ZW)[1]}" width="320" height="${r(200 - P(0, 0, ZW)[1])}" fill="#a3adb0"/>`;
  for (let i = 0; i < 120; i++) { const [x, y] = P(-RW + rnd() * 2 * RW, 0, rnd() * 3.2); if (y < 200 && x > 0 && x < 320) k += `<circle cx="${x}" cy="${y}" r=".3" fill="${rnd() < 0.5 ? "#8d979a" : "#d4dbdd"}"/>`; }
  k += `<rect x="0" y="${P(0, 0, 0)[1]}" width="320" height="${r(200 - P(0, 0, 0)[1])}" fill="${S.lg("bodenlicht", [[0, "#000", 0.1], [0.4, "#000", 0], [1, "#fff", 0.08]])}"/>`;
  /* Seitenwände: unten Fliesen bis 1,6 m, oben Farbe */
  for (const sg of [-1, 1]) {
    const X = sg * RW;
    k += poly([P(X, 0, 0), P(X, H3, 0), P(X, H3, ZW), P(X, 0, ZW)], S.lg("swand" + sg, sg < 0 ? [[0, "#cfe3df"], [1, "#e4efec"]] : [[0, "#e4efec"], [1, "#cfe3df"]], 0, 0, 1, 0));
    k += poly([P(X, 0, 0), P(X, 1.6, 0), P(X, 1.6, ZW), P(X, 0, ZW)], "#eaf2f0");
    for (let H = 0.3; H < 1.6; H += 0.3) k += linie(P(X, H, 0), P(X, H, ZW), "#cfdcd8", 0.35);
    for (let z = 0.3; z < ZW; z += 0.3) k += linie(P(X, 0, z), P(X, 1.6, z), "#cfdcd8", 0.35);
    k += poly([P(X, 0, 0), P(X, 0.1, 0), P(X, 0.1, ZW), P(X, 0, ZW)], "#7d8a8e");
  }
  /* Rückwand */
  const [x0, y0] = P(-RW, H3, 0), [x1, y1] = P(RW, 0, 0);
  k += `<rect x="${x0}" y="${y0}" width="${r(x1 - x0)}" height="${r(y1 - y0)}" fill="${S.lg("wand", [[0, "#dcebe7"], [1, "#cfe3df"]])}"/>`;
  const [, yf] = P(0, 1.6, 0);
  k += `<rect x="${x0}" y="${yf}" width="${r(x1 - x0)}" height="${r(y1 - yf)}" fill="url(#${S.id("fliese")})"/>`;
  k += rz(-RW, RW, 0, 0.1, 0, "#7d8a8e");
  /* Hängeschränke über der Arbeitszeile */
  k += kiste(-1.05, 2.5, 1.55, 2.25, 0, 0.35, { vorn: WEISS, boden: "#d9dedd" });
  for (let i = 0; i < 4; i++) { const a = -1.05 + i * 0.8875; k += rz(a + 0.02, a + 0.8675, 1.57, 2.23, 0.355, "none", 'stroke="#cdd3d3" stroke-width=".4"'); k += rz(a + 0.42, a + 0.45, 1.62, 1.8, 0.36, "#9aa3aa"); }
  /* Poster zwischen Schrank und Hängeschrank: „Impfen schützt“ */
  S.hinten(k);
}

/* =====================================================================
   1 — DIE LAMPE (Untersuchungsleuchte an der Decke über dem Tisch)
   ===================================================================== */
const TI = { X0: -0.62, X1: 0.62, z0: 1.85, z1: 2.45, H: 0.85 };
{
  const zc = 1.55, X = 0.1;
  const kopf = P(X, 2.05, zc), s = sk(zc);
  let k = `<path d="M${P(X + 0.5, 2.7, 0.9)[0]} 0 L${P(X + 0.5, 2.7, 1.2)[0]} ${P(X + 0.5, 2.7, 1.2)[1]} L${r(kopf[0] + 0.2 * s)} ${r(kopf[1] - 0.25 * s)} L${r(kopf[0] + 0.05 * s)} ${r(kopf[1] - 0.12 * s)}" stroke="#c9cfd4" stroke-width="2" fill="none" stroke-linejoin="round"/>`;
  k += `<circle cx="${r(kopf[0] + 0.2 * s)}" cy="${r(kopf[1] - 0.25 * s)}" r="1.6" fill="#9aa3aa"/>`;
  k += `<ellipse cx="${kopf[0]}" cy="${r(kopf[1])}" rx="${r(0.28 * s)}" ry="${r(0.09 * s)}" fill="${STAHL}"/><ellipse cx="${kopf[0]}" cy="${r(kopf[1] + 0.03 * s)}" rx="${r(0.24 * s)}" ry="${r(0.06 * s)}" fill="#fffbe8"/>`;
  for (let i = 0; i < 5; i++) k += `<circle cx="${r(kopf[0] + (i - 2) * 0.09 * s)}" cy="${r(kopf[1] + 0.03 * s)}" r="${r(0.025 * s)}" fill="#ffffff"/>`;
  k += `<path d="M${r(kopf[0] - 0.28 * s)} ${kopf[1]} Q${kopf[0]} ${r(kopf[1] - 0.16 * s)} ${r(kopf[0] + 0.28 * s)} ${kopf[1]}" fill="#e1e5e8"/>`;
  const [ax, ay] = [kopf[0], r(kopf[1] + 0.09 * s)];
  S.teil({ id: "ta_lampe", de: "die Lampe", syl: "LAM-pe", it: "la lampada", itSyl: "LAM-pa-da", en: "lamp", x: ax, y: ay, kunst: um(ax, ay, k),
    tipp: "Die helle Lampe hängt genau über dem Behandlungstisch." });
}

/* =====================================================================
   2 — DER MEDIKAMENTENSCHRANK (Glastüren) — Lupe
   ===================================================================== */
{
  const X0 = -2.5, X1 = -1.35, z1 = 0.4, Hh = 2.05;
  let k = kiste(X0, X1, 0, Hh, 0, z1, { vorn: WEISS, seite: "#d9dedd", deckel: "#f4f6f6" });
  k += rz(X0 + 0.04, X1 - 0.04, 0.85, Hh - 0.05, z1, "#f4f7f7");
  const boeden = [0.9, 1.2, 1.5, 1.78];
  const s = sk(z1);
  const unter = [];
  const U = (o, x0, y0, x1, y1) => unter.push(Object.assign(o, { x: r((x0 + x1) / 2), y: r(y1), kunst: flaeche(-(x1 - x0) / 2, -(y1 - y0), x1 - x0, y1 - y0) }));
  /* Fachböden mit Schachteln, Flaschen, Tuben */
  boeden.forEach((H, i) => {
    k += rz(X0 + 0.05, X1 - 0.05, H - 0.015, H, z1 - 0.01, "#cfd6d6");
    let X = X0 + 0.08;
    const reihe = [
      [["#e9eef0", "#2b7fb8", 0.14, 0.12], ["#fff", "#c62d22", 0.1, 0.16], ["#f6f2e4", "#2f8a3e", 0.16, 0.1], ["#fff", "#e0853a", 0.1, 0.13], ["#e9eef0", "#8e5aa8", 0.12, 0.11]],
      [["bottle", "#7a4a1c", 0.06, 0.17], ["bottle", "#7a4a1c", 0.06, 0.17], ["bottle", "#2b5fa8", 0.06, 0.15], ["#fff", "#2b7fb8", 0.18, 0.12], ["#fff", "#c62d22", 0.12, 0.14], ["bottle", "#3a9a4c", 0.05, 0.13]],
      [["roll", "#f4f1e8", 0.1, 0.1], ["roll", "#f4f1e8", 0.1, 0.1], ["roll", "#6fb8e0", 0.09, 0.09], ["roll", "#e86a8a", 0.09, 0.09], ["#fff", "#2f8a3e", 0.2, 0.12]],
      [["tube", "#ffffff", 0.16, 0.05], ["tube", "#f6c434", 0.15, 0.05], ["#fff", "#2b7fb8", 0.14, 0.12], ["#fff", "#e0853a", 0.18, 0.11]],
    ][i];
    for (const [art, f, w, h] of reihe) {
      const [px, py] = P(X, H + h, z1 - 0.05), pw = w * s * 0.95, ph = h * s * 0.95;
      if (art === "bottle") k += `<rect x="${r(px)}" y="${r(py + ph * 0.25)}" width="${r(pw)}" height="${r(ph * 0.75)}" rx=".6" fill="${f}" opacity=".9"/><rect x="${r(px + pw * 0.25)}" y="${r(py)}" width="${r(pw * 0.5)}" height="${r(ph * 0.28)}" fill="#e9e9e4"/><rect x="${r(px)}" y="${r(py + ph * 0.45)}" width="${r(pw)}" height="${r(ph * 0.25)}" fill="#fff" opacity=".8"/>`;
      else if (art === "roll") k += `<rect x="${r(px)}" y="${r(py)}" width="${r(pw)}" height="${r(ph)}" rx="${r(ph * 0.2)}" fill="${f}"/><ellipse cx="${r(px + pw / 2)}" cy="${r(py + ph / 2)}" rx="${r(pw * 0.2)}" ry="${r(ph * 0.2)}" fill="#000" opacity=".12"/>`;
      else if (art === "tube") k += `<path d="M${r(px)} ${r(py + ph)} h${r(pw * 0.8)} l${r(pw * 0.08)} ${r(-ph * 0.3)} h${r(pw * 0.12)} v${r(-ph * 0.4)} h${r(-pw * 0.12)} l${r(-pw * 0.08)} ${r(-ph * 0.3)} h${r(-pw * 0.8)} Z" fill="${f}" stroke="#ccc" stroke-width=".2"/><rect x="${r(px + pw * 0.2)}" y="${r(py + ph * 0.25)}" width="${r(pw * 0.4)}" height="${r(ph * 0.5)}" fill="#c62d22"/>`;
      else k += `<rect x="${r(px)}" y="${r(py)}" width="${r(pw)}" height="${r(ph)}" fill="${art}" stroke="#c9d0d2" stroke-width=".2"/><rect x="${r(px)}" y="${r(py + ph * 0.2)}" width="${r(pw)}" height="${r(ph * 0.22)}" fill="${f}"/><rect x="${r(px + pw * 0.15)}" y="${r(py + ph * 0.6)}" width="${r(pw * 0.6)}" height=".4" fill="#999"/>`;
      X += w + 0.015;
    }
    if (i === 0) { const [a, b] = P(X0 + 0.08, H + 0.16, z1 - 0.05), [c2] = P(X0 + 0.4, 0, z1 - 0.05); U({ id: "ta_medikament", de: "das Medikament", syl: "me-di-ka-MENT", it: "il medicinale", itSyl: "me-di-ci-NA-le", en: "medicine" }, a, b, c2, P(0, H, z1)[1]); }
    if (i === 1) { const [a, b] = P(X0 + 0.08, H + 0.18, z1 - 0.05), [c2] = P(X0 + 0.3, 0, z1 - 0.05); U({ id: "ta_tropfen", de: "die Tropfen", syl: "TROP-fen", it: "le gocce", itSyl: "GOC-ce", en: "drops", tipp: "Ohrentropfen bekommen Hunde oft, wenn das Ohr juckt." }, a, b, c2, P(0, H, z1)[1]); }
    if (i === 2) { const [a, b] = P(X0 + 0.08, H + 0.12, z1 - 0.05), [c2] = P(X0 + 0.5, 0, z1 - 0.05); U({ id: "ta_verband", de: "der Verband", syl: "ver-BAND", it: "la benda", itSyl: "BEN-da", en: "bandage", tipp: "Für Tiere gibt es bunte Verbände, die von selbst haften." }, a, b, c2, P(0, H, z1)[1]); }
    if (i === 3) { const [a, b] = P(X0 + 0.08, H + 0.08, z1 - 0.05), [c2] = P(X0 + 0.42, 0, z1 - 0.05); U({ id: "ta_salbe", de: "die Salbe", syl: "SAL-be", it: "la pomata", itSyl: "po-MA-ta", en: "ointment" }, a, b, c2, P(0, H, z1)[1]); }
  });
  /* Glastüren mit Spiegelung, Rahmen, Schloss */
  for (let i = 0; i < 2; i++) { const a = X0 + 0.04 + i * (X1 - X0 - 0.08) / 2, b = a + (X1 - X0 - 0.08) / 2; k += rz(a, b, 0.86, Hh - 0.05, z1 + 0.005, "none", 'stroke="#b9c2c4" stroke-width="1"'); const [gx, gy] = P(a + 0.06, Hh - 0.1, z1); k += `<path d="M${gx} ${r(gy + 22)} L${r(gx + 6)} ${gy} L${r(gx + 10)} ${gy} L${r(gx + 4)} ${r(gy + 22)} Z" fill="#fff" opacity=".35"/>`; }
  /* Unterschrank mit Türen */
  k += rz(X0 + 0.04, (X0 + X1) / 2 - 0.01, 0.12, 0.82, z1 + 0.005, "none", 'stroke="#cdd3d3" stroke-width=".4"') + rz((X0 + X1) / 2 + 0.01, X1 - 0.04, 0.12, 0.82, z1 + 0.005, "none", 'stroke="#cdd3d3" stroke-width=".4"');
  { const [lx, ly] = P((X0 + X1) / 2, 1.25, z1); k += `<rect x="${r(lx - 1.2)}" y="${ly}" width="2.4" height="3.6" rx=".5" fill="#9aa3aa"/><circle cx="${lx}" cy="${r(ly + 1.2)}" r=".5" fill="#333"/>`; }
  { const [wx, wy] = P((X0 + X1) / 2, 2.02, z1 + 0.005); k += `<rect x="${r(wx - 8)}" y="${r(wy)}" width="16" height="3.4" rx=".5" fill="#c62d22"/><text x="${wx}" y="${r(wy + 2.5)}" font-size="2.2" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">Medikamente</text>`; }
  const [ax, ay] = P((X0 + X1) / 2, 0, z1);
  const [zx0, zy0] = P(X0, Hh, z1);
  S.teil({ id: "ta_medikamentenschrank", de: "der Medikamentenschrank", syl: "me-di-ka-MEN-ten-schrank", it: "l'armadio dei medicinali", itSyl: "ar-MA-dio dei me-di-ci-NA-li", en: "medicine cabinet", x: ax, y: ay, steht: true, kunst: um(ax, ay, k),
    zoom: { x: r(zx0 - 3), y: r(zy0 - 2), w: 57, h: 38 }, unter,
    tipp: "Der Medikamentenschrank ist immer abgeschlossen." });
}

/* =====================================================================
   3 — ARBEITSZEILE: COMPUTER, WASCHBECKEN, DESINFEKTIONSMITTEL
   ===================================================================== */
const AZ = { X0: -1.2, X1: 2.6, z1: 0.62, H: 0.9 };
{
  const { X0, X1, z1, H } = AZ;
  let k = kiste(X0, X1, 0, H, 0, z1, { vorn: WEISS, deckel: S.lg("platte", [[0, "#9aa8ab"], [1, "#b5c0c2"]]), seite: "#d9dedd" });
  k += rz(X0, X1, H - 0.04, H, z1 + 0.002, "#8a979a");
  for (let i = 0; i < 6; i++) { const a = X0 + 0.03 + i * (X1 - X0 - 0.06) / 6, b = a + (X1 - X0 - 0.06) / 6 - 0.02; k += rz(a, b, 0.12, H - 0.08, z1 + 0.003, "none", 'stroke="#cdd3d3" stroke-width=".45"'); const [gx, gy] = P((a + b) / 2, H - 0.14, z1 + 0.004); k += `<rect x="${r(gx - 3)}" y="${gy}" width="6" height="1" rx=".5" fill="#9aa3aa"/>`; }
  k += rz(X0, X1, 0, 0.1, z1 - 0.04, "#6f7b7e");
  /* Handschuhboxen und Papierrolle auf der Platte */
  for (const [X, f, t] of [[0.25, "#6fb8e0", "S"], [0.42, "#8e5aa8", "M"]]) { const [px, py] = P(X, H, 0.2), s = sk(0.2); k += `<rect x="${r(px - 0.07 * s)}" y="${r(py - 0.1 * s)}" width="${r(0.14 * s)}" height="${r(0.1 * s)}" fill="#fff" stroke="#c9d0d2" stroke-width=".2"/><rect x="${r(px - 0.07 * s)}" y="${r(py - 0.06 * s)}" width="${r(0.14 * s)}" height="${r(0.03 * s)}" fill="${f}"/><path d="M${r(px - 1)} ${r(py - 0.1 * s)} q1 -1.6 2.2 -.2" fill="${f}" opacity=".6"/>`; }
  { const [px, py] = P(2.25, H, 0.25), s = sk(0.25); k += `<rect x="${r(px - 0.12 * s)}" y="${r(py - 0.13 * s)}" width="${r(0.24 * s)}" height="${r(0.13 * s)}" rx="${r(0.06 * s)}" fill="${S.lg("rolle", [[0, "#ffffff"], [1, "#d9dcd8"]])}"/><ellipse cx="${r(px + 0.12 * s)}" cy="${r(py - 0.065 * s)}" rx="${r(0.02 * s)}" ry="${r(0.065 * s)}" fill="#e9e9e4"/>`; }
  const [ax, ay] = P((X0 + X1) / 2, 0, z1);
  S.teil({ id: "ta_schrank", de: "der Schrank", syl: "SCHRANK", it: "il mobile", itSyl: "MO-bi-le", en: "cupboard", x: ax, y: ay, steht: true, kunst: um(ax, ay, k) });
}
{
  /* Computer mit Patientenakte (Monitor auf Fuß), Tastatur */
  const [mx, my] = P(-0.85, AZ.H, 0.25), s = sk(0.25);
  let k = `<rect x="${r(mx - 0.05 * s)}" y="${r(my - 0.02 * s)}" width="${r(0.1 * s)}" height="${r(0.02 * s)}" fill="#2a2e33"/><rect x="${r(mx - 0.012 * s)}" y="${r(my - 0.12 * s)}" width="${r(0.024 * s)}" height="${r(0.1 * s)}" fill="#3a3f45"/>`;
  k += `<rect x="${r(mx - 0.25 * s)}" y="${r(my - 0.42 * s)}" width="${r(0.5 * s)}" height="${r(0.31 * s)}" rx=".6" fill="#1d2125"/><rect x="${r(mx - 0.235 * s)}" y="${r(my - 0.405 * s)}" width="${r(0.47 * s)}" height="${r(0.27 * s)}" fill="#f4f8fa"/>`;
  const x0 = mx - 0.235 * s, y0 = my - 0.405 * s;
  k += `<rect x="${r(x0)}" y="${r(y0)}" width="${r(0.47 * s)}" height="2" fill="#2b7fb8"/><text x="${r(x0 + 1)}" y="${r(y0 + 1.5)}" font-size="1.3" fill="#fff" font-family="Arial">Patientenakte</text>`;
  k += `<text x="${r(x0 + 1)}" y="${r(y0 + 4.4)}" font-size="1.6" fill="#222" font-family="Arial" font-weight="bold">Bruno · Beagle · 6 J.</text>`;
  for (let i = 0; i < 4; i++) k += `<rect x="${r(x0 + 1)}" y="${r(y0 + 5.8 + i * 1.6)}" width="${r(6 + (i % 3) * 2)}" height=".5" fill="#9aa3aa"/>`;
  k += `<path d="M${r(x0 + 11)} ${r(y0 + 10)} l2 -2.4 l2 1.4 l2 -3 l2 1" stroke="#c62d22" stroke-width=".35" fill="none"/>`;
  const [tx, ty] = P(-0.85, AZ.H, 0.45);
  k += `<path d="M${r(tx - 0.2 * sk(0.45))} ${ty} L${r(tx + 0.2 * sk(0.45))} ${ty} L${r(tx + 0.18 * sk(0.35))} ${r(ty - 2.2)} L${r(tx - 0.18 * sk(0.35))} ${r(ty - 2.2)} Z" fill="#2a2e33"/>`;
  S.teil({ oben: true, id: "ta_computer", de: "der Computer", syl: "com-PU-ter", it: "il computer", itSyl: "com-PU-ter", en: "computer", x: mx, y: ty, kunst: um(mx, ty, k),
    tipp: "Im Computer steht die Akte des Tieres: Gewicht, Impfungen, Krankheiten." });
}
{
  /* Waschbecken (Edelstahl) mit Armatur mit Ellbogenhebel */
  const [cx, cy] = P(1.15, AZ.H, 0.32), s = sk(0.32);
  let k = `<ellipse cx="${cx}" cy="${cy}" rx="${r(0.25 * s)}" ry="${r(0.07 * s)}" fill="${STAHL}" stroke="#8a9399" stroke-width=".3"/><ellipse cx="${cx}" cy="${r(cy + 0.4)}" rx="${r(0.2 * s)}" ry="${r(0.05 * s)}" fill="#8f989e"/><circle cx="${cx}" cy="${r(cy + 0.5)}" r=".8" fill="#5d646b"/>`;
  const [ax2, ay2] = P(1.15, AZ.H, 0.05);
  k += `<path d="M${ax2} ${ay2} v${r(-0.25 * s)} q0 ${r(-0.06 * s)} ${r(0.06 * s)} ${r(-0.06 * s)} h${r(0.02 * s)} q${r(0.04 * s)} 0 ${r(0.04 * s)} ${r(0.05 * s)} v${r(0.04 * s)}" stroke="${STAHL_H}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
  k += `<path d="M${r(ax2 - 0.5)} ${r(ay2 - 0.12 * s)} l${r(-0.16 * s)} ${r(-0.03 * s)}" stroke="#c9cfd4" stroke-width="1.2" stroke-linecap="round"/>`;
  S.teil({ oben: true, id: "ta_waschbecken", de: "das Waschbecken", syl: "WASCH-be-cken", it: "il lavandino", itSyl: "la-van-DI-no", en: "sink", x: cx, y: r(cy + 0.08 * s), kunst: um(cx, r(cy + 0.08 * s), k) });
}
{
  /* Desinfektionsmittelspender an der Wand (Ellbogenspender) */
  const [wx, wy] = P(1.65, 1.35, 0), s = sk(0);
  let k = `<rect x="${r(wx - 0.06 * s)}" y="${r(wy - 0.3 * s)}" width="${r(0.12 * s)}" height="${r(0.34 * s)}" rx="1" fill="#f4f6f6" stroke="#b9c2c4" stroke-width=".3"/>`;
  k += `<rect x="${r(wx - 0.045 * s)}" y="${r(wy - 0.26 * s)}" width="${r(0.09 * s)}" height="${r(0.2 * s)}" fill="#e3f1f8"/><rect x="${r(wx - 0.045 * s)}" y="${r(wy - 0.16 * s)}" width="${r(0.09 * s)}" height="${r(0.1 * s)}" fill="#7fc3e6" opacity=".7"/>`;
  k += `<text x="${wx}" y="${r(wy - 0.21 * s)}" font-size="1.1" text-anchor="middle" fill="#2b5fa8" font-family="Arial" font-weight="bold">DESINFEKTION</text>`;
  k += `<path d="M${r(wx - 0.05 * s)} ${r(wy + 0.04 * s)} l${r(-0.08 * s)} ${r(0.06 * s)}" stroke="#9aa3aa" stroke-width="1.4" stroke-linecap="round"/><rect x="${r(wx - 0.8)}" y="${r(wy + 0.04 * s)}" width="1.6" height="1.2" fill="#9aa3aa"/>`;
  S.teil({ id: "ta_desinfektion", de: "das Desinfektionsmittel", syl: "des-in-fek-TI-ons-mit-tel", it: "il disinfettante", itSyl: "di-sin-fet-TAN-te", en: "disinfectant", x: wx, y: r(wy + 0.08 * s), kunst: um(wx, r(wy + 0.08 * s), k),
    tipp: "Vor und nach jedem Tier desinfiziert die Tierärztin ihre Hände." });
}

/* =====================================================================
   4 — DIE TÜR (linke Wand) und 5 — DAS TIERFUTTER (Regal daneben)
   ===================================================================== */
{
  const X = -RW + 0.01, za = 0.15, zb = 1.05, Ht = 2.05;
  let k = polyC([P(X, 0, za - 0.06), P(X, Ht + 0.06, za - 0.06), P(X, Ht + 0.06, zb + 0.06), P(X, 0, zb + 0.06)], "#7d8a8e");
  k += polyC([P(X, 0, za), P(X, Ht, za), P(X, Ht, zb), P(X, 0, zb)], S.lg("tuer", [[0, "#f4f6f6"], [1, "#dfe5e5"]], 0, 0, 1, 0));
  k += polyC([P(X, 1.35, za + 0.25), P(X, 1.85, za + 0.25), P(X, 1.85, zb - 0.25), P(X, 1.35, zb - 0.25)], "#cfe4ea", 'opacity=".9"');
  const [hx, hy] = P(X, 1.02, za + 0.08);
  k += `<rect x="${r(hx)}" y="${r(hy - 0.5)}" width="2.4" height="1" rx=".5" fill="#9aa3aa"/>`;
  const [px, py] = P(X, 1.6, (za + zb) / 2);
  k += `<text x="${px}" y="${r(py)}" font-size="1.8" text-anchor="middle" fill="#2b5fa8" font-family="Arial" font-weight="bold">Behandlung 1</text>`;
  const [ax, ay] = P(X, 0, zb);
  S.teil({ id: "ta_tuer", de: "die Tür", syl: "TÜR", it: "la porta", itSyl: "POR-ta", en: "door", x: ax, y: ay, kunst: um(ax, ay, k) });
}
{
  /* Regal an der linken Wand mit Futtersäcken und Dosen */
  const X = -RW, za = 1.25, zb = ZW - 0.02;
  let k = "";
  for (const H of [0.05, 0.6]) k += polyC([P(X, H, za), P(X + 0.35, H, za), P(X + 0.35, H, zb), P(X, H, zb)], "#c9cfd4") + polyC([P(X + 0.35, H - 0.03, za), P(X + 0.35, H, za), P(X + 0.35, H, zb), P(X + 0.35, H - 0.03, zb)], "#9aa3aa");
  /* Säcke unten, Dosen oben – sichtbar ist die zur Raummitte zeigende Seite */
  const sack = (z0, z1, H0, H1, f) => polyC([P(X + 0.32, H0, z0), P(X + 0.32, H1 - 0.04, z0), P(X + 0.32, H1, (z0 + z1) / 2), P(X + 0.32, H1 - 0.04, z1), P(X + 0.32, H0, z1)], f) + polyC([P(X + 0.32, (H0 + H1) / 2 - 0.06, z0 + 0.04), P(X + 0.32, (H0 + H1) / 2 + 0.06, z0 + 0.04), P(X + 0.32, (H0 + H1) / 2 + 0.06, z1 - 0.04), P(X + 0.32, (H0 + H1) / 2 - 0.06, z1 - 0.04)], "#fff", 'opacity=".85"');
  k += sack(za + 0.03, za + 0.33, 0.05, 0.55, S.lg("sack1", [[0, "#2f8a3e"], [1, "#22702f"]])) + sack(za + 0.35, za + 0.65, 0.05, 0.52, S.lg("sack2", [[0, "#c62d22"], [1, "#9a2218"]]));
  for (let i = 0; i < 4; i++) { const z0 = za + 0.04 + i * 0.12; k += polyC([P(X + 0.3, 0.6, z0), P(X + 0.3, 0.72, z0), P(X + 0.3, 0.72, z0 + 0.09), P(X + 0.3, 0.6, z0 + 0.09)], i % 2 ? "#e0853a" : "#2b7fb8"); }
  const [ax, ay] = P(X + 0.35, 0, za + 0.5);
  S.teil({ id: "ta_futter", de: "das Tierfutter", syl: "TIER-fut-ter", it: "il mangime", itSyl: "man-GI-me", en: "pet food", x: ax, y: ay, kunst: um(ax, ay, k),
    tipp: "Manche Tiere brauchen spezielles Diätfutter – das gibt es beim Tierarzt." });
}

/* =====================================================================
   6 — DIE WARTEBANK (rechte Wand), 7 — TRANSPORTBOX, 8 — KATZE
   ===================================================================== */
const WB = { X0: 2.12, X1: 2.58, z0: 0.3, z1: 1.62, Hs: 0.45 };
{
  const { X0, X1, z0, z1, Hs } = WB;
  let k = polyC([P(X0 - 0.05, 0, z1 + 0.05), P(X1, 0, z1 + 0.05), P(X1, 0, z0), P(X0 - 0.05, 0, z0)], "#000", 'opacity=".15" filter="url(#bw_weich)"');
  for (const z of [z0 + 0.06, z1 - 0.06]) k += linie(P(X0 + 0.05, 0, z), P(X0 + 0.05, Hs - 0.03, z), "#5d646b", 0.04 * sk(z));
  k += polyC([P(X0, Hs, z0), P(X1, Hs, z0), P(X1, Hs, z1), P(X0, Hs, z1)], S.lg("sitz", [[0, "#5b9aa8"], [1, "#4a8896"]]));
  k += polyC([P(X0, Hs, z0), P(X0, Hs, z1), P(X0, Hs - 0.05, z1), P(X0, Hs - 0.05, z0)], "#3d7380");
  k += polyC([P(X0, Hs - 0.05, z1), P(X1, Hs - 0.05, z1), P(X1, Hs, z1), P(X0, Hs, z1)], "#3d7380");
  /* Rückenpolster an der Wand */
  k += polyC([P(X1 - 0.02, Hs + 0.1, z0), P(X1 - 0.02, Hs + 0.45, z0), P(X1 - 0.02, Hs + 0.45, z1), P(X1 - 0.02, Hs + 0.1, z1)], S.lg("polster", [[0, "#6aa9b6"], [1, "#4a8896"]]));
  for (let z = z0 + 0.44; z < z1; z += 0.44) k += linie(P(X1 - 0.02, Hs + 0.1, z), P(X1 - 0.02, Hs + 0.45, z), "#3d7380", 0.5);
  const [ax, ay] = P(X0, 0, z1);
  S.teil({ id: "ta_wartebank_ta", de: "die Wartebank", syl: "WAR-te-bank", it: "la panchina d'attesa", itSyl: "pan-CHI-na d'at-TE-sa", en: "waiting bench", x: ax, y: ay, steht: true, kunst: um(ax, ay, k) });
}
const BX = { X0: 2.18, X1: 2.52, z0: 0.62, z1: 1.12, H0: WB.Hs, H1: WB.Hs + 0.3 };
{
  const { X0, X1, z0, z1, H0, H1 } = BX;
  let k = "";
  /* Unterschale grau, Oberschale blau, Gittertür vorn (offen nach links) */
  k += kiste(X0, X1, H0, H0 + 0.14, z0, z1, { vorn: "#8a959b", seite: "#77838a" });
  k += kiste(X0, X1, H0 + 0.14, H1, z0, z1, { vorn: "#2b6fb3", seite: S.lg("boxseite", [[0, "#3b82c8"], [1, "#2a68a8"]]), deckel: "#4a8fd2" });
  for (let i = 0; i < 4; i++) { const z = z0 + 0.1 + i * 0.08; k += poly([P(X0, H0 + 0.17, z), P(X0, H0 + 0.25, z), P(X0, H0 + 0.25, z + 0.05), P(X0, H0 + 0.17, z + 0.05)], "#1d3f66"); }
  { const [g0, g1] = [P((X0 + X1) / 2 - 0.05, H1, (z0 + z1) / 2), P((X0 + X1) / 2 + 0.05, H1, (z0 + z1) / 2)]; k += `<path d="M${g0[0]} ${g0[1]} q${r((g1[0] - g0[0]) / 2)} -3 ${r(g1[0] - g0[0])} 0" stroke="#1d3f66" stroke-width="1.2" fill="none"/>`; }
  /* dunkle Öffnung vorn, Tür aufgeklappt */
  k += poly([P(X0 + 0.04, H0 + 0.03, z1 + 0.001), P(X1 - 0.04, H0 + 0.03, z1 + 0.001), P(X1 - 0.04, H1 - 0.04, z1 + 0.001), P(X0 + 0.04, H1 - 0.04, z1 + 0.001)], "#1b1a1a");
  const tuer = [P(X0 + 0.03, H0 + 0.03, z1), P(X0 - 0.12, H0 + 0.03, z1 + 0.22), P(X0 - 0.12, H1 - 0.04, z1 + 0.22), P(X0 + 0.03, H1 - 0.04, z1)];
  k += poly(tuer, "none", 'stroke="#c9cfd4" stroke-width=".9"');
  for (let i = 1; i < 6; i++) { const t = i / 6; const a = [tuer[0][0] + (tuer[1][0] - tuer[0][0]) * t, tuer[0][1] + (tuer[1][1] - tuer[0][1]) * t], b = [tuer[3][0] + (tuer[2][0] - tuer[3][0]) * t, tuer[3][1] + (tuer[2][1] - tuer[3][1]) * t]; k += linie([r(a[0]), r(a[1])], [r(b[0]), r(b[1])], "#c9cfd4", 0.5); }
  const [ax, ay] = P((X0 + X1) / 2, H0, z1);
  S.teil({ id: "ta_transportbox", de: "die Transportbox", syl: "TRANS-port-box", it: "il trasportino", itSyl: "tra-spor-TI-no", en: "carrier", x: ax, y: ay, kunst: um(ax, ay, k),
    tipp: "In der Transportbox fährt die Katze sicher zum Tierarzt." });
}
{
  /* Die Katze sitzt vor ihrer Box auf der Bank und schaut in den Raum */
  const z = 1.32, X = 2.33, s = sk(z);
  const [fx, fy] = P(X, WB.Hs, z);
  const k = T.katze(0.3 * s / 37, -1, { art: "grau", pose: "sitzen" });
  S.teil({ id: "ta_katze_ta", de: "die Katze", syl: "KAT-ze", it: "il gatto", itSyl: "GAT-to", en: "cat", x: fx, y: fy, kunst: k,
    tipp: "Die Katze wartet. Sie ist als Nächste dran." });
}

/* =====================================================================
   9 — DIE TIERÄRZTIN (hinter dem Tisch) und 10 — DAS STETHOSKOP
   ===================================================================== */
const TA = { X: -0.32, z: 1.45 };
{
  const { X, z } = TA;
  const m = figur({ id: "b10e_tae", geschlecht: "w", pose: "b10e_untersuchen", blick: 14, frisur: "zopf", haarfarbe: "blond", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "tshirt", farbe: "#3f8f8a" }, unterteil: { stueck: "hose", farbe: "#3f8f8a" }, schuhe: { stueck: "turnschuh", farbe: "#f2f2f0" } } }, 1.68 * sk(z));
  const [fx, fy] = P(X, 0, z);
  S.teil({ id: "ta_tieraerztin", de: "die Tierärztin", syl: "TIER-ärz-tin", it: "la veterinaria", itSyl: "ve-te-ri-NA-ria", en: "vet", x: fx, y: fy, kunst: m.svg,
    tipp: "Die Tierärztin sagt: „Bruno ist gesund. Heute bekommt er seine Impfung.“" });
  /* Stethoskop um den Hals: Bügel hinter dem Nacken, beide Enden hängen vorn */
  const Pn = m.z.punkte, k = m.k;
  const hals = [fx + Pn.hals[0] * k, fy + Pn.hals[1] * k], brust = [fx + Pn.brust[0] * k, fy + Pn.brust[1] * k];
  const ax = r(hals[0]), ay = r(hals[1]);
  const dy = brust[1] - hals[1];
  let st = `<path d="M${r(-3.4)} ${r(-0.4)} Q0 ${r(-2.2)} 3.4 -.4" stroke="#2f3a44" stroke-width=".9" fill="none"/>`;
  st += `<path d="M-3.4 -.4 Q-3.8 ${r(dy * 0.6)} -1.6 ${r(dy * 1.15)}" stroke="#2f3a44" stroke-width=".9" fill="none"/><path d="M3.4 -.4 Q3.6 ${r(dy * 0.5)} 2.4 ${r(dy * 0.9)}" stroke="#c9cfd4" stroke-width=".7" fill="none"/>`;
  st += `<circle cx="-1.6" cy="${r(dy * 1.15 + 1.2)}" r="1.5" fill="${STAHL}" stroke="#7d868c" stroke-width=".3"/><circle cx="2.4" cy="${r(dy * 0.9 + 0.5)}" r=".6" fill="#2f3a44"/>`;
  st += flaeche(-4.6, -2.6, 9.2, dy * 1.15 + 5.4);
  S.teil({ oben: true, id: "ta_stethoskop_ta", de: "das Stethoskop", syl: "Ste-tho-SKOP", it: "lo stetoscopio", itSyl: "ste-to-SCO-pio", en: "stethoscope", x: ax, y: ay, kunst: st,
    tipp: "Mit dem Stethoskop hört die Tierärztin Herz und Lunge ab." });
}

/* =====================================================================
   11 — DER BEHANDLUNGSTISCH (Edelstahl, Hubsäule) — Lupe
   ===================================================================== */
{
  const { X0, X1, z0, z1, H } = TI;
  let k = schatten(...P((X0 + X1) / 2, 0, (z0 + z1) / 2), 0.55 * sk(z1), 2.2, 0.3);
  /* Fußplatte und Hubsäule */
  k += kiste(-0.35, 0.35, 0, 0.05, z0 + 0.1, z1 - 0.1, { vorn: "#6f7b7e", deckel: "#8f9a9d" });
  k += kiste(-0.12, 0.12, 0.05, H - 0.06, (z0 + z1) / 2 - 0.1, (z0 + z1) / 2 + 0.1, { vorn: S.lg("saeule", [[0, "#c9cfd4"], [0.5, "#eef1f3"], [1, "#9aa3aa"]], 0, 0, 1, 0) });
  for (let H2 = 0.25; H2 < H - 0.1; H2 += 0.18) k += rz(-0.12, 0.12, H2, H2 + 0.01, (z0 + z1) / 2 + 0.1, "#8a9399");
  /* Fußpedal */
  { const [px, py] = P(0.25, 0.05, z1 - 0.05); k += `<rect x="${r(px)}" y="${r(py - 1.6)}" width="5" height="1.6" rx=".5" fill="#333"/>`; }
  /* Tischplatte Edelstahl mit Rand */
  k += kiste(X0, X1, H - 0.05, H, z0, z1, { vorn: STAHL_H, deckel: STAHL });
  k += poly([P(X0 + 0.04, H + 0.001, z0 + 0.04), P(X1 - 0.04, H + 0.001, z0 + 0.04), P(X1 - 0.04, H + 0.001, z1 - 0.04), P(X0 + 0.04, H + 0.001, z1 - 0.04)], "none", 'stroke="#fff" stroke-width=".6" opacity=".7"');
  /* rutschfeste Gummimatte, auf der der Hund steht */
  k += poly([P(-0.32, H + 0.004, z0 + 0.08), P(0.42, H + 0.004, z0 + 0.08), P(0.42, H + 0.004, z1 - 0.1), P(-0.32, H + 0.004, z1 - 0.1)], "#3f6f7a");
  const unter = [];
  /* Impfpass (EU-Heimtierausweis, blau, aufgeschlagen) links vorn */
  {
    const c = (X, z) => P(X, H + 0.005, z);
    const pts = [c(-0.58, 2.2), c(-0.36, 2.2), c(-0.36, 2.4), c(-0.58, 2.4)];
    k += poly(pts, "#1f3f8a");
    k += poly([c(-0.565, 2.21), c(-0.475, 2.21), c(-0.475, 2.39), c(-0.565, 2.39)], "#f4f1e6") + poly([c(-0.465, 2.21), c(-0.375, 2.21), c(-0.375, 2.39), c(-0.465, 2.39)], "#f4f1e6");
    const [px, py] = c(-0.52, 2.27);
    k += `<rect x="${r(px - 2)}" y="${r(py - 0.6)}" width="4" height="2.6" fill="#e9e3d0" stroke="#c9b98a" stroke-width=".2"/><rect x="${r(px - 1.2)}" y="${r(py + 0.2)}" width="2.4" height=".9" fill="#7a9ad0"/>`;
    const [qx, qy] = c(-0.42, 2.26);
    for (let i = 0; i < 4; i++) k += `<rect x="${r(qx - 2)}" y="${r(qy + i * 1.1)}" width="${r(3 - (i % 2))}" height=".35" fill="#777"/>`;
    k += `<circle cx="${r(qx + 1)}" cy="${r(qy + 3.2)}" r=".8" fill="none" stroke="#2b5fa8" stroke-width=".3"/>`;
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    const ux = r((Math.min(...xs) + Math.max(...xs)) / 2), uy = r(Math.max(...ys));
    unter.push({ id: "ta_impfpass_ta", de: "der Impfpass", syl: "IMPF-pass", it: "il libretto sanitario", itSyl: "li-BRET-to sa-ni-TA-rio", en: "pet passport", x: ux, y: uy, kunst: flaeche(Math.min(...xs) - ux - 0.6, Math.min(...ys) - uy - 0.6, Math.max(...xs) - Math.min(...xs) + 1.2, Math.max(...ys) - Math.min(...ys) + 1.2),
      tipp: "Im blauen Heimtierausweis stehen alle Impfungen. Man braucht ihn auch für Reisen ins Ausland." });
  }
  /* Nierenschale mit Spritze, rechts vorn */
  {
    const [cx, cy] = P(0.46, H, 2.3), s = sk(2.3);
    k += `<path d="M${r(cx - 0.11 * s)} ${r(cy - 0.6)} Q${r(cx - 0.12 * s)} ${r(cy + 1.4)} ${r(cx - 0.02 * s)} ${r(cy + 1)} Q${cx} ${r(cy + 0.2)} ${r(cx + 0.02 * s)} ${r(cy + 1)} Q${r(cx + 0.12 * s)} ${r(cy + 1.4)} ${r(cx + 0.11 * s)} ${r(cy - 0.6)} Q${cx} ${r(cy - 2)} ${r(cx - 0.11 * s)} ${r(cy - 0.6)} Z" fill="${STAHL}" stroke="#8a9399" stroke-width=".3"/>`;
    k += `<g transform="rotate(-8 ${cx} ${cy})"><rect x="${r(cx - 0.07 * s)}" y="${r(cy - 1.4)}" width="${r(0.1 * s)}" height="1.6" rx=".3" fill="#f4f8fa" stroke="#9aa3aa" stroke-width=".2"/><rect x="${r(cx - 0.06 * s)}" y="${r(cy - 1.2)}" width="${r(0.05 * s)}" height="1.2" fill="#f6d77a" opacity=".8"/><rect x="${r(cx - 0.1 * s)}" y="${r(cy - 1.1)}" width="${r(0.03 * s)}" height="1" fill="#2b5fa8"/><line x1="${r(cx + 0.03 * s)}" y1="${r(cy - 0.6)}" x2="${r(cx + 0.08 * s)}" y2="${r(cy - 0.6)}" stroke="#9aa3aa" stroke-width=".25"/><rect x="${r(cx + 0.03 * s)}" y="${r(cy - 0.9)}" width="${r(0.02 * s)}" height=".6" fill="#f29a2e"/></g>`;
    unter.push({ id: "ta_spritze_ta", de: "die Spritze", syl: "SPRIT-ze", it: "la siringa", itSyl: "si-RIN-ga", en: "syringe", x: cx, y: r(cy + 1.6), kunst: flaeche(-0.13 * s, -3.6, 0.26 * s, 5.2),
      tipp: "Mit der Spritze bekommt der Hund seine Impfung." });
  }
  /* Fieberthermometer und Leckerli */
  {
    const [tx, ty] = P(0.47, H, 2.02), s = sk(2.02);
    k += `<g transform="rotate(12 ${tx} ${ty})"><rect x="${r(tx - 0.07 * s)}" y="${r(ty - 0.5)}" width="${r(0.12 * s)}" height="1" rx=".5" fill="#fff" stroke="#aab" stroke-width=".2"/><rect x="${r(tx - 0.07 * s)}" y="${r(ty - 0.5)}" width="${r(0.05 * s)}" height="1" rx=".5" fill="#2b7fb8"/><rect x="${r(tx - 0.005 * s)}" y="${r(ty - 0.3)}" width="${r(0.04 * s)}" height=".6" fill="#b9d9b0"/><rect x="${r(tx + 0.05 * s)}" y="${r(ty - 0.2)}" width="${r(0.02 * s)}" height=".4" fill="#9aa3aa"/></g>`;
    unter.push({ id: "ta_thermometer", de: "das Fieberthermometer", syl: "FIE-ber-ther-mo-me-ter", it: "il termometro", itSyl: "ter-MO-me-tro", en: "thermometer", x: tx, y: r(ty + 1.8), kunst: flaeche(-0.09 * s, -3.4, 0.18 * s, 4.2) });
    const [lx, ly] = P(-0.5, H, 1.98), sl = sk(1.98);
    for (const [dx, dy] of [[-1.4, 0], [0.4, -0.5], [1.8, 0.2], [-0.4, 0.8]]) k += `<path d="M${r(lx + dx - 1)} ${r(ly + dy)} a.5 .5 0 0 1 0 -1 h2 a.5 .5 0 0 1 0 1 Z" fill="#a8622c"/>`;
    k += `<rect x="${r(lx - 0.05 * sl)}" y="${r(ly - 0.07 * sl)}" width="${r(0.08 * sl)}" height="${r(0.06 * sl)}" rx=".4" fill="#f6c434" opacity=".9"/><text x="${r(lx - 0.01 * sl)}" y="${r(ly - 0.03 * sl)}" font-size="1.1" text-anchor="middle" fill="#7a4a1c" font-family="Arial" font-weight="bold">Leckerli</text>`;
    unter.push({ id: "ta_leckerli", de: "das Leckerli", syl: "LE-cker-li", it: "il premietto", itSyl: "pre-MIET-to", en: "dog treat", x: lx, y: r(ly + 1.8), kunst: flaeche(-3.4, -0.08 * sl - 1, 6.8, 0.08 * sl + 2.8),
      tipp: "Zur Belohnung gibt es ein Leckerli." });
  }
  const [ax, ay] = P((X0 + X1) / 2, 0, z1);
  S.teil({ id: "ta_behandlungstisch", de: "der Behandlungstisch", syl: "Be-HAND-lungs-tisch", it: "il tavolo da visita", itSyl: "TA-vo-lo da VI-si-ta", en: "examination table", x: ax, y: ay, steht: true, kunst: um(ax, ay, k),
    zoom: { x: 96, y: 84, w: 132, h: 88 }, unter,
    tipp: "Der Tisch ist aus Edelstahl: Man kann ihn gut sauber machen. Er fährt elektrisch hoch und runter." });
}

/* =====================================================================
   12 — DER HUND (Beagle, steht auf dem Tisch)
   ===================================================================== */
const HU = { X: 0.02, z: 2.15 };
let hundHals;
{
  const { X, z } = HU, s = sk(z), kk = 0.8 * s / 125;
  const [fx, fy] = P(X, TI.H + 0.005, z);
  S.teil({ id: "ta_hund_ta", de: "der Hund", syl: "HUND", it: "il cane", itSyl: "CA-ne", en: "dog", x: fx, y: fy, kunst: T.hund(kk, 1, { art: "beagle", pose: "stehen" }) + `<path d="M${r(34 * kk)} ${r(-56.6 * kk)} q${r(4 * kk)} ${r(8 * kk)} ${r(10 * kk)} ${r(10 * kk)}" stroke="#c62d22" stroke-width="${r(3 * kk)}" fill="none"/>`,
    tipp: "Der Beagle heißt Bruno. Er steht ganz brav auf dem Tisch." });
  hundHals = [fx + 40 * kk, fy - 52.6 * kk];
}

/* =====================================================================
   13 — DIE HALTERIN (rechts vorn, hält die Leine), 14 — DIE LEINE
   ===================================================================== */
{
  const z = 2.55, X = 1.05;
  const m = figur({ id: "b10e_halt", geschlecht: "w", pose: "b10e_leine", blick: -40, frisur: "lang", haarfarbe: "schwarz", haut: "mittel", laecheln: true,
    kleidung: { oberteil: { stueck: "pullover", farbe: "#e9dcc4" }, jacke: { stueck: "jacke", farbe: "#8a4a3a" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "stiefel", farbe: "braun" } } }, 1.65 * sk(z));
  const [fx, fy] = P(X, 0, z);
  S.teil({ id: "ta_halterin", de: "die Halterin", syl: "HAL-te-rin", it: "la padrona", itSyl: "pa-DRO-na", en: "owner", x: fx, y: fy, kunst: schatten(0, 0, 10, 1.4, 0.25) + m.svg,
    tipp: "Die Halterin fragt: „Muss Bruno eine Spritze bekommen?“" });
  /* Leine: vom Halsband des Hundes durchhängend bis zur Hand */
  const hand = [m.z.handL, m.z.handR].sort((a, b) => a.y - b.y)[0];
  const hx = fx + hand.x * m.k, hy = fy + hand.y * m.k;
  const [ax, ay] = [r(hundHals[0]), r(hundHals[1])];
  const mx = (ax + hx) / 2, my = Math.max(ay, hy) + 7;
  const bogen = `M0 0 Q${r(mx - ax)} ${r(my - ay)} ${r(hx - ax)} ${r(hy - ay)}`;
  let k = `<path d="${bogen}" stroke="rgba(255,255,255,0.001)" stroke-width="3.2" fill="none" stroke-linecap="round"/>`;
  k += `<path d="${bogen}" stroke="#c62d22" stroke-width="1" fill="none" stroke-linecap="round"/><path d="${bogen}" stroke="#f08070" stroke-width=".3" fill="none" transform="translate(0 -.25)"/>`;
  k += `<circle cx="0" cy="0" r=".7" fill="#c9cfd4"/><path d="M${r(hx - ax - 1.4)} ${r(hy - ay)} q1.4 -2.4 2.8 0" stroke="#7a1a12" stroke-width=".8" fill="none"/>`;
  S.teil({ id: "ta_leine", de: "die Leine", syl: "LEI-ne", it: "il guinzaglio", itSyl: "guin-ZA-glio", en: "lead", x: ax, y: ay, kunst: k });
}

/* =====================================================================
   15 — DIE WAAGE (Bodenwaage mit Anzeige, vorn links)
   ===================================================================== */
{
  const X0 = -1.5, X1 = -0.7, z0 = 2.45, z1 = 2.95;
  let k = schatten(...P((X0 + X1) / 2, 0, (z0 + z1) / 2), 0.45 * sk(z1), 1.6, 0.25);
  k += kiste(X0, X1, 0, 0.06, z0, z1, { vorn: "#5d646b", deckel: S.lg("waage", [[0, "#3a3f45"], [1, "#2a2e33"]]), seite: "#4a5056" });
  k += poly([P(X0 + 0.04, 0.061, z0 + 0.04), P(X1 - 0.04, 0.061, z0 + 0.04), P(X1 - 0.04, 0.061, z1 - 0.04), P(X0 + 0.04, 0.061, z1 - 0.04)], "none", 'stroke="#6f7b7e" stroke-width=".5"');
  /* Säule mit Anzeige */
  k += linie(P(X1 - 0.08, 0.06, z0 + 0.05), P(X1 - 0.08, 0.95, z0 + 0.05), "#9aa3aa", 0.035 * sk(z0));
  const [dx, dy] = P(X1 - 0.08, 0.95, z0 + 0.05), s = sk(z0);
  k += `<rect x="${r(dx - 0.13 * s)}" y="${r(dy - 0.1 * s)}" width="${r(0.26 * s)}" height="${r(0.14 * s)}" rx="1" fill="#2f3a44"/><rect x="${r(dx - 0.11 * s)}" y="${r(dy - 0.08 * s)}" width="${r(0.22 * s)}" height="${r(0.07 * s)}" fill="#a9d6a0"/><text x="${r(dx + 0.09 * s)}" y="${r(dy - 0.025 * s)}" font-size="3" text-anchor="end" fill="#1f3a1a" font-family="monospace">12,4 kg</text>`;
  k += `<circle cx="${r(dx - 0.06 * s)}" cy="${r(dy + 0.02 * s)}" r=".8" fill="#c62d22"/><circle cx="${r(dx)}" cy="${r(dy + 0.02 * s)}" r=".8" fill="#3a9a4c"/>`;
  const [ax, ay] = P((X0 + X1) / 2, 0, z1);
  S.teil({ id: "ta_waage", de: "die Waage", syl: "WAA-ge", it: "la bilancia", itSyl: "bi-LAN-cia", en: "scales", x: ax, y: ay, steht: true, kunst: um(ax, ay, k),
    tipp: "Auf der Waage sieht man: Bruno wiegt 12,4 Kilo." });
}

/* =====================================================================
   16 — DER NAPF (Wassernapf aus Edelstahl, vorn auf dem Boden)
   ===================================================================== */
{
  const [cx, cy] = P(-0.25, 0, 2.95), s = sk(2.95), R = 0.11 * s;
  let k = schatten(0, 0.3, R * 1.3, 1.2, 0.3);
  k += `<path d="M${r(-R * 1.15)} ${r(-R * 0.55)} L${r(-R * 0.85)} 0 Q0 ${r(R * 0.18)} ${r(R * 0.85)} 0 L${r(R * 1.15)} ${r(-R * 0.55)} Z" fill="${STAHL_H}"/>`;
  k += `<ellipse cx="0" cy="${r(-R * 0.55)}" rx="${r(R * 1.15)}" ry="${r(R * 0.3)}" fill="${STAHL}" stroke="#8a9399" stroke-width=".3"/>`;
  k += `<ellipse cx="0" cy="${r(-R * 0.5)}" rx="${r(R * 0.85)}" ry="${r(R * 0.21)}" fill="${S.lg("wasser", [[0, "#a9d4e6"], [1, "#6fa8c4"]])}"/><ellipse cx="${r(-R * 0.3)}" cy="${r(-R * 0.55)}" rx="${r(R * 0.3)}" ry="${r(R * 0.06)}" fill="#fff" opacity=".6"/>`;
  S.teil({ id: "ta_napf", de: "der Napf", syl: "NAPF", it: "la ciotola", itSyl: "CIO-to-la", en: "bowl", x: cx, y: cy, kunst: k,
    tipp: "Im Napf ist frisches Wasser für die Tiere." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/tierarzt.js"));
console.log(aus);
