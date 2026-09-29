#!/usr/bin/env node
/* =====================================================================
   FASSUNG 834 — DIE LEHRBUCHTAFELN: KÖRPER, KÖRPERBAU, ORGANE,
   ENTSTEHUNG DES LEBENS
   ---------------------------------------------------------------------
   XANDER (Funk 213, wörtlich): „die Entstehung des Lebens soll viel
   detaillierter alles sein mit den Organen innere und äußere … die
   Anatomie … realistisch … so wie du eine Kathedrale baust“.

   LEITPLANKEN (vom Auftrag): Stil eines Biologie-Schulbuchs bzw.
   medizinischen Atlas — sachlich, beschriftet (deutsche Fachwörter mit
   Artikel), neutrale Standhaltung, keine sexuellen Handlungen. Die
   Menschen der Körperteil-Tafeln tragen Unterwäsche; Geschlechtsorgane
   stehen nur auf ihren eigenen, schematischen Tafeln (anatomie, vulva,
   penis, frau_innen, mann_innen — hier nicht angefasst). Die Entstehung
   des Lebens: Zellen, Ei- und Samenzelle, Befruchtung als Zellschema,
   Einnistung, Embryo- und Fötusstadien, Geburt schematisch. Die frühere
   Tafel „der Geschlechtsverkehr“ ist ersetzt durch „die Einnistung“.

   Was gebaut wird:
     koerper      „Der Körper“: Mensch von vorn und von hinten in
                  Unterwäsche, dazu der Kopf groß — die Trefferflächen
                  sitzen an den gerechneten Stellen des Skeletts.
     koerperbau   die vier Menschen (Mann/Frau, vorn/hinten) neu;
                  Skelett und Gelenke bleiben.
     entstehung   neun Tafeln, jede mit Lupe und beschrifteten Teilen.
     koerper_innen die Organe an ihrem Platz im Rumpf.
   Beschriftungen (Klasse „bw-beschriftung“) erscheinen nur in der Lupe
   im Modus „Entdecken“ — im Suchspiel verraten sie nichts.

   Aufruf:  node werkzeug/bau-834-lehrbuch.js [koerper|koerperbau|entstehung|koerper_innen …]
   ===================================================================== */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const WURZEL = path.dirname(__dirname);
const raum = vm.createContext({});
vm.runInContext("var window = this;", raum);
vm.runInContext(fs.readFileSync(path.join(WURZEL, "figuren/mensch.js"), "utf8"), raum, { filename: "mensch.js" });
const M = raum.window.DMA_MENSCH;
const nur = process.argv.slice(2);
const soll = (n) => !nur.length || nur.indexOf(n) >= 0;

const r1 = (v) => Math.round(v * 10) / 10;
function lade(szene) {
  const pfad = path.join(WURZEL, "szenen", szene + ".js");
  const txt = fs.readFileSync(pfad, "utf8");
  const i = txt.indexOf('{"id"'), j = txt.lastIndexOf("};");
  return { pfad, txt, i, j, d: JSON.parse(txt.slice(i, j + 1)) };
}
function speichere(S, kopfKommentar) {
  let vorn = S.txt.slice(0, S.i);
  if (kopfKommentar && vorn.indexOf("FASSUNG 834") < 0) vorn = "/* " + kopfKommentar + " */\n" + vorn;
  fs.writeFileSync(S.pfad, vorn + JSON.stringify(S.d) + S.txt.slice(S.j + 1));
}
const flaeche = (w, h, rx) => '<rect class="bw-flaeche" x="' + r1(-w / 2) + '" y="' + r1(-h / 2) + '" width="' + r1(w) + '" height="' + r1(h) + '" rx="' + r1(rx == null ? Math.min(w, h) / 4 : rx) + '" fill="rgba(255,255,255,0.001)"/>';
const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* Beschriftung wie im Schulbuch: Zeigerlinie vom Teil zum Wort am Rand. */
function beschriftung(ziel, textPos, text, groesse, anker) {
  const g = groesse || 3.3;
  anker = anker || (textPos[0] < ziel[0] ? "end" : "start");
  /* Die Zeigerlinie endet an dem Ende des Wortes, das zum Teil zeigt. */
  const breite = String(text).length * g * 0.5;
  const zumTeil = anker === "start" ? (ziel[0] > textPos[0] + breite ? textPos[0] + breite + 0.8 : textPos[0] - 0.8) : (ziel[0] < textPos[0] - breite ? textPos[0] - breite - 0.8 : textPos[0] + 0.8);
  const ende = [zumTeil, textPos[1] - g * 0.32];
  return '<g class="bw-beschriftung">'
    + '<path d="M' + r1(ziel[0]) + " " + r1(ziel[1]) + "L" + r1(ende[0]) + " " + r1(ende[1]) + '" stroke="#7b5b3c" stroke-width=".28" fill="none"/>'
    + '<circle cx="' + r1(ziel[0]) + '" cy="' + r1(ziel[1]) + '" r=".7" fill="#7b5b3c"/>'
    + '<text x="' + r1(textPos[0]) + '" y="' + r1(textPos[1]) + '" font-size="' + g + '" font-family="Helvetica, Arial, sans-serif" fill="#4a3526" stroke="#fdfaf5" stroke-width="' + r1(g * 0.28) + '" paint-order="stroke" text-anchor="' + anker + '">' + esc(text) + "</text></g>";
}

/* Eine Figur als SVG an einer Stelle mit Maßstab; liefert die Punkte in
   Szenenkoordinaten mit. */
function figur(spec, x, y, k, clip) {
  const r = M.zeichne(spec);
  const pk = {};
  Object.keys(r.punkte).forEach((n) => { pk[n] = [x + r.punkte[n][0] * k, y + r.punkte[n][1] * k]; });
  const svg = '<g transform="translate(' + r1(x) + "," + r1(y) + ") scale(" + k.toFixed(4) + ')">' + r.svg + "</g>";
  return { svg: clip ? '<g clip-path="url(#' + clip + ')">' + svg + "</g>" : svg, punkte: pk, roh: r };
}

/* ================================================================
   KOERPER — „Der Körper“
   ================================================================ */
function bauKoerper() {
  const S = lade("koerper");
  const B = S.d.breite, H = S.d.hoehe;
  const mensch = { alter: "erwachsen", geschlecht: "m", haut: "hell", frisur: "kurz", haarfarbe: "braun", gesicht: "g1",
    pose: "lehrbuch", kleidung: { unterteil: { stueck: "boxershorts", farbe: "grau" } } };
  const vorn = figur(Object.assign({ id: "kv", blick: 0 }, mensch), 82, 372, 1.84);
  const hinten = figur(Object.assign({ id: "kh", blick: 180 }, mensch), 262, 372, 1.19);
  /* Der Kopf groß im Bild oben rechts: dieselbe Figur, stark vergrößert
     und auf die Tafel beschnitten. */
  const tafel = { x: 172, y: 10, w: 160, h: 136 };
  const kopfK = 4.0;
  const kopfRoh = M.zeichne(Object.assign({ id: "kk", blick: 24 }, mensch));
  const kpY = kopfRoh.kopf.y;   // Kopfmitte unter dem Anker
  const kx = tafel.x + tafel.w / 2 - kopfRoh.kopf.x * kopfK, ky = tafel.y + tafel.h / 2 + 4 - kpY * kopfK;
  const kopf = figur(Object.assign({ id: "kk", blick: 24 }, mensch), kx, ky, kopfK, "kpTafel");

  let kulisse = '<rect x="0" y="0" width="' + B + '" height="' + H + '" fill="#f4efe6"/>'
    /* feines Karopapier wie im Heft */
    + Array.from({ length: Math.floor(B / 20) }, (_, i) => '<line x1="' + (i + 1) * 20 + '" y1="0" x2="' + (i + 1) * 20 + '" y2="' + H + '" stroke="#ebe3d6" stroke-width=".6"/>').join("")
    + Array.from({ length: Math.floor(H / 20) }, (_, i) => '<line x1="0" y1="' + (i + 1) * 20 + '" x2="' + B + '" y2="' + (i + 1) * 20 + '" stroke="#ebe3d6" stroke-width=".6"/>').join("")
    + '<ellipse cx="82" cy="373" rx="46" ry="5" fill="#e2d8c7"/><ellipse cx="262" cy="373" rx="30" ry="3.5" fill="#e2d8c7"/>'
    + '<defs><clipPath id="kpTafel"><rect x="' + tafel.x + '" y="' + tafel.y + '" width="' + tafel.w + '" height="' + tafel.h + '" rx="8"/></clipPath></defs>'
    + '<rect x="' + tafel.x + '" y="' + tafel.y + '" width="' + tafel.w + '" height="' + tafel.h + '" rx="8" fill="#fbf8f2" stroke="#d6c9b4" stroke-width="1"/>'
    + kopf.svg
    + '<rect x="' + tafel.x + '" y="' + tafel.y + '" width="' + tafel.w + '" height="' + tafel.h + '" rx="8" fill="none" stroke="#cbbba2" stroke-width="1.4"/>'
    + vorn.svg + hinten.svg;

  /* Welche Stelle für welches Wort — Kopfteile auf der großen Tafel,
     Rücken, Nacken, Po und Wade am Menschen von hinten. */
  const Vp = vorn.punkte, Hp = hinten.punkte, Kp = kopf.punkte;
  const mitte = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const ziel = {
    haar: [Kp.haar[0], Kp.haar[1] + 4, 40, 12], stirn: [Kp.stirn[0], Kp.stirn[1], 18, 10], auge: [Kp.auge[0], Kp.auge[1], 14, 8],
    nase: [Kp.nase[0], Kp.nase[1], 12, 12], ohr: [Kp.ohr[0], Kp.ohr[1], 14, 18], mund: [Kp.mund[0], Kp.mund[1], 16, 8],
    kinn: [Kp.kinn[0], Kp.kinn[1] - 1, 16, 8], wange: [Kp.wange[0], Kp.wange[1], 14, 12],
    kopf: [...mitte(Vp.scheitel, Vp.kinn), 22, 26],
    hals: [Vp.hals[0], Vp.hals[1] + 2, 14, 9], nacken: [Hp.nacken[0], Hp.nacken[1] + 1, 12, 8],
    schulter: [Vp.schulterR[0] - 1, Vp.schulterR[1], 14, 12], brust: [Vp.brust[0], Vp.brust[1], 18, 14],
    arm: [Vp.oberarmR[0], Vp.oberarmR[1], 12, 20], ellbogen: [Vp.ellbogenR[0], Vp.ellbogenR[1], 12, 10],
    handgelenk: [Vp.handgelenkL[0], Vp.handgelenkL[1], 12, 8], hand: [Vp.handL[0], Vp.handL[1] + 2, 14, 12],
    finger: [Vp.fingerL[0], Vp.fingerL[1] + 2, 14, 10],
    ruecken: [Hp.ruecken[0], Hp.ruecken[1], 22, 24], bauch: [Vp.nabel[0] + 13, Vp.nabel[1] - 9, 14, 12],
    nabel: [Vp.nabel[0], Vp.nabel[1], 8, 7], taille: [Vp.tailleL[0] - 3, Vp.tailleL[1], 10, 12],
    huefte: [Vp.huefteR[0] + 2, Vp.huefteR[1], 12, 12], po: [Hp.gesaess[0] + 3, Hp.gesaess[1], 18, 12],
    oberschenkel: [Vp.oberschenkelR[0], Vp.oberschenkelR[1], 16, 26], knie: [Vp.knieL[0], Vp.knieL[1], 14, 12],
    bein: [Vp.unterschenkelR[0], Vp.unterschenkelR[1], 12, 26], wade: [Hp.wadeL[0], Hp.wadeL[1], 12, 18],
    knoechel: [Vp.knoechelL[0] + 2, Vp.knoechelL[1], 10, 8], fuss: [Vp.fussR[0], Vp.fussR[1] + 1, 18, 9],
    zeh: [Vp.zehL[0] + 2, Vp.zehL[1], 12, 7],
  };
  S.d.teile = S.d.teile.filter((t) => t.id !== "scheide");
  /* Vom Arm aus führt eine Lupe zur neuen Tafel „Die Muskeln“. */
  S.d.teile.forEach((t) => { if (t.id === "arm") t.lupe = "muskeln"; });
  /* FASSUNG 836: Von der Hüfte aus führt eine Lupe zur Tafel „Die
     Geschlechtsorgane“ (Längsschnitt Becken, werkzeug/bau-836-geschlechtsorgane.js). */
  S.d.teile.forEach((t) => { if (t.id === "huefte") t.lupe = "geschlechtsorgane"; });
  S.d.teile.forEach((t) => {
    const z = ziel[t.id];
    if (!z) { console.log("  ?? kein Ziel für", t.id); return; }
    t.x = r1(z[0]); t.y = r1(z[1]);
    t.kunst = flaeche(z[2], z[3]);
  });
  S.d.kulisse = kulisse;
  speichere(S);
  const ueber = ueberlappung(S.d.teile);
  console.log("koerper: " + S.d.teile.length + " Teile, Kulisse " + (kulisse.length / 1024).toFixed(0) + " KB" + (ueber.length ? "  Überlappung: " + ueber.join(", ") : ""));
  return S.d.teile.length;
}
function ueberlappung(teile) {
  const box = (t) => { const m = /x="([-\d.]+)" y="([-\d.]+)" width="([\d.]+)" height="([\d.]+)"/.exec(t.kunst); return m ? [t.x + +m[1], t.y + +m[2], +m[3], +m[4]] : null; };
  const out = [];
  for (let i = 0; i < teile.length; i++) for (let j = i + 1; j < teile.length; j++) {
    const a = box(teile[i]), b = box(teile[j]);
    if (!a || !b) continue;
    const ox = Math.min(a[0] + a[2], b[0] + b[2]) - Math.max(a[0], b[0]), oy = Math.min(a[1] + a[3], b[1] + b[3]) - Math.max(a[1], b[1]);
    if (ox > 2 && oy > 2) out.push(teile[i].id + "/" + teile[j].id);
  }
  return out;
}

/* ================================================================
   KOERPERBAU — die vier Menschen neu (in Unterwäsche)
   ================================================================ */
function bauKoerperbau() {
  const S = lade("koerperbau");
  const leute = {
    mann_vorn: { geschlecht: "m", blick: 0, frisur: "kurz", haarfarbe: "braun" },
    mann_hinten: { geschlecht: "m", blick: 180, frisur: "kurz", haarfarbe: "braun" },
    frau_vorn: { geschlecht: "w", blick: 0, frisur: "dutt", haarfarbe: "braun" },
    frau_hinten: { geschlecht: "w", blick: 180, frisur: "dutt", haarfarbe: "braun" },
  };
  /* Wort → gerechnete Stelle. Links im Bild liegt beim Menschen von vorn
     seine rechte Seite (R), von hinten seine linke (L). */
  const WEG = { genital: 1, warzenhof: 1, brustwarze: 1, after: 1 };
  Object.keys(leute).forEach((id) => {
    const t = S.d.teile.find((x) => x.id === id);
    if (!t) return;
    const L = leute[id];
    const vornAnsicht = L.blick === 0;
    const kl = L.geschlecht === "w"
      ? { oberteil: { stueck: "sporttop", farbe: "grau" }, unterteil: { stueck: "unterhose", farbe: "grau" } }
      : { unterteil: { stueck: "boxershorts", farbe: "grau" } };
    const roh = M.zeichne({ alter: "erwachsen", geschlecht: L.geschlecht, blick: L.blick, pose: "lehrbuch", frisur: L.frisur, haarfarbe: L.haarfarbe, haut: "hell", kleidung: kl, id: "kb" + id.replace("_", "") });
    const z = t.zoom;
    const k = (z.h - 7) / roh.hoehe;
    const fussY = z.y + z.h - 3;
    t.kunst = '<g transform="translate(0,' + r1(fussY - t.y) + ") scale(" + k.toFixed(4) + ')">' + roh.svg + "</g>";
    const P = (n) => [t.x + roh.punkte[n][0] * k, fussY + roh.punkte[n][1] * k];
    const aussen = vornAnsicht ? "R" : "L", innen = vornAnsicht ? "L" : "R";
    const stelle = {
      stirn: "stirn", auge: "auge", nase: "nase", ohr: "ohr", mund: "mund", kinn: "kinn", hals: "hals",
      hinterkopf: "hinterkopf", nacken: "nacken",
      schulter: "schulter" + aussen, achsel: "achsel" + aussen, bauch: "bauch", nabel: "nabel",
      taille: "taille" + innen, huefte: "huefte" + aussen, leiste: "leiste", brust: "brust",
      schulterblatt: "schulterblatt", ruecken: "ruecken", lende: "lende", gesaess: "gesaess",
      oberarm: "oberarm" + aussen, ellbogen: "ellbogen" + aussen, unterarm: "unterarm" + aussen,
      handgelenk: "handgelenk" + aussen, hand: "hand" + aussen, finger: "finger" + aussen,
      oberschenkel: "oberschenkel" + aussen, knie: "knie" + aussen, kniekehle: "kniekehle" + aussen,
      unterschenkel: "unterschenkel" + aussen, wade: "wade" + aussen, knoechel: "knoechel" + innen,
      fuss: "fuss" + aussen, zeh: "zeh" + innen, ferse: "ferse" + aussen,
    };
    const vorher = t.unter.length;
    t.unter = t.unter.filter((u) => !WEG[u.id]);
    t.unter.forEach((u) => {
      const n = stelle[u.id];
      if (!n || !roh.punkte[n]) { console.log("  ?? " + id + "/" + u.id); return; }
      const p = P(n);
      u.x = r1(p[0]); u.y = r1(p[1]);
      const klein = /auge|nase|mund|kinn|ohr|nabel|stirn|finger|zeh|knoechel|ferse|handgelenk|achsel|leiste/.test(u.id);
      u.kunst = flaeche(klein ? 4.4 : 6.5, klein ? 3.6 : 6);
    });
    console.log("koerperbau/" + id + ": " + vorher + " -> " + t.unter.length + " Teile, " + (t.kunst.length / 1024).toFixed(1) + " KB");
  });
  speichere(S);
}

/* ================================================================
   MUSKELN — neue Tafel „Die Muskeln“ (von vorn und von hinten)
   ================================================================ */
const MUSKEL_WORT = {
  deltamuskel: ["der Deltamuskel", "DEL-ta-mus-kel", "il deltoide", "del-TOI-de", "deltoid muscle"],
  brustmuskel: ["der Brustmuskel", "BRUST-mus-kel", "il pettorale", "pet-to-RA-le", "pectoral muscle"],
  bizeps: ["der Bizeps", "BI-zeps", "il bicipite", "bi-CI-pi-te", "biceps"],
  unterarmmuskeln: ["die Unterarmmuskeln", "UN-ter-arm-mus-keln", "i muscoli dell'avambraccio", "MU-sco-li del-la-vam-BRAC-cio", "forearm muscles"],
  bauchmuskeln: ["die Bauchmuskeln", "BAUCH-mus-keln", "gli addominali", "ad-do-mi-NA-li", "abdominal muscles"],
  schraeger: ["der schräge Bauchmuskel", "SCHRÄ-ge BAUCH-mus-kel", "l'obliquo esterno", "o-BLI-quo e-STER-no", "external oblique"],
  oberschenkelmuskel: ["der Oberschenkelmuskel", "O-ber-schen-kel-mus-kel", "il quadricipite", "qua-dri-CI-pi-te", "quadriceps"],
  kniesehne: ["die Kniesehne", "KNIE-seh-ne", "il tendine rotuleo", "TEN-di-ne ro-tu-LE-o", "patellar tendon"],
  schienbeinmuskel: ["der Schienbeinmuskel", "SCHIEN-bein-mus-kel", "il tibiale anteriore", "ti-BIA-le an-te-RIO-re", "tibialis anterior"],
  kapuzenmuskel: ["der Kapuzenmuskel", "ka-PU-zen-mus-kel", "il trapezio", "tra-PE-zio", "trapezius"],
  trizeps: ["der Trizeps", "TRI-zeps", "il tricipite", "tri-CI-pi-te", "triceps"],
  rueckenmuskel: ["der breite Rückenmuskel", "BREI-te RÜ-cken-mus-kel", "il gran dorsale", "GRAN dor-SA-le", "latissimus dorsi"],
  gesaessmuskel: ["der Gesäßmuskel", "ge-SÄSS-mus-kel", "il grande gluteo", "GRAN-de GLU-teo", "gluteus maximus"],
  beinbeuger: ["der Beinbeuger", "BEIN-beu-ger", "i muscoli ischiocrurali", "i-schio-cru-RA-li", "hamstrings"],
  wadenmuskel: ["der Wadenmuskel", "WA-den-mus-kel", "il gastrocnemio", "ga-stro-CNE-mio", "calf muscle"],
  achillessehne: ["die Achillessehne", "a-CHIL-les-seh-ne", "il tendine d'Achille", "TEN-di-ne da-KIL-le", "Achilles tendon"],
};
function bauMuskeln() {
  const pfad = path.join(WURZEL, "szenen", "muskeln.js");
  const B = 400, H = 300;
  const mensch = { alter: "erwachsen", geschlecht: "m", haut: "hell", frisur: "kurz", haarfarbe: "braun", pose: "lehrbuch", muskeln: true };
  const k = 272 / 178;
  const vorn = figur(Object.assign({ id: "mv", blick: 0 }, mensch), 110, 290, k);
  const hinten = figur(Object.assign({ id: "mh", blick: 180 }, mensch), 290, 290, k);
  const V = vorn.punkte, Hh = hinten.punkte;
  /* [Wort, Stelle, Ansicht, Seite der Beschriftung] — vorn: links im Bild
     ist die rechte Körperseite (R); hinten: links im Bild die linke (L). */
  const liste = [
    ["deltamuskel", V.deltamuskelR, "l"], ["brustmuskel", V.brustmuskelL, "m"], ["bizeps", V.bizepsR, "l"],
    ["unterarmmuskeln", V.unterarmmuskelnR, "l"], ["bauchmuskeln", V.bauchmuskeln, "m"], ["schraeger", V.schraegerR, "l"],
    ["oberschenkelmuskel", V.oberschenkelmuskelR, "l"], ["kniesehne", V.kniesehneL, "m"], ["schienbeinmuskel", V.schienbeinmuskelR, "l"],
    ["kapuzenmuskel", Hh.kapuzenmuskelR, "r"], ["trizeps", Hh.trizepsR, "r"], ["rueckenmuskel", Hh.rueckenmuskelL, "m"],
    ["gesaessmuskel", Hh.gesaessmuskelR, "r"], ["beinbeuger", Hh.beinbeugerR, "r"], ["wadenmuskel", Hh.wadenmuskelL, "m"],
    ["achillessehne", Hh.achillessehneR, "r"],
  ];
  let kulisse = '<rect x="0" y="0" width="' + B + '" height="' + H + '" fill="#f6efe7"/>';
  for (let x = 20; x < B; x += 20) kulisse += '<line x1="' + x + '" y1="0" x2="' + x + '" y2="' + H + '" stroke="#ece3d5" stroke-width=".5"/>';
  for (let y = 20; y < H; y += 20) kulisse += '<line x1="0" y1="' + y + '" x2="' + B + '" y2="' + y + '" stroke="#ece3d5" stroke-width=".5"/>';
  kulisse += '<ellipse cx="110" cy="291" rx="40" ry="4" fill="#e2d8c7"/><ellipse cx="290" cy="291" rx="40" ry="4" fill="#e2d8c7"/>';
  kulisse += vorn.svg + hinten.svg;
  /* Beschriftungen: links außen, in der Mitte zwischen beiden Figuren, rechts außen */
  const spalten = { l: [], m: [], r: [] };
  liste.forEach((e) => spalten[e[2]].push(e));
  const tx = { l: 3, m: 200, r: 397 }, anker = { l: "start", m: "middle", r: "end" };
  Object.keys(spalten).forEach((sp) => {
    spalten[sp].sort((a, b) => a[1][1] - b[1][1]).forEach((e, n, arr) => {
      const y = Math.max(e[1][1], 22 + n * (250 / arr.length));
      const wort = MUSKEL_WORT[e[0]][0];
      if (sp === "m") {
        const links = e[1][0] < 200;
        kulisse += beschriftung(e[1], [links ? 158 : 242, y], wort, 4.2, links ? "start" : "end").replace('class="bw-beschriftung"', 'class="bw-beschriftung bw-immer"');
      } else {
        kulisse += beschriftung(e[1], [tx[sp], y], wort, 4.2, anker[sp]).replace('class="bw-beschriftung"', 'class="bw-beschriftung bw-immer"');
      }
    });
  });
  const teile = liste.map((e) => {
    const w = MUSKEL_WORT[e[0]];
    return { id: "mu_" + e[0], de: w[0], syl: w[1], it: w[2], itSyl: w[3], en: w[4], x: r1(e[1][0]), y: r1(e[1][1]), kunst: flaeche(12, 11) };
  });
  const d = { id: "muskeln", titel: "Die Muskeln", emoji: "💪", thema: "Körper", detail: true, breite: B, hoehe: H, kulisse, teile };
  const txt = "/* FASSUNG 834 — Die Muskeln (Tafel wie im Anatomiebuch), gebaut von\n   werkzeug/bau-834-lehrbuch.js mit figuren/mensch.js (Muskelbild).\n   Nicht von Hand ändern. */\nwindow.DMA_SZENE = window.DMA_SZENE || {};\nwindow.DMA_SZENE[\"muskeln\"] = " + JSON.stringify(d) + ";\n";
  fs.writeFileSync(pfad, txt);
  const u = ueberlappung(teile);
  console.log("muskeln: " + teile.length + " Teile, " + (txt.length / 1024).toFixed(0) + " KB" + (u.length ? "  Überlappung: " + u.join(", ") : ""));
}

/* ================================================================
   Aufruf
   ================================================================ */
module.exports = { beschriftung, figur, flaeche, lade, speichere, M, r1, esc, ueberlappung };
if (require.main === module) {
  if (soll("koerper")) bauKoerper();
  if (soll("koerperbau")) bauKoerperbau();
  if (soll("entstehung")) require("./bau-834-entstehung.js").bau();
  if (soll("koerper_innen")) require("./bau-834-organe.js").bau();
  if (soll("muskeln")) bauMuskeln();
}
