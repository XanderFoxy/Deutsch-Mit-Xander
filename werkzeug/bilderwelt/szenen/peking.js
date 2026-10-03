#!/usr/bin/env node
/* =====================================================================
   PEKING UND DIE GROSSE MAUER (FASSUNG 854) — Bilderwelt neu
   ---------------------------------------------------------------------
   RECHERCHE (visitbeijing.com.cn „Tian'anmen Gate“, China Daily
   „Mutianyu Great Wall – Landscape features“, Beijing-Regierung
   „Mutianyu (AAAAA)“, ourchinastory „The lanterns at Tiananmen“,
   travelchinawith.me „Mutianyu“):
   - STANDORT: Südseite der Chang'an-Straße am Nordrand des Platzes des
     Himmlischen Friedens, Anfang Oktober (Nationalfeiertag, „goldene
     Woche“), Nachmittag; die Sonne steht hinter uns im Südwesten. Blick
     genau nach NORDEN auf die Mittelachse der Stadt.
   - TIAN'ANMEN (Tor des Himmlischen Friedens, 1420, 1651 neu): 34,7 m
     hoch. Unten der rote Torbau (Stadttor-Sockel, rund 120 × 40 m,
     4800 m²) auf einem Fuß aus weißem Marmor, mit FÜNF Torbögen — der
     mittlere ist der größte, früher nur für den Kaiser. Darüber das
     Porträt und links/rechts die beiden Spruchbänder. Oben am Rand ein
     weißes Marmorgeländer. Darauf der Torturm: neun Joche breit, fünf
     tief (die kaiserlichen Zahlen), rote Säulen, Doppeldach im
     Xieshan-Stil (Walm unten, Giebel oben) mit kaiserlich GELBEN
     Glasurziegeln, blau-grün bemalte Dougong-Konsolen unter den Traufen,
     am First zwei Drachenköpfe (Chiwen), auf den Graten die Reihe der
     Dachfiguren. Zwischen den zehn Säulen der Galerie hängen ACHT große
     rote Palastlaternen (seit dem 1. Oktober 1949), das Mitteljoch bleibt
     frei.
   - DAVOR: der Goldwasserfluss mit seinen weißen Marmorbrücken (fünf
     vor den fünf Toren), davor das Paar HUABIAO — Marmorsäulen mit einem
     sich hochwindenden Drachen, Wolkenplatte und einem sitzenden Fabeltier
     (Hou) obenauf — und ein Paar Steinlöwen. Links und rechts läuft die
     rote Mauer der Kaiserstadt mit gelber Ziegelkappe weiter, dahinter
     alte Zypressen (Zhongshan-Park links, Kulturpalast rechts).
   - DIE GROSSE MAUER (Ming-Zeit): auf den Kämmen der Yanshan-Berge im
     NORDEN, 7–8 m hoch, oben 4–5 m breit, Granit unten, graue Ziegel
     oben, Zinnen; in Mutianyu stehen 22 Wachtürme auf 2,25 km, quadratische
     „Mini-Festungen“ mit zwei Geschossen und Bogenfenstern; an steilen
     Stellen wird der Wehrgang zur Treppe. Im Oktober leuchten die Hänge
     rot und gelb (Perückenstrauch, Ahorn).
     GESTAUCHT: Die Berge mit der Mauer liegen 60–70 km nördlich (links
     Badaling im Nordwesten, rechts Mutianyu im Nordosten). Hier rücken
     sie — in der richtigen Himmelsrichtung — wie mit dem Teleobjektiv
     hinter die Stadt (wie der Fuji in der Japan-Szene).
   - VORNE (ebenfalls gestaucht, richtig nach Süden geordnet): Pekingente
     isst man in den alten Restaurants am Qianmen, gut 1 km südlich —
     hier steht ihre Terrasse rechts am Platz: rote Säule, graues
     Ziegeldach mit bemalten Sparren, rote Laternen. Auf dem Tisch die
     glänzend braune Ente, dünne Pfannkuchen im Bambuskorb, süße
     Bohnensoße, Frühlingszwiebel und Gurke in Streifen, Teigtaschen
     (Jiaozi), Essstäbchen auf dem Bänkchen, Tee in blau-weißem
     Porzellan. Links auf dem Gehweg eine Fahrradrikscha (Hutong-
     Rikscha mit rotem Verdeck). Am Himmel ein Schwalbendrachen — die
     Pekinger Drachenform —, die Schnur führt in den Zhongshan-Park.
   Maßstab: Augenhöhe 3,1 m über der Straße (Terrasse 1,5 m hoch),
   Horizont y = 120, Brennweite 331: Punkt in d Metern und h Metern Höhe:
   y = 120 + (3,1 − h)·331/d, x = 180 + s·331/d. Das Tor steht 132 m weit
   (2,5 Einheiten je Meter), die Rikscha 14 m, der Tisch 3–4 m.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "peking", titel: "Peking und die Große Mauer", emoji: "🐉", thema: "Länder", kuerzel: "pek", fassung: 854, breite: 400, hoehe: 260 });
/* Verläufe nur einmal anlegen, auch wenn sie in Schleifen gebraucht werden */
{ const lg = S.lg, rg = S.rg, schon = {}; S.lg = (n, ...a) => schon["l" + n] || (schon["l" + n] = lg(n, ...a)); S.rg = (n, ...a) => schon["r" + n] || (schon["r" + n] = rg(n, ...a)); }
/* Wortmarke: Teile, die in Bildkoordinaten gezeichnet sind, bekommen ihren Ankerpunkt */
{ const teil = S.teil; S.teil = (t) => { if (t.anker) { const [ax, ay] = t.anker; t.kunst = `<g transform="translate(${B.r(t.x - ax)} ${B.r(t.y - ay)})">${t.kunst}</g>`; t.x = ax; t.y = ay; delete t.anker; } return teil(t); }; }
const rnd = zufall(1420);
const r = B.r;
const HOR = 120, E = 3.1, F = 331, CX = 180;
const yAt = (d, h = 0) => HOR + (E - h) * F / d;
const uAt = (d) => F / d;
const xAt = (s, d) => CX + s * F / d;
const P = (pts) => pts.map(([x, y], i) => (i ? "L" : "M") + r(x) + " " + r(y)).join(" ") + " Z";

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("wolke")}" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="2.4"/></filter>`);
S.def(`<filter id="${S.id("dunst")}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation=".5"/></filter>`);
/* gelbe Glasurziegel: Rinnen und Kappen im Wechsel */
S.def(`<pattern id="${S.id("ziegel")}" width="1.6" height="4" patternUnits="userSpaceOnUse"><rect width="1.6" height="4" fill="#e7ad1f"/><rect x="1.05" width=".55" height="4" fill="#b57a0c"/><rect x=".2" width=".35" height="4" fill="#f7d36a" opacity=".8"/></pattern>`);
S.def(`<pattern id="${S.id("grauziegel")}" width="2.4" height="5" patternUnits="userSpaceOnUse"><rect width="2.4" height="5" fill="#6d7075"/><rect x="1.5" width=".9" height="5" fill="#4a4d52"/><rect x=".3" width=".5" height="5" fill="#8b8e93" opacity=".8"/></pattern>`);
S.def(`<pattern id="${S.id("platten")}" width="14" height="7" patternUnits="userSpaceOnUse"><rect width="14" height="7" fill="#b9b4aa"/><path d="M0 .2 H14 M.2 0 V7 M7.2 0 V7" stroke="#9c978d" stroke-width=".35"/></pattern>`);
S.def(`<pattern id="${S.id("dielen")}" width="400" height="6" patternUnits="userSpaceOnUse"><rect width="400" height="6" fill="#8a5a34"/><rect width="400" height=".5" fill="#6a4226"/></pattern>`);
const ROT = S.lg("rot", [[0, "#c2402e"], [1, "#a2301f"]]);
const ROT_S = S.lg("rots", [[0, "#b0261c"], [1, "#8c1c14"]], 0, 0, 1, 0);
const GELB = S.lg("gelb", [[0, "#f6c443"], [0.6, "#e3a51d"], [1, "#b97d0e"]]);
const MARMOR = S.lg("marmor", [[0, "#f6f4ee"], [1, "#d7d3c8"]]);
const MARMOR_V = S.lg("marmorv", [[0, "#cfcabd"], [0.35, "#f6f4ee"], [0.7, "#e9e6dd"], [1, "#bdb8aa"]], 0, 0, 1, 0);
const GRUENBLAU = S.lg("dougong", [[0, "#2f8a7e"], [0.5, "#1f6d8a"], [1, "#2a5f7a"]], 0, 0, 1, 0);
const GOLD = S.lg("gold", [[0, "#fff1a8"], [0.45, "#e9bd3c"], [1, "#9a6b0c"]], 0, 0, 1, 1);
const LACK = S.lg("lack", [[0, "#7a2a1c"], [1, "#4e1810"]]);

/* =====================================================================
   KULISSE — Herbsthimmel, ferne Berge, Straße, Gehweg
   ===================================================================== */
S.hinten(`<rect width="400" height="${HOR + 14}" fill="${S.lg("himmel", [[0, "#2f6fbf"], [0.45, "#79acdf"], [0.85, "#cfe0ea"], [1, "#e9e6da"]])}"/>`);
S.hinten(`<circle cx="40" cy="140" r="150" fill="${S.rg("sonnenlicht", [[0, "#fff4d8", 0.35], [1, "#fff4d8", 0]])}"/>`);
{
  let w = "";
  for (const [x, y, s] of [[210, 18, 1], [300, 34, 0.7], [150, 44, 0.5]]) {
    w += `<g filter="url(#${S.id("wolke")})" opacity=".8">`;
    for (const [dx, dy, rx, ry] of [[0, 0, 18, 4], [-11, 1.5, 11, 3.2], [12, 1, 12, 3.6], [-3, -3, 9, 3.8]]) w += `<ellipse cx="${r(x + dx * s)}" cy="${r(y + dy * s)}" rx="${r(rx * s)}" ry="${r(ry * s)}" fill="#fff"/>`;
    w += `</g>`;
  }
  S.hinten(w);
}
/* fernste Kette der Yanshan-Berge im Dunst */
S.hinten(`<path d="M0 78 Q40 66 80 74 Q120 62 160 70 Q200 60 240 68 Q290 58 330 66 Q370 60 400 64 L400 122 L0 122 Z" fill="${S.lg("fernberg", [[0, "#a8b6c9"], [1, "#c9d3dc"]])}"/>`);

/* =====================================================================
   1 — DIE BERGE und 2 — DIE GROSSE MAUER (Lupe: Wachturm, Zinne, Treppe)
   ===================================================================== */
const KAMM_L = [[-2, 76], [10, 64], [22, 54], [32, 44], [40, 36], [46, 34], [53, 38], [62, 48], [73, 57], [86, 64], [98, 71], [112, 80], [126, 88]];
const KAMM_R = [[250, 92], [264, 86], [278, 79], [292, 70], [306, 63], [318, 59], [330, 63], [343, 69], [356, 66], [370, 61], [384, 64], [402, 71]];
const glatt = (pts) => { let d = `M${pts[0][0]} ${pts[0][1]}`; for (let i = 1; i < pts.length; i++) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i]; d += ` Q${x0} ${y0} ${r((x0 + x1) / 2)} ${r((y0 + y1) / 2)}`; } const z = pts[pts.length - 1]; return d + ` L${z[0]} ${z[1]}`; };
const kammY = (pts, x) => { for (let i = 1; i < pts.length; i++) if (x <= pts[i][0]) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i]; return y0 + (y1 - y0) * (x - x0) / (x1 - x0); } return pts[pts.length - 1][1]; };
{
  let k = "";
  for (const [pts, name] of [[KAMM_L, "l"], [KAMM_R, "r"]]) {
    const x0 = pts[0][0], x1 = pts[pts.length - 1][0];
    k += `<path d="${glatt(pts)} L${x1} 122 L${x0} 122 Z" fill="${S.lg("berg", [[0, "#6f7f74"], [0.5, "#7d8c7c"], [1, "#a3ad9f"]])}"/>`;
    /* Licht von links (Südwesten): beleuchtete Flanken heller */
    k += `<path d="${glatt(pts)} L${x1} 122 L${x0} 122 Z" fill="${S.lg("berglicht", [[0, "#fff3d6", 0.18], [0.5, "#fff3d6", 0], [1, "#1d2a3a", 0.12]], 0, 0, 1, 0)}"/>`;
    /* Herbstlaub: rote und goldene Flecken an den Hängen */
    for (let i = 0; i < 70; i++) {
      const x = x0 + 4 + rnd() * (x1 - x0 - 8), top = kammY(pts, x), y = top + 4 + rnd() * (118 - top - 6);
      k += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(1.4 + rnd() * 2.2)}" ry="${r(0.8 + rnd() * 1)}" fill="${["#b8573a", "#c98a3c", "#9a4a32", "#6f8a5a", "#d0a24a"][Math.floor(rnd() * 5)]}" opacity=".55"/>`;
    }
    /* Rinnen und Grate */
    for (let i = 0; i < 9; i++) { const x = x0 + 8 + i * (x1 - x0 - 16) / 8, top = kammY(pts, x); k += `<path d="M${r(x)} ${r(top + 2)} Q${r(x + (i % 2 ? 4 : -4))} ${r(top + 14)} ${r(x + (i % 2 ? 2 : -6))} ${r(top + 30)}" stroke="#4f5e57" stroke-width=".5" opacity=".35" fill="none"/>`; }
    k += `<path d="${glatt(pts)} L${x1} 122 L${x0} 122 Z" fill="${S.lg("bergdunst", [[0, "#dfe7ee", 0.05], [0.6, "#dfe7ee", 0.3], [1, "#e9e6da", 0.7]])}"/>`;
  }
  S.teil({ anker: [24, 96], id: "berg", de: "der Berg", syl: "BERG", it: "la montagna", itSyl: "mon-TA-gna", en: "mountain", x: 0, y: 0, kunst: k,
    tipp: "Im Norden von Peking liegen die Yanshan-Berge. Auf ihren Kämmen läuft die Große Mauer." });
}
const mauerUnter = [];
{
  let k = "";
  /* Wehrgang auf dem Kamm: dicke Linie, oben hell, mit Zinnen auf der Außenseite */
  const zug = (pts, versatz) => pts.map(([x, y]) => [x, y + versatz]);
  const turm = (x, y, s = 1) => {
    const w = 6 * s, h = 6 * s, t = 2 * s;
    let g = `<path d="M${r(x - w / 2)} ${r(y)} L${r(x - w / 2)} ${r(y - h)} L${r(x + w / 2)} ${r(y - h)} L${r(x + w / 2)} ${r(y)} Z" fill="#c9bea6"/>`;
    g += `<path d="M${r(x + w / 2)} ${r(y)} L${r(x + w / 2)} ${r(y - h)} L${r(x + w / 2 + t)} ${r(y - h - 0.8 * s)} L${r(x + w / 2 + t)} ${r(y - 0.8 * s)} Z" fill="#8f8572"/>`;
    g += `<path d="M${r(x - w / 2)} ${r(y - h)} L${r(x - w / 2 + t)} ${r(y - h - 0.8 * s)} L${r(x + w / 2 + t)} ${r(y - h - 0.8 * s)} L${r(x + w / 2)} ${r(y - h)} Z" fill="#a89c84"/>`;
    /* Zinnen auf dem Dach des Turms */
    for (let i = 0; i < 4; i++) g += `<rect x="${r(x - w / 2 + 0.3 + i * w / 4)}" y="${r(y - h - 1.1 * s)}" width="${r(w / 8)}" height="${r(1.1 * s)}" fill="#c9bea6"/>`;
    /* zwei Geschosse: unten drei Bogenfenster */
    for (let i = 0; i < 3; i++) { const fx = x - w / 2 + w * (0.2 + i * 0.3); g += `<path d="M${r(fx - 0.45 * s)} ${r(y - 1.6 * s)} L${r(fx - 0.45 * s)} ${r(y - 3.2 * s)} Q${r(fx)} ${r(y - 3.9 * s)} ${r(fx + 0.45 * s)} ${r(y - 3.2 * s)} L${r(fx + 0.45 * s)} ${r(y - 1.6 * s)} Z" fill="#3b342b"/>`; }
    g += `<rect x="${r(x - w / 2)}" y="${r(y - 4.6 * s)}" width="${r(w)}" height="${r(0.35 * s)}" fill="#a89c84"/>`;
    g += `<rect x="${r(x - w / 2)}" y="${r(y - h)}" width="${r(0.6 * s)}" height="${r(h)}" fill="#fff4dc" opacity=".35"/>`;
    return g;
  };
  const mauer = (pts) => {
    let g = `<path d="${glatt(zug(pts, 1.6))}" stroke="#7d735f" stroke-width="2.6" fill="none" stroke-linejoin="round"/>`;
    g += `<path d="${glatt(zug(pts, 0.8))}" stroke="#c4b89f" stroke-width="1.4" fill="none" stroke-linejoin="round"/>`;
    g += `<path d="${glatt(zug(pts, 0.2))}" stroke="#d9cfb8" stroke-width=".5" fill="none"/>`;
    /* Zinnen: kleine Zähne entlang des Kamms */
    for (let i = 1; i < pts.length; i++) {
      const [xa, ya] = pts[i - 1], [xb, yb] = pts[i], n = Math.max(2, Math.round(Math.hypot(xb - xa, yb - ya) / 1.6));
      for (let j = 0; j < n; j += 2) { const t = j / n, x = xa + (xb - xa) * t, y = ya + (yb - ya) * t; g += `<rect x="${r(x - 0.35)}" y="${r(y - 0.9)}" width=".7" height="1" fill="#b3a78e"/>`; }
    }
    return g;
  };
  k += mauer(KAMM_L) + mauer(KAMM_R);
  /* steile Treppe zwischen 22 und 40 (Lupe) */
  for (let i = 0; i < 12; i++) { const t = i / 12, x = 22 + 18 * t, y = 54 - 18 * t + 1.6; k += `<line x1="${r(x - 0.7)}" y1="${r(y)}" x2="${r(x + 0.7)}" y2="${r(y)}" stroke="#6f6553" stroke-width=".22"/>`; }
  /* Wachtürme auf Kuppen und Sätteln */
  const tuermeL = [[10, 64.5, 0.75], [46, 35, 1], [73, 57.5, 0.8], [98, 71.5, 0.7]];
  const tuermeR = [[278, 79.5, 0.6], [318, 59.5, 0.8], [356, 66.5, 0.7], [384, 64.5, 0.65]];
  for (const [x, y, s] of [...tuermeL, ...tuermeR]) k += turm(x, y + 1.4, s);
  /* Lupe: der Wachturm auf der Kuppe, die Zinnen am Hang rechts davon, die Treppe links */
  mauerUnter.push({ id: "wachturm", de: "der Wachturm", syl: "WACH-turm", it: "la torre di guardia", itSyl: "TOR-re di GUAR-dia", en: "watchtower", x: 46, y: 36.4, kunst: flaeche(-4, -8.4, 10.4, 9.6),
    tipp: "Im Wachturm wohnten Soldaten. Bei Gefahr machten sie Rauch- und Feuerzeichen." });
  mauerUnter.push({ id: "zinne", de: "die Zinne", syl: "ZIN-ne", it: "il merlo", itSyl: "MER-lo", en: "battlement", x: 62, y: 49, kunst: flaeche(-9, -9, 15, 10),
    tipp: "Hinter den Zinnen konnten sich die Soldaten schützen." });
  mauerUnter.push({ id: "treppe", de: "die Treppe", syl: "TREP-pe", it: "la scalinata", itSyl: "sca-li-NA-ta", en: "stairs", x: 30, y: 49, kunst: flaeche(-9, -12, 15, 14),
    tipp: "Wo der Berg sehr steil ist, wird die Mauer zur Treppe." });
  S.teil({ anker: [52, 46], id: "grosse_mauer", de: "die Große Mauer", syl: "GRO-ße MAU-er", it: "la Grande Muraglia", itSyl: "GRAN-de mu-RA-glia", en: "Great Wall", x: 0, y: 0, kunst: k,
    zoom: { x: 0, y: 24, w: 96, h: 64 }, unter: mauerUnter,
    tipp: "Die Große Mauer (auch Chinesische Mauer) ist mit allen Teilen über 20 000 km lang." });
}

/* =====================================================================
   3 — DER DRACHEN (Pekinger Schwalbendrachen) am Himmel
   ===================================================================== */
{
  let k = `<path d="M3 9 Q-20 30 -60 72 Q-80 88 -104 84" stroke="#f4f1ea" stroke-width=".25" fill="none" opacity=".85"/>`;
  /* Schwalbe: breite Flügel, Gabelschwanz, bemalter Körper */
  const fl = (s) => `<path d="M0 -2 Q${8 * s} -9 ${15 * s} -6 Q${13 * s} -2 ${12 * s} 1 Q${7 * s} 0 ${2 * s} 3 Z" fill="#fbf6ea" stroke="#1d1d1d" stroke-width=".35"/>
    <path d="M${3 * s} -3 Q${8 * s} -7 ${13 * s} -5.4" stroke="#c0392b" stroke-width=".9" fill="none"/><path d="M${4 * s} -.4 Q${8 * s} -3 ${11.4 * s} -1.6" stroke="#1f5f9a" stroke-width=".6" fill="none"/>
    <circle cx="${9 * s}" cy="-3.4" r="1.1" fill="#e2b33a"/>`;
  k += fl(1) + fl(-1);
  k += `<path d="M-2 2 L-4.6 11 L-1 6.4 L0 7.6 L1 6.4 L4.6 11 L2 2 Z" fill="#fbf6ea" stroke="#1d1d1d" stroke-width=".35"/><path d="M-3 9 L-1 5 M3 9 L1 5" stroke="#c0392b" stroke-width=".5"/>`;
  k += `<ellipse cx="0" cy="-1.2" rx="2.6" ry="4" fill="#fbf6ea" stroke="#1d1d1d" stroke-width=".35"/><circle cx="-1" cy="-2.4" r=".55" fill="#1d1d1d"/><circle cx="1" cy="-2.4" r=".55" fill="#1d1d1d"/><path d="M-1.2 .4 Q0 1.4 1.2 .4" stroke="#c0392b" stroke-width=".4" fill="none"/>`;
  S.teil({ oben: true, id: "drachen", de: "der Drachen", syl: "DRA-chen", it: "l'aquilone", itSyl: "a-qui-LO-ne", en: "kite", x: 132, y: 24, kunst: k + flaeche(-16, -10, 32, 22),
    tipp: "Der Schwalbendrachen ist der typische Drachen aus Peking. Im Herbst fliegen viele im Park." });
}

/* =====================================================================
   4 — DIE PALASTMAUER (rote Mauer der Kaiserstadt) mit Bäumen dahinter
   ===================================================================== */
const TOR_D = 132, TU = uAt(TOR_D);          /* 2,51 je Meter */
const TOR_Y = yAt(TOR_D);                    /* 127,8 */
const ty = (h) => yAt(TOR_D, h);
{
  let k = "";
  /* alte Zypressen und Herbstbäume hinter der Mauer */
  for (const [x0, x1] of [[-4, 34], [328, 404]]) {
    for (let i = 0; i < 14; i++) {
      const x = x0 + rnd() * (x1 - x0), y = ty(8) - 2 - rnd() * 14;
      k += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(4 + rnd() * 4)}" ry="${r(5 + rnd() * 4)}" fill="${["#3d5a3a", "#4a6a40", "#7a8a3e", "#c9a03a", "#33502f"][Math.floor(rnd() * 5)]}"/>`;
    }
  }
  const mauer = (x0, x1) => {
    let g = `<rect x="${x0}" y="${r(ty(7))}" width="${x1 - x0}" height="${r(TOR_Y - ty(7))}" fill="${ROT}"/>`;
    g += `<rect x="${x0}" y="${r(ty(7) - 2.4)}" width="${x1 - x0}" height="2.6" fill="url(#${S.id("ziegel")})"/><rect x="${x0}" y="${r(ty(7) - 2.8)}" width="${x1 - x0}" height=".7" fill="#c98e12"/><rect x="${x0}" y="${r(ty(7) + 0.1)}" width="${x1 - x0}" height=".9" fill="#5a1a10" opacity=".35"/>`;
    g += `<rect x="${x0}" y="${r(TOR_Y - 2)}" width="${x1 - x0}" height="2" fill="#d9d4c8"/>`;
    return g;
  };
  k += mauer(-2, 32) + mauer(328, 402);
  S.teil({ anker: [16, 118], id: "palastmauer", de: "die Palastmauer", syl: "pa-LAST-mau-er", it: "il muro del palazzo", itSyl: "MU-ro del pa-LAZ-zo", en: "palace wall", x: 0, y: 0, kunst: k,
    tipp: "Die roten Mauern mit gelben Ziegeln umgaben einst die Kaiserstadt." });
}

/* =====================================================================
   5 — DAS TOR DES HIMMLISCHEN FRIEDENS (Tian'anmen)
       Lupe: Dachfigur, Dachziegel, Palastlaterne, Säule, Geländer
   ===================================================================== */
const torUnter = [];
const BAU = { podL: -150, podR: 150, hPod: 13, sauleL: -71, sauleR: 71, joch: 142 / 9 };
{
  const X = (m) => CX + m;     /* m: Einheiten vom Mittelpunkt */
  let k = "";
  /* ---- Torbau (roter Sockel) mit leichter Böschung ---- */
  const yTop = ty(BAU.hPod), yFuss = ty(1.2);
  k += `<path d="M${X(-151)} ${r(TOR_Y)} L${X(-148)} ${r(yTop)} L${X(148)} ${r(yTop)} L${X(151)} ${r(TOR_Y)} Z" fill="${ROT}"/>`;
  k += `<path d="M${X(-151)} ${r(TOR_Y)} L${X(-148)} ${r(yTop)} L${X(148)} ${r(yTop)} L${X(151)} ${r(TOR_Y)} Z" fill="${S.lg("podlicht", [[0, "#fff1d6", 0.16], [0.5, "#fff1d6", 0.04], [1, "#2a0a06", 0.12]], 0, 0, 1, 0)}"/>`;
  /* Putzflecken */
  for (let i = 0; i < 40; i++) k += `<rect x="${r(X(-146 + rnd() * 292))}" y="${r(yTop + 2 + rnd() * (yFuss - yTop - 4))}" width="${r(1 + rnd() * 3)}" height=".5" fill="#8e2618" opacity=".25"/>`;
  /* weißer Marmorfuß (Xumizuo) mit Profilen */
  k += `<rect x="${X(-152)}" y="${r(yFuss)}" width="304" height="${r(TOR_Y - yFuss)}" fill="${MARMOR}"/>`;
  k += `<rect x="${X(-152)}" y="${r(yFuss + 0.9)}" width="304" height=".5" fill="#b9b4a6"/><rect x="${X(-152)}" y="${r(TOR_Y - 0.6)}" width="304" height=".6" fill="#a9a497"/>`;
  /* fünf Torbögen: Mitte groß, dann kleiner */
  const boegen = [[0, 5.6, 8.2], [-40, 4.4, 7], [40, 4.4, 7], [-75, 3.6, 6], [75, 3.6, 6]];
  for (const [m, b, h] of boegen) {
    const w = b * TU / 2, yb = ty(h), ys = ty(h - b / 2);
    k += `<path d="M${r(X(m) - w - 0.9)} ${r(yFuss)} L${r(X(m) - w - 0.9)} ${r(ys)} A${r(w + 0.9)} ${r(w + 0.9)} 0 0 1 ${r(X(m) + w + 0.9)} ${r(ys)} L${r(X(m) + w + 0.9)} ${r(yFuss)} Z" fill="#8c2316"/>`;
    k += `<path d="M${r(X(m) - w)} ${r(yFuss)} L${r(X(m) - w)} ${r(ys)} A${r(w)} ${r(w)} 0 0 1 ${r(X(m) + w)} ${r(ys)} L${r(X(m) + w)} ${r(yFuss)} Z" fill="${S.lg("tunnel", [[0, "#1d120c"], [1, "#3a241a"]])}"/>`;
    /* Licht am anderen Ende des Durchgangs (Nordseite) */
    k += `<path d="M${r(X(m) - w * 0.42)} ${r(yFuss)} L${r(X(m) - w * 0.42)} ${r(ys + w * 0.35)} A${r(w * 0.42)} ${r(w * 0.42)} 0 0 1 ${r(X(m) + w * 0.42)} ${r(ys + w * 0.35)} L${r(X(m) + w * 0.42)} ${r(yFuss)} Z" fill="#d9c9a2" opacity=".55"/>`;
    /* offene rote Torflügel mit goldenen Nägeln */
    for (const sd of [-1, 1]) {
      const xa = X(m) + sd * w, xb = X(m) + sd * w * 0.62;
      k += `<path d="M${r(xa)} ${r(yFuss)} L${r(xa)} ${r(ys)} L${r(xb)} ${r(ys + 1.4)} L${r(xb)} ${r(yFuss)} Z" fill="#9a2418"/>`;
      for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) k += `<circle cx="${r(xa + (xb - xa) * (0.3 + j * 0.4))}" cy="${r(ys + 2 + i * (yFuss - ys - 3) / 4)}" r=".28" fill="#e8c35a"/>`;
    }
  }
  /* Porträt über dem Mitteltor (nur angedeutet) und die zwei Spruchbänder */
  const pT = ty(12.4), pB = ty(7.9), pw = 3.8 * TU / 2;
  k += `<rect x="${r(X(0) - pw - 0.6)}" y="${r(pT - 0.6)}" width="${r(2 * pw + 1.2)}" height="${r(pB - pT + 1.2)}" fill="#6b5a2a"/><rect x="${r(X(0) - pw)}" y="${r(pT)}" width="${r(2 * pw)}" height="${r(pB - pT)}" fill="${S.lg("bildgrund", [[0, "#cfd6cf"], [1, "#a9b4ab"]])}"/>`;
  k += `<path d="M${r(X(0) - pw + 0.6)} ${r(pB)} Q${r(X(0) - pw + 1)} ${r(pB - 3.6)} ${X(0)} ${r(pB - 4)} Q${r(X(0) + pw - 1)} ${r(pB - 3.6)} ${r(X(0) + pw - 0.6)} ${r(pB)} Z" fill="#59605f"/><ellipse cx="${X(0)}" cy="${r(pT + 3.6)}" rx="1.9" ry="2.4" fill="#d9b48f"/><path d="M${X(0) - 2} ${r(pT + 2.6)} Q${X(0)} ${r(pT + 0.4)} ${X(0) + 2} ${r(pT + 2.6)}" fill="#2b2b2b"/>`;
  for (const sd of [-1, 1]) {
    const xm = X(sd * 72);
    for (let i = 0; i < 9; i++) { const gx = xm - 20 + i * 4.6, gy = ty(10.6); k += `<path d="M${r(gx)} ${r(gy)} h2.6 M${r(gx + 1.3)} ${r(gy - 1.2)} v2.8 M${r(gx + 0.2)} ${r(gy + 1.2)} l2.2 -.6" stroke="#fbf3dc" stroke-width=".45" fill="none"/>`; }
  }
  /* weißes Marmorgeländer oben am Torbau */
  const gT = ty(BAU.hPod + 1.2);
  k += `<rect x="${X(-148)}" y="${r(gT)}" width="296" height="${r(yTop - gT)}" fill="${MARMOR}"/>`;
  for (let m = -147; m <= 147; m += 3.4) k += `<rect x="${r(X(m) - 0.35)}" y="${r(gT - 0.7)}" width=".7" height="${r(yTop - gT + 0.7)}" fill="#c9c4b6"/><circle cx="${r(X(m))}" cy="${r(gT - 0.8)}" r=".4" fill="#ece9e1"/>`;
  k += `<rect x="${X(-148)}" y="${r(gT + 1.2)}" width="296" height=".35" fill="#bdb8aa"/>`;
  /* ---- Torturm: Säulenhalle, Laternen, Doppeldach ---- */
  const yStufe = ty(13.6), ySk = ty(19.8), yTrauf1 = ty(20.4), yWand2 = ty(24), yTrauf2 = ty(27), yGrat = ty(30.6), yFirst = ty(33.5), yChi = ty(34.7);
  /* Stylobat */
  k += `<rect x="${X(-80)}" y="${r(yStufe)}" width="160" height="${r(gT - yStufe + 0.3)}" fill="#ddd8cc"/>`;
  /* Rückwand mit Gittertüren im Schatten */
  k += `<rect x="${X(-71)}" y="${r(ySk)}" width="142" height="${r(yStufe - ySk)}" fill="${S.lg("halle", [[0, "#4a1810"], [1, "#7a2a1a"]])}"/>`;
  for (let i = 0; i < 9; i++) {
    const x0 = X(-71 + i * BAU.joch) + 1.6, w = BAU.joch - 3.2;
    k += `<rect x="${r(x0)}" y="${r(ySk + 3.8)}" width="${r(w)}" height="${r(yStufe - ySk - 4.4)}" fill="#8f2a1a"/>`;
    for (let j = 1; j < 4; j++) k += `<line x1="${r(x0 + j * w / 4)}" y1="${r(ySk + 3.8)}" x2="${r(x0 + j * w / 4)}" y2="${r(yStufe - 0.6)}" stroke="#c99a4a" stroke-width=".22" opacity=".8"/>`;
    k += `<path d="M${r(x0)} ${r(ySk + 6)} H${r(x0 + w)} M${r(x0)} ${r(ySk + 8.6)} H${r(x0 + w)}" stroke="#c99a4a" stroke-width=".2" opacity=".7"/>`;
  }
  /* zehn rote Säulen */
  for (let i = 0; i <= 9; i++) {
    const x = X(-71 + i * BAU.joch);
    k += `<rect x="${r(x - 1)}" y="${r(ySk)}" width="2" height="${r(yStufe - ySk)}" fill="${ROT_S}"/><rect x="${r(x - 1)}" y="${r(ySk)}" width=".5" height="${r(yStufe - ySk)}" fill="#e2735a" opacity=".6"/>`;
  }
  /* Architrav mit Bemalung, darüber die blau-grünen Konsolen (Dougong) */
  k += `<rect x="${X(-73)}" y="${r(ySk - 1.6)}" width="146" height="1.8" fill="${GRUENBLAU}"/>`;
  for (let i = 0; i < 9; i++) k += `<path d="M${r(X(-71 + i * BAU.joch) + 4)} ${r(ySk - 0.7)} h${r(BAU.joch - 8)}" stroke="#f2d27a" stroke-width=".35"/>`;
  for (let m = -74; m <= 74; m += 2.3) k += `<rect x="${r(X(m) - 0.7)}" y="${r(yTrauf1 + 0.2)}" width="1.4" height="${r(ySk - 1.6 - yTrauf1 - 0.2)}" fill="${m % 4.6 < 2.3 ? "#2f8a7e" : "#1f5f8a"}"/>`;
  /* acht Palastlaternen (Mitteljoch frei) */
  const laterne = (x, y, s = 1) => `<line x1="${r(x)}" y1="${r(ySk)}" x2="${r(x)}" y2="${r(y - 3.6 * s)}" stroke="#3a2a1a" stroke-width=".25"/><rect x="${r(x - 1.6 * s)}" y="${r(y - 3.9 * s)}" width="${r(3.2 * s)}" height="${r(0.7 * s)}" fill="${GOLD}"/>
    <ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(3.1 * s)}" ry="${r(3.4 * s)}" fill="${S.rg("laterne", [[0, "#ff6a4a"], [0.55, "#e0251a"], [1, "#9a0f0a"]], 0.42, 0.38, 0.7)}"/>
    <path d="M${r(x - 1.6 * s)} ${r(y - 3.1 * s)} Q${r(x - 2.4 * s)} ${r(y)} ${r(x - 1.6 * s)} ${r(y + 3.1 * s)} M${r(x + 1.6 * s)} ${r(y - 3.1 * s)} Q${r(x + 2.4 * s)} ${r(y)} ${r(x + 1.6 * s)} ${r(y + 3.1 * s)}" stroke="#a8140c" stroke-width=".25" fill="none"/>
    <rect x="${r(x - 1.6 * s)}" y="${r(y + 3.2 * s)}" width="${r(3.2 * s)}" height="${r(0.7 * s)}" fill="${GOLD}"/><path d="M${r(x - 1.2 * s)} ${r(y + 3.9 * s)} L${r(x - 1.4 * s)} ${r(y + 6.4 * s)} L${r(x + 1.4 * s)} ${r(y + 6.4 * s)} L${r(x + 1.2 * s)} ${r(y + 3.9 * s)} Z" fill="#f2c23a"/>`;
  const latY = r((ySk + yStufe) / 2 - 2);
  for (let i = 0; i < 9; i++) if (i !== 4) k += laterne(X(-71 + (i + 0.5) * BAU.joch), latY, 0.95);
  /* untere Traufe (Walm) mit hochgezogenen Ecken */
  const dach = (yE, yO, wE, wO, hoch) => {
    const d = `M${X(-wE - 2)} ${r(yE - hoch)} Q${X(-wE + 6)} ${r(yE + 0.6)} ${X(-wE + 16)} ${r(yE)} L${X(wE - 16)} ${r(yE)} Q${X(wE - 6)} ${r(yE + 0.6)} ${X(wE + 2)} ${r(yE - hoch)} L${X(wO)} ${r(yO)} L${X(-wO)} ${r(yO)} Z`;
    let g = `<path d="${d}" fill="url(#${S.id("ziegel")})"/><path d="${d}" fill="${S.lg("dachlicht", [[0, "#fff6c8", 0.25], [0.5, "#fff6c8", 0], [1, "#5a3a00", 0.25]])}"/>`;
    /* Traufkante: runde Ziegelenden, darunter rot-grün bemalte Sparren */
    g += `<path d="M${X(-wE - 2)} ${r(yE - hoch)} Q${X(-wE + 6)} ${r(yE + 0.6)} ${X(-wE + 16)} ${r(yE)} L${X(wE - 16)} ${r(yE)} Q${X(wE - 6)} ${r(yE + 0.6)} ${X(wE + 2)} ${r(yE - hoch)}" stroke="#a86c08" stroke-width=".9" fill="none"/>`;
    for (let m = -wE + 14; m <= wE - 14; m += 1.6) g += `<circle cx="${r(X(m))}" cy="${r(yE + 0.2)}" r=".42" fill="#f3c64a"/>`;
    g += `<path d="M${X(-wE + 14)} ${r(yE + 1.1)} H${X(wE - 14)}" stroke="#1f6d8a" stroke-width=".7"/><path d="M${X(-wE + 14)} ${r(yE + 1.7)} H${X(wE - 14)}" stroke="#b0261c" stroke-width=".5"/>`;
    return g;
  };
  /* Obergeschoss: rote Wand, Fenster, Konsolen */
  k += `<rect x="${X(-71)}" y="${r(yTrauf2)}" width="142" height="${r(yWand2 - yTrauf2)}" fill="${S.lg("wand2", [[0, "#5a1a10"], [1, "#9a2a1a"]])}"/>`;
  for (let i = 0; i < 9; i++) { const x0 = X(-71 + i * BAU.joch) + 2.2; k += `<rect x="${r(x0)}" y="${r(yTrauf2 + 3)}" width="${r(BAU.joch - 4.4)}" height="${r(yWand2 - yTrauf2 - 3.4)}" fill="#a83020"/><path d="M${r(x0)} ${r(yTrauf2 + 4.6)} h${r(BAU.joch - 4.4)}" stroke="#c99a4a" stroke-width=".2"/>`; }
  for (let m = -72; m <= 72; m += 2.3) k += `<rect x="${r(X(m) - 0.7)}" y="${r(yTrauf2 + 0.2)}" width="1.4" height="2.6" fill="${m % 4.6 < 2.3 ? "#2f8a7e" : "#1f5f8a"}"/>`;
  k += dach(yTrauf1, yWand2, 87, 71, 2.6);
  /* oberes Dach: Walmteil, dann Giebelteil bis zum First */
  const dO = `M${X(-89)} ${r(yTrauf2 - 2.8)} Q${X(-81)} ${r(yTrauf2 + 0.6)} ${X(-71)} ${r(yTrauf2)} L${X(71)} ${r(yTrauf2)} Q${X(81)} ${r(yTrauf2 + 0.6)} ${X(89)} ${r(yTrauf2 - 2.8)} L${X(62)} ${r(yGrat)} L${X(57)} ${r(yFirst)} L${X(-57)} ${r(yFirst)} L${X(-62)} ${r(yGrat)} Z`;
  k += `<path d="${dO}" fill="url(#${S.id("ziegel")})"/><path d="${dO}" fill="${S.lg("dachlicht", [])}"/>`;
  k += `<path d="M${X(-89)} ${r(yTrauf2 - 2.8)} Q${X(-81)} ${r(yTrauf2 + 0.6)} ${X(-71)} ${r(yTrauf2)} L${X(71)} ${r(yTrauf2)} Q${X(81)} ${r(yTrauf2 + 0.6)} ${X(89)} ${r(yTrauf2 - 2.8)}" stroke="#a86c08" stroke-width=".9" fill="none"/>`;
  for (let m = -70; m <= 70; m += 1.6) k += `<circle cx="${r(X(m))}" cy="${r(yTrauf2 + 0.2)}" r=".42" fill="#f3c64a"/>`;
  /* Grate (Walm) und Giebelkanten */
  for (const sd of [-1, 1]) {
    k += `<path d="M${X(sd * 88)} ${r(yTrauf2 - 2.6)} L${X(sd * 62)} ${r(yGrat)} L${X(sd * 57)} ${r(yFirst)}" stroke="#c88a10" stroke-width="1.3" fill="none" stroke-linecap="round"/>`;
    k += `<path d="M${X(sd * 86)} ${r(yTrauf1 - 2.4)} L${X(sd * 72)} ${r(yWand2 + 0.4)}" stroke="#c88a10" stroke-width="1.2" fill="none" stroke-linecap="round"/>`;
    /* Dachfiguren: der Reiter auf dem Phönix vorn, dahinter die Tiere */
    for (const [ax, ay, bx, by] of [[88, yTrauf2 - 2.6, 62, yGrat], [86, yTrauf1 - 2.4, 72, yWand2 + 0.4]]) {
      for (let i = 0; i < 9; i++) {
        const t = 0.06 + i * 0.075, fx = X(sd * (ax + (bx - ax) * t)), fy = ay + (by - ay) * t;
        k += i === 0 ? `<path d="M${r(fx - 0.5)} ${r(fy - 0.4)} q.5 -1.8 1 0 Z" fill="#3a6e4a"/><circle cx="${r(fx)}" cy="${r(fy - 1.6)}" r=".3" fill="#e8c35a"/>`
          : `<path d="M${r(fx - 0.45)} ${r(fy - 0.3)} q.1 -1.2 .45 -1.1 q.4 .1 .45 1.1 Z" fill="${i % 2 ? "#d9a21e" : "#b98510"}"/>`;
      }
    }
  }
  /* First mit Drachenköpfen (Chiwen) */
  k += `<rect x="${X(-57)}" y="${r(yFirst - 1.4)}" width="114" height="1.6" rx=".4" fill="#c88a10"/><rect x="${X(-57)}" y="${r(yFirst - 1.4)}" width="114" height=".5" fill="#f6d36a"/>`;
  for (const sd of [-1, 1]) k += `<path d="M${X(sd * 57)} ${r(yFirst)} L${X(sd * 57)} ${r(yChi + 0.4)} Q${X(sd * 57.8)} ${r(yChi - 1.4)} ${X(sd * 59.4)} ${r(yChi - 0.6)} Q${X(sd * 60.2)} ${r(yChi + 0.8)} ${X(sd * 59.2)} ${r(yChi + 1.2)} Q${X(sd * 60.6)} ${r(yFirst - 0.6)} ${X(sd * 58.8)} ${r(yFirst)} Z" fill="#c88a10" stroke="#8a5a06" stroke-width=".25"/>`;
  /* Schatten unter den Traufen */
  k += `<rect x="${X(-80)}" y="${r(yTrauf1 + 2)}" width="160" height="2.4" fill="#000" opacity=".18"/>`;
  S.teil({ anker: [180, 62], id: "tor", de: "das Tor des Himmlischen Friedens", syl: "TOR des HIMM-li-schen FRIE-dens", it: "la Porta della Pace Celeste", itSyl: "POR-ta del-la PA-ce ce-LE-ste", en: "Gate of Heavenly Peace", x: 0, y: 0, kunst: k,
    zoom: { x: 92, y: 38, w: 96, h: 64 }, unter: torUnter,
    tipp: "Auf Chinesisch heißt das Tor „Tian'anmen“. Es ist 35 Meter hoch und führt zur Verbotenen Stadt." });
  /* Lupe */
  torUnter.push({ id: "dachfigur", de: "die Dachfigur", syl: "DACH-fi-gur", it: "la statuetta del tetto", itSyl: "sta-tu-ET-ta del TET-to", en: "roof figure", x: X(-82), y: r(yTrauf2 - 2), kunst: flaeche(-5, -7, 12, 8),
    tipp: "Auf dem Grat sitzen kleine Tiere hinter einem Reiter. Je mehr Tiere, desto wichtiger das Gebäude." });
  torUnter.push({ id: "dachziegel", de: "der Dachziegel", syl: "DACH-zie-gel", it: "la tegola", itSyl: "TE-go-la", en: "roof tile", x: X(-30), y: r(yTrauf2 - 1), kunst: flaeche(-16, -14, 32, 13),
    tipp: "Gelb glasierte Ziegel durfte nur der Kaiser benutzen." });
  torUnter.push({ id: "palastlaterne", de: "die Palastlaterne", syl: "pa-LAST-la-ter-ne", it: "la lanterna di palazzo", itSyl: "lan-TER-na di pa-LAZ-zo", en: "palace lantern", x: X(-71 + 2.5 * BAU.joch), y: latY + 6.5, kunst: flaeche(-4, -11, 8, 12.5),
    tipp: "Acht große rote Laternen hängen am Tor — seit 1949." });
  torUnter.push({ id: "saeule", de: "die Säule", syl: "SÄU-le", it: "la colonna", itSyl: "co-LON-na", en: "column", x: X(-71 + BAU.joch), y: r(yStufe), kunst: flaeche(-1.6, -(yStufe - ySk), 3.2, yStufe - ySk) });
  torUnter.push({ id: "gelaender", de: "das Geländer", syl: "ge-LÄN-der", it: "la balaustra", itSyl: "ba-la-U-stra", en: "railing", x: X(-35), y: r(yTop), kunst: flaeche(-14, -(yTop - gT) - 1.2, 28, yTop - gT + 1.4),
    tipp: "Das Geländer ist aus weißem Marmor." });
}
/* DER TORBOGEN — der große Mitteldurchgang (eigenes Teil, liegt im Torbau) */
{
  const w = 5.6 * TU / 2, ys = ty(8.2 - 2.8), yF = ty(1.2);
  S.teil({ oben: true, id: "torbogen", de: "der Torbogen", syl: "TOR-bo-gen", it: "l'arco della porta", itSyl: "AR-co del-la POR-ta", en: "archway", x: CX, y: r(yF), kunst: flaeche(-w, -(yF - ys) - w, 2 * w, yF - ys + w),
    tipp: "Durch das mittlere, größte Tor durfte früher nur der Kaiser gehen." });
}

/* =====================================================================
   6 — DIE BRÜCKE (Goldwasserbrücken), 7 — DIE MARMORSÄULE (Huabiao),
   8 — DER LÖWE
   ===================================================================== */
{
  const d = 118, u = uAt(d), yD = yAt(d, 0.4);
  let k = "";
  /* Flussbett: Ufermauer mit weißem Geländer über die ganze Breite */
  k += `<rect x="-2" y="${r(yAt(d, 0.9))}" width="404" height="${r(yAt(d - 6, 0) - yAt(d, 0.9))}" fill="${S.lg("ufer", [[0, "#cfc9bb"], [1, "#a9a393"]])}"/>`;
  k += `<rect x="-2" y="${r(yAt(d - 6, 0.9))}" width="404" height=".7" fill="#ece9e1"/>`;
  for (let x = 0; x < 402; x += 2.6) k += `<rect x="${r(x)}" y="${r(yAt(d - 6, 0.9) - 0.4)}" width=".5" height="1.6" fill="#e3e0d6"/>`;
  /* fünf Brücken: flache Buckel mit Brüstung */
  for (const [m, b] of [[0, 14], [-40, 9], [40, 9], [-75, 8], [75, 8]]) {
    const w = b * u / 2, x = CX + m * TU / u * (u / TU), cx = CX + m * (u / TU);
    k += `<path d="M${r(cx - w - 1.4)} ${r(yD + 1.2)} Q${r(cx)} ${r(yD - 2.6)} ${r(cx + w + 1.4)} ${r(yD + 1.2)} L${r(cx + w + 1.4)} ${r(yD + 2.6)} Q${r(cx)} ${r(yD - 0.8)} ${r(cx - w - 1.4)} ${r(yD + 2.6)} Z" fill="${MARMOR}"/>`;
    k += `<path d="M${r(cx - w - 1.4)} ${r(yD + 1.2)} Q${r(cx)} ${r(yD - 2.6)} ${r(cx + w + 1.4)} ${r(yD + 1.2)}" stroke="#fffdf6" stroke-width=".5" fill="none"/>`;
    for (let i = 0; i <= 6; i++) { const t = i / 6, px = cx - w - 1.4 + t * (2 * w + 2.8), py = yD + 1.2 - Math.sin(t * Math.PI) * 1.9; k += `<rect x="${r(px - 0.3)}" y="${r(py - 1.1)}" width=".6" height="1.2" fill="#e9e6dd"/>`; }
    void x;
  }
  S.teil({ anker: [CX, 125], id: "bruecke", de: "die Brücke", syl: "BRÜ-cke", it: "il ponte", itSyl: "PON-te", en: "bridge", x: 0, y: 0, kunst: k,
    tipp: "Vor dem Tor führen weiße Marmorbrücken über den „Goldwasserfluss“." });
}
{
  /* zwei Huabiao: Sockel mit Gitter, Schaft mit Drachen, Wolkenplatte, Tier obenauf */
  const d = 106, u = uAt(d);
  let k = "";
  for (const s of [-20, 20]) {
    const x = xAt(s, d), y0 = yAt(d), h = (m) => yAt(d, m);
    k += schatten(x + 2, y0, 6, 0.9, 0.25);
    k += `<rect x="${r(x - 3.4)}" y="${r(h(1.2))}" width="6.8" height="${r(y0 - h(1.2))}" fill="${MARMOR}"/><rect x="${r(x - 3.4)}" y="${r(h(1.2))}" width="6.8" height=".5" fill="#fffdf6"/>`;
    for (let i = 0; i < 6; i++) k += `<rect x="${r(x - 3.2 + i * 1.3)}" y="${r(h(1.2) - 1.1)}" width=".35" height="1.2" fill="#e9e6dd"/>`;
    k += `<rect x="${r(x - 3.4)}" y="${r(h(1.2) - 1.3)}" width="6.8" height=".35" fill="#e9e6dd"/>`;
    k += `<path d="M${r(x - 2.2)} ${r(h(1.2))} L${r(x - 1.8)} ${r(h(2.2))} L${r(x + 1.8)} ${r(h(2.2))} L${r(x + 2.2)} ${r(h(1.2))} Z" fill="#dcd8cc"/>`;
    k += `<rect x="${r(x - 1.25)}" y="${r(h(8.2))}" width="2.5" height="${r(h(2.2) - h(8.2))}" fill="${MARMOR_V}"/>`;
    /* der Drache windet sich um den Schaft */
    for (let i = 0; i < 7; i++) { const yy = h(2.6 + i * 0.8); k += `<path d="M${r(x - 1.25)} ${r(yy + 0.8)} Q${r(x)} ${r(yy - 0.3)} ${r(x + 1.25)} ${r(yy - 0.6)}" stroke="#b9b4a6" stroke-width=".35" fill="none"/>`; }
    k += `<circle cx="${r(x + 0.6)}" cy="${r(h(7.6))}" r=".5" fill="#c9c4b6"/>`;
    /* Wolkenplatte schräg durch den Schaft */
    k += `<path d="M${r(x - 4.2)} ${r(h(7.2))} Q${r(x - 3)} ${r(h(7.9))} ${r(x)} ${r(h(7.4))} Q${r(x + 3)} ${r(h(7.0))} ${r(x + 4.2)} ${r(h(7.6))} L${r(x + 3.8)} ${r(h(7.1))} Q${r(x)} ${r(h(6.8))} ${r(x - 3.8)} ${r(h(6.7))} Z" fill="#efece4" stroke="#bdb8aa" stroke-width=".2"/>`;
    /* Tauteller und das sitzende Tier (Hou) */
    k += `<ellipse cx="${r(x)}" cy="${r(h(8.4))}" rx="2.2" ry=".55" fill="#e3e0d6"/><rect x="${r(x - 1.6)}" y="${r(h(8.9))}" width="3.2" height="${r(h(8.4) - h(8.9))}" fill="#d7d3c8"/>`;
    k += `<path d="M${r(x - 1.1)} ${r(h(8.9))} Q${r(x - 1.3)} ${r(h(9.5))} ${r(x - 0.4)} ${r(h(9.6))} Q${r(x + 0.6)} ${r(h(9.9))} ${r(x + 0.9)} ${r(h(9.4))} L${r(x + 1)} ${r(h(8.9))} Z" fill="#efece4"/>`;
    k += `<rect x="${r(x - 1.25)}" y="${r(h(8.2))}" width=".45" height="${r(h(2.2) - h(8.2))}" fill="#fff" opacity=".45"/>`;
  }
  S.teil({ anker: [xAt(-20, d), yAt(d, 5)], id: "marmorsaeule", de: "die Marmorsäule", syl: "MAR-mor-säu-le", it: "la colonna di marmo", itSyl: "co-LON-na di MAR-mo", en: "marble column", x: 0, y: 0, kunst: k,
    tipp: "Diese Säulen heißen Huabiao. Um jede windet sich ein Drache aus Marmor." });
}
{
  const d = 110;
  let k = "";
  for (const [s, sp] of [[-11, 1], [11, -1]]) {
    const x = xAt(s, d), y0 = yAt(d), h = (m) => yAt(d, m);
    k += `<path d="M${r(x - 3)} ${r(y0)} L${r(x - 3)} ${r(h(0.5))} L${r(x - 2.5)} ${r(h(0.6))} L${r(x - 2.5)} ${r(h(1.3))} L${r(x - 3)} ${r(h(1.45))} L${r(x + 3)} ${r(h(1.45))} L${r(x + 2.5)} ${r(h(1.3))} L${r(x + 2.5)} ${r(h(0.6))} L${r(x + 3)} ${r(h(0.5))} L${r(x + 3)} ${r(y0)} Z" fill="${MARMOR}"/>`;
    /* sitzender Löwe mit Lockenmähne, Pfote auf Ball bzw. Jungem */
    k += `<path d="M${r(x - 1.8 * sp)} ${r(h(1.45))} L${r(x - 1.9 * sp)} ${r(h(2.4))} Q${r(x - 1.6 * sp)} ${r(h(3.3))} ${r(x - 0.2 * sp)} ${r(h(3.5))} Q${r(x + 1.6 * sp)} ${r(h(3.6))} ${r(x + 1.6 * sp)} ${r(h(2.7))} L${r(x + 1.4 * sp)} ${r(h(1.45))} Z" fill="#b8b2a2"/>`;
    for (let i = 0; i < 6; i++) k += `<circle cx="${r(x + (-0.8 + (i % 3) * 0.8) * sp)}" cy="${r(h(3.2 - Math.floor(i / 3) * 0.45))}" r=".38" fill="#a49d8c"/>`;
    k += `<circle cx="${r(x + 1.2 * sp)}" cy="${r(h(1.7))}" r=".55" fill="#a49d8c"/>`;
  }
  S.teil({ anker: [xAt(-11, d), yAt(d, 2.4)], id: "loewe", de: "der Löwe", syl: "LÖ-we", it: "il leone", itSyl: "le-O-ne", en: "lion", x: 0, y: 0, kunst: k,
    tipp: "Steinlöwen bewachen das Tor: links die Löwin mit dem Jungen, rechts der Löwe mit dem Ball." });
}

/* =====================================================================
   9 — DIE STRASSE (Chang'an-Straße) und der Gehweg
   ===================================================================== */
{
  const y0 = yAt(104), y1 = yAt(20);
  let k = `<rect x="-2" y="${r(y0)}" width="404" height="${r(y1 - y0)}" fill="${S.lg("asphalt", [[0, "#8a8783"], [1, "#5d5b58"]])}"/>`;
  /* Gehweg auf der Nordseite */
  k += `<rect x="-2" y="${r(yAt(110))}" width="404" height="${r(y0 - yAt(110))}" fill="#bdb7ab"/>`;
  /* Fahrspuren: weiße Striche, in der Mitte die gelbe Doppellinie */
  for (const d of [92, 78, 66, 48, 40, 33, 27]) { const y = yAt(d), u = uAt(d); for (let x = -4 + (d % 3) * 3; x < 404; x += 6 * u) k += `<rect x="${r(x)}" y="${r(y)}" width="${r(2.6 * u)}" height="${r(Math.max(0.25, 0.15 * u))}" fill="#f2f0ea" opacity=".85"/>`; }
  for (const dd of [56, 55]) k += `<rect x="-2" y="${r(yAt(dd))}" width="404" height=".45" fill="#e2b33a"/>`;
  /* Bordstein auf unserer Seite */
  k += `<rect x="-2" y="${r(y1 - 0.4)}" width="404" height="1.6" fill="#d9d4c8"/>`;
  S.teil({ anker: [60, 150], id: "strasse", de: "die Straße", syl: "STRA-ße", it: "la strada", itSyl: "STRA-da", en: "street", x: 0, y: 0, kunst: k,
    tipp: "Die Chang'an-Straße heißt „Straße des ewigen Friedens“. Sie ist zehn Spuren breit." });
}
/* Gehweg (Kulisse über der Straße: gehört zu keinem Wort) */
{
  const y1 = yAt(20);
  let f = `<path d="M-2 ${r(y1 + 1.2)} L${r(180 - 0.3125 * (y1 + 1.2 - HOR))} ${r(y1 + 1.2)} L136 262 L-2 262 Z" fill="url(#${S.id("platten")})"/>`;
  for (let i = -12; i <= 2; i++) f += `<line x1="${r(CX + i * 9)}" y1="${r(y1 + 1.2)}" x2="${r(CX + i * 9 * (262 - HOR) / (y1 + 1.2 - HOR))}" y2="262" stroke="#9c978d" stroke-width=".35"/>`;
  f += `<path d="M-2 ${r(y1 + 1.2)} L${r(180 - 0.3125 * (y1 + 1.2 - HOR))} ${r(y1 + 1.2)} L136 262 L-2 262 Z" fill="${S.lg("gehweglicht", [[0, "#fff", 0.08], [1, "#000", 0.12]])}"/>`;
  S.gehweg = f;
}

/* =====================================================================
   10 — DIE RIKSCHA und 11 — DER RIKSCHAFAHRER (auf dem Gehweg links)
   ===================================================================== */
const RI = { d: 14, x: 86 };
{
  const u = uAt(RI.d), Y = yAt(RI.d);   /* 23,6 je Meter */
  const m = (v) => r(v * u);
  let k = schatten(0, 0.2, 32, 2.2, 0.3);
  /* Räder: vorne (links) das Fahrrad-Vorderrad, hinten zwei Räder unter dem Sitz */
  const rad = (cx, cy, rr) => {
    let g = `<circle cx="${cx}" cy="${cy}" r="${rr}" fill="none" stroke="#1d1d1d" stroke-width="1.3"/><circle cx="${cx}" cy="${cy}" r="${r(rr - 0.9)}" fill="none" stroke="#9aa3aa" stroke-width=".35"/>`;
    for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; g += `<line x1="${cx}" y1="${cy}" x2="${r(cx + Math.cos(a) * (rr - 0.8))}" y2="${r(cy + Math.sin(a) * (rr - 0.8))}" stroke="#c9cfd4" stroke-width=".18"/>`; }
    return g + `<circle cx="${cx}" cy="${cy}" r=".8" fill="#6b7178"/>`;
  };
  const RR = m(0.33);
  k += rad(m(0.62), r(-RR - 1.2), RR);          /* hinteres fernes Rad (leicht versetzt) */
  /* Rahmen des Fahrrads */
  k += `<path d="M${m(-1.02)} ${r(-RR)} L${m(-0.86)} ${m(-0.86)} L${m(-0.4)} ${m(-0.86)} L${m(-0.32)} ${m(-0.42)} L${m(-1.02)} ${r(-RR)} M${m(-0.4)} ${m(-0.86)} L${m(-0.32)} ${m(-0.42)} L${m(0.1)} ${m(-0.38)}" stroke="#2a2d33" stroke-width=".9" fill="none" stroke-linejoin="round"/>`;
  k += `<path d="M${m(-0.86)} ${m(-0.86)} L${m(-0.9)} ${m(-1.02)} L${m(-0.78)} ${m(-1.06)}" stroke="#2a2d33" stroke-width=".8" fill="none"/><path d="M${m(-0.84)} ${m(-1.04)} q-1.6 -.2 -2.2 .8" stroke="#1d1d1d" stroke-width=".9" fill="none"/>`;
  k += `<path d="M${m(-0.46)} ${m(-0.9)} h${m(0.2)}" stroke="#1d1d1d" stroke-width="1.6" stroke-linecap="round"/>`;
  k += `<circle cx="${m(-0.32)}" cy="${m(-0.42)}" r="1.4" fill="none" stroke="#2a2d33" stroke-width=".5"/>`;
  k += rad(m(-1.02), r(-RR), RR);
  /* Wagenkasten: roter Lack mit Goldleiste, Sitzbank, Fußbrett */
  k += `<path d="M${m(0.02)} ${m(-0.34)} L${m(0.02)} ${m(-0.86)} Q${m(0.06)} ${m(-0.96)} ${m(0.2)} ${m(-0.96)} L${m(0.96)} ${m(-0.96)} L${m(1.06)} ${m(-0.4)} L${m(0.86)} ${m(-0.34)} Z" fill="${S.lg("rikscha", [[0, "#d23a2a"], [1, "#8c1a12"]])}"/>`;
  k += `<path d="M${m(0.06)} ${m(-0.9)} L${m(0.94)} ${m(-0.9)}" stroke="#e8c35a" stroke-width=".6"/><path d="M${m(0.12)} ${m(-0.5)} L${m(0.9)} ${m(-0.5)}" stroke="#e8c35a" stroke-width=".4"/>`;
  k += `<path d="M${m(0.3)} ${m(-0.8)} q2 -1.6 4 0 q2 1.6 4 0" stroke="#e8c35a" stroke-width=".35" fill="none"/>`;
  k += `<rect x="${m(0.12)}" y="${m(-1.08)}" width="${m(0.78)}" height="${m(0.14)}" rx="1" fill="#2a2a2a"/>`;
  /* Rückenlehne und Faltverdeck (rot mit gelben Fransen) */
  k += `<path d="M${m(0.86)} ${m(-0.96)} L${m(0.98)} ${m(-1.5)} L${m(0.8)} ${m(-1.52)} L${m(0.74)} ${m(-1.08)} Z" fill="#7a1a10"/>`;
  k += `<path d="M${m(1.0)} ${m(-1.0)} Q${m(1.1)} ${m(-1.86)} ${m(0.62)} ${m(-1.96)} Q${m(0.2)} ${m(-1.98)} ${m(0.1)} ${m(-1.72)} L${m(0.16)} ${m(-1.62)} Q${m(0.32)} ${m(-1.8)} ${m(0.6)} ${m(-1.78)} Q${m(0.94)} ${m(-1.7)} ${m(0.9)} ${m(-1.0)} Z" fill="${S.lg("verdeck", [[0, "#c8301f"], [1, "#7a1208"]])}"/>`;
  for (const t of [0.3, 0.55, 0.8]) k += `<path d="M${m(0.1 + t * 0.9)} ${m(-1.96 + t * 0.1)} L${m(0.08 + t * 0.85)} ${m(-1.1)}" stroke="#5a0e06" stroke-width=".3" opacity=".6"/>`;
  for (let i = 0; i < 9; i++) k += `<line x1="${r(m(0.14) + i * 1.2)}" y1="${m(-1.66)}" x2="${r(m(0.14) + i * 1.2)}" y2="${r(m(-1.66) + 1.6)}" stroke="#f2c23a" stroke-width=".45"/>`;
  k += rad(m(0.7), r(-RR), RR);
  /* kleine Fahne am Verdeck */
  k += `<line x1="${m(1.02)}" y1="${m(-1.4)}" x2="${m(1.08)}" y2="${m(-2.3)}" stroke="#555" stroke-width=".3"/><rect x="${m(1.08)}" y="${m(-2.3)}" width="4" height="2.6" fill="#de2910"/><circle cx="${r(m(1.08) + 1)}" cy="${r(m(-2.3) + 0.9)}" r=".45" fill="#ffde00"/>`;
  S.teil({ id: "rikscha", de: "die Rikscha", syl: "RIK-scha", it: "il risciò", itSyl: "ri-SCIÒ", en: "rickshaw", x: RI.x, y: Y, steht: true, kunst: k,
    tipp: "Mit der Fahrradrikscha fahren Besucher durch die alten Gassen, die Hutongs." });
}
{
  const u = uAt(RI.d), Y = yAt(RI.d);
  const fahrer = B.mensch({ id: "pek_fahrer", geschlecht: "m", pose: "sitzen", blick: -90, frisur: "kurz", haarfarbe: "schwarz", haut: "hell",
    kleidung: { oberteil: { stueck: "hemd", farbe: "weiss" }, unterteil: { stueck: "hose", farbe: "schwarz" }, jacke: { stueck: "weste", farbe: "schwarz" }, kopf: { stueck: "kappe", farbe: "schwarz" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" } } }, 1.72 * u);
  /* Sattel bei (−0,44 m | 0,9 m): den Sitzpunkt der Figur dorthin legen */
  const sx = -0.44 * u - fahrer.z.sitz.x * fahrer.k, sy = -0.92 * u - fahrer.z.sitz.y * fahrer.k;
  S.teil({ id: "fahrer", de: "der Rikschafahrer", syl: "RIK-scha-fah-rer", it: "il conducente del risciò", itSyl: "con-du-CEN-te del ri-SCIÒ", en: "rickshaw driver", x: RI.x, y: Y, kunst: `<g transform="translate(${r(sx)} ${r(sy)})">${fahrer.svg}</g>` });
}

/* =====================================================================
   12 — DIE TERRASSE des Restaurants (rechts): Boden, Geländer, Säule,
        Dach — dann 13 — DIE LATERNE, 14 — DER TISCH und das Essen
   ===================================================================== */
{
  /* Dielenboden: rechts der Terrassenkante x = 180 − 0,3125·(y − 120) */
  const yv = yAt(9, 1.5);
  let f = `<path d="M${r(180 - 0.3125 * (yv - HOR))} ${r(yv)} L402 ${r(yv)} L402 262 L136 262 Z" fill="${S.lg("dielen", [[0, "#7a4a28"], [1, "#9a6236"]])}"/>`;
  for (let i = -2; i <= 20; i++) { const s = -0.5 + i * 0.28; f += `<line x1="${r(xAt(s, 9))}" y1="${r(yv)}" x2="${r(CX + s * (262 - HOR) / 1.6)}" y2="262" stroke="#5e3a1e" stroke-width=".4" opacity=".7"/>`; }
  for (const d of [7.5, 6, 5, 4.2]) { const y = yAt(d, 1.5); f += `<line x1="${r(180 - 0.3125 * (y - HOR))}" y1="${r(y)}" x2="402" y2="${r(y)}" stroke="#5e3a1e" stroke-width=".25" opacity=".45"/>`; }
  f += `<path d="M${r(180 - 0.3125 * (yv - HOR))} ${r(yv)} L136 262" stroke="#4a2a14" stroke-width="1.2"/>`;
  S.terrasse = f;
}
{
  /* vorderes Geländer (d = 9): rote Pfosten, Handlauf, Gitter */
  const d = 9, yO = yAt(d, 2.5), yU = yAt(d, 1.5), x0 = xAt(-0.5, d);
  let k = `<rect x="${r(x0)}" y="${r(yO)}" width="${r(402 - x0)}" height="1.6" fill="${ROT_S}"/><rect x="${r(x0)}" y="${r(yO)}" width="${r(402 - x0)}" height=".5" fill="#e2735a" opacity=".7"/>`;
  k += `<rect x="${r(x0)}" y="${r(yU - 3.4)}" width="${r(402 - x0)}" height="1.4" fill="${ROT_S}"/>`;
  for (let s = -0.5; xAt(s, d) < 404; s += 0.9) {
    const x = xAt(s, d);
    k += `<rect x="${r(x - 1.2)}" y="${r(yO - 1.4)}" width="2.4" height="${r(yU - yO + 1.4)}" fill="${ROT_S}"/><rect x="${r(x - 1.5)}" y="${r(yO - 2.2)}" width="3" height="1" fill="#e8c35a"/>`;
    /* Gitter zwischen den Pfosten: Rauten */
    const w = 0.9 * uAt(d);
    for (let j = 0; j < 4; j++) { const a = x + 1.2 + j * (w - 2.4) / 4, b = a + (w - 2.4) / 4; k += `<path d="M${r(a)} ${r(yO + 9)} L${r((a + b) / 2)} ${r(yO + 3)} L${r(b)} ${r(yO + 9)} L${r((a + b) / 2)} ${r(yO + 15)} Z" fill="none" stroke="#9a2418" stroke-width=".6"/>`; }
    k += `<rect x="${r(x + 1.2)}" y="${r(yO + 17)}" width="${r(w - 2.4)}" height="${r(yU - 3.4 - yO - 17)}" fill="#8c1c14" opacity=".9"/>`;
  }
  S.gelaender = k;
}

/* Kulisse in der richtigen Reihenfolge: Gehweg, dann Terrassenboden */
S.hinten(S.gehweg + S.terrasse);

/* das Geländer ist ein eigenes Wort */
S.teil({ anker: [250, 160], id: "terrassengelaender", de: "das Geländer der Terrasse", syl: "ge-LÄN-der der ter-RAS-se", it: "la ringhiera", itSyl: "rin-GHIE-ra", en: "terrace railing", x: 0, y: 0, kunst: S.gelaender });

{
  /* Säule rechts und das Dach mit Ziegeln, bemalten Sparren und Balken */
  const d = 8.6, u = uAt(d), x = xAt(5.6, d);
  let k = `<rect x="${r(x - 7)}" y="16" width="14" height="${r(yAt(d, 1.5) - 16)}" fill="${S.lg("saeule", [[0, "#7a160e"], [0.3, "#c43a26"], [0.55, "#a8281a"], [1, "#5a0e08"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${r(x - 8.4)}" y="${r(yAt(d, 1.5) - 3)}" width="16.8" height="3" fill="#5a5a55"/>`;
  /* Balken mit Su-Malerei */
  k += `<rect x="262" y="12" width="140" height="10" fill="${GRUENBLAU}"/><rect x="262" y="12" width="140" height="1.2" fill="#e8c35a"/><rect x="262" y="20.6" width="140" height="1.4" fill="#b0261c"/>`;
  for (const cx of [300, 352]) k += `<ellipse cx="${cx}" cy="16.8" rx="14" ry="3.6" fill="#f3ead6"/><path d="M${cx - 9} 16.8 q4.5 -2.8 9 0 q4.5 2.8 9 0" stroke="#3a6e8a" stroke-width=".6" fill="none"/><circle cx="${cx}" cy="16.8" r="1.4" fill="#c0392b"/>`;
  for (let xx = 266; xx < 402; xx += 6) k += `<path d="M${xx} 13.6 l2 1.6 l-2 1.6" stroke="#f2d27a" stroke-width=".4" fill="none"/>`;
  /* Sparrenköpfe (blau mit weißem Punkt) und runde Ziegelenden */
  for (let xx = 258; xx < 404; xx += 4) k += `<rect x="${xx}" y="7.4" width="3" height="4.6" fill="#1f5f8a"/><circle cx="${xx + 1.5}" cy="9.4" r=".9" fill="#f6f2e6"/>`;
  k += `<path d="M250 2 Q256 7.6 266 7.4 L402 7.4 L402 -2 L250 -2 Z" fill="url(#${S.id("grauziegel")})"/>`;
  k += `<path d="M250 2 Q256 7.6 266 7.4 L402 7.4" stroke="#3e4146" stroke-width="1.2" fill="none"/>`;
  for (let xx = 266; xx < 404; xx += 2.4) k += `<circle cx="${xx}" cy="7.4" r="1" fill="#55585e"/>`;
  k += `<path d="M246 -1 Q250 3 254 2.4" stroke="#3e4146" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
  S.teil({ anker: [330, 14], id: "restaurant", de: "das Restaurant", syl: "res-tau-RANT", it: "il ristorante", itSyl: "ri-sto-RAN-te", en: "restaurant", x: 0, y: 0, kunst: k,
    tipp: "Pekingente gibt es in Peking seit über 600 Jahren — am bekanntesten am Qianmen." });
}
{
  /* zwei rote Laternen am Balken */
  let k = "";
  for (const [x, s] of [[300, 1], [354, 0.92]]) {
    const y = 40;
    k += `<line x1="${x}" y1="22" x2="${x}" y2="${r(y - 13 * s)}" stroke="#2a1a10" stroke-width=".5"/>`;
    k += `<rect x="${r(x - 6 * s)}" y="${r(y - 14 * s)}" width="${r(12 * s)}" height="${r(2.4 * s)}" rx=".6" fill="${LACK}"/><rect x="${r(x - 6 * s)}" y="${r(y + 11.6 * s)}" width="${r(12 * s)}" height="${r(2.4 * s)}" rx=".6" fill="${LACK}"/>`;
    k += `<ellipse cx="${x}" cy="${y}" rx="${r(11 * s)}" ry="${r(12.2 * s)}" fill="${S.rg("laterne2", [[0, "#ff8a5a"], [0.5, "#e2301e"], [1, "#9a120a"]], 0.4, 0.38, 0.7)}"/>`;
    for (const f of [-0.75, -0.42, 0, 0.42, 0.75]) k += `<path d="M${r(x + f * 6 * s)} ${r(y - 11.8 * s)} Q${r(x + f * 13 * s)} ${y} ${r(x + f * 6 * s)} ${r(y + 11.8 * s)}" stroke="#a8140c" stroke-width=".45" fill="none"/>`;
    k += `<text x="${x}" y="${r(y + 3 * s)}" font-size="${r(8 * s)}" text-anchor="middle" fill="#f6d36a" font-family="serif" font-weight="bold">福</text>`;
    k += `<path d="M${r(x - 3 * s)} ${r(y + 14 * s)} L${r(x - 3.6 * s)} ${r(y + 24 * s)} L${r(x + 3.6 * s)} ${r(y + 24 * s)} L${r(x + 3 * s)} ${r(y + 14 * s)} Z" fill="#f2c23a"/>`;
    for (let i = 0; i < 6; i++) k += `<line x1="${r(x - 3 * s + i * 1.2 * s)}" y1="${r(y + 16 * s)}" x2="${r(x - 3.4 * s + i * 1.36 * s)}" y2="${r(y + 24 * s)}" stroke="#c99a1a" stroke-width=".25"/>`;
    k += `<ellipse cx="${r(x - 4 * s)}" cy="${r(y - 5 * s)}" rx="${r(2.6 * s)}" ry="${r(4 * s)}" fill="#fff" opacity=".18"/>`;
  }
  S.teil({ oben: true, id: "laterne", de: "die Laterne", syl: "la-TER-ne", it: "la lanterna", itSyl: "lan-TER-na", en: "lantern", x: 0, y: 0, anker: [300, 40], kunst: k,
    tipp: "Rote Laternen bringen Glück. Das Zeichen 福 heißt „Glück“." });
}

/* ---------- der Tisch (Baxian-Tisch aus rotbraunem Lack) ---------- */
const TI = { s0: 0.5, s1: 1.6, d0: 2.8, d1: 3.8, h: 2.25 };
const tp = (s, d, h = TI.h) => [xAt(s, d), yAt(d, h)];
{
  const [a, b, c, e] = [tp(TI.s0, TI.d1), tp(TI.s1, TI.d1), tp(TI.s1, TI.d0), tp(TI.s0, TI.d0)];
  let k = `<path d="M${r(e[0])} ${r(e[1])} L${r(c[0])} ${r(c[1])} L${r(c[0])} ${r(c[1] + 14)} L${r(e[0])} ${r(e[1] + 14)} Z" fill="${LACK}"/>`;
  k += `<path d="M${r(e[0] + 3)} ${r(e[1] + 3)} L${r(c[0] - 3)} ${r(c[1] + 3)}" stroke="#c99a4a" stroke-width=".4"/>`;
  k += `<path d="M${r(e[0] + 4)} ${r(e[1] + 14)} L${r(e[0] + 4)} 262 M${r(c[0] - 4)} ${r(c[1] + 14)} L${r(c[0] - 4)} 262" stroke="#3a1008" stroke-width="5"/>`;
  k += `<path d="M${r(a[0])} ${r(a[1])} L${r(b[0])} ${r(b[1])} L${r(c[0])} ${r(c[1])} L${r(e[0])} ${r(e[1])} Z" fill="${S.lg("tischplatte", [[0, "#6a2212"], [1, "#8e3418"]])}"/>`;
  k += `<path d="M${r(a[0])} ${r(a[1])} L${r(b[0])} ${r(b[1])} L${r(c[0])} ${r(c[1])} L${r(e[0])} ${r(e[1])} Z" fill="${S.lg("tischglanz", [[0, "#fff", 0], [0.45, "#ffe8c8", 0.16], [0.6, "#fff", 0]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${r(e[0])} ${r(e[1])} L${r(c[0])} ${r(c[1])}" stroke="#b05a30" stroke-width=".6"/>`;
  S.teil({ anker: [300, 236], id: "tisch", de: "der Tisch", syl: "TISCH", it: "il tavolo", itSyl: "TA-vo-lo", en: "table", x: 0, y: 0, kunst: k });
}
/* ---------- die Pekingente mit Lupe: Pfannkuchen, Soße, Frühlingszwiebel, Gurke ---------- */
const enteUnter = [];
{
  const [px, py] = tp(0.72, 3.42);
  let k = `<ellipse cx="${r(px)}" cy="${r(py)}" rx="22" ry="4.2" fill="#f4f1ea"/><ellipse cx="${r(px)}" cy="${r(py - 0.3)}" rx="19.4" ry="3.2" fill="#e8e3d6"/>`;
  k += `<path d="M${r(px - 18)} ${r(py)} A20 3.6 0 0 0 ${r(px + 18)} ${r(py)}" stroke="#2a5aa0" stroke-width=".6" fill="none"/>`;
  /* die ganze Ente: Rumpf, Keulen, Hals; lackglänzend */
  const D = S.lg("ente", [[0, "#d98a3a"], [0.45, "#a8501c"], [1, "#5e260a"]], 0, 0, 0, 1);
  k += `<path d="M${r(px - 15)} ${r(py - 1)} Q${r(px - 16)} ${r(py - 10)} ${r(px - 4)} ${r(py - 12.4)} Q${r(px + 8)} ${r(py - 13)} ${r(px + 13)} ${r(py - 6)} Q${r(px + 14)} ${r(py - 1)} ${r(px + 9)} ${r(py)} Z" fill="${D}"/>`;
  k += `<path d="M${r(px + 10)} ${r(py - 5)} Q${r(px + 17)} ${r(py - 9)} ${r(px + 19)} ${r(py - 4)} Q${r(px + 18)} ${r(py - 1)} ${r(px + 13)} ${r(py - 1.6)} Z" fill="${D}"/>`;
  k += `<path d="M${r(px - 13)} ${r(py - 3)} Q${r(px - 19)} ${r(py - 5)} ${r(px - 18)} ${r(py - 1)}" stroke="#7a3410" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
  k += `<path d="M${r(px - 9)} ${r(py - 10)} Q${r(px - 1)} ${r(py - 12.6)} ${r(px + 8)} ${r(py - 9.4)}" stroke="#ffd9a0" stroke-width="1.2" fill="none" opacity=".75"/>`;
  k += `<ellipse cx="${r(px - 4)}" cy="${r(py - 9.6)}" rx="3" ry="1" fill="#fff" opacity=".45"/>`;
  /* ein paar aufgeschnittene Hautscheiben vorne */
  for (let i = 0; i < 4; i++) k += `<path d="M${r(px - 10 + i * 5)} ${r(py + 1.6)} q2.4 -2 4.6 -.4 l-.6 1 Z" fill="#c76a26" stroke="#f3e2c8" stroke-width=".35"/>`;
  /* Bambuskorb mit Pfannkuchen */
  const [bx, by] = tp(0.56, 2.95);
  let korb = `<ellipse cx="${r(bx)}" cy="${r(by)}" rx="9" ry="2.2" fill="#a07a3a"/><rect x="${r(bx - 9)}" y="${r(by - 6)}" width="18" height="6" fill="${S.lg("bambus", [[0, "#d9b46a"], [1, "#a8823e"]], 0, 0, 1, 0)}"/>`;
  korb += `<path d="M${r(bx - 9)} ${r(by - 3)} h18" stroke="#8a6a2a" stroke-width=".4"/><ellipse cx="${r(bx)}" cy="${r(by - 6)}" rx="9" ry="2.2" fill="#e9d4a4"/>`;
  for (let i = 0; i < 3; i++) korb += `<path d="M${r(bx - 7 + i * 1.2)} ${r(by - 6.6 - i * 0.8)} Q${r(bx)} ${r(by - 9.2 - i * 0.8)} ${r(bx + 7 - i * 1.2)} ${r(by - 6.6 - i * 0.8)} Q${r(bx)} ${r(by - 5.4 - i * 0.8)} ${r(bx - 7 + i * 1.2)} ${r(by - 6.6 - i * 0.8)} Z" fill="#fbf3dc" stroke="#e3d3ae" stroke-width=".25"/>`;
  k += korb;
  enteUnter.push({ id: "pfannkuchen", de: "der Pfannkuchen", syl: "PFANN-ku-chen", it: "la crêpe", itSyl: "CREP", en: "pancake", x: bx, y: by, kunst: flaeche(-9.5, -10, 19, 12),
    tipp: "In den dünnen Pfannkuchen rollt man die Ente mit Soße, Gurke und Frühlingszwiebel." });
  /* Teller mit Soße, Frühlingszwiebel und Gurke */
  const [sx, sy] = tp(0.92, 2.95);
  let teller = `<ellipse cx="${r(sx)}" cy="${r(sy)}" rx="12" ry="2.8" fill="#f4f1ea"/><ellipse cx="${r(sx)}" cy="${r(sy - 0.2)}" rx="10" ry="2" fill="#e8e3d6"/>`;
  teller += `<ellipse cx="${r(sx - 6)}" cy="${r(sy - 1.2)}" rx="3.4" ry="1.4" fill="#f4f1ea" stroke="#2a5aa0" stroke-width=".3"/><ellipse cx="${r(sx - 6)}" cy="${r(sy - 1.4)}" rx="2.6" ry=".9" fill="#3a1a0a"/><ellipse cx="${r(sx - 6.6)}" cy="${r(sy - 1.7)}" rx=".9" ry=".3" fill="#8a5a3a"/>`;
  let zwiebel = "", gurke = "";
  for (let i = 0; i < 6; i++) zwiebel += `<path d="M${r(sx - 1 + i * 0.7)} ${r(sy - 0.6)} l${r(2.6 + (i % 2))} -2.4" stroke="${i % 2 ? "#f2f2e8" : "#8cc04a"}" stroke-width=".5" stroke-linecap="round"/>`;
  for (let i = 0; i < 5; i++) gurke += `<rect x="${r(sx + 4 + i * 0.9)}" y="${r(sy - 3.2)}" width=".7" height="3" rx=".2" fill="${i % 2 ? "#5a9a3a" : "#c9e3a0"}" transform="rotate(${-20 + i * 4} ${r(sx + 4 + i * 0.9)} ${r(sy)})"/>`;
  k += teller + zwiebel + gurke;
  enteUnter.push({ id: "sosse", de: "die Soße", syl: "SO-ße", it: "la salsa", itSyl: "SAL-sa", en: "sauce", x: sx - 6, y: sy, kunst: flaeche(-4, -3.4, 8, 4.6),
    tipp: "Die dunkle, süße Bohnensoße gehört zur Pekingente." });
  enteUnter.push({ id: "fruehlingszwiebel", de: "die Frühlingszwiebel", syl: "FRÜH-lings-zwie-bel", it: "il cipollotto", itSyl: "ci-pol-LOT-to", en: "spring onion", x: sx + 1, y: sy, kunst: flaeche(-2, -4, 4.8, 4.6) });
  enteUnter.push({ id: "gurke", de: "die Gurke", syl: "GUR-ke", it: "il cetriolo", itSyl: "ce-tri-O-lo", en: "cucumber", x: sx + 6, y: sy, kunst: flaeche(-2.6, -4.4, 5.6, 4.8) });
  S.teil({ oben: true, id: "pekingente", de: "die Pekingente", syl: "PE-king-en-te", it: "l'anatra alla pechinese", itSyl: "A-na-tra al-la pe-chi-NE-se", en: "Peking duck", x: px, y: py, anker: [px, py - 6], kunst: k + flaeche(px - 22, py - 13.6, 41, 17.8),
    zoom: { x: 224, y: 188, w: 84, h: 56 }, unter: enteUnter,
    tipp: "Die Ente wird im Ofen über Obstholz gebraten. Ihre Haut wird ganz knusprig und glänzt." });
}
{
  /* DIE TEIGTASCHE — Teller mit Jiaozi */
  const [x, y] = tp(1.27, 3.06);
  let k = `<ellipse cx="0" cy="0" rx="13" ry="3" fill="#f4f1ea"/><ellipse cx="0" cy="-.2" rx="11" ry="2.2" fill="#e8e3d6"/><path d="M-11 .2 A12 2.6 0 0 0 11 .2" stroke="#2a5aa0" stroke-width=".5" fill="none"/>`;
  for (const [dx, dy] of [[-6, -0.6], [-1.6, -0.2], [3, -0.6], [7, -0.4], [-4, -2.2], [0.6, -2.4], [5, -2.2]]) {
    k += `<path d="M${r(dx - 2.6)} ${r(dy)} Q${r(dx - 2.2)} ${r(dy - 3.4)} ${r(dx)} ${r(dy - 3.6)} Q${r(dx + 2.2)} ${r(dy - 3.4)} ${r(dx + 2.6)} ${r(dy)} Q${r(dx)} ${r(dy + 0.9)} ${r(dx - 2.6)} ${r(dy)} Z" fill="${S.lg("jiaozi", [[0, "#fbf6e8"], [1, "#dccfae"]])}"/>`;
    k += `<path d="M${r(dx - 1.6)} ${r(dy - 2.8)} l.5 .6 l.5 -.6 l.5 .6 l.5 -.6 l.5 .6" stroke="#c9b88e" stroke-width=".25" fill="none"/>`;
  }
  S.teil({ oben: true, id: "teigtasche", de: "die Teigtasche", syl: "TEIG-ta-sche", it: "il raviolo cinese", itSyl: "ra-VIO-lo ci-NE-se", en: "dumpling", x, y, steht: true, kunst: k + flaeche(-13, -6.4, 26, 9.4),
    tipp: "Teigtaschen heißen auf Chinesisch „Jiaozi“. Zum Neujahrsfest macht sie die ganze Familie." });
}
{
  /* DAS ESSSTÄBCHEN — zwei rote Stäbchen auf dem Bänkchen */
  const [x, y] = tp(1.36, 2.86);
  let k = `<rect x="-14" y="-1.6" width="3" height="1.6" rx=".5" fill="#f4f1ea" stroke="#2a5aa0" stroke-width=".25"/>`;
  k += `<path d="M-17 -1.4 L19 1.2 L19 1.9 L-17 -.6 Z" fill="#b0261c"/><path d="M-16 -2.6 L20 -.6 L20 .1 L-16 -1.8 Z" fill="#c43a26"/>`;
  k += `<path d="M-17 -1.4 L-9 -.8 M-16 -2.6 L-8 -2.1" stroke="#e8c35a" stroke-width=".6"/>`;
  S.teil({ oben: true, id: "essstaebchen", de: "das Essstäbchen", syl: "ESS-stäb-chen", it: "la bacchetta", itSyl: "bac-CHET-ta", en: "chopstick", x, y, steht: true, kunst: k + flaeche(-18, -4.4, 39, 7),
    tipp: "Man isst mit zwei Stäbchen. Man steckt sie nie senkrecht in den Reis." });
}
{
  /* DIE TEEKANNE und DIE TEESCHALE — blau-weißes Porzellan */
  const [x, y] = tp(1.42, 3.66);
  let k = `<ellipse cx="0" cy="0" rx="6.4" ry="1.4" fill="#000" opacity=".2"/>`;
  k += `<path d="M-5.6 -1 Q-6.6 -6 -3.6 -8 L3.6 -8 Q6.6 -6 5.6 -1 Q0 .6 -5.6 -1 Z" fill="${S.lg("porzellan", [[0, "#ffffff"], [0.6, "#eef0f4"], [1, "#c9ced8"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-4.6 -4.6 Q0 -2.8 4.6 -4.6" stroke="#2a5aa0" stroke-width=".6" fill="none"/><circle cx="0" cy="-5.6" r="1.1" fill="none" stroke="#2a5aa0" stroke-width=".4"/>`;
  k += `<path d="M5.4 -4 Q8.6 -5 9.4 -8.4" stroke="#e6e8ee" stroke-width="1.2" fill="none" stroke-linecap="round"/><path d="M-5.6 -6.4 Q-8.6 -5.4 -6 -2.4" stroke="#dfe2ea" stroke-width=".8" fill="none"/>`;
  k += `<ellipse cx="0" cy="-8" rx="3.6" ry=".8" fill="#e6e8ee"/><circle cx="0" cy="-9" r=".9" fill="#2a5aa0"/>`;
  k += `<path d="M-4 -7 Q-4.8 -4 -3.6 -1.6" stroke="#fff" stroke-width=".7" opacity=".8" fill="none"/>`;
  S.teil({ oben: true, id: "teekanne", de: "die Teekanne", syl: "TEE-kan-ne", it: "la teiera", itSyl: "te-IE-ra", en: "teapot", x, y, steht: true, kunst: k,
    tipp: "Zur Ente trinkt man grünen Tee oder Jasmintee." });
}
{
  const [x, y] = tp(1.08, 3.58);
  let k = `<path d="M-3 -3.6 L3 -3.6 Q2.8 -.4 0 0 Q-2.8 -.4 -3 -3.6 Z" fill="${S.lg("porzellan", [])}"/><ellipse cx="0" cy="-3.6" rx="3" ry=".8" fill="#c99a3a"/><ellipse cx="0" cy="-3.6" rx="2.4" ry=".55" fill="#e0b85a"/><path d="M-2.4 -2.2 Q0 -1.2 2.4 -2.2" stroke="#2a5aa0" stroke-width=".4" fill="none"/>`;
  S.teil({ oben: true, id: "teeschale", de: "die Teeschale", syl: "TEE-scha-le", it: "la tazza da tè", itSyl: "TAZ-za da TÈ", en: "tea bowl", x, y, steht: true, kunst: k + flaeche(-3.4, -4.6, 6.8, 5) });
}

/* =====================================================================
   VORNE: Sonnenlicht und Dunst über dem Platz (fängt keinen Tipp ab)
   ===================================================================== */
S.davor(`<rect x="0" y="0" width="400" height="260" fill="${S.lg("abendlicht", [[0, "#ffe6b8", 0.1], [0.4, "#ffe6b8", 0], [1, "#000", 0.06]], 0, 0, 1, 1)}"/>`);

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/peking.js"));
console.log(aus);
