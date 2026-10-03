#!/usr/bin/env node
/* =====================================================================
   STUTTGART (FASSUNG 854, Runde 2) — Bilderwelt neu: eine echte Stadtansicht
   ---------------------------------------------------------------------
   RECHERCHE (stuttgart.de „Schlossplatz“, „Neues Schloss“,
   „Jubiläumssäule“, „Kunstgebäude“; Landtag BW zur Dienstflagge;
   Baubroschüre Neues Schloss (Finanzministerium BW); Structurae/LAP
   „Fernsehturm“; Wikipedia Königsbau (135 m, 34 Säulen); Stuttgart-
   Marketing „Stäffele“; Runde 2 ohne Websuche, aus Fachwissen):
   - STANDORT: oben am Rand des Kleinen Schlossplatzes, ≈ 12 m hinter der
     Kante der großen Freitreppe; die Terrasse liegt ≈ 4,4 m über der
     Königstraße, Auge 1,6 m darüber (6 m über dem Platz). Blick nach
     Ostnordost (Bildmitte ≈ 70°) über den Schlossplatz.
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
     ein Viertele Trollinger im Henkelglas.
   UNSICHER außerdem: Breite der Freitreppe (hier ≈ 6 m zwischen den
   Brüstungen), genaue Stellung von Pavillon und Brunnen auf dem Platz.
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
const yT = (d) => HOR + 480 / d, dT = (y) => 480 / (y - HOR), mT = (y) => (y - HOR) / 1.6;     /* Terrasse */
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
figurDef("geht", { geschlecht: "w", pose: "gehen", blick: 70, frisur: "zopf", haarfarbe: "dunkelbraun", haut: "hell",
  kleidung: { oberteil: { stueck: "pullover", farbe: "#b8473a" }, unterteil: { stueck: "jeans" }, jacke: { stueck: "jacke", farbe: "#e2d6bf" }, schuhe: SCHUH } });
figurDef("mann", { geschlecht: "m", pose: "gehen", blick: 290, frisur: "kurz", haarfarbe: "blond", haut: "hell",
  kleidung: { oberteil: { stueck: "hemd", farbe: "#dfe6ef" }, unterteil: { stueck: "jeans" }, jacke: { stueck: "jacke", farbe: "#2f4f7a" }, schuhe: SCHUH } });
figurDef("steht", { geschlecht: "m", pose: "stehen", blick: 30, frisur: "kurz", haarfarbe: "grau", haut: "hell",
  kleidung: { oberteil: { stueck: "pullover", farbe: "#c9a640" }, unterteil: { stueck: "anzughose" }, schuhe: SCHUH } });
figurDef("runter", { geschlecht: "m", pose: "gehen", blick: 182, frisur: "kurz", haarfarbe: "dunkelbraun", haut: "hell",
  kleidung: { oberteil: { stueck: "pullover", farbe: "#3d6b4a" }, unterteil: { stueck: "jeans" }, schuhe: { stueck: "turnschuh" } } }, "mittel");
figurDef("rauf", { geschlecht: "w", pose: "gehen", blick: 12, frisur: "lang", haarfarbe: "blond", haut: "hell",
  kleidung: { oberteil: { stueck: "bluse", farbe: "#f2efe6" }, unterteil: { stueck: "jeans" }, jacke: { stueck: "mantel", farbe: "#8a5a3c" }, schuhe: SCHUH } }, "mittel");
/* Bronzefiguren der Säule: Concordia (Kontrapost, die Rechte hebt den Kranz) und die sitzenden Frauen am Sockel */
const KONTRA = { roll: 3, lende: 1, brust: -2, brustRoll: -5, nacken: 5, kopf: -6, kopfRoll: 3,
  schulterL: { vor: 4, seit: 10 }, ellbogenL: 20, unterarmL: 10, handL: 6, fingerL: 0.36,
  schulterR: { vor: 8, seit: 150, dreh: 0 }, ellbogenR: 25, unterarmR: 0, handR: 4, fingerR: 0.3,
  huefteL: { vor: 9, seit: 1, dreh: -10 }, knieL: 14, fussL: 4, huefteR: { vor: -2, seit: 4, dreh: -4 }, knieR: 1, fussR: 0 };
figurDef("concordia", { bronze: true, geschlecht: "w", pose: KONTRA, blick: 20, frisur: "dutt", haarfarbe: "blond", haut: "hell", kleidung: { kleid: { stueck: "abendkleid", farbe: "#c8b89a" } } });
figurDef("sitzt", { bronze: true, geschlecht: "w", pose: "sitzen", blick: 40, frisur: "dutt", haarfarbe: "blond", haut: "hell", kleidung: { kleid: { stueck: "abendkleid", farbe: "#c8b89a" } } });

/* ---------- Farben ---------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("wolke")}" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="2.2"/></filter>`);
S.def(`<filter id="${S.id("dunst")}" x="-10%" y="-30%" width="120%" height="160%"><feGaussianBlur stdDeviation=".45"/></filter>`);
S.def(`<filter id="${S.id("sanft")}" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation=".35"/></filter>`);
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
S.def(`<pattern id="${S.id("reben")}" width="1.3" height="2.6" patternUnits="userSpaceOnUse"><rect width="1.3" height="2.6" fill="#7f8a4a"/><path d="M0 .9 H1.3 M0 1.5 H1.3" stroke="#d8d0b4" stroke-width=".05" opacity=".8"/><path d="M.2 2.5 Q.05 1.6 .3 .5 Q.55 .1 .7 .6 Q.95 1.5 .75 2.5 Z" fill="#8d8a3c"/><path d="M.25 1.9 Q.3 1 .5 .55 Q.7 1 .7 1.9 Z" fill="#b3a546"/><circle cx=".55" cy=".9" r=".22" fill="#c99a3e"/><circle cx=".35" cy="1.5" r=".18" fill="#a46a32"/><path d="M1.05 .2 V2.6" stroke="#4d4030" stroke-width=".12"/><path d="M.2 2.5 L.8 2.5" stroke="#5c5530" stroke-width=".2"/></pattern>`);
const MAUER = `url(#${S.id("mauer")})`, REBEN = `url(#${S.id("reben")})`;

/* Unregelmäßige Baumkrone: Umriss mit Zacken, Schattenseite links, Licht rechts */
const krone = (cx, cy, rx, ry, farben, seed) => {
  const z = zufall(seed), n = 15;
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
  g += `<path d="${umriss(0.4, 0.38, rx * 0.36, -ry * 0.36)}" fill="${farben[2]}"/>`;
  for (let i = 0; i < 5; i++) g += `<circle cx="${r(cx - rx * 0.5 + z() * rx)}" cy="${r(cy - ry * 0.4 + z() * ry * 0.9)}" r="${r(Math.max(0.25, rx * 0.09))}" fill="${farben[3]}" opacity=".7"/>`;
  return g;
};
const HERBST = ["#5d6f3a", "#86914a", "#b6ad5a", "#c98f3a"], SOMMER = ["#4f6a3a", "#6f8a48", "#9db063", "#bfa64a"];
const baum = (x, y, h, breite, farben, seed) => {
  const m = mY(y), H = h * m, R = breite * m / 2;
  let g = `<path d="M${r(x - 0.18 * m)} ${r(y)} L${r(x - 0.12 * m)} ${r(y - H * 0.5)} L${r(x + 0.12 * m)} ${r(y - H * 0.5)} L${r(x + 0.18 * m)} ${r(y)} Z" fill="#5d4c3a"/>`;
  g += krone(x, y - H * 0.62, R, H * 0.36, farben, seed);
  return g;
};

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
  for (let i = 0; i < 80; i++) {
    const x = 98 + rnd() * 222, top = x < 248 ? 92.5 + (x - 160) * (x - 160) / 9000 : 85.4 + Math.max(0, 300 - x) * 0.08;
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
    for (let j = 0; j < 4; j++) for (let i = 0; i < Math.floor(w / 1.6); i++) k += `<rect x="${r(x + 0.4 + i * 1.6)}" y="${r(top + 1.2 + j * 2.4)}" width=".7" height="1.1" fill="#5d6670" opacity=".75"/>`;
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
  for (const y of [-56.6, -58.4]) k += `<rect x="${Y(-4.2)}" y="${Y(y)}" width="${Y(8.4)}" height="${Y(1)}" fill="#6f8194"/>`;
  k += `<rect x="${Y(-4.6)}" y="${Y(-62.4)}" width="${Y(9.2)}" height="${Y(0.9)}" fill="#eceeec"/>`;
  k += `<rect x="${Y(-0.9)}" y="${Y(-66)}" width="${Y(1.8)}" height="${Y(3.6)}" fill="#dcdedd"/>`;
  for (let i = 0; i < 8; i++) k += `<rect x="${Y(-0.5 + i * 0.03)}" y="${Y(-67.8 - i * 2.1)}" width="${Y(1 - i * 0.06)}" height="${Y(2.1)}" fill="${i % 2 ? "#f0f0ec" : "#d0544e"}"/>`;
  k += `<path d="M0 ${Y(-84.6)} L0 ${Y(-86.4)}" stroke="#d0544e" stroke-width=".12"/>`;
  S.teil({ id: "fernsehturm", de: "der Fernsehturm", syl: "FERN-seh-turm", it: "la torre della televisione", itSyl: "TOR-re del-la te-le-vi-SIO-ne", en: "TV tower",
    x: FT.x, y: FT.y, kunst: `<g opacity=".88">${k}</g>`, tipp: "Der Stuttgarter Fernsehturm von 1956 war der erste Fernsehturm aus Beton auf der Welt.",
    zoom: { x: FT.x - 9.6, y: FT.y - 33, w: 19.2, h: 12 },
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
  const xs = []; for (let x = 0; x <= 106; x += 2) xs.push(x);
  const oben = (x) => Math.min(unten(x), rand(x));
  const kurve = (f) => xs.map((x) => `${x} ${r(f(x))}`);
  k += `<path d="M${kurve(oben).join(" L")} L${xs.slice().reverse().map((x) => `${x} ${r(unten(x))}`).join(" L")} Z" fill="${S.lg("weinhang", [[0, "#8f9c5c"], [0.6, "#8a9356"], [1, "#9a9a70"]])}"/>`;
  /* Terrassen: Trockenmauern entlang der Höhenlinien, dazwischen die Rebzeilen */
  for (let i = 0; i < 9; i++) {
    const a = (x) => Math.min(unten(x), rand(x) + 1.6 + i * 3.1), b = (x) => Math.min(unten(x), rand(x) + 1.6 + i * 3.1 + 2.2), c = (x) => Math.min(unten(x), rand(x) + 1.6 + i * 3.1 + 3.1);
    k += `<path d="M${kurve(a).join(" L")} L${xs.slice().reverse().map((x) => `${x} ${r(b(x))}`).join(" L")} Z" fill="${REBEN}"/>`;
    k += `<path d="M${kurve(b).join(" L")} L${xs.slice().reverse().map((x) => `${x} ${r(c(x))}`).join(" L")} Z" fill="${MAUER}"/>`;
    k += `<path d="M${kurve(b).join(" L")}" stroke="#6d6450" stroke-width=".18" fill="none" opacity=".7"/>`;
  }
  /* Wald auf der Kuppe */
  for (let x = 1; x < 74; x += 3.4) k += krone(x, rand(x) - 0.6, 1.9, 1.5, ["#3f5a35", "#536e42", "#6f8550", "#8c9a5a"], 70 + x);
  /* Stäffele: steile Treppe aus Sandstein zwischen den Reben, mit Handlauf */
  const ST = [[74, 84.4], [72.6, 87.6], [75, 90.4], [73.4, 93.4], [75.8, 96.4], [74.2, 99.4], [76.2, 103.2]];
  const stp = "M" + ST.map((p) => p.join(" ")).join(" L");
  k += `<path d="${stp}" stroke="#6b604b" stroke-width="1.5" fill="none" stroke-linejoin="round"/>`;
  k += `<path d="${stp}" stroke="#e4dabf" stroke-width="1.05" fill="none" stroke-linejoin="round"/>`;
  for (let i = 0; i + 1 < ST.length; i++) {
    const [x0, y0] = ST[i], [x1, y1] = ST[i + 1], n = Math.round(Math.hypot(x1 - x0, y1 - y0) / 0.42);
    for (let j = 1; j < n; j++) { const t = j / n, x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t; k += `<path d="M${r(x - 0.5)} ${r(y)} L${r(x + 0.5)} ${r(y)}" stroke="#a2967a" stroke-width=".12"/>`; }
  }
  k += `<path d="${ST.map((p, i) => (i ? "L" : "M") + r(p[0] + 0.7) + " " + r(p[1] - 0.5)).join(" ")}" stroke="#4a4438" stroke-width=".14" fill="none"/>`;
  /* Weinberghäusle */
  k += `<path d="M83 92.6 L83 89.8 L86.8 89.8 L86.8 92.6 Z" fill="${S.lg("haeusle", [[0, "#d9cdb2"], [1, "#efe6d2"]], 0, 0, 1, 0)}"/><path d="M82.5 89.9 L84.9 87.8 L87.3 89.9 Z" fill="${BIBER}"/><path d="M82.5 89.9 L84.9 87.8 L87.3 89.9" stroke="#6f3324" stroke-width=".18" fill="none"/>`;
  k += `<path d="M84.5 92.6 L84.5 90.8 Q84.9 90.4 85.3 90.8 L85.3 92.6 Z" fill="#5a4636"/><rect x="83.5" y="90.5" width=".6" height=".6" fill="#4b545c"/>`;
  k += `<path d="M${kurve(oben).join(" L")} L${xs.slice().reverse().map((x) => `${x} ${r(unten(x))}`).join(" L")} Z" fill="${S.lg("weindunst", [[0, "#dfe7ec", 0.18], [1, "#e4ebee", 0.3]])}"/>`;
  S.teil({ id: "weinberg", de: "der Weinberg", syl: "WEIN-berg", it: "il vigneto", itSyl: "vi-GNE-to", en: "vineyard", x: 0, y: 0, kunst: k,
    tipp: "Mitten in Stuttgart wachsen Weinreben. Steile Treppen, die „Stäffele“, führen hinauf.",
    zoom: { x: 60, y: 82, w: 32, h: 20 },
    unter: [
      { id: "staeffele", de: "die Treppe", syl: "TREP-pe", it: "la scalinata", itSyl: "sca-li-NA-ta", en: "steps",
        x: 74.4, y: 103.4, kunst: flaeche(-3, -19.4, 6, 19.6, 0.4), tipp: "In Stuttgart gibt es über 400 Treppen an den Hängen – auf Schwäbisch „Stäffele“." },
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
