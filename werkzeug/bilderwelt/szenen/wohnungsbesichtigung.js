#!/usr/bin/env node
/* =====================================================================
   DIE WOHNUNGSBESICHTIGUNG (FASSUNG 852) — Bilderwelt neu
   ---------------------------------------------------------------------
   RECHERCHE (Gründerzeit-Altbau in Berlin/Leipzig, Ratgeber
   „Wohnungsbesichtigung: worauf achten?“, Mietvertrag-Checklisten):
   - Altbau um 1900: Decken 3,2 m hoch mit STUCK (Hohlkehle, Rosette in
     der Mitte – in der leeren Wohnung hängt dort nur eine GLÜHBIRNE),
     breite DIELEN aus Holz, hohe profilierte Fußleisten.
   - Hohe Holzfenster mit Sprossen, tiefem FENSTERBRETT, darunter ein
     gusseiserner Glieder-HEIZKÖRPER mit Thermostat; außen ein
     ROLLLADEN mit Gurtwickler an der Wand; oft eine BALKONTÜR.
   - Zweiflügelige FLÜGELTÜR mit Oberlicht zum Flur, darin steckt der
     alte Buntbart-SCHLÜSSEL; im Flur der Zählerkasten mit dem
     STROMZÄHLER (Zählerstand bei Übergabe notieren!).
   - Bei der Besichtigung: der MAKLER mit seiner Mappe (Exposé und
     MIETVERTRAG: Kaltmiete, NEBENKOSTEN, KAUTION höchstens drei
     Kaltmieten, KÜNDIGUNGSFRIST drei Monate), ein Paar als
     INTERESSENTEN mit dem GRUNDRISS. Ein paar UMZUGSKARTONS des
     Vormieters stehen noch da (halb leer geräumt).
   Maßstab (Augenhöhe 1,6 m, Fluchtpunkt 160/88): Rückwand ≈ 40
   Einheiten je Meter (Wandfuß y 152), vorne (y 200) ≈ 70.
   Makler 1,82 m, Interessentin 1,68 m, Interessent 1,85 m, Tür 2,5 m.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "wohnungsbesichtigung", titel: "Die Wohnungsbesichtigung", emoji: "🔑", thema: "Zuhause", kuerzel: "b15e", fassung: 852 });
const rnd = zufall(1905);
const r = B.r;

const WAND_UNTEN = 152, SW = 40, VP = { x: 160, y: 88 };
const DECKE = WAND_UNTEN - 3.2 * SW;         /* y 24 */
const M = (y) => SW * (y - VP.y) / (WAND_UNTEN - VP.y);
const Y = (h) => WAND_UNTEN - h * SW;        /* Höhe an der Rückwand */

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const WEISS = S.lg("weiss", [[0, "#ffffff"], [1, "#e9e7e2"]]);
const LACK = S.lg("lack", [[0, "#fbfaf6"], [1, "#e4e1d9"]], 0, 0, 1, 0);

/* =====================================================================
   KULISSE — Decke in Flucht, frisch gestrichene Wand, Fußleiste
   ===================================================================== */
{
  let k = `<rect x="0" y="0" width="320" height="${DECKE}" fill="${S.lg("decke", [[0, "#f1efea"], [1, "#e7e4dd"]])}"/>`;
  k += `<rect x="0" y="${DECKE}" width="320" height="${WAND_UNTEN - DECKE}" fill="${S.lg("wand", [[0, "#f6f3ec"], [1, "#ebe6dc"]])}"/>`;
  k += `<rect x="0" y="${DECKE}" width="320" height="${WAND_UNTEN - DECKE}" fill="${S.rg("sonne", [[0, "#fff6dc", 0.55], [1, "#fff6dc", 0]], 0.45, 0.35, 0.6)}"/>`;
  /* Raufaser, ganz zart */
  for (let i = 0; i < 80; i++) k += `<circle cx="${r(rnd() * 320)}" cy="${r(DECKE + rnd() * (WAND_UNTEN - DECKE))}" r="${r(0.25 + rnd() * 0.4)}" fill="${rnd() < 0.5 ? "#ddd6c8" : "#fffdf7"}" opacity=".5"/>`;
  /* Lichtflecken der Fenster auf dem Boden kommen beim Boden */
  /* hohe profilierte Fußleiste */
  k += `<rect x="0" y="${WAND_UNTEN - 6}" width="320" height="6" fill="${S.lg("leiste", [[0, "#ffffff"], [0.3, "#efece6"], [1, "#d9d5cc"]])}"/><rect x="0" y="${WAND_UNTEN - 6}" width="320" height=".8" fill="#cfcac0"/><rect x="0" y="${WAND_UNTEN - 4.2}" width="320" height=".4" fill="#fff"/>`;
  S.hinten(k);
}

/* =====================================================================
   1 — DER DIELENBODEN (breite Holzdielen in Fluchtperspektive)
   ===================================================================== */
{
  let k = `<rect x="0" y="0" width="320" height="${200 - WAND_UNTEN}" fill="${S.lg("diele", [[0, "#b98a52"], [1, "#a0723e"]])}"/>`;
  const t = (200 - VP.y) / (WAND_UNTEN - VP.y);
  for (let i = -26; i <= 26; i++) {
    const xb = VP.x + i * 0.2 * SW, xf = VP.x + (xb - VP.x) * t;
    /* Fuge auf die Bildbreite zuschneiden (nichts ragt aus dem Bild) */
    const hB = 200 - WAND_UNTEN, cut = (xa, xe, d = 0) => {
      let t0 = 0, t1 = 1; const dx = xe - xa;
      if (dx !== 0) { const ta = (0 - xa) / dx, tb = (320 - xa) / dx; t0 = Math.max(t0, Math.min(ta, tb)); t1 = Math.min(t1, Math.max(ta, tb)); }
      return t1 > t0 ? `<path d="M${r(xa + dx * t0)} ${r(hB * t0)} L${r(xa + dx * t1)} ${r(hB * t1)}"` : null;
    };
    const fuge = cut(xb, xf);
    if (fuge) k += `${fuge} stroke="#6f4a24" stroke-width=".4" opacity=".7"/>`;
    /* Stoßfugen versetzt, Maserung */
    const f = 0.15 + rnd() * 0.6, yy = (200 - WAND_UNTEN) * f;
    const xx = r(xb + (xf - xb) * f), w = 0.2 * SW * (1 + (t - 1) * f);
    if (xx > 0 && xx + w < 320) k += `<line x1="${xx}" y1="${r(yy)}" x2="${r(xx + w)}" y2="${r(yy)}" stroke="#6f4a24" stroke-width=".35" opacity=".6"/>`;
    const mas = i % 2 ? cut(xb + 2, xf + 2 * t + 1) : null;
    if (mas) k += `${mas} stroke="#d9a96a" stroke-width="1.2" opacity=".18"/>`;
  }
  /* Sonnenflecken vom Fenster und von der Balkontür */
  k += `<path d="M106 2 L150 2 L176 28 L118 28 Z" fill="#fff4cf" opacity=".22"/><path d="M188 2 L230 2 L262 44 L206 44 Z" fill="#fff4cf" opacity=".2"/>`;
  k += `<rect x="0" y="0" width="320" height="${200 - WAND_UNTEN}" fill="${S.lg("bodenlicht", [[0, "#000", 0.15], [0.4, "#000", 0], [1, "#fff", 0.06]])}"/>`;
  S.teil({ id: "dielenboden", de: "der Dielenboden", syl: "DIE-len-bo-den", it: "il pavimento in legno", itSyl: "pa-vi-MEN-to in LE-gno", en: "floorboards",
    x: 0, y: WAND_UNTEN, kunst: k, tipp: "Im Altbau liegen oft alte Holzdielen – sie knarren ein bisschen." });
}

/* =====================================================================
   2 — DER STUCK (Hohlkehle an der Decke) und 3 — DIE GLÜHBIRNE
   ===================================================================== */
{
  S.def(`<pattern id="${S.id("eier")}" width="4" height="3.2" patternUnits="userSpaceOnUse"><rect width="4" height="3.2" fill="#f4f1ea"/><ellipse cx="2" cy="1.6" rx="1.2" ry="1.3" fill="#fbfaf5" stroke="#d3cdc0" stroke-width=".3"/><path d="M0 0 L0 3.2" stroke="#cfc9bb" stroke-width=".5"/></pattern>`);
  let k = `<rect x="0" y="-9" width="320" height="2.4" fill="${S.lg("kehle", [[0, "#e2ddd1"], [1, "#fbfaf6"]])}"/>`;
  k += `<rect x="0" y="-6.6" width="320" height="3.2" fill="url(#${S.id("eier")})"/>`;
  k += `<rect x="0" y="-3.4" width="320" height="1.2" fill="#fbfaf6"/><rect x="0" y="-2.2" width="320" height=".6" fill="#d6d0c3"/>`;
  k += `<rect x="0" y="-1.6" width="320" height="1.6" fill="${S.lg("perl", [[0, "#f7f5ef"], [1, "#dcd6ca"]])}"/>`;
  /* Rosette an der Decke (in Flucht als Ellipse) */
  k += `<ellipse cx="170" cy="${r(-DECKE - 8 + 14)}" rx="20" ry="4.6" fill="#f6f3ec" stroke="#d6d0c3" stroke-width=".4"/>`;
  for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8; k += `<ellipse cx="${r(170 + Math.cos(a) * 14)}" cy="${r(-DECKE + 6 + Math.sin(a) * 3.2)}" rx="2.4" ry=".8" fill="#fbfaf6" stroke="#d6d0c3" stroke-width=".25"/>`; }
  k += `<ellipse cx="170" cy="${r(-DECKE + 6)}" rx="6" ry="1.4" fill="#fbfaf6" stroke="#d6d0c3" stroke-width=".3"/>`;
  S.teil({ oben: true, id: "stuck", de: "der Stuck", syl: "STUCK", it: "lo stucco", itSyl: "STUC-co", en: "stucco",
    x: 0, y: DECKE, kunst: k + flaeche(0, -9.4, 320, 9.4, 0), tipp: "Stuck an der Decke ist typisch für Altbauten um 1900." });
}
{
  /* Glühbirne an der Fassung, Kabel aus der Rosette */
  const top = 6 - 0, yb = 44;
  let k = `<path d="M0 ${top - yb} L0 -5" stroke="#2b2b2b" stroke-width=".5"/>`;
  k += `<rect x="-1.4" y="-5.4" width="2.8" height="3.4" rx=".5" fill="#3a3a3a"/><rect x="-1.2" y="-2.2" width="2.4" height="1.4" fill="#bfa76a"/>`;
  k += `<path d="M-1.2 -.8 Q-3.4 1.4 -3.4 3.6 Q-3.4 6.6 0 6.6 Q3.4 6.6 3.4 3.6 Q3.4 1.4 1.2 -.8 Z" fill="${S.rg("birne", [[0, "#ffffff"], [0.5, "#fff3c2"], [1, "#f1d98a"]], 0.45, 0.6, 0.6)}"/>`;
  k += `<circle cx="0" cy="3" r="9" fill="#fff6d0" opacity=".25"/>`;
  S.teil({ oben: true, id: "gluehbirne", de: "die Glühbirne", syl: "GLÜH-bir-ne", it: "la lampadina", itSyl: "lam-pa-DI-na", en: "light bulb",
    x: 170, y: yb, kunst: k + flaeche(-4.4, -8, 8.8, 15.4), tipp: "In der leeren Wohnung hängt nur eine Glühbirne an der Decke." });
}

/* =====================================================================
   4 — DIE FLÜGELTÜR zum Flur (offen), dahinter 5 — DER STROMZÄHLER,
   in der Tür 6 — DER SCHLÜSSEL, daneben 7 — DER LICHTSCHALTER
   ===================================================================== */
const TUER = { x0: 8, x1: 60, y0: Y(2.5) };
{
  /* Blick in den Flur (Kulisse): Flurwand weiter hinten, Dielen, Garderobe */
  const fy = 140;   /* Fußlinie der Flurwand */
  let k = `<rect x="${TUER.x0}" y="${r(TUER.y0)}" width="${TUER.x1 - TUER.x0}" height="${r(WAND_UNTEN - TUER.y0)}" fill="${S.lg("flur", [[0, "#ece4d4"], [1, "#ddd3bf"]])}"/>`;
  k += `<rect x="${TUER.x0}" y="${fy}" width="${TUER.x1 - TUER.x0}" height="${WAND_UNTEN - fy}" fill="#a87a45"/>`;
  for (let x = TUER.x0 + 3; x < TUER.x1; x += 6) k += `<line x1="${x}" y1="${fy}" x2="${r(x + (x - VP.x) * 0.12)}" y2="${WAND_UNTEN}" stroke="#6f4a24" stroke-width=".35"/>`;
  k += `<rect x="${TUER.x0}" y="${fy - 4}" width="${TUER.x1 - TUER.x0}" height="4" fill="#f4f1ea"/>`;
  /* Wohnungstür im Flur (rechts, dunkles Holz) */
  k += `<rect x="40" y="${r(fy - 2.2 * 33)}" width="18" height="${r(2.2 * 33 - 4)}" fill="${S.lg("wtuer", [[0, "#7a5230"], [1, "#5e3c20"]])}"/><circle cx="43" cy="${r(fy - 34)}" r=".9" fill="#d8b46a"/>`;
  for (const yy of [fy - 66, fy - 38]) k += `<rect x="42.4" y="${yy}" width="13.2" height="22" fill="none" stroke="#4a2e18" stroke-width=".5"/>`;
  S.hinten(k);
}
{
  /* Zählerkasten im Flur (aufgeklappt) mit Drehstromzähler */
  let k = `<rect x="-9" y="-13" width="18" height="26" rx=".6" fill="#f1f0ec" stroke="#b9b6ad" stroke-width=".4"/>`;
  k += `<rect x="-7" y="-11" width="14" height="13" rx=".4" fill="#2b3a40"/>`;
  k += `<rect x="-6" y="-10" width="12" height="11" rx=".4" fill="${S.lg("zaehler", [[0, "#3d4a4f"], [1, "#2a3337"]])}"/>`;
  k += `<rect x="-4.6" y="-8" width="9.2" height="3" fill="#cfe9c8"/><text x="0" y="-5.8" font-size="2.2" text-anchor="middle" fill="#1b2a1b" font-family="monospace">04817,3</text>`;
  k += `<text x="0" y="-2" font-size="1.4" text-anchor="middle" fill="#cfd6db" font-family="Arial">kWh</text><circle cx="3.6" cy="-1.6" r=".5" fill="#e04a3f"/>`;
  /* Sicherungen darunter */
  for (let i = 0; i < 6; i++) k += `<rect x="${-6.6 + i * 2.2}" y="4" width="1.8" height="5" rx=".3" fill="#fafaf8" stroke="#a9a69d" stroke-width=".25"/><rect x="${-6.2 + i * 2.2}" y="5.6" width="1" height="1.4" fill="#2f6fb5"/>`;
  S.teil({ oben: true, id: "wb_stromzaehler", de: "der Stromzähler", syl: "STROM-zäh-ler", it: "il contatore", itSyl: "con-ta-TO-re", en: "electricity meter",
    x: 25, y: 106, kunst: k, tipp: "Beim Einzug notiert man den Zählerstand des Stromzählers." });
}
{
  /* Flügeltür: Zarge mit Profil, Oberlicht, beide Flügel nach innen
     aufgeschlagen (man sieht ihre Kanten), Kassetten */
  const W = TUER.x1 - TUER.x0, H = WAND_UNTEN - TUER.y0;
  let k = "";
  /* Zarge/Bekleidung */
  k += `<path d="M-4 0 L-4 ${-H - 14} L${W + 4} ${-H - 14} L${W + 4} 0 L${W} 0 L${W} ${-H} L0 ${-H} L0 0 Z" fill="${LACK}" stroke="#d6d1c6" stroke-width=".4"/>`;
  k += `<path d="M-2 0 L-2 ${-H - 12} L${W + 2} ${-H - 12} L${W + 2} 0" stroke="#d9d4c9" stroke-width=".5" fill="none"/>`;
  /* Verdachung über der Tür (Altbau) */
  k += `<path d="M-7 ${-H - 14} L${W + 7} ${-H - 14} L${W + 5} ${-H - 18} L-5 ${-H - 18} Z" fill="${WEISS}" stroke="#d6d1c6" stroke-width=".3"/>`;
  /* Oberlicht mit Sprossen */
  k += `<rect x="1" y="${-H + 1}" width="${W - 2}" height="12" fill="${S.lg("ober", [[0, "#dfeef5"], [1, "#c2d7e1"]])}"/>`;
  for (let i = 1; i < 4; i++) k += `<rect x="${r(1 + i * (W - 2) / 4 - 0.6)}" y="${-H + 1}" width="1.2" height="12" fill="#f4f2ec"/>`;
  k += `<rect x="0" y="${-H + 13}" width="${W}" height="2" fill="#f4f2ec"/>`;
  /* aufgeschlagene Flügel: schmale Kanten links und rechts in der Laibung */
  for (const [x0, dir] of [[1, 1], [W - 1, -1]]) {
    k += `<path d="M${x0} ${-H + 15} L${x0 + dir * 5} ${-H + 18} L${x0 + dir * 5} -2 L${x0} 0 Z" fill="${S.lg("fluegel" + (dir > 0 ? "l" : "r"), [[0, "#f7f5ef"], [1, "#d8d3c8"]], 0, 0, 1, 0)}"/>`;
    for (const yy of [-H + 24, -H / 2 + 4]) k += `<path d="M${x0 + dir * 1.2} ${yy} L${x0 + dir * 4} ${yy + 1.4} L${x0 + dir * 4} ${yy + H * 0.32} L${x0 + dir * 1.2} ${yy + H * 0.32 - 1}" stroke="#cfc9bb" stroke-width=".4" fill="none"/>`;
  }
  /* Türschwelle aus Eiche */
  k += `<rect x="-1" y="-1.6" width="${W + 2}" height="1.8" fill="#8f6232"/>`;
  S.teil({ id: "fluegeltuer", de: "die Flügeltür", syl: "FLÜ-gel-tür", it: "la porta a due battenti", itSyl: "POR-ta a DU-e bat-TEN-ti", en: "double door",
    x: TUER.x0, y: WAND_UNTEN, kunst: k, tipp: "Die Flügeltür hat zwei Flügel und oben ein Oberlicht aus Glas." });
}
{
  /* Buntbartschlüssel steckt im Schloss des rechten Flügels */
  let k = `<rect x="-1.6" y="-3.4" width="3.2" height="7.6" rx=".6" fill="${S.lg("schild", [[0, "#e6cf8a"], [1, "#b8973f"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M0 1 L0 4.6" stroke="#8a6a2a" stroke-width=".7"/>`;
  k += `<circle cx="0" cy="7.2" r="2.2" fill="none" stroke="#b8973f" stroke-width=".9"/><path d="M0 4.4 L0 5" stroke="#b8973f" stroke-width=".9"/>`;
  k += `<path d="M-2 -1.6 L-5 -.6 Q-6 0 -5 .6 L-2 1.6" fill="#d9c27a" stroke="#8a6a2a" stroke-width=".3"/>`;
  S.teil({ oben: true, id: "schluessel", de: "der Schlüssel", syl: "SCHLÜS-sel", it: "la chiave", itSyl: "CHIA-ve", en: "key",
    x: TUER.x1 - 4, y: Y(1.05), kunst: k + flaeche(-6, -4, 10, 14), tipp: "Die alten Zimmertüren haben noch einen Buntbartschlüssel." });
}
{
  let k = `<rect x="-3.4" y="-3.4" width="6.8" height="6.8" rx="1" fill="#fbfaf7" stroke="#cfcac0" stroke-width=".35"/><rect x="-2" y="-2" width="4" height="4" rx=".5" fill="#f4f2ec" stroke="#d6d1c6" stroke-width=".3"/>`;
  S.teil({ oben: true, id: "lichtschalter", de: "der Lichtschalter", syl: "LICHT-schal-ter", it: "l'interruttore", itSyl: "in-ter-rut-TO-re", en: "light switch",
    x: 68, y: Y(1.05), kunst: k + flaeche(-4, -4, 8, 8) });
}

/* =====================================================================
   8 — DAS FENSTER mit 9 — ROLLLADEN, 10 — FENSTERBRETT,
   11 — HEIZKÖRPER
   ===================================================================== */
const FEN = { x0: 104, x1: 150, y0: Y(2.75), y1: Y(0.85) };
{
  const W = FEN.x1 - FEN.x0, H = FEN.y1 - FEN.y0;
  let k = `<rect x="-3" y="${-H - 3}" width="${W + 6}" height="${H + 3}" fill="${LACK}" stroke="#d6d1c6" stroke-width=".4"/>`;
  /* Aussicht: Gründerzeit-Fassade gegenüber, Himmel, Kastanie */
  k += `<rect x="0" y="${-H}" width="${W}" height="${H}" fill="${S.lg("himmel", [[0, "#a9d2ee"], [1, "#e1f0f7"]])}"/>`;
  k += `<rect x="2" y="${-H * 0.62}" width="${W - 4}" height="${H * 0.62}" fill="${S.lg("fassade", [[0, "#e3cfae"], [1, "#cdb48d"]])}"/>`;
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) k += `<rect x="${r(6 + i * 13)}" y="${r(-H * 0.56 + j * 15)}" width="6" height="10" fill="#7f98a8"/><rect x="${r(5 + i * 13)}" y="${r(-H * 0.56 + j * 15 - 1.6)}" width="8" height="1.4" fill="#f2e6d2"/>`;
  for (let i = 0; i < 9; i++) k += `<circle cx="${r(W * 0.7 + rnd() * 12)}" cy="${r(-H * 0.3 + rnd() * 18)}" r="${r(4 + rnd() * 3)}" fill="${rnd() < 0.5 ? "#6f9a55" : "#58833f"}"/>`;
  /* Rahmen: zwei Flügel mit je einer Quersprosse, Oliven */
  k += `<rect x="${W / 2 - 1.4}" y="${-H}" width="2.8" height="${H}" fill="#f7f5ef"/>`;
  k += `<rect x="0" y="${r(-H * 0.68)}" width="${W}" height="1.8" fill="#f7f5ef"/>`;
  k += `<rect x="0" y="${-H}" width="${W}" height="${H}" fill="none" stroke="#f7f5ef" stroke-width="2.4"/>`;
  k += `<rect x="${W / 2 + 1.6}" y="${r(-H * 0.42)}" width="1.2" height="4.6" rx=".5" fill="#c9b27a"/>`;
  k += `<path d="M3 -4 L14 ${r(-H + 6)} L19 ${r(-H + 6)} L8 -4 Z" fill="#fff" opacity=".2"/>`;
  S.teil({ id: "fenster", de: "das Fenster", syl: "FENS-ter", it: "la finestra", itSyl: "fi-NE-stra", en: "window",
    x: FEN.x0, y: FEN.y1, kunst: k, tipp: "Die Fenster im Altbau sind hoch – die Räume sind deshalb sehr hell." });
}
{
  /* Rollladen außen, halb heruntergelassen (Lamellen hinter dem Glas),
     innen der Gurtwickler mit Gurt */
  const W = FEN.x1 - FEN.x0, H = 16;
  let k = `<rect x="1.4" y="0" width="${W - 2.8}" height="${H}" fill="${S.lg("rollo", [[0, "#cfd3d2"], [1, "#b6bab9"]])}"/>`;
  for (let y = 1.6; y < H; y += 2.2) k += `<rect x="1.4" y="${r(y)}" width="${W - 2.8}" height=".5" fill="#8f9493"/>`;
  k += `<rect x="1.4" y="${H - 1}" width="${W - 2.8}" height="1.4" fill="#7b807f"/>`;
  /* Rahmenteile davor (Sprosse/Mittelpfosten) */
  k += `<rect x="${W / 2 - 1.4}" y="0" width="2.8" height="${H}" fill="#f7f5ef"/>`;
  /* Gurt und Gurtwickler rechts neben dem Fenster */
  k += `<rect x="${W + 4.4}" y="-1" width="1.4" height="40" fill="#b9a98a"/>`;
  k += `<rect x="${W + 2.6}" y="38" width="5" height="12" rx="1" fill="${WEISS}" stroke="#cfcac0" stroke-width=".35"/><rect x="${W + 4.2}" y="40" width="1.8" height="4" rx=".4" fill="#9aa1a6"/>`;
  S.teil({ oben: true, id: "wb_rollladen", de: "der Rollladen", syl: "ROLL-la-den", it: "la tapparella", itSyl: "tap-pa-REL-la", en: "roller shutter",
    x: FEN.x0, y: r(FEN.y0 + 1.2), kunst: k + flaeche(W + 1.8, -1, 6, 52), tipp: "Mit dem Gurt zieht man den Rollladen hoch oder lässt ihn herunter." });
}
{
  /* tiefes Fensterbrett aus Holz (von oben sichtbar) */
  const W = FEN.x1 - FEN.x0;
  let k = `<path d="M-3 0 L${W + 3} 0 L${W + 6} 4 L-6 4 Z" fill="${S.lg("brett", [[0, "#efe9dc"], [1, "#fbf8f1"]])}"/>`;
  k += `<rect x="-6" y="4" width="${W + 12}" height="2" fill="#dcd5c6"/>`;
  /* eine Topfpflanze vom Vormieter */
  k += `<path d="M${W - 10} 2.4 L${W - 4} 2.4 L${W - 4.6} -3.6 L${W - 9.4} -3.6 Z" fill="#c4683d"/>`;
  for (let i = 0; i < 8; i++) k += `<ellipse cx="${r(W - 7 + (rnd() - 0.5) * 7)}" cy="${r(-5 - rnd() * 5)}" rx="1.6" ry=".8" fill="${rnd() < 0.5 ? "#4f8a3c" : "#6aa84f"}" transform="rotate(${Math.round(rnd() * 80 - 40)} ${W - 7} -6)"/>`;
  S.teil({ oben: true, id: "wb_fensterbrett", de: "das Fensterbrett", syl: "FENS-ter-brett", it: "il davanzale", itSyl: "da-van-ZA-le", en: "window sill",
    x: FEN.x0, y: FEN.y1, kunst: k + flaeche(-6, -1, W + 12, 7) });
}
{
  /* gusseiserner Gliederheizkörper mit Thermostatventil */
  const W = 38, H = 0.6 * SW;
  let k = schatten(0, 0, W / 2 + 2, 1, 0.2);
  for (let i = 0; i < 14; i++) {
    const x = -W / 2 + i * (W / 14);
    k += `<rect x="${r(x + 0.2)}" y="${-H}" width="${r(W / 14 - 0.5)}" height="${H}" rx="1" fill="${S.lg("glied", [[0, "#ffffff"], [0.5, "#e9e7e1"], [1, "#c9c5bb"]], 0, 0, 1, 0)}"/>`;
  }
  k += `<rect x="${-W / 2}" y="${-H + 2}" width="${W}" height="1.2" fill="#d9d5cb"/><rect x="${-W / 2}" y="-3.2" width="${W}" height="1.2" fill="#d9d5cb"/>`;
  k += `<rect x="${W / 2}" y="${-H + 3}" width="3" height="2" fill="#d6d3cb"/><rect x="${W / 2 + 1.6}" y="${-H - 1}" width="3.6" height="5" rx="1.2" fill="${WEISS}" stroke="#cfcac0" stroke-width=".3"/>`;
  k += `<text x="${W / 2 + 3.4}" y="${-H + 2.2}" font-size="1.8" text-anchor="middle" fill="#666" font-family="Arial">3</text>`;
  k += `<rect x="${-W / 2 - 1}" y="-1" width="1.4" height="3" fill="#bcb8ad"/><rect x="${W / 2 - 0.4}" y="-1" width="1.4" height="3" fill="#bcb8ad"/>`;
  S.teil({ id: "wb_heizkoerper", de: "der Heizkörper", syl: "HEIZ-kör-per", it: "il termosifone", itSyl: "ter-mo-si-FO-ne", en: "radiator",
    x: (FEN.x0 + FEN.x1) / 2, y: WAND_UNTEN - 3, kunst: k, tipp: "Unter dem Fenster steht der Heizkörper. Die Zahl am Ventil stellt die Wärme ein." });
}

/* =====================================================================
   12 — DIE BALKONTÜR (hoch, zweiflügelig, Blick auf den Balkon)
   ===================================================================== */
{
  const x0 = 184, x1 = 230, W = x1 - x0, H = 2.75 * SW;
  let k = `<rect x="-3" y="${-H - 3}" width="${W + 6}" height="${H + 3}" fill="${LACK}" stroke="#d6d1c6" stroke-width=".4"/>`;
  k += `<rect x="0" y="${-H}" width="${W}" height="${H}" fill="${S.lg("himmel2", [[0, "#a9d2ee"], [1, "#e7f3f8"]])}"/>`;
  k += `<rect x="2" y="${r(-H * 0.6)}" width="${W - 4}" height="${r(H * 0.6)}" fill="${S.lg("fassade2", [[0, "#d9c3a0"], [1, "#c6ab82"]])}"/>`;
  for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) k += `<rect x="${r(6 + i * 13)}" y="${r(-H * 0.55 + j * 16)}" width="6" height="10" fill="#7f98a8"/>`;
  /* Balkon: Steinboden und schmiedeeisernes Geländer */
  k += `<rect x="0" y="-12" width="${W}" height="12" fill="#b5ada0"/>`;
  k += `<rect x="0" y="-30" width="${W}" height="1.4" fill="#2b2b2b"/>`;
  for (let x = 2; x < W; x += 3) k += `<rect x="${x}" y="-29" width=".6" height="17" fill="#2b2b2b"/>`;
  for (let x = 6; x < W; x += 12) k += `<circle cx="${x}" cy="-21" r="2.6" fill="none" stroke="#2b2b2b" stroke-width=".5"/>`;
  k += `<path d="M6 -12 q-2 -6 2 -9 q3 3 0 9 Z" fill="#5b8746"/><rect x="4" y="-14" width="6" height="4" fill="#c4683d"/>`;
  /* Rahmen, Sprossen, Sockelfüllung unten */
  k += `<rect x="${W / 2 - 1.4}" y="${-H}" width="2.8" height="${H}" fill="#f7f5ef"/>`;
  for (const yy of [-H * 0.75, -H * 0.42]) k += `<rect x="0" y="${r(yy)}" width="${W}" height="1.6" fill="#f7f5ef"/>`;
  k += `<rect x="0" y="-10" width="${W}" height="10" fill="${LACK}"/><rect x="3" y="-8" width="${W / 2 - 6}" height="6" fill="none" stroke="#d6d1c6" stroke-width=".4"/><rect x="${W / 2 + 3}" y="-8" width="${W / 2 - 6}" height="6" fill="none" stroke="#d6d1c6" stroke-width=".4"/>`;
  k += `<rect x="0" y="${-H}" width="${W}" height="${H}" fill="none" stroke="#f7f5ef" stroke-width="2.4"/>`;
  k += `<rect x="${W / 2 + 1.8}" y="${r(-H * 0.48)}" width="1.2" height="5" rx=".5" fill="#c9b27a"/>`;
  k += `<path d="M3 -12 L16 ${r(-H + 6)} L22 ${r(-H + 6)} L9 -12 Z" fill="#fff" opacity=".2"/>`;
  S.teil({ id: "balkontuer", de: "die Balkontür", syl: "bal-KON-tür", it: "la portafinestra", itSyl: "por-ta-fi-NE-stra", en: "balcony door",
    x: x0, y: WAND_UNTEN - 1, kunst: k, tipp: "Hinter der Balkontür liegt ein kleiner Balkon mit Eisengeländer." });
}
{
  /* DIE STECKDOSE rechts an der Wand (über der Fußleiste) */
  let k = `<rect x="-4" y="-4" width="8" height="8" rx="1.2" fill="#fbfaf7" stroke="#cfcac0" stroke-width=".35"/><circle cx="0" cy="0" r="2.6" fill="#ece9e2"/><circle cx="-.9" cy="0" r=".5" fill="#555"/><circle cx=".9" cy="0" r=".5" fill="#555"/>`;
  S.teil({ oben: true, id: "wb_steckdose", de: "die Steckdose", syl: "STECK-do-se", it: "la presa", itSyl: "PRE-sa", en: "socket",
    x: 304, y: Y(0.3), kunst: k + flaeche(-4.6, -4.6, 9.2, 9.2), tipp: "Zählen Sie bei der Besichtigung die Steckdosen – im Altbau gibt es oft wenige." });
}

/* =====================================================================
   13 — DER MAKLER mit Mappe (Lupe: Mietvertrag, Nebenkosten, Kaution,
        Kündigungsfrist, Kugelschreiber)
   ===================================================================== */
{
  const YM = 184, H = 1.82 * M(YM), X = 86;
  const m = B.mensch({ id: "b15e_makler", geschlecht: "m", pose: "halten", blick: 18, frisur: "kurz", haarfarbe: "grau", haut: "hell", laecheln: true, brille: true,
    kleidung: { oberteil: { stueck: "hemd", farbe: "weiss" }, jacke: { stueck: "jacke", farbe: "#2c3a55" }, unterteil: { stueck: "anzughose", farbe: "#2c3a55" }, schuhe: { stueck: "halbschuh", farbe: "braun" } } }, H);
  const hl = { x: m.z.handL.x * m.k, y: m.z.handL.y * m.k }, hr = { x: m.z.handR.x * m.k, y: m.z.handR.y * m.k };
  const mx = (hl.x + hr.x) / 2, my = (hl.y + hr.y) / 2 - 3;
  /* aufgeschlagene Mappe, leicht zum Betrachter gekippt */
  const w = 15, h = 12;
  let g = `<path d="M${r(mx - w - 0.8)} ${r(my - h - 0.6)} L${r(mx + w + 0.8)} ${r(my - h - 0.6)} L${r(mx + w + 1.6)} ${r(my + 1.2)} L${r(mx - w - 1.6)} ${r(my + 1.2)} Z" fill="#1f2b3e"/>`;
  g += `<path d="M${r(mx - w)} ${r(my - h)} L${r(mx - 0.4)} ${r(my - h + 0.6)} L${r(mx - 0.4)} ${r(my + 0.4)} L${r(mx - w - 0.8)} ${r(my)} Z" fill="#fbfaf6"/>`;
  g += `<path d="M${r(mx + 0.4)} ${r(my - h + 0.6)} L${r(mx + w)} ${r(my - h)} L${r(mx + w + 0.8)} ${r(my)} L${r(mx + 0.4)} ${r(my + 0.4)} Z" fill="#f6f4ee"/>`;
  /* linke Seite: MIETVERTRAG */
  const L = mx - w + 1.4, R0 = mx + 1.6;
  g += `<text x="${r(L)}" y="${r(my - h + 2.6)}" font-size="1.6" fill="#1b1e21" font-family="Georgia,serif" font-weight="bold">Mietvertrag</text>`;
  for (let i = 0; i < 6; i++) g += `<rect x="${r(L)}" y="${r(my - h + 4 + i * 1.2)}" width="${r(11 - (i % 3))}" height=".35" fill="#9a978f"/>`;
  g += `<path d="M${r(L)} ${r(my - 1.4)} q1.4 -1.4 2.6 0 t2.6 -.4 t2.4 .2" stroke="#2f5fb5" stroke-width=".3" fill="none"/><rect x="${r(L)}" y="${r(my - 1)}" width="8" height=".2" fill="#666"/>`;
  /* rechte Seite: Eckdaten */
  const zeilen = [["Kaltmiete", "980 €"], ["Nebenkosten", "240 €"], ["Kaution", "2.940 €"], ["Kündigungsfrist", "3 Mon."]];
  g += `<text x="${r(R0)}" y="${r(my - h + 2.6)}" font-size="1.4" fill="#1f8a8a" font-family="Arial" font-weight="bold">3 Zimmer · 78 m²</text>`;
  zeilen.forEach(([a, b], i) => { g += `<text x="${r(R0)}" y="${r(my - h + 4.8 + i * 1.9)}" font-size="1.15" fill="#1b1e21" font-family="Arial">${a}</text><text x="${r(mx + w - 1)}" y="${r(my - h + 4.8 + i * 1.9)}" font-size="1.15" text-anchor="end" fill="#1b1e21" font-family="Arial" font-weight="bold">${b}</text>`; });
  /* Kugelschreiber in der Mitte */
  g += `<path d="M${r(mx - 0.2)} ${r(my - h - 1.6)} L${r(mx + 0.4)} ${r(my - 0.6)}" stroke="#2f5fb5" stroke-width=".8" stroke-linecap="round"/><rect x="${r(mx - 0.5)}" y="${r(my - h - 1.8)}" width="1" height="1.4" fill="#d6d6d6"/>`;
  const U = (id, de, syl, it, itSyl, en, x, y, f, tipp) => Object.assign({ id, de, syl, it, itSyl, en, x: X + x, y: YM + y, kunst: f }, tipp ? { tipp } : {});
  const unter = [
    U("wb_mietvertrag", "der Mietvertrag", "MIET-ver-trag", "il contratto d'affitto", "con-TRAT-to d'af-FIT-to", "rental contract", mx - w / 2 - 0.6, my, flaeche(-7, -h + 0.4, 13.4, h - 0.2), "Den Mietvertrag unterschreiben Mieter und Vermieter."),
    U("wb_nebenkosten", "die Nebenkosten", "NE-ben-kos-ten", "le spese accessorie", "SPE-se ac-ces-SO-rie", "service charges", mx + w / 2 + 0.8, my - h + 5.4 + 1.9, flaeche(-7, -1.6, 14, 1.9), "Nebenkosten: Wasser, Heizung, Müll, Hausmeister."),
    U("wb_kaution_wb", "die Kaution", "Kau-TI-ON", "la cauzione", "cau-ZIO-ne", "deposit", mx + w / 2 + 0.8, my - h + 5.4 + 3.8, flaeche(-7, -1.6, 14, 1.9), "Die Kaution ist höchstens drei Kaltmieten hoch."),
    U("wb_kuendigungsfrist", "die Kündigungsfrist", "KÜN-di-gungs-frist", "il termine di disdetta", "TER-mi-ne di dis-DET-ta", "notice period", mx + w / 2 + 0.8, my - h + 5.4 + 5.7, flaeche(-7, -1.6, 14, 1.9), "Mieter können mit drei Monaten Frist kündigen."),
    U("kugelschreiber", "der Kugelschreiber", "KU-gel-schrei-ber", "la penna", "PEN-na", "pen", mx + 0.1, my - 0.4, flaeche(-1.1, -h - 1.4, 2.2, h + 1.2)),
  ];
  S.teil({ id: "wb_makler", de: "der Makler", syl: "MAK-ler", it: "l'agente immobiliare", itSyl: "a-GEN-te im-mo-bi-LIA-re", en: "estate agent",
    x: X, y: YM, kunst: m.svg + g,
    zoom: { x: r(X + mx - 21), y: r(YM + my - h - 7), w: 42, h: 28 },
    unter, tipp: "Der Makler zeigt die Wohnung und hat den Mietvertrag in seiner Mappe." });
}

/* =====================================================================
   14 — DER INTERESSENT (steht hinter ihr), 15 — DIE INTERESSENTIN mit 16 — GRUNDRISS
   ===================================================================== */
{
  const YI = 182, H = 1.85 * M(YI), X = 286;
  const m = B.mensch({ id: "b15e_intm", geschlecht: "m", pose: "zeigen", blick: -30, frisur: "kurz", haarfarbe: "blond", haut: "hell", bart: true,
    kleidung: { oberteil: { stueck: "pullover", farbe: "blau" }, unterteil: { stueck: "hose", farbe: "beige" }, schuhe: { stueck: "turnschuh" } } }, H);
  S.teil({ id: "interessent", de: "der Interessent", syl: "In-te-res-SENT", it: "l'interessato", itSyl: "in-te-res-SA-to", en: "prospective tenant",
    x: X, y: YI, kunst: m.svg, tipp: "Er zeigt auf die Balkontür: „Schau mal, ein Balkon!“" });
}

{
  const YI = 186, H = 1.68 * M(YI), X = 254;
  const m = B.mensch({ id: "b15e_int", geschlecht: "w", pose: "halten", blick: -22, frisur: "lang", haarfarbe: "dunkelbraun", haut: "oliv",
    kleidung: { oberteil: { stueck: "rollkragen", farbe: "creme" }, jacke: { stueck: "mantel", farbe: "#8a5a3c" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "stiefel" }, zubehoer: { stueck: "tasche", farbe: "schwarz" } } }, H);
  S.teil({ id: "wb_interessentin", de: "die Interessentin", syl: "In-te-res-SEN-tin", it: "l'interessata", itSyl: "in-te-res-SA-ta", en: "prospective tenant",
    x: X, y: YI, kunst: m.svg, tipp: "Sie fragt: „Wie hoch sind die Nebenkosten?“" });
  /* Grundriss: Blatt zwischen ihren Händen */
  const hl = { x: X + m.z.handL.x * m.k, y: YI + m.z.handL.y * m.k }, hr = { x: X + m.z.handR.x * m.k, y: YI + m.z.handR.y * m.k };
  const gx = (hl.x + hr.x) / 2, gy = (hl.y + hr.y) / 2;
  let k = `<path d="M-10 -12 L10 -12 L10.6 1 L-10.6 1 Z" fill="#fdfcf8" stroke="#bdb8ab" stroke-width=".3"/>`;
  /* Plan: drei Zimmer, Küche, Bad, Flur */
  k += `<path d="M-8 -10 H8 V-1 H-8 Z M-8 -5.4 H-1 M-1 -10 V-1 M3.4 -10 V-5 M3.4 -5 H8 M-4.4 -5.4 V-1" stroke="#2b2f33" stroke-width=".45" fill="none"/>`;
  k += `<path d="M-6 -1 v.0" stroke="none"/><rect x="-8" y="-10.3" width="4" height=".6" fill="#7fb7d6"/><rect x="0" y="-10.3" width="3" height=".6" fill="#7fb7d6"/>`;
  k += `<text x="-4.6" y="-7.4" font-size="1.1" text-anchor="middle" fill="#555" font-family="Arial">Wohnen</text><text x="5.6" y="-7.4" font-size="1" text-anchor="middle" fill="#555" font-family="Arial">Bad</text><text x="-6" y="-2.6" font-size="1" text-anchor="middle" fill="#555" font-family="Arial">Küche</text><text x="2" y="-2.6" font-size="1" text-anchor="middle" fill="#555" font-family="Arial">Schlafen</text>`;
  S.teil({ oben: true, id: "wb_grundriss", de: "der Grundriss", syl: "GRUND-riss", it: "la pianta", itSyl: "PIAN-ta", en: "floor plan",
    x: r(gx), y: r(gy + 2), kunst: k, tipp: "Auf dem Grundriss sieht man alle Zimmer der Wohnung von oben." });
}
/* =====================================================================
   17 — DIE UMZUGSKARTONS des Vormieters (vorne links)
   ===================================================================== */
{
  const s = M(194) / SW;
  let k = schatten(0, 0, 22, 2, 0.3);
  const karton = (x, y, w, h, offen) => {
    let g = `<rect x="${x - w / 2}" y="${y - h}" width="${w}" height="${h}" fill="${S.lg("karton", [[0, "#d7ad74"], [1, "#b98c55"]], 0, 0, 1, 0)}"/>`;
    g += `<path d="M${x - w / 2} ${y - h} L${x + w / 2} ${y - h} L${x + w / 2 - 2} ${y - h - 3} L${x - w / 2 + 2} ${y - h - 3} Z" fill="#e2bd88"/>`;
    g += `<rect x="${x - w / 2}" y="${y - h + 1}" width="${w}" height="1.6" fill="#c9a26a" opacity=".8"/>`;
    g += `<rect x="${x - 3}" y="${y - h * 0.62}" width="6" height="3" rx=".4" fill="#c98f52"/>`;
    if (offen) g += `<path d="M${x - w / 2 + 2} ${y - h - 3} L${x - w / 2 - 3} ${y - h - 9} L${x - w / 2 + 6} ${y - h - 6} Z" fill="#cda06a"/><path d="M${x + w / 2 - 2} ${y - h - 3} L${x + w / 2 + 2} ${y - h - 10} L${x + w / 2 - 7} ${y - h - 6} Z" fill="#c8995f"/><rect x="${x - 4}" y="${y - h - 7}" width="3" height="5" fill="#3f7fd1"/><rect x="${x}" y="${y - h - 8}" width="2.4" height="6" fill="#d64550"/>`;
    g += `<text x="${x}" y="${y - h * 0.35}" font-size="2.2" text-anchor="middle" fill="#5a3a1f" font-family="'Comic Sans MS',cursive">${offen ? "Bücher" : "Küche"}</text>`;
    return g;
  };
  k += karton(-6, 0, 26, 18, false) + karton(-4, -18, 22, 14, true) + karton(18, 0, 16, 13, false);
  S.teil({ id: "umzugskarton", de: "der Umzugskarton", syl: "UM-zugs-kar-ton", it: "lo scatolone", itSyl: "sca-to-LO-ne", en: "moving box",
    x: 24, y: 196, steht: true, kunst: k, tipp: "Der Vormieter zieht aus – ein paar Umzugskartons stehen noch da." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/wohnungsbesichtigung.js"));
console.log(aus);
