#!/usr/bin/env node
/* =====================================================================
   FRANKREICH (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   RECHERCHE (Stadtpläne Paris, Blick von der Place de la Concorde,
   Guimard-Eingänge der Métro, Pariser Cafés und Colonnes Morris):
   - Von der Place de la Concorde schaut man nach Westen die Avenue des
     Champs-Élysées hinauf (gut 2 km, Kastanienbäume in Reihen): ganz
     hinten in der Mitte der TRIUMPHBOGEN (50 m hoch, ein großer
     Mittelbogen, oben die Attika). Links über den Bäumen der Gärten
     steht der EIFFELTURM (330 m, vier gespreizte Füße mit großem Bogen,
     drei Etagen, nach oben immer schlanker, bronzebraun).
   - Die MÉTRO-Eingänge von Hector Guimard (um 1900): grünes Gusseisen,
     ein Geländer um die Treppe, zwei geschwungene Stiele wie
     Maiglöckchen mit orangeroten Lampen, dazwischen das Schild
     „METROPOLITAIN“.
   - Das Pariser CAFÉ: Ladenfront in Dunkelgrün mit goldener Schrift,
     rote Markise, die Rattanstühle stehen in Reihen und schauen auf die
     Straße, kleine runde Tische mit Marmorplatte. Auf dem Tisch:
     Croissant, Café crème, ein Glas Rotwein, Käse (Camembert, Brie).
     Der Kellner („Garçon“) trägt Weste, Fliege und lange weiße Schürze.
     Lavendel in Pflanzkästen, ein Aushängeschild mit dem gallischen
     HAHN, dem Wappentier Frankreichs; die Trikolore an der Fassade.
   - Die COLONNE MORRIS: grüne Litfaßsäule mit kleiner Kuppel; Plakate
     für Theater und Ausflüge (hier: das SCHLOSS Chambord an der Loire).
   - Ein Hollandrad mit Korb und BAGUETTE lehnt an der Säule.
   BLICK: Augenhöhe 1,6 m, Horizont y = 100, Fluchtpunkt x = 128 (der
   Triumphbogen). Einheiten je Meter am Boden: s(y) = (y − 100) / 1,6
   (Café-Front y 142: 26; Säule y 152: 32; Tisch y 182: 51).
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "frankreich", titel: "Frankreich", emoji: "🇫🇷", thema: "Länder", kuerzel: "b24c", fassung: 852 });
const rnd = zufall(1889);
const r = B.r;
const HY = 100, VX = 128;
const um = (ox, oy, svg) => `<g transform="translate(${r(-ox)} ${r(-oy)})">${svg}</g>`;
const knapp = (svg) => svg.replace(/ (d|x1|y1|x2|y2|cx|cy|rx|ry)="([^"]*)"/g, (m, a, v) => ` ${a}="${v.replace(/-?\d+\.\d+/g, (n) => String(Math.round(+n)))}"`);
B.mensch({}, 10);

/* ---------- Stoffe ---------------------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("dunst")}" x="-30%" y="-50%" width="160%" height="200%"><feGaussianBlur stdDeviation="1.3"/></filter>`);
S.def(`<pattern id="${S.id("gitter")}" width="2.4" height="2.4" patternUnits="userSpaceOnUse"><path d="M0 0 L2.4 2.4 M2.4 0 L0 2.4" stroke="#5a4a3a" stroke-width=".35"/></pattern>`);
S.def(`<pattern id="${S.id("rattan")}" width="2" height="2" patternUnits="userSpaceOnUse"><rect width="2" height="2" fill="#f1ead6"/><rect width="1" height="1" fill="#2f5d8a"/><rect x="1" y="1" width="1" height="1" fill="#2f5d8a"/></pattern>`);
S.def(`<pattern id="${S.id("pave")}" width="6" height="3" patternUnits="userSpaceOnUse"><rect width="6" height="3" fill="#a9a59c"/><rect x=".2" y=".2" width="2.6" height="1.2" rx=".4" fill="#b8b4aa"/><rect x="3.2" y=".2" width="2.6" height="1.2" rx=".4" fill="#b2aea4"/><rect x="1.7" y="1.7" width="2.6" height="1.2" rx=".4" fill="#bbb7ad"/><rect x="-1.3" y="1.7" width="2.6" height="1.2" rx=".4" fill="#afaba1"/><rect x="4.7" y="1.7" width="2.6" height="1.2" rx=".4" fill="#afaba1"/></pattern>`);
const GUSS = S.lg("guss", [[0, "#5f8a6a"], [0.5, "#3f6a4e"], [1, "#2c4f39"]], 0, 0, 1, 0);
const LACKGRUEN = S.lg("lackgruen", [[0, "#24493a"], [1, "#163327"]]);
const KALK = S.lg("kalk", [[0, "#efe6d2"], [1, "#d9cdb4"]]);

/* =====================================================================
   KULISSE — Himmel, Fahrbahn der Avenue, Pflaster der Place
   ===================================================================== */
{
  let k = `<rect width="320" height="104" fill="${S.lg("himmel", [[0, "#6f9fcf"], [0.6, "#a9c7e2"], [1, "#e4e2d8"]])}"/>`;
  for (const [x, y, w] of [[60, 16, 30], [190, 10, 24], [250, 30, 18]]) k += `<g filter="url(#${S.id("dunst")})" opacity=".9"><ellipse cx="${x}" cy="${y}" rx="${w}" ry="${r(w * 0.13)}" fill="#fff"/><ellipse cx="${x - w * 0.3}" cy="${r(y - w * 0.1)}" rx="${r(w * 0.4)}" ry="${r(w * 0.15)}" fill="#fff"/><ellipse cx="${x + w * 0.25}" cy="${r(y - w * 0.08)}" rx="${r(w * 0.35)}" ry="${r(w * 0.12)}" fill="#fff"/></g>`;
  /* ferne Häuserzeile am Ende der Avenue */
  k += `<path d="M96 100 L96 95 L160 95 L160 100 Z" fill="#c9c3b6"/>`;
  /* Boden: Pflaster der Place */
  k += `<rect x="0" y="100" width="320" height="100" fill="url(#${S.id("pave")})"/>`;
  /* Fahrbahn der Champs-Élysées (Asphalt, 26 m breit) — beginnt hinter der Place */
  const sy = (y) => (y - HY) / 1.6;
  k += `<path d="M${VX - 1} 100 L${VX + 1} 100 L${r(VX + 13 * sy(122))} 122 L${r(VX - 13 * sy(122))} 122 Z" fill="${S.lg("asphalt", [[0, "#9a9b9c"], [1, "#6c6f71"]])}"/>`;
  for (const X of [-8.7, -4.3, 4.3, 8.7]) k += `<line x1="${VX}" y1="100" x2="${r(VX + X * sy(115))}" y2="115" stroke="#eeece4" stroke-width=".45" stroke-dasharray="2 2.6" opacity=".75"/>`;
  /* Zebrastreifen an der Einmündung in die Place */
  for (let X = -12; X < 12.5; X += 1.2) k += `<path d="M${r(VX + X * sy(116.4))} 116.4 L${r(VX + (X + 0.6) * sy(116.4))} 116.4 L${r(VX + (X + 0.6) * sy(121.4))} 121.4 L${r(VX + X * sy(121.4))} 121.4 Z" fill="#efeee8" opacity=".85"/>`;
  /* Bordstein: dahinter Fahrbahn, davor das Pflaster der Place */
  /* Fugenbild der Place in Fluchtperspektive (Reihen werden nach vorn breiter) */
  for (let i = -40; i <= 40; i++) k += `<line x1="${r(VX + i * 1.4 * sy(124))}" y1="124" x2="${r(VX + i * 1.4 * sy(200))}" y2="200" stroke="#8f8b82" stroke-width=".3" opacity=".55"/>`;
  for (let y = 126, d = 1.6; y < 200; y += d, d *= 1.16) k += `<line x1="0" y1="${r(y)}" x2="320" y2="${r(y)}" stroke="#8f8b82" stroke-width=".3" opacity=".5"/>`;
  k += `<rect x="0" y="122" width="320" height="1.6" fill="#d9d5cb"/><rect x="0" y="123.6" width="320" height=".6" fill="#8a867c"/>`;
  k += `<rect x="0" y="100" width="320" height="100" fill="${S.lg("bodenlicht", [[0, "#fff", 0.15], [0.3, "#fff", 0], [1, "#000", 0.12]])}"/>`;
  S.hinten(k);
}

/* =====================================================================
   1 — DER EIFFELTURM (links über den Bäumen)
   ===================================================================== */
{
  const X = 92, Y = 100, H = 88, BW = 16;
  const w = (t) => Math.max(0.6, BW * Math.pow(1 - t, 2.3));
  let aussen = `M${r(X - w(0))} ${Y}`;
  for (let i = 1; i <= 20; i++) { const t = i / 20; aussen += ` L${r(X - w(t))} ${r(Y - H * t)}`; }
  aussen += ` L${X} ${Y - H - 4}`;
  for (let i = 20; i >= 0; i--) { const t = i / 20; aussen += ` L${r(X + w(t))} ${r(Y - H * t)}`; }
  aussen += " Z";
  /* großer Bogen zwischen den Füßen */
  const bogen = `M${r(X - w(0) + 5)} ${Y} Q${r(X - w(0) + 5.6)} ${r(Y - H * 0.14)} ${X} ${r(Y - H * 0.15)} Q${r(X + w(0) - 5.6)} ${r(Y - H * 0.14)} ${r(X + w(0) - 5)} ${Y} Z`;
  const cid = S.id("eiffelclip");
  let k = `<clipPath id="${cid}"><path d="${aussen} ${bogen}" clip-rule="evenodd"/></clipPath>`;
  k += `<g clip-path="url(#${cid})"><rect x="${X - BW - 2}" y="${Y - H - 5}" width="${BW * 2 + 4}" height="${H + 6}" fill="${S.lg("eisen", [[0, "#8a7a64"], [0.5, "#6e5e4a"], [1, "#5a4a38"]], 0, 0, 1, 0)}" opacity=".55"/>`;
  k += `<rect x="${X - BW - 2}" y="${Y - H - 5}" width="${BW * 2 + 4}" height="${H + 6}" fill="url(#${S.id("gitter")})"/></g>`;
  k += `<path d="${aussen}" fill="none" stroke="#4e3f30" stroke-width=".7"/><path d="${bogen}" fill="none" stroke="#4e3f30" stroke-width=".6"/>`;
  /* Kanten der Pfeiler (innen) */
  k += `<path d="M${r(X - w(0) + 5)} ${Y} Q${r(X - 3)} ${r(Y - H * 0.4)} ${X - 0.6} ${r(Y - H * 0.84)} M${r(X + w(0) - 5)} ${Y} Q${r(X + 3)} ${r(Y - H * 0.4)} ${X + 0.6} ${r(Y - H * 0.84)}" stroke="#4e3f30" stroke-width=".5" fill="none"/>`;
  /* drei Etagen */
  for (const [t, ex] of [[0.17, 1.4], [0.35, 1], [0.84, 0.6]]) k += `<rect x="${r(X - w(t) - ex)}" y="${r(Y - H * t - 1.3)}" width="${r(2 * w(t) + 2 * ex)}" height="1.6" fill="#4e3f30"/>`;
  k += `<rect x="${X - 0.4}" y="${Y - H - 9}" width=".8" height="6" fill="#4e3f30"/>`;
  k += `<path d="M${r(X + w(0.1))} ${r(Y - H * 0.1)} L${X + 0.6} ${Y - H}" stroke="#d8c8a8" stroke-width=".5" opacity=".6"/>`;
  S.teil({ id: "eiffelturm", de: "der Eiffelturm", syl: "EIF-fel-turm", it: "la Torre Eiffel", itSyl: "TOR-re EIF-fel", en: "Eiffel Tower", x: X, y: Y, kunst: um(X, Y, k),
    tipp: "Der Eiffelturm ist 330 Meter hoch. Er wurde 1889 für die Weltausstellung gebaut." });
}

/* =====================================================================
   2 — DER TRIUMPHBOGEN (am Ende der Avenue)
   ===================================================================== */
{
  const X = VX, Y = 100, H = 26, W = 24;
  let k = `<rect x="${-W / 2}" y="${-H}" width="${W}" height="${H}" fill="${S.lg("arc", [[0, "#e8e0cf"], [1, "#cfc4ad"]], 0, 0, 1, 0)}"/>`;
  /* Attika und Gesims */
  k += `<rect x="${-W / 2 - 0.6}" y="${-H - 0.6}" width="${W + 1.2}" height="1.4" fill="#d8cfbc"/><rect x="${-W / 2}" y="${-H + 0.8}" width="${W}" height="4.4" fill="#ddd4c1"/>`;
  for (let i = 0; i < 9; i++) k += `<rect x="${r(-W / 2 + 1 + i * 2.6)}" y="${-H + 2}" width="1.4" height="1.8" fill="#bfb49e"/>`;
  k += `<rect x="${-W / 2 - 0.4}" y="${-H + 5.2}" width="${W + 0.8}" height="1.2" fill="#c8bda7"/><rect x="${-W / 2}" y="${-H + 6.4}" width="${W}" height="1.6" fill="#bfb49e" opacity=".6"/>`;
  /* großer Mittelbogen */
  k += `<path d="M-4.2 0 L-4.2 ${-H * 0.42} A4.2 4.2 0 0 1 4.2 ${-H * 0.42} L4.2 0 Z" fill="${S.lg("bogeninnen", [[0, "#8a8476"], [1, "#a7a092"]])}"/>`;
  k += `<path d="M-4.2 ${-H * 0.42} A4.2 4.2 0 0 1 4.2 ${-H * 0.42}" stroke="#bfb49e" stroke-width=".6" fill="none"/>`;
  /* Reliefgruppen auf den Pfeilern */
  for (const sx of [-1, 1]) {
    k += `<path d="M${sx * 6.4} -3 q${sx * 2} -6 ${sx * 1} -10 q${sx * 1.6} 2 ${sx * 3} 0 l0 10 Z" fill="#b5aa93" opacity=".9"/>`;
    k += `<rect x="${sx > 0 ? 5.6 : -10.6}" y="${-H + 9.6}" width="5" height="3" fill="#c3b8a1"/>`;
  }
  /* die Trikolore unter dem Bogen */
  k += `<path d="M-1.6 ${-H * 0.42 - 2} h3.2 v6 h-3.2 Z" fill="#f4f4f0"/><path d="M-1.6 ${-H * 0.42 - 2} h1.07 v6 h-1.07 Z" fill="#1f3d8a"/><path d="M.53 ${-H * 0.42 - 2} h1.07 v6 h-1.07 Z" fill="#cf2a33"/>`;
  k += `<rect x="${-W / 2}" y="${-H}" width="${W}" height="${H}" fill="#e4e2d8" opacity=".18"/>`;
  S.teil({ id: "triumphbogen", de: "der Triumphbogen", syl: "Tri-UMPH-bo-gen", it: "l'Arco di Trionfo", itSyl: "AR-co di tri-ON-fo", en: "Arc de Triomphe", x: X, y: Y, kunst: k,
    tipp: "Der Triumphbogen steht am oberen Ende der Champs-Élysées. Er ist 50 Meter hoch." });
}

/* =====================================================================
   3 — DIE ALLEE (Kastanienbäume links und rechts der Avenue)
   ===================================================================== */
{
  let k = "";
  const reihe = (x0, y0top, x1, y1top) => {
    let g = "";
    const n = 14;
    for (let i = n; i >= 0; i--) {
      const t = i / n, x = x0 + (x1 - x0) * t, top = y0top + (y1top - y0top) * t, fuss = 104 - t * 4, h = fuss - top;
      g += `<rect x="${r(x - h * 0.03)}" y="${r(fuss - h * 0.3)}" width="${r(Math.max(0.5, h * 0.06))}" height="${r(h * 0.3)}" fill="#4a3c30"/>`;
      for (let j = 0; j < 4; j++) g += `<ellipse cx="${r(x + (rnd() - 0.5) * h * 0.5)}" cy="${r(top + h * (0.25 + rnd() * 0.25))}" rx="${r(h * (0.32 + rnd() * 0.12))}" ry="${r(h * (0.26 + rnd() * 0.08))}" fill="${["#4d6b3c", "#5a7a44", "#42603a", "#668550"][(i + j) % 4]}"/>`;
    }
    return g;
  };
  k += reihe(20, 62, 118, 94) + reihe(198, 64, 138, 94);
  /* Laternen der Avenue */
  for (let i = 0; i < 6; i++) { const t = i / 6, x = 20 + (118 - 20) * Math.pow(t, 0.7), y = 106 - t * 6, h = 14 * (1 - t * 0.8); k += `<line x1="${r(x + 4)}" y1="${r(y)}" x2="${r(x + 4)}" y2="${r(y - h)}" stroke="#2a2a2a" stroke-width="${r(0.5 * (1 - t * 0.6))}"/><circle cx="${r(x + 4)}" cy="${r(y - h)}" r="${r(1 * (1 - t * 0.6))}" fill="#f2e2b0"/>`; }
  S.teil({ id: "allee", de: "die Allee", syl: "Al-LEE", it: "il viale", itSyl: "VIA-le", en: "avenue", x: 110, y: 106, kunst: um(110, 106, k),
    tipp: "Die Champs-Élysées sind eine breite Allee mit Bäumen, Geschäften und Cafés." });
}

/* =====================================================================
   4 — DAS CAFÉ (Ladenfront mit Markise)
   ===================================================================== */
const CAFE = { x0: 196, x1: 320, boden: 142 };
{
  let k = `<rect x="${CAFE.x0}" y="0" width="${CAFE.x1 - CAFE.x0}" height="${CAFE.boden}" fill="${KALK}"/>`;
  /* Steinfugen und Balkon im 1. Stock */
  for (let y = 4; y < 38; y += 5) k += `<line x1="${CAFE.x0}" y1="${y}" x2="${CAFE.x1}" y2="${y}" stroke="#c9bc9f" stroke-width=".3"/>`;
  for (const wx of [212, 262]) {
    k += `<rect x="${wx - 1.4}" y="0" width="${26.8}" height="34" fill="#cbbfa4"/>`;
    k += `<rect x="${wx}" y="0" width="24" height="33" fill="${S.lg("fenster", [[0, "#8aa3b5"], [1, "#4f6779"]])}"/>`;
    k += `<line x1="${wx + 12}" y1="0" x2="${wx + 12}" y2="33" stroke="#f2ede2" stroke-width="1"/>`;
    for (const y of [8, 16, 24]) k += `<line x1="${wx}" y1="${y}" x2="${wx + 24}" y2="${y}" stroke="#f2ede2" stroke-width=".6"/>`;
    k += `<path d="M${wx + 1} 1 L${wx + 9} 1 L${wx + 1} 14 Z" fill="#fff" opacity=".2"/>`;
  }
  /* schmiedeeiserner Balkon über die ganze Front */
  k += `<rect x="${CAFE.x0}" y="34" width="${CAFE.x1 - CAFE.x0}" height="2.4" fill="#cfc3a8"/>`;
  k += `<rect x="${CAFE.x0 + 2}" y="26" width="${CAFE.x1 - CAFE.x0 - 2}" height=".9" fill="#1d1d1f"/>`;
  for (let x = CAFE.x0 + 3; x < CAFE.x1; x += 3) k += `<path d="M${x} 26.6 L${x} 34 M${x} 29 q1.5 -1.6 3 0 q-1.5 1.6 -3 0" stroke="#1d1d1f" stroke-width=".35" fill="none"/>`;
  /* Ladenfront: dunkelgrün lackiert, goldene Schrift */
  k += `<rect x="${CAFE.x0}" y="36.4" width="${CAFE.x1 - CAFE.x0}" height="${CAFE.boden - 36.4}" fill="${LACKGRUEN}"/>`;
  k += `<rect x="${CAFE.x0 + 2}" y="38" width="${CAFE.x1 - CAFE.x0 - 2}" height="9" fill="#173428" stroke="#c9a54a" stroke-width=".4"/>`;
  k += `<text x="${(CAFE.x0 + CAFE.x1) / 2 + 1}" y="45.2" font-size="6.4" text-anchor="middle" fill="${S.lg("goldschrift", [[0, "#f6dc8a"], [1, "#b8892c"]])}" font-family="Georgia,'Times New Roman',serif" letter-spacing="1.4">CAFÉ DU COQ</text>`;
  /* Schaufenster mit warmem Innenlicht: Theke, Spiegel, Lampen */
  for (const [x0, x1] of [[200, 252], [276, 318]]) {
    k += `<rect x="${x0}" y="62" width="${x1 - x0}" height="62" fill="${S.lg("innen", [[0, "#7a4a2a"], [0.6, "#a8683a"], [1, "#5a3420"]])}"/>`;
    k += `<rect x="${x0 + 3}" y="66" width="${x1 - x0 - 6}" height="14" fill="#c9b07a" opacity=".55"/>`;
    for (let x = x0 + 8; x < x1 - 4; x += 14) k += `<circle cx="${x}" cy="66" r="1.6" fill="#fff2c8"/><circle cx="${x}" cy="66" r="5" fill="#ffe7a8" opacity=".25"/>`;
    k += `<rect x="${x0}" y="100" width="${x1 - x0}" height="3" fill="#3a2414"/><rect x="${x0}" y="103" width="${x1 - x0}" height="21" fill="#4a2c18" opacity=".7"/>`;
    k += `<path d="M${x0 + 2} 62 L${x0 + 14} 62 L${x0 + 2} 90 Z" fill="#fff" opacity=".14"/><path d="M${x1 - 18} 124 L${x1 - 10} 124 L${x1 - 2} 90 L${x1 - 2} 100 Z" fill="#fff" opacity=".08"/>`;
    k += `<rect x="${x0}" y="62" width="${x1 - x0}" height="62" fill="none" stroke="#c9a54a" stroke-width=".4"/>`;
  }
  /* Tür in der Mitte */
  k += `<rect x="255" y="62" width="18" height="${CAFE.boden - 62}" fill="${S.lg("tuer", [[0, "#3a2414"], [1, "#24160c"]])}"/><rect x="257" y="64" width="14" height="40" fill="#8a5a32" opacity=".5"/><rect x="268" y="102" width="1.2" height="8" rx=".5" fill="#c9a54a"/>`;
  /* Sockel */
  k += `<rect x="${CAFE.x0}" y="124" width="${CAFE.x1 - CAFE.x0}" height="${CAFE.boden - 124}" fill="#173428"/><rect x="${CAFE.x0}" y="124" width="${CAFE.x1 - CAFE.x0}" height="1" fill="#c9a54a" opacity=".6"/>`;
  /* Markise: rot, ausgestellt, mit Volant und Schrift */
  k += `<path d="M${CAFE.x0} 50 L${CAFE.x1} 50 L${CAFE.x1 + 2} 62 L${CAFE.x0 - 4} 62 Z" fill="${S.lg("markise", [[0, "#8a1c22"], [1, "#b8323a"]])}"/>`;
  for (let x = CAFE.x0 + 6; x < CAFE.x1; x += 8) k += `<line x1="${x}" y1="50" x2="${r(x - 4 + (x - 258) * 0.02)}" y2="62" stroke="#6e1218" stroke-width=".4" opacity=".6"/>`;
  k += `<rect x="${CAFE.x0 - 4}" y="62" width="${CAFE.x1 - CAFE.x0 + 6}" height="5" fill="#a8262e"/><text x="${(CAFE.x0 + CAFE.x1) / 2}" y="65.9" font-size="3.4" text-anchor="middle" fill="#f6efe2" font-family="Georgia,serif" letter-spacing="1.2">CAFÉ · BRASSERIE · DEPUIS 1902</text>`;
  k += `<rect x="${CAFE.x0 - 4}" y="67" width="${CAFE.x1 - CAFE.x0 + 6}" height="3" fill="#000" opacity=".12"/>`;
  S.teil({ id: "cafe", de: "das Café", syl: "ca-FÉ", it: "il caffè", itSyl: "caf-FÈ", en: "café", x: (CAFE.x0 + CAFE.x1) / 2, y: CAFE.boden, steht: true, kunst: um((CAFE.x0 + CAFE.x1) / 2, CAFE.boden, k),
    tipp: "Im Pariser Café schauen die Stühle auf die Straße – man sitzt und schaut den Leuten zu." });
}

/* =====================================================================
   5 — DIE FLAGGE (Trikolore an der Fassade)
   ===================================================================== */
{
  let k = `<rect x="-1.2" y="-1.2" width="2.4" height="2.4" fill="#2a2a2a"/><line x1="0" y1="0" x2="-16" y2="-12" stroke="#2a2a2a" stroke-width=".9"/><circle cx="-16.4" cy="-12.3" r=".9" fill="#c9a54a"/>`;
  const bahn = (a, c) => `<path d="M${r(-4.4 - a)} ${r(-3.3 - a * 0.75)} L${r(-4.4 - a - 3.6)} ${r(-3.3 - (a + 3.6) * 0.75)} Q${r(-9 - a)} ${r(4 - a * 0.4)} ${r(-8.6 - a - 3.4)} ${r(13 - (a + 3.6) * 0.6)} L${r(-8.6 - a)} ${r(13 - a * 0.6)} Q${r(-5 - a)} ${r(5 - a * 0.5)} ${r(-4.4 - a)} ${r(-3.3 - a * 0.75)} Z" fill="${c}"/>`;
  k += bahn(0, "#cf2a33") + bahn(3.6, "#f4f4f0") + bahn(7.2, "#1f3d8a");
  S.teil({ id: "flagge", de: "die Flagge", syl: "FLAG-ge", it: "la bandiera", itSyl: "ban-DIE-ra", en: "flag", x: 200, y: 22, kunst: k,
    tipp: "Die Flagge Frankreichs ist blau, weiß und rot – die „Tricolore“." });
}

/* =====================================================================
   6 — DER HAHN (Aushängeschild des Cafés, vergoldet)
   ===================================================================== */
{
  let k = `<path d="M0 0 L-16 0 M-2 0 Q-6 -4 -12 0" stroke="#1d1d1f" stroke-width=".8" fill="none"/><rect x="-1" y="-2" width="2" height="4" fill="#1d1d1f"/>`;
  k += `<line x1="-14" y1="0" x2="-14" y2="2" stroke="#1d1d1f" stroke-width=".4"/>`;
  /* Hahn im Profil: Kamm, Kehllappen, Sichelschwanz */
  const G = S.lg("hahngold", [[0, "#ffe9a0"], [0.5, "#d9a93a"], [1, "#8e6420"]], 0, 0, 1, 1);
  k += `<g transform="translate(-14 2)">`;
  k += `<path d="M-1 15 L-1 12 M2 15 L2 12" stroke="#8e6420" stroke-width=".7"/>`;
  k += `<path d="M-5 6 Q-6 12 0 12.6 Q5 12.4 6 8 Q6.4 5 4.6 3 Q5.2 0 4 -1.4 Q2.6 -2 2 -.4 Q1 3 -1 4 Q-3.4 3 -5 6 Z" fill="${G}"/>`;
  k += `<path d="M-4.6 6.4 Q-9 2 -7.6 -2.4 Q-6 2 -4 4 M-4.6 7 Q-10 6 -10 1 Q-8 5.4 -4.6 6" fill="${G}" stroke="#8e6420" stroke-width=".3"/>`;
  k += `<path d="M3.2 -1.6 l.6 -1.4 l.6 1 l.7 -1.2 l.5 1.4" fill="#c9283e"/><path d="M5 .4 l1.6 .4 l-1.4 .6 Z" fill="#c9a54a"/><path d="M4.6 1.2 q.6 1.6 -.2 2" fill="#c9283e"/><circle cx="3.8" cy="-.1" r=".35" fill="#2a1a0a"/>`;
  k += `<path d="M-1 6 Q1.6 7.6 4 6" stroke="#fff3c4" stroke-width=".5" fill="none" opacity=".7"/></g>`;
  S.teil({ id: "hahn", de: "der Hahn", syl: "HAHN", it: "il gallo", itSyl: "GAL-lo", en: "cockerel", x: 196, y: 48, kunst: k,
    tipp: "Der gallische Hahn ist das Wappentier Frankreichs." });
}

/* =====================================================================
   7 — DER LAVENDEL (Pflanzkasten vor dem Café)
   ===================================================================== */
{
  let k = schatten(0, 0.3, 26, 1.2, 0.3);
  k += `<path d="M-25 0 L-25 -9 L25 -9 L25 0 Z" fill="${S.lg("kasten", [[0, "#3a5a48"], [1, "#24402f"]])}"/><rect x="-26" y="-10" width="52" height="1.6" fill="#4f7560"/>`;
  for (let i = 0; i < 56; i++) {
    const x = -23 + (i / 55) * 46 + (rnd() - 0.5), h = 8 + rnd() * 6, b = (rnd() - 0.5) * 3;
    k += `<path d="M${r(x)} -9.4 q${r(b * 0.3)} ${r(-h * 0.5)} ${r(b)} ${r(-h)}" stroke="#7d8f5a" stroke-width=".35" fill="none"/>`;
    k += `<ellipse cx="${r(x + b)}" cy="${r(-9.4 - h + 1.6)}" rx=".6" ry="1.9" fill="${["#7a5fb4", "#8f72c6", "#6a4f9e"][i % 3]}"/>`;
  }
  S.teil({ id: "lavendel", de: "der Lavendel", syl: "LA-ven-del", it: "la lavanda", itSyl: "la-VAN-da", en: "lavender", x: 226, y: 146, steht: true, kunst: k,
    tipp: "Lavendel blüht im Sommer lila und duftet stark. Ganze Felder davon gibt es in der Provence." });
}

/* =====================================================================
   8 — DIE METRO (Eingang von Guimard, links vorn)
   ===================================================================== */
{
  const Y = 146;
  let k = schatten(34, 0.4, 36, 2, 0.25);
  /* Treppenschacht (dunkel), Geländer aus Gusseisen mit Schilden */
  k += `<path d="M2 -14 L66 -14 L70 0 L-2 0 Z" fill="#2a2a2c"/>`;
  for (let i = 0; i < 5; i++) k += `<path d="M${r(4 + i * 1.2)} ${r(-12 + i * 2.4)} L${r(64 + i * 0.8)} ${r(-12 + i * 2.4)}" stroke="#55565a" stroke-width=".7"/>`;
  k += `<rect x="-2" y="-14" width="72" height="1.8" rx=".8" fill="${GUSS}"/>`;
  for (let x = 0; x <= 68; x += 8.5) {
    k += `<rect x="${r(x - 0.7)}" y="-14" width="1.4" height="14" fill="${GUSS}"/>`;
    if (x < 68) k += `<path d="M${r(x + 1.6)} -3 Q${r(x + 4.25)} -12 ${r(x + 6.9)} -3 Q${r(x + 4.25)} -7 ${r(x + 1.6)} -3 Z" fill="none" stroke="#3f6a4e" stroke-width=".7"/><ellipse cx="${r(x + 4.25)}" cy="-8.4" rx="1.4" ry="1.8" fill="${GUSS}"/><text x="${r(x + 4.25)}" y="-7.6" font-size="2" text-anchor="middle" fill="#c9a54a" font-family="Georgia">M</text>`;
  }
  /* zwei geschwungene Stiele mit orangeroten Lampen */
  for (const [x, sx] of [[4, 1], [64, -1]]) {
    k += `<path d="M${x} -14 C${x} -40 ${x - sx * 3} -60 ${x + sx * 4} -84 C${x + sx * 7} -92 ${x + sx * 11} -90 ${x + sx * 12} -86" stroke="${GUSS}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
    k += `<path d="M${x + sx * 12} -86 Q${x + sx * 14} -84 ${x + sx * 13} -80" stroke="${GUSS}" stroke-width="1.2" fill="none"/>`;
    k += `<path d="M${x + sx * 10.6} -81 Q${x + sx * 13} -84.6 ${x + sx * 15.4} -81 Q${x + sx * 15.6} -76 ${x + sx * 13} -74.4 Q${x + sx * 10.4} -76 ${x + sx * 10.6} -81 Z" fill="${S.rg("lampe", [[0, "#ffd9a0"], [0.5, "#f08a3a"], [1, "#b8461c"]], 0.4, 0.35)}"/>`;
  }
  /* Schild METROPOLITAIN zwischen den Stielen */
  k += `<path d="M6 -66 Q34 -70 62 -66" stroke="${GUSS}" stroke-width="1.6" fill="none"/>`;
  k += `<rect x="9" y="-66" width="50" height="8" rx="1.4" fill="#1f3a2c" stroke="${"#c9a54a"}" stroke-width=".4"/>`;
  k += `<text x="34" y="-60.2" font-size="5" text-anchor="middle" fill="#f0b64a" font-family="Georgia,'Times New Roman',serif" letter-spacing=".3">METROPOLITAIN</text>`;
  k += `<path d="M9 -58 Q34 -54 59 -58" stroke="${GUSS}" stroke-width="1" fill="none"/>`;
  S.teil({ id: "metro", de: "die Metro", syl: "ME-tro", it: "la metropolitana", itSyl: "me-tro-po-li-TA-na", en: "metro", x: 2, y: Y, kunst: k,
    tipp: "Die Pariser Metro fährt seit 1900. Die grünen Eingänge hat Hector Guimard entworfen." });
}

/* =====================================================================
   9 — DIE LITFASSSÄULE (Colonne Morris) und 10 — DAS SCHLOSS (Plakat)
   ===================================================================== */
const SAEULE = { x: 156, boden: 154, r: 15, h: 112 };
{
  const { r: R, h } = SAEULE;
  let k = schatten(0, 0.4, R + 4, 2, 0.3);
  k += `<rect x="${-R - 1.4}" y="-6" width="${2 * R + 2.8}" height="6" fill="${LACKGRUEN}"/><rect x="${-R - 2}" y="-7" width="${2 * R + 4}" height="1.4" fill="#3f6a4e"/>`;
  k += `<rect x="${-R}" y="${-h}" width="${2 * R}" height="${h - 6}" fill="${S.lg("saeule", [[0, "#b9b1a0"], [0.4, "#e6dfcf"], [1, "#9a927f"]], 0, 0, 1, 0)}"/>`;
  /* Plakate rundherum (seitlich gestaucht) */
  k += `<rect x="${-R}" y="${-h + 8}" width="7" height="44" fill="#c9283e" opacity=".85"/><rect x="${R - 6}" y="${-h + 10}" width="6" height="40" fill="#1f5a8a" opacity=".8"/>`;
  k += `<rect x="${-R}" y="${-h + 56}" width="${2 * R}" height="40" fill="#e9dcc0"/>`;
  k += `<text x="0" y="${-h + 70}" font-size="4.6" text-anchor="middle" fill="#7a1e18" font-family="Georgia,serif" font-weight="bold">THÉÂTRE</text><text x="0" y="${-h + 76}" font-size="2.8" text-anchor="middle" fill="#333" font-family="Georgia,serif" font-style="italic">Molière · Le Misanthrope</text>`;
  k += `<rect x="-9" y="${-h + 80}" width="18" height="12" fill="#2a2a3a"/><circle cx="0" cy="${-h + 86}" r="4" fill="#d9a93a" opacity=".8"/>`;
  k += `<rect x="${-R}" y="${-h}" width="${2 * R}" height="${h - 6}" fill="${S.lg("saeulerund", [[0, "#000", 0.28], [0.35, "#fff", 0.06], [0.6, "#000", 0], [1, "#000", 0.35]], 0, 0, 1, 0)}"/>`;
  /* Kuppel mit Krone und Spitze */
  k += `<rect x="${-R - 1.6}" y="${-h - 3}" width="${2 * R + 3.2}" height="3" fill="${LACKGRUEN}"/>`;
  for (let i = 0; i < 8; i++) k += `<path d="M${r(-R - 1 + i * (2 * R + 2) / 8)} ${-h - 3} q${r((2 * R + 2) / 16)} -3 ${r((2 * R + 2) / 8)} 0" fill="#3f6a4e"/>`;
  k += `<path d="M${-R + 1} ${-h - 4} Q${-R + 2} ${-h - 14} 0 ${-h - 15} Q${R - 2} ${-h - 14} ${R - 1} ${-h - 4} Z" fill="${S.lg("kuppel", [[0, "#5f8a6a"], [1, "#24493a"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-.7" y="${-h - 20}" width="1.4" height="6" fill="#24493a"/><circle cx="0" cy="${-h - 20.6}" r="1.2" fill="#c9a54a"/>`;
  S.teil({ id: "litfasssaeule", de: "die Litfaßsäule", syl: "LIT-faß-säu-le", it: "la colonna delle affissioni", itSyl: "co-LON-na DEL-le af-fis-SIO-ni", en: "advertising column", x: SAEULE.x, y: SAEULE.boden, steht: true, kunst: k,
    tipp: "In Paris heißen die Litfaßsäulen „Colonnes Morris“. Dort hängen Plakate für Theater und Ausflüge." });
}
{
  /* DAS SCHLOSS — Ausflugsplakat Château de Chambord */
  let k = `<rect x="-9" y="-36" width="18" height="34" fill="#f2ead6" stroke="#8a7a5a" stroke-width=".3"/>`;
  k += `<rect x="-8" y="-35" width="16" height="20" fill="${S.lg("plakathimmel", [[0, "#7fb0d8"], [1, "#e6eef2"]])}"/>`;
  k += `<rect x="-8" y="-19" width="16" height="4" fill="#6f9a52"/><rect x="-8" y="-17" width="16" height="2" fill="#5f86a8"/>`;
  /* Chambord: breiter Bau, Rundtürme, Dachlandschaft mit Laterne */
  k += `<rect x="-6.6" y="-24" width="13.2" height="5.4" fill="#f1ead8"/>`;
  for (const x of [-6.6, -2.2, 2.2, 6.6]) k += `<rect x="${x - 1.2}" y="-26" width="2.4" height="7.4" fill="#ece3cf"/><path d="M${x - 1.4} -26 L${x} -28.6 L${x + 1.4} -26 Z" fill="#4a5a6a"/>`;
  k += `<path d="M-4 -24 L-3 -27 L3 -27 L4 -24 Z" fill="#4a5a6a"/><rect x="-.8" y="-31" width="1.6" height="4" fill="#ece3cf"/><path d="M-1 -31 L0 -33.4 L1 -31 Z" fill="#4a5a6a"/>`;
  for (const x of [-3.6, -1.6, 1.6, 3.6]) k += `<rect x="${x - 0.25}" y="-29" width=".5" height="2" fill="#ece3cf"/>`;
  for (let i = 0; i < 6; i++) k += `<rect x="${-5.6 + i * 2.2}" y="-22.6" width=".8" height="1.2" fill="#6a7684"/>`;
  k += `<text x="0" y="-10.6" font-size="2.6" text-anchor="middle" fill="#1f3d8a" font-family="Georgia,serif" font-weight="bold">CHAMBORD</text><text x="0" y="-7.6" font-size="1.6" text-anchor="middle" fill="#6a5a3a" font-family="Georgia,serif">Château de la Loire</text>`;
  k += `<text x="0" y="-4.4" font-size="1.4" text-anchor="middle" fill="#7a1e18" font-family="Arial">en train · 2 h</text>`;
  S.teil({ id: "schloss", de: "das Schloss", syl: "SCHLOSS", it: "il castello", itSyl: "ca-STEL-lo", en: "castle", x: SAEULE.x, y: SAEULE.boden - 62, kunst: k,
    tipp: "An der Loire stehen viele Schlösser. Chambord hat 426 Zimmer und 282 Kamine." });
}

/* =====================================================================
   11 — DAS FAHRRAD (lehnt an der Säule) und 12 — DAS BAGUETTE im Korb
   ===================================================================== */
const RAD = { x: 154, boden: 170 };
{
  const R = 14, vx = -25, hx = 21;
  let k = schatten(0, 0.4, 32, 1.8, 0.3);
  const rad = (x) => `<circle cx="${x}" cy="${-R}" r="${R}" fill="none" stroke="#1d1d1f" stroke-width="1.6"/><circle cx="${x}" cy="${-R}" r="${R - 1.2}" fill="none" stroke="#c9cfd4" stroke-width=".4"/>` +
    Array.from({ length: 16 }, (_, i) => { const a = i * Math.PI / 8; return `<line x1="${x}" y1="${-R}" x2="${r(x + Math.cos(a) * (R - 1))}" y2="${r(-R + Math.sin(a) * (R - 1))}" stroke="#aab2b8" stroke-width=".2"/>`; }).join("") + `<circle cx="${x}" cy="${-R}" r="1.2" fill="#8a9298"/>`;
  k += rad(vx) + rad(hx);
  /* Hollandrad-Rahmen (cremeweiß), tiefer Einstieg */
  const RA = "#efe6d0";
  k += `<path d="M${hx} ${-R} L3 ${-R} L-4 -40 M3 ${-R} L-18 -36 M${hx} ${-R} L0 -38 M-4 -40 L0 -38" stroke="${RA}" stroke-width="2" fill="none" stroke-linejoin="round"/>`;
  k += `<path d="M-18 -36 Q-20 -30 -21.6 -24 L${vx} ${-R}" stroke="${RA}" stroke-width="2" fill="none"/>`;
  k += `<path d="M-18 -36 L-17 -42 M-21 -44 Q-17 -42 -12 -44" stroke="#2a2a2a" stroke-width="1.2" fill="none" stroke-linecap="round"/>`;
  /* Sattel, Kettenschutz, Schutzbleche, Gepäckträger */
  k += `<path d="M-6 -42 Q-2 -44 3 -42 L1 -40 L-5 -40 Z" fill="#5a3a20"/><path d="M-4 -40 L-3 -42" stroke="#2a2a2a" stroke-width=".8"/>`;
  k += `<path d="M2 ${-R - 3} Q12 ${-R - 4} 20 ${-R - 2} L20 ${-R + 1.6} Q12 ${-R + 2.6} 2 ${-R + 1.6} Z" fill="#1d1d1f"/>`;
  k += `<path d="M${hx - 12} ${-R - 9} A14 14 0 0 1 ${hx + 13} ${-R - 3}" stroke="#1d1d1f" stroke-width="1.2" fill="none"/><path d="M${vx - 13} ${-R - 3} A14 14 0 0 1 ${vx + 10} ${-R - 10}" stroke="#1d1d1f" stroke-width="1.2" fill="none"/>`;
  k += `<path d="M2 -36 L${hx + 6} -32 L${hx + 6} ${-R - 3}" stroke="#2a2a2a" stroke-width=".8" fill="none"/>`;
  k += `<circle cx="3" cy="${-R}" r="3" fill="none" stroke="#2a2a2a" stroke-width=".8"/><path d="M3 ${-R} l2.6 4.4" stroke="#2a2a2a" stroke-width=".8"/><rect x="4.4" y="${-R + 4}" width="3" height="1" fill="#2a2a2a"/>`;
  /* Ständer und Klingel */
  k += `<path d="M6 ${-R} L9 0" stroke="#5a5a5a" stroke-width=".8"/><circle cx="-14.6" cy="-43.4" r="1" fill="#c9cfd4"/>`;
  /* Weidenkorb vorne am Lenker */
  k += `<path d="M-33 -46 L-19 -46 L-20.6 -34 L-31.6 -34 Z" fill="${S.lg("korb", [[0, "#d3a35b"], [1, "#9b6b2c"]])}"/>`;
  for (let i = 0; i < 6; i++) k += `<line x1="${-32.6 + i * 2.6}" y1="-46" x2="${-31.6 + i * 2.2}" y2="-34" stroke="#8a5c22" stroke-width=".3"/>`;
  for (const y of [-43, -40, -37]) k += `<line x1="-33" y1="${y}" x2="-19.6" y2="${y}" stroke="#8a5c22" stroke-width=".3"/>`;
  k += `<path d="M-33 -46 L-19 -46" stroke="#c99550" stroke-width="1"/><path d="M-21 -40 L-18 -41" stroke="#2a2a2a" stroke-width=".7"/>`;
  S.teil({ id: "fahrrad", de: "das Fahrrad", syl: "FAHR-rad", it: "la bicicletta", itSyl: "bi-ci-CLET-ta", en: "bicycle", x: RAD.x, y: RAD.boden, steht: true, kunst: k,
    tipp: "In Paris fährt man viel Fahrrad. An vielen Stationen kann man sich eins leihen." });
}
{
  let k = "";
  for (const [dx, a, l] of [[-1.6, -14, 24], [2, -6, 26]]) {
    k += `<g transform="rotate(${a} ${dx} 0)"><rect x="${dx - 2}" y="${-l}" width="4.2" height="${l}" rx="2" fill="${S.lg("baguette", [[0, "#f0c77e"], [0.5, "#d99a4a"], [1, "#a8692a"]], 0, 0, 1, 0)}"/>`;
    for (let i = 0; i < 4; i++) k += `<path d="M${dx - 1.2} ${-l + 4 + i * 5} l2.6 -2" stroke="#8a5222" stroke-width=".55"/>`;
    k += `<path d="M${dx - 1} ${-l + 2} L${dx - 1} -2" stroke="#fff3d6" stroke-width=".5" opacity=".4"/></g>`;
  }
  /* Papierbanderole um die Mitte */
  k += `<path d="M-4.6 -4 L5 -4.6 L5.4 0 L-4.2 .4 Z" fill="#f6f2e8"/>`;
  S.teil({ oben: true, id: "baguette", de: "das Baguette", syl: "Ba-GUET-te", it: "la baguette", itSyl: "ba-GUET-te", en: "baguette", x: RAD.x - 26, y: RAD.boden - 41, kunst: k + flaeche(-6, -26, 12, 26),
    tipp: "Das Baguette ist lang und knusprig. Viele Franzosen kaufen es jeden Tag frisch." });
}

/* =====================================================================
   13 — DER KELLNER (Garçon vor der Tür)
   ===================================================================== */
{
  const m = B.mensch({ id: "b24c_kellner", geschlecht: "m", alter: "erwachsen", pose: "stehen", blick: -24, frisur: "kurz", haarfarbe: "dunkelbraun", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "kellnerhemd" }, jacke: { stueck: "weste", farbe: "schwarz" }, schuerze: { stueck: "schuerze", farbe: "weiss" }, unterteil: { stueck: "anzughose" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" } } }, 58);
  S.teil({ id: "kellner", de: "der Kellner", syl: "KELL-ner", it: "il cameriere", itSyl: "ca-me-RIE-re", en: "waiter", x: 300, y: 152, kunst: knapp(m.svg),
    tipp: "Der Kellner im Pariser Café heißt „Garçon“. Er trägt eine lange weiße Schürze." });
}

/* =====================================================================
   14 — DER STUHL, 15 — DER GAST mit 16 — DER BASKENMÜTZE,
   17 — DER TISCH (mit Lupe: Croissant, Kaffee, Wein, Käse)
   ===================================================================== */
const TI = { x: 252, boden: 186, platte: 148 };
const SITZ = { x: 222, boden: 182 };
{
  /* Pariser Bistrostuhl: Bambus-Rahmen, geflochtene Sitzfläche und Lehne */
  const sitz = -22;
  const BAMBUS = S.lg("bambus", [[0, "#d9a868"], [0.5, "#b07a3c"], [1, "#8a5a28"]], 0, 0, 1, 0);
  let k = schatten(0, 0.4, 12, 1.6, 0.3);
  k += `<path d="M-9 0 L-8 ${sitz} M9 0 L8 ${sitz} M-6 -2 L-5.6 ${sitz} M6.4 -2 L6 ${sitz}" stroke="${BAMBUS}" stroke-width="1.6"/>`;
  k += `<path d="M-8.6 ${sitz} Q-11 ${sitz - 10} -9 ${sitz - 24} Q0 ${sitz - 28} 9 ${sitz - 24} Q11 ${sitz - 10} 8.6 ${sitz}" stroke="${BAMBUS}" stroke-width="1.8" fill="none"/>`;
  k += `<path d="M-8 ${sitz - 8} Q-9.4 ${sitz - 16} -8 ${sitz - 22} Q0 ${sitz - 25.6} 8 ${sitz - 22} Q9.4 ${sitz - 16} 8 ${sitz - 8} Q0 ${sitz - 10} -8 ${sitz - 8} Z" fill="url(#${S.id("rattan")})"/>`;
  k += `<path d="M-9.6 ${sitz + 0.4} L9.6 ${sitz + 0.4} L8 ${sitz - 3.4} L-8 ${sitz - 3.4} Z" fill="url(#${S.id("rattan")})" stroke="${"#8a5a28"}" stroke-width=".6"/>`;
  k += `<path d="M-8.4 -8 L8.4 -8" stroke="${BAMBUS}" stroke-width="1"/>`;
  S.teil({ id: "stuhl", de: "der Stuhl", syl: "STUHL", it: "la sedia", itSyl: "SE-dia", en: "chair", x: SITZ.x, y: SITZ.boden, steht: true, kunst: k,
    tipp: "Die geflochtenen Stühle der Pariser Cafés gibt es seit über 100 Jahren." });
}
{
  const m = B.mensch({ id: "b24c_gast", geschlecht: "w", alter: "erwachsen", pose: "sitzen", blick: 70, frisur: "lang", haarfarbe: "braun", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "pullover", farbe: "#1f2f5a" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "halbschuh", farbe: "braun" } } }, 76);
  /* Sitzhöhe des Stuhls: 22 Einheiten über dem Boden */
  const dy = -22 - m.z.sitz.y * m.k;
  S.teil({ id: "gast", de: "der Gast", syl: "GAST", it: "l'ospite", itSyl: "O-spi-te", en: "guest", x: SITZ.x + 1, y: SITZ.boden + dy, kunst: knapp(m.svg),
    tipp: "Der Gast bestellt: „Un café crème et un croissant, s'il vous plaît!“" });
  /* DIE BASKENMÜTZE — auf dem Kopf des Gastes, etwas schräg */
  const [sx, sy] = m.z.punkte.scheitel;
  let b = `<ellipse cx="0" cy="0" rx="6.4" ry="2.4" fill="${S.rg("barett", [[0, "#c9283e"], [1, "#7a1424"]], 0.4, 0.3)}" transform="rotate(-8)"/>`;
  b += `<path d="M-5.8 1.2 Q0 2.6 5.6 .4" stroke="#5a0f1a" stroke-width=".7" fill="none"/><path d="M.4 -2.2 l.4 -1.2" stroke="#7a1424" stroke-width=".7"/>`;
  S.teil({ oben: true, id: "baskenmuetze", de: "die Baskenmütze", syl: "BAS-ken-müt-ze", it: "il basco", itSyl: "BA-sco", en: "beret", x: SITZ.x + 1 + sx * m.k + 0.6, y: SITZ.boden + dy + sy * m.k + 1.6, kunst: b,
    tipp: "Die Baskenmütze ist flach und rund. Sie kommt aus dem Baskenland im Südwesten." });
}
const tischUnter = [];
{
  const X = TI.x, h = TI.platte - TI.boden;
  let k = schatten(0, 0.4, 14, 1.6, 0.3);
  /* gusseiserner Fuß und Säule */
  k += `<path d="M-10 0 Q-4 -2 -1.4 -6 L1.4 -6 Q4 -2 10 0 Z" fill="#1d1d1f"/><rect x="-1.2" y="${h + 2}" width="2.4" height="${-h - 8}" fill="#2a2a2c"/>`;
  k += `<ellipse cx="0" cy="${h + 2.6}" rx="5" ry="1" fill="#1d1d1f"/>`;
  /* Marmorplatte */
  k += `<ellipse cx="0" cy="${h + 1.2}" rx="17" ry="4.4" fill="#9a9a96"/>`;
  k += `<ellipse cx="0" cy="${h}" rx="17" ry="4.4" fill="${S.rg("marmor", [[0, "#ffffff"], [0.7, "#ecebe6"], [1, "#d2d1cb"]], 0.4, 0.35, 0.7)}"/>`;
  k += `<path d="M-12 ${h - 1} q5 1.6 9 .4 t8 1.4" stroke="#c9c8c0" stroke-width=".3" fill="none"/>`;
  const it = [];
  /* DER WEIN — Glas Rotwein, hinten links */
  {
    const x = -9, y = h - 1.6;
    let g = `<ellipse cx="${x}" cy="${y}" rx="1.8" ry=".5" fill="#d8dde0" opacity=".8"/><path d="M${x} ${y} L${x} ${y - 4}" stroke="#d8dde0" stroke-width=".4"/>`;
    g += `<path d="M${x - 2} ${y - 9} Q${x - 2.2} ${y - 4.6} ${x} ${y - 4} Q${x + 2.2} ${y - 4.6} ${x + 2} ${y - 9} Z" fill="#e8f2f5" opacity=".45" stroke="#c9d3d8" stroke-width=".2"/>`;
    g += `<path d="M${x - 2} ${y - 6.6} Q${x - 1.8} ${y - 4.6} ${x} ${y - 4.2} Q${x + 1.8} ${y - 4.6} ${x + 2} ${y - 6.6} Z" fill="#7a1424"/><path d="M${x - 1.4} ${y - 8.6} L${x - 1.2} ${y - 5}" stroke="#fff" stroke-width=".35" opacity=".7"/>`;
    k += g; it.push({ id: "wein", de: "der Wein", syl: "WEIN", it: "il vino", itSyl: "VI-no", en: "wine", x, y, kunst: flaeche(-2.6, -9.6, 5.2, 10),
      tipp: "Frankreich ist berühmt für seinen Wein – zum Beispiel aus Bordeaux oder Burgund." });
  }
  /* DER KÄSE — Brettchen mit Camembert und Brie */
  {
    const x = 7, y = h - 1.4;
    let g = `<path d="M${x - 7} ${y} L${x + 6} ${y} L${x + 7} ${y - 2} L${x - 6} ${y - 2} Z" fill="#a8743f"/><path d="M${x - 7} ${y} L${x + 6} ${y} L${x + 6} ${y + 0.8} L${x - 7} ${y + 0.8} Z" fill="#7d5230"/>`;
    g += `<path d="M${x - 5.6} ${y - 1.4} L${x - 5.6} ${y - 3.6} A3.2 1 0 0 1 ${x + 0.8} ${y - 3.6} L${x + 0.8} ${y - 1.4} A3.2 1 0 0 1 ${x - 5.6} ${y - 1.4} Z" fill="#f6efdd"/><ellipse cx="${x - 2.4}" cy="${y - 3.6}" rx="3.2" ry="1" fill="#fbf7ec"/>`;
    g += `<path d="M${x - 2.4} ${y - 3.6} L${x + 0.4} ${y - 3.4} L${x - 0.4} ${y - 4.4} Z" fill="#f2dc8a"/>`;
    g += `<path d="M${x + 1.6} ${y - 1.2} L${x + 6} ${y - 1.4} L${x + 2.4} ${y - 3.6} Z" fill="#f4e4b0"/><path d="M${x + 2.4} ${y - 3.6} L${x + 6} ${y - 1.4}" stroke="#fbf7ec" stroke-width=".6"/>`;
    k += g; it.push({ id: "kaese", de: "der Käse", syl: "KÄ-se", it: "il formaggio", itSyl: "for-MAG-gio", en: "cheese", x, y, kunst: flaeche(-7.4, -5, 14.8, 6),
      tipp: "In Frankreich gibt es über 1000 Käsesorten, zum Beispiel Camembert und Brie." });
  }
  /* DAS CROISSANT — auf dem Teller vorne links */
  {
    const x = -6, y = h + 2.4;
    let g = `<ellipse cx="${x}" cy="${y}" rx="5.4" ry="1.4" fill="#fbfbf8" stroke="#d8d4c8" stroke-width=".25"/>`;
    g += `<path d="M${x - 4.6} ${y - 0.2} Q${x - 3} ${y - 3.6} ${x} ${y - 3.8} Q${x + 3} ${y - 3.6} ${x + 4.6} ${y - 0.2} Q${x + 2.4} ${y - 1} ${x} ${y - 0.8} Q${x - 2.4} ${y - 1} ${x - 4.6} ${y - 0.2} Z" fill="${S.rg("croissant", [[0, "#f2cf8e"], [0.6, "#d9963e"], [1, "#a8601d"]], 0.45, 0.3, 0.8)}"/>`;
    for (const t of [-2.8, -1.2, 0.4, 2]) g += `<path d="M${r(x + t)} ${r(y - 3.4 + Math.abs(t) * 0.4)} q.7 1.2 .2 2.4" stroke="#9a5a1e" stroke-width=".4" fill="none"/>`;
    g += `<path d="M${x - 2} ${y - 3.2} Q${x} ${y - 3.9} ${x + 2} ${y - 3.3}" stroke="#fff3d6" stroke-width=".5" opacity=".6" fill="none"/>`;
    k += g; it.push({ id: "croissant", de: "das Croissant", syl: "Crois-SANT", it: "il cornetto", itSyl: "cor-NET-to", en: "croissant", x, y, kunst: flaeche(-5.6, -4.2, 11.2, 5.8),
      tipp: "Das Croissant ist ein Hörnchen aus Blätterteig mit viel Butter." });
  }
  /* DER KAFFEE — Café crème in der weißen Tasse */
  {
    const x = 6, y = h + 2.6;
    let g = `<ellipse cx="${x}" cy="${y}" rx="3.6" ry="1" fill="#f6f5f0" stroke="#d8d4c8" stroke-width=".25"/>`;
    g += `<path d="M${x - 2.4} ${y - 4} L${x + 2.4} ${y - 4} L${x + 2} ${y - 0.6} Q${x} ${y + 0.2} ${x - 2} ${y - 0.6} Z" fill="${S.lg("tasse", [[0, "#ffffff"], [1, "#d8d4cc"]], 0, 0, 1, 0)}"/>`;
    g += `<ellipse cx="${x}" cy="${y - 4}" rx="2.4" ry=".6" fill="#c9a074"/><ellipse cx="${x - 0.3}" cy="${y - 4.05}" rx="1.3" ry=".3" fill="#f2e2c4"/>`;
    g += `<path d="M${x + 2.3} ${y - 3.3} q1.4 .2 1.1 1.3 q-.3 .8 -1.4 .6" stroke="#eeeae2" stroke-width=".55" fill="none"/>`;
    g += `<path d="M${x - 0.2} ${y - 5} q-.9 -1.3 0 -2.4 q.9 -1.1 0 -2.2" stroke="#fff" stroke-width=".35" opacity=".55" fill="none"/>`;
    k += g; it.push({ id: "kaffee", de: "der Kaffee", syl: "KAF-fee", it: "il caffè", itSyl: "caf-FÈ", en: "coffee", x, y, kunst: flaeche(-3.8, -7, 7.6, 8) });
  }
  it.forEach((u) => tischUnter.push(Object.assign(u, { x: X + u.x, y: TI.boden + u.y })));
  S.teil({ id: "tisch", de: "der Tisch", syl: "TISCH", it: "il tavolo", itSyl: "TA-vo-lo", en: "table", x: X, y: TI.boden, steht: true, kunst: k,
    zoom: { x: X - 21, y: TI.platte - 16, w: 42, h: 28 },
    unter: tischUnter });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/frankreich.js"));
console.log(aus);
