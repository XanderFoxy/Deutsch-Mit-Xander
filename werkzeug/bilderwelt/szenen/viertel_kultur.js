#!/usr/bin/env node
/* =====================================================================
   DAS KULTURVIERTEL (FASSUNG 852) — Bilderwelt neu, Navigations-Szene
   ---------------------------------------------------------------------
   Jeder Ort hat „lupe“ und führt in seine Szene. Wörter und lupe-Verweise
   sind die der alten Szene (szenen/viertel_kultur.js).

   RECHERCHE (web.de „Die schönsten Weihnachtsmärkte Deutschlands“,
   Premier Inn „Nürnberger Christkindlesmarkt“ mit dem „Markt der
   Partnerstädte“, Frankfurt Römerberg zwischen Fachwerk, Paulskirche und
   Rathaus; eigene Kenntnis deutscher Altstädte):
   - Der MARKTPLATZ mit RATHAUS (Treppengiebel, Uhr, Fahne) und der
     KIRCHE (gotischer Turm, Portal steht offen), am Rand das mittelalter-
     liche STADTTOR, ein BAROCKPALAIS, das STADTTHEATER mit Säulen und das
     NATURKUNDEMUSEUM (Sonderausstellung „Eiszeit“ als Fahne, ein
     T-Rex-Modell davor — wie vor vielen Naturkundemuseen).
   - Im Advent: WEIHNACHTSMARKT mit Holzbuden (Glühwein, Lebkuchen,
     Bratwurst), Lichterketten und der große WEIHNACHTSBAUM.
   - Vorne in der Altstadtzeile: KINO mit Leuchtschrift, KNEIPE mit
     Ausleger-Schild, REISEBÜRO mit Plakaten, ein KOSTÜM- UND PARTYLADEN,
     der das ganze Jahr Deko verkauft (Fenster „Ostern“ und „Halloween“).
   - Auf dem Platz: ein WEGWEISER zu den Partnerstädten und Weltstädten,
     ein Segment der BERLINER MAUER (stehen in vielen Städten), ein
     GEDENKSTEIN mit Kerzen und STOLPERSTEINEN (1933–1945) und die
     RÖMISCHEN FUNDE (Säulen einer Ausgrabung, wie in Köln, Trier, Mainz).
   Maßstab: Augenhöhe y = 85. Hintere Reihe (Fuß y 150) ≈ 5 Einheiten
   je Meter (Türme gestaucht), Altstadtzeile (Fuß y 212) ≈ 10, vorne ≈ 17.
   ===================================================================== */
"use strict";
const path = require("path");
const B = require("../bau");
const { neueSzene, schatten, zufall } = B;

const S = neueSzene({ id: "viertel_kultur", titel: "Das Kulturviertel", emoji: "🎭", thema: "Stadt", kuerzel: "b29e", fassung: 852, breite: 400, hoehe: 300 });
const rnd = zufall(2955);
const r = B.r;

const WORT = {
  vk_kino: ["das Kino","KI-no","il cinema","CI-ne-ma","cinema","kino"],
  vk_theater: ["das Theater","The-A-ter","il teatro","te-A-tro","theatre","theater"],
  vk_kirche_innen: ["die Kirche von innen","KIR-che von IN-nen","la chiesa dentro","CHIE-sa DEN-tro","inside the church","kirche_innen"],
  /* itSyl korrigiert: „glaciale“ wird gla-CIA-le betont (alt: gla-cia-LE) */
  vk_eiszeit: ["die Eiszeit","EIS-zeit","l'era glaciale","E-ra gla-CIA-le","the Ice Age","eiszeit"],
  vk_weihnachtsmarkt: ["der Weihnachtsmarkt","WEIH-nachts-markt","il mercatino di Natale","mer-ca-TI-no","Christmas market","weihnachtsmarkt"],
  vk_kneipe: ["die Kneipe","KNEI-pe","la birreria","bir-re-RI-a","pub","kneipe"],
  vk_museum: ["das Museum","Mu-SE-um","il museo","mu-SE-o","museum","museum"],
  vk_reisebuero: ["das Reisebüro","REI-se-bü-ro","l'agenzia di viaggi","a-gen-ZI-a di VIAG-gi","travel agency","reisebuero"],
  vk_weltstaedte: ["die Weltstädte","WELT-städ-te","le grandi città","GRAN-di cit-TÀ","world cities","weltstaedte"],
  vk_rom: ["Rom","ROM","Roma","RO-ma","Rome","rom"],
  vk_weihnachten: ["Weihnachten","WEIH-nach-ten","il Natale","na-TA-le","Christmas","weihnachten"],
  vk_ostern: ["Ostern","OS-tern","la Pasqua","PA-squa","Easter","ostern"],
  vk_halloween: ["Halloween","HAL-lo-ween","Halloween","HAL-lo-ween","Halloween","halloween"],
  vk_mittelalter: ["das Mittelalter","MIT-tel-al-ter","il Medioevo","me-dio-E-vo","Middle Ages","mittelalter"],
  vk_barock: ["der Barock","Ba-ROCK","il Barocco","ba-ROC-co","Baroque","barock"],
  vk_ostwest: ["Ost und West","OST und WEST","Est e Ovest","Est e O-vest","East and West","ost_west"],
  vk_gedenken: ["das Erinnern","Er-IN-nern","la memoria","me-MO-ria","remembrance","gedenken"],
  vk_dinosaurier: ["die Dinosaurier","Di-no-SAU-ri-er","i dinosauri","di-no-SAU-ri","dinosaurs","dinosaurier"],
  vk_typisch: ["Kirche und Rathaus","KIR-che und RAT-haus","chiesa e municipio","CHIE-sa e mu-ni-CI-pio","church and town hall","typisch_deutsch"],
};

/* ---------- Zeichenhelfer (absolute Koordinaten) -------------------- */
const memo = {};
const LG = (n, st, x1 = 0, y1 = 0, x2 = 0, y2 = 1) => memo[n] || (memo[n] = S.lg(n, st, x1, y1, x2, y2));
const RG = (n, st, cx = 0.5, cy = 0.5, rr = 0.5) => memo[n] || (memo[n] = S.rg(n, st, cx, cy, rr));
const re = (x, y, w, h, f, ex = "") => `<rect x="${r(x)}" y="${r(y)}" width="${r(w)}" height="${r(h)}" fill="${f}"${ex}/>`;
const pl = (pts, f, ex = "") => `<path d="M${pts.map((p) => r(p[0]) + " " + r(p[1])).join("L")}Z" fill="${f}"${ex}/>`;
const li = (x1, y1, x2, y2, c, w, ex = "") => `<line x1="${r(x1)}" y1="${r(y1)}" x2="${r(x2)}" y2="${r(y2)}" stroke="${c}" stroke-width="${w}"${ex}/>`;
const ci = (x, y, rr, f, ex = "") => `<circle cx="${r(x)}" cy="${r(y)}" r="${r(rr)}" fill="${f}"${ex}/>`;
const el = (x, y, rx, ry, f, ex = "") => `<ellipse cx="${r(x)}" cy="${r(y)}" rx="${r(rx)}" ry="${r(ry)}" fill="${f}"${ex}/>`;
const tx = (x, y, s, t, f, ex = "") => `<text x="${r(x)}" y="${r(y)}" font-size="${s}" text-anchor="middle" fill="${f}" font-family="Arial,Helvetica,sans-serif"${ex}>${t}</text>`;
const tg = (x, y, s, t, f, ex = "") => `<text x="${r(x)}" y="${r(y)}" font-size="${s}" text-anchor="middle" fill="${f}" font-family="Georgia,'Times New Roman',serif"${ex}>${t}</text>`;
function teil(id, mx, my, kunst, extra = {}) {
  const w = WORT[id];
  const x = mx - 16, y = my + 16;
  S.teil(Object.assign({ id, de: w[0], syl: w[1], it: w[2], itSyl: w[3], en: w[4], lupe: w[5], x, y, steht: true,
    kunst: `<g transform="translate(${r(-x)} ${r(-y)})">${kunst}</g>` }, extra));
}
const SCHNEE = "#f7f9fb";
const LICHT = LG("licht", [[0, "#fff3c2"], [1, "#ffd27a"]]);
/* Fenster: Rahmen, Glas, Sprosse */
const fen = (x, y, w, h, glas = LG("glas", [[0, "#b6cde0"], [1, "#6c8aa6"]]), rahmen = "#f4efe4") => re(x - 0.6, y - 0.6, w + 1.2, h + 1.2, rahmen) + re(x, y, w, h, glas) + li(x + w / 2, y, x + w / 2, y + h, rahmen, 0.5) + li(x, y + h * 0.4, x + w, y + h * 0.4, rahmen, 0.5);
const bogen = (x, y, w, h, f) => `<path d="M${r(x)} ${r(y + h)} V${r(y + w / 2)} A${r(w / 2)} ${r(w / 2)} 0 0 1 ${r(x + w)} ${r(y + w / 2)} V${r(y + h)} Z" fill="${f}"/>`;
const lichterkette = (x0, x1, y, durch = 2) => { let s = `<path d="M${x0} ${y} Q${(x0 + x1) / 2} ${y + durch} ${x1} ${y}" stroke="#4a3a2a" stroke-width=".25" fill="none"/>`; for (let x = x0 + 2; x < x1; x += 3) { const t = (x - x0) / (x1 - x0); s += ci(x, y + 4 * durch * t * (1 - t), 0.55, "#ffe08a"); } return s; };

/* ---------- Grundfarben -------------------------------------------- */
S.def(`<filter id="bw_weich" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
S.def(`<filter id="${S.id("wolke")}" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="2.6"/></filter>`);
S.def(`<filter id="${S.id("glow")}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>`);
const SANDSTEIN = LG("sandstein", [[0, "#e6dcc6"], [1, "#c9b997"]], 0, 0, 1, 0);

/* =====================================================================
   KULISSE — Winterhimmel, Dächer dahinter, Pflaster des Marktplatzes
   ===================================================================== */
S.hinten(re(0, 0, 400, 160, LG("himmel", [[0, "#8fb2d4"], [0.7, "#cfdceb"], [1, "#eef1f4"]])));
{
  let w = "";
  for (const [x, y, s] of [[60, 18, 1], [210, 12, 1.2], [340, 24, 0.9]]) {
    w += `<g filter="url(#${S.id("wolke")})" opacity=".85">`;
    for (const [dx, dy, rx, ry] of [[0, 0, 18, 5], [-11, 1.5, 11, 4], [12, 1, 13, 4.5], [-3, -3.5, 10, 5], [7, -4, 8, 4.5]]) w += el(x + dx * s, y + dy * s, rx * s, ry * s, "#fff");
    w += `</g>`;
  }
  /* Dächer der Altstadt dahinter, verschneit */
  for (let x = -6; x < 400; x += 22) { const h = 8 + rnd() * 10; w += pl([[x, 150], [x, 150 - h], [x + 11, 150 - h - 8], [x + 22, 150 - h], [x + 22, 150]], "#9aa6b4") + pl([[x + 1, 150 - h - 0.6], [x + 11, 150 - h - 8], [x + 21, 150 - h - 0.6], [x + 11, 150 - h - 5.6]], SCHNEE); }
  S.hinten(w);
}
{
  let p = re(0, 148, 400, 152, LG("pflaster", [[0, "#b7b0a5"], [1, "#9a9388"]]));
  for (let i = -16; i <= 16; i++) p += li(200 + i * 13, 148, 200 + i * 34, 300, "#857e73", 0.3, ' opacity=".7"');
  let y = 152, d = 2.4;
  while (y < 300) { p += li(0, y, 400, y, "#857e73", 0.3, ' opacity=".55"'); y += d; d *= 1.12; }
  for (let i = 0; i < 160; i++) p += ci(rnd() * 400, 150 + rnd() * 150, 0.3 + rnd() * 0.6, SCHNEE, ' opacity=".55"');
  S.hinten(p);
}

/* =====================================================================
   HINTERE REIHE (Fuß y 150): Stadttor, Kirche, Rathaus, Barockpalais,
   Theater, Naturkundemuseum
   ===================================================================== */
{
  /* Stadttor (Mittelalter): Torturm aus Bruchstein mit Spitzhelm, Mauer */
  let k = re(0, 112, 10, 38, LG("mauer", [[0, "#a59885"], [1, "#857865"]])) + re(36, 112, 12, 38, LG("mauer", [[0, "#a59885"], [1, "#857865"]]));
  for (let x = 0; x < 48; x += 4) if (x < 10 || x > 34) k += re(x, 108, 2.4, 4, "#958874");
  k += re(9, 54, 28, 96, LG("turm", [[0, "#b9a98e"], [0.5, "#a4937a"], [1, "#857561"]], 0, 0, 1, 0));
  for (let i = 0; i < 40; i++) k += re(10 + rnd() * 24, 56 + rnd() * 90, 3, 1.4, "#8f806a", ' opacity=".5"');
  k += pl([[7, 54], [23, 20], [39, 54]], LG("helm", [[0, "#5d6b74"], [1, "#3e4a52"]], 0, 0, 1, 0)) + pl([[9, 54], [23, 22], [17, 54]], SCHNEE, ' opacity=".85"') + li(23, 20, 23, 14, "#333", 0.5) + ci(23, 13.4, 1, "#c9a227");
  k += `<path d="M14 150 V128 Q23 116 32 128 V150 Z" fill="#3a3228"/>` + `<path d="M15.5 150 V129 Q23 119 30.5 129 V150 Z" fill="#6b5a46"/>`;
  for (let y = 127; y < 150; y += 2.6) k += li(16, y, 30, y, "#4a3c2e", 0.4);
  k += re(18, 70, 4, 7, "#2b241c") + re(25, 70, 4, 7, "#2b241c") + re(20.5, 90, 5, 8, "#2b241c");
  k += re(8, 104, 30, 3, "#8f806a") + re(16, 100, 14, 4, "#fff") + tx(23, 103.2, 2.4, "Stadttor", "#5a4636", ' font-weight="bold"');
  teil("vk_mittelalter", 30, 66, k, { tipp: "Das Stadttor ist aus dem Mittelalter. Früher hatte die Stadt eine Mauer mit Toren." });
}
{
  /* Kirche: gotischer Westturm, Langhaus, Rosette, offenes Portal */
  let k = re(52, 92, 64, 58, SANDSTEIN) + pl([[50, 92], [84, 70], [118, 92]], "#6b4a3a") + pl([[52, 92], [84, 71], [96, 78], [60, 92]], SCHNEE, ' opacity=".9"');
  k += re(70, 34, 28, 116, LG("kturm", [[0, "#d9cdb3"], [0.5, "#e8dfcc"], [1, "#bfae8d"]], 0, 0, 1, 0));
  k += pl([[68, 34], [84, 0], [100, 34]], LG("kspitze", [[0, "#56707a"], [1, "#3b4e56"]], 0, 0, 1, 0)) + pl([[70, 34], [84, 2], [78, 34]], SCHNEE, ' opacity=".8"') + li(84, 0, 84, -6, "#c9a227", 0.7) + li(81.6, -3.6, 86.4, -3.6, "#c9a227", 0.7);
  k += ci(84, 44, 4.4, "#f4f1e6") + ci(84, 44, 4.4, "none", ' stroke="#8f806a" stroke-width=".6"') + li(84, 44, 84, 41, "#222", 0.5) + li(84, 44, 86, 45, "#222", 0.5);
  for (const y of [56, 74]) k += `<path d="M79 ${y + 10} V${y + 3} Q84 ${y - 3} 89 ${y + 3} V${y + 10} Z" fill="#3f4a5a"/>` + li(84, y + 1, 84, y + 10, "#c9b997", 0.4);
  k += ci(84, 100, 6.4, "#8f806a") + ci(84, 100, 5.4, RG("rosette", [[0, "#ffe6a0"], [0.5, "#c0504d"], [1, "#2f5d8a"]]));
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; k += li(84, 100, 84 + Math.cos(a) * 5.4, 100 + Math.sin(a) * 5.4, "#8f806a", 0.4); }
  /* Portal offen: innen Kerzenlicht */
  k += `<path d="M75 150 V124 Q84 110 93 124 V150 Z" fill="#8f806a"/>` + `<path d="M77.4 150 V125 Q84 114 90.6 125 V150 Z" fill="${RG("innen", [[0, "#ffe7a6"], [0.6, "#e0a050"], [1, "#7a4a22"]], 0.5, 0.7, 0.7)}"/>`;
  k += re(82.6, 132, 2.8, 10, "#7a4a22", ' opacity=".5"') + li(84, 128, 84, 134, "#7a4a22", 0.6) + li(82, 130, 86, 130, "#7a4a22", 0.6);
  for (const x of [56, 106]) k += `<path d="M${x - 3} 140 V112 Q${x} 106 ${x + 3} 112 V140 Z" fill="#45566b"/>`;
  teil("vk_kirche_innen", 60, 108, k, { tipp: "Das Portal der Kirche steht offen – innen brennen Kerzen." });
}
{
  /* Rathaus: Treppengiebel, Uhr, Arkaden, Fahne */
  const X0 = 120, X1 = 196;
  let k = re(X0, 84, X1 - X0, 66, LG("rathaus", [[0, "#efe3c9"], [1, "#d8c7a3"]], 0, 0, 1, 0));
  /* Treppengiebel */
  const g = [[X0 + 8, 84], [X0 + 8, 76], [X0 + 16, 76], [X0 + 16, 66], [X0 + 24, 66], [X0 + 24, 56], [X0 + 32, 56], [X0 + 32, 46], [X0 + 44, 46], [X0 + 44, 56], [X0 + 52, 56], [X0 + 52, 66], [X0 + 60, 66], [X0 + 60, 76], [X0 + 68, 76], [X0 + 68, 84]];
  k += pl(g, LG("rathaus", [[0, "#efe3c9"], [1, "#d8c7a3"]], 0, 0, 1, 0)) + `<path d="M${g.map((p) => r(p[0]) + " " + r(p[1])).join("L")}" stroke="${SCHNEE}" stroke-width="1.2" fill="none"/>`;
  k += pl([[X0 - 2, 86], [X0 + 8, 80], [X0 + 8, 86]], "#7a3b2a") + pl([[X1 - 8, 80], [X1 + 2, 86], [X1 - 8, 86]], "#7a3b2a");
  k += ci(X0 + 38, 62, 5.4, "#1d2b44") + ci(X0 + 38, 62, 4.6, "#f4f1e6") + li(X0 + 38, 62, X0 + 38, 58.6, "#111", 0.6) + li(X0 + 38, 62, X0 + 40.6, 63.4, "#111", 0.5) + ci(X0 + 38, 62, 5.4, "none", ' stroke="#c9a227" stroke-width=".6"');
  for (let j = 0; j < 2; j++) for (let i = 0; i < 6; i++) k += fen(X0 + 6 + i * 11.6, 88 + j * 15, 6, 9);
  k += re(X0 + 18, 116, 40, 6, "#1d2b44") + tx(X0 + 38, 120.8, 4.4, "RATHAUS", "#e8c86a", ' font-weight="bold" letter-spacing="1"');
  /* Arkaden im Erdgeschoss */
  k += re(X0, 124, X1 - X0, 26, "#d2c19c");
  for (let i = 0; i < 6; i++) k += bogen(X0 + 3 + i * 12.4, 128, 9, 22, "#5a4a3a");
  k += re(X0, 123, X1 - X0, 1.6, "#bfae8d");
  /* Fahne */
  k += li(X0 + 38, 46, X0 + 38, 30, "#666", 0.6) + re(X0 + 38.3, 30, 9, 2, "#111") + re(X0 + 38.3, 32, 9, 2, "#dd0000") + re(X0 + 38.3, 34, 9, 2, "#ffce00");
  teil("vk_typisch", X0 + 18, 96, k, { tipp: "Typisch deutsch: Am Marktplatz stehen Kirche und Rathaus nebeneinander." });
}
{
  /* Barockpalais: geschwungener Giebel, Pilaster, Mansarddach, Freitreppe */
  const X0 = 198, X1 = 262;
  let k = pl([[X0 - 1, 88], [X1 + 1, 88], [X1 - 4, 76], [X0 + 4, 76]], "#5f6b78") + pl([[X0 + 2, 86], [X1 - 2, 86], [X1 - 5, 77], [X0 + 5, 77]], SCHNEE, ' opacity=".85"');
  k += re(X0, 88, X1 - X0, 62, LG("barock", [[0, "#f3d7b8"], [1, "#e2b98f"]]));
  k += `<path d="M${X0 + 18} 88 Q${X0 + 18} 70 ${X0 + 32} 66 Q${X1 - 18} 70 ${X1 - 18} 88 Z" fill="#f6e3cb"/>` + `<path d="M${X0 + 18} 88 Q${X0 + 18} 70 ${X0 + 32} 66 Q${X1 - 18} 70 ${X1 - 18} 88" stroke="#d3a679" stroke-width=".8" fill="none"/>`;
  k += ci(X0 + 32, 78, 3.6, "#c9a227") + ci(X0 + 32, 78, 2.6, "#f6e3cb");
  for (const x of [X0 + 2, X0 + 16, X1 - 18, X1 - 4]) k += re(x, 88, 2.4, 62, "#fbefe0") + re(x - 0.6, 88, 3.6, 2, "#fff");
  for (let j = 0; j < 2; j++) for (const x of [X0 + 7, X0 + 22, X0 + 37, X1 - 13]) k += `<path d="M${x} ${101 + j * 20} v-9 q3 -3 6 0 v9 Z" fill="${LG("bglas", [[0, "#b6cde0"], [1, "#6c8aa6"]])}"/>` + `<path d="M${x - 1} ${92 + j * 20} q4 -4 8 0" stroke="#fff" stroke-width=".8" fill="none"/>`;
  k += re(X0 + 24, 134, 16, 16, "#fff") + bogen(X0 + 26, 132, 12, 18, "#6d4a2a");
  k += pl([[X0 + 20, 150], [X0 + 44, 150], [X0 + 42, 147], [X0 + 22, 147]], "#d6cab4");
  k += re(X0 + 18, 126, 28, 5, "#7a3b4a") + tx(X0 + 32, 129.6, 2.8, "Palais · Barock", "#f4e1c0", ' font-weight="bold"');
  teil("vk_barock", X0 + 8, 100, k, { tipp: "Das Palais ist aus dem Barock (um 1700): geschwungener Giebel, viel Schmuck." });
}
{
  /* Stadttheater: Säulenportikus mit Giebel */
  const X0 = 264, X1 = 330;
  let k = re(X0, 96, X1 - X0, 54, SANDSTEIN) + pl([[X0 - 1, 96], [X1 + 1, 96], [X1 - 4, 90], [X0 + 4, 90]], "#7c8a94");
  k += pl([[X0 + 6, 106], [(X0 + X1) / 2, 92], [X1 - 6, 106]], "#efe6d3") + pl([[X0 + 6, 106], [(X0 + X1) / 2, 92], [X1 - 6, 106]], "none", ' stroke="#bfae8d" stroke-width=".6"') + `<path d="M${X0 + 6} 106 L${(X0 + X1) / 2} 92 L${X1 - 6} 106" stroke="${SCHNEE}" stroke-width="1" fill="none"/>`;
  k += re(X0 + 5, 106, X1 - X0 - 10, 6, "#e9dfca") + tg((X0 + X1) / 2, 110.6, 4, "STADTTHEATER", "#5a4636", ' letter-spacing=".8"');
  k += tg((X0 + X1) / 2, 103.4, 3.6, "🎭", "#5a4636");
  for (let i = 0; i < 6; i++) { const x = X0 + 8 + i * 10; k += re(x, 112, 4, 34, LG("saeule", [[0, "#cfc3a8"], [0.45, "#f4ecdd"], [1, "#b5a687"]], 0, 0, 1, 0)) + re(x - 0.8, 112, 5.6, 1.6, "#efe6d3") + re(x - 0.8, 144.6, 5.6, 1.6, "#efe6d3"); }
  for (let i = 0; i < 5; i++) k += re(X0 + 13 + i * 10, 124, 4.6, 22, LICHT);
  k += pl([[X0 + 2, 150], [X1 - 2, 150], [X1 - 4, 146], [X0 + 4, 146]], "#d6cab4");
  /* Plakatkästen */
  k += re(X0 - 0.5, 122, 6, 9, "#7a1f2b") + re(X0 + 0.5, 123, 4, 7, "#f3e1b0") + re(X1 - 5.5, 122, 6, 9, "#7a1f2b") + re(X1 - 4.5, 123, 4, 7, "#f3e1b0");
  teil("vk_theater", X0 + 10, 112, k, { tipp: "Im Stadttheater gibt es Schauspiel, Oper und Ballett." });
}
{
  /* Naturkundemuseum */
  const X0 = 332, X1 = 400;
  let k = re(X0, 92, X1 - X0, 58, LG("museum", [[0, "#e9e4da"], [1, "#cfc7b7"]], 0, 0, 1, 0)) + re(X0 - 1, 88, X1 - X0 + 2, 5, "#bfb5a2") + re(X0 - 1, 86.6, X1 - X0 + 2, 1.6, SCHNEE);
  k += re(X0 + 4, 95, X1 - X0 - 8, 6, "#3f5a46") + tx((X0 + X1) / 2, 99.6, 3.4, "NATURKUNDEMUSEUM", "#f1e6c6", ' font-weight="bold"');
  for (let i = 0; i < 5; i++) k += fen(X0 + 5 + i * 12.6, 106, 6, 11);
  k += re(X0 + 22, 126, 22, 24, "#bfb5a2") + bogen(X0 + 25, 126, 16, 24, "#4a3a2a") + bogen(X0 + 26.4, 128, 13.2, 22, LICHT);
  for (let i = 0; i < 4; i++) k += re(X0 + 6 + i * 4, 128, 2, 22, "#d8d0c0") + re(X1 - 22 + i * 4, 128, 2, 22, "#d8d0c0");
  teil("vk_museum", X0 + 22, 110, k, { tipp: "Im Museum sieht man Skelette, Steine und Tiere aus vergangenen Zeiten." });
}
{
  /* Fahne der Sonderausstellung „Eiszeit“ am Museum (Mammut) */
  const X = 393;
  let k = re(X - 6, 102, 1, 1, "#666") + li(X - 7, 102, X + 2, 102, "#666", 0.6) + re(X - 6.5, 102.4, 8, 30, LG("eisfahne", [[0, "#cfe7f5"], [1, "#7fb4d6"]]));
  k += el(X - 2.5, 117, 3.2, 2.2, "#7a5533") + ci(X - 5.2, 116, 1.6, "#7a5533") + `<path d="M${X - 6.2} 117 q-1 2 .4 3.4" stroke="#7a5533" stroke-width=".7" fill="none"/>` + `<path d="M${X - 5.6} 117.2 q-1.2 1.4 .6 1.6" stroke="#fff" stroke-width=".4" fill="none"/>`;
  for (const x of [X - 4.6, X - 3, X - 1.4, X + 0.2]) k += re(x - 0.4, 118.6, 0.9, 2.2, "#7a5533");
  k += tx(X - 2.5, 108, 2.6, "EIS", "#1d3557", ' font-weight="bold"') + tx(X - 2.5, 111, 2.6, "ZEIT", "#1d3557", ' font-weight="bold"') + tx(X - 2.5, 127, 1.4, "Sonder-", "#1d3557") + tx(X - 2.5, 129, 1.4, "ausstellung", "#1d3557");
  teil("vk_eiszeit", X - 6, 134, k, { oben: true, tipp: "Die Fahne am Museum zeigt die Ausstellung „Eiszeit“ mit dem Mammut." });
}

/* =====================================================================
   WEIHNACHTSBAUM, WEIHNACHTSMARKT, T-REX (rechts auf dem Platz)
   ===================================================================== */
{
  const X = 300, F = 200;
  let k = re(X - 2, F - 10, 4, 10, "#5a3d24");
  for (let i = 0; i < 6; i++) { const y = F - 8 - i * 11, w = 24 - i * 3.6; k += pl([[X - w, y], [X, y - 18], [X + w, y]], i % 2 ? "#2f6b3a" : "#3a7a44") + `<path d="M${X - w + 2} ${y} q${w - 2} -3 ${2 * w - 4} 0" stroke="${SCHNEE}" stroke-width=".8" fill="none" opacity=".8"/>`; }
  for (let i = 0; i < 36; i++) { const t = rnd(), y = F - 12 - t * 60, w = (24 - t * 20) * (rnd() * 1.6 - 0.8); k += ci(X + w, y, 0.7, i % 3 ? "#ffe08a" : "#e63946"); }
  k += tx(X, F - 76, 7, "★", "#ffd23f") + ci(X, F - 78, 4, "#ffd23f", ` opacity=".4" filter="url(#${S.id("glow")})"`);
  teil("vk_weihnachten", X + 18, 130, k, { tipp: "Zu Weihnachten steht auf dem Marktplatz ein großer Weihnachtsbaum mit Lichtern." });
}
{
  let k = "";
  const bude = (x0, w, name, ware) => {
    const F = 222, H = 22;
    let s = schatten(x0 + w / 2, F, w / 2 + 2, 1.2, 0.3) + re(x0, F - H, w, H, LG("bude", [[0, "#9b6a3c"], [1, "#7a4f2a"]]));
    for (let x = x0 + 2; x < x0 + w; x += 3) s += li(x, F - H, x, F, "#6d4425", 0.3);
    s += pl([[x0 - 3, F - H], [x0 + w + 3, F - H], [x0 + w / 2, F - H - 10]], "#6d4425") + pl([[x0 - 2, F - H - 0.6], [x0 + w / 2, F - H - 9.6], [x0 + w + 2, F - H - 0.6], [x0 + w / 2, F - H - 5]], SCHNEE);
    s += re(x0 + 2, F - H + 4, w - 4, 9, LICHT) + ware(x0 + 2, F - H + 4, w - 4) + re(x0 + 1, F - H + 13, w - 2, 2.4, "#5a3d24");
    s += re(x0 + 4, F - H + 0.6, w - 8, 3.2, "#7a1f2b") + tx(x0 + w / 2, F - H + 3.2, 2.4, name, "#ffe7a6", ' font-weight="bold"');
    s += lichterkette(x0 - 2, x0 + w + 2, F - H - 0.4, 1.6);
    return s;
  };
  k += bude(242, 32, "Glühwein", (x, y, w) => { let g = ""; for (let i = 0; i < 6; i++) g += re(x + 2 + i * 4.6, y + 5, 2.4, 3, "#c0392b") + re(x + 2 + i * 4.6, y + 4.4, 2.4, 0.8, "#fff"); return g + re(x + 10, y + 1, 8, 3, "#9aa3aa"); });
  k += bude(318, 32, "Lebkuchen", (x, y) => { let g = ""; for (let i = 0; i < 4; i++) g += `<path d="M${x + 4 + i * 7} ${y + 1} q3 -2 6 0 v3 q-3 3 -6 0 Z" fill="#a0602a"/>` + `<path d="M${x + 5 + i * 7} ${y + 2.2} q2 1 4 0" stroke="#fff" stroke-width=".4" fill="none"/>`; return g + re(x + 2, y + 6, 26, 2, "#f3d39a"); });
  k += bude(278, 22, "Bratwurst", (x, y) => re(x + 2, y + 5, 14, 2.2, "#333") + el(x + 5, y + 4.6, 2.4, 0.8, "#b5652a") + el(x + 11, y + 4.6, 2.4, 0.8, "#b5652a") + `<path d="M${x + 6} ${y + 3} q-1 -2 0 -3" stroke="#fff" stroke-width=".4" fill="none" opacity=".7"/>`);
  teil("vk_weihnachtsmarkt", 250, 214, k, { tipp: "Auf dem Weihnachtsmarkt gibt es Glühwein, Lebkuchen und Bratwurst." });
}
{
  /* T-Rex-Modell vor dem Museum, auf einem Sockel */
  const X = 372, F = 226;
  let k = schatten(X, F, 20, 1.6, 0.3) + re(X - 18, F - 6, 36, 6, "#8f8b84") + re(X - 18, F - 6, 36, 1.4, SCHNEE) + re(X - 9, F - 4.6, 18, 3, "#fff") + tx(X, F - 2.4, 2.2, "Tyrannosaurus rex", "#3f5a46", ' font-style="italic"');
  const T = LG("trex", [[0, "#7c8b5a"], [1, "#556240"]]);
  k += `<path d="M${X - 26} ${F - 34} Q${X - 12} ${F - 34} ${X - 2} ${F - 30} Q${X + 6} ${F - 40} ${X + 12} ${F - 44} L${X + 22} ${F - 44} Q${X + 26} ${F - 42} ${X + 24} ${F - 38} L${X + 16} ${F - 37} Q${X + 12} ${F - 30} ${X + 8} ${F - 24} Q${X + 4} ${F - 18} ${X - 4} ${F - 20} Q${X - 14} ${F - 26} ${X - 26} ${F - 34} Z" fill="${T}"/>`;
  k += `<path d="M${X - 2} ${F - 22} L${X - 6} ${F - 6} L${X - 1} ${F - 6} L${X + 2} ${F - 20} Z M${X + 4} ${F - 22} L${X + 6} ${F - 6} L${X + 11} ${F - 6} L${X + 8} ${F - 22} Z" fill="${T}"/>`;
  k += `<path d="M${X + 9} ${F - 30} l3 3 l-1 1" stroke="#556240" stroke-width=".8" fill="none"/>` + ci(X + 18, F - 41.6, 0.8, "#111") + `<path d="M${X + 16} ${F - 37.6} h7" stroke="#2e3524" stroke-width=".4"/>`;
  for (let i = 0; i < 4; i++) k += pl([[X + 17 + i * 1.6, F - 37.6], [X + 17.8 + i * 1.6, F - 36.4], [X + 18.6 + i * 1.6, F - 37.6]], "#fff");
  k += `<path d="M${X - 20} ${F - 33.6} Q${X - 6} ${F - 33} ${X + 4} ${F - 38}" stroke="${SCHNEE}" stroke-width="1" fill="none" opacity=".8"/>`;
  teil("vk_dinosaurier", X - 14, 186, k, { tipp: "Vor dem Naturkundemuseum steht ein Tyrannosaurus rex – ein Dinosaurier, so groß wie ein Bus." });
}

/* =====================================================================
   ALTSTADTZEILE (Fuß y 212): Kino, Kneipe, Reisebüro, Partyladen
   ===================================================================== */
const OG = (x0, w, f) => { let s = re(x0, 152, w, 30, f); for (let i = 0; i < Math.floor(w / 12); i++) s += fen(x0 + 4 + i * 12, 158, 6, 9); return s; };
const fachwerk = (x0, w, y0, h) => { let s = re(x0, y0, w, h, "#f3ecdc"); for (let x = x0; x <= x0 + w; x += w / 4) s += re(x - 0.8, y0, 1.6, h, "#5a3a24"); s += re(x0, y0, w, 1.6, "#5a3a24") + re(x0, y0 + h - 1.6, w, 1.6, "#5a3a24"); for (let i = 0; i < 4; i++) s += li(x0 + i * w / 4, y0 + h, x0 + (i + 0.5) * w / 4, y0, "#5a3a24", 1); return s; };
{
  const X0 = 0, W = 62;
  let k = re(X0, 146, W, 66, LG("kino", [[0, "#7a1f2b"], [1, "#5a1520"]])) + pl([[X0, 146], [X0 + W, 146], [X0 + W - 4, 140], [X0 + 4, 140]], "#3d2a2a") + pl([[X0 + 1, 145], [X0 + W - 1, 145], [X0 + W - 4.4, 141], [X0 + 4.4, 141]], SCHNEE);
  for (let i = 0; i < 4; i++) k += fen(X0 + 6 + i * 14, 152, 7, 9, LICHT, "#e9c46a");
  /* Leuchtschrift und Vordach mit Programm */
  k += re(X0 + 6, 165, W - 12, 9, "#111") + tx(X0 + W / 2, 172.4, 7.4, "KINO", "#ffe7a6", ` font-weight="bold" letter-spacing="2" filter="url(#${S.id("glow")})"`) + tx(X0 + W / 2, 172.4, 7.4, "KINO", "#fff8dc", ' font-weight="bold" letter-spacing="2"');
  k += pl([[X0 - 1, 176], [X0 + W + 1, 176], [X0 + W - 2, 184], [X0 + 2, 184]], "#e9e2d2") + re(X0 + 4, 177.6, W - 8, 4.6, "#fff") + tx(X0 + W / 2, 181, 2.6, "HEUTE: Der kleine Drache · 17 Uhr", "#7a1f2b", ' font-weight="bold"');
  for (let x = X0 + 2; x < X0 + W; x += 4) k += ci(x, 184.6, 0.6, "#ffe08a");
  k += re(X0 + 6, 188, 12, 18, "#2b2b2b") + re(X0 + 7, 189, 10, 16, "#3a6ea5") + ci(X0 + 12, 195, 3, "#ffd23f") + re(X0 + W - 18, 188, 12, 18, "#2b2b2b") + re(X0 + W - 17, 189, 10, 16, "#2a9d8f") + pl([[X0 + W - 15, 202], [X0 + W - 12, 194], [X0 + W - 9, 202]], "#fff");
  k += re(X0 + 22, 190, 18, 22, "#3a1a1a") + re(X0 + 23, 191, 16, 21, LICHT) + li(X0 + 31, 191, X0 + 31, 212, "#3a1a1a", 0.6);
  teil("vk_kino", X0 + 22, 152, k, { tipp: "Im Kino läuft heute ein Kinderfilm. Die Karten kauft man an der Kasse." });
}
{
  const X0 = 64, W = 48;
  let k = fachwerk(X0, W, 146, 34) + pl([[X0 - 2, 146], [X0 + W + 2, 146], [X0 + W / 2, 128]], "#6b3b2a") + pl([[X0, 145.4], [X0 + W / 2, 129.6], [X0 + W, 145.4], [X0 + W / 2, 136]], SCHNEE);
  for (let i = 0; i < 3; i++) k += fen(X0 + 6 + i * 14, 154, 6, 9);
  k += re(X0, 180, W, 32, "#3b2618") + re(X0 + 4, 186, 18, 14, LICHT) + re(X0 + 26, 186, 18, 14, LICHT);
  for (let i = 0; i < 9; i++) k += ci(X0 + 7 + (i % 3) * 6, 189 + Math.floor(i / 3) * 4, 1.6, "none", ' stroke="#c99a5a" stroke-width=".4"') + ci(X0 + 29 + (i % 3) * 6, 189 + Math.floor(i / 3) * 4, 1.6, "none", ' stroke="#c99a5a" stroke-width=".4"');
  k += re(X0 + 18, 202, 12, 10, "#5a3a24");
  k += re(X0 + 4, 181.6, W - 8, 3.4, "#1d1209") + tx(X0 + W / 2, 184.4, 2.8, "Zum Anker", "#e8c86a", ' font-family="Georgia,serif" font-weight="bold"');
  /* Ausleger mit Bierkrug */
  k += li(X0 + W, 172, X0 + W + 9, 172, "#222", 0.8) + `<path d="M${X0 + W + 2} 172 q4 -3 7 0" stroke="#222" stroke-width=".5" fill="none"/>` + re(X0 + W + 3, 173, 7, 8, "#e8c86a") + re(X0 + W + 4, 174, 4, 6, "#f2b632") + re(X0 + W + 4, 173, 4, 1.4, "#fff") + `<path d="M${X0 + W + 8} 175 h1.6 v3 h-1.6" stroke="#e8c86a" stroke-width=".6" fill="none"/>`;
  teil("vk_kneipe", X0 + 12, 152, k, { tipp: "In der Kneipe trifft man sich abends auf ein Bier oder eine Apfelschorle." });
}
{
  const X0 = 114, W = 46;
  let k = OG(X0, W, "#e8d3b0") + pl([[X0 - 1, 152], [X0 + W + 1, 152], [X0 + W - 4, 144], [X0 + 4, 144]], "#5f6b78") + pl([[X0 + 1, 151.4], [X0 + W - 1, 151.4], [X0 + W - 4.4, 145], [X0 + 4.4, 145]], SCHNEE);
  k += re(X0, 182, W, 30, "#f6f3ec") + re(X0 + 2, 183, W - 4, 6, "#1f6fb2") + tx(X0 + W / 2, 187.4, 3.6, "REISEBÜRO", "#fff", ' font-weight="bold"');
  k += re(X0 + 2, 191, 28, 19, LG("rglas", [[0, "#dff0f8"], [1, "#a9cbe0"]]));
  /* Plakate: Strand mit Palme, Flugzeug, Last Minute */
  k += re(X0 + 4, 193, 11, 14, "#4fb3e8") + re(X0 + 4, 203, 11, 4, "#f3d9a0") + li(X0 + 11, 207, X0 + 12, 197, "#7a5530", 0.7) + `<path d="M${X0 + 12} 197 q-3 -1 -4 1 M${X0 + 12} 197 q3 -1 4 1 M${X0 + 12} 197 q0 -2 2 -3" stroke="#2e7d32" stroke-width=".7" fill="none"/>` + ci(X0 + 6.6, 196, 1.4, "#ffd23f");
  k += re(X0 + 17, 193, 11, 7, "#fff") + tx(X0 + 22.5, 196.2, 1.8, "Last", "#c0392b", ' font-weight="bold"') + tx(X0 + 22.5, 198.6, 1.8, "Minute", "#c0392b", ' font-weight="bold"') + re(X0 + 17, 202, 11, 5, "#e63946") + tx(X0 + 22.5, 205.6, 2.2, "ab 299 €", "#fff", ' font-weight="bold"');
  k += re(X0 + 32, 191, 11, 21, "#3b4248") + re(X0 + 33, 192, 9, 20, LG("rglas", [[0, "#dff0f8"], [1, "#a9cbe0"]]));
  teil("vk_reisebuero", X0 + 10, 166, k, { tipp: "Im Reisebüro bucht man Flüge, Hotels und Urlaubsreisen." });
}
/* Kostüm- und Partyladen: Fassade in der Kulisse, die zwei Schaufenster sind Teile */
{
  const X0 = 162, W = 76;
  let s = OG(X0, W, "#cfe0e8") + pl([[X0 - 1, 152], [X0 + W + 1, 152], [X0 + W - 4, 144], [X0 + 4, 144]], "#5f6b78") + pl([[X0 + 1, 151.4], [X0 + W - 1, 151.4], [X0 + W - 4.4, 145], [X0 + 4.4, 145]], SCHNEE);
  s += re(X0, 182, W, 30, "#f1ede4") + re(X0 + 2, 183, W - 4, 6, "#7b2d8e") + tx(X0 + W / 2, 187.4, 3.2, "PARTY &amp; KOSTÜM · Feste das ganze Jahr", "#fff", ' font-weight="bold"');
  s += re(X0 + 34, 191, 8, 21, "#4a3a5a") + re(X0 + 35, 192, 6, 20, LICHT);
  S.hinten(s);
}
{
  const X0 = 164;
  let k = re(X0, 190.4, 30, 21, "#4a3a5a") + re(X0 + 1, 191.4, 28, 19.6, LG("fglas", [[0, "#fff8e6"], [1, "#f3e3b8"]]));
  /* Osterhase, Korb mit bunten Eiern, Zweige */
  k += el(X0 + 8, 205, 4, 4.6, "#d9c3a5") + ci(X0 + 8, 198.6, 2.8, "#d9c3a5") + el(X0 + 6.6, 193.6, 0.9, 3, "#d9c3a5") + el(X0 + 9.4, 193.6, 0.9, 3, "#d9c3a5") + el(X0 + 6.6, 193.8, 0.4, 2, "#f2b6c0") + el(X0 + 9.4, 193.8, 0.4, 2, "#f2b6c0") + ci(X0 + 7.2, 198.2, 0.4, "#222") + ci(X0 + 8.8, 198.2, 0.4, "#222");
  k += `<path d="M${X0 + 14} 206 h12 l-1.4 4.4 h-9.2 Z" fill="#b98552"/>`;
  for (const [dx, c] of [[16, "#e63946"], [19, "#ffd23f"], [22, "#4f8fd8"], [24.6, "#2a9d8f"], [17.6, "#9b5de5"]]) k += el(X0 + dx, 205, 1.3, 1.7, c);
  k += li(X0 + 21, 205, X0 + 18, 194, "#7a5530", 0.4) + li(X0 + 21, 205, X0 + 25, 195, "#7a5530", 0.4) + el(X0 + 18.4, 196, 0.8, 1.1, "#ffd23f") + el(X0 + 24.4, 197, 0.8, 1.1, "#f06292");
  k += re(X0 + 9, 191.6, 12, 3, "#fff") + tx(X0 + 15, 193.9, 2.2, "Ostern", "#2a9d8f", ' font-weight="bold"');
  teil("vk_ostern", X0 + 15, 172, k, { tipp: "Zu Ostern versteckt der Osterhase bunte Eier." });
}
{
  const X0 = 206;
  let k = re(X0, 190.4, 30, 21, "#4a3a5a") + re(X0 + 1, 191.4, 28, 19.6, LG("hglas", [[0, "#3b2a4e"], [1, "#1f1530"]]));
  /* Kürbis mit Gesicht, Hexenhut, Fledermäuse, Spinnennetz */
  k += el(X0 + 10, 206, 6, 4.4, "#f08a24") + `<path d="M${X0 + 7} 206 q3 -4.4 0 -8.4 M${X0 + 13} 206 q-3 -4.4 0 -8.4" stroke="#c96a12" stroke-width=".5" fill="none"/>` + re(X0 + 9.4, 200.6, 1.2, 2, "#3f6b2f");
  k += pl([[X0 + 7, 205], [X0 + 8.6, 203.4], [X0 + 9.4, 205]], "#ffe08a") + pl([[X0 + 10.6, 205], [X0 + 11.4, 203.4], [X0 + 13, 205]], "#ffe08a") + `<path d="M${X0 + 7} 207.4 q3 2 6 0 l-1 .4 l-1 -.6 l-1 .6 l-1 -.6 l-1 .6 Z" fill="#ffe08a"/>`;
  k += pl([[X0 + 18, 208], [X0 + 28, 208], [X0 + 23.6, 196]], "#222") + el(X0 + 23, 208, 6.4, 1.2, "#222") + re(X0 + 19.6, 205.6, 7, 1.2, "#9b5de5");
  for (const [x, y] of [[X0 + 6, 194.6], [X0 + 15, 196]]) k += `<path d="M${x - 3} ${y} q1.5 -1.6 3 0 q1.5 -1.6 3 0 l-1.5 1 l-1.5 -.6 l-1.5 .6 Z" fill="#111"/>`;
  k += `<path d="M${X0 + 29} 191.4 l-6 6 M${X0 + 29} 191.4 l-3 7 M${X0 + 29} 191.4 l-7 3" stroke="#bbb" stroke-width=".25"/>` + `<path d="M${X0 + 27} 193.4 q-1 1.4 -2.6 1 M${X0 + 25.6} 195.4 q-2 .6 -3.4 -.4" stroke="#bbb" stroke-width=".25" fill="none"/>`;
  k += re(X0 + 6, 191.6, 16, 3, "#f08a24") + tx(X0 + 14, 193.9, 2.2, "Halloween", "#1f1530", ' font-weight="bold"');
  teil("vk_halloween", X0 + 15, 172, k, { tipp: "An Halloween (31. Oktober) verkleiden sich Kinder und stellen Kürbisse auf." });
}

/* =====================================================================
   VORNE AUF DEM PLATZ: Wegweiser, Mauersegment, Gedenkstein,
   Römische Funde
   ===================================================================== */
{
  /* Wegweiser zu Partner- und Weltstädten */
  const X = 40, F = 292;
  let k = schatten(X, F, 6, 1, 0.35) + re(X - 1.2, 228, 2.4, F - 228, LG("mast", [[0, "#3a3f45"], [0.5, "#6a727b"], [1, "#2b3036"]], 0, 0, 1, 0)) + ci(X, 227, 1.6, "#c9a227");
  const ziele = [["Paris 880 km", 1, "#1f6fb2"], ["Rom 1 100 km", -1, "#2e7d32"], ["New York 6 200 km", 1, "#c0392b"], ["Tokio 9 100 km", -1, "#7b2d8e"], ["Istanbul 2 000 km", 1, "#f4a100"]];
  ziele.forEach(([t, d, c], i) => {
    const y = 232 + i * 8, w = 24;
    k += `<path d="M${X} ${y} h${d * w} l${d * 3} 3 l${-d * 3} 3 h${-d * w} Z" fill="${c}"/>` + `<text x="${r(X + d * (w / 2 + 1))}" y="${r(y + 4.2)}" font-size="2.9" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold">${t}</text>`;
  });
  k += re(X - 6, 278, 12, 5, "#fff") + tx(X, 281.6, 2.2, "Weltstädte", "#333", ' font-weight="bold"');
  teil("vk_weltstaedte", X + 16, 266, k, { tipp: "Der Wegweiser zeigt, wie weit es bis zu den Weltstädten ist." });
}
{
  /* Segment der Berliner Mauer, bemalt */
  const X0 = 76, X1 = 98, F = 294;
  let k = schatten((X0 + X1) / 2, F, 14, 1.4, 0.35) + `<path d="M${X0} ${F} V${F - 52} Q${X0} ${F - 56} ${X0 + 4} ${F - 56} H${X1 - 4} Q${X1} ${F - 56} ${X1} ${F - 52} V${F} Z" fill="${LG("beton", [[0, "#d9d6cf"], [1, "#b5b1a8"]], 0, 0, 1, 0)}"/>`;
  k += pl([[X0 - 4, F], [X1 + 4, F], [X1 + 4, F - 4], [X0 - 4, F - 4]], "#a9a59c");
  k += `<path d="M${X0 + 2} ${F - 46} q6 -4 18 2 v12 q-10 -6 -18 0 Z" fill="#e63946"/>` + `<path d="M${X0 + 2} ${F - 30} q10 6 18 -2 v10 q-8 6 -18 0 Z" fill="#ffd23f"/>` + ci(X0 + 11, F - 34, 4, "#4f8fd8") + ci(X0 + 9.6, F - 35, 0.6, "#fff") + ci(X0 + 12.4, F - 35, 0.6, "#fff") + `<path d="M${X0 + 9} F-32 q2 1.4 4 0" stroke="#fff" stroke-width=".5" fill="none"/>`.replace("F-32", String(F - 32.6));
  k += re(X0 + 2, F - 16, 18, 8, "#fff", ' opacity=".9"') + tx((X0 + X1) / 2, F - 12.4, 2.2, "Berliner Mauer", "#222", ' font-weight="bold"') + tx((X0 + X1) / 2, F - 9.6, 1.9, "1961 – 1989", "#222");
  k += `<path d="M${X0 + 3} ${F - 54} q8 -2 16 0" stroke="${SCHNEE}" stroke-width="1.2" fill="none"/>`;
  teil("vk_ostwest", X1 + 4, 246, k, { tipp: "Dieses Stück der Berliner Mauer erinnert an die Teilung in Ost und West (1961–1989)." });
}
{
  /* Gedenkstein mit Kerzen und Kranz, Stolpersteine im Pflaster */
  const X = 138, F = 290;
  let k = schatten(X, F, 20, 1.4, 0.35) + pl([[X - 16, F], [X + 16, F], [X + 14, F - 20], [X - 14, F - 22]], LG("granit", [[0, "#6f747a"], [1, "#4b5056"]], 0, 0, 1, 1));
  k += pl([[X - 14, F - 22], [X + 14, F - 20], [X + 12, F - 23], [X - 12, F - 24.6]], SCHNEE);
  k += tx(X, F - 15, 2.6, "Wir gedenken", "#e8e2d4", ' font-family="Georgia,serif"') + tx(X, F - 11.6, 2.2, "der Opfer", "#e8e2d4", ' font-family="Georgia,serif"') + tx(X, F - 8.4, 2.6, "1933 – 1945", "#e8e2d4", ' font-family="Georgia,serif" font-weight="bold"');
  /* Kranz und Kerzen */
  k += el(X - 9, F - 2, 5, 2.4, "#2f5a33") + el(X - 9, F - 2, 2.6, 1, "#4b5056") + `<path d="M${X - 6} ${F - 3} l3 4" stroke="#c0392b" stroke-width=".8"/>`;
  for (const dx of [4, 8, 12]) k += re(X + dx - 1, F - 4, 2, 4, "#c0392b") + el(X + dx, F - 5, 0.6, 1, "#ffd23f") + ci(X + dx, F - 5, 1.6, "#ffd23f", ` opacity=".35" filter="url(#${S.id("glow")})"`);
  /* drei Stolpersteine im Pflaster davor */
  for (const dx of [-8, 0, 8]) k += pl([[X + dx - 3, F + 4], [X + dx + 3, F + 4], [X + dx + 3.4, F + 7], [X + dx - 3.4, F + 7]], LG("messing", [[0, "#f2d27a"], [1, "#b8892b"]], 0, 0, 1, 1)) + li(X + dx - 2, F + 5.4, X + dx + 2, F + 5.4, "#7a5a1a", 0.25);
  teil("vk_gedenken", X, 257, k, { tipp: "Der Gedenkstein und die Stolpersteine erinnern an die Menschen, die 1933–1945 verfolgt und ermordet wurden." });
}
{
  /* Römische Funde: Säulen einer Ausgrabung, Geländer, Schild */
  const X0 = 166, X1 = 234, F = 296;
  let k = pl([[X0, F - 14], [X1, F - 14], [X1 + 2, F], [X0 - 2, F]], "#c9b48a") + pl([[X0, F - 14], [X1, F - 14], [X1 + 2, F], [X0 - 2, F]], "none", ' stroke="#8f806a" stroke-width=".6"');
  for (let i = 0; i < 10; i++) k += re(X0 + 2 + rnd() * 60, F - 12 + rnd() * 9, 4, 2, "#b09c74", ' opacity=".7"');
  const saeule = (x, h, kap) => { let s = schatten(x, F - 4, 6, 1, 0.3) + re(x - 4, F - 6, 8, 2.6, "#e2d8c2") + re(x - 3, F - 6 - h, 6, h, LG("rsaeule", [[0, "#d6cbb2"], [0.45, "#f3ecdd"], [1, "#b8aa8a"]], 0, 0, 1, 0)); for (let i = 1; i < 4; i++) s += li(x - 3 + i * 1.5, F - 6 - h, x - 3 + i * 1.5, F - 6, "#b8aa8a", 0.3); if (kap) s += re(x - 4.6, F - 9 - h, 9.2, 3, "#efe6d3") + `<path d="M${x - 4.6} ${F - 9 - h} q-1.4 1.6 0 3 M${x + 4.6} ${F - 9 - h} q1.4 1.6 0 3" stroke="#b8aa8a" stroke-width=".7" fill="none"/>`; else s += pl([[x - 3, F - 6 - h], [x + 3, F - 6 - h + 2], [x + 3, F - 6 - h - 1], [x - 3, F - 6 - h - 3]], "#e2d8c2"); return s; };
  k += saeule(X0 + 14, 40, true) + saeule(X0 + 32, 28, false) + saeule(X0 + 50, 46, true);
  k += pl([[X0 + 56, F - 6], [X0 + 66, F - 4], [X0 + 66, F - 9], [X0 + 56, F - 11]], "#e2d8c2") + `<path d="M${X0 + 56} ${F - 11} q-1.4 2.4 0 5" stroke="#b8aa8a" stroke-width=".7" fill="none"/>`;
  for (let x = X0; x <= X1; x += 6) k += re(x - 0.4, F - 22, 0.8, 8, "#3a3f45");
  k += re(X0, F - 22, X1 - X0, 0.8, "#3a3f45") + re(X0, F - 17, X1 - X0, 0.6, "#3a3f45");
  k += re(X0 + 18, F - 22, 30, 7, "#7a1f2b") + tx(X0 + 33, F - 18.4, 2.6, "RÖMISCHE FUNDE", "#f3e1b0", ' font-weight="bold"') + tx(X0 + 33, F - 16, 1.7, "Tempel, 2. Jh. n. Chr.", "#f3e1b0");
  teil("vk_rom", X0 + 6, 240, k, { tipp: "Hier hat man Säulen aus der Römerzeit gefunden – die Römer kamen aus Rom." });
}

/* =====================================================================
   VORNE (fängt keinen Tipp): leichter Schneefall, Laternen
   ===================================================================== */
{
  let v = "";
  for (const x of [154, 244]) v += re(x - 0.7, 236, 1.4, 50, "#2b3036") + re(x - 1.6, 284, 3.2, 3, "#2b3036") + pl([[x - 3, 236], [x + 3, 236], [x + 2, 230], [x - 2, 230]], "#2b3036") + re(x - 2, 231, 4, 4, "#ffe9a8") + pl([[x - 3.6, 230.4], [x, 227], [x + 3.6, 230.4]], "#2b3036");
  for (let i = 0; i < 60; i++) v += ci(rnd() * 400, rnd() * 300, 0.3 + rnd() * 0.35, "#fff", ` opacity="${r(0.5 + rnd() * 0.4)}"`);
  S.davor(v);
}

const aus = S.schreiben(path.join(__dirname, "../../../bilderwelt-neu/szenen/viertel_kultur.js"));
console.log(aus);
