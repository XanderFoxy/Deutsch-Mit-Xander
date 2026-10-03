#!/usr/bin/env node
/* =====================================================================
   PFLEGE & HYGIENE (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   Die alten Wörter (Shampoo, Zahnbürste, Rasierer, Föhn, Handtuch …)
   sind KÖRPERPFLEGE, nicht Altenpflege → der echte Ort ist der
   Waschplatz im Badezimmer einer Wohnung.
   RECHERCHE (megabad-Magazin „modernes Badezimmer“, Hausbau-Forum
   Badplanung, Houzz „offene Dusche mit Wandnische“):
   - WASCHTISCH mit Keramikbecken auf einem WANDHÄNGENDEN UNTERSCHRANK
     mit Auszügen (Boden bleibt frei), Einhebel-Mischer (WASSERHAHN).
   - Darüber der SPIEGELSCHRANK (Breite wie der Waschtisch, LED-Licht
     oben); drinnen auf Glasböden Rasierer, Rasierschaum, Deo, Cremes,
     Zahnseide, Wattestäbchen, Nagelschere, Kamm.
   - Auf der Waschtischplatte: Seifenspender (Flüssigseife), Seifenschale,
     Zahnputzbecher mit Zahnbürsten, Zahnpasta, Taschentuchbox.
   - Links der HANDTUCHHEIZKÖRPER (Leiterform) mit Handtuch und
     Waschlappen, daneben der Föhn in der Wandhalterung.
   - Rechts die BODENGLEICHE DUSCHE hinter einer Glaswand, Thermostat,
     Brausestange, WANDNISCHE mit Shampoo und Duschgel.
   - Fliesen: große, helle Wandfliesen, Bodenfliesen grau, davor ein
     Badvorleger.
   PERSPEKTIVE: Fluchtpunkt (160 | 50), Augenhöhe 1,6 m, Brennweite 192.
   Rückwand 3 m entfernt (64 Einheiten je Meter), Waschtisch-Vorderkante
   2,5 m (≈ 77 je Meter). Niemand im Bild — der Ort steht im Mittelpunkt.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "pflege", titel: "Pflege & Hygiene", emoji: "🧴", thema: "Gesundheit", kuerzel: "b16c", fassung: 852 });
const rnd = zufall(4711);
const r = B.r;

const F = 192, CAM = 1.6, HZ = 50, VX = 160;
const P = (X, Y, Z) => [r(VX + F * X / Z), r(HZ + F * (CAM - Y) / Z)];
const s = (Z) => F / Z;
const boden = (Z) => HZ + F * CAM / Z;
const poly = (pts, fill, extra = "") => `<path d="M${pts.map((p) => p.join(" ")).join(" L")} Z" fill="${fill}"${extra}/>`;
function quader(X0, X1, Y0, Y1, Z0, Z1, farben, ox = 0, oy = 0) {
  const q = (X, Y, Z) => { const [x, y] = P(X, Y, Z); return [r(x - ox), r(y - oy)]; };
  let g = "";
  if (Y1 < CAM && farben.oben) g += poly([q(X0, Y1, Z0), q(X1, Y1, Z0), q(X1, Y1, Z1), q(X0, Y1, Z1)], farben.oben);
  if (Y0 > CAM && farben.unten) g += poly([q(X0, Y0, Z0), q(X1, Y0, Z0), q(X1, Y0, Z1), q(X0, Y0, Z1)], farben.unten);
  if (X1 < 0 && farben.seite) g += poly([q(X1, Y0, Z0), q(X1, Y0, Z1), q(X1, Y1, Z1), q(X1, Y1, Z0)], farben.seite);
  if (X0 > 0 && farben.seite) g += poly([q(X0, Y0, Z0), q(X0, Y0, Z1), q(X0, Y1, Z1), q(X0, Y1, Z0)], farben.seite);
  g += poly([q(X0, Y0, Z0), q(X1, Y0, Z0), q(X1, Y1, Z0), q(X0, Y1, Z0)], farben.vorne);
  return g;
}

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const CHROM = S.lg("chrom", [[0, "#f4f6f7"], [0.4, "#b7bfc5"], [0.6, "#8e979e"], [1, "#e3e7ea"]], 0, 0, 1, 0);
const CHROM_H = S.lg("chromh", [[0, "#f4f6f7"], [0.5, "#a9b2b8"], [1, "#e3e7ea"]]);
const EICHE = S.lg("eiche", [[0, "#c9a57a"], [1, "#b08a5c"]]);
const KERAMIK = S.lg("keramik", [[0, "#ffffff"], [1, "#e6e9eb"]]);

const ZW = 3.0, GW = boden(ZW), SW = s(ZW);          // Rückwand: Boden bei y ≈ 152
const WT = { X0: -1.25, X1: 0.15, Z0: 2.5, Z1: ZW, Yo: 0.85, Yu: 0.35 };
const DX = 0.62;                                     // Duschbereich beginnt

/* =====================================================================
   KULISSE — Wand (oben gestrichen, unten Fliesen), Boden, Dusche hinten
   ===================================================================== */
{
  let k = `<rect width="320" height="${r(GW)}" fill="${S.lg("wand", [[0, "#eef0ec"], [1, "#e3e6e1"]])}"/>`;
  k += `<rect width="320" height="${r(GW)}" fill="${S.rg("licht", [[0, "#fffdf3", 0.6], [1, "#fffdf3", 0]], 0.38, 0.12, 0.6)}"/>`;
  /* Wandfliesen 30×60 bis 1,25 m hinter dem Waschtisch, in der Dusche raumhoch */
  const fl = (x0, x1, Y1, farbe, fuge) => {
    let g = "";
    const [, yo] = P(0, Y1, ZW);
    g += `<rect x="${r(x0)}" y="${r(yo)}" width="${r(x1 - x0)}" height="${r(GW - yo)}" fill="${farbe}"/>`;
    for (let Y = 0.3; Y < Y1; Y += 0.3) { const [, y] = P(0, Y, ZW); g += `<rect x="${r(x0)}" y="${r(y)}" width="${r(x1 - x0)}" height=".35" fill="${fuge}"/>`; }
    for (let X = -2.5; X < 2.6; X += 0.6) { const [x] = P(X, 0, ZW); if (x > x0 && x < x1) g += `<rect x="${r(x)}" y="${r(yo)}" width=".35" height="${r(GW - yo)}" fill="${fuge}"/>`; }
    return g;
  };
  k += fl(0, P(DX, 0, ZW)[0], 1.25, "#f4f3ef", "#d9d7d0");
  k += `<rect x="0" y="${r(P(0, 1.25, ZW)[1] - 0.8)}" width="${r(P(DX, 0, ZW)[0])}" height="1.2" fill="${CHROM_H}"/>`;
  k += fl(P(DX, 0, ZW)[0], 320, 3, S.lg("duschwand", [[0, "#c9cbc8"], [1, "#b3b6b2"]]), "#9a9d99");
  /* Boden: große graue Fliesen in Fluchtperspektive */
  k += `<rect x="0" y="${r(GW)}" width="320" height="${r(200 - GW)}" fill="${S.lg("boden", [[0, "#9ea2a3"], [1, "#b6babb"]])}"/>`;
  for (const Z of [2.7, 2.4, 2.1]) k += `<rect x="0" y="${r(boden(Z))}" width="320" height=".4" fill="#7f8486"/>`;
  for (let X = -3; X <= 3; X += 0.6) { const a = P(X, 0, ZW), b = P(X, 0, 1.9); k += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#7f8486" stroke-width=".4"/>`; }
  k += `<rect x="0" y="${r(GW)}" width="320" height="${r(200 - GW)}" fill="${S.lg("bodenglanz", [[0, "#fff", 0.12], [0.5, "#fff", 0], [1, "#000", 0.06]])}"/>`;
  /* Sockel unter den Fliesen, Schatten an der Wand */
  k += `<rect x="0" y="${r(GW - 1)}" width="320" height="1" fill="#8f9394"/>`;
  /* Duschbereich: Ablaufrinne im Boden, Thermostat, Brausestange, Regenbrause */
  const [rx0] = P(DX + 0.1, 0, 2.95), [rx1, ry] = P(2.6, 0, 2.95);
  k += `<rect x="${rx0}" y="${r(ry - 1.2)}" width="${r(rx1 - rx0)}" height="1.4" fill="${CHROM_H}"/>`;
  { const [x, y] = P(1.55, 1.05, ZW);
    k += `<rect x="${r(x - 9)}" y="${r(y - 3)}" width="18" height="6" rx="3" fill="${CHROM_H}"/><circle cx="${r(x - 7)}" cy="${r(y)}" r="3.2" fill="${CHROM}"/><circle cx="${r(x + 7)}" cy="${r(y)}" r="3.2" fill="${CHROM}"/><rect x="${r(x - 7.4)}" y="${r(y - 3.2)}" width=".8" height="2.4" fill="#d23b30"/>`;
    const [, yt] = P(0, 2.15, ZW); k += `<rect x="${r(x + 13)}" y="${r(yt)}" width="1.6" height="${r(y - yt)}" fill="${CHROM}"/><rect x="${r(x + 12)}" y="${r(y - 1)}" width="3.6" height="2" rx=".5" fill="${CHROM_H}"/>`;
    k += `<path d="M${r(x - 2)} ${r(y + 3)} q-2 8 4 10 q6 2 10 -4 l4 -26" stroke="#c9cdd0" stroke-width="1.1" fill="none"/>`;
    k += `<rect x="${r(x + 11)}" y="${r(yt + 6)}" width="5.6" height="3" rx=".6" fill="${CHROM_H}"/><ellipse cx="${r(x + 18)}" cy="${r(yt + 2)}" rx="3.4" ry="5" fill="${CHROM}" transform="rotate(-25 ${r(x + 18)} ${r(yt + 2)})"/>`;
    const [x2, y2] = P(1.55, 2.3, 2.75); k += `<rect x="${r(x2 - 0.7)}" y="0" width="1.4" height="${r(y2)}" fill="${CHROM}"/><rect x="${r(x2 - 14)}" y="${r(y2)}" width="28" height="2.4" rx=".8" fill="${CHROM_H}"/><rect x="${r(x2 - 14)}" y="${r(y2 + 2.2)}" width="28" height=".8" fill="#7a8288"/>`; }
  /* Fenster oben links (Milchglas) */
  { const [x0, y0] = P(-2.35, 2.3, ZW), [x1, y1] = P(-1.55, 1.7, ZW);
    k += `<rect x="${r(x0 - 2)}" y="${r(y0 - 2)}" width="${r(x1 - x0 + 4)}" height="${r(y1 - y0 + 5)}" fill="#f8f8f5"/><rect x="${r(x0)}" y="${r(y0)}" width="${r(x1 - x0)}" height="${r(y1 - y0)}" fill="${S.lg("milchglas", [[0, "#eaf2f5"], [1, "#cfdce2"]], 0, 0, 1, 1)}"/>`;
    for (let i = 0; i < 30; i++) k += `<circle cx="${r(x0 + rnd() * (x1 - x0))}" cy="${r(y0 + rnd() * (y1 - y0))}" r=".5" fill="#fff" opacity=".6"/>`;
    k += `<rect x="${r(x0 - 3)}" y="${r(y1 + 0.5)}" width="${r(x1 - x0 + 6)}" height="2" fill="#e2e2dd"/>`; }
  S.hinten(k);
}

/* =====================================================================
   1 — DER HANDTUCHHEIZKÖRPER mit 2 — HANDTUCH und 3 — WASCHLAPPEN
   ===================================================================== */
const HK = { X0: -2.35, X1: -1.85, Y0: 0.22, Y1: 1.45, Z: 2.9 };
{
  const [x0, y1] = P(HK.X0, HK.Y0, HK.Z), [x1, y0] = P(HK.X1, HK.Y1, HK.Z), ox = (x0 + x1) / 2, oy = y1;
  let k = "";
  const L = r(x0 - ox), R = r(x1 - ox), T = r(y0 - oy);
  k += `<rect x="${L}" y="${T}" width="2.4" height="${r(-T)}" rx="1" fill="#f6f6f4" stroke="#d5d5d0" stroke-width=".3"/><rect x="${r(R - 2.4)}" y="${T}" width="2.4" height="${r(-T)}" rx="1" fill="#f6f6f4" stroke="#d5d5d0" stroke-width=".3"/>`;
  const sprossen = [0.04, 0.1, 0.16, 0.22, 0.38, 0.44, 0.5, 0.56, 0.72, 0.78, 0.84, 0.92];
  for (const t of sprossen) k += `<rect x="${L}" y="${r(T * (1 - t) - 0.8)}" width="${r(R - L)}" height="1.6" rx=".8" fill="${S.lg("sprosse", [[0, "#ffffff"], [1, "#dcdcd7"]])}"/>`;
  k += `<rect x="${r(L + 0.8)}" y="0" width="1" height="3" fill="#e9e9e5"/><circle cx="${r(L + 1.3)}" cy="2.6" r="1.2" fill="${CHROM}"/>`;
  S.teil({ id: "handtuchheizkoerper", de: "der Handtuchheizkörper", syl: "HAND-tuch-heiz-kör-per", it: "lo scaldasalviette", itSyl: "scal-da-sal-VIET-te", en: "towel radiator", x: ox, y: oy, kunst: k,
    tipp: "Am Handtuchheizkörper trocknen die Handtücher schnell." });
  HK.ox = ox; HK.oy = oy; HK.w = R - L; HK.T = T;
}
{
  /* Handtuch über die obere Sprossengruppe gehängt, vorn länger */
  const w = HK.w + 2, y0 = HK.oy + HK.T * 0.84;
  let k = `<path d="M${r(-w / 2 + 1)} 0 L${r(w / 2 - 1)} 0 L${r(w / 2 - 1.4)} 22 L${r(-w / 2 + 1.4)} 22 Z" fill="#3f5b70"/>`;
  k += `<path d="M${r(-w / 2)} 0 Q0 -2.4 ${r(w / 2)} 0 Q${r(w / 2 + 0.6)} 15 ${r(w / 2 - 1.2)} 30 Q${r(w / 4)} 31.6 0 30.4 Q${r(-w / 4)} 31.8 ${r(-w / 2 + 0.6)} 30 Q${r(-w / 2 - 0.8)} 15 ${r(-w / 2)} 0 Z" fill="${S.lg("handtuch", [[0, "#7a99b1"], [0.35, "#5b7c96"], [0.7, "#6a8aa3"], [1, "#4b6a82"]], 0, 0, 1, 0)}"/>`;
  for (let i = 1; i < 6; i++) k += `<path d="M${r(-w / 2 + i * w / 6)} 1 L${r(-w / 2 + i * w / 6 + 0.3)} 29" stroke="#3f5b70" stroke-width=".35" opacity=".5"/>`;
  k += `<rect x="${r(-w / 2 + 0.6)}" y="25" width="${r(w - 1.2)}" height="2.4" fill="#e7edf1" opacity=".75"/><path d="M${r(-w / 2)} 0 Q0 -2.4 ${r(w / 2)} 0" stroke="#86a3b9" stroke-width="1" fill="none"/>`;
  S.teil({ id: "handtuch", de: "das Handtuch", syl: "HAND-tuch", it: "l'asciugamano", itSyl: "a-sciu-ga-MA-no", en: "towel", x: HK.ox, y: y0, kunst: k });
}
{
  const y0 = HK.oy + HK.T * 0.22;
  /* über die Sprosse gelegt: hinten kürzer, vorn länger, mit Aufhänger */
  let k = `<path d="M-4.2 0 L4.2 0 L4 5 L-4 5.4 Z" fill="#d79b22"/>`;
  k += `<path d="M-4.4 -.6 Q0 -1.6 4.4 -.6 L4.6 11.2 Q2 12.2 0 11.6 Q-2.4 12.4 -4.4 11.4 Z" fill="${S.lg("lappen", [[0, "#f7cf55"], [0.6, "#eab43a"], [1, "#d99c22"]], 0, 0, 1, 0)}"/>`;
  for (let y = 1.4; y < 11; y += 1.4) k += `<path d="M-4.2 ${y} Q0 ${r(y - 0.5)} 4.3 ${y}" stroke="#cf9420" stroke-width=".25" fill="none" opacity=".7"/>`;
  k += `<rect x="-4.4" y="9.4" width="9" height="1.2" fill="#fff3c4" opacity=".6"/><path d="M-4.4 -.6 Q0 -1.6 4.4 -.6" stroke="#ffe08a" stroke-width=".7" fill="none"/><path d="M3 -1 q1.6 -2.4 2.6 0" stroke="#d99c22" stroke-width=".5" fill="none"/>`;
  S.teil({ oben: true, id: "waschlappen", de: "der Waschlappen", syl: "WASCH-lap-pen", it: "il guanto da bagno", itSyl: "GUAN-to da BA-gno", en: "flannel", x: HK.ox + 1, y: y0, kunst: k });
}

/* =====================================================================
   4 — DER FÖHN in der Wandhalterung
   ===================================================================== */
{
  const [x, y] = P(-1.58, 1.18, 2.95);
  let k = `<rect x="-3" y="-2" width="6" height="7.5" rx="1" fill="#f2f2ef" stroke="#cfcfca" stroke-width=".3"/>`;
  /* Föhn kopfüber im Ring: Düse unten, Griff oben */
  k += `<rect x="-1.6" y="-11" width="3.2" height="10" rx="1.4" fill="${S.lg("foehngriff", [[0, "#3a3e44"], [1, "#1f2226"]], 0, 0, 1, 0)}"/><rect x="-.8" y="-8" width="1.6" height="2.2" rx=".4" fill="#e04a3f"/>`;
  k += `<rect x="-4.5" y="-.8" width="9" height="6.4" rx="3.2" fill="${S.lg("foehnkopf", [[0, "#4a4f56"], [1, "#25282c"]])}"/><rect x="3.8" y=".6" width="3.2" height="3.6" rx=".8" fill="#2b2e33"/><path d="M-3.2 0.6 L1.8 0.6" stroke="#fff" stroke-width=".5" opacity=".3"/>`;
  k += `<path d="M0 -11 q-1 -3 -4 -2 q-3 1 -2 5" stroke="#1d1f22" stroke-width=".7" fill="none"/>`;
  S.teil({ id: "foehn", de: "der Föhn", syl: "FÖHN", it: "il phon", itSyl: "FON", en: "hairdryer", x, y, kunst: k,
    tipp: "Den Föhn nie in der Nähe von Wasser benutzen!" });
}

/* =====================================================================
   5 — DER SPIEGELSCHRANK (rechte Tür offen) — Lupe mit den Pflegedingen
   ===================================================================== */
const spUnter = [];
{
  const Y0 = 1.2, Y1 = 1.9, Zv = 2.86, Zh = ZW - 0.01, Xm = (WT.X0 + WT.X1) / 2;
  const ox = P(Xm, 0, Zv)[0], oy = P(0, Y0, Zv)[1];
  const q = (X, Y, Z) => { const [x, y] = P(X, Y, Z); return [r(x - ox), r(y - oy)]; };
  let k = schatten(0, 0.8, 50, 1.6, 0.2);
  /* Korpus (Unterseite sichtbar, da unter Augenhöhe? nein — Unterseite liegt unter 1,6 m → Oberseite unsichtbar) */
  k += quader(WT.X0, WT.X1, Y0, Y1, Zv, Zh, { vorne: "#e9e8e3", seite: "#d3d1ca" }, ox, oy);
  /* Innenraum rechte Hälfte: Rückwand, Glasböden */
  const XI = Xm, a = q(XI, Y1 - 0.02, Zv), b = q(WT.X1 - 0.02, Y0 + 0.02, Zv);
  k += `<rect x="${a[0]}" y="${a[1]}" width="${r(b[0] - a[0])}" height="${r(b[1] - a[1])}" fill="${S.lg("innen", [[0, "#fbfbf8"], [1, "#e7e6e0"]])}"/>`;
  const boeden = [Y0 + 0.02, 1.43, 1.66];
  for (const Yb of boeden.slice(1)) { const p = q(XI, Yb, Zv); k += `<rect x="${p[0]}" y="${r(p[1] - 0.5)}" width="${r(b[0] - a[0])}" height="1.2" fill="#cfe3e6" opacity=".9"/><rect x="${p[0]}" y="${r(p[1] + 0.7)}" width="${r(b[0] - a[0])}" height=".4" fill="#9fb9be"/>`; }
  /* Dinge im Schrank (unten → oben), jeweils Mitte X, Boden Y */
  const sx = (t) => a[0] + (b[0] - a[0]) * t;
  const yb = (Yb) => q(0, Yb, Zv)[1];
  const dinge = [];
  /* unten: Rasierer, Kamm, Nagelschere */
  {
    const x = sx(0.18), y = yb(boeden[0]);
    let g = `<rect x="${r(x - 1.2)}" y="${r(y - 5)}" width="2.4" height="5" rx=".6" fill="#e9eef2" stroke="#b9c2c8" stroke-width=".2"/>`;
    g += `<rect x="${r(x - 0.6)}" y="${r(y - 11.5)}" width="1.2" height="7" rx=".5" fill="#2d6fb3"/><rect x="${r(x - 2.4)}" y="${r(y - 13)}" width="4.8" height="1.8" rx=".5" fill="#1d2a3a"/><rect x="${r(x - 2.2)}" y="${r(y - 12.7)}" width="4.4" height=".5" fill="#cfd5d9"/>`;
    k += g; dinge.push(["rasierer", "der Rasierer", "Ra-SIE-rer", "il rasoio", "ra-SO-io", "razor", x, y, 6, 13.5]);
  }
  {
    const x = sx(0.5), y = yb(boeden[0]);
    let g = `<rect x="${r(x - 5)}" y="${r(y - 2.4)}" width="10" height="2" rx=".4" fill="#4a3b31"/>`;
    for (let i = 0; i < 18; i++) g += `<rect x="${r(x - 4.8 + i * 0.55)}" y="${r(y - 1.6)}" width=".25" height="1.4" fill="#2b211a"/>`;
    k += g; dinge.push(["kamm", "der Kamm", "KAMM", "il pettine", "PET-ti-ne", "comb", x, y, 11, 6]);
  }
  {
    const x = sx(0.8), y = yb(boeden[0]);
    let g = `<circle cx="${r(x - 1.6)}" cy="${r(y - 1.4)}" r="1.3" fill="none" stroke="#c0392b" stroke-width=".6"/><circle cx="${r(x + 1.4)}" cy="${r(y - 1.4)}" r="1.3" fill="none" stroke="#c0392b" stroke-width=".6"/>`;
    g += `<path d="M${r(x - 0.6)} ${r(y - 2.2)} Q${r(x + 0.5)} ${r(y - 6)} ${r(x + 2.6)} ${r(y - 8.6)} M${r(x + 0.6)} ${r(y - 2.2)} Q${r(x)} ${r(y - 6)} ${r(x + 1.6)} ${r(y - 8.8)}" stroke="${CHROM}" stroke-width=".7" fill="none"/>`;
    k += g; dinge.push(["nagelschere", "die Nagelschere", "NA-gel-sche-re", "le forbicine", "for-bi-CI-ne", "nail scissors", x, y, 7, 10]);
  }
  /* Mitte: Deodorant, Rasierschaum, Zahnseide */
  {
    const x = sx(0.17), y = yb(boeden[1]) - 0.6;
    k += `<rect x="${r(x - 2.2)}" y="${r(y - 10)}" width="4.4" height="10" rx="1" fill="${S.lg("deo", [[0, "#1e4f8a"], [0.5, "#3c7cc4"], [1, "#163d6b"]], 0, 0, 1, 0)}"/><rect x="${r(x - 1.8)}" y="${r(y - 12.4)}" width="3.6" height="2.6" rx="1.2" fill="#e6eaee"/><rect x="${r(x - 2.2)}" y="${r(y - 6.4)}" width="4.4" height="2" fill="#fff" opacity=".85"/><text x="${r(x)}" y="${r(y - 4.9)}" font-size="1.3" text-anchor="middle" fill="#1e4f8a" font-family="Arial" font-weight="bold">DEO</text>`;
    dinge.push(["deodorant", "das Deodorant", "De-o-do-RANT", "il deodorante", "de-o-do-RAN-te", "deodorant", x, y, 6, 13]);
  }
  {
    const x = sx(0.47), y = yb(boeden[1]) - 0.6;
    k += `<rect x="${r(x - 2.8)}" y="${r(y - 11)}" width="5.6" height="11" rx="1" fill="${S.lg("schaum", [[0, "#dfe4e8"], [0.5, "#ffffff"], [1, "#b9c1c7"]], 0, 0, 1, 0)}"/><rect x="${r(x - 2.8)}" y="${r(y - 8)}" width="5.6" height="3.6" fill="#2a8f5c"/><text x="${r(x)}" y="${r(y - 5.6)}" font-size="1.2" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">Shave</text><path d="M${r(x - 2.4)} ${r(y - 11)} q2.4 -2 4.8 0 Z" fill="#cfd5d9"/><rect x="${r(x - 0.8)}" y="${r(y - 13.4)}" width="1.6" height="2.2" rx=".4" fill="#2a8f5c"/>`;
    dinge.push(["rasierschaum", "der Rasierschaum", "Ra-SIER-schaum", "la schiuma da barba", "SCHIU-ma da BAR-ba", "shaving foam", x, y, 7, 14]);
  }
  {
    const x = sx(0.78), y = yb(boeden[1]) - 0.6;
    k += `<rect x="${r(x - 2.6)}" y="${r(y - 4.4)}" width="5.2" height="4.4" rx=".8" fill="#f2f6f8" stroke="#a9c8d6" stroke-width=".3"/><circle cx="${r(x)}" cy="${r(y - 2.2)}" r="1.3" fill="#5bb5d9"/><path d="M${r(x + 1.6)} ${r(y - 4.4)} q1 -2 2.6 -1.6" stroke="#fff" stroke-width=".3" fill="none"/><text x="${r(x)}" y="${r(y - 5)}" font-size="1.1" text-anchor="middle" fill="#3a7a99" font-family="Arial">floss</text>`;
    dinge.push(["zahnseide", "die Zahnseide", "ZAHN-sei-de", "il filo interdentale", "FI-lo in-ter-den-TA-le", "dental floss", x, y, 6.5, 6.5]);
  }
  /* oben: Gesichtscreme, Sonnencreme, Wattestäbchen */
  {
    const x = sx(0.2), y = yb(boeden[2]) - 0.6;
    k += `<rect x="${r(x - 3.2)}" y="${r(y - 3.6)}" width="6.4" height="3.6" rx="1" fill="${S.lg("tiegel", [[0, "#f4ece6"], [1, "#d9c9bd"]], 0, 0, 1, 0)}"/><rect x="${r(x - 3.4)}" y="${r(y - 5.4)}" width="6.8" height="2" rx=".6" fill="#c6a68a"/><text x="${r(x)}" y="${r(y - 1.2)}" font-size="1.1" text-anchor="middle" fill="#8a6a50" font-family="Georgia" font-style="italic">Creme</text>`;
    dinge.push(["creme", "die Gesichtscreme", "Ge-SICHTS-creme", "la crema per il viso", "CRE-ma per il VI-so", "face cream", x, y, 7.5, 6.5]);
  }
  {
    const x = sx(0.5), y = yb(boeden[2]) - 0.6;
    k += `<path d="M${r(x - 2.4)} ${r(y)} L${r(x - 2.4)} ${r(y - 9)} Q${r(x)} ${r(y - 10.6)} ${r(x + 2.4)} ${r(y - 9)} L${r(x + 2.4)} ${r(y)} Z" fill="${S.lg("sonne", [[0, "#ffcf4a"], [1, "#f29b1d"]], 0, 0, 1, 0)}"/><rect x="${r(x - 1.6)}" y="${r(y - 11.6)}" width="3.2" height="2.2" rx=".5" fill="#2c7fb8"/><circle cx="${r(x)}" cy="${r(y - 5.6)}" r="1.6" fill="#fff4c2"/><text x="${r(x)}" y="${r(y - 2)}" font-size="1.4" text-anchor="middle" fill="#2c7fb8" font-family="Arial" font-weight="bold">LSF 30</text>`;
    dinge.push(["sonnencreme", "die Sonnencreme", "SON-nen-creme", "la crema solare", "CRE-ma so-LA-re", "sun cream", x, y, 6, 12.5]);
  }
  {
    const x = sx(0.79), y = yb(boeden[2]) - 0.6;
    let g = `<rect x="${r(x - 3)}" y="${r(y - 6)}" width="6" height="6" rx="1.2" fill="#eaf4f8" opacity=".85" stroke="#a9c8d6" stroke-width=".3"/>`;
    for (let i = 0; i < 7; i++) g += `<line x1="${r(x - 2.4 + i * 0.8)}" y1="${r(y - 5.2)}" x2="${r(x - 2.2 + i * 0.75)}" y2="${r(y - 0.8)}" stroke="#7fb6d6" stroke-width=".3"/><circle cx="${r(x - 2.4 + i * 0.8)}" cy="${r(y - 5.4)}" r=".5" fill="#fff"/>`;
    g += `<rect x="${r(x - 3.2)}" y="${r(y - 7)}" width="6.4" height="1.4" rx=".5" fill="#5bb5d9"/>`;
    k += g; dinge.push(["wattestaebchen", "die Wattestäbchen", "WAT-te-stäb-chen", "i cotton fioc", "COT-ton FIOC", "cotton buds", x, y, 7, 8]);
  }
  dinge.forEach(([id, de, syl, it, itSyl, en, x, y, w, h]) => spUnter.push({ id, de, syl, it, itSyl, en, x: ox + x, y: oy + y + 0.4, kunst: flaeche(-w / 2, -h, w, h + 0.4) }));
  /* linke Tür geschlossen: Spiegel mit Spiegelung des Raums */
  const ml = q(WT.X0 + 0.01, Y1 - 0.01, Zv - 0.02), mr = q(Xm, Y0 + 0.01, Zv - 0.02);
  k += `<rect x="${ml[0]}" y="${ml[1]}" width="${r(mr[0] - ml[0])}" height="${r(mr[1] - ml[1])}" fill="${S.lg("spiegel", [[0, "#dfe7ea"], [0.5, "#c3d0d5"], [1, "#a9b9bf"]], 0, 0, 1, 1)}"/>`;
  k += `<rect x="${r(ml[0] + 4)}" y="${r(ml[1] + 10)}" width="${r((mr[0] - ml[0]) * 0.3)}" height="${r((mr[1] - ml[1]) * 0.7)}" fill="#e9ecea" opacity=".5"/><rect x="${r(ml[0] + 18)}" y="${r(ml[1] + 20)}" width="8" height="${r((mr[1] - ml[1]) * 0.6)}" fill="#7b97ab" opacity=".25"/>`;
  k += `<path d="M${r(ml[0] + 6)} ${ml[1]} L${r(ml[0] + 14)} ${ml[1]} L${r(ml[0] + 2)} ${mr[1]} L${ml[0]} ${mr[1]} L${ml[0]} ${r(ml[1] + 12)} Z" fill="#fff" opacity=".35"/>`;
  k += `<rect x="${r(mr[0] - 0.8)}" y="${ml[1]}" width=".8" height="${r(mr[1] - ml[1])}" fill="#8b979c"/>`;
  /* LED-Lichtleiste oben */
  const la = q(WT.X0, Y1, Zv - 0.02), lb = q(WT.X1, Y1, Zv - 0.02);
  k += `<rect x="${la[0]}" y="${r(la[1] - 0.2)}" width="${r(lb[0] - la[0])}" height="1.6" fill="#fffbe8"/><rect x="${la[0]}" y="${r(la[1] + 1.4)}" width="${r(lb[0] - la[0])}" height="6" fill="${S.lg("ledschein", [[0, "#fffbe8", 0.5], [1, "#fffbe8", 0]])}"/>`;
  /* rechte Tür offen (fast rechtwinklig, Spiegel nach außen) */
  const d1 = q(WT.X1, Y1, Zv), d2 = q(WT.X1, Y0, Zv), d3 = q(WT.X1 + 0.05, Y0, Zv - 0.68), d4 = q(WT.X1 + 0.05, Y1, Zv - 0.68);
  k += poly([d1, d4, d3, d2], S.lg("tuerspiegel", [[0, "#b5c4ca"], [1, "#dbe4e7"]], 0, 0, 1, 0), ` stroke="#9aa6ab" stroke-width=".4"`);
  S.teil({ id: "spiegelschrank", de: "der Spiegelschrank", syl: "SPIE-gel-schrank", it: "l'armadietto a specchio", itSyl: "ar-ma-DIET-to a SPEC-chio", en: "mirror cabinet", x: ox, y: oy, kunst: k,
    zoom: { x: r(ox - 6), y: r(oy - 50), w: 72, h: 48 }, unter: spUnter,
    tipp: "Im Spiegelschrank stehen Rasierer, Deo und Cremes." });
}

/* =====================================================================
   6 — DAS WASCHBECKEN (Waschtisch mit wandhängendem Unterschrank)
   ===================================================================== */
{
  const ox = P((WT.X0 + WT.X1) / 2, 0, WT.Z0)[0], oy = P(0, WT.Yu, WT.Z0)[1];
  const q = (X, Y, Z) => { const [x, y] = P(X, Y, Z); return [r(x - ox), r(y - oy)]; };
  let k = schatten(0, 1, 52, 2, 0.12);
  /* Schatten am Boden unter dem schwebenden Schrank */
  { const a = q(WT.X0 + 0.05, 0, WT.Z0 + 0.05), b = q(WT.X1 - 0.05, 0, WT.Z1); k += `<rect x="${a[0]}" y="${b[1]}" width="${r(b[0] - a[0])}" height="${r(a[1] - b[1])}" fill="#3a3f42" opacity=".25" filter="url(#bw_weich)"/>`; }
  /* Unterschrank Eiche mit zwei Auszügen */
  k += quader(WT.X0 + 0.02, WT.X1 - 0.02, WT.Yu, WT.Yo - 0.03, WT.Z0 + 0.02, WT.Z1, { vorne: EICHE, seite: "#9a7750" }, ox, oy);
  const fa = q(WT.X0 + 0.02, WT.Yo - 0.03, WT.Z0 + 0.02), fb = q(WT.X1 - 0.02, WT.Yu, WT.Z0 + 0.02);
  const fy = (Y) => q(0, Y, WT.Z0 + 0.02)[1];
  k += `<rect x="${fa[0]}" y="${r(fy(0.6) - 0.3)}" width="${r(fb[0] - fa[0])}" height=".6" fill="#7d5f3a"/>`;
  for (const Y of [0.78, 0.55]) k += `<rect x="${fa[0]}" y="${r(fy(Y))}" width="${r(fb[0] - fa[0])}" height="1.4" fill="#6b4f2e" opacity=".55"/>`;
  for (let i = 0; i < 26; i++) { const x = fa[0] + rnd() * (fb[0] - fa[0] - 9), y = fa[1] + rnd() * (fb[1] - fa[1]); k += `<path d="M${r(x)} ${r(y)} q4 .4 8 0" stroke="#a6814f" stroke-width=".3" fill="none" opacity=".6"/>`; }
  /* Keramik-Waschtisch: Platte mit eingelassenem Becken */
  k += quader(WT.X0, WT.X1, WT.Yo - 0.05, WT.Yo, WT.Z0 - 0.02, WT.Z1, { vorne: "#f3f5f6", oben: KERAMIK, seite: "#d9dde0" }, ox, oy);
  const bl = q(-0.78, WT.Yo, 2.58), br = q(-0.32, WT.Yo, 2.58), bh = q(-0.32, WT.Yo, 2.86);
  const bcx = r((bl[0] + br[0]) / 2), bcy = r((bl[1] + bh[1]) / 2);
  k += `<ellipse cx="${bcx}" cy="${bcy}" rx="${r((br[0] - bl[0]) / 2)}" ry="${r((bl[1] - bh[1]) / 2 + 0.6)}" fill="${S.rg("becken", [[0, "#d7dde0"], [0.7, "#eef1f2"], [1, "#ffffff"]], 0.5, 0.35, 0.6)}" stroke="#d3d8db" stroke-width=".4"/>`;
  k += `<ellipse cx="${bcx}" cy="${r(bcy + 0.6)}" rx="1.4" ry=".5" fill="${CHROM}"/>`;
  k += `<path d="M${bl[0]} ${r(bl[1] - 0.3)} L${br[0]} ${r(br[1] - 0.3)}" stroke="#fff" stroke-width=".6" opacity=".9"/>`;
  S.teil({ id: "waschbecken", de: "das Waschbecken", syl: "WASCH-be-cken", it: "il lavandino", itSyl: "la-van-DI-no", en: "washbasin", x: ox, y: oy, kunst: k,
    tipp: "Der Waschtisch hängt an der Wand – so kann man darunter gut putzen." });
}
/* 7 — DER WASSERHAHN (Einhebelmischer) */
{
  const [x, y] = P(-0.55, WT.Yo, 2.93);
  let k = `<ellipse cx="0" cy="0" rx="2.4" ry=".7" fill="#8e979e"/><rect x="-1.4" y="-9" width="2.8" height="9" rx="1" fill="${CHROM}"/>`;
  k += `<path d="M-1.4 -8.4 L-1.4 -10 Q-1.4 -11 -.4 -11 L5 -11 Q5.8 -11 5.8 -10.2 L5.8 -9.2 L1.4 -9.2" fill="${CHROM_H}"/><rect x="4.4" y="-9.4" width="1.6" height=".8" fill="#7d868d"/>`;
  k += `<path d="M-1 -11 L-1.6 -14.6 L.6 -14.8 L1 -11 Z" fill="${CHROM}"/><path d="M-.6 -8 L-.6 -1" stroke="#fff" stroke-width=".5" opacity=".7"/>`;
  S.teil({ oben: true, id: "wasserhahn", de: "der Wasserhahn", syl: "WAS-ser-hahn", it: "il rubinetto", itSyl: "ru-bi-NET-to", en: "tap", x, y, kunst: k + flaeche(-2.6, -15, 9, 15.4) });
}

/* =====================================================================
   8–13 — AUF DER WASCHTISCHPLATTE
   ===================================================================== */
const platte = (X, Z) => P(X, WT.Yo, Z);
{
  /* DAS TASCHENTUCH — Box mit herausschauendem Tuch, links */
  const [x, y] = platte(-1.07, 2.68), k0 = s(2.68);
  let k = schatten(0, 0.2, 0.13 * k0, 1, 0.25);
  k += quader(-1.18, -0.96, WT.Yo, WT.Yo + 0.09, 2.62, 2.75, { vorne: S.lg("tbox", [[0, "#8fbcd6"], [1, "#6e9fbe"]]), oben: "#a9cde2", seite: "#5f8fae" }, x, y);
  for (let i = 0; i < 5; i++) k += `<circle cx="${r(-6 + i * 3)}" cy="-2.6" r=".9" fill="#fff" opacity=".6"/>`;
  k += `<path d="M-1.6 -6.6 Q-3 -10.4 -.6 -12 Q.4 -10 1.6 -11.4 Q3 -9 1.6 -6.6 Z" fill="#ffffff" stroke="#dfe3e6" stroke-width=".3"/>`;
  S.teil({ oben: true, id: "taschentuch", de: "das Taschentuch", syl: "TA-schen-tuch", it: "il fazzoletto", itSyl: "faz-zo-LET-to", en: "tissue", x, y, steht: true, kunst: k });
}
{
  /* DIE SEIFE — Seifenschale aus Keramik mit Stück Seife */
  const [x, y] = platte(-0.88, 2.62);
  let k = schatten(0, 0.2, 5, .8, .25);
  k += `<path d="M-5 -1.6 Q-5 0 -3 0 L3 0 Q5 0 5 -1.6 Z" fill="#dfe3e5"/><ellipse cx="0" cy="-1.6" rx="5" ry="1.2" fill="#c8cfd2"/>`;
  k += `<rect x="-3.4" y="-3.8" width="6.8" height="2.6" rx="1.2" fill="${S.lg("seife", [[0, "#f6d6e4"], [1, "#dfa9c2"]])}"/><path d="M-2.6 -3.4 q2.6 -.6 5 0" stroke="#fff" stroke-width=".5" opacity=".7" fill="none"/>`;
  S.teil({ oben: true, id: "seife", de: "die Seife", syl: "SEI-fe", it: "il sapone", itSyl: "sa-PO-ne", en: "soap", x, y, steht: true, kunst: k + flaeche(-5.5, -5.5, 11, 6) });
}
{
  /* DIE HANDSEIFE — Pumpspender rechts vom Becken */
  const [x, y] = platte(-0.2, 2.72), h = 0.17 * s(2.72);
  let k = schatten(0, 0.2, 3.4, .7, .3);
  k += `<rect x="-2.4" y="${r(-h)}" width="4.8" height="${r(h)}" rx="1.4" fill="${S.lg("spender", [[0, "#9ec9a8", 0.95], [0.5, "#c9e6cf", 0.9], [1, "#7fb08b", 0.95]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-2.4" y="${r(-h * 0.55)}" width="4.8" height="${r(h * 0.25)}" fill="#fff" opacity=".85"/><text x="0" y="${r(-h * 0.38)}" font-size="1.2" text-anchor="middle" fill="#3f7a50" font-family="Arial">Handseife</text>`;
  k += `<rect x="-1" y="${r(-h - 2.4)}" width="2" height="2.6" fill="${CHROM}"/><path d="M-1.4 ${r(-h - 2.6)} L4 ${r(-h - 2.6)} L4 ${r(-h - 1.6)} L1 ${r(-h - 1.6)}" fill="${CHROM_H}"/>`;
  S.teil({ oben: true, id: "handseife", de: "die Handseife", syl: "HAND-sei-fe", it: "il sapone liquido", itSyl: "sa-PO-ne LI-qui-do", en: "hand soap", x, y, steht: true, kunst: k + flaeche(-3, -h - 3.4, 7.5, h + 3.6),
    tipp: "Hände mindestens 20 Sekunden mit Seife waschen." });
}
{
  /* DER ZAHNPUTZBECHER mit Zahnbürsten */
  const [x, y] = platte(-0.04, 2.76), h = 0.1 * s(2.76);
  let k = schatten(0, 0.2, 3.4, .7, .3);
  k += `<path d="M-2.8 ${r(-h)} L2.8 ${r(-h)} L2.4 0 L-2.4 0 Z" fill="${S.lg("becher", [[0, "#e7f1f4", 0.9], [0.5, "#ffffff", 0.8], [1, "#c5dbe2", 0.9]], 0, 0, 1, 0)}" stroke="#b3cdd6" stroke-width=".3"/>`;
  k += `<ellipse cx="0" cy="${r(-h)}" rx="2.8" ry=".7" fill="#d6e7ec"/>`;
  S.teil({ oben: true, id: "zahnputzbecher", de: "der Zahnputzbecher", syl: "ZAHN-putz-be-cher", it: "il bicchiere per lo spazzolino", itSyl: "bic-CHIE-re per lo spaz-zo-LI-no", en: "toothbrush mug", x, y, steht: true, kunst: k });
  /* DIE ZAHNBÜRSTE: zwei Bürsten stehen schräg im Becher (eigene Fläche über dem Becherrand) */
  let z = "";
  for (const [dx, a, f] of [[-0.8, -14, "#2d9bd8"], [0.9, 12, "#e2574c"]]) {
    z += `<g transform="translate(${dx} ${r(-h + 1)}) rotate(${a})"><rect x="-.6" y="-11" width="1.2" height="11" rx=".6" fill="${f}"/><rect x="-.9" y="-13.4" width="1.8" height="3" rx=".5" fill="#fbfbfb"/>`;
    for (let i = 0; i < 4; i++) z += `<rect x="${r(-1.6)}" y="${r(-13.2 + i * 0.7)}" width=".7" height=".5" fill="${i % 2 ? "#7fd0f5" : "#ffffff"}"/>`;
    z += `</g>`;
  }
  S.teil({ oben: true, id: "zahnbuerste", de: "die Zahnbürste", syl: "ZAHN-bürs-te", it: "lo spazzolino", itSyl: "spaz-zo-LI-no", en: "toothbrush", x, y, kunst: z + flaeche(-4.6, -h - 13, 9.2, 9.4),
    tipp: "Zweimal am Tag Zähne putzen – morgens und abends." });
}
{
  /* DIE ZAHNPASTA — Tube liegt vorn auf der Platte */
  const [x, y] = platte(0.02, 2.56);
  let k = schatten(0, 0.2, 7, 1, .35);
  k += `<path d="M-6.4 -.2 L4 -.4 Q5 -1.6 4 -2.9 L-6.4 -3.1 L-7.2 -2.4 L-7.2 -.8 Z" fill="${S.lg("tube", [[0, "#cfe6f5"], [0.5, "#ffffff"], [1, "#9cc3dc"]])}" stroke="#7aa6c2" stroke-width=".3"/><path d="M-7.2 -2.6 L-7.2 -.6" stroke="#7aa6c2" stroke-width=".6"/>`;
  k += `<rect x="-4.6" y="-2.4" width="5" height="1.8" fill="#d6332c"/><text x="-2.1" y="-1.1" font-size="1.1" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">dent</text>`;
  k += `<rect x="4" y="-2.4" width="2.4" height="2.2" rx=".5" fill="#2d6fb3"/>`;
  S.teil({ oben: true, id: "zahnpasta", de: "die Zahnpasta", syl: "ZAHN-pas-ta", it: "il dentifricio", itSyl: "den-ti-FRI-cio", en: "toothpaste", x, y, steht: true, kunst: k + flaeche(-7.5, -4, 14.5, 4.4) });
}

/* =====================================================================
   14 — DIE DUSCHE (bodengleich, Glaswand) mit 15 — SHAMPOO, 16 — DUSCHGEL
   ===================================================================== */
const NISCHE = { X0: 0.95, X1: 1.4, Y0: 1.08, Y1: 1.42 };
{
  /* die Dusche als Ort: Fläche der Duschwand (Trefferfläche = sichtbare Wand) */
  const [x0, y0] = P(DX + 0.02, 2.3, ZW), y1 = P(0, 0, ZW)[1], x1 = 319.5;
  let k = `<rect x="0" y="${r(y0 - y1)}" width="${r(x1 - x0)}" height="${r(y1 - y0)}" fill="#fff" opacity=".001"/>`;
  /* Duschtasse/Bodenfliesen in der Dusche etwas dunkler */
  k += `<path d="M0 0 L${r(x1 - x0)} 0 L${r(x1 - x0)} 10 L0 10 Z" fill="#7e8486" opacity=".18"/>`;
  /* Wandnische: Rücksprung mit Licht */
  const [nx0, ny0] = P(NISCHE.X0, NISCHE.Y1, ZW), [nx1, ny1] = P(NISCHE.X1, NISCHE.Y0, ZW);
  k += `<rect x="${r(nx0 - x0)}" y="${r(ny0 - y1)}" width="${r(nx1 - nx0)}" height="${r(ny1 - ny0)}" fill="${S.lg("nische", [[0, "#8f9390"], [0.3, "#b9bcb8"], [1, "#a8aba7"]])}"/>`;
  k += `<rect x="${r(nx0 - x0)}" y="${r(ny1 - y1 - 1.6)}" width="${r(nx1 - nx0)}" height="1.6" fill="#d9dbd8"/><rect x="${r(nx0 - x0)}" y="${r(ny0 - y1)}" width="${r(nx1 - nx0)}" height="1.2" fill="#fffbe8" opacity=".7"/>`;
  S.teil({ id: "dusche", de: "die Dusche", syl: "DU-sche", it: "la doccia", itSyl: "DOC-cia", en: "shower", x: x0, y: y1, kunst: k,
    tipp: "Eine bodengleiche Dusche hat keine Stufe." });
  /* SHAMPOO und DUSCHGEL in der Nische */
  const [, nb] = P(0, NISCHE.Y0 + 0.025, ZW);
  const flasche = (X, farbe, deck, txt, h) => {
    const [x] = P(X, 0, ZW);
    let g = `<rect x="-2.6" y="${-h}" width="5.2" height="${h}" rx="1.6" fill="${farbe}"/><rect x="-1.8" y="${-h - 2.4}" width="3.6" height="2.8" rx=".8" fill="${deck}"/>`;
    g += `<rect x="-2.6" y="${r(-h * 0.62)}" width="5.2" height="${r(h * 0.3)}" fill="#fff" opacity=".85"/><text x="0" y="${r(-h * 0.42)}" font-size="1.15" text-anchor="middle" fill="#333" font-family="Arial" font-weight="bold">${txt}</text>`;
    g += `<rect x="-1.9" y="${-h + 1.2}" width=".8" height="${h - 2.4}" fill="#fff" opacity=".3"/>`;
    return { x, g };
  };
  const sh = flasche(1.06, S.lg("shampoo", [[0, "#2f8c8f"], [1, "#1f6a6d"]], 0, 0, 1, 0), "#e6eceb", "Shampoo", 13);
  S.teil({ oben: true, id: "shampoo", de: "das Shampoo", syl: "Sham-POO", it: "lo shampoo", itSyl: "SHAM-poo", en: "shampoo", x: sh.x, y: nb, kunst: sh.g + flaeche(-3, -16, 6, 16.4),
    tipp: "Shampoo ist für die Haare." });
  const dg = flasche(1.27, S.lg("duschgel", [[0, "#e88aa7"], [1, "#c95f82"]], 0, 0, 1, 0), "#f6f0f2", "Duschgel", 11.4);
  S.teil({ oben: true, id: "duschgel", de: "das Duschgel", syl: "DUSCH-gel", it: "il bagnoschiuma", itSyl: "ba-gno-SCHIU-ma", en: "shower gel", x: dg.x, y: nb, kunst: dg.g + flaeche(-3, -14.4, 6, 14.8),
    tipp: "Duschgel ist für den Körper." });
  /* Glaswand vor der Dusche: Spiegelung und Profil, fängt keinen Tipp */
  const [gx0, gy0] = P(DX, 2.0, 2.62), [gx1, gy1] = P(2.8, 0, 2.62);
  S.davor(`<g pointer-events="none"><rect x="${gx0}" y="${gy0}" width="${r(gx1 - gx0)}" height="${r(gy1 - gy0)}" fill="${S.lg("glaswand", [[0, "#e6f3f6", 0.2], [0.5, "#ffffff", 0.06], [1, "#d5ebf0", 0.16]], 0, 0, 1, 1)}"/>
    <path d="M${r(gx0 + 12)} ${gy0} L${r(gx0 + 20)} ${gy0} L${r(gx0 + 6)} ${gy1} L${r(gx0 - 2)} ${gy1} Z" fill="#fff" opacity=".14"/>
    <path d="M${r(gx0 + 48)} ${gy0} L${r(gx0 + 52)} ${gy0} L${r(gx0 + 38)} ${gy1} L${r(gx0 + 34)} ${gy1} Z" fill="#fff" opacity=".1"/>
    <rect x="${r(gx0 - 1)}" y="${gy0}" width="1.6" height="${r(gy1 - gy0)}" fill="${CHROM}"/><rect x="${r(gx0 - 1)}" y="${r(gy1 - 1)}" width="${r(gx1 - gx0 + 2)}" height="1.2" fill="${CHROM_H}"/>
    <rect x="${r(gx0 - 1)}" y="${r(gy0 - 1.2)}" width="${r(gx1 - gx0 + 2)}" height="1.2" fill="${CHROM_H}"/></g>`);
}

/* =====================================================================
   17 — DER BADVORLEGER vor dem Waschtisch
   ===================================================================== */
{
  const a = P(-1.05, 0, 2.15), b = P(-0.15, 0, 2.15), c = P(-0.15, 0, 2.55), d = P(-1.05, 0, 2.55);
  const ox = (a[0] + b[0]) / 2, oy = a[1];
  const o = (p) => [r(p[0] - ox), r(p[1] - oy)];
  let k = poly([o(a), o(b), o(c), o(d)], S.lg("vorleger", [[0, "#cfd8cf"], [1, "#b7c4b8"]]), ` stroke="#a5b3a6" stroke-width=".6"`);
  for (let t = 0.1; t < 1; t += 0.1) { const p = [a[0] + (b[0] - a[0]) * t, a[1]], q2 = [d[0] + (c[0] - d[0]) * t, d[1]]; k += `<line x1="${r(p[0] - ox)}" y1="0" x2="${r(q2[0] - ox)}" y2="${r(q2[1] - oy)}" stroke="#a7b5a8" stroke-width=".4"/>`; }
  for (let i = 0; i < 26; i++) k += `<rect x="${r(o(a)[0] + 1 + i * (b[0] - a[0] - 2) / 26)}" y="0" width=".5" height="1.4" fill="#b0beb1"/>`;
  S.teil({ id: "badvorleger", de: "der Badvorleger", syl: "BAD-vor-le-ger", it: "il tappetino da bagno", itSyl: "tap-pe-TI-no da BA-gno", en: "bath mat", x: ox, y: oy, kunst: k });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/pflege.js"));
console.log(aus);
