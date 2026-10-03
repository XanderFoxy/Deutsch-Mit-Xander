#!/usr/bin/env node
/* =====================================================================
   DIE APOTHEKE (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   XANDER (Funk 263/286): jeder Ort authentisch wie das echte Vorbild,
   alles logisch platziert, jedes Ding einzeln antippbar.

   RECHERCHE (Apothekenbetriebsordnung, Ladenbau-Berichte apotheke adhoc
   „Sichtwahl fürs Beratungsgespräch“, „Freiwahl“, Kommissionierer) — so
   sieht die Offizin (der Verkaufsraum) einer deutschen Apotheke aus:
   - Über allem das rote Apotheken-A (gotisches A mit Schale und
     Schlange) und der Name der Apotheke.
   - Die HV-TISCHE (Handverkaufstische): einzelne Beratungsplätze mit
     Abstand zueinander, darauf Kasse mit Bildschirm, Kartenterminal mit
     Steckplatz für die Gesundheitskarte (E-Rezept), Tüten, kleine
     Aufsteller (Fieberthermometer, Hustenbonbons) und die kostenlose
     Kundenzeitschrift. Vor dem Tisch eine Bodenmarkierung „Diskretion“.
   - Hinter den HV-Tischen die SICHTWAHL: beleuchtete Regale mit
     apothekenpflichtigen Packungen, nach Themen geordnet (Erkältung,
     Schmerz, Magen/Darm, Haut/Allergie). Die Kundschaft sieht sie,
     greift aber nicht selbst zu — das macht die Apothekerin.
   - Davor im Kundenbereich die FREIWAHL: Regale zum Selbstnehmen
     (Pflaster, Pflege, Tee, Traubenzucker), oft eine Personenwaage.
   - Der Vorrat liegt im SCHUBLADENSCHRANK (Generalalphabet) oder im
     KOMMISSIONIERER, einem Roboterlager mit Glasfront, das die Packung
     auf Knopfdruck zum HV-Tisch schickt.
   - Die Apothekerin trägt einen weißen Kittel mit Namensschild.
   Maßstab: Rückwand ≈ 46 Einheiten je Meter (Sichtwahl 2 m),
   HV-Tisch ≈ 52 je Meter (0,9 m hoch), Kunde vorne 1,76 m ≈ 104.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "apotheke", titel: "Die Apotheke", emoji: "💊", thema: "Gesundheit", kuerzel: "b02a", fassung: 852 });
const rnd = zufall(1241);
const r = B.r;

/* ---------- Grundfarben ---------------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const ROT = "#d8121f";
const WAND = S.lg("wand", [[0, "#f4f7f5"], [0.6, "#e9efec"], [1, "#dde5e1"]]);
const DECKE = S.lg("decke", [[0, "#f7f8f7"], [1, "#e6e9e8"]]);
const WEISS = S.lg("weiss", [[0, "#ffffff"], [0.6, "#f2f3f2"], [1, "#dde0e0"]], 0, 0, 1, 0);
const WEISS_V = S.lg("weissv", [[0, "#fdfdfc"], [1, "#e4e7e6"]]);
const HOLZ = S.lg("holz", [[0, "#c9a173"], [0.5, "#b88d5e"], [1, "#a77c4f"]], 0, 0, 1, 0);
const STAHL = S.lg("stahl", [[0, "#eef1f3"], [0.45, "#c9cfd4"], [0.55, "#b5bcc2"], [1, "#e1e5e8"]], 0, 0, 1, 0);
const GLAS = S.lg("glas", [[0, "#ffffff", 0.3], [0.45, "#e8f4f7", 0.06], [1, "#ffffff", 0.16]], 0, 0, 1, 1);
const BRAUNGLAS = S.lg("braunglas", [[0, "#5a2c0e"], [0.35, "#8a4a1c"], [0.6, "#6b360f"], [1, "#3e1d08"]], 0, 0, 1, 0);
const TUBE = S.lg("tube", [[0, "#d9dde0"], [0.4, "#ffffff"], [1, "#c3c9cd"]], 0, 0, 1, 0);
const FARBEN = ["#d7262e", "#1f6fb5", "#2e9a5b", "#f0a020", "#7a3f9a", "#e45f8c", "#0f8a8a", "#3b4d9c", "#e2672a"];

/* Eine Arzneipackung: weiße Faltschachtel mit Farbband und Schrift */
function packung(x, yb, w, h, band, dunkel = false) {
  const body = dunkel ? band : "#fbfbf9";
  let g = `<rect x="${r(x)}" y="${r(yb - h)}" width="${r(w)}" height="${r(h)}" rx=".25" fill="${body}" stroke="#c6cbce" stroke-width=".15"/>`;
  if (!dunkel) g += `<rect x="${r(x)}" y="${r(yb - h + h * 0.18)}" width="${r(w)}" height="${r(h * 0.28)}" fill="${band}"/>`;
  g += `<rect x="${r(x + w * 0.18)}" y="${r(yb - h * 0.38)}" width="${r(w * 0.64)}" height=".35" fill="${dunkel ? "#fff" : "#7b8288"}" opacity=".7"/>`;
  g += `<rect x="${r(x + w - 0.6)}" y="${r(yb - h)}" width=".6" height="${r(h)}" fill="#000" opacity=".1"/>`;
  return g;
}

/* =====================================================================
   KULISSE — Decke mit Einbauleuchten, Wand, Fliesenboden
   ===================================================================== */
const WAND_UNTEN = 120;
S.hinten(`<rect x="0" y="0" width="320" height="12" fill="${DECKE}"/><rect x="0" y="11.4" width="320" height="1.6" fill="#d3d9d6"/>`);
for (const x of [30, 100, 160, 220, 290]) S.hinten(`<ellipse cx="${x}" cy="6" rx="5" ry="1.3" fill="#fffef6"/><ellipse cx="${x}" cy="6.4" rx="11" ry="3.2" fill="#fffbe6" opacity=".25"/>`);
S.hinten(`<rect x="0" y="13" width="320" height="${WAND_UNTEN - 13}" fill="${WAND}"/>`);
S.hinten(`<rect x="0" y="13" width="320" height="${WAND_UNTEN - 13}" fill="${S.rg("wandlicht", [[0, "#ffffff", 0.6], [1, "#ffffff", 0]], 0.5, 0.1, 0.7)}"/>`);
/* grüne Akzentfläche hinter der Sichtwahl (Hausfarbe) */
S.hinten(`<rect x="72" y="13" width="164" height="${WAND_UNTEN - 13}" fill="${S.lg("akzent", [[0, "#cfe3d8"], [1, "#b9d3c5"]])}"/>`);
S.hinten(`<rect x="0" y="${WAND_UNTEN - 3}" width="320" height="3" fill="#c9d0cd"/>`);
{
  let f = `<rect x="0" y="${WAND_UNTEN}" width="320" height="${200 - WAND_UNTEN}" fill="${S.lg("boden", [[0, "#cfcbc3"], [1, "#b9b3a8"]])}"/>`;
  for (let i = -8; i <= 8; i++) f += `<line x1="${160 + i * 20}" y1="${WAND_UNTEN}" x2="${160 + i * 58}" y2="200" stroke="#9c958a" stroke-width=".35" opacity=".7"/>`;
  for (const y of [WAND_UNTEN + 7, WAND_UNTEN + 16, WAND_UNTEN + 28, WAND_UNTEN + 44, WAND_UNTEN + 64]) f += `<line x1="0" y1="${y}" x2="320" y2="${y}" stroke="#9c958a" stroke-width=".35" opacity=".6"/>`;
  f += `<rect x="0" y="${WAND_UNTEN}" width="320" height="${200 - WAND_UNTEN}" fill="${S.lg("bodenlicht", [[0, "#000", 0.14], [0.35, "#000", 0], [1, "#fff", 0.08]])}"/>`;
  /* Spiegelung der Theke im glatten Boden */
  f += `<rect x="58" y="177" width="206" height="10" fill="#fff" opacity=".12"/>`;
  /* Diskretionslinie vor dem HV-Tisch */
  f += `<path d="M150 186 L272 186 L274 189 L148 189 Z" fill="#2f7d5b" opacity=".85"/>`;
  f += `<text x="211" y="188.5" font-size="2.3" text-anchor="middle" fill="#fff" font-family="Arial" letter-spacing=".5">BITTE DISKRETIONSABSTAND HALTEN</text>`;
  S.hinten(f);
}

/* =====================================================================
   1 — DAS SCHILD mit dem roten Apotheken-A
   ===================================================================== */
function apothekenA(s) {
  /* gotisches A: zwei Schäfte mit gebrochener Spitze, Querbalken; innen
     weiß die Schale mit der Schlange (Zeichen der Hygieia) */
  const p = (x, y) => `${r(x * s)} ${r(y * s)}`;
  let g = `<path d="M${p(-7, 8)} L${p(-6.2, -2)} Q${p(-5.6, -7)} ${p(-1.5, -8.5)} L${p(1, -9.4)} L${p(3.4, -8)} Q${p(6.2, -6.4)} ${p(6.4, -2)} L${p(7, 8)} L${p(3.6, 8)} L${p(3.4, 3)} L${p(-3.4, 3)} L${p(-3.6, 8)} Z M${p(-3.3, 0.6)} L${p(3.3, 0.6)} L${p(3.2, -2.4)} Q${p(3, -5.6)} ${p(0.6, -6)} Q${p(-3, -5.6)} ${p(-3.2, -2.4)} Z" fill="${ROT}" fill-rule="evenodd"/>`;
  g += `<path d="M${p(-2.4, -2.6)} Q${p(0, 0.4)} ${p(2.4, -2.6)} Z" fill="#fff"/><rect x="${r(-0.3 * s)}" y="${r(-1.6 * s)}" width="${r(0.6 * s)}" height="${r(1.8 * s)}" fill="#fff"/>`;
  g += `<path d="M${p(-0.2, -5.2)} q${r(1.2 * s)} ${r(0.6 * s)} 0 ${r(1.2 * s)} q${r(-1.2 * s)} ${r(0.6 * s)} 0 ${r(1.2 * s)}" stroke="#fff" stroke-width="${r(0.45 * s)}" fill="none"/>`;
  return g;
}
{
  let k = `<rect x="-52" y="-7.5" width="104" height="15" rx="2" fill="${S.lg("schild", [[0, "#ffffff"], [1, "#e9eceb"]])}" stroke="#c9d1cd" stroke-width=".4"/>`;
  k += `<rect x="-50" y="-6" width="14" height="12" rx="1.6" fill="#fff"/><g transform="translate(-43 0.4)">${apothekenA(0.62)}</g>`;
  k += `<text x="8" y="2.6" font-size="7.4" text-anchor="middle" fill="#2f5d46" font-family="Georgia,'Times New Roman',serif" font-weight="bold" letter-spacing=".4">Linden-Apotheke</text>`;
  k += `<rect x="-52" y="5.6" width="104" height="1.9" rx=".8" fill="${ROT}" opacity=".85"/>`;
  S.teil({ id: "ap_schild", de: "das Schild", syl: "SCHILD", it: "l'insegna", itSyl: "in-SE-gna", en: "sign", x: 154, y: 21.5, kunst: k,
    tipp: "Das rote A erkennt man in ganz Deutschland: Hier ist eine Apotheke." });
}

/* =====================================================================
   2 — DER SCHUBLADENSCHRANK (links, Generalalphabet) mit Standgefäßen
   ===================================================================== */
{
  const W = 58, H = 70;   /* 1,25 m breit, 1,5 m hoch */
  let k = schatten(0, 0.3, 31, 1.4, 0.25);
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="${H}" rx=".8" fill="${WEISS_V}"/>`;
  k += `<rect x="${-W / 2 - 1}" y="${-H - 2}" width="${W + 2}" height="2.4" rx=".6" fill="#e9ecea" stroke="#cdd3d0" stroke-width=".2"/>`;
  const sp = 5, ze = 9, fw = (W - 3) / sp, fh = (H - 6) / ze;
  const buchst = "ABCDEFGHIKLMNOPRSTUVWZ";
  let n = 0;
  for (let j = 0; j < ze; j++) for (let i = 0; i < sp; i++) {
    const x = -W / 2 + 1.5 + i * fw, y = -H + 1.5 + j * fh;
    k += `<rect x="${r(x + 0.35)}" y="${r(y + 0.35)}" width="${r(fw - 0.7)}" height="${r(fh - 0.7)}" rx=".4" fill="#fbfcfb" stroke="#cdd4d1" stroke-width=".25"/>`;
    k += `<rect x="${r(x + fw / 2 - 2.6)}" y="${r(y + 1.3)}" width="5.2" height="2.4" fill="#fff" stroke="#9aa6a1" stroke-width=".15"/>`;
    k += `<text x="${r(x + fw / 2)}" y="${r(y + 3.1)}" font-size="1.8" text-anchor="middle" fill="#2f5d46" font-family="Arial" font-weight="bold">${buchst[n++ % buchst.length]}</text>`;
    k += `<rect x="${r(x + fw / 2 - 2.4)}" y="${r(y + fh - 2.2)}" width="4.8" height=".9" rx=".45" fill="${STAHL}"/>`;
  }
  k += `<rect x="${-W / 2}" y="-4.2" width="${W}" height="4.2" fill="#c5ccc9"/>`;
  /* drei alte Standgefäße aus Porzellan oben drauf */
  for (const [dx, h, et] of [[8, 11, "Aqua"], [17, 9, "Salvia"], [25, 10, "Menth."]]) {
    k += `<path d="M${dx - 3.4} ${-H - 2} L${dx - 3.4} ${-H - 2 - h + 2} Q${dx - 3.4} ${-H - 2 - h} ${dx} ${-H - 2 - h} Q${dx + 3.4} ${-H - 2 - h} ${dx + 3.4} ${-H - 2 - h + 2} L${dx + 3.4} ${-H - 2} Z" fill="${WEISS}"/>`;
    k += `<rect x="${dx - 2.3}" y="${-H - 2 - h - 1.6}" width="4.6" height="1.8" rx=".8" fill="#f3f4f2" stroke="#c4cac7" stroke-width=".2"/>`;
    k += `<rect x="${dx - 2.6}" y="${-H - 2 - h * 0.62}" width="5.2" height="3.2" rx=".4" fill="#fff" stroke="#2c4f8e" stroke-width=".35"/><text x="${dx}" y="${r(-H - 2 - h * 0.62 + 2.2)}" font-size="1.4" text-anchor="middle" fill="#2c4f8e" font-family="Georgia" font-style="italic">${et}</text>`;
  }
  S.teil({ id: "schubladenschrank", de: "der Schubladenschrank", syl: "SCHUB-la-den-schrank", it: "la cassettiera", itSyl: "cas-set-TIE-ra", en: "drawer cabinet", x: 36, y: WAND_UNTEN, steht: true, kunst: k,
    tipp: "In den Schubladen liegen die Medikamente nach dem Alphabet geordnet." });
}
{
  /* DER MÖRSER — Porzellanmörser mit Pistill auf dem Schrank */
  let k = schatten(0, .2, 5, .7, .25);
  k += `<path d="M-4.6 -5.6 Q-4.6 0 0 0 Q4.6 0 4.6 -5.6 Z" fill="${WEISS}"/><ellipse cx="0" cy="-5.6" rx="4.6" ry="1.1" fill="#e2e6e4"/><ellipse cx="0" cy="-5.5" rx="3.6" ry=".7" fill="#c9cfcc"/>`;
  k += `<rect x="-1.4" y="-.9" width="2.8" height="1" fill="#e8ebe9"/>`;
  k += `<path d="M.6 -5.6 L4.4 -12.4" stroke="#e3e6e4" stroke-width="1.5" stroke-linecap="round"/><path d="M.6 -5.6 L4.4 -12.4" stroke="#fff" stroke-width=".5" stroke-linecap="round" opacity=".8"/>`;
  k += `<path d="M-3.6 -4.6 Q-3.2 -1.6 -1 -.8" stroke="#fff" stroke-width=".6" fill="none" opacity=".8"/>`;
  S.teil({ oben: true, id: "moerser", de: "der Mörser", syl: "MÖR-ser", it: "il mortaio", itSyl: "mor-TA-io", en: "mortar", x: 17, y: WAND_UNTEN - 72, steht: true, kunst: k,
    tipp: "Mit Mörser und Stößel hat man früher Arzneien zerrieben." });
}

/* =====================================================================
   3 — DIE SICHTWAHL = DER MEDIZINSCHRANK (hinter dem HV-Tisch) — Lupe
   ===================================================================== */
const SW = { x0: 78, x1: 230, y0: 30, y1: WAND_UNTEN };
const swUnter = [];
{
  const W = SW.x1 - SW.x0, H = SW.y1 - SW.y0, cx = (SW.x0 + SW.x1) / 2;
  const X = (ax) => ax - cx, Y = (ay) => ay - SW.y1;   /* absolute → relativ */
  let k = "";
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="${H}" rx=".6" fill="${WEISS_V}"/>`;
  /* hinterleuchtete Rückwand */
  k += `<rect x="${X(SW.x0 + 2)}" y="${Y(36)}" width="${W - 4}" height="${110 - 36}" fill="${S.lg("swlicht", [[0, "#ffffff"], [0.5, "#f2f8f4"], [1, "#e3eee8"]])}"/>`;
  /* Kopfleiste mit den Themen */
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="6" fill="#2f5d46"/>`;
  const spalten = 4, fw = (W - 4) / spalten;
  const themen = ["Erkältung", "Schmerz &amp; Fieber", "Magen · Diabetes", "Haut · Augen"];
  themen.forEach((t, i) => { k += `<text x="${r(X(SW.x0 + 2 + fw * (i + 0.5)))}" y="${Y(34.6)}" font-size="3" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">${t}</text>`; });
  const boeden = [46, 62, 78, 94, 110];
  /* Fächer füllen: [Reihe][Spalte] → besondere Ware oder Packungen */
  const besonders = {};
  const zeichne = (ri, si) => {
    const yb = boeden[ri], x0 = SW.x0 + 2 + si * fw + 1.2, x1 = SW.x0 + 2 + (si + 1) * fw - 1.2;
    const art = besonders[ri + "," + si];
    let g = "";
    if (art === "hustensaft") {
      for (let i = 0; i < 4; i++) {
        const x = x0 + 2 + i * 5.2;
        g += `<path d="M${x} ${yb} L${x} ${yb - 7.5} Q${x} ${yb - 9} ${x + 1.2} ${yb - 9.4} L${x + 1.2} ${yb - 10.6} L${x + 2.8} ${yb - 10.6} L${x + 2.8} ${yb - 9.4} Q${x + 4} ${yb - 9} ${x + 4} ${yb - 7.5} L${x + 4} ${yb} Z" fill="${BRAUNGLAS}"/>`;
        g += `<rect x="${x + 0.9}" y="${yb - 12}" width="2.2" height="1.6" rx=".3" fill="#f2f2f0"/>`;
        g += `<rect x="${x + 0.3}" y="${yb - 6.4}" width="3.4" height="4" fill="#fdfaf0"/><rect x="${x + 0.3}" y="${yb - 6.4}" width="3.4" height="1.2" fill="${i % 2 ? "#2e9a5b" : "#e2672a"}"/>`;
        g += `<rect x="${x + 0.5}" y="${yb - 8.6}" width=".5" height="7.6" fill="#fff" opacity=".3"/>`;
      }
      g += packung(x1 - 12, yb, 5.4, 11, "#e2672a") + packung(x1 - 6.2, yb, 5.4, 11, "#2e9a5b");
    } else if (art === "nasenspray") {
      for (let i = 0; i < 5; i++) {
        const x = x0 + 1.5 + i * 4.2;
        g += `<rect x="${x}" y="${yb - 6}" width="3.2" height="6" rx=".8" fill="${TUBE}"/><rect x="${x}" y="${yb - 4.6}" width="3.2" height="2" fill="#1f6fb5"/>`;
        g += `<path d="M${x + 0.7} ${yb - 6} L${x + 1.1} ${yb - 9.6} L${x + 2.1} ${yb - 9.6} L${x + 2.5} ${yb - 6} Z" fill="#f5f6f6" stroke="#c7ccd0" stroke-width=".15"/>`;
      }
      g += packung(x1 - 11, yb, 5.2, 9, "#1f6fb5") + packung(x1 - 5.6, yb, 5.2, 9, "#1f6fb5");
    } else if (art === "schmerz") {
      for (let i = 0; i < 6; i++) {
        const x = x0 + 0.8 + i * 5.6;
        g += packung(x, yb, 5, 8.5, i < 3 ? "#d7262e" : "#f0a020");
        g += `<text x="${r(x + 2.5)}" y="${r(yb - 6)}" font-size="1.5" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">${i < 3 ? "400" : "500"}</text>`;
      }
    } else if (art === "augentropfen") {
      for (let i = 0; i < 6; i++) {
        const x = x0 + 1.4 + i * 3.4;
        g += `<path d="M${x} ${yb} L${x} ${yb - 4} L${x + 0.8} ${yb - 5} L${x + 1.2} ${yb - 6.6} L${x + 1.6} ${yb - 5} L${x + 2.4} ${yb - 4} L${x + 2.4} ${yb} Z" fill="#f7f9fa" stroke="#bcc4c9" stroke-width=".15"/><rect x="${x}" y="${yb - 3}" width="2.4" height="1.4" fill="#0f8a8a"/>`;
      }
      g += packung(x1 - 13, yb, 6, 7, "#0f8a8a") + packung(x1 - 6.6, yb, 6, 7, "#0f8a8a");
    } else if (art === "salbe") {
      for (let i = 0; i < 6; i++) {
        const x = x0 + 1.4 + i * 5.4, f = ["#d7262e", "#2e9a5b", "#7a3f9a"][i % 3];
        /* Tube steht auf dem Deckel, Falz oben */
        g += `<rect x="${x + 0.9}" y="${yb - 2}" width="2.4" height="2" rx=".3" fill="#fff" stroke="#c4cacd" stroke-width=".15"/>`;
        g += `<path d="M${x + 0.4} ${yb - 2} L${x} ${yb - 11} L${x + 4.2} ${yb - 11} L${x + 3.8} ${yb - 2} Z" fill="${TUBE}"/>`;
        g += `<rect x="${x - 0.1}" y="${yb - 11.6}" width="4.4" height=".9" fill="#d5d9dc"/><path d="M${x + 0.3} ${yb - 8.6} L${x + 3.9} ${yb - 8.6} L${x + 3.8} ${yb - 6} L${x + 0.4} ${yb - 6} Z" fill="${f}"/>`;
      }
    } else if (art === "spritze") {
      /* Einmalspritzen stehend in einem Köcher, daneben Packungen */
      g += `<rect x="${x0 + 1}" y="${yb - 5}" width="12" height="5" rx=".6" fill="#dfe8ee" stroke="#a9b8c2" stroke-width=".2"/>`;
      for (let i = 0; i < 5; i++) {
        const x = x0 + 2.2 + i * 2.2;
        g += `<rect x="${x}" y="${yb - 12}" width="1.5" height="8" rx=".2" fill="#ffffff" stroke="#9fb0bb" stroke-width=".15"/>`;
        g += `<rect x="${x + 0.1}" y="${yb - 9}" width="1.3" height="2.6" fill="#bfe0f2" opacity=".9"/>`;
        g += `<line x1="${x + 0.75}" y1="${yb - 12}" x2="${x + 0.75}" y2="${yb - 14.2}" stroke="#7f8b92" stroke-width=".3"/><rect x="${x - 0.2}" y="${yb - 14.6}" width="1.9" height=".5" fill="#8d999f"/>`;
        g += `<rect x="${x - 0.3}" y="${yb - 12.2}" width="2.1" height=".4" fill="#9fb0bb"/>`;
      }
      g += packung(x1 - 18, yb, 8, 7, "#3b4d9c") + packung(x1 - 9.5, yb, 8, 7, "#3b4d9c");
    } else {
      let x = x0 + 0.4;
      while (x < x1 - 3) {
        const w = Math.min(3.4 + rnd() * 3.6, x1 - x - 0.3), h = 6 + rnd() * 6.5;
        if (w < 2.6) break;
        g += packung(x, yb, w, h, FARBEN[Math.floor(rnd() * FARBEN.length)], rnd() < 0.12);
        x += w + 0.35;
      }
    }
    return g;
  };
  const WAREN = [
    ["hustensaft", 1, 0, "der Hustensaft", "HUS-ten-saft", "lo sciroppo", "sci-ROP-po", "cough syrup", "Hustensaft gibt es in braunen Glasflaschen — das Glas schützt vor Licht."],
    ["nasenspray", 2, 0, "das Nasenspray", "NA-sen-spray", "lo spray nasale", "SPRAY na-SA-le", "nasal spray", null],
    ["schmerztablette", 1, 1, "die Schmerztablette", "SCHMERZ-ta-blet-te", "l'antidolorifico", "an-ti-do-lo-RI-fi-co", "painkiller", "Viele Schmerztabletten gibt es nur in der Apotheke."],
    ["augentropfen", 1, 3, "die Augentropfen", "AU-gen-trop-fen", "il collirio", "col-LI-rio", "eye drops", null],
    ["salbe", 2, 3, "die Salbe", "SAL-be", "la pomata", "po-MA-ta", "ointment", null],
    ["spritze", 3, 2, "die Spritze", "SPRIT-ze", "la siringa", "si-RIN-ga", "syringe", null],
  ];
  WAREN.forEach(([art, ri, si]) => { besonders[ri + "," + si] = art === "schmerztablette" ? "schmerz" : art; });
  /* Böden aus Glas mit Preisleiste, Fächer füllen */
  boeden.forEach((yb, ri) => {
    for (let si = 0; si < spalten; si++) k += `<g transform="translate(${-cx} ${-SW.y1})">${zeichne(ri, si)}</g>`;
    k += `<rect x="${X(SW.x0 + 2)}" y="${Y(yb)}" width="${W - 4}" height="1" fill="#d7e7ee" opacity=".9"/><rect x="${X(SW.x0 + 2)}" y="${Y(yb + 1)}" width="${W - 4}" height="1.8" fill="#ffffff" stroke="#c7d0cc" stroke-width=".15"/>`;
    for (let i = 0; i < 12; i++) k += `<rect x="${r(X(SW.x0 + 6 + i * 12.2))}" y="${Y(yb + 1.2)}" width="4" height="1.4" fill="#fffbe0" stroke="#d8cf9c" stroke-width=".1"/>`;
  });
  /* senkrechte Trennwände */
  for (let s = 0; s <= spalten; s++) k += `<rect x="${r(X(SW.x0 + 2 + s * fw) - 0.8)}" y="${Y(36)}" width="1.6" height="${110 - 36 + 3}" fill="#f0f2f1" stroke="#d4dad7" stroke-width=".15"/>`;
  /* Unterbau mit Schubladen */
  k += `<rect x="${-W / 2}" y="${Y(113)}" width="${W}" height="7" fill="#eceeed"/>`;
  for (let s = 0; s < spalten; s++) k += `<rect x="${r(X(SW.x0 + 3 + s * fw))}" y="${Y(114)}" width="${r(fw - 2)}" height="5" rx=".5" fill="#f8f9f8" stroke="#cdd3d0" stroke-width=".2"/><rect x="${r(X(SW.x0 + 2 + s * fw + fw / 2) - 3)}" y="${Y(115.6)}" width="6" height=".9" rx=".45" fill="${STAHL}"/>`;
  /* unter-Teile: die beiden Fächer und die Waren */
  const zelle = (ri, si, w = 1) => ({ x: SW.x0 + 2 + si * fw + fw * w / 2, y: boeden[ri] });
  swUnter.push({ id: "ap_oberfach", de: "das obere Fach", syl: "O-be-res FACH", it: "il ripiano superiore", itSyl: "ri-PIA-no su-pe-RIO-re", en: "top shelf",
    x: SW.x0 + 2 + fw * 2, y: boeden[0] + 2.8, kunst: flaeche(-fw * 2 + 1, -12.8, fw * 4 - 2, 13.4) });
  swUnter.push({ id: "ap_unterfach", de: "das untere Fach", syl: "UN-te-res FACH", it: "il ripiano inferiore", itSyl: "ri-PIA-no in-fe-RIO-re", en: "bottom shelf",
    x: SW.x0 + 2 + fw * 1.5, y: boeden[4] + 2.8, kunst: flaeche(-fw * 1.5 + 1, -12.8, fw * 3 - 2, 13.4) });
  WAREN.forEach(([id, ri, si, de, syl, it, itSyl, en, tipp]) => {
    const z = zelle(ri, si);
    swUnter.push({ id, de, syl, it, itSyl, en, tipp: tipp || undefined, x: z.x, y: z.y, kunst: flaeche(-fw / 2 + 1, -14.5, fw - 2, 15) });
  });
  /* Glanz auf den Glasböden */
  k += `<path d="M${X(SW.x0 + 8)} ${Y(110)} L${X(SW.x0 + 30)} ${Y(36)} L${X(SW.x0 + 36)} ${Y(36)} L${X(SW.x0 + 14)} ${Y(110)} Z" fill="#fff" opacity=".12"/>`;
  S.teil({ id: "medizinschrank", de: "der Medizinschrank", syl: "Me-di-ZIN-schrank", it: "l'armadietto dei medicinali", itSyl: "ar-ma-DIET-to dei me-di-ci-NA-li", en: "medicine cabinet",
    x: cx, y: SW.y1, steht: true, kunst: k,
    zoom: { x: SW.x0 - 3, y: SW.y0 - 2, w: W + 6, h: H + 2 },
    unter: swUnter,
    tipp: "Im Medizinschrank hinter der Theke (der Sichtwahl) stehen Arzneien, die nur die Apothekerin herausgibt." });
}

/* =====================================================================
   4 — DER KOMMISSIONIERER (rechts): Roboterlager mit Glasfront
   ===================================================================== */
{
  const W = 80, H = 106;
  let k = schatten(0, .3, 42, 1.4, .25);
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="${H}" rx="1" fill="${S.lg("komm", [[0, "#f3f5f6"], [1, "#d5dadd"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="4" rx="1" fill="#2f5d46"/>`;
  /* Innenraum hinter Glas: Regalböden mit vielen Packungen */
  const gx0 = -W / 2 + 4, gx1 = W / 2 - 4, gy0 = -H + 8, gy1 = -26;
  k += `<rect x="${gx0}" y="${gy0}" width="${gx1 - gx0}" height="${gy1 - gy0}" fill="#3a4148"/>`;
  for (let y = gy0 + 6; y <= gy1; y += 6) {
    let x = gx0 + 0.5;
    while (x < gx1 - 2) {
      const w = 2 + rnd() * 3, h = 2.5 + rnd() * 2.8;
      if (x + w > gx1 - 0.5) break;
      k += `<rect x="${r(x)}" y="${r(y - h)}" width="${r(w)}" height="${r(h)}" fill="${rnd() < 0.6 ? "#eef0ef" : FARBEN[Math.floor(rnd() * FARBEN.length)]}" opacity=".88"/>`;
      x += w + 0.25;
    }
    k += `<rect x="${gx0}" y="${y}" width="${gx1 - gx0}" height=".6" fill="#8a949b"/>`;
  }
  /* Greifer auf Schiene, blaues Licht */
  k += `<rect x="${gx0}" y="${gy0 + 1}" width="${gx1 - gx0}" height="1.4" fill="#9aa4ab"/><rect x="-4" y="${gy0 + 1}" width="1.6" height="${gy1 - gy0 - 1}" fill="#aab3b9"/>`;
  k += `<rect x="-8.5" y="${gy0 + 26}" width="10" height="7" rx=".6" fill="#d5dadd" stroke="#6f7a82" stroke-width=".3"/><rect x="-7.6" y="${gy0 + 30.6}" width="8.2" height="1.6" fill="#4b545b"/><circle cx="-1.2" cy="${gy0 + 27.6}" r=".6" fill="#3fb6ff"/>`;
  k += `<rect x="${gx0}" y="${gy0}" width="${gx1 - gx0}" height="${gy1 - gy0}" fill="${S.lg("kommlicht", [[0, "#9fd3ff", 0.18], [1, "#9fd3ff", 0]])}"/>`;
  /* Glas und Rahmen */
  k += `<rect x="${gx0}" y="${gy0}" width="${gx1 - gx0}" height="${gy1 - gy0}" fill="${GLAS}" stroke="#aab4ba" stroke-width=".8"/>`;
  k += `<path d="M${gx0 + 4} ${gy1} L${gx0 + 26} ${gy0} L${gx0 + 32} ${gy0} L${gx0 + 10} ${gy1} Z" fill="#fff" opacity=".14"/>`;
  /* Bedienfeld und Ausgabe */
  k += `<rect x="-30" y="-21" width="16" height="10" rx=".8" fill="#1d2328"/><rect x="-29" y="-20" width="14" height="8" rx=".4" fill="${S.lg("touch", [[0, "#3a8fc4"], [1, "#1f5f8a"]])}"/>`;
  k += `<rect x="-27.6" y="-18.6" width="5" height="2" rx=".3" fill="#fff" opacity=".8"/><rect x="-21.6" y="-18.6" width="5" height="2" rx=".3" fill="#fff" opacity=".5"/><rect x="-27.6" y="-15.4" width="11" height="1.4" rx=".3" fill="#7fd08b"/>`;
  k += `<rect x="-6" y="-21" width="30" height="8" rx="1" fill="#c9cfd3"/><rect x="-4" y="-19" width="26" height="4" rx=".6" fill="#2c3237"/><text x="9" y="-10.4" font-size="2" text-anchor="middle" fill="#55606a" font-family="Arial">Ausgabe</text>`;
  k += `<rect x="${-W / 2}" y="-5" width="${W}" height="5" fill="#b9c0c4"/>`;
  S.teil({ id: "kommissionierer", de: "der Kommissionierer", syl: "Kom-mis-si-o-NIE-rer", it: "il magazzino automatico", itSyl: "ma-gaz-ZI-no au-to-MA-ti-co", en: "dispensing robot",
    x: 275, y: WAND_UNTEN, steht: true, kunst: k,
    tipp: "Der Kommissionierer ist ein Roboter: Er holt die Packung aus dem Lager und schickt sie zur Theke." });
}

/* =====================================================================
   5 — DIE APOTHEKERIN (hinter dem HV-Tisch, weißer Kittel)
   ===================================================================== */
{
  const m = B.mensch({ id: "ap_apo", geschlecht: "w", pose: "stehen", blick: 30, frisur: "zopf", haarfarbe: "braun", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "bluse", farbe: "hellblau" }, jacke: { stueck: "arztkittel" }, unterteil: { stueck: "hose", farbe: "grau" }, schuhe: { stueck: "halbschuh", farbe: "weiss" }, zubehoer: { stueck: "brille" } } }, 82);
  /* Namensschild am Kittel */
  const schild = `<rect x="-6.5" y="-55.5" width="5" height="2" rx=".3" fill="#fff" stroke="#2f5d46" stroke-width=".2"/><rect x="-6.3" y="-55.3" width="1.2" height="1.6" fill="${ROT}"/>`;
  S.teil({ id: "apothekerin", de: "die Apothekerin", syl: "A-po-THE-ke-rin", it: "la farmacista", itSyl: "far-ma-CI-sta", en: "pharmacist", x: 206, y: 170, kunst: m.svg + schild,
    tipp: "Die Apothekerin berät: „Nehmen Sie die Tablette dreimal am Tag nach dem Essen.“" });
}

/* =====================================================================
   6 — DER HV-TISCH (die Theke): zwei Beratungsplätze
   ===================================================================== */
const TH = { y0: 126, y1: 176 };
const MODULE = [[56, 150], [160, 266]];
{
  const cx = 161;
  let k = "";
  const hT = TH.y1 - TH.y0;
  for (const [a0, a1] of MODULE) {
    const a = a0 - cx, b = a1 - cx;
    k += `<path d="M${a - 1.5} ${-hT} L${b + 1.5} ${-hT} L${b + 2} ${-hT + 3.6} L${a - 2} ${-hT + 3.6} Z" fill="${S.lg("platte", [[0, "#ffffff"], [1, "#e1e5e3"]])}"/>`;
    k += `<rect x="${a - 2}" y="${-hT + 3.6}" width="${b - a + 4}" height="1.4" fill="#cdd3d0"/>`;
    k += `<rect x="${a}" y="${-hT + 5}" width="${b - a}" height="${hT - 9}" fill="${WEISS_V}"/>`;
    /* Holzband und beleuchtetes Feld mit dem A */
    k += `<rect x="${a}" y="${-hT + 9}" width="${b - a}" height="10" fill="${HOLZ}"/>`;
    for (let x = a + 2; x < b; x += 2.6) k += `<rect x="${r(x)}" y="${-hT + 9}" width=".35" height="10" fill="#8f6a42" opacity=".35"/>`;
    const m = (a + b) / 2;
    k += `<rect x="${r(m - 11)}" y="${-hT + 23}" width="22" height="15" rx="1.4" fill="${S.lg("leucht", [[0, "#ffffff"], [1, "#eef3f0"]])}" stroke="#d3dad6" stroke-width=".3"/>`;
    k += `<g transform="translate(${r(m)} ${-hT + 30.4})">${apothekenA(0.68)}</g>`;
    k += `<rect x="${a}" y="-4" width="${b - a}" height="4" fill="#5b6560"/>`;
    k += `<rect x="${a}" y="${-hT + 5}" width="${b - a}" height="1.2" fill="#fff" opacity=".6"/>`;
  }
  S.teil({ id: "theke_ap", de: "die Theke", syl: "THE-ke", it: "il bancone", itSyl: "ban-CO-ne", en: "counter", x: cx, y: TH.y1, steht: true, kunst: k,
    tipp: "In der Apotheke heißt die Theke „HV-Tisch“ — Handverkaufstisch." });
}

/* ---------- auf dem HV-Tisch ----------------------------------------- */
const PL = TH.y0 + 2.4;  /* Standfläche auf der Platte */
{
  /* DAS REZEPT — rosa Kassenrezept, flach auf der Platte */
  let k = `<path d="M-8.5 0 L7.5 -.6 L8.4 -3.6 L-7.2 -3.2 Z" fill="${S.lg("rezept", [[0, "#f6c9d6"], [1, "#eeb1c4"]])}" stroke="#cf8aa2" stroke-width=".15"/>`;
  k += `<path d="M-6.8 -2.4 L-1 -2.6 M-6.6 -1.4 L2 -1.7 M-6.4 -.6 L5 -1" stroke="#b05a78" stroke-width=".18"/><rect x="3.2" y="-3.2" width="3" height="1.4" fill="#fff" opacity=".7" transform="skewX(-12)"/>`;
  S.teil({ oben: true, id: "rezept", de: "das Rezept", syl: "Re-ZEPT", it: "la ricetta", itSyl: "ri-CET-ta", en: "prescription", x: 180, y: PL + .6, kunst: k + flaeche(-9, -5, 18, 5.6),
    tipp: "Das Rezept schreibt der Arzt. Heute kommt es oft als E-Rezept auf der Gesundheitskarte." });
}
{
  /* DIE PACKUNG — Faltschachtel, die die Apothekerin bereitgelegt hat */
  let k = schatten(0, .2, 6, .7, .25);
  k += `<path d="M-5 0 L-5 -7 L-3.4 -8.4 L6.4 -8.4 L6.4 -1.4 L5 0 Z" fill="#e7eaec"/>`;
  k += `<rect x="-5" y="-7" width="10" height="7" fill="#fdfdfb" stroke="#c5cacd" stroke-width=".15"/><rect x="-5" y="-5.6" width="10" height="2.2" fill="#1f6fb5"/>`;
  k += `<text x="0" y="-4" font-size="1.6" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">Amoxi 1000</text><rect x="-3.6" y="-2.2" width="5" height=".35" fill="#8a9095"/>`;
  k += `<path d="M5 0 L5 -7 L6.4 -8.4 L6.4 -1.4 Z" fill="#cfd5d8"/>`;
  S.teil({ oben: true, id: "packung", de: "die Packung", syl: "PA-ckung", it: "la confezione", itSyl: "con-fe-ZIO-ne", en: "packet", x: 196, y: PL, steht: true, kunst: k });
}
{
  /* DIE TABLETTE — Blister mit Tabletten, an die Packung gelehnt */
  let k = `<path d="M-4.6 0 L4.6 0 L5.4 -2.6 L-3.8 -2.6 Z" fill="${S.lg("blister", [[0, "#e8ecef"], [0.5, "#c3cbd1"], [1, "#eef1f3"]], 0, 0, 1, 0)}" stroke="#9aa5ad" stroke-width=".15"/>`;
  for (let i = 0; i < 5; i++) for (let j = 0; j < 2; j++) k += `<ellipse cx="${r(-3.2 + i * 1.8 + j * 0.4)}" cy="${r(-0.75 - j * 1.1)}" rx=".7" ry=".38" fill="#ffffff" stroke="#b9c2c8" stroke-width=".1"/>`;
  k += `<ellipse cx="6.6" cy="-.4" rx=".9" ry=".45" fill="#fff" stroke="#c4ccd1" stroke-width=".12"/>`;
  S.teil({ oben: true, id: "tablette", de: "die Tablette", syl: "Ta-BLET-te", it: "la pastiglia", itSyl: "pa-STI-glia", en: "tablet", x: 209, y: PL + .4, kunst: k + flaeche(-5, -3.4, 12.6, 3.8) });
}
{
  /* DIE KASSE — Bildschirm zur Apothekerin, schräg zu sehen; Bondrucker */
  let k = schatten(0, .3, 12, 1.1, .3);
  k += `<rect x="-2" y="-8" width="2.4" height="8" fill="#3a3f44"/><rect x="-7" y="-1.4" width="12" height="1.4" rx=".5" fill="#2b2f33"/>`;
  k += `<path d="M-11 -23 L6 -21.2 L6 -8.8 L-11 -9.6 Z" fill="#1d2125"/><path d="M-10 -22 L5 -20.4 L5 -9.8 L-10 -10.4 Z" fill="${S.lg("kassebild", [[0, "#e9f3ee"], [1, "#c7ddd2"]])}"/>`;
  k += `<path d="M-9 -20.2 L-1 -19.4 L-1 -17.8 L-9 -18.6 Z" fill="#2f5d46"/>`;
  for (let i = 0; i < 4; i++) k += `<path d="M-9 ${-16.8 + i * 1.6} L3.8 ${-15.6 + i * 1.6}" stroke="#7d9488" stroke-width=".35"/>`;
  k += `<path d="M-10 -22 L-5 -21.5 L-10 -14 Z" fill="#fff" opacity=".18"/>`;
  /* Bondrucker daneben */
  k += `<rect x="7.5" y="-5.6" width="7" height="5.6" rx=".8" fill="#2f3438"/><rect x="8.4" y="-6.4" width="5.2" height="1" fill="#f4f4f1"/><path d="M8.6 -6.4 L13.4 -6.4 L13 -9 L9 -9 Z" fill="#fbfbf8"/>`;
  S.teil({ id: "kasse_ap", de: "die Kasse", syl: "KAS-se", it: "la cassa", itSyl: "CAS-sa", en: "till", x: 238, y: PL, steht: true, kunst: k });
}
{
  /* DAS KARTENLESEGERÄT — mit gesteckter Gesundheitskarte (E-Rezept) */
  let k = schatten(0, .2, 4.5, .7, .3);
  k += `<path d="M-4 0 L4 0 L3.4 -4.6 L-3.4 -4.6 Z" fill="#2a2e33"/><rect x="-3.6" y="-9.6" width="7.2" height="5.4" rx=".6" fill="#33393f"/>`;
  k += `<rect x="-2.8" y="-9" width="5.6" height="2.4" rx=".3" fill="#9cd3e8"/><text x="0" y="-7.3" font-size="1.2" text-anchor="middle" fill="#0b3b52" font-family="Arial">Karte OK</text>`;
  for (let i = 0; i < 6; i++) k += `<rect x="${-2.4 + (i % 3) * 1.8}" y="${-6.2 + Math.floor(i / 3) * 1}" width="1.3" height=".7" rx=".2" fill="${i === 5 ? "#3ca35a" : "#596068"}"/>`;
  k += `<rect x="-2.4" y="-13.6" width="4.8" height="4.4" rx=".4" fill="${S.lg("egk", [[0, "#4fa3d8"], [1, "#2a6fa8"]])}"/><rect x="-1.6" y="-12.4" width="1.4" height="1.1" rx=".2" fill="#d9b44a"/><rect x="-.2" y="-11" width="2" height=".4" fill="#fff" opacity=".8"/>`;
  S.teil({ oben: true, id: "kartenlesegeraet", de: "das Kartenlesegerät", syl: "KAR-ten-le-se-ge-rät", it: "il lettore di carte", itSyl: "let-TO-re di CAR-te", en: "card reader", x: 256, y: PL, steht: true, kunst: k,
    tipp: "Hier steckt die Gesundheitskarte: So holt die Apotheke das E-Rezept ab." });
}
{
  /* DAS FIEBERTHERMOMETER — Thekenaufsteller links */
  let k = schatten(0, .2, 6, .7, .25);
  k += `<path d="M-6 0 L6 0 L6 -4 L-6 -6 Z" fill="${S.lg("aufst", [[0, "#2f7d5b"], [1, "#245f45"]])}"/><path d="M-6 -6 L6 -4 L6 -13 L-6 -15 Z" fill="#ffffff" stroke="#c8d1cc" stroke-width=".2"/>`;
  k += `<text x="0" y="-11.8" font-size="1.7" text-anchor="middle" fill="${ROT}" font-family="Arial" font-weight="bold" transform="rotate(9.5 0 -11.8)">Fieber?</text>`;
  for (let i = 0; i < 3; i++) {
    const x = -4 + i * 4;
    k += `<g transform="rotate(9.5 ${x} -6)"><rect x="${x - .9}" y="-10.4" width="1.8" height="7.4" rx=".9" fill="#f7f8f8" stroke="#b6bfc4" stroke-width=".15"/><rect x="${x - .6}" y="-8.8" width="1.2" height="1.8" fill="#9fd0a0"/><rect x="${x - .35}" y="-3.6" width=".7" height="1.4" fill="#c1c7cb"/></g>`;
  }
  S.teil({ oben: true, id: "fieberthermometer", de: "das Fieberthermometer", syl: "FIE-ber-ther-mo-me-ter", it: "il termometro", itSyl: "ter-MO-me-tro", en: "thermometer", x: 70, y: PL, steht: true, kunst: k });
}
{
  /* DIE HUSTENBONBONS — Glas mit Bonbons */
  let k = schatten(0, .2, 4.5, .7, .25);
  k += `<path d="M-4 0 L4 0 L4.2 -8.6 Q4.2 -9.6 3 -9.6 L-3 -9.6 Q-4.2 -9.6 -4.2 -8.6 Z" fill="#e8f3f6" opacity=".5" stroke="#aac0c8" stroke-width=".25"/>`;
  for (let i = 0; i < 16; i++) k += `<ellipse cx="${r(-3 + rnd() * 6)}" cy="${r(-0.9 - (i / 16) * 6.6 - rnd() * .6)}" rx="1" ry=".55" fill="${["#e2a43a", "#c2410c", "#f2d16b"][i % 3]}"/>`;
  k += `<rect x="-3.4" y="-11" width="6.8" height="1.6" rx=".5" fill="${STAHL}"/><path d="M-3.4 -8.8 L-3 -1" stroke="#fff" stroke-width=".5" opacity=".7"/>`;
  S.teil({ oben: true, id: "hustenbonbon", de: "das Hustenbonbon", syl: "HUS-ten-bon-bon", it: "la caramella per la tosse", itSyl: "ca-ra-MEL-la per la TOS-se", en: "cough drop", x: 86, y: PL, steht: true, kunst: k });
}
{
  /* DIE ZEITSCHRIFT — Kundenzeitschrift im Ständer */
  let k = schatten(0, .2, 5, .7, .25);
  k += `<path d="M-5 0 L5 0 L5 -2 L-5 -2 Z" fill="#c9d1cd"/>`;
  for (let i = 0; i < 2; i++) k += `<g transform="rotate(-8 0 0) translate(${-i * 1} ${-i * .4})"><rect x="-4" y="-13" width="8" height="11" fill="#fff" stroke="#c6cbc9" stroke-width=".15"/><rect x="-4" y="-13" width="8" height="2.6" fill="${i ? "#2f7d5b" : ROT}"/><text x="0" y="-11.2" font-size="1.5" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">GESUND</text><rect x="-3.2" y="-9.6" width="6.4" height="4.6" fill="${S.lg("cover", [[0, "#8fc4dd"], [1, "#e7c99c"]])}"/><rect x="-3.2" y="-4.2" width="5" height=".5" fill="#555"/></g>`;
  S.teil({ oben: true, id: "zeitschrift_ap", de: "die Zeitschrift", syl: "ZEIT-schrift", it: "la rivista", itSyl: "ri-VI-sta", en: "magazine", x: 106, y: PL, steht: true, kunst: k,
    tipp: "Die Kundenzeitschrift liegt in vielen Apotheken kostenlos aus." });
}
{
  /* DIE TÜTE — weiße Apothekentüten mit rotem A */
  let k = schatten(0, .2, 5.5, .7, .25);
  for (let i = 0; i < 3; i++) k += `<path d="M${-5 + i * .4} ${-i * .3} L${5 + i * .4} ${-i * .3} L${4.4 + i * .4} ${-12 - i * .3} L${-4.4 + i * .4} ${-12 - i * .3} Z" fill="${i === 2 ? "#ffffff" : "#eef0ef"}" stroke="#c4cac7" stroke-width=".15"/>`;
  k += `<g transform="translate(1 -6.4)">${apothekenA(0.36)}</g><path d="M-2 -12.6 Q.8 -15.4 3.6 -12.6" stroke="#c4cac7" stroke-width=".5" fill="none"/>`;
  S.teil({ oben: true, id: "tuete_ap", de: "die Tüte", syl: "TÜ-te", it: "il sacchetto", itSyl: "sac-CHET-to", en: "bag", x: 132, y: PL, steht: true, kunst: k });
}

/* =====================================================================
   7 — DIE FREIWAHL (vorne links): Regal zum Selbstnehmen — Lupe
   ===================================================================== */
const FW = { x0: 2, x1: 62, y0: 114, y1: 192 };
{
  const W = FW.x1 - FW.x0, H = FW.y1 - FW.y0, cx = (FW.x0 + FW.x1) / 2;
  let k = schatten(0, .4, 32, 1.8, .28);
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="${H}" rx=".8" fill="${WEISS_V}"/>`;
  k += `<rect x="${-W / 2 + 2}" y="${-H + 9}" width="${W - 4}" height="${H - 17}" fill="${S.lg("fwinnen", [[0, "#eef5f1"], [1, "#dce8e1"]])}"/>`;
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="8" rx=".8" fill="#2f7d5b"/><text x="0" y="${-H + 5.6}" font-size="4" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">Pflege &amp; Gesundheit</text>`;
  k += `<rect x="${-W / 2}" y="-8" width="${W}" height="8" fill="#d9dfdc"/>`;
  const boeden = [-H + 25, -H + 42, -H + 59, -8];
  const unter = [];
  const ware = [
    { id: "pflaster", boden: 0, x0: -27, x1: -1, de: "das Pflaster", syl: "PFLAS-ter", it: "il cerotto", itSyl: "ce-ROT-to", en: "plaster", tipp: "Pflaster gibt es zum Selbstnehmen — dafür braucht man kein Rezept." },
    { id: "sonnencreme", boden: 0, x0: 1, x1: 27, de: "die Sonnencreme", syl: "SON-nen-creme", it: "la crema solare", itSyl: "CRE-ma so-LA-re", en: "sun cream" },
    { id: "kraeutertee", boden: 1, x0: -27, x1: -1, de: "der Kräutertee", syl: "KRÄU-ter-tee", it: "la tisana", itSyl: "ti-SA-na", en: "herbal tea", tipp: "Kamille, Salbei, Fenchel: Kräutertee hilft bei Erkältung und Bauchweh." },
    { id: "handcreme", boden: 1, x0: 1, x1: 27, de: "die Handcreme", syl: "HAND-creme", it: "la crema per le mani", itSyl: "CRE-ma per le MA-ni", en: "hand cream" },
    { id: "traubenzucker", boden: 2, x0: -27, x1: 27, de: "der Traubenzucker", syl: "TRAU-ben-zu-cker", it: "lo zucchero d'uva", itSyl: "ZUC-che-ro d'U-va", en: "glucose tablets" },
  ];
  for (const w of ware) {
    const yb = boeden[w.boden];
    let g = "";
    if (w.id === "pflaster") {
      for (let i = 0; i < 5; i++) { const x = w.x0 + 0.5 + i * 5.1; g += `<rect x="${r(x)}" y="${yb - 10}" width="4.6" height="10" rx=".3" fill="${S.lg("pfl", [[0, "#f6d7b8"], [1, "#e8be95"]])}" stroke="#c99a6c" stroke-width=".15"/><rect x="${r(x)}" y="${yb - 8}" width="4.6" height="2.2" fill="${ROT}"/><rect x="${r(x + 0.9)}" y="${yb - 4.6}" width="2.8" height="1.2" rx=".5" fill="#f9e9d7" stroke="#d2a77d" stroke-width=".12"/>`; }
    } else if (w.id === "sonnencreme") {
      for (let i = 0; i < 5; i++) { const x = w.x0 + 0.8 + i * 5; g += `<path d="M${r(x)} ${yb} L${r(x)} ${yb - 9} Q${r(x + 2.1)} ${yb - 10.6} ${r(x + 4.2)} ${yb - 9} L${r(x + 4.2)} ${yb} Z" fill="${["#f6b520", "#ffffff", "#f6b520", "#3aa3d9", "#ffffff"][i]}" stroke="#d1a03c" stroke-width=".15"/><rect x="${r(x + 1.2)}" y="${yb - 1.6}" width="1.8" height="1.6" fill="#f0f0f0"/><circle cx="${r(x + 2.1)}" cy="${yb - 6}" r="1.2" fill="#f28a1a"/><text x="${r(x + 2.1)}" y="${yb - 3}" font-size="1.4" text-anchor="middle" fill="#7a4a0a" font-family="Arial" font-weight="bold">50</text>`; }
    } else if (w.id === "kraeutertee") {
      for (let i = 0; i < 4; i++) { const x = w.x0 + 0.5 + i * 6.4; g += `<rect x="${r(x)}" y="${yb - 9}" width="6" height="9" rx=".3" fill="${["#9cc35b", "#e9d36a", "#7fb6a0", "#c8a0d8"][i]}" stroke="#7d8f5a" stroke-width=".15"/><rect x="${r(x + 0.6)}" y="${yb - 7.4}" width="4.8" height="3" fill="#fff" opacity=".85"/><path d="M${r(x + 2)} ${yb - 5.2} q1 -1.6 2 0" stroke="#4d7f2a" stroke-width=".4" fill="none"/>`; }
    } else if (w.id === "handcreme") {
      for (let i = 0; i < 5; i++) { const x = w.x0 + 0.6 + i * 5.1; g += `<rect x="${r(x + 0.7)}" y="${yb - 2.2}" width="3" height="2.2" rx=".4" fill="${["#e45f8c", "#7a3f9a", "#e45f8c", "#2e9a5b", "#7a3f9a"][i]}"/><path d="M${r(x + 0.9)} ${yb - 2.2} L${r(x + 0.2)} ${yb - 10.4} L${r(x + 4.2)} ${yb - 10.4} L${r(x + 3.5)} ${yb - 2.2} Z" fill="${TUBE}"/><rect x="${r(x + 0.1)}" y="${yb - 11}" width="4.2" height=".8" fill="#d6dadd"/><rect x="${r(x + 0.8)}" y="${yb - 7.6}" width="2.8" height="2.2" fill="${["#f7c4d6", "#d9c4ea", "#f7c4d6", "#c4e6d0", "#d9c4ea"][i]}"/>`; }
    } else {
      for (let i = 0; i < 9; i++) { const x = w.x0 + 1 + i * 5.9; g += `<rect x="${r(x)}" y="${yb - 7}" width="5.2" height="7" rx=".8" fill="${["#ffd84a", "#ff8a3d", "#ffd84a", "#7ec850", "#ff6b8a", "#ffd84a", "#ff8a3d", "#7ec850", "#ffd84a"][i]}"/><rect x="${r(x + 0.6)}" y="${yb - 5.2}" width="4" height="2.4" rx=".4" fill="#fff" opacity=".85"/><rect x="${r(x + 0.4)}" y="${yb - 6.6}" width="1" height="5.6" fill="#fff" opacity=".3"/>`; }
    }
    k += g;
    unter.push({ id: w.id, de: w.de, syl: w.syl, it: w.it, itSyl: w.itSyl, en: w.en, tipp: w.tipp, x: cx + (w.x0 + w.x1) / 2, y: FW.y1 + yb, kunst: flaeche(-(w.x1 - w.x0) / 2, -13, w.x1 - w.x0, 13.6) });
  }
  for (const yb of boeden.slice(0, 3)) {
    k += `<rect x="${-W / 2 + 1.5}" y="${yb}" width="${W - 3}" height="2.2" fill="#ffffff" stroke="#c8d0cc" stroke-width=".2"/>`;
    for (let i = 0; i < 5; i++) k += `<rect x="${-W / 2 + 4 + i * 11.4}" y="${yb + 0.5}" width="4.4" height="1.4" fill="#fff6c8" stroke="#d6c97e" stroke-width=".1"/>`;
  }
  /* unterstes Fach: Babypflege-Pakete */
  for (let i = 0; i < 4; i++) k += `<rect x="${-26 + i * 13}" y="-16.2" width="12" height="8.2" rx=".8" fill="${["#bfe0f2", "#f8d0de", "#bfe0f2", "#e8f0c8"][i]}" stroke="#a9bcc8" stroke-width=".2"/><circle cx="${-20 + i * 13}" cy="-12" r="2" fill="#fff" opacity=".8"/>`;
  k += `<rect x="${-W / 2 + 1.5}" y="-8" width="${W - 3}" height="1.4" fill="#fff"/>`;
  k += `<rect x="${-W / 2}" y="${-H}" width="2" height="${H}" fill="#e3e8e5"/><rect x="${W / 2 - 2}" y="${-H}" width="2" height="${H}" fill="#cfd6d2"/>`;
  S.teil({ id: "freiwahl", de: "das Regal", syl: "Re-GAL", it: "lo scaffale", itSyl: "scaf-FA-le", en: "shelf", x: cx, y: FW.y1, steht: true, kunst: k,
    zoom: { x: FW.x0 - 2, y: FW.y0 - 2, w: W + 4, h: H - 18 },
    unter,
    tipp: "Aus der Freiwahl darf man sich selbst etwas nehmen." });
}

/* =====================================================================
   8 — DIE WAAGE (Personenwaage mit Säule) und DER KUNDE
   ===================================================================== */
{
  let k = schatten(0, .3, 11, 1.4, .3);
  k += `<path d="M-10 0 L10 0 L8.6 -3.2 L-8.6 -3.2 Z" fill="${S.lg("wplatte", [[0, "#d9dee1"], [1, "#9aa3a9"]])}"/><path d="M-8 -3.2 L8 -3.2 L7.4 -4.2 L-7.4 -4.2 Z" fill="#3d454b"/>`;
  k += `<rect x="-1.4" y="-50" width="2.8" height="46" fill="${STAHL}"/>`;
  k += `<rect x="-7" y="-60" width="14" height="11" rx="1.6" fill="#2f7d5b"/><rect x="-5.4" y="-58.4" width="10.8" height="4.4" rx=".5" fill="#10221a"/><text x="0" y="-55" font-size="3" text-anchor="middle" fill="#7cff8a" font-family="monospace">72,4</text>`;
  k += `<text x="0" y="-50.8" font-size="1.7" text-anchor="middle" fill="#fff" font-family="Arial">kg · BMI</text><rect x="-7" y="-60" width="14" height="2" rx="1" fill="#fff" opacity=".18"/>`;
  S.teil({ id: "waage_ap", de: "die Waage", syl: "WAA-ge", it: "la bilancia", itSyl: "bi-LAN-cia", en: "scales", x: 76, y: 194, steht: true, kunst: k,
    tipp: "Auf der Personenwaage kann man sich in der Apotheke wiegen." });
}
{
  const m = B.mensch({ id: "ap_kunde", geschlecht: "m", pose: "stehen", blick: -60, frisur: "kurz", haarfarbe: "dunkelbraun", haut: "mittel",
    kleidung: { oberteil: { stueck: "pullover", farbe: "grau" }, jacke: { stueck: "jacke", farbe: "blau" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" }, zubehoer: { stueck: "schal", farbe: "rot" } } }, 104);
  S.teil({ id: "kunde_ap", de: "der Kunde", syl: "KUN-de", it: "il cliente", itSyl: "cli-EN-te", en: "customer", x: 292, y: 197, kunst: m.svg,
    tipp: "Der Kunde ist erkältet und fragt: „Haben Sie etwas gegen Husten?“" });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/apotheke.js"));
console.log(aus);
