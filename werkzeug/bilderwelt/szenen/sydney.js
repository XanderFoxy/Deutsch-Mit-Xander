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
     Links liegt der Botanische Garten am Ufer von Farm Cove (Bäume,
     Palmen). Die Hochhäuser der Innenstadt und der Sydney Tower stehen
     weiter links (Südwest, 230–270°) und sind nicht in diesem Blick.
     Die Sonne steht im Nordosten, also hinter dem Betrachter rechts:
     Ostseiten hell, Schatten fallen nach links hinten.
   - OPERNHAUS (Jørn Utzon, eröffnet 1973): drei Gruppen von Schalen auf
     einem Sockel (Podium) aus Beton mit Platten aus rosa Granit (Tarana):
     Konzertsaal (Westen, höchste Schale 67 m über dem Meer), Joan
     Sutherland Theatre (Osten, vorn) und das kleine Restaurant (Südwest).
     Die großen Schalen zeigen mit der Spitze nach Norden (im Bild nach
     rechts), je eine Rückschale nach Süden. Die Schalen sind mit
     1 056 006 Fliesen aus Schweden (Höganäs) bedeckt: glänzend weiß und
     matt cremefarben im Fischgrätmuster, zwischen den Rippen, die vom
     Fußpunkt fächerförmig nach oben laufen. Die Öffnungen sind mit
     bernsteinfarbenem Glas geschlossen. Im Süden die breite Freitreppe
     (Monumental Steps).
   - HARBOUR BRIDGE (1932): Stahlbogen, 503 m Spannweite, Scheitel 134 m
     über dem Meer, Fahrbahn 49 m. Zwei parallele Fachwerkbögen aus 28
     Feldern, Höhe 18 m in der Mitte, 57 m an den Enden. An jedem Ende
     zwei Pylone, 89 m hoch, mit Granit verkleidet (Moruya). Oben am
     Scheitel wehen die australische Flagge und die Flagge der
     Aborigines; Gruppen des BridgeClimb steigen in grauen Anzügen auf
     dem Bogen hinauf.
   - HAFEN: Fähren in Grün und Gold (First-Fleet-Klasse), Segelboote.
   - VORNE: der Felsen aus gelbem Hawkesbury-Sandstein mit Mrs
     Macquarie's Chair (1810 von Sträflingen für Elizabeth Macquarie in
     den Fels gehauen), Gelbhaubenkakadu, Australischer Weißer Ibis
     („Bin Chicken“) an der Picknickdecke mit Fish and Chips, Kühlbox
     („Esky“), Flipflops („Thongs“), Bumerang (Souvenir), Sonnencreme
     („Slip, Slop, Slap“).
   Maßstab: Bild 40° breit (10 Einheiten je Grad), Augenhöhe y = 146
   (6 m über dem Wasser). Ferne Dinge werden mit einer echten
   Zentralprojektion gesetzt (proj). Vorne gilt: Einheiten je Meter =
   (y − 146) / 1,6.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "sydney", titel: "Sydney", emoji: "🦘", thema: "Länder", kuerzel: "syd", fassung: 854, breite: 400, hoehe: 260 });
const rnd = zufall(1973);
const r = B.r;
const HOR = 146, F = 573, EYE = 6;
/* Zentralprojektion: E = Osten, N = Norden (m vom Betrachter), Z = Höhe über dem Meer */
const proj = (E, Nn, Z) => {
  const d = -0.866 * E + 0.5 * Nn, l = 0.5 * E + 0.866 * Nn;
  return [200 + F * l / d, HOR - F * (Z - EYE) / d, d];
};
const P = (p) => `${r(p[0])} ${r(p[1])}`;
const vorn = (y) => (y - HOR) / 1.6;    // Einheiten je Meter auf dem Felsen vorn

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("wolke")}" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="2.2"/></filter>`);
S.def(`<filter id="${S.id("dunst")}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation=".35"/></filter>`);
S.def(`<filter id="${S.id("spiegel")}" x="-10%" y="-20%" width="120%" height="140%"><feGaussianBlur stdDeviation="1.1 .5"/></filter>`);

/* =====================================================================
   KULISSE — Himmel, Nordufer, Botanischer Garten, Felsen und Rasen vorn
   ===================================================================== */
S.hinten(`<rect width="400" height="${HOR + 6}" fill="${S.lg("himmel", [[0, "#2f6fb6"], [0.45, "#6fa3d6"], [0.85, "#bcd7ea"], [1, "#e4eef2"]])}"/>`);
{
  let w = "";
  for (const [x, y, s, g] of [[52, 26, 1.3, 0], [128, 12, 0.9, 1], [318, 22, 1.5, 0], [384, 52, 0.8, 1], [236, 44, 0.7, 1], [24, 70, 0.75, 1]]) {
    w += `<g filter="url(#${S.id("wolke")})">`;
    for (const [dx, dy, rx, ry] of [[0, 0, 18, 6.5], [-12, 2, 12, 5], [12, 1.6, 13, 5.4], [-4, -4.6, 11, 6.2], [7, -5.4, 9, 5.6], [16, -1.6, 7, 4]])
      w += `<ellipse cx="${r(x + dx * s)}" cy="${r(y + dy * s)}" rx="${r(rx * s)}" ry="${r(ry * s)}" fill="${g ? "#f6f9fb" : "#ffffff"}"/>`;
    w += `<ellipse cx="${r(x + 2 * s)}" cy="${r(y + 4.4 * s)}" rx="${r(21 * s)}" ry="${r(2.8 * s)}" fill="#c9d6e2"/></g>`;
  }
  S.hinten(w);
}
/* Nordufer hinter der Brücke: Milsons Point und North Sydney im Morgendunst */
{
  let c = `<g filter="url(#${S.id("dunst")})">`;
  c += `<path d="M236 148.6 L236 141 Q260 137.6 290 139 Q330 135 360 136.4 Q384 133.4 400 134 L400 148.6 Z" fill="${S.lg("nordufer", [[0, "#93a69d"], [1, "#a9b6ad"]])}"/>`;
  /* Hochhäuser von North Sydney und Milsons Point */
  const tuerme = [[328, 9, 22, "#b9c4cc"], [338, 7, 30, "#a8b6c2"], [346, 10, 26, "#c4ccd2"], [357, 6, 38, "#9fb0bf"], [364, 9, 33, "#b6c2cb"], [374, 8, 44, "#a4b4c1"], [383, 7, 36, "#c0cad1"], [391, 9, 29, "#aebcc7"], [244, 7, 10, "#c9cfcf"], [256, 9, 8, "#bfc8c6"], [268, 6, 12, "#c6cccc"], [282, 8, 9, "#bcc6c4"], [296, 7, 11, "#c8cecc"]];
  for (const [x, w, h, f] of tuerme) {
    const y0 = 140 - (x > 320 ? 3 : 0);
    c += `<rect x="${x}" y="${r(y0 - h)}" width="${w}" height="${r(h + 6)}" fill="${f}"/>`;
    c += `<rect x="${x}" y="${r(y0 - h)}" width="${r(w * 0.4)}" height="${r(h + 6)}" fill="#7d8d99" opacity=".25"/>`;
    for (let y = y0 - h + 2; y < y0; y += 2.2) c += `<rect x="${x + 0.6}" y="${r(y)}" width="${r(w - 1.2)}" height=".45" fill="#6f8191" opacity=".35"/>`;
  }
  /* Luna Park und Uferbebauung ganz rechts unten */
  c += `<rect x="236" y="144.6" width="164" height="4" fill="#8a9a92"/>`;
  c += `</g>`;
  S.hinten(c);
}
/* Südufer links: The Rocks im Dunst, davor der Botanische Garten am Ufer von Farm Cove */
{
  let c = `<g filter="url(#${S.id("dunst")})">`;
  c += `<path d="M0 149 L0 128 Q20 126 34 128.6 L40 124 L58 125 L66 129 L86 130 L86 149 Z" fill="#b5b3a8"/>`;
  for (const [x, w, h] of [[2, 9, 17], [12, 7, 13], [21, 10, 20], [33, 8, 15], [44, 11, 18], [57, 7, 14], [66, 9, 12]]) c += `<rect x="${x}" y="${r(140 - h)}" width="${w}" height="${h}" fill="${["#c8bfa9", "#bdb6a6", "#cfc6b3", "#b9b4a8"][x % 4]}"/>`;
  c += `</g>`;
  /* Bäume des Botanischen Gartens: Feigen (breite Kronen) und Palmen */
  let b = "";
  for (let i = 0; i < 26; i++) {
    const x = -4 + i * 3.6 + rnd() * 2, y = 139 + rnd() * 5 - (i > 20 ? (i - 20) * 0.4 : 0), rr = 4.5 + rnd() * 3.5;
    b += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(rr * 1.3)}" ry="${r(rr)}" fill="${["#3f6b3a", "#4b7a41", "#355f33", "#5a8746"][i % 4]}"/>`;
    b += `<ellipse cx="${r(x + rr * 0.35)}" cy="${r(y - rr * 0.35)}" rx="${r(rr * 0.7)}" ry="${r(rr * 0.45)}" fill="#7da45c" opacity=".55"/>`;
  }
  for (const x of [18, 47, 71]) {
    b += `<path d="M${x} 146 Q${x + 0.6} 136 ${x + 0.2} 127" stroke="#6b5a45" stroke-width=".9" fill="none"/>`;
    for (let k = 0; k < 7; k++) { const a = -150 + k * 50; b += `<path d="M${x + 0.2} 127 q${r(Math.cos(a * Math.PI / 180) * 4)} ${r(Math.sin(a * Math.PI / 180) * 3 - 1)} ${r(Math.cos(a * Math.PI / 180) * 7)} ${r(Math.sin(a * Math.PI / 180) * 3 + 2)}" stroke="#4d7a3c" stroke-width="1" fill="none" stroke-linecap="round"/>`; }
  }
  b += `<rect x="0" y="146.5" width="90" height="3" fill="#8f8a7c"/>`;
  S.hinten(c + b);
}

/* =====================================================================
   1 — DIE HARBOUR BRIDGE (Stahlbogen mit Pylonen)
       Lupe: Bogen, Pylon, Flagge, Kletterer
   ===================================================================== */
const SB = [-1220, 466], AU = [0.1736, 0.9848], AW = [0.9848, -0.1736];
const bp = (a, c, Z) => proj(SB[0] + a * AU[0] + c * AW[0], SB[1] + a * AU[1] + c * AW[1], Z);
const zU = (a) => 12 + 104 * (1 - Math.pow((a - 251.5) / 251.5, 2));
const zO = (a) => 134 - 65 * Math.pow((a - 251.5) / 251.5, 2);
const SCHEITEL = bp(251.5, 15, 134);
const bruUnter = [];
{
  let k = "";
  const STAHL = S.lg("bruecke", [[0, "#aeb7bc"], [1, "#7d878d"]]);
  const fach = (c, farbe, licht, dick) => {
    let g = "";
    const N = 28, pts = [...Array(N + 1)].map((_, i) => i * 503 / N);
    const oben = pts.map((a) => bp(a, c, zO(a))), unten = pts.map((a) => bp(a, c, zU(a)));
    /* Füllung zwischen den Gurten ganz leicht (Tiefe) */
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
  /* hinterer (westlicher) Bogen im Dunst, dann die Querverbände, dann der vordere */
  k += `<g opacity=".75">${fach(-15, "#8d989f", null, 1.1)}</g>`;
  for (let i = 0; i <= 28; i += 2) { const a = i * 503 / 28; k += `<path d="M${P(bp(a, -15, zO(a)))} L${P(bp(a, 15, zO(a)))}" stroke="#7f8a90" stroke-width=".45"/>`; }
  /* Fahrbahn mit Hängern (zwischen Unterkante Bogen und Fahrbahn) */
  {
    const L = [-60, 0, 120, 251.5, 380, 503, 560];
    const dO = L.map((a) => bp(a, 24.4, 49)), dU = L.map((a) => bp(a, 24.4, 42.5));
    k += `<path d="M${dO.map(P).join(" L")} L${dU.slice().reverse().map(P).join(" L")} Z" fill="${S.lg("fahrbahn", [[0, "#9aa3a8"], [0.5, "#6e787e"], [1, "#4e575c"]])}"/>`;
    k += `<path d="M${dO.map(P).join(" L")}" stroke="#d6dbdc" stroke-width=".5" fill="none"/>`;
    let h = "";
    for (let i = 1; i < 28; i++) { const a = i * 503 / 28; if (zU(a) > 50) h += `M${P(bp(a, 15, zU(a)))} L${P(bp(a, 15, 49))}`; }
    k += `<path d="${h}" stroke="#6f7a80" stroke-width=".55"/>`;
    /* Geländer und Laternen auf der Fahrbahn */
    let lat = "";
    for (let a = 10; a < 500; a += 36) { const p = bp(a, 24.4, 49), q = bp(a, 24.4, 55); lat += `M${P(p)} L${P(q)}`; }
    k += `<path d="${lat}" stroke="#5d676c" stroke-width=".3"/>`;
  }
  k += fach(15, "#8a959b", "#d8dee0", 1.35);
  /* Pylone (je Ende zwei: der östliche vorn) */
  const pylon = (a0, c0, fern) => {
    let g = "";
    const A = a0 - 10, Bb = a0 + 10, C0 = c0 - 7, C1 = c0 + 7;
    /* sichtbar: Ostseite (hell) und Südseite (Schatten) */
    const ost = [bp(A, C1, 0), bp(Bb, C1, 0), bp(Bb, C1, 82), bp(A, C1, 82)];
    const sued = [bp(A, C0, 0), bp(A, C1, 0), bp(A, C1, 82), bp(A, C0, 82)];
    const kopf = [bp(A + 1.5, C1, 82), bp(Bb - 1.5, C1, 82), bp(Bb - 3, C1, 89), bp(A + 3, C1, 89)];
    g += `<path d="M${sued.map(P).join(" L")} Z" fill="#8f8a7f"/>`;
    g += `<path d="M${ost.map(P).join(" L")} Z" fill="${S.lg("granit", [[0, "#ddd6c6"], [0.6, "#cbc3b1"], [1, "#b2a995"]])}"/>`;
    g += `<path d="M${kopf.map(P).join(" L")} Z" fill="#d9d2c2"/>`;
    /* Bänder und Nischen */
    for (const z of [10, 40, 52, 74]) g += `<path d="M${P(bp(A, C1, z))} L${P(bp(Bb, C1, z))}" stroke="#9c937f" stroke-width=".35"/>`;
    for (const f of [0.3, 0.7]) { const a = A + (Bb - A) * f; g += `<path d="M${P(bp(a, C1, 54))} L${P(bp(a, C1, 72))}" stroke="#8a826f" stroke-width="${fern ? 0.6 : 0.75}"/>`; }
    return g;
  };
  for (const [a, fern] of [[-15, 0], [518, 1]]) { k += pylon(a, -31, fern) + pylon(a, 31, fern); }
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
  /* BridgeClimb: Gruppe in grauen Anzügen steigt auf dem Obergurt zum Scheitel */
  let kl = "";
  for (let i = 0; i < 9; i++) {
    const a = 160 + i * 9, p = bp(a, 15, zO(a) + 1.2);
    kl += `<g transform="translate(${r(p[0])} ${r(p[1])})"><rect x="-.28" y="-1.5" width=".56" height="1.1" rx=".25" fill="${i === 0 ? "#3b6fb0" : "#7b8794"}"/><circle cx="0" cy="-1.75" r=".26" fill="#e9c9a8"/><path d="M-.2 -.45 l-.2 .6 M.2 -.45 l.25 .6" stroke="#5a646e" stroke-width=".22"/></g>`;
  }
  k += kl;
  const pz = bp(251.5, 15, 134);
  bruUnter.push(
    { id: "bogen", de: "der Bogen", syl: "BO-gen", it: "l'arco", itSyl: "AR-co", en: "arch", x: bp(400, 15, 0)[0], y: bp(400, 15, zO(400))[1] + 4,
      kunst: flaeche(-14, -5, 26, 12), tipp: "Der Stahlbogen spannt sich 503 Meter weit über den Hafen." },
    { id: "pylon", de: "der Pylon", syl: "py-LON", it: "il pilone", itSyl: "pi-LO-ne", en: "pylon", x: bp(518, 31, 0)[0], y: bp(518, 31, 0)[1],
      kunst: flaeche(-8, -36, 14, 36), tipp: "Die vier Pylone sind 89 Meter hoch und mit Granit verkleidet. Den Bogen tragen sie nicht." },
    { id: "flagge", de: "die Flagge", syl: "FLAG-ge", it: "la bandiera", itSyl: "ban-DIE-ra", en: "flag", x: pz[0], y: pz[1],
      kunst: flaeche(-5.6, -7.2, 13, 7.6, 0.6), tipp: "Oben wehen die Flagge Australiens und die Flagge der Aborigines." },
    { id: "kletterer", de: "die Kletterer", syl: "KLET-te-rer", it: "gli scalatori", itSyl: "sca-la-TO-ri", en: "climbers", x: bp(196, 15, 0)[0], y: bp(196, 15, zO(196))[1],
      kunst: flaeche(-9, -4.6, 18, 6, 0.6), tipp: "Beim BridgeClimb steigen Besucher angeseilt bis auf 134 Meter über dem Wasser." });
  const zx = SCHEITEL[0];
  S.teil({ id: "harbour_bridge", de: "die Harbour Bridge", syl: "HAR-bour-bridge", it: "l'Harbour Bridge", itSyl: "AR-bur BRID-ge", en: "Sydney Harbour Bridge",
    x: 0, y: 0, kunst: k, tipp: "Die Sydney Harbour Bridge wurde 1932 eröffnet. Die Leute nennen sie „Kleiderbügel“.",
    zoom: { x: r(zx - 58), y: 84, w: 120, h: 78 }, unter: bruUnter });
}

/* =====================================================================
   2 — DAS OPERNHAUS (Sockel, Schalen, Glas) — Lupe: Schale, Fliese,
       Glaswand, Treppe, Sockel
   ===================================================================== */
/* Ortskoordinaten am Opernhaus: s = Meter von der Südkante nach Norden,
   e = Meter von der Westkante nach Osten (Achse 355°) */
const op = (s, e, Z) => proj(-716.8 - 0.087 * s + 0.996 * e, 225.7 + 0.996 * s + 0.087 * e, Z);
const opUnter = [];
{
  let k = "";
  const SOCKEL_Z = 16;
  /* --- der Sockel: Südseite (Treppe) und Ostseite --- */
  const SW = op(0, 0, 0), SE = op(0, 120, 0), NE = op(183, 120, 0);
  const SWt = op(0, 0, SOCKEL_Z), SEt = op(0, 120, SOCKEL_Z), NEt = op(183, 120, SOCKEL_Z);
  const GRANIT = S.lg("opgranit", [[0, "#d7b3a0"], [0.5, "#c69c86"], [1, "#a97f6b"]]);
  /* Freitreppe (Südseite, schräg gesehen): Stufen als feine Bänder */
  const tre0 = op(0, 12, 4), tre1 = op(0, 112, 4);
  k += `<path d="M${P(SW)} L${P(SE)} L${P(SEt)} L${P(SWt)} Z" fill="${S.lg("treppe", [[0, "#e2cbb9"], [1, "#b99a86"]])}"/>`;
  for (let z = 4; z < SOCKEL_Z; z += 1.1) k += `<path d="M${P(op(0, 12, z))} L${P(op(0, 112, z))}" stroke="#9c7f6d" stroke-width=".22" opacity=".8"/>`;
  k += `<path d="M${P(tre0)} L${P(op(0, 12, SOCKEL_Z))}" stroke="#b18f7b" stroke-width=".6"/>`;
  /* Ostseite: Granitplatten, Fugen, Schattenfuge unter der Kante, Promenade am Wasser */
  k += `<path d="M${P(SE)} L${P(NE)} L${P(NEt)} L${P(SEt)} Z" fill="${GRANIT}"/>`;
  for (let z = 3; z < SOCKEL_Z; z += 2.6) k += `<path d="M${P(op(0, 120, z))} L${P(op(183, 120, z))}" stroke="#8e6a58" stroke-width=".22" opacity=".7"/>`;
  for (let s = 6; s < 183; s += 7) k += `<path d="M${P(op(s, 120, 3))} L${P(op(s, 120, SOCKEL_Z - 1.4))}" stroke="#8e6a58" stroke-width=".16" opacity=".55"/>`;
  k += `<path d="M${P(op(0, 120, SOCKEL_Z - 1.2))} L${P(op(183, 120, SOCKEL_Z - 1.2))} L${P(NEt)} L${P(SEt)} Z" fill="#efe1d4"/>`;
  k += `<path d="M${P(op(0, 120, 3))} L${P(op(183, 120, 3))} L${P(NE)} L${P(SE)} Z" fill="#6f5a50"/>`;
  k += `<path d="M${P(op(0, 120, 4.2))} L${P(op(183, 120, 4.2))}" stroke="#e8e2da" stroke-width=".3"/>`;
  /* --- Schalen --- */
  const WEISS = S.lg("schale", [[0, "#ffffff"], [0.55, "#f6f1e6"], [1, "#e2dccf"]], 0, 0, 1, 1);
  const RUECK = S.lg("schaler", [[0, "#e6e2da"], [1, "#fbf8f2"]], 0, 0, 1, 0);
  const MUND = S.lg("mund", [[0, "#5b4a3a"], [0.5, "#8a6438"], [1, "#3e342c"]]);
  let schalenNr = 0;
  /* Eine Schale: Rücken (Grat) b → Spitze t, Lippe t → Fußpunkt p. Rippen fächern vom Fuß zum Grat. */
  const schale = (e, b, t, p, rueck) => {
    const B0 = op(b[0], e, b[1]), T = op(t[0], e, t[1]), Pp = op(p[0], e, SOCKEL_Z);
    const dir = rueck ? -1 : 1;
    /* Grat: kräftig gewölbt; Lippe: leicht hohl */
    const cg = [B0[0] + (T[0] - B0[0]) * 0.18 - dir * 2, T[1] + (B0[1] - T[1]) * 0.12 - 3];
    const cl = [T[0] - dir * (T[0] - Pp[0]) * 0.1 + dir * 1.5, Pp[1] - (Pp[1] - T[1]) * 0.45];
    const d = `M${P(Pp)} L${P(B0)} Q${P(cg)} ${P(T)} Q${P(cl)} ${P(Pp)} Z`;
    const id = S.id("sch" + schalenNr++);
    S.def(`<clipPath id="${id}"><path d="${d}"/></clipPath>`);
    let g = `<path d="${d}" fill="${rueck ? RUECK : WEISS}"/>`;
    g += `<g clip-path="url(#${id})">`;
    /* Fliesen-Rippen: vom Fuß fächerförmig zum Grat; glänzend/matt im Wechsel */
    let rip = "", band = "";
    for (let i = 1; i < 16; i++) {
      const u = i / 16, q = [(1 - u) * (1 - u) * B0[0] + 2 * u * (1 - u) * cg[0] + u * u * T[0], (1 - u) * (1 - u) * B0[1] + 2 * u * (1 - u) * cg[1] + u * u * T[1]];
      rip += `M${P(Pp)} L${P(q)}`;
      if (i % 2) { const u2 = (i + 1) / 16, q2 = [(1 - u2) * (1 - u2) * B0[0] + 2 * u2 * (1 - u2) * cg[0] + u2 * u2 * T[0], (1 - u2) * (1 - u2) * B0[1] + 2 * u2 * (1 - u2) * cg[1] + u2 * u2 * T[1]]; band += `M${P(Pp)} L${P(q)} L${P(q2)} Z`; }
    }
    g += `<path d="${band}" fill="#e9dfc8" opacity=".45"/>`;
    g += `<path d="${rip}" stroke="#cfc6b4" stroke-width=".2" fill="none"/>`;
    /* Licht von rechts hinten: Grat-Kante hell, Lippe im Schatten */
    g += `<path d="M${P(B0)} Q${P(cg)} ${P(T)}" stroke="#fff" stroke-width="1.1" fill="none" opacity=".9"/>`;
    g += `<path d="M${P(T)} Q${P(cl)} ${P(Pp)}" stroke="${rueck ? "#fff" : "#b9b2a4"}" stroke-width="${rueck ? 0.9 : 1.3}" fill="none" opacity=".75"/>`;
    g += `</g>`;
    g += `<path d="M${P(Pp)} L${P(B0)} Q${P(cg)} ${P(T)} Q${P(cl)} ${P(Pp)}" fill="none" stroke="#a9a293" stroke-width=".22"/>`;
    return { svg: g, T, Pp, B0 };
  };
  /* Öffnung (Mund) zwischen Lippe und nächster Schale: Glas in Bernstein */
  const mund = (e, t, p, s2, z2) => {
    const T = op(t[0], e, t[1]), Pp = op(p[0], e, SOCKEL_Z), Q = op(s2, e, z2);
    return `<path d="M${P(Pp)} L${P(T)} L${P(Q)} L${P(op(s2, e, SOCKEL_Z))} Z" fill="${MUND}"/><path d="M${P([(Pp[0] + T[0]) / 2, (Pp[1] + T[1]) / 2])} L${P([(Pp[0] + Q[0]) / 2, Pp[1]])}" stroke="#c9a46a" stroke-width=".25" opacity=".6"/>`;
  };
  /* Westgruppe: Konzertsaal (hinten, etwas heller im Dunst) */
  const CH = 30, JS = 88;
  let ch = "";
  ch += mund(CH, [112, 67], [100], 132, 40) + mund(CH, [136, 56], [124], 156, 34);
  const chB = schale(CH, [74, 30], [44, 46], [56], true);
  const chA3 = schale(CH, [70, 28], [112, 67], [100]);
  const chA2 = schale(CH, [104, 41], [136, 56], [124]);
  const chA1 = schale(CH, [128, 35], [160, 45], [150]);
  ch += chB.svg + chA3.svg + chA2.svg + chA1.svg;
  /* Glaswand des Konzertsaals nach Norden (nur die Kante zu sehen) */
  ch += `<path d="M${P(chA1.T)} L${P(op(180, CH, SOCKEL_Z))} L${P(chA1.Pp)} Z" fill="${MUND}" opacity=".9"/>`;
  k += `<g opacity=".97">${ch}</g>`;
  /* Restaurant (Südwest, klein) */
  const rB = schale(10, [30, 22], [14, 30], [22], true), rA = schale(10, [26, 21], [40, 28], [34]);
  k += mund(10, [40, 28], [34], 46, 18) + rB.svg + rA.svg;
  /* Ostgruppe: Joan Sutherland Theatre (vorn) */
  k += mund(JS, [110, 60], [99], 128, 36) + mund(JS, [132, 50], [122], 152, 30);
  const jB = schale(JS, [72, 27], [48, 41], [58], true);
  const jA3 = schale(JS, [70, 26], [110, 60], [99]);
  const jA2 = schale(JS, [101, 37], [132, 50], [122]);
  const jA1 = schale(JS, [124, 31], [156, 39], [147]);
  k += jB.svg + jA3.svg + jA2.svg + jA1.svg;
  /* Glaswand des Theaters: hängt an der vordersten Schale und knickt nach vorn ab */
  const gw = [jA1.T, op(178, JS, SOCKEL_Z), op(171, JS + 14, SOCKEL_Z), jA1.Pp];
  k += `<path d="M${gw.map(P).join(" L")} Z" fill="${S.lg("glas", [[0, "#c79a5a"], [0.45, "#8a6034"], [1, "#5a3f26"]], 0, 0, 1, 1)}"/>`;
  for (let i = 1; i < 5; i++) { const u = i / 5; k += `<path d="M${P([jA1.T[0] + (gw[1][0] - jA1.T[0]) * u, jA1.T[1] + (gw[1][1] - jA1.T[1]) * u])} L${P([jA1.Pp[0] + (gw[2][0] - jA1.Pp[0]) * u, jA1.Pp[1]])}" stroke="#e0bf86" stroke-width=".2" opacity=".7"/>`; }
  k += `<path d="M${P(jA1.T)} L${P(gw[1])}" stroke="#f3e4c4" stroke-width=".35"/>`;
  /* Spiegelung des Morgenlichts auf den Schalen (vorn rechts) */
  /* Unter-Teile (Lupe) */
  const tipJ = jA3.T, mitteJ = op(92, JS, 40);
  opUnter.push(
    { id: "schale", de: "die Schale", syl: "SCHA-le", it: "il guscio", itSyl: "GU-scio", en: "roof shell", x: chA3.T[0] - 4, y: chA3.T[1] + 16,
      kunst: flaeche(-8, -14, 14, 14), tipp: "Die Dachschalen sehen aus wie Segel. Die höchste ist 67 Meter hoch." },
    { id: "fliese", de: "die Fliese", syl: "FLIE-se", it: "la piastrella", itSyl: "pia-STREL-la", en: "tile", x: mitteJ[0], y: mitteJ[1] + 8,
      kunst: flaeche(-7, -8, 14, 9), tipp: "Über eine Million Fliesen aus Schweden: glänzend weiß und matt cremefarben." },
    { id: "glaswand", de: "die Glaswand", syl: "GLAS-wand", it: "la vetrata", itSyl: "ve-TRA-ta", en: "glass wall", x: (gw[0][0] + gw[2][0]) / 2, y: gw[2][1],
      kunst: flaeche(-7, -15, 14, 15), tipp: "Das Glas ist bernsteinfarben – man schaut durch die Foyers auf den Hafen." },
    { id: "treppe", de: "die Treppe", syl: "TREP-pe", it: "la scalinata", itSyl: "sca-li-NA-ta", en: "steps", x: (SW[0] + SE[0]) / 2 + 3, y: SE[1],
      kunst: flaeche(-14, -13, 26, 13), tipp: "Über die breite Freitreppe im Süden gehen die Besucher hinauf." },
    { id: "sockel", de: "der Sockel", syl: "SO-ckel", it: "il basamento", itSyl: "ba-sa-MEN-to", en: "podium", x: op(120, 120, 0)[0], y: op(120, 120, 0)[1],
      kunst: flaeche(-26, -12, 52, 12), tipp: "Der Sockel ist mit Platten aus rosa Granit verkleidet." });
  const oz = op(90, 60, 30);
  S.teil({ id: "opernhaus", de: "das Opernhaus", syl: "O-pern-haus", it: "il teatro dell'opera", itSyl: "te-A-tro del-L'O-pe-ra", en: "Sydney Opera House",
    x: 0, y: 0, kunst: k, tipp: "Das Sydney Opera House wurde 1973 eröffnet. Seine Dächer sehen aus wie Segel im Wind.",
    zoom: { x: r(oz[0] - 72), y: 90, w: 150, h: 98 }, unter: opUnter });
}

/* =====================================================================
   3 — DER HAFEN (Wasser von Farm Cove und Port Jackson)
   ===================================================================== */
const KANTE = (x) => 190 + Math.sin(x / 23) * 1.6 + (x < 120 ? -2 : 0);
{
  let k = `<path d="M0 147.5 L400 147.5 L400 ${r(KANTE(400))} ${[...Array(21)].map((_, i) => `L${400 - i * 20} ${r(KANTE(400 - i * 20))}`).join(" ")} Z" fill="${S.lg("wasser", [[0, "#5d8fb0"], [0.25, "#2f6f95"], [1, "#1c4f6c"]])}"/>`;
  /* Spiegelungen: Opernhaus (weiß), Brücke (grau), Ufer (grün) */
  k += `<g filter="url(#${S.id("spiegel")})" opacity=".55">`;
  k += `<path d="M120 151 L232 151 L226 166 L132 166 Z" fill="#f4efe4" opacity=".55"/>`;
  k += `<path d="M150 151 L200 151 L190 174 L160 174 Z" fill="#fffaf0" opacity=".45"/>`;
  k += `<rect x="296" y="148.5" width="26" height="9" fill="#6f7a80" opacity=".45"/><rect x="0" y="148" width="90" height="10" fill="#2f5a34" opacity=".55"/>`;
  k += `</g>`;
  let wl = "";
  for (let i = 0; i < 190; i++) {
    const y = 149 + Math.pow(rnd(), 0.8) * 40, w = 1 + (y - 148) * 0.22 * (0.5 + rnd());
    wl += `<path d="M${r(rnd() * 400)} ${r(y)} q${r(w / 2)} -.5 ${r(w)} 0" stroke="${rnd() < 0.6 ? "#cfe3ee" : "#163e56"}" stroke-width="${r(0.15 + (y - 148) * 0.012)}" fill="none" opacity="${r(0.3 + rnd() * 0.45)}"/>`;
  }
  k += wl;
  S.teil({ id: "hafen", de: "der Hafen", syl: "HA-fen", it: "il porto", itSyl: "POR-to", en: "harbour", x: 0, y: 0, kunst: k,
    tipp: "Der Hafen von Sydney (Port Jackson) gilt als einer der schönsten Naturhäfen der Welt." });
}

/* =====================================================================
   4 — DAS SEGELBOOT und 5 — DIE FÄHRE (grün und gold)
   ===================================================================== */
{
  let k = "";
  const boot = (x, y, s, seg) => {
    let g = `<path d="M${r(x - 6 * s)} ${r(y - 1.6 * s)} L${r(x + 7 * s)} ${r(y - 1.6 * s)} Q${r(x + 5.6 * s)} ${r(y)} ${r(x + 3 * s)} ${r(y)} L${r(x - 5 * s)} ${r(y)} Z" fill="#fbfbfa"/>`;
    g += `<rect x="${r(x - 6 * s)}" y="${r(y - 0.6 * s)}" width="${r(12 * s)}" height="${r(0.4 * s)}" fill="#1f4f8f"/>`;
    g += `<line x1="${r(x)}" y1="${r(y - 1.6 * s)}" x2="${r(x)}" y2="${r(y - 19 * s)}" stroke="#d8dcde" stroke-width="${r(0.3 * s)}"/>`;
    g += `<path d="M${r(x + 0.3 * s)} ${r(y - 18.4 * s)} Q${r(x + 6 * s)} ${r(y - 9 * s)} ${r(x + 6.4 * s)} ${r(y - 2.4 * s)} L${r(x + 0.3 * s)} ${r(y - 2.4 * s)} Z" fill="${seg}"/>`;
    g += `<path d="M${r(x - 0.3 * s)} ${r(y - 16 * s)} Q${r(x - 4 * s)} ${r(y - 9 * s)} ${r(x - 5.4 * s)} ${r(y - 2.6 * s)} L${r(x - 0.3 * s)} ${r(y - 2.6 * s)} Z" fill="#f4f6f8"/>`;
    g += `<path d="M${r(x - 5.4 * s)} ${r(y + 0.4 * s)} q${r(6 * s)} .8 ${r(12 * s)} 0" stroke="#fff" stroke-width="${r(0.3 * s)}" fill="none" opacity=".6"/>`;
    return g;
  };
  k += boot(262, 156.5, 1, "#ffffff") + boot(372, 151.2, 0.55, "#f1f4f6");
  S.teil({ id: "segelboot", de: "das Segelboot", syl: "SE-gel-boot", it: "la barca a vela", itSyl: "BAR-ca a VE-la", en: "sailing boat", x: 0, y: 0, kunst: k });
}
{
  /* First-Fleet-Fähre: Doppelender, grüner Rumpf, goldgelbes Deckshaus, Steuerhaus in der Mitte */
  const X = 334, Y = 154.6, s = 1.15;
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

/* =====================================================================
   VORN — Felsen und Rasen (Kulisse liegt vorne über dem Wasser)
   ===================================================================== */
{
  /* Felsplatte aus Sandstein; der Rasen rechts liegt in der Kulisse */
  const RASEN = (x) => KANTE(x) + 9 - (x - 232) * 0.012;
  const rasenRand = [...Array(9)].map((_, i) => 232 + i * 21);
  let k = `<path d="M0 ${r(KANTE(0))} ${[...Array(21)].map((_, i) => `L${i * 20} ${r(KANTE(i * 20))}`).join(" ")} ${rasenRand.slice().reverse().map((x) => `L${x} ${r(RASEN(x))}`).join(" ")} Q210 230 190 260 L0 260 Z" fill="${S.lg("fels", [[0, "#d9b77c"], [0.5, "#c99c5e"], [1, "#a97a43"]])}"/>`;
  /* Schichtung des Hawkesbury-Sandsteins: Bänder und Eisenschlieren */
  for (let i = 0; i < 9; i++) {
    const y = 196 + i * 7 + rnd() * 3;
    k += `<path d="M-2 ${r(y)} Q${r(50 + rnd() * 30)} ${r(y - 3 + rnd() * 6)} ${r(110 + rnd() * 30)} ${r(y + rnd() * 3)} T${r(170 + rnd() * 20 - i * 3)} ${r(y + 1)}" stroke="${["#a8773f", "#e7c88f", "#9a6634"][i % 3]}" stroke-width="${r(0.4 + rnd() * 0.6)}" fill="none" opacity=".55"/>`;
  }
  for (let i = 0; i < 60; i++) { const x = rnd() * 200, y = 194 + rnd() * 66; if (x < 190 - (y - 200) * 0.2) k += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(0.3 + rnd() * 0.8)}" fill="${rnd() < 0.5 ? "#8f6436" : "#f0d9a6"}" opacity=".5"/>`; }
  /* Kante zum Wasser: hellere Oberkante, Sandsteinmauer am Rasen */
  k += `<path d="M0 ${r(KANTE(0))} ${[...Array(21)].map((_, i) => `L${i * 20} ${r(KANTE(i * 20))}`).join(" ")}" stroke="#f0d6a2" stroke-width="1.1" fill="none"/>`;
  k += `<path d="M${rasenRand.map((x) => `${x} ${r(RASEN(x))}`).join(" L")}" stroke="#e2c38a" stroke-width="2" fill="none"/>`;
  /* Rasen von Mrs Macquarie's Point (rechts vorn) – Kulisse */
  let ra = `<path d="M232 ${r(RASEN(232))} ${rasenRand.map((x) => `L${x} ${r(RASEN(x))}`).join(" ")} L400 260 L188 260 Q210 230 232 ${r(RASEN(232))} Z" fill="${S.lg("rasen", [[0, "#7aa64a"], [1, "#4f7f2e"]])}"/>`;
  for (let i = 0; i < 170; i++) { const x = 196 + rnd() * 204, y = 206 + rnd() * 54; if (x > 232 - (y - 206) * 0.8) ra += `<path d="M${r(x)} ${r(y)} l${r(-0.4 + rnd() * 0.8)} ${r(-1 - (y - 200) * 0.03)}" stroke="${rnd() < 0.5 ? "#9cc464" : "#3f6b25"}" stroke-width=".35"/>`; }
  S.hinten(ra);
  S.teil({ id: "sandstein", de: "der Sandstein", syl: "SAND-stein", it: "l'arenaria", itSyl: "a-re-NA-ria", en: "sandstone", x: 0, y: 0, kunst: k,
    tipp: "Sydney steht auf gelbem Sandstein. Auch viele alte Häuser sind daraus gebaut." });
}

/* =====================================================================
   6 — MRS MACQUARIE'S CHAIR (die Steinbank im Fels) und 7 — DIE
       TOURISTIN darauf, 8 — DER KAKADU
   ===================================================================== */
const BANK = { x: 46, y: 196 };
{
  const s = vorn(BANK.y);   // ≈ 31 Einheiten je Meter
  const FELS = S.lg("bankfels", [[0, "#e2c48c"], [0.5, "#cfa365"], [1, "#a8783f"]], 0, 0, 1, 0);
  let k = schatten(4, 0.6, 1.6 * s, 0.12 * s, 0.35);
  /* Felsblock mit eingehauener Sitzbank: Rückwand, Sitz, zwei Wangen */
  const W = 2.5 * s, H = 1.55 * s, sitz = 0.45 * s, tiefe = 0.5 * s;
  k += `<path d="M${r(-W / 2 - 6)} 0 L${r(-W / 2 - 7)} ${r(-H * 0.55)} Q${r(-W / 2 - 6)} ${r(-H * 0.95)} ${r(-W / 2 + 4)} ${r(-H)} Q0 ${r(-H - 4)} ${r(W / 2 - 2)} ${r(-H * 0.98)} Q${r(W / 2 + 7)} ${r(-H * 0.9)} ${r(W / 2 + 8)} ${r(-H * 0.5)} L${r(W / 2 + 9)} 0 Z" fill="${FELS}"/>`;
  /* ausgehauene Nische (Rückenlehne) */
  k += `<path d="M${r(-W / 2 + 3)} ${r(-sitz)} L${r(-W / 2 + 3)} ${r(-H * 0.72)} Q0 ${r(-H * 0.86)} ${r(W / 2 - 3)} ${r(-H * 0.72)} L${r(W / 2 - 3)} ${r(-sitz)} Z" fill="${S.lg("nische", [[0, "#b58852"], [1, "#d4ab70"]])}"/>`;
  /* Sitzfläche (von leicht oben) und Vorderkante */
  k += `<path d="M${r(-W / 2 + 3)} ${r(-sitz)} L${r(W / 2 - 3)} ${r(-sitz)} L${r(W / 2 + 1)} ${r(-sitz + tiefe * 0.3)} L${r(-W / 2 - 1)} ${r(-sitz + tiefe * 0.3)} Z" fill="#e6c995"/>`;
  k += `<path d="M${r(-W / 2 - 1)} ${r(-sitz + tiefe * 0.3)} L${r(W / 2 + 1)} ${r(-sitz + tiefe * 0.3)} L${r(W / 2 + 1.6)} 0 L${r(-W / 2 - 1.6)} 0 Z" fill="#c49456"/>`;
  /* Wangen (Armlehnen) und drei Stufen rechts */
  for (const sx of [-1, 1]) k += `<path d="M${r(sx * (W / 2 - 3))} ${r(-sitz)} L${r(sx * (W / 2 - 3))} ${r(-H * 0.72)} L${r(sx * (W / 2 + 4))} ${r(-H * 0.62)} L${r(sx * (W / 2 + 5))} ${r(-sitz + tiefe * 0.3)} Z" fill="${sx < 0 ? "#b98a50" : "#ddb97f"}"/>`;
  for (let i = 0; i < 3; i++) k += `<rect x="${r(W / 2 + 6 + i * 3.2)}" y="${r(-sitz * (1 - i * 0.33))}" width="${r(3.4)}" height="${r(sitz * (1 - i * 0.33))}" fill="${i % 2 ? "#cfa266" : "#d9b47a"}"/>`;
  /* eingemeißelte Inschrift */
  k += `<text x="0" y="${r(-H * 0.76)}" font-size="2.6" text-anchor="middle" fill="#7d5428" font-family="Georgia,serif" letter-spacing=".5" opacity=".85">MRS MACQUARIES CHAIR</text>`;
  /* Verwitterung und Schichten */
  for (let i = 0; i < 5; i++) k += `<path d="M${r(-W / 2 - 6 + rnd() * 4)} ${r(-H * (0.2 + i * 0.17))} q${r(W * 0.3)} ${r(-1 + rnd() * 2)} ${r(W * 0.5)} ${r(rnd())}" stroke="#9a6a36" stroke-width=".4" fill="none" opacity=".5"/>`;
  k += `<path d="M${r(W / 2 + 7)} ${r(-H * 0.6)} Q${r(W / 2 + 8)} ${r(-H * 0.2)} ${r(W / 2 + 9)} 0" stroke="#f1d6a0" stroke-width="1" fill="none" opacity=".7"/>`;
  S.teil({ id: "steinbank", de: "die Steinbank", syl: "STEIN-bank", it: "la panchina di pietra", itSyl: "pan-CHI-na di PIE-tra", en: "stone bench", x: BANK.x, y: BANK.y, steht: true, kunst: k,
    tipp: "Mrs Macquarie's Chair: 1810 haben Sträflinge diese Bank für Elizabeth Macquarie in den Fels gehauen." });
}
{
  const s = vorn(BANK.y);
  const m = B.mensch({ id: "syd_touristin", geschlecht: "w", pose: "sitzen", blick: 22, frisur: "lang", haarfarbe: "hellbraun", haut: "mittel", laecheln: true,
    kleidung: { oberteil: { stueck: "tshirt", farbe: "#2f8fa0" }, unterteil: { stueck: "shorts", farbe: "beige" }, schuhe: { stueck: "sandale", farbe: "braun" }, kopf: { stueck: "hut", farbe: "#e8dcc0" } } }, 1.66 * s);
  S.teil({ id: "touristin", de: "die Touristin", syl: "tou-RIS-tin", it: "la turista", itSyl: "tu-RI-sta", en: "tourist", x: BANK.x - 4, y: BANK.y + 0.1 * s, kunst: m.svg,
    tipp: "Slip, Slop, Slap: In Australien trägt man Hemd, Sonnencreme und Hut gegen die starke Sonne." });
}
{
  /* Gelbhaubenkakadu auf der rechten Wange des Felsens */
  const s = vorn(BANK.y) / 31 * 0.95;
  let k = "";
  const g = (n) => r(n * s);
  k += `<path d="M${g(-1.4)} ${g(-1)} l${g(-0.4)} ${g(1)} M${g(1)} ${g(-1)} l${g(0.3)} ${g(1)}" stroke="#7d7f86" stroke-width="${g(0.7)}" stroke-linecap="round"/>`;
  /* Schwanz, Körper, Flügel */
  k += `<path d="M${g(-2.6)} ${g(-2.6)} L${g(-6.8)} ${g(1.6)} L${g(-4.6)} ${g(1.8)} L${g(-1.6)} ${g(-1.4)} Z" fill="#f2efe2"/><path d="M${g(-5.6)} ${g(1)} L${g(-3.4)} ${g(-1.6)}" stroke="#efd36a" stroke-width="${g(0.6)}"/>`;
  k += `<path d="M${g(-3.2)} ${g(-2)} Q${g(-3.6)} ${g(-7.6)} ${g(0.6)} ${g(-9)} Q${g(3.6)} ${g(-8.6)} ${g(3)} ${g(-4.6)} Q${g(2.4)} ${g(-1)} ${g(-0.6)} ${g(-0.8)} Q${g(-2.6)} ${g(-1)} ${g(-3.2)} ${g(-2)} Z" fill="${S.rg("kakadu", [[0, "#ffffff"], [0.7, "#f3f1ea"], [1, "#d9d6cc"]], 0.6, 0.35, 0.75)}"/>`;
  k += `<path d="M${g(-2.8)} ${g(-6.4)} Q${g(-1.4)} ${g(-3.4)} ${g(-3.4)} ${g(-1.4)}" stroke="#d3d0c6" stroke-width="${g(0.35)}" fill="none"/>`;
  /* Kopf mit aufgestellter gelber Haube, schwarzer Schnabel, Auge mit hellem Ring */
  k += `<circle cx="${g(1.6)}" cy="${g(-9.6)}" r="${g(2.1)}" fill="#fbfaf5"/>`;
  k += `<path d="M${g(0.6)} ${g(-11.2)} Q${g(-1.4)} ${g(-15.6)} ${g(-2.6)} ${g(-15.2)} Q${g(-0.6)} ${g(-13.2)} ${g(1.4)} ${g(-11.4)} Q${g(0.6)} ${g(-15.8)} ${g(1.6)} ${g(-16.6)} Q${g(2.2)} ${g(-13.6)} ${g(2.6)} ${g(-11)} Z" fill="${S.lg("haube", [[0, "#f7d43a"], [1, "#f0b81e"]])}"/>`;
  k += `<path d="M${g(3.2)} ${g(-10.4)} Q${g(5)} ${g(-10)} ${g(4.4)} ${g(-8)} Q${g(3.6)} ${g(-8.6)} ${g(3.2)} ${g(-8.6)} Z" fill="#26272b"/>`;
  k += `<circle cx="${g(2.2)}" cy="${g(-10.2)}" r="${g(0.55)}" fill="#e8eef2"/><circle cx="${g(2.25)}" cy="${g(-10.2)}" r="${g(0.32)}" fill="#151515"/>`;
  k += `<path d="M${g(2.8)} ${g(-8.4)} q${g(0.6)} ${g(0.4)} ${g(0.2)} ${g(1)}" stroke="#efd36a" stroke-width="${g(0.5)}" fill="none" opacity=".6"/>`;
  const sb = vorn(BANK.y);
  S.teil({ oben: true, id: "kakadu", de: "der Kakadu", syl: "KA-ka-du", it: "il cacatua", itSyl: "ca-ca-TU-a", en: "cockatoo", x: BANK.x + 1.25 * sb + 3, y: BANK.y - 1.55 * sb * 0.6 + 1, kunst: k,
    tipp: "Der Gelbhaubenkakadu lebt mitten in Sydney. Er kreischt laut und stellt seine gelbe Haube auf." });
}

/* =====================================================================
   9 — DIE PICKNICKDECKE auf dem Rasen mit Fish and Chips, Kühlbox,
       Flipflops, Bumerang, Sonnencreme; 10 — DER IBIS
   ===================================================================== */
const DECKE = { x: 318, y: 244 };
{
  const s = vorn(DECKE.y);   // ≈ 61 Einheiten je Meter
  /* Decke 1,6 m × 1,2 m, perspektivisch: hinten schmaler */
  const yH = DECKE.y - 0.55 * s * 0.42, yV = DECKE.y + 0.5 * s * 0.22;
  const pts = [[-0.72 * s, yH - DECKE.y], [0.72 * s, yH - DECKE.y], [0.86 * s, yV - DECKE.y], [-0.86 * s, yV - DECKE.y]];
  let k = schatten(0, yV - DECKE.y + 0.6, 0.86 * s, 1.2, 0.25);
  const d = `M${pts.map((p) => `${r(p[0])} ${r(p[1])}`).join(" L")} Z`;
  S.def(`<clipPath id="${S.id("decke")}"><path d="${d}"/></clipPath>`);
  k += `<path d="${d}" fill="#b8302c"/>`;
  k += `<g clip-path="url(#${S.id("decke")})">`;
  /* Schottenmuster: Streifen in Fluchtperspektive */
  for (let i = -6; i <= 6; i++) { const x0 = i * 0.12 * s, x1 = i * 0.143 * s; k += `<path d="M${r(x0)} ${r(pts[0][1])} L${r(x1)} ${r(pts[2][1])}" stroke="${i % 3 ? "#1f2f5a" : "#e9d9a8"}" stroke-width="${i % 3 ? 2.4 : 0.6}" opacity="${i % 3 ? 0.55 : 0.8}"/>`; }
  for (let j = 0; j < 6; j++) { const y = pts[0][1] + (pts[2][1] - pts[0][1]) * (j / 5.5); k += `<path d="M${r(-0.9 * s)} ${r(y)} L${r(0.9 * s)} ${r(y)}" stroke="${j % 2 ? "#1f2f5a" : "#e9d9a8"}" stroke-width="${j % 2 ? 2 : 0.5}" opacity="${j % 2 ? 0.5 : 0.75}"/>`; }
  k += `</g><path d="${d}" fill="none" stroke="#7a1d1b" stroke-width=".4"/>`;
  /* Fransen vorne */
  for (let x = -0.84 * s; x < 0.84 * s; x += 2) k += `<line x1="${r(x)}" y1="${r(pts[2][1])}" x2="${r(x + 0.2)}" y2="${r(pts[2][1] + 1.6)}" stroke="#9a2a26" stroke-width=".4"/>`;
  S.teil({ id: "picknickdecke", de: "die Picknickdecke", syl: "PICK-nick-de-cke", it: "la coperta da picnic", itSyl: "co-PER-ta da PIC-nic", en: "picnic blanket", x: DECKE.x, y: DECKE.y, kunst: k });
}
{
  /* Kühlbox („Esky“): blau mit weißem Deckel und Griff, hinten links auf der Decke */
  const X = DECKE.x - 30, Y = DECKE.y - 9, s = vorn(Y);
  const w = 0.56 * s, h = 0.38 * s, t = 0.12 * s;
  let k = schatten(2, 0.4, w * 0.6, 1.6, 0.35);
  k += `<path d="M${r(-w / 2)} 0 L${r(-w / 2)} ${r(-h)} L${r(w / 2)} ${r(-h)} L${r(w / 2)} 0 Z" fill="${S.lg("esky", [[0, "#2f74c4"], [1, "#1d4f93"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${r(-w / 2)} ${r(-h)} L${r(-w / 2 + t)} ${r(-h - t * 0.7)} L${r(w / 2 + t)} ${r(-h - t * 0.7)} L${r(w / 2)} ${r(-h)} Z" fill="#f4f6f8"/>`;
  k += `<path d="M${r(w / 2)} 0 L${r(w / 2 + t)} ${r(-t * 0.7)} L${r(w / 2 + t)} ${r(-h - t * 0.7)} L${r(w / 2)} ${r(-h)} Z" fill="#163e75"/>`;
  k += `<rect x="${r(-w / 2 - 0.4)}" y="${r(-h - 1.4)}" width="${r(w + 0.8)}" height="2.2" rx=".6" fill="#ffffff"/>`;
  k += `<path d="M${r(-w * 0.22)} ${r(-h - 1.6)} q${r(w * 0.22)} -3.4 ${r(w * 0.44)} 0" stroke="#e8ecef" stroke-width="1.3" fill="none"/>`;
  k += `<rect x="${r(-w / 2 + 3)}" y="${r(-h * 0.6)}" width="${r(w * 0.4)}" height="${r(h * 0.22)}" rx=".8" fill="#ffffff" opacity=".9"/><text x="${r(-w / 2 + 3 + w * 0.2)}" y="${r(-h * 0.6 + h * 0.17)}" font-size="${r(h * 0.15)}" text-anchor="middle" fill="#1d4f93" font-family="Arial,sans-serif" font-weight="bold">COOL</text>`;
  k += `<rect x="${r(-w / 2)}" y="${r(-h)}" width="${r(w * 0.12)}" height="${r(h)}" fill="#fff" opacity=".18"/>`;
  S.teil({ oben: true, id: "kuehlbox", de: "die Kühlbox", syl: "KÜHL-box", it: "la borsa frigo", itSyl: "BOR-sa FRI-go", en: "cool box", x: X, y: Y, steht: true, kunst: k,
    tipp: "In Australien heißt die Kühlbox „Esky“. Ohne sie geht niemand zum Picknick." });
}
{
  /* Fish and Chips im offenen weißen Papier mit Zitrone */
  const X = DECKE.x + 4, Y = DECKE.y - 2, s = vorn(Y) / 60;
  const g = (n) => r(n * s);
  let k = schatten(0, 0.3, 13 * s, 1.4, 0.25);
  k += `<path d="M${g(-15)} 0 L${g(-11)} ${g(-6.4)} L${g(12)} ${g(-7)} L${g(16)} ${g(-0.6)} L${g(3)} ${g(1.6)} Z" fill="#fbfbf6" stroke="#d9d9d0" stroke-width=".3"/>`;
  k += `<path d="M${g(-15)} 0 L${g(-9)} ${g(-1.6)} L${g(3)} ${g(1.6)} Z" fill="#ecece4"/>`;
  /* Pommes */
  for (let i = 0; i < 18; i++) { const x = -8 + rnd() * 10, y = -4.6 + rnd() * 3.4, a = -40 + rnd() * 80; k += `<rect x="${g(x)}" y="${g(y)}" width="${g(4.4)}" height="${g(0.9)}" rx="${g(0.3)}" fill="${rnd() < 0.5 ? "#f2c45a" : "#e6ad3c"}" transform="rotate(${r(a)} ${g(x + 2.2)} ${g(y + 0.45)})"/>`; }
  /* Fisch im Backteig */
  k += `<path d="M${g(1)} ${g(-2.4)} Q${g(4)} ${g(-6.6)} ${g(10)} ${g(-5)} Q${g(13)} ${g(-3.8)} ${g(11)} ${g(-1.6)} Q${g(6)} ${g(-0.4)} ${g(1)} ${g(-2.4)} Z" fill="${S.rg("teig", [[0, "#f4c56c"], [0.7, "#d99436"], [1, "#b8712a"]], 0.45, 0.35, 0.7)}"/>`;
  for (let i = 0; i < 8; i++) k += `<circle cx="${g(3 + rnd() * 8)}" cy="${g(-4.6 + rnd() * 3)}" r="${g(0.35)}" fill="#fbe2a4" opacity=".8"/>`;
  /* Zitronenschnitz */
  k += `<path d="M${g(-11)} ${g(-2.2)} Q${g(-9)} ${g(-5)} ${g(-6.6)} ${g(-2.6)} Z" fill="#f6e04a" stroke="#e2c330" stroke-width=".3"/>`;
  S.teil({ oben: true, id: "fish_and_chips", de: "die Fish and Chips", syl: "fish-and-CHIPS", it: "il fish and chips", itSyl: "fish and CIPS", en: "fish and chips", x: X, y: Y, kunst: k,
    tipp: "Fisch im Backteig mit Pommes – am Hafen isst man ihn aus dem Papier." });
}
{
  /* Bumerang (Souvenir) mit Punktmalerei in Ockerfarben */
  const X = DECKE.x + 30, Y = DECKE.y + 3, s = vorn(Y) / 60;
  const g = (n) => r(n * s);
  let k = `<path d="M${g(-14)} ${g(-1)} Q${g(-6)} ${g(-7.6)} ${g(1)} ${g(-6)} Q${g(8)} ${g(-7)} ${g(14)} ${g(-1.2)} Q${g(13)} ${g(0.6)} ${g(11)} ${g(-0.4)} Q${g(6)} ${g(-3.6)} ${g(1)} ${g(-3)} Q${g(-5)} ${g(-4.4)} ${g(-11)} ${g(0.2)} Q${g(-13.6)} ${g(1)} ${g(-14)} ${g(-1)} Z" fill="${S.lg("bumerang", [[0, "#9a5a2a"], [1, "#6e3b18"]])}"/>`;
  for (let i = 0; i < 26; i++) { const t = i / 25, x = -12 + t * 24, y = -1.6 - Math.sin(t * Math.PI) * 3.6; k += `<circle cx="${g(x)}" cy="${g(y)}" r="${g(0.38)}" fill="${["#f4e3c0", "#e3a53a", "#c8442a"][i % 3]}"/>`; }
  k += `<path d="M${g(-11)} ${g(-1.8)} Q${g(-5)} ${g(-6.6)} ${g(1)} ${g(-5.2)}" stroke="#c88a4a" stroke-width="${g(0.3)}" fill="none" opacity=".6"/>`;
  S.teil({ oben: true, id: "bumerang", de: "der Bumerang", syl: "BU-me-rang", it: "il boomerang", itSyl: "BU-me-rang", en: "boomerang", x: X, y: Y, kunst: k,
    tipp: "Der Bumerang ist ein Wurfholz der Aborigines. Manche fliegen im Bogen zurück." });
}
{
  /* Sonnencreme (Tube, LSF 50+) */
  const X = DECKE.x - 6, Y = DECKE.y + 4.4, s = vorn(Y) / 60;
  const g = (n) => r(n * s);
  let k = schatten(0, 0.2, 5 * s, 0.8, 0.25);
  k += `<path d="M${g(-6)} ${g(-1)} L${g(4)} ${g(-2.6)} L${g(4.6)} ${g(-0.2)} L${g(-5.6)} ${g(1.2)} Z" fill="#fbf6e6"/>`;
  k += `<path d="M${g(4)} ${g(-2.6)} L${g(6.4)} ${g(-2.8)} L${g(6.8)} ${g(-0.6)} L${g(4.6)} ${g(-0.2)} Z" fill="#f08a1e"/>`;
  k += `<path d="M${g(-4)} ${g(-1)} L${g(2)} ${g(-1.9)} L${g(2.3)} ${g(-0.5)} L${g(-3.7)} ${g(0.4)} Z" fill="#f6c51a"/>`;
  k += `<text x="${g(-1)}" y="${g(-0.1)}" font-size="${g(1.3)}" fill="#c0391b" font-family="Arial,sans-serif" font-weight="bold" transform="rotate(-9 ${g(-1)} ${g(-0.6)})">SPF 50+</text>`;
  S.teil({ oben: true, id: "sonnencreme", de: "die Sonnencreme", syl: "SON-nen-creme", it: "la crema solare", itSyl: "CRE-ma so-LA-re", en: "sunscreen", x: X, y: Y, kunst: k + flaeche(g(-6.4), g(-3.4), g(13.6), g(5)),
    tipp: "Die Sonne in Australien ist sehr stark. Darum gehört Sonnencreme mit LSF 50+ immer dazu." });
}
{
  /* Flipflops („Thongs“) neben der Decke im Gras */
  const X = 262, Y = 252, s = vorn(Y) / 60;
  const g = (n) => r(n * s);
  let k = "";
  for (const [dx, dy, rot] of [[-4, 0, -18], [4, -1.4, 10]]) {
    k += `<g transform="translate(${g(dx)} ${g(dy)}) rotate(${rot})">`;
    k += `<path d="M${g(-2.4)} ${g(-0.6)} Q${g(-3)} ${g(-6)} ${g(0)} ${g(-7.2)} Q${g(3)} ${g(-6)} ${g(2.4)} ${g(-0.6)} Q${g(2)} ${g(1.4)} 0 ${g(1.4)} Q${g(-2)} ${g(1.4)} ${g(-2.4)} ${g(-0.6)} Z" fill="#f6c51a" stroke="#c99a10" stroke-width=".3"/>`;
    k += `<path d="M${g(-2)} ${g(-0.8)} Q${g(-2.4)} ${g(-5.4)} ${g(0)} ${g(-6.4)} Q${g(2.4)} ${g(-5.4)} ${g(2)} ${g(-0.8)} Z" fill="#2f6fb6"/>`;
    k += `<path d="M${g(-1.9)} ${g(-2.2)} Q${g(-0.6)} ${g(-4.6)} ${g(0)} ${g(-5.6)} Q${g(0.6)} ${g(-4.6)} ${g(1.9)} ${g(-2.2)}" stroke="#1d2f55" stroke-width="${g(0.6)}" fill="none"/></g>`;
  }
  S.teil({ oben: true, id: "flipflops", de: "die Flipflops", syl: "FLIP-flops", it: "le infradito", itSyl: "in-fra-DI-to", en: "flip-flops", x: X, y: Y, kunst: k + flaeche(g(-8), g(-9), g(16), g(11)),
    tipp: "In Australien heißen Flipflops „Thongs“." });
}
{
  /* Australischer Weißer Ibis: weißer Körper, nackter schwarzer Kopf und Hals, langer gebogener Schnabel */
  const X = 372, Y = 232, s = vorn(Y) / 60 * 1.05;
  const g = (n) => r(n * s);
  let k = schatten(0, 0.3, 9 * s, 1.2, 0.3);
  k += `<path d="M${g(-1)} 0 L${g(-1.6)} ${g(-11)} M${g(2)} 0 L${g(1.2)} ${g(-11)}" stroke="#2a2a2c" stroke-width="${g(0.9)}" stroke-linecap="round"/>`;
  k += `<path d="M${g(-3.4)} 0 h${g(2.6)} M${g(0.6)} 0 h${g(2.8)}" stroke="#2a2a2c" stroke-width="${g(0.5)}"/>`;
  /* Körper */
  k += `<path d="M${g(6)} ${g(-19)} Q${g(9)} ${g(-17)} ${g(7)} ${g(-12.6)} Q${g(2)} ${g(-8.6)} ${g(-5)} ${g(-10.4)} Q${g(-10)} ${g(-11.4)} ${g(-11.6)} ${g(-13.6)} Q${g(-8)} ${g(-15.6)} ${g(-3)} ${g(-17.6)} Q${g(2)} ${g(-19.6)} ${g(6)} ${g(-19)} Z" fill="${S.rg("ibis", [[0, "#ffffff"], [0.7, "#eeeeea"], [1, "#cfcdc6"]], 0.55, 0.3, 0.8)}"/>`;
  /* schwarze Schmuckfedern am Schwanz */
  k += `<path d="M${g(-6)} ${g(-11.2)} Q${g(-10)} ${g(-11)} ${g(-12.6)} ${g(-12.4)} Q${g(-9.6)} ${g(-12.8)} ${g(-6.6)} ${g(-12.6)} Z" fill="#1d1f24"/>`;
  k += `<path d="M${g(-2)} ${g(-15)} Q${g(-6)} ${g(-14.6)} ${g(-8)} ${g(-12.6)}" stroke="#d5d2c8" stroke-width="${g(0.4)}" fill="none"/>`;
  /* Hals (nackt, schwarz) und Kopf, Schnabel nach unten zur Picknickdecke */
  k += `<path d="M${g(5)} ${g(-18.4)} Q${g(9)} ${g(-22)} ${g(10)} ${g(-26)} Q${g(10.6)} ${g(-28.4)} ${g(12.4)} ${g(-28)}" stroke="#1d1f24" stroke-width="${g(1.6)}" fill="none" stroke-linecap="round"/>`;
  k += `<circle cx="${g(12.6)}" cy="${g(-27.8)}" r="${g(1.4)}" fill="#1d1f24"/><circle cx="${g(12.9)}" cy="${g(-28.2)}" r="${g(0.25)}" fill="#8a2a1e"/>`;
  k += `<path d="M${g(13.6)} ${g(-27.6)} Q${g(17.4)} ${g(-26)} ${g(18.2)} ${g(-19.6)}" stroke="#1d1f24" stroke-width="${g(0.8)}" fill="none" stroke-linecap="round"/>`;
  k += `<path d="M${g(9.6)} ${g(-23.4)} q${g(1)} ${g(-1)} ${g(1.4)} ${g(-2.6)}" stroke="#c94a3a" stroke-width="${g(0.4)}" fill="none" opacity=".7"/>`;
  S.teil({ id: "ibis", de: "der Ibis", syl: "I-bis", it: "l'ibis", itSyl: "I-bis", en: "ibis", x: X, y: Y, steht: true, kunst: k,
    tipp: "Der Weiße Ibis lebt überall in Sydney. Er holt sich gern Reste aus dem Picknick – darum heißt er „Bin Chicken“." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/sydney.js"));
console.log(aus);
