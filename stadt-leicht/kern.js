/* =====================================================================
   LEICHTE STADT — KERN (Kamera, Abbildung, Licht, Tageszeiten)
   ---------------------------------------------------------------------
   XANDER: „ob du auf der Basis von diesem Konzept das Ganze in einem
   kleineren Maßstab schlanke und Systemressourcen sparend machen kannst
   … in einem separaten Ordner … dass die Leute eine Möglichkeit haben zu
   upgraden auf diese Baukasten-Stadt."

   Die leichte Stadt rechnet keine Modelle mehr: jedes Gebäude liegt als
   fertig gemaltes Bild vor (werkzeug/stadt-backen.js malt es aus den
   großen Modellen von Winterhausen). Hier steht nur, was zum Anordnen
   und Zeigen nötig ist – dieselbe Abbildung wie in Winterhausen, damit
   Boden (stadt/boden.js) und Bilder genau aufeinander passen.

   Welt in Metern: x nach Osten, y nach Süden, z nach oben.
   Kamera orthografisch 2:1, in 90°-Schritten drehbar.
   ===================================================================== */
(function () {
  "use strict";
  const ST = (window.STADT = window.STADT || {});
  const KX = Math.SQRT1_2, KY = Math.SQRT1_2 * 0.5, KZ = Math.sqrt(3) / 2;
  ST.KX = KX; ST.KY = KY; ST.KZ = KZ;
  const norm = (v) => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };
  /* Licht im Kameraraum – wie in Winterhausen (die Bilder sind so gemalt) */
  ST.LICHT = norm([-0.42, 0.74, 0.66]);
  /* FASSUNG 826 — XANDER: „Jetzt muss das nur noch schön Spielraum geben nach unten hin, weil ich will noch den Kölner Dom
     rein bauen". Die Bodenkarte (Wege, Wasser) reicht 56 statt 40 m über das Dorf hinaus (±128 m), damit auch der Weg
     zum Dom unten auf dem Bauland gemalt wird (stadt/boden.js liest ST.bodenRand). */
  ST.bodenRand = 56;

  ST.zufall = function (seed) {
    let s = (seed >>> 0) || 1;
    return function () {
      s = (s + 0x6D2B79F5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
  ST.hash2 = function (x, y, s) {
    let h = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(s | 0, 2147483647);
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  };

  /* Tageszeiten – dieselben Werte wie Winterhausen (Boden-Shader) */
  ST.ZEITEN = {
    tag:   { name: "Tag",       amb: [0.64, 0.68, 0.78], sonne: [0.40, 0.36, 0.28], nacht: 0,    schatten: 0.34 },
    abend: { name: "Dämmerung", amb: [0.38, 0.47, 0.62], sonne: [0.30, 0.22, 0.15], nacht: 0.75, schatten: 0.26 },
    nacht: { name: "Nacht",     amb: [0.20, 0.24, 0.40], sonne: [0.06, 0.07, 0.12], nacht: 1,    schatten: 0.18 }
  };

  const kam = (ST.kamera = { x: 0, y: 0, s: 20, dreh: 0, W: 800, H: 600, dpr: 1, min: 4, max: 60 });
  function drehXY(x, y, d) {
    switch (d & 3) { case 1: return [-y, x]; case 2: return [-x, -y]; case 3: return [y, -x]; default: return [x, y]; }
  }
  ST.drehXY = drehXY;
  /* Welt → Bild (Gerätepixel) */
  ST.proj = function (x, y, z) {
    const r = drehXY(x - kam.x, y - kam.y, kam.dreh);
    return [kam.W / 2 + (r[0] - r[1]) * KX * kam.s, kam.H / 2 + (r[0] + r[1]) * KY * kam.s - (z || 0) * KZ * kam.s];
  };
  /* Bild → Boden (z = 0) */
  ST.aufBoden = function (px, py) {
    const u = (px - kam.W / 2) / (KX * kam.s), v = (py - kam.H / 2) / (KY * kam.s);
    const a = (u + v) / 2, b = (v - u) / 2;
    const w = drehXY(a, b, (4 - (kam.dreh & 3)) & 3);
    return [w[0] + kam.x, w[1] + kam.y];
  };
  /* Tiefe im Kameraraum (größer = weiter vorn) */
  ST.tiefe = function (x, y) { const r = drehXY(x, y, kam.dreh); return r[0] + r[1]; };
})();
