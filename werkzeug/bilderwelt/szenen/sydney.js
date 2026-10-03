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
S.def(`<filter id="${S.id("wolke")}" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="1"/></filter>`);
S.def(`<filter id="${S.id("dunst")}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation=".35"/></filter>`);
S.def(`<filter id="${S.id("spiegel")}" x="-10%" y="-20%" width="120%" height="140%"><feGaussianBlur stdDeviation="1.4 .3"/></filter>`);
/* Wellenmaske: Spiegelbilder zerfallen in waagerechte, unterbrochene Streifen */
S.def(`<pattern id="${S.id("wellen")}" width="23" height="3.1" patternUnits="userSpaceOnUse" patternTransform="translate(2 0)"><rect x="0" y="0" width="9" height=".9" fill="#fff"/><rect x="11" y=".2" width="5" height=".7" fill="#fff" opacity=".8"/><rect x="4" y="1.5" width="6" height=".8" fill="#fff" opacity=".9"/><rect x="13" y="1.6" width="8.5" height=".9" fill="#fff"/><rect x="19" y=".1" width="3" height=".6" fill="#fff" opacity=".6"/></pattern>`);
S.def(`<pattern id="${S.id("wellen2")}" width="17" height="2.3" patternUnits="userSpaceOnUse" patternTransform="translate(5 .7)"><rect x="0" y="0" width="4" height=".7" fill="#fff" opacity=".8"/><rect x="9" y="1.1" width="6" height=".8" fill="#fff" opacity=".7"/></pattern>`);
S.def(`<mask id="${S.id("wellenmaske")}" maskUnits="userSpaceOnUse" x="0" y="146" width="400" height="60"><rect x="0" y="146" width="400" height="60" fill="url(#${S.id("wellen")})" opacity=".85"/><rect x="0" y="146" width="400" height="60" fill="url(#${S.id("wellen2")})"/></mask>`);

/* =====================================================================
   KULISSE — Himmel, Nordufer, The Rocks
   ===================================================================== */
S.hinten(`<rect width="400" height="${HOR + 6}" fill="${S.lg("himmel", [[0, "#3573b8"], [0.5, "#78a9d6"], [0.86, "#c3d9e8"], [1, "#eae9df"]])}"/>`);
{
  /* Schönwetter-Cumulus am Morgen: flache, leicht graue Basis, oben sonnenbeschienen */
  let w = "";
  const wolke = (x, y, s) => {
    let g = "";
    const kuppen = [[-14, -1.5, 6.5], [-6, -5.5, 8], [4, -7.5, 9.5], [13, -4.5, 7], [20, -1.4, 5], [-20, 0, 4]];
    const umriss = kuppen.map(([dx, dy, rr]) => `<circle cx="${r(x + dx * s)}" cy="${r(y + dy * s)}" r="${r(rr * s)}"/>`).join("");
    const id = S.id("wk" + Math.round(x));
    S.def(`<clipPath id="${id}">${umriss}<rect x="${r(x - 24 * s)}" y="${r(y - 3 * s)}" width="${r(48 * s)}" height="${r(4 * s)}"/></clipPath>`);
    g += `<g clip-path="url(#${id})"><rect x="${r(x - 26 * s)}" y="${r(y - 18 * s)}" width="${r(52 * s)}" height="${r(19.2 * s)}" fill="${S.lg("wolkenlicht", [[0, "#ffffff"], [0.55, "#f7f4ee"], [1, "#c9d3de"]])}"/>`;
    for (const [dx, dy, rr] of kuppen) g += `<circle cx="${r(x + dx * s + rr * s * 0.25)}" cy="${r(y + dy * s - rr * s * 0.3)}" r="${r(rr * s * 0.6)}" fill="#fff" opacity=".7"/>`;
    g += `</g>`;
    return g;
  };
  w += `<g filter="url(#${S.id("wolke")})">` + wolke(70, 34, 1.15) + wolke(268, 24, 1.3) + wolke(372, 56, 0.75) + wolke(176, 60, 0.6) + `</g>`;
  S.hinten(w);
}
/* Nordufer hinter der Brücke: Milsons Point und North Sydney im Morgendunst */
{
  let c = `<g filter="url(#${S.id("dunst")})">`;
  c += `<path d="M236 148.6 L236 141 Q260 137.6 290 139 Q330 135 360 136.4 Q384 133.4 400 134 L400 148.6 Z" fill="${S.lg("nordufer", [[0, "#93a69d"], [1, "#a9b6ad"]])}"/>`;
  const tuerme = [[328, 9, 18, "#b9c4cc"], [338, 7, 24, "#a8b6c2"], [346, 10, 20, "#c4ccd2"], [357, 6, 30, "#9fb0bf"], [364, 9, 26, "#b6c2cb"], [374, 8, 35, "#a4b4c1"], [383, 7, 29, "#c0cad1"], [391, 9, 23, "#aebcc7"], [244, 7, 10, "#c9cfcf"], [256, 9, 8, "#bfc8c6"], [268, 6, 12, "#c6cccc"], [282, 8, 9, "#bcc6c4"], [296, 7, 11, "#c8cecc"]];
  for (const [x, w, h, f] of tuerme) {
    const y0 = 140 - (x > 320 ? 3 : 0);
    c += `<rect x="${x}" y="${r(y0 - h)}" width="${w}" height="${r(h + 6)}" fill="${f}"/>`;
    c += `<rect x="${x}" y="${r(y0 - h)}" width="${r(w * 0.35)}" height="${r(h + 6)}" fill="#7d8d99" opacity=".22"/>`;
    for (let y = y0 - h + 2; y < y0; y += 2.2) c += `<rect x="${x + 0.6}" y="${r(y)}" width="${r(w - 1.2)}" height=".45" fill="#6f8191" opacity=".3"/>`;
  }
  c += `<rect x="236" y="144.6" width="164" height="4" fill="#8a9a92"/>`;
  c += `</g>`;
  /* Morgendunst über North Sydney */
  c += `<rect x="230" y="96" width="170" height="54" fill="${S.lg("dunstnord", [[0, "#e9eef0", 0], [0.6, "#e9eef0", 0.35], [1, "#f1efe6", 0.5]])}"/>`;
  S.hinten(c);
}
/* Südufer links: The Rocks im Dunst */
{
  let c = `<g filter="url(#${S.id("dunst")})">`;
  c += `<path d="M0 149 L0 128 Q20 126 34 128.6 L40 124 L58 125 L66 129 L86 130 L86 149 Z" fill="#b5b3a8"/>`;
  for (const [x, w, h] of [[2, 9, 17], [12, 7, 13], [21, 10, 20], [33, 8, 15], [44, 11, 18], [57, 7, 14], [66, 9, 12]]) c += `<rect x="${x}" y="${r(140 - h)}" width="${w}" height="${h}" fill="${["#c8bfa9", "#bdb6a6", "#cfc6b3", "#b9b4a8"][x % 4]}"/>`;
  c += `</g>`;
  c += `<rect x="0" y="118" width="90" height="32" fill="${S.lg("dunstsued", [[0, "#e9eef0", 0], [1, "#eef0ea", 0.35]])}"/>`;
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
  const fach = (c, farbe, licht, dick) => {
    let g = "";
    const N = 28, pts = [...Array(N + 1)].map((_, i) => i * 503 / N);
    const oben = pts.map((a) => bp(a, c, zO(a))), unten = pts.map((a) => bp(a, c, zU(a)));
    g += `<path d="M${oben.map(P).join(" L")} L${unten.slice().reverse().map(P).join(" L")} Z" fill="${farbe}" opacity=".08"/>`;
    let st = "";
    for (let i = 0; i <= N; i++) st += `M${P(oben[i])} L${P(unten[i])}`;
    for (let i = 0; i < N; i++) st += i < N / 2 ? `M${P(oben[i])} L${P(unten[i + 1])}` : `M${P(unten[i])} L${P(oben[i + 1])}`;
    g += `<path d="${st}" stroke="${farbe}" stroke-width="${dick * 0.42}" fill="none"/>`;
    g += `<path d="M${oben.map(P).join(" L")}" stroke="${farbe}" stroke-width="${dick}" fill="none" stroke-linejoin="round"/>`;
    g += `<path d="M${unten.map(P).join(" L")}" stroke="${farbe}" stroke-width="${dick * 1.25}" fill="none" stroke-linejoin="round"/>`;
    if (licht) {
      g += `<path d="M${oben.map((p) => P([p[0], p[1] - dick * 0.32])).join(" L")}" stroke="${licht}" stroke-width="${dick * 0.35}" fill="none"/>`;
      g += `<path d="M${unten.map((p) => P([p[0], p[1] - dick * 0.4])).join(" L")}" stroke="${licht}" stroke-width="${dick * 0.4}" fill="none"/>`;
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
    g += `<path d="M${ost.map(P).join(" L")} Z" fill="${S.lg("granit", [[0, "#e3dbc9"], [0.6, "#cfc6b2"], [1, "#b5ab96"]])}"/>`;
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
  k += `<g opacity=".8">${fach(-15, "#86919a", null, 1.1)}</g>`;
  for (let i = 0; i <= 28; i += 2) { const a = i * 503 / 28; k += `<path d="M${P(bp(a, -15, zO(a)))} L${P(bp(a, 15, zO(a)))}" stroke="#7f8a90" stroke-width=".45"/>`; }
  {
    /* Zug (Westseite) und Busse/Lastwagen ragen über die Brüstung; Autos sind fast verdeckt */
    let v = "";
    const zug = [bp(150, -18, 49), bp(330, -18, 49)];
    const zugO = [bp(150, -18, 54.6), bp(330, -18, 54.6)];
    v += `<path d="M${P(zug[0])} L${P(zug[1])} L${P(zugO[1])} L${P(zugO[0])} Z" fill="${S.lg("zug", [[0, "#e6e9eb"], [1, "#a9b0b5"]])}"/>`;
    for (let a = 150; a < 330; a += 20) v += `<path d="M${P(bp(a, -18, 49.5))} L${P(bp(a, -18, 54.4))}" stroke="#6d757b" stroke-width=".18"/>`;
    v += `<path d="M${P(bp(150, -18, 52.6))} L${P(bp(330, -18, 52.6))}" stroke="#f2c62f" stroke-width=".35"/><path d="M${P(bp(150, -18, 53.6))} L${P(bp(330, -18, 53.6))}" stroke="#2f3f4c" stroke-width=".3"/>`;
    const fz = [[60, 8, 4, 12, "#f4f4f2"], [96, 14, 1.6, 4.6, "#c0392b"], [140, 4, 4, 12, "#2f6fb6"], [205, 12, 1.6, 4.6, "#e8e8e6"], [262, 16, 1.6, 4.6, "#1d1d1d"], [300, 6, 4, 12, "#f4f4f2"], [352, 10, 1.6, 4.6, "#d9b02f"], [410, 14, 2.6, 9, "#e2722d"], [455, 8, 1.6, 4.6, "#7d8590"]];
    for (const [a, c, h, l, f] of fz) {
      const p0 = bp(a, c, 49), p1 = bp(a + l, c, 49), q1 = bp(a + l, c, 49 + h), q0 = bp(a, c, 49 + h);
      v += `<path d="M${P(p0)} L${P(p1)} L${P(q1)} L${P(q0)} Z" fill="${f}"/>`;
      if (h > 3) v += `<path d="M${P(bp(a + 1, c, 49 + h * 0.7))} L${P(bp(a + l - 1, c, 49 + h * 0.7))}" stroke="#2f3f4c" stroke-width=".25"/>`;
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
    for (let a = 10; a < 500; a += 36) { const p = bp(a, 24.4, 49), q = bp(a, 24.4, 55); lat += `M${P(p)} L${P(q)}`; }
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
      kunst: flaeche(-9, -22, 18, 30), tipp: "Die vier Pylone sind 89 Meter hoch und mit Granit verkleidet. Den Bogen tragen sie nicht." },
    { id: "flagge", de: "die Flagge", syl: "FLAG-ge", it: "la bandiera", itSyl: "ban-DIE-ra", en: "flag", x: pz[0] - 1, y: pz[1] + 3,
      kunst: flaeche(-11, -14, 21, 16, 0.6), tipp: "Oben wehen die Flagge Australiens und die Flagge der Aborigines." },
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
  /* Vorplatz-Kante (Süden) */
  k += `<path d="M${P(op(0, 0, 0))} L${P(op(0, 120, 0))} L${P(op(0, 120, 4))} L${P(op(0, 0, 4))} Z" fill="#b99c8a"/>`;
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
  const schale = (e, b, t, p, rueck, warm = 1) => {
    const B0 = op(b[0], e, b[1]), T = op(t[0], e, t[1]), Pp = op(p[0], e, SOCKEL_Z), B0f = op(b[0] + (rueck ? 5 : -5), e, SOCKEL_Z);
    const dir = rueck ? -1 : 1;
    const gL = len(B0, T), gN = [(T[1] - B0[1]) / gL * dir, -(T[0] - B0[0]) / gL * dir];
    const cg = [(B0[0] + T[0]) / 2 + gN[0] * 0.15 * gL, (B0[1] + T[1]) / 2 + gN[1] * 0.15 * gL];
    const lL = len(T, Pp);
    const cl = [(T[0] + Pp[0]) / 2 - dir * 0.12 * lL, (T[1] + Pp[1]) / 2];
    /* stumpfe Spitze: kurz vor T auf dem Grat abbiegen, über T gerundet zur Lippe */
    const Ta = qb(B0, cg, T, 0.955), Tb = qb(T, cl, Pp, 0.05);
    const cg2 = lerp(B0, cg, 0.97);
    const d = `M${P(Pp)} L${P(B0f)} L${P(B0)} Q${P(cg2)} ${P(Ta)} Q${P(T)} ${P(Tb)} Q${P(cl)} ${P(Pp)} Z`;
    SPIEGEL_OP.push([b, t, p, e]);
    const id = S.id("sch" + schalenNr++);
    S.def(`<clipPath id="${id}"><path d="${d}"/></clipPath>`);
    const mx = T[0] - (T[0] - B0[0]) * 0.25, my = T[1] + (Pp[1] - T[1]) * 0.3, rr = Math.max(gL, lL) * 1.15;
    S.def(`<radialGradient id="${id}g" gradientUnits="userSpaceOnUse" cx="${r(mx)}" cy="${r(my)}" r="${r(rr)}" fx="${r(mx + dir * 2)}" fy="${r(my - 2)}"><stop offset="0" stop-color="${warm ? "#fffbef" : "#fbfaf6"}"/><stop offset=".45" stop-color="${warm ? "#f6eedc" : "#f1eee6"}"/><stop offset="1" stop-color="${rueck ? "#cfc5b2" : "#d8cdb7"}"/></radialGradient>`);
    let g = `<path d="M${P(T)} Q${P(cl)} ${P(Pp)}" stroke="#6f6a60" stroke-width="2.2" fill="none" opacity=".25" filter="url(#${S.id("dunst")})" transform="translate(${-dir * 0.9} .3)"/>`;
    g += `<path d="${d}" fill="url(#${id}g)"/>`;
    g += `<g clip-path="url(#${id})">`;
    /* Rippen und Chevrons */
    const NB = 12, ridge = (u) => qb(B0, cg, T, u);
    let rip = "", chev = "", band = "";
    for (let i = 1; i < NB; i++) rip += `M${P(Pp)} L${P(ridge(i / NB))}`;
    for (let i = 0; i < NB; i++) {
      const R0 = ridge(i / NB), R1 = ridge((i + 1) / NB), RM = ridge((i + 0.5) / NB);
      if (i % 2) band += `M${P(Pp)} L${P(R0)} L${P(R1)} Z`;
      for (let f = 0.22; f < 0.97; f += 0.105) {
        const c = lerp(Pp, RM, f), a0 = lerp(Pp, R0, f + 0.06), a1 = lerp(Pp, R1, f + 0.06);
        chev += `M${P(a0)} L${P(c)} L${P(a1)}`;
      }
    }
    g += `<path d="${band}" fill="#eadfc6" opacity=".16"/>`;
    g += `<path d="${chev}" stroke="#e4d8bd" stroke-width=".12" fill="none" opacity=".75"/>`;
    g += `<path d="${rip}" stroke="#d2c6ad" stroke-width=".16" fill="none" opacity=".8"/>`;
    /* Licht: Grat-Kante hell; Lippe: helles Rippenband mit Schattenlinie innen */
    g += `<path d="M${P(B0)} Q${P(cg2)} ${P(Ta)} Q${P(T)} ${P(Tb)}" stroke="#fffdf6" stroke-width=".9" fill="none"/>`;
    g += `<path d="M${P(Tb)} Q${P(cl)} ${P(Pp)}" stroke="#fdf8ec" stroke-width="1.5" fill="none"/>`;
    g += `<path d="M${P(Tb)} Q${P(cl)} ${P(Pp)}" stroke="#b7ac97" stroke-width=".3" fill="none" transform="translate(${-dir * 0.75} 0)"/>`;
    g += `</g>`;
    g += `<path d="M${P(B0)} Q${P(cg2)} ${P(Ta)} Q${P(T)} ${P(Tb)} Q${P(cl)} ${P(Pp)}" fill="none" stroke="#9d9686" stroke-width=".2"/>`;
    return { svg: g, T, Pp, B0, cl, Tb, cg };
  };
  /* Unterseite einer Rückschale (Süden): beschattete Schalen-Innenseite, grau-creme mit Rippen */
  const unterseite = (sch, e, sFuss) => {
    const F0 = op(sFuss, e, SOCKEL_Z);
    let g = `<path d="M${P(sch.Tb)} Q${P(sch.cl)} ${P(sch.Pp)} L${P(F0)} Z" fill="${S.lg("schalenschatten", [[0, "#e2dccf"], [1, "#c4bcae"]], 0, 0, 1, 1)}"/>`;
    for (let i = 1; i < 5; i++) g += `<path d="M${P(F0)} L${P(qb(sch.Tb, sch.cl, sch.Pp, i / 5))}" stroke="#958d80" stroke-width=".18" opacity=".7"/>`;
    return g;
  };
  /* Nord-Glasvorhang: hängt schräg von der Lippe der vordersten Schale bis zum Sockel, Topasglas mit Sprossen */
  const GLAS = S.lg("glas", [[0, "#d7ab68"], [0.35, "#9a6e3c"], [0.7, "#6a4a2c"], [1, "#4a3828"]], 0, 0, 1, 1);
  const glasvorhang = (sch, e, sFuss) => {
    const F0 = op(sFuss, e, SOCKEL_Z), lip = [0, 0.2, 0.4, 0.6, 0.8, 1].map((t) => qb(sch.Tb, sch.cl, sch.Pp, t));
    let g = `<path d="M${P(sch.Tb)} L${P(F0)} L${P(sch.Pp)} Q${P(sch.cl)} ${P(sch.Tb)} Z" fill="${GLAS}"/>`;
    /* Sprossen: von der Lippe senkrecht zum Sockel; zwei Querriegel */
    let sp = "";
    for (let i = 1; i < 6; i++) { const q = lerp(sch.Tb, F0, i / 6); sp += `M${P(q)} L${P([q[0], sch.Pp[1]])}`; }
    for (const f of [0.35, 0.68]) sp += `M${P(lerp(lip[0], F0, f * 0.02))} L${P(lerp(sch.Pp, F0, f))}`;
    for (const f of [0.4, 0.75]) { const a = lerp(sch.Tb, F0, f); sp += `M${P(qb(sch.Tb, sch.cl, sch.Pp, f))} L${P(a)}`; }
    g += `<path d="${sp}" stroke="#e6c88f" stroke-width=".22" opacity=".8"/>`;
    /* Spiegelglanz des Morgenhimmels */
    const gl0 = lerp(sch.Tb, F0, 0.3), gl1 = lerp(sch.Tb, F0, 0.5);
    g += `<path d="M${P(gl0)} L${P(gl1)} L${P([gl1[0] - 1.6, sch.Pp[1]])} L${P([gl0[0] - 2.4, sch.Pp[1]])} Z" fill="#fff4d8" opacity=".22"/>`;
    g += `<path d="M${P(sch.Tb)} L${P(F0)}" stroke="#f3e4c4" stroke-width=".35"/>`;
    return g;
  };
  /* Restaurant (Südwest, klein, ganz hinten links) */
  const rB = schale(10, [30, 22], [14, 30], [22], true, 0), rA = schale(10, [24, 21], [40, 29], [33], false, 0);
  k += rA.svg + unterseite(rB, 10, 12) + rB.svg;
  /* Westgruppe: Konzertsaal (hinten) — die höchste Schale, 67 m */
  const CH = 30, JS = 88;
  const chA1 = schale(CH, [128, 35], [160, 45], [151], false, 0);
  const chA2 = schale(CH, [102, 42], [136, 56], [125], false, 0);
  const chB = schale(CH, [76, 30], [44, 47], [57], true, 0);
  const chA3 = schale(CH, [68, 29], [112, 67], [100], false, 0);
  k += glasvorhang(chA1, CH, 170) + chA1.svg + chA2.svg + unterseite(chB, CH, 42) + chB.svg + chA3.svg;
  /* Ostgruppe: Joan Sutherland Theatre (vorn) */
  const jA1 = schale(JS, [124, 31], [156, 39], [148]);
  const jA2 = schale(JS, [99, 38], [132, 50], [122]);
  const jB = schale(JS, [74, 27], [47, 41], [59], true);
  const jA3 = schale(JS, [68, 26], [110, 60], [99]);
  const gwFuss = op(168, JS, SOCKEL_Z);
  k += glasvorhang(jA1, JS, 168) + jA1.svg + jA2.svg + unterseite(jB, JS, 45) + jB.svg + jA3.svg;
  /* Menschen auf dem Sockel und auf der Freitreppe (winzig, 1,7 m) */
  let leute = "";
  const farben = ["#c0392b", "#2f6fb6", "#f2c62f", "#ffffff", "#2a2a2a", "#3c8f5a", "#e58fa1"];
  for (let i = 0; i < 14; i++) {
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
      kunst: flaeche(-8, -10, 16, 10), tipp: "Über eine Million Fliesen aus Schweden: glänzend weiße und matt cremefarbene im Fischgrätmuster." },
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
  /* Ufermauer von Farm Cove (Sandsteinquader, hell) */
  b += `<path d="M0 146.6 L78 147.2 L78 149.6 L0 149.6 Z" fill="#d9caa8"/><path d="M0 146.6 L78 147.2" stroke="#f2e6c8" stroke-width=".4"/>`;
  for (let x = 2; x < 78; x += 3.4) b += `<line x1="${x}" y1="147" x2="${x}" y2="149.4" stroke="#a89878" stroke-width=".15"/>`;
  /* Feigen: kurze, dicke Stämme, breite gewölbte Kronen mit unregelmäßigem Rand; Licht oben rechts */
  const KRONE = S.rg("krone", [[0, "#5f8f48"], [0.5, "#355f30"], [1, "#1f3d22"]], 0.62, 0.25, 0.8);
  const feige = (x, y, w, h) => {
    let g = `<path d="M${r(x - w * 0.07)} ${y} L${r(x - w * 0.04)} ${r(y - h * 0.42)} L${r(x + w * 0.04)} ${r(y - h * 0.42)} L${r(x + w * 0.08)} ${y} Z" fill="#6b5e4e"/>`;
    g += `<path d="M${r(x - w * 0.14)} ${y} Q${r(x - w * 0.06)} ${r(y - h * 0.12)} ${r(x - w * 0.04)} ${r(y - h * 0.1)} M${r(x + w * 0.14)} ${y} Q${r(x + w * 0.06)} ${r(y - h * 0.12)} ${r(x + w * 0.05)} ${r(y - h * 0.1)}" stroke="#6b5e4e" stroke-width=".6" fill="none"/>`;
    const n = 11; let d = `M${r(x - w / 2)} ${r(y - h * 0.38)}`;
    for (let i = 1; i <= n; i++) { const t = i / n, px = x - w / 2 + w * t, py = y - h * (0.38 + 0.6 * Math.sin(t * Math.PI)) - rnd() * h * 0.08; d += ` Q${r(px - w / n * 0.5)} ${r(py - h * 0.12)} ${r(px)} ${r(py)}`; }
    d += ` Q${r(x + w * 0.3)} ${r(y - h * 0.3)} ${r(x)} ${r(y - h * 0.34)} Q${r(x - w * 0.3)} ${r(y - h * 0.3)} ${r(x - w / 2)} ${r(y - h * 0.38)} Z`;
    g += `<path d="${d}" fill="${KRONE}"/>`;
    for (let i = 0; i < 14; i++) { const t = rnd(), bx = x - w * 0.45 + w * 0.9 * t, by = y - h * (0.45 + 0.4 * Math.sin(t * Math.PI) * rnd()); g += `<ellipse cx="${r(bx)}" cy="${r(by)}" rx="${r(w * 0.05)}" ry="${r(w * 0.03)}" fill="${t > 0.5 ? "#6f9a52" : "#1d381f"}" opacity=".7"/>`; }
    return g;
  };
  b += feige(12, 147, 26, 19) + feige(40, 147.4, 22, 16) + feige(64, 147.6, 18, 12);
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
const BOOTE = [[262, 157.6, 1], [372, 151.6, 0.55]];
const FAEHRE = { X: 298, Y: 155.4, s: 1.12 };
{
  let k = `<path d="M0 147.5 L400 147.5 L400 ${r(KANTE(400))} ${[...Array(21)].map((_, i) => `L${400 - i * 20} ${r(KANTE(400 - i * 20))}`).join(" ")} Z" fill="${S.lg("wasser", [[0, "#6f9ab5"], [0.2, "#3a789c"], [1, "#1b4d69"]])}"/>`;
  /* Spiegelbilder: gleiche Projektion mit negativer Höhe, zerlegt in Wellenstreifen */
  let sp = "";
  /* Opernhaus: Sockel (rosa) und Schalen (weiß) */
  sp += `<path d="M${P(op(0, 120, -0.5))} L${P(op(183, 120, -0.5))} L${P(op(183, 120, -SOCKEL_Z))} L${P(op(0, 120, -SOCKEL_Z))} Z" fill="#c9a08c"/>`;
  for (const [b, t, p, e] of SPIEGEL_OP) {
    const B0 = op(b[0], e, -b[1]), T = op(t[0], e, -t[1]), Pp = op(p[0], e, -SOCKEL_Z);
    sp += `<path d="M${P(Pp)} L${P(B0)} L${P(T)} Z" fill="${e === 88 ? "#fbf6ea" : "#ece6da"}"/>`;
  }
  /* Brücke: Pylone und Bogen (unteres Stück) */
  for (const [a, c] of [[-15, 31], [518, 31], [518, -31]]) sp += `<path d="M${P(bp(a - 10, c + 7, -0.5))} L${P(bp(a + 10, c + 7, -0.5))} L${P(bp(a + 10, c + 7, -89))} L${P(bp(a - 10, c + 7, -89))} Z" fill="#c9c1ae"/>`;
  sp += `<path d="M${[300, 340, 380, 420, 460, 503].map((a) => P(bp(a, 15, -zU(a)))).join(" L")}" stroke="#7f8a90" stroke-width="1.6" fill="none"/>`;
  sp += `<path d="M${P(bp(250, 24, -49))} L${P(bp(560, 24, -49))}" stroke="#7d878d" stroke-width="2.2"/>`;
  /* Fähre und Segelboote */
  sp += `<rect x="${r(FAEHRE.X - 16 * FAEHRE.s)}" y="${r(FAEHRE.Y + 0.4)}" width="${r(32 * FAEHRE.s)}" height="${r(4 * FAEHRE.s)}" fill="#2f7a4a"/><rect x="${r(FAEHRE.X - 14 * FAEHRE.s)}" y="${r(FAEHRE.Y + 4)}" width="${r(28 * FAEHRE.s)}" height="${r(5 * FAEHRE.s)}" fill="#e8c860"/>`;
  for (const [x, y, s] of BOOTE) sp += `<path d="M${r(x)} ${r(y + 1)} L${r(x + 6 * s)} ${r(y + 1)} L${r(x + 0.3)} ${r(y + 16 * s)} Z" fill="#ffffff"/>`;
  /* Feigen des Botanischen Gartens (dunkelgrün) */
  sp += `<rect x="0" y="148.6" width="76" height="9" fill="#24432a"/>`;
  k += `<g mask="url(#${S.id("wellenmaske")})" opacity=".32"><g filter="url(#${S.id("spiegel")})">${sp}</g></g>`;
  /* Glitzern und Wellen */
  let wl = "";
  for (let i = 0; i < 200; i++) {
    const y = 149 + Math.pow(rnd(), 0.8) * 40, w = 1 + (y - 148) * 0.22 * (0.5 + rnd());
    wl += `<path d="M${r(rnd() * (398 - w))} ${r(y)} q${r(w / 2)} -.5 ${r(w)} 0" stroke="${rnd() < 0.6 ? "#d6e8f1" : "#163e56"}" stroke-width="${r(0.15 + (y - 148) * 0.012)}" fill="none" opacity="${r(0.3 + rnd() * 0.45)}"/>`;
  }
  k += wl;
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
  k += `<path d="M${-22 * s} 0 q${-6 * s} .5 ${-12 * s} -.2 M${18 * s} .2 q${8 * s} .6 ${14 * s} -.1" stroke="#e8f2f6" stroke-width=".6" fill="none" opacity=".85"/>`;
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
  const x = 352, y = 149.4, s = 0.42;
  S.hinten(`<g opacity=".9"><path d="M${r(x - 17 * s)} ${r(y - 3.2 * s)} L${r(x + 17 * s)} ${r(y - 3.2 * s)} L${r(x + 14 * s)} ${y} L${r(x - 14 * s)} ${y} Z" fill="#2f6a46"/><rect x="${r(x - 14 * s)}" y="${r(y - 7.6 * s)}" width="${r(28 * s)}" height="${r(4.4 * s)}" fill="#ecd27a"/><rect x="${r(x - 2.4 * s)}" y="${r(y - 10 * s)}" width="${r(4.8 * s)}" height="${r(2.4 * s)}" fill="#ecd27a"/></g>`);
}
{
  /* Wassertaxi: gelb mit schwarzem Band, schnell, mit weißer Bugwelle */
  const X = 214, Y = 168, s = 1.0;
  let k = `<path d="M${-14} .6 q-6 .8 -14 0 M-14 .2 q-4 -1 -9 -.4" stroke="#f2f8fb" stroke-width=".7" fill="none" opacity=".8"/>`;
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
  /* Moreton-Bay-Feige am linken Bildrand (≈ 20 m entfernt): breiter Stamm mit Brettwurzeln und Rippen,
     ein Ast schwingt nach rechts oben ins Laubdach, das die linke obere Ecke rahmt; Licht von rechts */
  const X = 0, Y = 203, s = vorn(Y);   // ≈ 36 Einheiten je Meter
  let k = `<g transform="translate(40 0)">${schlag(50, 0.3, s, 0.2)}</g>`;
  const RINDE = S.lg("rinde", [[0, "#4a453e"], [0.4, "#78716a"], [0.75, "#a59d8e"], [1, "#8a8274"]], 0, 0, 1, 0);
  /* Brettwurzeln nach rechts auslaufend */
  for (const [x0, x1, y1] of [[22, 58, -1], [20, 44, -0.5], [14, 32, 0]]) k += `<path d="M${x0} ${-26 - (x0 - 14)} Q${r((x0 + x1) / 2)} ${r(-10 - (x0 - 6) * 0.5)} ${x1} ${y1} L${x1 - 10} ${y1 + 0.8} Q${r((x0 + x1) / 2 - 6)} ${r(-4)} ${x0 - 6} 0 Z" fill="${RINDE}"/>`;
  /* Stamm und Ast */
  k += `<path d="M-4 0 Q-2 -60 -3 -110 Q-4 -160 -4 -203 L12 -203 Q10 -170 14 -140 Q44 -152 100 -160 Q128 -165 158 -172 L157 -166 Q130 -158 102 -150 Q56 -135 26 -105 Q20 -70 24 -40 Q26 -16 32 0 Z" fill="${RINDE}"/>`;
  let rp = "";
  for (const x of [2, 8, 14, 20, 26]) rp += `M${x} -2 Q${x - 2} -60 ${x - 4} -120`;
  k += `<path d="${rp}" stroke="#3a3530" stroke-width=".9" fill="none" opacity=".45"/>`;
  k += `<path d="M26 -105 Q20 -70 24 -40 Q26 -16 32 0 M100 -150 Q130 -158 157 -166" stroke="#d2cab8" stroke-width="1.1" fill="none" opacity=".55"/>`;
  for (let i = 0; i < 26; i++) { const y = -8 - rnd() * 120, x = 0 + rnd() * 26; k += `<path d="M${r(x)} ${r(y)} q.6 -2 .2 -4" stroke="#5a544b" stroke-width=".4" fill="none" opacity=".5"/>`; }
  /* Luftwurzeln vom Ast */
  for (const [x0, y0, l] of [[42, -131, 30], [68, -141, 22], [98, -150, 15], [28, -118, 34]]) k += `<path d="M${x0} ${y0} q-1 ${r(l / 2)} .6 ${l}" stroke="#8a8274" stroke-width=".55" fill="none" opacity=".85"/>`;
  /* Laubdach: Massen mit Verlauf (unten dunkel, rechts oben Sonne), Blattrand aus einzelnen Blättern */
  const LAUB0 = S.rg("laub", [[0, "#6a9a4e"], [0.45, "#2f5a2c"], [1, "#183219"]], 0.66, 0.28, 0.78);
  const massen = [[18, -184, 22, 19], [30, -190, 28, 13], [60, -178, 26, 14], [92, -186, 24, 12], [124, -180, 20, 10], [150, -177, 13, 7], [18, -150, 18, 12], [44, -160, 16, 9], [80, -162, 14, 7], [40, -195, 36, 8], [100, -195, 30, 8]];
  for (const [mx, my, rx, ry] of massen) { const x0 = Math.max(mx - rx, 0.5), y0 = Math.max(my - ry, -202.5); k += `<path d="M${r(x0)} ${r(my)} Q${r(x0)} ${r(y0)} ${mx} ${r(y0)} Q${r(mx + rx)} ${r(y0)} ${r(mx + rx)} ${my} Q${r(mx + rx)} ${r(my + ry)} ${mx} ${r(my + ry)} Q${r(x0)} ${r(my + ry)} ${r(x0)} ${my} Z" fill="${LAUB0}"/>`; }
  let blatt = "";
  for (let i = 0; i < 320; i++) {
    const m = massen[i % massen.length], an = rnd() * Math.PI * 2, rad = 0.7 + rnd() * 0.4;
    const bx = m[0] + Math.cos(an) * m[2] * rad, by = m[1] + Math.sin(an) * m[3] * rad;
    if (by < -201 || bx < 1) continue;
    const hell = Math.cos(an) > 0.1 && Math.sin(an) < 0.4;
    blatt += `<ellipse cx="${r(bx)}" cy="${r(by)}" rx="1.6" ry=".75" fill="${hell ? ["#6f9e52", "#86b062", "#5c8a44"][i % 3] : ["#1e3a20", "#2a4c2a", "#36602f"][i % 3]}" transform="rotate(${r(rnd() * 180)} ${r(bx)} ${r(by)})"/>`;
  }
  k += blatt;
  for (const [hx, hy] of [[50, -176], [88, -190], [18, -170], [116, -184]]) k += `<ellipse cx="${hx}" cy="${hy}" rx="2" ry="1.2" fill="#7fa9d4" opacity=".85"/>`;
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
  let k = `<path d="${umriss}" fill="${S.lg("fels", [[0, "#dcbf88"], [0.4, "#cda76b"], [1, "#b08250"]])}"/>`;
  S.def(`<clipPath id="${S.id("felsclip")}"><path d="${umriss}"/></clipPath>`);
  k += `<g clip-path="url(#${S.id("felsclip")})">`;
  /* Felsbänke: die Platte fällt in Stufen zum Betrachter ab. Jede Stufe: oben die helle Trittfläche,
     vorn die Stirn (Morgensonne von hinten rechts → hell, warm), darunter eine dunkle Schattenfuge */
  const baenke = [[200, 3.2], [214, 4.2], [232, 5.6], [250, 6.4]];
  baenke.forEach(([y0, h], i) => {
    const wav = (x) => y0 + Math.sin(x / 27 + i * 2) * 1.6 + Math.sin(x / 9 + i) * 0.5;
    let top = "", bot = "";
    const xs = [...Array(14)].map((_, j) => j * 18);
    top = xs.map((x) => `${r(x)} ${r(wav(x))}`).join(" L");
    bot = xs.slice().reverse().map((x) => `${r(x)} ${r(wav(x) + h + Math.sin(x / 13) * 0.6)}`).join(" L");
    k += `<path d="M${top} L${bot} Z" fill="${S.lg("stirn" + i, [[0, "#d9b47a"], [0.6, "#c59a5f"], [1, "#a77a45"]])}"/>`;
    k += `<path d="M${xs.slice().reverse().map((x) => `${r(x)} ${r(wav(x) + h + Math.sin(x / 13) * 0.6)}`).join(" L")}" stroke="#6f4a26" stroke-width="${r(0.6 + i * 0.25)}" fill="none" opacity=".55"/>`;
    k += `<path d="M${top}" stroke="#f4dfb2" stroke-width="${r(0.5 + i * 0.2)}" fill="none" opacity=".9"/>`;
    /* Kreuzschichtung in der Stirn: feine schräge Lagen */
    let kr = "";
    for (let x = rnd() * 12; x < 236; x += 9 + rnd() * 10) { const y = wav(x) + 0.6; kr += `M${r(x)} ${r(y + h * 0.15)} q${r(h * 0.9)} ${r(h * 0.25)} ${r(h * 1.8)} ${r(h * 0.75)}`; }
    k += `<path d="${kr}" stroke="#9a6d3c" stroke-width=".25" fill="none" opacity=".5"/>`;
    /* Waben (Tafoni) in der Stirn */
    for (let j = 0; j < 4 + i * 2; j++) { const x = rnd() * 220, y = wav(x) + h * (0.3 + rnd() * 0.45), w = (0.6 + rnd() * 0.8) * (1 + i * 0.35); k += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(w)}" ry="${r(w * 0.62)}" fill="#7a5530" opacity=".6"/><path d="M${r(x - w)} ${r(y - w * 0.3)} q${r(w)} ${r(-w * 0.6)} ${r(w * 2)} 0" stroke="#f3dcae" stroke-width=".25" fill="none" opacity=".8"/>`; }
  });
  /* rostrote Eisenbänder: breite, weiche Schlieren in den Trittflächen */
  const EISEN = S.lg("eisenband", [[0, "#b0521f", 0], [0.5, "#b0521f", 0.32], [1, "#b0521f", 0]], 0, 0, 0, 1);
  for (const [x, y, w, hh] of [[20, 205, 90, 4], [110, 222, 80, 5], [10, 240, 120, 6], [120, 256, 90, 5]]) k += `<path d="M${x} ${y} q${r(w * 0.3)} ${r(-hh * 0.6)} ${r(w * 0.6)} ${r(-hh * 0.2)} t${r(w * 0.4)} ${r(hh * 0.4)} l0 ${hh} q${r(-w * 0.4)} ${r(-hh * 0.5)} ${r(-w * 0.6)} ${r(-hh * 0.1)} t${r(-w * 0.4)} ${r(-hh * 0.3)} Z" fill="${EISEN}"/>`;
  /* Klüfte (senkrechte Risse) mit Grasbüscheln */
  for (const [x, y0, y1] of [[58, 214, 232], [148, 200, 214], [96, 232, 250], [182, 214, 232]]) {
    k += `<path d="M${x} ${y0} l1 ${r((y1 - y0) * 0.5)} l-.6 ${r((y1 - y0) * 0.5)}" stroke="#5e3f20" stroke-width=".8" fill="none" opacity=".6"/>`;
    k += `<path d="M${x} ${y0 + 1} l-1.6 -2.6 M${x + 0.4} ${y0 + 1} l.4 -3 M${x + 0.6} ${y0 + 1} l1.8 -2.2" stroke="#6f9a40" stroke-width=".45"/>`;
  }
  /* Ufermauer: Deckquader aus behauenem Sandstein entlang der Kante */
  let mauer = "";
  for (let x = 0; x < 391; x += 9 + (x % 3)) {
    const y0 = KANTE(x), y1 = KANTE(x + 9);
    mauer += `<path d="M${r(x + 0.25)} ${r(y0 - 0.8)} L${r(x + 8.8)} ${r(y1 - 0.8)} L${r(x + 8.8)} ${r(y1 + 1.4)} L${r(x + 0.25)} ${r(y0 + 1.4)} Z" fill="${["#e6cf9f", "#dcc28d", "#e9d6aa"][Math.round(x) % 3]}"/>`;
  }
  k += mauer + `<path d="M0 ${r(KANTE(0) + 1.5)} ${kantePfad.replace(/L(\d+) ([\d.]+)/g, (m, x, y) => `L${x} ${r(Number(y) + 1.5)}`)}" stroke="#9f7f52" stroke-width=".4" fill="none"/>`;
  /* Bordsteine am Rasen, Gras wächst darüber */
  let bord = "";
  for (let i = 0; i < rand.length - 1; i++) bord += `<path d="M${rand[i][0]} ${rand[i][1]} L${rand[i + 1][0]} ${rand[i + 1][1]}" stroke="#d9bf8c" stroke-width="2.4" stroke-linecap="round"/>`;
  bord += `<path d="M272 202 ${rasenRand.map((x) => `L${x} ${r(RASEN(x))}`).join(" ")}" stroke="#d9bf8c" stroke-width="2" fill="none"/>`;
  for (let i = 0; i < 60; i++) { const t = rnd(), j = Math.min(rand.length - 2, Math.floor(t * (rand.length - 1))), u = t * (rand.length - 1) - j; const x = rand[j][0] + (rand[j + 1][0] - rand[j][0]) * u, y = rand[j][1] + (rand[j + 1][1] - rand[j][1]) * u; bord += `<path d="M${r(x + 0.8)} ${r(y + 0.6)} l${r(-0.8 - rnd() * 1.6)} ${r(-1 - rnd() * 1.4)}" stroke="${rnd() < 0.5 ? "#6f9a40" : "#4d7a2a"}" stroke-width=".4"/>`; }
  k += bord;
  /* Rasen (Kulisse, liegt unter dem Fels-Teil) */
  let ra = `<path d="M272 202 ${rasenRand.map((x) => `L${x} ${r(RASEN(x))}`).join(" ")} L400 260 L214 260 ${rand.slice(1, -1).map(([x, y]) => `L${x} ${y}`).join(" ")} Z" fill="${S.lg("rasen", [[0, "#82ad4f"], [1, "#4f7f2e"]])}"/>`;
  for (let i = 0; i < 200; i++) { const x = 214 + rnd() * 186, y = 204 + rnd() * 56; ra += `<path d="M${r(x)} ${r(y)} l${r(-0.4 + rnd() * 0.8)} ${r(-1 - (y - 200) * 0.03)}" stroke="${rnd() < 0.5 ? "#a6cc6e" : "#3f6b25"}" stroke-width=".35"/>`; }
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
  S.def(`<clipPath id="${S.id("bankblock")}"><path d="${blockD}"/></clipPath>`);
  k += `<path d="${blockD}" fill="${FELS}"/>`;
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
  for (let i = 0; i < 9; i++) { const p = bq(-1.4 + rnd() * 1.1, -0.5 + rnd() * 2.2, 0.15 + rnd() * 1.2), w = 2 + rnd() * 4; k += `<ellipse cx="${p[0]}" cy="${p[1]}" rx="${r(w)}" ry="${r(w * 0.45)}" fill="${["#9a4a1c", "#5a5040", "#f2deb4"][i % 3]}" opacity="${[0.22, 0.18, 0.4][i % 3]}"/>`; }
  k += `<path d="M${bP(-1.3, -0.15, 1.36)} Q${bP(-1.0, 0.4, 1.5)} ${bP(-0.55, 1.35, 1.5)}" stroke="#f6e3b8" stroke-width="1.2" fill="none" opacity=".7"/>`;
  k += `<path d="M${bP(-1.4, -0.5, 0.75)} Q${bP(-1, 0.2, 0.95)} ${bP(-0.6, 0.9, 0.8)} L${bP(-0.6, 0.9, 0.7)} Q${bP(-1, 0.2, 0.84)} ${bP(-1.4, -0.5, 0.66)} Z" fill="#b0521f" opacity=".22"/>`;
  for (let c = 0; c < 4; c++) { const m = bq(-1.35 + rnd() * 0.8, -0.4 + rnd() * 1.4, 0.3 + rnd() * 0.8);
    for (let i = 0; i < 5; i++) { const x = Number(m[0]) + (rnd() - 0.5) * 7, y = Number(m[1]) + (rnd() - 0.5) * 3, w = 0.5 + rnd() * 0.9; k += `<path d="M${r(x - w)} ${r(y)} Q${r(x - w * 0.8)} ${r(y - w * 0.9)} ${r(x + w * 0.2)} ${r(y - w * 0.7)} Q${r(x + w)} ${r(y - w * 0.3)} ${r(x + w * 0.8)} ${r(y + w * 0.4)} Q${r(x)} ${r(y + w * 0.7)} ${r(x - w)} ${r(y)} Z" fill="#6f4a28" opacity=".6"/><path d="M${r(x - w)} ${r(y - w * 0.2)} q${r(w)} ${r(-w * 0.8)} ${r(w * 1.8)} 0" stroke="#f3dcae" stroke-width=".25" fill="none" opacity=".8"/>`; } }
  k += `<path d="M${bP(-1.47, -0.55, 0.9)} L${bP(-1.42, -0.66, 0.35)} L${bP(-1.3, -0.7, 0)} L${bP(-1.0, -0.7, 0)} L${bP(-1.1, -0.6, 0.9)} Z" fill="#6b4a2a" opacity=".22"/>`;
  k += `</g>`;
  /* Gras oben auf dem Fels */
  let gr = "";
  for (let i = 0; i < 30; i++) { const t = i / 29, p = bq(-1.38 + t * 1.15, -0.4 + t * 2.35, 1.42 + Math.sin(t * 9) * 0.05); gr += `M${p[0]} ${p[1]} l${r(-0.5 + rnd())} ${r(-1.2 - rnd() * 1.6)}`; }
  k += `<path d="${gr}" stroke="#6f9a40" stroke-width=".5"/>`;
  /* Rückwand der Nische (schaut nach rechts, Morgenlicht von rechts) */
  k += `<path d="M${bP(-0.3, 0, 0.45)} L${bP(-0.3, 0, 1.15)} L${bP(-0.3, 1.7, 1.15)} L${bP(-0.3, 1.7, 0.45)} Z" fill="${S.lg("nische", [[0, "#ddb67a"], [1, "#c99a5c"]], 0, 0, 1, 0)}"/>`;
  /* Meißelspuren auf der Rückwand: kurze schräge Hiebe in Gruppen */
  const hiebe = (u, l0, l1, w0, w1, n) => { let h = ""; for (let i = 0; i < n; i++) { const l = l0 + rnd() * (l1 - l0), w = w0 + rnd() * (w1 - w0); const p = bq(u, l, w); h += `M${p[0]} ${p[1]} l${r(1 + rnd() * 0.8)} ${r(1.2 + rnd() * 0.6)}`; } return h; };
  k += `<path d="${hiebe(-0.3, 0.05, 1.65, 0.5, 0.82, 40)}" stroke="#a7783f" stroke-width=".3" opacity=".5"/>`;
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
  k += `<path d="${hiebe(0.53, 0.05, 1.65, 0.05, 0.38, 26)}" stroke="#9c6e3a" stroke-width=".3" opacity=".45"/>`;
  for (let i = 0; i < 6; i++) { const p = bq(0.53, 0.2 + rnd() * 1.4, 0.05 + rnd() * 0.3), w = 0.5 + rnd() * 0.6; k += `<ellipse cx="${p[0]}" cy="${p[1]}" rx="${r(w)}" ry="${r(w * 0.6)}" fill="#8a6136" opacity=".45"/>`; }
  /* vordere Wange (links der Sitzenden, dem Betrachter zugewandt): niedriger, kantig behauen */
  k += `<path d="M${bP(-0.3, -0.3, 0)} L${bP(-0.32, -0.3, 0.82)} Q${bP(0.05, -0.32, 0.9)} ${bP(0.55, -0.3, 0.72)} L${bP(0.6, -0.3, 0)} Z" fill="${S.lg("wange", [[0, "#d9b277"], [1, "#b78955"]])}"/>`;
  k += `<path d="M${bP(-0.32, -0.3, 0.82)} Q${bP(0.05, -0.32, 0.9)} ${bP(0.55, -0.3, 0.72)} L${bP(0.55, 0, 0.72)} Q${bP(0.05, 0, 0.9)} ${bP(-0.3, 0, 0.82)} Z" fill="#efd7a8"/>`;
  { let h = ""; for (let i = 0; i < 18; i++) { const p = bq(-0.25 + rnd() * 0.8, -0.3, 0.08 + rnd() * 0.65); h += `M${p[0]} ${p[1]} l${r(1 + rnd() * 0.8)} ${r(1.1 + rnd() * 0.6)}`; } k += `<path d="${h}" stroke="#9c6e3a" stroke-width=".3" opacity=".45"/>`; }
  /* eingehauene Stufen seitlich (vorn rechts am Block), grob und abgetreten */
  for (let i = 0; i < 3; i++) {
    const u0 = 0.62 + i * 0.22, w = 0.42 - i * 0.14;
    k += `<path d="M${bP(u0, 1.9, 0)} L${bP(u0 + 0.01, 1.9, w - 0.03)} Q${bP(u0, 2.15, w + 0.02)} ${bP(u0 - 0.01, 2.45, w - 0.02)} L${bP(u0, 2.47, 0)} Z" fill="${i % 2 ? "#c99b62" : "#d4a96c"}"/>`;
    k += `<path d="M${bP(u0 + 0.01, 1.9, w - 0.03)} Q${bP(u0, 2.15, w + 0.02)} ${bP(u0 - 0.01, 2.45, w - 0.02)} L${bP(u0 - 0.2, 2.44, w - 0.01)} Q${bP(u0 - 0.2, 2.15, w + 0.03)} ${bP(u0 - 0.19, 1.9, w - 0.02)} Z" fill="#ead2a2"/>`;
    k += `<path d="M${bP(u0, 2.0, w * 0.4)} l.6 1.2 M${bP(u0, 2.3, w * 0.6)} l-.4 1" stroke="#9a6d3c" stroke-width=".3" opacity=".6"/>`;
  }
  S.teil({ id: "steinbank", de: "die Steinbank", syl: "STEIN-bank", it: "la panchina di pietra", itSyl: "pan-CHI-na di PIE-tra", en: "stone bench", x: BANK.x, y: BANK.y, steht: true, kunst: k,
    tipp: "Mrs Macquarie's Chair: 1810 haben Sträflinge diese Bank in den Fels gehauen. Elizabeth Macquarie sah von hier nach den Schiffen aus England." });
}
{
  /* Touristin: sitzt seitlich auf der Bank, schaut nach rechts über den Hafen, Handy in der Hand,
     Sommerkleid, Sonnenhut, Sonnenbrille */
  const m = B.mensch({ id: "syd_touristin", geschlecht: "w", pose: "lesen", blick: 66, frisur: "zopf", haarfarbe: "hellbraun", haut: "mittel", laecheln: true,
    kleidung: { kleid: { stueck: "sommerkleid", farbe: "#2f8fa0" }, schuhe: { stueck: "sandale", farbe: "braun" }, kopf: { stueck: "hut", farbe: "#e8dcc0" }, zubehoer: { stueck: "brille" } } }, 1.66 * BS);
  let svg = m.svg.replace(/fill="rgba\(220,235,245,\.25\)"/g, 'fill="rgba(20,22,28,.88)"');
  /* Handy zwischen den Händen */
  const hL = m.z.handL, hR = m.z.handR, hx = ((hL.x + hR.x) / 2) * m.k, hy = ((hL.y + hR.y) / 2) * m.k;
  svg += `<g transform="translate(${r(hx + 0.4)} ${r(hy - 1.6)}) rotate(-28)"><rect x="-1.1" y="-1.9" width="2.2" height="3.8" rx=".35" fill="#1d1f24"/><rect x="-.9" y="-1.6" width="1.8" height="3.2" rx=".2" fill="${S.lg("display", [[0, "#7fb7e0"], [1, "#e9f1f6"]])}"/><path d="M-.6 .9 q.3 -1 .6 -1.2 q.3 .2 .6 1.2 Z" fill="#fff"/></g>`;
  const sitz = bq(0.12, 0.55, 0);
  S.teil({ id: "touristin", de: "die Touristin", syl: "tou-RIS-tin", it: "la turista", itSyl: "tu-RI-sta", en: "tourist", x: BANK.x + Number(sitz[0]) - 1, y: BANK.y + Number(sitz[1]) + 0.2, kunst: svg,
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
  k += `<path d="M${g(-3.4)} ${g(-2.2)} Q${g(-3.8)} ${g(-8)} ${g(0.6)} ${g(-9.6)} Q${g(3.8)} ${g(-9.2)} ${g(3.2)} ${g(-5)} Q${g(2.6)} ${g(-1)} ${g(-0.4)} ${g(-0.6)} Q${g(-2.6)} ${g(-0.8)} ${g(-3.4)} ${g(-2.2)} Z" fill="${S.rg("kakadu", [[0, "#ffffff"], [0.7, "#f4f2ec"], [1, "#d6d3ca"]], 0.65, 0.3, 0.8)}"/>`;
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
{
  const s = vorn(DECKE.y);
  const yH = DECKE.y - 0.55 * s * 0.42, yV = DECKE.y + 0.5 * s * 0.22;
  const pts = [[-0.72 * s, yH - DECKE.y], [0.72 * s, yH - DECKE.y], [0.86 * s, yV - DECKE.y], [-0.86 * s, yV - DECKE.y]];
  let k = `<path d="M${r(pts[3][0] - 4)} ${r(pts[3][1] + 0.6)} L${r(pts[0][0] - 6)} ${r(pts[0][1])} L${r(pts[0][0])} ${r(pts[0][1])} L${r(pts[3][0])} ${r(pts[3][1])} Z" fill="#2a3a14" opacity=".18" filter="url(#bw_weich)"/>`;
  const d = `M${pts.map((p) => `${r(p[0])} ${r(p[1])}`).join(" L")} Z`;
  S.def(`<clipPath id="${S.id("decke")}"><path d="${d}"/></clipPath>`);
  k += `<path d="${d}" fill="#b8302c"/>`;
  k += `<g clip-path="url(#${S.id("decke")})">`;
  for (let i = -6; i <= 6; i++) { const x0 = i * 0.12 * s, x1 = i * 0.143 * s; k += `<path d="M${r(x0)} ${r(pts[0][1])} L${r(x1)} ${r(pts[2][1])}" stroke="${i % 3 ? "#1f2f5a" : "#e9d9a8"}" stroke-width="${i % 3 ? 2.4 : 0.6}" opacity="${i % 3 ? 0.55 : 0.8}"/>`; }
  for (let j = 0; j < 6; j++) { const y = pts[0][1] + (pts[2][1] - pts[0][1]) * (j / 5.5); k += `<path d="M${r(-0.9 * s)} ${r(y)} L${r(0.9 * s)} ${r(y)}" stroke="${j % 2 ? "#1f2f5a" : "#e9d9a8"}" stroke-width="${j % 2 ? 2 : 0.5}" opacity="${j % 2 ? 0.5 : 0.75}"/>`; }
  /* Falten */
  k += `<path d="M${r(-0.5 * s)} ${r(pts[0][1] + 2)} q6 3 14 1 M${r(0.2 * s)} ${r(pts[2][1] - 3)} q8 -2 16 0" stroke="#7a1d1b" stroke-width=".6" fill="none" opacity=".4"/>`;
  k += `</g><path d="${d}" fill="none" stroke="#7a1d1b" stroke-width=".4"/>`;
  for (let x = -0.84 * s; x < 0.84 * s; x += 2) k += `<line x1="${r(x)}" y1="${r(pts[2][1])}" x2="${r(x + 0.2)}" y2="${r(pts[2][1] + 1.6)}" stroke="#9a2a26" stroke-width=".4"/>`;
  S.teil({ id: "picknickdecke", de: "die Picknickdecke", syl: "PICK-nick-de-cke", it: "la coperta da picnic", itSyl: "co-PER-ta da PIC-nic", en: "picnic blanket", x: DECKE.x, y: DECKE.y, kunst: k });
}
{
  /* Kühlbox („Esky“): blau, weißer Deckel mit Griff, seitlicher Tragebügel; Vorderseite und Deckel im
     Licht, linke Seite im Schatten; Schlagschatten nach links hinten */
  const X = DECKE.x - 26, Y = DECKE.y - 8, s = vorn(Y);
  const w = 0.56 * s, h = 0.36 * s, t = 0.3 * s, dx = -0.16 * s, dy = -0.07 * s;   // Tiefe nach links hinten (Objekt rechts der Bildmitte)
  let k = `<path d="M${r(-w / 2)} 0 L${r(w / 2)} 0 L${r(w / 2 - 1.2 * 0.36 * s + dx)} ${r(dy - 2)} L${r(-w / 2 - 1.2 * 0.36 * s + dx)} ${r(dy - 2)} Z" fill="#1d2a10" opacity=".3" filter="url(#bw_weich)"/>`;
  k += `<ellipse cx="0" cy=".2" rx="${r(w * 0.52)}" ry="1" fill="#1a1a1a" opacity=".35"/>`;
  /* linke Seite (Schatten) */
  k += `<path d="M${r(-w / 2)} 0 L${r(-w / 2 + dx)} ${r(dy)} L${r(-w / 2 + dx)} ${r(dy - h)} L${r(-w / 2)} ${r(-h)} Z" fill="#1f4a86"/>`;
  /* Vorderseite (Licht) mit Prägung */
  k += `<path d="M${r(-w / 2)} 0 L${r(w / 2)} 0 L${r(w / 2)} ${r(-h)} L${r(-w / 2)} ${r(-h)} Z" fill="${S.lg("esky", [[0, "#4a8fd6"], [1, "#2f6fb6"]])}"/>`;
  k += `<rect x="${r(-w / 2 + 2)}" y="${r(-h + 4)}" width="${r(w - 4)}" height="${r(h - 7)}" rx="1.2" fill="none" stroke="#5a9ee0" stroke-width=".7"/>`;
  /* Deckel (weiß) mit Griffmulde */
  k += `<path d="M${r(-w / 2 - 0.6)} ${r(-h)} L${r(w / 2 + 0.6)} ${r(-h)} L${r(w / 2 + 0.6 + dx)} ${r(-h + dy)} L${r(-w / 2 - 0.6 + dx)} ${r(-h + dy)} Z" fill="#f6f7f8"/>`;
  k += `<rect x="${r(-w / 2 - 0.6)}" y="${r(-h)}" width="${r(w + 1.2)}" height="2.4" fill="#e3e6e9"/>`;
  k += `<path d="M${r(-w * 0.18 + dx / 2)} ${r(-h + dy / 2)} L${r(w * 0.18 + dx / 2)} ${r(-h + dy / 2)}" stroke="#c9cfd4" stroke-width="2.2" stroke-linecap="round"/>`;
  /* Tragebügel an der linken Seite */
  k += `<path d="M${r(-w / 2 + dx * 0.2)} ${r(-h * 0.75)} Q${r(-w / 2 + dx * 0.5)} ${r(-h * 1.15)} ${r(-w / 2 + dx * 0.8)} ${r(-h * 0.78 + dy)}" stroke="#e8ebee" stroke-width="1.2" fill="none"/>`;
  k += `<rect x="${r(w / 2 - 3)}" y="${r(-h)}" width="2.4" height="${r(h)}" fill="#fff" opacity=".14"/>`;
  S.teil({ oben: true, id: "kuehlbox", de: "die Kühlbox", syl: "KÜHL-box", it: "la borsa frigo", itSyl: "BOR-sa FRI-go", en: "cool box", x: X, y: Y, steht: true, kunst: k,
    tipp: "In Australien heißt die Kühlbox „Esky“. Ohne sie geht niemand zum Picknick." });
}
{
  /* Fish and Chips im offenen weißen Papier mit Zitrone */
  const X = DECKE.x + 8, Y = DECKE.y - 2, s = vorn(Y) / 60;
  const g = (n) => r(n * s);
  let k = `<path d="M${g(-15)} 0 L${g(-11)} ${g(-6.4)} L${g(-17)} ${g(-7.4)} L${g(-21)} ${g(-1)} Z" fill="#1a1a1a" opacity=".16" filter="url(#bw_weich)"/>`;
  k += `<path d="M${g(-15)} 0 L${g(-11)} ${g(-6.4)} L${g(12)} ${g(-7)} L${g(16)} ${g(-0.6)} L${g(3)} ${g(1.6)} Z" fill="#fbfbf6" stroke="#d9d9d0" stroke-width=".3"/>`;
  k += `<path d="M${g(-15)} 0 L${g(-9)} ${g(-1.6)} L${g(3)} ${g(1.6)} Z" fill="#ecece4"/>`;
  for (let i = 0; i < 18; i++) { const x = -8 + rnd() * 10, y = -4.6 + rnd() * 3.4, a = -40 + rnd() * 80; k += `<rect x="${g(x)}" y="${g(y)}" width="${g(4.4)}" height="${g(0.9)}" rx="${g(0.3)}" fill="${rnd() < 0.5 ? "#f2c45a" : "#e6ad3c"}" transform="rotate(${r(a)} ${g(x + 2.2)} ${g(y + 0.45)})"/>`; }
  k += `<path d="M${g(1)} ${g(-2.4)} Q${g(4)} ${g(-6.6)} ${g(10)} ${g(-5)} Q${g(13)} ${g(-3.8)} ${g(11)} ${g(-1.6)} Q${g(6)} ${g(-0.4)} ${g(1)} ${g(-2.4)} Z" fill="${S.rg("teig", [[0, "#f4c56c"], [0.7, "#d99436"], [1, "#b8712a"]], 0.45, 0.35, 0.7)}"/>`;
  for (let i = 0; i < 8; i++) k += `<circle cx="${g(3 + rnd() * 8)}" cy="${g(-4.6 + rnd() * 3)}" r="${g(0.35)}" fill="#fbe2a4" opacity=".8"/>`;
  k += `<path d="M${g(-11)} ${g(-2.2)} Q${g(-9)} ${g(-5)} ${g(-6.6)} ${g(-2.6)} Z" fill="#f6e04a" stroke="#e2c330" stroke-width=".3"/>`;
  S.teil({ oben: true, id: "fish_and_chips", de: "die Fish and Chips", syl: "fish-and-CHIPS", it: "il fish and chips", itSyl: "fish and CIPS", en: "fish and chips", x: X, y: Y, kunst: k,
    tipp: "Fisch im Backteig mit Pommes – am Hafen isst man sie direkt aus dem Papier." });
}
{
  /* Bumerang (flach auf der Decke): zwei Arme mit Knick ≈ 105°, Punktmalerei in Ocker, Weiß und Rot */
  const X = DECKE.x + 34, Y = DECKE.y + 3.4, s = vorn(Y) / 60;
  const fl = (x, y) => [r(x * s), r(y * s * 0.36)];   // flach liegend: Tiefe gestaucht
  const a1 = -8 * Math.PI / 180, a2 = a1 + (180 - 105) * Math.PI / 180;   // Arme vom Knick aus
  const L = 17, Wd = 2.6;
  const arm = (a, sg) => { const ex = Math.cos(a) * L, ey = Math.sin(a) * L, nx = -Math.sin(a) * Wd * sg, ny = Math.cos(a) * Wd * sg; return { ex, ey, nx, ny }; };
  const A = arm(Math.PI + a1, 1), Bm = arm(a2 + Math.PI, -1);
  const pts = [[A.ex + A.nx * 0.5, A.ey + A.ny * 0.5], [0 + A.nx, 0 + A.ny], [Bm.ex + Bm.nx * 0.5, Bm.ey + Bm.ny * 0.5], [Bm.ex - Bm.nx * 0.5, Bm.ey - Bm.ny * 0.5], [-A.nx * 0.6 - Bm.nx * 0.6, -A.ny * 0.6 - Bm.ny * 0.6], [A.ex - A.nx * 0.5, A.ey - A.ny * 0.5]];
  const p = pts.map(([x, y]) => fl(x, y));
  let k = `<path d="M${p[0][0]} ${p[0][1]} Q${p[1][0]} ${p[1][1]} ${p[2][0]} ${p[2][1]} Q${r((Number(p[2][0]) + Number(p[3][0])) / 2 + 0.6)} ${r((Number(p[2][1]) + Number(p[3][1])) / 2)} ${p[3][0]} ${p[3][1]} Q${p[4][0]} ${p[4][1]} ${p[5][0]} ${p[5][1]} Q${r((Number(p[5][0]) + Number(p[0][0])) / 2 - 0.6)} ${r((Number(p[5][1]) + Number(p[0][1])) / 2)} ${p[0][0]} ${p[0][1]} Z" fill="${S.lg("bumerang", [[0, "#a0612e"], [1, "#6e3b18"]])}"/>`;
  for (const [ar, n] of [[A, 9], [Bm, 9]]) for (let i = 1; i <= n; i++) { const t = i / (n + 1), q = fl(ar.ex * t, ar.ey * t); k += `<circle cx="${q[0]}" cy="${q[1]}" r="${r(0.42 * s)}" fill="${["#f4e3c0", "#e3a53a", "#c8442a"][i % 3]}"/>`; }
  for (const [ar, sg] of [[A, 1], [Bm, -1]]) for (let i = 2; i < 8; i += 2) { const t = i / 9, q = fl(ar.ex * t + ar.nx * 0.45, ar.ey * t + ar.ny * 0.45); k += `<circle cx="${q[0]}" cy="${q[1]}" r="${r(0.3 * s)}" fill="#f4e3c0"/>`; }
  k += `<path d="M${p[0][0]} ${p[0][1]} Q${p[1][0]} ${p[1][1]} ${p[2][0]} ${p[2][1]}" stroke="#c88a4a" stroke-width=".35" fill="none" opacity=".7"/>`;
  S.teil({ oben: true, id: "bumerang", de: "der Bumerang", syl: "BU-me-rang", it: "il boomerang", itSyl: "BU-me-rang", en: "boomerang", x: X, y: Y, kunst: k + flaeche(-12 * s, -5, 24 * s, 7),
    tipp: "Der Bumerang ist ein Wurfholz der Aborigines; manche fliegen zurück. Echte Bumerangs mit Punktmalerei kauft man am besten direkt bei Künstlern der Aborigines." });
}
{
  /* Sonnencreme (Tube, LSF 50+) am linken Deckenrand */
  const X = DECKE.x - 44, Y = DECKE.y + 5, s = vorn(Y) / 60;
  const g = (n) => r(n * s);
  let k = `<path d="M${g(-6)} ${g(1)} L${g(4.6)} ${g(-0.6)} L${g(2)} ${g(-1.6)} L${g(-8)} ${g(-0.2)} Z" fill="#1a1a1a" opacity=".2" filter="url(#bw_weich)"/>`;
  k += `<path d="M${g(-6)} ${g(-1)} L${g(4)} ${g(-2.6)} L${g(4.6)} ${g(-0.2)} L${g(-5.6)} ${g(1.2)} Z" fill="#fbf6e6"/>`;
  k += `<path d="M${g(4)} ${g(-2.6)} L${g(6.4)} ${g(-2.8)} L${g(6.8)} ${g(-0.6)} L${g(4.6)} ${g(-0.2)} Z" fill="#f08a1e"/>`;
  k += `<path d="M${g(-4)} ${g(-1)} L${g(2)} ${g(-1.9)} L${g(2.3)} ${g(-0.5)} L${g(-3.7)} ${g(0.4)} Z" fill="#f6c51a"/>`;
  k += `<text x="${g(-1)}" y="${g(-0.1)}" font-size="${g(1.3)}" fill="#c0391b" font-family="Arial,sans-serif" font-weight="bold" transform="rotate(-9 ${g(-1)} ${g(-0.6)})">SPF 50+</text>`;
  S.teil({ oben: true, id: "sonnencreme", de: "die Sonnencreme", syl: "SON-nen-creme", it: "la crema solare", itSyl: "CRE-ma so-LA-re", en: "sunscreen", x: X, y: Y, kunst: k + flaeche(g(-7), g(-4), g(14.4), g(6)),
    tipp: "Auf der Tube steht SPF – auf Deutsch LSF (Lichtschutzfaktor). In Australien nimmt man LSF 50+." });
}
{
  /* Flip-Flops („Thongs“) liegen flach im Gras: ≈ 27 cm lang, Y-Riemen sichtbar, perspektivisch flach */
  const X = 262, Y = 251, s = vorn(Y);
  const lie = (lx, ly) => [r(lx * s), r(-ly * s * 0.35)];
  let k = "";
  for (const [ox, rot, f1, f2] of [[-0.07, -14, "#f6c51a", "#2f6fb6"], [0.07, 9, "#f6c51a", "#2f6fb6"]]) {
    const c = Math.cos(rot * Math.PI / 180), sn = Math.sin(rot * Math.PI / 180);
    const T = (x, y) => lie(ox + x * c - y * sn, x * sn + y * c);
    /* Sohle: Ferse unten (vorn), Zehen oben (hinten) */
    const sohle = [[0, -0.135], [0.042, -0.12], [0.05, -0.04], [0.045, 0.05], [0.052, 0.1], [0.03, 0.135], [-0.01, 0.14], [-0.04, 0.115], [-0.045, 0.05], [-0.04, -0.04], [-0.045, -0.115]].map(([x, y]) => T(x, y));
    k += `<path d="M${sohle.map((p) => p.join(" ")).join(" L")} Z" fill="${f1}" stroke="#c99a10" stroke-width=".25"/>`;
    const innen = [[0, -0.12], [0.034, -0.105], [0.04, 0.04], [0.038, 0.1], [0.02, 0.122], [-0.02, 0.122], [-0.034, 0.1], [-0.033, 0.04], [-0.034, -0.105]].map(([x, y]) => T(x, y));
    k += `<path d="M${innen.map((p) => p.join(" ")).join(" L")} Z" fill="${f2}"/>`;
    /* Y-Riemen: Zehensteg vorn, zwei Riemen zu den Seiten in der Mitte (leicht erhaben) */
    const steg = T(0.003, 0.09), l = T(-0.04, 0.0), rr = T(0.042, 0.0);
    k += `<path d="M${l[0]} ${l[1]} Q${r((Number(l[0]) + Number(steg[0])) / 2)} ${r(Number(steg[1]) - 3)} ${steg[0]} ${steg[1]} Q${r((Number(rr[0]) + Number(steg[0])) / 2)} ${r(Number(steg[1]) - 3)} ${rr[0]} ${rr[1]}" stroke="#1d2f55" stroke-width="${r(0.012 * s)}" fill="none" stroke-linecap="round"/>`;
    k += `<circle cx="${steg[0]}" cy="${steg[1]}" r="${r(0.006 * s)}" fill="#1d2f55"/>`;
  }
  S.teil({ oben: true, id: "flipflops", de: "die Flip-Flops", syl: "FLIP-flops", it: "le infradito", itSyl: "in-fra-DI-to", en: "flip-flops", x: X, y: Y, kunst: k + flaeche(-0.16 * s, -0.08 * s, 0.32 * s, 0.13 * s),
    tipp: "In Australien heißen Flip-Flops „Thongs“." });
}
{
  /* Molukkenibis (Australischer Weißer Ibis): weißer Körper, nackter schwarzer Kopf und Hals, langer gebogener Schnabel */
  const X = 376, Y = 232, s = vorn(Y) / 60 * 1.05;
  const g = (n) => r(n * s);
  let k = schlag(g(10), 0.45, vorn(Y), 0.28);
  k += `<path d="M${g(-1)} 0 L${g(-1.6)} ${g(-11)} M${g(2)} 0 L${g(1.2)} ${g(-11)}" stroke="#2a2a2c" stroke-width="${g(0.9)}" stroke-linecap="round"/>`;
  k += `<path d="M${g(-3.4)} 0 h${g(2.6)} M${g(0.6)} 0 h${g(2.8)}" stroke="#2a2a2c" stroke-width="${g(0.5)}"/>`;
  k += `<path d="M${g(6)} ${g(-19)} Q${g(9)} ${g(-17)} ${g(7)} ${g(-12.6)} Q${g(2)} ${g(-8.6)} ${g(-5)} ${g(-10.4)} Q${g(-10)} ${g(-11.4)} ${g(-11.6)} ${g(-13.6)} Q${g(-8)} ${g(-15.6)} ${g(-3)} ${g(-17.6)} Q${g(2)} ${g(-19.6)} ${g(6)} ${g(-19)} Z" fill="${S.rg("ibis", [[0, "#ffffff"], [0.7, "#eeeeea"], [1, "#cfcdc6"]], 0.6, 0.3, 0.8)}"/>`;
  k += `<path d="M${g(-6)} ${g(-11.2)} Q${g(-10)} ${g(-11)} ${g(-12.6)} ${g(-12.4)} Q${g(-9.6)} ${g(-12.8)} ${g(-6.6)} ${g(-12.6)} Z" fill="#1d1f24"/>`;
  k += `<path d="M${g(-2)} ${g(-15)} Q${g(-6)} ${g(-14.6)} ${g(-8)} ${g(-12.6)}" stroke="#d5d2c8" stroke-width="${g(0.4)}" fill="none"/>`;
  k += `<path d="M${g(5)} ${g(-18.4)} Q${g(9)} ${g(-22)} ${g(10)} ${g(-26)} Q${g(10.6)} ${g(-28.4)} ${g(12.4)} ${g(-28)}" stroke="#1d1f24" stroke-width="${g(1.6)}" fill="none" stroke-linecap="round"/>`;
  k += `<circle cx="${g(12.6)}" cy="${g(-27.8)}" r="${g(1.4)}" fill="#1d1f24"/><circle cx="${g(12.9)}" cy="${g(-28.2)}" r="${g(0.25)}" fill="#8a2a1e"/>`;
  k += `<path d="M${g(13.6)} ${g(-27.6)} Q${g(17.4)} ${g(-26)} ${g(18.2)} ${g(-19.6)}" stroke="#1d1f24" stroke-width="${g(0.8)}" fill="none" stroke-linecap="round"/>`;
  k += `<path d="M${g(9.6)} ${g(-23.4)} q${g(1)} ${g(-1)} ${g(1.4)} ${g(-2.6)}" stroke="#c94a3a" stroke-width="${g(0.4)}" fill="none" opacity=".7"/>`;
  S.teil({ id: "ibis", de: "der Ibis", syl: "I-bis", it: "l'ibis", itSyl: "I-bis", en: "ibis", x: X, y: Y, steht: true, kunst: k,
    tipp: "Der Molukkenibis (Australischer Weißer Ibis) holt sich gern Reste aus dem Picknick – darum heißt er in Sydney „Bin Chicken“." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/sydney.js"));
console.log(aus);
