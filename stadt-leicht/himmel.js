/* =====================================================================
   LEICHTE STADT — DER WEIHNACHTSMANN AM HIMMEL
   ---------------------------------------------------------------------
   XANDER: „mit Santa Claus, der animiert durch den Himmel fliegt".
   Das Gespann aus Winterhausen (stadt/himmel.js) ist gebacken
   (werkzeug/santa-backen.js): 8 Flugrichtungen × 8 Galopp-Schritte je
   Blatt, bei Tag und bei Nacht. Etwa jede Minute zieht es geradeaus
   über das Bild (12,5 m/s wie in Winterhausen), hinter dem Schlitten
   ein weicher Sternenschleier. Nur im Winter.
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT, K = ST.kamera, SZ = ST.szene, LB = ST.bilder;
  const q = new URLSearchParams(location.search);
  let flug = null, naechster = q.has("santa") ? 0 : 20;
  const funken = [];

  /* Bildrichtung (Kurs, 0 = nach rechts, 90 = auf den Betrachter zu) → Bildpunkte je Sekunde */
  function tempo(kurs) {
    const c = Math.cos(kurs * Math.PI / 180), s = Math.sin(kurs * Math.PI / 180);
    const a = (c / ST.KX + s / ST.KY) / 2, b = (s / ST.KY - c / ST.KX) / 2, l = Math.hypot(a, b) || 1;
    return 12.5 * K.s / l;           // 12,5 m/s in der Welt
  }
  SZ.zuhoerer.push(function (g, t, Z) {
    if (SZ.jahr !== "winter") { flug = null; return; }
    if (!flug) {
      if (t < naechster) return;
      const r = q.has("santa") ? (+q.get("santa") || 0) & 7 : Math.floor(Math.random() * 8);
      const kurs = r * 45, v = tempo(kurs), dx = Math.cos(kurs * Math.PI / 180), dy = Math.sin(kurs * Math.PI / 180);
      /* durch einen Punkt nahe der Bildmitte, vom Rand zum Rand */
      const mx = K.W * (0.3 + Math.random() * 0.4), my = K.H * (0.22 + Math.random() * 0.3);
      const weg = Math.hypot(K.W, K.H) * 0.75;
      flug = { r: r, x0: mx - dx * weg, y0: my - dy * weg, dx: dx * v, dy: dy * v, t0: t, dauer: 2 * weg / v };
      if (q.has("santa")) flug.t0 = t - flug.dauer / 2;
    }
    const p = t - flug.t0;
    if (p > flug.dauer) { flug = null; naechster = t + 55 + Math.random() * 25; return; }
    const zeit = Z.nacht > 0.5 ? "nacht" : "tag", name = "santa_" + zeit, m = LB.vz[name];
    if (!m) return;
    const img = LB.bild(name); if (!img) return;
    const x = flug.x0 + flug.dx * p, y = flug.y0 + flug.dy * p;
    const sF = Math.max(K.s, Math.sqrt(24 * K.dpr * K.s)), k = sF / m.s;
    /* Sternenschleier: kleine Funken, die hinter dem Schlitten zurückbleiben */
    if (Math.random() < 0.8) funken.push({ x: x, y: y + 4 * k, t: t, r: (0.6 + Math.random()) * K.dpr });
    g.save(); g.globalCompositeOperation = "lighter";
    for (let i = funken.length - 1; i >= 0; i--) {
      const f = funken[i], a = 1 - (t - f.t) / 1.6;
      if (a <= 0) { funken.splice(i, 1); continue; }
      g.fillStyle = "rgba(255,236,190," + (0.55 * a).toFixed(3) + ")";
      g.beginPath(); g.arc(f.x + (Math.random() - 0.5) * 2, f.y + (t - f.t) * 6 * K.dpr, f.r, 0, Math.PI * 2); g.fill();
    }
    g.restore();
    const schritt = Math.floor(t * 2.1 * m.n) % m.n;
    g.drawImage(img, schritt * m.zw, flug.r * m.zh, m.zw, m.zh, x - m.ax * k, y - m.ay * k, m.zw * k, m.zh * k);
    if (ST.leicht) ST.leicht.unruhe = Math.max(ST.leicht.unruhe || 0, 1);
  });
})();
