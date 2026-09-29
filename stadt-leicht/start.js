/* =====================================================================
   LEICHTE STADT — START, KAMERA, BILDSCHLEIFE
   ---------------------------------------------------------------------
   Schieben mit einem Finger (mit Schwung), zoomen mit zwei Fingern oder
   Mausrad. Die Zoomgrenze liegt dort, wo die großen Bilder gestochen
   scharf sind (Tapped-Out-Prinzip: ganz nah = volle Auflösung, nie
   pixelig). Die Bildschleife malt nur, wenn sich etwas bewegt – steht
   alles still, schläft sie fast (Akku).
   Prüfbild: stadt-leicht.html?demo=1&still=1&s=8&kx=0&ky=0&zeit=tag
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT;
  const K = ST.kamera, SZ = ST.szene, B = ST.boden, D = ST.dorf, LB = ST.bilder;
  const q = new URLSearchParams(location.search);
  const L = (ST.leicht = { lage: {} });
  const bodenC = document.getElementById("lBoden");
  const dingeC = document.getElementById("lDinge");

  function groesse() {
    const dpr = Math.min(3, window.devicePixelRatio || 1);
    const w = Math.round(window.innerWidth * dpr), h = Math.round(window.innerHeight * dpr);
    if (K.W !== w || K.H !== h || K.dpr !== dpr) {
      const alt = K.dpr || 1;
      K.W = w; K.H = h; K.s = K.s * dpr / alt; K.dpr = dpr;
      /* weiteste Übersicht: das ganze Dorf; nächste Nähe: große Bilder scharf */
      K.min = 2.4 * dpr; K.max = Math.min(66, 30 * dpr);
      /* Boden auf Telefonen mit sehr vielen Bildpunkten gröber rechnen */
      B.skala = dpr >= 2.5 ? 0.55 : dpr >= 1.8 ? 0.7 : 1;
      L.unruhe = 2;
    }
  }
  L.groesse = groesse;

  /* ---------------- Gesten ---------------- */
  const zeiger = new Map();
  let schwung = [0, 0], letzteBewegung = 0, gezogen = false, startPunkt = null;
  /* FASSUNG 807 — XANDER: „man kommt nicht über den Ereignishorizont hinaus" – bis in die Außenbezirke (Wald, Bahn) */
  function begrenzen() {
    const g = B.GROESSE / 2 + B.RAND * 0.8; K.x = Math.max(-g, Math.min(g, K.x)); K.y = Math.max(-g, Math.min(g, K.y));
    /* FASSUNG 808 — Blick nach Norden: die Alpen sind die Spielgrenze, die Kamera geht nicht weit über die Horizontlinie */
    const D = ST.dorf;
    if (K.dreh === 0 && D && D.HORIZONT != null) { const u = K.x - K.y, v = Math.max(K.x + K.y, D.HORIZONT - 20); K.x = (u + v) / 2; K.y = (v - u) / 2; }
  }
  function zoomUm(px, py, f) {
    const vor = ST.aufBoden(px, py);
    K.s = Math.max(K.min, Math.min(K.max, K.s * f));
    const nach = ST.aufBoden(px, py);
    K.x += vor[0] - nach[0]; K.y += vor[1] - nach[1]; begrenzen(); L.unruhe = 2;
  }
  function schiebe(dx, dy) { const a = ST.aufBoden(K.W / 2 - dx, K.H / 2 - dy); K.x = a[0]; K.y = a[1]; begrenzen(); L.unruhe = 2; }
  L.zoomUm = zoomUm; L.schiebe = schiebe;
  const O = () => ST.oberflaeche || {};
  dingeC.addEventListener("pointerdown", (e) => {
    dingeC.setPointerCapture(e.pointerId);
    zeiger.set(e.pointerId, { x: e.clientX * K.dpr, y: e.clientY * K.dpr });
    schwung = [0, 0]; gezogen = false; startPunkt = { x: e.clientX * K.dpr, y: e.clientY * K.dpr, t: performance.now() };
    if (O().zeigerRunter) O().zeigerRunter(startPunkt);
  });
  dingeC.addEventListener("pointermove", (e) => {
    if (!zeiger.has(e.pointerId)) return;
    const alt = zeiger.get(e.pointerId), neu = { x: e.clientX * K.dpr, y: e.clientY * K.dpr };
    if (zeiger.size === 2 && !document.body.classList.contains("lk-mini-modus")) {
      const [a, b] = [...zeiger.values()];
      const d0 = Math.hypot(a.x - b.x, a.y - b.y);
      zeiger.set(e.pointerId, neu);
      const [c, d] = [...zeiger.values()];
      const d1 = Math.hypot(c.x - d.x, c.y - d.y);
      if (d0 > 10) zoomUm((c.x + d.x) / 2, (c.y + d.y) / 2, d1 / d0);
      schiebe((neu.x - alt.x) / 2, (neu.y - alt.y) / 2);
      gezogen = true; return;
    }
    zeiger.set(e.pointerId, neu);
    if (startPunkt && Math.hypot(neu.x - startPunkt.x, neu.y - startPunkt.y) > 8 * K.dpr) gezogen = true;
    if (O().zeigerZiehen && O().zeigerZiehen(neu, alt, gezogen)) { L.unruhe = 2; return; }
    if (!gezogen) return;
    /* FASSUNG 805 — XANDER: „aus der Bewegung der Map gar nicht raus … wir können jetzt gar nicht mehr runter in unsere
       Menüs gehen". Im kleinen Rahmen des Spiels steht das Bild still wie das alte Dorf: Wischen scrollt die Seite
       (touch-action in leicht.css), navigiert wird mit Lupe und kleiner Karte, ein Tipp wählt ein Haus. */
    /* FASSUNG 806 — XANDER: „das sind zwei verschiedene Modus der eine ist fest gezogen und hat dann den Kompass wo wir
       ein bisschen in der Stadt rum navigieren können". Im kleinen Rahmen steht die Stadt fest (Wischen scrollt die Seite);
       nur mit dem Kompass (nah dran) verschiebt der Finger die Stadt. */
    if (document.body.classList.contains("lk-mini-modus") && !document.body.classList.contains("lk-nah")) return;
    const dx = neu.x - alt.x, dy = neu.y - alt.y;
    schiebe(dx, dy);
    const jetzt = performance.now(), dt = Math.max(1, jetzt - letzteBewegung);
    schwung = [dx / dt * 16, dy / dt * 16]; letzteBewegung = jetzt;
  });
  const hoch = (e) => {
    if (!zeiger.has(e.pointerId)) return;
    zeiger.delete(e.pointerId);
    if (performance.now() - letzteBewegung > 80) schwung = [0, 0];
    if (!gezogen && startPunkt && O().tippen) O().tippen(e.clientX * K.dpr, e.clientY * K.dpr);
    if (O().zeigerHoch) O().zeigerHoch(gezogen);
    if (zeiger.size === 0) startPunkt = null;
  };
  dingeC.addEventListener("pointerup", hoch);
  dingeC.addEventListener("pointercancel", hoch);
  dingeC.addEventListener("wheel", (e) => { if (document.body.classList.contains("lk-mini-modus")) return; e.preventDefault(); zoomUm(e.clientX * K.dpr, e.clientY * K.dpr, Math.exp(-e.deltaY * 0.0015)); }, { passive: false });

  let flug = null;
  L.fliegeZu = function (x, y, s, dauer) { flug = { x0: K.x, y0: K.y, s0: K.s, x1: x, y1: y, s1: s || K.s, t0: performance.now(), d: dauer || 700 }; L.unruhe = 2; };

  /* ---------------- Bildschleife ----------------
     Gemalt wird, wenn sich die Kamera bewegt, ein Bild fertig geladen ist,
     Schnee fällt, Rauch steigt oder nachts Lichter flackern. Sonst ruht sie
     (höchstens 4 Bilder je Sekunde, für die Baustellen-Uhr). */
  L.unruhe = 2;
  let letztesBild = 0;
  function bild(jetzt) {
    groesse();
    if (flug) {
      const k = Math.min(1, (jetzt - flug.t0) / flug.d), e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      K.x = flug.x0 + (flug.x1 - flug.x0) * e; K.y = flug.y0 + (flug.y1 - flug.y0) * e; K.s = flug.s0 * Math.pow(flug.s1 / flug.s0, e);
      if (k >= 1) flug = null;
      L.unruhe = 2;
    } else if (zeiger.size === 0 && (Math.abs(schwung[0]) + Math.abs(schwung[1]) > 0.2)) {
      schiebe(schwung[0], schwung[1]); schwung[0] *= 0.92; schwung[1] *= 0.92;
    }
    if (LB.neu) { LB.neu = false; L.unruhe = 2; }
    if (ST.leute) ST.leute.bewegen(jetzt);
    if (ST.boote) ST.boote.bewegen(jetzt);
    if (ST.tiere) ST.tiere.bewegen(jetzt);   // FASSUNG 811 — Tiere im Dorf (tiere.js)
    if (ST.bahn) ST.bahn.bewegen(jetzt);   // FASSUNG 809 — die Eisenbahn (bahn.js)
    if (ST.fuhrwerk) ST.fuhrwerk.bewegen(jetzt);   // FASSUNG 810 — Kornwagen und Pferdebahn (fuhrwerk.js)
    if (ST.autos) ST.autos.bewegen(jetzt);   // FASSUNG 815 — XANDER: „mein neuen Dodge Viper und mein Batmobil … in der Map" (autos.js)
    /* lebendig: Schneefall, Rauch, Nachtlichter → ~30 Bilder je Sekunde reichen */
    const lebt = (SZ.jahr === "winter" && SZ.schneefall) || true;
    const takt = L.unruhe > 0 ? 0 : lebt ? 33 : 250;
    if (jetzt - letztesBild >= takt) {
      letztesBild = jetzt;
      if (L.unruhe > 0) L.unruhe--;
      if (ST.oberflaeche && ST.oberflaeche.vorBild) ST.oberflaeche.vorBild(jetzt);
      const Z = SZ.zeitDaten();
      B.zeichnen(jetzt / 1000, Z, SZ.jahr);
      SZ.zeichnen(jetzt);
      if (ST.oberflaeche && ST.oberflaeche.bild) ST.oberflaeche.bild(jetzt);
    }
    if (!L.still) requestAnimationFrame(bild);
  }

  /* ---------------- Jahres- und Tageszeit nach dem Kalender ---------------- */
  function jahrNachDatum(d) {
    const m = d.getMonth() + 1, t = d.getDate();
    if ((m === 11 && t >= 27) || m === 12 || m === 1 || m === 2) return "winter";
    if (m >= 3 && m <= 5) return "fruehling";
    if (m >= 6 && m <= 8) return "sommer";
    return "herbst";
  }
  function zeitNachUhr(d) { const h = d.getHours() + d.getMinutes() / 60; return h >= 7.5 && h < 17 ? "tag" : (h >= 17 && h < 19) || (h >= 6.5 && h < 7.5) ? "abend" : "nacht"; }
  L.jahrNachDatum = jahrNachDatum; L.zeitNachUhr = zeitNachUhr;

  /* Eigener Schmuck (Baukasten) – vorerst im Browser gemerkt */
  L.dekoLaden = function () {
    const e = ST.spiel && ST.spiel.eigenes;
    if (e && Array.isArray(e.deko)) { if (e.lage) L.lage = e.lage; return e.deko; }
    try { return JSON.parse(localStorage.getItem("leicht_deko_v1") || "[]"); } catch (err) { return []; }
  };
  L.dekoSpeichern = function () {
    const liste = SZ.objekte.filter((o) => o.art === "eigen").map((o) => ({ bild: o.bild, x: +o.x.toFixed(2), y: +o.y.toFixed(2), dreh: o.dreh, fuss: o.fuss, hoehe: o.hoehe, nurWinter: o.nurWinter, jahr: o.jahr }));
    try { localStorage.setItem("leicht_deko_v1", JSON.stringify(liste)); } catch (e) {}
    const lage = {}; for (const o of SZ.objekte) if (o.art === "haus" && o.dreh !== (D.PLAETZE[o.spiel] || {}).dreh) lage[o.spiel] = { dreh: o.dreh };
    L.lage = lage;
    try { localStorage.setItem("leicht_lage_v1", JSON.stringify(lage)); } catch (e) {}
    if (ST.spiel && ST.spiel.eigenesSpeichern) ST.spiel.eigenesSpeichern({ v: 1, deko: liste, lage: lage });
  };
  try { L.lage = JSON.parse(localStorage.getItem("leicht_lage_v1") || "{}"); } catch (e) { L.lage = {}; }

  L.aufbauen = function () { D.aufbauen(L.ich, L.dekoLaden()); if (ST.bahn) ST.bahn.aufbauen(); if (ST.fuhrwerk) ST.fuhrwerk.aufbauen(); if (ST.leute && !ST.leute.liste.length) ST.leute.setzen(q.get("leute") != null ? +q.get("leute") : LB.spar ? 12 : 30); if (ST.oberflaeche && ST.oberflaeche.neuAufgebaut) ST.oberflaeche.neuAufgebaut(); L.unruhe = 2; };

  function los() {
    groesse();
    const glOk = B.start(bodenC);
    if (!glOk) document.body.style.background = "#dfe6ee";
    SZ.start(dingeC);
    const jetzt = new Date();
    SZ.jahr = q.get("jahr") || jahrNachDatum(jetzt);
    SZ.zeit = q.get("zeit") || zeitNachUhr(jetzt);
    SZ.zeitAuto = !q.get("zeit"); if (SZ.zeitAuto) SZ.zeitDaten();
    K.x = +(q.get("kx") || 0); K.y = +(q.get("ky") || 4);
    K.s = (+(q.get("s") || 0) || 7) * K.dpr;
    D.boden();
    return LB.laden(window.LEICHT_STEMPEL || "").then(() => ST.spiel.stand()).then((ich) => {
      L.ich = ich;
      L.aufbauen();
      if (ST.oberflaeche && ST.oberflaeche.start) ST.oberflaeche.start(q);
      if (q.get("still") === "1") {
        /* Prüfbild: warten, bis alle sichtbaren Bilder geladen sind, dann ein Bild */
        L.still = true;
        const warte = () => new Promise((ok) => { const t0 = performance.now(); const f = () => { SZ.zeichnen(1000); if (LB.offen() === 0 || performance.now() - t0 > 60000) ok(); else setTimeout(f, 120); }; f(); });
        return warte().then(() => warte()).then(() => {
          if (ST.leute) for (let x = 0; x <= 20000; x += 50) ST.leute.bewegen(x);
          if (ST.boote) for (let x = 0; x <= 20000; x += 50) ST.boote.bewegen(x);
          if (ST.tiere) for (let x = 0; x <= 20000; x += 50) ST.tiere.bewegen(x);
          if (ST.bahn) for (let x = 0; x <= 20000; x += 50) ST.bahn.bewegen(x);
          if (ST.fuhrwerk) for (let x = 0; x <= 20000; x += 50) ST.fuhrwerk.bewegen(x);
          B.zeichnen(1, SZ.zeitDaten(), SZ.jahr); SZ.zeichnen(+(q.get("t") || 1000));
          if (ST.oberflaeche && ST.oberflaeche.bild) ST.oberflaeche.bild(1000);
          window.__fertig = true;
        });
      }
      requestAnimationFrame(bild);
      window.__fertig = true;
    });
  }
  window.addEventListener("resize", () => { groesse(); L.unruhe = 2; });
  los().catch((e) => { console.error(e); window.__fehler = String(e); });
})();
