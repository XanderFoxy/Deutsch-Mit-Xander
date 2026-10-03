#!/usr/bin/env node
/* =====================================================================
   SYDNEY (FASSUNG 854) — Bilderwelt neu: eine echte Stadtansicht
   ---------------------------------------------------------------------
   XANDER (03.10.): „die bekannten Sehenswürdigkeiten … zu den
   bekanntesten Städten in anderen Ländern … als Profi-Grafikdesigner auf
   Hollywood-Niveau“.

   RECHERCHE (sydney.com „Mrs Macquarie's Chair“, Sydney Opera House
   Fakten, Sydney Harbour Bridge Fakten, Royal Botanic Garden):
   - STANDORT: Mrs Macquarie's Chair an der Spitze von Mrs Macquarie's
     Point, an einem Sommermorgen um 9 Uhr. Blick nach WEST-NORDWEST über
     Farm Cove. Das ist das berühmte Postkartenmotiv: das Opernhaus vorn,
     die Harbour Bridge dahinter.
     Echte Richtungen und Abstände von hier (gerechnet, nicht geschätzt):
       Opernhaus     ≈ 296°, 740 m   (Bildmitte links)
       Südpylone     ≈ 291°, 1,3 km  (ragen links über das niedrige
                                      Südende des Opernhauses)
       Bogenscheitel ≈ 302°, 1,4 km  (rechts neben den hohen Schalen)
       Nordpylone    ≈ 310°, 1,5 km  (Milsons Point, rechts)
     Links liegt der Botanische Garten am Ufer von Farm Cove (Moreton-Bay-
     Feigen, Palmen, Ufermauer). Die Hochhäuser der Innenstadt und der
     Sydney Tower stehen weiter links (Südwest, 230–270°) und sind nicht in
     diesem Blick. Die Sonne steht im Nordosten, also hinter dem Betrachter
     rechts: Ost- und Vorderseiten hell und leicht warm, Schatten fallen nach
     links hinten.
   - OPERNHAUS (Jørn Utzon, eröffnet 1973): drei Gruppen von Schalen auf
     einem Sockel (Podium) aus Beton mit Platten aus rosa Granit (Tarana):
     Konzertsaal (Westen, höchste Schale 67 m über dem Meer), Joan
     Sutherland Theatre (Osten, vorn) und das kleine Restaurant (Südwest).
     Jede Schale ist ein Ausschnitt derselben Kugel (Radius 75 m): der Grat
     ist gewölbt, die Spitze hängt stumpf über. Die großen Schalen zeigen
     mit der Spitze nach Norden (im Bild nach rechts), je eine Rückschale
     nach Süden. Bedeckt mit 1 056 006 Fliesen aus Schweden (Höganäs):
     glänzend weiß und matt cremefarben im Fischgrätmuster (Chevrons)
     zwischen den Rippen, die vom Fußpunkt fächerförmig nach oben laufen.
     Die Nordöffnungen sind mit topasfarbenen Glasvorhängen geschlossen,
     die schräg von der Schalenlippe bis zum Sockel hängen. Im Süden die
     breite Freitreppe (Monumental Steps). UNSICHER: die genaue Achse des
     Gebäudes (hier 355°) und die einzelnen Schalenhöhen außer der
     höchsten (geschätzt nach Ansichten).
   - HARBOUR BRIDGE (1932): Stahlbogen, 503 m Spannweite, Scheitel 134 m
     über dem Meer, Fahrbahn 49 m. Zwei parallele Fachwerkbögen aus 28
     Feldern, Höhe 18 m in der Mitte, 57 m an den Enden; an den Enden
     steht die Fahrbahn auf Stützen über dem Untergurt, in der Mitte hängt
     sie an Hängern. An jedem Ende zwei Pylone, 89 m hoch, mit Granit
     verkleidet (Moruya); die Fahrbahn läuft zwischen ihnen hindurch.
     Acht Fahrspuren und zwei Gleise (Westseite). Oben am Scheitel wehen
     die australische Flagge und die Flagge der Aborigines; Gruppen des
     BridgeClimb steigen in grauen Anzügen auf dem Bogen hinauf.
   - HAFEN: Fähren in Grün und Gold (First-Fleet-Klasse), Wassertaxis,
     Segelboote.
   - VORNE: der Felsen aus gelbem Hawkesbury-Sandstein (waagerechte Bänke,
     Kreuzschichtung, rostrote Eisenbänder, Wabenverwitterung) mit Mrs
     Macquarie's Chair: 1810 von Sträflingen für Elizabeth Macquarie in den
     Fels gehauen, damit sie nach den Schiffen aus England Ausschau halten
     konnte; die Bank schaut darum aufs Wasser (UNSICHER: genaue
     Ausrichtung; hier nach rechts, zur Hafeneinfahrt). Dahinter eine
     Moreton-Bay-Feige. Gelbhaubenkakadu, Molukkenibis („Bin Chicken“) an
     der Picknickdecke mit Fish and Chips, Kühlbox („Esky“), Flip-Flops
     („Thongs“), Bumerang (Souvenir mit Punktmalerei), Sonnencreme
     („Slip, Slop, Slap, Seek, Slide“).
   - RUNDE 3: Fußweg zwischen Fels und Rasen und Regenpfütze auf der
     Felsplatte (UNSICHER: genaue Führung des Wegs am Point). Touristin von
     Hand gezeichnet (fotografiert die Oper), Picknick als Lupe.
   - RUNDE 4: Joggerin mit Hund auf dem Uferweg (Morgen), Picknick in echter
     Zentralperspektive (Fluchtpunkt auf dem Horizont), Glaswände innerhalb der
     Schalenöffnungen. UNSICHER: Lage der Glaswand des Konzertsaals im Blick.
   Maßstab: Bild 34° breit (≈ 11,9 Einheiten je Grad), Augenhöhe y = 146
   (6 m über dem Wasser). Ferne Dinge werden mit einer echten
   Zentralprojektion gesetzt (proj), ihre Spiegelbilder mit derselben
   Projektion und negativer Höhe. Vorne gilt: Einheiten je Meter =
   (y − 146) / 1,6.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "sydney", titel: "Sydney", emoji: "🦘", thema: "Länder", kuerzel: "syd", fassung: 854, breite: 400, hoehe: 260 });
const rnd = zufall(1973);
{ const lg = S.lg, rg = S.rg, da = new Set();
  S.lg = (n, ...a) => { if (da.has(n)) return `url(#${S.id(n)})`; da.add(n); return lg(n, ...a); };
  S.rg = (n, ...a) => { if (da.has(n)) return `url(#${S.id(n)})`; da.add(n); return rg(n, ...a); }; }
const r = B.r;
const HOR = 146, F = 680, EYE = 6;
/* Zentralprojektion: E = Osten, N = Norden (m vom Betrachter), Z = Höhe über dem Meer */
const proj = (E, Nn, Z) => {
  const d = -0.866 * E + 0.5 * Nn, l = 0.5 * E + 0.866 * Nn;
  return [200 + F * l / d, HOR - F * (Z - EYE) / d, d];
};
const P = (p) => `${r(p[0])} ${r(p[1])}`;
const vorn = (y) => (y - HOR) / 1.6;    // Einheiten je Meter auf dem Felsen vorn
/* Schlagschatten am Boden: Sonne rechts hinten (Nordost, 40° hoch) → Schatten nach links hinten */
const schlag = (b, h, s, a = 0.32) => `<path d="M${r(-b / 2)} 0 L${r(b / 2)} 0 L${r(b / 2 - 1.2 * h * s)} ${r(-0.13 * h * s)} L${r(-b / 2 - 1.2 * h * s)} ${r(-0.13 * h * s)} Z" fill="#2a1d10" opacity="${a}" filter="url(#bw_weich)"/>`;

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("dunst")}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation=".35"/></filter>`);
S.def(`<filter id="${S.id("spiegel")}" x="-10%" y="-20%" width="120%" height="140%"><feGaussianBlur stdDeviation="1.4 .3"/></filter>`);
/* Wiederverwendbar: Wabenverwitterung (Tafoni) als Gruppe, Meißelhiebe und Grasbüschel als Muster */
{
  /* Tafoni: Wabengruppe aus runden Löchern in drei Größen, jedes mit dunklem Inneren, Schattenrand oben
     und heller, abgerundeter Unterlippe (Licht von oben rechts) */
  let f = "", sch = "", l = "";
  for (const [x, y, w] of [[0, 0, 1.5], [3, -0.4, 1.1], [-2.9, 0.3, 1.2], [1.4, 1.9, 0.8], [4.6, 1.3, 0.6], [-1.2, -1.9, 0.7], [-4.7, -0.6, 0.5], [2.4, -2.2, 0.5], [-0.9, 2.1, 0.5], [5.8, -0.5, 0.4]]) {
    f += `M${r(x - w)} ${r(y)}a${w} ${r(w * 0.78)} 0 1 0 ${r(2 * w)} 0a${w} ${r(w * 0.78)} 0 1 0 ${r(-2 * w)} 0z`;
    sch += `M${r(x - w * 0.8)} ${r(y - w * 0.2)}q${r(w * 0.8)} ${r(-w * 0.7)} ${r(w * 1.6)} 0`;
    l += `M${r(x - w * 0.9)} ${r(y + w * 0.55)}q${r(w * 0.9)} ${r(w * 0.6)} ${r(w * 1.8)} 0`;
  }
  S.def(`<g id="${S.id("taf")}"><path d="${f}" fill="#5a3618" opacity=".62"/><path d="${sch}" stroke="#2e1a0a" stroke-width=".3" fill="none" opacity=".6"/><path d="${l}" stroke="#f8e4b6" stroke-width=".45" fill="none"/></g>`);
  /* Grasbüschel in Felsfugen */
  S.def(`<g id="${S.id("bueschel")}"><path d="M0 0q-1.2-2.4-3.6-3.6M0 0q-.4-3-1.4-5.4M0 0q.3-3.4.4-6M0 0q.9-2.8 2.4-4.8M0 0q1.4-1.8 3.8-2.6" stroke="#5f8f36" stroke-width=".55" fill="none"/><path d="M.2 0q-.6-2.2-2-3.8M.2 0q.6-2.6 1.6-3.8" stroke="#9cc463" stroke-width=".4" fill="none"/></g>`);
  S.def(`<pattern id="${S.id("meissel")}" width="3.4" height="2.9" patternUnits="userSpaceOnUse" patternTransform="rotate(8)"><path d="M.4 .3l1.1 1.5M2.2 1.6l.8 1" stroke="#9c6e3a" stroke-width=".3"/></pattern>`);
  S.def(`<pattern id="${S.id("gras")}" width="9" height="5" patternUnits="userSpaceOnUse"><path d="M1 5l-.6-2.6M1.6 5l.5-2.9M2.4 5l1.3-2.2M5.4 2.6l-.4-2M6 2.6l.7-2.3M6.6 2.6l1.4-1.6" stroke="#a6cc6e" stroke-width=".4"/><path d="M3.6 4.6l-.9-2M7.6 4.8l.3-2.4M.2 2.2l.6-1.8" stroke="#3f6b25" stroke-width=".4"/></pattern>`);
}
const taf = (x, y, sk) => `<use href="#${S.id("taf")}" transform="translate(${r(x)} ${r(y)}) scale(${sk})"/>`;
const bueschel = (x, y, sk) => `<use href="#${S.id("bueschel")}" transform="translate(${r(x)} ${r(y)}) scale(${sk})"/>`;
/* =====================================================================
   KULISSE — Himmel, Nordufer, The Rocks
   ===================================================================== */
S.hinten(`<rect width="400" height="${HOR + 6}" fill="${S.lg("himmel", [[0, "#3371b6"], [0.45, "#72a6d6"], [0.72, "#b6d2e8"], [0.88, "#ecdcc8"], [1, "#f6e4cc"]])}"/>`);
{
  /* Schönwetter-Cumulus am Morgen: klein und flach, scharfe Kanten, gerade graue Unterseite,
     oben sonnenbeschienen; Kuppen durch feine Schattenlinien getrennt (kein Weichzeichner) */
  const WL = S.lg("wolkenlicht", [[0, "#ffffff"], [0.5, "#f8f5ee"], [0.8, "#dfe3e6"], [1, "#aebdcc"]]);
  let w = "", li = "";
  const wolke = (x, y, b, kuppen) => {
    /* kuppen: Höhen der Zwischenpunkte (Anteil der Breite) */
    const n = kuppen.length + 1, pts = [[x - b / 2, y]];
    kuppen.forEach((h, i) => pts.push([x - b / 2 + b * (i + 1) / n, y - h * b]));
    pts.push([x + b / 2, y]);
    let d = `M${r(pts[0][0])} ${y}`;
    for (let i = 1; i < pts.length; i++) { const q = pts[i], p0 = pts[i - 1], rr = Math.hypot(q[0] - p0[0], q[1] - p0[1]) * 0.56; d += ` A${r(rr)} ${r(rr)} 0 0 1 ${r(q[0])} ${r(q[1])}`; }
    w += `<path d="${d} Z" fill="${WL}"/>`;
    if (b > 20) for (let i = 1; i < pts.length - 1; i++) li += `M${r(pts[i][0])} ${r(pts[i][1])}q${r(b * 0.01)} ${r(b * 0.03)} ${r(b * 0.035)} ${r(b * 0.05)}`;
    li += `M${r(x - b * 0.36)} ${r(y - 0.6)}h${r(b * 0.72)}`;
  };
  wolke(62, 38, 40, [0.12, 0.22, 0.27, 0.16, 0.07]);
  wolke(262, 27, 50, [0.1, 0.2, 0.24, 0.2, 0.13, 0.06]);
  wolke(368, 60, 22, [0.14, 0.24, 0.12]);
  wolke(170, 66, 16, [0.16, 0.22, 0.1]);
  wolke(120, 96, 12, [0.12, 0.16]);
  w += `<path d="${li}" stroke="#c9d1da" stroke-width=".35" fill="none"/>`;
  S.hinten(w);
}
/* Nordufer hinter der Brücke: Milsons Point und North Sydney im Morgendunst */
{
  S.def(`<pattern id="${S.id("etage")}" width="4" height="2.2" patternUnits="userSpaceOnUse"><rect width="4" height=".45" fill="#6f8191" opacity=".3"/></pattern>`);
  let c = `<g filter="url(#${S.id("dunst")})">`;
  c += `<path d="M236 148.6 L236 141 Q260 137.6 290 139 Q330 135 360 136.4 Q384 133.4 400 134 L400 148.6 Z" fill="${S.lg("nordufer", [[0, "#93a69d"], [1, "#a9b6ad"]])}"/>`;
  const tuerme = [[328, 9, 18, "#b9c4cc"], [338, 7, 24, "#a8b6c2"], [346, 10, 20, "#c4ccd2"], [357, 6, 30, "#9fb0bf"], [364, 9, 26, "#b6c2cb"], [374, 8, 35, "#a4b4c1"], [383, 7, 29, "#c0cad1"], [391, 9, 23, "#aebcc7"], [244, 7, 10, "#c9cfcf"], [256, 9, 8, "#bfc8c6"], [268, 6, 12, "#c6cccc"], [282, 8, 9, "#bcc6c4"], [296, 7, 11, "#c8cecc"]];
  let sch = "", et = "";
  for (const [x, w, h, f] of tuerme) {
    const y0 = 140 - (x > 320 ? 3 : 0);
    c += `<rect x="${x}" y="${r(y0 - h)}" width="${w}" height="${r(h + 6)}" fill="${f}"/>`;
    sch += `M${x} ${r(y0 - h)}h${r(w * 0.35)}V${y0 + 6}h${r(-w * 0.35)}z`;
    et += `M${x + 0.6} ${r(y0 - h + 1.6)}h${r(w - 1.2)}V${y0}h${r(1.2 - w)}z`;
  }
  c += `<path d="${sch}" fill="#7d8d99" opacity=".22"/><path d="${et}" fill="url(#${S.id("etage")})"/>`;
  c += `<rect x="236" y="144.6" width="164" height="4" fill="#8a9a92"/>`;
  c += `</g>`;
  /* Morgendunst über North Sydney */
  S.hinten(c);
}
/* Südufer links: The Rocks im Dunst */
{
  let c = `<g filter="url(#${S.id("dunst")})">`;
  c += `<path d="M0 149 L0 128 Q20 126 34 128.6 L40 124 L58 125 L66 129 L86 130 L86 149 Z" fill="#b5b3a8"/>`;
  for (const [x, w, h] of [[2, 9, 17], [12, 7, 13], [21, 10, 20], [33, 8, 15], [44, 11, 18], [57, 7, 14], [66, 9, 12]]) c += `<rect x="${x}" y="${r(140 - h)}" width="${w}" height="${h}" fill="${["#c8bfa9", "#bdb6a6", "#cfc6b3", "#b9b4a8"][x % 4]}"/>`;
  c += `</g>`;
  /* Morgendunst über dem Hafen: ein Band über die ganze Bildbreite, oben unsichtbar, am Ufer ≈ 0,35
     (kein Kasten, keine senkrechte Kante) */
  c += `<rect x="0" y="116" width="400" height="34" fill="${S.lg("dunstband", [[0, "#f1ebe2", 0], [0.6, "#eef0ec", 0.22], [1, "#f3eee4", 0.38]])}"/>`;
  S.hinten(c);
}

/* =====================================================================
   1 — DIE HARBOUR BRIDGE (Stahlbogen mit Pylonen)
       Lupe: Bogen, Pylon, Flagge, Brückenkletterer
   ===================================================================== */
const SB = [-1220, 466], AU = [0.1736, 0.9848], AW = [0.9848, -0.1736];
const bp = (a, c, Z) => proj(SB[0] + a * AU[0] + c * AW[0], SB[1] + a * AU[1] + c * AW[1], Z);
const zU = (a) => 12 + 104 * (1 - Math.pow((a - 251.5) / 251.5, 2));
const zO = (a) => 134 - 65 * Math.pow((a - 251.5) / 251.5, 2);
const SCHEITEL = bp(251.5, 15, 134);
const bruUnter = [];
const randA = (ziel, a0, a1) => { for (let i = 0; i < 40; i++) { const m = (a0 + a1) / 2; if ((bp(m, 24.4, 49)[0] - ziel) * (bp(a0, 24.4, 49)[0] - ziel) > 0) a0 = m; else a1 = m; } return (a0 + a1) / 2; };
const DECK_A = [randA(0, -900, 0), -60, 0, 120, 251.5, 380, 503, 560, randA(400, 503, 1400)];
{
  let k = "";
  const fach = (c, farbe, licht, dick, ohneDiag) => {
    let g = "";
    const N = 28, pts = [...Array(N + 1)].map((_, i) => i * 503 / N);
    const oben = pts.map((a) => bp(a, c, zO(a))), unten = pts.map((a) => bp(a, c, zU(a)));
    g += `<path d="M${oben.map(P).join(" L")} L${unten.slice().reverse().map(P).join(" L")} Z" fill="${farbe}" opacity=".08"/>`;
    let st = "";
    for (let i = 0; i <= N; i += ohneDiag ? 2 : 1) st += `M${P(oben[i])} L${P(unten[i])}`;
    if (!ohneDiag) for (let i = 0; i < N; i++) st += i < N / 2 ? `M${P(oben[i])} L${P(unten[i + 1])}` : `M${P(unten[i])} L${P(oben[i + 1])}`;
    g += `<path d="${st}" stroke="${farbe}" stroke-width="${dick * 0.42}" fill="none"/>`;
    g += `<path d="M${oben.map(P).join(" L")}" stroke="${farbe}" stroke-width="${dick}" fill="none" stroke-linejoin="round"/>`;
    g += `<path d="M${unten.map(P).join(" L")}" stroke="${farbe}" stroke-width="${dick * 1.25}" fill="none" stroke-linejoin="round"/>`;
    if (licht) {
      g += `<path d="M${oben.map((p) => P([p[0], p[1] - dick * 0.32])).join(" L")}" stroke="${licht}" stroke-width="${dick * 0.35}" fill="none"/>`;
    }
    return g;
  };
  /* Pylone (je Ende zwei): Ostseite hell (Morgensonne), Südseite im Schatten */
  const pylon = (a0, c0, fern) => {
    let g = "";
    const A = a0 - 10, Bb = a0 + 10, C0 = c0 - 7, C1 = c0 + 7;
    const ost = [bp(A, C1, 0), bp(Bb, C1, 0), bp(Bb, C1, 82), bp(A, C1, 82)];
    const sued = [bp(A, C0, 0), bp(A, C1, 0), bp(A, C1, 82), bp(A, C0, 82)];
    const kopf = [bp(A + 1.5, C1, 82), bp(Bb - 1.5, C1, 82), bp(Bb - 3, C1, 89), bp(A + 3, C1, 89)];
    g += `<path d="M${sued.map(P).join(" L")} Z" fill="#8f8a7f"/>`;
    g += `<path d="M${ost.map(P).join(" L")} Z" fill="${S.lg("granit", [[0, "#efdfc2"], [0.6, "#d9c8a8"], [1, "#bcaa8b"]])}"/>`;
    g += `<path d="M${kopf.map(P).join(" L")} Z" fill="#ddd5c4"/>`;
    for (const z of [10, 40, 52, 74]) g += `<path d="M${P(bp(A, C1, z))} L${P(bp(Bb, C1, z))}" stroke="#9c937f" stroke-width=".35"/>`;
    for (const f of [0.3, 0.7]) { const a = A + (Bb - A) * f; g += `<path d="M${P(bp(a, C1, 54))} L${P(bp(a, C1, 72))}" stroke="#8a826f" stroke-width="${fern ? 0.6 : 0.75}"/>`; }
    /* Bogen-Öffnung (Durchgang für Fußweg) am Fuß */
    const t0 = bp(A + 7, C1, 49), t1 = bp(Bb - 7, C1, 49);
    g += `<path d="M${P(bp(A + 7, C1, 42))} L${P(t0)} Q${P(bp(a0, C1, 53))} ${P(t1)} L${P(bp(Bb - 7, C1, 42))} Z" fill="#8b8374" opacity=".55"/>`;
    return g;
  };
  /* Reihenfolge = Tiefe: westliche Pylone, hinterer Bogen, Querverbände, Fahrbahn, vorderer Bogen, östliche Pylone */
  k += pylon(-15, -31, 0) + pylon(518, -31, 1);
  k += `<g opacity=".8">${fach(-15, "#86919a", null, 1.1, true)}</g>`;
  for (let i = 0; i <= 28; i += 2) { const a = i * 503 / 28; k += `<path d="M${P(bp(a, -15, zO(a)))} L${P(bp(a, 15, zO(a)))}" stroke="#7f8a90" stroke-width=".45"/>`; }
  {
    /* Zug (Westseite) und Busse/Lastwagen ragen über die Brüstung; Autos sind fast verdeckt */
    let v = "";
    const zug = [bp(150, -18, 49), bp(330, -18, 49)];
    const zugO = [bp(150, -18, 54.6), bp(330, -18, 54.6)];
    v += `<path d="M${P(zug[0])} L${P(zug[1])} L${P(zugO[1])} L${P(zugO[0])} Z" fill="${S.lg("zug", [[0, "#e6e9eb"], [1, "#a9b0b5"]])}"/>`;
    for (let a = 150; a < 330; a += 20) v += `<path d="M${P(bp(a, -18, 49.5))} L${P(bp(a, -18, 54.4))}" stroke="#6d757b" stroke-width=".18"/>`;
    let zf = "";
    for (let a = 152; a < 328; a += 3.2) zf += `M${P(bp(a, -18, 51.2))} L${P(bp(a + 2, -18, 51.2))}`;
    v += `<path d="${zf}" stroke="#2f3f4c" stroke-width=".55"/>`;
    v += `<path d="M${P(bp(150, -18, 52.6))} L${P(bp(330, -18, 52.6))}" stroke="#f2c62f" stroke-width=".35"/><path d="M${P(bp(150, -18, 53.6))} L${P(bp(330, -18, 53.6))}" stroke="#2f3f4c" stroke-width=".3"/>`;
    /* Verkehr auf allen Spuren: drei Busse (weiß-blau), Lieferwagen, Autos */
    const BUS = "#f2f3f1";
    const fz = [[30, 6, 3.2, 12, BUS], [52, 18, 1.5, 4.4, "#c0392b"], [74, 11, 1.5, 4.4, "#e8e8e6"], [96, 20, 1.5, 4.4, "#2a2a2a"], [118, 4, 4, 12, "#2f6fb6"], [150, 14, 3.2, 12, BUS],
      [176, 8, 1.5, 4.4, "#9aa3ab"], [198, 20, 1.5, 4.4, "#e8e8e6"], [222, 12, 1.5, 4.4, "#1d1d1d"], [246, 4, 1.5, 4.4, "#d9b02f"], [268, 18, 2.6, 9, "#f4f4f2"], [300, 8, 4, 12, "#f4f4f2"],
      [326, 14, 3.2, 12, BUS], [350, 20, 1.5, 4.4, "#c0392b"], [372, 4, 1.5, 4.4, "#7d8590"], [396, 12, 2.6, 9, "#e2722d"], [424, 18, 1.5, 4.4, "#e8e8e6"], [448, 8, 1.5, 4.4, "#2f6fb6"], [470, 14, 1.5, 4.4, "#1d1d1d"]];
    for (const [a, c, h, l, f] of fz) {
      const Q4 = (a0, a1, z0, z1) => `M${P(bp(a0, c, z0))} L${P(bp(a1, c, z0))} L${P(bp(a1, c, z1))} L${P(bp(a0, c, z1))} Z`;
      if (h < 2) {
        /* Auto: Karosserie und schmaleres Dach mit Fenstern */
        v += `<path d="${Q4(a, a + l, 49, 49 + h * 0.55)}" fill="${f}"/><path d="${Q4(a + l * 0.22, a + l * 0.78, 49 + h * 0.55, 49 + h)}" fill="${f}"/><path d="${Q4(a + l * 0.28, a + l * 0.72, 49 + h * 0.62, 49 + h * 0.92)}" fill="#3a4a58"/>`;
      } else {
        /* Bus / Lieferwagen: langer Quader mit Fensterband */
        v += `<path d="${Q4(a, a + l, 49, 49 + h)}" fill="${f}"/><path d="${Q4(a + 0.8, a + l - 0.6, 49 + h * 0.5, 49 + h * 0.82)}" fill="#2f3f4c"/>`;
        if (f === BUS) { let fe = ""; for (let t = a + 2.2; t < a + l - 1; t += 1.9) fe += `M${P(bp(t, c, 49 + h * 0.5))} L${P(bp(t, c, 49 + h * 0.82))}`; v += `<path d="${fe}" stroke="${BUS}" stroke-width=".18"/><path d="${Q4(a, a + l, 49 + h * 0.25, 49 + h * 0.35)}" fill="#2a5db0"/>`; }
      }
    }
    k += v;
  }
  {
    /* Fahrbahn: Kante mit Brüstung; an den Enden Stützen auf dem Untergurt, in der Mitte Hänger */
    const dO = DECK_A.map((a) => bp(a, 24.4, 49)), dU = DECK_A.map((a) => bp(a, 24.4, 42.5));
    k += `<path d="M${dO.map(P).join(" L")} L${dU.slice().reverse().map(P).join(" L")} Z" fill="${S.lg("fahrbahn", [[0, "#a3abb0"], [0.5, "#737d83"], [1, "#4e575c"]])}"/>`;
    k += `<path d="M${DECK_A.map((a) => P(bp(a, 24.4, 50.3))).join(" L")}" stroke="#c3cacd" stroke-width=".35" fill="none"/>`;
    k += `<path d="M${dO.map(P).join(" L")}" stroke="#dfe4e5" stroke-width=".5" fill="none"/>`;
    let h = "", st = "";
    for (let i = 1; i < 28; i++) { const a = i * 503 / 28; if (zU(a) > 50) h += `M${P(bp(a, 15, zU(a)))} L${P(bp(a, 15, 49))}`; }
    for (let i = 0; i <= 28; i++) { const a = i * 503 / 28; if (zU(a) < 42) st += `M${P(bp(a, 15, zU(a)))} L${P(bp(a, 15, 42.5))}`; }
    k += `<path d="${h}" stroke="#6f7a80" stroke-width=".55"/><path d="${st}" stroke="#66717a" stroke-width=".9"/>`;
    let lat = "";
    for (let a = 12; a < 500; a += 24) { const p = bp(a, 24.4, 49), q = bp(a, 24.4, 52); lat += `M${P(p)} L${P(q)}`; }
    k += `<path d="${lat}" stroke="#5d676c" stroke-width=".3"/>`;
  }
  k += fach(15, "#737e85", "#ccd3d6", 1.45);
  k += pylon(-15, 31, 0) + pylon(518, 31, 1);
  /* Flaggen am Scheitel: links Australien, rechts Aborigines */
  const fl = (dx, art) => {
    const f = bp(251.5 + dx, 15, 134), t = [f[0], f[1] - 6.4];
    let g = `<line x1="${r(f[0])}" y1="${r(f[1])}" x2="${r(t[0])}" y2="${r(t[1])}" stroke="#e8ecee" stroke-width=".3"/>`;
    const x = t[0] + 0.15, y = t[1];
    if (art === "au") {
      g += `<rect x="${r(x)}" y="${r(y)}" width="3.6" height="1.8" fill="#1f3b8c"/><rect x="${r(x)}" y="${r(y)}" width="1.8" height=".9" fill="#2a4aa0"/>`;
      g += `<path d="M${r(x)} ${r(y)} l1.8 .9 M${r(x + 1.8)} ${r(y)} l-1.8 .9 M${r(x + 0.9)} ${r(y)} v.9 M${r(x)} ${r(y + 0.45)} h1.8" stroke="#fff" stroke-width=".22"/><path d="M${r(x + 0.9)} ${r(y)} v.9 M${r(x)} ${r(y + 0.45)} h1.8" stroke="#c8202f" stroke-width=".1"/>`;
      for (const [sx, sy] of [[2.6, 0.5], [3.1, 1.1], [2.5, 1.4], [0.9, 1.35], [3.3, 0.6]]) g += `<circle cx="${r(x + sx)}" cy="${r(y + sy)}" r=".12" fill="#fff"/>`;
    } else {
      g += `<rect x="${r(x)}" y="${r(y)}" width="3.6" height=".9" fill="#111"/><rect x="${r(x)}" y="${r(y + 0.9)}" width="3.6" height=".9" fill="#c8202f"/><circle cx="${r(x + 1.8)}" cy="${r(y + 0.9)}" r=".45" fill="#f6c51a"/>`;
    }
    return g;
  };
  k += fl(-6, "au") + fl(6, "ab");
  /* BridgeClimb: Gruppe in grauen Anzügen auf dem Obergurt, angeseilt, mit Führer in Blau */
  let kl = "";
  for (let i = 0; i < 9; i++) {
    const a = 278 + i * 7.5, p = bp(a, 15, zO(a) + 1.2);
    kl += `<g transform="translate(${r(p[0])} ${r(p[1])})"><rect x="-.28" y="-1.5" width=".56" height="1.1" rx=".25" fill="${i === 0 ? "#3b6fb0" : "#7b8794"}"/><circle cx="0" cy="-1.75" r=".26" fill="#e9c9a8"/><path d="M-.2 -.45 l-.2 .6 M.2 -.45 l.25 .6" stroke="#5a646e" stroke-width=".22"/></g>`;
  }
  const s0 = bp(278, 15, zO(278) + 0.3), s1 = bp(278 + 8 * 7.5, 15, zO(278 + 8 * 7.5) + 0.3);
  kl += `<path d="M${P(s0)} L${P(s1)}" stroke="#d8dde0" stroke-width=".18"/>`;
  k += kl;
  const pz = bp(251.5, 15, 134);
  const pm = bp(518, 31, 44), kc = bp(308, 15, zO(308));
  bruUnter.push(
    { id: "bogen", de: "der Bogen", syl: "BO-gen", it: "l'arco", itSyl: "AR-co", en: "arch", x: bp(430, 15, 0)[0], y: bp(430, 15, zO(430))[1] + 6,
      kunst: flaeche(-11, -8, 22, 16), tipp: "Der Stahlbogen spannt sich 503 Meter weit über den Hafen." },
    { id: "pylon", de: "der Pylon", syl: "py-LON", it: "il pilone", itSyl: "pi-LO-ne", en: "pylon", x: pm[0] - 3, y: pm[1] + 2,
      kunst: flaeche(-9, -22, 18, 30), tipp: "Die vier Pylonen sind 89 Meter hoch und mit Granit verkleidet. Den Bogen tragen sie nicht." },
    { id: "flagge", de: "die Flagge", syl: "FLAG-ge", it: "la bandiera", itSyl: "ban-DIE-ra", en: "flag", x: bp(245.5, 15, 134)[0] + 1.5, y: pz[1] + 2,
      kunst: flaeche(-6, -12, 11, 12, 0.6), tipp: "Oben wehen zwei Flaggen: die Flagge Australiens (hier) und daneben die Flagge der Aborigines." },
    { id: "brueckenkletterer", de: "der Brückenkletterer", syl: "BRÜ-cken-klet-te-rer", it: "lo scalatore del ponte", itSyl: "sca-la-TO-re del PON-te", en: "bridge climber", x: kc[0], y: kc[1] + 4,
      kunst: flaeche(-11, -14, 23, 16, 0.6), tipp: "Beim BridgeClimb steigen Brückenkletterer (Mehrzahl: die Brückenkletterer) angeseilt bis auf 134 Meter über das Wasser." });
  const zx = SCHEITEL[0];
  S.teil({ id: "harbour_bridge", de: "die Harbour Bridge", syl: "HAR-bour-bridge", it: "l'Harbour Bridge", itSyl: "AR-bur BRID-ge", en: "Sydney Harbour Bridge",
    x: 0, y: 0, kunst: k, tipp: "Die Sydney Harbour Bridge wurde 1932 eröffnet. Die Leute nennen sie „Kleiderbügel“.",
    zoom: { x: r(zx - 18), y: 74, w: 146, h: 95 }, unter: bruUnter });
}

/* =====================================================================
   2 — DAS OPERNHAUS (Sockel, Treppe, Schalen, Glas)
       Lupe: Schale, Fliese, Glaswand, Treppe, Sockel
   ===================================================================== */
/* Ortskoordinaten am Opernhaus: s = Meter von der Südkante nach Norden,
   e = Meter von der Westkante nach Osten (Achse 355°) */
const op = (s, e, Z) => proj(-716.8 - 0.087 * s + 0.996 * e, 225.7 + 0.996 * s + 0.087 * e, Z);
const opUnter = [];
const SOCKEL_Z = 16, TREPPE_S = 34;
const SPIEGEL_OP = [];   // Umrisse der Schalen für das Spiegelbild
{
  let k = "";
  /* --- der Sockel --- */
  const GRANIT = S.lg("opgranit", [[0, "#dcb8a4"], [0.5, "#c99f88"], [1, "#a97f6b"]]);
  /* Vorplatz-Kante (Süden) und Sockel unter dem Restaurant (Südwest, gleicher Granit, an die Treppe angeschlossen) */
  k += `<path d="M${P(op(0, 0, 0))} L${P(op(0, 120, 0))} L${P(op(0, 120, 4))} L${P(op(0, 0, 4))} Z" fill="#b99c8a"/>`;
  k += `<path d="M${P(op(8, 0, 4))} L${P(op(8, 26, 4))} L${P(op(8, 26, SOCKEL_Z))} L${P(op(8, 0, SOCKEL_Z))} Z" fill="#c79d87"/><path d="M${P(op(8, 0, SOCKEL_Z - 1))} L${P(op(8, 26, SOCKEL_Z - 1))}" stroke="#f1e3d6" stroke-width=".6"/>`;
  /* Freitreppe: Setzstufen (nach Süden, im Schatten) treppauf nach Norden, dann die Ostwange mit Stufenprofil */
  const N_ST = 11, stS = (i) => i * TREPPE_S / N_ST, stZ = (i) => 4 + i * (SOCKEL_Z - 4) / N_ST;
  let stu = "";
  for (let i = 0; i < N_ST; i++) stu += `<path d="M${P(op(stS(i), 10, stZ(i)))} L${P(op(stS(i), 114, stZ(i)))} L${P(op(stS(i), 114, stZ(i + 1)))} L${P(op(stS(i), 10, stZ(i + 1)))} Z" fill="${i % 2 ? "#d9c3b3" : "#e3cebf"}"/>`;
  k += stu;
  /* Wange: oben gezahnt (Stufenprofil von der Seite) */
  let wange = `M${P(op(0, 120, 0))}`;
  for (let i = 0; i < N_ST; i++) wange += ` L${P(op(stS(i), 120, stZ(i) + 0.9))} L${P(op(stS(i + 1), 120, stZ(i) + 0.9))}`;
  wange += ` L${P(op(TREPPE_S, 120, SOCKEL_Z))} L${P(op(TREPPE_S, 120, 0))} Z`;
  k += `<path d="${wange}" fill="${GRANIT}"/>`;
  let kante = "";
  for (let i = 0; i < N_ST; i++) kante += `M${P(op(stS(i), 120, stZ(i) + 0.9))} L${P(op(stS(i + 1), 120, stZ(i) + 0.9))}`;
  k += `<path d="${kante}" stroke="#f3e6d8" stroke-width=".35"/>`;
  /* Ostseite des Sockels: Granitplatten, Fugen, Schattenfuge, Promenade am Wasser */
  const SE = op(TREPPE_S, 120, 0), NE = op(183, 120, 0), SEt = op(TREPPE_S, 120, SOCKEL_Z), NEt = op(183, 120, SOCKEL_Z);
  k += `<path d="M${P(SE)} L${P(NE)} L${P(NEt)} L${P(SEt)} Z" fill="${GRANIT}"/>`;
  for (let z = 3; z < SOCKEL_Z; z += 2.6) k += `<path d="M${P(op(0, 120, z))} L${P(op(183, 120, z))}" stroke="#8e6a58" stroke-width=".22" opacity=".7"/>`;
  for (let s = 6; s < 183; s += 14) k += `<path d="M${P(op(s, 120, 3))} L${P(op(s, 120, SOCKEL_Z - 1.4))}" stroke="#8e6a58" stroke-width=".14" opacity=".35"/>`;
  k += `<path d="M${P(op(TREPPE_S, 120, SOCKEL_Z - 1.2))} L${P(op(183, 120, SOCKEL_Z - 1.2))} L${P(NEt)} L${P(SEt)} Z" fill="#f1e3d6"/>`;
  k += `<path d="M${P(op(0, 120, 3))} L${P(op(183, 120, 3))} L${P(NE)} L${P(op(0, 120, 0))} Z" fill="#6f5a50"/>`;
  k += `<path d="M${P(op(0, 120, 4.2))} L${P(op(183, 120, 4.2))}" stroke="#e8e2da" stroke-width=".3"/>`;

  /* --- Schalen ---
     Grat: Kugelbogen, nach außen gewölbt (+0,2 · Sehne); Spitze stumpf gerundet; Lippe leicht hohl
     mit hellem Rippenband (Stärke der Schale). Füllung: Kugelverlauf, hell oben rechts (Sonne
     rechts hinten), dunkler zum Fuß. Fliesen: Rippen vom Fußpunkt aus, dazwischen Chevrons. */
  let schalenNr = 0;
  const len = (u, v) => Math.hypot(v[0] - u[0], v[1] - u[1]);
  const lerp = (u, v, t) => [u[0] + (v[0] - u[0]) * t, u[1] + (v[1] - u[1]) * t];
  const qb = (a, c, b, t) => [(1 - t) * (1 - t) * a[0] + 2 * t * (1 - t) * c[0] + t * t * b[0], (1 - t) * (1 - t) * a[1] + 2 * t * (1 - t) * c[1] + t * t * b[1]];
  /* Fliesen-Muster: glänzend weiße Chevron-Bänder auf matt cremefarbenem Grund (eine Kachel, gedreht je Schale) */
  /* Fliesen-Muster: im Wechsel eine Reihe glänzend weißer Chevrons (mit Glanzpunkt) und eine Reihe matt
     cremefarbener (eine Kachel, gedreht je Schale) */
  S.def(`<pattern id="${S.id("chev")}" width="2.6" height="4" patternUnits="userSpaceOnUse"><path d="M0 0L1.3 .9L2.6 0V.6L1.3 1.5L0 .6Z" fill="#fffefa"/><circle cx="1.3" cy=".95" r=".2" fill="#fff"/><path d="M0 2L1.3 2.9L2.6 2V2.6L1.3 3.5L0 2.6Z" fill="#e9dfc9" opacity=".75"/><path d="M0 .6L1.3 1.5L2.6 .6M0 2.6L1.3 3.5L2.6 2.6" stroke="#d6c8aa" stroke-width=".1" fill="none"/></pattern>`);
  const schale = (e, b, t, p, rueck, hinten = 0) => {
    const B0 = op(b[0], e, b[1]), T = op(t[0], e, t[1]), Pp = op(p[0], e, SOCKEL_Z), B0f = op(b[0] + (rueck ? 5 : -5), e, SOCKEL_Z);
    const dir = rueck ? -1 : 1;
    const gL = len(B0, T), gN = [(T[1] - B0[1]) / gL * dir, -(T[0] - B0[0]) / gL * dir];
    const cg = [(B0[0] + T[0]) / 2 + gN[0] * 0.15 * gL, (B0[1] + T[1]) / 2 + gN[1] * 0.15 * gL];
    const lL = len(T, Pp);
    const cl = [(T[0] + Pp[0]) / 2 - dir * 0.12 * lL, (T[1] + Pp[1]) / 2];
    /* stumpfe, dicke Spitze: ≈ 1,6 Einheiten vor T abbiegen, über T gerundet (r ≈ 0,8) */
    /* stumpfe, dicke Nase: Grat ≈ 2,4 vor T abbiegen, Lippe ≈ 3 unter T beginnen; der Bogen dazwischen
       läuft über T hinaus (kleiner Überhang), so dass vorn eine runde, helle Nase entsteht */
    const uA = 1 - 2.4 / gL, uB = 3 / lL;
    const Ta = qb(B0, cg, T, uA), Tb = qb(T, cl, Pp, uB), cg2 = lerp(B0, cg, uA);
    const mT = [(Ta[0] + Tb[0]) / 2, (Ta[1] + Tb[1]) / 2], Tn = [T[0] + (T[0] - mT[0]) * 0.55, T[1] + (T[1] - mT[1]) * 0.55];
    /* Nase als Kreisbogen (r ≥ 0,9) von Ta nach Tb, der große Bogen wölbt sich über T hinaus */
    const dAB = len(Ta, Tb), rN = Math.max(0.95, dAB / 2 + 0.05), hN = Math.sqrt(Math.max(0, rN * rN - dAB * dAB / 4));
    const nv = [T[0] - mT[0], T[1] - mT[1]], nl = Math.hypot(nv[0], nv[1]) || 1, Cn = [mT[0] - nv[0] / nl * hN, mT[1] - nv[1] / nl * hN];
    const ang2 = (q) => Math.atan2(q[1] - Cn[1], q[0] - Cn[0]), a1 = ang2(Ta), a2 = ang2(Tb), am = Math.atan2(nv[1], nv[0]);
    const pos = (x) => ((x % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI), sweep = pos(am - a1) < pos(a2 - a1) ? 1 : 0;
    const nase = `A${r(rN)} ${r(rN)} 0 1 ${sweep} ${P(Tb)}`;
    const d = `M${P(Pp)} L${P(B0f)} L${P(B0)} Q${P(cg2)} ${P(Ta)} ${nase} Q${P(cl)} ${P(Pp)} Z`;
    SPIEGEL_OP.push({ B0, T, Pp, e, b, t, p });
    const id = S.id("s" + schalenNr++);
    S.def(`<path id="${id}p" d="${d}"/><clipPath id="${id}"><use href="#${id}p"/></clipPath>`);
    /* Kugelverlauf: oben rechts (Sonne Nordost) warm-hell, zum Fuß und zur linken Flanke kühles Grau */
    const mx = T[0] - (T[0] - B0[0]) * 0.2 + 3, my = T[1] + (Pp[1] - T[1]) * 0.22, rr = Math.max(gL, lL) * 1.05;
    S.def(`<radialGradient id="${id}g" gradientUnits="userSpaceOnUse" cx="${r(mx)}" cy="${r(my)}" r="${r(rr)}"><stop offset="0" stop-color="${hinten ? "#fff5e2" : "#fff4dc"}"/><stop offset=".5" stop-color="${hinten ? "#efe5d4" : "#f6e9cf"}"/><stop offset="1" stop-color="${rueck ? "#adadbb" : "#bfbfcb"}"/></radialGradient>`);
    let g = `<use href="#${id}p" fill="url(#${id}g)"/>`;
    const ang = Math.atan2(T[1] - Pp[1], T[0] - Pp[0]) * 180 / Math.PI + 90;
    g += `<g clip-path="url(#${id})"><rect x="${r(Pp[0] - 40)}" y="${r(Pp[1] - 60)}" width="80" height="70" fill="url(#${S.id("chev")})" opacity="${hinten ? 0.55 : 0.75}" transform="rotate(${r(ang)} ${P(Pp)})"/>`;
    let rip = "";
    for (const u of [0.2, 0.42, 0.62, 0.82]) rip += `M${P(Pp)} L${P(qb(B0, cg, T, u))}`;
    g += `<path d="${rip}" stroke="#cfc3a8" stroke-width=".18" fill="none"/>`;
    /* Lippe als helles Band (Schalenstärke ≈ 0,6), Grat mit Lichtkante */
    g += `<path d="M${P(B0)} Q${P(cg2)} ${P(Ta)}" stroke="#fffdf6" stroke-width=".8" fill="none"/>`;
    g += `<path d="M${P(Ta)} ${nase} Q${P(cl)} ${P(Pp)}" stroke="#fffaf0" stroke-width="1.3" fill="none"/></g>`;
    return { svg: g, T, Pp, B0, cl, Tb, cg };
  };
  /* Innenseite einer Rückschale (Süden): deutlich dunkler, kühles Grau mit Rippen */
  const unterseite = (sch, e, sFuss) => {
    const F0 = op(sFuss, e, SOCKEL_Z);
    let g = `<path d="M${P(sch.Tb)} Q${P(sch.cl)} ${P(sch.Pp)} L${P(F0)} Z" fill="${S.lg("innen", [[0, "#a2a0ad"], [1, "#d0ccc6"]], 0, 0, 1, 0)}"/>`;
    let ri = "";
    for (let i = 1; i < 5; i++) ri += `M${P(F0)} L${P(qb(sch.Tb, sch.cl, sch.Pp, i / 5))}`;
    return g + `<path d="${ri}" stroke="#8f887c" stroke-width=".18"/>`;
  };
  /* Nord-Glaswand: hängt INNERHALB der Schalenöffnung von der Lippe bis auf den Sockel (Unterkante genau
     unter der Lippe). Drei große, leicht nach außen geknickte Facetten aus Topasglas, halbtransparent,
     oben unter der Lippe dunkel (Schatten der Schale), unten heller; dünne, gleich weite senkrechte
     Pfosten; ein schräger Himmelsreflex über eine Facette */
  let glasNr = 0;
  const glasvorhang = (sch, e) => {
    const id = S.id("gl" + glasNr++);
    /* Lippe abtasten (von der Nase bis zum Fußpunkt) */
    const lippe = [...Array(13)].map((_, i) => qb(sch.Tb, sch.cl, sch.Pp, i / 12));
    /* Sockelpunkt senkrecht unter der Nase suchen */
    let sa = 100, sb = 220;
    for (let i = 0; i < 30; i++) { const m = (sa + sb) / 2; if (op(m, e, SOCKEL_Z)[0] < sch.Tb[0]) sa = m; else sb = m; }
    const F0 = op((sa + sb) / 2, e, SOCKEL_Z), Pf = sch.Pp;
    const K1 = lippe[4], K2 = lippe[8], B1 = lerp(F0, Pf, 0.33), B2 = lerp(F0, Pf, 0.66);
    B1[0] += 0.8; B2[0] += 0.5;
    S.def(`<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="0" y1="${r(sch.Tb[1])}" x2="0" y2="${r(F0[1])}"><stop offset="0" stop-color="#3e2812" stop-opacity=".85"/><stop offset=".45" stop-color="#9a6a32" stop-opacity=".68"/><stop offset="1" stop-color="#e0b478" stop-opacity=".58"/></linearGradient>`);
    const fac = [[sch.Tb, ...lippe.slice(1, 4), K1, B1, F0], [K1, ...lippe.slice(5, 8), K2, B2, B1], [K2, ...lippe.slice(9, 12), Pf, B2]];
    let g = fac.map((f, i) => `<path d="M${f.map(P).join(" L")} Z" fill="url(#${id})" opacity="${[1, 0.9, 0.8][i]}"/>`).join("");
    /* Facettenkanten und Pfosten */
    let pf = `M${P(K1)} L${P(B1)} M${P(K2)} L${P(B2)}`;
    const x0 = Pf[0], x1 = sch.Tb[0], n = Math.max(3, Math.round((x1 - x0) / 1.6));
    const lipY = (x) => { for (let i = 0; i < 12; i++) { const a2 = lippe[i], b2 = lippe[i + 1]; if ((x - a2[0]) * (x - b2[0]) <= 0) return a2[1] + (b2[1] - a2[1]) * (x - a2[0]) / ((b2[0] - a2[0]) || 1); } return null; };
    for (let j = 1; j < n; j++) { const x = x0 + (x1 - x0) * j / n, yo = lipY(x), yu = F0[1] + (Pf[1] - F0[1]) * (x - F0[0]) / ((Pf[0] - F0[0]) || 1); if (yo != null && yu > yo) pf += `M${r(x)} ${r(yo + 0.3)}V${r(yu)}`; }
    g += `<path d="${pf}" stroke="#f3dcae" stroke-width=".2" opacity=".8"/>`;
    /* Himmelsreflex schräg über die mittlere Facette */
    const r1 = lerp(K1, B1, 0.35), r2 = lerp(K1, B1, 0.6), r3 = lerp(K2, B2, 0.75), r4 = lerp(K2, B2, 0.5);
    g += `<path d="M${P(r1)} L${P(r2)} L${P(r3)} L${P(r4)} Z" fill="#dcecf6" opacity=".38"/>`;
    /* Sockelkante unter dem Glas: Lichtlinie */
    g += `<path d="M${P(F0)} L${P(Pf)}" stroke="#f6e4c8" stroke-width=".35"/>`;
    return g;
  };
  /* Restaurant (Südwest, klein, an der Freitreppe) */
  const rB = schale(14, [32, 22], [17, 30], [25], true, 1), rA = schale(14, [27, 21], [42, 29], [36], false, 1);
  k += rA.svg + unterseite(rB, 14, 15) + rB.svg;
  /* Westgruppe: Konzertsaal (hinten) — die höchste Schale, 67 m */
  const CH = 30, JS = 88;
  const chA1 = schale(CH, [128, 35], [160, 45], [151], false, 1);
  const chA2 = schale(CH, [102, 42], [136, 56], [125], false, 1);
  const chB = schale(CH, [76, 30], [44, 47], [57], true, 1);
  const chA3 = schale(CH, [68, 29], [112, 67], [100], false, 1);
  k += glasvorhang(chA1, CH) + chA1.svg + chA2.svg + unterseite(chB, CH, 42) + chB.svg + chA3.svg;
  /* Ostgruppe: Joan Sutherland Theatre (vorn) */
  const jA1 = schale(JS, [124, 31], [156, 39], [148]);
  const jA2 = schale(JS, [99, 38], [132, 50], [122]);
  const jB = schale(JS, [74, 27], [47, 41], [59], true);
  const jA3 = schale(JS, [68, 26], [110, 60], [99]);
  const gwFuss = op(170, JS, SOCKEL_Z);
  k += glasvorhang(jA1, JS) + jA1.svg + jA2.svg + unterseite(jB, JS, 45) + jB.svg + jA3.svg;
  /* Menschen auf dem Sockel und auf der Freitreppe (winzig, 1,7 m) */
  let leute = "";
  const farben = ["#c0392b", "#2f6fb6", "#f2c62f", "#ffffff", "#2a2a2a", "#3c8f5a", "#e58fa1"];
  for (let i = 0; i < 11; i++) {
    const s = i < 5 ? 6 + i * 6 : 40 + (i - 5) * 15 + rnd() * 6, e = i < 5 ? 30 + rnd() * 70 : 117, z = i < 5 ? stZ(Math.floor(s / TREPPE_S * N_ST)) + 0.4 : SOCKEL_Z;
    const f = op(s, e, z), h = F * 1.7 / f[2];
    leute += `<rect x="${r(f[0] - 0.25)}" y="${r(f[1] - h * 0.85)}" width=".5" height="${r(h * 0.6)}" fill="${farben[i % 7]}"/><circle cx="${r(f[0])}" cy="${r(f[1] - h * 0.92)}" r=".26" fill="#d9b08c"/><path d="M${r(f[0] - 0.15)} ${r(f[1] - h * 0.25)} L${r(f[0] - 0.15)} ${r(f[1])} M${r(f[0] + 0.15)} ${r(f[1] - h * 0.25)} L${r(f[0] + 0.15)} ${r(f[1])}" stroke="#3a3f48" stroke-width=".22"/>`;
  }
  k += leute;
  /* Unter-Teile (Lupe) */
  const mitteJ = qb(op(99, JS, SOCKEL_Z), op(89, JS, 52), op(110, JS, 60), 0.5);
  opUnter.push(
    { id: "schale", de: "die Schale", syl: "SCHA-le", it: "il guscio", itSyl: "GU-scio", en: "roof shell", x: chA3.T[0] - 4, y: chA3.T[1] + 16,
      kunst: flaeche(-9, -16, 15, 16), tipp: "Die Dachschalen sehen aus wie Segel. Die höchste ist 67 Meter hoch." },
    { id: "fliese", de: "die Fliese", syl: "FLIE-se", it: "la piastrella", itSyl: "pia-STREL-la", en: "tile", x: mitteJ[0] + 4, y: mitteJ[1] + 9,
      kunst: flaeche(-8, -11, 16, 12), tipp: "Über eine Million Fliesen aus Schweden: glänzend weiße und matt cremefarbene im Fischgrätmuster." },
    { id: "glaswand", de: "die Glaswand", syl: "GLAS-wand", it: "la vetrata", itSyl: "ve-TRA-ta", en: "glass wall", x: (jA1.Pp[0] + gwFuss[0]) / 2 + 1, y: jA1.Pp[1],
      kunst: flaeche(-7, -15, 14, 15), tipp: "Die großen Glaswände sind topasfarben. Aus den Foyers schaut man durch sie auf den Hafen." },
    { id: "treppe", de: "die Treppe", syl: "TREP-pe", it: "la scalinata", itSyl: "sca-li-NA-ta", en: "steps", x: op(TREPPE_S * 0.55, 120, 0)[0], y: op(TREPPE_S * 0.55, 120, 0)[1],
      kunst: flaeche(-12, -14, 22, 14), tipp: "Über die breite Freitreppe im Süden gehen die Besucher hinauf zu den Sälen." },
    { id: "sockel", de: "der Sockel", syl: "SO-ckel", it: "il basamento", itSyl: "ba-sa-MEN-to", en: "podium", x: op(120, 120, 0)[0], y: op(120, 120, 0)[1],
      kunst: flaeche(-26, -12, 52, 12), tipp: "Der Sockel ist mit Platten aus rosa Granit verkleidet." });
  const oz = op(90, 60, 30);
  S.teil({ id: "opernhaus", de: "das Opernhaus", syl: "O-pern-haus", it: "il teatro dell'opera", itSyl: "te-A-tro del-LO-pe-ra", en: "Sydney Opera House",
    x: 0, y: 0, kunst: k, tipp: "Das Sydney Opera House wurde 1973 eröffnet. Seine Dächer sehen aus wie Segel im Wind.",
    zoom: { x: r(oz[0] - 72), y: 90, w: 150, h: 98 }, unter: opUnter });
}

/* =====================================================================
   2b — DER BOTANISCHE GARTEN am Ufer von Farm Cove (links, näher als
        das Opernhaus): Moreton-Bay-Feigen, Palmen, Ufermauer
   ===================================================================== */
{
  let b = "";
  /* Ufermauer von Farm Cove (Sandsteinquader, hell, mit dunklem Gezeitenstreifen) */
  b += `<path d="M0 146.6 L78 147.2 L78 149.6 L0 149.6 Z" fill="#d9caa8"/><path d="M0 146.6 L78 147.2" stroke="#f2e6c8" stroke-width=".4"/><rect x="0" y="146.8" width="78" height="2.6" fill="url(#${S.id("quaderk")})"/><path d="M0 149.3 L78 149.3" stroke="#4a4a36" stroke-width=".6"/>`;
  S.def(`<pattern id="${S.id("quaderk")}" width="3.4" height="1.3" patternUnits="userSpaceOnUse" patternTransform="translate(0 146.8)"><path d="M.1 0v1.3M1.8 1.3v1.3M0 1.3h3.4" stroke="#a89878" stroke-width=".15"/></pattern>`);
  /* Moreton-Bay-Feigen: kurze, dicke Stämme, sehr breite, flach gewölbte Kronen mit gebuckeltem Rand;
     Licht oben rechts, Blattmuster */
  const KRONE = S.rg("krone", [[0, "#5f8f48"], [0.5, "#355f30"], [1, "#1f3d22"]], 0.62, 0.25, 0.8);
  const feige = (x, y, w, h) => {
    let g = `<path d="M${r(x - w * 0.06)} ${y} L${r(x - w * 0.035)} ${r(y - h * 0.4)} L${r(x + w * 0.035)} ${r(y - h * 0.4)} L${r(x + w * 0.07)} ${y} Z" fill="#6b5e4e"/>`;
    g += `<path d="M${r(x - w * 0.14)} ${y} Q${r(x - w * 0.06)} ${r(y - h * 0.12)} ${r(x - w * 0.04)} ${r(y - h * 0.1)} M${r(x + w * 0.14)} ${y} Q${r(x + w * 0.06)} ${r(y - h * 0.12)} ${r(x + w * 0.05)} ${r(y - h * 0.1)}" stroke="#6b5e4e" stroke-width=".6" fill="none"/>`;
    const n = 9; let d = `M${r(x - w / 2)} ${r(y - h * 0.34)}`;
    for (let i = 1; i <= n; i++) { const t = i / n, px = x - w / 2 + w * t, py = y - h * (0.34 + 0.62 * Math.pow(Math.sin(t * Math.PI), 0.6)) - rnd() * h * 0.06; d += ` Q${r(px - w / n * 0.5)} ${r(py - h * 0.14)} ${r(px)} ${r(py)}`; }
    d += ` Q${r(x + w * 0.3)} ${r(y - h * 0.26)} ${r(x)} ${r(y - h * 0.3)} Q${r(x - w * 0.3)} ${r(y - h * 0.26)} ${r(x - w / 2)} ${r(y - h * 0.34)} Z`;
    g += `<path d="${d}" fill="${KRONE}"/><path d="${d}" fill="url(#${S.id("blatt")})" opacity=".3"/>`;
    return g;
  };
  /* zwei breite Moreton-Bay-Feigen (≈ 25 m hoch, 40 m Krone) – links der Oper, damit das Restaurant frei bleibt */
  b += feige(22, 147.2, 46, 30) + feige(57, 147.5, 30, 21);
  /* Spaziergänger auf der Uferpromenade von Farm Cove (≈ 2,3 Einheiten hoch) */
  for (const [x, f] of [[9, "#c0392b"], [33, "#f4f1ea"], [44, "#2f6fb6"], [66, "#f2c62f"]]) b += `<rect x="${x - 0.35}" y="145" width=".7" height="1.3" fill="${f}"/><circle cx="${x}" cy="144.6" r=".38" fill="#c99a78"/><path d="M${x - 0.2} 146.3v1M${x + 0.2} 146.3v1" stroke="#3a3f48" stroke-width=".25"/>`;
  /* einzelne Palmen (Kohlpalmen) */
  for (const [x, h] of [[27, 22], [54, 18], [74, 13]]) {
    b += `<path d="M${x} 147.4 Q${x + 0.5} ${147.4 - h * 0.5} ${x + 0.2} ${r(147.4 - h)}" stroke="#7a6a52" stroke-width=".8" fill="none"/>`;
    for (let k2 = 0; k2 < 8; k2++) { const a = (-160 + k2 * 40) * Math.PI / 180; b += `<path d="M${x + 0.2} ${r(147.4 - h)} q${r(Math.cos(a) * 3)} ${r(Math.sin(a) * 2.4 - 1)} ${r(Math.cos(a) * 5.4)} ${r(Math.sin(a) * 2.6 + 1.8)}" stroke="#46733a" stroke-width=".8" fill="none" stroke-linecap="round"/>`; }
  }
  S.teil({ id: "botanischer_garten", de: "der Botanische Garten", syl: "bo-TA-ni-sche GAR-ten", it: "l'orto botanico", itSyl: "OR-to bo-TA-ni-co", en: "botanic garden", x: 0, y: 0, kunst: b,
    tipp: "Der Botanische Garten liegt direkt neben dem Opernhaus. Er ist über 200 Jahre alt." });
}

/* =====================================================================
   3 — DER HAFEN (Wasser von Farm Cove und Port Jackson) mit Spiegelbildern
   ===================================================================== */
const KANTE = (x) => 190.5 + Math.sin(x / 23) * 1.2 + (x < 130 ? -1.5 : 0);
const BOOTE = [[262, 157.6, 1], [356, 151.6, 0.55]];
const FAEHRE = { X: 296, Y: 157.4, s: 0.78 };
{
  let k = `<path d="M0 147.5 L400 147.5 L400 ${r(KANTE(400))} ${[...Array(21)].map((_, i) => `L${400 - i * 20} ${r(KANTE(400 - i * 20))}`).join(" ")} Z" fill="${S.lg("wasser", [[0, "#6f9ab5"], [0.2, "#3a789c"], [1, "#1b4d69"]])}"/>`;
  /* Spiegelbilder: gleiche Projektion mit negativer Höhe, dann zur Wasserlinie hin auf ≈ 45 % gestaucht
     (bewegtes Wasser); in waagerechte, an den Rändern zerrissene Streifen zerlegt, nach vorn ausblendend */
  const stauch = (yw, f, inhalt) => `<g transform="translate(0 ${r(yw)}) scale(1 ${f}) translate(0 ${r(-yw)})">${inhalt}</g>`;
  let opS = `<path d="M${P(op(0, 120, -0.5))} L${P(op(183, 120, -0.5))} L${P(op(183, 120, -SOCKEL_Z))} L${P(op(0, 120, -SOCKEL_Z))} Z" fill="#d2a690"/>`;
  for (const o of SPIEGEL_OP) {
    const B0 = op(o.b[0], o.e, -o.b[1]), T = op(o.t[0], o.e, -o.t[1]), Pp = op(o.p[0], o.e, -SOCKEL_Z);
    opS += `<path d="M${P(Pp)} L${P(B0)} Q${P([B0[0] + (T[0] - B0[0]) * 0.3, T[1] - (T[1] - B0[1]) * 0.25])} ${P(T)} Q${P([(T[0] + Pp[0]) / 2 - 1, (T[1] + Pp[1]) / 2])} ${P(Pp)} Z" fill="${o.e === 88 ? "#fff3d4" : "#f3e6c8"}"/>`;
  }
  let pyS = "";
  for (const [a, c] of [[-15, 31], [518, 31], [518, -31]]) pyS += `<path d="M${P(bp(a - 10, c + 7, -0.5))} L${P(bp(a + 10, c + 7, -0.5))} L${P(bp(a + 10, c + 7, -89))} L${P(bp(a - 10, c + 7, -89))} Z" fill="#dcc7a2"/>`;
  const bo = [200, 240, 280, 320, 360, 400, 440, 480, 503].map((a) => bp(a, 15, -zO(a))), bu = [503, 480, 440, 400, 360, 320, 280, 240, 200].map((a) => bp(a, 15, -zU(a)));
  pyS += `<path d="M${bo.map(P).join(" L")} L${bu.map(P).join(" L")} Z" fill="#7f8a92" opacity=".75"/>`;
  pyS += `<path d="M${P(bp(250, 24, -49))} L${P(bp(560, 24, -49))}" stroke="#76818a" stroke-width="1.4" opacity=".7"/>`;
  let sp = stauch(op(90, 60, 0)[1], 0.45, opS) + stauch(bp(518, 31, 0)[1], 0.45, pyS);
  sp += stauch(FAEHRE.Y, 0.5, `<rect x="${r(FAEHRE.X - 16 * FAEHRE.s)}" y="${r(FAEHRE.Y + 0.4)}" width="${r(32 * FAEHRE.s)}" height="${r(3.2 * FAEHRE.s)}" fill="#2f7a4a"/><rect x="${r(FAEHRE.X - 14 * FAEHRE.s)}" y="${r(FAEHRE.Y + 3.4)}" width="${r(28 * FAEHRE.s)}" height="${r(4.4 * FAEHRE.s)}" fill="#ecc860"/>`);
  for (const [x, y, s] of BOOTE) sp += stauch(y, 0.5, `<path d="M${r(x)} ${r(y + 1)} L${r(x + 6 * s)} ${r(y + 1)} L${r(x + 0.3)} ${r(y + 17 * s)} Z" fill="#ffffff"/>`);
  sp += `<rect x="0" y="148.6" width="76" height="5" fill="#24432a"/>`;
  /* Wellenmaske aus Linsen mit spitzen Enden (oben und unten gewölbt, keine senkrechten Kanten); jede
     Zeile in der Höhe versetzt, Lücken stark gestreut; hinten flach, lang und fast geschlossen, vorn kürzer
     und lückiger. Dazu verzerrt ein Turbulenz-Filter die Ränder wie bewegtes Wasser. */
  let mk = "";
  for (let y = 147.4; y < 192;) {
    const t = (y - 147.4) / 44, h = 0.55 + t * 1.1;
    for (let x = -rnd() * 6; x < 400;) {
      const l = (t < 0.18 ? 14 + rnd() * 26 : 4 + rnd() * (16 - t * 6)), yy = y + (rnd() - 0.5) * 0.6;
      mk += `M${r(x)} ${r(yy)}q${r(l / 2)} ${r(-h)} ${r(l)} 0q${r(-l / 2)} ${r(h)} ${r(-l)} 0z`;
      x += l + (t < 0.18 ? 0.2 + rnd() * 0.8 : 0.2 + rnd() * (0.6 + t * 2.4));
    }
    y += h * 0.95 + 0.1 + t * 0.6;
  }
  S.def(`<mask id="${S.id("spmaske")}" maskUnits="userSpaceOnUse" x="0" y="146" width="400" height="50"><path d="${mk}" fill="${S.lg("spfade", [[0, "#fff"], [0.55, "#bbb"], [1, "#000"]], 0, 146, 0, 190, ' gradientUnits="userSpaceOnUse"')}"/></mask>`);
  S.def(`<filter id="${S.id("welle")}" x="-5%" y="-10%" width="110%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".015 .35" numOctaves="1" seed="7" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="2.6" xChannelSelector="R" yChannelSelector="G" result="d"/><feGaussianBlur in="d" stdDeviation=".8 .15"/></filter>`);
  k += `<g mask="url(#${S.id("spmaske")})" opacity=".85"><g filter="url(#${S.id("welle")})">${sp}</g></g>`;
  /* Wellen: einzelne Bögen, hinten klein, flach und dicht, vorn breiter und locker; Länge und Abstand
     streuen (± 40 %). Dunkle Wellentäler, wenige helle Kämme; weiße Glanzbögen nur im Glitzerfeld
     rechts der Fähre (Sonne rechts hinter uns) */
  const baender = [[148.6, 156, 0.22, 0.32], [156, 168, 0.32, 0.4], [168, 180, 0.45, 0.5], [180, 192, 0.6, 0.55]];
  for (const [y0, y1, sw, op1] of baender) {
    let dk = "", hl = "";
    for (let y = y0; y < y1;) {
      const L = 0.9 + (y - 148) * 0.2;
      for (let x = rnd() * L * 2; x < 398;) {
        const l = Math.min(L * (0.6 + 0.8 * rnd()), 399.5 - x), hh = l * (0.1 + rnd() * 0.06);
        if (l < 0.8) break;
        if (rnd() < 0.72) dk += `M${r(x)} ${r(y)}q${r(l / 2)} ${r(hh)} ${r(l)} 0`; else hl += `M${r(x)} ${r(y)}q${r(l / 2)} ${r(-hh)} ${r(l)} 0`;
        x += l * (1.2 + 1.8 * rnd());
      }
      y += 0.5 + (y - 148) * 0.075 + rnd() * 0.4;
    }
    k += `<path d="${dk}" stroke="#123a52" stroke-width="${sw}" fill="none" opacity="${op1 + 0.15}"/><path d="${hl}" stroke="#cfe3ee" stroke-width="${sw}" fill="none" opacity="${op1}"/>`;
  }
  let gl = "";
  for (let i = 0; i < 46; i++) { const y = 154 + Math.pow(rnd(), 1.3) * 30, x = Math.min(392, 304 + rnd() * 92 - (y - 154) * 0.6), w = 0.8 + (y - 148) * 0.09 * (0.6 + rnd()); gl += `M${r(x)} ${r(y)}q${r(w / 2)} ${r(-w * 0.18)} ${r(w)} 0`; }
  k += `<path d="${gl}" stroke="#fffdf4" stroke-width=".42" fill="none" opacity=".9"/>`;
  /* Wasser schlägt an die Ufermauer: dunkler Streifen mit Lichtkante */
  const ufer = [...Array(41)].map((_, i) => `${i * 10} ${r(KANTE(i * 10) - 1.1)}`).join(" L");
  k += `<path d="M${ufer}" stroke="#0f3346" stroke-width="2" fill="none" opacity=".55"/><path d="M${[...Array(41)].map((_, i) => `${i * 10} ${r(KANTE(i * 10) - 2.4)}`).join(" L")}" stroke="#e6f1f6" stroke-width=".4" stroke-dasharray="3 2 6 3" fill="none" opacity=".7"/>`;
  /* Dunst über dem Wasser am Horizont */
  k += `<rect x="0" y="147.5" width="400" height="6" fill="${S.lg("wdunst", [[0, "#e6eef2", 0.55], [1, "#e6eef2", 0]])}"/>`;
  S.teil({ id: "hafen", de: "der Hafen", syl: "HA-fen", it: "il porto", itSyl: "POR-to", en: "harbour", x: 0, y: 0, kunst: k,
    tipp: "Der Hafen von Sydney (Port Jackson) gilt als einer der schönsten Naturhäfen der Welt." });
}

/* =====================================================================
   4 — DAS SEGELBOOT, 5 — DIE FÄHRE (grün und gold), 6 — DAS WASSERTAXI
   ===================================================================== */
{
  let k = "";
  const boot = (x, y, s, seg) => {
    let g = `<path d="M${r(x - 6 * s)} ${r(y - 1.6 * s)} L${r(x + 7 * s)} ${r(y - 1.6 * s)} Q${r(x + 5.6 * s)} ${r(y)} ${r(x + 3 * s)} ${r(y)} L${r(x - 5 * s)} ${r(y)} Z" fill="#fbfbfa"/>`;
    g += `<rect x="${r(x - 6 * s)}" y="${r(y - 0.6 * s)}" width="${r(12 * s)}" height="${r(0.4 * s)}" fill="#1f4f8f"/>`;
    g += `<line x1="${r(x)}" y1="${r(y - 1.6 * s)}" x2="${r(x)}" y2="${r(y - 19 * s)}" stroke="#d8dcde" stroke-width="${r(0.3 * s)}"/>`;
    g += `<path d="M${r(x + 0.3 * s)} ${r(y - 18.4 * s)} Q${r(x + 6 * s)} ${r(y - 9 * s)} ${r(x + 6.4 * s)} ${r(y - 2.4 * s)} L${r(x + 0.3 * s)} ${r(y - 2.4 * s)} Z" fill="${seg}"/>`;
    g += `<path d="M${r(x + 0.3 * s)} ${r(y - 18.4 * s)} Q${r(x + 6 * s)} ${r(y - 9 * s)} ${r(x + 6.4 * s)} ${r(y - 2.4 * s)}" stroke="#d9dde0" stroke-width="${r(0.25 * s)}" fill="none"/>`;
    g += `<path d="M${r(x - 0.3 * s)} ${r(y - 16 * s)} Q${r(x - 4 * s)} ${r(y - 9 * s)} ${r(x - 5.4 * s)} ${r(y - 2.6 * s)} L${r(x - 0.3 * s)} ${r(y - 2.6 * s)} Z" fill="#e9edf0"/>`;
    g += `<path d="M${r(x - 5.4 * s)} ${r(y + 0.4 * s)} q${r(6 * s)} .8 ${r(12 * s)} 0" stroke="#fff" stroke-width="${r(0.3 * s)}" fill="none" opacity=".6"/>`;
    return g;
  };
  for (const [x, y, s] of BOOTE) k += boot(x, y, s, "#ffffff");
  S.teil({ id: "segelboot", de: "das Segelboot", syl: "SE-gel-boot", it: "la barca a vela", itSyl: "BAR-ca a VE-la", en: "sailing boat", x: 0, y: 0, kunst: k });
}
{
  /* First-Fleet-Fähre: Doppelender, grüner Rumpf, goldgelbes Deckshaus, Steuerhaus in der Mitte */
  const { X, Y, s } = FAEHRE;
  let k = schatten(0, 0.2, 18 * s, 0.9, 0.25);
  /* Fahrt nach rechts (Osten): Bugwelle vorn, schäumendes Heckwasser und ein V-förmiges Kielwasser nach links */
  k += `<path d="M${r(-15 * s)} .2 L${r(-44 * s)} ${r(-1.4 * s)} M${r(-15 * s)} .5 L${r(-46 * s)} ${r(2.6 * s)}" stroke="#e8f2f6" stroke-width=".45" opacity=".75"/>`;
  k += `<path d="M${r(-14 * s)} -.2 q${r(-6 * s)} -.4 ${r(-14 * s)} .3 q${r(6 * s)} 1 ${r(14 * s)} .3 Z" fill="#f4f9fb" opacity=".85"/>`;
  k += `<path d="M${r(13.6 * s)} .3 q${r(2.4 * s)} ${r(-1.3 * s)} ${r(4.6 * s)} ${r(-0.2 * s)} q${r(1.6 * s)} ${r(0.7 * s)} ${r(3.4 * s)} ${r(0.3 * s)} q${r(-3.6 * s)} ${r(0.9 * s)} ${r(-8 * s)} ${r(0.2 * s)} Z" fill="#ffffff"/>`;
  k += `<path d="M${-17 * s} ${-3.2 * s} L${17 * s} ${-3.2 * s} Q${16 * s} 0 ${14 * s} .3 L${-14 * s} .3 Q${-16 * s} 0 ${-17 * s} ${-3.2 * s} Z" fill="${S.lg("faehrrumpf", [[0, "#2f7a4a"], [1, "#1b4f2f"]])}"/>`;
  k += `<rect x="${-16.6 * s}" y="${-3.9 * s}" width="${33.2 * s}" height="${0.7 * s}" fill="#f2f0e4"/>`;
  k += `<path d="M${-14.6 * s} ${-3.9 * s} L${-14 * s} ${-8 * s} L${14 * s} ${-8 * s} L${14.6 * s} ${-3.9 * s} Z" fill="${S.lg("deckshaus", [[0, "#f6dc7e"], [1, "#e0b84a"]])}"/>`;
  for (let x = -13; x < 13; x += 2.6) k += `<rect x="${r(x * s)}" y="${r(-7.2 * s)}" width="${r(1.9 * s)}" height="${r(2.3 * s)}" rx=".2" fill="#2f3f3a"/>`;
  k += `<rect x="${-14.4 * s}" y="${-8.6 * s}" width="${28.8 * s}" height="${0.7 * s}" fill="#2f7a4a"/>`;
  k += `<path d="M${-3 * s} ${-8.6 * s} L${-2.6 * s} ${-11.2 * s} L${2.6 * s} ${-11.2 * s} L${3 * s} ${-8.6 * s} Z" fill="#f6dc7e"/><rect x="${-2.2 * s}" y="${-10.6 * s}" width="${4.4 * s}" height="${1.2 * s}" fill="#2f3f3a"/>`;
  k += `<rect x="${-0.2 * s}" y="${-14 * s}" width="${0.4 * s}" height="${2.8 * s}" fill="#2f7a4a"/><rect x="${-2.6 * s}" y="${-11.6 * s}" width="${5.2 * s}" height="${0.5 * s}" fill="#2f7a4a"/>`;
  k += `<text x="0" y="${r(-1.1 * s)}" font-size="${r(1.7 * s)}" text-anchor="middle" fill="#f2f0e4" font-family="Arial,sans-serif" font-weight="bold" letter-spacing=".2">SIRIUS</text>`;
  S.teil({ id: "faehre", de: "die Fähre", syl: "FÄH-re", it: "il traghetto", itSyl: "tra-GHET-to", en: "ferry", x: X, y: Y, kunst: k,
    tipp: "Die grün-goldenen Fähren fahren vom Circular Quay quer über den Hafen – wie ein Bus auf dem Wasser." });
}
{
  /* zweite Fähre weit hinten (vor Milsons Point) – Kulisse */
  const x = 334, y = 149.4, s = 0.42;
  S.hinten(`<g opacity=".9"><path d="M${r(x - 17 * s)} ${r(y - 3.2 * s)} L${r(x + 17 * s)} ${r(y - 3.2 * s)} L${r(x + 14 * s)} ${y} L${r(x - 14 * s)} ${y} Z" fill="#2f6a46"/><rect x="${r(x - 14 * s)}" y="${r(y - 7.6 * s)}" width="${r(28 * s)}" height="${r(4.4 * s)}" fill="#ecd27a"/><rect x="${r(x - 2.4 * s)}" y="${r(y - 10 * s)}" width="${r(4.8 * s)}" height="${r(2.4 * s)}" fill="#ecd27a"/></g>`);
}
{
  /* Wassertaxi: gelb mit schwarzem Band, schnell, mit weißer Bugwelle */
  const X = 214, Y = 168, s = 1.0;
  /* V-förmiges Kielwasser, setzt am Heck an; Schaum hinter dem Heck */
  let k = `<path d="M-8.6 .2 L-34 -2.2 M-8.6 .5 L-34 3.4" stroke="#eef6fa" stroke-width=".55" opacity=".75"/><path d="M-8.6 -.2q-5-.6-12 .3q6 1 12 .4z" fill="#f6fbfd" opacity=".85"/>`;
  k += `<path d="M7 0 q3 -.4 4 -1.6 M7 .4 q4 .4 6 -.2" stroke="#ffffff" stroke-width=".6" fill="none"/>`;
  k += `<path d="M-9 -2.6 L6 -2.6 Q9 -2.4 9.6 -1.6 Q8 .4 4 .4 L-8.4 .4 Q-9.2 -.6 -9 -2.6 Z" fill="${S.lg("taxi", [[0, "#f6cf2e"], [1, "#d9a812"]])}"/>`;
  k += `<rect x="-9" y="-1.3" width="17" height=".7" fill="#1d1d1d"/>`;
  k += `<path d="M-5 -2.6 L-4.4 -5.2 L2.6 -5.2 L4.6 -2.6 Z" fill="#f8f6ee"/><path d="M-3.8 -4.8 L2.2 -4.8 L3.6 -3 L-4.2 -3 Z" fill="#2f4250"/>`;
  k += `<text x="-2" y="-1.55" font-size="1" fill="#1d1d1d" font-family="Arial,sans-serif" font-weight="bold">WATER TAXI</text>`;
  S.teil({ id: "wassertaxi", de: "das Wassertaxi", syl: "WAS-ser-ta-xi", it: "il taxi acqueo", itSyl: "TA-xi AC-que-o", en: "water taxi", x: X, y: Y, kunst: k + flaeche(-10, -6, 20, 7),
    tipp: "Mit dem Wassertaxi fährt man schnell zu jedem Steg am Hafen." });
}

/* =====================================================================
   VORN — die Moreton-Bay-Feige, der Sandsteinfelsen, Mrs Macquarie's
   Chair, Rasen mit Picknick
   ===================================================================== */
{
  /* Moreton-Bay-Feige am linken Bildrand (≈ 20 m entfernt): breiter Stamm mit Brettwurzeln, ein Ast
     schwingt nach rechts oben, verjüngt sich und teilt sich in drei Zweige, die im Laub verschwinden;
     Luftwurzeln hängen herab bis zum Boden (hinter dem Felsen). Laub: unregelmäßige Massen mit
     Eigenschatten unten, Blattmuster, Himmelslöcher in verschiedenen Größen. Licht von rechts hinten. */
  const X = 0, Y = 203, s = vorn(Y);   // ≈ 36 Einheiten je Meter
  let k = `<g transform="translate(40 0)">${schlag(50, 0.3, s, 0.2)}</g>`;
  const RINDE = S.lg("rinde", [[0, "#4a453e"], [0.4, "#78716a"], [0.75, "#a59d8e"], [1, "#8a8274"]], 0, 0, 1, 0);
  /* Luftwurzeln (hinter Stamm und Ast): vier Bündel aus je 3–6 dünnen, welligen Strängen, die sich nach
     unten aufspalten und in Fransen enden; zwei Stränge sind zu Stelzwurzeln geworden (oben dünn, unten
     3–4× breiter) und reichen bis zum Boden. Alle links der Oper (x < 72). */
  let lw = "", fr = "";
  for (const [x0, y0, n, lmax] of [[30, -118, 5, 70], [42, -126, 4, 55], [55, -134, 6, 46], [66, -140, 3, 30]]) {
    for (let i = 0; i < n; i++) {
      const x = x0 + (i - n / 2) * 1.1 + rnd(), l = lmax * (0.45 + rnd() * 0.55), b = (rnd() - 0.5) * 4;
      lw += `M${r(x)} ${y0}c${r(b)} ${r(l * 0.35)} ${r(-b * 0.8)} ${r(l * 0.65)} ${r(b * 0.4)} ${r(l)}`;
      const ex = x + b * 0.4, ey = y0 + l;
      fr += `M${r(ex)} ${r(ey)}l-.8 ${r(2 + rnd() * 2)}M${r(ex)} ${r(ey)}l.2 ${r(3 + rnd() * 2)}M${r(ex)} ${r(ey)}l1 ${r(2 + rnd() * 1.5)}`;
    }
  }
  k += `<path d="${lw}" stroke="#8a8274" stroke-width=".55" fill="none"/><path d="${fr}" stroke="#9a9282" stroke-width=".3" fill="none"/>`;
  /* Stelzwurzeln bis zum Boden (unten hinter dem Felsen der Bank) */
  for (const [x0, y0, b] of [[36, -122, 2], [50, -130, -2.5]]) {
    let li = "", re = "";
    for (let i = 0; i <= 10; i++) { const t = i / 10, y = y0 + (-y0) * t, x = x0 + Math.sin(t * 3.2) * b, w = 0.6 + t * t * 3.4; li += `${i ? "L" : "M"}${r(x - w / 2)} ${r(y)}`; re = `L${r(x + w / 2)} ${r(y)}` + re; }
    k += `<path d="${li}${re}Z" fill="${S.lg("stelz", [[0, "#7c7466"], [0.5, "#9d9585"], [1, "#6c6558"]], 0, 0, 1, 0)}"/>`;
  }
  /* Brettwurzeln nach rechts auslaufend */
  for (const [x0, x1, y1] of [[22, 58, -1], [20, 44, -0.5], [14, 32, 0]]) k += `<path d="M${x0} ${-26 - (x0 - 14)} Q${r((x0 + x1) / 2)} ${r(-10 - (x0 - 6) * 0.5)} ${x1} ${y1} L${x1 - 10} ${y1 + 0.8} Q${r((x0 + x1) / 2 - 6)} ${r(-4)} ${x0 - 6} 0 Z" fill="${RINDE}"/>`;
  k += `<path d="M58 -1Q40 -12 22 -34M44 -.5Q32 -8 20 -30" stroke="#d2cab8" stroke-width=".7" fill="none" opacity=".6"/>`;
  /* Stamm */
  k += `<path d="M-4 0 Q-2 -60 -3 -110 Q-4 -160 -4 -203 L12 -203 Q10 -170 14 -140 Q20 -120 26 -105 Q20 -70 24 -40 Q26 -16 32 0 Z" fill="${RINDE}"/>`;
  /* sich verjüngender Ast mit drei Zweigen: Lichtkante oben, Schatten unten */
  const ast = (p0, c, p1, w0, w1) => {
    const n = (a, b2) => { const dx = b2[0] - a[0], dy = b2[1] - a[1], L = Math.hypot(dx, dy); return [dy / L, -dx / L]; };
    const n0 = n(p0, c), n1 = n(c, p1), nc = [(n0[0] + n1[0]) / 2, (n0[1] + n1[1]) / 2], wc = (w0 + w1) / 2;
    const o = (p, nn, w) => `${r(p[0] + nn[0] * w / 2)} ${r(p[1] + nn[1] * w / 2)}`;
    const u = (p, nn, w) => `${r(p[0] - nn[0] * w / 2)} ${r(p[1] - nn[1] * w / 2)}`;
    return { d: `M${o(p0, n0, w0)} Q${o(c, nc, wc)} ${o(p1, n1, w1)} L${u(p1, n1, w1)} Q${u(c, nc, wc)} ${u(p0, n0, w0)} Z`,
      oben: `M${o(p0, n0, w0 * 0.8)} Q${o(c, nc, wc * 0.8)} ${o(p1, n1, w1 * 0.7)}`, unten: `M${u(p0, n0, w0 * 0.75)} Q${u(c, nc, wc * 0.75)} ${u(p1, n1, w1 * 0.6)}` };
  };
  const aeste = [ast([4, -128], [50, -150], [96, -156], 26, 10), ast([94, -156], [116, -166], [146, -171], 8, 2.2), ast([92, -157], [106, -172], [116, -192], 7, 2), ast([96, -155], [126, -154], [158, -161], 6, 1.6)];
  k += aeste.map((a2) => `<path d="${a2.d}" fill="${RINDE}"/>`).join("");
  k += `<path d="${aeste.map((a2) => a2.unten).join("")}" stroke="#3e3933" stroke-width="1.6" fill="none" opacity=".45"/>`;
  k += `<path d="${aeste.map((a2) => a2.oben).join("")}" stroke="#ddd4bf" stroke-width="1.1" fill="none" opacity=".75"/>`;
  /* Rindenrippen am Stamm, Lichtkante rechts */
  k += `<path d="M2 -2Q0 -60 -2 -120M8 -2Q6 -60 4 -150M14 -2Q12 -50 9 -110M20 -2Q19 -40 16 -80" stroke="#3a3530" stroke-width=".9" fill="none" opacity=".45"/>`;
  k += `<path d="M26 -105 Q20 -70 24 -40 Q26 -16 32 0" stroke="#d2cab8" stroke-width="1.1" fill="none" opacity=".55"/>`;
  /* Laubmassen: unregelmäßiger, gebuckelter Umriss (in den Bildrand geklemmt) */
  S.def(`<pattern id="${S.id("blatt")}" width="8" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-12) scale(.62)"><g fill="#86b062"><ellipse cx="1.5" cy="1.2" rx="1.4" ry=".6" transform="rotate(-25 1.5 1.2)"/><ellipse cx="5.6" cy="3.6" rx="1.3" ry=".6" transform="rotate(30 5.6 3.6)"/></g><g fill="#1b361d"><ellipse cx="3.8" cy="1.6" rx="1.3" ry=".55" transform="rotate(20 3.8 1.6)"/><ellipse cx="1.8" cy="4.6" rx="1.4" ry=".6" transform="rotate(-40 1.8 4.6)"/><ellipse cx="7" cy=".8" rx="1.1" ry=".5"/></g></pattern>`);
  const masse = (cx, cy, rx, ry, n) => {
    const pts = [];
    for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2, f = 0.82 + rnd() * 0.3; pts.push([Math.max(1, cx + Math.cos(a) * rx * f), Math.max(-202, cy + Math.sin(a) * ry * f)]); }
    const ri = Math.round;
    let d = `M${ri(pts[0][0])} ${ri(pts[0][1])}`;
    for (let i = 1; i <= n; i++) { const p0 = pts[i - 1], p1 = pts[i % n], m = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2], o = [m[0] - cx, m[1] - cy], L = Math.hypot(o[0] / rx, o[1] / ry) || 1, bu = 0.22 + rnd() * 0.12; d += `Q${ri(Math.max(1, m[0] + o[0] / L * bu))} ${ri(Math.max(-202, m[1] + o[1] / L * bu * 1.4))} ${ri(p1[0])} ${ri(p1[1])}`; }
    return `<path d="${d}Z"/>`;
  };
  /* fünf große, unregelmäßige Laubmassen (+ eine kleine): dunkle Unterseite, hellere, sonnige Oberkante;
     am Rand einzelne Blattgruppen; Himmelslücken in verschiedenen Größen */
  const massen = [[22, -178, 30, 24, 14], [64, -188, 30, 15, 13], [104, -191, 28, 12, 12], [136, -175, 24, 11, 11], [30, -146, 22, 13, 10], [160, -173, 8, 6, 6]];
  S.def(`<g id="${S.id("laubdach")}">${massen.map((m) => masse(...m)).join("")}</g>`);
  const LAUB0 = S.rg("laub", [[0, "#7aa957"], [0.4, "#3a6a33"], [0.8, "#1d3a1f"], [1, "#132914"]], 0.7, 0.18, 0.85);
  k += `<use href="#${S.id("laubdach")}" fill="${LAUB0}"/>`;
  /* sonnige Oberkante: kleinere, nach oben rechts versetzte Kopie jeder Masse in warmem Hellgrün */
  let ob = "";
  for (const [mx, my, rx, ry] of massen) ob += `<ellipse cx="${r(mx + rx * 0.12)}" cy="${r(my - ry * 0.42)}" rx="${r(rx * 0.72)}" ry="${r(ry * 0.4)}"/>`;
  S.def(`<clipPath id="${S.id("laubclip")}"><use href="#${S.id("laubdach")}"/></clipPath>`);
  k += `<g clip-path="url(#${S.id("laubclip")})" fill="#a6cc72" opacity=".5" filter="url(#bw_weich)">${ob}</g>`;
  /* Blattgruppen am Rand: zwei Symbole (hell oben, dunkel unten), entlang der Massenränder verteilt */
  S.def(`<g id="${S.id("bgh")}"><ellipse cx="0" cy="0" rx="1.7" ry=".7" transform="rotate(-30)"/><ellipse cx="1.4" cy=".6" rx="1.6" ry=".65" transform="rotate(20 1.4 .6)"/><ellipse cx="-1.2" cy=".9" rx="1.5" ry=".6" transform="rotate(50 -1.2 .9)"/><ellipse cx=".4" cy="-1" rx="1.4" ry=".6" transform="rotate(-70 .4 -1)"/></g>`);
  let bg = "";
  for (const [mx, my, rx, ry] of massen) {
    const n = Math.round(rx * 1.3);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + rnd() * 0.3, f = 0.86 + rnd() * 0.16, x = mx + Math.cos(a) * rx * f, y = my + Math.sin(a) * ry * f;
      if (y < -200 || x < 2) continue;
      const hell = Math.sin(a) < 0.1;
      bg += `<use href="#${S.id("bgh")}" fill="${hell ? ["#7eae58", "#6a9a4a", "#90bf66"][i % 3] : ["#1a331b", "#244626", "#2f5a2d"][i % 3]}" transform="translate(${r(x)} ${r(y)}) rotate(${Math.round(rnd() * 180)}) scale(${r(0.5 + rnd() * 0.35)})"/>`;
    }
  }
  k += bg;
  let lo = "";
  for (const [hx, hy, w] of [[52, -170, 4.2], [88, -186, 1.4], [14, -165, 1.8], [118, -184, 3.4], [72, -194, 1], [142, -172, 1.2], [36, -192, 2.6], [100, -194, 0.8], [26, -140, 1.6], [62, -180, 0.9]]) lo += `M${r(hx - w)} ${hy}q${r(w * 0.3)} ${r(-w * 0.9)} ${r(w)} ${r(-w * 0.7)}q${r(w * 0.9)} ${r(w * 0.1)} ${r(w)} ${r(w * 0.8)}q${r(-w * 0.6)} ${r(w * 0.7)} ${r(-w * 1.2)} ${r(w * 0.5)}z`;
  k += `<path d="${lo}" fill="${S.lg("loch", [[0, "#4f86c4"], [1, "#6b9ed2"]])}"/><path d="${lo}" fill="none" stroke="#1b361d" stroke-width=".6" opacity=".7"/>`;
  /* Brettwurzel-Rippen am sichtbaren Stamm (der Fuß liegt hinter dem Felsen der Bank) */
  k += `<path d="M24 -40 Q30 -56 38 -60 L36 -54 Q30 -48 27 -38 Z M-2 -40 Q-1 -52 4 -60 L5 -54 Q2 -48 2 -40 Z" fill="${RINDE}"/><path d="M38 -60 Q30 -56 24 -40 M4 -60 Q-1 -52 -2 -40" stroke="#d2cab8" stroke-width=".6" fill="none" opacity=".6"/>`;
  S.teil({ id: "feigenbaum", de: "der Feigenbaum", syl: "FEI-gen-baum", it: "il fico", itSyl: "FI-co", en: "fig tree", x: X, y: Y, kunst: k,
    tipp: "Die Moreton-Bay-Feige hat riesige Brettwurzeln und Luftwurzeln. In Sydneys Parks stehen viele davon." });
}
{
  /* Sandsteinfelsen (Hawkesbury-Sandstein): Bänke, Kreuzschichtung, Eisenbänder, Waben; Ufermauer zum Wasser */
  const RASEN = (x) => KANTE(x) + 10 - (x - 250) * 0.01;
  const rand = [[214, 260], [217, 246], [222, 233], [230, 222], [242, 214], [256, 206], [272, 202]];
  const rasenRand = [...Array(7)].map((_, i) => 272 + i * 21.4);
  const grenze = rand.slice().reverse().map(([x, y]) => `L${x} ${y}`).join(" ");
  const kantePfad = [...Array(41)].map((_, i) => { const x = i * 10; return `L${x} ${r(KANTE(x))}`; }).join(" ");
  const umriss = `M0 ${r(KANTE(0))} ${kantePfad} ${rasenRand.slice().reverse().map((x) => `L${x} ${r(RASEN(x))}`).join(" ")} ${grenze} L0 260 Z`;
  S.def(`<path id="${S.id("felsp")}" d="${umriss}"/><clipPath id="${S.id("felsclip")}"><use href="#${S.id("felsp")}"/></clipPath>`);
  let k = `<use href="#${S.id("felsp")}" fill="${S.lg("fels", [[0, "#e6c68c"], [0.4, "#d4ab6c"], [1, "#ae8052"]])}"/>`;
  k += `<g clip-path="url(#${S.id("felsclip")})">`;
  /* Felsbänke: die Platte fällt in Stufen zum Betrachter ab. Jede Stufe: oben die helle Trittfläche,
     vorn die Stirn (Morgensonne von hinten rechts → hell, warm), darunter eine dunkle Schattenfuge */
  const baenke = [[200, 3.2], [214, 4.2], [232, 5.6], [250, 6.4]];
  S.def(`<pattern id="${S.id("kreuz")}" width="15" height="4.4" patternUnits="userSpaceOnUse" patternTransform="rotate(-4)"><path d="M0 .6q4 .8 8.5 2.8M7 2.6q3.5.5 7.6 1.6M10 .2q2.6.4 5 1.4" stroke="#9a6d3c" stroke-width=".25" fill="none" opacity=".55"/></pattern>`);
  baenke.forEach(([y0, h], i) => {
    const wav = (x) => y0 + Math.sin(x / 27 + i * 2) * 1.6 + Math.sin(x / 9 + i) * 0.5;
    let top = "", bot = "";
    const xs = [...Array(17)].map((_, j) => j * 18);
    top = xs.map((x) => `${r(x)} ${r(wav(x))}`).join(" L");
    bot = xs.slice().reverse().map((x) => `${r(x)} ${r(wav(x) + h + Math.sin(x / 13) * 0.6)}`).join(" L");
    k += `<path d="M${top} L${bot} Z" fill="${S.lg("stirn", [[0, "#d9b47a"], [0.6, "#c59a5f"], [1, "#a77a45"]])}"/>`;
    k += `<path d="M${xs.slice().reverse().map((x) => `${r(x)} ${r(wav(x) + h + Math.sin(x / 13) * 0.6)}`).join(" L")}" stroke="#6f4a26" stroke-width="${r(0.6 + i * 0.25)}" fill="none" opacity=".55"/>`;
    k += `<path d="M${top}" stroke="#ffe3ac" stroke-width="${r(0.5 + i * 0.2)}" fill="none" opacity=".95"/>`;
    /* Kreuzschichtung in der Stirn: feine schräge Lagen */
    k += `<path d="M${top} L${bot} Z" fill="url(#${S.id("kreuz")})"/>`;
    /* Waben (Tafoni) in der Stirn */
    for (let j = 0; j < 1 + (i > 1); j++) { const x = 20 + rnd() * 180; k += taf(x, wav(x) + h * 0.5, r(0.6 + i * 0.3)); }
  });
  /* rostrote Eisenbänder: scharfe, wellige Linien entlang der Schichten auf den Trittflächen */
  let eis = "", eis2 = "";
  baenke.forEach(([y0, h], i) => {
    const wav = (x) => y0 + Math.sin(x / 27 + i * 2) * 1.6 + Math.sin(x / 9 + i) * 0.5;
    for (const [d, a0, a1] of [[h + 2.2, 0, 140], [h + 4.4, 60, 230], [h + 7, 10, 110]]) {
      if (i === 3 && d > h + 4) continue;
      let pth = "";
      for (let x = a0; x <= a1; x += 6) pth += `${x === a0 ? "M" : "L"}${x} ${r(wav(x) + d + Math.sin(x / 7 + i) * 0.5)}`;
      (d > h + 3 ? eis2 : (eis += pth, "")); if (d > h + 3) eis2 += pth;
    }
  });
  k += `<path d="${eis}" stroke="#a84e1c" stroke-width=".8" fill="none" opacity=".75"/><path d="${eis2}" stroke="#b8622a" stroke-width=".45" fill="none" opacity=".7"/>`;
  /* Klüfte (senkrechte Risse) mit Grasbüscheln */
  for (const [x, y0, y1] of [[58, 214, 232], [148, 200, 214], [96, 232, 250], [182, 214, 232]]) {
    k += `<path d="M${x} ${y0} l1 ${r((y1 - y0) * 0.5)} l-.6 ${r((y1 - y0) * 0.5)}" stroke="#5e3f20" stroke-width=".8" fill="none" opacity=".6"/>`;
    k += bueschel(x + 0.4, y0 + 1.2, r(0.9 + (y0 - 200) * 0.02));
  }
  for (const [x, y, sk] of [[22, 219, 1.1], [120, 236, 1.3], [200, 222, 1.1], [40, 254, 1.7], [168, 252, 1.6]]) k += bueschel(x, y, sk);
  /* Regenpfütze in einer Mulde der Felsplatte: spiegelt den Himmel; oben Schattenkante, unten Lichtkante */
  k += `<ellipse cx="132" cy="247.6" rx="25" ry="4.4" fill="#6a4a28" opacity=".35"/><ellipse cx="132" cy="248" rx="23.6" ry="3.7" fill="${S.lg("pfuetze", [[0, "#4f86bd"], [0.6, "#86b2d9"], [1, "#c9dcea"]])}"/>`;
  k += `<path d="M110 248.8q22 3.6 45 0" stroke="#f6e3b8" stroke-width=".6" fill="none"/><path d="M120 246.6h9M136 248.2h12" stroke="#e8f2f8" stroke-width=".35" opacity=".8"/>`;
  k += taf(30, 238, 2) + taf(198, 250, 2.3) + taf(78, 256, 2.6);
  /* Ufermauer aus behauenen Sandsteinquadern entlang der Wasserkante: Deckplatte (hell), Stirn mit
     Fugen, Kontaktschatten darunter; an der Wasserseite ein dunkler, nasser Gezeitenstreifen */
  let qd = "", qfu = "", toene = ["#e8d3a2", "#dcc48e", "#ecdab0", "#d6bd88"];
  const qs = {};
  for (let x = 0, j = 0; x < 400; j++) {
    const w = 7 + rnd() * 5, x1 = Math.min(400, x + w), t = toene[j % 4];
    qs[t] = (qs[t] || "") + `M${r(x)} ${r(KANTE(x) + 0.2)}L${r(x1)} ${r(KANTE(x1) + 0.2)}L${r(x1)} ${r(KANTE(x1) + 3.4)}L${r(x)} ${r(KANTE(x) + 3.4)}Z`;
    qfu += `M${r(x)} ${r(KANTE(x) + 0.2)}V${r(KANTE(x) + 3.4)}`;
    x = x1;
  }
  for (const t in qs) qd += `<path d="${qs[t]}" fill="${t}"/>`;
  const kanteO = [...Array(41)].map((_, i) => `${i * 10} ${r(KANTE(i * 10) - 0.9)}`), kanteU = [...Array(41)].map((_, i) => `${400 - i * 10} ${r(KANTE(400 - i * 10) + 3.4)}`);
  /* nasser, dunkler Gezeitenstreifen an der Wasserseite, Deckplatte mit Lichtkante, Fugen, Kontaktschatten */
  k += `<path d="M${kanteO.join(" L")} L${[...Array(41)].map((_, i) => `${400 - i * 10} ${r(KANTE(400 - i * 10) + 0.3)}`).join(" L")} Z" fill="#3f4a32"/>`;
  k += qd + `<path d="${qfu}" stroke="#7a5a32" stroke-width=".35"/><path d="M${[...Array(41)].map((_, i) => `${i * 10} ${r(KANTE(i * 10) + 0.5)}`).join(" L")}" stroke="#fbeccb" stroke-width=".6" fill="none"/>`;
  k += `<path d="M${kanteU.join(" L")}" stroke="#5e4022" stroke-width="1" fill="none" opacity=".6"/>`;
  /* Bordsteine am Rasen, Gras wächst darüber */
  let bord = "";
  for (let i = 0; i < rand.length - 1; i++) bord += `<path d="M${rand[i][0]} ${rand[i][1]} L${rand[i + 1][0]} ${rand[i + 1][1]}" stroke="#d9bf8c" stroke-width="2.4" stroke-linecap="round"/>`;
  bord += `<path d="M272 202 ${rasenRand.map((x) => `L${x} ${r(RASEN(x))}`).join(" ")}" stroke="#d9bf8c" stroke-width="2" fill="none"/>`;
  bord += `<path d="M${rand.map(([x, y]) => `${x + 1} ${y + 0.4}`).join(" L")} L${rand.slice().reverse().map(([x, y]) => `${x - 1.4} ${y - 3}`).join(" L")} Z" fill="url(#${S.id("gras")})"/>`;
  k += bord;
  /* Rasen (Kulisse, liegt unter dem Fels-Teil) */
  let ra = `<path d="M272 202 ${rasenRand.map((x) => `L${x} ${r(RASEN(x))}`).join(" ")} L400 260 L214 260 ${rand.slice(1, -1).map(([x, y]) => `L${x} ${y}`).join(" ")} Z" fill="${S.lg("rasen", [[0, "#82ad4f"], [1, "#4f7f2e"]])}"/>`;
  const rasenD = `M272 202 ${rasenRand.map((x) => `L${x} ${r(RASEN(x))}`).join(" ")} L400 260 L214 260 ${rand.slice(1, -1).map(([x, y]) => `L${x} ${y}`).join(" ")} Z`;
  S.def(`<pattern id="${S.id("gras2")}" href="#${S.id("gras")}" patternTransform="scale(1.7)"/>`);
  ra += `<path d="${rasenD}" fill="url(#${S.id("gras")})" opacity=".45"/><path d="M222 233 L400 233 L400 260 L214 260 L217 246 Z" fill="url(#${S.id("gras2")})" opacity=".4"/>`;
  /* Fußweg (0,7 m breit) zwischen Fels und Rasen, mit Querfugen: gibt dem Vordergrund den Maßstab */
  const wb = (y) => 0.7 * vorn(y);
  const innen = [...rand, ...rasenRand.slice(1).map((x) => [x, RASEN(x)])];
  const aussen = innen.map(([x, y], i) => i < rand.length ? [x + wb(y) * 0.92, y + wb(y) * 0.1] : [x, y + wb(y) * 0.24]);
  ra += `<path d="M${innen.map(([x, y]) => `${r(x)} ${r(y)}`).join(" L")} L${aussen.slice().reverse().map(([x, y]) => `${r(x)} ${r(y)}`).join(" L")} Z" fill="${S.lg("weg", [[0, "#ddd3bf"], [1, "#c4b79c"]])}"/>`;
  let fu = "";
  for (let i = 0; i < innen.length; i++) fu += `M${r(innen[i][0])} ${r(innen[i][1])}L${r(aussen[i][0])} ${r(aussen[i][1])}`;
  ra += `<path d="${fu}" stroke="#9c8f74" stroke-width=".35"/><path d="M${aussen.map(([x, y]) => `${r(x)} ${r(y)}`).join(" L")}" stroke="#6f8f3c" stroke-width=".8" fill="none"/>`;
  S.hinten(ra);
  S.teil({ id: "sandstein", de: "der Sandstein", syl: "SAND-stein", it: "l'arenaria", itSyl: "a-re-NA-ria", en: "sandstone", x: 0, y: 0, kunst: k,
    tipp: "Sydney steht auf gelbem Sandstein. Auch viele alte Häuser und die Ufermauern sind daraus gebaut." });
}

/* =====================================================================
   7 — MRS MACQUARIE'S CHAIR (Steinbank, in den Fels gehauen, schaut nach
       rechts aufs Wasser), 8 — DIE TOURISTIN, 9 — DER KAKADU
   ===================================================================== */
const BANK = { x: 70, y: 216 };
const BS = vorn(BANK.y);   // ≈ 44 Einheiten je Meter
/* Schrägansicht der Bank: U = Blickrichtung der Bank (nach rechts, leicht zum Betrachter),
   L = nach links der Sitzenden (in die Tiefe), W = nach oben; Längen in Metern */
const bU = [0.78 * BS, 0.06 * BS], bL = [0.62 * BS, -0.1 * BS];
const bq = (u, l, w) => [r(u * bU[0] + l * bL[0]), r(u * bU[1] + l * bL[1] - w * BS)];
const bP = (u, l, w) => { const p = bq(u, l, w); return `${p[0]} ${p[1]}`; };
{
  let k = schlag(80, 1.0, BS * 0.4, 0.3);
  const FELS = S.lg("bankfels", [[0, "#e5c78e"], [0.5, "#d2a868"], [1, "#a9793f"]], 0, 0, 1, 0);
  /* der Felsblock: natürlicher, verwitterter Sandstein hinten links, Gras oben; rechts ist die Bank ausgehauen */
  const blockPts = [[-1.3, -0.7, 0], [-1.42, -0.66, 0.35], [-1.38, -0.62, 0.62], [-1.47, -0.55, 0.9], [-1.4, -0.4, 1.18], [-1.3, -0.15, 1.36], [-1.1, 0.25, 1.46], [-0.9, 0.6, 1.5], [-0.7, 1.0, 1.44], [-0.55, 1.35, 1.5], [-0.42, 1.7, 1.42], [-0.3, 2.0, 1.3], [-0.18, 2.2, 1.06], [-0.1, 2.26, 0.82], [0.62, 2.12, 0.76], [0.7, 2.2, 0]];
  const blockD = `M${blockPts.map(([u, l, w]) => bP(u, l, w)).join(" L")} Z`;
  S.def(`<path id="${S.id("blockp")}" d="${blockD}"/><clipPath id="${S.id("bankblock")}"><use href="#${S.id("blockp")}"/></clipPath>`);
  k += `<use href="#${S.id("blockp")}" fill="${FELS}"/>`;
  k += `<g clip-path="url(#${S.id("bankblock")})">`;
  /* Bänke (Schichtung): unregelmäßig, gewellt, teils unterbrochen; Schattenfuge unten, Licht oben */
  for (let i = 0; i < 5; i++) {
    const w = 0.18 + i * 0.27 + (rnd() - 0.5) * 0.08, l0 = -0.7 + rnd() * 0.3, l1 = 2.3 - rnd() * 0.6;
    let fuge = `M${bP(-1.5, l0, w)}`;
    for (let j = 1; j <= 6; j++) { const t = j / 6; fuge += ` L${bP(-1.5 + t * 1.3, l0 + t * (l1 - l0), w + Math.sin(t * 7 + i) * 0.035 + (rnd() - 0.5) * 0.02)}`; }
    k += `<path d="${fuge}" stroke="#6f4a24" stroke-width="${r(0.6 + rnd() * 0.5)}" fill="none" opacity=".45" stroke-linejoin="round"/>`;
    k += `<path d="${fuge}" stroke="#f3dcab" stroke-width=".4" fill="none" opacity=".55" transform="translate(0 -.8)"/>`;
  }
  /* senkrechte Klüfte und abgerundete, verwitterte Kanten */
  for (const [u, l, w] of [[-1.2, 0.2, 1.38], [-0.95, 0.85, 0.9], [-0.7, 1.5, 1.4], [-1.3, -0.3, 0.6]]) k += `<path d="M${bP(u, l, w)} l.7 ${r(0.12 * BS)} l-.5 ${r(0.1 * BS)} l.6 ${r(0.12 * BS)}" stroke="#6f4a24" stroke-width=".55" fill="none" opacity=".45"/>`;
  /* Flecken: Eisen (rostig), Flechten (dunkel), helle Abplatzungen */
  for (let i = 0; i < 5; i++) { const p = bq(-1.4 + rnd() * 1.1, -0.5 + rnd() * 2.2, 0.15 + rnd() * 1.2), w = 2 + rnd() * 4; k += `<ellipse cx="${p[0]}" cy="${p[1]}" rx="${r(w)}" ry="${r(w * 0.45)}" fill="${["#9a4a1c", "#5a5040", "#f2deb4"][i % 3]}" opacity="${[0.22, 0.18, 0.4][i % 3]}"/>`; }
  k += `<path d="M${bP(-1.3, -0.15, 1.36)} Q${bP(-1.0, 0.4, 1.5)} ${bP(-0.55, 1.35, 1.5)}" stroke="#f6e3b8" stroke-width="1.2" fill="none" opacity=".7"/>`;
  k += `<path d="M${bP(-1.4, -0.5, 0.75)} Q${bP(-1, 0.2, 0.95)} ${bP(-0.6, 0.9, 0.8)} L${bP(-0.6, 0.9, 0.7)} Q${bP(-1, 0.2, 0.84)} ${bP(-1.4, -0.5, 0.66)} Z" fill="#b0521f" opacity=".22"/>`;
  for (const [u, l, w, sk] of [[-1.3, -0.3, 0.5, 1.1], [-1.05, 0.5, 0.95, 0.9], [-0.8, 1.3, 0.35, 1.2], [-1.25, 0.2, 1.15, 0.7]]) { const m = bq(u, l, w); k += taf(m[0], m[1], sk); }
  k += `<path d="M${bP(-1.47, -0.55, 0.9)} L${bP(-1.42, -0.66, 0.35)} L${bP(-1.3, -0.7, 0)} L${bP(-1.0, -0.7, 0)} L${bP(-1.1, -0.6, 0.9)} Z" fill="#6b4a2a" opacity=".22"/>`;
  k += `</g>`;
  /* Gras oben auf dem Fels */
  let gr = "";
  for (let i = 0; i < 20; i++) { const t = i / 19, p = bq(-1.38 + t * 1.15, -0.4 + t * 2.35, 1.42 + Math.sin(t * 9) * 0.05); gr += `M${p[0]} ${p[1]} l${r(-0.5 + rnd())} ${r(-1.2 - rnd() * 1.6)}`; }
  k += `<path d="${gr}" stroke="#6f9a40" stroke-width=".5"/>`;
  /* Rückwand der Nische (schaut nach rechts, Morgenlicht von rechts) */
  k += `<path d="M${bP(-0.3, 0, 0.45)} L${bP(-0.3, 0, 1.15)} L${bP(-0.3, 1.7, 1.15)} L${bP(-0.3, 1.7, 0.45)} Z" fill="${S.lg("nische", [[0, "#ddb67a"], [1, "#c99a5c"]], 0, 0, 1, 0)}"/>`;
  /* Meißelspuren auf der Rückwand: kurze schräge Hiebe in Gruppen */
  const MEI = `url(#${S.id("meissel")})`;
  k += `<path d="M${bP(-0.3, 0.05, 0.5)} L${bP(-0.3, 0.05, 0.84)} L${bP(-0.3, 1.65, 0.84)} L${bP(-0.3, 1.65, 0.5)} Z" fill="${MEI}" opacity=".6"/>`;
  /* Inschrift in der Felswand über dem Sitz (in die Wand eingemeißelt, schräg gesehen) */
  const ip = bq(-0.3, 0.12, 1.0);
  k += `<text transform="matrix(${r(bL[0] / BS)} ${r(bL[1] / BS)} 0 1 ${ip[0]} ${ip[1]})" font-size="3.6" fill="#7a4f26" font-family="Georgia,serif" letter-spacing=".25" opacity=".85">MRS MACQUARIES</text>`;
  const ip2 = bq(-0.3, 0.42, 0.88);
  k += `<text transform="matrix(${r(bL[0] / BS)} ${r(bL[1] / BS)} 0 1 ${ip2[0]} ${ip2[1]})" font-size="3.6" fill="#7a4f26" font-family="Georgia,serif" letter-spacing=".25" opacity=".85">CHAIR</text>`;
  /* hintere Wange (rechts der Sitzenden = vorne/ links im Bild ist die vordere) */
  k += `<path d="M${bP(-0.3, 1.7, 0.45)} L${bP(-0.3, 1.7, 0.8)} Q${bP(0.1, 1.72, 0.86)} ${bP(0.52, 1.7, 0.7)} L${bP(0.55, 1.7, 0.45)} Z" fill="#b98a50"/>`;
  /* Sitzfläche (von leicht oben) und Vorderkante */
  k += `<path d="M${bP(-0.3, 0, 0.45)} L${bP(0.5, 0, 0.45)} L${bP(0.5, 1.7, 0.45)} L${bP(-0.3, 1.7, 0.45)} Z" fill="#ecd3a2"/>`;
  k += `<path d="M${bP(0.5, 0, 0.45)} L${bP(0.5, 1.7, 0.45)} L${bP(0.56, 1.75, 0)} L${bP(0.56, -0.05, 0)} Z" fill="${S.lg("sitzfront", [[0, "#e2be82"], [1, "#c1925a"]])}"/>`;
  k += `<path d="M${bP(0.5, 0, 0.45)} Q${bP(0.52, 0.8, 0.43)} ${bP(0.5, 1.7, 0.45)}" stroke="#f6e3bb" stroke-width=".7" fill="none"/>`;
  k += `<path d="M${bP(0.53, 0.05, 0.05)} L${bP(0.53, 0.05, 0.4)} L${bP(0.53, 1.65, 0.4)} L${bP(0.53, 1.65, 0.05)} Z" fill="${MEI}" opacity=".55"/>`;
  /* vordere Wange (links der Sitzenden, dem Betrachter zugewandt): niedriger, kantig behauen */
  k += `<path d="M${bP(-0.3, -0.3, 0)} L${bP(-0.32, -0.3, 0.82)} Q${bP(0.05, -0.32, 0.9)} ${bP(0.55, -0.3, 0.72)} L${bP(0.6, -0.3, 0)} Z" fill="${S.lg("wange", [[0, "#d9b277"], [1, "#b78955"]])}"/>`;
  k += `<path d="M${bP(-0.32, -0.3, 0.82)} Q${bP(0.05, -0.32, 0.9)} ${bP(0.55, -0.3, 0.72)} L${bP(0.55, 0, 0.72)} Q${bP(0.05, 0, 0.9)} ${bP(-0.3, 0, 0.82)} Z" fill="#efd7a8"/>`;
  k += `<path d="M${bP(-0.25, -0.3, 0.06)} L${bP(-0.26, -0.3, 0.74)} L${bP(0.5, -0.3, 0.64)} L${bP(0.52, -0.3, 0.06)} Z" fill="${MEI}" opacity=".55"/>`;
  /* eingehauene Stufen seitlich (vorn rechts am Block), grob und abgetreten */
  for (let i = 0; i < 3; i++) {
    const u0 = 0.62 + i * 0.22, w = 0.42 - i * 0.14;
    k += `<path d="M${bP(u0, 1.9, 0)} L${bP(u0 + 0.01, 1.9, w - 0.03)} Q${bP(u0, 2.15, w + 0.02)} ${bP(u0 - 0.01, 2.45, w - 0.02)} L${bP(u0, 2.47, 0)} Z" fill="${i % 2 ? "#c99b62" : "#d4a96c"}"/>`;
    k += `<path d="M${bP(u0 + 0.01, 1.9, w - 0.03)} Q${bP(u0, 2.15, w + 0.02)} ${bP(u0 - 0.01, 2.45, w - 0.02)} L${bP(u0 - 0.2, 2.44, w - 0.01)} Q${bP(u0 - 0.2, 2.15, w + 0.03)} ${bP(u0 - 0.19, 1.9, w - 0.02)} Z" fill="#ead2a2"/>`;
    k += `<path d="M${bP(u0, 2.0, w * 0.4)} l.6 1.2 M${bP(u0, 2.3, w * 0.6)} l-.4 1" stroke="#9a6d3c" stroke-width=".3" opacity=".6"/>`;
  }
  /* Wortmarke auf der rechten Wange bei den Stufen (nicht über der Touristin) */
  const AB = { x: 138, y: 206 };
  S.teil({ id: "steinbank", de: "die Steinbank", syl: "STEIN-bank", it: "la panchina di pietra", itSyl: "pan-CHI-na di PIE-tra", en: "stone bench", x: AB.x, y: AB.y, steht: true, kunst: `<g transform="translate(${BANK.x - AB.x} ${BANK.y - AB.y})">${k}</g>`,
    tipp: "Mrs Macquarie's Chair: 1810 haben Sträflinge diese Bank in den Fels gehauen. Elizabeth Macquarie hielt von hier Ausschau nach Schiffen aus England." });
}
{
  /* Touristin (von Hand gezeichnet, Dreiviertel-Rückenansicht): sitzt seitlich auf der Bank (Beine nach
     rechts), dreht den Oberkörper zum Hafen und fotografiert die Oper – das Handy quer mit beiden Händen
     vor sich; wir sehen ihren Rücken und das Display. Leichter Rundrücken, ein Fuß ruht auf der Stufe.
     Sommerkleid, Strohhut, Sonnenbrille (Bügel), Sandalen. Licht von hinten rechts (vom Betrachter aus):
     Rücken und rechte Seite hell, linke Flanke im Schatten. Ursprung = Sitzpunkt auf der Bank. */
  const HAUT = "#c98f6a", HAUTS = "#a5704f", KLEID = S.lg("kleid", [[0, "#3aa3b4"], [0.6, "#2b8698"], [1, "#1f6a7a"]], 1, 0, 0, 1);
  let k = `<ellipse cx="-4" cy="-.4" rx="9" ry="1.6" fill="#3a2410" opacity=".3" filter="url(#bw_weich)"/>`;
  /* Handy (quer) mit Display: die Oper im Kleinformat; linke Hand am linken Rand */
  k += `<g transform="rotate(-4 9.4 -37.6)"><rect x="5.8" y="-39.5" width="7.2" height="3.8" rx=".5" fill="#1d1f24"/><rect x="6.2" y="-39.15" width="6.4" height="3.1" fill="${S.lg("display", [[0, "#5d9fd6"], [1, "#cfe3f1"]])}"/>`;
  k += `<path d="M7.4 -36.4l1.1 -1.9.5 1.9zM8.6 -36.4l1.3 -2.2.7 2.2zM10.2 -36.4l.9 -1.4.5 1.4z" fill="#fff"/><rect x="6.2" y="-36.5" width="6.4" height=".45" fill="#2d5f86"/></g>`;
  k += `<path d="M5 -38.6q.9 -.5 1.4 .3l.2 2.2q-.4 .8 -1.3 .5q-.8 -1.2 -.3 -3z" fill="${HAUTS}"/>`;
  /* ferner (linker) Unterschenkel, Fuß auf der Stufe */
  /* die Stufe vor dem Sitz (grob behauener Block) und darauf der ferne (linke) Fuß */
  k += `<path d="M21.6 10.6L33.4 9.8L34 20.2L21.4 20.4Z" fill="#c99a5e"/><path d="M21.6 10.6L33.4 9.8L32.6 8.6L22.4 9.2Z" fill="#ecd3a2"/><path d="M21.4 19.6L34 19.4" stroke="#7a5530" stroke-width=".8" opacity=".5"/>`;
  k += `<path d="M16.6 -4.4C17.4 1 21.4 4.4 23.6 8.6L25.8 8.2C24.4 3.6 21.6 -.8 20.4 -3.6Z" fill="${HAUTS}"/>`;
  k += `<path d="M23.4 8L25.9 7.8Q29.4 8.4 30.2 9.4L23.4 9.6Z" fill="${HAUTS}"/><path d="M23.2 9.7h7.4M24 8.4l2.4 .4M27 8.1l.8 1.3" stroke="#5a3a22" stroke-width=".7"/>`;
  /* Rock über den Oberschenkeln, fällt am Knie über */
  k += `<path d="M-6.6 -7C-8 -1 -6 1 -2 1.2L13.6 1.8Q17.4 3.8 19.8 1.8Q21.4 -1 19.6 -4Q18 -6.6 13 -6.8Q6 -7.2 3 -9L-5 -10Z" fill="${KLEID}"/>`;
  k += `<path d="M2 -1Q9 -.4 15.6 1.4M6 -6.4Q11 -5 17.6 -3.6M-5.6 -2Q-3 .2 0 .6" stroke="#185663" stroke-width=".45" fill="none" opacity=".55"/>`;
  /* naher (rechter) Unterschenkel und Fuß auf dem Boden */
  k += `<path d="M17.4 1C15.6 7 16.8 12 17.8 17.6L20.2 17.8C20.4 12 21.6 6 20.8 .6Z" fill="${HAUT}"/><path d="M20.6 2C21.2 7 20.4 12 20.2 17.4" stroke="#e6b08a" stroke-width=".5" fill="none" opacity=".7"/>`;
  k += `<path d="M17.6 17.3L20.6 17.5Q25 18.6 25.6 19.7L17.4 19.8Z" fill="${HAUT}"/><path d="M17.2 19.9h8.6M18 18.2l2.9 .3M21 17.8l1.1 1.6" stroke="#5a3a22" stroke-width=".7"/>`;
  /* Oberkörper: Rundrücken, leicht nach vorn (in die Tiefe) geneigt */
  k += `<path d="M-6.6 -7C-8.4 -12 -7.8 -18 -5.6 -22.6Q-4.6 -24.7 -2 -25.2L2.6 -25.6Q6.4 -25.4 8 -23.4C8.6 -19 7.6 -14 6 -10.5Q4.5 -8.4 3 -9L-5 -10Z" fill="${KLEID}"/>`;
  k += `<path d="M-6.6 -7C-8.4 -12 -7.8 -18 -5.6 -22.6Q-4.6 -24.7 -3.2 -25C-5.4 -19 -5.6 -12 -4 -7.8Z" fill="#103f4a" opacity=".38"/>`;
  k += `<path d="M.9 -24.4C.2 -19 .7 -13 .3 -9.8" stroke="#164f5c" stroke-width=".45" fill="none" opacity=".5"/><ellipse cx="3.8" cy="-20.4" rx="3.4" ry="2.4" fill="#ffd9a0" opacity=".22"/>`;
  k += `<path d="M-6.8 -8.4Q0 -10.6 6 -9.8" stroke="#14525e" stroke-width=".9" fill="none"/>`;
  /* Rückenausschnitt, Nacken, Kopf von hinten (leicht nach rechts gedreht: Ohr und Wange sichtbar) */
  k += `<path d="M-2.4 -25.1Q.6 -21.2 3.8 -25.5Z" fill="${HAUT}"/><path d="M-.6 -25.4L-.4 -28.8L2.8 -29L3.2 -25.6Z" fill="${HAUTS}"/>`;
  k += `<ellipse cx="1.6" cy="-32.2" rx="3.4" ry="4" fill="#7a4e2a"/><path d="M4.2 -33.2Q5.7 -31 4.4 -28.9Q3.5 -29.6 3.9 -31Z" fill="${HAUT}"/><ellipse cx="4.9" cy="-31.5" rx=".7" ry="1.1" fill="${HAUTS}"/>`;
  k += `<path d="M-1 -34.4Q-.6 -31 .6 -29.6M1.6 -35.2Q2 -32 2.4 -29.8M3.6 -34.6Q4 -32.4 3.4 -30.2" stroke="#a0703f" stroke-width=".35" fill="none"/>`;
  k += `<ellipse cx="1.1" cy="-28.9" rx="2.1" ry="1.5" fill="#6a4122"/><path d="M-.4 -29.2q1.4 -.9 3 0" stroke="#9a6a3a" stroke-width=".35" fill="none"/><path d="M4.9 -32.4l1.6 -.3" stroke="#1a1a1a" stroke-width=".4"/>`;
  /* Strohhut: Krempe von leicht oben, Hutband */
  k += `<ellipse cx="1.8" cy="-34.4" rx="7.6" ry="2.3" fill="${S.lg("stroh", [[0, "#f3e7c8"], [1, "#cdb98f"]])}" transform="rotate(-6 1.8 -34.4)"/>`;
  k += `<path d="M-3.8 -34Q1.8 -32.4 7.4 -35.2" stroke="#bda67a" stroke-width=".3" fill="none"/>`;
  k += `<path d="M-1.6 -34.6Q-1.8 -39.4 2.2 -39.6Q5.8 -39.4 5.8 -34.8Q2 -33.6 -1.6 -34.6Z" fill="${S.lg("hutkrone", [[0, "#d9c79d"], [1, "#f5ead0"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-1.6 -35.6Q2 -34.4 5.8 -35.8L5.8 -34.8Q2 -33.6 -1.6 -34.6Z" fill="#2a3c4a"/>`;
  /* naher (rechter) Arm: Ärmel, Oberarm nach außen, Ellbogen, Unterarm hoch zum Handy; rechte Hand am Handy */
  k += `<path d="M6.6 -21Q9.8 -19.2 12.6 -19.6Q14.4 -20.6 13.7 -22.8L12.7 -33.6L10.4 -34Q10.8 -27 11 -24.4Q9.4 -23.6 8.4 -24.4Z" fill="${HAUT}"/>`;
  k += `<path d="M10.5 -33.6Q10.9 -27 11.1 -24.4Q10 -23.4 8.6 -23.8" stroke="${HAUTS}" stroke-width=".9" fill="none" opacity=".7"/><path d="M13.6 -23L12.8 -33" stroke="#e8b48c" stroke-width=".5" opacity=".8"/>`;
  k += `<path d="M5.8 -25.2Q9.6 -25 9.9 -21L6.4 -19.6Q5.6 -22 5.8 -25.2Z" fill="${KLEID}"/>`;
  k += `<path d="M10.2 -33.8q-.2 -2.4 1.4 -3.4q1.6 .2 1.6 1.6l-.4 2z" fill="${HAUT}"/><path d="M10.8 -36.2l1.6 -.2" stroke="${HAUTS}" stroke-width=".35"/>`;
  const sitz = bq(0.08, 0.62, 0.45);
  const svg = k;
  S.teil({ id: "touristin", de: "die Touristin", syl: "tou-RIS-tin", it: "la turista", itSyl: "tu-RI-sta", en: "tourist", x: BANK.x + Number(sitz[0]), y: BANK.y + Number(sitz[1]), kunst: svg,
    tipp: "Slip, Slop, Slap, Seek, Slide: In Australien schützt man sich mit Hemd, Sonnencreme, Hut, Schatten und Sonnenbrille." });
}
{
  /* Gelbhaubenkakadu auf dem Fels über der Bank: Haube aus gelben, nach vorn gebogenen Federn,
     kräftiger dunkler Hakenschnabel, nackter weißlicher Augenring, breiter Schwanz mit gelber Unterseite */
  const s = BS / 44 * 1.05;
  const g = (n) => r(n * s);
  let k = schlag(g(6), 0.4, BS * 0.3, 0.25);
  /* Füße (grau, Zehen um die Felskante) */
  k += `<path d="M${g(-1.2)} ${g(-0.4)} q${g(-0.6)} ${g(0.5)} ${g(-1.4)} ${g(0.4)} M${g(-1.2)} ${g(-0.4)} q${g(0.4)} ${g(0.5)} ${g(1.2)} ${g(0.4)} M${g(1)} ${g(-0.4)} q${g(0.6)} ${g(0.5)} ${g(1.4)} ${g(0.3)}" stroke="#6f7176" stroke-width="${g(0.5)}" fill="none" stroke-linecap="round"/>`;
  /* Schwanz: breit, weiß, Unterseite zitronengelb */
  k += `<path d="M${g(-3)} ${g(-2.8)} L${g(-7.4)} ${g(2.2)} Q${g(-5.4)} ${g(3)} ${g(-3.6)} ${g(2.4)} L${g(-0.8)} ${g(-1.6)} Z" fill="#f4f2ea"/>`;
  k += `<path d="M${g(-6.6)} ${g(1.8)} Q${g(-5)} ${g(2.4)} ${g(-3.8)} ${g(2)} L${g(-1.6)} ${g(-1)} Z" fill="#f0dc6a" opacity=".85"/>`;
  /* Körper mit Flügel */
  k += `<path d="M${g(-3.4)} ${g(-2.2)} Q${g(-3.8)} ${g(-8)} ${g(0.6)} ${g(-9.6)} Q${g(3.8)} ${g(-9.2)} ${g(3.2)} ${g(-5)} Q${g(2.6)} ${g(-1)} ${g(-0.4)} ${g(-0.6)} Q${g(-2.6)} ${g(-0.8)} ${g(-3.4)} ${g(-2.2)} Z" fill="${S.rg("kakadu", [[0, "#fffaf0"], [0.7, "#f6efe2"], [1, "#cfcdd6"]], 0.65, 0.3, 0.8)}"/>`;
  k += `<path d="M${g(-3)} ${g(-7)} Q${g(-1.8)} ${g(-3.6)} ${g(-3.4)} ${g(-1.4)} M${g(-2.2)} ${g(-6)} q${g(0.6)} ${g(1.6)} ${g(-0.4)} ${g(3.2)}" stroke="#d0cdc3" stroke-width="${g(0.3)}" fill="none"/>`;
  /* Kopf */
  k += `<circle cx="${g(1.8)}" cy="${g(-10.2)}" r="${g(2.2)}" fill="#fbfaf5"/>`;
  /* Haube: 6 gelbe Federn, aufgestellt, nach vorn gebogen */
  let haube = "";
  for (let i = 0; i < 6; i++) {
    const bx = 0.2 + i * 0.42, by = -11.7 - i * 0.12, l = 3.2 + (i < 3 ? i * 0.7 : (5 - i) * 0.55), a = -112 + i * 13;
    const ex = bx + Math.cos(a * Math.PI / 180) * l, ey = by + Math.sin(a * Math.PI / 180) * l;
    haube += `<path d="M${g(bx - 0.3)} ${g(by)} Q${g(bx - 0.5 + (ex - bx) * 0.3)} ${g(by + (ey - by) * 0.75)} ${g(ex + 1.6)} ${g(ey + 0.9)} Q${g(bx + 0.4 + (ex - bx) * 0.45)} ${g(by + (ey - by) * 0.5)} ${g(bx + 0.3)} ${g(by)} Z" fill="${i % 2 ? "#f6cf2e" : "#f0bb1c"}"/>`;
  }
  k += haube;
  /* Augenring (nackt, bläulich-weiß), Auge */
  k += `<circle cx="${g(2.4)}" cy="${g(-10.5)}" r="${g(0.7)}" fill="#e3eef4"/><circle cx="${g(2.45)}" cy="${g(-10.5)}" r="${g(0.38)}" fill="#141414"/><circle cx="${g(2.55)}" cy="${g(-10.62)}" r="${g(0.12)}" fill="#fff"/>`;
  /* Hakenschnabel: kräftig, schwarzgrau */
  k += `<path d="M${g(3.3)} ${g(-11.2)} Q${g(5.4)} ${g(-11.4)} ${g(5.2)} ${g(-9.2)} Q${g(4.9)} ${g(-8.3)} ${g(4.4)} ${g(-8.6)} Q${g(4.6)} ${g(-9.6)} ${g(3.6)} ${g(-9.6)} Z" fill="#2a2b30"/>`;
  k += `<path d="M${g(3.5)} ${g(-9.5)} Q${g(4.3)} ${g(-9.2)} ${g(4.3)} ${g(-8.5)} Q${g(3.8)} ${g(-8.4)} ${g(3.4)} ${g(-8.8)} Z" fill="#3a3b40"/>`;
  k += `<path d="M${g(3.6)} ${g(-11)} q${g(1)} ${g(-0.1)} ${g(1.3)} ${g(0.6)}" stroke="#5a5c62" stroke-width="${g(0.2)}" fill="none"/>`;
  const top = bq(-0.8, 0.5, 1.5);
  S.teil({ oben: true, id: "kakadu", de: "der Kakadu", syl: "KA-ka-du", it: "il cacatua", itSyl: "ca-ca-TU-a", en: "cockatoo", x: BANK.x + Number(top[0]), y: BANK.y + Number(top[1]) + 0.6, kunst: k,
    tipp: "Der Gelbhaubenkakadu lebt mitten in Sydney. Er kreischt laut und stellt seine gelbe Haube auf." });
}
{
  /* Silberkopfmöwe auf dem Fels: weiß, Flügel silbergrau mit schwarzen Spitzen, roter Schnabel, rote Beine */
  const X = 168, Y = 222, s = vorn(Y) / 50;
  const g = (n) => r(n * s);
  let k = schlag(g(8), 0.35, vorn(Y), 0.28);
  k += `<path d="M${g(-0.8)} 0 L${g(-0.4)} ${g(-4)} M${g(1.2)} 0 L${g(1)} ${g(-4)}" stroke="#c8362c" stroke-width="${g(0.55)}" stroke-linecap="round"/>`;
  k += `<path d="M${g(-7.6)} ${g(-6.6)} L${g(-4)} ${g(-7.4)} L${g(-4.4)} ${g(-5.8)} Z" fill="#1d1d20"/>`;
  k += `<path d="M${g(-6.4)} ${g(-6.8)} Q${g(-2)} ${g(-11)} ${g(3)} ${g(-9.6)} Q${g(5)} ${g(-8.6)} ${g(4.4)} ${g(-6)} Q${g(3)} ${g(-3.6)} ${g(-1)} ${g(-4)} Q${g(-4)} ${g(-4.6)} ${g(-6.4)} ${g(-6.8)} Z" fill="${S.rg("moewe", [[0, "#ffffff"], [1, "#e4e6e8"]], 0.6, 0.4, 0.7)}"/>`;
  k += `<path d="M${g(-6.6)} ${g(-6.9)} Q${g(-2)} ${g(-9.4)} ${g(2.4)} ${g(-8)} Q${g(-1)} ${g(-6)} ${g(-6.6)} ${g(-6.9)} Z" fill="#a9b0b8"/>`;
  k += `<path d="M${g(-6.8)} ${g(-6.9)} L${g(-5)} ${g(-7.4)} L${g(-5.2)} ${g(-6.6)} Z" fill="#1d1d20"/><circle cx="${g(-5.6)}" cy="${g(-7)}" r="${g(0.25)}" fill="#fff"/>`;
  k += `<circle cx="${g(3.6)}" cy="${g(-10.4)}" r="${g(1.7)}" fill="#ffffff"/><circle cx="${g(4.2)}" cy="${g(-10.8)}" r="${g(0.28)}" fill="#f2f2f2" stroke="#c8362c" stroke-width="${g(0.15)}"/><circle cx="${g(4.2)}" cy="${g(-10.8)}" r="${g(0.13)}" fill="#111"/>`;
  k += `<path d="M${g(5)} ${g(-10.6)} L${g(7.4)} ${g(-10.2)} L${g(5)} ${g(-9.6)} Z" fill="#d23a2c"/>`;
  S.teil({ id: "moewe", de: "die Möwe", syl: "MÖ-we", it: "il gabbiano", itSyl: "gab-BIA-no", en: "seagull", x: X, y: Y, steht: true, kunst: k,
    tipp: "Die Silberkopfmöwe in Sydney hat einen roten Schnabel und rote Beine." });
}

/* =====================================================================
   10 — DIE PICKNICKDECKE auf dem Rasen mit Fish and Chips, Kühlbox,
        Flip-Flops, Bumerang, Sonnencreme; 11 — DER IBIS
   ===================================================================== */
const DECKE = { x: 322, y: 244 };
/* Picknick in echter Zentralperspektive: alle Dinge sind gleich gedreht, ihre Kanten laufen auf den
   Fluchtpunkt (322 | 146) auf dem Horizont. PK(seitlich m, Abstand m, Höhe m) → Bildpunkt */
const PK = (X, D, h = 0) => [322 + 680 * X / D, 146 + 680 * (1.6 - h) / D];
const ANKER_DECKE = { x: 314, y: 251.4 };   // Wortmarke an der Vorderkante der Decke
const DINGE = { fish: [340, 245], creme: [326, 239.4], bumerang: [362, 248.6], flip: [287, 247.4] };
const anDecke = (p, svg) => `<g transform="translate(${r(p[0] - ANKER_DECKE.x)} ${r(p[1] - ANKER_DECKE.y)})">${svg}</g>`;
const deckeUnter = [];
let deckeKunst = "";
{
  /* Decke 1,6 × 1,8 m, Mitte 11,2 m entfernt */
  const D0 = 10.3, D1 = 12.1, Wd = 0.8;
  const ecke = [PK(-Wd, D1), PK(Wd, D1), PK(Wd, D0), PK(-Wd, D0)].map(([x, y]) => [x - DECKE.x, y - DECKE.y]);
  const Q = (u, v) => { const [x, y] = PK(-Wd + 2 * Wd * u, D1 + (D0 - D1) * v); return [x - DECKE.x, y - DECKE.y]; };
  let k = `<path d="M${P([ecke[3][0] - 5, ecke[3][1] - 0.6])} L${P([ecke[0][0] - 6, ecke[0][1] - 1])} L${P(ecke[0])} L${P(ecke[3])} Z" fill="#2a3a14" opacity=".2" filter="url(#bw_weich)"/>`;
  const d = `M${ecke.map(P).join(" L")} Z`;
  S.def(`<path id="${S.id("deckep")}" d="${d}"/><clipPath id="${S.id("decke")}"><use href="#${S.id("deckep")}"/></clipPath>`);
  k += `<use href="#${S.id("deckep")}" fill="#b8302c"/>`;
  k += `<g clip-path="url(#${S.id("decke")})">`;
  /* Schottenmuster: Längsstreifen laufen zum Fluchtpunkt, Querstreifen werden nach hinten enger */
  let nv = "", cv = "", nh = "", ch = "";
  for (let i = 1; i < 12; i++) { const t = `M${P(Q(i / 12, 0))}L${P(Q(i / 12, 1))}`; if (i % 3) nv += t; else cv += t; }
  for (let j = 1; j < 9; j++) { const t = `M${P(Q(0, j / 9))}L${P(Q(1, j / 9))}`; if (j % 2) nh += t; else ch += t; }
  k += `<path d="${nv}" stroke="#1f2f5a" stroke-width="2.2" opacity=".55"/><path d="${nh}" stroke="#1f2f5a" stroke-width="1.6" opacity=".5"/><path d="${cv}${ch}" stroke="#e9d9a8" stroke-width=".55" opacity=".78"/>`;
  /* Falten; Morgenlicht von rechts hinten: warmer Schimmer auf der rechten Hälfte */
  k += `<path d="M${P(Q(0.2, 0.25))} q6 2 14 .6 M${P(Q(0.55, 0.8))} q8 -1.6 16 0" stroke="#7a1d1b" stroke-width=".6" fill="none" opacity=".4"/>`;
  k += `<path d="M${P(Q(0.5, 0))} L${P(Q(1, 0))} L${P(Q(1, 1))} L${P(Q(0.5, 1))} Z" fill="#ffd9a0" opacity=".14"/>`;
  k += `</g><use href="#${S.id("deckep")}" fill="none" stroke="#7a1d1b" stroke-width=".4"/>`;
  let fr = "";
  for (let i = 0; i <= 40; i++) { const q = Q(i / 40, 1); fr += `M${P(q)}l.2 1.6`; }
  k += `<path d="${fr}" stroke="#9a2a26" stroke-width=".4"/>`;
  deckeKunst += anDecke([DECKE.x, DECKE.y], k);
}
{
  /* Fish and Chips im offenen, zerknitterten weißen Papier (zwei Knicklinien): ein langes, flaches
     Fischfilet im Backteig (≈ 2,5 × so lang wie breit, ein Ende schmaler), goldgelb mit knusprigem,
     unregelmäßigem Rand und dunkleren Blasen; dicke hellgelbe Pommes als Haufen; Zitronenspalte */
  const [X, Y] = DINGE.fish, s = vorn(Y) / 60;
  const g = (n) => r(n * s);
  let k = `<path d="M${g(-15)} 0 L${g(-11)} ${g(-6.4)} L${g(-17)} ${g(-7.4)} L${g(-21)} ${g(-1)} Z" fill="#1a1a1a" opacity=".16" filter="url(#bw_weich)"/>`;
  k += `<path d="M${g(-15)} 0 L${g(-12)} ${g(-4)} L${g(-11)} ${g(-6.4)} L${g(1)} ${g(-6.9)} L${g(12)} ${g(-7)} L${g(14)} ${g(-3.6)} L${g(16)} ${g(-0.6)} L${g(3)} ${g(1.6)} Z" fill="#fbfbf6" stroke="#d9d9d0" stroke-width=".3"/>`;
  k += `<path d="M${g(-15)} 0 L${g(-9)} ${g(-1.6)} L${g(3)} ${g(1.6)} Z" fill="#ecece4"/><path d="M${g(1)} ${g(-6.9)} L${g(-1)} ${g(1)} M${g(14)} ${g(-3.6)} L${g(-12)} ${g(-4)}" stroke="#dcdcd2" stroke-width=".35" fill="none"/>`;
  /* Pommes: dicke Stäbe, gestapelt (hinten tiefer, vorn obenauf) */
  let pom = "";
  for (const [x, y, a] of [[-8.4, -4.2, -20], [-7.2, -3.6, 15], [-9.6, -3, 5], [-6.4, -2.6, -35], [-8.8, -2.2, 28], [-7.4, -1.6, -8], [-5.6, -3.4, 50], [-9.2, -4.8, 60], [-6.6, -4.6, -60], [-7.8, -2.8, 80]]) pom += `<rect x="${g(x - 2)}" y="${g(y - 0.55)}" width="${g(4)}" height="${g(1.1)}" rx="${g(0.25)}" transform="rotate(${a} ${g(x)} ${g(y)})"/>`;
  k += `<g fill="#f6dc7a" stroke="#d9ae3e" stroke-width=".22">${pom}</g>`;
  /* Fischfilet: 10 lang, 4 breit, rechts schmaler, knuspriger Zackenrand */
  let fil = "", n = 18;
  for (let i = 0; i <= n; i++) { const a = i / n * Math.PI * 2, c = Math.cos(a), sn = Math.sin(a), bw = 2 * (c > 0 ? 1 - c * 0.35 : 1), rr = 1 + (i % 2 ? 0.08 : -0.05); const x = 5 + c * 6.6 * rr, y = -3.6 + sn * bw * rr * 0.85 - c * 0.6; fil += `${i ? "L" : "M"}${g(x)} ${g(y)}`; }
  k += `<path d="${fil}Z" fill="${S.lg("teig", [[0, "#f6cf6e"], [0.55, "#e2a440"], [1, "#b8742a"]])}" stroke="#a8641e" stroke-width=".3"/>`;
  k += `<path d="M${g(2.4)} ${g(-4.6)}h.1M${g(4.4)} ${g(-3.4)}h.1M${g(6.6)} ${g(-4.2)}h.1M${g(8.4)} ${g(-3.2)}h.1M${g(3.6)} ${g(-2.6)}h.1" stroke="#b06a24" stroke-width=".8" stroke-linecap="round" opacity=".6"/><path d="M${g(2)} ${g(-4.9)}q${g(3.5)} ${g(-0.9)} ${g(7.5)} ${g(-0.2)}" stroke="#fff0b8" stroke-width=".45" fill="none" opacity=".85"/>`;
  k += `<path d="M${g(-12.4)} ${g(-1.8)} Q${g(-10.6)} ${g(-4.6)} ${g(-8.2)} ${g(-2.2)} Z" fill="#f6e04a" stroke="#e2c330" stroke-width=".3"/>`;
  deckeKunst += anDecke([X, Y], k);
  deckeUnter.push({ id: "fish_and_chips", de: "die Fish and Chips", syl: "fish-and-CHIPS", it: "il fish and chips", itSyl: "fish and CIPS", en: "fish and chips", x: X, y: Y, kunst: flaeche(g(-16), g(-7.5), g(32), g(9.5)),
    tipp: "„Fish and Chips“ ist Mehrzahl: Fisch im Backteig mit Pommes – am Hafen isst man sie direkt aus dem Papier." });
}
{
  /* Bumerang (flach auf der Decke): zwei Arme mit Knick ≈ 105°, Punktmalerei in Ocker, Weiß und Rot */
  const [X, Y] = DINGE.bumerang, s = vorn(Y) / 60;
  const fl = (x, y) => [r(x * s), r(y * s * 0.36)];
  const a1 = -8 * Math.PI / 180, a2 = a1 + (180 - 105) * Math.PI / 180;
  const L = 17, Wd = 2.6;
  const arm = (a, sg) => { const ex = Math.cos(a) * L, ey = Math.sin(a) * L, nx = -Math.sin(a) * Wd * sg, ny = Math.cos(a) * Wd * sg; return { ex, ey, nx, ny }; };
  const A = arm(Math.PI + a1, 1), Bm = arm(a2 + Math.PI, -1);
  const pts = [[A.ex + A.nx * 0.5, A.ey + A.ny * 0.5], [0 + A.nx, 0 + A.ny], [Bm.ex + Bm.nx * 0.5, Bm.ey + Bm.ny * 0.5], [Bm.ex - Bm.nx * 0.5, Bm.ey - Bm.ny * 0.5], [-A.nx * 0.6 - Bm.nx * 0.6, -A.ny * 0.6 - Bm.ny * 0.6], [A.ex - A.nx * 0.5, A.ey - A.ny * 0.5]];
  const p = pts.map(([x, y]) => fl(x, y));
  let k = `<path d="M${p[0][0]} ${p[0][1]} Q${p[1][0]} ${p[1][1]} ${p[2][0]} ${p[2][1]} Q${r((Number(p[2][0]) + Number(p[3][0])) / 2 + 0.6)} ${r((Number(p[2][1]) + Number(p[3][1])) / 2)} ${p[3][0]} ${p[3][1]} Q${p[4][0]} ${p[4][1]} ${p[5][0]} ${p[5][1]} Q${r((Number(p[5][0]) + Number(p[0][0])) / 2 - 0.6)} ${r((Number(p[5][1]) + Number(p[0][1])) / 2)} ${p[0][0]} ${p[0][1]} Z" fill="${S.lg("bumerang", [[0, "#a0612e"], [1, "#6e3b18"]])}"/>`;
  for (const [ar, n] of [[A, 9], [Bm, 9]]) for (let i = 1; i <= n; i++) { const t = i / (n + 1), q = fl(ar.ex * t, ar.ey * t); k += `<circle cx="${q[0]}" cy="${q[1]}" r="${r(0.42 * s)}" fill="${["#f4e3c0", "#e3a53a", "#c8442a"][i % 3]}"/>`; }
  k += `<path d="M${p[0][0]} ${p[0][1]} Q${p[1][0]} ${p[1][1]} ${p[2][0]} ${p[2][1]}" stroke="#c88a4a" stroke-width=".35" fill="none" opacity=".7"/>`;
  deckeKunst += anDecke([X, Y], k);
  deckeUnter.push({ id: "bumerang", de: "der Bumerang", syl: "BU-me-rang", it: "il boomerang", itSyl: "BU-me-rang", en: "boomerang", x: X, y: Y, kunst: flaeche(-12 * s, -5, 24 * s, 7),
    tipp: "Der Bumerang ist ein Wurfholz der Aborigines; manche fliegen zurück. Echte Bumerangs mit Punktmalerei kauft man am besten direkt bei Künstlern der Aborigines." });
}
{
  /* Sonnencreme (Tube, LSF 50+) auf der Decke rechts neben der Kühlbox */
  const [X, Y] = DINGE.creme, s = vorn(Y) / 60 * 1.4;
  const g = (n) => r(n * s);
  let k = `<path d="M${g(-6)} ${g(1)} L${g(4.6)} ${g(-0.6)} L${g(2)} ${g(-1.6)} L${g(-8)} ${g(-0.2)} Z" fill="#1a1a1a" opacity=".2" filter="url(#bw_weich)"/>`;
  k += `<path d="M${g(-6)} ${g(-1)} L${g(4)} ${g(-2.6)} L${g(4.6)} ${g(-0.2)} L${g(-5.6)} ${g(1.2)} Z" fill="#fbf6e6"/>`;
  k += `<path d="M${g(4)} ${g(-2.6)} L${g(6.4)} ${g(-2.8)} L${g(6.8)} ${g(-0.6)} L${g(4.6)} ${g(-0.2)} Z" fill="#f08a1e"/>`;
  k += `<path d="M${g(-4)} ${g(-1)} L${g(2)} ${g(-1.9)} L${g(2.3)} ${g(-0.5)} L${g(-3.7)} ${g(0.4)} Z" fill="#f6c51a"/>`;
  k += `<text x="${g(-1)}" y="${g(-0.1)}" font-size="${g(1.3)}" fill="#c0391b" font-family="Arial,sans-serif" font-weight="bold" transform="rotate(-9 ${g(-1)} ${g(-0.6)})">SPF 50+</text>`;
  deckeKunst += anDecke([X, Y], k);
  deckeUnter.push({ id: "sonnencreme", de: "die Sonnencreme", syl: "SON-nen-creme", it: "la crema solare", itSyl: "CRE-ma so-LA-re", en: "sunscreen", x: X, y: Y, kunst: flaeche(g(-7.4), g(-5.6), g(15.2), g(8.4)),
    tipp: "Auf der Tube steht SPF – auf Deutsch LSF (Lichtschutzfaktor). In Australien nimmt man LSF 50+." });
}
{
  /* Flip-Flops („Thongs“, ≈ 27 cm) liegen hingeworfen im Gras vor der Decke: flache Sohlen, schräg
     liegend (Tiefe gestaucht), Sohlenkante; der linke richtig herum mit Y-Riemen und Zehensteg,
     der rechte umgekippt (Profil der Unterseite, Riemenknöpfe) */
  const [X, Y] = DINGE.flip;
  const sohle = (ox, oy, rot, oben, nr = 1) => {
    const c = Math.cos(rot * Math.PI / 180), sn = Math.sin(rot * Math.PI / 180);
    const T = (u, v) => [r(ox + u * c - v * sn), r(oy + (u * sn + v * c) * 0.42)];
    const halb = (t) => t < 0.1 ? 2.3 * Math.sqrt(t / 0.1) : t < 0.45 ? 2.3 - (t - 0.1) * 0.6 : t < 0.75 ? 2.1 + (t - 0.45) * 3.3 : 3.1 * Math.sqrt(Math.max(0, 1 - Math.pow((t - 0.75) / 0.25, 2)));
    const N = 12, li = [], re = [];
    for (let i = 0; i <= N; i++) { const t = i / N, u = -8.5 + 17 * t; li.push(T(u, -halb(t))); re.push(T(u, halb(t))); }
    const id = S.id("sohle" + nr), um = `href="#${id}"`;
    S.def(`<path id="${id}" d="M${li.map((q) => q.join(" ")).join(" L")} L${re.reverse().map((q) => q.join(" ")).join(" L")} Z"/>`);
    let g = `<use ${um} fill="#1a1d10" opacity=".25" transform="translate(-1.2 .9)" filter="url(#bw_weich)"/>`;
    g += `<use ${um} fill="${oben ? "#d9a514" : "#1f3f78"}" transform="translate(0 .8)"/>`;
    g += `<use ${um} fill="${oben ? "#f6c51a" : "#2f5aa0"}"/>`;
    if (oben) {
      g += `<use ${um} fill="#2f6fb6" transform="translate(${r(ox * 0.12)} ${r(oy * 0.12)}) scale(.88)"/>`;
      const steg = T(5.2, 0), l = T(-0.6, -2.3), rr = T(-0.6, 2.3);
      g += `<path d="M${l.join(" ")} Q${r((l[0] + steg[0]) / 2)} ${r(steg[1] - 3.4)} ${steg.join(" ")} Q${r((rr[0] + steg[0]) / 2)} ${r(steg[1] - 2.8)} ${rr.join(" ")}" stroke="#1d3f86" stroke-width="1.1" fill="none" stroke-linecap="round"/><path d="M${l.join(" ")} Q${r((l[0] + steg[0]) / 2)} ${r(steg[1] - 3.6)} ${steg.join(" ")}" stroke="#6f9ee0" stroke-width=".35" fill="none"/>`;
      g += `<circle cx="${steg[0]}" cy="${steg[1]}" r=".55" fill="#1d3f86"/>`;
    } else {
      let pr = "";
      for (let u = -7; u < 7.5; u += 1.6) { const a = T(u, -1.8), b2 = T(u + 0.6, 1.8); pr += `M${a.join(" ")} L${b2.join(" ")}`; }
      g += `<path d="${pr}" stroke="#244a8a" stroke-width=".4"/>`;
      for (const [u, v] of [[5.2, 0], [-0.6, -1.9], [-0.6, 1.9]]) { const q = T(u, v); g += `<circle cx="${q[0]}" cy="${q[1]}" r=".4" fill="#1d2f55"/>`; }
    }
    return g;
  };
  /* ein Paar, leicht versetzt hingeworfen, auf der linken vorderen Deckenecke */
  const k = sohle(-5.4, 0.4, -18, true) + sohle(5.6, -0.8, 10, true, 2);
  deckeKunst += anDecke([X, Y], k);
  deckeUnter.push({ id: "flipflops", de: "die Flip-Flops", syl: "FLIP-flops", it: "le infradito", itSyl: "in-fra-DI-to", en: "flip-flops", x: X, y: Y, kunst: flaeche(-14, -4.5, 28, 9),
    tipp: "In Australien heißen Flip-Flops „Thongs“." });
}
S.teil({ id: "picknickdecke", de: "die Picknickdecke", syl: "PICK-nick-de-cke", it: "la coperta da picnic", itSyl: "co-PER-ta da PIC-nic", en: "picnic blanket", x: ANKER_DECKE.x, y: ANKER_DECKE.y, kunst: deckeKunst,
  tipp: "Ein Picknick am Hafen: Auf der Decke liegen Fish and Chips, Sonnencreme und ein Bumerang.",
  zoom: { x: 252, y: 165, w: 128, h: 80 }, unter: deckeUnter });
{
  /* Kühlbox („Esky“) in derselben Perspektive wie die Decke: Sie steht links vom Fluchtpunkt, darum
     sieht man ihre RECHTE Seite (schmal, etwas dunkler) und den Deckel, der nach hinten zum Fluchtpunkt
     ausweicht. Griff an der rechten Seite. Schlagschatten nach links hinten (Sonne rechts hinter uns). */
  const XL = -0.5, D = 11.75, W2 = 0.28, T = 0.32, H = 0.38;
  const [X, Y] = PK(XL, D);
  const Q = (dx, dd, h) => { const [x, y] = PK(XL + dx, D + dd, h); return [x - X, y - Y]; };
  const fl = Q(-W2, 0, 0), fr = Q(W2, 0, 0), flo = Q(-W2, 0, H), fro = Q(W2, 0, H), br = Q(W2, T, 0), bro = Q(W2, T, H), blo = Q(-W2, T, H);
  let k = `<path d="M${P(fl)} L${P(fr)} L${P([fr[0] - 22, fr[1] - 4])} L${P([fl[0] - 24, fl[1] - 4])} Z" fill="#1d2a10" opacity=".3" filter="url(#bw_weich)"/>`;
  k += `<path d="M${P(fl)} L${P(fr)}" stroke="#1a1a1a" stroke-width="1.4" opacity=".35"/>`;
  /* rechte Seite */
  k += `<path d="M${P(fr)} L${P(br)} L${P(bro)} L${P(fro)} Z" fill="${S.lg("eskyseite", [[0, "#2c64ad"], [1, "#22508f"]], 0, 0, 1, 0)}"/>`;
  /* Vorderseite mit Prägung, warmes Morgenlicht */
  k += `<path d="M${P(fl)} L${P(fr)} L${P(fro)} L${P(flo)} Z" fill="${S.lg("esky", [[0, "#5698dc"], [1, "#3474ba"]])}"/>`;
  const pr = [Q(-W2 + 0.03, 0, H - 0.07), Q(W2 - 0.03, 0, H - 0.07), Q(W2 - 0.03, 0, 0.05), Q(-W2 + 0.03, 0, 0.05)];
  k += `<path d="M${pr.map(P).join(" L")} Z" fill="none" stroke="#6aa8e6" stroke-width=".7" stroke-linejoin="round"/>`;
  /* Deckel: weiß, warm beschienen, mit Griffmulde; Deckelkante */
  k += `<path d="M${P(flo)} L${P(fro)} L${P(bro)} L${P(blo)} Z" fill="#fbf7ee"/><path d="M${P(flo)} L${P(fro)} L${P(bro)}" stroke="#e1dcd2" stroke-width="2" fill="none"/>`;
  const m1 = Q(-0.1, T * 0.5, H), m2 = Q(0.1, T * 0.5, H);
  k += `<path d="M${P(m1)} L${P(m2)}" stroke="#cdd2d6" stroke-width="1.8" stroke-linecap="round"/>`;
  /* Tragegriff an der rechten Seite */
  const g1 = Q(W2, T * 0.25, H * 0.72), g2 = Q(W2, T * 0.75, H * 0.72), gm = Q(W2 + 0.02, T * 0.5, H * 1.02);
  k += `<path d="M${P(g1)} Q${P(gm)} ${P(g2)}" stroke="#e8ebee" stroke-width="1.1" fill="none"/>`;
  S.teil({ oben: true, id: "kuehlbox", de: "die Kühlbox", syl: "KÜHL-box", it: "la borsa frigo", itSyl: "BOR-sa FRI-go", en: "cool box", x: r(X), y: r(Y), steht: true, kunst: k,
    tipp: "In Australien heißt die Kühlbox „Esky“. Ohne sie geht niemand zum Picknick." });
}
/* Joggerin und ihr Hund (an der Leine – im Royal Botanic Garden gilt Leinenpflicht) auf dem Uferweg */
const HUND = { x: 350, y: 203.6 };
const JOG = { x: 376, y: 201.6 };
{
  /* DER HUND: Kelpie (australischer Hütehund), läuft nach links. Gefüllte Flächen: tiefe Brust, hoch-
     gezogener Bauch, Stirnabsatz, längere Schnauze mit kleiner schwarzer Nasenkuppe, Stehohren mit hellem
     Inneren, Auge mit Lichtpunkt; Beine mit Knie- und Sprunggelenk (vorn greifend, hinten abdrückend);
     buschige, tief getragene Rute. Rotbraun mit hellem Brand an Brust, Schnauze und Beinen.
     Gezeichnet in 50 Einheiten je Meter. */
  const k0 = vorn(HUND.y) / 50, FELL = "#8a4a22", FELLD = "#5f3014", BRAND = "#d8a068";
  let d = `<path d="M-14 0l24 0 -22 -3.4z" fill="#2a2010" opacity=".22" filter="url(#bw_weich)"/>`;
  const bein = (pts, w0, w1, f) => { /* sich verjüngendes Bein durch Gelenkpunkte */
    let li = "", re = "";
    pts.forEach(([x, y], i) => { const t = i / (pts.length - 1), w = w0 + (w1 - w0) * t, n = i < pts.length - 1 ? [pts[i + 1][1] - y, x - pts[i + 1][0]] : [y - pts[i - 1][1], pts[i - 1][0] - x], L = Math.hypot(n[0], n[1]) || 1; li += `${i ? "L" : "M"}${r(x + n[0] / L * w / 2)} ${r(y + n[1] / L * w / 2)}`; re = `L${r(x - n[0] / L * w / 2)} ${r(y - n[1] / L * w / 2)}` + re; });
    return `<path d="${li}${re}Z" fill="${f}" stroke-linejoin="round"/>`;
  };
  /* ferne Beine (dunkler) */
  d += bein([[-7, -17], [-12, -11], [-18, -5], [-21, -3.4]], 4, 1.8, FELLD) + bein([[16, -16], [21, -9], [26, -5], [30, -3]], 4.6, 1.8, FELLD);
  /* Rute */
  d += `<path d="M20.6 -21.4Q28 -19 30.6 -12.6Q29.6 -10.6 27.4 -12.6Q25.2 -16.6 19.8 -18.2Z" fill="${FELL}"/><path d="M29.4 -12.4q.4 1 1.2 .6" stroke="${BRAND}" stroke-width=".8" fill="none"/>`;
  /* Körper */
  d += `<path d="M-4 -28C0 -25 6 -24.2 14 -23.6Q19 -23.2 21.6 -21.4Q23 -17 19 -14L14 -15Q8 -14.6 2 -13.2Q-5 -10.6 -8.2 -14Q-10 -18 -9 -23Q-8 -26 -6 -28Z" fill="${S.lg("kelpie", [[0, "#9a5628"], [1, "#6e3818"]], 0, 0, 0, 1)}"/>`;
  d += `<path d="M-8.6 -21Q-9.4 -16 -7.4 -13.6Q-5 -11.6 -2 -13.2Q-5 -15 -6 -20Z" fill="${BRAND}"/><path d="M-2 -26.6C4 -24.6 10 -24 19 -23" stroke="#c07a44" stroke-width=".7" fill="none" opacity=".8"/>`;
  /* nahe Beine */
  d += bein([[-4, -15], [-6, -8.6], [-9, -2], [-11.6, -.4]], 4.2, 2, FELL) + bein([[13, -17], [10, -10], [14, -5], [13, -.6]], 5, 2, FELL);
  d += `<path d="M-9.4 -1.6l-3 1.4 3 .2zM12.2 -.8l-2.8 .8 3 .2z" fill="${BRAND}"/>`;
  /* Kopf mit Stirnabsatz, Schnauze, Nasenkuppe, Stehohren, Auge */
  d += `<path d="M-9 -24Q-14 -24 -17.6 -25.4L-24 -24.6Q-25.8 -25.4 -25 -26.6Q-21 -28 -17 -28.6Q-15.6 -30.8 -12 -31.4Q-6.6 -31.6 -4 -28Z" fill="${FELL}"/>`;
  d += `<path d="M-24.4 -24.8Q-20.6 -24.6 -17.6 -25.4Q-16 -24.2 -18 -23.6Q-21 -23.4 -24 -24Z" fill="${BRAND}"/><ellipse cx="-25" cy="-26" rx=".95" ry=".75" fill="#151010"/>`;
  d += `<path d="M-11.8 -31L-10.8 -38L-7.2 -31.4Z" fill="${FELL}"/><path d="M-11 -31.4L-10.5 -36.2L-8.4 -31.6Z" fill="#e8c3a0"/><path d="M-8 -31.4L-5.4 -36.6L-4.4 -30.4Z" fill="${FELLD}"/>`;
  d += `<circle cx="-14.6" cy="-28.4" r=".75" fill="#1a1210"/><circle cx="-14.4" cy="-28.6" r=".25" fill="#fff"/><path d="M-9 -26.4q2 1.6 4.6 .6" stroke="#2f6fb6" stroke-width="1" fill="none"/>`;
  S.teil({ id: "hund", de: "der Hund", syl: "HUND", it: "il cane", itSyl: "CA-ne", en: "dog", x: HUND.x, y: HUND.y, steht: true, kunst: `<g transform="scale(${r(k0 * 100) / 100})">${d}</g>`,
    tipp: "Der Kelpie ist ein australischer Hütehund. Er ist schnell und sehr klug." });
}
{
  /* DIE JOGGERIN (≈ 1,68 m) läuft nach links, Oberkörper nach vorn geneigt, Arme im Ellbogen ≈ 90° gebeugt;
     hinten hält sie die Leine. Licht von rechts hinten: Rücken hell, Vorderseite im Schatten. */
  const { x: X, y: Y } = JOG, k0 = vorn(Y) / 50;
  const HAUT2 = "#d9a47e";
  let j = `<path d="M-8 0l16 0 -16 -3z" fill="#2a2010" opacity=".24" filter="url(#bw_weich)"/>`;
  /* hinteres Bein (stößt ab) */
  j += `<path d="M1 -45L7 -45Q11 -34 10 -25Q14 -20 18 -16L15.6 -12.6Q9.4 -17 6 -23Q3 -33 1 -45Z" fill="#26282e"/><path d="M15 -16.4l5.4 2.6-1.2 2.4-5.6-2.2Z" fill="#f4f4f2"/><path d="M14.4 -13.6l5.4 2.2" stroke="#ff6a3c" stroke-width=".8"/>`;
  /* vorderes Bein (landet) */
  j += `<path d="M-5 -45L2 -45Q-2 -36 -7.6 -27Q-6.6 -14 -5.4 -3L-9.4 -3Q-11.4 -16 -11.6 -27Q-8 -37 -5 -45Z" fill="#1d1f24"/><path d="M-11 -3.6h7.4q2 .6 2 2.6h-10Z" fill="#f4f4f2"/><path d="M-11.4 -1.2h9.6" stroke="#ff6a3c" stroke-width=".8"/>`;
  j += `<path d="M-1 -43Q-4 -36 -8.4 -28" stroke="#4a4e58" stroke-width=".6" fill="none"/>`;
  /* Oberkörper um ≈ 10° nach vorn geneigt (Scherung um die Hüfte) */
  let o = `<path d="M3 -63L9 -56.4L5.4 -49.6" stroke="${HAUT2}" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  o += `<path d="M-5.6 -44Q-8 -54 -7.6 -63Q-5 -67.6 1 -67.4Q5.6 -66.4 6 -62Q6.6 -52 4.6 -44Q0 -42.6 -5.6 -44Z" fill="${S.lg("lauftop", [[0, "#b8355c"], [0.55, "#e2557a"], [1, "#f58aa4"]], 0, 0, 1, 0)}"/><path d="M5.6 -62Q6.2 -52 4.4 -45" stroke="#ffc2cf" stroke-width=".9" fill="none"/>`;
  o += `<path d="M-5.6 -46Q0 -44.6 4.8 -46" stroke="#1d1f24" stroke-width="2.4" fill="none"/>`;
  o += `<path d="M-3 -67L-2.6 -70.4L1.4 -70.6L1.6 -67Z" fill="${HAUT2}"/><ellipse cx="-1.6" cy="-75.2" rx="4.4" ry="5" fill="${HAUT2}"/>`;
  o += `<path d="M1.6 -77.4Q8 -78.6 10 -72.6Q7.4 -75.2 3 -74Z" fill="#6a4122"/><path d="M-6.2 -77.6Q-5.6 -81.6 -1 -81.4Q3.4 -81.2 3.4 -77.4Z" fill="#f4f4f2"/><path d="M-6 -77.6Q-9.6 -77.4 -10.6 -76.4Q-8 -76 -5.4 -76.4Z" fill="#e2557a"/>`;
  o += `<circle cx="-4.6" cy="-75" r=".5" fill="#2a1a12"/><path d="M-5.8 -72.2q1 .6 2 .2" stroke="#3a2418" stroke-width=".45" fill="none"/>`;
  o += `<path d="M-4.4 -63.6L-9.6 -57.4L-14.8 -61" stroke="${HAUT2}" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  j += `<g transform="translate(0 -44) skewX(10) translate(0 44)">${o}</g>`;
  /* Leine von der hinteren Hand zum Halsband des Hundes */
  const hand = [5.4 + 0 - (49.6 - 44) * Math.tan(10 * Math.PI / 180), -49.6].map((v) => v * k0), hals = [(HUND.x - 6 * vorn(HUND.y) / 50) - X, (HUND.y - 26.4 * vorn(HUND.y) / 50) - Y];
  const leine = `<path d="M${r(hand[0])} ${r(hand[1])}Q${r((hand[0] + hals[0]) / 2)} ${r(Math.max(hand[1], hals[1]) + 6)} ${r(hals[0])} ${r(hals[1])}" stroke="#2f6fb6" stroke-width=".55" fill="none"/>`;
  S.teil({ id: "joggerin", de: "die Joggerin", syl: "JOG-ge-rin", it: "la podista", itSyl: "po-DI-sta", en: "jogger", x: X, y: Y, steht: true, kunst: `<g transform="scale(${r(k0 * 100) / 100})">${j}</g>` + leine,
    tipp: "Am Morgen joggen viele Leute am Hafen entlang – oft mit ihrem Hund." });
}
{
  /* Molukkenibis (Australischer Weißer Ibis): weißer Körper, nackter schwarzer Kopf und Hals, langer gebogener Schnabel */
  const X = 378, Y = 234, s = vorn(Y) / 60 * 1.2;
  const g = (n) => r(n * s);
  let k = schlag(g(10), 0.55, vorn(Y), 0.28);
  /* gespiegelt: der Ibis schaut nach links zum Picknick */
  k += `<g transform="scale(-1 1)">`;
  k += `<path d="M${g(-1)} 0 L${g(-1.6)} ${g(-11)} M${g(2)} 0 L${g(1.2)} ${g(-11)}" stroke="#2a2a2c" stroke-width="${g(0.9)}" stroke-linecap="round"/>`;
  k += `<path d="M${g(-3.4)} 0 h${g(2.6)} M${g(0.6)} 0 h${g(2.8)}" stroke="#2a2a2c" stroke-width="${g(0.5)}"/>`;
  k += `<path d="M${g(6)} ${g(-19)} Q${g(9)} ${g(-17)} ${g(7)} ${g(-12.6)} Q${g(2)} ${g(-8.6)} ${g(-5)} ${g(-10.4)} Q${g(-10)} ${g(-11.4)} ${g(-11.6)} ${g(-13.6)} Q${g(-8)} ${g(-15.6)} ${g(-3)} ${g(-17.6)} Q${g(2)} ${g(-19.6)} ${g(6)} ${g(-19)} Z" fill="${S.rg("ibis", [[0, "#ffffff"], [0.7, "#eeeeea"], [1, "#cfcdc6"]], 0.6, 0.3, 0.8)}"/>`;
  k += `<path d="M${g(-6)} ${g(-11.2)} Q${g(-10)} ${g(-11)} ${g(-12.6)} ${g(-12.4)} Q${g(-9.6)} ${g(-12.8)} ${g(-6.6)} ${g(-12.6)} Z" fill="#1d1f24"/>`;
  k += `<path d="M${g(-2)} ${g(-15)} Q${g(-6)} ${g(-14.6)} ${g(-8)} ${g(-12.6)}" stroke="#d5d2c8" stroke-width="${g(0.4)}" fill="none"/>`;
  /* schwarze, herabhängende Schmuckfedern über dem Schwanz */
  k += `<path d="M${g(-4.6)} ${g(-11.6)} Q${g(-9)} ${g(-10.4)} ${g(-13.4)} ${g(-9.6)} Q${g(-10)} ${g(-11.2)} ${g(-12.4)} ${g(-11.6)} Q${g(-8.6)} ${g(-12.4)} ${g(-5.4)} ${g(-12.8)} Z" fill="#141518"/><path d="M${g(-6)} ${g(-11.8)} q${g(-3)} ${g(1)} ${g(-6.4)} ${g(1.8)}" stroke="#3a3c42" stroke-width="${g(0.25)}" fill="none"/>`;
  k += `<path d="M${g(5)} ${g(-18.4)} Q${g(9)} ${g(-22)} ${g(10)} ${g(-26)} Q${g(10.6)} ${g(-28.4)} ${g(12.4)} ${g(-28)}" stroke="#1d1f24" stroke-width="${g(1.6)}" fill="none" stroke-linecap="round"/>`;
  k += `<circle cx="${g(12.6)}" cy="${g(-27.8)}" r="${g(1.4)}" fill="#1d1f24"/><circle cx="${g(12.9)}" cy="${g(-28.2)}" r="${g(0.25)}" fill="#8a2a1e"/>`;
  k += `<path d="M${g(13.6)} ${g(-27.6)} Q${g(17.4)} ${g(-26)} ${g(18.2)} ${g(-19.6)}" stroke="#1d1f24" stroke-width="${g(0.8)}" fill="none" stroke-linecap="round"/>`;
  k += `<path d="M${g(9.6)} ${g(-23.4)} q${g(1)} ${g(-1)} ${g(1.4)} ${g(-2.6)}" stroke="#c94a3a" stroke-width="${g(0.4)}" fill="none" opacity=".7"/></g>`;
  S.teil({ id: "ibis", de: "der Ibis", syl: "I-bis", it: "l'ibis", itSyl: "I-bis", en: "ibis", x: X, y: Y, steht: true, kunst: k,
    tipp: "Der Molukkenibis (Australischer Weißer Ibis) holt sich gern Reste aus dem Picknick – darum heißt er in Sydney „Bin Chicken“." });
}

/* Kleinere Ausgabe (gleiches Bild): Pfaddaten werden je Segment absolut oder relativ geschrieben – was
   kürzer ist –, ohne überflüssige Trennzeichen; SVG-Attribute mit einfachen Anführungszeichen (spart im
   JSON die Rückstriche). */
const kurzPfad = (d) => {
  const tok = d.match(/[MmLlHhVvCcSsQqTtAaZz]|[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?/g) || [];
  const N = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7, Z: 0 };
  const zahl = (v) => { let t = String(Math.round(v * 1000) / 1000); if (t === "-0") t = "0"; return t.replace(/^(-?)0\./, "$1."); };
  let out = "", letzter = "", cx = 0, cy = 0, sx = 0, sy = 0, i = 0, cmd = "";
  const schreibe = (c, zahlen) => {
    let t = c === letzter && c !== "M" && c !== "m" ? "" : c;
    for (const z of zahlen) { const v = zahl(z); if (t && !/[A-Za-z]$/.test(t) && !(v[0] === "-" || (v[0] === "." && /\.\d*$/.test(t.split(/[^\d.]/).pop())))) t += " "; t += v; }
    if (t && t[0] !== c && out && /[\d.]$/.test(out) && !(t[0] === "-" || (t[0] === "." && /\.\d*$/.test(out.split(/[^\d.]/).pop())))) t = " " + t;
    out += t; letzter = c === "M" ? "L" : c === "m" ? "l" : c;
  };
  while (i < tok.length) {
    if (/[A-Za-z]/.test(tok[i])) cmd = tok[i++];
    const C = cmd.toUpperCase(), rel = cmd !== C, n = N[C];
    if (C === "Z") { out += "z"; letzter = "z"; cx = sx; cy = sy; continue; }
    const a = tok.slice(i, i + n).map(Number); i += n;
    if (a.length < n || a.some(isNaN)) break;
    /* absolute Zielwerte */
    const abs = a.slice();
    if (C === "H") { if (rel) abs[0] += cx; } else if (C === "V") { if (rel) abs[0] += cy; }
    else if (C === "A") { if (rel) { abs[5] += cx; abs[6] += cy; } }
    else if (rel) for (let j = 0; j < n; j += 2) { abs[j] += cx; abs[j + 1] += cy; }
    let ex, ey;
    if (C === "H") { ex = abs[0]; ey = cy; } else if (C === "V") { ex = cx; ey = abs[0]; } else { ex = abs[n - 2]; ey = abs[n - 1]; }
    const R = (v, b) => Math.round((v - b) * 1000) / 1000;
    let A1, A2;
    if (C === "M") { A1 = ["M", [ex, ey]]; A2 = ["m", [R(ex, cx), R(ey, cy)]]; if (!out) A2 = A1; }
    else if (C === "A") { A1 = ["A", abs]; A2 = ["a", [...abs.slice(0, 5), R(ex, cx), R(ey, cy)]]; }
    else if (C === "H" || C === "V" || C === "L") {
      if (Math.abs(ey - cy) < 1e-9) { A1 = ["H", [ex]]; A2 = ["h", [R(ex, cx)]]; }
      else if (Math.abs(ex - cx) < 1e-9) { A1 = ["V", [ey]]; A2 = ["v", [R(ey, cy)]]; }
      else { A1 = ["L", [ex, ey]]; A2 = ["l", [R(ex, cx), R(ey, cy)]]; }
    } else { A1 = [C, abs]; A2 = [C.toLowerCase(), abs.map((v, j) => R(v, j % 2 ? cy : cx))]; }
    const len = (x) => x[1].map(zahl).join(" ").length + (x[0] === letzter ? 0 : 1);
    const w = len(A2) < len(A1) ? A2 : A1;
    schreibe(w[0], w[1]);
    /* gerenderte Position nachführen (keine Rundungsdrift) */
    if (w[0] === w[0].toLowerCase()) { if (w[0] === "h") cx += w[1][0]; else if (w[0] === "v") cy += w[1][0]; else { cx += w[1][w[1].length - 2]; cy += w[1][w[1].length - 1]; } }
    else { if (w[0] === "H") cx = w[1][0]; else if (w[0] === "V") cy = w[1][0]; else { cx = w[1][w[1].length - 2]; cy = w[1][w[1].length - 1]; } }
    if (C === "M") { sx = cx; sy = cy; }
    if (C === "M") cmd = rel ? "l" : "L";
  }
  return out;
};
{
  const q = (t) => {
    if (t.includes("'")) throw new Error("Apostroph im SVG: " + t.slice(t.indexOf("'") - 40, t.indexOf("'") + 10));
    return (process.env.ROH ? t : t.replace(/ d="([^"]*)"/g, (m, d) => ` d="${kurzPfad(d)}"`)).replace(/"/g, "'");
  };
  S.defs = S.defs.map(q); S.kulisse = S.kulisse.map(q);
  for (const t of S.teile) { t.kunst = q(t.kunst); for (const u of t.unter || []) u.kunst = q(u.kunst); }
}
const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/sydney.js"));
console.log(aus);
