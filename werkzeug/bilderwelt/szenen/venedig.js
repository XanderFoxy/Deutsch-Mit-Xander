#!/usr/bin/env node
/* =====================================================================
   VENEDIG (FASSUNG 854) — Bilderwelt neu: Städte der Welt
   ---------------------------------------------------------------------
   XANDER (03.10.): „die bekannten Sehenswürdigkeiten … zu den bekanntesten
   Städten in anderen Ländern … als Profi-Grafikdesigner auf Hollywood-
   Niveau“ — und (Funk 291) „mit größter Sorgfalt und Präzision“.

   RECHERCHE (Palazzo Ducale/visitmuve „Guida Ducale“, Wikipedia „St Mark's
   Campanile“, „Gondola“, „Piazza San Marco“, „Bridge of Sighs“ u. a.):
   - STANDORT: das Ufer der Insel SAN GIORGIO MAGGIORE (Vaporetto-Linie 2),
     Blick nach Nordwesten über den Bacino di San Marco auf den Molo —
     das berühmteste Postkartenmotiv (so malte es auch Monet). Echte
     Reihenfolge von links (Westen) nach rechts (Osten): die Zecca, die
     Bibliothek (Libreria Marciana, Sansovino: unten dorische Arkaden,
     oben ionische Fenster, Balustrade mit Statuen und Obelisken; von
     hier sieht man ihre lange Seite zur Piazzetta schräg), dahinter der
     CAMPANILE (98,6 m, 12 m breit: 50 m Backsteinschaft mit Lisenen,
     darüber die Glockenstube mit vier Bögen je Seite und fünf Glocken,
     der Würfel mit dem Markuslöwen, die grüne Pyramide, ganz oben der
     goldene Erzengel Gabriel; 1902 eingestürzt, 1912 neu gebaut; an
     seinem Fuß die Loggetta), vorn am Wasser die zwei SÄULEN (links San
     Todaro mit dem heiligen Theodor auf dem Krokodil, rechts der
     geflügelte Bronzelöwe des heiligen Markus), dann der DOGENPALAST
     (Südfassade: 17 Spitzbögen unten, 34 Bögen in der Loggia mit
     Vierpässen, darüber die Wand mit Rautenmuster aus weißem Istrischem
     Stein und rosa Veroneser Marmor, sieben große Fenster — in der Mitte
     der Balkon von 1404 mit der Justitia obenauf, rechts zwei tiefere
     Fenster mit Rundfenstern —, oben weiße Zinnen, Eck-Tabernakel).
     Über dem Palast erscheinen die fünf bleigedeckten KUPPELN des
     MARKUSDOMS mit Zwiebel-Laternen und Kreuzen (sie stehen genau
     hinter der Mitte des Palasts). Rechts der Rio di Palazzo mit dem
     Ponte della Paglia und dahinter der SEUFZERBRÜCKE (weißer
     Kalkstein, geschlossen, zwei kleine vergitterte Fenster), dann das
     GEFÄNGNIS (Prigioni Nuove, Arkade unten) und die Riva degli
     Schiavoni (Palazzo Dandolo, heute Hotel Danieli, rot-gotisch;
     Glockenkamine).
   - GONDEL: 10,85 m lang, 1,40 m breit, schwarz, aus etwa 280 Holzteilen,
     schief gebaut (die linke Seite ist länger). Vorn das „Ferro“ mit
     sechs Zinken nach vorn (die sechs Stadtteile) und einer nach
     hinten; hinten die Forcola (Ruderdolle aus Nussholz). Der
     GONDOLIERE steht hinten und rudert nur rechts; Ringelhemd, dunkle
     Hose, Strohhut mit Band.
   - Typisch: das VAPORETTO (Wasserbus, Linie 2 hält an San Giorgio),
     BRICCOLE (drei Eichenpfähle mit Eisenbändern), Möwen und Tauben,
     die Karnevalsmaske (Colombina mit Federn, am Stab).
   - LICHT: später Nachmittag, die Sonne steht im Westsüdwesten (links):
     die Südfassaden glühen warm, Ostseiten liegen im Schatten.
   Maßstab: Horizont y = 126, Augenhöhe ≈ 5 m über dem Wasser (Kirch-
   treppe). Am Molo (450 m) ≈ 1,3 Einheiten je Meter; Campanile und
   Dom stehen weiter hinten (≈ 1,07 bzw. ≈ 1 je Meter). Gondel in 70 m
   (8,4 je Meter), Pfähle in 30 m, die Touristin am Ufer in 18 m.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "venedig", titel: "Venedig", emoji: "🛶", thema: "Länder", kuerzel: "ven", fassung: 854, breite: 400, hoehe: 260 });
const rnd = zufall(1104);
const r = B.r;
/* Die Wahrzeichen sind in „Molo-Koordinaten“ gezeichnet (Horizont 126,
   1,3 Einheiten je Meter) und werden mit G() auf das Bild gebracht:
   1,7 Einheiten je Meter, Horizont y = 150, Palastmitte x = 215. */
const K = 1.3077, TX = r(215 - 180 * K), TY = r(150 - 126 * K);
const G = (svg) => `<g transform="matrix(${K} 0 0 ${K} ${TX} ${TY})">${svg}</g>`;
const X = (x) => r(TX + K * x), Y = (y) => r(TY + K * y);
const U = (u) => Object.assign({}, u, { x: X(u.x), y: Y(u.y), kunst: `<g transform="scale(${K})">${u.kunst}</g>` });
const Z = (z) => ({ x: X(z.x), y: Y(z.y), w: r(z.w * K), h: r(z.h * K) });
const HOR = 150;
const MOLO = 131.2;      /* Pflaster am Molo (Fuß der Gebäude), Molo-Koordinaten */
const WASSER0 = 132.4;   /* Wasserlinie am Molo, Molo-Koordinaten */
const WASSER = Y(WASSER0);   /* = 158.5 im Bild */
/* Figuren klein halten: Koordinaten ganzzahlig (1 cm) — bei dieser Größe unsichtbar */
const rund = (n) => { const v = Math.round(+n); return String(v === 0 ? 0 : v); };
const kompakt = (svg) => svg.replace(/ d="([^"]+)"/g, (a, p) => ` d="${p.replace(/-?\d*\.?\d+/g, rund)}"`)
  .replace(/ (x|y|x1|y1|x2|y2|cx|cy|fx|fy)="(-?\d*\.?\d+)"/g, (a, k, n) => ` ${k}="${rund(n)}"`);
const F = 765;               /* 1,7 je Meter in 450 m; Auge 5 m über dem Wasser, 4 m über dem Ufer */
const wl = (d) => r(HOR + 5 * F / d);

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("spiegel")}" x="-10%" y="-20%" width="120%" height="140%"><feGaussianBlur stdDeviation=".9 .35"/></filter>`);
S.def(`<filter id="${S.id("dunst")}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation=".35"/></filter>`);
/* Stoffe */
const ISTRIA = S.lg("istria", [[0, "#fbf6ec"], [1, "#e2d8c6"]]);
const ISTRIA_S = S.lg("istrias", [[0, "#cfc4b2"], [1, "#b2a693"]]);
const ZIEGEL = S.lg("ziegel", [[0, "#cf7a5c"], [0.6, "#bb664b"], [1, "#a8563f"]], 0, 0, 1, 0);
const ZIEGEL_S = S.lg("ziegels", [[0, "#8a4535"], [1, "#6f372b"]], 0, 0, 1, 0);
const KUPFER = S.lg("kupfer", [[0, "#9ccbb3"], [1, "#6aa38a"]]);
const KUPFER_S = S.lg("kupfers", [[0, "#5d8f7a"], [1, "#3f6b5a"]]);
const BLEI = S.lg("blei", [[0, "#d7d9d6"], [0.45, "#b5b9b8"], [1, "#7c8285"]], 0, 0, 1, 0);
const GOLD = S.lg("gold", [[0, "#fff3b0"], [0.45, "#f0c64a"], [1, "#a8760f"]], 0, 0, 1, 1);
const DUNKEL = "#4c3d3a";   /* Schatten in Arkaden und Fenstern */
/* Rautenmuster des Dogenpalasts: weißer Istrischer Stein und rosa Veroneser Marmor */
S.def(`<pattern id="${S.id("raute")}" patternUnits="userSpaceOnUse" width="3.2" height="2.6"><rect width="3.2" height="2.6" fill="#f0c3ad"/><path d="M1.6 0 L3.2 1.3 L1.6 2.6 L0 1.3 Z" fill="#dc9a84" stroke="#fbf1e6" stroke-width=".42"/><path d="M1.6 .75 L2.25 1.3 L1.6 1.85 L.95 1.3 Z" fill="#f3d9cc"/></pattern>`);
/* Ringelhemd des Gondoliere (in Figur-Zentimetern) */
S.def(`<pattern id="${S.id("ringel")}" patternUnits="userSpaceOnUse" width="200" height="10"><rect width="200" height="4.6" fill="#1d2f5e"/></pattern>`);

/* =====================================================================
   KULISSE — Abendhimmel, Dunst, Zecca, Piazzetta-Tiefe, Riva, Molo
   ===================================================================== */
S.hinten(`<rect width="400" height="${WASSER + 2}" fill="${S.lg("himmel", [[0, "#5f93c6"], [0.45, "#9cbfdc"], [0.8, "#ead8bd"], [1, "#f6dfbd"]])}"/>`);
/* die tiefe Sonne steht links außerhalb des Bildes */
S.hinten(`<rect width="400" height="${WASSER + 2}" fill="${S.rg("sonne", [[0, "#fff1c8", 0.85], [0.35, "#ffe2a8", 0.35], [1, "#ffe2a8", 0]], 0, 0.62, 0.75)}"/>`);
{
  /* Haufenwolken im Abendlicht: links von der tiefen Sonne angestrahlt,
     rechts kühler im Schatten, die Unterseite warm */
  S.def(`<filter id="${S.id("wolke")}" x="-20%" y="-30%" width="140%" height="160%"><feGaussianBlur stdDeviation=".3"/></filter>`);
  const wolke = (x, y, s, buckel) => {
    let g = `<g filter="url(#${S.id("wolke")})">`;
    for (const [dx, dy, rr] of buckel) g += `<circle cx="${r(x + (dx + 1.5) * s)}" cy="${r(y + (dy + 1.3) * s)}" r="${r(rr * s)}" fill="#cdb7bd"/>`;
    for (const [dx, dy, rr] of buckel) g += `<circle cx="${r(x + dx * s)}" cy="${r(y + dy * s)}" r="${r(rr * s)}" fill="${S.rg("wolkelicht", [[0, "#ffffff"], [0.45, "#fff2df"], [0.8, "#f0d3c2"], [1, "#d9b8b8"]], 0.25, 0.25, 0.9)}"/>`;
    return g + `</g>`;
  };
  /* jede Wolke mit eigener Form; die unteren Buckel liegen flach (Wolkenboden) */
  S.hinten(wolke(62, 30, 0.95, [[-18, 3, 4.6], [-11, 0, 6.8], [-3, -5, 8.4], [6, -7, 7], [13, -2, 7.4], [20, 2.6, 4.4], [-6, 3, 6], [7, 3.4, 6]]));
  S.hinten(wolke(214, 20, 0.75, [[-10, 2, 4], [-4, -3, 6.4], [3, -1, 5.2], [9, 2.2, 3.6], [0, 3, 4.6]]));
  S.hinten(wolke(338, 42, 1, [[-24, 4, 3.4], [-17, 1.6, 5.4], [-9, -2.4, 6.6], [0, -1, 5.6], [8, -4.6, 7.6], [17, 0, 5.8], [24, 3.6, 3.6], [-4, 3.6, 5], [12, 3.8, 4.6]]));
  S.hinten(wolke(156, 66, 0.5, [[-8, 2, 4], [-2, -2, 5.6], [5, 1, 4.4], [10, 3, 2.6]]));
  /* flache Abendbänke (Altocumulus) über dem Horizont: links golden, rechts kühl */
  let band = "";
  for (const [x, y, w, h] of [[40, 112, 70, 1.8], [120, 118, 50, 1.2], [250, 108, 90, 1.6], [330, 116, 60, 1.3], [190, 124, 40, 1]]) band += `<ellipse cx="${x}" cy="${y}" rx="${w / 2}" ry="${h}" fill="${S.lg("bank", [[0, "#ffd7a6", 0.75], [0.5, "#f7d8c4", 0.5], [1, "#c9c3d6", 0.45]], 0, 0, 1, 0, ' gradientUnits="userSpaceOnUse" x1="0" x2="400"')}"/>`;
  S.hinten(`<g filter="url(#${S.id("wolke")})">${band}</g>`);
}
/* Dunst über der Lagune am Horizont, ferne Dächer von Castello rechts */
S.hinten(`<rect x="0" y="${HOR - 22}" width="400" height="24" fill="${S.lg("dunst", [[0, "#f4dcc0", 0], [1, "#f4dcc0", 0.6]])}"/>`);

/* Die Zecca (Münze, Sansovino): schwere Rustika, ganz links */
{
  let k = `<rect x="-2" y="104" width="29" height="${r(MOLO - 104)}" fill="${S.lg("zecca", [[0, "#d9cfbd"], [1, "#bdb19c"]])}"/>`;
  for (let y = 106; y < MOLO; y += 2.2) k += `<line x1="-2" y1="${r(y)}" x2="27" y2="${r(y)}" stroke="#a69a85" stroke-width=".25"/>`;
  for (let i = 0; i < 4; i++) {
    const x = 1 + i * 6.6;
    k += `<path d="M${r(x)} ${MOLO} L${r(x)} 125 Q${r(x + 2)} 122.6 ${r(x + 4)} 125 L${r(x + 4)} ${MOLO} Z" fill="${DUNKEL}"/>`;
    k += `<rect x="${r(x + 0.6)}" y="113.4" width="2.8" height="4.6" fill="#5a4c45"/><rect x="${r(x + 0.2)}" y="112.6" width="3.6" height=".8" fill="#ece4d4"/>`;
    k += `<rect x="${r(x + 0.8)}" y="106.4" width="2.4" height="3.2" fill="#5a4c45"/>`;
  }
  k += `<rect x="-2" y="103" width="29" height="1.4" fill="#efe7d8"/><rect x="-2" y="119.6" width="29" height="1" fill="#e6dccb"/>`;
  k += `<rect x="-2" y="104" width="29" height="${r(MOLO - 104)}" fill="${S.lg("zeccalicht", [[0, "#fff1d6", 0.25], [1, "#000", 0.08]], 0, 0, 1, 0)}"/>`;
  S.hinten(G(k));
}
/* Tiefe der Piazzetta: die Procuratie Vecchie am Ende des Platzes (im Dunst) */
{
  let k = `<rect x="100" y="113" width="34" height="${r(MOLO - 113)}" fill="#e4ddd2"/>`;
  for (let row = 0; row < 3; row++) for (let i = 0; i < 11; i++) k += `<path d="M${r(101 + i * 3)} ${r(MOLO - 0.5 - row * 5.6)} l0 -3 q1 -1.4 2 0 l0 3 Z" fill="${row ? "#aaa4a0" : "#958e8c"}"/>`;
  k += `<rect x="100" y="112.4" width="34" height="1" fill="#f1ede6"/><rect x="100" y="118.2" width="34" height=".5" fill="#efe9e0"/><rect x="100" y="123.8" width="34" height=".5" fill="#efe9e0"/>`;
  /* Pflaster der Piazzetta mit hellen Streifen */
  k += `<path d="M88 ${MOLO} L134 ${MOLO} L134 ${r(MOLO - 1.2)} L96 ${r(MOLO - 1.2)} Z" fill="#cfc6b6"/>`;
  S.hinten(G(k));
}
/* Rio di Palazzo: links die Ostfassade des Palasts (Renaissance, Istrischer Stein im
   Halbschatten, Fensterreihen und Gesimse), rechts die Westwand des Gefängnisses im
   tiefen Schatten, dazwischen der dunkle Kanal mit Wasser und Lichtstreifen */
{
  let k = `<rect x="227" y="100" width="16" height="${r(MOLO - 100)}" fill="${S.lg("rio", [[0, "#6d625e"], [1, "#3a3336"]])}"/>`;
  k += `<path d="M227 99 L233 102.4 L233 ${MOLO} L227 ${MOLO} Z" fill="${S.lg("ostwand", [[0, "#e2d8ca"], [1, "#c3b6a5"]], 0, 0, 1, 0)}"/>`;
  for (const y of [104.6, 111.4, 118.4, 124.6]) k += `<path d="M227 ${y} L233 ${r(y + 1.6)}" stroke="#f3ece0" stroke-width=".45"/>`;
  for (const [y, h] of [[105.6, 3.6], [112.4, 4], [119.4, 3.4], [125.6, 3]]) for (const x of [228.2, 230.6]) k += `<path d="M${x} ${r(y + (x - 227) * 0.27)} l1.4 .4 l0 ${h} l-1.4 -.4 Z" fill="#544a49"/>`;
  k += `<path d="M243 103 L238.4 105 L238.4 ${MOLO} L243 ${MOLO} Z" fill="${S.lg("prigwest", [[0, "#7f776d"], [1, "#655e57"]], 0, 0, 1, 0)}"/>`;
  for (const y of [108, 115, 122]) k += `<rect x="239.6" y="${y}" width="1.6" height="2.6" fill="#3e3836"/>`;
  k += `<rect x="233" y="${r(MOLO - 2.6)}" width="5.4" height="2.8" fill="#2f4446"/><path d="M233.6 ${r(MOLO - 1.6)} l3.8 0 M234.4 ${r(MOLO - 0.8)} l2.4 0" stroke="#bcd3cf" stroke-width=".25" opacity=".8"/>`;
  S.hinten(G(k));
}

/* Riva degli Schiavoni: Palazzo Dandolo (Hotel Danieli) und die Nachbarhäuser.
   Nach rechts kommen sie näher an San Giorgio heran: etwas größer, Fuß tiefer. */
{
  let k = "";
  const haus = (x0, x1, top, fuss, farbe, gotisch, kamine) => {
    let g = `<rect x="${x0}" y="${top}" width="${x1 - x0}" height="${r(fuss - top)}" fill="${farbe}"/>`;
    g += `<rect x="${x0}" y="${top}" width="${x1 - x0}" height="${r(fuss - top)}" fill="${S.lg("hauslicht", [[0, "#fff4dc", 0.22], [1, "#000", 0.12]], 0, 0, 1, 0)}"/>`;
    g += `<rect x="${r(x0 - 0.4)}" y="${r(top - 0.8)}" width="${r(x1 - x0 + 0.8)}" height=".9" fill="#efe5d5"/>`;
    const n = Math.round((x1 - x0) / 4.2), dx = (x1 - x0) / n, fl = Math.round((fuss - top - 4) / 6);
    for (let f = 0; f < fl; f++) for (let i = 0; i < n; i++) {
      const x = x0 + i * dx + dx * 0.32, y = top + 2 + f * 6;
      if (gotisch && f > 0 && f < fl - 1 && i >= n / 2 - 1.5 && i <= n / 2 + 0.5) {
        g += `<path d="M${r(x - 0.3)} ${r(y + 4)} L${r(x - 0.3)} ${r(y + 1.2)} Q${r(x + 0.9)} ${r(y - 0.6)} ${r(x + 2.1)} ${r(y + 1.2)} L${r(x + 2.1)} ${r(y + 4)} Z" fill="#3e3433" stroke="#f5ede0" stroke-width=".3"/>`;
      } else if (gotisch) {
        g += `<path d="M${r(x)} ${r(y + 4)} L${r(x)} ${r(y + 1.4)} Q${r(x + 0.8)} ${r(y)} ${r(x + 1.6)} ${r(y + 1.4)} L${r(x + 1.6)} ${r(y + 4)} Z" fill="#3e3433" stroke="#f5ede0" stroke-width=".25"/>`;
      } else {
        g += `<rect x="${r(x)}" y="${r(y + 0.6)}" width="1.6" height="3.2" fill="#3e3433"/><rect x="${r(x - 0.3)}" y="${r(y + 0.2)}" width="2.2" height=".5" fill="#efe5d5"/>`;
      }
    }
    /* Glockenkamine (typisch venezianisch) */
    for (const kx of kamine) g += `<rect x="${r(kx - 0.4)}" y="${r(top - 4)}" width=".8" height="3.4" fill="#a8604a"/><path d="M${r(kx - 1.3)} ${r(top - 4)} L${r(kx + 1.3)} ${r(top - 4)} L${r(kx + 0.6)} ${r(top - 2.4)} L${r(kx - 0.6)} ${r(top - 2.4)} Z" fill="#b86a50"/>`;
    return g;
  };
  k += haus(297, 327, 104, 131.8, "#c56d5d", true, [302, 316, 324]);
  k += haus(327, 350, 103, 132.2, "#e2c79a", false, [333, 345]);
  k += haus(350, 372, 101.6, 132.6, "#dca48c", false, [356, 367]);
  /* La Pietà: weiße klassische Kirchenfassade mit Giebel */
  k += `<rect x="372" y="99" width="30" height="${r(133 - 99)}" fill="${ISTRIA}"/>`;
  k += `<path d="M376 99 L387 92.6 L398 99 Z" fill="#f1e9dc" stroke="#cfc4b2" stroke-width=".4"/>`;
  for (const x of [377, 382, 392, 397]) k += `<rect x="${x - 0.7}" y="100" width="1.4" height="${r(133 - 101)}" fill="#e9e0d0" stroke="#cfc4b2" stroke-width=".2"/>`;
  k += `<path d="M385 133 L385 120 Q387 117.6 389 120 L389 133 Z" fill="${DUNKEL}"/><circle cx="387" cy="110" r="2" fill="#6e625a"/>`;
  S.hinten(G(k));
}
/* Der Molo: Kante aus Istrischem Stein, Laternen, ein paar Menschen.
   Davor der Ponte della Paglia über den Rio di Palazzo. */
{
  let k = `<path d="M0 ${r(MOLO - 0.5)} L227 ${r(MOLO - 0.5)} L243 ${r(MOLO - 0.2)} L400 ${r(MOLO + 1.2)} L400 ${r(WASSER0 + 1.8)} L0 ${r(WASSER0 + 0.4)} Z" fill="${S.lg("molo", [[0, "#ece4d6"], [1, "#bfb4a2"]])}"/>`;
  for (const x of [8, 30, 60, 140, 160, 200, 252, 280, 310, 340, 365]) {
    const y = MOLO - 0.5 + (x > 243 ? (x - 243) / 157 * 1.4 : 0);
    k += `<line x1="${x}" y1="${r(y)}" x2="${x}" y2="${r(y - 4.6)}" stroke="#2f3236" stroke-width=".3"/><path d="M${x - 0.6} ${r(y - 4.6)} L${x + 0.6} ${r(y - 4.6)} L${x + 0.4} ${r(y - 5.8)} L${x - 0.4} ${r(y - 5.8)} Z" fill="#fff3cf" stroke="#2f3236" stroke-width=".15"/>`;
  }
  /* kleine Spaziergänger (in 450 m nur Striche) */
  for (let i = 0; i < 26; i++) {
    const x = 4 + rnd() * 390;
    if (x > 225 && x < 245) continue;
    const y = MOLO - 0.4 + (x > 243 ? (x - 243) / 157 * 1.4 : 0), h = 2 + rnd() * 0.5;
    const c = ["#2d2f3a", "#7a2f2f", "#e8e4dc", "#2f4f7a", "#8a6a3a"][Math.floor(rnd() * 5)];
    k += `<path d="M${r(x + 0.3)} ${r(y)} l2.2 .25 l0 .25 l-2.2 -.1 Z" fill="#6b5a4c" opacity=".35"/><rect x="${r(x)}" y="${r(y - h)}" width=".55" height="${r(h)}" rx=".25" fill="${c}"/><circle cx="${r(x + 0.27)}" cy="${r(y - h - 0.35)}" r=".32" fill="#d9b49a"/>`;
  }
  S.hinten(G(k));
}

/* =====================================================================
   1 — DER CAMPANILE (98,6 m) mit Loggetta — Lupe: Glocke, Engel
   ===================================================================== */
{
  const CX = 99, FUSS = 130.2, s = 1.07;
  const y = (m) => r(FUSS - m * s);
  const L = CX - 9.4, R = CX + 5;   /* Südseite (Licht) L..CX, Ostseite (Schatten) CX..R */
  let k = "";
  /* Schaft aus Backstein mit Lisenen und Rundbögen oben */
  k += `<rect x="${L}" y="${y(50)}" width="${r(CX - L)}" height="${r(50 * s)}" fill="${ZIEGEL}"/>`;
  k += `<rect x="${CX}" y="${y(50)}" width="${r(R - CX)}" height="${r(50 * s)}" fill="${ZIEGEL_S}"/>`;
  for (let i = 0; i < 4; i++) {
    const x = L + 0.9 + i * 2.05;
    k += `<path d="M${r(x)} ${y(1)} L${r(x)} ${y(46.6)} Q${r(x + 0.7)} ${y(47.6)} ${r(x + 1.4)} ${y(46.6)} L${r(x + 1.4)} ${y(1)} Z" fill="#a9573f"/>`;
    k += `<line x1="${r(x)}" y1="${y(1)}" x2="${r(x)}" y2="${y(46.6)}" stroke="#7d3c2c" stroke-width=".25"/>`;
  }
  /* die Ostseite ist gleich gebaut, nur verkürzt: ebenfalls vier Felder */
  for (let i = 0; i < 4; i++) {
    const x = CX + 0.4 + i * 1.15;
    k += `<path d="M${r(x)} ${y(1)} L${r(x)} ${y(46.6)} Q${r(x + 0.38)} ${y(47.4)} ${r(x + 0.76)} ${y(46.6)} L${r(x + 0.76)} ${y(1)} Z" fill="#5e2d23"/>`;
  }
  /* feine Backsteinlagen */
  for (let m = 2; m < 50; m += 2.4) k += `<line x1="${L}" y1="${y(m)}" x2="${R}" y2="${y(m)}" stroke="#7a3a2b" stroke-width=".1" opacity=".5"/>`;
  k += `<rect x="${r(L - 0.4)}" y="${y(50.6)}" width="${r(R - L + 0.8)}" height="1" fill="${ISTRIA}"/>`;
  /* Glockenstube: Balustrade, vier Bögen je Seite, Glocken darin */
  k += `<rect x="${L}" y="${y(61.5)}" width="${r(CX - L)}" height="${r(11 * s)}" fill="${ISTRIA}"/>`;
  k += `<rect x="${CX}" y="${y(61.5)}" width="${r(R - CX)}" height="${r(11 * s)}" fill="${ISTRIA_S}"/>`;
  const glocke = (x, yy, w) => `<path d="M${r(x - w / 2)} ${r(yy)} Q${r(x - w / 2)} ${r(yy - w * 0.9)} ${r(x)} ${r(yy - w)} Q${r(x + w / 2)} ${r(yy - w * 0.9)} ${r(x + w / 2)} ${r(yy)} Z" fill="${S.lg("bronze", [[0, "#c79a4a"], [1, "#6e4f1f"]], 0, 0, 1, 0)}"/>`;
  for (let i = 0; i < 4; i++) {
    const x = L + 0.6 + i * 2.15;
    k += `<path d="M${r(x)} ${y(52)} L${r(x)} ${y(58.4)} Q${r(x + 0.8)} ${y(60)} ${r(x + 1.6)} ${y(58.4)} L${r(x + 1.6)} ${y(52)} Z" fill="#3c302c"/>`;
    if (i === 1 || i === 2) k += glocke(x + 0.8, FUSS - 54.6 * s, 1.3);
  }
  for (let i = 0; i < 4; i++) {
    const x = CX + 0.35 + i * 1.17;
    k += `<path d="M${r(x)} ${y(52)} L${r(x)} ${y(58.4)} Q${r(x + 0.4)} ${y(59.5)} ${r(x + 0.8)} ${y(58.4)} L${r(x + 0.8)} ${y(52)} Z" fill="#2c2321"/>`;
  }
  for (let x = L + 0.3; x < R; x += 0.8) k += `<rect x="${r(x)}" y="${y(52.4)}" width=".35" height="1.4" fill="${x < CX ? "#f3ece0" : "#b9ae9d"}"/>`;
  k += `<rect x="${r(L - 0.6)}" y="${y(62.4)}" width="${r(R - L + 1.2)}" height="1.1" fill="#f6f0e4"/>`;
  /* Würfel (Attika) mit dem Markuslöwen und der Venezia */
  k += `<rect x="${L}" y="${y(70.5)}" width="${r(CX - L)}" height="${r(8.1 * s)}" fill="${S.lg("attika", [[0, "#e5d3c0"], [1, "#d2b9a2"]])}"/>`;
  k += `<rect x="${CX}" y="${y(70.5)}" width="${r(R - CX)}" height="${r(8.1 * s)}" fill="#a99280"/>`;
  /* Relief des geflügelten Markuslöwen (Stein) auf der Südseite */
  k += `<rect x="${r(CX - 8)}" y="${y(69.4)}" width="7.4" height="${r(6.6 * s)}" fill="#dccab6" stroke="#b9a48d" stroke-width=".2"/>`;
  {
    /* schreitender Löwe nach links: Mähne, Heiligenschein, erhobene Schwingen,
       die rechte Vorderpfote auf dem aufgeschlagenen Buch */
    const ox = CX - 7.6, oy = FUSS - 69.2 * s;
    const q = (dx, dy) => `${r(ox + dx)} ${r(oy + dy)}`;
    const STEIN = "#9c7f63", HELL = "#c4ab8f";
    let l = `<circle cx="${r(ox + 1.7)}" cy="${r(oy + 2.9)}" r="1.45" fill="none" stroke="${HELL}" stroke-width=".3"/>`;
    l += `<path d="M${q(3.2, 3.4)} Q${q(3, 1.2)} ${q(4.4, .5)} Q${q(4.3, 1.6)} ${q(5, 1.2)} Q${q(4.9, 2.2)} ${q(5.7, 2)} Q${q(5.2, 3.2)} ${q(4.4, 3.8)} Z" fill="${STEIN}"/>`;
    l += `<path d="M${q(3.6, 3)} L${q(4.3, 1.1)} M${q(4, 3.2)} L${q(5, 1.8)}" stroke="${HELL}" stroke-width=".18"/>`;
    l += `<path d="M${q(2.2, 3.6)} Q${q(2.4, 3.2)} ${q(3.4, 3.4)} L${q(5.4, 3.6)} Q${q(6.2, 3.8)} ${q(6.1, 4.8)} L${q(6.2, 6.3)} L${q(5.7, 6.3)} L${q(5.5, 5.2)} L${q(4.8, 5.2)} L${q(4.7, 6.3)} L${q(4.2, 6.3)} L${q(4.1, 5.1)} L${q(3, 5.1)} L${q(2.9, 6.3)} L${q(2.4, 6.3)} L${q(2.3, 5)} Q${q(1.9, 4.4)} ${q(2.2, 3.6)} Z" fill="${STEIN}"/>`;
    l += `<path d="M${q(2.4, 4.4)} L${q(1.3, 4.9)} L${q(1.2, 5.3)}" stroke="${STEIN}" stroke-width=".45" fill="none" stroke-linecap="round"/>`;
    l += `<path d="M${q(6.1, 4.2)} Q${q(7, 3.6)} ${q(6.7, 2.6)}" stroke="${STEIN}" stroke-width=".25" fill="none"/><circle cx="${r(ox + 6.7)}" cy="${r(oy + 2.5)}" r=".22" fill="${STEIN}"/>`;
    l += `<circle cx="${r(ox + 1.75)}" cy="${r(oy + 3)}" r="1.05" fill="#8a6c52"/><circle cx="${r(ox + 1.45)}" cy="${r(oy + 3.15)}" r=".55" fill="${STEIN}"/>`;
    l += `<path d="M${q(.5, 5.3)} L${q(1.3, 5.1)} L${q(2.1, 5.3)} L${q(2.1, 6.2)} L${q(1.3, 6)} L${q(.5, 6.2)} Z" fill="#efe4d2" stroke="${STEIN}" stroke-width=".12"/><line x1="${r(ox + 1.3)}" y1="${r(oy + 5.1)}" x2="${r(ox + 1.3)}" y2="${r(oy + 6)}" stroke="${STEIN}" stroke-width=".1"/>`;
    k += l;
  }
  k += `<rect x="${r(L - 0.4)}" y="${y(71)}" width="${r(R - L + 0.8)}" height=".8" fill="#f6f0e4"/>`;
  /* grüne Pyramide (zwei Seiten) und der goldene Engel */
  const spitze = [r(CX - 0.6), y(95.5)];
  k += `<path d="M${r(L - 0.2)} ${y(71)} L${spitze[0]} ${spitze[1]} L${CX} ${y(71)} Z" fill="${KUPFER}"/>`;
  k += `<path d="M${CX} ${y(71)} L${spitze[0]} ${spitze[1]} L${r(R + 0.2)} ${y(71)} Z" fill="${KUPFER_S}"/>`;
  k += `<path d="M${r(L + 1.5)} ${y(72)} L${spitze[0]} ${spitze[1]}" stroke="#c4e6d6" stroke-width=".35" opacity=".7"/>`;
  for (let m = 75; m < 93; m += 3.4) { const t = (m - 71) / 24.5; k += `<line x1="${r(L + (CX - 0.6 - L) * t)}" y1="${y(m)}" x2="${r(CX)}" y2="${y(m)}" stroke="#5f9480" stroke-width=".15"/>`; }
  /* Erzengel Gabriel: Gewand, Flügel, ausgestreckter Arm */
  const ax = spitze[0], ay = spitze[1];
  /* der Engel steht als Wetterfahne auf einer Kugel: langes Gewand, die
     Flügel nach hinten gelegt, der rechte Arm weist nach vorn */
  const e = (dx, dy) => `${r(ax + dx)} ${r(ay + dy)}`;
  k += `<circle cx="${ax}" cy="${r(ay - 0.3)}" r=".45" fill="${GOLD}"/>`;
  k += `<path d="M${e(-1.4, -3.6)} Q${e(-2.8, -4.6)} ${e(-3.3, -6.4)} Q${e(-2, -5.8)} ${e(-1.2, -5.2)} Q${e(-2.2, -6.2)} ${e(-2.3, -7.4)} Q${e(-0.9, -6.4)} ${e(-0.4, -4.8)} Z" fill="${GOLD}" stroke="#a8760f" stroke-width=".08"/>`;
  k += `<path d="M${e(-0.6, -0.7)} Q${e(-0.8, -2.6)} ${e(-0.5, -4.4)} L${e(0.4, -4.4)} Q${e(0.7, -2.6)} ${e(0.7, -0.7)} Z" fill="${GOLD}"/>`;
  k += `<path d="M${e(-0.3, -1.2)} Q${e(0, -2.6)} ${e(-0.1, -4)}" stroke="#a8760f" stroke-width=".1" fill="none"/>`;
  k += `<circle cx="${r(ax - 0.05)}" cy="${r(ay - 4.95)}" r=".5" fill="${GOLD}"/>`;
  k += `<path d="M${e(0.3, -4.1)} L${e(2.2, -4.9)}" stroke="#d9a92e" stroke-width=".32" stroke-linecap="round"/><path d="M${e(-0.3, -4)} L${e(-0.6, -2.8)}" stroke="#d9a92e" stroke-width=".28" stroke-linecap="round"/>`;
  /* Loggetta am Fuß (rotbrauner Marmor, drei Bögen) */
  const lx = CX + 1;
  k += `<rect x="${lx}" y="${r(FUSS - 8.2)}" width="13" height="8.2" fill="${S.lg("loggetta", [[0, "#b9786a"], [1, "#9a5d50"]])}"/>`;
  for (let i = 0; i < 3; i++) k += `<path d="M${r(lx + 1.2 + i * 4)} ${FUSS} L${r(lx + 1.2 + i * 4)} ${r(FUSS - 3.6)} Q${r(lx + 2.4 + i * 4)} ${r(FUSS - 5)} ${r(lx + 3.6 + i * 4)} ${r(FUSS - 3.6)} L${r(lx + 3.6 + i * 4)} ${FUSS} Z" fill="#4a3530"/>`;
  for (let i = 0; i < 4; i++) k += `<rect x="${r(lx + 0.3 + i * 4)}" y="${r(FUSS - 6)}" width=".6" height="6" fill="#efe7da"/>`;
  k += `<rect x="${r(lx - 0.3)}" y="${r(FUSS - 8.9)}" width="13.6" height=".9" fill="#efe7da"/>`;
  S.teil({ id: "campanile", de: "der Campanile", syl: "cam-pa-NI-le", it: "il campanile", itSyl: "cam-pa-NI-le", en: "bell tower",
    x: 0, y: 0, kunst: G(k), tipp: "Der Campanile ist fast 99 Meter hoch. 1902 stürzte er ein – er wurde genau so wieder aufgebaut.",
    zoom: Z({ x: 70, y: 22, w: 58, h: 56 }),
    unter: [
      { id: "glocke", de: "die Glocke", syl: "GLO-cke", it: "la campana", itSyl: "cam-PA-na", en: "bell", x: CX - 4.5, y: y(52), kunst: flaeche(-5, -7, 10, 7) ,
        tipp: "In der Glockenstube hängen fünf Glocken. Die größte heißt „Marangona“." },
      { id: "engel", de: "der Engel", syl: "EN-gel", it: "l'angelo", itSyl: "AN-ge-lo", en: "angel", x: spitze[0], y: spitze[1], kunst: flaeche(-3.6, -7.8, 6.4, 8.2, 0.6),
        tipp: "Ganz oben dreht sich ein goldener Engel im Wind: der Erzengel Gabriel." },
    ].map(U) });
}

/* =====================================================================
   2 — DER MARKUSDOM: fünf bleigedeckte Kuppeln mit Laternen,
       hinter der Mitte des Dogenpalasts — Lupe: Kuppel
   ===================================================================== */
{
  let k = "";
  const kuppel = (x, top, w, gross) => {
    const b = 99.6;   /* unten verdeckt der Palast */
    let g = `<rect x="${r(x - w * 0.52)}" y="${r(top + w * 0.55)}" width="${r(w * 1.04)}" height="${r(b - top - w * 0.55)}" fill="#c9b9a6"/>`;
    for (let i = 0; i < (gross ? 7 : 5); i++) { const xx = x - w * 0.42 + i * (w * 0.84) / ((gross ? 7 : 5) - 1); g += `<path d="M${r(xx - 0.5)} ${r(top + w * 0.55 + 3.2)} l0 -1.6 q.5 -.8 1 0 l0 1.6 Z" fill="#5d4f47"/>`; }
    /* überhöhte, fast eiförmige Bleihaube (≈ 1,25 × Halbkreis) mit Bleibahnen */
    const hh = w * 0.72;
    g += `<path d="M${r(x - w / 2)} ${r(top + hh)} C${r(x - w / 2)} ${r(top + hh * 0.3)} ${r(x - w * 0.3)} ${r(top - 0.4)} ${r(x)} ${r(top)} C${r(x + w * 0.3)} ${r(top - 0.4)} ${r(x + w / 2)} ${r(top + hh * 0.3)} ${r(x + w / 2)} ${r(top + hh)} Z" fill="${BLEI}"/>`;
    for (const t of [-0.36, -0.22, -0.08, 0.08, 0.22, 0.36]) g += `<path d="M${r(x + t * w * 1.3)} ${r(top + hh)} Q${r(x + t * w * 1.25)} ${r(top + hh * 0.2)} ${r(x)} ${r(top + 0.1)}" stroke="#8d9396" stroke-width=".18" fill="none"/>`;
    g += `<path d="M${r(x - w * 0.38)} ${r(top + hh * 0.75)} C${r(x - w * 0.38)} ${r(top + hh * 0.25)} ${r(x - w * 0.2)} ${r(top + 0.6)} ${r(x - 0.4)} ${r(top + 0.3)}" stroke="#f4f5f2" stroke-width=".55" opacity=".7" fill="none"/>`;
    /* große Laterne: Säulchen, Zwiebel, vergoldete Kugel, Kreuz */
    const lw = w * 0.3;
    g += `<rect x="${r(x - lw / 2)}" y="${r(top - lw * 0.8)}" width="${r(lw)}" height="${r(lw * 0.85)}" fill="#d8d0c2"/>`;
    for (const t of [-0.25, 0.1]) g += `<rect x="${r(x + t * lw)}" y="${r(top - lw * 0.7)}" width="${r(lw * 0.18)}" height="${r(lw * 0.55)}" fill="#4e443f"/>`;
    g += `<path d="M${r(x - lw * 0.62)} ${r(top - lw * 0.8)} Q${r(x - lw * 0.8)} ${r(top - lw * 1.5)} ${r(x)} ${r(top - lw * 2.2)} Q${r(x + lw * 0.8)} ${r(top - lw * 1.5)} ${r(x + lw * 0.62)} ${r(top - lw * 0.8)} Z" fill="${BLEI}"/>`;
    g += `<circle cx="${r(x)}" cy="${r(top - lw * 2.4)}" r="${r(lw * 0.24)}" fill="${GOLD}"/>`;
    g += `<path d="M${r(x)} ${r(top - lw * 2.6)} L${r(x)} ${r(top - lw * 3.6)} M${r(x - lw * 0.3)} ${r(top - lw * 3.25)} L${r(x + lw * 0.3)} ${r(top - lw * 3.25)}" stroke="#d9a92e" stroke-width="${gross ? 0.42 : 0.34}"/>`;
    return g;
  };
  /* von hinten nach vorn: West (fern), Nord (fern), Mitte, Süd (nah), Ost (nah) */
  k += kuppel(157, 88.4, 11.6) + kuppel(194, 88, 11.2) + kuppel(180, 83.4, 15.6, true) + kuppel(167, 88.2, 12.6) + kuppel(205, 88.6, 12.6);
  S.teil({ id: "markusdom", de: "der Markusdom", syl: "MAR-kus-dom", it: "la Basilica di San Marco", itSyl: "ba-SI-li-ca di san MAR-co", en: "St Mark's Basilica",
    x: 0, y: 0, kunst: G(k), tipp: "Der Markusdom hat fünf große Kuppeln. Innen glänzen goldene Mosaiken.",
    zoom: Z({ x: 146, y: 76, w: 72, h: 30 }),
    unter: [
      { id: "kuppel", de: "die Kuppel", syl: "KUP-pel", it: "la cupola", itSyl: "CU-po-la", en: "dome", x: 205, y: 93, kunst: flaeche(-6.6, -9, 13.2, 9),
        tipp: "Die Kuppeln sind aus Holz und mit Blei gedeckt – darum glänzen sie silbern." },
    ].map(U) });
}

/* =====================================================================
   3 — DIE BIBLIOTHEK (Libreria Marciana): Südende und die lange,
       schräg gesehene Seite zur Piazzetta
   ===================================================================== */
{
  let k = "";
  /* Südende, drei Joche: es fluchtet leicht nach links (Oberkante fällt zum
     Horizont), im Abendlicht hell — die lange Seite liegt im Schatten */
  const x0 = 26, x1 = 50, T = 102.2;
  const sy = (x, y) => r(y + (x1 - x) / (x1 - x0) * 1.3 * (MOLO - y) / (MOLO - T));
  k += `<path d="M${x0} ${sy(x0, T)} L${x1} ${T} L${x1} ${MOLO} L${x0} ${MOLO} Z" fill="${ISTRIA}"/>`;
  for (let i = 0; i < 3; i++) {
    const x = x0 + 1.6 + i * 7.6, d = (yy) => sy(x + 2.4, yy);
    k += `<path d="M${r(x)} ${MOLO} L${r(x)} ${d(123.4)} Q${r(x + 2.4)} ${d(120.2)} ${r(x + 4.8)} ${d(123.4)} L${r(x + 4.8)} ${MOLO} Z" fill="${DUNKEL}"/>`;
    k += `<rect x="${r(x - 1.1)}" y="${d(117.6)}" width=".9" height="${r(MOLO - d(117.6))}" fill="#f3ecdf"/>`;
    k += `<path d="M${r(x + 0.6)} ${d(116)} L${r(x + 0.6)} ${d(110.8)} Q${r(x + 2.4)} ${d(108.4)} ${r(x + 4.2)} ${d(110.8)} L${r(x + 4.2)} ${d(116)} Z" fill="#54463f"/>`;
    for (let j = 0; j < 4; j++) k += `<rect x="${r(x + 0.8 + j * 0.95)}" y="${d(115)}" width=".4" height="1.2" fill="#f3ecdf"/>`;
    k += `<ellipse cx="${r(x + 2.4)}" cy="${d(106.4)}" rx="1" ry=".7" fill="#54463f"/>`;
  }
  k += `<path d="M${x0} ${sy(x0, 117)} L${x1} 117 L${x1} 118.1 L${x0} ${sy(x0, 118.1)} Z M${x0} ${sy(x0, 105)} L${x1} 105 L${x1} 108 L${x0} ${sy(x0, 108)} Z" fill="#f4ecdd"/>`;
  for (let x = x0 + 1; x < x1; x += 1.2) k += `<rect x="${r(x)}" y="${sy(x, T - 1.6)}" width=".5" height="1.6" fill="#f3ecdf"/>`;
  k += `<path d="M${x0 - 0.4} ${sy(x0, T - 2)} L${x1 + 0.4} ${T - 2} L${x1 + 0.4} ${T - 1.4} L${x0 - 0.4} ${sy(x0, T - 1.4)} Z" fill="#f7f1e6"/>`;
  for (const [x, ob] of [[x0 + 0.6, true], [x0 + 8, false], [x0 + 16, false], [x1 - 0.6, true]]) {
    const yb = sy(x, T - 2);
    if (ob) k += `<path d="M${r(x - 0.6)} ${yb} L${r(x)} ${r(yb - 5.4)} L${r(x + 0.6)} ${yb} Z" fill="#e9e1d1"/><circle cx="${r(x)}" cy="${r(yb - 5.8)}" r=".35" fill="#e9e1d1"/>`;
    else k += `<path d="M${r(x - 0.5)} ${yb} l.1 -2.6 q.4 -1 .8 0 l.1 2.6 Z" fill="#e1d8c6"/><circle cx="${r(x)}" cy="${r(yb - 3.2)}" r=".45" fill="#e1d8c6"/>`;
  }
  k += `<path d="M${x0} ${sy(x0, T)} L${x1} ${T} L${x1} ${MOLO} L${x0} ${MOLO} Z" fill="${S.lg("libstirn", [[0, "#ffd496", 0.16], [1, "#ffd496", 0.26]], 0, 0, 1, 0)}"/>`;
  /* die lange Seite zur Piazzetta, perspektivisch (21 Joche, fern kleiner) */
  const wA = 1 / 455, wB = 1 / 575;
  const P = (t, a, b) => (a * wA * (1 - t) + b * wB * t) / (wA * (1 - t) + wB * t);
  const xs = (t) => P(t, x1, 92), top = (t) => P(t, T, 107.6), fuss = (t) => P(t, MOLO, 130.4), mitte = (t) => P(t, 117, 119.4);
  k += `<path d="M${x1} ${T} L92 107.6 L92 130.4 L${x1} ${MOLO} Z" fill="${S.lg("libs", [[0, "#cdc1ae"], [1, "#c1b6a6"]], 0, 0, 1, 0)}"/>`;
  for (let i = 0; i < 21; i++) {
    const a = i / 21, b = (i + 0.62) / 21, c = (i + 0.31) / 21;
    const xa = r(xs(a) + 0.35), xb = r(xs(b) + 0.35), xm = r(xs(c) + 0.35);
    k += `<path d="M${xa} ${r(fuss(a))} L${xa} ${r(mitte(a) + (fuss(a) - mitte(a)) * 0.42)} Q${xm} ${r(mitte(c) + (fuss(c) - mitte(c)) * 0.18)} ${xb} ${r(mitte(b) + (fuss(b) - mitte(b)) * 0.42)} L${xb} ${r(fuss(b))} Z" fill="#5a4b43"/>`;
    k += `<path d="M${xa} ${r(mitte(a) - 1.3)} L${xa} ${r(top(a) + (mitte(a) - top(a)) * 0.5)} Q${xm} ${r(top(c) + (mitte(c) - top(c)) * 0.32)} ${xb} ${r(top(b) + (mitte(b) - top(b)) * 0.5)} L${xb} ${r(mitte(b) - 1.3)} Z" fill="#6a5a50"/>`;
    if (i % 2 === 0) k += `<path d="M${r(xs(c))} ${r(top(c) - 1.5)} l.15 -1.9 q.25 -.6 .5 0 l.15 1.9 Z" fill="#ddd3c1"/>`;
  }
  k += `<path d="M${x1} ${r(117)} L92 119.4" stroke="#f3ecdf" stroke-width=".6"/><path d="M${x1} ${T + 3} L92 ${r(110.2)}" stroke="#efe7d8" stroke-width="1.4"/>`;
  k += `<path d="M${x1} ${T - 1.6} L92 106.3 L92 107.6 L${x1} ${T} Z" fill="#efe7d8"/>`;
  k += `<path d="M${x1} ${T} L${x1} ${MOLO}" stroke="#fff6e4" stroke-width=".5"/>`;
  S.teil({ id: "bibliothek", de: "die Bibliothek", syl: "bi-bli-o-THEK", it: "la Biblioteca Marciana", itSyl: "bi-blio-TE-ca mar-CIA-na", en: "Marciana Library",
    x: 0, y: 0, kunst: G(k), tipp: "In der Bibliothek von Sansovino liegen sehr alte Bücher und Landkarten." });
}

/* =====================================================================
   4 — DER DOGENPALAST (Südfassade am Molo)
       Lupe: Arkade, Loggia, Balkon
   ===================================================================== */
const PAL = { x0: 132, x1: 228, fuss: MOLO, porT: 121.6, logT: 111.8, top: 98.6 };
{
  const { x0, x1, fuss, porT, logT, top } = PAL, W = x1 - x0;
  let k = "";
  /* das Walmdach aus Blei hinter den Zinnen (darunter lagen die „Piombi“, die Bleikammern) */
  k += `<path d="M${x0 + 0.6} ${top} L${x0 + 9} 92.2 L${x1 - 9} 92.2 L${x1 - 0.6} ${top} Z" fill="${S.lg("bleidach", [[0, "#c9cdcd"], [0.5, "#a8aeb1"], [1, "#8a9195"]], 0, 0, 1, 0)}"/>`;
  for (let x = x0 + 4; x < x1 - 3; x += 1.6) k += `<line x1="${r(x)}" y1="${r(x < x0 + 9 ? top - (x - x0 - 0.6) * 0.76 : (x > x1 - 9 ? top - (x1 - 0.6 - x) * 0.76 : 92.4))}" x2="${r(x)}" y2="${top}" stroke="#7d8488" stroke-width=".12" opacity=".7"/>`;
  k += `<path d="M${x0 + 9} 92.2 L${x1 - 9} 92.2" stroke="#e3e6e6" stroke-width=".35"/>`;
  /* Wand mit Rautenmuster und warmem Abendlicht */
  k += `<rect x="${x0}" y="${top}" width="${W}" height="${r(logT - top)}" fill="url(#${S.id("raute")})"/>`;
  k += `<rect x="${x0}" y="${top}" width="${W}" height="${r(logT - top)}" fill="${S.lg("wandlicht", [[0, "#fff0d0", 0.28], [0.55, "#fff0d0", 0], [1, "#5a3a3a", 0.16]], 0, 0, 1, 0)}"/>`;
  /* Fenster: drei links, Balkon, drei rechts (die zwei äußersten tiefer, mit Rundfenstern) */
  const fenster = (cx, oben, unten) => {
    let g = `<path d="M${r(cx - 2.3)} ${r(unten + 0.4)} L${r(cx - 2.3)} ${r(oben + 2.2)} Q${r(cx - 2.3)} ${r(oben)} ${r(cx)} ${r(oben - 0.9)} Q${r(cx + 2.3)} ${r(oben)} ${r(cx + 2.3)} ${r(oben + 2.2)} L${r(cx + 2.3)} ${r(unten + 0.4)} Z" fill="#f8f1e6"/>`;
    g += `<path d="M${r(cx - 1.6)} ${r(unten)} L${r(cx - 1.6)} ${r(oben + 2.2)} Q${r(cx - 1.6)} ${r(oben + 0.6)} ${r(cx)} ${r(oben)} Q${r(cx + 1.6)} ${r(oben + 0.6)} ${r(cx + 1.6)} ${r(oben + 2.2)} L${r(cx + 1.6)} ${r(unten)} Z" fill="${S.lg("fglas", [[0, "#3f3e48"], [1, "#5b5560"]])}"/>`;
    g += `<line x1="${r(cx)}" y1="${r(oben + 0.2)}" x2="${r(cx)}" y2="${r(unten)}" stroke="#f3ead9" stroke-width=".3"/>`;
    g += `<rect x="${r(cx - 2.6)}" y="${r(unten)}" width="5.2" height=".7" fill="#fbf6ec"/>`;
    return g;
  };
  for (const cx of [140.5, 153.5, 166.5, 193.5]) k += fenster(cx, 101.6, 108.8);
  for (const cx of [207, 219]) { k += fenster(cx, 104, 110.4); k += `<circle cx="${cx}" cy="101" r="1.25" fill="#f8f1e6"/><circle cx="${cx}" cy="101" r=".8" fill="#4a4550"/>`; }
  /* der Balkon von 1404: Tabernakel mit Fialen, oben die Justitia */
  const BX = 180;
  {
    /* hoher gotischer Tabernakel (Dalle Masegne): zwei Fialentürmchen mit
       Figurennischen, Kielbogen-Wimperg mit Krabben, ganz oben Justitia
       mit Schwert und Waage — über die Zinnenlinie hinaus */
    let b = "";
    for (const sx of [-1, 1]) {
      const tx = BX + sx * 4.3;
      b += `<path d="M${r(tx - 0.9)} ${logT} L${r(tx - 0.9)} 97 L${tx} 92.6 L${r(tx + 0.9)} 97 L${r(tx + 0.9)} ${logT} Z" fill="#fbf6ec" stroke="#d9cdb9" stroke-width=".15"/>`;
      for (const ny of [107.6, 101.8]) b += `<path d="M${r(tx - 0.55)} ${ny} l0 -2.4 q.55 -.8 1.1 0 l0 2.4 Z" fill="#b9ab96"/><path d="M${r(tx - 0.2)} ${ny} l0 -1.6 q.2 -.4 .4 0 l0 1.6 Z" fill="#f4eee2"/>`;
      for (const cy of [96, 94.6]) b += `<path d="M${r(tx - 0.5 + (cy - 92.6) * 0.1)} ${cy} l-.4 -.3" stroke="#e8dcc8" stroke-width=".25"/>`;
    }
    b += `<path d="M${BX - 3.4} ${logT - 0.6} L${BX - 3.4} 103.4 Q${BX - 3.4} 100.4 ${BX} 99 Q${BX + 3.4} 100.4 ${BX + 3.4} 103.4 L${BX + 3.4} ${logT - 0.6} Z" fill="#f6eee0"/>`;
    b += `<path d="M${BX - 2.2} ${logT - 0.8} L${BX - 2.2} 104.4 Q${BX} 101.8 ${BX + 2.2} 104.4 L${BX + 2.2} ${logT - 0.8} Z" fill="#433f4a"/><path d="M${BX} 102.2 L${BX} ${logT - 0.8} M${BX - 2.2} 106.4 L${BX + 2.2} 106.4" stroke="#efe4d2" stroke-width=".3"/><circle cx="${BX}" cy="103.6" r=".7" fill="none" stroke="#efe4d2" stroke-width=".25"/>`;
    /* Kielbogen-Wimperg mit Krabben und Kreuzblume */
    b += `<path d="M${BX - 3.6} 102.6 Q${BX - 2.8} 99.6 ${BX - 0.8} 98.4 Q${BX - 0.1} 97.6 ${BX} 95 Q${BX + 0.1} 97.6 ${BX + 0.8} 98.4 Q${BX + 2.8} 99.6 ${BX + 3.6} 102.6" stroke="#fbf6ec" stroke-width=".7" fill="none"/>`;
    for (const t of [0.25, 0.5, 0.75]) for (const sx of [-1, 1]) b += `<circle cx="${r(BX + sx * (3.2 - t * 3))}" cy="${r(102 - t * 5.4)}" r=".3" fill="#fbf6ec"/>`;
    b += `<path d="M${BX - 0.6} 95.2 L${BX} 94 L${BX + 0.6} 95.2 Z" fill="#fbf6ec"/>`;
    /* Justitia auf der Spitze */
    b += `<path d="M${BX - 0.7} 94.2 l.2 -2.8 q.5 -1 1 0 l.2 2.8 Z" fill="#f4ecdc"/><circle cx="${BX}" cy="90.8" r=".45" fill="#f4ecdc"/>`;
    b += `<line x1="${BX + 0.5}" y1="92.4" x2="${BX + 1.2}" y2="89.4" stroke="#d8cdb9" stroke-width=".25"/><path d="M${BX - 0.5} 92.2 L${BX - 1.8} 92.2 M${BX - 2.2} 92.2 l.4 .9 l.4 -.9 M${BX - 1.4} 92.2 l.4 .9 l.4 -.9" stroke="#d8cdb9" stroke-width=".16" fill="none"/>`;
    /* Balkonplatte mit Brüstung, vorspringend */
    b += `<rect x="${BX - 4}" y="${logT - 2.4}" width="8" height="2.4" fill="#fbf6ec"/>`;
    for (let x = BX - 3.6; x < BX + 3.8; x += 0.8) b += `<rect x="${r(x)}" y="${r(logT - 2.1)}" width=".38" height="1.6" fill="#cdbfaa"/>`;
    b += `<rect x="${BX - 4.4}" y="${logT - 0.1}" width="8.8" height=".7" fill="#e3d6c3"/>`;
    k += b;
  }
  /* Loggia: Brüstung, 34 Bögen mit Dreipass, Reihe der Vierpässe */
  k += `<rect x="${x0}" y="${logT}" width="${W}" height="${r(porT - logT)}" fill="#f6eee2"/>`;
  const lb = W / 34;
  for (let i = 0; i < 34; i++) {
    const x = x0 + i * lb, m = x + lb / 2;
    k += `<path d="M${r(x + 0.42)} ${r(porT - 1.5)} L${r(x + 0.42)} ${r(logT + 4.6)} Q${r(x + 0.42)} ${r(logT + 3.4)} ${r(m)} ${r(logT + 2.9)} Q${r(x + lb - 0.42)} ${r(logT + 3.4)} ${r(x + lb - 0.42)} ${r(logT + 4.6)} L${r(x + lb - 0.42)} ${r(porT - 1.5)} Z" fill="${S.lg("loggiaschatten", [[0, "#4a454c"], [1, "#6e6468"]])}"/>`;
    k += `<circle cx="${r(m - 0.5)}" cy="${r(logT + 4.4)}" r=".42" fill="#f6eee2"/><circle cx="${r(m + 0.5)}" cy="${r(logT + 4.4)}" r=".42" fill="#f6eee2"/>`;
    if (i > 0) k += `<circle cx="${r(x)}" cy="${r(logT + 1.7)}" r="1" fill="#f6eee2" stroke="#c2b39f" stroke-width=".18"/>` + [[0, -0.36], [0.36, 0], [0, 0.36], [-0.36, 0]].map(([dx, dy]) => `<circle cx="${r(x + dx)}" cy="${r(logT + 1.7 + dy)}" r=".33" fill="#5e4c48"/>`).join("");
  }
  k += `<rect x="${x0}" y="${r(porT - 1.6)}" width="${W}" height="1.6" fill="#f3e9da"/>`;
  for (let x = x0 + 0.5; x < x1; x += 0.94) k += `<rect x="${r(x)}" y="${r(porT - 1.45)}" width=".35" height="1.2" fill="#b9a993"/>`;
  k += `<rect x="${x0}" y="${r(logT - 0.4)}" width="${W}" height=".8" fill="#fbf6ec"/>`;
  /* Portikus: 17 Spitzbögen auf gedrungenen Säulen */
  const pb = W / 17;
  k += `<rect x="${x0}" y="${porT}" width="${W}" height="${r(fuss - porT)}" fill="#f2e9da"/>`;
  for (let i = 0; i < 17; i++) {
    const x = x0 + i * pb, m = x + pb / 2;
    k += `<path d="M${r(x + 0.85)} ${fuss} L${r(x + 0.85)} ${r(porT + 4.4)} Q${r(x + 0.9)} ${r(porT + 1.8)} ${r(m)} ${r(porT + 1)} Q${r(x + pb - 0.9)} ${r(porT + 1.8)} ${r(x + pb - 0.85)} ${r(porT + 4.4)} L${r(x + pb - 0.85)} ${fuss} Z" fill="${S.lg("portikus", [[0, "#2f3036"], [1, "#56525a"]])}"/>`;
    if (i > 0) k += `<path d="M${r(x - 1.1)} ${r(porT + 3.6)} L${r(x + 1.1)} ${r(porT + 3.6)} L${r(x + 0.65)} ${r(porT + 4.8)} L${r(x - 0.65)} ${r(porT + 4.8)} Z" fill="#fbf6ec"/><rect x="${r(x - 0.75)}" y="${r(porT + 4.8)}" width="1.5" height="${r(fuss - porT - 4.8)}" fill="${S.lg("saeulchen", [[0, "#fffaf0"], [1, "#d9cdb9"]], 0, 0, 1, 0)}"/>`;
  }
  k += `<rect x="${x0}" y="${r(porT - 0.2)}" width="${W}" height=".7" fill="#fbf6ec"/>`;
  /* Ecken: Säule mit Skulptur (Adam und Eva links, Noah rechts) */
  for (const x of [x0 + 0.5, x1 - 0.5]) k += `<rect x="${r(x - 0.7)}" y="${porT}" width="1.4" height="${r(fuss - porT)}" fill="#fbf6ec"/>`;
  /* Eckskulpturen auf Höhe der Kapitelle: links Adam und Eva, rechts die Trunkenheit Noahs */
  k += `<path d="M${x0 + 0.1} ${porT + 4} l.25 -2.6 q.25 -.5 .5 0 l.25 2.6 Z M${x0 + 0.8} ${porT + 4} l.2 -2.3 q.25 -.5 .5 0 l.2 2.3 Z" fill="#ddd0bc"/>`;
  /* Trunkenheit Noahs: der liegende Noah, zwei Söhne, darüber der Weinstock */
  k += `<path d="M${x1 - 3.2} ${porT + 4.2} q.6 -1 1.6 -.8 l1.2 .3 l-.1 .5 Z" fill="#ddd0bc"/><path d="M${x1 - 1.2} ${porT + 4.2} l.1 -2.6 q.3 -.6 .6 0 l.1 2.6 Z M${x1 + 0.1} ${porT + 4.2} l.1 -2.4 q.3 -.6 .6 0 l.1 2.4 Z" fill="#e3d7c4"/>`;
  k += `<path d="M${x1 - 3.4} ${porT + 1.4} q1.2 -1.2 2.4 -.4 q1.2 .8 2 -.4" stroke="#7d6e52" stroke-width=".25" fill="none"/>` + [[-2.8, 1.1], [-1.6, 0.8], [-0.4, 1.2], [0.6, 0.7]].map(([dx, dy]) => `<path d="M${r(x1 + dx)} ${r(porT + dy)} q.4 -.6 .8 0 q-.4 .5 -.8 0 Z" fill="#9fb38a"/>`).join("") + `<circle cx="${r(x1 - 1)}" cy="${r(porT + 1.9)}" r=".25" fill="#6b5a7a"/>`;
  /* Zinnen: weiße Blattzinnen mit Spitzen, Eck-Tabernakel */
  for (let x = x0 + 1.2; x < x1 - 1; x += 2.62) k += `<path d="M${r(x - 0.75)} ${top} L${r(x - 0.75)} ${r(top - 1.4)} Q${r(x)} ${r(top - 2.2)} ${r(x)} ${r(top - 3)} Q${r(x)} ${r(top - 2.2)} ${r(x + 0.75)} ${r(top - 1.4)} L${r(x + 0.75)} ${top} Z" fill="#fbf7ef"/><line x1="${r(x + 1.31)}" y1="${top}" x2="${r(x + 1.31)}" y2="${r(top - 1.3)}" stroke="#f3ecdf" stroke-width=".3"/>`;
  k += `<rect x="${x0}" y="${r(top - 0.2)}" width="${W}" height=".8" fill="#f6efe2"/>`;
  for (const x of [x0 + 0.6, x1 - 0.6]) k += `<rect x="${r(x - 1)}" y="${r(top - 4.6)}" width="2" height="4.6" fill="#fbf7ef"/><path d="M${r(x - 1.1)} ${r(top - 4.6)} L${r(x)} ${r(top - 9.4)} L${r(x + 1.1)} ${r(top - 4.6)} Z" fill="#f1e9dc"/><rect x="${r(x - 0.4)}" y="${r(top - 3.8)}" width=".8" height="2.2" fill="#6e6060"/>`;
  /* Licht von links: die Fassade glüht, nach rechts etwas kühler */
  k += `<rect x="${x0}" y="${top}" width="${W}" height="${r(fuss - top)}" fill="${S.lg("abendglut", [[0, "#ffb860", 0.3], [0.6, "#ffc77a", 0.14], [1, "#ffc77a", 0.06]], 0, 0, 1, 0)}"/>`;
  S.teil({ id: "dogenpalast", de: "der Dogenpalast", syl: "DO-gen-pa-last", it: "il Palazzo Ducale", itSyl: "pa-LAZ-zo du-CA-le", en: "Doge's Palace",
    x: 0, y: 0, kunst: G(k), tipp: "Im Dogenpalast regierte der Doge, das Oberhaupt von Venedig. Die Wand hat ein Muster aus rosa und weißem Stein.",
    zoom: Z({ x: 126, y: 82, w: 124, h: 52 }),
    unter: [
      { id: "arkade", de: "die Arkade", syl: "ar-KA-de", it: "il portico", itSyl: "POR-ti-co", en: "arcade", x: x0, y: fuss, kunst: flaeche(0, -(fuss - porT), W, fuss - porT, 0.5),
        tipp: "Unten hat der Palast 17 Spitzbögen – man kann im Schatten darunter gehen." },
      { id: "loggia", de: "die Loggia", syl: "LOG-gia", it: "la loggia", itSyl: "LOG-gia", en: "loggia", x: x0, y: porT, kunst: flaeche(0, -(porT - logT - 0.7), W, porT - logT - 0.7, 0.5),
        tipp: "Die Loggia hat 34 Bögen – doppelt so viele wie unten." },
      { id: "balkon", de: "der Balkon", syl: "bal-KON", it: "il balcone", itSyl: "bal-CO-ne", en: "balcony", x: BX, y: logT + 0.6, kunst: flaeche(-5.2, -24, 10.4, 24.6, 0.5),
        tipp: "Der Balkon ist von 1404. Ganz oben steht die Justitia mit Schwert und Waage." },
    ].map(U) });
}

/* =====================================================================
   5 — DIE SEUFZERBRÜCKE (über dem Rio di Palazzo, hinter dem Ponte della Paglia)
   ===================================================================== */
{
  const x = 235, y = 119.4;
  let k = `<path d="M-6.2 0 L-6.2 -6.6 L6.2 -6.6 L6.2 0 Q0 -2.4 -6.2 0 Z" fill="${ISTRIA}"/>`;
  /* Segmentbogen mit sichtbarer Laibung (Untersicht), Rustika-Fugen */
  k += `<path d="M-6.2 0 Q0 -2.4 6.2 0 L6.2 1 Q0 -1.2 -6.2 1 Z" fill="#9b8f80"/><path d="M-6.2 1 Q0 -1.2 6.2 1" stroke="#7a6f62" stroke-width=".2" fill="none"/>`;
  for (const yy of [-4.4, -2.2]) k += `<path d="M-6.2 ${yy} L-4.6 ${yy} M4.6 ${yy} L6.2 ${yy}" stroke="#cfc3b0" stroke-width=".2"/>`;
  for (const sx of [-1, 1]) k += `<rect x="${r(sx * 5.4 - 0.5)}" y="-6.6" width="1" height="6" fill="#ece3d4"/>`;
  /* zwei kleine Fenster mit Steingittern */
  for (const sx of [-1, 1]) {
    k += `<rect x="${r(sx * 2.4 - 1.1)}" y="-5" width="2.2" height="2.2" fill="#3f3a3b"/>`;
    k += `<path d="M${r(sx * 2.4 - 1.1)} -3.9 h2.2 M${r(sx * 2.4)} -5 v2.2 M${r(sx * 2.4 - 1.1)} -5 l2.2 2.2 M${r(sx * 2.4 + 1.1)} -5 l-2.2 2.2" stroke="#efe7d8" stroke-width=".25"/>`;
  }
  /* geschwungener Giebel mit Wappen und Maskenkopf */
  k += `<path d="M-6.4 -6.6 Q-6 -8.4 -3.6 -8 Q-1.6 -10.2 0 -10.6 Q1.6 -10.2 3.6 -8 Q6 -8.4 6.4 -6.6 Z" fill="#f4ede0" stroke="#c9bda9" stroke-width=".25"/>`;
  k += `<ellipse cx="0" cy="-8.4" rx=".9" ry="1.1" fill="#e2d7c4" stroke="#a99c88" stroke-width=".2"/><circle cx="0" cy="-1.6" r=".55" fill="#d7cbb8"/>`;
  S.teil({ oben: true, id: "seufzerbruecke", de: "die Seufzerbrücke", syl: "SEUF-zer-brü-cke", it: "il Ponte dei Sospiri", itSyl: "PON-te dei so-SPI-ri", en: "Bridge of Sighs",
    x: X(x), y: Y(y), kunst: `<g transform="scale(${K})">${k}</g>`, tipp: "Über die Seufzerbrücke gingen Gefangene vom Gericht ins Gefängnis. Durch die kleinen Fenster sahen sie ein letztes Mal die Lagune." });
}

/* =====================================================================
   5b — DIE BRÜCKE (Ponte della Paglia): weißer Bogen mit Balustrade
   ===================================================================== */
{
  let k = `<path d="M225 ${MOLO + 1.2} Q235 125.6 245 ${MOLO + 1.4} L245 ${MOLO - 1} Q235 123.4 225 ${MOLO - 1} Z" fill="${ISTRIA}"/>`;
  k += `<path d="M228.4 ${MOLO + 1.2} Q235 127.8 241.6 ${MOLO + 1.4} Z" fill="#3b4447"/>`;
  for (let x = 226; x < 245; x += 1.1) { const y = MOLO - 1 - Math.sin((x - 225) / 20 * Math.PI) * 3.8; k += `<rect x="${r(x)}" y="${r(y - 1.6)}" width=".45" height="1.6" fill="#f6efe2"/>`; }
  k += `<path d="M225 ${r(MOLO - 2.6)} Q235 121.8 245 ${r(MOLO - 2.6)}" stroke="#fbf6ec" stroke-width=".5" fill="none"/>`;
  for (const [x, c] of [[231, "#b3242c"], [233.4, "#2f4f7a"], [238, "#e8e4dc"]]) k += `<rect x="${x}" y="${r(MOLO - 6.4)}" width=".55" height="2.2" rx=".25" fill="${c}"/><circle cx="${x + 0.27}" cy="${r(MOLO - 6.75)}" r=".32" fill="#d9b49a"/>`;
  S.teil({ id: "bruecke", de: "die Brücke", syl: "BRÜ-cke", it: "il ponte", itSyl: "PON-te", en: "bridge", x: 0, y: 0, kunst: G(k),
    tipp: "Von dieser Brücke, dem Ponte della Paglia, fotografieren alle die Seufzerbrücke." });
}

/* =====================================================================
   6 — DAS GEFÄNGNIS (Prigioni Nuove): Arkade, Fenster mit Giebeln
   ===================================================================== */
{
  const x0 = 243, x1 = 297, T = 105, F = 131.4;
  let k = `<rect x="${x0}" y="${T}" width="${x1 - x0}" height="${F - T}" fill="${S.lg("prig", [[0, "#ddd3c2"], [1, "#c6baa6"]])}"/>`;
  const b = (x1 - x0) / 7;
  for (let i = 0; i < 7; i++) {
    const x = x0 + i * b, m = x + b / 2;
    k += `<path d="M${r(x + 1.4)} ${F} L${r(x + 1.4)} 124.2 Q${r(m)} 120.4 ${r(x + b - 1.4)} 124.2 L${r(x + b - 1.4)} ${F} Z" fill="${DUNKEL}"/>`;
    k += `<rect x="${r(m - 1.3)}" y="110" width="2.6" height="4.6" fill="#4a4140"/><path d="M${r(m - 1.3)} 109.6 h2.6 M${r(m - 0.4)} 110 v4.6 M${r(m + 0.4)} 110 v4.6" stroke="#9a8f80" stroke-width=".25"/>`;
    k += `<path d="M${r(m - 2)} 109.6 L${r(m)} 108 L${r(m + 2)} 109.6 Z" fill="#efe7d8"/>`;
    k += `<rect x="${r(x - 0.5)}" y="${T + 1}" width="1" height="${r(118 - T - 1)}" fill="#eae1d1"/>`;
  }
  for (let y = 120; y < F; y += 1.6) k += `<line x1="${x0}" y1="${r(y)}" x2="${x1}" y2="${r(y)}" stroke="#a99d8a" stroke-width=".2"/>`;
  k += `<rect x="${x0}" y="118" width="${x1 - x0}" height="1.6" fill="#efe7d8"/><rect x="${x0 - 0.5}" y="${T - 1.2}" width="${x1 - x0 + 1}" height="1.6" fill="#f3ecdf"/>`;
  k += `<rect x="${x0}" y="${T}" width="${x1 - x0}" height="${F - T}" fill="${S.lg("priglicht", [[0, "#fff2d4", 0.2], [1, "#000", 0.06]], 0, 0, 1, 0)}"/>`;
  S.teil({ id: "gefaengnis", de: "das Gefängnis", syl: "ge-FÄNG-nis", it: "la prigione", itSyl: "pri-GIO-ne", en: "prison", x: 0, y: 0, kunst: G(k),
    tipp: "Das neue Gefängnis ist mit dem Dogenpalast durch die Seufzerbrücke verbunden." });
}

/* =====================================================================
   7 — DIE SÄULEN von San Marco und San Todaro — Lupe: Löwe
   ===================================================================== */
{
  let k = "";
  const saeule = (x, granit, oben) => {
    let g = schatten(x + 2, MOLO, 4, 0.6, 0.25);
    g += `<rect x="${r(x - 3)}" y="${r(MOLO - 1)}" width="6" height="1" fill="#e9e1d1"/><rect x="${r(x - 2.4)}" y="${r(MOLO - 2)}" width="4.8" height="1" fill="#f3ecdf"/><rect x="${r(x - 1.8)}" y="${r(MOLO - 3.4)}" width="3.6" height="1.4" fill="#ece4d4"/>`;
    g += `<path d="M${r(x - 1.15)} ${r(MOLO - 3.4)} L${r(x - 0.95)} 113.2 L${r(x + 0.95)} 113.2 L${r(x + 1.15)} ${r(MOLO - 3.4)} Z" fill="${granit}"/>`;
    g += `<path d="M${r(x - 0.6)} ${r(MOLO - 3.6)} L${r(x - 0.5)} 113.6" stroke="#fff" stroke-width=".35" opacity=".35"/>`;
    g += `<path d="M${r(x - 1)} 113.2 L${r(x - 1.7)} 111 L${r(x + 1.7)} 111 L${r(x + 1)} 113.2 Z" fill="#f4ede0"/><rect x="${r(x - 2)}" y="110.2" width="4" height=".9" fill="#ece4d4"/>`;
    return g + oben;
  };
  /* San Todaro (weißer Marmor): steht mit Speer und Schild auf dem Krokodil */
  const T0 = 86, q0 = (dx, dy) => `${r(T0 + dx)} ${r(110.2 + dy)}`;
  let todaro = `<path d="M${q0(-2.4, 0)} Q${q0(-2.6, -0.8)} ${q0(-1.4, -0.9)} L${q0(1.4, -0.9)} Q${q0(2.2, -0.8)} ${q0(2.6, -0.4)} L${q0(3.4, -0.6)} L${q0(2.6, 0)} Z" fill="#cfc5b2"/><path d="M${q0(-2.4, -0.4)} q-.8 -.6 -.4 -1.2" stroke="#cfc5b2" stroke-width=".35" fill="none"/>`;
  todaro += `<path d="M${q0(-0.6, -0.9)} L${q0(-0.5, -3.6)} Q${q0(-0.6, -4.6)} ${q0(0, -4.8)} Q${q0(0.6, -4.6)} ${q0(0.5, -3.6)} L${q0(0.6, -0.9)} Z" fill="#f1ebdf"/><circle cx="${T0}" cy="${r(110.2 - 5.4)}" r=".5" fill="#f1ebdf"/>`;
  todaro += `<line x1="${r(T0 + 1)}" y1="${r(110.2 - 0.6)}" x2="${r(T0 + 1.2)}" y2="${r(110.2 - 7.4)}" stroke="#c9bfa9" stroke-width=".22"/><path d="M${q0(1, -7.4)} l.2 -.7 l.2 .7 Z" fill="#c9bfa9"/>`;
  todaro += `<ellipse cx="${r(T0 - 0.9)}" cy="${r(110.2 - 3.2)}" rx=".6" ry="1.1" fill="#e3dccd" stroke="#c9bfa9" stroke-width=".12"/>`;
  /* San Marco: der geflügelte Bronzelöwe nach Osten, wie am Campanile: Mähne,
     zwei gestaffelte Schwingen, die Vorderpfote auf dem Buch */
  const L0 = 124, q1 = (dx, dy) => `${r(L0 + dx)} ${r(110.2 + dy)}`;
  const BR = S.lg("bronzel", [[0, "#5d6a58"], [0.5, "#3a4438"], [1, "#22281f"]]);
  let loewe = `<path d="M${q1(-1.2, -2.6)} Q${q1(-2.8, -5.4)} ${q1(-1.6, -7.8)} Q${q1(-1.2, -5.8)} ${q1(0.2, -3.2)} Z" fill="#2c3429"/>`;
  loewe += `<path d="M${q1(-2.4, 0)} L${q1(-2.3, -1.6)} Q${q1(-2.4, -2.8)} ${q1(-1, -2.9)} L${q1(1.4, -2.9)} Q${q1(2.2, -2.8)} ${q1(2.3, -1.9)} L${q1(2.2, 0)} L${q1(1.6, 0)} L${q1(1.6, -1.2)} L${q1(-1.2, -1.2)} L${q1(-1.5, 0)} Z" fill="${BR}"/>`;
  loewe += `<path d="M${q1(2.2, -1.9)} L${q1(3.4, -1.7)} L${q1(3.5, -1.2)} L${q1(2.3, -1.2)} Z" fill="${BR}"/><rect x="${r(L0 + 2.6)}" y="${r(110.2 - 1.2)}" width="1.5" height="1.1" fill="#ece2c8" stroke="#8a7c5c" stroke-width=".1"/>`;
  loewe += `<path d="M${q1(1.2, -2.9)} L${q1(1.6, -4.2)} L${q1(2.2, -4.6)} L${q1(2.8, -4.4)} L${q1(3.4, -4)} L${q1(3.2, -3.4)} L${q1(3.6, -3)} L${q1(2.8, -2.6)} L${q1(2.4, -2.2)} Z" fill="#2e382b"/>`;
  loewe += `<path d="M${q1(2.8, -4.2)} Q${q1(3.6, -4)} ${q1(3.9, -3.4)} L${q1(3.2, -3.1)} Z" fill="${BR}"/><circle cx="${r(L0 + 3.2)}" cy="${r(110.2 - 3.8)}" r=".15" fill="#c4a35a"/>`;
  loewe += `<path d="M${q1(-0.4, -2.8)} Q${q1(-1.8, -5.8)} ${q1(-0.4, -8.4)} Q${q1(0.2, -6)} ${q1(1.2, -3)} Z" fill="${BR}"/><path d="M${q1(-0.2, -3.6)} L${q1(-0.6, -7)} M${q1(0.4, -3.4)} L${q1(-0.1, -6.6)}" stroke="#7d8a6a" stroke-width=".15"/>`;
  loewe += `<path d="M${q1(-2.4, -1.8)} q-1 -.4 -1 -1.6" stroke="${BR}" stroke-width=".3" fill="none"/><circle cx="${r(L0 - 0.9)}" cy="${r(110.2 - 5.8)}" r="0" fill="none"/>`;
  k += saeule(86, S.lg("rosagranit", [[0, "#c89a8e"], [0.5, "#b7867a"], [1, "#94675c"]], 0, 0, 1, 0), todaro);
  k += saeule(124, S.lg("graugranit", [[0, "#a3a6aa"], [0.5, "#8c9095"], [1, "#6d7176"]], 0, 0, 1, 0), loewe);
  S.teil({ id: "saeule", de: "die Säule", syl: "SÄU-le", it: "la colonna", itSyl: "co-LON-na", en: "column", x: 0, y: 0, kunst: G(k),
    tipp: "Auf der einen Säule steht der heilige Theodor, auf der anderen der geflügelte Löwe des heiligen Markus.",
    zoom: Z({ x: 78, y: 98, w: 54, h: 36 }),
    unter: [
      { id: "loewe", de: "der Löwe", syl: "LÖ-we", it: "il leone", itSyl: "le-O-ne", en: "lion", x: L0, y: 110.2, kunst: flaeche(-3.6, -8.6, 7.8, 8.8, 0.6),
        tipp: "Der geflügelte Löwe ist das Zeichen von Venedig." },
    ].map(U) });
}

/* =====================================================================
   8 — DIE LAGUNE (Bacino di San Marco) mit Spiegelungen,
       ganz hinten die Gondeln am Molo
   ===================================================================== */
const UFER = 243;   /* Kante des Platzes vor San Giorgio (33 m vor uns) */
const W1 = 133.9;  /* Unterkante des Wasserstreifens am Molo (Molo-Koordinaten) */
{
  /* Wasserstreifen am Molo mit den festgemachten Gondeln und gestreiften Pfählen
     (nicht antippbar: die Gondeln dort sind nur Kulisse) */
  let g = `<rect x="-20" y="${r(WASSER0 - 0.4)}" width="440" height="${r(W1 - WASSER0 + 0.6)}" fill="#a3bfbb"/>`;
  for (let i = 0; i < 16; i++) {
    const x = 136 + i * 5.6;
    g += `<path d="M${r(x - 2.2)} ${r(WASSER0 + 0.9)} q2.2 .8 4.4 0 l.3 -.5 q-2.5 .6 -5 0 Z" fill="#141416"/><rect x="${r(x - 1)}" y="${r(WASSER0 + 0.2)}" width="2" height=".45" fill="#2f4f8a"/>`;
    if (i % 2 === 0) g += `<rect x="${r(x + 2.8)}" y="${r(WASSER0 - 2.2)}" width=".4" height="3.4" fill="#f1f1ee"/><rect x="${r(x + 2.8)}" y="${r(WASSER0 - 1.8)}" width=".4" height=".5" fill="#2f4f8a"/><rect x="${r(x + 2.8)}" y="${r(WASSER0 - 0.8)}" width=".4" height=".5" fill="#2f4f8a"/>`;
  }
  S.hinten(G(g));
}
{
  const Y1 = Y(W1);
  let k = `<rect x="0" y="${Y1}" width="400" height="${r(UFER - Y1 - 0.4)}" fill="${S.lg("wasser", [[0, "#9fbdb9"], [0.1, "#7fa9a6"], [0.5, "#4d8784"], [1, "#2b6466"]])}"/>`;
  /* Spiegelungen: zuerst die Arkaden (dunkel), darunter Loggia und rosa Wand;
     der Campanile steht weiter hinten und spiegelt sich schwächer */
  let sp = `<g filter="url(#${S.id("spiegel")})">`;
  sp += `<rect x="132" y="${W1}" width="96" height="3.4" fill="#4d4448" opacity=".55"/><rect x="132" y="${W1 + 3.4}" width="96" height="3" fill="#efe2d4" opacity=".6"/><rect x="132" y="${W1 + 6.4}" width="96" height="6.4" fill="#e8b6a2" opacity=".7"/>`;
  sp += `<rect x="90" y="${W1}" width="14" height="9" fill="#b4644c" opacity=".32"/>`;
  sp += `<rect x="16" y="${W1}" width="76" height="7.4" fill="#e3d8c6" opacity=".55"/><rect x="26" y="${W1}" width="66" height="2.6" fill="#5a4b43" opacity=".35"/>`;
  sp += `<rect x="243" y="${W1}" width="54" height="7.4" fill="#d8ccb8" opacity=".55"/><rect x="243" y="${W1}" width="54" height="2.4" fill="#4e4440" opacity=".35"/><rect x="297" y="${W1}" width="24" height="8" fill="#c56d5d" opacity=".55"/>`;
  sp += `</g>`;
  k += G(sp);
  /* Spiegelstreifen zerschneiden die Bilder */
  for (let y = Y1 + 1.2; y < Y1 + 34; y += 1.2 + (y - Y1) * 0.07) k += `<rect x="0" y="${r(y)}" width="400" height="${r(0.3 + (y - Y1) * 0.025)}" fill="#6f9e9b" opacity=".55"/>`;
  /* breiter Glitzerpfad der tiefen Sonne links, nach vorn weiter */
  for (let i = 0; i < 140; i++) {
    const t = Math.pow(rnd(), 1.2), y = Y1 + 2 + t * (UFER - Y1 - 4), breite = 30 + t * 110, x = Math.max(0, 6 + (rnd() - 0.5) * breite + t * 20), w = 0.8 + t * 6 * (0.5 + rnd());
    k += `<path d="M${r(x)} ${r(y)} q${r(w / 2)} ${r(-0.3 - t * 0.8)} ${r(w)} 0" stroke="${rnd() < 0.7 ? "#fff1c8" : "#ffd98c"}" stroke-width="${r(0.18 + t * 0.55)}" fill="none" opacity="${r(0.45 + rnd() * 0.45)}"/>`;
  }
  /* kleine Wellen, vorn größer */
  for (let i = 0; i < 170; i++) {
    const t = Math.pow(rnd(), 1.4), y = Y1 + 3 + t * (UFER - Y1 - 5), w = 0.8 + t * 7 * (0.5 + rnd());
    const x = rnd() * (400 - w);
    k += `<path d="M${r(x)} ${r(y)} q${r(w / 2)} ${r(-0.3 - t)} ${r(w)} 0" stroke="${rnd() < 0.5 ? "#c8e0dc" : "#1f4f52"}" stroke-width="${r(0.15 + t * 0.5)}" fill="none" opacity="${r(0.35 + rnd() * 0.4)}"/>`;
  }
  S.teil({ id: "lagune", de: "die Lagune", syl: "la-GU-ne", it: "la laguna", itSyl: "la-GU-na", en: "lagoon", x: 0, y: 0, kunst: k,
    tipp: "Venedig steht auf über 100 kleinen Inseln mitten in der Lagune." });
}

/* =====================================================================
   9 — DAS VAPORETTO (Wasserbus, Linie 2) in 180 m, fährt nach links
   ===================================================================== */
{
  const VX = 284, VY = wl(180), VS = r(F / 180 / 3.9);   /* gezeichnet mit 3,9 je Meter */
  let k = "";
  /* Bugwelle, Kielwasser */
  k += `<path d="M-2 .4 q-4 -.2 -7 .8 M-1 .9 q-3 .4 -5 1.4" stroke="#f4f8f6" stroke-width=".55" fill="none" opacity=".85"/>`;
  k += `<path d="M90 .2 q6 .3 12 1.6 M88 1 q8 .8 14 2.6" stroke="#e8f2ef" stroke-width=".6" fill="none" opacity=".7"/>`;
  k += `<ellipse cx="46" cy=".4" rx="47" ry="1.3" fill="#1d4446" opacity=".35"/>`;
  /* Rumpf mit schwarzer Scheuerleiste */
  k += `<path d="M0 -4.6 L91.6 -4.6 L91.6 -.8 Q91 .3 89 .3 L4.4 .3 Q1.2 0 0 -4.6 Z" fill="${S.lg("vrumpf", [[0, "#f6f6f2"], [1, "#c9cdcc"]])}"/>`;
  k += `<rect x="-.4" y="-5.2" width="92.4" height="1.5" rx=".7" fill="#232528"/>`;
  /* vorderes Deck mit Reling */
  k += `<path d="M1.6 -5.2 L1.6 -7.4 L12 -7.4" stroke="#9aa1a4" stroke-width=".3" fill="none"/>`;
  /* Kabinen: vorn und hinten, dazwischen der offene Einstieg */
  const kabine = (a, b) => `<rect x="${a}" y="-13.4" width="${b - a}" height="8.2" fill="${S.lg("vkab", [[0, "#ffffff"], [1, "#dfe3e2"]])}"/><rect x="${a + 1}" y="-11.8" width="${b - a - 2}" height="4.4" fill="${S.lg("vglas", [[0, "#2d3d46"], [1, "#4f6670"]])}"/>` +
    Array.from({ length: Math.floor((b - a - 2) / 3.6) }, (_, i) => `<line x1="${r(a + 1 + (i + 1) * 3.6)}" y1="-11.8" x2="${r(a + 1 + (i + 1) * 3.6)}" y2="-7.4" stroke="#e9eceb" stroke-width=".4"/>`).join("");
  k += kabine(12, 40) + kabine(54, 84);
  k += `<rect x="40" y="-13.4" width="14" height="1" fill="#e9eceb"/>`;
  for (const x of [41, 53]) k += `<rect x="${x}" y="-12.6" width=".7" height="7.4" fill="#bfc5c6"/>`;
  /* zwei Fahrgäste im Einstieg */
  k += `<rect x="44.4" y="-10.8" width="1.6" height="5.6" rx=".6" fill="#b33a3a"/><circle cx="45.2" cy="-11.6" r=".8" fill="#e0b89a"/>`;
  k += `<rect x="48.6" y="-10.4" width="1.6" height="5.2" rx=".6" fill="#2f4f7a"/><circle cx="49.4" cy="-11.2" r=".8" fill="#c99a7a"/>`;
  /* Dach und Steuerhaus mit der Liniennummer */
  k += `<rect x="10" y="-14.2" width="76" height="1" rx=".4" fill="#d2d6d5"/>`;
  k += `<path d="M32 -14.2 L33 -18.4 L46 -18.4 L47 -14.2 Z" fill="#fbfbf8"/><rect x="34" y="-17.6" width="11" height="2.2" fill="#2d3d46"/>`;
  k += `<rect x="36.6" y="-21" width="5.6" height="2.6" rx=".3" fill="#f2c230"/><text x="39.4" y="-18.9" font-size="2.3" text-anchor="middle" fill="#1d1d1d" font-family="Arial,sans-serif" font-weight="bold">2</text>`;
  /* am Heck die Fahne Venedigs: roter Grund, goldener Markuslöwe, sechs Zipfel (die Sestieri) */
  k += `<line x1="89.4" y1="-5.2" x2="89.4" y2="-19.4" stroke="#8d9296" stroke-width=".35"/>`;
  k += `<path d="M89.6 -19.2 L95.6 -19 L95.4 -16.4 L96.4 -15.8 L95.2 -15.6 L95.8 -15 L94.6 -14.9 L95 -14.3 L93.8 -14.3 L94 -13.7 L92.8 -13.9 L92.6 -13.3 L91.6 -13.6 L91.2 -13.1 L90.4 -13.6 L89.6 -13.4 Z" fill="${S.lg("fahne", [[0, "#c8202a"], [1, "#9a1520"]])}"/>`;
  k += `<path d="M90.6 -15 l.3 -1.2 q.6 -.5 1.8 -.4 q.4 -.9 .9 -.4 l-.2 .8 l.4 1.2 l-.5 0 l-.3 -.7 l-1.3 .1 l-.3 .6 Z M91.8 -16.4 q-.2 -1.2 .8 -1.6 q0 .9 .3 1.3 Z" fill="#f2c94c"/>`;
  /* Rettungsring */
  k += `<circle cx="88" cy="-9.4" r="1.4" fill="none" stroke="#e8642a" stroke-width=".8"/>`;
  k += `<path d="M12 -13 L20 -13 L12 -8 Z" fill="#fff" opacity=".18"/>`;
  S.teil({ id: "vaporetto", de: "das Vaporetto", syl: "va-po-RET-to", it: "il vaporetto", itSyl: "va-po-RET-to", en: "water bus", x: VX, y: VY, kunst: `<g transform="scale(${VS})">${k}</g>`,
    tipp: "Das Vaporetto ist der Bus von Venedig – es fährt auf dem Wasser. Autos gibt es in Venedig nicht." });
}

/* =====================================================================
   10 — DIE GONDEL (in 60 m, Bug nach rechts: wir sehen die Steuerbordseite
        mit Forcola und Ruder) — Lupe: Bugeisen, Ruder
   11 — DER GONDOLIERE (Ringelhemd, Strohhut) — Lupe: Strohhut
   ===================================================================== */
const GX = 160, GY = wl(60), GS = r(F / 60 / 8.36);   /* Mitte der Gondel auf der Wasserlinie; gezeichnet mit 8,36 je Meter */
const GOND = { fussX: r(GX - 37.6 * GS), fussY: r(GY - 6.6 * GS) };   /* er steht auf dem erhöhten Heckdeck */
const gondoliere = B.mensch({ id: "ven_gond", geschlecht: "m", blick: 88, frisur: "kurz", haarfarbe: "dunkelbraun", haut: "hell",
  pose: { kipp: 6, lende: 3, brust: 2, nacken: 6, kopf: -8, schulterL: { vor: 30, seit: 10, dreh: -10 }, ellbogenL: 75, unterarmL: 30, handL: 0, fingerL: 0.75,
    schulterR: { vor: 18, seit: 16, dreh: -10 }, ellbogenR: 95, unterarmR: 30, handR: 0, fingerR: 0.75,
    huefteL: { vor: 16, seit: 3, dreh: -6 }, knieL: 12, fussL: 4, huefteR: { vor: -10, seit: 4, dreh: -6 }, knieR: 4, fussR: 0 },
  kleidung: { oberteil: { stueck: "tshirt", farbe: "#fdfdfb" }, unterteil: { stueck: "anzughose" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" }, kopf: { stueck: "hut", farbe: "#e3c97e" } } }, r(1.8 * F / 60));
const haende = [gondoliere.z.handL, gondoliere.z.handR].map((h) => ({ x: (GOND.fussX + h.x * gondoliere.k - GX) / GS, y: (GOND.fussY + h.y * gondoliere.k - GY) / GS })).sort((a, b) => a.x - b.x);
{
  let k = "";
  /* Spiegelbild, Kielwasser nach hinten (links), Bugwelle */
  k += `<g filter="url(#${S.id("spiegel")})" opacity=".55"><path d="M-38 .3 Q0 1.8 38 .3 L45 5 Q0 7.4 -46 5 Z" fill="#0f2a2c"/></g>`;
  k += `<path d="M44 1 q6 .4 9 1.6 M40 1.8 q4 .8 7 2.2 M-44 1.2 q-10 .6 -22 3 M-40 2.2 q-8 1 -16 3.4" stroke="#e6f1ee" stroke-width=".45" fill="none" opacity=".7"/>`;
  /* hintere Bordwand (wir schauen leicht von oben hinein) */
  k += `<path d="M-43 -9.4 Q-34 -5.6 -18 -4.6 Q0 -4.2 18 -4.6 Q34 -5.6 42 -8.6" stroke="#1a1a1d" stroke-width=".8" fill="none"/>`;
  /* Sitzbank mit rotem Polster, geschnitzte Lehne (carega) */
  k += `<path d="M-14 -4.4 L-14 -6.9 L-3 -6.9 L-3 -4.4 Z M8 -4.4 L8 -6.4 Q9.6 -7.2 11.2 -6.4 L11.2 -4.4 Z" fill="${S.lg("polster", [[0, "#b8323f"], [1, "#7a1a26"]])}"/>`;
  k += `<path d="M-15.4 -4.4 L-15.4 -9.6 Q-14.6 -10.8 -13.4 -10 L-13.4 -4.4 Z" fill="#1d1a1a" stroke="#d9a92e" stroke-width=".3"/>`;
  k += `<path d="M-13.6 -6.7 L-3.4 -6.7" stroke="#d9a92e" stroke-width=".25"/>`;
  /* Rumpf: schwarz lackiert, bananenförmig — Bug und Heck steigen hoch aus dem Wasser */
  k += `<path d="M-45.8 -11.8 Q-41 -7.4 -34 -5.4 Q-20 -3.9 0 -3.6 Q20 -3.9 33 -5.4 Q40 -7.2 45.2 -11 L45.6 -10.2 Q44.6 -5.6 37 -0.6 Q36 0 34 0 L-34 0 Q-36 0 -37.4 -0.8 Q-44.2 -5.8 -45.8 -11.8 Z" fill="${S.lg("lack", [[0, "#3a3a40"], [0.35, "#121214"], [1, "#050506"]])}"/>`;
  k += `<path d="M-43 -9.2 Q-34 -5 0 -4.3 Q33 -5 42 -8.6" stroke="#8e9096" stroke-width=".35" fill="none" opacity=".75"/>`;
  k += `<path d="M-30 -1.6 Q0 -2.1 30 -1.8" stroke="#2b2b31" stroke-width=".3" fill="none"/>`;
  /* Heckdeck: kleine Plattform, auf der der Gondoliere steht; vorn das gedeckte Bugdeck */
  k += `<path d="M-41.4 -7.6 L-33.6 -6.2 L-33.6 -5.6 L-41 -6.9 Z" fill="#3c3a3a" stroke="#6b6866" stroke-width=".15"/>`;
  k += `<path d="M30 -5.3 Q36 -6.2 41 -8.4" stroke="#55555c" stroke-width=".5" fill="none"/>`;
  /* das kleine Eisen am Heck (risso) */
  k += `<path d="M-45.8 -11.8 q-.9 -1 -1.6 -.4 q-.4 .6 .4 .8" stroke="#c9ced3" stroke-width=".45" fill="none"/>`;
  /* zwei goldene Seepferdchen (cavalli) seitlich am Sitzplatz */
  for (const cx of [-16.4, 6.4]) {
    const c = (dx, dy) => `${r(cx + dx)} ${r(dy)}`;
    k += `<path d="M${c(0, -4.2)} Q${c(-0.9, -5.4)} ${c(-0.2, -6.4)} Q${c(0.6, -7.2)} ${c(0.2, -8)} L${c(1.2, -8.2)} L${c(1.6, -7.8)} L${c(0.9, -7.6)} Q${c(1.3, -6.8)} ${c(0.7, -5.9)} Q${c(0.2, -5.1)} ${c(1, -4.6)} Q${c(1.2, -3.9)} ${c(0.4, -3.8)} Z" fill="${GOLD}" stroke="#8a5a10" stroke-width=".1"/>`;
  }
  /* Ferro am Bug (rechts): S-Schwung, großer gebogener Kamm, sechs Zinken nach vorn,
     einer nach hinten zu den Fahrgästen */
  const FE = { x: 45.2, y: -11 };
  const fp = (dx, dy) => `${r(FE.x - dx)} ${r(FE.y + dy)}`;
  let ferro = `<path d="M${fp(0.5, 0.2)} C${fp(1.4, -1.4)} ${fp(0.2, -2.6)} ${fp(0.9, -3.6)} C${fp(1.6, -4.6)} ${fp(1.2, -5.4)} ${fp(0.4, -5.8)} Q${fp(-1.6, -6.6)} ${fp(-3.6, -5.4)} L${fp(-3.2, -5)} Q${fp(-1.8, -5.6)} ${fp(-1, -4.9)} L${fp(-1.2, -4.4)} L${fp(-1.2, -.6)} Q${fp(-.8, .2)} ${fp(.5, .2)} Z" fill="${S.lg("ferro", [[0, "#8b939a"], [0.5, "#c3c9ce"], [1, "#f7f8f8"]], 0, 0, 1, 0)}" stroke="#5f676e" stroke-width=".12"/>`;
  for (let i = 0; i < 6; i++) ferro += `<path d="M${fp(-1.1, -0.7 - i * 0.62)} L${fp(-2.5, -0.8 - i * 0.62)} L${fp(-2.5, -1.06 - i * 0.62)} L${fp(-1.1, -1.08 - i * 0.62)} Z" fill="#dde2e6" stroke="#6e767d" stroke-width=".08"/>`;
  ferro += `<path d="M${fp(0.9, -2.6)} L${fp(1.9, -2.7)} L${fp(1.9, -2.95)} L${fp(0.8, -2.95)} Z" fill="#dde2e6" stroke="#6e767d" stroke-width=".08"/>`;
  ferro += `<path d="M${fp(-0.2, -5.6)} Q${fp(-1.8, -6.2)} ${fp(-3.2, -5.3)}" stroke="#fff" stroke-width=".25" opacity=".8" fill="none"/>`;
  k += ferro;
  /* Forcola (Ruderdolle aus Nussholz) auf unserer Seite, davor das Ruder:
     vom Griff über die Forcola schräg nach vorn ins Wasser, das Blatt taucht ein */
  const fx = -25.6;
  k += `<path d="M${fx - 0.8} -4.2 L${fx - 1} -8.4 Q${fx - 1.6} -9.2 ${fx - 0.8} -9.9 L${fx} -9.3 L${fx + 0.4} -10.3 Q${fx + 1.3} -9.9 ${fx + 0.9} -8.9 L${fx + 0.8} -4.2 Z" fill="${S.lg("nuss", [[0, "#9a6a3e"], [1, "#5a381d"]])}" stroke="#3b2414" stroke-width=".12"/>`;
  const [h0, h1] = haende, ruder = S.lg("ruder", [[0, "#e8cf9a"], [1, "#b48c52"]]);
  const steig = ((-9.4) - h0.y) / (fx - h0.x);
  const blattX = fx + (1.2 - (-9.4)) / steig;
  if (process.env.DBG) console.error({ h0, h1, blattX, steig, GS, GX, GY });
  k += `<path d="M${r(h0.x - 1.6)} ${r(h0.y - 1.6 * steig)} L${r(blattX)} 1.2" stroke="${ruder}" stroke-width=".62" stroke-linecap="round"/>`;
  k += `<path d="M${r(blattX - 3.4)} ${r(1.2 - 3.4 * steig - 0.5)} L${r(blattX + 0.6)} ${r(1.2 + 0.6 * steig - 0.5)} L${r(blattX + 0.6)} ${r(1.2 + 0.6 * steig + 0.7)} L${r(blattX - 3.4)} ${r(1.2 - 3.4 * steig + 0.3)} Z" fill="${ruder}"/>`;
  k += `<rect x="${r(blattX - 4)}" y=".05" width="5.4" height="2.4" fill="#2f6a6c" opacity=".55"/>`;
  k += `<ellipse cx="${r(blattX - 1.2)}" cy=".2" rx="3.2" ry=".7" fill="none" stroke="#e9f4f1" stroke-width=".3" opacity=".9"/><ellipse cx="${r(blattX - 1.2)}" cy=".25" rx="5.4" ry="1.2" fill="none" stroke="#d3e8e3" stroke-width=".25" opacity=".6"/>`;
  S.teil({ id: "gondel", de: "die Gondel", syl: "GON-del", it: "la gondola", itSyl: "GON-do-la", en: "gondola", x: GX, y: GY, kunst: `<g transform="scale(${GS})">${k}</g>`,
    tipp: "Eine Gondel ist fast 11 Meter lang und immer schwarz. Sie ist schief gebaut – so fährt sie geradeaus, obwohl nur auf einer Seite gerudert wird.",
    zoom: { x: GX - 76, y: GY - 44, w: 152, h: 54 },
    unter: [
      { id: "bugeisen", de: "das Bugeisen", syl: "BUG-ei-sen", it: "il ferro di prua", itSyl: "FER-ro di PRU-a", en: "prow iron", x: r(GX + FE.x * GS), y: r(GY + FE.y * GS), kunst: `<g transform="scale(${GS})">${flaeche(-2.6, -7.4, 6.6, 8, 0.6)}</g>`,
        tipp: "Die Gondolieri nennen es „Ferro“. Seine sechs Zacken stehen für die sechs Stadtteile von Venedig." },
      { id: "ruder", de: "das Ruder", syl: "RU-der", it: "il remo", itSyl: "RE-mo", en: "oar", x: r(GX + fx * GS), y: r(GY - 4.2 * GS), kunst: `<g transform="scale(${GS})">${flaeche(-2.4, -6.6, r(blattX - fx + 4), 9.4, 0.6)}</g>`,
        tipp: "Der Gondoliere rudert mit nur einem Ruder. Es liegt in der Forcola, einer Gabel aus Nussholz." },
    ] });
}
{
  /* Ringelhemd: jede Fläche in Hemdfarbe bekommt eine Kopie mit dem Streifenmuster */
  let svg = gondoliere.svg.replace(/stroke="#2a211c"/g, `stroke="#b3242c"`);
  const ids = new Set();
  for (const m of svg.matchAll(/<linearGradient id="([^"]+)"[^>]*>(.*?)<\/linearGradient>/g)) if (m[2].includes("#fdfdfb")) ids.add(m[1]);
  svg = svg.replace(/<path [^>]*fill="(url\(#([^)]+)\)|#fdfdfb)"[^>]*\/>/g, (p, a, b) => (a === "#fdfdfb" || ids.has(b)) ? p + p.replace(/fill="[^"]+"/, `fill="url(#${S.id("ringel")})"`).replace(/stroke="[^"]+"/, `stroke="none"`) : p);
  const kopf = { x: gondoliere.z.kopf.x * gondoliere.k, y: gondoliere.z.kopf.y * gondoliere.k };
  S.teil({ id: "gondoliere", de: "der Gondoliere", syl: "gon-do-LIE-re", it: "il gondoliere", itSyl: "gon-do-LIE-re", en: "gondolier", x: GOND.fussX, y: GOND.fussY, kunst: kompakt(svg),
    tipp: "Der Gondoliere rudert im Stehen. Er trägt ein gestreiftes Hemd und einen Strohhut mit Band.",
    zoom: { x: GOND.fussX - 18, y: GOND.fussY - 26, w: 36, h: 24 },
    unter: [
      { id: "strohhut", de: "der Strohhut", syl: "STROH-hut", it: "il cappello di paglia", itSyl: "cap-PEL-lo di PA-glia", en: "straw hat", x: r(GOND.fussX + kopf.x), y: r(GOND.fussY + kopf.y - 0.4),
        kunst: flaeche(-1.8, -2, 3.6, 2.2, 0.4), tipp: "Im Sommer trägt der Gondoliere einen Strohhut mit farbigem Band." },
    ] });
}

/* =====================================================================
   12 — DER PFAHL (Briccola: drei Eichenpfähle mit Eisenbändern) in 48 m
   13 — DIE MÖWE obendrauf
   ===================================================================== */
const PF = { x: 42, y: wl(48), s: r(F / 48 / 19.5) };   /* gezeichnet mit 19,5 je Meter */
{
  let k = `<g filter="url(#${S.id("spiegel")})" opacity=".6"><path d="M-9 1 L9 1 L7 17 L-7 17 Z" fill="#2a2620"/></g>`;
  for (let i = 0; i < 6; i++) k += `<path d="M${-9 + i * 0.6} ${r(2 + i * 2.6)} q4.5 -.8 9 0 q4.5 .8 9 0" stroke="#1d3c3e" stroke-width=".5" fill="none" opacity=".5"/>`;
  const pfahl = (dx, top, neig) => {
    let g = `<path d="M${dx - 3} 0 L${r(dx - 2.8 + neig)} ${top + 1} Q${r(dx + neig)} ${top - 1.4} ${r(dx + 2.8 + neig)} ${top + 1} L${dx + 3} 0 Z" fill="${S.lg("eiche", [[0, "#8a7a64"], [0.4, "#a9977b"], [1, "#5e5244"]], 0, 0, 1, 0)}"/>`;
    for (let j = 0; j < 4; j++) g += `<path d="M${r(dx - 1.6 + j * 1.1 + neig * 0.3)} ${r(top + 3)} L${r(dx - 1.8 + j * 1.2)} -1" stroke="#5a4c3c" stroke-width=".22" opacity=".7"/>`;
    g += `<path d="M${dx - 3} 0 L${r(dx - 2.95 + neig * 0.1)} -9 L${r(dx + 2.95 + neig * 0.1)} -9 L${dx + 3} 0 Z" fill="${S.lg("algen", [[0, "#3b4a2c", 0.1], [0.5, "#2f3d24", 0.75], [1, "#1f2a1c", 0.95]])}"/>`;
    return g;
  };
  k += pfahl(-5.6, -72, 1.6) + pfahl(5.6, -70, -1.6) + pfahl(0, -78, 0);
  for (const y of [-52, -30]) k += `<path d="M-8.8 ${y} Q0 ${y + 1.6} 8.8 ${y} L8.8 ${y + 2.4} Q0 ${y + 4} -8.8 ${y + 2.4} Z" fill="${S.lg("eisen", [[0, "#3a3a3c"], [0.5, "#5c5a58"], [1, "#2a2a2c"]])}"/>`;
  k += `<path d="M-1.8 -74 L-1.4 -24" stroke="#f0e2c4" stroke-width=".6" opacity=".35"/>`;
  S.teil({ id: "pfahl", de: "der Pfahl", syl: "PFAHL", it: "il palo", itSyl: "PA-lo", en: "wooden pile", x: PF.x, y: PF.y, kunst: `<g transform="scale(${PF.s})">${k}</g>`,
    tipp: "Drei Pfähle zusammen heißen in Venedig „Briccola“. Sie zeigen den Booten den Weg." });
}
{
  /* Mittelmeermöwe: weiß, graue Flügel mit schwarzen Spitzen, gelber Schnabel mit rotem Fleck */
  let k = `<path d="M-.6 0 l-.3 -2 M.8 0 l.2 -2" stroke="#e8b33a" stroke-width=".45"/>`;
  k += `<path d="M-5.6 -4.4 Q-4 -6.8 0 -6.6 Q3.6 -6.8 4.8 -5.4 Q4 -2.4 0 -2 Q-3.6 -2 -5.6 -4.4 Z" fill="${S.lg("moewe", [[0, "#ffffff"], [1, "#d9dde0"]])}"/>`;
  k += `<path d="M-2.6 -5.8 Q1.6 -7 6.4 -4.6 Q2.6 -4 -2.6 -3.6 Z" fill="${S.lg("moewefl", [[0, "#a9b1b8"], [1, "#7c868e"]])}"/><path d="M4.6 -5 L7.6 -4.2 L5 -3.8 Z" fill="#1d1f22"/>`;
  k += `<circle cx="-4.2" cy="-7.4" r="1.9" fill="#fff"/><path d="M-5.8 -7.6 L-8 -7 L-5.8 -6.8 Z" fill="#f0c43a"/><circle cx="-7" cy="-7.1" r=".25" fill="#d0342c"/><circle cx="-4.8" cy="-7.8" r=".3" fill="#1d1d1d"/>`;
  S.teil({ oben: true, id: "moewe", de: "die Möwe", syl: "MÖ-we", it: "il gabbiano", itSyl: "gab-BIA-no", en: "seagull", x: r(PF.x + 0.4 * PF.s), y: r(PF.y - 78.4 * PF.s), kunst: `<g transform="scale(${PF.s})">${k}</g>`,
    tipp: "Die Möwen in Venedig sind frech: Sie stehlen sogar Brötchen aus der Hand." });
}

/* =====================================================================
   DAS UFER von San Giorgio (Kulisse: Istrischer Stein, Trachytplatten)
   ===================================================================== */
{
  let k = `<rect x="0" y="${UFER}" width="400" height="${260 - UFER}" fill="${S.lg("masegni", [[0, "#8c8a86"], [1, "#6c6a66"]])}"/>`;
  for (const y of [248.6, 254.8]) k += `<line x1="0" y1="${y}" x2="400" y2="${y}" stroke="#55534f" stroke-width=".35"/>`;
  for (let i = -12; i <= 12; i++) k += `<line x1="${r(200 + i * 13)}" y1="${UFER + 3}" x2="${r(200 + i * 15.6)}" y2="260" stroke="#55534f" stroke-width=".3"/>`;
  for (let i = 0; i < 60; i++) k += `<rect x="${r(rnd() * 400)}" y="${r(UFER + 3.4 + rnd() * 15)}" width="${r(1 + rnd() * 3)}" height=".35" fill="#9a9792" opacity=".5"/>`;
  k += `<rect x="0" y="${UFER - 0.6}" width="400" height="3.6" fill="${S.lg("kante", [[0, "#fbf7ee"], [1, "#d8cfbf"]])}"/>`;
  k += `<rect x="0" y="${UFER + 2.8}" width="400" height=".6" fill="#4b4945" opacity=".6"/>`;
  k += `<rect x="0" y="${UFER}" width="400" height="${260 - UFER}" fill="${S.lg("uferlicht", [[0, "#ffe2b0", 0.18], [0.6, "#ffe2b0", 0], [1, "#000", 0.08]], 0, 0, 1, 0)}"/>`;
  S.hinten(k);   /* das Ufer ist Kulisse: davor liegt nichts, die Lagune endet an der Kante */
}

/* =====================================================================
   14b — DIE HALTESTELLE: Ponton der Vaporetto-Linie 2 „San Giorgio“ (in 46 m)
   ===================================================================== */
{
  const d = 46, sc = F / d, Y = wl(d), X0 = 316;
  const m = (v) => r(v * sc);
  const L = 400 - X0;
  let k = `<g filter="url(#${S.id("spiegel")})" opacity=".5"><rect x="0" y="0" width="${L}" height="6" fill="#1d3436"/></g>`;
  /* Schwimmkörper und Deck */
  k += `<path d="M0 ${m(-0.75)} L${L} ${m(-0.75)} L${L} .4 L1.4 .4 Q0 .2 0 ${m(-0.4)} Z" fill="${S.lg("ponton", [[0, "#5a666c"], [1, "#2f3a3f"]])}"/>`;
  k += `<rect x="0" y="${m(-0.8)}" width="${L}" height="1" fill="#e9ecec"/>`;
  for (const x of [6, 46, 86]) if (x < L - 4) k += `<circle cx="${x}" cy="${m(-0.38)}" r="2" fill="none" stroke="#e8642a" stroke-width="1.1"/>`;
  /* Steg zum Ufer (nach vorn links, mit Geländer) */
  k += `<path d="M-2 ${m(-0.8)} L10 ${m(-0.8)} L-6 ${r(UFER - Y)} L-26 ${r(UFER - Y)} Z" fill="#8e8a84"/><path d="M-2 ${r(m(-0.8) - 6)} L-26 ${r(UFER - Y - 9)} M10 ${r(m(-0.8) - 6)} L-6 ${r(UFER - Y - 9)}" stroke="#4b5357" stroke-width=".6"/>`;
  /* Wartehäuschen: Pfosten, Glas, Dach, gelbes Schild */
  const dach = m(-3.1);
  k += `<rect x="4" y="${dach}" width="${L - 4}" height="${r(m(-0.8) - dach)}" fill="${S.lg("glasbox", [[0, "#cfe3e8", 0.5], [1, "#a9c4cc", 0.35]])}"/>`;
  for (let x = 4; x < L; x += 22) k += `<rect x="${x}" y="${dach}" width="1.4" height="${r(m(-0.8) - dach)}" fill="#7d878c"/>`;
  k += `<path d="M2 ${r(dach + 0.4)} L${L} ${r(dach + 0.4)} L${L} ${r(dach - 2.4)} L0 ${r(dach - 2.4)} Z" fill="#eef0ef"/>`;
  k += `<rect x="14" y="${r(dach - 9.6)}" width="${L - 14}" height="7" fill="#f2c230"/><rect x="14" y="${r(dach - 9.6)}" width="${L - 14}" height=".8" fill="#1d1d1d"/>`;
  k += `<text x="40" y="${r(dach - 4)}" font-size="4.6" fill="#1d1d1d" font-family="Arial,sans-serif" font-weight="bold">S. GIORGIO</text><circle cx="${L - 9}" cy="${r(dach - 6.1)}" r="2.6" fill="#fff" stroke="#1d1d1d" stroke-width=".3"/><text x="${L - 9}" y="${r(dach - 4.6)}" font-size="4" text-anchor="middle" fill="#1d1d1d" font-family="Arial,sans-serif" font-weight="bold">2</text>`;
  k += `<path d="M6 ${r(dach + 2)} L20 ${r(dach + 2)} L6 ${r(dach + 18)} Z" fill="#fff" opacity=".2"/>`;
  S.teil({ id: "haltestelle", de: "die Haltestelle", syl: "HAL-te-stel-le", it: "la fermata", itSyl: "fer-MA-ta", en: "stop", x: X0, y: Y, kunst: k,
    tipp: "An der schwimmenden Haltestelle San Giorgio hält das Vaporetto der Linie 2." });
}

/* =====================================================================
   14c — DAS KIND mit 14d — DEM EIS (Gelato in der Waffel)
   ===================================================================== */
{
  const x = 250, y = 257.4, sc = 4 * F / (y - HOR) / 4;   /* Boden des Platzes: Auge 4 m darüber */
  const s2 = (y - HOR) / 4;   /* Einheiten je Meter an dieser Stelle */
  const kind = B.mensch({ id: "ven_kind", alter: "kind", geschlecht: "w", blick: -30, frisur: "zopf", haarfarbe: "dunkelbraun", haut: "mittel", laecheln: true,
    pose: { lende: 1, brust: -2, nacken: 8, kopf: 4, schulterL: { vor: 3, seit: 8 }, ellbogenL: 14, unterarmL: 10, handL: 6, fingerL: 0.38,
      schulterR: { vor: 62, seit: 16, dreh: 20 }, ellbogenR: 118, unterarmR: 40, handR: 10, fingerR: 0.7,
      huefteL: { vor: 6, seit: 3, dreh: -6 }, knieL: 4, fussL: 0, huefteR: { vor: -3, seit: 2.5, dreh: -6 }, knieR: 2, fussR: 0 },
    kleidung: { oberteil: { stueck: "tshirt", farbe: "gelb" }, unterteil: { stueck: "shorts", farbe: "jeans" }, schuhe: { stueck: "turnschuh" }, kopf: { stueck: "kappe", farbe: "rot" } } }, r(1.28 * s2));
  const hand = { x: x + kind.z.handR.x * kind.k, y: y + kind.z.handR.y * kind.k };
  S.teil({ id: "kind", de: "das Kind", syl: "KIND", it: "la bambina", itSyl: "bam-BI-na", en: "child", x, y,
    kunst: `<path d="M-3 0 L4 .3 L20 -2 L16 -2.8 Z" fill="#2a1a0c" opacity=".25" filter="url(#bw_weich)"/>` + kompakt(kind.svg),
    tipp: "Das Mädchen isst ein Eis und schaut den Tauben zu." });
  /* Eiswaffel mit Pistazie und Erdbeere (etwas größer gezeichnet, damit man es sieht) */
  let k = `<path d="M-1.6 -3.2 L1.6 -3.2 L0 2.4 Z" fill="${S.lg("waffel", [[0, "#e2b06a"], [1, "#b37c3a"]])}"/><path d="M-1 -2 L.8 -1 M-.6 -.6 L.5 0 M1 -2.2 L-.8 -1.2 M.6 -.8 L-.5 -.2" stroke="#9a6428" stroke-width=".18"/>`;
  k += `<circle cx="-.7" cy="-4" r="1.5" fill="#b9d58a"/><circle cx=".8" cy="-4.4" r="1.45" fill="#f1a3b4"/><circle cx="-.9" cy="-4.6" r=".5" fill="#e0efc4" opacity=".8"/><circle cx=".5" cy="-5" r=".45" fill="#ffd7e0" opacity=".8"/>`;
  S.teil({ oben: true, id: "eis", de: "das Eis", syl: "EIS", it: "il gelato", itSyl: "ge-LA-to", en: "ice cream", x: r(hand.x + 0.4), y: r(hand.y - 1), kunst: k + flaeche(-2.4, -6.4, 4.8, 9, 0.6),
    tipp: "Italienisches Eis heißt „Gelato“. Pistazie und Erdbeere sind beliebte Sorten." });
}

/* =====================================================================
   15 — DIE TAUBEN auf dem Ufer
   ===================================================================== */
{
  const taube = (x, y, s, pick) => {
    let g = schatten(x, y + 0.2, 4.2 * s, 0.8 * s, 0.3);
    g += `<path d="M${r(x - 0.6 * s)} ${r(y)} l${r(-0.3 * s)} ${r(-1.6 * s)} M${r(x + 0.8 * s)} ${r(y)} l${r(0.2 * s)} ${r(-1.6 * s)}" stroke="#d2544a" stroke-width="${r(0.4 * s)}"/>`;
    g += `<path d="M${r(x - 4.4 * s)} ${r(y - 3 * s)} Q${r(x - 2 * s)} ${r(y - 6.2 * s)} ${r(x + 2 * s)} ${r(y - 5 * s)} L${r(x + 5.4 * s)} ${r(y - 4.4 * s)} L${r(x + 5 * s)} ${r(y - 3.4 * s)} Q${r(x + 1 * s)} ${r(y - 1.2 * s)} ${r(x - 4.4 * s)} ${r(y - 3 * s)} Z" fill="${S.lg("taube", [[0, "#a8adb8"], [1, "#6e7480"]])}"/>`;
    g += `<path d="M${r(x - 1 * s)} ${r(y - 4.6 * s)} L${r(x + 2.6 * s)} ${r(y - 4.2 * s)} M${r(x - 0.6 * s)} ${r(y - 3.8 * s)} L${r(x + 2.8 * s)} ${r(y - 3.4 * s)}" stroke="#2f3238" stroke-width="${r(0.35 * s)}"/>`;
    const kx = pick ? x - 5 * s : x - 3.6 * s, ky = pick ? y - 1.4 * s : y - 6.4 * s;
    g += `<path d="M${r(x - 3 * s)} ${r(y - 4.4 * s)} Q${r(kx + 0.6 * s)} ${r(ky + 1.6 * s)} ${r(kx)} ${r(ky)}" stroke="${S.lg("hals", [[0, "#5f8f6e"], [1, "#7d5a8e"]])}" stroke-width="${r(1.8 * s)}" fill="none" stroke-linecap="round"/>`;
    g += `<circle cx="${r(kx)}" cy="${r(ky)}" r="${r(1.15 * s)}" fill="#7d838e"/><circle cx="${r(kx - 0.3 * s)}" cy="${r(ky - 0.25 * s)}" r="${r(0.25 * s)}" fill="#e98a2a"/>`;
    g += `<path d="M${r(kx - 1 * s)} ${r(ky + 0.1 * s)} l${r(-1 * s)} ${r(0.4 * s)} l${r(1 * s)} ${r(0.2 * s)} Z" fill="#3a3a3e"/>`;
    return g;
  };
  const k = taube(282, 252.4, 0.88, true) + taube(299, 249.8, 0.82, false) + taube(316, 256.4, 0.92, false);
  S.teil({ oben: true, id: "taube", de: "die Taube", syl: "TAU-be", it: "il piccione", itSyl: "pic-CIO-ne", en: "pigeon", x: 0, y: 0, kunst: k,
    tipp: "Tauben gibt es in Venedig überall. Auf dem Markusplatz darf man sie nicht füttern." });
}

/* =====================================================================
   16 — DIE TOURISTIN (hält ihre neue Maske hoch) und 17 — DIE MASKE
   ===================================================================== */
const TOUR = { x: 368, y: 255.6 };   /* 29 m vor uns: 26,4 je Meter */
let tourHand = null, tourKopf = null;
{
  const m = B.mensch({ id: "ven_tour", geschlecht: "w", blick: -22, frisur: "lang", haarfarbe: "hellbraun", haut: "hell", laecheln: true,
    pose: { lende: 1, brust: -2, nacken: 4, kopf: -4, schulterL: { vor: 3, seit: 7 }, ellbogenL: 14, unterarmL: 10, handL: 6, fingerL: 0.38,
      schulterR: { vor: 70, seit: 18, dreh: 20 }, ellbogenR: 120, unterarmR: 40, handR: 10, fingerR: 0.62,
      huefteL: { vor: 4, seit: 3, dreh: -6 }, knieL: 3, fussL: 0, huefteR: { vor: -3, seit: 2.5, dreh: -6 }, knieR: 2, fussR: 0 },
    kleidung: { kleid: { stueck: "sommerkleid", farbe: "#2f7f9a" }, schuhe: { stueck: "sandale", farbe: "braun" } } }, 43.6);
  tourHand = { x: TOUR.x + m.z.handR.x * m.k, y: TOUR.y + m.z.handR.y * m.k };
  tourKopf = { x: TOUR.x + m.z.kopf.x * m.k, y: TOUR.y + m.z.kopf.y * m.k };
  S.teil({ id: "touristin", de: "die Touristin", syl: "tou-RIS-tin", it: "la turista", itSyl: "tu-RI-sta", en: "tourist", x: TOUR.x, y: TOUR.y, kunst: `<path d="M-3 0 L4 .3 L22 -2.2 L18 -3 Z" fill="#2a1a0c" opacity=".25" filter="url(#bw_weich)"/>` + kompakt(m.svg),
    tipp: "Die Touristin hält ihre neue Karnevalsmaske hoch." });
}
{
  /* Colombina: goldene Halbmaske mit roten Ornamenten und Federn, am Stab */
  const MS = 0.72, mx = r(tourHand.x - 1), my = r(tourHand.y - 5);
  let k = `<line x1="${r((tourHand.x - mx) / MS)}" y1="${r((tourHand.y - my) / MS + 1.4)}" x2=".6" y2="1.2" stroke="#1d1d1d" stroke-width=".55" stroke-linecap="round"/>`;
  k += `<path d="M-4.4 -.4 Q-4.8 -3.4 -2 -3.2 Q0 -3 0 -2 Q0 -3 2 -3.2 Q4.8 -3.4 4.4 -.4 Q3.6 1.6 1.6 1.4 Q.6 1.2 0 .2 Q-.6 1.2 -1.6 1.4 Q-3.6 1.6 -4.4 -.4 Z" fill="${GOLD}" stroke="#8a5a10" stroke-width=".2"/>`;
  k += `<ellipse cx="-2" cy="-1" rx="1.3" ry=".75" fill="#1a1a1a"/><ellipse cx="2" cy="-1" rx="1.3" ry=".75" fill="#1a1a1a"/>`;
  k += `<path d="M-3.8 .2 q1.6 .8 2.4 .2 M3.8 .2 q-1.6 .8 -2.4 .2 M-.6 -2.6 q.6 -.8 1.2 0" stroke="#b3242c" stroke-width=".35" fill="none"/>`;
  for (const [dx, a, c] of [[3.6, -40, "#b3242c"], [4.2, -18, "#f3e9d2"], [3.2, -62, "#2a2a2e"]]) k += `<path d="M${dx} -2.4 q1.4 -3.4 .4 -7 q-1.6 3 -.4 7 Z" fill="${c}" transform="rotate(${a + 30} ${dx} -2.4)"/>`;
  k += `<circle cx="0" cy="-2.6" r=".45" fill="#f6f2e8"/>`;
  S.teil({ oben: true, id: "maske", de: "die Maske", syl: "MAS-ke", it: "la maschera", itSyl: "MA-sche-ra", en: "mask", x: mx, y: my, kunst: `<g transform="scale(${MS})">${k + flaeche(-5, -7, 10, 9, 0.6)}</g>`,
    tipp: "Beim Karneval im Februar tragen viele Menschen in Venedig prächtige Masken." });
}

/* Ein Hauch Abendlicht über allem (fängt keinen Tipp ab) */
S.davor(`<rect width="400" height="260" fill="${S.rg("abend", [[0, "#ffd9a0", 0.16], [0.6, "#ffd9a0", 0], [1, "#000", 0.06]], 0.05, 0.4, 1.1)}" pointer-events="none"/>`);

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/venedig.js"));
console.log(aus);
