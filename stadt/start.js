/* =====================================================================
   BAUKASTEN-STADT — START, KAMERA, BILDSCHLEIFE
   ---------------------------------------------------------------------
   Kamera wie in großen Aufbauspielen: mit einem Finger schieben (mit
   Schwung), mit zwei Fingern zoomen, Mausrad zoomt zur Mausposition.
   Werkbank: stadt.html?werkbank=<modell>&gier=30&jahr=winter&zeit=tag
   &bau=1&s=60 zeigt nur ein Modell – dafür malen wir Stück für Stück.
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT;
  const K = ST.kamera, SZ = ST.szene;
  const q = new URLSearchParams(location.search);

  const bodenC = document.getElementById("stadtBoden");
  const dingeC = document.getElementById("stadtDinge");

  function groesse() {
    const dpr = Math.min(3, window.devicePixelRatio || 1);
    const w = Math.round(window.innerWidth * dpr), h = Math.round(window.innerHeight * dpr);
    if (K.W !== w || K.H !== h || K.dpr !== dpr) {
      const alt = K.dpr || 1;
      K.W = w; K.H = h; K.s = K.s * dpr / alt; K.dpr = dpr;
      ST.kamera.min = 5 * dpr; ST.kamera.max = 150 * dpr;
    }
  }

  /* Modelle nachladen (Liste in modelle.js) */
  function modelleLaden() {
    /* Gebündelt (stadt.min.js): die Modelle der Liste sind schon geladen */
    const liste = ST.GEBUENDELT ? [] : (ST.MODELL_DATEIEN || []).slice();
    /* Werkbank: die Datei des gezeigten Modells auch laden, wenn sie noch nicht in der Liste steht */
    const wb = q.get("werkbank");
    if (wb && liste.indexOf(wb) < 0 && /^[a-z0-9_-]+$/.test(wb)) liste.push(wb);
    (q.get("dazu") || "").split(",").filter((n) => /^[a-z0-9_-]+$/.test(n) && liste.indexOf(n) < 0).forEach((n) => liste.push(n));
    const v = ST.STEMPEL ? "?v=" + ST.STEMPEL : "?t=" + Date.now();
    return Promise.all(liste.map((n) => new Promise((ok) => {
      const s = document.createElement("script");
      s.src = "stadt/modelle/" + n + ".js" + v;
      s.onload = ok; s.onerror = () => { console.error("Modell fehlt: " + n); ok(); };
      document.head.appendChild(s);
    }))).then(() => new Promise((ok) => {
      const extra = ST.EXTRA_DATEIEN || [];
      if (!extra.length) return ok();
      let n = extra.length;
      extra.forEach((d) => { const s = document.createElement("script"); s.src = "stadt/" + d + ".js" + v; s.onload = s.onerror = () => { if (--n === 0) ok(); }; document.head.appendChild(s); });
    }));
  }

  /* ---------------- Kamera-Gesten ---------------- */
  const zeiger = new Map();
  let schwung = [0, 0], letzteBewegung = 0, gezogen = false, startPunkt = null;
  ST.gesten = { aktiv: true };
  function zoomUm(px, py, faktor) {
    const vor = ST.aufBoden(px, py);
    K.s = Math.max(K.min, Math.min(K.max, K.s * faktor));
    const nach = ST.aufBoden(px, py);
    K.x += vor[0] - nach[0]; K.y += vor[1] - nach[1];
    begrenzen();
  }
  function begrenzen() {
    const g = ST.boden.GROESSE / 2 + 12;
    K.x = Math.max(-g, Math.min(g, K.x)); K.y = Math.max(-g, Math.min(g, K.y));
  }
  ST.zoomUm = zoomUm;
  function schiebe(dx, dy) {
    /* Bildversatz → Weltversatz (umgekehrt) */
    const a = ST.aufBoden(K.W / 2 - dx, K.H / 2 - dy);
    K.x = a[0]; K.y = a[1];
    begrenzen();
  }
  ST.schiebe = schiebe;

  dingeC.addEventListener("pointerdown", (e) => {
    dingeC.setPointerCapture(e.pointerId);
    zeiger.set(e.pointerId, { x: e.clientX * K.dpr, y: e.clientY * K.dpr });
    schwung = [0, 0]; gezogen = false; startPunkt = { x: e.clientX * K.dpr, y: e.clientY * K.dpr, t: performance.now() };
    if (ST.oberflaeche && ST.oberflaeche.zeigerRunter) ST.oberflaeche.zeigerRunter(e, startPunkt);
  });
  dingeC.addEventListener("pointermove", (e) => {
    if (!zeiger.has(e.pointerId)) { if (ST.oberflaeche && ST.oberflaeche.zeigerSchweben) ST.oberflaeche.zeigerSchweben(e.clientX * K.dpr, e.clientY * K.dpr); return; }
    const alt = zeiger.get(e.pointerId), neu = { x: e.clientX * K.dpr, y: e.clientY * K.dpr };
    if (zeiger.size === 2) {
      const [a, b] = [...zeiger.values()];
      const d0 = Math.hypot(a.x - b.x, a.y - b.y);
      zeiger.set(e.pointerId, neu);
      const [c, d] = [...zeiger.values()];
      const d1 = Math.hypot(c.x - d.x, c.y - d.y);
      if (d0 > 10) zoomUm((c.x + d.x) / 2, (c.y + d.y) / 2, d1 / d0);
      schiebe((neu.x - alt.x) / 2, (neu.y - alt.y) / 2);
      gezogen = true;
      return;
    }
    zeiger.set(e.pointerId, neu);
    if (startPunkt && Math.hypot(neu.x - startPunkt.x, neu.y - startPunkt.y) > 8 * K.dpr) gezogen = true;
    if (ST.oberflaeche && ST.oberflaeche.zeigerZiehen && ST.oberflaeche.zeigerZiehen(e, neu, alt, gezogen)) return;
    if (!gezogen) return;
    const dx = neu.x - alt.x, dy = neu.y - alt.y;
    schiebe(dx, dy);
    const jetzt = performance.now(), dt = Math.max(1, jetzt - letzteBewegung);
    schwung = [dx / dt * 16, dy / dt * 16]; letzteBewegung = jetzt;
  });
  const hoch = (e) => {
    if (!zeiger.has(e.pointerId)) return;
    zeiger.delete(e.pointerId);
    if (performance.now() - letzteBewegung > 80) schwung = [0, 0];
    if (!gezogen && startPunkt && ST.oberflaeche && ST.oberflaeche.tippen) ST.oberflaeche.tippen(e.clientX * K.dpr, e.clientY * K.dpr);
    if (ST.oberflaeche && ST.oberflaeche.zeigerHoch) ST.oberflaeche.zeigerHoch(e, gezogen);
    if (zeiger.size === 0) startPunkt = null;
  };
  dingeC.addEventListener("pointerup", hoch);
  dingeC.addEventListener("pointercancel", hoch);
  dingeC.addEventListener("wheel", (e) => {
    e.preventDefault();
    zoomUm(e.clientX * K.dpr, e.clientY * K.dpr, Math.exp(-e.deltaY * 0.0015));
  }, { passive: false });

  /* Kameraflug (Mini-Karte, Auswahl) */
  let flug = null;
  ST.fliegeZu = function (x, y, s, dauer) {
    flug = { x0: K.x, y0: K.y, s0: K.s, x1: x, y1: y, s1: s || K.s, t0: performance.now(), d: dauer || 700 };
  };

  /* ---------------- Bildschleife ---------------- */
  let laufend = true;
  function bild(jetzt) {
    groesse();
    if (flug) {
      const k = Math.min(1, (jetzt - flug.t0) / flug.d), e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      K.x = flug.x0 + (flug.x1 - flug.x0) * e; K.y = flug.y0 + (flug.y1 - flug.y0) * e;
      K.s = flug.s0 * Math.pow(flug.s1 / flug.s0, e);
      if (k >= 1) flug = null;
    } else if (zeiger.size === 0 && (Math.abs(schwung[0]) + Math.abs(schwung[1]) > 0.2)) {
      schiebe(schwung[0], schwung[1]); schwung[0] *= 0.92; schwung[1] *= 0.92;
    }
    const Z = SZ.zeitDaten();
    SZ.bewegen(jetzt);
    ST.boden.zeichnen(jetzt / 1000, Z, SZ.jahr);
    SZ.zeichnen(jetzt);
    if (ST.oberflaeche && ST.oberflaeche.bild) ST.oberflaeche.bild(jetzt);
    if (laufend) requestAnimationFrame(bild);
  }

  /* ---------------- Werkbank: ein einzelnes Modell ---------------- */
  function werkbank(id) {
    ST.oberflaeche = null;     // keine Bedienung auf der Werkbank
    SZ.ohneBudget = true;
    SZ.jahr = q.get("jahr") || "winter";
    SZ.zeit = q.get("zeit") || "tag";
    SZ.schneefall = q.get("flocken") === "1";
    const def = ST.MODELLE[id];
    const o = SZ.neu(id, 0, 0, +(q.get("gier") || 0), { saat: +(q.get("saat") || 7) });
    if (q.get("bau") != null && q.get("bau") !== "1") o.bau = { fest: +q.get("bau") };
    /* etwas Weg vor dem Haus, damit man den Boden sieht */
    if (q.get("weg") !== "0") ST.boden.linie([[-(def.grund[0] / 2 + 6), def.grund[1] / 2 + 1.6], [def.grund[0] / 2 + 6, def.grund[1] / 2 + 1.6]], 1.1, 0, 1);
    K.x = +(q.get("kx") || 0); K.y = +(q.get("ky") || 0);
    const s = +(q.get("s") || 0);
    groesse();
    K.s = s ? s * K.dpr : Math.min(K.W / ((def.grund[0] + def.grund[1]) * 0.75 + 4), K.H / ((def.hoehe || 10) * 1.1 + 8)) ;
    /* Mitte etwas nach oben, damit das Haus mittig steht */
    const hm = (def.hoehe || 8) * 0.42;
    const a = ST.aufBoden(K.W / 2, K.H / 2 - hm * ST.KZ * K.s);
    K.x = a[0]; K.y = a[1];
    if (q.get("still") === "1") {
      laufend = false;
      const t = +(q.get("t") || 1000);
      groesse();
      for (let x = 0; x <= t; x += 50) SZ.bewegen(x);
      const Zd = SZ.zeitDaten();
      ST.boden.zeichnen(t / 1000, Zd, SZ.jahr);
      SZ.zeichnen(t);
      window.__fertig = true;
      return;
    }
    requestAnimationFrame(bild);
    window.__fertig = true;
  }

  function los() {
    groesse();
    const glOk = ST.boden.start(bodenC);
    if (!glOk) { document.body.style.background = "#dfe6ee"; }
    SZ.start(dingeC);
    modelleLaden().then(() => {
      for (const id of ST.OHNE_DREHUNG || []) if (ST.MODELLE[id]) ST.MODELLE[id].ohneDrehung = true;
      const wb = q.get("werkbank");
      if (wb) return werkbank(wb);
      if (ST.stadtAnfang) ST.stadtAnfang(q);
      if (ST.oberflaeche && ST.oberflaeche.start) ST.oberflaeche.start(q);
      if (q.get("still") === "1") {
        SZ.ohneBudget = true;
        if (ST.oberflaeche && ST.oberflaeche.vorhangWeg) ST.oberflaeche.vorhangWeg();
        /* Prüfbild: Bewegung bis zur Zeit t vorspulen, dann ein Bild */
        const t = +(q.get("t") || 1000);
        groesse();
        for (let x = 0; x <= t; x += 50) SZ.bewegen(x);
        const Zd = SZ.zeitDaten();
        ST.boden.zeichnen(t / 1000, Zd, SZ.jahr);
        SZ.zeichnen(t);
        if (ST.oberflaeche && ST.oberflaeche.bild) ST.oberflaeche.bild(t);
        window.__fertig = true;
        return;
      }
      requestAnimationFrame(bild);
      window.__fertig = true;
    }).catch((e) => { console.error(e); window.__fehler = String(e); });
  }
  window.addEventListener("resize", groesse);
  los();
})();
