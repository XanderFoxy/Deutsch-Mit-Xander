#!/usr/bin/env node
/* =====================================================================
   DER KIOSK (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   XANDER (Funk 263/286): jeder Ort authentisch wie das echte Vorbild,
   alles logisch platziert, jedes Ding einzeln antippbar.

   RECHERCHE (LWL-Industriemuseum „Seltersbude, Trinkhalle“, Reportage
   „Wie ein Büdchen in Duisburg zum sozialen Anker wird“, Ruhrgebiet:
   rund 18 000 Trinkhallen) — so sieht ein Büdchen / eine Trinkhalle aus:
   - Ein kleines Häuschen am Gehweg, oben das Schild „Trinkhalle“, ein
     Lotto-Schild der Annahmestelle; die Fassade voller Plakate.
   - Das VERKAUFSFENSTER: eine Klappe/Schiebefenster mit Ablage. Dahinter
     der Verkäufer, hinter ihm die Wand voller Süßigkeiten. Auf der
     Ablage: Kaugummis, Schokoriegel, die Schale fürs Wechselgeld,
     Lottoscheine, Fahrkarten; die „gemischte Tüte“ wird hier gepackt.
   - Durch die Scheibe sieht man den GETRÄNKEKÜHLSCHRANK (Wasser, Cola,
     Limo — das Feierabendbier).
   - Draußen: die EISTRUHE, der ZEITUNGSSTÄNDER (Zeitungen, Zeitschriften,
     Rätselhefte), Getränkekisten mit LEERGUT, ein Mülleimer am Pfosten.
   Maßstab: Fassade ≈ 40 Einheiten je Meter (Häuschen 3 m hoch),
   Gehweg vorne ≈ 65 je Meter, Augenhöhe y ≈ 86.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "kiosk", titel: "Der Kiosk", emoji: "🗞️", thema: "Einkaufen", kuerzel: "b02c", fassung: 852 });
const rnd = zufall(1956);
const r = B.r;

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const GRUEN = "#1f5a3d";
const STAHL = S.lg("stahl", [[0, "#eef1f3"], [0.45, "#c9cfd4"], [0.55, "#b5bcc2"], [1, "#e1e5e8"]], 0, 0, 1, 0);
const ALU = S.lg("alu", [[0, "#d9dde0"], [1, "#a8b0b6"]]);
const GLAS = S.lg("glas", [[0, "#ffffff", 0.34], [0.45, "#dff0f7", 0.08], [1, "#ffffff", 0.2]], 0, 0, 1, 1);
const BUNT = ["#e63946", "#f4a261", "#2a9d8f", "#e9c46a", "#457b9d", "#8338ec", "#ff006e", "#3a86ff", "#fb5607", "#06d6a0"];
/* Wandfliesen der Bude als Muster (spart Tausende Einzelteile) */
S.def(`<pattern id="${S.id("fliese")}" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#f1efe8"/><rect x=".15" y=".15" width="5.7" height="5.7" fill="#f8f7f2" stroke="#d6d2c6" stroke-width=".3"/></pattern>`);
S.def(`<pattern id="${S.id("ziegel")}" width="8" height="4" patternUnits="userSpaceOnUse"><rect width="8" height="4" fill="#9c4a32"/><rect x=".2" y=".2" width="7.6" height="1.6" fill="#ad5a3e"/><rect x="-3.8" y="2.2" width="7.6" height="1.6" fill="#a4523a"/><rect x="4.2" y="2.2" width="7.6" height="1.6" fill="#b15f42"/></pattern>`);

/* =====================================================================
   KULISSE — Himmel, Zechenhäuser aus Ziegel, Straße, Gehweg
   ===================================================================== */
const BASIS = 150;   /* Fuß der Bude */
const HORI = 86;
S.hinten(`<rect x="0" y="0" width="320" height="130" fill="${S.lg("himmel", [[0, "#8fbde6"], [0.7, "#cfe3f3"], [1, "#eef4f7"]])}"/>`);
S.hinten(`<ellipse cx="70" cy="18" rx="28" ry="6" fill="#fff" opacity=".7"/><ellipse cx="90" cy="15" rx="18" ry="5" fill="#fff" opacity=".8"/><ellipse cx="260" cy="24" rx="30" ry="5" fill="#fff" opacity=".6"/>`);
{
  /* Häuserzeile hinten (Ziegel, weiße Fenster) */
  let h = "";
  const haeuser = [[-4, 60, 46], [56, 112, 40], [112, 176, 50], [176, 236, 42], [236, 324, 48]];
  for (const [a, b, top] of haeuser) {
    h += `<rect x="${a}" y="${top}" width="${b - a}" height="${122 - top}" fill="url(#${S.id("ziegel")})"/>`;
    h += `<path d="M${a - 2} ${top} L${(a + b) / 2} ${top - 14} L${b + 2} ${top} Z" fill="#5a3d33"/>`;
    for (let x = a + 6; x < b - 8; x += 14) for (const y of [top + 8, top + 30]) if (y + 14 < 118) h += `<rect x="${x}" y="${y}" width="8" height="12" fill="#e9eef0" stroke="#f5f3ee" stroke-width="1"/><line x1="${x + 4}" y1="${y}" x2="${x + 4}" y2="${y + 12}" stroke="#f5f3ee" stroke-width=".6"/><rect x="${x}" y="${y}" width="8" height="12" fill="#7fa3bd" opacity=".35"/>`;
  }
  h += `<rect x="0" y="40" width="320" height="82" fill="#ffffff" opacity=".18"/>`;   /* Luftperspektive */
  S.hinten(h);
}
/* Straße, Bordstein, Gehweg mit Platten in Flucht */
S.hinten(`<rect x="0" y="120" width="320" height="12" fill="${S.lg("strasse", [[0, "#6b6d70"], [1, "#55575a"]])}"/><rect x="0" y="125.4" width="320" height=".6" fill="#e8e3c8" stroke-dasharray="8 6" opacity=".7"/>`);
S.hinten(`<rect x="0" y="131" width="320" height="2.4" fill="#b8b4ab"/>`);
{
  let g = `<rect x="0" y="133.4" width="320" height="${200 - 133.4}" fill="${S.lg("gehweg", [[0, "#bdb8ae"], [1, "#a8a296"]])}"/>`;
  for (let i = -10; i <= 10; i++) g += `<line x1="${160 + i * 18}" y1="133.4" x2="${160 + i * 64}" y2="200" stroke="#8f897d" stroke-width=".35" opacity=".7"/>`;
  for (const y of [138, 144, 152, 162, 175, 192]) g += `<line x1="0" y1="${y}" x2="320" y2="${y}" stroke="#8f897d" stroke-width=".35" opacity=".6"/>`;
  g += `<rect x="0" y="133.4" width="320" height="${200 - 133.4}" fill="${S.lg("gehweglicht", [[0, "#000", 0.08], [1, "#fff", 0.08]])}"/>`;
  /* Straßenlaterne rechts hinten */
  g += `<rect x="304" y="58" width="1.6" height="76" fill="#4a5056"/><path d="M305 58 q0 -6 -8 -6 l-3 0" stroke="#4a5056" stroke-width="1.4" fill="none"/><path d="M290 51 L298 51 L297 54 L291 54 Z" fill="#3b4045"/>`;
  S.hinten(g);
}

/* =====================================================================
   1 — DER KIOSK (das Häuschen, Trinkhalle) — mit Innenraum
   ===================================================================== */
const K = { x0: 20, x1: 230, y0: 30 };
const LUKE = { x0: 28, x1: 116, y0: 64, y1: 110 };
const FENSTER = { x0: 164, x1: 226, y0: 64, y1: 122 };
{
  const cx = (K.x0 + K.x1) / 2;
  let k = `<g transform="translate(${-cx} ${-BASIS})">`;
  k += `<ellipse cx="${cx}" cy="${BASIS + 0.6}" rx="${(K.x1 - K.x0) / 2 + 6}" ry="2.2" fill="#1b120a" opacity=".25" filter="url(#bw_weich)"/>`;
  /* Wand mit Fliesen, Sockel */
  k += `<rect x="${K.x0}" y="48" width="${K.x1 - K.x0}" height="${BASIS - 48}" fill="url(#${S.id("fliese")})"/>`;
  k += `<rect x="${K.x0}" y="${BASIS - 8}" width="${K.x1 - K.x0}" height="8" fill="#6f6a63"/>`;
  k += `<rect x="${K.x0}" y="48" width="${K.x1 - K.x0}" height="${BASIS - 48}" fill="${S.lg("wandschatten", [[0, "#000", 0.12], [0.2, "#000", 0], [1, "#000", 0.06]])}"/>`;
  /* Flachdach mit Überstand und Schildband */
  k += `<rect x="${K.x0 - 6}" y="${K.y0}" width="${K.x1 - K.x0 + 12}" height="4" rx=".6" fill="#3d4146"/><rect x="${K.x0 - 6}" y="${K.y0 + 3.4}" width="${K.x1 - K.x0 + 12}" height="1" fill="#22262a"/>`;
  k += `<rect x="${K.x0 - 3}" y="${K.y0 + 4}" width="${K.x1 - K.x0 + 6}" height="14" fill="${S.lg("schildband", [[0, "#26704d"], [1, GRUEN]])}"/>`;
  k += `<text x="${cx - 32}" y="${K.y0 + 15}" font-size="10" text-anchor="middle" fill="#f6d55c" font-family="Georgia,'Times New Roman',serif" font-weight="bold" letter-spacing=".8">Trinkhalle</text>`;
  k += `<text x="${cx + 52}" y="${K.y0 + 13.6}" font-size="4.4" text-anchor="middle" fill="#ffffff" font-family="Arial" font-weight="bold" letter-spacing=".4">KIOSK · ZEITUNGEN · GETRÄNKE</text>`;
  k += `<rect x="${K.x0 - 3}" y="${K.y0 + 4}" width="${K.x1 - K.x0 + 6}" height="1.2" fill="#fff" opacity=".2"/>`;
  /* Innenraum hinter der Luke: Süßigkeitenwand, Licht */
  k += `<rect x="${LUKE.x0}" y="${LUKE.y0}" width="${LUKE.x1 - LUKE.x0}" height="${LUKE.y1 - LUKE.y0}" fill="${S.lg("innen", [[0, "#fff4d6"], [1, "#d9c49a"]])}"/>`;
  for (let j = 0; j < 4; j++) {
    const yb = LUKE.y0 + 10 + j * 9;
    let x = LUKE.x0 + 1.5;
    while (x < LUKE.x1 - 3) {
      const w = 2 + rnd() * 3, h = 4 + rnd() * 3.5;
      if (x + w > LUKE.x1 - 1.5) break;
      const f = BUNT[Math.floor(rnd() * BUNT.length)];
      k += rnd() < 0.3 ? `<rect x="${r(x)}" y="${r(yb - h)}" width="${r(w)}" height="${r(h)}" rx=".8" fill="${f}"/><rect x="${r(x + w * 0.2)}" y="${r(yb - h * 0.7)}" width="${r(w * 0.6)}" height="${r(h * 0.3)}" fill="#fff" opacity=".5"/>` : `<rect x="${r(x)}" y="${r(yb - h)}" width="${r(w)}" height="${r(h)}" fill="${f}"/><rect x="${r(x)}" y="${r(yb - h)}" width="${r(w)}" height=".6" fill="#fff" opacity=".4"/>`;
      x += w + 0.25;
    }
    k += `<rect x="${LUKE.x0}" y="${yb}" width="${LUKE.x1 - LUKE.x0}" height="1" fill="#8a6a42"/>`;
  }
  /* Bonbongläser oben auf dem Regal */
  for (let i = 0; i < 6; i++) k += `<rect x="${LUKE.x0 + 6 + i * 14}" y="${LUKE.y0 - 0.2}" width="7" height="1" fill="#000" opacity="0"/>`;
  /* Rollladenkasten über der Luke */
  k += `<rect x="${LUKE.x0 - 3}" y="${LUKE.y0 - 7}" width="${LUKE.x1 - LUKE.x0 + 6}" height="6" rx=".5" fill="#c8ccd0"/><rect x="${LUKE.x0 - 3}" y="${LUKE.y0 - 2}" width="${LUKE.x1 - LUKE.x0 + 6}" height="1" fill="#8e959b"/>`;
  /* Tür mit Glas und „Geöffnet“ */
  const T = { x0: 124, x1: 156, y0: 66 };
  k += `<rect x="${T.x0 - 1.5}" y="${T.y0 - 1.5}" width="${T.x1 - T.x0 + 3}" height="${BASIS - T.y0 + 1.5}" fill="#3d4146"/>`;
  k += `<rect x="${T.x0 + 2}" y="${T.y0 + 2}" width="${T.x1 - T.x0 - 4}" height="${BASIS - T.y0 - 12}" fill="${S.lg("tuerinnen", [[0, "#6f6250"], [1, "#4a4035"]])}"/>`;
  k += `<rect x="${T.x0 + 2}" y="${T.y0 + 2}" width="${T.x1 - T.x0 - 4}" height="${BASIS - T.y0 - 12}" fill="${GLAS}"/>`;
  k += `<rect x="${T.x0 + 7}" y="${T.y0 + 4}" width="18" height="7" rx="1" fill="#fff"/><text x="${(T.x0 + T.x1) / 2}" y="${T.y0 + 9}" font-size="4" text-anchor="middle" fill="#c1121f" font-family="Arial" font-weight="bold">Geöffnet</text>`;
  k += `<rect x="${T.x1 - 6}" y="${T.y0 + 42}" width="3" height="1.2" rx=".5" fill="${STAHL}"/>`;
  /* Fenster rechts: Öffnung (dunkel), der Kühlschrank steht dahinter */
  k += `<rect x="${FENSTER.x0}" y="${FENSTER.y0}" width="${FENSTER.x1 - FENSTER.x0}" height="${FENSTER.y1 - FENSTER.y0}" fill="#3f3a34"/>`;
  k += `<rect x="${FENSTER.x0 - 2}" y="${FENSTER.y1}" width="${FENSTER.x1 - FENSTER.x0 + 4}" height="2.4" fill="#d6d2c8"/>`;
  /* Plakate und Aufkleber auf der Fassade */
  const plakat = (x, y, w, h, f, t1, t2) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}" stroke="#00000022" stroke-width=".2"/><text x="${x + w / 2}" y="${y + h * 0.45}" font-size="${(w / 6).toFixed(1)}" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">${t1}</text><text x="${x + w / 2}" y="${y + h * 0.78}" font-size="${(w / 9).toFixed(1)}" text-anchor="middle" fill="#fff" font-family="Arial">${t2}</text>`;
  k += plakat(166, 127, 22, 11, "#e63946", "Kalte", "Getränke") + plakat(130, 50.5, 20, 11, "#3a86ff", "Paket", "shop");
  k += plakat(117.2, 72, 4.6, 22, "#2a9d8f", "", "");
  k += `<text x="120.3" y="83" font-size="2.4" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold" transform="rotate(-90 120.2 83)">ZEITUNG</text>`;
  k += `</g>`;
  S.teil({ id: "ki_kiosk", de: "der Kiosk", syl: "KI-osk", it: "il chiosco", itSyl: "CHIO-sco", en: "kiosk", x: cx, y: BASIS, steht: true, kunst: k,
    tipp: "Im Ruhrgebiet sagt man „Büdchen“ oder „Trinkhalle“, in Berlin „Späti“." });
}

/* =====================================================================
   2 — DAS LOTTO-SCHILD (Annahmestelle)
   ===================================================================== */
{
  let k = `<rect x="-17" y="-6" width="34" height="12" rx="1.6" fill="${S.lg("lotto", [[0, "#ffe14d"], [1, "#f2c200"]])}" stroke="#c99f00" stroke-width=".4"/>`;
  k += `<circle cx="-11" cy="0" r="4" fill="#d62828"/><text x="-11" y="1.6" font-size="4.6" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">6</text>`;
  k += `<text x="4" y="1" font-size="6" text-anchor="middle" fill="#d62828" font-family="Arial Black,Arial" font-weight="bold">LOTTO</text><text x="4" y="4.4" font-size="2.2" text-anchor="middle" fill="#7a5a00" font-family="Arial">Annahmestelle</text>`;
  S.teil({ id: "ki_schild", de: "das Schild", syl: "SCHILD", it: "l'insegna", itSyl: "in-SE-gna", en: "sign", x: 195, y: 56, kunst: k,
    tipp: "Das Schild zeigt: Hier kann man Lotto spielen." });
}

/* =====================================================================
   3 — DER GETRÄNKEKÜHLSCHRANK (hinter dem Fenster) — Lupe
   ===================================================================== */
{
  const F = FENSTER, cx = (F.x0 + F.x1) / 2, W = F.x1 - F.x0 - 8, x0 = F.x0 + 4, top = F.y0 + 2, unten = F.y1;
  let k = `<g transform="translate(${-cx} ${-unten})">`;
  k += `<rect x="${x0}" y="${top}" width="${W}" height="${unten - top}" rx="1" fill="#e9ecee"/>`;
  k += `<rect x="${x0}" y="${top}" width="${W}" height="7" rx="1" fill="#d62828"/><text x="${cx}" y="${top + 5}" font-size="4" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">EISKALT</text>`;
  k += `<rect x="${x0 + 2}" y="${top + 8}" width="${W - 4}" height="${unten - top - 9}" fill="${S.lg("kuehl", [[0, "#f4fbff"], [1, "#cfe6f2"]])}"/>`;
  const reihen = [[top + 22, "cola"], [top + 37, "wasser"], [top + 52, "limo"]];
  const unter = [];
  const flasche = (x, yb, h, koerper, etikett, deckel) => `<path d="M${r(x)} ${yb} L${r(x)} ${r(yb - h * 0.68)} Q${r(x)} ${r(yb - h * 0.8)} ${r(x + 1)} ${r(yb - h * 0.86)} L${r(x + 1)} ${r(yb - h)} L${r(x + 2.4)} ${r(yb - h)} L${r(x + 2.4)} ${r(yb - h * 0.86)} Q${r(x + 3.4)} ${r(yb - h * 0.8)} ${r(x + 3.4)} ${r(yb - h * 0.68)} L${r(x + 3.4)} ${yb} Z" fill="${koerper}"/><rect x="${r(x)}" y="${r(yb - h * 0.55)}" width="3.4" height="${r(h * 0.24)}" fill="${etikett}"/><rect x="${r(x + 0.9)}" y="${r(yb - h - 0.8)}" width="1.6" height=".9" fill="${deckel}"/><rect x="${r(x + 0.5)}" y="${r(yb - h * 0.66)}" width=".5" height="${r(h * 0.6)}" fill="#fff" opacity=".35"/>`;
  for (const [yb, art] of reihen) {
    for (let i = 0; i < 12; i++) {
      const x = x0 + 3 + i * 4.3;
      if (art === "cola") k += flasche(x, yb, 12, "#3a1a0e", "#d62828", "#d62828");
      else if (art === "wasser") k += flasche(x, yb, 12.6, "#cfe8f5", "#2f80c3", "#2f80c3");
      else k += flasche(x, yb, 12, i % 2 ? "#f8a51c" : "#f6d046", i % 2 ? "#2a9d8f" : "#e63946", "#ffffff");
    }
    k += `<rect x="${x0 + 2}" y="${yb}" width="${W - 4}" height="1.2" fill="#9fb3bf"/>`;
  }
  k += `<rect x="${x0}" y="${unten - 3}" width="${W}" height="3" fill="#3a3f44"/>`;
  k += `</g>`;
  const dat = { cola: ["ki_cola", "die Cola", "CO-la", "la cola", "CO-la", "cola", null], wasser: ["ki_wasser", "das Mineralwasser", "Mi-ne-RAL-was-ser", "l'acqua minerale", "AC-qua mi-ne-RA-le", "mineral water", "Mit Kohlensäure heißt es „Sprudel“."], limo: ["ki_limo", "die Limonade", "Li-mo-NA-de", "la limonata", "li-mo-NA-ta", "lemonade", null] };
  for (const [yb, art] of reihen) {
    const d = dat[art];
    unter.push({ id: d[0], de: d[1], syl: d[2], it: d[3], itSyl: d[4], en: d[5], tipp: d[6] || undefined, x: cx, y: yb, kunst: flaeche(-W / 2 + 2, -14, W - 4, 14.6) });
  }
  S.teil({ id: "ki_kuehlschrank", de: "der Getränkekühlschrank", syl: "Ge-TRÄN-ke-kühl-schrank", it: "il frigorifero delle bibite", itSyl: "fri-go-RI-fe-ro del-le BI-bi-te", en: "drinks fridge",
    x: cx, y: F.y1, steht: true, kunst: k, zoom: { x: F.x0 - 14, y: F.y0 - 2, w: F.x1 - F.x0 + 28, h: F.y1 - F.y0 + 4 }, unter });
  /* Fensterrahmen und Glas davor (fängt keinen Tipp) */
  S.davor(`<rect x="${F.x0}" y="${F.y0}" width="${F.x1 - F.x0}" height="${F.y1 - F.y0}" fill="${GLAS}"/><path d="M${F.x0 + 6} ${F.y1} L${F.x0 + 24} ${F.y0} L${F.x0 + 30} ${F.y0} L${F.x0 + 12} ${F.y1} Z" fill="#fff" opacity=".16"/><rect x="${F.x0}" y="${F.y0}" width="${F.x1 - F.x0}" height="${F.y1 - F.y0}" fill="none" stroke="#3d4146" stroke-width="1.6"/><line x1="${(F.x0 + F.x1) / 2}" y1="${F.y0}" x2="${(F.x0 + F.x1) / 2}" y2="${F.y1}" stroke="#3d4146" stroke-width="1"/>`);
}

/* =====================================================================
   4 — DER VERKÄUFER (in der Luke)
   ===================================================================== */
{
  const m = B.mensch({ id: "ki_verk", geschlecht: "m", pose: "stehen", blick: 25, frisur: "kurz", haarfarbe: "grau", haut: "mittel", bart: "bart_kurz", laecheln: true,
    kleidung: { oberteil: { stueck: "hemd", farbe: "#6d8fb3" }, jacke: { stueck: "weste", farbe: "#3c3f45" }, unterteil: { stueck: "hose", farbe: "grau" }, schuhe: { stueck: "halbschuh" } } }, 72);
  S.teil({ id: "ki_verkaeufer", de: "der Verkäufer", syl: "Ver-KÄU-fer", it: "il venditore", itSyl: "ven-di-TO-re", en: "shopkeeper", x: 66, y: 146, kunst: `<clipPath id="${S.id("luke")}"><rect x="${LUKE.x0 - 66}" y="-90" width="${LUKE.x1 - LUKE.x0}" height="${LUKE.y1 + 1 - 56}"/></clipPath><g clip-path="url(#${S.id("luke")})">${m.svg}</g>`,
    tipp: "Der Verkäufer kennt fast alle Kunden mit Namen." });
}

/* =====================================================================
   5 — DAS VERKAUFSFENSTER mit Ablage — Lupe mit der Ware
   ===================================================================== */
{
  const L = LUKE, cx = (L.x0 + L.x1) / 2, ab = L.y1;   /* Ablage-Oberkante */
  let k = `<g transform="translate(${-cx} ${-ab})">`;
  /* Alurahmen, geöffnetes Schiebefenster rechts */
  k += `<rect x="${L.x0 - 1.6}" y="${L.y0 - 1.6}" width="${L.x1 - L.x0 + 3.2}" height="1.8" fill="${ALU}"/><rect x="${L.x0 - 1.6}" y="${L.y0 - 1.6}" width="1.8" height="${L.y1 - L.y0 + 1.6}" fill="${ALU}"/><rect x="${L.x1 - 0.2}" y="${L.y0 - 1.6}" width="1.8" height="${L.y1 - L.y0 + 1.6}" fill="${ALU}"/>`;
  k += `<rect x="${L.x1 - 26}" y="${L.y0}" width="25" height="${L.y1 - L.y0}" fill="${GLAS}" stroke="#a8b0b6" stroke-width=".8"/><path d="M${L.x1 - 22} ${L.y1} L${L.x1 - 12} ${L.y0} L${L.x1 - 8} ${L.y0} L${L.x1 - 18} ${L.y1} Z" fill="#fff" opacity=".22"/>`;
  /* Ablage (Holzbrett, vorstehend) */
  k += `<path d="M${L.x0 - 3} ${ab} L${L.x1 + 3} ${ab} L${L.x1 + 5} ${ab + 3} L${L.x0 - 5} ${ab + 3} Z" fill="${S.lg("ablage", [[0, "#b98a57"], [1, "#94683a"]])}"/><rect x="${L.x0 - 5}" y="${ab + 3}" width="${L.x1 - L.x0 + 10}" height="1.6" fill="#6e4a26"/>`;
  const unter = [];
  const ding = (id, de, syl, it, itSyl, en, x, w, h, svg, tipp) => { k += svg; unter.push({ id, de, syl, it, itSyl, en, tipp, x, y: ab + 1, kunst: flaeche(-w / 2, -h, w, h + 1) }); };
  /* Kaugummi-Aufsteller */
  {
    const x = 37; let g = `<rect x="${x - 6}" y="${ab - 9}" width="12" height="9" fill="#ffffff" stroke="#bbb" stroke-width=".2"/>`;
    for (let j = 0; j < 2; j++) for (let i = 0; i < 4; i++) g += `<rect x="${x - 5.4 + i * 2.8}" y="${ab - 8.4 + j * 4.2}" width="2.4" height="3.8" rx=".3" fill="${["#3a86ff", "#06d6a0", "#ff006e", "#ffbe0b"][(i + j) % 4]}"/><rect x="${x - 5 + i * 2.8}" y="${ab - 7.6 + j * 4.2}" width="1.6" height=".6" fill="#fff"/>`;
    ding("ki_kaugummi", "der Kaugummi", "KAU-gum-mi", "la gomma da masticare", "GOM-ma da ma-sti-CA-re", "chewing gum", x, 13, 10, g);
  }
  /* Karton mit Schokoriegeln */
  {
    const x = 51; let g = `<path d="M${x - 7} ${ab} L${x + 7} ${ab} L${x + 7} ${ab - 4} L${x - 7} ${ab - 4} Z" fill="#7a4a22"/><path d="M${x - 7} ${ab - 4} L${x + 7} ${ab - 4} L${x + 8} ${ab - 9} L${x - 6} ${ab - 9} Z" fill="#c89a5e"/>`;
    for (let i = 0; i < 5; i++) g += `<rect x="${x - 6.6 + i * 2.8}" y="${ab - 8}" width="2.4" height="5" rx=".3" fill="${["#5a2d0c", "#e63946", "#5a2d0c", "#3a86ff", "#5a2d0c"][i]}" transform="rotate(-8 ${x - 5.4 + i * 2.8} ${ab - 5})"/>`;
    ding("ki_schokoriegel", "der Schokoriegel", "SCHO-ko-rie-gel", "la barretta di cioccolato", "bar-RET-ta di cioc-co-LA-to", "chocolate bar", x, 15, 10, g);
  }
  /* Gemischte Tüte */
  {
    const x = 64; let g = `<path d="M${x - 3.6} ${ab} L${x + 3.6} ${ab} L${x + 3} ${ab - 9} L${x - 3} ${ab - 9} Z" fill="#f5f2ea" stroke="#c9c3b5" stroke-width=".15"/>`;
    g += `<path d="M${x - 3} ${ab - 9} Q${x} ${ab - 11.6} ${x + 3} ${ab - 9}" fill="#f5f2ea"/>`;
    for (let i = 0; i < 7; i++) g += `<circle cx="${r(x - 2.2 + rnd() * 4.4)}" cy="${r(ab - 9.4 - rnd() * 1.4)}" r=".8" fill="${BUNT[i % BUNT.length]}"/>`;
    g += `<rect x="${x - 2.4}" y="${ab - 6}" width="4.8" height="2.2" fill="#e63946" opacity=".8"/>`;
    ding("ki_gemischte_tuete", "die gemischte Tüte", "ge-MISCH-te TÜ-te", "il sacchetto di caramelle misto", "sac-CHET-to di ca-ra-MEL-le MI-sto", "pick-and-mix bag", x, 9, 12, g, "Für die gemischte Tüte sucht man sich die Süßigkeiten selbst aus.");
  }
  /* Wechselgeldschale mit Münzen */
  {
    const x = 77; let g = `<ellipse cx="${x}" cy="${ab - 0.6}" rx="5.4" ry="1.6" fill="#3a3f44"/><ellipse cx="${x}" cy="${ab - 1.1}" rx="4.6" ry="1.1" fill="#4c5258"/>`;
    for (const [dx, f] of [[-2.2, "#c9a227"], [0.4, "#c7c9cc"], [2.4, "#b87333"], [-0.6, "#c9a227"]]) g += `<ellipse cx="${x + dx}" cy="${ab - 1.3}" rx="1.3" ry=".55" fill="${f}" stroke="#7a6a3a" stroke-width=".12"/>`;
    ding("ki_muenze", "die Münze", "MÜN-ze", "la moneta", "mo-NE-ta", "coin", x, 11, 4.4, g);
  }
  /* Lottoscheine im Halter */
  {
    const x = 92; let g = `<rect x="${x - 5}" y="${ab - 2}" width="10" height="2" fill="#2b2b2e"/>`;
    for (let i = 0; i < 3; i++) g += `<rect x="${x - 4.4 + i * 0.6}" y="${ab - 11 + i * 0.6}" width="8" height="9" fill="#fff8d6" stroke="#e3c64a" stroke-width=".2"/>`;
    g += `<rect x="${x - 3.2}" y="${ab - 9.6}" width="6.8" height="1.6" fill="#d62828"/>`;
    for (let j = 0; j < 3; j++) for (let i = 0; i < 5; i++) g += `<rect x="${x - 3 + i * 1.3}" y="${ab - 7.4 + j * 1.3}" width=".9" height=".9" fill="none" stroke="#d62828" stroke-width=".15"/>`;
    g += `<path d="M${x - 1.7} ${ab - 7.4} l.9 .9 M${x - 0.8} ${ab - 7.4} l-.9 .9" stroke="#1d3557" stroke-width=".2"/>`;
    ding("ki_lottoschein", "der Lottoschein", "LOT-to-schein", "la schedina del lotto", "sche-DI-na del LOT-to", "lottery ticket", x, 11, 11.6, g, "Auf dem Lottoschein kreuzt man sechs Zahlen an.");
  }
  /* Fahrkarten (Ticketdrucker mit Fahrschein) */
  {
    const x = 106; let g = `<rect x="${x - 5}" y="${ab - 5}" width="10" height="5" rx=".6" fill="#33393f"/><rect x="${x - 4}" y="${ab - 4.2}" width="4" height="2" fill="#9cd3e8"/>`;
    g += `<path d="M${x - 1} ${ab - 5} L${x + 4} ${ab - 5} L${x + 4.6} ${ab - 10.4} L${x - 0.4} ${ab - 10.4} Z" fill="#ffffff" stroke="#c9c9c9" stroke-width=".15"/><rect x="${x - 0.2}" y="${ab - 10}" width="4.6" height="1.2" fill="#3a86ff" transform="skewX(-5)"/><path d="M${x} ${ab - 7.6} L${x + 3.6} ${ab - 7.6} M${x} ${ab - 6.4} L${x + 2.6} ${ab - 6.4}" stroke="#555" stroke-width=".2"/>`;
    ding("ki_fahrkarte", "die Fahrkarte", "FAHR-kar-te", "il biglietto", "bi-GLIET-to", "ticket", x, 11, 11, g, "Am Kiosk kann man oft auch Fahrkarten für Bus und Bahn kaufen.");
  }
  k += `</g>`;
  S.teil({ id: "ki_verkaufsfenster", de: "das Verkaufsfenster", syl: "Ver-KAUFS-fens-ter", it: "la finestrella", itSyl: "fi-ne-STREL-la", en: "serving hatch", x: cx, y: ab, kunst: k,
    zoom: { x: L.x0 - 6, y: L.y0 - 4, w: L.x1 - L.x0 + 12, h: L.y1 - L.y0 + 10 }, unter });
}

/* =====================================================================
   6 — DRAUSSEN: Leergut, Pfandflasche, Eistruhe, Mülleimer,
       Zeitungsständer, Kundin
   ===================================================================== */
{
  /* DAS LEERGUT — gestapelte Getränkekisten an der Bude */
  let k = schatten(0, .4, 15, 1.4, .3);
  const kiste = (x, y, farbe, flasche) => {
    let g = `<rect x="${x - 11}" y="${y - 11}" width="22" height="11" rx="1" fill="${farbe}"/><rect x="${x - 6}" y="${y - 9.4}" width="12" height="2.6" rx="1.2" fill="#000" opacity=".35"/>`;
    for (let i = 0; i < 6; i++) g += `<rect x="${r(x - 10 + i * 3.6)}" y="${y - 6}" width="2.2" height="5.4" fill="#000" opacity=".12"/>`;
    for (let i = 0; i < 6; i++) { const fx = x - 9.4 + i * 3.6; g += `<rect x="${r(fx)}" y="${y - 15}" width="2.4" height="4.4" fill="${flasche}" opacity=".9"/><rect x="${r(fx + 0.7)}" y="${y - 17}" width="1" height="2.2" fill="${flasche}"/>`; }
    return g;
  };
  k += kiste(0, 0, "#2b5f9e", "#5a3a14") + `<g transform="translate(1 -11)">${kiste(0, 0, "#c33b2e", "#2f7d4f")}</g>`;
  S.teil({ id: "ki_leergut", de: "das Leergut", syl: "LEER-gut", it: "il vuoto a rendere", itSyl: "VUO-to a REN-de-re", en: "empties", x: 245, y: 156, steht: true, kunst: k,
    tipp: "Leere Flaschen bringt man zurück und bekommt das Pfand." });
}
{
  /* DIE PFANDFLASCHE — Plastikflasche mit Pfandzeichen */
  let k = schatten(0, .2, 2.6, .6, .3);
  k += `<path d="M-2 0 L-2 -8 Q-2 -9.6 -.8 -10.2 L-.8 -11.6 L.8 -11.6 L.8 -10.2 Q2 -9.6 2 -8 L2 0 Z" fill="${S.lg("pet", [[0, "#cfeaf7", 0.85], [0.5, "#ffffff", 0.7], [1, "#a9d3e8", 0.9]], 0, 0, 1, 0)}" stroke="#89b8cf" stroke-width=".15"/>`;
  k += `<rect x="-.8" y="-12.4" width="1.6" height=".9" fill="#2f80c3"/><rect x="-2" y="-6.4" width="4" height="2.6" fill="#2f80c3"/><circle cx="0" cy="-5.1" r=".8" fill="none" stroke="#fff" stroke-width=".3"/>`;
  S.teil({ oben: true, id: "ki_pfandflasche", de: "die Pfandflasche", syl: "PFAND-fla-sche", it: "la bottiglia con cauzione", itSyl: "bot-TI-glia con cau-ZIO-ne", en: "deposit bottle", x: 262, y: 160, steht: true, kunst: k,
    tipp: "Auf eine Plastikflasche mit diesem Zeichen gibt es 25 Cent Pfand." });
}
{
  /* DIE EISTRUHE — mit gewölbtem Glasdeckel; Lupe auf das Eis */
  const cx = 36, yb = 176;
  let k = schatten(0, .4, 34, 1.8, .3);
  k += `<rect x="-31" y="-38" width="62" height="38" rx="2.4" fill="${S.lg("truhe", [[0, "#ffffff"], [1, "#dcdfe2"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-31" y="-4" width="62" height="4" rx="1" fill="#9aa1a7"/>`;
  k += `<rect x="-26" y="-30" width="52" height="20" rx="2" fill="${S.lg("eisschild", [[0, "#3aa0e8"], [1, "#1f6fb5"]])}"/>`;
  k += `<text x="6" y="-17.6" font-size="8" text-anchor="middle" fill="#fff" font-family="Arial Black,Arial" font-weight="bold" font-style="italic">EIS</text>`;
  k += `<path d="M-18 -13 L-14 -24 L-10 -13 Z" fill="#e8b46a"/><circle cx="-14" cy="-25" r="3.4" fill="#f6a5c0"/><circle cx="-12.4" cy="-27.4" r="2.6" fill="#fff4d6"/>`;
  /* Glasdeckel (von oben gesehen) mit Eis darunter */
  k += `<path d="M-31 -38 L31 -38 L28 -46 L-28 -46 Z" fill="#d9e4ea"/>`;
  for (let i = 0; i < 12; i++) k += `<rect x="${-27 + i * 4.6}" y="${-44.6 + (i % 2) * 0.8}" width="4" height="5.6" rx=".5" fill="${["#f4a261", "#e63946", "#ffbe0b", "#8338ec", "#06d6a0", "#ff006e"][i % 6]}" transform="skewX(${(i - 6) * 1.5})"/>`;
  k += `<path d="M-31 -38 L31 -38 L28 -46 L-28 -46 Z" fill="${GLAS}" stroke="#a9b5bc" stroke-width=".5"/><line x1="0" y1="-46" x2="0" y2="-38" stroke="#a9b5bc" stroke-width=".6"/>`;
  const unter = [
    { id: "ki_eis_stiel", de: "das Eis am Stiel", syl: "EIS am STIEL", it: "il ghiacciolo", itSyl: "ghiac-CIO-lo", en: "ice lolly", x: cx - 14, y: yb - 38, kunst: flaeche(-14, -8.6, 28, 9) },
    { id: "ki_eistuete", de: "die Eistüte", syl: "EIS-tü-te", it: "il cono gelato", itSyl: "CO-no ge-LA-to", en: "ice-cream cone", x: cx + 14, y: yb - 38, kunst: flaeche(-14, -8.6, 28, 9) },
  ];
  S.teil({ id: "ki_eistruhe", de: "die Eistruhe", syl: "EIS-tru-he", it: "il congelatore dei gelati", itSyl: "con-ge-la-TO-re dei ge-LA-ti", en: "ice-cream freezer", x: cx, y: yb, steht: true, kunst: k,
    zoom: { x: cx - 36, y: yb - 52, w: 72, h: 50 }, unter });
}
{
  /* DER MÜLLEIMER — am Pfosten, ganz vorn links */
  let k = schatten(0, .4, 9, 1.4, .3);
  k += `<rect x="-1.4" y="-58" width="2.8" height="58" fill="#4a5056"/><rect x="-1.4" y="-58" width="1" height="58" fill="#6c737a"/>`;
  k += `<path d="M-11 -56 L11 -56 L9.6 -30 Q0 -27 -9.6 -30 Z" fill="${S.lg("muell", [[0, "#ff8a1f"], [1, "#d9630a"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-11.6" y="-58" width="23.2" height="3" rx="1" fill="#e5730f"/><path d="M-6 -50 L6 -50 M-6 -46 L6 -46 M-6 -42 L6 -42" stroke="#b9530a" stroke-width=".6"/>`;
  S.teil({ id: "ki_muelleimer", de: "der Mülleimer", syl: "MÜLL-ei-mer", it: "il cestino", itSyl: "ce-STI-no", en: "litter bin", x: 266, y: 138, steht: true, kunst: `<g transform="scale(.46)">${k}</g>` });
}
{
  /* DER ZEITUNGSSTÄNDER — Drahtständer mit drei Fächern — Lupe */
  const cx = 290, yb = 188;
  let k = schatten(0, .4, 20, 1.6, .3);
  k += `<rect x="-17" y="-80" width="1.4" height="80" fill="#5b6066"/><rect x="15.6" y="-80" width="1.4" height="80" fill="#5b6066"/>`;
  k += `<rect x="-18" y="-84" width="36" height="5" rx=".8" fill="${GRUEN}"/><text x="0" y="-80.6" font-size="2.8" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">ZEITUNGEN</text>`;
  const faecher = [-56, -30, -6];
  const unter = [];
  const zeitung = (x, y, w, h, kopf, schlag) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#f4f2ec" stroke="#b9b5aa" stroke-width=".15"/><rect x="${x + 0.8}" y="${y + 0.8}" width="${w - 1.6}" height="3" fill="${kopf}"/><text x="${x + w / 2}" y="${y + 3.1}" font-size="2.2" text-anchor="middle" fill="#fff" font-family="Georgia" font-weight="bold">${schlag}</text><rect x="${x + 0.8}" y="${y + 4.6}" width="${w * 0.55}" height="4" fill="#9fb3c4"/><path d="M${x + w * 0.62 + 0.4} ${y + 5} H${x + w - 0.8} M${x + w * 0.62 + 0.4} ${y + 6.4} H${x + w - 0.8} M${x + 0.8} ${y + 10} H${x + w - 0.8} M${x + 0.8} ${y + 11.4} H${x + w - 0.8}" stroke="#777" stroke-width=".25"/>`;
  const heft = (x, y, w, h, f1, f2, t) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${S.lg("cov" + f1.slice(1), [[0, f1], [1, f2]])}" stroke="#00000022" stroke-width=".15"/><rect x="${x}" y="${y}" width="${w}" height="2.6" fill="#fff" opacity=".85"/><text x="${x + w / 2}" y="${y + 2.1}" font-size="1.9" text-anchor="middle" fill="${f2}" font-family="Arial" font-weight="bold">${t}</text><circle cx="${x + w * 0.7}" cy="${y + h * 0.6}" r="${(w * 0.22).toFixed(1)}" fill="#fff" opacity=".35"/>`;
  /* oben: Tageszeitungen */
  k += zeitung(-15, faecher[0] - 15, 14, 15, "#1d3557", "Tagesblatt") + zeitung(1, faecher[0] - 15, 14, 15, "#c1121f", "EXTRA");
  unter.push({ id: "ki_zeitung", de: "die Zeitung", syl: "ZEI-tung", it: "il giornale", itSyl: "gior-NA-le", en: "newspaper", x: cx, y: yb + faecher[0], kunst: flaeche(-16, -16, 32, 16.6) });
  /* Mitte: Zeitschriften */
  k += heft(-15, faecher[1] - 16, 9.4, 16, "#ff6fa5", "#c2185b", "STAR") + heft(-4.7, faecher[1] - 16, 9.4, 16, "#6ab0e8", "#1f5f9e", "AUTO") + heft(5.6, faecher[1] - 16, 9.4, 16, "#7ccf8a", "#2a7a3b", "GARTEN");
  unter.push({ id: "ki_zeitschrift", de: "die Zeitschrift", syl: "ZEIT-schrift", it: "la rivista", itSyl: "ri-VI-sta", en: "magazine", x: cx, y: yb + faecher[1], kunst: flaeche(-16, -17, 32, 17.6) });
  /* unten: Rätselhefte und Comics */
  k += heft(-15, faecher[2] - 14, 14, 14, "#ffd166", "#b5651d", "RÄTSEL") + `<g>${[0, 1, 2, 3].map((i) => `<rect x="${-13 + (i % 2) * 6}" y="${faecher[2] - 10 + Math.floor(i / 2) * 3.6}" width="5" height="3" fill="none" stroke="#7a4a12" stroke-width=".2"/>`).join("")}</g>`;
  k += heft(1, faecher[2] - 14, 14, 14, "#ef476f", "#7b2cbf", "COMIC") + `<circle cx="5" cy="${faecher[2] - 7}" r="2.6" fill="#ffd166"/><circle cx="4.2" cy="${faecher[2] - 7.6}" r=".4" fill="#222"/><circle cx="5.8" cy="${faecher[2] - 7.6}" r=".4" fill="#222"/>`;
  unter.push({ id: "ki_raetselheft", de: "das Rätselheft", syl: "RÄT-sel-heft", it: "la rivista di enigmistica", itSyl: "ri-VI-sta di e-ni-GMI-sti-ca", en: "puzzle book", x: cx - 8, y: yb + faecher[2], kunst: flaeche(-8, -15, 16, 15.6) });
  unter.push({ id: "ki_comic", de: "das Comicheft", syl: "CO-mic-heft", it: "il fumetto", itSyl: "fu-MET-to", en: "comic", x: cx + 8, y: yb + faecher[2], kunst: flaeche(-8, -15, 16, 15.6) });
  for (const f of faecher) k += `<path d="M-17 ${f} L17 ${f} L17 ${f + 2} L-17 ${f + 2} Z" fill="#7b8087"/><path d="M-17 ${f - 5} L17 ${f - 5}" stroke="#8a9096" stroke-width=".6"/>`;
  k += `<rect x="-17" y="-2" width="34" height="2" fill="#5b6066"/>`;
  S.teil({ id: "ki_zeitungsstaender", de: "der Zeitungsständer", syl: "ZEI-tungs-stän-der", it: "l'espositore dei giornali", itSyl: "e-spo-si-TO-re dei gior-NA-li", en: "newspaper rack", x: cx, y: yb, steht: true, kunst: k,
    zoom: { x: cx - 30, y: yb - 86, w: 60, h: 86 }, unter });
}
{
  const m = B.mensch({ id: "ki_kundin", geschlecht: "w", pose: "stehen", blick: -70, frisur: "locken", haarfarbe: "dunkelbraun", haut: "dunkel",
    kleidung: { oberteil: { stueck: "tshirt", farbe: "gelb" }, jacke: { stueck: "jacke", farbe: "gruen_d" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" }, zubehoer: { stueck: "rucksack", farbe: "rot" } } }, 106);
  S.teil({ id: "ki_kundin", de: "die Kundin", syl: "KUN-din", it: "la cliente", itSyl: "cli-EN-te", en: "customer", x: 131, y: 192, kunst: m.svg,
    tipp: "Die Kundin sagt: „Eine gemischte Tüte für zwei Euro, bitte!“" });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/kiosk.js"));
console.log(aus);
