#!/usr/bin/env node
/* =====================================================================
   DER BUSBAHNHOF (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   XANDER (Funk 263/286): jeder Ort „identisch mit seinem Original“, alle
   Stationen logisch, jedes Ding einzeln antippbar, nichts blockiert.

   RECHERCHE (ZOB Hannover, ZOB Herne, ZOB Eisenach, Fernbus-Halte):
   - Der ZOB (Zentraler Omnibusbahnhof) hat lange BUSSTEIGE mit Nummern
     (B 1, B 2 …), die mit einem DACH aus Stahl und Glas überdeckt sind.
   - Die Bussteigkante ist ein hoher Bordstein (Kasseler Bord), davor
     ein weißer Blindenleitstreifen mit Rillen.
   - An jedem Bussteig: das HALTESTELLENSCHILD (Zeichen 224: grünes H
     auf gelbem Kreis mit grünem Rand), eine elektronische
     ABFAHRTSANZEIGE unter dem Dach, ein WARTEHÄUSCHEN aus Glas mit
     Bank und ausgehängtem FAHRPLAN, MÜLLEIMER, FAHRKARTENAUTOMAT.
   - Hinten die WARTEHALLE (geheizt, Fahrkarten, Kiosk, Schließfächer).
   - Der FERNBUS (Reisebus, 12 m, Türen rechts) hält mit der Türseite am
     Bussteig; der Fahrer kontrolliert an der vorderen Tür die Tickets
     und lädt die Koffer in das GEPÄCKFACH zwischen den Achsen.
   Perspektive: Zwei-Fluchtpunkt-Ansicht — die Kamera steht auf dem
   Bussteig und schaut 20° nach rechts; Bussteig und Bus laufen links in
   die Tiefe. Augenhöhe 1,6 m über dem Bussteig, Brennweite 320.
   Maßstab: Bus 12 m lang, 3,8 m hoch; Reisende 1,66 m (≈ 41 Einheiten
   je Meter in 7,8 m Abstand).
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "busbahnhof", titel: "Der Busbahnhof", emoji: "🚌", thema: "Unterwegs", kuerzel: "b06b", fassung: 852 });
const rnd = zufall(3107);
const r = B.r;

/* ---------- Projektion mit Drehung (Gierwinkel) ---------------------- */
const F = 320, AUGE = 1.6, VX = 150, VY = 95, TH = 20 * Math.PI / 180, CO = Math.cos(TH), SI = Math.sin(TH);
const zc = (X, Z) => X * SI + Z * CO;
const P = (X, Z, H = 0) => { const xc = X * CO - Z * SI, z = zc(X, Z); return [r(VX + xc * F / z), r(VY + (AUGE - H) * F / z)]; };
const M = (X, Z) => F / zc(X, Z);                     // Einheiten je Meter an dieser Stelle
/* Alles wird am Bildrand abgeschnitten (Sutherland–Hodgman bzw. Liang–Barsky),
   damit keine Zeichnung über das Bild hinausragt. */
const RX0 = -0.5, RX1 = 320.5, RY0 = -0.5, RY1 = 200.5;
function rahmen(pts) {
  const kanten = [[(p) => p[0] >= RX0, (a, b) => [RX0, a[1] + (b[1] - a[1]) * (RX0 - a[0]) / (b[0] - a[0])]],
    [(p) => p[0] <= RX1, (a, b) => [RX1, a[1] + (b[1] - a[1]) * (RX1 - a[0]) / (b[0] - a[0])]],
    [(p) => p[1] >= RY0, (a, b) => [a[0] + (b[0] - a[0]) * (RY0 - a[1]) / (b[1] - a[1]), RY0]],
    [(p) => p[1] <= RY1, (a, b) => [a[0] + (b[0] - a[0]) * (RY1 - a[1]) / (b[1] - a[1]), RY1]]];
  let q = pts;
  for (const [drin, schnitt] of kanten) {
    const n = [];
    for (let i = 0; i < q.length; i++) {
      const a = q[i], b = q[(i + 1) % q.length];
      if (drin(a)) { n.push(a); if (!drin(b)) n.push(schnitt(a, b)); } else if (drin(b)) n.push(schnitt(a, b));
    }
    q = n;
    if (!q.length) break;
  }
  return q.map((p) => [r(p[0]), r(p[1])]);
}
const poly = (pts, fill, extra = "") => { const q = rahmen(pts); return q.length < 3 ? "" : `<path d="M${q.map((p) => p.join(" ")).join(" L")} Z" fill="${fill}"${extra}/>`; };
function linie(a, b, farbe, w, extra = "") {
  let t0 = 0, t1 = 1; const dx = b[0] - a[0], dy = b[1] - a[1];
  for (const [p, q] of [[-dx, a[0] - RX0], [dx, RX1 - a[0]], [-dy, a[1] - RY0], [dy, RY1 - a[1]]]) {
    if (p === 0) { if (q < 0) return ""; continue; }
    const t = q / p; if (p < 0) t0 = Math.max(t0, t); else t1 = Math.min(t1, t);
  }
  if (t0 > t1) return "";
  return `<line x1="${r(a[0] + dx * t0)}" y1="${r(a[1] + dy * t0)}" x2="${r(a[0] + dx * t1)}" y2="${r(a[1] + dy * t1)}" stroke="${farbe}" stroke-width="${w}"${extra}/>`;
}
/* sicherer Startpunkt in der Tiefe (vor der Kamera) */
const zMin = (X) => Math.max(0.6, (0.6 - X * SI) / CO);
/* Fläche bei festem X (Seitenwand) bzw. festem Z (Stirnwand) */
const fX = (X, Z0, Z1, H0, H1) => [P(X, Z0, H1), P(X, Z1, H1), P(X, Z1, H0), P(X, Z0, H0)];
const fZ = (Z, X0, X1, H0, H1) => [P(X0, Z, H1), P(X1, Z, H1), P(X1, Z, H0), P(X0, Z, H0)];
const T = (x, y, s, txt, fill, anchor = "start", w = "normal", fam = "Arial,Helvetica,sans-serif") =>
  `<text x="${r(x)}" y="${r(y)}" font-size="${s}" text-anchor="${anchor}" fill="${fill}" font-family="${fam}" font-weight="${w}">${txt}</text>`;
const absolut = (x, y, svg) => `<g transform="translate(${r(-x)} ${r(-y)})">${svg}</g>`;
const SPUR = -0.16;                                   // Fahrbahn liegt 16 cm tiefer
const KANTE = 7.1;                                    // Bussteigkante (X)

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("wolke")}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.4"/></filter>`);
const STAHL = S.lg("stahl", [[0, "#eef1f3"], [0.45, "#c9cfd4"], [0.55, "#b5bcc2"], [1, "#e1e5e8"]], 0, 0, 1, 0);
const GRUEN = "#1f7a3e", GELB = "#f6d21f";

/* =====================================================================
   KULISSE — Himmel, Stadt, Fahrbahn, Bussteig-Pflaster
   ===================================================================== */
{
  let k = `<rect x="0" y="0" width="320" height="${VY + 2}" fill="${S.lg("himmel", [[0, "#6fa6d6"], [0.65, "#a9cbe6"], [1, "#e1ecf2"]])}"/>`;
  for (const [x, y, w] of [[210, 16, 30], [280, 30, 22], [120, 40, 18], [250, 52, 26], [305, 64, 14]]) k += `<ellipse cx="${x}" cy="${y}" rx="${w}" ry="${r(w * 0.24)}" fill="#fff" opacity=".8" filter="url(#${S.id("wolke")})"/>`;
  /* Stadt hinter dem Busbahnhof: Wohn- und Bürohäuser, Bäume */
  const haus = [[96, 70, 26, "#d9cfc0"], [120, 62, 22, "#c9b9a3"], [140, 74, 30, "#e2dbd0"], [168, 58, 26, "#b9b2a6"], [192, 68, 30, "#d6c8b4"], [220, 54, 24, "#cfd4d8"], [242, 66, 34, "#e0d6c6"], [274, 60, 22, "#c4bcb0"], [294, 70, 28, "#d8d0c4"]];
  haus.forEach(([x, y, w, f]) => {
    k += `<rect x="${x}" y="${y}" width="${w}" height="${VY + 2 - y}" fill="${f}"/><rect x="${x}" y="${y}" width="${w}" height="1.4" fill="#9a9184"/>`;
    for (let yy = y + 4; yy < VY - 2; yy += 5) for (let xx = x + 2.5; xx < x + w - 3; xx += 5) k += `<rect x="${r(xx)}" y="${yy}" width="2.6" height="2.8" fill="${rnd() < 0.3 ? "#f3e7c4" : "#7f93a6"}" opacity=".8"/>`;
  });
  let baum = `M60 ${VY + 2}`;
  for (let x = 60; x <= 320; x += 4) baum += ` L${x} ${r(VY - 3 - rnd() * 5)}`;
  k += `<path d="${baum} L320 ${VY + 2} Z" fill="#5d7f4f"/>`;
  S.hinten(k);
}
{
  /* Fahrbahn (Asphalt) bis zum Horizont, dahinter die nächste Bussteig-Insel */
  let k = `<rect x="0" y="${VY}" width="320" height="${200 - VY}" fill="${S.lg("asphalt", [[0, "#7a7d80"], [1, "#55595d"]])}"/>`;
  for (let i = 0; i < 260; i++) k += `<circle cx="${r(rnd() * 320)}" cy="${r(VY + rnd() * 105)}" r="${r(0.2 + rnd() * 0.35)}" fill="${rnd() < 0.5 ? "#8e9296" : "#4a4e52"}" opacity=".6"/>`;
  /* Fahrstreifenbegrenzung und „BUS“ auf der Fahrbahn */
  k += poly([P(10.6, 9, SPUR), P(10.75, 9, SPUR), P(10.75, 60, SPUR), P(10.6, 60, SPUR)], "#eef0ee", ` opacity=".85"`);
  /* nächste Insel jenseits der Fahrbahn: Bordstein und Dachkante */
  k += poly([P(13.4, 8, SPUR), P(13.4, 80, SPUR), P(13.4, 80, 0), P(13.4, 8, 0)], "#c9c6bf");
  k += poly([P(13.4, 8, 0), P(13.4, 80, 0), P(20, 80, 0), P(20, 8, 0)], "#b8b4ac");
  k += poly([P(14, 10, 4.2), P(14, 80, 4.2), P(14, 80, 4.6), P(14, 10, 4.6)], "#59636c");
  for (const Z of [14, 22, 30, 38]) k += poly(fX(15.5, Z, Z + 0.3, 0, 4.2), "#7d868d");
  /* Bussteig-Pflaster (Betonstein), Fugen in beide Richtungen */
  k += poly([P(KANTE, 2.5, 0), P(KANTE, 150, 0), P(-20, 150, 0), [-80, 260], [600, 260]], S.lg("pflaster", [[0, "#b4b1a9"], [1, "#d6d3cb"]]));
  for (let X = -8; X < KANTE; X += 0.6) k += linie(P(X, Math.max(1.5, zMin(X) + 0.4)), P(X, 60), "#a29e95", ".25");
  for (let Z = 2.5; Z < 60; Z += (Z < 12 ? 0.6 : 1.2)) k += linie(P(Math.max(-12, (0.9 - Z * CO) / SI), Z), P(KANTE, Z), "#a29e95", r(Math.min(0.4, 3 / Z)));
  /* Blindenleitstreifen (weiß, gerillt) vor der Kante */
  k += poly([P(6.3, 2, 0), P(6.6, 2, 0), P(6.6, 80, 0), P(6.3, 80, 0)], "#efefea");
  for (let Z = 2.2; Z < 30; Z += 0.25) k += linie(P(6.3, Z), P(6.6, Z), "#c9c9c2", ".2");
  S.hinten(k);
}

/* =====================================================================
   1 — DAS DACH über dem Bussteig (Stahl und Glas), mit Stützen
   ===================================================================== */
{
  const HD = 4.4, X0 = -4, X1 = 6.5;
  let k = poly([P(X0, 3, HD), P(X1, 1.6, HD), P(X1, 34, HD), P(X0, 34, HD)], S.lg("dachglas", [[0, "#d8e6ef"], [1, "#b7cbd8"]]));
  /* Glasfelder: Querträger alle 2 m, Längsträger */
  for (let Z = 2; Z <= 34; Z += 2) k += linie(P(Math.max(X0, (0.9 - Z * CO) / SI), Z, HD), P(X1, Z, HD), "#5b6670", r(Math.min(1.6, 9 / Z)));
  for (const X of [-1, 2.5]) k += linie(P(X, 1.6, HD), P(X, 34, HD), "#5b6670", "1.2");
  for (let Z = 3; Z <= 33; Z += 2) { const xa = Math.max(X0, (0.9 - Z * CO) / SI); k += poly([P(xa, Z, HD), P(X1, Z, HD), P(X1, Z + 0.6, HD), P(xa, Z + 0.6, HD)], "#fff", ` opacity=".25"`); }
  /* Dachkante (Blende) */
  k += poly([P(X1, 1.6, HD), P(X1, 34, HD), P(X1, 34, HD - 0.35), P(X1, 1.6, HD - 0.35)], S.lg("blende", [[0, "#6d7881"], [1, "#46505a"]]));
  k += linie(P(X1, 1.6, HD - 0.35), P(X1, 34, HD - 0.35), "#2f363d", ".5");
  /* Stützen in der Mitte des Bussteigs */
  for (const Z of [8, 16, 24, 32]) {
    const a = P(-1, Z, 0), m = M(-1, Z), w = 0.28 * m;
    k += poly([[a[0] - w / 2, a[1] - HD * m], [a[0] + w / 2, a[1] - HD * m], [a[0] + w / 2, a[1]], [a[0] - w / 2, a[1]]], S.lg("stuetze", [[0, "#4f5a64"], [0.5, "#8a959e"], [1, "#46505a"]], 0, 0, 1, 0));
    if (a[0] > 4) k += schatten(a[0], a[1], w * 1.2, 0.6, 0.3);
  }
  const m = P(1.2, 6, HD);
  S.teil({ id: "bb_dach", de: "das Dach", syl: "DACH", it: "la pensilina", itSyl: "pen-si-LI-na", en: "canopy", x: m[0], y: m[1], kunst: absolut(m[0], m[1], k),
    tipp: "Das Dach aus Glas schützt die Wartenden vor Regen." });
}

/* =====================================================================
   2 — DIE WARTEHALLE (Glaspavillon am Ende des Bussteigs)
   ===================================================================== */
{
  const Z = 46, X0 = 6, X1 = 12.5, H = 4.4;
  let k = poly(fZ(Z, X0, X1, 0, H), S.lg("halle", [[0, "#3c4a55"], [1, "#2a343c"]]));
  /* warm beleuchtetes Inneres hinter Glas */
  k += poly(fZ(Z, X0 + 0.3, X1 - 0.3, 0.1, H - 0.9), S.lg("halleinnen", [[0, "#f4dfae"], [1, "#d7b981"]]));
  for (let X = X0 + 0.3; X < X1; X += 1.2) k += linie(P(X, Z, 0.1), P(X, Z, H - 0.9), "#46525c", ".5");
  /* Menschen drinnen als Schatten, Bänke */
  for (const X of [7.6, 10.4]) { const p = P(X, Z + 0.2, 0); k += `<rect x="${r(p[0] - 0.6)}" y="${r(p[1] - 6.8)}" width="1.2" height="6.6" rx=".6" fill="#6b5a44" opacity=".7"/><circle cx="${p[0]}" cy="${r(p[1] - 7.6)}" r=".9" fill="#6b5a44" opacity=".7"/>`; }
  /* Dach und Schriftzug ZOB */
  k += poly(fZ(Z, X0 - 0.4, X1 + 0.4, H - 0.9, H + 0.2), "#e9ecee");
  const s = P((X0 + X1) / 2, Z, H - 0.62);
  k += T(s[0], s[1], 4.4, "ZOB", "#1f4f8c", "middle", "bold");
  const t = P(X0 + 0.8, Z, H - 0.55);
  k += `<rect x="${r(t[0] - 2.4)}" y="${r(t[1] - 3)}" width="4.8" height="4.8" rx=".6" fill="${GRUEN}"/>` + T(t[0], t[1] + 1, 3.4, "H", GELB, "middle", "bold");
  const f = P((X0 + X1) / 2, Z);
  k = schatten(f[0], f[1], 30, 1, 0.25) + k;
  S.teil({ id: "bb_wartehalle", de: "die Wartehalle", syl: "WAR-te-hal-le", it: "la sala d'attesa", itSyl: "SA-la d'at-TE-sa", en: "waiting hall", x: f[0], y: f[1], steht: true, kunst: absolut(f[0], f[1], k),
    tipp: "In der Wartehalle ist es warm. Dort gibt es Fahrkarten, einen Kiosk und Schließfächer." });
}

/* =====================================================================
   3 — DIE ABFAHRTSTAFEL (Anzeige unter dem Dach)
   ===================================================================== */
{
  const Z = 8.0, X0 = 1.9, X1 = 3.7, H0 = 2.72, H1 = 3.42;
  let k = "";
  for (const X of [X0 + 0.2, X1 - 0.2]) k += linie(P(X, Z, H1), P(X, Z, 4.3), "#4a525b", ".7");
  k += poly(fZ(Z, X0 - 0.05, X1 + 0.05, H0 - 0.05, H1 + 0.05), "#2b3036");
  k += poly(fZ(Z, X0, X1, H0, H1), "#0b1220");
  const a = P(X0, Z, H1), b = P(X1, Z, H0), w = b[0] - a[0], h = b[1] - a[1];
  /* Kopf: Bussteig B3 + Uhrzeit */
  k += `<rect x="${a[0]}" y="${a[1]}" width="${r(w)}" height="${r(h * 0.22)}" fill="#163a6b"/>`;
  k += T(a[0] + 1.5, a[1] + h * 0.17, 3, "Bussteig B 3", "#fff", "start", "bold") + T(b[0] - 1.5, a[1] + h * 0.17, 3, "10:07", "#ffd34d", "end", "bold");
  const zeilen = [["10:15", "Leipzig", "pünktlich", "#7ee08a"], ["10:40", "Berlin ZOB", "+5 Min.", "#ffb347"], ["11:05", "Prag", "pünktlich", "#7ee08a"], ["11:30", "Hamburg", "pünktlich", "#7ee08a"]];
  zeilen.forEach((z, i) => {
    const y = a[1] + h * 0.22 + 4.4 + i * 4.6;
    k += T(a[0] + 1.5, y, 3.1, z[0], "#ffd34d", "start", "bold") + T(a[0] + 12.5, y, 3.1, z[1], "#fff") + T(b[0] - 1.5, y, 2.6, z[2], z[3], "end");
  });
  k += poly([a, [r(a[0] + 18), a[1]], [r(a[0] + 8), b[1]], [a[0], b[1]]], "#fff", ` opacity=".06"`);
  const m = P((X0 + X1) / 2, Z, H0);
  S.teil({ id: "bb_tafel", de: "die Abfahrtstafel", syl: "AB-fahrts-ta-fel", it: "il tabellone", itSyl: "ta-bel-LO-ne", en: "departure board", x: m[0], y: m[1], kunst: absolut(m[0], m[1], k),
    tipp: "Hier steht, wann welcher Bus von welchem Bussteig fährt." });
}

/* =====================================================================
   4 — DER FERNBUS (Reisebus an der Kante) — Lupe: Gepäckfach, Tür,
       Zielanzeige, Außenspiegel, Windschutzscheibe
   ===================================================================== */
const BUS = { X0: 7.5, X1: 10.05, Z0: 12, Z1: 24.1, H0: SPUR + 0.28, H1: SPUR + 3.8 };
const TUER = { Z0: 12.2, Z1: 13.15 };
let busUnter = [];
{
  const { X0, X1, Z0, Z1, H0, H1 } = BUS;
  let k = "";
  /* Schatten unter dem Bus */
  k += poly([P(X0 - 0.2, Z0 - 0.2, SPUR), P(X1, Z0 - 0.2, SPUR), P(X1, Z1, SPUR), P(X0 - 0.2, Z1, SPUR)], "#1b1e21", ` opacity=".45" filter="url(#bw_weich)"`);
  /* --- Seitenwand (Türseite) --- */
  k += poly(fX(X0, Z0, Z1, H0, H1 - 0.12), S.lg("busseite", [[0, "#ffffff"], [0.6, "#eef1f3"], [1, "#c9d0d6"]]));
  k += poly([P(X0, Z0, H1 - 0.12), P(X0, Z1, H1 - 0.12), P(X0 + 0.25, Z1, H1), P(X0 + 0.25, Z0 + 0.1, H1)], "#e3e8ec");
  /* Fensterband */
  k += poly(fX(X0, Z0 + 1.3, Z1 - 0.25, 1.92 + SPUR, 3.38 + SPUR), S.lg("busglas", [[0, "#3b4f60"], [0.5, "#1f2b35"], [1, "#2d3d4a"]]));
  for (let Z = Z0 + 2.4; Z < Z1 - 0.4; Z += 1.25) k += poly(fX(X0, Z, Z + 0.12, 1.92 + SPUR, 3.38 + SPUR), "#e9edf0");
  k += poly(fX(X0, Z0 + 1.6, Z1 - 0.6, 3.0 + SPUR, 3.2 + SPUR), "#ffffff", ` opacity=".12"`);
  /* Zierstreifen: blau mit gelber Linie */
  k += poly([P(X0, Z0 + 1.3, 1.55 + SPUR), P(X0, Z1, 1.2 + SPUR), P(X0, Z1, 1.62 + SPUR), P(X0, Z0 + 1.3, 1.8 + SPUR)], "#1f5fa0");
  k += poly([P(X0, Z0 + 1.3, 1.82 + SPUR), P(X0, Z1, 1.64 + SPUR), P(X0, Z1, 1.7 + SPUR), P(X0, Z0 + 1.3, 1.88 + SPUR)], GELB);
  { const a = P(X0, 23.85, 1.02 + SPUR), b = P(X0, 21.35, 1.02 + SPUR), L = 40, h = 0.36 * M(X0, 22.6) / 7;
    k += `<text transform="matrix(${r((b[0] - a[0]) / L * 100) / 100} ${r((b[1] - a[1]) / L * 100) / 100} 0 ${r(h * 100) / 100} ${a[0]} ${a[1]})" font-size="7" textLength="${L}" lengthAdjust="spacingAndGlyphs" fill="#1f5fa0" font-family="Arial" font-weight="bold" font-style="italic">FernExpress</text>`; }
  /* Schürze unten */
  k += poly(fX(X0, Z0, Z1, H0, H0 + 0.24), "#3a3f44");
  /* Radkästen und Räder */
  const rad = (Za) => {
    const c = P(X0, Za, SPUR + 0.5), l = P(X0, Za - 0.5, SPUR + 0.5), rr = P(X0, Za + 0.5, SPUR + 0.5);
    const rx = Math.abs(l[0] - rr[0]) / 2, ry = 0.5 * M(X0, Za);
    let g = `<ellipse cx="${c[0]}" cy="${c[1]}" rx="${r(rx * 1.25)}" ry="${r(ry * 1.15)}" fill="#22262a"/>`;
    g += `<ellipse cx="${c[0]}" cy="${c[1]}" rx="${r(rx)}" ry="${r(ry)}" fill="#141618"/><ellipse cx="${c[0]}" cy="${c[1]}" rx="${r(rx * 0.6)}" ry="${r(ry * 0.6)}" fill="${STAHL}"/><ellipse cx="${c[0]}" cy="${c[1]}" rx="${r(rx * 0.2)}" ry="${r(ry * 0.2)}" fill="#6d757c"/>`;
    return g;
  };
  k += rad(14.6) + rad(20.7);
  /* Mitteltür (geschlossen) */
  k += poly(fX(X0, 18.9, 19.85, SPUR + 0.32, 3.2 + SPUR), "#2d3d4a");
  k += linie(P(X0, 19.37, SPUR + 0.32), P(X0, 19.37, 3.2 + SPUR), "#9aa3aa", ".5");
  /* Gepäckfächer: vorne zwei Klappen (eine offen), hinten eine */
  const klappe = (Za, Zb) => poly(fX(X0, Za, Zb, 0.42 + SPUR, 1.48 + SPUR), "none", ` stroke="#b5bcc2" stroke-width=".4"`);
  k += klappe(15.3, 16.95) + klappe(16.95, 18.6) + klappe(21.4, 23.6);
  const GF = { Za: 15.3, Zb: 16.95 };
  k += poly(fX(X0, GF.Za, GF.Zb, 0.42 + SPUR, 1.48 + SPUR), "#1d2125");
  /* Koffer im Gepäckfach */
  const kof = [[15.45, 15.95, 0.45, 1.1, "#b8473a"], [15.95, 16.6, 0.45, 0.95, "#2f5f95"], [16.6, 16.9, 0.45, 1.25, "#4f8a46"]];
  kof.forEach(([a, b, h0, h1, f]) => { k += poly(fX(X0 + 0.15, a, b, h0 + SPUR, h1 + SPUR), f); });
  /* offene Klappe, nach oben geschwenkt */
  k += poly([P(X0, GF.Za, 1.5 + SPUR), P(X0, GF.Zb, 1.5 + SPUR), P(X0 - 0.8, GF.Zb, 2.25 + SPUR), P(X0 - 0.8, GF.Za, 2.25 + SPUR)], S.lg("klappe", [[0, "#9aa3aa"], [1, "#c9d0d6"]]));
  k += linie(P(X0 - 0.8, GF.Za, 2.25 + SPUR), P(X0 - 0.8, GF.Zb, 2.25 + SPUR), "#eef1f3", ".6");
  k += linie(P(X0 - 0.4, (GF.Za + GF.Zb) / 2, 1.88 + SPUR), P(X0, (GF.Za + GF.Zb) / 2, 1.2 + SPUR), "#5b6670", ".5");
  /* Vordertür (offen, Treppe sichtbar) */
  k += poly(fX(X0, TUER.Z0, TUER.Z1, SPUR + 0.3, 3.25 + SPUR), "#151a1f");
  for (const h of [0.35, 0.62, 0.9]) k += poly(fX(X0 - 0.02, TUER.Z0 + 0.05, TUER.Z1 - 0.05, h + SPUR, h + 0.05 + SPUR), "#8d969e");
  k += poly(fX(X0 - 0.15, TUER.Z1 - 0.12, TUER.Z1, SPUR + 0.35, 3.15 + SPUR), "#3b4f60");
  k += poly(fX(X0, TUER.Z0 - 0.08, TUER.Z0, SPUR + 0.3, 3.25 + SPUR), "#c9d0d6");
  /* Fahrerfenster über/vor der Tür */
  k += poly(fX(X0, Z0 + 0.05, TUER.Z0 - 0.1, 1.4 + SPUR, 3.3 + SPUR), "#26323d");
  /* --- Stirnseite (Front) --- */
  const fr = (a, b, c, d, f, e = "") => poly(fZ(Z0, a, b, c, d), f, e);
  k += fr(X0, X1, H0, H1 - 0.1, S.lg("busfront", [[0, "#f6f8f9"], [1, "#d3d9de"]], 0, 0, 1, 0));
  k += poly([P(X0, Z0, H1 - 0.1), P(X1, Z0, H1 - 0.1), P(X1 - 0.15, Z0 + 0.15, H1), P(X0 + 0.15, Z0 + 0.15, H1)], "#e9edf0");
  k += fr(X0 + 0.12, X1 - 0.12, 1.25 + SPUR, 3.2 + SPUR, S.lg("scheibe", [[0, "#4d6577"], [0.5, "#24323d"], [1, "#33475a"]]));
  k += poly([P(X0 + 0.3, Z0, 3.1 + SPUR), P(X0 + 1.1, Z0, 3.1 + SPUR), P(X0 + 0.5, Z0, 1.4 + SPUR), P(X0 + 0.2, Z0, 1.4 + SPUR)], "#fff", ` opacity=".14"`);
  k += linie(P((X0 + X1) / 2, Z0, 1.25 + SPUR), P((X0 + X1) / 2, Z0, 3.2 + SPUR), "#c9d0d6", ".5");
  /* Scheibenwischer */
  for (const X of [X0 + 0.5, X0 + 1.5]) k += linie(P(X, Z0, 1.3 + SPUR), P(X + 0.6, Z0, 2.1 + SPUR), "#15181b", ".5");
  /* Zielanzeige: LED-Schrift */
  k += fr(X0 + 0.25, X1 - 0.25, 3.3 + SPUR, 3.62 + SPUR, "#121417");
  { const a = P(X0 + 0.32, Z0, 3.36 + SPUR), b = P(X1 - 0.32, Z0, 3.36 + SPUR); const s = r(0.2 * M(X0, Z0));
    k += T(a[0] + 0.6, a[1] - 0.5, s, "042", "#ffb21e", "start", "bold", "monospace") + T(b[0] - 0.6, b[1] - 0.5, s, "Leipzig", "#ffb21e", "end", "bold", "monospace"); }
  /* Scheinwerfer, Stoßfänger, Kennzeichen */
  k += fr(X0 + 0.1, X0 + 0.65, 0.62 + SPUR, 0.82 + SPUR, "#dfe9f0", ` stroke="#7d868d" stroke-width=".3"`) + fr(X1 - 0.65, X1 - 0.1, 0.62 + SPUR, 0.82 + SPUR, "#dfe9f0", ` stroke="#7d868d" stroke-width=".3"`);
  k += fr(X0, X1, H0, 0.5 + SPUR, "#3a3f44");
  k += fr((X0 + X1) / 2 - 0.26, (X0 + X1) / 2 + 0.26, 0.6 + SPUR, 0.72 + SPUR, "#fafafa", ` stroke="#222" stroke-width=".2"`);
  k += fr(X0 + 0.9, X1 - 0.9, 0.95 + SPUR, 1.05 + SPUR, "#1f5fa0");
  /* Außenspiegel an Bügeln (wie Fühler nach vorne) */
  for (const [Xb, Xs] of [[X0 + 0.05, X0 - 0.3], [X1 - 0.05, X1 + 0.3]]) {
    const a = P(Xb, Z0, 3.2 + SPUR), b = P(Xs, Z0 - 0.5, 3.3 + SPUR), c = P(Xs, Z0 - 0.6, 2.75 + SPUR);
    k += `<path d="M${a[0]} ${a[1]} Q${b[0]} ${r(b[1] - 3)} ${c[0]} ${r(c[1] - 4)}" stroke="#2b3036" stroke-width="1" fill="none"/>`;
    k += `<rect x="${r(c[0] - 1.6)}" y="${r(c[1] - 4.6)}" width="3.2" height="6.4" rx="1" fill="#2b3036"/><rect x="${r(c[0] - 1.1)}" y="${r(c[1] - 4)}" width="2.2" height="5" rx=".6" fill="#8fb2c9"/>`;
  }
  /* Lupe */
  const ff = (pts, pad = 0) => { const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]); return [Math.min(...xs) - pad, Math.min(...ys) - pad, Math.max(...xs) + pad, Math.max(...ys) + pad]; };
  const u = (id, de, syl, it, itSyl, en, box, tipp) => { const [x0, y0, x1, y1] = box, cx = r((x0 + x1) / 2); return { id, de, syl, it, itSyl, en, tipp, x: cx, y: r(y1), kunst: flaeche(x0 - cx, y0 - y1, x1 - x0, y1 - y0) }; };
  const sp = P(X0 - 0.3, Z0 - 0.6, 2.75 + SPUR);
  busUnter = [
    u("bb_gepaeckfach", "das Gepäckfach", "Ge-PÄCK-fach", "il bagagliaio", "ba-ga-GLIA-io", "luggage hold", ff([...fX(X0, GF.Za, GF.Zb, 0.42 + SPUR, 1.5 + SPUR), P(X0 - 0.8, GF.Za, 2.25 + SPUR), P(X0 - 0.8, GF.Zb, 2.25 + SPUR)]), "Die Klappe an der Seite. Jeder Koffer bekommt einen Aufkleber."),
    u("bb_tuer", "die Tür", "TÜR", "la porta", "POR-ta", "door", ff(fX(X0, TUER.Z0, TUER.Z1, SPUR + 0.3, 3.25 + SPUR)), "Vorne steigt man ein und zeigt dem Fahrer das Ticket."),
    u("bb_zielanzeige", "die Zielanzeige", "ZIEL-an-zei-ge", "l'indicatore di destinazione", "in-di-ca-TO-re di de-sti-na-ZIO-ne", "destination display", ff(fZ(Z0, X0 + 0.25, X1 - 0.25, 3.3 + SPUR, 3.62 + SPUR), 0.6), "Hier steht, wohin der Bus fährt."),
    u("bb_spiegel", "der Außenspiegel", "AU-ßen-spie-gel", "lo specchietto retrovisore", "spec-CHIET-to re-tro-vi-SO-re", "wing mirror", [sp[0] - 2.4, sp[1] - 6, sp[0] + 2.4, sp[1] + 2.4], null),
    u("bb_windschutzscheibe", "die Windschutzscheibe", "WIND-schutz-schei-be", "il parabrezza", "pa-ra-BREZ-za", "windscreen", ff(fZ(Z0, X0 + 0.12, X1 - 0.12, 1.25 + SPUR, 3.2 + SPUR)), null),
  ];
  const f = P((X0 + X1) / 2, Z0 + 3, SPUR);
  S.teil({ id: "bb_bus", de: "der Fernbus", syl: "FERN-bus", it: "il pullman", itSyl: "PULL-man", en: "coach", x: f[0], y: f[1], steht: true, kunst: absolut(f[0], f[1], k),
    zoom: { x: 150, y: 38, w: 126, h: 84 }, unter: busUnter,
    tipp: "Für lange Strecken. Billiger als der Zug, aber langsamer." });
}

/* =====================================================================
   5 — DER BUSSTEIG (Bordsteinkante, Leitstreifen, Markierung „B 3“)
   ===================================================================== */
{
  let k = "";
  /* Kantenstein (Kasseler Bord): Oberseite hell, Front zur Fahrbahn */
  k += poly([P(6.85, 3, 0), P(KANTE, 3, 0), P(KANTE, 40, 0), P(6.85, 40, 0)], "#e6e3dc");
  k += poly([P(KANTE, 3, 0), P(KANTE, 40, 0), P(KANTE, 40, SPUR), P(KANTE, 3, SPUR)], "#a9a59d");
  for (let Z = 3.5; Z < 40; Z += 1) k += linie(P(6.85, Z), P(KANTE, Z), "#bdb9b1", ".25");
  /* Bussteignummer auf dem Pflaster */
  { const X = 4.6, Z = 7.2, o = P(X, Z), ex = P(X + 1, Z), ez = P(X, Z + 1);
    const a = r(ex[0] - o[0]), b = r(ex[1] - o[1]), c = r(o[0] - ez[0]), d = r(o[1] - ez[1]);
    k += `<g transform="matrix(${a / 10} ${b / 10} ${c / 10} ${d / 10} ${o[0]} ${o[1]})"><rect x="0" y="-12" width="13" height="12" rx="1" fill="#1f4f8c"/><text x="6.5" y="-2.4" font-size="9" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">B3</text></g>`; }
  const f = P(KANTE, 9);
  S.teil({ id: "bb_bussteig", de: "der Bussteig", syl: "BUS-steig", it: "la banchina", itSyl: "ban-CHI-na", en: "bus bay", x: f[0], y: f[1], kunst: absolut(f[0], f[1], k),
    tipp: "Jeder Bussteig hat eine Nummer: B 1, B 2, B 3. Auf dem Ticket steht keine — man muss auf die Tafel sehen." });
}

/* =====================================================================
   6 — DAS WARTEHÄUSCHEN (Glas, offen zur Kamera, Bank, Fahrplan,
       Mülleimer) — Lupe — darin sitzt DIE REISENDE
   ===================================================================== */
const WH = { X0: -0.6, X1: 1.1, Z0: 8.6, Z1: 10.0, H: 2.45 };
let bankUnter = null;
{
  const { X0, X1, Z0, Z1, H } = WH;
  let k = "";
  const f0 = P((X0 + X1) / 2, Z0);
  k += poly([P(X0, Z0, 0), P(X1, Z0, 0), P(X1, Z1, 0), P(X0, Z1, 0)], "#000", ` opacity=".1"`);
  /* Rückwand und linke Wand aus Glas (Innenseiten sichtbar) */
  k += poly(fZ(Z1, X0, X1, 0.1, H - 0.1), S.lg("rueckglas", [[0, "#d6e6ef", 0.55], [1, "#b8cfdc", 0.45]]));
  k += poly(fX(X0, Z0, Z1, 0.1, H - 0.1), "#c5d9e4", ` opacity=".5"`);
  /* Werbevitrine (City-Light) an der linken Wand */
  k += poly(fX(X0 + 0.02, Z0 + 0.15, Z1 - 0.15, 0.4, 2.1), S.lg("plakat", [[0, "#ffe9b0"], [1, "#f2b45a"]]));
  /* FAHRPLAN-Aushang an der Rückwand rechts */
  const fp = fZ(Z1 - 0.02, X1 - 0.75, X1 - 0.12, 1.05, 1.95);
  k += poly(fp, "#ffffff", ` stroke="#9aa3aa" stroke-width=".3"`);
  { const a = fp[0], b = fp[2], w = b[0] - a[0], h = b[1] - a[1];
    k += `<rect x="${a[0]}" y="${a[1]}" width="${r(w)}" height="${r(h * 0.16)}" fill="${GRUEN}"/>` + T(a[0] + w / 2, a[1] + h * 0.12, r(h * 0.1), "Fahrplan", "#fff", "middle", "bold");
    for (let i = 0; i < 9; i++) { const y = a[1] + h * (0.26 + i * 0.08); k += `<rect x="${r(a[0] + w * 0.08)}" y="${r(y)}" width="${r(w * 0.18)}" height="${r(h * 0.03)}" fill="#444"/><rect x="${r(a[0] + w * 0.32)}" y="${r(y)}" width="${r(w * (0.3 + (i % 3) * 0.1))}" height="${r(h * 0.03)}" fill="#888"/>`; } }
  /* BANK an der Rückwand: Holzlatten auf Stahlfüßen */
  const bz0 = Z1 - 0.45, bz1 = Z1 - 0.05, bx0 = X0 + 0.15, bx1 = X1 - 0.15;
  for (const X of [bx0 + 0.1, bx1 - 0.1]) k += poly(fZ(bz0 + 0.05, X - 0.03, X + 0.03, 0, 0.42), "#46505a");
  k += poly([P(bx0, bz0, 0.45), P(bx1, bz0, 0.45), P(bx1, bz1, 0.45), P(bx0, bz1, 0.45)], S.lg("bank", [[0, "#9a6436"], [1, "#c48a52"]]));
  k += poly(fZ(bz0, bx0, bx1, 0.4, 0.45), "#6e4423");
  for (let i = 1; i < 4; i++) { const Z = bz0 + i * 0.1; k += linie(P(bx0, Z, 0.45), P(bx1, Z, 0.45), "#7a4d28", ".3"); }
  /* Pfosten, Dach mit Kante */
  for (const [X, Z] of [[X0, Z0], [X1, Z0], [X1, Z1]]) k += poly(fZ(Z, X - 0.04, X + 0.04, 0, H), "#4f5a64");
  k += poly([P(X0 - 0.15, Z0 - 0.2, H), P(X1 + 0.15, Z0 - 0.2, H), P(X1 + 0.15, Z1 + 0.1, H), P(X0 - 0.15, Z1 + 0.1, H)], "#9fb7c6");
  k += poly(fZ(Z0 - 0.2, X0 - 0.15, X1 + 0.15, H, H + 0.16), S.lg("whdach", [[0, "#5b6670"], [1, "#3b4148"]]));
  k += poly(fX(X1 + 0.15, Z0 - 0.2, Z1 + 0.1, H, H + 0.16), "#6d7881");
  /* rechte Seitenwand: halbe Glasscheibe (Windschutz) */
  k += poly(fX(X1, Z1 - 0.7, Z1, 0.15, H - 0.15), "#d6e6ef", ` opacity=".35" stroke="#7d868d" stroke-width=".3"`);
  /* MÜLLEIMER am rechten vorderen Pfosten */
  const mp = P(X1 + 0.22, Z0 + 0.05, 0), mm = M(X1 + 0.22, Z0 + 0.05);
  k += `<rect x="${r(mp[0] - 0.2 * mm)}" y="${r(mp[1] - 0.9 * mm)}" width="${r(0.4 * mm)}" height="${r(0.62 * mm)}" rx="1.2" fill="${S.lg("muell", [[0, "#2f7a45"], [1, "#1f5a33"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${r(mp[0] - 0.22 * mm)}" y="${r(mp[1] - 0.94 * mm)}" width="${r(0.44 * mm)}" height="${r(0.09 * mm)}" rx=".8" fill="#164428"/><rect x="${r(mp[0] - 0.1 * mm)}" y="${r(mp[1] - 0.82 * mm)}" width="${r(0.2 * mm)}" height="${r(0.05 * mm)}" fill="#0c2414"/>`;
  k += `<rect x="${r(mp[0] - 0.03 * mm)}" y="${r(mp[1] - 0.28 * mm)}" width="${r(0.06 * mm)}" height="${r(0.28 * mm)}" fill="#5b6670"/>`;
  k += schatten(mp[0], mp[1], 0.3 * mm, 0.06 * mm, 0.3);
  const box = (pts) => { const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]); return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]; };
  const un = (id, de, syl, it, itSyl, en, b, tipp) => { const cx = r((b[0] + b[2]) / 2); return { id, de, syl, it, itSyl, en, tipp, x: cx, y: r(b[3]), kunst: flaeche(b[0] - cx, b[1] - b[3], b[2] - b[0], b[3] - b[1]) }; };
  /* Bank: nur das rechte Ende, wo niemand sitzt, zählt als Fläche */
  const bb = box([P(X1 - 0.75, bz0, 0.45), P(bx1, bz0, 0), P(bx1, bz1, 0.46)]);
  const unter = [
    un("bb_fahrplan", "der Fahrplan", "FAHR-plan", "l'orario", "o-RA-rio", "timetable", box(fp), "Der gedruckte Plan im Wartehäuschen — für die, die kein Handy dabei haben."),
    un("bb_bank", "die Bank", "BANK", "la panchina", "pan-CHI-na", "bench", [bb[0], bb[1] - 1, bb[2], bb[3]], "Auf der Bank im Wartehäuschen bleibt man trocken."),
    un("bb_muelleimer", "der Mülleimer", "MÜLL-ei-mer", "il cestino", "ce-STI-no", "bin", [mp[0] - 0.24 * mm, mp[1] - 0.96 * mm, mp[0] + 0.24 * mm, mp[1]], null),
  ];
  S.teil({ id: "bb_wartehaeuschen", de: "das Wartehäuschen", syl: "WAR-te-häus-chen", it: "la pensilina d'attesa", itSyl: "pen-si-LI-na d'at-TE-sa", en: "bus shelter", x: f0[0], y: f0[1], steht: true, kunst: absolut(f0[0], f0[1], k),
    zoom: { x: 0, y: 84, w: 102, h: 68 }, unter,
    tipp: "Im Wartehäuschen wartet man geschützt vor Wind und Regen." });
}
{
  /* DIE REISENDE sitzt auf der Bank (links), die Bank bleibt rechts frei */
  const X = WH.X0 + 0.6, Z = WH.Z1 - 0.32, p = P(X, Z, 0);
  const m = B.mensch({ id: "bb_reisende", geschlecht: "w", pose: "sitzen", blick: 18, frisur: "zopf", haarfarbe: "dunkelbraun", haut: "mittel",
    kleidung: { oberteil: { stueck: "pullover", farbe: "gelb" }, jacke: { stueck: "jacke", farbe: "gruen_d" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "stiefel" }, zubehoer: { stueck: "schal", farbe: "#b8473a" } } }, 1.66 * M(X, Z));
  S.teil({ id: "bb_reisende", de: "die Reisende", syl: "REI-sen-de", it: "la viaggiatrice", itSyl: "viag-gia-TRI-ce", en: "traveller", x: p[0], y: p[1], kunst: m.svg,
    tipp: "Sie hat ihr Ticket auf dem Handy und wartet auf den Bus." });
}
/* =====================================================================
   7 — DAS HALTESTELLENSCHILD (grünes H auf gelbem Kreis)
   ===================================================================== */
{
  const X = 2.45, Z = 8.6, m = M(X, Z), p = P(X, Z);
  let k = schatten(0, 0, 0.3 * m, 0.07 * m, 0.3);
  k += `<rect x="${r(-0.04 * m)}" y="${r(-2.55 * m)}" width="${r(0.08 * m)}" height="${r(2.55 * m)}" fill="${S.lg("mast", [[0, "#9aa3aa"], [0.5, "#e1e5e8"], [1, "#7d868d"]], 0, 0, 1, 0)}"/>`;
  const R = 0.23 * m, cy = -2.4 * m;
  k += `<circle cy="${r(cy)}" r="${r(R)}" fill="${GELB}" stroke="${GRUEN}" stroke-width="${r(0.035 * m)}"/>`;
  k += T(0, cy + R * 0.48, r(R * 1.35), "H", GRUEN, "middle", "bold");
  /* darunter das Haltestellen-Täfelchen mit Name und Linie */
  k += `<rect x="${r(-0.24 * m)}" y="${r(-2.12 * m)}" width="${r(0.48 * m)}" height="${r(0.34 * m)}" rx=".5" fill="#ffffff" stroke="${GRUEN}" stroke-width=".3"/>`;
  k += T(0, -2.0 * m, r(0.06 * m), "ZOB · Bussteig B3", "#222", "middle", "bold") + `<rect x="${r(-0.17 * m)}" y="${r(-1.94 * m)}" width="${r(0.15 * m)}" height="${r(0.1 * m)}" fill="#ffb21e"/>` + T(-0.095 * m, -1.865 * m, r(0.07 * m), "042", "#222", "middle", "bold");
  S.teil({ id: "bb_haltestellenschild", de: "das Haltestellenschild", syl: "HAL-te-stel-len-schild", it: "il cartello della fermata", itSyl: "car-TEL-lo del-la fer-MA-ta", en: "bus stop sign", x: p[0], y: p[1], steht: true, kunst: k + flaeche(-0.12 * m, -2.6 * m, 0.24 * m, 2.6 * m),
    tipp: "Das grüne H auf gelbem Grund heißt: Hier hält der Bus." });
}

/* =====================================================================
   8 — DER FAHRER (in der vorderen Tür) und 9 — DER REISENDE mit Ticket
   ===================================================================== */
{
  const p = P(BUS.X0 + 0.15, (TUER.Z0 + TUER.Z1) / 2, SPUR + 0.32);
  const m = B.mensch({ id: "bb_fahrer", geschlecht: "m", pose: "stehen", blick: -35, frisur: "kurz", haarfarbe: "dunkelbraun", haut: "hell",
    kleidung: { oberteil: { stueck: "hemd", farbe: "hellblau" }, unterteil: { stueck: "anzughose" }, jacke: { stueck: "weste", farbe: "#1f3a5f" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" } } }, 1.8 * M(BUS.X0, TUER.Z0));
  S.teil({ id: "bb_fahrer", de: "der Busfahrer", syl: "BUS-fah-rer", it: "l'autista", itSyl: "au-TI-sta", en: "coach driver", x: p[0], y: p[1], kunst: m.svg,
    tipp: "Er kontrolliert die Tickets an der Tür und lädt das Gepäck ein." });
}
let ticketHand = null;
{
  const X = 6.2, Z = 11.4, p = P(X, Z);
  const m = B.mensch({ id: "bb_reisender", geschlecht: "m", pose: "servieren", blick: 70, frisur: "kurz", haarfarbe: "blond", haut: "hell",
    kleidung: { oberteil: { stueck: "pullover", farbe: "grau" }, jacke: { stueck: "jacke", farbe: "rot" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" }, zubehoer: { stueck: "rucksack", farbe: "#35506e" } } }, 1.78 * M(X, Z));
  const hand = [m.z.handL, m.z.handR].filter(Boolean).sort((a, b) => (a.y != null ? a.y : a[1]) - (b.y != null ? b.y : b[1]))[0];
  if (hand) ticketHand = [p[0] + (hand.x != null ? hand.x : hand[0]) * m.k, p[1] + (hand.y != null ? hand.y : hand[1]) * m.k];
  S.teil({ id: "bb_reisender", de: "der Reisende", syl: "REI-sen-de", it: "il viaggiatore", itSyl: "viag-gia-TO-re", en: "traveller", x: p[0], y: p[1], kunst: m.svg,
    tipp: "Er fragt den Fahrer, ob das der Bus nach Leipzig ist." });
}
{
  const t = ticketHand || [200, 110];
  let k = `<g transform="rotate(-10)"><rect x="-3.4" y="-2.2" width="6.8" height="3.6" rx=".3" fill="#ffffff" stroke="#9aa3aa" stroke-width=".15"/><rect x="-3.4" y="-2.2" width="6.8" height=".9" fill="#1f5fa0"/><rect x="1.2" y="-1" width="1.8" height="1.8" fill="#333"/><path d="M-2.8 -.6 h3 M-2.8 .3 h2.4" stroke="#666" stroke-width=".25"/></g>`;
  S.teil({ oben: true, id: "bb_ticket", de: "das Busticket", syl: "BUS-ti-cket", it: "il biglietto", itSyl: "bi-GLIET-to", en: "coach ticket", x: r(t[0] + 2), y: r(t[1] - 1.6), kunst: k + flaeche(-4.5, -3.5, 9, 6),
    tipp: "Auf dem Handy oder ausgedruckt — beides geht." });
}

/* =====================================================================
   10 — DER KOFFER (neben dem Wartehäuschen)
   ===================================================================== */
{
  const X = 1.65, Z = 7.6, p = P(X, Z), m = M(X, Z);
  const w = 0.46 * m, h = 0.7 * m, d = 0.26 * m * 0.35;
  let k = schatten(1, 0, w / 2 + 2, 1, 0.3);
  k += `<path d="M${r(w / 2)} ${r(-h + 1)} L${r(w / 2 + d)} ${r(-h)} L${r(w / 2 + d)} -1.4 L${r(w / 2)} 0 Z" fill="#6b2a22"/>`;
  k += `<rect x="${r(-w / 2)}" y="${r(-h)}" width="${r(w)}" height="${r(h)}" rx="2.2" fill="${S.lg("koffer", [[0, "#d8584a"], [0.5, "#b8473a"], [1, "#8e3328"]], 0, 0, 1, 0)}"/>`;
  for (const t of [-0.3, -0.1, 0.1, 0.3]) k += `<rect x="${r(t * w - 0.5)}" y="${r(-h + 1.8)}" width="1" height="${r(h - 3.6)}" rx=".5" fill="#fff" opacity=".14"/>`;
  k += `<rect x="-3.4" y="${r(-h - 14)}" width=".9" height="14" fill="${STAHL}"/><rect x="2.5" y="${r(-h - 14)}" width=".9" height="14" fill="${STAHL}"/><rect x="-4" y="${r(-h - 15.4)}" width="8" height="2" rx=".9" fill="#1e2226"/>`;
  k += `<circle cx="${r(-w / 2 + 1.6)}" cy="0" r="1.3" fill="#15181b"/><circle cx="${r(w / 2 - 1.6)}" cy="0" r="1.3" fill="#15181b"/>`;
  k += `<rect x="${r(w / 2 - 6)}" y="${r(-h + 4)}" width="4" height="6" rx=".4" fill="#f5f2e6" transform="rotate(8 ${r(w / 2 - 4)} ${r(-h + 7)})"/>`;
  S.teil({ id: "bb_koffer", de: "der Koffer", syl: "KOF-fer", it: "la valigia", itSyl: "va-LI-gia", en: "suitcase", x: p[0], y: p[1], steht: true, kunst: k,
    tipp: "Großes Gepäck kommt unten in die Klappe, kleines nimmt man mit hinein." });
}

/* =====================================================================
   12 — DER FAHRKARTENAUTOMAT (vorne rechts am Bussteig)
   ===================================================================== */
{
  const X = 6.0, Z = 6.1, p = P(X, Z), m = M(X, Z);
  const w = 0.62 * m, h = 1.78 * m, d = 0.3 * m * 0.36;
  let k = schatten(0, 0, w * 0.7, 1.2, 0.35);
  /* Gehäuse mit sichtbarer linker Seite */
  k += `<path d="M${r(-w / 2)} 0 L${r(-w / 2 - d)} ${r(-d * 0.6)} L${r(-w / 2 - d)} ${r(-h + d * 0.2)} L${r(-w / 2)} ${r(-h)} Z" fill="#a8b0b6"/>`;
  k += `<rect x="${r(-w / 2)}" y="${r(-h)}" width="${r(w)}" height="${r(h)}" rx="1.4" fill="${S.lg("automat", [[0, "#e6eaec"], [1, "#b9c1c7"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${r(-w / 2)}" y="${r(-h)}" width="${r(w)}" height="${r(0.14 * m)}" rx="1.4" fill="${GRUEN}"/>` + T(0, -h + 0.1 * m, r(0.08 * m), "Fahrkarten · Tickets", "#fff", "middle", "bold");
  /* Bildschirm, Tasten, Kartenleser, Münzschlitz, Ausgabe */
  k += `<rect x="${r(-w * 0.38)}" y="${r(-h + 0.24 * m)}" width="${r(w * 0.76)}" height="${r(0.42 * m)}" rx=".8" fill="#1a1d21"/>`;
  k += `<rect x="${r(-w * 0.34)}" y="${r(-h + 0.27 * m)}" width="${r(w * 0.68)}" height="${r(0.36 * m)}" fill="${S.lg("bild", [[0, "#4b8fd0"], [1, "#2a5d96"]])}"/>`;
  for (let i = 0; i < 4; i++) k += `<rect x="${r(-w * 0.3)}" y="${r(-h + 0.31 * m + i * 0.08 * m)}" width="${r(w * 0.6)}" height="${r(0.055 * m)}" rx=".4" fill="#fff" opacity="${i === 0 ? 0.9 : 0.55}"/>`;
  k += `<rect x="${r(-w * 0.36)}" y="${r(-h + 0.76 * m)}" width="${r(w * 0.3)}" height="${r(0.2 * m)}" rx=".6" fill="#2b3036"/><rect x="${r(-w * 0.3)}" y="${r(-h + 0.8 * m)}" width="${r(w * 0.18)}" height="${r(0.03 * m)}" fill="#7d868d"/>`;
  k += `<rect x="${r(w * 0.06)}" y="${r(-h + 0.76 * m)}" width="${r(w * 0.3)}" height="${r(0.2 * m)}" rx=".6" fill="#2b3036"/><circle cx="${r(w * 0.21)}" cy="${r(-h + 0.86 * m)}" r="${r(0.04 * m)}" fill="#c9a227"/>`;
  k += `<rect x="${r(-w * 0.3)}" y="${r(-h + 1.12 * m)}" width="${r(w * 0.6)}" height="${r(0.16 * m)}" rx=".8" fill="#15181b"/>`;
  k += `<rect x="${r(-w / 2 + 1)}" y="${r(-h + 1)}" width="1.6" height="${r(h - 2)}" rx=".8" fill="#fff" opacity=".25"/>`;
  S.teil({ id: "bb_automat", de: "der Fahrkartenautomat", syl: "FAHR-kar-ten-au-to-mat", it: "la biglietteria automatica", itSyl: "bi-gliet-te-RI-a au-to-MA-ti-ca", en: "ticket machine", x: p[0], y: p[1], steht: true, kunst: k,
    tipp: "Am Automaten zahlt man mit Karte oder Bargeld." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/busbahnhof.js"));
console.log(aus);
