/* =====================================================================
   TIER-BIBLIOTHEK — LAUFFÄHIGE VORLAGE FÜR DAS WERKZEUG 880 (FASSUNG 881)
   ---------------------------------------------------------------------
   XANDER (Funk 299, wörtlich): „die nächste Priorität sollte der Abschluss der Tiere sein mache bitte nur deine
   Aufgaben und nicht irgendwas anderes was du hinein interpretierst … kümmere Dich jetzt mal bitte intensiv um das
   alles“. Früher (ANLEITUNG.md, 03.10.): „perfekter Löwe … perfekter Wolf … wie in Jurassic Park … fast
   fotorealistisch … Muskeln, Sehnen, Pupillen, Krallen … Licht und Schatten realistisch plastisch massiv“.

   FASSUNG 881 — Warum: Prüfer 880, Punkt 14: das Beispiel in ANLEITUNG.md war nicht lauffähig (s und box undefiniert)
   und ließ ferne Läufe, Rute und Kopf-Fell weg. Diese Datei ist der VOLLSTÄNDIGE Ablauf als Funktion – für JEDEN der
   12 Baupläne einmal durchgespielt (node …/pruefe-tier.js vorlage_hund --art …/vorlage880.js). Eine neue Art kopiert
   vorlage() in ihre Gruppendatei und ersetzt die Platzhalter (Farben, Muster, Fellzonen, Kopfdetails) nach der
   RECHERCHE der Art. Was die Vorlage NICHT ersetzt: Recherche, Art-Parameter, Muster, Kritiker.

   Wird NICHT als Gruppe geladen (kern.js alleArten überspringt vorlage880.js); exportiert { vorlage, arten }.
   ===================================================================== */
"use strict";

/* vorlage(T, bauplan, o) → { svg, box, umriss, fuesse, sk, kopf }   (Zentimeter, Blick nach rechts, Boden y = 0)
   o: { W (Widerrist-/Hüfthöhe cm), art ({ …Überschreibungen des Bauplans }), pose ({ art, fernVorn, fernHinten, x0 }),
        kopf ({ stop, auge, ohr … für T.kopf }), profil ({ fell, nackenKamm, kehle, vorbrust, hose, schwanz } für
        T.silhouette), farbe (Grundfarbe), bauch (Farbe der Unterseite), haut ("fell" | "schuppen" | "federn"; Standard
        nach Bauplan) } */
function vorlage(T, bauplan, o = {}) {
  const W = o.W || 80, fein = T.fein !== false, F = T.form880;
  const name = T.BAUPLAN_ALIAS && T.BAUPLAN_ALIAS[bauplan] ? T.BAUPLAN_ALIAS[bauplan] : bauplan;
  const haut = o.haut || ({ echse: "schuppen", theropode: "schuppen", vogel: "federn", elefant: "haut", robbe: "haut" })[name] || "fell";
  /* 1. Bauplan → Skelett (Knochen, Gelenke, Landmarken in cm) */
  const sk = T.skelett(bauplan, Object.assign({ W }, o.art || {}), Object.assign({ art: "stehen", x0: 20 }, o.pose || {}));
  const flosse = sk.gang === "flosse", zwei = sk.zwei;
  /* 2. Kopf (Schädelvorlage des Bauplans), Füße (nach Gangart), EIN Körperumriss */
  const kp = T.kopf(bauplan, sk.kopf, o.kopf || {});
  const fV = T.fuss(sk, "vn", {}), fH = T.fuss(sk, "hn", {});
  const sil = T.silhouette(sk, Object.assign({ kopf: kp, fussVorn: fV, fussHinten: fH }, o.profil || {}));
  const ax = (n) => sil.achsen.find((a) => a.name === n);
  const rumpf = ax("rumpf"), kopfA = ax("kopf");
  const farbe = o.farbe || "#9a8a74", fernF = F.mischFarbe(farbe, "#1c2430", 0.22), bauchF = o.bauch || F.mischFarbe(farbe, "#f4ecdc", 0.45);
  let s = "";
  /* 3. HINTEN (zuerst gezeichnet): fernes Ohr, ferne Glieder (dunkler, kühler, im Schlagschatten), Schwanz außerhalb
        des Umrisses */
  s += kp.ohrSvg({ farbe: fernF, innen: "#d8ccb4", schatten: 0.16 }, false);
  const quer = T.lg("vqQuer", [[0, "#fff4e0", 0.14], [0.32, "#fff4e0", 0], [0.6, "#1a120a", 0.14], [1, "#1a120a", 0.45]], 0, 0, 1, 0);
  const fernesGlied = (wo) => {
    const k = T.beinKette(sk, wo, { oben: true }), fu = T.fuss(sk, wo, { fern: true, op: 0.85 });
    const g = T.glied(k.kette, k.breiten, { extraA: k.extraA, ersetzeA: k.ersetzeA, fuss: fu.pts, fussAchse: fu.achse, farbe: fernF, fern: true, quer, name: wo,
      schatten: [sk.lm.brustTief[1] - W * 0.06, sk.lm.brustTief[1] + W * 0.24], schattenStaerke: 0.72 });
    return g.svg + fu.svg;
  };
  s += fernesGlied("hf");
  if (!zwei && !flosse) s += fernesGlied("vf");
  if (name === "vogel") {
    /* Vogel: Schwanz = Steuerfedern (gefächert nach hinten oben), kein Strang */
    const sa = sk.lm.schwanzansatz;
    s += T.federn.schwinge([sa[0] + W * 0.02, sa[1] + W * 0.05], { richtung: 215, n: 7, laenge: W * 0.4, breite: W * 0.07, spreiz: 26, farbe: F.mischFarbe(farbe, "#000", 0.25) });
  } else if (!sil.schwanz && sk.schwanz.laenge > W * 0.05) {
    /* Schwanz als eigener Strang hinter dem Körper (Säuger; buschige Ruten bekommen eigenes Fell wie beim Wolf) */
    const k = sk.schwanz.kette, n = k.length, d0 = sk.schwanz.dicke || W * 0.04;
    const g = T.glied(k, k.map((_, i) => { const t = i / (n - 1), d = d0 * (1 - 0.7 * t); return [d, d]; }), { farbe, name: "schwanz", quer });
    s += g.svg;
  }
  /* 4. KÖRPER: Grundfarbe, Licht (Querverläufe, Okklusion, Muskeln), Muster (Unterseite heller), Oberfläche (Fell /
        Schuppen / Federn) – alles im EINEN Umriss */
  const L = T.licht(sil, { staerke: 1.2 });
  let innen = T.muster(rumpf, { art: "fleck", t0: 0.6, t1: 1.2, s0: 0.15, s1: 0.75, farbe: bauchF, op: 0.7 });
  if (kopfA) innen += T.muster(kopfA, { art: "fleck", t0: 0.55, t1: 1.2, s0: 0.25, s1: 1.0, farbe: bauchF, op: 0.6 });
  innen += L.innen;
  if (haut === "fell") {
    const fl = T.fluss(sil);
    innen += T.unterhaar([{ pts: T.zone(rumpf, -0.2, 1.2, 0, 1), winkel: 170, kachel: 5, dichte: 0.9 }]);
    innen += T.fell(sil, { fluss: fl, hell: L.hell, zonen: [
      { pts: T.zone(rumpf, -0.15, 1.15, 0, 0.7), laenge: W * 0.06, dichte: 0.7, breite: W * 0.0017, strich: false, straehnen: [3, 5], kruemmung: 0.3, hell: ["#f2e8d8", 0.22], dunkel: ["#18130e", 0.18] },
      ...(kopfA ? [{ pts: T.zone(kopfA, -0.1, 1.1, 0, 0.9), laenge: W * 0.014, dichte: 5, breite: W * 0.0005, straehnen: [2, 3], hell: ["#f2e8d8", 0.28], dunkel: ["#1a140e", 0.2] }] : []),
    ] });
  } else if (haut === "schuppen") {
    /* Schuppengröße nach Körperlänge (sonst tausende Schuppen bei langen Echsen/Sauriern) */
    const lang = F.abst(rumpf.A[0], rumpf.A[rumpf.A.length - 1]);
    innen += T.oberflaeche([{ art: "schuppen", achse: rumpf, groesse: Math.max(W * 0.04, lang / 28), klein: 0.45, farbe: "#000", op: 0.25 }]);
  } else if (haut === "federn") {
    innen += T.federn.flur(T.zone(rumpf, 0.0, 1.0, 0.1, 0.8), { richtung: 175, groesse: W * 0.05, farbe: F.mischFarbe(farbe, "#000", 0.1), op: 0.6 });
  }
  s += `<use href="#${sil.id}" fill="${farbe}"/><g clip-path="${sil.clip}">${innen}</g>`;
  /* 5. Konturfell (nur Fell): Haarspitzen über den Umriss an Rücken, Kehle, Bauch, Hose */
  if (haut === "fell") {
    const K = sil.kanten;
    s += T.fell(sil, { fluss: T.fluss(sil), zonen: [], kanten: [
      { pts: K.ruecken.slice(1), laenge: W * 0.025, abstand: W * 0.045, farbe: F.mischFarbe(farbe, "#000", 0.3), op: 0.6, breite: W * 0.0008, raus: 0.2 },
      { pts: K.kehle, laenge: W * 0.04, abstand: W * 0.03, farbe: bauchF, op: 0.7, breite: W * 0.001, raus: 0.3 },
      { pts: (K.unten || []).slice(1), laenge: W * 0.03, abstand: W * 0.045, farbe: bauchF, op: 0.6, breite: W * 0.0008, raus: 0.35 },
    ] });
  }
  /* 6. VORN (über dem Körper): Arm des Zweibeiners mit Hand, Vorderflosse der Robbe, Flügel des Vogels */
  if (zwei && name === "vogel") {
    const sb = sk.beine.vn.p.schulter;
    s += T.federn.schwinge([sb[0], sb[1] + W * 0.04], { richtung: 186, n: 8, laenge: W * 0.42, breite: W * 0.06, spreiz: 10, farbe: F.mischFarbe(farbe, "#000", 0.15) });
  } else if ((zwei || flosse) && sil.arm) {
    const vorn = flosse ? T.flosse(sk.beine.vn.p.fessel, sk.beine.vn.p.spitze, sil.arm.breiten[sil.arm.breiten.length - 1], { vorn: true }) : null;
    const geo = { name: "arm", fuss: vorn ? vorn.pts : [], fussAchse: vorn && vorn.achse };
    const g0 = T.glied(sil.arm.kette, sil.arm.breiten, geo);                 // nur Geometrie (ohne Farbe: keine defs)
    const Lg = T.licht({ achsen: [g0.achse], W, pts: g0.umriss }, { staerke: 1.1, okklusion: false, muskeln: false });
    const g = T.glied(sil.arm.kette, sil.arm.breiten, Object.assign({ farbe, innen: Lg.innen }, geo));
    s += g.svg + (vorn ? vorn.svg : fV.svg);
  }
  /* 7. Füße, Kopfdetails (Plastik im Umriss, Lefze, Nase, Auge in der Höhle, nahes Ohr, Tasthaare) */
  s += (flosse || zwei ? "" : fV.svg) + fH.svg;
  if (fein) s += `<g clip-path="${sil.clip}">${kp.plastik({})}</g>`;
  s += kp.lefze({}) + kp.nase({}) + kp.auge({}) + kp.ohrSvg({ farbe: F.mischFarbe(farbe, "#000", 0.1), innen: "#e6d9be" }, true);
  if (haut === "fell") s += kp.tasthaare({ farbe: "#2a221c" });
  const b = F.box(sil.pts.concat(kp.ohr.nah.length ? kp.ohr.nah : [], kp.ohr.fern.length ? kp.ohr.fern : []));
  const kb = F.box(kp.umrissSil);
  return { svg: s, box: [Math.min(b[0], sk.schwanz.kette[sk.schwanz.kette.length - 1][0]) - 3, b[1] - 3, b[2] + 3, 0], umriss: sil.pts, fuesse: sk.fuesse, sk,
    kopf: [kb[0] - 4, kb[1] - 8, kb[2] + 4, kb[3] + 4] };
}

/* Demo-Art (nur für Sonde/Blatt: node …/pruefe-tier.js vorlage_hund --art …/vorlage880.js) */
const arten = [
  { id: "vorlage_hund", de: "der Hund (Vorlage 880)", syl: "HUND", it: "il cane", itSyl: "CA-ne", en: "dog", gruppe: "Vorlage", lebensraum: "–",
    laenge: 1.6, hoehe: 0.9, zeichne(T) { return vorlage(T, "hund", { W: 60, art: { rumpfL: 1.06, brustTiefe: 0.46 } }); } },
];
module.exports = { vorlage, arten };
