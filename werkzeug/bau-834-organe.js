/* =====================================================================
   FASSUNG 834 — „INNEN IM KÖRPER“: DIE ORGANE ALS SCHULBUCHTAFEL
   ---------------------------------------------------------------------
   XANDER (Funk 213): „mit den Organen innere und äußere … die Anatomie
   … realistisch“.
   Jedes Organ auf einer eigenen Karte, gezeichnet wie im Anatomieatlas
   (Gehirn von der Seite, Herz und Lunge von vorn, Niere im Längsschnitt
   …), mit Lupe und den bisherigen Einzelteilen an ihren richtigen
   Stellen; die Beschriftungen erscheinen in der Lupe beim Entdecken.
   Unten die Gewebe: Knochen, Muskel, Ader, Blut, Haut im Schnitt.
   Aufgerufen von werkzeug/bau-834-lehrbuch.js.
   ===================================================================== */
"use strict";
const L = require("./bau-834-lehrbuch.js");
const { r1, flaeche } = L;

const SCHRIFT = 'font-family="Helvetica, Arial, sans-serif"';
const kreis = (x, y, r, f, s, w, extra) => '<circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="' + r1(r) + '" fill="' + f + '"' + (s ? ' stroke="' + s + '" stroke-width="' + (w || 0.4) + '"' : "") + (extra || "") + "/>";
const ellipse = (x, y, rx, ry, f, s, w, dreh, extra) => '<ellipse cx="' + r1(x) + '" cy="' + r1(y) + '" rx="' + r1(rx) + '" ry="' + r1(ry) + '" fill="' + f + '"' + (s ? ' stroke="' + s + '" stroke-width="' + (w || 0.4) + '"' : "") + (dreh ? ' transform="rotate(' + dreh + " " + r1(x) + " " + r1(y) + ')"' : "") + (extra || "") + "/>";
const pfad = (d, f, s, w, extra) => '<path d="' + d + '" fill="' + (f || "none") + '"' + (s ? ' stroke="' + s + '" stroke-width="' + (w || 0.4) + '" stroke-linecap="round" stroke-linejoin="round"' : "") + (extra || "") + "/>";
function kurve(pts, zu) {
  const n = pts.length, P = (i) => zu ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))];
  let d = "M" + r1(pts[0][0]) + " " + r1(pts[0][1]);
  for (let i = 0; i < (zu ? n : n - 1); i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    d += "C" + r1(p1[0] + (p2[0] - p0[0]) / 6) + " " + r1(p1[1] + (p2[1] - p0[1]) / 6) + " " + r1(p2[0] - (p3[0] - p1[0]) / 6) + " " + r1(p2[1] - (p3[1] - p1[1]) / 6) + " " + r1(p2[0]) + " " + r1(p2[1]);
  }
  return d + (zu ? "Z" : "");
}
let gz = 0;
function verlauf(a, b, winkel) {
  const id = "ki" + (gz++);
  const w = (winkel || 35) * Math.PI / 180;
  return { id, def: '<linearGradient id="' + id + '" x1="' + r1(0.5 - Math.cos(w) / 2) + '" y1="' + r1(0.5 - Math.sin(w) / 2) + '" x2="' + r1(0.5 + Math.cos(w) / 2) + '" y2="' + r1(0.5 + Math.sin(w) / 2) + '"><stop offset="0" stop-color="' + a + '"/><stop offset="1" stop-color="' + b + '"/></linearGradient>', url: "url(#" + id + ")" };
}
const ROT = "#c0392b", BLAU = "#3b6fb6";

/* Jedes Organ in eigenen Koordinaten, etwa ±24 × ±26. teile: [x, y, seite] */
const ORGAN = {};

ORGAN.gehirn = () => {
  const v = verlauf("#f3c9c9", "#d99a9f", 60);
  let s = "<defs>" + v.def + "</defs>";
  /* Hirnstamm und Kleinhirn hinten unten, dann das Großhirn darüber (Blick von links) */
  s += pfad(kurve([[3, 8], [6, 14], [5, 22], [1, 23], [-1, 16], [-2, 10]], true), "#e2b2a8", "#a86e6a", 0.4);
  s += pfad(kurve([[4, 9], [13, 7], [19, 11], [18, 17], [11, 19], [5, 15]], true), "#e6b4b0", "#a86e6a", 0.45);
  for (let i = 0; i < 6; i++) s += pfad("M" + (7 + i * 0.4) + " " + (10 + i * 1.5) + "Q" + (12 + i * 0.3) + " " + (8.5 + i * 1.6) + " " + (17.5 - i * 0.3) + " " + (11.5 + i * 1.3), "none", "#b97f7c", 0.3);
  const gross = kurve([[-21, 2], [-22, -8], [-15, -17], [-3, -20], [9, -18], [18, -11], [21, -2], [18, 7], [10, 9], [2, 8], [-6, 10], [-14, 9]], true);
  s += pfad(gross, v.url, "#a86e6a", 0.55);
  /* Windungen */
  const windungen = [
    [[-18, -6], [-14, -9], [-10, -6], [-7, -10], [-3, -8]], [[-19, 1], [-15, -2], [-12, 2], [-8, -1], [-5, 3], [-1, 0]],
    [[-15, -14], [-11, -12], [-8, -15], [-4, -13]], [[3, -16], [6, -13], [9, -15], [12, -11], [15, -9]],
    [[4, -8], [8, -6], [11, -8], [15, -4], [18, -3]], [[2, 1], [6, -1], [10, 2], [14, 1], [17, 4]],
    [[-12, 6], [-8, 4], [-4, 7], [0, 5], [3, 6]],
  ];
  windungen.forEach((w) => { s += pfad(kurve(w), "none", "#b9787d", 0.45); });
  /* Zentralfurche: zwischen Stirn- und Scheitellappen, von oben schräg nach unten */
  s += pfad(kurve([[-1, -20], [0, -15], [-2, -10], [0, -5], [-1, 1]]), "none", "#8f5157", 0.8);
  /* Seitenfurche */
  s += pfad(kurve([[-12, 4], [-4, 1], [5, 3], [12, 1]]), "none", "#8f5157", 0.6);
  return { svg: s, teile: {
    ge_grosshirn: [-6, -3, "l"], ge_stirnlappen: [-15, -6, "l"], ge_scheitellappen: [9, -12, "r"], ge_zentralfurche: [-1, -15, "l"],
    ge_windung: [8, -6, "r"], ge_kleinhirn: [13, 13, "r"], ge_hirnstamm: [2, 18, "l"],
  } };
};

ORGAN.herz = () => {
  const v = verlauf("#d7625a", "#9e3530", 55);
  let s = "<defs>" + v.def + "</defs>";
  /* große Gefäße oben: Hohlvene (blau, links im Bild), Aorta (rot, Bogen), Lungenarterie (blau, vorn) */
  s += '<rect x="-12" y="-24" width="5" height="13" rx="2" fill="' + BLAU + '" stroke="#244a80" stroke-width=".4"/>';
  s += pfad("M-3 -8C-4 -18 2 -24 8 -24C14 -24 16 -19 15 -14", "none", "#8e2a24", 5.6) + pfad("M-3 -8C-4 -18 2 -24 8 -24C14 -24 16 -19 15 -14", "none", ROT, 4.4);
  [-2, 3, 8].forEach((x, i) => { s += pfad("M" + x + " " + (-21 - (i === 1 ? 2 : 0)) + "V" + (-27 - (i === 1 ? 1 : 0)), "none", "#8e2a24", 2) + pfad("M" + x + " " + (-21 - (i === 1 ? 2 : 0)) + "V" + (-27 - (i === 1 ? 1 : 0)), "none", ROT, 1.2); });
  s += pfad("M1 -6C0 -12 3 -16 8 -16C11 -16 13 -14 14 -12", "none", "#2d568f", 4.4) + pfad("M1 -6C0 -12 3 -16 8 -16C11 -16 13 -14 14 -12", "none", "#5b86c6", 3.2);
  /* Herzmuskel */
  const herz = kurve([[-12, -10], [-4, -9], [5, -10], [13, -7], [16, 2], [12, 12], [5, 20], [2, 21], [-3, 14], [-11, 5], [-15, -3]], true);
  s += pfad(herz, v.url, "#7e2622", 0.6);
  /* rechter Vorhof (links im Bild) */
  s += pfad(kurve([[-15, -6], [-12, -11], [-7, -10], [-6, -3], [-10, 0], [-14, -1]], true), "#c95a52", "#7e2622", 0.4);
  /* Kranzfurche und vordere Längsfurche mit Kranzgefäßen */
  s += pfad(kurve([[-13, 0], [-6, -2], [2, -4], [10, -6], [14, -5]]), "none", "#f2d47c", 1.6);
  s += pfad(kurve([[-13, 0], [-6, -2], [2, -4], [10, -6], [14, -5]]), "none", "#b33a33", 0.5);
  s += pfad(kurve([[2, -4], [4, 3], [4, 10], [3, 18]]), "none", "#f2d47c", 1.4) + pfad(kurve([[2, -4], [4, 3], [4, 10], [3, 18]]), "none", "#b33a33", 0.5);
  s += pfad(kurve([[4, 3], [8, 6], [11, 9]]), "none", "#b33a33", 0.35) + pfad(kurve([[3, 8], [-1, 10], [-4, 11]]), "none", "#b33a33", 0.35);
  s += pfad(kurve([[-3, -1], [-5, 5], [-8, 7]]), "none", BLAU, 0.35);
  return { svg: s, teile: {
    hz_rechtekammer: [-4, 6, "l"], hz_linkekammer: [9, 4, "r"], hz_vorhof: [-11, -5, "l"], hz_herzspitze: [3, 19, "r"],
    hz_aorta: [9, -24, "r"], hz_lungenarterie: [7, -15, "r"], hz_hohlvene: [-9.5, -19, "l"], hz_kranzgefaess: [4, 9, "r"], hz_kranzfurche: [-8, -1, "l"],
  } };
};

ORGAN.lunge = () => {
  const v = verlauf("#f4c3c6", "#d98c93", 40);
  let s = "<defs>" + v.def + "</defs>";
  /* Luftröhre mit Knorpelspangen, Gabelung in die Bronchien */
  s += '<rect x="-2.6" y="-27" width="5.2" height="14" rx="1.6" fill="#f3dfd4" stroke="#b58a7c" stroke-width=".4"/>';
  for (let i = 0; i < 6; i++) s += pfad("M-2.4 " + (-25.5 + i * 2.2) + "H2.4", "none", "#c9a597", 0.5);
  /* rechter Flügel (im Bild links): drei Lappen */
  const rechts = kurve([[-3, -17], [-10, -16], [-17, -8], [-21, 4], [-21, 14], [-16, 18], [-7, 17], [-3, 12], [-3, -6]], true);
  const links = kurve([[3, -17], [10, -16], [17, -8], [21, 4], [21, 14], [16, 18], [9, 18], [5, 15], [8, 9], [3, 5], [3, -6]], true);
  s += pfad(rechts, v.url, "#9e5a61", 0.55) + pfad(links, v.url, "#9e5a61", 0.55);
  /* Lappenspalten */
  s += pfad(kurve([[-4, -5], [-10, -1], [-15, 2], [-20, 6]]), "none", "#9e5a61", 0.55);
  s += pfad(kurve([[-4, 8], [-9, 6], [-14, 3]]), "none", "#9e5a61", 0.5);
  s += pfad(kurve([[4, -8], [10, -1], [15, 5], [20, 10]]), "none", "#9e5a61", 0.55);
  /* Bronchien als verzweigter Baum, durchscheinend */
  const ast = (pts, w) => pfad(kurve(pts), "none", "#e8c4b8", w + 0.5) + pfad(kurve(pts), "none", "#fbeae3", w);
  s += ast([[0, -13], [-3, -10], [-7, -8], [-11, -6]], 1.4) + ast([[0, -13], [3, -10], [7, -8], [11, -6]], 1.4);
  s += ast([[-7, -8], [-9, -2], [-12, 5]], 0.8) + ast([[-9, -3], [-15, -3]], 0.6) + ast([[7, -8], [9, -1], [12, 7]], 0.8) + ast([[9, -2], [15, 0]], 0.6);
  /* Lungenbläschen angedeutet */
  for (let i = 0; i < 26; i++) { const a = i * 2.4, rr = 3 + (i % 5) * 1.8; const x = (i % 2 ? 1 : -1) * (12 + Math.cos(a) * rr * 0.6), y = 2 + Math.sin(a) * rr * 1.5; s += kreis(x, y, 0.6, "none", "#c98a92", 0.25); }
  return { svg: s, teile: {
    lu_luftroehre: [0, -22, "r"], lu_bronchus: [-6, -8.5, "l"], lu_oberlappen: [-13, -8, "l"], lu_mittellappen: [-14, 6, "l"],
    lu_unterlappen: [-11, 14, "l"], lu_lappenspalte: [-17, 3, "l"], lu_herzbucht: [5, 10, "r"], lu_linkerfluegel: [15, 2, "r"],
  } };
};

ORGAN.leber = () => {
  const v = verlauf("#a9544a", "#6e2d27", 35);
  let s = "<defs>" + v.def + "</defs>";
  const leber = kurve([[-24, -2], [-20, -11], [-8, -14], [6, -13], [18, -10], [25, -7], [19, -3], [8, 2], [0, 6], [-10, 10], [-19, 9]], true);
  s += pfad(leber, v.url, "#4f1f1b", 0.6);
  s += pfad(kurve([[-18, -8], [-8, -11], [4, -10]]), "none", "rgba(255,255,255,.18)", 1.2);
  /* Sichelband zwischen rechtem und linkem Lappen */
  s += pfad(kurve([[2, -13], [1, -6], [2, 0], [1, 5]]), "none", "#e7c7b8", 0.8);
  /* Gallenblase unten am rechten Lappen */
  s += pfad(kurve([[-10, 6], [-8, 12], [-4, 14], [-2, 11], [-4, 6]], true), "#6f9a4a", "#3f6428", 0.45);
  /* Gallengang, Pfortader, Leberarterie an der Leberpforte */
  s += pfad(kurve([[-4, 10], [-1, 12], [1, 17]]), "none", "#6f9a4a", 1.2);
  s += pfad(kurve([[4, 17], [4, 11], [2, 6]]), "none", "#6f5a9e", 2);
  s += pfad(kurve([[7, 17], [6, 11], [4, 6]]), "none", ROT, 0.9);
  return { svg: s, teile: {
    le_rechterlappen: [-12, -4, "l"], le_linkerlappen: [13, -7, "r"], le_sichelband: [1.5, -8, "r"], le_gallenblase: [-6, 11, "l"],
    le_gallengang: [0, 14, "l"], le_pfortader: [4, 14, "r"], le_leberrand: [-18, 8, "l"],
  } };
};

ORGAN.magen = () => {
  const v = verlauf("#eab1a6", "#c77b70", 40);
  let s = "<defs>" + v.def + "</defs>";
  /* Speiseröhre von oben, Magen J-förmig, Pförtner, Zwölffingerdarm */
  s += pfad(kurve([[-4, -28], [-3, -20], [-1, -14]]), "none", "#b76f64", 4.6) + pfad(kurve([[-4, -28], [-3, -20], [-1, -14]]), "none", "#e7a79b", 3.4);
  const magen = kurve([[-2, -14], [5, -16], [13, -12], [16, -2], [14, 10], [6, 18], [-5, 19], [-13, 15], [-19, 13], [-19, 9], [-11, 9], [-4, 7], [1, 1], [0, -7]], true);
  s += pfad(magen, v.url, "#96544b", 0.6);
  /* aufgeschnittenes Fenster: Magenfalten */
  s += pfad(kurve([[2, -4], [10, -6], [12, 4], [6, 12], [0, 10], [4, 3]], true), "#f3c7be", "#b57a70", 0.4);
  for (let i = 0; i < 5; i++) s += pfad(kurve([[3 + i * 1.6, -3 + i * 0.5], [5 + i * 1.5, 3 + i], [2 + i * 1.8, 9 + i * 0.3]]), "none", "#c9897e", 0.4);
  /* Pförtner (Ringmuskel) und Zwölffingerdarm */
  s += '<rect x="-21.5" y="8" width="3" height="6" rx="1" fill="#b76f64"/>';
  s += pfad(kurve([[-21, 11], [-24, 12], [-25, 18], [-22, 24]]), "none", "#c9a066", 3.6) + pfad(kurve([[-21, 11], [-24, 12], [-25, 18], [-22, 24]]), "none", "#e8c895", 2.4);
  return { svg: s, teile: {
    ma_speiseroehre: [-3, -22, "l"], ma_mageneingang: [-1, -14, "l"], ma_kleinekurvatur: [-2, 3, "l"], ma_grossekurvatur: [14, 8, "r"],
    ma_magenfalte: [7, 3, "r"], ma_pfoertner: [-20, 11, "l"], ma_zwoelffingerdarm: [-23, 19, "l"],
  } };
};

ORGAN.niere = () => {
  let s = "";
  /* Längsschnitt: Rinde außen, Mark mit Pyramiden, Nierenbecken, Harnleiter */
  const niere = kurve([[0, -20], [10, -16], [13, -4], [12, 8], [8, 18], [0, 21], [-6, 16], [-7, 8], [-4, 3], [-7, -2], [-7, -10], [-5, -17]], true);
  s += pfad(niere, "#b8544a", "#6e2923", 0.6);
  s += pfad(kurve([[0, -16.5], [8, -13.5], [10.5, -3], [9.5, 8], [6.5, 15.5], [0, 18], [-3.5, 14], [-4, 6], [-2, 2.5], [-4, -3], [-4, -10], [-3, -14.5]], true), "#d9776b", "none");
  for (let i = 0; i < 6; i++) {
    const a = -1.9 + i * 0.66, x = Math.cos(a) * 7.5 + 2, y = Math.sin(a) * 13;
    s += pfad("M" + r1(x) + " " + r1(y) + "L" + r1(x - Math.cos(a) * 4.4 + Math.sin(a) * 1.8) + " " + r1(y - Math.sin(a) * 4.4 - Math.cos(a) * 1.8) + "L" + r1(x - Math.cos(a) * 4.4 - Math.sin(a) * 1.8) + " " + r1(y - Math.sin(a) * 4.4 + Math.cos(a) * 1.8) + "Z", "#a8453c", "#7e2d27", 0.3);
  }
  s += pfad(kurve([[-4, -5], [0, -2], [1, 3], [-1, 7], [-5, 7]], true), "#f2e1a8", "#b8994a", 0.4);
  s += pfad(kurve([[-4, 6], [-8, 12], [-9, 20], [-8, 27]]), "none", "#d9c38a", 1.6);
  s += pfad(kurve([[-4, -2], [-10, -3], [-16, -2]]), "none", ROT, 1.6) + pfad(kurve([[-4, 2], [-10, 3], [-16, 4]]), "none", BLAU, 1.8);
  return { svg: s, teile: {
    ni_rinde: [10, 6, "r"], ni_mark: [6, -6, "r"], ni_becken: [-1.5, 2, "r"], ni_harnleiter: [-8.5, 20, "l"],
    ni_nierenarterie: [-13, -2.5, "l"], ni_nierenvene: [-13, 3.5, "l"], ni_hilus: [-4, 0, "l"],
  } };
};

ORGAN.darm = () => {
  let s = "";
  /* Dickdarm als Rahmen, mit Haustren; Dünndarm als Schlingen innen */
  const dick = [[-16, 18], [-19, 6], [-19, -8], [-16, -17], [-6, -19], [6, -19], [16, -17], [19, -8], [19, 6], [17, 15], [10, 18], [4, 21], [0, 25]];
  s += pfad(kurve(dick), "none", "#b27a55", 7) + pfad(kurve(dick), "none", "#e0b28a", 5.6);
  for (let i = 1; i < dick.length - 1; i++) {
    const a = dick[i - 1], b = dick[i + 1], m = dick[i];
    const nx = -(b[1] - a[1]), ny = b[0] - a[0], l = Math.hypot(nx, ny) || 1;
    s += pfad("M" + r1(m[0] + nx / l * 2.8) + " " + r1(m[1] + ny / l * 2.8) + "L" + r1(m[0] - nx / l * 2.8) + " " + r1(m[1] - ny / l * 2.8), "none", "#b27a55", 0.45);
  }
  /* Mastdarm und After */
  s += pfad("M0 25V30", "none", "#b27a55", 4.6) + pfad("M0 25V30", "none", "#e0b28a", 3.4) + ellipse(0, 31, 1.6, 0.8, "#8a5a3c");
  /* Blinddarm und Wurmfortsatz */
  s += ellipse(-16, 21, 3.4, 2.6, "#e0b28a", "#b27a55", 0.45) + pfad(kurve([[-17, 23], [-19, 26], [-17, 28]]), "none", "#c99a72", 1.1);
  /* Dünndarm-Schlingen */
  const schlingen = [];
  for (let i = 0; i < 44; i++) { const t = i / 43; schlingen.push([-11 + 22 * ((i % 8) / 7) * (i % 16 < 8 ? 1 : -1) + (i % 16 < 8 ? 0 : 22), -11 + t * 27]); }
  const d = [];
  for (let r = 0; r < 6; r++) {
    const y = -11 + r * 5;
    const hin = r % 2 === 0;
    for (let k = 0; k <= 6; k++) { const x = hin ? -11 + k * 3.6 : 11 - k * 3.6; d.push([x, y + Math.sin(k * 1.7 + r) * 1.3]); }
  }
  s += pfad(kurve(d), "none", "#c77f78", 3.6) + pfad(kurve(d), "none", "#f0b7ad", 2.6);
  /* Magenausgang und Zwölffingerdarm oben links, zum Dünndarm */
  s += pfad(kurve([[-6, -24], [-9, -22], [-10, -17], [-8, -13], [-11, -11]]), "none", "#c9a066", 2.6) + pfad(kurve([[-6, -24], [-9, -22], [-10, -17], [-8, -13], [-11, -11]]), "none", "#e8c895", 1.6);
  s += '<rect x="-7" y="-26.5" width="3" height="4" rx="1" fill="#b76f64"/>';
  return { svg: s, teile: {
    da_magenausgang: [-5.5, -24.5, "l"], da_zwoelffinger: [-9.5, -18, "l"], da_duenndarm: [3, 1, "r"], da_blinddarm: [-16, 21, "l"],
    da_wurmfortsatz: [-18, 27, "l"], da_aufsteigend: [-19, 2, "l"], da_quer: [5, -19, "r"], da_absteigend: [19, 0, "r"],
    da_sigma: [12, 18, "r"], da_mastdarm: [0, 27, "r"], da_after: [0, 31, "r"], da_haustren: [19, -10, "r"],
  } };
};

ORGAN.rippe = () => {
  let s = "";
  /* Brustkorb von vorn: Brustbein, Rippen, Rippenknorpel */
  s += pfad(kurve([[-2.5, -16], [2.5, -16], [2, 6], [0, 9], [-2, 6]], true), "#f1e8d6", "#a8977a", 0.45);
  for (let i = 0; i < 9; i++) {
    const y = -14 + i * 3.6, w = 10 + Math.min(i, 5) * 1.6 - Math.max(0, i - 6) * 1.2;
    [-1, 1].forEach((sg) => {
      const knorpel = i < 7;
      s += pfad(kurve([[sg * 2.2, y + (knorpel ? 0 : 4)], [sg * (w * 0.6), y - 1.5], [sg * w, y + 2], [sg * (w * 0.95), y + 6]]), "none", "#a8977a", 2.2) + pfad(kurve([[sg * 2.2, y + (knorpel ? 0 : 4)], [sg * (w * 0.6), y - 1.5], [sg * w, y + 2], [sg * (w * 0.95), y + 6]]), "none", "#f1e8d6", 1.4);
      if (knorpel) s += pfad("M" + sg * 2.4 + " " + y + "L" + sg * 5.5 + " " + (y - 0.8), "none", "#cfe0e4", 1.2);
    });
  }
  s += pfad("M-6 -19H6", "none", "#a8977a", 2) + pfad("M-6 -19H6", "none", "#f1e8d6", 1.2);
  return { svg: s, teile: {} };
};

ORGAN.wirbelsaeule = () => {
  let s = "";
  /* Von der Seite: Hals-, Brust-, Lendenwirbel und Kreuzbein, S-förmig */
  for (let i = 0; i < 17; i++) {
    const t = i / 16, y = -24 + t * 42, x = Math.sin(t * Math.PI * 2 - 0.4) * 3, h = 1.6 + t * 1.3;
    s += '<rect x="' + r1(x - 2.2 - t) + '" y="' + r1(y - h / 2) + '" width="' + r1(4.4 + t * 2) + '" height="' + r1(h) + '" rx=".6" fill="#f1e8d6" stroke="#a8977a" stroke-width=".35"/>';
    s += pfad("M" + r1(x + 2.2 + t) + " " + r1(y) + "l" + r1(2.4 + t) + " " + r1(0.8 + t), "none", "#a8977a", 0.8);
    if (i < 16) s += '<rect x="' + r1(x - 2 - t) + '" y="' + r1(y + h / 2) + '" width="' + r1(4 + t * 2) + '" height=".7" fill="#cfe0e4"/>';
  }
  s += pfad(kurve([[-1, 19], [4, 20], [5, 25], [2, 28], [-1, 25]], true), "#f1e8d6", "#a8977a", 0.4);
  return { svg: s, teile: {} };
};

ORGAN.knochen = () => {
  let s = "";
  /* Röhrenknochen, aufgeschnitten: Knochenrinde, Schwammknochen, Mark */
  s += pfad(kurve([[-18, -3], [-20, -7], [-15, -9], [-11, -5], [11, -5], [15, -9], [20, -7], [18, -3], [20, 2], [15, 5], [11, 3], [-11, 3], [-15, 5], [-20, 2]], true), "#f1e8d6", "#a8977a", 0.5);
  s += '<rect x="-10" y="-3" width="20" height="4" rx="1.4" fill="#e8b85a"/>';
  for (let i = 0; i < 16; i++) s += kreis(-16 + (i % 4) * 1.4 + (i > 7 ? 30 : 0), -4 + Math.floor((i % 8) / 4) * 2.6, 0.55, "none", "#b8a785", 0.3);
  return { svg: s, teile: {} };
};

ORGAN.muskel = () => {
  let s = "";
  /* Spindelförmiger Muskel mit Sehnen, ein Bündel herausgezogen */
  s += pfad("M-22 0L-14 0", "none", "#e9e2cf", 2.2) + pfad("M14 0L22 0", "none", "#e9e2cf", 2.2);
  s += pfad(kurve([[-14, 0], [-6, -6], [6, -6], [14, 0], [6, 6], [-6, 6]], true), "#b8413a", "#7a2520", 0.5);
  for (let i = -2; i <= 2; i++) s += pfad(kurve([[-13, i * 0.2], [-5, i * 2.2], [5, i * 2.2], [13, i * 0.2]]), "none", "#d9675e", 0.35);
  s += pfad(kurve([[2, 4], [6, 9], [11, 11]]), "none", "#b8413a", 1.8) + pfad(kurve([[2, 4], [6, 9], [11, 11]]), "none", "#d9675e", 0.5);
  return { svg: s, teile: {} };
};

ORGAN.ader = () => {
  let s = "";
  /* Schlagader (dicke Wand, rot) und Blutader (dünne Wand, Klappe, blau) */
  s += '<rect x="-16" y="-8" width="32" height="5" rx="2.5" fill="' + ROT + '" stroke="#7a2520" stroke-width=".4"/>' + ellipse(16, -5.5, 1.4, 2.5, "#e7a39c", "#7a2520", 0.8);
  s += '<rect x="-16" y="3" width="32" height="5" rx="2.5" fill="' + BLAU + '" stroke="#244a80" stroke-width=".4"/>' + ellipse(16, 5.5, 1.4, 2.5, "#a9c2e6", "#244a80", 0.4);
  s += pfad("M-2 3.6Q2 5.5 -2 7.4M3 3.6Q7 5.5 3 7.4", "none", "#a9c2e6", 0.5);
  return { svg: s, teile: {} };
};

ORGAN.blut = () => {
  let s = "";
  s += pfad(kurve([[0, -14], [6, -3], [7, 5], [0, 11], [-7, 5], [-6, -3]], true), "#b0282b", "#7a1a1c", 0.5);
  [[-2.5, 1], [2.5, -1], [1, 5], [-3, 6], [3, 3]].forEach((q) => { s += ellipse(q[0], q[1], 2.1, 1.3, "#d9474a", "#8a1f22", 0.3) + ellipse(q[0], q[1], 0.9, 0.5, "#b0282b"); });
  s += kreis(-1, -4, 1.7, "#f1ecf3", "#9a8fb0", 0.3) + kreis(-1.4, -4.3, 0.7, "#8b73b8") + kreis(3, -6, 0.5, "#e8b8c8");
  return { svg: s, teile: {} };
};

ORGAN.haut_d = () => {
  let s = "";
  /* Hautschnitt: Oberhaut, Lederhaut, Unterhaut mit Fettzellen; Haar,
     Schweißdrüse, Blutgefäße */
  s += '<rect x="-15" y="-10" width="30" height="3" fill="#f1c9b0" stroke="#b88a6c" stroke-width=".35"/>';
  s += '<rect x="-15" y="-7" width="30" height="9" fill="#efb8a4"/>';
  s += '<rect x="-15" y="2" width="30" height="9" fill="#f5e3b0"/>';
  for (let i = 0; i < 10; i++) s += kreis(-13 + (i % 5) * 6.4, 4.5 + Math.floor(i / 5) * 4, 2, "#faedc6", "#d9c087", 0.3);
  s += pfad("M-6 -16L-5 -10", "none", "#4a3226", 0.7) + pfad("M-5 -10L-4 -2", "none", "#4a3226", 0.6) + ellipse(-4, -1, 1.4, 1.8, "#d8a08a", "#9a6a55", 0.3);
  s += pfad(kurve([[6, -10], [6, -5], [7, -2], [5, 1], [8, 1]]), "none", "#9fbfcc", 0.6) + kreis(7.5, 1.5, 1.2, "none", "#9fbfcc", 0.6);
  s += pfad(kurve([[-15, -2], [-5, -4], [5, -1], [15, -3]]), "none", ROT, 0.6) + pfad(kurve([[-15, 0], [-5, -1.5], [5, 1], [15, -1]]), "none", BLAU, 0.6);
  return { svg: s, teile: {} };
};

/* Karten: [Mitte x, Mitte y, Breite, Höhe, Maßstab der Zeichnung] */
const KARTE = {
  gehirn: [42, 36, 80, 66, 1.05], herz: [124, 36, 80, 66, 1.0], lunge: [206, 36, 80, 66, 1.0], leber: [284, 36, 68, 66, 0.9],
  magen: [42, 104, 80, 66, 0.95], niere: [124, 104, 80, 66, 1.0], darm: [206, 104, 80, 66, 1.0], rippe: [284, 104, 68, 66, 1.35],
  wirbelsaeule: [29, 170, 50, 56, 1.0], knochen: [82, 170, 52, 56, 1.0], muskel: [135, 170, 52, 56, 1.0],
  ader: [188, 170, 52, 56, 1.1], blut: [241, 170, 52, 56, 1.3], haut_d: [293, 170, 50, 56, 1.25],
};

function bau() {
  const S = L.lade("koerper_innen");
  const d = S.d;
  let kulisse = '<rect x="0" y="0" width="' + d.breite + '" height="' + d.hoehe + '" fill="#f5eeee"/>';
  for (let x = 10; x < d.breite; x += 10) kulisse += '<line x1="' + x + '" y1="0" x2="' + x + '" y2="' + d.hoehe + '" stroke="#ede3e3" stroke-width=".4"/>';
  for (let y = 10; y < d.hoehe; y += 10) kulisse += '<line x1="0" y1="' + y + '" x2="' + d.breite + '" y2="' + y + '" stroke="#ede3e3" stroke-width=".4"/>';
  d.teile.forEach((t) => {
    const k = KARTE[t.id], f = ORGAN[t.id];
    if (!k || !f) { console.log("  ?? " + t.id); return; }
    const [cx, cy, w, h, sk] = k;
    kulisse += '<rect x="' + (cx - w / 2 + 1) + '" y="' + (cy - h / 2 + 1) + '" width="' + (w - 2) + '" height="' + (h - 2) + '" rx="5" fill="#fffafa" stroke="#e6d6d4" stroke-width=".6"/>';
    const o = f();
    t.x = cx; t.y = cy;
    t.kunst = '<g transform="scale(' + sk + ')">' + o.svg + "</g>";
    const ids = Object.keys(o.teile);
    if (ids.length) {
      t.zoom = { x: cx - w / 2 + 1, y: cy - h / 2 + 1, w: w - 2, h: h - 2 };
      const alte = {};
      (t.unter || []).forEach((u) => { alte[u.id] = u; });
      t.unter = ids.map((uid) => {
        const p = o.teile[uid];
        const u = Object.assign({}, alte[uid] || { id: uid });
        u.x = r1(cx + p[0] * sk); u.y = r1(cy + p[1] * sk);
        u.kunst = flaeche(4.6, 4);
        return u;
      });
      ["l", "r"].forEach((seite) => {
        const liste = ids.filter((uid) => o.teile[uid][2] === seite).sort((a, b) => o.teile[a][1] - o.teile[b][1]);
        liste.forEach((uid, n) => {
          const p = o.teile[uid];
          const u = t.unter.find((q) => q.id === uid);
          const ty = -h / 2 + 7 + (n + 0.5) * ((h - 12) / Math.max(liste.length, 1));
          const tx = seite === "l" ? -w / 2 + 3 : w / 2 - 3;
          t.kunst += L.beschriftung([p[0] * sk, p[1] * sk], [tx, ty], u.de || uid, 2.3, seite === "l" ? "start" : "end");
        });
      });
    }
  });
  d.kulisse = kulisse;
  L.speichere(S);
  console.log("koerper_innen: " + d.teile.length + " Karten, " + (JSON.stringify(d).length / 1024).toFixed(0) + " KB");
}
module.exports = { bau };
