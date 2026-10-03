#!/usr/bin/env node
/* =====================================================================
   DER FAHRRADLADEN (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (Ladenbau im Fachhandel, Händlerseiten mit Werkstatt im
   Verkaufsraum, Magazinartikel zu Montageständern und Wandhaltern) —
   so sieht ein Fahrradladen in Deutschland heute aus:
   - Der Verkaufsraum: Fahrräder stehen in REIHEN auf dem Boden
     (Citybike, Trekkingrad, E-Bike, Lastenrad, Kinderrad), weitere
     hängen oben an einer Schiene an der Wand (Rennrad, Mountainbike).
     An jedem Rad hängt ein Preisschild am Lenker.
   - Eine ZUBEHÖRWAND (Lamellenwand mit Haken): Mäntel hängen als Ringe,
     Schläuche in Schachteln nach Größe, Ketten und Schlösser im
     Blister, Packtaschen, Trinkflaschen.
   - Ein HELMREGAL mit Fahrradhelmen.
   - Die WERKSTATT ist oft mitten im Laden zu sehen: ein Rad hängt im
     MONTAGESTÄNDER (Klemme am Sattelrohr), daneben die Standpumpe.
   - Die THEKE mit Kasse, Kartenterminal und Klingeln zum Mitnehmen.
   - Weiß gestrichene Backsteinwand, Holzdielen, Pendelleuchten.
   Maßstab (eine Augenhöhe, Fluchtpunkt 160/−8):
   Rückwand ≈ 34 Einheiten je Meter, hintere Radreihe ≈ 39, vorne ≈ 50.
   Mechanikerin 1,68 m, Kunde 1,80 m, Theke 0,95 m, Rad 28 Zoll.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "fahrradladen", titel: "Der Fahrradladen", emoji: "🚲", thema: "Einkaufen", kuerzel: "b07b", fassung: 852 });
const rnd = zufall(2807);
const r = B.r;

const VP = { x: 160, y: -8 };
const M = (y) => 0.25 * (y - VP.y);
const fx = (X, y) => VP.x + X * M(y);
const WAND_UNTEN = 128;

/* ---------- Grundfarben und Stoffe ---------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const STAHL = S.lg("stahl", [[0, "#eef1f3"], [0.45, "#c9cfd4"], [0.55, "#b2b9bf"], [1, "#e1e5e8"]], 0, 0, 1, 0);
const HOLZ = S.lg("holz", [[0, "#b98a57"], [1, "#94683c"]]);
const HOLZ_V = S.lg("holzv", [[0, "#a7774a"], [0.5, "#bf905d"], [1, "#9a6c40"]], 0, 0, 1, 0);

/* =====================================================================
   DAS FAHRRAD — ein Zeichner für alle Räder (Seitenansicht, vorne links).
   Maße in Metern, Ursprung = Boden in der Mitte zwischen den Rädern.
   ===================================================================== */
const TYPEN = {
  city: { R: 0.35, wb: 1.12, bb: [0.1, -0.29], sitz: [0.3, -0.82], sattel: [0.34, -0.96], kopfO: [-0.37, -0.88], kopfU: [-0.33, -0.7], vorbau: [-0.4, -1.02], griff: [-0.2, -1.03], tief: true, reifen: 0.045, schutz: true, traeger: true, licht: true, kettenschutz: true, staender: true },
  trekking: { R: 0.35, wb: 1.1, bb: [0.12, -0.29], sitz: [0.3, -0.84], sattel: [0.34, -0.97], kopfO: [-0.37, -0.86], kopfU: [-0.34, -0.7], vorbau: [-0.4, -1.0], griff: [-0.3, -1.01], reifen: 0.045, schutz: true, traeger: true, licht: true, staender: true },
  ebike: { R: 0.35, wb: 1.14, bb: [0.1, -0.3], sitz: [0.3, -0.82], sattel: [0.34, -0.96], kopfO: [-0.38, -0.9], kopfU: [-0.34, -0.7], vorbau: [-0.42, -1.04], griff: [-0.24, -1.04], tief: true, reifen: 0.055, schutz: true, traeger: true, licht: true, akku: true, staender: true },
  kinder: { R: 0.25, wb: 0.8, bb: [0.07, -0.22], sitz: [0.2, -0.56], sattel: [0.23, -0.66], kopfO: [-0.27, -0.62], kopfU: [-0.24, -0.5], vorbau: [-0.29, -0.76], griff: [-0.15, -0.77], tief: true, reifen: 0.05, schutz: true, staender: true },
  renn: { R: 0.34, wb: 0.99, bb: [0.08, -0.27], sitz: [0.26, -0.82], sattel: [0.3, -0.92], kopfO: [-0.36, -0.86], kopfU: [-0.33, -0.72], vorbau: [-0.43, -0.9], griff: [-0.38, -0.9], renn: true, reifen: 0.026 },
  mtb: { R: 0.37, wb: 1.16, bb: [0.12, -0.33], sitz: [0.3, -0.8], sattel: [0.36, -0.98], kopfO: [-0.39, -0.9], kopfU: [-0.35, -0.74], vorbau: [-0.43, -0.99], griff: [-0.34, -1.0], reifen: 0.065, federgabel: true },
};
function rad(o) {
  const T = Object.assign({}, TYPEN[o.typ], o.extra || {}), s = o.s, f = o.farbe || "#2f5f95", d = o.dir || 1;
  const P = (p) => `${r(p[0] * s * d)} ${r(p[1] * s)}`;
  const L = (a, b, w, c, extra = "") => `<line x1="${r(a[0] * s * d)}" y1="${r(a[1] * s)}" x2="${r(b[0] * s * d)}" y2="${r(b[1] * s)}" stroke="${c}" stroke-width="${r(w * s * 10) / 10}" stroke-linecap="round"${extra}/>`;
  const RA = [T.wb / 2, -T.R], FA = [-T.wb / 2, -T.R];
  let g = "";
  /* Räder */
  const raeder = (A) => {
    let w = `<circle cx="${r(A[0] * s * d)}" cy="${r(A[1] * s)}" r="${r((T.R - T.reifen / 2) * s)}" fill="none" stroke="#1c1d20" stroke-width="${r(T.reifen * s)}"/>`;
    w += `<circle cx="${r(A[0] * s * d)}" cy="${r(A[1] * s)}" r="${r((T.R - T.reifen - 0.012) * s)}" fill="none" stroke="#c6ccd1" stroke-width="${r(0.022 * s)}"/>`;
    const n = 20, rr = (T.R - T.reifen - 0.02);
    let sp = "";
    for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, b = a + (i % 2 ? 0.5 : -0.5); sp += `M${P([A[0] + Math.cos(b) * 0.03, A[1] + Math.sin(b) * 0.03])} L${P([A[0] + Math.cos(a) * rr, A[1] + Math.sin(a) * rr])} `; }
    w += `<path d="${sp}" stroke="#aab2b8" stroke-width="${r(Math.max(0.15, 0.004 * s))}" fill="none"/>`;
    w += `<circle cx="${r(A[0] * s * d)}" cy="${r(A[1] * s)}" r="${r(0.035 * s)}" fill="#8d969c"/>`;
    return w;
  };
  g += raeder(RA) + (T.ohneFront ? "" : raeder(FA));
  /* Schutzbleche */
  if (T.schutz) for (const A of (T.ohneFront ? [RA] : [RA, FA])) {
    const rr = T.R + 0.02, a0 = A === RA ? Math.PI * 1.02 : Math.PI * 1.08, a1 = A === RA ? Math.PI * 1.98 : Math.PI * 1.9;
    g += `<path d="M${P([A[0] + Math.cos(a0) * rr, A[1] + Math.sin(a0) * rr])} A${r(rr * s)} ${r(rr * s)} 0 0 ${d > 0 ? 1 : 0} ${P([A[0] + Math.cos(a1) * rr, A[1] + Math.sin(a1) * rr])}" stroke="${o.schutzFarbe || "#2b2d31"}" stroke-width="${r(0.03 * s)}" fill="none"/>`;
  }
  /* Kette, Kettenblatt, Ritzel */
  const KB = T.bb, kr = 0.1 * (T.R / 0.35), rz = 0.04;
  g += `<path d="M${P([KB[0], KB[1] - kr])} L${P([RA[0], RA[1] - rz])} M${P([KB[0], KB[1] + kr])} L${P([RA[0], RA[1] + rz])}" stroke="#5b6066" stroke-width="${r(0.012 * s)}"/>`;
  if (T.kettenschutz) g += `<path d="M${P([KB[0] - 0.02, KB[1] - kr - 0.03])} L${P([RA[0] - 0.05, RA[1] - 0.06])} L${P([RA[0] - 0.05, RA[1] + 0.03])} L${P([KB[0] - 0.02, KB[1] + 0.04])} Z" fill="#2b2d31"/>`;
  /* Rahmen */
  const fw = 0.04;
  g += L(KB, RA, 0.026, f) + L(T.sitz, RA, 0.022, f);
  g += L(KB, T.sitz, fw, f);
  if (T.tief) {
    g += `<path d="M${P(T.kopfU)} Q${P([T.kopfU[0] + 0.12, KB[1] + 0.03])} ${P([KB[0] - 0.02, KB[1] - 0.01])}" stroke="${f}" stroke-width="${r(0.05 * s)}" fill="none" stroke-linecap="round"/>`;
  } else {
    g += L(T.kopfU, KB, fw + 0.005, f) + L(T.kopfO, [T.sitz[0] - 0.02, T.sitz[1] + 0.04], fw - 0.005, f);
  }
  g += L(T.kopfO, T.kopfU, 0.05, f);
  /* Glanzlinie auf dem Unterrohr */
  g += L([T.kopfU[0] + 0.02, T.kopfU[1] - 0.02], [KB[0] - 0.08, KB[1] - 0.05], 0.008, "#ffffff", ' opacity=".35"');
  if (T.akku) {
    g += `<path d="M${P([T.kopfU[0] + 0.07, T.kopfU[1] + 0.02])} L${P([KB[0] - 0.09, KB[1] - 0.05])} L${P([KB[0] - 0.12, KB[1] - 0.12])} L${P([T.kopfU[0] + 0.03, T.kopfU[1] - 0.05])} Z" fill="#1e2023"/>`;
    g += `<circle cx="${r((KB[0] + 0.01) * s * d)}" cy="${r(KB[1] * s)}" r="${r(0.075 * s)}" fill="#2a2d31"/><text x="${r(((T.kopfU[0] + KB[0]) / 2 - 0.03) * s * d)}" y="${r(((T.kopfU[1] + KB[1]) / 2 - 0.02) * s)}" font-size="${r(0.045 * s)}" fill="#7cc576" font-family="Arial" font-weight="bold" text-anchor="middle" transform="rotate(${d > 0 ? 34 : -34} ${r(((T.kopfU[0] + KB[0]) / 2 - 0.03) * s * d)} ${r(((T.kopfU[1] + KB[1]) / 2 - 0.02) * s)})">e</text>`;
  }
  /* Gabel */
  if (T.ohneFront) {
    /* Lastenrad: keine Gabel hier */
  } else if (T.federgabel) {
    g += L(T.kopfU, [FA[0] + 0.06, FA[1] - 0.28], 0.05, "#2a2d31") + L([FA[0] + 0.06, FA[1] - 0.28], FA, 0.032, "#c6ccd1");
  } else {
    g += `<path d="M${P(T.kopfU)} L${P([FA[0] + 0.03, FA[1] - 0.12])} Q${P([FA[0] + 0.01, FA[1] - 0.03])} ${P(FA)}" stroke="${f}" stroke-width="${r(0.028 * s)}" fill="none" stroke-linecap="round"/>`;
  }
  /* Kurbel, Kettenblatt, Pedal */
  g += `<circle cx="${r(KB[0] * s * d)}" cy="${r(KB[1] * s)}" r="${r(kr * s)}" fill="none" stroke="#8d969c" stroke-width="${r(0.018 * s)}"/>`;
  const PD = [KB[0] - 0.08, KB[1] + 0.15];
  g += L(KB, PD, 0.022, "#3a3d41") + `<rect x="${r((PD[0] * d - 0.05) * s)}" y="${r((PD[1] - 0.012) * s)}" width="${r(0.1 * s)}" height="${r(0.025 * s)}" rx="${r(0.008 * s)}" fill="#1c1d20"/>`;
  /* Gepäckträger */
  if (T.traeger) {
    const t0 = [T.sitz[0] + 0.02, T.sitz[1] + 0.05], t1 = [RA[0] + 0.12, T.sitz[1] + 0.05];
    g += L(t0, t1, 0.018, "#2b2d31") + L([RA[0] + 0.1, t1[1]], RA, 0.012, "#2b2d31") + L([RA[0] - 0.12, t1[1]], RA, 0.012, "#2b2d31");
    if (T.licht) g += `<rect x="${r((t1[0] * d - (d > 0 ? 0 : 0.04)) * s)}" y="${r((t1[1] - 0.005) * s)}" width="${r(0.04 * s)}" height="${r(0.035 * s)}" rx="${r(0.006 * s)}" fill="#d0281f"/>`;
  }
  /* Sattelstütze und Sattel */
  g += L(T.sitz, [T.sattel[0] - 0.02, T.sattel[1] + 0.02], 0.022, "#c6ccd1");
  g += `<path d="M${P([T.sattel[0] - 0.13, T.sattel[1] - 0.005])} Q${P([T.sattel[0], T.sattel[1] - 0.04])} ${P([T.sattel[0] + 0.1, T.sattel[1] - 0.03])} Q${P([T.sattel[0] + 0.12, T.sattel[1] + 0.02])} ${P([T.sattel[0] + 0.06, T.sattel[1] + 0.025])} L${P([T.sattel[0] - 0.12, T.sattel[1] + 0.015])} Z" fill="${o.sattelFarbe || "#2a2420"}"/>`;
  /* Vorbau und Lenker */
  g += L(T.kopfO, T.vorbau, 0.028, "#3a3d41");
  if (T.renn) {
    g += `<path d="M${P(T.vorbau)} L${P([T.griff[0] - 0.08, T.griff[1]])} Q${P([T.griff[0] - 0.16, T.griff[1] + 0.02])} ${P([T.griff[0] - 0.14, T.griff[1] + 0.1])} Q${P([T.griff[0] - 0.12, T.griff[1] + 0.16])} ${P([T.griff[0] - 0.03, T.griff[1] + 0.16])}" stroke="#1c1d20" stroke-width="${r(0.026 * s)}" fill="none" stroke-linecap="round"/>`;
  } else {
    g += `<path d="M${P(T.vorbau)} Q${P([T.vorbau[0] + 0.1, T.vorbau[1] - 0.02])} ${P(T.griff)}" stroke="#3a3d41" stroke-width="${r(0.024 * s)}" fill="none" stroke-linecap="round"/>`;
    g += L([T.griff[0] - 0.02, T.griff[1]], [T.griff[0] + 0.08, T.griff[1] + 0.01], 0.034, "#1c1d20");
    g += L([T.griff[0] - 0.08, T.griff[1] - 0.005], [T.griff[0] - 0.02, T.griff[1] + 0.03], 0.012, "#8d969c");
  }
  /* Klingel am Lenker, Licht vorne an der Gabelkrone */
  if (!T.renn && T.R > 0.3) g += `<circle cx="${r((T.vorbau[0] + 0.08) * s * d)}" cy="${r((T.vorbau[1] - 0.02) * s)}" r="${r(0.022 * s)}" fill="${STAHL}"/>`;
  if (T.licht) g += `<path d="M${P([T.kopfU[0] - 0.02, T.kopfU[1] + 0.02])} L${P([T.kopfU[0] - 0.09, T.kopfU[1]])} L${P([T.kopfU[0] - 0.09, T.kopfU[1] + 0.06])} L${P([T.kopfU[0] - 0.02, T.kopfU[1] + 0.05])} Z" fill="#2a2d31"/><ellipse cx="${r((T.kopfU[0] - 0.09) * s * d)}" cy="${r((T.kopfU[1] + 0.03) * s)}" rx="${r(0.008 * s)}" ry="${r(0.028 * s)}" fill="#fff6c8"/>`;
  if (T.akku) g += `<rect x="${r((T.vorbau[0] + 0.03) * s * d - 0.02 * s)}" y="${r((T.vorbau[1] - 0.06) * s)}" width="${r(0.05 * s)}" height="${r(0.035 * s)}" rx="${r(0.006 * s)}" fill="#1c1d20"/>`;
  /* Seitenständer */
  if (T.staender) g += L([KB[0] + 0.06, KB[1] + 0.02], [KB[0] + 0.2, -0.004], 0.016, "#3a3d41");
  return g;
}
/* Preisschild am Lenker */
function preisschild(o, preis) {
  const T = TYPEN[o.typ], s = o.s, d = o.dir || 1;
  const x = (T.griff[0] + 0.02) * s * d, y = T.griff[1] * s;
  return `<line x1="${r(x)}" y1="${r(y)}" x2="${r(x)}" y2="${r(y + 0.08 * s)}" stroke="#666" stroke-width=".2"/><rect x="${r(x - 0.07 * s)}" y="${r(y + 0.08 * s)}" width="${r(0.14 * s)}" height="${r(0.08 * s)}" rx=".3" fill="#fffdf4" stroke="#c9b48a" stroke-width=".2"/><text x="${r(x)}" y="${r(y + 0.135 * s)}" font-size="${r(0.045 * s)}" text-anchor="middle" fill="#c62f25" font-family="Arial" font-weight="bold">${preis}</text>`;
}

/* =====================================================================
   KULISSE — weiß gestrichene Backsteinwand, Dielenboden, Leuchten
   ===================================================================== */
{
  S.def(`<pattern id="${S.id("ziegel")}" width="8" height="4.4" patternUnits="userSpaceOnUse"><rect width="8" height="4.4" fill="#f1efe9"/><rect x=".2" y=".2" width="7.6" height="1.8" rx=".3" fill="#f6f4ef"/><rect x="-3.8" y="2.4" width="7.6" height="1.8" rx=".3" fill="#f4f2ec"/><rect x="4.2" y="2.4" width="7.6" height="1.8" rx=".3" fill="#f7f5f0"/><path d="M0 2.2 H8 M0 4.4 H8" stroke="#d9d5cb" stroke-width=".3"/><path d="M0 0 V2.2 M4 2.2 V4.4" stroke="#d9d5cb" stroke-width=".3"/></pattern>`);
  let k = `<rect x="0" y="0" width="320" height="${WAND_UNTEN}" fill="url(#${S.id("ziegel")})"/>`;
  /* rechts: Wandfläche in Petrol hinter Theke und Werkstatt */
  k += `<rect x="220" y="0" width="100" height="${WAND_UNTEN}" fill="${S.lg("petrol", [[0, "#2f6266"], [1, "#24504f"]])}"/>`;
  k += `<rect x="0" y="0" width="320" height="${WAND_UNTEN}" fill="${S.rg("wandlicht", [[0, "#fff8e8", 0.35], [1, "#fff8e8", 0]], 0.4, 0.2, 0.8)}"/>`;
  /* Sockelleiste */
  k += `<rect x="0" y="${WAND_UNTEN - 3}" width="320" height="3" fill="#3b3e42"/>`;
  /* Schiene für die hängenden Räder */
  k += `<rect x="4" y="4" width="148" height="2.2" rx="1" fill="#2b2d31"/>`;
  for (const x of [8, 80, 148]) k += `<rect x="${x - 1}" y="0" width="2" height="5" fill="#2b2d31"/>`;
  /* Fachböden des Helmregals (Glas auf Wandkonsolen) */
  for (const y of [66, 84, 102]) k += `<rect x="156" y="${y}" width="58" height="1.4" fill="#d9eef2" opacity=".8"/><rect x="156" y="${y + 1.4}" width="58" height=".6" fill="#9fb4ba"/><rect x="160" y="${y + 1.4}" width="1.4" height="3" fill="#7d868d"/><rect x="208.6" y="${y + 1.4}" width="1.4" height="3" fill="#7d868d"/>`;
  /* Werkstatt-Preistafel über dem Montageständer */
  k += `<rect x="232" y="50" width="56" height="28" rx="1" fill="#1d2b2c"/><rect x="233" y="51" width="54" height="26" fill="none" stroke="#d9d3c2" stroke-width=".3"/>`;
  const zt = (y, t, w = "normal", sz = 3) => `<text x="260" y="${y}" font-size="${sz}" text-anchor="middle" fill="#eee8d8" font-family="Arial" font-weight="${w}">${t}</text>`;
  k += zt(57, "WERKSTATT", "bold", 3.6) + zt(63, "Inspektion ……… 59 €") + zt(68, "Schlauch wechseln … 15 €") + zt(73, "Bremse einstellen … 12 €");
  S.hinten(k);
}
{
  /* Dielen (Eiche) in Fluchtperspektive mit versetzten Stößen */
  let f = `<rect x="0" y="${WAND_UNTEN}" width="320" height="${200 - WAND_UNTEN}" fill="${S.lg("boden", [[0, "#a77b4f"], [1, "#c29464"]])}"/>`;
  for (let X = -7; X <= 7.01; X += 0.2) f += `<line x1="${r(fx(X, WAND_UNTEN))}" y1="${WAND_UNTEN}" x2="${r(fx(X, 200))}" y2="200" stroke="#6e4a2a" stroke-width=".22" opacity=".55"/>`;
  for (let i = 0; i < 70; i++) {
    const X = -7 + Math.floor(rnd() * 70) * 0.2, y = WAND_UNTEN + 2 + rnd() * 70;
    f += `<line x1="${r(fx(X, y))}" y1="${r(y)}" x2="${r(fx(X + 0.2, y))}" y2="${r(y)}" stroke="#6e4a2a" stroke-width=".25" opacity=".5"/>`;
  }
  for (const x of [50, 160, 260]) f += `<ellipse cx="${x}" cy="170" rx="34" ry="8" fill="#fff4d8" opacity=".14" filter="url(#bw_weich)"/>`;
  f += `<rect x="0" y="${WAND_UNTEN}" width="320" height="${200 - WAND_UNTEN}" fill="${S.lg("bodenlicht", [[0, "#000", 0.16], [0.4, "#000", 0], [1, "#fff", 0.06]])}"/>`;
  S.hinten(f);
}

/* =====================================================================
   1 — DIE LAMPEN (schwarze Pendelleuchten)
   ===================================================================== */
{
  let k = "";
  for (const x of [-81, 0, 100]) {
    k += `<line x1="${x}" y1="-12" x2="${x}" y2="-2" stroke="#1d1f22" stroke-width=".5"/>`;
    k += `<path d="M${x - 6} 5 Q${x - 5} -2 ${x} -2.4 Q${x + 5} -2 ${x + 6} 5 Z" fill="${S.lg("lampe", [[0, "#3a3d41"], [1, "#1d1f22"]])}"/><ellipse cx="${x}" cy="5" rx="6" ry="1.4" fill="#fff4cf"/>`;
    k += `<path d="M${x - 6} 5.4 L${x - 20} 30 L${x + 20} 30 L${x + 6} 5.4 Z" fill="${S.lg("kegel", [[0, "#fff4cf", 0.3], [1, "#fff4cf", 0]])}" pointer-events="none"/>`;
  }
  k += flaeche(-88, -3, 14, 10) + flaeche(-7, -3, 14, 10) + flaeche(93, -3, 14, 10);
  S.teil({ id: "fr_lampe", de: "die Lampe", syl: "LAM-pe", it: "la lampada", itSyl: "LAM-pa-da", en: "lamp", x: 154, y: 12, kunst: k });
}

/* =====================================================================
   2 — DAS SCHILD des Ladens (über der Theke)
   ===================================================================== */
{
  let k = `<rect x="-40" y="-9" width="80" height="18" rx="2" fill="#f4efe2"/><rect x="-38.6" y="-7.6" width="77.2" height="15.2" rx="1.4" fill="none" stroke="#2f6266" stroke-width=".5"/>`;
  /* kleines Rad-Logo */
  k += `<circle cx="-31" cy="1" r="3.2" fill="none" stroke="#c0392b" stroke-width=".8"/><circle cx="-23" cy="1" r="3.2" fill="none" stroke="#c0392b" stroke-width=".8"/><path d="M-31 1 L-28 -3 L-24 -3 L-23 1 M-28 -3 L-26.6 1 L-31 1" stroke="#c0392b" stroke-width=".6" fill="none"/>`;
  k += `<text x="6" y="1.6" font-size="7" text-anchor="middle" fill="#24504f" font-family="Georgia,serif" font-weight="bold">Rad Krause</text>`;
  k += `<text x="6" y="6" font-size="2.3" text-anchor="middle" fill="#7a5a36" font-family="Arial" letter-spacing=".5">VERKAUF · WERKSTATT · VERLEIH</text>`;
  S.teil({ id: "fr_schild", de: "das Schild", syl: "SCHILD", it: "l'insegna", itSyl: "in-SE-gna", en: "sign", x: 268, y: 32, kunst: k });
}

/* =====================================================================
   3 — DIE HÄNGENDEN RÄDER: Rennrad und Mountainbike an der Schiene
   ===================================================================== */
{
  const o = { typ: "renn", s: 34, farbe: "#c0392b", dir: -1 };
  let k = rad(o);
  /* zwei Haken von der Schiene bis zum Oberrohr */
  for (const x of [-0.25, 0.15]) k += `<path d="M${r(x * 34 * -1)} -48 L${r(x * 34 * -1)} -30.4 q0 1.6 -1.4 1.6" stroke="#2b2d31" stroke-width=".7" fill="none"/>`;
  S.teil({ id: "fr_rennrad", de: "das Rennrad", syl: "RENN-rad", it: "la bici da corsa", itSyl: "BI-ci da COR-sa", en: "road bike", x: 42, y: 54, kunst: k,
    tipp: "Ein Rennrad ist leicht und schnell — mit dünnen Reifen und gebogenem Lenker." });
}
{
  const o = { typ: "mtb", s: 34, farbe: "#2f8f5b", dir: -1 };
  let k = rad(o);
  for (const x of [-0.25, 0.15]) k += `<path d="M${r(x * 34 * -1)} -48 L${r(x * 34 * -1)} -29.6 q0 1.6 -1.4 1.6" stroke="#2b2d31" stroke-width=".7" fill="none"/>`;
  S.teil({ id: "fr_mountainbike", de: "das Mountainbike", syl: "MOUN-tain-bike", it: "la mountain bike", itSyl: "MOUN-tain baik", en: "mountain bike", x: 114, y: 54, kunst: k,
    tipp: "Das Mountainbike hat dicke, grobe Reifen und eine Federgabel — für Waldwege und Berge." });
}

/* =====================================================================
   4 — DAS ZUBEHÖR (Lamellenwand mit Haken) — Lupe
   ===================================================================== */
const ZW = { x0: 4, x1: 150, y0: 58, y1: 116 };
{
  const W = ZW.x1 - ZW.x0, H = ZW.y1 - ZW.y0, cx = (ZW.x0 + ZW.x1) / 2;
  S.def(`<pattern id="${S.id("lamellen")}" width="4" height="4.4" patternUnits="userSpaceOnUse"><rect width="4" height="4.4" fill="#e9e6df"/><rect y="3.4" width="4" height="1" fill="#b9b4a8"/><rect y="3.2" width="4" height=".3" fill="#fff"/></pattern>`);
  let k = `<rect x="${-W / 2 - 1}" y="${-H - 1}" width="${W + 2}" height="${H + 2}" rx=".8" fill="#5a5d62"/>`;
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="${H}" fill="url(#${S.id("lamellen")})"/>`;
  const X = (x) => x - cx, Y = (y) => y - ZW.y1;
  const haken = (x, y) => `<path d="M${r(X(x))} ${r(Y(y))} l0 2.4 q0 .7 .7 .7" stroke="#8d969c" stroke-width=".4" fill="none"/>`;
  const unter = [];
  /* a) Reifen (Mäntel) hängen als Ringe an einem Haken */
  let g = "";
  for (const [x, y, rr] of [[18, 74, 11.6], [24, 76, 11.6], [30, 78, 11.6]]) {
    g += `<circle cx="${r(X(x))}" cy="${r(Y(y))}" r="${rr}" fill="none" stroke="#1c1d20" stroke-width="2"/><circle cx="${r(X(x))}" cy="${r(Y(y))}" r="${rr - 1.2}" fill="none" stroke="#3a3c40" stroke-width=".3"/>`;
  }
  g += `<rect x="${r(X(14))}" y="${r(Y(61))}" width="20" height="1.4" rx=".6" fill="#8d969c"/>`;
  g += `<rect x="${r(X(26))}" y="${r(Y(66))}" width="8" height="5" rx=".4" fill="#f4e04d"/><text x="${r(X(30))}" y="${r(Y(69.4))}" font-size="1.7" text-anchor="middle" fill="#1d1f22" font-family="Arial" font-weight="bold">28"</text>`;
  k += g;
  unter.push({ id: "fr_reifen", de: "der Reifen", syl: "REI-fen", it: "lo pneumatico", itSyl: "pneu-MA-ti-co", en: "bike tyre", x: 24, y: 90, kunst: flaeche(-14, -29, 28, 30),
    tipp: "Den Fahrradreifen nennt man auch „Mantel“. Innen liegt der Schlauch." });
  /* b) Schläuche in Schachteln, nach Größe sortiert */
  g = "";
  for (let row = 0; row < 3; row++) {
    for (let i = 0; i < 4; i++) {
      const x = 46 + i * 7.6, y = 62 + row * 8.4;
      g += `<rect x="${r(X(x))}" y="${r(Y(y))}" width="7" height="7.4" rx=".3" fill="${S.lg("schachtel", [[0, "#2d6db3"], [1, "#1f4f87"]])}"/><rect x="${r(X(x + 0.6))}" y="${r(Y(y + 0.8))}" width="5.8" height="2.4" fill="#fff"/>`;
      g += `<text x="${r(X(x + 3.5))}" y="${r(Y(y + 2.6))}" font-size="1.7" text-anchor="middle" fill="#1d1f22" font-family="Arial" font-weight="bold">${["28\"", "26\"", "20\""][row]}</text>`;
      g += `<circle cx="${r(X(x + 3.5))}" cy="${r(Y(y + 5.3))}" r="1.5" fill="none" stroke="#1c1d20" stroke-width=".55"/>`;
    }
  }
  g += `<rect x="${r(X(45))}" y="${r(Y(87.4))}" width="31" height="1" fill="#8d969c"/>`;
  k += g;
  unter.push({ id: "fr_schlauch", de: "der Schlauch", syl: "SCHLAUCH", it: "la camera d'aria", itSyl: "CA-me-ra d'A-ria", en: "inner tube", x: 60.7, y: 88, kunst: flaeche(-15.4, -27, 30.8, 27),
    tipp: "Platter Reifen? Dann ist meistens der Schlauch kaputt." });
  /* c) Ketten im Blister */
  g = "";
  for (const [x, y] of [[84, 62], [94, 62], [84, 76], [94, 76]]) {
    g += haken(x + 4, y - 2) + `<rect x="${r(X(x))}" y="${r(Y(y))}" width="8.4" height="12" rx=".5" fill="#fafafa" stroke="#c9cfd4" stroke-width=".2"/><rect x="${r(X(x))}" y="${r(Y(y))}" width="8.4" height="2.4" fill="#c0392b"/>`;
    g += `<path d="M${r(X(x + 1.6))} ${r(Y(y + 4))} q2.6 3.4 0 7 M${r(X(x + 6.8))} ${r(Y(y + 4))} q-2.6 3.4 0 7" stroke="#6b7177" stroke-width=".9" stroke-dasharray=".8 .4" fill="none"/>`;
  }
  k += g;
  unter.push({ id: "fr_kette", de: "die Kette", syl: "KET-te", it: "la catena", itSyl: "ca-TE-na", en: "chain", x: 92.2, y: 89, kunst: flaeche(-9, -29, 18, 29.5),
    tipp: "Die Kette bringt die Kraft vom Pedal zum Hinterrad. Sie braucht ab und zu Öl." });
  /* d) Fahrradschlösser: Bügelschloss, Faltschloss, Kabelschloss */
  g = haken(112, 60) + haken(124, 60) + haken(137, 60);
  g += `<path d="M${r(X(109))} ${r(Y(78))} L${r(X(109))} ${r(Y(66))} Q${r(X(109))} ${r(Y(62))} ${r(X(113))} ${r(Y(62))} Q${r(X(117))} ${r(Y(62))} ${r(X(117))} ${r(Y(66))} L${r(X(117))} ${r(Y(78))}" stroke="#2a2d31" stroke-width="1.5" fill="none"/><rect x="${r(X(107.4))}" y="${r(Y(73))}" width="11.2" height="3" rx="1.2" fill="#e5b912"/>`;
  g += `<rect x="${r(X(121))}" y="${r(Y(63))}" width="6.4" height="13" rx="1" fill="#2a2d31"/>`;
  for (let i = 0; i < 4; i++) g += `<rect x="${r(X(121.4))}" y="${r(Y(63.8 + i * 3))}" width="5.6" height="2.2" rx=".4" fill="#c0392b"/>`;
  g += `<circle cx="${r(X(137))}" cy="${r(Y(69))}" r="5" fill="none" stroke="#2a6db3" stroke-width="1.2"/><rect x="${r(X(134.6))}" y="${r(Y(73))}" width="4.8" height="4" rx=".8" fill="#2a2d31"/>`;
  k += g;
  unter.push({ id: "fr_schloss", de: "das Fahrradschloss", syl: "FAHR-rad-schloss", it: "il lucchetto", itSyl: "luc-CHET-to", en: "bike lock", x: 124, y: 80, kunst: flaeche(-17, -21, 37, 21),
    tipp: "Ein gutes Fahrradschloss ist wichtig: Schließe dein Rad immer an etwas Festem an." });
  /* e) Packtaschen unten links */
  g = `<rect x="${r(X(8))}" y="${r(Y(92))}" width="34" height="1.4" fill="#8d969c"/>`;
  for (const [x, c] of [[9, "#c0392b"], [25, "#2a2d31"]]) {
    g += `<path d="M${r(X(x))} ${r(Y(93.4))} L${r(X(x + 14))} ${r(Y(93.4))} L${r(X(x + 14))} ${r(Y(110))} Q${r(X(x + 14))} ${r(Y(112))} ${r(X(x + 12))} ${r(Y(112))} L${r(X(x + 2))} ${r(Y(112))} Q${r(X(x))} ${r(Y(112))} ${r(X(x))} ${r(Y(110))} Z" fill="${c}"/>`;
    g += `<rect x="${r(X(x))}" y="${r(Y(93.4))}" width="14" height="3" fill="#1d1f22" opacity=".5"/><rect x="${r(X(x + 3))}" y="${r(Y(101))}" width="8" height="1.6" fill="#fff" opacity=".8"/><path d="M${r(X(x + 1))} ${r(Y(96))} L${r(X(x + 1))} ${r(Y(110))}" stroke="#fff" stroke-width=".5" opacity=".2"/>`;
  }
  k += g;
  unter.push({ id: "fr_packtasche", de: "die Packtasche", syl: "PACK-ta-sche", it: "la borsa da bici", itSyl: "BOR-sa da BI-ci", en: "pannier", x: 25, y: 112, kunst: flaeche(-16, -19, 32, 19),
    tipp: "Die Packtasche hängt man seitlich an den Gepäckträger — wasserdicht für den Einkauf." });
  /* f) Trinkflaschen auf einem Fachboden */
  g = `<rect x="${r(X(46))}" y="${r(Y(104))}" width="32" height="1.4" fill="#8d969c"/>`;
  for (let i = 0; i < 5; i++) {
    const x = 48 + i * 6, c = ["#2a9fd6", "#e5b912", "#2f8f5b", "#c0392b", "#f4f4f4"][i];
    g += `<path d="M${r(X(x))} ${r(Y(104))} L${r(X(x))} ${r(Y(95))} Q${r(X(x))} ${r(Y(93.6))} ${r(X(x + 1))} ${r(Y(93.4))} L${r(X(x + 3))} ${r(Y(93.4))} Q${r(X(x + 4))} ${r(Y(93.6))} ${r(X(x + 4))} ${r(Y(95))} L${r(X(x + 4))} ${r(Y(104))} Z" fill="${c}"/><rect x="${r(X(x + 1.2))}" y="${r(Y(91.8))}" width="1.6" height="1.8" fill="#2a2d31"/>`;
  }
  k += g;
  unter.push({ id: "fr_trinkflasche", de: "die Trinkflasche", syl: "TRINK-fla-sche", it: "la borraccia", itSyl: "bor-RAC-cia", en: "water bottle", x: 61, y: 105, kunst: flaeche(-15, -14, 30, 14.6) });
  /* g) Klingeln und Lichter im Blister (nur Bild) */
  for (let i = 0; i < 6; i++) {
    const x = 84 + (i % 3) * 9, y = 94 + Math.floor(i / 3) * 10;
    k += haken(x + 3.5, y - 2) + `<rect x="${r(X(x))}" y="${r(Y(y))}" width="7" height="8.4" rx=".4" fill="#fafafa" stroke="#c9cfd4" stroke-width=".2"/>`;
    k += i < 3 ? `<circle cx="${r(X(x + 3.5))}" cy="${r(Y(y + 4.6))}" r="2" fill="${STAHL}"/>` : `<rect x="${r(X(x + 1.6))}" y="${r(Y(y + 3))}" width="3.8" height="3" rx=".8" fill="#2a2d31"/><circle cx="${r(X(x + 3.5))}" cy="${r(Y(y + 4.5))}" r=".9" fill="#fff6c8"/>`;
  }
  S.teil({ id: "fr_zubehoer", de: "das Zubehör", syl: "ZU-be-hör", it: "gli accessori", itSyl: "ac-ces-SO-ri", en: "accessories", x: cx, y: ZW.y1, kunst: k,
    zoom: { x: ZW.x0 - 2, y: ZW.y0 - 3, w: W + 4, h: 62 },
    unter,
    tipp: "An der Zubehörwand hängt alles, was man fürs Rad braucht." });
}

/* =====================================================================
   5 — DER FAHRRADHELM (Helmregal)
   ===================================================================== */
{
  let k = "";
  const farben = [["#c0392b", "#7d1f17"], ["#2a6db3", "#173d70"], ["#f4f4f4", "#9aa3aa"], ["#2f8f5b", "#1d5a38"], ["#e5b912", "#a07f0c"], ["#2a2d31", "#000"], ["#e97ab0", "#a84676"], ["#9aa3aa", "#59616a"], ["#f08a24", "#a8561a"]];
  let n = 0;
  for (const y of [66, 84, 102]) {
    for (let i = 0; i < 3; i++) {
      const x = 166 + i * 19 - 185, f = farben[n++];
      k += `<path d="M${x - 7.4} ${y - 103} Q${x - 7.4} ${y - 113} ${x} ${y - 113.2} Q${x + 7.6} ${y - 113} ${x + 7.8} ${y - 104.6} L${x + 7} ${y - 103} Z" fill="${S.lg("helm" + n, [[0, f[0]], [1, f[1]]])}"/>`;
      for (const t of [-3.4, 0, 3.4]) k += `<path d="M${x + t - 1} ${y - 111.4} q1 -.6 2 0 l-.2 2.6 h-1.6 Z" fill="#1d1f22" opacity=".55"/>`;
      k += `<path d="M${x - 6} ${y - 109} Q${x - 2} ${y - 112.4} ${x + 3} ${y - 111.6}" stroke="#fff" stroke-width=".6" opacity=".4" fill="none"/><path d="M${x - 7.4} ${y - 103.4} L${x + 7} ${y - 103.4}" stroke="#1d1f22" stroke-width=".7"/>`;
      k += `<path d="M${x - 4} ${y - 103} q-1 2 0 3.6 M${x + 4} ${y - 103} q1 2 0 3.6" stroke="#1d1f22" stroke-width=".35" fill="none"/>`;
    }
  }
  S.teil({ id: "fr_helm", de: "der Fahrradhelm", syl: "FAHR-rad-helm", it: "il casco", itSyl: "CA-sco", en: "helmet", x: 185, y: 103, kunst: k,
    tipp: "Ein Helm schützt den Kopf. Er muss gut sitzen — nicht zu locker." });
}

/* =====================================================================
   6 — HINTERE REIHE: E-Bike und Lastenrad (Boden y = 148, 39 je Meter)
   ===================================================================== */
const RH = 148, sH = M(RH);
{
  const o = { typ: "ebike", s: sH, farbe: "#e9eaea", dir: 1 };
  let k = schatten(0, 0, 26, 1.6, .28) + rad(o) + preisschild(o, "2.999 €");
  S.teil({ id: "fr_ebike", de: "das E-Bike", syl: "I-baik", it: "la bici elettrica", itSyl: "BI-ci e-LET-tri-ca", en: "e-bike", x: 48, y: RH, steht: true, kunst: k,
    tipp: "Das E-Bike hat einen Akku und einen Motor — er hilft beim Treten." });
}
{
  /* Lastenrad (Long John): Holzkiste zwischen kleinem Vorderrad und Lenker */
  const s = sH;
  const o = { typ: "trekking", s, farbe: "#1d4f6b", dir: 1, extra: { wb: 1.0, traeger: false, licht: false, ohneFront: true } };
  let k = schatten(0, 0, 44, 1.8, .28);
  /* hinterer Teil wie ein normales Rad, nach rechts versetzt */
  k += `<g transform="translate(${r(0.55 * s)} 0)">${rad(o)}</g>`;
  /* langer Rahmen nach vorn zum kleinen Vorderrad */
  const P = (x, y) => `${r(x * s)} ${r(y * s)}`;
  k += `<path d="M${P(0.2, -0.7)} L${P(-0.15, -0.28)} L${P(-1.35, -0.28)}" stroke="#1d4f6b" stroke-width="${r(0.05 * s)}" fill="none" stroke-linecap="round"/>`;
  k += `<circle cx="${r(-1.35 * s)}" cy="${r(-0.25 * s)}" r="${r(0.23 * s)}" fill="none" stroke="#1c1d20" stroke-width="${r(0.05 * s)}"/><circle cx="${r(-1.35 * s)}" cy="${r(-0.25 * s)}" r="${r(0.17 * s)}" fill="none" stroke="#c6ccd1" stroke-width="${r(0.02 * s)}"/>`;
  k += `<line x1="${r(-1.35 * s)}" y1="${r(-0.25 * s)}" x2="${r(-1.2 * s)}" y2="${r(-0.62 * s)}" stroke="#1d4f6b" stroke-width="${r(0.028 * s)}"/>`;
  /* Holzkiste */
  k += `<path d="M${P(-1.0, -0.33)} L${P(-0.2, -0.33)} L${P(-0.16, -0.78)} L${P(-1.06, -0.78)} Z" fill="${HOLZ_V}"/>`;
  for (const y of [-0.48, -0.63]) k += `<line x1="${r(-1.03 * s)}" y1="${r(y * s)}" x2="${r(-0.18 * s)}" y2="${r(y * s)}" stroke="#7a5230" stroke-width=".3"/>`;
  k += `<rect x="${r(-1.07 * s)}" y="${r(-0.8 * s)}" width="${r(0.92 * s)}" height="${r(0.03 * s)}" fill="#7a5230"/>`;
  k += `<text x="${r(-0.6 * s)}" y="${r(-0.52 * s)}" font-size="${r(0.09 * s)}" text-anchor="middle" fill="#f4efe2" font-family="Georgia,serif" font-weight="bold">Krause</text>`;
  k += preisschild({ typ: "trekking", s, dir: 1 }, "3.490 €").replace(/<line/, `<g transform="translate(${r(0.55 * s)} 0)"><line`) + "</g>";
  S.teil({ id: "fr_lastenrad", de: "das Lastenrad", syl: "LAS-ten-rad", it: "la bici cargo", itSyl: "BI-ci CAR-go", en: "cargo bike", x: 141, y: RH, steht: true, kunst: k,
    tipp: "In die Kiste vom Lastenrad passen Einkäufe — oder zwei Kinder." });
}

/* =====================================================================
   7 — DIE WERKSTATT-ECKE: Montageständer mit Trekkingrad, Standpumpe
   ===================================================================== */
const RW = 135, sW = M(RW);
{
  /* Standpumpe mit Manometer */
  const s = sW;
  let k = schatten(0, 0, 5, .8, .25);
  k += `<path d="M-4 0 L4 0 L3 -1.2 L-3 -1.2 Z" fill="#1d1f22"/><rect x="-1.1" y="-21" width="2.2" height="20" rx=".8" fill="${S.lg("pumpe", [[0, "#e04b3e"], [1, "#9a2119"]], 0, 0, 1, 0)}"/>`;
  k += `<circle cx="0" cy="-6" r="2" fill="#f4f4f4" stroke="#2a2d31" stroke-width=".4"/><path d="M0 -6 L1 -7.2" stroke="#c0392b" stroke-width=".3"/>`;
  k += `<rect x="-.4" y="-26" width=".8" height="5" fill="${STAHL}"/><rect x="-4" y="-27" width="8" height="1.6" rx=".8" fill="#1d1f22"/>`;
  k += `<path d="M1 -3 Q6 -6 5 -15 Q4.6 -18 6 -19" stroke="#1d1f22" stroke-width=".55" fill="none"/>`;
  S.teil({ id: "fr_luftpumpe", de: "die Luftpumpe", syl: "LUFT-pum-pe", it: "la pompa", itSyl: "POM-pa", en: "pump", x: 238, y: RW + 1, steht: true, kunst: k,
    tipp: "Auf der Uhr der Standpumpe sieht man, wie viel Luft im Reifen ist." });
}
{
  const s = sW;
  /* Montageständer: Dreibein, Rohr, Klemme in 1,2 m Höhe */
  let k = schatten(0, 0, 14, 1.4, .28);
  k += `<path d="M0 -2 L-12 0 M0 -2 L12 0 M0 -2 L-4 -.6" stroke="#2a2d31" stroke-width="1.4" stroke-linecap="round"/>`;
  k += `<rect x="-1.1" y="-40" width="2.2" height="38" fill="${STAHL}"/><rect x="-1.4" y="-22" width="2.8" height="2" fill="#2a2d31"/>`;
  k += `<path d="M0 -40 L-5 -44" stroke="#c6ccd1" stroke-width="1.6" stroke-linecap="round"/>`;
  k += `<rect x="-9" y="-47.4" width="6" height="4.4" rx="1" fill="#c0392b" transform="rotate(-20 -6 -45)"/>`;
  k += `<path d="M-2 -10 Q-1 -6 2 -4" stroke="#2a2d31" stroke-width=".4" fill="none"/>`;
  S.teil({ id: "fr_werkstattstaender", de: "der Montageständer", syl: "Mon-TA-ge-stän-der", it: "il cavalletto da officina", itSyl: "ca-val-LET-to da of-fi-CI-na", en: "repair stand", x: 268, y: RW, steht: true, kunst: k,
    tipp: "Im Montageständer hängt das Rad fest — so kann man die Pedale drehen und schalten." });
}
{
  /* Trekkingrad in der Klemme: Sattelstütze bei der Klemme, Räder in der Luft */
  const s = sW, o = { typ: "trekking", s, farbe: "#59616a", dir: 1 };
  const T = TYPEN.trekking;
  const klemme = { x: 268 - 6.4, y: RW - 45 };
  const sx = klemme.x - ((T.sitz[0] + T.sattel[0]) / 2 - 0.01) * s, sy = klemme.y - ((T.sitz[1] + T.sattel[1]) / 2 + 0.01) * s;
  S.teil({ id: "fr_trekkingrad", de: "das Trekkingrad", syl: "TREK-king-rad", it: "la bici da trekking", itSyl: "BI-ci da TREK-king", en: "trekking bike", x: sx, y: sy, kunst: rad(o),
    tipp: "Dieses Rad ist zur Inspektion da: Bremsen, Kette, Licht und Schaltung werden geprüft." });
}
{
  /* Klemmbacken über der Sattelstütze (gehören zum Ständer, Bild davor) */
  S.davor(`<rect x="${268 - 9}" y="${RW - 47.4}" width="6" height="4.4" rx="1" fill="#c0392b" transform="rotate(-20 ${268 - 6} ${RW - 45})"/>`);
}

/* =====================================================================
   8 — DIE MECHANIKERIN am Montageständer
   ===================================================================== */
{
  const m = B.mensch({ id: "fr_mech", geschlecht: "w", pose: "halten", blick: -64, frisur: "zopf", haarfarbe: "rot", haut: "hell",
    kleidung: { oberteil: { stueck: "tshirt", farbe: "grau" }, schuerze: { stueck: "schuerze", farbe: "#2f3a40" }, unterteil: { stueck: "jeans", farbe: "schwarz" }, schuhe: { stueck: "turnschuh", farbe: "schwarz" } } }, 61);
  S.teil({ id: "fr_mechanikerin", de: "die Mechanikerin", syl: "Me-CHA-ni-ke-rin", it: "la meccanica", itSyl: "mec-CA-ni-ca", en: "bike mechanic", x: 302, y: RW + 3, kunst: m.svg,
    tipp: "Die Mechanikerin repariert Fahrräder. Man nennt sie auch Zweiradmechanikerin." });
}

/* =====================================================================
   9 — VORDERE REIHE: Kinderfahrrad und das Fahrrad (Lupe)
   ===================================================================== */
const RV = 190, sV = M(RV);
{
  const o = { typ: "kinder", s: sV, farbe: "#2a9fd6", dir: 1, schutzFarbe: "#f4f4f4" };
  let k = schatten(0, 0, 24, 1.8, .3) + rad(o) + preisschild(o, "289 €");
  S.teil({ id: "fr_kinderrad", de: "das Kinderfahrrad", syl: "KIN-der-fahr-rad", it: "la bici per bambini", itSyl: "BI-ci per bam-BI-ni", en: "children's bike", x: 36, y: RV, steht: true, kunst: k,
    tipp: "Ein Kinderfahrrad hat kleine Räder: 16 oder 20 Zoll." });
}
{
  const o = { typ: "city", s: sV, farbe: "#24504f", dir: 1, sattelFarbe: "#6b4423" };
  const T = TYPEN.city, s = sV, X = 116;
  let k = schatten(0, 0, 36, 2, .3) + rad(o) + preisschild(o, "749 €");
  const u = (id, de, syl, it, itSyl, en, px, py, w, h, tipp) => ({ id, de, syl, it, itSyl, en, x: X + px * s, y: RV + py * s, kunst: flaeche(-w / 2, -h / 2, w, h), tipp });
  const unter = [
    u("fr_sattel", "der Sattel", "SAT-tel", "il sellino", "sel-LI-no", "saddle", T.sattel[0], T.sattel[1], 13, 6, "Den Sattel kann man höher und tiefer stellen."),
    u("fr_lenker", "der Lenker", "LEN-ker", "il manubrio", "ma-NU-brio", "handlebar", T.griff[0] - 0.02, T.griff[1] - 0.01, 12, 6, null),
    u("fr_klingel", "die Klingel", "KLIN-gel", "il campanello", "cam-pa-NEL-lo", "bell", T.vorbau[0] + 0.08, T.vorbau[1] - 0.05, 5, 5, "Eine Klingel ist in Deutschland Pflicht."),
    u("fr_licht", "das Fahrradlicht", "FAHR-rad-licht", "il fanale", "fa-NA-le", "bike light", T.kopfU[0] - 0.07, T.kopfU[1] + 0.03, 6, 6, "Vorne weiß, hinten rot — so sieht man dich im Dunkeln."),
    u("fr_gepaecktraeger", "der Gepäckträger", "ge-PÄCK-trä-ger", "il portapacchi", "por-ta-PAC-chi", "rack", T.sitz[0] + 0.22, T.sitz[1] + 0.06, 14, 5, null),
    u("fr_pedal", "das Pedal", "pe-DAL", "il pedale", "pe-DA-le", "pedal", T.bb[0] - 0.08, T.bb[1] + 0.15, 7, 5, null),
    u("fr_speiche", "die Speiche", "SPEI-che", "il raggio", "RAG-gio", "spoke", -T.wb / 2 - 0.15, -T.R - 0.12, 8, 8, "Ein Rad hat meistens 36 Speichen."),
  ];
  S.teil({ id: "fr_fahrrad_fr", de: "das Fahrrad", syl: "FAHR-rad", it: "la bicicletta", itSyl: "bi-ci-CLET-ta", en: "bicycle", x: X, y: RV, steht: true, kunst: k,
    zoom: { x: X - 42, y: RV - 60, w: 84, h: 56 },
    unter,
    tipp: "Ein Stadtrad mit tiefem Einstieg: Man steigt leicht auf, auch im Rock." });
}

/* =====================================================================
   10 — DIE THEKE mit Kasse — rechts vorne
   ===================================================================== */
const TH = { x0: 214, x1: 320, y1: 194 };
{
  const W = TH.x1 - TH.x0, h = 0.95 * M(TH.y1);
  let k = schatten(0, 0, W / 2 + 2, 2, .3);
  k += `<path d="M${-W / 2 - 1} ${r(-h - 4)} L${W / 2 + 1} ${r(-h - 4)} L${W / 2 + 1} ${r(-h)} L${-W / 2 - 1} ${r(-h)} Z" fill="${S.lg("platte", [[0, "#3a3d41"], [1, "#2a2d31"]])}"/>`;
  k += `<rect x="${-W / 2}" y="${r(-h)}" width="${W}" height="${r(h)}" fill="${HOLZ_V}"/>`;
  for (let x = -W / 2 + 4; x < W / 2; x += 4.4) k += `<rect x="${r(x)}" y="${r(-h + 2)}" width=".6" height="${r(h - 6)}" fill="#7a5230" opacity=".5"/>`;
  k += `<rect x="${-W / 2}" y="-4" width="${W}" height="4" fill="#2a2d31"/>`;
  k += `<rect x="${-W / 2}" y="${r(-h)}" width="${W}" height="1.6" fill="#fff" opacity=".18"/>`;
  /* Front: altes Rad-Emblem und Öffnungszeiten */
  k += `<rect x="-26" y="${r(-h + 10)}" width="52" height="20" rx="1.4" fill="#24504f"/><text x="0" y="${r(-h + 20)}" font-size="5" text-anchor="middle" fill="#f4efe2" font-family="Georgia,serif" font-weight="bold">Rad Krause</text>`;
  k += `<text x="0" y="${r(-h + 26)}" font-size="2.4" text-anchor="middle" fill="#e9dcc0" font-family="Arial">Mo–Fr 9–18 · Sa 9–14</text>`;
  /* auf der Theke: Klingel-Schale */
  k += `<ellipse cx="-36" cy="${r(-h - 2.4)}" rx="7" ry="1.6" fill="#59616a"/>`;
  for (let i = 0; i < 5; i++) k += `<ellipse cx="${-40 + i * 2}" cy="${r(-h - 3.4 - (i % 2))}" rx="1.4" ry="1" fill="${["#c0392b", "#2a6db3", "#e5b912", "#c6ccd1", "#2f8f5b"][i]}"/>`;
  S.teil({ id: "fr_theke_fr", de: "die Theke", syl: "THE-ke", it: "il bancone", itSyl: "ban-CO-ne", en: "counter", x: (TH.x0 + TH.x1) / 2, y: TH.y1, steht: true, kunst: k });
}
{
  const h = 0.95 * M(TH.y1), y = TH.y1 - h - 2.4;
  let k = schatten(0, 0, 10, 1, .3);
  k += `<rect x="-8" y="-2.4" width="16" height="2.4" rx=".6" fill="#2b2f33"/><rect x="-1.2" y="-5" width="2.4" height="2.6" fill="#3a3f44"/>`;
  k += `<path d="M-9 -16 L9 -16 L10 -5 L-10 -5 Z" fill="#1d2125"/><path d="M-8 -15 L8 -15 L8.8 -6 L-8.8 -6 Z" fill="${S.lg("kassebild", [[0, "#2c4e6b"], [1, "#1b3247"]])}"/>`;
  k += `<rect x="-7" y="-14" width="6.4" height="3" rx=".4" fill="#2f8f5b"/><rect x=".6" y="-14" width="6.4" height="3" rx=".4" fill="#c0392b"/><rect x="-7" y="-10.4" width="6.4" height="3" rx=".4" fill="#2a6db3"/><text x="4" y="-8" font-size="1.6" text-anchor="middle" fill="#9fe39a" font-family="Arial">24,90 €</text>`;
  k += `<rect x="12" y="-8" width="5" height="8" rx=".8" fill="#2a2e33"/><rect x="12.6" y="-7.2" width="3.8" height="2.4" fill="#9cd3e8"/>`;
  S.teil({ oben: true, id: "fr_kasse", de: "die Kasse", syl: "KAS-se", it: "la cassa", itSyl: "CAS-sa", en: "cash register", x: 296, y: y, steht: true, kunst: k });
}

/* =====================================================================
   11 — DER KUNDE (bringt seinen Helm, steht an der Theke)
   ===================================================================== */
{
  const m = B.mensch({ id: "fr_kunde", geschlecht: "m", pose: "stehen", blick: 58, frisur: "kurz", haarfarbe: "blond", haut: "hell",
    kleidung: { oberteil: { stueck: "pullover", farbe: "#2a6db3" }, jacke: { stueck: "jacke", farbe: "#e5b912" }, unterteil: { stueck: "jeans", farbe: "jeans" }, schuhe: { stueck: "turnschuh", farbe: "weiss" }, zubehoer: { stueck: "rucksack", farbe: "schwarz" } } }, 92);
  S.teil({ id: "fr_kunde_fr", de: "der Kunde", syl: "KUN-de", it: "il cliente", itSyl: "cli-EN-te", en: "customer", x: 201, y: 197, kunst: m.svg,
    tipp: "Er fragt: „Haben Sie einen Schlauch für 28 Zoll?“" });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/fahrradladen.js"));
console.log(aus);
