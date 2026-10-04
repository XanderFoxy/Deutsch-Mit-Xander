#!/usr/bin/env node
/* =====================================================================
   STUTTGART (FASSUNG 854, Runde 2) — Bilderwelt neu: eine echte Stadtansicht
   ---------------------------------------------------------------------
   RECHERCHE (stuttgart.de „Schlossplatz“, „Neues Schloss“,
   „Jubiläumssäule“, „Kunstgebäude“; Landtag BW zur Dienstflagge;
   Baubroschüre Neues Schloss (Finanzministerium BW); Structurae/LAP
   „Fernsehturm“; Wikipedia Königsbau (135 m, 34 Säulen); Stuttgart-
   Marketing „Stäffele“; Runde 2 ohne Websuche, aus Fachwissen):
   - STANDORT: oben auf dem Kleinen Schlossplatz, 7 m hinter der Kante der
     breiten Freitreppe (Sitz- und Gehtreppe, hier ≈ 0,9 m tiefe Tritte,
     29 Stufen, 4,3 m hinab zur Königstraße); Auge 1,7 m über der Terrasse
     (6 m über dem Platz). Rechts neben der Treppe steht der Glaswürfel des
     KUNSTMUSEUMS, von dem nur die linke Kante ins Bild ragt. Blick nach
     Ostnordost (Bildmitte ≈ 70°) über den Schlossplatz. Wegen der tiefen
     Tritte sieht man von jeder Stufe den hinteren Streifen; Handläufe
     fallen nach hinten zur Mitte hin ab.
     Von links nach rechts: KÖNIGSBAU (die Kolonnade flieht entlang der
     Königstraße) — am Ende der Königstraße der BAHNHOFSTURM mit dem
     Mercedes-Stern — darüber am Nordhang die WEINBERGE mit Stäffele —
     MUSIKPAVILLON — NEUES SCHLOSS mit Ehrenhof, davor die
     JUBILÄUMSSÄULE zwischen den zwei BRUNNEN — rechts, nah und stark
     verkürzt, das KUNSTGEBÄUDE mit Kuppel und goldenem HIRSCH; hinter
     ihm schauen nur die Kegeldächer des ALTEN SCHLOSSES und der obere
     FERNSEHTURM (Fuß vom Kunstgebäude verdeckt) heraus.
     Das Bild ist ein Rundbild: Die Peilungen sind seitlich gestaucht
     (wie bei einem Panorama), Höhen und Abstände sind maßstäblich.
   - MASSSTAB: Platz y = 112 + 1800 / Abstand; 1 m = (y − 112) / 6
     Einheiten. Terrasse y = 112 + 480 / Abstand; 1 m = (y − 112) / 1,6.
     Terrasse/Treppe: y = 112 + (1,7 − z) · 300 / Abstand.
     Mensch 1,70 m: bei y 131 ≈ 5,4 Einheiten, bei y 128 ≈ 4,5.
   - LICHT: 3. Oktober, später Nachmittag, Sonne Azimut ≈ 232°, Höhe ≈ 22°,
     also hinter uns rechts. Schatten fallen 2,5 × Höhe lang vom
     Betrachter weg und 18° nach links (Fluchtpunkt x ≈ 63 auf dem
     Horizont). Die Platzseite des Kunstgebäudes (nach Norden) liegt im
     Schatten und wirft ihn auf den Platz; die Säulen des Königsbaus und
     die Front des Neuen Schlosses bekommen Streiflicht.
   - KUNSTGEBÄUDE (Theodor Fischer, 1913): lange zweigeschossige Front zum
     Schlossplatz, Kuppelbau mit dem vergoldeten Hirsch, dem Wappentier
     Württembergs; heute Ausstellungen. UNSICHER: Lage der Kuppel entlang
     der Front (hier im hinteren Drittel), Dachform, Fenstergliederung.
   - NEUES SCHLOSS (1746–1807, Retti/Guepière/Thouret): Dreiflügelanlage
     um den Ehrenhof; im Giebel das königlich-württembergische Wappen
     (Hirschstangen und Löwen, gehalten von Löwe und Hirsch, Krone); auf
     der Kuppel statt der Krone die Landesdienstflagge (Schwarz-Gold mit
     dem kleinen Landeswappen: drei schwarze Löwen auf Gold, Blattkrone).
   - JUBILÄUMSSÄULE (1841–46, 25. Regierungsjubiläum Wilhelms I.):
     Granitschaft ≈ 30 m, Sockel mit Bronzereliefs und vier sitzenden
     Frauenfiguren an den Ecken, oben die 5 m hohe CONCORDIA (seit 1863).
   - BRUNNEN: zwei gusseiserne Springbrunnen (1863, Wasseralfingen) links
     und rechts der Säule; Kinderfiguren (Flüsse Württembergs).
   - MUSIKPAVILLON (1871): Gusseisen, achteckig, maurische Hufeisenbögen.
   - KÖNIGSBAU (1856–60, Leins/Knapp): 135 m lange Kolonnade mit
     34 ionischen Säulen, Läden und Cafés; davor die KÖNIGSTRASSE, die
     Fußgängerzone vom Hauptbahnhof bis zum Rotebühlplatz.
   - ALTES SCHLOSS: Renaissance, runde Ecktürme mit Kegeldächern
     (Biberschwanz), heute Landesmuseum Württemberg.
   - FERNSEHTURM (1954–56, Leonhardt/Heinle): erster Fernsehturm aus
     Stahlbeton, 216,6 m, auf dem Hohen Bopser im Wald; ≈ 2,6 km entfernt,
     Fuß ≈ 235 m über dem Platz (y ≈ 85), hier ×1,25 erhöht (Spitze y ≈ 54).
   - BAHNHOFSTURM (Bonatz, 1920er): Muschelkalk-Quader, 56 m, hohe
     Fensterschlitze, oben der Mercedes-Stern im Ring (≈ 1/9 der Höhe).
   - WEINBERGE und STÄFFELE: Reben bis in die Innenstadt, Trockenmauern,
     über 400 Treppen („Stäffele“).
   - TYPISCH: Maultaschen in der Brühe, Linsen mit Spätzle und
     Saitenwürstle, die schwäbische Brezel (dünne Ärmchen, dicker Bauch),
     ein Glas MINERALWASSER (FASSUNG 879, statt des Viertele): Stuttgart hat
     nach Budapest das größte Mineralwasser-Vorkommen Europas (Quellen in
     Bad Cannstatt und Berg).
   UNSICHER außerdem: Breite und Trittmaß der Freitreppe (hier ≈ 34 m, Tritt
   0,9 m), Abstand des Kunstmuseums, genaue Stellung von Pavillon und
   Brunnen auf dem Platz.
   ===================================================================== */
"use strict";
const path = require("path");
const { neueSzene, flaeche, flaecheEllipse, zufall } = require("../bau");
const B = require("../bau");

const S = neueSzene({ id: "stuttgart", titel: "Stuttgart", emoji: "🚗", thema: "Deutschland", kuerzel: "stg", fassung: 854 });
const rnd = zufall(1956);
const r = B.r;
const HOR = 112;
const RAD = Math.PI / 180;

/* ---------- Maßstab, Boden, Schatten ---------- */
const yP = (d) => HOR + 1800 / d, dP = (y) => 1800 / (y - HOR), mY = (y) => (y - HOR) / 6;     /* Platz */
const yT = (d) => HOR + 510 / d, dT = (y) => 510 / (y - HOR), mT = (y) => (y - HOR) / 1.7;     /* Terrasse */
const VS = 63, LS = 1 / Math.tan(22 * RAD), CS = Math.cos(18 * RAD);
/* Schattenspitze eines Dings der Höhe h (m), das bei (x|y) auf dem Boden steht */
const spitze = (x, y, h, terr) => {
  const d = terr ? dT(y) : dP(y), d2 = d + h * LS * CS, y2 = terr ? yT(d2) : yP(d2);
  return [x + (VS - x) * (y - y2) / (y - HOR), y2];
};
/* Schlagschatten als Viereck: Fuß ±b/2 (m) → Spitze ±b2/2 */
const wurf = (x, y, h, b, terr, a = 0.26, b2) => {
  const [x2, y2] = spitze(x, y, h, terr), m1 = terr ? mT(y) : mY(y), m2 = terr ? mT(y2) : mY(y2), q = b2 == null ? b : b2;
  return `<path d="M${r(x - b / 2 * m1)} ${r(y)} L${r(x2 - q / 2 * m2)} ${r(y2)} L${r(x2 + q / 2 * m2)} ${r(y2)} L${r(x + b / 2 * m1)} ${r(y)} Z" fill="#2a2216" opacity="${a}"/>`;
};
/* Bodenraster des Platzes: u entlang der Königstraße (nach Nordosten), v quer dazu (zum Schloss) */
const O = [-11.6, 45], A = [-0.2085, 0.978], AQ = [0.978, 0.2085];
const boden = (u, v, z = 0) => {
  const X = O[0] + u * A[0] + v * AQ[0], D = O[1] + u * A[1] + v * AQ[1];
  return [160 + 300 * X / D, HOR + (6 - z) * 300 / D, D];
};
/* Vieleck auf den Bildrahmen beschneiden (Sutherland-Hodgman) */
const rahmen = (pts, X0 = 0, Y0 = 0, X1 = 320, Y1 = 200) => {
  let out = pts;
  const kanten = [
    [(p) => p[0] >= X0, (a, b) => [X0, a[1] + (X0 - a[0]) / (b[0] - a[0]) * (b[1] - a[1])]],
    [(p) => p[0] <= X1, (a, b) => [X1, a[1] + (X1 - a[0]) / (b[0] - a[0]) * (b[1] - a[1])]],
    [(p) => p[1] >= Y0, (a, b) => [a[0] + (Y0 - a[1]) / (b[1] - a[1]) * (b[0] - a[0]), Y0]],
    [(p) => p[1] <= Y1, (a, b) => [a[0] + (Y1 - a[1]) / (b[1] - a[1]) * (b[0] - a[0]), Y1]],
  ];
  for (const [innen, schnitt] of kanten) {
    const ein = out; out = [];
    for (let i = 0; i < ein.length; i++) {
      const a = ein[i], b = ein[(i + 1) % ein.length], ai = innen(a), bi = innen(b);
      if (ai) out.push(a);
      if (ai !== bi) out.push(schnitt(a, b));
    }
    if (!out.length) break;
  }
  return out;
};
const vieleck = (pts, attr, Y1 = 200, X1 = 320) => { const q = rahmen(pts, 0, 0, X1, Y1); return q.length < 3 ? "" : `<path d="M${q.map((p) => r(p[0]) + " " + r(p[1])).join(" L")} Z" ${attr}/>`; };
const bodenFlaeche = (u0, u1, v0, v1, attr, Y1) => vieleck([boden(u0, v0), boden(u1, v0), boden(u1, v1), boden(u0, v1)], attr, Y1);

/* ---------- Menschen: B.mensch, einmal in den defs, dann mit <use> ---------- */
const ohneBodenschatten = (svg) => svg.replace(/<ellipse[^>]*fill="url\([^)]*\)"[^>]*\/>/, "");
const rund0 = (s) => s.replace(/ d="([^"]*)"/g, (m, d) => ` d="${d.replace(/-?\d+\.\d+/g, (n) => String(Math.round(+n)))}"`)
  .replace(/ (c[xy]|r[xy]?|x[12]?|y[12]?|width|height)="(-?\d+\.\d+)"/g, (m, a, n) => ` ${a}="${Math.round(+n)}"`);
/* fern: Verläufe → Mittelfarbe, ohne Linien und Lasuren (die Figur ist nur wenige Einheiten groß) */
const fern = (svg) => {
  const farbe = {};
  svg.replace(/<(linearGradient|radialGradient) id="([^"]+)"[^>]*>(.*?)<\/\1>/g, (m, t, id, inner) => {
    const st = [...inner.matchAll(/stop-color="([^"]+)"/g)].map((x) => x[1]); farbe[id] = st[Math.floor(st.length / 2)] || "#888";
  });
  let s = svg.replace(/<(linearGradient|radialGradient)[^>]*>.*?<\/\1>/g, "").replace(/url\(#([^)]+)\)/g, (m, id) => farbe[id] || m);
  s = s.replace(/<path[^>]*fill="none"[^>]*\/>/g, "").replace(/<(path|ellipse|circle|rect)[^>]*opacity="[^"]*"[^>]*\/>/g, "");
  return rund0(s).replace(/<defs><\/defs>/g, "");
};
/* mittel: mit Verläufen, ohne feine Linien (für die Menschen auf der Treppe) */
const mittel = (svg) => rund0(svg.replace(/<path[^>]*fill="none"[^>]*\/>/g, ""));
const hexRGB = (c) => { let h = c.slice(1); if (h.length === 3) h = h.split("").map((q) => q + q).join(""); return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)); };
/* Bronze mit Patina: jede Farbe nach ihrer Helligkeit auf Grünbronze */
const bronze = (svg) => svg.replace(/#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g, (c) => {
  const v = hexRGB(c), L = (0.3 * v[0] + 0.55 * v[1] + 0.15 * v[2]) / 255, t = Math.min(1, Math.max(0, (L - 0.12) / 0.78));
  const a = [36, 54, 44], b = [156, 192, 164];
  return "#" + a.map((q, i) => Math.round(q + (b[i] - q) * t).toString(16).padStart(2, "0")).join("");
});
const FIG = {};
const figurDef = (name, spec, art) => {
  const sp = Object.assign({ id: "stg_" + name }, spec); delete sp.bronze;
  const m = B.mensch(sp, 166);
  let s = ohneBodenschatten(m.svg);
  s = art === "mittel" ? mittel(s) : fern(s);
  if (spec.bronze) s = bronze(s);
  S.def(`<g id="${S.id("f_" + name)}">${s}</g>`);
  FIG[name] = m.z;
};
/* Figur mit Fußpunkt (x|y) und Höhe h (Einheiten) */
const figur = (name, x, y, h, spiegel) => `<use href="#${S.id("f_" + name)}" transform="translate(${r(x)} ${r(y)}) scale(${((spiegel ? -1 : 1) * h / 166).toFixed(4)} ${(h / 166).toFixed(4)})"/>`;
const SCHUH = { stueck: "halbschuh", farbe: "#3a2c22" };
figurDef("runter", { geschlecht: "m", pose: "gehen", blick: 182, frisur: "kurz", haarfarbe: "dunkelbraun", haut: "hell",
  kleidung: { oberteil: { stueck: "pullover", farbe: "#3d6b4a" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" } } }, "mittel");
figurDef("rauf", { geschlecht: "w", pose: "gehen", blick: 12, frisur: "zopf", haarfarbe: "blond", haut: "hell",
  kleidung: { oberteil: { stueck: "pullover", farbe: "#8a3c4a" }, unterteil: { stueck: "jeans" }, schuhe: SCHUH } }, "mittel");
figurDef("sitzend", { geschlecht: "w", pose: "schneidersitz", blick: 200, frisur: "zopf", haarfarbe: "hellbraun", haut: "hell",
  kleidung: { oberteil: { stueck: "pullover", farbe: "#c0623a" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" } } });
figurDef("sitzend2", { geschlecht: "m", pose: "sitzen_angewinkelt", blick: 160, frisur: "kurz", haarfarbe: "dunkelbraun", haut: "hell",
  kleidung: { oberteil: { stueck: "pullover", farbe: "#3f5f8a" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" } } });
/* Bronzefiguren der Säule: Concordia (Kontrapost, die Rechte hebt den Kranz) und die sitzenden Frauen am Sockel */
const KONTRA = { roll: 3, lende: 1, brust: -2, brustRoll: -5, nacken: 5, kopf: -6, kopfRoll: 3,
  schulterL: { vor: 4, seit: 10 }, ellbogenL: 20, unterarmL: 10, handL: 6, fingerL: 0.36,
  schulterR: { vor: 8, seit: 150, dreh: 0 }, ellbogenR: 25, unterarmR: 0, handR: 4, fingerR: 0.3,
  huefteL: { vor: 9, seit: 1, dreh: -10 }, knieL: 14, fussL: 4, huefteR: { vor: -2, seit: 4, dreh: -4 }, knieR: 1, fussR: 0 };
figurDef("concordia", { bronze: true, geschlecht: "w", pose: KONTRA, blick: 20, frisur: "dutt", haarfarbe: "blond", haut: "hell", kleidung: { kleid: { stueck: "abendkleid", farbe: "#c8b89a" } } }, "mittel");
figurDef("sitzt", { bronze: true, geschlecht: "w", pose: "sitzen", blick: 40, frisur: "dutt", haarfarbe: "blond", haut: "hell", kleidung: { kleid: { stueck: "abendkleid", farbe: "#c8b89a" } } });

/* ---------- Farben ---------- */
S.def(`<filter color-interpolation-filters="sRGB" id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter color-interpolation-filters="sRGB" id="${S.id("wolke")}" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="2.2"/></filter>`);
S.def(`<filter color-interpolation-filters="sRGB" id="${S.id("dunst")}" x="-10%" y="-30%" width="120%" height="160%"><feGaussianBlur stdDeviation=".45"/></filter>`);
S.def(`<filter color-interpolation-filters="sRGB" id="${S.id("sanft")}" x="-50%" y="-150%" width="200%" height="400%"><feGaussianBlur stdDeviation=".35"/></filter>`);
const PUTZ = S.lg("putz", [[0, "#f1e4c6"], [0.5, "#ead9b5"], [1, "#dcc8a0"]]);
const STEIN = S.lg("stein", [[0, "#f6efdd"], [1, "#e1d4b6"]]);
const SCHIEFER = S.lg("schiefer", [[0, "#7c8794"], [0.5, "#636f7c"], [1, "#4c5764"]]);
const ZIEGEL = S.lg("ziegel", [[0, "#7a3a28"], [0.45, "#a85a44"], [0.8, "#b9694f"], [1, "#8e4a36"]], 0, 0, 1, 0);
const GOLD = S.lg("gold", [[0, "#fff4b8"], [0.35, "#f3cd52"], [0.7, "#c99a22"], [1, "#8a6110"]], 0, 0, 1, 1);
const BRONZE = S.lg("bronze", [[0, "#3a5244"], [0.45, "#5f7d69"], [0.7, "#86a690"], [1, "#4b6555"]], 0, 0, 1, 0);
const EISEN = S.lg("eisen", [[0, "#24302b"], [0.5, "#4f6158"], [0.8, "#6a7d73"], [1, "#2a3631"]], 0, 0, 1, 0);
/* Biberschwanz-Ziegel als Muster */
S.def(`<pattern id="${S.id("biber")}" width="1.2" height=".9" patternUnits="userSpaceOnUse"><rect width="1.2" height=".9" fill="#a65840"/><path d="M0 .9 Q.3 .55 .6 .9 Q.9 .55 1.2 .9" stroke="#6f3324" stroke-width=".14" fill="none"/><path d="M.6 .45 Q.9 .1 1.2 .45 M0 .45 Q.3 .1 .6 .45" stroke="#c27058" stroke-width=".08" fill="none" opacity=".7"/></pattern>`);
const BIBER = `url(#${S.id("biber")})`;
/* Trockenmauer und Rebzeilen als Muster (Weinberg) */
S.def(`<pattern id="${S.id("mauer")}" width="2.4" height="1" patternUnits="userSpaceOnUse"><rect width="2.4" height="1" fill="#cbbd9b"/><path d="M0 .33 H2.4 M0 .66 H2.4 M.5 0 V.33 M1.6 0 V.33 M1 .33 V.66 M2.1 .33 V.66 M.3 .66 V1 M1.4 .66 V1" stroke="#8d7f63" stroke-width=".08"/><rect x=".1" y=".05" width=".6" height=".2" fill="#ddd2b5"/><rect x="1.2" y=".72" width=".7" height=".2" fill="#ddd2b5"/></pattern>`);
if (0) S.def(`<pattern id="${S.id("reben")}" width="1.3" height="2.6" patternUnits="userSpaceOnUse"><rect width="1.3" height="2.6" fill="#7f8a4a"/><path d="M0 .9 H1.3 M0 1.5 H1.3" stroke="#d8d0b4" stroke-width=".05" opacity=".8"/><path d="M.2 2.5 Q.05 1.6 .3 .5 Q.55 .1 .7 .6 Q.95 1.5 .75 2.5 Z" fill="#8d8a3c"/><path d="M.25 1.9 Q.3 1 .5 .55 Q.7 1 .7 1.9 Z" fill="#b3a546"/><circle cx=".55" cy=".9" r=".22" fill="#c99a3e"/><circle cx=".35" cy="1.5" r=".18" fill="#a46a32"/><path d="M1.05 .2 V2.6" stroke="#4d4030" stroke-width=".12"/><path d="M.2 2.5 L.8 2.5" stroke="#5c5530" stroke-width=".2"/></pattern>`);
const MAUER = `url(#${S.id("mauer")})`, REBEN = `url(#${S.id("reben")})`;

/* Unregelmäßige Baumkrone: Umriss mit Zacken, Schattenseite links, Licht rechts */
const krone = (cx, cy, rx, ry, farben, seed, n = 15) => {
  const z = zufall(seed);
  const umriss = (sx, sy, dx, dy) => {
    const p = [];
    for (let i = 0; i < n; i++) {
      const w = i / n * Math.PI * 2, f = 0.8 + 0.32 * z();
      p.push([cx + dx + Math.cos(w) * rx * sx * f, cy + dy + Math.sin(w) * ry * sy * f]);
    }
    let d = `M${r((p[0][0] + p[n - 1][0]) / 2)} ${r((p[0][1] + p[n - 1][1]) / 2)}`;
    for (let i = 0; i < n; i++) { const a = p[i], b = p[(i + 1) % n]; d += ` Q${r(a[0])} ${r(a[1])} ${r((a[0] + b[0]) / 2)} ${r((a[1] + b[1]) / 2)}`; }
    return d + " Z";
  };
  let g = `<path d="${umriss(1, 1, 0, 0)}" fill="${farben[0]}"/>`;
  g += `<path d="${umriss(0.72, 0.7, rx * 0.2, -ry * 0.18)}" fill="${farben[1]}"/>`;
  if (n < 12) return g;
  g += `<path d="${umriss(0.4, 0.38, rx * 0.36, -ry * 0.36)}" fill="${farben[2]}"/>`;
  for (let i = 0; i < 5; i++) g += `<circle cx="${r(cx - rx * 0.5 + z() * rx)}" cy="${r(cy - ry * 0.4 + z() * ry * 0.9)}" r="${r(Math.max(0.25, rx * 0.09))}" fill="${farben[3]}" opacity=".7"/>`;
  return g;
};
const HERBST = ["#5d6f3a", "#86914a", "#b6ad5a", "#c98f3a"], SOMMER = ["#4f6a3a", "#6f8a48", "#9db063", "#bfa64a"];
const baum = (x, y, h, breite, farben, seed) => {
  const m = mY(y), H = h * m, R = breite * m / 2;
  let g = `<path d="M${r(x - 0.18 * m)} ${r(y)} L${r(x - 0.12 * m)} ${r(y - H * 0.5)} L${r(x + 0.12 * m)} ${r(y - H * 0.5)} L${r(x + 0.18 * m)} ${r(y)} Z" fill="#5d4c3a"/>`;
  /* gelappte Krone: einzelne Laubpartien, Licht von hinten rechts, erstes Herbstlaub als Fläche */
  const z = zufall(seed), cx = x, cy = y - H * 0.62, ry = H * 0.36;
  const lappen = (lx, ly, lr, f) => {
    const n = 8, p = [];
    for (let i = 0; i < n; i++) { const w = i / n * Math.PI * 2, q = 0.72 + 0.4 * z(); p.push([lx + Math.cos(w) * lr * q, ly + Math.sin(w) * lr * 0.85 * q]); }
    let t = `M${r((p[0][0] + p[n - 1][0]) / 2)} ${r((p[0][1] + p[n - 1][1]) / 2)}`;
    for (let i = 0; i < n; i++) { const a = p[i], b = p[(i + 1) % n]; t += ` Q${r(a[0])} ${r(a[1])} ${r((a[0] + b[0]) / 2)} ${r((a[1] + b[1]) / 2)}`; }
    return `<path d="${t} Z" fill="${f}"/>`;
  };
  /* Äste in die Krone */
  g += `<path d="M${r(x)} ${r(y - H * 0.5)} L${r(x - R * 0.45)} ${r(cy - ry * 0.2)} M${r(x)} ${r(y - H * 0.55)} L${r(x + R * 0.4)} ${r(cy - ry * 0.35)} M${r(x)} ${r(y - H * 0.55)} L${r(x + R * 0.05)} ${r(cy - ry * 0.6)}" stroke="#5d4c3a" stroke-width="${r(0.08 * m)}"/>`;
  /* Schattenmasse links unten, dann ungleiche Laubpartien: Licht rechts oben, Herbstfarbe als Übergang */
  g += lappen(cx - R * 0.08, cy + ry * 0.1, R * 0.95, "#3f5432");
  const L = [[-0.5, -0.35, 0.42], [0.35, -0.6, 0.36], [-0.05, -0.85, 0.3], [0.62, -0.1, 0.4], [-0.62, 0.25, 0.32], [0.05, -0.15, 0.45], [0.45, 0.45, 0.33], [-0.3, 0.55, 0.28]];
  L.forEach(([a, b, q], i) => { g += lappen(cx + a * R, cy + b * ry, R * q * (0.85 + 0.3 * z()), (i + seed) % 3 === 0 ? HERBST_G : LAUB_G); });
  return g;
};
const LAUB_G = S.rg("laubg", [[0, "#a9c46a"], [0.45, "#6f8c46"], [1, "#4a6436"]], 0.68, 0.28, 0.85);
const HERBST_G = S.rg("herbstg", [[0, "#e6c35a"], [0.5, "#b99a3c"], [1, "#5f7038"]], 0.68, 0.28, 0.85);


/* =====================================================================
   KULISSE — Himmel, die Hänge des Kessels, Dächer der Stadt, Kies
   ===================================================================== */
S.hinten(`<rect width="320" height="${HOR + 8}" fill="${S.lg("himmel", [[0, "#3f78b6"], [0.5, "#86b0d8"], [0.86, "#cfdeea"], [1, "#ece8dd"]])}"/>`);
{
  let w = "";
  for (const [x, y, s] of [[40, 20, 0.9], [150, 12, 1.1], [236, 30, 0.8], [104, 42, 0.5], [292, 14, 0.7]]) {
    w += `<g filter="url(#${S.id("wolke")})" opacity=".9">`;
    for (const [dx, dy, rx, ry] of [[0, 0, 16, 4.6], [-11, 1.4, 10, 3.6], [11, 1, 12, 4.2], [-3, -3.2, 9, 4.6], [6, -3.6, 7, 4]])
      w += `<ellipse cx="${r(x + dx * s)}" cy="${r(y + dy * s)}" rx="${r(rx * s)}" ry="${r(ry * s)}" fill="#fff"/>`;
    w += `<ellipse cx="${x}" cy="${r(y + 3 * s)}" rx="${r(18 * s)}" ry="${r(2 * s)}" fill="#d6e0ea"/></g>`;
  }
  S.hinten(w);
}
/* Osthänge des Kessels (Uhlandshöhe, Gänsheide) und rechts der bewaldete Bopser */
{
  const HANG = "M96 104 Q122 95 150 92.6 Q182 91 212 92.4 Q236 93.4 250 90 Q264 86.4 280 85 Q298 84 306 84.4 Q314 84.8 320 86 L320 120 L96 120 Z";
  let h = `<path d="${HANG}" fill="${S.lg("hang", [[0, "#7f9469"], [0.5, "#8e9d76"], [1, "#a9ab8c"]])}"/>`;
  for (let i = 0; i < 45; i++) {
    const x = 128 + rnd() * 192, top = x < 248 ? 92.5 + (x - 160) * (x - 160) / 9000 : 85.4 + Math.max(0, 300 - x) * 0.08;
    if (x > 246 || rnd() < 0.5) h += `<path d="M${r(x - 1.4)} ${r(top + 2.4)} Q${r(x - 1)} ${r(top - 0.4)} ${r(x)} ${r(top - 0.2)} Q${r(x + 1.2)} ${r(top)} ${r(x + 1.5)} ${r(top + 2.4)} Z" fill="${x > 246 ? (rnd() < 0.5 ? "#3f5a3a" : "#4d6843") : (rnd() < 0.5 ? "#5f7a4c" : "#6f8857")}"/>`;
    else h += `<rect x="${r(x)}" y="${r(top + 4 + rnd() * 9)}" width="${r(1.4 + rnd() * 1.6)}" height="${r(1 + rnd() * 1.2)}" fill="${rnd() < 0.5 ? "#e6dccb" : "#d9c4ae"}"/>`;
  }
  S.hinten(`<g filter="url(#${S.id("dunst")})" opacity=".95">${h}</g>`);
  S.hinten(`<path d="${HANG}" fill="${S.lg("hangdunst", [[0, "#dfe7ec", 0.12], [1, "#e4ebee", 0.5]])}"/>`);
}
/* Dächer der Stadt zwischen den Wahrzeichen */
{
  let c = "";
  let x = 96;
  while (x < 320) {
    const w = 4 + rnd() * 7, h = 3 + rnd() * 6;
    const f = ["#cbbfa9", "#bfb6a6", "#d4c8b2", "#b9b0a4"][Math.floor(rnd() * 4)];
    c += `<rect x="${r(x)}" y="${r(117 - h)}" width="${r(w + 0.3)}" height="${r(h + 1.5)}" fill="${f}"/>`;
    c += `<path d="M${r(x - 0.2)} ${r(117 - h)} L${r(x + w / 2)} ${r(117 - h - 2.2)} L${r(x + w + 0.2)} ${r(117 - h)} Z" fill="${rnd() < 0.5 ? "#8f6a5a" : "#77706c"}"/>`;
    x += w;
  }
  S.hinten(`<g filter="url(#${S.id("dunst")})">${c}</g>`);
}
/* Die Häuserzeile am Ende der Königstraße (Kulisse): die Traufen fliehen zum Fluchtpunkt x 96 */
const HAEUSER = [];
{
  let k = "";
  let x = 57;
  for (const [w, f] of [[6.6, "#e3d8c2"], [6, "#d6cab3"], [5.4, "#e8e0cf"], [4.8, "#d9cfbc"], [4.2, "#e2d9c6"], [3.6, "#d2c8b5"], [3.1, "#ddd3c0"], [2.6, "#d6ccb8"], [2.2, "#e0d6c2"], [2, "#d9cfbc"]]) {
    if (x > 95.5) break;
    const top = 101 + (x - 57) * 0.22 + (rnd() - 0.5) * 1.2, top2 = 101 + (x + w - 57) * 0.22;
    HAEUSER.push([x, Math.min(top, top2) - 1.2], [x + w, Math.min(top, top2) - 1.2]);
    k += `<path d="M${r(x)} 117.6 L${r(x)} ${r(top)} L${r(x + w)} ${r(top2)} L${r(x + w)} 117.6 Z" fill="${f}"/>`;
    k += `<path d="M${r(x)} ${r(top)} L${r(x + w)} ${r(top2)} L${r(x + w)} ${r(top2 - 1.2)} L${r(x)} ${r(top - 1.2)} Z" fill="#8c7a6e"/>`;
    let fe = ""; for (let j = 0; j < 4; j++) for (let i = 0; i < Math.floor(w / 1.6); i++) fe += `M${r(x + 0.4 + i * 1.6)} ${r(top + 1.2 + j * 2.4)} h.7 v1.1 h-.7 Z`; k += `<path d="${fe}" fill="#5d6670" opacity=".75"/>`;
    x += w;
  }
  /* rechts vom Fluchtpunkt: die Häuser am Bahnhof */
  k += `<path d="M95 117.6 L95 109.6 L106 109 L106 117.6 Z" fill="#d9cfbc"/><path d="M95 109.6 L106 109 L106 108 L95 108.6 Z" fill="#7d6e66"/>`;
  HAEUSER.push([95, 108.6], [106, 108]);
  S.hinten(`<g filter="url(#${S.id("dunst")})">${k}</g>`);
}
/* Kies des Schlossplatzes */
S.hinten(`<path d="M0 116.4 L320 116.4 L320 200 L0 200 Z" fill="${S.lg("kies", [[0, "#ddd2bd"], [1, "#cdbfa5"]])}"/>`);

/* =====================================================================
   1 — DER FERNSEHTURM (auf dem Hohen Bopser, hinter dem Kunstgebäude)
   ===================================================================== */
const FT = { x: 306, y: 85, s: 31 / 86.4 };
{
  const s = FT.s, Y = (v) => r(v * s);
  let k = "";
  /* Schaft aus Beton: unten breiter, oben schlanker; im Dunst blasser */
  k += `<path d="M${Y(-2.2)} 0 L${Y(-1.15)} ${Y(-53)} L${Y(1.15)} ${Y(-53)} L${Y(2.2)} 0 Z" fill="${S.lg("schaft", [[0, "#aeb3b6"], [0.45, "#dfe2e2"], [0.75, "#eef0ee"], [1, "#b8bdbf"]], 0, 0, 1, 0)}"/>`;
  /* Turmkorb: Trichter, vier Geschosse mit Fensterbändern, Plattform */
  k += `<path d="M${Y(-1.2)} ${Y(-53)} L${Y(-4.2)} ${Y(-55.2)} L${Y(4.2)} ${Y(-55.2)} L${Y(1.2)} ${Y(-53)} Z" fill="#cfd2d2"/>`;
  k += `<rect x="${Y(-4.2)}" y="${Y(-61.6)}" width="${Y(8.4)}" height="${Y(6.4)}" fill="${S.lg("korb", [[0, "#c2c6c7"], [0.6, "#f2f2ee"], [1, "#cdd0d0"]], 0, 0, 1, 0)}"/>`;
  for (const y of [-56.4, -57.9, -59.4, -60.9]) k += `<rect x="${Y(-4.2)}" y="${Y(y)}" width="${Y(8.4)}" height="${Y(0.8)}" fill="${S.lg("korbfen", [[0, "#55687a"], [0.6, "#93abc0"], [1, "#5f7387"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${Y(-4.2)} ${Y(-55.2)} L${Y(4.2)} ${Y(-55.2)} M${Y(-4.2)} ${Y(-61.6)} L${Y(4.2)} ${Y(-61.6)}" stroke="#a7acad" stroke-width=".1"/>`;
  k += `<rect x="${Y(-5)}" y="${Y(-62.4)}" width="${Y(10)}" height="${Y(0.8)}" fill="#eceeec"/><path d="M${Y(-5)} ${Y(-62.4)} L${Y(-5)} ${Y(-63.4)} L${Y(5)} ${Y(-63.4)} L${Y(5)} ${Y(-62.4)} ${Array.from({ length: 9 }, (_, i) => `M${Y(-4 + i)} ${Y(-62.4)} L${Y(-4 + i)} ${Y(-63.4)}`).join(" ")}" stroke="#8b8f90" stroke-width=".07" fill="none"/>`;
  k += `<rect x="${Y(-0.9)}" y="${Y(-66)}" width="${Y(1.8)}" height="${Y(3.6)}" fill="#dcdedd"/>`;
  for (let i = 0; i < 8; i++) k += `<rect x="${Y(-0.5 + i * 0.03)}" y="${Y(-67.8 - i * 2.1)}" width="${Y(1 - i * 0.06)}" height="${Y(2.1)}" fill="${i % 2 ? "#f0f0ec" : "#d0544e"}"/>`;
  k += `<path d="M0 ${Y(-82.4)} L0 ${Y(-86.4)}" stroke="#d0544e" stroke-width=".14"/>`;
  S.teil({ id: "fernsehturm", de: "der Fernsehturm", syl: "FERN-seh-turm", it: "la torre della televisione", itSyl: "TOR-re del-la te-le-vi-SIO-ne", en: "TV tower",
    x: FT.x, y: FT.y, kunst: `<g opacity=".88">${k}</g>`, tipp: "Der Stuttgarter Fernsehturm von 1956 war der erste Fernsehturm aus Beton auf der Welt.",
    zoom: { x: FT.x - 10, y: 55, w: 19.5, h: 13 },
    unter: [
      { id: "aussichtsplattform", de: "die Aussichtsplattform", syl: "AUS-sichts-platt-form", it: "la piattaforma panoramica", itSyl: "piat-ta-FOR-ma pa-no-RA-mi-ca", en: "observation deck",
        x: FT.x, y: FT.y - 55.2 * s, kunst: flaeche(-2, -2.8, 4, 3.4, 0.3), tipp: "Vom Turmkorb in 150 Metern Höhe sieht man über den ganzen Stuttgarter Kessel." },
    ] });
}

/* =====================================================================
   2 — DER WEINBERG (Nordhang, links hinter dem Königsbau) mit Stäffele
   ===================================================================== */
{
  let k = "";
  const rand = (x) => 72 + (x - 34) * (x - 34) / 160 + (x > 34 ? (x - 34) * 0.05 : 0);
  /* Unterkante: die Dächer der Häuser am Ende der Königstraße (sie liegen in der Kulisse davor) */
  const unten = (x) => {
    if (x < 57) return 104;
    for (let i = 1; i < HAEUSER.length; i++) if (x <= HAEUSER[i][0]) { const [a, ya] = HAEUSER[i - 1], [b, yb] = HAEUSER[i]; return ya + (yb - ya) * (x - a) / Math.max(0.01, b - a); }
    return 108;
  };
  const xs = []; for (let x = 0; x <= 108; x += 6) xs.push(x);
  const oben = (x) => Math.min(unten(x), rand(x));
  const kurve = (f) => xs.map((x) => `${x} ${r(f(x))}`);
  const band = (a, b) => `M${kurve(a).join(" L")} L${xs.slice().reverse().map((x) => `${x} ${r(b(x))}`).join(" L")} Z`;
  k += `<path d="${band(oben, unten)}" fill="${S.lg("weinhang", [[0, "#8f9c5c"], [0.6, "#8a9356"], [1, "#9a9a70"]])}"/>`;
  /* Terrassen: Trockenmauern entlang der Höhenlinien; auf jeder Terrasse zwei Rebzeilen parallel zur Mauer
     (Pfähle, Drahtrahmen, Laub im ersten Herbstgelb und -rot); nach oben kleiner und blasser */
  const wz = zufall(808);
  const LAUBF = [["#b8a43c", "#8f9a3e"], ["#c99a3e", "#9a8a3a"], ["#a9b04a", "#b4683a"], ["#c4aa48", "#8d963c"]];
  let ma = "", sch = "", pf = "", parz = "";
  const reihen = [];
  for (let i = 0; i < 9; i++) {
    const o = 1.6 + i * 3.1, f = 0.45 + i * 0.07;
    const b = (x) => Math.min(unten(x), rand(x) + o + 2.2), c = (x) => Math.min(unten(x), rand(x) + o + 3.1);
    const zack = xs.map((x) => `${x} ${r(b(x) - (wz() < 0.5 ? 0.12 : 0))}`);
    ma += `M${zack.join(" L")} L${xs.slice().reverse().map((x) => `${x} ${r(c(x))}`).join(" L")} Z`;
    sch += `M${kurve((x) => c(x) - 0.12).join(" L")} `;
    /* Parzellen: Herbstfarben als Flächen (gelblich, rötlich wie Trollinger und Lemberger, noch grün) */
    const a = (x) => Math.min(unten(x), rand(x) + o);
    let xa = 0;
    while (xa < 106) {
      const xb = Math.min(108, xa + 12 + wz() * 16), seg = xs.filter((x) => x > xa && x < xb), pts = [xa, ...seg, xb];
      const c = ["#b7a442", "#a8623c", "#8f9a52", "#c2ad4c", "#93783c"][Math.floor(wz() * 5)];
      parz += `<path d="M${pts.map((x) => `${r(x)} ${r(a(x))}`).join(" L")} L${pts.slice().reverse().map((x) => `${r(x)} ${r(b(x))}`).join(" L")} Z" fill="${c}" opacity="${r(0.35 + i * 0.04)}"/>`;
      xa = xb;
    }
    /* drei Rebzeilen je Terrasse: feine, fast durchgehende Linien mit Pfählen, oben dünner und blasser */
    for (const t of [0.5, 1.15, 1.8]) {
      const rz = (x) => Math.min(unten(x) - 0.3, rand(x) + o + t);
      pf += `M${kurve((x) => rz(x) - 0.3 * f).join(" L")} `;
      reihen.push([rz, f, i]);
    }
  }
  k += `<path d="${ma}" fill="${MAUER}"/><path d="${sch}" stroke="#6d6450" stroke-width=".22" fill="none" opacity=".75"/>` + parz;
  k += `<path d="${pf}" stroke="#4d4030" stroke-width=".08" stroke-dasharray=".06 1.3" fill="none"/>`;
  for (const [rz, f, i] of reihen) k += `<path d="M${kurve(rz).join(" L")}" stroke="${i % 3 === 1 ? "#5e6a2e" : "#4c6430"}" stroke-width="${r(0.35 * f)}" stroke-dasharray="${r(4 * f)} ${r(0.35 * f)}" opacity="${r(0.55 + i * 0.05)}" fill="none"/>`;
  /* Wald auf der Kuppe: Kronen ungleicher Größe, Licht von rechts hinten */
  {
    /* Grundfläche, zum Stäffele hin dünner auslaufend (keine Kante) */
    const xw = [...xs.filter((x) => x <= 72), 76, 79], dick = (x) => Math.min(1, (79 - x) / 13);
    k += `<path d="M${xw.map((x) => `${x} ${r(rand(x) - 0.4 * dick(x))}`).join(" L")} L${xw.slice().reverse().map((x) => `${x} ${r(rand(x) + 1.4 * dick(x))}`).join(" L")} Z" fill="#43603a"/>`;
    /* drei gestaffelte Reihen überlappender Kronen (hinten blasser); je Reihe eine Lichtkante als Sichel oben rechts,
       einzelne Kronenränder schon gelblich */
    for (const [ro, dy, xe, dk, li] of [[0, 1.9, 70, "#6a8160", "#93a37a"], [1, 1, 75, "#4d683f", "#7f9a58"], [2, 0.1, 78.5, "#3c5633", "#6f8a4c"]]) {
      let d = "", gelb = "", x = 26 + ro * 1.3;
      const yb = (x) => rand(x) - dy * dick(x);
      d = `M${r(x)} ${r(yb(x) + 1)}`;
      while (x < xe) {
        const R = (0.8 + wz() * 1.1) * (0.5 + 0.5 * dick(x)), w = R * (1.5 + wz() * 0.5), x2 = Math.min(xe, x + w), h = R * (0.75 + wz() * 0.3);
        const yt = yb((x + x2) / 2) - 1.4 * h, y2 = yb(x2) - 0.3 * h;
        d += ` C${r(x - 0.1 * w)} ${r(yt)} ${r(x2 + 0.1 * w)} ${r(yt)} ${r(x2)} ${r(y2)}`;
        if (ro && wz() < 0.2) gelb += `<ellipse cx="${r(x + 0.62 * w)}" cy="${r(yb(x2) - 0.75 * h)}" rx="${r(0.28 * w)}" ry="${r(0.32 * h)}"/>`;
        x = x2;
      }
      for (let q = xe + 0.5; q > 22; q -= 6) d += ` L${r(q)} ${r(yb(q) + 1.4)}`;
      d += " Z";
      k += `<path d="${d}" fill="${li}" transform="translate(.4 -.4)"/><path d="${d}" fill="${dk}"/>`;
      if (gelb) k += `<g fill="#a99e4a" opacity=".85">${gelb}</g>`;
    }
  }
  /* Stäffele: ein gerader, steiler Lauf den Hang hinauf, mit zwei Absätzen und Geländer */
  {
    const unt = [76, 103.3], obe = [74.2, 84.6], at = (t) => [unt[0] + (obe[0] - unt[0]) * t, unt[1] + (obe[1] - unt[1]) * t], br = (t) => 0.75 - 0.3 * t;
    const L = [0, 0.33, 0.38, 0.68, 0.73, 1];
    let bd = "", st = "";
    const pts = [0, 1].map((s) => [0, 1].map((t) => at(t)));
    bd = `M${r(at(0)[0] - br(0))} ${r(at(0)[1])} L${r(at(1)[0] - br(1))} ${r(at(1)[1])} L${r(at(1)[0] + br(1))} ${r(at(1)[1])} L${r(at(0)[0] + br(0))} ${r(at(0)[1])} Z`;
    k += `<path d="${bd}" fill="#e6dcc2" stroke="#7a6f58" stroke-width=".22"/>`;
    for (let t = 0.02; t < 1; t += 0.022) { if ((t > L[1] && t < L[2]) || (t > L[3] && t < L[4])) continue; const p = at(t); st += `M${r(p[0] - br(t))} ${r(p[1])} L${r(p[0] + br(t))} ${r(p[1])} `; }
    k += `<path d="${st}" stroke="#a2967a" stroke-width=".1"/>`;
    for (const t of [L[1], L[3]]) { const p = at(t + 0.025); k += `<path d="M${r(p[0] - br(t) - 0.3)} ${r(p[1] + 0.35)} L${r(p[0] + br(t) + 0.3)} ${r(p[1] + 0.35)} L${r(p[0] + br(t) + 0.3)} ${r(p[1] - 0.45)} L${r(p[0] - br(t) - 0.3)} ${r(p[1] - 0.45)} Z" fill="#efe7d2" stroke="#8d826a" stroke-width=".1"/>`; }
    let gl = ""; for (let t = 0; t <= 1.001; t += 0.1) { const p = at(t); gl += `M${r(p[0] + br(t) + 0.15)} ${r(p[1])} L${r(p[0] + br(t) + 0.15)} ${r(p[1] - 0.7)} `; }
    k += `<path d="${gl}M${r(at(0)[0] + br(0) + 0.15)} ${r(at(0)[1] - 0.7)} L${r(at(1)[0] + br(1) + 0.15)} ${r(at(1)[1] - 0.7)}" stroke="#3f3a30" stroke-width=".1" fill="none"/>`;
  }
  /* Weinberghäusle */
  k += `<path d="M83 92.6 L83 89.8 L86.8 89.8 L86.8 92.6 Z" fill="${S.lg("haeusle", [[0, "#d9cdb2"], [1, "#efe6d2"]], 0, 0, 1, 0)}"/><path d="M82.5 89.9 L84.9 87.8 L87.3 89.9 Z" fill="${BIBER}"/><path d="M82.5 89.9 L84.9 87.8 L87.3 89.9" stroke="#6f3324" stroke-width=".18" fill="none"/>`;
  k += `<path d="M84.5 92.6 L84.5 90.8 Q84.9 90.4 85.3 90.8 L85.3 92.6 Z" fill="#5a4636"/><rect x="83.5" y="90.5" width=".6" height=".6" fill="#4b545c"/>`;
  k += `<path d="${band(oben, unten)}" fill="${S.lg("weindunst", [[0, "#dfe7ec", 0.18], [1, "#e4ebee", 0.3]])}"/>`;
  S.teil({ id: "weinberg", de: "der Weinberg", syl: "WEIN-berg", it: "il vigneto", itSyl: "vi-GNE-to", en: "vineyard", x: 0, y: 0, kunst: k,
    tipp: "Mitten in Stuttgart wachsen Weinreben. Steile Treppen, die „Stäffele“, führen hinauf.",
    zoom: { x: 60, y: 82, w: 32, h: 20 },
    unter: [
      { id: "staeffele", de: "die Treppe", syl: "TREP-pe", it: "la scalinata", itSyl: "sca-li-NA-ta", en: "steps",
        x: 75.2, y: 103.4, kunst: flaeche(-2.6, -19.2, 5, 19.4, 0.4), tipp: "In Stuttgart gibt es über 400 Treppen an den Hängen – auf Schwäbisch „Stäffele“." },
    ] });
}

/* =====================================================================
   3 — DER BAHNHOFSTURM mit dem Mercedes-Stern (am Ende der Königstraße)
   ===================================================================== */
const BT = { x: 96, y: 108.8 };
{
  /* ≈ 800 m entfernt: 1 m ≈ 0,375 Einheiten; 56 m hoch, ≈ 12 m breit; die Front zu uns im Licht */
  let k = "";
  const top = -14.8, xl = -2.4, xm = 1.9, xr = 3.1;
  k += `<path d="M${xl} 0 L${xl} ${top} L${xm} ${top} L${xm} 0 Z" fill="${S.lg("btv", [[0, "#d9d0bb"], [0.5, "#ebe4d2"], [1, "#e2d9c4"]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M${xm} 0 L${xm} ${top} L${xr} ${top + 0.15} L${xr} 0 Z" fill="${S.lg("bts", [[0, "#b3a994"], [1, "#a39983"]], 0, 0, 1, 0)}"/>`;
  /* Quaderfugen */
  let f = "";
  for (let y = -0.6, i = 0; y > top + 0.4; y -= 0.62, i++) {
    f += `M${xl} ${r(y)} L${xm} ${r(y)} M${xm} ${r(y)} L${xr} ${r(y + 0.02)} `;
    for (let x = xl + (i % 2 ? 0.55 : 1.1); x < xm; x += 1.1) f += `M${r(x)} ${r(y)} L${r(x)} ${r(y - 0.62)} `;
  }
  k += `<path d="${f}" stroke="#a89d86" stroke-width=".06" opacity=".85"/>`;
  /* hohe Fensterschlitze oben, auf beiden Seiten */
  for (const x of [-1.5, -0.55, 0.4, 1.3]) k += `<rect x="${x - 0.16}" y="${top + 1.3}" width=".32" height="3.6" fill="#59605f"/>`;
  for (const x of [2.3, 2.75]) k += `<rect x="${x - 0.12}" y="${top + 1.35}" width=".24" height="3.5" fill="#4c5150"/>`;
  k += `<path d="M${xl - 0.25} ${top} L${xm} ${top} L${xr + 0.15} ${top + 0.15} L${xr + 0.15} ${top - 0.45} L${xm} ${top - 0.6} L${xl - 0.25} ${top - 0.6} Z" fill="#efe8d8"/>`;
  /* der Stern im Ring auf dem Dach (Ø ≈ 1/9 der Turmhöhe), nur das Licht des Tages darauf */
  const sy = top - 2.2;
  k += `<rect x="-.12" y="${r(top - 1.1)}" width=".24" height="1.1" fill="#8d9298"/>`;
  k += `<circle cx="0" cy="${r(sy)}" r=".95" fill="none" stroke="${S.lg("sternring", [[0, "#f4f6f8"], [0.5, "#c3cbd2"], [1, "#7d8790"]], 0, 0, 1, 1)}" stroke-width=".2"/>`;
  k += `<path d="M0 ${r(sy - 0.9)} L.17 ${r(sy - 0.1)} L.78 ${r(sy + 0.45)} L0 ${r(sy + 0.18)} L-.78 ${r(sy + 0.45)} L-.17 ${r(sy - 0.1)} Z" fill="${S.lg("stern", [[0, "#ffffff"], [1, "#9aa5ae"]], 0, 0, 1, 1)}"/>`;
  /* Dachkante der Häuser davor (verdeckt den Fuß des Turms) */
  k += `<path d="M${xl - 0.8} -.2 L${xr + 0.6} -.3 L${xr + 0.6} 1 L${xl - 0.8} 1 Z" fill="#7d6e66"/>`;
  S.teil({ id: "bahnhofsturm", de: "der Bahnhofsturm", syl: "BAHN-hofs-turm", it: "la torre della stazione", itSyl: "TOR-re del-la sta-ZIO-ne", en: "station tower",
    x: BT.x, y: BT.y, kunst: k, tipp: "Auf dem Bahnhofsturm dreht sich ein großer Stern: In Stuttgart haben Mercedes-Benz und Porsche ihren Sitz.",
    zoom: { x: BT.x - 8, y: BT.y - 20.6, w: 16, h: 10 },
    unter: [
      { id: "stern", de: "der Stern", syl: "STERN", it: "la stella", itSyl: "STEL-la", en: "star",
        x: BT.x, y: BT.y + sy, kunst: flaecheEllipse(0, 0, 1.3, 1.3), tipp: "Der Stern dreht sich und leuchtet nachts." },
    ] });
}

/* =====================================================================
   DAS KUNSTGEBÄUDE — Geometrie (die Front flieht nach links zum Schloss)
   Hinteres Ende x 238 (≈ 182 m), vorderes Ende außerhalb rechts (≈ 50 m).
   ===================================================================== */
const KG = { x0: 238, x1: 360, w0: 1 / 182, w1: 1 / 50, L: 110, H: 14 };
const kgT = (u) => { const s = u / KG.L; return s * KG.w0 / (s * KG.w0 + (1 - s) * KG.w1); };
const kgP = (u, z) => { const t = kgT(u), w = (1 - t) * KG.w0 + t * KG.w1; return [KG.x0 + t * (KG.x1 - KG.x0), HOR + (6 - z) * 300 * w]; };
const kgU = (x) => { const t = (x - KG.x0) / (KG.x1 - KG.x0); return KG.L * t * KG.w1 / ((1 - t) * KG.w0 + t * KG.w1); };
const KG_UMAX = kgU(320);

/* =====================================================================
   4 — DAS ALTE SCHLOSS (nur die Kegeldächer schauen über das Kunstgebäude)
   ===================================================================== */
{
  /* ≈ 280 m entfernt, Fuß y 118,4: 1 m ≈ 1,07 Einheiten */
  const Y0 = 118.4, m = 1.07, z = (h) => r(Y0 - h * m);
  let k = "";
  /* Hauptbau: steiles Biberschwanzdach mit Gauben und Kaminen */
  k += `<path d="M268 ${z(20)} L271.5 ${z(33)} L293.5 ${z(33)} L297 ${z(20)} Z" fill="${BIBER}"/>`;
  k += `<path d="M268 ${z(20)} L271.5 ${z(33)} L293.5 ${z(33)} L297 ${z(20)} Z" fill="${S.lg("asdach", [[0, "#2a1a14", 0.35], [0.5, "#2a1a14", 0.05], [1, "#fff0d8", 0.18]], 0, 0, 1, 0)}"/>`;
  k += `<path d="M271.5 ${z(33)} L293.5 ${z(33)}" stroke="#5e2c1f" stroke-width=".35"/>`;
  for (const x of [276, 283, 289]) k += `<path d="M${x - 1} ${z(27.5)} L${x - 1} ${z(29.6)} L${x} ${z(31)} L${x + 1} ${z(29.6)} L${x + 1} ${z(27.5)} Z" fill="#e6dcc6"/><path d="M${x - 1.3} ${z(29.4)} L${x} ${z(31.2)} L${x + 1.3} ${z(29.4)}" stroke="#7c3a28" stroke-width=".45" fill="none"/><rect x="${x - 0.45}" y="${z(29.4)}" width=".9" height="1.3" fill="#4b545c"/>`;
  for (const x of [279.5, 286.5]) k += `<path d="M${x - 0.7} ${z(32.4)} L${x - 0.7} ${z(36)} L${x + 0.7} ${z(36)} L${x + 0.7} ${z(32.6)} Z" fill="${S.lg("kamin", [[0, "#8a5444"], [1, "#b5765e"]], 0, 0, 1, 0)}"/><rect x="${x - 0.95}" y="${z(36.6)}" width="1.9" height=".6" fill="#6b4034"/>`;
  /* zwei runde Ecktürme: Steinring oben mit Fenstern, Kegeldach mit Knauf */
  for (const [x, R] of [[269.5, 5.4], [296, 5]]) {
    k += `<path d="M${x - R} ${z(24)} L${x - R} ${z(28)} Q${x} ${r(Y0 - 28.4 * m)} ${x + R} ${z(28)} L${x + R} ${z(24)} Z" fill="${S.lg("rundturm", [[0, "#b9ab90"], [0.55, "#ece2cc"], [0.85, "#f6eedc"], [1, "#cbbd9f"]], 0, 0, 1, 0)}"/>`;
    k += `<path d="M${x - R} ${z(25.5)} Q${x} ${z(25.1)} ${x + R} ${z(25.5)} M${x - R} ${z(26.8)} Q${x} ${z(26.4)} ${x + R} ${z(26.8)}" stroke="#a89a7d" stroke-width=".1" fill="none"/>`;
    k += `<path d="M${x - 0.9} ${z(24.2)} L${x - 0.9} ${z(26.4)} L${x + 0.9} ${z(26.4)} L${x + 0.9} ${z(24.2)} Z" fill="#4c555e" stroke="#c9a67c" stroke-width=".3"/>`;
    k += `<path d="M${x - R - 0.6} ${z(28)} L${x} ${z(40)} L${x + R + 0.6} ${z(28)} Q${x} ${r(Y0 - 27.3 * m)} ${x - R - 0.6} ${z(28)} Z" fill="${BIBER}"/>`;
    k += `<path d="M${x - R - 0.6} ${z(28)} L${x} ${z(40)} L${x + R + 0.6} ${z(28)} Q${x} ${r(Y0 - 27.3 * m)} ${x - R - 0.6} ${z(28)} Z" fill="${S.lg("kegel", [[0, "#24140e", 0.45], [0.45, "#24140e", 0.08], [0.8, "#fff0d8", 0.12], [1, "#24140e", 0.2]], 0, 0, 1, 0)}"/>`;
    k += `<path d="M${x} ${z(40)} L${x} ${z(42.4)}" stroke="#4d4d4d" stroke-width=".25"/><circle cx="${x}" cy="${z(41)}" r=".38" fill="${GOLD}"/>`;
  }
  S.teil({ id: "altesschloss", de: "das Alte Schloss", syl: "AL-te SCHLOSS", it: "il Castello Vecchio", itSyl: "ca-STEL-lo VEC-chio", en: "Old Castle",
    x: 0, y: 0, kunst: k, tipp: "Im Alten Schloss ist heute das Landesmuseum Württemberg." });
}

/* Wappentiere als Umrisse (Einheit ≈ 1/12 der Tierhöhe), für Wappen und Hirsch */
const HIRSCH = "M-5 -8.2 L-4.8 -7.85 Q-4.3 -7.55 -3.9 -7.5 Q-3.6 -7 -3.5 -6.2 Q-3.75 -5.2 -3.3 -4.3 L-3.25 -3.6 Q-3.05 -2.9 -3.1 -2.1 L-3.15 -.4 L-3.35 0 L-2.85 0 L-2.75 -.4 Q-2.7 -1.5 -2.6 -2.2 Q-2.45 -3 -2.2 -3.55 Q-.5 -3.3 1.6 -3.6 Q1.95 -3 2.05 -2.4 L2.3 -1.9 L2.15 -.4 L2.05 0 L2.55 0 L2.6 -.4 L2.8 -1.7 L2.98 -2.05 Q3.15 -2.6 3.3 -3.5 Q3.5 -4.3 3.45 -4.65 L3.8 -4.8 L3.6 -5.1 Q3.2 -5.5 2.6 -5.6 Q.4 -5.8 -1.9 -5.95 Q-2.5 -6.2 -2.75 -6.8 Q-2.95 -7.4 -3.05 -7.9 L-2.55 -8.6 L-3.1 -8.3 L-3.35 -8.25 Q-3.8 -8.55 -4.15 -8.5 Q-4.6 -8.45 -5 -8.2 Z";
const HIRSCH_HINTEN = "M-2.55 -3.6 Q-2.4 -2.6 -2.35 -1.8 L-2.3 -.4 L-2.45 0 L-1.95 0 L-1.9 -.4 Q-1.85 -1.6 -1.75 -2.3 Q-1.7 -3 -1.6 -3.5 Z M1.25 -3.5 Q1.5 -2.7 1.6 -2.2 L1.75 -1.8 L1.6 -.4 L1.5 0 L2 0 L2.05 -.4 L2.2 -1.7 Q2.15 -2.6 1.95 -3.5 Z";
const GEWEIH = "M-3.55 -8.45 C-3.3 -9.6 -2.8 -10.6 -2.2 -11.6 M-3.45 -8.9 L-4.3 -9.3 M-3.2 -9.65 L-3.95 -10.15 M-2.85 -10.3 L-3.35 -11.1 M-2.2 -11.6 L-2.5 -12.35 M-2.2 -11.6 L-1.65 -12.2 M-2.35 -11.25 L-1.85 -11.45 M-3.85 -8.5 C-3.95 -9.6 -4.35 -10.5 -4.8 -11.4 M-3.98 -9 L-4.8 -9.15 M-4.2 -9.9 L-5 -10.2 M-4.6 -10.95 L-5.3 -11.35 M-4.8 -11.4 L-4.75 -12.1";
const LOEWE = "M1 3 Q.5 1.5 1.8 1 L2.4 .4 Q3 .2 3.2 1 L3.4 2.2 Q5.5 2 7.6 2.2 Q8.4 2.1 8.8 1.4 Q9.6 .4 9.4 1.6 Q9 2.8 8.4 2.8 L8.2 3.6 L8.6 5.8 L7.9 5.8 L7.5 4.2 L6.9 4.2 L7 5.8 L6.3 5.8 L5.9 4 L3.6 4 L3.4 5.8 L2.7 5.8 L2.8 4 L2.4 4 L2.1 5.8 L1.4 5.8 L1.4 4 Q1 3.6 1 3 Z";

/* =====================================================================
   5 — DAS NEUE SCHLOSS (Dreiflügelanlage mit Ehrenhof, Kuppel, Flagge)
   ===================================================================== */
const NS = { x: 170, y: 117 };
{
  let k = "";
  const FEN = S.lg("nsfen", [[0, "#6c7a87"], [0.4, "#4a5562"], [1, "#39424c"]]);
  const fenster = (x0, x1, yb, n, w, h, verdachung) => {
    let g = "";
    const sp = (x1 - x0) / n;
    for (let i = 0; i < n; i++) {
      const x = x0 + sp * (i + 0.5) - w / 2;
      g += `<rect x="${r(x)}" y="${r(yb - h)}" width="${r(w)}" height="${r(h)}" fill="${FEN}"/>`;
      if (verdachung) g += `<path d="M${r(x - 0.3)} ${r(yb - h - 0.2)} L${r(x + w / 2)} ${r(yb - h - 1.1)} L${r(x + w + 0.3)} ${r(yb - h - 0.2)} Z" fill="#f6efdf"/>`;
    }
    return g;
  };
  const fluegel = (x0, x1, yb, hc, hd, n, farbe) => {
    let g = `<rect x="${x0}" y="${r(yb - hc)}" width="${r(x1 - x0)}" height="${hc}" fill="${farbe}"/>`;
    g += `<rect x="${x0}" y="${r(yb - hc * 0.36)}" width="${r(x1 - x0)}" height=".5" fill="#f6efdf"/>`;
    g += fenster(x0, x1, yb - 1, n, (x1 - x0) / n * 0.42, hc * 0.24, false);
    g += fenster(x0, x1, yb - hc * 0.4, n, (x1 - x0) / n * 0.44, hc * 0.3, true);
    g += fenster(x0, x1, yb - hc * 0.8, n, (x1 - x0) / n * 0.4, hc * 0.13, false);
    g += `<rect x="${r(x0 - 0.3)}" y="${r(yb - hc - 0.6)}" width="${r(x1 - x0 + 0.6)}" height=".9" fill="#f6efdf"/>`;
    g += `<path d="${Array.from({ length: Math.floor((x1 - x0 - 0.5) / 0.9) }, (_, i) => `M${r(x0 + 0.7 + i * 0.9)} ${r(yb - hc - 0.6)} V${r(yb - hc - 1.9)}`).join(" ")}" stroke="#e6dbc3" stroke-width=".4"/>`;
    g += `<rect x="${x0}" y="${r(yb - hc - 2.2)}" width="${r(x1 - x0)}" height=".4" fill="#f6efdf"/>`;
    g += `<path d="M${x0 + 0.4} ${r(yb - hc - 2.2)} L${x0 + 1.6} ${r(yb - hc - hd)} L${x1 - 1.6} ${r(yb - hc - hd)} L${x1 - 0.4} ${r(yb - hc - 2.2)} Z" fill="${SCHIEFER}"/>`;
    for (let i = 0; i < n; i += 2) { const x = x0 + (x1 - x0) / n * (i + 0.5); g += `<rect x="${r(x - 0.5)}" y="${r(yb - hc - hd * 0.62)}" width="1" height="1.4" fill="#e9e1cf"/>`; }
    for (let i = 0; i <= n; i += 2) { const x = x0 + (x1 - x0) / n * i; g += `<path d="M${r(x - 0.35)} ${r(yb - hc - 2.2)} L${r(x - 0.3)} ${r(yb - hc - 3.6)} Q${r(x)} ${r(yb - hc - 4.4)} ${r(x + 0.3)} ${r(yb - hc - 3.6)} L${r(x + 0.35)} ${r(yb - hc - 2.2)} Z" fill="#f2ead8"/>`; }
    return g;
  };
  /* Innenseite des Nordflügels: schräg, sie schaut nach Südwesten und liegt voll in der Sonne */
  k += `<path d="M-48 0 L-48 -21.4 L-36 -19.6 L-36 0 Z" fill="${S.lg("innen", [[0, "#ecdcb6"], [1, "#f4e7c6"]], 0, 0, 1, 0)}"/>`;
  for (let i = 0; i < 4; i++) { const x = -46.6 + i * 2.9, t = (x + 48) / 12; for (const [yb, h] of [[-1.4, 4], [-8.6, 5], [-16.4, 2]]) k += `<rect x="${r(x)}" y="${r(yb - h + t * 0.3)}" width="1.3" height="${r(h - t * 0.3)}" fill="#4f5964"/>`; }
  k += `<path d="M-48.4 -21.4 L-36 -19.6 L-36.6 -26.8 L-47.6 -29.4 Z" fill="${S.lg("innendach", [[0, "#7a8693"], [1, "#909baa"]], 0, 0, 1, 0)}"/><path d="M-48.4 -21.4 L-36 -19.6" stroke="#f2ead8" stroke-width=".6"/>`;
  /* Mittelbau (Corps de Logis), Streiflicht von rechts */
  k += fluegel(-36, 42, 0, 19.6, 7.2, 23, S.lg("corps", [[0, "#e2cfa8"], [0.6, "#ebdab6"], [1, "#f1e3c2"]], 0, 0, 1, 0));
  /* Mittelrisalit: Säulen, Dreiecksgiebel mit dem königlichen Wappen, Figuren */
  k += `<rect x="-9" y="-21" width="18" height="21" fill="${STEIN}"/>`;
  for (const x of [-7.6, -4.6, -1.5, 1.5, 4.6, 7.6]) k += `<rect x="${x - 0.5}" y="-19.6" width="1" height="11.6" fill="${S.lg("nssaeule", [[0, "#d9ceb6"], [0.6, "#fbf7ee"], [1, "#e4dac4"]], 0, 0, 1, 0)}"/><rect x="${x - 0.7}" y="-20.2" width="1.4" height=".6" fill="#e6dcc6"/>`;
  k += fenster(-9, 9, -9, 5, 1.5, 6.4, false) + fenster(-9, 9, -1, 5, 1.6, 4.6, false);
  k += `<rect x="-9.6" y="-21.6" width="19.2" height="1" fill="#fbf7ee"/>`;
  k += `<path d="M-10 -21.6 L0 -27.6 L10 -21.6 Z" fill="${STEIN}" stroke="#cdbf9f" stroke-width=".35"/>`;
  k += `<path d="M-8.4 -22.2 L0 -27 L8.4 -22.2 Z" fill="#e9dfc8"/>`;
  /* Wappen: Schild gespalten — vorn drei schwarze Hirschstangen, hinten drei schwarze Löwen, beides auf Gold; Krone; Schildhalter Löwe und Hirsch */
  {
    let w = `<path d="M-1.35 -25.4 L1.35 -25.4 L1.35 -23.6 Q1.35 -22.5 0 -22.1 Q-1.35 -22.5 -1.35 -23.6 Z" fill="${GOLD}" stroke="#6b5420" stroke-width=".12"/>`;
    w += `<path d="M0 -25.4 L0 -22.1" stroke="#6b5420" stroke-width=".1"/>`;
    for (const y of [-24.85, -24.1, -23.35]) w += `<path d="M-1.15 ${y} Q-.6 ${r(y - 0.12)} -.12 ${r(y + 0.02)} M-.95 ${r(y - 0.05)} L-1.02 ${r(y - 0.3)} M-.65 ${r(y - 0.09)} L-.7 ${r(y - 0.36)} M-.35 ${r(y - 0.06)} L-.38 ${r(y - 0.3)}" stroke="#1d1d1d" stroke-width=".13" fill="none" stroke-linecap="round"/>`;
    for (const y of [-25.25, -24.45, -23.65]) w += `<path d="${LOEWE}" transform="translate(.12 ${y}) scale(.105)" fill="#1d1d1d"/>`;
    w += `<path d="M-1.2 -25.5 L-1.2 -26.3 L-.7 -25.9 L-.35 -26.6 L0 -26 L.35 -26.6 L.7 -25.9 L1.2 -26.3 L1.2 -25.5 Z" fill="${GOLD}" stroke="#6b5420" stroke-width=".08"/>`;
    /* Schildhalter als Steinrelief */
    /* Schildhalter als Sandsteinrelief: links ein steigender Löwe, rechts ein Hirsch */
    const RELIEF = S.lg("relief_st", [[0, "#b9a988"], [0.45, "#e9dcc0"], [1, "#fbf3e2"]], 0, 0, 1, 0);
    /* steigender Löwe im Profil: Mähnenzacken, Quastenschwanz; Relief mit Schattenkante unten rechts und Lichtkante */
    const LOEWE_STEIGEND = "M0 0 L.9 0 L1.3 -1.8 L1.9 -2.6 L2.6 -2.2 L3.1 -2.6 L2.4 -3.3 L2 -3.9 Q2.6 -5.2 3 -6.6 L4 -7.2 L4.7 -7 L4.8 -7.5 L4.2 -7.8 L3.6 -7.8 L4.3 -8.4 L4.9 -8.5 L4.9 -9 L4.1 -8.9 L3.7 -8.8 L4.1 -9.3 L4.4 -9.5 L4 -9.9 L3.6 -10.4 L3.3 -10.1 L3.1 -10.7 L2.7 -10.3 L2.3 -10.6 L2.2 -10 L1.7 -10.1 L1.8 -9.4 L1.3 -9.3 L1.6 -8.7 L1.2 -8.3 L1.6 -7.9 Q1.1 -6 .6 -4.2 Q.3 -3.4 .4 -2.6 L.4 -1.8 Z M.5 -3.4 Q-.9 -3.6 -1.2 -5.6 Q-1.3 -7.2 -.6 -7.8 L-.3 -8.5 L-.9 -8.3 L-1 -8.8 L-1.3 -8 Q-1.7 -7 -1.6 -5.6 Q-1.3 -3.4 .4 -2.9 Z";
    w += `<g transform="translate(-4.15 -22) scale(.32)"><path d="${LOEWE_STEIGEND}" fill="#8a7a58" transform="translate(.25 .25)"/><path d="${LOEWE_STEIGEND}" fill="${RELIEF}" stroke="#fffaf0" stroke-width=".22"/><circle cx="3.75" cy="-9.55" r=".12" fill="#5f5238"/></g>`;
    /* der Hirsch steigt rechts, zum Schild gewandt: gefülltes Relief mit Schattenkopie und Lichtkante wie der Löwe */
    w += `<g transform="translate(4 -22.4) rotate(14) scale(.27)"><g transform="translate(.3 .3)" fill="#8a7a58" stroke="#8a7a58"><path d="${HIRSCH_HINTEN}"/><path d="${HIRSCH}"/><path d="${GEWEIH}" fill="none" stroke-width=".6"/></g><path d="${HIRSCH_HINTEN}" fill="#cdbd99"/><path d="${GEWEIH}" stroke="#e6d8b8" stroke-width=".5" fill="none" stroke-linecap="round"/><path d="${HIRSCH}" fill="${RELIEF}" stroke="#fffaf0" stroke-width=".22"/><circle cx="-4.15" cy="-8.1" r=".15" fill="#5f5238"/></g>`;
    w += `<path d="M-6.6 -22.3 Q-5 -22.8 -3.2 -22.4 M3.4 -22.4 Q5 -22.8 6.6 -22.3" stroke="#cdbf9f" stroke-width=".3" fill="none"/>`;
    k += w;
  }
  for (const x of [-10, 0, 10]) k += `<path d="M${x - 0.4} ${x === 0 ? -27.6 : -21.6} L${x - 0.35} ${x === 0 ? -29.6 : -23.6} Q${x} ${x === 0 ? -30.6 : -24.6} ${x + 0.35} ${x === 0 ? -29.6 : -23.6} L${x + 0.4} ${x === 0 ? -27.6 : -21.6} Z" fill="#f2ead8"/>`;
  /* Kuppel: Blechbahnen, Gesims mit Zahnschnitt, Laterne mit Bögen; darauf die Landesdienstflagge */
  k += `<rect x="-7.6" y="-28" width="15.2" height="1.1" fill="#ece3cf"/><path d="${Array.from({ length: 19 }, (_, i) => `M${r(-7.2 + i * 0.8)} -27.2 v.3`).join(" ")}" stroke="#b8a985" stroke-width=".35"/>`;
  k += `<path d="M-7 -28 L-7 -29.4 Q-6.4 -34.6 0 -35.6 Q6.4 -34.6 7 -29.4 L7 -28 Z" fill="${S.lg("kuppelns", [[0, "#56626f"], [0.45, "#7f8c9b"], [0.75, "#aab5c1"], [1, "#6b7785"]], 0, 0, 1, 0)}"/>`;
  for (const x of [-6, -4.4, -2.9, -1.4, 0, 1.4, 2.9, 4.4, 6]) k += `<path d="M${x} -28 Q${r(x * 0.95)} -32.4 ${r(x * 0.22)} -35.4" stroke="${x < 0 ? "#465260" : "#5a6674"}" stroke-width=".16" fill="none"/>`;
  k += `<path d="M-6.9 -29.6 Q0 -30.3 6.9 -29.6" stroke="#bfc8d2" stroke-width=".2" fill="none"/>`;
  k += `<rect x="-1.4" y="-38.6" width="2.8" height="3.1" fill="${S.lg("laterne_ns", [[0, "#d9cdb2"], [0.6, "#f2ead8"], [1, "#e0d4ba"]], 0, 0, 1, 0)}"/>`;
  for (const x of [-0.75, 0, 0.75]) k += `<path d="M${x - 0.24} -35.9 L${x - 0.24} -37.4 Q${x} -37.8 ${x + 0.24} -37.4 L${x + 0.24} -35.9 Z" fill="#4b5663"/>`;
  k += `<path d="M-1.7 -38.6 Q0 -40.4 1.7 -38.6 Z" fill="#6b7785"/><circle cx="0" cy="-40.2" r=".35" fill="${GOLD}"/>`;
  k += `<path d="M0 -40.5 L0 -54.2" stroke="#c4c9cd" stroke-width=".3"/><circle cx="0" cy="-54.4" r=".32" fill="${GOLD}"/>`;
  {
    /* Flagge: Schwarz über Gold, wehend; in der Mitte das kleine Landeswappen (drei schwarze Löwen auf Gold, Blattkrone) */
    const welle = (y) => `M.2 ${r(y)} Q2.4 ${r(y - 0.9)} 4.6 ${r(y)} Q6.8 ${r(y + 0.9)} 8.8 ${r(y + 0.1)}`;
    k += `<path d="${welle(-53.6)} L8.8 -50.3 Q6.8 -49.5 4.6 -50.4 Q2.4 -51.3 .2 -50.4 Z" fill="#1c1c1c"/>`;
    k += `<path d="M.2 -50.5 Q2.4 -51.4 4.6 -50.5 Q6.8 -49.6 8.8 -50.4 L8.8 -47.2 Q6.8 -46.4 4.6 -47.3 Q2.4 -48.2 .2 -47.3 Z" fill="#f2c62f"/>`;
    k += `<path d="${welle(-53.6)} L8.8 -47.2 Q6.8 -46.4 4.6 -47.3 Q2.4 -48.2 .2 -47.3 Z" fill="${S.lg("falten", [[0, "#000", 0], [0.18, "#000", 0.28], [0.32, "#fff", 0.18], [0.5, "#000", 0.05], [0.66, "#000", 0.3], [0.82, "#fff", 0.16], [1, "#000", 0.15]], 0, 0, 1, 0)}"/>`;
    k += `<path d="M3.85 -51.6 L5.35 -51.6 L5.35 -50.2 Q5.35 -49.2 4.6 -48.9 Q3.85 -49.2 3.85 -50.2 Z" fill="#f2c62f" stroke="#1d1d1d" stroke-width=".12"/>`;
    for (const y of [-51.4, -50.7, -50]) k += `<path d="${LOEWE}" transform="translate(4.1 ${y}) scale(.1)" fill="#1d1d1d"/>`;
    k += `<path d="M3.95 -51.7 L3.95 -52.3 L4.3 -52 L4.6 -52.45 L4.9 -52 L5.25 -52.3 L5.25 -51.7 Z" fill="#f2c62f" stroke="#1d1d1d" stroke-width=".06"/>`;
  }
  /* Kopfbau des Nordflügels (links, näher) und des Südflügels (rechts, noch näher) */
  k += fluegel(-66, -48, 0.6, 23.4, 8, 6, PUTZ);
  k += `<path d="M-60.4 -23.8 L-57 -26.8 L-53.6 -23.8 Z" fill="${STEIN}"/>`;
  k += fluegel(42, 66, 1.4, 25.6, 8.6, 7, PUTZ);
  k += `<path d="M50 -24.6 L54 -28 L58 -24.6 Z" fill="${STEIN}"/><circle cx="54" cy="-25.6" r=".9" fill="${GOLD}"/>`;
  k += `<path d="M-48 0 L42 0 L42 1.4 L-48 .6 Z" fill="#e4dac6"/>`;
  S.teil({ id: "neuesschloss", de: "das Neue Schloss", syl: "NEU-e SCHLOSS", it: "il Castello Nuovo", itSyl: "ca-STEL-lo NUO-vo", en: "New Palace",
    x: NS.x, y: NS.y, kunst: k, tipp: "Das Neue Schloss war das Schloss der Könige von Württemberg.",
    zoom: { x: NS.x - 28, y: NS.y - 56, w: 56, h: 35 },
    unter: [
      { id: "fahne", de: "die Fahne", syl: "FAH-ne", it: "la bandiera", itSyl: "ban-DIE-ra", en: "flag",
        x: NS.x + 4.5, y: NS.y - 47.2, kunst: flaeche(-4.6, -7, 9.2, 7.4, 0.4), tipp: "Auf der Kuppel weht die Fahne von Baden-Württemberg: Schwarz und Gold, mit drei Löwen im Wappen." },
      { id: "wappen", de: "das Wappen", syl: "WAP-pen", it: "lo stemma", itSyl: "STEM-ma", en: "coat of arms",
        x: NS.x, y: NS.y - 21.8, kunst: flaeche(-5, -5, 10, 5.2, 0.4), tipp: "Das Wappen der Könige von Württemberg: Hirschstangen und Löwen, gehalten von einem Löwen und einem Hirsch." },
    ] });
}

/* =====================================================================
   6 — DAS KUNSTGEBÄUDE (rechts, nah und verkürzt) mit Kuppel und Hirsch
   ===================================================================== */
const KUP = { x: kgP(40, 0)[0], m: 300 / 140 };
{
  let k = "";
  const um = KG_UMAX;
  const q = (u0, u1, z0, z1) => [kgP(u0, z0), kgP(Math.min(u1, um), z0), kgP(Math.min(u1, um), z1), kgP(u0, z1)];
  /* Kuppelbau (hinter der Front): achteckiger Tambour, Kupferkuppel mit Rippen, Laterne, der goldene Hirsch */
  {
    const GLAS = S.lg("kgglas2", [[0, "#7f93a3"], [0.35, "#4d5d6b"], [1, "#36424d"]]);
    const m = KUP.m, X = KUP.x, Y = (z) => r(HOR + (6 - z) * m);
    const R = 5 * m, fw = 2 * 5 * Math.sin(22.5 * RAD) * m;
    const xs = [X - R, X - fw / 2, X + fw / 2, X + R];
    k += `<path d="M${r(xs[0])} ${Y(14)} L${r(xs[0])} ${Y(19)} L${r(xs[1])} ${Y(19.2)} L${r(xs[2])} ${Y(19.2)} L${r(xs[3])} ${Y(19)} L${r(xs[3])} ${Y(14)} Z" fill="${S.lg("tambour", [[0, "#b9a582"], [0.3, "#cdb994"], [0.36, "#e3d2ad"], [0.66, "#eadab8"], [0.7, "#f1e3c3"], [1, "#e6d5b0"]], 0, 0, 1, 0)}"/>`;
    for (const x of xs) k += `<rect x="${r(x - 0.45)}" y="${Y(19.2)}" width=".9" height="${r(5.2 * m)}" fill="#efe1c0" opacity=".8"/>`;
    for (let i = 0; i < 3; i++) {
      const cx = (xs[i] + xs[i + 1]) / 2, w = (xs[i + 1] - xs[i]) * 0.36;
      k += `<path d="M${r(cx - w)} ${Y(14.8)} L${r(cx - w)} ${Y(17.4)} Q${r(cx)} ${Y(18.5)} ${r(cx + w)} ${Y(17.4)} L${r(cx + w)} ${Y(14.8)} Z" fill="${GLAS}" stroke="#d9c8a2" stroke-width=".3"/>`;
    }
    k += `<path d="M${r(xs[0] - 0.6)} ${Y(19)} L${r(xs[3] + 0.6)} ${Y(19)} L${r(xs[3] + 0.3)} ${Y(19.7)} L${r(xs[0] - 0.3)} ${Y(19.7)} Z" fill="#e8d8b4"/>`;
    const DR = 4.6 * m;
    k += `<path d="M${r(X - DR)} ${Y(19.7)} C${r(X - DR)} ${Y(23.6)} ${r(X - DR * 0.52)} ${Y(26.4)} ${r(X)} ${Y(26.6)} C${r(X + DR * 0.52)} ${Y(26.4)} ${r(X + DR)} ${Y(23.6)} ${r(X + DR)} ${Y(19.7)} Z" fill="${S.lg("kupfer", [[0, "#4f7a68"], [0.4, "#6f9a86"], [0.72, "#9cc2ae"], [0.86, "#b2d1c0"], [1, "#77a08b"]], 0, 0, 1, 0)}"/>`;
    for (const f of [-0.92, -0.62, -0.3, 0, 0.3, 0.62, 0.92]) k += `<path d="M${r(X + f * DR)} ${Y(19.7)} Q${r(X + f * DR * 0.95)} ${Y(23.8)} ${r(X + f * DR * 0.16)} ${Y(26.5)}" stroke="${f < 0 ? "#3f6556" : "#c6e0d2"}" stroke-width=".22" fill="none" opacity=".8"/>`;
    k += `<path d="M${r(X - DR * 0.98)} ${Y(21.3)} Q${r(X)} ${Y(20.6)} ${r(X + DR * 0.98)} ${Y(21.3)}" stroke="#3f6556" stroke-width=".18" fill="none" opacity=".6"/>`;
    const LR = 1.2 * m;
    k += `<path d="M${r(X - LR)} ${Y(26.3)} L${r(X - LR)} ${Y(28.6)} L${r(X + LR)} ${Y(28.6)} L${r(X + LR)} ${Y(26.3)} Z" fill="${S.lg("laterne_kg", [[0, "#c9b690"], [0.6, "#f0e2c0"], [1, "#dccba6"]], 0, 0, 1, 0)}"/>`;
    for (const f of [-0.5, 0.5]) k += `<path d="M${r(X + f * LR - 0.5)} ${Y(26.6)} L${r(X + f * LR - 0.5)} ${Y(27.9)} Q${r(X + f * LR)} ${Y(28.35)} ${r(X + f * LR + 0.5)} ${Y(27.9)} L${r(X + f * LR + 0.5)} ${Y(26.6)} Z" fill="#46525c"/>`;
    k += `<path d="M${r(X - LR - 0.5)} ${Y(28.6)} Q${r(X)} ${Y(29.9)} ${r(X + LR + 0.5)} ${Y(28.6)} Z" fill="#6f9a86"/><path d="M${r(X - 0.7)} ${Y(29.25)} L${r(X - 0.55)} ${Y(29.85)} L${r(X + 0.55)} ${Y(29.85)} L${r(X + 0.7)} ${Y(29.25)} Z" fill="#5f8a76"/><path d="M${r(X - 2.4)} ${Y(29.85)} L${r(X + 2.4)} ${Y(29.85)} L${r(X + 2.2)} ${Y(30.05)} L${r(X - 2.2)} ${Y(30.05)} Z" fill="${GOLD}"/>`;
    /* der Hirsch: vergoldet, im Profil nach links, Sonne von hinten rechts */
    const hs = 2.45 * m / 8.6, hy = HOR + (6 - 30.05) * m;
    k += `<g transform="translate(${r(X + 0.3)} ${r(hy)}) scale(${hs.toFixed(3)})"><path d="${HIRSCH_HINTEN}" fill="#8a6414"/><path d="M-3.85 -8.5 C-3.95 -9.6 -4.35 -10.5 -4.8 -11.4 M-3.98 -9 L-4.8 -9.15 M-4.2 -9.9 L-5 -10.2 M-4.6 -10.95 L-5.3 -11.35" stroke="#9c7418" stroke-width=".36" fill="none" stroke-linecap="round"/><path d="${HIRSCH}" fill="${S.lg("hirschgold", [[0, "#8a6010"], [0.35, "#c99a22"], [0.7, "#f3d064"], [1, "#fff2b0"]], 0, 0, 1, 0)}" stroke="#6f4d0c" stroke-width=".1"/><path d="M-3.55 -8.45 C-3.3 -9.6 -2.8 -10.6 -2.2 -11.6 M-3.45 -8.9 L-4.3 -9.3 M-3.2 -9.65 L-3.95 -10.15 M-2.85 -10.3 L-3.35 -11.1 M-2.2 -11.6 L-2.5 -12.35 M-2.2 -11.6 L-1.65 -12.2 M-2.35 -11.25 L-1.85 -11.45" stroke="#e2b53a" stroke-width=".38" fill="none" stroke-linecap="round"/><path d="M-1.8 -5.85 Q.6 -5.68 2.6 -5.5 Q3.2 -5.4 3.5 -5" stroke="#fff6c8" stroke-width=".2" fill="none"/><path d="M-3.4 -6.4 Q-3.62 -5.5 -3.25 -4.4" stroke="#fff0b0" stroke-width=".14" fill="none" opacity=".7"/><path d="M2.9 -3.4 Q3.1 -2.6 2.85 -2.05" stroke="#fff0b0" stroke-width=".14" fill="none" opacity=".7"/><circle cx="-4.15" cy="-8.1" r=".12" fill="#3a2a08"/></g>`;
  }
  /* Front zum Platz: Nordseite, im Schatten (Himmelslicht), zum Ende hin dunkler */
  k += vieleck(q(0, um, 0, KG.H), `fill="${S.lg("kgf", [[0, "#c6b48f"], [0.6, "#b4a17c"], [1, "#a8956f"]], 0, 0, 1, 0)}"`);
  k += vieleck(q(0, um, 0, 1.1), `fill="#93836a"`);
  k += vieleck(q(0, um, 7, 7.7), `fill="#cdbb95"`);
  k += vieleck(q(0, um, 12.3, 13.1), `fill="#76674f"`);
  k += vieleck(q(0, um, 13.1, 14), `fill="#d2bf98"`);
  /* flaches Ziegeldach hinter dem Gesims (Nordseite, im Schatten) */
  k += vieleck([kgP(0, 14), kgP(um, 14), kgP(um, 15.8), kgP(0, 15.2)], `fill="${BIBER}"`);
  k += vieleck([kgP(0, 14), kgP(um, 14), kgP(um, 15.8), kgP(0, 15.2)], `fill="#24160e" opacity=".42"`);
  /* Achsen: Lisenen, hohe Rundbogenfenster unten, Rechteckfenster oben */
  const GLAS = S.lg("kgglas", [[0, "#7f93a3"], [0.35, "#4d5d6b"], [1, "#36424d"]]);
  for (let u = 0; u < um; u += 5.5) {
    const a = kgP(u, 0), b = kgP(u + 5.5, 0);
    if (b[0] - a[0] < 0.45) continue;
    k += vieleck(q(u - 0.4, u + 0.4, 1.1, 12.3), `fill="#c9b792"`);
    if (u + 2.75 > um) continue;
    const c = u + 2.75, w1 = 1.15, p0 = kgP(c - w1, 1.8), p1 = kgP(c + w1, 1.8), p2 = kgP(c + w1, 5.6), p3 = kgP(c - w1, 5.6), top = kgP(c, 6.6);
    k += `<path d="M${r(p0[0])} ${r(p0[1])} L${r(p1[0])} ${r(p1[1])} L${r(p2[0])} ${r(p2[1])} Q${r(p2[0])} ${r(top[1])} ${r(top[0])} ${r(top[1])} Q${r(p3[0])} ${r(top[1])} ${r(p3[0])} ${r(p3[1])} Z" fill="${GLAS}" stroke="#d8c7a2" stroke-width="${r(Math.max(0.08, (p1[0] - p0[0]) * 0.08))}"/>`;
    k += vieleck(q(c - 0.8, c + 0.8, 8.4, 11.4), `fill="${GLAS}" stroke="#d8c7a2" stroke-width="${r(Math.max(0.06, (p1[0] - p0[0]) * 0.06))}"`);
  }
  S.teil({ id: "kunstgebaeude", de: "das Kunstgebäude", syl: "KUNST-ge-bäu-de", it: "il Kunstgebäude (palazzo delle mostre)", itSyl: "pa-LAZ-zo del-le MO-stre", en: "Kunstgebäude (art exhibition hall)",
    x: 0, y: 0, kunst: k, tipp: "Im Kunstgebäude von 1913 werden Kunstausstellungen gezeigt.",
    zoom: { x: KUP.x - 12, y: 50.5, w: 24, h: 15 },
    unter: [
      { id: "hirsch", de: "der Hirsch", syl: "HIRSCH", it: "il cervo", itSyl: "CER-vo", en: "stag",
        x: KUP.x, y: HOR + (6 - 30.05) * KUP.m, kunst: flaeche(-3.4, -7.4, 6.6, 7.6, 0.4), tipp: "Der goldene Hirsch auf dem Kunstgebäude ist das Wappentier Württembergs." },
    ] });
}

/* =====================================================================
   12 — DER KÖNIGSBAU (links: die Kolonnade läuft zum Bahnhofsturm hin)
   ===================================================================== */
{
  let k = "";
  /* Flucht zum Bahnhofsturm: oben (0|62) → (96|112), unten (0|136) → (96|112) */
  const VX = 96, oben0 = 62, unten0 = 136;
  const xU = (u) => VX * (1 - 90 / (90 + u));             /* u = Meter von der Südecke */
  const oy = (x) => oben0 + (HOR - oben0) * x / VX, uy = (x) => unten0 + (HOR - unten0) * x / VX;
  const at = (x, t) => uy(x) + (oy(x) - uy(x)) * t;          /* t = Anteil der Höhe */
  const xe = xU(135);
  const quad = (t0, t1, x0, x1, f) => `<path d="M${r(x0)} ${r(at(x0, t0))} L${r(x1)} ${r(at(x1, t0))} L${r(x1)} ${r(at(x1, t1))} L${r(x0)} ${r(at(x0, t1))} Z" fill="${f}"/>`;
  /* die Platzseite liegt im Streiflicht (Sonne fast in der Flucht der Fassade) */
  const SANDK = S.lg("koenig", [[0, "#e2d3b4"], [1, "#cdbd9b"]]);
  k += quad(0.62, 1, -2, xe, SANDK);
  let fen = "";
  for (let u = 2; u < 134; u += 4) { const x = xU(u), x2 = xU(u + 1.6); fen += `M${r(x)} ${r(at(x, 0.7))} L${r(x2)} ${r(at(x2, 0.7))} L${r(x2)} ${r(at(x2, 0.9))} L${r(x)} ${r(at(x, 0.9))} Z `; }
  let pil = "", soh = "";
  for (let u = 0; u < 135; u += 8) { const x = xU(u), x2 = xU(u + 0.7); pil += `M${r(x)} ${r(at(x, 0.63))} L${r(x2)} ${r(at(x2, 0.63))} L${r(x2)} ${r(at(x2, 0.99))} L${r(x)} ${r(at(x, 0.99))} Z `; }
  for (let u = 1.6; u < 134; u += 4) { const x = xU(u), x2 = xU(u + 2.4); soh += `M${r(x)} ${r(at(x, 0.69))} L${r(x2)} ${r(at(x2, 0.69))} `; }
  k += `<path d="${pil}" fill="#ece0c4"/><path d="${fen}" fill="#55606b" stroke="#f3ead6" stroke-width=".25"/><path d="${soh}" stroke="#f6efdf" stroke-width=".4"/>`;
  k += quad(1, 1.07, -2, xe, "#f3ead6");
  k += quad(1.07, 1.12, -2, xe, "#7d8896");
  k += quad(0.58, 0.62, -2, xe, "#f4ecda");
  let bal = "";
  for (let u = 0.6; u < 135; u += 1.2) { const x = xU(u); bal += `M${r(x)} ${r(at(x, 0.585))} L${r(x)} ${r(at(x, 0.62))} `; }
  k += `<path d="${bal}" stroke="#d2c4a5" stroke-width=".22"/>`;
  k += quad(0.52, 0.58, -2, xe, "#efe5cf");
  k += quad(0.5, 0.52, -2, xe, "#d6c7a8");
  /* Halle hinter den Säulen: Schatten, Schaufenster warm beleuchtet */
  k += quad(0, 0.5, -2, xe, S.lg("halle", [[0, "#5e5245"], [1, "#3e352d"]]));
  let lad = "";
  for (let u = 1; u < 134; u += 4) { const x = xU(u), x2 = xU(u + 2.4); lad += `M${r(x)} ${r(at(x, 0.04))} L${r(x2)} ${r(at(x2, 0.04))} L${r(x2)} ${r(at(x2, 0.36))} L${r(x)} ${r(at(x, 0.36))} Z `; }
  k += `<path d="${lad}" fill="${S.lg("laden", [[0, "#f6d79a"], [1, "#c99a55"]])}" opacity=".8"/>`;
  /* Cafétische unter den Arkaden */
  for (const u of [2.2, 6.3, 10.4, 14.5]) {
    const x = xU(u + 1.2), y = at(x, 0) - 0.3, mm = 300 / (81 + u) * 0.9;
    k += `<path d="M${r(x - 0.06 * mm)} ${r(y)} L${r(x - 0.06 * mm)} ${r(y - 0.72 * mm)} L${r(x + 0.06 * mm)} ${r(y - 0.72 * mm)} L${r(x + 0.06 * mm)} ${r(y)} Z" fill="#2f3a36"/><ellipse cx="${r(x)}" cy="${r(y - 0.74 * mm)}" rx="${r(0.36 * mm)}" ry="${r(0.07 * mm)}" fill="#f2efe8"/>`;
    for (const sx of [-1, 1]) k += `<path d="M${r(x + sx * 0.45 * mm)} ${r(y)} L${r(x + sx * 0.45 * mm)} ${r(y - 0.45 * mm)} L${r(x + sx * 0.6 * mm)} ${r(y - 0.45 * mm)} L${r(x + sx * 0.6 * mm)} ${r(y - 0.9 * mm)}" stroke="#2f5a44" stroke-width="${r(0.05 * mm)}" fill="none"/>`;
  }
  /* Boden der Kolonnade */
  k += `<path d="M-2 ${r(at(-2, 0))} L${r(xe)} ${r(at(xe, 0))} L${r(xe)} ${r(at(xe, 0) + 0.5)} L-2 ${r(at(-2, 0) + 1.6)} Z" fill="#b8ab93"/>`;
  /* 34 ionische Säulen: vorn mit attischer Basis, Kannelur und Volutenkapitell */
  S.def(`<g id="${S.id("kap")}"><rect x="-.62" y=".02" width="1.24" height=".22" fill="#efe4cc"/><circle cx="-.6" cy=".26" r=".2" fill="#f4ead6" stroke="#a8956f" stroke-width=".07"/><circle cx="-.6" cy=".26" r=".07" fill="#a8956f"/><circle cx=".6" cy=".26" r=".2" fill="#f4ead6" stroke="#a8956f" stroke-width=".07"/><circle cx=".6" cy=".26" r=".07" fill="#a8956f"/><rect x="-.82" y="-.18" width="1.64" height=".2" fill="#f7f0e0"/></g><g id="${S.id("basis")}"><rect x="-.72" y="-.2" width="1.44" height=".2" fill="#ddd0b4"/><rect x="-.62" y="-.36" width="1.24" height=".17" rx=".08" fill="#efe5d0"/></g>`);
  const SAEULE_K = S.lg("koensaeule", [[0, "#b9a988"], [0.3, "#dccfb2"], [0.62, "#f6eedd"], [0.85, "#e6dabf"], [1, "#c4b493"]], 0, 0, 1, 0);
  for (let i = 0; i < 34; i++) {
    const u = i * 4.09, x = xU(u), w = Math.max(0.25, Math.min(300 * 1.0 / (81 + u) * 0.82, (xU(u + 4.09) - x) * 0.6));
    const yb = at(x, 0), yt = at(x, 0.5);
    k += `<rect x="${r(x - w / 2)}" y="${r(yt)}" width="${r(w)}" height="${r(yb - yt)}" fill="${SAEULE_K}"/>`;
    if (w > 2) {
      k += `<path d="M${r(x - w * 0.25)} ${r(yt + w * 0.5)} L${r(x - w * 0.25)} ${r(yb - w * 0.55)} M${r(x)} ${r(yt + w * 0.5)} L${r(x)} ${r(yb - w * 0.55)} M${r(x + w * 0.25)} ${r(yt + w * 0.5)} L${r(x + w * 0.25)} ${r(yb - w * 0.55)}" stroke="#bfae8c" stroke-width="${r(w * 0.07)}" opacity=".75"/>`;
      k += `<path d="M${r(x - w * 0.38)} ${r(yt + w * 0.5)} L${r(x - w * 0.38)} ${r(yb - w * 0.55)} M${r(x + w * 0.12)} ${r(yt + w * 0.5)} L${r(x + w * 0.12)} ${r(yb - w * 0.55)}" stroke="#fffaf0" stroke-width="${r(w * 0.05)}" opacity=".6"/>`;
      /* attische Basis: Plinthe, zwei Wülste, Hohlkehle */
      k += `<rect x="${r(x - w * 0.72)}" y="${r(yb - w * 0.2)}" width="${r(w * 1.44)}" height="${r(w * 0.2)}" fill="#ddd0b4"/>`;
      k += `<rect x="${r(x - w * 0.65)}" y="${r(yb - w * 0.36)}" width="${r(w * 1.3)}" height="${r(w * 0.17)}" rx="${r(w * 0.08)}" fill="#efe5d0"/>`;
      k += `<rect x="${r(x - w * 0.54)}" y="${r(yb - w * 0.47)}" width="${r(w * 1.08)}" height="${r(w * 0.12)}" rx="${r(w * 0.06)}" fill="#e9dfc8"/>`;
      /* Kapitell: Echinus mit Eierstab, Voluten als Spiralen, Abakus */
      k += `<rect x="${r(x - w * 0.62)}" y="${r(yt + w * 0.02)}" width="${r(w * 1.24)}" height="${r(w * 0.22)}" fill="#efe4cc"/>`;
      k += `<path d="M${r(x - w * 0.45)} ${r(yt + w * 0.13)} h${r(w * 0.9)}" stroke="#bba88a" stroke-width="${r(w * 0.07)}" stroke-dasharray="${r(w * 0.08)} ${r(w * 0.06)}"/>`;
      for (const s of [-1, 1]) {
        const vx = x + s * w * 0.6, vy = yt + w * 0.26, q = w * 0.2;
        k += `<path d="M${r(vx - s * q * 1.3)} ${r(vy - q * 1.1)} Q${r(vx + s * q * 0.4)} ${r(vy - q * 1.3)} ${r(vx + s * q)} ${r(vy - q * 0.1)} A${r(q)} ${r(q)} 0 1 ${s > 0 ? 1 : 0} ${r(vx - s * q * 0.6)} ${r(vy + q * 0.6)} A${r(q * 0.6)} ${r(q * 0.6)} 0 1 ${s > 0 ? 1 : 0} ${r(vx + s * q * 0.3)} ${r(vy - q * 0.15)} A${r(q * 0.3)} ${r(q * 0.3)} 0 1 ${s > 0 ? 1 : 0} ${r(vx)} ${r(vy + q * 0.2)}" stroke="#a8956f" stroke-width="${r(w * 0.065)}" fill="#f4ead6"/>`;
      }
      k += `<rect x="${r(x - w * 0.82)}" y="${r(yt - w * 0.18)}" width="${r(w * 1.64)}" height="${r(w * 0.2)}" fill="#f7f0e0"/>`;
    } else if (w > 0.6) {
      k += `<use href="#${S.id("kap")}" transform="translate(${r(x)} ${r(yt)}) scale(${w.toFixed(2)})"/><use href="#${S.id("basis")}" transform="translate(${r(x)} ${r(yb)}) scale(${w.toFixed(2)})"/>`;
    }
  }
  /* Stirnseite (Südecke) im Licht, mit Pilastern */
  k += `<path d="M-2 ${r(at(-2, 0))} L-2 ${r(at(-2, 1.07))} L-6 ${r(at(-2, 1.07) + 1)} L-6 ${r(at(-2, 0) + 0.6)} Z" fill="#efe2c4"/>`;
  /* Außengastronomie vor der ersten Säulenreihe: Tisch, zwei Stühle, Sonnenschirm in Creme, Schatten auf dem Gehweg */
  for (const u of [2, 10.2, 18.4]) {
    const m = 300 / (81 + u) * 0.82, x = xU(u) - 0.4 * m, y = at(xU(u), 0) + 0.9 * m, P = (a, b) => `${r(x + a * m)} ${r(y - b * m)}`;
    k += `<ellipse cx="${r(x - 0.5 * m)}" cy="${r(y)}" rx="${r(1.3 * m)}" ry="${r(0.22 * m)}" fill="#2a2216" opacity=".22"/>`;
    k += `<path d="M${P(-0.75, 0)} L${P(-0.75, 0.45)} L${P(-0.55, 0.45)} L${P(-0.6, 0.9)} M${P(0.75, 0)} L${P(0.75, 0.45)} L${P(0.55, 0.45)} L${P(0.6, 0.9)} M${P(0, 0)} L${P(0, 0.75)} M${P(0, 0.75)} L${P(0, 2.3)}" stroke="#3a3f3c" stroke-width="${r(0.11 * m)}" fill="none"/>`;
    k += `<ellipse cx="${r(x)}" cy="${r(y - 0.75 * m)}" rx="${r(0.5 * m)}" ry="${r(0.1 * m)}" fill="#f4f0e6"/>`;
    k += `<path d="M${P(-1.3, 1.95)} Q${P(-0.7, 2.25)} ${P(0, 2.5)} Q${P(0.7, 2.25)} ${P(1.3, 1.95)} Q${P(0, 1.85)} ${P(-1.3, 1.95)} Z" fill="${S.lg("schirm", [[0, "#fbf3dc"], [1, "#d9ccab"]], 0, 0, 1, 0)}"/><path d="M${P(-1.3, 1.95)} Q${P(0, 1.85)} ${P(1.3, 1.95)}" stroke="#b9ab88" stroke-width="${r(0.06 * m)}" fill="none"/>`;
  }
  const SU = 16.36, sx = xU(SU), sw = 300 / (81 + SU) * 0.82;
  S.teil({ id: "koenigsbau", de: "der Königsbau", syl: "KÖ-nigs-bau", it: "il Königsbau (il palazzo del re)", itSyl: "KÖ-nigs-bau", en: "Königsbau",
    x: 0, y: 0, kunst: k, tipp: "Der Königsbau hat eine 135 Meter lange Säulenhalle mit 34 Säulen, mit Läden und Cafés.",
    zoom: { x: 5, y: 97, w: 56, h: 35 },
    unter: [
      { id: "saeule", de: "die Säule", syl: "SÄU-le", it: "la colonna", itSyl: "co-LON-na", en: "column",
        x: sx, y: at(sx, 0), kunst: flaeche(-sw * 0.85, -(at(sx, 0) - at(sx, 0.52)), sw * 1.7, at(sx, 0) - at(sx, 0.52), 0.4),
        tipp: "Die Säulen des Königsbaus sind ionisch: Oben haben sie zwei Schnecken, die Voluten." },
    ] });
}

/* =====================================================================
   Lage der Dinge auf dem Platz (Bodenraster u|v, siehe oben)
   ===================================================================== */
const SAEULE = boden(90.4, 24.5), PAV = boden(54.9, 6.5);
const BRUNNEN_N = boden(135, 24.5), BRUNNEN_S = boden(45, 24.5);
const vRand = (u) => 35 + 0.3265 * (u + 4.5);            /* Platzrand vor dem Gehweg des Kunstgebäudes */
/* Strecke auf den Bildrahmen beschneiden (Liang-Barsky) */
const strecke = (a, b, X0 = 0, Y0 = 0, X1 = 320, Y1 = 200) => {
  let t0 = 0, t1 = 1; const dx = b[0] - a[0], dy = b[1] - a[1];
  for (const [p, q] of [[-dx, a[0] - X0], [dx, X1 - a[0]], [-dy, a[1] - Y0], [dy, Y1 - a[1]]]) {
    if (p === 0) { if (q < 0) return ""; continue; }
    const t = q / p; if (p < 0) { if (t > t1) return ""; if (t > t0) t0 = t; } else { if (t < t0) return ""; if (t < t1) t1 = t; }
  }
  return `M${r(a[0] + dx * t0)} ${r(a[1] + dy * t0)} L${r(a[0] + dx * t1)} ${r(a[1] + dy * t1)} `;
};
/* Ein Mensch auf dem Platz bei (u|v), 1,70 m, mit Schlagschatten */
const mensch = (name, u, v, spiegel, gross = 1.7) => {
  const [x, y] = boden(u, v), h = gross * mY(y);
  return { schatten: wurf(x, y, gross, 0.45, false, 0.22, 0.3), bild: figur(name, x, y, h, spiegel), x, y };
};

/* =====================================================================
   7 — DER SCHLOSSPLATZ (Rasen, Kieswege, Schatten, Bäume, Leute)
   ===================================================================== */
{
  let k = "";
  const RASEN = S.lg("rasen", [[0, "#93b25f"], [1, "#78994a"]]);
  const KANTE = `fill="none" stroke="#b9ad8f" stroke-width=".3"`;
  for (const [u0, u1, v0, v1] of [[-8, 80, 10, 17], [101, 172, 10, 17]]) k += bodenFlaeche(u0, u1, v0, v1, `fill="${RASEN}"`, 167);
  k += vieleck([boden(-6, 31), boden(80, 31), boden(80, vRand(80)), boden(-6, vRand(-6))], `fill="${RASEN}"`, 167);
  k += vieleck([boden(101, 31), boden(172, 31), boden(172, vRand(172)), boden(101, vRand(101))], `fill="${RASEN}"`, 167);
  /* Rasenstreifen: Mähbahnen */
  { let f = ""; for (let v = 33; v < 60; v += 4) f += strecke(boden(Math.max(8, (v - 35) / 0.3265 - 4.5), v), boden(80, v)); k += `<path d="${f}" stroke="#a9c473" stroke-width=".7" opacity=".35"/>`; }
  /* der Kreis aus hellem Kies um die Säule */
  {
    const p = [];
    for (let i = 0; i < 24; i++) { const w = i / 24 * Math.PI * 2; p.push(boden(90.4 + Math.cos(w) * 9, 24.5 + Math.sin(w) * 9)); }
    k += vieleck(p, `fill="#e6dcc8"`);
  }
  /* Schatten des Kunstgebäudes auf dem Platz (die Sonne steht hinter dem Bau) */
  {
    const fuss = (u) => { const [x, y] = kgP(u, 0); const D = 1 / ((y - HOR) / 1800); const X = (x - 160) * D / 300; return [X, D]; };
    const proj = ([X, D]) => [160 + 300 * X / D, HOR + 1800 / D];
    const L = 14 * LS, sx = -Math.sin(18 * RAD) * L, sd = Math.cos(18 * RAD) * L;
    const a = fuss(0), b = fuss(KG_UMAX);
    k += vieleck([proj(a), proj(b), proj([b[0] + sx, b[1] + sd]), proj([a[0] + sx, a[1] + sd])], `fill="#2a2216" opacity=".2"`);
  }
  /* lange Schatten: Säule, Pavillon, Brunnen */
  k += wurf(SAEULE[0], SAEULE[1], 6.6, 6, false, 0.36) + wurf(SAEULE[0], SAEULE[1], 35, 2.6, false, 0.38, 1.8);
  k += wurf(PAV[0], PAV[1], 8.6, 7, false, 0.22, 2.2);
  for (const B0 of [BRUNNEN_N, BRUNNEN_S]) k += wurf(B0[0], B0[1], 4.6, 4, false, 0.2, 1.2);
  /* Bäume vor dem Kunstgebäude (erstes Herbstlaub) */
  const BAEUME = [[95, vRand(95) + 5, 8, 6, 31], [58, vRand(58) + 5, 8.5, 6.4, 32], [24, vRand(24) + 5.5, 7, 5.4, 33]];
  for (const [u, v, h, b] of BAEUME) { const [x, y] = boden(u, v); k += wurf(x, y, h, b * 0.7, false, 0.2, b * 0.6); }
  /* Leute auf dem Platz */
  const leute = [mensch("rauf", 22, 4.5), mensch("runter", 36, 7.5, true), mensch("runter", 41, 18.5, true), mensch("rauf", 62, 27, true),
    mensch("runter", 98, 13), mensch("rauf", 118, 22), mensch("rauf", 30, vRand(30) + 3), mensch("runter", 72, vRand(72) + 2.5)];
  /* Sitzende im Gras (Schneidersitz, Knie angezogen), ein Paar auf einer Decke; weicher Schatten unter Gesäß und Füßen */
  k += vieleck([boden(20.2, 35.2), boden(23.6, 35.2), boden(23.6, 37.4), boden(20.2, 37.4)], `fill="#b8423c"`);
  { let f = ""; for (let i = 1; i < 4; i++) f += strecke(boden(20.2 + i * 0.85, 35.2), boden(20.2 + i * 0.85, 37.4)) + strecke(boden(20.2, 35.2 + i * 0.55), boden(23.6, 35.2 + i * 0.55));
    k += `<path d="${f}" stroke="#f1e6d4" stroke-width=".25" opacity=".8"/>`; }
  for (const [u, v, sp] of [[21.2, 36.1, 0], [22.6, 36.4, 1], [50, 45, 1], [66, 40, 0], [14, 13.5, 1], [42, 15, 0], [74, 54, 1], [112, 40, 0]]) {
    const p = mensch(sp ? "sitzend2" : "sitzend", u, v, sp), m = mY(p.y);
    p.schatten = `<ellipse cx="${r(p.x - 0.15 * m)}" cy="${r(p.y - 0.05 * m)}" rx="${r(0.5 * m)}" ry="${r(0.16 * m)}" fill="#2a2216" opacity=".28"/>`; leute.push(p);
  }
  for (const p of leute) k += p.schatten;
  for (const [u, v, h, b, s] of BAEUME) { const [x, y] = boden(u, v); k += baum(x, y, h, b, HERBST, s); }
  for (const p of leute) k += p.bild;
  /* Boden zwischen Treppenfuß und Rasen: fängt den Tipp in der Treppenöffnung */
  k += vieleck([boden(-14, -2), boden(10, -2), boden(10, 45), boden(-14, 45)], `fill="#d5c8b0" opacity=".001"`, 167);
  S.teil({ id: "schlossplatz", de: "der Schlossplatz", syl: "SCHLOSS-platz", it: "la piazza del castello", itSyl: "PIAZ-za del ca-STEL-lo", en: "Palace Square", x: 0, y: 0, kunst: k,
    tipp: "Der Schlossplatz ist der größte Platz in der Mitte von Stuttgart." });
}

/* =====================================================================
   8 — DIE KÖNIGSTRASSE (Fußgängerzone vor der Kolonnade des Königsbaus)
   ===================================================================== */
{
  let k = "";
  k += vieleck([boden(-30, -21.5), boden(700, -21.5), boden(700, 0), boden(-30, 0)], `fill="${S.lg("pflaster", [[0, "#cbc3b3"], [1, "#b9b0a0"]])}"`, 167);
  /* Plattenfugen: Längsfugen zum Fluchtpunkt, Querfugen alle 3 m */
  let f = "";
  for (let v = -19; v < 0; v += 2.5) f += strecke(boden(-10, v), boden(700, v), 0, 0, 320, 167);
  for (let u = 0; u < 300; u += 3) { const a = boden(u, -21.5), b = boden(u, 0); if (Math.hypot(a[0] - b[0], a[1] - b[1]) < 6 || a[1] - boden(u + 3, -21.5)[1] < 0.35) break; f += strecke(a, b, 0, 0, 320, 167); }
  k += `<path d="${f}" stroke="#9e9584" stroke-width=".18" opacity=".75"/>`;
  /* Rinne am Platzrand */
  k += `<path d="${strecke(boden(-10, -0.4), boden(700, -0.4), 0, 0, 320, 167)}" stroke="#8f8676" stroke-width=".5" opacity=".6"/>`;
  /* Straßenlaternen am Rand der Fußgängerzone */
  let lat = "", sch = "";
  for (const u of [62, 94, 126, 158]) {
    const [x, y] = boden(u, -1.6), m = mY(y), h = 4.6 * m;
    sch += wurf(x, y, 4.6, 0.16, false, 0.2);
    lat += `<path d="M${r(x - 0.11 * m)} ${r(y)} L${r(x - 0.06 * m)} ${r(y - h)} L${r(x + 0.06 * m)} ${r(y - h)} L${r(x + 0.11 * m)} ${r(y)} Z" fill="#33403a"/>`;
    lat += `<path d="M${r(x - 0.2 * m)} ${r(y - h)} L${r(x - 0.26 * m)} ${r(y - h - 0.55 * m)} L${r(x + 0.26 * m)} ${r(y - h - 0.55 * m)} L${r(x + 0.2 * m)} ${r(y - h)} Z" fill="#f3ead0" stroke="#33403a" stroke-width="${r(Math.max(0.05, 0.04 * m))}"/>`;
    lat += `<path d="M${r(x - 0.32 * m)} ${r(y - h - 0.55 * m)} L${r(x + 0.32 * m)} ${r(y - h - 0.55 * m)} L${r(x)} ${r(y - h - 0.8 * m)} Z" fill="#33403a"/>`;
  }
  /* Passanten: ein Strom in beide Richtungen */
  const ps = [["runter", 26, -9], ["rauf", 18, -15.5], ["rauf", 44, -5, true], ["runter", 52, -17], ["runter", 76, -12], ["rauf", 90, -4.5], ["rauf", 112, -16], ["runter", 140, -8, true]];
  let pa = "", ps2 = "";
  for (const [n, u, v, sp] of ps) { const [x, y] = boden(u, v); ps2 += wurf(x, y, 1.7, 0.45, false, 0.2, 0.3); pa += figur(n, x, y, 1.72 * mY(y), sp); }
  k += sch + ps2 + lat + pa;
  S.teil({ id: "koenigstrasse", de: "die Königstraße", syl: "KÖ-nigs-stra-ße", it: "la Königstraße (via dello shopping)", itSyl: "KÖ-nigs-stra-ße", en: "Königstraße (shopping street)",
    x: 0, y: 0, kunst: k, tipp: "Die Königstraße ist die lange Einkaufsstraße vom Hauptbahnhof bis zum Rotebühlplatz." });
}

/* =====================================================================
   8b — DIE LATERNE (die vorderste Straßenlaterne der Königstraße)
   ===================================================================== */
{
  const [x, y] = boden(30, -1.6), m = mY(y), h = 4.6 * m;
  const EIS = S.lg("eisenl", [[0, "#1f2925"], [0.45, "#55655d"], [0.7, "#6d7f75"], [1, "#26302c"]], 0, 0, 1, 0);
  let k = `<path d="M${r(-0.13 * m)} 0 L${r(-0.06 * m)} ${r(-h)} L${r(0.06 * m)} ${r(-h)} L${r(0.13 * m)} 0 Z" fill="${EIS}"/>`;
  k += `<path d="M${r(-0.2 * m)} 0 L${r(-0.16 * m)} ${r(-0.5 * m)} L${r(0.16 * m)} ${r(-0.5 * m)} L${r(0.2 * m)} 0 Z" fill="${EIS}"/>`;
  k += `<path d="M${r(-0.18 * m)} ${r(-h)} L${r(-0.24 * m)} ${r(-h - 0.6 * m)} L${r(0.24 * m)} ${r(-h - 0.6 * m)} L${r(0.18 * m)} ${r(-h)} Z" fill="${S.lg("lglas", [[0, "#fff8e2"], [1, "#e9dcb0"]])}" stroke="#26302c" stroke-width=".18"/>`;
  k += `<path d="M${r(-0.32 * m)} ${r(-h - 0.6 * m)} L${r(0.32 * m)} ${r(-h - 0.6 * m)} L0 ${r(-h - 0.85 * m)} Z" fill="${EIS}"/>`;
  const [sx, sy] = spitze(x, y, 4.6, false);
  k = `<path d="M${r(-0.1 * m)} 0 L${r(sx - x - 0.05 * m)} ${r(sy - y)} L${r(sx - x + 0.05 * m)} ${r(sy - y)} L${r(0.1 * m)} 0 Z" fill="#2a2216" opacity=".22"/>` + k;
  S.teil({ id: "laterne", de: "die Laterne", syl: "la-TER-ne", it: "il lampione", itSyl: "lam-PIO-ne", en: "street lamp", x, y, steht: true, kunst: k + `<rect x="-3" y="${r(-4.6 * m - 3.5)}" width="6" height="${r(4.6 * m + 4)}" fill="#fff" opacity=".001"/>`,
    tipp: "Abends leuchten die Laternen in der Königstraße." });
}

/* =====================================================================
   9 — DER MUSIKPAVILLON (Gusseisen, achteckig, maurische Bögen)
   ===================================================================== */
{
  const [cx, cy, D] = PAV;
  S.def(`<pattern id="${S.id("gitter")}" width=".7" height=".7" patternUnits="userSpaceOnUse"><path d="M0 0 L.7 .7 M.7 0 L0 .7" stroke="#3f5a4b" stroke-width=".1"/></pattern>`);
  /* Punkt am Pavillon: Winkel w (0 = zu uns), Radius R (m), Höhe z (m) */
  const P = (w, R, z) => { const X = Math.sin(w * RAD) * R, dD = -Math.cos(w * RAD) * R; return [cx + X * 300 / (D + dD), HOR + (6 - z) * 300 / (D + dD)]; };
  const Pp = (p) => `${r(p[0])} ${r(p[1])}`;
  const ecken = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => -157.5 + i * 45);       /* −157,5 … 157,5: die Ecken */
  let k = "";
  const R = 3.5, EIS = EISEN;
  /* Sockel aus Sandstein mit Stufen vorn */
  const sockel = (z, Rr) => ecken.map((w) => P(w, Rr, z));
  const s0 = sockel(0, R + 0.3), s1 = sockel(1.2, R + 0.3);
  k += `<path d="M${s1.map(Pp).join(" L")} Z" fill="#ddd2bb"/>`;
  for (let i = 0; i < 8; i++) {
    const a = ecken[i], b = ecken[(i + 1) % 8], mitte = (a + b) / 2;
    if (Math.cos(mitte * RAD) < 0.1) continue;
    const hell = Math.sin(mitte * RAD) > 0.2 ? "#d8cbb0" : Math.sin(mitte * RAD) < -0.2 ? "#b3a68c" : "#cbbfa4";
    k += `<path d="M${Pp(s0[i])} L${Pp(s0[(i + 1) % 8])} L${Pp(s1[(i + 1) % 8])} L${Pp(s1[i])} Z" fill="${hell}"/>`;
  }
  for (let j = 0; j < 3; j++) { const z0 = j * 0.4, rr = R + 0.3 + (3 - j) * 0.35; const a = P(-30, rr, z0 + 0.4), b = P(30, rr, z0 + 0.4), c = P(30, rr, z0), d = P(-30, rr, z0); k += `<path d="M${Pp(d)} L${Pp(c)} L${Pp(b)} L${Pp(a)} Z" fill="${j % 2 ? "#e6dcc6" : "#d3c7ad"}" stroke="#a89a7e" stroke-width=".1"/>`; }
  /* hintere Säulen und Bögen (durch die vorderen Bögen sichtbar) */
  const saeule = (w, dunkel) => { const a = P(w, R, 1.2), b = P(w, R, 4.6); return `<path d="M${r(a[0] - 0.25)} ${r(a[1])} L${r(b[0] - 0.2)} ${r(b[1])} L${r(b[0] + 0.2)} ${r(b[1])} L${r(a[0] + 0.25)} ${r(a[1])} Z" fill="${dunkel ? "#2c3833" : EIS}"/><path d="M${r(b[0] - 0.42)} ${r(b[1] + 0.1)} L${r(b[0] + 0.42)} ${r(b[1] + 0.1)} L${r(b[0] + 0.3)} ${r(b[1] + 0.5)} L${r(b[0] - 0.3)} ${r(b[1] + 0.5)} Z" fill="${dunkel ? "#2c3833" : "#56695f"}"/>`; };
  const bogen = (w0, w1, dunkel) => {
    const a = P(w0, R, 3.2), b = P(w1, R, 3.2), m = P((w0 + w1) / 2, R, 4.25), mm = P((w0 + w1) / 2, R, 3.9);
    const breit = (b[0] - a[0]) * 0.13;
    let g = `<path d="M${Pp(a)} C${r(a[0] - breit)} ${r(m[1] + 0.3)} ${r(m[0] - (b[0] - a[0]) * 0.32)} ${r(m[1])} ${Pp(m)} C${r(m[0] + (b[0] - a[0]) * 0.32)} ${r(m[1])} ${r(b[0] + breit)} ${r(m[1] + 0.3)} ${Pp(b)}" stroke="${dunkel ? "#2c3833" : "#5f7a6a"}" stroke-width="${dunkel ? 0.25 : 0.4}" fill="none"/>`;
    if (!dunkel) {
      const f0 = P(w0, R, 4.6), f1 = P(w1, R, 4.6);
      g = `<path d="M${Pp(f0)} L${Pp(f1)} L${Pp(b)} C${r(b[0] + breit)} ${r(m[1] + 0.3)} ${r(m[0] + (b[0] - a[0]) * 0.32)} ${r(m[1])} ${Pp(m)} C${r(m[0] - (b[0] - a[0]) * 0.32)} ${r(m[1])} ${r(a[0] - breit)} ${r(m[1] + 0.3)} ${Pp(a)} Z" fill="url(#${S.id("gitter")})"/>` + g.replace('stroke-width="0.4"', 'stroke-width=".75"');
      const o = P((w0 + w1) / 2, R, 4.85);
      g += `<circle cx="${r(o[0])}" cy="${r(o[1])}" r=".42" fill="none" stroke="#5f7a6a" stroke-width=".16"/><circle cx="${r(o[0])}" cy="${r(o[1])}" r=".14" fill="#5f7a6a"/>`;
      for (const s of [-1, 1]) { const q = P((w0 + w1) / 2 + s * 13, R, 4.8); g += `<path d="M${r(q[0] - 0.25)} ${r(q[1])} q.25 -.4 .5 0 q-.25 .3 -.5 0" stroke="#5f7a6a" stroke-width=".12" fill="none"/>`; }
      g += `<path d="M${Pp(mm)} L${r(m[0])} ${r(m[1] + 0.35)}" stroke="#5f7a6a" stroke-width=".12"/>`;
      /* Brüstung zwischen den Säulen */
      const g0 = P(w0, R, 2.1), g1 = P(w1, R, 2.1), u0 = P(w0, R, 1.3), u1 = P(w1, R, 1.3);
      g += `<path d="M${Pp(g0)} L${Pp(g1)} M${Pp(u0)} L${Pp(u1)}" stroke="#4f6158" stroke-width=".22"/>`;
      let st = ""; for (let t = 0.12; t < 0.95; t += 0.16) { const p = [g0[0] + (g1[0] - g0[0]) * t, g0[1] + (g1[1] - g0[1]) * t], q = [u0[0] + (u1[0] - u0[0]) * t, u0[1] + (u1[1] - u0[1]) * t]; st += `M${Pp(p)} L${Pp(q)} `; }
      g += `<path d="${st}" stroke="#4f6158" stroke-width=".14"/>`;
    }
    return g;
  };
  for (let i = 0; i < 8; i++) { const w = ecken[i]; if (Math.cos(w * RAD) <= 0) k += saeule(w, true); }
  for (let i = 0; i < 8; i++) { const a = ecken[i], b = ecken[(i + 1) % 8]; if (Math.cos((a + b) / 2 * RAD) <= 0 && Math.abs(b - a) < 90) k += bogen(a, b, true); }
  k += bogen(157.5, 202.5, true);
  /* der Boden im Pavillon, schattig */
  for (let i = 0; i < 8; i++) { const w = ecken[i]; if (Math.cos(w * RAD) > 0) k += saeule(w, false); }
  for (let i = 0; i < 8; i++) { const a = ecken[i], b = ecken[(i + 1) % 8]; if (Math.cos((a + b) / 2 * RAD) > 0.1 && Math.abs(b - a) < 90) k += bogen(a, b, false); }
  /* Fries und Traufe */
  const f0 = ecken.map((w) => P(w, R + 0.1, 4.6)), f1 = ecken.map((w) => P(w, R + 0.1, 5.1));
  for (let i = 0; i < 8; i++) {
    const a = ecken[i], b = ecken[(i + 1) % 8], mitte = (a + b) / 2;
    if (Math.cos(mitte * RAD) < 0.1 || Math.abs(b - a) > 90) continue;
    k += `<path d="M${Pp(f0[i])} L${Pp(f0[(i + 1) % 8])} L${Pp(f1[(i + 1) % 8])} L${Pp(f1[i])} Z" fill="${Math.sin(mitte * RAD) > 0.2 ? "#6f8a7a" : Math.sin(mitte * RAD) < -0.2 ? "#40564a" : "#587263"}"/>`;
  }
  /* Glockendach (achteckig, geschweift) mit Rippen, Laterne und Knauf */
  const E = (w) => P(w, R + 0.7, 5.1), T = P(0, 0, 7.5);
  const lw = P(-90, R + 0.7, 5.1), rw = P(90, R + 0.7, 5.1), hals = 0.65 * 300 / D;
  k += `<path d="M${Pp(lw)} C${r(lw[0] + 2.4)} ${r(lw[1] - 0.6)} ${r(T[0] - hals - 1.2)} ${r(T[1] + 3.4)} ${r(T[0] - hals)} ${r(T[1])} L${r(T[0] + hals)} ${r(T[1])} C${r(T[0] + hals + 1.2)} ${r(T[1] + 3.4)} ${r(rw[0] - 2.4)} ${r(rw[1] - 0.6)} ${Pp(rw)} L${Pp(E(45))} L${Pp(E(0))} L${Pp(E(-45))} Z" fill="${S.lg("pavdach", [[0, "#3f5a4b"], [0.5, "#6a8a77"], [0.8, "#8fae9b"], [1, "#56735f"]], 0, 0, 1, 0)}"/>`;
  for (const w of [-67.5, -22.5, 22.5, 67.5]) { const e = P(w, R + 0.7, 5.1); k += `<path d="M${Pp(e)} Q${r(e[0] + (T[0] - e[0]) * 0.75)} ${r(e[1] - 0.6)} ${r(T[0] + (e[0] - T[0]) * 0.12)} ${r(T[1])}" stroke="${w < 0 ? "#34483d" : "#a9c4b3"}" stroke-width=".22" fill="none"/>`; }
  k += `<path d="M${Pp(lw)} L${Pp(E(-45))} L${Pp(E(0))} L${Pp(E(45))} L${Pp(rw)}" stroke="#2e3d35" stroke-width=".3" fill="none"/>`;
  k += `<rect x="${r(T[0] - hals)}" y="${r(T[1] - 2.4)}" width="${r(2 * hals)}" height="2.4" fill="${EIS}"/><rect x="${r(T[0] - hals * 0.5)}" y="${r(T[1] - 1.9)}" width="${r(hals)}" height="1.3" fill="#c8d3cc" opacity=".55"/>`;
  k += `<path d="M${r(T[0] - hals - 0.5)} ${r(T[1] - 2.4)} Q${r(T[0])} ${r(T[1] - 4)} ${r(T[0] + hals + 0.5)} ${r(T[1] - 2.4)} Z" fill="#56735f"/><path d="M${r(T[0])} ${r(T[1] - 3.6)} L${r(T[0])} ${r(T[1] - 5)}" stroke="${GOLD}" stroke-width=".3"/><circle cx="${r(T[0])}" cy="${r(T[1] - 4.3)}" r=".35" fill="${GOLD}"/>`;
  S.teil({ id: "musikpavillon", de: "der Musikpavillon", syl: "mu-SIK-pa-vil-lon", it: "il padiglione della musica", itSyl: "pa-di-GLIO-ne del-la MU-si-ca", en: "bandstand",
    x: 0, y: 0, kunst: k, tipp: "Der Musikpavillon aus Gusseisen steht seit 1871 auf dem Schlossplatz." });
}

/* =====================================================================
   10 — DER BRUNNEN (zwei gusseiserne Springbrunnen von 1863, links und rechts der Säule)
   ===================================================================== */
{
  const brunnen = ([cx, cy, D]) => {
    const m = 300 / D, Y = (z) => HOR + (6 - z) * 300 / D, ell = (R, z) => [R * m, R * m * (6 - z) / D];
    const P = (x, y) => `${r(x)} ${r(y)}`;
    let g = "";
    /* Becken: Steinrand 0,5 m, Wasserspiegel */
    const [rx, ry0] = ell(4.5, 0), [, ry5] = ell(4.5, 0.5), y0 = Y(0), y5 = Y(0.5);
    g += `<path d="M${P(cx - rx, y0)} A${r(rx)} ${r(ry0)} 0 0 0 ${P(cx + rx, y0)} L${P(cx + rx, y5)} A${r(rx)} ${r(ry5)} 0 0 1 ${P(cx - rx, y5)} Z" fill="${S.lg("beckenwand", [[0, "#a49a88"], [0.6, "#cfc5b1"], [1, "#b7ad99"]], 0, 0, 1, 0)}"/>`;
    g += `<ellipse cx="${r(cx)}" cy="${r(y5)}" rx="${r(rx)}" ry="${r(ry5)}" fill="#e3dac6"/>`;
    g += `<ellipse cx="${r(cx)}" cy="${r(y5 + 0.05)}" rx="${r(rx * 0.93)}" ry="${r(ry5 * 0.86)}" fill="${S.lg("brwasser", [[0, "#9fbfcb"], [0.6, "#c9e0e6"], [1, "#7fa4b2"]])}"/>`;
    for (const f of [0.35, 0.55, 0.75]) g += `<ellipse cx="${r(cx)}" cy="${r(y5 + 0.05)}" rx="${r(rx * f)}" ry="${r(ry5 * f * 0.86)}" fill="none" stroke="#eef8fa" stroke-width=".12" opacity=".6"/>`;
    /* Kinderfiguren am Fuß, Sockel, unteres und oberes Becken */
    for (const [dx, sp] of [[-0.95, false], [0.95, true]]) g += figur("sitzt", cx + dx * m, Y(0.5) - 0.05 * m, 1.15 * m, sp);
    g += `<path d="M${P(cx - 0.42 * m, Y(0.5))} L${P(cx - 0.3 * m, Y(2.2))} L${P(cx + 0.3 * m, Y(2.2))} L${P(cx + 0.42 * m, Y(0.5))} Z" fill="${EISEN}"/>`;
    g += figur("sitzt", cx, Y(0.5) + 0.12 * m, 1.15 * m);
    const [bx, by] = ell(2, 2.4), yb = Y(2.4);
    g += `<path d="M${P(cx - bx, yb)} Q${P(cx - bx * 0.55, yb + 0.7 * m)} ${P(cx, yb + 0.75 * m)} Q${P(cx + bx * 0.55, yb + 0.7 * m)} ${P(cx + bx, yb)} Z" fill="${EISEN}"/>`;
    g += `<path d="M${P(cx - bx * 0.8, yb + 0.25 * m)} Q${P(cx, yb + 0.5 * m)} ${P(cx + bx * 0.8, yb + 0.25 * m)}" stroke="#7d9488" stroke-width="${r(0.06 * m)}" fill="none"/>`;
    g += `<ellipse cx="${r(cx)}" cy="${r(yb)}" rx="${r(bx)}" ry="${r(Math.max(by, 0.25))}" fill="#4f6158"/><ellipse cx="${r(cx)}" cy="${r(yb + 0.03)}" rx="${r(bx * 0.88)}" ry="${r(Math.max(by, 0.25) * 0.75)}" fill="#cfe5ea"/>`;
    g += `<path d="M${P(cx - 0.18 * m, yb)} L${P(cx - 0.14 * m, Y(3.9))} L${P(cx + 0.14 * m, Y(3.9))} L${P(cx + 0.18 * m, yb)} Z" fill="${EISEN}"/>`;
    const [ux, uy] = ell(0.9, 4), yu = Y(4);
    g += `<path d="M${P(cx - ux, yu)} Q${P(cx, yu + 0.55 * m)} ${P(cx + ux, yu)} Z" fill="${EISEN}"/><ellipse cx="${r(cx)}" cy="${r(yu)}" rx="${r(ux)}" ry="${r(Math.max(uy, 0.15))}" fill="#4f6158"/>`;
    g += `<path d="M${P(cx - 0.14 * m, yu)} Q${P(cx - 0.2 * m, Y(4.35))} ${P(cx, Y(4.7))} Q${P(cx + 0.2 * m, Y(4.35))} ${P(cx + 0.14 * m, yu)} Z" fill="#5f7a6a"/>`;
    /* Wasser: Fontäne, Überlauf vom oberen Becken, Schleier vom unteren Becken */
    g += `<path d="M${P(cx, Y(4.7))} Q${P(cx - 0.05 * m, Y(5.6))} ${P(cx, Y(6.5))}" stroke="#f4fbfd" stroke-width="${r(0.09 * m)}" fill="none"/>`;
    g += `<path d="M${P(cx, Y(6.5))} Q${P(cx - 0.35 * m, Y(6.2))} ${P(cx - 0.6 * m, Y(5.2))} M${P(cx, Y(6.5))} Q${P(cx + 0.35 * m, Y(6.2))} ${P(cx + 0.6 * m, Y(5.2))}" stroke="#eaf6f9" stroke-width="${r(0.04 * m)}" fill="none" opacity=".8"/>`;
    g += `<path d="M${P(cx - ux, yu)} Q${P(cx - ux - 0.35 * m, Y(3.6))} ${P(cx - ux - 0.4 * m, yb)} M${P(cx + ux, yu)} Q${P(cx + ux + 0.35 * m, Y(3.6))} ${P(cx + ux + 0.4 * m, yb)}" stroke="#eaf6f9" stroke-width="${r(0.07 * m)}" fill="none" opacity=".85"/>`;
    g += `<path d="M${P(cx - bx, yb)} Q${P(cx - bx - 0.5 * m, Y(1.6))} ${P(cx - bx - 0.6 * m, Y(0.5))} L${P(cx - bx + 0.5 * m, Y(0.5) + 0.3)} Q${P(cx - bx + 0.1 * m, Y(1.6))} ${P(cx - bx + 0.2 * m, yb + 0.2 * m)} Z" fill="#eef7fa" opacity=".55"/>`;
    g += `<path d="M${P(cx + bx, yb)} Q${P(cx + bx + 0.5 * m, Y(1.6))} ${P(cx + bx + 0.6 * m, Y(0.5))} L${P(cx + bx - 0.5 * m, Y(0.5) + 0.3)} Q${P(cx + bx - 0.1 * m, Y(1.6))} ${P(cx + bx - 0.2 * m, yb + 0.2 * m)} Z" fill="#eef7fa" opacity=".55"/>`;
    g += `<path d="M${P(cx - bx * 0.6, yb + 0.6 * m)} Q${P(cx, yb + 1.0 * m)} ${P(cx + bx * 0.6, yb + 0.6 * m)} L${P(cx + bx * 0.7, Y(0.6))} Q${P(cx, Y(0.6) + 0.5)} ${P(cx - bx * 0.7, Y(0.6))} Z" fill="#f2fafc" opacity=".35"/>`;
    for (let i = 0; i < 6; i++) { const x = cx + (-0.8 + i * 0.32) * bx; g += `<path d="M${P(x, yb + 0.5 * m)} L${P(x + (x - cx) * 0.18, Y(0.6))}" stroke="#ffffff" stroke-width="${r(0.025 * m)}" opacity=".7"/>`; }
    return g;
  };
  S.teil({ id: "brunnen", de: "der Brunnen", syl: "BRUN-nen", it: "la fontana", itSyl: "fon-TA-na", en: "fountain",
    x: 0, y: 0, kunst: brunnen(BRUNNEN_N) + brunnen(BRUNNEN_S), tipp: "Die zwei Brunnen aus Gusseisen sind von 1863. Die Kinderfiguren stehen für die Flüsse Württembergs." });
}

/* =====================================================================
   11 — DIE JUBILÄUMSSÄULE mit der Concordia
   ===================================================================== */
{
  const [cx, cy, D] = SAEULE, m = 300 / D, Y = (z) => r(cy - z * m), X = (dx) => r(cx + dx * m);
  let k = "";
  const GRANIT = S.lg("granit", [[0, "#7f7673"], [0.35, "#b4aaa4"], [0.62, "#ddd5ce"], [0.7, "#f3eee8"], [0.78, "#d2c9c1"], [1, "#8d8480"]], 0, 0, 1, 0);
  const SOCKEL = S.lg("sockelst", [[0, "#cfc6b6"], [0.5, "#e7e0d2"], [1, "#d9d0c0"]], 0, 0, 1, 0);
  /* drei Stufen */
  for (const [z0, b] of [[0, 4.6], [0.4, 4.2], [0.8, 3.8]]) k += `<path d="M${X(-b)} ${Y(z0)} L${X(b)} ${Y(z0)} L${X(b)} ${Y(z0 + 0.4)} L${X(-b)} ${Y(z0 + 0.4)} Z" fill="${SOCKEL}"/><path d="M${X(-b)} ${Y(z0 + 0.4)} L${X(b)} ${Y(z0 + 0.4)}" stroke="#f6f1e6" stroke-width=".25"/><path d="M${X(-b)} ${Y(z0)} L${X(b)} ${Y(z0)}" stroke="#9c9384" stroke-width=".15"/>`;
  /* hintere Eckfiguren (halb verdeckt), Sockel mit Seitenfläche, Bronzerelief, Gesims */
  k += figur("sitzt", cx - 2.6 * m, cy - 1.55 * m, 2.3 * m) + figur("sitzt", cx + 2.6 * m, cy - 1.55 * m, 2.3 * m, true);
  k += `<path d="M${X(-3.3)} ${Y(1.2)} L${X(-3.3)} ${Y(1.8)} L${X(3.3)} ${Y(1.8)} L${X(3.3)} ${Y(1.2)} Z" fill="#d6cdbd"/>`;
  k += `<path d="M${X(-3.45)} ${Y(1.8)} L${X(-3.45)} ${Y(6)} L${X(-3)} ${Y(6.05)} L${X(-3)} ${Y(1.8)} Z" fill="#a99f8e"/>`;
  k += `<path d="M${X(-3)} ${Y(1.8)} L${X(-3)} ${Y(6)} L${X(3)} ${Y(6)} L${X(3)} ${Y(1.8)} Z" fill="${SOCKEL}"/>`;
  k += `<path d="M${X(-2.3)} ${Y(2.3)} L${X(-2.3)} ${Y(5.4)} L${X(2.3)} ${Y(5.4)} L${X(2.3)} ${Y(2.3)} Z" fill="${S.lg("relief", [[0, "#3e5a4a"], [0.5, "#5d7d69"], [1, "#46624f"]], 0, 0, 1, 0)}" stroke="#2f4438" stroke-width=".25"/>`;
  {
    /* Relief: Huldigung — in der Mitte der König auf dem Thron, von beiden Seiten treten Gestalten heran */
    let rf = "";
    const z0 = 2.55, P2 = (x, z) => `${X(x)} ${Y(z)}`;
    const steht = (x, d, art) => {
      /* Gewandfigur im Relief: helle Oberkante, dunkle Unterkante, Falten, Kopf im Profil */
      const bk = art === "knie" ? 0.55 : 0, vor = art === "geht" ? 0.12 : 0;
      const kont = `M${P2(x - 0.18 - vor, z0)} Q${P2(x - 0.22, z0 + 0.7 - bk)} ${P2(x - 0.12, z0 + 1.42 - bk)} L${P2(x + 0.12, z0 + 1.42 - bk)} Q${P2(x + 0.22, z0 + 0.7 - bk)} ${P2(x + 0.18 + vor, z0)} Z`;
      let g = `<path d="${kont}" fill="#3a5446" transform="translate(${r(0.05 * m)} ${r(0.05 * m)})"/><path d="${kont}" fill="#8aa995" stroke="#bcd7c4" stroke-width="${r(0.03 * m)}"/>`;
      g += `<path d="M${P2(x - 0.05, z0 + 0.1)} Q${P2(x - 0.08, z0 + 0.7 - bk)} ${P2(x - 0.02, z0 + 1.2 - bk)} M${P2(x + 0.07, z0 + 0.1)} Q${P2(x + 0.09, z0 + 0.6 - bk)} ${P2(x + 0.05, z0 + 1.1 - bk)}" stroke="#5f7d69" stroke-width="${r(0.025 * m)}" fill="none"/>`;
      const kx = x + d * 0.03, ky = z0 + 1.58 - bk;
      g += `<path d="M${P2(kx - 0.1, ky - 0.1)} Q${P2(kx - 0.13, ky + 0.12)} ${P2(kx, ky + 0.14)} Q${P2(kx + d * 0.11, ky + 0.1)} ${P2(kx + d * 0.12, ky)} L${P2(kx + d * 0.16, ky - 0.03)} L${P2(kx + d * 0.1, ky - 0.08)} Q${P2(kx + d * 0.06, ky - 0.15)} ${P2(kx - 0.1, ky - 0.1)} Z" fill="#8aa995" stroke="#bcd7c4" stroke-width="${r(0.025 * m)}"/>`;
      if (art === "arm") g += `<path d="M${P2(x + d * 0.06, z0 + 1.3)} L${P2(x + d * 0.34, z0 + 1.85)}" stroke="#8aa995" stroke-width="${r(0.08 * m)}" stroke-linecap="round"/><circle cx="${X(x + d * 0.38)}" cy="${Y(z0 + 1.95)}" r="${r(0.09 * m)}" fill="none" stroke="#c9b36a" stroke-width="${r(0.035 * m)}"/>`;
      else if (art === "stab") g += `<path d="M${P2(x + d * 0.22, z0)} L${P2(x + d * 0.26, z0 + 1.7)}" stroke="#a9c4b2" stroke-width="${r(0.035 * m)}"/><path d="M${P2(x + d * 0.06, z0 + 1.2)} L${P2(x + d * 0.22, z0 + 1.15)}" stroke="#8aa995" stroke-width="${r(0.07 * m)}" stroke-linecap="round"/>`;
      else if (art === "knie") g += `<path d="M${P2(x + d * 0.05, z0 + 0.75)} L${P2(x + d * 0.3, z0 + 0.95)}" stroke="#8aa995" stroke-width="${r(0.07 * m)}" stroke-linecap="round"/>`;
      else g += `<path d="M${P2(x + d * 0.06, z0 + 1.25)} Q${P2(x + d * 0.2, z0 + 1.0)} ${P2(x + d * 0.3, z0 + 1.15)}" stroke="#8aa995" stroke-width="${r(0.07 * m)}" fill="none" stroke-linecap="round"/>`;
      return g;
    };
    rf += `<path d="M${P2(-0.34, z0)} L${P2(-0.34, z0 + 1.55)} L${P2(0.34, z0 + 1.55)} L${P2(0.34, z0)} Z" fill="#6f8f7b"/>`;
    rf += `<path d="M${P2(-0.2, z0 + 0.62)} L${P2(-0.18, z0 + 1.3)} L${P2(0.18, z0 + 1.3)} L${P2(0.22, z0 + 0.62)} L${P2(0.42, z0 + 0.6)} L${P2(0.42, z0)} L${P2(0.28, z0)} L${P2(0.28, z0 + 0.42)} L${P2(-0.2, z0 + 0.45)} Z" fill="#9dbca8"/><circle cx="${X(0)}" cy="${Y(z0 + 1.48)}" r="${r(0.13 * m)}" fill="#9dbca8"/><path d="M${P2(-0.1, z0 + 1.62)} L${P2(-0.07, z0 + 1.72)} L${P2(0, z0 + 1.65)} L${P2(0.07, z0 + 1.72)} L${P2(0.1, z0 + 1.62)} Z" fill="#c9b36a"/>`;
    for (const [x, d, a] of [[-1.95, 1, "geht"], [-1.4, 1, "stab"], [-0.82, 1, "knie"], [0.85, -1, "arm"], [1.4, -1, "geht"], [1.95, -1, "stab"]]) rf += steht(x, d, a);
    rf += `<path d="M${P2(-2.2, z0 - 0.08)} L${P2(2.2, z0 - 0.08)}" stroke="#9cbba7" stroke-width="${r(0.06 * m)}"/>`;
    rf += `<path d="M${P2(-2.2, 5.25)} L${P2(2.2, 5.25)}" stroke="#9cbba7" stroke-width="${r(0.05 * m)}" stroke-dasharray="${r(0.08 * m)} ${r(0.06 * m)}"/>`;
    k += rf;
  }
  k += `<path d="M${X(-3.5)} ${Y(6)} L${X(3.4)} ${Y(6)} L${X(3.6)} ${Y(6.6)} L${X(-3.6)} ${Y(6.6)} Z" fill="#efe9dc"/><path d="M${X(-3.4)} ${Y(6)} L${X(3.4)} ${Y(6)}" stroke="#a99f8e" stroke-width=".25"/>`;
  /* vordere Eckfiguren auf ihren Blöcken */
  for (const s of [-1, 1]) k += `<path d="M${X(s * 3.1 - 0.75)} ${Y(1.2)} L${X(s * 3.1 - 0.75)} ${Y(1.75)} L${X(s * 3.1 + 0.75)} ${Y(1.75)} L${X(s * 3.1 + 0.75)} ${Y(1.2)} Z" fill="#ddd5c6"/>`;
  k += figur("sitzt", cx - 3.1 * m, cy - 1.75 * m, 2.4 * m) + figur("sitzt", cx + 3.1 * m, cy - 1.75 * m, 2.4 * m, true);
  /* Basis (attisch), Schaft aus poliertem Granit mit leichter Schwellung, Kapitell, Abakus */
  k += `<path d="M${X(-1.65)} ${Y(6.6)} L${X(1.65)} ${Y(6.6)} L${X(1.65)} ${Y(6.95)} L${X(-1.65)} ${Y(6.95)} Z" fill="#e3dccf"/>`;
  k += `<path d="M${X(-1.5)} ${Y(6.95)} Q${X(-1.62)} ${Y(7.12)} ${X(-1.48)} ${Y(7.3)} L${X(1.48)} ${Y(7.3)} Q${X(1.62)} ${Y(7.12)} ${X(1.5)} ${Y(6.95)} Z" fill="${GRANIT}"/>`;
  k += `<path d="M${X(-1.3)} ${Y(7.3)} L${X(-1.22)} ${Y(7.45)} L${X(1.22)} ${Y(7.45)} L${X(1.3)} ${Y(7.3)} Z" fill="#6f6764"/>`;
  k += `<path d="M${X(-1.32)} ${Y(7.45)} Q${X(-1.42)} ${Y(7.6)} ${X(-1.3)} ${Y(7.75)} L${X(1.3)} ${Y(7.75)} Q${X(1.42)} ${Y(7.6)} ${X(1.32)} ${Y(7.45)} Z" fill="${GRANIT}"/>`;
  k += `<path d="M${X(-1.1)} ${Y(7.75)} C${X(-1.17)} ${Y(13)} ${X(-1.12)} ${Y(20)} ${X(-0.95)} ${Y(27)} L${X(0.95)} ${Y(27)} C${X(1.12)} ${Y(20)} ${X(1.17)} ${Y(13)} ${X(1.1)} ${Y(7.75)} Z" fill="${GRANIT}"/>`;
  k += `<path d="M${X(0.42)} ${Y(8)} C${X(0.46)} ${Y(14)} ${X(0.44)} ${Y(21)} ${X(0.36)} ${Y(26.8)}" stroke="#fffaf4" stroke-width="${r(0.08 * m)}" fill="none" opacity=".85"/>`;
  k += `<path d="M${X(-0.7)} ${Y(8)} C${X(-0.74)} ${Y(14)} ${X(-0.72)} ${Y(21)} ${X(-0.6)} ${Y(26.8)}" stroke="#5e5653" stroke-width="${r(0.05 * m)}" fill="none" opacity=".5"/>`;
  k += `<path d="M${X(-1)} ${Y(27)} L${X(1)} ${Y(27)} L${X(1)} ${Y(27.25)} L${X(-1)} ${Y(27.25)} Z" fill="${BRONZE}"/>`;
  k += `<path d="M${X(-0.98)} ${Y(27.25)} Q${X(-1.15)} ${Y(27.9)} ${X(-1.35)} ${Y(28.35)} L${X(1.35)} ${Y(28.35)} Q${X(1.15)} ${Y(27.9)} ${X(0.98)} ${Y(27.25)} Z" fill="${BRONZE}"/>`;
  for (const s of [-1, 1]) k += `<path d="M${X(s * 1.25)} ${Y(28.25)} q${r(s * 0.32 * m)} ${r(0.05 * m)} ${r(s * 0.3 * m)} ${r(0.3 * m)} q${r(-s * 0.06 * m)} ${r(0.2 * m)} ${r(-s * 0.24 * m)} ${r(0.1 * m)} q${r(-s * 0.1 * m)} ${r(-0.12 * m)} ${r(s * 0.02 * m)} ${r(-0.2 * m)}" stroke="#a3c2ad" stroke-width="${r(0.07 * m)}" fill="none"/>`;
  k += `<path d="M${X(-1.6)} ${Y(28.35)} L${X(1.6)} ${Y(28.35)} L${X(1.6)} ${Y(28.8)} L${X(-1.6)} ${Y(28.8)} Z" fill="${BRONZE}"/><path d="M${X(-1.6)} ${Y(28.8)} L${X(1.6)} ${Y(28.8)}" stroke="#a9c8b3" stroke-width=".15"/>`;
  k += `<path d="M${X(-0.95)} ${Y(28.8)} L${X(-0.85)} ${Y(29.75)} L${X(0.85)} ${Y(29.75)} L${X(0.95)} ${Y(28.8)} Z" fill="${S.lg("plinthe", [[0, "#3f5848"], [0.65, "#87a891"], [1, "#4f6a58"]], 0, 0, 1, 0)}"/>`;
  /* Concordia: Gewandfigur aus Bronze im Kontrapost, die Rechte hebt den Kranz */
  const H = 5 * m, fy = cy - 29.75 * m, kz = H / 166;
  k += figur("concordia", cx, fy, H);
  {
    const hx = cx + FIG.concordia.handR.x * kz, hy = fy + FIG.concordia.handR.y * kz;
    /* Mantel (Himation) über der linken Schulter, um die Hüften geschlungen; Falten, Glanzkanten */
    const MANTEL = S.lg("mantel", [[0, "#3e5a48"], [0.45, "#6f927b"], [0.75, "#9fc0a8"], [1, "#55735f"]], 0, 0, 1, 0);
    k += `<g transform="translate(${r(cx)} ${r(fy)}) scale(${r(H)})"><path d="M.085 -.8 C.05 -.72 -.05 -.63 -.112 -.53 C-.122 -.48 -.104 -.445 -.06 -.45 C.02 -.468 .075 -.5 .105 -.52 C.124 -.4 .13 -.26 .118 -.12 C.1 -.105 .085 -.12 .078 -.15 C.08 -.3 .074 -.44 .058 -.55 C.05 -.63 .068 -.72 .104 -.79 Z" fill="${MANTEL}" stroke="#2f4638" stroke-width=".006"/>`
      + `<path d="M.06 -.74 C.02 -.66 -.04 -.6 -.09 -.52 M.04 -.68 C0 -.6 -.05 -.55 -.075 -.49 M.09 -.48 C.1 -.36 .104 -.24 .098 -.14 M.075 -.47 C.085 -.37 .088 -.27 .085 -.16" stroke="#2c4236" stroke-width=".007" fill="none" opacity=".8"/>`
      + `<path d="M.07 -.77 C.035 -.69 -.03 -.62 -.08 -.55 M.112 -.47 C.122 -.36 .124 -.25 .114 -.14" stroke="#c6e2cf" stroke-width=".006" fill="none" opacity=".8"/>`
      + `<path d="M-.03 -.44 Q-.045 -.25 -.07 -.03 M.005 -.44 Q.012 -.24 0 -.03 M.04 -.43 Q.05 -.25 .045 -.04 M-.065 -.41 Q-.085 -.22 -.1 -.04" stroke="#2c4236" stroke-width=".008" fill="none" opacity=".75"/>`
      + `<path d="M-.015 -.43 Q-.025 -.24 -.04 -.04 M.022 -.43 Q.03 -.24 .024 -.04" stroke="#b9d8c3" stroke-width=".006" fill="none" opacity=".7"/></g>`;
    /* Haar: gescheitelt, Wellen, Knoten am Hinterkopf, Stirnband */
    const kp = FIG.concordia.kopf;
    k += `<g transform="translate(${r(cx + kp.x * kz)} ${r(fy + kp.y * kz)}) scale(${(kz).toFixed(4)})"><path d="M-10.5 -1 Q-12.5 -12 0 -13.4 Q12.5 -12 10.5 -1 Q8.5 -7.5 0 -8.6 Q-8.5 -7.5 -10.5 -1 Z" fill="#4d6b58"/><path d="M-10.5 -1 Q-12 7 -8.5 13 L-6 11 Q-8.6 5 -8.4 -1.5 Z M10.5 -1 Q12 7 8.5 13 L6 11 Q8.6 5 8.4 -1.5 Z" fill="#46624f"/><circle cx="1.5" cy="-14.5" r="4.6" fill="#5f7f69"/><path d="M-9 -6 Q-5 -11 0 -9.5 M9 -6 Q5 -11 0 -9.5 M-7 -3 Q-4 -7 -1 -6.5 M7 -3 Q4 -7 1 -6.5" stroke="#2f4638" stroke-width="1" fill="none"/><path d="M-10 -8 Q0 -14 10 -8" stroke="#a9c9b3" stroke-width="1.6" fill="none"/></g>`;
    /* der Lorbeerkranz in der erhobenen Hand */
    const kr = 0.065 * H, kx = hx, ky = hy - kr * 0.9;
    k += `<circle cx="${r(kx)}" cy="${r(ky)}" r="${r(kr)}" fill="none" stroke="#4f6d48" stroke-width="${r(kr * 0.3)}"/>`;
    let bl = "";
    for (let i = 0; i < 14; i++) { const w = i / 14 * Math.PI * 2, px = kx + Math.cos(w) * kr, py = ky + Math.sin(w) * kr, rot = w * 180 / Math.PI + 60 + (i % 2) * 50; bl += `<ellipse cx="${r(px)}" cy="${r(py)}" rx="${r(kr * 0.3)}" ry="${r(kr * 0.13)}" transform="rotate(${Math.round(rot)} ${r(px)} ${r(py)})" fill="${i % 3 ? "#8fb27c" : "#b7d3a0"}"/>`; }
    k += bl;
    S.teil({ id: "jubilaeumssaeule", de: "die Jubiläumssäule", syl: "ju-bi-LÄ-ums-säu-le", it: "la Colonna del Giubileo", itSyl: "co-LON-na del giu-bi-LE-o", en: "Jubilee Column",
      x: 0, y: 0, kunst: k, tipp: "Die Säule wurde zum 25. Regierungsjubiläum von König Wilhelm I. gebaut.",
      zoom: { x: cx - 12, y: fy - 13.6, w: 24, h: 15 },
      unter: [
        { id: "statue", de: "die Statue", syl: "STA-tu-e", it: "la statua", itSyl: "STA-tua", en: "statue",
          x: cx, y: fy, kunst: flaeche(-3.2, -12.6, 5.6, 12.8, 0.4), tipp: "Oben steht Concordia, die römische Göttin der Eintracht, mit einem Kranz in der Hand." },
      ] });
  }
}

/* =====================================================================
   13 — DAS MUSEUM, DIE FREITREPPE, DAS GELÄNDER
   Auge 1,7 m über der Terrasse; die Kante liegt 7 m vor uns (y ≈ 185). Die breite Sitz- und
   Gehtreppe (Tritt 0,9 m, Steigung 0,148 m, 29 Stufen) führt 4,3 m hinab zur Königstraße
   (≈ 33 m vor uns, y ≈ 166). Weil die Tritte tief sind, sieht man von jeder Stufe den hinteren
   Streifen; die Handläufe fallen nach hinten zur Mitte hin ab. Rechts endet die Treppe an
   einer Wange (X = +14 m) mit Glasbrüstung; dahinter steht auf dem Kleinen Schlossplatz der
   Glaswürfel des Kunstmuseums (nur seine linke Kante ist im Bild).
   ===================================================================== */
const TE = 1.7, KD = 7, TT = 0.9, TS = 0.148, NST = 29, WANGE = 14;
const KANTE = HOR + TE * 300 / KD;
const kanteY = (i) => HOR + (TE + TS * i) * 300 / (KD + TT * i);
const stufeZ = (d) => -TS * Math.max(0, Math.min(NST, Math.ceil((d - KD) / TT - 1e-6)));
const T3 = (X, d, z) => [160 + X * 300 / d, HOR + (TE - z) * 300 / d];
const P2 = (p) => `${r(p[0])} ${r(p[1])}`;
{
  /* DAS MUSEUM: die Westseite des Würfels (X = 16 m), Glas mit Pfosten, dahinter der helle Steinkern */
  const X = WANGE + 2, d0 = X * 300 / 152, d1 = X * 300 / 160;
  const a = T3(X, d0, 0), b = T3(X, d1, 0);
  let k = `<path d="M312 0 L320 0 L320 ${r(b[1])} L312 ${r(a[1])} Z" fill="${S.lg("museumglas", [[0, "#5f86b0"], [0.45, "#9cbbd6"], [0.75, "#d9e4ea"], [1, "#b9c7cc"]])}"/>`;
  k += `<path d="M313.6 ${r(a[1] - 30)} L320 ${r(b[1] - 31)} L320 ${r(b[1])} L313.6 ${r(a[1] + 0.2)} Z" fill="#e9e2d2" opacity=".55"/>`;
  /* verschwommene Spiegelung des Kunstgebäudes (Gesims, Dach, Kuppel), an den Pfosten versetzt */
  k += `<g opacity=".5" filter="url(#${S.id("dunst")})"><path d="M312 68 L316 66 L316 100 L312 102 Z M316 63 L320 61 L320 97 L316 99 Z" fill="#b39d78"/><path d="M312 68 L316 66 M316 63 L320 61" stroke="#efe3c4" stroke-width=".8"/><path d="M312 64 L316 62 L316 66 L312 68 Z M316 59 L320 57 L320 61 L316 63 Z" fill="#8e4f3c"/><path d="M313 50 Q315.5 44 318 50 Z" fill="#7fa88f"/></g>`;
  let f = "";
  for (let z = 3.6; z < 40; z += 3.6) { const p = T3(X, d0, z), q = T3(X, d1, z); if (p[1] < 0) break; f += `M312 ${r(p[1])} L320 ${r(q[1])} `; }
  f += `M316 0 L316 ${r((a[1] + b[1]) / 2)} `;
  k += `<path d="${f}" stroke="#4d5a63" stroke-width=".35"/><path d="M312 0 L312 ${r(a[1])}" stroke="#39444b" stroke-width=".9"/>`;
  k += `<path d="M313 10 L319.5 4 M313 40 L319.5 30 M313.2 70 L319.5 62" stroke="#ffffff" stroke-width=".7" opacity=".35"/>`;
  /* rechte Wange (Mauer zur Treppe hin) und die Fläche des Kleinen Schlossplatzes unter dem Museum */
  { const w0 = WANGE * 300 / 160, w1 = KD + TT * NST;
  const wt0 = T3(WANGE, w0, 0), wt1 = T3(WANGE, w1, 0), wb0 = T3(WANGE, w0, stufeZ(w0)), wb1 = T3(WANGE, w1, -TS * NST);
  k += `<path d="M${P2(wt0)} L${P2(wt1)} L${P2(wb1)} L${P2(wb0)} Z" fill="${S.lg("wange3", [[0, "#cbbf9f"], [1, "#e2d7bc"]], 0, 0, 1, 0)}"/>`;
  let fu = ""; for (let z = -0.5; z > -4.3; z -= 0.55) { const p = T3(WANGE, w0, z), q = T3(WANGE, w1, z); fu += strecke(p, q, 0, 0, 320, 200); }
  k += `<path d="${fu}" stroke="#ab9f84" stroke-width=".2"/>`;
  k += `<path d="M${P2(wt0)} L${P2(wt1)} L${P2(T3(WANGE + 2, w1, 0))} L312 ${r(T3(WANGE + 2, (WANGE + 2) * 300 / 152, 0)[1])} L320 ${r(T3(WANGE + 2, (WANGE + 2) * 300 / 160, 0)[1])} Z" fill="#ddd5c5"/>`; }
  S.teil({ id: "museum", de: "das Museum", syl: "mu-SE-um", it: "il museo", itSyl: "mu-SE-o", en: "museum", x: 0, y: 0, kunst: k,
    tipp: "Das Kunstmuseum ist ein Würfel aus Glas – innen ist ein Kern aus Stein." });
}
{
  S.def(`<clipPath id="${S.id("ueberkante")}"><rect x="0" y="0" width="320" height="${r(KANTE)}"/></clipPath>`);
  let k = "";
  /* Treppe: Grundfläche, dann jede sichtbare Kante (Licht oben, Fuge darunter) */
  k += `<path d="M0 ${r(kanteY(NST))} L320 ${r(kanteY(NST))} L320 ${r(KANTE)} L0 ${r(KANTE)} Z" fill="${S.lg("stufen", [[0, "#cfc6b4"], [1, "#e2dacb"]])}"/>`;
  let dk = "", hl = "";
  for (let i = 1; i <= NST; i++) {
    const y = kanteY(i), gap = kanteY(i - 1) - y;
    dk += `M0 ${r(y)} L320 ${r(y)} `;
    if (gap > 0.5) hl += `M0 ${r(y + Math.min(0.5, gap * 0.25))} L320 ${r(y + Math.min(0.5, gap * 0.25))} `;
  }
  k += `<path d="${dk}" stroke="#8d8474" stroke-width=".22"/><path d="${hl}" stroke="#f6f1e6" stroke-width=".35"/>`;
  /* Terrasse vor der Kante (Kleiner Schlossplatz), Platten in Flucht */
  k += `<path d="M0 ${r(KANTE)} L320 ${r(KANTE)} L320 200 L0 200 Z" fill="${S.lg("terrasse", [[0, "#d6cfc2"], [1, "#e6dfd2"]])}"/>`;
  let pf = "";
  for (let X = -8.4; X <= 8.4; X += 1.2) pf += strecke(T3(X, KD, 0), T3(X, 4.2, 0), 0, KANTE, 320, 200);
  for (const d of [5.6, 6.2]) if (T3(0, d, 0)[1] < 200) pf += `M0 ${r(T3(0, d, 0)[1])} L320 ${r(T3(0, d, 0)[1])} `;
  k += `<path d="${pf}" stroke="#aba393" stroke-width=".3" opacity=".7"/>`;
  k += `<path d="M0 ${r(KANTE)} L320 ${r(KANTE)}" stroke="#f8f4ec" stroke-width=".7"/><path d="M0 ${r(KANTE + 0.6)} L320 ${r(KANTE + 0.6)}" stroke="#7d7a74" stroke-width=".35"/>`;
  /* Menschen auf der Treppe (sie stehen tiefer als wir) */
  /* Leute sitzen auf der Sitztreppe (von hinten gesehen) */
  /* Gesäß auf dem Tritt, die Füße eine Stufe tiefer (von hinten vom Rumpf verdeckt); Schattenkeil nach vorn links */
  for (const [d, X, sp] of [[20.4, -7, 1], [13.4, -6.4, 0], [24, 1.2, 0], [21.3, 8.4, 1]]) {
    const z = stufeZ(d) + 0.02, p = T3(X, d, z), m = 300 / d;
    k += `<path d="M${r(p[0] - 0.3 * m)} ${r(p[1])} L${r(p[0] - 0.75 * m)} ${r(p[1] - 0.22 * m)} L${r(p[0] + 0.05 * m)} ${r(p[1] - 0.25 * m)} L${r(p[0] + 0.3 * m)} ${r(p[1])} Z" fill="#2a2216" opacity=".22"/>`;
    k += figur(sp ? "sitzend2" : "sitzend", p[0], p[1], 1.7 * m, sp);
  }
  for (const [n, d, X, h] of [["runter", 14, -1.5, 1.72], ["rauf", 18, 2, 1.68]]) { const z = stufeZ(d), p = T3(X, d, z); k += figur(n, p[0], p[1], h * 300 / d); }
  S.teil({ id: "treppe", de: "die Freitreppe", syl: "FREI-trep-pe", it: "la scalinata", itSyl: "sca-li-NA-ta", en: "outdoor staircase", x: 0, y: 0, kunst: k,
    tipp: "Über die breite Freitreppe geht man vom Kleinen Schlossplatz hinunter zur Königstraße." });
}
{
  /* DAS GELÄNDER: zwei Handläufe auf der Treppe und die Glasbrüstung auf der Wange */
  let k = "";
  const ROHR = S.lg("rohr", [[0, "#ffffff"], [0.45, "#d9dfe3"], [1, "#7f8a92"]]);
  for (const X of [-5, 6.5]) {
    const d1 = KD + TT * NST + 0.4, a = T3(X, KD, 0.9), b = T3(X, d1, -TS * NST + 0.9);
    let po = "";
    for (let d = KD; d < d1; d += 2.7) { const t = (d - KD) / (d1 - KD), z = 0.9 + (-TS * NST) * t; const p = T3(X, d, z), q = T3(X, d, z - 0.9); if (p[0] < 0 || p[0] > 320) continue; po += `M${P2(p)} L${P2(q)} `; }
    k += `<path d="${po}" stroke="#8d969c" stroke-width=".55"/>`;
    k += `<path d="${strecke(a, b)}" stroke="#5f686e" stroke-width="1.3" stroke-linecap="round" transform="translate(0 .35)" opacity=".5"/><path d="${strecke(a, b)}" stroke="${ROHR}" stroke-width="1.05" stroke-linecap="round"/>`;
    const e = T3(X, d1 + 0.3, -TS * NST + 0.3);
    k += `<path d="M${P2(b)} Q${r(e[0])} ${r(b[1])} ${P2(e)}" stroke="#c9d0d4" stroke-width=".6" fill="none"/>`;
  }
  /* Glasbrüstung auf der Wange */
  const w0 = WANGE * 300 / 160, w1 = KD + TT * NST;
  const g0 = T3(WANGE, w0, 0), g1 = T3(WANGE, w1, 0), h0 = T3(WANGE, w0, 1), h1 = T3(WANGE, w1, 1);
  k += `<path d="M${P2(g0)} L${P2(g1)} L${P2(h1)} L${P2(h0)} Z" fill="${S.lg("glas", [[0, "#e9f6f9", 0.3], [1, "#bcd7e2", 0.18]])}"/>`;
  let ps = ""; for (let d = w0 + 0.3; d < w1; d += 1.5) { const p = T3(WANGE, d, 0), q = T3(WANGE, d, 1); ps += `M${P2(p)} L${P2(q)} `; }
  k += `<path d="${ps}" stroke="#9aa3aa" stroke-width=".5"/><path d="M${P2(h0)} L${P2(h1)}" stroke="${ROHR}" stroke-width=".9" stroke-linecap="round"/>`;
  S.teil({ id: "gelaender", de: "das Geländer", syl: "ge-LÄN-der", it: "la ringhiera", itSyl: "rin-GHIE-ra", en: "railing", x: 0, y: 0, kunst: k,
    tipp: "Am Geländer kann man sich auf der Treppe festhalten." });
}

/* =====================================================================
   15 — DIE TAUBE (zwei Tauben auf der Terrasse, ≈ 7 m vor uns)
   ===================================================================== */
{
  const taube = (x, y, s, sp, pickt) => {
    const X = (v) => r(x + v * s * sp), Y = (v) => r(y + v * s);
    const [tx0, ty0] = spitze(128 + x, 194 + y, 0.25, true), tx = tx0 - 128, ty = ty0 - 194;
    let g = "";
    g += `<ellipse cx="${x}" cy="${Y(0.15)}" rx="${r(3 * s)}" ry="${r(0.45 * s)}" fill="#2a2216" opacity=".22"/>`;
    const kopf = pickt ? [2.9, -1.4] : [2.3, -3.6];
    g += `<path d="M${X(-1.6)} ${Y(-1.55)} L${X(-4.7)} ${Y(-1.35)} L${X(-4.7)} ${Y(-0.3)} L${X(-1.6)} ${Y(-0.75)} Z" fill="#8e959f"/><path d="M${X(-4.15)} ${Y(-1.38)} L${X(-4.7)} ${Y(-1.35)} L${X(-4.7)} ${Y(-0.3)} L${X(-4.15)} ${Y(-0.38)} Z" fill="#2f343b"/><path d="M${X(-2)} ${Y(-1.1)} L${X(-4.1)} ${Y(-0.85)}" stroke="#a9afb7" stroke-width="${r(0.08 * s)}"/>`;
    g += `<path d="M${X(-3)} ${Y(-1.6)} Q${X(-1.2)} ${Y(-3.6)} ${X(1.4)} ${Y(-3)} Q${X(kopf[0] - 0.4)} ${Y(kopf[1] + 1.2)} ${X(kopf[0])} ${Y(kopf[1] + 0.6)} L${X(kopf[0] + 0.2)} ${Y(kopf[1] + 1.4)} Q${X(2.6)} ${Y(-0.8)} ${X(1.2)} ${Y(-0.5)} L${X(-1.6)} ${Y(-0.7)} Z" fill="${S.lg("taubek", [[0, "#b7bcc4"], [0.6, "#8e959f"], [1, "#6d747e"]])}"/>`;
    g += `<path d="M${X(-2.6)} ${Y(-1.6)} Q${X(-0.8)} ${Y(-3)} ${X(1.2)} ${Y(-2.3)} Q${X(0.2)} ${Y(-1.3)} ${X(-2.6)} ${Y(-1.6)} Z" fill="#a3a9b2"/>`;
    g += `<path d="M${X(-1.4)} ${Y(-2.15)} L${X(0.2)} ${Y(-2.3)} M${X(-1.2)} ${Y(-1.75)} L${X(0.4)} ${Y(-1.9)}" stroke="#3b4048" stroke-width="${r(0.28 * s)}" stroke-linecap="round"/>`;
    g += `<path d="M${X(1.1)} ${Y(-2.9)} Q${X(kopf[0] - 0.2)} ${Y(kopf[1] + 1.1)} ${X(kopf[0] - 0.1)} ${Y(kopf[1] + 0.9)} Q${X(1.9)} ${Y(-1.4)} ${X(1.4)} ${Y(-1.2)}" fill="${S.lg("hals", [[0, "#6fa08a"], [0.5, "#8a6c9a"], [1, "#5d8f7c"]])}" opacity=".9"/>`;
    g += `<circle cx="${X(kopf[0])}" cy="${Y(kopf[1])}" r="${r(0.85 * s)}" fill="#7d848e"/><circle cx="${X(kopf[0] + 0.3)}" cy="${Y(kopf[1] - 0.2)}" r="${r(0.2 * s)}" fill="#e88a2e"/><circle cx="${X(kopf[0] + 0.3)}" cy="${Y(kopf[1] - 0.2)}" r="${r(0.08 * s)}" fill="#1d1d1d"/>`;
    g += `<path d="M${X(kopf[0] + 0.7)} ${Y(kopf[1] - 0.1)} L${X(kopf[0] + 1.5)} ${Y(kopf[1] + (pickt ? 0.6 : 0.2))} L${X(kopf[0] + 0.7)} ${Y(kopf[1] + 0.3)} Z" fill="#3a3a3a"/><circle cx="${X(kopf[0] + 0.75)}" cy="${Y(kopf[1] - 0.05)}" r="${r(0.16 * s)}" fill="#e9e6df"/>`;
    g += `<path d="M${X(0)} ${Y(-0.65)} l0 ${r(0.65 * s)} l${r(0.4 * s * sp)} 0 M${X(0.7)} ${Y(-0.6)} l0 ${r(0.6 * s)} l${r(0.4 * s * sp)} 0" stroke="#c9605a" stroke-width="${r(0.22 * s)}" fill="none" stroke-linecap="round"/>`;
    return g;
  };
  S.teil({ id: "taube", de: "die Taube", syl: "TAU-be", it: "il piccione", itSyl: "pic-CIO-ne", en: "pigeon", tipp: "Auf dem Schlossplatz warten die Tauben auf Brezelkrümel.", x: 128, y: 194, kunst: taube(0, 0, 2.1, 1, false) + taube(24, -4, 1.95, -1, true) });
}

/* =====================================================================
   16 — DER TISCH (Café am Kleinen Schlossplatz, ≈ 3,5 m vor uns) mit schwäbischem Essen
   ===================================================================== */
const TISCH = { x: 268, y: 186, rx: 46, ry: 13.8 };
{
  let k = "";
  k += `<path d="M-46 0 L-46 1.8 A46 13.8 0 0 0 46 1.8 L46 0 Z" fill="${S.lg("tischkante", [[0, "#8f877a"], [0.5, "#b8b0a2"], [1, "#9a9284"]], 0, 0, 1, 0)}"/>`;
  k += `<ellipse cx="0" cy="0" rx="46" ry="13.8" fill="${S.lg("platte", [[0, "#f3f0ea"], [0.6, "#e2ddd3"], [1, "#cdc6b8"]])}"/>`;
  k += `<ellipse cx="0" cy="0" rx="46" ry="13.8" fill="none" stroke="#a49a88" stroke-width=".6"/>`;
  k += `<path d="M-30 -6 Q-10 -9 18 -7.5 M-20 2 Q4 -1 30 1.5" stroke="#cfc8bb" stroke-width=".35" fill="none" opacity=".7"/>`;
  k += `<ellipse cx="14" cy="-5" rx="20" ry="3.6" fill="#fff" opacity=".22"/>`;
  S.teil({ id: "tisch", de: "der Tisch", syl: "TISCH", it: "il tavolo", itSyl: "TA-vo-lo", en: "table", x: TISCH.x, y: TISCH.y, kunst: k,
    tipp: "Draußen am Tisch isst man schwäbisch: Brezel, Maultaschen, Linsen mit Spätzle." });
}
const tellerSchatten = (rx, ry) => `<ellipse cx="${r(-rx * 0.12)}" cy="${r(-ry * 0.35)}" rx="${r(rx * 1.02)}" ry="${r(ry * 1.05)}" fill="#3a3024" opacity=".22" filter="url(#${S.id("sanft")})"/>`;
const teller = (rx, ry, id) => `<ellipse cx="0" cy="0" rx="${rx}" ry="${ry}" fill="${S.lg(id, [[0, "#ffffff"], [0.7, "#eeece7"], [1, "#cfccc4"]])}"/><ellipse cx="0" cy="${r(ry * 0.08)}" rx="${r(rx * 0.74)}" ry="${r(ry * 0.7)}" fill="#f4f3ef" stroke="#dcd9d2" stroke-width=".25"/>`;
{
  /* DIE BREZEL liegt flach auf dem Teller: dicker Bauch vorn, dünne Ärmchen, verschlungen */
  let k = tellerSchatten(10.5, 3.2) + teller(10.5, 3.2, "teller1");
  const ARM = S.lg("lauge2", [[0, "#8a4a16"], [1, "#4e2608"]]);
  const LAUGE = S.lg("lauge", [[0, "#c88742"], [0.5, "#99561e"], [1, "#6a3610"]]);
  const P = (x, y) => `${r(x * 0.95)} ${r(y * 0.36 - 0.4)}`;
  const bauch = `M${P(-6.5, -2)} C${P(-7.6, 1)} ${P(-5.6, 5.4)} ${P(0, 5.6)} C${P(5.6, 5.4)} ${P(7.6, 1)} ${P(6.5, -2)}`;
  const armR = `M${P(6.5, -2)} C${P(7.4, -5.6)} ${P(3.6, -7.6)} ${P(1.4, -5.2)} C${P(0.2, -3.8)} ${P(-1.6, -0.6)} ${P(-3, 3.6)}`;
  const armL = `M${P(-6.5, -2)} C${P(-7.4, -5.6)} ${P(-3.6, -7.6)} ${P(-1.4, -5.2)} C${P(-0.2, -3.8)} ${P(1.6, -0.6)} ${P(3, 3.6)}`;
  k += `<path d="${bauch}" stroke="#2c1a0c" stroke-width="3" fill="none" stroke-linecap="round" opacity=".3" transform="translate(-.7 -.6)" filter="url(#${S.id("sanft")})"/>`;
  for (const d of [armR]) k += `<path d="${d}" stroke="#3e1f06" stroke-width="1.15" fill="none" stroke-linecap="round" transform="translate(0 .3)"/><path d="${d}" stroke="${ARM}" stroke-width=".85" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#c98a4c" stroke-width=".25" fill="none" stroke-linecap="round" opacity=".8" transform="translate(.1 -.3)"/>`;
  k += `<path d="${bauch}" stroke="#5a300c" stroke-width="3.6" fill="none" stroke-linecap="round" transform="translate(0 .5)"/>`;
  k += `<path d="${bauch}" stroke="${LAUGE}" stroke-width="3.3" fill="none" stroke-linecap="round"/>`;
  k += `<path d="${bauch}" stroke="#f2d7a6" stroke-width="1.1" fill="none" stroke-dasharray="1.4 .3 .9 .4" transform="translate(0 -.55)"/><path d="${bauch}" stroke="#d9a868" stroke-width=".3" fill="none" stroke-dasharray=".5 .4" transform="translate(0 -.55)"/>`;
  k += `<path d="${armL}" stroke="#3e1f06" stroke-width="1.15" fill="none" stroke-linecap="round" transform="translate(0 .3)"/><path d="${armL}" stroke="${ARM}" stroke-width=".85" fill="none" stroke-linecap="round"/><path d="${armL}" stroke="#c98a4c" stroke-width=".25" fill="none" stroke-linecap="round" opacity=".8" transform="translate(.1 -.3)"/>`;
  for (let i = 0; i < 16; i++) { const t = -0.85 + i * 0.11, x = t * 7.2 * 0.95, y = (5.4 - Math.abs(t) * 4.6) * 0.36 - 1.0 + (i % 2) * 0.35; k += `<rect x="${r(x)}" y="${r(y)}" width=".45" height=".32" fill="#fffdf6"/>`; }
  S.teil({ oben: true, id: "brezel", de: "die Brezel", syl: "BRE-zel", it: "il pretzel", itSyl: "PRET-zel", en: "pretzel",
    x: 247, y: 179.5, steht: true, kunst: k, tipp: "Die schwäbische Brezel hat dünne Ärmchen und einen dicken Bauch." });
}
{
  /* DAS MINERALWASSER (FASSUNG 879, statt des Viertele): Wasserglas mit Sprudel, Bläschen und einer Zitronenscheibe */
  let k = `<path d="M-2.6 0 Q-6 -1.6 -9 -3.6 L-6.6 -4.4 Q-3.4 -2.4 2.6 -.4 Z" fill="#3a3024" opacity=".18" filter="url(#${S.id("sanft")})"/><ellipse cx="-3.4" cy="-1.6" rx="2.4" ry=".6" fill="#9cc8dc" opacity=".3"/>`;
  k += `<path d="M-2.7 0 Q-3.1 -5 -3.15 -10.2 L3.15 -10.2 Q3.1 -5 2.7 0 Q0 .7 -2.7 0 Z" fill="#eef5f5" opacity=".45"/>`;
  k += `<path d="M-2.6 -.55 Q-3 -4 -3.05 -7.8 L3.05 -7.8 Q3 -4 2.6 -.55 Q0 .1 -2.6 -.55 Z" fill="${S.lg("sprudel", [[0, "#cfe6ee"], [0.5, "#e8f4f8"], [1, "#b8d8e4"]], 0, 0, 1, 0)}" opacity=".85"/>`;
  k += `<ellipse cx="0" cy="-7.8" rx="3.05" ry=".55" fill="#f2fafc"/><ellipse cx="0" cy="-7.8" rx="3.05" ry=".55" fill="none" stroke="#a9cfdc" stroke-width=".15"/>`;
  /* Zitronenscheibe im Glas, schräg */
  k += `<g transform="translate(.6 -5.2) rotate(-22)"><ellipse rx="1.7" ry="1.6" fill="#f1d54a"/><ellipse rx="1.4" ry="1.3" fill="#fbeea0"/><path d="M0 0 L0 -1.3 M0 0 L1.2 -.5 M0 0 L1.1 .7 M0 0 L0 1.3 M0 0 L-1.1 .7 M0 0 L-1.2 -.5" stroke="#f1d54a" stroke-width=".18"/></g>`;
  for (const [bx, by, br] of [[-1.6, -1.6, 0.2], [-1, -3.4, 0.16], [-1.9, -5.4, 0.18], [1.8, -2.2, 0.17], [1.3, -6.8, 0.15], [-0.6, -6.4, 0.14], [0.2, -1.2, 0.15], [2, -4.4, 0.13]]) k += `<circle cx="${bx}" cy="${by}" r="${br}" fill="none" stroke="#ffffff" stroke-width=".1" opacity=".9"/>`;
  k += `<path d="M-2.7 0 Q0 .7 2.7 0 L2.6 -.9 Q0 -.3 -2.6 -.9 Z" fill="#dfeeee" opacity=".8"/>`;
  for (const x of [-1.9, -0.6, 0.7, 1.9]) k += `<path d="M${x} -9.8 Q${r(x * 1.02)} -5 ${r(x * 0.9)} -.6" stroke="#ffffff" stroke-width=".22" fill="none" opacity="${x < 0 ? 0.55 : 0.3}"/>`;
  k += `<ellipse cx="0" cy="-10.2" rx="3.15" ry=".65" fill="none" stroke="#f4f8f8" stroke-width=".35"/>`;
  S.teil({ oben: true, id: "mineralwasser", de: "das Mineralwasser", syl: "mi-ne-RAL-was-ser", it: "l'acqua minerale", itSyl: "AC-qua mi-ne-RA-le", en: "mineral water",
    x: 298, y: 178.5, steht: true, kunst: k, tipp: "Nach Budapest hat Stuttgart das größte Mineralwasser-Vorkommen in Europa. Viele Quellen sind in Bad Cannstatt." });
}
{
  /* DIE MAULTASCHEN im tiefen Teller mit klarer Brühe und Schnittlauch */
  let k = tellerSchatten(12.5, 4);
  k += `<ellipse cx="0" cy="0" rx="12.5" ry="4" fill="${S.lg("tteller", [[0, "#ffffff"], [0.6, "#efede8"], [1, "#d2cfc8"]])}"/>`;
  k += `<ellipse cx="0" cy=".35" rx="9.2" ry="2.85" fill="${S.lg("mulde", [[0, "#cfccc4"], [0.45, "#f2f1ed"], [1, "#ffffff"]])}"/>`;
  k += `<ellipse cx="0" cy=".7" rx="8.6" ry="2.45" fill="${S.lg("bruehe", [[0, "#c99a3c"], [0.5, "#e3b95a"], [1, "#f0d189"]])}" opacity=".9"/>`;
  k += `<ellipse cx="2.4" cy=".2" rx="3.6" ry=".55" fill="#fff6dc" opacity=".45"/>`;
  const TEIG = S.lg("teig", [[0, "#fdf6e2"], [0.5, "#f5e8c6"], [1, "#e6d3a2"]]);
  const tasche = (cx, cy, w, h, a, offen) => {
    const c = Math.cos(a * RAD), s = Math.sin(a * RAD);
    const p = [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]].map(([x, y]) => [cx + x * c - y * s, cy + (x * s + y * c) * 0.32]);
    const Pp = (q) => `${r(q[0])} ${r(q[1])}`;
    const m0 = [(p[0][0] + p[1][0] + p[2][0] + p[3][0]) / 4, (p[0][1] + p[1][1] + p[2][1] + p[3][1]) / 4];
    let g = `<path d="M${Pp(p[3])} Q${r(m0[0])} ${r(p[3][1] + 1.3)} ${Pp(p[2])} L${r(p[2][0])} ${r(p[2][1] + 0.5)} Q${r(m0[0])} ${r(p[3][1] + 1.6)} ${r(p[3][0])} ${r(p[3][1] + 0.5)} Z" fill="#ead9ad"/>`;
    g += `<path d="M${Pp(p[0])} Q${r(m0[0])} ${r(p[0][1] - 0.5)} ${Pp(p[1])} Q${r(p[1][0] + 0.5)} ${r(m0[1])} ${Pp(p[2])} Q${r(m0[0])} ${r(p[2][1] + 0.4)} ${Pp(p[3])} Q${r(p[3][0] - 0.5)} ${r(m0[1])} ${Pp(p[0])} Z" fill="${TEIG}" stroke="#e0cb98" stroke-width=".3" stroke-linejoin="round"/>`;
    g += `<ellipse cx="${r(m0[0] + 0.3)}" cy="${r(m0[1] - 0.25)}" rx="${r(w * 0.25)}" ry=".35" fill="#fffaf0" opacity=".7"/>`;
    g += `<path d="M${r(p[0][0] + 0.5)} ${r(p[0][1] + 0.25)} L${r(p[1][0] - 0.5)} ${r(p[1][1] + 0.25)} M${r(p[3][0] + 0.5)} ${r(p[3][1] - 0.25)} L${r(p[2][0] - 0.5)} ${r(p[2][1] - 0.25)}" stroke="#c7a76a" stroke-width=".3" stroke-dasharray=".25 .3"/>`;
    g += `<path d="M${r(cx - w * 0.2)} ${r(cy - 0.1)} Q${r(cx)} ${r(cy - 0.4)} ${r(cx + w * 0.25)} ${r(cy - 0.15)}" stroke="#a4b56a" stroke-width=".5" fill="none" opacity=".45"/>`;
    if (offen) g += `<path d="M${Pp(p[1])} L${r(p[2][0] - 0.8)} ${r(p[2][1] + 0.2)} L${r(p[2][0] - 0.8)} ${r(p[2][1] + 1)} L${r(p[1][0])} ${r(p[1][1] + 0.8)} Z" fill="#f0e2bd"/><path d="M${r(p[1][0] - 0.15)} ${r(p[1][1] + 0.3)} L${r(p[2][0] - 0.9)} ${r(p[2][1] + 0.45)} L${r(p[2][0] - 0.9)} ${r(p[2][1] + 0.8)} L${r(p[1][0] - 0.15)} ${r(p[1][1] + 0.65)} Z" fill="#6f8a3e"/><path d="M${r(p[1][0] - 0.2)} ${r(p[1][1] + 0.45)} L${r(p[2][0] - 0.95)} ${r(p[2][1] + 0.6)}" stroke="#d9958a" stroke-width=".22" stroke-dasharray=".3 .2"/>`;
    return g;
  };
  k += tasche(-3.6, 0.3, 6.2, 4.4, -12, false) + tasche(3, -0.4, 6, 4.2, 10, true) + tasche(0.4, 1.4, 5.6, 3.6, 4, false);
  for (let i = 0; i < 18; i++) { const x = -7 + rnd() * 14, y = -0.6 + rnd() * 2.4; k += `<path d="M${r(x)} ${r(y)} l${r(0.3 + rnd() * 0.25)} ${r(-0.06 + rnd() * 0.12)}" stroke="${rnd() < 0.5 ? "#4f8a3a" : "#6aa64a"}" stroke-width=".2" stroke-linecap="round"/>`; }
  for (let i = 0; i < 6; i++) k += `<ellipse cx="${r(-6 + rnd() * 12)}" cy="${r(0.2 + rnd() * 1.6)}" rx=".35" ry=".14" fill="#fff4cf" opacity=".7"/>`;
  S.teil({ oben: true, id: "maultasche", de: "die Maultasche", syl: "MAUL-ta-sche", it: "il raviolo svevo", itSyl: "ra-VIO-lo SVE-vo", en: "Swabian ravioli",
    x: 283, y: 187, steht: true, kunst: k, tipp: "Maultaschen sind schwäbische Teigtaschen, gefüllt mit Fleisch und Spinat – hier in der Brühe." });
}
{
  /* DIE SPÄTZLE (Plural) mit Linsen und zwei Saitenwürstle */
  let k = tellerSchatten(14, 4.4) + teller(14, 4.4, "teller2");
  k += `<path d="M-10.2 .6 Q-10.6 -1.6 -7 -2.4 Q-2.6 -3.2 1.2 -2.2 Q3.4 -1 2.2 1 Q-.4 2.6 -5 2.4 Q-9.4 2.2 -10.2 .6 Z" fill="${S.lg("spaetzlegrund", [[0, "#f6dc7a"], [1, "#d9b246"]])}"/>`;
  const sp = zufall(77);
  for (let i = 0; i < 58; i++) {
    const t = sp() * Math.PI * 2, rr = Math.sqrt(sp());
    const x = -4.2 + Math.cos(t) * rr * 5.4, y = 0 + Math.sin(t) * rr * 2.1, l = 0.9 + sp() * 1.3, a = (sp() - 0.5) * 1.6;
    const c = ["#f7df7c", "#efcf5c", "#e6c04a", "#fbe9a2"][Math.floor(sp() * 4)];
    k += `<path d="M${r(x)} ${r(y)} q${r(l * 0.5)} ${r(-0.35 + a * 0.2)} ${r(l)} ${r(a * 0.3)}" stroke="#c99f3a" stroke-width=".72" stroke-linecap="round" fill="none"/><path d="M${r(x)} ${r(y - 0.06)} q${r(l * 0.5)} ${r(-0.35 + a * 0.2)} ${r(l)} ${r(a * 0.3)}" stroke="${c}" stroke-width=".5" stroke-linecap="round" fill="none"/>`;
  }
  k += `<path d="M2.4 -.4 Q3 -2.2 6.6 -2.1 Q10.2 -1.9 10 .3 Q9.2 1.9 5.6 1.9 Q2.2 1.7 2.4 -.4 Z" fill="#6b5232" opacity=".85"/>`;
  { let l1 = "", l2 = "", gl = ""; for (let i = 0; i < 70; i++) { const a = sp() * Math.PI * 2, rr = Math.sqrt(sp()), x = 6.2 + Math.cos(a) * rr * 3.4, y = -0.1 + Math.sin(a) * rr * 1.6; const e = `M${r(x - 0.3)} ${r(y)} a.3 .19 0 1 0 .6 0 a.3 .19 0 1 0 -.6 0`; if (sp() < 0.5) l1 += e; else l2 += e; if (sp() < 0.3) gl += `M${r(x - 0.08)} ${r(y - 0.08)} h.12 `; }
    k += `<path d="${l1}" fill="#6e5a2e"/><path d="${l2}" fill="#5b4a26"/><path d="${gl}" stroke="#f4e6c4" stroke-width=".07"/>`; }

  for (let i = 0; i < 12; i++) k += `<circle cx="${r(3.6 + sp() * 5.6)}" cy="${r(-1.7 + sp() * 2.8)}" r=".12" fill="#fff3dc" opacity=".8"/>`;
  for (let i = 0; i < 9; i++) { const x = 3.6 + sp() * 5.2, y = -1.3 + sp() * 2.2; k += `<rect x="${r(x)}" y="${r(y)}" width=".5" height=".35" fill="${i % 3 ? "#e2a693" : "#e08a3c"}" stroke="${i % 3 ? "#a2584a" : "#b35e1e"}" stroke-width=".06"/>`; }
  const SAITE = S.lg("saite", [[0, "#d48b62"], [0.5, "#b0663f"], [1, "#7e4426"]]);
  for (const [d, dy] of [["M-2 1.9 Q3 .7 9 1.1", 0], ["M-1.4 2.9 Q3.6 1.7 9.4 2.2", 0]]) k += `<path d="${d}" stroke="#5e331c" stroke-width="1.55" stroke-linecap="round" fill="none" transform="translate(0 ${dy + 0.25})"/><path d="${d}" stroke="${SAITE}" stroke-width="1.3" stroke-linecap="round" fill="none"/><path d="${d}" stroke="#f0b48e" stroke-width=".3" stroke-linecap="round" fill="none" transform="translate(0 -.35)" opacity=".8"/>`;
  S.teil({ oben: true, id: "spaetzle", de: "die Spätzle", syl: "SPÄTZ-le", it: "gli spätzle", itSyl: "SPÄTZ-le", en: "spaetzle",
    x: 248, y: 190.5, steht: true, kunst: k, tipp: "Man sagt fast immer die Spätzle – das Wort steht im Plural. Es sind schwäbische Eiernudeln, hier mit Linsen und Saitenwürstle." });
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/stuttgart.js"));
console.log(aus);
