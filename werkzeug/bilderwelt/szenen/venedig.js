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
   - LEBEN (Runde 3): der Molo ist die belebteste Uferpromenade der Welt:
     Spaziergänger in Gruppen (dicht vor dem Palast und an den Säulen),
     Laternen, weiße Souvenirstände (Bancarelle) an der Riva; im Bacino
     ein Wassertaxi (lackiertes Mahagoni, weißes Kabinendach) und eine
     zweite Gondel; Fahrgäste im Vaporetto.
   - DETAILS: auf der Ostseite des Würfels am Campanile die thronende
     Venezia (Löwe und Venezia wechseln sich an den vier Seiten ab); der
     Engel als Wetterfahne mit Flügelpaar und ausgestrecktem Arm; die
     Markusfahne mit Löwe, Nimbus und Buch; der Balkon von 1404 als hoher
     Tabernakel mit Fialen und Justitia obenauf, an der SO-Ecke die
     Trunkenheit Noahs mit Weinstock; die Kuppeln von San Marco überhöht
     mit großen Zwiebel-Laternen. Unsicher (ohne Quelle geprüft): die
     genaue Zahl der Nischenfiguren am Balkon und die Pose der Venezia.
   - LICHT: später Nachmittag, die Sonne steht im Westsüdwesten (links,
     außerhalb des Bildes): die Südfassaden glühen orange, die Arkaden
     bleiben kühl violett; Schatten fallen nach rechts hinten (Säulen auf
     dem Pflaster, Kind und Touristin am Ufer); ein breiter Glitzerpfad
     läuft von links über das Wasser. Spiegelungen: die gespiegelten
     Umrisse, gestaucht, dunkler und kühler, von Wellen zerrissen.
   Maßstab: Horizont y = 150 (Bild), Auge ≈ 5 m über dem Wasser. Am Molo
   (450 m) 1,7 Einheiten je Meter; Wassertaxi in 250 m, zweite Gondel in
   137 m, Gondel in 60 m, Haltestelle in 46 m, die Touristin in 29 m.
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
const kompakt = (svg, Q = 1) => {
  const rund = (n) => { const v = Math.round(+n / Q) * Q; return String(v === 0 ? 0 : v); };
  return svg.replace(/ d="([^"]+)"/g, (a, p) => ` d="${p.replace(/-?\d*\.?\d+/g, rund)}"`)
    .replace(/ (x|y|x1|y1|x2|y2|cx|cy|fx|fy)="(-?\d*\.?\d+)"/g, (a, k, n) => ` ${k}="${rund(n)}"`);
};
const F = 765;               /* 1,7 je Meter in 450 m; Auge 5 m über dem Wasser, 4 m über dem Ufer */
const wl = (d) => r(HOR + 5 * F / d);

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("spiegel")}" x="-10%" y="-20%" width="120%" height="140%"><feGaussianBlur stdDeviation=".9 .35"/></filter>`);
/* Stoffe */
const ISTRIA = S.lg("istria", [[0, "#fbf6ec"], [1, "#e2d8c6"]]);
const ISTRIA_S = S.lg("istrias", [[0, "#cfc4b2"], [1, "#b2a693"]]);
const ZIEGEL = S.lg("ziegel", [[0, "#cf7a5c"], [0.6, "#bb664b"], [1, "#a8563f"]], 0, 0, 1, 0);
const ZIEGEL_S = S.lg("ziegels", [[0, "#8a4535"], [1, "#6f372b"]], 0, 0, 1, 0);
const KUPFER = S.lg("kupfer", [[0, "#9ccbb3"], [1, "#6aa38a"]]);
const KUPFER_S = S.lg("kupfers", [[0, "#5d8f7a"], [1, "#3f6b5a"]]);
const BLEI = S.lg("blei", [[0, "#d7d9d6"], [0.45, "#b5b9b8"], [1, "#7c8285"]], 0, 0, 1, 0);
const GOLD = S.lg("gold", [[0, "#fff3b0"], [0.45, "#f0c64a"], [1, "#a8760f"]], 0, 0, 1, 1);
const DUNKEL = "#463e54";   /* Schatten in Arkaden und Fenstern */
/* Rautenmuster des Dogenpalasts: weißer Istrischer Stein und rosa Veroneser Marmor */
S.def(`<pattern id="${S.id("raute")}" patternUnits="userSpaceOnUse" width="3.2" height="2.6"><rect width="3.2" height="2.6" fill="#f0c3ad"/><path d="M1.6 0 L3.2 1.3 L1.6 2.6 L0 1.3 Z" fill="#dc9a84" stroke="#fbf1e6" stroke-width=".42"/><path d="M1.6 .75 L2.25 1.3 L1.6 1.85 L.95 1.3 Z" fill="#f3d9cc"/></pattern>`);
/* Ringelhemd des Gondoliere (in Figur-Zentimetern) */
S.def(`<pattern id="${S.id("ringel")}" patternUnits="userSpaceOnUse" width="200" height="10"><rect width="200" height="4.6" fill="#1d2f5e"/></pattern>`);

/* =====================================================================
   KULISSE — Abendhimmel, Dunst, Zecca, Piazzetta-Tiefe, Riva, Molo
   ===================================================================== */
/* Abendhimmel: oben rechts kühler, gedämpftes Blau; links unten warm (Pfirsich bis Gold) */
S.hinten(`<rect width="400" height="${WASSER + 2}" fill="${S.lg("himmel", [[0, "#7a9cc2"], [0.4, "#a9bfd4"], [0.75, "#e6d4c0"], [1, "#f4d9b6"]])}"/>`);
/* die tiefe Sonne steht links außerhalb des Bildes */
S.hinten(`<rect width="400" height="${WASSER + 2}" fill="${S.rg("sonne", [[0, "#ffe7b4", 0.9], [0.4, "#ffd99a", 0.4], [1, "#ffd99a", 0]], 0, 0.68, 0.85)}"/>`);
{
  /* Abend-Cumuli: unregelmäßige, ausgefranste Ränder (Wellenverschiebung),
     flache, kühl-violette Unterseite, die Sonnenseite links golden.
     Am Horizont lange, ausgefranste Altostratus-Bänder und zarte Schleier. */
  S.def(`<filter id="${S.id("wolke")}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation=".45"/></filter>`);
  S.def(`<filter id="${S.id("band")}" x="-10%" y="-300%" width="120%" height="700%"><feTurbulence type="fractalNoise" baseFrequency=".05 .6" numOctaves="2" seed="5"/><feDisplacementMap in="SourceGraphic" scale="5" xChannelSelector="R" yChannelSelector="G"/><feGaussianBlur stdDeviation=".6"/></filter>`);
  const LICHT = S.lg("wolkelicht", [[0, "#ffe8c4"], [0.45, "#fbeee4"], [1, "#e8e2ec"]], 0, 0, 400, 0, ' gradientUnits="userSpaceOnUse"');
  let wz = 0;
  const WF = ["#b4a3bd", "#e8d6d2", LICHT];
  const wolke = (x, y, w, h, seed) => {
    /* unregelmäßige Türme, flache Basis; drei scharfe Tonstufen: kühle
       Unterseite (innen, an der Schattenseite weich), Halbton, Licht links oben */
    const z = B.zufall(seed), c = [];
    const tuerme = Array.from({ length: 2 + Math.floor(z() * 2) }, () => [z() * 0.8 + 0.1, 0.55 + z() * 0.45, 0.12 + z() * 0.12]);
    const hoehe = (t) => Math.max(0.28, ...tuerme.map(([m, a, s]) => a * Math.exp(-((t - m) ** 2) / (2 * s * s)))) * Math.pow(Math.sin(Math.PI * Math.min(1, Math.max(0, t))), 0.35);
    const n = Math.max(3, Math.round(w / 2.4));
    for (let i = 0; i < n; i++) { const t = (i + 0.5) / n, hh = hoehe(t) * h, rr = Math.max(1.1, hh * (0.24 + z() * 0.1)); c.push([x - w / 2 + t * w + (z() - 0.5) * 1.2, y - hh + rr, rr]); }
    for (let i = 0; i < n; i += 2) { const t = (i + 0.5) / n, hh = hoehe(t) * h; c.push([x - w / 2 + t * w, y - hh * 0.45, hh * 0.45]); }
    const mm = Math.max(3, Math.round(w / (h * 0.32))); for (let i = 0; i < mm; i++) { const t = (i + 0.5) / mm, rr = h * (0.2 + 0.12 * Math.sin(Math.PI * t)); c.push([x - w / 2 + t * w, y - rr * 0.55, rr]); }
    for (const [a, b, rr] of c.slice(0, n)) for (let k = 0; k < 2; k++) { const an = -Math.PI * (0.2 + z() * 0.6); c.push([a + Math.cos(an) * rr * 0.8, b + Math.sin(an) * rr * 0.8, rr * (0.3 + z() * 0.25)]); }
    const id = S.id("wk" + wz++), cy0 = y - h * 0.5;
    S.def(`<clipPath id="${id}c"><rect x="${r(x - w)}" y="${r(y - h * 3)}" width="${r(w * 2)}" height="${r(h * 3)}"/></clipPath><g id="${id}">${c.map(([a, b, rr]) => `<circle cx="${r(a)}" cy="${r(b)}" r="${r(rr)}"/>`).join("")}</g>`);
    const lage = (dx, dy, f, fill, extra = "") => `<use href="#${id}" fill="${fill}" transform="translate(${r(x + dx)} ${r(cy0 + dy)}) scale(${f}) translate(${r(-x)} ${r(-cy0)})"${extra}/>`;
    return `<g clip-path="url(#${id}c)">${lage(0, 0, 1, WF[0], ` filter="url(#${S.id("wolke")})"`)}${lage(-0.4, -1.8, 0.93, WF[1])}${lage(-1.2, -3.6, 0.8, WF[2])}</g>`;
  };

  S.hinten(wolke(64, 42, 58, 30, 11) + wolke(336, 54, 48, 25, 37) + wolke(230, 78, 22, 7, 23) + wolke(152, 86, 16, 5, 41) + wolke(292, 90, 12, 3.6, 53));
  /* flache, ausgefranste Bänder über dem Horizont: links golden, rechts kühl */
  let band = "";
  for (const [x, y, w, h, c] of [[46, 112, 84, 1.7, "#ffe2b8"], [126, 119, 52, 1.2, "#fbe0c4"], [252, 108, 96, 1.6, "#ecdcd8"], [338, 117, 64, 1.3, "#dcd6e2"], [196, 125, 42, 0.9, "#f4dccb"]]) band += `<path d="M${x - w / 2} ${y} Q${x - w / 4} ${r(y - h)} ${x} ${r(y - h * 0.6)} Q${x + w / 4} ${r(y - h)} ${x + w / 2} ${y} Q${x} ${r(y + h * 0.9)} ${x - w / 2} ${y} Z" fill="${c}" opacity=".8"/>`;
  /* zarte Schleier, fast wie Kondensstreifen */
  band += `<path d="M150 84 Q220 79 300 82" stroke="#f6eee8" stroke-width=".7" fill="none" opacity=".5"/><path d="M20 96 Q70 92 130 95" stroke="#fff0dc" stroke-width=".6" fill="none" opacity=".45"/>`;
  S.hinten(`<g filter="url(#${S.id("band")})">${band}</g>`);
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
  k += `<rect x="-2" y="104" width="29" height="${r(MOLO - 104)}" fill="${S.lg("zeccalicht", [[0, "#ffb466", 0.32], [1, "#000", 0.08]], 0, 0, 1, 0)}"/>`;
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
  let k = `<rect x="227" y="100" width="16" height="${r(MOLO - 100)}" fill="${S.lg("rio", [[0, "#b8ac9b"], [0.7, "#9a8e7e"], [1, "#4a4244"]])}"/>`;
  for (const y of [106, 112, 118]) k += `<path d="M233 ${y} H238.4" stroke="#d6ccbb" stroke-width=".35"/><rect x="234.2" y="${y + 1.2}" width="1" height="2.2" fill="#6e6458"/><rect x="236.4" y="${y + 1.2}" width="1" height="2.2" fill="#6e6458"/>`;
  k += `<path d="M227 99 L233 102.4 L233 ${MOLO} L227 ${MOLO} Z" fill="${S.lg("ostwand", [[0, "#e2d8ca"], [1, "#c3b6a5"]], 0, 0, 1, 0)}"/>`;
  for (const y of [104.6, 111.4, 118.4, 124.6]) k += `<path d="M227 ${y} L233 ${r(y + 1.6)}" stroke="#f3ece0" stroke-width=".45"/>`;
  for (const [y, h] of [[105.6, 3.6], [112.4, 4], [119.4, 3.4], [125.6, 3]]) for (const x of [227.6, 229.4, 231.2]) k += `<path d="M${x} ${r(y + 0.6 + (x - 227) * 0.27)} q.5 -.7 1 -.4" stroke="#f6f0e6" stroke-width=".3" fill="none"/>`;
  for (const [y, h] of [[105.6, 3.6], [112.4, 4], [119.4, 3.4], [125.6, 3]]) for (const x of [227.6, 229.4, 231.2]) k += `<path d="M${x} ${r(y + (x - 227) * 0.27)} l1.4 .4 l0 ${h} l-1.4 -.4 Z" fill="#544a49"/>`;
  k += `<path d="M243 103 L238.4 105 L238.4 ${MOLO} L243 ${MOLO} Z" fill="${S.lg("prigwest", [[0, "#b3a796"], [1, "#988c7c"]], 0, 0, 1, 0)}"/>`;
  for (const y of [107, 113.6, 120.2]) k += `<path d="M238.4 ${r(y - 1.2)} L243 ${r(y - 1.6)}" stroke="#d3c9b8" stroke-width=".35"/><rect x="239.6" y="${y}" width="1.4" height="2.6" fill="#5e564e"/><rect x="241.4" y="${r(y - 0.2)}" width="1.2" height="2.6" fill="#5e564e"/>`;
  k += `<rect x="233" y="${r(MOLO - 2.6)}" width="5.4" height="2.8" fill="#2f4446"/><path d="M233.6 ${r(MOLO - 1.6)} l3.8 0 M234.4 ${r(MOLO - 0.8)} l2.4 0" stroke="#bcd3cf" stroke-width=".25" opacity=".8"/>`;
  S.hinten(G(k));
}

/* Riva degli Schiavoni: Palazzo Dandolo (Hotel Danieli) und die Nachbarhäuser.
   Nach rechts kommen sie näher an San Giorgio heran: etwas größer, Fuß tiefer. */
{
  let k = "";
  const haus = (x0, x1, top, fuss, farbe, gotisch, kamine) => {
    let g = `<rect x="${x0}" y="${top}" width="${x1 - x0}" height="${r(fuss - top)}" fill="${farbe}"/>`;
    g += `<rect x="${x0}" y="${top}" width="${x1 - x0}" height="${r(fuss - top)}" fill="${S.lg("hauslicht", [[0, "#ffb466", 0.3], [1, "#000", 0.1]], 0, 0, 1, 0)}"/>`;
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
  {
    /* Ostseite (verkürzt, im Schatten): die thronende Venezia mit Schwert und Waage */
    const vx = CX + 2.45, vt = y(69.4);
    const v = (dx, dy) => `${r(vx + dx)} ${r(vt + dy)}`;
    let g = `<rect x="${r(CX + 0.45)}" y="${r(vt)}" width="3.9" height="${r(6.6 * s)}" fill="#9b8572" stroke="#7f6a58" stroke-width=".18"/>`;
    g += `<path d="M${v(-1.6, 6.1)} L${v(-1.6, 4.6)} L${v(1.6, 4.6)} L${v(1.6, 6.1)} Z" fill="#86705d"/>`;
    g += `<path d="M${v(-0.5, 2)} L${v(0.5, 2)} L${v(1.3, 5.6)} Q${v(0, 6)} ${v(-1.3, 5.6)} Z" fill="#7c6653"/><path d="M${v(-0.2, 2.4)} L${v(-0.5, 5.4)} M${v(0.3, 2.6)} L${v(0.6, 5.4)}" stroke="#a8927e" stroke-width=".1"/>`;
    g += `<circle cx="${r(vx)}" cy="${r(vt + 1.5)}" r=".42" fill="#7c6653"/><path d="M${v(-0.4, 1.15)} l.1 -.45 l.2 .22 l.1 -.3 l.1 .3 l.2 -.22 l.1 .45 Z" fill="#a8927e"/>`;
    g += `<path d="M${v(0.5, 2.6)} L${v(1.5, 0.8)}" stroke="#6c5746" stroke-width=".16"/><path d="M${v(-0.5, 2.6)} L${v(-1.2, 1.4)} M${v(-1.6, 1.4)} L${v(-0.8, 1.4)} M${v(-1.6, 1.4)} l-.15 .5 h.4 Z M${v(-0.8, 1.4)} l-.15 .5 h.4 Z" stroke="#6c5746" stroke-width=".1" fill="none"/>`;
    k += g;
  }
  k += `<rect x="${r(L - 0.4)}" y="${y(71)}" width="${r(R - L + 0.8)}" height=".8" fill="#f6f0e4"/>`;
  /* Abendglut auf der Südseite (Sonne im Westsüdwesten) */
  k += `<rect x="${L}" y="${y(71)}" width="${r(CX - L)}" height="${r(71 * s)}" fill="${S.lg("campglut", [[0, "#ffb05c", 0.34], [1, "#ff8a3c", 0.12]])}"/>`;
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
  /* zwei gestaffelte Flügel mit Schwungfedern (hinten dunkler) */
  k += `<path d="M${e(-0.2, -4.3)} Q${e(-1.2, -6.2)} ${e(-1.6, -8.4)} L${e(-1.9, -7.6)} L${e(-2.3, -7.7)} L${e(-2.2, -6.9)} L${e(-2.7, -6.8)} L${e(-2.3, -6.1)} L${e(-2.7, -5.8)} L${e(-2, -5.3)} L${e(-2.1, -4.8)} L${e(-0.9, -3.9)} Z" fill="#c8962a" stroke="#8a5e0c" stroke-width=".07"/>`;
  k += `<path d="M${e(-0.1, -4.1)} Q${e(-1.4, -5.1)} ${e(-3.6, -6.9)} L${e(-3.3, -6.2)} L${e(-3.8, -6)} L${e(-3.2, -5.4)} L${e(-3.6, -5)} L${e(-2.8, -4.7)} L${e(-3, -4.2)} L${e(-2, -4)} L${e(-2.1, -3.5)} L${e(-0.6, -3.3)} Z" fill="${GOLD}" stroke="#8a5e0c" stroke-width=".07"/>`;
  k += `<path d="M${e(-0.8, -4.3)} L${e(-3, -6.1)} M${e(-0.8, -3.9)} L${e(-2.7, -4.9)} M${e(-0.7, -3.6)} L${e(-2, -3.9)}" stroke="#a8760f" stroke-width=".06"/>`;
  k += `<path d="M${e(-0.6, -0.7)} Q${e(-0.8, -2.6)} ${e(-0.5, -4.4)} L${e(0.4, -4.4)} Q${e(0.7, -2.6)} ${e(0.7, -0.7)} Z" fill="${GOLD}"/>`;
  k += `<path d="M${e(-0.3, -1.2)} Q${e(0, -2.6)} ${e(-0.1, -4)}" stroke="#a8760f" stroke-width=".1" fill="none"/>`;
  k += `<circle cx="${r(ax - 0.05)}" cy="${r(ay - 4.95)}" r=".5" fill="${GOLD}"/>`;
  k += `<path d="M${e(-0.5, -4.7)} Q${e(-0.6, -5.6)} ${e(0.1, -5.5)} Q${e(-0.2, -5.1)} ${e(-0.25, -4.55)} Z" fill="#b07f14"/><circle cx="${r(ax + 0.22)}" cy="${r(ay - 5.02)}" r=".07" fill="#6e4a08"/><path d="M${e(0.42, -4.95)} l.14 .12 l-.12 .05" stroke="#a8760f" stroke-width=".05" fill="none"/>`;
  k += `<circle cx="${r(ax - 0.1)}" cy="${r(ay - 5.05)}" r=".75" fill="none" stroke="#ffe48a" stroke-width=".08" opacity=".8"/>`;
  k += `<path d="M${e(0.3, -4.1)} L${e(2.2, -4.9)}" stroke="#d9a92e" stroke-width=".32" stroke-linecap="round"/><circle cx="${r(ax + 2.3)}" cy="${r(ay - 4.95)}" r=".2" fill="${GOLD}"/><path d="M${e(-0.3, -4)} L${e(-0.6, -2.8)}" stroke="#d9a92e" stroke-width=".28" stroke-linecap="round"/>`;
  /* Loggetta am Fuß (rotbrauner Marmor, drei Bögen) */
  const lx = CX + 1;
  k += `<rect x="${lx}" y="${r(FUSS - 8.2)}" width="13" height="8.2" fill="${S.lg("loggetta", [[0, "#b9786a"], [1, "#9a5d50"]])}"/>`;
  for (let i = 0; i < 3; i++) k += `<path d="M${r(lx + 1.2 + i * 4)} ${FUSS} L${r(lx + 1.2 + i * 4)} ${r(FUSS - 3.6)} Q${r(lx + 2.4 + i * 4)} ${r(FUSS - 5)} ${r(lx + 3.6 + i * 4)} ${r(FUSS - 3.6)} L${r(lx + 3.6 + i * 4)} ${FUSS} Z" fill="#4a3530"/>`;
  for (let i = 0; i < 4; i++) k += `<rect x="${r(lx + 0.3 + i * 4)}" y="${r(FUSS - 6)}" width=".6" height="6" fill="#efe7da"/>`;
  k += `<rect x="${r(lx - 0.3)}" y="${r(FUSS - 8.9)}" width="13.6" height=".9" fill="#efe7da"/>`;
  S.teil({ id: "campanile", de: "der Campanile", syl: "cam-pa-NI-le", it: "il campanile", itSyl: "cam-pa-NI-le", en: "bell tower",
    x: 0, y: 0, kunst: G(k), tipp: "Der Campanile ist fast 99 Meter hoch, oben hängen fünf Glocken. 1902 stürzte er ein – er wurde genau so wieder aufgebaut.",
    zoom: Z({ x: 70, y: 22, w: 58, h: 56 }),
    unter: [
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
    const hh = w * 0.9;
    g += `<path d="M${r(x - w / 2)} ${r(top + hh)} C${r(x - w / 2)} ${r(top + hh * 0.3)} ${r(x - w * 0.3)} ${r(top - 0.4)} ${r(x)} ${r(top)} C${r(x + w * 0.3)} ${r(top - 0.4)} ${r(x + w / 2)} ${r(top + hh * 0.3)} ${r(x + w / 2)} ${r(top + hh)} Z" fill="${BLEI}"/>`;
    for (const t of [-0.36, -0.22, -0.08, 0.08, 0.22, 0.36]) g += `<path d="M${r(x + t * w * 1.3)} ${r(top + hh)} Q${r(x + t * w * 1.25)} ${r(top + hh * 0.2)} ${r(x)} ${r(top + 0.1)}" stroke="#8d9396" stroke-width=".18" fill="none"/>`;
    g += `<path d="M${r(x - w * 0.38)} ${r(top + hh * 0.75)} C${r(x - w * 0.38)} ${r(top + hh * 0.25)} ${r(x - w * 0.2)} ${r(top + 0.6)} ${r(x - 0.4)} ${r(top + 0.3)}" stroke="#f4f5f2" stroke-width=".55" opacity=".7" fill="none"/>`;
    /* Laterne ≈ ⅓ der Kuppelhöhe: runde Trommel mit Bogenöffnungen, kleine
       Zwiebel, vergoldete Kugel, Kreuz */
    const lw = w * 0.16;
    g += `<rect x="${r(x - lw / 2)}" y="${r(top - lw * 1.05)}" width="${r(lw)}" height="${r(lw * 1.15)}" fill="#d8d0c2"/><rect x="${r(x - lw * 0.58)}" y="${r(top - lw * 1.15)}" width="${r(lw * 1.16)}" height="${r(lw * 0.18)}" fill="#efe8dc"/>`;
    for (const t of [-0.3, 0.05]) g += `<path d="M${r(x + t * lw)} ${r(top - lw * 0.1)} l0 ${r(-lw * 0.6)} q${r(lw * 0.11)} ${r(-lw * 0.2)} ${r(lw * 0.22)} 0 l0 ${r(lw * 0.6)} Z" fill="#4e443f"/>`;
    g += `<path d="M${r(x - lw * 0.55)} ${r(top - lw * 1.15)} Q${r(x - lw * 0.75)} ${r(top - lw * 1.7)} ${r(x)} ${r(top - lw * 2.3)} Q${r(x + lw * 0.75)} ${r(top - lw * 1.7)} ${r(x + lw * 0.55)} ${r(top - lw * 1.15)} Z" fill="${BLEI}"/>`;
    g += `<circle cx="${r(x)}" cy="${r(top - lw * 2.5)}" r="${r(lw * 0.24)}" fill="${GOLD}"/>`;
    g += `<path d="M${r(x)} ${r(top - lw * 2.7)} L${r(x)} ${r(top - lw * 3.7)} M${r(x - lw * 0.3)} ${r(top - lw * 3.35)} L${r(x + lw * 0.3)} ${r(top - lw * 3.35)}" stroke="#d9a92e" stroke-width="${gross ? 0.36 : 0.3}"/>`;
    return g;
  };
  /* über die Palastbreite verteilt (≈ 25–28 m Abstand): West, Mitte, Ost;
     die Nordkuppel halb hinter, die Südkuppel halb vor der Hauptkuppel */
  k += kuppel(147, 83.6, 12.6) + kuppel(176, 81.6, 12) + kuppel(180, 79.4, 15.6, true) + kuppel(212, 83.8, 12.8) + kuppel(184.6, 86.4, 12.6);
  S.teil({ id: "markusdom", de: "der Markusdom", syl: "MAR-kus-dom", it: "la Basilica di San Marco", itSyl: "ba-SI-li-ca di san MAR-co", en: "St Mark's Basilica",
    x: 0, y: 0, kunst: G(k), tipp: "Der Markusdom hat fünf große Kuppeln. Innen glänzen goldene Mosaiken.",
    zoom: Z({ x: 136, y: 68, w: 90, h: 36 }),
    unter: [
      { id: "kuppel", de: "die Kuppel", syl: "KUP-pel", it: "la cupola", itSyl: "CU-po-la", en: "dome", x: 212, y: 94, kunst: flaeche(-7, -12, 14, 12),
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
  k += `<path d="M${x0} ${sy(x0, T)} L${x1} ${T} L${x1} ${MOLO} L${x0} ${MOLO} Z" fill="${S.lg("libstirn", [[0, "#ff9e4c", 0.3], [1, "#ffb466", 0.38]], 0, 0, 1, 0)}"/>`;
  /* die lange Seite zur Piazzetta, perspektivisch (21 Joche, fern kleiner) */
  const wA = 455, wB = 700, TE = 109.6, ME = 120.8, FE = 130.6;
  const P = (t, a, b) => (a * wA * (1 - t) + b * wB * t) / (wA * (1 - t) + wB * t);
  const xs = (t) => P(t, x1, 92), top = (t) => P(t, T, TE), fuss = (t) => P(t, MOLO, FE), mitte = (t) => P(t, 117, ME);
  k += `<path d="M${x1} ${T} L92 ${TE} L92 ${FE} L${x1} ${MOLO} Z" fill="${S.lg("libs", [[0, "#cdc1ae"], [1, "#c1b6a6"]], 0, 0, 1, 0)}"/>`;
  for (let i = 0; i < 21; i++) {
    const a = i / 21, b = (i + 0.62) / 21, c = (i + 0.31) / 21;
    const xa = r(xs(a) + 0.35), xb = r(xs(b) + 0.35), xm = r(xs(c) + 0.35);
    k += `<path d="M${xa} ${r(fuss(a))} L${xa} ${r(mitte(a) + (fuss(a) - mitte(a)) * 0.42)} Q${xm} ${r(mitte(c) + (fuss(c) - mitte(c)) * 0.18)} ${xb} ${r(mitte(b) + (fuss(b) - mitte(b)) * 0.42)} L${xb} ${r(fuss(b))} Z" fill="#5a4b43"/>`;
    k += `<path d="M${xa} ${r(mitte(a) - 1.3)} L${xa} ${r(top(a) + (mitte(a) - top(a)) * 0.5)} Q${xm} ${r(top(c) + (mitte(c) - top(c)) * 0.32)} ${xb} ${r(top(b) + (mitte(b) - top(b)) * 0.5)} L${xb} ${r(mitte(b) - 1.3)} Z" fill="#6a5a50"/>`;
    if (i % 2 === 0) { const f = 1 - c * 0.35; k += `<path d="M${r(xs(c) - 0.3 * f)} ${r(top(c) - 1.5)} l${r(0.15 * f)} ${r(-2.4 * f)} q${r(0.3 * f)} ${r(-0.8 * f)} ${r(0.6 * f)} 0 l${r(0.15 * f)} ${r(2.4 * f)} Z" fill="#e6dccb"/><circle cx="${r(xs(c))}" cy="${r(top(c) - 1.5 - 3.1 * f)}" r="${r(0.32 * f)}" fill="#e6dccb"/>`; }
  }
  k += `<path d="M${x1} ${r(117)} L92 ${ME}" stroke="#f3ecdf" stroke-width=".6"/><path d="M${x1} ${T + 3} L92 ${r(TE + 2.2)}" stroke="#efe7d8" stroke-width="1.1"/>`;
  k += `<path d="M${x1} ${T - 1.6} L92 ${r(TE - 1.1)} L92 ${TE} L${x1} ${T} Z" fill="#efe7d8"/>`;
  k += `<path d="M91.4 ${r(TE - 1.1)} L92 ${r(TE - 5)} L92.6 ${r(TE - 1.1)} Z" fill="#e1d8c6"/><circle cx="92" cy="${r(TE - 5.3)}" r=".28" fill="#e1d8c6"/>`;
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
    k += `<path d="M${r(x + 0.42)} ${r(porT - 1.5)} L${r(x + 0.42)} ${r(logT + 4.6)} Q${r(x + 0.42)} ${r(logT + 3.4)} ${r(m)} ${r(logT + 2.9)} Q${r(x + lb - 0.42)} ${r(logT + 3.4)} ${r(x + lb - 0.42)} ${r(logT + 4.6)} L${r(x + lb - 0.42)} ${r(porT - 1.5)} Z" fill="${S.lg("loggiaschatten", [[0, "#463f5a"], [1, "#6a6079"]])}"/>`;
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
    k += `<path d="M${r(x + 0.85)} ${fuss} L${r(x + 0.85)} ${r(porT + 4.4)} Q${r(x + 0.9)} ${r(porT + 1.8)} ${r(m)} ${r(porT + 1)} Q${r(x + pb - 0.9)} ${r(porT + 1.8)} ${r(x + pb - 0.85)} ${r(porT + 4.4)} L${r(x + pb - 0.85)} ${fuss} Z" fill="${S.lg("portikus", [[0, "#2c2a3e"], [1, "#4f4864"]])}"/>`;
    if (i > 0) k += `<path d="M${r(x - 1.1)} ${r(porT + 3.6)} L${r(x + 1.1)} ${r(porT + 3.6)} L${r(x + 0.65)} ${r(porT + 4.8)} L${r(x - 0.65)} ${r(porT + 4.8)} Z" fill="#fbf6ec"/><rect x="${r(x - 0.75)}" y="${r(porT + 4.8)}" width="1.5" height="${r(fuss - porT - 4.8)}" fill="${S.lg("saeulchen", [[0, "#fffaf0"], [1, "#d9cdb9"]], 0, 0, 1, 0)}"/>`;
  }
  k += `<rect x="${x0}" y="${r(porT - 0.2)}" width="${W}" height=".7" fill="#fbf6ec"/>`;
  /* Ecken: Säule mit Skulptur (Adam und Eva links, Noah rechts) */
  for (const x of [x0 + 0.5, x1 - 0.5]) k += `<rect x="${r(x - 0.7)}" y="${porT}" width="1.4" height="${r(fuss - porT)}" fill="#fbf6ec"/>`;
  /* Eckskulpturen auf Höhe der Kapitelle: links Adam und Eva, rechts die Trunkenheit Noahs */
  k += `<path d="M${x0 + 0.1} ${porT + 4} l.25 -2.6 q.25 -.5 .5 0 l.25 2.6 Z M${x0 + 0.8} ${porT + 4} l.2 -2.3 q.25 -.5 .5 0 l.2 2.3 Z" fill="#ddd0bc"/>`;
  /* Trunkenheit Noahs: der liegende Noah, zwei Söhne, darüber der Weinstock (vergrößert, damit man sie liest) */
  k += `<g transform="translate(${x1 - 1.2} ${porT + 4.4}) scale(1.6) translate(${-(x1 - 1.2)} ${-(porT + 4.4)})">`;
  k += `<path d="M${x1 - 3.6} ${porT + 4.4} q.7 -1.3 2 -1 l1.4 .4 l-.1 .6 Z" fill="#f2eadc" stroke="#9a8c78" stroke-width=".12"/><circle cx="${r(x1 - 3.4)}" cy="${r(porT + 3.4)}" r=".45" fill="#f2eadc" stroke="#9a8c78" stroke-width=".1"/>`;
  k += `<path d="M${x1 - 1.4} ${porT + 4.4} l.15 -3 q.4 -.7 .8 0 l.15 3 Z M${x1 + 0.1} ${porT + 4.4} l.15 -2.8 q.4 -.7 .8 0 l.15 2.8 Z" fill="#f2eadc" stroke="#9a8c78" stroke-width=".12"/><circle cx="${r(x1 - 1)}" cy="${r(porT + 0.9)}" r=".42" fill="#f2eadc"/><circle cx="${r(x1 + 0.5)}" cy="${r(porT + 1.1)}" r=".42" fill="#f2eadc"/>`;
  k += `<path d="M${x1 - 3.4} ${porT + 1.4} q1.2 -1.2 2.4 -.4 q1.2 .8 2 -.4" stroke="#7d6e52" stroke-width=".25" fill="none"/>` + [[-2.8, 1.1], [-1.6, 0.8], [-0.4, 1.2], [0.6, 0.7]].map(([dx, dy]) => `<path d="M${r(x1 + dx)} ${r(porT + dy)} q.4 -.6 .8 0 q-.4 .5 -.8 0 Z" fill="#9fb38a"/>`).join("") + `<circle cx="${r(x1 - 1)}" cy="${r(porT + 1.9)}" r=".25" fill="#6b5a7a"/>`;
  k += `</g>`;
  /* Zinnen: weiße Blattzinnen mit Spitzen, Eck-Tabernakel */
  for (let x = x0 + 1.2; x < x1 - 1; x += 2.62) k += `<path d="M${r(x - 0.75)} ${top} L${r(x - 0.75)} ${r(top - 1.4)} Q${r(x)} ${r(top - 2.2)} ${r(x)} ${r(top - 3)} Q${r(x)} ${r(top - 2.2)} ${r(x + 0.75)} ${r(top - 1.4)} L${r(x + 0.75)} ${top} Z" fill="#fbf7ef"/><line x1="${r(x + 1.31)}" y1="${top}" x2="${r(x + 1.31)}" y2="${r(top - 1.3)}" stroke="#f3ecdf" stroke-width=".3"/>`;
  k += `<rect x="${x0}" y="${r(top - 0.2)}" width="${W}" height=".8" fill="#f6efe2"/>`;
  for (const x of [x0 + 0.6, x1 - 0.6]) k += `<rect x="${r(x - 1)}" y="${r(top - 4.6)}" width="2" height="4.6" fill="#fbf7ef"/><path d="M${r(x - 1.1)} ${r(top - 4.6)} L${r(x)} ${r(top - 9.4)} L${r(x + 1.1)} ${r(top - 4.6)} Z" fill="#f1e9dc"/><rect x="${r(x - 0.4)}" y="${r(top - 3.8)}" width=".8" height="2.2" fill="#6e6060"/>`;
  /* Licht von links: die Fassade glüht, nach rechts etwas kühler */
  k += `<rect x="${x0}" y="${r(top + 0.6)}" width="${W}" height="${r(porT - top - 0.6)}" fill="${S.lg("abendglut", [[0, "#ff9440", 0.36], [0.5, "#ffad5c", 0.24], [1, "#ffbe74", 0.14]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${x0}" y="${porT}" width="${W}" height="${r(fuss - porT)}" fill="${S.lg("portglut", [[0, "#ff9a48", 0.2], [1, "#ffb060", 0.06]], 0, 0, 1, 0)}"/>`;
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
  k += `<rect x="${x0}" y="${T}" width="${x1 - x0}" height="${F - T}" fill="${S.lg("priglicht", [[0, "#ffa452", 0.26], [1, "#ffbe74", 0.08]], 0, 0, 1, 0)}"/>`;
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
  /* das Krokodil liegt quer unter seinen Füßen: Kopf mit Schnauze links, Schwanz rechts hochgerollt */
  let todaro = `<path d="M${q0(-3.2, -0.55)} L${q0(-2.3, -0.95)} L${q0(-3.3, -0.85)} L${q0(-2.4, -1.15)} Q${q0(-1.8, -1.3)} ${q0(-1.0, -1.1)} L${q0(1.4, -1.1)} Q${q0(2.4, -1)} ${q0(2.8, -0.7)} Q${q0(3.6, -0.8)} ${q0(3.8, -1.5)} Q${q0(4.1, -0.5)} ${q0(3, -0.25)} L${q0(-2.2, -0.3)} Z" fill="#d6cfc1" stroke="#8c867c" stroke-width=".12"/><path d="M${q0(-1.4, -0.3)} l-.3 .35 M${q0(-0.6, -0.3)} l.2 .35 M${q0(1, -0.3)} l-.2 .35 M${q0(1.8, -0.3)} l.3 .35" stroke="#8c867c" stroke-width=".2"/><path d="M${q0(-1, -1.1)} l.25 -.3 l.25 .3 l.25 -.3 l.25 .3 l.25 -.3 l.25 .3 l.25 -.3 l.25 .3" stroke="#a49c8e" stroke-width=".12" fill="none"/>`;
  todaro += `<path d="M${q0(-3.8, -0.3)} L${q0(-2.6, -0.4)}" stroke="#7d776d" stroke-width=".12"/><circle cx="${r(T0 - 2.6)}" cy="${r(110.2 - 0.75)}" r=".12" fill="#4a4540"/><path d="M${q0(-1.6, -0.1)} l-.2 .25 M${q0(1.4, -0.1)} l.2 .25 M${q0(-0.8, -0.95)} h2.2" stroke="#8c867c" stroke-width=".14"/>`;
  /* der Krieger frontal: Beine, Tunika, Brustpanzer, Kopf; Licht von links, Schatten kühl */
  todaro += `<path d="M${q0(-0.5, -1)} L${q0(-0.45, -2.6)} L${q0(0.45, -2.6)} L${q0(0.5, -1)} Z" fill="#e9e4da"/><path d="M${q0(-0.8, -2.4)} L${q0(0.8, -2.4)} L${q0(0.58, -3.4)} L${q0(-0.58, -3.4)} Z" fill="#f2eee6"/>`;
  todaro += `<path d="M${q0(-0.62, -3.4)} L${q0(0.62, -3.4)} L${q0(0.58, -4.75)} Q${q0(0, -5)} ${q0(-0.58, -4.75)} Z" fill="#f4f0e8"/><path d="M${q0(0.05, -1)} L${q0(0.05, -4.9)} L${q0(0.58, -4.75)} L${q0(0.8, -2.4)} L${q0(0.5, -1)} Z" fill="#a9aab3" opacity=".55"/>`;
  todaro += `<circle cx="${T0}" cy="${r(110.2 - 5.35)}" r=".46" fill="#f2eee6"/><path d="M${q0(0.05, -5.8)} a.46 .46 0 0 1 0 .9" fill="#aeb0b8" opacity=".6"/>`;
  todaro += `<path d="M${q0(0.55, -4.5)} L${q0(1.05, -3.7)}" stroke="#ece7de" stroke-width=".32" stroke-linecap="round"/><line x1="${r(T0 + 1.05)}" y1="${r(110.2 - 0.7)}" x2="${r(T0 + 1.2)}" y2="${r(110.2 - 7.6)}" stroke="#8c867c" stroke-width=".22"/><path d="M${q0(1.2, -7.6)} l-.22 .1 l.22 -1 l.22 1 Z" fill="#8c867c"/>`;
  todaro += `<path d="M${q0(-0.55, -4.4)} L${q0(-0.95, -3.6)}" stroke="#ece7de" stroke-width=".32" stroke-linecap="round"/><path d="M${q0(-1.6, -4.7)} L${q0(-0.4, -4.7)} L${q0(-0.4, -3)} Q${q0(-1, -2.1)} ${q0(-1.6, -3)} Z" fill="#e6e0d4" stroke="#8c867c" stroke-width=".12"/><circle cx="${r(T0 - 1)}" cy="${r(110.2 - 3.9)}" r=".2" fill="#b9b2a4"/>`;
  /* San Marco: der geflügelte Bronzelöwe nach Osten, wie am Campanile: Mähne,
     zwei gestaffelte Schwingen, die Vorderpfote auf dem Buch */
  const L0 = 124, q1 = (dx, dy) => `${r(L0 + dx)} ${r(110.2 + dy)}`;
  const BR = S.lg("bronzel", [[0, "#5d6a58"], [0.5, "#3a4438"], [1, "#22281f"]]);
  let loewe = `<path d="M${q1(-1.2, -2.6)} Q${q1(-2.8, -5.4)} ${q1(-1.6, -7.8)} Q${q1(-1.2, -5.8)} ${q1(0.2, -3.2)} Z" fill="#2c3429"/>`;
  loewe += `<path d="M${q1(-2.4, 0)} L${q1(-2.3, -1.6)} Q${q1(-2.4, -2.8)} ${q1(-1, -2.9)} L${q1(1.4, -2.9)} Q${q1(2.2, -2.8)} ${q1(2.3, -1.9)} L${q1(2.2, 0)} L${q1(1.6, 0)} L${q1(1.6, -1.2)} L${q1(-1.2, -1.2)} L${q1(-1.5, 0)} Z" fill="${BR}"/>`;
  loewe += `<path d="M${q1(2.2, -1.9)} L${q1(3.4, -1.7)} L${q1(3.5, -1.2)} L${q1(2.3, -1.2)} Z" fill="${BR}"/><path d="M${q1(2.4, -1.15)} L${q1(3.3, -1.35)} L${q1(3.3, -0.15)} L${q1(2.4, 0.05)} Z" fill="#f6eedb" stroke="#8a7c5c" stroke-width=".1"/><path d="M${q1(3.3, -1.35)} L${q1(4.2, -1.15)} L${q1(4.2, 0.05)} L${q1(3.3, -0.15)} Z" fill="#e8dfc8" stroke="#8a7c5c" stroke-width=".1"/><path d="M${q1(2.6, -0.85)} l.5 -.1 M${q1(2.6, -0.55)} l.5 -.1 M${q1(3.5, -1)} l.5 .1 M${q1(3.5, -0.7)} l.5 .1" stroke="#9a8c6c" stroke-width=".08"/>`;
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
/* vertäute Gondeln, zweite Gondel und Wassertaxi werden in der Lagune gebaut,
   aber als eigene Wörter gesetzt (die Lagune ist nur das offene Wasser) */
let GONDELN_MOLO = "", GONDEL2 = "", WASSERTAXI = "";
/* Wellenverschiebung für alle Spiegelungen: nur seitlich, in vielen dünnen
   Streifen, mit weichen Übergängen (keine Treppen) */
S.def(`<filter id="${S.id("welle")}" x="-8%" y="-10%" width="116%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".035 1.5" numOctaves="2" seed="9"/><feColorMatrix type="matrix" values="1 0 0 0 0  0 .4 0 0 .3  0 0 1 0 0  0 0 0 0 1"/><feDisplacementMap in="SourceGraphic" scale="3.6" xChannelSelector="R" yChannelSelector="G"/><feGaussianBlur stdDeviation=".25 .05"/></filter>`);
{
  const Y0 = Y(WASSER0 + 0.2);
  let k = `<rect x="0" y="${Y0}" width="400" height="${r(UFER - Y0 - 0.4)}" fill="${S.lg("wasser", [[0, "#93b4b1"], [0.1, "#78a3a0"], [0.5, "#4d8784"], [1, "#2b6466"]])}"/>`;
  /* Spiegelungen: EINE gespiegelte, gestauchte Kopie der Silhouetten (dunkler,
     kühler, Arkadenband dunkel, Campanile als Schaft), seitlich wellig
     verschoben und nach unten ausgeblendet; sie beginnt direkt an der
     Wasserlinie, die vertäuten Gondeln liegen davor */
  {
    const SQ = 0.62, TIEF = 26;
    const R = (x0, y0, x1, y1, c) => `<rect x="${x0}" y="${y0}" width="${r(x1 - x0)}" height="${r(y1 - y0)}" fill="${c}"/>`;
    let sp = "";
    sp += R(14, 103, 27, 131.2, "#a0988b") + R(14, 122.6, 27, 131.2, "#3d394b");
    sp += `<path d="M26 101 L50 101 L92 106 L92 131.2 L26 131.2 Z" fill="#a8998a"/>` + R(26, 118, 92, 131.2, "#3e394c");
    sp += R(89.6, 76, 104.2, 130.2, "#7a4a40") + R(89.4, 63, 104.4, 76, "#b8aa98") + R(89.6, 54, 104.2, 63, "#a48f7c") + `<path d="M89.4 54.2 L98.4 28 L104.4 54.2 Z" fill="#4b7064"/>`;
    sp += R(100, 122, 114, 131.2, "#7a564c") + R(85.2, 104, 86.8, 131.2, "#8f7a72") + R(123.2, 104, 124.8, 131.2, "#6e7174");
    sp += R(132, 95.4, 228, 111.8, "#c08f80") + R(132, 111.8, 228, 121.6, "#c6bcb2") + R(132, 121.6, 228, 131.2, "#373146");
    sp += `<path d="M${Array.from({ length: 16 }, (_, i) => r(132 + (i + 1) * 96 / 17)).map((x) => `${x} 125.4 V131.2`).join(" M")}" stroke="#8f8790" stroke-width="1.1"/>`;
    sp += R(227, 100, 243, 131.2, "#4b4850") + R(225, 125.6, 245, 131.2, "#c7c0b5");
    sp += R(243, 104, 297, 131.2, "#a69c8f") + R(243, 120.4, 297, 131.2, "#403a4a") + R(297, 100, 320, 131.8, "#8c4c42");
    S.def(`<mask id="${S.id("spmaske")}" maskUnits="userSpaceOnUse" x="-10" y="${WASSER0}" width="420" height="${TIEF + 2}"><rect x="-10" y="${WASSER0}" width="420" height="${TIEF}" fill="${S.lg("spfade", [[0, "#fff", 0.88], [0.22, "#fff", 0.6], [0.6, "#fff", 0.22], [1, "#fff", 0]])}"/></mask>`);
    k += G(`<g mask="url(#${S.id("spmaske")})"><g filter="url(#${S.id("welle")})"><g transform="matrix(1 0 0 ${-SQ} 0 ${r(WASSER0 * (1 + SQ))})">${sp}</g></g></g>`);
  }
  /* die vertäuten Gondeln am Molo: unregelmäßig, leicht verdreht, manche mit
     dem Bug zum Ufer, Planen in Blau und Dunkelgrün, eine offen mit rotem Sitz;
     dazwischen Pfähle mit farbigen Ringen */
  {
    const z = B.zufall(77);
    let g = "";
    let x = 135;
    while (x < 226) {
      const kurz = z() < 0.25, len = kurz ? 2.6 : 4 + z() * 0.8, rot = r((z() - 0.5) * 6), yy = r(WASSER0 + 0.8 + z() * 0.6);
      const plane = ["#2f4f8a", "#2f4f8a", "#24493a", "#1f3c66", null][Math.floor(z() * 5)];
      g += `<g transform="rotate(${rot} ${r(x)} ${yy})"><path d="M${r(x - len / 2)} ${yy} q${r(len / 2)} .8 ${r(len)} 0 l.3 -.55 q${r(-len / 2 - 0.3)} .65 ${r(-len - 0.3)} 0 Z" fill="#141416"/>`;
      g += plane ? `<rect x="${r(x - len * 0.25)}" y="${r(yy - 0.25)}" width="${r(len * 0.5)}" height=".42" fill="${plane}"/>` : `<rect x="${r(x - len * 0.18)}" y="${r(yy - 0.3)}" width="${r(len * 0.36)}" height=".4" fill="#b02a34"/>`;
      g += `</g>`;
      x += len + 0.8 + z() * 1.8;
      if (z() < 0.5) { const px = r(x - 0.6), c = ["#2f4f8a", "#b02a34", "#2f6a4a"][Math.floor(z() * 3)], h = 3 + z() * 1.2; g += `<rect x="${px}" y="${r(WASSER0 + 1 - h)}" width=".4" height="${r(h)}" fill="#f1f1ee"/><rect x="${px}" y="${r(WASSER0 + 1.4 - h)}" width=".4" height=".5" fill="${c}"/><rect x="${px}" y="${r(WASSER0 + 2.4 - h)}" width=".4" height=".5" fill="${c}"/>`; }
    }
    GONDELN_MOLO = G(g);
  }
  const Y1 = Y(W1);
  /* breiter Glitzerpfad der tiefen Sonne (links außerhalb des Bildes):
     hinten schmal und fein, vorn breit und grob */
  k += `<rect x="0" y="${Y1}" width="170" height="${r(UFER - Y1 - 0.4)}" fill="${S.rg("glanz", [[0, "#ffdc9a", 0.42], [0.45, "#ffdc9a", 0.14], [1, "#ffdc9a", 0]], 0, 0.7, 1)}"/>`;
  for (let i = 0; i < 230; i++) {
    const t = Math.pow(rnd(), 1.1), y = Y1 + 1.5 + t * (UFER - Y1 - 4), breite = 24 + t * 124, x = Math.max(0, t * 18 + (rnd() - 0.4) * breite), w = 0.8 + t * 6.5 * (0.5 + rnd());
    k += `<path d="M${r(x)} ${r(y)} q${r(w / 2)} ${r(-0.3 - t * 0.8)} ${r(w)} 0" stroke="${rnd() < 0.7 ? "#fff1c8" : "#ffd98c"}" stroke-width="${r(0.18 + t * 0.6)}" fill="none" opacity="${r(0.5 + rnd() * 0.45)}"/>`;
  }
  /* kleine Wellen, vorn größer */
  for (let i = 0; i < 170; i++) {
    const t = Math.pow(rnd(), 1.4), y = Y1 + 3 + t * (UFER - Y1 - 5), w = 0.8 + t * 7 * (0.5 + rnd());
    const x = rnd() * (400 - w);
    k += `<path d="M${r(x)} ${r(y)} q${r(w / 2)} ${r(-0.3 - t)} ${r(w)} 0" stroke="${rnd() < 0.5 ? "#c8e0dc" : "#1f4f52"}" stroke-width="${r(0.15 + t * 0.5)}" fill="none" opacity="${r(0.35 + rnd() * 0.4)}"/>`;
  }
  /* ein Wassertaxi (lackiertes Mahagoni, weißes Kabinendach) in 250 m, fährt nach rechts */
  {
    const s = r(F / 250), X = 52, Yw = wl(250);
    WASSERTAXI += `<g filter="url(#${S.id("welle")})" opacity=".55"><g transform="translate(${X} ${Yw}) scale(${s} ${r(-s * 0.6)})"><path d="M0 -1.1 L8.6 -1.1 Q10.2 -1.15 10.7 -1.6 Q10.3 -.3 8.8 0 L.3 0 Z" fill="#3e1e0e"/><path d="M2.4 -1.1 L2.4 -2.5 L7.4 -2.5 L8.3 -1.1 Z" fill="#8f8a84"/></g></g>`;
    let t = "";
    t += `<path d="M.2 .1 Q-4 .2 -8.6 .9 M.4 .3 Q-3 .7 -6.4 1.7" stroke="#f4f8f6" stroke-width=".14" fill="none" opacity=".8"/>`;
    t += `<path d="M0 -1.1 L8.6 -1.1 Q10.2 -1.15 10.7 -1.6 Q10.3 -.3 8.8 0 L.3 0 Z" fill="${S.lg("mahagoni", [[0, "#b06434"], [1, "#5e2a12"]])}"/>`;
    t += `<path d="M0 -1.1 L8.6 -1.1 Q10.2 -1.15 10.7 -1.6" stroke="#ffd9a8" stroke-width=".09" fill="none"/>`;
    t += `<path d="M2.4 -1.1 L2.4 -2.3 L7 -2.3 Q7.8 -2.1 8.3 -1.1 Z" fill="#8a4422"/><path d="M2.7 -1.4 L2.7 -2.05 L6.9 -2.05 Q7.4 -1.9 7.7 -1.4 Z" fill="#233038"/>`;
    t += `<path d="M2.2 -2.3 L7.1 -2.3 Q7.5 -2.3 7.6 -2.55 L2.2 -2.55 Z" fill="#f8f6f0"/>`;
    t += `<path d="M10.6 -.9 q.5 .2 .8 .9 M10.2 -.4 q.4 .3 .6 .7" stroke="#f4f8f6" stroke-width=".12" fill="none"/>`;
    t += `<rect x="1" y="-2.6" width=".42" height="1.5" rx=".15" fill="#f1efe8"/><circle cx="1.21" cy="-2.8" r=".2" fill="#c99a7a"/>`;
    WASSERTAXI += `<g transform="translate(${X} ${Yw}) scale(${s})">${t}</g>`;
  }
  /* eine zweite Gondel in 137 m, fährt nach links (wir sehen die Backbordseite,
     das Ruder liegt dahinter) */
  {
    const s = r(F / 137), X = 248, Yw = wl(137);
    GONDEL2 += `<g filter="url(#${S.id("welle")})" opacity=".6"><g transform="translate(${X} ${Yw}) scale(${s} ${r(-s * 0.6)})"><path d="M-5.5 -1.5 Q-4.8 -.8 -3.8 -.6 Q0 -.35 3.8 -.6 Q4.9 -.9 5.5 -1.6 L5.5 -1.4 Q5 -.5 4.2 0 L-4.2 0 Q-5 -.5 -5.5 -1.5 Z M3.8 -.7 L3.8 -2.6 L4.2 -2.6 L4.2 -.7 Z" fill="#0c1c1e"/></g></g>`;
    let g = "";
    g += `<path d="M5.5 .4 q1.6 .2 3 .8 M5 .7 q1.2 .4 2.2 1" stroke="#e6f1ee" stroke-width=".1" fill="none" opacity=".7"/>`;
    g += `<path d="M3.6 -2.1 L2.5 -.3" stroke="#c8a46a" stroke-width=".09"/>`;
    g += `<path d="M-5.5 -1.5 Q-4.8 -.8 -3.8 -.6 Q0 -.35 3.8 -.6 Q4.9 -.9 5.5 -1.6 L5.5 -1.4 Q5 -.5 4.2 -.05 L-4.2 -.05 Q-5 -.5 -5.5 -1.5 Z" fill="#141416"/>`;
    g += `<path d="M-5.2 -1.2 Q-4 -.62 0 -.5 Q4 -.62 5.2 -1.3" stroke="#6e7076" stroke-width=".05" fill="none"/>`;
    g += `<path d="M-5.5 -1.5 L-5.6 -1.95 L-5.3 -2.15 L-5.35 -1.4 Z" fill="#d7dce0"/><path d="M-5.6 -1.75 h-.22 M-5.6 -1.62 h-.22 M-5.6 -1.49 h-.22" stroke="#d7dce0" stroke-width=".05"/>`;
    /* zwei Fahrgäste auf dem Polster */
    g += `<rect x="-1.4" y="-.95" width="1.3" height=".4" fill="#9a2232"/><rect x="-1.25" y="-1.35" width=".36" height=".6" rx=".12" fill="#e7e2d6"/><circle cx="-1.07" cy="-1.5" r=".15" fill="#d6a886"/><rect x="-.7" y="-1.35" width=".36" height=".6" rx=".12" fill="#2f5f8a"/><circle cx="-.52" cy="-1.5" r=".15" fill="#c99470"/>`;
    /* der Gondoliere hinten (Ringelhemd, Strohhut) */
    g += `<path d="M3.9 -.75 L3.95 -1.6 M4.12 -.75 L4.06 -1.6" stroke="#1d1d22" stroke-width=".14"/>`;
    g += `<rect x="3.77" y="-2.32" width=".46" height=".76" rx=".1" fill="#f6f6f2"/><path d="M3.77 -2.1 h.46 M3.77 -1.9 h.46 M3.77 -1.7 h.46" stroke="#1d2f5e" stroke-width=".07"/>`;
    g += `<path d="M3.9 -2.15 L3.62 -1.95 M4.1 -2.15 L3.5 -2.05" stroke="#f6f6f2" stroke-width=".1"/>`;
    g += `<circle cx="4" cy="-2.46" r=".13" fill="#d6a886"/><ellipse cx="4" cy="-2.58" rx=".24" ry=".05" fill="#e3c97e"/><rect x="3.88" y="-2.69" width=".24" height=".11" fill="#e3c97e"/><rect x="3.88" y="-2.62" width=".24" height=".03" fill="#b3242c"/>`;
    GONDEL2 += `<g transform="translate(${X} ${Yw}) scale(${s})">${g}</g>`;
  }
  /* Leben auf dem Molo: Spaziergänger in Gruppen (≈ 2,2 hoch = 1,7 m), dicht vor
     dem Palast und an den Säulen, lockerer an der Riva; Laternen, Souvenirstände
     und die langen Abendschatten der Säulen nach rechts hinten */
  {
    S.def(`<g id="${S.id("mn")}"><path d="M-.22 0V-1.02h.2V0zM.02 0V-1.02h.2V0z" fill="#33353d"/><rect x="-.3" y="-1.86" width=".6" height=".92" rx=".16" fill="currentColor"/><rect x="-.3" y="-1.8" width=".17" height=".8" rx=".08" fill="#fff" opacity=".3"/><circle cy="-2.07" r=".19" fill="#d8a986"/></g>`);
    S.def(`<g id="${S.id("fr")}"><path d="M-.16 0V-.7h.13V0zM.04 0V-.7h.13V0z" fill="#c99a7a"/><path d="M-.24 -1.84h.48l.2 1.14h-.88z" fill="currentColor"/><path d="M-.24 -1.84h.14l-.26 1.14h-.12z" fill="#fff" opacity=".3"/><circle cy="-2.04" r=".21" fill="#5a3b25"/><circle cx=".04" cy="-1.99" r=".16" fill="#d8a986"/></g>`);
    const FARBEN = ["#e8e4dc", "#c0392b", "#2f4f7a", "#f2c230", "#2d2f3a", "#7fa7c9", "#e58a5a", "#3f7d5a", "#f6f3ea", "#b55d8a", "#8a6a3a", "#d9d2c4"];
    const boden = (x) => MOLO - 0.3 + (x > 243 ? (x - 243) / 157 * 1.4 : 0);
    let g = "";
    for (const x of [86, 124]) g += `<path d="M${x + 1.2} ${r(MOLO - 0.15)} L${x + 24} ${r(MOLO - 1.05)} L${x + 24} ${r(MOLO - 0.55)} L${x + 1.6} ${r(MOLO + 0.35)} Z" fill="#4a3a5a" opacity=".32"/>`;
    for (const x of [16, 34, 60, 140, 160, 200, 252, 280, 310]) {
      const y = boden(x) - 0.2;
      g += `<line x1="${x}" y1="${r(y)}" x2="${x}" y2="${r(y - 4.6)}" stroke="#2f3236" stroke-width=".3"/><path d="M${x - 0.6} ${r(y - 4.6)} L${x + 0.6} ${r(y - 4.6)} L${x + 0.4} ${r(y - 5.8)} L${x - 0.4} ${r(y - 5.8)} Z" fill="#fff3cf" stroke="#2f3236" stroke-width=".15"/>`;
    }
    /* Souvenirstände (Bancarelle) an der Riva degli Schiavoni */
    for (const x of [304, 314.5]) {
      const y = r(boden(x) + 0.2);
      g += `<rect x="${x - 1.9}" y="${r(y - 1.2)}" width="3.8" height="1.2" fill="#e9e2d4"/><path d="M${x - 1.7} ${r(y - 1.3)} h3.4" stroke="#c0392b" stroke-width=".35" stroke-dasharray=".35 .3"/>`;
      g += `<path d="M${x - 1.8} ${r(y - 1.2)} V${r(y - 3)} M${x + 1.8} ${r(y - 1.2)} V${r(y - 3)}" stroke="#8e8a84" stroke-width=".14"/><path d="M${x - 2.3} ${r(y - 2.8)} L${x + 2.3} ${r(y - 2.8)} L${x + 1.9} ${r(y - 3.6)} L${x - 1.9} ${r(y - 3.6)} Z" fill="#fbfaf6"/>`;
      g += `<path d="M${x - 1.5} ${r(y - 1.9)} h.5 m.4 0 h.4 m.5 0 h.6 m.3 0 h.5" stroke="#2f4f7a" stroke-width=".55" stroke-dasharray=".25 .2"/>`;
    }
    /* Gruppen mit Lücken dazwischen: hinten am Palast dicht, an der Riva viele
       (ihre Köpfe schauen über das Vaporetto) */
    const gruppen = [[40, 2.5, 3], [64, 2, 3], [97, 1.8, 3], [112, 2.6, 5], [141, 2.4, 4], [157, 3, 5], [176, 2, 3], [221, 2.2, 3], [249, 2.4, 4], [262, 2, 4], [279, 2.6, 4], [295, 2.2, 4], [309.5, 2.5, 3], [317, 2, 3]];
    const leute = [];
    for (const [cx, sp, n] of gruppen) for (let i = 0; i < n; i++) leute.push([cx + (rnd() - 0.5) * 2 * sp, rnd()]);
    /* eine Reisegruppe dicht beisammen, die Führerin hält einen roten Schirm hoch */
    for (let i = 0; i < 9; i++) leute.push([199 + (rnd() - 0.5) * 6, 0.3 + rnd() * 0.4]);
    g += `<path d="M195.2 ${r(boden(195) + 0.2 - 2.1)} L195.2 ${r(boden(195) - 4.2)}" stroke="#2a2a2a" stroke-width=".12"/><path d="M194 ${r(boden(195) - 4.1)} Q195.2 ${r(boden(195) - 5.3)} 196.4 ${r(boden(195) - 4.1)} Z" fill="#c8302a"/>`;
    /* ein Paar am Geländer direkt an der Wasserkante, Leute auf den Säulensockeln */
    g += `<use href="#${S.id("mn")}" x="129" y="${r(MOLO + 0.95)}" color="#2f4f7a"/><use href="#${S.id("fr")}" x="129.6" y="${r(MOLO + 0.95)}" color="#e6889f"/>`;
    for (const [sx, c] of [[84.4, "#f2c230"], [87.8, "#7fa7c9"], [122.6, "#e8e4dc"], [125.6, "#c0392b"]]) g += `<rect x="${r(sx - 0.28)}" y="${r(MOLO - 2.9)}" width=".56" height=".9" rx=".16" fill="${c}"/><circle cx="${sx}" cy="${r(MOLO - 3.1)}" r=".18" fill="#d8a986"/><path d="M${r(sx - 0.2)} ${r(MOLO - 2)} l.3 .9 M${r(sx + 0.2)} ${r(MOLO - 2)} l.3 .9" stroke="#33353d" stroke-width=".18"/>`;
    leute.sort((a, b) => a[1] - b[1]);
    /* an der Riva viele: Köpfe und Schultern über der Kabinenkante des Vaporetto */
    for (let i = 0; i < 14; i++) leute.push([238 + rnd() * 62, rnd() * 0.5]);
    g += `<path d="M319.4 ${r(boden(319) - 3.6)} V${r(boden(319) + 0.3)}" stroke="#6b5a4c" stroke-width=".15"/><path d="M316.6 ${r(boden(319) - 3.4)} Q319.4 ${r(boden(319) - 5)} 322.2 ${r(boden(319) - 3.4)} Z" fill="#e8e0d0"/><path d="M317.6 ${r(boden(319) - 3.45)} Q319.4 ${r(boden(319) - 4.9)} 321.2 ${r(boden(319) - 3.45)}" stroke="#c0392b" stroke-width=".3" fill="none"/><rect x="317.6" y="${r(boden(319) - 0.9)}" width="3.6" height="1.2" fill="#e9e2d4"/>`;
    for (const [x, tiefe] of leute) {
      const y = r(boden(x) + tiefe * 0.9), c = FARBEN[Math.floor(rnd() * FARBEN.length)], typ = rnd() < 0.5 ? "fr" : "mn";
      if (rnd() < 0.45) g += `<path d="M${r(x + 0.2)} ${y} l1.8 -.36 v.24 l-1.8 .32 z" fill="#4a3a5a" opacity=".35"/>`;
      g += `<use href="#${S.id(typ)}" x="${r(x)}" y="${y}" color="${c}"/>`;
      if (rnd() < 0.18) g += `<ellipse cx="${r(x)}" cy="${r(y - 2.24)}" rx=".32" ry=".08" fill="#f3efe4"/>`;
    }
    k += `<g pointer-events="none">${G(g)}</g>`;
  }
  S.teil({ id: "lagune", de: "die Lagune", syl: "la-GU-ne", it: "la laguna", itSyl: "la-GU-na", en: "lagoon", x: 0, y: 0, kunst: k,
    tipp: "Venedig steht auf über 100 kleinen Inseln mitten in der Lagune." });
  S.teil({ id: "wassertaxi", de: "das Wassertaxi", syl: "WAS-ser-ta-xi", it: "il taxi acqueo", itSyl: "TA-xi AC-que-o", en: "water taxi", x: 0, y: 0, kunst: WASSERTAXI,
    tipp: "In Venedig ist das Taxi ein Boot aus glänzendem Holz." });
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
  k += `<g filter="url(#${S.id("welle")})" opacity=".5"><g transform="scale(1 -.6)"><path d="M0 -4.6 L91.6 -4.6 L91.6 -.8 L4.4 .3 Z" fill="#a9bbba"/><rect x="0" y="-5.2" width="91.6" height="1.5" fill="#1f2a2c"/><rect x="12" y="-13.4" width="72" height="8.2" fill="#b6c4c3"/></g></g>`;
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
  /* Fahrgäste hinter den Scheiben */
  for (const [x, c] of [[16.2, "#c8b48a"], [23.4, "#7a2f3a"], [29.8, "#e6e2da"], [59, "#2f5f8a"], [66.6, "#d9a03a"], [76.2, "#40424a"]]) k += `<path d="M${x - 1.3} -7.4 q0 -1.7 1.3 -1.8 q1.3 .1 1.3 1.8 Z" fill="${c}" opacity=".85"/><circle cx="${x}" cy="-9.9" r=".72" fill="#d2a684" opacity=".9"/>`;
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
  /* der goldene Markuslöwe nach links: Nimbus, Schwinge, Buch */
  k += `<circle cx="91.3" cy="-17.6" r=".62" fill="none" stroke="#f2c94c" stroke-width=".16"/><circle cx="91.3" cy="-17.5" r=".36" fill="#f2c94c"/>`;
  k += `<path d="M91.5 -17.1 Q93 -17.3 94 -16.7 L94.2 -15.3 L93.8 -15.3 L93.6 -16.1 L92.2 -16.1 L92 -15.3 L91.6 -15.3 L91.5 -16.4 Z" fill="#f2c94c"/>`;
  k += `<path d="M92.3 -16.9 Q92.7 -18.7 94.6 -18.7 Q94 -18.1 94.2 -17.8 Q93.6 -17.8 93.7 -17.4 Q93.1 -17.4 93.3 -16.9 Z" fill="none" stroke="#f2c94c" stroke-width=".16"/>`;
  k += `<path d="M94 -16.5 q.8 -.2 .7 -1" stroke="#f2c94c" stroke-width=".14" fill="none"/><rect x="90.2" y="-16.5" width=".9" height=".7" fill="#fff6dc"/>`;
  /* Rettungsring */
  k += `<circle cx="88" cy="-9.4" r="1.4" fill="none" stroke="#e8642a" stroke-width=".8"/>`;
  k += `<path d="M12 -13 L20 -13 L12 -8 Z" fill="#fff" opacity=".18"/>`;
  S.teil({ id: "vaporetto", de: "das Vaporetto", syl: "va-po-RET-to", it: "il vaporetto", itSyl: "va-po-RET-to", en: "water bus", x: VX, y: VY, kunst: `<g transform="scale(${VS})">${k}</g>`,
    tipp: "Das Vaporetto ist der Bus von Venedig – es fährt auf dem Wasser. In der Altstadt fahren keine Autos." });
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
  /* Spiegelbild: der gespiegelte, gestauchte Rumpf, wellig verzerrt */
  k += `<g filter="url(#${S.id("welle")})" opacity=".6"><g transform="scale(1 -.62)"><path d="M-45.8 -11.8 Q-41 -7.4 -34 -5.4 Q-20 -3.9 0 -3.6 Q20 -3.9 33 -5.4 Q40 -7.2 45.2 -11 L45.6 -10.2 Q44.6 -5.6 37 -.6 Q36 0 34 0 L-34 0 Q-36 0 -37.4 -.8 Q-44.2 -5.8 -45.8 -11.8 Z M-40 -7 L-36 -7 L-35 -16 L-38 -16 Z" fill="#0b1a1c"/></g></g>`;
  k += `<path d="M44 1 q6 .4 9 1.6 M40 1.8 q4 .8 7 2.2 M-44 1.2 q-10 .6 -22 3 M-40 2.2 q-8 1 -16 3.4" stroke="#e6f1ee" stroke-width=".45" fill="none" opacity=".7"/>`;
  /* hintere Bordwand (wir schauen leicht von oben hinein) */
  k += `<path d="M-43 -9.4 Q-34 -5.6 -18 -4.6 Q0 -4.2 18 -4.6 Q34 -5.6 42 -8.6" stroke="#1a1a1d" stroke-width=".8" fill="none"/>`;
  /* Sitzbank mit rotem Polster, geschnitzte Lehne (carega) */
  k += `<path d="M-8 -4.4 L-8 -6.9 L3 -6.9 L3 -4.4 Z M10 -4.4 L10 -6.4 Q11.6 -7.2 13.2 -6.4 L13.2 -4.4 Z" fill="${S.lg("polster", [[0, "#b8323f"], [1, "#7a1a26"]])}"/>`;
  k += `<path d="M-9.4 -4.4 L-9.4 -9.6 Q-8.6 -10.8 -7.4 -10 L-7.4 -4.4 Z" fill="#1d1a1a" stroke="#d9a92e" stroke-width=".3"/>`;
  k += `<path d="M-7.6 -6.7 L2.6 -6.7" stroke="#d9a92e" stroke-width=".25"/>`;
  /* Rumpf: schwarz lackiert, bananenförmig — Bug und Heck steigen hoch aus dem Wasser */
  k += `<path d="M-45.8 -11.8 Q-41 -7.4 -34 -5.4 Q-20 -3.9 0 -3.6 Q20 -3.9 33 -5.4 Q40 -7.2 45.2 -11 L45.6 -10.2 Q44.6 -5.6 37 -0.6 Q36 0 34 0 L-34 0 Q-36 0 -37.4 -0.8 Q-44.2 -5.8 -45.8 -11.8 Z" fill="${S.lg("lack", [[0, "#3a3a40"], [0.35, "#121214"], [1, "#050506"]])}"/>`;
  k += `<path d="M-43 -9.2 Q-34 -5 0 -4.3 Q33 -5 42 -8.6" stroke="#8e9096" stroke-width=".35" fill="none" opacity=".75"/>`;
  k += `<path d="M-30 -1.6 Q0 -2.1 30 -1.8" stroke="#2b2b31" stroke-width=".3" fill="none"/>`;
  k += `<path d="M-37.6 -1.15 Q0 -.75 37.2 -1.2 L35.6 .3 Q0 .5 -35.8 .3 Z" fill="#3a7774" opacity=".88"/><path d="M-37.6 -1.15 Q0 -.75 37.2 -1.2" stroke="#d6ebe6" stroke-width=".3" fill="none" opacity=".8"/><path d="M37.2 -1.2 q2 -.4 3.4 .4 q-1.4 .2 -2.4 .9" fill="#e8f3f0" opacity=".85"/>`;
  /* Heckdeck: kleine Plattform, auf der der Gondoliere steht; vorn das gedeckte Bugdeck */
  k += `<path d="M-41.4 -7.6 L-33.6 -6.2 L-33.6 -5.6 L-41 -6.9 Z" fill="#3c3a3a" stroke="#6b6866" stroke-width=".15"/>`;
  k += `<path d="M30 -5.3 Q36 -6.2 41 -8.4" stroke="#55555c" stroke-width=".5" fill="none"/>`;
  /* das kleine Eisen am Heck (risso) */
  k += `<path d="M-45.8 -11.8 q-.9 -1 -1.6 -.4 q-.4 .6 .4 .8" stroke="#c9ced3" stroke-width=".45" fill="none"/>`;
  /* zwei goldene Seepferdchen (cavalli) seitlich am Sitzplatz */
  for (const cx of [-9.6, 8.4]) {
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
  k += `<path d="M${r(h0.x - 1.6)} ${r(h0.y - 1.6 * steig)} L${r(blattX)} 1.2" stroke="${ruder}" stroke-width=".62" stroke-linecap="round"/>`;
  k += `<path d="M${r(blattX - 3.4)} ${r(1.2 - 3.4 * steig - 0.5)} L${r(blattX + 0.6)} ${r(1.2 + 0.6 * steig - 0.5)} L${r(blattX + 0.6)} ${r(1.2 + 0.6 * steig + 0.7)} L${r(blattX - 3.4)} ${r(1.2 - 3.4 * steig + 0.3)} Z" fill="${ruder}"/>`;
  k += `<rect x="${r(blattX - 4)}" y=".05" width="5.4" height="2.4" fill="#2f6a6c" opacity=".55"/>`;
  k += `<ellipse cx="${r(blattX - 1.2)}" cy=".2" rx="3.2" ry=".7" fill="none" stroke="#e9f4f1" stroke-width=".3" opacity=".9"/><ellipse cx="${r(blattX - 1.2)}" cy=".25" rx="5.4" ry="1.2" fill="none" stroke="#d3e8e3" stroke-width=".25" opacity=".6"/>`;
  S.teil({ id: "gondel", de: "die Gondel", syl: "GON-del", it: "la gondola", itSyl: "GON-do-la", en: "gondola", x: GX, y: GY, kunst: `<g transform="scale(${GS})">${k}</g><g transform="translate(${-GX} ${-GY})">${GONDELN_MOLO}${GONDEL2}</g>`,
    tipp: "Eine Gondel ist fast 11 Meter lang und immer schwarz. Sie ist schief gebaut – so fährt sie geradeaus, obwohl nur auf einer Seite gerudert wird.",
    zoom: { x: GX - 76, y: GY - 44, w: 152, h: 54 },
    unter: [
      { id: "bugeisen", de: "das Bugeisen", syl: "BUG-ei-sen", it: "il ferro di prua", itSyl: "FER-ro di PRU-a", en: "prow iron", x: r(GX + FE.x * GS), y: r(GY + FE.y * GS), kunst: `<g transform="scale(${GS})">${flaeche(-2.6, -7.4, 6.6, 8, 0.6)}</g>`,
        tipp: "Die Gondolieri nennen es „Ferro“. Seine sechs Zacken stehen für die sechs Stadtteile von Venedig." },
      { id: "ruder", de: "das Ruder", syl: "RU-der", it: "il remo", itSyl: "RE-mo", en: "oar", x: r(GX + fx * GS), y: r(GY - 4.2 * GS), kunst: `<g transform="scale(${GS})">${flaeche(-7.9, -12.3, r(blattX - fx + 8.6), r(13.8 + 0.4 + 1.2 + 2.5), 0.6)}</g>`,
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
  S.teil({ id: "gondoliere", de: "der Gondoliere", syl: "gon-do-LIE-re", it: "il gondoliere", itSyl: "gon-do-LIE-re", en: "gondolier", x: GOND.fussX, y: GOND.fussY, kunst: kompakt(svg, 2),
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
  S.def(`<clipPath id="${S.id("pfclip")}"><rect x="-20" y="-1" width="40" height="${r((UFER - 0.6 - PF.y) / PF.s + 1)}"/></clipPath>`);
  let k = `<g clip-path="url(#${S.id("pfclip")})"><g filter="url(#${S.id("welle")})" opacity=".7"><g transform="scale(1 -.38)"><path d="M-8.6 0 L-8.4 -72 Q-5.6 -74 -2.8 -72 L-2.8 -78 Q0 -80 2.8 -78 L2.8 -70 Q5.6 -72 8.6 -70 L8.6 0 Z" fill="${S.lg("pfsp", [[0, "#3a3226", 0.85], [0.5, "#3a3226", 0.4], [1, "#3a3226", 0]])}"/><rect x="-8.6" y="-9" width="17.2" height="9" fill="#1c2618" opacity=".7"/></g></g></g>`;
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
  k += `<rect x="-2" y=".2" width="${L + 2}" height="2.6" fill="#123032" opacity=".5"/>`;
  k += `<rect x="0" y="${r(m(-0.8) + 1)}" width="${L}" height="1.8" fill="#1d2124"/><rect x="0" y="${r(m(-0.8) + 1.1)}" width="${L}" height=".35" fill="#4a5053"/>`;
  for (const x of [6, 46, 86]) if (x < L - 4) k += `<circle cx="${x}" cy="${m(-0.38)}" r="2" fill="none" stroke="#e8642a" stroke-width="1.1"/><path d="M${x - 1.4} ${r(m(-0.38) - 1.4)} l.6 .6 M${x + 1.4} ${r(m(-0.38) + 1.4)} l-.6 -.6" stroke="#f3efe6" stroke-width=".5"/>`;
  const poller = (x) => `<path d="M${x - 1} ${r(m(-0.8) + 0.2)} L${x - 1} ${r(m(-0.8) - 1.8)} Q${x} ${r(m(-0.8) - 2.8)} ${x + 1} ${r(m(-0.8) - 1.8)} L${x + 1} ${r(m(-0.8) + 0.2)} Z" fill="#2b2f33"/><rect x="${x - 1.4}" y="${r(m(-0.8) - 2.1)}" width="2.8" height=".5" rx=".2" fill="#3c4246"/>`;
  k += poller(2.4);
  /* Steg zum Ufer (nach vorn links, mit Geländer) */
  {
    const y0 = m(-0.8), y1 = r(UFER - Y);
    const P = (a, b, t) => r(a + (b - a) * t);
    k += `<path d="M-26 ${y1} L-26 ${r(y1 + 1.4)} L-2 ${r(y0 + 1)} L-2 ${y0} Z" fill="#4e4c48"/>`;
    k += `<path d="M-2 ${y0} L10 ${y0} L-6 ${y1} L-26 ${y1} Z" fill="${S.lg("steg", [[0, "#a29d95"], [1, "#857f77"]])}"/>`;
    for (let i = 1; i < 12; i++) { const t = Math.pow(i / 12, 1.5); k += `<line x1="${P(-2, -26, t)}" y1="${P(y0, y1, t)}" x2="${P(10, -6, t)}" y2="${P(y0, y1, t)}" stroke="#625d56" stroke-width="${r(0.3 + t * 0.35)}"/>`; }
    /* Handläufe auf Pfosten (etwa alle 1 m) */
    for (const [a, b] of [[-2, -26], [10, -6]]) {
      let p = "";
      for (let i = 0; i <= 6; i++) { const t = i / 6, x = P(a, b, t), yy = P(y0, y1, t); p += `M${x} ${yy} L${x} ${r(yy - 6 - t * 3)} `; }
      k += `<path d="${p}" stroke="#5b6367" stroke-width=".45"/><path d="M${a} ${r(y0 - 6)} L${b} ${r(y1 - 9)}" stroke="#3f474b" stroke-width=".75"/><path d="M${a} ${r(y0 - 3)} L${b} ${r(y1 - 4.5)}" stroke="#5b6367" stroke-width=".3"/>`;
    }
  }
  /* Wartehäuschen: Pfosten, Glas, Dach, gelbes Schild */
  const dach = m(-3.1);
  k += `<rect x="4" y="${dach}" width="${L - 4}" height="${r(m(-0.8) - dach)}" fill="${S.lg("glasbox", [[0, "#cfe3e8", 0.5], [1, "#a9c4cc", 0.35]])}"/>`;
  for (let x = 4; x < L; x += 22) k += `<rect x="${x}" y="${dach}" width="1.4" height="${r(m(-0.8) - dach)}" fill="#7d878c"/>`;
  k += `<path d="M2 ${r(dach + 0.4)} L${L} ${r(dach + 0.4)} L${L} ${r(dach - 2.4)} L0 ${r(dach - 2.4)} Z" fill="#eef0ef"/>`;
  k += `<rect x="14" y="${r(dach - 9.6)}" width="${L - 14}" height="7" fill="#f2c230"/><rect x="14" y="${r(dach - 9.6)}" width="${L - 14}" height=".8" fill="#1d1d1d"/>`;
  k += `<text x="40" y="${r(dach - 4)}" font-size="4.6" fill="#1d1d1d" font-family="Arial,sans-serif" font-weight="bold">S. GIORGIO</text><circle cx="${L - 9}" cy="${r(dach - 6.1)}" r="2.6" fill="#fff" stroke="#1d1d1d" stroke-width=".3"/><text x="${L - 9}" y="${r(dach - 4.6)}" font-size="4" text-anchor="middle" fill="#1d1d1d" font-family="Arial,sans-serif" font-weight="bold">2</text>`;
  k += `<path d="M6 ${r(dach + 2)} L20 ${r(dach + 2)} L6 ${r(dach + 18)} Z" fill="#fff" opacity=".2"/>`;
  k += poller(L - 6);
  S.teil({ id: "haltestelle", de: "die Haltestelle", syl: "HAL-te-stel-le", it: "la fermata", itSyl: "fer-MA-ta", en: "stop", x: X0, y: Y, kunst: k,
    tipp: "An der schwimmenden Haltestelle San Giorgio hält das Vaporetto der Linie 2." });
}

/* Schlagschatten einer Figur bei tiefer Sonne (WSW): eine gestreckte
   Silhouette (≈ 2,3 × Körperhöhe) nach rechts hinten; am Fuß scharf und
   dunkel, nach außen heller */
const schattenFigur = (x, y, f) => {
  const id = S.id("fs" + Math.round(x));
  S.def(`<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${x}" y1="0" x2="${r(x + 74 * f)}" y2="0"><stop offset="0" stop-color="#2a1a2a" stop-opacity=".5"/><stop offset=".55" stop-color="#2a1a2a" stop-opacity=".3"/><stop offset="1" stop-color="#2a1a2a" stop-opacity=".12"/></linearGradient>`);
  const p = (dx, dy) => `${r(x + dx * f)} ${r(y + dy * f)}`;
  return `<path d="M${p(-2.4, 0)} L${p(2, 0.3)} L${p(26, -1.2)} Q${p(31, -1)} ${p(36, -1.6)} L${p(52, -2.3)} Q${p(56, -2.2)} ${p(58, -1.6)} Q${p(63, -2.2)} ${p(67, -2.8)} Q${p(72, -3.6)} ${p(70, -4.8)} Q${p(66, -5.4)} ${p(62, -4.6)} Q${p(58, -5.2)} ${p(54, -4.6)} L${p(36, -3.8)} Q${p(30, -3.6)} ${p(26, -2.6)} Z" fill="url(#${id})"/>`;
};
/* =====================================================================
   14c — DAS KIND mit 14d — DEM EIS (Gelato in der Waffel)
   ===================================================================== */
{
  const x = 250, y = 257.4, sc = 4 * F / (y - HOR) / 4;   /* Boden des Platzes: Auge 4 m darüber */
  const s2 = (y - HOR) / 4;   /* Einheiten je Meter an dieser Stelle */
  const kind = B.mensch({ id: "ven_kind", alter: "kind", geschlecht: "w", blick: 14, frisur: "zopf", haarfarbe: "dunkelbraun", haut: "mittel", laecheln: true,
    pose: { lende: 1, brust: -2, nacken: 12, kopf: 14, schulterL: { vor: 3, seit: 8 }, ellbogenL: 14, unterarmL: 10, handL: 6, fingerL: 0.38,
      schulterR: { vor: 40, seit: 22, dreh: 20 }, ellbogenR: 104, unterarmR: 40, handR: 10, fingerR: 0.7,
      huefteL: { vor: 6, seit: 3, dreh: -6 }, knieL: 4, fussL: 0, huefteR: { vor: -3, seit: 2.5, dreh: -6 }, knieR: 2, fussR: 0 },
    kleidung: { oberteil: { stueck: "tshirt", farbe: "gelb" }, unterteil: { stueck: "shorts", farbe: "jeans" }, schuhe: { stueck: "turnschuh" }, kopf: { stueck: "kappe", farbe: "rot" } } }, r(1.28 * s2));
  const hand = { x: x + kind.z.handR.x * kind.k, y: y + kind.z.handR.y * kind.k };
  S.teil({ id: "kind", de: "das Kind", syl: "KIND", it: "il bambino", itSyl: "bam-BI-no", en: "child", x, y,
    kunst: kompakt(kind.svg), tipp: "Das Kind isst ein Eis und schaut den Tauben zu." });
  /* langer Abendschatten nach rechts hinten (Kulisse, damit er keinen Tipp fängt) */
  S.hinten(schattenFigur(x, y, 1.05));
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
  const k = taube(268, 258, 0.9, true) + taube(286, 252.4, 0.86, false) + taube(301, 249.8, 0.82, true) + taube(318, 256.4, 0.92, false);
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
      huefteL: { vor: 2, seit: 4, dreh: -8 }, knieL: 2, fussL: 0, huefteR: { vor: -9, seit: 7, dreh: -18 }, knieR: 18, fussR: 14, kipp: 3 },
    kleidung: { kleid: { stueck: "sommerkleid", farbe: "#2f7f9a" }, schuhe: { stueck: "turnschuh" } } }, 43.6);
  tourHand = { x: TOUR.x + m.z.handR.x * m.k, y: TOUR.y + m.z.handR.y * m.k };
  S.hinten(schattenFigur(TOUR.x, TOUR.y, 1.35));
  tourKopf = { x: TOUR.x + m.z.kopf.x * m.k, y: TOUR.y + m.z.kopf.y * m.k };
  S.teil({ id: "touristin", de: "die Touristin", syl: "tou-RIS-tin", it: "la turista", itSyl: "tu-RI-sta", en: "tourist", x: TOUR.x, y: TOUR.y, kunst: kompakt(m.svg),
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
