#!/usr/bin/env node
/* =====================================================================
   AACHEN (FASSUNG 854) — Bilderwelt neu: eine echte Stadtansicht
   ---------------------------------------------------------------------
   XANDER (03.10.): „die bekannten Sehenswürdigkeiten … mit Recherche zu
   den einzelnen Städten in Deutschland … auf Hollywood-Niveau“.

   RECHERCHE (aachen.de „Karls Liebling“, aachen-tourismus.de „Karlsbrunnen“/
   „Rathaus“/„Aachener Dom“, KuLaDig „Katschhof“, Lonely Planet „Rathaus“,
   Aachener Kunstblätter zur Figurengruppe am Rathaus):
   - STANDORT: der Markt, nordöstlicher Teil, Blick nach Süd-Südwest auf
     die Nordfassade des Rathauses. Echte Richtungen von hier: links
     (Osten) der Granusturm, rechts (Westen) der Marktturm; vor dem
     Rathaus rechts der Karlsbrunnen. Der Dom steht 100 m weiter südlich
     hinter dem Rathaus; von hier sieht man links am Granusturm vorbei über
     die niedrigen Häuser (Postwagen) seine gotische Chorhalle und das
     Oktogon. Wie in der Anleitung erlaubt, ist der Dom etwas überhöht
     (wie mit Teleobjektiv), damit man ihn erkennt; der Westturm steht
     von hier genau hinter dem Granusturm und ist verdeckt.
   - RATHAUS: um 1330–1350 gotisch auf den Grundmauern der Königshalle
     (Aula regia) Karls des Großen gebaut. Links (Osten) der karolingische
     GRANUSTURM (quadratisch, unten altes Bruchsteinmauerwerk, später
     aufgestockt), rechts (Westen) der halbrunde MARKTTURM. Die Turmhelme
     entwarf Leo Hugot 1977–79 neu nach barocken Vorbildern. An der
     Marktfassade stehen 50 Figuren deutscher Herrscher (31 davon in
     Aachen gekrönt) unter Baldachinen zwischen den hohen Fenstern des
     Krönungssaals; in der Mitte die barocke Freitreppe. Steiles
     Schieferdach mit Gauben.
   - KARLSBRUNNEN (1620, ältester noch sprudelnder Brunnen der Stadt):
     großes Becken aus Blaustein (Rokoko, J. J. Couven), in der Mitte die
     sechs Tonnen schwere Bronzeschale — die Öcher sagen „Karl in de
     Eäzekomp“ (Erbsenschüssel) —, darüber Karl der Große mit Krone,
     Zepter und Reichsapfel (seit 2014 eine Kopie, das Original steht im
     Krönungssaal).
   - DOM: Pfalzkapelle Karls des Großen (um 800), das karolingische
     OKTOGON mit sechzehneckigem Umgang und dem Faltdach (1656) mit
     Laterne; östlich die gotische CHORHALLE (geweiht 1414) mit den über
     25 m hohen Fenstern — die Aachener nennen sie „Glashaus“. Erstes
     deutsches UNESCO-Welterbe (1978).
   - TYPISCH: Aachener Printen (harte, würzige Lebkuchen-Schnitten, mit
     Kandis, auch mit Schokolade); Öcher Platt („Oche“ = Aachen, „Öcher“ =
     Aachener, „Oche Alaaf!“ im Karneval); die Häuser am Markt aus Backstein
     mit Fensterrahmen aus grauem Blaustein; Tauben auf dem Pflaster.
     Elisenbrunnen (Thermalwasser, riecht nach Schwefel) und Puppenbrunnen
     liegen hinter den Häusern — der Wegweiser zeigt hin, ebenso zum
     Dreiländereck (Deutschland, Niederlande, Belgien).
   Maßstab: Augenhöhe y = 136 (1,7 m). Am Boden gilt:
   Einheiten je Meter = (y − 136) / 1,7. Rathaus ≈ 2,5 Einheiten je Meter.
   Licht: Sommerabend, die Sonne steht im Westnordwesten (rechts hinter
   uns) und färbt die Nordfassade golden.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "aachen", titel: "Aachen", emoji: "⛪", thema: "Deutschland", kuerzel: "aac", fassung: 854 });
const rnd = zufall(814);
const r = B.r;
const HOR = 136, AUGE = 1.7;
const km = (y) => (y - HOR) / AUGE;

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("wolke")}" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="2.2"/></filter>`);
S.def(`<filter id="${S.id("dunst")}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation=".3"/></filter>`);
const STEIN = S.lg("stein", [[0, "#8a8070"], [0.5, "#a89d88"], [1, "#b9ae97"]], 0, 0, 1, 0);
const STEIN_H = S.lg("steinh", [[0, "#c7bca6"], [1, "#e2d8c2"]]);
const BLAUSTEIN = S.lg("blaustein", [[0, "#6a7076"], [0.5, "#8b9298"], [1, "#5f656b"]], 0, 0, 1, 0);
const SCHIEFER = S.lg("schiefer", [[0, "#2e353c"], [0.6, "#4a545e"], [1, "#68737e"]], 0, 0, 1, 0);
const DACH = S.lg("dach", [[0, "#3a434c"], [1, "#58636e"]]);
const GOLD = S.lg("gold", [[0, "#fff1a8"], [0.4, "#f1c74a"], [1, "#a8781a"]], 0, 0, 1, 1);
const BRONZE = S.lg("bronze", [[0, "#3e5a4c"], [0.45, "#6f927d"], [0.75, "#9cb8a2"], [1, "#4b6a5a"]], 0, 0, 1, 0);
const DOMSTEIN = S.lg("domstein", [[0, "#9c9381"], [0.5, "#c9bfa9"], [1, "#a99f8b"]], 0, 0, 1, 0);
const ABEND = S.lg("abend", [[0, "#fff1c8", 0], [0.6, "#ffe2a0", 0.08], [1, "#ffd27a", 0.22]], 0, 0, 1, 0);

/* =====================================================================
   KULISSE — Abendhimmel, Häuser am Markt, Pflaster
   ===================================================================== */
S.hinten(`<rect width="320" height="${HOR + 4}" fill="${S.lg("himmel", [[0, "#6e9cce"], [0.55, "#a9c6e2"], [0.85, "#e9dcc4"], [1, "#f4dcb2"]])}"/>`);
S.hinten(`<circle cx="330" cy="70" r="90" fill="${S.rg("sonne", [[0, "#fff1c8", 0.6], [0.4, "#ffe6b0", 0.22], [1, "#ffe6b0", 0]])}"/>`);
{
  let w = "";
  for (const [x, y, s] of [[160, 18, 0.9], [262, 30, 1.1], [40, 12, 0.7], [118, 44, 0.55]]) {
    w += `<g filter="url(#${S.id("wolke")})" opacity=".92">`;
    for (const [dx, dy, rx, ry] of [[0, 0, 16, 5], [-10, 1.5, 10, 4], [11, 1, 12, 4.5], [-3, -3.5, 9, 5], [6, -4.4, 7, 4.5]])
      w += `<ellipse cx="${r(x + dx * s)}" cy="${r(y + dy * s)}" rx="${r(rx * s)}" ry="${r(ry * s)}" fill="#fffaf0"/>`;
    w += `<ellipse cx="${x}" cy="${r(y + 3 * s)}" rx="${r(18 * s)}" ry="${r(2.2 * s)}" fill="#f0dcc0"/></g>`;
  }
  S.hinten(w);
}
/* Markt-Pflaster (Kopfsteinpflaster) in Fluchtperspektive — liegt in der Kulisse unter allem */
{
  let f = `<rect x="0" y="${HOR}" width="320" height="${200 - HOR}" fill="${S.lg("pflaster", [[0, "#a59a88"], [0.4, "#968b79"], [1, "#857a69"]])}"/>`;
  /* Pflasterreihen: quer, nach vorn weiter auseinander */
  for (let d = 4; d < 140; d *= 1.045) { const y = HOR + AUGE * 228 / d; if (y > 200) continue; f += `<line x1="0" y1="${r(y)}" x2="320" y2="${r(y)}" stroke="#6f6556" stroke-width="${r(Math.min(0.45, 0.06 + (y - HOR) * 0.006))}" opacity=".55"/>`; }
  /* Kopfsteinpflaster vorn: Reihen aus Steinen (je Reihe eine gestrichelte Linie), gewölbt mit Lichtkante */
  for (let d = 6.0, i = 0; d < 13.6; d += 0.17, i++) {
    const y0 = HOR + AUGE * 228 / d, y1 = HOR + AUGE * 228 / (d + 0.17), h = y0 - y1, ym = (y0 + y1) / 2, k1 = km(ym);
    if (y1 > 200) continue;
    const st = 0.16 * k1, gap = 0.035 * k1, off = r((i * 37 % 10) / 10 * (st + gap));
    f += `<line x1="0" y1="${r(ym)}" x2="320" y2="${r(ym)}" stroke="${["#a39886", "#978c7a", "#ab9f8b"][i % 3]}" stroke-width="${r(h * 0.82)}" stroke-dasharray="${r(st)} ${r(gap)}" stroke-dashoffset="${off}"/>`;
    f += `<line x1="0" y1="${r(ym - h * 0.22)}" x2="320" y2="${r(ym - h * 0.22)}" stroke="#d2c8b4" stroke-width="${r(h * 0.18)}" stroke-dasharray="${r(st * 0.6)} ${r(st * 0.4 + gap)}" stroke-dashoffset="${r(off - st * 0.2)}" opacity=".55"/>`;
  }
  for (let i = 0; i < 260; i++) {
    const y = HOR + 1 + rnd() * 29, s = km(y) * 0.11, x = rnd() * 320;
    f += `<rect x="${r(x)}" y="${r(y)}" width="${r(Math.max(0.5, s * 1.6))}" height="${r(Math.max(0.25, s * 0.6))}" rx="${r(s * 0.25)}" fill="${["#b3a894", "#8d8270", "#a0957f", "#bdb29c", "#7d7363"][i % 5]}" opacity=".5"/>`;
  }
  /* Rinne aus Blaustein quer über den Platz und Abendlicht */
  f += `<path d="M0 166 Q160 162.6 320 165.4" stroke="#5f656b" stroke-width="1.6" fill="none" opacity=".55"/>`;
  f += `<rect x="0" y="${HOR}" width="320" height="${200 - HOR}" fill="${S.lg("pflasterlicht", [[0, "#000", 0.12], [0.55, "#000", 0], [1, "#ffd99a", 0.14]], 0, 0, 1, 0)}"/>`;
  S.hinten(f);
}

/* =====================================================================
   1 — DIE TAUBE (drei Tauben auf dem Pflaster vor dem Brunnen)
   ===================================================================== */
{
  const taube = (x, y, s, rechts) => {
    const m = rechts ? 1 : -1;
    let g = `<ellipse cx="${x}" cy="${r(y + 0.15 * s)}" rx="${r(2.4 * s)}" ry="${r(0.4 * s)}" fill="#3b342b" opacity=".3"/>`;
    g += `<path d="M${r(x - 2.2 * s * m)} ${r(y - 1.2 * s)} Q${r(x - 0.4 * s * m)} ${r(y - 2.6 * s)} ${r(x + 1.2 * s * m)} ${r(y - 1.8 * s)} Q${r(x + 1.8 * s * m)} ${r(y - 0.6 * s)} ${r(x + 0.6 * s * m)} ${r(y - 0.2 * s)} L${r(x - 1.2 * s * m)} ${r(y - 0.4 * s)} L${r(x - 3 * s * m)} ${r(y - 0.8 * s)} Z" fill="${S.lg("taube", [[0, "#9aa0ad"], [1, "#6c7280"]])}"/>`;
    g += `<path d="M${r(x - 1.6 * s * m)} ${r(y - 1.5 * s)} Q${r(x)} ${r(y - 1.9 * s)} ${r(x + 0.6 * s * m)} ${r(y - 1.1 * s)}" stroke="#5a606c" stroke-width="${r(0.3 * s)}" fill="none"/>`;
    g += `<circle cx="${r(x + 1.3 * s * m)}" cy="${r(y - 2.4 * s)}" r="${r(0.7 * s)}" fill="#7c8290"/><path d="M${r(x + 0.9 * s * m)} ${r(y - 1.9 * s)} q${r(0.4 * s * m)} ${r(0.4 * s)} ${r(0.9 * s * m)} 0" stroke="#6f9c8a" stroke-width="${r(0.35 * s)}" fill="none"/>`;
    g += `<path d="M${r(x + 1.9 * s * m)} ${r(y - 2.5 * s)} l${r(0.5 * s * m)} ${r(0.2 * s)}" stroke="#d9a07a" stroke-width="${r(0.2 * s)}"/><circle cx="${r(x + 1.5 * s * m)}" cy="${r(y - 2.6 * s)}" r="${r(0.12 * s)}" fill="#c0392b"/>`;
    g += `<path d="M${r(x)} ${r(y - 0.3 * s)} l0 ${r(0.4 * s)} M${r(x + 0.4 * s * m)} ${r(y - 0.3 * s)} l0 ${r(0.4 * s)}" stroke="#c0605a" stroke-width="${r(0.15 * s)}"/>`;
    return g;
  };
  const k = taube(0, 0, 1.2, true) + taube(9, 2.4, 1.3, false) + taube(-8, 3.2, 1.35, true);
  S.teil({ oben: true, id: "taube", de: "die Taube", syl: "TAU-be", it: "il piccione", itSyl: "pic-CIO-ne", en: "pigeon", x: 164, y: 168, kunst: k });
}

/* =====================================================================
   2 — DER AACHENER DOM (links hinter dem Rathaus) — Lupe: Fenster, Kuppel
   ===================================================================== */
const DOM = { x: 4, y: 137, u: 1.45 };
{
  const u = DOM.u, H = (m) => r(-m * u);
  let k = "";
  /* Chorhalle („Glashaus“): steile Wand aus hohen Fenstern zwischen Strebepfeilern */
  const CX0 = 0, CX1 = 44;
  k += `<path d="M${CX0} 0 L${CX0} ${H(33)} L${CX1} ${H(33)} L${CX1} 0 Z" fill="${DOMSTEIN}"/>`;
  /* Dach der Chorhalle mit Firstkamm und Dachreiter */
  k += `<path d="M${CX0 - 1} ${H(33)} L${CX0 + 5} ${H(48)} L${CX1 - 3} ${H(48)} L${CX1 + 1.5} ${H(33)} Z" fill="${DACH}"/>`;
  for (let i = 1; i < 6; i++) k += `<line x1="${r(CX0 + i * 0.9)}" y1="${H(33 + i * 2.5)}" x2="${r(CX1 - i * 0.6)}" y2="${H(33 + i * 2.5)}" stroke="#2a3138" stroke-width=".15" opacity=".6"/>`;
  k += `<path d="M${CX0 + 5} ${H(48)} L${CX1 - 3} ${H(48)}" stroke="#c8a24a" stroke-width=".4"/>`;
  /* Fenster: drei Joche sichtbar, je ein riesiges Maßwerkfenster */
  const joch = [[2.2, 12.6], [16.2, 26.6], [30.2, 40.6]];
  for (const [a, b] of joch) {
    const m = (a + b) / 2, w = b - a;
    k += `<path d="M${a} ${H(4)} L${a} ${H(26.5)} Q${a} ${H(31)} ${r(m)} ${H(32)} Q${b} ${H(31)} ${b} ${H(26.5)} L${b} ${H(4)} Z" fill="${S.lg("glas", [[0, "#6f8fa6"], [0.4, "#3c5568"], [0.7, "#8aa3b4"], [1, "#2f4252"]], 0, 0, 1, 0)}"/>`;
    for (let i = 1; i < 4; i++) k += `<line x1="${r(a + i * w / 4)}" y1="${H(4)}" x2="${r(a + i * w / 4)}" y2="${H(27.5)}" stroke="#cfc5b0" stroke-width=".35"/>`;
    for (let h = 9; h < 27; h += 4.5) k += `<line x1="${a}" y1="${H(h)}" x2="${b}" y2="${H(h)}" stroke="#cfc5b0" stroke-width=".25"/>`;
    k += `<circle cx="${r(m)}" cy="${H(29.2)}" r="${r(w * 0.2)}" fill="none" stroke="#cfc5b0" stroke-width=".35"/>`;
    /* Spiegelung des Abendhimmels im Glas */
    k += `<path d="M${r(a + 0.6)} ${H(12)} L${r(a + w * 0.45)} ${H(24)} L${r(a + w * 0.7)} ${H(24)} L${r(a + 2)} ${H(12)} Z" fill="#ffe2b0" opacity=".25"/>`;
    /* Wimperg (Ziergiebel) über dem Fenster */
    k += `<path d="M${r(a - 0.4)} ${H(32.4)} L${r(m)} ${H(38.5)} L${r(b + 0.4)} ${H(32.4)}" stroke="#b7ad98" stroke-width=".7" fill="none"/><path d="M${r(m - 0.4)} ${H(38.5)} L${r(m)} ${H(40)} L${r(m + 0.4)} ${H(38.5)} Z" fill="#b7ad98"/>`;
  }
  /* Strebepfeiler mit Fialen */
  for (const x of [0, 14.4, 28.4, 42.4]) {
    k += `<path d="M${x - 0.6} 0 L${x - 0.6} ${H(33)} L${x + 2.2} ${H(33)} L${x + 2.2} 0 Z" fill="${S.lg("strebe", [[0, "#8f8674"], [1, "#d3c9b3"]], 0, 0, 1, 0)}"/>`;
    k += `<path d="M${x - 0.4} ${H(33)} L${x + 0.8} ${H(41)} L${x + 2} ${H(33)} Z" fill="#c2b8a3"/><circle cx="${x + 0.8}" cy="${H(41.4)}" r=".35" fill="#c2b8a3"/>`;
    for (let i = 1; i < 4; i++) k += `<circle cx="${r(x + 0.8 + (i % 2 ? -0.7 : 0.7) * (1 - i / 4))}" cy="${H(33 + i * 2)}" r=".25" fill="#c2b8a3"/>`;
  }
  /* Oktogon: sechzehneckiger Umgang, Tambour mit Rundbogenfenstern, Faltdach, Laterne */
  const OX = 60, OW = 15;
  k += `<path d="M${OX - OW - 4} 0 L${OX - OW - 4} ${H(20)} L${OX + OW + 4} ${H(20)} L${OX + OW + 4} 0 Z" fill="${DOMSTEIN}"/>`;
  for (let i = 0; i < 6; i++) { const x0 = OX - OW - 4 + i * (2 * OW + 8) / 6, x1 = x0 + (2 * OW + 8) / 6; k += `<path d="M${r(x0)} ${H(20)} L${r((x0 + x1) / 2)} ${H(23.5)} L${r(x1)} ${H(20)} Z" fill="${SCHIEFER}"/>`; }
  /* Tambour: drei Seiten des Achtecks sichtbar */
  k += `<path d="M${OX - OW} ${H(20)} L${OX - OW} ${H(34)} L${OX - OW * 0.42} ${H(34.6)} L${OX + OW * 0.42} ${H(34.6)} L${OX + OW} ${H(34)} L${OX + OW} ${H(20)} Z" fill="${S.lg("tambour", [[0, "#9e9582"], [0.35, "#c9bfa9"], [0.65, "#ddd3bd"], [1, "#b3a994"]], 0, 0, 1, 0)}"/>`;
  k += `<line x1="${OX - OW * 0.42}" y1="${H(20)}" x2="${OX - OW * 0.42}" y2="${H(34.6)}" stroke="#8f8674" stroke-width=".4"/><line x1="${OX + OW * 0.42}" y1="${H(20)}" x2="${OX + OW * 0.42}" y2="${H(34.6)}" stroke="#8f8674" stroke-width=".4"/>`;
  for (const x of [OX - OW * 0.72, OX, OX + OW * 0.72]) k += `<path d="M${r(x - 1.6)} ${H(24)} L${r(x - 1.6)} ${H(29.5)} A1.6 1.6 0 0 1 ${r(x + 1.6)} ${H(29.5)} L${r(x + 1.6)} ${H(24)} Z" fill="#33414c"/>`;
  /* das Faltdach: acht Giebel am Fuß, darüber die gefaltete Kuppel */
  const gieb = [OX - OW, OX - OW * 0.42, OX + OW * 0.42, OX + OW];
  for (let i = 0; i < 3; i++) k += `<path d="M${r(gieb[i])} ${H(34.6)} L${r((gieb[i] + gieb[i + 1]) / 2)} ${H(38.6)} L${r(gieb[i + 1])} ${H(34.6)} Z" fill="${i === 1 ? "#5d6874" : "#46505a"}"/>`;
  k += `<path d="M${OX - OW + 0.6} ${H(36.4)} Q${OX - OW * 0.6} ${H(46)} ${OX} ${H(47.6)} Q${OX + OW * 0.6} ${H(46)} ${OX + OW - 0.6} ${H(36.4)} L${r((gieb[2] + gieb[3]) / 2)} ${H(38.6)} L${OX} ${H(36.8)} L${r((gieb[0] + gieb[1]) / 2)} ${H(38.6)} Z" fill="${S.lg("kuppel", [[0, "#2f3840"], [0.55, "#56626e"], [1, "#7d8995"]], 0, 0, 1, 0)}"/>`;
  for (const t of [-0.66, -0.33, 0, 0.33, 0.66]) k += `<path d="M${r(OX + t * OW * 0.9)} ${H(38)} Q${r(OX + t * OW * 0.62)} ${H(45)} ${OX} ${H(47.4)}" stroke="${t > 0 ? "#8e99a4" : "#262d33"}" stroke-width=".35" fill="none"/>`;
  /* Laterne mit Kugel und Kreuz */
  k += `<rect x="${OX - 1.6}" y="${H(51)}" width="3.2" height="${r(3.6 * u)}" fill="#46505a"/><rect x="${OX - 0.8}" y="${H(50.4)}" width="1.6" height="${r(2 * u)}" fill="#e9d7a6" opacity=".7"/>`;
  k += `<path d="M${OX - 2} ${H(51)} Q${OX} ${H(54.5)} ${OX + 2} ${H(51)} Z" fill="#46505a"/><circle cx="${OX}" cy="${H(55)}" r=".7" fill="${GOLD}"/><path d="M${OX} ${H(55.4)} L${OX} ${H(58.6)} M${OX - 1} ${H(57.4)} L${OX + 1} ${H(57.4)}" stroke="#d9b24a" stroke-width=".4"/>`;
  /* Abendlicht von rechts */
  k += `<rect x="0" y="${H(33)}" width="${CX1 + 2}" height="${r(33 * u)}" fill="${ABEND}"/><rect x="${OX - OW}" y="${H(34.6)}" width="${2 * OW}" height="${r(34.6 * u)}" fill="${ABEND}"/>`;
  S.teil({ id: "dom", de: "der Aachener Dom", syl: "AA-che-ner DOM", it: "il Duomo di Aquisgrana", itSyl: "DUO-mo di a-qui-SGRA-na", en: "Aachen Cathedral",
    x: DOM.x, y: DOM.y, kunst: k, tipp: "Karl der Große hat den Dom um das Jahr 800 bauen lassen. Er war das erste Welterbe in Deutschland.",
    zoom: { x: 0, y: 46, w: 87, h: 58 },
    unter: [
      { id: "fenster", de: "das Fenster", syl: "FENS-ter", it: "la finestra", itSyl: "fi-NE-stra", en: "window", x: DOM.x + 21.4, y: DOM.y - 4 * DOM.u, kunst: flaeche(-5.2, -(28 * DOM.u), 10.4, 28 * DOM.u, 0.5),
        tipp: "Die Fenster der Chorhalle sind über 25 Meter hoch. Die Aachener nennen sie das „Glashaus“." },
      { id: "kuppel", de: "die Kuppel", syl: "KUP-pel", it: "la cupola", itSyl: "CU-po-la", en: "dome", x: DOM.x + OX, y: DOM.y - 34.6 * DOM.u, kunst: flaeche(-14.4, -(24 * DOM.u), 28.8, 24 * DOM.u, 1),
        tipp: "Unter der Kuppel liegt das achteckige Oktogon aus der Zeit Karls des Großen." },
    ] });
}

/* =====================================================================
   3 — DAS RATHAUS (Nordfassade am Markt) — Lupe: König, Freitreppe, Turm
   ===================================================================== */
/* Fassadenkoordinate m (Meter von Ost nach West) → Bildpunkt; die Fassade weicht nach rechts leicht zurück */
const RH = { x0: 74, basis: 137.4 };
const fs = (m) => 2.64 * (1 - 0.0027 * m);                       /* Einheiten je Meter an der Stelle m */
const fx = (m) => r(RH.x0 + m * 2.62 * (1 - 0.00135 * m));
const fy = (m, h) => r(RH.basis - h * fs(m));
const FP = (m, h) => `${fx(m)} ${fy(m, h)}`;
/* barocker Turmhelm (Hugot 1977–79 nach alten Vorbildern): geschweifte Haube, offene Laterne, Zwiebel, Spitze */
const helm = (mm, h0, w0, spitze) => {
  const L = (w, h) => FP(mm - w, h), R = (w, h) => FP(mm + w, h);
  let g = `<path d="M${L(w0 + 0.5, h0)} L${R(w0 + 0.5, h0)} L${R(w0 + 0.5, h0 + 0.7)} L${L(w0 + 0.5, h0 + 0.7)} Z" fill="#d6ccb6"/>`;
  g += `<path d="M${L(w0, h0 + 0.7)} C${L(w0 + 0.2, h0 + 2.6)} ${L(1.2, h0 + 2.2)} ${L(1.5, h0 + 5.4)} L${R(1.5, h0 + 5.4)} C${R(1.2, h0 + 2.2)} ${R(w0 + 0.2, h0 + 2.6)} ${R(w0, h0 + 0.7)} Z" fill="${SCHIEFER}"/>`;
  g += `<path d="M${L(w0 * 0.55, h0 + 1.6)} C${L(w0 * 0.4, h0 + 3)} ${L(0.9, h0 + 3)} ${L(0.9, h0 + 5)}" stroke="#7b8792" stroke-width=".3" fill="none"/>`;
  g += `<path d="M${L(1.5, h0 + 5.4)} L${L(1.5, h0 + 8.8)} L${R(1.5, h0 + 8.8)} L${R(1.5, h0 + 5.4)} Z" fill="#3e4750"/>`;
  for (const d of [-0.85, 0.35]) g += `<path d="M${FP(mm + d, h0 + 5.9)} L${FP(mm + d, h0 + 7.9)} L${FP(mm + d + 0.5, h0 + 8.3)} L${FP(mm + d + 1, h0 + 7.9)} L${FP(mm + d + 1, h0 + 5.9)} Z" fill="#f0d79a" opacity=".7"/>`;
  g += `<path d="M${L(1.9, h0 + 8.8)} L${R(1.9, h0 + 8.8)} L${R(1.9, h0 + 9.2)} L${L(1.9, h0 + 9.2)} Z" fill="#c9a24a"/>`;
  g += `<path d="M${L(1.4, h0 + 9.2)} C${L(2.3, h0 + 10.2)} ${L(1.2, h0 + 11.8)} ${L(0.35, h0 + 12.2)} L${R(0.35, h0 + 12.2)} C${R(1.2, h0 + 11.8)} ${R(2.3, h0 + 10.2)} ${R(1.4, h0 + 9.2)} Z" fill="${SCHIEFER}"/>`;
  g += `<path d="M${L(0.32, h0 + 12.2)} L${FP(mm, spitze)} L${R(0.32, h0 + 12.2)} Z" fill="#323a42"/>`;
  g += `<circle cx="${fx(mm)}" cy="${fy(mm, spitze + 0.5)}" r=".6" fill="${GOLD}"/><path d="M${fx(mm)} ${fy(mm, spitze + 0.9)} L${fx(mm)} ${fy(mm, spitze + 3)} M${r(fx(mm) - 1)} ${fy(mm, spitze + 2.3)} L${r(fx(mm) + 1)} ${fy(mm, spitze + 2.3)}" stroke="#d9b24a" stroke-width=".35"/>`;
  return g;
};
const konig = [];
{
  let k = "";
  const quad = (m0, m1, h0, h1, f, extra = "") => `<path d="M${FP(m0, h0)} L${FP(m1, h0)} L${FP(m1, h1)} L${FP(m0, h1)} Z" fill="${f}"${extra}/>`;
  /* --- Dach des Saalbaus: steiles Schieferdach mit zwei Reihen Gauben --- */
  k += `<path d="M${FP(9, 22.5)} L${FP(14, 34)} L${FP(56, 34)} L${FP(61, 22.5)} Z" fill="${DACH}"/>`;
  for (let i = 1; i < 6; i++) { const h = 22.5 + i * 2; k += `<path d="M${FP(9 + i * 0.85, h)} L${FP(61 - i * 0.85, h)}" stroke="#2a3138" stroke-width=".15" opacity=".55"/>`; }
  for (const [h, n] of [[25, 9], [30, 6]]) for (let i = 0; i < n; i++) {
    const m = 15 + (i + 0.5) * (40 / n), w = 0.95;
    k += `<path d="M${FP(m - w, h)} L${FP(m - w, h + 1.6)} L${FP(m, h + 2.6)} L${FP(m + w, h + 1.6)} L${FP(m + w, h)} Z" fill="#4a545e"/><path d="M${FP(m - w * 0.62, h + 0.15)} L${FP(m - w * 0.62, h + 1.45)} L${FP(m + w * 0.62, h + 1.45)} L${FP(m + w * 0.62, h + 0.15)} Z" fill="#e7dfcc"/><path d="M${FP(m - w * 0.45, h + 0.3)} L${FP(m - w * 0.45, h + 1.3)} L${FP(m + w * 0.45, h + 1.3)} L${FP(m + w * 0.45, h + 0.3)} Z" fill="#33404b"/>`;
  }
  /* Dachreiter in der Mitte */
  k += `<path d="M${FP(34.4, 33.6)} L${FP(34.4, 37)} L${FP(35.6, 37)} L${FP(35.6, 33.6)} Z" fill="#46505a"/><path d="M${FP(34, 37)} L${FP(35, 41.5)} L${FP(36, 37)} Z" fill="#46505a"/><circle cx="${fx(35)}" cy="${fy(35, 42)}" r=".5" fill="${GOLD}"/>`;
  /* --- Saalbau: Erdgeschoss und Krönungssaal --- */
  k += quad(9, 61, 0, 22.6, STEIN);
  k += quad(9, 61, 0, 6.6, S.lg("sockel", [[0, "#6f6a62"], [1, "#857e72"]], 0, 0, 1, 0));
  k += quad(9, 61, 6.6, 7.2, "#c9bfab");
  /* Erdgeschoss: spitzbogige Fenster und Türen */
  for (let m = 12; m < 59; m += 3.6) { if (m > 30 && m < 40) continue; k += `<path d="M${FP(m, 1.2)} L${FP(m + 1.6, 1.2)} L${FP(m + 1.6, 4.4)} L${FP(m + 0.8, 5.4)} L${FP(m, 4.4)} Z" fill="#2f363d"/>`; }
  /* Krönungssaal: neun hohe Maßwerkfenster */
  const FENSTER = []; for (let i = 0; i < 9; i++) FENSTER.push(12 + i * 5.45);
  for (const m of FENSTER) {
    k += `<path d="M${FP(m, 8.6)} L${FP(m + 2.8, 8.6)} L${FP(m + 2.8, 17.2)} Q${FP(m + 2.8, 19.4)} ${FP(m + 1.4, 19.8)} Q${FP(m, 19.4)} ${FP(m, 17.2)} Z" fill="${S.lg("rfenster", [[0, "#536879"], [0.6, "#2c3a47"], [1, "#6d8496"]], 0, 0, 1, 0)}"/>`;
    k += `<path d="M${FP(m + 1.4, 8.6)} L${FP(m + 1.4, 19.4)} M${FP(m, 13.2)} L${FP(m + 2.8, 13.2)}" stroke="#cfc5b0" stroke-width=".3"/>`;
    k += `<path d="M${FP(m + 0.3, 9.8)} L${FP(m + 1.1, 15)} L${FP(m + 1.3, 15)} L${FP(m + 0.6, 9.8)} Z" fill="#ffe3b2" opacity=".3"/>`;
  }
  /* zwischen den Fenstern: Pfeiler mit Baldachinen, je zwei Königsfiguren übereinander */
  const figur = (m, h, s, krone) => {
    const x = fx(m), y = fy(m, h), z = fs(m) * s;
    let g = `<path d="M${r(x - 0.5 * z)} ${r(y)} L${r(x - 0.42 * z)} ${r(y - 1.3 * z)} Q${r(x - 0.5 * z)} ${r(y - 1.7 * z)} ${r(x - 0.3 * z)} ${r(y - 1.9 * z)} L${r(x + 0.3 * z)} ${r(y - 1.9 * z)} Q${r(x + 0.5 * z)} ${r(y - 1.7 * z)} ${r(x + 0.42 * z)} ${r(y - 1.3 * z)} L${r(x + 0.5 * z)} ${r(y)} Z" fill="${S.lg("figur", [[0, "#a59a84"], [0.6, "#e8dfca"], [1, "#c9bea7"]], 0, 0, 1, 0)}"/>`;
    g += `<circle cx="${x}" cy="${r(y - 2.1 * z)}" r="${r(0.26 * z)}" fill="#e3d9c3"/>`;
    if (krone) g += `<path d="M${r(x - 0.24 * z)} ${r(y - 2.3 * z)} l0 ${r(-0.22 * z)} l${r(0.12 * z)} ${r(0.1 * z)} l${r(0.12 * z)} ${r(-0.14 * z)} l${r(0.12 * z)} ${r(0.14 * z)} l${r(0.12 * z)} ${r(-0.1 * z)} l0 ${r(0.22 * z)} Z" fill="${GOLD}"/>`;
    g += `<line x1="${r(x + 0.32 * z)}" y1="${r(y - 0.4 * z)}" x2="${r(x + 0.38 * z)}" y2="${r(y - 1.9 * z)}" stroke="#bfb49c" stroke-width="${r(0.08 * z)}"/>`;
    return g;
  };
  const baldachin = (m, h) => `<path d="M${FP(m - 0.7, h)} L${FP(m - 0.7, h + 0.8)} L${FP(m, h + 2.2)} L${FP(m + 0.7, h + 0.8)} L${FP(m + 0.7, h)} Z" fill="#d9cfba"/>`;
  for (let i = 0; i <= 9; i++) {
    const m = 11 + i * 5.45 - 0.3;
    k += `<path d="M${FP(m - 0.9, 7.2)} L${FP(m + 0.9, 7.2)} L${FP(m + 0.9, 22.6)} L${FP(m - 0.9, 22.6)} Z" fill="${S.lg("pfeiler", [[0, "#9a8f7b"], [1, "#c4b9a3"]], 0, 0, 1, 0)}"/>`;
    for (const h of [9.4, 15.2]) { k += figur(m, h, 1, true) + baldachin(m, h + 2.5); konig.push([m, h]); }
  }
  /* Brüstung mit Maßwerk und Fialen, darüber die oberste Reihe Figuren */
  k += quad(9, 61, 20.6, 22.6, "#cfc5b0");
  for (let m = 10; m < 60; m += 1.4) k += `<path d="M${FP(m, 20.9)} Q${FP(m + 0.7, 22.2)} ${FP(m + 1.4, 20.9)}" stroke="#9a8f7b" stroke-width=".25" fill="none"/>`;
  for (let i = 0; i < 18; i++) { const m = 11.6 + i * 2.75; k += figur(m, 22.6, 0.82, true); }
  for (let i = 0; i <= 9; i++) { const m = 11 + i * 5.45 - 0.3; k += `<path d="M${FP(m - 0.45, 22.6)} L${FP(m, 26.4)} L${FP(m + 0.45, 22.6)} Z" fill="#c9bfab"/>`; }
  /* --- Marktturm (Westen, rechts): halbrund, barocker Helm --- */
  {
    const m0 = 61, m1 = 70, mm = (m0 + m1) / 2;
    k += `<path d="M${FP(m0, 0)} L${FP(m0, 30)} L${FP(m1, 30)} L${FP(m1, 0)} Z" fill="${S.lg("marktturm", [[0, "#7f7565"], [0.4, "#b1a690"], [0.8, "#c6bba4"], [1, "#9a8f7b"]], 0, 0, 1, 0)}"/>`;
    for (const h of [7, 14, 21, 27]) k += `<path d="M${FP(m0, h)} Q${FP(mm, h - 0.7)} ${FP(m1, h)}" stroke="#d6ccb6" stroke-width=".45" fill="none"/>`;
    for (const h of [3, 9, 16, 23]) for (const m of [mm - 2.4, mm + 1.2]) k += `<path d="M${FP(m, h)} L${FP(m + 1.2, h)} L${FP(m + 1.2, h + 3)} L${FP(m + 0.6, h + 3.6)} L${FP(m, h + 3)} Z" fill="#2f363d"/>`;
    k += helm(mm, 30, 4.5, 44);
  }
  /* --- barocke Freitreppe in der Mitte (zwei Läufe zum Portal im Obergeschoss) --- */
  {
    const m0 = 30.6, m1 = 39.4, mm = (m0 + m1) / 2, vor = 1.1;
    k += `<path d="M${FP(mm - 1.6, 6.4)} L${FP(mm + 1.6, 6.4)} L${FP(mm + 1.6, 11.4)} Q${FP(mm, 12.8)} ${FP(mm - 1.6, 11.4)} Z" fill="#3a2f26"/>`;
    k += `<path d="M${FP(mm - 2.4, 11.6)} Q${FP(mm, 13.6)} ${FP(mm + 2.4, 11.6)}" stroke="#d6ccb6" stroke-width=".5" fill="none"/>`;
    /* Podest */
    const x0 = fx(m0) - 1, x1 = fx(m1) + 1, yP = fy(mm, 6.2), yB = RH.basis + 2.4;
    k += `<path d="M${r(x0 + 4)} ${r(yP)} L${r(x1 - 4)} ${r(yP)} L${r(x1 - 4)} ${r(yP + 2)} L${r(x0 + 4)} ${r(yP + 2)} Z" fill="${BLAUSTEIN}"/>`;
    /* zwei Läufe, schräg nach außen hinab */
    for (const s of [-1, 1]) {
      const xa = s < 0 ? x0 + 4 : x1 - 4, xb = s < 0 ? x0 - 6 : x1 + 6;
      k += `<path d="M${r(xa)} ${r(yP)} L${r(xb)} ${r(yB - 1.2)} L${r(xb)} ${r(yB)} L${r(xa)} ${r(yP + 2)} Z" fill="${S.lg("treppe" + (s < 0 ? "l" : "r"), [[0, "#9aa1a6"], [1, "#6d7378"]])}"/>`;
      for (let i = 1; i < 9; i++) { const t = i / 9; k += `<line x1="${r(xa + (xb - xa) * t)}" y1="${r(yP + (yB - 1.2 - yP) * t)}" x2="${r(xa + (xb - xa) * t)}" y2="${r(yP + (yB - 1.2 - yP) * t + 1.1)}" stroke="#4f555a" stroke-width=".2"/>`; }
      /* Geländer */
      k += `<path d="M${r(xa)} ${r(yP - 1.6)} L${r(xb)} ${r(yB - 2.8)}" stroke="#2c3034" stroke-width=".35"/>`;
      for (let i = 0; i <= 6; i++) { const t = i / 6; k += `<line x1="${r(xa + (xb - xa) * t)}" y1="${r(yP - 1.6 + (yB - 2.8 - yP + 1.6) * t)}" x2="${r(xa + (xb - xa) * t)}" y2="${r(yP + (yB - 1.2 - yP) * t)}" stroke="#2c3034" stroke-width=".18"/>`; }
    }
    k += `<path d="M${r(x0 + 4)} ${r(yP - 1.6)} L${r(x1 - 4)} ${r(yP - 1.6)}" stroke="#2c3034" stroke-width=".35"/>`;
    void vor;
  }
  /* Abendsonne von rechts färbt die Fassade */
  k += `<path d="M${FP(0, 0)} L${FP(70, 0)} L${FP(70, 30)} L${FP(61, 30)} L${FP(61, 22.6)} L${FP(9.4, 22.6)} L${FP(9.4, 22.6)} L${FP(9.4, 0)} Z" fill="${ABEND}"/>`;
  S.teil({ id: "rathaus", de: "das Rathaus", syl: "RAT-haus", it: "il municipio", itSyl: "mu-ni-CI-pio", en: "town hall",
    x: 0, y: 0, kunst: k, tipp: "Das Rathaus steht auf den Mauern der Königshalle Karls des Großen. Im Krönungssaal feierten 31 Könige ihre Krönung.",
    zoom: { x: 112, y: 90, w: 78, h: 52 },
    unter: [
      { id: "koenig", de: "der König", syl: "KÖ-nig", it: "il re", itSyl: "RE", en: "king", x: fx(21.6), y: fy(21.6, 9.4), kunst: flaeche(-1.8, -6.6, 3.6, 6.8, 0.4),
        tipp: "An der Fassade stehen 50 Figuren von Königen und Kaisern." },
      { id: "freitreppe", de: "die Freitreppe", syl: "FREI-trep-pe", it: "la scalinata", itSyl: "sca-li-NA-ta", en: "outdoor staircase", x: fx(35), y: RH.basis + 2.4, kunst: flaeche(-21, -(2.4 + 6.2 * fs(35)), 42, 2.4 + 6.2 * fs(35), 0.6) },
    ] });
}

/* =====================================================================
   3b — DER TURM: der Granusturm (Osten, links) — unten karolingisches Bruchsteinmauerwerk
   ===================================================================== */
{
  let k = "";
    const m0 = 0, m1 = 9.4, mm = 4.7;
    k += `<path d="M${FP(m0, 0)} L${FP(m0, 33)} L${FP(m1, 33)} L${FP(m1, 0)} Z" fill="${S.lg("granus", [[0, "#8d8370"], [0.6, "#b4a990"], [1, "#a3987f"]], 0, 0, 1, 0)}"/>`;
    for (let i = 0; i < 70; i++) { const m = m0 + 0.3 + rnd() * (m1 - m0 - 1), h = 0.6 + rnd() * 17.5, w = 0.5 + rnd() * 0.8; k += `<path d="M${FP(m, h)} L${FP(m + w, h)} L${FP(m + w, h + 0.45)} L${FP(m, h + 0.45)} Z" fill="${rnd() < 0.5 ? "#6f6656" : "#c3b89f"}" opacity=".55"/>`; }
    k += `<path d="M${FP(m0, 18.6)} L${FP(m1, 18.6)}" stroke="#d6ccb6" stroke-width=".55"/><path d="M${FP(m0, 26.6)} L${FP(m1, 26.6)}" stroke="#d6ccb6" stroke-width=".5"/>`;
    for (const [h, n] of [[8, 1], [20.4, 2], [28.4, 3]]) for (let i = 0; i < n; i++) { const m = mm - (n - 1) * 1.3 + i * 2.6 - 0.55; k += `<path d="M${FP(m, h)} L${FP(m + 1.1, h)} L${FP(m + 1.1, h + 3)} L${FP(m + 0.55, h + 3.6)} L${FP(m, h + 3)} Z" fill="#2f363d"/>`; }
    k += helm(mm, 33, 4.7, 48);
  k += `<path d="M${FP(0, 0)} L${FP(9.4, 0)} L${FP(9.4, 33)} L${FP(0, 33)} Z" fill="${ABEND}"/>`;
  S.teil({ id: "turm", de: "der Turm", syl: "TURM", it: "la torre", itSyl: "TOR-re", en: "tower", x: 0, y: 0, kunst: k,
    tipp: "Der Granusturm ist über 1200 Jahre alt — er stammt noch aus der Zeit Karls des Großen." });
}

/* =====================================================================
   4 — DAS HAUS (Bürgerhäuser an der Westseite des Marktes, rechts)
   ===================================================================== */
{
  let k = "";
  const haus = (x0, x1, yB, h, giebel, f, fen) => {
    let g = `<path d="M${x0} ${yB} L${x0} ${r(yB - h)} L${x1} ${r(yB - h)} L${x1} ${yB} Z" fill="${f}"/>`;
    const w = x1 - x0;
    if (giebel) {
      /* geschweifter Barockgiebel mit Blaustein-Abdeckung */
      g += `<path d="M${x0} ${r(yB - h)} Q${r(x0 + w * 0.12)} ${r(yB - h - 4)} ${r(x0 + w * 0.3)} ${r(yB - h - 5)} L${r(x0 + w * 0.3)} ${r(yB - h - 9)} Q${r(x0 + w / 2)} ${r(yB - h - 13)} ${r(x1 - w * 0.3)} ${r(yB - h - 9)} L${r(x1 - w * 0.3)} ${r(yB - h - 5)} Q${r(x1 - w * 0.12)} ${r(yB - h - 4)} ${x1} ${r(yB - h)} Z" fill="${f}" stroke="#7a8086" stroke-width=".6"/>`;
      g += `<circle cx="${r(x0 + w / 2)}" cy="${r(yB - h - 7.4)}" r="1.3" fill="#3b4752" stroke="#7a8086" stroke-width=".4"/>`;
    } else g += `<path d="M${x0 - 0.8} ${r(yB - h)} L${r(x0 + 3)} ${r(yB - h - 7)} L${r(x1 - 3)} ${r(yB - h - 7)} L${x1 + 0.8} ${r(yB - h)} Z" fill="${DACH}"/>`;
    /* Fenster mit Rahmen aus grauem Blaustein */
    const ach = fen, sp = w / ach;
    for (let gs = 0; gs < 3; gs++) for (let a = 0; a < ach; a++) {
      const x = x0 + sp * (a + 0.28), y = yB - h + 4 + gs * (h - 12) / 2.6, fw = sp * 0.44, fh = (h - 12) / 4;
      g += `<rect x="${r(x - 0.5)}" y="${r(y - 0.5)}" width="${r(fw + 1)}" height="${r(fh + 1.2)}" fill="#8b9298"/><rect x="${r(x)}" y="${r(y)}" width="${r(fw)}" height="${r(fh)}" fill="${S.lg("hfenster", [[0, "#4c5d6b"], [1, "#2b3742"]])}"/><line x1="${r(x + fw / 2)}" y1="${r(y)}" x2="${r(x + fw / 2)}" y2="${r(y + fh)}" stroke="#e8e2d4" stroke-width=".25"/>`;
    }
    /* Erdgeschoss: Laden mit Markise */
    g += `<rect x="${x0}" y="${r(yB - 8.6)}" width="${r(w)}" height="8.6" fill="#5f656b"/><rect x="${r(x0 + 1)}" y="${r(yB - 7.6)}" width="${r(w - 2)}" height="7.6" fill="${S.lg("laden", [[0, "#e9d9b0"], [1, "#9a8a6c"]])}"/>`;
    return g;
  };
  k += haus(254, 278, 140.6, 30, true, S.lg("haus2", [[0, "#a3553c"], [1, "#b8674b"]], 0, 0, 1, 0), 3);
  k += haus(278, 300, 141.2, 27, false, S.lg("haus3", [[0, "#e4d6b6"], [1, "#efe4ca"]], 0, 0, 1, 0), 3);
  k += haus(300, 321, 141.8, 32, true, S.lg("haus4", [[0, "#8f4a36"], [1, "#a65b42"]], 0, 0, 1, 0), 3);
  /* Markisen der Cafés */
  for (const [x0, x1, f] of [[254, 278, "#2f5d47"], [300, 320, "#7a2a28"]]) {
    k += `<path d="M${x0} 133.4 L${x1} 133.4 L${x1 + 1.4} 137.4 L${x0 - 1.4} 137.4 Z" fill="${f}"/>`;
    for (let x = x0; x < x1; x += 2.4) k += `<path d="M${r(x)} 137.4 q1.2 1.2 2.4 0" fill="${f}"/>`;
  }
  k += `<rect x="254" y="100" width="66" height="42" fill="${ABEND}"/>`;
  /* links: die niedrigen Häuser am Granusturm — der „Postwagen“ (Barockhaus mit hölzernen Fensterbändern) und ein Bürgerhaus */
  /* der „Postwagen“: kleines Barockhaus mit hölzernen Fensterbändern, ans Rathaus gebaut */
  k += `<path d="M44 137 L44 108 L72 106 L72 137 Z" fill="${S.lg("postwagen", [[0, "#7c5a3c"], [1, "#9a7350"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M42.6 108.2 L50 99 L68 98 L73.4 106 Z" fill="${DACH}"/>`;
  for (const y of [111, 120]) { k += `<rect x="46" y="${y}" width="24" height="6" fill="#3d2a1c"/>`; for (let x = 46.6; x < 69.5; x += 2.4) k += `<rect x="${x}" y="${y + 0.6}" width="1.9" height="4.8" fill="${S.lg("butzen", [[0, "#c9b98f"], [1, "#7f8b8a"]])}"/>`; }
  k += `<rect x="54" y="128" width="5" height="9" fill="#3d2a1c"/><rect x="61" y="128.6" width="8" height="5.6" fill="#3d2a1c"/>`;
  /* Haus am Markt links davor (Backstein mit Blaustein-Gewänden) */
  k += `<path d="M18 137 L18 112 L44 110.4 L44 137 Z" fill="${S.lg("haus1", [[0, "#8e4a35"], [1, "#a85c41"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M16.6 112.4 L22 104.4 L42 103.4 L45 110.6 Z" fill="${DACH}"/>`;
  for (const y of [114.5, 123.5]) for (const x of [21, 27.5, 34, 40]) k += `<rect x="${x - 0.5}" y="${y - 0.5}" width="3.2" height="6" fill="#7a8086"/><rect x="${x}" y="${y}" width="2.2" height="5" fill="#3b4752"/>`;
  k += `<rect x="18" y="131" width="26" height="6" fill="#6a7076"/><rect x="28" y="131.6" width="4" height="5.4" fill="#2e3740"/>`;
  k += `<rect x="0" y="117" width="18.4" height="20" fill="${S.lg("haus0", [[0, "#cfc3a8"], [1, "#e2d8c0"]], 0, 0, 1, 0)}"/><path d="M-1 117.4 L4 111 L18.6 110.6 L18.6 117 Z" fill="${DACH}"/>`;
  for (const x of [2.4, 8.4, 14]) k += `<rect x="${x}" y="120" width="2.4" height="4.6" fill="#3b4752"/><rect x="${x}" y="128" width="2.4" height="4.6" fill="#3b4752"/>`;
  k += `<rect x="0" y="108" width="74" height="29.4" fill="${ABEND}"/>`;

  S.teil({ id: "haus", de: "das Haus", syl: "HAUS", it: "la casa", itSyl: "CA-sa", en: "house", x: 0, y: 0, kunst: k,
    tipp: "Viele alte Häuser in Aachen sind aus Backstein. Die Fensterrahmen sind aus grauem Blaustein." });
}

/* =====================================================================
   5 — DER KARLSBRUNNEN — Lupe: der Kaiser, die Krone, der Reichsapfel
   ===================================================================== */
const KB = { x: 206, y: 147 };
{
  const s = 6.1;      /* Einheiten je Meter am Brunnen */
  let k = schatten(-4, 0.8, 30, 3, 0.35);
  /* Rokoko-Becken aus Blaustein: geschwungener Rand, Stufe */
  k += `<path d="M-30 0 L30 0 L29 -1.2 L-29 -1.2 Z" fill="#5d6368"/>`;
  k += `<path d="M-28.4 -1.2 Q-28.8 -4.6 -24 -5.6 Q-14 -7.2 0 -7.4 Q14 -7.2 24 -5.6 Q28.8 -4.6 28.4 -1.2 Z" fill="${BLAUSTEIN}"/>`;
  k += `<path d="M-24 -5.6 Q-14 -7.2 0 -7.4 Q14 -7.2 24 -5.6 Q14 -6.4 0 -6.4 Q-14 -6.4 -24 -5.6 Z" fill="#a9b0b6"/>`;
  for (const x of [-20, -8, 8, 20]) k += `<path d="M${x - 1.4} -1.4 Q${x} -4.4 ${x + 1.4} -1.4" stroke="#4f555a" stroke-width=".4" fill="none"/>`;
  k += `<path d="M-24 -5.4 Q0 -4.2 24 -5.4" stroke="#7f878d" stroke-width=".3" fill="none"/>`;
  /* Wasserfläche im Becken */
  k += `<ellipse cx="0" cy="-6.6" rx="22" ry="1" fill="${S.lg("bwasser", [[0, "#7fa2ad"], [1, "#a9c3cb"]], 0, 0, 1, 0)}" opacity=".9"/>`;
  /* Fuß und die große Bronzeschale („Eäzekomp“) */
  k += `<path d="M-2.6 -6.8 L-1.8 -12 L1.8 -12 L2.6 -6.8 Z" fill="${BRONZE}"/>`;
  k += `<path d="M-13 -15 Q-12.4 -10.8 -6 -10.2 Q0 -9.6 6 -10.2 Q12.4 -10.8 13 -15 Z" fill="${S.lg("schale", [[0, "#3f6151"], [0.4, "#76a08a"], [0.7, "#9cc0a8"], [1, "#4d705f"]], 0, 0, 1, 0)}"/>`;
  k += `<ellipse cx="0" cy="-15" rx="13" ry="1.1" fill="#5d8471"/><ellipse cx="0" cy="-15.1" rx="12" ry=".75" fill="#8fb3bf"/>`;
  for (const x of [-9, -3, 3, 9]) k += `<path d="M${x} -14.4 q.4 2.4 0 3.6" stroke="#2f4a3d" stroke-width=".35" fill="none"/>`;
  /* Wasserstrahlen aus der Schale ins Becken */
  for (const x of [-12.4, 12.4]) k += `<path d="M${x} -14.4 Q${r(x * 1.25)} -12 ${r(x * 1.34)} -6.8" stroke="#dcecef" stroke-width=".55" fill="none" opacity=".85"/>`;
  /* Säule und Sockel der Figur */
  k += `<path d="M-1.6 -15.4 L-1.3 -23 L1.3 -23 L1.6 -15.4 Z" fill="${BRONZE}"/><rect x="-2.4" y="-24.4" width="4.8" height="1.6" rx=".4" fill="#4b6a5a"/>`;
  /* KARL DER GROSSE: Mantel, Krone, Zepter (rechts), Reichsapfel (links) */
  const KY = -24.4;
  k += `<path d="M-2.2 ${KY} L-2.6 ${KY - 5} Q-2.4 ${KY - 8.6} -1.3 ${KY - 9.4} L1.3 ${KY - 9.4} Q2.4 ${KY - 8.6} 2.6 ${KY - 5} L2.2 ${KY} Z" fill="${S.lg("karl", [[0, "#2f4a3d"], [0.5, "#5f8270"], [1, "#3b5a4b"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-2.4 ${KY - 0.2} L-1 ${KY - 7.6} L.6 ${KY - 7.6} L2.4 ${KY - 0.2} Z" fill="#3e5e4e" opacity=".8"/>`;
  k += `<path d="M-1.4 ${KY - 9.4} Q0 ${KY - 8.6} 1.4 ${KY - 9.4}" stroke="#7ea08c" stroke-width=".3" fill="none"/>`;
  k += `<circle cx="0" cy="${KY - 10.3}" r="1" fill="#55786a"/><path d="M-.7 ${KY - 9.8} Q0 ${KY - 8.8} .7 ${KY - 9.8}" fill="#4a6b5c"/>`;
  k += `<path d="M-1.1 ${KY - 11} L-1.1 ${KY - 12.3} L-.55 ${KY - 11.7} L0 ${KY - 12.5} L.55 ${KY - 11.7} L1.1 ${KY - 12.3} L1.1 ${KY - 11} Z" fill="${GOLD}"/>`;
  k += `<path d="M2.1 ${KY - 7} L2.9 ${KY - 7.6} L3.3 ${KY - 13.4}" stroke="#4f725f" stroke-width=".55" fill="none"/><path d="M3.3 ${KY - 13.4} l-.5 -.8 .5 -.6 .5 .6 Z" fill="${GOLD}"/>`;
  k += `<path d="M-2.2 ${KY - 6.4} L-3 ${KY - 6}" stroke="#4f725f" stroke-width=".6"/><circle cx="-3.3" cy="${KY - 6.6}" r=".75" fill="${GOLD}"/><path d="M-3.3 ${KY - 7.3} L-3.3 ${KY - 8.2} M-3.7 ${KY - 7.8} L-2.9 ${KY - 7.8}" stroke="#d9b24a" stroke-width=".22"/>`;
  k += `<path d="M1 ${KY - 9} Q2.2 ${KY - 6} 1.8 ${KY - 1}" stroke="#a9c8b6" stroke-width=".35" fill="none" opacity=".7"/>`;
  void s;
  S.teil({ id: "karlsbrunnen", de: "der Karlsbrunnen", syl: "KARLS-brun-nen", it: "la fontana di Carlo Magno", itSyl: "fon-TA-na di CAR-lo MA-gno", en: "Charlemagne Fountain",
    x: KB.x, y: KB.y, kunst: k, tipp: "Die Aachener nennen den Brunnen „Karl in de Eäzekomp“ — Karl in der Erbsenschüssel.",
    zoom: { x: KB.x - 15, y: KB.y - 40, w: 30, h: 20 },
    unter: [
      { id: "kaiser", de: "der Kaiser", syl: "KAI-ser", it: "l'imperatore", itSyl: "im-pe-ra-TO-re", en: "emperor", x: KB.x, y: KB.y + KY, kunst: flaeche(-2.4, -9.6, 4.8, 9.6, 0.4),
        tipp: "Karl der Große war Kaiser. Er lebte sehr gern in Aachen — wegen der warmen Quellen." },
      { id: "krone", de: "die Krone", syl: "KRO-ne", it: "la corona", itSyl: "co-RO-na", en: "crown", x: KB.x, y: KB.y + KY - 11, kunst: flaeche(-1.3, -1.7, 2.6, 1.9, 0.3) },
      { id: "reichsapfel", de: "der Reichsapfel", syl: "REICHS-ap-fel", it: "il globo imperiale", itSyl: "GLO-bo im-pe-RIA-le", en: "imperial orb", x: KB.x - 3.3, y: KB.y + KY - 6.6, kunst: flaeche(-1.1, -1.8, 2.2, 2.8, 0.3),
        tipp: "Den Reichsapfel trägt der Kaiser in der Hand: Er zeigt die Herrschaft über die Welt." },
      { id: "zepter", de: "das Zepter", syl: "ZEP-ter", it: "lo scettro", itSyl: "SCET-tro", en: "sceptre", x: KB.x + 3, y: KB.y + KY - 10, kunst: flaeche(-0.8, -4.2, 1.6, 6, 0.3) },
    ] });
}

/* =====================================================================
   6 — DER SONNENSCHIRM, DER TISCH (Lupe: Printe, Tasse) und DER STUHL — Café links vorn
   ===================================================================== */
const TISCH = { x: 48, y: 186 };
{
  const s = km(176);
  let k = "";
  const H = 2.6 * s, W = 2.6 * s;
  k += `<rect x="-.5" y="${r(-H)}" width="1" height="${r(H)}" fill="#d8d2c4"/>`;
  k += `<path d="M${r(-W / 2)} ${r(-H + 6)} L0 ${r(-H - 2)} L${r(W / 2)} ${r(-H + 6)} Q0 ${r(-H + 8)} ${r(-W / 2)} ${r(-H + 6)} Z" fill="${S.lg("schirm", [[0, "#efe7d6"], [0.6, "#fbf6ec"], [1, "#d8cdb6"]], 0, 0, 1, 0)}"/>`;
  for (let i = 0; i < 8; i++) { const x = -W / 2 + (i + 0.5) * W / 8; k += `<path d="M${r(x - W / 16)} ${r(-H + 6 + Math.abs(x) * 0.02)} q${r(W / 16)} 1.6 ${r(W / 8)} 0" fill="#f6efe1" stroke="#cfc4ad" stroke-width=".2"/>`; }
  for (const t of [-0.5, -0.25, 0, 0.25, 0.5]) k += `<line x1="0" y1="${r(-H - 2)}" x2="${r(t * W)}" y2="${r(-H + 6.4)}" stroke="#d2c7b0" stroke-width=".3"/>`;
  k += `<text x="0" y="${r(-H + 7.6)}" font-size="2.2" text-anchor="middle" fill="#7a2a28" font-family="Georgia,serif" font-style="italic">Café am Markt</text>`;
  k += `<rect x="-3" y="-1" width="6" height="1" rx=".4" fill="#9a958a"/>`;
  S.teil({ id: "sonnenschirm", de: "der Sonnenschirm", syl: "SON-nen-schirm", it: "l'ombrellone", itSyl: "om-brel-LO-ne", en: "parasol", x: 30, y: 176, steht: true, kunst: k });
}
{
  /* Stuhl hinter dem Tisch (Bistrostuhl) */
  const s = km(181);
  let k = schatten(0, 0.3, 6, 1, 0.3);
  const SH = 0.46 * s, LH = 0.9 * s;
  k += `<path d="M-4.4 0 L-4 ${r(-SH)} M4.4 0 L4 ${r(-SH)} M-3.6 ${r(-SH)} L-4.2 ${r(-LH)} M3.6 ${r(-SH)} L4.2 ${r(-LH)}" stroke="#2c3236" stroke-width=".9"/>`;
  k += `<path d="M-4.6 ${r(-LH)} Q0 ${r(-LH - 2)} 4.6 ${r(-LH)}" stroke="#2c3236" stroke-width="1.2" fill="none"/>`;
  for (const t of [0.3, 0.55]) k += `<path d="M-4.2 ${r(-SH - (LH - SH) * t)} Q0 ${r(-SH - (LH - SH) * t - 1.4)} 4.2 ${r(-SH - (LH - SH) * t)}" stroke="#2c3236" stroke-width=".5" fill="none"/>`;
  k += `<path d="M-4.8 ${r(-SH)} L4.8 ${r(-SH)} L4.2 ${r(-SH + 1.4)} L-4.2 ${r(-SH + 1.4)} Z" fill="${S.lg("sitz", [[0, "#b08a5a"], [1, "#7d5e38"]])}"/>`;
  S.teil({ id: "stuhl", de: "der Stuhl", syl: "STUHL", it: "la sedia", itSyl: "SE-dia", en: "chair", x: 66, y: 181, steht: true, kunst: k });
}
{
  const s = km(TISCH.y), TH = 0.75 * s, R = 0.36 * s;
  let k = schatten(0, 0.4, R + 4, 1.4, 0.35);
  k += `<path d="M-3 0 L3 0 L.7 -2 L-.7 -2 Z" fill="#2c3236"/><rect x="-.55" y="${r(-TH)}" width="1.1" height="${r(TH - 1.6)}" fill="#3a4045"/>`;
  k += `<ellipse cx="0" cy="${r(-TH)}" rx="${r(R)}" ry="${r(R * 0.22)}" fill="#8b9298"/><ellipse cx="0" cy="${r(-TH - 0.5)}" rx="${r(R)}" ry="${r(R * 0.22)}" fill="${S.lg("marmor", [[0, "#f3f1ec"], [1, "#cfcbc2"]])}"/>`;
  const top = -TH - 0.5;
  /* Kaffeetasse mit Untertasse */
  k += `<ellipse cx="-4.6" cy="${r(top + 0.6)}" rx="2.6" ry=".7" fill="#e8e6e0"/><path d="M-6.4 ${r(top + 0.4)} L-6.2 ${r(top - 2.2)} L-3 ${r(top - 2.2)} L-2.8 ${r(top + 0.4)} Q-4.6 ${r(top + 1)} -6.4 ${r(top + 0.4)} Z" fill="#fbfaf6"/><ellipse cx="-4.6" cy="${r(top - 2.2)}" rx="1.6" ry=".4" fill="#5c3b26"/><path d="M-2.9 ${r(top - 1.6)} q1.4 .2 1 1.3 q-.4 .7 -1.2 .4" stroke="#f3f1ec" stroke-width=".5" fill="none"/>`;
  k += `<path d="M-4.8 ${r(top - 2.8)} q-.8 -1.2 0 -2.4 q.8 -1.2 0 -2.2" stroke="#fff" stroke-width=".35" opacity=".55" fill="none"/>`;
  /* Teller mit Aachener Printen (Kräuterprinten mit Kandis, eine mit Schokolade) */
  k += `<ellipse cx="3.6" cy="${r(top + 0.5)}" rx="4.6" ry="1.1" fill="#f6f4ef" stroke="#d9d4c9" stroke-width=".2"/>`;
  const printe = (x, y, a, schoko) => `<g transform="rotate(${a} ${x} ${y})"><rect x="${r(x - 2.2)}" y="${r(y - 0.9)}" width="4.4" height="1.5" rx=".3" fill="${schoko ? "#3d2416" : S.lg("printe", [[0, "#8a4a1e"], [1, "#6b3612"]])}"/>${schoko ? "" : `<circle cx="${r(x - 1)}" cy="${r(y - 0.4)}" r=".22" fill="#f1e2c0"/><circle cx="${r(x + 0.6)}" cy="${r(y - 0.2)}" r=".2" fill="#f1e2c0"/><circle cx="${r(x + 1.4)}" cy="${r(y - 0.5)}" r=".18" fill="#e8d3a6"/>`}<rect x="${r(x - 2.2)}" y="${r(y - 0.9)}" width="4.4" height=".3" fill="#fff" opacity=".18"/></g>`;
  k += printe(2.2, top - 0.1, -6, false) + printe(4.8, top - 0.6, 8, true) + printe(4, top + 0.6, -2, false);
  S.teil({ id: "tisch", de: "der Tisch", syl: "TISCH", it: "il tavolino", itSyl: "ta-vo-LI-no", en: "table", x: TISCH.x, y: TISCH.y, steht: true, kunst: k,
    zoom: { x: TISCH.x - 12, y: TISCH.y + top - 7, w: 24, h: 16 },
    unter: [
      { id: "printe", de: "die Printe", syl: "PRIN-te", it: "il biscotto Printe", itSyl: "bi-SCOT-to PRIN-te", en: "Aachen gingerbread", x: TISCH.x + 3.6, y: TISCH.y + top + 1, kunst: flaeche(-4.4, -2.6, 8.8, 3.6, 0.4),
        tipp: "Aachener Printen sind harte, würzige Lebkuchen — mit Kandiszucker, manche mit Schokolade." },
      { id: "tasse", de: "die Tasse", syl: "TAS-se", it: "la tazza", itSyl: "TAZ-za", en: "cup", x: TISCH.x - 4.6, y: TISCH.y + top + 1, kunst: flaeche(-2.6, -3.6, 4.6, 4.2, 0.4) },
    ] });
}

/* =====================================================================
   7 — DIE TAFEL (Kundenstopper) mit Öcher Platt
   ===================================================================== */
{
  const s = km(191), H = 1 * s, W = 0.62 * s;
  let k = schatten(0, 0.3, W / 2 + 3, 1.2, 0.3);
  k += `<path d="M${r(-W / 2 - 1)} 0 L${r(-W / 2 + 1.6)} ${r(-H)} L${r(W / 2 - 1.6)} ${r(-H)} L${r(W / 2 + 1)} 0" stroke="#5b3a1f" stroke-width="1.2" fill="none"/>`;
  k += `<path d="M${r(-W / 2 + 0.2)} -3 L${r(-W / 2 + 1.9)} ${r(-H + 2)} L${r(W / 2 - 1.9)} ${r(-H + 2)} L${r(W / 2 - 0.2)} -3 Z" fill="${S.lg("tafel", [[0, "#2e3a33"], [1, "#212a25"]])}"/>`;
  const t = (y, f, txt, c = "#f4f0e6", w = "normal") => `<text x="0" y="${r(y)}" font-size="${f}" text-anchor="middle" fill="${c}" font-family="'Comic Sans MS','Segoe Print',cursive" font-weight="${w}">${txt}</text>`;
  k += t(-H + 6.6, 3.2, "Wellkomm!", "#f6e7a1", "bold");
  k += t(-H + 11, 2.5, "Öcher Printe");
  k += t(-H + 14.2, 2.5, "+ Kaffee 3,90");
  k += t(-H + 18.6, 2.9, "Oche Alaaf!", "#ffb8a8", "bold");
  k += `<path d="M${r(-W / 2 + 3)} ${r(-H + 7.8)} L${r(W / 2 - 3)} ${r(-H + 7.8)}" stroke="#f6e7a1" stroke-width=".3" stroke-dasharray="1 .7"/>`;
  S.teil({ id: "tafel", de: "die Tafel", syl: "TA-fel", it: "la lavagna", itSyl: "la-VA-gna", en: "chalkboard", x: 96, y: 191, steht: true, kunst: k,
    tipp: "Auf der Tafel steht Öcher Platt, die Mundart von Aachen: „Oche“ heißt Aachen, „Öcher“ heißt Aachener." });
}

/* =====================================================================
   8 — DIE TOURISTIN (von hinten, schaut zum Rathaus)
   ===================================================================== */
{
  const Y = 180;
  const m = B.mensch({ id: "aac_tour", geschlecht: "w", pose: "stehen", blick: 186, frisur: "zopf", haarfarbe: "braun", haut: "hell",
    kleidung: { oberteil: { stueck: "pullover", farbe: "creme" }, unterteil: { stueck: "jeans" }, jacke: { stueck: "jacke", farbe: "#c9662f" }, schuhe: { stueck: "turnschuh" }, zubehoer: { stueck: "rucksack", farbe: "#2f5a35" } } }, 1.66 * km(Y));
  S.teil({ id: "touristin", de: "die Touristin", syl: "tou-RIS-tin", it: "la turista", itSyl: "tu-RI-sta", en: "tourist", x: 140, y: Y,
    kunst: schatten(-3, 0.3, 7, 1.2, 0.3) + m.svg, tipp: "Viele Touristen kommen nach Aachen, um den Dom und das Rathaus zu sehen." });
}

/* =====================================================================
   9 — DIE LATERNE und 10 — DER WEGWEISER (rechts vorn)
   ===================================================================== */
{
  const Y = 170, s = km(Y), H = 4.2 * s;
  let k = schatten(0, 0.3, 4, 1, 0.3);
  k += `<path d="M-2 0 L-1.4 -5 L1.4 -5 L2 0 Z" fill="#23292c"/><rect x="-.6" y="${r(-H + 9)}" width="1.2" height="${r(H - 14)}" fill="${S.lg("lmast", [[0, "#1f2427"], [0.5, "#4d565b"], [1, "#1f2427"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-1.2" y="${r(-H + 8.4)}" width="2.4" height="1.2" fill="#23292c"/>`;
  k += `<path d="M-2.4 ${r(-H + 8.4)} L-3.4 ${r(-H + 2)} L3.4 ${r(-H + 2)} L2.4 ${r(-H + 8.4)} Z" fill="${S.lg("lglas", [[0, "#fff4d0"], [1, "#e6cf94"]])}" stroke="#23292c" stroke-width=".4"/>`;
  k += `<line x1="0" y1="${r(-H + 2)}" x2="0" y2="${r(-H + 8.4)}" stroke="#23292c" stroke-width=".3"/>`;
  k += `<path d="M-4.2 ${r(-H + 2)} L4.2 ${r(-H + 2)} L1.2 ${r(-H - 1.2)} L-1.2 ${r(-H - 1.2)} Z" fill="#23292c"/><circle cx="0" cy="${r(-H - 1.8)}" r=".8" fill="#23292c"/>`;
  S.teil({ id: "laterne", de: "die Laterne", syl: "la-TER-ne", it: "il lampione", itSyl: "lam-PIO-ne", en: "street lamp", x: 248, y: Y, steht: true, kunst: k });
}
{
  const Y = 194, s = km(Y), H = 2.6 * s;
  let k = schatten(0, 0.3, 4, 1, 0.3);
  k += `<rect x="-.9" y="${r(-H)}" width="1.8" height="${r(H)}" fill="${S.lg("pfosten", [[0, "#3b3f43"], [0.5, "#80878d"], [1, "#2f3337"]], 0, 0, 1, 0)}"/><circle cx="0" cy="${r(-H - 0.5)}" r="1.1" fill="#3b3f43"/>`;
  const schild = (y, links, text, unter, flaggen) => {
    const w = 25, h = 5.2, x0 = links ? -w + 0.6 : -0.6;
    const pfad = links ? `M${r(x0)} ${r(y + h / 2)} L${r(x0 + 2.8)} ${r(y)} L${r(x0 + w)} ${r(y)} L${r(x0 + w)} ${r(y + h)} L${r(x0 + 2.8)} ${r(y + h)} Z` : `M${r(x0)} ${r(y)} L${r(x0 + w - 2.8)} ${r(y)} L${r(x0 + w)} ${r(y + h / 2)} L${r(x0 + w - 2.8)} ${r(y + h)} L${r(x0)} ${r(y + h)} Z`;
    let g = `<path d="${pfad}" fill="#f4efe2" stroke="#7a2a28" stroke-width=".45"/>`;
    const tx = x0 + w / 2 + (links ? 1.4 : -1.4) + (flaggen ? 3.2 : 0);
    g += `<text x="${r(tx)}" y="${r(y + 2.7)}" font-size="${flaggen ? 2.1 : 2.4}" text-anchor="middle" fill="#3a2a1c" font-family="Georgia,serif" font-weight="bold">${text}</text>`;
    g += `<text x="${r(tx)}" y="${r(y + 4.4)}" font-size="1.35" text-anchor="middle" fill="#6b5a44" font-family="Arial,sans-serif">${unter}</text>`;
    if (flaggen) {
      const fxx = x0 + 1, fyy = y + 0.7;
      /* Deutschland, Niederlande, Belgien */
      g += `<rect x="${r(fxx)}" y="${r(fyy)}" width="1.8" height=".42" fill="#1d1d1d"/><rect x="${r(fxx)}" y="${r(fyy + 0.42)}" width="1.8" height=".42" fill="#dd2a24"/><rect x="${r(fxx)}" y="${r(fyy + 0.84)}" width="1.8" height=".42" fill="#f2c62f"/>`;
      g += `<rect x="${r(fxx + 2)}" y="${r(fyy + 1.5)}" width="1.8" height=".42" fill="#ae1c28"/><rect x="${r(fxx + 2)}" y="${r(fyy + 1.92)}" width="1.8" height=".42" fill="#fff" stroke="#ddd" stroke-width=".05"/><rect x="${r(fxx + 2)}" y="${r(fyy + 2.34)}" width="1.8" height=".42" fill="#21468b"/>`;
      g += `<rect x="${r(fxx)}" y="${r(fyy + 3)}" width=".6" height="1.26" fill="#1d1d1d"/><rect x="${r(fxx + 0.6)}" y="${r(fyy + 3)}" width=".6" height="1.26" fill="#f2c62f"/><rect x="${r(fxx + 1.2)}" y="${r(fyy + 3)}" width=".6" height="1.26" fill="#dd2a24"/>`;
    }
    return g;
  };
  k += schild(-H + 1.4, true, "Elisenbrunnen", "Thermalwasser · 250 m");
  k += schild(-H + 7.6, true, "Dom", "Katschhof · 150 m");
  k += schild(-H + 13.8, false, "Puppenbrunnen", "Krämerstraße · 200 m");
  k += schild(-H + 20, false, "Dreiländereck", "Vaalserberg · 6 km", true);
  S.teil({ id: "wegweiser", de: "der Wegweiser", syl: "WEG-wei-ser", it: "il cartello indicatore", itSyl: "car-TEL-lo in-di-ca-TO-re", en: "signpost",
    x: 292, y: Y, steht: true, kunst: k,
    tipp: "Am Dreiländereck treffen sich Deutschland, die Niederlande und Belgien. Am Elisenbrunnen kommt warmes Wasser aus der Erde — es riecht nach Schwefel." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/aachen.js"));
console.log(aus);
