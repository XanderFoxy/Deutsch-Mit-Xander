/* =====================================================================
   BAUKASTEN-STADT — DAS WEIHNACHTSDORF (Anfangsstadt) UND TÖNE
   ---------------------------------------------------------------------
   XANDER: „Ich möchte einen Liebreiz zur Weihnachtsdeko Entwurf bitte
   als erstes so dieses Weihnachtsdorf damit ich sehe, was du drauf hast
   mit schmücken mit Schnee mit Santa Claus, der animiert durch den
   Himmel fliegt alles dabei."

   Wer die Seite zum ersten Mal öffnet, steht in „Winterhausen": ein
   Marktplatz mit großem Christbaum und Buden, Fachwerkhäuser rundherum,
   eine Kirche auf dem Kirchberg, ein Bach mit Brücke, der in einen
   zugefrorenen See mündet, Tannenwald und Obstwiesen. Alles lässt sich
   danach verschieben, drehen, abreißen und neu bauen.
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT;
  const SZ = ST.szene, B = ST.boden;

  /* ---------------- Töne aus dem Tonordner der Seite ---------------- */
  const TON = {};
  let tonAn = true;
  try { tonAn = localStorage.getItem("stadt_ton") !== "0"; } catch (e) {}
  const endung = (function () { const a = document.createElement("audio"); return a.canPlayType('audio/ogg; codecs="opus"') ? ".opus" : ".m4a"; })();
  ST.ton = function (name, laut) {
    if (!tonAn) return;
    try {
      let a = TON[name];
      if (!a) { a = TON[name] = new Audio("ton/" + name + endung); a.preload = "auto"; }
      const k = a.cloneNode(); k.volume = laut == null ? 0.5 : laut; k.play().catch(() => {});
    } catch (e) {}
  };
  if (ST.oberflaeche) ST.oberflaeche.ton = ST.ton;

  /* ---------------- Boden: Straßen, Platz, Bach, See ---------------- */
  function flaecheRund(cx, cy, rx, ry, art, rauh) {
    for (let y = -ry; y <= ry; y += 0.5) for (let x = -rx; x <= rx; x += 0.5) {
      const w = Math.atan2(y / ry, x / rx);
      const rand = 1 + (rauh || 0) * (ST.rausch(Math.cos(w) * 2 + cx, Math.sin(w) * 2 + cy, 9) - 0.5);
      if ((x * x) / (rx * rx) + (y * y) / (ry * ry) <= rand * rand) B.pinsel(cx + x, cy + y, 0.6, art, 1);
    }
  }
  function flaecheEckig(x0, y0, x1, y1, art) {
    for (let y = y0; y <= y1; y += 0.5) for (let x = x0; x <= x1; x += 0.5) B.pinsel(x, y, 0.6, art, 1);
  }
  function kurve(pts, n) {
    /* Catmull-Rom → weiche Linie */
    const aus = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
      for (let k = 0; k < n; k++) {
        const t = k / n, t2 = t * t, t3 = t2 * t;
        aus.push([0, 1].map((a) => 0.5 * ((2 * p1[a]) + (-p0[a] + p2[a]) * t + (2 * p0[a] - 5 * p1[a] + 4 * p2[a] - p3[a]) * t2 + (-p0[a] + 3 * p1[a] - 3 * p2[a] + p3[a]) * t3)));
      }
    }
    aus.push(pts[pts.length - 1]);
    return aus;
  }
  ST.dorfBoden = function () {
    B.leeren();
    /* Marktplatz */
    flaecheEckig(-13, -12, 13, 12, 0);
    /* Hauptstraße Nord–Süd, Kirchweg, Gasse nach Westen, Weg zum Bach */
    B.linie(kurve([[0, -12], [1, -24], [-2, -38], [0, -50]], 12), 1.7, 0, 1);
    B.linie(kurve([[0, 12], [-1, 26], [2, 40], [0, 50]], 12), 1.8, 0, 1);
    B.linie(kurve([[-13, 2], [-26, 4], [-40, 0], [-56, 3]], 12), 1.5, 0, 1);
    B.linie(kurve([[13, -2], [22, -3], [32, -1], [44, 2]], 12), 1.5, 0, 1);
    /* Kirchplatz */
    flaecheRund(0, -52, 9, 7, 0, 0.25);
    /* Bahnhofsvorplatz */
    flaecheEckig(-9, 48.5, 9, 54.5, 0);
    /* Domplatz vor den Westtürmen (Türme zeigen nach Norden zur Gasse) */
    flaecheEckig(-58, 5, -34, 17, 0);
    /* Platz um Pyramide und Karussell am Bach */
    flaecheRund(45, -14, 7.5, 6.5, 0, 0.3);
    flaecheRund(46, 14, 7.5, 6.5, 0, 0.3);
    B.linie(kurve([[40, 1], [44, -6], [45, -8]], 8), 1.2, 0, 1);
    B.linie(kurve([[40, 3], [44, 8], [46, 8]], 8), 1.2, 0, 1);
    /* Kirchweg zur Krippe */
    B.linie(kurve([[-4, -50], [-10, -46]], 6), 1.0, 0, 1);
    /* Bach: von Nordosten, unter der Brücke (x≈32) durch, in den See im Südosten */
    const bach = kurve([[66, -72], [54, -54], [40, -40], [36, -22], [31, -2], [34, 16], [42, 30], [48, 40]], 14);
    B.linie(bach, (i, k) => 1.25 + 0.55 * ST.rausch(i * 0.7 + k, 3, 5), 1, 1);
    flaecheRund(52, 50, 14, 11, 1, 0.35);
    /* Rasen vor den Häusern (Vorgärten) und Beete */
    flaecheEckig(-24, -22, -16, -15, 3);
    flaecheEckig(16, 15, 24, 22, 3);
    flaecheEckig(22, -66, 30, -58, 2);
  };

  /* ---------------- Gebäude und Schmuck ---------------- */
  ST.dorfBauen = function () {
    SZ.objekte = []; SZ.naechsteId = 1;
    const hat = (id) => !!ST.MODELLE[id];
    /* Bäume in wenigen Spielarten (je eigenes Bild im Speicher), Häuser jedes für sich */
    const BAUM = { tanne: 9, laubbaum: 6, obstbaum: 5 };
    const setze = (id, x, y, gier, ersatz) => {
      let t = hat(id) ? id : (ersatz && hat(ersatz) ? ersatz : null);
      if (!t) return null;
      let saat = Math.abs(ST.textHash(id + x + "," + y));
      if (BAUM[t]) saat = 1 + saat % BAUM[t];
      return SZ.neu(t, x, y, gier || 0, { saat: saat });
    };
    /* Häuser um den Marktplatz, Front zum Platz */
    setze("fachwerkhaus", -6, -19, 0, "probehaus");
    setze("fachwerkerker", 7, -19.5, 0, "probehaus");
    setze("fachwerkhaus", 19.5, -6, 90, "probehaus");
    setze("fachwerkerker", 19.5, 7, 90, "probehaus");
    setze("fachwerkerker", -7, 19.5, 180, "probehaus");
    setze("fachwerkhaus", 7, 19.5, 180, "probehaus");
    setze("fachwerkhaus", -19.5, 7, 270, "probehaus");
    setze("fachwerkerker", -19.5, -7, 270, "probehaus");
    /* Weiter draußen */
    setze("fachwerkhaus", -34, -8, 0, "probehaus");
    setze("fachwerkerker", -56, -22, 90, "probehaus");
    setze("fachwerkhaus", 10, 36, 270, "probehaus");
    setze("fachwerkhaus", -10, -34, 90, "probehaus");
    setze("kirche", 0, -62, 0);
    setze("bahnhof", 0, 63, 180);
    setze("koelnerdom", -46, 44, 90);
    setze("krippe", -13, -46, 0);
    setze("pyramide", 45, -14, 0);
    setze("karussell", 46, 14, 0);
    setze("wassermuehle", 32.4, -37.2, 12);
    /* Markt: Christbaum in der Mitte, Buden im Kreis */
    setze("weihnachtsbaum", 0, 0, 0);
    for (let i = 0; i < 8; i++) {
      const a = i / 8 * Math.PI * 2 + Math.PI / 8, r = 8.2;
      setze("marktbude", Math.cos(a) * r, Math.sin(a) * r, (a * 180 / Math.PI + 90 + 360) % 360);
    }
    setze("brunnen", -9, -8, 0);
    /* Brücke über den Bach */
    setze("bruecke", 31.5, -2, 90);
    /* Laternen am Platzrand und an den Straßen */
    for (const [x, y] of [[-12, -11], [12, -11], [-12, 11], [12, 11], [2.8, -28], [-2.4, -42], [2.6, 28], [-2.8, 46], [-28, 5.8], [-44, 3.5], [22, -5.5], [42, 4.4]]) setze("laterne", x, y, 0);
    /* Schneemänner, Bänke */
    setze("schneemann", -16, 15, 30);
    setze("schneemann", 46, 34, 300);
    setze("bank", -12.5, 0, 90);
    setze("bank", 12.5, 0, 270);
    /* Tannenwald im Nordwesten und am Rand, Obstbäume im Südwesten */
    const rng = ST.zufall(4711);
    for (let i = 0; i < 70; i++) {
      const x = -70 + rng() * 44, y = -70 + rng() * 44;
      if (Math.hypot(x + 2, y + 50) < 14) continue;
      if (B.wert(x, y, 0) > 0.1 || B.wert(x, y, 1) > 0.1) continue;
      const o = setze("tanne", x, y, rng() * 360);
      if (o && !SZ.passt(o.typ, o.x, o.y, o.gier, o)) SZ.weg(o);
    }
    /* Obstwiese im Nordosten, zwischen Mühle und Waldrand */
    for (let i = 0; i < 16; i++) {
      const x = 36 + (i % 4) * 7 + rng() * 2, y = -68 + Math.floor(i / 4) * 6.5 + rng() * 2;
      if (B.wert(x, y, 1) > 0.05 || B.wert(x, y, 0) > 0.1) continue;
      const o = setze("obstbaum", x, y, rng() * 360);
      if (o && !SZ.passt(o.typ, o.x, o.y, o.gier, o)) SZ.weg(o);
    }
    /* Waldsaum rund um die Stadt (außerhalb der Bauflächen): die Karte endet
       nicht an einer Kante, sondern im Wald */
    if (hat("tanne")) {
      const G = B.GROESSE / 2;
      for (let i = 0; i < 260; i++) {
        const seite = i % 4, u = rng() * (2 * G + 30) - G - 15, tiefe = 3 + Math.pow(rng(), 0.7) * 22;
        const x = seite === 0 ? u : seite === 1 ? G + tiefe : seite === 2 ? u : -G - tiefe;
        const y = seite === 0 ? -G - tiefe : seite === 1 ? u : seite === 2 ? G + tiefe : u;
        if (Math.abs(x) < G + 2 && Math.abs(y) < G + 2) continue;
        const o = SZ.neu(rng() < 0.82 || !hat("laubbaum") ? "tanne" : "laubbaum", x, y, rng() * 360, { saat: 1 + ((rng() * 9) | 0), rand: true });
        void o;
      }
    }
    for (let i = 0; i < 26; i++) {
      const x = 44 + rng() * 26, y = -30 + rng() * 60;
      if (B.wert(x, y, 1) > 0.05 || B.wert(x, y, 0) > 0.1) continue;
      const o = setze(i % 3 ? "tanne" : "laubbaum", x, y, rng() * 360);
      if (o && !SZ.passt(o.typ, o.x, o.y, o.gier, o)) SZ.weg(o);
    }
  };

  /* Beim Öffnen: gespeicherte Stadt oder Winterhausen */
  ST.stadtAnfang = function (q) {
    let stand = null;
    try { stand = q.get("neu") === "1" ? null : localStorage.getItem("stadt_stand"); } catch (e) {}
    if (stand) {
      try { SZ.ausText(stand); } catch (e) { console.error(e); stand = null; }
    }
    if (!stand) { SZ.jahr = "winter"; SZ.zeit = "abend"; ST.dorfBoden(); ST.dorfBauen(); }
    /* Menschen werden nicht gespeichert – sie kommen bei jedem Öffnen neu */
    if (ST.menschenSetzen && !SZ.objekte.some((o) => ST.MODELLE[o.typ] && ST.MODELLE[o.typ].live)) ST.menschenSetzen();
    if (q.get("jahr")) SZ.jahr = q.get("jahr");
    if (q.get("zeit")) SZ.zeit = q.get("zeit");
    const K = ST.kamera;
    K.x = +(q.get("kx") || 0); K.y = +(q.get("ky") || 6);
    K.s = (+(q.get("s") || 0) || 16) * K.dpr;
  };
})();
