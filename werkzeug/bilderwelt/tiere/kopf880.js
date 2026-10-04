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
    oben: [[0, 0], [0.08, -0.038], [0.2, -0.056], [0.33, -0.046], [0.42, -0.018], [0.485, 0.024], [0.6, 0.052], [0.75, 0.074], [0.88, 0.094]],
    nase: { oben: [0.94, 0.103], vorn: [1.0, 0.145], unten: [0.968, 0.205] },
    lippe: [[0.978, 0.238], [0.955, 0.272]],
    unten: [[0.915, 0.298], [0.875, 0.33], [0.72, 0.348], [0.52, 0.362], [0.34, 0.37], [0.2, 0.39], [0.1, 0.415]],
    auge: { x: 0.43, y: 0.072, r: 0.032, winkel: 16, pupille: "rund", iris: "#d8a43a", iris2: "#7a4a12" },
    ohr: { hinten: [0.1, -0.03], vorn: [0.27, -0.05], hoehe: 0.34, breite: 0.17, neigung: 6, form: "spitz" },
    jochbogen: [[0.41, 0.135], [0.3, 0.13], [0.18, 0.105]],
    ganasche: [0.24, 0.3],
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
const ALIAS = { wolf: "hund", fuchs: "hund", loewe: "katze", tiger: "katze", ziege: "rind", schaf: "rind", antilope: "hirsch", reh: "hirsch" };

/* T.kopf(bauplan, masse, o)
   masse: { hinterhaupt: [x, y], laenge (cm), winkel (Grad, Nase tiefer = positiv) } – z. B. sk.kopf aus T.skelett;
   o: { vorlage-Überschreibungen (stop: Tiefe in Kopflängen, fang: Faktor Fanghöhe, auge: {…}, ohr: {…}) }
   Liefert { umrissSil (für T.silhouette), achse (A/B für T.licht), punkte (auge, nase, mundwinkel, kinn, kehlPunkt …),
             w(x, y) (Kopf → Welt), ohr: { nah: pts, fern: pts }, augeR } und Zeichenhelfer (siehe unten). */
function kopf(T, bauplan, masse, o = {}) {
  const v = JSON.parse(JSON.stringify(VORLAGEN[ALIAS[bauplan] || bauplan] || VORLAGEN.hund));
  for (const k of Object.keys(o)) if (o[k] && typeof o[k] === "object" && !Array.isArray(o[k]) && v[k] && !Array.isArray(v[k])) Object.assign(v[k], o[k]); else if (k in v) v[k] = o[k];
  const O = masse.hinterhaupt, L = masse.laenge, th = (masse.winkel || 0) * Math.PI / 180;
  const ax = [Math.cos(th), Math.sin(th)], ay = [-Math.sin(th), Math.cos(th)];
  const w = (x, y) => [O[0] + L * (x * ax[0] + y * ay[0]), O[1] + L * (x * ax[1] + y * ay[1])];
  /* Stop vertiefen/abflachen, Fang höher/flacher */
  if (o.stop != null) v.oben = v.oben.map(([x, y]) => [x, y + (x > 0.4 && x < 0.6 ? o.stop * Math.sin((x - 0.4) / 0.2 * Math.PI) : 0)]);
  const oben = v.oben.map(([x, y]) => w(x, y));
  const nO = w(...v.nase.oben), nV = w(...v.nase.vorn), nU = w(...v.nase.unten);
  const lip = v.lippe.map(([x, y]) => w(x, y));
  const unten = v.unten.map(([x, y]) => w(x, y));
  /* Auge, Mundwinkel unter dem vorderen Augendrittel; Regel: Mundlinie steigt nach hinten nicht an */
  const au = v.auge, aug = w(au.x, au.y), rr = au.r * L, halb = rr * 1.35;
  let mw = w(au.x + au.r * 1.35 * 0.33, Math.max(v.lippe[1][1] + 0.025, v.unten[2][1] - 0.035));
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
    const bh = w(oh.hinten[0] + versatz, oh.hinten[1] + 0.03), bv = w(oh.vorn[0] + versatz, oh.vorn[1] + 0.03);
    const m = lerp(bh, bv, 0.5), H = oh.hoehe * L * kl, Bb = oh.breite * L * kl, ng = oh.neigung * Math.PI / 180;
    const up = [Math.sin(ng), -Math.cos(ng)], rt = [Math.cos(ng), Math.sin(ng)];
    const P = (u, h) => [m[0] + rt[0] * u * Bb + up[0] * h * H, m[1] + rt[1] * u * Bb + up[1] * h * H];
    if (oh.form === "rund") return [bh, P(-0.62, 0.45), P(-0.45, 0.88), P(0, 1), P(0.45, 0.88), P(0.6, 0.45), bv];
    if (oh.form === "blatt") return [bh, P(-0.4, 0.5), P(-0.15, 0.95), P(0.1, 1), P(0.35, 0.8), P(0.5, 0.35), bv];
    /* spitz mit gerundeter Spitze (Wolf): Vorderrand fast gerade, Hinterrand leicht gewölbt */
    return [bh, P(-0.58, 0.35), P(-0.38, 0.72), P(-0.12, 0.96), P(0.02, 1.0), P(0.14, 0.92), P(0.3, 0.6), P(0.48, 0.22), bv];
  };
  const ohrNah = ohrPts(0, 1), ohrFern = ohrPts(0.045, 0.94);
  const res = {
    umrissSil, achse: { A, B }, w, L, rr, halb,
    punkte: { hinterhaupt: O, auge: aug, nase: nV, nasenOben: nO, nasenUnten: nU, mundwinkel: mw, lippeVorn: lipV, kinn: unten[1], kehlPunkt: unten[unten.length - 1],
      stop: w(0.485, 0.024), ganasche: w(...v.ganasche) },
    ohr: { nah: ohrNah, fern: ohrFern }, vorlage: v,
  };
  res.kehlPunkt = res.punkte.kehlPunkt;
  res.nackenPunkt = O;
  /* ---------- Zeichenhelfer ---------- */
  /* Auge in der Höhle (T.augeReal mit Option hoehle), Winkel = Vorlage + Kopfwinkel */
  res.auge = (ao = {}) => T.augeReal(aug[0], aug[1], ao.r || rr, Object.assign({ iris: au.iris, iris2: au.iris2, pupille: au.pupille, winkel: (au.winkel || 0) + (masse.winkel || 0), offen: 0.66, hoehle: true }, ao));
  /* Nasenspiegel bündig: Oberkante setzt den Nasenrücken fort; Nasenloch als Komma vorn seitlich; Glanzstreif */
  res.nase = (no = {}) => {
    const fein = T.fein !== false, k = (x, y) => w(x, y), n = v.nase;
    const d = glatt([k(n.oben[0] - 0.035, n.oben[1] - 0.004), [nO[0], nO[1]], k(n.vorn[0] - 0.012, n.vorn[1] - 0.03), nV, k(n.vorn[0] - 0.008, n.vorn[1] + 0.035), nU, k(n.unten[0] - 0.04, n.unten[1] - 0.012), k(n.oben[0] - 0.06, n.oben[1] + 0.05)]);
    let s = `<path d="${d}" fill="${no.farbe || T.lg("n880" + (no.farbe || "s").replace("#", ""), [[0, "#4a4440"], [0.4, "#221d1a"], [1, "#0b0908"]])}"/>`;
    const nl = [k(n.vorn[0] - 0.012, n.vorn[1] + 0.02), k(n.vorn[0] - 0.045, n.vorn[1] + 0.005), k(n.vorn[0] - 0.05, n.vorn[1] + 0.035), k(n.vorn[0] - 0.02, n.vorn[1] + 0.045)];
    s += `<path d="${glatt(nl)}" fill="#020101"/>`;
    s += `<path d="${glatt([k(n.vorn[0] - 0.05, n.vorn[1] + 0.035), k(n.vorn[0] - 0.08, n.vorn[1] + 0.03)], false)}" stroke="#020101" stroke-width="${Z(L * 0.006)}" fill="none" stroke-linecap="round"/>`;
    if (fein) {
      s += `<path d="${glatt([k(n.oben[0] - 0.02, n.oben[1] + 0.006), k(n.vorn[0] - 0.02, n.vorn[1] - 0.025)], false)}" stroke="#fff" stroke-opacity=".42" stroke-width="${Z(L * 0.008)}" fill="none" stroke-linecap="round"/>`;
      s += `<path d="${glatt([k(n.unten[0] + 0.005, n.unten[1] + 0.002), k(n.unten[0] + 0.012, n.unten[1] + 0.03)], false)}" stroke="#1a1512" stroke-width="${Z(L * 0.005)}" fill="none"/>`;
    }
    return s;
  };
  /* Lefze als FLÄCHE: schwarzer Lippenrand, vorn breiter, zum Mundwinkel schmal; darunter Unterlippe/Kinn */
  res.lefze = (lo = {}) => {
    const farbe = lo.farbe || (v.lefzeSchwarz ? "#0f0b09" : "#3a2a22");
    const a = lip[1], m = mw, k1 = lerp(a, m, 0.35), k2 = lerp(a, m, 0.7), dick = L * (lo.dicke || 0.014);
    const ob = [a, [k1[0], k1[1] - dick * 0.1], [k2[0], k2[1] + dick * 0.05], m], un = [[m[0] + dick * 0.6, m[1] + dick * 0.5], [k2[0], k2[1] + dick * 1.0], [k1[0], k1[1] + dick * 1.1], [a[0] - dick * 0.3, a[1] + dick * 0.9]];
    let s = `<path d="${glatt(ob.concat(un))}" fill="${farbe}"/>`;
    /* Mundwinkel: kleine Falte nach unten (Lippenwinkel), keine Aufwärtsbiegung */
    s += `<path d="${glatt([m, [m[0] - dick * 0.6, m[1] + dick * 0.9]], false)}" stroke="${farbe}" stroke-width="${Z(dick * 0.5)}" fill="none" stroke-linecap="round"/>`;
    if (T.fein !== false) s += `<path d="${glatt([lerp(a, m, 0.08), lerp(a, m, 0.6)].map((p) => [p[0], p[1] - dick * 0.25]), false)}" stroke="#fff" stroke-opacity=".18" stroke-width="${Z(dick * 0.3)}" fill="none"/>`;
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
    const aussen = oo.farbe || "#5a4a3a", innen = oo.innen || "#e8dcc4";
    let s = `<path d="${glatt(pts)}" fill="${aussen}"/>`;
    if (!nah) return s + `<path d="${glatt(pts)}" fill="#0e0a06" fill-opacity=".3"/>`;
    /* Innenmuschel: Sichel entlang des Vorderrands von der Basis zur Spitze */
    const vord = pts.slice(Math.floor(n / 2)).reverse(), tip = pts[Math.floor(n / 2)];
    const sich = [lerp(vord[0], pts[0], 0.25), ...vord.slice(1, -1).map((p, i, arr) => lerp(p, lerp(pts[0], tip, 0.55), 0.22 + 0.1 * (i / arr.length))), lerp(tip, pts[1], 0.15)];
    s += `<path d="${glatt(sich.concat(vord.slice(1, -1).reverse().map((p) => lerp(p, lerp(pts[0], tip, 0.5), 0.06))))}" fill="${innen}" fill-opacity="${op2(oo.innenOp || 0.85)}"/>`;
    if (fein) {
      /* Innenhaar: Büschel quer über die Muschelkante nach vorn oben */
      let d = "";
      for (let i = 0; i < 16; i++) {
        const u = 0.1 + i * 0.05, p = lerp(lerp(pts[0], tip, u), vord[Math.min(vord.length - 1, Math.floor(u * vord.length))], 0.4), l = L * (0.03 + T.rnd() * 0.03);
        d += `M${Z(p[0])} ${Z(p[1])}q${Z(l * 0.3)} ${Z(-l * 0.5)} ${Z(l * 0.75)} ${Z(-l * 0.65)}`;
      }
      s += `<path d="${d}" stroke="${oo.innenHaar || "#f6efe2"}" stroke-width="${Z(L * 0.004)}" stroke-opacity=".8" fill="none" stroke-linecap="round"/>`;
      /* dunkler Ohrrand hinten (Rückseite), Schatten in der Muscheltiefe */
      s += `<path d="${glatt(pts.slice(0, Math.floor(n / 2) + 1), false)}" stroke="${oo.rand || "#2a221a"}" stroke-width="${Z(L * 0.012)}" stroke-opacity=".7" fill="none" stroke-linecap="round"/>`;
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
