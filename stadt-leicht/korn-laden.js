/* =====================================================================
   GETREIDEFELDER NACHLADEN — FASSUNG 835
   ---------------------------------------------------------------------
   XANDER (Funk 263): „im Spiel lass die Getreidefelder mehr wie
   Getreidefelder aussehen" – und zugleich: „kümmere Dich in der
   Priorität erstmal darum dass die Seite schnell läuft". Die echten
   Äcker (korn.js, ≈ 5 KB gepackt) stecken darum nicht in der gebündelten
   leicht.min.js. Diese Vertretung malt die Äcker bis dahin als einfache
   goldene Fläche und holt korn.min.js, sobald die Stadt ihr erstes Bild
   hat. Mit ?quelle=1 lädt korn.js direkt, dann tut diese Datei nichts.
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT;
  if (!ST || ST.korn || !window.LEICHT_KORN) return;
  const SZ = ST.szene, D = ST.dorf;
  SZ.bodenMaler.push(function (g, t, Z) {
    if (ST.korn) return;
    const dunkel = Math.min(0.78, (Z && Z.nacht || 0) * 0.8), c = [212, 178, 100].map((x, i) => Math.round(x * (1 - dunkel) + [16, 22, 44][i] * dunkel));
    g.save(); g.fillStyle = "rgb(" + c.join(",") + ")";
    for (const f of D.FELD_ORTE || []) {
      if (f.u0 == null) continue;
      g.beginPath();
      [[f.u0, f.v0], [f.u1, f.v0], [f.u1, f.v1], [f.u0, f.v1]].forEach(([u, v], i) => { const P = ST.proj((u + v) / 2, (v - u) / 2, 0); if (i) g.lineTo(P[0], P[1]); else g.moveTo(P[0], P[1]); });
      g.fill();
    }
    g.restore();
  });
  const warte = setInterval(() => {
    if (!window.__fertig) return;
    clearInterval(warte);
    const s = document.createElement("script");
    s.src = window.LEICHT_KORN; s.async = true;
    document.head.appendChild(s);
  }, 200);
})();
