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
  /* FASSUNG 809 — XANDER: „Vergiss die Windmühle nicht. Ich will den selben Look haben": die Windmühle des alten Dorfs
     (Flügel drehen sich, windmuehle.js) statt der Wassermühle */
  D.BILD = { muehle: ["g_windmuehle", "bau_windmuehle", [13, 13], 22] };
  const ERKER = { schule: 1, brauerei: 1, bibliothek: 1, rathaus: 1, krankenhaus: 1, labor: 1, gefaengnis: 1 };
  /* FASSUNG 795 — eigene Modelle (Grundfläche und Höhe wie im Modell) */
  const EIGEN = { kuhstall: [[11, 9], 10], huehnerstall: [[8, 7], 4], rathaus: [[12, 10], 17], schule: [[12, 9], 13],
    kaserne: [[12, 10], 12], gefaengnis: [[9, 9], 15], bergwerk: [[12, 12], 16],
    brauerei: [[12, 10], 15], bibliothek: [[12, 10], 13], krankenhaus: [[12, 10], 13], labor: [[10, 10], 12] };
  for (const k in EIGEN) D.BILD[k] = ["g_" + k, "bau_" + k, EIGEN[k][0], EIGEN[k][1]];
  /* FASSUNG 818 — XANDER: „ich möchte dieses höhlenartige haben dass man instinktiv weiß da geht's in das Bergwerk
     hinein". Das Bergwerk ist wieder ein Felshügel mit Stolleneingang, Gleis und Lore (Modell bergstollen, 13 × 13 m);
     das Fördergerüst steht klein oben auf der Kuppe. */
  /* FASSUNG 829 — hinter dem Hügel steigt ein Felsberg an (Modell bergstollen): Höhe 16 m statt 12 m */
  D.BILD.bergwerk = ["g_bergstollen", "bau_bergstollen", [13, 13], 16];
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
    /* FASSUNG 795 — das Holstentor stand mitten im See (66, 56) */
    holstentor: { name: "Holstentor", x: 38, y: 64, dreh: 0, bild: "w_holstentor", fuss: [18, 8], hoehe: 15.2 },
    brandenburger: { name: "Brandenburger Tor", x: -52, y: 56, dreh: 0, bild: "w_brandenburger", fuss: [26, 8], hoehe: 11.8 },
    neuschwanstein: { name: "Neuschwanstein", x: -56, y: -56, dreh: 0, bild: "w_neuschwanstein", fuss: [28, 18], hoehe: 24 },
    fernsehturm: { name: "Fernsehturm", x: 58, y: -60, dreh: 0, bild: "w_fernsehturm", fuss: [16, 16], hoehe: 46 }
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
    /* FASSUNG 799 — XANDER: „unseren See auch ein kleines bisschen größer machen also so dass man unten die Zunge
       sieht, wie wir es jetzt auch haben … aber dass der See halt nach unten wenn man bisschen runtergeht mit der
       Karte noch größer ist und man dann sieht, wie man mit Wassertreter darauf fahren kann, die Leute das Spaß
       haben oder baden". Die alte Bucht bleibt als Zunge oben; darunter öffnet sich der See in den Rand hinein. */
    /* Hals: schmal aus der Zunge schräg nach unten (Blickrichtung +x+y), dann der große See */
    kurve([[70, 61], [75, 66], [81, 70]], 5).forEach((q) => rund(q[0], q[1], 5.5, 4.5, 1));
    /* Nicht bis an den Kartenrand (±112 m): dort wiederholt die Grafik die letzte Zeile als Streifen. */
    const seeLauf = kurve([[80, 71], [86, 79], [87, 89], [80, 98]], 6);
    seeLauf.forEach((q, i) => {
      const t = i / (seeLauf.length - 1), w = 8 + Math.sin(Math.min(1, t * 1.25) * Math.PI) * 12 + (ST.hash2(i, 3, 17) - 0.5) * 3;
      rund(q[0] + (ST.hash2(i, 5, 17) - 0.5) * 3, q[1], w, w * 0.8, 1);
    });
    rund(68, 90, 8, 6, 1);           // flache Badebucht im Westen
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
      /* FASSUNG 799: der See reicht jetzt in den Rand – dort wachsen keine Bäume im Wasser */
      if (B.wert(x, y, 1) > 0.02 || B.wert(x + 2, y, 1) > 0.02 || B.wert(x - 2, y, 1) > 0.02 || B.wert(x, y - 2, 1) > 0.02) continue;
      liste.push({ art: "natur", bild: bild, x: x, y: y, dreh: 0, fuss: [3.5, 3.5], hoehe: 13, rand: 1 });
    }
    /* Bäume zwischen den Höfen und eine Obstwiese im Nordosten */
    const frei = (x, y, abst) => {
      for (const k in D.PLAETZE) { const p = D.PLAETZE[k]; if (Math.hypot(p.x - x, p.y - y) < (k === "muehle" ? 13 : 9) + abst) return false; }
      /* FASSUNG 795 — keine Bäume auf den Plätzen der Wahrzeichen */
      for (const k in D.WUNDER) { const w = D.WUNDER[k]; if (w.fuss && Math.hypot(w.x - x, w.y - y) < Math.max(w.fuss[0], w.fuss[1]) / 2 + 2 + abst) return false; }
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
    /* FASSUNG 803 — XANDER: „vielleicht so ein kleines Bootshaus für den Verleih vom Wassertreter".
       Am Westufer über der Badebucht; der Steg (6 m nach Osten) reicht bis x ≈ 65,5 ins Wasser, dort legen
       die Schwanenboote an (boote.js). Erst nach den Bäumen gesetzt, damit der Wald gleich bleibt. */
    setze("d_bootshaus", 60.5, 85.5, 0, { fuss: [10, 3.4], hoehe: 4, name: "Bootsverleih" });
    return liste;
  };

  /* =====================================================================
     FASSUNG 807 — VORLAGE 1: DIE ORIGINALKARTE (das alte gemalte Dorf)
     XANDER: „die Maps die Grundwert Brauch ist vorrangig" und „denk an das Layout der Originalmap. Die Leute sollen sich
     sofort zurechtfinden … dass ich die Eisenbahn wieder hinten lang fahren [sehe]". Die Bauplätze kommen aus dem alten
     Dorfbild (spiel.js DORF_LAGE, 320 × 200): dieselbe Richtung und derselbe Abstand im Bild, umgerechnet in die Welt
     (Bildschirm x = Welt x − y, Bildschirm y = (x + y) / 2). Mühle links mit Bach, Rathaus mit Marktplatz in der Mitte,
     Bergwerk hinten rechts, Fluss vom Markt zum See vorn, Felder vorn links und rechts, die Bahn hinten entlang mit dem
     Bahnhof. Wege verbinden alle Häuser mit dem Markt (kürzestes Wegenetz, leicht geschwungen). Der Rundling bleibt mit
     ?vorlage=rundling erreichbar.
     ===================================================================== */
  D.VORLAGE = (function () { try { return new URLSearchParams(location.search).get("vorlage") || "altdorf"; } catch (e) { return "altdorf"; } })();
  if (D.VORLAGE === "altdorf") (function () {
    const BILD = { cx: 160, cy: 118, a: 0.47, b: 0.40 };
    const welt = (px, py) => { const u = (px - BILD.cx) * BILD.a / Math.SQRT1_2, v = (py - BILD.cy) * BILD.b / (Math.SQRT1_2 * 0.5); return [(u + v) / 2, (v - u) / 2]; };
    const MARKT = [-1, -1];
    /* Blickrichtung aus einem Winkel (0° = +x): dreh 0 schaut nach +y, 1 nach −x, 2 nach −y, 3 nach +x – in halben Schritten (45°) */
    const drehNach = (dx, dy) => { const phi = Math.atan2(dy, dx) * 180 / Math.PI; return (((Math.round((phi - 90) / 45) / 2) % 4) + 4) % 4; };
    const P = {};
    for (const k in LAGE) {
      const w = welt(LAGE[k][0], LAGE[k][1]);
      P[k] = { x: +w[0].toFixed(1), y: +w[1].toFixed(1), dreh: drehNach(MARKT[0] - w[0], MARKT[1] - w[1]), winkel: Math.atan2(w[1], w[0]) * 180 / Math.PI };
    }
    /* Rathaus schaut auf den Markt, die Mühle mit dem Rad (Osten) an den Bach, das Bergwerk nach vorn.
       FASSUNG 829 — XANDER: „du hast das Bergwerk nicht mit der Öffnung zu uns gestellt". dreh 0 zeigte das Mundloch
       schräg nach links (Bild _f_0); dreh 3,5 zeigt es in der Grundansicht genau zum Betrachter (Bild _f_315, wie bei
       den Häusern, die unten alle auf 3,5 gesetzt werden). */
    P.muehle.dreh = 0; P.bergwerk.dreh = 3.5;
    /* FASSUNG 807 — XANDER: „du hast vergessen das Döbelner Rathaus weiterzubauen". Das Rathaus der Originalkarte ist das
       Döbelner Rathaus vom Obermarkt (Modell rathaus_doebeln, 44 × 21 m), auf 70 % gesetzt, damit es zwischen Gasthaus,
       Schule und Bäckerei passt; es schaut nach vorn auf den Markt. */
    /* FASSUNG 819 — Grundfläche = Umriss des Stern-Grundrisses (Modell grund 41 × 33,1 m), mit D.MASS 0,7 in der Welt */
    D.BILD.rathaus = ["w_rathaus_doebeln", "bau_rathaus", [41, 33.1], 22.8];
    D.MASS = { rathaus: 0.7 };
    P.rathaus = { x: -12.4, y: -14, dreh: 0, winkel: P.rathaus.winkel };
    /* FASSUNG 808 — XANDER: „das soll genau das selbe Bild sein … man soll das direkt wieder erkennen können". Im alten
       Bild schauen alle Häuser den Betrachter an – hier auch (dreh 3,5 = zum Betrachter, die Häuser haben acht Winkel);
       nur die Mühle behält ihr Rad am Bach. */
    for (const k in P) if (k !== "muehle") P[k].dreh = 3.5;
    /* FASSUNG 809 — XANDER: „wenn man vor dem Brunnen steht … guck mal genau auf den Eingang zu, dann ist dieser dominante
       Teil seitlich nach rechts". Das Portal im Turm schaut zum Brunnen, der Staffelgiebel-Flügel geht nach rechts weg. */
    /* FASSUNG 819 — XANDER (Funk 206): „im Prinzip ist das ganze wie ein dreizackiger Stern … in der Draufsicht … das
       seitliche rechts vom Eingang abgehend und das was hinter dem Turm ist ein perfekter rechter Winkel wie ein L und das
       einzige was schräg ist ist das seitliche Schiff". Das Modell hat jetzt diesen Grundriss (Turm mit Portal vorn,
       Flügel A nach rechts, B nach hinten, C schräg nach vorn links). Es schaut wie alle Häuser zum Betrachter (dreh 3,5)
       und steht so, dass das Portal genau hinter dem Brunnen liegt (Walkie 305: „vor dem Brunnen siehst du praktisch den
       Eingang"): Portalmitte BRUNNEN_ABST m hinter der Brunnenmitte. Grundriss (Modellmeter, mittig wie das Bild; die
       Sonde pruefe-819-rathaus-form.js prüft, dass er zum Modell passt): für Wege, Bäume und die Leute vor dem Portal. */
    D.GRUNDRISS = { rathaus: {
      teile: [
        [[-3.92, 10.64], [1.28, 10.64], [1.28, 5.44], [-3.92, 5.44]],                                   // Turm
        [[1.28, 10.04], [13.28, 10.04], [13.28, -2.36], [1.28, -2.36]],                                 // A: Giebelbau (Stufengiebel vorn)
        [[13.28, 9.04], [20.48, 9.04], [20.48, 0.04], [13.28, 0.04]],                                   // A: Haus zur Seite (Zeltdach)
        [[-5.32, 5.44], [1.28, 5.44], [1.28, -16.56], [-5.32, -16.56]],                                 // B (FASSUNG 829: 3,2 m schmaler, s. Modell)
        [[-3.92, 10.04], [-12.52, 16.06], [-13.59, 16.53], [-14.76, 16.56], [-15.85, 16.14], [-16.7, 15.33],
          [-20.48, 9.92], [-14.09, 5.44], [-5.32, 5.44], [-3.92, 5.44]]                                  // C
      ],
      portal: [-1.32, 10.64]
    } };
    D.BRUNNEN = [-2.5, -7.5];
    const BRUNNEN_ABST = 5.6;
    P.rathaus.dreh = 3.5;
    {
      const m = D.MASS.rathaus, a = P.rathaus.dreh * Math.PI / 2, c = Math.cos(a), s = Math.sin(a), pt = D.GRUNDRISS.rathaus.portal;
      const pw = [D.BRUNNEN[0] - BRUNNEN_ABST / Math.SQRT2, D.BRUNNEN[1] - BRUNNEN_ABST / Math.SQRT2];
      P.rathaus.x = +(pw[0] - (pt[0] * c - pt[1] * s) * m).toFixed(2); P.rathaus.y = +(pw[1] - (pt[0] * s + pt[1] * c) * m).toFixed(2);
    }
    /* Grundriss eines Hauses in der Welt (gedreht wie SZ.ecken, mit Maßstab), sonst null */
    D.teileWelt = function (k, p, stufe) {
      const G = D.GRUNDRISS && D.GRUNDRISS[k]; if (!G) return null;
      p = p || P[k]; const m = stufe || (D.MASS || {})[k] || 1, a = (p.dreh || 0) * Math.PI / 2, c = Math.cos(a), s = Math.sin(a);
      return G.teile.map((poly) => poly.map(([x, y]) => [p.x + (x * c - y * s) * m, p.y + (x * s + y * c) * m]));
    };
    /* Portalpunkt d Meter vor der Tür (Rathaus: vor dem Turmportal) */
    D.tuer = function (k, d) {
      const G = D.GRUNDRISS && D.GRUNDRISS[k], p = P[k]; if (!G) return null;
      const m = (D.MASS || {})[k] || 1, a = (p.dreh || 0) * Math.PI / 2, c = Math.cos(a), s = Math.sin(a), x = G.portal[0], y = G.portal[1] + d / m;
      return [p.x + (x * c - y * s) * m, p.y + (x * s + y * c) * m];
    };
    /* Abstand eines Punkts vom Rand eines Vielecks (innen negativ) */
    const abstPoly = (p, poly) => {
      let innen = false, dd = Infinity;
      for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        const [xi, yi] = poly[i], [xj, yj] = poly[j];
        if ((yi > p[1]) !== (yj > p[1]) && p[0] < (xj - xi) * (p[1] - yi) / (yj - yi) + xi) innen = !innen;
        const dx = xj - xi, dy = yj - yi, l2 = dx * dx + dy * dy || 1, t = Math.max(0, Math.min(1, ((p[0] - xi) * dx + (p[1] - yi) * dy) / l2));
        dd = Math.min(dd, Math.hypot(p[0] - xi - dx * t, p[1] - yi - dy * t));
      }
      return innen ? -dd : dd;
    };
    /* Punkt in einem der Flügel (mit Rand in Metern)? */
    D.imGrundriss = function (k, x, y, rand) {
      const T = D.teileWelt(k);
      return !!T && T.some((poly) => abstPoly([x, y], poly) < (rand || 0));
    };
    /* Kreise, die ein (längliches, konvexes) Vieleck bedecken: längs der längsten Kante in Stücke so lang wie breit */
    const kreiseUm = (poly, rand) => {
      let best = null;
      for (let i = 0; i < poly.length; i++) { const a = poly[i], b = poly[(i + 1) % poly.length], l = Math.hypot(b[0] - a[0], b[1] - a[1]); if (!best || l > best[2]) best = [a, b, l]; }
      const ex = (best[1][0] - best[0][0]) / best[2], ey = (best[1][1] - best[0][1]) / best[2];
      let s0 = Infinity, s1 = -Infinity, t0 = Infinity, t1 = -Infinity;
      for (const [x, y] of poly) { const s = x * ex + y * ey, t = -x * ey + y * ex; s0 = Math.min(s0, s); s1 = Math.max(s1, s); t0 = Math.min(t0, t); t1 = Math.max(t1, t); }
      const L = s1 - s0, B2 = t1 - t0, n = Math.max(1, Math.ceil(L / B2 - 0.2)), tm = (t0 + t1) / 2, aus = [];
      for (let i = 0; i < n; i++) { const s = s0 + L * (i + 0.5) / n; aus.push([s * ex - tm * ey, s * ey + tm * ex, Math.hypot(L / n / 2, B2 / 2) * 0.9 + rand]); }
      return aus;
    };
    D.PLAETZE = P;
    /* Bildachsen (u = x − y nach rechts, v = x + y nach unten) → Welt */
    const vw = (u, v) => [(u + v) / 2, (v - u) / 2];
    const bild = (pts) => pts.map((q) => welt(q[0], q[1]).map((z) => +z.toFixed(1)));
    /* FASSUNG 808 — „oben war die Horizontlinie … ist der Zug an diesem Rand entlanggefahren an dem oberen Bildrand". Die
       Horizontlinie liegt quer über dem Bild (v = −100); dahinter stehen die Alpen als Spielgrenze (D.hintergrund). Die
       Bahn läuft kurz davor waagerecht durchs Bild, leicht gewellt wie der alte Wiesenrand, und an beiden Seiten hinaus. */
    D.HORIZONT = -100;
    const bahnV = (u) => -86 + 2.2 * Math.sin(u / 37 + 0.6);
    D.bahnV = bahnV;
    D.BAHN = []; for (let u = -140; u <= 140; u += 4) D.BAHN.push(vw(u, bahnV(u)).map((z) => +z.toFixed(2)));
    D.BAHN_Y = null;
    /* Bahnhof wie im alten Bild zwischen Flickstube und Gasthaus (Bild x ≈ 98), hinter dem Gleis, Bahnsteig zum Gleis */
    const uHalt = (98 - BILD.cx) * BILD.a / Math.SQRT1_2;
    D.BAHN_HALT = vw(uHalt, bahnV(uHalt)).map((z) => +z.toFixed(2));
    D.BAHNHOF = vw(uHalt, bahnV(uHalt) - 15.2);
    /* Gleisnähe in Metern quer zur Strecke */
    const vonBahn = (x, y) => Math.abs(x + y - bahnV(x - y)) / Math.SQRT2;
    D.vonBahn = vonBahn;
    /* FASSUNG 808 — Wahrzeichen auf den Plätzen des alten Dorfs (spiel.js WUNDER_PLAETZE) – „wo ich mein Berliner
       Fernsehturm stehen habe". Wer einen Platz gewählt hat (volk.wunder_platz), findet es dort; sonst der nächste freie
       Platz in derselben Reihenfolge wie im alten Dorf. Die Wahrzeichen sind auf die Größe des alten Bilds gesetzt. */
    /* (Platz 2 ein Stück nach rechts: die neuen Häuser sind breiter als die alten Zeichnungen, sonst stünde das Tor im Labor) */
    D.WUNDER_PLAETZE = [[84, 197], [310, 199], [16, 160], [240, 119], [180, 138]];
    D.WUNDER_REIHE = ["holstentor", "brandenburger", "koelner_dom", "neuschwanstein", "fernsehturm"];
    D.WUNDER = {
      koelner_dom: { name: "Kölner Dom", bild: "w_koelner_dom", fuss: [54.2, 30.4], hoehe: 53, mass: 0.36 },
      holstentor: { name: "Holstentor", bild: "w_holstentor", fuss: [18, 8], hoehe: 15.2, mass: 0.9 },
      brandenburger: { name: "Brandenburger Tor", bild: "w_brandenburger", fuss: [26, 8], hoehe: 11.8, mass: 0.8 },
      neuschwanstein: { name: "Neuschwanstein", bild: "w_neuschwanstein", fuss: [28, 18], hoehe: 24, mass: 0.62 },
      fernsehturm: { name: "Fernsehturm", bild: "w_fernsehturm", fuss: [16, 16], hoehe: 46, mass: 0.8 }
    };
    D.wunderPlaetze = function (volk) {
      const fest = (volk && volk.wunder_platz) || {}, hat = (volk && volk.wunder) || {}, belegt = {}, aus = {};
      for (const k of D.WUNDER_REIHE) { const p = fest[k]; if (hat[k] && p != null && p >= 0 && p < D.WUNDER_PLAETZE.length && !belegt[p]) { belegt[p] = k; aus[k] = +p; } }
      for (const k of D.WUNDER_REIHE) { if (!hat[k] || aus[k] != null) continue; for (let i = 0; i < D.WUNDER_PLAETZE.length; i++) if (!belegt[i]) { belegt[i] = k; aus[k] = i; break; } }
      return aus;
    };
    D.wunderSetzen = function (volk) {
      const pl = D.wunderPlaetze(volk);
      for (const k in D.WUNDER) {
        const w = D.WUNDER[k], i = pl[k] != null ? pl[k] : D.WUNDER_REIHE.indexOf(k), q = D.WUNDER_PLAETZE[i];
        const f = [w.fuss[0] * w.mass, w.fuss[1] * w.mass], hinten = (f[0] + f[1]) / 2 * 0.7;
        /* der alte Platz ist der Fußpunkt vorn: die Mitte liegt ein Stück dahinter */
        const c = welt(q[0], q[1]), v = c[0] + c[1] - hinten, u = c[0] - c[1];
        const p = vw(u, v);
        Object.assign(w, { x: +p[0].toFixed(1), y: +p[1].toFixed(1), dreh: 3.5, platz: i, fussS: f, steht: !!(volk && volk.wunder && volk.wunder[k]) });
      }
    };
    D.wunderSetzen(null);
    D.wunderSig = Object.keys(D.WUNDER).map((k) => D.WUNDER[k].steht ? D.WUNDER[k].platz : "-").join(",");
    /* Wasser: der Fluss wie im alten Bild – er entspringt oben zwischen Flickstube und Gasthaus, läuft links am Rathaus
       und am Markt vorbei, schlängelt sich zwischen Brauerei und Bibliothek hindurch und mündet unten in den See. */
    const m = P.muehle;
    D.FLUSS = bild([[131, 66], [130, 80], [130, 96], [129, 108], [134, 122], [148, 134], [156, 148], [154, 162], [160, 176], [178, 184], [198, 187], [212, 190]]);
    D.QUELLE = D.FLUSS[0];
    /* Mühlbach: Quelle hinter der Mühle, am Wasserrad vorbei, dann links aus dem Bild (Platz für die Weiden am Kuhstall) */
    D.MUEHLBACH = [[m.x + 6, m.y - 30], [m.x + 11.5, m.y - 6], [m.x + 11.5, m.y + 8], [m.x + 5, m.y + 17], [m.x - 10, m.y + 27], [m.x - 32, m.y + 44]];
    /* FASSUNG 808 — „unten, wo bei uns nur so ein kleiner See ist … wenn man weiter runtergeht, dass der See sich eröffnet".
       Oben im Bild nur die Zunge des Sees (wie im alten Bild unten, rechts der Mitte); wer weiter hinunterscrollt, sieht
       ihn sich öffnen – mit Badebucht und Bootsverleih. Der ganze See ist gegenüber Fassung 803 verschoben
       (D.SEE_VERSATZ, auch für boote.js). */
    const OFF = [-4, -41];
    D.SEE_VERSATZ = OFF;
    const see = (x, y) => [x + OFF[0], y + OFF[1]];
    D.BOOTSHAUS = see(60.5, 85.5);
    /* Wegenetz: kürzeste Verbindungen (Prim) zwischen Markt, Hausvorplätzen, Bahnhof, Bootshaus, Wahrzeichen */
    const vor = (p, d) => { const r = (p.dreh * 90 + 90) * Math.PI / 180; return [p.x + Math.cos(r) * d, p.y + Math.sin(r) * d]; };
    D.wegeBauen = function () {
      const ziele = [MARKT.slice()];
      /* FASSUNG 819 — zum Rathaus führt der Weg vor das Turmportal (D.tuer), nicht zur Mitte des Grundrisses */
      for (const k in P) ziele.push(D.tuer(k, 2.2) || vor(P[k], k === "muehle" ? 9 : 8));
      ziele.push(see(58, 82));   // (zum Bahnhof führt die Pferdebahn-Straße)
      for (const k in D.WUNDER) { const w = D.WUNDER[k]; if (w.steht) ziele.push(vor(w, (w.fussS[0] + w.fussS[1]) / 4 + 3)); }
      const drin = [0], kanten = [];
      while (drin.length < ziele.length) {
        let best = null;
        for (const i of drin) for (let j = 0; j < ziele.length; j++) {
          if (drin.indexOf(j) >= 0) continue;
          const d = Math.hypot(ziele[i][0] - ziele[j][0], ziele[i][1] - ziele[j][1]);
          if (!best || d < best[2]) best = [i, j, d];
        }
        drin.push(best[1]); kanten.push(best);
      }
      /* FASSUNG 808 — Wege gehen um die Häuser herum, nicht hindurch (Hindernisse: Häuser, Wahrzeichen, Bahnhof als Kreise) */
      const hind = [];
      for (const k in P) {
        /* FASSUNG 819 — der Stern-Grundriss des Rathauses: je Flügel eine Kette von Kreisen längs der Achse statt eines
           großen Kreises (der läge über dem Platz vor dem Portal) */
        const T = D.teileWelt(k);
        if (T) { for (const poly of T) hind.push(...kreiseUm(poly, 1.0)); continue; }
        const f = D.BILD[k][2], m = (D.MASS || {})[k] || 1; hind.push([P[k].x, P[k].y, Math.hypot(f[0], f[1]) / 2 * m * 0.8 + 1.2]);
      }
      if (D.BRUNNEN) hind.push([D.BRUNNEN[0], D.BRUNNEN[1], 3.4]);
      for (const k in D.WUNDER) { const w = D.WUNDER[k]; if (w.steht) hind.push([w.x, w.y, Math.hypot(w.fussS[0], w.fussS[1]) / 2 * 0.8 + 1.2]); }
      hind.push([D.BAHNHOF[0], D.BAHNHOF[1], 14]);
      /* FASSUNG 819 — Sichtbarkeitsgraph um die Flügel des Rathauses: Knoten = Flügelecken, 3,5 m nach außen gerückt */
      const RT = D.teileWelt("rathaus");
      const umRathaus = (A, Bz) => {
        const knoten = [A, Bz];
        for (const poly of RT) {
          let mx = 0, my = 0; for (const q of poly) { mx += q[0]; my += q[1]; } mx /= poly.length; my /= poly.length;
          for (const q of poly) { const dx = q[0] - mx, dy = q[1] - my, l = Math.hypot(dx, dy) || 1, k = [q[0] + dx / l * 3.5, q[1] + dy / l * 3.5]; if (RT.every((pp) => abstPoly(k, pp) > 2.2)) knoten.push(k); }
        }
        const frei = (a, b) => {
          const l = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.ceil(l / 0.5);
          for (let i = 0; i <= n; i++) {
            const q = [a[0] + (b[0] - a[0]) * i / n, a[1] + (b[1] - a[1]) * i / n];
            if (Math.min(Math.hypot(q[0] - A[0], q[1] - A[1]), Math.hypot(q[0] - Bz[0], q[1] - Bz[1])) < 1.5) continue;
            if (RT.some((poly) => abstPoly(q, poly) < 1.4)) return false;
          }
          return true;
        };
        const N = knoten.length, dist = new Array(N).fill(Infinity), her = new Array(N).fill(-1), fertig = new Array(N).fill(false);
        dist[0] = 0;
        for (;;) {
          let u = -1; for (let i = 0; i < N; i++) if (!fertig[i] && dist[i] < Infinity && (u < 0 || dist[i] < dist[u])) u = i;
          if (u < 0 || u === 1) break;
          fertig[u] = true;
          for (let v = 0; v < N; v++) {
            if (fertig[v]) continue;
            const dv = dist[u] + Math.hypot(knoten[v][0] - knoten[u][0], knoten[v][1] - knoten[u][1]);
            if (dv < dist[v] && frei(knoten[u], knoten[v])) { dist[v] = dv; her[v] = u; }
          }
        }
        if (her[1] < 0) return null;
        const pts = []; for (let i = 1; i >= 0; i = her[i]) { pts.unshift(knoten[i]); if (i === 0) break; }
        return kurve(pts, Math.max(4, Math.round(dist[1] / (pts.length - 1) / 2.5)));
      };
      const stoesst = (pts) => { for (const q of pts) for (const h of hind) if (Math.hypot(q[0] - h[0], q[1] - h[1]) < h[2]) return h; return null; };
      D.WEGE = kanten.map(([i, j], n) => {
        const A = ziele[i], Bz = ziele[j], dx = Bz[0] - A[0], dy = Bz[1] - A[1], l = Math.hypot(dx, dy) || 1;
        const bog = (ST.hash2(n, 7, 807) - 0.5) * 0.3 * l;
        let pts = [A, [A[0] + dx / 2 - dy / l * bog, A[1] + dy / 2 + dx / l * bog], Bz];
        let w = kurve(pts, Math.max(4, Math.round(l / 3)));
        /* innen (ohne die Enden vor den Häusern) an ein Haus gestoßen? dann in einem Bogen außen herum */
        for (let versuch = 0; versuch < 3; versuch++) {
          const h = stoesst(w.slice(2, -2)); if (!h) break;
          const t = Math.max(0.15, Math.min(0.85, ((h[0] - A[0]) * dx + (h[1] - A[1]) * dy) / (l * l)));
          const px = A[0] + dx * t, py = A[1] + dy * t, nx = -dy / l, ny = dx / l;
          const seite = (h[0] - px) * nx + (h[1] - py) * ny > 0 ? -1 : 1, um = h[2] + 2.5;
          const q = [h[0] + nx * seite * um, h[1] + ny * seite * um];
          pts = [A, [(A[0] + q[0]) / 2, (A[1] + q[1]) / 2], q, [(q[0] + Bz[0]) / 2, (q[1] + Bz[1]) / 2], Bz];
          w = kurve(pts, Math.max(6, Math.round(l / 2.5)));
        }
        /* FASSUNG 819 — stößt ein Weg an einen Flügel des Rathauses (Stern um den Turm), geht er auf dem kürzesten freien
           Weg über die Ecken der Flügel herum */
        if (RT && w.slice(2, -2).some((q) => RT.some((poly) => abstPoly(q, poly) < 1.0))) { const um = umRathaus(A, Bz); if (um) w = um; }
        return w;
      });
      /* FASSUNG 808 — XANDER: „die Pferdebahn, die wir in Döbeln haben". Eigene Straße vom Markt links am Rathaus vorbei
         hinauf zum Bahnhof (fuhrwerk.js fährt darauf); die Leute gehen sie auch. */
      D.PFERDEBAHN = kurve([vw(-9, -2), vw(-22.5, -9), vw(-24, -28), vw(-27, -48), vw(-32, -66), vw(uHalt, bahnV(uHalt) + 6)], 16);
      D.WEGE.push(D.PFERDEBAHN);
    };
    D.wegeBauen();
    D.boden = function () {
      B.leeren();
      /* Marktplatz vor dem Rathaus */
      rund(MARKT[0], MARKT[1], 10, 10, 0);
      for (const w of D.WEGE) B.linie(w, 1.25, 0, 1);
      /* Vorgärten vor den Häusern */
      for (const k in P) {
        if (k === "muehle") continue;
        /* FASSUNG 819 — vor dem Rathausportal kein Vorgarten, sondern Pflaster bis zum Brunnen */
        const t = D.tuer(k, 3.0); if (t) { rund(t[0], t[1], 4.2, 4.2, 0); continue; }
        const q = vor(P[k], 7.5); rund(q[0], q[1], 2.4, 2.4, 3);
      }
      /* Quelle, Fluss (wird breiter) in die Zunge des Sees, Mühlbach */
      rund(D.QUELLE[0], D.QUELLE[1], 3, 2.4, 1);
      const fl = kurve(D.FLUSS, 10);
      B.linie(fl, (i, k) => 1.0 + 1.5 * (i / fl.length) + 0.4 * ST.hash2(i, Math.round(k * 4), 5), 1, 1);
      B.linie(kurve(D.MUEHLBACH, 12), (i, k) => 1.2 + 0.4 * ST.hash2(i, Math.round(k * 4), 6), 1, 1);
      rund(m.x + 6, m.y - 30, 3.2, 2.6, 1);   // Quellteich des Mühlbachs
      /* der See (wie Fassung 803: Zunge, Hals, großer See, Badebucht) – verschoben */
      const zu = see(66, 56); rund(zu[0], zu[1], 13, 10, 1);
      kurve([see(70, 61), see(75, 66), see(81, 70)], 5).forEach((q) => rund(q[0], q[1], 5.5, 4.5, 1));
      const seeLauf = kurve([see(80, 71), see(86, 79), see(87, 89), see(80, 98)], 6);
      seeLauf.forEach((q, i) => {
        const t = i / (seeLauf.length - 1), w = 8 + Math.sin(Math.min(1, t * 1.25) * Math.PI) * 12 + (ST.hash2(i, 3, 17) - 0.5) * 3;
        rund(q[0] + (ST.hash2(i, 5, 17) - 0.5) * 3, q[1], w, w * 0.8, 1);
      });
      const bu = see(68, 90); rund(bu[0], bu[1], 8, 6, 1);
      /* Felder (Getreide) unten links und rechts am Rand, wie im alten Bild */
      /* FASSUNG 828 — XANDER: „es gibt noch kein Getreide … da muss ich immer in die alte Ansicht zurück". Die Äcker sind
         die Felder 91 (links) und 92 (rechts) des alten Bildes – ein Tipp darauf erntet im Spiel (oberflaeche.js). */
      D.FELD_ORTE = [];
      for (const [px, py, fw, fh, nr] of [[30, 182, 9, 6, 91], [305, 142, 6, 8.5, 92], [58, 196, 4.5, 3.5, 91]]) { const q = welt(px, py); rund(q[0], q[1], fw, fh, 2); D.FELD_ORTE.push({ nr: nr, x: q[0], y: q[1], r: Math.max(fw, fh) }); }
    };
    D.kulisse = function () {
      const liste = [];
      const setze = (bild, x, y, dreh, x2) => { liste.push(Object.assign({ art: "kulisse", bild: bild, x: x, y: y, dreh: dreh || 0, fuss: [2, 2], hoehe: 4 }, x2 || {})); };
      /* Bahnhof hinter dem Gleis, der Bahnsteig schaut zum Gleis (und zum Betrachter) */
      /* FASSUNG 809 — Walkie 305: „man kann den Bahnhof auch nicht anklicken um irgendwelchen Input oder Export zu steuern":
         im Spiel öffnet ein Tipp die Bahnhof-Station (Export/Import) */
      setze("k_bahnhof", D.BAHNHOF[0], D.BAHNHOF[1], 1.5, { fuss: [30, 16.6], hoehe: 13, name: "Bahnhof", spiel: "bahnhof" });
      /* Bootsverleih am See (boote.js) – vor den Bäumen gesetzt, damit keiner darauf wächst */
      setze("d_bootshaus", D.BOOTSHAUS[0], D.BOOTSHAUS[1], 0, { fuss: [10, 3.4], hoehe: 4, name: "Bootsverleih" });
      /* Brücken, wo Wege den Fluss oder Bach kreuzen – schräg, wenn der Weg schräg läuft */
      const nah = (pts, q, d) => pts.some((r) => Math.hypot(r[0] - q[0], r[1] - q[1]) < d);
      const fl = kurve(D.FLUSS, 10), mb = kurve(D.MUEHLBACH, 12), bruecken = [];
      for (const w of D.WEGE) for (let i = 2; i < w.length - 2; i += 2) {
        const q = w[i];
        if ((nah(fl, q, 1.6) || nah(mb, q, 1.4)) && !bruecken.some((b) => Math.hypot(b[0] - q[0], b[1] - q[1]) < 8)) {
          bruecken.push(q);
          const dx = w[i + 1][0] - w[i - 1][0], dy = w[i + 1][1] - w[i - 1][1];
          /* Brücke bei dreh 0 längs y; Wegrichtung auf 45° gerundet */
          const a = (Math.round((Math.atan2(dy, dx) * 180 / Math.PI - 90) / 45) * 45 + 360) % 180;
          setze("d_bruecke", q[0], q[1], a / 90, { fuss: [3.9, 11.2], hoehe: 2.7 });
        }
      }
      /* Laternen an den Wegen (alle ≈ 16 m), Bänke und Brunnen am Markt */
      let seit = 0;
      for (const w of D.WEGE) for (let i = 1; i < w.length; i++) {
        seit += Math.hypot(w[i][0] - w[i - 1][0], w[i][1] - w[i - 1][1]);
        if (seit < 16) continue; seit = 0;
        const dx = w[i][0] - w[i - 1][0], dy = w[i][1] - w[i - 1][1], l = Math.hypot(dx, dy) || 1;
        const x = w[i][0] - dy / l * 2.2, y = w[i][1] + dx / l * 2.2;
        if (nah(fl, [x, y], 3) || nah(mb, [x, y], 3) || vonBahn(x, y) < 4) continue;
        setze("d_laterne", x, y, 0, { fuss: [0.8, 0.8], hoehe: 4.4, deko: 1 });
      }
      for (let i = 0; i < 4; i++) { const a = rad(i * 90 + 45); setze("d_bank", MARKT[0] + Math.cos(a) * 8.6, MARKT[1] + Math.sin(a) * 8.6, 0, { fuss: [1.9, 0.75], hoehe: 0.9, deko: 1 }); }
      setze("d_weihnachtsbaum", MARKT[0], MARKT[1], 0, { fuss: [7.4, 7.4], hoehe: 21.8, nurWinter: 1, jahr: "winter", deko: 1 });
      /* der Brunnen vor dem Portal (wie auf Xanders Foto); Christbaum und Buden bleiben auf dem Markt */
      setze("d_brunnen", D.BRUNNEN[0], D.BRUNNEN[1], 0, { fuss: [4.6, 4.6], hoehe: 5.4, jahrNicht: "winter", deko: 1 });
      for (let i = 0; i < 6; i++) { const a = rad(30 + i * 60); setze("d_marktbude", MARKT[0] + Math.cos(a) * 6.6, MARKT[1] + Math.sin(a) * 6.6, drehZurMitte(i * 60 + 30), { fuss: [4, 3.2], hoehe: 4.2, nurWinter: 1, jahr: "winter", deko: 1 }); }
      const r = rng(4711), G = B.GROESSE / 2;
      const frei = (x, y, abst) => {
        for (const k in P) { const p = P[k]; if (Math.hypot(p.x - x, p.y - y) < (k === "muehle" ? 13 : 9) + abst) return false; }
        if (D.imGrundriss("rathaus", x, y, abst + 1)) return false;   // FASSUNG 819 — nichts in den Flügeln des Rathauses
        for (const k in D.WUNDER) { const w = D.WUNDER[k], f = w.fussS; if (Math.hypot(w.x - x, w.y - y) < (f[0] + f[1]) / 3 + 2 + abst) return false; }
        for (const o of liste) if (!o.rand && Math.abs(o.x - x) < o.fuss[0] / 2 + abst && Math.abs(o.y - y) < o.fuss[1] / 2 + abst) return false;
        if (vonBahn(x, y) < 6 || x + y < D.HORIZONT + 6) return false;
        if (Math.hypot(x - D.BAHNHOF[0], y - D.BAHNHOF[1]) < 16 + abst) return false;
        if (Math.hypot(x - D.BOOTSHAUS[0], y - D.BOOTSHAUS[1]) < 9 + abst) return false;
        /* FASSUNG 811 — Wiese für Weide und Auslauf (tiere.js) beim Kuhstall und Hof beim Hühnerstall frei lassen */
        if (Math.hypot(x - P.kuhstall.x, y - P.kuhstall.y) < 24 + abst || Math.hypot(x - P.huehnerstall.x, y - P.huehnerstall.y) < 13 + abst) return false;
        if (B.wert(x, y, 0) > 0.05 || B.wert(x, y, 1) > 0.05 || B.wert(x, y, 2) > 0.05) return false;
        return true;
      };
      /* Weihnachtspyramide und Krippe nahe am Markt, auf freier Wiese */
      const nahMarkt = (bild, fuss, hoehe) => { for (let i = 0; i < 24; i++) { const a = rad(i * 37), d = 15 + (i % 4) * 3, x = MARKT[0] + Math.cos(a) * d, y = MARKT[1] + Math.sin(a) * d; if (frei(x, y, fuss[0] / 2)) { setze(bild, x, y, 0, { fuss: fuss, hoehe: hoehe, nurWinter: 1, jahr: "winter", deko: 1 }); return; } } };
      nahMarkt("d_pyramide", [9.2, 9.2], 13); nahMarkt("d_krippe", [7.2, 5.4], 5.2);
      /* Wald ringsum (nicht auf dem Gleis, nicht im Wasser). Was hinter der Horizontlinie steht, verdecken bei Blick nach
         Norden die Alpen (hinten: nur beim Drehen zu sehen). */
      for (let i = 0; i < 170; i++) {
        const seite = i % 4, u = r() * (2 * G + 30) - G - 15, tief = 4 + Math.pow(r(), 0.7) * 22;
        const x = seite === 0 ? u : seite === 1 ? G + tief : seite === 2 ? u : -G - tief;
        const y = seite === 0 ? -G - tief : seite === 1 ? u : seite === 2 ? G + tief : u;
        if (vonBahn(x, y) < 5) continue;
        if (B.wert(x, y, 1) > 0.02 || B.wert(x + 2, y, 1) > 0.02 || B.wert(x - 2, y, 1) > 0.02 || B.wert(x, y - 2, 1) > 0.02) continue;
        const bild = r() < 0.7 ? "n_tanne" + ((r() * 3) | 0) : "n_laubbaum" + ((r() * 3) | 0);
        liste.push({ art: "natur", bild: bild, x: x, y: y, dreh: 0, fuss: [3.5, 3.5], hoehe: 13, rand: 1, hinten: x + y < D.HORIZONT - 3 ? 1 : 0 });
      }
      /* Der Waldsaum am Fuß der Berge hinter der Bahn (im alten Bild rechts vom Rathaus am dichtesten) – der Zug fährt davor */
      for (let i = 0; i < 44; i++) {
        const rechts = i % 3 !== 0, u = rechts ? 20 + r() * 90 : -135 + r() * 150, v = D.HORIZONT - 1 + r() * 7;
        if (v > bahnV(u) - 5.5 || Math.abs(u - uHalt) < 24) continue;
        const q = vw(u, v);
        liste.push({ art: "natur", bild: r() < 0.8 ? "n_tanne" + ((r() * 3) | 0) : "n_laubbaum" + ((r() * 3) | 0), x: q[0], y: q[1], dreh: 0, fuss: [3.5, 3.5], hoehe: 13, rand: 1 });
      }
      /* offen wie das alte Dorf: nur wenige Bäume zwischen den Häusern, eher am Rand der Wiese */
      let innen = 0;
      for (let i = 0; i < 300 && innen < 34; i++) {
        const x = (r() - 0.5) * 2 * (G - 3), y = (r() - 0.5) * 2 * (G - 3);
        if (Math.hypot(x - MARKT[0], y - MARKT[1]) < 34 || !frei(x, y, 4)) continue;
        innen++;
        liste.push({ art: "natur", bild: r() < 0.5 ? "n_tanne" + ((r() * 3) | 0) : "n_laubbaum" + ((r() * 3) | 0), x: x, y: y, dreh: 0, fuss: [3.5, 3.5], hoehe: 13 });
      }
      /* Obstwiese unten rechts beim Labor */
      for (let i = 0; i < 12; i++) {
        const q = welt(294 + (i % 4) * 7 + r() * 2, 170 + Math.floor(i / 4) * 7 + r() * 2);
        if (!frei(q[0], q[1], 1.5)) continue;
        liste.push({ art: "natur", bild: "n_obstbaum" + (i % 2), x: q[0], y: q[1], dreh: 0, fuss: [3, 3], hoehe: 6 });
      }
      for (const [x, y] of [[-16, 26], [24, -30], [40, 30], [-30, -16]]) if (frei(x, y, 1)) setze("d_schneemann", x, y, 0, { fuss: [1.3, 1.3], hoehe: 1.9, nurWinter: 1, jahr: "winter", deko: 1 });
      return liste;
    };
  })();

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
      /* FASSUNG 809 — XANDER: „die Möglichkeit meine Häuser auch im Nachhinein … herum zu drehen oder anders zu
         positionieren … und das abspeichern zu können". Versetzt wird relativ zum Bauplatz (dx/dy in Metern). */
      const dx = (extra[k] && +extra[k].dx) || 0, dy = (extra[k] && +extra[k].dy) || 0;
      SZ.neu({ art: "haus", spiel: k, name: D.GEBAEUDE[k][0], bild: bild[0], bauBild: bild[1], x: p.x + dx, y: p.y + dy, dreh: dreh, platzX: p.x, platzY: p.y, platzDreh: p.dreh,
        stufe: D.STUFE[Math.max(0, Math.min(2, (st || 1) - 1))] * ((D.MASS || {})[k] || 1), stufenZahl: st, fuss: bild[2].map((z) => z * ((D.MASS || {})[k] || 1)), hoehe: bild[3], bau: bau,
        grundriss: D.GRUNDRISS && D.GRUNDRISS[k] ? D.GRUNDRISS[k].teile : undefined });   // FASSUNG 819 — Flügel für die Leute vor dem Portal (szene.js)
    }
    const wunder = (ich && ich.volk && ich.volk.wunder) || {};
    /* FASSUNG 808 — die Wahrzeichen auf ihren Plätzen aus dem Spielstand (volk.wunder_platz); Wege neu dazu */
    if (D.wunderSetzen) {
      D.wunderSetzen(ich && ich.volk);
      const sig = Object.keys(D.WUNDER).map((k) => D.WUNDER[k].steht ? D.WUNDER[k].platz : "-").join(",");
      if (sig !== D.wunderSig) { if (D.wunderSig != null) { D.wegeBauen(); D.boden(); } D.wunderSig = sig; }
    }
    for (const k in D.WUNDER) {
      const w = D.WUNDER[k];
      if (!wunder[k] || !w.bild) continue;
      SZ.neu({ art: "wunder", spiel: k, name: w.name, bild: w.bild, x: w.x, y: w.y, dreh: w.dreh, fuss: w.fussS || w.fuss, hoehe: w.hoehe * (w.mass || 1), stufe: w.mass || 1 });
    }
    for (const o of D.kulisse()) SZ.neu(o);
    /* FASSUNG 809 — ein versetztes Haus verdrängt die Bäume und Büsche, auf denen es jetzt stünde */
    const versetzt = SZ.objekte.filter((o) => o.art === "haus" && o.platzX != null && (o.x !== o.platzX || o.y !== o.platzY));
    if (versetzt.length) SZ.objekte = SZ.objekte.filter((n) => n.art !== "natur" || !versetzt.some((h) => Math.abs(n.x - h.x) < (h.fuss[0] + h.fuss[1]) * 0.32 + 1.5 && Math.abs(n.y - h.y) < (h.fuss[0] + h.fuss[1]) * 0.32 + 1.5));
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
    /* FASSUNG 818 — auch das Bergwerk (Felshügel mit Stolleneingang) steht in der Vorschau */
    const st = { rathaus: 3, baeckerei: 3, schule: 2, gasthaus: 3, flickstube: 1, schmiede: 2, gefaengnis: 1, bibliothek: 2, brauerei: 3, kaserne: 2, muehle: 3, huehnerstall: 1, krankenhaus: 2, kuhstall: 2, bergwerk: 2 };
    for (const k in st) dorf[k] = { stufe: st[k], lp: 20 * st[k] };
    return {
      id: "beispiel", name: "Beispiel", dorf_name: "Winterhausen", dorf: dorf, dorf_plan: {},
      baustellen: [{ was: "labor", stufe: 1, start: iso(-50e3), bis: iso(70e3), dauer: 120 }, { was: "flickstube", stufe: 2, start: iso(-200e3), bis: iso(100e3), dauer: 300 }],
      volk: { wunder: { koelner_dom: { stufe: 1 }, neuschwanstein: { stufe: 1 }, fernsehturm: { stufe: 1 }, holstentor: { stufe: 1 }, brandenburger: { stufe: 1 } } }
    };
  };
})();
