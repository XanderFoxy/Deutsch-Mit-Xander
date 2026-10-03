#!/usr/bin/env node
/* =====================================================================
   GETRÄNKE (FASSUNG 852) — Bilderwelt neu: das Wortfeld an einem echten
   Ort, der THEKE eines Bistros.
   ---------------------------------------------------------------------
   RECHERCHE (Planungsunterlagen für Bistro-/Café-Theken, z. B. WMF
   „bistro“: Rückbuffet mit Kaffeemaschine, Beistell-Kühlschrank mit
   Glastür, Unterstellkühler; Zapfanlagen in der Gastronomie):
   - Hinter der Theke das RÜCKBUFFET (dunkles Holz) mit der Filter-
     KAFFEEMASCHINE und der Kanne auf der Warmhalteplatte; daneben der
     GETRÄNKEKÜHLSCHRANK mit Glastür (Wasser still und sprudelnd,
     Limo, Schorle, Cola, Milch, Saft).
   - An der Spiegelwand GLASBÖDEN mit Weinflaschen (Bordeaux- und
     Burgunderform), darüber Licht.
   - Die GETRÄNKEKARTE hängt an der Wand.
   - Auf der THEKE: die ZAPFANLAGE mit Tropfblech, Bierdeckel im Halter,
     und was gerade serviert wird — Heißgetränke (Kaffee mit Untertasse
     und Löffel, Tee im Glas, Kakao mit Sahnehaube), Milch, Saft,
     Bier, Wein, Sekt im Sektkühler mit Eis.
   - Vor der Theke BARHOCKER mit Fußring; Holzdielen.
   Maßstab: Rückwand ≈ 40 Einheiten je Meter (Rückbuffet 0,9 m hoch),
   Theke ganz vorn ≈ 75 je Meter (1,10 m hoch, Fuß knapp unter dem
   Bildrand), Wirtin 1,68 m (≈ 56 je Meter, sie steht hinter der Theke).
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "getraenke", titel: "Getränke", emoji: "🥤", thema: "Einkaufen", kuerzel: "gt", fassung: 852 });
const rnd = zufall(1516);
const r = B.r;
{ const lg = S.lg, rg = S.rg, c = {}; S.lg = (n, ...a) => c[n] || (c[n] = lg(n, ...a)); S.rg = (n, ...a) => c["r" + n] || (c["r" + n] = rg(n, ...a)); }

/* ---------- Farben und Stoffe --------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const WAND = S.lg("wand", [[0, "#3f5a52"], [1, "#344b44"]]);
const HOLZ_D = S.lg("holzd", [[0, "#5a3820"], [1, "#3c2414"]]);
const HOLZ_V = S.lg("holzv", [[0, "#6e4426"], [0.5, "#82532f"], [1, "#643c20"]], 0, 0, 1, 0);
const STAHL = S.lg("stahl", [[0, "#eef1f3"], [0.45, "#c9cfd4"], [0.55, "#b5bcc2"], [1, "#e1e5e8"]], 0, 0, 1, 0);
const MESSING = S.lg("messing", [[0, "#f3d98c"], [0.5, "#c9a24a"], [1, "#8f6d24"]], 0, 0, 1, 0);
const GLAS = S.lg("glas", [[0, "#ffffff", 0.3], [0.45, "#e8f4f7", 0.06], [1, "#ffffff", 0.16]], 0, 0, 1, 1);
const KLAR = S.lg("klar", [[0, "#cfe3ea", 0.75], [0.35, "#ffffff", 0.55], [1, "#b5ced8", 0.75]], 0, 0, 1, 0);
const GRUEN_GL = S.lg("gruengl", [[0, "#1f4d29"], [0.4, "#3f8a4b"], [1, "#173d20"]], 0, 0, 1, 0);
const BRAUN_GL = S.lg("braungl", [[0, "#4a2508"], [0.4, "#8a4a16"], [1, "#3a1c06"]], 0, 0, 1, 0);
const ROTWEIN_GL = S.lg("rotgl", [[0, "#1d0a0e"], [0.4, "#3e1620"], [1, "#16070a"]], 0, 0, 1, 0);

const WAND_UNTEN = 118, BUF_O = 82;   // Rückwandfuß, Oberkante Rückbuffet (0,9 m)
const PL = 133;                       // Standfläche auf der Thekenplatte
const MT = 58;                        // Zeichenmaß der Dinge (Einheiten je Meter) …
const SK = 1.3;                       // … vergrößert: die Theke steht nah vor uns (≈ 75 je Meter)

/* =====================================================================
   KULISSE — Wand, Spiegel, Rückbuffet, Dielenboden
   ===================================================================== */
{
  let k = `<rect x="0" y="0" width="320" height="14" fill="${S.lg("decke", [[0, "#2a2420"], [1, "#3a312a"]])}"/>`;
  k += `<rect x="0" y="13" width="320" height="2" fill="#5a4a3a"/>`;
  k += `<rect x="0" y="15" width="320" height="${WAND_UNTEN - 15}" fill="${WAND}"/>`;
  /* Wandvertäfelung unten, Licht von oben */
  k += `<rect x="0" y="15" width="320" height="${WAND_UNTEN - 15}" fill="${S.rg("wandlicht", [[0, "#ffe7b0", 0.35], [1, "#ffe7b0", 0]], 0.55, 0.1, 0.75)}"/>`;
  /* Spiegelwand hinter den Glasböden */
  k += `<rect x="168" y="22" width="84" height="${BUF_O - 22}" fill="${S.lg("spiegel", [[0, "#8c9a98"], [0.5, "#b6c2bf"], [1, "#7a8885"]], 0, 0, 1, 1)}"/>`;
  k += `<path d="M180 ${BUF_O} L200 22 L210 22 L190 ${BUF_O} Z" fill="#fff" opacity=".12"/><path d="M226 ${BUF_O} L238 22 L242 22 L230 ${BUF_O} Z" fill="#fff" opacity=".1"/>`;
  k += `<rect x="166" y="20" width="88" height="2" fill="${MESSING}"/>`;
  /* Rückbuffet (dunkles Holz) mit Türen */
  k += `<rect x="70" y="${BUF_O}" width="250" height="${WAND_UNTEN - BUF_O}" fill="${HOLZ_D}"/>`;
  k += `<rect x="68" y="${BUF_O - 2}" width="254" height="2.6" fill="${S.lg("buffplatte", [[0, "#3a3633"], [1, "#22201e"]])}"/>`;
  for (let x = 74; x < 316; x += 30) k += `<rect x="${x}" y="${BUF_O + 4}" width="26" height="${WAND_UNTEN - BUF_O - 8}" rx="1" fill="none" stroke="#2a180c" stroke-width=".6"/><rect x="${x + 11}" y="${BUF_O + 8}" width="4" height=".9" rx=".4" fill="${MESSING}"/>`;
  /* Dielenboden in Fluchtperspektive */
  k += `<rect x="0" y="${WAND_UNTEN}" width="320" height="${200 - WAND_UNTEN}" fill="${S.lg("boden", [[0, "#7a5434"], [1, "#9a6c42"]])}"/>`;
  for (let i = -16; i <= 16; i++) k += `<line x1="${160 + i * 11}" y1="${WAND_UNTEN}" x2="${r(160 + i * 11 * 260 / 178)}" y2="200" stroke="#4e321c" stroke-width=".35" opacity=".7"/>`;
  for (let i = 0; i < 40; i++) {
    const s = Math.floor(rnd() * 32) - 16, y = WAND_UNTEN + 4 + rnd() * 76, t = (y + 60) / 178;
    k += `<line x1="${r(160 + s * 11 * t)}" y1="${r(y)}" x2="${r(160 + (s + 1) * 11 * t)}" y2="${r(y)}" stroke="#4e321c" stroke-width=".3" opacity=".6"/>`;
  }
  k += `<rect x="0" y="${WAND_UNTEN}" width="320" height="${200 - WAND_UNTEN}" fill="${S.lg("bodenlicht", [[0, "#000", 0.25], [0.5, "#000", 0], [1, "#fff", 0.05]])}"/>`;
  k += `<rect x="0" y="${WAND_UNTEN - 3}" width="70" height="3" fill="#2a180c"/>`;
  S.hinten(k);
}

/* ---------- Hilfen --------------------------------------------------- */
/* Flasche, Fuß bei (x, y). form: still | perl | limo | schorle | cola | bordeaux | burgund */
function flasche(x, y, h, form, glas, deckel, etikett) {
  const b = form === "burgund" ? h * 0.3 : form === "perl" || form === "limo" ? h * 0.3 : h * 0.26;
  let p;
  if (form === "bordeaux") {
    /* Bordeaux: hohe gerade Wand, Schulter fast rechtwinklig */
    p = `M${x - b / 2} ${y} L${x - b / 2} ${y - h * 0.62} Q${x - b / 2} ${y - h * 0.7} ${x - b * 0.17} ${y - h * 0.72} L${x - b * 0.15} ${y - h} L${x + b * 0.15} ${y - h} L${x + b * 0.17} ${y - h * 0.72} Q${x + b / 2} ${y - h * 0.7} ${x + b / 2} ${y - h * 0.62} L${x + b / 2} ${y} Z`;
  } else if (form === "burgund") {
    /* Burgunder: breiter, Schulter in weichem Bogen */
    p = `M${x - b / 2} ${y} L${x - b / 2} ${y - h * 0.45} C${x - b / 2} ${y - h * 0.68} ${x - b * 0.16} ${y - h * 0.66} ${x - b * 0.14} ${y - h * 0.82} L${x - b * 0.14} ${y - h} L${x + b * 0.14} ${y - h} L${x + b * 0.14} ${y - h * 0.82} C${x + b * 0.16} ${y - h * 0.66} ${x + b / 2} ${y - h * 0.68} ${x + b / 2} ${y - h * 0.45} L${x + b / 2} ${y} Z`;
  } else if (form === "cola") {
    /* Konturflasche: Taille in der Mitte */
    p = `M${x - b * 0.42} ${y} Q${x - b * 0.56} ${y - h * 0.2} ${x - b * 0.42} ${y - h * 0.36} Q${x - b * 0.32} ${y - h * 0.44} ${x - b * 0.48} ${y - h * 0.58} Q${x - b * 0.5} ${y - h * 0.72} ${x - b * 0.16} ${y - h * 0.86} L${x - b * 0.15} ${y - h} L${x + b * 0.15} ${y - h} L${x + b * 0.16} ${y - h * 0.86} Q${x + b * 0.5} ${y - h * 0.72} ${x + b * 0.48} ${y - h * 0.58} Q${x + b * 0.32} ${y - h * 0.44} ${x + b * 0.42} ${y - h * 0.36} Q${x + b * 0.56} ${y - h * 0.2} ${x + b * 0.42} ${y} Z`;
  } else {
    const sch = form === "limo" ? 0.5 : form === "perl" ? 0.58 : 0.6, hal = form === "limo" ? 0.2 : 0.3;
    p = `M${x - b / 2} ${y} L${x - b / 2} ${y - h * sch} Q${x - b / 2} ${y - h * (sch + 0.12)} ${x - b * 0.16} ${y - h * (1 - hal)} L${x - b * 0.15} ${y - h} L${x + b * 0.15} ${y - h} L${x + b * 0.16} ${y - h * (1 - hal)} Q${x + b / 2} ${y - h * (sch + 0.12)} ${x + b / 2} ${y - h * sch} L${x + b / 2} ${y} Z`;
  }
  let g = `<path d="${p.replace(/-?\d+\.\d{2,}/g, (n) => r(+n))}" fill="${glas}"/>`;
  if (form === "perl") for (let i = 1; i < 6; i++) g += `<line x1="${r(x - b / 2)}" y1="${r(y - h * 0.08 * i)}" x2="${r(x + b / 2)}" y2="${r(y - h * 0.08 * i)}" stroke="#fff" stroke-width=".25" opacity=".55"/>`;
  if (form === "perl" || form === "limo") for (let i = 0; i < 6; i++) g += `<circle cx="${r(x - b * 0.3 + rnd() * b * 0.6)}" cy="${r(y - h * 0.1 - rnd() * h * 0.45)}" r="${form === "limo" ? 0.35 : 0.2}" fill="#fff" opacity=".8"/>`;
  g += `<rect x="${r(x - b * 0.17)}" y="${r(y - h - 0.2)}" width="${r(b * 0.34)}" height="${r(h * 0.07)}" rx=".2" fill="${deckel}"/>`;
  if (etikett) g += `<rect x="${r(x - b / 2)}" y="${r(y - h * 0.5)}" width="${r(b)}" height="${r(h * 0.22)}" fill="${etikett}"/>`;
  g += `<rect x="${r(x - b * 0.32)}" y="${r(y - h * 0.62)}" width="${r(b * 0.12)}" height="${r(h * 0.55)}" fill="#fff" opacity=".3"/>`;
  return g;
}
/* Trinkglas, Fuß bei (0,0): Becher mit Füllung */
function becher(w, h, fuell, stand, schaum) {
  let g = schatten(0, 0.2, w * 0.6, 0.6, 0.3);
  g += `<path d="M${-w / 2} ${-h} L${w / 2} ${-h} L${w * 0.42} 0 L${-w * 0.42} 0 Z" fill="${KLAR}"/>`;
  const ys = -h * stand, ws = w / 2 - (w / 2 - w * 0.42) * (1 - stand);
  g += `<path d="M${r(-ws + 0.2)} ${r(ys)} L${r(ws - 0.2)} ${r(ys)} L${r(w * 0.42 - 0.3)} -.4 L${r(-w * 0.42 + 0.3)} -.4 Z" fill="${fuell}"/>`;
  if (schaum) g += `<path d="M${r(-w / 2 + 0.1)} ${r(ys)} Q${r(-w / 4)} ${r(ys - 1.8)} 0 ${r(ys - 1.2)} Q${r(w / 4)} ${r(ys - 2)} ${r(w / 2 - 0.1)} ${r(ys)} L${r(w / 2 - 0.2)} ${r(ys + 2.2)} L${r(-w / 2 + 0.2)} ${r(ys + 2.2)} Z" fill="#fffaf0"/>`;
  g += `<ellipse cx="0" cy="${r(-h)}" rx="${r(w / 2)}" ry=".5" fill="none" stroke="#fff" stroke-width=".25" opacity=".8"/>`;
  g += `<rect x="${r(-w * 0.34)}" y="${r(-h + 0.6)}" width=".5" height="${r(h - 1.4)}" fill="#fff" opacity=".55"/>`;
  return g;
}

/* =====================================================================
   1 — DER KÜHLSCHRANK (Getränkekühlschrank mit Glastür) — Lupe
   ===================================================================== */
const KS = { x0: 8, x1: 62, y0: 40, y1: WAND_UNTEN };
{
  const W = KS.x1 - KS.x0, H = KS.y1 - KS.y0, cx = (KS.x0 + KS.x1) / 2;
  let k = schatten(0, 0, W / 2 + 2, 1.4, 0.35);
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="${H}" rx="1.4" fill="#1f2326"/>`;
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="6" rx="1.4" fill="${S.lg("kskopf", [[0, "#c22b2b"], [1, "#931c1c"]])}"/>`;
  k += `<text x="0" y="${-H + 4.3}" font-size="3.4" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold" letter-spacing=".4">eiskalt</text>`;
  k += `<rect x="${-W / 2 + 2.4}" y="${-H + 7.4}" width="${W - 4.8}" height="${H - 13}" fill="${S.lg("ksinnen", [[0, "#f6fbff"], [1, "#d3e0e8"]])}"/>`;
  const boeden = [-H + 24, -H + 41, -H + 58, -8];
  for (const b of boeden) k += `<rect x="${-W / 2 + 2.4}" y="${b}" width="${W - 4.8}" height="1.2" fill="#9eacb5"/>`;
  const L = -W / 2 + 4, M = 0, R = W / 2 - 4;
  const reihe = (x0, x1, n, fn, b) => { let g = ""; for (let i = 0; i < n; i++) g += fn(x0 + (x1 - x0) * (i + 0.5) / n, b); return g; };
  /* Ebene 1: stilles Wasser (links), Sprudel in der Perlflasche (rechts) */
  k += reihe(L, M - 1, 4, (x, b) => flasche(x, b, 14.5, "still", KLAR, "#2f6fd0", "#4a8fe0"), boeden[0]);
  k += reihe(M + 1, R, 4, (x, b) => flasche(x, b, 13, "perl", S.lg("perl", [[0, "#9fc9b3", 0.9], [0.4, "#e3f4ea", 0.9], [1, "#8ab8a0", 0.9]], 0, 0, 1, 0), "#2a8a3a", "#e8f1e6"), boeden[0]);
  /* Ebene 2: Limonade (links), Apfelschorle (rechts) */
  k += reihe(L, M - 1, 4, (x, b) => flasche(x, b, 12, "limo", S.lg("limo", [[0, "#e8901a"], [0.4, "#ffc04a"], [1, "#d07a10"]], 0, 0, 1, 0), "#c9a227", "#fff3c4") + `<circle cx="${r(x)}" cy="${r(b - 4.8)}" r=".9" fill="#f08a1a"/>`, boeden[1]);
  k += reihe(M + 1, R, 4, (x, b) => flasche(x, b, 13, "schorle", S.lg("schorle", [[0, "#c99a3a"], [0.4, "#f2d27a"], [1, "#b8862a"]], 0, 0, 1, 0), "#d2232a", "#ffffff") + `<path d="M${r(x - 0.4)} ${r(b - 5.6)} a1 1 0 0 0 0 2 Z" fill="#d23b30"/><path d="M${r(x + 0.9)} ${r(b - 5.8)} q.6 1 0 1.8 q-.6 -.8 0 -1.8 Z" fill="#3d8fd6"/>`, boeden[1]);
  /* Ebene 3: Cola in der Konturflasche */
  k += reihe(L, R, 7, (x, b) => flasche(x, b, 12.5, "cola", S.lg("colagl", [[0, "#2a1408"], [0.4, "#5a2e12"], [1, "#24110a"]], 0, 0, 1, 0), "#c8102e", "#c8102e"), boeden[2]);
  /* Ebene 4: Milchtüten (Giebel) links, Saftkartons rechts */
  for (let i = 0; i < 3; i++) {
    const x = L + 3.2 + i * 6.6, b = boeden[3];
    k += `<path d="M${x - 2.8} ${b} L${x - 2.8} ${b - 8} L${x} ${b - 10} L${x + 2.8} ${b - 8} L${x + 2.8} ${b} Z" fill="#f7f7f2" stroke="#c9ccd0" stroke-width=".2"/><rect x="${x - 0.8}" y="${b - 11}" width="1.6" height="1.2" fill="#e6e6e0"/>`;
    k += `<rect x="${x - 2.8}" y="${b - 6.4}" width="5.6" height="3" fill="#2f78c4"/><text x="${x}" y="${b - 4.3}" font-size="1.6" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">3,5 %</text>`;
  }
  for (let i = 0; i < 3; i++) {
    const x = M + 4 + i * 7.2, b = boeden[3];
    k += `<rect x="${x - 3}" y="${b - 9}" width="6" height="9" rx=".4" fill="${S.lg("saftkart", [[0, "#ffb02e"], [1, "#f08a1a"]])}"/><circle cx="${x}" cy="${b - 4.2}" r="1.8" fill="#ff8c1a" stroke="#2a8a3a" stroke-width=".3"/><path d="M${x + 2.2} ${b - 8.6} L${x + 2.4} ${b - 12}" stroke="#f2f2f2" stroke-width=".5"/>`;
  }
  /* Tür: Rahmen, Griff, Gitter unten */
  k += `<rect x="${-W / 2 + 1}" y="${-H + 6.6}" width="${W - 2}" height="${H - 12}" fill="none" stroke="#3a4046" stroke-width="1.6"/>`;
  k += `<rect x="${W / 2 - 4}" y="${-H + 22}" width="1.4" height="24" rx=".7" fill="${STAHL}"/>`;
  k += `<rect x="${-W / 2}" y="-5" width="${W}" height="5" fill="#15181a"/>`;
  for (let x = -W / 2 + 2; x < W / 2 - 1; x += 2.2) k += `<rect x="${r(x)}" y="-4" width="1.1" height="3" rx=".4" fill="#30363b"/>`;
  const zw = (W - 8) / 2;
  const u = (id, de, syl, it, itSyl, en, tipp, x0, b, w) => ({ id, de, syl, it, itSyl, en, tipp, x: cx + x0 + w / 2, y: KS.y1 + b, kunst: flaeche(-w / 2, -15.6, w, 16) });
  const unter = [
    u("wasser", "das stille Mineralwasser", "STIL-le Mi-ne-RAL-was-ser", "l'acqua minerale naturale", "AC-qua mi-ne-RA-le na-tu-RA-le", "still mineral water", "Glatte, schlanke Flasche, blauer Schraubverschluss — und KEIN einziges Bläschen. Daran erkennt man stilles Wasser, auch ohne das Etikett zu lesen.", L, boeden[0], zw),
    u("sprudel", "das Sprudelwasser", "SPRU-del-was-ser", "l'acqua frizzante", "AC-qua friz-ZAN-te", "sparkling water", "Dieselbe Flüssigkeit, aber in der bauchigen Perlflasche mit ihren umlaufenden Rillen, mit grünem Verschluss — und voller feiner aufsteigender Bläschen.", M + 1, boeden[0], zw),
    u("limonade", "die Limonade", "Li-mo-NA-de", "la limonata", "li-mo-NA-ta", "lemonade", "Bauchige Flasche mit kurzem Hals und KRONKORKEN statt Schraubverschluss, große Bläschen, und auf dem Etikett ist die Frucht abgebildet.", L, boeden[1], zw),
    u("schorle", "die Apfelschorle", "AP-fel-schor-le", "il succo di mela con acqua", "SUC-co di ME-la con AC-qua", "apple juice spritzer", "Saft und Wasser gemischt. Auf dem Schildetikett stehen beide nebeneinander: ein halber Apfel und ein Wassertropfen.", M + 1, boeden[1], zw),
    u("cola", "die Cola", "CO-la", "la cola", "CO-la", "cola", "Die taillierte Konturflasche mit der Einschnürung in der Mitte — diese Form hat kein anderes Getränk.", L, boeden[2], W - 8),
    u("milch", "die Milchtüte", "MILCH-tü-te", "il cartone del latte", "car-TO-ne del LAT-te", "milk carton", "Der Giebelkarton mit der geklebten Firstnaht. Die Zahl sagt den Fettgehalt: 3,5 % ist Vollmilch, 1,5 % fettarme Milch.", L, boeden[3], zw),
    u("saft", "der Saftkarton", "SAFT-kar-ton", "il cartone di succo", "car-TO-ne di SUC-co", "juice carton", "Der flache Karton mit dem angeklebten Strohhalm. Die abgebildete Frucht sagt, welcher Saft darin ist.", M + 1, boeden[3], zw),
  ];
  S.teil({ id: "kuehlschrank", de: "der Kühlschrank", syl: "KÜHL-schrank", it: "il frigorifero", itSyl: "fri-go-RI-fe-ro", en: "fridge", x: cx, y: KS.y1, steht: true, kunst: k,
    zoom: { x: 0, y: 34, w: 126, h: 86 }, unter, tipp: "Im Kühlschrank mit der Glastür stehen die kalten Getränke." });
  S.davor(`<rect x="${KS.x0 + 2}" y="${KS.y0 + 7}" width="${W - 4}" height="${H - 12}" fill="${GLAS}"/><path d="M${KS.x0 + 6} ${KS.y1 - 8} L${KS.x0 + 22} ${KS.y0 + 8} L${KS.x0 + 27} ${KS.y0 + 8} L${KS.x0 + 11} ${KS.y1 - 8} Z" fill="#fff" opacity=".12"/>`);
}

/* =====================================================================
   2 — DIE KAFFEEMASCHINE (Filter) mit DER KAFFEEKANNE (Rückbuffet)
   ===================================================================== */
{
  let k = schatten(0, 0.3, 11, 1, 0.3);
  k += `<rect x="-9" y="-22" width="18" height="22" rx="1.4" fill="${S.lg("kmgeh", [[0, "#2c2f33"], [0.5, "#1e2124"], [1, "#141618"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-9" y="-22" width="18" height="5" rx="1.4" fill="#3a3e43"/><rect x="-7" y="-15" width="14" height="3.6" rx=".6" fill="#2a2d31"/>`;
  k += `<rect x="-9" y="-1.6" width="18" height="1.6" fill="${STAHL}"/>`;
  k += `<circle cx="6.4" cy="-19.4" r=".8" fill="#e33"/><rect x="-6" y="-19.8" width="7" height="1" fill="#555"/>`;
  k += `<rect x="-6" y="-1.8" width="12" height=".6" fill="#c44"/>`;  /* Warmhalteplatte glüht leicht */
  S.teil({ id: "kaffeemaschine", de: "die Kaffeemaschine", syl: "KAF-fee-ma-schi-ne", it: "la macchina del caffè", itSyl: "MAC-chi-na del caf-FÈ", en: "coffee machine", x: 104, y: BUF_O, steht: true, kunst: k });
}
{
  /* Glaskanne mit Tülle (links) und Henkel (rechts) auf der Warmhalteplatte */
  let k = `<path d="M-4.4 0 L-5 -5.6 Q-5 -7.4 -3.6 -8 L-4.8 -9.4 L3.4 -9.4 L3.4 -8 Q5 -7.4 5 -5.6 L4.4 0 Z" fill="${KLAR}"/>`;
  k += `<path d="M-4.6 -.4 L-4.9 -4.6 L4.9 -4.6 L4.5 -.4 Z" fill="${S.lg("kaffee", [[0, "#4a2a14"], [1, "#2a160a"]])}"/>`;
  k += `<path d="M-4.8 -9.4 L-6.6 -10.2 L-4.6 -8.4 Z" fill="#cfe3ea"/>`;
  k += `<rect x="-3.6" y="-10.4" width="7" height="1.4" rx=".4" fill="#1d1d1f"/>`;
  k += `<path d="M5 -7.6 Q8 -7.4 7.6 -4 Q7.4 -1.6 4.6 -1.4" stroke="#1d1d1f" stroke-width="1.1" fill="none"/>`;
  k += `<rect x="-3.6" y="-7.6" width=".5" height="6" fill="#fff" opacity=".5"/>`;
  S.teil({ oben: true, id: "kanne", de: "die Kaffeekanne", syl: "KAF-fee-kan-ne", it: "la caffettiera", itSyl: "caf-fet-TIE-ra", en: "coffee pot", x: 103.4, y: BUF_O - 2, kunst: k,
    tipp: "An der Tülle erkennt man die Kanne: aus ihr wird eingeschenkt. Der Henkel sitzt gegenüber." });
}

/* =====================================================================
   3 — DAS WEINREGAL: Glasböden an der Spiegelwand
       mit DER BORDEAUXFLASCHE und DER BURGUNDERFLASCHE (oben)
   ===================================================================== */
const WB = [48, 74];   // Glasböden (Oberkante)
{
  let k = "";
  for (const y of WB) {
    k += `<rect x="-42" y="${y}" width="84" height="1.6" fill="#d8eef2" opacity=".9"/><rect x="-42" y="${y + 1.6}" width="84" height=".6" fill="#6e8a8e"/>`;
    for (const x of [-38, 38]) k += `<path d="M${x - 1.6} ${y + 2.2} L${x + 1.6} ${y + 2.2} L${x} ${y + 4.4} Z" fill="${MESSING}"/>`;
  }
  /* Weißwein und Rosé als Füllung (nicht einzeln gemeint) */
  for (let i = 0; i < 6; i++) k += flasche(-38 + i * 5.4, WB[1], 13, "bordeaux", i % 2 ? S.lg("weissgl", [[0, "#9aa864"], [0.4, "#d8e2a4"], [1, "#8a9a52"]], 0, 0, 1, 0) : S.lg("rosegl", [[0, "#d88a8a"], [0.4, "#f6c4c0"], [1, "#c27272"]], 0, 0, 1, 0), "#e3d8b2", "#fbf6e6");
  for (let i = 0; i < 6; i++) k += flasche(8 + i * 5.4, WB[1], 13, "burgund", GRUEN_GL, "#c9a24a", "#f1ead2");
  /* Licht über den Böden */
  k += `<rect x="-42" y="${WB[0] - 26}" width="84" height="2" fill="#fff6dc" opacity=".8"/>`;
  k += `<path d="M-42 ${WB[0] - 24} L42 ${WB[0] - 24} L44 ${WB[1]} L-44 ${WB[1]} Z" fill="${S.lg("regallicht", [[0, "#fff1c8", 0.28], [1, "#fff1c8", 0]])}"/>`;
  S.teil({ id: "weinregal", de: "das Weinregal", syl: "WEIN-re-gal", it: "lo scaffale dei vini", itSyl: "scaf-FA-le dei VI-ni", en: "wine shelf", x: 210, y: 0, kunst: k + flaeche(-42, WB[0] - 26, 84, 4) });
}
{
  let k = "";
  for (let i = 0; i < 5; i++) k += flasche(-12 + i * 6, 0, 15, "bordeaux", ROTWEIN_GL, "#7d1730", "#efe3c8");
  S.teil({ oben: true, id: "wein", de: "die Bordeauxflasche", syl: "Bor-DEAUX-fla-sche", it: "la bottiglia bordolese", itSyl: "bot-TI-glia bor-do-LE-se", en: "Bordeaux bottle", x: 190, y: WB[0], kunst: k,
    tipp: "Die BORDEAUXFLASCHE: die Schulter steht fast rechtwinklig vom Hals ab. Darin steckt meist Rotwein." });
}
{
  let k = "";
  for (let i = 0; i < 4; i++) k += flasche(-10 + i * 6.8, 0, 15, "burgund", S.lg("burgundgl", [[0, "#2e2a14"], [0.4, "#5a5428"], [1, "#24200e"]], 0, 0, 1, 0), "#a8862a", "#f3ecd2");
  S.teil({ oben: true, id: "burgunder", de: "die Burgunderflasche", syl: "Bur-GUN-der-fla-sche", it: "la bottiglia borgognotta", itSyl: "bot-TI-glia bor-go-GNOT-ta", en: "Burgundy bottle", x: 230, y: WB[0], kunst: k,
    tipp: "Die BURGUNDERFLASCHE ist breiter, und ihre Schulter fällt in einem weichen Bogen ab. Nebeneinander sind die beiden Weinflaschen nicht zu verwechseln." });
}

/* =====================================================================
   4 — DIE GETRÄNKEKARTE (Tafel rechts)
   ===================================================================== */
{
  let k = `<rect x="-28" y="-24" width="56" height="48" rx="1.6" fill="${HOLZ_V}"/>`;
  k += `<rect x="-25.6" y="-21.6" width="51.2" height="43.2" fill="${S.lg("tafel", [[0, "#2b302d"], [1, "#1f2321"]])}"/>`;
  const t = (y, a, b, f = "#f2eee4") => `<text x="-22" y="${y}" font-size="3.1" fill="${f}" font-family="'Segoe Print','Comic Sans MS',cursive">${a}</text><text x="22" y="${y}" font-size="3.1" text-anchor="end" fill="${f}" font-family="'Segoe Print','Comic Sans MS',cursive">${b}</text>`;
  k += `<text x="0" y="-15" font-size="5" text-anchor="middle" fill="#f6e7a1" font-family="'Segoe Print','Comic Sans MS',cursive" font-weight="bold">Getränkekarte</text>`;
  k += `<line x1="-18" y1="-12.6" x2="18" y2="-12.6" stroke="#f6e7a1" stroke-width=".35" stroke-dasharray="1 .8"/>`;
  k += t(-7.6, "Kaffee", "2,80") + t(-3, "Tee", "2,50") + t(1.6, "Kakao", "3,20") + t(6.2, "Apfelschorle", "3,20") + t(10.8, "Pils 0,5 l", "4,20") + t(15.4, "Wein 0,2 l", "5,50") + t(20, "Sekt 0,1 l", "4,50", "#ffc9b8");
  S.teil({ id: "getraenkekarte", de: "die Getränkekarte", syl: "ge-TRÄN-ke-kar-te", it: "la lista delle bevande", itSyl: "LI-sta del-le be-VAN-de", en: "drinks menu", x: 286, y: 50, kunst: k,
    tipp: "Auf der Getränkekarte stehen alle Getränke mit ihren Preisen." });
}

/* =====================================================================
   5 — DIE WIRTIN hinter der Theke (zwischen Kaffeemaschine und Wein)
   ===================================================================== */
{
  const m = B.mensch({ id: "gt_wirtin", geschlecht: "w", pose: "stehen", blick: 14, frisur: "locken", haarfarbe: "rot", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "bluse", farbe: "schwarz" }, schuerze: { stueck: "schuerze", farbe: "#6e2a2a" }, unterteil: { stueck: "hose", farbe: "schwarz" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" } } }, 1.68 * 56);
  S.teil({ id: "wirtin", de: "die Wirtin", syl: "WIR-tin", it: "l'ostessa", itSyl: "o-STES-sa", en: "landlady", x: 146, y: 166, kunst: m.svg,
    tipp: "Die Wirtin fragt: „Was darf ich Ihnen bringen?“" });
}

/* =====================================================================
   7b — DIE LAMPE: Pendelleuchten über der Theke
   ===================================================================== */
{
  let k = "";
  for (const x of [-80, 0, 80]) {
    k += `<line x1="${x}" y1="-30" x2="${x}" y2="-6" stroke="#1d1a17" stroke-width=".5"/>`;
    k += `<path d="M${x - 6} 2 Q${x - 6} -6 ${x} -6.4 Q${x + 6} -6 ${x + 6} 2 Z" fill="${S.lg("lampe", [[0, "#c9a24a"], [1, "#7a5c1e"]])}"/>`;
    k += `<ellipse cx="${x}" cy="2" rx="6" ry="1.4" fill="#fff4cf"/>`;
    k += `<path d="M${x - 6} 2.4 L${x - 18} 30 L${x + 18} 30 L${x + 6} 2.4 Z" fill="${S.lg("kegel", [[0, "#fff1c8", 0.22], [1, "#fff1c8", 0]])}"/>`;
  }
  k += flaeche(-87, -7, 14, 10) + flaeche(-7, -7, 14, 10) + flaeche(73, -7, 14, 10);
  S.teil({ id: "lampe", de: "die Lampe", syl: "LAM-pe", it: "la lampada", itSyl: "LAM-pa-da", en: "lamp", x: 196, y: 26, kunst: k });
}

/* =====================================================================
   6 — DIE THEKE (Holzfront, Messing-Fußleiste, dunkle Platte)
   ===================================================================== */
const TH = { x0: 72, x1: 318, y1: 201 };
{
  const W = TH.x1 - TH.x0, h = TH.y1 - PL;
  let k = schatten(0, 0, W / 2, 2, 0.35);
  k += `<path d="M${-W / 2 - 3} ${-h} L${W / 2 + 2} ${-h} L${W / 2 + 2} ${-h - 7} L${-W / 2 + 3} ${-h - 7} Q${-W / 2 - 3} ${-h - 7} ${-W / 2 - 3} ${-h - 3} Z" fill="${S.lg("platte", [[0, "#3e3934"], [1, "#24201d"]])}"/>`;
  k += `<rect x="${-W / 2 - 3}" y="${-h}" width="${W + 5}" height="2.4" rx="1" fill="#1a1715"/>`;
  k += `<rect x="${-W / 2}" y="${-h + 2.4}" width="${W}" height="${h - 2.4}" fill="${HOLZ_V}"/>`;
  /* Kassettenfelder */
  for (let x = -W / 2 + 4; x < W / 2 - 20; x += 26) k += `<rect x="${x}" y="${-h + 8}" width="22" height="${h - 20}" rx="1" fill="none" stroke="#3c2414" stroke-width=".8"/><rect x="${x + 1.4}" y="${-h + 9.4}" width="19.2" height="${h - 22.8}" rx=".8" fill="#fff" opacity=".04"/>`;
  /* Messing-Fußleiste */
  k += `<rect x="${-W / 2}" y="-4" width="${W}" height="4" fill="#2a180c"/>`;
  k += `<rect x="${-W / 2 + 2}" y="-12" width="${W - 2}" height="2" rx="1" fill="${MESSING}"/>`;
  for (let x = -W / 2 + 14; x < W / 2; x += 40) k += `<path d="M${x} -10 L${x} -5 L${x + 2} -4" stroke="#8f6d24" stroke-width=".8" fill="none"/>`;
  k += `<rect x="${-W / 2}" y="${-h + 2.4}" width="${W}" height="3" fill="${S.lg("thekelicht", [[0, "#ffe9b0", 0.35], [1, "#ffe9b0", 0]])}"/>`;
  S.teil({ id: "theke", de: "die Theke", syl: "THE-ke", it: "il bancone", itSyl: "ban-CO-ne", en: "bar counter", x: (TH.x0 + TH.x1) / 2, y: TH.y1, steht: true, kunst: k });
}

/* =====================================================================
   7 — AUF DER THEKE (von links): Heißgetränke, Milch, Saft, Sekt,
       Zapfhahn, Bier, Wein, Bierdeckel
   ===================================================================== */
const m = (cm) => cm / 100 * MT;
const aufTheke = (t) => S.teil(Object.assign(t, { kunst: `<g transform="scale(${SK})">${t.kunst}</g>` }));
{
  /* DIE TASSE KAFFEE: Untertasse, Löffel, Crema */
  let k = schatten(0, 0.2, 5, 0.7, 0.3);
  k += `<ellipse cx="0" cy="-.5" rx="4.4" ry="1" fill="#f3f1ec" stroke="#cfcac0" stroke-width=".2"/>`;
  k += `<path d="M-2.8 -${r(m(8))} L2.8 -${r(m(8))} L2.4 -1 Q0 -.2 -2.4 -1 Z" fill="${S.lg("tasse", [[0, "#ffffff"], [0.7, "#f1efea"], [1, "#d3cec4"]], 0, 0, 1, 0)}"/>`;
  k += `<ellipse cx="0" cy="-${r(m(8))}" rx="2.8" ry=".7" fill="#c08a52"/><ellipse cx="-.4" cy="-${r(m(8) + 0.1)}" rx="1.4" ry=".3" fill="#e2b77c" opacity=".7"/>`;
  k += `<path d="M2.7 -3.8 q1.6 .1 1.3 1.4 q-.3 .9 -1.6 .7" stroke="#f1efea" stroke-width=".6" fill="none"/>`;
  k += `<path d="M-4 -1 L-1.6 -.4" stroke="#b5bcc2" stroke-width=".4"/><ellipse cx="-4.1" cy="-1" rx=".7" ry=".35" fill="#c9cfd4"/>`;
  k += `<path d="M-.4 -6 q-.8 -1.4 0 -2.6 q.8 -1.2 0 -2.4" stroke="#fff" stroke-width=".35" opacity=".5" fill="none"/>`;
  aufTheke({ oben: true, id: "kaffee", de: "die Tasse Kaffee", syl: "TAS-se KAF-fee", it: "la tazza di caffè", itSyl: "TAZ-za di caf-FÈ", en: "cup of coffee", x: 92, y: PL, kunst: k,
    tipp: "Auf frisch gebrühtem Kaffee liegt die hellbraune Crema. Dazu der Henkel seitlich, die Untertasse und der Löffel." });
}
{
  /* DAS GLAS TEE: Beutel im Glas, Schnur über den Rand, Fähnchen außen */
  let k = becher(4.4, m(11), S.lg("tee", [[0, "#c8742a", 0.85], [1, "#8a4410", 0.9]]), 0.86, false);
  k += `<rect x="-1.4" y="-3.6" width="2" height="2.4" rx=".3" fill="#d9b88a" opacity=".85"/>`;
  k += `<path d="M-.4 -3.6 L1.2 -${r(m(11))} L2.6 -${r(m(11) - 2.6)}" stroke="#f4f0e6" stroke-width=".2" fill="none"/>`;
  k += `<rect x="2" y="-${r(m(11) - 2.6)}" width="1.6" height="1.6" fill="#e9c64a"/>`;
  aufTheke({ oben: true, id: "tee", de: "das Glas Tee", syl: "GLAS TEE", it: "il bicchiere di tè", itSyl: "bic-CHIE-re di TÈ", en: "glass of tea", x: 110, y: PL, kunst: k,
    tipp: "Der Beutel hängt im Glas, die Schnur läuft über den Rand, und das Papierfähnchen klemmt außen. Ohne das Fähnchen wäre es nur braunes Wasser." });
}
{
  /* DER KAKAO: dicker Becher, Milchschaum, Kakaopulver */
  let k = schatten(0, 0.2, 3.4, 0.6, 0.3);
  k += `<path d="M-2.8 -${r(m(10))} L2.8 -${r(m(10))} L2.6 -.4 Q0 .3 -2.6 -.4 Z" fill="${S.lg("becher", [[0, "#d9e4ee"], [0.5, "#ffffff"], [1, "#b8c6d2"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-2.8" y="-${r(m(7))}" width="5.6" height="1.2" fill="#3a6fb0"/>`;
  k += `<path d="M2.8 -4.8 q1.8 0 1.7 1.6 q-.1 1.4 -1.8 1.3" stroke="#e6edf3" stroke-width=".8" fill="none"/>`;
  k += `<path d="M-2.9 -${r(m(10))} Q-2.6 -${r(m(10) + 2.4)} 0 -${r(m(10) + 2.6)} Q2.6 -${r(m(10) + 2.4)} 2.9 -${r(m(10))} Z" fill="#fffaf2"/>`;
  for (let i = 0; i < 9; i++) k += `<circle cx="${r(-2 + rnd() * 4)}" cy="${r(-m(10) - 0.6 - rnd() * 1.6)}" r=".25" fill="#6b3a1c"/>`;
  aufTheke({ oben: true, id: "kakao", de: "der Kakao", syl: "Ka-KAO", it: "la cioccolata calda", itSyl: "cioc-co-LA-ta CAL-da", en: "hot chocolate", x: 126, y: PL, kunst: k,
    tipp: "Dickwandiger Becher, Milchschaumhaube und darüber gestäubtes Kakaopulver." });
}
{
  const k = becher(4.4, m(12), "#fbfbf6", 0.85, false) + `<path d="M-2 -${r(m(12) * 0.85)} h4" stroke="#fff" stroke-width=".4"/>`;
  aufTheke({ oben: true, id: "milchglas", de: "das Glas Milch", syl: "GLAS MILCH", it: "il bicchiere di latte", itSyl: "bic-CHIE-re di LAT-te", en: "glass of milk", x: 143, y: PL, kunst: k,
    tipp: "Milch ist nicht durchsichtig — der Glasrand verschwindet dahinter. Genau das unterscheidet sie von jedem Saft." });
}
{
  let k = becher(4.4, m(12), S.lg("osaft", [[0, "#ffb238", 0.95], [1, "#f08a1a", 0.95]]), 0.84, false);
  for (let i = 0; i < 8; i++) k += `<rect x="${r(-1.6 + rnd() * 3)}" y="${r(-1 - rnd() * m(9))}" width=".5" height=".25" fill="#ffd27a" opacity=".9"/>`;
  k += `<path d="M.6 -${r(m(12) * 0.84)} L2.2 -${r(m(12) + 2.4)}" stroke="#e33" stroke-width=".5"/>`;
  aufTheke({ oben: true, id: "saftglas", de: "das Glas Saft", syl: "GLAS SAFT", it: "il bicchiere di succo", itSyl: "bic-CHIE-re di SUC-co", en: "glass of juice", x: 158, y: PL, kunst: k,
    tipp: "Im Saft schwimmt Fruchtfleisch, und der Spiegel ist trüb — in der Limonade steigen dafür Bläschen auf." });
}
{
  /* DER SEKTKÜHLER mit Eis */
  let k = schatten(0, 0.2, 5.4, 0.8, 0.3);
  k += `<path d="M-4.6 -${r(m(20))} L4.6 -${r(m(20))} L3.8 -.4 L-3.8 -.4 Z" fill="${STAHL}"/>`;
  k += `<ellipse cx="0" cy="-${r(m(20))}" rx="4.6" ry=".9" fill="#9aa3aa"/>`;
  for (const x of [-4.9, 4.9]) k += `<circle cx="${x}" cy="-${r(m(20) - 2)}" r=".9" fill="none" stroke="#9aa3aa" stroke-width=".4"/>`;
  k += `<rect x="-2.6" y="-${r(m(20) - 3)}" width=".5" height="${r(m(20) - 4)}" fill="#fff" opacity=".6"/>`;
  aufTheke({ oben: true, id: "sektkuehler", de: "der Sektkühler", syl: "SEKT-küh-ler", it: "il secchiello del ghiaccio", itSyl: "sec-CHIEL-lo del GHIAC-cio", en: "champagne bucket", x: 177, y: PL, kunst: k,
    tipp: "Im Sektkühler liegt Eis — so bleibt der Sekt kalt." });
}
{
  /* DIE SEKTFLASCHE steckt im Kühler: Agraffe, Folie */
  const top = -m(20) - m(14);
  let k = `<path d="M-2.4 0 L-2.4 ${r(top + 6)} Q-2.4 ${r(top + 4)} -.9 ${r(top + 2.6)} L-.9 ${r(top)} L.9 ${r(top)} L.9 ${r(top + 2.6)} Q2.4 ${r(top + 4)} 2.4 ${r(top + 6)} L2.4 0 Z" fill="${GRUEN_GL}"/>`;
  k += `<path d="M-1.1 ${r(top - 0.4)} L1.1 ${r(top - 0.4)} L1.6 ${r(top + 4)} L-1.6 ${r(top + 4)} Z" fill="#d8b44a"/>`;
  k += `<path d="M-.9 ${r(top - 0.4)} L.9 ${r(top + 1.4)} M.9 ${r(top - 0.4)} L-.9 ${r(top + 1.4)}" stroke="#eee" stroke-width=".25"/>`;
  k += `<rect x="-2.4" y="${r(top + 7)}" width="4.8" height="2.4" fill="#1d2f5c"/>`;
  /* Eiswürfel am Rand */
  for (const [x, y] of [[-3.6, -m(20) + 0.3], [3.4, -m(20) + 0.4], [-1.4, -m(20) + 0.6]]) k += `<rect x="${r(x - 0.9)}" y="${r(y - 1.2)}" width="1.8" height="1.6" rx=".4" fill="#eef8fb" stroke="#bcd8e2" stroke-width=".2"/>`;
  aufTheke({ oben: true, id: "sekt", de: "die Sektflasche", syl: "SEKT-fla-sche", it: "la bottiglia di spumante", itSyl: "bot-TI-glia di spu-MAN-te", en: "sparkling wine bottle", x: 177, y: PL - 1, kunst: k + flaeche(-2.6, top - 0.6, 5.2, -top - m(20) + 2),
    tipp: "Dickes, schweres Glas, weil in der Flasche Druck herrscht. Der Pilzkorken wird von einer Agraffe, einem Drahtkorb, festgehalten." });
}
{
  /* DIE SEKTFLÖTE */
  let k = schatten(0, 0.2, 2.2, 0.5, 0.25);
  k += `<ellipse cx="0" cy="-.3" rx="2" ry=".5" fill="#dbe9ee" opacity=".8"/><rect x="-.25" y="-${r(m(9))}" width=".5" height="${r(m(9))}" fill="#e3f0f4" opacity=".9"/>`;
  k += `<path d="M-1.5 -${r(m(23))} L1.5 -${r(m(23))} L1.1 -${r(m(9) + 0.6)} Q0 -${r(m(9) - 0.2)} -1.1 -${r(m(9) + 0.6)} Z" fill="${KLAR}"/>`;
  k += `<path d="M-1.4 -${r(m(20))} L1.4 -${r(m(20))} L1.05 -${r(m(9) + 0.8)} Q0 -${r(m(9))} -1.05 -${r(m(9) + 0.8)} Z" fill="#f3e3a0" opacity=".9"/>`;
  for (let i = 0; i < 6; i++) k += `<circle cx="${r(-0.4 + (i % 2) * 0.7)}" cy="${r(-m(9.5) - i * 1.1)}" r=".18" fill="#fff"/>`;
  aufTheke({ oben: true, id: "sektfloete", de: "die Sektflöte", syl: "SEKT-flö-te", it: "il flûte", itSyl: "FLUTE", en: "champagne flute", x: 196, y: PL, kunst: k,
    tipp: "Hoch und schmal, damit die Perlen einen langen Weg nach oben haben und der Sekt lange prickelt." });
}
{
  /* DER ZAPFHAHN: Zapfsäule mit zwei Hähnen und Tropfblech */
  let k = schatten(0, 0.2, 9, 0.9, 0.3);
  k += `<rect x="-8" y="-1.6" width="16" height="1.6" rx=".4" fill="${STAHL}"/>`;
  for (let x = -7; x < 7.5; x += 1.2) k += `<rect x="${r(x)}" y="-1.4" width=".5" height="1" fill="#7d868d"/>`;
  k += `<rect x="-1.4" y="-${r(m(42))}" width="2.8" height="${r(m(42) - 1.6)}" fill="${STAHL}"/>`;
  k += `<path d="M-7 -${r(m(42))} Q-7 -${r(m(42) + 3)} -4 -${r(m(42) + 3)} L4 -${r(m(42) + 3)} Q7 -${r(m(42) + 3)} 7 -${r(m(42))} Z" fill="${STAHL}"/>`;
  for (const sx of [-1, 1]) {
    const x = sx * 4.6, y = -m(42) + 1.6;
    k += `<rect x="${r(x - 0.8)}" y="${r(y - 1)}" width="1.6" height="4.4" fill="#aeb6bd"/><path d="M${r(x - 0.6)} ${r(y + 3.4)} l-.3 1.6 l1.8 0 l-.3 -1.6 Z" fill="#8f979e"/>`;
    k += `<rect x="${r(x - 0.9)}" y="${r(y - 9)}" width="1.8" height="8" rx=".9" fill="${sx < 0 ? "#1d1d1f" : "#f2d27a"}"/><rect x="${r(x - 1.3)}" y="${r(y - 7)}" width="2.6" height="2.6" rx=".4" fill="${sx < 0 ? "#c9a227" : "#2a6a3a"}"/>`;
  }
  aufTheke({ id: "zapfhahn", de: "der Zapfhahn", syl: "ZAPF-hahn", it: "la spina della birra", itSyl: "SPI-na del-la BIR-ra", en: "beer tap", x: 216, y: PL, steht: true, kunst: k,
    tipp: "Aus dem Zapfhahn kommt frisch gezapftes Bier vom Fass." });
}
{
  /* DAS BIERGLAS: Pilsglas mit Schaumkrone und Perlenschnüren */
  let k = becher(5.2, m(20), S.lg("bier", [[0, "#f6cf55", 0.95], [1, "#d99a1c", 0.95]]), 0.84, true);
  for (const x of [-1, 0.8]) for (let i = 0; i < 6; i++) k += `<circle cx="${x}" cy="${r(-1 - i * 1.4)}" r=".18" fill="#fff" opacity=".9"/>`;
  k = `<ellipse cx="0" cy="-.2" rx="3.4" ry=".7" fill="#f0e8d6" stroke="#c9b48a" stroke-width=".2"/>` + k;
  aufTheke({ oben: true, id: "bierglas", de: "das Bierglas", syl: "BIER-glas", it: "il bicchiere di birra", itSyl: "bic-CHIE-re di BIR-ra", en: "beer glass", x: 238, y: PL, kunst: k,
    tipp: "Am Glas erkennt man Bier an der dicken Schaumkrone und an den Perlenschnüren, die vom Boden aufsteigen." });
}
{
  /* DIE BIERFLASCHE mit Bügelverschluss */
  const h = m(26);
  let k = schatten(0, 0.2, 2.6, 0.6, 0.3);
  k += flasche(0, 0, h, "still", BRAUN_GL, "#f4f2ec", "#f1e3b8");
  k += `<path d="M-1 -${r(h - 0.2)} L-1.6 -${r(h - 3)} M1 -${r(h - 0.2)} L1.6 -${r(h - 3)}" stroke="#bfc6cc" stroke-width=".3"/>`;
  k += `<rect x="-1" y="-${r(h + 0.8)}" width="2" height="1" rx=".4" fill="#f4f2ec"/><rect x="-1" y="-${r(h - 0.2)}" width="2" height=".4" fill="#d23b30"/>`;
  aufTheke({ oben: true, id: "bier", de: "die Bierflasche", syl: "BIER-fla-sche", it: "la bottiglia di birra", itSyl: "bot-TI-glia di BIR-ra", en: "beer bottle", x: 255, y: PL, kunst: k,
    tipp: "Braunes Glas schützt das Bier vor Licht. Oben sitzt der Bügelverschluss: Porzellanstöpsel mit Gummiring im Drahtbügel." });
}
{
  /* DAS WEINGLAS mit Rotwein */
  let k = schatten(0, 0.2, 2.6, 0.5, 0.25);
  k += `<ellipse cx="0" cy="-.3" rx="2.4" ry=".55" fill="#dbe9ee" opacity=".85"/><rect x="-.25" y="-${r(m(10))}" width=".5" height="${r(m(10))}" fill="#e3f0f4" opacity=".9"/>`;
  k += `<path d="M-2.2 -${r(m(21))} Q-3.3 -${r(m(15))} -1.4 -${r(m(10.4))} Q0 -${r(m(9.8))} 1.4 -${r(m(10.4))} Q3.3 -${r(m(15))} 2.2 -${r(m(21))} Z" fill="${KLAR}"/>`;
  k += `<path d="M-3 -${r(m(14.5))} L3 -${r(m(14.5))} Q3 -${r(m(12))} 1.4 -${r(m(10.6))} Q0 -${r(m(10))} -1.4 -${r(m(10.6))} Q-3 -${r(m(12))} -3 -${r(m(14.5))} Z" fill="#6a0f22" opacity=".95"/>`;
  k += `<path d="M-1.6 -${r(m(19.5))} Q-2.4 -${r(m(16))} -1.6 -${r(m(13))}" stroke="#fff" stroke-width=".35" opacity=".7" fill="none"/>`;
  aufTheke({ oben: true, id: "weinglas", de: "das Weinglas", syl: "WEIN-glas", it: "il bicchiere da vino", itSyl: "bic-CHIE-re da VI-no", en: "wine glass", x: 273, y: PL, kunst: k,
    tipp: "Bauchiger Kelch auf dünnem Stiel. Man fasst das Glas am Stiel an, damit die Hand den Wein nicht erwärmt." });
}
{
  /* DER BIERDECKEL: Stapel im Halter am Thekenende */
  let k = schatten(0, 0.2, 4, 0.6, 0.25);
  k += `<rect x="-3.8" y="-${r(m(6))}" width="7.6" height="${r(m(6))}" rx=".6" fill="${STAHL}"/>`;
  for (let i = 0; i < 6; i++) k += `<path d="M-3.4 ${r(-1 - i * 0.9)} L3.4 ${r(-1 - i * 0.9)}" stroke="${i % 2 ? "#e9dfc6" : "#d8cba8"}" stroke-width=".8"/>`;
  k += `<ellipse cx="0" cy="-${r(m(6) + 0.6)}" rx="3.4" ry="1.1" fill="#f3ecd8" stroke="#c9b48a" stroke-width=".2"/><circle cx="0" cy="-${r(m(6) + 0.6)}" r=".7" fill="none" stroke="#c22b2b" stroke-width=".3"/>`;
  aufTheke({ oben: true, id: "bierdeckel", de: "der Bierdeckel", syl: "BIER-de-ckel", it: "il sottobicchiere", itSyl: "sot-to-bic-CHIE-re", en: "beer mat", x: 294, y: PL, kunst: k + flaeche(-4, -6.5, 8, 6.7),
    tipp: "Auf den Bierdeckel macht der Wirt einen Strich für jedes Bier." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/getraenke.js"));
console.log(aus);
