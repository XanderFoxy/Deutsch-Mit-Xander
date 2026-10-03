#!/usr/bin/env node
/* =====================================================================
   KLEINE TIERE (FASSUNG 852) — Bilderwelt neu
   ---------------------------------------------------------------------
   Die alten Wörter sind Insekten, Spinnen, Schnecke und Wurm — darum
   zeigt die Szene keinen Streichelzoo, sondern eine NATURGARTEN-ECKE AM
   TEICHRAND aus der Nähe (Makro-Blick auf Bodenhöhe).

   RECHERCHE (NABU „Insekten im Garten“, BUND „Tagpfauenauge“,
   Wikibooks „Gartenrenaturierung/Schmetterlinge“):
   - Raupen des Tagpfauenauges fressen fast nur BRENNNESSELN; der Falter
     sonnt sich mit offenen Flügeln auf Blüten (Disteln, Flockenblume).
   - Der ZITRONENFALTER saugt an DISTELN und sitzt mit geschlossenen
     Flügeln — die Flügel sehen dann aus wie ein Blatt.
   - Honigbienen besuchen LÖWENZAHN; Wespen kommen im Spätsommer ans
     FALLOBST (Pflaumen).
   - Der HIRSCHKÄFER braucht TOTHOLZ (alte Eichenstümpfe).
   - Die KREUZSPINNE sitzt kopfunter in der Mitte ihres Radnetzes.
   - Die ZECKE wartet an der Spitze eines Grashalms (Lauerstellung,
     Vorderbeine ausgestreckt).
   - LIBELLEN jagen über dem Teich, MÜCKEN und SCHNAKEN ruhen im SCHILF.
   - Im Boden: REGENWURM in seinem Gang, Wurzeln, Steinchen.
   Maßstab: 1 Einheit = 1 Millimeter. Alle Tiere in echter Größe
   (Tagpfauenauge 55 mm, Libelle 70 mm, Zecke 3,5 mm …). Die ganz
   kleinen (Zecke, Ameise, Marienkäfer, Mücke) liegen in der Lupe.
   ===================================================================== */
"use strict";
const path = require("path");
const B = require("../bau");
const { neueSzene, flaeche, schatten, zufall } = B;
const r = B.r;

const S = neueSzene({ id: "kleintiere", titel: "Kleine Tiere", emoji: "🐌", thema: "Natur", kuerzel: "b19c", fassung: 852 });
const rnd = zufall(2207);
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const BODEN = 152;               /* Erdoberfläche */
const linie = (d, farbe, w, o = 1) => `<path d="${d}" stroke="${farbe}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"${o < 1 ? ` opacity="${o}"` : ""}/>`;
const FLUEGEL = S.lg("fluegel", [[0, "#ffffff", 0.55], [1, "#dfeef4", 0.3]], 0, 0, 1, 1);

/* =====================================================================
   KULISSE: unscharfer Garten (Bokeh), Teich rechts
   ===================================================================== */
S.hinten(`<rect width="320" height="200" fill="${S.lg("hgrund", [[0, "#d9e9ef"], [0.35, "#b9d3a8"], [0.7, "#86a86a"], [1, "#6b8f55"]])}"/>`);
{
  let g = "";
  for (let i = 0; i < 26; i++) {
    const x = rnd() * 320, y = 20 + rnd() * 120, rr = 6 + rnd() * 16;
    g += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(rr)}" fill="${rnd() < 0.7 ? "#a9c98a" : "#f1f4dc"}" opacity="${r(0.12 + rnd() * 0.2)}"/>`;
  }
  for (const [x, y, c] of [[30, 70, "#c9a3d6"], [250, 40, "#f2e6a0"], [300, 110, "#e3b3c6"], [150, 130, "#f4f1e6"]]) g += `<circle cx="${x}" cy="${y}" r="9" fill="${c}" opacity=".35"/>`;
  /* unscharfe Halme im Hintergrund */
  for (let i = 0; i < 30; i++) { const x = rnd() * 320; g += `<path d="M${r(x)} ${BODEN} Q${r(x + rnd() * 8 - 4)} ${r(100 + rnd() * 20)} ${r(x + rnd() * 16 - 8)} ${r(60 + rnd() * 40)}" stroke="#6f9452" stroke-width="${r(1.5 + rnd() * 2)}" fill="none" opacity=".25"/>`; }
  S.hinten(g);
}
/* Teich rechts unten mit Uferkante */
{
  let g = `<path d="M250 ${BODEN - 6} Q280 ${BODEN - 9} 320 ${BODEN - 8} L320 200 L254 200 Q246 176 250 ${BODEN - 6} Z" fill="${S.lg("teich", [[0, "#6f98a4"], [0.5, "#4f7d8c"], [1, "#2f5a68"]])}"/>`;
  for (let i = 0; i < 9; i++) { const y = BODEN - 2 + i * 5.4, x = 256 + rnd() * 24; g += `<path d="M${r(x)} ${r(y)} h${r(16 + rnd() * 30)}" stroke="#d8eaee" stroke-width=".7" opacity=".45"/>`; }
  g += `<ellipse cx="270" cy="${BODEN + 8}" rx="18" ry="4" fill="#5f8a3a" opacity=".85"/><path d="M270 ${BODEN + 8} L262 ${BODEN + 5}" stroke="#4f7a30" stroke-width=".6"/>`;
  S.hinten(g);
}

/* =====================================================================
   PFLANZEN
   ===================================================================== */
/* DAS SCHILF (rechts im Teich) — mit der Mücke (Lupe) */
const schilf = { x0: 262, x1: 320 };
{
  let k = "";
  const halme = [[272, 14, -2], [286, 4, 3], [300, 18, -4], [312, 8, 2]];
  for (const [x, top, b] of halme) {
    k += `<path d="M${x} 200 Q${x + b * 0.4} 100 ${x + b} ${top + 24}" stroke="${S.lg("halm", [[0, "#9fb46a"], [1, "#6d8a3e"]], 0, 0, 1, 0)}" stroke-width="2.6" fill="none"/>`;
    /* Rispe */
    k += `<path d="M${x + b} ${top + 26} Q${x + b + 2} ${top + 10} ${x + b + 5} ${top}" stroke="#7a5a3c" stroke-width="1.2" fill="none"/>`;
    for (let i = 0; i < 9; i++) k += `<path d="M${r(x + b + 1 + i * 0.4)} ${r(top + 24 - i * 2.6)} q${r(3 + rnd() * 3)} ${r(-1 - rnd() * 2)} ${r(6 + rnd() * 3)} ${r(1 + rnd() * 2)}" stroke="#8a6a48" stroke-width=".8" fill="none"/>`;
  }
  /* lange Blätter */
  const blatt = (x, y, dx, dy, w) => `<path d="M${x} ${y} Q${r(x + dx * 0.5)} ${r(y + dy * 0.2 - 6)} ${x + dx} ${y + dy} Q${r(x + dx * 0.5 + w)} ${r(y + dy * 0.2 - 3)} ${x} ${y + w} Z" fill="${S.lg("schilfblatt", [[0, "#8fae5a"], [1, "#5d7f34"]])}"/>`;
  k += blatt(273, 120, -30, 14, 3) + blatt(286, 96, 26, 22, 3.2) + blatt(300, 136, -26, 6, 3) + blatt(312, 110, -22, 26, 3) + blatt(287, 150, 30, 10, 3);
  /* die Mücke sitzt auf dem Blatt (Lupe) */
  const muecke = (x, y) => {
    let g = `<g transform="translate(${x} ${y})">`;
    for (const [a, b] of [[-1, 1], [0, 1], [1, 1]]) g += linie(`M${a * 0.6} -.8 L${a * 1.6 - 0.4} -2.2 L${a * 2.8 - 0.6} 0`, "#3a3a34", 0.12);
    g += `<ellipse cx="-1.6" cy="-1.7" rx="2.2" ry=".55" fill="#5e5a4c" transform="rotate(-8 -1.6 -1.7)"/>`;
    for (let i = 0; i < 4; i++) g += `<path d="M${r(-3 + i * 0.9)} -2 v.6" stroke="#d9d4c0" stroke-width=".12"/>`;
    g += `<ellipse cx=".6" cy="-2.2" rx=".9" ry=".7" fill="#4a463c"/><circle cx="1.5" cy="-2.3" r=".45" fill="#2a2824"/>`;
    g += linie("M1.8 -2.2 L3.6 -1.9", "#2a2824", 0.12) + linie("M1.6 -2.6 q.8 -.8 1.2 -1.6 M1.6 -2.5 q1 -.4 1.6 -1", "#4a463c", 0.08);
    g += `<ellipse cx="-1.6" cy="-3.1" rx="2.2" ry=".55" fill="${FLUEGEL}" stroke="#8a8a80" stroke-width=".06" transform="rotate(-12 -1.6 -3.1)"/>`;
    return g + `</g>`;
  };
  k += muecke(296, 101);
  S.teil({ id: "schilf", de: "das Schilf", syl: "SCHILF", it: "la canna palustre", itSyl: "CAN-na pa-LU-stre", en: "reed", x: 0, y: 0, kunst: k,
    zoom: { x: 272, y: 88, w: 42, h: 28 },
    unter: [{ id: "muecke", de: "die Mücke", syl: "MÜ-cke", it: "la zanzara", itSyl: "zan-ZA-ra", en: "mosquito", x: 296, y: 101, kunst: flaeche(-4, -5, 8, 6),
      tipp: "Sechs Millimeter. Nur die Weibchen stechen." }],
    tipp: "Im Schilf am Teich ruhen Mücken und Libellen." });
}

/* DIE DISTEL — zwei Kratzdisteln (links mit dem Tagpfauenauge, rechts mit dem Zitronenfalter) */
const distelKopf = (x, y, s) => {
  let g = `<path d="M${r(x - 9 * s)} ${r(y)} Q${r(x - 11 * s)} ${r(y + 9 * s)} ${x} ${r(y + 12 * s)} Q${r(x + 11 * s)} ${r(y + 9 * s)} ${r(x + 9 * s)} ${y} Z" fill="${S.lg("distelkopf", [[0, "#9db06a"], [1, "#6c8442"]])}"/>`;
  for (let i = 0; i < 12; i++) { const a = (i % 6) * 0.5 - 1.3, yy = y + 2 + Math.floor(i / 6) * 4.5 * s; g += `<path d="M${r(x + a * 6 * s)} ${r(yy)} l${r(a * 2.5)} ${r(-2.4 * s)}" stroke="#e8e4c6" stroke-width=".5"/>`; }
  for (let i = 0; i < 22; i++) { const t = i / 21 - 0.5; g += `<path d="M${r(x + t * 15 * s)} ${r(y + 1)} Q${r(x + t * 18 * s)} ${r(y - 5 * s)} ${r(x + t * 22 * s)} ${r(y - 10 * s - Math.cos(t * 3) * 3)}" stroke="${i % 2 ? "#a24f9e" : "#c06ab8"}" stroke-width="1.2" fill="none" stroke-linecap="round"/>`; }
  return g;
};
const distelPflanze = (x, top, s) => {
  let g = `<path d="M${x} ${BODEN} Q${x - 2} ${r((BODEN + top) / 2)} ${x} ${top + 12 * s}" stroke="${S.lg("distelstiel", [[0, "#7f9a4c"], [1, "#5f7a36"]], 0, 0, 1, 0)}" stroke-width="${r(2.4 * s)}" fill="none"/>`;
  /* stachelige Blätter */
  for (const [yy, sx] of [[BODEN - 30, -1], [BODEN - 58, 1], [top + 40, -1]]) {
    let p = `M${x} ${yy}`;
    for (let i = 1; i <= 5; i++) p += ` L${r(x + sx * (i * 5.6) * s)} ${r(yy - (i % 2 ? 6 : 2) * s - i * 1.2)} L${r(x + sx * (i * 5.6 + 2) * s)} ${r(yy - i * 1.4)}`;
    p += ` Q${r(x + sx * 16 * s)} ${r(yy + 4)} ${x} ${yy + 3} Z`;
    g += `<path d="${p}" fill="${S.lg("distelblatt", [[0, "#8aa45a"], [1, "#5b7638"]])}"/>`;
    for (let i = 1; i <= 5; i++) g += `<path d="M${r(x + sx * (i * 5.6) * s)} ${r(yy - (i % 2 ? 6 : 2) * s - i * 1.2)} l${r(sx * 1.6)} ${r(-1.4)}" stroke="#e8e4c6" stroke-width=".4"/>`;
  }
  return g + distelKopf(x, top, s);
};
S.teil({ id: "distel", de: "die Distel", syl: "DIS-tel", it: "il cardo", itSyl: "CAR-do", en: "thistle", x: 0, y: 0,
  kunst: distelPflanze(76, 44, 1.15) + distelPflanze(214, 92, 0.95),
  tipp: "Disteln stechen — aber Schmetterlinge und Hummeln lieben ihre Blüten." });

/* DIE BRENNNESSEL — mit der Raupe des Tagpfauenauges */
{
  const x = 112;
  let k = `<path d="M${x} ${BODEN} Q${x + 3} 90 ${x + 1} 22" stroke="${S.lg("nesselstiel", [[0, "#6f8f44"], [1, "#4f6e30"]], 0, 0, 1, 0)}" stroke-width="2.4" fill="none"/>`;
  const blatt = (bx, by, dir, l) => {
    let p = `M${bx} ${by}`;
    const n = 7;
    for (let i = 1; i <= n; i++) { const t = i / n, w = Math.sin(t * Math.PI) * l * 0.42; p += ` L${r(bx + dir * (t * l - 1))} ${r(by - w - 1.4)} L${r(bx + dir * t * l)} ${r(by - w)}`; }
    for (let i = n - 1; i >= 1; i--) { const t = i / n, w = Math.sin(t * Math.PI) * l * 0.3; p += ` L${r(bx + dir * (t * l + 1))} ${r(by + w + 1.2)} L${r(bx + dir * t * l)} ${r(by + w)}`; }
    let g = `<path d="${p} Z" fill="${S.lg("nesselblatt", [[0, "#7fa04e"], [1, "#4e7034"]])}"/>`;
    g += linie(`M${bx} ${by} L${r(bx + dir * l * 0.95)} ${r(by - 1)}`, "#a9c27a", 0.5, 0.7);
    for (const t of [0.3, 0.55, 0.75]) g += linie(`M${r(bx + dir * t * l)} ${r(by - 0.4)} l${r(dir * 4)} ${r(-l * 0.18)} M${r(bx + dir * t * l)} ${r(by + 0.3)} l${r(dir * 4)} ${r(l * 0.14)}`, "#a9c27a", 0.3, 0.6);
    return g;
  };
  k += blatt(x + 1, 128, -1, 26) + blatt(x + 2, 122, 1, 24) + blatt(x + 2, 92, -1, 22) + blatt(x + 2, 86, 1, 22) + blatt(x + 1, 56, -1, 18) + blatt(x + 1, 50, 1, 17) + blatt(x + 1, 30, -1, 12) + blatt(x + 1, 27, 1, 11);
  /* hängende Blütenrispen */
  for (const [yy, d] of [[70, 1], [104, -1]]) k += linie(`M${x + 1} ${yy} q${d * 6} 4 ${d * 9} 14`, "#8fa860", 0.7) + linie(`M${x + 1} ${yy} q${d * 4} 6 ${d * 4} 16`, "#8fa860", 0.6);
  S.teil({ id: "brennnessel", de: "die Brennnessel", syl: "BRENN-nes-sel", it: "l'ortica", itSyl: "or-TI-ca", en: "stinging nettle", x: 0, y: 0, kunst: k,
    tipp: "Ihre Brennhaare brennen auf der Haut. Für die Raupen des Tagpfauenauges ist sie das Lieblingsfutter." });
}

/* DAS SPINNENNETZ (Radnetz der Kreuzspinne) zwischen Brennnessel und Distel */
const NETZ = { x: 164, y: 56, rr: 40 };
{
  let k = "";
  const pkt = (a, rr) => [NETZ.x + Math.cos(a) * rr * 1.05, NETZ.y + Math.sin(a) * rr];
  /* Rahmenfäden zu den Pflanzen */
  k += linie("M116 40 L146 14 L204 20 L213 76 L176 99 L124 92 Z M146 14 L150 0 M116 40 L113 46 M213 76 L214 84 M124 92 L113 104", "#f4f6f2", 0.28, 0.7);
  const n = 22;
  for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, [x, y] = pkt(a, NETZ.rr + (i % 3) * 3); k += linie(`M${NETZ.x} ${NETZ.y} L${r(x)} ${r(y)}`, "#f4f6f2", 0.22, 0.7); }
  /* Fangspirale */
  let sp = "";
  for (let t = 0; t < 26 * n; t++) {
    const a = t / n * Math.PI * 2, rr = 6 + t / n * 1.32;
    if (rr > NETZ.rr) break;
    const [x, y] = pkt(a, rr);
    sp += (t ? " L" : "M") + r(x) + " " + r(y);
  }
  k += linie(sp, "#f4f6f2", 0.16, 0.65);
  /* Tautropfen */
  for (let i = 0; i < 14; i++) { const a = rnd() * 6.28, [x, y] = pkt(a, 8 + rnd() * 30); k += `<circle cx="${r(x)}" cy="${r(y)}" r=".5" fill="#fff" opacity=".8"/>`; }
  S.teil({ id: "spinnennetz", de: "das Spinnennetz", syl: "SPIN-nen-netz", it: "la ragnatela", itSyl: "ra-gna-TE-la", en: "spider web", x: 0, y: 0, kunst: k,
    tipp: "Das Radnetz baut die Kreuzspinne jeden Tag neu — in etwa einer Stunde." });
}
{
  /* DIE SPINNE — Kreuzspinne, kopfunter in der Netzmitte (Rückenansicht) */
  let k = "";
  /* acht Beine am Vorderkörper; die Spinne sitzt kopfunter, die langen Vorderbeine zeigen nach unten */
  for (const [kx, ky, tx, ty] of [[7, 9, 9.6, 19], [8.6, 5.4, 14.6, 12], [7.6, 1.4, 13, -3.6], [6.6, -1, 10.6, -13]]) for (const sx of [-1, 1]) {
    k += linie(`M${sx * 1.6} 3.6 L${sx * kx} ${ky} L${sx * tx} ${ty}`, "#6b4a2a", 0.85);
    k += linie(`M${r(sx * kx * 0.6)} ${r(3.6 + (ky - 3.6) * 0.6)} l${sx * 0.5} .2 M${r(sx * (kx + tx) / 2)} ${r((ky + ty) / 2)} l${sx * 0.5} .2`, "#d9c29c", 0.6);
  }
  k += `<ellipse cx="0" cy="-4" rx="5.8" ry="7" fill="${S.rg("spinnenleib", [[0, "#b07d46"], [0.7, "#7a5028"], [1, "#4f3218"]], 0.4, 0.35, 0.7)}"/>`;
  /* das weiße Kreuz */
  for (const [x, y] of [[0, -9], [0, -7], [0, -5], [0, -3], [-2, -6], [2, -6], [-3.6, -6.4], [3.6, -6.4], [-1.6, -1.2], [1.6, -1.2]]) k += `<circle cx="${x}" cy="${y}" r=".75" fill="#f6efe0"/>`;
  k += `<path d="M-4.6 -1 Q0 1.4 4.6 -1" stroke="#3a2614" stroke-width=".5" fill="none" opacity=".6"/>`;
  k += `<ellipse cx="0" cy="4.4" rx="3.2" ry="3.6" fill="${S.lg("kopfbrust", [[0, "#8a6038"], [1, "#5a3c20"]])}"/><path d="M0 2 v4" stroke="#3a2614" stroke-width=".5"/>`;
  k += `<circle cx="-.7" cy="7.2" r=".4" fill="#111"/><circle cx=".7" cy="7.2" r=".4" fill="#111"/>`;
  S.teil({ id: "spinne", de: "die Spinne", syl: "SPIN-ne", it: "il ragno", itSyl: "RA-gno", en: "spider", x: NETZ.x, y: NETZ.y, kunst: k,
    tipp: "Acht Beine, und alle sitzen am Vorderkoerper." });
}
{
  /* DIE RAUPE des Tagpfauenauges auf dem Brennnesselblatt */
  let k = "";
  for (let i = 0; i < 11; i++) {
    const x = -15 + i * 3, y = -2.6 - Math.sin(i / 10 * Math.PI) * 1.4;
    k += `<circle cx="${x}" cy="${r(y)}" r="2.7" fill="${S.rg("raupe", [[0, "#3a3a3a"], [1, "#0e0e10"]], 0.4, 0.35, 0.7)}"/>`;
    for (let j = 0; j < 3; j++) k += `<circle cx="${r(x - 1 + j)}" cy="${r(y + 0.4 - j * 0.6)}" r=".28" fill="#f2f2f2"/>`;
    if (i > 0) for (const d of [-1, 0.6]) k += linie(`M${x} ${r(y - 2)} l${d} -2.6 m0 0 l-.7 -.6 m.7 .6 l.6 -.7`, "#141414", 0.32);
    k += linie(`M${x - 0.6} ${r(y + 2.4)} l0 .6`, "#141414", 0.6);
  }
  k += `<circle cx="16.4" cy="-2.8" r="2.4" fill="#141414"/><circle cx="17.6" cy="-3.4" r=".4" fill="#555"/>`;
  S.teil({ oben: true, id: "raupe", de: "die Raupe", syl: "RAU-pe", it: "il bruco", itSyl: "BRU-co", en: "caterpillar", x: 100, y: 89, kunst: `<g transform="rotate(-4) scale(.72)">${k}</g>`,
    tipp: "Aus dieser schwarzen Raupe wird ein Tagpfauenauge." });
}

/* =====================================================================
   SCHMETTERLINGE
   ===================================================================== */
{
  /* DER SCHMETTERLING — Tagpfauenauge, sonnt sich mit offenen Flügeln auf der Distel */
  const RB = S.rg("pfaurot", [[0, "#5a1f16"], [0.25, "#a7341f"], [0.8, "#b8452a"], [1, "#7a2a1a"]], 0.05, 0.5, 1);
  let h = "";
  const vf = "M1.5 -4 C6 -8 14 -14 24 -16 Q27.6 -16 27 -12 C25 -6 22 -1 17 2 C12 3 6 1.5 1.5 0 Z";
  const hf = "M1.5 0 C6 1 14 2 19 4 Q21 6 19.5 10 C17 14 12 18 7 19 C4 19.5 2 15 1.5 6 Z";
  h += `<path d="${hf}" fill="${RB}"/><path d="${vf}" fill="${RB}"/>`;
  h += `<path d="M27 -12 C25 -6 22 -1 17 2" stroke="#3b2a22" stroke-width="1.6" fill="none"/><path d="M19.5 10 C17 14 12 18 7 19" stroke="#4a3a30" stroke-width="2.4" fill="none"/>`;
  /* Vorderrand mit schwarz-gelben Feldern */
  h += `<path d="M6 -7.6 L10.4 -10.6 L11.8 -8.6 L7.4 -6 Z M14 -12.4 L17.6 -14.2 L18.6 -12.4 L15 -10.8 Z" fill="#1d1612"/><path d="M10.6 -10.6 L14 -12.4 L15 -10.8 L11.8 -8.6 Z" fill="#e2c86a"/>`;
  /* Augenfleck Vorderflügel */
  h += `<ellipse cx="20" cy="-9.6" rx="5" ry="4.2" fill="#e6d38a" transform="rotate(-22 20 -9.6)"/><ellipse cx="20.2" cy="-9.6" rx="3.6" ry="3" fill="#4a1a18" transform="rotate(-22 20 -9.6)"/>`;
  for (const [x, y] of [[18.6, -9], [20.6, -11], [22, -9.4], [19.6, -7.8]]) h += `<circle cx="${x}" cy="${y}" r=".7" fill="#7fb2dc"/>`;
  h += `<circle cx="24.6" cy="-13" r=".7" fill="#f4f0e4"/>`;
  /* Augenfleck Hinterflügel */
  h += `<ellipse cx="12.6" cy="9.6" rx="6" ry="5" fill="#c9c2b6" transform="rotate(30 12.6 9.6)"/><ellipse cx="12.6" cy="9.6" rx="5" ry="4.2" fill="#18161a" transform="rotate(30 12.6 9.6)"/>`;
  for (const [x, y] of [[10.6, 8], [12.4, 7.4], [14.4, 8.4], [15, 10.6], [13.6, 12.2]]) h += `<circle cx="${x}" cy="${y}" r=".8" fill="#4f8fc9"/>`;
  h += `<path d="M1.5 -3 C5 -4 9 -4 12 -3 M1.5 1 C5 2 8 4 10 7" stroke="#2a1410" stroke-width=".3" fill="none" opacity=".5"/>`;
  let k = `<g transform="rotate(-8) scale(1 .78)">`;
  k += h + `<g transform="scale(-1 1)">${h}</g>`;
  k += `<ellipse cx="0" cy="6" rx="1.7" ry="7" fill="#2a1e18"/><ellipse cx="0" cy="-2.6" rx="2.3" ry="4.2" fill="#3a2a22"/><circle cx="0" cy="-7.6" r="2" fill="#2a1e18"/>`;
  k += linie("M-.6 -9 Q-2 -14 -4 -17 M.6 -9 Q2 -14 4 -17", "#2a1e18", 0.35) + `<circle cx="-4" cy="-17" r=".6" fill="#2a1e18"/><circle cx="4" cy="-17" r=".6" fill="#2a1e18"/>`;
  k += `</g>`;
  S.teil({ id: "schmetterling", de: "der Schmetterling", syl: "SCHMET-ter-ling", it: "la farfalla", itSyl: "far-FAL-la", en: "butterfly", x: 76, y: 28, kunst: k,
    tipp: "Ein Tagpfauenauge — fuenfeinhalb Zentimeter von Fluegelspitze zu Fluegelspitze." });
}
{
  /* DER ZITRONENFALTER — sitzt mit geschlossenen Flügeln auf der rechten Distel */
  let k = "";
  k += linie("M-1 -1 L-2.6 1 M1.6 -1 L1.2 1.2 M3.6 -1.4 L4.6 .8", "#6b5a3a", 0.35);
  k += `<path d="M-6 -2.6 Q0 -3.8 8 -2.6 Q9 -2 8 -1.4 Q0 -.6 -6 -1.6 Z" fill="#b9b878"/>`;
  k += `<circle cx="8.6" cy="-2.6" r="1.5" fill="#a9a26a"/>` + linie("M9.4 -3.4 Q12 -8 13.6 -11 M9 -3.6 Q11 -8.6 12 -12", "#b0563a", 0.35);
  const wing = "M-4 -3 C-8 -8 -13 -13 -16 -17 L-15.2 -18.6 C-12 -25 -3 -31 7 -33 L10.8 -34.4 C10 -27 8.4 -15 5.6 -6 C4.6 -3.4 0 -2.6 -4 -3 Z";
  k += `<path d="${wing}" fill="${S.lg("zitrone", [[0, "#f3ee8e"], [0.6, "#e6e468"], [1, "#c9cf52"]], 0, 0, 1, 1)}"/>`;
  k += `<path d="M-3 -4 C1 -14 5 -24 10 -33 M-3 -4 C-6 -10 -10 -14 -14.6 -18 M-1 -4 C-2 -12 -2 -20 0 -28 M1 -4 C3 -12 5 -18 8 -24" stroke="#b8b850" stroke-width=".28" fill="none"/>`;
  k += `<circle cx="1.6" cy="-17" r="1" fill="#d9822e"/><circle cx="-6.6" cy="-12" r=".9" fill="#d9822e"/>`;
  k += `<path d="M-4 -3 C-8 -8 -13 -13 -16 -17" stroke="#a9ad46" stroke-width=".5" fill="none"/>`;
  S.teil({ id: "zitronenfalter", de: "der Zitronenfalter", syl: "ZI-tro-nen-fal-ter", it: "la cedronella", itSyl: "ce-dro-NEL-la", en: "brimstone", x: 212, y: 82, kunst: k,
    tipp: "Er ueberwintert als Falter im Laub und ist im Maerz der erste Schmetterling des Jahres." });
}

/* =====================================================================
   TOTHOLZ: Baumstumpf mit dem Hirschkäfer
   ===================================================================== */
{
  let k = schatten(34, BODEN, 34, 3, 0.3);
  k += `<path d="M4 ${BODEN + 2} Q2 130 8 106 L62 106 Q68 130 66 ${BODEN + 2} Z" fill="${S.lg("rinde", [[0, "#4a3a2c"], [0.3, "#6e5a44"], [0.7, "#5a4836"], [1, "#3a2c20"]], 0, 0, 1, 0)}"/>`;
  for (let i = 0; i < 14; i++) { const x = 8 + i * 4.2 + rnd() * 1.6; k += linie(`M${r(x)} 108 Q${r(x + rnd() * 3 - 1.5)} 130 ${r(x + rnd() * 2 - 1)} ${BODEN}`, "#2e2318", 0.9, 0.7); }
  k += `<ellipse cx="35" cy="106" rx="27" ry="6.6" fill="${S.rg("schnitt", [[0, "#c9a878"], [0.6, "#a9875a"], [1, "#7a5a38"]])}"/>`;
  for (const rr of [4, 8, 12, 16, 20, 24]) k += `<ellipse cx="35" cy="106" rx="${rr}" ry="${r(rr * 0.24)}" fill="none" stroke="#7a5a38" stroke-width=".35" opacity=".7"/>`;
  k += linie("M35 106 L58 104 M35 106 L20 111", "#4a3424", 0.6, 0.8);
  /* Moos und Pilze */
  k += `<path d="M6 ${BODEN} Q10 140 18 ${BODEN} Z M50 ${BODEN} Q58 136 66 ${BODEN} Z" fill="#7a9a3c"/>`;
  for (const [x, y] of [[60, 128], [63, 134]]) k += `<path d="M${x} ${y} q4 -3 8 0 Z" fill="#d9b46a"/><path d="M${x + 3} ${y} v2.4" stroke="#e8dcc0" stroke-width="1"/>`;
  S.teil({ id: "baumstumpf", de: "der Baumstumpf", syl: "BAUM-stumpf", it: "il ceppo", itSyl: "CEP-po", en: "tree stump", x: 0, y: 0, kunst: k,
    tipp: "Im morschen Holz alter Eichen wachsen die Larven des Hirschkäfers — fünf Jahre lang." });
}
{
  /* DER KÄFER — Hirschkäfer (Männchen), läuft über die Schnittfläche */
  let k = schatten(0, 0, 18, 1.4, 0.3);
  /* ferne Beine */
  k += linie("M-4 -4 L-8 -1 L-11 0 M2 -4 L1 -1 L-1 0 M8 -4 L10 -1 L13 0", "#1a120c", 0.9);
  k += `<path d="M-16 -6 C-16 -12 -8 -15 4 -14.6 C12 -14 14 -10 14 -6 C12 -3.6 -10 -3.4 -16 -6 Z" fill="${S.lg("deckfluegel", [[0, "#8a4a26"], [0.5, "#5e2e14"], [1, "#3a1a0a"]])}"/>`;
  k += `<path d="M-12 -12 Q0 -15 10 -12" stroke="#c98a5a" stroke-width=".8" fill="none" opacity=".5"/><path d="M-15 -6.4 Q0 -4.6 13.6 -6.4" stroke="#2a1408" stroke-width=".5" fill="none"/>`;
  k += `<path d="M13 -5 C13 -11 16 -13 21 -12.4 C24 -12 24.6 -8 23.6 -5.4 C21 -4 16 -4 13 -5 Z" fill="${S.lg("halsschild", [[0, "#3a3028"], [1, "#120c08"]])}"/>`;
  k += `<path d="M23 -6 C23 -10 25 -12 29 -11.6 C31.6 -11 32 -8 31 -6 C29 -5 25.6 -5 23 -6 Z" fill="#1c140e"/>`;
  /* Geweih (Oberkiefer) */
  k += `<path d="M30 -10 C34 -13 38 -14 42 -18 Q44 -19.6 44.6 -17.6 Q43 -16.4 41.4 -15.4 L42.6 -13.6 Q41.6 -13 40.6 -14 C37 -11 34 -9 31 -8 Z" fill="${S.lg("geweih", [[0, "#9a4e26"], [1, "#5e2a12"]])}"/>`;
  k += `<path d="M37.6 -12.4 l1 -2.2 M35 -11 l.8 -1.8" stroke="#5e2a12" stroke-width=".7"/>`;
  k += linie("M27 -10.6 L27.6 -14 L31 -15.6", "#2a1a10", 0.45) + `<path d="M30.4 -16.2 l1.6 -.6 l-.4 1.2 Z" fill="#2a1a10"/>`;
  k += `<circle cx="27.4" cy="-8.6" r=".8" fill="#0a0806"/>`;
  /* nahe Beine */
  k += linie("M-6 -4.6 L-10 -1.4 L-14 0 M4 -4.6 L4.6 -1.4 L2.4 0 M17 -5 L20 -1.6 L23.6 0", "#2a1a10", 1.1);
  S.teil({ id: "kaefer", de: "der Käfer", syl: "KÄ-fer", it: "lo scarabeo", itSyl: "sca-ra-BE-o", en: "beetle", x: 22, y: 108, kunst: k,
    tipp: "Ein Hirschkaefer: sechs Zentimeter mit dem Geweih — der groesste Kaefer in Deutschland." });
}

/* =====================================================================
   DIE ERDE (Querschnitt) mit dem Regenwurm
   ===================================================================== */
{
  let k = `<path d="M0 ${BODEN} Q60 ${BODEN - 2} 120 ${BODEN} T252 ${BODEN - 1} Q248 176 256 200 L0 200 Z" fill="${S.lg("erde", [[0, "#6a4a30"], [0.4, "#5a3e28"], [1, "#3e2a1a"]])}"/>`;
  k += `<path d="M0 ${BODEN} Q60 ${BODEN - 2} 120 ${BODEN} T252 ${BODEN - 1} L252 ${BODEN + 6} Q120 ${BODEN + 8} 0 ${BODEN + 6} Z" fill="#4a3624" opacity=".7"/>`;
  for (let i = 0; i < 60; i++) { const x = rnd() * 246, y = BODEN + 4 + rnd() * 44; k += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(0.6 + rnd() * 2.4)}" ry="${r(0.5 + rnd() * 1.6)}" fill="${rnd() < 0.5 ? "#8a7a68" : "#a89a84"}" opacity=".8"/>`; }
  /* Wurzeln */
  for (const [x, d] of [[30, 1], [76, -1], [112, 1], [178, -1]]) k += linie(`M${x} ${BODEN} q${d * 4} 10 ${d * 2} 22 q${d * -2} 8 ${d * 4} 16 M${x + d * 3} ${BODEN + 14} q${d * 6} 4 ${d * 10} 3`, "#c9b08a", 0.8, 0.7);
  /* Gang des Regenwurms */
  k += linie("M94 172 C110 166 128 186 146 178 C158 172 168 182 180 176", "#2e1e12", 6.6, 0.6);
  k += linie(`M180 176 Q190 168 194 ${BODEN + 1}`, "#2e1e12", 5, 0.6);
  S.teil({ id: "erde", de: "die Erde", syl: "ER-de", it: "la terra", itSyl: "TER-ra", en: "soil", x: 0, y: 0, kunst: k });
}
{
  /* DER REGENWURM in seinem Gang */
  const d = "M-4 0 C12 -6 30 14 48 6 C60 0 70 10 82 4";
  let k = `<path d="${d}" stroke="${S.lg("wurm", [[0, "#c98a84"], [0.5, "#b87068"], [1, "#a05a54"]], 0, 0, 0, 1)}" stroke-width="4.6" fill="none" stroke-linecap="round"/>`;
  k += `<path d="${d}" stroke="#7a3a36" stroke-width="4.6" fill="none" stroke-dasharray=".25 1.15" opacity=".45"/>`;
  k += `<path d="M14 -1.4 C18 0 21 3 23 4.6" stroke="#e0a49a" stroke-width="5" fill="none" opacity=".85"/>`;
  k += `<path d="${d}" stroke="#fff" stroke-width=".7" fill="none" opacity=".35" transform="translate(0 -1.2)"/>`;
  S.teil({ id: "regenwurm", de: "der Regenwurm", syl: "RE-gen-wurm", it: "il lombrico", itSyl: "lom-BRI-co", en: "earthworm", x: 98, y: 172, kunst: k,
    tipp: "Er frisst sich durch die Erde und lockert sie dabei." });
}

/* =====================================================================
   AM BODEN: Pflaume mit Wespe, Gras (Lupe), Löwenzahn mit Biene, Schnecke
   ===================================================================== */
{
  let k = schatten(0, 0, 14, 1.6, 0.35);
  k += `<ellipse cx="0" cy="-13" rx="14.6" ry="13" fill="${S.rg("pflaume", [[0, "#7a5aa0"], [0.6, "#4a2a6a"], [1, "#2a163e"]], 0.38, 0.32, 0.75)}"/>`;
  k += `<ellipse cx="-4" cy="-19" rx="6" ry="3.4" fill="#b8a8d0" opacity=".35"/><path d="M0 -26 Q2 -14 0 -1" stroke="#2a163e" stroke-width=".6" fill="none" opacity=".6"/>`;
  k += `<path d="M5 -24 Q12 -22 13 -14 Q8 -16 6 -20 Z" fill="#e8b84a"/><path d="M6 -22 Q10 -20 11 -16" stroke="#c9902a" stroke-width=".5" fill="none"/>`;
  k += linie("M-1 -26 q-1 -4 2 -6", "#5a4a2a", 1);
  S.teil({ id: "pflaume", de: "die Pflaume", syl: "PFLAU-me", it: "la prugna", itSyl: "PRU-gna", en: "plum", x: 88, y: BODEN + 1, kunst: k,
    tipp: "Im Spätsommer liegt Fallobst im Gras — die Wespen naschen daran." });
}
{
  /* DIE WESPE auf der Pflaume */
  let k = linie("M-3 -1 L-4 1 M0 -1 L0 1.2 M2 -1.4 L3 .8", "#2a2008", 0.3);
  k += `<path d="M-1.6 -2.6 Q-6 -5 -10 -2.6 Q-11.6 -1.6 -10.4 -.8 Q-6 .4 -2 -1.4 Z" fill="${S.lg("wespeleib", [[0, "#f2c41a"], [1, "#d9a40e"]])}"/>`;
  for (const x of [-3.6, -5.8, -8]) k += `<path d="M${x} -4.2 Q${x - 0.6} -2 ${x} -.4" stroke="#1a1408" stroke-width="1" fill="none"/>`;
  k += `<path d="M-10.6 -1.6 l-1.2 .2" stroke="#1a1408" stroke-width=".4"/>`;
  k += `<ellipse cx="0" cy="-2.6" rx="2.6" ry="2" fill="#1a1408"/><path d="M-1 -4 q1 -.6 2 0" stroke="#f2c41a" stroke-width=".5" fill="none"/>`;
  k += `<circle cx="3.2" cy="-2.6" r="1.7" fill="#f2c41a"/><path d="M3.4 -3.6 Q4.8 -3.6 4.8 -2.4 Q4.2 -1.6 3.4 -2" fill="#1a1408"/>`;
  k += linie("M4 -4 Q5 -6 6.6 -6.4", "#1a1408", 0.3);
  k += `<path d="M0 -4 Q-5 -6.4 -9 -4.6 Q-5 -4.2 0 -3.4 Z" fill="#cfc3a8" opacity=".55" stroke="#7a6a48" stroke-width=".1"/>`;
  S.teil({ oben: true, id: "wespe", de: "die Wespe", syl: "WES-pe", it: "la vespa", itSyl: "VE-spa", en: "wasp", x: 94, y: 125.6, kunst: k,
    tipp: "Schwarz-gelb gestreift und ohne Pelz — die Biene ist zottig, die Wespe glatt." });
}
{
  /* DAS GRAS — Grasbüschel mit Zecke, Ameise und Marienkäfer (Lupe) */
  let k = "";
  const halme = [[124, -18, 98], [128, -6, 106], [132, 4, 96], [136, 12, 112], [140, -10, 116], [144, 18, 104], [148, 8, 120], [152, -4, 110], [156, 14, 124], [130, 22, 122]];
  for (const [x, b, top] of halme) k += `<path d="M${x - 1.2} ${BODEN} Q${r(x + b * 0.3)} ${r((BODEN + top) / 2)} ${x + b} ${top} Q${r(x + b * 0.3 + 1.4)} ${r((BODEN + top) / 2)} ${x + 1.2} ${BODEN} Z" fill="${S.lg("gras", [[0, "#9cbf5c"], [1, "#5f8a34"]], 0, 0, 1, 0)}"/>`;
  /* Zecke an der Halmspitze, Vorderbeine ausgestreckt */
  const zecke = (x, y) => {
    let g = `<g transform="translate(${x} ${y}) rotate(-20)">`;
    g += linie("M-.6 -.4 L-2 -1.6 M-.6 .2 L-2.2 .4 M.4 .3 L1.6 1.2 M.6 -.2 L2 -.6", "#2a1a14", 0.22);
    g += linie("M0 -1 L-.6 -3.4 M.4 -1 L1.4 -3.2", "#2a1a14", 0.22);
    g += `<ellipse cx="0" cy=".6" rx="1.3" ry="1.6" fill="#7a2a1e"/><ellipse cx="0" cy="-.6" rx="1" ry=".8" fill="#1a100c"/><path d="M0 -1.4 v-.6" stroke="#1a100c" stroke-width=".4"/>`;
    return g + `</g>`;
  };
  /* Ameise klettert am Halm */
  const ameise = (x, y, a) => {
    let g = `<g transform="translate(${x} ${y}) rotate(${a})">`;
    g += linie("M-.2 0 L-1.6 1.6 M.4 0 L.4 1.8 M1 0 L2.2 1.6", "#2a140c", 0.22);
    g += `<ellipse cx="-3" cy="-.2" rx="2" ry="1.5" fill="#1e1410"/><circle cx="-.9" cy="-.4" r=".5" fill="#6a2a14"/>`;
    g += `<ellipse cx=".6" cy="-.4" rx="1.6" ry=".8" fill="#8a3a1c"/><ellipse cx="3" cy="-.6" rx="1.1" ry="1" fill="#5a2410"/>`;
    g += linie("M3.6 -1.2 L4.8 -2.6 L6 -2", "#2a140c", 0.2);
    return g + `</g>`;
  };
  const kaefer7 = (x, y) => {
    let g = `<g transform="translate(${x} ${y})">`;
    g += `<path d="M-3.4 0 Q-3.4 -4.4 0 -4.4 Q3.4 -4.4 3.4 0 Z" fill="${S.rg("marien", [[0, "#ff5a3a"], [0.7, "#d61e12"], [1, "#9a0e08"]], 0.4, 0.3, 0.8)}"/>`;
    g += `<path d="M0 -4.4 V0" stroke="#1a0c08" stroke-width=".3"/>`;
    for (const [dx, dy] of [[-1.8, -2.6], [1.8, -2.6], [-2.2, -1], [2.2, -1], [-.8, -3.6], [.8, -3.6], [0, -1.6]]) g += `<circle cx="${dx}" cy="${dy}" r=".55" fill="#1a0c08"/>`;
    g += `<path d="M3.2 -.2 Q4.6 -1.6 5 -.4 Q4.6 .2 3.2 .2 Z" fill="#1a0c08"/><circle cx="4.2" cy="-.9" r=".35" fill="#f4f0e6"/>`;
    g += `<ellipse cx="-1" cy="-3.4" rx="1.2" ry=".5" fill="#fff" opacity=".5"/>`;
    return g + `</g>`;
  };
  k += zecke(136, 96.4) + ameise(137.4, 137, -76) + kaefer7(152.6, 127);
  S.teil({ id: "gras", de: "das Gras", syl: "GRAS", it: "l'erba", itSyl: "ER-ba", en: "grass", x: 0, y: 0, kunst: k,
    zoom: { x: 110, y: 92, w: 69, h: 46 },
    unter: [
      { id: "zecke", de: "die Zecke", syl: "ZE-cke", it: "la zecca", itSyl: "ZEC-ca", en: "tick", x: 136, y: 97, kunst: flaeche(-3, -4.4, 6, 6),
        tipp: "Dreieinhalb Millimeter — das kleinste Tier hier. Sie sitzt im Gras und wartet." },
      { id: "ameise", de: "die Ameise", syl: "A-mei-se", it: "la formica", itSyl: "for-MI-ca", en: "ant", x: 137.4, y: 138, kunst: flaeche(-3, -7, 6, 10),
        tipp: "Neun Millimeter. Sechs Beine, und alle sitzen an der Brust." },
      { id: "marienkaefer", de: "der Marienkäfer", syl: "ma-RI-en-kä-fer", it: "la coccinella", itSyl: "coc-ci-NEL-la", en: "ladybird", x: 153, y: 127, kunst: flaeche(-4, -5, 9.6, 6),
        tipp: "Sieben schwarze Punkte auf roten Flügeldecken — er frisst Blattläuse." }] });
}
{
  /* DER LÖWENZAHN mit Blattrosette */
  const x = 184, top = 106;
  let k = "";
  for (const [d, l] of [[-1, 30], [1, 34], [-1, 22], [1, 20]]) {
    let p = `M${x} ${BODEN}`;
    for (let i = 1; i <= 6; i++) p += ` L${r(x + d * i * l / 6)} ${r(BODEN - 3 - (i % 2 ? 4 : 1.4) - i * 0.6)}`;
    p += ` Q${r(x + d * l * 0.6)} ${BODEN} ${x} ${BODEN} Z`;
    k += `<path d="${p}" fill="${S.lg("lzblatt", [[0, "#7fa84a"], [1, "#4f7a2e"]])}"/>`;
  }
  k += `<path d="M${x} ${BODEN} Q${x - 4} 130 ${x} ${top + 4}" stroke="#9ab86a" stroke-width="2" fill="none"/>`;
  k += `<path d="M${x - 5} ${top + 3} Q${x} ${top + 9} ${x + 5} ${top + 3} Z" fill="#6f9440"/>`;
  for (let i = 0; i < 26; i++) { const a = -Math.PI + i / 25 * Math.PI, l = 15 + (i % 3) * 1.6; k += `<path d="M${x} ${top + 2} L${r(x + Math.cos(a) * l)} ${r(top + 2 + Math.sin(a) * l * 0.55)}" stroke="${i % 2 ? "#f6c919" : "#f2b80c"}" stroke-width="2.2" stroke-linecap="round"/>`; }
  for (let i = 0; i < 12; i++) { const a = -Math.PI + i / 11 * Math.PI; k += `<path d="M${x} ${top + 1} L${r(x + Math.cos(a) * 8)} ${r(top + 1 + Math.sin(a) * 5)}" stroke="#f9d84a" stroke-width="1.6" stroke-linecap="round"/>`; }
  S.teil({ id: "loewenzahn", de: "der Löwenzahn", syl: "LÖ-wen-zahn", it: "il tarassaco", itSyl: "ta-RAS-sa-co", en: "dandelion", x: 0, y: 0, kunst: k,
    tipp: "Seine Blätter haben Zacken wie Löwenzähne — daher der Name." });
}
{
  /* DIE BIENE (Honigbiene) auf dem Löwenzahn, mit Pollenhöschen */
  let k = linie("M-3 -1 L-4.6 .6 M0 -1 L-.4 .8 M2 -1.2 L3 .6", "#2a1c10", 0.35);
  k += `<ellipse cx="-2.6" cy="-.4" rx="1.3" ry="1" fill="#f0a020"/>`;
  k += `<ellipse cx="-4.8" cy="-3" rx="4.2" ry="2.8" fill="${S.lg("bienenleib", [[0, "#c98a2a"], [1, "#8a5a1a"]])}" transform="rotate(14 -4.8 -3)"/>`;
  for (const x of [-3.6, -5.4, -7.2]) k += `<path d="M${x} -5.6 Q${x - 0.8} -3 ${x} -.6" stroke="#3a2410" stroke-width=".8" fill="none"/>`;
  k += `<circle cx="0" cy="-3.6" r="2.6" fill="${S.rg("bienenpelz", [[0, "#c9a060"], [1, "#7a5a2a"]])}"/>`;
  for (let i = 0; i < 10; i++) { const a = rnd() * 6.28; k += `<path d="M${r(Math.cos(a) * 2.2)} ${r(-3.6 + Math.sin(a) * 2.2)} l${r(Math.cos(a) * 0.7)} ${r(Math.sin(a) * 0.7)}" stroke="#d9b880" stroke-width=".25"/>`; }
  k += `<ellipse cx="3.2" cy="-3.2" rx="1.6" ry="1.8" fill="#2a1c10"/><ellipse cx="3.4" cy="-3.6" rx=".8" ry="1" fill="#4a3a2a"/>`;
  k += linie("M4 -4.6 L5.2 -6.4 L6.4 -6", "#2a1c10", 0.3);
  k += `<ellipse cx="-3.4" cy="-6.6" rx="4.6" ry="1.6" fill="${FLUEGEL}" stroke="#8a8a80" stroke-width=".1" transform="rotate(-14 -3.4 -6.6)"/>`;
  S.teil({ oben: true, id: "biene", de: "die Biene", syl: "BIE-ne", it: "l'ape", itSyl: "A-pe", en: "bee", x: 186, y: 101, kunst: k,
    tipp: "An den Hinterbeinen traegt sie die Pollenhoeschen." });
}
{
  /* DIE SCHNECKE — Weinbergschnecke, kriecht über den Boden */
  let k = schatten(0, 0, 30, 1.6, 0.3);
  k += `<path d="M-34 0 Q-20 -3 0 -4 Q20 -6 30 -8 Q36 -9 37 -5 Q37 -1 32 0 Z" fill="${S.lg("schneckenfuss", [[0, "#d9c8a8"], [1, "#a9967a"]])}"/>`;
  for (let i = 0; i < 18; i++) k += `<path d="M${-30 + i * 3.6} ${r(-1 - Math.min(i, 14) * 0.25)} l1.6 -.8" stroke="#8a7a5e" stroke-width=".35"/>`;
  k += linie("M32 -7.6 Q36 -16 41 -22 M30 -7.6 Q32 -15 34.6 -21", "#c9b896", 1.3) + `<circle cx="41" cy="-22" r="1.1" fill="#3a3024"/><circle cx="34.6" cy="-21" r="1" fill="#3a3024"/>`;
  k += linie("M36 -4 L40 -2.6 M35.4 -5.4 L39.6 -5.4", "#c9b896", 1);
  /* Gehäuse mit Windungen */
  k += `<circle cx="-2" cy="-22" r="18.5" fill="${S.rg("haus", [[0, "#e2c99a"], [0.6, "#b98f5a"], [1, "#7a5a32"]], 0.4, 0.35, 0.75)}"/>`;
  let sp = "M-2 -22";
  for (let t = 0; t < 3.2 * Math.PI * 2; t += 0.3) { const rr = 1 + t * 0.85; sp += ` L${r(-2 + Math.cos(t) * rr)} ${r(-22 + Math.sin(t) * rr)}`; }
  k += linie(sp, "#6a4a28", 0.9, 0.8);
  for (const rr of [8, 13]) k += `<circle cx="-2" cy="-22" r="${rr}" fill="none" stroke="#8a6a3e" stroke-width="2.2" opacity=".35"/>`;
  k += `<path d="M-14 -34 Q-6 -40 4 -38" stroke="#fff" stroke-width="1.2" fill="none" opacity=".35"/>`;
  S.teil({ id: "schnecke", de: "die Schnecke", syl: "SCHNE-cke", it: "la lumaca", itSyl: "lu-MA-ca", en: "snail", x: 212, y: BODEN - 2, kunst: k,
    tipp: "Vier Fuehler: zwei lange mit den Augen, zwei kurze zum Tasten." });
}

/* =====================================================================
   IN DER LUFT: Libelle über dem Teich, Schnake
   ===================================================================== */
{
  /* DIE LIBELLE — Blaugrüne Mosaikjungfer im Flug (nach links) */
  let k = "";
  const fl = (a, l, w, o) => `<g transform="rotate(${a})"><ellipse cx="${l / 2}" cy="0" rx="${l / 2}" ry="${w}" fill="${FLUEGEL}" stroke="#7a6a50" stroke-width=".18" opacity="${o}"/>` +
    `<path d="M2 0 L${l - 2} 0 M3 ${-w * 0.4} L${l - 4} ${-w * 0.3} M3 ${w * 0.4} L${l - 6} ${w * 0.4}" stroke="#8a7a5a" stroke-width=".12" opacity="${o}"/><rect x="${l - 6}" y="${-w * 0.7}" width="2.4" height="1" fill="#4a3a2a" opacity="${o}"/></g>`;
  k += `<g transform="translate(0 -3)">${fl(-150, 44, 5, 0.6)}${fl(-118, 46, 4.4, 0.6)}</g>`;
  /* Hinterleib, Brust, Kopf */
  k += `<path d="M-4 -1.6 L-56 1.2 Q-58 2 -56 2.8 L-4 2 Z" fill="${S.lg("libhl", [[0, "#3a2e22"], [1, "#2a2018"]])}"/>`;
  for (let i = 0; i < 8; i++) { const x = -8 - i * 6; k += `<ellipse cx="${x}" cy="${r(-0.6 + i * 0.16)}" rx="1.6" ry=".9" fill="${i < 6 ? "#7ac8d0" : "#4fa0c8"}"/><path d="M${x - 2.8} ${r(-1.4 + i * 0.17)} v${r(3.4 - i * 0.1)}" stroke="#14100c" stroke-width=".4"/>`; }
  k += `<ellipse cx="2" cy="0" rx="7" ry="5.4" fill="${S.lg("libbrust", [[0, "#5a4a30"], [1, "#2a2018"]])}"/>`;
  k += `<path d="M-1 -4 L1 3 M3 -4.4 L5 3" stroke="#8fcf5a" stroke-width="1.3"/>`;
  k += `<ellipse cx="10" cy="-.4" rx="4.4" ry="4.8" fill="${S.rg("libauge", [[0, "#8ad8e0"], [0.7, "#3a8aa0"], [1, "#1f5a6a"]], 0.35, 0.3, 0.7)}"/><circle cx="9" cy="-2" r="1" fill="#fff" opacity=".55"/>`;
  k += `<path d="M12.6 2 Q14 3.6 12 4.4 Q10.4 4 11 2.6 Z" fill="#c9c06a"/>`;
  k += linie("M2 4.6 L4 8 M5 4.4 L8 7.4 M-1 4.4 L0 7.6", "#1a140e", 0.5);
  k += `<g transform="translate(0 -3)">${fl(-142, 44, 5, 0.85)}${fl(-108, 46, 4.4, 0.85)}</g>`;
  S.teil({ id: "libelle", de: "die Libelle", syl: "Li-BEL-le", it: "la libellula", itSyl: "li-BEL-lu-la", en: "dragonfly", x: 250, y: 74, kunst: `<g transform="scale(-1 1)">${k}</g>`,
    tipp: "Sieben Zentimeter lang — das groesste Insekt hier, und sie fliegt auch rueckwaerts." });
}
{
  /* DIE SCHNAKE (Kohlschnake) im Flug: lange, dünne Beine */
  let k = "";
  for (const [x0, a, b] of [[1, 8, 34], [0, 2, 38], [-1, -6, 36], [1.4, 14, 30], [-0.6, -12, 34], [0.4, 18, 28]]) {
    const kx = x0 + a * 0.4, ky = b * 0.45;
    k += linie(`M${x0} 1 L${r(kx)} ${r(ky)} L${r(x0 + a)} ${b}`, "#5a4a36", 0.35);
  }
  k += `<path d="M-1 0 L-22 3.6 Q-23.4 4.4 -22 5 L-1 1.8 Z" fill="${S.lg("schnakenleib", [[0, "#8a7a5a"], [1, "#5a4a32"]])}"/>`;
  k += `<ellipse cx="1" cy=".6" rx="3.4" ry="2.4" fill="#6a5a40"/><circle cx="5" cy=".6" r="1.4" fill="#4a3a28"/><path d="M6 .6 L8 1.6" stroke="#4a3a28" stroke-width=".6"/>`;
  k += linie("M5.4 -.4 Q7 -3 8.4 -4", "#4a3a28", 0.25);
  k += `<ellipse cx="-8" cy="-5" rx="11" ry="1.8" fill="${FLUEGEL}" stroke="#8a7a5a" stroke-width=".15" transform="rotate(-24 0 0)"/><ellipse cx="-8" cy="-2" rx="11" ry="1.6" fill="${FLUEGEL}" stroke="#8a7a5a" stroke-width=".12" opacity=".7" transform="rotate(-6 0 0)"/>`;
  k += `<circle cx="-1.6" cy="-1.4" r=".6" fill="#8a7a5a"/>`;
  S.teil({ id: "schnake", de: "die Schnake", syl: "SCHNA-ke", it: "la zanzarone", itSyl: "zan-za-RO-ne", en: "crane fly", x: 236, y: 22, kunst: k,
    tipp: "Lange Beine, und sie sticht nicht — das tut nur die Muecke." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/kleintiere.js"));
console.log(aus);
