#!/usr/bin/env node
/* =====================================================================
   NÜRNBERG (FASSUNG 854) — Bilderwelt neu: eine echte Stadtansicht
   ---------------------------------------------------------------------
   RECHERCHE (nuernberg.de „Frauenkirche“, „Schöner Brunnen“, Hochbauamt
   „Männleinlaufen/Uhrentechnik“, Bayerische Schlösserverwaltung
   „Kaiserburg“, tourismus.nuernberg.de „Weinstadel“, „Henkersteg“,
   „Christkindlesmarkt“):
   - STANDORT: verdichtetes Panorama vom Lorenzer (südlichen) Ufer der
     Pegnitz an der Fleischbrücke, Blick nach NORDEN in die Sebalder
     Altstadt; Advent, später Nachmittag, tiefe Sonne von links
     (Südwesten). Echte Richtungen von hier: links (Westen) Weinstadel,
     Wasserturm und Henkersteg — so gezeichnet, wie man sie von der
     Maxbrücke aus sieht; in der Mitte hinten auf dem Burgberg die
     Kaiserburg; rechts der Hauptmarkt mit dem Schönen Brunnen (an seiner
     Nordwestecke) und der Frauenkirche (an seiner Ostseite).
     Verdichtung: Der Hauptmarkt liegt in Wirklichkeit gut 100 m nördlich
     der Pegnitz, die Häuserzeile dazwischen ist weggelassen; die Burg
     ist größer gezeigt, als sie aus 600 m wirkt (Teleblick).
   - KAISERBURG, von West nach Ost: Palas (hohes Dach) mit Kaiserkapelle
     und HEIDENTURM (oben aus Backstein), im äußeren Burghof der runde
     SINWELLTURM („sinwell“ = rund; Buckelquader aus Sandstein, in den
     1560er Jahren aufgestockt: auskragendes Geschoss, Zeltdach mit
     Renaissance-Haube), der Fünfeckturm, die lange KAISERSTALLUNG
     (riesiges Dach mit Gaubenreihen, heute Jugendherberge) und der
     LUGINSLAND (Viereckturm, Helm mit vier Ecktürmchen). Alles steht auf
     dem Burgfelsen aus rotem Sandstein; der Südhang ist bis hinauf mit
     Häusern bebaut, im Westen liegt der Fels frei.
   - FRAUENKIRCHE (1352–62, Ostseite des Hauptmarkts): Westfassade mit
     Treppengiebel und Fialen, Vorhalle mit Portal, darüber der
     Michaelschor mit der Empore (dort spricht das Christkind den Prolog),
     zwei Treppentürmchen, in der Mitte die Kunstuhr: blau-goldenes
     Zifferblatt (2,5 m), darüber die Mondkugel (halb blau, halb golden),
     darunter das MÄNNLEINLAUFEN (1509): jeden Tag um 12 Uhr ziehen die
     sieben Kurfürsten um Kaiser Karl IV.; oben das Maßwerktürmchen.
   - SCHÖNER BRUNNEN (1385–96, Kopie 1903/12): rund 19 m, wie eine gotische
     Kirchturmspitze, durchbrochene Stufen mit Fialen, 40 bunt bemalte,
     vergoldete Figuren (Philosophen, Evangelisten, Kurfürsten, Helden,
     Propheten); davor das schmiedeeiserne Renaissance-Gitter (1587) mit
     dem nahtlosen goldenen Messing-RING — wer ihn dreht, hat einen Wunsch.
   - WEINSTADEL (1446–48): eines der größten Fachwerkhäuser Deutschlands —
     steinernes Erdgeschoss, zwei Fachwerkgeschosse, Holzgalerien zur
     Pegnitz, steiles Satteldach; daneben der WASSERTURM; der HENKERSTEG
     (überdachter Fachwerkgang auf zwei Sandsteinbögen) führt zum
     Henkerturm auf der Trödelmarkt-Insel, wo der Henker wohnte.
   - CHRISTKINDLESMARKT: rund 160 Holzbuden mit rot-weiß gestreiften
     Stoffdächern; typisch: Nürnberger (Elisen-)Lebkuchen in Dosen,
     Zwetschgenmännchen (fränkisch „Zwetschgermännla“) aus Dörrpflaumen
     und Nüssen, Rauschgoldengel aus goldener Folie, Nürnberger
     Rostbratwürste über Buchenholz gegrillt — „Drei im Weggla“.
   Maßstab: Augenhöhe y = 112 (man steht oben an der Brückentreppe, gut
   4 m über der Promenade). Vorne: Einheiten je Meter = (y − 112) / 4.
   Am Hauptmarkt ≈ 2,9 Einheiten je Meter.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, schatten, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "nuernberg", titel: "Nürnberg", emoji: "🏰", thema: "Deutschland", kuerzel: "nbg", fassung: 854 });
const rnd = zufall(1050);
const r = B.r;
const HOR = 112;
const km = (y) => (y - HOR) / 4;
const W = 130;          /* Wasserlinie am Nordufer (Spiegelachse) */
const WU = 158;         /* Kaikante vorne (Lorenzer Ufer) */
const spiegel = [];     /* Teile, die sich in der Pegnitz spiegeln */
const gruppe = (id, x, y, svg) => { spiegel.push({ id, x, y }); return `<g id="${S.id("sp_" + id)}">${svg}</g>`; };

S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("weich")}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation=".35"/></filter>`);
S.def(`<filter id="${S.id("fleck")}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.6"/></filter>`);
S.def(`<filter id="${S.id("wolke")}" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="2.4"/></filter>`);
S.def(`<filter id="${S.id("spiegel")}" x="-2%" y="-5%" width="104%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".012 .42" numOctaves="1" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="3.2" xChannelSelector="R" yChannelSelector="G"/><feGaussianBlur stdDeviation=".6 .25"/></filter>`);
/* Nürnberger Burgsandstein: rötlich, Licht von links (Südwesten) */
const SAND = S.lg("sand", [[0, "#e2b088"], [0.45, "#cb9268"], [1, "#a26c4c"]], 0, 0, 1, 0);
const SAND_D = S.lg("sandd", [[0, "#a06a4e"], [1, "#7c4e3a"]], 0, 0, 1, 0);
const FERN = S.lg("fern", [[0, "#e2b896"], [0.5, "#cfa080"], [1, "#a8806a"]], 0, 0, 1, 0);       /* Burg, leicht im Dunst */
const FERN_D = S.lg("fernd", [[0, "#ad8270"], [1, "#8c6858"]], 0, 0, 1, 0);
const FELS = S.lg("fels", [[0, "#e0a478"], [0.45, "#c4825a"], [1, "#94604a"]], 0, 0, 1, 0);
const ZIEGEL = S.lg("ziegel", [[0, "#c8684a"], [0.5, "#a84e36"], [1, "#843a2a"]], 0, 0, 1, 0);
const ZIEGEL_D = S.lg("ziegeld", [[0, "#94452f"], [1, "#6a2c20"]], 0, 0, 1, 0);
const ZIEGEL_F = S.lg("ziegelf", [[0, "#c27a62"], [0.5, "#a8604c"], [1, "#8a4e40"]], 0, 0, 1, 0);
const KIRCHE = S.lg("kirche", [[0, "#e2cbaa"], [0.45, "#c9aa8a"], [1, "#a08468"]], 0, 0, 1, 0);
const KIRCHE_D = S.lg("kirched", [[0, "#9a7f64"], [1, "#76604c"]], 0, 0, 1, 0);
const GOLD = S.lg("gold", [[0, "#fff1a8"], [0.4, "#f1c74a"], [1, "#a8770f"]], 0, 0, 1, 1);
const EISEN = "#2a2724";
const LICHT = "#ffd98a";
const DUNKEL = "#3a2a24";
/* Farbe mit Dunst mischen (Luftperspektive) */
const mische = (a, b, t) => "#" + [0, 2, 4].map((i) => Math.round(parseInt(a.slice(1 + i, 3 + i), 16) * (1 - t) + parseInt(b.slice(1 + i, 3 + i), 16) * t).toString(16).padStart(2, "0")).join("");
const DUNSTFARBE = "#e6d8cc";

/* =====================================================================
   KULISSE — Winterhimmel am späten Nachmittag, Promenade
   ===================================================================== */
S.hinten(`<rect width="320" height="134" fill="${S.lg("himmel", [[0, "#3c6aa6"], [0.4, "#82a8d0"], [0.75, "#dcd2c8"], [1, "#f2cfa2"]])}"/>`);
S.hinten(`<circle cx="-40" cy="100" r="140" fill="${S.rg("sonne", [[0, "#ffe2a8", 0.55], [1, "#ffe2a8", 0]])}"/>`);
{
  let w = "";
  for (const [x, y, s] of [[40, 20, 1.1], [152, 12, 0.8], [270, 26, 1.2], [216, 50, 0.6]]) {
    w += `<g filter="url(#${S.id("wolke")})" opacity=".88">`;
    for (const [dx, dy, rx, ry] of [[0, 0, 19, 3.6], [-12, 1.2, 11, 2.8], [12, 1, 13, 3], [-2, -2.2, 9, 3.2]])
      w += `<ellipse cx="${r(x + dx * s)}" cy="${r(y + dy * s)}" rx="${r(rx * s)}" ry="${r(ry * s)}" fill="#fbf4ec"/>`;
    w += `<ellipse cx="${r(x - 3 * s)}" cy="${r(y + 2 * s)}" rx="${r(13 * s)}" ry="${r(1.5 * s)}" fill="#f6c9a4" opacity=".7"/></g>`;
  }
  S.hinten(w);
}
/* Kaimauer am Nordufer */
S.hinten(`<rect x="0" y="${W - 3}" width="320" height="4" fill="${S.lg("kai", [[0, "#c09474"], [1, "#8a6248"]])}"/>`);
/* Promenade vorne: Sandsteinplatten in Fluchtperspektive */
{
  let f = `<rect x="0" y="${WU}" width="320" height="${200 - WU}" fill="${S.lg("pflaster", [[0, "#cdb59c"], [1, "#a8917a"]])}"/>`;
  for (let i = -14; i <= 14; i++) f += `<line x1="${r(160 + i * 14)}" y1="${WU}" x2="${r(160 + i * 34)}" y2="200" stroke="#8a7562" stroke-width=".3" opacity=".55"/>`;
  for (const y of [161, 165, 170, 176, 183, 191]) f += `<line x1="0" y1="${y}" x2="320" y2="${y}" stroke="#8a7562" stroke-width=".3" opacity=".5"/>`;
  for (let i = 0; i < 150; i++) f += `<circle cx="${r(rnd() * 320)}" cy="${r(WU + 2 + rnd() * 40)}" r="${r(0.15 + rnd() * 0.3)}" fill="${rnd() < 0.5 ? "#e6d6c2" : "#8a7562"}" opacity=".5"/>`;
  f += `<rect x="0" y="${WU - 0.6}" width="320" height="2.4" fill="${S.lg("kante", [[0, "#e2caae"], [1, "#9a8068"]])}"/>`;
  f += `<rect x="0" y="${WU}" width="320" height="${200 - WU}" fill="${S.lg("pfl", [[0, "#ffd9a0", 0.16], [0.5, "#000", 0], [1, "#000", 0.12]], 0, 0, 1, 0)}"/>`;
  S.hinten(f);
}

/* =====================================================================
   1 — DIE KAISERBURG auf dem Burgfelsen (Lupe: Sinwellturm, Mauer, Felsen)
   ===================================================================== */
const BURG = { x: 118, y: 94 };
{
  let k = "";
  /* Burgberg: Hang mit Gärten und kahlen Winterbäumen (feiner bräunlich-violetter Schleier) */
  const hangPfad = "M-86 8 L-82 -2 Q-78 -12 -73 -22 L-68 -31 L-60 -34 L-30 -35 L-6 -36 L14 -31 L60 -29 L74 -22 Q82 -10 88 8 Z";
  S.def(`<clipPath id="${S.id("hangclip")}"><path d="${hangPfad}"/></clipPath>`);
  k += `<path d="${hangPfad}" fill="${S.lg("hang", [[0, "#94786a"], [0.55, "#7a6256"], [1, "#624e46"]])}"/>`;
  let bm = "", kr = "";
  for (let i = 0; i < 230; i++) {
    const x = -16 + rnd() * 104, y = -34 + rnd() * 40, s2 = 0.45 + rnd() * 0.8;
    kr += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(s2 * 1.4)}" ry="${r(s2)}" fill="${["#a08274", "#86695e", "#b4927e", "#735a52"][i % 4]}" opacity=".75"/>`;
  }
  bm += `<g filter="url(#${S.id("weich")})">${kr}</g>`;
  for (let i = 0; i < 90; i++) {
    const x = -16 + rnd() * 104, y = -32 + rnd() * 38, h = 1.2 + rnd() * 1.6;
    bm += `<path d="M${r(x)} ${r(y)} l0 ${r(-h)} m0 ${r(h * 0.45)} l${r(-h * 0.4)} ${r(-h * 0.4)} m${r(h * 0.4)} ${r(h * 0.1)} l${r(h * 0.45)} ${r(-h * 0.45)}" stroke="#4e3c38" stroke-width=".14" fill="none" opacity=".55"/>`;
  }
  for (const [x, y] of [[12, -26], [22, -24], [46, -25], [66, -19]]) bm += `<path d="M${x - 1.1} ${y} L${x} ${y - 4} L${x + 1.1} ${y} Z" fill="${S.lg("fichte", [[0, "#5a6e56"], [1, "#34463a"]], 0, 0, 1, 0)}"/>`;
  bm += `<path d="M-40 -14 Q10 -18 80 -12 M-36 -6 Q20 -9 84 -4" stroke="#b49478" stroke-width=".35" fill="none" opacity=".45"/>`;
  k += `<g clip-path="url(#${S.id("hangclip")})">${bm}</g>`;
  /* im Westen der nackte Burgfelsen aus rotem Sandstein: Bänke, Klüfte, Simse */
  const felsRand = [[-86, 8], [-83, 0], [-80, -7], [-78, -10], [-76, -16], [-73, -21], [-71, -26], [-68, -31], [-63, -33], [-56, -34.6], [-46, -35], [-30, -35.4], [-14, -36], [-2, -36.2], [6, -33.4], [5, -29], [1, -24], [-4, -18], [-8, -11], [-12, -3], [-15, 8]];
  const felsPfad = `M${felsRand.map(([x, y]) => x + " " + y).join(" L")} Z`;
  S.def(`<clipPath id="${S.id("felsclip")}"><path d="${felsPfad}"/></clipPath>`);
  k += `<path d="${felsPfad}" fill="${S.lg("felsv", [[0, "#e6ae84"], [0.5, "#c98a62"], [1, "#9a5e44"]])}"/>`;
  let fz = `<path d="${felsPfad}" fill="${S.lg("felsh", [[0, "#fff0d8", 0.25], [0.55, "#000", 0], [1, "#3a1a10", 0.3]], 0, 0, 1, 0)}"/>`;
  /* große Schattenflecken (weich), dann kurze Gesteinsbänke mit Lichtkante, dunkle Klüfte */
  let fl = "";
  for (let i = 0; i < 9; i++) fl += `<ellipse cx="${r(-78 + rnd() * 80)}" cy="${r(-30 + rnd() * 34)}" rx="${r(4 + rnd() * 6)}" ry="${r(2 + rnd() * 3)}" fill="${rnd() < 0.6 ? "#7a3e2a" : "#ffe2c0"}" opacity="${rnd() < 0.6 ? 0.28 : 0.22}"/>`;
  fz += `<g filter="url(#${S.id("fleck")})">${fl}</g>`;
  for (let y = -32; y < 8; y += 2.6 + rnd() * 1.8) {
    for (let x = -88 + rnd() * 6; x < 8; x += 6 + rnd() * 10) {
      const l = 3 + rnd() * 7, d = -0.4 + rnd() * 0.8;
      fz += `<path d="M${r(x)} ${r(y)} l${r(l)} ${r(d)}" stroke="#7a4230" stroke-width="${r(0.25 + rnd() * 0.25)}" opacity=".55"/><path d="M${r(x + 0.4)} ${r(y - 0.4)} l${r(l * 0.8)} ${r(d)}" stroke="#ffe0bc" stroke-width=".22" opacity=".4"/>`;
    }
  }
  for (let i = 0; i < 14; i++) { const x = -80 + rnd() * 84, y = -34 + rnd() * 30, h = 4 + rnd() * 8; fz += `<path d="M${r(x)} ${r(y)} l${r(-0.5 + rnd())} ${r(h * 0.5)} l${r(-0.5 + rnd())} ${r(h * 0.5)} l.7 0 l${r(-0.3 + rnd() * 0.6)} ${r(-h)} Z" fill="#5a2c1e" opacity=".45"/>`; }
  for (let i = 0; i < 16; i++) { const x = -80 + rnd() * 80, y = -28 + rnd() * 34; fz += `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(0.7 + rnd() * 0.8)}" ry=".5" fill="#6a6a44" opacity=".7"/>`; }
  k += `<g clip-path="url(#${S.id("felsclip")})">${fz}</g>`;
  k += `<path d="M-83 0 L-80 -7 L-78 -10 L-76 -16 L-73 -21 L-71 -26 L-68 -31" stroke="#ffe0bc" stroke-width=".9" fill="none" opacity=".75"/>`;
  /* Burgmauer an der Felskante, Bastei links */
  k += `<path d="M-66 -30 L-66 -38 L72 -36 L72 -27 L14 -29 L-6 -34 L-30 -33 Z" fill="${FERN}"/>`;
  for (let x = -62; x < 70; x += 7.4) k += `<rect x="${r(x)}" y="-35" width=".6" height="1.8" fill="#6e4532"/>`;
  for (let x = -64; x < 70; x += 3.3) k += `<line x1="${r(x)}" y1="${r(-37.4 + (x + 66) * 0.0145)}" x2="${r(x)}" y2="${r(-30.5 + (x + 66) * 0.02)}" stroke="#a87a62" stroke-width=".12" opacity=".7"/>`;
  k += `<path d="M-66 -38 L72 -36" stroke="#f2d0ae" stroke-width=".5"/>`;
  k += `<path d="M-71 -29 L-69 -41 L-56 -41 L-55 -33 Z" fill="${FERN}"/><path d="M-71 -29 L-69 -41" stroke="#f2d0ae" stroke-width=".6"/><path d="M-69 -41 L-56 -41" stroke="#f2d0ae" stroke-width=".4"/>`;
  /* PALAS mit hohem Dach und Gauben */
  k += `<rect x="-62" y="-52" width="32" height="15" fill="${FERN}"/>`;
  for (let i = 0; i < 7; i++) { const x = -59.4 + i * 4.3; k += `<path d="M${r(x)} -46 L${r(x)} -48.6 Q${r(x + 0.7)} -49.6 ${r(x + 1.4)} -48.6 L${r(x + 1.4)} -46 Z" fill="${DUNKEL}"/><rect x="${r(x)}" y="-42.4" width="1.4" height="2.2" fill="${DUNKEL}"/>`; }
  k += `<rect x="-62" y="-52" width="32" height="1" fill="#f0d2b4"/>`;
  k += `<path d="M-63.4 -52 L-58.6 -66 L-34.2 -66 L-28.6 -52 Z" fill="${ZIEGEL_F}"/>`;
  for (let y = -53.4; y > -66; y -= 1.4) { const t = (-52 - y) / 14; k += `<line x1="${r(-63.4 + t * 4.8)}" y1="${r(y)}" x2="${r(-28.6 - t * 5.6)}" y2="${r(y)}" stroke="#7a3c2c" stroke-width=".12" opacity=".6"/>`; }
  for (let i = 0; i < 6; i++) k += `<path d="M${-57 + i * 4.4} -57 l1 -2.2 l1 2.2 Z" fill="#8a4a38"/><rect x="${-56.6 + i * 4.4}" y="-57" width="1.2" height=".9" fill="${DUNKEL}"/>`;
  k += `<path d="M-63.4 -52 L-58.6 -66" stroke="#eaa080" stroke-width=".5"/>`;
  /* KAISERKAPELLE mit dem HEIDENTURM (oben Backstein) */
  k += `<rect x="-30" y="-46" width="10" height="10" fill="${FERN}"/><path d="M-30.6 -46 L-25 -50 L-19.4 -46 Z" fill="${ZIEGEL_D}"/>`;
  k += `<rect x="-26" y="-68" width="7.4" height="31" fill="${FERN}"/><rect x="-21.6" y="-68" width="3" height="31" fill="${FERN_D}" opacity=".5"/>`;
  k += `<rect x="-26" y="-68" width="7.4" height="10" fill="${S.lg("backstein", [[0, "#be6a4e"], [1, "#8a4632"]], 0, 0, 1, 0)}"/>`;
  for (let y = -67; y < -58; y += 1.3) k += `<line x1="-26" y1="${r(y)}" x2="-18.6" y2="${r(y)}" stroke="#6e3022" stroke-width=".12"/>`;
  k += `<rect x="-24" y="-64" width="1.2" height="2.6" fill="${DUNKEL}"/><rect x="-21.2" y="-64" width="1.2" height="2.6" fill="${DUNKEL}"/><path d="M-23 -50 L-23 -53 Q-22.3 -54 -21.6 -53 L-21.6 -50 Z" fill="${DUNKEL}"/>`;
  k += `<path d="M-26.8 -68 L-22.3 -78 L-17.8 -68 Z" fill="${ZIEGEL_F}"/><path d="M-22.3 -78 L-17.8 -68 L-21 -68 Z" fill="#000" opacity=".15"/><line x1="-22.3" y1="-78" x2="-22.3" y2="-80.4" stroke="${DUNKEL}" stroke-width=".3"/>`;
  /* SINWELLTURM: runder Schaft mit Buckelquadern, auskragendes Geschoss, Zeltdach, Haube */
  const SW = -4;
  k += `<path d="M${SW - 4.8} -34 L${SW - 4.6} -57 L${SW + 4.6} -57 L${SW + 4.8} -34 Z" fill="${S.lg("rund", [[0, "#c69478"], [0.22, "#f2cca8"], [0.55, "#cc9a78"], [1, "#8a5e4a"]], 0, 0, 1, 0)}"/>`;
  /* Buckelquader: Lagen aus großen, rauen Blöcken, an den Rändern schmaler (runder Schaft) */
  for (let i = 0; i < 10; i++) {
    const y = -34.2 - i * 2.28, R = 4.7 - i * 0.012, off = (i % 2) * 0.32;
    for (let j = -3; j < 3; j++) {
      const a0 = Math.max(-1.45, (j + off) * 0.48), a1 = Math.min(1.45, (j + 1 + off) * 0.48);
      if (a1 <= a0) continue;
      const x0 = SW + Math.sin(a0) * R + 0.1, x1 = SW + Math.sin(a1) * R - 0.1, hell = Math.cos((a0 + a1) / 2 + 0.6);
      k += `<rect x="${r(x0)}" y="${r(y - 2.1)}" width="${r(Math.max(0.2, x1 - x0))}" height="2" rx=".5" fill="${hell > 0.75 ? "#f2cba6" : hell > 0.4 ? "#d8a682" : hell > 0 ? "#b98462" : "#94634c"}" opacity=".75"/>`;
      k += `<path d="M${r(x0 + 0.2)} ${r(y - 1.9)} L${r(x1 - 0.2)} ${r(y - 1.9)}" stroke="#fff0d8" stroke-width=".22" opacity="${r(Math.max(0, hell) * 0.6)}"/>`;
    }
  }
  k += `<path d="M${SW - 0.6} -46.6 L${SW - 0.6} -48.8 Q${SW} -49.6 ${SW + 0.6} -48.8 L${SW + 0.6} -46.6 Z" fill="${DUNKEL}"/><rect x="${SW + 1.8}" y="-41" width=".9" height="2" rx=".4" fill="${DUNKEL}"/>`;
  /* Konsolen und auskragendes Geschoss */
  k += `<path d="M${SW - 4.6} -57 L${SW - 6} -58.8 L${SW + 6} -58.8 L${SW + 4.6} -57 Z" fill="${FERN_D}"/>`;
  for (let j = -5; j <= 5; j += 1.25) k += `<rect x="${r(SW + j - 0.22)}" y="-58.6" width=".44" height="1.3" fill="#6e4532"/>`;
  k += `<rect x="${SW - 6}" y="-64.6" width="12" height="5.8" fill="${S.lg("geschoss", [[0, "#ecc8a4"], [0.45, "#d4a682"], [1, "#94664e"]], 0, 0, 1, 0)}"/>`;
  for (const x of [-4.2, -1.6, 1, 3.6]) k += `<rect x="${r(SW + x - 0.5)}" y="-63.2" width="1" height="2.4" fill="${DUNKEL}"/>`;
  k += `<rect x="${SW - 6.2}" y="-64.8" width="12.4" height=".7" fill="#f2d0ae"/>`;
  /* Zeltdach mit Renaissance-Haube */
  k += `<path d="M${SW - 6.8} -64.6 L${SW - 1.1} -73.6 L${SW + 1.1} -73.6 L${SW + 6.8} -64.6 Z" fill="${ZIEGEL_F}"/>`;
  k += `<path d="M${SW + 1.1} -73.6 L${SW + 6.8} -64.6 L${SW + 2.4} -64.6 Z" fill="#000" opacity=".14"/>`;
  k += `<path d="M${SW - 6.8} -64.6 L${SW - 1.1} -73.6" stroke="#eaa080" stroke-width=".45"/>`;
  k += `<rect x="${SW - 1.3}" y="-76.2" width="2.6" height="2.6" fill="#ddd2c2"/><rect x="${SW - 0.55}" y="-75.8" width="1.1" height="1.8" rx=".5" fill="${DUNKEL}"/>`;
  k += `<path d="M${SW - 1.7} -76.2 Q${SW - 1.8} -78.2 ${SW} -79 Q${SW + 1.8} -78.2 ${SW + 1.7} -76.2 Z" fill="${S.lg("haube", [[0, "#6a7c72"], [0.35, "#a8bcb0"], [1, "#46564e"]], 0, 0, 1, 0)}"/>`;
  k += `<line x1="${SW}" y1="-79" x2="${SW}" y2="-82" stroke="#3a3a36" stroke-width=".35"/><circle cx="${SW}" cy="-80.2" r=".45" fill="${GOLD}"/>`;
  /* FÜNFECKTURM */
  k += `<rect x="8" y="-49" width="8" height="18" fill="${FERN_D}"/><rect x="8" y="-49" width="3.6" height="18" fill="${FERN}" opacity=".8"/>`;
  k += `<path d="M7.4 -49 L12 -56 L16.6 -49 Z" fill="${ZIEGEL_D}"/><rect x="10.6" y="-45" width="1" height="2" fill="${DUNKEL}"/>`;
  /* KAISERSTALLUNG: langes Haus, riesiges Dach mit Gaubenreihen */
  k += `<rect x="17" y="-38" width="41" height="9" fill="${FERN}"/>`;
  for (let i = 0; i < 9; i++) k += `<rect x="${19 + i * 4.4}" y="-35.6" width="1.4" height="2.2" fill="${DUNKEL}"/>`;
  k += `<path d="M16 -38 L22 -58 L52 -58 L59 -38 Z" fill="${ZIEGEL_F}"/>`;
  for (let y = -39.4; y > -58; y -= 1.5) { const t = (-38 - y) / 20; k += `<line x1="${r(16 + t * 6)}" y1="${r(y)}" x2="${r(59 - t * 7)}" y2="${r(y)}" stroke="#7a3c2c" stroke-width=".12" opacity=".55"/>`; }
  k += `<path d="M16 -38 L22 -58" stroke="#eaa080" stroke-width=".45"/>`;
  [[-41.5, 9, 3.6], [-47, 7, 4.2], [-52.4, 5, 5]].forEach(([y, n, d]) => {
    const x0 = 37.5 - (n - 1) * d / 2;
    for (let i = 0; i < n; i++) k += `<path d="M${r(x0 + i * d - 0.9)} ${y} l.9 -1.6 l.9 1.6 Z" fill="#8a4a38"/><rect x="${r(x0 + i * d - 0.6)}" y="${y}" width="1.2" height=".8" fill="#2e2420"/>`;
  });
  /* LUGINSLAND: Viereckturm, Helm mit vier Ecktürmchen */
  k += `<rect x="58" y="-60" width="10" height="31" fill="${FERN_D}"/><rect x="58" y="-60" width="5" height="31" fill="${FERN}" opacity=".85"/>`;
  for (const y of [-56, -49, -42]) k += `<rect x="61.2" y="${y}" width="1.2" height="2.4" fill="${DUNKEL}"/><rect x="64.6" y="${y}" width="1.2" height="2.4" fill="${DUNKEL}"/>`;
  k += `<path d="M57.4 -60 L63 -73 L68.6 -60 Z" fill="${ZIEGEL_F}"/><path d="M63 -73 L68.6 -60 L64.6 -60 Z" fill="#000" opacity=".14"/>`;
  for (const x of [57.6, 68.4]) k += `<rect x="${x - 1.1}" y="-63.4" width="2.2" height="3.6" fill="${FERN}"/><path d="M${x - 1.4} -63.4 L${x} -67.6 L${x + 1.4} -63.4 Z" fill="${ZIEGEL_D}"/>`;
  k += `<line x1="63" y1="-73" x2="63" y2="-75" stroke="${DUNKEL}" stroke-width=".3"/>`;
  /* Fahne über dem Palas (Nürnberger Stadtfarben rot-weiß) */
  k += `<line x1="-46" y1="-66" x2="-46" y2="-72" stroke="#3a3a36" stroke-width=".3"/><path d="M-46 -72 q1.6 .4 3.2 0 l0 1.2 q-1.6 .4 -3.2 0 Z" fill="#f4f1ea"/><path d="M-46 -70.8 q1.6 .4 3.2 0 l0 1.2 q-1.6 .4 -3.2 0 Z" fill="#c8232c"/>`;
  S.teil({ id: "kaiserburg", de: "die Kaiserburg", syl: "KAI-ser-burg", it: "il castello imperiale", itSyl: "ca-STEL-lo im-pe-RIA-le", en: "Imperial Castle",
    x: BURG.x, y: BURG.y, kunst: k, tipp: "Auf der Kaiserburg wohnten im Mittelalter die Kaiser, wenn sie nach Nürnberg kamen.",
    zoom: { x: 30, y: 8, w: 132, h: 88 },
    unter: [
      { id: "sinwellturm", de: "der Sinwellturm", syl: "SIN-well-turm", it: "la torre Sinwell", itSyl: "TOR-re SIN-well", en: "Sinwell Tower",
        x: BURG.x + SW, y: BURG.y - 34, kunst: flaeche(-7, -48, 14, 48), tipp: "„Sinwell“ heißt im alten Deutsch „rund“. Von oben sieht man über die ganze Stadt." },
      { id: "mauer", de: "die Mauer", syl: "MAU-er", it: "il muro", itSyl: "MU-ro", en: "wall",
        x: BURG.x - 40, y: BURG.y - 30, kunst: flaeche(-28, -9, 56, 9) },
      { id: "felsen", de: "der Felsen", syl: "FEL-sen", it: "la roccia", itSyl: "ROC-cia", en: "rock",
        x: BURG.x - 62, y: BURG.y, kunst: flaeche(-20, -28, 22, 30), tipp: "Die Burg steht auf einem Felsen aus rotem Sandstein." },
    ] });
}

/* =====================================================================
   2 — DIE ALTSTADT: steile rote Dächer, Chörlein, Aufzugsgauben
   ===================================================================== */
{
  let k = "";
  const PUTZ = ["#ecdcc2", "#e4c9a0", "#dcb48e", "#eed8b8", "#d2aa8a", "#e8ccae", "#d8bfa2"];
  const DACH = ["#b4553c", "#9a4632", "#a84e36", "#8c3e2c", "#b86448"];
  /* t = Dunst (0 vorne … 0,5 weit hinten am Burghang) */
  const haus = (x, w, base, h, dach, opt) => {
    const t = opt.dunst || 0, m = (c) => (t ? mische(c, DUNSTFARBE, t) : c);
    let g = "";
    const f = m(PUTZ[Math.floor(rnd() * PUTZ.length)]);
    g += `<rect x="${r(x)}" y="${r(base - h)}" width="${r(w)}" height="${r(h)}" fill="${f}"/>`;
    if (opt.sand) g += `<rect x="${r(x)}" y="${r(base - h * 0.34)}" width="${r(w)}" height="${r(h * 0.34)}" fill="${t ? m("#c88f66") : SAND}"/>`;
    if (opt.fach) {
      g += `<rect x="${r(x)}" y="${r(base - h)}" width="${r(w)}" height="${r(h * 0.62)}" fill="${m("#f0e4cc")}"/>`;
      for (let i = 0; i <= 4; i++) g += `<rect x="${r(x + i * (w - 0.5) / 4)}" y="${r(base - h)}" width=".5" height="${r(h * 0.62)}" fill="${m("#5a3424")}"/>`;
      g += `<rect x="${r(x)}" y="${r(base - h * 0.69)}" width="${r(w)}" height=".5" fill="${m("#5a3424")}"/><path d="M${r(x)} ${r(base - h)} L${r(x + w / 4)} ${r(base - h * 0.69)} M${r(x + w)} ${r(base - h)} L${r(x + w * 0.75)} ${r(base - h * 0.69)}" stroke="${m("#5a3424")}" stroke-width=".4"/>`;
    }
    const fe = t ? 0.75 : 1;
    const reihen = Math.max(1, Math.floor(h / (4.4 * fe))), spalten = Math.max(1, Math.floor(w / (3.4 * fe)));
    for (let j = 0; j < reihen; j++) for (let i = 0; i < spalten; i++) {
      const fx = x + (w - spalten * 3.4 * fe) / 2 + i * 3.4 * fe + fe, fy = base - h + 1.6 * fe + j * 4.4 * fe;
      if (fy > base - 2.2 * fe) continue;
      g += `<rect x="${r(fx)}" y="${r(fy)}" width="${r(1.4 * fe)}" height="${r(2 * fe)}" fill="${rnd() < 0.22 ? LICHT : m("#4a3c36")}"/>`;
    }
    if (opt.choerlein) { const cx = x + w / 2; g += `<path d="M${r(cx - 1.8)} ${r(base - h + 7)} l3.6 0 l0 3 l-.6 1.2 l-2.4 0 l-.6 -1.2 Z" fill="${SAND_D}"/><rect x="${r(cx - 1.2)}" y="${r(base - h + 7.6)}" width="2.4" height="1.6" fill="${LICHT}" opacity=".8"/><path d="M${r(cx - 2)} ${r(base - h + 7)} l2 -1.6 l2 1.6 Z" fill="${ZIEGEL_D}"/>`; }
    /* rechte Kante im Schatten (Licht kommt von links) */
    g += `<rect x="${r(x + w - 0.9)}" y="${r(base - h)}" width=".9" height="${r(h)}" fill="#000" opacity="${t ? 0.06 : 0.12}"/>`;
    if (opt.giebel) {
      g += `<path d="M${r(x - 0.4)} ${r(base - h)} L${r(x + w / 2)} ${r(base - h - dach)} L${r(x + w + 0.4)} ${r(base - h)} Z" fill="${f}"/>`;
      g += `<path d="M${r(x + w / 2)} ${r(base - h - dach)} L${r(x + w + 0.4)} ${r(base - h)} L${r(x + w / 2)} ${r(base - h)} Z" fill="#000" opacity="${t ? 0.04 : 0.08}"/>`;
      g += `<path d="M${r(x - 0.6)} ${r(base - h + 0.2)} L${r(x + w / 2)} ${r(base - h - dach)} L${r(x + w + 0.6)} ${r(base - h + 0.2)}" stroke="${m("#843a2a")}" stroke-width="${t ? 0.8 : 1}" fill="none"/>`;
      g += `<rect x="${r(x + w / 2 - 0.8 * fe)}" y="${r(base - h - dach * 0.55)}" width="${r(1.6 * fe)}" height="${r(2.2 * fe)}" fill="${rnd() < 0.3 ? LICHT : m("#4a3c36")}"/>`;
    } else {
      g += `<path d="M${r(x - 0.6)} ${r(base - h)} L${r(x + w * 0.22)} ${r(base - h - dach)} L${r(x + w * 0.78)} ${r(base - h - dach)} L${r(x + w + 0.6)} ${r(base - h)} Z" fill="${m(DACH[Math.floor(rnd() * DACH.length)])}"/>`;
      g += `<path d="M${r(x - 0.6)} ${r(base - h)} L${r(x + w * 0.22)} ${r(base - h - dach)}" stroke="${m("#e09070")}" stroke-width=".35"/>`;
      if (w > 8) { const gx = x + w / 2; g += `<path d="M${r(gx - 1.8 * fe)} ${r(base - h - dach * 0.2)} L${r(gx - 1.8 * fe)} ${r(base - h - dach * 0.6)} L${r(gx)} ${r(base - h - dach * 0.88)} L${r(gx + 1.8 * fe)} ${r(base - h - dach * 0.6)} L${r(gx + 1.8 * fe)} ${r(base - h - dach * 0.2)} Z" fill="${f}"/><rect x="${r(gx - 0.7 * fe)}" y="${r(base - h - dach * 0.55)}" width="${r(1.4 * fe)}" height="${r(1.8 * fe)}" fill="${m("#4a3c36")}"/>`; }
    }
    if (rnd() < 0.35) g += `<rect x="${r(x + w * 0.7)}" y="${r(base - h - dach * 0.75)}" width="1" height="${r(dach * 0.4)}" fill="${m("#7a4434")}"/>`;
    return g;
  };
  /* Häuser am Burghang (gestaffelt, im Dunst) */
  for (const [base, x0, x1, sk, t] of [[86, 132, 194, 0.6, 0.42], [92, 104, 204, 0.7, 0.34], [98, 70, 214, 0.82, 0.26], [104, 40, 226, 0.92, 0.18]]) {
    for (let x = x0; x < x1;) { const w = (8 + rnd() * 5) * sk, h = (7 + rnd() * 4) * sk; k += haus(x, w, base, h, (6 + rnd() * 3) * sk, { giebel: rnd() < 0.5, dunst: t }); x += w + 0.3; }
  }
  /* die Reihe um den Hauptmarkt — sie spiegelt sich in der Pegnitz */
  let reihe = "";
  for (let x = 100; x < 312;) {
    let w = 10 + rnd() * 6;
    if (x + w > 320) w = 320 - x;
    const h = (x > 190 && x < 222) ? 13 + rnd() * 2 : 15 + rnd() * 6;
    reihe += haus(x, w, W - 2, h, 9 + rnd() * 5, { giebel: rnd() < 0.55, sand: rnd() < 0.5, fach: rnd() < 0.25, choerlein: rnd() < 0.35 });
    x += w + 0.3;
  }
  spiegel.unshift({ id: "haeuser", x: 0, y: 0 });
  k += `<g id="${S.id("sp_haeuser")}">${reihe}</g>`;
  S.teil({ id: "altstadt", de: "die Altstadt", syl: "ALT-stadt", it: "il centro storico", itSyl: "CEN-tro STO-ri-co", en: "old town",
    x: 0, y: 0, kunst: k, tipp: "Viele Häuser haben steile rote Dächer und kleine Erker – in Nürnberg heißen sie „Chörlein“." });
}

/* =====================================================================
   3 — DER WEINSTADEL (Lupe: das Fachwerk)
   ===================================================================== */
const WS = { x: 86, y: W };
{
  let k = "";
  const L = -26, R = 30;     /* rechts (Osten) näher: etwas höher */
  const hy = (x) => (x - L) / (R - L);
  const yE = (x) => -6 - 1.6 * hy(x), yF1 = (x) => -13.4 - 2.6 * hy(x), yF2 = (x) => -20.6 - 3.6 * hy(x), yD = (x) => -36 - 5.6 * hy(x);
  /* Erdgeschoss aus Sandstein, steht im Wasser */
  k += `<path d="M${L} 0 L${R} 0 L${R} ${r(yE(R))} L${L} ${r(yE(L))} Z" fill="${SAND}"/>`;
  for (let i = 0; i < 8; i++) { const x = L + 3 + i * 7; k += `<path d="M${r(x)} -.6 L${r(x)} ${r(yE(x) + 2)} Q${r(x + 1.2)} ${r(yE(x) + 0.6)} ${r(x + 2.4)} ${r(yE(x) + 2)} L${r(x + 2.4)} -.6 Z" fill="#4a3226"/>`; }
  k += `<path d="M${L} -1.2 L${R} -1.2" stroke="#6e4a36" stroke-width=".4" opacity=".6"/>`;
  /* zwei Fachwerkgeschosse */
  k += `<path d="M${L} ${r(yE(L))} L${R} ${r(yE(R))} L${R} ${r(yF2(R))} L${L} ${r(yF2(L))} Z" fill="#f2e6cc"/>`;
  k += `<path d="M${L} ${r(yE(L))} L${R} ${r(yE(R))} L${R} ${r(yF2(R))} L${L} ${r(yF2(L))} Z" fill="${S.lg("putzlicht", [[0, "#fff", 0.18], [1, "#7a5a40", 0.2]], 0, 0, 1, 0)}"/>`;
  let fw = "";
  for (let x = L; x <= R + 0.1; x += 3.5) fw += `<line x1="${r(x)}" y1="${r(yE(x))}" x2="${r(x)}" y2="${r(yF2(x))}" stroke="#4e2c1c" stroke-width=".55"/>`;
  for (let x = L; x < R - 1; x += 7) {
    fw += `<line x1="${r(x)}" y1="${r(yE(x))}" x2="${r(x + 3.5)}" y2="${r(yF1(x + 3.5))}" stroke="#4e2c1c" stroke-width=".45"/>`;
    fw += `<line x1="${r(x + 7)}" y1="${r(yF1(x + 7))}" x2="${r(x + 3.5)}" y2="${r(yF2(x + 3.5))}" stroke="#4e2c1c" stroke-width=".45"/>`;
  }
  for (const f of [yE, yF1, yF2]) fw += `<line x1="${L}" y1="${r(f(L))}" x2="${R}" y2="${r(f(R))}" stroke="#4e2c1c" stroke-width=".7"/>`;
  for (let x = L + 1.6; x < R - 1; x += 3.5) {
    fw += `<rect x="${r(x)}" y="${r(yF1(x) - 4.4)}" width="1.4" height="2.4" fill="${rnd() < 0.3 ? LICHT : "#3e3430"}"/>`;
    fw += `<rect x="${r(x)}" y="${r(yE(x) - 4.6)}" width="1.4" height="2.4" fill="${rnd() < 0.25 ? LICHT : "#3e3430"}"/>`;
  }
  /* Holzgalerie mit Geländer zur Pegnitz */
  fw += `<path d="M${L} ${r(yE(L) - 0.2)} L${R} ${r(yE(R) - 0.2)} L${R} ${r(yE(R) - 2.2)} L${L} ${r(yE(L) - 1.9)} Z" fill="#6a3e26" opacity=".85"/>`;
  for (let x = L + 0.8; x < R; x += 1.4) fw += `<line x1="${r(x)}" y1="${r(yE(x) - 0.2)}" x2="${r(x)}" y2="${r(yE(x) - 2)}" stroke="#3e2216" stroke-width=".25"/>`;
  k += fw;
  /* steiles Satteldach mit Gaubenreihen; Westgiebel links */
  k += `<path d="M${L - 0.6} ${r(yF2(L))} L${R + 0.8} ${r(yF2(R))} L${R - 3} ${r(yD(R))} L${L + 4} ${r(yD(L))} Z" fill="${ZIEGEL}"/>`;
  for (let i = 1; i < 10; i++) { const t = i / 10; k += `<line x1="${r(L - 0.6 + t * 4.6)}" y1="${r(yF2(L) + t * (yD(L) - yF2(L)))}" x2="${r(R + 0.8 - t * 3.8)}" y2="${r(yF2(R) + t * (yD(R) - yF2(R)))}" stroke="#7a3424" stroke-width=".12" opacity=".6"/>`; }
  k += `<path d="M${L - 0.6} ${r(yF2(L))} L${L + 4} ${r(yD(L))}" stroke="#eaa080" stroke-width=".5"/>`;
  for (let x = L + 4; x < R - 4; x += 5.2) { const y = (yF2(x) + yD(x)) / 2 + 1.5; k += `<path d="M${r(x - 1)} ${r(y)} l1 -1.8 l1 1.8 Z" fill="#7a3424"/><rect x="${r(x - 0.7)}" y="${r(y)}" width="1.4" height=".9" fill="#2e2420"/>`; }
  for (let x = L + 8; x < R - 8; x += 6.4) { const y = yD(x) + 4.6; k += `<path d="M${r(x - 0.8)} ${r(y)} l.8 -1.4 l.8 1.4 Z" fill="#7a3424"/>`; }
  k += `<path d="M${L + 4} ${r(yD(L))} L${R - 3} ${r(yD(R))}" stroke="#5a2418" stroke-width=".5"/>`;
  S.teil({ id: "weinstadel", de: "der Weinstadel", syl: "WEIN-sta-del", it: "il Weinstadel (antico deposito del vino)", itSyl: "WEIN-sta-del", en: "Wine Depot",
    x: WS.x, y: WS.y, kunst: gruppe("weinstadel", WS.x, WS.y, k), tipp: "Im Weinstadel lagerte früher der Wein der Stadt. Heute wohnen dort Studenten.",
    zoom: { x: WS.x - 32, y: 82, w: 66, h: 50 },
    unter: [
      { id: "fachwerk", de: "das Fachwerk", syl: "FACH-werk", it: "la struttura a graticcio", itSyl: "strut-TU-ra a gra-TIC-cio", en: "half-timbering",
        x: WS.x + 2, y: WS.y - 6, kunst: flaeche(-26, -17, 56, 16), tipp: "Fachwerk: ein Gerüst aus Holzbalken; die Felder dazwischen sind gemauert und verputzt." },
    ] });
}

/* =====================================================================
   4 — DER WASSERTURM (am Westende des Weinstadels, im Wasser)
   ===================================================================== */
const WT = { x: 54, y: W + 1 };
{
  let k = `<rect x="-6" y="-33" width="12" height="33" fill="${SAND}"/>`;
  k += `<rect x="2" y="-33" width="4" height="33" fill="${SAND_D}" opacity=".6"/>`;
  for (let y = -31; y < 0; y += 2.6) k += `<line x1="-6" y1="${r(y)}" x2="6" y2="${r(y)}" stroke="#8a5238" stroke-width=".16" opacity=".6"/>`;
  for (const [x, y] of [[-3, -28], [1.6, -28], [-3, -20], [1.6, -14], [-3, -8]]) k += `<rect x="${x}" y="${y}" width="1.3" height="2.6" fill="${DUNKEL}"/>`;
  k += `<rect x="-6.4" y="-34" width="12.8" height="1.2" fill="#f2d0ae"/>`;
  k += `<path d="M-7 -33.4 L0 -47 L7 -33.4 Z" fill="${ZIEGEL}"/><path d="M0 -47 L7 -33.4 L2 -33.4 Z" fill="#000" opacity=".14"/><path d="M-7 -33.4 L0 -47" stroke="#eaa080" stroke-width=".5"/>`;
  k += `<path d="M-1.2 -39 l1.2 -2 l1.2 2 Z" fill="#7a3424"/><line x1="0" y1="-47" x2="0" y2="-49.4" stroke="${DUNKEL}" stroke-width=".35"/><circle cx="0" cy="-49.6" r=".5" fill="${GOLD}"/>`;
  S.teil({ id: "wasserturm", de: "der Wasserturm", syl: "WAS-ser-turm", it: "la torre dell'acqua", itSyl: "TOR-re del-LAC-qua", en: "water tower",
    x: WT.x, y: WT.y, kunst: gruppe("wasserturm", WT.x, WT.y, k) });
}

/* =====================================================================
   5 — DER HENKERSTEG mit Henkerturm und Henkerhaus (Trödelmarkt-Insel)
   ===================================================================== */
{
  const X = 4, Y = W + 2;
  let k = "";
  /* Henkerturm auf der Insel (links) mit dem Fachwerk-Henkerhaus */
  k += `<rect x="4" y="-36" width="12" height="36" fill="${SAND}"/><rect x="11" y="-36" width="5" height="36" fill="${SAND_D}" opacity=".55"/>`;
  for (let y = -34; y < 0; y += 2.6) k += `<line x1="4" y1="${r(y)}" x2="16" y2="${r(y)}" stroke="#8a5238" stroke-width=".16" opacity=".6"/>`;
  for (const [x, y] of [[7, -30], [11.4, -30], [7, -21], [11.4, -13]]) k += `<rect x="${x}" y="${y}" width="1.3" height="2.6" fill="${DUNKEL}"/>`;
  k += `<path d="M3.2 -36 L10 -50 L16.8 -36 Z" fill="${ZIEGEL}"/><path d="M10 -50 L16.8 -36 L12 -36 Z" fill="#000" opacity=".14"/><path d="M3.2 -36 L10 -50" stroke="#eaa080" stroke-width=".5"/>`;
  k += `<line x1="10" y1="-50" x2="10" y2="-52.4" stroke="${DUNKEL}" stroke-width=".35"/>`;
  k += `<rect x="-4" y="-18" width="8" height="18" fill="#efe3cc"/><path d="M-4 -18 L4 -18 M-4 -9 L4 -9 M0 -18 L0 0 M-4 -18 L0 -9 M4 -18 L0 -9" stroke="#4e2c1c" stroke-width=".5"/>`;
  k += `<path d="M-5 -18 L0 -25 L4.6 -18 Z" fill="${ZIEGEL_D}"/><rect x="-3" y="-15.6" width="1.4" height="2.2" fill="${LICHT}"/>`;
  k += `<rect x="-5" y="-1.4" width="22" height="1.6" fill="${SAND_D}"/>`;
  /* der Steg: zwei Sandsteinbögen, darüber der überdachte Fachwerkgang */
  const s0 = 16, s1 = 44;
  k += `<path d="M${s0} -11 L${s1} -12 L${s1} 0 L${s0} 0 Z" fill="${SAND}"/>`;
  for (const [a, b] of [[s0 + 1.6, s0 + 12.4], [s0 + 15.4, s1 - 1.6]]) k += `<path d="M${a} 0 L${a} -3.6 Q${r((a + b) / 2)} -10.4 ${b} -3.6 L${b} 0 Z" fill="#3c3a36"/><path d="M${a} -3.6 Q${r((a + b) / 2)} -10.4 ${b} -3.6" stroke="#f2d0ae" stroke-width=".4" fill="none"/>`;
  k += `<path d="M${s0 + 12.9} 0 L${s0 + 13.9} -2.4 L${s0 + 14.9} 0 Z" fill="${SAND_D}"/>`;
  k += `<path d="M${s0} -11 L${s1} -12 L${s1} -18.4 L${s0} -17.2 Z" fill="#ecdcc0"/>`;
  for (let x = s0; x <= s1; x += 3.5) k += `<line x1="${r(x)}" y1="${r(-11 - (x - s0) / 28)}" x2="${r(x)}" y2="${r(-17.2 - (x - s0) * 1.2 / 28)}" stroke="#4e2c1c" stroke-width=".45"/>`;
  for (let x = s0 + 1; x < s1 - 1; x += 3.5) k += `<rect x="${r(x)}" y="${r(-15.6 - (x - s0) / 28)}" width="1.6" height="2" fill="#3e3430"/>`;
  k += `<path d="M${s0 - 0.6} -17.2 L${s1 + 0.6} -18.4 L${s1 - 1} -22.6 L${s0 + 1} -21.2 Z" fill="${ZIEGEL}"/><path d="M${s0 - 0.6} -17.2 L${s1 + 0.6} -18.4" stroke="#5a2418" stroke-width=".4"/>`;
  S.teil({ id: "henkersteg", de: "der Henkersteg", syl: "HEN-ker-steg", it: "il ponte del boia", itSyl: "PON-te del BO-ia", en: "Hangman's Bridge",
    x: X, y: Y, kunst: gruppe("henkersteg", X, Y, k), tipp: "Über den Henkersteg ging früher der Henker in die Stadt. Er wohnte allein im Turm auf der Insel." });
}

/* =====================================================================
   6 — DIE FRAUENKIRCHE (Lupe: Uhr, Männleinlaufen, Christkind, Portal)
   ===================================================================== */
const FK = { x: 266, y: W - 2 };
{
  let k = "";
  /* Südwand und Dach, schräg nach hinten (man sieht sie von Südwesten) */
  k += `<path d="M31 0 L52 0 L52 -27 L31 -30 Z" fill="${KIRCHE_D}"/>`;
  for (const x of [36, 45]) k += `<path d="M${x} -4 L${x} -20 Q${x + 2} -24.4 ${x + 4} -20 L${x + 4} -4 Z" fill="#3a3640"/><line x1="${x + 2}" y1="-22" x2="${x + 2}" y2="-4" stroke="#8a7c6a" stroke-width=".3"/>`;
  for (const x of [33, 42, 51]) k += `<path d="M${x - 1} 0 L${x - 1} -24 L${x + 1} -26 L${x + 1} 0 Z" fill="${KIRCHE}"/>`;
  k += `<path d="M31 -30 L52 -27 L22 -76 L4 -82 Z" fill="${ZIEGEL_D}"/>`;
  for (let i = 1; i < 12; i++) { const t = i / 12; k += `<line x1="${r(31 - t * 27)}" y1="${r(-30 - t * 52)}" x2="${r(52 - t * 30)}" y2="${r(-27 - t * 49)}" stroke="#5a2418" stroke-width=".12" opacity=".6"/>`; }
  k += `<path d="M31 -30 L52 -27" stroke="#c99a6e" stroke-width=".6"/>`;
  /* Westfassade: Wand und Treppengiebel mit Fialen */
  const stufen = 6, sx = 31 / stufen, sy = 52 / stufen;
  let giebel = "M-31 0 L-31 -30";
  for (let i = 0; i < stufen; i++) giebel += ` L${r(-31 + i * sx)} ${r(-30 - (i + 1) * sy)} L${r(-31 + (i + 1) * sx)} ${r(-30 - (i + 1) * sy)}`;
  for (let i = stufen - 1; i >= 0; i--) giebel += ` L${r(31 - (i + 1) * sx)} ${r(-30 - (i + 1) * sy)} L${r(31 - i * sx)} ${r(-30 - (i + 1) * sy)}`;
  giebel += " L31 -30 L31 0 Z";
  k += `<path d="${giebel}" fill="${KIRCHE}"/>`;
  /* Steinlagen und Blendmaßwerk im Giebel */
  for (let y = -3; y > -80; y -= 3) { const hw = y > -30 ? 31 : 31 * (1 - (-30 - y) / 52); k += `<line x1="${r(-hw)}" y1="${y}" x2="${r(hw)}" y2="${y}" stroke="#8f765c" stroke-width=".12" opacity=".5"/>`; }
  for (let row = 0; row < 4; row++) {
    const y = -36 - row * 11, hw = 31 * (1 - (row * 11 + 6) / 52) - 3;
    for (let x = -hw; x <= hw - 2.4; x += 3.2) if (Math.abs(x + 1.2) > 10) k += `<path d="M${r(x)} ${y} L${r(x)} ${y - 6} Q${r(x + 1.2)} ${y - 8} ${r(x + 2.4)} ${y - 6} L${r(x + 2.4)} ${y} Z" fill="#8f765c" opacity=".5"/><path d="M${r(x + 1.2)} ${y - 7.4} L${r(x + 1.2)} ${y}" stroke="#d8c2a2" stroke-width=".2" opacity=".6"/>`;
  }
  for (let i = 0; i < stufen; i++) for (const sg of [-1, 1]) {
    const x = sg * (31 - i * sx), y = -30 - (i + 1) * sy;
    k += `<path d="M${r(x - 0.8)} ${r(y)} L${r(x)} ${r(y - 4.2)} L${r(x + 0.8)} ${r(y)} Z" fill="${KIRCHE}"/><circle cx="${r(x)}" cy="${r(y - 4.3)}" r=".4" fill="#ecdcc0"/>`;
    k += `<line x1="${r(x - sg * sx)}" y1="${r(y)}" x2="${r(x)}" y2="${r(y)}" stroke="#f2e2c6" stroke-width=".45"/>`;
  }
  /* große Fenster neben der Vorhalle */
  for (const x of [-25, 19]) k += `<path d="M${x} -6 L${x} -22 Q${x + 3} -27 ${x + 6} -22 L${x + 6} -6 Z" fill="#3a3640"/><path d="M${x + 3} -25 L${x + 3} -6 M${x} -14 L${x + 6} -14" stroke="#9a8670" stroke-width=".35"/>`;
  /* zwei Treppentürmchen */
  for (const x of [-13.5, 13.5]) {
    k += `<rect x="${x - 2}" y="-64" width="4" height="64" fill="${KIRCHE}"/><rect x="${x + 0.6}" y="-64" width="1.4" height="64" fill="#7a644e" opacity=".3"/>`;
    for (let y = -10; y > -60; y -= 9) k += `<rect x="${x - 0.5}" y="${y - 3}" width="1" height="2.4" fill="#3a3640"/>`;
    k += `<path d="M${x - 2.4} -64 L${x} -72 L${x + 2.4} -64 Z" fill="${KIRCHE}"/><circle cx="${x}" cy="-72.4" r=".45" fill="#ecdcc0"/>`;
  }
  /* VORHALLE mit Portal und Figuren, darauf die EMPORE */
  k += `<rect x="-11" y="-27" width="22" height="27" fill="${S.lg("vorhalle", [[0, "#ecd6b6"], [0.55, "#d4ba98"], [1, "#a8906e"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-6 0 L-6 -15 Q0 -24 6 -15 L6 0 Z" fill="#2c2620"/><path d="M-6 -15 Q0 -24 6 -15" stroke="#f4e4c8" stroke-width=".5" fill="none"/>`;
  k += `<path d="M-4.4 0 L-4.4 -13 Q0 -20 4.4 -13 L4.4 0 Z" fill="#3e2f22"/><line x1="0" y1="-19" x2="0" y2="0" stroke="#1e1a16" stroke-width=".4"/>`;
  k += `<rect x="-1" y="-15" width="2" height="4" rx=".8" fill="#d8b46a"/>`;
  for (const x of [-9, -7.6, 7.6, 9]) k += `<rect x="${x - 0.45}" y="-20" width=".9" height="3.2" rx=".4" fill="#b89a78"/><circle cx="${x}" cy="-20.4" r=".45" fill="#c9ad88"/>`;
  k += `<rect x="-12" y="-28.4" width="24" height="1.6" fill="#f0dfc0"/>`;
  k += `<rect x="-11" y="-31.4" width="22" height="3" fill="#e6d0ae"/>`;
  for (let x = -10; x < 10; x += 2.2) k += `<circle cx="${r(x + 1.1)}" cy="-29.9" r=".8" fill="none" stroke="#9a8264" stroke-width=".3"/>`;
  /* Michaelschor mit hohen Fenstern */
  k += `<path d="M-9 -31.4 L-9 -42 L-6 -44 L6 -44 L9 -42 L9 -31.4 Z" fill="${KIRCHE}"/>`;
  for (const x of [-6.4, -2.2, 2, 6.2]) k += `<path d="M${x - 1.2} -32.6 L${x - 1.2} -40 Q${x} -41.8 ${x + 1.2} -40 L${x + 1.2} -32.6 Z" fill="#3a3640"/>`;
  /* das CHRISTKIND auf der Empore: goldenes Gewand, Krone, blonde Locken */
  k += `<g transform="translate(0 -31.6)"><path d="M-1.4 0 L-.6 -3.3 L.6 -3.3 L1.4 0 Z" fill="${GOLD}"/><path d="M-.7 -3.2 L-1.6 -1.3 M.7 -3.2 L1.6 -1.3" stroke="#f1c74a" stroke-width=".42"/><circle cx="0" cy="-3.9" r=".62" fill="#f1d3b8"/><path d="M-.68 -3.8 Q-1.05 -2.6 -.95 -2.1 M.68 -3.8 Q1.05 -2.6 .95 -2.1" stroke="#e8c870" stroke-width=".38" fill="none"/><path d="M-.7 -4.4 L-.6 -5.2 L-.3 -4.7 L0 -5.4 L.3 -4.7 L.6 -5.2 L.7 -4.4 Z" fill="#ffe27a"/></g>`;
  /* MÄNNLEINLAUFEN: Arkade mit Kaiser und Kurfürsten */
  k += `<rect x="-7" y="-50.6" width="14" height="6" fill="#dcc4a2"/>`;
  k += `<rect x="-6.2" y="-49.6" width="12.4" height="4.4" fill="#2f2a2a"/>`;
  for (let x = -6.2; x <= 6.2; x += 3.1) k += `<rect x="${r(x - 0.3)}" y="-49.8" width=".6" height="4.6" fill="#dcc4a2"/>`;
  k += `<rect x="-1" y="-48.8" width="2" height="3.4" fill="${GOLD}"/><circle cx="0" cy="-49.1" r=".7" fill="#f1c74a"/>`;
  for (const [x, c] of [[-4.6, "#b8232a"], [-2.6, "#2f5a9a"], [2.6, "#2f7a4a"], [4.6, "#b8232a"]]) k += `<rect x="${x - 0.5}" y="-48.2" width="1" height="2.8" rx=".3" fill="${c}"/><circle cx="${x}" cy="-48.6" r=".45" fill="#e8c9a0"/>`;
  /* Kunstuhr: blau-goldenes Zifferblatt, darüber die Mondkugel */
  k += `<rect x="-6" y="-61.6" width="12" height="11" fill="#d2b896"/>`;
  k += `<circle cx="0" cy="-56" r="4.2" fill="${GOLD}"/><circle cx="0" cy="-56" r="3.5" fill="${S.rg("ziffer", [[0, "#4366b4"], [1, "#1c2f66"]])}"/>`;
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; k += `<line x1="${r(Math.sin(a) * 2.6)}" y1="${r(-56 - Math.cos(a) * 2.6)}" x2="${r(Math.sin(a) * 3.3)}" y2="${r(-56 - Math.cos(a) * 3.3)}" stroke="#f1c74a" stroke-width="${i % 3 ? 0.25 : 0.5}"/>`; }
  k += `<line x1="0" y1="-56" x2="${r(Math.sin(4.2) * 2)}" y2="${r(-56 - Math.cos(4.2) * 2)}" stroke="#f1c74a" stroke-width=".55" stroke-linecap="round"/><line x1="0" y1="-56" x2="${r(Math.sin(0.1) * 3)}" y2="${r(-56 - Math.cos(0.1) * 3)}" stroke="#f1c74a" stroke-width=".4" stroke-linecap="round"/><circle cx="0" cy="-56" r=".5" fill="#f1c74a"/>`;
  k += `<circle cx="0" cy="-62.8" r="1.2" fill="#1c2f66"/><path d="M0 -64 A1.2 1.2 0 0 1 0 -61.6 Z" fill="#f1c74a"/>`;
  /* das schlanke Maßwerktürmchen ganz oben */
  k += `<rect x="-2.6" y="-78" width="5.2" height="14" fill="${KIRCHE}"/>`;
  for (const y of [-76, -71, -66.6]) k += `<path d="M-1.6 ${y + 3.4} L-1.6 ${y + 1} Q-.8 ${y} 0 ${y + 1} Q.8 ${y} 1.6 ${y + 1} L1.6 ${y + 3.4} Z" fill="#3a3640"/>`;
  k += `<path d="M-3 -78 L0 -92 L3 -78 Z" fill="${KIRCHE}"/><path d="M0 -92 L3 -78 L.6 -78 Z" fill="#000" opacity=".1"/>`;
  for (let i = 1; i < 5; i++) k += `<path d="M${r(-3 + i * 0.6)} ${r(-78 - i * 2.8)} l-.8 -.4 M${r(3 - i * 0.6)} ${r(-78 - i * 2.8)} l.8 -.4" stroke="#c9ad88" stroke-width=".35"/>`;
  k += `<circle cx="0" cy="-92.6" r=".7" fill="${GOLD}"/><path d="M0 -93.4 L0 -95.6 M-.8 -94.6 L.8 -94.6" stroke="#e8b83a" stroke-width=".35"/>`;
  /* Licht von links, Schatten rechts */
  k += `<path d="M0 -82 L31 -30 L31 0 L11 0 L11 -27 L9 -31 L9 -44 L3 -64 Z" fill="#3a2a40" opacity=".09"/>`;
  S.teil({ id: "frauenkirche", de: "die Frauenkirche", syl: "FRAU-en-kir-che", it: "la Frauenkirche (chiesa di Nostra Signora)", itSyl: "FRAU-en-kir-che", en: "Church of Our Lady",
    x: FK.x, y: FK.y, kunst: gruppe("frauenkirche", FK.x, FK.y, k), tipp: "Die Frauenkirche steht am Hauptmarkt. Kaiser Karl IV. ließ sie im 14. Jahrhundert bauen.",
    zoom: { x: FK.x - 24, y: FK.y - 98, w: 48, h: 72 },
    unter: [
      { id: "uhr", de: "die Uhr", syl: "UHR", it: "l'orologio", itSyl: "o-ro-LO-gio", en: "clock", x: FK.x, y: FK.y - 51.6, kunst: flaeche(-4.6, -12.6, 9.2, 12.6),
        tipp: "Das Zifferblatt ist 2,5 Meter groß. Die Kugel darüber zeigt den Mond." },
      { id: "maennleinlaufen", de: "das Männleinlaufen", syl: "MÄNN-lein-lau-fen", it: "la sfilata delle statuine", itSyl: "sfi-LA-ta del-le sta-tu-I-ne", en: "Männleinlaufen (clock figures)",
        x: FK.x, y: FK.y - 44.6, kunst: flaeche(-7, -6.2, 14, 6.2), tipp: "Jeden Tag um zwölf Uhr ziehen sieben Kurfürsten um Kaiser Karl IV. herum." },
      { id: "christkind", de: "das Christkind", syl: "CHRIST-kind", it: "il Christkind (l'angelo di Natale)", itSyl: "CHRIST-kind", en: "Christkind (Christmas angel)",
        x: FK.x, y: FK.y - 31.4, kunst: flaeche(-2.4, -6, 4.8, 6), tipp: "Das Nürnberger Christkind eröffnet den Christkindlesmarkt – mit einem Gedicht von der Empore der Frauenkirche." },
      { id: "giebel", de: "der Giebel", syl: "GIE-bel", it: "il frontone", itSyl: "fron-TO-ne", en: "gable", x: FK.x - 22, y: FK.y - 34, kunst: flaeche(-6, -24, 12, 24),
        tipp: "Der Giebel steigt in Stufen an – ein Treppengiebel mit kleinen Türmchen (Fialen)." },
    ] });
}

/* =====================================================================
   7 — DER SCHÖNE BRUNNEN (Lupe: Ring, Gitter, Figur)
   ===================================================================== */
const SB = { x: 206, y: W - 2 };
{
  let k = schatten(0, 0.4, 13, 1.2, 0.3);
  const STEIN = S.lg("brunnenstein", [[0, "#f6e6c0"], [0.45, "#e4cc98"], [1, "#b49a6c"]], 0, 0, 1, 0);
  const KERN = S.lg("brunnenkern", [[0, "#8e7c62"], [0.5, "#6e604c"], [1, "#4e4436"]], 0, 0, 1, 0);
  /* achteckiges Becken mit Stufe */
  k += `<path d="M-11 0 L-11 -1.2 L11 -1.2 L11 0 Z" fill="#b8a688"/>`;
  k += `<path d="M-10 -1.2 L-10 -4 L-7 -5 L7 -5 L10 -4 L10 -1.2 Z" fill="${S.lg("becken", [[0, "#e2d0b0"], [1, "#a8916e"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M-10 -4 L-7 -5 L7 -5 L10 -4" stroke="#f4e8d0" stroke-width=".4" fill="none"/><path d="M-7 -5 L-7 -1.2 M7 -5 L7 -1.2" stroke="#9a8466" stroke-width=".25"/>`;
  /* durchbrochene Stufen: Kern, Pfeiler, Figuren, Wimperge und Fialen */
  const figur = (x, y, h, farbe) => `<path d="M${r(x - h * 0.2)} ${r(y)} L${r(x - h * 0.13)} ${r(y - h * 0.78)} L${r(x + h * 0.13)} ${r(y - h * 0.78)} L${r(x + h * 0.2)} ${r(y)} Z" fill="${farbe}"/><path d="M${r(x - h * 0.13)} ${r(y - h * 0.5)} L${r(x + h * 0.13)} ${r(y - h * 0.5)}" stroke="#f1c74a" stroke-width="${r(h * 0.06)}"/><circle cx="${r(x)}" cy="${r(y - h * 0.88)}" r="${r(h * 0.12)}" fill="#ecc8a0"/><path d="M${r(x - h * 0.13)} ${r(y - h * 0.96)} L${r(x - h * 0.1)} ${r(y - h * 1.08)} L${r(x)} ${r(y - h * 1.0)} L${r(x + h * 0.1)} ${r(y - h * 1.08)} L${r(x + h * 0.13)} ${r(y - h * 0.96)} Z" fill="${GOLD}"/>`;
  const FARBEN = ["#b8232a", "#2f5a9a", "#2f7a4a", "#7a3a8a", "#c8701a"];
  const etage = (y0, y1, hw, n, fh) => {
    let g = `<path d="M${r(-hw * 0.72)} ${y0} L${r(-hw * 0.62)} ${y1} L${r(hw * 0.62)} ${y1} L${r(hw * 0.72)} ${y0} Z" fill="${KERN}"/>`;
    g += `<path d="M${r(-hw * 0.4)} ${y0} L${r(-hw * 0.32)} ${y1} L${r(-hw * 0.1)} ${y1} L${r(-hw * 0.14)} ${y0} Z" fill="#c8b48a" opacity=".55"/>`;
    const d = 2 * hw / n;
    for (let i = 0; i <= n; i++) {
      const x = -hw + i * d, w = i === 0 || i === n ? 0.9 : 0.7;
      g += `<rect x="${r(x - w / 2)}" y="${r(y1)}" width="${w}" height="${r(y0 - y1)}" fill="${STEIN}"/>`;
      g += `<path d="M${r(x - 0.4)} ${r(y1)} L${r(x)} ${r(y1 - (y0 - y1) * 0.42)} L${r(x + 0.4)} ${r(y1)} Z" fill="${GOLD}"/>`;
    }
    for (let i = 0; i < n; i++) {
      const xa = -hw + i * d, xb = xa + d, xm = (xa + xb) / 2, ya = y1 + (y0 - y1) * 0.3;
      g += `<path d="M${r(xa + 0.3)} ${r(ya)} Q${r(xm)} ${r(y1 + 0.4)} ${r(xb - 0.3)} ${r(ya)}" stroke="${STEIN}" stroke-width=".55" fill="none"/>`;
      g += `<path d="M${r(xa + 0.2)} ${r(y1 + 0.6)} L${r(xm)} ${r(y1 - (y0 - y1) * 0.3)} L${r(xb - 0.2)} ${r(y1 + 0.6)}" stroke="${GOLD}" stroke-width=".4" fill="none"/>`;
      g += figur(xm, r(y0 - (y0 - y1) * 0.16), fh, FARBEN[(i + Math.round(-y0)) % FARBEN.length]);
      g += `<rect x="${r(xm - fh * 0.24)}" y="${r(y0 - (y0 - y1) * 0.16)}" width="${r(fh * 0.48)}" height=".5" fill="${GOLD}"/>`;
    }
    g += `<rect x="${r(-hw - 0.6)}" y="${r(y0 - 0.9)}" width="${r(2 * hw + 1.2)}" height=".9" fill="${STEIN}"/>`;
    return g;
  };
  k += etage(-5, -24, 7.6, 4, 7.6) + etage(-24.4, -37.4, 5.2, 3, 5.6) + etage(-37.8, -46.4, 3.2, 2, 3.8);
  /* Turmspitze mit Krabben, Kreuzblume */
  k += `<path d="M-2.4 -46.6 L0 -57 L2.4 -46.6 Z" fill="${STEIN}"/><path d="M0 -46.6 L0 -57 L2.4 -46.6 Z" fill="#000" opacity=".12"/><path d="M-1 -48 L0 -54 L1 -48 Z" fill="${KERN}" opacity=".8"/>`;
  for (let i = 1; i < 5; i++) k += `<path d="M${r(-2.4 + i * 0.48)} ${r(-46.6 - i * 2.1)} l-.8 -.3 M${r(2.4 - i * 0.48)} ${r(-46.6 - i * 2.1)} l.8 -.3" stroke="#e8b83a" stroke-width=".45"/>`;
  k += `<circle cx="0" cy="-57.4" r=".9" fill="${GOLD}"/><path d="M0 -58 L0 -60.4 M-.7 -59.6 L.7 -59.6" stroke="#e8b83a" stroke-width=".35"/>`;
  /* das Renaissance-GITTER (achteckig) mit dem goldenen RING */
  let gi = "";
  for (const [xa, xb, ya, yb] of [[-13, -9.6, -1, -1.8], [9.6, 13, -1.8, -1], [-9.6, 9.6, -0.2, -0.2]]) {
    const n = Math.round((xb - xa) / 0.75);
    for (let i = 0; i <= n; i++) { const x = xa + (xb - xa) * i / n, y = ya + (yb - ya) * i / n; gi += `<line x1="${r(x)}" y1="${r(y)}" x2="${r(x)}" y2="${r(y - 6.6)}" stroke="${EISEN}" stroke-width=".18"/>`; }
    gi += `<path d="M${xa} ${r(ya - 6.6)} L${xb} ${r(yb - 6.6)} M${xa} ${r(ya - 1.2)} L${xb} ${r(yb - 1.2)}" stroke="${EISEN}" stroke-width=".45"/>`;
  }
  for (let x = -11.6; x <= 11.6; x += 1.6) { const y = Math.abs(x) > 9.6 ? -1 - (Math.abs(x) - 9.6) * -0.2 - 0.8 : -0.2; gi += `<path d="M${r(x)} ${r(y - 6.6)} q-.55 -.9 0 -1.7 q.55 .8 0 1.7" fill="${GOLD}"/>`; }
  for (let x = -8.8; x <= 8.8; x += 2.2) gi += `<path d="M${r(x - 0.8)} -4.2 q.8 -1.4 1.6 0 q-.8 1.4 -1.6 0" fill="none" stroke="${GOLD}" stroke-width=".22"/>`;
  gi += `<circle cx="-3.4" cy="-3.4" r="1.15" fill="none" stroke="#f6d35a" stroke-width=".6"/><path d="M-4.3 -4.1 A1.1 1.1 0 0 1 -2.7 -4.3" stroke="#fff6c8" stroke-width=".25" fill="none"/>`;
  k += gi;
  S.teil({ id: "brunnen", de: "der Schöne Brunnen", syl: "SCHÖ-ne BRUN-nen", it: "la Bella Fontana", itSyl: "BEL-la fon-TA-na", en: "Beautiful Fountain",
    x: SB.x, y: SB.y, kunst: gruppe("brunnen", SB.x, SB.y, k), tipp: "Der Schöne Brunnen ist 19 Meter hoch und sieht aus wie eine gotische Kirchturmspitze.",
    zoom: { x: SB.x - 21, y: SB.y - 63, w: 42, h: 65 },
    unter: [
      { id: "ring", de: "der Ring", syl: "RING", it: "l'anello", itSyl: "a-NEL-lo", en: "ring", x: SB.x - 3.4, y: SB.y - 1.8, kunst: flaeche(-1.9, -3.6, 3.8, 3.8, 0.8),
        tipp: "Wer den goldenen Ring im Gitter dreht, hat einen Wunsch frei – sagt man in Nürnberg." },
      { id: "gitter", de: "das Gitter", syl: "GIT-ter", it: "la cancellata", itSyl: "can-cel-LA-ta", en: "railing", x: SB.x + 7, y: SB.y, kunst: flaeche(-6, -8.8, 12, 8.8) },
      { id: "figur", de: "die Figur", syl: "fi-GUR", it: "la statua", itSyl: "STA-tu-a", en: "statue", x: SB.x, y: SB.y - 24.4, kunst: flaeche(-5.4, -13, 10.8, 13),
        tipp: "Am Brunnen stehen 40 bunte Figuren: Kurfürsten, Helden und Propheten." },
    ] });
}

/* =====================================================================
   8 — DER CHRISTKINDLESMARKT: Buden mit rot-weiß gestreiften Dächern
   ===================================================================== */
S.def(`<pattern id="${S.id("streifen")}" patternUnits="userSpaceOnUse" width="1.6" height="4"><rect width=".8" height="4" fill="#c8232c"/><rect x=".8" width=".8" height="4" fill="#f6efe2"/></pattern>`);
S.def(`<pattern id="${S.id("streifen2")}" patternUnits="userSpaceOnUse" width="5" height="20"><rect width="2.5" height="20" fill="#c41f2a"/><rect x="2.5" width="2.5" height="20" fill="#f7f1e6"/></pattern>`);
{
  let k = "";
  const bude = (x, w) => {
    let g = `<rect x="${r(x)}" y="${W - 8.4}" width="${r(w)}" height="6.6" fill="#7a4e2c"/>`;
    g += `<rect x="${r(x + 0.8)}" y="${W - 7.4}" width="${r(w - 1.6)}" height="3.4" fill="${S.lg("budenlicht", [[0, "#ffd88a"], [1, "#e8a050"]])}"/>`;
    for (let i = 0; i < Math.floor(w / 1.6); i++) g += `<circle cx="${r(x + 1.4 + i * 1.6)}" cy="${r(W - 5 + (i % 2) * 0.4)}" r=".45" fill="${["#b8232a", "#8a5a2a", "#e8c040", "#2f5a9a"][i % 4]}"/>`;
    g += `<rect x="${r(x - 0.2)}" y="${W - 4}" width="${r(w + 0.4)}" height=".7" fill="#5a3a20"/>`;
    g += `<path d="M${r(x - 0.8)} ${W - 8.2} L${r(x + 1)} ${W - 11.6} L${r(x + w - 1)} ${W - 11.6} L${r(x + w + 0.8)} ${W - 8.2} Z" fill="url(#${S.id("streifen")})"/>`;
    g += `<path d="M${r(x - 0.8)} ${W - 8.2} L${r(x + w + 0.8)} ${W - 8.2}" stroke="#a81a24" stroke-width=".4"/>`;
    for (let i = 0; i < Math.floor(w / 1.2); i++) g += `<circle cx="${r(x + 0.6 + i * 1.2)}" cy="${W - 7.9}" r=".28" fill="#fff3c0"/>`;
    return g;
  };
  for (const [x, w] of [[112, 10], [123, 9], [133, 11], [145, 10], [156, 9], [166, 10], [177, 9], [219, 10], [230, 10], [281, 10], [292, 9], [302, 10], [313, 7]]) k += bude(x, w);
  k += `<rect x="108" y="${W - 1.8}" width="212" height="1.8" fill="#b8a48c"/>`;
  S.teil({ id: "christkindlesmarkt", de: "der Christkindlesmarkt", syl: "CHRIST-kind-les-markt", it: "il mercatino di Natale", itSyl: "mer-ca-TI-no di na-TA-le", en: "Christmas market",
    x: 0, y: 0, kunst: gruppe("markt", 0, 0, k), tipp: "Der Christkindlesmarkt hat rund 160 Holzbuden mit rot-weiß gestreiften Dächern." });
}

/* =====================================================================
   9 — DIE PEGNITZ mit Spiegelungen (Spiegelbild als Muster, damit die
       Fläche des Teils genau das Wasser bleibt)
   ===================================================================== */
{
  let sp = "";
  for (const s of spiegel) sp += `<use href="#${S.id("sp_" + s.id)}" transform="translate(${r(s.x)} ${r(2 * W - s.y)}) scale(1 -1)"/>`;
  S.def(`<pattern id="${S.id("spiegelbild")}" patternUnits="userSpaceOnUse" x="0" y="${W}" width="320" height="${WU - W}"><g transform="translate(0 ${-W})"><rect x="0" y="${W}" width="320" height="${WU - W}" fill="${S.lg("wasser", [[0, "#6f9090"], [0.45, "#4e7276"], [1, "#2e4c54"]])}"/><g opacity=".7" filter="url(#${S.id("spiegel")})">${sp}</g></g></pattern>`);
  let k = `<rect x="0" y="${W}" width="320" height="${WU - W}" fill="url(#${S.id("spiegelbild")})"/>`;
  k += `<rect x="0" y="${W}" width="320" height="${WU - W}" fill="${S.lg("wasserschleier", [[0, "#7a9898", 0.12], [0.5, "#5a7a7c", 0.26], [1, "#34525a", 0.5]])}"/>`;
  for (let i = 0; i < 150; i++) {
    const y = W + 1 + Math.pow(rnd(), 0.8) * (WU - W - 2), w = 1.4 + (y - W) * 0.25 * rnd() + 1;
    k += `<path d="M${r(rnd() * (318 - w))} ${r(y)} q${r(w / 2)} -.4 ${r(w)} 0" stroke="${rnd() < 0.6 ? "#e8f0ee" : "#2e4648"}" stroke-width="${r(0.15 + (y - W) * 0.012)}" fill="none" opacity="${r(0.22 + rnd() * 0.36)}"/>`;
  }
  /* Lichter der Buden glitzern im Wasser */
  for (let i = 0; i < 30; i++) { const x = 112 + rnd() * 204; if (x > 188 && x < 218) continue; k += `<rect x="${r(x)}" y="${r(W + 2 + rnd() * 10)}" width="${r(0.8 + rnd() * 1.6)}" height=".35" fill="#ffd98a" opacity="${r(0.5 + rnd() * 0.4)}"/>`; }
  S.teil({ id: "pegnitz", de: "die Pegnitz", syl: "PEG-nitz", it: "la Pegnitz (il fiume)", itSyl: "PEG-nitz", en: "the Pegnitz (river)", x: 0, y: 0, kunst: k,
    tipp: "Die Pegnitz fließt mitten durch die Altstadt von Nürnberg." });
}

/* =====================================================================
   10 — DER SCHWAN auf der Pegnitz
   ===================================================================== */
{
  const Y = 151, s = km(Y) / 10;
  let k = `<ellipse cx="0" cy=".4" rx="${r(8 * s)}" ry="${r(1 * s)}" fill="#2e4648" opacity=".3"/>`;
  k += `<path d="M${r(-6 * s)} 0 Q${r(-7 * s)} ${r(-3.4 * s)} ${r(-3 * s)} ${r(-3.6 * s)} Q${r(1 * s)} ${r(-4 * s)} ${r(3 * s)} ${r(-2.4 * s)} L${r(4.6 * s)} ${r(-1.2 * s)} Q${r(3 * s)} ${r(0.6 * s)} 0 ${r(0.4 * s)} Z" fill="${S.lg("schwan", [[0, "#ffffff"], [1, "#d8dedd"]])}"/>`;
  k += `<path d="M${r(-5 * s)} ${r(-2.4 * s)} Q${r(-2 * s)} ${r(-4.4 * s)} ${r(1.4 * s)} ${r(-3 * s)}" stroke="#c4cccb" stroke-width="${r(0.3 * s)}" fill="none"/>`;
  k += `<path d="M${r(2.4 * s)} ${r(-2.6 * s)} Q${r(4.6 * s)} ${r(-6 * s)} ${r(3.4 * s)} ${r(-8.6 * s)} Q${r(3 * s)} ${r(-10 * s)} ${r(4.4 * s)} ${r(-10.2 * s)}" stroke="#f6f7f6" stroke-width="${r(1.2 * s)}" fill="none" stroke-linecap="round"/>`;
  k += `<path d="M${r(4.4 * s)} ${r(-10.6 * s)} L${r(6.2 * s)} ${r(-9.8 * s)} L${r(4.6 * s)} ${r(-9.4 * s)} Z" fill="#e8762a"/><circle cx="${r(4.2 * s)}" cy="${r(-10.2 * s)}" r="${r(0.3 * s)}" fill="#1a1a1a"/>`;
  k += `<path d="M${r(-8 * s)} ${r(0.8 * s)} q${r(8 * s)} ${r(1 * s)} ${r(16 * s)} 0" stroke="#e8f0ee" stroke-width=".3" fill="none" opacity=".7"/>`;
  S.teil({ oben: true, id: "schwan", de: "der Schwan", syl: "SCHWAN", it: "il cigno", itSyl: "CI-gno", en: "swan", x: 150, y: Y, kunst: k });
}

/* =====================================================================
   11 — DAS GELÄNDER an der Kaikante
   ===================================================================== */
{
  const Y = WU + 1, H = 0.95 * km(Y);
  let k = `<rect x="0" y="${r(-H)}" width="320" height=".7" rx=".3" fill="${EISEN}"/><rect x="0" y="${r(-H * 0.16)}" width="320" height=".4" fill="${EISEN}"/>`;
  for (let x = 1.2; x < 320; x += 2.4) k += `<line x1="${r(x)}" y1="${r(-H)}" x2="${r(x)}" y2="0" stroke="${EISEN}" stroke-width=".16" opacity=".75"/>`;
  for (let x = 1.2; x < 320; x += 4.8) k += `<circle cx="${r(x + 1.2)}" cy="${r(-H * 0.62)}" r=".7" fill="none" stroke="${EISEN}" stroke-width=".14" opacity=".7"/>`;
  for (let x = 8; x < 320; x += 24) k += `<rect x="${x - 0.55}" y="${r(-H - 0.6)}" width="1.1" height="${r(H + 0.6)}" fill="#3a3632"/><circle cx="${x}" cy="${r(-H - 0.9)}" r=".75" fill="#3a3632"/>`;
  k += `<rect x="0" y="${r(-H)}" width="320" height=".25" fill="#ffe8c8" opacity=".4"/>`;
  S.teil({ id: "gelaender", de: "das Geländer", syl: "ge-LÄN-der", it: "la ringhiera", itSyl: "rin-GHIE-ra", en: "railing", x: 0, y: Y, kunst: k });
}

/* =====================================================================
   12 — DER WEIHNACHTSBAUM auf der Promenade: Lichter, rote Kugeln und
        Strohsterne (typischer Nürnberger Baumschmuck)
   ===================================================================== */
{
  const Y = 183, s = km(Y);          /* ≈ 17,7 Einheiten je Meter */
  const H = 2.5 * s, kb = 0.5 * s;
  let k = schatten(0, 0.6, 0.75 * s, 1.6, 0.4);
  /* Pflanzkübel aus Holz */
  k += `<path d="M${r(-0.42 * s)} 0 L${r(0.42 * s)} 0 L${r(0.48 * s)} ${r(-kb)} L${r(-0.48 * s)} ${r(-kb)} Z" fill="${S.lg("kuebel", [[0, "#9a6a3e"], [0.5, "#b8834c"], [1, "#7a4e2a"]], 0, 0, 1, 0)}"/>`;
  for (const t of [0.3, 0.7]) k += `<rect x="${r(-0.46 * s)}" y="${r(-kb * t - 0.4)}" width="${r(0.92 * s)}" height=".8" fill="#5a3a1e" opacity=".7"/>`;
  k += `<rect x="-1.2" y="${r(-kb - 3)}" width="2.4" height="3" fill="#5a3a22"/>`;
  /* Tannenzweige in Etagen, unten breit */
  const etagen = 6;
  for (let i = 0; i < etagen; i++) {
    const yu = -kb - 2 - i * (H - 6) / etagen, yo = yu - (H - 6) / etagen * 1.7, b = (0.62 - i * 0.09) * s;
    let pfad = `M${r(-b)} ${r(yu)}`;
    for (let j = 0; j < 6; j++) pfad += ` q${r(b / 6)} ${r(2.2 - (j % 2) * 1.2)} ${r(b / 3)} 0`;
    pfad += ` L0 ${r(yo)} Z`;
    k += `<path d="${pfad}" fill="${S.lg("tanne" + i, [[0, "#3e7448"], [0.5, "#2a5a36"], [1, "#183c24"]], 0, 0, 1, 0)}"/>`;
    k += `<path d="M${r(-b * 0.9)} ${r(yu - 0.4)} L0 ${r(yo + 1)}" stroke="#6aa070" stroke-width=".35" opacity=".5"/>`;
  }
  /* Lichter, Kugeln und Strohsterne */
  for (let i = 0; i < 34; i++) {
    const t = rnd(), y = -kb - 3 - t * (H - 9), b = (0.58 - t * 0.5) * s, x = (rnd() * 2 - 1) * b * 0.85;
    const art = rnd();
    if (art < 0.45) k += `<circle cx="${r(x)}" cy="${r(y)}" r=".45" fill="#fff4c4"/><circle cx="${r(x)}" cy="${r(y)}" r="1.5" fill="#ffe08a" opacity=".3"/>`;
    else if (art < 0.75) k += `<circle cx="${r(x)}" cy="${r(y)}" r=".95" fill="${S.rg("kugel", [[0, "#ff8a7a"], [0.5, "#c8232c"], [1, "#7a0e16"]], 0.35, 0.3, 0.7)}"/>`;
    else k += `<path d="M${r(x)} ${r(y - 1.4)} L${r(x + 0.35)} ${r(y - 0.35)} L${r(x + 1.4)} ${r(y)} L${r(x + 0.35)} ${r(y + 0.35)} L${r(x)} ${r(y + 1.4)} L${r(x - 0.35)} ${r(y + 0.35)} L${r(x - 1.4)} ${r(y)} L${r(x - 0.35)} ${r(y - 0.35)} Z" fill="#f2dc9a" stroke="#c8a24a" stroke-width=".12"/>`;
  }
  /* goldener Stern an der Spitze */
  const ty = -kb - H + 3;
  let st = "";
  for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5 - Math.PI / 2, rr = i % 2 ? 1.1 : 2.6; st += `${i ? "L" : "M"}${r(Math.cos(a) * rr)} ${r(ty + Math.sin(a) * rr)} `; }
  k += `<path d="${st}Z" fill="${GOLD}"/><circle cx="0" cy="${r(ty)}" r="4" fill="#ffe8a0" opacity=".25"/>`;
  S.teil({ id: "weihnachtsbaum", de: "der Weihnachtsbaum", syl: "WEIH-nachts-baum", it: "l'albero di Natale", itSyl: "AL-be-ro di na-TA-le", en: "Christmas tree",
    x: 36, y: Y, steht: true, kunst: k, tipp: "Am Baum hängen Lichter, rote Kugeln und Strohsterne." });
}

/* =====================================================================
   13 — DIE BUDE vorne (Lupe: Lebkuchen, Zwetschgenmännchen,
        Rauschgoldengel, Bratwurst, Grill) und 14 — DIE VERKÄUFERIN
   ===================================================================== */
const BU = { x: 266, y: 193 };
const BS = km(BU.y);                 /* ≈ 20 Einheiten je Meter */
const THEKE = BU.y - 1.0 * BS;       /* Thekenhöhe 1 m */
{
  const Wd = 3.2 * BS, H = 2.4 * BS, ty = THEKE - BU.y;
  const HOLZ = S.lg("budenholz", [[0, "#8c5a32"], [0.5, "#a8703f"], [1, "#7a4a28"]], 0, 0, 1, 0);
  let k = schatten(0, 0.6, Wd / 2 + 4, 2.2, 0.4);
  /* Rückwand, warm beleuchtet, mit Regalen */
  k += `<rect x="${r(-Wd / 2)}" y="${r(-H)}" width="${r(Wd)}" height="${r(H)}" fill="${S.lg("budeinnen", [[0, "#6a4226"], [1, "#8a5a32"]])}"/>`;
  k += `<rect x="${r(-Wd / 2)}" y="${r(-H)}" width="${r(Wd)}" height="${r(H)}" fill="${S.rg("budelicht", [[0, "#ffd88a", 0.45], [1, "#ffd88a", 0]], 0.5, 0.2, 0.7)}"/>`;
  for (let x = -Wd / 2 + 4; x < Wd / 2; x += 4) k += `<line x1="${r(x)}" y1="${r(-H)}" x2="${r(x)}" y2="${r(ty)}" stroke="#5a3820" stroke-width=".25" opacity=".5"/>`;
  for (const y of [-H + 13, -H + 22]) k += `<rect x="${r(-Wd / 2 + 3)}" y="${r(y)}" width="${r(Wd - 26)}" height="1" fill="#c79a62"/>`;
  /* Lebkuchendosen und Lebkuchenstapel im Regal */
  const dosen = ["#b8232a", "#1f4f8f", "#e8b83a", "#2f6a3a", "#b8232a", "#7a2a6a"];
  for (let i = 0; i < 6; i++) { const x = -Wd / 2 + 5 + i * 5.6; k += `<rect x="${r(x)}" y="${r(-H + 7.6)}" width="4.6" height="5.4" rx=".6" fill="${dosen[i]}"/><rect x="${r(x)}" y="${r(-H + 8.6)}" width="4.6" height=".7" fill="#f1d27a"/><ellipse cx="${r(x + 2.3)}" cy="${r(-H + 10.8)}" rx="1.4" ry="1.2" fill="#f4ead8" opacity=".85"/><rect x="${r(x + 0.4)}" y="${r(-H + 7.8)}" width=".8" height="5" fill="#fff" opacity=".2"/>`; }
  for (let i = 0; i < 5; i++) { const x = -Wd / 2 + 6 + i * 6.4; k += `<ellipse cx="${r(x + 2)}" cy="${r(-H + 20.6)}" rx="2.8" ry="1.2" fill="#8a4e22"/><ellipse cx="${r(x + 2)}" cy="${r(-H + 19.6)}" rx="2.8" ry="1.2" fill="#9a5a2a"/><ellipse cx="${r(x + 2)}" cy="${r(-H + 18.6)}" rx="2.8" ry="1.2" fill="#a8662e"/>`; }
  /* Pfosten */
  for (const sx of [-1, 1]) k += `<rect x="${r(sx * Wd / 2 - 1.6)}" y="${r(-H - 2)}" width="3.2" height="${r(H + 2)}" fill="${HOLZ}"/>`;
  /* Rauschgoldengel unter dem Dach */
  const engel = (x, y) => {
    let g = `<line x1="${x}" y1="${r(y - 4.6)}" x2="${x}" y2="${r(y - 3.6)}" stroke="#d8b46a" stroke-width=".25"/>`;
    g += `<path d="M${x - 2.6} ${y + 4.6} L${x - 0.8} ${y - 1.4} L${x + 0.8} ${y - 1.4} L${x + 2.6} ${y + 4.6} Z" fill="${GOLD}"/>`;
    for (let i = -2; i <= 2; i++) g += `<line x1="${r(x + i * 0.3)}" y1="${r(y - 1.2)}" x2="${r(x + i * 1.1)}" y2="${r(y + 4.4)}" stroke="#a8770f" stroke-width=".18"/>`;
    g += `<path d="M${x - 0.6} ${y - 0.8} Q${x - 4} ${y - 4} ${x - 3.4} ${y + 1.4} Z M${x + 0.6} ${y - 0.8} Q${x + 4} ${y - 4} ${x + 3.4} ${y + 1.4} Z" fill="#ffe8a0" stroke="#d8a830" stroke-width=".2"/>`;
    g += `<circle cx="${x}" cy="${y - 2.2}" r="1" fill="#f6dcc4"/><path d="M${x - 1.1} ${y - 3} L${x - 1} ${y - 4} L${x - 0.4} ${y - 3.4} L${x} ${y - 4.2} L${x + 0.4} ${y - 3.4} L${x + 1} ${y - 4} L${x + 1.1} ${y - 3} Z" fill="${GOLD}"/>`;
    return g;
  };
  k += engel(-16, -H + 6.4) + engel(20, -H + 6.4);
  /* Dach: rot-weiß gestreifter Stoff mit gewellter Kante, Lichterkette */
  k += `<path d="M${r(-Wd / 2 - 5)} ${r(-H + 0.6)} L${r(-Wd / 2 + 1)} ${r(-H - 12)} L${r(Wd / 2 - 1)} ${r(-H - 12)} L${r(Wd / 2 + 5)} ${r(-H + 0.6)} Z" fill="url(#${S.id("streifen2")})"/>`;
  k += `<path d="M${r(-Wd / 2 - 5)} ${r(-H + 0.6)} L${r(-Wd / 2 + 1)} ${r(-H - 12)} L${r(Wd / 2 - 1)} ${r(-H - 12)} L${r(Wd / 2 + 5)} ${r(-H + 0.6)} Z" fill="${S.lg("dachlicht", [[0, "#fff", 0.14], [0.6, "#000", 0], [1, "#000", 0.2]], 0, 0, 1, 0)}"/>`;
  let saum = `M${r(-Wd / 2 - 5)} ${r(-H + 0.6)}`;
  for (let x = -Wd / 2 - 5; x < Wd / 2 + 5; x += 5) saum += ` q2.5 3.2 5 0`;
  k += `<path d="${saum} L${r(Wd / 2 + 5)} ${r(-H - 1)} L${r(-Wd / 2 - 5)} ${r(-H - 1)} Z" fill="url(#${S.id("streifen2")})"/>`;
  for (let i = 0; i < 18; i++) { const x = -Wd / 2 - 3 + i * (Wd + 6) / 17; k += `<circle cx="${r(x)}" cy="${r(-H + 2.6 + (i % 2) * 0.6)}" r=".7" fill="#fff3c0"/><circle cx="${r(x)}" cy="${r(-H + 2.6 + (i % 2) * 0.6)}" r="1.8" fill="#ffe28a" opacity=".3"/>`; }
  /* Schild */
  k += `<rect x="${r(-Wd / 2 + 8)}" y="${r(-H - 10.6)}" width="${r(Wd - 16)}" height="7" rx="1" fill="#f6ecd6" stroke="#7a2a22" stroke-width=".5"/>`;
  k += `<text x="0" y="${r(-H - 5.6)}" font-size="4.4" text-anchor="middle" fill="#7a2a22" font-family="Georgia,'Times New Roman',serif" font-weight="bold" font-style="italic">Nürnberger Lebkuchen</text>`;
  /* Theke mit Tannengirlande */
  k += `<rect x="${r(-Wd / 2 - 1)}" y="${r(ty - 1.2)}" width="${r(Wd + 2)}" height="2.2" rx=".5" fill="#c79a62"/>`;
  k += `<rect x="${r(-Wd / 2)}" y="${r(ty + 1)}" width="${r(Wd)}" height="${r(-ty - 1)}" fill="${HOLZ}"/>`;
  for (let x = -Wd / 2 + 2.6; x < Wd / 2; x += 2.6) k += `<line x1="${r(x)}" y1="${r(ty + 1)}" x2="${r(x)}" y2="0" stroke="#6e4622" stroke-width=".3"/>`;
  let gir = "";
  for (let i = 0; i < 40; i++) { const t = i / 39, x = -Wd / 2 + t * Wd, y = ty + 2.4 + Math.sin(t * Math.PI * 4) ** 2 * 3; gir += `<circle cx="${r(x)}" cy="${r(y)}" r="${r(1.3 + rnd() * 0.6)}" fill="${rnd() < 0.5 ? "#2f5a32" : "#3e6e3a"}"/>`; }
  for (let i = 0; i < 4; i++) { const x = -Wd / 2 + 4 + i * (Wd - 8) / 3; gir += `<path d="M${r(x - 1.6)} ${r(ty + 2.4)} l1.6 1.2 l1.6 -1.2 l-.6 2.4 l-1 -1.2 l-1 1.2 Z" fill="#c8232c"/>`; }
  k += gir;
  k += `<rect x="${r(-Wd / 2 + 10)}" y="${r(ty + 7)}" width="${r(Wd - 20)}" height="6.6" rx=".6" fill="#f6ecd6" opacity=".95"/>`;
  k += `<text x="0" y="${r(ty + 11.8)}" font-size="3.4" text-anchor="middle" fill="#2f5a32" font-family="Georgia,serif" font-weight="bold">Lebkuchen · Drei im Weggla</text>`;
  /* GRILL links in der Theke: Buchenholzglut und Rost mit Bratwürsten */
  const gx0 = -Wd / 2 + 2.6, gx1 = gx0 + 15;
  k += `<rect x="${r(gx0)}" y="${r(ty - 2.6)}" width="15" height="2.6" fill="#2a2724"/>`;
  k += `<rect x="${r(gx0 + 0.8)}" y="${r(ty - 2)}" width="13.4" height="1.4" fill="${S.lg("glut", [[0, "#ffb347"], [1, "#d9531e"]])}"/>`;
  for (let x = gx0 + 1; x < gx1 - 0.5; x += 1) k += `<line x1="${r(x)}" y1="${r(ty - 2.8)}" x2="${r(x)}" y2="${r(ty - 2.2)}" stroke="#555" stroke-width=".2"/>`;
  for (let i = 0; i < 8; i++) { const x = gx0 + 2 + (i % 4) * 3.2, y = ty - 3.4 - Math.floor(i / 4) * 1.6; k += `<rect x="${r(x - 1.3)}" y="${r(y - 0.55)}" width="2.6" height="1.1" rx=".55" fill="${S.lg("wurst", [[0, "#c47a3a"], [1, "#7a3e18"]])}"/><line x1="${r(x - 0.8)}" y1="${r(y - 0.2)}" x2="${r(x + 0.8)}" y2="${r(y - 0.2)}" stroke="#3a1a08" stroke-width=".15"/>`; }
  k += `<path d="M${r(gx0 + 4)} ${r(ty - 5)} q-2 -4 1 -7 q3 -3 0 -7" stroke="#fff" stroke-width="1.6" opacity=".32" fill="none" stroke-linecap="round"/><path d="M${r(gx0 + 10)} ${r(ty - 5)} q2 -3 -1 -6" stroke="#fff" stroke-width="1.2" opacity=".28" fill="none" stroke-linecap="round"/>`;
  /* Drei im Weggla auf dem Teller */
  const wx = gx1 + 5;
  k += `<ellipse cx="${r(wx)}" cy="${r(ty - 0.6)}" rx="4" ry=".8" fill="#f4f1ea"/>`;
  k += `<path d="M${r(wx - 3.4)} ${r(ty - 1)} Q${r(wx - 3.6)} ${r(ty - 3.4)} ${r(wx)} ${r(ty - 3.6)} Q${r(wx + 3.6)} ${r(ty - 3.4)} ${r(wx + 3.4)} ${r(ty - 1)} Z" fill="#e2b46c"/>`;
  for (let i = 0; i < 3; i++) k += `<rect x="${r(wx - 3.8)}" y="${r(ty - 2.6 - i * 0.7)}" width="${r(7.6 - i * 0.6)}" height=".8" rx=".4" fill="#9a4e22"/>`;
  k += `<path d="M${r(wx - 3.2)} ${r(ty - 3.5)} Q${r(wx)} ${r(ty - 5.8)} ${r(wx + 3.2)} ${r(ty - 3.5)} Z" fill="#eec07a"/><path d="M${r(wx - 2)} ${r(ty - 4.4)} q2 -1 4 0" stroke="#fff" stroke-width=".3" opacity=".5" fill="none"/>`;
  /* LEBKUCHEN auf der Theke: Elisenlebkuchen mit Mandeln, auf Oblaten */
  const lx = wx + 9;
  k += `<path d="M${r(lx - 5)} ${r(ty - 0.4)} L${r(lx + 5)} ${r(ty - 0.4)} L${r(lx + 4.4)} ${r(ty - 1.4)} L${r(lx - 4.4)} ${r(ty - 1.4)} Z" fill="#c9a06a"/>`;
  for (const [dx, dy] of [[-2.6, 0], [2.6, 0], [0, -1.2]]) {
    k += `<ellipse cx="${r(lx + dx)}" cy="${r(ty - 2.4 + dy)}" rx="2.6" ry="1.1" fill="#f2ead8"/><ellipse cx="${r(lx + dx)}" cy="${r(ty - 2.8 + dy)}" rx="2.4" ry="1" fill="${S.rg("lebk", [[0, "#9a5a2a"], [1, "#5e3214"]])}"/>`;
    for (let a = 0; a < 3; a++) k += `<ellipse cx="${r(lx + dx - 1 + a)}" cy="${r(ty - 2.9 + dy)}" rx=".42" ry=".22" fill="#f0dcb4"/>`;
  }
  /* ZWETSCHGENMÄNNCHEN: Körper aus Dörrpflaumen, Kopf aus Walnuss, Hut und Schal */
  const zm = (x, hut, schal) => {
    const y = ty - 0.6;
    let g = `<ellipse cx="${x}" cy="${r(y + 0.1)}" rx="1.8" ry=".45" fill="#3a2a1a" opacity=".4"/>`;
    g += `<line x1="${x - 0.7}" y1="${y}" x2="${x - 0.5}" y2="${r(y - 2)}" stroke="#2a1a14" stroke-width=".55"/><line x1="${x + 0.7}" y1="${y}" x2="${x + 0.5}" y2="${r(y - 2)}" stroke="#2a1a14" stroke-width=".55"/>`;
    for (const [dy, rx] of [[-2.6, 1.3], [-4.2, 1.4], [-5.8, 1.2]]) g += `<ellipse cx="${x}" cy="${r(y + dy)}" rx="${rx}" ry=".95" fill="${S.rg("zwetschge", [[0, "#5a2a4a"], [1, "#2a0e22"]], 0.4, 0.35, 0.7)}"/>`;
    g += `<path d="M${x - 1.2} ${r(y - 5)} q-1.2 1.2 -1 2.6 M${x + 1.2} ${r(y - 5)} q1.2 1.2 1 2.6" stroke="#2a1a14" stroke-width=".5" fill="none"/>`;
    g += `<rect x="${x - 1.3}" y="${r(y - 6.8)}" width="2.6" height=".8" rx=".3" fill="${schal}"/>`;
    g += `<circle cx="${x}" cy="${r(y - 8)}" r="1.15" fill="${S.rg("walnuss", [[0, "#c8965a"], [1, "#8a5a2a"]], 0.4, 0.35, 0.7)}"/><path d="M${x - 0.6} ${r(y - 8.6)} q.6 .5 1.2 0 M${x - 0.7} ${r(y - 7.6)} q.7 .4 1.4 0" stroke="#6a3e1a" stroke-width=".18" fill="none"/>`;
    g += `<path d="M${x - 1.6} ${r(y - 8.8)} L${x + 1.6} ${r(y - 8.8)} L${x + 0.9} ${r(y - 9.3)} L${x + 0.7} ${r(y - 10.8)} L${x - 0.7} ${r(y - 10.8)} L${x - 0.9} ${r(y - 9.3)} Z" fill="${hut}"/>`;
    return g;
  };
  const zx = lx + 8.2;
  k += zm(zx, "#2a2a2a", "#c8232c") + zm(zx + 4.4, "#2f5a32", "#e8c040");
  S.teil({ id: "bude", de: "die Bude", syl: "BU-de", it: "la bancarella", itSyl: "ban-ca-REL-la", en: "market stall", x: BU.x, y: BU.y, steht: true, kunst: k,
    tipp: "An der Bude gibt es Nürnberger Lebkuchen und Rostbratwürste.",
    zoom: { x: BU.x - 37, y: BU.y - H - 14, w: 74, h: 50 },
    unter: [
      { id: "lebkuchen", de: "der Lebkuchen", syl: "LEB-ku-chen", it: "il pan di zenzero", itSyl: "pan di ZEN-ze-ro", en: "gingerbread",
        x: BU.x + lx, y: THEKE - 0.4, kunst: flaeche(-5.4, -5, 10.8, 5.4), tipp: "Nürnberger Elisenlebkuchen: mit Nüssen, Honig und Gewürzen, auf einer dünnen Oblate." },
      { id: "zwetschgenmaennchen", de: "das Zwetschgenmännchen", syl: "ZWETSCH-gen-männ-chen", it: "l'omino di prugne", itSyl: "o-MI-no di PRU-gne", en: "prune man",
        x: BU.x + zx + 2.2, y: THEKE - 0.4, kunst: flaeche(-4.4, -11.4, 8.8, 11.6), tipp: "Ein Männchen aus getrockneten Zwetschgen und Nüssen – auf Fränkisch „Zwetschgermännla“." },
      { id: "rauschgoldengel", de: "der Rauschgoldengel", syl: "RAUSCH-gold-en-gel", it: "l'angelo d'oro", itSyl: "AN-ge-lo D'O-ro", en: "gold-foil angel",
        x: BU.x - 16, y: BU.y - H + 11, kunst: flaeche(-4.2, -10, 8.4, 10), tipp: "Der Rauschgoldengel aus goldener Folie ist ein typischer Nürnberger Weihnachtsschmuck." },
      { id: "bratwurst", de: "die Bratwurst", syl: "BRAT-wurst", it: "la salsiccia arrosto", itSyl: "sal-SIC-cia ar-RO-sto", en: "bratwurst",
        x: BU.x + wx, y: THEKE - 0.4, kunst: flaeche(-4.6, -5.6, 9.2, 6), tipp: "„Drei im Weggla“: drei kleine Nürnberger Rostbratwürste im Brötchen." },
      { id: "grill", de: "der Grill", syl: "GRILL", it: "la griglia", itSyl: "GRI-glia", en: "grill",
        x: BU.x + gx0 + 7.5, y: THEKE, kunst: flaeche(-7.8, -6, 15.6, 6.6), tipp: "Die Rostbratwürste brutzeln über Buchenholz." },
    ] });
}
{
  const Y = BU.y - 7;
  const m = B.mensch({ id: "nbg_verk", geschlecht: "w", pose: "stehen", blick: -12, frisur: "zopf", haarfarbe: "dunkelbraun", haut: "hell", laecheln: true,
    kleidung: { oberteil: { stueck: "pullover", farbe: "creme" }, jacke: { stueck: "jacke", farbe: "rot" }, unterteil: { stueck: "hose", farbe: "schwarz" }, schuhe: { stueck: "stiefel", farbe: "braun" }, kopf: { stueck: "muetze", farbe: "gruen_d" }, zubehoer: { stueck: "schal", farbe: "weiss" } } }, 1.66 * km(Y));
  S.def(`<clipPath id="${S.id("hinterTheke")}"><rect x="-50" y="-90" width="100" height="${r(THEKE - 1.2 - Y + 90)}"/></clipPath>`);
  S.teil({ id: "verkaeuferin", de: "die Verkäuferin", syl: "ver-KÄU-fe-rin", it: "la commessa", itSyl: "com-MES-sa", en: "shop assistant", x: BU.x + 20, y: Y,
    kunst: `<g clip-path="url(#${S.id("hinterTheke")})">${m.svg}</g>`, tipp: "Die Verkäuferin fragt: „Darf’s ein Lebkuchen sein?“" });
}

/* Abendlicht von links und ein leichter Rand (fängt keinen Tipp ab) */
S.davor(`<rect width="320" height="200" fill="${S.lg("abendlicht", [[0, "#ffcf8a", 0.14], [0.45, "#ffcf8a", 0], [1, "#1a2440", 0.08]], 0, 0, 1, 0.25)}"/><rect width="320" height="200" fill="${S.rg("vignette", [[0, "#000", 0], [0.72, "#000", 0], [1, "#140c08", 0.22]], 0.5, 0.48, 0.78)}"/>`);

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/nuernberg.js"));
console.log(aus);
