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
  SZ.geaendert = function () { reiheSchl = ""; };
  /* FASSUNG 808 — Drehung auf halbe Vierteldrehungen (45°) runden, 0 ≤ dreh < 4 */
  SZ.drehNorm = function (d) { d = Math.round((+d || 0) * 2) / 2; return ((d % 4) + 4) % 4; };
  /* FASSUNG 795 — XANDER: „der Übergang zwischen Tag und Nacht soll
     flüssiger sein … nicht plötzlich in einem Moment umschalten, sondern
     realistisch sanft ineinander übergehen, so wie es dämmert."
     Nach der Uhr (SZ.zeitAuto) gibt es einen Nachtgrad 0…1, der sich in der
     Dämmerung langsam ändert; Licht, Schatten und das Nachtbild werden
     dazwischen gemischt. Wer die Tageszeit selbst wählt, bekommt sie fest. */
  const misch = (a, b, t) => a + (b - a) * t;
  const UHR = new URLSearchParams(location.search).get("uhr") != null ? +new URLSearchParams(location.search).get("uhr") : null;
  SZ.nachtGrad = function (d) {
    const h = d.getHours() + d.getMinutes() / 60 + d.getSeconds() / 3600;
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
    /* ?uhr=18.2 – feste Uhrzeit zum Prüfen */
    const d = new Date(); if (UHR != null) d.setHours(Math.floor(UHR), Math.round((UHR % 1) * 60), 0);
    const n = SZ.nachtGrad(d), Z = ST.ZEITEN;
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
      const re = new RegExp("^" + bild + "_[a-z]+_[a-z]+_[a-z0-9]+_(\\d+)_[kgm]$");
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
    return { a0: a0, a1: a1, b0: b0, b1: b1, sx0: sx0, sx1: sx1, sy0: sy0, sy1: sy1, t: (a0 + a1 + b0 + b1) / 2 };
  }
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
    let anteil = 1;
    if (fenster) { const h = new Date().getHours() + new Date().getMinutes() / 60, sp = h >= 23 || h < 5 ? 0.3 : h >= 21.5 ? 0.55 : 0.78; anteil = sp; }
    const minute = Date.now() / 60000;
    for (let i = 0; i < m.l.length; i++) {
      const l = m.l[i];
      if (!!l[6] !== nurBoden) continue;
      const x = e.X + l[0] * e.k, y = e.Y + l[1] * e.k, r = l[2] * e.k;
      if (r < 1.2) continue;
      if (fenster && !l[5]) { const ver = ST.hash2(o.id, i, 5), takt = Math.floor(minute / 20 + ver); if (ST.hash2(o.id * 7 + i, takt, 9) > anteil) continue; }
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
      const P = ST.proj(o.x, o.y, 0);
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
    /* 1. Schatten in halber Auflösung, einfarbig */
    for (const e of sicht) {
      const m = e.meta; if (!m.sn) continue;
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
    for (const e of sicht) if (e.licht) lichtMalen({ X: e.X, Y: e.Y, k: e.lk, meta: e.licht, o: e.o }, Z, t, true, 1);
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
    const nachDing = new Map();
    for (const p of leute) {
      const kk = K.s, bx = p.bx || 0.6, px0 = p.X - bx * kk, px1 = p.X + bx * kk, py0 = p.Y - (p.bh || 2) * kk, py1 = p.Y + 0.2 * kk;
      let idx = -1;
      for (let i = 0; i < sicht.length; i++) {
        const e = sicht[i], m = e.meta, R = e.o._R;
        if (!R) continue;
        const x0 = e.X - m.ax * e.k, y0 = e.Y - m.ay * e.k;
        if (px1 < x0 || px0 > x0 + m.w * e.k || py1 < y0 || py0 > y0 + m.h * e.k) continue;
        /* FASSUNG 810 — wer über eine Brücke fährt (p.auf, fuhrwerk.js), kommt nach ihr */
        if (SZ.flach(e.o) || p.auf === e.o || R.a1 <= p.a + 0.3 || R.b1 <= p.b + 0.3) idx = i;
      }
      if (!nachDing.has(idx)) nachDing.set(idx, []);
      nachDing.get(idx).push(p);
    }
    const leuteMalen = (idx) => { const l = nachDing.get(idx); if (!l) return; l.sort((u, v) => (u.a + u.b) - (v.a + v.b)); for (const p of l) (p.malen || ST.leute.malen)(g, p); };
    leuteMalen(-1);
    /* 3. Dinge */
    for (let i = 0; i < sicht.length; i++) {
      const e = sicht[i];
      if (e.o === SZ.auswahl && !e.o.geist) auswahlRing(e, t);
      for (const lg of e.lagen) {
        const img = LB.bild(lg[0]); if (!img) continue;
        const m = lg[3] || e.meta, k = lg[2] || e.k;
        g.globalAlpha = lg[1] * (e.o.geist ? 0.72 : 1);
        g.drawImage(img, e.X - m.ax * k, e.Y - m.ay * k, m.w * k, m.h * k);
      }
      g.globalAlpha = 1;
      if (ST.windmuehle) ST.windmuehle.nach(g, e, t, Z);   // FASSUNG 812 — die drehenden Flügel der Windmühle (windmuehle.js)
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
    g.strokeStyle = "rgba(255,226,140,0.95)"; g.lineWidth = 2.2 * K.dpr; g.setLineDash([7 * K.dpr, 5 * K.dpr]);
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
