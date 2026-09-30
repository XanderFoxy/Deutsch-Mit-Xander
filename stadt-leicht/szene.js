/* =====================================================================
   LEICHTE STADT — SZENE (Bilder anordnen, Schatten, Licht, Wetter)
   ---------------------------------------------------------------------
   Jedes Ding ist ein fertig gemaltes Bild mit Ankerpunkt (Fußpunkt).
   Je Bild: 1. Schatten (eigene Ebene, eingefärbt), 2. Lichtpfützen am
   Boden, 3. das Ding selbst (von hinten nach vorn), 4. Lichtschein der
   Fenster und Laternen, 5. Rauch aus den Schornsteinen, 6. Dunst und
   Schneefall. Ein Bild kostet das Telefon nur ein drawImage.

   Objekt: { id, bild, x, y, dreh (Vierteldrehungen), stufe (Maßstab),
             fuss: [Breite, Tiefe] in Metern, bau: { p } | null, … }
   FASSUNG 808 — XANDER: „du hast gesagt acht Winkel und hast sie nicht
   umgesetzt die möchte ich bitte". dreh darf halbe Schritte haben
   (0, 0.5, 1 … 3.5 = 0°, 45°, 90° … 315°). Ganze Zahlen bleiben, was sie
   waren – alte Spielstände sehen gleich aus. Schräge Bilder (_f_45_ …)
   gibt es für die Spielgebäude, drehbaren Schmuck und die Fahrzeuge; sie
   werden nur geladen, wenn etwas schräg steht. Die Kamera bleibt bei
   vier Drehungen.
   FASSUNG 820 — XANDER (Walkie 309): „Zwei-Finger-Drehen mit Einrasten in
   8 Winkeln". Jetzt dreht auch die Kamera in 45°-Schritten (K.dreh 0,5 …),
   während der Geste stufenlos; jedes Ding zeigt das Bild des nächsten
   45°-Schritts von (o.dreh + K.dreh). Nach dem Loslassen rastet die Kamera
   ein (drehen.js), dann passen alle Bilder genau.
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT, K = ST.kamera, LB = ST.bilder;
  const SZ = (ST.szene = { objekte: [], jahr: "winter", zeit: "tag", schneefall: true, auswahl: null, naechsteId: 1 });
  let g, leinwand, schattenC, sg, reihe = [], reiheSchl = "";

  SZ.start = function (c) {
    leinwand = c; g = c.getContext("2d");
    schattenC = document.createElement("canvas"); sg = schattenC.getContext("2d");
  };
  SZ.neu = function (o) { o.id = SZ.naechsteId++; o.dreh = SZ.drehNorm(o.dreh); o.stufe = o.stufe || 1; SZ.objekte.push(o); SZ.geaendert(); return o; };
  SZ.weg = function (o) { const i = SZ.objekte.indexOf(o); if (i >= 0) SZ.objekte.splice(i, 1); if (SZ.auswahl === o) SZ.auswahl = null; SZ.geaendert(); };
  /* FASSUNG 832 — Einhängepunkte für nachgeladene Teile (quests.js): Maler flach auf dem Boden, Figuren zwischen den Dingen */
  SZ.bodenMaler = []; SZ.figurQuellen = [];
  SZ.stand = 0;   // FASSUNG 825 — zählt jede Änderung der Stadt (Laternen-Nummern und Wandschein neu bestimmen)
  SZ.geaendert = function () { reiheSchl = ""; SZ.stand++; };
  /* FASSUNG 808 — Drehung auf halbe Vierteldrehungen (45°) runden, 0 ≤ dreh < 4 */
  SZ.drehNorm = function (d) { d = Math.round((+d || 0) * 2) / 2; return ((d % 4) + 4) % 4; };
  /* FASSUNG 795 — XANDER: „der Übergang zwischen Tag und Nacht soll
     flüssiger sein … nicht plötzlich in einem Moment umschalten, sondern
     realistisch sanft ineinander übergehen, so wie es dämmert."
     Nach der Uhr (SZ.zeitAuto) gibt es einen Nachtgrad 0…1, der sich in der
     Dämmerung langsam ändert; Licht, Schatten und das Nachtbild werden
     dazwischen gemischt. Wer die Tageszeit selbst wählt, bekommt sie fest. */
  const misch = (a, b, t) => a + (b - a) * t;
  /* FASSUNG 825 — nach der deutschen Uhr der Stadt (ST.uhr, kern.js; ?uhr=21:00 zum Prüfen); d: Stunde als Zahl oder Date */
  SZ.nachtGrad = function (d) {
    const h = typeof d === "number" ? d : d.getHours() + d.getMinutes() / 60 + d.getSeconds() / 3600;
    const rampe = (x, a, b) => Math.max(0, Math.min(1, (x - a) / (b - a)));
    if (h >= 8 && h < 16.5) return 0;
    if (h >= 16.5 && h < 18.5) return 0.75 * rampe(h, 16.5, 18.5);
    if (h >= 18.5 && h < 20) return 0.75 + 0.25 * rampe(h, 18.5, 20);
    if (h >= 6 && h < 7) return 1 - 0.25 * rampe(h, 6, 7);
    if (h >= 7 && h < 8) return 0.75 * (1 - rampe(h, 7, 8));
    return 1;
  };
  SZ.zeitDaten = function () {
    if (!SZ.zeitAuto) return Object.assign({ name: SZ.zeit, grad: ST.ZEITEN[SZ.zeit].nacht }, ST.ZEITEN[SZ.zeit]);
    /* ?uhr=18.2 oder ?uhr=21:00 – Uhrzeit zum Prüfen (kern.js) */
    const n = SZ.nachtGrad(ST.uhr().stunde), Z = ST.ZEITEN;
    const A = n <= 0.75 ? Z.tag : Z.abend, B = n <= 0.75 ? Z.abend : Z.nacht, t = n <= 0.75 ? n / 0.75 : (n - 0.75) / 0.25;
    SZ.zeit = n < 0.3 ? "tag" : n < 0.9 ? "abend" : "nacht";
    return { name: SZ.zeit, grad: n, amb: A.amb.map((v, i) => misch(v, B.amb[i], t)), sonne: A.sonne.map((v, i) => misch(v, B.sonne[i], t)),
      nacht: misch(A.nacht, B.nacht, t), schatten: misch(A.schatten, B.schatten, t) };
  };

  /* ---------------- Jahreszeit: nach Datum, Wetter oder Vorschau ----------------
     FASSUNG 814 — XANDER: „die Bäume sollen grün bleiben, bis der Herbst wirklich anfängt (Wetter oder Datum) …
     automatische Jahreszeiten … als Betreiber alle Jahreszeiten vorschauen inkl. Schnee".
     SZ.modus: „auto" (Kalender des Geräts, ?datum=JJJJ-MM-TT zum Prüfen, Schnee auch, wenn das Wetter ihn meldet),
     „fest" (?jahr=… wie bisher: alles in dieser Jahreszeit) oder eine Vorschau des Betreibers (MODI).
     SZ.jahr bleibt die grobe Jahreszeit (Boden, Winterschmuck, Leute); SZ.stichtag ([Monat, Tag]) sagt jedem
     Laub- und Obstbaum, ob er schon gefärbt (1.–25. Oktober, jeder an seinem Tag) oder kahl (November) ist. */
  SZ.MODI = {
    fruehling: { name: "Frühling", jahr: "fruehling", tag: [4, 22] },
    sommer: { name: "Sommer", jahr: "sommer", tag: [7, 15] },
    fruehherbst: { name: "Frühherbst", jahr: "herbst", tag: [10, 12] },
    spaetherbst: { name: "Spätherbst", jahr: "herbst", tag: [11, 13] },
    winter: { name: "Winter", jahr: "winter", schnee: false },
    schneefall: { name: "Schneefall", jahr: "winter", schnee: true }
  };
  SZ.modus = "auto"; SZ.datum = null; SZ.wetter = null; SZ.stichtag = null;
  /* Winter ab dem 27.11. bis Ende Februar, Frühling März–Mai, Sommer Juni–September, Herbst Oktober–26.11. */
  SZ.jahrNachDatum = function (d) {
    const m = d.getMonth() + 1, t = d.getDate();
    if ((m === 11 && t >= 27) || m === 12 || m === 1 || m === 2) return "winter";
    if (m >= 3 && m <= 5) return "fruehling";
    if (m >= 6 && m <= 9) return "sommer";
    return "herbst";
  };
  /* Hat das Wetter in den letzten anderthalb Tagen Schnee gemeldet? Dann bleibt er liegen. */
  SZ.schneeGemerkt = function () { try { return +(localStorage.getItem("leicht_schnee_bis") || 0) > Date.now(); } catch (e) { return false; } };
  SZ.wetterSetzen = function (art) {
    SZ.wetter = art ? String(art) : null;
    if (SZ.wetter === "schnee") try { localStorage.setItem("leicht_schnee_bis", String(Date.now() + 36 * 3600e3)); } catch (e) {}
    return SZ.jahrStellen();
  };
  /* Stellt SZ.jahr, SZ.schneefall und den Stichtag; gibt true zurück, wenn sich etwas davon geändert hat */
  SZ.jahrStellen = function () {
    const alt = SZ.jahr + "|" + SZ.schneefall + "|" + SZ.stichtag;
    const M = SZ.MODI[SZ.modus];
    if (SZ.modus === "fest") { SZ.stichtag = null; SZ.schneefall = SZ.jahr === "winter"; }
    else if (M) { SZ.jahr = M.jahr; SZ.stichtag = M.tag || null; SZ.schneefall = !!M.schnee; }
    else {
      const d = SZ.datum || new Date();
      let j = SZ.jahrNachDatum(d);
      if (SZ.wetter === "schnee" || SZ.schneeGemerkt()) j = "winter";
      SZ.jahr = j; SZ.stichtag = [d.getMonth() + 1, d.getDate()];
      /* Schneeflocken: wenn das Wetter Schnee meldet; ohne Wetterbericht (eigene Seite) wie bisher im ganzen Winter */
      SZ.schneefall = SZ.wetter ? SZ.wetter === "schnee" : j === "winter";
    }
    if (ST.bilder && ST.bilder.jahrNachladen) ST.bilder.jahrNachladen(SZ.jahr);   // FASSUNG 812 — kleines Verzeichnis der Jahreszeit
    /* Die Wiese färbt sich mit den Bäumen (Oktober: nach und nach) */
    if (ST.boden) ST.boden.herbstGrad = SZ.stichtag && SZ.stichtag[0] === 10 ? Math.min(1, SZ.stichtag[1] / 25) : 1;
    return alt !== SZ.jahr + "|" + SZ.schneefall + "|" + SZ.stichtag;
  };
  /* Laub- und Obstbäume: jeder färbt sich an seinem eigenen Tag (1.–25. Oktober) und verliert sein Laub an seinem
     eigenen Tag im November (1.–26.) – fester Zufall aus seiner Lage, also bei jedem Besuch gleich. */
  const LAUB = /^n_(laubbaum|obstbaum)/;
  SZ.baumTage = function (o) {
    if (!o._jt) { const h = ST.hash2(Math.round(o.x * 10), Math.round(o.y * 10), 814), h2 = ST.hash2(Math.round(o.y * 10), Math.round(o.x * 10), 1411); o._jt = [1 + Math.floor(h * 25), 1 + Math.floor(h2 * 26)]; }
    return o._jt;
  };
  SZ.jahrVon = function (o) {
    if (o.nurWinter) return "winter";
    const j = SZ.jahr;
    if (j === "winter" || !SZ.stichtag || !LAUB.test(o.bild || "")) return j;
    const m = SZ.stichtag[0], t = SZ.stichtag[1], T = SZ.baumTage(o);
    if (m === 10) return t >= T[0] ? "herbst" : "sommer";
    if (m === 11) return t >= T[1] ? "kahl" : "herbst";
    return j;
  };
  /* Gebacken sind Winter und Herbst für alles, Frühling, Sommer und „kahl" (Laubfall) für die Laub- und Obstbäume.
     Fehlt ein Bild, nimmt das Ding das nächstbeste: Frühling → Sommer → Herbst, kahl → Herbst (nie ein leeres Bild). */
  const RUECK = { fruehling: ["fruehling", "sommer", "herbst"], sommer: ["sommer", "herbst"], kahl: ["kahl", "herbst"], herbst: ["herbst"], winter: ["winter"] };
  let rueckVz = null, rueckMerk = new Map();
  function mitRueckfall(vorn, jahr, hinten) {
    const liste = RUECK[jahr] || ["herbst"];
    if (liste.length === 1) return vorn + "_" + liste[0] + "_" + hinten;
    if (rueckVz !== LB.vz) { rueckVz = LB.vz; rueckMerk = new Map(); }
    const schl = vorn + "|" + jahr + "|" + hinten;
    let b = rueckMerk.get(schl);
    if (b) return b;
    for (const j of liste) { const n = vorn + "_" + j + "_" + hinten; if (LB.vz[n + "_k"] || LB.vz[n + "_z"] || LB.vz[n + "_g"] || LB.vz[n + "_m"]) { b = n; break; } }
    b = b || vorn + "_" + liste[liste.length - 1] + "_" + hinten;
    rueckMerk.set(schl, b);
    return b;
  }
  SZ.mitRueckfall = mitRueckfall;
  function jahrBild() { return SZ.jahr === "winter" ? "winter" : "herbst"; }
  const GIER_CACHE = {};
  /* Welche Drehungen gibt es von diesem Bild? (Bäume nur eine, Zäune zwei) */
  function gierListe(bild) {
    let liste = GIER_CACHE[bild];
    if (!liste) {
      liste = [];
      /* FASSUNG 828 — XANDER: „beim Bauen verschwindet manchmal in einer Zoomstufe das Gebäude. Wenn ich da wieder klein
         zoome und wieder groß … dann geht es meistens wieder". Im kleinen Rahmen kennt das kleine Verzeichnis die
         Baustellen nur als Zwergbilder (_n). Ohne _n in der Suche fand ein schräg stehendes Haus (45°) keine Drehung seiner
         Baustelle und suchte ein Bild, das es nicht gibt (…_b55_315) – unsichtbar, bis die zweite Zoomstufe das große
         Verzeichnis (mit _m) nachlud. Jetzt zählen alle Größen (_k _g _m _n _z). */
      const re = new RegExp("^" + bild + "_[a-z]+_[a-z]+_[a-z0-9]+_(\\d+)_[kgmnz]$");
      for (const k in LB.vz) { const m = re.exec(k); if (m && liste.indexOf(+m[1]) < 0) liste.push(+m[1]); }
      liste.sort((a, b) => a - b);
      /* (auch das kleine Verzeichnis im Rahmen hat alle Winkel: _k und _z gibt es zu jeder Drehung) */
      if (liste.length) GIER_CACHE[bild] = liste;
    }
    return liste;
  }
  function gierFuer(bild, gier) {
    const liste = gierListe(bild);
    if (!liste.length) return gier;
    if (liste.indexOf(gier) >= 0) return gier;
    /* Zaun, Brunnen, Gleis: nach einer halben Drehung gleich (0/90 bzw. 0/45/90/135) */
    if (liste[liste.length - 1] < 180 && liste.indexOf(gier % 180) >= 0) return gier % 180;
    /* schräg, aber kein schräges Bild (Bäume, Baustellen): die gerade Drehung davor */
    if (gier % 90) return gierFuer(bild, gier - 45);
    return liste[0];
  }
  SZ.gierFuer = gierFuer;
  /* FASSUNG 808 — gibt es von diesem Bild schräge (45°-)Ansichten? Dann dreht die Auswahl in Achtelschritten. */
  SZ.achtWinkel = function (bild) { return gierListe(bild).some((g) => g % 90 !== 0); };
  /* Blickwinkel eines Objekts im Bild (Objektdrehung + Kamera), 0 … 315 in 45°-Schritten */
  /* FASSUNG 820 — die Kamera darf schräg (0,5) und während der Geste dazwischen stehen: der nächste 45°-Schritt */
  SZ.gierVon = function (o) { return ST.drehMod(Math.round(((o.dreh || 0) + K.dreh) * 2) / 2) * 90; };
  /* Baustelle: Phase aus dem Fortschritt */
  function bauPhase(p) { return p < 0.2 ? 8 : p < 0.42 ? 30 : p < 0.7 ? 55 : 80; }
  SZ.basis = function (o, zeit, gierFest) {
    const gier = gierFest != null ? gierFest : SZ.gierVon(o);
    if (o.bau && o.bau.p < 1 && o.bauBild) {   // FASSUNG 807: auch im kleinen Rahmen (Zwergbilder _n)
      const gb = gierFuer(o.bauBild, gier);
      return o.bauBild + "_" + jahrBild() + "_tag_b" + bauPhase(o.bau.p) + "_" + gb;
    }
    const gb = gierFuer(o.bild, gier);
    /* FASSUNG 814 — je Ding das Bild seiner Jahreszeit (Bäume gestaffelt), mit Rückfall auf das Herbstbild */
    return mitRueckfall(o.bild, SZ.jahrVon(o), zeit + "_f_" + gb);
  };

  /* ---------------- Reihenfolge: von hinten nach vorn ----------------
     Zwei Grundflächen, die sich im Kameraraum auf einer Achse nicht
     überlappen, haben eine eindeutige Reihenfolge. Nur Paare, deren Bilder
     sich überdecken, bekommen eine Kante; dann topologisch sortiert. Neu
     gerechnet nur, wenn sich etwas ändert (Drehung, Bauen, Versetzen). */
  /* FASSUNG 808 — Ecken der Grundfläche in der Welt, um dreh × 90° gedreht (auch schräg); rand = Zugabe in Metern */
  function ecken(o, rand) {
    const w = (o.fuss ? o.fuss[0] : 2) / 2 + (rand || 0), d = (o.fuss ? o.fuss[1] : 2) / 2 + (rand || 0);
    const a = (o.dreh || 0) * Math.PI / 2, c = Math.round(Math.cos(a) * 1e6) / 1e6, s = Math.round(Math.sin(a) * 1e6) / 1e6;
    return [[-w, -d], [w, -d], [w, d], [-w, d]].map((p) => [o.x + p[0] * c - p[1] * s, o.y + p[0] * s + p[1] * c]);
  }
  SZ.ecken = ecken;
  /* Liegt flach am Boden (Gleis im Pflaster)? – am Bild erkennbar, damit gespeicherter Schmuck es behält */
  SZ.flach = function (o) { return !!(o.flach || /^d_gleis(_|$)/.test(o.bild || "")); };
  function kamRechteck(o) {
    /* Schräg steht das umschließende Rechteck der gedrehten Grundfläche (gerade: genau wie vorher) */
    const ec = ecken(o).map((p) => ST.drehXY(p[0], p[1], K.dreh));
    let a0 = Infinity, a1 = -Infinity, b0 = Infinity, b1 = -Infinity;
    for (const p of ec) { a0 = Math.min(a0, p[0]); a1 = Math.max(a1, p[0]); b0 = Math.min(b0, p[1]); b1 = Math.max(b1, p[1]); }
    /* Bildkasten in Metern (vom Zoom unabhängig): grob über Höhe und Grundfläche */
    const h = o.hoehe || 10;
    const sx0 = (a0 - b1) * ST.KX, sx1 = (a1 - b0) * ST.KX, sy0 = (a0 + b0) * ST.KY - h * ST.KZ, sy1 = (a1 + b1) * ST.KY;
    return { a0: a0, a1: a1, b0: b0, b1: b1, sx0: sx0, sx1: sx1, sy0: sy0, sy1: sy1, t: (a0 + a1 + b0 + b1) / 2, teile: o.grundriss ? teileKamera(o) : null };
  }
  /* FASSUNG 819 — XANDER: „deswegen darfst du niemals den Eingang irgendwie verbauen". Häuser aus mehreren Flügeln (das
     Döbelner Rathaus: ein Stern um den Turm, o.grundriss in Modellmetern) decken mit ihrem Rechteck auch den Platz vor dem
     Portal. Wer dort steht, gehört vor das Haus: vor dem Haus ist, wen von jedem Flügel eine Kante trennt, die zum
     Betrachter (oder zur Seite) schaut. */
  function teileKamera(o) {
    const a = (o.dreh || 0) * Math.PI / 2, c = Math.cos(a), s = Math.sin(a), k = o.stufe || 1;
    return o.grundriss.map((poly) => poly.map(([x, y]) => ST.drehXY(o.x + (x * c - y * s) * k, o.y + (x * s + y * c) * k, K.dreh)));
  }
  function vorTeilen(T, pa, pb) {
    for (const poly of T) {
      let fl = 0;
      for (let i = 0; i < poly.length; i++) { const p = poly[i], q = poly[(i + 1) % poly.length]; fl += p[0] * q[1] - q[0] * p[1]; }
      const sg = fl > 0 ? 1 : -1;
      let vor = false;
      for (let i = 0; i < poly.length && !vor; i++) {
        const p = poly[i], q = poly[(i + 1) % poly.length];
        let nx = (q[1] - p[1]) * sg, ny = -(q[0] - p[0]) * sg; const l = Math.hypot(nx, ny) || 1; nx /= l; ny /= l;
        if (nx + ny < -0.02) continue;
        if ((pa - p[0]) * nx + (pb - p[1]) * ny > 0.2) vor = true;
      }
      if (!vor) return false;
    }
    return true;
  }
  SZ.vorTeilen = vorTeilen;
  function sortieren() {
    const n = SZ.objekte.length;
    const R = SZ.objekte.map(kamRechteck), F = SZ.objekte.map(SZ.flach);
    const idx = SZ.objekte.map((o, i) => i).sort((i, j) => R[i].t - R[j].t);
    const vor = new Array(n).fill(0), nach = Array.from({ length: n }, () => []);
    for (let ii = 0; ii < n; ii++) {
      const i = idx[ii], A = R[i];
      for (let jj = ii + 1; jj < n; jj++) {
        const j = idx[jj], B = R[j];
        if (A.sx1 < B.sx0 || B.sx1 < A.sx0 || A.sy1 < B.sy0 || B.sy1 < A.sy0) continue;
        let aZuerst;
        /* FASSUNG 808 — Flaches (Pferdebahngleis im Pflaster) liegt unter allem, was darauf steht (wie stadt/szene.js) */
        const fA = F[i], fB = F[j];
        if (fA !== fB) aZuerst = fA;
        else if (A.a1 <= B.a0 + 0.01 || A.b1 <= B.b0 + 0.01) aZuerst = true;
        else if (B.a1 <= A.a0 + 0.01 || B.b1 <= A.b0 + 0.01) aZuerst = false;
        else aZuerst = A.t <= B.t;
        if (aZuerst) { nach[i].push(j); vor[j]++; } else { nach[j].push(i); vor[i]++; }
      }
    }
    const aus = [], frei = idx.filter((i) => vor[i] === 0);
    while (frei.length) {
      /* unter den freien immer das hinterste zuerst – stabil und ruhig */
      let b = 0; for (let k = 1; k < frei.length; k++) if (R[frei[k]].t < R[frei[b]].t) b = k;
      const i = frei.splice(b, 1)[0]; aus.push(i);
      for (const j of nach[i]) if (--vor[j] === 0) frei.push(j);
    }
    if (aus.length < n) for (const i of idx) if (aus.indexOf(i) < 0) aus.push(i);   // Kreis (sollte nicht vorkommen)
    reihe = aus.map((i) => { SZ.objekte[i]._R = R[i]; return SZ.objekte[i]; });
  }

  /* ---------------- FASSUNG 825: Laternen, Fenster und angestrahlte Hauswände ----------------
     XANDER (wörtlich): „hast du daran gedacht, dass du die Laternen richtig hast, dass sie die Häuser an Strahlen, dass
     sie nicht die ganze Nacht beleuchtet sind, um Strom zu sparen beziehungsweise es ist ja nicht jeder immer nachts noch
     wach" – und „überprüfe mal wegen den Lampen ja dass nachts die Lampen an sind und diese schönen Lichtkegel geben, die
     auch realistisch sind."
     Wie in einer deutschen Kleinstadt (deutsche Uhr, ST.uhr):
       · Straßenlaternen gehen in der Dämmerung an (Dämmerungsschalter: sobald es merklich dunkel wird) und morgens
         bei Helligkeit wieder aus.
       · Nachtabschaltung („Halbnachtschaltung"): zwischen 0:30 und 1:00 geht jede zweite Laterne aus (je Laterne ein
         paar Minuten versetzt), ab 5:00 sind alle wieder an, solange es dunkel ist.
       · Fenster gehen im Lauf des Abends nach und nach aus – jedes Fenster hat seine eigene „Schlafenszeit"; ein paar
         bleiben die ganze Nacht hell, ab etwa 5 Uhr stehen die Ersten wieder auf.
       · Eine brennende Laterne strahlt die Wände naher Häuser warm an (nur die Seite zur Laterne, nach Abstand
         schwächer), und ihr Lichtkegel liegt rund am Boden.
     Mit fester Tageszeit (?zeit=nacht, Knopf) gilt als Uhrzeit 22 Uhr (Abend: 19 Uhr), außer ?uhr= ist gesetzt. */
  SZ.pruef = {};   // Test-Haken der Sonde 825: { ohneKegel, ohneSchein } schaltet Lichtfleck bzw. Wandschein ab
  SZ.lichtStunde = function () {
    if (SZ.zeitAuto || ST.uhrFest) return ST.uhr().stunde;
    return SZ.zeit === "nacht" ? 22 : SZ.zeit === "abend" ? 19 : 12;
  };
  const istLaterne = (o) => !!o && /^d_laterne/.test(o.bild || "");
  SZ.istLaterne = istLaterne;
  let laternenNr = -1, laternenListe = [];
  function laternenZaehlen() {
    /* in der Reihenfolge des Aufstellens nummeriert: an der Straße entlang abwechselnd gerade/ungerade */
    if (laternenNr === SZ.stand) return;
    laternenNr = SZ.stand; laternenListe = [];
    let n = 0;
    for (const o of SZ.objekte) if (istLaterne(o)) { o._lnr = n++; laternenListe.push(o); }
  }
  /* brennt die Laterne o gerade? (h = Stunde, Z = Licht der Szene) */
  SZ.laterneAn = function (o, Z, h) {
    Z = Z || SZ.zeitDaten();
    if (h == null) h = SZ.lichtStunde();
    const ng = Z.grad != null ? Z.grad : Z.nacht;
    if (ng < 0.3) return false;                         // hell genug: aus (Dämmerungsschalter)
    laternenZaehlen();
    const nr = o._lnr != null ? o._lnr : 0;
    if (nr % 2 === 1) {
      /* jede zweite: zwischen 0:30 und 1:00 aus (je Laterne versetzt), um 5:00 wieder an */
      const aus = 0.5 + ST.hash2(nr, 825, 3) * 0.5;
      if (h >= aus && h < 5) return false;
    }
    return true;
  };
  /* Anteil der Fenster, in denen noch Licht brennt (je Stunde, stückweise gerade) */
  const FENSTER_KURVE = [[12, 0.8], [18, 0.82], [20, 0.78], [21, 0.7], [22, 0.56], [23, 0.4], [24, 0.27], [25, 0.17], [26, 0.12], [28, 0.1], [29, 0.2], [30, 0.42], [31, 0.55], [32, 0.62], [36, 0.8]];
  SZ.fensterAnteil = function (h) {
    const x = h < 12 ? h + 24 : h, K2 = FENSTER_KURVE;
    for (let i = 1; i < K2.length; i++) if (x <= K2[i][0]) { const a = K2[i - 1], b = K2[i]; return a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]); }
    return 0.8;
  };
  /* Brennt Fenster i von Haus o? Jedes Fenster hat seine „Schlafenszeit" (fester Zufallswert): fällt der Anteil darunter,
     geht es aus – so erlöschen sie nach und nach und nie alle zugleich; nachts geht selten kurz eins an (Bad, Frühschicht). */
  SZ.fensterAn = function (o, i, h) {
    const u = ST.hash2(o.id * 31 + i, 825, 7), anteil = SZ.fensterAnteil(h);
    if (u < anteil) return true;
    if (h >= 22 || h < 5) { const takt = Math.floor((h < 12 ? h + 24 : h) * 3 + ST.hash2(o.id, i, 5)); return ST.hash2(o.id * 7 + i, takt, 9) < 0.035; }
    return false;
  };
  /* ausgeschaltete Laterne: das Nachtbild mit dunklem Glas (einmal je Bild gerechnet und gemerkt) */
  const ausBilder = new Map();
  function laterneAusBild(name) {
    if (ausBilder.has(name)) return ausBilder.get(name);
    const img = LB.bild(name); if (!img) return null;
    let c = null;
    try {
      c = document.createElement("canvas"); c.width = img.naturalWidth || img.width; c.height = img.naturalHeight || img.height;
      const x = c.getContext("2d", { willReadFrequently: true }); x.drawImage(img, 0, 0);
      const d = x.getImageData(0, 0, c.width, c.height), p = d.data, oben = Math.ceil(c.height * 0.42);
      for (let y = 0; y < oben; y++) for (let xx = 0; xx < c.width; xx++) {
        const j = (y * c.width + xx) * 4, r = p[j], gg = p[j + 1], b = p[j + 2];
        /* warmes, helles Glas → dunkles, kaltes Glas mit etwas Spiegelung */
        if (p[j + 3] > 20 && r > 120 && gg > 90 && r > b + 35) {
          const v = (r + gg + b) / 765;
          p[j] = 34 + 26 * v; p[j + 1] = 40 + 28 * v; p[j + 2] = 56 + 34 * v;
        }
      }
      x.putImageData(d, 0, 0);
    } catch (e) { c = null; }
    ausBilder.set(name, c);
    return c;
  }
  SZ.laterneAusBild = laterneAusBild;
  /* Dunkle Fenster: im gemalten Nachtbild sind alle Fenster hell. Je Bild wird einmal gemerkt, welche warmen, hellen
     Bildpunkte zu welchem gemessenen Fensterlicht (meta.l, ohne Feuer und Bodenschein) gehören; geht ein Fenster aus,
     werden nur seine Bildpunkte zu dunklem Glas – das Haus bekommt dafür ein eigenes, gemerktes Bild. */
  const fensterGruppen = new Map(), fensterBilder = new Map();
  const warm = (r, gg, b) => r > 125 && gg > 75 && r > b + 45;
  function gruppenVon(name, meta, img) {
    if (fensterGruppen.has(name)) return fensterGruppen.get(name);
    let erg = null;
    try {
      const W = img.naturalWidth || img.width, H = img.naturalHeight || img.height, sx = W / meta.w, sy = H / meta.h;
      const quellen = [];
      meta.l.forEach((l, i) => { if (!l[5] && !l[6]) quellen.push([i, (meta.ax + l[0]) * sx, (meta.ay + l[1]) * sy, Math.max(3, l[2] * 0.55 * sx)]); });
      if (quellen.length) {
        const c = document.createElement("canvas"); c.width = W; c.height = H;
        const x = c.getContext("2d", { willReadFrequently: true }); x.drawImage(img, 0, 0);
        const p = x.getImageData(0, 0, W, H).data, gr = new Uint8Array(W * H).fill(255);
        let n = 0;
        for (const q of quellen) {
          const x0 = Math.max(0, Math.floor(q[1] - q[3])), x1 = Math.min(W - 1, Math.ceil(q[1] + q[3])), y0 = Math.max(0, Math.floor(q[2] - q[3])), y1 = Math.min(H - 1, Math.ceil(q[2] + q[3]));
          for (let y = y0; y <= y1; y++) for (let xx = x0; xx <= x1; xx++) {
            const j = y * W + xx, dd = ((xx - q[1]) * (xx - q[1]) + (y - q[2]) * (y - q[2])) / (q[3] * q[3]);
            if (dd > 1) continue;
            const k4 = j * 4;
            if (p[k4 + 3] < 40 || !warm(p[k4], p[k4 + 1], p[k4 + 2])) continue;
            /* bei Überschneidung gehört der Punkt der näheren Quelle */
            if (gr[j] !== 255) { const alt = quellen.find((z) => z[0] === gr[j]); if (alt && ((xx - alt[1]) ** 2 + (y - alt[2]) ** 2) / (alt[3] * alt[3]) <= dd) continue; }
            gr[j] = q[0]; n++;
          }
        }
        if (n) erg = { W: W, H: H, gr: gr, n: n };
      }
    } catch (e) { erg = null; }
    fensterGruppen.set(name, erg);
    if (fensterGruppen.size > 60) fensterGruppen.delete(fensterGruppen.keys().next().value);
    return erg;
  }
  function fensterBild(o, name, h) {
    const meta = LB.vz[name]; if (!meta || !meta.l || !meta.l.length) return null;
    const img = LB.bild(name); if (!img) return null;
    const aus = [];
    meta.l.forEach((l, i) => { if (!l[5] && !l[6] && !SZ.fensterAn(o, i, h)) aus.push(i); });
    if (!aus.length) return null;
    const schl = name + "|" + aus.join(",");
    let c = fensterBilder.get(o.id);
    if (c && c.schl === schl) { c.zuletzt = LB.takt; return c; }
    /* höchstens zwei neue Bilder je Gemälde (sonst ruckelt der erste Nachtblick); bis dahin das bisherige */
    if (SZ.fensterBudget <= 0) return c && c.name === name ? c : null;
    SZ.fensterBudget--;
    const G = gruppenVon(name, meta, img); if (!G) return null;
    try {
      c = document.createElement("canvas"); c.width = G.W; c.height = G.H; c.schl = schl; c.name = name; c.zuletzt = LB.takt;
      const x = c.getContext("2d", { willReadFrequently: true }); x.drawImage(img, 0, 0);
      const d = x.getImageData(0, 0, G.W, G.H), p = d.data, weg = new Uint8Array(256);
      for (const i of aus) weg[i] = 1;
      for (let j = 0; j < G.gr.length; j++) {
        if (G.gr[j] === 255 || !weg[G.gr[j]]) continue;
        const k4 = j * 4, v = (p[k4] + p[k4 + 1] + p[k4 + 2]) / 765;
        /* dunkles Glas, ein Hauch vom Nachthimmel gespiegelt */
        p[k4] = 20 + 26 * v; p[k4 + 1] = 24 + 28 * v; p[k4 + 2] = 38 + 36 * v;
      }
      x.putImageData(d, 0, 0);
    } catch (e) { return null; }
    fensterBilder.set(o.id, c);
    SZ.fensterDunkel = (SZ.fensterDunkel || 0) + aus.length;
    /* höchstens 16 solcher Bilder (Speicher auf dem Telefon): das am längsten ungenutzte geht */
    if (fensterBilder.size > 16) { let alt = null, t0 = Infinity; for (const [k, v] of fensterBilder) if (v.zuletzt < t0) { t0 = v.zuletzt; alt = k; } fensterBilder.delete(alt); }
    return c;
  }
  SZ.fensterBild = fensterBild;
  /* Häuser, Wunder und Kulissen mit Fenstern (nicht die Laterne, keine Baustelle) */
  const fensterArt = (o) => !!o && o.id != null && !o.geist && !(o.bau && o.bau.p < 1) && (o.art === "haus" || o.art === "wunder" || o.art === "kulisse") && !istLaterne(o);
  /* Hauswände im Schein naher Laternen: je Haus ein kleines Lichtbild (Verlauf je Laterne × Nachtbild als Maske), gemerkt
     solange sich weder Bild noch Laternen ändern; gemalt mit „lighter" (heller, warm, nach dem Stoff der Wand). */
  const schein = new Map();
  /* FASSUNG 844 — XANDER (Walkie 313): „die Laternen die einen Kegel geben sollten der die die Häuser anstrahlt … gibt gar
     nicht diesen strahl-effekt dass die Häuser nicht ohne Ihre Fenster Lichter auskommen das sollte einfach erkennbar sein
     wie im alten Spiel auch weil es nachts meist viel zu düster wirkt". Weiter (8,5 → 13 m), heller und größer: eine
     Laterne strahlt die Wände der Häuser ringsum sichtbar an, auch im kleinen Bild. */
  const REICHWEITE = 13;   // m: so weit strahlt eine 4,4 m hohe Laterne eine Wand merklich an
  function wirdAngestrahlt(o) { return !!o && !o.bau && !o.geist && (o.art === "haus" || o.art === "wunder" || (o.art === "kulisse" && !o.deko && (o.hoehe || 0) >= 5)); }
  /* nächster Punkt der Grundfläche (Rechteck aus SZ.ecken) zu einem Punkt, und der Abstand dorthin */
  function naechsterPunkt(o, x, y) {
    const E = ecken(o, 0);
    let bx = o.x, by = o.y, bd = Infinity, innen = true;
    for (let i = 0; i < 4; i++) {
      const a = E[i], b = E[(i + 1) % 4], vx = b[0] - a[0], vy = b[1] - a[1], L2 = vx * vx + vy * vy || 1;
      if ((vx * (y - a[1]) - vy * (x - a[0])) < 0) innen = false;
      const t = Math.max(0, Math.min(1, ((x - a[0]) * vx + (y - a[1]) * vy) / L2)), px = a[0] + vx * t, py = a[1] + vy * t, d = Math.hypot(x - px, y - py);
      if (d < bd) { bd = d; bx = px; by = py; }
    }
    return { x: bx, y: by, d: innen ? 0 : bd };
  }
  function laternenBei(o) {
    /* nahe Laternen (Abstand zur Wand), gemerkt bis sich die Stadt ändert */
    if (o._latN === laternenNr && o._latD === K.dreh) return o._lat;
    const aus = [];
    for (const l of laternenListe) {
      if (Math.abs(l.x - o.x) > 60 || Math.abs(l.y - o.y) > 60) continue;
      const p = naechsterPunkt(o, l.x, l.y);
      if (p.d > REICHWEITE) continue;
      /* nur Laternen vor einer Wand, die zum Betrachter zeigt (von der Wand aus gesehen liegt die Laterne vorn) */
      if (p.d > 0.2 && ST.tiefe(l.x, l.y) - ST.tiefe(p.x, p.y) < -0.1) continue;
      aus.push({ l: l, x: p.x, y: p.y, d: Math.max(0.4, p.d) });
    }
    o._lat = aus; o._latN = laternenNr; o._latD = K.dreh;
    return aus;
  }
  function hausAnstrahlen(e, Z, h) {
    const o = e.o;
    if (!wirdAngestrahlt(o) || (LB.spar && !LB.nurKlein) || SZ.pruef.ohneSchein) return;
    const nb = e.lagen.find((l) => /_nacht_/.test(l[0])); if (!nb) return;
    const img = LB.bild(nb[0]); if (!img) return;
    const m = nb[3] || e.meta, k = nb[2] || e.k;
    const lat = laternenBei(o).filter((w) => SZ.laterneAn(w.l, Z, h));
    if (!lat.length) return;
    const schl = o.id + "|" + nb[0] + "|" + K.dreh + "|" + lat.map((w) => w.l._lnr).join(",");
    let c = schein.get(o.id);
    if (!c || c.schl !== schl) {
      const f = Math.min(1, 360 / Math.max(m.w, m.h)), W = Math.max(1, Math.round(m.w * f)), H = Math.max(1, Math.round(m.h * f));
      c = document.createElement("canvas"); c.width = W; c.height = H; c.schl = schl;
      const x = c.getContext("2d");
      x.fillStyle = "#000"; x.fillRect(0, 0, W, H);
      x.globalCompositeOperation = "lighter";
      const P0 = ST.proj(o.x, o.y, 0), pxProM = K.s / k * f;   // Bildpunkte des Lichtbilds je Meter
      for (const w of lat) {
        /* Mitte des Scheins: der nächste Wandpunkt auf 2,4 m Höhe; je weiter die Laterne weg ist, desto größer und
           schwächer der Fleck (Licht fällt mit dem Quadrat des Abstands ab) */
        const P = ST.proj(w.x, w.y, 2.4), cx = (P[0] - P0[0]) / k * f + m.ax * f, cy = (P[1] - P0[1]) / k * f + m.ay * f;
        const kraft = 1 / (1 + (w.d / 5.5) * (w.d / 5.5));
        const r = (4.5 + w.d * 1.1) * pxProM;
        const gr = x.createRadialGradient(cx, cy, 0, cx, cy, r);
        gr.addColorStop(0, "rgba(255,198,122," + (0.95 * kraft).toFixed(3) + ")");
        gr.addColorStop(0.3, "rgba(255,186,108," + (0.5 * kraft).toFixed(3) + ")");
        gr.addColorStop(0.65, "rgba(240,160,90," + (0.14 * kraft).toFixed(3) + ")");
        gr.addColorStop(1, "rgba(240,160,90,0)");
        x.fillStyle = gr; x.fillRect(0, 0, W, H);
      }
      /* × Nachtbild (die Farbe der Wand), dann nur wo das Haus ist */
      x.globalCompositeOperation = "multiply"; x.drawImage(img, 0, 0, W, H);
      x.globalCompositeOperation = "destination-in"; x.drawImage(img, 0, 0, W, H);
      schein.set(o.id, c);
      if (schein.size > 32) schein.delete(schein.keys().next().value);
    }
    const a = Math.min(1, (Z.nacht - 0.3) / 0.5);
    if (a <= 0) return;
    g.save(); g.globalCompositeOperation = "lighter";
    /* zweimal: die Wand im Schein wird bis zu dreimal so hell wie im Nachtbild */
    g.globalAlpha = a; g.drawImage(c, e.X - m.ax * k, e.Y - m.ay * k, m.w * k, m.h * k);
    g.globalAlpha = a; g.drawImage(c, e.X - m.ax * k, e.Y - m.ay * k, m.w * k, m.h * k);
    g.globalAlpha = a * 0.7; g.drawImage(c, e.X - m.ax * k, e.Y - m.ay * k, m.w * k, m.h * k);   // FASSUNG 844 — ein drittes Mal
    g.restore();
    SZ.angestrahlt = (SZ.angestrahlt || 0) + 1;
  }

  /* ---------------- Zeichnen ---------------- */
  function lichtMalen(e, Z, t, nurBoden, alpha) {
    const m = e.meta; if (!m.l || !m.l.length || Z.nacht <= 0.02) return;
    g.save(); g.globalCompositeOperation = "lighter";
    /* FASSUNG 809 — Funk 205: „Bei manchen Häusern über strahlen die Fenster Lichter so sehr dass man das Objekt gar nicht
       mehr so richtig identifizieren kann … da hatten wir … nicht immer alle Lichter an … ab und zu mal jemand … weil auf
       Toilette muss oder auf Arbeit muss". Fensterlicht in Häusern: gedämpft, und je Fenster an oder aus – abends die
       meisten, spät in der Nacht nur noch wenige; jedes Fenster wechselt zu seiner eigenen Zeit (etwa alle 20 min).
       Laternen, Feuer und der Schein am Boden bleiben immer an. */
    const o = e.o, fenster = !nurBoden && o && o.id != null && (o.art === "haus" || o.art === "wunder" || o.art === "kulisse") && !/laterne/.test(o.bild || "");
    /* FASSUNG 825 — Laterne aus (Nachtabschaltung, Tag): kein Schein, kein Lichtkegel; Fenster nach ihrer Schlafenszeit */
    const h = SZ.lichtStunde();
    if (istLaterne(o) && !SZ.laterneAn(o, Z, h)) { g.restore(); return; }
    if (istLaterne(o) && m.l[0] && !SZ.pruef.ohneKegel) {
      /* FASSUNG 825 — „diese schönen Lichtkegel … die auch realistisch sind": unter der Laterne ein runder, warmer
         Lichtfleck (≈ 7 m, zur Mitte hin hell, weich auslaufend – im 2:1-Blick eine Ellipse) und darüber, ganz zart, der
         Lichtkegel in der Luft von der Leuchte zum Boden (bei Schnee und Dunst sieht man ihn). */
      /* FASSUNG 844 — der Fleck am Boden kräftiger (6,5 m, im kleinen Bild mindestens 9 Bildpunkte) und kräftiger */
      const kopfX = e.X + m.l[0][0] * e.k, kopfY = e.Y + m.l[0][1] * e.k, R = Math.max(6.5 * K.s * (o.stufe || 1), 9 * K.dpr), a = Z.nacht * alpha;
      if (nurBoden) {
        g.save(); g.translate(e.X, e.Y); g.scale(1, 0.5);
        const gr = g.createRadialGradient(0, 0, 0, 0, 0, R);
        /* (steil nach außen: die Nachbarlaterne, die nachts ausgeschaltet ist, bleibt dunkel – Sonde 825) */
        gr.addColorStop(0, "rgba(255,204,138," + (0.62 * a).toFixed(3) + ")"); gr.addColorStop(0.25, "rgba(255,190,118," + (0.34 * a).toFixed(3) + ")");
        gr.addColorStop(0.5, "rgba(255,180,105," + (0.08 * a).toFixed(3) + ")"); gr.addColorStop(0.75, "rgba(255,180,105," + (0.015 * a).toFixed(3) + ")"); gr.addColorStop(1, "rgba(255,180,105,0)");
        g.fillStyle = gr; g.fillRect(-R, -R, 2 * R, 2 * R); g.restore();
        SZ.kegel = (SZ.kegel || 0) + 1;
      } else {
        const unten = 3.4 * K.s * (o.stufe || 1), oben = 0.25 * K.s * (o.stufe || 1);
        const gl = g.createLinearGradient(0, kopfY, 0, e.Y);
        gl.addColorStop(0, "rgba(255,214,150," + (0.12 * a).toFixed(3) + ")"); gl.addColorStop(0.6, "rgba(255,200,130," + (0.05 * a).toFixed(3) + ")"); gl.addColorStop(1, "rgba(255,200,130,0)");
        g.fillStyle = gl; g.beginPath();
        g.moveTo(kopfX - oben, kopfY); g.lineTo(kopfX + oben, kopfY); g.lineTo(e.X + unten, e.Y); g.lineTo(e.X - unten, e.Y); g.closePath(); g.fill();
      }
    }
    for (let i = 0; i < m.l.length; i++) {
      const l = m.l[i];
      if (!!l[6] !== nurBoden) continue;
      const x = e.X + l[0] * e.k, y = e.Y + l[1] * e.k, r = l[2] * e.k;
      if (r < 1.2) continue;
      if (fenster && !l[5] && !SZ.fensterAn(o, i, h)) continue;
      const fl = l[5] ? 0.85 + 0.15 * Math.sin(t * 9 + x) : 1;
      /* „die Laternen … haben überhaupt keinen Schein": der Lichtkegel der Laterne am Boden kräftiger */
      const a = Z.nacht * l[4] * fl * alpha * (fenster && !l[5] ? 0.62 : 1) * (nurBoden && o && /laterne/.test(o.bild || "") ? 1.7 : 1);
      if (nurBoden) {
        g.save(); g.translate(x, y); g.scale(1, 0.5);
        const gr = g.createRadialGradient(0, 0, 0, 0, 0, r);
        gr.addColorStop(0, "rgba(" + l[3] + "," + (0.42 * a).toFixed(3) + ")"); gr.addColorStop(0.45, "rgba(" + l[3] + "," + (0.16 * a).toFixed(3) + ")"); gr.addColorStop(1, "rgba(" + l[3] + ",0)");
        g.fillStyle = gr; g.fillRect(-r, -r, 2 * r, 2 * r); g.restore();
      } else {
        const gr = g.createRadialGradient(x, y, 0, x, y, r);
        gr.addColorStop(0, "rgba(" + l[3] + "," + (0.55 * a).toFixed(3) + ")"); gr.addColorStop(0.25, "rgba(" + l[3] + "," + (0.22 * a).toFixed(3) + ")"); gr.addColorStop(1, "rgba(" + l[3] + ",0)");
        g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r);
      }
    }
    g.restore();
  }
  function rauchMalen(x, y, s, t, k, id, Z) {
    for (let i = 0; i < 7; i++) {
      const ph = (t * 0.16 + i / 7 + (id % 7) * 0.13) % 1;
      const hoch = ph * 5.5 * s * k, wind = ph * ph * 3.2 * s + Math.sin(t * 0.7 + i * 1.7) * 0.25 * s * ph;
      const r = (0.28 + ph * 1.35) * s * k, a = (1 - ph) * (ph < 0.12 ? ph / 0.12 : 1) * 0.34;
      const cx = x + wind, cy = y - hoch;
      const hell = Z.nacht > 0.5 ? "150,158,180" : Z.nacht > 0.2 ? "200,196,205" : "235,236,240";
      const gr = g.createRadialGradient(cx, cy, 0, cx, cy, r);
      gr.addColorStop(0, "rgba(" + hell + "," + a.toFixed(3) + ")"); gr.addColorStop(0.6, "rgba(" + hell + "," + (a * 0.45).toFixed(3) + ")"); gr.addColorStop(1, "rgba(" + hell + ",0)");
      g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.fill();
    }
  }
  function schneefall(t) {
    const W = K.W, H = K.H, dpr = K.dpr;
    g.save();
    for (const [anzahl, tempo, alpha, gr] of [[120, 0.55, 0.45, 0.9], [80, 0.85, 0.6, 1.35], [30, 1.25, 0.8, 2.0]]) {
      const menge = Math.round(anzahl * (W * H) / (1200 * 800) / Math.max(1, dpr * 0.8));
      g.fillStyle = "rgba(255,255,255," + alpha + ")";
      g.beginPath();
      for (let i = 0; i < menge; i++) {
        const h1 = ST.hash2(i, anzahl, 3), h2 = ST.hash2(i, anzahl, 7), h3 = ST.hash2(i, anzahl, 11);
        const fall = (t * tempo * 48 * dpr + h1 * H * 1.2) % (H * 1.2) - H * 0.1;
        const x = ((h2 * W * 1.3 + t * 14 * dpr * tempo + Math.sin(t * (0.8 + h3) + i) * 18 * dpr * tempo) % (W * 1.3)) - W * 0.15;
        const r = (0.7 + h3 * 0.9) * gr * dpr;
        g.moveTo(x + r, fall); g.arc(x, fall, r, 0, Math.PI * 2);
      }
      g.fill();
    }
    g.restore();
  }

  SZ.zeichnen = function (jetzt) {
    /* FASSUNG 799 — im Spiel eingebettet kann der Rahmen kurz 0 × 0 groß sein (Dorf zu, Menü eingeklappt): nichts malen. */
    if (!(K.W > 0 && K.H > 0)) { SZ.sichtbare = SZ.sichtbare || []; return; }
    const t = jetzt / 1000, Z = SZ.zeitDaten();
    LB.takt++;
    if (leinwand.width !== K.W || leinwand.height !== K.H) { leinwand.width = K.W; leinwand.height = K.H; }
    const sw = Math.ceil(K.W / 2), sh = Math.ceil(K.H / 2);
    if (schattenC.width !== sw || schattenC.height !== sh) { schattenC.width = sw; schattenC.height = sh; }
    /* FASSUNG 820 — während der Drehgeste nicht jedes Bild neu sortieren: in Schritten von 1/16 Vierteldrehung (≈ 5,6°);
       die eingerasteten Winkel (Vielfache von 0,5) sind genau solche Schritte */
    const schl = Math.round(K.dreh * 16) / 16 + "|" + SZ.objekte.length;
    if (schl !== reiheSchl) { reiheSchl = schl; sortieren(); }
    g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, K.W, K.H);
    sg.setTransform(1, 0, 0, 1, 0, 0); sg.clearRect(0, 0, sw, sh);

    /* Nacht = Nachtbild; Dämmerung: Tagbild, darüber das Nachtbild halb */
    /* FASSUNG 795 — fließend: bis zur Dämmerung (0,75) wächst das Nachtbild
       auf 0,62, danach bis zur vollen Nacht auf 1 */
    const ng = Z.grad != null ? Z.grad : Z.nacht;
    let nachtAnteil = ng >= 0.995 ? 1 : ng <= 0.01 ? 0 : ng <= 0.75 ? 0.62 * ng / 0.75 : 0.62 + 0.38 * (ng - 0.75) / 0.25;
    /* Sparmodus: nur ein Bild je Haus (Tag oder Nacht), nie beide */
    /* FASSUNG 809 — XANDER: „Tag/Nacht … fließend, keine Sprünge". Im kleinen Rahmen (nur _k-Bilder) wird jetzt auch
       überblendet; hart umgeschaltet wird nur noch im Sparmodus schwacher Geräte außerhalb des Rahmens. */
    if (LB.spar && !LB.nurKlein) nachtAnteil = nachtAnteil >= 0.5 ? 1 : 0;

    const zeiten = nachtAnteil >= 1 ? [["nacht", 1]] : nachtAnteil > 0 ? [["tag", 1], ["nacht", nachtAnteil]] : [["tag", 1]];
    const sicht = [];
    const rand = 60 * K.dpr;
    /* FASSUNG 808 — Blick nach Norden: hinter der Horizontlinie stehen die Alpen (himmel.js), was dahinter liegt, ist verdeckt */
    /* FASSUNG 820 — nur genau beim Blick nach Norden (K.dreh 0, drehen.js rastet exakt dort ein). Schon ein Grad daneben
       gibt es keinen Himmel: die Alpen sind ein flaches Bild quer zur Nordblickrichtung, schräg gäbe es einen halben
       Himmel mit Loch. Ohne Himmel reicht der Boden bis an den Bildrand – wie seit jeher beim Blick nach O/S/W. */
    const horizont = K.dreh === 0 && ST.dorf && ST.dorf.HORIZONT != null;
    for (const o of reihe) {
      if (o.versteckt || (o.hinten && horizont)) continue;
      /* FASSUNG 826 — Bäume im tieferen Umland (unter dem Plateau) stehen auf ihrer Bodenhöhe o.z */
      const P = ST.proj(o.x, o.y, o.z || 0);
      /* grob außerhalb? (Höhe großzügig) */
      const gross = (Math.max(o.fuss ? o.fuss[0] + o.fuss[1] : 4, (o.hoehe || 10) * 1.3)) * K.s * o.stufe;
      if (P[0] < -gross - rand || P[0] > K.W + gross + rand || P[1] < -rand || P[1] > K.H + gross + rand + gross) continue;
      /* FASSUNG 820 — beim Drehen lädt das Bild des neuen Winkels erst: solange bleibt das zuletzt gezeigte stehen
         (o._gierDa), statt dass das Haus kurz verschwindet */
      let gier = SZ.gierVon(o);
      let w0 = LB.wahl(SZ.basis(o, zeiten[0][0], gier), K.s, o.stufe);
      if (!w0 && o._gierDa != null && o._gierDa !== gier) { gier = o._gierDa; w0 = LB.wahl(SZ.basis(o, zeiten[0][0], gier), K.s, o.stufe); }
      if (!w0) continue;
      o._gierDa = gier;
      const k = K.s * o.stufe / w0.meta.s;
      const e = { o: o, X: P[0], Y: P[1], k: k, meta: w0.meta, lagen: [[w0.name, 1]] };
      for (let i = 1; i < zeiten.length; i++) {
        const w = LB.wahl(SZ.basis(o, zeiten[i][0], gier), K.s, o.stufe);
        if (w && w.meta.s === w0.meta.s) e.lagen.push([w.name, zeiten[i][1]]);
        else if (w) e.lagen.push([w.name, zeiten[i][1], K.s * o.stufe / w.meta.s, w.meta]);
      }
      /* Lichter: aus dem Nachtbild (dort sind sie gemessen) */
      const nb = e.lagen.find((l) => /_nacht_/.test(l[0]));
      if (nb) { e.licht = nb[3] || LB.vz[nb[0]]; e.lk = nb[2] || k; }
      sicht.push(e);
    }
    SZ.sichtbare = sicht;

    /* FASSUNG 808 — Himmel und Alpen hinter der Horizontlinie (himmel.js), vor allem anderen */
    if (horizont && ST.himmel) ST.himmel.hinten(g, t, Z);
    /* FASSUNG 809 — Eisenbahn (bahn.js): Schotterbett, Schwellen, Schienen liegen flach unter allem, vor den Schatten */
    if (ST.bahn) ST.bahn.boden(g, t, Z);
    if (ST.fuhrwerk) ST.fuhrwerk.boden(g, t, Z);   // FASSUNG 810 — Feldwege und Pferdebahngleis (fuhrwerk.js), ebenso flach
    /* FASSUNG 832 — XANDER: „wenn sie dann da ist … sieht es so eine Linie die … rot geht oder grün geht". Flach auf dem
       Boden (unter Häusern und Leuten): die Wege der Quests (quests.js, nachgeladen) */
    for (const f of SZ.bodenMaler) f(g, t, Z);
    /* 1. Schatten in halber Auflösung, einfarbig */
    for (const e of sicht) {
      const m = e.meta; if (!m.sn || (e.o.nebel || 0) > 0.4) continue;
      const img = LB.bild(m.sn);
      if (!img) continue;
      const k2 = e.k;
      sg.drawImage(img, (e.X - m.sax * k2) / 2, (e.Y - m.say * k2) / 2, m.sw * 2 * k2 / 2, m.sh * 2 * k2 / 2);
    }
    if (ST.bahn) ST.bahn.schatten(sg);   // FASSUNG 809 — Zugschatten in dieselbe Schattenebene (kein doppeltes Abdunkeln)
    sg.globalCompositeOperation = "source-in";
    sg.fillStyle = SZ.jahr === "winter" ? "rgb(40,62,120)" : "rgb(22,34,52)";
    sg.fillRect(0, 0, sw, sh);
    sg.globalCompositeOperation = "source-over";
    g.globalAlpha = Z.schatten * (SZ.jahr === "winter" ? 1.15 : 1);
    g.imageSmoothingEnabled = true;
    g.drawImage(schattenC, 0, 0, K.W, K.H);
    g.globalAlpha = 1;

    /* 2. Lichtpfützen */
    SZ.kegel = 0;   // FASSUNG 825 — gezählte Lichtkegel der Laternen (Sonde)
    for (const e of sicht) if (e.licht) lichtMalen({ X: e.X, Y: e.Y, k: e.lk, meta: e.licht, o: e.o }, Z, t, true, 1);
    /* FASSUNG 844 — Walkie 313: „das Bergwerk … jetzt muss ich es immer suchen im Dunkeln". Nachts leuchten vor dem
       Stollen Grubenlampen: ein warmer Schein am Boden und am Felsen, schon im kleinen Bild zu finden. */
    if (Z.nacht > 0.3) for (const e of sicht) {
      const o = e.o; if (o.spiel !== "bergwerk" || o.bau) continue;
      const w = ((o.dreh || 0) * 90 + 90) * Math.PI / 180, f = (o.fuss ? o.fuss[0] : 13) * 0.42;
      const P = ST.proj(o.x + Math.cos(w) * f, o.y + Math.sin(w) * f, 1.5), R = Math.max(9 * K.s * (o.stufe || 1), 16 * K.dpr), a = Math.min(1, (Z.nacht - 0.3) / 0.4);
      g.save(); g.globalCompositeOperation = "lighter"; g.translate(P[0], P[1]); g.scale(1, 0.62);
      const gr = g.createRadialGradient(0, 0, 0, 0, 0, R);
      gr.addColorStop(0, "rgba(255,196,110," + (0.7 * a).toFixed(3) + ")"); gr.addColorStop(0.35, "rgba(255,170,80," + (0.3 * a).toFixed(3) + ")"); gr.addColorStop(1, "rgba(255,150,60,0)");
      g.fillStyle = gr; g.fillRect(-R, -R, 2 * R, 2 * R); g.restore();
    }
    /* Menschen zwischen die Dinge einsortieren: nach dem letzten Ding, das
       sich mit ihnen im Bild überdeckt und ganz hinter ihnen liegt */
    const leute = ST.leute ? ST.leute.sichtbar(Z) : [];
    /* FASSUNG 803 — Tretboote, Badegäste und Liegende (boote.js) kommen genauso dazwischen; Kielspur und
       Ringwellen liegen flach auf dem Wasser, also vor allen Dingen */
    if (ST.boote) { ST.boote.wasser(g, t, Z); for (const p of ST.boote.sichtbar(Z)) leute.push(p); }
    /* FASSUNG 809 — Lok und Wagen (bahn.js) wie Leute und Boote zwischen die Häuser */
    if (ST.bahn) for (const p of ST.bahn.sichtbar(Z)) leute.push(p);
    if (ST.fuhrwerk) for (const p of ST.fuhrwerk.sichtbar(Z)) leute.push(p);   // FASSUNG 810 — Kornwagen und Pferdebahn
    if (ST.autos) for (const p of ST.autos.sichtbar(Z)) leute.push(p);   // FASSUNG 815 — Dodge Viper und Batmobil fahren (autos.js)
    /* FASSUNG 811 — Kühe, Schweine, Hühner (tiere.js) wie die Boote zwischen die Häuser */
    if (ST.tiere) for (const p of ST.tiere.sichtbar(Z)) leute.push(p);
    for (const f of SZ.figurQuellen) for (const p of f(Z)) leute.push(p);   // FASSUNG 832 — Leute der Quests (quests.js)
    const nachDing = new Map();
    for (const p of leute) {
      const kk = K.s, bx = p.bx || 0.6, px0 = p.X - bx * kk, px1 = p.X + bx * kk, py0 = p.Y - (p.bh || 2) * kk, py1 = p.Y + 0.2 * kk;
      let idx = -1, vorn = sicht.length, fIdx = 0, fVorn = 0;
      for (let i = 0; i < sicht.length; i++) {
        const e = sicht[i], m = e.meta, R = e.o._R;
        if (!R) continue;
        const x0 = e.X - m.ax * e.k, y0 = e.Y - m.ay * e.k;
        if (px1 < x0 || px0 > x0 + m.w * e.k || py1 < y0 || py0 > y0 + m.h * e.k) continue;
        const fl = p.vorDing ? (Math.min(px1, x0 + m.w * e.k) - Math.max(px0, x0)) * (Math.min(py1, y0 + m.h * e.k) - Math.max(py0, y0)) : 0;
        /* FASSUNG 830 — XANDER: „die Lok schneidet am Bahnhof die Waggons". Lange Fahrzeuge (Wagen der Eisenbahn) sagen
           selbst, ob sie vor (true) oder hinter (false) einem Ding stehen (p.vorDing, bahn.js: Trennachse der Grundflächen).
           Das Rechteck im Kameraraum ist bei schräg stehenden Häusern (Bahnhof, 45°) viel zu groß – dann stand der Zug
           „im" Bahnhof und dessen Bild malte Bahnsteig und Gleis über die Wagen. Steht ein Ding sicher davor, kommt der
           Wagen auch nie nach ihm. */
        const vd = p.vorDing ? p.vorDing(e.o) : undefined;
        if (vd === false) { if (i < vorn) { vorn = i; fVorn = fl; } continue; }
        /* FASSUNG 810 — wer über eine Brücke fährt (p.auf, fuhrwerk.js), kommt nach ihr */
        if (vd === true || SZ.flach(e.o) || p.auf === e.o || R.a1 <= p.a + 0.3 || R.b1 <= p.b + 0.3 || (R.teile && vorTeilen(R.teile, p.a, p.b))) { idx = i; fIdx = fl; }
      }
      /* Geht beides nicht (ein Ding davor steht in der Reihe vor einem Ding dahinter – die beiden decken sich nicht), gewinnt
         das Ding, das sich mit dem Wagen im Bild mehr deckt */
      if (vorn <= idx && fIdx > fVorn) vorn = sicht.length;
      p._vorn = vorn; p._idx = Math.min(idx, vorn - 1);
    }
    /* FASSUNG 830 — die Wagen eines Zuges (p.kette) von hinten nach vorn: ein vorderer Wagen kommt nie vor dem Wagen dahinter
       an die Reihe (sonst deckt der hintere an der Kupplung den vorderen) – außer ein Ding steht sicher vor ihm. */
    const ketten = new Map();
    for (const p of leute) if (p.kette) { if (!ketten.has(p.kette)) ketten.set(p.kette, []); ketten.get(p.kette).push(p); }
    for (const kt of ketten.values()) {
      kt.sort((u, v) => (u.a + u.b) - (v.a + v.b));
      let m = -1;
      for (const p of kt) { p._idx = Math.min(Math.max(p._idx, m), p._vorn - 1); m = p._idx; }
    }
    for (const p of leute) {
      if (!nachDing.has(p._idx)) nachDing.set(p._idx, []);
      nachDing.get(p._idx).push(p);
    }
    /* FASSUNG 846 — XANDER (Walkie 315): „cool wäre es auch noch wenn die Turmuhr die richtige Uhrzeit anzeigen würde und
       man … die Uhrzeit … trainieren könnte". Die Zifferblätter am Uhrgeschoss des Döbelner Rathauses (Modell
       rathaus_doebeln: Turmmitte im mittig gerückten Grundriss bei (−1,32 | 8,04), Blätter 1,8 m vor der Turmmitte auf
       24,65 m Höhe, Halbmesser 0,85 m) bekommen die echten Zeiger nach deutscher Uhr (ST.uhr, wie die Glocken): die im
       Bild gebackenen Zeiger (zehn vor drei) deckt eine Scheibe in Blattfarbe innerhalb der Stundenstriche zu, darauf
       Stunden- und Minutenzeiger in der Ebene des Blatts. Nur die Blätter, die zum Betrachter schauen, und erst, wenn ein
       Blatt groß genug ist, um Zeiger zu erkennen. Die Quests fragen danach („Wie spät ist es?", quests.js). */
    const UHR_MITTE = [-1.32, 8.04], UHR_AB = 1.8, UHR_Z = 24.65, UHR_R = 0.85;
    function turmuhr(e, Z) {
      const o = e.o, m = o.stufe || 1, a = (o.dreh || 0) * Math.PI / 2, c = Math.cos(a), sn = Math.sin(a);
      const w = (x, y) => [o.x + (x * c - y * sn) * m, o.y + (x * sn + y * c) * m];
      const u = ST.uhr ? ST.uhr() : null; if (!u) return;
      const stunde = ((u.h % 12) + u.m / 60 + (u.s || 0) / 3600), minute = u.m + (u.s || 0) / 60;
      const hb = e.o.heben ? e.o.heben * K.dpr : 0;
      for (const [nx, ny] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
        const C = w(UHR_MITTE[0] + nx * UHR_AB, UHR_MITTE[1] + ny * UHR_AB), N = w(UHR_MITTE[0] + nx * (UHR_AB + 1), UHR_MITTE[1] + ny * (UHR_AB + 1));
        const P = ST.proj(C[0], C[1], UHR_Z * m), Pn = ST.proj(N[0], N[1], UHR_Z * m);
        if (Pn[1] - P[1] < 0.05 * K.s * m) continue;   // schaut nicht zum Betrachter
        /* waagrecht in der Wand (für den Betrachter nach rechts) und senkrecht */
        const T = w(UHR_MITTE[0] + nx * UHR_AB + ny, UHR_MITTE[1] + ny * UHR_AB - nx), Pt = ST.proj(T[0], T[1], UHR_Z * m), Pz = ST.proj(C[0], C[1], (UHR_Z + 1) * m);
        const tx = (Pt[0] - P[0]) / m, ty = (Pt[1] - P[1]) / m, zx = (Pz[0] - P[0]) / m, zy = (Pz[1] - P[1]) / m;
        if (Math.hypot(tx, ty) * UHR_R * m < 3.2 && Math.hypot(zx, zy) * UHR_R * m < 3.2) continue;   // zu klein für Zeiger
        g.save();
        g.setTransform(tx * m, ty * m, -zx * m, -zy * m, P[0], P[1] - hb);
        const r = UHR_R, nacht = Math.min(1, Z.nacht || 0);
        /* Blattfarbe wie im Bild: die Sonnenseite heller, die Schattenseite etwas grauer, nachts gedämpft */
        const LI = ST.LICHT || [-0.5, -0.3, 0.8], ln = Math.hypot(LI[0], LI[1]) || 1, wn = [(N[0] - C[0]) / m, (N[1] - C[1]) / m];
        const hell = (0.86 + 0.14 * Math.max(-1, Math.min(1, -(wn[0] * LI[0] + wn[1] * LI[1]) / ln))) * (1 - 0.6 * nacht);
        g.fillStyle = "rgb(" + Math.round(244 * hell) + "," + Math.round(241 * hell) + "," + Math.round(230 * hell) + ")";
        g.beginPath(); g.arc(0, 0, r * 0.7, 0, Math.PI * 2); g.fill();
        const zeiger = (an, l, b) => { g.save(); g.rotate(an); g.fillStyle = "#1b1b1b"; g.beginPath(); g.moveTo(-b, 0); g.lineTo(0, -l); g.lineTo(b, 0); g.lineTo(0, l * 0.15); g.closePath(); g.fill(); g.restore(); };
        zeiger(stunde / 12 * Math.PI * 2, r * 0.5, r * 0.07);
        zeiger(minute / 60 * Math.PI * 2, r * 0.68, r * 0.05);
        g.fillStyle = "#1b1b1b"; g.beginPath(); g.arc(0, 0, r * 0.07, 0, Math.PI * 2); g.fill();
        g.restore();
      }
    }
    SZ.pruef.turmuhr = { mitte: UHR_MITTE, ab: UHR_AB, z: UHR_Z, r: UHR_R };
    const leuteMalen = (idx) => { const l = nachDing.get(idx); if (!l) return; l.sort((u, v) => (u.a + u.b) - (v.a + v.b)); for (const p of l) (p.malen || ST.leute.malen)(g, p); };
    leuteMalen(-1);
    /* FASSUNG 825 — Uhr für Laternen und Fenster; nur nachts etwas zu tun */
    const lichtH = SZ.lichtStunde(), nachtLicht = Z.nacht > 0.02, anstrahlen = Z.nacht > 0.3;
    if (nachtLicht) laternenZaehlen();
    SZ.fensterBudget = ST.leicht && ST.leicht.still ? 99 : 2;   // Prüfbild (still=1): alles in einem Bild
    SZ.angestrahlt = 0;
    /* 3. Dinge */
    for (let i = 0; i < sicht.length; i++) {
      const e = sicht[i];
      if (e.o === SZ.auswahl && !e.o.geist) auswahlRing(e, t);
      const latAus = nachtLicht && istLaterne(e.o) && !SZ.laterneAn(e.o, Z, lichtH);
      /* FASSUNG 822 — XANDER: „ich würde das jetzt halten … und ich sehe ich kann's jetzt bewegen": ein angehobenes Ding
         (oberflaeche.js, Halten) schwebt ein paar Bildpunkte über seinem Platz */
      const hb = e.o.heben ? e.o.heben * K.dpr : 0;
      for (const lg of e.lagen) {
        const nachtLage = nachtLicht && /_nacht_/.test(lg[0]);
        const img = latAus && nachtLage ? (laterneAusBild(lg[0]) || LB.bild(lg[0]))
          : nachtLage && fensterArt(e.o) ? (fensterBild(e.o, lg[0], lichtH) || LB.bild(lg[0])) : LB.bild(lg[0]);
        if (!img) continue;
        const m = lg[3] || e.meta, k = lg[2] || e.k;
        /* FASSUNG 826 — im Umland verblassen die Bäume im Dunst (dorf.js o.nebel) */
        g.globalAlpha = lg[1] * (e.o.geist ? 0.72 : 1) * (1 - (e.o.nebel || 0));
        g.drawImage(img, e.X - m.ax * k, e.Y - m.ay * k - hb, m.w * k, m.h * k);
        /* FASSUNG 844 — „weil es nachts meist viel zu düster wirkt": das Nachtbild eines Hauses, Wahrzeichens oder Bahnhofs
           ein zweites Mal aufgehellt darüber („lighter", 30 %) – Wände und Dächer bleiben erkennbar, dunkle Stellen bleiben
           dunkel (kein zusätzliches Bild zu laden) */
        if (nachtLage && !SZ.pruef.ohneAufhellen && (e.o.art === "haus" || e.o.art === "wunder" || (e.o.art === "kulisse" && e.o.name))) {
          g.globalCompositeOperation = "lighter"; g.globalAlpha = 0.3 * lg[1] * Math.min(1, Z.nacht);
          g.drawImage(img, e.X - m.ax * k, e.Y - m.ay * k - hb, m.w * k, m.h * k);
          g.globalCompositeOperation = "source-over";
        }
      }
      g.globalAlpha = 1;
      if (ST.windmuehle) ST.windmuehle.nach(g, e, t, Z);   // FASSUNG 812 — die drehenden Flügel der Windmühle (windmuehle.js)
      if (e.o.bild === "w_rathaus_doebeln" && e.lagen.length && /^w_rathaus_doebeln/.test(e.lagen[0][0])) turmuhr(e, Z);   // FASSUNG 846
      if (anstrahlen) hausAnstrahlen(e, Z, lichtH);   // FASSUNG 825 — Wände im Schein naher Laternen
      if (e.licht) lichtMalen({ X: e.X, Y: e.Y, k: e.lk, meta: e.licht, o: e.o }, Z, t, false, 1);
      if (e.o.geist) auswahlRahmen(e);
      leuteMalen(i);
    }
    /* 4. Rauch */
    for (const e of sicht) if (e.meta.r) for (const r of e.meta.r) rauchMalen(e.X + r[0] * e.k, e.Y + r[1] * e.k, K.s * e.o.stufe, t, r[2], e.o.id, Z);
    /* 5. Dunst oben (Tiefe) */
    {
      const h = K.H * 0.32;
      const farbe = Z.nacht > 0.8 ? "18,26,58" : Z.nacht > 0.3 ? "70,86,130" : SZ.jahr === "winter" ? "215,226,240" : "196,214,232";
      const gr = g.createLinearGradient(0, 0, 0, h);
      gr.addColorStop(0, "rgba(" + farbe + "," + (0.34 * Math.min(1, 14 * K.dpr / K.s + 0.25)).toFixed(3) + ")");
      gr.addColorStop(1, "rgba(" + farbe + ",0)");
      g.fillStyle = gr; g.fillRect(0, 0, K.W, h);
    }
    if (SZ.jahr === "winter" && SZ.schneefall) schneefall(t);
    for (const fn of SZ.zuhoerer) fn(g, t, Z);
  };
  SZ.zuhoerer = [];

  /* FASSUNG 809 — XANDER: „ich möchte nicht, dass wenn man auf ein Haus klickt, dass man dann diese Strichelinien sieht …
     so ne Kreis Markierung … weicher … Strichlinie nur wenn man wirklich was hin bauen will oder drehen will".
     Angetippt: ein weicher, leicht atmender Lichtkreis am Boden UNTER dem Haus. Gestrichelt nur beim Setzen/Versetzen. */
  function auswahlRing(e, t) {
    const ec = ecken(e.o, 0.9).map((p) => ST.proj(p[0], p[1], 0));
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    for (const p of ec) { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); }
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, rx = Math.max(10 * K.dpr, (x1 - x0) / 2), ry = Math.max(5 * K.dpr, (y1 - y0) / 2);
    const puls = 0.5 + 0.5 * Math.sin((t || 0) * Math.PI * 2 / 1.8);
    g.save();
    g.translate(cx, cy); g.scale(1, ry / rx);
    const gr = g.createRadialGradient(0, 0, rx * 0.55, 0, 0, rx * 1.12);
    gr.addColorStop(0, "rgba(255,236,170,0)");
    gr.addColorStop(0.72, "rgba(255,230,150," + (0.30 + 0.12 * puls).toFixed(3) + ")");
    gr.addColorStop(1, "rgba(255,230,150,0)");
    g.fillStyle = gr; g.beginPath(); g.arc(0, 0, rx * 1.12, 0, Math.PI * 2); g.fill();
    g.restore();
    const f = 0.98 + 0.02 * puls;
    g.save();
    g.strokeStyle = "rgba(255,244,205," + (0.62 + 0.25 * puls).toFixed(3) + ")"; g.lineWidth = 2.4 * K.dpr;
    g.shadowColor = "rgba(255,220,120,0.8)"; g.shadowBlur = 8 * K.dpr;
    g.beginPath(); g.ellipse(cx, cy, rx * f, ry * f, 0, 0, Math.PI * 2); g.stroke();
    g.restore();
  }
  function auswahlRahmen(e) {
    const ec = ecken(e.o, 0.6).map((p) => ST.proj(p[0], p[1], 0));
    g.save();
    /* FASSUNG 844 — große Dinge beim Versetzen: grün = die Stelle ist frei, rot = stößt an (oberflaeche.js platzPruefen) */
    g.strokeStyle = e.o._frei === true ? "rgba(110,235,120,0.95)" : e.o._frei === false ? "rgba(255,92,80,0.95)" : "rgba(255,226,140,0.95)";
    g.lineWidth = (e.o._frei != null ? 3 : 2.2) * K.dpr; g.setLineDash([7 * K.dpr, 5 * K.dpr]);
    g.beginPath(); ec.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.closePath(); g.stroke();
    g.restore();
  }

  /* Treffer: vorderstes Ding unter dem Finger, auf den Bildpunkt genau */
  const probe = document.createElement("canvas"); probe.width = probe.height = 1;
  const pg = probe.getContext("2d", { willReadFrequently: true });
  SZ.treffer = function (px, py, filter) {
    const r = SZ.sichtbare;
    for (let i = r.length - 1; i >= 0; i--) {
      const e = r[i], m = e.meta;
      if (filter && !filter(e.o)) continue;
      const x0 = e.X - m.ax * e.k, y0 = e.Y - m.ay * e.k;
      if (px < x0 || py < y0 || px > x0 + m.w * e.k || py > y0 + m.h * e.k) continue;
      const img = LB.bild(e.lagen[0][0]); if (!img) continue;
      pg.clearRect(0, 0, 1, 1);
      pg.drawImage(img, (px - x0) / e.k, (py - y0) / e.k, 1, 1, 0, 0, 1, 1);
      if (pg.getImageData(0, 0, 1, 1).data[3] > 30) return e.o;
    }
    return null;
  };
})();
