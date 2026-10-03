#!/usr/bin/env node
/* =====================================================================
   KÖLN (FASSUNG 852) — Bilderwelt neu: eine echte Stadtansicht
   ---------------------------------------------------------------------
   RECHERCHE (Structurae „Hohenzollernbrücke“, KuLaDig, koeln.de
   „Liebesschlösser“, Dombauhütte):
   - STANDORT: die große Sitztreppe am Rheinboulevard in Deutz, Blick über
     den Rhein nach Westen/Nordwesten — der beste Blick auf Dom und Brücke.
     Echte Reihenfolge von links nach rechts: Groß St. Martin mit den
     bunten Giebelhäusern am Fischmarkt, dann der Dom (Türme im Westen,
     davor nach rechts Langhaus, Querhaus und Chor mit dem „Wald“ aus
     Strebebögen und Fialen), dann die Hohenzollernbrücke, die von rechts
     vorn (Deutz) zum Hauptbahnhof neben dem Dom führt.
   - DOM: 157 m, dunkel verwitterter Sandstein, zwei Türme: unten
     viereckig, dann achteckiges Geschoss, durchbrochene Turmhelme mit
     Krabben, oben die Kreuzblume; über der Vierung der schlanke
     Dachreiter mit goldenem Stern; steiles, dunkles Bleidach.
   - BRÜCKE: Eisenbahnbrücke aus drei parallelen Fachwerkbögen je
     Brückenzug, drei Felder (119 m, 168 m, 123 m — das Stromfeld in der
     Mitte ist das größte), Steinpfeiler; am Fußweg der Südseite
     hunderttausende Liebesschlösser; ständig fahren Züge (ICE).
   - RHEIN: breit, grau-grün, Frachtschiffe (Binnenschiffe mit Steuerhaus
     am Heck) und Ausflugsschiffe.
   - Am Rheinboulevard sitzt man auf den Stufen, trinkt Kölsch aus der
     schlanken 0,2-l-Stange (im Brauhaus bringt der Köbes sie im Kranz);
     im Karneval trägt man die Narrenkappe in Rot-Weiß (Stadtfarben).
   Maßstab: Augenhöhe y = 112 (≈ 4 m über dem Wasser). Auf der Treppe
   gilt: Einheiten je Meter = (y − 112) · 0,45.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "koeln", titel: "Köln", emoji: "⛪", thema: "Deutschland", kuerzel: "b21c", fassung: 852 });
const rnd = zufall(1248);
const r = B.r;
const HOR = 112;
const km = (y) => (y - HOR) * 0.45;

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("wolke")}" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="2"/></filter>`);
S.def(`<filter id="${S.id("spiegel")}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="1.2 .5"/></filter>`);
const DOMSTEIN = S.lg("domstein", [[0, "#4b4843"], [0.35, "#77726a"], [0.65, "#5e5a54"], [1, "#3c3a36"]], 0, 0, 1, 0);
const DOMHELL = S.lg("domhell", [[0, "#6c675f"], [0.5, "#9a948a"], [1, "#5b5750"]], 0, 0, 1, 0);
const STAHL = "#6f7d78";
const STAHL_D = "#55625e";

/* =====================================================================
   KULISSE — Himmel, Altstadtufer, Museum, Bahnhof
   ===================================================================== */
S.hinten(`<rect width="320" height="${HOR + 4}" fill="${S.lg("himmel", [[0, "#6d9fd6"], [0.6, "#b2cde6"], [1, "#efe6d6"]])}"/>`);
{
  let w = "";
  for (const [x, y, s] of [[34, 22, 1], [150, 14, 0.8], [270, 30, 1.1], [210, 54, 0.6]]) {
    w += `<g filter="url(#${S.id("wolke")})" opacity=".9">`;
    for (const [dx, dy, rx, ry] of [[0, 0, 16, 5], [-10, 1.5, 10, 4], [11, 1, 12, 4.5], [-3, -3.5, 9, 5], [6, -4, 7, 4.5]])
      w += `<ellipse cx="${r(x + dx * s)}" cy="${r(y + dy * s)}" rx="${r(rx * s)}" ry="${r(ry * s)}" fill="#fff"/>`;
    w += `<ellipse cx="${x}" cy="${r(y + 3 * s)}" rx="${r(18 * s)}" ry="${r(2.2 * s)}" fill="#dde3ea"/></g>`;
  }
  S.hinten(w);
}
/* Bäume an der Frankenwerft, Museum Ludwig (Sheddach aus Zink), Bahnhofshalle */
{
  let c = "";
  c += `<rect x="0" y="${HOR - 2}" width="320" height="5" fill="#8a9f72"/>`;
  c += `<path d="M138 ${HOR - 1} L138 ${HOR - 7} L190 ${HOR - 7} L190 ${HOR - 1} Z" fill="#b9b2a6"/>`;
  for (let x = 138; x < 190; x += 5.2) c += `<path d="M${x} ${HOR - 7} L${r(x + 3.4)} ${HOR - 10} L${r(x + 5.2)} ${HOR - 7} Z" fill="${S.lg("zink", [[0, "#a7b0b6"], [1, "#78838b"]])}"/>`;
  c += `<path d="M184 ${HOR - 2} L184 ${HOR - 9} Q200 ${HOR - 20} 216 ${HOR - 9} L216 ${HOR - 2} Z" fill="#8e9aa0"/><path d="M186 ${HOR - 9} Q200 ${HOR - 18} 214 ${HOR - 9}" stroke="#c9d6dc" stroke-width=".6" fill="none"/>`;
  for (let x = 66; x < 140; x += 5 + rnd() * 3) c += `<circle cx="${r(x)}" cy="${r(HOR - 3 - rnd() * 2)}" r="${r(3 + rnd() * 1.6)}" fill="${S.rg("baum", [[0, "#8fae62"], [1, "#4f6e38"]], 0.6, 0.35, 0.7)}"/>`;
  /* Kaimauer gegenüber */
  c += `<rect x="0" y="${HOR + 1}" width="320" height="2" fill="${S.lg("kai", [[0, "#cfc4b2"], [1, "#9c9384"]])}"/>`;
  S.hinten(c);
}

/* =====================================================================
   1 — DIE MÖWE
   ===================================================================== */
{
  let k = `<path d="M-6 -1 Q-3 -3.4 0 0 Q3 -3.4 6 -1.2 Q3 -2 0 1 Q-3 -2 -6 -1 Z" fill="#fbfbf8" stroke="#8a9096" stroke-width=".25"/>`;
  k += `<path d="M-6 -1 l1.2 -.5 M6 -1.2 l-1.2 -.3" stroke="#2b2b2b" stroke-width=".5"/><ellipse cx="0" cy=".4" rx="1.2" ry=".7" fill="#fff"/><path d="M1 .3 l1 .2" stroke="#e8b83a" stroke-width=".35"/>`;
  S.teil({ oben: true, id: "moewe", de: "die Möwe", syl: "MÖ-we", it: "il gabbiano", itSyl: "gab-BIA-no", en: "seagull", x: 52, y: 40, kunst: `<g transform="scale(1.3)">${k}</g>` });
}

/* =====================================================================
   2 — GROSS ST. MARTIN (romanischer Vierungsturm mit vier Ecktürmchen)
   ===================================================================== */
{
  let k = "";
  const SM = S.lg("martin", [[0, "#b9a98e"], [0.5, "#ddd0b8"], [1, "#a8977b"]], 0, 0, 1, 0);
  /* Kleeblattchor (drei Apsiden) */
  for (const [x, w] of [[-14, 12], [0, 14], [14, 12]]) k += `<path d="M${x - w / 2} 0 L${x - w / 2} -10 Q${x} -15 ${x + w / 2} -10 L${x + w / 2} 0 Z" fill="${SM}"/><path d="M${x - w / 2} -10 Q${x} -15 ${x + w / 2} -10" stroke="#6b5f4e" stroke-width=".5" fill="none"/>`;
  for (const x of [-16, -12, -2, 2, 12, 16]) k += `<path d="M${x - 0.6} -3 L${x - 0.6} -7 Q${x} -8 ${x + 0.6} -7 L${x + 0.6} -3 Z" fill="#3f3a33"/>`;
  /* Vierungsturm mit Blendbögen, oben Giebel und Rautendach */
  k += `<rect x="-7" y="-40" width="14" height="30" fill="${SM}"/>`;
  for (const y of [-14, -22, -30]) for (const x of [-4.4, -1.4, 1.6, 4.6]) k += `<path d="M${x - 0.8} ${y} L${x - 0.8} ${y - 4.6} Q${x} ${y - 5.6} ${x + 0.8} ${y - 4.6} L${x + 0.8} ${y} Z" fill="${y === -30 ? "#3f3a33" : "#a8977b"}"/>`;
  k += `<path d="M-7 -40 L-3.5 -45 L0 -40 L3.5 -45 L7 -40 Z" fill="${SM}"/>`;
  k += `<path d="M-7.4 -40 L0 -54 L7.4 -40 Z" fill="${S.lg("martindach", [[0, "#6f7f7a"], [1, "#4d5a56"]])}"/><path d="M0 -54 L0 -57" stroke="#3f3a33" stroke-width=".3"/>`;
  /* vier schlanke Ecktürmchen */
  for (const x of [-8.6, 8.6]) {
    k += `<rect x="${x - 1.5}" y="-46" width="3" height="36" fill="${SM}"/>`;
    k += `<path d="M${x - 1.7} -46 L${x} -53 L${x + 1.7} -46 Z" fill="#5a6863"/>`;
    for (const y of [-20, -30, -40]) k += `<rect x="${x - 0.5}" y="${y}" width="1" height="2.4" fill="#3f3a33"/>`;
  }
  k += `<rect x="-7" y="-40" width="2.4" height="30" fill="#000" opacity=".12"/>`;
  S.teil({ id: "kirche", de: "die Kirche Groß St. Martin", syl: "GROSS sankt MAR-tin", it: "la chiesa di San Martino", itSyl: "CHIE-sa di san mar-TI-no", en: "Great St. Martin Church",
    x: 34, y: HOR - 4, kunst: k, tipp: "Groß St. Martin ist eine alte romanische Kirche in der Kölner Altstadt." });
}

/* =====================================================================
   3 — DIE ALTSTADT (bunte schmale Giebelhäuser am Fischmarkt)
   ===================================================================== */
{
  let k = "";
  const farben = ["#d9534a", "#f2c45a", "#7fb685", "#e9e1cf", "#6fa3d6", "#e58fa1", "#f0a35a", "#b6d07a", "#d9534a", "#f2c45a", "#9fc6e8", "#e9e1cf"];
  let x = 0;
  farben.forEach((f, i) => {
    const w = 5.2 + (i % 3) * 0.9, h = 12 + ((i * 7) % 5);
    k += `<rect x="${r(x)}" y="${r(-h)}" width="${r(w)}" height="${r(h)}" fill="${f}"/>`;
    if (i % 2) k += `<path d="M${r(x)} ${r(-h)} L${r(x + w / 2)} ${r(-h - 4)} L${r(x + w)} ${r(-h)} Z" fill="${f}"/>`;
    else k += `<path d="M${r(x)} ${r(-h)} L${r(x)} ${r(-h - 1.4)} L${r(x + 1)} ${r(-h - 1.4)} L${r(x + 1)} ${r(-h - 2.8)} L${r(x + w - 1)} ${r(-h - 2.8)} L${r(x + w - 1)} ${r(-h - 1.4)} L${r(x + w)} ${r(-h - 1.4)} L${r(x + w)} ${r(-h)} Z" fill="${f}"/>`;
    for (let row = 0; row < 4; row++) for (let c = 0; c < 2; c++) k += `<rect x="${r(x + 0.9 + c * (w - 2.8) / 1)}" y="${r(-h + 1.4 + row * 2.8)}" width="1" height="1.6" fill="#3d4650" opacity=".8"/>`;
    k += `<rect x="${r(x + w / 2 - 0.9)}" y="-2.6" width="1.8" height="2.6" fill="#4a3a2a"/>`;
    k += `<rect x="${r(x)}" y="${r(-h)}" width=".4" height="${r(h)}" fill="#000" opacity=".12"/>`;
    x += w;
  });
  k += `<rect x="0" y="-1" width="${r(x)}" height="1" fill="#6b6257"/>`;
  S.teil({ id: "altstadt", de: "die Altstadt", syl: "ALT-stadt", it: "il centro storico", itSyl: "CEN-tro STO-ri-co", en: "old town",
    x: 2, y: HOR - 1, kunst: k, tipp: "Die bunten Häuser am Rhein gehören zur Kölner Altstadt." });
}

/* =====================================================================
   4 — DER KÖLNER DOM (Türme links, Langhaus und Chor nach rechts)
       Lupe: Turm, Portal, Fenster
   ===================================================================== */
{
  const DX = 92, DY = HOR - 4;
  let k = "";
  /* Langhaus, Querhaus und Chor mit Strebewerk (rechts der Türme) */
  k += `<path d="M14 0 L14 -24 L80 -24 L86 -18 L86 0 Z" fill="${DOMSTEIN}"/>`;
  k += `<path d="M12 -24 L22 -38 L72 -38 L84 -24 Z" fill="${S.lg("domdach", [[0, "#3f4547"], [1, "#2b3032"]])}"/>`;
  k += `<path d="M22 -38 L72 -38" stroke="#5f686b" stroke-width=".5"/>`;
  for (let x = 16; x < 84; x += 4.3) {
    k += `<path d="M${r(x)} 0 L${r(x)} -26 L${r(x + 0.8)} -31 L${r(x + 1.6)} -26 L${r(x + 1.6)} 0 Z" fill="${DOMHELL}"/>`;
    k += `<path d="M${r(x + 1.6)} -20 Q${r(x + 3)} -24 ${r(x + 4.3)} -27" stroke="#5b5750" stroke-width=".6" fill="none"/>`;
    k += `<path d="M${r(x + 2.2)} -4 L${r(x + 2.2)} -16 Q${r(x + 2.9)} -18 ${r(x + 3.6)} -16 L${r(x + 3.6)} -4 Z" fill="#2c3036"/>`;
  }
  /* Querhaus-Südgiebel mit großem Maßwerkfenster und Rose */
  k += `<path d="M40 0 L40 -30 L49 -44 L58 -30 L58 0 Z" fill="${DOMHELL}"/>`;
  k += `<path d="M43 -4 L43 -24 Q49 -32 55 -24 L55 -4 Z" fill="${S.lg("fenster", [[0, "#3a4a5e"], [1, "#22272e"]])}"/>`;
  k += `<circle cx="49" cy="-24" r="2.4" fill="none" stroke="#8d877c" stroke-width=".4"/><line x1="49" y1="-21.6" x2="49" y2="-4" stroke="#8d877c" stroke-width=".35"/><line x1="46" y1="-20" x2="46" y2="-4" stroke="#8d877c" stroke-width=".3"/><line x1="52" y1="-20" x2="52" y2="-4" stroke="#8d877c" stroke-width=".3"/>`;
  for (const x of [40, 58]) k += `<path d="M${x - 1} -30 L${x} -40 L${x + 1} -30 Z" fill="#6c675f"/>`;
  /* Dachreiter über der Vierung mit goldenem Stern */
  k += `<path d="M47.6 -38 L48 -48 L50 -48 L50.4 -38 Z" fill="#3a3f42"/><path d="M47.6 -48 L49 -62 L50.4 -48 Z" fill="#3a3f42"/>`;
  k += `<path d="M49 -65.6 l.6 1.4 1.5 .1 -1.2 1 .4 1.5 -1.3 -.8 -1.3 .8 .4 -1.5 -1.2 -1 1.5 -.1 Z" fill="#f2c62f"/>`;
  /* Chor: Fialenwald am rechten Ende */
  for (let i = 0; i < 6; i++) { const x = 70 + i * 2.6; k += `<path d="M${r(x)} -18 L${r(x + 0.7)} -${r(30 - Math.abs(i - 2.5) * 1.4)} L${r(x + 1.4)} -18 Z" fill="#6c675f"/>`; }
  /* die beiden Türme */
  const turm = (tx, hell) => {
    let g = "";
    const F = hell ? DOMHELL : DOMSTEIN;
    g += `<rect x="${tx - 8}" y="-56" width="16" height="56" fill="${F}"/>`;
    /* Strebepfeiler an den Ecken */
    for (const sx of [-8, 6]) g += `<path d="M${tx + sx} 0 L${tx + sx} -58 L${tx + sx + 1} -61 L${tx + sx + 2} -58 L${tx + sx + 2} 0 Z" fill="${hell ? "#8d877c" : "#5e5a54"}"/>`;
    /* Geschosse mit hohen Spitzbogenfenstern und Wimpergen */
    for (const [y, h] of [[-4, 14], [-22, 14], [-40, 13]]) {
      for (const dx of [-3.2, 1.2]) {
        g += `<path d="M${tx + dx} ${y} L${tx + dx} ${y - h + 2} Q${tx + dx + 1} ${y - h} ${tx + dx + 2} ${y - h + 2} L${tx + dx + 2} ${y} Z" fill="#2c3036"/>`;
        g += `<line x1="${tx + dx + 1}" y1="${y}" x2="${tx + dx + 1}" y2="${y - h + 1}" stroke="#77726a" stroke-width=".25"/>`;
      }
      g += `<path d="M${tx - 5} ${y - h + 1} L${tx} ${y - h - 4} L${tx + 5} ${y - h + 1}" stroke="${hell ? "#a9a397" : "#7a756c"}" stroke-width=".6" fill="none"/>`;
    }
    /* achteckiges Geschoss */
    g += `<path d="M${tx - 7} -56 L${tx - 6} -70 L${tx + 6} -70 L${tx + 7} -56 Z" fill="${F}"/>`;
    for (const dx of [-4, -0.9, 2.2]) g += `<path d="M${tx + dx} -57 L${tx + dx} -67 Q${tx + dx + 0.85} -68.6 ${tx + dx + 1.7} -67 L${tx + dx + 1.7} -57 Z" fill="#2c3036"/>`;
    for (const dx of [-6.6, 6.6]) g += `<path d="M${tx + dx - 0.7} -56 L${tx + dx} -74 L${tx + dx + 0.7} -56 Z" fill="${hell ? "#a9a397" : "#77726a"}"/>`;
    /* durchbrochener Turmhelm mit Krabben und Kreuzblume */
    g += `<path d="M${tx - 6} -70 L${tx} -101 L${tx + 6} -70 Z" fill="${F}"/>`;
    for (let i = 1; i < 6; i++) { const y = -70 - i * 5, w = 6 * (1 - i * 5 / 31); g += `<line x1="${r(tx - w)}" y1="${y}" x2="${r(tx + w)}" y2="${y}" stroke="#2c3036" stroke-width=".7"/>`; }
    g += `<path d="M${tx - 3.4} -71 L${tx - 0.4} -97 M${tx + 3.4} -71 L${tx + 0.4} -97" stroke="#2c3036" stroke-width=".5"/>`;
    for (let i = 0; i < 9; i++) { const t = (i + 0.6) / 10, y = -70 - t * 31, w = 6 * (1 - t); g += `<circle cx="${r(tx - w - 0.5)}" cy="${r(y)}" r=".5" fill="${F}"/><circle cx="${r(tx + w + 0.5)}" cy="${r(y)}" r=".5" fill="${F}"/>`; }
    g += `<path d="M${tx} -101 l-1.8 -1 l1.8 -2.4 l1.8 2.4 Z M${tx - 0.4} -104.6 h.8 v-1.6 h-.8 Z" fill="${F}"/>`;
    return g;
  };
  k += turm(-10, false) + turm(10, true);
  /* Westfassade zwischen den Türmen (Hauptportal, tief im Schatten) */
  k += `<rect x="-2" y="-46" width="4" height="46" fill="#4b4843"/><path d="M-1.6 0 L-1.6 -12 L0 -15 L1.6 -12 L1.6 0 Z" fill="#23262b"/>`;
  k += `<path d="M-2.2 -46 L0 -54 L2.2 -46 Z" fill="#5e5a54"/>`;
  k += `<rect x="-18" y="-104" width="104" height="104" fill="${S.lg("domlicht", [[0, "#fff", 0.06], [0.5, "#fff", 0], [1, "#000", 0.08]], 0, 0, 1, 0)}" pointer-events="none" opacity="0"/>`;
  S.teil({ id: "dom", de: "der Kölner Dom", syl: "KÖL-ner DOM", it: "il Duomo di Colonia", itSyl: "DUO-mo di co-LO-nia", en: "Cologne Cathedral",
    x: DX, y: DY, kunst: k, tipp: "Der Kölner Dom ist 157 Meter hoch. Man hat über 600 Jahre an ihm gebaut.",
    zoom: { x: DX - 22, y: DY - 108, w: 110, h: 110 },
    unter: [
      { id: "turm", de: "der Turm", syl: "TURM", it: "la torre", itSyl: "TOR-re", en: "tower", x: DX + 10, y: DY - 70, kunst: flaeche(-6, -35, 12, 35),
        tipp: "Oben auf jedem Turm sitzt eine Kreuzblume aus Stein." },
      { id: "portal", de: "das Portal", syl: "por-TAL", it: "il portale", itSyl: "por-TA-le", en: "portal", x: DX, y: DY, kunst: flaeche(-2.4, -16, 4.8, 16, 0.5) },
      { id: "fenster", de: "das Fenster", syl: "FENS-ter", it: "la finestra", itSyl: "fi-NE-stra", en: "window", x: DX + 49, y: DY - 4, kunst: flaeche(-6, -28, 12, 28),
        tipp: "Die Fenster im Dom sind aus buntem Glas." },
    ] });
}

/* =====================================================================
   5 — DER RHEIN
   ===================================================================== */
{
  const Y0 = HOR + 3, Y1 = 152;
  let k = `<rect x="0" y="${Y0}" width="320" height="${Y1 - Y0}" fill="${S.lg("wasser", [[0, "#a8b8b6"], [0.4, "#7e9490"], [1, "#556a64"]])}"/>`;
  k += `<g filter="url(#${S.id("spiegel")})" opacity=".3">`;
  k += `<rect x="74" y="${Y0}" width="36" height="22" fill="#4b4843"/><rect x="106" y="${Y0}" width="72" height="9" fill="#5e5a54"/><rect x="0" y="${Y0}" width="70" height="8" fill="#e0a070"/><rect x="26" y="${Y0}" width="16" height="16" fill="#c9b99c"/>`;
  k += `</g>`;
  for (let i = 0; i < 150; i++) {
    const y = Y0 + 1 + Math.pow(rnd(), 0.75) * (Y1 - Y0 - 2), w = 1.2 + (y - Y0) * 0.2 * rnd() + 1;
    k += `<path d="M${r(rnd() * 320)} ${r(y)} q${r(w / 2)} -.5 ${r(w)} 0" stroke="${rnd() < 0.55 ? "#e7eeee" : "#3e524d"}" stroke-width="${r(0.15 + (y - Y0) * 0.009)}" fill="none" opacity="${r(0.3 + rnd() * 0.4)}"/>`;
  }
  S.teil({ id: "rhein", de: "der Rhein", syl: "RHEIN", it: "il Reno", itSyl: "RE-no", en: "the Rhine", x: 0, y: 0, kunst: k,
    tipp: "Der Rhein ist einer der längsten Flüsse in Europa. Viele Schiffe fahren auf ihm." });
}

/* =====================================================================
   6 — DAS SCHIFF (Binnenschiff, fährt rheinaufwärts nach links)
   ===================================================================== */
{
  let k = schatten(0, 0, 50, 1.5, 0.25);
  k += `<path d="M-52 -.6 q-4 .8 -9 .2 M50 .4 q8 .9 18 .3" stroke="#eef3f2" stroke-width=".5" fill="none" opacity=".8"/>`;
  k += `<path d="M-52 -5.6 L48 -5.6 L49 -1 Q48 .4 46 .4 L-46 .4 Q-50 .2 -52 -5.6 Z" fill="${S.lg("rumpf", [[0, "#2a2d31"], [0.6, "#1b1d20"], [0.61, "#a3201f"], [1, "#7d1616"]])}"/>`;
  k += `<rect x="-50" y="-6.4" width="96" height=".9" fill="#d9d4c7"/>`;
  /* Laderaum mit Containern */
  const farben = ["#c9302c", "#2d6fb3", "#3c8f5a", "#e0a82e", "#7a7f86", "#c9302c", "#2d6fb3", "#e0a82e", "#3c8f5a", "#7a7f86"];
  for (let i = 0; i < 10; i++) {
    const x = -46 + i * 7.4;
    k += `<rect x="${r(x)}" y="-11" width="7.1" height="4.6" fill="${farben[i]}"/>`;
    for (let j = 1; j < 5; j++) k += `<line x1="${r(x + j * 1.42)}" y1="-10.6" x2="${r(x + j * 1.42)}" y2="-6.8" stroke="#000" stroke-width=".15" opacity=".35"/>`;
    if (i % 3 !== 1) k += `<rect x="${r(x + 0.2)}" y="-15.6" width="6.7" height="4.6" fill="${farben[(i + 4) % 10]}"/>`;
  }
  /* Wohnung und Steuerhaus am Heck (rechts), Flagge, Auto an Deck */
  k += `<rect x="30" y="-12" width="16" height="5.6" fill="#f4f1ea"/>`;
  for (let x = 32; x < 46; x += 3.2) k += `<rect x="${x}" y="-10.6" width="2" height="1.8" fill="#3d4f5e"/>`;
  k += `<rect x="36" y="-18" width="9" height="6" fill="#f4f1ea"/><rect x="36.6" y="-17" width="7.8" height="2.4" fill="#2e4658"/><rect x="35.4" y="-18.8" width="10.2" height="1" fill="#1f2a33"/>`;
  k += `<line x1="47" y1="-6" x2="47" y2="-14" stroke="#8a8f94" stroke-width=".3"/><rect x="47" y="-14" width="3.6" height=".9" fill="#1d1d1d"/><rect x="47" y="-13.1" width="3.6" height=".9" fill="#dd2a24"/><rect x="47" y="-12.2" width="3.6" height=".9" fill="#f2c62f"/>`;
  k += `<text x="-24" y="-1.6" font-size="2.3" fill="#e9e5da" font-family="Arial,sans-serif" font-weight="bold" letter-spacing=".3">RHEINLAND</text>`;
  S.teil({ id: "schiff", de: "das Schiff", syl: "SCHIFF", it: "la nave", itSyl: "NA-ve", en: "ship", x: 64, y: 131, kunst: `<g transform="scale(.82)">${k}</g>`,
    tipp: "Auf dem Rhein fahren große Frachtschiffe — hier mit Containern." });
}

/* =====================================================================
   7 — DIE BRÜCKE (Hohenzollernbrücke) — Lupe: Liebesschloss
       8 — DER ZUG (ICE auf der Brücke)
   ===================================================================== */
const BR = { x0: 168, x1: 318 };
const sc = (s) => 1 / (2 - s);                       /* Maßstab: hinten 0,5, vorn 1 */
const bx = (s) => BR.x0 + (BR.x1 - BR.x0) * (2 * s / (1 + s));
const K = 1.5;
const by = (s, hm, tief = 0) => HOR - (hm - 4) * K * sc(s) + tief * 1.6 * sc(s);  /* hm: Höhe über dem Wasser; tief: Bogen weiter hinten */
const FELDER = [[0, 0.29], [0.29, 0.70], [0.70, 1]];
const bogenPfad = (a, b, tief, hoch) => {
  let d = "";
  for (let i = 0; i <= 16; i++) {
    const t = i / 16, s = a + (b - a) * t, h = 17 + hoch * (1 - Math.pow(2 * t - 1, 2));
    d += `${i ? "L" : "M"}${r(bx(s) - tief * 2.2 * sc(s))} ${r(by(s, h, tief))} `;
  }
  return d;
};
const bogenTeil = (tief, farbe, breite) => {
  let g = "";
  FELDER.forEach(([a, b], j) => {
    const hoch = j === 1 ? 26 : 19;
    /* Obergurt (Bogen) und Untergurt (Zugband, mit dem Gleis) */
    g += `<path d="${bogenPfad(a, b, tief, hoch)}" stroke="${farbe}" stroke-width="${breite}" fill="none" stroke-linejoin="round"/>`;
    g += `<path d="${bogenPfad(a, b, tief, hoch * 0.82)}" stroke="${farbe}" stroke-width="${r(breite * 0.45)}" fill="none"/>`;
    /* Fachwerk: Pfosten und Diagonalen */
    for (let i = 1; i < 12; i++) {
      const t = i / 12, s = a + (b - a) * t, h = 17 + hoch * (1 - Math.pow(2 * t - 1, 2));
      const x = bx(s) - tief * 2.2 * sc(s);
      g += `<line x1="${r(x)}" y1="${r(by(s, h, tief))}" x2="${r(x)}" y2="${r(by(s, 17, tief))}" stroke="${farbe}" stroke-width="${r(breite * 0.32)}"/>`;
      const t2 = (i + 1) / 12, s2 = a + (b - a) * t2, x2 = bx(s2) - tief * 2.2 * sc(s2), h2 = 17 + hoch * (1 - Math.pow(2 * t2 - 1, 2));
      if (i < 11) g += `<line x1="${r(x)}" y1="${r(by(s, i % 2 ? h : 17, tief))}" x2="${r(x2)}" y2="${r(by(s2, i % 2 ? 17 : h2, tief))}" stroke="${farbe}" stroke-width="${r(breite * 0.22)}"/>`;
    }
  });
  return g;
};
{
  let k = "";
  /* hinterer und mittlerer Brückenzug */
  k += bogenTeil(2, "#7d8a86", 1);
  k += bogenTeil(1, STAHL_D, 1.2);
  /* Fahrbahn (Zugband) über die ganze Länge */
  const deckO = [], deckU = [];
  for (let i = 0; i <= 20; i++) { const s = i / 20; deckO.push(`${r(bx(s))} ${r(by(s, 17))}`); deckU.push(`${r(bx(s))} ${r(by(s, 14.6))}`); }
  k += `<path d="M${deckO.join(" L")} L${deckU.reverse().join(" L")} Z" fill="${S.lg("deck", [[0, "#5c6a66"], [1, "#46524e"]])}"/>`;
  /* Pfeiler aus Sandstein */
  for (const s of [0, 0.29, 0.7, 1]) {
    const x = bx(s), w = 6 * sc(s);
    k += `<path d="M${r(x - w)} ${r(by(s, 14.6))} L${r(x + w)} ${r(by(s, 14.6))} L${r(x + w * 1.15)} ${r(by(s, 0))} L${r(x - w * 1.15)} ${r(by(s, 0))} Z" fill="${S.lg("pfeiler", [[0, "#c9b99c"], [1, "#9c8c70"]], 0, 0, 1, 0)}"/>`;
    k += `<path d="M${r(x - w * 1.2)} ${r(by(s, 0))} L${r(x + w * 1.2)} ${r(by(s, 0))}" stroke="#3e524d" stroke-width=".6" opacity=".6"/>`;
  }
  /* Fußweg-Geländer der Südseite mit den Liebesschlössern */
  const gel = [];
  for (let i = 0; i <= 20; i++) { const s = i / 20; gel.push([bx(s), by(s, 15.4), by(s, 14.2)]); }
  k += `<path d="M${gel.map((p) => `${r(p[0])} ${r(p[1] - 2.2 * sc((p[0] - BR.x0) / (BR.x1 - BR.x0)))}`).join(" L")}" stroke="#3f4a47" stroke-width=".5" fill="none"/>`;
  for (let i = 0; i < 520; i++) {
    const s = Math.pow(rnd(), 0.55), x = bx(s), y = by(s, 14.6) - rnd() * 2.2 * sc(s);
    k += `<rect x="${r(x)}" y="${r(y)}" width="${r(0.7 * sc(s))}" height="${r(0.8 * sc(s))}" rx=".15" fill="${["#d62b2b", "#f2c62f", "#2d6fb3", "#e46aa0", "#c9cfd4", "#3ca35a", "#c88a2e", "#9a5fc0"][i % 8]}"/>`;
  }
  S.teil({ id: "bruecke", de: "die Brücke", syl: "BRÜ-cke", it: "il ponte", itSyl: "PON-te", en: "bridge", x: 0, y: 0, kunst: k,
    tipp: "Über die Hohenzollernbrücke fahren jeden Tag über 1200 Züge.",
    zoom: { x: 228, y: 64, w: 92, h: 62 },
    unter: [
      { id: "liebesschloss", de: "das Liebesschloss", syl: "LIE-bes-schloss", it: "il lucchetto dell'amore", itSyl: "luc-CHET-to del-la-MO-re", en: "love padlock",
        x: bx(0.85), y: by(0.85, 14.6), kunst: flaeche(-14, -4, 28, 4.6, 0.5),
        tipp: "Verliebte hängen ein Schloss an die Brücke und werfen den Schlüssel in den Rhein." },
    ] });
}
{
  /* ICE auf dem vorderen Gleis, fährt nach links zum Hauptbahnhof */
  const a = 0.36, b = 0.82;
  const oben = [], unten = [];
  for (let i = 0; i <= 14; i++) { const s = a + (b - a) * i / 14; oben.push([bx(s) - 1.1 * sc(s), by(s, 21.4, 0.5)]); unten.push([bx(s) - 1.1 * sc(s), by(s, 17.2, 0.5)]); }
  let k = `<path d="M${r(oben[0][0] + 3)} ${r(oben[0][1])} ${oben.slice(1).map((p) => `L${r(p[0])} ${r(p[1])}`).join(" ")} L${r(unten[14][0])} ${r(unten[14][1])} ${unten.slice(0, 14).reverse().map((p) => `L${r(p[0])} ${r(p[1])}`).join(" ")} Q${r(unten[0][0] - 2)} ${r(unten[0][1] - 1)} ${r(oben[0][0] + 3)} ${r(oben[0][1])} Z" fill="${S.lg("ice", [[0, "#ffffff"], [1, "#d9dde0"]])}"/>`;
  const band = (h0, h1, f) => { const o = [], u = []; for (let i = 0; i <= 14; i++) { const s = a + (b - a) * i / 14; o.push(`${r(bx(s) - 1.1 * sc(s) + (i ? 0 : 3))} ${r(by(s, h1, 0.5))}`); u.push(`${r(bx(s) - 1.1 * sc(s) + (i ? 0 : 2))} ${r(by(s, h0, 0.5))}`); } return `<path d="M${o.join(" L")} L${u.reverse().join(" L")} Z" fill="${f}"/>`; };
  k += band(19.2, 20.4, "#26313b") + band(17.7, 18.3, "#d4161c");
  for (let i = 1; i < 6; i++) { const s = a + (b - a) * i / 6; k += `<line x1="${r(bx(s) - 1.1 * sc(s))}" y1="${r(by(s, 21.2, 0.5))}" x2="${r(bx(s) - 1.1 * sc(s))}" y2="${r(by(s, 17.4, 0.5))}" stroke="#9aa3aa" stroke-width=".25"/>`; }
  S.teil({ id: "zug", de: "der Zug", syl: "ZUG", it: "il treno", itSyl: "TRE-no", en: "train", x: 0, y: 0, kunst: k, tipp: "Der ICE fährt zum Kölner Hauptbahnhof direkt neben dem Dom." });
}
/* der vordere Brückenzug liegt vor dem Zug (fängt keinen Tipp ab) */
S.davor(bogenTeil(0, STAHL, 1.4));

/* =====================================================================
   9 — DIE TREPPE am Rheinboulevard (Sitzstufen aus Beton)
   ===================================================================== */
const STUFEN = [152, 156.5, 162, 168.5, 176.5, 186, 197.5];
{
  let k = `<rect x="0" y="${STUFEN[0] - 1.5}" width="320" height="${201.5 - STUFEN[0]}" fill="${S.lg("beton", [[0, "#cfc9bd"], [1, "#b7b0a3"]])}"/>`;
  k += `<rect x="0" y="${STUFEN[0] - 1.5}" width="320" height="2" fill="#8e877b"/>`;
  STUFEN.forEach((y, i) => {
    if (i === 0) return;
    const h = (y - HOR) * 0.04;
    k += `<rect x="0" y="${r(y - h - 0.4)}" width="320" height="${r(h + 0.4)}" fill="${S.lg("kante" + i, [[0, "#ece7dd"], [1, "#d8d2c6"]])}"/>`;
    k += `<rect x="0" y="${r(y - h - 0.6)}" width="320" height=".5" fill="#8e877b" opacity=".7"/>`;
  });
  for (let i = 0; i < 260; i++) k += `<circle cx="${r(rnd() * 320)}" cy="${r(152 + rnd() * 48)}" r="${r(0.15 + rnd() * 0.3)}" fill="${rnd() < 0.5 ? "#e9e4da" : "#9e978a"}" opacity=".5"/>`;
  /* Fugen zwischen den Betonblöcken, zum Fluchtpunkt hin (am Bildrand abgeschnitten) */
  for (let i = -8; i <= 8; i++) {
    let xa = 160 + i * 26, ya = STUFEN[0], xb = 160 + i * 58, yb = 200;
    for (const g of [0, 320]) {
      if ((xa - g) * (xb - g) < 0) { const t = (g - xa) / (xb - xa), yg = ya + (yb - ya) * t; if (Math.abs(xb - 160) > Math.abs(g - 160)) { xb = g; yb = yg; } else { xa = g; ya = yg; } }
    }
    if (xa < 0 || xa > 320) continue;
    k += `<line x1="${r(xa)}" y1="${r(ya)}" x2="${r(xb)}" y2="${r(yb)}" stroke="#a49d90" stroke-width=".25" opacity=".6"/>`;
  }
  /* Schattenkante unter jeder Stufe */
  STUFEN.forEach((y, i) => { if (i) k += `<rect x="0" y="${r(y - 0.2)}" width="320" height="${r((y - HOR) * 0.012 + 0.3)}" fill="#6e675c" opacity=".35"/>`; });
  S.teil({ id: "treppe", de: "die Treppe", syl: "TREP-pe", it: "la scalinata", itSyl: "sca-li-NA-ta", en: "steps", x: 0, y: 0, kunst: k,
    tipp: "Auf der großen Treppe am Rhein sitzen viele Leute und schauen auf den Dom." });
}

/* =====================================================================
   10 — DIE FRAU (sitzt auf der Stufe, von hinten) mit 11 — DER NARRENKAPPE
   ===================================================================== */
const FRAU = { x: 150, y: STUFEN[4] };
const frau = B.mensch({ id: "b21c_frau", geschlecht: "w", pose: "sitzen", blick: 180, frisur: "lang", haarfarbe: "braun", haut: "hell",
  kleidung: { oberteil: { stueck: "pullover", farbe: "weiss" }, unterteil: { stueck: "jeans" }, jacke: { stueck: "jacke", farbe: "rot" }, schuhe: { stueck: "turnschuh" } } }, 1.68 * km(FRAU.y + 4));
{
  const sitzY = frau.z.sitz.y * frau.k;
  S.def(`<clipPath id="${S.id("sitzt")}"><rect x="-40" y="-80" width="80" height="${r(80 + sitzY + 1.2)}"/></clipPath>`);
  let k = schatten(0, sitzY + 0.6, 9, 1.4, 0.35);
  k += `<g transform="translate(0 ${r(-sitzY)})"><g clip-path="url(#${S.id("sitzt")})">${frau.svg}</g></g>`;
  S.teil({ id: "frau", de: "die Frau", syl: "FRAU", it: "la donna", itSyl: "DON-na", en: "woman", x: FRAU.x, y: FRAU.y, kunst: k,
    tipp: "Sie sitzt auf der Treppe am Rhein und schaut auf den Dom." });
}
{
  /* Narrenkappe: drei Zipfel in Rot und Weiß mit goldenen Schellen */
  const sitzY = frau.z.sitz.y * frau.k;
  const kx = frau.z.kopf.x * frau.k, ky = (frau.z.kopf.y - frau.z.sitz.y) * frau.k;
  const s = frau.k / 0.3;
  const p = (x, y) => `${r(kx + x * s)} ${r(ky + y * s)}`;
  let k = `<path d="M${p(-3.4, -1.4)} Q${p(-6.4, -5)} ${p(-7.2, -3)} Q${p(-5, -6.6)} ${p(-1.6, -4.4)} Q${p(-0.6, -9.6)} ${p(0.4, -10)} Q${p(1, -7)} ${p(1.8, -4.4)} Q${p(5.4, -7)} ${p(7.4, -3.4)} Q${p(6, -4.4)} ${p(3.4, -1.4)} Z" fill="${S.lg("kappe", [[0, "#e3262b"], [1, "#a8171c"]])}"/>`;
  k += `<path d="M${p(-1.6, -4.4)} Q${p(-0.6, -9.6)} ${p(0.4, -10)} Q${p(1, -7)} ${p(1.8, -4.4)} Z" fill="#fbfaf6"/>`;
  k += `<path d="M${p(-3.6, -1.2)} Q${p(0, -2.4)} ${p(3.6, -1.2)} L${p(3.4, 0.2)} Q${p(0, -1)} ${p(-3.4, 0.2)} Z" fill="#fbfaf6"/>`;
  for (const [x, y] of [[-7.2, -3], [0.4, -10], [7.4, -3.4]]) k += `<circle cx="${r(kx + x * s)}" cy="${r(ky + y * s)}" r="${r(0.75 * s)}" fill="${S.rg("schelle", [[0, "#fff3b0"], [1, "#c8921e"]], 0.35, 0.35, 0.7)}"/>`;
  void sitzY;
  S.teil({ oben: true, id: "narrenkappe", de: "die Narrenkappe", syl: "NAR-ren-kap-pe", it: "il cappello da giullare", itSyl: "cap-PEL-lo da giul-LA-re", en: "jester cap",
    x: FRAU.x, y: FRAU.y, kunst: k, tipp: "Im Karneval trägt man in Köln die Narrenkappe. Man ruft: „Kölle Alaaf!“" });
}

{
  /* DER MANN — sitzt weiter unten auf der Treppe, auch mit Blick zum Dom */
  const Y = STUFEN[2], m = B.mensch({ id: "b21c_mann", geschlecht: "m", pose: "sitzen", blick: 190, frisur: "kurz", haarfarbe: "schwarz", haut: "mittel",
    kleidung: { oberteil: { stueck: "tshirt", farbe: "blau" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" }, zubehoer: { stueck: "rucksack", farbe: "gruen_d" } } }, 1.78 * km(Y + 3));
  const sitzY = m.z.sitz.y * m.k;
  S.def(`<clipPath id="${S.id("sitzt2")}"><rect x="-40" y="-80" width="80" height="${r(80 + sitzY + 0.9)}"/></clipPath>`);
  let k = schatten(0, sitzY + 0.5, 7, 1.1, 0.35);
  k += `<g transform="translate(0 ${r(-sitzY)})"><g clip-path="url(#${S.id("sitzt2")})">${m.svg}</g></g>`;
  S.teil({ id: "mann", de: "der Mann", syl: "MANN", it: "l'uomo", itSyl: "UO-mo", en: "man", x: 236, y: Y, kunst: k });
}

/* =====================================================================
   12 — DAS KÖLSCH (Stange auf der Stufe) und 13 — DER KÖLSCHKRANZ
   ===================================================================== */
const STANGE = (x, y, h) => {
  const w = h * 0.3;
  let g = `<rect x="${r(x - w / 2)}" y="${r(y - h)}" width="${r(w)}" height="${r(h)}" rx="${r(w * 0.12)}" fill="${S.lg("glas", [[0, "#cfe1e6", 0.8], [0.3, "#fff", 0.95], [1, "#a9c2c9", 0.85]], 0, 0, 1, 0)}"/>`;
  g += `<rect x="${r(x - w / 2 + 0.25)}" y="${r(y - h * 0.84)}" width="${r(w - 0.5)}" height="${r(h * 0.8)}" fill="${S.lg("koelsch", [[0, "#f7d66a"], [1, "#e0a92a"]], 0, 0, 1, 0)}"/>`;
  g += `<rect x="${r(x - w / 2 + 0.2)}" y="${r(y - h * 0.97)}" width="${r(w - 0.4)}" height="${r(h * 0.15)}" rx=".3" fill="#fffaf0"/>`;
  g += `<rect x="${r(x - w / 2 + 0.35)}" y="${r(y - h * 0.8)}" width="${r(w * 0.18)}" height="${r(h * 0.7)}" fill="#fff" opacity=".5"/>`;
  return g;
};
{
  const s = km(FRAU.y);
  let k = schatten(0, 0.1, 2.4, 0.5, 0.3) + STANGE(0, 0, 0.24 * s);
  S.teil({ oben: true, id: "koelsch", de: "das Kölsch", syl: "KÖLSCH", it: "la birra di Colonia", itSyl: "BIR-ra di co-LO-nia", en: "Koelsch beer",
    x: FRAU.x + 13, y: FRAU.y - 0.5, steht: true, kunst: k, tipp: "Kölsch trinkt man aus einer schmalen Stange mit 0,2 Litern." });
}
{
  const Y = STUFEN[5], s = km(Y), R = 0.22 * s;
  let k = schatten(0, 0.2, R + 2, 0.8, 0.3);
  const h = 0.21 * s;
  const plaetze = [[-0.6, -0.5], [0, -0.62], [0.6, -0.5], [-0.9, -0.15], [0.9, -0.15], [-0.6, 0.15], [0, 0.22], [0.6, 0.15]];
  for (const [dx, dy] of plaetze.filter((p) => p[1] < 0)) k += STANGE(dx * R, dy * R * 0.35, h);
  k += `<ellipse cx="0" cy="-.2" rx="${r(R + 1)}" ry="${r(R * 0.32)}" fill="none" stroke="#7a4f2a" stroke-width=".9"/>`;
  for (const [dx, dy] of plaetze.filter((p) => p[1] >= 0)) k += STANGE(dx * R, dy * R * 0.35, h);
  k += `<path d="M${r(-R - 1)} -.2 L0 ${r(-h * 1.9)} L${r(R + 1)} -.2" stroke="#7a4f2a" stroke-width=".7" fill="none"/><path d="M-1.6 ${r(-h * 1.9)} Q0 ${r(-h * 2.4)} 1.6 ${r(-h * 1.9)}" stroke="#7a4f2a" stroke-width=".9" fill="none"/>`;
  k += `<ellipse cx="0" cy="${r(R * 0.06)}" rx="${r(R + 1)}" ry="${r(R * 0.32)}" fill="none" stroke="#5e3c1e" stroke-width=".9"/>`;
  S.teil({ oben: true, id: "koelschkranz", de: "der Kölschkranz", syl: "KÖLSCH-kranz", it: "il portabicchieri", itSyl: "por-ta-bic-CHIE-ri", en: "Koelsch carrier",
    x: 92, y: Y - 0.5, steht: true, kunst: k, tipp: "Im Brauhaus bringt der Kellner — der „Köbes“ — das Kölsch im Kranz." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/koeln.js"));
console.log(aus);
