/* =====================================================================
   TIER-BIBLIOTHEK — BAUPLÄNE UND SKELETT (FASSUNG 880 — W1)
   ---------------------------------------------------------------------
   XANDER (Funk 299, wörtlich): „die nächste Priorität sollte der Abschluss der Tiere sein mache bitte nur deine
   Aufgaben und nicht irgendwas anderes was du hinein interpretierst … kümmere Dich jetzt mal bitte intensiv um das
   alles“. Früher (ANLEITUNG.md, 03.10.): „perfekter Löwe … perfekter Wolf … wie in Jurassic Park … fast
   fotorealistisch … Muskeln, Sehnen, Pupillen, Krallen … Licht und Schatten realistisch plastisch massiv“.

   FASSUNG 880 — Warum: Bisher tippte jede Gruppe ihre Beinumrisse von Hand, Proportionen nach Augenmaß; nach jeder
   Kritikrunde verschoben sie sich (Kritik Wolf R3: „Hinterteil ein Sack mit Stelze, kein Sprunggelenk … fernes
   Hinterbein wächst aus dem Bauch“). Jetzt: Eine Art = Bauplan + wenige Parameter. T.skelett rechnet die Gelenk-
   punkte aller vier Beine (fernes Paar halb versetzt, dahinter) und die Landmarken aus Knochenlängen und Ruhewinkeln.

   EINHEITEN: alle Längen in Anteilen der Widerristhöhe W (bei Zweibeinern: Hüfthöhe), Winkel in Grad.
   Knochenwinkel = Richtung vom oberen zum unteren Gelenk, gemessen von der Senkrechten nach unten,
   positiv = zum Kopf hin (nach vorn, +x). Ausgabe in cm: Blick nach rechts, Boden y = 0, oben negativ.

   QUELLEN (Recherche 04.10., Richtwerte – je Art über Parameter anpassen):
   - FCI-Standard Nr. 166 Deutscher Schäferhund (kusa.co.za, Fassung 02-2021): Brusttiefe 45–48 % der Widerristhöhe,
     Rumpflänge 110–117 % der Widerristhöhe, Kopflänge ≈ 40 % der Widerristhöhe.
   - Grauwolf (Wikipedia „Wolf“, Zusammenfassung dlab.epfl.ch): Schulterhöhe 80–85 cm, Kopf-Rumpf 105–160 cm,
     Schwanz 29–50 cm, Ohren 9–11 cm, Hinterfuß 22–25 cm. Brachialindex (Radius/Humerus) beim Wolf ≈ 100 %
     (Untersuchungen zur Gliedmaßenproportion, par.nsf.gov 10218474); Wölfe sind hochbeiniger als Haushunde
     (Kritik Wolf R2/R3: Brust 44 %, Lauf 56 %, Sprunggelenk 26 %, Handwurzel 19 %).
   - Hauskatze (Long Bone Ratios in Felis catus, acikerisim.gelisim.edu.tr): Intermembralindex 89,8,
     Humerofemoralindex 94,4, Brachialindex 96,7, Cruralindex 106,6.
   - Pferd (Normal Proportions of the Horse, NCBI PMC10367726, nach der französischen Veterinärschule): Widerrist
     = 2,5 Kopflängen (Kopf ≈ 0,4 W), Rumpflänge Buggelenk–Sitzbeinhöcker = Widerristhöhe, Kruppe = Widerrist,
     Knie–Sprunggelenk = Sprunggelenk–Boden = 1 Kopflänge; Rumpftiefe ≈ Beinlänge (UGA Extension B1400);
     Schulter- und Fesselwinkel 40–55° (UMN Extension „Conformation“).
   - Holstein-Rind (animalsciencejournal.usamv.ro 2018/1 Art. 8): Widerrist 143–146 cm, Kreuzbein 149–151 cm,
     Brusttiefe 76–77 cm (≈ 0,53 W), schräge Rumpflänge 170–171 cm (≈ 1,18 W).
   - Rothirsch (Wikipedia „Red deer“): Schulterhöhe 95–130 cm (Schottland ♂ 122 cm), Kopf-Rumpf 175–250 cm.
   - Bär: Sohlengänger, Ellbogenwinkel ~20° offen (Ginsburg 1961, naturalhistory.si.edu); Bauchfreiheit 45–50 %
     der Schulterhöhe (Kritik Braunbär R3).
   - Theropoden (Persons & Currie 2016, Sci. Rep. 6:19828, „cursorial limb proportions“): Unterschenkel+Mittelfuß
     zu Oberschenkel als Laufindex; T. rex „Sue“ Femur ≈ 1,32 m, Tibia ≈ 1,15 m, Metatarsus ≈ 0,67 m bei
     Hüfthöhe ≈ 3,7 m; Schädel ≈ 1,4 m.
   - Allgemein: Gliedmaßen von Zehen-/Sohlen-/Spitzengängern (animaldiversity.org „running fast“): Läufer haben
     lange Mittelhand/-fuß, kurze Zehenglieder.
   ===================================================================== */
"use strict";
const RAD = Math.PI / 180;
const r2 = (n) => Math.round(n * 100) / 100;

/* ---------------------------------------------------------------------
   BAUPLÄNE — Werte in W (Widerristhöhe). [Länge, Winkel] je Knochen.
   vorn:  schulterblatt (Oberrand → Buggelenk), oberarm (→ Ellbogen), unterarm (→ Handwurzel),
          mittelhand (→ Fesselgelenk/Zehengrundgelenk), zehe (→ Bodenpunkt vorn)
   hinten: oberschenkel (Hüftgelenk → Knie), unterschenkel (→ Sprunggelenk), mittelfuss (→ Fesselgelenk), zehe
   becken: [Darmbein Hüftgelenk→Hüfthöcker, Sitzbein Hüftgelenk→Sitzbeinhöcker, Neigung der Beckenachse]
   widerristUeber: Dornfortsätze + Haut über dem Schulterblatt-Oberrand; kruppeUeber: Kruppe über dem Hüftgelenk.
   rumpfL: Bugspitze → Sitzbeinhöcker; brustTiefe: Widerrist → Brustbein; aufzug: Flanke über Brustunterkante.
   breite: halbe Dicke der Glieder (hinten/vorn je Gelenk) für T.glied – siehe glieder unten.
   --------------------------------------------------------------------- */
const BAUPLAENE = {
  hund: {
    name: "Hund/Wolf (Canidae) – Zehengänger", gang: "zehen",
    rumpfL: 1.12, brustTiefe: 0.45, kruppe: 0.97, aufzug: 0.1, widerristUeber: 0.09, kruppeUeber: 0.2, bugVor: 0.045,
    vorn: { schulterblatt: [0.25, 30], oberarm: [0.25, -32], unterarm: [0.29, 0], mittelhand: [0.155, 15], zehe: [0.08, 63] },
    hinten: { oberschenkel: [0.31, 22], unterschenkel: [0.32, -40], mittelfuss: [0.21, 2], zehe: [0.08, 63] },
    becken: [0.17, 0.09, 30],
    hals: { laenge: 0.44, winkel: 22, dickeA: 0.36, dickeE: 0.22 },
    kopf: { laenge: 0.37, winkel: 8 },
    schwanz: { laenge: 0.52, winkel: 72, dicke: 0.05 },
    /* Glieddicken (halb, in W): [hinten, vorn] je Gelenk der Kette Ellbogen…Fessel bzw. Knie…Fessel */
    glieder: {
      vorn: { ellbogen: [0.075, 0.06], unterarmBauch: [0.05, 0.052], handwurzel: [0.034, 0.032], mittelhand: [0.026, 0.028], fessel: [0.03, 0.03] },
      hinten: { knie: [0.13, 0.065], wade: [0.1, 0.052], ferse: [0.04, 0.032], mittelfuss: [0.025, 0.028], fessel: [0.03, 0.03] },
    },
  },
  katze: {
    name: "Katze/Großkatze (Felidae) – Zehengänger, Rumpf lang, Gelenke stark gewinkelt", gang: "zehen",
    rumpfL: 1.32, brustTiefe: 0.5, kruppe: 0.98, aufzug: 0.08, widerristUeber: 0.06, kruppeUeber: 0.19, bugVor: 0.05,
    vorn: { schulterblatt: [0.29, 26], oberarm: [0.29, -38], unterarm: [0.29, 3], mittelhand: [0.13, 18], zehe: [0.085, 65] },
    hinten: { oberschenkel: [0.35, 28], unterschenkel: [0.36, -52], mittelfuss: [0.22, 10], zehe: [0.085, 65] },
    becken: [0.18, 0.09, 24],
    hals: { laenge: 0.36, winkel: 18, dickeA: 0.4, dickeE: 0.26 },
    kopf: { laenge: 0.3, winkel: 4 },
    schwanz: { laenge: 0.8, winkel: 60, dicke: 0.04 },
    glieder: {
      vorn: { ellbogen: [0.08, 0.07], unterarmBauch: [0.06, 0.06], handwurzel: [0.042, 0.04], mittelhand: [0.036, 0.036], fessel: [0.04, 0.04] },
      hinten: { knie: [0.11, 0.07], wade: [0.08, 0.055], ferse: [0.04, 0.033], mittelfuss: [0.03, 0.03], fessel: [0.036, 0.036] },
    },
  },
  baer: {
    name: "Bär (Ursidae) – Sohlengänger, Schulterbuckel", gang: "sohle",
    rumpfL: 1.25, brustTiefe: 0.53, kruppe: 0.9, aufzug: 0.03, widerristUeber: 0.12, kruppeUeber: 0.2, bugVor: 0.05,
    vorn: { schulterblatt: [0.29, 22], oberarm: [0.31, -22], unterarm: [0.28, 2], mittelhand: [0.12, 72], zehe: [0.07, 86] },
    hinten: { oberschenkel: [0.39, 10], unterschenkel: [0.32, -22], mittelfuss: [0.2, 84], zehe: [0.07, 88] },
    becken: [0.17, 0.09, 26],
    hals: { laenge: 0.34, winkel: 8, dickeA: 0.44, dickeE: 0.32 },
    kopf: { laenge: 0.38, winkel: 14 },
    schwanz: { laenge: 0.09, winkel: 50, dicke: 0.04 },
    glieder: {
      vorn: { ellbogen: [0.1, 0.09], unterarmBauch: [0.085, 0.08], handwurzel: [0.06, 0.06], mittelhand: [0.05, 0.05], fessel: [0.045, 0.045] },
      hinten: { knie: [0.12, 0.09], wade: [0.09, 0.07], ferse: [0.06, 0.05], mittelfuss: [0.05, 0.05], fessel: [0.045, 0.045] },
    },
  },
  pferd: {
    name: "Pferd (Equidae) – Spitzengänger (Einhufer)", gang: "spitze",
    rumpfL: 1.0, brustTiefe: 0.48, kruppe: 1.0, aufzug: 0.05, widerristUeber: 0.07, kruppeUeber: 0.2, bugVor: 0.05,
    vorn: { schulterblatt: [0.26, 36], oberarm: [0.2, -30], unterarm: [0.27, 0], mittelhand: [0.15, 0], zehe: [0.13, 38] },
    hinten: { oberschenkel: [0.27, 26], unterschenkel: [0.27, -36], mittelfuss: [0.22, -3], zehe: [0.13, 38] },
    becken: [0.18, 0.1, 25],
    hals: { laenge: 0.6, winkel: 40, dickeA: 0.36, dickeE: 0.16 },
    kopf: { laenge: 0.4, winkel: 55 },
    /* FASSUNG 881: Schweif hängt im Stand (vorher 30° = waagerecht abstehend) */
    schwanz: { laenge: 0.62, winkel: 76, dicke: 0.05 },
    glieder: {
      vorn: { ellbogen: [0.07, 0.065], unterarmBauch: [0.06, 0.055], handwurzel: [0.033, 0.036], mittelhand: [0.025, 0.026], fessel: [0.032, 0.03] },
      hinten: { knie: [0.1, 0.07], wade: [0.075, 0.05], ferse: [0.04, 0.03], mittelfuss: [0.026, 0.027], fessel: [0.032, 0.03] },
    },
  },
  rind: {
    name: "Rind/Ziege/Schaf (Bovidae) – Spitzengänger (Paarhufer, Klauen)", gang: "spitze",
    rumpfL: 1.18, brustTiefe: 0.53, kruppe: 1.03, aufzug: 0.02, widerristUeber: 0.06, kruppeUeber: 0.16, bugVor: 0.05,
    vorn: { schulterblatt: [0.29, 30], oberarm: [0.22, -28], unterarm: [0.26, 0], mittelhand: [0.15, 0], zehe: [0.11, 42] },
    hinten: { oberschenkel: [0.31, 22], unterschenkel: [0.3, -30], mittelfuss: [0.23, -4], zehe: [0.11, 42] },
    becken: [0.2, 0.12, 14],
    hals: { laenge: 0.4, winkel: 12, dickeA: 0.42, dickeE: 0.24 },
    kopf: { laenge: 0.36, winkel: 60 },
    /* FASSUNG 881: Schwanz hängt (vorher 4° = waagerecht nach hinten) */
    schwanz: { laenge: 0.62, winkel: 86, dicke: 0.03 },
    glieder: {
      vorn: { ellbogen: [0.08, 0.07], unterarmBauch: [0.06, 0.06], handwurzel: [0.04, 0.04], mittelhand: [0.03, 0.03], fessel: [0.038, 0.035] },
      hinten: { knie: [0.1, 0.08], wade: [0.07, 0.05], ferse: [0.04, 0.035], mittelfuss: [0.03, 0.03], fessel: [0.038, 0.035] },
    },
  },
  hirsch: {
    name: "Hirsch/Antilope (Cervidae, Bovidae schlank) – Spitzengänger, hochbeinig", gang: "spitze",
    rumpfL: 1.08, brustTiefe: 0.45, kruppe: 0.98, aufzug: 0.08, widerristUeber: 0.06, kruppeUeber: 0.18, bugVor: 0.045,
    vorn: { schulterblatt: [0.26, 30], oberarm: [0.21, -30], unterarm: [0.28, 0], mittelhand: [0.2, 0], zehe: [0.08, 42] },
    hinten: { oberschenkel: [0.27, 24], unterschenkel: [0.29, -38], mittelfuss: [0.27, -3], zehe: [0.08, 42] },
    becken: [0.17, 0.1, 22],
    hals: { laenge: 0.5, winkel: 48, dickeA: 0.3, dickeE: 0.16 },
    kopf: { laenge: 0.36, winkel: 50 },
    schwanz: { laenge: 0.13, winkel: 60, dicke: 0.03 },
    glieder: {
      vorn: { ellbogen: [0.06, 0.055], unterarmBauch: [0.045, 0.045], handwurzel: [0.028, 0.03], mittelhand: [0.02, 0.021], fessel: [0.026, 0.024] },
      hinten: { knie: [0.09, 0.06], wade: [0.065, 0.042], ferse: [0.032, 0.026], mittelfuss: [0.021, 0.022], fessel: [0.026, 0.024] },
    },
  },
  elefant: {
    name: "Elefant (Elephantidae) – Säulenbein, Zehenspitzengänger mit Sohlenkissen", gang: "saeule",
    rumpfL: 1.12, brustTiefe: 0.48, kruppe: 0.92, aufzug: 0.0, widerristUeber: 0.07, kruppeUeber: 0.2, bugVor: 0.06,
    vorn: { schulterblatt: [0.27, 18], oberarm: [0.29, -12], unterarm: [0.28, 0], mittelhand: [0.085, 8], zehe: [0.055, 70] },
    hinten: { oberschenkel: [0.33, 6], unterschenkel: [0.26, -8], mittelfuss: [0.1, 18], zehe: [0.05, 70] },
    becken: [0.18, 0.1, 20],
    hals: { laenge: 0.18, winkel: 10, dickeA: 0.5, dickeE: 0.44 },
    /* FASSUNG 881: Kopfachse Hinterhaupt → Rüsselspitze (die Kopfvorlage „elefant“ enthält den Rüssel), Schwanz hängt */
    kopf: { laenge: 0.8, winkel: 72 },
    schwanz: { laenge: 0.4, winkel: 80, dicke: 0.03 },
    glieder: {
      vorn: { ellbogen: [0.11, 0.1], unterarmBauch: [0.1, 0.095], handwurzel: [0.09, 0.09], mittelhand: [0.095, 0.095], fessel: [0.1, 0.1] },
      hinten: { knie: [0.12, 0.1], wade: [0.1, 0.09], ferse: [0.09, 0.085], mittelfuss: [0.095, 0.095], fessel: [0.1, 0.1] },
    },
  },
  primat: {
    name: "Menschenaffe (Hominidae) – Knöchelgang, Arme länger als Beine", gang: "sohle",
    rumpfL: 0.95, brustTiefe: 0.5, kruppe: 0.78, aufzug: 0.02, widerristUeber: 0.08, kruppeUeber: 0.16, bugVor: 0.05,
    vorn: { schulterblatt: [0.17, 10], oberarm: [0.36, -6], unterarm: [0.32, 4], mittelhand: [0.09, 40], zehe: [0.05, 80] },
    hinten: { oberschenkel: [0.36, 30], unterschenkel: [0.32, -12], mittelfuss: [0.14, 82], zehe: [0.06, 88] },
    becken: [0.17, 0.08, 40],
    hals: { laenge: 0.14, winkel: 30, dickeA: 0.36, dickeE: 0.3 },
    kopf: { laenge: 0.32, winkel: 30 },
    schwanz: { laenge: 0, winkel: 0, dicke: 0 },
    glieder: {
      /* FASSUNG 881: Unterarm am Ellbogen kräftig, zum Handgelenk schlank, Knöchel (Knöchelgang) wieder breiter –
         vorher überall gleich breit („Säule als Arm“, Prüfer 880, Punkt 5) */
      vorn: { ellbogen: [0.085, 0.075], unterarmBauch: [0.07, 0.062], handwurzel: [0.042, 0.04], mittelhand: [0.05, 0.048], fessel: [0.046, 0.046] },
      hinten: { knie: [0.09, 0.08], wade: [0.07, 0.06], ferse: [0.05, 0.05], mittelfuss: [0.045, 0.045], fessel: [0.04, 0.04] },
    },
  },
  echse: {
    name: "Echse (Squamata, Spreizgang) – Oberarm/-schenkel seitlich, in der Seitenansicht kurz", gang: "sohle",
    rumpfL: 2.4, brustTiefe: 0.55, kruppe: 1.0, aufzug: 0.0, widerristUeber: 0.15, kruppeUeber: 0.25, bugVor: 0.08,
    vorn: { schulterblatt: [0.26, 40], oberarm: [0.37, -70], unterarm: [0.47, 12], mittelhand: [0.18, 75], zehe: [0.18, 86] },
    hinten: { oberschenkel: [0.45, 60], unterschenkel: [0.53, -30], mittelfuss: [0.24, 78], zehe: [0.26, 86] },
    becken: [0.2, 0.12, 6],
    hals: { laenge: 0.5, winkel: 6, dickeA: 0.5, dickeE: 0.4 },
    kopf: { laenge: 0.9, winkel: 4 },
    /* FASSUNG 881: Schwanz liegt flach nach hinten (vorher 84° = senkrecht in den Boden) */
    schwanz: { laenge: 3.2, winkel: 6, dicke: 0.2 },
    glieder: {
      vorn: { ellbogen: [0.09, 0.08], unterarmBauch: [0.07, 0.07], handwurzel: [0.05, 0.05], mittelhand: [0.045, 0.045], fessel: [0.04, 0.04] },
      hinten: { knie: [0.1, 0.09], wade: [0.08, 0.07], ferse: [0.06, 0.05], mittelfuss: [0.05, 0.05], fessel: [0.04, 0.04] },
    },
  },
  robbe: {
    name: "Robbe (Pinnipedia) – Gliedmaßen als Flossen, W = Rückenhöhe liegend", gang: "flosse",
    /* FASSUNG 881: Hinterflossen zeigen nach HINTEN (vorher +80…92° = nach vorn unter den Bauch), Rumpf zum Becken flach
       (Spindel), Kruppe niedrig */
    rumpfL: 2.6, brustTiefe: 0.9, kruppe: 0.4, aufzug: 0, widerristUeber: 0.1, kruppeUeber: 0.26, bugVor: 0.1,
    vorn: { schulterblatt: [0.25, 50], oberarm: [0.2, -50], unterarm: [0.22, 30], mittelhand: [0.18, 60], zehe: [0.2, 80] },
    hinten: { oberschenkel: [0.2, -84], unterschenkel: [0.3, -88], mittelfuss: [0.22, -90], zehe: [0.2, -92] },
    becken: [0.15, 0.1, 0],
    hals: { laenge: 0.35, winkel: 30, dickeA: 0.7, dickeE: 0.45 },
    kopf: { laenge: 0.5, winkel: 10 },
    schwanz: { laenge: 0.1, winkel: 80, dicke: 0.05 },
    glieder: {
      vorn: { ellbogen: [0.1, 0.1], unterarmBauch: [0.09, 0.09], handwurzel: [0.08, 0.08], mittelhand: [0.07, 0.07], fessel: [0.06, 0.06] },
      hinten: { knie: [0.1, 0.1], wade: [0.09, 0.09], ferse: [0.08, 0.08], mittelfuss: [0.08, 0.08], fessel: [0.07, 0.07] },
    },
  },
  /* ZWEIBEINER: W = Hüfthöhe (Hüftgelenk + Kruppe), Rumpf waagerecht. Theropode nach T. rex „Sue“, Vogel nach Haushuhn. */
  theropode: {
    name: "Theropode (Tyrannosaurus u. a.) – Zweibeiner, Zehengänger, Rumpf waagerecht", gang: "zwei",
    rumpfL: 1.05, brustTiefe: 0.42, kruppe: 1.0, aufzug: 0, widerristUeber: 0.06, kruppeUeber: 0.12, bugVor: 0,
    hinten: { oberschenkel: [0.39, 22], unterschenkel: [0.33, -28], mittelfuss: [0.19, 18], zehe: [0.14, 75] },
    vorn: { schulterblatt: [0.2, 60], oberarm: [0.1, -30], unterarm: [0.07, 30], mittelhand: [0.04, 40], zehe: [0.04, 60] },
    becken: [0.18, 0.14, 8],
    hals: { laenge: 0.3, winkel: 30, dickeA: 0.36, dickeE: 0.3 },
    kopf: { laenge: 0.38, winkel: 0 },
    /* FASSUNG 881: Schwanz waagerecht in der Luft (vorher 84° = senkrecht in den Boden) */
    schwanz: { laenge: 1.6, winkel: 10, dicke: 0.17 },
    glieder: {
      vorn: { ellbogen: [0.03, 0.03], unterarmBauch: [0.025, 0.025], handwurzel: [0.02, 0.02], mittelhand: [0.016, 0.016], fessel: [0.014, 0.014] },
      hinten: { knie: [0.12, 0.08], wade: [0.08, 0.05], ferse: [0.045, 0.04], mittelfuss: [0.04, 0.04], fessel: [0.045, 0.04] },
    },
  },
  vogel: {
    name: "Vogel (Aves, Haushuhn als Richtwert) – Oberschenkel im Rumpf, Ferse hinten, Lauf geschuppt", gang: "zwei",
    rumpfL: 0.95, brustTiefe: 0.55, kruppe: 1.0, aufzug: 0, widerristUeber: 0.05, kruppeUeber: 0.3, bugVor: 0,
    hinten: { oberschenkel: [0.23, 50], unterschenkel: [0.34, -32], mittelfuss: [0.24, 6], zehe: [0.15, 80] },
    vorn: { schulterblatt: [0.2, 70], oberarm: [0.2, -80], unterarm: [0.24, 80], mittelhand: [0.14, -80], zehe: [0.1, -80] },
    becken: [0.16, 0.14, 20],
    hals: { laenge: 0.35, winkel: 60, dickeA: 0.3, dickeE: 0.16 },
    kopf: { laenge: 0.22, winkel: 0 },
    /* FASSUNG 881: Schwanz nach hinten oben (−35° = über der Waagerechten; vorher 120° = nach vorn) */
    schwanz: { laenge: 0.4, winkel: -35, dicke: 0.1 },
    glieder: {
      vorn: { ellbogen: [0.03, 0.03], unterarmBauch: [0.03, 0.03], handwurzel: [0.02, 0.02], mittelhand: [0.02, 0.02], fessel: [0.02, 0.02] },
      hinten: { knie: [0.09, 0.07], wade: [0.07, 0.05], ferse: [0.028, 0.026], mittelfuss: [0.022, 0.024], fessel: [0.028, 0.026] },
    },
  },
};
/* Spitznamen (Art-id → Bauplan). FASSUNG 881 — EINE Tabelle für T.skelett, T.kopf, T.fuss und die Sonde (vorher hatte
   kopf880.js eine eigene: T.kopf("tiger") ging, T.skelett("tiger") warf „Bauplan unbekannt“ – Prüfer 880, Punkt 6).
   Die ids sind die der Bibliothek; ein Eintrag sagt nur, welchem Bauplan die Art folgt, nicht dass sie schon damit gebaut ist. */
const ALIAS = {
  /* hund */ wolf: "hund", fuchs: "hund", polarfuchs: "hund", hyaene: "hund", schaeferhund: "hund",
  /* katze */ loewe: "katze", loewin: "katze", tiger: "katze", leopard: "katze", jaguar: "katze", gepard: "katze", luchs: "katze",
  saebelzahnkatze: "katze",
  /* baer */ braunbaer: "baer", eisbaer: "baer", hoehlenbaer: "baer", panda: "baer",
  /* pferd */ esel: "pferd", zebra: "pferd",
  /* rind */ kuh: "rind", kalb: "rind", ziege: "rind", schaf: "rind", gnu: "rind", wisent: "rind", moschusochse: "rind",
  /* hirsch */ reh: "hirsch", elch: "hirsch", rentier: "hirsch", riesenhirsch: "hirsch", antilope: "hirsch", gazelle: "hirsch",
  /* elefant */ mammut: "elefant",
  /* primat */ gorilla: "primat", schimpanse: "primat", orang_utan: "primat",
  /* echse */ eidechse: "echse", leguan: "echse", komodowaran: "echse", krokodil: "echse", alligator: "echse",
  /* robbe */ seehund: "robbe", walross: "robbe", robbe_baby: "robbe",
  /* theropode */ raubsaurier: "theropode", tyrannosaurus: "theropode", allosaurus: "theropode", velociraptor: "theropode",
  spinosaurus: "theropode",
  /* vogel */ huhn: "vogel", hahn: "vogel", henne: "vogel", truthahn: "vogel",
};
const bauplanName = (b) => (typeof b === "string" ? (ALIAS[b] || b) : null);

/* ---------------------------------------------------------------------
   SOLL-SPANNEN (FASSUNG 881) — unabhängig vom Bauplan und von den Art-Parametern, damit die Sonde nicht mehr sich selbst
   prüft (Prüfer 880, Punkt 1: ein absichtlich kaputter Wolf mit Dackelbrust, Riesenrumpf und Mini-Kopf bestand alle
   Anatomie-Zeilen, weil die Silhouette gegen sk.masse = die eigenen Eingaben gemessen wurde).
   Was ein FOTO der stehenden Art in Seitenansicht zeigt (mit Fell), bezogen auf die SICHTBARE Widerristhöhe:
     bauchfreiheit: Boden → Brustunterkante hinter dem Ellbogen; rumpfL: Bugspitze → Gesäß (waagerecht);
     kopfL: Hinterhaupt → Nasenspitze; kruppe: Kruppenhöhe / Widerristhöhe; sprungWinkel: Innenwinkel am
     Sprunggelenk (Grad); fersenH: Höhe des Fersenhöckers. Fehlt eine Größe, wird sie nicht bewertet.
   Je Art eine eigene Zeile, sonst die des Bauplans (über ALIAS). Eine Art darf in ihrer Datei art.soll setzen
   (überschreibt einzelne Spannen). Quellen stehen je Zeile; „Richtwert“ = vor dem Neubau der Art selbst recherchieren.
   --------------------------------------------------------------------- */
const SOLL = {
  hund: { quelle: "FCI-Standard 166 DSH: Brusttiefe 45–48 %, Rumpflänge 110–117 %, Kopf ≈ 40 % der Widerristhöhe",
    bauchfreiheit: [0.5, 0.57], rumpfL: [1.04, 1.2], kopfL: [0.35, 0.43], kruppe: [0.92, 1.0], sprungWinkel: [125, 150], fersenH: [0.22, 0.32] },
  wolf: { quelle: "RECHERCHE Wolf (hunde_baeren.js): Brust ≈ 44 % W, Kopf 0,35–0,4 W, Sprunggelenk ≈ 27 % W, 135–140°; " +
      "Rumpf fast quadratisch (Kopf-Rumpf 100–140 cm bei 70–85 cm Schulterhöhe)",
    bauchfreiheit: [0.52, 0.58], rumpfL: [1.0, 1.15], kopfL: [0.35, 0.4], kruppe: [0.93, 1.0], sprungWinkel: [130, 145], fersenH: [0.24, 0.31] },
  hyaene: { quelle: "Richtwert (Tüpfelhyäne: Rücken fällt nach hinten ab, Kopf groß)",
    bauchfreiheit: [0.45, 0.56], rumpfL: [1.1, 1.35], kopfL: [0.3, 0.42], kruppe: [0.78, 0.92] },
  katze: { quelle: "Long Bone Ratios in Felis catus; Richtwert Löwe (Schulterhöhe 1,2 m, Schädel ≈ 0,35 m)",
    bauchfreiheit: [0.45, 0.55], rumpfL: [1.2, 1.45], kopfL: [0.27, 0.4], kruppe: [0.92, 1.03], sprungWinkel: [110, 140], fersenH: [0.2, 0.32] },
  baer: { quelle: "Ginsburg 1961; Kritik Braunbär R3: Bauchfreiheit 45–50 % der Schulterhöhe, Schulterbuckel über der Kruppe",
    bauchfreiheit: [0.42, 0.52], rumpfL: [1.15, 1.42], kopfL: [0.32, 0.42], kruppe: [0.84, 0.97] },
  pferd: { quelle: "Normal Proportions of the Horse (PMC10367726): Kopf ≈ 0,4 W, Rumpflänge = Widerrist, Kruppe = Widerrist, " +
      "Sprunggelenk–Boden = 1 Kopflänge; Rumpftiefe ≈ Beinlänge (UGA B1400)",
    bauchfreiheit: [0.5, 0.57], rumpfL: [0.95, 1.08], kopfL: [0.36, 0.44], kruppe: [0.97, 1.04], sprungWinkel: [140, 165], fersenH: [0.33, 0.44] },
  rind: { quelle: "Holstein (animalsciencejournal.usamv.ro 2018/1 Art. 8): Brusttiefe ≈ 0,53 W, schräge Rumpflänge ≈ 1,18 W, Kreuzbein 1,03 W",
    bauchfreiheit: [0.44, 0.51], rumpfL: [1.1, 1.26], kopfL: [0.3, 0.4], kruppe: [0.99, 1.07], sprungWinkel: [135, 160], fersenH: [0.3, 0.42] },
  hirsch: { quelle: "Rothirsch (Wikipedia „Red deer“): Schulterhöhe 95–130 cm, Kopf-Rumpf 175–250 cm; Richtwert hochbeinig",
    bauchfreiheit: [0.52, 0.6], rumpfL: [1.0, 1.18], kopfL: [0.3, 0.4], kruppe: [0.95, 1.03], sprungWinkel: [130, 155], fersenH: [0.3, 0.42] },
  elefant: { quelle: "Richtwert (Afrikanischer Elefant: Rumpf tief, Rücken nach hinten abfallend)",
    bauchfreiheit: [0.46, 0.56], rumpfL: [1.0, 1.25], kruppe: [0.84, 0.98] },
};
/* Soll für eine Art: eigene Zeile → Zeile des Bauplans (über ALIAS) → null; art.soll überschreibt einzelne Spannen */
function sollFuer(id, bauplan, eigen) {
  const basis = SOLL[id] || SOLL[bauplanName(bauplan) || ""] || SOLL[ALIAS[id] || ""] || null;
  if (!basis && !eigen) return null;
  const s = Object.assign({}, basis || {}, eigen || {});
  s.von = eigen ? "art.soll" + (basis ? " + " + (SOLL[id] ? id : bauplanName(bauplan) || ALIAS[id]) : "") : (SOLL[id] ? id : bauplanName(bauplan) || ALIAS[id]);
  return s;
}
/* Art-Parameter gegen den Basis-Bauplan: Längen > 15 % anders, Winkel > 15° anders → Liste für eine Warnung der Sonde
   (große Abweichungen sind erlaubt, sollen aber bewusst und belegt sein – Prüfer 880, Punkt 1) */
function abweichungen(bp, basis, pfad = "") {
  const aus = [];
  for (const k of Object.keys(basis || {})) {
    if (k === "name" || k === "gang" || k === "glieder" || !(k in bp)) continue;
    const a = bp[k], b = basis[k], p = pfad ? pfad + "." + k : k;
    if (Array.isArray(b) && Array.isArray(a)) {
      if (b.length === 2 && typeof b[0] === "number") {
        if (b[0] && Math.abs(a[0] - b[0]) / Math.abs(b[0]) > 0.15) aus.push({ pfad: p + "[Länge]", wert: a[0], basis: b[0], rel: (a[0] - b[0]) / b[0] });
        if (Math.abs(a[1] - b[1]) > 15) aus.push({ pfad: p + "[Winkel]", wert: a[1], basis: b[1], grad: a[1] - b[1] });
      } else if (k === "becken") {
        for (let i = 0; i < 2; i++) if (b[i] && Math.abs(a[i] - b[i]) / b[i] > 0.15) aus.push({ pfad: p + "[" + i + "]", wert: a[i], basis: b[i], rel: (a[i] - b[i]) / b[i] });
        if (Math.abs(a[2] - b[2]) > 15) aus.push({ pfad: p + "[Neigung]", wert: a[2], basis: b[2], grad: a[2] - b[2] });
      }
    } else if (b && typeof b === "object") aus.push(...abweichungen(a || {}, b, p));
    else if (typeof b === "number" && typeof a === "number") {
      if (/winkel/i.test(k)) { if (Math.abs(a - b) > 15) aus.push({ pfad: p, wert: a, basis: b, grad: a - b }); }
      else if (b === 0 ? Math.abs(a) > 0.05 : Math.abs(a - b) / Math.abs(b) > 0.15) aus.push({ pfad: p, wert: a, basis: b, rel: b ? (a - b) / b : null });
    }
  }
  return aus;
}

const tief = (o) => JSON.parse(JSON.stringify(o));
/* Teil-Überschreiben (Arten-Parameter über den Bauplan) */
function mische(ziel, quelle) {
  for (const k of Object.keys(quelle || {})) {
    const v = quelle[k];
    if (v && typeof v === "object" && !Array.isArray(v) && ziel[k] && typeof ziel[k] === "object" && !Array.isArray(ziel[k])) mische(ziel[k], v);
    else ziel[k] = Array.isArray(v) ? v.slice() : v;
  }
  return ziel;
}
const dir = (a) => [Math.sin(a * RAD), Math.cos(a * RAD)];        // Knochenrichtung (y nach unten positiv)
const minus = (p, L, a) => { const d = dir(a); return [p[0] - L * d[0], p[1] - L * d[1]]; };
const plus = (p, L, a) => { const d = dir(a); return [p[0] + L * d[0], p[1] + L * d[1]]; };
const winkelZw = (a, b, c) => { /* Innenwinkel bei b (Grad) */
  const u = [a[0] - b[0], a[1] - b[1]], v = [c[0] - b[0], c[1] - b[1]];
  const k = (u[0] * v[0] + u[1] * v[1]) / (Math.hypot(...u) * Math.hypot(...v) || 1);
  return Math.acos(Math.max(-1, Math.min(1, k))) / RAD;
};
/* Zwei-Knochen-IK: Gelenkpunkt zwischen a (oben, fest) und c (unten, Ziel), Längen L1, L2;
   seite = +1 → Gelenk nach vorn (Knie), −1 → nach hinten (Ellbogen) */
function ik(a, c, L1, L2, seite) {
  const dx = c[0] - a[0], dy = c[1] - a[1], d = Math.min(L1 + L2 - 1e-6, Math.max(Math.abs(L1 - L2) + 1e-6, Math.hypot(dx, dy)));
  const ux = dx / (Math.hypot(dx, dy) || 1), uy = dy / (Math.hypot(dx, dy) || 1);
  const x = (L1 * L1 - L2 * L2 + d * d) / (2 * d), h = Math.sqrt(Math.max(0, L1 * L1 - x * x));
  /* Normale: (−uy, ux) zeigt bei Beinen nach unten-gerichteter Achse (0,1) nach (−1, 0) = hinten */
  const nx = -uy, ny = ux;
  return [a[0] + ux * x - nx * h * seite, a[1] + uy * x - ny * h * seite];
}

/* Bein vom Boden aufwärts in Einheiten von W (Ruhewinkel). Liefert die Punkte relativ zum Bodenpunkt (0, 0). */
function beinRoh(seg, namen) {
  /* seg: [[L, a], …] von oben nach unten; namen: Gelenke von oben nach unten (eins mehr als seg) */
  const pts = new Array(namen.length);
  pts[namen.length - 1] = [0, 0];
  for (let i = seg.length - 1; i >= 0; i--) pts[i] = minus(pts[i + 1], seg[i][0], seg[i][1]);
  const o = {};
  namen.forEach((n, i) => { o[n] = pts[i]; });
  return o;
}

/* ---------------------------------------------------------------------
   T.skelett(bauplan, art, pose)
   bauplan: Name (z. B. "hund") oder Objekt; art: { W (cm, Pflicht), …Überschreibungen wie im Bauplan }
   pose: { art: "stehen" | "schritt", weite (Schrittweite in W, Standard 0,16), fernVorn, fernHinten (Versatz der
           fernen Füße in W; Standard −0,1 / +0,1), x0 (cm, Lage des Sitzbeinhöckers), hals, kopf, schwanz (Winkel) }
   Ausgabe (cm): { W, bp, beine: { vn, vf, hn, hf }, lm (Landmarken), ruecken, hals, kopf, schwanz, masse, fuesse }
     beine.xx = { kette: [[x, y], …] (oben → unten), namen: [...], p: { name: [x, y] }, extra: { fersenhoecker,
                  ellbogenhoecker, karpalballen, kniescheibe } }
   --------------------------------------------------------------------- */
function skelett(bauplan, art = {}, pose = {}) {
  const name = bauplanName(bauplan);
  const basis = name ? BAUPLAENE[name] : bauplan;
  if (!basis) throw new Error("Bauplan unbekannt: " + bauplan + " (bekannt: " + Object.keys(BAUPLAENE).join(", ") + "; Spitznamen siehe ALIAS)");
  const bp = mische(tief(basis), art);
  const W = art.W || 100;
  const zwei = bp.gang === "zwei";
  const nV = ["schulterblatt", "schulter", "ellbogen", "handwurzel", "fessel", "spitze"];
  const nH = ["huefte", "knie", "sprung", "fessel", "spitze"];
  const segV = ["schulterblatt", "oberarm", "unterarm", "mittelhand", "zehe"].map((k) => bp.vorn[k]);
  const segH = ["oberschenkel", "unterschenkel", "mittelfuss", "zehe"].map((k) => bp.hinten[k]);
  /* 1. Ruhebeine in W, Bodenpunkt (0, 0) */
  const vR = beinRoh(segV, nV), hR = beinRoh(segH, nH);
  /* 2. gleichmäßig skalieren, damit Widerrist (Schulterblatt-Oberrand + widerristUeber) = 1 und Hüfte = kruppe − kruppeUeber */
  const kV = zwei ? 1 : (1 - bp.widerristUeber) / -vR.schulterblatt[1];
  /* Flossen (Robbe) stehen nicht: Hinterbein wie Vorderbein skaliert */
  const kH = bp.gang === "flosse" ? kV : (bp.kruppe - bp.kruppeUeber) / -hR.huefte[1];
  const sk = (o, k) => { const n = {}; for (const key of Object.keys(o)) n[key] = [o[key][0] * k, o[key][1] * k]; return n; };
  const V = sk(vR, kV), H = sk(hR, kH);
  const lenV = segV.map((s) => s[0] * kV), lenH = segH.map((s) => s[0] * kH);
  /* 3. Becken und Rumpflage: Sitzbeinhöcker bei x = 0 (in W) */
  const [il, is, bn] = bp.becken;
  const bx = Math.cos(bn * RAD), by = Math.sin(bn * RAD);        // Beckenachse: nach vorn oben
  const hueftHoecker = (h) => [h[0] + il * bx, h[1] - il * by];
  const sitzbein = (h) => [h[0] - is * bx, h[1] + is * by];
  const dxH = -sitzbein(H.huefte)[0];                            // Hinterbein so, dass Sitzbein bei 0
  for (const k of Object.keys(H)) H[k] = [H[k][0] + dxH, H[k][1]];
  let dxV;
  if (zwei) dxV = H.huefte[0] + bp.rumpfL - V.schulter[0];        // Zweibeiner: Schulter rumpfL vor der Hüfte
  else dxV = (bp.rumpfL - bp.bugVor) - V.schulter[0];             // Buggelenk-Mitte = Bugspitze − bugVor
  for (const k of Object.keys(V)) V[k] = [V[k][0] + dxV, V[k][1]];
  if (zwei) {
    /* Arm hängt am Rumpf: Schulter auf Brusthöhe, Hand frei (kein Bodenkontakt) */
    const sh = [H.huefte[0] + bp.rumpfL, -(bp.kruppe - bp.kruppeUeber) + 0.02];
    const d = [sh[0] - V.schulter[0], sh[1] - V.schulter[1]];
    for (const k of Object.keys(V)) V[k] = [V[k][0] + d[0], V[k][1] + d[1]];
  }
  /* 4. Pose: Bodenpunkte versetzen, proximale Zwei-Knochen-Kette per IK, distale Winkel bleiben */
  const art0 = pose.art || "stehen";
  const weite = pose.weite != null ? pose.weite : (art0 === "schritt" ? 0.16 : 0);
  const fernV = pose.fernVorn != null ? pose.fernVorn : (art0 === "schritt" ? -weite : -0.1);
  const fernH = pose.fernHinten != null ? pose.fernHinten : (art0 === "schritt" ? weite : 0.1);
  const nahV = art0 === "schritt" ? weite : (pose.nahVorn || 0), nahH = art0 === "schritt" ? -weite : (pose.nahHinten || 0);
  const vorderbein = (dx) => {
    const p = {};
    p.spitze = [V.spitze[0] + dx, 0];
    p.fessel = minus(p.spitze, lenV[4], segV[4][1]);
    p.handwurzel = minus(p.fessel, lenV[3], segV[3][1]);
    p.schulter = V.schulter.slice(); p.schulterblatt = V.schulterblatt.slice();
    p.ellbogen = zwei ? V.ellbogen.slice() : ik(p.schulter, p.handwurzel, lenV[1], lenV[2], -1);
    if (zwei) { p.handwurzel = V.handwurzel.slice(); p.fessel = V.fessel.slice(); p.spitze = V.spitze.slice(); }
    return p;
  };
  const hinterbein = (dx) => {
    const p = {};
    p.spitze = [H.spitze[0] + dx, 0];
    p.fessel = minus(p.spitze, lenH[3], segH[3][1]);
    p.sprung = minus(p.fessel, lenH[2], segH[2][1]);
    p.huefte = H.huefte.slice();
    p.knie = ik(p.huefte, p.sprung, lenH[0], lenH[1], 1);
    return p;
  };
  const k = W;                                                   // W → cm
  const x0 = (pose.x0 || 0);
  const cm = (p) => [r2(x0 + p[0] * k), r2(p[1] * k)];
  const g = bp.glieder || {};
  const beinAus = (p, namen, vorn) => {
    const pc = {};
    for (const n of namen) pc[n] = cm(p[n]);
    const e = {};
    if (vorn) {
      /* Ellbogenhöcker (Olekranon): hinter und über dem Ellbogengelenk; Karpalballen hinten an der Handwurzel */
      e.ellbogenhoecker = cm([p.ellbogen[0] - 0.05, p.ellbogen[1] - 0.035]);
      e.karpalballen = cm([p.handwurzel[0] - 0.035, p.handwurzel[1] + 0.012]);
      e.bugspitze = cm([p.schulter[0] + bp.bugVor, p.schulter[1] - 0.01]);
    } else {
      /* Fersenhöcker (Tuber calcanei): hinter und über dem Sprunggelenk; Kniescheibe vorn am Knie */
      e.fersenhoecker = cm([p.sprung[0] - 0.045, p.sprung[1] - 0.03]);
      e.kniescheibe = cm([p.knie[0] + 0.035, p.knie[1] - 0.015]);
    }
    return { kette: namen.map((n) => pc[n]), namen: namen.slice(), p: pc, extra: e, breiten: vorn ? g.vorn : g.hinten };
  };
  const vn = beinAus(vorderbein(nahV), nV, true), vf = beinAus(vorderbein(fernV), nV, true);
  const hn = beinAus(hinterbein(nahH), nH, false), hf = beinAus(hinterbein(fernH), nH, false);
  /* 5. Landmarken (in W, dann cm) */
  const hu = H.huefte, sb = V.schulterblatt;
  const lmW = {
    widerrist: zwei ? [V.schulter[0] - 0.05, -1 - 0.0] : [sb[0] + 0.03, -1],
    kruppe: [hu[0] - 0.02, -bp.kruppe],
    hueftHoecker: hueftHoecker(hu),
    sitzbein: sitzbein(hu),
    huefte: hu,
    buggelenk: V.schulter,
    bugspitze: [V.schulter[0] + bp.bugVor, V.schulter[1] - 0.01],
    brustbein: [V.schulter[0] - 0.02, V.schulter[1] + 0.12],
    brustTief: [V.ellbogen[0] - 0.08, -(1 - bp.brustTiefe)],
    flanke: [hu[0] + (V.ellbogen[0] - hu[0]) * 0.22, -(1 - bp.brustTiefe) - bp.aufzug],
    schwanzansatz: [sitzbein(hu)[0] + 0.03, -bp.kruppe + 0.04],
  };
  if (zwei) {
    lmW.widerrist = [H.huefte[0] + bp.rumpfL - 0.05, -(bp.kruppe) + 0.02];
    lmW.brustTief = [H.huefte[0] + bp.rumpfL * 0.6, -(bp.kruppe - bp.brustTiefe)];
    lmW.flanke = [H.huefte[0] + 0.1, -(bp.kruppe - bp.brustTiefe * 0.8)];
  }
  /* Rückenlinie: Schwanzansatz → Kruppe → Lende (leicht gewölbt) → Rücken → Widerrist */
  const wr = lmW.widerrist, kr = lmW.kruppe;
  const ruecken = [lmW.schwanzansatz, [kr[0] - 0.06, kr[1] + 0.015], kr,
    [kr[0] + (wr[0] - kr[0]) * 0.22, kr[1] - 0.006], [kr[0] + (wr[0] - kr[0]) * 0.5, (kr[1] + wr[1]) / 2 + 0.012],
    [kr[0] + (wr[0] - kr[0]) * 0.78, wr[1] + 0.012], wr];
  /* Hals: Mittellinie vom Halsansatz (zwischen Widerrist und Buggelenk) zum Hinterhaupt (Atlasgelenk) */
  const hw = (pose.hals != null ? pose.hals : bp.hals.winkel) * RAD;
  const hb = [wr[0] + 0.04, wr[1] + bp.hals.dickeA * 0.5];
  const he = [hb[0] + Math.cos(hw) * bp.hals.laenge, hb[1] - Math.sin(hw) * bp.hals.laenge];
  const hm = [(hb[0] + he[0]) / 2 + 0.02, (hb[1] + he[1]) / 2 - 0.01];
  /* Kopf: Achse vom Hinterhaupt (oben hinten am Schädel) zur Nasenspitze, Winkel nach unten positiv */
  const kw = (pose.kopf != null ? pose.kopf : bp.kopf.winkel) * RAD;
  const hinterhaupt = [he[0] - 0.01, he[1] - bp.hals.dickeE * 0.5];
  const nase = [hinterhaupt[0] + Math.cos(kw) * bp.kopf.laenge, hinterhaupt[1] + Math.sin(kw) * bp.kopf.laenge];
  /* Schwanz: Kette vom Ansatz, Winkel unter der Waagerechten nach hinten (Grad), leicht gebogen */
  const sw = (pose.schwanz != null ? pose.schwanz : bp.schwanz.winkel) * RAD, sL = bp.schwanz.laenge;
  const sa = lmW.schwanzansatz, schw = [];
  const biege = pose.schwanzBiegung != null ? pose.schwanzBiegung : 0.12;
  for (let i = 0; i <= 6; i++) {
    const t = i / 6, a = sw * (0.55 + 0.45 * Math.min(1, t * 1.6)) - biege * t * t;
    const prev = schw.length ? schw[schw.length - 1] : sa;
    schw.push(i === 0 ? sa : [prev[0] - Math.cos(a) * sL / 6, prev[1] + Math.sin(a) * sL / 6]);
  }
  const lm = {};
  for (const n of Object.keys(lmW)) lm[n] = cm(lmW[n]);
  const out = {
    W, bauplan: name || "eigen", bp, gang: bp.gang, zwei,
    beine: { vn, vf, hn, hf },
    lm,
    ruecken: ruecken.map(cm),
    hals: { kette: [hb, hm, he].map(cm), dickeA: bp.hals.dickeA * k, dickeE: bp.hals.dickeE * k },
    kopf: { hinterhaupt: cm(hinterhaupt), nase: cm(nase), laenge: bp.kopf.laenge * k, winkel: kw / RAD },
    schwanz: { kette: schw.map(cm), dicke: bp.schwanz.dicke * k, laenge: sL * k },
    fuesse: [vn, vf, hn, hf].map((b) => r2((b.p.fessel[0] + b.p.spitze[0]) / 2)),
  };
  /* 6. Maße zur Prüfung (in W bzw. Grad) */
  const P = hinterbein(nahH), Q = vorderbein(nahV);
  out.masse = {
    skalierungVorn: r2(kV), skalierungHinten: r2(kH),
    widerrist: 1, kruppe: r2(bp.kruppe), kruppeZuWiderrist: r2(bp.kruppe),
    brustTiefe: r2(bp.brustTiefe), bauchfreiheit: r2(1 - bp.brustTiefe),
    rumpfL: r2(bp.rumpfL), kopfL: r2(bp.kopf.laenge), kopfZuRumpf: r2(bp.kopf.laenge / bp.rumpfL),
    ellbogenH: r2(-Q.ellbogen[1]), handwurzelH: r2(-Q.handwurzel[1]), buggelenkH: r2(-Q.schulter[1]),
    knieH: r2(-P.knie[1]), sprungH: r2(-P.sprung[1]), fersenH: r2(-P.sprung[1] + 0.03),
    sprungWinkel: Math.round(winkelZw(P.knie, P.sprung, P.fessel)),
    knieWinkel: Math.round(winkelZw(P.huefte, P.knie, P.sprung)),
    ellbogenWinkel: Math.round(winkelZw(Q.schulter, Q.ellbogen, Q.handwurzel)),
    schulterWinkel: Math.round(winkelZw(Q.schulterblatt, Q.schulter, Q.ellbogen)),
    zehenWinkelZumBoden: Math.round(90 - Math.abs(segV[4][1])),
    knieVorHueftlot: r2(P.knie[0] - P.huefte[0]),
  };
  return out;
}

/* In ein Werkzeug T einhängen (keine Zufallszahlen verbrauchen – bestehende Arten bleiben gleich) */
function installiere(T) {
  T.BAUPLAENE = BAUPLAENE;
  T.BAUPLAN_ALIAS = ALIAS;
  T.skelett = (bauplan, art, pose) => {
    T.stil = 880;                       // neue Aufrufe: T.koerper ohne Standard-Rand (siehe kern.js)
    return skelett(bauplan, art, pose);
  };
  return T;
}

module.exports = { BAUPLAENE, ALIAS, SOLL, bauplanName, sollFuer, abweichungen, skelett, installiere, ik, winkelZw };
