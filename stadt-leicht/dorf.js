/* =====================================================================
   LEICHTE STADT — DAS DORF (Anlage, Spielstand → Gebäude, Schmuck)
   ---------------------------------------------------------------------
   XANDER: „dass wir alle Funktionsweisen von unserer Stadt dahin
   überschreiben … dass alles, was sie schon gemacht haben in ihrer Stadt,
   dass das hier gleichzeitig läuft, nur die neuere Version ist."

   Das Dorf im Spiel (spiel.js) hat 16 feste Bauplätze, benannt nach dem
   Gebäude, das dort zuerst steht (DORF_LAGE), dazu die Wahrzeichen. Die
   leichte Stadt legt diese 16 Plätze als RUNDLING an – die alte deutsche
   Dorfform: Häuser im Kreis um den Anger, die Giebel zur Mitte. Innen
   das Rathaus und sieben Häuser um den Marktplatz, außen acht Höfe an
   der Ringstraße. Wer im Spiel oben rechts gebaut hat, findet sein Haus
   hier auch oben rechts (die Richtung zur Dorfmitte bleibt erhalten).
   Welche Gebäude stehen, wie hoch sie ausgebaut sind und was gerade
   gebaut wird, kommt aus dem Spielstand (spiel_ich) – es ist dieselbe
   Stadt, nur schöner gemalt.
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT, SZ = ST.szene, B = ST.boden;
  const D = (ST.dorf = {});

  /* Spielgebäude (spiel.js DORF, 7516) – Name, Preis, ab Level */
  D.GEBAEUDE = {
    baeckerei: ["Bäckerei", 100, 0], schule: ["Schule", 150, 4], schmiede: ["Schmiede", 120, 0], brauerei: ["Brauerei", 130, 5],
    bibliothek: ["Bibliothek", 160, 6], rathaus: ["Rathaus", 200, 8], muehle: ["Mühle", 90, 3], huehnerstall: ["Hühnerstall", 60, 2],
    kuhstall: ["Kuhstall", 80, 3], krankenhaus: ["Krankenhaus", 140, 5], bergwerk: ["Bergwerk", 180, 7], labor: ["Labor", 250, 10],
    kaserne: ["Kaserne", 140, 4], gasthaus: ["Gasthaus", 150, 6], gefaengnis: ["Gefängnis", 170, 7], flickstube: ["Flickstube", 110, 6]
  };
  /* Bilder je Spielgebäude (vorläufig Fachwerkhäuser in eigener Farbe –
     eigene Modelle für Kuhstall, Bergwerk, Krankenhaus … folgen) */
  D.BILD = { muehle: ["g_muehle", "bau_wassermuehle", [16.2, 21.4], 13] };
  const ERKER = { schule: 1, brauerei: 1, bibliothek: 1, rathaus: 1, krankenhaus: 1, labor: 1, gefaengnis: 1 };
  for (const k in D.GEBAEUDE) if (!D.BILD[k]) D.BILD[k] = ERKER[k] ? ["g_" + k, "bau_fachwerkerker", [8, 12], 13] : ["g_" + k, "bau_fachwerkhaus", [10.4, 9.6], 14.2];
  /* Stufe 1–3: kleiner, mittel, voll (wie im Spiel 0,82 / 0,92 / 1,02) */
  D.STUFE = [0.86, 0.94, 1.0];

  /* Bauplätze im Spiel (spiel.js DORF_LAGE, 9565) – nur die Richtung zählt */
  const LAGE = { muehle: [50, 74], bergwerk: [292, 62], rathaus: [160, 96], schule: [214, 86], baeckerei: [110, 114], kuhstall: [30, 118], krankenhaus: [282, 108],
    schmiede: [222, 138], huehnerstall: [70, 150], brauerei: [126, 166], bibliothek: [186, 164], labor: [272, 182], kaserne: [262, 136], gasthaus: [150, 58], gefaengnis: [240, 64], flickstube: [100, 70] };
  const R_INNEN = 23, R_AUSSEN = 45;
  const rad = (g) => g * Math.PI / 180;
  /* Blickrichtung: die Hausfront (bei Drehung 0 nach Süden) zur Mitte */
  const drehZurMitte = (winkel) => (Math.round((winkel + 90) / 90) % 4 + 4) % 4;

  /* Plätze berechnen: Richtung im Spielbild → Richtung in der Welt
     (Bildschirm x = Welt x − y, Bildschirm y = (x + y) / 2) */
  function plaetzeBerechnen() {
    const richt = {};
    for (const k in LAGE) {
      const a = Math.atan2((LAGE[k][1] - 100) * 1.6, LAGE[k][0] - 160);
      const X = Math.cos(a), Y = Math.sin(a);
      richt[k] = (Math.atan2((2 * Y - X) / 2, (X + 2 * Y) / 2) * 180 / Math.PI + 360) % 360;
      richt[k + "_d"] = Math.hypot((LAGE[k][0] - 160), (LAGE[k][1] - 100) * 1.6);
    }
    const alle = Object.keys(LAGE).sort((a, b) => richt[a + "_d"] - richt[b + "_d"]);
    /* die Mühle gehört an den Bach (Osten, außen) */
    const innen = alle.filter((k) => k !== "muehle").slice(0, 8);
    const aussen = alle.filter((k) => innen.indexOf(k) < 0 && k !== "muehle");
    const P = {};
    const verteilen = (liste, winkel, r) => {
      liste = liste.slice().sort((a, b) => richt[a] - richt[b]);
      let best = 0, bestK = Infinity;
      for (let off = 0; off < winkel.length; off++) {
        let s = 0;
        liste.forEach((k, i) => { const w = winkel[(i + off) % winkel.length]; let d = Math.abs(w - richt[k]) % 360; if (d > 180) d = 360 - d; s += d; });
        if (s < bestK) { bestK = s; best = off; }
      }
      liste.forEach((k, i) => { const w = winkel[(i + best) % winkel.length]; P[k] = { x: Math.cos(rad(w)) * r, y: Math.sin(rad(w)) * r, dreh: drehZurMitte(w), winkel: w }; });
    };
    verteilen(innen, [0, 45, 90, 135, 180, 225, 270, 315], R_INNEN);
    verteilen(aussen, [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5], R_AUSSEN);
    /* Mühle: Ostseite, Wasserrad (bei Drehung 0 nach Osten) am Bach */
    P.muehle = { x: 46 * Math.cos(rad(-22.5)), y: 46 * Math.sin(rad(-22.5)), dreh: 0, winkel: -22.5 };
    return P;
  }
  D.PLAETZE = plaetzeBerechnen();
  /* Wahrzeichen (spiel.js WUNDER): eigene Plätze am Rand */
  D.WUNDER = {
    koelner_dom: { name: "Kölner Dom", x: -70, y: 0, dreh: 1, bild: "w_koelner_dom", fuss: [54.2, 30.4], hoehe: 53 },
    holstentor: { name: "Holstentor", x: 60, y: 52, dreh: 0 },
    brandenburger: { name: "Brandenburger Tor", x: -52, y: 56, dreh: 0 },
    neuschwanstein: { name: "Neuschwanstein", x: -56, y: -56, dreh: 0 },
    fernsehturm: { name: "Fernsehturm", x: 58, y: -60, dreh: 0 }
  };

  /* ---------------- Boden: Anger, Ringstraße, Wege, Bach, See ---------------- */
  function kurve(pts, n) {
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
  function rund(cx, cy, rx, ry, art) {
    for (let y = -ry; y <= ry; y += 0.5) for (let x = -rx; x <= rx; x += 0.5) {
      const d = Math.hypot(x / rx, y / ry) + (ST.hash2(Math.round(x * 2), Math.round(y * 2), 9) - 0.5) * 0.06;
      if (d <= 1) B.pinsel(cx + x, cy + y, 0.45, art, 1);
    }
  }
  D.boden = function () {
    B.leeren();
    /* Anger mit Pflaster */
    rund(0, 0, 12.5, 12.5, 0);
    /* Ringstraße */
    const ring = []; for (let i = 0; i <= 72; i++) { const a = i / 72 * Math.PI * 2; ring.push([Math.cos(a) * 34, Math.sin(a) * 34]); }
    B.linie(ring, 1.6, 0, 1);
    /* Gassen vom Anger zum Ring zwischen den inneren Häusern */
    for (let i = 0; i < 8; i++) { const a = rad(22.5 + i * 45); B.linie([[Math.cos(a) * 12, Math.sin(a) * 12], [Math.cos(a) * 34, Math.sin(a) * 34]], 1.15, 0, 1); }
    /* Landstraßen hinaus: Norden Kirche, Süden Bahnhof, Westen Dom, Osten Brücke */
    B.linie(kurve([[0, -34], [1.5, -44], [0, -52]], 8), 1.6, 0, 1);
    B.linie(kurve([[0, 34], [-1.5, 44], [0, 55]], 8), 1.7, 0, 1);
    B.linie(kurve([[-34, 0], [-44, 1.5], [-54, 0]], 8), 1.5, 0, 1);
    B.linie(kurve([[34, 0], [44, -1], [54, 0], [70, 2]], 8), 1.5, 0, 1);
    rund(0, -54, 9, 6, 0);           // Kirchplatz
    rund(0, 53, 10, 4, 0);           // Bahnhofsvorplatz
    rund(-51, 0, 4, 8, 0);           // Domplatz
    /* Vorgärten (Rasen) vor den Häusern zur Mitte hin */
    for (const k in D.PLAETZE) {
      const p = D.PLAETZE[k], w = rad(p.winkel), r = Math.hypot(p.x, p.y);
      if (k === "muehle") continue;
      const vx = -Math.cos(w), vy = -Math.sin(w), d = r < 30 ? 7.5 : 8;
      rund(p.x + vx * d, p.y + vy * d, 2.6, 2.6, 3);
    }
    /* Bach von Nordosten am Mühlrad vorbei, unter der Brücke durch, in den See */
    const m = D.PLAETZE.muehle;
    const bach = kurve([[78, -100], [66, -70], [58, -44], [m.x + 11.5, m.y - 6], [m.x + 11.5, m.y + 8], [57, 0], [58, 18], [62, 36], [64, 46]], 14);
    B.linie(bach, (i, k) => 1.3 + 0.5 * ST.hash2(i, Math.round(k * 4), 5), 1, 1);
    rund(66, 56, 13, 10, 1);
    /* Beete an den Höfen draußen */
    rund(-44, -40, 3.5, 2.5, 2); rund(44, 40, 3.5, 2.5, 2);
  };

  /* ---------------- Kulisse und Schmuck ---------------- */
  function rng(s) { return ST.zufall(s); }
  D.kulisse = function () {
    const liste = [];
    const setze = (bild, x, y, dreh, x2) => { liste.push(Object.assign({ art: "kulisse", bild: bild, x: x, y: y, dreh: dreh || 0, fuss: [2, 2], hoehe: 4 }, x2 || {})); };
    setze("k_kirche", 0, -65, 0, { fuss: [46, 22], hoehe: 37, name: "Dorfkirche" });
    setze("k_bahnhof", 0, 64, 2, { fuss: [30, 16.6], hoehe: 13, name: "Bahnhof" });
    setze("d_bruecke", 57, 0.5, 1, { fuss: [3.9, 11.2], hoehe: 2.7 });
    /* Laternen an der Ringstraße und am Anger */
    for (let i = 0; i < 16; i++) { const a = rad(11.25 + i * 22.5); setze("d_laterne", Math.cos(a) * 31.6, Math.sin(a) * 31.6, 0, { fuss: [0.8, 0.8], hoehe: 4.4, deko: 1 }); }
    for (let i = 0; i < 4; i++) { const a = rad(45 + i * 90); setze("d_laterne", Math.cos(a) * 12.8, Math.sin(a) * 12.8, 0, { fuss: [0.8, 0.8], hoehe: 4.4, deko: 1 }); }
    /* Bänke am Anger */
    for (let i = 0; i < 4; i++) { const a = rad(i * 90); setze("d_bank", Math.cos(a) * 11.2, Math.sin(a) * 11.2, (drehZurMitte(i * 90) + 2) & 3, { fuss: [1.9, 0.75], hoehe: 0.9, deko: 1 }); }
    /* Winter: Christbaum und Markt auf dem Anger; sonst der Brunnen */
    setze("d_weihnachtsbaum", 0, 0, 0, { fuss: [7.4, 7.4], hoehe: 21.8, nurWinter: 1, jahr: "winter", deko: 1 });
    setze("d_brunnen", 0, 0, 0, { fuss: [4.6, 4.6], hoehe: 5.4, jahrNicht: "winter", deko: 1 });
    for (let i = 0; i < 6; i++) { const a = rad(30 + i * 60); setze("d_marktbude", Math.cos(a) * 7.4, Math.sin(a) * 7.4, drehZurMitte(i * 60 + 30), { fuss: [4, 3.2], hoehe: 4.2, nurWinter: 1, jahr: "winter", deko: 1 }); }
    setze("d_pyramide", 54, 14, 0, { fuss: [9.2, 9.2], hoehe: 13, nurWinter: 1, jahr: "winter", deko: 1 });
    setze("d_krippe", -8, -52, 0, { fuss: [7.2, 5.4], hoehe: 5.2, nurWinter: 1, jahr: "winter", deko: 1 });
    for (const [x, y] of [[-16, 30], [28, -28], [40, 26], [-30, -18]]) setze("d_schneemann", x, y, 0, { fuss: [1.3, 1.3], hoehe: 1.9, nurWinter: 1, jahr: "winter", deko: 1 });
    /* Wald ringsum: die Karte endet nicht an einer Kante */
    const r = rng(4711), G = B.GROESSE / 2;
    for (let i = 0; i < 150; i++) {
      const seite = i % 4, u = r() * (2 * G + 30) - G - 15, tief = 4 + Math.pow(r(), 0.7) * 22;
      const x = seite === 0 ? u : seite === 1 ? G + tief : seite === 2 ? u : -G - tief;
      const y = seite === 0 ? -G - tief : seite === 1 ? u : seite === 2 ? G + tief : u;
      const v = r(), bild = v < 0.7 ? "n_tanne" + ((r() * 3) | 0) : "n_laubbaum" + ((r() * 3) | 0);
      liste.push({ art: "natur", bild: bild, x: x, y: y, dreh: 0, fuss: [3.5, 3.5], hoehe: 13, rand: 1 });
    }
    /* Bäume zwischen den Höfen und eine Obstwiese im Nordosten */
    const frei = (x, y, abst) => {
      for (const k in D.PLAETZE) { const p = D.PLAETZE[k]; if (Math.hypot(p.x - x, p.y - y) < (k === "muehle" ? 13 : 9) + abst) return false; }
      for (const o of liste) if (!o.rand && Math.hypot(o.x - x, o.y - y) < Math.max(o.fuss[0], o.fuss[1]) / 2 + abst) return false;
      if (B.wert(x, y, 0) > 0.05 || B.wert(x, y, 1) > 0.05) return false;
      return true;
    };
    for (let i = 0; i < 120 && liste.length < 260; i++) {
      const a = r() * Math.PI * 2, rr = 38 + r() * 30, x = Math.cos(a) * rr, y = Math.sin(a) * rr;
      if (Math.abs(x) > G - 2 || Math.abs(y) > G - 2 || !frei(x, y, 2.5)) continue;
      const bild = r() < 0.55 ? "n_tanne" + ((r() * 3) | 0) : "n_laubbaum" + ((r() * 3) | 0);
      liste.push({ art: "natur", bild: bild, x: x, y: y, dreh: 0, fuss: [3.5, 3.5], hoehe: 13 });
    }
    for (let i = 0; i < 12; i++) {
      const x = 22 + (i % 4) * 6.5 + r() * 1.5, y = -66 + Math.floor(i / 4) * 6 + r() * 1.5;
      if (!frei(x, y, 1.5)) continue;
      liste.push({ art: "natur", bild: "n_obstbaum" + (i % 2), x: x, y: y, dreh: 0, fuss: [3, 3], hoehe: 6 });
    }
    return liste;
  };

  /* ---------------- Spielstand → Gebäude ---------------- */
  /* ich: Antwort von spiel_ich (dorf, dorf_plan, baustellen, volk) */
  D.aufbauen = function (ich, eigeneDeko) {
    SZ.objekte = []; SZ.naechsteId = 1;
    const dorf = (ich && ich.dorf) || {};
    const plan = (ich && ich.dorf_plan) || {};
    const platzVon = (k) => (plan.platz && plan.platz[k]) || k;
    const bauen = {};
    for (const b of (ich && (ich.baustellen || (ich.volk && ich.volk.baustellen))) || []) bauen[b.was] = b;
    const jetzt = Date.now();
    const extra = (ST.leicht && ST.leicht.lage) || {};
    for (const k in D.GEBAEUDE) {
      const st = (dorf[k] && dorf[k].stufe) || 0, b = bauen[k];
      if (!st && !b) continue;
      const p = D.PLAETZE[platzVon(k)] || D.PLAETZE[k];
      const bild = D.BILD[k];
      let bau = null;
      if (b) {
        const dauer = (b.dauer || 120) * 1000, bis = Date.parse(b.bis);
        const anteil = isFinite(bis) ? Math.max(0, Math.min(1, 1 - (bis - jetzt) / dauer)) : 0.5;
        /* Ausbau eines stehenden Hauses: nur noch Gerüst und Kran (späte Phase) */
        bau = { p: st ? Math.max(0.72, anteil) : anteil, bis: bis, dauer: dauer, stufe: b.stufe };
      }
      const dreh = extra[k] && extra[k].dreh != null ? extra[k].dreh : p.dreh;
      SZ.neu({ art: "haus", spiel: k, name: D.GEBAEUDE[k][0], bild: bild[0], bauBild: bild[1], x: p.x, y: p.y, dreh: dreh,
        stufe: D.STUFE[Math.max(0, Math.min(2, (st || 1) - 1))], stufenZahl: st, fuss: bild[2], hoehe: bild[3], bau: bau });
    }
    const wunder = (ich && ich.volk && ich.volk.wunder) || {};
    for (const k in D.WUNDER) {
      const w = D.WUNDER[k];
      if (!wunder[k] || !w.bild) continue;
      SZ.neu({ art: "wunder", spiel: k, name: w.name, bild: w.bild, x: w.x, y: w.y, dreh: w.dreh, fuss: w.fuss, hoehe: w.hoehe });
    }
    for (const o of D.kulisse()) SZ.neu(o);
    for (const o of eigeneDeko || []) SZ.neu(Object.assign({ art: "eigen" }, o));
    D.jahrFiltern();
  };
  /* Winterdinge nur im Winter, Brunnen nur ohne Winter */
  D.jahrFiltern = function () {
    for (const o of SZ.objekte) o.versteckt = (o.jahr && o.jahr !== SZ.jahr) || (o.jahrNicht && o.jahrNicht === SZ.jahr);
    SZ.geaendert();
  };

  /* Beispielstadt (Vorschau ohne Anmeldung, ?demo=1): alles gebaut,
     einiges im Bau – so sieht man jede Phase */
  D.beispiel = function () {
    const dorf = {}, t = Date.now(), iso = (ms) => new Date(t + ms).toISOString();
    const st = { rathaus: 3, baeckerei: 3, schule: 2, gasthaus: 3, flickstube: 1, schmiede: 2, gefaengnis: 1, bibliothek: 2, brauerei: 3, kaserne: 2, muehle: 3, huehnerstall: 1, krankenhaus: 2, kuhstall: 2 };
    for (const k in st) dorf[k] = { stufe: st[k], lp: 20 * st[k] };
    return {
      id: "beispiel", name: "Beispiel", dorf_name: "Winterhausen", dorf: dorf, dorf_plan: {},
      baustellen: [{ was: "labor", stufe: 1, start: iso(-50e3), bis: iso(70e3), dauer: 120 }, { was: "flickstube", stufe: 2, start: iso(-200e3), bis: iso(100e3), dauer: 300 }],
      volk: { wunder: { koelner_dom: { stufe: 1 } } }
    };
  };
})();
