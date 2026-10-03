#!/usr/bin/env node
/* =====================================================================
   DER WEIHNACHTSMARKT (FASSUNG 852) — Bilderwelt neu, Szene für Szene
   ---------------------------------------------------------------------
   XANDER (Funk 263/286): jeder Ort authentisch wie das echte Vorbild,
   alles logisch platziert, jedes Ding einzeln antippbar.

   RECHERCHE (Deutsche Welle „Ein Besuch auf dem Weihnachtsmarkt“,
   Statista „Was beim Weihnachtsmarkt nicht fehlen darf“, Berliner und
   Dresdner Märkte) — so sieht ein deutscher Weihnachtsmarkt am Abend aus:
   - Er liegt auf dem alten Marktplatz vor der KIRCHE; über den Gassen
     hängen LICHTERKETTEN, in der Mitte steht ein großer WEIHNACHTSBAUM
     mit Lichtern und Stern.
   - HOLZBUDEN mit Spitzdach, Tannengirlande und Lichtern. Am
     GLÜHWEINSTAND gibt es Glühwein und Kinderpunsch im PFANDBECHER (der
     Becher hat jedes Jahr ein neues Motiv); eine Preistafel mit Pfand.
   - Am Süßwarenstand: GEBRANNTE MANDELN aus dem Kupferkessel (in
     Papiertüten), LEBKUCHENHERZEN mit Zuckerschrift, LIEBESÄPFEL und
     ZUCKERWATTE.
   - Die große WEIHNACHTSPYRAMIDE (Erzgebirge): Etagen mit Figuren, oben
     das Flügelrad; unten verkauft eine Bude ROSTBRATWURST vom Grill.
   - Ein nostalgisches KINDERKARUSSELL mit Pferdchen und Lichtern, eine
     KRIPPE im Holzstall, STEHTISCHE, an denen man mit dem Becher steht.
   - Ende November ist es um fünf Uhr dunkel; Schnee, Mütze, Schal.
   Maßstab: vorne (y 190) ≈ 45 Einheiten je Meter, Buden (y 170) ≈ 39,
   Karussell (y 132) ≈ 26, Pyramide (y 124) ≈ 24. Augenhöhe y ≈ 50.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "weihnachtsmarkt", titel: "Der Weihnachtsmarkt", emoji: "🎄", thema: "Feste", kuerzel: "wmk", fassung: 852 });
const rnd = zufall(1127);
const r = B.r;

/* Figuren schlanker: ganze Zentimeter (bei k ≈ 0,45 unter einem Bildpunkt) */
const h2 = (n) => String(Math.round(parseFloat(n)));
const schlank = (svg) => svg.replace(/( d=")([^"]*)"/g, (a, b, c) => b + c.replace(/-?\d*\.\d+/g, h2) + '"')
  .replace(/ (cx|cy|x1|y1|x2|y2|x|y)="(-?\d*\.\d+)"/g, (a, b, c) => ` ${b}="${h2(c)}"`)
  .replace(/ (r|rx|ry|width|height)="(\d*\.\d+)"/g, (a, b, c) => ` ${b}="${parseFloat(c) < 1.5 ? c : h2(c)}"`);
const figur = (spec, hoehe) => { const m = B.mensch(spec, hoehe); return { svg: `<g transform="scale(${m.k.toFixed(4)})">${schlank(m.z.svg)}</g>`, k: m.k, z: m.z }; };
const handPunkt = (m) => { const h = [m.z.handL, m.z.handR].filter(Boolean).sort((a, b) => a.y - b.y)[0]; return [(h.x != null ? h.x : h[0]) * m.k, (h.y != null ? h.y : h[1]) * m.k]; };

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const HOLZ = S.lg("holz", [[0, "#8a5a32"], [1, "#5e3a1c"]]);
const HOLZ_V = S.lg("holzv", [[0, "#6e4524"], [0.5, "#946038"], [1, "#6a4222"]], 0, 0, 1, 0);
const DACH = S.lg("dach", [[0, "#6b3a22"], [1, "#4a2614"]]);
const SCHNEE = S.lg("schnee", [[0, "#ffffff"], [1, "#d7e2ee"]]);
const INNEN = S.lg("innen", [[0, "#ffd890"], [1, "#c98a3e"]]);
const GLUT = S.rg("glut", [[0, "#ffe7a0", 0.8], [1, "#ffc860", 0]]);
const ROTBECHER = S.lg("becher", [[0, "#7e0f18"], [0.45, "#c8252e"], [1, "#6e0c14"]], 0, 0, 1, 0);
const GOLD = S.rg("gold", [[0, "#fff4c2"], [0.35, "#e9bf4a"], [1, "#8a5f12"]], 0.35, 0.3, 0.75);
const LEBKUCHEN = S.rg("lebk", [[0, "#c47a3a"], [0.7, "#8e4f22"], [1, "#6a3814"]], 0.4, 0.35, 0.8);
const lampe = (x, y, s = 1) => `<circle cx="${r(x)}" cy="${r(y)}" r="${r(2.4 * s)}" fill="${GLUT}"/><circle cx="${r(x)}" cy="${r(y)}" r="${r(0.7 * s)}" fill="#fff4c8"/>`;

/* =====================================================================
   KULISSE — Nachthimmel, Häuserzeile mit Schneedächern, verschneites
   Kopfsteinpflaster
   ===================================================================== */
const FERNE = 100;
S.hinten(`<rect x="0" y="0" width="320" height="${FERNE + 2}" fill="${S.lg("himmel", [[0, "#070d24"], [0.6, "#1a2450"], [1, "#4a3a5e"]])}"/>`);
{
  let g = "";
  for (let i = 0; i < 60; i++) g += `<circle cx="${r(rnd() * 320)}" cy="${r(rnd() * 50)}" r="${r(0.2 + rnd() * 0.35)}" fill="#fff" opacity="${r(0.4 + rnd() * 0.6)}"/>`;
  S.hinten(g);
}
/* Häuserzeile: Giebelhäuser in gedämpften Farben, warme Fenster */
{
  let g = "";
  const haeuser = [[-4, 34, 56, "#5a4a5e"], [30, 30, 50, "#4f5468"], [60, 36, 60, "#6a4c46"], [96, 28, 46, "#4a5a5a"], [124, 30, 52, "#5c4d60"],
    [200, 32, 54, "#4e5266"], [232, 30, 48, "#665048"], [262, 34, 58, "#4c566a"], [296, 30, 52, "#5e4b55"]];
  for (const [x, w, top, f] of haeuser) {
    const giebel = top - w * 0.45;
    g += `<path d="M${x} ${FERNE} L${x} ${top} L${x + w / 2} ${r(giebel)} L${x + w} ${top} L${x + w} ${FERNE} Z" fill="${f}"/>`;
    g += `<path d="M${x - 1.4} ${top + 0.8} L${x + w / 2} ${r(giebel - 1)} L${x + w + 1.4} ${top + 0.8} L${x + w} ${top + 2.4} L${x + w / 2} ${r(giebel + 1.8)} L${x} ${top + 2.4} Z" fill="${SCHNEE}"/>`;
    for (let yy = top + 6; yy < FERNE - 8; yy += 10) for (let xx = x + 4; xx < x + w - 6; xx += 8) {
      const an = rnd() < 0.62;
      g += `<rect x="${r(xx)}" y="${r(yy)}" width="4" height="5.6" fill="${an ? "#ffcf7a" : "#232a40"}"/>`;
      if (an) g += `<rect x="${r(xx)}" y="${r(yy)}" width="4" height="5.6" fill="#fff6d8" opacity=".25"/>`;
    }
    g += `<rect x="${x + w / 2 - 2}" y="${r(giebel + 5)}" width="4" height="4" rx="2" fill="#ffcf7a" opacity=".85"/>`;
  }
  g += `<rect x="0" y="${FERNE - 6}" width="320" height="6" fill="#2a2638" opacity=".55"/>`;
  S.hinten(g);
}
/* Boden: Kopfsteinpflaster unter festgetretenem Schnee */
S.def(`<pattern id="${S.id("pflaster")}" width="8" height="5" patternUnits="userSpaceOnUse"><rect width="8" height="5" fill="#5e6270"/><rect x=".4" y=".4" width="3.4" height="2" rx=".8" fill="#868b98"/><rect x="4.2" y=".4" width="3.4" height="2" rx=".8" fill="#7c8190"/><rect x="-1.6" y="2.9" width="3.4" height="1.8" rx=".8" fill="#80859a"/><rect x="2.2" y="2.9" width="3.4" height="1.8" rx=".8" fill="#737889"/><rect x="6" y="2.9" width="3.4" height="1.8" rx=".8" fill="#80859a"/></pattern>`);
{
  let g = "";
  [[FERNE, 112, 0.35], [112, 128, 0.5], [128, 148, 0.7], [148, 172, 0.9], [172, 200, 1.15]].forEach(([a, b, s], i) => {
    S.def(`<pattern id="${S.id("pfl" + i)}" href="#${S.id("pflaster")}" patternTransform="scale(${s})"/>`);
    g += `<rect x="0" y="${a}" width="320" height="${b - a}" fill="url(#${S.id("pfl" + i)})"/>`;
  });
  /* Schneedecke, in der Mitte zertreten (Pflaster schaut durch) */
  g += `<rect x="0" y="${FERNE}" width="320" height="${200 - FERNE}" fill="${S.lg("schneeboden", [[0, "#dfe6f0", 0.9], [0.5, "#cfd8e6", 0.55], [1, "#e6ecf4", 0.75]])}"/>`;
  for (let i = 0; i < 26; i++) {
    const x = rnd() * 320, y = FERNE + 6 + rnd() * 92, w = 6 + rnd() * 18 * (y / 120);
    g += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(w)}" ry="${r(w * 0.16)}" fill="#fff" opacity=".45"/>`;
  }
  /* Lichtschein der Buden auf dem Schnee */
  g += `<ellipse cx="46" cy="176" rx="60" ry="12" fill="#ffc86a" opacity=".22"/><ellipse cx="282" cy="176" rx="52" ry="11" fill="#ffc86a" opacity=".22"/><ellipse cx="202" cy="136" rx="46" ry="7" fill="#ffd890" opacity=".2"/>`;
  S.hinten(g);
}

/* =====================================================================
   1 — DIE LICHTERKETTEN über dem Platz (ganz hinten, im Himmel)
   ===================================================================== */
{
  let k = "";
  for (const [x0, y0, x1, y1, d] of [[0, 18, 150, 22, 16], [150, 22, 320, 16, 15], [0, 36, 118, 44, 12]]) {
    const mx = (x0 + x1) / 2, my = (y0 + y1) / 2 + d;
    k += `<path d="M${x0} ${y0} Q${mx} ${my} ${x1} ${y1}" stroke="#1a1a22" stroke-width=".5" fill="none"/>`;
    for (let i = 1; i < 18; i++) {
      const t = i / 18, x = (1 - t) * (1 - t) * x0 + 2 * t * (1 - t) * mx + t * t * x1, y = (1 - t) * (1 - t) * y0 + 2 * t * (1 - t) * my + t * t * y1;
      k += lampe(x, y + 1, 0.9);
    }
  }
  S.teil({ id: "wm_lichterkette", de: "die Lichterkette", syl: "LICH-ter-ket-te", it: "le luci", itSyl: "LU-ci", en: "string lights", x: 0, y: 0, kunst: k,
    tipp: "Über den Gassen hängen Lichterketten – sie leuchten, sobald es dunkel wird." });
}

/* =====================================================================
   2 — DIE KIRCHE (gotisch, Turm mit Uhr, Fenster erleuchtet)
   ===================================================================== */
{
  const cx = 173;
  let k = `<g transform="translate(${-cx} ${-FERNE})">`;
  k += `<rect x="150" y="44" width="46" height="${FERNE - 44}" fill="${S.lg("schiff", [[0, "#7c7488"], [1, "#5a5468"]])}"/>`;
  k += `<path d="M146 46 L173 26 L200 46 Z" fill="#3c3848"/><path d="M146 46 L173 26 L200 46 L197 47.6 L173 29.4 L149 47.6 Z" fill="${SCHNEE}"/>`;
  for (const x of [154, 186]) k += `<path d="M${x} 92 L${x} 62 Q${x + 3.4} 54 ${x + 6.8} 62 L${x + 6.8} 92 Z" fill="${S.lg("kfen", [[0, "#ffd890"], [1, "#d98a3e"]])}" stroke="#3c3848" stroke-width=".6"/>`;
  k += `<rect x="164" y="22" width="18" height="${FERNE - 22}" fill="${S.lg("turm", [[0, "#8a8296"], [1, "#655e72"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M162 22 L173 1 L184 22 Z" fill="${S.lg("spitze", [[0, "#3f6e62"], [1, "#22443c"]], 0, 0, 1, 0)}"/><path d="M173 1 L173 -4 M171.2 -2.4 L174.8 -2.4" stroke="#d4af37" stroke-width=".7"/>`;
  k += `<path d="M162 22 L173 1 L175 5 L166 22 Z" fill="#fff" opacity=".35"/>`;
  k += `<circle cx="173" cy="34" r="5" fill="#f6e6b8" stroke="#d4af37" stroke-width=".7"/><line x1="173" y1="34" x2="173" y2="30.4" stroke="#2a2018" stroke-width=".6"/><line x1="173" y1="34" x2="175.6" y2="34" stroke="#2a2018" stroke-width=".7"/>`;
  k += `<path d="M169 58 L169 46 Q173 41 177 46 L177 58 Z" fill="#2a2638"/><path d="M168.6 92 L168.6 76 Q173 70 177.4 76 L177.4 92 Z" fill="#4a2e1c"/>`;
  k += `</g>`;
  S.teil({ id: "wm_kirche", de: "die Kirche", syl: "KIR-che", it: "la chiesa", itSyl: "CHIE-sa", en: "church", x: cx, y: FERNE, kunst: k,
    tipp: "Der Weihnachtsmarkt ist oft auf dem Platz vor der Kirche." });
}

/* =====================================================================
   3 — DER WEIHNACHTSBAUM (rechts hinten) und 4 — DER STERN
   ===================================================================== */
const BAUM = { x: 262, y: 104 };
{
  let k = schatten(0, 0, 16, 1.4, .35);
  k += `<rect x="-1.6" y="-8" width="3.2" height="8" fill="#4a3020"/>`;
  const N = 9, yTop = -84, yBot = -7;
  for (let i = N - 1; i >= 0; i--) {
    const yb = yTop + 8 + i * (yBot - yTop - 8) / (N - 1), w = 2 + (yb - yTop) / (yBot - yTop) * 21, yt = yb - 14;
    let p = `M0 ${r(yt)} Q${r(-w * 0.4)} ${r(yt + 6)} ${r(-w)} ${r(yb)}`;
    for (let j = 1; j <= 8; j++) p += ` L${r(-w + j * w / 4)} ${r(yb + (j % 2 ? 1.6 : -0.4))}`;
    p += ` Q${r(w * 0.4)} ${r(yt + 6)} 0 ${r(yt)} Z`;
    k += `<path d="${p}" fill="${S.lg("nadel", [[0, "#0a2416"], [0.5, "#163e26"], [1, "#245a34"]])}"/>`;
  }
  /* Lichterkette in Spiralen, warmweiß */
  for (let i = 0; i < 70; i++) {
    const t = i / 70, y = yTop + 6 + t * (yBot - yTop - 8), w = 2 + (y - yTop) / (yBot - yTop) * 19, x = Math.sin(t * 26) * w;
    if (Math.cos(t * 26) > -0.2) k += lampe(x, y, 0.7);
  }
  S.teil({ id: "wm_baum", de: "der Weihnachtsbaum", syl: "WEIH-nachts-baum", it: "l'albero di Natale", itSyl: "AL-be-ro di na-TA-le", en: "Christmas tree", x: BAUM.x, y: BAUM.y, kunst: k,
    tipp: "Er steht mitten auf dem Platz und wird abends angeschaltet." });
}
{
  let k = `<circle r="6" fill="${S.rg("sternglanz", [[0, "#fff4c0", 0.8], [1, "#ffd27a", 0]])}"/>`;
  k += `<path d="M0 -4.4 L1.1 -1.4 L4.2 -1.4 L1.7 .5 L2.6 3.6 L0 1.7 L-2.6 3.6 L-1.7 .5 L-4.2 -1.4 L-1.1 -1.4 Z" fill="${GOLD}" stroke="#fff3c4" stroke-width=".3"/>`;
  S.teil({ oben: true, id: "wm_stern", de: "der Stern", syl: "STERN", it: "la stella", itSyl: "STEL-la", en: "star", x: BAUM.x, y: BAUM.y - 87, kunst: k });
}

/* =====================================================================
   5 — DIE WEIHNACHTSPYRAMIDE mit Bratwurstbude im Erdgeschoss
   ===================================================================== */
const PYR = { x: 116, y: 124 };
{
  let k = schatten(0, 0.4, 24, 1.8, .4);
  /* Erdgeschoss: achteckige Bude mit Theke, Grill und Schild */
  k += `<rect x="-20" y="-20" width="40" height="20" fill="${HOLZ_V}"/><rect x="-17" y="-17" width="34" height="9" fill="${INNEN}"/>`;
  k += `<rect x="-21" y="-9" width="42" height="2" fill="#4a2a14"/><rect x="-20" y="-7" width="40" height="7" fill="${HOLZ}"/>`;
  for (let x = -18; x < 19; x += 4) k += `<line x1="${x}" y1="-7" x2="${x}" y2="0" stroke="#3e2410" stroke-width=".3"/>`;
  k += `<rect x="-22" y="-26" width="44" height="6" fill="#7a1d20"/><text x="0" y="-21.6" font-size="3.6" text-anchor="middle" fill="#f6dc8a" font-family="Georgia,serif" font-weight="bold">Rostbratwurst</text>`;
  /* Etagen: Teller mit Figuren, Säulen, Lichter an den Ecken */
  const etagen = [[-26, 21, ["#f3efe4", "#2f5d3a", "#8b1d24", "#f3efe4"]], [-44, 17, ["#2f5fa8", "#efe7d0", "#7a4a26"]], [-60, 13, ["#c4202a", "#1c1c22"]], [-74, 9, []]];
  etagen.forEach(([y, w, fig], i) => {
    k += `<path d="M${-w - 2} ${y} L${w + 2} ${y} L${w} ${y + 2.2} L${-w} ${y + 2.2} Z" fill="#a8743e"/><rect x="${-w - 2}" y="${y - 0.4}" width="${2 * w + 4}" height=".8" fill="#e8c27a"/>`;
    const naechst = i < etagen.length - 1 ? etagen[i + 1][0] + 2 : y - 8;
    if (i < etagen.length - 1) for (const sx of [-1, -0.35, 0.35, 1]) k += `<rect x="${r(sx * w * 0.92 - 0.6)}" y="${naechst}" width="1.2" height="${r(y - naechst)}" fill="#e2c592"/>`;
    fig.forEach((f, j) => {
      const fx = -w * 0.7 + j * (w * 1.4 / Math.max(1, fig.length - 1));
      k += `<path d="M${r(fx - 1.6)} ${y} L${r(fx - 1.1)} ${y - 6} L${r(fx + 1.1)} ${y - 6} L${r(fx + 1.6)} ${y} Z" fill="${f}"/><circle cx="${r(fx)}" cy="${y - 7.2}" r="1.3" fill="#efc9a0"/>`;
    });
    for (const sx of [-1, 1]) k += `<rect x="${r(sx * (w + 1) - 0.6)}" y="${y - 4.4}" width="1.2" height="4.4" fill="#f7f1e4"/>` + lampe(sx * (w + 1), y - 5.4, 0.8);
  });
  /* Mittelwelle und Flügelrad */
  k += `<rect x="-.6" y="-90" width="1.2" height="16" fill="#c9a26a"/>`;
  k += `<ellipse cx="0" cy="-90" rx="18" ry="2.2" fill="none" stroke="#c99a52" stroke-width=".4"/>`;
  for (const [dx, h] of [[-17, 1], [-9, 1.6], [9, 1.6], [17, 1]]) k += `<path d="M0 -90 L${dx} ${-91.6 - h} L${dx} ${-88.6 + h * 0.4} Z" fill="${S.lg("fluegel", [[0, "#e8c27a"], [1, "#a8743e"]])}" stroke="#7a5228" stroke-width=".25"/>`;
  k += `<circle cx="0" cy="-90.6" r="1.4" fill="${GOLD}"/>`;
  S.teil({ id: "wm_pyramide", de: "die Weihnachtspyramide", syl: "WEIH-nachts-py-ra-mi-de", it: "la piramide di Natale", itSyl: "pi-RA-mi-de di na-TA-le", en: "Christmas pyramid", x: PYR.x, y: PYR.y, kunst: k,
    tipp: "Die Pyramide kommt aus dem Erzgebirge. Oben dreht sich das Flügelrad." });
}
{
  /* DIE BRATWURST auf dem Rost im Erdgeschoss der Pyramide */
  let k = `<rect x="-12" y="-1.4" width="24" height="1.4" fill="#2a2a2e"/>`;
  for (let x = -11; x < 12; x += 1.6) k += `<line x1="${x}" y1="-1.4" x2="${x}" y2="0" stroke="#55555a" stroke-width=".3"/>`;
  for (let i = 0; i < 6; i++) k += `<rect x="${-10.6 + i * 3.6}" y="-2.8" width="3" height="1.6" rx=".8" fill="${S.lg("wurst", [[0, "#c47a3a"], [1, "#7a3e18"]])}"/><line x1="${-10 + i * 3.6}" y1="-2.2" x2="${-8.2 + i * 3.6}" y2="-2.2" stroke="#5a2a10" stroke-width=".2"/>`;
  k += `<path d="M-6 -3.4 q-1.4 -3 0 -5.6 q1.4 -2.6 0 -5 M4 -3.4 q1.4 -3 0 -5.4" stroke="#e6e2da" stroke-width=".5" fill="none" opacity=".45"/>`;
  S.teil({ oben: true, id: "wm_bratwurst", de: "die Bratwurst", syl: "BRAT-wurst", it: "la salsiccia arrosto", itSyl: "sal-SIC-cia ar-RO-sto", en: "fried sausage", x: PYR.x, y: PYR.y - 9, kunst: k,
    tipp: "Die Rostbratwurst gibt es im Brötchen, mit Senf." });
}

/* =====================================================================
   6 — DAS KARUSSELL (Kinderkarussell mit Pferdchen)
   ===================================================================== */
{
  const W = 70;
  let k = schatten(0, 0.4, W / 2 + 4, 2, .35);
  /* Plattform */
  k += `<ellipse cx="0" cy="-2.4" rx="${W / 2}" ry="4" fill="#5a3a26"/><rect x="${-W / 2}" y="-5" width="${W}" height="3.2" fill="${S.lg("sockel", [[0, "#c8a04a"], [1, "#8a6420"]])}"/><ellipse cx="0" cy="-5" rx="${W / 2}" ry="3.6" fill="#8a5a3a"/>`;
  for (let i = 0; i < 12; i++) k += lampe(-W / 2 + 2 + i * (W - 4) / 11, -3.2, 0.5);
  /* Mittelsäule mit Spiegeln */
  k += `<rect x="-7" y="-42" width="14" height="37" fill="${S.lg("saeule", [[0, "#7a1d20"], [0.5, "#b8323a"], [1, "#6a1418"]], 0, 0, 1, 0)}"/>`;
  for (let y = -38; y < -8; y += 9) k += `<rect x="-4" y="${y}" width="8" height="6" rx="1" fill="${S.lg("spiegel", [[0, "#e8f0f6"], [1, "#8aa0b4"]], 0, 0, 1, 1)}" stroke="#e8c27a" stroke-width=".4"/>`;
  /* Stangen und Fahrzeuge: Pferdchen, Feuerwehrauto, Kutsche */
  const pferd = (x, y, f, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-5 0 Q-6 -4 -3 -4.6 L3 -4.6 Q4.6 -6.6 4 -9 L6.4 -8 Q7.4 -6 6.6 -4.4 L5.6 -2.6 Q5 0 3.6 0 Z" fill="${f}"/><path d="M-4 -.4 l-1 4 M-2 -.4 l0 4 M2.6 -.4 l.8 4 M4 -.6 l1.6 3.4" stroke="${f}" stroke-width="1.1" stroke-linecap="round"/><path d="M4 -9 q-2 2 -2 4.2" stroke="#7a3a1a" stroke-width="1" fill="none"/><rect x="-2.6" y="-6" width="4" height="1.6" rx=".6" fill="#c4202a"/><path d="M-5 -2 q-3 1 -2.4 4" stroke="#c9b48a" stroke-width=".9" fill="none"/><circle cx="5.4" cy="-7.4" r=".35" fill="#222"/></g>`;
  for (const [x, f, ph] of [[-26, "#f4efe4", -14], [-14, "#6e4a2e", -18], [14, "#f4efe4", -16], [26, "#3e3a40", -13]]) {
    k += `<line x1="${x}" y1="-44" x2="${x}" y2="-5" stroke="${GOLD}" stroke-width=".9"/>` + pferd(x, ph, f, 0.95);
  }
  /* Feuerwehrauto vorne in der Mitte */
  k += `<rect x="-5.6" y="-12" width="11.2" height="6" rx="1.2" fill="#c4202a"/><rect x="-4.6" y="-15.4" width="5" height="3.6" rx=".6" fill="#c4202a"/><rect x="-4" y="-14.8" width="3.6" height="2.4" fill="#bfe0f2"/><circle cx="-3.4" cy="-5.6" r="1.4" fill="#1c1c22"/><circle cx="3.4" cy="-5.6" r="1.4" fill="#1c1c22"/><rect x="1" y="-14" width="4" height=".8" fill="#e6e6e6"/><circle cx="-2.4" cy="-16" r=".7" fill="#4aa8ff"/>`;
  /* Dach: rot-weiß gestreiftes Zelt mit Zackenrand und Lichtern */
  k += `<path d="M${-W / 2 - 3} -44 L0 -60 L${W / 2 + 3} -44 Z" fill="#c4202a"/>`;
  for (let i = 0; i < 8; i++) { const a = -W / 2 - 3 + i * (W + 6) / 8, b = a + (W + 6) / 16; k += `<path d="M0 -60 L${r(a)} -44 L${r(b)} -44 Z" fill="#f6efe2"/>`; }
  k += `<rect x="${-W / 2 - 3}" y="-45" width="${W + 6}" height="5" fill="${S.lg("blende", [[0, "#2f5a8a"], [1, "#1c3a5e"]])}"/><text x="0" y="-41.4" font-size="3.4" text-anchor="middle" fill="#f6dc8a" font-family="Georgia,serif" font-style="italic">Kinderkarussell · Fahrt 2,50 €</text>`;
  for (let i = 0; i < 16; i++) { const x = -W / 2 - 3 + i * (W + 6) / 16; k += `<path d="M${r(x)} -40 l${r((W + 6) / 32)} 2.4 l${r((W + 6) / 32)} -2.4 Z" fill="${i % 2 ? "#c4202a" : "#f6efe2"}"/>`; }
  for (let i = 0; i < 9; i++) k += lampe(-W / 2 - 1 + i * (W + 2) / 8, -45.6, 0.7);
  /* Schnee auf dem Dach und Spitze */
  k += `<path d="M${-W / 2 - 3} -44 L0 -60 L${W / 2 + 3} -44 L${W / 2} -44.6 Q${W / 4} -47 0 -57.6 Q${-W / 4} -47 ${-W / 2} -44.6 Z" fill="${SCHNEE}" opacity=".85"/>`;
  k += `<rect x="-.5" y="-66" width="1" height="6" fill="${GOLD}"/><path d="M.5 -66 L6 -64.4 L.5 -62.8 Z" fill="#c4202a"/>`;
  S.teil({ id: "wm_karussell", de: "das Karussell", syl: "Ka-rus-SELL", it: "la giostra", itSyl: "GIO-stra", en: "carousel", x: 204, y: 132, kunst: k,
    tipp: "Zwei Euro fünfzig die Fahrt. Für die Kleinen das Wichtigste am ganzen Markt." });
}

/* =====================================================================
   Gemeinsame HOLZBUDE: Spitzdach mit Schnee, Tannengirlande, Theke
   ===================================================================== */
const bude = (W, H, schild, schildFarbe) => {
  const traufe = -H * 0.66, theke = -H * 0.36;
  let g = schatten(0, 0.4, W / 2 + 4, 2, .4);
  /* Innenraum warm erleuchtet, Pfosten */
  g += `<rect x="${-W / 2}" y="${traufe}" width="${W}" height="${-traufe}" fill="${HOLZ_V}"/>`;
  g += `<rect x="${-W / 2 + 3}" y="${traufe + 6}" width="${W - 6}" height="${r(theke - traufe - 6)}" fill="${INNEN}"/>`;
  g += `<rect x="${-W / 2}" y="${traufe}" width="3" height="${-traufe}" fill="#5a3418"/><rect x="${W / 2 - 3}" y="${traufe}" width="3" height="${-traufe}" fill="#5a3418"/>`;
  /* Theke: Brett und senkrechte Bretter */
  g += `<rect x="${-W / 2 - 1.5}" y="${r(theke - 2)}" width="${W + 3}" height="2.4" fill="${S.lg("thekenbrett", [[0, "#b07a48"], [1, "#6e4424"]])}"/>`;
  g += `<rect x="${-W / 2}" y="${r(theke + 0.4)}" width="${W}" height="${r(-theke - 0.4)}" fill="${HOLZ}"/>`;
  for (let x = -W / 2 + 4; x < W / 2; x += 4.2) g += `<line x1="${r(x)}" y1="${r(theke + 0.4)}" x2="${r(x)}" y2="0" stroke="#3e2410" stroke-width=".4"/>`;
  /* Dach mit Schindeln */
  g += `<path d="M${-W / 2 - 6} ${r(traufe)} L0 ${-H} L${W / 2 + 6} ${r(traufe)} L${W / 2 + 6} ${r(traufe + 3)} L0 ${-H + 3} L${-W / 2 - 6} ${r(traufe + 3)} Z" fill="${DACH}"/>`;
  /* Giebelfeld mit Schild */
  g += `<path d="M${-W / 2 + 1} ${r(traufe)} L0 ${-H + 3.4} L${W / 2 - 1} ${r(traufe)} Z" fill="${HOLZ_V}"/>`;
  g += `<rect x="${-W * 0.3}" y="${r(traufe - 9)}" width="${r(W * 0.6)}" height="6.4" rx=".8" fill="${schildFarbe}" stroke="#e8c27a" stroke-width=".4"/><text x="0" y="${r(traufe - 4.2)}" font-size="4.4" text-anchor="middle" fill="#f8e6a8" font-family="Georgia,serif" font-weight="bold">${schild}</text>`;
  /* Schnee auf dem Dach */
  g += `<path d="M${-W / 2 - 6.6} ${r(traufe + 0.4)} L0 ${-H - 1.2} L${W / 2 + 6.6} ${r(traufe + 0.4)} Q${W / 4} ${r(traufe - (H + traufe) * 0.5 + 1.6)} 0 ${-H + 1.8} Q${-W / 4} ${r(traufe - (H + traufe) * 0.5 + 1.6)} ${-W / 2 - 6.6} ${r(traufe + 0.4)} Z" fill="${SCHNEE}"/>`;
  /* Tannengirlande mit Lichtern unter der Traufe */
  let gir = `M${-W / 2 - 4} ${r(traufe + 2)}`;
  for (let i = 1; i <= 6; i++) gir += ` Q${r(-W / 2 - 4 + (i - 0.5) * (W + 8) / 6)} ${r(traufe + 6.4)} ${r(-W / 2 - 4 + i * (W + 8) / 6)} ${r(traufe + 2)}`;
  g += `<path d="${gir}" stroke="#1f4a2c" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="${gir}" stroke="#3b7a46" stroke-width="1" fill="none" stroke-dasharray="1 1.4"/>`;
  for (let i = 0; i <= 12; i++) { const x = -W / 2 - 4 + i * (W + 8) / 12, t = (i % 2) ? 1 : 0; g += lampe(x, traufe + 2.6 + t * 2.4, 0.8); }
  return { g, traufe, theke };
};

/* =====================================================================
   7 — DER GLÜHWEINSTAND (links vorne) — Lupe: Glühwein, Pfandbecher,
       Kinderpunsch
   ===================================================================== */
const GL = { x: 46, y: 170, w: 76, h: 112 };
{
  const { g, traufe, theke } = bude(GL.w, GL.h, "Glühwein", "#7a1d20");
  let k = g;
  const unter = [];
  const T = (lx, ly) => [GL.x + lx, GL.y + ly];
  /* Rückwand: Regal mit Flaschen und Gewürzen, Preistafel */
  k += `<rect x="-34" y="${r(traufe + 7)}" width="22" height="12.4" fill="#2c3a33" stroke="#6b4422" stroke-width=".6"/>`;
  [["Glühwein", "4,00"], ["mit Schuss", "5,50"], ["Kinderpunsch", "3,50"], ["Pfand", "3,00"]].forEach(([n, p], i) => {
    k += `<text x="-32.6" y="${r(traufe + 9.8 + i * 2.8)}" font-size="2.1" fill="#f4f0e6" font-family="'Comic Sans MS',cursive">${n}</text><text x="-12.8" y="${r(traufe + 9.8 + i * 2.8)}" font-size="2.1" text-anchor="end" fill="#f6e7a1" font-family="'Comic Sans MS',cursive">${p} €</text>`;
  });
  k += `<rect x="-8" y="${r(traufe + 22)}" width="40" height="1.2" fill="#5a3418"/>`;
  for (let i = 0; i < 8; i++) k += `<rect x="${-6 + i * 4.6}" y="${r(traufe + 15)}" width="2.2" height="7" rx=".8" fill="${i % 3 ? "#5a0c18" : "#2a4a2a"}"/><rect x="${-5.4 + i * 4.6}" y="${r(traufe + 13.4)}" width="1" height="2" fill="#2a2a2a"/>`;
  /* DER GLÜHWEIN: großer Glühweinkessel mit Zapfhahn, dampfend */
  {
    const x = 16, y = theke - 2;
    k += `<path d="M${x - 9} ${y} L${x - 9} ${y - 14} Q${x - 9} ${y - 16} ${x - 7} ${y - 16} L${x + 7} ${y - 16} Q${x + 9} ${y - 16} ${x + 9} ${y - 14} L${x + 9} ${y} Z" fill="${S.lg("kessel", [[0, "#8a939a"], [0.4, "#e6eaee"], [0.6, "#b5bcc2"], [1, "#6f777e"]], 0, 0, 1, 0)}"/>`;
    k += `<ellipse cx="${x}" cy="${y - 16}" rx="9" ry="1.6" fill="#5a0c18"/><ellipse cx="${x}" cy="${y - 16}" rx="9" ry="1.6" fill="none" stroke="#c9d0d6" stroke-width=".5"/>`;
    k += `<rect x="${x - 2}" y="${y - 6}" width="4" height="2" fill="#2a2a2e"/><rect x="${x - 0.6}" y="${y - 4}" width="1.2" height="1.6" fill="#2a2a2e"/>`;
    k += `<path d="M${x - 4} ${y - 17} q-2 -3 0 -6 q2 -3 0 -6 M${x + 3} ${y - 17} q2 -3 0 -5.6 q-2 -2.6 0 -5.2" stroke="#fff" stroke-width=".8" fill="none" opacity=".4"/>`;
    k += `<rect x="${x - 7}" y="${y - 11}" width="14" height="3.4" fill="#7a1d20"/><text x="${x}" y="${y - 8.6}" font-size="2.2" text-anchor="middle" fill="#f6dc8a" font-family="Arial" font-weight="bold">GLÜHWEIN</text>`;
    /* drei gefüllte, dampfende Becher davor */
    for (const dx of [-13.4, -9.6]) k += `<path d="M${x + dx - 1.8} ${y} L${x + dx - 1.6} ${y - 4.6} L${x + dx + 1.6} ${y - 4.6} L${x + dx + 1.8} ${y} Z" fill="${ROTBECHER}"/><ellipse cx="${x + dx}" cy="${y - 4.6}" rx="1.6" ry=".4" fill="#4a0a14"/><path d="M${x + dx} ${y - 5.4} q-1 -1.6 0 -3" stroke="#fff" stroke-width=".4" opacity=".5" fill="none"/>`;
    const [ax, ay] = T(x - 3, y);
    unter.push({ id: "wm_gluehwein", de: "der Glühwein", syl: "GLÜH-wein", it: "il vin brulé", itSyl: "vin bru-LÉ", en: "mulled wine", x: ax, y: ay, kunst: flaeche(-14, -24, 26, 24),
      tipp: "Heiß, rot und süß. „Einen Glühwein mit Schuss, bitte.“" });
  }
  /* DER PFANDBECHER: Stapel leerer Becher mit Wintermotiv auf der Theke */
  {
    const x = -24, y = theke - 2;
    for (let j = 0; j < 2; j++) for (let i = 0; i < 3 - j; i++) {
      const bx = x - 5 + i * 5 + j * 2.5, by = y - j * 5.6;
      k += `<path d="M${bx - 2.2} ${by} L${bx - 2} ${by - 5.4} L${bx + 2} ${by - 5.4} L${bx + 2.2} ${by} Z" fill="${ROTBECHER}"/><path d="M${bx + 2} ${by - 4.6} q1.4 .2 1.2 1.6 q-.2 1 -1.3 .8" stroke="#a81e26" stroke-width=".6" fill="none"/>`;
      k += `<path d="M${bx - 1.2} ${by - 1.6} l1.2 -2.4 l1.2 2.4 Z" fill="#f3efe4"/><circle cx="${bx}" cy="${by - 4.4}" r=".3" fill="#f6dc8a"/>`;
    }
    const [ax, ay] = T(x, y);
    unter.push({ id: "wm_pfandbecher", de: "der Pfandbecher", syl: "PFAND-be-cher", it: "la tazza con cauzione", itSyl: "TAZ-za", en: "deposit mug", x: ax, y: ay, kunst: flaeche(-8, -12, 16, 12.4),
      tipp: "Drei Euro Pfand. Der Becher hat jedes Jahr ein anderes Bild." });
  }
  /* DER KINDERPUNSCH: Topf mit Fruchtpunsch, Kelle */
  {
    const x = -9, y = theke - 2;
    k += `<path d="M${x - 6} ${y} L${x - 6.6} ${y - 8} L${x + 6.6} ${y - 8} L${x + 6} ${y} Z" fill="${S.lg("topf", [[0, "#2a4a8a"], [0.5, "#4a72b8"], [1, "#1c3466"]], 0, 0, 1, 0)}"/><ellipse cx="${x}" cy="${y - 8}" rx="6.6" ry="1.2" fill="#d9502a"/>`;
    k += `<path d="M${x + 2} ${y - 8.4} L${x + 5} ${y - 15}" stroke="#c9d0d6" stroke-width=".8"/><rect x="${x - 5.6}" y="${y - 5.4}" width="11.2" height="2.6" rx=".4" fill="#f6efe2"/><text x="${x}" y="${y - 3.6}" font-size="1.45" text-anchor="middle" fill="#2a4a8a" font-family="Arial" font-weight="bold">Kinderpunsch</text>`;
    k += `<circle cx="${x - 2}" cy="${y - 8}" r=".8" fill="#ffb347"/><circle cx="${x + 0.6}" cy="${y - 8.2}" r=".7" fill="#f2e05a"/>`;
    const [ax, ay] = T(x, y);
    unter.push({ id: "wm_kinderpunsch", de: "der Kinderpunsch", syl: "KIN-der-punsch", it: "il punch analcolico", itSyl: "PUNCH a-nal-CO-li-co", en: "children's punch", x: ax, y: ay, kunst: flaeche(-7, -15, 14, 15),
      tipp: "Kinderpunsch ist heiß und süß – ohne Alkohol." });
  }
  S.teil({ id: "wm_gluehweinstand", de: "der Glühweinstand", syl: "GLÜH-wein-stand", it: "il chiosco del vin brulé", itSyl: "CHIO-sco", en: "mulled wine stall", x: GL.x, y: GL.y, steht: true, kunst: k,
    zoom: { x: 4, y: GL.y + traufe - 2, w: 84, h: 56 }, unter,
    tipp: "Auf den Becher zahlt man Pfand. Bringt man ihn zurück, bekommt man das Geld wieder." });
}

/* =====================================================================
   8 — DIE BUDE (Süßwaren, rechts vorne) — Lupe: gebrannte Mandeln,
       Lebkuchenherz, Liebesapfel, Zuckerwatte
   ===================================================================== */
const BU = { x: 280, y: 170, w: 72, h: 106 };
{
  const { g, traufe, theke } = bude(BU.w, BU.h, "Süßes", "#2f5a3a");
  let k = g;
  const unter = [];
  const T = (lx, ly) => [BU.x + lx, BU.y + ly];
  /* Rückwand: Regal mit Tüten und Schokofrüchten */
  k += `<rect x="-30" y="${r(traufe + 18)}" width="60" height="1.2" fill="#5a3418"/>`;
  for (let i = 0; i < 12; i++) k += `<path d="M${-28 + i * 5} ${r(traufe + 18)} l1 -5 l2.6 0 l1 5 Z" fill="${i % 2 ? "#e8d4a8" : "#f6efe2"}" stroke="#b9a37a" stroke-width=".2"/>`;
  /* DAS LEBKUCHENHERZ: Reihe am Dachbalken, mit Zuckerschrift und Band */
  {
    const y = traufe + 9;
    const herz = (x, s, f, text) => `<path d="M${x} ${r(y + 1.6 * s)} q${-0.6 * s} -1.6 ${-1.4 * s} -1.6" stroke="#c4202a" stroke-width=".35" fill="none"/><path d="M${x} ${r(y + 9 * s)} C${r(x - 8 * s)} ${r(y + 4 * s)} ${r(x - 5 * s)} ${r(y - 0.6 * s)} ${x} ${r(y + 2.4 * s)} C${r(x + 5 * s)} ${r(y - 0.6 * s)} ${r(x + 8 * s)} ${r(y + 4 * s)} ${x} ${r(y + 9 * s)} Z" fill="${LEBKUCHEN}"/><path d="M${x} ${r(y + 8 * s)} C${r(x - 6.6 * s)} ${r(y + 3.8 * s)} ${r(x - 4.4 * s)} ${r(y + 0.6 * s)} ${x} ${r(y + 3.4 * s)} C${r(x + 4.4 * s)} ${r(y + 0.6 * s)} ${r(x + 6.6 * s)} ${r(y + 3.8 * s)} ${x} ${r(y + 8 * s)} Z" fill="none" stroke="${f}" stroke-width="${r(0.5 * s)}" stroke-dasharray="${r(0.6 * s)} ${r(0.3 * s)}"/><text x="${x}" y="${r(y + 5.4 * s)}" font-size="${r(1.5 * s)}" text-anchor="middle" fill="#fff" font-family="'Comic Sans MS',cursive">${text}</text><circle cx="${r(x - 2.2 * s)}" cy="${r(y + 3.2 * s)}" r="${r(0.5 * s)}" fill="#e2405a"/><circle cx="${r(x + 2.2 * s)}" cy="${r(y + 3.2 * s)}" r="${r(0.5 * s)}" fill="#4ab05a"/>`;
    [[-24, 1, "#fff", "Ich mag dich"], [-12, 1.1, "#ffd0e0", "Frohes Fest"], [0, 1, "#fff", "Schatz"], [12, 1.1, "#d0f0ff", "Für Mama"], [24, 1, "#fff", "Danke"]].forEach(([x, s, f, t]) => { k += herz(x, s, f, t); });
    const [ax, ay] = T(0, y + 9);
    unter.push({ id: "wm_herz", de: "das Lebkuchenherz", syl: "LEB-ku-chen-herz", it: "il cuore di pan pepato", itSyl: "CUO-re", en: "gingerbread heart", x: ax, y: ay, kunst: flaeche(-6, -9, 12, 9.6),
      tipp: "Man hängt es sich um den Hals. Essen kann man es auch – muss man aber nicht." });
  }
  /* DIE GEBRANNTEN MANDELN: Kupferkessel mit Rührarm, Tüten davor */
  {
    const x = 12, y = theke - 2;
    k += `<path d="M${x - 10} ${y - 8} Q${x - 10} ${y} ${x} ${y} Q${x + 10} ${y} ${x + 10} ${y - 8} Z" fill="${S.lg("kupfer", [[0, "#7a3a14"], [0.4, "#e08a4a"], [0.6, "#c86a2a"], [1, "#6a2e0e"]], 0, 0, 1, 0)}"/>`;
    k += `<ellipse cx="${x}" cy="${y - 8}" rx="10" ry="2" fill="#5a2a0e"/>`;
    for (let i = 0; i < 26; i++) k += `<ellipse cx="${r(x - 8 + rnd() * 16)}" cy="${r(y - 8.6 + rnd() * 1.6)}" rx=".9" ry=".55" fill="${rnd() < 0.5 ? "#a0521e" : "#c8742e"}"/>`;
    k += `<path d="M${x} ${y - 8} L${x} ${y - 16} M${x - 6} ${y - 9} L${x + 6} ${y - 9}" stroke="#555" stroke-width=".7"/>`;
    k += `<path d="M${x - 4} ${y - 10} q-1.6 -3 0 -5.6 M${x + 4} ${y - 10} q1.6 -3 0 -5.4" stroke="#fff" stroke-width=".6" fill="none" opacity=".4"/>`;
    for (const dx of [-17, -13]) k += `<path d="M${x + dx - 2} ${y} L${x + dx} ${y - 7} L${x + dx + 2} ${y} Z" fill="#f6efe2" stroke="#b9a37a" stroke-width=".2"/><ellipse cx="${x + dx}" cy="${y - 5.6}" rx="1.4" ry=".9" fill="#a0521e"/>`;
    k += `<rect x="${x - 7}" y="${y - 5}" width="14" height="3" rx=".4" fill="#fffdf4"/><text x="${x}" y="${y - 2.9}" font-size="1.8" text-anchor="middle" fill="#7a3a14" font-family="Arial" font-weight="bold">100 g 3,50 €</text>`;
    const [ax, ay] = T(x - 4, y);
    unter.push({ id: "wm_mandeln", de: "die gebrannten Mandeln", syl: "ge-BRANN-ten MAN-deln", it: "le mandorle caramellate", itSyl: "MAN-dor-le", en: "roasted almonds", x: ax, y: ay, kunst: flaeche(-15, -17, 28, 17),
      tipp: "Der Geruch ist auf dem ganzen Markt zu riechen." });
    /* Hinweis: syl/itSyl korrigiert („ge-BRANN-te“ → „ge-BRANN-ten“, passend zu „die gebrannten“; it. „mandorle“ ist auf MAN betont, nicht „man-DOR-le“) */
  }
  /* DER LIEBESAPFEL: rot glasierte Äpfel am Stiel, in einem Ständer */
  {
    const x = -14, y = theke - 2;
    k += `<rect x="${x - 7}" y="${y - 3}" width="14" height="3" fill="#5a3418"/>`;
    for (const [dx, dy] of [[-4.4, 0], [0, -1], [4.4, 0]]) {
      k += `<line x1="${x + dx}" y1="${y - 3}" x2="${x + dx}" y2="${y - 9 + dy}" stroke="#e8d4a8" stroke-width=".6"/>`;
      k += `<circle cx="${x + dx}" cy="${y - 11.4 + dy}" r="2.6" fill="${S.rg("liebe", [[0, "#ff8a8a"], [0.4, "#d4101e"], [1, "#6e0610"]], 0.35, 0.3, 0.8)}"/><ellipse cx="${x + dx - 0.9}" cy="${y - 12.4 + dy}" rx=".8" ry=".5" fill="#fff" opacity=".8"/>`;
    }
    const [ax, ay] = T(x, y);
    unter.push({ id: "wm_liebesapfel", de: "der Liebesapfel", syl: "LIE-bes-ap-fel", it: "la mela caramellata", itSyl: "ME-la ca-ra-mel-LA-ta", en: "candy apple", x: ax, y: ay, kunst: flaeche(-7.4, -15, 14.8, 15),
      tipp: "Ein Apfel mit roter Zuckerglasur am Holzstiel." });
  }
  /* DIE ZUCKERWATTE: rosa Tüten hängen am Pfosten */
  {
    const x = -30, y = traufe + 16;
    for (const [dx, dy, f] of [[0, 0, "#ffc4dc"], [3.6, 3, "#c8e4ff"], [0, 7, "#ffc4dc"]]) {
      k += `<line x1="${x + dx}" y1="${y + dy - 2}" x2="${x + dx}" y2="${y + dy}" stroke="#ddd" stroke-width=".3"/><path d="M${x + dx - 2.6} ${y + dy} L${x + dx + 2.6} ${y + dy} L${x + dx + 2.2} ${y + dy + 6} L${x + dx - 2.2} ${y + dy + 6} Z" fill="${f}" opacity=".95"/><ellipse cx="${x + dx}" cy="${y + dy + 2.6}" rx="1.8" ry="2" fill="#fff" opacity=".45"/>`;
    }
    const [ax, ay] = T(x + 1.6, y + 13);
    unter.push({ id: "wm_zuckerwatte", de: "die Zuckerwatte", syl: "ZU-cker-wat-te", it: "lo zucchero filato", itSyl: "ZUC-che-ro fi-LA-to", en: "candy floss", x: ax, y: ay, kunst: flaeche(-5, -15.4, 10, 16) });
  }
  S.teil({ id: "wm_bude", de: "die Bude", syl: "BU-de", it: "la bancarella", itSyl: "ban-ca-REL-la", en: "market stall", x: BU.x, y: BU.y, steht: true, kunst: k,
    zoom: { x: 236, y: BU.y + traufe - 2, w: 84, h: 56 }, unter,
    tipp: "Eine Holzbude mit Spitzdach. Jede verkauft etwas anderes." });
}

/* =====================================================================
   9 — DER STEHTISCH (Fass) mit BESUCHER und BESUCHERIN
   ===================================================================== */
{
  let k = schatten(0, 0.4, 9, 1.2, .4);
  k += `<path d="M-6.4 0 Q-7.6 -11 -6.4 -22 L6.4 -22 Q7.6 -11 6.4 0 Z" fill="${S.lg("fass", [[0, "#5e3a1c"], [0.45, "#a06a3a"], [1, "#4e2e14"]], 0, 0, 1, 0)}"/>`;
  for (const y of [-4, -18]) k += `<path d="M-6.8 ${y} Q0 ${y + 1} 6.8 ${y}" stroke="#2a2a2e" stroke-width="1" fill="none"/>`;
  for (const x of [-3.4, 0, 3.4]) k += `<line x1="${x}" y1="-22" x2="${x * 1.1}" y2="0" stroke="#3e2410" stroke-width=".3"/>`;
  k += `<ellipse cx="0" cy="-23" rx="11" ry="2.4" fill="${S.lg("tischplatte", [[0, "#a06a3a"], [1, "#6a4222"]])}"/><ellipse cx="0" cy="-23.6" rx="10.6" ry="2" fill="#ffffff" opacity=".85"/>`;
  for (const dx of [-4, 3.4]) k += `<path d="M${dx - 1.6} -23.4 L${dx - 1.4} -28 L${dx + 1.4} -28 L${dx + 1.6} -23.4 Z" fill="${ROTBECHER}"/><ellipse cx="${dx}" cy="-28" rx="1.4" ry=".35" fill="#4a0a14"/>`;
  S.teil({ id: "wm_stehtisch", de: "der Stehtisch", syl: "STEH-tisch", it: "il tavolo alto", itSyl: "TA-vo-lo AL-to", en: "standing table", x: 180, y: 182, steht: true, kunst: k });
}
const becherInHand = (m) => { const [hx, hy] = handPunkt(m); return `<g transform="translate(${r(hx)} ${r(hy - 1)})"><path d="M-2 0 L-1.8 -5.4 L1.8 -5.4 L2 0 Z" fill="${ROTBECHER}"/><ellipse cx="0" cy="-5.4" rx="1.8" ry=".4" fill="#4a0a14"/><path d="M0 -6.4 q-1 -1.6 0 -3.2 q1 -1.4 0 -2.8" stroke="#fff" stroke-width=".4" opacity=".5" fill="none"/></g>`; };
{
  const m = figur({ id: "wmk_besucher", geschlecht: "m", pose: "halten", blick: 40, frisur: "kurz", haarfarbe: "braun", haut: "mittel", laecheln: true,
    kleidung: { oberteil: { stueck: "pullover", farbe: "grau" }, jacke: { stueck: "jacke", farbe: "#2a3a5a" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "stiefel", farbe: "braun" }, kopf: { stueck: "muetze", farbe: "#3a5a3a" }, zubehoer: { stueck: "schal", farbe: "#8e1b24" } } }, 80);
  S.teil({ id: "wm_besucher", de: "der Besucher", syl: "Be-SU-cher", it: "il visitatore", itSyl: "vi-si-ta-TO-re", en: "visitor", x: 160, y: 186, kunst: m.svg + becherInHand(m),
    tipp: "Man steht am Tisch, hält den Becher in beiden Händen und redet." });
}
{
  const m = figur({ id: "wmk_besucherin", geschlecht: "w", pose: "halten", blick: -40, frisur: "lang", haarfarbe: "blond", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "pullover", farbe: "creme" }, jacke: { stueck: "mantel", farbe: "#7a2e3a" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "stiefel", farbe: "schwarz" }, kopf: { stueck: "muetze", farbe: "#e9e3d4" }, zubehoer: { stueck: "schal", farbe: "#d8ad3a" } } }, 75);
  S.teil({ id: "wm_besucherin", de: "die Besucherin", syl: "Be-SU-che-rin", it: "la visitatrice", itSyl: "vi-si-ta-TRI-ce", en: "visitor", x: 200, y: 188, kunst: m.svg + becherInHand(m),
    tipp: "Mütze, Schal, Handschuhe – ohne geht es Ende November nicht." });
}

/* =====================================================================
   10 — DIE KRIPPE im Holzstall (vorne links der Mitte)
   ===================================================================== */
{
  let k = schatten(0, 0.4, 30, 2, .4);
  /* Stroh am Boden, Holzzaun */
  k += `<path d="M-28 0 Q0 -3 28 0 Z" fill="#d8b860"/>`;
  /* Stall: Rückwand aus Brettern, Pfosten, Strohdach mit Schnee */
  k += `<rect x="-24" y="-40" width="48" height="40" fill="#4a2e18"/>`;
  for (let x = -24; x < 24; x += 4) k += `<rect x="${x}" y="-40" width="3.6" height="40" fill="${x % 8 ? "#5a3820" : "#523218"}"/>`;
  k += `<rect x="-24" y="-40" width="48" height="40" fill="${S.rg("stalllicht", [[0, "#ffd890", 0.55], [1, "#ffd890", 0]], 0.5, 0.7, 0.6)}"/>`;
  k += `<rect x="-26" y="-42" width="3" height="42" fill="#6b4422"/><rect x="23" y="-42" width="3" height="42" fill="#6b4422"/>`;
  k += `<path d="M-32 -38 L0 -56 L32 -38 L30 -36 L0 -52 L-30 -36 Z" fill="#b8913a"/><path d="M-32 -38 L0 -56 L32 -38" stroke="#8a6420" stroke-width="1.2" fill="none"/>`;
  k += `<path d="M-33 -38.6 L0 -57.4 L33 -38.6 Q16 -45 0 -53 Q-16 -45 -33 -38.6 Z" fill="${SCHNEE}"/>`;
  k += `<path d="M0 -66 l1.6 4.4 l4.6 .2 l-3.6 2.8 l1.3 4.4 l-3.9 -2.6 l-3.9 2.6 l1.3 -4.4 l-3.6 -2.8 l4.6 -.2 Z" fill="${GOLD}"/><path d="M0 -60 l-2 6" stroke="#f6dc8a" stroke-width=".8"/>`;
  /* Maria (blau), Josef (braun, Stab), Krippe mit Kind, Ochs und Esel, Schaf */
  k += `<path d="M-13 -1 L-11 -17 Q-9 -21 -7 -17 L-5 -1 Z" fill="#2f5fa8"/><circle cx="-9" cy="-19.6" r="2.3" fill="#efc9a0"/><path d="M-11.6 -19 q2.6 -5 5.2 0 l0 4 l-5.2 0 Z" fill="#2f5fa8"/><path d="M-11.6 -19 q2.6 -5 5.2 0" stroke="#e8e0cc" stroke-width=".5" fill="none"/>`;
  k += `<path d="M6 -1 L7.6 -21 Q10 -25 12.4 -21 L14 -1 Z" fill="#7a4a26"/><circle cx="10" cy="-23.4" r="2.3" fill="#e9bf92"/><path d="M8 -22.4 q2 4 4 0" fill="#8a7a6a"/><line x1="16" y1="-30" x2="16" y2="-1" stroke="#a87a44" stroke-width=".9"/><path d="M16 -30 q2.4 -.4 2 2" stroke="#a87a44" stroke-width=".9" fill="none"/>`;
  k += `<path d="M-4 -8 L4 -8 L3 -2 L-3 -2 Z" fill="#a8783e"/><path d="M-4.4 -1 L-2.6 -8 M4.4 -1 L2.6 -8" stroke="#6b4422" stroke-width=".8"/><path d="M-4 -8 q4 -2 8 0" fill="#e8cf7a"/><circle cx="-.4" cy="-9" r="1.4" fill="#f3d0a6"/><ellipse cx="1.4" cy="-8.6" rx="2" ry="1" fill="#f6efe2"/>`;
  k += `<path d="M-23 -1 q0 -6 2 -8 l6 0 q2 2 2 8 Z" fill="#8a8580"/><path d="M-21 -9 q-3 -1 -3.4 -4 q2 0 3.6 2" fill="#8a8580"/><path d="M-23.4 -12.4 l-1 -2.4 M-21.8 -13 l.4 -2.6" stroke="#5a5550" stroke-width=".6"/>`;
  k += `<path d="M17 -1 q0 -5 3 -7 l4 0 l0 7 Z" fill="#6d5641"/><path d="M20 -8 q.6 -4 3 -4 l1 2" fill="#6d5641"/><ellipse cx="-17" cy="-2.4" rx="3.6" ry="2.4" fill="#f4f0e6"/><circle cx="-14" cy="-3.6" r="1.2" fill="#3a3530"/>`;
  /* Holzzaun vorne */
  k += `<rect x="-28" y="-6" width="56" height="1.4" fill="#7a4e2a"/>`;
  for (const x of [-28, -18, 18, 27]) k += `<rect x="${x - 0.8}" y="-9" width="1.6" height="9" fill="#6b4422"/><path d="M${x - 0.8} -9 l.8 -1.2 l.8 1.2 Z" fill="${SCHNEE}"/>`;
  S.teil({ id: "wm_krippe", de: "die Krippe", syl: "KRIP-pe", it: "il presepe", itSyl: "pre-SE-pe", en: "nativity scene", x: 94, y: 196, steht: true, kunst: k,
    tipp: "Der Stall mit Krippe und Figuren – er steht auf vielen Weihnachtsmärkten." });
}

/* =====================================================================
   11 — DAS KIND zeigt auf das Karussell
   ===================================================================== */
{
  const m = figur({ id: "wmk_kind", geschlecht: "m", alter: "kind", pose: "zeigen", blick: -60, spiegel: true, frisur: "kurz", haarfarbe: "hellbraun", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "pullover", farbe: "blau" }, jacke: { stueck: "jacke", farbe: "#e0802e" }, unterteil: { stueck: "hose", farbe: "#2a2c33" }, schuhe: { stueck: "stiefel", farbe: "braun" }, kopf: { stueck: "muetze", farbe: "#c4202a" }, zubehoer: { stueck: "schal", farbe: "#2f5fa8" } } }, 60);
  S.teil({ id: "wm_kind", de: "das Kind", syl: "KIND", it: "il bambino", itSyl: "bam-BI-no", en: "child", x: 236, y: 186, kunst: schatten(0, 0, 8, 1.2, .3) + m.svg,
    tipp: "Es zeigt auf die Liebesäpfel – und will natürlich einen haben." });
}

/* Schneeflocken und Lichtschein über allem (fangen keinen Tipp) */
{
  let g = `<g pointer-events="none">`;
  for (let i = 0; i < 90; i++) { const y = rnd() * 196, s = 0.3 + (y / 200) * 0.6; g += `<circle cx="${r(rnd() * 320)}" cy="${r(y)}" r="${r(s)}" fill="#fff" opacity="${r(0.5 + rnd() * 0.4)}"/>`; }
  g += `<rect width="320" height="200" fill="${S.rg("vignette", [[0.65, "#000", 0], [1, "#05060f", 0.4]], 0.5, 0.5, 0.75)}"/></g>`;
  S.davor(g);
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/weihnachtsmarkt.js"));
console.log(aus);
