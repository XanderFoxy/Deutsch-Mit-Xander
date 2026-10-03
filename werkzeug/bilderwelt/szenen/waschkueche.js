#!/usr/bin/env node
/* =====================================================================
   DIE WASCHKÜCHE (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   XANDER wollte eine REALISTISCHE Waschmaschine: Frontlader mit
   Bullaugen-Tür (Chromring, Glas, Trommel mit Wäsche), Bedienblende mit
   Waschmittelschublade, Programmwähler und Anzeige.

   RECHERCHE (Bauforen und Ratgeber Waschküche/Waschraum im
   Mehrfamilienhaus, Waschmaschinensockel im Keller):
   - Die Waschküche liegt im KELLER: gestrichene Wände (unten ein grauer
     Sockelanstrich), Betonboden mit BODENABLAUF, Rohre unter der Decke,
     ein kleines KELLERFENSTER zum Lichtschacht, eine Feuchtraumleuchte.
   - WASCHMASCHINE und TROCKNER stehen auf einem gemauerten SOCKEL
     (Schutz vor Wasser, rückenschonend); darüber Wasserhahn mit
     Schlauch, Steckdose und ein REGAL für Waschmittel, Weichspüler,
     Waschpulver, Fleckenspray.
   - Ein AUSGUSSBECKEN für Handwäsche und Putzwasser (darunter Eimer,
     daneben der Wischmopp).
   - Trocknen: WÄSCHELEINE mit Klammern und ein WÄSCHESTÄNDER;
     BÜGELBRETT mit BÜGELEISEN; WÄSCHEKORB.
   - Im Mehrfamilienhaus hat jede Partei ihren Waschtag.
   Maßstab: Rückwand ≈ 55 Einheiten je Meter (Wandfuß y 150),
   vorne (y 200) ≈ 75 je Meter. Frau 1,68 m, Mann 1,80 m,
   Maschinen 0,85 m auf 0,3 m hohem Sockel.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "waschkueche", titel: "Die Waschküche", emoji: "🧺", thema: "Zuhause", kuerzel: "b15b", fassung: 852 });
const rnd = zufall(4471);
const r = B.r;

const WAND_UNTEN = 150;
const VP = { x: 160, y: 62 };
const M = (y) => 55 + (y - WAND_UNTEN) * 0.4;

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const CHROM = S.lg("chrom", [[0, "#f7f9fa"], [0.35, "#c3cbd1"], [0.5, "#8f99a1"], [0.65, "#d6dce0"], [1, "#f2f4f5"]], 0, 0, 1, 0);
const LACK = S.lg("lack", [[0, "#ffffff"], [0.6, "#f1f2f3"], [1, "#d9dcdf"]], 0, 0, 1, 0);
const LACK_V = S.lg("lackv", [[0, "#fbfbfc"], [1, "#e1e4e7"]]);

/* =====================================================================
   KULISSE — Kellerdecke mit Rohren, Wand mit Sockelanstrich, Betonboden
   ===================================================================== */
{
  let k = `<rect x="0" y="0" width="320" height="12" fill="${S.lg("decke", [[0, "#d8d6d0"], [1, "#c9c6bf"]])}"/>`;
  k += `<rect x="0" y="12" width="320" height="${WAND_UNTEN - 12}" fill="${S.lg("wand", [[0, "#f1efe9"], [1, "#e7e4dc"]])}"/>`;
  /* Sockelanstrich (grau, 1,2 m) mit Kante */
  const ys = WAND_UNTEN - 1.2 * 55;
  k += `<rect x="0" y="${ys}" width="320" height="${WAND_UNTEN - ys}" fill="${S.lg("sockelanstrich", [[0, "#b9bdb9"], [1, "#a6aaa6"]])}"/><rect x="0" y="${ys - 0.6}" width="320" height="1.2" fill="#8f938f"/>`;
  /* Putzstruktur und Flecken */
  for (let i = 0; i < 160; i++) k += `<circle cx="${r(rnd() * 320)}" cy="${r(12 + rnd() * (WAND_UNTEN - 12))}" r="${r(0.3 + rnd() * 0.6)}" fill="${rnd() < 0.5 ? "#cfcac0" : "#fbfaf6"}" opacity=".45"/>`;
  k += `<path d="M212 30 l2 6 l-1 5 l3 7" stroke="#c9c4b9" stroke-width=".4" fill="none"/>`;
  /* Rohre unter der Decke (Heizung isoliert, Wasser, Abwasser) */
  k += `<rect x="0" y="12" width="320" height="4.4" fill="${S.lg("rohr1", [[0, "#f0f0ee"], [0.5, "#d4d4d0"], [1, "#a9a9a4"]])}"/>`;
  for (let x = 20; x < 320; x += 60) k += `<rect x="${x}" y="11.6" width="2.4" height="5.2" fill="#8e8e8a"/>`;
  k += `<rect x="0" y="18" width="320" height="2.2" fill="${S.lg("rohr2", [[0, "#e7b37a"], [0.5, "#c98a4a"], [1, "#9a6331"]])}"/>`;
  k += `<rect x="0" y="21.4" width="320" height="3.4" fill="${S.lg("rohr3", [[0, "#9aa0a6"], [0.5, "#7c838a"], [1, "#5e656b"]])}"/>`;
  /* Fallrohr links in der Ecke */
  k += `<rect x="2" y="12" width="5" height="${WAND_UNTEN - 12}" fill="${S.lg("fall", [[0, "#8e959b"], [0.5, "#b6bcc1"], [1, "#6e757b"]], 0, 0, 1, 0)}"/>`;
  /* Wasserhahn und Steckdose für die Maschinen */
  k += `<rect x="24" y="68" width="3" height="5" fill="${CHROM}"/><rect x="21.6" y="66" width="7.8" height="2.4" rx="1" fill="#2f6fb5"/><path d="M25.5 73 C25.5 82 30 80 32 86" stroke="#7c8a96" stroke-width="1.6" fill="none"/>`;
  k += `<rect x="62" y="70" width="8" height="7" rx="1.2" fill="#f4f4f1" stroke="#c9c9c4" stroke-width=".3"/><circle cx="66" cy="73.5" r="2.2" fill="#e3e3df"/><circle cx="65.2" cy="73.5" r=".45" fill="#555"/><circle cx="66.8" cy="73.5" r=".45" fill="#555"/>`;
  k += `<path d="M66 77 C66 82 60 82 58 86" stroke="#ddd" stroke-width=".9" fill="none"/>`;
  /* Betonboden in Fluchtperspektive mit Dehnungsfugen und Flecken */
  k += `<rect x="0" y="${WAND_UNTEN}" width="320" height="${200 - WAND_UNTEN}" fill="${S.lg("boden", [[0, "#a9aaa6"], [1, "#8f908c"]])}"/>`;
  for (const xb of [-80, 60, 200, 340]) { const t = (200 - VP.y) / (WAND_UNTEN - VP.y); k += `<line x1="${xb}" y1="${WAND_UNTEN}" x2="${r(VP.x + (xb - VP.x) * t)}" y2="200" stroke="#7d7e7a" stroke-width=".4"/>`; }
  k += `<line x1="0" y1="${WAND_UNTEN + 16}" x2="320" y2="${WAND_UNTEN + 16}" stroke="#7d7e7a" stroke-width=".4"/>`;
  for (let i = 0; i < 70; i++) k += `<ellipse cx="${r(rnd() * 320)}" cy="${r(WAND_UNTEN + 2 + rnd() * 48)}" rx="${r(0.6 + rnd() * 3)}" ry="${r(0.3 + rnd() * 0.8)}" fill="${rnd() < 0.5 ? "#9b9c98" : "#b4b5b1"}" opacity=".5"/>`;
  k += `<ellipse cx="44" cy="${WAND_UNTEN + 6}" rx="26" ry="3" fill="#7f807c" opacity=".25"/>`;
  k += `<rect x="0" y="${WAND_UNTEN}" width="320" height="${200 - WAND_UNTEN}" fill="${S.lg("bodenlicht", [[0, "#000", 0.14], [0.5, "#000", 0], [1, "#fff", 0.05]])}"/>`;
  k += `<rect x="0" y="${WAND_UNTEN - 0.6}" width="320" height="1.4" fill="#6f706c" opacity=".7"/>`;
  S.hinten(k);
}

/* =====================================================================
   1 — DIE LAMPE (Feuchtraum-Wannenleuchte an der Decke)
   ===================================================================== */
{
  let k = `<rect x="-26" y="0" width="52" height="5" rx="2.4" fill="${S.lg("leuchte", [[0, "#f5f5f2"], [1, "#d3d3ce"]])}"/>`;
  k += `<rect x="-24" y="4" width="48" height="3.4" rx="1.6" fill="${S.lg("wanne", [[0, "#ffffff"], [1, "#f1f6f8"]])}" stroke="#d5dcdf" stroke-width=".3"/>`;
  k += `<rect x="-22" y="5.2" width="44" height="1.2" rx=".6" fill="#fffef4"/>`;
  k += `<path d="M-24 7.4 L-48 40 L48 40 L24 7.4 Z" fill="${S.lg("kegel", [[0, "#fffbe6", 0.28], [1, "#fffbe6", 0]])}" pointer-events="none"/>`;
  S.teil({ oben: true, id: "lampe", de: "die Lampe", syl: "LAM-pe", it: "la lampada", itSyl: "LAM-pa-da", en: "lamp", x: 160, y: 25, kunst: k + flaeche(-26, -1, 52, 9) });
}

/* =====================================================================
   2 — DAS KELLERFENSTER (zum Lichtschacht, mit Gitter)
   ===================================================================== */
{
  let k = `<rect x="-22" y="-14" width="44" height="28" rx="1" fill="#e5e3dd"/>`;
  k += `<rect x="-19" y="-11" width="38" height="22" fill="${S.lg("schacht", [[0, "#dfe9ee"], [0.6, "#b8c2c4"], [1, "#8d918c"]])}"/>`;
  /* Lichtschacht: Betonwand, Laub auf dem Gitterrost */
  k += `<rect x="-19" y="3" width="38" height="8" fill="#9a9a92"/>`;
  for (let i = 0; i < 14; i++) k += `<ellipse cx="${r(-17 + rnd() * 34)}" cy="${r(4 + rnd() * 6)}" rx="1.4" ry=".7" fill="${rnd() < 0.5 ? "#b9853b" : "#8a6a2c"}" transform="rotate(${Math.round(rnd() * 60 - 30)} 0 0)"/>`;
  for (let x = -17; x <= 17; x += 3.4) k += `<line x1="${r(x)}" y1="-11" x2="${r(x)}" y2="11" stroke="#5b5f63" stroke-width=".6"/>`;
  k += `<rect x="-1" y="-11" width="2" height="22" fill="#e5e3dd"/>`;
  k += `<path d="M-19 -11 L-9 -11 L-19 2 Z" fill="#fff" opacity=".25"/>`;
  k += `<rect x="-23" y="14" width="46" height="2" rx=".5" fill="#cdcac2"/>`;
  S.teil({ id: "kellerfenster", de: "das Kellerfenster", syl: "KEL-ler-fens-ter", it: "la finestra della cantina", itSyl: "fi-NE-stra DEL-la can-TI-na", en: "basement window",
    x: 278, y: 44, kunst: k, tipp: "Das Kellerfenster geht zum Lichtschacht. Lüften hilft, damit die Wäsche trocknet." });
}

/* =====================================================================
   3 — DAS REGAL über den Maschinen (Lupe: Waschmittel & Co.)
   ===================================================================== */
const REG = { x0: 8, x1: 80, y: 62 };
{
  const W = REG.x1 - REG.x0, cx = (REG.x0 + REG.x1) / 2;
  let k = "";
  /* Konsolen und Brett */
  for (const x of [-W / 2 + 8, W / 2 - 8]) k += `<path d="M${x - 1} 0 L${x + 1} 0 L${x + 1} 9 L${x - 1} 9 Z M${x - 1} 1 L${x + 5} 1 L${x + 1} 6 Z" fill="#6d7377"/>`;
  k += `<rect x="${-W / 2}" y="0" width="${W}" height="2.4" fill="${S.lg("brett", [[0, "#d9b98b"], [1, "#b58e5c"]])}"/><rect x="${-W / 2}" y="0" width="${W}" height=".6" fill="#ead2ae"/>`;
  /* Flüssigwaschmittel (große Flasche mit Griff) */
  const flasche = (x, w, h, f, deckel, txt, griff) => {
    let g = `<path d="M${x - w / 2} 0 L${x + w / 2} 0 L${x + w / 2} ${-h + 4} Q${x + w / 2} ${-h + 1.6} ${x + w / 4} ${-h + 1} L${x - w / 4} ${-h + 1} Q${x - w / 2} ${-h + 1.6} ${x - w / 2} ${-h + 4} Z" fill="${f}"/>`;
    if (griff) g += `<path d="M${x + w / 2 - 0.5} ${-h + 4} q3 1 2.6 5 q-.3 2.6 -2.6 3" stroke="${f}" stroke-width="1.6" fill="none"/>`;
    g += `<rect x="${x - w / 4}" y="${-h - 1}" width="${w / 2}" height="2.2" rx=".6" fill="${deckel}"/>`;
    g += `<rect x="${x - w / 2 + 0.8}" y="${-h * 0.62}" width="${w - 1.6}" height="${h * 0.34}" rx=".6" fill="#fff" opacity=".9"/>`;
    g += `<text x="${x}" y="${r(-h * 0.42)}" font-size="1.6" text-anchor="middle" fill="#234" font-family="Arial" font-weight="bold">${txt}</text>`;
    g += `<rect x="${x - w / 2 + 0.8}" y="${-h + 4}" width=".8" height="${h - 6}" fill="#fff" opacity=".35"/>`;
    return g;
  };
  k += flasche(-W / 2 + 10, 10, 17, S.lg("wm", [[0, "#2f6fd0"], [1, "#1c4a94"]], 0, 0, 1, 0), "#f2f2f2", "COLOR", true);
  k += flasche(-W / 2 + 26, 8, 15, S.lg("ws", [[0, "#e98fb4"], [1, "#c25f8b"]], 0, 0, 1, 0), "#7a2a52", "SOFT");
  /* Waschpulver: Karton mit Griff */
  {
    const x = 6;
    k += `<path d="M${x - 8} 0 L${x + 8} 0 L${x + 8} -16 L${x - 8} -16 Z" fill="${S.lg("pulver", [[0, "#f4a12a"], [1, "#d6761a"]], 0, 0, 1, 0)}"/>`;
    k += `<path d="M${x - 8} -16 L${x - 6} -18 L${x + 10} -18 L${x + 8} -16 Z" fill="#f8c06a"/><path d="M${x + 8} 0 L${x + 10} -2 L${x + 10} -18 L${x + 8} -16 Z" fill="#b8620f"/>`;
    k += `<path d="M${x - 3} -18 q3 -3.4 6 0" stroke="#e0e0e0" stroke-width="1" fill="none"/>`;
    k += `<circle cx="${x}" cy="-9" r="4.4" fill="#fff"/><text x="${x}" y="-8.2" font-size="2.4" text-anchor="middle" fill="#d6761a" font-family="Arial" font-weight="bold">PULVER</text>`;
    k += `<text x="${x}" y="-2.4" font-size="1.6" text-anchor="middle" fill="#fff" font-family="Arial">40 WL</text>`;
  }
  /* Fleckenspray mit Sprühkopf */
  {
    const x = 24;
    k += `<path d="M${x - 3.4} 0 L${x + 3.4} 0 L${x + 3.4} -10 Q${x} -12 ${x - 3.4} -10 Z" fill="${S.lg("fleck", [[0, "#f7f7f7"], [1, "#d2d6d9"]], 0, 0, 1, 0)}"/>`;
    k += `<path d="M${x - 1.6} -11 L${x + 1.6} -11 L${x + 2} -15 L${x - 2} -15 Z" fill="#e33b3b"/><path d="M${x + 2} -15 L${x + 5} -15 L${x + 5} -13.6 L${x + 2} -13.6 Z" fill="#e33b3b"/><path d="M${x + 0.6} -12 l2.4 4" stroke="#b02a2a" stroke-width=".8"/>`;
    k += `<rect x="${x - 3}" y="-7" width="6" height="3.4" fill="#e33b3b"/><text x="${x}" y="-4.6" font-size="1.5" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">FLECK</text>`;
  }
  S.teil({ id: "regal", de: "das Regal", syl: "re-GAL", it: "lo scaffale", itSyl: "scaf-FA-le", en: "shelf", x: cx, y: REG.y, kunst: k,
    zoom: { x: REG.x0 - 2, y: REG.y - 30, w: W + 4, h: 50 },
    unter: [
      { id: "waschmittel", de: "das Waschmittel", syl: "WASCH-mit-tel", it: "il detersivo", itSyl: "de-ter-SI-vo", en: "detergent", x: cx - W / 2 + 10, y: REG.y, kunst: flaeche(-5.4, -18, 12, 18), tipp: "Flüssiges Waschmittel kommt in das Fach II der Schublade." },
      { id: "weichspueler", de: "der Weichspüler", syl: "WEICH-spü-ler", it: "l'ammorbidente", itSyl: "am-mor-bi-DEN-te", en: "fabric softener", x: cx - W / 2 + 26, y: REG.y, kunst: flaeche(-4.4, -16.2, 8.8, 16.2), tipp: "Der Weichspüler macht die Wäsche weich und duftend." },
      { id: "waschpulver", de: "das Waschpulver", syl: "WASCH-pul-ver", it: "il detersivo in polvere", itSyl: "de-ter-SI-vo in POL-ve-re", en: "washing powder", x: cx + 6, y: REG.y, kunst: flaeche(-8.4, -21.6, 18.8, 21.6) },
      { id: "fleckenspray", de: "das Fleckenspray", syl: "FLE-cken-spray", it: "lo smacchiatore spray", itSyl: "smac-chia-TO-re SPRAY", en: "stain remover spray", x: cx + 24, y: REG.y, kunst: flaeche(-3.8, -15.4, 9.2, 15.4) },
    ] });
}

/* =====================================================================
   4 — DER SOCKEL, 5 — DIE WASCHMASCHINE (Lupe), 6 — DER TROCKNER
   ===================================================================== */
const SOCKEL = { x0: 4, x1: 84, y0: WAND_UNTEN - 0.3 * 55 };
const WM = { x: 25, w: 34, h: 47 };
const TR = { x: 63, w: 34, h: 47 };
{
  let k = schatten(0, 0, 44, 2.6, 0.25);
  const W = SOCKEL.x1 - SOCKEL.x0, H = WAND_UNTEN - SOCKEL.y0;
  k += `<path d="M${-W / 2} ${-H} L${W / 2} ${-H} L${W / 2 + 2.6} ${-H + 2.2} L${W / 2 + 2.6} 2 L${-W / 2 - 2} 2 L${-W / 2 - 2} ${-H + 2.2} Z" fill="${S.lg("sockel", [[0, "#c4c1ba"], [1, "#a29f98"]])}"/>`;
  k += `<rect x="${-W / 2 - 2}" y="${-H + 2.2}" width="${W + 4.6}" height="${H - 0.2}" fill="${S.lg("sockelfront", [[0, "#d3d0c9"], [1, "#b2afa8"]])}"/>`;
  /* Fliesen auf dem Sockel */
  for (let x = -W / 2 - 2; x < W / 2 + 2.6; x += 10.2) k += `<line x1="${r(x)}" y1="${-H + 2.2}" x2="${r(x)}" y2="2" stroke="#9c998f" stroke-width=".35"/>`;
  k += `<line x1="${-W / 2 - 2}" y1="${r(-H / 2 + 1)}" x2="${W / 2 + 2.6}" y2="${r(-H / 2 + 1)}" stroke="#9c998f" stroke-width=".35"/>`;
  k += `<rect x="${-W / 2 - 2}" y="${-H + 2.2}" width="${W + 4.6}" height=".7" fill="#fff" opacity=".5"/>`;
  S.teil({ id: "sockel", de: "der Sockel", syl: "SO-ckel", it: "lo zoccolo", itSyl: "ZOC-co-lo", en: "plinth", x: (SOCKEL.x0 + SOCKEL.x1) / 2, y: WAND_UNTEN + 2, steht: true, kunst: k,
    tipp: "Auf dem Sockel stehen die Maschinen höher – das schont den Rücken." });
}
/* Gemeinsamer Frontlader-Körper (Waschmaschine und Trockner) */
const frontlader = (o) => {
  const { w, h, trockner } = o;
  let k = `<path d="M${-w / 2} ${-h} L${w / 2} ${-h} L${w / 2 + 2} ${-h - 2.4} L${-w / 2 + 2} ${-h - 2.4} Z" fill="#f4f5f6"/>`;
  k += `<rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" rx="1.4" fill="${LACK}"/>`;
  k += `<path d="M${w / 2} ${-h} L${w / 2 + 2} ${-h - 2.4} L${w / 2 + 2} -2 L${w / 2} 0 Z" fill="#cfd3d6"/>`;
  /* Bedienblende */
  k += `<rect x="${-w / 2 + 0.6}" y="${-h + 0.6}" width="${w - 1.2}" height="9.4" rx=".8" fill="${S.lg("blende", [[0, "#f9fafb"], [1, "#e4e7ea"]])}"/>`;
  k += `<line x1="${-w / 2 + 0.6}" y1="${-h + 10.2}" x2="${w / 2 - 0.6}" y2="${-h + 10.2}" stroke="#c7ccd0" stroke-width=".4"/>`;
  return k;
};
const bullauge = (cx, cy, R, innen) => {
  let k = `<circle cx="${cx}" cy="${cy}" r="${R + 2.4}" fill="#d9dde0"/>`;
  k += `<circle cx="${cx}" cy="${cy}" r="${R + 1.8}" fill="${S.rg("ring" + R, [[0, "#ffffff"], [0.75, "#c9d0d5"], [0.9, "#8c969d"], [1, "#e8ecee"]], 0.4, 0.35, 0.65)}"/>`;
  k += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="#39434b"/>`;
  k += innen;
  /* Glas: dunkel getönt, gewölbt, mit Glanz */
  k += `<circle cx="${cx}" cy="${cy}" r="${R - 0.4}" fill="${S.rg("glasbull", [[0, "#9fb6c4", 0.08], [0.7, "#2a3a46", 0.2], [1, "#0f1a22", 0.55]], 0.45, 0.4, 0.6)}"/>`;
  k += `<path d="M${r(cx - R * 0.7)} ${r(cy - R * 0.25)} A${R * 0.75} ${R * 0.75} 0 0 1 ${r(cx + R * 0.1)} ${r(cy - R * 0.72)}" stroke="#fff" stroke-width="1.1" opacity=".55" fill="none"/>`;
  k += `<ellipse cx="${r(cx + R * 0.35)}" cy="${r(cy + R * 0.45)}" rx="${r(R * 0.18)}" ry="${r(R * 0.08)}" fill="#fff" opacity=".25" transform="rotate(-35 ${r(cx + R * 0.35)} ${r(cy + R * 0.45)})"/>`;
  return k;
};
const wmUnter = [];
{
  const { w, h } = WM;
  let k = schatten(0, 0, 18, 1.4, 0.25) + frontlader(WM);
  /* Waschmittelschublade links: drei Fächer (I, II, Blume) */
  k += `<rect x="${-w / 2 + 1.8}" y="${-h + 1.8}" width="10" height="7" rx=".6" fill="#eef0f2" stroke="#b9bfc4" stroke-width=".35"/>`;
  k += `<rect x="${-w / 2 + 2.8}" y="${-h + 6.4}" width="8" height="1.4" rx=".6" fill="#c9cfd4"/>`;
  k += `<text x="${-w / 2 + 4}" y="${-h + 4.6}" font-size="1.7" fill="#6b747b" font-family="Arial">I</text><text x="${-w / 2 + 6.2}" y="${-h + 4.6}" font-size="1.7" fill="#6b747b" font-family="Arial">II</text>`;
  k += `<circle cx="${-w / 2 + 9.8}" cy="${-h + 4}" r=".9" fill="none" stroke="#6b747b" stroke-width=".3"/>`;
  /* Programmwähler (Drehknopf mit Programmring) */
  const px = -1.2, py = -h + 5.4;
  for (let i = 0; i < 14; i++) { const a = (-130 + i * 20) * Math.PI / 180; k += `<circle cx="${r(px + Math.sin(a) * 4.4)}" cy="${r(py - Math.cos(a) * 4.4)}" r=".28" fill="${i === 5 ? "#e4572e" : "#7d868d"}"/>`; }
  k += `<circle cx="${px}" cy="${py}" r="3.3" fill="${S.rg("knopf", [[0, "#ffffff"], [0.6, "#d7dce0"], [1, "#9aa3aa"]], 0.4, 0.35, 0.7)}"/><path d="M${px} ${py} L${r(px + 2.2)} ${r(py - 2)}" stroke="#555" stroke-width=".55" stroke-linecap="round"/>`;
  /* Anzeige: Restzeit, Temperatur, Schleudern */
  k += `<rect x="4.6" y="${-h + 2.2}" width="10" height="5" rx=".5" fill="#10161b"/>`;
  k += `<text x="9.6" y="${-h + 5.6}" font-size="2.7" text-anchor="middle" fill="#7fe0ff" font-family="monospace">1:29</text>`;
  k += `<text x="6.6" y="${-h + 6.9}" font-size="1.1" text-anchor="middle" fill="#ffb24a" font-family="Arial">40°</text><text x="12.6" y="${-h + 6.9}" font-size="1.1" text-anchor="middle" fill="#ffb24a" font-family="Arial">1400</text>`;
  k += `<circle cx="${w / 2 - 1.8}" cy="${-h + 3.2}" r=".9" fill="#c9cfd4"/><circle cx="${w / 2 - 1.8}" cy="${-h + 6.4}" r=".9" fill="#5fbf6a"/>`;
  k += `<text x="${-w / 2 + 2}" y="${-h + 13.6}" font-size="1.5" fill="#9aa3aa" font-family="Arial" letter-spacing=".2">8 kg · A</text>`;
  /* Bullauge mit Trommel und bunter Wäsche */
  const cy = -h + 27, R = 10.2;
  let innen = `<circle cx="0" cy="${cy}" r="${R - 0.8}" fill="${S.rg("trommel", [[0, "#cfd6db"], [0.7, "#9aa4ab"], [1, "#5d676e"]], 0.5, 0.45, 0.6)}"/>`;
  for (let i = 0; i < 40; i++) { const a = rnd() * Math.PI * 2, d = Math.sqrt(rnd()) * (R - 1.6); innen += `<circle cx="${r(Math.cos(a) * d)}" cy="${r(cy + Math.sin(a) * d)}" r=".25" fill="#6f7a82"/>`; }
  /* Wäsche: unten in der Trommel, in Bewegung */
  innen += `<path d="M${-R + 1.6} ${cy + 2} Q-4 ${cy - 2} 1 ${cy + 1.4} Q6 ${cy - 3} ${R - 1.4} ${cy + 1} L${R - 2.6} ${cy + 5.6} Q0 ${cy + 10.4} ${-R + 2.6} ${cy + 5.6} Z" fill="#e05252"/>`;
  innen += `<path d="M-6 ${cy + 3} Q-2 ${cy + 0.6} 3 ${cy + 4} Q5 ${cy + 7.4} -1 ${cy + 8.6} Q-6 ${cy + 7.6} -6 ${cy + 3} Z" fill="#3f7fd1"/>`;
  innen += `<path d="M3 ${cy + 1.6} Q7 ${cy - 0.6} 8 ${cy + 3} Q6 ${cy + 6} 3 ${cy + 4.6} Z" fill="#f2d24a"/>`;
  innen += `<path d="M${-R + 2} ${cy - 1} Q-3 ${cy - 6} 5 ${cy - 3}" stroke="#f3f6f8" stroke-width="1.2" opacity=".55" fill="none"/>`;
  k += bullauge(0, cy, R, innen);
  /* Türgriff rechts am Ring */
  k += `<rect x="${R + 0.4}" y="${cy - 4}" width="2.6" height="8" rx="1.1" fill="${S.lg("griff", [[0, "#cfd5d9"], [1, "#8d979e"]], 0, 0, 1, 0)}"/>`;
  /* Serviceklappe (Flusensieb) unten links und Sockelblende */
  k += `<rect x="${-w / 2 + 2}" y="-6.4" width="7" height="4.4" rx=".8" fill="none" stroke="#c3c8cc" stroke-width=".4"/>`;
  k += `<rect x="${-w / 2 + 0.6}" y="-1.6" width="${w - 1.2}" height="1.2" fill="#d0d4d7"/>`;
  k += `<path d="M${-w / 2 + 1.4} ${-h + 11} L${-w / 2 + 1.4} -3" stroke="#fff" stroke-width=".8" opacity=".6"/>`;
  wmUnter.push(
    { id: "waschmittelschublade", de: "die Waschmittelschublade", syl: "WASCH-mit-tel-schub-la-de", it: "il cassetto del detersivo", itSyl: "cas-SET-to del de-ter-SI-vo", en: "detergent drawer",
      x: WM.x - w / 2 + 6.8, y: SOCKEL.y0 - h + 9, kunst: flaeche(-5.4, -7.6, 10.8, 8), tipp: "Fach I: Vorwäsche, Fach II: Hauptwäsche, Blume: Weichspüler." },
    { id: "programmwaehler", de: "der Programmwähler", syl: "pro-GRAMM-wäh-ler", it: "il selettore dei programmi", itSyl: "se-let-TO-re dei pro-GRAM-mi", en: "program dial",
      x: WM.x + px, y: SOCKEL.y0 - h + 10, kunst: flaeche(-5, -9.4, 10, 9.6), tipp: "Am Programmwähler stellt man ein: Baumwolle, Pflegeleicht, Wolle …" },
    { id: "anzeige", de: "die Anzeige", syl: "AN-zei-ge", it: "il display", itSyl: "di-SPLAY", en: "display",
      x: WM.x + 9.6, y: SOCKEL.y0 - h + 8, kunst: flaeche(-5.4, -6.4, 10.8, 6.8), tipp: "Die Anzeige zeigt Restzeit, Temperatur und Schleudern." },
    { id: "trommel", de: "die Trommel", syl: "TROM-mel", it: "il cestello", itSyl: "ce-STEL-lo", en: "drum",
      x: WM.x, y: SOCKEL.y0 + cy + 1, kunst: flaecheEllipse(0, -1, 8, 8) },
    { id: "tuer", de: "die Tür", syl: "TÜR", it: "l'oblò", itSyl: "o-BLÒ", en: "door",
      x: WM.x + R + 1.7, y: SOCKEL.y0 + cy + 4, kunst: flaeche(-3.4, -12, 5.4, 16), tipp: "Die runde Tür mit dem Glas nennt man auch Bullauge." },
  );
  S.teil({ id: "waschmaschine", de: "die Waschmaschine", syl: "WASCH-ma-schi-ne", it: "la lavatrice", itSyl: "la-va-TRI-ce", en: "washing machine",
    x: WM.x, y: SOCKEL.y0, steht: true, kunst: k,
    zoom: { x: 0, y: SOCKEL.y0 - h - 3, w: 75, h: 50 }, unter: wmUnter,
    tipp: "Die Waschmaschine ist ein Frontlader: Man füllt die Wäsche vorne durch die runde Tür ein." });
}
{
  const { w, h } = TR;
  let k = schatten(0, 0, 18, 1.4, 0.25) + frontlader(TR);
  /* Kondenswasserbehälter links in der Blende */
  k += `<rect x="${-w / 2 + 1.8}" y="${-h + 1.8}" width="10" height="7" rx=".6" fill="#eef0f2" stroke="#b9bfc4" stroke-width=".35"/><path d="M${-w / 2 + 3.6} ${-h + 5} q1 -1.6 2 0 q-1 1.6 -2 0" fill="#58a6d6"/>`;
  k += `<rect x="${-w / 2 + 2.8}" y="${-h + 6.4}" width="8" height="1.4" rx=".6" fill="#c9cfd4"/>`;
  const px = 1, py = -h + 5.4;
  for (let i = 0; i < 10; i++) { const a = (-110 + i * 24) * Math.PI / 180; k += `<circle cx="${r(px + Math.sin(a) * 4.2)}" cy="${r(py - Math.cos(a) * 4.2)}" r=".28" fill="#7d868d"/>`; }
  k += `<circle cx="${px}" cy="${py}" r="3.1" fill="${S.rg("knopf2", [[0, "#ffffff"], [0.6, "#d7dce0"], [1, "#9aa3aa"]], 0.4, 0.35, 0.7)}"/><path d="M${px} ${py} L${px - 2} ${r(py - 2.2)}" stroke="#555" stroke-width=".55" stroke-linecap="round"/>`;
  k += `<rect x="6.6" y="${-h + 2.6}" width="8" height="4" rx=".5" fill="#10161b"/><text x="10.6" y="${-h + 5.6}" font-size="2.4" text-anchor="middle" fill="#7fe0ff" font-family="monospace">0:45</text>`;
  k += `<text x="${-w / 2 + 2}" y="${-h + 13.6}" font-size="1.5" fill="#9aa3aa" font-family="Arial" letter-spacing=".2">Wärmepumpe</text>`;
  /* große Tür, weiß umrandet, Trommel leer und hell */
  const cy = -h + 27, R = 10.8;
  let innen = `<circle cx="0" cy="${cy}" r="${R - 0.8}" fill="${S.rg("trommel2", [[0, "#e7ebee"], [0.7, "#b7c0c6"], [1, "#717b82"]], 0.5, 0.45, 0.6)}"/>`;
  for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; innen += `<path d="M${r(Math.cos(a) * 4)} ${r(cy + Math.sin(a) * 4)} L${r(Math.cos(a) * 9)} ${r(cy + Math.sin(a) * 9)}" stroke="#8d979e" stroke-width=".9"/>`; }
  /* ein Handtuch liegt drin */
  innen += `<path d="M-7 ${cy + 4} Q0 ${cy} 7 ${cy + 4} L6 ${cy + 8} Q0 ${cy + 10} -6 ${cy + 8} Z" fill="#7fb7bd"/>`;
  k += bullauge(0, cy, R, innen);
  k += `<rect x="${-R - 3}" y="${cy - 3}" width="1.8" height="6" rx=".8" fill="#c9cfd4"/>`;
  k += `<rect x="${-w / 2 + 0.6}" y="-1.6" width="${w - 1.2}" height="1.2" fill="#d0d4d7"/>`;
  /* Flusensieb-Hinweis unten */
  k += `<rect x="${-w / 2 + 2}" y="-6" width="${w - 4}" height="3.2" rx=".6" fill="none" stroke="#c3c8cc" stroke-width=".35"/>`;
  S.teil({ id: "trockner", de: "der Wäschetrockner", syl: "WÄ-sche-trock-ner", it: "l'asciugatrice", itSyl: "a-sciu-ga-TRI-ce", en: "tumble dryer",
    x: TR.x, y: SOCKEL.y0, steht: true, kunst: k, tipp: "Nach jedem Trocknen das Flusensieb sauber machen!" });
}

/* =====================================================================
   7 — DAS AUSGUSSBECKEN mit 8 — WASSERHAHN, darunter 9 — PUTZEIMER,
       daneben 10 — WISCHMOPP
   ===================================================================== */
const AUS = { x: 108, y: WAND_UNTEN - 0.82 * 55 };
{
  let k = "";
  /* Wandkonsolen */
  k += `<path d="M-14 -2 L-12 -2 L-12 14 L-14 14 Z M12 -2 L14 -2 L14 14 L12 14 Z" fill="#8a9095"/>`;
  /* tiefes Becken aus Sanitärkeramik, vorne mit Rand, Klappgitter */
  k += `<path d="M-18 -4 L18 -4 L17 12 Q0 15 -17 12 Z" fill="${S.lg("becken", [[0, "#ffffff"], [0.7, "#f0f2f3"], [1, "#d3d8db"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-18 -4 L18 -4 L19 -6.4 L-19 -6.4 Z" fill="#f7f8f9"/><path d="M-16 -4.4 L16 -4.4 L15.4 -2 L-15.4 -2 Z" fill="#c8cfd3"/>`;
  for (let x = -14; x <= 14; x += 2.8) k += `<line x1="${x}" y1="-4.6" x2="${x * 0.97}" y2="-2.2" stroke="#7f8a91" stroke-width=".5"/>`;
  k += `<path d="M-16 -1 Q-17 6 -15.6 11" stroke="#fff" stroke-width="1" opacity=".7" fill="none"/>`;
  /* Siphon unter dem Becken, Abwasserrohr in die Wand */
  k += `<path d="M0 13.4 L0 19 Q0 23 4 23 Q7 23 7 20 L7 18 L16 18" stroke="${S.lg("siphon", [[0, "#e9ecee"], [1, "#9aa3aa"]], 0, 0, 1, 0)}" stroke-width="2.4" fill="none"/>`;
  k += `<rect x="15" y="16.4" width="3" height="3.2" rx=".6" fill="#8a9095"/>`;
  S.teil({ id: "ausgussbecken", de: "das Ausgussbecken", syl: "AUS-guss-be-cken", it: "il lavatoio", itSyl: "la-va-TO-io", en: "utility sink",
    x: AUS.x, y: AUS.y, kunst: k, tipp: "Im Ausgussbecken wäscht man von Hand oder leert das Putzwasser aus." });
}
{
  let k = `<rect x="-2" y="-4" width="4" height="4" rx=".6" fill="${CHROM}"/><path d="M0 -2 L0 6 Q0 9 3 9" stroke="${CHROM}" stroke-width="2" fill="none"/>`;
  k += `<rect x="-4" y="-7.4" width="8" height="2.2" rx="1" fill="#2f6fb5"/><rect x="-.6" y="-5.6" width="1.2" height="2" fill="#9aa3aa"/>`;
  k += `<path d="M3 10 L3 13" stroke="#cfe7f4" stroke-width=".8" opacity=".8"/>`;
  S.teil({ oben: true, id: "wasserhahn", de: "der Wasserhahn", syl: "WAS-ser-hahn", it: "il rubinetto", itSyl: "ru-bi-NET-to", en: "tap",
    x: AUS.x - 3, y: AUS.y - 18, kunst: k + flaeche(-5, -8, 10, 21) });
}
{
  let k = schatten(0, 0, 10, 1.2, 0.3);
  k += `<path d="M-9 -16 L9 -16 L7.4 0 L-7.4 0 Z" fill="${S.lg("eimer", [[0, "#e04a3f"], [0.5, "#c8352c"], [1, "#9b241d"]], 0, 0, 1, 0)}"/>`;
  k += `<ellipse cx="0" cy="-16" rx="9" ry="2" fill="#a92a22"/><ellipse cx="0" cy="-15.6" rx="7.6" ry="1.4" fill="#6fa3c2" opacity=".85"/>`;
  k += `<path d="M-9 -16 Q0 -27 9 -16" stroke="#555" stroke-width=".7" fill="none"/>`;
  k += `<rect x="-8.6" y="-12" width="17.2" height="1" fill="#f06a5e" opacity=".6"/><path d="M-7 -14 L-6 -1" stroke="#fff" stroke-width=".7" opacity=".3"/>`;
  S.teil({ id: "putzeimer", de: "der Putzeimer", syl: "PUTZ-ei-mer", it: "il secchio", itSyl: "SEC-chio", en: "bucket",
    x: AUS.x, y: WAND_UNTEN + 3, steht: true, kunst: k });
}
{
  /* Wischmopp an die Wand gelehnt */
  let k = `<path d="M-5 0 L6 -84" stroke="${S.lg("stiel", [[0, "#9aa3aa"], [1, "#d9dee1"]], 0, 0, 1, 0)}" stroke-width="1.6" stroke-linecap="round"/>`;
  k += `<rect x="4.6" y="-87" width="3" height="3.4" rx="1" fill="#2f6fb5"/>`;
  k += `<path d="M-10 0 L2 0 L1 -3 L-9 -3 Z" fill="#4b5157"/>`;
  for (let i = 0; i < 9; i++) k += `<path d="M${-9.6 + i * 1.4} -.4 q${r(-0.6 + rnd() * 1.2)} 2 ${r(-0.6 + rnd())} 3.6" stroke="#e6e1d6" stroke-width="1" stroke-linecap="round" fill="none"/>`;
  S.teil({ oben: true, id: "wischmopp", de: "der Wischmopp", syl: "WISCH-mopp", it: "lo straccio", itSyl: "STRAC-cio", en: "mop",
    x: 136, y: WAND_UNTEN + 1, kunst: k + `<path class="bw-flaeche" d="M-8 2 L-3 2 L8 -86 L3 -86 Z" fill="rgba(255,255,255,0.001)"/>` });
}

/* =====================================================================
   11 — DIE WÄSCHELEINE mit Wäsche und Klammern (Lupe)
   ===================================================================== */
const LEINE = { x0: 150, x1: 246, y: 31 };
{
  const cx = (LEINE.x0 + LEINE.x1) / 2, W = LEINE.x1 - LEINE.x0;
  const yl = (x) => r(LEINE.y + 3.2 * (1 - Math.pow((x - cx) / (W / 2), 2)));   /* leicht durchhängend */
  let k = "";
  /* Haken an den Enden, Leine */
  for (const x of [LEINE.x0, LEINE.x1]) k += `<rect x="${r(x - cx - 1.6)}" y="-2" width="3.2" height="3.2" rx=".8" fill="#8a9095"/>`;
  k += `<path d="M${-W / 2} 0 Q0 6.4 ${W / 2} 0" stroke="#efece4" stroke-width=".8" fill="none"/>`;
  const klammer = (x) => `<rect x="${r(x - 0.7)}" y="${r(yl(x + cx) - LEINE.y - 1.8)}" width="1.4" height="4.6" rx=".4" fill="${S.lg("klammer", [[0, "#d6b07a"], [1, "#a97d43"]], 0, 0, 1, 0)}"/><rect x="${r(x - 0.8)}" y="${r(yl(x + cx) - LEINE.y + 0.4)}" width="1.6" height=".7" fill="#9aa3aa"/>`;
  const unter = [];
  /* Hemd (hellblau) */
  {
    const x = -32, y0 = yl(x + cx) - LEINE.y;
    k += `<path d="M${x - 9} ${y0 + 1} L${x + 9} ${y0 + 1} L${x + 15} ${y0 + 7} L${x + 12} ${y0 + 10} L${x + 9} ${y0 + 8} L${x + 9} ${y0 + 26} L${x - 9} ${y0 + 26} L${x - 9} ${y0 + 8} L${x - 12} ${y0 + 10} L${x - 15} ${y0 + 7} Z" fill="${S.lg("hemd", [[0, "#b9d4ef"], [1, "#8fb2d8"]], 0, 0, 1, 0)}"/>`;
    k += `<path d="M${x - 3} ${y0 + 1} L${x} ${y0 + 4} L${x + 3} ${y0 + 1}" stroke="#fff" stroke-width=".8" fill="none"/><line x1="${x}" y1="${y0 + 4}" x2="${x}" y2="${y0 + 26}" stroke="#7d9fc4" stroke-width=".4"/>`;
    for (let i = 0; i < 5; i++) k += `<circle cx="${x + 0.9}" cy="${r(y0 + 7 + i * 4)}" r=".4" fill="#fff"/>`;
    k += klammer(x - 8) + klammer(x + 8);
    unter.push({ id: "hemd", de: "das Hemd", syl: "HEMD", it: "la camicia", itSyl: "ca-MI-cia", en: "shirt", x: cx + x, y: LEINE.y + y0 + 26, kunst: flaeche(-12, -24, 24, 24) });
  }
  /* Socken (Paar) */
  {
    const x = -6, y0 = yl(x + cx) - LEINE.y;
    for (const dx of [-3.4, 3.4]) {
      const f = dx < 0 ? "#3b3f45" : "#4a4f56";
      k += `<path d="M${x + dx - 2.2} ${y0 + 1} L${x + dx + 2.2} ${y0 + 1} L${x + dx + 2.2} ${y0 + 11} Q${x + dx + 2.4} ${y0 + 15} ${x + dx - 2} ${y0 + 15} Q${x + dx - 4.6} ${y0 + 14.6} ${x + dx - 3.4} ${y0 + 12} L${x + dx - 2.2} ${y0 + 10} Z" fill="${f}"/>`;
      k += `<rect x="${x + dx - 2.2}" y="${y0 + 1}" width="4.4" height="2" fill="#6b7078"/>`;
      k += klammer(x + dx);
    }
    unter.push({ id: "socke", de: "die Socke", syl: "SO-cke", it: "il calzino", itSyl: "cal-ZI-no", en: "sock", x: cx + x, y: LEINE.y + y0 + 15, kunst: flaeche(-7.6, -13, 15.2, 13) });
  }
  /* Jeans */
  {
    const x = 18, y0 = yl(x + cx) - LEINE.y;
    k += `<path d="M${x - 8} ${y0 + 1} L${x + 8} ${y0 + 1} L${x + 9} ${y0 + 30} L${x + 2} ${y0 + 30} L${x} ${y0 + 9} L${x - 2} ${y0 + 30} L${x - 9} ${y0 + 30} Z" fill="${S.lg("jeans", [[0, "#4f78ad"], [1, "#2f5687"]], 0, 0, 1, 0)}"/>`;
    k += `<rect x="${x - 8}" y="${y0 + 1}" width="16" height="2.6" fill="#40679a"/><path d="M${x - 6} ${y0 + 3.6} q2 4 5 4 M${x + 6} ${y0 + 3.6} q-2 4 -5 4" stroke="#c9953f" stroke-width=".35" fill="none"/>`;
    k += klammer(x - 7) + klammer(x + 7);
    unter.push({ id: "hose", de: "die Hose", syl: "HO-se", it: "i pantaloni", itSyl: "pan-ta-LO-ni", en: "trousers", x: cx + x, y: LEINE.y + y0 + 30, kunst: flaeche(-9.6, -28, 19.2, 28) });
  }
  /* Klammerbeutel am Ende der Leine */
  {
    const x = 40, y0 = yl(x + cx) - LEINE.y;
    k += `<path d="M${x - 1} ${y0} L${x + 1} ${y0} L${x + 1} ${y0 + 2.4} L${x - 1} ${y0 + 2.4} Z" fill="#8a9095"/>`;
    k += `<path d="M${x - 5} ${y0 + 2.6} L${x + 5} ${y0 + 2.6} L${x + 5.6} ${y0 + 12} Q${x} ${y0 + 14} ${x - 5.6} ${y0 + 12} Z" fill="${S.lg("beutel", [[0, "#e7d7b4"], [1, "#c6b28a"]], 0, 0, 1, 0)}"/>`;
    for (let i = 0; i < 5; i++) k += `<rect x="${r(x - 3.6 + i * 1.7)}" y="${r(y0 + 1 + (i % 2))}" width="1.1" height="3.6" rx=".3" fill="#b88b4f" transform="rotate(${-20 + i * 10} ${r(x - 3.6 + i * 1.7)} ${r(y0 + 3)})"/>`;
    k += `<text x="${x}" y="${y0 + 9.4}" font-size="1.6" text-anchor="middle" fill="#7a6440" font-family="Arial">Klammern</text>`;
    unter.push({ id: "waescheklammer", de: "die Wäscheklammer", syl: "WÄ-sche-klam-mer", it: "la molletta", itSyl: "mol-LET-ta", en: "clothes peg", x: cx + x, y: LEINE.y + y0 + 13, kunst: flaeche(-6, -13, 12, 13.4),
      tipp: "Mit der Wäscheklammer hält die Wäsche an der Leine." });
  }
  S.teil({ id: "waescheleine", de: "die Wäscheleine", syl: "WÄ-sche-lei-ne", it: "il filo per il bucato", itSyl: "FI-lo per il bu-CA-to", en: "clothes line",
    x: cx, y: LEINE.y, kunst: k,
    zoom: { x: LEINE.x0 - 4, y: LEINE.y - 4, w: W + 8, h: (W + 8) / 1.5 },
    unter });
}

/* =====================================================================
   12 — DER MANN am Wäscheständer, 13 — DER WÄSCHESTÄNDER
   ===================================================================== */
{
  const Y = 164, H = 1.8 * M(Y);
  const m = B.mensch({ id: "b15b_mann", geschlecht: "m", pose: "halten", blick: -20, frisur: "kurz", haarfarbe: "schwarz", haut: "dunkel", bart: true,
    kleidung: { oberteil: { stueck: "pullover", farbe: "gruen_d" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" } } }, H);
  /* er hält ein nasses T-Shirt an den Schultern, gleich hängt er es auf */
  const hl = { x: m.z.handL.x * m.k, y: m.z.handL.y * m.k }, hr = { x: m.z.handR.x * m.k, y: m.z.handR.y * m.k };
  const shirt = `<path d="M${r(hr.x)} ${r(hr.y)} L${r(hl.x)} ${r(hl.y)} L${r(hl.x + 2)} ${r(hl.y + 5)} L${r(hl.x - 2.4)} ${r(hl.y + 4)} L${r(hl.x - 2.6)} ${r(hl.y + 17)} L${r(hr.x + 2.6)} ${r(hr.y + 17)} L${r(hr.x + 2.4)} ${r(hr.y + 4)} L${r(hr.x - 2)} ${r(hr.y + 5)} Z" fill="${S.lg("tshirt", [[0, "#f6d55c"], [1, "#e0b532"]])}"/>` +
    `<path d="M${r((hl.x + hr.x) / 2 - 3)} ${r(hl.y)} q3 3 6 0" stroke="#c99a1f" stroke-width=".6" fill="none"/>`;
  S.teil({ id: "mann", de: "der Mann", syl: "MANN", it: "l'uomo", itSyl: "UO-mo", en: "man", x: 270, y: Y, kunst: m.svg + shirt,
    tipp: "Er hängt die nasse Wäsche auf den Wäscheständer. Im Mehrfamilienhaus hat jede Partei ihren Waschtag." });
}
{
  /* Flügelwäschetrockner: zwei Flügel, Mittelteil mit Stäben, X-Beine */
  const Y = 182, s = M(Y) / 55;
  let k = schatten(0, 0, 34, 2, 0.22);
  const top = -0.9 * M(Y);
  /* Beine */
  k += `<path d="M-26 0 L22 ${r(top + 10)} M26 0 L-22 ${r(top + 10)}" stroke="#c9cfd4" stroke-width="1.3"/>`;
  k += `<path d="M-26 0 L-26 -1.4 M26 0 L26 -1.4" stroke="#5a6066" stroke-width="2.4" stroke-linecap="round"/>`;
  /* Rahmen oben: Mittelteil + Flügel (leicht schräg) */
  const yA = top, yF = top + 9;
  k += `<path d="M-20 ${r(yA)} L20 ${r(yA)} M-20 ${r(yA)} L-34 ${r(yF)} M20 ${r(yA)} L34 ${r(yF)} M-34 ${r(yF)} L-34 ${r(yF + 2)} M34 ${r(yF)} L34 ${r(yF + 2)}" stroke="#d6dbdf" stroke-width="1.2" fill="none"/>`;
  for (let i = 1; i < 6; i++) k += `<line x1="${-20 + i * 6.6}" y1="${r(yA - 1)}" x2="${-20 + i * 6.6}" y2="${r(yA + 1)}" stroke="#b9c0c5" stroke-width=".5"/>`;
  /* Wäsche: Handtuch, T-Shirt, Kissenbezug */
  k += `<path d="M-33 ${r(yF)} L-22 ${r(yA + 1.4)} L-22 ${r(yA + 22)} L-33 ${r(yF + 18)} Z" fill="${S.lg("st1", [[0, "#f2a25b"], [1, "#d07d33"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-33 ${r(yF + 15)} L-22 ${r(yA + 19)}" stroke="#fff" stroke-width=".8" opacity=".7"/>`;
  k += `<path d="M-16 ${r(yA)} L2 ${r(yA)} L2 ${r(yA + 20)} L-16 ${r(yA + 20)} Z" fill="${S.lg("st2", [[0, "#ffffff"], [1, "#e4e6e8"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-16 ${r(yA + 3)} L2 ${r(yA + 3)}" stroke="#d4d8db" stroke-width=".4"/>`;
  k += `<path d="M6 ${r(yA)} L19 ${r(yA)} L19 ${r(yA + 14)} L6 ${r(yA + 14)} Z" fill="${S.lg("st3", [[0, "#e46f8c"], [1, "#c24c6a"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M22 ${r(yA + 1.4)} L33 ${r(yF)} L33 ${r(yF + 12)} L22 ${r(yA + 13)} Z" fill="${S.lg("st4", [[0, "#5ea06a"], [1, "#3f7c4b"]], 0, 0, 1, 0)}"/>`;
  S.teil({ id: "waeschestaender", de: "der Wäscheständer", syl: "WÄ-sche-stän-der", it: "lo stendino", itSyl: "sten-DI-no", en: "clothes airer",
    x: 268, y: Y, steht: true, kunst: k });
}

/* =====================================================================
   14 — DIE FRAU am Bügelbrett, 15 — BÜGELBRETT, 16 — BÜGELEISEN
   ===================================================================== */
const FRAU = { x: 176, y: 170 };
let HAND = null;
{
  const H = 1.68 * M(FRAU.y);
  const m = B.mensch({ id: "b15b_frau", geschlecht: "w", pose: "halten", blick: 10, frisur: "zopf", haarfarbe: "hellbraun", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "pullover", farbe: "beige" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" } } }, H);
  HAND = { x: FRAU.x + m.z.handL.x * m.k, y: FRAU.y + m.z.handL.y * m.k };
  S.teil({ id: "frau", de: "die Frau", syl: "FRAU", it: "la donna", itSyl: "DON-na", en: "woman", x: FRAU.x, y: FRAU.y, kunst: m.svg,
    tipp: "Sie bügelt die Hemden. Vorher hat sie die Wäsche aus der Maschine geholt." });
}
const BRETT = { x: 176, y: 184, hoehe: 0.92 };
{
  const s = M(BRETT.y), top = -BRETT.hoehe * s;
  let k = schatten(0, 0, 34, 2.2, 0.22);
  /* X-Gestell */
  k += `<path d="M-24 0 L16 ${r(top + 3)} M20 0 L-20 ${r(top + 3)}" stroke="#7b848b" stroke-width="1.4"/>`;
  k += `<rect x="-26.5" y="-1.4" width="5" height="1.8" rx=".8" fill="#2f3438"/><rect x="17.5" y="-1.4" width="5" height="1.8" rx=".8" fill="#2f3438"/>`;
  /* Brett mit Bezug (von leicht oben): spitz zulaufend links */
  const yv = top, yh = top - 4;
  k += `<path d="M-40 ${r((yv + yh) / 2)} Q-36 ${r(yh)} -26 ${r(yh)} L30 ${r(yh)} L30 ${r(yv)} L-26 ${r(yv)} Q-36 ${r(yv)} -40 ${r((yv + yh) / 2)} Z" fill="${S.lg("bezug", [[0, "#9fc9d6"], [1, "#6fa6b8"]])}"/>`;
  for (let i = 0; i < 12; i++) k += `<circle cx="${r(-30 + i * 5)}" cy="${r(yv - 2 + (i % 2) * 0.8)}" r=".7" fill="#e9f3f6" opacity=".8"/>`;
  k += `<path d="M-40 ${r((yv + yh) / 2)} Q-36 ${r(yv + 1.6)} -26 ${r(yv + 1.6)} L30 ${r(yv + 1.6)} L30 ${r(yv)} L-26 ${r(yv)} Q-36 ${r(yv)} -40 ${r((yv + yh) / 2)} Z" fill="#4f8597"/>`;
  /* Bügeleisenablage rechts (Gitter) */
  k += `<path d="M30 ${r(yh)} L39 ${r(yh + 0.4)} L39 ${r(yv + 1.6)} L30 ${r(yv + 1.6)} Z" fill="#9aa3aa"/>`;
  for (let i = 0; i < 4; i++) k += `<line x1="${31.6 + i * 2}" y1="${r(yh + 0.6)}" x2="${31.6 + i * 2}" y2="${r(yv + 1)}" stroke="#5f686f" stroke-width=".4"/>`;
  /* Hemd liegt auf dem Brett */
  k += `<path d="M-30 ${r(yv - 0.4)} Q-30 ${r(yh - 1.6)} -18 ${r(yh - 1)} L6 ${r(yh - 1)} L6 ${r(yv - 0.2)} Z" fill="#f4f6f8"/>`;
  k += `<path d="M-12 ${r(yh - 0.6)} L-12 ${r(yv - 0.4)}" stroke="#d7dce0" stroke-width=".4"/>`;
  S.teil({ id: "buegelbrett", de: "das Bügelbrett", syl: "BÜ-gel-brett", it: "l'asse da stiro", itSyl: "AS-se da STI-ro", en: "ironing board",
    x: BRETT.x, y: BRETT.y, steht: true, kunst: k });
}
{
  /* Bügeleisen (Dampfbügeleisen) unter der Hand der Frau */
  const s = M(BRETT.y), yb = BRETT.y - BRETT.hoehe * s - 2.4;
  let k = `<path d="M-9 0 L6 0 Q9 0 9.6 -1.6 Q8 -4.4 2 -5 L-9 -5 Z" fill="${S.lg("sohle", [[0, "#eef1f3"], [1, "#b8c0c6"]])}"/>`;
  k += `<path d="M-9 -1.4 L7.6 -1.4" stroke="#8f99a1" stroke-width=".6"/>`;
  k += `<path d="M-9 -5 L2 -5 Q6 -5 7 -3.6 L-9 -3.6 Z" fill="#7a3fa0"/>`;
  k += `<path d="M-8 -5 Q-8 -10 -4 -10 L4 -10 Q6 -10 5 -5" stroke="#5b2c7a" stroke-width="1.8" fill="none"/>`;
  k += `<path d="M9 -2 q1 -3 -1 -6 q2 -2 0 -4" stroke="#fff" stroke-width=".5" opacity=".6" fill="none"/>`;
  k += `<path d="M-9 -3 C-14 -3 -16 6 -12 12" stroke="#333" stroke-width=".5" fill="none"/>`;
  S.teil({ oben: true, id: "buegeleisen", de: "das Bügeleisen", syl: "BÜ-gel-ei-sen", it: "il ferro da stiro", itSyl: "FER-ro da STI-ro", en: "iron",
    x: Math.min(Math.max(HAND.x, 160), 196), y: yb, kunst: k + flaeche(-10, -11, 21, 11.6), tipp: "Vorsicht, das Bügeleisen ist heiß!" });
}

/* =====================================================================
   17 — DER BODENABLAUF, 18 — DER WÄSCHEKORB, 19 — DER STAUBSAUGER
   ===================================================================== */
{
  let k = `<ellipse cx="0" cy="0" rx="7" ry="2.2" fill="#6b6f72"/><ellipse cx="0" cy="-.2" rx="6" ry="1.8" fill="${S.lg("gully", [[0, "#9aa1a6"], [1, "#6d7378"]])}"/>`;
  for (let i = -4; i <= 4; i += 1.6) k += `<line x1="${r(i)}" y1="-1.4" x2="${r(i)}" y2="1.1" stroke="#3d4246" stroke-width=".5"/>`;
  S.teil({ oben: true, id: "bodenablauf", de: "der Bodenablauf", syl: "BO-den-ab-lauf", it: "lo scarico a pavimento", itSyl: "SCA-ri-co a pa-vi-MEN-to", en: "floor drain",
    x: 118, y: 172, kunst: k + flaecheEllipse(0, 0, 8, 3.6), tipp: "Läuft Wasser aus, fließt es in den Bodenablauf." });
}
{
  const s = M(190) / 55;
  let k = schatten(0, 0, 20, 2, 0.3);
  k += `<path d="M-19 -18 L19 -18 L16 0 L-16 0 Z" fill="${S.lg("korb", [[0, "#f3f4f5"], [1, "#cfd4d8"]], 0, 0, 1, 0)}"/>`;
  for (let i = 0; i < 9; i++) for (let j = 0; j < 3; j++) k += `<rect x="${r(-15 + i * 3.4 + j * 0.2)}" y="${r(-14.6 + j * 4.6)}" width="2" height="3" rx=".6" fill="#aeb5bb"/>`;
  k += `<rect x="-20" y="-19.6" width="40" height="2.4" rx="1" fill="#e9ecee"/><rect x="-5" y="-16.6" width="10" height="2" rx="1" fill="#9aa3aa"/>`;
  /* Wäsche quillt oben heraus */
  k += `<path d="M-17 -19 Q-12 -27 -4 -24 Q0 -29 7 -25 Q13 -28 17 -19 Z" fill="#e8e2d4"/>`;
  k += `<path d="M-10 -21 Q-6 -26 0 -23 Q4 -22 2 -19.6 L-10 -19.6 Z" fill="#d7577a"/><path d="M4 -21 Q9 -27 14 -20 L4 -19.6 Z" fill="#4f78ad"/>`;
  S.teil({ id: "waeschekorb", de: "der Wäschekorb", syl: "WÄ-sche-korb", it: "il cesto della biancheria", itSyl: "CE-sto del-la bian-che-RI-a", en: "laundry basket",
    x: 44, y: 190, steht: true, kunst: k, tipp: "Die saubere Wäsche kommt aus der Maschine direkt in den Wäschekorb." });
}
{
  /* Bodenstaubsauger mit gewelltem Schlauch, Rohr und Düse */
  let k = schatten(0, 0, 18, 1.8, 0.3);
  k += `<path d="M-12 0 Q-16 0 -16 -6 Q-16 -15 -4 -16 L8 -16 Q14 -15 14 -7 L14 0 Z" fill="${S.lg("sauger", [[0, "#e04a3f"], [0.6, "#b8322a"], [1, "#7e1f19"]])}"/>`;
  k += `<path d="M-10 -13 Q-2 -17.4 9 -14" stroke="#fff" stroke-width=".9" opacity=".35" fill="none"/>`;
  k += `<rect x="-6" y="-17.6" width="8" height="2.4" rx="1" fill="#2b2f33"/>`;
  k += `<circle cx="-10" cy="-1" r="2.4" fill="#2b2f33"/><circle cx="9" cy="-1" r="2.4" fill="#2b2f33"/>`;
  /* Schlauch (gewellt) */
  let d = `M14 -8 C24 -10 28 -2 30 -16 C31 -24 22 -30 26 -38`;
  k += `<path d="${d}" stroke="#4a5056" stroke-width="2.6" fill="none"/><path d="${d}" stroke="#2b2f33" stroke-width="2.6" stroke-dasharray=".5 .9" fill="none"/>`;
  /* Rohr an die Wand gelehnt, Bodendüse */
  k += `<path d="M26 -38 L23 -2" stroke="${CHROM}" stroke-width="1.6"/><path d="M17 0 L29 0 L28.4 -2.4 L17.6 -2.4 Z" fill="#2b2f33"/>`;
  S.teil({ id: "staubsauger", de: "der Staubsauger", syl: "STAUB-sau-ger", it: "l'aspirapolvere", itSyl: "a-spi-ra-POL-ve-re", en: "vacuum cleaner",
    x: 212, y: 196, steht: true, kunst: k, tipp: "Der Schlauch ist gewellt — daran erkennt man ihn." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/waschkueche.js"));
console.log(aus);
