/* =====================================================================
   TIER-BIBLIOTHEK — KOPFVORLAGE (FASSUNG 880 — W8)
   ---------------------------------------------------------------------
   XANDER (Funk 299, wörtlich): „die nächste Priorität sollte der Abschluss der Tiere sein mache bitte nur deine
   Aufgaben und nicht irgendwas anderes was du hinein interpretierst … kümmere Dich jetzt mal bitte intensiv um das
   alles“. Früher (ANLEITUNG.md, 03.10.): „… Augen sehen … Wimpern … Zähne, Augen … Pupillen … realistisch“.

   FASSUNG 880 — Warum: Kritiken (Kopf im Mittel 4,2): „Grinse-Mundlinie“, „Kugelnase“, „Auge ohne Höhle und
   Brauenwulst“, „Ohr als Helm aufgeklebt“. Jetzt eine Schädelvorlage je Bauplan im Kopf-Koordinatensystem
   (Ursprung Hinterhaupt, x zur Nasenspitze in Kopflängen, y nach unten): Stirn-/Stop-Winkel, Fang, Auge in der Höhle
   mit Brauenwulst-Schatten (T.augeReal mit Option hoehle), Jochbogen, Mundwinkel unter dem vorderen Augendrittel,
   Lefze als Fläche, Nasenspiegel bündig mit dem Nasenrücken, Ohrgrund im Fell versenkt.
   REGEL: Die Mundlinie darf nach hinten NICHT ansteigen (kein Grinsen) – T.kopf erzwingt das.

   QUELLEN: Wolf – Augen schräg, mandelförmig, bernsteingelb; Ohren 9–11 cm, aufrecht, an der Spitze gerundet;
   Stop flach (Wolf) bis deutlich (Hund); Lippen und Nase schwarz (Wikipedia „Wolf“, Kritik Wolf R2/R3: Stirnwölbung
   4–6 % der Kopflänge, Stop-Knick 10–15° vor dem Auge, Mundspalte endet unter dem vorderen Augendrittel).
   Katze – kurzer Fang, runder Schädel; Bär – flache Stirnschüssel, kleine runde Ohren (Kritik Braunbär R3);
   Pferd – Kopf ≈ 0,4 W, gerades Profil, große Ganasche; Rind – breites Flotzmaul, Genickkamm (Kritik Kuh R3).
   ===================================================================== */
"use strict";
const F = require("./form880");
const { glatt, eckig, lerp, abst, norm, op2 } = F;
const Z = (v) => String(Math.round(v * 100) / 100).replace(/^(-?)0\./, "$1.");

/* Vorlagen in Kopflängen. oben: Profil Hinterhaupt → Nasenrücken (vor dem Nasenspiegel); nase: Spiegel oben/vorn/unten;
   lippe: Oberlippe vorn unten; unten: Kinn → Unterkiefer → Kehle; auge: Mitte + rr (Lidspalte halb = rr·1,35);
   ohr: Basis hinten/vorn + Höhe/Breite/Neigung (Grad, + = nach vorn); jochbogen: Linie; ganasche: Kieferwinkel. */
const VORLAGEN = {
  hund: {
    /* Wolf (FASSUNG 881 — Prüfer 880, Punkt 7: „wirkt wie Schakal/Kojote, Profil ein gerader Keil ohne Stop“): Schädel hinter
       dem Auge hoch und breit (Scheitel ≈ −0,09 L unter den Ohren), Stirn fällt vor dem Auge in einen deutlichen, aber
       flachen Stop, danach gerader Nasenrücken; Fang tief und vorn stumpf (Nasenspiegel groß), Unterkiefer kräftig;
       Kehle tiefer angesetzt (der Übergang Kiefer → Hals liegt im Backenkragen). Ohren breit an der Basis, Spitze gerundet. */
    oben: [[0, 0], [0.06, -0.068], [0.14, -0.09], [0.24, -0.094], [0.33, -0.084], [0.41, -0.056], [0.47, -0.014], [0.53, 0.02], [0.62, 0.04], [0.74, 0.056], [0.86, 0.072], [0.9, 0.08]],
    nase: { oben: [0.94, 0.088], vorn: [1.0, 0.15], unten: [0.975, 0.22] },
    lippe: [[0.985, 0.255], [0.965, 0.295]],
    unten: [[0.94, 0.335], [0.9, 0.39], [0.77, 0.425], [0.58, 0.44], [0.4, 0.455], [0.26, 0.48], [0.14, 0.52]],
    auge: { x: 0.43, y: 0.062, r: 0.036, winkel: 15, pupille: "rund", iris: "#d9a53b", iris2: "#7a4a12" },
    ohr: { hinten: [0.09, -0.04], vorn: [0.3, -0.07], hoehe: 0.29, breite: 0.27, neigung: 6, form: "spitz", fern: 0.12 },
    jochbogen: [[0.41, 0.135], [0.3, 0.13], [0.18, 0.105]],
    ganasche: [0.24, 0.34],
    nasenloch: true, lefzeSchwarz: true,
  },
  katze: {
    oben: [[0, 0], [0.12, -0.08], [0.3, -0.1], [0.5, -0.08], [0.66, -0.02], [0.74, 0.04], [0.8, 0.09]],
    nase: { oben: [0.84, 0.12], vorn: [0.9, 0.18], unten: [0.88, 0.24] },
    lippe: [[0.9, 0.3], [0.86, 0.36]],
    unten: [[0.84, 0.4], [0.76, 0.45], [0.6, 0.47], [0.42, 0.48], [0.26, 0.47], [0.12, 0.47]],
    auge: { x: 0.56, y: 0.08, r: 0.06, winkel: 6, pupille: "rund", iris: "#c9a23c", iris2: "#6a5010" },
    ohr: { hinten: [0.12, -0.06], vorn: [0.34, -0.1], hoehe: 0.28, breite: 0.24, neigung: 0, form: "rund" },
    jochbogen: [[0.52, 0.19], [0.36, 0.2], [0.2, 0.18]], ganasche: [0.3, 0.4], nasenloch: true, lefzeSchwarz: true,
  },
  baer: {
    oben: [[0, 0], [0.12, -0.05], [0.28, -0.07], [0.42, -0.05], [0.52, -0.01], [0.66, 0.03], [0.82, 0.06], [0.92, 0.08]],
    nase: { oben: [0.95, 0.085], vorn: [1.0, 0.12], unten: [0.98, 0.19] },
    lippe: [[0.97, 0.22], [0.94, 0.26]],
    unten: [[0.9, 0.29], [0.84, 0.32], [0.66, 0.34], [0.46, 0.37], [0.28, 0.4], [0.12, 0.44]],
    auge: { x: 0.5, y: 0.05, r: 0.026, winkel: 6, pupille: "rund", iris: "#5a3618", iris2: "#2a1608" },
    ohr: { hinten: [0.14, -0.05], vorn: [0.26, -0.065], hoehe: 0.15, breite: 0.14, neigung: -5, form: "rund" },
    jochbogen: [[0.46, 0.12], [0.32, 0.13], [0.18, 0.12]], ganasche: [0.24, 0.32], nasenloch: true, lefzeSchwarz: true,
  },
  pferd: {
    oben: [[0, 0], [0.06, -0.05], [0.16, -0.06], [0.3, -0.04], [0.5, 0.0], [0.7, 0.04], [0.86, 0.07], [0.95, 0.1]],
    nase: { oben: [0.98, 0.12], vorn: [1.0, 0.18], unten: [0.98, 0.25] },
    lippe: [[0.98, 0.28], [0.94, 0.31]],
    unten: [[0.9, 0.33], [0.82, 0.32], [0.66, 0.3], [0.48, 0.34], [0.32, 0.44], [0.2, 0.48], [0.1, 0.44]],
    auge: { x: 0.3, y: 0.06, r: 0.04, winkel: 4, pupille: "quer", iris: "#3a2414", iris2: "#1a0e06" },
    ohr: { hinten: [0.03, -0.04], vorn: [0.1, -0.06], hoehe: 0.28, breite: 0.1, neigung: 12, form: "spitz" },
    jochbogen: [[0.3, 0.15], [0.18, 0.15]], ganasche: [0.24, 0.42], nasenloch: true, lefzeSchwarz: false,
  },
  rind: {
    oben: [[0, 0], [0.05, -0.06], [0.14, -0.06], [0.3, -0.03], [0.5, 0.0], [0.7, 0.03], [0.86, 0.07], [0.94, 0.12]],
    nase: { oben: [0.96, 0.15], vorn: [1.0, 0.22], unten: [0.99, 0.3] },
    lippe: [[0.99, 0.33], [0.95, 0.37]],
    unten: [[0.92, 0.4], [0.84, 0.4], [0.66, 0.4], [0.48, 0.44], [0.32, 0.5], [0.18, 0.5], [0.08, 0.46]],
    auge: { x: 0.3, y: 0.1, r: 0.045, winkel: 2, pupille: "quer", iris: "#2a1a10", iris2: "#120a04" },
    ohr: { hinten: [0.04, 0.04], vorn: [0.1, 0.02], hoehe: 0.22, breite: 0.14, neigung: -70, form: "blatt" },
    jochbogen: [[0.3, 0.2], [0.18, 0.2]], ganasche: [0.22, 0.45], nasenloch: true, lefzeSchwarz: false,
  },
  hirsch: {
    oben: [[0, 0], [0.08, -0.05], [0.2, -0.06], [0.36, -0.03], [0.55, 0.02], [0.75, 0.06], [0.88, 0.09]],
    nase: { oben: [0.93, 0.1], vorn: [1.0, 0.15], unten: [0.98, 0.22] },
    lippe: [[0.97, 0.25], [0.93, 0.28]],
    unten: [[0.9, 0.3], [0.82, 0.3], [0.62, 0.3], [0.44, 0.33], [0.28, 0.38], [0.14, 0.4]],
    auge: { x: 0.34, y: 0.06, r: 0.04, winkel: 6, pupille: "quer", iris: "#2e1c10", iris2: "#140a04" },
    ohr: { hinten: [0.06, -0.03], vorn: [0.14, -0.05], hoehe: 0.3, breite: 0.14, neigung: -30, form: "blatt" },
    jochbogen: [[0.34, 0.14], [0.2, 0.14]], ganasche: [0.22, 0.36], nasenloch: true, lefzeSchwarz: false,
  },
};
/* FASSUNG 881 — Prüfer 880, Punkt 6: für elefant, primat, echse, robbe, theropode und vogel fehlte eine Vorlage, T.kopf
   nahm STILL den Hundekopf (Elefant ohne Rüssel, T. rex mit Hundekopf). Jetzt hat jeder Bauplan eine eigene Grundform
   (Richtwerte – vor dem Bau einer Art mit Fotos abgleichen und über o anpassen); unbekannte Baupläne werfen einen Fehler.
   Neue Schalter: ohr.form "keins" (Echse, Robbe, Saurier, Vogel), "lappen" (Elefant); nasenspiegel: false (Haut statt
   Nasenspiegel, nur Nasenloch); schnabel: { farbe } (Vogel: Ober-/Unterschnabel statt Nase und Lefze). */
Object.assign(VORLAGEN, {
  elefant: {
    /* Kopfachse zeigt steil nach unten (Bauplan: Winkel 75°): „oben“ = Stirn und Vorderkante des Rüssels, „nase“ = Rüsselspitze,
       „lippe/unten“ = Rüsselhinterkante, Unterlippe, Kinn, Kehle. Ohr = großer Lappen hinter dem Auge. */
    oben: [[0, 0], [0.08, -0.17], [0.2, -0.25], [0.34, -0.26], [0.48, -0.21], [0.62, -0.16], [0.76, -0.12], [0.9, -0.09]],
    nase: { oben: [0.95, -0.085], vorn: [1.0, -0.055], unten: [0.99, -0.015] },
    lippe: [[0.93, 0.005], [0.8, 0.03]],
    unten: [[0.64, 0.06], [0.54, 0.12], [0.47, 0.19], [0.38, 0.25], [0.26, 0.29], [0.12, 0.31]],
    auge: { x: 0.3, y: -0.03, r: 0.022, winkel: 70, pupille: "rund", iris: "#5a3a1c", iris2: "#2a1608" },
    ohr: { hinten: [0.03, 0.22], vorn: [0.2, 0.14], hoehe: 0.44, breite: 0.36, neigung: -140, form: "lappen", fern: 0.03 },
    jochbogen: [[0.3, 0.02], [0.2, 0.04]], ganasche: [0.36, 0.22], nasenloch: false, nasenspiegel: false, lefzeSchwarz: false, mundDicke: 0.01, mund: [0.58, 0.085],
  },
  primat: {
    /* Menschenaffe: runder Hirnschädel, Überaugenwulst, flaches Gesicht, vorgewölbte Schnauze (Prognathie), Ohr klein seitlich */
    oben: [[0, 0], [0.1, -0.12], [0.25, -0.18], [0.42, -0.17], [0.55, -0.12], [0.63, -0.055], [0.66, 0.0], [0.64, 0.05], [0.7, 0.1], [0.8, 0.14]],
    nase: { oben: [0.86, 0.16], vorn: [0.92, 0.2], unten: [0.92, 0.25] },
    lippe: [[0.98, 0.3], [0.97, 0.36]],
    unten: [[0.93, 0.42], [0.85, 0.48], [0.7, 0.5], [0.55, 0.48], [0.4, 0.46], [0.25, 0.45], [0.12, 0.45]],
    auge: { x: 0.6, y: 0.08, r: 0.04, winkel: 0, pupille: "rund", iris: "#3a2210", iris2: "#1a0e06" },
    ohr: { hinten: [0.22, 0.14], vorn: [0.32, 0.12], hoehe: 0.12, breite: 0.1, neigung: -10, form: "rund", fern: 0 },
    jochbogen: [[0.55, 0.16], [0.4, 0.18]], ganasche: [0.3, 0.38], nasenloch: true, nasenspiegel: false, lefzeSchwarz: false, mund: [0.8, 0.39],
  },
  echse: {
    /* Echse/Krokodil: langer, flacher Kopf, Auge oben mit Überaugenwulst, kein äußeres Ohr, Nasenloch an der Schnauzenspitze */
    oben: [[0, 0], [0.1, -0.06], [0.25, -0.09], [0.4, -0.095], [0.48, -0.1], [0.56, -0.072], [0.7, -0.05], [0.85, -0.03], [0.95, -0.01]],
    nase: { oben: [0.98, 0.0], vorn: [1.0, 0.04], unten: [0.99, 0.08] },
    lippe: [[0.96, 0.1], [0.9, 0.12]],
    unten: [[0.8, 0.14], [0.6, 0.16], [0.4, 0.17], [0.25, 0.18], [0.12, 0.2]],
    auge: { x: 0.42, y: -0.035, r: 0.045, winkel: 0, pupille: "rund", iris: "#b8862f", iris2: "#4a2c0c" },
    ohr: { form: "keins" }, jochbogen: [[0.4, 0.05], [0.25, 0.06]], ganasche: [0.2, 0.15], nasenloch: true, nasenspiegel: false, lefzeSchwarz: false, mundDicke: 0.008,
  },
  robbe: {
    /* Robbe (Seehund): runder Kopf, kurzer Fang mit Schnurrhaarpolstern, große Augen, kein äußeres Ohr, Nasenlöcher als Schlitze */
    oben: [[0, 0], [0.12, -0.12], [0.3, -0.17], [0.48, -0.15], [0.62, -0.08], [0.72, -0.02], [0.82, 0.02], [0.9, 0.05]],
    nase: { oben: [0.94, 0.07], vorn: [1.0, 0.13], unten: [0.98, 0.2] },
    lippe: [[0.97, 0.25], [0.92, 0.3]],
    unten: [[0.86, 0.34], [0.72, 0.36], [0.55, 0.38], [0.38, 0.4], [0.22, 0.42], [0.1, 0.44]],
    auge: { x: 0.58, y: 0.05, r: 0.07, winkel: 0, pupille: "rund", iris: "#2a1a10", iris2: "#100804" },
    ohr: { form: "keins" }, jochbogen: [[0.55, 0.14], [0.4, 0.16]], ganasche: [0.3, 0.36], nasenloch: true, nasenspiegel: false, lefzeSchwarz: false,
  },
  theropode: {
    /* Theropode (nach T. rex „Sue“): hoher, kastenförmiger Schädel, Auge weit hinten und hoch, langer Fang, kein Außenohr */
    oben: [[0, 0], [0.08, -0.08], [0.2, -0.12], [0.3, -0.13], [0.42, -0.11], [0.6, -0.08], [0.78, -0.05], [0.9, -0.02]],
    nase: { oben: [0.95, 0.0], vorn: [1.0, 0.06], unten: [0.99, 0.14] },
    lippe: [[0.97, 0.2], [0.92, 0.24]],
    unten: [[0.85, 0.3], [0.7, 0.34], [0.5, 0.37], [0.35, 0.42], [0.2, 0.45], [0.08, 0.42]],
    auge: { x: 0.3, y: -0.04, r: 0.035, winkel: 0, pupille: "rund", iris: "#c9962f", iris2: "#5a3a0c" },
    ohr: { form: "keins" }, jochbogen: [[0.32, 0.12], [0.2, 0.14]], ganasche: [0.18, 0.36], nasenloch: true, nasenspiegel: false, lefzeSchwarz: false, mundDicke: 0.01,
  },
  vogel: {
    /* Vogel (Haushuhn): kleiner runder Kopf, Schnabel aus Ober- und Unterschnabel, großes Auge, Ohröffnung unter Federn */
    oben: [[0, 0], [0.1, -0.15], [0.25, -0.22], [0.4, -0.22], [0.52, -0.16], [0.6, -0.09], [0.75, -0.02], [0.9, 0.04]],
    nase: { oben: [0.95, 0.07], vorn: [1.0, 0.11], unten: [0.96, 0.14] },
    lippe: [[0.88, 0.15], [0.75, 0.16]],
    unten: [[0.62, 0.18], [0.5, 0.22], [0.35, 0.26], [0.2, 0.28], [0.08, 0.26]],
    auge: { x: 0.42, y: -0.06, r: 0.06, winkel: 0, pupille: "rund", iris: "#d07a2a", iris2: "#6a3010" },
    ohr: { form: "keins" }, jochbogen: [[0.35, 0.02], [0.2, 0.04]], ganasche: [0.2, 0.2], nasenloch: true, nasenspiegel: false, lefzeSchwarz: false,
    schnabel: { farbe: "#d6b25a", ansatz: 0.6 },
  },
});
const BAU = require("./bauplan");
const vorlageName = (b) => (typeof b === "string" ? BAU.bauplanName(b) : null);

/* T.kopf(bauplan, masse, o)
   masse: { hinterhaupt: [x, y], laenge (cm), winkel (Grad, Nase tiefer = positiv) } – z. B. sk.kopf aus T.skelett;
   o: { vorlage-Überschreibungen (stop: Tiefe in Kopflängen, fang: Faktor Fanghöhe, auge: {…}, ohr: {…}) }
   Liefert { umrissSil (für T.silhouette), achse (A/B für T.licht), punkte (auge, nase, mundwinkel, kinn, kehlPunkt …),
             w(x, y) (Kopf → Welt), ohr: { nah: pts, fern: pts }, augeR } und Zeichenhelfer (siehe unten). */
function kopf(T, bauplan, masse, o = {}) {
  const name = vorlageName(bauplan), basis = name ? VORLAGEN[name] : bauplan;
  if (!basis || typeof basis !== "object") throw new Error("T.kopf: Kopfvorlage unbekannt: " + bauplan + " (bekannt: " + Object.keys(VORLAGEN).join(", ") + ")");
  const v = JSON.parse(JSON.stringify(basis));
  for (const k of Object.keys(o)) if (o[k] && typeof o[k] === "object" && !Array.isArray(o[k]) && v[k] && !Array.isArray(v[k])) Object.assign(v[k], o[k]); else if (k in v) v[k] = o[k];
  const O = masse.hinterhaupt, L = masse.laenge, th = (masse.winkel || 0) * Math.PI / 180;
  const ax = [Math.cos(th), Math.sin(th)], ay = [-Math.sin(th), Math.cos(th)];
  const w = (x, y) => [O[0] + L * (x * ax[0] + y * ay[0]), O[1] + L * (x * ax[1] + y * ay[1])];
  /* Stop vertiefen/abflachen, Fang höher/flacher */
  /* o.stop (Kopflängen): Mulde am Stop (vor dem Auge, x ≈ 0,47) – weich auslaufend, vertieft den Knick Stirn → Nasenrücken */
  if (o.stop != null) { const xs = o.stopX || (v.auge ? v.auge.x + 0.05 : 0.48); v.oben = v.oben.map(([x, y]) => [x, y + o.stop * Math.exp(-Math.pow((x - xs) / 0.07, 2))]); }
  const oben = v.oben.map(([x, y]) => w(x, y));
  const nO = w(...v.nase.oben), nV = w(...v.nase.vorn), nU = w(...v.nase.unten);
  const lip = v.lippe.map(([x, y]) => w(x, y));
  const unten = v.unten.map(([x, y]) => w(x, y));
  /* Auge, Mundwinkel unter dem vorderen Augendrittel; Regel: Mundlinie steigt nach hinten nicht an */
  const au = v.auge, aug = w(au.x, au.y), rr = au.r * L, halb = rr * 1.35;
  let mw = v.mund ? w(...v.mund) : w(au.x + au.r * 1.35 * 0.33, Math.max(v.lippe[1][1] + 0.025, v.unten[2][1] - 0.035));
  const lipV = lip[1];
  if (mw[1] < lipV[1] + 0.004 * L) mw = [mw[0], lipV[1] + 0.012 * L];
  /* Umriss für die Silhouette: Hinterhaupt → Profil → Nasenspiegel → Oberlippe → Kinn → Unterkiefer → Kehle */
  const umrissSil = oben.concat([nO, [nV[0], nV[1] - 0.03 * L], nV, [nU[0] + 0.01 * L, nU[1] - 0.01 * L], nU], lip, unten);
  /* Achse (Strang) für das Licht: Oberseite = Profil, Unterseite = Unterkiefer (gegenläufig gepaart) */
  const N = 12, A = [], B = [];
  const obenL = F.abtasten(oben.concat([nO, nV]), N), untenL = F.abtasten(unten.slice().reverse().concat([lip[1], lip[0], nU]), N);
  for (let i = 0; i < N; i++) { A.push(obenL[i]); B.push(untenL[i]); }
  /* Ohren (Welt, fast senkrecht): Basis im Fell versenkt (unterer Teil 15 % unter dem Profil) */
  const oh = v.ohr, ohrPts = (versatz, kl) => {
    if (!oh || oh.form === "keins") return [];
    const bh = w(oh.hinten[0] + versatz, oh.hinten[1] + 0.03), bv = w(oh.vorn[0] + versatz, oh.vorn[1] + 0.03);
    const m = lerp(bh, bv, 0.5), H = oh.hoehe * L * kl, Bb = oh.breite * L * kl, ng = oh.neigung * Math.PI / 180;
    const up = [Math.sin(ng), -Math.cos(ng)], rt = [Math.cos(ng), Math.sin(ng)];
    const P = (u, h) => [m[0] + rt[0] * u * Bb + up[0] * h * H, m[1] + rt[1] * u * Bb + up[1] * h * H];
    if (oh.form === "rund") return [bh, P(-0.62, 0.45), P(-0.45, 0.88), P(0, 1), P(0.45, 0.88), P(0.6, 0.45), bv];
    if (oh.form === "blatt") return [bh, P(-0.4, 0.5), P(-0.15, 0.95), P(0.1, 1), P(0.35, 0.8), P(0.5, 0.35), bv];
    /* Lappen (Elefant): großer, unten breit gerundeter Ohrlappen, hängt vom Ansatz nach hinten unten */
    if (oh.form === "lappen") return [bh, P(-0.55, 0.18), P(-0.72, 0.5), P(-0.6, 0.85), P(-0.2, 1.0), P(0.25, 0.92), P(0.5, 0.62), P(0.45, 0.25), bv];
    /* spitz mit gerundeter Spitze (Wolf): Vorderrand fast gerade, Hinterrand leicht gewölbt */
    return [bh, P(-0.58, 0.35), P(-0.38, 0.72), P(-0.12, 0.96), P(0.02, 1.0), P(0.14, 0.92), P(0.3, 0.6), P(0.48, 0.22), bv];
  };
  /* fernes Ohr: um ohr.fern (Kopflängen, Standard 0,12) nach vorn versetzt, damit es neben dem nahen sichtbar wird
     (FASSUNG 881 — vorher 0,045: fast ganz verdeckt, Prüfer 880, Punkt 7) */
  const ohrNah = ohrPts(0, 1), ohrFern = ohrPts(oh && oh.fern != null ? oh.fern : 0.12, 0.94);
  const res = {
    umrissSil, achse: { A, B }, w, L, rr, halb,
    /* Profil oben (Hinterhaupt → Nasenspitze) und unten (Nase → Lippe → Kinn → Kehle) für den durchgehenden Rumpfstrang */
    profilOben: oben.concat([nO, nV]), profilUnten: [nU].concat(lip, unten),
    punkte: { hinterhaupt: O, auge: aug, nase: nV, nasenOben: nO, nasenUnten: nU, mundwinkel: mw, lippeVorn: lipV, kinn: unten[1], kehlPunkt: unten[unten.length - 1],
      stop: w(0.485, 0.024), ganasche: w(...v.ganasche) },
    ohr: { nah: ohrNah, fern: ohrFern }, vorlage: v,
  };
  res.kehlPunkt = res.punkte.kehlPunkt;
  res.nackenPunkt = O;
  /* ---------- Zeichenhelfer ---------- */
  /* Auge in der Höhle (T.augeReal mit Option hoehle), Winkel = Vorlage + Kopfwinkel */
  res.auge = (ao = {}) => T.augeReal(aug[0], aug[1], ao.r || rr, Object.assign({ iris: au.iris, iris2: au.iris2, pupille: au.pupille, winkel: (au.winkel || 0) + (masse.winkel || 0), offen: 0.66, hoehle: T.fein !== false }, ao));
  /* Nasenspiegel (FASSUNG 881 — Prüfer 880, Punkt 8: „glänzende Kugel mit rundem Loch“, „Strich unter der Nase“):
     flach und bündig – die Oberkante setzt den Nasenrücken fort und läuft weich hinein (Verlauf von der Rückenfarbe ins
     Dunkle), vorn rund; Nasenloch als seitlich geschwungenes Komma (Öffnung vorn, Flügelfurche nach hinten unten);
     nur ein schwacher matter Glanz oben vorn; kein Strich darunter.
     Vorlage nasenspiegel: false → nur Nasenloch (Haut); schnabel: { farbe } → Ober- und Unterschnabel (Vogel). */
  res.nase = (no = {}) => {
    const fein = T.fein !== false, k = (x, y) => w(x, y), n = v.nase;
    if (v.schnabel) return schnabelSvg(no);
    let s = "";
    if (v.nasenspiegel !== false) {
      const d = glatt([k(n.oben[0] - 0.07, n.oben[1] - 0.008), k(n.oben[0] - 0.02, n.oben[1] - 0.002), k(n.vorn[0] - 0.015, n.vorn[1] - 0.04), nV, k(n.vorn[0] - 0.008, n.vorn[1] + 0.035), nU, k(n.unten[0] - 0.045, n.unten[1] - 0.008), k(n.oben[0] - 0.06, n.oben[1] + 0.06)]);
      const a0 = k(n.oben[0] - 0.07, n.oben[1]), a1 = k(n.vorn[0], n.vorn[1] + 0.02), R = (q) => Math.round(q * 10) / 10;
      const g = no.farbe || (fein ? T.lg("n881", [[0, "#3a3430", 0.0], [0.28, "#2a2420", 0.92], [0.6, "#1c1816"], [1, "#0e0c0b"]], R(a0[0]), R(a0[1]), R(a1[0]), R(a1[1]), ' gradientUnits="userSpaceOnUse"') : "#1a1614");
      s += `<path d="${d}" fill="${g}"/>`;
      /* Leder-Körnung als feine Tüpfel (nur groß) */
      if (fein) { let t = ""; for (let i = 0; i < 14; i++) { const q = k(n.oben[0] - 0.01 + T.rnd() * 0.05, n.oben[1] + 0.015 + T.rnd() * 0.09); t += `M${Z(q[0])} ${Z(q[1])}h.01`; } s += `<path d="${t}" stroke="#4a4440" stroke-width="${Z(L * 0.004)}" stroke-opacity=".5" stroke-linecap="round"/>`; }
    }
    if (v.nasenloch !== false) {
      /* Komma: rundliche Öffnung vorn, Schweif als Flügelfurche nach hinten unten auslaufend */
      const o1 = k(n.vorn[0] - 0.012, n.vorn[1] + 0.012), o2 = k(n.vorn[0] - 0.042, n.vorn[1] + 0.002), o3 = k(n.vorn[0] - 0.05, n.vorn[1] + 0.03), o4 = k(n.vorn[0] - 0.072, n.vorn[1] + 0.052), o5 = k(n.vorn[0] - 0.04, n.vorn[1] + 0.04), o6 = k(n.vorn[0] - 0.016, n.vorn[1] + 0.036);
      const gr = v.nasenspiegel === false ? 0.6 : 1;
      s += `<path d="${glatt([o1, o2, o3, o4, o5, o6].map((p, i) => (gr === 1 ? p : lerp(o1, p, gr))))}" fill="#050303" fill-opacity="${v.nasenspiegel === false ? ".55" : ".9"}"/>`;
    }
    if (fein && v.nasenspiegel !== false) s += `<path d="${glatt([k(n.oben[0] - 0.01, n.oben[1] + 0.012), k(n.vorn[0] - 0.03, n.vorn[1] - 0.03)], false)}" stroke="#fff" stroke-opacity=".14" stroke-width="${Z(L * 0.01)}" fill="none" stroke-linecap="round"/>`;
    return s;
  };
  /* Schnabel (Vogel): Oberschnabel von der Wachshaut bis zur Spitze, Unterschnabel darunter, Schnabelspalt, Nasenloch */
  const schnabelSvg = (no = {}) => {
    const sb = v.schnabel, k = (x, y) => w(x, y), farbe = no.farbe || sb.farbe || "#d6b25a", a0 = sb.ansatz || 0.6;
    const ober = [k(a0, -0.09), k(0.75, -0.02), k(0.9, 0.04), nO, nV, k(0.96, 0.12), k(0.82, 0.13), k(a0 + 0.02, 0.12)];
    const unter = [k(a0 + 0.02, 0.13), k(0.82, 0.135), k(0.95, 0.14), k(0.88, 0.16), k(0.75, 0.165), k(a0 + 0.02, 0.18)];
    let s = `<path d="${glatt(unter)}" fill="${F.mischFarbe(farbe, "#000", 0.18)}"/><path d="${glatt(ober)}" fill="${farbe}"/>`;
    s += `<path d="${glatt([k(a0 + 0.02, 0.125), k(0.82, 0.133), k(0.97, 0.13)], false)}" stroke="#2a1e10" stroke-width="${Z(L * 0.008)}" stroke-opacity=".7" fill="none" stroke-linecap="round"/>`;
    s += `<path d="${glatt([k(0.68, 0.0), k(0.72, -0.005), k(0.74, 0.01)], false)}" stroke="#2a1e10" stroke-width="${Z(L * 0.012)}" stroke-opacity=".6" fill="none" stroke-linecap="round"/>`;
    if (T.fein !== false) s += `<path d="${glatt([k(a0 + 0.04, -0.06), k(0.78, -0.01), k(0.92, 0.05)], false)}" stroke="#fff" stroke-opacity=".25" stroke-width="${Z(L * 0.012)}" fill="none" stroke-linecap="round"/>`;
    return s;
  };
  /* Lefze als FLÄCHE (FASSUNG 881 — Prüfer 880, Punkt 8: „Lineal-Schlitz mit senkrechtem Haken“): die Lippenlinie
     folgt leicht durchhängend dem Unterkiefer (Zwischenpunkte ≈ 0,01 L tiefer als die Sehne), ist vorn am dicksten und
     läuft zum Mundwinkel auf 30 % aus; der Mundwinkel ist eine kleine, weiche Falte (spitz auslaufend) statt eines
     Strichs mit runder Kappe. Regel bleibt: die Mundlinie steigt nach hinten nicht an. */
  res.lefze = (lo = {}) => {
    if (v.schnabel) return "";
    const farbe = lo.farbe || (v.lefzeSchwarz ? "#1a120c" : "#3a2a22"), dick = L * (lo.dicke || v.mundDicke || 0.016);
    const a = lip[1], m = mw, nrm = [ay[0], ay[1]];                      // nrm: „tiefer“ im Kopf (Richtung Unterkiefer)
    const P = (t, tiefer) => { const p = lerp(a, m, t); return [p[0] + nrm[0] * tiefer * L, p[1] + nrm[1] * tiefer * L]; };
    const durch = lo.durchhang != null ? lo.durchhang : 0.011;
    const mitte = [0, 0.25, 0.5, 0.75, 1].map((t) => [t, durch * Math.sin(Math.PI * t)]);
    const dk = (t) => dick * (1 - 0.7 * t);                              // vorn 1 → hinten 0,3
    const ob = mitte.map(([t, h]) => P(t, h - dk(t) / L * 0.45)), un = mitte.slice().reverse().map(([t, h]) => P(t, h + dk(t) / L * 0.55));
    const gid = T.fein === false ? farbe : T.lg("lefze" + farbe.slice(1), [[0, farbe, 1], [0.6, farbe, 0.85], [1, farbe, 0.45]], Math.round(a[0] * 10) / 10, 0, Math.round(m[0] * 10) / 10, 0, ' gradientUnits="userSpaceOnUse"');
    let s = `<path d="${glatt(ob.concat(un))}" fill="${gid}"/>`;
    /* Mundwinkel-Falte: kurze, weiche, spitz auslaufende Kerbe nach hinten unten */
    const f0 = P(1, durch * 0.2), f1 = [f0[0] - (m[0] - a[0]) * 0.035 + nrm[0] * dick * 0.9, f0[1] - (m[1] - a[1]) * 0.035 + nrm[1] * dick * 0.9];
    const fq = [(f0[0] + f1[0]) / 2 + nrm[1] * dick * 0.25, (f0[1] + f1[1]) / 2 - nrm[0] * dick * 0.25];
    s += `<path d="M${Z(f0[0])} ${Z(f0[1])}Q${Z(fq[0])} ${Z(fq[1])} ${Z(f1[0])} ${Z(f1[1])}Q${Z(fq[0] + nrm[0] * dick * 0.3)} ${Z(fq[1] + nrm[1] * dick * 0.3)} ${Z(f0[0])} ${Z(f0[1])}Z" fill="${farbe}" fill-opacity=".55"/>`;
    if (T.fein !== false) s += `<path d="${glatt([P(0.06, durch * 0.3 - dick / L * 0.6), P(0.5, durch - dick / L * 0.55)], false)}" stroke="#fff" stroke-opacity=".12" stroke-width="${Z(dick * 0.3)}" fill="none" stroke-linecap="round"/>`;
    return s;
  };
  /* Kopfplastik: Brauenwulst (Licht oben, Schatten in die Augenhöhle), Jochbogen (Lichtgrat, Schatten darunter),
     Stop-Schatten, Fangrücken-Licht, Kaumuskel, Schatten unter dem Kinn/Kieferwinkel. Ohne Filter. */
  res.plastik = (po = {}) => {
    const dF = po.dunkel || "#1a120a", hF = po.hell || "#fff4e0", st = po.staerke || 1;
    const E = (p, rx, ry, dreh, f, op) => T.form880.weichEllipse(p[0], p[1], rx * L, ry * L, dreh + (masse.winkel || 0), f, op * st);
    let s = "";
    s += E(w(au.x - 0.01, au.y - 0.05), 0.09, 0.03, -8, hF, 0.22);               // Brauenwulst, Licht
    s += E(w(au.x + 0.005, au.y - 0.018), 0.06, 0.022, 10, dF, 0.4);             // Schatten unter dem Brauenwulst (Höhle)
    s += E(w(au.x + 0.06, au.y + 0.0), 0.04, 0.03, 0, dF, 0.22);                  // Augenwinkel vorn zur Nase (Höhle)
    s += E(w(0.33, 0.115), 0.13, 0.022, -4, hF, 0.2);                            // Jochbogen-Grat
    s += E(w(0.31, 0.16), 0.12, 0.03, -4, dF, 0.18);                             // Schatten unter dem Jochbogen
    s += E(w(0.25, 0.25), 0.1, 0.07, -10, hF, 0.08);                             // Kaumuskel (Wölbung)
    s += E(w(0.5, 0.03), 0.04, 0.035, 0, dF, 0.2);                               // Stop
    s += E(w(0.72, 0.085), 0.2, 0.018, -3, hF, 0.18);                            // Fangrücken
    s += E(w(0.62, 0.27), 0.22, 0.035, -2, dF, 0.2);                             // Lefze/Fangseite unten
    s += E(w(0.55, 0.37), 0.25, 0.03, 0, dF, 0.28);                              // unter dem Unterkiefer
    s += E(w(0.18, 0.06), 0.09, 0.05, 0, dF, 0.25);                              // Ohrgrund
    return s;
  };
  /* Ohr: Außenseite + Innenmuschel (helles Haar als Sichel am Vorderrand), Basis im Fell (Fell wird darübergelegt).
     nah = true: nahes Ohr (vorn), sonst fernes (hinter dem Kopf, dunkler). */
  res.ohrSvg = (oo = {}, nah = true) => {
    const pts = nah ? ohrNah : ohrFern, n = pts.length, fein = T.fein !== false;
    if (!n) return "";
    const aussen = oo.farbe || "#5a4a3a", innen = oo.innen || "#e8dcc4";
    let s = `<path d="${glatt(pts)}" fill="${aussen}"/>`;
    /* Innenmuschel: Sichel entlang des Vorderrands von der Basis zur Spitze (FASSUNG 881: auch am fernen Ohr, schwächer –
       sonst liest sich das ferne Ohr als dunkle flache Klappe) */
    const vord = pts.slice(Math.floor(n / 2)).reverse(), tip = pts[Math.floor(n / 2)];
    const sich = [lerp(vord[0], pts[0], 0.25), ...vord.slice(1, -1).map((p, i, arr) => lerp(p, lerp(pts[0], tip, 0.55), 0.22 + 0.1 * (i / arr.length))), lerp(tip, pts[1], 0.15)];
    const sichel = `<path d="${glatt(sich.concat(vord.slice(1, -1).reverse().map((p) => lerp(p, lerp(pts[0], tip, 0.5), 0.06))))}" fill="${innen}" fill-opacity="${op2((oo.innenOp || 0.85) * (nah ? 1 : 0.55))}"/>`;
    if (!nah) return s + (oo.innen ? sichel : "") + `<path d="${glatt(pts)}" fill="#0e0a06" fill-opacity="${op2(oo.schatten != null ? oo.schatten : 0.3)}"/>`;
    s += sichel;
    if (fein) {
      /* Innenhaar: Büschel quer über die Muschelkante nach vorn oben */
      let d = "";
      for (let i = 0; i < 11; i++) {
        const u = 0.1 + i * 0.072, p = lerp(lerp(pts[0], tip, u), vord[Math.min(vord.length - 1, Math.floor(u * vord.length))], 0.4), l = L * (0.03 + T.rnd() * 0.03);
        d += `M${Z(p[0])} ${Z(p[1])}q${Z(l * 0.3)} ${Z(-l * 0.5)} ${Z(l * 0.75)} ${Z(-l * 0.65)}`;
      }
      s += `<path d="${d}" stroke="${oo.innenHaar || "#f6efe2"}" stroke-width="${Z(L * 0.004)}" stroke-opacity=".8" fill="none" stroke-linecap="round"/>`;
      /* dunkler Ohrrand hinten (Rückseite), Schatten in der Muscheltiefe */
      /* FASSUNG 881: Rand nur angedeutet (vorher 1,2 % L bei 70 % Deckkraft = „Helm“) */
      s += `<path d="${glatt(pts.slice(0, Math.floor(n / 2) + 1), false)}" stroke="${oo.rand || "#2a221a"}" stroke-width="${Z(L * 0.008)}" stroke-opacity=".35" fill="none" stroke-linecap="round"/>`;
    }
    return s;
  };
  /* Tasthaare: aus den Haarpolstern der Oberlippe, fächerförmig nach vorn/unten */
  res.tasthaare = (to = {}) => {
    if (T.fein === false) return "";
    const p = w(0.86, 0.2), n = to.n || 7, Lh = L * (to.laenge || 0.22);
    let d = "";
    for (let i = 0; i < n; i++) {
      const a = ((masse.winkel || 0) + 8 + i * 5 + (T.rnd() - 0.5) * 6) * Math.PI / 180, l = Lh * (0.7 + T.rnd() * 0.5);
      const s0 = [p[0] - i * L * 0.012, p[1] + (i % 3) * L * 0.012];
      d += `M${Z(s0[0])} ${Z(s0[1])}q${Z(Math.cos(a) * l * 0.5)} ${Z(Math.sin(a) * l * 0.3)} ${Z(Math.cos(a) * l)} ${Z(Math.sin(a) * l + l * 0.12)}`;
    }
    let pk = "";
    for (let i = 0; i < 9; i++) { const q = w(0.8 + (i % 3) * 0.035, 0.19 + Math.floor(i / 3) * 0.025); pk += `M${Z(q[0])} ${Z(q[1])}h.01`; }
    return `<path d="${pk}" stroke="#1a120c" stroke-width="${Z(L * 0.009)}" stroke-linecap="round" stroke-opacity=".5"/>` +
      `<path d="${d}" stroke="${to.farbe || "#d8d0c4"}" stroke-width="${Z(L * 0.0035)}" stroke-opacity=".75" fill="none" stroke-linecap="round"/>`;
  };
  return res;
}

function installiere(T) {
  T.KOPFVORLAGEN = VORLAGEN;
  T.kopf = (bauplan, masse, o) => kopf(T, bauplan, masse, o);
  return T;
}
module.exports = { installiere, VORLAGEN, kopf };
