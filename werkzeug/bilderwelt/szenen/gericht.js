#!/usr/bin/env node
/* =====================================================================
   DAS GERICHT (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (RiStBV Nr. 124 „Äußere Gestaltung der Hauptverhandlung“,
   Beschreibungen der Sitzordnung im Strafprozess) — so sieht ein
   deutscher Schwurgerichts-/Strafsaal aus:
   - An der Stirnseite die ERHÖHTE RICHTERBANK (Podest): in der Mitte die
     Vorsitzende Richterin, links und rechts die Schöffen. Darüber an der
     Wand der BUNDESADLER (oder das Landeswappen).
   - Die STAATSANWALTSCHAFT sitzt traditionell auf der FENSTERSEITE, der
     ANGEKLAGTE mit seiner VERTEIDIGERIN auf der TÜRSEITE (Anklagebank).
   - In der Mitte, mit dem Blick zum Gericht, der ZEUGENTISCH mit Stuhl
     und Mikrofon — der Zeuge sitzt, er steht nicht in einem Kasten.
   - Richterin, Staatsanwalt und Verteidigerin tragen die schwarze ROBE
     mit weißer Krawatte bzw. weißem Binder.
   - Eine hölzerne SCHRANKE trennt den Saal vom Zuschauerraum mit den
     ZUSCHAUERBÄNKEN: Die Verhandlung ist öffentlich; Fotografieren ist
     verboten. Alle stehen auf, wenn das Gericht hereinkommt.
   Maßstab: Kamera 2,8 m hoch hinten im Zuschauerraum, Horizont y = 44;
   Einheiten je Meter = (y − 44) / 2,8. Stirnwand bei y = 98 (≈ 19 je
   Meter, Saalhöhe 4 m), Schranke bei y = 164, erste Zuschauerbank y = 188.
   Blick: genau mittig, Fluchtpunkt (160 | 44), von erhöht — die Würde des
   Saals: dunkles Nussholz, Creme, Grün der Polster.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "gericht", titel: "Das Gericht", emoji: "⚖️", thema: "Behörden", kuerzel: "b08e", fassung: 852 });
const rnd = zufall(1949);
const r = B.r;
const VP = { x: 160, y: 44 };
const SK = (y) => (y - VP.y) / 2.8;
const auf = (x0, y0, y) => VP.x + (x0 - VP.x) * (y - VP.y) / (y0 - VP.y);

/* Menschen: Pfade runden; was ganz hinter einem Tisch/einer Lehne liegt
   (Beine, Füße, Schatten), wird gar nicht erst mitgeschickt. */
function figur(spec, hoehe, verdeckt = null, grob = false) {
  const m = B.mensch(spec, hoehe);
  const schritt = grob || m.k < 0.42 ? 1 : 2;
  let svg = m.svg.replace(/ data-teil="[^"]*"/g, "");
  if (verdeckt != null) {
    const cut = -verdeckt / m.k + 2;     // in Zentimetern der Figur (y nach unten)
    svg = svg.replace(/<(path|ellipse|circle)\b[^>]*\/>/g, (el, tag) => {
      if (/clip-path|<defs/.test(el)) return el;
      let ymin = Infinity;
      if (tag === "path") {
        const d = (el.match(/ d="([^"]*)"/) || [])[1] || "";
        if (/[AaHhVvmlcsqt]/.test(d)) return el;
        const z = (d.match(/-?\d+\.?\d*/g) || []).map(Number);
        for (let i = 1; i < z.length; i += 2) ymin = Math.min(ymin, z[i]);
      } else {
        const g = (a) => +((el.match(new RegExp(` ${a}="(-?[\\d.]+)"`)) || [])[1] || 0);
        ymin = g("cy") - (tag === "circle" ? g("r") : g("ry"));
      }
      return ymin > cut ? "" : el;
    });
  }
  m.svg = svg.replace(/ d="([^"]*)"/g, (q, d) => ` d="${d.replace(/-?\d+\.\d+/g, (n) => String(Math.round(+n * schritt) / schritt))}"`);
  return m;
}
/* weiße Krawatte bzw. Binder auf der Robe */
function krawatte(m) {
  const h = m.z.punkte.hals, b = m.z.punkte.brust; if (!h || !b) return "";
  const k = m.k, x0 = h[0] * k, y0 = h[1] * k, x1 = (h[0] + (b[0] - h[0]) * 0.75) * k, y1 = (h[1] + (b[1] - h[1]) * 0.75) * k;
  return `<path d="M${r(x0 - 1.4 * k * 2)} ${r(y0)} L${r(x0 + 1.4 * k * 2)} ${r(y0)} L${r(x1 + 1.6 * k * 2)} ${r(y1)} L${r(x1)} ${r(y1 + 2.2 * k * 2)} L${r(x1 - 1.6 * k * 2)} ${r(y1)} Z" fill="#fbfbf8"/>`;
}
const T = (x, y, s, txt, f = "#222", extra = "") => `<text x="${r(x)}" y="${r(y)}" font-size="${s}" fill="${f}" font-family="Georgia,'Times New Roman',serif" text-anchor="middle"${extra}>${txt}</text>`;

/* ---------- Farben ---------------------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const NUSS = S.lg("nuss", [[0, "#6b4426"], [0.5, "#5a381e"], [1, "#462a15"]]);
const NUSS_V = S.lg("nussv", [[0, "#4e3019"], [0.5, "#6b4426"], [1, "#4a2d17"]], 0, 0, 1, 0);
const NUSS_H = S.lg("nussh", [[0, "#8a5d36"], [1, "#6b4426"]]);
const PLATTE = S.lg("platte", [[0, "#7a5230"], [1, "#94653c"]]);
const POLSTER = S.lg("polster", [[0, "#3f6b4a"], [1, "#284a33"]]);
const LEDER = S.lg("leder", [[0, "#2c2e33"], [1, "#16171a"]]);
const ROBE = "#141418";

/* =====================================================================
   KULISSE — Kassettendecke, Stirnwand (Nussholz + Creme), Seitenwände,
   Eichenparkett
   ===================================================================== */
const WU = 98, XL = 56, XR = 264, WO = WU - 4 * SK(WU);
const seiteY = (xw, x, y) => y + (x - xw) * (y - VP.y) / (xw - VP.x);   // Wandlinie von der Ecke (xw|y) bis x
{
  let k = `<rect x="0" y="0" width="320" height="${r(WO + 1)}" fill="#efe7d6"/>`;
  /* Kassettendecke: Balken zum Fluchtpunkt und quer */
  for (let i = -6; i <= 6; i++) { const xb = 160 + i * 34.7; k += `<line x1="${r(xb)}" y1="${r(WO)}" x2="${r(VP.x + (xb - VP.x) * (0 - VP.y) / (WO - VP.y))}" y2="0" stroke="#d6c9ac" stroke-width="1"/>`; }
  for (const y of [WO - 3, WO - 8, WO - 15]) k += `<line x1="0" y1="${r(y)}" x2="320" y2="${r(y)}" stroke="#d6c9ac" stroke-width=".9"/>`;
  /* Stirnwand: unten 2,6 m Nussholz-Vertäfelung, darüber Creme */
  const VT = WU - 2.6 * SK(WU);
  k += `<rect x="${XL}" y="${r(WO)}" width="${XR - XL}" height="${r(WU - WO)}" fill="${S.lg("creme", [[0, "#f3ead6"], [1, "#e6d9bd"]])}"/>`;
  k += `<rect x="${XL}" y="${r(VT)}" width="${XR - XL}" height="${r(WU - VT)}" fill="${NUSS}"/>`;
  for (let x = XL + 3; x < XR - 8; x += 13) k += `<rect x="${x}" y="${r(VT + 3)}" width="10" height="${r(WU - VT - 8)}" rx=".4" fill="none" stroke="#3a2210" stroke-width=".5"/><rect x="${x + 0.5}" y="${r(VT + 3.5)}" width="9" height="${r(WU - VT - 9)}" fill="none" stroke="#8a5d36" stroke-width=".25" opacity=".7"/>`;
  k += `<rect x="${XL}" y="${r(VT)}" width="${XR - XL}" height="1.6" fill="#8a5d36"/>`;
  k += `<rect x="${XL}" y="${r(WO)}" width="${XR - XL}" height="${r(WU - WO)}" fill="${S.rg("licht", [[0, "#fff6df", 0.35], [1, "#fff6df", 0]], 0.5, 0.25, 0.6)}"/>`;
  /* Seitenwände (links Fensterseite, rechts Türseite), unten vertäfelt */
  for (const [xw, xe] of [[XL, 0], [XR, 320]]) {
    k += `<path d="M${xe} ${r(seiteY(xw, xe, WO))} L${xw} ${r(WO)} L${xw} ${WU} L${xe} ${r(seiteY(xw, xe, WU))} Z" fill="${S.lg("seite" + xe, [[0, xe ? "#efe4cb" : "#e2d4b5"], [1, xe ? "#e2d4b5" : "#efe4cb"]], 0, 0, 1, 0)}"/>`;
    k += `<path d="M${xe} ${r(seiteY(xw, xe, VT))} L${xw} ${r(VT)} L${xw} ${WU} L${xe} ${r(seiteY(xw, xe, WU))} Z" fill="${NUSS}"/>`;
    k += `<path d="M${xe} ${r(seiteY(xw, xe, VT))} L${xw} ${r(VT)}" stroke="#8a5d36" stroke-width="1.4"/>`;
  }
  /* Fenster in der linken Wand (drei hohe Fenster) */
  for (const [a, b] of [[4, 18], [26, 38], [44, 52]]) {
    const ho = WU - 3.7 * SK(WU), hu = WU - 1.4 * SK(WU);
    const P = (x, yy) => `${x} ${r(seiteY(XL, x, yy))}`;
    k += `<path d="M${P(a, ho)} L${P(b, ho)} L${P(b, hu)} L${P(a, hu)} Z" fill="${S.lg("fenster", [[0, "#d7e9f4"], [1, "#f2f6f2"]])}" stroke="#f2ead6" stroke-width="1.2"/>`;
    k += `<path d="M${(a + b) / 2} ${r(seiteY(XL, (a + b) / 2, ho))} L${(a + b) / 2} ${r(seiteY(XL, (a + b) / 2, hu))}" stroke="#f2ead6" stroke-width=".7"/>`;
  }
  /* Eichenparkett */
  const yl = r(seiteY(XL, 0, WU)), yr = r(seiteY(XR, 320, WU));
  k += `<path d="M0 ${yl} L${XL} ${WU} L${XR} ${WU} L320 ${yr} L320 200 L0 200 Z" fill="${S.lg("parkett", [[0, "#a97a4a"], [1, "#c0905c"]])}"/>`;
  for (let i = -30; i <= 30; i++) { const xb = 160 + i * 6.93; if (xb < XL || xb > XR) continue; k += `<line x1="${r(xb)}" y1="${WU}" x2="${r(auf(xb, WU, 200))}" y2="200" stroke="#7d5530" stroke-width=".3" opacity=".6"/>`; }
  for (let j = 0; j < 10; j++) { const y = WU + 3 + j * 2.2 + j * j * 0.75; k += `<line x1="0" y1="${r(y)}" x2="320" y2="${r(y)}" stroke="#7d5530" stroke-width=".25" opacity=".45"/>`; }
  k += `<path d="M0 ${yl} L${XL} ${WU} L${XR} ${WU} L320 ${yr} L320 200 L0 200 Z" fill="${S.lg("parkettlicht", [[0, "#000", 0.2], [0.5, "#fff", 0.04], [1, "#000", 0.06]])}"/>`;
  S.hinten(k);
}

/* =====================================================================
   1 — DER GERICHTSSAAL (die Stirnwand mit Tür zum Beratungszimmer)
       Als Wort: der Saal selbst — man tippt auf die Wand.
   ===================================================================== */
{
  /* Pilaster und Gesims an der Stirnwand — gehören zum Saal */
  let k = "";
  const VT = WU - 2.6 * SK(WU);
  for (const x of [XL + 2, 96, 224, XR - 2]) k += `<rect x="${x - 2.4}" y="${r(WO + 2)}" width="4.8" height="${r(VT - WO - 2)}" fill="${S.lg("pilaster", [[0, "#efe4cb"], [0.5, "#fbf4e4"], [1, "#e0d1b0"]], 0, 0, 1, 0)}"/><rect x="${x - 3.2}" y="${r(WO + 1)}" width="6.4" height="2" fill="#e9dcc0"/>`;
  k += `<rect x="${XL}" y="${r(WO)}" width="${XR - XL}" height="2.2" fill="#e9dcc0"/>`;
  /* Tür zum Beratungszimmer (links neben der Richterbank) */
  const td = { x: 80, w: 0.95 * SK(WU), h: 2.3 * SK(WU) };
  k += `<rect x="${r(td.x - td.w / 2 - 1)}" y="${r(WU - td.h - 1)}" width="${r(td.w + 2)}" height="${r(td.h + 1)}" fill="#3a2210"/><rect x="${r(td.x - td.w / 2)}" y="${r(WU - td.h)}" width="${r(td.w)}" height="${r(td.h)}" fill="${NUSS_V}"/>`;
  k += `<rect x="${r(td.x - td.w / 2 + 2)}" y="${r(WU - td.h + 3)}" width="${r(td.w - 4)}" height="${r(td.h * 0.4)}" fill="none" stroke="#3a2210" stroke-width=".5"/><rect x="${r(td.x - td.w / 2 + 2)}" y="${r(WU - td.h * 0.5)}" width="${r(td.w - 4)}" height="${r(td.h * 0.4)}" fill="none" stroke="#3a2210" stroke-width=".5"/><circle cx="${r(td.x + td.w / 2 - 2.4)}" cy="${r(WU - td.h * 0.5)}" r=".6" fill="#d4b14a"/>`;
  /* KORREKTUR itSyl: vorher nur „AU-la“ — itSyl muss dieselbe Form wie „it“ haben. */
  S.teil({ id: "ge_saal", de: "der Gerichtssaal", syl: "Ge-RICHTS-saal", it: "l'aula di tribunale", itSyl: "AU-la di tri-bu-NA-le", en: "courtroom", x: 160, y: WU, kunst: `<g transform="translate(-160 ${-WU})">${k}</g>`,
    tipp: "Die Verhandlung ist öffentlich — man darf hineingehen und zuhören." });
}

/* =====================================================================
   2 — DER BUNDESADLER (an der Stirnwand über der Richterbank)
   ===================================================================== */
{
  const s = 0.72;
  let k = "";
  /* Flügel: je sechs Schwungfedern, gefächert */
  for (const sx of [-1, 1]) {
    for (let i = 0; i < 6; i++) {
      const a = (-70 + i * 22) * Math.PI / 180, l = 15 - Math.abs(i - 2) * 1.2;
      const x0 = sx * 5, y0 = -6 + i * 1.6, x1 = x0 + sx * Math.cos(a + Math.PI / 2 * 0) * 0 + sx * Math.sin(Math.PI / 2 - a * 0.4) * l, y1 = y0 + Math.sin(a) * l * 0.7;
      k += `<path d="M${r(x0)} ${r(y0)} Q${r((x0 + x1) / 2 + sx * 1)} ${r((y0 + y1) / 2 - 2.6)} ${r(x1)} ${r(y1)} L${r(x1 - sx * 1.2)} ${r(y1 + 2.4)} Q${r((x0 + x1) / 2)} ${r((y0 + y1) / 2 + 0.4)} ${r(x0)} ${r(y0 + 3)} Z" fill="#141414"/>`;
    }
  }
  /* Körper, Kopf mit Schnabel (rot) und Zunge, Fänge, Stoß */
  k += `<ellipse cx="0" cy="0" rx="6" ry="9.4" fill="#141414"/>`;
  k += `<circle cx="-1" cy="-11.4" r="3.2" fill="#141414"/><path d="M-3.6 -12 L-7.2 -11 L-4 -9.4 Z" fill="#d6a51f"/><path d="M-6.4 -10.2 L-7.6 -8.6" stroke="#c4161c" stroke-width=".7"/><circle cx="-2" cy="-12" r=".5" fill="#d6a51f"/>`;
  for (const sx of [-1, 1]) k += `<path d="M${sx * 3} 7 L${sx * 6} 13 L${sx * 4} 13.4 L${sx * 5.4} 15 M${sx * 6} 13 L${sx * 7.4} 14.8" stroke="#c4161c" stroke-width=".9" fill="none"/>`;
  k += `<path d="M-4.4 8 L-6.4 17 L-2 15 L0 18.6 L2 15 L6.4 17 L4.4 8 Z" fill="#141414"/>`;
  k += `<path d="M-2 -5 Q0 -6 2 -5" stroke="#3a3a3a" stroke-width=".5" fill="none"/>`;
  S.teil({ id: "ge_bundesadler", de: "der Bundesadler", syl: "BUN-des-ad-ler", it: "l'aquila federale", itSyl: "A-qui-la fe-de-RA-le", en: "federal eagle", x: 160, y: 44, kunst: `<g transform="scale(${s})">${k}</g>`,
    tipp: "Der Bundesadler ist das Wappentier der Bundesrepublik Deutschland." });
}
{
  /* DIE UHR an der Stirnwand */
  let k = `<circle r="4.4" fill="#3a2210"/><circle r="3.8" fill="#fbf7ee"/>`;
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; k += `<line x1="${r(Math.sin(a) * 3.3)}" y1="${r(-Math.cos(a) * 3.3)}" x2="${r(Math.sin(a) * 2.8)}" y2="${r(-Math.cos(a) * 2.8)}" stroke="#222" stroke-width=".25"/>`; }
  k += `<line x1="0" y1="0" x2="1.8" y2="-.6" stroke="#111" stroke-width=".5"/><line x1="0" y1="0" x2="-.4" y2="-3" stroke="#111" stroke-width=".35"/>`;
  S.teil({ id: "ge_uhr", de: "die Uhr", syl: "UHR", it: "l'orologio", itSyl: "o-ro-LO-gio", en: "clock", x: 240, y: 40, kunst: k });
}

/* =====================================================================
   3 — DIE RICHTERIN (Mitte, hinter der Richterbank, in Robe)
   ===================================================================== */
const RB = { yf: 110, x0: 100, x1: 220, podest: 0.45, hoehe: 1.1 };   // Richterbank: Fußlinie vorn, Höhe über dem Saalboden
const RB_TOP = RB.yf - RB.hoehe * SK(RB.yf);
{
  const fy = 102, s = SK(fy), oy = fy - RB.podest * s;
  /* hohe Lederlehnen der drei Richterstühle (Mitte höher) — Teil „der Richterstuhl“ */
  let st = "";
  for (const [x, h] of [[-26, 1.25], [0, 1.4], [26, 1.25]]) st += `<path d="M${x - 6} ${r(-0.5 * s)} L${x - 6.4} ${r(-h * s + 2)} Q${x} ${r(-h * s - 1)} ${x + 6.4} ${r(-h * s + 2)} L${x + 6} ${r(-0.5 * s)} Z" fill="${LEDER}"/><path d="M${x - 4.6} ${r(-h * s + 3)} Q${x} ${r(-h * s + 0.6)} ${x + 4.6} ${r(-h * s + 3)}" stroke="#4a4d55" stroke-width=".6" fill="none"/>`;
  S.teil({ id: "ge_richterstuhl", de: "der Richterstuhl", syl: "RICH-ter-stuhl", it: "la poltrona del giudice", itSyl: "pol-TRO-na del GIU-di-ce", en: "judge's chair", x: 160, y: oy, kunst: st,
    tipp: "Links und rechts der Richterin sitzen bei vielen Strafverfahren die Schöffen — Laienrichter." });
  const m = figur({ id: "b08e_ri", geschlecht: "w", pose: "sitzen", blick: 4, frisur: "kurz", haarfarbe: "grau", haut: "hell", laecheln: false,
    kleidung: { oberteil: { stueck: "bluse", farbe: "weiss" }, jacke: { stueck: "mantel", farbe: ROBE }, unterteil: { stueck: "anzughose", farbe: ROBE }, schuhe: { stueck: "halbschuh", farbe: "schwarz" }, zubehoer: { stueck: "brille" } } }, s * 1.7, oy - RB_TOP);
  S.teil({ id: "ge_richterin", de: "die Richterin", syl: "RICH-te-rin", it: "la giudice", itSyl: "GIU-di-ce", en: "judge", x: 160, y: r(oy + -m.z.sitz.y * m.k - 0.5 * s), kunst: m.svg + krawatte(m),
    tipp: "Sie leitet die Verhandlung und spricht am Ende das Urteil." });
}

/* =====================================================================
   4 — DIE RICHTERBANK (erhöht, Nussholz) — Lupe: Akte, Gesetzbuch,
       Protokoll, Namensschild
   ===================================================================== */
const rbUnter = [];
{
  const cx = 160, s = SK(RB.yf), H = RB.hoehe * s, W = RB.x1 - RB.x0;
  const sb = SK(RB.yf - 6), Hb = RB.hoehe * sb;
  let k = schatten(0, 0.5, W / 2 + 6, 2, 0.35);
  /* Podeststufe davor */
  k += `<path d="M${-W / 2 - 8} 0 L${W / 2 + 8} 0 L${W / 2 + 7} -3.4 L${-W / 2 - 7} -3.4 Z" fill="${NUSS_H}"/><rect x="${-W / 2 - 8}" y="-.8" width="${W + 16}" height=".8" fill="#3a2210"/>`;
  /* Platte */
  k += `<path d="M${-W / 2 - 1} ${r(-H)} L${W / 2 + 1} ${r(-H)} L${W / 2 - 1} ${r(-6 - Hb)} L${-W / 2 + 1} ${r(-6 - Hb)} Z" fill="${PLATTE}"/>`;
  /* Front: Nussholz-Kassetten, darüber Profil */
  k += `<rect x="${-W / 2}" y="${r(-H)}" width="${W}" height="${r(H - 3.4)}" fill="${NUSS_V}"/>`;
  k += `<rect x="${-W / 2 - 1.2}" y="${r(-H)}" width="${W + 2.4}" height="2" fill="#8a5d36"/>`;
  for (let i = 0; i < 6; i++) { const x = -W / 2 + 4 + i * (W - 8) / 6; k += `<rect x="${r(x)}" y="${r(-H + 5)}" width="${r((W - 8) / 6 - 3)}" height="${r(H - 13)}" rx=".5" fill="none" stroke="#3a2210" stroke-width=".55"/><rect x="${r(x + 0.6)}" y="${r(-H + 5.6)}" width="${r((W - 8) / 6 - 4.2)}" height="${r(H - 14.2)}" fill="none" stroke="#9a6a3c" stroke-width=".25" opacity=".7"/>`; }
  k += `<rect x="${-W / 2}" y="${r(-H + 2)}" width="${W}" height="1.2" fill="#fff" opacity=".12"/>`;
  /* Dinge auf der Richterbank */
  const yT = r(-H - 0.2);
  const dok = [];
  {  /* die Akte (Aktendeckel, rot, mit Aktenzeichen) */
    const x = -20;
    k += `<path d="M${x - 6} ${yT} L${x + 6} ${yT} L${x + 5.4} ${yT - 2.4} L${x - 5.4} ${yT - 2.4} Z" fill="#e8d8b8"/><path d="M${x - 6} ${yT} L${x + 6} ${yT} L${x + 6} ${yT - 1.4} L${x - 6} ${yT - 1.4} Z" fill="#b8402e"/>`;
    k += `<path d="M${x - 6} ${yT - 1.4} L${x + 6} ${yT - 1.4} L${x + 5.6} ${yT - 2.8} L${x - 5.6} ${yT - 2.8} Z" fill="#c95a43"/>`;
    dok.push({ id: "ge_akte", de: "die Akte", syl: "AK-te", it: "il fascicolo", itSyl: "fa-SCI-co-lo", en: "case file", x, w: 13, h: 5,
      tipp: "Alles, was schriftlich eingereicht wurde. Sie hat ein Aktenzeichen." });
  }
  {  /* das Gesetzbuch (der rote Ziegelstein: Loseblattsammlung) */
    const x = 18;
    k += `<path d="M${x - 4} ${yT} L${x + 4} ${yT} L${x + 4} ${yT - 4.6} L${x - 4} ${yT - 4.6} Z" fill="${S.lg("gesetz", [[0, "#c0392b"], [1, "#8f2318"]], 0, 0, 1, 0)}"/>`;
    k += `<rect x="${x - 3.4}" y="${yT - 3.8}" width="6.8" height="1" fill="#e9c46a"/><rect x="${x + 4}" y="${yT - 4.4}" width="1.2" height="4.4" fill="#f4efe2"/>`;
    for (let i = 0; i < 4; i++) k += `<line x1="${x + 4.2}" y1="${r(yT - 4 + i)}" x2="${x + 5}" y2="${r(yT - 4 + i)}" stroke="#bbb" stroke-width=".15"/>`;
    dok.push({ id: "ge_gesetzbuch", de: "das Gesetzbuch", syl: "ge-SETZ-buch", it: "il codice", itSyl: "CO-di-ce", en: "statute book", x, w: 11, h: 6.6,
      tipp: "Darin stehen die Gesetze, z. B. das Strafgesetzbuch (StGB)." });
  }
  {  /* das Protokoll (rechts, beim Schöffen / der Protokollführung) */
    const x = 42;
    k += `<path d="M${x - 5} ${yT} L${x + 5} ${yT} L${x + 4.4} ${yT - 2.6} L${x - 4.4} ${yT - 2.6} Z" fill="#fbfbf8" stroke="#c9ccc9" stroke-width=".15"/>`;
    for (let i = 0; i < 3; i++) k += `<rect x="${x - 4}" y="${r(yT - 2.2 + i * 0.7)}" width="${7.6 - i * 1.4}" height=".25" fill="#5a5a5a"/>`;
    k += `<path d="M${x + 2} ${yT - 0.6} l4 -1.6" stroke="#1d3d8f" stroke-width=".5"/>`;
    dok.push({ id: "ge_protokoll", de: "das Protokoll", syl: "Pro-to-KOLL", it: "il verbale", itSyl: "ver-BA-le", en: "record", x, w: 12, h: 4.4,
      tipp: "Was gesagt wird, wird mitgeschrieben. Am Ende unterschreibt man es." });
  }
  {  /* das Mikrofon der Vorsitzenden */
    const x = -4;
    k += `<ellipse cx="${x}" cy="${yT - 0.4}" rx="1.8" ry=".6" fill="#222"/><path d="M${x} ${yT - 0.6} Q${x - 0.4} ${yT - 4} ${x + 2.4} ${yT - 6}" stroke="#2a2a2a" stroke-width=".5" fill="none"/><ellipse cx="${x + 2.6}" cy="${yT - 6.2}" rx=".8" ry=".6" fill="#3a3a3a"/><circle cx="${x + 1.2}" cy="${yT - 0.5}" r=".3" fill="#d33"/>`;
    dok.push({ id: "ge_mikrofon", de: "das Mikrofon", syl: "mi-kro-FON", it: "il microfono", itSyl: "mi-CRO-fo-no", en: "microphone", x: x + 1, w: 6.4, h: 7.4 });
  }
  /* Namensschild vorn an der Bank */
  k += `<rect x="-14" y="${r(-H + 2.6)}" width="28" height="4.4" rx=".4" fill="#e9dcc0"/>` + T(0, -H + 5.9, 2.4, "Vorsitzende Richterin", "#3a2210", ' font-style="italic"');
  dok.forEach((d) => rbUnter.push({ id: d.id, de: d.de, syl: d.syl, it: d.it, itSyl: d.itSyl, en: d.en, tipp: d.tipp, x: cx + d.x, y: RB.yf + yT + 0.2, kunst: flaeche(-d.w / 2, -d.h, d.w, d.h, 0.6) }));
  /* KORREKTUR itSyl: vorher nur „BAN-co“ — jetzt die ganze Form wie „it“. */
  S.teil({ id: "ge_richtertisch", de: "der Richtertisch", syl: "RICH-ter-tisch", it: "il banco del giudice", itSyl: "BAN-co del GIU-di-ce", en: "bench", x: cx, y: RB.yf, steht: true, kunst: k,
    zoom: { x: 118, y: 56, w: 84, h: 56 }, unter: rbUnter,
    tipp: "Er steht erhöht. Wenn das Gericht hereinkommt, stehen alle auf." });
}

/* =====================================================================
   5 — TISCHE AN DEN SEITEN: Staatsanwaltschaft (Fensterseite, links)
       und Anklagebank (Türseite, rechts) — in die Tiefe gestellt
   ===================================================================== */
/* Ein Tisch, der in die Tiefe läuft: innere Kante bei (xn|yn) vorn bis yf
   hinten, h und b in Metern; seite −1 = links, +1 = rechts. Ursprung: (xn|yn). */
function tiefentisch(xn, yn, yf, h, b, seite, farbe = NUSS_V) {
  const xi = (y) => auf(xn, yn, y), xo = (y) => xi(y) + seite * b * SK(y), ht = (y) => h * SK(y);
  const P = (x, y) => `${r(x - xn)} ${r(y - yn)}`;
  let k = schatten(seite * b * SK(yn) / 2, 0.5, b * SK(yn) / 2 + 4, 2, 0.3);
  k += `<path d="M${P(xi(yn), yn - ht(yn))} L${P(xi(yf), yf - ht(yf))} L${P(xo(yf), yf - ht(yf))} L${P(xo(yn), yn - ht(yn))} Z" fill="${PLATTE}"/>`;
  k += `<path d="M${P(xi(yn), yn - ht(yn))} L${P(xi(yf), yf - ht(yf))} L${P(xi(yf), yf)} L${P(xi(yn), yn)} Z" fill="${farbe}"/>`;
  k += `<path d="M${P(xi(yn), yn - ht(yn))} L${P(xo(yn), yn - ht(yn))} L${P(xo(yn), yn)} L${P(xi(yn), yn)} Z" fill="${NUSS}"/>`;
  k += `<path d="M${P(xi(yn), yn - ht(yn))} L${P(xi(yf), yf - ht(yf))}" stroke="#9a6a3c" stroke-width=".9"/>`;
  return { k, xi, xo, ht, P };
}
const SA = { xn: 102, yn: 152, yf: 118 };
const AK = { xn: 218, yn: 152, yf: 116 };
/* Der Staatsanwalt (hinter dem Tisch, Wandseite) — zuerst, der Tisch verdeckt seine Beine */
{
  const fy = 132, s = SK(fy);
  const xo = auf(SA.xn, SA.yn, fy) - 0.7 * s;
  const m = figur({ id: "b08e_sta", geschlecht: "m", pose: "sitzen", blick: 72, frisur: "kurz", haarfarbe: "braun", haut: "hell",
    kleidung: { oberteil: { stueck: "hemd", farbe: "weiss" }, jacke: { stueck: "mantel", farbe: ROBE }, unterteil: { stueck: "anzughose", farbe: ROBE }, schuhe: { stueck: "halbschuh", farbe: "schwarz" } } }, s * 1.8, 0.75 * s);
  const oy = fy - 0.47 * s + -m.z.sitz.y * m.k;
  S.teil({ id: "ge_staatsanwalt", de: "der Staatsanwalt", syl: "STAATS-an-walt", it: "il pubblico ministero", itSyl: "PUB-bli-co mi-ni-STE-ro", en: "public prosecutor", x: r(xo - 3), y: r(oy), kunst: m.svg + krawatte(m),
    tipp: "Er hat die Anklage erhoben. Er sitzt auf der Fensterseite." });
}
{
  const t = tiefentisch(SA.xn, SA.yn, SA.yf, 0.76, 0.7, -1);
  let k = t.k;
  /* Namensschild und Akten auf dem Tisch */
  const ym = 136, xm = t.xi(ym) - 0.35 * SK(ym), ytop = ym - t.ht(ym);
  k += `<path d="M${t.P(xm - 4, ytop)} L${t.P(xm + 4, ytop)} L${t.P(xm + 3.6, ytop - 2.4)} L${t.P(xm - 3.6, ytop - 2.4)} Z" fill="#e8d8b8"/><path d="M${t.P(xm - 4, ytop)} L${t.P(xm + 4, ytop)} L${t.P(xm + 4, ytop - 1)} L${t.P(xm - 4, ytop - 1)} Z" fill="#2e5f8a"/>`;
  const yn2 = 146, xn2 = t.xi(yn2), yt2 = yn2 - t.ht(yn2);
  S.teil({ id: "ge_tisch_sta", de: "der Tisch der Staatsanwaltschaft", syl: "TISCH der STAATS-an-walt-schaft", it: "il banco dell'accusa", itSyl: "BAN-co del-l'ac-CU-sa", en: "prosecution table", x: SA.xn, y: SA.yn, steht: true, kunst: k });
}
/* Die Verteidigerin und der Angeklagte (Türseite) */
{
  const fy = 126, s = SK(fy);
  const xo = auf(AK.xn, AK.yn, fy) + 0.72 * s;
  const m = figur({ id: "b08e_an", geschlecht: "w", pose: "sitzen", blick: -72, frisur: "zopf", haarfarbe: "dunkelbraun", haut: "mittel",
    kleidung: { oberteil: { stueck: "bluse", farbe: "weiss" }, jacke: { stueck: "mantel", farbe: ROBE }, unterteil: { stueck: "anzughose", farbe: ROBE }, schuhe: { stueck: "halbschuh", farbe: "schwarz" } } }, s * 1.68, 0.75 * s);
  const oy = fy - 0.47 * s + -m.z.sitz.y * m.k;
  S.teil({ id: "ge_anwaeltin", de: "die Anwältin", syl: "AN-wäl-tin", it: "l'avvocata", itSyl: "av-vo-CA-ta", en: "lawyer", x: r(xo + 2), y: r(oy), kunst: m.svg + krawatte(m),
    tipp: "Sie verteidigt den Angeklagten. Anwälte tragen vor Gericht eine schwarze Robe." });
}
{
  const fy = 141, s = SK(fy);
  const xo = auf(AK.xn, AK.yn, fy) + 0.72 * s;
  /* KORREKTUR: In einem Strafprozess heißt er „der Angeklagte“ — „der
     Beklagte“ gibt es nur im Zivilprozess. Die id bleibt. */
  const m = figur({ id: "b08e_ak", geschlecht: "m", pose: "sitzen", blick: -66, frisur: "kurz", haarfarbe: "schwarz", haut: "hell", bart: true,
    kleidung: { oberteil: { stueck: "hemd", farbe: "#c9d6e3" }, jacke: { stueck: "jacke", farbe: "#55606b" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "halbschuh", farbe: "braun" } } }, s * 1.78, 0.75 * s);
  const oy = fy - 0.47 * s + -m.z.sitz.y * m.k;
  S.teil({ id: "ge_beklagter", de: "der Angeklagte", syl: "AN-ge-klag-te", it: "l'imputato", itSyl: "im-pu-TA-to", en: "defendant", x: r(xo + 2), y: r(oy), kunst: m.svg,
    tipp: "Er muss nichts sagen — das ist sein Recht. Bis zum Urteil gilt er als unschuldig." });
}
{
  const t = tiefentisch(AK.xn, AK.yn, AK.yf, 0.76, 0.7, 1);
  let k = t.k;
  const ym = 130, xm = t.xo(ym) - 0.3 * SK(ym), ytop = ym - t.ht(ym);
  k += `<path d="M${t.P(xm - 4, ytop)} L${t.P(xm + 4, ytop)} L${t.P(xm + 3.6, ytop - 2.4)} L${t.P(xm - 3.6, ytop - 2.4)} Z" fill="#e8d8b8"/><path d="M${t.P(xm - 4, ytop)} L${t.P(xm + 4, ytop)} L${t.P(xm + 4, ytop - 1)} L${t.P(xm - 4, ytop - 1)} Z" fill="#7a3b3b"/>`;
  /* KORREKTUR: im Strafprozess sitzen der Angeklagte und seine Verteidigung auf der Anklagebank, nicht „Parteien“. */
  S.teil({ id: "ge_tisch", de: "die Anklagebank", syl: "AN-kla-ge-bank", it: "il banco degli imputati", itSyl: "BAN-co de-gli im-pu-TA-ti", en: "dock", x: AK.xn, y: AK.yn, steht: true, kunst: k,
    tipp: "Auf der Türseite sitzt der Angeklagte neben seiner Verteidigerin." });
}

/* =====================================================================
   6 — DER ZEUGENSTAND (Zeugentisch mit Mikrofon), DER ZEUGE (von hinten)
       und DER ZEUGENSTUHL
   ===================================================================== */
const ZT = { y: 128, w: 1.3, h: 0.76 };
{
  const s = SK(ZT.y), W = ZT.w * s, H = ZT.h * s, sb = SK(ZT.y - 5);
  let k = schatten(0, 0.4, W / 2 + 2, 1.4, 0.3);
  /* von hinten gesehen: Platte, Zarge, vier Beine */
  k += `<path d="M${r(-W / 2)} ${r(-H)} L${r(W / 2)} ${r(-H)} L${r(W / 2 - 1.4)} ${r(-5 - ZT.h * sb)} L${r(-W / 2 + 1.4)} ${r(-5 - ZT.h * sb)} Z" fill="${PLATTE}"/>`;
  k += `<rect x="${r(-W / 2)}" y="${r(-H)}" width="${r(W)}" height="3" fill="${NUSS}"/>`;
  for (const x of [-W / 2 + 1.2, W / 2 - 2.6]) k += `<rect x="${r(x)}" y="${r(-H + 3)}" width="1.4" height="${r(H - 3)}" fill="${NUSS_V}"/>`;
  for (const x of [-W / 2 + 3, W / 2 - 4]) k += `<rect x="${r(x)}" y="${r(-5 - ZT.h * sb + 2)}" width="1" height="${r(ZT.h * sb - 2)}" fill="#3a2210" transform="translate(0 5)"/>`;
  /* Mikrofon und Wasserglas */
  k += `<ellipse cx="6" cy="${r(-H - 1.2)}" rx="1.6" ry=".5" fill="#222"/><path d="M6 ${r(-H - 1.4)} Q5.6 ${r(-H - 5)} 3.4 ${r(-H - 7)}" stroke="#2a2a2a" stroke-width=".5" fill="none"/><ellipse cx="3.2" cy="${r(-H - 7.2)}" rx=".8" ry=".6" fill="#3a3a3a"/>`;
  k += `<path d="M-9 ${r(-H - 1.4)} L-7 ${r(-H - 1.4)} L-6.8 ${r(-H - 5)} L-9.2 ${r(-H - 5)} Z" fill="#e6f2f5" opacity=".7" stroke="#b9cbd1" stroke-width=".2"/>`;
  S.teil({ id: "ge_zeugenstand", de: "der Zeugenstand", syl: "ZEU-gen-stand", it: "il banco dei testimoni", itSyl: "BAN-co dei te-sti-MO-ni", en: "witness stand", x: 160, y: ZT.y, steht: true, kunst: k,
    tipp: "In Deutschland sitzt der Zeuge an einem Tisch in der Mitte — mit Blick zum Gericht." });
}
{
  const fy = 137, s = SK(fy);
  const m = figur({ id: "b08e_ze", geschlecht: "m", pose: "sitzen", blick: 176, frisur: "glatze", haarfarbe: "grau", haut: "hell",
    kleidung: { oberteil: { stueck: "pullover", farbe: "#6b4a33" }, unterteil: { stueck: "hose", farbe: "grau" }, schuhe: { stueck: "halbschuh", farbe: "braun" } } }, s * 1.76, null, true);
  const oy = fy - 0.46 * s + -m.z.sitz.y * m.k;
  S.teil({ id: "ge_zeuge", de: "der Zeuge", syl: "ZEU-ge", it: "il testimone", itSyl: "te-sti-MO-ne", en: "witness", x: 160, y: r(oy), kunst: m.svg,
    tipp: "Er sagt aus, was er gesehen hat — und muss die Wahrheit sagen." });
}
{
  const fy = 140, s = SK(fy), w = 0.46 * s, sh = 0.46 * s, lh = 0.92 * s;
  let k = schatten(0, 0.3, w / 2 + 2, 1.2, 0.3);
  k += `<path d="M${r(-w / 2 + 1)} 0 L${r(-w / 2 + 1.4)} ${r(-sh)} M${r(w / 2 - 1)} 0 L${r(w / 2 - 1.4)} ${r(-sh)}" stroke="#3a2210" stroke-width="1.4"/>`;
  k += `<path d="M${r(-w / 2)} ${r(-sh + 2.6)} L${r(w / 2)} ${r(-sh + 2.6)} L${r(w / 2)} ${r(-lh)} Q0 ${r(-lh - 2)} ${r(-w / 2)} ${r(-lh)} Z" fill="${NUSS_V}"/>`;
  k += `<path d="M${r(-w / 2 + 2)} ${r(-sh)} L${r(w / 2 - 2)} ${r(-sh)} L${r(w / 2 - 2)} ${r(-lh + 2.4)} Q0 ${r(-lh + 0.6)} ${r(-w / 2 + 2)} ${r(-lh + 2.4)} Z" fill="${POLSTER}"/>`;
  S.teil({ id: "ge_zeugenstuhl", de: "der Zeugenstuhl", syl: "ZEU-gen-stuhl", it: "la sedia del testimone", itSyl: "SE-dia del te-sti-MO-ne", en: "witness chair", x: 160, y: fy, steht: true, kunst: k });
}

/* =====================================================================
   7 — DIE ROBE (am Garderobenständer, Fensterseite) mit Barett
   ===================================================================== */
{
  const fy = 126, s = SK(fy);
  let k = schatten(0, 0.4, 6, 1.2, 0.3);
  k += `<path d="M-5 0 L0 -3 L5 0" stroke="#2a1a0c" stroke-width="1.2" fill="none"/><rect x="-.6" y="${r(-1.8 * s)}" width="1.2" height="${r(1.8 * s - 2)}" fill="#3a2210"/>`;
  k += `<path d="M-3 ${r(-1.7 * s)} L0 ${r(-1.78 * s)} L3 ${r(-1.7 * s)}" stroke="#3a2210" stroke-width=".8" fill="none"/>`;
  /* Robe: weite Ärmel, Samtbesatz vorn */
  const t = -1.68 * s, u = -0.5 * s;
  k += `<path d="M-2 ${r(t)} Q-7 ${r(t + 2)} -8 ${r(t + 8)} L-9 ${r(u)} Q0 ${r(u + 2)} 9 ${r(u)} L8 ${r(t + 8)} Q7 ${r(t + 2)} 2 ${r(t)} Z" fill="${S.lg("robe", [[0, "#2a2a30"], [0.5, "#141418"], [1, "#0b0b0e"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-1.6 ${r(t)} L-2.4 ${r(u + 1)} M1.6 ${r(t)} L2.4 ${r(u + 1)}" stroke="#2c2c34" stroke-width="2"/>`;
  for (const x of [-5, -1, 3, 6]) k += `<path d="M${x} ${r(t + 6)} Q${x + 0.8} ${r((t + u) / 2)} ${x - 0.4} ${r(u)}" stroke="#2e2e36" stroke-width=".6" fill="none"/>`;
  k += `<path d="M-1.2 ${r(t + 0.4)} L1.2 ${r(t + 0.4)} L.6 ${r(t + 5)} L-.6 ${r(t + 5)} Z" fill="#fbfbf8"/>`;
  /* Barett obenauf */
  k += `<path d="M-3.4 ${r(-1.78 * s - 0.6)} L3.4 ${r(-1.78 * s - 0.6)} L3 ${r(-1.78 * s - 3.4)} Q0 ${r(-1.78 * s - 4.4)} -3 ${r(-1.78 * s - 3.4)} Z" fill="#16161a"/>`;
  S.teil({ id: "ge_robe", de: "die Robe", syl: "RO-be", it: "la toga", itSyl: "TO-ga", en: "robe", x: 44, y: fy, steht: true, kunst: k,
    tipp: "Der schwarze Talar. Richter, Staatsanwalt und Anwalt tragen ihn — am Besatz sieht man, wer wer ist." });
}

/* =====================================================================
   8 — DIE SCHRANKE (Holzbalustrade zwischen Saal und Zuschauerraum)
   ===================================================================== */
{
  const fy = 166, s = SK(fy), H = 0.9 * s;
  let k = "";
  for (const [a, b] of [[-160, -20], [20, 160]]) {
    k += `<rect x="${a}" y="${r(-H)}" width="${b - a}" height="3.4" rx=".6" fill="${NUSS_H}"/><rect x="${a}" y="-4" width="${b - a}" height="4" fill="${NUSS}"/>`;
    for (let x = a + 3; x < b - 1; x += 5.4) k += `<path d="M${r(x - 1.2)} -4 L${r(x - 1.2)} ${r(-H + 3.4)} L${r(x + 1.2)} ${r(-H + 3.4)} L${r(x + 1.2)} -4 Z" fill="${NUSS_V}"/><ellipse cx="${r(x)}" cy="${r(-H / 2)}" rx="1.7" ry="2.4" fill="#5a381e"/>`;
    k += `<rect x="${a}" y="${r(-H)}" width="${b - a}" height="1" fill="#b98a55" opacity=".6"/>`;
  }
  /* Schwingtür in der Mitte, halb offen */
  k += `<rect x="-20" y="${r(-H - 2)}" width="3.4" height="${r(H + 2)}" fill="${NUSS_H}"/><rect x="16.6" y="${r(-H - 2)}" width="3.4" height="${r(H + 2)}" fill="${NUSS_H}"/>`;
  k += `<path d="M-16.6 ${r(-H + 3)} L-8 ${r(-H + 6)} L-8 -6 L-16.6 -3 Z" fill="${NUSS_V}"/>`;
  S.teil({ id: "ge_schranke", de: "die Schranke", syl: "SCHRAN-ke", it: "la balaustra", itSyl: "ba-la-U-stra", en: "bar (railing)", x: 160, y: fy, steht: true, kunst: k,
    tipp: "Die Schranke trennt den Saal von den Zuschauern. Nur wer geladen ist, geht durch." });
}

/* =====================================================================
   9 — DIE ZUSCHAUERBANK (vorne) und DAS PUBLIKUM (zwei Zuschauer
       von hinten, links und rechts außen)
   ===================================================================== */
const ZB = { y: 190, sitz: 0.45, lehne: 0.86 };
{
  /* DAS PUBLIKUM: sitzt auf der Bank davor (Reihe y 178), sieht man von hinten */
  const fy = 178, s = SK(fy);
  let k = "";
  const zu = [
    { x: 24, spec: { id: "b08e_p1", geschlecht: "w", pose: "sitzen", blick: 188, frisur: "dutt", haarfarbe: "hellbraun", haut: "hell", kleidung: { oberteil: { stueck: "pullover", farbe: "#8a4a6a" }, unterteil: { stueck: "hose", farbe: "grau" }, schuhe: { stueck: "halbschuh" } } }, h: 1.66 },
    { x: 290, spec: { id: "b08e_p2", geschlecht: "m", pose: "sitzen", blick: 170, frisur: "kurz", haarfarbe: "blond", haut: "hell", kleidung: { oberteil: { stueck: "hemd", farbe: "#e9e6de" }, jacke: { stueck: "jacke", farbe: "#2f5a35" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "halbschuh" } } }, h: 1.8 },
  ];
  /* ihre Bank (die zweite Reihe) — Lehne liegt vor ihnen nicht, sie sitzen in der ersten Reihe vor der Zuschauerbank */
  const lehneOben = ZB.y - ZB.lehne * SK(ZB.y) - 1.6;
  zu.forEach((z) => {
    /* was hinter der Lehne der Zuschauerbank liegt, wird weggelassen */
    const k0 = s * z.h / 178, oy0 = fy - 0.45 * s + 41.2 * k0;
    const m = figur(z.spec, s * z.h, oy0 - lehneOben, true);
    const oy = fy - 0.45 * s + -m.z.sitz.y * m.k;
    k += `<g transform="translate(${z.x - 160} ${r(oy - fy)})">${m.svg}</g>`;
  });
  S.teil({ id: "ge_publikum", de: "das Publikum", syl: "PU-bli-kum", it: "il pubblico", itSyl: "PUB-bli-co", en: "public", x: 160, y: fy, kunst: k,
    tipp: "Die Verhandlung ist öffentlich. Wer zuschaut, bleibt still." });
}

{
  const s = SK(ZB.y), sh = ZB.sitz * s, lh = ZB.lehne * s;
  /* die Zuschauer sitzen auf der ersten Bank — vor der Lehne gezeichnet,
     darum zuerst die Sitzfläche (Teil der Bank) … */
  let k = "";
  for (const [a, b] of [[-160, -26], [26, 160]]) {
    k += `<path d="M${a} ${r(-sh)} L${b} ${r(-sh)} L${b} ${r(-sh + 3)} L${a} ${r(-sh + 3)} Z" fill="${NUSS_H}"/>`;
    for (const x of [a + 6, (a + b) / 2, b - 6]) k += `<rect x="${x - 1.4}" y="${r(-sh + 3)}" width="2.8" height="${r(sh - 3)}" fill="${NUSS}"/>`;
    k += `<path d="M${a} ${r(-lh)} L${b} ${r(-lh)} L${b} ${r(-sh - 1)} L${a} ${r(-sh - 1)} Z" fill="${NUSS_V}"/>`;
    k += `<rect x="${a}" y="${r(-lh - 1.6)}" width="${b - a}" height="2.6" rx="1" fill="${NUSS_H}"/>`;
    for (let x = a + 8; x < b - 4; x += 22) k += `<rect x="${x}" y="${r(-lh + 3)}" width="18" height="${r(lh - sh - 6)}" rx=".6" fill="none" stroke="#3a2210" stroke-width=".6"/>`;
    k += `<rect x="${a}" y="${r(-lh - 1.6)}" width="${b - a}" height=".8" fill="#fff" opacity=".15"/>`;
  }
  /* KORREKTUR itSyl: vorher nur „PAN-ca“ — jetzt die ganze Form wie „it“. */
  S.teil({ id: "ge_zuschauerbank", de: "die Zuschauerbank", syl: "ZU-schau-er-bank", it: "la panca del pubblico", itSyl: "PAN-ca del PUB-bli-co", en: "public gallery", x: 160, y: ZB.y + 10, steht: true, kunst: `<g transform="translate(0 -10)">${k}</g>`,
    tipp: "Ganz hinten darf jeder sitzen. Fotografieren ist verboten." });
}
const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/gericht.js"));
console.log(aus);
