#!/usr/bin/env node
/* =====================================================================
   REGENSBURG (FASSUNG 854, Runde 2) — Bilderwelt neu: eine echte Stadtansicht
   ---------------------------------------------------------------------
   RECHERCHE (tourismus.regensburg.de „16 Highlights“, Stadt Regensburg
   „Steinerne Brücke – Ausstellungstafeln“, Bistum Regensburg
   „Domtürme – Geschichte“, wurstkuchl.de, Welterbe-Besucherzentrum
   Salzstadel, Personenschifffahrt):
   - STANDORT: Biergarten am Nordufer der Donau (Unterer Wöhrd), ein Stück
     unterhalb (östlich) der Steinernen Brücke; man steht im Kies, Auge
     1,6 m über dem Boden, rund 3 m über dem Wasser. Blick nach SÜDWESTEN
     über die Donau auf die Altstadt. Sommerabend gegen 20 Uhr: die Sonne
     steht tief im Westnordwesten, rechts außerhalb des Bildes, hinter der
     Brücke — GEGENLICHT: Die uns zugewandten Nordostseiten liegen im
     kühlen Schatten, warme Lichtkanten nur oben und rechts; auf dem Wasser
     rechts eine goldene Glitzerbahn; die Schatten fallen lang nach links
     vorn.
   - Reihenfolge von links nach rechts (Peilung): Altstadt am Donaumarkt,
     darüber der DOM (von Nordosten: polygonaler Ostchor links, Eselsturm,
     nördliches Querhaus mit Rosette, Langhaus mit Strebewerk, rechts die
     beiden Westtürme, der Südturm halb hinter dem Nordturm), der SALZSTADEL
     mit der HISTORISCHEN WURSTKUCHL davor am Wasser, der BRÜCKTURM (über
     Eck: links die Ostseite, rechts die Nordseite mit Tor und Uhr — dort
     läuft die Brücke hinein), dahinter der GOLDENE TURM, und die STEINERNE
     BRÜCKE, die von dort nach rechts vorn herüberkommt; am Anleger vor der
     Altstadt liegt ein Ausflugsschiff.
   - STEINERNE BRÜCKE (1135–1146): rund 336 m, 16 Rundbögen auf mächtigen
     Pfeilern mit breiten Steininseln („Beschlächte“), zwischen denen die
     Donau als Strudel schießt; gewölbter Buckel; am höchsten Punkt sitzt
     das BRUCKMANDL und schaut mit der Hand über den Augen zum Dom; heute
     für Fußgänger und Radfahrer.
   - BRÜCKTURM (Ende 13. Jh.): einziger erhaltener von drei Brückentürmen,
     Torbogen zur Brücke, Uhr aus dem 17. Jh., darüber das Stadtwappen (zwei
     gekreuzte silberne Schlüssel auf Rot), hohes Walmdach mit Gauben.
   - SALZSTADEL (1616–20): riesiges, steiles Dach mit Gaubenreihen.
   - HISTORISCHE WURSTKUCHL: kleines, niedriges Haus am Ufer, gilt als
     älteste Bratwurstküche der Welt; „sechs auf Kraut“ mit süßem Senf;
     Hochwassermarken, Freisitz, Rauch aus dem Kamin.
   - DOM ST. PETER: gotisch, Westtürme 105 m (1859–69) mit DURCHBROCHENEN
     Maßwerkhelmen (der Helm macht rund 40 % der Höhe aus), Fialenkranz am
     Helmansatz; Gewölbe 32 m; berühmte mittelalterliche Glasfenster; der
     romanische Eselsturm an der Nordseite. (Unsicher: Farbe der
     Dachdeckung — als graugrüne Patina gezeichnet.)
   - GESCHLECHTERTÜRME: Wohntürme reicher Patrizier nach italienischem
     Vorbild; der Goldene Turm ist 50 m hoch (neun Geschosse), oben eine
     Turmstube; dazu weitere Türme in der Dachlandschaft. Viele
     Altstadthäuser haben hohe, glatte, traufständige Fassaden, die Dächer
     liegen dahinter („italienisch“).
   - TYPISCH: Biergarten unter Kastanien, Bratwürste mit Kraut, süßer Senf,
     Brezn, die „Halbe“ Bier; Ausflugsschiffe zur Walhalla.
   Maßstab: Augenhöhe y = 114. Im Biergarten: Einheiten je Meter =
   (y − 114) / 1,6. Auf dem Wasser: (y − 114) / 3,1.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "regensburg", titel: "Regensburg", emoji: "🌉", thema: "Deutschland", kuerzel: "rgb", fassung: 854 });
const rnd = zufall(1135);
const r = B.r;
const HOR = 114;
const km = (y) => (y - HOR) / 1.6;     /* im Biergarten: Auge 1,6 m über dem Kies */
const kw = (y) => (y - HOR) / 3.1;     /* auf der Donau: Auge 3,1 m über dem Wasser */
const W = 121;          /* Wasserlinie am Altstadtufer (Spiegelachse) */
const WU = 157;         /* Ufer vorne (Unterer Wöhrd) */
const spiegel = [];
const gruppe = (id, x, y, svg, achse = W) => { spiegel.push({ id, x, y, achse }); return `<g id="${S.id("sp_" + id)}">${svg}</g>`; };
const anker = (ax, ay, svg) => `<g transform="translate(${-ax} ${-ay})">${svg}</g>`;
const mische = (a, b, t) => "#" + [0, 2, 4].map((i) => Math.round(parseInt(a.slice(1 + i, 3 + i), 16) * (1 - t) + parseInt(b.slice(1 + i, 3 + i), 16) * t).toString(16).padStart(2, "0")).join("");
/* Figuren aus mensch.js auf halbe Einheiten runden: gleiches Bild, deutlich kleinere Datei (Ladezeit) */
const leicht = (svg, q = 2) => svg
  .replace(/ d="([^"]*)"/g, (m, d) => ` d="${d.replace(/-?\d*\.?\d+/g, (n) => String(Math.round(+n * q) / q))}"`)
  .replace(/ (x|y|x1|y1|x2|y2|cx|cy)="(-?[\d.]+)"/g, (m, a, n) => ` ${a}="${Math.round(+n * q) / q}"`);
/* langer Abendschatten nach links vorn (Sonne rechts hinten, tief) */
const langschatten = (x, y, breite, laenge, a = 0.3) => `<path d="M${r(x - breite / 2)} ${r(y)} L${r(x + breite / 2)} ${r(y)} L${r(x + breite / 2 - laenge)} ${r(y + laenge * 0.22)} L${r(x - breite / 2 - laenge * 1.02)} ${r(y + laenge * 0.22)} Z" fill="#20180e" opacity="${a}" filter="url(#bw_weich)"/>`;

S.def(`<filter color-interpolation-filters="sRGB" id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter color-interpolation-filters="sRGB" id="${S.id("wolke")}" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="2"/></filter>`);
S.def(`<filter color-interpolation-filters="sRGB" id="${S.id("rauch")}" x="-100%" y="-50%" width="300%" height="200%"><feGaussianBlur stdDeviation=".9"/></filter>`);
S.def(`<filter color-interpolation-filters="sRGB" id="${S.id("spiegel")}" x="-2%" y="-5%" width="104%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".014 .38" numOctaves="1" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="3.4" xChannelSelector="R" yChannelSelector="G"/><feGaussianBlur stdDeviation=".6 .25"/></filter>`);
/* Gegenlicht: Stein im kühlen Schatten, warme Kante rechts */
const DOMSTEIN = S.lg("domstein", [[0, "#7e8290"], [0.7, "#9a9ca4"], [0.92, "#b8b2aa"], [1, "#f0d2a8"]], 0, 0, 1, 0);
const DOMSTEIN_H = S.lg("domsteinh", [[0, "#6e7282"], [1, "#8e909a"]], 0, 0, 1, 0);
const PATINA = S.lg("patina", [[0, "#56685f"], [0.8, "#6e8478"], [1, "#c8c0a0"]], 0, 0, 1, 0);
const BRUECKE = S.lg("brueckenstein", [[0, "#7a7a74"], [0.6, "#8e8c82"], [1, "#a8a28e"]], 0, 0, 1, 0);
const ZIEGEL = S.lg("ziegel", [[0, "#6e3a32"], [0.7, "#86463a"], [1, "#c87a52"]], 0, 0, 1, 0);
const ZIEGEL_D = S.lg("ziegeld", [[0, "#5a2c24"], [1, "#7a3a2e"]], 0, 0, 1, 0);
const GOLD = S.lg("gold", [[0, "#fff1a8"], [0.4, "#f1c74a"], [1, "#a8770f"]], 0, 0, 1, 1);
const DUNKEL = "#2a2830";
const RAND = "#ffd9a0";      /* warme Lichtkante */
const SCHATTEN = "#3a4a72";

/* =====================================================================
   KULISSE — Sommerabend: warmer Himmel rechts (Sonne), ferne Hügel
   ===================================================================== */
S.hinten(`<rect width="320" height="${W + 4}" fill="${S.lg("himmel", [[0, "#3a6cb0"], [0.45, "#86aed6"], [0.8, "#f0d8b4"], [1, "#f8d09a"]])}"/>`);
S.hinten(`<rect width="320" height="${W + 4}" fill="${S.lg("himmelwarm", [[0, "#fff0c8", 0], [0.6, "#ffe0a8", 0.1], [1, "#ffd28a", 0.55]], 0, 0, 1, 0)}"/>`);
S.hinten(`<circle cx="372" cy="70" r="190" fill="${S.rg("sonne", [[0, "#fff4d0", 0.85], [0.35, "#ffe2a0", 0.35], [1, "#ffe2a0", 0]])}"/>`);
{
  let w = "";
  for (const [x, y, s] of [[40, 30, 1.1], [180, 20, 0.9], [262, 46, 1], [92, 62, 0.6]]) {
    w += `<g filter="url(#${S.id("wolke")})">`;
    for (const [dx, dy, rx, ry] of [[0, 0, 16, 6], [-11, 2.4, 10, 4.6], [11, 2, 11, 5], [-4, -4.4, 8, 5.4], [5, -3.6, 7, 5]])
      w += `<ellipse cx="${r(x + dx * s)}" cy="${r(y + dy * s)}" rx="${r(rx * s)}" ry="${r(ry * s)}" fill="#e8e2e6"/>`;
    w += `<ellipse cx="${r(x + 12 * s)}" cy="${r(y - 1.6 * s)}" rx="${r(7 * s)}" ry="${r(4.6 * s)}" fill="#fff0d0"/>`;
    w += `<ellipse cx="${r(x - 2 * s)}" cy="${r(y + 4.6 * s)}" rx="${r(17 * s)}" ry="${r(2 * s)}" fill="#b4b8cc" opacity=".8"/></g>`;
  }
  S.hinten(w);
}
S.hinten(`<path d="M0 108 Q40 101 90 104 T180 103 T260 100 T320 104 L320 ${W} L0 ${W} Z" fill="${S.lg("huegel", [[0, "#a8acb8"], [1, "#c4bcb4"]])}"/>`);
/* hinter der Brücke rechts: Bäume auf dem Oberen Wöhrd, im Gegenlicht dunstig */
{
  let t = "";
  for (let i = 0; i < 46; i++) { const x = 236 + rnd() * 90, y = 100 + rnd() * 14, rr = 2.4 + rnd() * 3; t += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(rr * 1.2)}" ry="${r(rr)}" fill="${["#8a9a8c", "#7c8e84", "#98a698"][i % 3]}"/>`; }
  t += `<rect x="232" y="112" width="88" height="${W - 112}" fill="#7c8e84"/>`;
  S.hinten(`<g opacity=".8">${t}</g>`);
}

/* =====================================================================
   1 — DER DOM ST. PETER (Lupe: Turm, Kirchenfenster, Dach)
       in Metern gedacht, 0,95 Einheiten je Meter, Fuß bei y = 114
   ===================================================================== */
const DS = 0.95, DY = (m) => 114 - m * DS;
const DOMT = { nord: 124, sued: 136, breite: 15 };
{
  let k = "";
  const glas = (x, y0, y1, w) => {
    let g = `<path d="M${r(x - w / 2)} ${r(y0)} L${r(x - w / 2)} ${r(y1 + w * 0.6)} Q${r(x)} ${r(y1 - w * 0.3)} ${r(x + w / 2)} ${r(y1 + w * 0.6)} L${r(x + w / 2)} ${r(y0)} Z" fill="${S.lg("glas", [[0, "#2e3654"], [0.5, "#3c2e50"], [1, "#2a3048"]])}"/>`;
    g += `<rect x="${r(x - w / 2 + 0.2)}" y="${r((y0 + y1) / 2)}" width="${r(w * 0.3)}" height="${r((y0 - y1) * 0.2)}" fill="#a83a4a" opacity=".55"/><rect x="${r(x + 0.1)}" y="${r(y1 + (y0 - y1) * 0.25)}" width="${r(w * 0.3)}" height="${r((y0 - y1) * 0.22)}" fill="#3a5ab0" opacity=".6"/>`;
    g += `<path d="M${r(x)} ${r(y0)} L${r(x)} ${r(y1 + 0.4)}" stroke="#8e8e8a" stroke-width=".2"/>`;
    return g;
  };
  /* ein Westturm: Schaft mit Strebepfeilern (60 %), Fialenkranz, durchbrochener Helm (40 %) */
  const turm = (cx, hinten) => {
    let g = "";
    const hw = DOMT.breite / 2 * DS, oben = DY(63), spitze = DY(105), F = hinten ? DOMSTEIN_H : DOMSTEIN;
    g += `<rect x="${r(cx - hw)}" y="${r(oben)}" width="${r(2 * hw)}" height="${r(114 - oben)}" fill="${F}"/>`;
    /* Eck-Strebepfeiler mit Absätzen */
    for (const sx of [-1, 1]) {
      const x0 = sx < 0 ? cx - hw - 0.8 : cx + hw - 1.6;
      g += `<rect x="${r(x0)}" y="${r(oben + 2)}" width="2.4" height="${r(114 - oben - 2)}" fill="${hinten ? "#727686" : sx < 0 ? "#7a7e8c" : "#a8a49c"}"/>`;
      for (const m of [20, 34, 48]) g += `<path d="M${r(x0)} ${r(DY(m))} l1.2 -1.4 l1.2 1.4 Z" fill="#6a6e7c"/>`;
      if (sx > 0) g += `<rect x="${r(x0 + 1.9)}" y="${r(oben + 2)}" width=".5" height="${r(114 - oben - 2)}" fill="${RAND}" opacity="${hinten ? 0.35 : 0.7}"/>`;
    }
    if (!hinten) {
      g += glas(cx, DY(36), DY(50), 4.2) + glas(cx - 2.6, DY(52), DY(60), 1.7) + glas(cx + 2.6, DY(52), DY(60), 1.7);
      for (const m of [34, 51]) g += `<rect x="${r(cx - hw)}" y="${r(DY(m))}" width="${r(2 * hw)}" height=".7" fill="#a4a2a0"/>`;
      for (let x = cx - hw + 1.4; x < cx + hw - 1.6; x += 1.5) g += `<path d="M${r(x)} ${r(DY(51.6))} l0 -1.6 q.5 -.8 1 0 l0 1.6" stroke="#6a6e7c" stroke-width=".18" fill="none"/>`;
    } else g += glas(cx, DY(38), DY(54), 3.2);
    /* Galerie und Fialenkranz am Helmansatz */
    g += `<rect x="${r(cx - hw - 0.6)}" y="${r(oben - 0.8)}" width="${r(2 * hw + 1.2)}" height="1.2" fill="#8e8e94"/>`;
    for (let x = cx - hw; x <= cx + hw + 0.1; x += 1.2) g += `<line x1="${r(x)}" y1="${r(oben - 0.8)}" x2="${r(x)}" y2="${r(oben - 2.2)}" stroke="#7a7e8a" stroke-width=".25"/>`;
    g += `<rect x="${r(cx - hw - 0.6)}" y="${r(oben - 2.4)}" width="${r(2 * hw + 1.2)}" height=".4" fill="#8e8e94"/>`;
    for (const dx of [-hw, -hw * 0.45, hw * 0.45, hw]) {
      g += `<path d="M${r(cx + dx - 0.7)} ${r(oben - 2.2)} L${r(cx + dx)} ${r(oben - 9)} L${r(cx + dx + 0.7)} ${r(oben - 2.2)} Z" fill="${F}"/>`;
      for (let i = 1; i < 4; i++) g += `<path d="M${r(cx + dx - 0.7 + i * 0.17)} ${r(oben - 2.2 - i * 1.7)} l-.4 -.2 M${r(cx + dx + 0.7 - i * 0.17)} ${r(oben - 2.2 - i * 1.7)} l.4 -.2" stroke="#8e8e94" stroke-width=".2"/>`;
      g += `<path d="M${r(cx + dx)} ${r(oben - 9)} L${r(cx + dx + 0.7)} ${r(oben - 2.2)}" stroke="${RAND}" stroke-width=".25" opacity=".7"/>`;
    }
    /* der durchbrochene Maßwerkhelm: Rippen, Bänder, Maßwerk — der Himmel scheint durch */
    const hb = hw * 0.86, hy = oben - 2.4, L = hy - spitze;
    const xr = (y, sx) => cx + sx * hb * (y - spitze) / L;
    const ST = hinten ? "#7c8090" : "#8a8e9a";
    let lat = `<path d="M${r(xr(hy, -1))} ${r(hy)} L${cx} ${r(spitze)} L${r(xr(hy, 1))} ${r(hy)} Z" fill="${ST}" opacity=".42"/>`;
    for (const sx of [-1, 1]) lat += `<line x1="${r(xr(hy, sx))}" y1="${r(hy)}" x2="${cx}" y2="${r(spitze)}" stroke="${ST}" stroke-width="1.2"/>`;
    lat += `<line x1="${cx}" y1="${r(hy)}" x2="${cx}" y2="${r(spitze)}" stroke="${ST}" stroke-width=".55"/>`;
    for (let i = 1; i < 9; i++) {
      const y = hy - i * L / 9.3, y2 = hy - (i - 1) * L / 9.3;
      lat += `<line x1="${r(xr(y, -1))}" y1="${r(y)}" x2="${r(xr(y, 1))}" y2="${r(y)}" stroke="${ST}" stroke-width=".6"/>`;
      /* Maßwerk zwischen den Bändern: zwei Spitzbögen und ein Vierpass je Seite */
      for (const sx of [-1, 1]) {
        const xa = cx, xb = (xr(y, sx) + xr(y2, sx)) / 2, xm = (xa + xb) / 2, ym = (y + y2) / 2, ww = Math.abs(xb - xa);
        if (ww < 0.8) continue;
        lat += `<path d="M${r(xa + sx * 0.2)} ${r(y2)} L${r(xa + sx * 0.2)} ${r(ym)} Q${r(xm)} ${r(y + 0.2)} ${r(xb - sx * 0.2)} ${r(ym)} L${r(xb - sx * 0.2)} ${r(y2)}" stroke="${ST}" stroke-width=".38" fill="none"/>`;
        lat += `<circle cx="${r(xm)}" cy="${r(ym - (y2 - y) * 0.05)}" r="${r(Math.min(ww * 0.2, (y2 - y) * 0.22))}" fill="none" stroke="${ST}" stroke-width=".3"/>`;
      }
    }
    /* Krabben an den Kanten, Kreuzblume oben */
    for (let i = 1; i < 11; i++) { const y = hy - i * L / 11.2; lat += `<path d="M${r(xr(y, -1))} ${r(y)} l-.8 -.5 M${r(xr(y, 1))} ${r(y)} l.8 -.5" stroke="${ST}" stroke-width=".5" stroke-linecap="round"/>`; }
    lat += `<path d="M${r(cx + 0.5)} ${r(spitze + 0.8)} L${r(xr(hy, 1))} ${r(hy)}" stroke="${RAND}" stroke-width=".45" opacity="${hinten ? 0.4 : 0.85}"/>`;
    lat += `<path d="M${cx} ${r(spitze)} l-1.4 .6 l1.4 -3.6 l1.4 3.6 Z" fill="${ST}"/><path d="M${cx} ${r(spitze - 3)} l0 -1.8 M${r(cx - 0.9)} ${r(spitze - 4)} l1.8 0" stroke="#8a8a84" stroke-width=".4"/>`;
    g += lat;
    return g;
  };
  /* Südturm (hinten, halb verdeckt) */
  k += turm(DOMT.sued, true);
  /* Langhaus: Dach mit Patina, Obergaden mit hohen Fenstern, Strebebögen */
  const xT = DOMT.nord - DOMT.breite / 2 * DS;
  k += `<path d="M64 ${r(DY(34))} L70 ${r(DY(51))} L${r(xT)} ${r(DY(51))} L${r(xT)} ${r(DY(34))} Z" fill="${PATINA}"/>`;
  for (let i = 1; i < 6; i++) k += `<line x1="${r(64 + i * 1.2)}" y1="${r(DY(34 + i * 2.8))}" x2="${r(xT)}" y2="${r(DY(34 + i * 2.8))}" stroke="#46564e" stroke-width=".15" opacity=".6"/>`;
  k += `<path d="M70 ${r(DY(51))} L${r(xT)} ${r(DY(51))}" stroke="${RAND}" stroke-width=".5" opacity=".8"/>`;
  k += `<rect x="64" y="${r(DY(34))}" width="${r(xT - 64)}" height="${r(DY(14) - DY(34))}" fill="${DOMSTEIN}"/>`;
  for (let x = 74; x < xT - 3; x += 6.2) k += glas(x + 2.4, DY(17), DY(31), 3);
  for (let x = 72; x < xT; x += 6.2) {
    k += `<rect x="${r(x - 0.8)}" y="${r(DY(36))}" width="1.6" height="${r(DY(14) - DY(36))}" fill="#7a7e8a"/><path d="M${r(x - 0.8)} ${r(DY(36))} l.8 -2.8 l.8 2.8 Z" fill="#7a7e8a"/>`;
    k += `<path d="M${r(x + 0.8)} ${r(DY(33))} Q${r(x + 2.8)} ${r(DY(36))} ${r(x + 4.4)} ${r(DY(39))}" stroke="#7a7e8a" stroke-width=".9" fill="none"/>`;
  }
  /* Eselsturm (romanisch, an der Nordseite beim Querhaus) */
  k += `<rect x="78" y="${r(DY(36))}" width="7" height="${r(DY(14) - DY(36))}" fill="${S.lg("esel", [[0, "#727484"], [1, "#9a948c"]], 0, 0, 1, 0)}"/>`;
  for (const m of [26, 31]) k += `<path d="M80 ${r(DY(m))} l0 -2 q.6 -.9 1.2 0 l0 2 Z M82.2 ${r(DY(m))} l0 -2 q.6 -.9 1.2 0 l0 2 Z" fill="${DUNKEL}"/>`;
  k += `<path d="M77.4 ${r(DY(36))} L81.5 ${r(DY(43))} L85.6 ${r(DY(36))} Z" fill="${PATINA}"/><path d="M81.5 ${r(DY(43))} L85.6 ${r(DY(36))}" stroke="${RAND}" stroke-width=".35" opacity=".7"/>`;
  /* Nördliches Querhaus mit Giebel und Rosette */
  k += `<path d="M88 ${r(DY(14))} L88 ${r(DY(36))} L95 ${r(DY(52))} L102 ${r(DY(36))} L102 ${r(DY(14))} Z" fill="${DOMSTEIN}"/>`;
  k += `<path d="M88 ${r(DY(36))} L95 ${r(DY(52))} L102 ${r(DY(36))}" stroke="${RAND}" stroke-width=".4" fill="none" opacity=".6"/>`;
  k += `<circle cx="95" cy="${r(DY(38))}" r="3" fill="#2e3048"/><circle cx="95" cy="${r(DY(38))}" r="3" fill="none" stroke="#9a9a96" stroke-width=".35"/>`;
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; k += `<line x1="95" y1="${r(DY(38))}" x2="${r(95 + Math.cos(a) * 3)}" y2="${r(DY(38) + Math.sin(a) * 3)}" stroke="#9a9a96" stroke-width=".22"/><circle cx="${r(95 + Math.cos(a + 0.4) * 1.8)}" cy="${r(DY(38) + Math.sin(a + 0.4) * 1.8)}" r=".5" fill="${i % 2 ? "#a83a4a" : "#3a5ab0"}" opacity=".6"/>`; }
  k += glas(95, DY(15), DY(32), 4.6);
  for (const x of [87.4, 101.6]) k += `<rect x="${x - 0.7}" y="${r(DY(40))}" width="1.4" height="${r(DY(14) - DY(40))}" fill="#7a7e8a"/><path d="M${x - 0.7} ${r(DY(40))} l.7 -3.6 l.7 3.6 Z" fill="#7a7e8a"/>`;
  /* polygonaler Ostchor (links) mit hohen Fenstern und Strebepfeilern */
  const chor = [[46, 0.5], [52, 0], [62, 0], [68, 0.5]];
  k += `<path d="M44 ${r(DY(14))} L44 ${r(DY(32))} L50 ${r(DY(34))} L64 ${r(DY(34))} L70 ${r(DY(32))} L70 ${r(DY(14))} Z" fill="${DOMSTEIN_H}"/>`;
  for (const [x0, x1] of [[44, 50], [50, 64], [64, 70]]) k += glas((x0 + x1) / 2, DY(16), DY(31), Math.min(3.6, (x1 - x0) * 0.55));
  for (const [x] of chor) k += `<rect x="${x - 0.7}" y="${r(DY(36))}" width="1.4" height="${r(DY(14) - DY(36))}" fill="#6e7282"/><path d="M${x - 0.7} ${r(DY(36))} l.7 -3 l.7 3 Z" fill="#6e7282"/>`;
  k += `<path d="M43 ${r(DY(32))} L50 ${r(DY(34))} L64 ${r(DY(34))} L71 ${r(DY(32))} L66 ${r(DY(47))} L57 ${r(DY(50))} L48 ${r(DY(47))} Z" fill="${PATINA}"/><path d="M57 ${r(DY(50))} L71 ${r(DY(32))}" stroke="${RAND}" stroke-width=".4" opacity=".6"/>`;
  /* Nordturm (vorne) */
  k += turm(DOMT.nord, false);
  S.teil({ id: "dom", de: "der Dom", syl: "DOM", it: "il duomo", itSyl: "DUO-mo", en: "cathedral",
    x: 96, y: 70, kunst: anker(96, 70, k), tipp: "Der Dom St. Peter ist gotisch. Seine zwei Türme sind 105 Meter hoch.",
    zoom: { x: 64, y: 10, w: 82, h: 76 },
    unter: [
      { id: "turm", de: "der Turm", syl: "TURM", it: "la torre", itSyl: "TOR-re", en: "tower", x: DOMT.nord, y: DY(30), kunst: flaeche(-8, -74, 16, 74),
        tipp: "Die Turmhelme sind aus Stein und durchbrochen wie Spitze – man sieht den Himmel hindurch. Fertig wurden sie 1869." },
      { id: "kirchenfenster", de: "das Kirchenfenster", syl: "KIR-chen-fens-ter", it: "la vetrata", itSyl: "ve-TRA-ta", en: "church window", x: 95, y: DY(14), kunst: flaeche(-4, -26, 8, 26),
        tipp: "Die bunten Glasfenster im Dom sind zum Teil über 700 Jahre alt." },
      { id: "dach", de: "das Dach", syl: "DACH", it: "il tetto", itSyl: "TET-to", en: "roof", x: 108, y: DY(36), kunst: flaeche(-7, -14, 14, 13),
        tipp: "Unter dem steilen Dach liegt das Gewölbe des Doms – es ist 32 Meter hoch." },
    ] });
}

/* =====================================================================
   2 — DIE GESCHLECHTERTÜRME (Goldener Turm und zwei weitere)
   ===================================================================== */
{
  const turm = (x, fuss, s, hm, stube) => {
    const w = 8 * s, h = hm * s, top = fuss - h;
    let g = `<rect x="${r(x - w / 2)}" y="${r(top)}" width="${r(w)}" height="${r(h)}" fill="${S.lg("ptturm", [[0, "#8e8494"], [0.8, "#aa9e9e"], [1, "#e8c8a0"]], 0, 0, 1, 0)}"/>`;
    /* schmale, unregelmäßige Lichtschlitze */
    for (let i = 0; i < Math.floor(hm / 5); i++) for (const dx of [-0.24, 0.12]) if (rnd() < 0.75) g += `<rect x="${r(x + dx * w + rnd() * 0.6)}" y="${r(fuss - (4 + i * 5) * s - 1.6 * s)}" width="${r(0.5 * s)}" height="${r(1.6 * s)}" fill="${DUNKEL}"/>`;
    if (stube) {
      g += `<rect x="${r(x - w / 2 - 0.4)}" y="${r(top - 3.4 * s)}" width="${r(w + 0.8)}" height="${r(3.4 * s)}" fill="#b0a29c"/>`;
      for (let i = 0; i < 3; i++) g += `<path d="M${r(x - w / 2 + (0.8 + i * 2.4) * s)} ${r(top - 0.4 * s)} l0 ${r(-1.8 * s)} q${r(0.6 * s)} ${r(-0.8 * s)} ${r(1.2 * s)} 0 l0 ${r(1.8 * s)} Z" fill="#3a3440"/>`;
      g += `<path d="M${r(x - w / 2 - 0.8)} ${r(top - 3.4 * s)} L${r(x)} ${r(top - 6.4 * s)} L${r(x + w / 2 + 0.8)} ${r(top - 3.4 * s)} Z" fill="${ZIEGEL}"/>`;
    } else g += `<path d="M${r(x - w / 2 - 0.5)} ${r(top)} L${r(x)} ${r(top - 3 * s)} L${r(x + w / 2 + 0.5)} ${r(top)} Z" fill="${ZIEGEL_D}"/>`;
    g += `<rect x="${r(x + w / 2 - 1)}" y="${r(top)}" width="1" height="${r(h)}" fill="${RAND}" opacity=".55"/>`;
    return g;
  };
  let k = turm(143, 111, 1.4, 28, false) + turm(214, 112, 1.15, 46, true) + turm(240, 110, 1.0, 30, false);
  S.teil({ id: "geschlechterturm", de: "der Geschlechterturm", syl: "ge-SCHLECH-ter-turm", it: "la torre gentilizia", itSyl: "TOR-re gen-ti-LI-zia", en: "patrician tower",
    x: 214, y: 82, kunst: anker(214, 82, k), tipp: "Reiche Kaufleute bauten im Mittelalter hohe Wohntürme wie in Italien. Der Goldene Turm ist 50 Meter hoch." });
}

/* =====================================================================
   3 — DIE ALTSTADT: hohe, glatte Fassaden am Donaumarkt (spiegelt sich)
   ===================================================================== */
{
  let k = "";
  const PUTZ = ["#c8b08c", "#bca88c", "#c8b4a0", "#b49a8a", "#b8ac90", "#c6aa96", "#aab09a", "#c4bcae"];
  const SCH = (c) => mische(c, "#4a5478", 0.32);       /* Fassade im Gegenlicht */
  const haus = (x, w, base, h, dach, t, art) => {
    const m = (c) => (t ? mische(c, "#c0c0c8", t) : c);
    const f = m(SCH(PUTZ[Math.floor(rnd() * PUTZ.length)]));
    let g = `<rect x="${r(x)}" y="${r(base - h)}" width="${r(w)}" height="${r(h)}" fill="${f}"/>`;
    const sp = Math.max(2, Math.floor(w / 3)), re = Math.max(1, Math.floor((h - 3) / 4));
    for (let j = 0; j < re; j++) for (let i = 0; i < sp; i++) g += `<rect x="${r(x + (w - sp * 3) / 2 + i * 3 + 0.9)}" y="${r(base - h + 2 + j * 4)}" width="1.2" height="2" fill="${rnd() < 0.1 ? "#ffd890" : m("#3a3644")}"/>`;
    if (!t) g += `<rect x="${r(x)}" y="${r(base - 3.4)}" width="${r(w)}" height="3.4" fill="#000" opacity=".1"/>`;
    if (art === "flach") {
      /* „italienisch“: glatte Fassade, Dach dahinter versteckt, oben ein Gesims */
      g += `<rect x="${r(x - 0.3)}" y="${r(base - h - 1)}" width="${r(w + 0.6)}" height="1.2" fill="${m(SCH("#d8c8b0"))}"/><rect x="${r(x - 0.3)}" y="${r(base - h - 1)}" width="${r(w + 0.6)}" height=".35" fill="${RAND}" opacity=".7"/>`;
    } else if (art === "giebel") {
      g += `<path d="M${r(x - 0.3)} ${r(base - h)} L${r(x + w / 2)} ${r(base - h - dach)} L${r(x + w + 0.3)} ${r(base - h)} Z" fill="${f}"/><path d="M${r(x + w / 2)} ${r(base - h - dach)} L${r(x + w + 0.5)} ${r(base - h + 0.2)}" stroke="${RAND}" stroke-width=".6" opacity=".8"/>`;
      g += `<rect x="${r(x + w / 2 - 0.7)}" y="${r(base - h - dach * 0.5)}" width="1.4" height="1.8" fill="${m("#3a3644")}"/>`;
    } else {
      g += `<path d="M${r(x - 0.5)} ${r(base - h)} L${r(x + w * 0.15)} ${r(base - h - dach)} L${r(x + w * 0.85)} ${r(base - h - dach)} L${r(x + w + 0.5)} ${r(base - h)} Z" fill="${m(["#6e3a32", "#7a4436", "#64342c"][Math.floor(rnd() * 3)])}"/>`;
      g += `<path d="M${r(x + w * 0.15)} ${r(base - h - dach)} L${r(x + w * 0.85)} ${r(base - h - dach)} L${r(x + w + 0.5)} ${r(base - h)}" stroke="${RAND}" stroke-width=".5" fill="none" opacity=".8"/>`;
    }
    g += `<rect x="${r(x + w - 0.8)}" y="${r(base - h)}" width=".8" height="${r(h)}" fill="${RAND}" opacity="${t ? 0.25 : 0.5}"/>`;
    return g;
  };
  /* hinter der Brücke: Dächer der westlichen Altstadt und Stadtamhof, im Dunst */
  for (let x = 194; x < 314;) { let w = 7 + rnd() * 6; if (x + w > 320) w = 320 - x; k += haus(x, w, 110, 6 + rnd() * 4, 5 + rnd() * 3, 0.3, rnd() < 0.5 ? "giebel" : "trauf"); x += w + 0.3; }
  /* zweite Reihe unter dem Dom */
  for (let x = 0; x < 150;) { const w = 8 + rnd() * 6; k += haus(x, w, 112, 8 + rnd() * 5, 6 + rnd() * 3, 0.2, ["flach", "trauf", "giebel"][Math.floor(rnd() * 3)]); x += w + 0.3; }
  /* vordere Reihe direkt an der Donau: höher, oft traufständig und flach („italienisch“) */
  let reihe = "";
  const arten = ["flach", "trauf", "flach", "giebel", "trauf", "flach", "trauf", "flach", "giebel", "flach", "trauf", "flach"];
  let i = 0;
  for (let x = -1; x < 140; i++) {
    let w = 10 + rnd() * 7;
    if (x + w > 141) w = 141 - x;
    const unterDom = x > 38 && x < 118;
    reihe += haus(x, w, W - 1.2, unterDom ? 17 + rnd() * 4 : 23 + rnd() * 6, 7 + rnd() * 3, 0, arten[i % arten.length]);
    x += w + 0.3;
  }
  reihe += `<rect x="-1" y="${W - 1.4}" width="142" height="1.6" fill="#7a7468"/>`;
  k += gruppe("haeuser", 0, 0, reihe);
  S.teil({ id: "altstadt", de: "die Altstadt", syl: "ALT-stadt", it: "il centro storico", itSyl: "CEN-tro STO-ri-co", en: "old town",
    x: 60, y: 104, kunst: anker(60, 104, k), tipp: "Die Altstadt von Regensburg ist UNESCO-Welterbe. Viele Häuser haben hohe, glatte Fassaden wie in Italien." });
}

/* =====================================================================
   4 — DER SALZSTADEL (riesiges Dach mit Gaubenreihen)
   ===================================================================== */
const SZ = { x: 164, y: W - 1 };
{
  let k = `<rect x="-19" y="-15" width="33" height="15" fill="${S.lg("salzwand", [[0, "#8e8a90"], [0.8, "#aaa29a"], [1, "#e8cfa8"]], 0, 0, 1, 0)}"/>`;
  for (const x of [-15, -8, -1, 6]) k += `<path d="M${x} 0 L${x} -3.6 Q${x + 1.6} -5.6 ${x + 3.2} -3.6 L${x + 3.2} 0 Z" fill="#3a3436"/>`;
  for (let i = 0; i < 9; i++) { k += `<rect x="${-17.4 + i * 3.6}" y="-9.6" width="1.3" height="2" fill="${DUNKEL}"/><rect x="${-17.4 + i * 3.6}" y="-13.6" width="1.3" height="2" fill="${DUNKEL}"/>`; }
  k += `<rect x="12.8" y="-15" width="1.2" height="15" fill="${RAND}" opacity=".6"/>`;
  k += `<path d="M-20 -15 L-13 -46 L7 -46 L15 -15 Z" fill="${ZIEGEL}"/>`;
  for (let i = 1; i < 14; i++) { const t = i / 14; k += `<line x1="${r(-20 + t * 7)}" y1="${r(-15 - t * 31)}" x2="${r(15 - t * 8)}" y2="${r(-15 - t * 31)}" stroke="#4a221c" stroke-width=".12" opacity=".6"/>`; }
  k += `<path d="M-13 -46 L7 -46 L15 -15" stroke="${RAND}" stroke-width=".7" fill="none" opacity=".9"/>`;
  [[-19, 8, 3.8], [-26, 7, 3.6], [-33, 5, 3.6], [-40, 3, 3.6]].forEach(([y, n, d]) => {
    const x0 = -3 - (n - 1) * d / 2;
    for (let i = 0; i < n; i++) k += `<path d="M${r(x0 + i * d - 1)} ${y} l1 -1.8 l1 1.8 Z" fill="#5a2a22"/><rect x="${r(x0 + i * d - 0.65)}" y="${y}" width="1.3" height="1" fill="#1e1818"/><path d="M${r(x0 + i * d)} ${y - 1.8} l1 1.8" stroke="${RAND}" stroke-width=".25" opacity=".7"/>`;
  });
  S.teil({ id: "salzstadel", de: "der Salzstadel", syl: "SALZ-sta-del", it: "il magazzino del sale", itSyl: "ma-gaz-ZI-no del SA-le", en: "salt warehouse",
    x: SZ.x, y: SZ.y - 26, kunst: anker(0, -26, gruppe("salzstadel", SZ.x, SZ.y, k)), tipp: "Im Salzstadel lagerte früher das Salz, das auf der Donau kam. Heute ist dort das Welterbe-Besucherzentrum." });
}

/* =====================================================================
   5 — DER BRÜCKTURM über Eck: links die Ostseite (Schatten), rechts die
       Nordseite mit Tor, Wappen und Uhr — hier läuft die Brücke hinein
       (Lupe: Uhr, Wappen)
   ===================================================================== */
const BT = { x: 190, y: 113 };
{
  let k = "";
  const L0 = -9, L1 = 0, R1 = 7.4;           /* Ostseite −9…0, Nordseite 0…7,4 (verkürzt) */
  const oben = -48, obenR = -47.2;
  /* Ufermauer unter dem Turm */
  k += `<rect x="-16" y="0" width="24" height="${r(W - BT.y)}" fill="${S.lg("kopfmauer", [[0, "#6a6870"], [1, "#8a8478"]], 0, 0, 1, 0)}"/>`;
  for (let y = 1.6; y < W - BT.y; y += 1.8) k += `<line x1="-16" y1="${r(y)}" x2="8" y2="${r(y)}" stroke="#4e4c54" stroke-width=".15" opacity=".6"/>`;
  /* Ostseite: glatt, im Schatten */
  k += `<path d="M${L0} 1 L${L0} ${oben} L${L1} ${oben + 0.6} L${L1} 1 Z" fill="${S.lg("turmost", [[0, "#7e7a84"], [1, "#948c8a"]], 0, 0, 1, 0)}"/>`;
  for (const [x, y] of [[-6, -20], [-3.4, -20], [-4.8, -34]]) k += `<rect x="${x}" y="${y}" width="1.1" height="2.4" fill="${DUNKEL}"/>`;
  for (let y = -46; y < 0; y += 3.4) k += `<rect x="${L0}" y="${y}" width="1.6" height="1.7" fill="#a49c94" opacity=".5"/>`;
  /* Nordseite: Torbogen zur Brücke, Wappen, Uhr; Abendlicht streift sie */
  k += `<path d="M${L1} 1 L${L1} ${oben + 0.6} L${R1} ${obenR} L${R1} 1.4 Z" fill="${S.lg("turmnord", [[0, "#a0948a"], [0.7, "#c8b49c"], [1, "#f0d4a8"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M1.2 1.2 L1.2 -5.2 Q3.7 -10 6.2 -5.2 L6.2 1.3 Z" fill="#1e1a1c"/><path d="M1.2 -5.2 Q3.7 -10 6.2 -5.2" stroke="#e8d4b0" stroke-width=".45" fill="none"/>`;
  /* Stadtwappen: zwei gekreuzte silberne Schlüssel auf Rot */
  k += `<path d="M2.2 -14.6 L5.2 -14.6 L5.2 -12 Q3.7 -10.6 2.2 -12 Z" fill="#b8232a" stroke="#e8d4b0" stroke-width=".15"/>`;
  for (const sx of [-1, 1]) k += `<line x1="${r(3.7 - sx * 1.1)}" y1="-14.1" x2="${r(3.7 + sx * 1.1)}" y2="-11.6" stroke="#e8eaee" stroke-width=".32"/><circle cx="${r(3.7 - sx * 1.15)}" cy="-14.2" r=".38" fill="none" stroke="#e8eaee" stroke-width=".2"/><rect x="${r(3.7 + sx * 1.1 - (sx > 0 ? 0 : 0.5))}" y="-12" width=".5" height=".4" fill="#e8eaee"/>`;
  /* Uhr (17. Jh.), Zeiger auf kurz nach acht */
  const UX = 3.7, UY = -30;
  k += `<ellipse cx="${UX}" cy="${UY}" rx="2.7" ry="3.1" fill="#f0e6d0" stroke="#2a2420" stroke-width=".4"/>`;
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; k += `<line x1="${r(UX + Math.sin(a) * 2)}" y1="${r(UY - Math.cos(a) * 2.35)}" x2="${r(UX + Math.sin(a) * 2.4)}" y2="${r(UY - Math.cos(a) * 2.8)}" stroke="#2a2420" stroke-width=".25"/>`; }
  k += `<line x1="${UX}" y1="${UY}" x2="${r(UX + Math.sin(8.1 / 12 * 2 * Math.PI) * 1.4)}" y2="${r(UY - Math.cos(8.1 / 12 * 2 * Math.PI) * 1.6)}" stroke="#1a1410" stroke-width=".5" stroke-linecap="round"/><line x1="${UX}" y1="${UY}" x2="${r(UX + Math.sin(1.2 / 12 * 2 * Math.PI) * 2.1)}" y2="${r(UY - Math.cos(1.2 / 12 * 2 * Math.PI) * 2.4)}" stroke="#1a1410" stroke-width=".32" stroke-linecap="round"/>`;
  for (const [x, y] of [[2.2, -20], [5, -20], [3.2, -38]]) k += `<rect x="${x}" y="${y}" width=".9" height="2.2" fill="${DUNKEL}"/>`;
  /* hohes Walmdach mit Gauben, Lichtkante rechts */
  k += `<path d="M${L0 - 0.8} ${oben} L${L1} ${oben + 0.6} L${R1 + 0.8} ${obenR} L${r((L0 + R1) / 2 + 1)} -66 Z" fill="${ZIEGEL}"/>`;
  k += `<path d="M${L1} ${oben + 0.6} L${R1 + 0.8} ${obenR} L${r((L0 + R1) / 2 + 1)} -66 Z" fill="${S.lg("turmdach", [[0, "#8a4e3a"], [1, "#d8905e"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${r((L0 + R1) / 2 + 1)} -66 L${R1 + 0.8} ${obenR}" stroke="${RAND}" stroke-width=".6"/>`;
  for (const [x, y] of [[-6, -51.6], [-2.6, -51.4], [3.4, -51.2]]) k += `<path d="M${x - 1} ${y} l1 -2 l1 2 Z" fill="#5a2a22"/><rect x="${x - 0.7}" y="${y}" width="1.4" height="1" fill="#1e1818"/>`;
  k += `<line x1="${r((L0 + R1) / 2 + 1)}" y1="-66" x2="${r((L0 + R1) / 2 + 1)}" y2="-69" stroke="${DUNKEL}" stroke-width=".35"/><circle cx="${r((L0 + R1) / 2 + 1)}" cy="-69.2" r=".55" fill="${GOLD}"/>`;
  k += `<rect x="${R1 - 0.7}" y="${obenR}" width=".7" height="${r(1.4 - obenR)}" fill="${RAND}" opacity=".8"/>`;
  S.teil({ id: "brueckturm", de: "der Brückturm", syl: "BRÜCK-turm", it: "la torre del ponte", itSyl: "TOR-re del PON-te", en: "bridge tower",
    x: BT.x, y: BT.y - 30, kunst: anker(0, -30, gruppe("brueckturm", BT.x, BT.y, k)), tipp: "Durch das Tor im Brückturm kommt man von der Brücke in die Altstadt. Früher musste man hier Zoll bezahlen.",
    zoom: { x: BT.x - 16, y: BT.y - 56, w: 30, h: 56 },
    unter: [
      { id: "uhr", de: "die Uhr", syl: "UHR", it: "l'orologio", itSyl: "o-ro-LO-gio", en: "clock", x: BT.x + UX, y: BT.y + UY + 4.4, kunst: flaeche(-4, -8.6, 8, 8.6), tipp: "Die Turmuhr stammt aus dem 17. Jahrhundert. Es ist kurz nach acht Uhr abends." },
      { id: "wappen", de: "das Wappen", syl: "WAP-pen", it: "lo stemma", itSyl: "STEM-ma", en: "coat of arms", x: BT.x + 3.7, y: BT.y - 10, kunst: flaeche(-3.6, -6.4, 7.2, 6.4), tipp: "Das Wappen von Regensburg: zwei gekreuzte silberne Schlüssel auf Rot – die Schlüssel des heiligen Petrus." },
    ] });
}

/* =====================================================================
   6 — DIE HISTORISCHE WURSTKUCHL (Lupe: Schornstein, Hochwassermarke)
   ===================================================================== */
const WK = { x: 151, y: W - 1 };
{
  let k = "";
  /* Freisitz links: Tische, Bänke, Schirm und ein paar Gäste */
  for (const x of [-24, -18.5]) k += `<rect x="${x}" y="-2.4" width="4.6" height=".6" fill="#5a3e28"/><line x1="${x + 0.6}" y1="-1.8" x2="${x + 0.6}" y2="0" stroke="#3a2a1a" stroke-width=".35"/><line x1="${x + 4}" y1="-1.8" x2="${x + 4}" y2="0" stroke="#3a2a1a" stroke-width=".35"/><rect x="${x}" y="-1.2" width="4.6" height=".4" fill="#4a3220"/>`;
  for (const [x, c] of [[-23, "#7a3a4a"], [-20.4, "#3a5a8a"], [-17.4, "#a87a2a"], [-15, "#4a6a4a"]]) k += `<path d="M${x - 0.6} -1.6 L${x - 0.5} -3.6 Q${x} -4 ${x + 0.5} -3.6 L${x + 0.6} -1.6 Z" fill="${c}"/><circle cx="${x}" cy="-4.2" r=".5" fill="#c8a490"/>`;
  k += `<line x1="-21" y1="-2.4" x2="-21" y2="-7.4" stroke="#5a4a38" stroke-width=".3"/><path d="M-25.4 -6.8 Q-21 -9 -16.6 -6.8 Z" fill="#c8c0b0"/><path d="M-21 -9 Q-18 -8.6 -16.6 -6.8" stroke="${RAND}" stroke-width=".3" fill="none" opacity=".8"/>`;
  /* das niedrige Haus: weiß gekalkt (im Schatten), grüne Fensterläden, Schild */
  k += `<rect x="-11" y="-8" width="20" height="8" fill="${S.lg("kuchlwand", [[0, "#a4a2a8"], [0.8, "#bab6b4"], [1, "#f0dcc0"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="-11" y="-1.6" width="20" height="1.6" fill="#8a8680"/>`;
  k += `<path d="M-7.4 0 L-7.4 -4.8 Q-6 -6 -4.6 -4.8 L-4.6 0 Z" fill="#2a2018"/>`;
  for (const x of [-1.8, 3.4]) k += `<rect x="${x}" y="-5.6" width="2.4" height="2.6" fill="#ffd890" opacity=".85"/><rect x="${x - 1}" y="-5.6" width=".9" height="2.6" fill="#24563a"/><rect x="${x + 2.5}" y="-5.6" width=".9" height="2.6" fill="#24563a"/>`;
  k += `<text x="-1" y="-6.5" font-size="1.45" text-anchor="middle" fill="#1e1a18" font-family="'Old English Text MT','UnifrakturMaguntia',Georgia,serif" font-weight="bold">Historische Wurstkuchl</text>`;
  for (const [y, j] of [[-7, "1784"], [-5.4, "1845"], [-3.8, "1988"], [-2.6, "2013"]]) k += `<line x1="6.6" y1="${y}" x2="8.8" y2="${y}" stroke="#1e2a5a" stroke-width=".28"/><text x="7.7" y="${r(y - 0.25)}" font-size=".55" text-anchor="middle" fill="#1e2a5a" font-family="Arial">${j}</text>`;
  k += `<path d="M-12 -8 L-8 -14 L6 -14 L10 -8 Z" fill="${ZIEGEL_D}"/><path d="M-8 -14 L6 -14 L10 -8" stroke="${RAND}" stroke-width=".55" fill="none" opacity=".9"/>`;
  for (let i = 1; i < 5; i++) { const t = i / 5; k += `<line x1="${r(-12 + t * 4)}" y1="${r(-8 - t * 6)}" x2="${r(10 - t * 4)}" y2="${r(-8 - t * 6)}" stroke="#3a1a14" stroke-width=".12" opacity=".6"/>`; }
  k += `<rect x="2.4" y="-17.4" width="2.6" height="4.6" fill="${S.lg("kamin", [[0, "#7a6a64"], [1, "#d8b898"]], 0, 0, 1, 0)}"/><rect x="2.1" y="-17.8" width="3.2" height=".8" fill="#4a3a34"/>`;
  k += `<g filter="url(#${S.id("rauch")})" opacity=".55"><path d="M3.7 -18.6 q-1.8 -2.6 -.4 -5.2 q1.6 -2.6 -1.2 -5.2 q-2.4 -2.2 -1.2 -4.8" stroke="#e8e4ec" stroke-width="2" fill="none" stroke-linecap="round"/></g>`;
  S.teil({ id: "wurstkuchl", de: "die Wurstkuchl", syl: "WURST-ku-chl", it: "la Wurstkuchl (la cucina delle salsicce)", itSyl: "WURST-ku-chl", en: "Sausage Kitchen",
    x: WK.x - 4, y: WK.y - 4, kunst: anker(-4, -4, gruppe("wurstkuchl", WK.x, WK.y, k)), tipp: "Die Historische Wurstkuchl gilt als älteste Bratwurstküche der Welt. „Kuchl“ heißt auf Bairisch Küche.",
    zoom: { x: WK.x - 27, y: WK.y - 24, w: 38, h: 26 },
    unter: [
      { id: "schornstein", de: "der Schornstein", syl: "SCHORN-stein", it: "il comignolo", itSyl: "co-MI-gno-lo", en: "chimney", x: WK.x + 3.7, y: WK.y - 12.8, kunst: flaeche(-2.6, -9, 5.2, 9),
        tipp: "Die Würste werden über Holzkohle gegrillt – darum raucht der Schornstein (in Bayern sagt man auch „Kamin“)." },
      { id: "hochwassermarke", de: "die Hochwassermarke", syl: "HOCH-was-ser-mar-ke", it: "il segno della piena", itSyl: "SE-gno del-la PIE-na", en: "flood mark", x: WK.x + 7.7, y: WK.y - 1.6, kunst: flaeche(-2.2, -6.6, 4.4, 6.6),
        tipp: "Die Striche zeigen, wie hoch die Donau bei Hochwasser stand." },
    ] });
}

/* =====================================================================
   7 — DAS SCHIFF am Anleger vor der Altstadt (≈ 37 m, 2,4 E/m)
   ===================================================================== */
{
  const Y = 121.8, s = kw(Y) * 0.98, X = 60;
  const p = (x, y) => `${r(x * s)} ${r(y * s)}`;
  let k = "";
  k += `<path d="M${p(-18.5, -3)} L${p(17, -3)} L${p(18.4, -1)} Q${p(18, 0.2)} ${p(16.6, 0.2)} L${p(-16, 0.2)} Q${p(-18, 0)} ${p(-18.5, -3)} Z" fill="${S.lg("rumpf", [[0, "#c8ccd4"], [0.5, "#d8dade"], [0.52, "#1f4f8f"], [0.7, "#1f4f8f"], [0.72, "#b8bcc4"], [0.86, "#b8bcc4"], [0.88, "#1e1e1e"], [1, "#1e1e1e"]])}"/>`;
  k += `<text x="${r(-11 * s)}" y="${r(-1.9 * s)}" font-size="${r(0.9 * s)}" fill="#1f4f8f" font-family="Arial,sans-serif" font-weight="bold" letter-spacing=".2">REGENSBURG</text>`;
  k += `<rect x="${r(-14.5 * s)}" y="${r(-5.7 * s)}" width="${r(29 * s)}" height="${r(2.8 * s)}" fill="#c4c8d0"/>`;
  for (let x = -13.6; x < 13.6; x += 1.8) {
    k += `<rect x="${r(x * s)}" y="${r(-5.3 * s)}" width="${r(1.3 * s)}" height="${r(1.6 * s)}" rx=".2" fill="${S.lg("scheibe", [[0, "#5a6e80"], [1, "#2a3a4a"]])}"/>`;
    if (rnd() < 0.55) k += `<circle cx="${r((x + 0.65) * s)}" cy="${r(-4.2 * s)}" r="${r(0.32 * s)}" fill="${["#c89a80", "#6a4a3a", "#e0b898", "#3a2a22"][Math.floor(rnd() * 4)]}"/>`;
  }
  k += `<rect x="${r(-15 * s)}" y="${r(-6.2 * s)}" width="${r(30 * s)}" height="${r(0.5 * s)}" fill="#1f4f8f"/>`;
  k += `<path d="M${p(-13.5, -6.2)} L${p(-13.5, -7.3)} L${p(13.5, -7.3)} L${p(13.5, -6.2)}" stroke="#8a929a" stroke-width=".25" fill="none"/>`;
  for (let x = -13.5; x <= 13.5; x += 1.2) k += `<line x1="${r(x * s)}" y1="${r(-6.2 * s)}" x2="${r(x * s)}" y2="${r(-7.3 * s)}" stroke="#8a929a" stroke-width=".15"/>`;
  for (const [x, c] of [[-8, "#b8232a"], [-5.6, "#2f5a9a"], [-1, "#e8c040"], [3, "#3a6a3a"], [6.4, "#7a3a6a"], [9.6, "#c87a2a"]]) k += `<path d="M${p(x - 0.3, -6.2)} L${p(x - 0.25, -7.6)} L${p(x + 0.25, -7.6)} L${p(x + 0.3, -6.2)} Z" fill="${c}"/><circle cx="${r(x * s)}" cy="${r(-7.9 * s)}" r="${r(0.28 * s)}" fill="#c8a08a"/>`;
  k += `<path d="M${p(-3, -9.4)} L${p(12.5, -9.4)} L${p(13, -8.8)} L${p(-3.4, -8.8)} Z" fill="#d8d4cc"/><path d="M${p(-3, -9.4)} L${p(12.5, -9.4)}" stroke="${RAND}" stroke-width=".35"/>`;
  for (const x of [-2.6, 4.8, 12.2]) k += `<line x1="${r(x * s)}" y1="${r(-8.8 * s)}" x2="${r(x * s)}" y2="${r(-6.2 * s)}" stroke="#a8acb0" stroke-width=".25"/>`;
  k += `<rect x="${r(-12.8 * s)}" y="${r(-9 * s)}" width="${r(4.6 * s)}" height="${r(2.8 * s)}" rx=".3" fill="#d0d2d6"/><rect x="${r(-12.4 * s)}" y="${r(-8.6 * s)}" width="${r(3.8 * s)}" height="${r(1.1 * s)}" fill="#3a4a5a"/>`;
  /* Flaggen: Bayern am Bug (links, donauabwärts), Deutschland am Heck */
  k += `<line x1="${r(-18 * s)}" y1="${r(-3 * s)}" x2="${r(-18 * s)}" y2="${r(-6.6 * s)}" stroke="#7a8086" stroke-width=".25"/><rect x="${r(-18 * s)}" y="${r(-6.6 * s)}" width="${r(1.9 * s)}" height="${r(1.2 * s)}" fill="#f4f6f8"/>`;
  for (let i = 0; i < 3; i++) k += `<path d="M${r((-18 + i * 0.63) * s)} ${r(-6.6 * s)} l${r(0.31 * s)} ${r(0.6 * s)} l${r(0.31 * s)} ${r(-0.6 * s)} Z" fill="#2c7fd4"/>`;
  k += `<line x1="${r(17 * s)}" y1="${r(-3 * s)}" x2="${r(17 * s)}" y2="${r(-6.4 * s)}" stroke="#7a8086" stroke-width=".25"/><rect x="${r(17 * s)}" y="${r(-6.4 * s)}" width="${r(1.9 * s)}" height="${r(0.4 * s)}" fill="#1a1a1a"/><rect x="${r(17 * s)}" y="${r(-6 * s)}" width="${r(1.9 * s)}" height="${r(0.4 * s)}" fill="#d8232a"/><rect x="${r(17 * s)}" y="${r(-5.6 * s)}" width="${r(1.9 * s)}" height="${r(0.4 * s)}" fill="#f2c230"/>`;
  /* Festmacher am Anleger */
  k += `<line x1="${r(-15 * s)}" y1="${r(-2.6 * s)}" x2="${r(-16.6 * s)}" y2="${r(-0.4 * s)}" stroke="#5a4a3a" stroke-width=".35"/><line x1="${r(14 * s)}" y1="${r(-2.6 * s)}" x2="${r(15.6 * s)}" y2="${r(-0.4 * s)}" stroke="#5a4a3a" stroke-width=".35"/>`;
  k += `<rect x="${r(14 * s)}" y="${r(-5.7 * s)}" width="${r(0.6 * s)}" height="${r(2.8 * s)}" fill="${RAND}" opacity=".6"/>`;
  S.teil({ id: "schiff", de: "das Schiff", syl: "SCHIFF", it: "la nave", itSyl: "NA-ve", en: "boat", x: X, y: Y - 8, kunst: anker(0, -8, gruppe("schiff", X, Y, k, Y)),
    tipp: "Vom Anleger an der Steinernen Brücke fahren Ausflugsschiffe die Donau hinunter zur Walhalla." });
}

/* =====================================================================
   8 + 9 — DIE DONAU (mit Spiegelungen) und DIE STEINERNE BRÜCKE
   (Lupe: Bogen, Pfeiler, Bruckmandl)
   ===================================================================== */
const U = (s) => 1.8 * s / (1 + 0.8 * s);          /* U(1) = 1: rechter Bildrand */
const BX = (s) => 194 + 127.5 * U(s);
const BK = (s) => 1.94 + 2.8 * U(s);                 /* Einheiten je Meter an der Brücke */
const HOEHE = (s) => 7.4 + 2.4 * Math.sin(Math.PI * s * 0.6);   /* Deck über dem Wasser: Buckel, Scheitel bei s ≈ 0,83 */
const DECK = (s) => HOR - (HOEHE(s) - 3.1) * BK(s);
const WAS = (s) => HOR + 3.1 * BK(s);
const N = 9;
const bogen = [];
for (let j = 0; j < N; j++) bogen.push([(j + 0.2) / N, Math.min(1.02, (j + 0.8) / N)]);
const SCHEITEL = 0.83;
const brueckenKoerper = (spiegeln) => {
  const Y = (s, y) => (spiegeln ? 2 * WAS(s) - y : y);
  let g = "", ober = [], unter = [];
  for (let i = 0; i <= 40; i++) { const s = i / 40; ober.push(`${r(BX(s))} ${r(Y(s, DECK(s) - 1.05 * BK(s)))}`); unter.push(`${r(BX(s))} ${r(Y(s, WAS(s)))}`); }
  g += `<path d="M${ober.join(" L")} L${unter.slice().reverse().join(" L")} Z" fill="${spiegeln ? "#4a4c4e" : BRUECKE}"/>`;
  bogen.forEach(([a, b]) => {
    const m = (a + b) / 2, xa = BX(a), xb = BX(b), xm = BX(m), bkm = BK(m);
    const ys = WAS(m) - 2.4 * bkm, yk = DECK(m) + 2.3 * bkm;
    const rund = `M${r(xa)} ${r(Y(a, WAS(a)))} L${r(xa)} ${r(Y(m, ys))} C${r(xa)} ${r(Y(m, ys - (ys - yk) * 1.1))} ${r(xb)} ${r(Y(m, ys - (ys - yk) * 1.1))} ${r(xb)} ${r(Y(m, ys))} L${r(xb)} ${r(Y(b, WAS(b)))} Z`;
    g += `<path d="${rund}" fill="${spiegeln ? "#2e3a40" : `url(#${S.id("bogenlicht")})`}"/>`;
    if (!spiegeln) {
      /* Keilsteine um den Bogen */
      const n = 9;
      for (let q = 0; q <= n; q++) {
        const t = q / n, ang = Math.PI * (1 - t), cx = (xa + xb) / 2, rx = (xb - xa) / 2, ry = (ys - yk) * 0.83;
        const x0 = cx + Math.cos(ang) * rx, y0 = ys - Math.sin(ang) * ry, x1 = cx + Math.cos(ang) * (rx + 0.9 * bkm * 0.5), y1 = ys - Math.sin(ang) * (ry + 0.9 * bkm * 0.5);
        g += `<line x1="${r(x0)}" y1="${r(y0)}" x2="${r(x1)}" y2="${r(y1)}" stroke="#5e5e5c" stroke-width="${r(0.12 + 0.03 * bkm)}" opacity=".7"/>`;
      }
      g += `<path d="M${r(xa)} ${r(ys)} C${r(xa)} ${r(ys - (ys - yk) * 1.1)} ${r(xb)} ${r(ys - (ys - yk) * 1.1)} ${r(xb)} ${r(ys)}" stroke="#a4a08e" stroke-width="${r(0.25 + 0.08 * bkm)}" fill="none"/>`;
    }
  });
  if (!spiegeln) {
    /* Quaderlagen, Abdeckplatten der Brüstung, warme Lichtkante oben */
    for (const t of [0.6, 1.6, 2.6, 3.6]) { const l = []; for (let i = 0; i <= 20; i++) { const s = i / 20; l.push(`${r(BX(s))} ${r(DECK(s) + t * BK(s))}`); } g += `<path d="M${l.join(" L")}" stroke="#5e5e5a" stroke-width=".18" fill="none" opacity=".55"/>`; }
    for (let i = 1; i < 34; i++) { const s = i / 34; g += `<line x1="${r(BX(s))}" y1="${r(DECK(s) - 1.05 * BK(s))}" x2="${r(BX(s))}" y2="${r(DECK(s) + 0.1 * BK(s))}" stroke="#5e5e5a" stroke-width=".12" opacity=".5"/>`; }
    const k1 = []; for (let i = 0; i <= 40; i++) { const s = i / 40; k1.push(`${r(BX(s))} ${r(DECK(s) - 1.05 * BK(s))}`); }
    g += `<path d="M${k1.join(" L")}" stroke="${RAND}" stroke-width=".8" fill="none"/>`;
    const k2 = []; for (let i = 0; i <= 40; i++) { const s = i / 40; k2.push(`${r(BX(s))} ${r(DECK(s) + 0.05 * BK(s))}`); }
    g += `<path d="M${k2.join(" L")}" stroke="#4e4e4a" stroke-width=".35" fill="none" opacity=".6"/>`;
  }
  /* Pfeilerinseln (Beschlächte) und die Strudel dahinter */
  for (let j = 0; j < N; j++) {
    const p = (j + 1) / N; if (p >= 0.99) continue;
    const x = BX(p), y = WAS(p), bk = BK(p), b = 3 * bk, h = 0.8 * bk;
    if (!spiegeln) {
      g += `<path d="M${r(x - b)} ${r(y + 0.3)} Q${r(x - b * 0.6)} ${r(y - h)} ${r(x)} ${r(y - h)} Q${r(x + b * 0.7)} ${r(y - h)} ${r(x + b * 1.15)} ${r(y + 0.3)} Z" fill="${S.lg("insel", [[0, "#8e8a78"], [1, "#6a6658"]])}"/>`;
      g += `<path d="M${r(x - b * 0.7)} ${r(y - h * 0.6)} Q${r(x)} ${r(y - h * 1.1)} ${r(x + b * 0.8)} ${r(y - h * 0.5)}" stroke="#c8bc9c" stroke-width=".35" fill="none" opacity=".8"/>`;
      /* Stromschnellen: weiße Kämme unterhalb der Bögen, das Wasser fällt sichtbar ab */
      for (let q = 0; q < 4; q++) {
        const yy = y + (0.9 + q * 0.75) * bk * 0.42, xx = x - b * (0.2 + q * 0.18);
        g += `<path d="M${r(xx - b * 0.9)} ${r(yy)} q${r(b * 0.25)} ${r(-0.6 * bk * 0.4)} ${r(b * 0.5)} 0 t${r(b * 0.5)} 0 t${r(b * 0.5)} 0" stroke="#f4fbff" stroke-width="${r(0.25 + 0.07 * bk)}" fill="none" opacity="${r(0.85 - q * 0.15)}"/>`;
      }
      g += `<path d="M${r(x - b * 1.6)} ${r(y + 0.4 * bk)} l${r(b * 3)} 0" stroke="#2a3a44" stroke-width="${r(0.3 * bk)}" opacity=".25"/>`;
    }
  }
  return g;
};
S.def(`<linearGradient id="${S.id("bogenlicht")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2c30"/><stop offset=".55" stop-color="#4a5a60"/><stop offset=".85" stop-color="#e8c890"/><stop offset="1" stop-color="#ffe6b0"/></linearGradient>`);
{
  /* DIE DONAU: Wasser, Spiegelbild (Muster), Schatten der Brücke, goldene Glitzerbahn rechts */
  let k = `<rect x="0" y="${W}" width="320" height="${WU - W}" fill="url(#${S.id("spiegelbild")})"/>`;
  k += `<rect x="0" y="${W}" width="320" height="${WU - W}" fill="${S.lg("tiefe", [[0, "#000", 0], [1, "#0e2230", 0.32]])}"/>`;
  k += `<rect x="0" y="${W}" width="320" height="${WU - W}" fill="${S.lg("glanz", [[0, "#ffe8b0", 0], [0.55, "#ffe8b0", 0.04], [1, "#ffd890", 0.35]], 0, 0, 1, 0)}"/>`;
  for (let i = 0; i < 80; i++) {
    const y = W + 1 + Math.pow(rnd(), 0.75) * (WU - W - 2), w = 1.2 + (y - W) * 0.3 * rnd() + 1, x = rnd() * (318 - w);
    k += `<path d="M${r(x)} ${r(y)} q${r(w / 2)} -.4 ${r(w)} 0" stroke="${rnd() < 0.5 ? "#e8f0f4" : "#203840"}" stroke-width="${r(0.15 + (y - W) * 0.012)}" fill="none" opacity="${r(0.2 + rnd() * 0.35)}"/>`;
  }
  /* Glitzerbahn der Abendsonne (sie steht rechts außerhalb des Bildes) */
  for (let i = 0; i < 70; i++) { const t = rnd(), x = 210 + t * 108 + (rnd() - 0.5) * 12, y = WAS(Math.min(1, Math.max(0, (x - 194) / 127.5))) + 2 + rnd() * (WU - 132); if (y > WU - 1) continue; k += `<rect x="${r(x)}" y="${r(y)}" width="${r(0.8 + rnd() * 2.6)}" height=".4" fill="${rnd() < 0.6 ? "#fff6d8" : "#ffd27a"}" opacity="${r(0.55 + rnd() * 0.45)}"/>`; }
  S.teil({ id: "donau", de: "die Donau", syl: "DO-nau", it: "il Danubio", itSyl: "da-NU-bio", en: "the Danube", x: 150, y: 140, kunst: anker(150, 140, k),
    tipp: "Die Donau fließt durch zehn Länder bis ins Schwarze Meer." });
}
const BRUECKE_LEUTE = [];
{
  /* DIE STEINERNE BRÜCKE mit Fußgängern, Radlern und dem Bruckmandl */
  let k = brueckenKoerper(false);
  const leute = [[0.1, "#b8232a", 0], [0.17, "#3a5a8a", 0], [0.3, "#e8c040", 1], [0.42, "#4a6a4a", 0], [0.5, "#7a3a6a", 0], [0.6, "#c86a2a", 1], [0.68, "#2a2a34", 0], [0.93, "#5a7aa8", 0]];
  for (const [s, c, rad] of leute) {
    const x = BX(s), bk = BK(s), dy = DECK(s);
    const kopf = dy - (rad ? 1.85 : 1.68) * bk;
    k += `<path d="M${r(x - 0.22 * bk)} ${r(dy - 1 * bk)} L${r(x - 0.18 * bk)} ${r(kopf + 0.3 * bk)} Q${r(x)} ${r(kopf + 0.18 * bk)} ${r(x + 0.18 * bk)} ${r(kopf + 0.3 * bk)} L${r(x + 0.22 * bk)} ${r(dy - 1 * bk)} Z" fill="${c}"/>`;
    k += `<circle cx="${r(x)}" cy="${r(kopf + 0.08 * bk)}" r="${r(0.11 * bk)}" fill="#c8a08a"/>`;
    if (rad) k += `<path d="M${r(x - 0.14 * bk)} ${r(kopf + 0.02 * bk)} Q${r(x)} ${r(kopf - 0.16 * bk)} ${r(x + 0.14 * bk)} ${r(kopf + 0.02 * bk)} Z" fill="#e8e8e8"/><line x1="${r(x - 0.5 * bk)}" y1="${r(dy - 1.1 * bk)}" x2="${r(x + 0.5 * bk)}" y2="${r(dy - 1.1 * bk)}" stroke="#2a2a2a" stroke-width="${r(0.06 * bk)}"/>`;
    k += `<path d="M${r(x + 0.18 * bk)} ${r(kopf + 0.3 * bk)} L${r(x + 0.22 * bk)} ${r(dy - 1 * bk)}" stroke="${RAND}" stroke-width="${r(0.05 * bk)}" opacity=".8"/>`;
  }
  /* das Bruckmandl auf dem Scheitel: sitzt auf einem Steinsockel, die Hand über den Augen, schaut zum Dom */
  {
    const s = SCHEITEL, x = BX(s) + 0.4, bk = BK(s), dy = DECK(s) - 1.05 * bk;
    k += `<path d="M${r(x - 0.45 * bk)} ${r(dy)} L${r(x - 0.45 * bk)} ${r(dy - 0.9 * bk)} L${r(x)} ${r(dy - 1.25 * bk)} L${r(x + 0.45 * bk)} ${r(dy - 0.9 * bk)} L${r(x + 0.45 * bk)} ${r(dy)} Z" fill="#8a8678"/><path d="M${r(x)} ${r(dy - 1.25 * bk)} L${r(x + 0.45 * bk)} ${r(dy - 0.9 * bk)}" stroke="${RAND}" stroke-width=".3"/>`;
    const fy = dy - 1.2 * bk, f = bk;
    k += `<path d="M${r(x - 0.15 * f)} ${r(fy)} L${r(x - 0.2 * f)} ${r(fy - 0.5 * f)} L${r(x + 0.15 * f)} ${r(fy - 0.55 * f)} L${r(x + 0.22 * f)} ${r(fy)} Z" fill="#6e6a60"/>`;
    k += `<path d="M${r(x - 0.2 * f)} ${r(fy - 0.05 * f)} l${r(-0.35 * f)} ${r(0.05 * f)} l0 ${r(0.25 * f)}" stroke="#6e6a60" stroke-width="${r(0.1 * f)}" fill="none"/>`;
    k += `<circle cx="${r(x - 0.02 * f)}" cy="${r(fy - 0.68 * f)}" r="${r(0.13 * f)}" fill="#7a766a"/>`;
    k += `<path d="M${r(x - 0.12 * f)} ${r(fy - 0.45 * f)} L${r(x - 0.24 * f)} ${r(fy - 0.68 * f)} L${r(x - 0.12 * f)} ${r(fy - 0.76 * f)}" stroke="#6e6a60" stroke-width="${r(0.07 * f)}" fill="none"/>`;
    k += `<path d="M${r(x + 0.1 * f)} ${r(fy - 0.68 * f)} a${r(0.13 * f)} ${r(0.13 * f)} 0 0 1 ${r(0.04 * f)} ${r(0.12 * f)}" stroke="${RAND}" stroke-width=".25" fill="none"/>`;
    BRUECKE_LEUTE.push([x, dy, bk]);
  }
  const pj = 5, pp = (pj + 1) / N, bj = 6, bm = (bogen[bj][0] + bogen[bj][1]) / 2;
  const bw = BX(bogen[bj][1]) - BX(bogen[bj][0]), bh = WAS(bm) - DECK(bm) - 2.3 * BK(bm);
  const [mx, my, mk] = BRUECKE_LEUTE[0];
  S.teil({ id: "bruecke", de: "die Steinerne Brücke", syl: "STEI-ner-ne BRÜ-cke", it: "il Ponte di Pietra", itSyl: "PON-te di PIE-tra", en: "Stone Bridge",
    x: 268, y: 108, kunst: anker(268, 108, k), tipp: "Die Steinerne Brücke ist fast 900 Jahre alt (1135–1146) und über 300 Meter lang. Heute gehen hier nur Fußgänger und Radfahrer.",
    zoom: { x: 232, y: 74, w: 88, h: 60 },
    unter: [
      { id: "bogen", de: "der Bogen", syl: "BO-gen", it: "l'arco", itSyl: "AR-co", en: "arch", x: BX(bm), y: WAS(bm), kunst: flaeche(-bw / 2, -bh, bw, bh),
        tipp: "Die Brücke hatte 16 runde Bögen aus Stein." },
      { id: "pfeiler", de: "der Pfeiler", syl: "PFEI-ler", it: "il pilone", itSyl: "pi-LO-ne", en: "pier", x: BX(pp), y: WAS(pp) + 0.6 * BK(pp), kunst: flaeche(-3 * BK(pp), -(WAS(pp) - DECK(pp)) * 0.55, 6.6 * BK(pp), (WAS(pp) - DECK(pp)) * 0.55),
        tipp: "Die Pfeiler stehen auf breiten Steininseln. Dazwischen schießt die Donau als Strudel hindurch." },
      { id: "bruckmandl", de: "das Bruckmandl", syl: "BRUCK-man-dl", it: "il Bruckmandl (l'omino del ponte)", itSyl: "BRUCK-man-dl", en: "Bruckmandl (bridge figure)", x: mx, y: my, kunst: flaeche(-0.8 * mk, -2.4 * mk, 1.6 * mk, 2.4 * mk),
        tipp: "Das Bruckmandl sitzt am höchsten Punkt der Brücke und schaut mit der Hand über den Augen zum Dom." },
    ] });
}

/* =====================================================================
   10 — DIE ENTE auf der Donau
   ===================================================================== */
{
  const Y = 150, s = kw(Y) / 9;
  let k = `<ellipse cx="0" cy=".3" rx="${r(5 * s)}" ry="${r(0.7 * s)}" fill="#1e3640" opacity=".3"/>`;
  k += `<path d="M${r(-4.6 * s)} 0 Q${r(-5 * s)} ${r(-2.6 * s)} ${r(-1.6 * s)} ${r(-2.8 * s)} L${r(2 * s)} ${r(-2.4 * s)} Q${r(4 * s)} ${r(-1.6 * s)} ${r(3.6 * s)} 0 Z" fill="${S.lg("ente", [[0, "#8a7e70"], [1, "#5a4a3c"]])}"/>`;
  k += `<path d="M${r(-3 * s)} ${r(-1.2 * s)} Q0 ${r(-2.6 * s)} ${r(2.4 * s)} ${r(-1.2 * s)}" stroke="#d8d4cc" stroke-width="${r(0.25 * s)}" fill="none"/><path d="M${r(-4.4 * s)} ${r(-1.6 * s)} l${r(-1.2 * s)} ${r(-0.8 * s)}" stroke="#2a2a2a" stroke-width="${r(0.4 * s)}"/>`;
  k += `<path d="M${r(1.8 * s)} ${r(-2.4 * s)} Q${r(2 * s)} ${r(-4.6 * s)} ${r(3 * s)} ${r(-4.8 * s)}" stroke="#24603a" stroke-width="${r(1.2 * s)}" fill="none" stroke-linecap="round"/>`;
  k += `<circle cx="${r(3 * s)}" cy="${r(-5 * s)}" r="${r(1.1 * s)}" fill="#24603a"/><path d="M${r(3.8 * s)} ${r(-5 * s)} l${r(1.6 * s)} ${r(0.3 * s)} l${r(-1.6 * s)} ${r(0.4 * s)} Z" fill="#e8b830"/><rect x="${r(1.7 * s)}" y="${r(-3.2 * s)}" width="${r(1.3 * s)}" height="${r(0.35 * s)}" fill="#f4f4f0"/>`;
  k += `<path d="M${r(2 * s)} ${r(-2.4 * s)} Q${r(4 * s)} ${r(-1.6 * s)} ${r(3.6 * s)} 0" stroke="${RAND}" stroke-width=".35" fill="none" opacity=".8"/>`;
  k += `<path d="M${r(-6 * s)} ${r(0.6 * s)} q${r(6 * s)} ${r(0.8 * s)} ${r(12 * s)} 0" stroke="#f6fbff" stroke-width=".3" fill="none" opacity=".7"/>`;
  k += flaeche(-9, -12, 18, 14);
  S.teil({ oben: true, id: "ente", de: "die Ente", syl: "EN-te", it: "l'anatra", itSyl: "A-na-tra", en: "duck", x: 184, y: Y, kunst: k, tipp: "Die Ente schwimmt auf der Donau." });
}

/* =====================================================================
   11 — DER BIERGARTEN: Kies, Ufergras, Schattenteppich unter der
        Kastanie mit Lichtflecken, lange Abendschatten
   ===================================================================== */
{
  let f = `<path d="M0 ${WU} Q80 ${WU - 1.4} 160 ${WU - 0.6} T320 ${WU - 1} L320 200 L0 200 Z" fill="${S.lg("kies", [[0, "#b8a888"], [1, "#9a8a70"]])}"/>`;
  f += `<path d="M0 ${WU} Q80 ${WU - 1.4} 160 ${WU - 0.6} T320 ${WU - 1} L320 ${WU + 4} Q160 ${WU + 5} 0 ${WU + 4.6} Z" fill="${S.lg("gras", [[0, "#6a8a40"], [1, "#4e6e30"]])}"/>`;
  for (let i = 0; i < 110; i++) { const x = rnd() * 319, y = WU - 1 + rnd() * 6; f += `<line x1="${r(x)}" y1="${r(y)}" x2="${r(Math.min(320, x + rnd() - 0.5))}" y2="${r(y - 1 - rnd() * 1.6)}" stroke="${rnd() < 0.5 ? "#a8c46a" : "#3e5e26"}" stroke-width=".3"/>`; }
  for (let i = 0; i < 110; i++) f += `<circle cx="${r(1 + rnd() * 318)}" cy="${r(WU + 5 + Math.pow(rnd(), 0.7) * 38)}" r="${r(0.15 + rnd() * 0.35)}" fill="${rnd() < 0.5 ? "#e8dcc0" : "#7a6a50"}" opacity=".6"/>`;
  /* der Schatten der Kastanienkrone mit Lichtflecken */
  f += `<path d="M0 ${WU + 6} Q60 ${WU + 4} 120 ${WU + 8} Q190 ${WU + 14} 214 200 L0 200 Z" fill="#1e1a10" opacity=".34" filter="url(#bw_weich)"/>`;
  let fl = "";
  for (let i = 0; i < 18; i++) { const x = 6 + rnd() * 170, y = WU + 9 + rnd() * 32; fl += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(1.6 + rnd() * 3)}" ry="${r(0.5 + rnd() * 0.8)}" fill="#ffe2a0" opacity="${r(0.25 + rnd() * 0.25)}"/>`; }
  f += `<g filter="url(#${S.id("rauch")})">${fl}</g>`;
  f += `<rect x="0" y="${WU}" width="320" height="${200 - WU}" fill="${S.lg("kieslicht", [[0, "#2a2010", 0.14], [0.55, "#000", 0], [1, "#ffd090", 0.2]], 0, 0, 1, 0)}"/>`;
  S.teil({ id: "biergarten", de: "der Biergarten", syl: "BIER-gar-ten", it: "la birreria all'aperto", itSyl: "bir-re-RI-a al-la-PER-to", en: "beer garden", x: 272, y: 186, kunst: anker(272, 186, f),
    tipp: "Im Biergarten sitzt man im Sommer draußen unter Bäumen und isst und trinkt." });
}

/* =====================================================================
   12 — DIE KASTANIE: knorriger Stamm, Hauptäste, breite Krone über dem Tisch
   ===================================================================== */
{
  const X = 18, Y = 190;
  let k = langschatten(X + 2, Y, 22, 30, 0.3);
  k += `<path d="M-14 0 Q-9 -4 -8.4 -18 Q-7.4 -40 -8 -64 Q-8.6 -80 -9 -96 L3 -98 Q3 -84 4.6 -70 Q7 -46 7 -24 Q8 -6 15 0 Z" fill="${S.lg("stamm", [[0, "#24180e"], [0.55, "#3e2c1e"], [1, "#7a5a40"]], 0, 0, 1, 0)}"/>`;
  for (let i = 0; i < 22; i++) { const y = -4 - i * 4.2, x = -5 + rnd() * 9; k += `<path d="M${r(x)} ${r(y)} q${r(-0.6 + rnd() * 1.2)} -2 ${r(-0.3 + rnd() * 0.6)} -4" stroke="#140c06" stroke-width=".5" fill="none" opacity=".55"/>`; }
  k += `<ellipse cx="-2" cy="-36" rx="2.6" ry="3.4" fill="#2a1c10"/><path d="M-3.6 -38 q1.6 -1.6 3.2 0" stroke="#5a4232" stroke-width=".5" fill="none"/>`;
  k += `<path d="M6 -24 Q7 -8 12 0" stroke="${RAND}" stroke-width=".8" fill="none" opacity=".55"/>`;
  /* drei Hauptäste, die in der Krone verschwinden */
  const AST = S.lg("ast", [[0, "#2a1c12"], [1, "#5a4232"]], 0, 0, 1, 0);
  k += `<path d="M-6 -88 Q-14 -104 -16 -122 L-11 -123 Q-8 -106 -1 -94 Z" fill="${AST}"/>`;
  k += `<path d="M-2 -92 Q8 -110 26 -128 L30 -125 Q14 -108 3 -88 Z" fill="${AST}"/>`;
  k += `<path d="M1 -82 Q22 -96 52 -114 L54 -110 Q26 -92 4 -76 Z" fill="${AST}"/>`;
  /* Krone: breite Kuppel aus dunklen Laubmassen (weich), am Rand handförmige Blätter, Gegenlicht oben rechts */
  const KY = -Y;
  let krone = "";
  const rand = [[-20, 100], [-6, 92], [8, 86], [22, 80], [34, 72], [46, 66], [58, 61], [72, 56], [86, 49], [98, 42], [106, 34], [110, 24], [108, 12], [100, 2], [92, -6], [-20, -6]];
  krone += `<path d="M${rand.map(([x, y]) => `${x} ${r(KY + y)}`).join(" L")} Z" fill="#1c3418"/>`;
  let lm = "";
  for (let i = 0; i < 26; i++) { const x = -14 + rnd() * 116, y = rnd() * 70; if (y > 100 - x * 0.62) continue; lm += `<ellipse cx="${r(x)}" cy="${r(KY + y)}" rx="${r(7 + rnd() * 9)}" ry="${r(4 + rnd() * 5)}" fill="${["#24441f", "#2e5426", "#1a3216"][i % 3]}"/>`; }
  krone += `<g filter="url(#${S.id("rauch")})">${lm}</g>`;
  const blatt = (cx, cy, gr, dreh, ton) => {
    let g = "";
    const Fa = [["#1e3a1a", "#26461f", "#2e5426"], ["#2e5426", "#3a6a2e", "#467a34"], ["#6a9a3a", "#86b44a", "#a8cc62"]][ton];
    for (let i = 0; i < 5; i++) {
      const a = (dreh + (i - 2) * 30) * Math.PI / 180, l = gr * (1 - Math.abs(i - 2) * 0.16);
      const ex = cx + Math.sin(a) * l, ey = cy - Math.cos(a) * l, nx = Math.cos(a) * l * 0.26, ny = Math.sin(a) * l * 0.26;
      g += `<path d="M${r(cx)} ${r(cy)} Q${r((cx + ex) / 2 + nx)} ${r((cy + ey) / 2 + ny)} ${r(ex)} ${r(ey)} Q${r((cx + ex) / 2 - nx)} ${r((cy + ey) / 2 - ny)} ${r(cx)} ${r(cy)} Z" fill="${Fa[i % 3]}"/>`;
    }
    return g;
  };
  /* Blätter entlang des unteren Kronenrands (hängend) und oben rechts im Gegenlicht */
  for (let i = 0; i < rand.length - 2; i++) {
    const [x0, y0] = rand[i], [x1, y1] = rand[i + 1];
    for (let t = 0; t < 1; t += 0.75) { const x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t; krone += blatt(r(x), r(KY + y - 1), 6 + rnd() * 3, 150 + rnd() * 60, x > 80 ? 2 : rnd() < 0.5 ? 1 : 0); }
  }
  for (let i = 0; i < 8; i++) { const x = 20 + rnd() * 80, y = 4 + rnd() * 40; if (y > 90 - x * 0.62) continue; krone += blatt(r(x), r(KY + y), 6 + rnd() * 3, -40 + rnd() * 80, x > 60 ? 2 : 1); }
  for (const [x, y] of [[24, 60], [44, 50], [10, 74], [70, 42]]) { const yy = KY + y; krone += `<circle cx="${x}" cy="${r(yy)}" r="1.9" fill="#94bc56"/>`; for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; krone += `<line x1="${r(x + Math.cos(a) * 1.7)}" y1="${r(yy + Math.sin(a) * 1.7)}" x2="${r(x + Math.cos(a) * 2.6)}" y2="${r(yy + Math.sin(a) * 2.6)}" stroke="#6a8a34" stroke-width=".25"/>`; } }
  k += `<g transform="translate(-20 0)">${krone}</g>`;
  S.teil({ id: "kastanie", de: "die Kastanie", syl: "kas-TA-nie", it: "l'ippocastano", itSyl: "ip-po-CA-sta-no", en: "horse chestnut tree", x: X - 2, y: Y - 40, steht: true, kunst: anker(-2, -40, k),
    tipp: "Früher pflanzte man Kastanien über die Bierkeller – ihr Schatten hielt das Bier kühl." });
}

/* =====================================================================
   13 — DIE GÄSTE (hinter dem Tisch), 14 — DER TISCH mit Bank
   (Lupe: Bratwurst, Sauerkraut, Senf, Brezel, Bier), 15 — DIE KELLNERIN
   ===================================================================== */
const TI = { x: 92, y: 186 };
const TS = km(TI.y);                       /* 45 Einheiten je Meter */
const PL = TI.y - 0.77 * TS;               /* Tischplatte vorne (0,77 m) */
const Q = 1.45;                            /* Maßstab der Dinge auf dem Tisch */
{
  const Y = 178, s = km(Y);
  const mann = B.mensch({ id: "rgb_gast1", geschlecht: "m", pose: "sitzen", blick: 18, frisur: "kurz", haarfarbe: "braun", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "hemd", farbe: "hellblau" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" } } }, 1.78 * s);
  const frau = B.mensch({ id: "rgb_gast2", geschlecht: "w", pose: "sitzen", blick: -18, frisur: "lang", haarfarbe: "dunkelbraun", haut: "mittel", laecheln: true,
    kleidung: { oberteil: { stueck: "bluse", farbe: "gelb" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "sandale" } } }, 1.66 * s);
  let k = `<rect x="-34" y="${r(-0.47 * s - 2.6)}" width="68" height="2.8" rx=".5" fill="#8a5a30"/><rect x="-34" y="${r(-0.47 * s + 0.2)}" width="68" height="1" fill="#4a2e18"/>`;
  for (const sx of [-1, 1]) k += `<path d="M${sx * 26} 0 L${sx * 31} ${r(-0.45 * s)} M${sx * 31} 0 L${sx * 26} ${r(-0.45 * s)}" stroke="#3a3e44" stroke-width="1.3"/>`;
  k += `<g transform="translate(-16 0)">${leicht(frau.svg, 1)}</g><g transform="translate(16 0)">${leicht(mann.svg, 1)}</g>`;
  S.teil({ id: "gaeste", de: "die Gäste", syl: "GÄS-te", it: "gli ospiti", itSyl: "O-spi-ti", en: "guests", x: TI.x + 12, y: Y - 40, kunst: anker(0, -40, k),
    tipp: "Die Gäste sitzen am Biertisch und schauen auf die Donau und den Dom." });
}
{
  const L = 1.1 * TS, T = 7;               /* halbe Länge (Tisch 2,2 m); Tiefe der Platte im Bild */
  let k = langschatten(0, 0.5, 2 * L, 70, 0.32);
  const HOLZ = S.lg("tischholz", [[0, "#7a4e2a"], [0.5, "#9a6a3c"], [1, "#d8a46a"]], 0, 0, 1, 0);
  for (const sx of [-1, 1]) k += `<path d="M${r(sx * (L - 12))} 0 L${r(sx * (L - 4))} ${r(PL - TI.y + 1.5)} M${r(sx * (L - 4))} 0 L${r(sx * (L - 12))} ${r(PL - TI.y + 1.5)}" stroke="#3a3e44" stroke-width="1.5"/>`;
  k += `<path d="M${r(-L)} ${r(PL - TI.y)} L${r(L)} ${r(PL - TI.y)} L${r(L - 3)} ${r(PL - TI.y - T)} L${r(-L + 3)} ${r(PL - TI.y - T)} Z" fill="${HOLZ}"/>`;
  for (const t of [0.33, 0.66]) k += `<line x1="${r(-L + 3 * t)}" y1="${r(PL - TI.y - T * t)}" x2="${r(L - 3 * t)}" y2="${r(PL - TI.y - T * t)}" stroke="#5a3a1e" stroke-width=".3" opacity=".6"/>`;
  k += `<rect x="${r(-L)}" y="${r(PL - TI.y)}" width="${r(2 * L)}" height="2.2" fill="#6a4426"/>`;
  k += `<path d="M${r(-L + 3)} ${r(PL - TI.y - T)} L${r(L - 3)} ${r(PL - TI.y - T)} L${r(L)} ${r(PL - TI.y)}" stroke="${RAND}" stroke-width=".6" fill="none" opacity=".8"/>`;
  /* die vordere Bank (gehört zur Bierbank-Garnitur) */
  const BY = 196 - TI.y, bs = km(196);
  for (const sx of [-1, 1]) k += `<path d="M${r(sx * (L - 10))} ${BY} L${r(sx * (L - 3))} ${r(BY - 0.45 * bs)} M${r(sx * (L - 3))} ${BY} L${r(sx * (L - 10))} ${r(BY - 0.45 * bs)}" stroke="#3a3e44" stroke-width="1.5"/>`;
  k += `<rect x="${r(-L - 3)}" y="${r(BY - 0.47 * bs - 3.2)}" width="${r(2 * L + 6)}" height="3.4" rx=".6" fill="${S.lg("bankholz", [[0, "#7a4e2a"], [0.6, "#a8743e"], [1, "#e0aa6e"]], 0, 0, 1, 0)}"/>`;
  k += `<rect x="${r(-L - 3)}" y="${r(BY - 0.47 * bs + 0.2)}" width="${r(2 * L + 6)}" height="1.4" fill="#5a3a1e"/>`;
  const ding = (x, y, svg) => `<g transform="translate(${r(x)} ${r(y)}) scale(${Q})">${svg}</g>`;
  /* SECHS AUF KRAUT */
  const tx = -24, ty = PL - TI.y - 3;
  let t = `<ellipse cx="0" cy="0" rx="8" ry="2" fill="#f2eee4"/><ellipse cx="0" cy="-.2" rx="6.6" ry="1.5" fill="#e4e0d4"/>`;
  t += `<path d="M-6 0 Q-5 -2.6 0 -2.8 Q5 -2.6 6 0 Q0 1 -6 0 Z" fill="#e0d494"/>`;
  for (let i = 0; i < 26; i++) { const x = -5.4 + rnd() * 10.8, y = -0.2 - rnd() * 2.2; t += `<path d="M${r(x)} ${r(y)} q.6 -.4 1.2 .1" stroke="${rnd() < 0.5 ? "#c0b060" : "#f0e4b0"}" stroke-width=".22" fill="none"/>`; }
  for (let i = 0; i < 6; i++) { const x = -4.2 + (i % 3) * 3.4 + (i > 2 ? 1.2 : 0), y = -2.2 - (i > 2 ? 1 : 0); t += `<rect x="${r(x - 1.5)}" y="${r(y - 0.55)}" width="3" height="1.1" rx=".55" fill="${S.lg("wurst", [[0, "#d08a48"], [0.5, "#a85a24"], [1, "#6a3412"]])}" transform="rotate(${-8 + i * 4} ${r(x)} ${r(y)})"/>`; }
  k += ding(tx, ty, t);
  const sx0 = -10, sy0 = PL - TI.y - 2.4;
  k += ding(sx0, sy0, `<path d="M-1.8 0 L-1.6 -3.6 L1.6 -3.6 L1.8 0 Z" fill="${S.lg("topf", [[0, "#a89878"], [0.5, "#e6dcc8"], [1, "#c8b898"]], 0, 0, 1, 0)}"/><rect x="-1.7" y="-2.6" width="3.4" height=".7" fill="#2f4f8f"/><ellipse cx="0" cy="-3.6" rx="1.6" ry=".45" fill="#8a5a1e"/><line x1=".4" y1="-3.6" x2="1.6" y2="-6.2" stroke="#c89a5a" stroke-width=".45" stroke-linecap="round"/>`);
  const bx = 3, by = PL - TI.y - 3;
  const bp = (dx, dy) => `${r(dx)} ${r(-2.4 + dy)}`;
  const bre = `M${bp(-3.4, 1.6)} C${bp(-5, 0)} ${bp(-3.6, -2.6)} ${bp(-0.8, -2.4)} C${bp(1.6, -2.2)} ${bp(2.2, 0)} ${bp(0.8, 1.2)} M${bp(3.4, 1.6)} C${bp(5, 0)} ${bp(3.6, -2.6)} ${bp(0.8, -2.4)} C${bp(-1.6, -2.2)} ${bp(-2.2, 0)} ${bp(-0.8, 1.2)}`;
  let br = `<path d="M-4.4 .6 L4.4 .6 L4 -.4 L-4 -.4 Z" fill="#b88a52"/><path d="${bre}" stroke="${S.lg("lauge", [[0, "#b8642a"], [1, "#6a3010"]])}" stroke-width="1.2" fill="none" stroke-linecap="round"/><path d="${bre}" stroke="#e8a060" stroke-width=".3" fill="none" opacity=".6" transform="translate(.15 -.25)"/>`;
  for (let i = 0; i < 8; i++) br += `<circle cx="${r(-3 + rnd() * 6)}" cy="${r(-4.4 + rnd() * 3)}" r=".18" fill="#fffaf0"/>`;
  k += ding(bx, by, br);
  const glas = () => {
    let g = `<path d="M-1.9 0 L-2.1 -8 L2.1 -8 L1.9 0 Z" fill="${S.lg("bier", [[0, "#b87a1a"], [0.5, "#f2be44"], [1, "#ffd870"]], 0, 0, 1, 0)}" opacity=".95"/>`;
    g += `<path d="M-2.2 -8 Q-2.4 -10 -.8 -10.2 Q0 -11 1 -10.2 Q2.4 -10 2.2 -8 Z" fill="#fffaf0"/>`;
    g += `<path d="M2.1 -6.4 q2 .2 1.8 2.4 q-.2 2 -1.9 2" stroke="#e0e4e4" stroke-width=".55" fill="none" opacity=".85"/>`;
    g += `<line x1="1.3" y1="-7.4" x2="1.1" y2="-.8" stroke="#fff" stroke-width=".35" opacity=".6"/>`;
    return g;
  };
  const gy = PL - TI.y - 2;
  k += ding(14, gy, glas()) + ding(22, gy - 0.6, glas());
  S.teil({ id: "tisch", de: "der Tisch", syl: "TISCH", it: "il tavolo", itSyl: "TA-vo-lo", en: "table", x: TI.x, y: TI.y, steht: true, kunst: k,
    tipp: "Im Biergarten sitzt man an langen Holztischen mit Bänken – der Bierbank-Garnitur.",
    zoom: { x: TI.x - 40, y: PL - 22, w: 74, h: 48 },
    unter: [
      { id: "bratwurst", de: "die Bratwurst", syl: "BRAT-wurst", it: "la salsiccia", itSyl: "sal-SIC-cia", en: "sausage", x: TI.x + tx, y: PL - 3 - 1.2 * Q, kunst: flaeche(-5.4 * Q, -2.8 * Q, 10.8 * Q, 2.8 * Q),
        tipp: "In Regensburg isst man „sechs auf Kraut“: sechs kleine Bratwürste auf Sauerkraut." },
      { id: "sauerkraut", de: "das Sauerkraut", syl: "SAU-er-kraut", it: "i crauti", itSyl: "CRAU-ti", en: "sauerkraut", x: TI.x + tx, y: PL - 3 + 2 * Q, kunst: flaeche(-7.8 * Q, -3.2 * Q, 15.6 * Q, 3.2 * Q),
        tipp: "Sauerkraut ist gehobelter, vergorener Weißkohl." },
      { id: "senf", de: "der Senf", syl: "SENF", it: "la senape", itSyl: "SE-na-pe", en: "mustard", x: TI.x + sx0, y: PL - 2.4, kunst: flaeche(-2.4 * Q, -6.6 * Q, 4.8 * Q, 6.8 * Q),
        tipp: "Zur Regensburger Bratwurst gehört süßer Senf." },
      { id: "brezel", de: "die Brezel", syl: "BRE-zel", it: "il pretzel", itSyl: "PRET-zel", en: "pretzel", x: TI.x + bx, y: PL - 3 + 0.6 * Q, kunst: flaeche(-4.6 * Q, -6 * Q, 9.2 * Q, 6 * Q),
        tipp: "In Bayern sagt man „die Brezn“." },
      { id: "bier", de: "das Bier", syl: "BIER", it: "la birra", itSyl: "BIR-ra", en: "beer", x: TI.x + 18, y: PL - 2, kunst: flaeche(-4 - 2.4 * Q, -11.6 * Q, 8 + 4.8 * Q, 11.8 * Q),
        tipp: "Ein großes Glas mit einem halben Liter heißt in Bayern „eine Halbe“." },
    ] });
}
{
  /* DIE KELLNERIN geht mit dem Tablett auf Schulterhöhe zum Tisch: zwei Halbe und ein Teller „sechs auf Kraut“ */
  const Y = 180, s = km(Y), H = 1.68 * s;
  const m = B.mensch({ id: "rgb_kell", geschlecht: "w", pose: "servieren", blick: -62, frisur: "zopf", haarfarbe: "blond", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "bluse", farbe: "weiss" }, kleid: { stueck: "sommerkleid", farbe: "gruen_d" }, schuerze: { stueck: "schuerze", farbe: "rosa" }, schuhe: { stueck: "halbschuh", farbe: "schwarz" }, zubehoer: { stueck: "tablett" } } }, H);
  const hand = m.z.handR, g = H / 160;
  const tx = hand.x * m.k - 4 * g, ty = hand.y * m.k - 5 * g;
  let k = langschatten(0, 0.5, 16, 3 * H * 0.42, 0.3) + leicht(m.svg);
  /* auf dem Tablett: zwei Halbe und ein Teller mit Würstchen auf Kraut */
  const gl = (x) => `<path d="M${r(x - 2 * g)} ${r(ty)} L${r(x - 2.3 * g)} ${r(ty - 12 * g)} L${r(x + 2.3 * g)} ${r(ty - 12 * g)} L${r(x + 2 * g)} ${r(ty)} Z" fill="#f0b840" opacity=".95"/><path d="M${r(x - 2.4 * g)} ${r(ty - 12 * g)} q${r(2.4 * g)} ${r(-2.8 * g)} ${r(4.8 * g)} 0 Z" fill="#fffaf0"/><line x1="${r(x + 1.3 * g)}" y1="${r(ty - 11 * g)}" x2="${r(x + 1.1 * g)}" y2="${r(ty - 1 * g)}" stroke="#fff" stroke-width=".3" opacity=".6"/>`;
  k += `<ellipse cx="${r(tx)}" cy="${r(ty + 0.4 * g)}" rx="${r(17 * g)}" ry="${r(4 * g)}" fill="#a8acb0"/><ellipse cx="${r(tx)}" cy="${r(ty)}" rx="${r(16 * g)}" ry="${r(3.4 * g)}" fill="#d0d4d6"/>`;
  k += `<ellipse cx="${r(tx + 5 * g)}" cy="${r(ty - 0.6 * g)}" rx="${r(7 * g)}" ry="${r(2 * g)}" fill="#f2eee4"/><ellipse cx="${r(tx + 5 * g)}" cy="${r(ty - 1.4 * g)}" rx="${r(5 * g)}" ry="${r(1.4 * g)}" fill="#e0d494"/>`;
  for (let i = 0; i < 3; i++) k += `<rect x="${r(tx + (2 + i * 2.2) * g)}" y="${r(ty - 3 * g)}" width="${r(2.8 * g)}" height="${r(1.1 * g)}" rx="${r(0.5 * g)}" fill="#a85a24"/>`;
  k += gl(tx - 7 * g) + gl(tx - 1.6 * g);
  S.teil({ id: "kellnerin", de: "die Kellnerin", syl: "KELL-ne-rin", it: "la cameriera", itSyl: "ca-me-RIE-ra", en: "waitress", x: 230, y: Y - 34, kunst: anker(0, -34, k),
    tipp: "Die Kellnerin bringt zwei Halbe und „sechs auf Kraut“ an den Tisch." });
}

/* Das Spiegelbild in der Donau (als Muster: die Fläche der Donau bleibt genau das Wasser) */
{
  let sp = "";
  for (const s of spiegel) sp += `<use href="#${S.id("sp_" + s.id)}" transform="translate(${r(s.x)} ${r(2 * s.achse - s.y)}) scale(1 -1)"/>`;
  sp += brueckenKoerper(true);
  S.def(`<pattern id="${S.id("spiegelbild")}" patternUnits="userSpaceOnUse" x="0" y="${W}" width="320" height="${WU - W}"><g transform="translate(0 ${-W})"><rect x="0" y="${W}" width="320" height="${WU - W}" fill="${S.lg("wasser", [[0, "#9aa0a0"], [0.25, "#6e8a92"], [0.6, "#4a6a76"], [1, "#2e4a58"]])}"/><g opacity=".66" filter="url(#${S.id("spiegel")})">${sp}</g></g></pattern>`);
}

/* Abendlicht von rechts, leichter Rand */
S.davor(`<rect width="320" height="200" fill="${S.lg("abendlicht", [[0, "#1a2a50", 0.1], [0.55, "#ffd08a", 0.02], [1, "#ffc878", 0.2]], 0, 0, 1, 0)}"/><circle cx="335" cy="60" r="95" fill="${S.rg("blendung", [[0, "#fff4d8", 0.35], [1, "#fff4d8", 0]])}"/><rect width="320" height="200" fill="${S.rg("vignette", [[0, "#000", 0], [0.72, "#000", 0], [1, "#0a0c14", 0.24]], 0.5, 0.48, 0.78)}"/>`);

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/regensburg.js"));
console.log(aus);
