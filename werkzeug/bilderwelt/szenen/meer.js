#!/usr/bin/env node
/* =====================================================================
   IM MEER (FASSUNG 852) — Bilderwelt neu
   ---------------------------------------------------------------------
   Der Blick halb über, halb unter die Wasseroberfläche: oben Himmel,
   Möwen, Fischkutter und der Leuchtturm auf der Felsinsel, unten das
   offene Meer bis zum Meeresboden.

   RECHERCHE (Umwelt im Unterricht „Meeresbewohner“, WWF „Fische im
   Wattenmeer“, NABU Ostsee/Nordsee, GEOMAR):
   - Im kühlen Nordatlantik und an seinen Küsten leben SEEHUNDE (Robben),
     HERINGE in großen Schwärmen, OHRENQUALLEN (98 % Wasser, harmlos),
     auf dem Grund STRANDKRABBEN, SEESTERNE und MIESMUSCHELBÄNKE;
     auf Felsen wächst BLASENTANG (Braunalge mit Luftbläschen).
   - Buckelwale ziehen durch den Nordatlantik (auch Sichtungen in der
     Nordsee); Delfine springen an der Oberfläche; der Weiße Hai lebt im
     offenen Atlantik.
   - Licht fällt in Strahlen von oben ein, nach unten wird das Wasser
     dunkelblau; ferne Tiere verschwimmen im Blau.
   Maßstab nach Tiefe: Wal und Hai in der Mitte ≈ 10 Einheiten je Meter
   (Wal 14 m, Hai 5 m), vorne ≈ 25–60 je Meter (Hering, Qualle, Krabbe).
   Die kleinen Tiere am Grund liegen in der Lupe „Meeresboden“.
   ===================================================================== */
"use strict";
const path = require("path");
const B = require("../bau");
const { neueSzene, flaeche, schatten, zufall } = B;
const { tierBaukasten } = require("./zoo.js");
const r = B.r;

const S = neueSzene({ id: "meer", titel: "Im Meer", emoji: "🐬", thema: "Natur", kuerzel: "b19e", fassung: 852 });
const rnd = zufall(1494);
const T = tierBaukasten(S);
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const WL = 48;       /* Wasserlinie */
const tr = (x, y, inner, extra = "") => `<g transform="translate(${r(x)} ${r(y)})${extra}">${inner}</g>`;

/* =====================================================================
   KULISSE: Himmel, Horizont, Unterwasser mit Lichtstrahlen
   ===================================================================== */
S.hinten(`<rect width="320" height="${WL}" fill="${S.lg("himmel", [[0, "#6fa8d8"], [0.7, "#bcd8ea"], [1, "#e4eef0"]])}"/>`);
S.hinten(`<rect x="0" y="${WL - 8}" width="320" height="8" fill="${S.lg("ferne", [[0, "#5f90ac"], [1, "#4a83a0"]])}"/>` + [...Array(14)].map((_, i) => `<path d="M${r(rnd() * 300)} ${r(WL - 7 + rnd() * 6)} h${r(4 + rnd() * 10)}" stroke="#d6eef4" stroke-width=".35" opacity=".6"/>`).join(""));
{
  /* Unterwasser: von Türkis nach Tiefblau */
  let g = `<rect x="0" y="${WL}" width="320" height="${200 - WL}" fill="${S.lg("wasser", [[0, "#3f9ab0"], [0.35, "#2a7894"], [0.75, "#1a4f70"], [1, "#123a56"]])}"/>`;
  for (let i = 0; i < 7; i++) { const x = 20 + i * 46 + rnd() * 20; g += `<path d="M${r(x)} ${WL} L${r(x + 14)} ${WL} L${r(x + 50)} 200 L${r(x + 22)} 200 Z" fill="${S.lg("strahl", [[0, "#eaffff", 0.22], [1, "#eaffff", 0]])}"/>`; }
  for (let i = 0; i < 50; i++) g += `<circle cx="${r(rnd() * 320)}" cy="${r(WL + 4 + rnd() * 140)}" r="${r(0.2 + rnd() * 0.4)}" fill="#dff4f8" opacity="${r(0.2 + rnd() * 0.4)}"/>`;
  /* Lichtnetz unter der Oberfläche */
  for (let i = 0; i < 16; i++) { const x = rnd() * 320, y = WL + 2 + rnd() * 10; g += `<path d="M${r(x)} ${r(y)} q4 -1.6 8 0 q4 1.6 8 0" stroke="#bff0f6" stroke-width=".4" fill="none" opacity=".35"/>`; }
  S.hinten(g);
}

/* =====================================================================
   ÜBER DEM WASSER: Sonne, Wolke, Leuchtturm, Schiff, Möwen
   ===================================================================== */
S.teil({ id: "sonne", de: "die Sonne", syl: "SON-ne", it: "il sole", itSyl: "SO-le", en: "sun", x: 40, y: 14,
  kunst: `<circle r="14" fill="${S.rg("sonnenschein", [[0, "#fff8d0", 0.7], [1, "#fff8d0", 0]])}"/><circle r="6" fill="${S.rg("sonne", [[0, "#fffef0"], [1, "#ffe9a0"]])}"/>` });
S.teil({ id: "wolke", de: "die Wolke", syl: "WOL-ke", it: "la nuvola", itSyl: "NU-vo-la", en: "cloud", x: 150, y: 14,
  kunst: `<g fill="${S.lg("wolke", [[0, "#ffffff"], [1, "#dfe8ee"]])}"><ellipse cx="0" cy="2" rx="26" ry="5"/><ellipse cx="-10" cy="-1" rx="10" ry="6"/><ellipse cx="4" cy="-3" rx="12" ry="7.4"/><ellipse cx="16" cy="0" rx="8" ry="4.6"/></g>` });
{
  /* DER LEUCHTTURM auf der Felsinsel (rot-weiß, mit Wärterhaus) */
  let k = `<path d="M-30 0 Q-26 -6 -16 -7 Q-6 -10 6 -8 Q18 -9 26 -4 Q30 -2 32 0 Z" fill="${S.lg("insel", [[0, "#8a8a7a"], [1, "#5a5e58"]])}"/>`;
  k += `<path d="M-22 -6 Q-10 -9 4 -7.6" stroke="#b9b8a6" stroke-width=".6" fill="none" opacity=".7"/>`;
  k += `<rect x="-14" y="-12" width="10" height="5" fill="#efe9dc"/><path d="M-15 -12 L-9 -15.4 L-3 -12 Z" fill="#a8422e"/><rect x="-11" y="-10.4" width="1.6" height="1.6" fill="#5a6a7a"/>`;
  k += `<path d="M0 -8 L1.6 -34 L6.4 -34 L8 -8 Z" fill="#f4f1ea"/>`;
  for (const y of [-14, -24]) k += `<path d="M${r(0 + (-8 - y) * 0.06)} ${y} L${r(8 - (-8 - y) * 0.06)} ${y} L${r(8 - (-8 - y + 5) * 0.06)} ${y - 5} L${r(0 + (-8 - y + 5) * 0.06)} ${y - 5} Z" fill="#c43a2a"/>`;
  k += `<path d="M0 -8 L8 -8 L8 -10 L0 -10 Z" fill="#c43a2a"/>`;
  k += `<rect x=".6" y="-35.4" width="6.8" height="1.4" fill="#2a2a2a"/><rect x="1.8" y="-39.6" width="4.4" height="4.2" fill="#e8f2f4" stroke="#2a2a2a" stroke-width=".4"/><path d="M1.2 -39.6 L4 -42.6 L6.8 -39.6 Z" fill="#2a2a2a"/>`;
  k += `<path d="M6 -38 L26 -42 L26 -34 Z" fill="#fff6c8" opacity=".35"/>`;
  k += `<path d="M2 -12 L2.6 -30" stroke="#fff" stroke-width=".6" opacity=".5"/>`;
  S.teil({ id: "leuchtturm", de: "der Leuchtturm", syl: "LEUCHT-turm", it: "il faro", itSyl: "FA-ro", en: "lighthouse", x: 270, y: WL, kunst: k,
    tipp: "Nachts zeigt das Licht des Leuchtturms den Schiffen den Weg." });
}
{
  /* DAS SCHIFF — Fischkutter mit Auslegern am Horizont */
  let k = `<path d="M-14 -2 L14 -2 Q12 1.6 8 2 L-11 2 Q-13 1 -14 -2 Z" fill="#2f5a7a"/><path d="M-14 -2 L14 -2 L13.6 -1 L-13.6 -1 Z" fill="#f2f2ee"/>`;
  k += `<rect x="2" y="-8" width="7" height="6" fill="#f2f2ee"/><rect x="3" y="-7" width="5" height="1.6" fill="#3a4a5a"/><rect x="5" y="-11" width="1" height="3" fill="#c43a2a"/>`;
  k += `<path d="M-4 -2 L-4 -16 M-4 -15 L-14 -6 M-4 -15 L6 -14" stroke="#3a3a3a" stroke-width=".6"/><path d="M-14 -6 L-15 -1 M6 -14 L13 -4" stroke="#3a3a3a" stroke-width=".3"/>`;
  k += `<path d="M-16 2.6 Q0 1.4 16 2.6" stroke="#e8f2f4" stroke-width=".5" fill="none"/>`;
  S.teil({ id: "schiff", de: "das Schiff", syl: "SCHIFF", it: "la nave", itSyl: "NA-ve", en: "ship", x: 96, y: WL - 3, kunst: k,
    tipp: "Ein Fischkutter: mit den Netzen an den Auslegern fängt er Fische und Krabben." });
}
{
  /* DIE MÖWE — zwei Silbermöwen über dem Wasser */
  let k = tr(0, 0, T.moewe(30, -1, 0.4)) + tr(30, 10, T.moewe(24, -1, -1.2));
  S.teil({ id: "moewe", de: "die Möwe", syl: "MÖ-we", it: "il gabbiano", itSyl: "gab-BIA-no", en: "seagull", x: 196, y: 24, kunst: k,
    tipp: "Sie fliegt ueber dem Wasser und holt sich die Fische dicht unter der Oberflaeche." });
}

/* =====================================================================
   UNTER WASSER, hinten: Wal (blau verschleiert), Hai
   ===================================================================== */
S.teil({ id: "wal", de: "der Wal", syl: "WAL", it: "la balena", itSyl: "ba-LE-na", en: "whale", x: 196, y: 112,
  kunst: `<g opacity=".78">${T.wal(10, -1)}</g>`,
  tipp: "Ein Buckelwal — vierzehn Meter lang, das groesste Tier im Bild." });
S.teil({ id: "hai", de: "der Hai", syl: "HAI", it: "lo squalo", itSyl: "SQUA-lo", en: "shark", x: 92, y: 124,
  kunst: `<g opacity=".9">${T.hai(10.4)}</g>`,
  tipp: "Fuenf Meter lang: gross, aber nicht einmal halb so lang wie der Wal." });

/* DIE WELLE — die Wasseroberfläche (Querschnitt) mit Wellenkämmen */
{
  let top = `M0 ${WL}`;
  for (let x = 0; x < 320; x += 10) top += ` Q${x + 5} ${WL - 2.4} ${x + 10} ${WL}`;
  let k = `<path d="${top} L320 ${WL + 2.4} L0 ${WL + 2.4} Z" fill="${S.lg("oberflaeche", [[0, "#6fb0c4"], [1, "#3f9ab0", 0.6]])}"/>`;
  k += `<path d="${top}" stroke="#f2fbfc" stroke-width=".6" fill="none"/>`;
  for (let x = 6; x < 320; x += 23) k += `<path d="M${x} ${WL - 1.4} q2 -1.4 4 -.4" stroke="#fff" stroke-width=".5" fill="none" opacity=".8"/>`;
  k += `<path d="M0 ${WL + 1.2} H320" stroke="#c9eef4" stroke-width=".5" opacity=".7"/>`;
  S.teil({ id: "welle", de: "die Welle", syl: "WEL-le", it: "l'onda", itSyl: "ON-da", en: "wave", x: 0, y: 0, kunst: k,
    tipp: "Wellen macht der Wind: je stärker er weht, desto höher werden sie." });
}

/* =====================================================================
   OBERFLÄCHENNAH: Delfine (einer springt), Robbe
   ===================================================================== */
{
  let k = tr(0, 0, T.delfin(13, 1, 28));
  k += `<path d="M-16 ${WL - 56 + 0} q4 -3 8 0" stroke="#fff" stroke-width=".5" fill="none"/>`;
  k += tr(-24, 18, `<g opacity=".92">${T.delfin(12, 1, -6)}</g>`);
  /* Spritzer am Durchstoßpunkt */
  k += `<path d="M-14 ${-4} q-2 -5 -5 -6 M-12 -4 q0 -6 2 -8 M-10 -4 q3 -4 6 -4" stroke="#f4fcfd" stroke-width=".6" fill="none"/>`;
  S.teil({ id: "delfin", de: "der Delfin", syl: "Del-FIN", it: "il delfino", itSyl: "del-FI-no", en: "dolphin", x: 150, y: WL - 1, kunst: k,
    tipp: "Die Schwanzflosse liegt waagrecht — der Delfin ist kein Fisch." });
}
{
  /* DIE ROBBE — ein Seehund taucht dicht unter der Oberfläche */
  const F = S.lg("seehund", [[0, "#6f7478"], [0.6, "#9aa0a2"], [1, "#c9cbc8"]]);
  const d = "M-8 0 C-6 -2.2 0 -3.2 4 -2.8 C6.4 -2.6 7.6 -2.2 8.4 -1.8 Q9.6 -2.2 10.3 -1.4 Q10.9 -.6 10.6 .1 Q10.3 .7 9.6 .8 Q8.6 1.2 7.4 1.4 C4 2.6 -2 2.6 -6 1.4 Q-8 .8 -8 0 Z";
  let k = `<path d="M-7.6 -.4 L-11.2 -2.2 Q-11.8 -.8 -11 0 Q-11.8 .8 -11.2 2.2 L-7.6 .6 Z" fill="#5f6468"/>`;
  k += `<path d="${d}" fill="${F}"/>`;
  for (let i = 0; i < 18; i++) { const x = -6 + rnd() * 13, y = -1.8 + rnd() * 2.6; k += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(0.2 + rnd() * 0.3)}" ry="${r(0.15 + rnd() * 0.2)}" fill="#3e4246" opacity=".7"/>`; }
  k += `<path d="M3.6 1.6 Q3 3.6 1.2 4 Q2.4 2.6 2.4 1.6 Z" fill="#5f6468"/>`;
  k += `<ellipse cx="8.9" cy="-1.2" rx=".42" ry=".36" fill="#141618"/><circle cx="9" cy="-1.3" r=".12" fill="#fff"/><ellipse cx="10.5" cy="-.5" rx=".22" ry=".14" fill="#141618"/>`;
  k += `<path d="M10.2 -.1 l1.2 -.3 M10.2 .1 l1.3 .2 M10.1 .3 l1.1 .5" stroke="#e8e8e2" stroke-width=".06"/>`;
  k += `<path d="M-6 -1.2 Q0 -3 6 -2.4" stroke="#fff" stroke-width=".3" fill="none" opacity=".3"/>`;
  S.teil({ id: "robbe", de: "die Robbe", syl: "ROB-be", it: "la foca", itSyl: "FO-ca", en: "seal", x: 56, y: 68, kunst: `<g transform="scale(2.1) rotate(8)">${k}</g>`,
    tipp: "Ein Seehund: er kann bis zu einer halben Stunde tauchen, bevor er Luft holt." });
}

/* =====================================================================
   VORNE: Heringsschwarm, Quallen
   ===================================================================== */
{
  let k = "";
  for (let i = 0; i < 26; i++) {
    const a = rnd() * Math.PI * 2, d = Math.sqrt(rnd());
    const x = Math.cos(a) * d * 30, y = Math.sin(a) * d * 14;
    k += tr(x, y, T.fisch(21 + rnd() * 3, -1), ` rotate(${Math.round(rnd() * 10 - 5)})`);
  }
  S.teil({ id: "fisch", de: "der Fisch", syl: "FISCH", it: "il pesce", itSyl: "PE-sce", en: "fish", x: 268, y: 84, kunst: k,
    tipp: "Heringe schwimmen nie allein, sondern mit Tausenden in einem Schwarm." });
}
{
  let k = tr(0, 0, T.qualle(26)) + tr(-232, -40, T.qualle(18));
  S.teil({ id: "qualle", de: "die Qualle", syl: "QUAL-le", it: "la medusa", itSyl: "me-DU-sa", en: "jellyfish", x: 270, y: 132, kunst: k,
    tipp: "Eine Ohrenqualle: sie besteht fast nur aus Wasser und treibt mit der Strömung." });
}

/* =====================================================================
   DER MEERESBODEN: Sand, Felsen mit Blasentang, Lupe mit Krabbe,
   Seestern und Muscheln
   ===================================================================== */
{
  let k = `<path d="M0 172 Q40 166 90 170 Q150 176 200 168 Q260 162 320 170 L320 200 L0 200 Z" fill="${S.lg("sand", [[0, "#b9a77a"], [1, "#8a7a56"]])}"/>`;
  for (let i = 0; i < 9; i++) { const y = 176 + i * 2.8; k += `<path d="M0 ${y} Q40 ${y - 2} 80 ${y} T160 ${y} T240 ${y} T320 ${y}" stroke="#a8966a" stroke-width=".4" fill="none" opacity=".7"/>`; }
  for (let i = 0; i < 24; i++) k += `<ellipse cx="${r(rnd() * 320)}" cy="${r(174 + rnd() * 24)}" rx="${r(0.4 + rnd())}" ry="${r(0.3 + rnd() * 0.5)}" fill="#e8dcc0" opacity=".7"/>`;
  /* Lupen-Tiere, im ganzen Bild mitgemalt */
  const krabbe = (x, y) => {
    let g = `<g transform="translate(${x} ${y})">`;
    for (const s of [-1, 1]) for (let i = 0; i < 4; i++) g += `<path d="M${s * 1.6} -.6 L${r(s * (3 + i * 0.6))} ${r(-1.6 + i * 0.5)} L${r(s * (4 + i * 0.7))} 0" stroke="#4a5a2a" stroke-width=".4" fill="none"/>`;
    g += `<path d="M-3 -1.4 Q-3 -3.6 0 -3.8 Q3 -3.6 3 -1.4 Q2 -.4 0 -.4 Q-2 -.4 -3 -1.4 Z" fill="${S.lg("krabbe", [[0, "#7a8a3a"], [1, "#4f5a26"]])}"/>`;
    for (const s of [-1, 1]) g += `<path d="M${s * 2.4} -2.4 L${s * 3.6} -3.6" stroke="#5a6a2a" stroke-width=".6"/><ellipse cx="${s * 4.2}" cy="-4.2" rx="1.1" ry=".7" fill="#6a7a30" transform="rotate(${s * 30} ${s * 4.2} -4.2)"/>`;
    g += `<circle cx="-.6" cy="-3.7" r=".25" fill="#111"/><circle cx=".6" cy="-3.7" r=".25" fill="#111"/>`;
    return g + `</g>`;
  };
  const seestern = (x, y) => {
    let p = "";
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? 1.4 : 5; p += (i ? " L" : "M") + r(x + Math.cos(a) * rr) + " " + r(y + Math.sin(a) * rr * 0.55); }
    let g = `<path d="${p} Z" fill="${S.rg("seestern", [[0, "#f0a050"], [1, "#c8682a"]])}" stroke="#a8541e" stroke-width=".2" stroke-linejoin="round"/>`;
    for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i * Math.PI * 2 / 5; g += `<path d="M${x} ${y} L${r(x + Math.cos(a) * 4)} ${r(y + Math.sin(a) * 2.2)}" stroke="#f6d0a0" stroke-width=".3" stroke-dasharray=".3 .3"/>`; }
    return g;
  };
  const muscheln = (x, y) => {
    let g = "";
    for (const [dx, dy, a] of [[0, 0, -20], [2.4, .6, 15], [-2.2, .8, 35], [1, -1.4, -50]]) g += `<ellipse cx="${x + dx}" cy="${y + dy}" rx="2.2" ry="1" fill="${S.lg("miesmuschel", [[0, "#3a4a6a"], [1, "#141a28"]])}" transform="rotate(${a} ${x + dx} ${y + dy})"/>`;
    g += `<path d="M${x + 6} ${y + 1.2} Q${x + 8} ${y - 1.6} ${x + 10} ${y + 1.2} Z" fill="#e8dcc8" stroke="#b9a888" stroke-width=".2"/><path d="M${x + 7} ${y + 1.1} l.3 -1.4 M${x + 8} ${y + 1.1} v-1.8 M${x + 9} ${y + 1.1} l-.3 -1.4" stroke="#b9a888" stroke-width=".15"/>`;
    return g;
  };
  k += krabbe(150, 180) + seestern(196, 178) + muscheln(112, 184);
  S.teil({ id: "meeresboden", de: "der Meeresboden", syl: "MEE-res-bo-den", it: "il fondale marino", itSyl: "fon-DA-le ma-RI-no", en: "seabed", x: 0, y: 0, kunst: k,
    zoom: { x: 102, y: 142, w: 102, h: 56 },
    unter: [
      { id: "krabbe", de: "die Krabbe", syl: "KRAB-be", it: "il granchio", itSyl: "GRAN-chio", en: "crab", x: 150, y: 180, kunst: flaeche(-6, -6, 12, 7), tipp: "Die Strandkrabbe läuft seitwärts." },
      { id: "seestern", de: "der Seestern", syl: "SEE-stern", it: "la stella marina", itSyl: "STEL-la ma-RI-na", en: "starfish", x: 196, y: 178, kunst: flaeche(-6, -4, 12, 7), tipp: "Fünf Arme — und wenn einer abbricht, wächst er nach." },
      { id: "muschel", de: "die Muschel", syl: "MU-schel", it: "la cozza", itSyl: "COZ-za", en: "mussel", x: 112, y: 184, kunst: flaeche(-5, -3, 16, 6), tipp: "Miesmuscheln halten sich mit feinen Fäden aneinander fest." }],
    tipp: "Auf dem sandigen Grund leben Krabben, Seesterne und Muscheln." });
}
{
  /* DER FELSEN mit Blasentang (Alge ist ein eigenes Teil) */
  let k = `<path d="M-30 0 Q-30 -14 -18 -20 Q-6 -26 8 -22 Q22 -18 28 -8 Q30 -3 30 0 Z" fill="${S.lg("fels", [[0, "#6a7a7c"], [1, "#3a4a50"]])}"/>`;
  k += `<path d="M-20 -16 Q-8 -24 6 -21" stroke="#9ab0b2" stroke-width="1" fill="none" opacity=".5"/><path d="M-4 -22 Q-2 -12 -6 0 M14 -18 Q16 -8 12 0" stroke="#2f3a3e" stroke-width=".6" fill="none" opacity=".6"/>`;
  for (let i = 0; i < 12; i++) k += `<circle cx="${r(-22 + rnd() * 44)}" cy="${r(-14 + rnd() * 12)}" r="${r(0.6 + rnd())}" fill="#c9d2b4" opacity=".35"/>`;
  S.teil({ id: "felsen", de: "der Felsen", syl: "FEL-sen", it: "lo scoglio", itSyl: "SCO-glio", en: "rock", x: 28, y: 182, kunst: k });
}
{
  /* DIE ALGE — Blasentang auf dem Felsen, wiegt sich in der Strömung */
  let k = "";
  for (const [x0, h, b] of [[-14, 46, -6], [-4, 54, 4], [8, 42, 8], [18, 34, -4]]) {
    const top = -h;
    k += `<path d="M${x0} 0 Q${x0 + b} ${top * 0.5} ${x0 + b * 0.4} ${top}" stroke="#6a5a1e" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
    for (let i = 1; i < 5; i++) { const t = i / 5, x = x0 + b * Math.sin(t * Math.PI) * 0.9, y = top * t; k += `<path d="M${r(x)} ${r(y)} q${r(b * 0.4 + 3)} -4 ${r(b * 0.2 + 5)} -8" stroke="#7a6a24" stroke-width="2" fill="none" stroke-linecap="round"/><ellipse cx="${r(x + 2.4)}" cy="${r(y - 3)}" rx="1" ry=".8" fill="#9a8a3a"/>`; }
  }
  S.teil({ id: "alge", de: "die Alge", syl: "AL-ge", it: "l'alga", itSyl: "AL-ga", en: "seaweed", x: 24, y: 164, kunst: k,
    tipp: "Blasentang ist eine Braunalge: kleine Luftbläschen halten sie im Wasser aufrecht." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/meer.js"));
console.log(aus);
