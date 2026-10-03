#!/usr/bin/env node
/* =====================================================================
   DER WINTER (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (Räum- und Streupflicht nach den Gemeindesatzungen,
   Fotos verschneiter Dörfer im Sauerland, Harz und Erzgebirge):
   - Im Dorf am Ortsrand: Fachwerkhaus mit tief verschneitem Dach,
     EISZAPFEN an der Traufe, aus dem SCHORNSTEIN steigt Rauch; im
     Fenster leuchtet ein Schwibbogen.
   - Vor dem Haus der Garten mit JÄGERZAUN, eine verschneite TANNE und
     ein VOGELHAUS mit Meisenknödel (Kohlmeise, Rotkehlchen).
   - RÄUMPFLICHT: Anwohner müssen werktags meist ab 7 Uhr den GEHWEG
     räumen und streuen (SCHNEESCHIEBER, STREUSALZ oder Splitt).
   - Hinter dem Dorf der RODELHANG mit Kindern auf Holzschlitten
     (Davoser), am Fuß ein SCHNEEMANN mit Möhrennase, Kohleaugen,
     Topf und Besen.
   - Winterkleidung: Anorak, Schneehose, MÜTZE, SCHAL, HANDSCHUHE,
     gefütterte Stiefel. Leichter Schneefall, bedeckter Himmel.
   BLICK: vom Gehweg, Augenhöhe 2,5 m, Horizont y = 70.
   Einheiten je Meter am Boden: s(y) = (y − 70) / 2,5
   (Gehweg vorn y 190: 48, Zaun y 152: 33, Haus y 96: 10).
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "winter", titel: "Der Winter", emoji: "⛄", thema: "Natur", kuerzel: "b20b", fassung: 852 });
const rnd = zufall(2412);
const r = B.r;
const HY = 70, E = 2.5;
const s = (y) => (y - HY) / E;
const um = (ox, oy, svg) => `<g transform="translate(${r(-ox)} ${r(-oy)})">${svg}</g>`;
const knapp = (svg) => svg.replace(/ (d|x1|y1|x2|y2|cx|cy|rx|ry)="([^"]*)"/g, (m, a, v) => ` ${a}="${v.replace(/-?\d+\.\d+/g, (n) => String(Math.round(+n)))}"`);
const mensch = (spec, h) => { const m = B.mensch(spec, h); m.svg = knapp(m.svg); return m; };
B.mensch({}, 10);
const MP = globalThis.DMA_MENSCH.POSEN;
MP.b20b_schippen = Object.assign({}, MP.stehen, { kipp: 22, lende: 10, brust: 8, nacken: -8, kopf: -10,
  schulterR: { vor: 62, seit: 6 }, ellbogenR: 22, unterarmR: 20, handR: 4, fingerR: 0.75,
  schulterL: { vor: 40, seit: 12 }, ellbogenL: 52, unterarmL: 30, handL: 4, fingerL: 0.75,
  huefteL: { vor: 40, seit: 3, dreh: -4 }, knieL: 26, fussL: -12, huefteR: { vor: 8, seit: 3, dreh: -4 }, knieR: 14, fussR: -6 });

/* ---------- Stoffe ---------------------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("rauch")}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.8"/></filter>`);
const SCHNEE = S.lg("schnee", [[0, "#ffffff"], [0.6, "#f3f7fb"], [1, "#dde7f1"]]);
const SCHNEE_S = S.lg("schneeschatten", [[0, "#dfe8f2"], [1, "#c3d2e2"]]);
const PUTZ = S.lg("putz", [[0, "#f4efe4"], [1, "#e2dacb"]]);
const BALKEN = "#5a3b24";
const TANNE = S.lg("tannengruen", [[0, "#2f4d3a"], [1, "#1d3527"]], 0, 0, 1, 0);
S.def(`<pattern id="${S.id("pflaster")}" width="10" height="5" patternUnits="userSpaceOnUse"><rect width="10" height="5" fill="#8c9096"/><rect x=".3" y=".3" width="9.4" height="4.4" rx=".4" fill="#9a9ea4"/><circle cx="2" cy="1.4" r=".25" fill="#fff" opacity=".7"/><circle cx="6.6" cy="3.2" r=".2" fill="#fff" opacity=".7"/><circle cx="8.2" cy="1" r=".18" fill="#fff" opacity=".6"/></pattern>`);

/* =====================================================================
   KULISSE — bedeckter Himmel, ferne Hügel mit Wald, Schneefläche
   ===================================================================== */
{
  let k = `<rect width="320" height="${HY + 6}" fill="${S.lg("himmel", [[0, "#aebdcc"], [0.6, "#cfd9e2"], [1, "#e8edf1"]])}"/>`;
  /* ferne Hügelkette mit Nadelwald */
  k += `<path d="M0 60 Q40 52 80 58 Q130 64 170 56 Q220 48 260 54 L320 50 L320 80 L0 80 Z" fill="#dfe6ee"/>`;
  let wald = "";
  for (let x = -2; x < 322; x += 2.6 + rnd() * 1.6) {
    const yb = 66 + Math.sin(x / 40) * 2 + rnd() * 2, h = 6 + rnd() * 5;
    wald += `<path d="M${r(x - h * 0.28)} ${r(yb)} L${r(x)} ${r(yb - h)} L${r(x + h * 0.28)} ${r(yb)} Z" fill="${rnd() < 0.5 ? "#6f8189" : "#62757e"}"/><path d="M${r(x - h * 0.12)} ${r(yb - h * 0.55)} L${r(x)} ${r(yb - h)} L${r(x + h * 0.12)} ${r(yb - h * 0.55)} Z" fill="#eef2f6"/>`;
  }
  k += wald + `<rect x="0" y="54" width="320" height="16" fill="#e5ebf1" opacity=".35"/>`;
  /* Schneefläche bis vorn */
  k += `<rect x="0" y="${HY - 2}" width="320" height="${202 - HY}" fill="${SCHNEE}"/>`;
  k += `<path d="M0 ${HY + 4} Q90 ${HY + 1} 170 ${HY + 6} T320 ${HY + 4}" stroke="#d6e0ea" stroke-width="2" fill="none" opacity=".7"/>`;
  /* ferne Dorfdächer unter der Kirche */
  for (const [x, w, h] of [[140, 14, 6], [156, 10, 5], [212, 12, 6], [226, 9, 4.6]]) {
    k += `<rect x="${x - w / 2}" y="${76 - h}" width="${w}" height="${h}" fill="#c9bfae"/><path d="M${x - w / 2 - 1} ${76 - h} L${x} ${76 - h - w * 0.4} L${x + w / 2 + 1} ${76 - h} Z" fill="#f4f7fa"/>`;
    k += `<rect x="${x - w / 4}" y="${76 - h * 0.6}" width="1.4" height="1.4" fill="#e9c77a"/>`;
  }
  /* Bäume auf dem Kamm des Rodelhangs (stehen hinter dem Hang) */
  for (const [x, y, h] of [[262, 66, 16], [272, 60, 20], [284, 54, 22], [296, 50, 18], [306, 46, 24], [316, 44, 20]]) {
    let g = `<rect x="${x - 0.6}" y="${y - 2}" width="1.2" height="4" fill="#4a3a2c"/>`;
    for (let i = 0; i < 4; i++) { const yy = y - i * h * 0.22, w = h * (0.34 - i * 0.07); g += `<path d="M${r(x - w)} ${r(yy)} L${x} ${r(yy - h * 0.34)} L${r(x + w)} ${r(yy)} Z" fill="#2d4637"/><path d="M${r(x - w * 0.9)} ${r(yy - 0.3)} Q${x} ${r(yy - h * 0.22)} ${r(x + w * 0.9)} ${r(yy - 0.3)} L${r(x + w * 0.5)} ${r(yy - h * 0.16)} L${x} ${r(yy - h * 0.32)} L${r(x - w * 0.5)} ${r(yy - h * 0.16)} Z" fill="#f4f7fa"/>`; }
    k += g;
  }
  S.hinten(k);
}

/* =====================================================================
   1 — DIE KIRCHE (Dorfkirche in der Ferne)
   ===================================================================== */
{
  const x = 186, y = 76;
  let k = `<rect x="${x - 6}" y="${y - 14}" width="26" height="14" fill="${PUTZ}"/>`;
  k += `<path d="M${x - 7} ${y - 14} L${x + 7} ${y - 22} L${x + 21} ${y - 14} Z" fill="#eef2f6"/><path d="M${x - 7} ${y - 14} L${x + 21} ${y - 14}" stroke="#9aa6b2" stroke-width=".4"/>`;
  for (let i = 0; i < 3; i++) k += `<path d="M${x + 1 + i * 6} ${y - 4} v-5 q1.2 -1.6 2.4 0 v5 Z" fill="#6f7f8f"/>`;
  /* Turm mit spitzem, verschneitem Helm */
  k += `<rect x="${x - 11}" y="${y - 30}" width="8" height="30" fill="${S.lg("turm", [[0, "#ece6da"], [1, "#d4ccbd"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${x - 12} ${y - 30} L${x - 7} ${y - 50} L${x - 2} ${y - 30} Z" fill="#53606c"/><path d="M${x - 12} ${y - 30} L${x - 7} ${y - 50} L${x - 7.6} ${y - 30} Z" fill="#eef2f6" opacity=".8"/>`;
  k += `<line x1="${x - 7}" y1="${y - 50}" x2="${x - 7}" y2="${y - 55}" stroke="#7a6a3a" stroke-width=".4"/><line x1="${x - 8.4}" y1="${y - 53.4}" x2="${x - 5.6}" y2="${y - 53.4}" stroke="#7a6a3a" stroke-width=".4"/>`;
  k += `<circle cx="${x - 7}" cy="${y - 25}" r="1.8" fill="#f9f6ee" stroke="#6b5a3a" stroke-width=".3"/><path d="M${x - 7} ${y - 25} v-1.2 M${x - 7} ${y - 25} h.9" stroke="#333" stroke-width=".25"/>`;
  k += `<path d="M${x - 8.4} ${y - 17} v-3.4 q1.4 -1.6 2.8 0 v3.4 Z" fill="#5b6876"/>`;
  S.teil({ id: "kirche", de: "die Kirche", syl: "KIR-che", it: "la chiesa", itSyl: "CHIE-sa", en: "church", x, y, steht: true, kunst: um(x, y, k) });
}

/* =====================================================================
   2 — DER RODELHANG (rechts) mit rodelnden Kindern in der Ferne
   ===================================================================== */
{
  const HANG = "M150 128 Q196 116 232 92 Q262 70 292 52 Q306 44 320 40 L320 130 Q240 126 150 128 Z";
  let k = `<path d="${HANG}" fill="${S.lg("hang", [[0, "#ffffff"], [0.5, "#f1f5f9"], [1, "#d7e2ec"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M150 128 Q196 116 232 92 Q262 70 292 52 Q306 44 320 40" stroke="#cdd9e5" stroke-width="1.2" fill="none"/>`;
  k += `<path d="${HANG}" fill="${S.lg("hanglicht", [[0, "#c9d7e6", 0.45], [0.6, "#fff", 0], [1, "#fff", 0]], 0, 1, 0, 0)}"/>`;
  /* Rodelspuren */
  for (const [x0, y0, x1, y1] of [[306, 50, 206, 124], [298, 54, 190, 125], [314, 46, 236, 126], [288, 60, 172, 127]]) {
    k += `<path d="M${x0} ${y0} Q${(x0 + x1) / 2 + 8} ${(y0 + y1) / 2 - 2} ${x1} ${y1}" stroke="#c6d3e1" stroke-width=".6" fill="none"/><path d="M${x0 + 1.4} ${y0 + 0.4} Q${(x0 + x1) / 2 + 9.4} ${(y0 + y1) / 2 - 1.4} ${x1 + 2.4} ${y1 + 0.2}" stroke="#c6d3e1" stroke-width=".6" fill="none"/>`;
  }
  /* drei kleine Rodler (weit weg, 1–1,5 m ≈ 6–9 Einheiten) */
  const rodler = (x, y, f, sk) => {
    let g = `<path d="M${r(x - 4 * sk)} ${r(y)} L${r(x + 4 * sk)} ${r(y - 1.6 * sk)}" stroke="#7a5230" stroke-width="${r(0.7 * sk)}" stroke-linecap="round"/>`;
    g += `<path d="M${r(x - 4.4 * sk)} ${r(y - 0.6 * sk)} q-.8 -.2 -.6 -1" stroke="#7a5230" stroke-width="${r(0.4 * sk)}" fill="none"/>`;
    g += `<path d="M${r(x - 1.6 * sk)} ${r(y - 1.4 * sk)} L${r(x + 2.4 * sk)} ${r(y - 2.2 * sk)} L${r(x + 1.6 * sk)} ${r(y - 6 * sk)} L${r(x - 0.8 * sk)} ${r(y - 5.6 * sk)} Z" fill="${f}"/>`;
    g += `<circle cx="${r(x + 0.4 * sk)}" cy="${r(y - 7 * sk)}" r="${r(1.2 * sk)}" fill="#e9c4a6"/><path d="M${r(x - 0.8 * sk)} ${r(y - 7.4 * sk)} q1.2 -1.6 2.4 0 Z" fill="#2c4a7a"/>`;
    return g;
  };
  k += rodler(262, 74, "#c33b2e", 0.9) + rodler(228, 100, "#2d6fb3", 1.1);
  /* ein Kind zieht den Schlitten wieder hinauf */
  k += `<path d="M284 64 l-6 3" stroke="#555" stroke-width=".3"/><path d="M276 67.6 l5 -1.6" stroke="#7a5230" stroke-width=".7"/>`;
  k += `<path d="M285 63.6 l1.6 -5.6 l1.6 .2 l-.4 5.4 Z" fill="#3d8c56"/><circle cx="287.2" cy="56.6" r="1.1" fill="#e9c4a6"/><path d="M286 56.2 q1.2 -1.6 2.4 0 Z" fill="#d6a020"/><path d="M285.4 63.6 l-.6 2.4 M287.2 63.8 l.4 2.4" stroke="#2b3542" stroke-width=".6"/>`;
  S.teil({ id: "rodelhang", de: "der Rodelhang", syl: "RO-del-hang", it: "la pista per slittini", itSyl: "PI-sta per sli-TTI-ni", en: "sledging hill", x: 240, y: 128, kunst: um(240, 128, k),
    tipp: "Am Rodelhang fahren die Kinder mit dem Schlitten hinunter — und ziehen ihn wieder hinauf." });
}

/* =====================================================================
   3 — DAS HAUS (Fachwerkhaus) — Lupe: Eiszapfen, Schornstein, Fenster, Haustür
   ===================================================================== */
const HAUS = { x0: 2, x1: 98, y: 96, traufe: 60, first: 24 };
{
  const { x0, x1, y, traufe, first } = HAUS, cx = (x0 + x1) / 2;
  const unter = [];
  let k = schatten(cx, y + 0.6, 50, 2.4, 0.2);
  /* Erdgeschoss verputzt, Sockel aus Bruchstein */
  k += `<rect x="${x0}" y="${traufe}" width="${x1 - x0}" height="${y - traufe}" fill="${PUTZ}"/>`;
  k += `<rect x="${x0}" y="${y - 5}" width="${x1 - x0}" height="5" fill="#8f877a"/>`;
  for (let i = 0; i < 26; i++) k += `<rect x="${r(x0 + (i % 13) * 7.4 + (i > 12 ? 3.6 : 0))}" y="${i > 12 ? y - 2.4 : y - 4.8}" width="6.6" height="2.2" rx=".6" fill="${rnd() < 0.5 ? "#9d9486" : "#827a6d"}"/>`;
  /* Obergeschoss: Fachwerk */
  const og = traufe + 2, ug = traufe + 18;
  k += `<rect x="${x0}" y="${og - 2}" width="${x1 - x0}" height="2" fill="${BALKEN}"/><rect x="${x0}" y="${ug}" width="${x1 - x0}" height="1.8" fill="${BALKEN}"/>`;
  for (let i = 0; i <= 8; i++) { const x = x0 + i * (x1 - x0) / 8; k += `<rect x="${r(x - 0.8)}" y="${og}" width="1.6" height="${ug - og}" fill="${BALKEN}"/>`; }
  for (let i = 0; i < 8; i++) { const a = x0 + i * (x1 - x0) / 8, b = a + (x1 - x0) / 8; if (i % 2 === 0) k += `<path d="M${r(a)} ${ug} L${r(b)} ${og}" stroke="${BALKEN}" stroke-width="1.1"/>`; else k += `<path d="M${r(a)} ${og} L${r(b)} ${ug}" stroke="${BALKEN}" stroke-width="1.1"/>`; }
  /* Fenster im OG */
  const fenster = (fx, fy, w, h, licht) => {
    let g = `<rect x="${r(fx - w / 2 - 0.8)}" y="${r(fy - 0.8)}" width="${r(w + 1.6)}" height="${r(h + 1.6)}" fill="#f2efe8"/>`;
    g += `<rect x="${r(fx - w / 2)}" y="${r(fy)}" width="${r(w)}" height="${r(h)}" fill="${licht ? S.lg("warm", [[0, "#ffe3a2"], [1, "#f0b55a"]]) : S.lg("scheibe", [[0, "#7f93a6"], [1, "#4f6578"]])}"/>`;
    g += `<line x1="${r(fx)}" y1="${r(fy)}" x2="${r(fx)}" y2="${r(fy + h)}" stroke="#f2efe8" stroke-width=".6"/><line x1="${r(fx - w / 2)}" y1="${r(fy + h * 0.4)}" x2="${r(fx + w / 2)}" y2="${r(fy + h * 0.4)}" stroke="#f2efe8" stroke-width=".6"/>`;
    g += `<rect x="${r(fx - w / 2 - 3)}" y="${r(fy - 0.4)}" width="2.2" height="${r(h + 0.8)}" fill="#3f6b4c"/><rect x="${r(fx + w / 2 + 0.8)}" y="${r(fy - 0.4)}" width="2.2" height="${r(h + 0.8)}" fill="#3f6b4c"/>`;
    g += `<rect x="${r(fx - w / 2 - 1.2)}" y="${r(fy + h + 0.6)}" width="${r(w + 2.4)}" height="1.2" fill="#ffffff"/>`;
    return g;
  };
  for (const fx of [16, 40, 62, 84]) k += fenster(fx, og + 3, 8, 10, fx === 40);
  /* EG: großes Wohnzimmerfenster mit Schwibbogen, Haustür mit Kranz */
  const FX = 26, FY = ug + 5, FW = 18, FH = 13;
  let fe = fenster(FX, FY, FW, FH, true);
  /* Schwibbogen: Holzbogen mit Kerzen */
  fe += `<path d="M${FX - 7.4} ${FY + FH - 1} Q${FX - 7.4} ${FY + 3.4} ${FX} ${FY + 3} Q${FX + 7.4} ${FY + 3.4} ${FX + 7.4} ${FY + FH - 1}" stroke="#3a2614" stroke-width=".9" fill="none"/>`;
  fe += `<rect x="${FX - 8}" y="${FY + FH - 1.4}" width="16" height="1.2" fill="#3a2614"/>`;
  for (let i = 0; i < 7; i++) { const a = Math.PI * (i + 0.5) / 7, px = FX - Math.cos(a) * 7.2, py = FY + FH - 1 - Math.sin(a) * (FH - 4.4); fe += `<rect x="${r(px - 0.25)}" y="${r(py - 1.6)}" width=".5" height="1.6" fill="#fff8e0"/><circle cx="${r(px)}" cy="${r(py - 2)}" r=".55" fill="#fff3b0"/><circle cx="${r(px)}" cy="${r(py - 2)}" r="1.3" fill="#ffd36b" opacity=".35"/>`; }
  fe += `<path d="M${FX - 3} ${FY + FH - 1.4} l1 -3 l1 3 M${FX + 1} ${FY + FH - 1.4} l1.2 -3.6 l1.2 3.6" stroke="#3a2614" stroke-width=".5" fill="none"/>`;
  k += fe;
  unter.push({ id: "fenster", de: "das Fenster", syl: "FENS-ter", it: "la finestra", itSyl: "fi-NE-stra", en: "window", x: FX, y: FY + FH + 1, kunst: flaeche(-FW / 2 - 3, -FH - 1, FW + 6, FH + 2),
    tipp: "Im Fenster leuchtet ein Schwibbogen aus dem Erzgebirge." });
  for (const fx of [84]) k += fenster(fx, ug + 6, 9, 11, false);
  /* Haustür mit Vordach und Tannenkranz */
  const TX = 58;
  let td = `<rect x="${TX - 6.6}" y="${ug + 2}" width="13.2" height="${y - ug - 2}" fill="#efe9dc"/>`;
  td += `<rect x="${TX - 5}" y="${ug + 4}" width="10" height="${y - ug - 4}" rx=".6" fill="${S.lg("tuer", [[0, "#7a2f22"], [1, "#5c2119"]], 0, 0, 1, 0)}"/>`;
  td += `<rect x="${TX - 3.6}" y="${ug + 6}" width="7.2" height="6" rx=".4" fill="#f0c372" opacity=".85"/><circle cx="${TX + 3.4}" cy="${y - 13}" r=".6" fill="#d8b056"/>`;
  td += `<circle cx="${TX}" cy="${ug + 17}" r="3" fill="none" stroke="#2f5a38" stroke-width="1.5"/><circle cx="${TX - 1.6}" cy="${ug + 15.4}" r=".5" fill="#c7302a"/><circle cx="${TX + 1.8}" cy="${ug + 18.4}" r=".5" fill="#c7302a"/><path d="M${TX - 0.8} ${ug + 19.8} l.8 1.6 l.8 -1.6" fill="#c7302a"/>`;
  td += `<rect x="${TX - 6}" y="${y - 1.2}" width="12" height="1.2" fill="#aaa39a"/>`;
  td += `<path d="M${TX - 9} ${ug + 3} L${TX + 9} ${ug + 3} L${TX + 7} ${ug} L${TX - 7} ${ug} Z" fill="#6a5a4a"/><path d="M${TX - 9.6} ${ug + 0.6} Q${TX} ${ug - 2.4} ${TX + 9.6} ${ug + 0.6} L${TX + 9} ${ug + 1.6} L${TX - 9} ${ug + 1.6} Z" fill="#ffffff"/>`;
  k += td;
  unter.push({ id: "haustuer", de: "die Haustür", syl: "HAUS-tür", it: "la porta di casa", itSyl: "POR-ta di CA-sa", en: "front door", x: TX, y, kunst: flaeche(-7, -(y - ug), 14, y - ug),
    tipp: "An der Tür hängt ein Kranz aus Tannenzweigen." });
  /* Dach: dicke Schneedecke mit runder Kante, darunter rote Ziegel */
  k += `<path d="M${x0 - 6} ${traufe + 1} L${x0 + 6} ${first} L${x1 - 6} ${first} L${x1 + 6} ${traufe + 1} Z" fill="#9a4a32"/>`;
  k += `<path d="M${x0 - 6} ${traufe - 1} L${x0 + 6} ${first - 3} Q${cx} ${first - 5} ${x1 - 6} ${first - 3} L${x1 + 6} ${traufe - 1} Q${cx} ${traufe + 1.4} ${x0 - 6} ${traufe - 1} Z" fill="${SCHNEE}"/>`;
  k += `<path d="M${x0 - 6} ${traufe - 1} Q${cx} ${traufe + 1.4} ${x1 + 6} ${traufe - 1} L${x1 + 6.4} ${traufe + 1.4} Q${cx} ${traufe + 4.2} ${x0 - 6.4} ${traufe + 1.4} Z" fill="${SCHNEE_S}"/>`;
  k += `<path d="M${x0 + 6} ${first - 3} Q${cx} ${first - 5} ${x1 - 6} ${first - 3}" stroke="#ffffff" stroke-width="1.6" fill="none"/>`;
  for (let i = 0; i < 9; i++) k += `<path d="M${r(x0 + 6 + i * 10)} ${r(first + 6 + rnd() * 20)} q4 -1 8 0" stroke="#d6e1ec" stroke-width=".7" fill="none" opacity=".8"/>`;
  /* Dachgaube */
  k += `<rect x="${cx - 8}" y="${first + 8}" width="16" height="11" fill="${PUTZ}"/><rect x="${cx - 5}" y="${first + 10}" width="10" height="7" fill="${S.lg("scheibe2", [[0, "#7f93a6"], [1, "#4f6578"]])}"/><line x1="${cx}" y1="${first + 10}" x2="${cx}" y2="${first + 17}" stroke="#f2efe8" stroke-width=".6"/>`;
  k += `<path d="M${cx - 10} ${first + 8.6} L${cx} ${first + 2} L${cx + 10} ${first + 8.6} Q${cx} ${first + 9.6} ${cx - 10} ${first + 8.6} Z" fill="#ffffff"/>`;
  /* Eiszapfen an der Traufe */
  let ez = "";
  for (let x = x0 - 4; x < x1 + 4; x += 2.2 + rnd() * 2.6) {
    const l = 1.5 + rnd() * 6.5, yy = traufe + 2.4 + Math.sin((x - x0) / (x1 - x0) * Math.PI) * 0.9;
    ez += `<path d="M${r(x - 0.7)} ${r(yy)} Q${r(x - 0.2)} ${r(yy + l * 0.6)} ${r(x + 0.05)} ${r(yy + l)} Q${r(x + 0.3)} ${r(yy + l * 0.5)} ${r(x + 0.7)} ${r(yy)} Z" fill="${S.lg("eis", [[0, "#ffffff", 0.95], [0.5, "#d7ecf7", 0.85], [1, "#a9d0e6", 0.75]], 0, 0, 1, 0)}"/>`;
  }
  k += ez;
  unter.push({ id: "eiszapfen", de: "der Eiszapfen", syl: "EIS-zap-fen", it: "il ghiacciolo", itSyl: "ghiac-CIO-lo", en: "icicle", x: 80, y: traufe + 10, kunst: flaeche(-12, -8, 24, 9),
    tipp: "Schnee auf dem Dach taut, das Wasser tropft und gefriert an der Kante zu Eiszapfen." });
  /* Schornstein mit Rauch */
  const SX = 74;
  k += `<rect x="${SX - 3.4}" y="${first - 12}" width="6.8" height="13" fill="${S.lg("ziegel", [[0, "#9b4a35"], [1, "#6f3121"]], 0, 0, 1, 0)}"/>`;
  for (let i = 0; i < 4; i++) k += `<line x1="${SX - 3.4}" y1="${first - 9 + i * 3}" x2="${SX + 3.4}" y2="${first - 9 + i * 3}" stroke="#5a2618" stroke-width=".3"/>`;
  k += `<rect x="${SX - 4.2}" y="${first - 13.4}" width="8.4" height="1.8" fill="#5a2618"/><path d="M${SX - 4.4} ${first - 13.4} Q${SX} ${first - 16} ${SX + 4.4} ${first - 13.4} Z" fill="#ffffff"/>`;
  k += `<g filter="url(#${S.id("rauch")})" opacity=".75"><circle cx="${SX + 1}" cy="${first - 19}" r="3" fill="#eef1f4"/><circle cx="${SX + 5}" cy="${first - 25}" r="4" fill="#e6eaee"/><circle cx="${SX + 11}" cy="${first - 30}" r="5" fill="#e3e8ec"/></g>`;
  unter.push({ id: "schornstein", de: "der Schornstein", syl: "SCHORN-stein", it: "il camino", itSyl: "ca-MI-no", en: "chimney", x: SX, y: first + 1, kunst: flaeche(-5, -16, 10, 17),
    tipp: "Drinnen brennt der Ofen — der Rauch steigt aus dem Schornstein." });
  S.teil({ id: "haus", de: "das Haus", syl: "HAUS", it: "la casa", itSyl: "CA-sa", en: "house", x: cx, y, steht: true, kunst: um(cx, y, k),
    zoom: { x: 0, y: 4, w: 120, h: 80 }, unter: unter.map((u) => u),
    tipp: "Ein altes Fachwerkhaus: Holzbalken, dazwischen weißer Putz." });
}

/* =====================================================================
   4 — DIE TANNE (verschneit) und 5 — DIE SCHNEEFLOCKE davor
   ===================================================================== */
{
  const x = 128, y = 118, sk = s(y);              // 19 je Meter
  const h = 5 * sk;
  let k = schatten(x, y + 0.6, 22, 2.6, 0.2);
  k += `<rect x="${x - 1.6}" y="${y - 8}" width="3.2" height="8" fill="#4a3426"/>`;
  const stufen = 7;
  for (let i = 0; i < stufen; i++) {
    const t = i / stufen, yy = y - 5 - t * (h - 8), w = (1 - t) * 1.45 * sk + 2;
    const top = yy - h * 0.24;
    k += `<path d="M${r(x - w)} ${r(yy)} Q${r(x - w * 0.5)} ${r(yy - 2)} ${x} ${r(top)} Q${r(x + w * 0.5)} ${r(yy - 2)} ${r(x + w)} ${r(yy)} Q${x} ${r(yy + 2.6)} ${r(x - w)} ${r(yy)} Z" fill="${TANNE}"/>`;
    /* Zweigspitzen unten */
    for (let j = -3; j <= 3; j++) k += `<path d="M${r(x + j * w / 3.6 - 1.2)} ${r(yy + 1.4 - Math.abs(j) * 0.3)} l1.2 2 l1.2 -2 Z" fill="#1d3527"/>`;
    /* Schnee auf den Ästen */
    k += `<path d="M${r(x - w * 0.92)} ${r(yy - 0.6)} Q${r(x - w * 0.5)} ${r(yy - 3)} ${x} ${r(top + 1.6)} Q${r(x + w * 0.5)} ${r(yy - 3)} ${r(x + w * 0.92)} ${r(yy - 0.6)} Q${r(x + w * 0.5)} ${r(yy - 2.2)} ${r(x + w * 0.2)} ${r(yy - 1.2)} Q${x} ${r(yy - 2.8)} ${r(x - w * 0.3)} ${r(yy - 1)} Q${r(x - w * 0.6)} ${r(yy - 2)} ${r(x - w * 0.92)} ${r(yy - 0.6)} Z" fill="${SCHNEE}"/>`;
  }
  k += `<path d="M${x - 1.6} ${r(y - h - 2)} L${x} ${r(y - h - 7)} L${x + 1.6} ${r(y - h - 2)} Z" fill="#ffffff"/>`;
  S.teil({ id: "tanne", de: "die Tanne", syl: "TAN-ne", it: "l'abete", itSyl: "a-BE-te", en: "fir tree", x, y, steht: true, kunst: um(x, y, k),
    tipp: "Die Tanne bleibt auch im Winter grün." });
}
{
  /* eine Flocke nah vor der dunklen Tanne: sechs Arme mit Ästchen */
  const x = 120, y = 58, R = 3.6;
  let k = "";
  for (let i = 0; i < 6; i++) {
    const a = i * Math.PI / 3, ex = x + Math.cos(a) * R, ey = y + Math.sin(a) * R;
    k += `<line x1="${x}" y1="${y}" x2="${r(ex)}" y2="${r(ey)}" stroke="#ffffff" stroke-width=".42" stroke-linecap="round"/>`;
    for (const t of [0.45, 0.72]) {
      const bx = x + Math.cos(a) * R * t, by = y + Math.sin(a) * R * t, l = R * (t < 0.6 ? 0.36 : 0.24);
      for (const d of [-1, 1]) k += `<line x1="${r(bx)}" y1="${r(by)}" x2="${r(bx + Math.cos(a + d * 1.05) * l)}" y2="${r(by + Math.sin(a + d * 1.05) * l)}" stroke="#ffffff" stroke-width=".3" stroke-linecap="round"/>`;
    }
  }
  k += `<circle cx="${x}" cy="${y}" r=".7" fill="#ffffff"/><circle cx="${x}" cy="${y}" r="${R + 1}" fill="#ffffff" opacity=".1"/>`;
  S.teil({ oben: true, id: "schneeflocke", de: "die Schneeflocke", syl: "SCHNEE-flo-cke", it: "il fiocco di neve", itSyl: "FIOC-co di NE-ve", en: "snowflake", x, y: y + R, kunst: um(x, y + R, k),
    tipp: "Jede Schneeflocke hat sechs Arme — und keine gleicht der anderen." });
}

/* =====================================================================
   6 — DAS VOGELHAUS — Lupe: Kohlmeise, Rotkehlchen, Meisenknödel
   ===================================================================== */
{
  const x = 36, y = 140, sk = s(y);               // 28 je Meter
  const top = y - 1.45 * sk;
  const unter = [];
  let k = `<rect x="${x - 0.9}" y="${r(top)}" width="1.8" height="${r(y - top)}" fill="${S.lg("pfosten", [[0, "#7a5a3c"], [1, "#4f3825"]], 0, 0, 1, 0)}"/>`;
  /* Futterplatz, Häuschen mit Satteldach (Schnee drauf) */
  k += `<rect x="${x - 7}" y="${r(top - 1.2)}" width="14" height="1.6" fill="#8a6440"/>`;
  k += `<rect x="${x - 6.4}" y="${r(top - 1.8)}" width="12.8" height=".7" fill="#c8a35a"/>`;
  for (const dx of [-5.6, 5.6]) k += `<rect x="${x + dx - 0.5}" y="${r(top - 9)}" width="1" height="7.6" fill="#6b4c32"/>`;
  k += `<path d="M${x - 9} ${r(top - 8)} L${x} ${r(top - 14)} L${x + 9} ${r(top - 8)} Z" fill="#7b4d2e"/>`;
  k += `<path d="M${x - 9.6} ${r(top - 8)} L${x} ${r(top - 14.8)} L${x + 9.6} ${r(top - 8)} Q${x} ${r(top - 10.4)} ${x - 9.6} ${r(top - 8)} Z" fill="#ffffff"/>`;
  /* Kohlmeise auf dem Rand: schwarze Kappe, weiße Wange, gelbe Brust mit schwarzem Streif */
  const mx = x - 3.2, my = top - 1.8;
  let ms = `<path d="M${mx + 1.8} ${my - 1.2} l2 .6 l-.2 .4 Z" fill="#4c5a52"/>`;
  ms += `<ellipse cx="${mx}" cy="${my - 1.6}" rx="1.5" ry="1.15" fill="#f0d23c"/><path d="M${mx - 0.2} ${my - 2.6} L${mx - 0.1} ${my - 0.6}" stroke="#1b1b1b" stroke-width=".35"/>`;
  ms += `<path d="M${mx + 0.2} ${my - 2.6} Q${mx + 1.8} ${my - 2.4} ${mx + 1.8} ${my - 1} L${mx + 0.6} ${my - 1.2} Z" fill="#6f8a5e"/>`;
  ms += `<circle cx="${mx - 0.6}" cy="${my - 3.1}" r=".85" fill="#1b1b1b"/><ellipse cx="${mx - 0.8}" cy="${my - 3}" rx=".45" ry=".35" fill="#ffffff"/><path d="M${mx - 1.4} ${my - 3.1} l-.5 .15 l.5 .15 Z" fill="#333"/>`;
  ms += `<path d="M${mx - 0.3} ${my - 0.5} v.6 M${mx + 0.3} ${my - 0.5} v.6" stroke="#5a6070" stroke-width=".2"/>`;
  k += ms;
  unter.push({ id: "meise", de: "die Kohlmeise", syl: "KOHL-mei-se", it: "la cinciallegra", itSyl: "cin-cial-LE-gra", en: "great tit", x: mx, y: my, kunst: flaeche(-2.4, -4.4, 5, 4.6),
    tipp: "Die Kohlmeise hat eine gelbe Brust mit einem schwarzen Streifen." });
  /* Rotkehlchen auf dem Dach: orangerote Brust und Gesicht, braun oben */
  const rx = x + 4.4, ry = top - 11.4;
  let rk = `<ellipse cx="${rx}" cy="${ry}" rx="1.5" ry="1.25" fill="#8a7458"/><ellipse cx="${rx - 0.5}" cy="${ry + 0.1}" rx="1" ry=".95" fill="#e0742e"/>`;
  rk += `<circle cx="${rx - 0.9}" cy="${ry - 1.3}" r=".75" fill="#8a7458"/><circle cx="${rx - 1.1}" cy="${ry - 1.1}" r=".5" fill="#e0742e"/><circle cx="${rx - 1.1}" cy="${ry - 1.5}" r=".16" fill="#111"/>`;
  rk += `<path d="M${rx - 1.6} ${ry - 1.2} l-.45 .1 l.45 .15 Z" fill="#333"/><path d="M${rx + 1.2} ${ry - 0.4} l1.4 .8 l-.2 .4 Z" fill="#6f5c45"/><ellipse cx="${rx - 0.2}" cy="${ry + 0.8}" rx=".8" ry=".35" fill="#efe6da"/>`;
  k += rk;
  unter.push({ id: "rotkehlchen", de: "das Rotkehlchen", syl: "ROT-kehl-chen", it: "il pettirosso", itSyl: "pet-ti-ROS-so", en: "robin", x: rx, y: ry + 1.4, kunst: flaeche(-2.6, -3.2, 5.2, 3.6),
    tipp: "Das Rotkehlchen bleibt im Winter bei uns." });
  /* Meisenknödel im grünen Netz unter dem Dach */
  const kx = x + 7.8, ky = top - 5;
  k += `<line x1="${kx}" y1="${r(top - 8)}" x2="${kx}" y2="${r(ky - 1.6)}" stroke="#2f6a3a" stroke-width=".25"/><circle cx="${kx}" cy="${r(ky)}" r="1.6" fill="#c8a66e"/>`;
  for (let i = 0; i < 6; i++) k += `<circle cx="${r(kx - 1 + rnd() * 2)}" cy="${r(ky - 1 + rnd() * 2)}" r=".22" fill="${rnd() < 0.5 ? "#6b4a2a" : "#e8d39a"}"/>`;
  k += `<path d="M${kx - 1.6} ${r(ky)} h3.2 M${kx} ${r(ky - 1.6)} v3.2 M${kx - 1.1} ${r(ky - 1.1)} l2.2 2.2 M${kx + 1.1} ${r(ky - 1.1)} l-2.2 2.2" stroke="#2f6a3a" stroke-width=".2"/>`;
  unter.push({ id: "meisenknoedel", de: "der Meisenknödel", syl: "MEI-sen-knö-del", it: "la palla di grasso per uccelli", itSyl: "PAL-la di GRAS-so per uc-CEL-li", en: "fat ball", x: kx, y: r(ky + 1.8), kunst: flaeche(-2.2, -4.6, 4.4, 4.8),
    tipp: "Fett mit Körnern: Futter für die Vögel im Winter." });
  S.teil({ id: "vogelhaus", de: "das Vogelhaus", syl: "VO-gel-haus", it: "la casetta per uccelli", itSyl: "ca-SET-ta per uc-CEL-li", en: "bird feeder", x, y, steht: true, kunst: um(x, y, k),
    zoom: { x: x - 14, y: r(top - 17), w: 28, h: 19 }, unter });
}

/* =====================================================================
   7 — DER ZAUN (Jägerzaun mit Schneehauben)
   ===================================================================== */
{
  const y = 153, h = 0.9 * s(y), x0 = -2, x1 = 150;
  let k = schatten((x0 + x1) / 2, y + 0.6, 76, 1.6, 0.18);
  /* Pfosten */
  for (let x = x0 + 2; x <= x1; x += 25) k += `<rect x="${x - 1.2}" y="${r(y - h - 2)}" width="2.4" height="${r(h + 2)}" fill="#6e4f33"/><path d="M${x - 1.6} ${r(y - h - 2)} Q${x} ${r(y - h - 4.6)} ${x + 1.6} ${r(y - h - 2)} Z" fill="#ffffff"/>`;
  /* gekreuzte Latten */
  let l = "";
  for (let x = x0 - 10; x < x1; x += 6) {
    l += `<line x1="${r(Math.max(x0, x))}" y1="${r(x < x0 ? y - 2 - (x0 - x) * (h - 4) / 12 : y - 2)}" x2="${r(Math.min(x1, x + 12))}" y2="${r(x + 12 > x1 ? y - 2 - (x1 - x) * (h - 4) / 12 : y - h + 2)}" stroke="#8a6a46" stroke-width="1"/>`;
    l += `<line x1="${r(Math.max(x0, x))}" y1="${r(x < x0 ? y - h + 2 + (x0 - x) * (h - 4) / 12 : y - h + 2)}" x2="${r(Math.min(x1, x + 12))}" y2="${r(x + 12 > x1 ? y - h + 2 + (x1 - x) * (h - 4) / 12 : y - 2)}" stroke="#7a5a3a" stroke-width="1"/>`;
  }
  k += l;
  /* Querriegel mit Schneehaube */
  k += `<rect x="${x0}" y="${r(y - h + 1)}" width="${x1 - x0}" height="1.4" fill="#6e4f33"/>`;
  k += `<path d="M${x0} ${r(y - h + 1)} Q${(x0 + x1) / 2} ${r(y - h - 1.6)} ${x1} ${r(y - h + 1)} Z" fill="#ffffff"/>`;
  /* Schneewall davor (vom Räumen) */
  k += `<path d="M${x0} ${y + 1} Q20 ${y - 6} 50 ${y - 3} Q90 ${y - 7} 120 ${y - 3} Q140 ${y - 5} ${x1 + 2} ${y + 1} Z" fill="${SCHNEE}"/>`;
  k += `<path d="M${x0} ${y + 1} Q60 ${y - 1} ${x1 + 2} ${y + 1}" stroke="#c8d5e3" stroke-width=".8" fill="none"/>`;
  S.teil({ id: "zaun", de: "der Zaun", syl: "ZAUN", it: "la recinzione", itSyl: "re-cin-ZIO-ne", en: "fence", x: 74, y, steht: true, kunst: um(74, y, k) });
}

/* =====================================================================
   8 — DER SCHNEEMANN (Lupe: Möhre, Besen, Topf)
   ===================================================================== */
{
  const x = 214, y = 142, sk = s(y);              // 29 je Meter
  const unter = [];
  const R1 = 0.36 * sk, R2 = 0.26 * sk, R3 = 0.18 * sk;
  const c1 = y - R1 * 0.9, c2 = c1 - R1 - R2 * 0.7, c3 = c2 - R2 - R3 * 0.75;
  const KUGEL = S.rg("kugel", [[0, "#ffffff"], [0.65, "#eef3f8"], [1, "#c7d5e4"]], 0.38, 0.32, 0.75);
  let k = schatten(x + 4, y, R1 * 1.3, 2, 0.22);
  /* Besen hinter dem rechten Arm */
  k += `<line x1="${r(x + R2 * 1.6)}" y1="${r(y - 2)}" x2="${r(x + R2 * 0.6)}" y2="${r(c3 - R3 * 0.4)}" stroke="#7a5230" stroke-width="1"/>`;
  k += `<path d="M${r(x + R2 * 0.6 - 2.4)} ${r(c3 - R3 * 0.4)} L${r(x + R2 * 0.6)} ${r(c3 - R3 * 0.4 + 2)} L${r(x + R2 * 0.6 + 2.6)} ${r(c3 - R3 * 0.4 - 0.6)} L${r(x + R2 * 0.6 + 1.4)} ${r(c3 - R3 * 0.4 - 9)} L${r(x + R2 * 0.6 - 3)} ${r(c3 - R3 * 0.4 - 8)} Z" fill="#b58a4a"/>`;
  for (let i = 0; i < 6; i++) k += `<line x1="${r(x + R2 * 0.6 - 0.4 + i * 0.1)}" y1="${r(c3 - R3 * 0.4)}" x2="${r(x + R2 * 0.6 - 2.6 + i * 0.8)}" y2="${r(c3 - R3 * 0.4 - 8.4)}" stroke="#8e6630" stroke-width=".25"/>`;
  k += `<path d="M${r(x + R2 * 0.6 - 2.4)} ${r(c3 - R3 * 0.4 - 1.6)} L${r(x + R2 * 0.6 + 2.2)} ${r(c3 - R3 * 0.4 - 2.4)}" stroke="#5a3e1e" stroke-width=".5"/>`;
  unter.push({ id: "besen", de: "der Besen", syl: "BE-sen", it: "la scopa", itSyl: "SCO-pa", en: "broom", x: x + R2 * 0.6 + 0.4, y: c3 - R3 * 0.4 + 2, kunst: flaeche(-3.6, -11, 7, 11) });
  /* drei Kugeln */
  k += `<circle cx="${x}" cy="${r(c1)}" r="${r(R1)}" fill="${KUGEL}"/><circle cx="${x}" cy="${r(c2)}" r="${r(R2)}" fill="${KUGEL}"/><circle cx="${x}" cy="${r(c3)}" r="${r(R3)}" fill="${KUGEL}"/>`;
  k += `<path d="M${r(x - R1)} ${r(c1 + 1)} Q${x} ${r(c1 + R1 * 0.7)} ${r(x + R1)} ${r(c1 + 1)}" stroke="#c3d1e0" stroke-width=".8" fill="none" opacity=".6"/>`;
  /* Arme aus Zweigen */
  k += `<path d="M${r(x - R2 * 0.8)} ${r(c2 - 1)} L${r(x - R2 * 2.4)} ${r(c2 - 6)} M${r(x - R2 * 1.9)} ${r(c2 - 4.4)} l-1.4 -2.4 M${r(x - R2 * 2.1)} ${r(c2 - 5)} l-2 .2" stroke="#5a3e24" stroke-width=".6" fill="none" stroke-linecap="round"/>`;
  /* Kohleknöpfe und Kohleaugen, Mund */
  for (let i = 0; i < 3; i++) k += `<circle cx="${x - 0.4}" cy="${r(c2 - R2 * 0.5 + i * R2 * 0.5)}" r=".8" fill="#26282a"/>`;
  k += `<circle cx="${r(x - R3 * 0.45)}" cy="${r(c3 - R3 * 0.25)}" r=".7" fill="#1d1f21"/><circle cx="${r(x + R3 * 0.3)}" cy="${r(c3 - R3 * 0.25)}" r=".7" fill="#1d1f21"/>`;
  for (let i = 0; i < 5; i++) { const a = Math.PI * (0.25 + i * 0.125); k += `<circle cx="${r(x - 0.4 + Math.cos(a) * R3 * 0.55)}" cy="${r(c3 + Math.sin(a) * R3 * 0.42)}" r=".35" fill="#2a2c2e"/>`; }
  /* Möhrennase */
  k += `<path d="M${r(x - 0.6)} ${r(c3 - 0.6)} L${r(x - 7.2)} ${r(c3 + 0.4)} L${r(x - 0.6)} ${r(c3 + 0.9)} Z" fill="${S.lg("moehre", [[0, "#f39a2a"], [1, "#d7651a"]])}"/>`;
  k += `<path d="M${r(x - 3)} ${r(c3 - 0.1)} l.3 .6 M${r(x - 4.8)} ${r(c3 + 0.1)} l.3 .5" stroke="#b9561a" stroke-width=".2"/>`;
  unter.push({ id: "moehre", de: "die Möhre", syl: "MÖH-re", it: "la carota", itSyl: "ca-RO-ta", en: "carrot", x: x - 4, y: c3 + 1.6, kunst: flaeche(-4, -3.2, 8, 3.6),
    tipp: "Die Möhre ist die Nase vom Schneemann." });
  /* alter Kochtopf als Hut */
  const ty = c3 - R3 * 0.75;
  k += `<path d="M${r(x - R3 * 0.95)} ${r(ty)} L${r(x - R3 * 0.8)} ${r(ty - R3 * 1.1)} L${r(x + R3 * 0.8)} ${r(ty - R3 * 1.1)} L${r(x + R3 * 0.95)} ${r(ty)} Z" fill="${S.lg("topf", [[0, "#5c6b7a"], [0.4, "#a8b4bf"], [1, "#4a5562"]], 0, 0, 1, 0)}" transform="rotate(-8 ${x} ${r(ty)})"/>`;
  k += `<rect x="${r(x - R3 * 1.05)}" y="${r(ty - 0.6)}" width="${r(R3 * 2.1)}" height="1" rx=".4" fill="#3e4954" transform="rotate(-8 ${x} ${r(ty)})"/>`;
  k += `<path d="M${r(x + R3 * 0.8)} ${r(ty - R3 * 0.8)} h2.4" stroke="#2c343c" stroke-width=".8" transform="rotate(-8 ${x} ${r(ty)})"/>`;
  k += `<path d="M${r(x - R3 * 0.8)} ${r(ty - R3 * 1.1)} Q${x} ${r(ty - R3 * 1.5)} ${r(x + R3 * 0.8)} ${r(ty - R3 * 1.1)} Z" fill="#ffffff" transform="rotate(-8 ${x} ${r(ty)})"/>`;
  unter.push({ id: "topf", de: "der Topf", syl: "TOPF", it: "la pentola", itSyl: "PEN-to-la", en: "pot", x, y: ty + 0.6, kunst: flaeche(-R3 - 1, -R3 * 1.4, R3 * 2 + 3, R3 * 1.5),
    tipp: "Ein alter Kochtopf ist der Hut vom Schneemann." });
  S.teil({ id: "schneemann", de: "der Schneemann", syl: "SCHNEE-mann", it: "il pupazzo di neve", itSyl: "pu-PAZ-zo di NE-ve", en: "snowman", x, y, steht: true, kunst: um(x, y, k),
    zoom: { x: x - 27, y: r(ty - 12), w: 54, h: 36 }, unter });
}

/* =====================================================================
   9 — DIE LATERNE (Straßenlaterne am Gehweg)
   ===================================================================== */
{
  const x = 168, y = 160, sk = s(y);              // 36 je Meter
  const h = 3.4 * sk;
  let k = schatten(x, y + 0.5, 5, 1, 0.25);
  k += `<path d="M${x - 2.4} ${y} L${x - 1.6} ${y - 8} L${x + 1.6} ${y - 8} L${x + 2.4} ${y} Z" fill="#26332d"/>`;
  k += `<rect x="${x - 0.9}" y="${r(y - h + 8)}" width="1.8" height="${r(h - 16)}" fill="${S.lg("mast", [[0, "#3a4a42"], [0.4, "#5d7066"], [1, "#24302a"]], 0, 0, 1, 0)}"/>`;
  /* sechseckige Leuchte mit Schneehaube */
  const ly = y - h + 8;
  k += `<path d="M${x - 2.4} ${r(ly)} L${x + 2.4} ${r(ly)} L${x + 4.6} ${r(ly - 9)} L${x - 4.6} ${r(ly - 9)} Z" fill="${S.lg("lampenglas", [[0, "#fff6d6"], [1, "#f6dc92"]])}" stroke="#26332d" stroke-width=".7"/>`;
  k += `<line x1="${x}" y1="${r(ly)}" x2="${x}" y2="${r(ly - 9)}" stroke="#26332d" stroke-width=".4"/>`;
  k += `<path d="M${x - 6} ${r(ly - 9)} L${x} ${r(ly - 13)} L${x + 6} ${r(ly - 9)} Z" fill="#26332d"/><path d="M${x - 5.6} ${r(ly - 9.6)} Q${x} ${r(ly - 15)} ${x + 5.6} ${r(ly - 9.6)} Q${x} ${r(ly - 11.4)} ${x - 5.6} ${r(ly - 9.6)} Z" fill="#ffffff"/>`;
  k += `<circle cx="${x}" cy="${r(ly - 14)}" r=".9" fill="#26332d"/>`;
  k += `<circle cx="${x}" cy="${r(ly - 4.6)}" r="9" fill="${S.rg("schein", [[0, "#fff1c0", 0.45], [1, "#fff1c0", 0]])}"/>`;
  S.teil({ id: "laterne", de: "die Laterne", syl: "la-TER-ne", it: "il lampione", itSyl: "lam-PIO-ne", en: "street lamp", x, y, steht: true, kunst: um(x, y, k) });
}

/* =====================================================================
   10 — DER GEHWEG (geräumt) und 11 — DAS STREUSALZ
   ===================================================================== */
{
  const P = "M0 156 L176 156 L194 202 L0 202 Z";
  let k = `<path d="${P}" fill="url(#${S.id("pflaster")})"/>`;
  k += `<path d="${P}" fill="${S.lg("gehweglicht", [[0, "#3a4250", 0.25], [1, "#ffffff", 0.08]])}"/>`;
  /* nasse Stellen und Schneereste */
  for (let i = 0; i < 14; i++) { const x = rnd() * 170, y = 160 + rnd() * 38; k += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(2 + rnd() * 5)}" ry="${r(0.5 + rnd() * 1)}" fill="${rnd() < 0.5 ? "#f2f6fa" : "#6c727a"}" opacity=".6"/>`; }
  /* Bordstein rechts und Schneehaufen vom Räumen */
  k += `<path d="M176 156 L194 202 L198 202 L180 156 Z" fill="#b9bcc0"/>`;
  k += `<path d="M170 157 Q182 146 194 152 Q206 150 214 160 Q222 176 226 202 L196 202 Z" fill="${SCHNEE}"/><path d="M182 160 Q196 158 206 166" stroke="#c9d6e4" stroke-width=".8" fill="none"/>`;
  S.teil({ id: "gehweg", de: "der Gehweg", syl: "GEH-weg", it: "il marciapiede", itSyl: "mar-cia-PIE-de", en: "pavement", x: 100, y: 200, kunst: um(100, 200, k),
    tipp: "Wer am Gehweg wohnt, muss im Winter Schnee räumen und streuen." });
}
{
  const x = 22, y = 184;
  let k = schatten(x + 1, y, 8, 1.2, 0.3);
  /* Eimer mit Streusalz und Handschaufel, daneben der Sack */
  k += `<path d="M${x + 4} ${y} L${x + 3} ${y - 12} Q${x + 9} ${y - 14} ${x + 15} ${y - 12} L${x + 14} ${y} Z" fill="${S.lg("sack", [[0, "#e9e4d6"], [1, "#c9c2b0"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${x + 4.4}" y="${y - 9}" width="9.6" height="4.4" fill="#2d6fb3"/><text x="${x + 9.2}" y="${y - 6.1}" font-size="1.8" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">STREUSALZ</text><text x="${x + 9.2}" y="${y - 3}" font-size="1.4" text-anchor="middle" fill="#2d6fb3" font-family="Arial">10 kg</text>`;
  k += `<path d="M${x - 6} ${y - 11} L${x + 4} ${y - 11} L${x + 3.2} ${y} L${x - 5.2} ${y} Z" fill="${S.lg("salzeimer", [[0, "#f2c430"], [0.5, "#e2a91a"], [1, "#a97a0e"]], 0, 0, 1, 0)}"/>`;
  k += `<ellipse cx="${x - 1}" cy="${y - 11}" rx="5" ry="1.2" fill="#8a6408"/><ellipse cx="${x - 1}" cy="${y - 11.2}" rx="4.4" ry=".9" fill="#f4f4f2"/>`;
  for (let i = 0; i < 10; i++) k += `<rect x="${r(x - 4.4 + rnd() * 8)}" y="${r(y - 11.8 + rnd() * 0.8)}" width=".5" height=".5" fill="#ffffff" stroke="#c9d3dc" stroke-width=".1"/>`;
  k += `<path d="M${x + 1} ${y - 11.6} L${x + 5} ${y - 16} L${x + 6.6} ${y - 15}" stroke="#5a6068" stroke-width=".8" fill="none"/><path d="M${x - 2} ${y - 10.6} L${x + 1.6} ${y - 12.6} L${x + 2.4} ${y - 11} Z" fill="#7d858e"/>`;
  k += `<path d="M${x - 5.6} ${y - 10.6} Q${x - 1} ${y - 18} ${x + 3.6} ${y - 10.6}" stroke="#333" stroke-width=".4" fill="none"/>`;
  /* gestreute Körner auf dem Weg */
  for (let i = 0; i < 18; i++) k += `<rect x="${r(x + 14 + rnd() * 30)}" y="${r(y - 2 + rnd() * 10)}" width=".45" height=".45" fill="#ffffff"/>`;
  S.teil({ id: "streusalz", de: "das Streusalz", syl: "STREU-salz", it: "il sale antighiaccio", itSyl: "SA-le an-ti-GHIAC-cio", en: "road salt", x, y, steht: true, kunst: um(x, y, k),
    tipp: "Salz taut das Eis auf. Viele Städte erlauben auf dem Gehweg aber nur Splitt oder Sand." });
}

/* =====================================================================
   12 — DIE FRAU (räumt den Gehweg) und 13 — DIE SCHNEESCHAUFEL
   ===================================================================== */
let SCHAUFEL = null;
{
  const x = 74, y = 192;
  const m = mensch({ id: "b20b_frau", geschlecht: "w", pose: "b20b_schippen", blick: 64, frisur: "zopf", haarfarbe: "dunkelbraun", haut: "hell",
    kleidung: { jacke: { stueck: "jacke", farbe: "gruen_d" }, oberteil: { stueck: "pullover", farbe: "creme" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "stiefel", farbe: "braun" },
      kopf: { stueck: "muetze", farbe: "rot" }, zubehoer: { stueck: "handschuhe", farbe: "schwarz" } } }, 1.66 * s(y));
  const hs = [m.z.handL, m.z.handR].map((h) => [h.x * m.k, h.y * m.k]);
  SCHAUFEL = { x, y, hs };
  S.teil({ id: "frau", de: "die Frau", syl: "FRAU", it: "la donna", itSyl: "DON-na", en: "woman", x, y, kunst: schatten(4, 0, 12, 1.6, 0.25) + m.svg,
    tipp: "Sie räumt den Schnee vom Gehweg." });
}
{
  const { x, y, hs } = SCHAUFEL;
  const hi = hs.sort((a, b) => a[1] - b[1]);       // obere und untere Hand
  const oben = [x + hi[0][0], y + hi[0][1]], unten = [x + hi[1][0], y + hi[1][1]];
  /* Stiel durch beide Hände bis zum Blatt auf dem Boden */
  const dx = unten[0] - oben[0], dy = unten[1] - oben[1], L = Math.hypot(dx, dy);
  const bx = oben[0] + dx / L * 62, by = Math.min(y + 2, oben[1] + dy / L * 62);
  let k = `<line x1="${r(oben[0] - dx / L * 4)}" y1="${r(oben[1] - dy / L * 4)}" x2="${r(bx)}" y2="${r(by - 2)}" stroke="${S.lg("stiel", [[0, "#c9a06a"], [1, "#9c7344"]], 0, 0, 1, 0)}" stroke-width="1.3" stroke-linecap="round"/>`;
  k += `<path d="M${r(oben[0] - dx / L * 4 - 2)} ${r(oben[1] - dy / L * 4)} h4" stroke="#2b2b2b" stroke-width="1.1" stroke-linecap="round"/>`;
  /* breites Kunststoffblatt (Schneeschieber), schiebt Schnee vor sich her */
  k += `<path d="M${r(bx - 3)} ${r(by - 5)} L${r(bx + 16)} ${r(by - 6)} L${r(bx + 17)} ${r(by + 1)} L${r(bx - 2)} ${r(by + 1.4)} Z" fill="${S.lg("blatt", [[0, "#3f86d6"], [1, "#1f5aa0"]])}"/>`;
  k += `<path d="M${r(bx - 2)} ${r(by + 1.4)} L${r(bx + 17)} ${r(by + 1)}" stroke="#c9ced3" stroke-width=".8"/>`;
  k += `<path d="M${r(bx + 2)} ${r(by - 6.6)} Q${r(bx + 9)} ${r(by - 12)} ${r(bx + 18)} ${r(by - 6.4)} L${r(bx + 17)} ${r(by - 5)} L${r(bx - 3)} ${r(by - 4.4)} Z" fill="${SCHNEE}"/>`;
  S.teil({ oben: true, id: "schneeschaufel", de: "die Schneeschaufel", syl: "SCHNEE-schau-fel", it: "la pala da neve", itSyl: "PA-la da NE-ve", en: "snow shovel", x: r(bx + 7), y: r(by + 1.4), kunst: um(bx + 7, by + 1.4, k) });
}

/* =====================================================================
   14 — DER SCHLITTEN (Davoser Holzschlitten)
   ===================================================================== */
{
  const x = 228, y = 188, sk = s(y);              // 47 je Meter
  const L = 1.0 * sk, H = 0.32 * sk;
  let k = schatten(x, y + 0.4, L * 0.55, 2, 0.25);
  /* Kufen mit Stahlband, vorn hochgebogen (Schrägansicht: hintere Kufe kürzer) */
  const kufe = (dy, dx, f) => `<path d="M${r(x - L / 2 + dx)} ${r(y + dy)} L${r(x + L / 2 - 6 + dx)} ${r(y + dy)} Q${r(x + L / 2 + 1 + dx)} ${r(y + dy)} ${r(x + L / 2 + 0.6 + dx)} ${r(y + dy - H * 0.9)}" stroke="${f}" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M${r(x - L / 2 + dx)} ${r(y + dy + 0.9)} L${r(x + L / 2 - 6 + dx)} ${r(y + dy + 0.9)} Q${r(x + L / 2 + 1.8 + dx)} ${r(y + dy + 0.9)} ${r(x + L / 2 + 1.6 + dx)} ${r(y + dy - H * 0.9)}" stroke="#5d6670" stroke-width=".6" fill="none"/>`;
  k += kufe(-3, 3, "#9c6a3a");
  /* Streben */
  for (const t of [0.12, 0.45, 0.78]) { const xx = x - L / 2 + t * L; k += `<line x1="${r(xx + 3)}" y1="${r(y - 3)}" x2="${r(xx + 3)}" y2="${r(y - H)}" stroke="#8a5a2c" stroke-width="1.4"/><line x1="${r(xx)}" y1="${r(y)}" x2="${r(xx)}" y2="${r(y - H + 2)}" stroke="#b07a42" stroke-width="1.6"/>`; }
  /* Sitzlatten */
  k += `<path d="M${r(x - L / 2 - 1)} ${r(y - H + 1)} L${r(x + L / 2 - 4)} ${r(y - H + 1)} L${r(x + L / 2 - 1)} ${r(y - H - 2)} L${r(x - L / 2 + 2)} ${r(y - H - 2)} Z" fill="${S.lg("latten", [[0, "#d9a466"], [1, "#b47a3e"]])}"/>`;
  for (let i = 1; i < 4; i++) k += `<line x1="${r(x - L / 2 - 1 + i * 0.75)}" y1="${r(y - H + 1 - i * 0.75)}" x2="${r(x + L / 2 - 4 + i * 0.75)}" y2="${r(y - H + 1 - i * 0.75)}" stroke="#8a5a2c" stroke-width=".3"/>`;
  k += kufe(0, 0, "#b07a42");
  /* Zugseil im Schnee */
  k += `<path d="M${r(x + L / 2 + 0.6)} ${r(y - H * 0.9)} Q${r(x + L / 2 + 8)} ${r(y + 3)} ${r(x + L / 2 + 16)} ${r(y + 1)}" stroke="#c33b2e" stroke-width=".6" fill="none"/>`;
  S.teil({ id: "schlitten", de: "der Schlitten", syl: "SCHLIT-ten", it: "la slitta", itSyl: "SLIT-ta", en: "sledge", x, y, steht: true, kunst: um(x, y, k),
    tipp: "Ein Holzschlitten mit Kufen aus Stahl — so gleitet er gut über den Schnee." });
}

/* =====================================================================
   15 — DER JUNGE (Lupe: Mütze, Schal, Handschuh) und 16 — DER SCHNEEBALL
   ===================================================================== */
let BALL = null;
{
  const x = 280, y = 184;
  const m = mensch({ id: "b20b_junge", alter: "kind", geschlecht: "m", pose: "werfen", blick: -36, frisur: "kurz", haarfarbe: "braun", haut: "hell", laecheln: true,
    kleidung: { jacke: { stueck: "jacke", farbe: "rot" }, oberteil: { stueck: "pullover", farbe: "blau" }, unterteil: { stueck: "hose", farbe: "blau" }, schuhe: { stueck: "stiefel", farbe: "schwarz" },
      kopf: { stueck: "muetze", farbe: "gelb" }, zubehoer: { stueck: "schal", farbe: "gruen" } } }, 1.34 * s(y));
  const K = m.k, z = m.z;
  /* Fäustlinge über beide Hände (dunkelblau, gestrickt) */
  let hand = "";
  for (const h of [z.handL, z.handR]) {
    const hx = h.x * K, hy = h.y * K;
    hand += `<ellipse cx="${r(hx)}" cy="${r(hy)}" rx="2.2" ry="2.6" fill="${S.lg("faust", [[0, "#3a5fa0"], [1, "#22406f"]])}"/><ellipse cx="${r(hx - 1.4)}" cy="${r(hy - 0.4)}" rx=".9" ry="1.2" fill="#2c4f88"/><rect x="${r(hx - 1.9)}" y="${r(hy + 1.6)}" width="3.8" height="1.4" rx=".5" fill="#f4f1ea"/>`;
  }
  const kp = z.kopf, hl = z.mass.halsH;
  const unter = [
    { id: "muetze", de: "die Mütze", syl: "MÜT-ze", it: "il berretto", itSyl: "ber-RET-to", en: "hat", x: kp.x * K, y: (kp.y - 4) * K, kunst: flaeche(-6, -9, 12, 9) },
    { id: "schal", de: "der Schal", syl: "SCHAL", it: "la sciarpa", itSyl: "SCIAR-pa", en: "scarf", x: kp.x * K - 1, y: -hl * K + 9, kunst: flaeche(-6, -10, 12, 10) },
    { id: "handschuh", de: "der Handschuh", syl: "HAND-schuh", it: "il guanto", itSyl: "GUAN-to", en: "glove", x: z.handL.x * K, y: z.handL.y * K + 3.4, kunst: flaeche(-3.6, -6.6, 7.2, 7),
      tipp: "Ein Fäustling: Nur der Daumen hat einen eigenen Platz." },
  ].map((u) => Object.assign(u, { x: x + u.x, y: y + u.y }));
  BALL = [x + z.handR.x * K, y + z.handR.y * K];
  S.teil({ id: "junge", de: "der Junge", syl: "JUN-ge", it: "il ragazzo", itSyl: "ra-GAZ-zo", en: "boy", x, y, kunst: schatten(0, 0, 10, 1.4, 0.25) + m.svg + hand,
    zoom: { x: x - 30, y: r(y - 64), w: 54, h: 36 }, unter,
    tipp: "Er trägt Mütze, Schal und Handschuhe — und wirft gleich einen Schneeball." });
}
{
  const [x, y] = BALL, R = 2.8;
  let k = `<circle cx="${r(x)}" cy="${r(y - 2.4)}" r="${R}" fill="${S.rg("ball", [[0, "#ffffff"], [0.7, "#eef3f8"], [1, "#bfcfe0"]], 0.38, 0.32, 0.75)}"/>`;
  k += `<circle cx="${r(x + 0.8)}" cy="${r(y - 1.6)}" r=".5" fill="#d5e0ec"/><circle cx="${r(x - 1)}" cy="${r(y - 1.4)}" r=".35" fill="#d5e0ec"/>`;
  S.teil({ oben: true, id: "schneeball", de: "der Schneeball", syl: "SCHNEE-ball", it: "la palla di neve", itSyl: "PAL-la di NE-ve", en: "snowball", x: r(x), y: r(y + R - 2), kunst: um(x, y + R - 2, k) });
}

/* Leichter Schneefall über allem */
{
  let f = "";
  for (let i = 0; i < 110; i++) { const x = rnd() * 320, y = rnd() * 200, rr = 0.25 + rnd() * (y / 200) * 0.9; f += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(rr)}" fill="#ffffff" opacity="${r(0.5 + rnd() * 0.45)}"/>`; }
  S.davor(f);
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/winter.js"));
console.log(aus);
