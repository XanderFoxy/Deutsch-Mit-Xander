/* =====================================================================
   LEICHTE STADT — KARTE DREHEN (zwei Finger, Einrasten in 8 Winkeln)
   ---------------------------------------------------------------------
   FASSUNG 820 — XANDER (Walkie 309): „Jetzt: Zwei-Finger-Drehen mit
   Einrasten in 8 Winkeln (schnell machbar)". Vorher (Funk 207): „stufenlos
   drehen … wie Google Maps".

   Die Häuser sind in 8 Winkeln gebacken (45°-Schritte). Die Kamera dreht
   deshalb während der Geste stufenlos (Boden, Wege, Leute, Fahrzeuge
   folgen genau), jedes Haus zeigt dabei das Bild des nächstgelegenen
   45°-Schritts. Beim Loslassen rastet die Kamera weich (300 ms, sanft
   auslaufend) auf den nächsten 45°-Schritt ein – dann passt jedes Bild
   genau auf seine Grundfläche.

   Geste (start.js): zwei Finger. Dreht sich die Verbindungslinie der
   Finger, dreht sich die Karte um den Punkt zwischen den Fingern – wie bei
   Google Maps. Kneifen (Zoom) und Schieben gehen gleichzeitig weiter. Erst
   ab 12° Drehung beginnt das Drehen, damit reines Kneifen nicht dreht.
   Gemessen wird der Winkel auf dem Boden (nicht im gestauchten Bild): so
   bleiben die Punkte unter den Fingern auch bei der 2:1-Schrägsicht dort.
   Knöpfe und Umschalt+Mausrad drehen um 45°, ebenso weich.

   K.dreh: Vierteldrehungen, 0 ≤ K.dreh < 4 (0,5 = 45°). Gespeichert wird
   davon nichts – Hausdrehungen (o.dreh) bleiben, wie sie sind.
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT, K = ST.kamera, KX = ST.KX, KY = ST.KY;
  const DR = (ST.drehen = {});
  const L = () => ST.leicht || {};
  const O = () => ST.oberflaeche || {};
  const SCHWELLE = 12 * Math.PI / 180;   // „eine kleine Schwelle", damit reines Kneifen nicht dreht
  const DAUER = 300;                     // Einrasten: ca. 250–350 ms
  /* Blickrichtung: die Richtung, die oben im Bild liegt. K.dreh + 1 dreht die Karte nach links herum (Knopf „Karte nach
     links drehen"), der Blick wandert also von Norden nach Westen. (Bis Fassung 819 sagte die Ansage bei dreh 1
     „Osten" – oben liegt dann aber der Westen: dort, wo beim Blick nach Norden rechts die Alpen enden.) */
  DR.NAMEN = ["Norden", "Nordosten", "Osten", "Südosten", "Süden", "Südwesten", "Westen", "Nordwesten"];
  DR.name = function (d) { const k = Math.round(ST.drehMod(d == null ? K.dreh : d) * 2) % 8; return DR.NAMEN[(8 - k) % 8]; };

  /* Kompassnadel (im kleinen Rahmen, oberflaeche.js): zeigt stufenlos dorthin, wo im Bild Norden liegt
     (CSS-Variable --lk-nadel, leicht.css). Norden = was beim Blick nach Norden oben im Bild liegt: Welt (−1, −1). */
  let nadel = 0;
  DR.nadelWinkel = function () {
    const r = ST.drehXY(-1, -1, K.dreh), sx = (r[0] - r[1]) * KX, sy = (r[0] + r[1]) * KY;
    return Math.atan2(sx, -sy) * 180 / Math.PI;
  };
  function kompass() {
    let w = DR.nadelWinkel();
    w = nadel + ((((w - nadel) % 360) + 540) % 360 - 180);   // ohne Sprung über 360° (die Nadel dreht den kurzen Weg)
    if (Math.abs(w - nadel) < 0.05) return;
    nadel = w;
    try { document.documentElement.style.setProperty("--lk-nadel", w.toFixed(2) + "deg"); } catch (e) {}
  }

  /* Kamera auf den Winkel d stellen; der Boden unter dem Bildpunkt (px, py) bleibt, wo er ist (Drehpunkt) */
  function setzen(d, px, py) {
    if (px == null) { px = K.W / 2; py = K.H / 2; }
    const vor = ST.aufBoden(px, py);
    K.dreh = ST.drehMod(d);
    const nach = ST.aufBoden(px, py);
    K.x += vor[0] - nach[0]; K.y += vor[1] - nach[1];
    L().unruhe = 2;
    kompass();
  }
  DR.setzen = setzen;

  /* ---------------- weich einrasten / um 45° drehen ---------------- */
  let anim = null, schleife = false;
  const auslaufen = (k) => 1 - Math.pow(1 - k, 3);   // ease-out
  function schritt() {
    if (!anim) { schleife = false; return; }
    const k = Math.min(1, (performance.now() - anim.t0) / anim.dauer);
    if (k < 1) { setzen(anim.von + (anim.nach - anim.von) * auslaufen(k), anim.px, anim.py); requestAnimationFrame(schritt); return; }
    const a = anim; anim = null; schleife = false;
    setzen(Math.round(a.nach * 2) / 2, a.px, a.py);   // genau auf den 45°-Schritt (K.dreh 0 ist dann wirklich 0)
    fertig(a);
  }
  function fertig(a) {
    /* Blick nach Norden: dort sind die Alpen die Spielgrenze (start.js begrenzen) – sanft zurück statt zu springen */
    if (L().begrenzen) {
      const x = K.x, y = K.y; L().begrenzen();
      if (Math.hypot(K.x - x, K.y - y) > 0.01 && L().fliegeZu) { const nx = K.x, ny = K.y; K.x = x; K.y = y; L().fliegeZu(nx, ny, K.s, 260); }
    }
    if (a.ansage !== false && O().ansage) O().ansage("Blick nach " + DR.name());
    if (a.danach) a.danach();
  }
  /* Auf den Winkel ziel drehen (den kurzen Weg), weich; Drehpunkt (px, py) im Bild (sonst die Bildmitte) */
  DR.zu = function (ziel, opt) {
    opt = opt || {};
    const von = K.dreh;
    let nach = ziel; while (nach - von > 2) nach -= 4; while (von - nach > 2) nach += 4;
    anim = { von: von, nach: nach, t0: performance.now(), dauer: opt.dauer || DAUER, px: opt.px, py: opt.py, danach: opt.danach, ansage: opt.ansage };
    if (Math.abs(nach - von) < 1e-6) { anim.dauer = 1; }
    if (!schleife) { schleife = true; requestAnimationFrame(schritt); }
  };
  /* Um schritte × 45° weiterdrehen (Knöpfe, Umschalt+Mausrad). Läuft noch eine Drehung, zählt ihr Ziel als Anfang –
     zweimal schnell getippt sind also 90°. */
  DR.um = function (schritte, opt) {
    const basis = anim ? anim.nach : Math.round(K.dreh * 2) / 2;
    DR.zu(basis + schritte * 0.5, opt);
  };
  DR.laeuft = function () { return !!anim || !!(geste && geste.dreht); };

  /* ---------------- Zwei-Finger-Geste (aus start.js) ---------------- */
  let geste = null;
  /* Winkel der Linie p → q auf dem Boden (Kameraraum, ohne die 2:1-Stauchung des Bilds) */
  function bodenWinkel(p, q) {
    const dx = (q.x - p.x) / KX, dy = (q.y - p.y) / KY;
    return Math.atan2((dy - dx) / 2, (dx + dy) / 2);
  }
  const kurz = (w) => { w = (w + Math.PI) % (2 * Math.PI); if (w < 0) w += 2 * Math.PI; return w - Math.PI; };
  /* a, b: die Finger vorher; c, d: nachher (Gerätepixel). Dreht die Karte um den Punkt zwischen den Fingern. */
  DR.zweiFinger = function (a, b, c, d) {
    if (!geste) geste = { summe: 0, dreht: false };
    const dw = kurz(bodenWinkel(c, d) - bodenWinkel(a, b));
    if (!geste.dreht) {
      geste.summe += dw;
      if (Math.abs(geste.summe) < SCHWELLE) return false;
      geste.dreht = true; anim = null;   // ab hier dreht die Hand (ohne Ruck: die ersten 12° zählen nicht)
      return true;
    }
    /* Die Finger drehen sich auf dem Boden um dw; die Welt unter ihnen soll mitgehen: K.dreh wächst um dw / 90° */
    setzen(K.dreh + dw / (Math.PI / 2), (c.x + d.x) / 2, (c.y + d.y) / 2);
    geste.mitte = [(c.x + d.x) / 2, (c.y + d.y) / 2];
    return true;
  };
  /* Ein Finger (oder beide) weg: einrasten auf den nächsten 45°-Schritt, um die letzte Fingermitte */
  DR.loslassen = function () {
    const g = geste; geste = null;
    if (anim) return;
    const ziel = Math.round(K.dreh * 2) / 2;
    if (!g || !g.dreht) { if (Math.abs(K.dreh - ziel) > 1e-9) DR.zu(ziel, { ansage: false }); return; }
    DR.zu(ziel, { px: g.mitte ? g.mitte[0] : undefined, py: g.mitte ? g.mitte[1] : undefined });
  };
  DR.geste = function () { return geste; };
  kompass();
})();
