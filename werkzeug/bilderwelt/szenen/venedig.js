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
const F = 765;               /* 1,7 je Meter in 450 m; Auge 5 m über dem Wasser, 4 m über dem Ufer */
const wl = (d) => r(HOR + 5 * F / d);

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("wolke")}" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="2.4"/></filter>`);
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
S.def(`<pattern id="${S.id("raute")}" patternUnits="userSpaceOnUse" width="3.2" height="2.6"><rect width="3.2" height="2.6" fill="#efcdbd"/><path d="M1.6 0 L3.2 1.3 L1.6 2.6 L0 1.3 Z" fill="#e3ad9b" stroke="#fbf1e6" stroke-width=".42"/><path d="M1.6 .75 L2.25 1.3 L1.6 1.85 L.95 1.3 Z" fill="#f3d9cc"/></pattern>`);
/* Ringelhemd des Gondoliere (in Figur-Zentimetern) */
S.def(`<pattern id="${S.id("ringel")}" patternUnits="userSpaceOnUse" width="200" height="10"><rect width="200" height="4.6" fill="#1d2f5e"/></pattern>`);

/* =====================================================================
   KULISSE — Abendhimmel, Dunst, Zecca, Piazzetta-Tiefe, Riva, Molo
   ===================================================================== */
S.hinten(`<rect width="400" height="${WASSER + 2}" fill="${S.lg("himmel", [[0, "#5f93c6"], [0.45, "#9cbfdc"], [0.8, "#ead8bd"], [1, "#f6dfbd"]])}"/>`);
/* die tiefe Sonne steht links außerhalb des Bildes */
S.hinten(`<rect width="400" height="${WASSER + 2}" fill="${S.rg("sonne", [[0, "#fff1c8", 0.85], [0.35, "#ffe2a8", 0.35], [1, "#ffe2a8", 0]], 0, 0.62, 0.75)}"/>`);
{
  let w = "";
  for (const [x, y, s] of [[60, 20, 1.2], [215, 12, 0.9], [335, 34, 1.3], [170, 56, 0.7], [390, 74, 0.6]]) {
    w += `<g filter="url(#${S.id("wolke")})" opacity=".8">`;
    for (const [dx, dy, rx, ry] of [[0, 0, 22, 3.6], [-14, 1.4, 12, 2.6], [15, 1, 13, 3], [-4, -2.2, 10, 3.2]]) w += `<ellipse cx="${r(x + dx * s)}" cy="${r(y + dy * s)}" rx="${r(rx * s)}" ry="${r(ry * s)}" fill="#fff6e6"/>`;
    w += `<ellipse cx="${r(x + 4 * s)}" cy="${r(y + 2.6 * s)}" rx="${r(18 * s)}" ry="${r(1.6 * s)}" fill="#f2c9a4" opacity=".7"/></g>`;
  }
  S.hinten(w);
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
  let k = `<g filter="url(#${S.id("dunst")})" opacity=".9"><rect x="100" y="113" width="34" height="${r(MOLO - 113)}" fill="#e6dccb"/>`;
  for (let row = 0; row < 3; row++) for (let i = 0; i < 11; i++) k += `<path d="M${r(101 + i * 3)} ${r(MOLO - 0.5 - row * 5.6)} l0 -3 q1 -1.4 2 0 l0 3 Z" fill="${row ? "#9c8f80" : "#7b6e64"}"/>`;
  k += `<rect x="100" y="112.4" width="34" height="1" fill="#f3ece0"/></g>`;
  /* Pflaster der Piazzetta mit hellen Streifen */
  k += `<path d="M88 ${MOLO} L134 ${MOLO} L134 ${r(MOLO - 1.2)} L96 ${r(MOLO - 1.2)} Z" fill="#cfc6b6"/>`;
  S.hinten(G(k));
}
/* Rio di Palazzo: die Lücke zwischen Palast und Gefängnis, Seitenwände im Schatten */
{
  let k = `<rect x="227" y="100" width="16" height="${r(MOLO - 100)}" fill="${S.lg("rio", [[0, "#8d8076"], [1, "#4e4440"]])}"/>`;
  k += `<path d="M227 100 L232 103 L232 ${MOLO} L227 ${MOLO} Z" fill="#b9ab9c"/>`;
  for (const y of [106, 113, 120]) k += `<rect x="228.4" y="${y}" width="2" height="3.6" fill="#5e524c"/>`;
  k += `<path d="M243 104 L238.6 106 L238.6 ${MOLO} L243 ${MOLO} Z" fill="#8f877c"/>`;
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
    k += `<rect x="${r(x)}" y="${r(y - h)}" width=".55" height="${r(h)}" rx=".25" fill="${c}"/><circle cx="${r(x + 0.27)}" cy="${r(y - h - 0.35)}" r=".32" fill="#d9b49a"/>`;
  }
  /* Ponte della Paglia: weißer Bogen mit Balustrade */
  k += `<path d="M225 ${MOLO + 1.2} Q235 125.6 245 ${MOLO + 1.4} L245 ${MOLO - 1} Q235 123.4 225 ${MOLO - 1} Z" fill="${ISTRIA}"/>`;
  k += `<path d="M228.4 ${MOLO + 1.2} Q235 127.8 241.6 ${MOLO + 1.4} Z" fill="#3b4447"/>`;
  for (let x = 226; x < 245; x += 1.1) { const y = MOLO - 1 - Math.sin((x - 225) / 20 * Math.PI) * 3.8; k += `<rect x="${r(x)}" y="${r(y - 1.6)}" width=".45" height="1.6" fill="#f6efe2"/>`; }
  k += `<path d="M225 ${r(MOLO - 2.6)} Q235 121.8 245 ${r(MOLO - 2.6)}" stroke="#fbf6ec" stroke-width=".5" fill="none"/>`;
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
  for (let i = 0; i < 3; i++) {
    const x = CX + 0.6 + i * 1.5;
    k += `<path d="M${r(x)} ${y(1)} L${r(x)} ${y(46.6)} Q${r(x + 0.5)} ${y(47.4)} ${r(x + 1)} ${y(46.6)} L${r(x + 1)} ${y(1)} Z" fill="#5e2d23"/>`;
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
  for (let i = 0; i < 3; i++) {
    const x = CX + 0.4 + i * 1.5;
    k += `<path d="M${r(x)} ${y(52)} L${r(x)} ${y(58.4)} Q${r(x + 0.55)} ${y(59.6)} ${r(x + 1.1)} ${y(58.4)} L${r(x + 1.1)} ${y(52)} Z" fill="#2c2321"/>`;
  }
  for (let x = L + 0.3; x < R; x += 0.8) k += `<rect x="${r(x)}" y="${y(52.4)}" width=".35" height="1.4" fill="${x < CX ? "#f3ece0" : "#b9ae9d"}"/>`;
  k += `<rect x="${r(L - 0.6)}" y="${y(62.4)}" width="${r(R - L + 1.2)}" height="1.1" fill="#f6f0e4"/>`;
  /* Würfel (Attika) mit dem Markuslöwen und der Venezia */
  k += `<rect x="${L}" y="${y(70.5)}" width="${r(CX - L)}" height="${r(8.1 * s)}" fill="${S.lg("attika", [[0, "#e5d3c0"], [1, "#d2b9a2"]])}"/>`;
  k += `<rect x="${CX}" y="${y(70.5)}" width="${r(R - CX)}" height="${r(8.1 * s)}" fill="#a99280"/>`;
  k += `<path d="M${r(CX - 7.2)} ${y(64.6)} q1.4 -2.2 3 -1.4 q.6 -1.6 1.8 -1 q.6 1 -.4 1.4 l1.6 1 l-.4 1.2 l-1.4 -.6 l-.6 .9 l-1.2 -.2 l-.4 -.8 l-1.2 .5 Z" fill="#c9a24a" opacity=".9"/>`;
  k += `<path d="M${r(CX + 2)} ${y(64.4)} l.5 -3 q.5 -1 1 0 l.5 3 Z" fill="#7d6858"/>`;
  k += `<rect x="${r(L - 0.4)}" y="${y(71)}" width="${r(R - L + 0.8)}" height=".8" fill="#f6f0e4"/>`;
  /* grüne Pyramide (zwei Seiten) und der goldene Engel */
  const spitze = [r(CX - 0.6), y(95.5)];
  k += `<path d="M${r(L - 0.2)} ${y(71)} L${spitze[0]} ${spitze[1]} L${CX} ${y(71)} Z" fill="${KUPFER}"/>`;
  k += `<path d="M${CX} ${y(71)} L${spitze[0]} ${spitze[1]} L${r(R + 0.2)} ${y(71)} Z" fill="${KUPFER_S}"/>`;
  k += `<path d="M${r(L + 1.5)} ${y(72)} L${spitze[0]} ${spitze[1]}" stroke="#c4e6d6" stroke-width=".35" opacity=".7"/>`;
  for (let m = 75; m < 93; m += 3.4) { const t = (m - 71) / 24.5; k += `<line x1="${r(L + (CX - 0.6 - L) * t)}" y1="${y(m)}" x2="${r(CX)}" y2="${y(m)}" stroke="#5f9480" stroke-width=".15"/>`; }
  /* Erzengel Gabriel: Gewand, Flügel, ausgestreckter Arm */
  const ax = spitze[0], ay = spitze[1];
  k += `<path d="M${r(ax - 0.5)} ${r(ay)} L${r(ax - 0.3)} ${r(ay - 2.3)} L${r(ax + 0.4)} ${r(ay - 2.3)} L${r(ax + 0.5)} ${r(ay)} Z" fill="${GOLD}"/>`;
  k += `<circle cx="${r(ax + 0.05)}" cy="${r(ay - 2.7)}" r=".42" fill="${GOLD}"/>`;
  k += `<path d="M${r(ax - 0.2)} ${r(ay - 2)} q-1.8 -1.2 -2.2 -3.2 q1.4 .6 2.4 2.2 Z" fill="${GOLD}"/><path d="M${r(ax + 0.3)} ${r(ay - 2)} q1.4 -1.6 1.4 -3.4 q-1 .8 -1.6 2.6 Z" fill="${GOLD}"/>`;
  k += `<line x1="${r(ax + 0.3)}" y1="${r(ay - 1.9)}" x2="${r(ax + 1.8)}" y2="${r(ay - 2.4)}" stroke="#e8b83a" stroke-width=".3"/>`;
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
      { id: "engel", de: "der Engel", syl: "EN-gel", it: "l'angelo", itSyl: "AN-ge-lo", en: "angel", x: spitze[0], y: spitze[1], kunst: flaeche(-2.6, -6, 5, 6.4, 0.6),
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
    /* die hohe, leicht bauchige Bleihaube mit Rippen */
    g += `<path d="M${r(x - w / 2)} ${r(top + w * 0.58)} C${r(x - w / 2)} ${r(top + w * 0.1)} ${r(x - w * 0.28)} ${r(top - 0.2)} ${r(x)} ${r(top)} C${r(x + w * 0.28)} ${r(top - 0.2)} ${r(x + w / 2)} ${r(top + w * 0.1)} ${r(x + w / 2)} ${r(top + w * 0.58)} Z" fill="${BLEI}"/>`;
    for (const t of [-0.3, -0.1, 0.1, 0.3]) g += `<path d="M${r(x + t * w * 1.4)} ${r(top + w * 0.58)} Q${r(x + t * w * 1.1)} ${r(top + w * 0.12)} ${r(x)} ${r(top + 0.1)}" stroke="#8d9396" stroke-width=".2" fill="none"/>`;
    g += `<path d="M${r(x - w * 0.38)} ${r(top + w * 0.45)} C${r(x - w * 0.36)} ${r(top + w * 0.16)} ${r(x - w * 0.2)} ${r(top + 0.6)} ${r(x - 0.4)} ${r(top + 0.3)}" stroke="#f4f5f2" stroke-width=".55" opacity=".7" fill="none"/>`;
    /* Laterne: kleine Zwiebel auf Säulchen, goldene Kugel, Kreuz */
    const lw = w * 0.2;
    g += `<rect x="${r(x - lw / 2)}" y="${r(top - lw * 0.9)}" width="${r(lw)}" height="${r(lw * 0.9)}" fill="#d8d0c2"/>`;
    g += `<rect x="${r(x - lw * 0.15)}" y="${r(top - lw * 0.8)}" width="${r(lw * 0.3)}" height="${r(lw * 0.6)}" fill="#4e443f"/>`;
    g += `<path d="M${r(x - lw * 0.62)} ${r(top - lw * 0.9)} Q${r(x - lw * 0.7)} ${r(top - lw * 1.6)} ${r(x)} ${r(top - lw * 2.3)} Q${r(x + lw * 0.7)} ${r(top - lw * 1.6)} ${r(x + lw * 0.62)} ${r(top - lw * 0.9)} Z" fill="${BLEI}"/>`;
    g += `<circle cx="${r(x)}" cy="${r(top - lw * 2.45)}" r="${r(lw * 0.22)}" fill="${GOLD}"/>`;
    g += `<path d="M${r(x)} ${r(top - lw * 2.6)} L${r(x)} ${r(top - lw * 3.6)} M${r(x - lw * 0.3)} ${r(top - lw * 3.2)} L${r(x + lw * 0.3)} ${r(top - lw * 3.2)}" stroke="#d9a92e" stroke-width="${gross ? 0.4 : 0.32}"/>`;
    return g;
  };
  /* von hinten nach vorn: West (fern), Nord (fern), Mitte, Süd (nah), Ost (nah) */
  k += kuppel(157, 90.6, 11.6) + kuppel(194, 90.2, 11.2) + kuppel(180, 85.6, 15.6, true) + kuppel(167, 90.4, 12.6) + kuppel(205, 90.8, 12.6);
  S.teil({ id: "markusdom", de: "der Markusdom", syl: "MAR-kus-dom", it: "la Basilica di San Marco", itSyl: "ba-SI-li-ca di san MAR-co", en: "St Mark's Basilica",
    x: 0, y: 0, kunst: G(k), tipp: "Der Markusdom hat fünf große Kuppeln. Innen glänzen goldene Mosaiken.",
    zoom: Z({ x: 146, y: 76, w: 72, h: 30 }),
    unter: [
      { id: "kuppel", de: "die Kuppel", syl: "KUP-pel", it: "la cupola", itSyl: "CU-po-la", en: "dome", x: 180, y: 99, kunst: flaeche(-8, -20, 16, 20),
        tipp: "Die Kuppeln sind aus Holz und mit Blei gedeckt – darum glänzen sie silbern." },
    ].map(U) });
}

/* =====================================================================
   3 — DIE BIBLIOTHEK (Libreria Marciana): Südende und die lange,
       schräg gesehene Seite zur Piazzetta
   ===================================================================== */
{
  let k = "";
  /* Südende, drei Joche (näher, größer) */
  const x0 = 26, x1 = 50, T = 102.2;
  k += `<rect x="${x0}" y="${T}" width="${x1 - x0}" height="${r(MOLO - T)}" fill="${ISTRIA}"/>`;
  for (let i = 0; i < 3; i++) {
    const x = x0 + 1.6 + i * 7.6;
    k += `<path d="M${r(x)} ${MOLO} L${r(x)} 123.4 Q${r(x + 2.4)} 120.2 ${r(x + 4.8)} 123.4 L${r(x + 4.8)} ${MOLO} Z" fill="${DUNKEL}"/>`;
    k += `<rect x="${r(x - 1.1)}" y="117.6" width=".9" height="${r(MOLO - 117.6)}" fill="#f3ecdf"/>`;
    k += `<path d="M${r(x + 0.6)} 116 L${r(x + 0.6)} 110.8 Q${r(x + 2.4)} 108.4 ${r(x + 4.2)} 110.8 L${r(x + 4.2)} 116 Z" fill="#54463f"/>`;
    for (let j = 0; j < 4; j++) k += `<rect x="${r(x + 0.8 + j * 0.95)}" y="115" width=".4" height="1.2" fill="#f3ecdf"/>`;
    k += `<ellipse cx="${r(x + 2.4)}" cy="106.4" rx="1" ry=".7" fill="#54463f"/>`;
  }
  k += `<rect x="${x0}" y="117" width="${x1 - x0}" height="1.1" fill="#f7f1e6"/><rect x="${x0}" y="105" width="${x1 - x0}" height="3" fill="#ece4d4"/>`;
  for (let x = x0 + 1; x < x1; x += 1.2) k += `<rect x="${r(x)}" y="${T - 1.6}" width=".5" height="1.6" fill="#f3ecdf"/>`;
  k += `<rect x="${x0 - 0.4}" y="${T - 2}" width="${x1 - x0 + 0.8}" height=".6" fill="#f7f1e6"/>`;
  /* Statuen und Obelisken auf der Balustrade */
  for (const [x, ob] of [[x0 + 0.6, true], [x0 + 8, false], [x0 + 16, false], [x1 - 0.6, true]]) {
    if (ob) k += `<path d="M${r(x - 0.6)} ${T - 2} L${r(x)} ${T - 7.4} L${r(x + 0.6)} ${T - 2} Z" fill="#e9e1d1"/><circle cx="${r(x)}" cy="${T - 7.8}" r=".35" fill="#e9e1d1"/>`;
    else k += `<path d="M${r(x - 0.5)} ${T - 2} l.1 -2.6 q.4 -1 .8 0 l.1 2.6 Z" fill="#e1d8c6"/><circle cx="${r(x)}" cy="${T - 5.2}" r=".45" fill="#e1d8c6"/>`;
  }
  /* die lange Seite zur Piazzetta, perspektivisch (21 Joche, fern kleiner) */
  const wA = 1 / 455, wB = 1 / 575;
  const P = (t, a, b) => (a * wA * (1 - t) + b * wB * t) / (wA * (1 - t) + wB * t);
  const xs = (t) => P(t, x1, 92), top = (t) => P(t, T, 107.6), fuss = (t) => P(t, MOLO, 130.4), mitte = (t) => P(t, 117, 119.4);
  k += `<path d="M${x1} ${T} L92 107.6 L92 130.4 L${x1} ${MOLO} Z" fill="${S.lg("libs", [[0, "#e8dece"], [1, "#d8ccb8"]], 0, 0, 1, 0)}"/>`;
  for (let i = 0; i < 21; i++) {
    const a = i / 21, b = (i + 0.62) / 21, c = (i + 0.31) / 21;
    const xa = r(xs(a) + 0.35), xb = r(xs(b) + 0.35), xm = r(xs(c) + 0.35);
    k += `<path d="M${xa} ${r(fuss(a))} L${xa} ${r(mitte(a) + (fuss(a) - mitte(a)) * 0.42)} Q${xm} ${r(mitte(c) + (fuss(c) - mitte(c)) * 0.18)} ${xb} ${r(mitte(b) + (fuss(b) - mitte(b)) * 0.42)} L${xb} ${r(fuss(b))} Z" fill="#5a4b43"/>`;
    k += `<path d="M${xa} ${r(mitte(a) - 1.3)} L${xa} ${r(top(a) + (mitte(a) - top(a)) * 0.5)} Q${xm} ${r(top(c) + (mitte(c) - top(c)) * 0.32)} ${xb} ${r(top(b) + (mitte(b) - top(b)) * 0.5)} L${xb} ${r(mitte(b) - 1.3)} Z" fill="#6a5a50"/>`;
    if (i % 2 === 0) k += `<path d="M${r(xs(c))} ${r(top(c) - 1.5)} l.15 -1.9 q.25 -.6 .5 0 l.15 1.9 Z" fill="#ddd3c1"/>`;
  }
  k += `<path d="M${x1} ${r(117)} L92 119.4" stroke="#f3ecdf" stroke-width=".6"/><path d="M${x1} ${T + 3} L92 ${r(110.2)}" stroke="#efe7d8" stroke-width="1.4"/>`;
  k += `<path d="M${x1} ${T - 1.6} L92 106.3 L92 107.6 L${x1} ${T} Z" fill="#efe7d8"/>`;
  k += `<path d="M${x1} ${T} L${x1} ${MOLO}" stroke="#cbbfac" stroke-width=".4"/>`;
  S.teil({ id: "bibliothek", de: "die Bibliothek", syl: "bi-bli-o-THEK", it: "la Biblioteca Marciana", itSyl: "bi-blio-TE-ca mar-CIA-na", en: "Marciana Library",
    x: 0, y: 0, kunst: G(k), tipp: "In der Bibliothek von Sansovino liegen sehr alte Bücher und Landkarten." });
}

/* =====================================================================
   4 — DER DOGENPALAST (Südfassade am Molo)
       Lupe: Arkade, Loggia, Balkon, Zinne
   ===================================================================== */
const PAL = { x0: 132, x1: 228, fuss: MOLO, porT: 121.6, logT: 111.8, top: 98.6 };
{
  const { x0, x1, fuss, porT, logT, top } = PAL, W = x1 - x0;
  let k = "";
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
    let b = `<path d="M${BX - 4.4} ${logT} L${BX - 4.4} 100.4 L${BX - 3.6} 96.6 L${BX - 2.8} 100.4 L${BX - 2.8} ${logT} Z M${BX + 2.8} ${logT} L${BX + 2.8} 100.4 L${BX + 3.6} 96.6 L${BX + 4.4} 100.4 L${BX + 4.4} ${logT} Z" fill="#fbf6ec"/>`;
    b += `<path d="M${BX - 2.6} ${logT - 0.6} L${BX - 2.6} 103.4 Q${BX} 100.2 ${BX + 2.6} 103.4 L${BX + 2.6} ${logT - 0.6} Z" fill="#f6eee0"/>`;
    b += `<path d="M${BX - 1.9} ${logT - 0.8} L${BX - 1.9} 104 Q${BX} 101.6 ${BX + 1.9} 104 L${BX + 1.9} ${logT - 0.8} Z" fill="#433f4a"/>`;
    b += `<path d="M${BX - 3} 102.2 Q${BX} 97.4 ${BX + 3} 102.2" stroke="#fbf6ec" stroke-width=".6" fill="none"/>`;
    b += `<path d="M${BX - 1.2} 99.6 L${BX} 94.6 L${BX + 1.2} 99.6 Z" fill="#fbf6ec"/>`;
    /* Justitia mit Schwert und Waage */
    b += `<path d="M${BX - 0.55} 94.8 l.15 -2.4 q.4 -.9 .8 0 l.15 2.4 Z" fill="#f1e8d8"/><circle cx="${BX}" cy="91.9" r=".42" fill="#f1e8d8"/>`;
    b += `<line x1="${BX + 0.4}" y1="93.2" x2="${BX + 0.9}" y2="90.8" stroke="#d8cdb9" stroke-width=".22"/><line x1="${BX - 1.3}" y1="92.6" x2="${BX - 0.4}" y2="92.6" stroke="#d8cdb9" stroke-width=".18"/>`;
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
    k += `<path d="M${r(x + 0.42)} ${r(porT - 1.5)} L${r(x + 0.42)} ${r(logT + 4.6)} Q${r(x + 0.42)} ${r(logT + 3.4)} ${r(m)} ${r(logT + 2.9)} Q${r(x + lb - 0.42)} ${r(logT + 3.4)} ${r(x + lb - 0.42)} ${r(logT + 4.6)} L${r(x + lb - 0.42)} ${r(porT - 1.5)} Z" fill="${S.lg("loggiaschatten", [[0, "#5e4c48"], [1, "#806a62"]])}"/>`;
    k += `<circle cx="${r(m - 0.5)}" cy="${r(logT + 4.4)}" r=".42" fill="#f6eee2"/><circle cx="${r(m + 0.5)}" cy="${r(logT + 4.4)}" r=".42" fill="#f6eee2"/>`;
    if (i > 0) k += `<circle cx="${r(x)}" cy="${r(logT + 1.7)}" r=".95" fill="#f6eee2" stroke="#c2b39f" stroke-width=".2"/><path d="M${r(x - 0.5)} ${r(logT + 1.7)} a.5 .5 0 1 1 1 0 a.5 .5 0 1 1 -1 0 M${r(x)} ${r(logT + 1.2)} a.5 .5 0 1 1 0 1 a.5 .5 0 1 1 0 -1" fill="#8e7a70"/>`;
  }
  k += `<rect x="${x0}" y="${r(porT - 1.6)}" width="${W}" height="1.6" fill="#f3e9da"/>`;
  for (let x = x0 + 0.5; x < x1; x += 0.94) k += `<rect x="${r(x)}" y="${r(porT - 1.45)}" width=".35" height="1.2" fill="#b9a993"/>`;
  k += `<rect x="${x0}" y="${r(logT - 0.4)}" width="${W}" height=".8" fill="#fbf6ec"/>`;
  /* Portikus: 17 Spitzbögen auf gedrungenen Säulen */
  const pb = W / 17;
  k += `<rect x="${x0}" y="${porT}" width="${W}" height="${r(fuss - porT)}" fill="#f2e9da"/>`;
  for (let i = 0; i < 17; i++) {
    const x = x0 + i * pb, m = x + pb / 2;
    k += `<path d="M${r(x + 0.85)} ${fuss} L${r(x + 0.85)} ${r(porT + 4.4)} Q${r(x + 0.9)} ${r(porT + 1.8)} ${r(m)} ${r(porT + 1)} Q${r(x + pb - 0.9)} ${r(porT + 1.8)} ${r(x + pb - 0.85)} ${r(porT + 4.4)} L${r(x + pb - 0.85)} ${fuss} Z" fill="${S.lg("portikus", [[0, "#3f3230"], [1, "#6a5650"]])}"/>`;
    k += `<rect x="${r(x - 0.75)}" y="${r(porT + 4)}" width="1.5" height=".6" fill="#fbf6ec"/>`;
  }
  k += `<rect x="${x0}" y="${r(porT - 0.2)}" width="${W}" height=".7" fill="#fbf6ec"/>`;
  /* Ecken: Säule mit Skulptur (Adam und Eva links, Noah rechts) */
  for (const x of [x0 + 0.5, x1 - 0.5]) k += `<rect x="${r(x - 0.7)}" y="${porT}" width="1.4" height="${r(fuss - porT)}" fill="#fbf6ec"/><path d="M${r(x - 0.6)} ${porT + 4} l.3 -2.4 .6 0 .3 2.4 Z" fill="#d9ccb8"/>`;
  /* Zinnen: weiße Blattzinnen mit Spitzen, Eck-Tabernakel */
  for (let x = x0 + 1.2; x < x1 - 1; x += 2.62) k += `<path d="M${r(x - 0.75)} ${top} L${r(x - 0.75)} ${r(top - 1.4)} Q${r(x)} ${r(top - 2.2)} ${r(x)} ${r(top - 3)} Q${r(x)} ${r(top - 2.2)} ${r(x + 0.75)} ${r(top - 1.4)} L${r(x + 0.75)} ${top} Z" fill="#fbf7ef"/><line x1="${r(x + 1.31)}" y1="${top}" x2="${r(x + 1.31)}" y2="${r(top - 1.3)}" stroke="#f3ecdf" stroke-width=".3"/>`;
  k += `<rect x="${x0}" y="${r(top - 0.2)}" width="${W}" height=".8" fill="#f6efe2"/>`;
  for (const x of [x0 + 0.6, x1 - 0.6]) k += `<rect x="${r(x - 1)}" y="${r(top - 4.6)}" width="2" height="4.6" fill="#fbf7ef"/><path d="M${r(x - 1.1)} ${r(top - 4.6)} L${r(x)} ${r(top - 9.4)} L${r(x + 1.1)} ${r(top - 4.6)} Z" fill="#f1e9dc"/><rect x="${r(x - 0.4)}" y="${r(top - 3.8)}" width=".8" height="2.2" fill="#6e6060"/>`;
  /* Licht von links: die Fassade glüht, nach rechts etwas kühler */
  k += `<rect x="${x0}" y="${top}" width="${W}" height="${r(fuss - top)}" fill="${S.lg("abendglut", [[0, "#ffcf8a", 0.16], [1, "#ffcf8a", 0]], 0, 0, 1, 0)}"/>`;
  S.teil({ id: "dogenpalast", de: "der Dogenpalast", syl: "DO-gen-pa-last", it: "il Palazzo Ducale", itSyl: "pa-LAZ-zo du-CA-le", en: "Doge's Palace",
    x: 0, y: 0, kunst: G(k), tipp: "Im Dogenpalast regierte der Doge, das Oberhaupt von Venedig. Die Wand hat ein Muster aus rosa und weißem Stein.",
    zoom: Z({ x: 128, y: 88, w: 104, h: 46 }),
    unter: [
      { id: "arkade", de: "die Arkade", syl: "ar-KA-de", it: "il portico", itSyl: "POR-ti-co", en: "arcade", x: 160, y: fuss, kunst: flaeche(-27, -(fuss - porT), 40, fuss - porT, 0.5),
        tipp: "Unten hat der Palast 17 Spitzbögen – man kann im Schatten darunter gehen." },
      { id: "loggia", de: "die Loggia", syl: "LOG-gia", it: "la loggia", itSyl: "LOG-gia", en: "loggia", x: 206, y: porT, kunst: flaeche(-12, -(porT - logT), 34, porT - logT, 0.5),
        tipp: "In der Loggia stehen doppelt so viele Bögen wie unten – darüber runde Vierpässe." },
      { id: "balkon", de: "der Balkon", syl: "bal-KON", it: "il balcone", itSyl: "bal-CO-ne", en: "balcony", x: BX, y: logT + 0.6, kunst: flaeche(-4.6, -20.4, 9.2, 21, 0.5),
        tipp: "Der Balkon ist von 1404. Ganz oben steht die Justitia mit Schwert und Waage." },
      { id: "zinne", de: "die Zinne", syl: "ZIN-ne", it: "il merlo", itSyl: "MER-lo", en: "battlement", x: 150, y: top, kunst: flaeche(-16, -3.4, 22, 3.6, 0.4) },
    ].map(U) });
}

/* =====================================================================
   5 — DIE SEUFZERBRÜCKE (über dem Rio di Palazzo, hinter dem Ponte della Paglia)
   ===================================================================== */
{
  const x = 235, y = 119.4;
  let k = `<path d="M-6.2 0 L-6.2 -6.6 L6.2 -6.6 L6.2 0 Q0 -2.4 -6.2 0 Z" fill="${ISTRIA}"/>`;
  k += `<path d="M-6.2 0 Q0 -2.4 6.2 0" stroke="#b9ad9b" stroke-width=".3" fill="none"/>`;
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
  /* San Todaro: Heiliger mit Lanze und Schild auf dem Krokodil (weißer Marmor) */
  const todaro = `<path d="M84.2 110.2 q.8 -.9 2.6 -.4 q.4 .3 0 .5 Z" fill="#d7cebd"/><path d="M85.4 109.8 l.1 -2.8 q.5 -.8 1 0 l.1 2.8 Z" fill="#efe8da"/><circle cx="86" cy="106.4" r=".5" fill="#efe8da"/><line x1="86.9" y1="109.6" x2="87.3" y2="104.4" stroke="#cfc4b0" stroke-width=".2"/><ellipse cx="85.1" cy="108.2" rx=".45" ry=".75" fill="#e2d9c8"/>`;
  /* San Marco: der geflügelte Bronzelöwe, Blick nach Osten, Pfote auf dem Buch */
  const L0 = 124;
  const loewe = `<path d="M${L0 - 2.2} 110.2 L${L0 - 2} 108.6 Q${L0 - 1.6} 107.6 ${L0 - 0.4} 107.8 L${L0 + 1} 107.8 Q${L0 + 1.8} 106.6 ${L0 + 2.4} 107.2 Q${L0 + 2.8} 107.8 ${L0 + 2.2} 108.4 L${L0 + 2} 110.2 L${L0 + 1.4} 110.2 L${L0 + 1.4} 109 L${L0 - 1.2} 109 L${L0 - 1.4} 110.2 Z" fill="${S.lg("bronzel", [[0, "#7a6a4a"], [1, "#3c3326"]])}"/>` +
    `<path d="M${L0 - 1.4} 108 Q${L0 - 3} 105.2 ${L0 - 1.6} 103.8 Q${L0 - 0.8} 105.6 ${L0 + 0.2} 107.8 Z" fill="#5a4c36"/><path d="M${L0 - 1.1} 107.6 Q${L0 - 2} 105.6 ${L0 - 1.4} 104.6" stroke="#c4a35a" stroke-width=".2" fill="none"/>` +
    `<circle cx="${L0 + 2.2}" cy="107.4" r=".85" fill="#5e4f38"/><rect x="${L0 + 1.8}" y="109.2" width="1.2" height=".8" fill="#e8dcc0"/>`;
  k += saeule(86, S.lg("rosagranit", [[0, "#c89a8e"], [0.5, "#b7867a"], [1, "#94675c"]], 0, 0, 1, 0), todaro);
  k += saeule(124, S.lg("graugranit", [[0, "#a3a6aa"], [0.5, "#8c9095"], [1, "#6d7176"]], 0, 0, 1, 0), loewe);
  S.teil({ id: "saeule", de: "die Säule", syl: "SÄU-le", it: "la colonna", itSyl: "co-LON-na", en: "column", x: 0, y: 0, kunst: G(k),
    tipp: "Auf der einen Säule steht der heilige Theodor, auf der anderen der geflügelte Löwe des heiligen Markus.",
    zoom: Z({ x: 78, y: 100, w: 54, h: 34 }),
    unter: [
      { id: "loewe", de: "der Löwe", syl: "LÖ-we", it: "il leone", itSyl: "le-O-ne", en: "lion", x: L0, y: 110.2, kunst: flaeche(-3.4, -7, 7, 7.2, 0.6),
        tipp: "Der geflügelte Löwe ist das Zeichen von Venedig." },
    ].map(U) });
}

/* =====================================================================
   8 — DIE LAGUNE (Bacino di San Marco) mit Spiegelungen,
       ganz hinten die Gondeln am Molo
   ===================================================================== */
const UFER = 243;   /* Kante des Platzes vor San Giorgio (33 m vor uns) */
{
  let k = `<rect x="0" y="${r(WASSER - 0.6)}" width="400" height="${r(UFER - WASSER + 1.6)}" fill="${S.lg("wasser", [[0, "#a9c4c0"], [0.12, "#7fa9a6"], [0.5, "#4d8784"], [1, "#2b6466"]])}"/>`;
  /* Spiegelungen der Bauten (in Molo-Koordinaten): weich, unten zerrissen */
  let sp = `<g filter="url(#${S.id("spiegel")})" opacity=".55">`;
  sp += `<rect x="132" y="${WASSER0}" width="96" height="9" fill="#efcdbd"/><rect x="132" y="${WASSER0}" width="96" height="2.6" fill="#7a6058"/>`;
  sp += `<rect x="90" y="${WASSER0}" width="14" height="22" fill="#b4644c"/><rect x="26" y="${WASSER0}" width="66" height="8" fill="#e6dccb"/><rect x="16" y="${WASSER0}" width="10" height="7" fill="#d9cfbd"/>`;
  sp += `<rect x="243" y="${WASSER0}" width="54" height="8" fill="#d8ccb8"/><rect x="297" y="${WASSER0}" width="30" height="9" fill="#c56d5d"/>`;
  sp += `</g>`;
  /* die Gondeln liegen am Molo vor dem Palast, mit gestreiften Pfählen */
  for (let i = 0; i < 16; i++) {
    const x = 136 + i * 5.6;
    sp += `<path d="M${r(x - 2.2)} ${r(WASSER0 + 0.9)} q2.2 .8 4.4 0 l.3 -.5 q-2.5 .6 -5 0 Z" fill="#141416"/><rect x="${r(x - 1)}" y="${r(WASSER0 + 0.2)}" width="2" height=".45" fill="#2f4f8a"/>`;
    if (i % 2 === 0) sp += `<rect x="${r(x + 2.8)}" y="${r(WASSER0 - 2.2)}" width=".4" height="3.4" fill="#f1f1ee"/><rect x="${r(x + 2.8)}" y="${r(WASSER0 - 1.8)}" width=".4" height=".5" fill="#2f4f8a"/><rect x="${r(x + 2.8)}" y="${r(WASSER0 - 0.8)}" width=".4" height=".5" fill="#2f4f8a"/>`;
  }
  k += G(sp);
  /* Spiegelstreifen zerschneiden die Bilder (Wellenlinien in Wasserfarbe) */
  for (let y = WASSER + 1.6; y < WASSER + 32; y += 1.3 + (y - WASSER) * 0.07) k += `<rect x="0" y="${r(y)}" width="400" height="${r(0.3 + (y - WASSER) * 0.025)}" fill="#6f9e9b" opacity=".55"/>`;
  /* Glitzer der tiefen Sonne (links) und kleine Wellen, vorn größer */
  for (let i = 0; i < 230; i++) {
    const t = Math.pow(rnd(), 1.4), y = WASSER + 3 + t * (UFER - WASSER - 5), w = 0.8 + t * 7 * (0.5 + rnd());
    const x = rnd() * (400 - w), hell = x < 170 && rnd() < 0.6;
    k += `<path d="M${r(x)} ${r(y)} q${r(w / 2)} ${r(-0.3 - t)} ${r(w)} 0" stroke="${hell ? "#fff3d2" : (rnd() < 0.5 ? "#c8e0dc" : "#1f4f52")}" stroke-width="${r(0.15 + t * 0.5)}" fill="none" opacity="${r(0.35 + rnd() * 0.4)}"/>`;
  }
  S.teil({ id: "lagune", de: "die Lagune", syl: "la-GU-ne", it: "la laguna", itSyl: "la-GU-na", en: "lagoon", x: 0, y: 0, kunst: k,
    tipp: "Venedig steht auf über 100 kleinen Inseln mitten in der Lagune." });
}

/* =====================================================================
   8b — DAS WASSERTAXI (lackiertes Mahagoni, weiße Kabine) in 260 m
   ===================================================================== */
{
  const d = 260, s = F / d;   /* ≈ 2,9 je Meter */
  let k = `<path d="M-1 .3 q-8 .3 -18 2 M0 .8 q-6 .8 -14 3" stroke="#f4f8f6" stroke-width=".45" fill="none" opacity=".8"/>`;
  k += `<ellipse cx="14" cy=".3" rx="15" ry=".7" fill="#1d4446" opacity=".3"/>`;
  k += `<path d="M0 -2.6 L26 -2.6 Q30 -2.4 31 -1.6 Q29.6 .3 25 .3 L1.4 .3 Q0 -.4 0 -2.6 Z" fill="${S.lg("mahagoni", [[0, "#b26a3a"], [0.5, "#8a4a22"], [1, "#5e2e12"]])}"/>`;
  k += `<path d="M1 -2.2 L29 -2.2" stroke="#e8c49a" stroke-width=".25" opacity=".7"/>`;
  k += `<path d="M6 -2.6 L7 -5.6 Q8 -6.4 10 -6.4 L19 -6.4 Q20.6 -6.2 21.4 -4.6 L22.6 -2.6 Z" fill="#f8f8f4"/>`;
  k += `<path d="M8 -3.4 L8.6 -5.4 L19.4 -5.4 L20.6 -3.4 Z" fill="#33454e"/>`;
  k += `<rect x="23.8" y="-4.6" width=".3" height="2" fill="#c9ced3"/><rect x="24.1" y="-4.6" width="1.6" height="1" fill="#c0392b"/>`;
  S.teil({ id: "wassertaxi", de: "das Wassertaxi", syl: "WAS-ser-ta-xi", it: "il taxi acqueo", itSyl: "TA-xi AC-que-o", en: "water taxi", x: 222, y: wl(d),
    kunst: `<g transform="scale(${r(s / 2.9)})">${k}</g>`, tipp: "Das Wassertaxi ist ein schnelles Boot aus glänzendem Holz." });
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
  /* Rettungsring */
  k += `<circle cx="88" cy="-9.4" r="1.4" fill="none" stroke="#e8642a" stroke-width=".8"/>`;
  k += `<path d="M12 -13 L20 -13 L12 -8 Z" fill="#fff" opacity=".18"/>`;
  S.teil({ id: "vaporetto", de: "das Vaporetto", syl: "va-po-RET-to", it: "il vaporetto", itSyl: "va-po-RET-to", en: "water bus", x: VX, y: VY, kunst: `<g transform="scale(${VS})">${k}</g>`,
    tipp: "Das Vaporetto ist der Bus von Venedig – es fährt auf dem Wasser. Autos gibt es in Venedig nicht." });
}

/* =====================================================================
   10 — DIE GONDEL (in 60 m, Bug nach links) — Lupe: Bugbeschlag, Ruder
   11 — DER GONDOLIERE (Ringelhemd, Strohhut) — Lupe: Strohhut
   ===================================================================== */
const GX = 160, GY = wl(60), GS = r(F / 60 / 8.36);   /* Mitte der Gondel auf der Wasserlinie; gezeichnet mit 8,36 je Meter */
const GOND = { fussX: r(GX + 37.4 * GS), fussY: r(GY - 4.8 * GS) };
let gondoliere = null;
{
  gondoliere = B.mensch({ id: "ven_gond", geschlecht: "m", blick: -88, frisur: "kurz", haarfarbe: "dunkelbraun", haut: "hell",
    pose: { kipp: 5, lende: 3, brust: 2, nacken: 6, kopf: -8, schulterL: { vor: 30, seit: 10, dreh: -10 }, ellbogenL: 75, unterarmL: 30, handL: 0, fingerL: 0.75,
      schulterR: { vor: 18, seit: 16, dreh: -10 }, ellbogenR: 95, unterarmR: 30, handR: 0, fingerR: 0.75,
      huefteL: { vor: 16, seit: 3, dreh: -6 }, knieL: 12, fussL: 4, huefteR: { vor: -10, seit: 4, dreh: -6 }, knieR: 4, fussR: 0 },
    kleidung: { oberteil: { stueck: "tshirt", farbe: "#fdfdfb" }, unterteil: { stueck: "anzughose" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" }, kopf: { stueck: "hut", farbe: "#e3c97e" } } }, r(1.8 * F / 60));
}
const HAND = { x: GOND.fussX + gondoliere.z.handL.x * gondoliere.k, y: GOND.fussY + gondoliere.z.handL.y * gondoliere.k };
{
  let k = "";
  /* Spiegelbild und Schatten im Wasser */
  k += `<g filter="url(#${S.id("spiegel")})" opacity=".55"><path d="M-38 .3 Q0 1.6 38 .3 L44 4 Q0 6.6 -45 4 Z" fill="#0f2a2c"/></g>`;
  k += `<path d="M-44 1.2 q-6 .4 -10 1.6 M-40 2 q-4 .6 -8 2" stroke="#e6f1ee" stroke-width=".45" fill="none" opacity=".7"/>`;
  /* hintere Bordwand (man schaut leicht von oben hinein) */
  k += `<path d="M-41 -6.2 Q-30 -4.6 0 -4.4 Q30 -4.6 42 -6.6" stroke="#1a1a1d" stroke-width=".8" fill="none"/>`;
  /* Sitze mit rotem Polster, goldene Seepferdchen (cavalli), geschnitzte Lehne */
  k += `<path d="M-22 -4.2 L-22 -6.8 Q-20.6 -7.6 -19 -6.8 L-19 -4.2 Z M-6 -4.2 L-6 -6.2 L4 -6.2 L4 -4.2 Z" fill="${S.lg("polster", [[0, "#b8323f"], [1, "#7a1a26"]])}"/>`;
  k += `<path d="M-1.6 -4.4 L-1.6 -8.6 Q0 -9.8 1.8 -8.6 L1.8 -4.4 Z" fill="#1d1a1a" stroke="#d9a92e" stroke-width=".3"/>`;
  for (const x of [-12.5, 8.6]) k += `<path d="M${x} -4.1 q-.5 -.9 .1 -1.7 q-.4 -.5 .1 -.9 q.6 -.2 .8 .3 l.5 -.1 l-.4 .5 q.3 .7 -.3 1.1 q.3 .5 .1 .8 Z" fill="${GOLD}" stroke="#8a5a10" stroke-width=".08"/>`;
  /* Rumpf: schwarz lackiert, hoher Bug und Heck */
  k += `<path d="M-45.4 -7 Q-44 -5.2 -40 -4 Q-24 -3 0 -3.2 Q26 -3.4 40.6 -4.6 Q44 -5.6 45.2 -7.6 L45.6 -8.4 Q44.4 -5.2 38 0 L-37 0 Q-42 -2.6 -45.4 -7 Z" fill="${S.lg("lack", [[0, "#3a3a40"], [0.35, "#121214"], [1, "#050506"]])}"/>`;
  k += `<path d="M-42 -5.8 Q-26 -3.9 0 -3.9 Q26 -4 40 -5.2" stroke="#8e9096" stroke-width=".35" fill="none" opacity=".75"/>`;
  k += `<path d="M-30 -1.4 Q0 -1.9 30 -1.6" stroke="#2b2b31" stroke-width=".3" fill="none"/>`;
  /* das Heck: kleine Eisenspitze (risso) */
  k += `<path d="M45.4 -8 q.9 -1 1.6 -.4 q.4 .6 -.4 .8" stroke="#c9ced3" stroke-width=".45" fill="none"/>`;
  /* Ferro am Bug (Stahl, poliert): hinten ein S-Schwung, oben der große gebogene
     Kamm, vorn sechs waagrechte Zinken (die sechs Sestieri), ein Zinken zeigt
     nach hinten zu den Fahrgästen */
  const F = { x: -45.2, y: -7 };
  const fp = (dx, dy) => `${r(F.x + dx)} ${r(F.y + dy)}`;
  let ferro = `<path d="M${fp(0.5, 0.2)} C${fp(1.4, -1.4)} ${fp(0.2, -2.6)} ${fp(0.9, -3.6)} C${fp(1.6, -4.6)} ${fp(1.2, -5.4)} ${fp(0.4, -5.8)} Q${fp(-1.6, -6.6)} ${fp(-3.6, -5.4)} L${fp(-3.2, -5)} Q${fp(-1.8, -5.6)} ${fp(-1, -4.9)} L${fp(-1.2, -4.4)} L${fp(-1.2, -.6)} Q${fp(-.8, .2)} ${fp(.5, .2)} Z" fill="${S.lg("ferro", [[0, "#f7f8f8"], [0.5, "#c3c9ce"], [1, "#8b939a"]], 0, 0, 1, 0)}" stroke="#5f676e" stroke-width=".12"/>`;
  for (let i = 0; i < 6; i++) ferro += `<path d="M${fp(-1.1, -0.7 - i * 0.62)} L${fp(-2.5, -0.8 - i * 0.62)} L${fp(-2.5, -1.06 - i * 0.62)} L${fp(-1.1, -1.08 - i * 0.62)} Z" fill="#dde2e6" stroke="#6e767d" stroke-width=".08"/>`;
  ferro += `<path d="M${fp(0.9, -2.6)} L${fp(1.9, -2.7)} L${fp(1.9, -2.95)} L${fp(0.8, -2.95)} Z" fill="#dde2e6" stroke="#6e767d" stroke-width=".08"/>`;
  ferro += `<path d="M${fp(-0.2, -5.6)} Q${fp(-1.8, -6.2)} ${fp(-3.2, -5.3)}" stroke="#fff" stroke-width=".25" opacity=".8" fill="none"/>`;
  k += ferro;
  /* Forcola (Ruderdolle aus Nussholz) auf der fernen Seite und das Ruder */
  const fx = 25.6;
  k += `<path d="M${fx - 0.6} -4.4 L${fx - 0.8} -8.2 Q${fx - 1.4} -9 ${fx - 0.6} -9.6 L${fx + 0.2} -9 L${fx + 0.6} -10 Q${fx + 1.4} -9.6 ${fx + 1} -8.6 L${fx + 0.8} -4.4 Z" fill="${S.lg("nuss", [[0, "#8a5a32"], [1, "#4f3019"]])}"/>`;
  const hx = (HAND.x - GX) / GS, hy = (HAND.y - GY) / GS;
  k += `<path d="M${r(hx + 1.6)} ${r(hy - 0.9)} L${fx} -8.8 L12.4 -3.8" stroke="${S.lg("ruder", [[0, "#e2c690"], [1, "#b48c52"]])}" stroke-width=".6" stroke-linecap="round" fill="none"/>`;
  S.teil({ id: "gondel", de: "die Gondel", syl: "GON-del", it: "la gondola", itSyl: "GON-do-la", en: "gondola", x: GX, y: GY, kunst: `<g transform="scale(${GS})">${k}</g>`,
    tipp: "Eine Gondel ist fast 11 Meter lang und immer schwarz. Sie ist schief gebaut – so fährt sie geradeaus, obwohl nur auf einer Seite gerudert wird.",
    zoom: { x: GX - 72, y: GY - 42, w: 146, h: 50 },
    unter: [
      { id: "bugbeschlag", de: "der Bugbeschlag", syl: "BUG-be-schlag", it: "il ferro di prua", itSyl: "FER-ro di PRU-a", en: "prow iron", x: r(GX + F.x * GS), y: r(GY + F.y * GS), kunst: `<g transform="scale(${GS})">${flaeche(-4, -7.2, 6.6, 7.8, 0.6)}</g>`,
        tipp: "Das „Ferro“ vorn hat sechs Zacken – für die sechs Stadtteile von Venedig." },
      { id: "ruder", de: "das Ruder", syl: "RU-der", it: "il remo", itSyl: "RE-mo", en: "oar", x: r(GX + fx * GS), y: r(GY - 4.4 * GS), kunst: `<g transform="scale(${GS})">${flaeche(-4, -6, 11, 6.6, 0.6)}</g>`,
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
  S.teil({ id: "gondoliere", de: "der Gondoliere", syl: "gon-do-LIE-re", it: "il gondoliere", itSyl: "gon-do-LIE-re", en: "gondolier", x: GOND.fussX, y: GOND.fussY, kunst: svg,
    tipp: "Der Gondoliere rudert im Stehen. Er trägt ein gestreiftes Hemd und einen Strohhut mit Band.",
    zoom: { x: GOND.fussX - 18, y: GOND.fussY - 26, w: 36, h: 24 },
    unter: [
      { id: "strohhut", de: "der Strohhut", syl: "STROH-hut", it: "il cappello di paglia", itSyl: "cap-PEL-lo di PA-glia", en: "straw hat", x: GOND.fussX + kopf.x, y: GOND.fussY + kopf.y - 0.4,
        kunst: flaeche(-1.6, -1.8, 3.2, 1.9, 0.4) },
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
   14 — DAS UFER von San Giorgio (Istrischer Stein, Trachytplatten)
   ===================================================================== */
{
  let k = `<rect x="0" y="${UFER}" width="400" height="${260 - UFER}" fill="${S.lg("masegni", [[0, "#8c8a86"], [1, "#6c6a66"]])}"/>`;
  for (const y of [248.6, 254.8]) k += `<line x1="0" y1="${y}" x2="400" y2="${y}" stroke="#55534f" stroke-width=".35"/>`;
  for (let i = -12; i <= 12; i++) k += `<line x1="${r(200 + i * 13)}" y1="${UFER + 3}" x2="${r(200 + i * 15.6)}" y2="260" stroke="#55534f" stroke-width=".3"/>`;
  for (let i = 0; i < 60; i++) k += `<rect x="${r(rnd() * 400)}" y="${r(UFER + 3.4 + rnd() * 15)}" width="${r(1 + rnd() * 3)}" height=".35" fill="#9a9792" opacity=".5"/>`;
  k += `<rect x="0" y="${UFER - 0.6}" width="400" height="3.6" fill="${S.lg("kante", [[0, "#fbf7ee"], [1, "#d8cfbf"]])}"/>`;
  k += `<rect x="0" y="${UFER + 2.8}" width="400" height=".6" fill="#4b4945" opacity=".6"/>`;
  k += `<rect x="0" y="${UFER}" width="400" height="${260 - UFER}" fill="${S.lg("uferlicht", [[0, "#ffe2b0", 0.18], [0.6, "#ffe2b0", 0], [1, "#000", 0.08]], 0, 0, 1, 0)}"/>`;
  S.teil({ id: "ufer", de: "das Ufer", syl: "U-fer", it: "la riva", itSyl: "RI-va", en: "waterfront", x: 0, y: 0, kunst: k,
    tipp: "Wir stehen am Ufer der Insel San Giorgio Maggiore und schauen über das Wasser zum Markusplatz." });
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
  const k = taube(262, 252.4, 0.88, true) + taube(279, 249.8, 0.82, false) + taube(297, 256.4, 0.92, false);
  S.teil({ oben: true, id: "taube", de: "die Taube", syl: "TAU-be", it: "il piccione", itSyl: "pic-CIO-ne", en: "pigeon", x: 0, y: 0, kunst: k,
    tipp: "Auf dem Markusplatz darf man die Tauben nicht mehr füttern." });
}

/* =====================================================================
   16 — DIE TOURISTIN (zeigt ihre Maske für ein Foto) und 17 — DIE MASKE
   ===================================================================== */
const TOUR = { x: 352, y: 255.6 };   /* 29 m vor uns: 26,4 je Meter */
let tourHand = null, tourKopf = null;
{
  const m = B.mensch({ id: "ven_tour", geschlecht: "w", blick: -22, frisur: "lang", haarfarbe: "hellbraun", haut: "hell", laecheln: true,
    pose: { lende: 1, brust: -2, nacken: 4, kopf: -4, schulterL: { vor: 3, seit: 7 }, ellbogenL: 14, unterarmL: 10, handL: 6, fingerL: 0.38,
      schulterR: { vor: 70, seit: 18, dreh: 20 }, ellbogenR: 120, unterarmR: 40, handR: 10, fingerR: 0.62,
      huefteL: { vor: 4, seit: 3, dreh: -6 }, knieL: 3, fussL: 0, huefteR: { vor: -3, seit: 2.5, dreh: -6 }, knieR: 2, fussR: 0 },
    kleidung: { kleid: { stueck: "sommerkleid", farbe: "#2f7f9a" }, schuhe: { stueck: "sandale", farbe: "braun" } } }, 43.6);
  tourHand = { x: TOUR.x + m.z.handR.x * m.k, y: TOUR.y + m.z.handR.y * m.k };
  tourKopf = { x: TOUR.x + m.z.kopf.x * m.k, y: TOUR.y + m.z.kopf.y * m.k };
  S.teil({ id: "touristin", de: "die Touristin", syl: "tou-RIS-tin", it: "la turista", itSyl: "tu-RI-sta", en: "tourist", x: TOUR.x, y: TOUR.y, kunst: schatten(0, 0.3, 7, 1.2, 0.3) + m.svg,
    tipp: "Die Touristin hat eine Maske gekauft und lässt sich damit fotografieren." });
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
