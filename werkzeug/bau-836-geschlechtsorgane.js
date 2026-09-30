#!/usr/bin/env node
/* =====================================================================
   FASSUNG 836 — TAFEL „DIE GESCHLECHTSORGANE“ (LÄNGSSCHNITT DURCH DAS BECKEN)
   ---------------------------------------------------------------------
   Auftrag (Hauptagent, nach XANDER Funk 217 „realistische Menschen …
   alles im Detail“): im Lehrbuch der Bilderwelt „Körper“ eine Tafel
   wie im Biologiebuch — schematische, beschriftete Schnittzeichnung
   (Längsschnitt Becken, Blick von der Seite) für Mann und Frau, innere
   und äußere Organe mit deutschen Fachwörtern samt Artikel.

   Leitplanke: sachlich wie ein medizinischer Atlas. Flache Farben, dünne
   Konturen, keine Figuren, kein Fotorealismus, nur der Beckenausschnitt
   im Schnitt. Die Beschriftungen (bw-beschriftung) erscheinen wie bei
   den Organkarten in der Lupe beim Entdecken; jedes Teil hat eine
   Trefferfläche und Wort, Silben, Italienisch, Englisch.

   Vorn (Bauch) ist links im Bild, hinten (Rücken) rechts.

   FASSUNG 838 — XANDER (Funk 222): „Quatsch mit dem After wo man dann so
   den Dünndarm … der geht nicht gerade nach oben schau an wie das
   realistisch in der Biologie ist“. Nach dem Lehrbuchschema (medianer
   Sagittalschnitt) korrigiert:
   - Das Kreuzbein ist nach vorn hohl (Kreuzbeinkrümmung): oben das
     Promontorium, in der Mitte weit hinten, das Steißbein zeigt nach
     vorn unten.
   - Der Mastdarm (Rektum) liegt in dieser Höhlung und folgt der Krümmung
     des Kreuzbeins; oben geht er in den Sigmadarm über (neu beschriftet:
     „der Sigmadarm“), unten weitet er sich zur Ampulle, die vor dem
     Steißbein nach vorn zieht. Am Beckenboden knickt der Analkanal
     nach hinten unten ab (anorektaler Winkel, etwa 100–110°) zum After.
     Vorher lief der Darm als gerades Rohr senkrecht nach oben.
   - Mann: die Prostata liegt unter der Blase unmittelbar VOR der
     Ampulle (dort tastet man sie), die Samenbläschen hinten oben an der
     Blase zwischen Blase und Mastdarm; Samenleiter und Harnröhre folgen.
   - Frau: Gebärmutter nach vorn geneigt und gebeugt (Anteversio-
     Anteflexio) über der Blase, der Gebärmutterhals zeigt nach hinten
     unten in die Scheide; die Scheide steigt von der Öffnung nach hinten
     oben und liegt direkt vor dem Mastdarm; von vorn nach hinten:
     Kitzler, Harnröhrenöffnung, Scheidenöffnung, Damm, After.
   Weiterhin: nur Schema, beschriftet, Erwachsene, keine Figuren.

   Aufruf:  node werkzeug/bau-836-geschlechtsorgane.js
            schreibt szenen/geschlechtsorgane.js
   ===================================================================== */
"use strict";
const fs = require("fs");
const path = require("path");
const L = require("./bau-834-lehrbuch.js");
const { r1, flaeche, beschriftung } = L;
const WURZEL = path.dirname(__dirname);
/* FASSUNG 840 — XANDER (Funk 225): „für die Bilderwelt möchte ich meine alte Version wieder zurück haben … und nur eine Option als Link zur neuen Version“. Die neue Bilderwelt (834/836/838) liegt jetzt in bilderwelt-neu/. */

function kurve(pts, zu) {
  const n = pts.length, P = (i) => zu ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))];
  let d = "M" + r1(pts[0][0]) + " " + r1(pts[0][1]);
  for (let i = 0; i < (zu ? n : n - 1); i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    d += "C" + r1(p1[0] + (p2[0] - p0[0]) / 6) + " " + r1(p1[1] + (p2[1] - p0[1]) / 6) + " " + r1(p2[0] - (p3[0] - p1[0]) / 6) + " " + r1(p2[1] - (p3[1] - p1[1]) / 6) + " " + r1(p2[0]) + " " + r1(p2[1]);
  }
  return d + (zu ? "Z" : "");
}
const pfad = (d, f, s, w, extra) => '<path d="' + d + '" fill="' + (f || "none") + '"' + (s ? ' stroke="' + s + '" stroke-width="' + (w || 0.4) + '" stroke-linecap="round" stroke-linejoin="round"' : "") + (extra || "") + "/>";
const form = (pts, f, s, w) => pfad(kurve(pts, true), f, s, w);
const rohr = (pts, aussen, innen, w) => pfad(kurve(pts), "none", aussen, w + 0.7) + pfad(kurve(pts), "none", innen, w);

/* Farben wie im Schulbuch */
const HAUT = "#f3dccb", HAUT_R = "#b98f78", INNEN = "#fbf1e9", KNOCHEN = "#efe6cf", KNOCHEN_R = "#a99873";
const BLASE = "#f3e3a6", BLASE_R = "#b39a45", DARM = "#dcb29a", DARM_R = "#9c705c";
const ORGAN = "#e7a7a4", ORGAN_R = "#9e5a5c", ROSA = "#eab4b6", HARN = "#e2b84c";

/* FASSUNG 838: Mastdarm und Analkanal (für Zeichnung und Sonde) */
const MASTDARM = [[16, -46], [21, -37], [24, -26], [23, -16], [17, -7], [8, -2]];
const ANALKANAL = [[8, -2], [10, 6], [13, 14], [15, 21.5]];

/* Gemeinsam: Beckenausschnitt mit Schambein, Kreuz- und Steißbein, Mastdarm. */
function becken(frau) {
  let s = "";
  /* Körperumriss im Schnitt: Bauchwand vorn, Damm unten, Gesäß hinten */
  const umriss = frau
    ? [[-31, -50], [-30, -20], [-30, -2], [-32, 6], [-28, 13], [-22, 19], [-12, 22], [2, 24], [12, 23], [24, 18], [33, 6], [35, -20], [33, -50]]
    : [[-31, -50], [-30, -20], [-29, -2], [-30, 5], [-26, 11], [-20, 18], [-8, 23], [4, 24], [12, 23], [24, 18], [33, 6], [35, -20], [33, -50]];
  s += form(umriss, INNEN, HAUT_R, 0.6);
  /* Hautsaum als Schnittkante */
  s += pfad(kurve(umriss.slice(0, -1)), "none", HAUT, 1.6) + pfad(kurve(umriss.slice(0, -1)), "none", HAUT_R, 0.4);
  /* Kreuzbein und Steißbein hinten — nach vorn hohl (Kreuzbeinkrümmung),
     das Steißbein zeigt nach vorn unten. */
  const KB = [[21, -50], [26, -41], [29, -30], [29, -19], [26, -9], [21, -1], [17, 3]];
  s += rohr(KB, KNOCHEN_R, KNOCHEN, 4.2);
  /* Wirbelgrenzen quer zur Krümmung */
  for (let i = 1; i < KB.length - 1; i++) {
    const a = KB[i - 1], b = KB[i + 1], tx = b[0] - a[0], ty = b[1] - a[1], l = Math.hypot(tx, ty);
    s += pfad("M" + r1(KB[i][0] + ty / l * 2.2) + " " + r1(KB[i][1] - tx / l * 2.2) + "L" + r1(KB[i][0] - ty / l * 2.2) + " " + r1(KB[i][1] + tx / l * 2.2), "none", KNOCHEN_R, 0.35);
  }
  /* Schambein vorn (quer geschnitten) */
  s += form([[-26, -8], [-20, -10], [-17, -4], [-19, 4], [-24, 6], [-27, 0]], KNOCHEN, KNOCHEN_R, 0.5);
  /* Sigmadarm (von oben vorn) → Mastdarm in der Kreuzbeinhöhlung →
     Ampulle vor dem Steißbein → Analkanal nach hinten unten → After. */
  s += rohr([[-2, -50], [5, -53], [12, -51], [16, -46]], DARM_R, DARM, 4.6);
  s += '<g data-teil="mastdarm">' + rohr(MASTDARM, DARM_R, DARM, 5.2) + "</g>";
  s += '<g data-teil="analkanal">' + rohr(ANALKANAL, DARM_R, DARM, 3.2) + "</g>";
  /* Schließmuskel am Analkanal */
  s += pfad(kurve([[9.5, 9], [12.5, 8]]), "none", "#b0786a", 1.1) + pfad(kurve([[11.5, 16], [14.5, 15]]), "none", "#b0786a", 1.1);
  s += '<ellipse cx="15.2" cy="22.2" rx="2" ry="1.1" fill="' + DARM_R + '"/>';
  return s;
}

function mann() {
  let s = becken(false);
  /* Harnblase hinter dem Schambein */
  s += form([[-20, -26], [-14, -35], [-4, -35], [3, -28], [3, -18], [-3, -12], [-13, -11], [-19, -16]], BLASE, BLASE_R, 0.5);
  s += pfad(kurve([[-15, -26], [-8, -30], [-1, -25]]), "none", "#d9c36e", 0.4);
  /* Samenbläschen hinten oben an der Blase, zwischen Blase und Mastdarm */
  s += form([[3, -24], [8, -28], [13, -25], [11, -17], [6, -14], [3, -17]], "#eccda4", "#a88355", 0.45);
  s += pfad(kurve([[5, -22], [9, -24], [7, -20], [10, -18]]), "none", "#c9a577", 0.3);
  /* Vorsteherdrüse (Prostata) unter der Blase, direkt vor der Ampulle */
  s += form([[-10, -12], [-2, -13], [4, -8], [3, 0], [-4, 2], [-10, -3]], "#d69b98", "#9e5a5c", 0.5);
  /* Penis mit Schwellkörper und Eichel, Hodensack mit Hoden und Nebenhoden */
  s += form([[-28, 2], [-24, 4], [-27, 14], [-31, 26], [-35, 34], [-38, 36], [-40, 33], [-36, 24], [-33, 12], [-31, 4]], HAUT, HAUT_R, 0.5);
  s += form([[-28.5, 5], [-26, 6], [-29, 15], [-33, 25], [-35.5, 30], [-37, 29], [-34, 22], [-31, 12]], "#d98f8a", "#a45f5d", 0.35);
  s += form([[-35, 30], [-33, 33], [-35, 37.5], [-39.5, 37], [-40.5, 33], [-37.5, 29.5]], "#eaa3a2", "#a45f5d", 0.45);
  s += form([[-24, 12], [-14, 14], [-9, 22], [-12, 32], [-20, 35], [-26, 30], [-27, 20]], HAUT, HAUT_R, 0.55);
  s += '<ellipse cx="-18" cy="25" rx="5" ry="6.6" fill="#f0d4cb" stroke="#a86e66" stroke-width=".45" transform="rotate(-18 -18 25)"/>';
  s += pfad(kurve([[-15, 18.5], [-12, 21], [-12, 27], [-14.5, 31]]), "none", "#c98f82", 2.2) + pfad(kurve([[-15, 18.5], [-12, 21], [-12, 27], [-14.5, 31]]), "none", "#e3b3a5", 1.3);
  /* Samenleiter: vom Nebenhoden hinauf, vor dem Schambein über die Blase, hinten zum Samenbläschen */
  s += rohr([[-13, 20], [-17, 12], [-23, 2], [-27, -10], [-26, -26], [-18, -38], [-6, -38], [3, -32], [7, -24], [3, -12], [0, -7]], "#8a6a8c", "#c7a6c9", 0.9);
  /* Harnröhre: Blasenhals durch die Prostata und den Penis bis zur Spitze */
  s += pfad(kurve([[-7, -11], [-4, -5], [-5, 2], [-11, 4], [-18, 4], [-26, 5], [-30, 14], [-34, 24], [-38, 35.5]]), "none", HARN, 0.9);
  return { svg: s, teile: {
    m_harnblase: [-10, -24, "l"], m_harnroehre: [-29, 14, "l"], m_prostata: [-2, -5, "r"], m_samenblaeschen: [8, -22, "r"], m_sigmadarm: [6, -52, "r"],
    m_samenleiter: [-24, -32, "l"], m_hoden: [-19, 25, "r"], m_nebenhoden: [-12.5, 23, "r"], m_hodensack: [-14, 32, "r"],
    m_penis: [-32, 18, "l"], m_schwellkoerper: [-31.5, 19, "l"], m_eichel: [-38, 34.5, "l"], m_schambein: [-22, -2, "l"],
    m_mastdarm: [23, -24, "r"], m_after: [15, 22, "r"], m_kreuzbein: [29, -34, "r"],
  } };
}

function frau() {
  let s = becken(true);
  /* Harnblase vorn unten, unter der Gebärmutter */
  s += form([[-24, -16], [-19, -24], [-10, -23], [-7, -16], [-10, -9], [-18, -8]], BLASE, BLASE_R, 0.5);
  /* Gebärmutter (nach vorn geneigt) mit Höhle, Gebärmutterhals und Muttermund */
  s += form([[-22, -32], [-16, -40], [-6, -41], [2, -35], [5, -24], [6, -15], [3, -11], [-1, -13], [-4, -22], [-12, -26]], ORGAN, ORGAN_R, 0.6);
  s += pfad(kurve([[-15, -34], [-8, -35], [-2, -30], [1, -22], [2, -15]]), "none", "#b35f62", 0.6);
  s += pfad(kurve([[1, -18], [4, -15], [3, -12]]), "none", ORGAN_R, 0.35);
  /* Eierstock und Eileiter (seitlich, dahinter) */
  s += rohr([[-14, -40], [-8, -45], [2, -47], [10, -44], [13, -39]], "#b87376", "#e3a2a4", 0.9);
  [0, 1, 2, 3].forEach((i) => { s += pfad("M" + r1(12 + i * 0.6) + " " + r1(-39.5 + i * 0.4) + "l" + r1(1.4 + i * 0.3) + " 2", "none", "#b87376", 0.45); });
  s += '<ellipse cx="9" cy="-36" rx="4.2" ry="2.8" fill="#f2d3b4" stroke="#a88355" stroke-width=".45" transform="rotate(-20 9 -36)"/>';
  [[7.6, -36.3], [10, -35.4], [9.2, -37.2]].forEach((q) => { s += '<circle cx="' + q[0] + '" cy="' + q[1] + '" r=".6" fill="#fbeedd" stroke="#c9a577" stroke-width=".2"/>'; });
  /* Scheide vom Muttermund nach vorn unten zur Scheidenöffnung */
  s += rohr([[4, -13], [2, -5], [-2, 4], [-6, 12], [-9, 20]], "#b86f73", "#eab4b6", 3.2);
  /* Harnröhre: kurz, von der Blase vor der Scheide nach unten */
  s += pfad(kurve([[-16, -8], [-17, 0], [-19, 8], [-20, 16]]), "none", HARN, 0.9);
  /* Äußere Organe im Schnitt: Venushügel, große und kleine Schamlippe, Kitzler */
  s += form([[-30, 5], [-26, 8], [-20, 14], [-12, 20], [-7, 23], [-16, 22.5], [-27, 16]], "#ecc8b4", HAUT_R, 0.45);
  s += form([[-24, 11], [-19, 15], [-12, 19], [-8, 21.5], [-13, 21.2], [-21, 17]], "#dd9c9c", "#a4605f", 0.4);
  s += '<ellipse cx="-25.8" cy="9" rx="1.5" ry="1.1" fill="#d7858a" stroke="#a4605f" stroke-width=".35"/>';
  return { svg: s, teile: {
    f_gebaermutter: [-8, -34, "l"], f_gebaermutterhals: [3, -17, "r"], f_muttermund: [2.5, -12, "r"], f_eileiter: [-3, -46, "l"],
    f_eierstock: [9, -36, "r"], f_scheide: [-2, 4, "r"], f_harnblase: [-17, -16, "l"], f_harnroehre: [-19, 7, "l"], f_sigmadarm: [6, -52, "r"],
    f_kitzler: [-25.8, 9, "l"], f_grosseschamlippe: [-24, 15, "l"], f_kleineschamlippe: [-16, 18.5, "l"],
    f_schambein: [-22, -2, "l"], f_mastdarm: [23, -24, "r"], f_after: [15, 22, "r"], f_kreuzbein: [29, -34, "r"],
  } };
}

const WORT = {
  m_harnblase: ["die Harnblase", "HARN-bla-se", "la vescica", "ve-SCI-ca", "urinary bladder"],
  m_harnroehre: ["die Harnröhre", "HARN-röh-re", "l'uretra", "u-RE-tra", "urethra"],
  m_prostata: ["die Prostata", "PROS-ta-ta", "la prostata", "PRO-sta-ta", "prostate"],
  m_samenblaeschen: ["das Samenbläschen", "SA-men-bläs-chen", "la vescicola seminale", "ve-SCI-co-la se-mi-NA-le", "seminal vesicle"],
  m_samenleiter: ["der Samenleiter", "SA-men-lei-ter", "il dotto deferente", "DOT-to de-fe-REN-te", "vas deferens"],
  m_hoden: ["der Hoden", "HO-den", "il testicolo", "te-STI-co-lo", "testicle"],
  m_nebenhoden: ["der Nebenhoden", "NE-ben-ho-den", "l'epididimo", "e-pi-DI-di-mo", "epididymis"],
  m_hodensack: ["der Hodensack", "HO-den-sack", "lo scroto", "SCRO-to", "scrotum"],
  m_penis: ["der Penis", "PE-nis", "il pene", "PE-ne", "penis"],
  m_schwellkoerper: ["der Schwellkörper", "SCHWELL-kör-per", "il corpo cavernoso", "COR-po ca-ver-NO-so", "erectile tissue"],
  m_eichel: ["die Eichel", "EI-chel", "il glande", "GLAN-de", "glans"],
  m_schambein: ["das Schambein", "SCHAM-bein", "il pube", "PU-be", "pubic bone"],
  m_mastdarm: ["der Mastdarm", "MAST-darm", "il retto", "RET-to", "rectum"],
  m_sigmadarm: ["der Sigmadarm", "SIG-ma-darm", "il colon sigmoideo", "CO-lon sig-moi-DE-o", "sigmoid colon"],
  f_sigmadarm: ["der Sigmadarm", "SIG-ma-darm", "il colon sigmoideo", "CO-lon sig-moi-DE-o", "sigmoid colon"],
  m_after: ["der After", "AF-ter", "l'ano", "A-no", "anus"],
  m_kreuzbein: ["das Kreuzbein", "KREUZ-bein", "l'osso sacro", "OS-so SA-cro", "sacrum"],
  f_gebaermutter: ["die Gebärmutter", "ge-BÄR-mut-ter", "l'utero", "U-te-ro", "uterus"],
  f_gebaermutterhals: ["der Gebärmutterhals", "ge-BÄR-mut-ter-hals", "il collo dell'utero", "COL-lo del-L'U-te-ro", "cervix"],
  f_muttermund: ["der Muttermund", "MUT-ter-mund", "l'orifizio uterino", "o-ri-FI-zio u-te-RI-no", "cervical opening"],
  f_eileiter: ["der Eileiter", "EI-lei-ter", "la tuba di Falloppio", "TU-ba di fal-LOP-pio", "fallopian tube"],
  f_eierstock: ["der Eierstock", "EI-er-stock", "l'ovaio", "o-VA-io", "ovary"],
  f_scheide: ["die Scheide", "SCHEI-de", "la vagina", "va-GI-na", "vagina"],
  f_harnblase: ["die Harnblase", "HARN-bla-se", "la vescica", "ve-SCI-ca", "urinary bladder"],
  f_harnroehre: ["die Harnröhre", "HARN-röh-re", "l'uretra", "u-RE-tra", "urethra"],
  f_kitzler: ["der Kitzler", "KITZ-ler", "il clitoride", "cli-TO-ri-de", "clitoris"],
  f_grosseschamlippe: ["die große Schamlippe", "GRO-ße SCHAM-lip-pe", "il grande labbro", "GRAN-de LAB-bro", "labium majus"],
  f_kleineschamlippe: ["die kleine Schamlippe", "KLEI-ne SCHAM-lip-pe", "il piccolo labbro", "PIC-co-lo LAB-bro", "labium minus"],
  f_schambein: ["das Schambein", "SCHAM-bein", "il pube", "PU-be", "pubic bone"],
  f_mastdarm: ["der Mastdarm", "MAST-darm", "il retto", "RET-to", "rectum"],
  f_after: ["der After", "AF-ter", "l'ano", "A-no", "anus"],
  f_kreuzbein: ["das Kreuzbein", "KREUZ-bein", "l'osso sacro", "OS-so SA-cro", "sacrum"],
};

const B = 368, H = 236;
const KARTEN = [
  { id: "g_mann", de: ["die männlichen Geschlechtsorgane", "MÄNN-li-chen ge-SCHLECHTS-or-ga-ne", "gli organi genitali maschili", "gli OR-ga-ni ge-ni-TA-li ma-SCHI-li", "male reproductive organs"],
    titel: "Der Mann — Längsschnitt", cx: 92, cy: 128, w: 178, h: 196, sk: 1.45, bau: mann },
  { id: "g_frau", de: ["die weiblichen Geschlechtsorgane", "WEIB-li-chen ge-SCHLECHTS-or-ga-ne", "gli organi genitali femminili", "gli OR-ga-ni ge-ni-TA-li fem-mi-NI-li", "female reproductive organs"],
    titel: "Die Frau — Längsschnitt", cx: 276, cy: 128, w: 178, h: 196, sk: 1.45, bau: frau },
];

function bau() {
  let kulisse = '<rect x="0" y="0" width="' + B + '" height="' + H + '" fill="#f6f1ea"/>';
  for (let x = 10; x < B; x += 10) kulisse += '<line x1="' + x + '" y1="0" x2="' + x + '" y2="' + H + '" stroke="#ece4d8" stroke-width=".4"/>';
  for (let y = 10; y < H; y += 10) kulisse += '<line x1="0" y1="' + y + '" x2="' + B + '" y2="' + y + '" stroke="#ece4d8" stroke-width=".4"/>';
  kulisse += '<text x="' + B / 2 + '" y="17" text-anchor="middle" font-size="8" font-family="Helvetica, Arial, sans-serif" fill="#4a3526">Die Geschlechtsorgane</text>'
    + '<text x="' + B / 2 + '" y="26" text-anchor="middle" font-size="4.2" font-family="Helvetica, Arial, sans-serif" fill="#7b5b3c">Schema: Längsschnitt durch das Becken, Blick von der Seite (vorn = links)</text>';
  const teile = KARTEN.map((k) => {
    kulisse += '<rect x="' + (k.cx - k.w / 2) + '" y="' + (k.cy - k.h / 2) + '" width="' + k.w + '" height="' + k.h + '" rx="6" fill="#fffcf8" stroke="#dccfbd" stroke-width=".7"/>'
      + '<text x="' + k.cx + '" y="' + (k.cy - k.h / 2 + 9) + '" text-anchor="middle" font-size="4.6" font-family="Helvetica, Arial, sans-serif" fill="#4a3526">' + k.titel + "</text>";
    const o = k.bau();
    const ids = Object.keys(o.teile);
    let kunst = '<g transform="translate(0,6) scale(' + k.sk + ')">' + o.svg + "</g>";
    const unter = ids.map((uid) => {
      const p = o.teile[uid], w = WORT[uid];
      return { id: uid, de: w[0], syl: w[1], it: w[2], itSyl: w[3], en: w[4], x: r1(k.cx + p[0] * k.sk), y: r1(k.cy + 6 + p[1] * k.sk), kunst: flaeche(5, 4.4) };
    });
    ["l", "r"].forEach((seite) => {
      const liste = ids.filter((uid) => o.teile[uid][2] === seite).sort((a, b) => o.teile[a][1] - o.teile[b][1]);
      liste.forEach((uid, n) => {
        const p = o.teile[uid];
        const ty = -k.h / 2 + 18 + (n + 0.5) * ((k.h - 24) / Math.max(liste.length, 1));
        const tx = seite === "l" ? -k.w / 2 + 3 : k.w / 2 - 3;
        kunst += beschriftung([p[0] * k.sk, 6 + p[1] * k.sk], [tx, ty], WORT[uid][0], 3.3, seite === "l" ? "start" : "end");
      });
    });
    return { id: k.id, de: k.de[0], syl: k.de[1], it: k.de[2], itSyl: k.de[3], en: k.de[4], x: k.cx, y: k.cy, kunst,
      zoom: { x: k.cx - k.w / 2, y: k.cy - k.h / 2, w: k.w, h: k.h }, unter };
  });
  const d = { id: "geschlechtsorgane", titel: "Die Geschlechtsorgane", emoji: "🔬", thema: "Körper", detail: true, breite: B, hoehe: H, kulisse, teile };
  const txt = "/* FASSUNG 836 — Die Geschlechtsorgane: schematischer Längsschnitt durch das\n   Becken (Mann und Frau) wie im Biologiebuch, gebaut von\n   werkzeug/bau-836-geschlechtsorgane.js. Nicht von Hand ändern. */\n"
    + "window.DMA_SZENE = window.DMA_SZENE || {};\nwindow.DMA_SZENE[\"geschlechtsorgane\"] = " + JSON.stringify(d) + ";\n";
  fs.writeFileSync(path.join(WURZEL, "bilderwelt-neu/szenen/geschlechtsorgane.js"), txt);
  console.log("geschlechtsorgane: " + teile.map((t) => t.id + " " + t.unter.length).join(", ") + ", " + (txt.length / 1024).toFixed(0) + " KB");
}
module.exports = { bau, MASTDARM, ANALKANAL };
if (require.main === module) bau();
