/* =====================================================================
   WASSERMÜHLE — Bruchstein-Fachwerk-Mühle mit oberschlächtigem Wasserrad
   ---------------------------------------------------------------------
   XANDER: „ein Baukastensystem für ein Dorf, wo wir sämtliche
   Sehenswürdigkeiten aus Deutschland, die filigran und detailreich
   perfekt nach ihrem Vorbild nachgearbeitet wurden …"
   „Das soll keine Comic Grafik sein. Das soll noch viel mehr am
   Realismus dran sein." · „ohne Pixelkanten und komische
   Vektorrückstände" · „Man soll sie in jedem Winkel aufstellen können.
   Man soll das Fundament sehen beim Aufbauen." · „Ich möchte einen
   Liebreiz zur Weihnachtsdeko … mit Schmücken, mit Schnee … dass wir das
   später in einen Frühlingsgewand packen können."

   VORBILD: Mahlmühlen in Hessen und Franken (Spessart, Vogelsberg, Rhön):
   Erdgeschoss aus Bruchstein (Buntsandstein in Kalkmörtel, Eckquader aus
   rotem Mainsandstein), Obergeschoss und Giebel in Fachwerk, steiles
   Satteldach mit Krüppelwalm und Biberschwanz-Doppeldeckung. An der
   Ostgiebelseite ein oberschlächtiges Wasserrad.

   WOHER DAS WASSER KOMMT (Runde 2, Kritik: „speist sich aus nichts"):
   Ein oberschlächtiges Rad braucht Gefälle. Weil die Stadt eben ist, steht
   hinter der Mühle ein geböschter Teichdamm – der Mühlteich (Stauweiher).
   Zur Mühle hin und am Bach hält ihn eine Bruchstein-Stützmauer, zur
   Wiese hin fällt er als Rasen- bzw. Schneeböschung auf eine niedrige
   Trockenmauer ab. Oben die Wasserfläche mit Sandstein-Teichrand, am
   Mauerkopf das Schütz (Schütztafel, Zahnstange, Handrad), aus dem das
   Wasser in das hölzerne Gerinne auf Böcken läuft und knapp hinter dem
   Scheitel in die Zellen fällt. Überschüssiges Wasser geht über den
   Leerschuss an der Ostmauer in ein Tosbecken. Unter dem Rad die gemauerte
   Radgrube; der Untergraben läuft als gepflasterte Rinne bis an den
   Grundrand (in Winterhausen genau in den Mühlbach).
   Das Rad steht an +x, damit man die Mühle an einen Bach stellen kann.

   MASSE (Meter; Konstruktion mit dem Haus um y = 0, x Osten, y Süden;
   für den Kern ist alles um DY nach Süden verschoben, damit die Mitte des
   Grundrisses auf 0,0,0 liegt – siehe verschoben())
     Haus        10,5 × 8,0 m (x −7,0…3,5), Bruchstein bis 3,3 m,
                 Fachwerk-Obergeschoss bis 6,05 m, Traufe 6,25 m,
                 Dachneigung 50°, First 11,45 m, Krüppelwalm ab 9,3 m
     Wasserrad   Ø 5,0 m, lichte Breite 0,95 m, 36 Zellen, 2 × 8 Arme,
                 Welle (Eiche, achteckig) Ø 0,54 m, Mitte auf 2,62 m,
                 Außenlager auf niedrigem Mauerpfeiler in der Grubenwand
     Gerinne     0,8 m breit, Boden auf 5,28 m, vom Damm bis über den
                 Scheitel des Rades, auf zwei Böcken und einer Konsole
     Teichdamm   Krone 5,95 m, Teich 5,2 × 2,3 m (Spiegel 5,62 m),
                 Böschung 50° auf 0,45-m-Trockenmauer
     Radgrube    2,7 × 6,2 m, 1,1 m tief, Wasserspiegel 0,55 m unter Gelände
     Untergraben 1,1 m breit, vom Durchlass (Südhälfte, wo das Wasser aus
                 den Zellen fällt) bis an den Grundrand

   WAS SICH DREHT: Rad und Wasser werden nicht mehr jedes Bild neu gemalt
   (Kritik: 116 ms je Bild). Die Symmetrie des Rades (36 Zellen, 8 Arme)
   wiederholt sich alle 90°. Also malt die Mühle für jede Ansicht (Drehung,
   Zoom, Jahreszeit, Tageszeit) einmal eine Bildfolge von 16–36 Bildern
   einer Vierteldrehung – mit ausgespartem Haus, Lager, Damm usw. – und
   legt im Leben nur noch das passende Bild hin (drawImage). Das Wasser
   läuft in derselben Schleife (alle seine Bewegungen sind ganzzahlige
   Vielfache der Schleifendauer), das Wasser im Gerinne in einer eigenen
   kurzen Schleife. Unter 14 Bildpunkten je Meter steht das Rad still im
   Sprite; im Sprite liegt immer eine schwach deckende Radsilhouette, damit
   ein Tipp auf das Rad die Mühle auswählt.

   AUFBAU (o.bau): Schnurgerüst und Baugrube (Haus und Radgrube) →
   Betonfundament mit Schalung → Bruchsteinmauern Lage für Lage, der
   Teichdamm wächst mit (Stützmauer, Erdschüttung) → Balkenlage →
   Fachwerk (Holz, dann Ausfachung) → offener Dachstuhl mit Richtbaum →
   Lattung, Eindecken Reihe für Reihe → Schütz, Böcke, Gerinne →
   Wasserrad (Welle, Arme, Kränze, Zellen) → Fenster, Türen, Schmuck →
   Rasen auf der Böschung → Wasser marsch.
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT, PI = ST.pinsel;
  const hex = PI.hex, rgb = PI.rgb, misch = PI.misch, hell = PI.hell;

  /* ---------------- kleine Werkzeuge ---------------- */
  const klemm = (x, a, b) => (x < a ? a : x > b ? b : x);
  const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const kreuz = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const nrm = (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const Z3 = [0, 0, 1];
  const RAD = Math.PI / 180, TAU = Math.PI * 2;
  const zufall = (n) => ST.zufall((n >>> 0) || 1);
  const glatt = (x) => { x = klemm(x, 0, 1); return x * x * (3 - 2 * x); };
  const phase = (bau, a, b) => klemm((bau - a) / (b - a), 0, 1);
  function poly(g, p) { g.beginPath(); g.moveTo(p[0][0], p[0][1]); for (let i = 1; i < p.length; i++) g.lineTo(p[i][0], p[i][1]); g.closePath(); }
  function huelle2(pts) {
    pts = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    if (pts.length < 3) return pts;
    const kr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lo = [], hi = [];
    for (const p of pts) { while (lo.length >= 2 && kr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
    for (let i = pts.length - 1; i >= 0; i--) { const p = pts[i]; while (hi.length >= 2 && kr(hi[hi.length - 2], hi[hi.length - 1], p) <= 0) hi.pop(); hi.push(p); }
    hi.pop(); lo.pop();
    return lo.concat(hi);
  }
  /* Vieleck an einer Halbebene beschneiden (Sutherland–Hodgman): behält f(p) ≥ 0 */
  function schneide(P, f) {
    const aus = [];
    for (let i = 0; i < P.length; i++) {
      const a = P[i], b = P[(i + 1) % P.length], fa = f(a), fb = f(b);
      if (fa >= 0) aus.push(a);
      if ((fa >= 0) !== (fb >= 0)) { const t = fa / (fa - fb); aus.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); }
    }
    return aus;
  }
  function rausch(g, x, y, w, h, meter, staerke, saat, okt) {
    const s = Math.abs(saat | 0);
    const bild = PI.rauschBild(1 + (s % 5), 128, 4, okt || 3, 1.6);
    const m = g.createPattern(bild, "repeat");
    const k = meter / 128, sx = (s >> 3) % 2 ? -k : k;
    m.setTransform(new DOMMatrix([sx, 0, 0, k, (s * 0.37) % meter, (s * 0.61) % meter]));
    g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = staerke; g.fillStyle = m; g.fillRect(x, y, w, h); g.restore();
  }
  function bleich(g, x, y, w, h, meter, staerke, saat) {
    const s = Math.abs(saat | 0);
    const bild = PI.rauschBild(51 + (s % 3), 128, 3, 3, 2.2);
    const m = g.createPattern(bild, "repeat");
    const k = meter / 128;
    m.setTransform(new DOMMatrix([k, 0, 0, k, (s * 0.29) % meter, (s * 0.53) % meter]));
    g.save(); g.globalCompositeOperation = "screen"; g.globalAlpha = staerke; g.fillStyle = m; g.fillRect(x, y, w, h); g.restore();
  }
  /* Farbe schon belichtet (für durchsichtige Flächen mit keinLicht) */
  function belichter(F, extra) {
    const lf = ST.lichtFaktor(F.n, F.zeit, extra || 0, F.jahr);
    return (c, a) => rgb([c[0] * lf[0], c[1] * lf[1], c[2] * lf[2]], a);
  }
  /* Licht für aufrecht gemalte Figuren (Säcke, Tanne, Christbaum, Aushub):
     links die Sonnenseite, rechts der Schatten, oben das Himmelslicht.
     Kritik Runde 1: „Nachts leuchten die Mehlsäcke wie Laternen" – ohne
     diese Faktoren malten die Figuren Tagesfarben in die Nacht. */
  function figurLicht(F) {
    const Zt = F.Z || ST.ZEITEN.tag;
    const lL = ST.lichtFaktor([-0.707, 0.707, 0], Zt, 0, F.jahr), lR = ST.lichtFaktor([0.707, -0.707, 0], Zt, 0, F.jahr);
    const lV = ST.lichtFaktor([0.707, 0.707, 0], Zt, 0, F.jahr), lO = ST.lichtFaktor([0, 0, 1], Zt, 0, F.jahr);
    const lit = (c, l, a) => rgb([c[0] * l[0], c[1] * l[1], c[2] * l[2]], a);
    return { lL: lL, lR: lR, lV: lV, lO: lO, lit: lit };
  }

  /* ---------------- Getönte Flecken und Glitzer (wie im Fachwerkhaus) ----------------
     Ein Rauschmuster als Farbe mit Deckkraft: so bekommt Schnee bläuliche
     Mulden und weiße Kuppen mit EINEM Füllbefehl – und dieselbe Palette
     wie die Nachbarhäuser (Kritik: „Stilbruch neben den Fachwerkhäusern"). */
  const TON = {};
  function tonMuster(saat, farbe, weich) {
    const k = saat + "|" + farbe + "|" + (weich || 0);
    if (TON[k]) return TON[k];
    const quelle = PI.rauschBild(1 + (saat % 5), 128, 4, 3, 1.6);
    const d = quelle.getContext("2d").getImageData(0, 0, 128, 128).data;
    const c = document.createElement("canvas"); c.width = c.height = 128;
    const g = c.getContext("2d"), id = g.createImageData(128, 128), f = hex(farbe);
    const u = weich ? 0.2 : 0.35, o = weich ? 0.8 : 0.5;
    for (let i = 0; i < 128 * 128; i++) {
      const v = klemm((d[i * 4] / 255 - u) / o, 0, 1);
      id.data[i * 4] = f[0]; id.data[i * 4 + 1] = f[1]; id.data[i * 4 + 2] = f[2];
      id.data[i * 4 + 3] = Math.round(v * v * (3 - 2 * v) * 255);
    }
    g.putImageData(id, 0, 0);
    TON[k] = c;
    return c;
  }
  function tonFlecken(g, x, y, w, h, meter, staerke, saat, farbe, weich) {
    const s = Math.abs(saat | 0);
    const m = g.createPattern(tonMuster(s % 7, farbe, weich), "repeat");
    const k = meter / 128, sx = (s >> 2) % 2 ? -k : k;
    m.setTransform(new DOMMatrix([sx, 0, 0, k, (s * 0.37) % meter, (s * 0.61) % meter]));
    g.save(); g.globalAlpha = staerke; g.fillStyle = m; g.fillRect(x, y, w, h); g.restore();
  }
  function glitzer(g, F, x, y, w, h, dichte, rng, farbe) {
    if (F.px <= 40 || F.licht < 0.2) return;
    const k = Math.min(700, Math.round(w * h * dichte));
    g.beginPath();
    for (let i = 0; i < k; i++) { const r = (0.5 + rng() * 0.8) / F.px; g.rect(x + rng() * w, y + rng() * h, r, r); }
    g.fillStyle = farbe || "rgba(255,255,255,0.95)"; g.fill();
  }

  /* =====================================================================
     VERSCHIEBUNG: Konstruktion (Haus um y = 0) → Kern (Grundrissmitte auf
     0,0). Alle Flächen, Teile, Figuren, Lichter und das Leben laufen über
     diesen Bauer; F.flaeche.oK behält den Ursprung in Konstruktions-
     koordinaten (für Loch-Clips, Schlagschatten, Aussparungen).
     ===================================================================== */
  function verschoben(M, dy) {
    const t = (p) => [p[0], p[1] + dy, p[2]];
    return {
      teil(name, opt) { if (opt && opt.mitte) opt = Object.assign({}, opt, { mitte: t(opt.mitte) }); return M.teil(name, opt); },
      flaeche(f) { f.oK = f.o; f.o = t(f.o); return M.flaeche(f); },
      figur(fi) { fi.y = (fi.y || 0) + dy; return M.figur(fi); },
      licht(x, y, z, r, c, k) { return M.licht(x, y + dy, z, r, c, k); },
      bodenlicht(x, y, r, c, k) { return M.bodenlicht(x, y + dy, r, c, k); },
      rauchAus(x, y, z, k) { return M.rauchAus(x, y + dy, z, k); },
      lebendig(fn) {
        M.lebendig((g, P) => {
          const Q = Object.create(P);
          Q.proj = (x, y, z) => P.proj(x, y + dy, z);
          if (P.schattenAuf) Q.schattenAuf = (x, y, z) => P.schattenAuf(x, y + dy, z);
          Q.kern0 = P.proj(0, 0, 0);
          fn(g, Q);
        });
      }
    };
  }
  const fo = (f) => f.oK || f.o;

  /* =====================================================================
     AUSSPAREN IN DER FLÄCHE (Leuchten): der Leuchten-Durchgang des Kerns
     läuft nach allen Teilen und kennt keine Verdeckung (Kernwunsch). Damit
     Fensterlicht nicht durch Dachüberstand, Rinne oder Gerinne scheint,
     werden die Körper davor entlang der Blickrichtung auf die Wand gelegt
     und aus dem Malbereich ausgeschnitten. Körper = konvexe Punktwolke in
     Konstruktionskoordinaten.
     ===================================================================== */
  function aussparenFl(g, F, B, koerper) {
    const f = F.flaeche, n = kreuz(f.u, f.v), E = B.e, en = dot(n, E), o = fo(f);
    const alle = [];
    if (en < 1e-3) return alle;
    for (const K of koerper) {
      if (!K) continue;
      const q = [];
      let vorn = false;
      for (const p of K) {
        const d = dot(n, sub(p, o));
        if (d > 0.01) vorn = true;
        const r = sub(add(p, mul(E, -d / en)), o);
        q.push([dot(r, f.u), dot(r, f.v)]);
      }
      if (!vorn) continue;
      const H = huelle2(q);
      if (H.length < 3) continue;
      alle.push(H);
      g.beginPath(); g.rect(-200, -200, 400, 400);
      g.moveTo(H[0][0], H[0][1]); for (let i = 1; i < H.length; i++) g.lineTo(H[i][0], H[i][1]); g.closePath();
      g.clip("evenodd");
    }
    return alle;
  }
  /* Punkt in einer der Hüllen? (Umlaufsinn egal) */
  function inHuelle(Hs, x, y) {
    for (const H of Hs) {
      let pos = 0, neg = 0;
      for (let i = 0; i < H.length; i++) {
        const a = H[i], b = H[(i + 1) % H.length], c = (b[0] - a[0]) * (y - a[1]) - (b[1] - a[1]) * (x - a[0]);
        if (c > 0) pos++; else if (c < 0) neg++;
      }
      if (!pos || !neg) return true;
    }
    return false;
  }
  /* Fläche für den Leuchten-Durchgang: Körper davor aussparen, und der
     Szenenschein eines Fensters entfällt, wenn seine Mitte verdeckt ist */
  function leuchtFlaeche(g, F, B, koerper) {
    const Hs = aussparenFl(g, F, B, koerper);
    if (!Hs.length) return F;
    const F2 = Object.create(F);
    F2.leuchtPunkt = (x, y, r, c, k, fl) => { if (!inHuelle(Hs, x, y)) F.leuchtPunkt(x, y, r, c, k, fl); };
    return F2;
  }

  /* =====================================================================
     HAUPTMASSE
     ===================================================================== */
  const XW0 = -7.0, XW1 = 3.5, YW = 4.0;          // Außenkanten der Wände
  const ZE = 3.3;                                  // Oberkante Bruchstein
  const ZO = 6.05;                                 // Oberkante Rähm Obergeschoss
  const ZT = 6.25;                                 // Oberkante Dachbalkenlage
  const NEIG = 50 * RAD, TN = Math.tan(NEIG);
  const DICKE = 0.28, DV = DICKE / Math.cos(NEIG);
  const UE = 0.55, OGV = 0.4;                      // Trauf- und Ortgangüberstand
  const ZF = ZT + DV + YW * TN;                    // First (Ziegeloberfläche) ≈ 11,45
  const YTE = YW + UE, ZTE = ZT + DV - UE * TN;     // Traufkante
  const WNEIG = 58 * RAD, TW = Math.tan(WNEIG);
  const ZWE = 9.3;                                 // Traufe des Krüppelwalms
  const YWE = (ZF - ZWE) / TN;                     // halbe Breite des Walms an seiner Traufe
  const XWE1 = XW1 + OGV, XWE0 = XW0 - OGV;        // Ortgang- und Walmtraufkante
  const XF1 = XWE1 - (ZF - ZWE) / TW, XF0 = XWE0 + (ZF - ZWE) / TW;   // Firstenden
  /* Giebelwand: Oberkante unter dem Walm (Unterseite der Walmfläche an der Wand) */
  const ZG = ZF - (XW1 - XF1) * TW - DICKE / Math.cos(WNEIG);
  const YG = YW - (ZG - ZT) / TN;                  // halbe Breite der Giebelwand oben
  const LH = XW1 - XW0, LG = 2 * YW;               // Wandlängen
  const HAUS_M = [(XW0 + XW1) / 2, 0, 3];          // Mitte des Hauses (Reihenfolge)

  /* Grundriss (Kern) und Verschiebung Konstruktion → Kern */
  const GRUND = [16.2, 21.4], DY = 3.0;
  const XG1 = GRUND[0] / 2;                        // Ostrand des Grundstücks (Bach)
  const YG0 = -GRUND[1] / 2 - DY, YG1 = GRUND[1] / 2 - DY;   // Nord- und Südrand (Konstruktion)
  /* Wasserrad */
  const RX = 4.4, RZ = 2.62, RR = 2.5, RI = 2.12, RK0 = 2.0;
  const RB = 0.95, RKD = 0.07;
  const XK1 = RX - RB / 2 - RKD, XK2 = RX - RB / 2, XK3 = RX + RB / 2, XK4 = RX + RB / 2 + RKD;
  const NZ = 36, NA = 8, RW = 0.27;
  /* Radgrube */
  const PX0 = XW1, PX1 = 6.2, PY0 = -3.1, PY1 = 3.1, PZB = -1.1, PZW = -0.55;
  const RAND_B = 0.34, RAND_H = 0.12;              // Randsteine
  /* Außenlager (Kritik: der 3-m-Quaderpfeiler stand vor der Nabe): ein
     niedriger Mauerpfeiler in der Ostwand der Grube, Oberkante 0,55 m unter
     der Wellenmitte, darauf ein Eichenbock mit eiserner Lagerschale */
  const LX0 = 5.78, LX1 = PX1 + RAND_B, LY = 0.42, LZ1 = RZ - RW - 0.28, LZB = RZ - RW + 0.02;
  const X_LAGER = 6.12;                            // Wellenende (Lagermitte)
  const LZ_P = 0.62;                               // Oberkante des niedrigen Lagerpfeilers
  /* Lagerbock: zwei geneigte Eichenstiele vom Pfeiler bis unter das Sattelholz */
  const BOCK_STIELE = [[-1, 0.33, 0.19], [1, 0.33, 0.19]].map(([t, yu, yo]) => [[X_LAGER, t * yu, LZ_P], [X_LAGER, t * yo, LZ1]]);
  /* Untergraben: aus der Südhälfte der Grube (dort fällt das Wasser aus
     den Zellen) durch einen Durchlass unter dem Randstein bis an den Rand */
  const UY0 = 1.35, UY1 = 2.45, UZB = -0.9;        // Rinne 1,1 m breit, Sohle
  const UYM = (UY0 + UY1) / 2;
  /* Teichdamm (Mühlteich hinter der Mühle) */
  const TD_Z = 5.95, TD_W = 5.62;                  // Krone, Wasserspiegel
  const TD_X0 = 1.2, TD_X1 = 7.0, TD_Y0 = -9.05, TD_Y1 = -5.9;  // Kronenfläche
  const TD_FUSS = 0.45, TD_NEIG = 50 * RAD;        // Trockenmauer am Böschungsfuß, Böschung 50°
  const TD_LAUF = (TD_Z - TD_FUSS) / Math.tan(TD_NEIG);
  const TD_XF = TD_X0 - TD_LAUF, TD_YF = TD_Y0 - TD_LAUF;      // Böschungsfuß West / Nord
  const TE_X0 = TD_X0 + 0.5, TE_X1 = TD_X1 - 0.45, TE_Y0 = TD_Y0 + 0.45, TE_Y1 = TD_Y1 - 0.5;   // Teich
  const LS_Y = -7.55, LS_B = 0.5;                  // Leerschuss (Mitte, Breite) an der Ostmauer
  const TB_X0 = TD_X1, TB_X1 = XG1 - 0.15, TB_Y0 = LS_Y - 0.85, TB_Y1 = LS_Y + 0.85, TB_Z = -0.45;   // Tosbecken
  /* Gerinne */
  const GX0 = 4.0, GX1 = 4.8, GW = 0.05;           // außen, Brettstärke
  const GZ0 = 5.2, GZB = 5.28, GZ1 = 5.72;         // Unterkante, Boden innen, Oberkante
  const GY0 = TD_Y1, GY1 = 0.35;                   // Anfang am Damm, Ende über dem Rad
  const GZW = 5.5;                                 // Wasserspiegel im Gerinne
  /* Böcke */
  const BOECKE = [-4.95, -3.45];
  const KONSOLE_Y = -1.5;
  /* Reihenfolge der Teile (der Kern sortiert nach der Mitte eines Teils):
     die Anbauten am Ostgiebel (Rad, Gerinne, Böcke) liegen „weit im
     Osten" (AUSSEN), alles am und auf dem Damm „sehr weit im Norden"
     (NORDEN). NORDEN ist viel größer als AUSSEN, damit zwischen Damm und
     Anbauten die Nord-Süd-Lage entscheidet – sie sind durch die Ebene der
     Dammmauer getrennt, Anbauten und Haus durch die Ebene des Ostgiebels. */
  const AUSSEN = 100, NORDEN = 10000;

  /* =====================================================================
     BLICK: bauen() kennt den Drehwinkel nicht – eine unsichtbare Figur,
     die als allererste gemalt wird, merkt ihn sich. Damit rechnen
     Laibungen, Baugrube und Parallaxe in jedem Winkel richtig.
     ===================================================================== */
  function neuerBlick() { return { c: 1, s: 0, e: [0.6124, 0.6124, 0.5], gier: 0 }; }
  function blickSetzen(B, gier) {
    const r = gier * RAD, c = Math.cos(r), s = Math.sin(r);
    B.c = c; B.s = s; B.gier = gier;
    B.e = [0.6124 * (c + s), 0.6124 * (c - s), 0.5];
  }
  /* Versatz eines Punkts in der Tiefe d hinter der Fläche (d < 0: davor) */
  function parallaxe(F, B, d) {
    const f = F.flaeche, n = kreuz(f.u, f.v);
    const en = Math.max(0.12, dot(B.e, n));
    return [d * dot(B.e, f.u) / en, d * dot(B.e, f.v) / en];
  }
  /* Licht auf einer gedachten Fläche mit Modell-Normale n (Laibungen) */
  function lichtVon(F, B, n) {
    const nc = [n[0] * B.c - n[1] * B.s, n[0] * B.s + n[1] * B.c, n[2]];
    return ST.lichtFaktor(nc, F.zeit, 0, F.jahr);
  }
  /* Faktor „gedachte Fläche / wirkliche Fläche" (weil der Kern danach
     noch das Licht der Wand darüberlegt) */
  function lichtVerh(F, B, n) {
    const a = lichtVon(F, B, n), b = ST.lichtFaktor(F.n, F.zeit, 0, F.jahr);
    return [a[0] / Math.max(0.05, b[0]), a[1] / Math.max(0.05, b[1]), a[2] / Math.max(0.05, b[2])];
  }
  const malVerh = (c, k) => rgb([Math.min(255, c[0] * k[0]), Math.min(255, c[1] * k[1]), Math.min(255, c[2] * k[2])]);

  /* =====================================================================
     FLÄCHEN-HILFEN
     ===================================================================== */
  /* Senkrechte Fläche mit Normale n (waagerecht), o = linke obere Ecke von außen */
  function wand(M, o, n, w, h, malen, extra) {
    const u = kreuz(n, Z3);
    return M.flaeche(Object.assign({ o: o, u: u, v: [0, 0, -1], w: w, h: h, malen: malen }, extra || {}));
  }
  /* Kasten x0…x1, y0…y1, z0…z1; m = { s, n, o, w, t } Maler (Süd, Nord, Ost, West, oben) */
  function kiste(M, x0, y0, z0, x1, y1, z1, m, extra) {
    const ex = (name) => Object.assign({ name: (extra && extra.name ? extra.name + "-" : "") + name }, extra || {});
    const h = z1 - z0;
    if (m.s) wand(M, [x0, y1, z1], [0, 1, 0], x1 - x0, h, m.s, ex("s"));
    if (m.n) wand(M, [x1, y0, z1], [0, -1, 0], x1 - x0, h, m.n, ex("n"));
    if (m.o) wand(M, [x1, y1, z1], [1, 0, 0], y1 - y0, h, m.o, ex("o"));
    if (m.w) wand(M, [x0, y0, z1], [-1, 0, 0], y1 - y0, h, m.w, ex("w"));
    if (m.t) M.flaeche(Object.assign({ o: [x0, y0, z1], u: [1, 0, 0], v: [0, 1, 0], w: x1 - x0, h: y1 - y0, malen: m.t }, ex("t")));
  }
  /* Balken beliebiger Richtung: Achse P0→P1, Querschnitt b (entlang Q) × d
     (entlang R = Achse × Q). mal(seite, w, h) → Maler; seiten: "QqRrae" */
  function balken3(M, P0, P1, Q, b, d, mal, opt) {
    opt = opt || {};
    const ax = sub(P1, P0), L = Math.hypot(ax[0], ax[1], ax[2]);
    if (L < 1e-4) return;
    const U = mul(ax, 1 / L);
    Q = nrm(sub(Q, mul(U, dot(Q, U))));
    const R = nrm(kreuz(U, Q));
    const mid = add(P0, mul(ax, 0.5));
    const seiten = opt.seiten || "QqRrae";
    const rechteck = (c, n, u, w, h, malen, name) => {
      n = nrm(n); u = nrm(u);
      const v = kreuz(n, u);
      const o = sub(sub(c, mul(u, w / 2)), mul(v, h / 2));
      M.flaeche(Object.assign({ o: o, u: u, v: v, w: w, h: h, malen: malen, name: (opt.name || "b") + name, keinAo: true }, opt.extra || {}));
    };
    /* u der Seitenflächen: so, dass v = n × u nach unten zeigt (Maserung längs) */
    const langU = (n) => { let u = U; if (dot(kreuz(n, u), Z3) > 0) u = mul(U, -1); return u; };
    if (seiten.indexOf("Q") >= 0) rechteck(add(mid, mul(Q, b / 2)), Q, langU(Q), L, d, mal("Q", L, d), "Q");
    if (seiten.indexOf("q") >= 0) rechteck(add(mid, mul(Q, -b / 2)), mul(Q, -1), langU(mul(Q, -1)), L, d, mal("q", L, d), "q");
    if (seiten.indexOf("R") >= 0) rechteck(add(mid, mul(R, d / 2)), R, langU(R), L, b, mal("R", L, b), "R");
    if (seiten.indexOf("r") >= 0) rechteck(add(mid, mul(R, -d / 2)), mul(R, -1), langU(mul(R, -1)), L, b, mal("r", L, b), "r");
    if (seiten.indexOf("a") >= 0) rechteck(P0, mul(U, -1), Q, b, d, mal("a", b, d), "a");
    if (seiten.indexOf("e") >= 0) rechteck(P1, U, Q, b, d, mal("e", b, d), "e");
  }
  /* Unsichtbare Fläche (Bildgrenzen, Schatten) */
  const LEER = { malen: null, keinLicht: true, keinAo: true };

  /* =====================================================================
     WERKSTOFFE
     ===================================================================== */
  /* ---------------- Holz ---------------- */
  const HOLZ_FW = [100, 52, 34];         // Fachwerk: Ochsenblut auf Eiche
  const HOLZ_ROH = [168, 128, 88];       // frisches Eichenholz
  const HOLZ_ALT = [112, 88, 64];        // verwittertes, nasses Eichenholz (Rad, Gerinne)
  const EISEN = [52, 50, 50];
  const KALK = [238, 232, 218];
  const LEHM = [176, 148, 112];
  const SANDSTEIN = [172, 104, 82];      // roter Mainsandstein
  const SANDSTEIN_G = [190, 162, 124];   // gelber Sandstein (Stauwerk-Abdeckung)
  const SANDSTEIN_H = [178, 146, 118];   // heller, verwitterter Buntsandstein (Lagerstein, Stauwerk)
  const BIBER = [152, 74, 50];

  /* Holzfläche mit Maserung (längs = x) */
  function holzMalen(g, F, x, y, w, h, c, saat, opt) {
    opt = opt || {};
    const rng = zufall(saat);
    g.fillStyle = rgb(c); g.fillRect(x, y, w, h);
    const px = F.px;
    if (px * h > 3 && px > 10) {
      const n = Math.max(2, Math.min(30, Math.round(h * 40)));
      g.lineWidth = Math.max(0.003, 0.9 / px);
      for (let i = 0; i < n; i++) {
        const yy = y + h * (i + 0.5) / n + (rng() - 0.5) * h * 0.04;
        g.strokeStyle = rgb(hell(c, -0.2 - rng() * 0.2), 0.16 + rng() * 0.22);
        g.beginPath(); g.moveTo(x + rng() * w * 0.2, yy);
        const st = 4;
        for (let k = 1; k <= st; k++) g.lineTo(x + w * k / st, yy + (rng() - 0.5) * h * 0.05);
        g.stroke();
      }
      if (px > 40 && !opt.ohneAst) {
        const aeste = Math.floor(w * h * 3 * rng());
        for (let i = 0; i < aeste; i++) {
          const ax = x + rng() * w, ay = y + rng() * h, r = 0.012 + rng() * 0.02;
          g.fillStyle = rgb(hell(c, -0.35), 0.7); g.beginPath(); g.ellipse(ax, ay, r * 1.6, r, 0, 0, TAU); g.fill();
        }
      }
    }
    if (opt.rauh !== false) rausch(g, x, y, w, h, 0.9, 0.22, saat + 3, 3);
  }
  /* Bretter (Fugen quer zur Richtung): richtung "h" = waagerechte Bretter */
  function bretterMalen(g, F, x, y, w, h, c, saat, opt) {
    opt = opt || {};
    const rng = zufall(saat);
    const bb = opt.breite || 0.2;
    const waag = opt.richtung !== "v";
    const L = waag ? h : w;
    const n = Math.max(1, Math.round(L / bb));
    for (let i = 0; i < n; i++) {
      const cc = PI.streu(c, rng, 0.08);
      if (waag) holzMalen(g, F, x, y + h * i / n, w, h / n, cc, saat + i * 7, { rauh: false });
      else {
        g.save(); g.translate(x + w * i / n, y + h); g.rotate(-Math.PI / 2);
        holzMalen(g, F, 0, 0, h, w / n, cc, saat + i * 7, { rauh: false });
        g.restore();
      }
    }
    if (F.px * bb > 4) {
      g.fillStyle = rgb(hell(c, -0.55), 0.8);
      for (let i = 1; i < n; i++) {
        if (waag) g.fillRect(x, y + h * i / n - 0.006, w, 0.012);
        else g.fillRect(x + w * i / n - 0.006, y, 0.012, h);
      }
    }
    rausch(g, x, y, w, h, 1.2, 0.2, saat + 11, 3);
  }
  /* Eisenband mit Nieten */
  function eisenBand(g, F, x, y, w, h, opt) {
    opt = opt || {};
    g.fillStyle = rgb(EISEN); g.fillRect(x, y, w, h);
    g.fillStyle = "rgba(140,76,40,0.35)"; g.fillRect(x, y + h * 0.5, w, h * 0.5);
    g.fillStyle = "rgba(255,255,255,0.12)"; g.fillRect(x, y, w, h * 0.2);
    if (F.px > 45 && opt.nieten !== false) {
      const n = Math.max(1, Math.round((opt.senkrecht ? h : w) / 0.14));
      g.fillStyle = "rgb(34,32,32)";
      for (let i = 0; i < n; i++) {
        const t = (i + 0.5) / n;
        const nx = opt.senkrecht ? x + w / 2 : x + w * t, ny = opt.senkrecht ? y + h * t : y + h / 2;
        g.beginPath(); g.arc(nx, ny, Math.min(w, h) * 0.22, 0, TAU); g.fill();
      }
    }
  }

  /* ---------------- Bruchstein ----------------
     Buntsandstein in Lagen: unten größere Blöcke, darüber flachere Steine,
     jeder Stein ein eigenes unregelmäßiges Vieleck in Kalkmörtel.
     Gezeichnet wird nach Farbeimern gebündelt (wenige Füllungen). */
  const BS_FARBEN = [[156, 112, 90], [172, 140, 106], [136, 124, 110], [124, 94, 78], [184, 160, 128], [150, 100, 80], [162, 134, 116], [120, 112, 102], [168, 120, 96], [140, 132, 122]];
  const MOERTEL = [196, 188, 172];
  const BS_CACHE = new Map();
  /* Ein unregelmäßiger Stein im Kasten [s0,t0,s1,t1]: gebrochene Ecken,
     leicht gewölbte, ungleich lange Kanten */
  function steinUmriss(rng, s0, t0, s1, t1) {
    const bw = s1 - s0, bh = t1 - t0, m = Math.min(bw, bh);
    const e = () => m * (0.12 + rng() * 0.3);
    const j = (a) => (rng() - 0.5) * a;
    const tl = e(), tr = e(), br = e(), bl = e();
    return [
      [s0 + tl, t0 + j(0.012)], [s0 + bw * (0.3 + j(0.2)), t0 - 0.004 + j(0.02)], [s0 + bw * (0.68 + j(0.2)), t0 + j(0.018)], [s1 - tr, t0 + j(0.012)],
      [s1 - tr * 0.3, t0 + tr * 0.35], [s1 + j(0.01), t0 + tr], [s1 + 0.004 + j(0.022), t0 + bh * (0.5 + j(0.3))], [s1 + j(0.01), t1 - br],
      [s1 - br * 0.35, t1 - br * 0.3], [s1 - br, t1 + j(0.01)], [s0 + bw * (0.55 + j(0.3)), t1 + 0.004 + j(0.02)], [s0 + bl, t1 + j(0.01)],
      [s0 + bl * 0.3, t1 - bl * 0.35], [s0 + j(0.01), t1 - bl], [s0 - 0.004 + j(0.022), t0 + bh * (0.5 + j(0.3))], [s0 + j(0.01), t0 + tl],
      [s0 + tl * 0.35, t0 + tl * 0.3]
    ];
  }
  function bruchLayout(saat, w, h) {
    const key = saat + "|" + w.toFixed(2) + "|" + h.toFixed(2);
    let L = BS_CACHE.get(key);
    if (L) return L;
    const rng = zufall(saat * 977 + 13);
    const steine = [];
    const neu = (s0, t0, s1, t1, reihe, yb, yt) => {
      if (s1 - s0 < 0.04 || t1 - t0 < 0.03) return;
      steine.push({ pts: steinUmriss(rng, s0, t0, s1, t1), box: [s0, t0, s1, t1], c: (rng() * BS_FARBEN.length) | 0, k: (rng() * 3) | 0, reihe: reihe, yb: yb, yt: yt, fl: rng() });
    };
    let yb = h, reihe = 0;
    while (yb > 0.005) {
      const gross = reihe < 2;
      let rh = (gross ? 0.3 : 0.2) + rng() * (gross ? 0.16 : 0.2);
      if (yb - rh < 0.14) rh = yb;
      const yt = yb - rh;
      let x = -rng() * 0.4;
      while (x < w) {
        const lw = Math.max(0.2, rh * (0.9 + rng() * 1.9));
        const x1 = x + lw;
        const m = 0.024 + rng() * 0.02;
        const art = rng();
        if (art < 0.22 && rh > 0.24) {
          /* zwei flache Steine übereinander */
          const tm = yt + rh * (0.38 + rng() * 0.24);
          neu(x + m, yt + m * 0.7, x1 - m, tm - m * 0.5, reihe, yb, yt);
          const xs = x + (x1 - x) * (rng() < 0.5 ? 0 : 0.35 + rng() * 0.2);
          if (xs > x + 0.05) { neu(x + m, tm + m * 0.5, xs - m * 0.6, yb - m * 0.7, reihe, yb, yt); neu(xs + m * 0.6, tm + m * 0.5, x1 - m, yb - m * 0.7, reihe, yb, yt); }
          else neu(x + m, tm + m * 0.5, x1 - m, yb - m * 0.7, reihe, yb, yt);
        } else if (art < 0.36) {
          /* großer Stein, oben ein Zwickelstein im breiten Fugenbett */
          const tz = yt + rh * (0.16 + rng() * 0.12);
          neu(x + m, tz + m * 0.4, x1 - m, yb - m * 0.7, reihe, yb, yt);
          const za = x + (x1 - x) * (0.15 + rng() * 0.4);
          neu(za, yt + m * 0.6, za + Math.min(x1 - za - m, 0.12 + rng() * 0.18), tz - m * 0.3, reihe, yb, yt);
        } else {
          /* ein Stein, oft nicht ganz schichthoch */
          const oben = yt + m * 0.7 + (rng() < 0.3 ? rng() * 0.05 : 0);
          neu(x + m, oben, x1 - m, yb - m * 0.7, reihe, yb, yt);
        }
        x = x1;
      }
      yb = yt; reihe++;
    }
    L = { steine: steine };
    BS_CACHE.set(key, L);
    if (BS_CACHE.size > 80) BS_CACHE.delete(BS_CACHE.keys().next().value);
    return L;
  }
  /* Pfade je Farbeimer einmal bauen und merken (Kritik: das Steinlayout
     wurde bei jeder Zeichnung neu gebaut). Unter 30 Bildpunkten je Meter
     reichen Reihen-Rechtecke – die 17-Eck-Steine sieht man dort nicht. */
  const BS_PFADE = new Map();
  function bruchPfade(L, key, fein, filter) {
    const k = key + (fein ? "|f" : "|g");
    let P = filter ? null : BS_PFADE.get(k);
    if (P) return P;
    const eimer = new Map();
    for (const s of L.steine) {
      if (filter && !filter(s)) continue;
      const ek = s.c * 3 + s.k;
      let e = eimer.get(ek);
      if (!e) { e = { stein: new Path2D(), kern: fein ? new Path2D() : null }; eimer.set(ek, e); }
      if (fein) {
        const p = s.pts; e.stein.moveTo(p[0][0], p[0][1]); for (let i = 1; i < p.length; i++) e.stein.lineTo(p[i][0], p[i][1]); e.stein.closePath();
        const b = s.box, cx = (b[0] + b[2]) / 2 - 0.012, cy = (b[1] + b[3]) / 2 - 0.012, kk = 0.62;
        e.kern.moveTo(cx + (p[0][0] - cx) * kk, cy + (p[0][1] - cy) * kk);
        for (let i = 1; i < p.length; i++) e.kern.lineTo(cx + (p[i][0] - cx) * kk, cy + (p[i][1] - cy) * kk);
        e.kern.closePath();
      } else e.stein.rect(s.box[0], s.box[1], s.box[2] - s.box[0], s.box[3] - s.box[1]);
    }
    const licht = new Path2D(), fuge = new Path2D();
    if (fein) for (const s of L.steine) {
      if (filter && !filter(s)) continue;
      const p = s.pts;
      licht.moveTo(p[14][0], p[14][1]); licht.lineTo(p[15][0], p[15][1]); licht.lineTo(p[16][0], p[16][1]); licht.lineTo(p[0][0], p[0][1]); licht.lineTo(p[1][0], p[1][1]); licht.lineTo(p[2][0], p[2][1]); licht.lineTo(p[3][0], p[3][1]);
      fuge.moveTo(p[6][0], p[6][1]); for (let i = 7; i <= 13; i++) fuge.lineTo(p[i][0], p[i][1]);
    }
    P = { eimer: eimer, licht: licht, fuge: fuge };
    if (!filter) { BS_PFADE.set(k, P); if (BS_PFADE.size > 120) BS_PFADE.delete(BS_PFADE.keys().next().value); }
    return P;
  }
  /* bis = Höhe von unten, bis zu der schon gemauert ist (Bau); lage = 0…1
     Fortschritt in der obersten Lage */
  function bruchsteinMalen(g, F, x, y, w, h, opt) {
    opt = opt || {};
    const px = F.px, saat = opt.saat || 1;
    const ob = opt.bis == null ? y : y + h - opt.bis;
    g.fillStyle = rgb(opt.moertel || MOERTEL);
    g.fillRect(x - 0.02, ob - 0.02, w + 0.04, y + h - ob + 0.04);
    if (px < 5) {
      g.fillStyle = "rgba(148,122,100,0.75)"; g.fillRect(x, ob, w, y + h - ob);
      rausch(g, x, ob, w, y + h - ob, 3, 0.2, saat, 3);
      return;
    }
    if (px > 20) rausch(g, x, ob, w, y + h - ob, 0.7, 0.18, saat + 2, 3);
    const L = bruchLayout(saat, w, h);
    const fein = px > 30;
    const voll = opt.bis == null || opt.bis >= h - 0.005;
    const filter = voll ? null : (s) => !(s.yb < h - opt.bis - 0.01) && !(s.yt < h - opt.bis - 0.01 && s.box[0] > w * (opt.lage == null ? 1 : opt.lage));
    const P = bruchPfade(L, saat + "|" + w.toFixed(2) + "|" + h.toFixed(2), fein, filter);
    g.save();
    g.translate(x, y);
    for (const [key, e] of P.eimer) {
      const c = hell(BS_FARBEN[(key / 3) | 0], (key % 3 - 1) * 0.08);
      g.fillStyle = rgb(c); g.fill(e.stein);
      /* Wölbung: jeder Stein ist bossiert – hellerer Kern, zum Licht versetzt */
      if (e.kern) { g.fillStyle = rgb(hell(c, 0.07)); g.fill(e.kern); }
    }
    if (fein) {
      /* Relief: Lichtkante oben, Schattenfuge unten (der Mörtel liegt zurück) */
      g.lineWidth = Math.max(0.006, 1.1 / px);
      g.strokeStyle = "rgba(255,244,226," + (F.lichtN > 0.05 ? 0.3 : 0.14) + ")";
      g.stroke(P.licht);
      g.strokeStyle = "rgba(40,28,22,0.42)";
      g.lineWidth = Math.max(0.008, 1.4 / px);
      g.stroke(P.fuge);
      if (px > 45) {
        /* Poren, Flechten, abgeplatzte Kanten – ein Pfad */
        const rng = zufall(saat + 99);
        g.fillStyle = "rgba(60,44,36,0.25)";
        g.beginPath();
        for (const s of L.steine) if (s.fl < 0.5 && (!filter || filter(s))) for (let i = 0; i < 3; i++) { const b = s.box, r = 0.006 + rng() * 0.01, cx = b[0] + rng() * (b[2] - b[0]), cy = b[1] + rng() * (b[3] - b[1]); g.moveTo(cx + r, cy); g.arc(cx, cy, r, 0, TAU); }
        g.fill();
      }
    } else if (px > 12) {
      /* grob: nur eine dunkle Unterkante je Stein */
      g.fillStyle = "rgba(40,28,22,0.28)";
      g.beginPath();
      for (const s of L.steine) if (!filter || filter(s)) g.rect(s.box[0], s.box[3] - Math.max(0.012, 1.1 / px), s.box[2] - s.box[0], Math.max(0.012, 1.1 / px));
      g.fill();
    }
    g.restore();
    rausch(g, x, ob, w, y + h - ob, 2.8, 0.14, saat + 5, 4);
    if (px > 12) bleich(g, x, ob, w, y + h - ob, 2.2, 0.07, saat + 1);
  }

  /* ---------------- Sandsteinquader (Pfeiler, Eckquader, Abdeckung) ---------------- */
  function quaderMalen(g, F, x, y, w, h, opt) {
    opt = opt || {};
    const rng = zufall(opt.saat || 5), px = F.px;
    const basis = opt.farbe || SANDSTEIN;
    const lage = opt.lage || 0.34;
    g.fillStyle = rgb(hell(basis, -0.28)); g.fillRect(x, y, w, h);
    let yy = y + h, reihe = 0;
    while (yy > y + 0.001) {
      const lh = Math.min(lage * (0.85 + rng() * 0.3), yy - y);
      let xx = x - (reihe % 2 ? lage * 0.9 : 0) - rng() * 0.1;
      while (xx < x + w) {
        const lw = opt.laenge ? opt.laenge * (0.8 + rng() * 0.4) : lage * (1.3 + rng() * 1.2);
        const c = PI.streu(basis, rng, 0.1);
        const bx = Math.max(x, xx) + 0.008, bw = Math.min(x + w, xx + lw) - Math.max(x, xx) - 0.016;
        if (bw > 0.02) {
          g.fillStyle = rgb(c);
          g.fillRect(bx, yy - lh + 0.008, bw, lh - 0.016);
          if (px > 18) {
            g.fillStyle = "rgba(255,240,220,0.18)"; g.fillRect(bx, yy - lh + 0.008, bw, Math.max(0.006, 1 / px));
            g.fillStyle = "rgba(40,20,14,0.22)"; g.fillRect(bx, yy - 0.008 - Math.max(0.006, 1 / px), bw, Math.max(0.006, 1 / px));
          }
          if (px > 55) {
            /* Scharrierung: feine, schräge Hiebe */
            g.strokeStyle = "rgba(70,40,30,0.12)"; g.lineWidth = Math.max(0.002, 0.5 / px);
            g.beginPath();
            for (let s = bx + 0.02; s < bx + bw; s += 0.018) { g.moveTo(s, yy - lh + 0.02); g.lineTo(s - 0.01, yy - 0.02); }
            g.stroke();
          }
        }
        xx += lw;
      }
      yy -= lh; reihe++;
    }
    rausch(g, x, y, w, h, 1.6, 0.2, (opt.saat || 5) + 3, 3);
  }

  /* ---------------- Kalkputz im Gefach ---------------- */
  function gefachGrund(g, F, x, y, w, h, c, saat) {
    g.fillStyle = rgb(c); g.fillRect(x, y, w, h);
    rausch(g, x, y, w, h, 3.2, 0.12, saat, 4);
    if (F.px > 22) rausch(g, x, y, w, h, 0.5, 0.08, saat + 7, 3);
    if (F.px > 45) rausch(g, x, y, w, h, 0.08, 0.08, saat + 17, 2);
    bleich(g, x, y, w, h, 2.4, 0.07, saat);
  }

  /* ---------------- Schnee und Eis ----------------
     Pulverschnee ist nie reinweiß und nie glatt (gleiche Palette wie die
     Fachwerkhäuser): Grundton #e8edf5, großflächige bläuliche Mulden (bis
     #b9c6da) und weiße Kuppen aus zwei Rauschmaßstäben, lange flache
     Verwehungen mit mindestens 0,25 Kontrast, Glitzer nur auf der
     Sonnenseite. opt.zwischen: Ziegelreihen, die sich durchdrücken. */
  function schneeFlaeche(g, F, x, y, w, h, saat, opt) {
    opt = opt || {};
    const rng = zufall(saat * 131 + 7);
    g.fillStyle = "rgb(232,237,245)"; g.fillRect(x, y, w, h);
    const wl = g.createLinearGradient(x, 0, x + w, 0);
    const a0 = 0.05 + rng() * 0.08, a1 = 0.05 + rng() * 0.08;
    wl.addColorStop(0, "rgba(160,178,212," + a0.toFixed(3) + ")"); wl.addColorStop(0.5, "rgba(160,178,212,0)"); wl.addColorStop(1, "rgba(160,178,212," + a1.toFixed(3) + ")");
    g.fillStyle = wl; g.fillRect(x, y, w, h);
    if (F.px > 3) {
      tonFlecken(g, x, y, w, h, 3.3, 0.6, saat + 31, "#b4c2d8", true);
      if (opt.zwischen) opt.zwischen();
      tonFlecken(g, x, y, w, h, 1.9, 0.75, saat + 47, "#f6f8fc", true);
      if (F.px > 16) tonFlecken(g, x, y, w, h, 0.7, 0.3, saat + 53, "#c9d4e6");
    }
    /* lange, flache Verwehungen quer zum Hang: bläuliche Mulden, helle Wehen */
    const n = Math.min(7, Math.round(w * h * 0.08) + 2);
    for (let i = 0; i < n; i++) {
      const cx = x + rng() * w, cy = y + rng() * h, rx = 0.9 + rng() * 2.2, ry = 0.08 + rng() * 0.16;
      const gg = g.createRadialGradient(cx, cy, 0, cx, cy, rx);
      const hellK = rng() < 0.5;
      gg.addColorStop(0, hellK ? "rgba(252,253,255,0.55)" : "rgba(140,160,200,0.28)"); gg.addColorStop(1, hellK ? "rgba(252,253,255,0)" : "rgba(140,160,200,0)");
      g.save(); g.translate(cx, cy); g.scale(1, ry / rx); g.fillStyle = gg; g.beginPath(); g.arc(0, 0, rx, 0, TAU); g.fill(); g.restore();
    }
    if (opt.glitzer !== false) glitzer(g, F, x, y, w, h, 6, rng);
  }
  /* Ziegelreihen unter dem Schnee: jede Reihe eine weiche Stufe – oben
     eine Lichtkante, darunter ein blauer Schatten, in Stücken von
     0,6–3 m (sonst wirkt es wie Wellblech). Zum First hin deutlicher. */
  function schneeRippen(g, F, x0, x1, yTraufe, yAb, saat, reihe) {
    const pxV = F.pxV || F.px, ZR = reihe || ZR_;
    if (pxV * ZR < 2.2) return;
    const rng = zufall(saat * 3 + 1);
    const st = klemm((pxV * ZR - 2.2) / 3, 0.4, 1);
    const reihen = [[], [], []];
    for (let k = 1; ; k++) {
      const yu = yTraufe - k * ZR;
      if (yu < yAb) break;
      const t = klemm((yTraufe - yu) / Math.max(0.5, yTraufe - yAb), 0, 1);   // 0 Traufe, 1 First
      let x = x0 - 0.1 - rng() * 0.5;
      while (x < x1 + 0.1) {
        const l = 0.6 + rng() * 2.4, q = rng() + (1 - t) * 0.35;
        if (q < 0.9) {
          const pts = [], nn = Math.max(4, Math.round(l / 0.25));
          for (let i = 0; i <= nn; i++) { const u = i / nn; pts.push([x + l * u, yu + (rng() - 0.5) * 0.02, Math.pow(Math.sin(Math.PI * u), 0.6)]); }
          reihen[q < 0.3 ? 0 : q < 0.6 ? 1 : 2].push(pts);
        }
        x += l;
      }
    }
    const band = (liste, d0, d1) => {
      g.beginPath();
      for (const P of liste) {
        g.moveTo(P[0][0], P[0][1] + d0 * P[0][2]);
        for (let i = 1; i < P.length; i++) g.lineTo(P[i][0], P[i][1] + d0 * P[i][2]);
        for (let i = P.length - 1; i >= 0; i--) g.lineTo(P[i][0], P[i][1] + d1 * P[i][2]);
        g.closePath();
      }
    };
    reihen.forEach((liste, k) => {
      if (!liste.length) return;
      const m = st * [1, 0.65, 0.35][k];
      band(liste, -0.024, 0); g.fillStyle = "rgba(255,255,255," + (0.3 * m).toFixed(3) + ")"; g.fill();
      band(liste, 0, 0.05); g.fillStyle = "rgba(104,124,180," + (0.2 * m).toFixed(3) + ")"; g.fill();
      band(liste, 0, 0.022); g.fillStyle = "rgba(104,124,180," + (0.16 * m).toFixed(3) + ")"; g.fill();
    });
  }
  /* Schneehaube auf einer schmalen Oberseite (Balken, Brett, Sims) */
  function schneeOben(basis) {
    return function (g, F) {
      if (basis) { if (typeof basis === "function") basis(g, F); else { g.fillStyle = basis; g.fillRect(-0.02, -0.02, F.w + 0.04, F.h + 0.04); } }
      g.fillStyle = "rgb(242,246,252)";
      PI.rundRechteck(g, -0.01, -0.01, F.w + 0.02, F.h + 0.02, Math.min(0.03, F.h * 0.3)); g.fill();
      const gr = g.createLinearGradient(0, 0, 0, F.h);
      gr.addColorStop(0, "rgba(200,212,235,0.3)"); gr.addColorStop(0.4, "rgba(255,255,255,0)"); gr.addColorStop(1, "rgba(215,225,245,0.25)");
      g.fillStyle = gr; g.fillRect(0, 0, F.w, F.h);
    };
  }
  /* Eiszapfen entlang der Oberkante einer (durchsichtigen) Fläche:
     gebündelt – Körper, Schattenseite, Lichtkante je ein Pfad */
  function eiszapfenMalen(g, F, x0, x1, y0, maxL, saat, L) {
    const rng = zufall(saat);
    const Z = [];
    let x = x0 + rng() * 0.2;
    while (x < x1 - 0.03) {
      const gruppe = rng() < 0.3;
      const l = maxL * (gruppe ? 0.45 + rng() * 0.55 : 0.08 + Math.pow(rng(), 2) * 0.55), b = 0.014 + l * 0.07;
      Z.push([x, l, b, (rng() - 0.5) * 0.01]);
      x += gruppe ? 0.03 + rng() * 0.06 : 0.1 + rng() * 0.4;
    }
    const form = (sx, sb) => { g.beginPath(); for (const [x, l, b, d] of Z) { g.moveTo(x - b * sb + sx * b, y0); g.quadraticCurveTo(x - b * 0.5 * sb + sx * b, y0 + l * 0.55, x + d, y0 + l); g.quadraticCurveTo(x + b * 0.5 + sx * b, y0 + l * 0.55, x + b, y0); g.closePath(); } };
    form(0, 1); g.fillStyle = L([214, 232, 248], 0.72); g.fill();
    form(0.35, 0.4); g.fillStyle = L([150, 182, 214], 0.5); g.fill();
    g.strokeStyle = L([255, 255, 255], 0.85); g.lineWidth = Math.max(0.004, 0.9 / F.px);
    g.beginPath(); for (const [x, l, b] of Z) { g.moveTo(x - b * 0.45, y0 + 0.01); g.lineTo(x - b * 0.1, y0 + l * 0.7); } g.stroke();
  }

  /* =====================================================================
     DACH: Biberschwanz-Doppeldeckung (schnell: nach Farbeimern gebündelt)
     In der Dachfläche: x entlang der Traufe, y vom First (0) zur Traufe.
     ===================================================================== */
  const ZB_ = 0.18, ZR_ = 0.155;
  /* Alterung der Ziegel aus niederfrequentem Rauschen (Kritik Runde 1:
     „jeder sechste Ziegel moosgrau – ein Leopardenmuster"): Moos und
     Flechte wachsen in Gruppen, mehr an der Traufe (dort bleibt es
     feucht), auf der Nordseite und im Tropfbereich unter dem Kamin. Die
     Farbstreuung je Ziegel bleibt klein (±4 %). opt.nord (0…1),
     opt.kamin (x des Kamins in der Fläche), opt.welt (Versatz fürs Rauschen) */
  function biberMalen(g, F, x0, x1, yTraufe, yOben, saat, opt) {
    opt = opt || {};
    const px = F.px, basis = opt.farbe || BIBER;
    const w = x1 - x0;
    g.fillStyle = rgb(hell(basis, -0.45)); g.fillRect(x0 - 0.05, yOben - 0.05, w + 0.1, yTraufe - yOben + 0.1);
    const nord = opt.nord || 0, ow = opt.welt || 0;
    /* Moosstärke an einer Stelle der Fläche (0…1) */
    const moos = (x, y) => {
      const r = ST.fbm((x + ow) * 0.42, y * 0.55 + saat * 0.13, 3, 7 + saat);
      const traufe = klemm(1 - (yTraufe - y) / 1.6, 0, 1);
      let k = (r - 0.5) * 2.2 + traufe * 0.55 + nord * 0.45 - 0.35;
      if (opt.kamin != null) { const d = Math.hypot((x - opt.kamin) * 0.9, Math.max(0, y - 0.3) * 0.35); k += klemm(1 - d / 1.6, 0, 1) * 0.6; }
      return klemm(k, 0, 1);
    };
    const MOOS = [112, 108, 74], FLECHTE = [158, 152, 124];
    if (px * ZR_ < 2.6) {
      const rng = zufall(saat);
      for (let yy = yTraufe; yy > yOben - ZR_; yy -= ZR_) {
        g.fillStyle = rgb(PI.streu(basis, rng, 0.04)); g.fillRect(x0 - 0.05, yy - ZR_, w + 0.1, ZR_ * 0.8);
      }
      /* Moos als weiche Flecken (grob) */
      if (px > 4) {
        const rr = zufall(saat + 5);
        for (let i = 0; i < Math.min(40, w * (yTraufe - yOben) * 0.5); i++) {
          const x = x0 + rr() * w, y = yOben + rr() * (yTraufe - yOben), m = moos(x, y);
          if (m < 0.25) continue;
          g.fillStyle = rgb(misch(basis, MOOS, 0.5), (0.35 * m).toFixed(3));
          g.beginPath(); g.ellipse(x, y, 0.5 + rr() * 0.8, 0.25 + rr() * 0.3, 0, 0, TAU); g.fill();
        }
      }
      rausch(g, x0, yOben, w, yTraufe - yOben, 3.5, 0.22, saat + 5, 3);
      return;
    }
    const kante = px * ZB_ > 9;
    /* Farbeimer: 3 Grundtöne (±4 %) × 4 Moosstufen */
    const TOENE = [hell(basis, -0.04), basis, hell(basis, 0.04)];
    const EIMER = [];
    for (let m = 0; m < 4; m++) for (let t = 0; t < 3; t++) {
      const c = m === 0 ? TOENE[t] : misch(TOENE[t], m === 3 ? FLECHTE : MOOS, [0, 0.18, 0.36, 0.3][m]);
      EIMER.push(c);
    }
    const b = ZB_ - 0.008, lang = 2.05 * ZR_, r = b / 2;
    for (let k = 0; ; k++) {
      const yu = yTraufe - k * ZR_;
      if (yu < yOben - 0.02) break;
      if (opt.bisReihe != null && k > opt.bisReihe) break;
      const rr = zufall(saat * 31 + k * 7919);
      const vers = (k % 2) * ZB_ / 2;
      const eimer = EIMER.map(() => []);
      /* Schatten des Rundschnitts auf die Reihe darunter (ein Pfad je Reihe) */
      g.fillStyle = "rgba(25,10,6,0.3)";
      g.beginPath();
      const xEnde = opt.teilReihe != null && k === opt.bisReihe ? x0 + w * opt.teilReihe : x1 + ZB_;
      for (let xx = x0 - ZB_ + vers - 0.02; xx < xEnde; xx += ZB_) {
        const xa = xx + 0.004;
        g.moveTo(xa + 0.01, yu - ZR_); g.lineTo(xa + 0.01, yu - r + 0.018);
        g.arc(xa + r + 0.01, yu - r + 0.018, r, Math.PI, 0, true);
        g.lineTo(xa + b + 0.01, yu - ZR_); g.closePath();
        const m = moos(xa + r, yu - lang * 0.4);
        const stufe = m < 0.3 ? 0 : m < 0.55 ? 1 : m < 0.8 ? 2 : 3;
        eimer[stufe * 3 + ((rr() * 3) | 0)].push(xa);
      }
      g.fill();
      for (let i = 0; i < EIMER.length; i++) {
        if (!eimer[i].length) continue;
        g.fillStyle = rgb(EIMER[i]);
        g.beginPath();
        for (const xa of eimer[i]) {
          g.moveTo(xa, yu - lang); g.lineTo(xa, yu - r);
          g.arc(xa + r, yu - r, r, Math.PI, 0, true);
          g.lineTo(xa + b, yu - lang); g.closePath();
        }
        g.fill();
      }
      if (kante) {
        /* Lichtkante am Rundschnitt */
        g.strokeStyle = "rgba(255,210,180,0.22)"; g.lineWidth = Math.max(0.004, 0.8 / px);
        g.beginPath();
        for (let xx = x0 - ZB_ + vers - 0.02; xx < xEnde; xx += ZB_) { const xa = xx + 0.004; g.moveTo(xa + 0.012, yu - r * 0.9); g.arc(xa + r, yu - r, r * 0.86, Math.PI - 0.15, 0.15, true); }
        g.stroke();
      }
      if (px * ZR_ > 5) {
        const gr = g.createLinearGradient(0, yu - ZR_ - 0.01, 0, yu - ZR_ + 0.05);
        gr.addColorStop(0, "rgba(30,12,8,0.26)"); gr.addColorStop(1, "rgba(30,12,8,0)");
        g.fillStyle = gr; g.fillRect(x0 - 0.05, yu - ZR_ - 0.01, w + 0.1, 0.06);
      }
    }
    rausch(g, x0, yOben, w, yTraufe - yOben, 4.2, 0.2, saat + 8, 4);
    if (px > 12) bleich(g, x0, yOben, w, yTraufe - yOben, 3.1, 0.06, saat + 3);
  }
  /* Schneedecke auf dem Dach (Kritik Runde 1: „wie weiße Pappe"): Am First
     weht der Wind den Schnee weg – dort sieht man in Zungen die roten
     Biberreihen, sonst Schnee nur in den Absätzen. Darunter die
     geschlossene Decke mit gerundeter, heller Abbruchkante, bläulichen
     Mulden, weißen Kuppen und Ziegelreihen als Rippen; unter dem Kamin
     eine blaue Mulde, bergseitig eine Wehe. */
  function dachSchnee(g, F, x0, x1, yTraufe, yOben, saat, opt) {
    opt = opt || {};
    const w = x1 - x0, h = yTraufe - yOben, rng = zufall(saat * 7 + 3), px = F.px;
    const oben = opt.oben == null ? 0.32 : opt.oben;
    const grenze = (x) => yOben + klemm((0.05 + (ST.fbm(x * 0.42 + saat * 0.7, saat * 0.31, 3, saat) - 0.3) * 1.5) * oben / 0.36 + Math.sin(x * 1.7 + saat) * 0.03, 0.03, 0.85);
    const kanteP = []; for (let x = x0 - 0.1; x <= x1 + 0.15; x += 0.1) kanteP.push([x, grenze(x)]);
    /* 1. am First: freie Ziegel mit Schnee in den Absätzen */
    if (oben > 0.01) {
      g.save(); g.beginPath(); g.rect(x0 - 0.1, yOben - 0.1, w + 0.2, oben + 0.7); g.clip();
      biberMalen(g, F, x0 - 0.05, x1 + 0.05, yTraufe, yOben, saat, { nord: opt.nord, kamin: opt.kamin });
      g.restore();
      g.fillStyle = "rgba(226,232,242,0.22)"; g.fillRect(x0 - 0.1, yOben - 0.1, w + 0.2, oben + 0.5);
      if (px * ZR_ > 2.5) {
        g.beginPath();
        for (let k = 0; ; k++) {
          const yu = yTraufe - k * ZR_;
          if (yu < yOben + 0.01) break;
          if (yu > yOben + oben + 0.45) continue;
          let x = x0 - 0.1 - rng() * 0.2;
          while (x < x1) {
            const len = 0.05 + Math.pow(rng(), 2) * 0.7, gap = 0.03 + Math.pow(rng(), 1.5) * 0.5, d = 0.012 + rng() * 0.03;
            if (yu < grenze(x) + 0.06 && rng() < 0.8) { const rr = d * 0.5; g.moveTo(x + rr, yu - d); g.lineTo(x + len - rr, yu - d); g.quadraticCurveTo(x + len, yu - d, x + len, yu - d + rr); g.lineTo(x + len, yu + 0.008); g.lineTo(x, yu + 0.008); g.lineTo(x, yu - d + rr); g.quadraticCurveTo(x, yu - d, x + rr, yu - d); g.closePath(); }
            x += len + gap;
          }
        }
        g.fillStyle = "rgba(240,244,250,0.93)"; g.fill();
      }
    }
    /* 2. geschlossene Decke */
    g.save();
    g.beginPath(); g.moveTo(x0 - 0.1, yTraufe + 0.1); for (const [x, y] of kanteP) g.lineTo(x, oben > 0.01 ? y : yOben - 0.05); g.lineTo(x1 + 0.15, yTraufe + 0.1); g.closePath(); g.clip();
    schneeFlaeche(g, F, x0 - 0.1, yOben - 0.05, w + 0.25, h + 0.15, saat, { glitzer: false, zwischen: () => schneeRippen(g, F, x0, x1, yTraufe, yOben + oben + 0.15, saat) });
    /* 3. Mulden und Wehen am Kamin */
    const blob = (cx, cy, rx, ry, farbe, a) => {
      const gg = g.createRadialGradient(cx, cy, 0, cx, cy, rx);
      gg.addColorStop(0, "rgba(" + farbe + "," + a + ")"); gg.addColorStop(0.55, "rgba(" + farbe + "," + (a * 0.5) + ")"); gg.addColorStop(1, "rgba(" + farbe + ",0)");
      g.save(); g.translate(cx, cy); g.scale(1, ry / rx); g.translate(-cx, -cy); g.fillStyle = gg; g.beginPath(); g.arc(cx, cy, rx, 0, TAU); g.fill(); g.restore();
    };
    if (opt.kamin != null) {
      blob(opt.kamin, yOben + 0.9, 1.0, 0.8, "104,124,178", 0.38);
      blob(opt.kamin, yOben + 0.25, 0.85, 0.34, "252,253,255", 0.5);
    }
    g.restore();
    /* 4. gerundete Abbruchkante: Lichtkante, darunter ein Hauch Schatten (die Decke hat Dicke) */
    if (oben > 0.01) {
      g.lineJoin = "round"; g.lineCap = "round";
      g.beginPath(); kanteP.forEach(([x, y], i) => (i ? g.lineTo(x, y + 0.04) : g.moveTo(x, y + 0.04)));
      g.strokeStyle = "rgba(128,148,196,0.34)"; g.lineWidth = Math.max(0.035, 1.2 / px); g.stroke();
      g.beginPath(); kanteP.forEach(([x, y], i) => (i ? g.lineTo(x, y + 0.01) : g.moveTo(x, y + 0.01)));
      g.strokeStyle = "rgba(250,252,255,0.95)"; g.lineWidth = Math.max(0.025, 1.0 / px); g.stroke();
    }
    /* 5. Glitzer nur auf der Sonnenseite */
    if (F.licht > 0.3) glitzer(g, F, x0, yOben + oben, w, h - oben, 5, rng);
  }

  /* =====================================================================
     FENSTER mit echter Laibungstiefe (Parallaxe)
     x, y, w, h = Maueröffnung in Flächenkoordinaten.
     fo: { tiefe, laibung, rahmen, fluegel, sprossen:[s,z], laeden, gitter,
           stein (Sandsteingewände), leer (Rohbau), deko (Schwibbogen) }
     ===================================================================== */
  function fensterMalen(g, F, B, x, y, w, h, fo) {
    const px = F.px, tiefe = fo.tiefe || 0.14;
    const n = kreuz(F.flaeche.u, F.flaeche.v);
    const pT = parallaxe(F, B, tiefe);
    const lb = hex(fo.laibung || "#d8d0c0");
    g.save();
    g.beginPath(); g.rect(x, y, w, h); g.clip();
    /* Laibungen: seitlich, oben (Sturz), unten (Sohlbank innen) */
    g.fillStyle = rgb(hell(lb, -0.1)); g.fillRect(x, y, w, h);
    const u = F.flaeche.u, v = F.flaeche.v;
    const seite = (pts, nn) => { g.fillStyle = malVerh(lb, lichtVerh(F, B, nn)); poly(g, pts); g.fill(); };
    if (pT[0] > 0) seite([[x, y], [x + pT[0], y + pT[1]], [x + pT[0], y + h + pT[1]], [x, y + h]], u);
    if (pT[0] < 0) seite([[x + w, y], [x + w + pT[0], y + pT[1]], [x + w + pT[0], y + h + pT[1]], [x + w, y + h]], mul(u, -1));
    if (pT[1] > 0) seite([[x, y], [x + w, y], [x + w + pT[0], y + pT[1]], [x + pT[0], y + pT[1]]], v);
    if (pT[1] < 0) seite([[x, y + h], [x + w, y + h], [x + w + pT[0], y + h + pT[1]], [x + pT[0], y + h + pT[1]]], mul(v, -1));
    void n;
    const fx = x + pT[0], fy = y + pT[1];
    if (fo.leer) {
      const gi = g.createLinearGradient(0, fy, 0, fy + h);
      gi.addColorStop(0, "rgb(24,20,18)"); gi.addColorStop(1, "rgb(52,42,34)");
      g.fillStyle = gi; g.fillRect(fx, fy, w, h);
      g.restore();
      return;
    }
    const tag = 1 - F.nacht;
    const rb = Math.min(0.055, w * 0.08);
    const rahmen = hex(fo.rahmen || "#ebe5d8");
    const gx = fx + rb, gy = fy + rb, gw = w - 2 * rb, gh = h - 2 * rb;
    /* Innenraum ahnen */
    const innen = g.createLinearGradient(0, gy, 0, gy + gh);
    innen.addColorStop(0, "rgb(44,40,38)"); innen.addColorStop(1, "rgb(68,58,50)");
    g.fillStyle = innen; g.fillRect(gx, gy, gw, gh);
    if (px > 12 && fo.vorhang !== false) {
      const pV = parallaxe(F, B, 0.22);
      const vf = hex(fo.vorhang || "#b8433a");
      for (const s of [0, 1]) {
        const vw = gw * 0.2, vx = (s ? gx + gw - vw : gx) + pV[0] - pT[0], vy = gy + pV[1] - pT[1] - 0.04;
        const gv = g.createLinearGradient(vx, 0, vx + vw, 0);
        for (let i = 0; i <= 6; i++) gv.addColorStop(i / 6, rgb(hell(vf, i % 2 ? -0.22 : 0.02)));
        g.fillStyle = gv;
        g.beginPath();
        if (s) { g.moveTo(vx + vw, vy); g.lineTo(vx, vy); g.quadraticCurveTo(vx + vw * 0.25, vy + gh * 0.6, vx + vw * 0.55, vy + gh + 0.1); g.lineTo(vx + vw, vy + gh + 0.1); }
        else { g.moveTo(vx, vy); g.lineTo(vx + vw, vy); g.quadraticCurveTo(vx + vw * 0.75, vy + gh * 0.6, vx + vw * 0.45, vy + gh + 0.1); g.lineTo(vx, vy + gh + 0.1); }
        g.closePath(); g.fill();
      }
      /* weiße Scheibengardine im unteren Drittel */
      const sy0 = gy + gh * 0.62;
      const gs = g.createLinearGradient(gx, 0, gx + gw, 0);
      const nf = Math.max(3, Math.round(gw / 0.07));
      for (let i = 0; i <= nf; i++) gs.addColorStop(i / nf, i % 2 ? "rgba(212,210,204,0.88)" : "rgba(246,245,240,0.9)");
      g.fillStyle = gs; g.fillRect(gx, sy0, gw, gy + gh - sy0);
    }
    if (fo.deko && px > 10) schwibbogen(g, F, gx, gy, gw, gh, false);
    /* Glas: Himmel und Schnee spiegeln sich */
    const nM = kreuz(F.flaeche.u, F.flaeche.v);
    const cosT = klemm(dot(B.e, nM), 0, 1);
    const anteil = (0.48 + 0.2 * Math.pow(1 - cosT, 1.5)) * (0.3 + 0.7 * tag);
    const himmel = (F.zeit && F.zeit.himmel) || ["#bcd3ea", "#e9f1f8"];
    const hO = misch(hex(himmel[0]), [190, 208, 230], tag * 0.6);
    const boden = F.jahr === "winter" ? [206, 214, 226] : [104, 118, 104];
    const unten = boden.map((v) => v * (0.35 + 0.65 * tag));
    const sp = g.createLinearGradient(0, gy, 0, gy + gh);
    sp.addColorStop(0, rgb(hO, anteil.toFixed(3))); sp.addColorStop(0.55, rgb(misch(hO, unten, 0.6), (anteil * 0.95).toFixed(3))); sp.addColorStop(1, rgb(unten, (anteil * 0.9).toFixed(3)));
    g.fillStyle = sp; g.fillRect(gx, gy, gw, gh);
    if (px > 9) {
      g.fillStyle = "rgba(255,255,255," + (0.07 + 0.1 * tag).toFixed(3) + ")";
      g.beginPath(); g.moveTo(gx + gw * 0.12, gy + gh); g.lineTo(gx + gw * 0.5, gy); g.lineTo(gx + gw * 0.66, gy); g.lineTo(gx + gw * 0.28, gy + gh); g.closePath(); g.fill();
    }
    /* Rahmen, Flügel, Sprossen */
    const fl = fo.fluegel || 2;
    const [sps, spz] = fo.sprossen || [1, 3];
    const rf = rgb(rahmen), rd = rgb(hell(rahmen, -0.3)), rh = rgb(hell(rahmen, 0.2));
    const leiste = (x0, y0, x1, y1, b) => {
      g.fillStyle = rf;
      if (Math.abs(x1 - x0) > Math.abs(y1 - y0)) { g.fillRect(x0, y0 - b / 2, x1 - x0, b); if (px > 14) { g.fillStyle = rd; g.fillRect(x0, y0 + b / 2 - b * 0.25, x1 - x0, b * 0.25); g.fillStyle = rh; g.fillRect(x0, y0 - b / 2, x1 - x0, b * 0.18); } }
      else { g.fillRect(x0 - b / 2, y0, b, y1 - y0); if (px > 14) { g.fillStyle = rd; g.fillRect(x0 + b / 2 - b * 0.22, y0, b * 0.22, y1 - y0); g.fillStyle = rh; g.fillRect(x0 - b / 2, y0, b * 0.16, y1 - y0); } }
    };
    leiste(fx, fy + rb / 2, fx + w, fy + rb / 2, rb);
    leiste(fx, fy + h - rb / 2, fx + w, fy + h - rb / 2, rb);
    leiste(fx + rb / 2, fy, fx + rb / 2, fy + h, rb);
    leiste(fx + w - rb / 2, fy, fx + w - rb / 2, fy + h, rb);
    if (px > 6) {
      for (let i = 1; i < fl; i++) leiste(fx + w * i / fl, fy, fx + w * i / fl, fy + h, rb * 0.9);
      const sb = Math.max(rb * 0.42, 0.9 / px);
      for (let i = 0; i < fl; i++) {
        const ax = fx + w * i / fl, aw = w / fl;
        for (let k = 1; k < sps; k++) leiste(ax + aw * k / sps, fy, ax + aw * k / sps, fy + h, sb);
        for (let k = 1; k < spz; k++) leiste(ax, fy + h * k / spz, ax + aw, fy + h * k / spz, sb);
      }
    }
    /* Schatten der Laibung auf Rahmen und Glas */
    const sv = F.schatten(tiefe);
    g.fillStyle = "rgba(20,22,36,0.36)";
    if (sv) {
      const [dx, dy] = sv;
      g.beginPath(); g.moveTo(x - 1, y); g.lineTo(x + w + 1, y); g.lineTo(x + w + 1 + dx, y + dy); g.lineTo(x - 1 + dx, y + dy); g.closePath(); g.fill();
      g.beginPath();
      if (dx > 0) { g.moveTo(x, y); g.lineTo(x + dx, y + dy); g.lineTo(x + dx, y + h + 1); g.lineTo(x, y + h + 1); }
      else { g.moveTo(x + w, y); g.lineTo(x + w + dx, y + dy); g.lineTo(x + w + dx, y + h + 1); g.lineTo(x + w, y + h + 1); }
      g.closePath(); g.fill();
    } else { g.fillStyle = "rgba(20,22,36,0.16)"; g.fillRect(x, y, w, h); }
    g.restore();
    /* Gitter vor dem Fenster (Erdgeschoss der Mühle) */
    if (fo.gitter && px > 7) {
      const pG = parallaxe(F, B, 0.05);
      g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
      const nS = Math.max(2, Math.round(w / 0.16));
      const sb = Math.max(0.016, 0.9 / px);
      for (let i = 1; i < nS; i++) {
        const sx = x + w * i / nS + pG[0];
        g.fillStyle = "rgb(40,38,38)"; g.fillRect(sx - sb / 2, y - 0.1, sb, h + 0.2);
        if (px > 20) { g.fillStyle = "rgba(255,255,255,0.18)"; g.fillRect(sx - sb / 2, y - 0.1, sb * 0.3, h + 0.2); }
      }
      g.fillStyle = "rgb(40,38,38)"; g.fillRect(x - 0.1, y + h * 0.5 + pG[1] - sb / 2, w + 0.2, sb);
      g.restore();
    }
  }
  /* Fensterlicht (im Leuchten-Durchgang) */
  function fensterLicht(g, F, B, x, y, w, h, fo) {
    if (fo.leer || !fo.an) return;
    const a = F.nacht * fo.an;
    if (a <= 0.01) return;
    const pT = parallaxe(F, B, fo.tiefe || 0.14);
    const rb = Math.min(0.055, w * 0.08);
    g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
    const gx = x + pT[0] + rb, gy = y + pT[1] + rb, gw = w - 2 * rb, gh = h - 2 * rb;
    const farbe = fo.farbe || [255, 192, 116];
    const gr = g.createRadialGradient(gx + gw / 2, gy + gh * 0.8, 0, gx + gw / 2, gy + gh * 0.6, Math.max(gw, gh) * 1.1);
    gr.addColorStop(0, "rgba(255,226,170," + (0.95 * a).toFixed(3) + ")");
    gr.addColorStop(0.6, "rgba(" + farbe.join(",") + "," + (0.82 * a).toFixed(3) + ")");
    gr.addColorStop(1, "rgba(" + farbe.map((v) => (v * 0.55) | 0).join(",") + "," + (0.75 * a).toFixed(3) + ")");
    g.fillStyle = gr; g.fillRect(gx, gy, gw, gh);
    /* Vorhänge als warme Silhouetten, Sprossen dunkel davor */
    g.fillStyle = "rgba(150,62,40," + (0.45 * a).toFixed(3) + ")";
    g.fillRect(gx, gy, gw * 0.18, gh); g.fillRect(gx + gw * 0.82, gy, gw * 0.18, gh);
    if (fo.deko) schwibbogen(g, F, gx, gy, gw, gh, true);
    const fl = fo.fluegel || 2, [sps, spz] = fo.sprossen || [1, 3];
    g.fillStyle = "rgba(50,34,26," + (0.9 * a).toFixed(3) + ")";
    for (let i = 1; i < fl; i++) g.fillRect(x + pT[0] + w * i / fl - rb * 0.45, y + pT[1], rb * 0.9, h);
    for (let i = 0; i < fl; i++) {
      const ax = x + pT[0] + w * i / fl, aw = w / fl;
      for (let k = 1; k < sps; k++) g.fillRect(ax + aw * k / sps - rb * 0.2, y + pT[1], rb * 0.4, h);
      for (let k = 1; k < spz; k++) g.fillRect(ax, y + pT[1] + h * k / spz - rb * 0.2, aw, rb * 0.4);
    }
    g.restore();
    if (fo.gitter) {
      const pG = parallaxe(F, B, 0.05);
      const nS = Math.max(2, Math.round(w / 0.16));
      g.fillStyle = "rgba(20,16,14," + (0.85 * a).toFixed(3) + ")";
      for (let i = 1; i < nS; i++) g.fillRect(x + w * i / nS + pG[0] - 0.009, y, 0.018, h);
    }
    F.leuchtPunkt(x + w / 2, y + h * 0.55, Math.max(w, h) * 1.25, farbe.join(","), 0.5 * fo.an);
  }
  /* Schwibbogen (erzgebirgischer Lichterbogen) im Fenster */
  function schwibbogen(g, F, gx, gy, gw, gh, leuchtend) {
    const bx = gx + gw * 0.12, bw = gw * 0.76, by = gy + gh * 0.93, bh = gh * 0.34;
    if (!leuchtend) {
      g.strokeStyle = "rgba(30,24,20,0.9)"; g.lineWidth = Math.max(0.012, 1.2 / F.px);
      g.beginPath(); g.moveTo(bx, by); g.quadraticCurveTo(bx + bw / 2, by - bh * 1.5, bx + bw, by); g.stroke();
      g.fillStyle = "rgba(30,24,20,0.9)"; g.fillRect(bx - 0.02, by, bw + 0.04, 0.02);
      /* Figuren unter dem Bogen */
      g.beginPath(); g.moveTo(bx + bw * 0.3, by); g.lineTo(bx + bw * 0.35, by - bh * 0.45); g.lineTo(bx + bw * 0.4, by); g.fill();
      g.beginPath(); g.moveTo(bx + bw * 0.55, by); g.lineTo(bx + bw * 0.62, by - bh * 0.6); g.lineTo(bx + bw * 0.69, by); g.fill();
    }
    const n = 7;
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n, cx = bx + bw * t;
      const cy = by - bh * 0.3 - Math.sin(t * Math.PI) * bh * 0.75;
      if (leuchtend) {
        const gg = g.createRadialGradient(cx, cy, 0, cx, cy, 0.05);
        gg.addColorStop(0, "rgba(255,244,200,1)"); gg.addColorStop(1, "rgba(255,190,90,0)");
        g.fillStyle = gg; g.fillRect(cx - 0.05, cy - 0.05, 0.1, 0.1);
      } else { g.fillStyle = "rgba(236,222,190,0.9)"; g.fillRect(cx - 0.004, cy, 0.008, 0.03); }
    }
  }
  /* Klappläden (offen, an der Wand) */
  function laedenMalen(g, F, x, y, w, h, farbe, saat) {
    const f = hex(farbe);
    const lw = w / 2 * 0.98;
    for (const s of [0, 1]) {
      const lx = s ? x + w + 0.03 : x - lw - 0.03;
      const sv = F.schatten(0.04);
      if (sv) { g.fillStyle = "rgba(30,30,40,0.25)"; g.fillRect(lx + sv[0], y + sv[1], lw, h); }
      const bretter = 3;
      const rng = zufall(saat + s);
      for (let i = 0; i < bretter; i++) {
        const c = PI.streu(f, rng, 0.05);
        g.fillStyle = rgb(c); g.fillRect(lx + lw * i / bretter, y, lw / bretter, h);
        g.fillStyle = rgb(hell(c, -0.3)); g.fillRect(lx + lw * (i + 1) / bretter - 0.006, y, 0.006, h);
      }
      g.fillStyle = rgb(hell(f, -0.12));
      g.fillRect(lx, y + h * 0.12, lw, 0.06); g.fillRect(lx, y + h * 0.82, lw, 0.06);
      if (F.px > 20) {
        const hx = lx + lw / 2, hy = y + h * 0.45, r = 0.03;
        g.fillStyle = "rgba(25,20,18,0.85)";
        g.beginPath(); g.moveTo(hx, hy + r * 1.6); g.bezierCurveTo(hx - r * 2, hy + r * 0.2, hx - r * 0.9, hy - r * 1.1, hx, hy - r * 0.1); g.bezierCurveTo(hx + r * 0.9, hy - r * 1.1, hx + r * 2, hy + r * 0.2, hx, hy + r * 1.6); g.fill();
      }
      g.fillStyle = "rgba(35,32,30,0.9)";
      const bs = s ? lx : lx + lw - 0.14;
      g.fillRect(bs, y + h * 0.14, 0.14, 0.018); g.fillRect(bs, y + h * 0.84, 0.14, 0.018);
    }
  }
  /* Sandsteingewände um ein Erdgeschossfenster (vor der Mauer) */
  function gewaendeMalen(g, F, B, x, y, w, h, opt) {
    opt = opt || {};
    const b = 0.15, c = opt.farbe || SANDSTEIN;
    const rng = zufall(((x * 100) | 0) + 7);
    const stein = (sx, sy, sw, sh) => {
      const cc = PI.streu(c, rng, 0.08);
      g.fillStyle = rgb(cc); g.fillRect(sx, sy, sw, sh);
      if (F.px > 18) { g.fillStyle = "rgba(255,236,214,0.2)"; g.fillRect(sx, sy, sw, Math.max(0.006, 1 / F.px)); g.fillStyle = "rgba(50,24,16,0.28)"; g.fillRect(sx, sy + sh - Math.max(0.006, 1 / F.px), sw, Math.max(0.006, 1 / F.px)); }
    };
    /* Gewändesteine seitlich (zwei je Seite), Sturz, Sohlbank */
    stein(x - b, y - 0.02, b, h * 0.5); stein(x - b, y + h * 0.5 - 0.01, b, h * 0.5 + 0.03);
    stein(x + w, y - 0.02, b, h * 0.55); stein(x + w, y + h * 0.55 - 0.01, b, h * 0.45 + 0.03);
    stein(x - b - 0.02, y - 0.2, w + 2 * b + 0.04, 0.2);
    /* Sohlbank steht 6 cm vor: Oberseite sichtbar, Schatten darunter */
    const vor = 0.06;
    const pO = parallaxe(F, B, -vor);
    const sv = F.schatten(vor);
    const sy = y + h, sx0 = x - b - 0.04, sw = w + 2 * b + 0.08;
    if (sv) { g.fillStyle = "rgba(30,20,20,0.3)"; g.fillRect(sx0 + sv[0], sy + 0.1 + Math.max(0, sv[1]) * 0.3, sw, Math.max(0.02, sv[1] * 0.9)); }
    rausch(g, x - b, y - 0.2, w + 2 * b, h + 0.2, 0.8, 0.2, 44, 3);
    stein(sx0, sy, sw, 0.12);
    if (pO[1] < 0) {
      g.fillStyle = rgb(hell(c, 0.14)); poly(g, [[sx0, sy], [sx0 + sw, sy], [sx0 + sw + pO[0], sy + pO[1]], [sx0 + pO[0], sy + pO[1]]]); g.fill();
      if (opt.winter) { g.fillStyle = "rgb(244,247,252)"; poly(g, [[sx0, sy + 0.01], [sx0 + sw, sy + 0.01], [sx0 + sw + pO[0], sy + pO[1] - 0.03], [sx0 + pO[0], sy + pO[1] - 0.03]]); g.fill(); }
    }
    if (opt.winter) { g.fillStyle = "rgb(244,247,252)"; PI.rundRechteck(g, x - b - 0.03, y - 0.24, w + 2 * b + 0.06, 0.06, 0.02); g.fill(); }
  }

  /* =====================================================================
     FACHWERK-PLAN (hessisch): Schwelle, Ständer, Rähm, Riegel, Mann-
     Figuren an den Ecken, Andreaskreuze in den Brüstungen.
     Wandkoordinaten: a (entlang, links von außen), z (Höhe).
     ===================================================================== */
  function fwStock(L, z0, z1, felder, opt) {
    opt = opt || {};
    const n = felder.length, bw = L / n;
    const H = [], FE = [];
    const zS = z0 + 0.2, zR = z1 - 0.18;
    const holz = (a0, h0, a1, h1, b, art) => H.push({ p0: [a0, h0], p1: [a1, h1], b: b, art: art });
    holz(-0.02, z0 + 0.1, L + 0.02, z0 + 0.1, 0.2, "schwelle");
    holz(-0.02, z1 - 0.09, L + 0.02, z1 - 0.09, 0.18, "raehm");
    for (let k = 0; k <= n; k++) {
      const a = klemm(k * bw, 0.1, L - 0.1);
      holz(a, zS - 0.02, a, zR + 0.02, k === 0 || k === n ? 0.2 : 0.17, "staender");
    }
    const zB = zS + (opt.bruestung || 0.78), fh = opt.fensterH || 1.15;
    for (let i = 0; i < n; i++) {
      const aL = i * bw + (i === 0 ? 0.2 : 0.085), aR = (i + 1) * bw - (i === n - 1 ? 0.2 : 0.085);
      const t = felder[i];
      const zM = (zS + zR) / 2;
      if (t === "F" || t === "FX") {
        holz(aL - 0.02, zB - 0.065, aR + 0.02, zB - 0.065, 0.13, "riegel");
        holz(aL - 0.02, zB + fh + 0.065, aR + 0.02, zB + fh + 0.065, 0.13, "riegel");
        FE.push({ a: aL + 0.02, z: zB, w: aR - aL - 0.04, h: fh });
        if (t === "FX") {
          /* Andreaskreuz in der Brüstung */
          holz(aL + 0.02, zS + 0.02, aR - 0.02, zB - 0.13, 0.12, "strebe");
          holz(aR - 0.02, zS + 0.02, aL + 0.02, zB - 0.13, 0.12, "strebe");
        }
      } else if (t === "M") {
        /* halber Mann an der Ecke: Fußstrebe und Kopfwinkelholz */
        const links = i === 0;
        const aE = links ? aL : aR, aI = links ? aR : aL, sg = links ? 1 : -1;
        holz(aL - 0.02, zM, aR + 0.02, zM, 0.13, "riegel");
        holz(aE, zS + 1.55, aE + sg * 0.95, zS + 0.02, 0.15, "strebe");
        holz(aE, zR - 0.5, aE + sg * 0.5, zR - 0.02, 0.13, "strebe");
        void aI;
      } else if (t === "X") {
        holz(aL - 0.02, zB - 0.065, aR + 0.02, zB - 0.065, 0.13, "riegel");
        holz(aL + 0.02, zS + 0.02, aR - 0.02, zB - 0.13, 0.12, "strebe");
        holz(aR - 0.02, zS + 0.02, aL + 0.02, zB - 0.13, 0.12, "strebe");
        holz(aL - 0.02, zB + fh + 0.065, aR + 0.02, zB + fh + 0.065, 0.13, "riegel");
      } else if (t === "G") {
        holz(aL - 0.02, zM, aR + 0.02, zM, 0.13, "riegel");
        holz(aL + 0.02, zS + 0.02, aR - 0.02, zR - 0.02, 0.14, "strebe");
      } else if (t === "T") {
        /* Ladeluke/Tür im Stock: nur Sturzriegel */
        holz(aL - 0.02, zS + 2.0, aR + 0.02, zS + 2.0, 0.13, "riegel");
        FE.push({ a: aL + 0.02, z: zS + 0.02, w: aR - aL - 0.04, h: 1.9, tuer: true });
      }
    }
    return { H: H, F: FE };
  }
  /* Giebeldreieck (Trapez unter dem Krüppelwalm) */
  function fwGiebel(L, luke) {
    const H = [], FE = [];
    const holz = (a0, h0, a1, h1, b, art) => H.push({ p0: [a0, h0], p1: [a1, h1], b: b, art: art });
    const aG0 = YW - YG, aG1 = L - aG0;
    /* Dachbalken (Giebelschwelle), Walmbalken oben, Ortsparren */
    holz(-0.02, (ZO + ZT) / 2, L + 0.02, (ZO + ZT) / 2, ZT - ZO, "schwelle");
    holz(aG0 - 0.2, ZG - 0.09, aG1 + 0.2, ZG - 0.09, 0.18, "raehm");
    const st = (ZG - ZT) / aG0;
    const off = 0.09 * Math.hypot(1, st);
    holz(0, ZT - 0.02 + off - 0.09, aG0 + 0.1, ZG + 0.1 * st + off - 0.09, 0.18, "ortsparren");
    holz(L, ZT - 0.02 + off - 0.09, aG1 - 0.1, ZG + 0.1 * st + off - 0.09, 0.18, "ortsparren");
    /* Ständer */
    const zK = ZT + 1.35;
    const m = L / 2;
    const lw = luke ? 1.1 : 0.72, lh = luke ? 1.4 : 0.85, lz = luke ? ZT + 0.55 : ZT + 0.8;
    holz(aG0, ZT, aG0, ZG, 0.17, "staender");
    holz(aG1, ZT, aG1, ZG, 0.17, "staender");
    holz(m - lw / 2 - 0.085, ZT, m - lw / 2 - 0.085, ZG, 0.17, "staender");
    holz(m + lw / 2 + 0.085, ZT, m + lw / 2 + 0.085, ZG, 0.17, "staender");
    /* Riegel (Kehlriegel) */
    holz(0.3, zK, aG0, zK, 0.13, "riegel");
    holz(aG1, zK, L - 0.3, zK, 0.13, "riegel");
    holz(aG0, zK, m - lw / 2 - 0.17, zK, 0.13, "riegel");
    holz(m + lw / 2 + 0.17, zK, aG1, zK, 0.13, "riegel");
    holz(m - lw / 2 - 0.1, lz - 0.065, m + lw / 2 + 0.1, lz - 0.065, 0.13, "riegel");
    holz(m - lw / 2 - 0.1, lz + lh + 0.065, m + lw / 2 + 0.1, lz + lh + 0.065, 0.13, "riegel");
    /* Streben in den Seitenfeldern */
    holz(aG0 - 0.1, ZT + 0.1, aG0 - 0.9, zK - 0.07, 0.13, "strebe");
    holz(aG1 + 0.1, ZT + 0.1, aG1 + 0.9, zK - 0.07, 0.13, "strebe");
    holz(aG0 + 0.1, ZT + 0.1, m - lw / 2 - 0.17, zK - 0.07, 0.13, "strebe");
    holz(aG1 - 0.1, ZT + 0.1, m + lw / 2 + 0.17, zK - 0.07, 0.13, "strebe");
    FE.push({ a: m - lw / 2, z: lz, w: lw, h: lh, luke: !!luke });
    return { H: H, F: FE };
  }
  const HOLZ_ORDNUNG = { riegel: 0, strebe: 1, staender: 2, ortsparren: 3, schwelle: 4, raehm: 4 };
  /* Hölzer malen (Flächenkoordinaten: y = ztop − z) */
  function hoelzerMalen(g, F, H, ztop, c, saat, opt) {
    opt = opt || {};
    const px = F.px;
    const liste = H.slice().sort((a, b) => HOLZ_ORDNUNG[a.art] - HOLZ_ORDNUNG[b.art]);
    const quad = (m, d) => {
      const x0 = m.p0[0], y0 = ztop - m.p0[1], x1 = m.p1[0], y1 = ztop - m.p1[1];
      const L = Math.hypot(x1 - x0, y1 - y0) || 1, nx = -(y1 - y0) / L * (m.b / 2 + (d || 0)), ny = (x1 - x0) / L * (m.b / 2 + (d || 0));
      return [[x0 + nx, y0 + ny], [x1 + nx, y1 + ny], [x1 - nx, y1 - ny], [x0 - nx, y0 - ny]];
    };
    /* Schatten der Hölzer auf den Putz (2,5 cm vor) */
    const sv = F.schatten(0.025);
    if (sv && !opt.ohneSchatten) {
      g.fillStyle = "rgba(40,28,22,0.3)";
      g.beginPath();
      for (const m of liste) { const q = quad(m); g.moveTo(q[0][0] + sv[0], q[0][1] + sv[1]); for (let i = 1; i < 4; i++) g.lineTo(q[i][0] + sv[0], q[i][1] + sv[1]); g.closePath(); }
      g.fill();
    }
    const rng = zufall(saat);
    for (const m of liste) {
      if (opt.nur && !opt.nur(m)) continue;
      const q = quad(m);
      const cc = PI.streu(c, rng, 0.07);
      g.fillStyle = rgb(cc);
      poly(g, q); g.fill();
      const x0 = m.p0[0], y0 = ztop - m.p0[1], x1 = m.p1[0], y1 = ztop - m.p1[1];
      const L = Math.hypot(x1 - x0, y1 - y0);
      if (px * m.b > 3) {
        g.save(); poly(g, q); g.clip();
        g.translate(x0, y0); g.rotate(Math.atan2(y1 - y0, x1 - x0));
        /* Kantenlicht und Schattenkante, Maserung, Risse */
        const gr = g.createLinearGradient(0, -m.b / 2, 0, m.b / 2);
        gr.addColorStop(0, "rgba(255,220,190,0.14)"); gr.addColorStop(0.2, "rgba(255,220,190,0)"); gr.addColorStop(0.8, "rgba(0,0,0,0)"); gr.addColorStop(1, "rgba(20,8,4,0.3)");
        g.fillStyle = gr; g.fillRect(-0.1, -m.b / 2, L + 0.2, m.b);
        if (px > 22) {
          g.lineWidth = Math.max(0.003, 0.8 / px);
          const nl = Math.round(m.b * 40);
          for (let i = 0; i < nl; i++) {
            const yy = -m.b / 2 + m.b * (i + 0.5) / nl;
            g.strokeStyle = rgb(hell(cc, -0.3 - rng() * 0.2), 0.2 + rng() * 0.2);
            g.beginPath(); g.moveTo(rng() * L * 0.2, yy); for (let k = 1; k <= 4; k++) g.lineTo(L * k / 4, yy + (rng() - 0.5) * m.b * 0.08); g.stroke();
          }
          if (px > 38) {
            g.strokeStyle = rgb(hell(cc, -0.6), 0.75); g.lineWidth = Math.max(0.004, 1.1 / px);
            const risse = Math.floor(L * 0.9 * rng() + (rng() < 0.4 ? 1 : 0));
            for (let i = 0; i < risse; i++) { const sx = rng() * L * 0.8, yy = (rng() - 0.5) * m.b * 0.4, len = 0.15 + rng() * 0.5; g.beginPath(); g.moveTo(sx, yy); g.quadraticCurveTo(sx + len / 2, yy + (rng() - 0.5) * 0.015, Math.min(L, sx + len), yy); g.stroke(); }
            /* Holznägel an den Zapfen */
            if (m.art !== "schwelle" && m.art !== "raehm" && L > 0.5) {
              g.fillStyle = rgb(hell(cc, -0.4));
              for (const s of [m.b * 0.6, L - m.b * 0.6]) { g.beginPath(); g.arc(s, 0, m.b * 0.09, 0, TAU); g.fill(); }
            }
          }
        }
        g.restore();
      }
      if (px > 10) { g.strokeStyle = rgb(hell(cc, -0.55), 0.5); g.lineWidth = Math.max(0.004, 0.9 / px); poly(g, q); g.stroke(); }
    }
  }

  /* =====================================================================
     WÄNDE DES HAUSES
     ===================================================================== */
  const WAENDE = (function () {
    const S = fwStock(LH, ZE, ZO, ["M", "F", "X", "F", "F", "X", "F", "F", "M"]);
    const N = fwStock(LH, ZE, ZO, ["M", "G", "F", "X", "F", "X", "F", "G", "M"]);
    const O = fwStock(LG, ZE, ZO, ["M", "F", "G", "G", "F", "M"]);
    const W = fwStock(LG, ZE, ZO, ["M", "F", "X", "X", "F", "M"]);
    const OG = fwGiebel(LG, false), WG = fwGiebel(LG, true);
    return [
      {
        name: "sued", n: [0, 1, 0], o: [XW0, YW, ZT], L: LH, top: ZT, fw: S, saat: 11,
        eg: [{ a: 1.35, z: 1.05, w: 0.8, h: 1.05 }, { a: 3.68, z: 1.05, w: 0.8, h: 1.05 }, { a: 7.18, z: 1.05, w: 0.8, h: 1.05 }, { a: 9.2, z: 1.3, w: 0.6, h: 0.6, klein: true }],
        tuer: { a: 5.03, w: 1.6, h: 2.55, bogen: true, jahr: "1786" }
      },
      {
        name: "nord", n: [0, -1, 0], o: [XW1, -YW, ZT], L: LH, top: ZT, fw: N, saat: 12,
        eg: [{ a: 2.55, z: 1.1, w: 0.75, h: 1.0 }, { a: 4.9, z: 1.1, w: 0.75, h: 1.0 }],
        tuer: { a: 6.2, w: 1.0, h: 2.05, bogen: false }
      },
      {
        name: "ost", n: [1, 0, 0], o: [XW1, YW, ZG], L: LG, top: ZG, fw: O, giebel: OG, saat: 13,
        eg: [{ a: 0.4, z: 1.1, w: 0.65, h: 0.9 }], welle: true
      },
      {
        name: "west", n: [-1, 0, 0], o: [XW0, -YW, ZG], L: LG, top: ZG, fw: W, giebel: WG, saat: 14,
        eg: [{ a: 1.2, z: 1.05, w: 0.8, h: 1.05 }, { a: 6.0, z: 1.05, w: 0.8, h: 1.05 }],
        tuer: { a: 3.5, w: 1.05, h: 2.1, bogen: false }
      }
    ];
  })();
  /* Umriss einer Giebelwand (Trapez unter dem Krüppelwalm) */
  function giebelUmriss(ztop) {
    return [[0, ztop - ZT], [YW - YG, 0], [YW + YG, 0], [LG, ztop - ZT], [LG, ztop], [0, ztop]];
  }

  /* Tür mit Sandsteingewände (Rundbogen), Bohlentür mit Beschlägen */
  function tuerMalen(g, F, B, x, y, w, h, T, S) {
    const px = F.px, bogen = T.bogen ? w / 2 : 0;
    const tiefe = 0.22, gw = 0.2;
    const rng = zufall(((x * 100) | 0) + 3);
    /* Gewände */
    g.fillStyle = rgb(SANDSTEIN);
    g.beginPath(); g.moveTo(x - gw, y + h); g.lineTo(x - gw, y + bogen);
    if (bogen) g.arc(x + w / 2, y + bogen, w / 2 + gw, Math.PI, 0); else { g.lineTo(x - gw, y - gw); g.lineTo(x + w + gw, y - gw); }
    g.lineTo(x + w + gw, y + h); g.closePath(); g.fill();
    if (px > 12) {
      /* Fugen der Bogensteine und Gewändesteine */
      g.strokeStyle = "rgba(60,30,22,0.5)"; g.lineWidth = Math.max(0.006, 1 / px);
      g.beginPath();
      if (bogen) for (let i = 1; i < 7; i++) { const a = Math.PI + Math.PI * i / 7; g.moveTo(x + w / 2 + Math.cos(a) * w / 2, y + bogen + Math.sin(a) * w / 2); g.lineTo(x + w / 2 + Math.cos(a) * (w / 2 + gw), y + bogen + Math.sin(a) * (w / 2 + gw)); }
      for (const hh of [0.35, 0.65]) { g.moveTo(x - gw, y + bogen + (h - bogen) * hh); g.lineTo(x, y + bogen + (h - bogen) * hh); g.moveTo(x + w, y + bogen + (h - bogen) * hh + 0.1); g.lineTo(x + w + gw, y + bogen + (h - bogen) * hh + 0.1); }
      g.stroke();
      rausch(g, x - gw, y - gw, w + 2 * gw, h + gw, 0.8, 0.25, 44, 3);
      g.fillStyle = "rgba(255,236,214,0.18)"; g.fillRect(x - gw, y + bogen, 0.02, h - bogen);
    }
    /* Schlussstein mit Jahreszahl */
    if (bogen && T.jahr) {
      g.fillStyle = rgb(hell(SANDSTEIN, 0.06));
      g.beginPath(); g.moveTo(x + w / 2 - 0.13, y - gw - 0.04); g.lineTo(x + w / 2 + 0.13, y - gw - 0.04); g.lineTo(x + w / 2 + 0.09, y + 0.06); g.lineTo(x + w / 2 - 0.09, y + 0.06); g.closePath(); g.fill();
      if (px > 30) { g.fillStyle = "rgba(60,30,22,0.8)"; g.font = "bold 0.075px Georgia, 'Times New Roman', serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(T.jahr, x + w / 2, y - 0.08); }
      /* Mühlrad-Zeichen der Müllerzunft im Schlussstein */
      if (px > 45) {
        const cx = x + w / 2, cy = y - 0.17, r = 0.045;
        g.strokeStyle = "rgba(60,30,22,0.75)"; g.lineWidth = 0.008;
        g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.stroke();
        g.beginPath(); for (let i = 0; i < 8; i++) { const a = i * TAU / 8; g.moveTo(cx, cy); g.lineTo(cx + Math.cos(a) * r * 1.35, cy + Math.sin(a) * r * 1.35); } g.stroke();
      }
    }
    /* Türöffnung: Laibung und das Türblatt in der Tiefe */
    const pT = parallaxe(F, B, tiefe);
    g.save();
    g.beginPath(); g.moveTo(x, y + h); g.lineTo(x, y + bogen); if (bogen) g.arc(x + w / 2, y + bogen, w / 2, Math.PI, 0); else { g.lineTo(x, y); g.lineTo(x + w, y); } g.lineTo(x + w, y + h); g.closePath(); g.clip();
    g.fillStyle = rgb(hell(SANDSTEIN, -0.12)); g.fillRect(x - 0.1, y - 0.1, w + 0.2, h + 0.2);
    g.translate(pT[0], pT[1]);
    if (T.leer) {
      g.fillStyle = "rgb(30,24,20)"; g.fillRect(x, y, w, h);
    } else {
      const f = hex(T.farbe || "#5e3a22");
      const nb = Math.max(4, Math.round(w / 0.16));
      for (let i = 0; i < nb; i++) {
        const c = PI.streu(f, rng, 0.07);
        const gr = g.createLinearGradient(x + w * i / nb, 0, x + w * (i + 1) / nb, 0);
        gr.addColorStop(0, rgb(hell(c, 0.05))); gr.addColorStop(1, rgb(hell(c, -0.12)));
        g.fillStyle = gr; g.fillRect(x + w * i / nb, y - 0.1, w / nb, h + 0.2);
      }
      if (px > 10) {
        g.fillStyle = "rgba(20,12,8,0.5)";
        for (let i = 1; i < nb; i++) g.fillRect(x + w * i / nb - 0.005, y, 0.01, h);
        /* zweiflügelig: Mittelstoß */
        if (w > 1.2) { g.fillStyle = "rgba(20,12,8,0.7)"; g.fillRect(x + w / 2 - 0.012, y, 0.024, h); }
      }
      rausch(g, x, y, w, h, 0.9, 0.22, 12, 4);
      /* Beschläge: Langbänder, Ring, Schloss */
      g.fillStyle = "#25201d";
      for (const yy of [y + bogen + 0.25, y + h - 0.4]) {
        if (w > 1.2) {
          g.beginPath(); g.moveTo(x, yy - 0.025); g.lineTo(x + w * 0.4, yy - 0.012); g.arc(x + w * 0.4, yy, 0.013, -Math.PI / 2, Math.PI / 2); g.lineTo(x, yy + 0.025); g.closePath(); g.fill();
          g.beginPath(); g.moveTo(x + w, yy - 0.025); g.lineTo(x + w * 0.6, yy - 0.012); g.arc(x + w * 0.6, yy, 0.013, -Math.PI / 2, Math.PI / 2, true); g.lineTo(x + w, yy + 0.025); g.closePath(); g.fill();
        } else {
          g.beginPath(); g.moveTo(x, yy - 0.025); g.lineTo(x + w * 0.65, yy - 0.012); g.arc(x + w * 0.65, yy, 0.013, -Math.PI / 2, Math.PI / 2); g.lineTo(x, yy + 0.025); g.closePath(); g.fill();
        }
      }
      if (px > 20) {
        const kx = w > 1.2 ? x + w / 2 + 0.12 : x + w - 0.14, ky = y + h * 0.55;
        g.strokeStyle = "#2a2420"; g.lineWidth = 0.014; g.beginPath(); g.arc(kx, ky + 0.06, 0.05, 0, TAU); g.stroke();
        g.fillStyle = "#2a2420"; g.beginPath(); g.arc(kx, ky, 0.022, 0, TAU); g.fill();
      }
      if (S && S.winter && T.kranz && px > 8) tuerKranzMalen(g, F, x + w / 2, y + bogen + (h - bogen) * 0.3, Math.min(0.26, w * 0.2));
    }
    g.restore();
    /* Schatten der Laibung */
    const sv = F.schatten(tiefe);
    if (sv) {
      g.save(); g.beginPath(); g.moveTo(x, y + h); g.lineTo(x, y + bogen); if (bogen) g.arc(x + w / 2, y + bogen, w / 2, Math.PI, 0); else { g.lineTo(x, y); g.lineTo(x + w, y); } g.lineTo(x + w, y + h); g.closePath(); g.clip();
      g.fillStyle = "rgba(20,15,22,0.36)";
      g.beginPath(); g.rect(x - 1, y - 1, w + 2, h + 2);
      g.moveTo(x + sv[0], y + h + 1); g.lineTo(x + sv[0], y + bogen + sv[1]); if (bogen) g.arc(x + w / 2 + sv[0], y + bogen + sv[1], w / 2, Math.PI, 0); else { g.lineTo(x + sv[0], y + sv[1]); g.lineTo(x + w + sv[0], y + sv[1]); } g.lineTo(x + w + sv[0], y + h + 1); g.closePath();
      g.fill("evenodd");
      g.restore();
    }
    /* Stufe aus Sandstein */
    g.fillStyle = rgb(hell(SANDSTEIN, 0.05)); g.fillRect(x - 0.22, y + h - 0.04, w + 0.44, 0.06);
    if (S && S.winter && T.girlande && !T.leer && px > 8) girlandeBogen(g, F, x, y, w, h, bogen, gw);
  }
  /* Türkranz aus Tannengrün mit roter Schleife */
  function tuerKranzMalen(g, F, cx, cy, r) {
    const rng = zufall(77);
    for (let i = 0; i < 60; i++) {
      const a = rng() * TAU, rr = r * (0.7 + rng() * 0.35);
      g.fillStyle = rgb([28 + rng() * 20, 66 + rng() * 22, 40]);
      g.beginPath(); g.ellipse(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, 0.04, 0.016, a + 1.4, 0, TAU); g.fill();
    }
    g.fillStyle = "rgba(248,251,255,0.85)";
    for (let i = 0; i < 10; i++) { const a = -Math.PI * (0.15 + rng() * 0.7), rr = r * 0.95; g.beginPath(); g.ellipse(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, 0.03, 0.012, 0, 0, TAU); g.fill(); }
    for (let i = 0; i < 6; i++) { const a = i * TAU / 6 + 0.3; g.fillStyle = i % 2 ? "#b8182c" : "#d8a640"; g.beginPath(); g.arc(cx + Math.cos(a) * r * 0.85, cy + Math.sin(a) * r * 0.85, 0.022, 0, TAU); g.fill(); }
    g.fillStyle = "#b3122a";
    const by = cy + r * 0.9;
    g.beginPath(); g.moveTo(cx, by); g.quadraticCurveTo(cx - 0.1, by - 0.08, cx - 0.09, by + 0.03); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(cx, by); g.quadraticCurveTo(cx + 0.1, by - 0.08, cx + 0.09, by + 0.03); g.closePath(); g.fill();
    g.fillRect(cx - 0.02, by, 0.018, 0.16); g.fillRect(cx + 0.004, by, 0.018, 0.14);
  }
  /* Tannengirlande über dem Türbogen */
  function girlandeBogen(g, F, x, y, w, h, bogen, gw) {
    const rng = zufall(55);
    const r = w / 2 + gw * 0.5, cx = x + w / 2, cy = y + bogen;
    for (let i = 0; i < 140; i++) {
      const a = Math.PI + rng() * Math.PI, rr = r + (rng() - 0.5) * 0.12;
      g.fillStyle = rgb([26 + rng() * 22, 62 + rng() * 26, 38]);
      g.beginPath(); g.ellipse(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, 0.05, 0.018, a + 1.57 + (rng() - 0.5), 0, TAU); g.fill();
    }
    for (let i = 0; i < 9; i++) {
      const a = Math.PI + (i + 0.5) / 9 * Math.PI;
      g.fillStyle = i % 3 === 1 ? "#d9a53e" : "#b8182c";
      g.beginPath(); g.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r + 0.02, 0.028, 0, TAU); g.fill();
      g.fillStyle = "rgba(255,255,255,0.5)"; g.beginPath(); g.arc(cx + Math.cos(a) * r - 0.008, cy + Math.sin(a) * r + 0.012, 0.008, 0, TAU); g.fill();
    }
    g.fillStyle = "rgba(248,251,255,0.9)";
    for (let i = 0; i < 12; i++) { const a = Math.PI * 1.1 + rng() * Math.PI * 0.8; g.beginPath(); g.ellipse(cx + Math.cos(a) * r, cy + Math.sin(a) * r - 0.03, 0.05, 0.015, 0, 0, TAU); g.fill(); }
    /* Enden hängen seitlich herab */
    for (const s of [-1, 1]) {
      for (let i = 0; i < 30; i++) {
        const t = rng(), px0 = cx + s * r, py0 = cy + t * 0.7;
        g.fillStyle = rgb([26 + rng() * 22, 62 + rng() * 26, 38]);
        g.beginPath(); g.ellipse(px0 + (rng() - 0.5) * 0.08, py0, 0.045, 0.016, 1.57 + (rng() - 0.5), 0, TAU); g.fill();
      }
    }
  }

  function eckquader(g, F, x, y, h, bis, rechts, saat, farbe) {
    const rng = zufall(saat * 3 + 1);
    let zz = 0, k = 0;
    while (zz < bis - 0.01) {
      const lh = Math.min(0.32 + rng() * 0.04, bis - zz);
      const lang = (k % 2 === 0) ? 0.52 : 0.3;
      const c = PI.streu(farbe || SANDSTEIN, rng, 0.08);
      const bx = rechts ? x - lang : x, by = y + h - zz - lh;
      g.fillStyle = rgb(MOERTEL); g.fillRect(bx - (rechts ? 0.015 : 0), by - 0.012, lang + 0.015, lh + 0.012);
      g.fillStyle = rgb(c); g.fillRect(bx + (rechts ? 0 : 0), by, lang - 0.012, lh - 0.012);
      if (F.px > 18) {
        g.fillStyle = "rgba(255,236,214,0.2)"; g.fillRect(bx, by, lang - 0.012, Math.max(0.006, 1 / F.px));
        g.fillStyle = "rgba(50,24,16,0.3)"; g.fillRect(bx, by + lh - 0.012 - Math.max(0.006, 1 / F.px), lang - 0.012, Math.max(0.006, 1 / F.px));
      }
      zz += lh; k++;
    }
  }
  /* Wellendurchlass in der Ostwand: Sandsteinrahmen, dunkle Öffnung */
  function welleLoch(g, F, B, top, winter) {
    const a = YW, y = top - RZ;
    g.fillStyle = rgb(SANDSTEIN); g.beginPath(); g.arc(a, y, RW + 0.22, 0, TAU); g.fill();
    g.fillStyle = "rgba(60,30,22,0.5)"; g.lineWidth = 0.01;
    if (F.px > 15) { g.strokeStyle = "rgba(60,30,22,0.5)"; g.beginPath(); for (let i = 0; i < 6; i++) { const w = i * TAU / 6 + 0.3; g.moveTo(a + Math.cos(w) * (RW + 0.05), y + Math.sin(w) * (RW + 0.05)); g.lineTo(a + Math.cos(w) * (RW + 0.22), y + Math.sin(w) * (RW + 0.22)); } g.stroke(); }
    g.fillStyle = "rgb(22,18,16)"; g.beginPath(); g.arc(a, y, RW + 0.05, 0, TAU); g.fill();
    /* Mauerplatte aus Eisen */
    g.strokeStyle = rgb(EISEN); g.lineWidth = 0.035; g.beginPath(); g.arc(a, y, RW + 0.09, 0, TAU); g.stroke();
    if (winter) { g.fillStyle = "rgba(244,247,252,0.95)"; g.beginPath(); g.ellipse(a, y - RW - 0.22, 0.3, 0.035, 0, 0, TAU); g.fill(); }
    void B;
  }
  /* Schneewehe am Wandfuß */
  function schneeWehe(g, F, w, h, saat, luecke) {
    const rng = zufall(saat + 400);
    const hoch = (x) => 0.2 + 0.1 * Math.sin(x * 1.3 + saat) + 0.06 * Math.sin(x * 3.7 + saat * 2);
    g.beginPath(); g.moveTo(-0.05, h + 0.05);
    for (let x = -0.05; x <= w + 0.05; x += 0.1) {
      let hh = hoch(x);
      if (luecke && x > luecke[0] && x < luecke[1]) hh = 0.04;
      g.lineTo(x, h - hh);
    }
    g.lineTo(w + 0.05, h + 0.05); g.closePath();
    const gr = g.createLinearGradient(0, h - 0.35, 0, h);
    gr.addColorStop(0, "rgb(248,250,254)"); gr.addColorStop(1, "rgb(226,234,246)");
    g.fillStyle = gr; g.fill();
    void rng;
  }
  /* Blumenkasten mit Geranien (Frühling) */
  function blumenkastenMalen(g, F, x, y, w, saat) {
    const rng = zufall(saat * 17 + 3);
    for (let i = 0; i < w * 26; i++) { g.fillStyle = rgb(PI.streu([62, 112, 46], rng, 0.2)); g.beginPath(); g.arc(x + 0.04 + rng() * (w - 0.08), y - rng() * 0.16, 0.035 + rng() * 0.02, 0, TAU); g.fill(); }
    for (let i = 0; i < w * 9; i++) {
      const cx = x + 0.06 + rng() * (w - 0.12), cy = y - 0.1 - rng() * 0.14;
      const c = rng() < 0.7 ? [206, 30, 42] : [236, 96, 126];
      for (let k = 0; k < 5; k++) { g.fillStyle = rgb(hell(c, (rng() - 0.5) * 0.3)); g.beginPath(); g.arc(cx + (rng() - 0.5) * 0.06, cy + (rng() - 0.5) * 0.05, 0.018, 0, TAU); g.fill(); }
    }
    g.fillStyle = "#4a3624"; g.fillRect(x - 0.02, y - 0.02, w + 0.04, 0.18);
    g.fillStyle = "rgba(0,0,0,0.25)"; g.fillRect(x - 0.02, y + 0.12, w + 0.04, 0.04);
  }
  /* Ladeluke im Westgiebel (unter dem Aufzugsbalken) */
  function lukeMalen(g, F, B, x, y, w, h, S, Z) {
    const pT = parallaxe(F, B, 0.12);
    g.fillStyle = "rgb(30,24,20)"; g.fillRect(x, y, w, h);
    if (!Z.tueren) return;
    /* ein Flügel offen (nach außen an die Wand geklappt), einer zu */
    const c = [104, 72, 46];
    g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
    g.translate(pT[0], pT[1]);
    bretterMalen(g, F, x + w / 2, y, w / 2, h, c, 91, { richtung: "v", breite: 0.14 });
    g.fillStyle = "#26211d"; g.fillRect(x + w / 2, y + 0.25, w / 2, 0.035); g.fillRect(x + w / 2, y + h - 0.3, w / 2, 0.035);
    g.restore();
    const sv = F.schatten(0.05);
    if (sv) { g.fillStyle = "rgba(20,20,30,0.3)"; g.fillRect(x - w / 2 - 0.04 + sv[0], y + sv[1], w / 2, h); }
    bretterMalen(g, F, x - w / 2 - 0.04, y, w / 2, h, hell(c, 0.05), 92, { richtung: "v", breite: 0.14 });
    g.fillStyle = "#26211d"; g.fillRect(x - w / 2 - 0.04, y + 0.25, w / 2, 0.035); g.fillRect(x - w / 2 - 0.04, y + h - 0.3, w / 2, 0.035);
    if (S.winter) { g.fillStyle = "rgb(244,247,252)"; PI.rundRechteck(g, x - 0.05, y - 0.06, w + 0.1, 0.06, 0.02); g.fill(); }
  }
  /* Welche Fenster wie aussehen (Läden, Licht, Deko) */
  function fensterArt(W, i, S, Z, eg) {
    const h = ST.hash2(W.saat * 13 + i, 7, S.saat);
    const fo = {
      tiefe: eg ? 0.24 : 0.1, leer: !Z.fenster, rahmen: "#ece6d8",
      fluegel: 2, sprossen: [1, 3],
      laeden: !eg && Z.fertig && (W.name === "sued" || W.name === "west") ? "#3f6a4c" : null,
      vorhang: h < 0.5 ? "#a8443a" : "#5a6e4a",
      an: Z.fertig ? (W.name === "west" || W.name === "sued" ? (h < 0.8 ? 1 : 0) : (h < 0.45 ? 0.85 : 0)) : 0,
      deko: S.winter && Z.fertig && !eg && h > 0.35 && h < 0.8
    };
    if (eg && W.name === "ost") fo.an = 0;
    return fo;
  }

  /* =====================================================================
     DACH MIT KRÜPPELWALM
     ===================================================================== */
  /* Licht einer Dachfläche (Modellnormale n) im aktuellen Blick – damit
     Schneewülste und Firstpolster wie DIESELBE Schneedecke aussehen */
  function dachLicht(F, B, n) {
    if (!B || !B.e) return ST.lichtFaktor(F.n, F.zeit, 0.06, F.jahr);
    const nc = [n[0] * B.c - n[1] * B.s, n[0] * B.s + n[1] * B.c, n[2]];
    return ST.lichtFaktor(nc, F.zeit, 0.04, F.jahr);
  }
  const lichtMal = (lf) => (c, a, k) => rgb([Math.min(255, c[0] * lf[0] * (k || 1)), Math.min(255, c[1] * lf[1] * (k || 1)), Math.min(255, c[2] * lf[2] * (k || 1))], a);
  /* Schneewulst über einer Dachkante (Ortgang, Walmtraufe): 15–25 cm dick,
     oben gerundet, mit durchhängenden Buckeln; kante(a) = Flächen-y der
     Dachoberkante an der Stelle a. Licht der zugehörigen Dachfläche. */
  function schneeWulstMal(B, nDach, kante, saat, dick) {
    return function (g, F) {
      const w = F.w, rng = zufall(saat), L = lichtMal(dachLicht(F, B, nDach));
      const d = dick || 0.2, ph = rng() * 6;
      const oben = (a) => kante(a) - d * (0.75 + 0.2 * Math.sin(a * 2.7 + ph) + 0.08 * Math.sin(a * 7.1 + ph * 2));
      g.beginPath(); g.moveTo(-0.02, kante(0) + 0.04);
      for (let a = -0.02; a <= w + 0.02; a += 0.06) g.lineTo(a, oben(klemm(a, 0, w)));
      for (let a = w + 0.02; a >= -0.02; a -= 0.06) g.lineTo(a, kante(klemm(a, 0, w)) + 0.05 + 0.03 * Math.sin(a * 5 + ph));
      g.closePath();
      const gr = g.createLinearGradient(0, kante(w / 2) - d, 0, kante(w / 2) + 0.05);
      gr.addColorStop(0, L([248, 250, 254], 1, 1.04)); gr.addColorStop(0.55, L([236, 242, 250])); gr.addColorStop(1, L([196, 208, 232], 1, 0.9));
      g.fillStyle = gr; g.fill();
      if (F.px > 30) glitzer(g, F, 0, kante(w / 2) - d, w, d, 20, rng, L([255, 255, 255], 0.9, 1.1));
    };
  }
  /* Untersicht unter einem Dachüberstand (Kritik Runde 1: ohne sie hing
     das Ortgangbrett frei in der Luft): Brettschalung quer, zur Wand hin
     im Schatten; sie liegt eine Dachstärke unter der Deckung und zeigt
     nach unten, man sieht sie also nur, wo man unter den Überstand blickt. */
  function untersichtMal(saat) {
    return function (g, F) {
      const w = F.w, h = F.h;
      bretterMalen(g, F, -0.05, -0.05, w + 0.1, h + 0.1, [104, 76, 54], saat, { richtung: "v", breite: 0.14 });
      const gr = g.createLinearGradient(0, 0, w, 0);
      gr.addColorStop(0, "rgba(20,14,12,0.1)"); gr.addColorStop(1, "rgba(20,14,12,0.45)");
      g.fillStyle = gr; g.fillRect(-0.05, -0.05, w + 0.1, h + 0.1);
    };
  }
  function dachBauen(M, S, Z, B) {
    const winter = S.winter;
    const cosN = Math.cos(NEIG), sinN = Math.sin(NEIG), cosW = Math.cos(WNEIG), sinW = Math.sin(WNEIG);
    const wS = XWE1 - XWE0, hS = YTE / cosN;
    const bW = YWE / cosN;                                    // Flächen-y der Walmtraufe
    const umrS = [[XF0 - XWE0, 0], [XF1 - XWE0, 0], [wS, bW], [wS, hS], [0, hS], [0, bW]];
    const reihen = Z.dachReihen;                              // null = ganz gedeckt
    const dachMal = (seite) => function (g, F) {
      if (reihen === 0) return latten(g, F, 0, wS, hS);
      const nord = seite === 1 ? 1 : 0, kamin = S.kaminX - XWE0;
      const kaminA = seite === 0 ? kamin : wS - kamin;
      if (reihen != null) {
        latten(g, F, 0, wS, hS);
        biberMalen(g, F, 0, wS, hS, 0, S.saat + seite, { bisReihe: reihen, teilReihe: Z.dachTeil, nord: nord });
        return;
      }
      if (winter) {
        /* Luv (Süd) weht am First etwas frei, im Lee (Nord) liegt der Schnee
           bis zum First (Kritik: „breites rotes Band am First") */
        dachSchnee(g, F, -0.05, wS + 0.05, hS, 0, S.saat + seite, { oben: nord ? 0 : 0.1, kamin: kaminA, nord: nord });
      } else {
        biberMalen(g, F, -0.05, wS + 0.05, hS, 0, S.saat + seite, { nord: nord, kamin: kaminA, welt: seite * 17 });
        firstZiegel(g, F, XF0 - XWE0, XF1 - XWE0, false);
        gratZiegel(g, F, [[XF1 - XWE0, 0], [wS, bW]], false);
        gratZiegel(g, F, [[XF0 - XWE0, 0], [0, bW]], false);
      }
    };
    const walmMal = (seite) => (g, F) => {
      const w = F.w, h = F.h;
      if (reihen === 0) return latten(g, F, 0, w, h);
      if (reihen != null) { latten(g, F, 0, w, h); biberMalen(g, F, 0, w, h, 0, S.saat + 7, { bisReihe: reihen, teilReihe: Z.dachTeil }); return; }
      if (winter) dachSchnee(g, F, -0.05, w + 0.05, h, 0, S.saat + 9 + seite, { oben: 0 });
      else biberMalen(g, F, -0.05, w + 0.05, h, 0, S.saat + 9 + seite, { nord: 0.5, welt: 40 + seite * 9 });
    };
    M.teil("dach", { mitte: [HAUS_M[0], 0, HAUS_M[2] + 10] });
    const vS = [0, cosN, -sinN], vN = [0, -cosN, -sinN];
    M.flaeche({ name: "dach-s", o: [XWE0, 0, ZF], u: [1, 0, 0], v: vS, w: wS, h: hS, umriss: umrS, malen: dachMal(0), lichtExtra: winter ? 0.05 : 0 });
    M.flaeche({ name: "dach-n", o: [XWE1, 0, ZF], u: [-1, 0, 0], v: vN, w: wS, h: hS, umriss: umrS, malen: dachMal(1), lichtExtra: winter ? 0.05 : 0 });
    const hW = (XWE1 - XF1) / cosW;
    M.flaeche({ name: "walm-o", o: [XF1, YWE, ZF], u: [0, -1, 0], v: [cosW, 0, -sinW], w: 2 * YWE, h: hW, umriss: [[YWE, 0], [2 * YWE, hW], [0, hW]], malen: walmMal(0), lichtExtra: winter ? 0.05 : 0 });
    M.flaeche({ name: "walm-w", o: [XF0, -YWE, ZF], u: [0, 1, 0], v: [-cosW, 0, -sinW], w: 2 * YWE, h: hW, umriss: [[YWE, 0], [2 * YWE, hW], [0, hW]], malen: walmMal(1), lichtExtra: winter ? 0.05 : 0 });
    /* Untersichten der Überstände an beiden Giebeln (Haupt- und Walmdach) */
    const bX = (XW1 - XF1) / (XWE1 - XF1) * bW;            // Walmkante über der Giebelwand
    for (const t of [1, -1]) {
      /* Hauptdach Süd (t=1) / Nord (t=−1): Unterseite eine Dachstärke tiefer */
      const n = [0, t * sinN, cosN], v = t > 0 ? vS : vN;
      for (const s of [1, -1]) {
        /* s = +1: Ostgiebel, −1: Westgiebel. u zeigt so, dass die Normale nach unten geht */
        const u = [-t, 0, 0];
        const xStart = t > 0 ? (s > 0 ? XWE1 : XW0) : (s > 0 ? XW1 : XWE0);
        const o = [xStart - n[0] * DICKE, -n[1] * DICKE, ZF - n[2] * DICKE];
        const innen = (t > 0) === (s > 0) ? OGV : 0;          // a der Giebelwand in dieser Fläche
        const aussen = OGV - innen;
        const um = [[aussen, bW], [innen, bX], [innen, hS], [aussen, hS]];
        M.flaeche({ name: "unters" + t + s, o: o, u: u, v: v, w: OGV, h: hS, umriss: um, malen: untersichtMal(60 + t + s * 3), keinAo: true });
      }
    }
    for (const s of [1, -1]) {
      /* Krüppelwalm: Überstand zwischen Giebelwand und Walmtraufe */
      const n = [s * sinW, 0, cosW], v = [s * cosW, 0, -sinW], u = [0, s, 0];
      const bw = ((s > 0 ? XW1 - XF1 : XF0 - XW0)) / cosW;
      const k = bw / hW;
      M.flaeche({ name: "unters-walm" + s, o: [(s > 0 ? XF1 : XF0) - n[0] * DICKE, -s * YWE, ZF - n[2] * DICKE], u: u, v: v, w: 2 * YWE, h: hW, umriss: [[YWE * (1 - k), bw], [YWE * (1 + k), bw], [2 * YWE, hW], [0, hW]], malen: untersichtMal(70 + s), keinAo: true });
    }
    /* Kanten: Traufbretter, Ortgangbretter (so hoch wie die Dachstärke:
       keine Lücke zur Untersicht), Walmtraufbretter */
    const brett = (g, F) => { holzMalen(g, F, -0.02, -0.02, F.w + 0.04, F.h + 0.04, [118, 84, 58], 71, { ohneAst: true }); if (winter) { g.fillStyle = "rgb(242,246,252)"; g.fillRect(-0.02, -0.02, F.w + 0.04, 0.04); } };
    const db = 0.24, dO = DV + 0.02;
    M.flaeche({ name: "traufe-s", o: [XWE0, YTE, ZTE], u: [1, 0, 0], v: [0, 0, -1], w: wS, h: db, malen: brett, keinAo: true });
    M.flaeche({ name: "traufe-n", o: [XWE1, -YTE, ZTE], u: [-1, 0, 0], v: [0, 0, -1], w: wS, h: db, malen: brett, keinAo: true });
    const ortBrett = (g, F) => {
      holzMalen(g, F, -0.02, -0.02, F.w + 0.04, F.h + 0.04, [118, 84, 58], 72, { ohneAst: true });
      /* unten der Flugsparren, dunkler */
      const um = F.flaeche.umriss;
      g.save(); g.globalAlpha = 0.35; g.fillStyle = "rgb(40,26,18)";
      g.beginPath(); g.moveTo(um[3][0], um[3][1]); g.lineTo(um[2][0], um[2][1]); g.lineTo(um[2][0], um[2][1] - (dO - 0.26)); g.lineTo(um[3][0], um[3][1] - (dO - 0.26)); g.closePath(); g.fill(); g.restore();
      if (winter) { g.fillStyle = "rgb(242,246,252)"; g.beginPath(); g.moveTo(um[0][0], um[0][1] - 0.01); g.lineTo(um[1][0], um[1][1] - 0.01); g.lineTo(um[1][0], um[1][1] + 0.03); g.lineTo(um[0][0], um[0][1] + 0.03); g.closePath(); g.fill(); }
    };
    const spaet = [];
    for (const s of [1, -1]) {
      const xo = s > 0 ? XWE1 : XWE0;
      const u = s > 0 ? [0, -1, 0] : [0, 1, 0];
      const ly = YTE - YWE, lz = ZWE - ZTE;
      for (const t of [1, -1]) {
        const links = (s > 0) === (t > 0);   // liegt die Traufe links?
        const oy = s > 0 ? Math.max(t * YTE, t * YWE) : Math.min(t * YTE, t * YWE);
        const z0 = links ? ZTE : ZWE, z1 = links ? ZWE : ZTE, ztop = Math.max(z0, z1);
        const um = [[0, ztop - z0], [ly, ztop - z1], [ly, ztop - z1 + dO], [0, ztop - z0 + dO]];
        M.flaeche({ name: "ort" + s + t, o: [xo, oy, ztop], u: u, v: [0, 0, -1], w: ly, h: lz + dO, umriss: um, malen: ortBrett, keinAo: true });
        if (winter && Z.fertig) {
          /* Schneewulst auf dem Ortgang (Licht wie die Dachfläche) */
          const kanteY = (a) => (ztop - z0) + (a / ly) * (z0 - z1);
          spaet.push({ teil: "ortschnee" + s + t, mitte: [HAUS_M[0] + s * 30, t * 5, HAUS_M[2] + 12], f: { name: "ortschnee" + s + t, o: [xo + s * 0.01, oy, ztop + 0.3], u: u, v: [0, 0, -1], w: ly, h: lz + 0.6, malen: schneeWulstMal(B, [0, t * sinN, cosN], (a) => kanteY(a) + 0.3, 90 + s + t * 3, 0.2), keinLicht: true, keinAo: true } });
        }
      }
      M.flaeche({ name: "walmtraufe" + s, o: [xo, s > 0 ? YWE : -YWE, ZWE], u: u, v: [0, 0, -1], w: 2 * YWE, h: db, malen: brett, keinAo: true });
      if (winter && Z.fertig) {
        /* Wechte und Eiszapfen an der Walmtraufe */
        spaet.push({ teil: "walmschnee" + s, mitte: [HAUS_M[0] + s * 30, 0, HAUS_M[2] + 12], f: { name: "walmwechte" + s, o: [xo + s * 0.06, s > 0 ? YWE + 0.05 : -YWE - 0.05, ZWE + 0.24], u: u, v: [0, 0, -1], w: 2 * YWE + 0.1, h: 0.36, malen: wechteMal(S.saat + s * 5, B, [s * sinW, 0, cosW]), keinLicht: true, keinAo: true } });
        spaet.push({ f: { name: "walmzapfen" + s, o: [xo + s * 0.03, s > 0 ? YWE : -YWE, ZWE - 0.2], u: u, v: [0, 0, -1], w: 2 * YWE, h: 0.6, malen: zapfenMal(S.saat + s * 11, 0.45), leuchten: zapfenMal(S.saat + s * 11, 0.45, true), keinLicht: true, keinAo: true } });
      }
    }
    for (const e of spaet) { if (e.teil) M.teil(e.teil, { schatten: false, mitte: e.mitte }); M.flaeche(e.f); }
    /* Firstpolster: ein runder Schneekamm auf dem First (von beiden Seiten) */
    if (winter && Z.fertig) {
      M.teil("firstschnee", { schatten: false, mitte: [HAUS_M[0], 0, ZF + 12] });
      const lf = XF1 - XF0;
      M.flaeche({ name: "firstschnee", o: [XF0 - 0.05, 0, ZF + 0.2], u: [1, 0, 0], v: [0, 0, -1], w: lf + 0.1, h: 0.26, beidseitig: true, keinLicht: true, keinAo: true, umriss: (function () { const P = [[0, 0.24]]; for (let a = 0; a <= lf + 0.1; a += 0.3) P.push([a, 0.05 + 0.04 * Math.sin(a * 2.3) + 0.02 * Math.sin(a * 6.1)]); P.push([lf + 0.1, 0.24]); return P; })(), malen: (g, F) => {
        const L = lichtMal(dachLicht(F, B, [0, 0, 1]));
        const gr = g.createLinearGradient(0, 0, 0, 0.26);
        gr.addColorStop(0, L([250, 252, 255], 1, 1.05)); gr.addColorStop(0.6, L([238, 243, 251])); gr.addColorStop(1, L([200, 212, 234], 1, 0.9));
        g.fillStyle = gr; g.fillRect(-0.05, -0.05, F.w + 0.1, 0.35);
      } });
    }
    /* Dachrinnen an beiden Traufen, im Winter Wechte und Eiszapfen, an der
       Südtraufe eine Lichterkette (wie an den Fachwerkhäusern) */
    for (const t of [1, -1]) {
      M.teil("rinne" + t, { schatten: false, mitte: [HAUS_M[0], t * 20, HAUS_M[2] + 10] });
      const y = t * (YTE + 0.09);
      M.flaeche({ name: "rinne" + t, o: t > 0 ? [XWE0 - 0.05, y, ZTE - 0.05] : [XWE1 + 0.05, y, ZTE - 0.05], u: [t, 0, 0], v: [0, 0, -1], w: wS + 0.1, h: 0.14, malen: rinneMal(winter, S.saat + t), keinAo: true });
      if (winter) {
        M.flaeche({ name: "wechte" + t, o: t > 0 ? [XWE0 - 0.08, y + 0.08, ZTE + 0.24] : [XWE1 + 0.08, y - 0.08, ZTE + 0.24], u: [t, 0, 0], v: [0, 0, -1], w: wS + 0.16, h: 0.4, malen: wechteMal(S.saat + t * 3, B, [0, t * sinN, cosN]), keinLicht: true, keinAo: true });
        M.flaeche({ name: "zapfen" + t, o: t > 0 ? [XWE0, y + 0.02, ZTE - 0.18] : [XWE1, y - 0.02, ZTE - 0.18], u: [t, 0, 0], v: [0, 0, -1], w: wS, h: 0.7, malen: zapfenMal(S.saat + t * 5, 0.6), leuchten: zapfenMal(S.saat + t * 5, 0.6, true), keinLicht: true, keinAo: true });
      }
      if (t > 0 && winter && Z.fertig) {
        M.flaeche({ name: "lichterkette", o: [XWE0 + 0.2, y + 0.13, ZTE - 0.02], u: [1, 0, 0], v: [0, 0, -1], w: wS - 0.4, h: 0.3, keinLicht: true, keinAo: true, malen: lichterKette(false), leuchten: lichterKette(true) });
      }
    }
  }
  /* Lichterkette: Kabel an Haken alle 0,7 m, dazwischen durchhängend, die
     Birnchen an kurzen Fassungen; tagsüber warm getöntes Glas, abends und
     nachts glühend mit weichem Hof; ein Szenenschein je 3 m. */
  function lichterKette(an) {
    return function (g, F) {
      const w = F.w, rng = zufall(314), L = belichter(F, 0.05);
      const HAK = 0.7, n = Math.max(1, Math.round(w / HAK)), sl = w / n;
      const y = (x) => { const k = x / sl - Math.floor(x / sl); return 0.03 + 0.07 * 4 * k * (1 - k); };
      if (!an) {
        g.strokeStyle = L([34, 40, 32]); g.lineWidth = Math.max(0.006, 0.8 / F.px);
        g.beginPath(); for (let x = 0; x <= w + 0.001; x += 0.05) { if (x) g.lineTo(x, y(x)); else g.moveTo(x, y(x)); } g.stroke();
      }
      const birnen = [];
      for (let x = 0.12; x < w; x += 0.24) birnen.push([x + (rng() - 0.5) * 0.03, y(x) + 0.035, 0.013 * (0.85 + rng() * 0.3), rng() < 0.025]);
      if (!an) {
        g.fillStyle = L([243, 226, 176], 0.95);
        g.beginPath(); for (const [x, yy, r] of birnen) { g.moveTo(x + r, yy); g.arc(x, yy, r, 0, TAU); } g.fill();
        return;
      }
      if (F.nacht <= 0) return;
      const a = F.nacht;
      for (const [x, yy, r, aus] of birnen) {
        if (aus) continue;
        const gg = g.createRadialGradient(x, yy, 0, x, yy, 0.08);
        gg.addColorStop(0, "rgba(255,246,214," + a.toFixed(3) + ")"); gg.addColorStop(0.3, "rgba(255,206,120," + (0.75 * a).toFixed(3) + ")"); gg.addColorStop(1, "rgba(255,170,70,0)");
        g.fillStyle = gg; g.fillRect(x - 0.08, yy - 0.08, 0.16, 0.16);
        g.fillStyle = "rgba(255,250,230," + a.toFixed(3) + ")"; g.beginPath(); g.arc(x, yy, r, 0, TAU); g.fill();
      }
      for (let x = 1.2; x < w; x += 3) F.leuchtPunkt(x, 0.12, 1.6, "255,200,120", 0.28, true);
    };
  }
  function latten(g, F, x0, w, h) {
    g.fillStyle = "rgba(0,0,0,0)";
    /* Sparren (quer) und Latten (längs) des offenen Dachs */
    g.fillStyle = rgb(hell(HOLZ_ROH, -0.12));
    for (let x = x0 + 0.3; x < x0 + w; x += 0.85) g.fillRect(x - 0.06, 0, 0.12, h);
    g.fillStyle = rgb(hell(HOLZ_ROH, 0.08));
    for (let y = h - 0.1; y > 0; y -= ZR_) g.fillRect(x0, y - 0.02, w, 0.04);
  }
  function firstZiegel(g, F, x0, x1, winter) {
    const px = F.px;
    if (winter) { g.fillStyle = "rgba(248,250,255,0.95)"; g.fillRect(x0, -0.02, x1 - x0, 0.1); return; }
    g.fillStyle = rgb(hell(BIBER, -0.12)); g.fillRect(x0, -0.02, x1 - x0, 0.14);
    if (px > 12) {
      g.fillStyle = rgb(hell(BIBER, 0.1));
      for (let x = x0; x < x1; x += 0.36) { g.beginPath(); g.moveTo(x, -0.02); g.quadraticCurveTo(x + 0.18, 0.2, x + 0.36, -0.02); g.lineTo(x + 0.36, 0.1); g.quadraticCurveTo(x + 0.18, 0.16, x, 0.1); g.closePath(); g.fill(); }
      g.fillStyle = "rgba(220,210,190,0.5)"; g.fillRect(x0, 0.11, x1 - x0, 0.02);
    }
  }
  function gratZiegel(g, F, [p0, p1], winter) {
    g.save();
    g.strokeStyle = winter ? "rgba(248,250,255,0.95)" : rgb(hell(BIBER, -0.1));
    g.lineWidth = 0.16; g.lineCap = "butt";
    g.beginPath(); g.moveTo(p0[0], p0[1]); g.lineTo(p1[0], p1[1]); g.stroke();
    if (!winter && F.px > 14) {
      g.strokeStyle = "rgba(230,220,200,0.45)"; g.lineWidth = 0.02; g.stroke();
    }
    g.restore();
  }
  function rinneMal(winter, saat) {
    return function (g, F) {
      const w = F.w, h = F.h;
      const gr = g.createLinearGradient(0, 0, 0, h);
      gr.addColorStop(0, "rgb(170,178,182)"); gr.addColorStop(0.35, "rgb(214,220,222)"); gr.addColorStop(0.7, "rgb(136,146,150)"); gr.addColorStop(1, "rgb(96,104,110)");
      g.fillStyle = gr; g.fillRect(0, 0, w, h);
      g.fillStyle = "rgba(60,90,70,0.35)"; g.fillRect(0, h * 0.75, w, h * 0.25);
      if (F.px > 16) { g.fillStyle = "rgba(60,64,70,0.6)"; for (let x = 0.4; x < w; x += 0.9) g.fillRect(x, 0, 0.02, h); }
      if (winter) { g.fillStyle = "rgb(244,247,252)"; g.fillRect(0, -0.02, w, 0.06); }
      void saat;
    };
  }
  /* Schneewechte an der Traufe: dicke, gerundete Kante, die über die Rinne
     hängt, mit durchhängenden Buckeln und zwei, drei Abbruchstellen; oben
     im Licht der Dachfläche (nDach), damit Wechte und Decke EINE
     Schneedecke sind, zur Unterseite hin bläulich (Eigenschatten). */
  function wechteMal(saat, B, nDach) {
    return function (g, F) {
      const w = F.w, rng = zufall(saat);
      const lf = nDach ? dachLicht(F, B, nDach) : ST.lichtFaktor(F.n, F.zeit, 0.06, F.jahr), L = lichtMal(lf);
      const brueche = [];
      for (let i = 0, nb = 2 + (rng() < 0.5 ? 1 : 0); i < nb; i++) brueche.push([0.6 + rng() * Math.max(0.1, w - 1.2), 0.25 + rng() * 0.45]);
      const buckel = 0.5 + rng() * 0.25, ph = rng() * 6;
      const unten = (x) => {
        let y = 0.2 + 0.07 * (0.45 + 0.2 * Math.sin(x * 2.3 + saat) + 0.1 * Math.sin(x * 5.7 + saat * 3));
        y += 0.06 * Math.pow(0.5 + 0.5 * Math.cos(x / buckel * TAU + ph), 1.6);
        for (const [bx, bl] of brueche) { const d = Math.abs(x - bx); if (d < bl / 2) y -= 0.12 * Math.sqrt(Math.max(0, 1 - Math.pow(d / (bl / 2), 6))); }
        return Math.max(0.05, y);
      };
      g.beginPath(); g.moveTo(-0.02, 0); g.lineTo(w + 0.02, 0);
      for (let x = w + 0.02; x >= -0.02; x -= 0.06) g.lineTo(x, unten(x));
      g.closePath();
      const gr = g.createLinearGradient(0, 0, 0, 0.34);
      gr.addColorStop(0, L([248, 250, 254], 1, 1.05)); gr.addColorStop(0.35, L([242, 246, 252])); gr.addColorStop(0.7, L([224, 232, 246], 1, 0.94)); gr.addColorStop(1, L([186, 200, 228], 1, 0.84));
      g.fillStyle = gr; g.fill();
      if (F.px > 8) { g.save(); g.clip(); tonFlecken(g, 0, 0, w, 0.4, 1.2, 0.35, saat + 3, "#c0cce2", true); g.restore(); }
      glitzer(g, F, 0, 0.02, w, 0.14, 25, rng, L([255, 255, 255], 0.9, 1.1));
    };
  }
  /* Eiszapfen (durchscheinend, belichtet). leuchtend: derselbe Pinsel im
     Leuchten-Durchgang – sonst läge das Fensterlicht über den Zapfen */
  function zapfenMal(saat, maxL, leuchtend) {
    return function (g, F) {
      if (leuchtend && F.nacht < 0.05) return;
      eiszapfenMalen(g, F, 0.1, F.w - 0.1, 0, maxL, saat, belichter(F, 0.15));
    };
  }

  /* =====================================================================
     DAS WASSERRAD
     Ansicht A: p(x,y,z) → Bildpunkt, E (Blickrichtung im Modell), c/sn
     (Drehung), Z (Tageszeit), jahr, s (Pixel je Meter).
     Gemalt wird mit eigener Tiefenordnung (hinten zuerst):
       Welle hinten → Kranz hinten → Arme hinten → Radboden innen →
       Welle Mitte → Zellen, Radboden außen, Wasser (nach Tiefe) →
       Schwall aus den Zellen → Kranz vorn → Arme vorn mit Nabe → Welle vorn
     Das gilt für jede Drehung, weil „hinten" und „vorn" aus E kommen.
     VIERTELDREHUNG: alles am Rad wiederholt sich nach 90° (36 Zellen,
     8 Arme, 8 Felgen, 8-kantige Welle); Farbunterschiede der Felgen und
     Arme wechseln deshalb im Zweierschritt, zufällige Maserung, Reif und
     Eis werden je Viertel wiederholt – so schließt die Bildfolge nahtlos.
     ===================================================================== */
  function ansichtFigur(s, gier, Zt, jahr) {
    const r = gier * RAD, c = Math.cos(r), sn = Math.sin(r);
    return {
      s: s, c: c, sn: sn, Z: Zt, jahr: jahr, E: [0.6124 * (c + sn), 0.6124 * (c - sn), 0.5],
      p(x, y, z) { const a = x * c - y * sn, b = x * sn + y * c; return [(a - b) * ST.KX * s, (a + b) * ST.KY * s - z * ST.KZ * s]; }
    };
  }
  /* Ansicht für ein Bild der Folge: Punkte in Konstruktionskoordinaten,
     Bildpunkte relativ zum Ursprung des Kerns minus Bildversatz fx/fy */
  function ansichtBild(s, gier, Zt, jahr, fx, fy) {
    const r = gier * RAD, c = Math.cos(r), sn = Math.sin(r);
    return {
      s: s, c: c, sn: sn, Z: Zt, jahr: jahr, E: [0.6124 * (c + sn), 0.6124 * (c - sn), 0.5],
      p(x, y, z) { const yy = y + DY, a = x * c - yy * sn, b = x * sn + yy * c; return [(a - b) * ST.KX * s - fx, (a + b) * ST.KY * s - z * ST.KZ * s - fy]; }
    };
  }
  function ansichtLeben(P) {
    const c = P.c, sn = P.sn;
    return { s: P.s, c: c, sn: sn, Z: P.Z, jahr: P.jahr, E: [0.6124 * (c + sn), 0.6124 * (c - sn), 0.5], p: (x, y, z) => P.proj(x, y, z) };
  }
  function lichtA(A, n) { return ST.lichtFaktor([n[0] * A.c - n[1] * A.sn, n[0] * A.sn + n[1] * A.c, n[2]], A.Z, 0, A.jahr); }
  function farbeA(A, c, n, al) { const l = lichtA(A, n); return rgb([c[0] * l[0], c[1] * l[1], c[2] * l[2]], al); }
  /* Schaum, Glanz und Reif: nachts gedämpft (Himmelslicht von oben), sonst leuchten sie */
  function weissA(A, c, al) { const l = lichtA(A, [0, 0, 1]); return rgb([c[0] * l[0], c[1] * l[1], c[2] * l[2]], al); }
  /* Zeichenfläche auf eine Ebene im Raum legen: o Ursprung, u/v Achsen (Meter) */
  function ebeneA(g, A, o, u, v) {
    const p0 = A.p(o[0], o[1], o[2]), pu = A.p(o[0] + u[0], o[1] + u[1], o[2] + u[2]), pv = A.p(o[0] + v[0], o[1] + v[1], o[2] + v[2]);
    g.transform(pu[0] - p0[0], pu[1] - p0[1], pv[0] - p0[0], pv[1] - p0[1], p0[0], p0[1]);
  }
  const radPunkt = (x, r, w) => [x, r * Math.cos(w), RZ + r * Math.sin(w)];
  function pfad3(g, A, pts) { g.beginPath(); pts.forEach((p, i) => { const q = A.p(p[0], p[1], p[2]); if (i) g.lineTo(q[0], q[1]); else g.moveTo(q[0], q[1]); }); g.closePath(); }
  const radHolz = (winter) => (winter ? misch(HOLZ_ALT, [192, 204, 222], 0.22) : HOLZ_ALT);
  const VIERTEL = Math.PI / 2;
  const frac = (x) => x - Math.floor(x);
  /* feste Zufallstabellen je Viertel (für Maserung, Reif, Eis) */
  const RAD_TAB = (function () {
    const rng = zufall(4242);
    const mas = []; for (let i = 0; i < 7; i++) { const z = []; for (let k = 0; k < 2; k++) z.push([rng() * 0.3, 0.4 + rng() * 0.3, (rng() - 0.5) * 0.02]); mas.push(z); }
    const reif = []; for (let i = 0; i < 24; i++) reif.push([rng() * VIERTEL, RR - rng() * 0.3, 0.008 + rng() * 0.015]);
    const eis = []; for (let i = 0; i < 9; i++) eis.push([rng() * VIERTEL, 0.035 + rng() * 0.05, rng()]);
    /* Eisbärte am Kranz: 9 je Viertel, 8–30 cm (Kritik: „keine Zapfen am Rad") */
    const zapfen = []; for (let i = 0; i < 9; i++) zapfen.push([(i + 0.15 + rng() * 0.7) / 9 * VIERTEL, 0.08 + Math.pow(rng(), 1.5) * 0.22, 0.022 + rng() * 0.016]);
    return { mas: mas, reif: reif, eis: eis, zapfen: zapfen };
  })();

  function radMalen(g, A, phi, o) {
    const E = A.E, sg = E[0] >= 0 ? 1 : -1;
    const bau = o.bau == null ? 1 : o.bau;
    const holz = radHolz(o.winter);
    const tWelle = phase(bau, 0, 0.12), tArme = phase(bau, 0.1, 0.4), tKranz = phase(bau, 0.35, 0.65), tZellen = phase(bau, 0.6, 1);
    /* Welle: vom Haus (XW1) bis ins Außenlager (X_LAGER) */
    const xFern = sg > 0 ? XW1 : X_LAGER, xNah = sg > 0 ? X_LAGER : XW1;
    const armeHa = sg > 0 ? XK1 - 0.03 : XK4 + 0.03, armeHi = sg > 0 ? XK2 + 0.04 : XK3 - 0.04;   // hintere Arme: außen / innen
    const armeVi = sg > 0 ? XK3 - 0.04 : XK2 + 0.04, armeVa = sg > 0 ? XK4 + 0.03 : XK1 - 0.03;   // vordere Arme
    if (tWelle > 0) {
      const xe = xFern + (xNah - xFern) * tWelle;
      welleMalen(g, A, phi, xFern, sg > 0 ? Math.min(xe, armeHa) : Math.max(xe, armeHa), holz);
    }
    if (tKranz > 0) radKranzMalen(g, A, sg > 0 ? XK1 : XK4, sg > 0 ? XK2 : XK3, phi, holz, tKranz, o, false);
    if (tArme > 0) armeMalen(g, A, armeHa, armeHi, phi, holz, tArme, o, false);
    if (tZellen > 0) bodenInnen(g, A, phi, holz, tZellen, o);
    if (tWelle > 0 && tWelle * (xNah - xFern) * sg > (armeHa - xFern) * sg) welleMalen(g, A, phi, armeHa, sg > 0 ? Math.min(xFern + (xNah - xFern) * tWelle, armeVa) : Math.max(xFern + (xNah - xFern) * tWelle, armeVa), holz);
    if (tZellen > 0) bandMalen(g, A, phi, holz, tZellen, o);
    if (o.wasser && o.schwall) schwallMalen(g, A, phi, o, true);
    if (tKranz > 0) radKranzMalen(g, A, sg > 0 ? XK3 : XK2, sg > 0 ? XK4 : XK1, phi, holz, tKranz, o, true);
    if (tArme > 0) armeMalen(g, A, armeVi, armeVa, phi, holz, tArme, o, true);
    if (tWelle >= 1) welleMalen(g, A, phi, armeVa, xNah, holz);
  }
  /* Welle (Wellbaum): achteckige Eiche mit Eisenringen */
  function welleMalen(g, A, phi, x0, x1, holz) {
    if (Math.abs(x1 - x0) < 0.01) return;
    const E = A.E, rv = RW / Math.cos(TAU / 16);
    const flaechen = [];
    for (let i = 0; i < 8; i++) {
      const am = phi + i * TAU / 8, n = [0, Math.cos(am), Math.sin(am)];
      const d = dot(n, E);
      if (d <= 0) continue;
      flaechen.push({ i: i, am: am, n: n, d: d });
    }
    flaechen.sort((a, b) => a.d - b.d);
    for (const f of flaechen) {
      const a0 = f.am - TAU / 16, a1 = f.am + TAU / 16;
      g.fillStyle = farbeA(A, hell(holz, -0.05 + (f.i % 2) * 0.04), f.n);
      pfad3(g, A, [radPunkt(x0, rv, a0), radPunkt(x1, rv, a0), radPunkt(x1, rv, a1), radPunkt(x0, rv, a1)]); g.fill();
      if (A.s > 22) {
        g.strokeStyle = "rgba(30,20,12,0.22)"; g.lineWidth = Math.max(0.6, A.s * 0.006);
        g.beginPath();
        for (const t of [0.3, 0.65]) { const w = a0 + (a1 - a0) * t, p = A.p(...radPunkt(x0, rv * 0.99, w)), q = A.p(...radPunkt(x1, rv * 0.99, w)); g.moveTo(p[0], p[1]); g.lineTo(q[0], q[1]); }
        g.stroke();
      }
      /* Eisenringe an den Enden */
      for (const xr of [x0 + (x1 - x0) * 0.06, x1 - (x1 - x0) * 0.06]) {
        const b = 0.035 * Math.sign(x1 - x0);
        g.fillStyle = farbeA(A, EISEN, f.n);
        pfad3(g, A, [radPunkt(xr - b, rv * 1.05, a0), radPunkt(xr + b, rv * 1.05, a0), radPunkt(xr + b, rv * 1.05, a1), radPunkt(xr - b, rv * 1.05, a1)]); g.fill();
      }
    }
  }
  /* Ring (Kranz) in einer Ebene x: hinten die Kante, vorn die Fläche */
  function ringPfad(g, r0, r1, a0, a1) {
    g.beginPath();
    if (a1 - a0 >= TAU - 1e-3) { g.moveTo(r1, 0); g.arc(0, 0, r1, 0, TAU); g.moveTo(r0, 0); g.arc(0, 0, r0, TAU, 0, true); }
    else { g.arc(0, 0, r1, a0, a1); g.arc(0, 0, r0, a1, a0, true); g.closePath(); }
  }
  function radKranzMalen(g, A, xA, xB, phi, holz, t, o, vorn) {
    /* xA: Ebene, die vom Betrachter weiter weg liegt (Kante), xB: sichtbare Fläche */
    const a0 = phi, a1 = phi + TAU * t;
    const nV = [Math.sign(xB - xA), 0, 0];
    if (!vorn) holz = hell(holz, -0.3);
    g.save(); ebeneA(g, A, [xA, 0, RZ], [0, 1, 0], [0, 0, 1]);
    g.fillStyle = farbeA(A, hell(holz, -0.25), [0, 0, 1]);
    ringPfad(g, RK0, RR + 0.015, a0, a1); g.fill();
    g.restore();
    g.save(); ebeneA(g, A, [xB, 0, RZ], [0, 1, 0], [0, 0, 1]);
    const L = lichtA(A, nV);
    const lit = (c, al) => rgb([c[0] * L[0], c[1] * L[1], c[2] * L[2]], al);
    g.fillStyle = lit(holz);
    ringPfad(g, RK0, RR + 0.015, a0, a1); g.fill();
    const px = A.s;
    if (px > 9) {
      g.save(); ringPfad(g, RK0, RR + 0.015, a0, a1); g.clip();
      /* Maserung in Bögen: je Felge (Zweierschritt) aus einer festen Tabelle */
      g.lineWidth = Math.max(0.004, 0.9 / px);
      g.strokeStyle = lit(hell(holz, -0.35), 0.28);
      g.beginPath();
      for (let i = 0; i < 7; i++) {
        const r = RK0 + (RR - RK0) * (0.1 + 0.8 * i / 6);
        for (let k = 0; k < 8; k++) { const m = RAD_TAB.mas[i][k % 2], w0 = phi + k * TAU / 8 + m[0], w1 = w0 + m[1]; g.moveTo(Math.cos(w0) * (r + m[2]), Math.sin(w0) * (r + m[2])); g.arc(0, 0, r + m[2], w0, w1); }
      }
      g.stroke();
      /* jede zweite Felge ein wenig anders im Ton */
      for (let k = 0; k < 8; k++) {
        const w0 = phi + (k - 0.5) * TAU / 8, w1 = w0 + TAU / 8;
        g.fillStyle = k % 2 ? "rgba(255,240,220,0.06)" : "rgba(30,18,10,0.07)";
        ringPfad(g, RK0, RR + 0.015, w0, w1); g.fill();
      }
      /* Zellenwände zeichnen sich außen als Nagelreihen ab */
      if (px > 22) {
        g.strokeStyle = lit(hell(holz, -0.45), 0.22); g.lineWidth = Math.max(0.004, 0.8 / px);
        g.beginPath();
        const naegel = [];
        for (let k = 0; k < NZ; k++) {
          const w = phi + k * TAU / NZ;
          if (w > a1) continue;
          const Wd = zellenWand(w);
          g.moveTo(Wd[0][0] * Math.cos(Wd[0][1]), Wd[0][0] * Math.sin(Wd[0][1]));
          g.lineTo(Wd[1][0] * Math.cos(Wd[1][1]), Wd[1][0] * Math.sin(Wd[1][1]));
          g.lineTo(Wd[2][0] * Math.cos(Wd[2][1]), Wd[2][0] * Math.sin(Wd[2][1]));
          if (px > 34) for (const f of [0.25, 0.75]) { const r = Wd[1][0] + (Wd[2][0] - Wd[1][0]) * f, ww = Wd[1][1] + (Wd[2][1] - Wd[1][1]) * f; naegel.push([r * Math.cos(ww), r * Math.sin(ww)]); }
        }
        g.stroke();
        if (naegel.length) { g.fillStyle = lit([34, 30, 28], 0.8); g.beginPath(); for (const [x, y] of naegel) { g.moveTo(x + 0.012, y); g.arc(x, y, 0.012, 0, TAU); } g.fill(); }
      }
      /* Nässe unten (Richtung der Kamera-Senkrechten im Rad: fest im Bild) */
      const gr = g.createLinearGradient(0, -RR, 0, RR);
      gr.addColorStop(0, "rgba(20,14,10,0.35)"); gr.addColorStop(0.45, "rgba(20,14,10,0)"); gr.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = gr; g.fillRect(-RR, -RR, 2 * RR, 2 * RR);
      g.strokeStyle = lit([30, 20, 14], 0.8); g.lineWidth = Math.max(0.006, 1.2 / px);
      g.beginPath();
      for (let k = 0; k < 8; k++) { const w = phi + (k + 0.5) * TAU / 8; if (w > a1) continue; g.moveTo(Math.cos(w) * RK0, Math.sin(w) * RK0); g.lineTo(Math.cos(w) * RR, Math.sin(w) * RR); }
      g.stroke();
      for (let k = 0; k < 8; k++) {
        const w = phi + (k + 0.5) * TAU / 8; if (w > a1) continue;
        g.save(); g.rotate(w);
        g.fillStyle = lit(EISEN); g.fillRect(RK0 + 0.03, -0.075, RR - RK0 - 0.06, 0.15);
        g.fillStyle = lit([120, 70, 40], 0.4); g.fillRect(RK0 + 0.03, 0.0, RR - RK0 - 0.06, 0.075);
        if (px > 30) { g.fillStyle = lit([20, 20, 20]); for (const rr of [RK0 + 0.1, RR - 0.1]) for (const s of [-0.04, 0.04]) { g.beginPath(); g.arc(rr, s, 0.016, 0, TAU); g.fill(); } }
        g.restore();
      }
      if (o.winter) {
        /* Raureif: dichte weiße Körner zum Außenrand hin, je Viertel gleich */
        g.fillStyle = lit([240, 246, 255], 0.6);
        g.beginPath();
        for (let q = 0; q < 4; q++) for (const [dw, r, rr] of RAD_TAB.reif) { const w = phi + q * VIERTEL + dw; if (w > a1) continue; g.moveTo(Math.cos(w) * r + rr, Math.sin(w) * r); g.arc(Math.cos(w) * r, Math.sin(w) * r, rr, 0, TAU); }
        g.fill();
        g.strokeStyle = lit([232, 240, 252], 0.7); g.lineWidth = 0.05;
        g.beginPath(); g.arc(0, 0, RR - 0.03, a0, a1); g.stroke();
      }
      g.restore();
      /* Lichtkante außen oben */
      g.strokeStyle = lit(hell(holz, 0.35), 0.5); g.lineWidth = Math.max(0.006, 1 / px);
      g.beginPath(); g.arc(0, 0, RR + 0.01, Math.max(a0, 0.3), Math.min(a1, Math.PI - 0.3)); g.stroke();
    }
    if (o.winter && t >= 1) eisKranzMalen(g, A, phi, L, vorn, px);
    g.restore();
  }
  /* Eispanzer am Kranz (Winter): dicke, unregelmäßige Wülste auf dem
     Außenrand und kurze Zapfen, die mit dem Rad umlaufen (Kritik Runde 1:
     „Am Rad gibt es keinen einzigen Zapfen"). In der Kranzebene gemalt. */
  function eisKranzMalen(g, A, phi, L, vorn, px) {
    const lit = (c, al) => rgb([c[0] * L[0], c[1] * L[1], c[2] * L[2]], al);
    const k = vorn ? 1 : 0.7;
    /* Wülste: Kreisbögen knapp über dem Rand */
    g.fillStyle = lit([214, 230, 246].map((v) => v * k), 0.92);
    g.beginPath();
    for (let q = 0; q < 4; q++) for (const [dw, d] of RAD_TAB.eis) {
      const w = phi + q * VIERTEL + dw, r = RR + d * 0.3, cx = Math.cos(w) * r, cy = Math.sin(w) * r;
      g.moveTo(cx + d * 1.6, cy); g.ellipse(cx, cy, d * 1.6, d, w + Math.PI / 2, 0, TAU);
    }
    g.fill();
    if (px < 12) return;
    /* Zapfen: schmale Keile radial nach außen, bläulich durchscheinend */
    g.fillStyle = lit([196, 220, 244].map((v) => v * k), 0.8);
    g.beginPath();
    for (let q = 0; q < 4; q++) for (const [dw, l, b] of RAD_TAB.zapfen) {
      const w = phi + q * VIERTEL + dw, c = Math.cos(w), s = Math.sin(w);
      const r0 = RR + 0.01;
      g.moveTo(c * r0 - s * b, s * r0 + c * b); g.lineTo(c * (r0 + l), s * (r0 + l)); g.lineTo(c * r0 + s * b, s * r0 - c * b); g.closePath();
    }
    g.fill();
    g.strokeStyle = lit([255, 255, 255], 0.8); g.lineWidth = Math.max(0.004, 0.8 / px);
    g.beginPath();
    for (let q = 0; q < 4; q++) for (const [dw, l, b] of RAD_TAB.zapfen) { const w = phi + q * VIERTEL + dw, c = Math.cos(w), s = Math.sin(w); g.moveTo(c * RR - s * b * 0.4, s * RR + c * b * 0.4); g.lineTo(c * (RR + l * 0.7), s * (RR + l * 0.7)); }
    g.stroke();
  }
  /* Arme (8 je Seite) mit Nabe: hinten die Seitenkante, vorn die Fläche */
  function armeMalen(g, A, xA, xB, phi, holz, t, o, vorn) {
    const n = Math.max(1, Math.round(NA * klemm(t * 1.05, 0, 1)));
    if (!vorn) holz = hell(holz, -0.25);
    const nV = [Math.sign(xB - xA), 0, 0];
    const rA = 0.3, rE = RK0 + 0.12, b = 0.15;
    g.save(); ebeneA(g, A, [xA, 0, RZ], [0, 1, 0], [0, 0, 1]);
    g.fillStyle = farbeA(A, hell(holz, -0.3), [0, 0, 1]);
    g.beginPath();
    for (let k = 0; k < n; k++) { const w = phi + k * TAU / NA + TAU / 16; const c = Math.cos(w), s = Math.sin(w); g.moveTo(c * rA - s * b / 2, s * rA + c * b / 2); g.lineTo(c * rE - s * b / 2, s * rE + c * b / 2); g.lineTo(c * rE + s * b / 2, s * rE - c * b / 2); g.lineTo(c * rA + s * b / 2, s * rA - c * b / 2); g.closePath(); }
    g.fill();
    g.restore();
    g.save(); ebeneA(g, A, [xB, 0, RZ], [0, 1, 0], [0, 0, 1]);
    const L = lichtA(A, nV);
    const lit = (c, al) => rgb([c[0] * L[0], c[1] * L[1], c[2] * L[2]], al);
    const px = A.s;
    for (let k = 0; k < n; k++) {
      const w = phi + k * TAU / NA + TAU / 16;
      g.save(); g.rotate(w);
      g.fillStyle = lit(hell(holz, (k % 2) * 0.04));
      g.fillRect(rA, -b / 2, rE - rA, b);
      if (px > 16) {
        g.strokeStyle = lit(hell(holz, -0.4), 0.35); g.lineWidth = Math.max(0.004, 0.9 / px);
        g.beginPath(); for (const yy of [-0.04, 0.0, 0.035]) { g.moveTo(rA, yy); g.lineTo(rE, yy + 0.005); } g.stroke();
        g.fillStyle = lit(EISEN); g.fillRect(RK0 - 0.1, -b / 2 - 0.01, 0.07, b + 0.02);
        g.fillStyle = lit([255, 255, 255], 0.1); g.fillRect(rA, -b / 2, rE - rA, 0.02);
      }
      if (o.winter) {
        /* Reif auf der Armkante, Eisbuckel an der Wurzel */
        g.fillStyle = lit([236, 244, 255], 0.75); g.fillRect(rA, -b / 2 - 0.012, rE - rA, 0.03);
        g.beginPath(); g.ellipse(rE - 0.12, -b / 2, 0.08, 0.035, 0, 0, TAU); g.fill();
      }
      g.restore();
    }
    /* Nabe (Rosette) aus Gusseisen mit Schrauben */
    g.fillStyle = lit(EISEN); g.beginPath(); g.arc(0, 0, 0.44, 0, TAU); g.fill();
    if (px > 12) {
      g.strokeStyle = lit([90, 88, 86], 0.8); g.lineWidth = 0.025; g.beginPath(); g.arc(0, 0, 0.4, 0, TAU); g.stroke();
      g.fillStyle = lit([24, 22, 22]);
      for (let k = 0; k < 8; k++) { const w = phi + k * TAU / 8 + TAU / 16; g.beginPath(); g.arc(Math.cos(w) * 0.34, Math.sin(w) * 0.34, 0.028, 0, TAU); g.fill(); }
      g.fillStyle = lit([150, 86, 50], 0.35); g.beginPath(); g.arc(0.05, -0.1, 0.3, 0, TAU); g.fill();
    }
    if (o.winter) { g.fillStyle = weissA(A, [240, 246, 255], 0.7); g.beginPath(); g.ellipse(0, 0.36, 0.3, 0.06, 0, Math.PI, TAU); g.fill(); }
    g.restore();
  }
  /* Radboden von innen (durch das Rad hindurch sichtbar) */
  function bodenInnen(g, A, phi, holz, t, o) {
    const E = A.E, dA = TAU / NZ, n = Math.round(NZ * t);
    const L = [];
    for (let k = 0; k < n; k++) {
      const w0 = phi + k * dA, wm = w0 + dA / 2;
      const nn = [0, -Math.cos(wm), -Math.sin(wm)];
      const d = dot(nn, E);
      if (d <= 0) continue;
      L.push({ w0: w0, nn: nn, d: dot(radPunkt(RX, RI, wm), E) });
    }
    L.sort((a, b) => a.d - b.d);
    const c = o && o.winter ? misch(hell(holz, -0.45), [220, 230, 244], 0.25) : hell(holz, -0.5);
    for (const e of L) {
      g.fillStyle = farbeA(A, c, e.nn);
      pfad3(g, A, [radPunkt(XK2, RI, e.w0), radPunkt(XK3, RI, e.w0), radPunkt(XK3, RI, e.w0 + dA), radPunkt(XK2, RI, e.w0 + dA)]); g.fill();
    }
  }
  /* Zellen: Radboden außen, Zellenwände (Stoß- und Kropfbrett), Wasser */
  const Z_DELTA = 0.13, Z_KNICK = 0.16;
  function zellenWand(w) { return [[RI, w], [RI + Z_KNICK, w], [RR, w + Z_DELTA]]; }
  function yzVon(r, w) { return [r * Math.cos(w), RZ + r * Math.sin(w)]; }
  /* Füllung einer Zelle aus ihrer Lage: gefüllt, nachdem sie unter dem
     Strahl durch ist (φ ≈ 80°), ausgießend, sobald die Mündung kippt */
  function fuellung(wm) {
    let w = ((wm % TAU) + TAU) % TAU; if (w > Math.PI) w -= TAU;
    const grad = w / RAD;
    if (grad > 96 || grad < -110) return 0;
    return klemm((86 - grad) / 16, 0, 1) * klemm((grad + 110) / 70, 0, 1);
  }
  function wasserInZelle(phi, k, winter) {
    const dA = TAU / NZ, w0 = phi + k * dA, w1 = w0 + dA;
    let wm = ((w0 + dA / 2) % TAU + TAU) % TAU; if (wm > Math.PI) wm -= TAU;
    const grad = wm / RAD;
    if (grad > 96 || grad < -110) return null;
    const f = klemm((86 - grad) / 16, 0, 1) * (winter ? 0.6 : 1);
    if (f <= 0.02) return null;
    const P = [yzVon(RI, w0), yzVon(RI + Z_KNICK, w0), yzVon(RR, w0 + Z_DELTA), yzVon(RR, w1 + Z_DELTA), yzVon(RI + Z_KNICK, w1), yzVon(RI, w1)];
    let zmin = Infinity; for (const p of P) zmin = Math.min(zmin, p[1]);
    const lippe = Math.min(P[2][1], P[3][1]);
    const pegel = Math.min(lippe - 0.01, zmin + 0.3 * f);
    if (pegel <= zmin + 0.01) return null;
    const ys = [];
    for (let i = 0; i < P.length; i++) {
      const a = P[i], b = P[(i + 1) % P.length];
      if ((a[1] - pegel) * (b[1] - pegel) < 0) ys.push(a[0] + (b[0] - a[0]) * (pegel - a[1]) / (b[1] - a[1]));
    }
    if (ys.length < 2) return null;
    return { y0: Math.min(...ys), y1: Math.max(...ys), z: pegel, grad: grad };
  }
  function bandMalen(g, A, phi, holz, t, o) {
    const E = A.E, dA = TAU / NZ;
    const n = Math.round(NZ * t);
    const els = [];
    const tiefe = (p) => dot(p, E);
    for (let k = 0; k < n; k++) {
      const w0 = phi + k * dA, wm = w0 + dA / 2;
      const rad = [0, Math.cos(wm), Math.sin(wm)], rd = dot(rad, E);
      if (rd < -0.25) continue;
      if (rd > 0) {
        const pts = [radPunkt(XK2, RI, w0), radPunkt(XK3, RI, w0), radPunkt(XK3, RI, w0 + dA), radPunkt(XK2, RI, w0 + dA)];
        els.push({ d: tiefe(radPunkt(RX, RI, wm)), art: 0, pts: pts, n: rad });
      }
      const Wd = zellenWand(w0);
      for (let s = 0; s < 2; s++) {
        const [r0, a0] = Wd[s], [r1, a1] = Wd[s + 1];
        const p0 = yzVon(r0, a0), p1 = yzVon(r1, a1);
        const dy = p1[0] - p0[0], dz = p1[1] - p0[1];
        let nn = nrm([0, -dz, dy]); if (dot(nn, E) < 0) nn = mul(nn, -1);
        const pts = [[XK2, p0[0], p0[1]], [XK3, p0[0], p0[1]], [XK3, p1[0], p1[1]], [XK2, p1[0], p1[1]]];
        els.push({ d: tiefe([RX, (p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2]) + 0.001, art: 1, pts: pts, n: nn, s: s });
      }
      if (o.wasser) {
        const W = wasserInZelle(phi, k, o.winter);
        if (W) {
          const pts = [[XK2 + 0.01, W.y0, W.z], [XK3 - 0.01, W.y0, W.z], [XK3 - 0.01, W.y1, W.z], [XK2 + 0.01, W.y1, W.z]];
          els.push({ d: tiefe([RX, (W.y0 + W.y1) / 2, W.z]) + 0.002, art: 2, pts: pts, W: W });
        }
      }
    }
    els.sort((a, b) => a.d - b.d);
    const nass = hell(holz, -0.2);
    for (const e of els) {
      if (e.art === 0) g.fillStyle = farbeA(A, hell(nass, -0.1), e.n);
      else if (e.art === 1) g.fillStyle = farbeA(A, e.s ? holz : nass, e.n);
      else g.fillStyle = farbeA(A, o.winter ? [150, 176, 196] : [104, 142, 160], [0, 0, 1], 0.92);
      pfad3(g, A, e.pts); g.fill();
      if (e.art === 1 && A.s > 18 && e.s) {
        const q0 = A.p(...e.pts[2]), q1 = A.p(...e.pts[3]);
        g.strokeStyle = o.winter ? weissA(A, [236, 244, 252], 0.8) : farbeA(A, hell(holz, 0.25), [0, 0, 1], 0.6); g.lineWidth = Math.max(0.6, A.s * (o.winter ? 0.02 : 0.012)); g.beginPath(); g.moveTo(q0[0], q0[1]); g.lineTo(q1[0], q1[1]); g.stroke();
      }
      if (e.art === 2 && A.s > 10) {
        const q = e.pts.map((p) => A.p(...p));
        g.strokeStyle = weissA(A, [255, 255, 255], e.W.grad > 55 ? 0.55 : 0.15); g.lineWidth = Math.max(0.6, A.s * 0.02);
        g.beginPath(); g.moveTo(q[0][0], q[0][1]); g.lineTo(q[1][0], q[1][1]); g.stroke();
      }
    }
  }

  /* ---------------- Wasser ----------------
     Alle Bewegungen hängen an u (0…1, eine Vierteldrehung) mit ganzzahligen
     Vielfachen – so läuft die Bildfolge ohne Sprung im Kreis. */
  const WASSER_T = [118, 150, 168];
  /* Strahl aus dem Gerinne über die Lippe auf den Scheitel: eine glasige
     Zunge, oben glatt, unten aufgeraut */
  function strahlMalen(g, A, u, o) {
    const v = o.winter ? 0.7 : 1.15, pts = [];
    const y0 = GY1 + 0.02, z0 = GZB + 0.03;
    let tau = 0;
    while (tau < 0.4) {
      const y = y0 + v * tau, z = z0 - 4.9 * tau * tau;
      pts.push([y, z]);
      if (Math.hypot(y, z - RZ) < RR - 0.04) break;
      tau += 0.015;
    }
    const breite = o.winter ? 0.34 : 0.66;
    const xa = RX - breite / 2, xb = RX + breite / 2;
    const rand = (x, d) => pts.map((p) => A.p(x, p[0] + (d || 0), p[1]));
    const O = rand(xa, 0), U = rand(xb, 0), O2 = rand(xa, 0.05), U2 = rand(xb, 0.05);
    const band = (P, Q) => { g.beginPath(); P.forEach((q, i) => (i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]))); for (let i = Q.length - 1; i >= 0; i--) g.lineTo(Q[i][0], Q[i][1]); g.closePath(); };
    band(O2, U2); g.fillStyle = farbeA(A, [96, 132, 150], [0, 1, 0.2], 0.55); g.fill();
    band(O, U); g.fillStyle = farbeA(A, [168, 204, 222], [0, 0.5, 1], 0.72); g.fill();
    g.save(); band(O, U); g.clip();
    const sch = A.s * 0.11;
    g.lineWidth = Math.max(0.5, A.s * 0.012); g.setLineDash([A.s * 0.06, A.s * 0.05]); g.lineDashOffset = -u * sch * 6;
    for (let i = 0; i < 7; i++) {
      const Q = rand(xa + (xb - xa) * (i + 0.5) / 7, 0.01);
      g.strokeStyle = weissA(A, [255, 255, 255], (0.25 + 0.25 * ((i * 5) % 3) / 2).toFixed(2));
      g.beginPath(); Q.forEach((q, j) => (j ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]))); g.stroke();
    }
    g.restore();
    const l0 = A.p(xa, y0, z0 + 0.01), l1 = A.p(xb, y0, z0 + 0.01);
    g.strokeStyle = weissA(A, [255, 255, 255], 0.75); g.lineWidth = Math.max(0.8, A.s * 0.02);
    g.beginPath(); g.moveTo(l0[0], l0[1]); g.lineTo(l1[0], l1[1]); g.stroke();
    /* Gischt am Aufschlag in den Zellen */
    const e = pts[pts.length - 1];
    const c = A.p(RX, e[0] + 0.08, e[1] + 0.05);
    const r = A.s * (o.winter ? 0.26 : 0.46);
    const gg = g.createRadialGradient(c[0], c[1], 0, c[0], c[1], r);
    gg.addColorStop(0, weissA(A, [255, 255, 255], 0.55)); gg.addColorStop(0.5, weissA(A, [236, 246, 252], 0.2)); gg.addColorStop(1, weissA(A, [255, 255, 255], 0));
    g.fillStyle = gg; g.fillRect(c[0] - r, c[1] - r, 2 * r, 2 * r);
    g.fillStyle = weissA(A, [255, 255, 255], 0.8);
    g.beginPath();
    for (let i = 0; i < 16; i++) {
      const ph = frac(u * 4 + i * 0.137);
      const x = xa + (xb - xa) * ((i * 0.618) % 1);
      const q = A.p(x, e[0] + 0.05 + ph * 0.3, e[1] + Math.sin(ph * Math.PI) * 0.16);
      const rr = Math.max(0.5, A.s * 0.009 * (1 - ph));
      g.moveTo(q[0] + rr, q[1]); g.arc(q[0], q[1], rr, 0, TAU);
    }
    g.fill();
  }
  /* Der Schwall aus den Zellen der absteigenden Seite (Kritik: „fünf
     gleiche Strahlen wie ein Duschkopf"): jede Zelle im unteren Viertel
     gießt aus ihrer Mündung, die Strahlen werden mit der Bahn des Radrandes
     nach innen geworfen, reißen auf, verschieden breit (fester Zufall je
     Zelle, alle neun Zellen gleich – die Folge schließt nach 90°), dazu
     Tropfenketten an den Rändern. oben: nur der Teil über Gelände. */
  function schwallMalen(g, A, phi, o, oben) {
    const dA = TAU / NZ, om = o.winter ? OMEGA_W : OMEGA, u = o.u || 0;
    const vt = om * RR;
    for (let k = 0; k < NZ; k++) {
      const wm = phi + k * dA + dA / 2 + Z_DELTA;                   // Mündung
      let w = ((wm % TAU) + TAU) % TAU; if (w > Math.PI) w -= TAU;
      const grad = w / RAD;
      if (grad > -18 || grad < -96) continue;
      const menge = klemm((-18 - grad) / 20, 0, 1) * klemm((grad + 96) / 30, 0, 1) * (o.winter ? 0.45 : 1);
      if (menge < 0.05) continue;
      const kz = ((k % 9) + 9) % 9, rz = zufall(700 + kz);
      const y0 = RR * Math.cos(w), z0 = RZ + RR * Math.sin(w);
      const vy = vt * Math.sin(w), vz = -vt * Math.cos(w);
      /* Bahn bis zum Wasserspiegel der Grube */
      const bahn = [];
      for (let tt = 0; tt < 1.2; tt += 0.03) {
        const y = y0 + vy * tt * 0.6 + 0.02, z = z0 + vz * tt - 4.9 * tt * tt;
        if (oben ? z < -0.02 : false) { bahn.push([y, -0.02, tt]); break; }
        bahn.push([y, z, tt]);
        if (z < PZW) break;
      }
      if (bahn.length < 2) continue;
      const brt = RB * (0.3 + 0.55 * rz()) * (0.55 + 0.45 * menge);
      const mitte = RX + (rz() - 0.5) * (RB - brt) * 0.8;
      const wob = rz() * 6;
      const L = [], Rr = [];
      bahn.forEach(([y, z, tt], i) => {
        if (!oben && z > 0.02) return;
        const f = i / (bahn.length - 1);
        const b = brt * (1 - 0.25 * f + 0.18 * Math.sin(f * 7 + wob + u * TAU * 3)) / 2;
        L.push(A.p(mitte - b, y, Math.max(z, PZW))); Rr.push(A.p(mitte + b, y, Math.max(z, PZW)));
      });
      if (L.length < 2) continue;
      const p0 = L[0], p1 = L[L.length - 1];
      const gr = g.createLinearGradient(p0[0], p0[1], p1[0], p1[1]);
      const lf = lichtA(A, [0, 1, 0.3]);
      const c = (a) => "rgba(" + [214, 232, 242].map((v, i) => Math.round(v * Math.min(1, lf[i] + 0.25))).join(",") + "," + a.toFixed(3) + ")";
      gr.addColorStop(0, c(0.62 * menge)); gr.addColorStop(0.6, c(0.34 * menge)); gr.addColorStop(1, c(0.14 * menge));
      g.beginPath(); L.forEach((q, j) => (j ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]))); for (let j = Rr.length - 1; j >= 0; j--) g.lineTo(Rr[j][0], Rr[j][1]); g.closePath();
      g.fillStyle = gr; g.fill();
      if (A.s > 12) {
        /* Fäden im Strahl, nach unten wandernd */
        g.save(); g.clip();
        g.lineWidth = Math.max(0.5, A.s * 0.008); g.setLineDash([A.s * 0.16, A.s * 0.09]); g.lineDashOffset = -u * A.s * 0.25 * 8;
        g.strokeStyle = weissA(A, [255, 255, 255], 0.32 * menge);
        g.beginPath();
        for (let j = 0; j < 3; j++) {
          const q = (j + 0.5) / 3;
          L.forEach((a, i) => { const b = Rr[i], x = a[0] + (b[0] - a[0]) * q, y = a[1] + (b[1] - a[1]) * q; if (i) g.lineTo(x, y); else g.moveTo(x, y); });
        }
        g.stroke();
        g.restore();
        /* Tropfenketten an den Rändern */
        g.fillStyle = weissA(A, [236, 246, 252], 0.7 * menge);
        g.beginPath();
        for (let j = 0; j < 6; j++) {
          const f = frac(u * 3 + j / 6 + kz * 0.11), i = Math.min(L.length - 1, Math.floor(f * (L.length - 1)));
          const seite = j % 2 ? Rr[i] : L[i], dx = (j % 2 ? 1 : -1) * A.s * 0.03 * (1 + f);
          const r = Math.max(0.5, A.s * 0.012 * (1 - f * 0.5));
          g.moveTo(seite[0] + dx + r, seite[1]); g.arc(seite[0] + dx, seite[1], r, 0, TAU);
        }
        g.fill();
      }
    }
  }
  /* Wasserspiegel der Radgrube: dunkles Mühlwasser, zu den Mauern hin
     dunkler, gebrochene Spiegelung des Rades, Gischtwolke und Schaum mit
     wechselnden Ringen am Aufschlag, Strömung zum Untergraben */
  function grubeWasserMalen(g, A, u, o) {
    const z = PZW, px = A.s;
    pfad3(g, A, [[PX0, PY0, z], [PX1, PY0, z], [PX1, PY1, z], [PX0, PY1, z]]);
    const nacht = A.Z.nacht;
    g.fillStyle = farbeA(A, o.winter ? [70, 92, 104] : [40, 62, 60], [0, 0, 1]); g.fill();
    g.save(); g.clip();
    const p0 = A.p(PX0, PY0, z), p1 = A.p(PX1, PY1, z);
    const bx = Math.min(p0[0], p1[0]) - px * 4, by = Math.min(p0[1], p1[1]) - px * 5, bw = Math.abs(p1[0] - p0[0]) + px * 8, bh = Math.abs(p1[1] - p0[1]) + px * 10;
    /* Himmelsspiegel quer, zu den Wänden hin dunkel */
    const gr = g.createLinearGradient(p0[0], p0[1], p1[0], p1[1]);
    gr.addColorStop(0, "rgba(8,14,16,0.55)"); gr.addColorStop(0.4, "rgba(196,214,232," + (0.2 * (1 - nacht)).toFixed(3) + ")"); gr.addColorStop(0.62, "rgba(196,214,232," + (0.1 * (1 - nacht)).toFixed(3) + ")"); gr.addColorStop(1, "rgba(8,14,16,0.5)");
    g.fillStyle = gr; g.fillRect(bx, by, bw, bh);
    /* Vignette an allen vier Mauern */
    for (const [a, b, c, d] of [[PX0, PY0, PX0 + 0.5, PY0], [PX1, PY0, PX1 - 0.5, PY0], [PX0, PY0, PX0, PY0 + 0.6], [PX0, PY1, PX0, PY1 - 0.6]]) {
      const q0 = A.p(a, b, z), q1 = A.p(c, d, z);
      const gv = g.createLinearGradient(q0[0], q0[1], q1[0], q1[1]);
      gv.addColorStop(0, "rgba(6,10,12,0.45)"); gv.addColorStop(1, "rgba(6,10,12,0)");
      g.fillStyle = gv; g.fillRect(bx, by, bw, bh);
    }
    /* gebrochene Spiegelung des Rades: dunkle, zitternde Streifen */
    if (!o.winter || true) {
      g.fillStyle = "rgba(24,18,14," + (o.winter ? 0.18 : 0.3) + ")";
      g.beginPath();
      for (let i = 0; i < 14; i++) {
        const y = -RR * 0.9 + (2 * RR * 0.9) * i / 13, wob = Math.sin(u * TAU * 2 + i * 1.7) * 0.06;
        const a = A.p(XK1 + wob, y, z), b = A.p(XK4 + wob, y + 0.05, z);
        const h = Math.max(0.6, px * 0.04);
        g.moveTo(a[0], a[1] - h / 2); g.lineTo(b[0], b[1] - h / 2); g.lineTo(b[0], b[1] + h / 2); g.lineTo(a[0], a[1] + h / 2); g.closePath();
      }
      g.fill();
    }
    /* Strömung: kurze helle Striche zum Durchlass (Südosten) */
    g.lineWidth = Math.max(0.5, px * 0.014);
    g.strokeStyle = weissA(A, [226, 238, 246], 0.26);
    g.beginPath();
    for (let i = 0; i < 20; i++) {
      const ph = frac(u * 2 + i * 0.173);
      const yS = PY0 + 0.3 + (PY1 - PY0 - 0.6) * ((i * 0.618) % 1);
      const x0 = PX0 + 0.25 + ph * (PX1 - PX0 - 0.4);
      const yy = yS + (UYM - yS) * ph * 0.8;
      const a = A.p(x0, yy, z), b = A.p(x0 + 0.26, yy + (UYM - yS) * 0.05, z);
      g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]);
    }
    g.stroke();
    /* Aufschlag des Schwalls: Schaumteppiche, Ringe, Gischtwolke */
    const yA = RR * 0.62, xs = [RX - 0.25, RX + 0.18, RX];
    const rng = zufall(17);
    for (let k = 0; k < 9; k++) {
      const ph = frac(u * 2 + k / 9);
      const x = xs[k % 3] + (rng() - 0.5) * 0.5 + ph * 0.9, y = yA + (rng() - 0.5) * 0.9 + (UYM - yA) * ph * 0.6;
      const c = A.p(x, y, z), r = px * (0.14 + rng() * 0.16) * (1 + ph);
      const gg = g.createRadialGradient(c[0], c[1], 0, c[0], c[1], r);
      gg.addColorStop(0, weissA(A, [244, 248, 252], 0.45 * (1 - ph))); gg.addColorStop(1, weissA(A, [244, 248, 252], 0));
      g.fillStyle = gg; g.save(); g.translate(c[0], c[1]); g.scale(1, 0.55); g.translate(-c[0], -c[1]); g.fillRect(c[0] - r, c[1] - r, 2 * r, 2 * r); g.restore();
    }
    g.lineWidth = Math.max(0.5, px * 0.01);
    for (let k = 0; k < 5; k++) {
      const ph = frac(u * 3 + k / 5), r = 0.12 + ph * 0.55;
      const cx = RX + [0, -0.3, 0.25, -0.1, 0.15][k], cy = yA + [0, 0.3, -0.2, 0.55, 0.9][k];
      const c = A.p(cx, cy, z), ex = A.p(cx + r, cy, z), ey = A.p(cx, cy + r, z);
      g.strokeStyle = weissA(A, [240, 248, 255], 0.3 * (1 - ph));
      g.beginPath(); g.ellipse(c[0], c[1], Math.hypot(ex[0] - c[0], ex[1] - c[1]), Math.hypot(ey[0] - c[0], ey[1] - c[1]) * 0.9, Math.atan2(ex[1] - c[1], ex[0] - c[0]), 0, TAU); g.stroke();
    }
    /* Sog vor dem Durchlass */
    const d = A.p(PX1 - 0.2, UYM, z);
    const gd = g.createRadialGradient(d[0], d[1], 0, d[0], d[1], px * 0.6);
    gd.addColorStop(0, "rgba(10,16,18,0.5)"); gd.addColorStop(1, "rgba(10,16,18,0)");
    g.fillStyle = gd; g.fillRect(d[0] - px * 0.6, d[1] - px * 0.6, px * 1.2, px * 1.2);
    /* Winter: Eisränder und Treibeis, nur die Mitte fließt offen */
    if (o.winter) {
      const rand = 0.55;
      g.fillStyle = farbeA(A, [214, 228, 240], [0, 0, 1], 0.94);
      for (const [a, b, c, dd] of [[PX0, PY0, PX1, PY0 + rand], [PX0, PY1 - rand * 0.6, PX1, PY1], [PX1 - 0.4, PY0, PX1, UY0 - 0.1], [PX0, PY0, PX0 + 0.3, PY1]]) {
        pfad3(g, A, [[a, b, z + 0.01], [c, b, z + 0.01], [c, dd, z + 0.01], [a, dd, z + 0.01]]); g.fill();
      }
      /* Treibeisschollen, die zum Durchlass ziehen */
      const rs = zufall(29);
      for (let k = 0; k < 6; k++) {
        const ph = frac(u + k / 6), x = PX0 + 0.5 + ph * (PX1 - PX0 - 0.9), y = -1.5 + rs() * 2.6 + (UYM - 0.5) * ph * 0.5;
        const r = 0.12 + rs() * 0.18;
        pfad3(g, A, [[x - r, y - r * 0.6, z + 0.012], [x + r * 0.8, y - r * 0.8, z + 0.012], [x + r, y + r * 0.5, z + 0.012], [x - r * 0.6, y + r * 0.7, z + 0.012]]);
        g.fillStyle = farbeA(A, [226, 236, 246], [0, 0, 1], 0.9); g.fill();
      }
      g.strokeStyle = weissA(A, [255, 255, 255], 0.55); g.lineWidth = Math.max(0.5, px * 0.012);
      const rr = zufall(4);
      g.beginPath();
      for (let i = 0; i < 10; i++) { const x = PX0 + rr() * (PX1 - PX0), y = rr() < 0.5 ? PY0 + rr() * rand : PY1 - rr() * rand * 0.6; const a = A.p(x, y, z + 0.01), b = A.p(x + 0.3, y + (rr() - 0.5) * 0.3, z + 0.01); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); }
      g.stroke();
    }
    g.restore();
  }
  /* Untergraben: fließt nach Osten (zum Bach), Strömungsstreifen; im
     Winter Eisränder und eine dunkle offene Rinne */
  function grabenWasserMalen(g, A, u, o) {
    const z = PZW, px = A.s;
    pfad3(g, A, [[PX1 - 0.02, UY0, z], [XG1 + 0.05, UY0, z], [XG1 + 0.05, UY1, z], [PX1 - 0.02, UY1, z]]);
    g.fillStyle = farbeA(A, o.winter ? [72, 94, 108] : [44, 68, 66], [0, 0, 1]); g.fill();
    g.save(); g.clip();
    const q0 = A.p(PX1, UY0, z), q1 = A.p(PX1, UY1, z);
    const gv = g.createLinearGradient(q0[0], q0[1], q1[0], q1[1]);
    gv.addColorStop(0, "rgba(6,10,12,0.4)"); gv.addColorStop(0.5, "rgba(190,210,228," + (0.14 * (1 - A.Z.nacht)).toFixed(3) + ")"); gv.addColorStop(1, "rgba(6,10,12,0.4)");
    g.fillStyle = gv; g.fillRect(-1e4, -1e4, 2e4, 2e4);
    g.lineWidth = Math.max(0.5, px * 0.014);
    g.strokeStyle = weissA(A, [228, 240, 248], o.winter ? 0.2 : 0.4);
    g.beginPath();
    for (let i = 0; i < 12; i++) {
      const ph = frac(u * 3 + i * 0.29), y = UY0 + 0.15 + (UY1 - UY0 - 0.3) * ((i * 0.618) % 1);
      const x = PX1 + ph * (XG1 - PX1 + 0.3), l = 0.18 + 0.2 * ph;
      const a = A.p(x, y, z), b = A.p(x + l, y, z);
      g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]);
    }
    g.stroke();
    if (o.winter) {
      g.fillStyle = farbeA(A, [218, 230, 242], [0, 0, 1], 0.94);
      for (const [y0, y1] of [[UY0, UY0 + 0.3], [UY1 - 0.26, UY1]]) { pfad3(g, A, [[PX1, y0, z + 0.01], [XG1 + 0.05, y0, z + 0.01], [XG1 + 0.05, y1, z + 0.01], [PX1, y1, z + 0.01]]); g.fill(); }
    }
    g.restore();
  }
  /* Dampf (Winter): das Wasser ist wärmer als die Luft – über dem
     fallenden Wasser steigen zarte Schwaden auf */
  function dampfMalen(g, A, u) {
    const px = A.s;
    for (let k = 0; k < 7; k++) {
      const ph = frac(u + k / 7);
      const y = 0.6 + (k % 3) * 0.55, x = RX + ((k * 0.37) % 1 - 0.5) * 0.9;
      const c = A.p(x + ph * 0.3, y - ph * 0.4, 0.2 + ph * 3.2);
      const r = px * (0.35 + ph * 0.9);
      const a = 0.16 * Math.sin(ph * Math.PI);
      const gg = g.createRadialGradient(c[0], c[1], 0, c[0], c[1], r);
      gg.addColorStop(0, weissA(A, [236, 242, 250], a)); gg.addColorStop(1, weissA(A, [236, 242, 250], 0));
      g.fillStyle = gg; g.fillRect(c[0] - r, c[1] - r, 2 * r, 2 * r);
    }
  }
  /* Wasser im Gerinne: Strömungsstreifen, die zum Auslauf schneller und
     länger werden; im Winter Eisränder an den Brettern */
  function gerinneWasserMalen(g, A, u, o, statisch) {
    const z = GZW, x0 = GX0 + GW, x1 = GX1 - GW;
    pfad3(g, A, [[x0, GY0, z], [x1, GY0, z], [x1, GY1, z], [x0, GY1, z]]);
    g.fillStyle = farbeA(A, o.winter ? [132, 156, 174] : WASSER_T, [0, 0, 1], 0.95); g.fill();
    g.save(); g.clip();
    /* dunkler an den Brettern (Schatten der Wände), heller Himmel in der Mitte */
    const q0 = A.p(x0, 0, z), q1 = A.p(x1, 0, z);
    const gv = g.createLinearGradient(q0[0], q0[1], q1[0], q1[1]);
    gv.addColorStop(0, "rgba(20,34,40,0.35)"); gv.addColorStop(0.5, "rgba(210,226,240," + (0.18 * (1 - A.Z.nacht)).toFixed(3) + ")"); gv.addColorStop(1, "rgba(20,34,40,0.3)");
    g.fillStyle = gv; g.fillRect(-1e4, -1e4, 2e4, 2e4);
    g.lineWidth = Math.max(0.6, A.s * 0.016);
    for (let i = 0; i < 18; i++) {
      const x = x0 + 0.06 + (x1 - x0 - 0.12) * ((i * 0.618) % 1);
      const ph = statisch ? (i * 0.137) % 1 : frac(u + i * 0.137);
      const f = Math.pow(ph, 1.6), y = GY0 + f * (GY1 - GY0), l = 0.2 + 0.55 * f;
      const a = A.p(x, y, z), b = A.p(x, Math.min(GY1, y + l), z);
      g.strokeStyle = weissA(A, [235, 244, 250], (0.5 * Math.sin(ph * Math.PI)).toFixed(3));
      g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
    }
    if (o.winter) {
      g.fillStyle = farbeA(A, [220, 232, 244], [0, 0, 1], 0.85);
      for (const xx of [x0, x1 - 0.14]) { pfad3(g, A, [[xx, GY0, z + 0.005], [xx + 0.14, GY0, z + 0.005], [xx + 0.14, GY1, z + 0.005], [xx, GY1, z + 0.005]]); g.fill(); }
    }
    g.restore();
  }

  /* =====================================================================
     VERDECKER: was im Sprite steht und vor dem Lebendigen liegt, wird als
     Umriss aus dem Malbereich ausgespart. Jeder Verdecker hat eine Probe
     „liegt vor dem Rad / der Grube / dem Gerinnewasser / dem Strahl /
     dem Untergraben" aus der Blickrichtung E.
     ===================================================================== */
  function kastenPunkte(x0, y0, z0, x1, y1, z1) {
    return [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]];
  }
  const HAUS_PUNKTE = (function () {
    const p = kastenPunkte(XW0, -YW, 0, XW1, YW, ZT);
    for (const t of [1, -1]) {
      p.push([XWE0, t * YTE, ZTE], [XWE1, t * YTE, ZTE], [XWE0, t * YWE, ZWE], [XWE1, t * YWE, ZWE]);
    }
    p.push([XF0, 0, ZF], [XF1, 0, ZF]);
    p.push([-3.95, -0.35, ZF + 1.3], [-3.25, 0.35, ZF + 1.3]);
    return p;
  })();
  const DAMM_PUNKTE = [[TD_XF, TD_Y1, 0], [TD_X1, TD_Y1, 0], [TD_X1, TD_YF, 0], [TD_XF, TD_YF, 0], [TD_X0, TD_Y1, TD_Z], [TD_X1, TD_Y1, TD_Z], [TD_X1, TD_Y0, TD_Z], [TD_X0, TD_Y0, TD_Z]];
  const immer = () => true, nie = () => false;
  function verdeckerListe() {
    const V = [];
    V.push({ name: "haus", pts: HAUS_PUNKTE, rad: (E) => E[0] < 0, grube: immer, gerinne: (E) => E[0] < 0, strahl: (E) => E[0] < 0, graben: immer });
    /* Außenlager in Stücken (zwischen den Stielen des Bocks sieht man die Nabe) */
    const lagerV = (name, pts) => V.push({ name: name, pts: pts, rad: (E) => E[0] > 0, grube: immer, gerinne: nie, strahl: (E) => E[0] > 0, graben: nie });
    lagerV("lager-pfeiler", kastenPunkte(LX0, -LY - 0.02, PZW, LX1, LY + 0.02, LZ_P));
    for (const [a, b] of BOCK_STIELE) lagerV("lager-stiel", kastenPunkte(a[0] - 0.09, a[1] - 0.09, a[2], a[0] + 0.09, a[1] + 0.09, a[2]).concat(kastenPunkte(b[0] - 0.09, b[1] - 0.09, b[2], b[0] + 0.09, b[1] + 0.09, b[2])));
    lagerV("lager-sattel", kastenPunkte(LX0 + 0.04, -0.34, LZ1, LX1 - 0.1, 0.34, LZB));
    lagerV("lager-deckel", kastenPunkte(X_LAGER - 0.16, -RW - 0.07, LZB - 0.02, X_LAGER + 0.12, RW + 0.07, RZ + RW + 0.08));
    V.push({ name: "gerinne", pts: kastenPunkte(GX0, GY0, GZ0, GX1, GY1, GZ1), rad: immer, grube: immer, gerinne: nie, strahl: (E) => E[1] < 0, graben: immer });
    V.push({ name: "konsole", pts: kastenPunkte(XW1, KONSOLE_Y - 0.09, GZ0 - 0.2, GX1 + 0.12, KONSOLE_Y + 0.09, GZ0), rad: immer, grube: immer, gerinne: nie, strahl: nie, graben: nie });
    for (const yb of BOECKE) V.push({ name: "bock", pts: kastenPunkte(GX0 - 0.35, yb - 0.12, 0, GX1 + 0.35, yb + 0.12, GZ0), rad: (E) => E[1] < 0, grube: immer, gerinne: nie, strahl: nie, graben: nie });
    V.push({ name: "damm", pts: DAMM_PUNKTE, rad: (E) => E[1] < 0, grube: (E) => E[1] < 0, gerinne: (E) => E[1] < 0, strahl: (E) => E[1] < 0, graben: (E) => E[1] < 0 });
    V.push({ name: "schuetz", pts: kastenPunkte(GX0 - 0.12, TD_Y1 + 0.02, TD_Z - 0.4, GX1 + 0.12, TD_Y1 + 0.3, TD_Z + 1.35), rad: (E) => E[1] < 0, grube: (E) => E[1] < 0, gerinne: (E) => E[1] < 0, strahl: (E) => E[1] < 0, graben: nie });
    V.push({ name: "rand-s", pts: kastenPunkte(PX0, PY1, 0, PX1 + RAND_B, PY1 + RAND_B, RAND_H + 0.1), rad: (E) => E[1] > 0, grube: immer, gerinne: nie, strahl: nie, graben: nie });
    V.push({ name: "rand-n", pts: kastenPunkte(PX0, PY0 - RAND_B, 0, PX1 + RAND_B, PY0, RAND_H + 0.1), rad: (E) => E[1] < 0, grube: immer, gerinne: nie, strahl: nie, graben: nie });
    V.push({ name: "rand-o", pts: kastenPunkte(PX1, PY0 - RAND_B, 0, PX1 + RAND_B, UY0, RAND_H + 0.1), rad: (E) => E[0] > 0, grube: immer, gerinne: nie, strahl: nie, graben: nie });
    V.push({ name: "rand-o2", pts: kastenPunkte(PX1, UY1, 0, PX1 + RAND_B, PY1 + RAND_B, RAND_H + 0.1), rad: (E) => E[0] > 0, grube: immer, gerinne: nie, strahl: nie, graben: nie });
    V.push({ name: "durchlass", pts: kastenPunkte(PX1, UY0 - 0.2, 0, PX1 + RAND_B, UY1 + 0.2, RAND_H + 0.1), rad: nie, grube: (E) => E[0] > 0, gerinne: nie, strahl: nie, graben: (E) => E[0] < 0 });
    return V;
  }
  const VERDECKER = verdeckerListe();
  /* Leistung: statt bis zu 14 Clips mit Ausschnitt (jeder Clip kostet beim
     Rastern eine Maske) wird jeder Abschnitt einer Bildfolge auf eine
     Hilfsfläche gemalt, die Umrisse der Verdecker werden in EINER Füllung
     herausgelöscht, dann wird das Ergebnis hingelegt (−65 % Malzeit). */
  let HILF = null;
  function abschnitt(g, A, art, malen) {
    const W = g.canvas.width, H = g.canvas.height;
    if (!HILF) HILF = document.createElement("canvas");
    if (HILF.width < W || HILF.height < H) { HILF.width = Math.max(HILF.width, W); HILF.height = Math.max(HILF.height, H); }
    const h = HILF.getContext("2d");
    h.setTransform(1, 0, 0, 1, 0, 0); h.clearRect(0, 0, W, H);
    h.save(); malen(h); h.restore();
    h.save(); h.globalCompositeOperation = "destination-out"; h.fillStyle = "#000"; h.beginPath();
    for (const v of VERDECKER) {
      if (!v[art](A.E)) continue;
      const hu = huelle2(v.pts.map((p) => A.p(p[0], p[1], p[2])));
      if (hu.length < 3) continue;
      h.moveTo(hu[0][0], hu[0][1]); for (let i = 1; i < hu.length; i++) h.lineTo(hu[i][0], hu[i][1]); h.closePath();
    }
    h.fill("nonzero"); h.restore();
    g.drawImage(HILF, 0, 0, W, H, 0, 0, W, H);
  }
  /* Öffnungen auf Geländehöhe als Clip */
  function grubeClip(g, A) { pfad3(g, A, [[PX0, PY0, 0], [PX1, PY0, 0], [PX1, PY1, 0], [PX0, PY1, 0]]); g.clip(); }
  function grabenClip(g, A) { pfad3(g, A, [[PX1 + RAND_B, UY0, 0], [XG1 + 0.05, UY0, 0], [XG1 + 0.05, UY1, 0], [PX1 + RAND_B, UY1, 0]]); g.clip(); }
  function gerinneClip(g, A) { pfad3(g, A, [[GX0 + GW, GY0, GZ1], [GX1 - GW, GY0, GZ1], [GX1 - GW, GY1, GZ1], [GX0 + GW, GY1, GZ1]]); g.clip(); }

  /* =====================================================================
     DAS LEBEN ALS BILDFOLGE
     Je Ansicht (Drehung, Zoom, Jahres- und Tageszeit) zwei Folgen:
       „rad"   – Grubenwasser, Untergraben, Rad mit Schwall, Strahl, Dampf
                 (eine Vierteldrehung, 16–36 Bilder, nach Speicher)
       „rinne" – Wasser im Gerinne (eigene Schleife, 12 Bilder)
     Die Bilder werden erst gemalt, wenn sie gebraucht werden (höchstens
     eines je Bild der Szene), mit allen Aussparungen, und danach nur noch
     hingelegt. Die Zeit wird dadurch von selbst auf ~10–15 Bilder je
     Sekunde gestuft.
     ===================================================================== */
  const OMEGA = 0.62, OMEGA_W = 0.36;                 // rad/s (Umfang ≈ 1,5 m/s)
  const PHI0 = 0.21;
  const LEBEN_S = 14;                                 // darunter steht das Rad still im Sprite
  const T_RINNE = 1.1;
  const FOLGEN = new Map();
  let folgenPixel = 0;
  const MALTAKT = {};
  const FOLGEN_MAX = 22e6;
  const sStufe = (s) => Math.exp(Math.round(Math.log(s) / 0.001) * 0.001);
  function folgeRahmen(art, s, gier) {
    const A = ansichtBild(s, gier, ST.ZEITEN.tag, "winter", 0, 0);
    const pts = [];
    const kasten = (x0, y0, z0, x1, y1, z1) => { for (const p of kastenPunkte(x0, y0, z0, x1, y1, z1)) pts.push(A.p(p[0], p[1], p[2])); };
    if (art === "rad") {
      kasten(XK1 - 0.25, -RR - 0.4, PZW, X_LAGER + 0.1, RR + 0.8, RZ + RR + 0.5);
      kasten(PX0, PY0, PZB, PX1, PY1, 3.4);
      kasten(PX1, UY0, UZB, XG1 + 0.1, UY1, 0.1);
      kasten(GX0, GY1 - 0.1, GZ0, GX1, GY1 + 1.0, GZ1 + 0.3);
    } else kasten(GX0, GY0, GZW - 0.05, GX1, GY1, GZ1);
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const p of pts) { x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]); }
    const fx = Math.floor(x0) - 2, fy = Math.floor(y0) - 2;
    return { fx: fx, fy: fy, w: Math.ceil(x1) + 2 - fx, h: Math.ceil(y1) + 2 - fy };
  }
  function folgeHolen(art, P, winter) {
    const s = sStufe(P.s), gier = Math.round(P.gier * 10) / 10;
    const basis = art + "|" + gier + "|" + P.jahr + "|" + (P.Z.name || P.Z.nacht);
    const schl = basis + "|" + s.toFixed(3);
    let f = FOLGEN.get(schl);
    if (f) { f.zuletzt = ST.jetzt || 0; return f; }
    const r = folgeRahmen(art, s, gier);
    const px = r.w * r.h;
    let N = art === "rinne" ? 12 : klemm(Math.round((winter ? 4.4 : 2.6) * 11), 16, 36);
    if (art === "rad") N = Math.max(12, Math.min(N, Math.floor(FOLGEN_MAX * 0.8 / px)));
    f = { art: art, s: s, gier: gier, N: N, bilder: new Array(N), r: r, px: px, zuletzt: ST.jetzt || 0, schl: schl };
    FOLGEN.set(schl, f);
    aufraeumenFolgen(f);
    return f;
  }
  function aufraeumenFolgen(neu) {
    folgenPixel = 0;
    for (const f of FOLGEN.values()) folgenPixel += f.px * f.bilder.filter(Boolean).length;
    if (folgenPixel + neu.px * neu.N < FOLGEN_MAX) return;
    const alle = [...FOLGEN.values()].filter((f) => f !== neu).sort((a, b) => a.zuletzt - b.zuletzt);
    for (const f of alle) {
      if (folgenPixel + neu.px * neu.N < FOLGEN_MAX) break;
      for (const b of f.bilder) if (b) { folgenPixel -= f.px; b.width = b.height = 0; }
      FOLGEN.delete(f.schl);
    }
  }
  function bildMalen(f, i, P, winter) {
    const c = document.createElement("canvas"); c.width = Math.max(1, f.r.w); c.height = Math.max(1, f.r.h);
    const g = c.getContext("2d");
    const A = ansichtBild(f.s, f.gier, P.Z, P.jahr, f.r.fx, f.r.fy);
    const u = i / f.N;
    const W = { winter: winter, wasser: true, bau: 1, schwall: true, u: u };
    if (f.art === "rinne") {
      abschnitt(g, A, "gerinne", (h) => { gerinneClip(h, A); gerinneWasserMalen(h, A, u, W, false); });
      return c;
    }
    const phi = PHI0 - u * VIERTEL;
    /* 1. Grube: Wasser, darin der untere Teil des Schwalls */
    abschnitt(g, A, "grube", (h) => { grubeClip(h, A); grubeWasserMalen(h, A, u, W); schwallMalen(h, A, phi, W, false); });
    /* 2. Untergraben */
    abschnitt(g, A, "graben", (h) => { grabenClip(h, A); grabenWasserMalen(h, A, u, W); });
    /* 3. Rad (mit dem Schwall über Gelände) */
    abschnitt(g, A, "rad", (h) => { radMalen(h, A, phi, W); if (winter) dampfMalen(h, A, u); });
    /* 4. Strahl aus dem Gerinne */
    abschnitt(g, A, "strahl", (h) => { strahlMalen(h, A, u, W); });
    return c;
  }
  /* Gleichmäßig nachmalen: nach einem neuen Bild der Folge wartet die Mühle
     mindestens das Anderthalbfache seiner Malzeit (so kostet das Füllen
     einer neuen Folge höchstens ~40 % der Zeit, statt ein paar Bilder lang
     zu ruckeln). Gibt es noch gar kein Bild, wird sofort gemalt. */
  const MAL = { dauer: 0, ende: -1e9 };
  function folgeZeichnen(g, P, art, u, winter) {
    const f = folgeHolen(art, P, winter);
    let i = Math.floor(u * f.N) % f.N;
    if (!f.bilder[i]) {
      const takt = ST.jetzt || 0, jetzt = performance.now();
      const leer = !f.bilder.some(Boolean);
      if ((takt !== MALTAKT[art] || !takt) && (leer || jetzt - MAL.ende >= 1.5 * MAL.dauer)) {
        MALTAKT[art] = takt;
        f.bilder[i] = bildMalen(f, i, P, winter);
        folgenPixel += f.px;
        MAL.ende = performance.now(); MAL.dauer = MAL.ende - jetzt;
      } else {
        /* schon gemalt in diesem Takt: nächstes vorhandenes Bild davor */
        let j = i, n = 0;
        while (!f.bilder[j] && n < f.N) { j = (j - 1 + f.N) % f.N; n++; }
        if (!f.bilder[j]) return;
        i = j;
      }
    }
    const k = P.s / f.s, X0 = Math.round(P.kern0[0]), Y0 = Math.round(P.kern0[1]);
    if (Math.abs(k - 1) < 0.002) g.drawImage(f.bilder[i], X0 + f.r.fx, Y0 + f.r.fy);
    else g.drawImage(f.bilder[i], P.kern0[0] + f.r.fx * k, P.kern0[1] + f.r.fy * k, f.r.w * k, f.r.h * k);
  }
  function lebenMalen(g, P, o, R) {
    if (P.Z.nacht > 0.02) { const A = ansichtLeben(P); if (A.E[1] > 0.03) lichtPfuetzen(g, A, P.Z.nacht, o.winter); }
    if (P.s < LEBEN_S || (R.spriteS != null && R.spriteS < LEBEN_S)) return;
    const t = P.t || 0, om = o.winter ? OMEGA_W : OMEGA;
    folgeZeichnen(g, P, "rad", frac(t * om / VIERTEL), o.winter);
    folgeZeichnen(g, P, "rinne", frac(t / T_RINNE), o.winter);
  }
  function lichtPfuetzen(g, A, nacht, winter) {
    g.save();
    g.globalCompositeOperation = "lighter";
    ebeneA(g, A, [0, 0, 0.02], [1, 0, 0], [0, 1, 0]);
    g.beginPath(); g.rect(-8, YW + 0.02, 16, 6); g.clip();
    for (const [x, y, r, k] of [[-0.3, YW + 1.1, 3.0, 0.75], [-2.9, YW + 0.7, 1.5, 0.35], [0.6, YW + 0.7, 1.4, 0.35]]) {
      const gr = g.createRadialGradient(x, y, 0, x, y, r);
      const a = nacht * k * (winter ? 1 : 0.8);
      gr.addColorStop(0, "rgba(255,190,110," + (0.42 * a).toFixed(3) + ")"); gr.addColorStop(0.45, "rgba(255,180,100," + (0.16 * a).toFixed(3) + ")"); gr.addColorStop(1, "rgba(255,170,90,0)");
      g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r);
    }
    g.restore();
  }
  /* Radsilhouette im Sprite (für den Treffer beim Antippen und als Ersatz
     unter dem Leben): Hülle beider Kränze ohne die Mitte, schwach deckend */
  function radSilhouette(g, A, alpha) {
    const N = 40;
    const kreis = (x, r) => Array.from({ length: N }, (_, i) => A.p(...radPunkt(x, r, i / N * TAU)));
    const aus = huelle2(kreis(XK1, RR + 0.02).concat(kreis(XK4, RR + 0.02)));
    let loch = kreis(XK1, RK0);
    const k2 = kreis(XK4, RK0);
    const fl = (P) => { let f = 0; for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length]; f += a[0] * b[1] - b[0] * a[1]; } return f; };
    const sgn = fl(k2) > 0 ? 1 : -1;
    for (let i = 0; i < k2.length && loch.length >= 3; i++) {
      const a = k2[i], b = k2[(i + 1) % k2.length];
      loch = schneide(loch, (p) => sgn * ((b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0])));
    }
    g.beginPath(); g.moveTo(aus[0][0], aus[0][1]); for (let i = 1; i < aus.length; i++) g.lineTo(aus[i][0], aus[i][1]); g.closePath();
    if (loch.length >= 3) { g.moveTo(loch[0][0], loch[0][1]); for (let i = 1; i < loch.length; i++) g.lineTo(loch[i][0], loch[i][1]); g.closePath(); }
    g.fillStyle = "rgba(46,34,24," + alpha + ")"; g.fill("evenodd");
  }

  /* =====================================================================
     BAUGRUBE UND RADGRUBE
     Alles unter Gelände ist nur durch die Öffnung zu sehen: jede Fläche
     wird auf den Teil beschnitten, der durch das Loch sichtbar ist.
     ===================================================================== */
  function lochClip(g, F, B, R) {
    const f = F.flaeche, n = kreuz(f.u, f.v), e = B.e;
    const en = dot(e, n);
    if (Math.abs(en) < 1e-3) return false;
    const pts = [];
    for (const [x, y] of [[R[0], R[1]], [R[2], R[1]], [R[2], R[3]], [R[0], R[3]]]) {
      const C = [x, y, R[4] || 0];
      const t = dot(sub(C, fo(f)), n) / en;
      const P = sub(C, mul(e, t)), d = sub(P, fo(f));
      pts.push([dot(d, f.u), dot(d, f.v)]);
    }
    poly(g, pts); g.clip();
    return true;
  }
  /* Schatten des Grubenrands: beleuchtet ist nur, was das Licht durch die
     Öffnung erreicht */
  function grubenSchatten(g, F, R, w, h) {
    const f = F.flaeche, n = kreuz(f.u, f.v);
    g.save();
    g.beginPath(); g.rect(-0.5, -0.5, w + 1, h + 1);
    let licht = true;
    const pts = [];
    for (const [x, y] of [[R[0], R[1]], [R[2], R[1]], [R[2], R[3]], [R[0], R[3]]]) {
      const d = sub([x, y, 0], fo(f)), a = dot(d, f.u), b = dot(d, f.v), hh = dot(d, n);
      if (hh < -0.01) { licht = false; break; }
      const sv = hh > 0.005 ? F.schatten(hh) : [0, 0];
      if (!sv) { licht = false; break; }
      pts.push([a + sv[0], b + sv[1]]);
    }
    if (licht) { const H = huelle2(pts); if (H.length >= 3) { g.moveTo(H[0][0], H[0][1]); for (let i = H.length - 1; i > 0; i--) g.lineTo(H[i][0], H[i][1]); g.closePath(); } }
    g.fillStyle = "rgba(20,24,52,0.32)";
    g.fill("evenodd");
    g.restore();
  }
  function erdeMalen(g, F, w, h, saat, winter) {
    const L = belichter(F, 0.05), rng = zufall(saat), px = F.px;
    const sch = [[0, [64, 46, 32]], [0.28, [124, 88, 54]], [0.62, [168, 128, 82]]];
    for (let i = 0; i < sch.length; i++) {
      const y0 = sch[i][0];
      g.fillStyle = L(sch[i][1]);
      g.beginPath(); g.moveTo(-0.1, h + 0.2); g.lineTo(-0.1, y0);
      for (let x = 0; x <= w + 0.3; x += 0.3) g.lineTo(x, y0 + (i ? Math.sin(x * 1.7 + i * 3 + saat) * 0.05 + Math.sin(x * 4.1 + i) * 0.025 : 0));
      g.lineTo(w + 0.3, h + 0.2); g.closePath(); g.fill();
    }
    if (px > 6) rausch(g, 0, 0, w, h, 0.9, 0.35, saat + 3, 3);
    if (px > 10) {
      for (let i = 0; i < Math.min(300, w * h * 8); i++) { const x = rng() * w, y = 0.3 + rng() * (h - 0.3), r = 0.015 + rng() * 0.035; g.fillStyle = L(hell([140, 130, 118], (rng() - 0.5) * 0.4)); g.beginPath(); g.ellipse(x, y, r * 1.3, r, rng() * 3, 0, TAU); g.fill(); }
      g.strokeStyle = L([30, 20, 14], 0.18); g.lineWidth = 0.02;
      for (let x = rng() * 0.3; x < w; x += 0.25 + rng() * 0.2) { g.beginPath(); g.moveTo(x, 0.3); g.lineTo(x + 0.03, h); g.stroke(); }
    }
    const gd = g.createLinearGradient(0, 0, 0, h);
    gd.addColorStop(0, "rgba(10,8,20,0)"); gd.addColorStop(1, "rgba(10,8,20,0.25)");
    g.fillStyle = gd; g.fillRect(-0.1, 0, w + 0.2, h + 0.1);
    if (winter) { g.fillStyle = L([240, 244, 251]); g.fillRect(-0.1, -0.1, w + 0.2, 0.14); g.fillStyle = L([205, 216, 236]); g.fillRect(-0.1, 0.04, w + 0.2, 0.02); }
  }
  /* Grubenwand: Erde oben, Bruchstein (nass) von unten bis „stein" */
  function grubenWandMal(B, R, T, stein, winter, saat, opt) {
    opt = opt || {};
    return function (g, F) {
      const w = F.w, h = F.h;
      g.save();
      if (!lochClip(g, F, B, R)) { g.restore(); return; }
      const hE = T;                                  // Tiefe der Grube = Flächenhöhe
      if (stein < hE - 0.01) erdeMalen(g, F, w, hE, saat, winter);
      if (stein > 0.01) {
        const L = ST.lichtFaktor(F.n, F.zeit, 0, F.jahr);
        g.save();
        bruchsteinMalen(g, F, 0, hE - stein, w, stein, { saat: saat + 50, bis: stein, lage: 1 });
        /* nass und dunkel, Algen an der Wasserlinie, Kalkausblühungen */
        const wl = -PZW;
        if (opt.wasser) {
          g.fillStyle = "rgba(30,44,30,0.4)"; g.fillRect(-0.1, wl - 0.1, w + 0.2, h);
          const ga = g.createLinearGradient(0, wl - 0.35, 0, wl);
          ga.addColorStop(0, "rgba(60,80,40,0)"); ga.addColorStop(1, winter ? "rgba(200,220,236,0.6)" : "rgba(52,84,40,0.55)");
          g.fillStyle = ga; g.fillRect(-0.1, wl - 0.35, w + 0.2, 0.35);
        }
        const gn = g.createLinearGradient(0, 0, 0, h);
        gn.addColorStop(0, "rgba(20,18,24,0.1)"); gn.addColorStop(1, "rgba(10,12,20,0.4)");
        g.fillStyle = gn; g.fillRect(-0.1, 0, w + 0.2, h + 0.1);
        /* Licht der Grube selbst (keinLicht): multiplizieren */
        g.globalCompositeOperation = "multiply";
        g.fillStyle = rgb([L[0] * 255, L[1] * 255, L[2] * 255]);
        g.fillRect(-0.1, hE - stein - 0.05, w + 0.2, stein + 0.1);
        g.globalCompositeOperation = "source-over";
        if (opt.durchlass) {
          /* gewölbter Durchlass, durch den das Wasser nach Osten abfließt */
          const cx = opt.durchlass, bw = 0.96, yb = wl + 0.05;
          g.fillStyle = rgb([L[0] * SANDSTEIN[0], L[1] * SANDSTEIN[1], L[2] * SANDSTEIN[2]]);
          g.beginPath(); g.moveTo(cx - bw / 2 - 0.16, yb); g.lineTo(cx - bw / 2 - 0.16, yb - 0.35); g.arc(cx, yb - 0.35, bw / 2 + 0.16, Math.PI, 0); g.lineTo(cx + bw / 2 + 0.16, yb); g.closePath(); g.fill();
          g.fillStyle = "rgb(12,14,16)";
          g.beginPath(); g.moveTo(cx - bw / 2, yb); g.lineTo(cx - bw / 2, yb - 0.35); g.arc(cx, yb - 0.35, bw / 2, Math.PI, 0); g.lineTo(cx + bw / 2, yb); g.closePath(); g.fill();
        }
        g.restore();
      }
      grubenSchatten(g, F, R, w, h);
      g.restore();
    };
  }
  function grubenBodenMal(B, R, beton, winter, saat) {
    return function (g, F) {
      const w = F.w, h = F.h;
      g.save();
      if (!lochClip(g, F, B, R)) { g.restore(); return; }
      const L = belichter(F, 0.05);
      g.fillStyle = beton ? L([150, 148, 142]) : L([118, 88, 60]); g.fillRect(-0.1, -0.1, w + 0.2, h + 0.2);
      if (F.px > 6) rausch(g, 0, 0, w, h, 1.2, 0.3, saat, 3);
      if (winter && !beton) { g.fillStyle = L([236, 240, 248], 0.5); g.fillRect(-0.1, -0.1, w + 0.2, h + 0.2); }
      grubenSchatten(g, F, R, w, h);
      g.restore();
    };
  }
  /* Grube bauen: R = Öffnung [x0,y0,x1,y1], T = Tiefe, stein = gemauerte Höhe */
  function grubeBauen(M, B, R, T, stein, winter, saat, opt) {
    opt = opt || {};
    const [x0, y0, x1, y1] = R;
    const ex = { keinLicht: true, keinAo: true };
    M.flaeche(Object.assign({ name: "gb" + saat, o: [x0, y0, -T], u: [1, 0, 0], v: [0, 1, 0], w: x1 - x0, h: y1 - y0, malen: grubenBodenMal(B, R, opt.beton, winter, saat), ebene: -1 }, ex));
    /* der Durchlass nur in der Ostwand (vorher stand er als Geisterbogen in allen vier Wänden) */
    const ohne = Object.assign({}, opt, { durchlass: null });
    wand(M, [x0, y0, 0], [0, 1, 0], x1 - x0, T, grubenWandMal(B, R, T, stein, winter, saat + 1, ohne), Object.assign({ name: "gw-n" + saat }, ex));
    wand(M, [x1, y1, 0], [0, -1, 0], x1 - x0, T, grubenWandMal(B, R, T, stein, winter, saat + 2, ohne), Object.assign({ name: "gw-s" + saat }, ex));
    wand(M, [x1, y0, 0], [-1, 0, 0], y1 - y0, T, grubenWandMal(B, R, T, stein, winter, saat + 3, Object.assign({}, opt, { durchlass: opt.durchlass ? (UYM - y0) : null })), Object.assign({ name: "gw-o" + saat }, ex));
    wand(M, [x0, y1, 0], [1, 0, 0], y1 - y0, T, grubenWandMal(B, R, T, stein, winter, saat + 4, ohne), Object.assign({ name: "gw-w" + saat }, ex));
  }

  /* =====================================================================
     DAS HAUS
     ===================================================================== */
  const DS = 0.55;                                   // Mauerstärke Bruchstein
  function steinMaler(W, B, S, Z) {
    return function (g, F) {
      const w = F.w, px = F.px, winter = S.winter;
      const bis = Math.min(ZE, Z.mauerBis);
      bruchsteinMalen(g, F, 0, 0, w, ZE, { saat: W.saat, bis: bis, lage: Z.lage });
      eckquader(g, F, 0, 0, ZE, bis, false, W.saat);
      eckquader(g, F, w, 0, ZE, bis, true, W.saat + 1);
      g.save(); g.beginPath(); g.rect(-1, ZE - bis, w + 2, bis + 1); g.clip();
      for (let i = 0; i < (W.eg || []).length; i++) {
        const fe = W.eg[i];
        if (fe.z > bis) continue;
        const fy = ZE - fe.z - fe.h;
        const fo = fensterArt(W, 100 + i, S, Z, true);
        fo.gitter = !fe.klein && W.name !== "west";
        fo.fluegel = fe.klein ? 1 : 2; fo.sprossen = [1, 2];
        if (Z.gewaende) gewaendeMalen(g, F, B, fe.a, fy, fe.w, fe.h, { winter: winter && Z.fertig });
        fensterMalen(g, F, B, fe.a, fy, fe.w, fe.h, fo);
      }
      if (W.tuer) {
        const T = W.tuer;
        tuerMalen(g, F, B, T.a, ZE - T.h, T.w, T.h, { bogen: T.bogen, jahr: T.jahr, leer: !Z.tueren, kranz: W.name === "sued", girlande: W.name === "sued", farbe: W.name === "sued" ? "#5a3620" : "#4e3524" }, S);
      }
      if (W.welle && bis > RZ - 0.4) welleLoch(g, F, B, ZE, winter);
      if (W.name === "sued" && !winter && Z.fertig && px > 8) kletterrose(g, F, 8.55, ZE, S.saat);
      if (W.name === "sued" && Z.fertig && px > 6) laterneWand(g, F, 6.95, ZE - 2.35, false);
      g.restore();
      /* Sockel: Spritzwasser, Moos */
      const gr = g.createLinearGradient(0, ZE, 0, ZE - 0.7);
      gr.addColorStop(0, winter ? "rgba(60,64,80,0.25)" : "rgba(64,70,40,0.32)"); gr.addColorStop(1, "rgba(60,64,60,0)");
      g.fillStyle = gr; g.fillRect(0, ZE - 0.7, w, 0.7);
      if (winter && Z.fertig && W.name !== "ost") schneeWehe(g, F, w, ZE, W.saat, W.tuer ? [W.tuer.a - 0.35, W.tuer.a + W.tuer.w + 0.35] : null);
    };
  }
  /* Körper, die vor den Fenstern liegen können (Kritik Runde 1: „Fenster-
     licht scheint durch Dachüberstand und Gerinne"). Konstruktionskoordinaten. */
  function leuchtKoerper(W, S, Z, F) {
    const K = [];
    if (Z.dach) {
      for (const t of [1, -1]) {
        const ye = t * (YTE + 0.14), zu = ZTE - (S.winter ? 0.42 : 0.2);
        K.push([[XWE0, t * YW, ZT + DV], [XWE1, t * YW, ZT + DV], [XWE0, t * YW, ZT - 0.08], [XWE1, t * YW, ZT - 0.08], [XWE0, ye, ZTE + 0.05], [XWE1, ye, ZTE + 0.05], [XWE0, ye, zu], [XWE1, ye, zu]]);
        /* Ortgänge der Giebel (je Dachseite eine dünne, schräge Platte) */
        for (const [xw, xe] of [[XW1, XWE1], [XW0, XWE0]]) K.push([[xw, t * YTE, ZTE - 0.12], [xe, t * YTE, ZTE - 0.12], [xw, t * YWE, ZWE - 0.12], [xe, t * YWE, ZWE - 0.12], [xw, t * YTE, ZTE + DV], [xe, t * YTE, ZTE + DV], [xw, t * YWE, ZWE + DV], [xe, t * YWE, ZWE + DV]]);
      }
      /* Krüppelwalme */
      for (const [xw, xe, xf] of [[XW1, XWE1, XF1], [XW0, XWE0, XF0]]) K.push([[xe, YWE, ZWE - 0.2], [xe, -YWE, ZWE - 0.2], [xw, YWE, ZWE - 0.2], [xw, -YWE, ZWE - 0.2], [xf, 0, ZF]]);
    }
    if (Z.gerinne > 0) K.push(kastenPunkte(GX0 - 0.02, GY0, GZ0, GX1 + 0.02, GY0 + (GY1 - GY0) * Z.gerinne, GZ1 + 0.05));
    if (Z.konsole) K.push(kastenPunkte(XW1, KONSOLE_Y - 0.1, GZ0 - 1.35, GX1 + 0.12, KONSOLE_Y + 0.1, GZ0));
    if (Z.boecke > 0) for (const yb of BOECKE) K.push(kastenPunkte(GX0 - 0.45, yb - 0.1, 0, GX1 + 0.45, yb + 0.2, GZ0));
    if (Z.pfeiler >= 1 && Z.lagerbock) K.push(kastenPunkte(LX0, -0.42, 0, LX1, 0.42, RZ + RW + 0.08));
    if (Z.dammH > 0.05) K.push(DAMM_PUNKTE);
    /* das Rad nur, wenn es im Sprite steht (sonst malt das Leben es darüber) */
    if (Z.rad > 0 && !(Z.lebend && F.s >= LEBEN_S)) {
      const R = []; for (let i = 0; i < 12; i++) { const w = i / 12 * TAU; R.push(radPunkt(XK1, RR, w), radPunkt(XK4, RR, w)); }
      K.push(R);
    }
    if (Z.deko) {
      if (S.winter) {
        /* Christbaum als Kegel mit Kübel */
        const C = [[0.55, YW + 0.5, 2.02]];
        for (let i = 0; i < 10; i++) { const w = i / 10 * TAU; C.push([0.55 + 0.4 * Math.cos(w), YW + 0.5 + 0.4 * Math.sin(w), 0.42]); C.push([0.55 + 0.2 * Math.cos(w), YW + 0.5 + 0.2 * Math.sin(w), 0]); }
        K.push(C);
      }
      K.push(kastenPunkte(XW0 - 1.2, -0.13, ZWE - 0.58, XW0, 0.13, ZWE - 0.32));   // Aufzugsbalken
      K.push(kastenPunkte(-6.5, -YW - 0.55, 0, -3.9, -YW - 0.02, 1.62));         // Holzstapel
    }
    void W;
    return K;
  }
  function steinLeuchten(W, B, S, Z) {
    return function (g, F) {
      F = leuchtFlaeche(g, F, B, leuchtKoerper(W, S, Z, F));
      for (let i = 0; i < (W.eg || []).length; i++) {
        const fe = W.eg[i];
        const fo = fensterArt(W, 100 + i, S, Z, true);
        fo.gitter = !fe.klein && W.name !== "west"; fo.fluegel = fe.klein ? 1 : 2; fo.sprossen = [1, 2];
        fensterLicht(g, F, B, fe.a, ZE - fe.z - fe.h, fe.w, fe.h, fo);
      }
      if (W.name === "sued" && Z.fertig) laterneWand(g, F, 6.95, ZE - 2.35, true);
    };
  }
  function oberMaler(W, B, S, Z) {
    return function (g, F) {
      const w = F.w, px = F.px, top = W.top, winter = S.winter;
      const yE = top - ZE;
      const auf = Z.gefach > 0;
      const L = auf ? null : belichter(F, 0);
      if (auf) {
        const c = misch(LEHM, KALK, Z.kalk);
        gefachGrund(g, F, -0.05, -0.05, w + 0.1, yE + 0.06, c, W.saat);
        if (px > 8) {
          const rng = zufall(W.saat * 5);
          for (let i = 0; i < 30; i++) { g.fillStyle = "rgba(" + (rng() < 0.5 ? "120,100,70" : "255,250,240") + "," + (0.03 + rng() * 0.04).toFixed(3) + ")"; g.fillRect(rng() * w, rng() * yE, 0.6 + rng() * 1.2, 0.5 + rng() * 1.0); }
        }
      }
      const alleF = W.fw.F.concat(W.giebel ? W.giebel.F : []);
      for (let i = 0; i < alleF.length; i++) {
        const fe = alleF[i];
        const fy = top - fe.z - fe.h;
        if (fe.luke) { if (auf) lukeMalen(g, F, B, fe.a, fy, fe.w, fe.h, S, Z); continue; }
        if (!auf) continue;
        const fo = fensterArt(W, i, S, Z, false);
        fensterMalen(g, F, B, fe.a, fy, fe.w, fe.h, fo);
        if (!fo.leer && fo.laeden && px > 6) laedenMalen(g, F, fe.a, fy, fe.w, fe.h, fo.laeden, W.saat + i);
        if (!fo.leer && winter && px > 6) { g.fillStyle = "rgb(244,247,252)"; PI.rundRechteck(g, fe.a - 0.04, fy + fe.h - 0.015, fe.w + 0.08, 0.05, 0.02); g.fill(); }
        if (!fo.leer && !winter && Z.fertig && px > 8 && (i + W.saat) % 2 === 0) blumenkastenMalen(g, F, fe.a, fy + fe.h, fe.w, W.saat + i);
      }
      if (auf) hoelzerMalen(g, F, W.fw.H.concat(W.giebel ? W.giebel.H : []), top, Z.holzC, W.saat, {});
      else {
        /* offenes Gerippe: nur die Hölzer, selbst belichtet */
        const H = W.fw.H.concat(W.giebel && Z.giebel ? W.giebel.H : []).filter(Z.holzNur);
        for (const m of H) {
          const x0 = m.p0[0], y0 = top - m.p0[1], x1 = m.p1[0], y1 = top - m.p1[1];
          const LL = Math.hypot(x1 - x0, y1 - y0) || 1, nx = -(y1 - y0) / LL * m.b / 2, ny = (x1 - x0) / LL * m.b / 2;
          g.fillStyle = L(Z.holzC); poly(g, [[x0 + nx, y0 + ny], [x1 + nx, y1 + ny], [x1 - nx, y1 - ny], [x0 - nx, y0 - ny]]); g.fill();
          g.strokeStyle = L(hell(Z.holzC, -0.4), 0.6); g.lineWidth = Math.max(0.004, 0.8 / px); g.stroke();
        }
      }
      if (S.inschrift && W.name === "sued" && px > 34 && Z.fertig) {
        g.fillStyle = "rgba(236,214,160,0.9)"; g.font = "italic 0.1px Georgia, 'Times New Roman', serif"; g.textAlign = "center"; g.textBaseline = "middle";
        g.fillText("ANNO 1786 · JOHANN CONRAD MÜLLER · GOTT SEGNE DIESES HAUS", w / 2, top - ZE - 0.1);
      }
      /* Schatten des Ortgangs auf dem Giebel */
      if (W.giebel && Z.dach && auf) {
        const sv = F.schatten(OGV);
        if (sv) {
          g.fillStyle = "rgba(30,34,60,0.26)";
          const U = [[0, top - ZT], [YW - YG, 0], [YW + YG, 0], [LG, top - ZT]];
          g.beginPath(); g.moveTo(U[0][0] - 1, U[0][1] - 1);
          for (const p of U) g.lineTo(p[0], p[1]);
          g.lineTo(U[3][0] + 1, U[3][1] - 1);
          for (let i = U.length - 1; i >= 0; i--) g.lineTo(U[i][0] + sv[0], U[i][1] + sv[1] + 0.1);
          g.closePath(); g.fill();
        }
      }
    };
  }
  function oberLeuchten(W, B, S, Z) {
    return function (g, F) {
      F = leuchtFlaeche(g, F, B, leuchtKoerper(W, S, Z, F));
      const top = W.top;
      const alleF = W.fw.F.concat(W.giebel ? W.giebel.F : []);
      for (let i = 0; i < alleF.length; i++) {
        const fe = alleF[i];
        if (fe.luke) continue;
        fensterLicht(g, F, B, fe.a, top - fe.z - fe.h, fe.w, fe.h, fensterArt(W, i, S, Z, false));
      }
    };
  }
  /* Kletterrose am Bruchstein (Frühling) */
  function kletterrose(g, F, x, yBoden, saat) {
    const rng = zufall(saat + 5);
    g.strokeStyle = "rgb(70,58,36)"; g.lineWidth = 0.025;
    for (let k = 0; k < 4; k++) { g.beginPath(); g.moveTo(x + k * 0.08, yBoden); g.bezierCurveTo(x - 0.3 + k * 0.2, yBoden - 0.8, x + 0.4 - k * 0.1, yBoden - 1.4, x + (rng() - 0.5) * 0.8, yBoden - 2.2); g.stroke(); }
    for (let i = 0; i < 160; i++) { const px = x + (rng() - 0.4) * 1.1, py = yBoden - 0.2 - rng() * 2.1; g.fillStyle = rgb(PI.streu([56, 104, 44], rng, 0.25)); g.beginPath(); g.ellipse(px, py, 0.04, 0.025, rng() * 3, 0, TAU); g.fill(); }
    for (let i = 0; i < 26; i++) { const px = x + (rng() - 0.4) * 1.0, py = yBoden - 0.4 - rng() * 1.8; g.fillStyle = rng() < 0.6 ? "#d8475e" : "#f2a8b4"; g.beginPath(); g.arc(px, py, 0.035, 0, TAU); g.fill(); g.fillStyle = "rgba(255,255,255,0.35)"; g.beginPath(); g.arc(px - 0.01, py - 0.01, 0.012, 0, TAU); g.fill(); }
  }
  /* Wandlaterne aus Schmiedeeisen neben der Tür */
  function laterneWand(g, F, x, y, leuchten) {
    if (leuchten) {
      if (F.nacht <= 0) return;
      const gg = g.createRadialGradient(x, y + 0.2, 0, x, y + 0.2, 0.14);
      gg.addColorStop(0, "rgba(255,240,196," + F.nacht + ")"); gg.addColorStop(1, "rgba(255,180,90,0)");
      g.fillStyle = gg; g.fillRect(x - 0.15, y + 0.05, 0.3, 0.3);
      F.leuchtPunkt(x, y + 0.2, 2.6, "255,190,110", 0.75, true);
      return;
    }
    g.strokeStyle = "#1e1c1c"; g.lineWidth = 0.025;
    g.beginPath(); g.moveTo(x - 0.25, y); g.quadraticCurveTo(x - 0.1, y - 0.12, x, y - 0.02); g.stroke();
    g.fillStyle = "#1e1c1c";
    g.beginPath(); g.moveTo(x - 0.1, y + 0.05); g.lineTo(x + 0.1, y + 0.05); g.lineTo(x, y - 0.03); g.closePath(); g.fill();
    g.fillStyle = "rgba(250,236,190,0.9)"; g.fillRect(x - 0.07, y + 0.06, 0.14, 0.26);
    g.strokeStyle = "#1e1c1c"; g.lineWidth = 0.014; g.strokeRect(x - 0.075, y + 0.055, 0.15, 0.27);
    g.beginPath(); g.moveTo(x, y + 0.055); g.lineTo(x, y + 0.325); g.stroke();
    g.fillStyle = "#1e1c1c"; g.fillRect(x - 0.09, y + 0.32, 0.18, 0.03);
  }

  function hausBauen(M, B, S, Z) {
    M.teil("mauern", { mitte: HAUS_M });
    for (const W of WAENDE) {
      const u = kreuz(W.n, Z3);
      const bis = Math.min(ZE, Z.mauerBis);
      if (bis > 0.01) {
        const um = bis < ZE - 0.01 ? [[0, ZE - bis], [W.L, ZE - bis], [W.L, ZE], [0, ZE]] : null;
        M.flaeche({ name: "stein-" + W.name, o: [W.o[0], W.o[1], ZE], u: u, v: [0, 0, -1], w: W.L, h: ZE, umriss: um || undefined, malen: steinMaler(W, B, S, Z), leuchten: steinLeuchten(W, B, S, Z), ao: true });
      }
      if (Z.fw > 0) {
        const auf = Z.gefach > 0;
        const top = W.top, fwBis = Math.min(top, Z.fwBis);
        let um = W.giebel ? [[0, top - ZT], [YW - YG, 0], [YW + YG, 0], [LG, top - ZT], [LG, top - ZE], [0, top - ZE]] : [[0, 0], [W.L, 0], [W.L, top - ZE], [0, top - ZE]];
        if (W.giebel && !Z.giebel) um = [[0, top - ZT], [W.L, top - ZT], [W.L, top - ZE], [0, top - ZE]];
        if (fwBis < top - 0.01) um = schneide(um, (p) => p[1] - (top - fwBis));
        if (um.length >= 3) M.flaeche({ name: "fw-" + W.name, o: [W.o[0], W.o[1], top], u: u, v: [0, 0, -1], w: W.L, h: top - ZE, umriss: um, malen: oberMaler(W, B, S, Z), leuchten: oberLeuchten(W, B, S, Z), keinLicht: !auf, traufe: !W.giebel && Z.dach ? UE : 0, traufeY: 0, keinAo: true });
      }
    }
    /* Im Rohbau sieht man hinein: Boden, Innenseiten, Mauerkronen */
    if (!Z.dach || Z.dachReihen != null) rohbauInnen(M, B, S, Z);
  }
  function rohbauInnen(M, B, S, Z) {
    const bis = Math.min(ZE, Z.mauerBis);
    const x0 = XW0 + DS, x1 = XW1 - DS, y0 = -YW + DS, y1 = YW - DS;
    const innenStein = (saat) => function (g, F) { bruchsteinMalen(g, F, 0, 0, F.w, F.h, { saat: saat, moertel: [176, 168, 152] }); g.fillStyle = "rgba(20,16,20,0.25)"; g.fillRect(0, 0, F.w, F.h); };
    if (Z.bau >= 0.12 && bis < ZE - 0.02) {
      M.flaeche({ name: "boden-innen", o: [x0, y0, 0.02], u: [1, 0, 0], v: [0, 1, 0], w: x1 - x0, h: y1 - y0, malen: (g, F) => { g.fillStyle = "rgb(160,158,150)"; g.fillRect(0, 0, F.w, F.h); rausch(g, 0, 0, F.w, F.h, 1.2, 0.25, 31, 3); if (S.winter) { g.fillStyle = "rgba(240,244,250,0.7)"; g.fillRect(0, 0, F.w, F.h); } }, ebene: -1 });
    }
    if (bis > 0.02 && Z.fw <= 0) {
      /* Innenseiten der Mauern (die fernen sieht man von oben) */
      wand(M, [x0, y0, bis], [0, 1, 0], x1 - x0, bis, innenStein(71), { name: "in-n", keinAo: true });
      wand(M, [x1, y1, bis], [0, -1, 0], x1 - x0, bis, innenStein(72), { name: "in-s", keinAo: true });
      wand(M, [x0, y1, bis], [1, 0, 0], y1 - y0, bis, innenStein(73), { name: "in-w", keinAo: true });
      wand(M, [x1, y0, bis], [-1, 0, 0], y1 - y0, bis, innenStein(74), { name: "in-o", keinAo: true });
      /* Mauerkronen */
      const krone = (g, F) => { g.fillStyle = rgb(MOERTEL); g.fillRect(0, 0, F.w, F.h); bruchsteinMalen(g, F, 0, 0, F.w, F.h, { saat: 90 + ((F.w * 10) | 0) }); if (S.winter) { g.fillStyle = "rgba(242,246,252,0.8)"; g.fillRect(0, 0, F.w, F.h); } };
      const k = (o, u, v, w, h, n) => M.flaeche({ name: "krone-" + n, o: o, u: u, v: v, w: w, h: h, malen: krone, ebene: 1 });
      k([XW0, -YW, bis], [1, 0, 0], [0, 1, 0], LH, DS, "n");
      k([XW0, YW - DS, bis], [1, 0, 0], [0, 1, 0], LH, DS, "s");
      k([XW0, -YW + DS, bis], [1, 0, 0], [0, 1, 0], DS, LG - 2 * DS, "w");
      k([XW1 - DS, -YW + DS, bis], [1, 0, 0], [0, 1, 0], DS, LG - 2 * DS, "o");
    }
    /* Dielenboden des Obergeschosses, später der Dachboden */
    const diele = (g, F) => { bretterMalen(g, F, 0, 0, F.w, F.h, HOLZ_ROH, 44, { richtung: "v", breite: 0.22 }); if (S.winter) { g.fillStyle = "rgba(240,244,250,0.75)"; g.fillRect(0, 0, F.w, F.h); } };
    if (Z.bau >= 0.4 && Z.gefach <= 0) M.flaeche({ name: "diele-og", o: [XW0 + 0.2, -YW + 0.2, ZE + 0.2], u: [1, 0, 0], v: [0, 1, 0], w: LH - 0.4, h: LG - 0.4, malen: diele, ebene: -1 });
    if (Z.bau >= 0.56 && (!Z.dach || Z.dachReihen != null)) M.flaeche({ name: "diele-db", o: [XW0 + 0.2, -YW + 0.2, ZT + 0.02], u: [1, 0, 0], v: [0, 1, 0], w: LH - 0.4, h: LG - 0.4, malen: diele, ebene: -1 });
  }

  /* ---------------- Dachstuhl (offen, im Bau) ---------------- */
  function dachstuhlBauen(M, S, Z) {
    const c = HOLZ_ROH;
    const mal = () => (g, F) => { holzMalen(g, F, -0.02, -0.02, F.w + 0.04, F.h + 0.04, c, 13, { ohneAst: true }); if (S.winter) { g.fillStyle = "rgba(242,246,252,0.5)"; g.fillRect(0, 0, F.w, F.h * 0.3); } };
    const t = phase(Z.bau, 0.6, 0.64);
    const xs = [];
    for (let x = XW0 + 0.1; x <= XW1 - 0.1 + 1e-6; x += (LH - 0.2) / 12) xs.push(x);
    const n = Math.max(1, Math.round(xs.length * t));
    M.teil("dachstuhl", { mitte: [HAUS_M[0], 0, HAUS_M[2] + 9] });
    const zF = ZF - DV - 0.1;
    for (let i = 0; i < n; i++) {
      const x = xs[i];
      if (x < XF0 + 0.05 || x > XF1 - 0.05) continue;
      for (const s of [1, -1]) balken3(M, [x, s * (YW + UE - 0.1), ZT - (UE - 0.1) * TN], [x, 0, zF], [1, 0, 0], 0.1, 0.16, mal, { name: "sp" + i + s, seiten: "QqR" });
      balken3(M, [x, -1.6, ZT + 2.6], [x, 1.6, ZT + 2.6], [1, 0, 0], 0.08, 0.16, mal, { name: "kb" + i, seiten: "QqR" });
    }
    if (t >= 1) {
      balken3(M, [XF0, 0, zF + 0.08], [XF1, 0, zF + 0.08], [0, 1, 0], 0.14, 0.16, mal, { name: "firstpfette", seiten: "QqR" });
      /* Gratsparren der Krüppelwalme */
      for (const [xe, xf] of [[XWE1 - 0.3, XF1], [XWE0 + 0.3, XF0]]) for (const s of [1, -1]) balken3(M, [xe, s * (YWE - 0.2), ZWE - 0.2], [xf, 0, zF], [0, 0, 1], 0.1, 0.16, mal, { name: "grat" + xe + s, seiten: "QqRr" });
    }
    if (Z.bau >= 0.64 && Z.bau < 0.8) {
      /* Richtbaum mit bunten Bändern */
      M.teil("richtbaum", { mitte: [HAUS_M[0], 0, ZF + 12], schatten: false });
      M.figur({ x: -0.6, y: 0, z: ZF - 0.1, breite: 1.4, hoehe: 2.0, schatten: false, malen: richtbaum(S.winter) });
    }
  }
  function richtbaum(winter) {
    return function (g, s, F) {
      if (F.schatten) return;
      const k = s, FL = figurLicht(F);
      g.fillStyle = FL.lit([84, 60, 40], FL.lV); g.fillRect(-0.03 * k, -1.8 * k, 0.06 * k, 1.8 * k);
      for (let i = 0; i < 6; i++) {
        const y = -1.9 * k + i * 0.22 * k, b = (0.15 + i * 0.09) * k;
        const c = winter ? [40, 74, 52] : [36, 86, 46];
        g.fillStyle = FL.lit(c, FL.lL); g.beginPath(); g.moveTo(0, y - 0.1 * k); g.lineTo(-b, y + 0.2 * k); g.lineTo(0, y + 0.2 * k); g.closePath(); g.fill();
        g.fillStyle = FL.lit(c, FL.lR); g.beginPath(); g.moveTo(0, y - 0.1 * k); g.lineTo(0, y + 0.2 * k); g.lineTo(b, y + 0.2 * k); g.closePath(); g.fill();
        if (winter) { g.fillStyle = FL.lit([245, 248, 255], FL.lO, 0.9); g.beginPath(); g.moveTo(0, y - 0.08 * k); g.lineTo(-b * 0.8, y + 0.14 * k); g.lineTo(b * 0.5, y + 0.05 * k); g.closePath(); g.fill(); }
      }
      const farben = [[200, 32, 44], [242, 194, 48], [42, 98, 184], [255, 255, 255], [42, 154, 74]];
      g.lineWidth = Math.max(1, 0.03 * k);
      for (let i = 0; i < 5; i++) { g.strokeStyle = FL.lit(farben[i], FL.lV); g.beginPath(); g.moveTo(0, -1.7 * k); g.quadraticCurveTo((i - 2) * 0.25 * k, -1.2 * k, (i - 2) * 0.32 * k + Math.sin((F.t || 0) * 3 + i) * 0.05 * k, -0.8 * k); g.stroke(); }
    };
  }

  /* ---------------- Dach im Bau: Latten und Ziegel Reihe für Reihe ---------------- */
  function dachImBau(M, S, Z) {
    const cosN = Math.cos(NEIG), cosW = Math.cos(WNEIG);
    const wS = XWE1 - XWE0, hS = YTE / cosN, bW = YWE / cosN;
    const umrS = [[XF0 - XWE0, 0], [XF1 - XWE0, 0], [wS, bW], [wS, hS], [0, hS], [0, bW]];
    const hW = (XWE1 - XF1) / cosW;
    const umrW = [[YWE, 0], [2 * YWE, hW], [0, hW]];
    const flaechen = [
      { name: "s", o: [XWE0, 0, ZF], u: [1, 0, 0], v: [0, cosN, -Math.sin(NEIG)], w: wS, h: hS, umr: umrS },
      { name: "n", o: [XWE1, 0, ZF], u: [-1, 0, 0], v: [0, -cosN, -Math.sin(NEIG)], w: wS, h: hS, umr: umrS },
      { name: "wo", o: [XF1, YWE, ZF], u: [0, -1, 0], v: [cosW, 0, -Math.sin(WNEIG)], w: 2 * YWE, h: hW, umr: umrW },
      { name: "ww", o: [XF0, -YWE, ZF], u: [0, 1, 0], v: [-cosW, 0, -Math.sin(WNEIG)], w: 2 * YWE, h: hW, umr: umrW }
    ];
    const t = phase(Z.bau, 0.66, 0.8);
    M.teil("dach", { mitte: [HAUS_M[0], 0, HAUS_M[2] + 10] });
    for (const f of flaechen) {
      /* Latten über der ganzen Fläche (durchsichtig) */
      M.flaeche({ name: "latten-" + f.name, o: f.o, u: f.u, v: f.v, w: f.w, h: f.h, umriss: f.umr, keinLicht: true, keinAo: true, malen: (g, F) => {
        const L = belichter(F, 0);
        g.fillStyle = L(hell(HOLZ_ROH, 0.06));
        for (let y = F.h - 0.1; y > 0; y -= ZR_ * 2) g.fillRect(-0.1, y - 0.025, F.w + 0.2, 0.05);
        if (S.winter) { g.fillStyle = L([240, 244, 250], 0.8); for (let y = F.h - 0.1; y > 0; y -= ZR_ * 2) g.fillRect(-0.1, y - 0.03, F.w + 0.2, 0.015); }
      } });
      /* gedeckte Reihen von der Traufe her */
      const yCut = f.h * (1 - t);
      if (t > 0.01) {
        const um = schneide(f.umr, (p) => p[1] - yCut);
        if (um.length >= 3) M.flaeche({ name: "ziegel-" + f.name, o: f.o, u: f.u, v: f.v, w: f.w, h: f.h, umriss: um, ebene: 1, malen: (g, F) => biberMalen(g, F, -0.05, F.w + 0.05, F.h, Math.max(0, yCut - 0.3), S.saat + f.name.length, {}) });
      }
    }
  }

  /* ---------------- Schornstein ---------------- */
  const KAMIN_X = -3.6, KAMIN_B = 0.62, KAMIN_T = 0.62, KAMIN_H = 1.25;
  function kaminBauen(M, S, Z) {
    const h = KAMIN_H * Z.kamin;
    if (h <= 0.02) return;
    const x0 = KAMIN_X - KAMIN_B / 2, x1 = KAMIN_X + KAMIN_B / 2, y0 = -KAMIN_T / 2, y1 = KAMIN_T / 2;
    const zOben = ZF + h;
    const zRoof = (y) => ZF - Math.abs(y) * TN;
    M.teil("kamin", { schatten: false, mitte: [KAMIN_X, 0, HAUS_M[2] + 12] });
    const mal = (seite) => (g, F) => backsteinMalen(g, F, F.w, F.h, 60 + seite, S.winter);
    const hS = zOben - zRoof(y1);
    wand(M, [x0, y1, zOben], [0, 1, 0], KAMIN_B, hS, mal(1), { name: "kamin-s", keinAo: true });
    wand(M, [x1, y0, zOben], [0, -1, 0], KAMIN_B, hS, mal(2), { name: "kamin-n", keinAo: true });
    const hO = zOben - zRoof(y1) + 0.02;
    wand(M, [x1, y1, zOben], [1, 0, 0], KAMIN_T, hO, mal(3), { name: "kamin-o", keinAo: true, umriss: [[0, 0], [KAMIN_T, 0], [KAMIN_T, zOben - zRoof(y0)], [KAMIN_T / 2, zOben - zRoof(0)], [0, zOben - zRoof(y1)]] });
    wand(M, [x0, y0, zOben], [-1, 0, 0], KAMIN_T, hO, mal(4), { name: "kamin-w", keinAo: true, umriss: [[0, 0], [KAMIN_T, 0], [KAMIN_T, zOben - zRoof(y1)], [KAMIN_T / 2, zOben - zRoof(0)], [0, zOben - zRoof(y0)]] });
    if (Z.kamin >= 1) {
      /* Kaminkopf: Sandsteinplatte mit Überstand, darauf Schnee */
      const d = 0.06, zk = zOben;
      M.teil("kaminkopf", { schatten: false, mitte: [KAMIN_X, 0, HAUS_M[2] + 13] });
      const platte = (g, F) => { g.fillStyle = rgb(SANDSTEIN_G); g.fillRect(0, 0, F.w, F.h); rausch(g, 0, 0, F.w, F.h, 0.6, 0.3, 5, 3); };
      const zug = (g, F) => { g.fillStyle = "rgb(24,20,20)"; g.fillRect(F.w * 0.25, F.h * 0.25, F.w * 0.5, F.h * 0.5); };
      kiste(M, x0 - d, y0 - d, zk, x1 + d, y1 + d, zk + 0.1, { s: platte, n: platte, o: platte, w: platte, t: S.winter && Z.fertig ? null : (g, F) => { platte(g, F); zug(g, F); } }, { name: "kk", keinAo: true });
      if (S.winter && Z.fertig) {
        /* Kaminhaube aus Schnee: 12 cm dick, mit gerundeten Kanten; über dem
           warmen Zug geschmolzen (dunkles Loch mit nassem Rand) */
        const hH = 0.13, e = 0.035, xa = x0 - d - e, xb = x1 + d + e, ya = y0 - d - e, yb = y1 + d + e;
        const seite = (saat) => (g, F) => {
          const w = F.w, rng = zufall(saat);
          g.fillStyle = "rgb(236,241,249)"; g.beginPath(); g.moveTo(0, F.h); g.lineTo(0, 0.05);
          for (let a = 0; a <= w; a += 0.05) g.lineTo(a, 0.02 + 0.02 * Math.sin(a * 17 + saat) * rng());
          g.lineTo(w, 0.05); g.lineTo(w, F.h - 0.02);
          for (let a = w; a >= 0; a -= 0.06) g.lineTo(a, F.h - 0.01 - 0.035 * rng());
          g.closePath(); g.fill();
          const gr = g.createLinearGradient(0, 0, 0, F.h); gr.addColorStop(0, "rgba(255,255,255,0.5)"); gr.addColorStop(1, "rgba(150,170,210,0.45)");
          g.fillStyle = gr; g.fill();
        };
        const deckel = (g, F) => {
          schneeFlaeche(g, F, 0, 0, F.w, F.h, 31, {});
          const cx = F.w / 2, cy = F.h / 2;
          const gr = g.createRadialGradient(cx, cy, 0.05, cx, cy, 0.3);
          gr.addColorStop(0, "rgba(40,40,46,0.9)"); gr.addColorStop(0.45, "rgba(120,126,140,0.6)"); gr.addColorStop(1, "rgba(200,210,228,0)");
          g.fillStyle = gr; g.fillRect(0, 0, F.w, F.h);
          g.fillStyle = "rgb(22,18,18)"; PI.rundRechteck(g, cx - 0.14, cy - 0.14, 0.28, 0.28, 0.06); g.fill();
        };
        kiste(M, xa, ya, zk + 0.1, xb, yb, zk + 0.1 + hH, { s: seite(1), n: seite(2), o: seite(3), w: seite(4), t: deckel }, { name: "kh", keinAo: true });
      }
    }
  }
  function backsteinMalen(g, F, w, h, saat, winter) {
    const rng = zufall(saat), px = F.px;
    g.fillStyle = "rgb(178,170,156)"; g.fillRect(-0.02, -0.02, w + 0.04, h + 0.04);
    const lh = 0.077, lb = 0.26;
    if (px * lh < 2.5) { g.fillStyle = "rgb(146,70,50)"; g.fillRect(0, 0, w, h); rausch(g, 0, 0, w, h, 1.5, 0.25, saat, 3); }
    else {
      let r = 0;
      for (let y = h; y > -lh; y -= lh, r++) {
        const vers = (r % 2) * lb / 2;
        for (let x = -vers; x < w; x += lb) {
          const c = PI.streu([150, 72, 50], rng, 0.12);
          g.fillStyle = rgb(c); g.fillRect(x + 0.006, y - lh + 0.006, lb - 0.012, lh - 0.012);
        }
      }
      rausch(g, 0, 0, w, h, 1.2, 0.2, saat, 3);
    }
    /* Ruß oben */
    const gr = g.createLinearGradient(0, 0, 0, 0.6);
    gr.addColorStop(0, "rgba(20,16,16,0.55)"); gr.addColorStop(1, "rgba(20,16,16,0)");
    g.fillStyle = gr; g.fillRect(0, 0, w, 0.6);
    void winter;
  }

  /* =====================================================================
     TEICHDAMM, GERINNE, BÖCKE, KONSOLE, LAGER, RANDSTEINE, UNTERGRABEN
     ===================================================================== */
  function holzMal(c, saat, extra) {
    return function (g, F) {
      holzMalen(g, F, -0.02, -0.02, F.w + 0.04, F.h + 0.04, c, saat + ((F.w * 13) | 0), { ohneAst: F.w < 0.3 });
      if (extra) extra(g, F);
    };
  }
  /* Rasen der Böschung (Frühling), rohe Erde (Bau) oder Schnee (Winter) */
  function boeschungMalen(g, F, w, h, saat, S, Z) {
    const px = F.px, rng = zufall(saat);
    if (!Z.rasen) {
      /* frisch geschüttete Erde mit Steinen, Spuren der Schaufel */
      g.fillStyle = "rgb(122,92,64)"; g.fillRect(-0.05, -0.05, w + 0.1, h + 0.1);
      rausch(g, 0, 0, w, h, 1.6, 0.35, saat, 3);
      if (px > 8) { g.fillStyle = "rgba(150,138,122,0.8)"; g.beginPath(); for (let i = 0; i < Math.min(260, w * h * 5); i++) { const x = rng() * w, y = rng() * h, r = 0.02 + rng() * 0.04; g.moveTo(x + r, y); g.ellipse(x, y, r * 1.4, r, rng() * 3, 0, TAU); } g.fill(); }
      if (S.winter) { g.fillStyle = "rgba(240,244,251,0.55)"; g.fillRect(-0.05, -0.05, w + 0.1, h + 0.1); rausch(g, 0, 0, w, h, 0.8, 0.2, saat + 3, 3); }
      return;
    }
    if (S.winter) {
      schneeFlaeche(g, F, -0.05, -0.05, w + 0.1, h + 0.1, saat, {});
      /* Grashalme schauen am Fuß aus dem Schnee, dazu ein Trampelpfad der Kinder */
      if (px > 14) {
        g.strokeStyle = "rgba(120,112,70,0.7)"; g.lineWidth = Math.max(0.006, 0.8 / px);
        g.beginPath(); for (let i = 0; i < w * 6; i++) { const x = rng() * w, y = h - rng() * 0.8; g.moveTo(x, y); g.lineTo(x + (rng() - 0.5) * 0.05, y - 0.06 - rng() * 0.08); } g.stroke();
      }
      g.fillStyle = "rgba(150,166,200,0.25)";
      g.beginPath(); for (let y = 0.4; y < h - 0.3; y += 0.35) { const x = w * 0.62 + Math.sin(y * 1.3) * 0.25; g.moveTo(x + 0.07, y); g.ellipse(x, y, 0.07, 0.045, 0, 0, TAU); } g.fill();
      return;
    }
    /* Rasen: Grund, große und kleine Flecken, Halme, ein paar Blüten */
    g.fillStyle = "rgb(88,118,58)"; g.fillRect(-0.05, -0.05, w + 0.1, h + 0.1);
    tonFlecken(g, 0, 0, w, h, 3.2, 0.5, saat + 3, "#5f7e3a", true);
    tonFlecken(g, 0, 0, w, h, 1.6, 0.4, saat + 9, "#a6b865", true);
    rausch(g, 0, 0, w, h, 0.6, 0.18, saat + 5, 3);
    if (px > 16) {
      const T = [[70, 104, 44], [104, 136, 64], [58, 88, 40]];
      for (let k = 0; k < 3; k++) {
        g.strokeStyle = rgb(T[k], 0.7); g.lineWidth = Math.max(0.005, 0.8 / px);
        g.beginPath();
        for (let i = 0; i < Math.min(900, w * h * 26); i++) { const x = rng() * w, y = rng() * h, l = 0.04 + rng() * 0.06; g.moveTo(x, y); g.lineTo(x + (rng() - 0.5) * 0.03, y - l); }
        g.stroke();
      }
      if (px > 26) {
        for (const [c, n] of [[[250, 250, 244], 50], [[240, 206, 60], 30], [[176, 120, 190], 14]]) {
          g.fillStyle = rgb(c); g.beginPath();
          for (let i = 0; i < n * w * h / 20; i++) { const x = rng() * w, y = rng() * h, r = 0.012 + rng() * 0.01; g.moveTo(x + r, y); g.arc(x, y, r, 0, TAU); }
          g.fill();
        }
      }
    }
    /* feuchter, dunkler Fuß, darüber Moos an der Trockenmauer */
    const gr = g.createLinearGradient(0, h - 0.8, 0, h);
    gr.addColorStop(0, "rgba(30,50,20,0)"); gr.addColorStop(1, "rgba(30,50,20,0.3)");
    g.fillStyle = gr; g.fillRect(-0.05, h - 0.8, w + 0.1, 0.85);
  }
  /* Stützmauer: Buntsandstein wie das Erdgeschoss, oben eine Abdeckung
     aus Sandsteinplatten (der Linie der Krone folgend), Entwässerungs-
     öffnungen in einer Reihe, nasse Spuren und Moos; im Winter Schnee auf
     den Platten und Eisbärte darunter. kante: Liste [a, y] der Mauerkrone. */
  function stuetzmauerMal(saat, kante, opt, S, Z) {
    return function (g, F) {
      const w = F.w, h = F.h, px = F.px;
      const bis = Z.dammH;
      bruchsteinMalen(g, F, 0, 0, w, h, { saat: saat, bis: bis >= TD_Z - 0.01 ? null : bis });
      /* Eckquader an der Ecke zur anderen Mauer */
      if (opt.ecke != null) eckquader(g, F, opt.ecke, 0, h, Math.min(h, bis), opt.ecke > w / 2, saat, SANDSTEIN_H);
      if (bis < TD_Z - 0.01) return;
      /* Entwässerung: kleine dunkle Öffnungen mit Kalkspur */
      if (px > 8) {
        for (let a = 0.8; a < w - 0.5; a += 1.6) {
          const top = kanteBei(kante, a);
          if (h - top < 1.4) continue;
          g.fillStyle = "rgba(18,14,12,0.85)"; g.fillRect(a - 0.06, h - 0.62, 0.12, 0.1);
          const gr = g.createLinearGradient(0, h - 0.52, 0, h);
          gr.addColorStop(0, S.winter ? "rgba(236,242,250,0.6)" : "rgba(40,50,36,0.35)"); gr.addColorStop(1, "rgba(40,50,36,0)");
          g.fillStyle = gr; g.fillRect(a - 0.05, h - 0.52, 0.1, 0.52);
        }
      }
      if (opt.extra) opt.extra(g, F);
      /* Abdeckplatten entlang der Krone */
      g.save();
      g.beginPath(); g.moveTo(kante[0][0], kante[0][1] - 0.02);
      for (const [a, y] of kante) g.lineTo(a, y - 0.02);
      for (let i = kante.length - 1; i >= 0; i--) g.lineTo(kante[i][0], kante[i][1] + 0.24);
      g.closePath(); g.clip();
      quaderMalen(g, F, -0.1, -0.1, w + 0.2, h + 0.2, { farbe: SANDSTEIN_G, lage: 0.26, laenge: 0.9, saat: saat + 3 });
      g.restore();
      g.strokeStyle = "rgba(40,28,20,0.4)"; g.lineWidth = Math.max(0.006, 1.2 / px);
      g.beginPath(); kante.forEach(([a, y], i) => (i ? g.lineTo(a, y + 0.24) : g.moveTo(a, y + 0.24))); g.stroke();
      if (S.winter && Z.fertig) {
        g.fillStyle = "rgb(242,246,252)";
        g.beginPath(); kante.forEach(([a, y], i) => (i ? g.lineTo(a, y - 0.02) : g.moveTo(a, y - 0.02))); for (let i = kante.length - 1; i >= 0; i--) g.lineTo(kante[i][0], kante[i][1] + 0.06); g.closePath(); g.fill();
        /* Eisbärte unter der Abdeckung, gebündelt, ungleich lang */
        const rng = zufall(saat + 77);
        g.fillStyle = "rgba(206,226,246,0.8)";
        g.beginPath();
        for (let i = 0; i + 1 < kante.length; i++) {
          const [a0, y0] = kante[i], [a1, y1] = kante[i + 1];
          for (let a = a0 + rng() * 0.2; a < a1; a += 0.08 + rng() * 0.35) {
            const t = (a - a0) / Math.max(1e-6, a1 - a0), y = y0 + (y1 - y0) * t + 0.24, l = 0.05 + Math.pow(rng(), 2) * 0.35, b = 0.015 + l * 0.08;
            g.moveTo(a - b, y); g.quadraticCurveTo(a - b * 0.4, y + l * 0.6, a, y + l); g.quadraticCurveTo(a + b * 0.4, y + l * 0.6, a + b, y); g.closePath();
          }
        }
        g.fill();
      }
      /* Moos und Feuchte am Fuß */
      const gr = g.createLinearGradient(0, h, 0, h - 0.9);
      gr.addColorStop(0, S.winter ? "rgba(60,64,80,0.3)" : "rgba(50,70,34,0.4)"); gr.addColorStop(1, "rgba(50,70,34,0)");
      g.fillStyle = gr; g.fillRect(0, h - 0.9, w, 0.9);
      if (S.winter && Z.fertig) schneeWehe(g, F, w, h, saat, null);
    };
  }
  function kanteBei(kante, a) {
    for (let i = 0; i + 1 < kante.length; i++) {
      const [a0, y0] = kante[i], [a1, y1] = kante[i + 1];
      if (a >= a0 - 1e-6 && a <= a1 + 1e-6) return y0 + (y1 - y0) * (a - a0) / Math.max(1e-6, a1 - a0);
    }
    return kante[kante.length - 1][1];
  }
  /* Der Teichdamm hinter der Mühle (siehe Kopf). Ein konvexer Körper:
     Stützmauer Süd (mit Einlauf und Schütz) und Ost (mit Leerschuss),
     Böschung West und Nord auf einer Trockenmauer, oben die Krone mit
     dem Teich. */
  function dammBauen(M, B, S, Z) {
    const hD = Z.dammH;
    if (hD < 0.05) return;
    const winter = S.winter;
    const tanN = Math.tan(TD_NEIG), Ls = (TD_Z - TD_FUSS) / Math.sin(TD_NEIG);
    M.teil("damm", { mitte: [(TD_XF + TD_X1) / 2, -NORDEN + (TD_Y1 + TD_YF) / 2, 2] });
    const cut = (um, top) => schneide(um, (p) => p[1] - top);      // Flächen-y ≥ top bleibt (unter der Bauhöhe)
    /* Süd: Umriss mit schräger Krone über der Westböschung */
    const wS = TD_X1 - TD_XF, aK = TD_X0 - TD_XF;
    let umS = [[0, TD_Z - TD_FUSS], [aK, 0], [wS, 0], [wS, TD_Z], [0, TD_Z]];
    const kanteS = [[0, TD_Z - TD_FUSS], [aK, 0], [wS, 0]];
    if (hD < TD_Z - 0.01) umS = cut(umS, TD_Z - hD);
    const einlauf = (g, F) => {
      /* Einlauf zum Gerinne: das Wasser läuft durch die Krone */
      const a0 = GX0 - TD_XF, a1 = GX1 - TD_XF;
      g.fillStyle = "rgb(26,22,20)"; g.fillRect(a0 + 0.04, TD_Z - GZ1, a1 - a0 - 0.08, GZ1 - GZB + 0.05);
      if (Z.wasser && !winter) { const gr = g.createLinearGradient(0, TD_Z - GZ1, 0, TD_Z - GZB); gr.addColorStop(0, "rgba(40,50,46,0.6)"); gr.addColorStop(1, "rgba(30,40,38,0.3)"); g.fillStyle = gr; g.fillRect(a0, TD_Z - GZB, a1 - a0, 1.2); }
    };
    if (umS.length >= 3) M.flaeche({ name: "damm-s", o: [TD_XF, TD_Y1, TD_Z], u: [1, 0, 0], v: [0, 0, -1], w: wS, h: TD_Z, umriss: umS, malen: stuetzmauerMal(51, kanteS, { ecke: wS, extra: einlauf }, S, Z), ao: true });
    /* Ost: Umriss mit schräger Krone über der Nordböschung, Leerschuss */
    const wO = TD_Y1 - TD_YF, aO = TD_Y1 - TD_Y0;
    let umO = [[0, 0], [aO, 0], [wO, TD_Z - TD_FUSS], [wO, TD_Z], [0, TD_Z]];
    const kanteO = [[0, 0], [aO, 0], [wO, TD_Z - TD_FUSS]];
    if (hD < TD_Z - 0.01) umO = cut(umO, TD_Z - hD);
    const leerschuss = (g, F) => {
      /* Schussrinne: in die Mauer gesetzte Sandstein-Treppe, darin das
         überlaufende Wasser (Frühling) oder ein Eisvorhang (Winter) */
      const a = TD_Y1 - LS_Y, b = LS_B;
      quaderMalen(g, F, a - b / 2 - 0.1, 0.2, b + 0.2, TD_Z - 0.2, { farbe: SANDSTEIN_H, lage: 0.3, laenge: b + 0.2, saat: 61 });
      g.fillStyle = "rgba(30,26,24,0.55)"; g.fillRect(a - b / 2, 0.2, b, TD_Z - 0.2);
      for (let y = 0.45; y < TD_Z; y += 0.3) { g.fillStyle = "rgba(250,236,214,0.25)"; g.fillRect(a - b / 2, y, b, 0.02); g.fillStyle = "rgba(20,14,12,0.35)"; g.fillRect(a - b / 2, y + 0.02, b, 0.05); }
      if (!Z.wasser) return;
      if (winter) {
        const rng = zufall(62);
        g.fillStyle = "rgba(214,232,250,0.85)"; g.beginPath();
        for (let x = a - b / 2 + 0.03; x < a + b / 2 - 0.02; x += 0.05 + rng() * 0.05) { const l = 0.6 + rng() * (TD_Z - 1.2); g.moveTo(x - 0.03, 0.2); g.quadraticCurveTo(x - 0.012, 0.2 + l * 0.6, x, 0.2 + l); g.quadraticCurveTo(x + 0.012, 0.2 + l * 0.6, x + 0.03, 0.2); g.closePath(); }
        g.fill();
      } else {
        const gr = g.createLinearGradient(a - b / 2, 0, a + b / 2, 0);
        gr.addColorStop(0, "rgba(170,200,214,0.3)"); gr.addColorStop(0.5, "rgba(220,236,244,0.75)"); gr.addColorStop(1, "rgba(170,200,214,0.3)");
        g.fillStyle = gr; g.fillRect(a - b / 2 + 0.05, 0.2, b - 0.1, TD_Z - 0.2);
        g.fillStyle = "rgba(255,255,255,0.6)";
        for (let y = 0.45; y < TD_Z; y += 0.3) g.fillRect(a - b / 2 + 0.04, y + 0.02, b - 0.08, 0.035);
      }
    };
    if (umO.length >= 3) M.flaeche({ name: "damm-o", o: [TD_X1, TD_Y1, TD_Z], u: [0, -1, 0], v: [0, 0, -1], w: wO, h: TD_Z, umriss: umO, malen: stuetzmauerMal(52, kanteO, { ecke: 0, extra: leerschuss }, S, Z), ao: true });
    /* Böschungen West und Nord (bis zur Bauhöhe), darunter die Trockenmauer */
    const zB = Math.min(hD, TD_Z);
    if (zB > TD_FUSS) {
      const lB = (zB - TD_FUSS) / Math.sin(TD_NEIG), dxB = (zB - TD_FUSS) / tanN;
      const oW = TD_Z - zB;                                  // Flächen-y der Bauhöhe (vom Kronenrand gemessen)
      const bOben = (TD_Z - zB) / Math.sin(TD_NEIG);
      const vW = nrm([TD_XF - TD_X0, 0, TD_FUSS - TD_Z]), vN = nrm([0, TD_YF - TD_Y0, TD_FUSS - TD_Z]);
      const wW = TD_Y1 - TD_YF, wN = TD_X1 - TD_XF;
      const yKW = TD_Y0 - (TD_Z - zB) / tanN, xKN = TD_X0 - (TD_Z - zB) / tanN;
      M.flaeche({ name: "damm-bw", o: [TD_X0, TD_YF, TD_Z], u: [0, 1, 0], v: vW, w: wW, h: Ls, umriss: [[yKW - TD_YF, bOben], [wW, bOben], [wW, Ls], [0, Ls]], malen: (g, F) => boeschungMalen(g, F, F.w, F.h, 71, S, Z) });
      M.flaeche({ name: "damm-bn", o: [TD_X1, TD_Y0, TD_Z], u: [-1, 0, 0], v: vN, w: wN, h: Ls, umriss: [[0, bOben], [TD_X1 - xKN, bOben], [wN, Ls], [0, Ls]], malen: (g, F) => boeschungMalen(g, F, F.w, F.h, 72, S, Z) });
      void lB; void dxB; void oW;
      if (hD < TD_Z - 0.01) {
        /* Schüttung im Bau: oben offen */
        M.flaeche({ name: "damm-t-bau", o: [xKN, yKW, zB], u: [1, 0, 0], v: [0, 1, 0], w: TD_X1 - xKN, h: TD_Y1 - yKW, malen: (g, F) => boeschungMalen(g, F, F.w, F.h, 73, S, { rasen: false }) });
      }
    }
    const trocken = (g, F) => { bruchsteinMalen(g, F, 0, 0, F.w, F.h, { saat: 81, moertel: [74, 66, 58] }); if (winter && Z.fertig) { g.fillStyle = "rgb(242,246,252)"; g.fillRect(-0.02, -0.02, F.w + 0.04, 0.05); } };
    const hF = Math.min(TD_FUSS, hD);
    wand(M, [TD_XF, TD_YF, hF], [-1, 0, 0], TD_Y1 - TD_YF, hF, trocken, { name: "damm-fw", ao: true });
    wand(M, [TD_X1, TD_YF, hF], [0, -1, 0], TD_X1 - TD_XF, hF, trocken, { name: "damm-fn", ao: true });
    if (hD < TD_Z - 0.01) return;
    /* Krone: vier Streifen um den Teich, im Süden der Einlauf, im Osten der Leerschuss */
    const krone = (saat) => (g, F) => kroneMalen(g, F, saat, S, Z);
    const streifen = (name, x0, y0, x1, y1) => { if (x1 - x0 > 0.02 && y1 - y0 > 0.02) M.flaeche({ name: name, o: [x0, y0, TD_Z], u: [1, 0, 0], v: [0, 1, 0], w: x1 - x0, h: y1 - y0, malen: krone(name.length * 7 + x0 * 3), ebene: 1 }); };
    streifen("krone-n", TD_X0, TD_Y0, TD_X1, TE_Y0);
    streifen("krone-w", TD_X0, TE_Y0, TE_X0, TE_Y1);
    streifen("krone-o1", TE_X1, TE_Y0, TD_X1, LS_Y - LS_B / 2);
    streifen("krone-o2", TE_X1, LS_Y + LS_B / 2, TD_X1, TE_Y1);
    streifen("krone-s1", TD_X0, TE_Y1, GX0 + 0.05, TD_Y1);
    streifen("krone-s2", GX1 - 0.05, TE_Y1, TD_X1, TD_Y1);
    /* Teich (unter der Krone): Wände, Grund, Wasser – durch die Öffnung gesehen */
    teichBauen(M, B, S, Z);
    /* Einlaufrinne zum Schütz und Überlauf zum Leerschuss */
    rinneImDamm(M, B, S, Z, [GX0 + 0.05, TE_Y1 - 0.02, GX1 - 0.05, TD_Y1], GZB + 0.02, "einlauf");
    rinneImDamm(M, B, S, Z, [TE_X1 - 0.02, LS_Y - LS_B / 2, TD_X1, LS_Y + LS_B / 2], TD_W - 0.02, "ueberlauf");
    /* Schilf in den Ecken des Teichs */
    M.teil("schilf", { schatten: false, mitte: [(TE_X0 + TE_X1) / 2, -NORDEN + (TE_Y0 + TE_Y1) / 2, TD_Z + 3] });
    for (const [x, y, n] of [[TE_X0 + 0.35, TE_Y0 + 0.3, 1], [TE_X1 - 0.4, TE_Y0 + 0.35, 2], [TE_X0 + 0.3, TE_Y1 - 0.3, 3]]) {
      M.figur({ x: x, y: y, z: TD_W, breite: 0.9, hoehe: 1.3, schatten: false, malen: schilfFigur(n, winter) });
    }
    /* Schütz am Kopf des Gerinnes */
    if (Z.schuetz) schuetzBauen(M, S, Z);
    /* Zwei Strebepfeiler an der 6 m hohen Ostmauer (eigene Runde: die
       Mauer wirkte wie eine glatte Bunkerwand) */
    strebepfeiler(M, S, Z);
  }
  function strebepfeiler(M, S, Z) {
    const winter = S.winter && Z.fertig, T = 0.7, B = 0.34, zF = 0.9;
    const mauerOben = (y) => y >= TD_Y0 ? TD_Z : TD_FUSS + (TD_Z - TD_FUSS) * (y - TD_YF) / (TD_Y0 - TD_YF);
    for (const [yp, saat] of [[-9.7, 3], [-11.95, 4]]) {
      const zW = mauerOben(yp) - 0.45;
      if (zW < zF + 0.4) continue;
      const x0 = TD_X1, x1 = TD_X1 + T, L = Math.hypot(T, zW - zF);
      const stein = (s2) => (g, F) => { bruchsteinMalen(g, F, 0, 0, F.w, F.h, { saat: 90 + s2 }); const gr = g.createLinearGradient(0, F.h, 0, F.h - 0.7); gr.addColorStop(0, winter ? "rgba(60,64,80,0.25)" : "rgba(50,70,34,0.35)"); gr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr; g.fillRect(0, F.h - 0.7, F.w, 0.7); };
      /* Stirn, Seiten mit schräger Oberkante, Abdeckung aus Sandsteinplatten */
      M.flaeche({ name: "sp-v" + saat, o: [x1, yp + B, zF], u: [0, -1, 0], v: [0, 0, -1], w: 2 * B, h: zF, malen: stein(saat), ao: true });
      M.flaeche({ name: "sp-s" + saat, o: [x0, yp + B, zW], u: [1, 0, 0], v: [0, 0, -1], w: T, h: zW, umriss: [[0, 0], [T, zW - zF], [T, zW], [0, zW]], malen: stein(saat + 1), ao: true });
      M.flaeche({ name: "sp-n" + saat, o: [x1, yp - B, zW], u: [-1, 0, 0], v: [0, 0, -1], w: T, h: zW, umriss: [[0, zW - zF], [T, 0], [T, zW], [0, zW]], malen: stein(saat + 2), ao: true });
      M.flaeche({ name: "sp-t" + saat, o: [x0, yp + B + 0.04, zW + 0.05], u: [0, -1, 0], v: nrm([T, 0, -(zW - zF)]), w: 2 * B + 0.08, h: L + 0.04, malen: (g, F) => {
        quaderMalen(g, F, 0, 0, F.w, F.h, { farbe: SANDSTEIN_G, lage: 0.42, laenge: F.w, saat: 60 + saat });
        if (winter) { schneeFlaeche(g, F, 0, 0, F.w, F.h, 70 + saat, {}); g.fillStyle = "rgba(160,176,210,0.35)"; g.fillRect(0, F.h - 0.08, F.w, 0.08); }
      }, keinAo: true });
    }
  }
  function kroneMalen(g, F, saat, S, Z) {
    const w = F.w, h = F.h;
    if (S.winter) { schneeFlaeche(g, F, -0.05, -0.05, w + 0.1, h + 0.1, saat | 0, {}); return; }
    boeschungMalen(g, F, w, h, saat | 0, S, Z);
  }
  /* Rinne durch die Dammkrone (Einlauf zum Schütz, Überlauf zum
     Leerschuss): Sandstein, darin Wasser – wie eine kleine Grube */
  function rinneImDamm(M, B, S, Z, R, zBoden, name) {
    const [x0, y0, x1, y1] = R, T = TD_Z - zBoden, Rz = [x0, y0, x1, y1, TD_Z];
    const ex = { keinLicht: true, keinAo: true, ebene: 2 };
    const wandMal = (g, F) => {
      g.save(); if (!lochClip(g, F, B, Rz)) { g.restore(); return; }
      const L = ST.lichtFaktor(F.n, F.zeit, 0, F.jahr);
      quaderMalen(g, F, 0, 0, F.w, F.h, { farbe: [150, 126, 104], lage: 0.2, laenge: 0.5, saat: 91 });
      g.fillStyle = "rgba(20,26,24,0.35)"; g.fillRect(0, F.h * 0.4, F.w, F.h);
      g.globalCompositeOperation = "multiply"; g.fillStyle = rgb([L[0] * 255, L[1] * 255, L[2] * 255]); g.fillRect(0, 0, F.w, F.h); g.globalCompositeOperation = "source-over";
      if (S.winter && Z.fertig) { g.fillStyle = "rgba(236,242,250,0.9)"; g.fillRect(0, 0, F.w, 0.04); }
      g.restore();
    };
    const zO = TD_Z - 0.001;
    wand(M, [x0, y0, zO], [0, 1, 0], x1 - x0, T, wandMal, Object.assign({ name: name + "-n" }, ex));
    wand(M, [x1, y1, zO], [0, -1, 0], x1 - x0, T, wandMal, Object.assign({ name: name + "-s" }, ex));
    wand(M, [x1, y0, zO], [-1, 0, 0], y1 - y0, T, wandMal, Object.assign({ name: name + "-o" }, ex));
    wand(M, [x0, y1, zO], [1, 0, 0], y1 - y0, T, wandMal, Object.assign({ name: name + "-w" }, ex));
    M.flaeche(Object.assign({ name: name + "-wasser", o: [x0, y0, zBoden + 0.2], u: [1, 0, 0], v: [0, 1, 0], w: x1 - x0, h: y1 - y0, malen: (g, F) => {
      g.save(); if (!lochClip(g, F, B, Rz)) { g.restore(); return; }
      const L = belichter(F, 0);
      if (!Z.wasser) { g.fillStyle = L([120, 104, 88]); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); g.restore(); return; }
      g.fillStyle = S.winter ? L([196, 212, 228]) : L([62, 92, 96]); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
      g.fillStyle = S.winter ? L([240, 246, 252], 0.8) : L([220, 236, 246], 0.35);
      for (let y = 0.1; y < F.h; y += 0.18) g.fillRect(0.05, y, F.w - 0.1, 0.02);
      g.restore();
    } }, ex, { ebene: 3 }));
  }
  /* Der Mühlteich: Sandsteinwände, darin Wasser mit Himmelsspiegel und
     Seerosen (Frühling) oder Eis mit Schneeflecken und Rissen (Winter) */
  function teichBauen(M, B, S, Z) {
    const R = [TE_X0, TE_Y0, TE_X1, TE_Y1, TD_Z], winter = S.winter;
    const T = TD_Z - TD_W + 0.25;
    const ex = { keinLicht: true, keinAo: true, ebene: 2 };
    const wandMal = (saat) => (g, F) => {
      g.save(); if (!lochClip(g, F, B, R)) { g.restore(); return; }
      const L = ST.lichtFaktor(F.n, F.zeit, 0, F.jahr);
      quaderMalen(g, F, 0, 0, F.w, F.h, { farbe: SANDSTEIN_H, lage: 0.3, laenge: 0.8, saat: saat });
      const wl = TD_Z - TD_W;
      g.fillStyle = "rgba(24,34,26,0.45)"; g.fillRect(-0.1, wl - 0.12, F.w + 0.2, F.h);
      g.fillStyle = winter ? "rgba(226,236,248,0.7)" : "rgba(52,80,40,0.5)"; g.fillRect(-0.1, wl - 0.1, F.w + 0.2, 0.08);
      g.globalCompositeOperation = "multiply"; g.fillStyle = rgb([L[0] * 255, L[1] * 255, L[2] * 255]); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); g.globalCompositeOperation = "source-over";
      grubenSchatten(g, F, R, F.w, F.h);
      g.restore();
    };
    const zO = TD_Z - 0.001;
    wand(M, [TE_X0, TE_Y0, zO], [0, 1, 0], TE_X1 - TE_X0, T, wandMal(1), Object.assign({ name: "teich-n" }, ex));
    wand(M, [TE_X1, TE_Y1, zO], [0, -1, 0], TE_X1 - TE_X0, T, wandMal(2), Object.assign({ name: "teich-s" }, ex));
    wand(M, [TE_X1, TE_Y0, zO], [-1, 0, 0], TE_Y1 - TE_Y0, T, wandMal(3), Object.assign({ name: "teich-o" }, ex));
    wand(M, [TE_X0, TE_Y1, zO], [1, 0, 0], TE_Y1 - TE_Y0, T, wandMal(4), Object.assign({ name: "teich-w" }, ex));
    M.flaeche({ name: "teich-wasser", o: [TE_X0, TE_Y0, Z.wasser ? TD_W : TD_Z - T], u: [1, 0, 0], v: [0, 1, 0], w: TE_X1 - TE_X0, h: TE_Y1 - TE_Y0, keinLicht: true, keinAo: true, ebene: 3, malen: (g, F) => {
      g.save(); if (!lochClip(g, F, B, R)) { g.restore(); return; }
      const L = belichter(F, 0), w = F.w, h = F.h, rng = zufall(55), px = F.px;
      if (!Z.wasser) { g.fillStyle = L([108, 90, 70]); g.fillRect(-0.1, -0.1, w + 0.2, h + 0.2); rausch(g, 0, 0, w, h, 0.8, 0.3, 5, 3); grubenSchatten(g, F, R, w, h); g.restore(); return; }
      if (winter) {
        /* Eis: bläulich, Schneefelder, Risse, eine freigefegte Schlitterbahn */
        g.fillStyle = L([176, 198, 218]); g.fillRect(-0.1, -0.1, w + 0.2, h + 0.2);
        tonFlecken(g, 0, 0, w, h, 1.6, 0.8, 11, "#eef3fa", true);
        g.fillStyle = L([150, 176, 204], 0.55); g.beginPath(); g.ellipse(w * 0.55, h * 0.5, w * 0.3, h * 0.14, -0.2, 0, TAU); g.fill();
        g.strokeStyle = L([255, 255, 255], 0.7); g.lineWidth = Math.max(0.006, 0.9 / px);
        g.beginPath(); for (let i = 0; i < 7; i++) { let x = rng() * w, y = rng() * h; g.moveTo(x, y); for (let k = 0; k < 3; k++) { x += (rng() - 0.5) * 0.9; y += (rng() - 0.5) * 0.5; g.lineTo(x, y); } } g.stroke();
      } else {
        const gr = g.createLinearGradient(0, 0, w, h);
        gr.addColorStop(0, L([44, 64, 62])); gr.addColorStop(0.45, L([96, 126, 140])); gr.addColorStop(1, L([36, 54, 52]));
        g.fillStyle = gr; g.fillRect(-0.1, -0.1, w + 0.2, h + 0.2);
        g.fillStyle = "rgba(210,228,242," + (0.16 * (1 - F.nacht)).toFixed(3) + ")";
        for (let y = 0.2; y < h; y += 0.32) g.fillRect(0.1 + (y * 3) % 0.4, y, w - 0.3, 0.025);
        if (px > 12) {
          /* Seerosenblätter mit Kerbe, zwei Blüten */
          for (const [x, y, r] of [[0.6, 0.5, 0.2], [0.95, 0.75, 0.16], [w - 0.8, h - 0.55, 0.22], [w - 1.2, h - 0.4, 0.15], [w * 0.5, 0.35, 0.14]]) {
            g.fillStyle = L([58, 104, 50]); g.beginPath(); g.moveTo(x, y); g.arc(x, y, r, 0.3, TAU - 0.05); g.closePath(); g.fill();
            g.strokeStyle = L([40, 76, 36], 0.6); g.lineWidth = Math.max(0.005, 0.7 / px); g.stroke();
          }
          for (const [x, y] of [[0.75, 0.6], [w - 0.9, h - 0.6]]) { g.fillStyle = L([250, 236, 242]); g.beginPath(); g.arc(x, y, 0.07, 0, TAU); g.fill(); g.fillStyle = L([246, 206, 90]); g.beginPath(); g.arc(x, y, 0.025, 0, TAU); g.fill(); }
        }
      }
      grubenSchatten(g, F, R, w, h);
      g.restore();
    } });
  }
  /* Schilf am Teichrand: Halme, Blätter, Rohrkolben; im Winter strohfarben
     mit Schneehauben */
  function schilfFigur(saat, winter) {
    return function (g, s, F) {
      if (F.schatten) return;
      const k = s, KZ = ST.KZ, rng = zufall(saat * 13 + 5), FL = figurLicht(F);
      const halm = winter ? [168, 150, 104] : [88, 122, 60], kolben = winter ? [96, 74, 52] : [104, 70, 44];
      g.lineCap = "round";
      for (let i = 0; i < 18; i++) {
        const x = (rng() - 0.5) * 0.7 * k, hh = (0.6 + rng() * 0.7) * KZ * k, bog = (rng() - 0.5) * 0.25 * k;
        g.strokeStyle = FL.lit(hell(halm, (rng() - 0.5) * 0.2), rng() < 0.5 ? FL.lL : FL.lR); g.lineWidth = Math.max(0.6, 0.014 * k);
        g.beginPath(); g.moveTo(x, 0); g.quadraticCurveTo(x + bog * 0.3, -hh * 0.6, x + bog, -hh); g.stroke();
        if (i % 4 === 0) {
          g.fillStyle = FL.lit(kolben, FL.lV); g.beginPath(); g.ellipse(x + bog, -hh + 0.06 * k, 0.018 * k, 0.07 * k, 0, 0, TAU); g.fill();
          if (winter) { g.fillStyle = FL.lit([244, 247, 252], FL.lO); g.beginPath(); g.ellipse(x + bog, -hh - 0.01 * k, 0.022 * k, 0.012 * k, 0, 0, TAU); g.fill(); }
        }
      }
      if (winter) { g.fillStyle = FL.lit([240, 244, 250], FL.lO); g.beginPath(); g.ellipse(0, -0.02 * k, 0.38 * k, 0.05 * k, 0, 0, TAU); g.fill(); }
    };
  }
  /* Schütz am Kopf des Gerinnes: zwei Pfosten, Querholz, Zahnstange,
     Handrad, die Schütztafel halb gezogen; dazu ein Steg mit Geländer */
  function schuetzBauen(M, S, Z) {
    const winter = S.winter;
    const yS = TD_Y1 - 0.25, zK = TD_Z;
    M.teil("schuetz", { schatten: false, mitte: [RX, -NORDEN + TD_Y1 + 0.5, TD_Z + 6] });
    const hc = [104, 76, 50];
    const pf = () => holzMal(hc, 81, winter ? (g, F) => { if (F.flaeche.v[2] > -0.5) { g.fillStyle = "rgba(242,246,252,0.9)"; g.fillRect(0, 0, F.w, Math.min(F.h, 0.05)); } } : null);
    for (const x of [GX0 - 0.02, GX1 + 0.02]) balken3(M, [x, yS, zK - 0.1], [x, yS, zK + 1.25], [1, 0, 0], 0.15, 0.15, pf, { name: "sp" + x });
    balken3(M, [GX0 - 0.12, yS, zK + 1.1], [GX1 + 0.12, yS, zK + 1.1], [0, 1, 0], 0.18, 0.14, pf, { name: "sq" });
    M.flaeche({ name: "schuetzbrett", o: [GX0 + 0.05, yS + 0.03, zK + 0.4], u: [1, 0, 0], v: [0, 0, -1], w: GX1 - GX0 - 0.1, h: zK + 0.4 - GZB, keinAo: true, malen: (g, F) => {
      bretterMalen(g, F, 0, 0, F.w, F.h, hell(hc, -0.12), 83, { breite: 0.18 });
      g.fillStyle = rgb(EISEN); g.fillRect(F.w / 2 - 0.03, 0, 0.06, F.h);
      g.fillStyle = "rgba(20,30,26,0.4)"; g.fillRect(0, F.h - 0.3, F.w, 0.3);
      if (winter) { g.fillStyle = "rgb(242,246,252)"; g.fillRect(-0.02, -0.02, F.w + 0.04, 0.05); }
    } });
    balken3(M, [RX, yS + 0.05, zK + 0.4], [RX, yS + 0.05, zK + 1.5], [1, 0, 0], 0.05, 0.05, () => (g, F) => { g.fillStyle = "rgb(44,42,42)"; g.fillRect(0, 0, F.w, F.h); if (F.px > 30) { g.fillStyle = "rgb(90,88,86)"; for (let x = 0.02; x < F.w; x += 0.05) g.fillRect(x, 0, 0.02, F.h); } }, { name: "zahn" });
    M.flaeche({ name: "handrad", o: [RX + 0.12, yS + 0.39, zK + 1.45], u: [0, -1, 0], v: [0, 0, -1], w: 0.5, h: 0.5, umriss: Array.from({ length: 16 }, (_, i) => [0.25 + 0.25 * Math.cos(i / 16 * TAU), 0.25 + 0.25 * Math.sin(i / 16 * TAU)]), beidseitig: true, keinAo: true, keinLicht: true, malen: (g, F) => {
      const L = belichter(F, 0.05);
      g.strokeStyle = L([40, 38, 38]); g.lineWidth = 0.04; g.beginPath(); g.arc(0.25, 0.25, 0.22, 0, TAU); g.stroke();
      g.lineWidth = 0.025; g.beginPath(); for (let i = 0; i < 6; i++) { const a = i * TAU / 6; g.moveTo(0.25, 0.25); g.lineTo(0.25 + Math.cos(a) * 0.22, 0.25 + Math.sin(a) * 0.22); } g.stroke();
      g.fillStyle = L([40, 38, 38]); g.beginPath(); g.arc(0.25, 0.25, 0.05, 0, TAU); g.fill();
      if (winter) { g.strokeStyle = L([244, 247, 252]); g.lineWidth = 0.02; g.beginPath(); g.arc(0.25, 0.25, 0.23, Math.PI * 1.15, Math.PI * 1.85); g.stroke(); }
    } });
    /* Geländer auf der Krone entlang der Südmauer (der Müller geht hier zum Schütz) */
    const gl = (g, F) => { holzMalen(g, F, -0.02, -0.02, F.w + 0.04, F.h + 0.04, [96, 70, 48], 83, { ohneAst: true }); if (winter) { g.fillStyle = "rgba(242,246,252,0.95)"; g.fillRect(-0.02, -0.02, F.w + 0.04, 0.03); } };
    for (let x = TD_X0 + 0.2; x < TD_X1 - 0.1; x += 1.3) { if (x > GX0 - 0.3 && x < GX1 + 0.3) continue; balken3(M, [x, TD_Y1 - 0.12, zK], [x, TD_Y1 - 0.12, zK + 1.0], [1, 0, 0], 0.08, 0.08, () => gl, { name: "gp" + x.toFixed(1), seiten: "QqRr" }); }
    for (const [xa, xb] of [[TD_X0 + 0.2, GX0 - 0.1], [GX1 + 0.1, TD_X1 - 0.15]]) for (const z of [0.55, 0.98]) balken3(M, [xa, TD_Y1 - 0.12, zK + z], [xb, TD_Y1 - 0.12, zK + z], [0, 1, 0], 0.05, 0.07, () => gl, { name: "gr" + xa.toFixed(1) + z, seiten: "QqR" });
  }
  /* Tosbecken am Fuß des Leerschusses: gemauertes Becken, der Abfluss
     läuft in einem Rohr unter dem Hof zum Untergraben */
  function tosbeckenBauen(M, B, S, Z) {
    if (Z.dammH < TD_Z - 0.01) return;
    const R = [TB_X0, TB_Y0, TB_X1, TB_Y1, 0], winter = S.winter, T = -TB_Z;
    M.teil("tosbecken", { ebene: -2, mitte: [(TB_X0 + TB_X1) / 2, -NORDEN + LS_Y, -2], schatten: false });
    const ex = { keinLicht: true, keinAo: true };
    const wandMal = (saat, rohr) => (g, F) => {
      g.save(); if (!lochClip(g, F, B, R)) { g.restore(); return; }
      const L = ST.lichtFaktor(F.n, F.zeit, 0, F.jahr);
      quaderMalen(g, F, 0, 0, F.w, F.h, { farbe: [140, 118, 98], lage: 0.22, laenge: 0.6, saat: saat });
      g.fillStyle = "rgba(20,28,24,0.4)"; g.fillRect(0, 0.15, F.w, F.h);
      if (rohr) { g.fillStyle = "rgb(14,12,12)"; g.beginPath(); g.arc(F.w / 2, F.h - 0.18, 0.14, 0, TAU); g.fill(); }
      if (winter && Z.fertig) { const rng = zufall(saat); g.fillStyle = "rgba(214,232,250,0.85)"; g.beginPath(); for (let x = 0.05; x < F.w; x += 0.06 + rng() * 0.1) { const l = 0.05 + rng() * 0.18; g.moveTo(x - 0.015, 0); g.lineTo(x, l); g.lineTo(x + 0.015, 0); g.closePath(); } g.fill(); }
      g.globalCompositeOperation = "multiply"; g.fillStyle = rgb([L[0] * 255, L[1] * 255, L[2] * 255]); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); g.globalCompositeOperation = "source-over";
      grubenSchatten(g, F, R, F.w, F.h);
      g.restore();
    };
    const [x0, y0, x1, y1] = R;
    wand(M, [x0, y0, 0], [0, 1, 0], x1 - x0, T, wandMal(1), Object.assign({ name: "tb-n" }, ex));
    wand(M, [x1, y1, 0], [0, -1, 0], x1 - x0, T, wandMal(2, true), Object.assign({ name: "tb-s" }, ex));
    wand(M, [x1, y0, 0], [-1, 0, 0], y1 - y0, T, wandMal(3), Object.assign({ name: "tb-o" }, ex));
    M.flaeche(Object.assign({ name: "tb-wasser", o: [x0, y0, TB_Z + 0.2], u: [1, 0, 0], v: [0, 1, 0], w: x1 - x0, h: y1 - y0, ebene: 1, malen: (g, F) => {
      g.save(); if (!lochClip(g, F, B, R)) { g.restore(); return; }
      const L = belichter(F, 0);
      g.fillStyle = !Z.wasser ? L([110, 96, 80]) : winter ? L([200, 216, 232]) : L([52, 80, 82]); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
      if (Z.wasser && !winter) { g.fillStyle = L([240, 248, 252], 0.55); g.beginPath(); g.ellipse(0.12, (LS_Y - y0), 0.3, 0.2, 0, 0, TAU); g.fill(); }
      grubenSchatten(g, F, R, F.w, F.h);
      g.restore();
    } }, ex));
    /* Randsteine um das Becken */
    M.teil("tb-rand", { schatten: false, ebene: -1, mitte: [(TB_X0 + TB_X1) / 2, -NORDEN + LS_Y, 0] });
    const st = (g, F) => { quaderMalen(g, F, 0, 0, F.w, F.h, { saat: 5, lage: F.h, laenge: 0.6, farbe: SANDSTEIN_H }); };
    const ob = winter ? schneeOben(null) : st;
    kiste(M, x0, y0 - 0.22, 0, x1, y0, RAND_H, { s: st, n: st, o: st, t: ob }, { name: "tbr-n", keinAo: true });
    kiste(M, x0, y1, 0, x1, y1 + 0.22, RAND_H, { s: st, n: st, o: st, t: ob }, { name: "tbr-s", keinAo: true });
  }

  /* Gerinne in Stücken (damit die Reihenfolge zu Böcken und Rad stimmt) */
  const GERINNE_STUECKE = [GY0, -4.95, -3.45, -1.5, GY1];
  function gerinneBauen(M, B, S, Z) {
    const winter = S.winter;
    const hc = [118, 90, 64];
    const bis = GY0 + (GY1 - GY0) * Z.gerinne;
    if (Z.gerinne <= 0.01) return;
    const bandX = [-5.3, -4.2, -3.0, -1.8, -0.6];
    const aussen = (saat) => (g, F) => {
      bretterMalen(g, F, 0, 0, F.w, F.h, hc, saat, { breite: 0.15 });
      const gr = g.createLinearGradient(0, F.h * 0.3, 0, F.h);
      gr.addColorStop(0, "rgba(20,24,20,0)"); gr.addColorStop(1, winter ? "rgba(30,34,44,0.3)" : "rgba(30,44,26,0.45)");
      g.fillStyle = gr; g.fillRect(0, 0, F.w, F.h);
      /* Eisenbänder: in Flächenkoordinaten liegen sie bei festen y der Konstruktion */
      const f = F.flaeche, o = fo(f);
      for (const yb of bandX) {
        const a = (yb - o[1]) / (f.u[1] || 1e-9);
        if (a > -0.05 && a < F.w + 0.05) eisenBand(g, F, a - 0.035, -0.01, 0.07, F.h + 0.02, { senkrecht: true });
      }
      if (winter) { g.fillStyle = "rgb(244,247,252)"; g.fillRect(-0.02, -0.02, F.w + 0.04, 0.035); }
    };
    const innen = (g, F) => { bretterMalen(g, F, 0, 0, F.w, F.h, hell(hc, -0.28), 77, { breite: 0.15 }); g.fillStyle = "rgba(20,40,40,0.35)"; g.fillRect(0, F.h * 0.4, F.w, F.h); };
    const kante = (g, F) => { holzMalen(g, F, -0.02, -0.02, F.w + 0.04, F.h + 0.04, hell(hc, 0.08), 5, { ohneAst: true }); if (winter) { g.fillStyle = "rgb(244,247,252)"; g.fillRect(-0.02, -0.02, F.w + 0.04, F.h + 0.04); } };
    for (let i = 0; i + 1 < GERINNE_STUECKE.length; i++) {
      const ya = GERINNE_STUECKE[i], yb = Math.min(bis, GERINNE_STUECKE[i + 1]);
      if (yb <= ya + 0.01) continue;
      M.teil("gerinne" + i, { mitte: [AUSSEN + RX, (ya + yb) / 2, GZ0 + 10], schatten: false });
      const L = yb - ya, H = GZ1 - GZ0;
      wand(M, [GX1, yb, GZ1], [1, 0, 0], L, H, aussen(30 + i), { name: "g-o" + i, keinAo: true });
      wand(M, [GX0, ya, GZ1], [-1, 0, 0], L, H, aussen(40 + i), { name: "g-w" + i, keinAo: true });
      wand(M, [GX1 - GW, ya, GZ1], [-1, 0, 0], L, GZ1 - GZB, innen, { name: "g-io" + i, keinAo: true });
      wand(M, [GX0 + GW, yb, GZ1], [1, 0, 0], L, GZ1 - GZB, innen, { name: "g-iw" + i, keinAo: true });
      M.flaeche({ name: "g-b" + i, o: [GX0 + GW, ya, GZB], u: [1, 0, 0], v: [0, 1, 0], w: GX1 - GX0 - 2 * GW, h: L, malen: (g, F) => { bretterMalen(g, F, 0, 0, F.w, F.h, hell(hc, -0.35), 78, { richtung: "v", breite: 0.2 }); } });
      for (const [x0, nm] of [[GX0, "kw"], [GX1 - GW, "ko"]]) M.flaeche({ name: "g-" + nm + i, o: [x0, ya, GZ1], u: [1, 0, 0], v: [0, 1, 0], w: GW, h: L, malen: kante });
      if (Z.wasser) {
        /* stehendes Wasser im Sprite nur, wenn das Leben es nicht malt */
        M.flaeche({ name: "g-wasser" + i, o: [GX0 + GW, ya, GZW], u: [1, 0, 0], v: [0, 1, 0], w: GX1 - GX0 - 2 * GW, h: L, ebene: 2, keinLicht: true, malen: (g, F) => {
          if (Z.lebend && F.s >= LEBEN_S) return;
          g.save(); if (!lochClip(g, F, B, [GX0 + GW, GY0, GX1 - GW, GY1, GZ1])) { g.restore(); return; }
          const Lb = belichter(F, 0);
          g.fillStyle = winter ? Lb([150, 172, 190]) : Lb(WASSER_T); g.fillRect(0, 0, F.w, F.h);
          g.fillStyle = Lb([255, 255, 255], 0.2); for (let y = 0.2; y < F.h; y += 0.5) g.fillRect(0.1, y, F.w - 0.2, 0.02);
          g.restore();
        } });
      }
      if (i === GERINNE_STUECKE.length - 2 && yb >= GY1 - 0.01) {
        /* Stirnbrett mit Ausguss (Lippe) */
        M.flaeche({ name: "g-stirn", o: [GX0, GY1, GZ1], u: [1, 0, 0], v: [0, 0, -1], w: GX1 - GX0, h: GZ1 - GZ0, malen: (g, F) => {
          bretterMalen(g, F, 0, 0, F.w, F.h, hc, 88, { breite: 0.15 });
          g.fillStyle = "rgb(30,26,24)"; g.fillRect(0.1, 0, F.w - 0.2, GZ1 - GZB - 0.02);
          g.fillStyle = rgb(hell(hc, 0.1)); g.fillRect(0.08, GZ1 - GZB - 0.04, F.w - 0.16, 0.04);
          if (winter) { g.fillStyle = "rgb(244,247,252)"; g.fillRect(-0.02, -0.02, F.w + 0.04, 0.035); }
        }, keinAo: true });
        if (winter && Z.fertig) {
          /* Eisbart unter dem Auslauf: dicke Zapfen an den Ecken, dünne innen */
          M.flaeche({ name: "g-stirn-zapfen", o: [GX0 - 0.02, GY1 + 0.02, GZ0 + 0.02], u: [1, 0, 0], v: [0, 0, -1], w: GX1 - GX0 + 0.04, h: 0.9, keinLicht: true, keinAo: true, malen: zapfenMal(931, 0.85), leuchten: zapfenMal(931, 0.85, true) });
        }
      }
      if (winter && Z.fertig) {
        for (const [x, n, u] of [[GX1 + 0.005, [1, 0, 0], [0, -1, 0]], [GX0 - 0.005, [-1, 0, 0], [0, 1, 0]]]) {
          const o = n[0] > 0 ? [x, yb, GZ0] : [x, ya, GZ0];
          M.flaeche({ name: "g-zapfen" + i + n[0], o: o, u: u, v: [0, 0, -1], w: L, h: 0.9, keinLicht: true, keinAo: true, malen: zapfenMal(900 + i * 7 + n[0], 0.75), leuchten: zapfenMal(900 + i * 7 + n[0], 0.75, true) });
        }
      }
    }
  }
  function boeckeBauen(M, S, Z) {
    if (Z.boecke <= 0) return;
    const winter = S.winter, hc = [110, 84, 60];
    const n = Math.max(1, Math.round(BOECKE.length * Z.boecke));
    const m = (saat) => () => holzMal(hc, saat, winter ? (g, F) => { if (F.flaeche.u[2] === 0 && F.flaeche.v[2] === 0) { g.fillStyle = "rgba(242,246,252,0.95)"; g.fillRect(0, 0, F.w, F.h); } } : null);
    for (let i = 0; i < n; i++) {
      const yb = BOECKE[i];
      M.teil("bock" + i, { mitte: [AUSSEN + RX, yb, 2.6], schatten: false });
      const zk = GZ0 - 0.2;
      for (const [xu, xo] of [[GX0 - 0.35, GX0 + 0.04], [GX1 + 0.35, GX1 - 0.04]]) {
        balken3(M, [xu, yb, 0.15], [xo, yb, zk], [0, 1, 0], 0.16, 0.16, m(60 + i), { name: "bein" + xu, seiten: "QqRr" });
        const st = (g, F) => { quaderMalen(g, F, 0, 0, F.w, F.h, { lage: F.h, saat: 9, farbe: SANDSTEIN_H }); };
        kiste(M, xu - 0.16, yb - 0.16, 0, xu + 0.16, yb + 0.16, 0.18, { s: st, n: st, o: st, w: st, t: winter ? schneeOben(null) : st }, { name: "fs" + xu, keinAo: true });
      }
      balken3(M, [GX0 - 0.35, yb, zk + 0.1], [GX1 + 0.35, yb, zk + 0.1], [0, 1, 0], 0.2, 0.2, m(70 + i), { name: "holm" + i, seiten: "QqRrae" });
      balken3(M, [GX0 - 0.2, yb + 0.12, 1.6], [GX1 + 0.2, yb + 0.12, 1.6], [0, 1, 0], 0.06, 0.18, m(80 + i), { name: "zange" + i, seiten: "QRr" });
      balken3(M, [GX0 - 0.22, yb + 0.12, 1.75], [GX1 + 0.1, yb + 0.12, zk - 0.2], [0, 1, 0], 0.06, 0.14, m(90 + i), { name: "kreuz1" + i, seiten: "QRr" });
      balken3(M, [GX1 + 0.22, yb + 0.12, 1.75], [GX0 - 0.1, yb + 0.12, zk - 0.2], [0, 1, 0], 0.06, 0.14, m(95 + i), { name: "kreuz2" + i, seiten: "QRr" });
      if (winter && Z.fertig) M.flaeche({ name: "bock-zapfen" + i, o: [GX0 - 0.35, yb + 0.105, zk], u: [1, 0, 0], v: [0, 0, -1], w: GX1 - GX0 + 0.7, h: 0.6, keinLicht: true, keinAo: true, malen: zapfenMal(500 + i, 0.5), leuchten: zapfenMal(500 + i, 0.5, true) });
    }
  }
  function konsoleBauen(M, S, Z) {
    if (!Z.konsole) return;
    const hc = [104, 78, 54];
    const m = () => holzMal(hc, 55, S.winter ? (g, F) => { if (F.flaeche.u[2] === 0 && F.flaeche.v[2] === 0) { g.fillStyle = "rgba(242,246,252,0.95)"; g.fillRect(0, 0, F.w, F.h); } } : null);
    M.teil("konsole", { mitte: [AUSSEN + 4.1, KONSOLE_Y, GZ0 + 5], schatten: false });
    balken3(M, [XW1, KONSOLE_Y, GZ0 - 0.1], [GX1 + 0.12, KONSOLE_Y, GZ0 - 0.1], [0, 1, 0], 0.18, 0.2, m, { name: "kons", seiten: "QqRe" });
    balken3(M, [XW1, KONSOLE_Y, GZ0 - 1.3], [GX0 + 0.3, KONSOLE_Y, GZ0 - 0.2], [0, 1, 0], 0.14, 0.14, m, { name: "strebe", seiten: "QqR" });
    if (S.winter && Z.fertig) M.flaeche({ name: "kons-zapfen", o: [XW1 + 0.05, KONSOLE_Y + 0.1, GZ0 - 0.2], u: [1, 0, 0], v: [0, 0, -1], w: GX1 + 0.1 - XW1, h: 0.5, keinLicht: true, keinAo: true, malen: zapfenMal(611, 0.42), leuchten: zapfenMal(611, 0.42, true) });
  }
  /* Außenlager: niedriger Mauerpfeiler in der Ostwand der Grube (Kritik:
     der hohe Quaderpfeiler stand vor der Nabe), darauf ein Eichenbock mit
     eiserner Lagerschale und Deckel über dem Wellenzapfen */
  function lagerBauen(M, B, S, Z) {
    const h = Z.pfeiler;
    if (h <= 0.01) return;
    const winter = S.winter;
    const zTop = PZB + (LZ_P - PZB) * h;
    const st = (saat) => (g, F) => { quaderMalen(g, F, 0, 0, F.w, F.h, { saat: saat, lage: 0.31, laenge: 0.8, farbe: SANDSTEIN_H }); const gr = g.createLinearGradient(0, F.h, 0, F.h - 0.4); gr.addColorStop(0, "rgba(40,50,40,0.35)"); gr.addColorStop(1, "rgba(40,50,40,0)"); g.fillStyle = gr; g.fillRect(0, F.h - 0.4, F.w, 0.4); };
    if (zTop <= 0.01) return;
    M.teil("lager", { schatten: false, mitte: [AUSSEN + 50 + (LX0 + LX1) / 2, 0, 1.2] });
    kiste(M, LX0, -LY, 0, LX1, LY, zTop, { s: st(1), n: st(2), o: st(3), w: st(4), t: (g, F) => { quaderMalen(g, F, 0, 0, F.w, F.h, { saat: 5, lage: F.h / 2, laenge: 0.5, farbe: SANDSTEIN_G }); if (winter) { schneeFlaeche(g, F, 0, 0, F.w, F.h, 5, {}); } } }, { name: "lg", keinAo: false });
    if (h < 1 || !Z.lagerbock) return;
    const hc = [96, 70, 48];
    const holz = (saat) => () => holzMal(hc, saat, winter ? (g, F) => { const n = kreuz(F.flaeche.u, F.flaeche.v); if (n[2] > 0.3) { g.fillStyle = "rgba(242,246,252,0.95)"; g.fillRect(0, 0, F.w, F.h); } } : null);
    /* Stiele (geneigt), dazwischen ein Riegel, oben das Sattelholz mit Eisenbändern */
    BOCK_STIELE.forEach(([a, b], i) => balken3(M, a, b, [1, 0, 0], 0.17, 0.17, holz(66 + i), { name: "bst" + i, seiten: "QqRr" }));
    const zR = LZ_P + (LZ1 - LZ_P) * 0.42, yR = 0.33 - (0.33 - 0.19) * 0.42 - 0.08;
    balken3(M, [X_LAGER, -yR, zR], [X_LAGER, yR, zR], [1, 0, 0], 0.1, 0.12, holz(68), { name: "brg", seiten: "QqRr" });
    const bm = (g, F) => {
      holzMalen(g, F, 0, 0, F.w, F.h, hc, 66, {});
      g.fillStyle = rgb(EISEN);
      for (const x of [0.08, F.w - 0.08]) { g.fillRect(x - 0.02, 0, 0.04, F.h); if (F.px > 25) { g.fillStyle = "rgb(28,26,26)"; g.fillRect(x - 0.035, F.h - 0.05, 0.07, 0.05); g.fillStyle = rgb(EISEN); } }
      if (winter) { g.fillStyle = "rgb(242,246,252)"; g.fillRect(-0.01, -0.01, F.w + 0.02, 0.03); }
    };
    kiste(M, LX0 + 0.04, -0.34, LZ1, LX1 - 0.1, 0.34, LZB, { s: bm, n: bm, o: bm, w: bm, t: (g, F) => { holzMalen(g, F, 0, 0, F.w, F.h, hc, 67, { ohneAst: true }); if (winter) { g.fillStyle = "rgba(242,246,252,0.9)"; g.fillRect(0, 0, F.w, F.h); } } }, { name: "lb", keinAo: true });
    /* Lagerschale und Deckel (Gusseisen) um den Wellenzapfen */
    const ei = (g, F) => { g.fillStyle = rgb(EISEN); g.fillRect(0, 0, F.w, F.h); g.fillStyle = "rgba(150,80,40,0.3)"; g.fillRect(0, F.h * 0.5, F.w, F.h * 0.5); g.fillStyle = "rgba(255,255,255,0.14)"; g.fillRect(0, 0, F.w, Math.min(0.03, F.h)); if (F.px > 25) { g.fillStyle = "rgb(22,20,20)"; for (const x of [0.06, F.w - 0.06]) { g.beginPath(); g.arc(x, F.h * 0.3, 0.02, 0, TAU); g.fill(); } } };
    M.teil("lagerdeckel", { schatten: false, mitte: [AUSSEN + 60 + X_LAGER, 0, RZ + 3] });
    kiste(M, X_LAGER - 0.16, -RW - 0.07, LZB - 0.02, X_LAGER + 0.12, RW + 0.07, RZ + RW + 0.08, { s: ei, n: ei, o: ei, w: ei, t: winter ? schneeOben(ei) : ei }, { name: "ld", keinAo: true });
    if (winter && Z.fertig) M.flaeche({ name: "ld-zapfen", o: [X_LAGER + 0.125, RW + 0.07, LZB], u: [0, -1, 0], v: [0, 0, -1], w: 2 * RW + 0.14, h: 0.45, keinLicht: true, keinAo: true, malen: zapfenMal(621, 0.38), leuchten: zapfenMal(621, 0.38, true) });
  }
  /* Randsteine um die Radgrube (mit Lücke für den Lagerpfeiler) */
  function randBauen(M, B, S, Z) {
    if (!Z.rand) return;
    const winter = S.winter;
    M.teil("rand", { schatten: false, ebene: -1, mitte: [RX, 0, 0] });
    const st = (saat) => (g, F) => { quaderMalen(g, F, 0, 0, F.w, F.h, { saat: saat, lage: F.h, laenge: 0.8, farbe: SANDSTEIN_H }); };
    const oben = (saat) => winter ? schneeOben(null) : (g, F) => { quaderMalen(g, F, 0, 0, F.w, F.h, { saat: saat, lage: F.h, laenge: 0.8, farbe: SANDSTEIN_H }); };
    kiste(M, PX0, PY0 - RAND_B, 0, PX1 + RAND_B, PY0, RAND_H, { s: st(1), n: st(2), o: st(3), w: null, t: oben(4) }, { name: "rn", keinAo: true });
    kiste(M, PX0, PY1, 0, PX1 + RAND_B, PY1 + RAND_B, RAND_H, { s: st(5), n: st(6), o: st(7), w: null, t: oben(8) }, { name: "rs", keinAo: true });
    kiste(M, PX1, PY0, 0, PX1 + RAND_B, -LY, RAND_H, { o: st(9), w: st(10), s: st(12), t: oben(11) }, { name: "ro1", keinAo: true });
    kiste(M, PX1, LY, 0, PX1 + RAND_B, UY0, RAND_H, { n: st(13), w: st(14), t: oben(15) }, { name: "ro2", keinAo: true });
    kiste(M, PX1, UY1, 0, PX1 + RAND_B, PY1, RAND_H, { o: st(16), w: st(17), t: oben(18) }, { name: "ro3", keinAo: true });
    /* über dem Durchlass: ein Sturzstein, dahinter beginnt der Untergraben */
    kiste(M, PX1, UY0, 0, PX1 + RAND_B, UY1, RAND_H, { o: (g, F) => { st(19)(g, F); g.fillStyle = "rgb(20,18,16)"; g.fillRect(0.05, F.h * 0.7, F.w - 0.1, F.h * 0.3); }, w: st(20), t: oben(21) }, { name: "ro-sturz", keinAo: true });
  }
  /* Untergraben: gemauerte, gepflasterte Rinne vom Durchlass bis an den
     Grundrand; das Wasser malt das Leben (oder im Sprite still) */
  function untergrabenBauen(M, B, S, Z) {
    if (!Z.rand) return;
    const winter = S.winter;
    const R = [PX1 + RAND_B, UY0, XG1, UY1, 0], T = -UZB;
    M.teil("untergraben", { ebene: -2, mitte: [(PX1 + XG1) / 2, UYM, -3], schatten: false });
    const ex = { keinLicht: true, keinAo: true };
    const wandMal = (saat, bogen) => (g, F) => {
      g.save(); if (!lochClip(g, F, B, R)) { g.restore(); return; }
      const L = ST.lichtFaktor(F.n, F.zeit, 0, F.jahr);
      quaderMalen(g, F, 0, 0, F.w, F.h, { farbe: [148, 122, 100], lage: 0.24, laenge: 0.7, saat: saat });
      const wl = -PZW;
      g.fillStyle = "rgba(24,34,28,0.45)"; g.fillRect(-0.1, wl - 0.08, F.w + 0.2, F.h);
      g.fillStyle = winter ? "rgba(214,230,246,0.7)" : "rgba(52,84,40,0.5)"; g.fillRect(-0.1, wl - 0.1, F.w + 0.2, 0.06);
      if (bogen) { g.fillStyle = "rgb(12,14,16)"; g.beginPath(); g.moveTo(0.08, F.h); g.lineTo(0.08, 0.4); g.arc(F.w / 2, 0.4, F.w / 2 - 0.08, Math.PI, 0); g.lineTo(F.w - 0.08, F.h); g.closePath(); g.fill(); }
      if (winter && Z.fertig) { const rng = zufall(saat); g.fillStyle = "rgba(214,232,250,0.85)"; g.beginPath(); for (let x = 0.05; x < F.w; x += 0.07 + rng() * 0.12) { const l = 0.05 + rng() * 0.2; g.moveTo(x - 0.015, 0); g.lineTo(x, l); g.lineTo(x + 0.015, 0); g.closePath(); } g.fill(); }
      g.globalCompositeOperation = "multiply"; g.fillStyle = rgb([L[0] * 255, L[1] * 255, L[2] * 255]); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); g.globalCompositeOperation = "source-over";
      grubenSchatten(g, F, R, F.w, F.h);
      g.restore();
    };
    const [x0, y0, x1, y1] = R;
    wand(M, [x0, y0, 0], [0, 1, 0], x1 - x0, T, wandMal(31), Object.assign({ name: "ug-n" }, ex));
    wand(M, [x1, y1, 0], [0, -1, 0], x1 - x0, T, wandMal(32), Object.assign({ name: "ug-s" }, ex));
    wand(M, [x0, y1, 0], [1, 0, 0], y1 - y0, T, wandMal(33, true), Object.assign({ name: "ug-w" }, ex));
    M.flaeche(Object.assign({ name: "ug-sohle", o: [x0, y0, -T], u: [1, 0, 0], v: [0, 1, 0], w: x1 - x0, h: y1 - y0, ebene: -1, malen: (g, F) => {
      g.save(); if (!lochClip(g, F, B, R)) { g.restore(); return; }
      const L = belichter(F, 0.03);
      g.fillStyle = L([110, 98, 86]); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
      grubenSchatten(g, F, R, F.w, F.h);
      g.restore();
    } }, ex));
    if (Z.wasser) M.flaeche(Object.assign({ name: "ug-wasser", o: [x0, y0, PZW], u: [1, 0, 0], v: [0, 1, 0], w: x1 - x0, h: y1 - y0, ebene: 2, malen: (g, F) => {
      if (Z.lebend && F.s >= LEBEN_S) return;
      g.save(); if (!lochClip(g, F, B, R)) { g.restore(); return; }
      const L = belichter(F, 0);
      g.fillStyle = winter ? L([176, 196, 214]) : L([52, 78, 76]); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
      g.fillStyle = L([230, 242, 250], winter ? 0.5 : 0.3); for (let x = 0.1; x < F.w; x += 0.4) g.fillRect(x, F.h * 0.3 + ((x * 7) % 0.4), 0.22, 0.025);
      grubenSchatten(g, F, R, F.w, F.h);
      g.restore();
    } }, ex));
    /* Bordsteine längs der Rinne */
    M.teil("ug-rand", { schatten: false, ebene: -1, mitte: [(PX1 + XG1) / 2, UYM, 0] });
    const st = (saat) => (g, F) => { quaderMalen(g, F, 0, 0, F.w, F.h, { saat: saat, lage: F.h, laenge: 0.7, farbe: SANDSTEIN_H }); };
    const ob = (saat) => winter ? schneeOben(null) : st(saat);
    kiste(M, x0, y0 - 0.24, 0, x1, y0, RAND_H, { n: st(41), s: st(42), t: ob(43) }, { name: "ugr-n", keinAo: true });
    kiste(M, x0, y1, 0, x1, y1 + 0.24, RAND_H, { n: st(44), s: st(45), t: ob(46) }, { name: "ugr-s", keinAo: true });
  }

  /* ---------------- Radgrube (unter Gelände) mit Pfeiler ---------------- */
  function radgrubeBauen(M, B, S, Z) {
    const winter = S.winter;
    M.teil("radgrube", { ebene: -2, mitte: [RX, 0, -3], schatten: false });
    const R = [PX0, PY0, PX1, PY1];
    const T = -PZB;
    grubeBauen(M, B, R, T, T * Z.grubeStein, winter && Z.fertig, 300, { wasser: Z.wasser, durchlass: Z.grubeStein >= 1, beton: true });
    /* Pfeiler unter Gelände (Teil der Ostwand) */
    if (Z.pfeiler > 0) {
      const zTop = Math.min(0, PZB + (LZ_P - PZB) * Z.pfeiler);
      const h = zTop - PZB;
      if (h > 0.02) {
        const mal = (saat) => (g, F) => {
          g.save(); if (!lochClip(g, F, B, R)) { g.restore(); return; }
          quaderMalen(g, F, 0, 0, F.w, F.h, { saat: saat, lage: 0.42, laenge: 0.8, farbe: SANDSTEIN_H });
          g.fillStyle = "rgba(20,30,24,0.4)"; g.fillRect(0, F.h + PZW - PZB - 0.05, F.w, F.h);
          const L = ST.lichtFaktor(F.n, F.zeit, 0, F.jahr);
          g.globalCompositeOperation = "multiply"; g.fillStyle = rgb([L[0] * 255, L[1] * 255, L[2] * 255]); g.fillRect(0, 0, F.w, F.h); g.globalCompositeOperation = "source-over";
          grubenSchatten(g, F, R, F.w, F.h);
          g.restore();
        };
        const ex = { keinLicht: true, keinAo: true, ebene: 1 };
        wand(M, [LX0, LY, zTop], [0, 1, 0], PX1 - LX0, h, mal(1), Object.assign({ name: "pf-s" }, ex));
        wand(M, [PX1, -LY, zTop], [0, -1, 0], PX1 - LX0, h, mal(2), Object.assign({ name: "pf-n" }, ex));
        wand(M, [LX0, -LY, zTop], [-1, 0, 0], 2 * LY, h, mal(4), Object.assign({ name: "pf-w" }, ex));
      }
    }
    /* Wasser (im Sprite nur, wenn das Leben es nicht malt) */
    if (Z.wasser) {
      M.flaeche({ name: "grube-wasser", o: [PX0, PY0, PZW], u: [1, 0, 0], v: [0, 1, 0], w: PX1 - PX0, h: PY1 - PY0, ebene: 2, keinLicht: true, malen: (g, F) => {
        if (Z.lebend && F.s >= LEBEN_S) return;
        g.save(); if (!lochClip(g, F, B, R)) { g.restore(); return; }
        const L = belichter(F, 0);
        g.fillStyle = L(winter ? [150, 170, 186] : [48, 70, 66]); g.fillRect(0, 0, F.w, F.h);
        g.fillStyle = L([220, 236, 246], 0.18); for (let y = 0.3; y < F.h; y += 0.45) g.fillRect(0.2, y, F.w - 0.4, 0.03);
        grubenSchatten(g, F, R, F.w, F.h);
        g.restore();
      } });
    }
  }


  /* =====================================================================
     SCHMUCK UND GERÄT VOR DEM HAUS
     ===================================================================== */
  /* Alter Läuferstein aus Basaltlava (Mayen), an die Wand gelehnt */
  function muehlsteinBauen(M, S, Z) {
    const cx = 1.6, r = 0.6, dicke = 0.28, neig = 12 * RAD;
    const yFuss = YW + 0.5;
    const n = [0, Math.cos(neig), Math.sin(neig)];
    const C = [cx, yFuss - Math.sin(neig) * r - dicke / 2 * n[1] + 0.05, r * Math.cos(neig) + 0.02];
    const Cf = add(C, mul(n, dicke / 2));
    const u = [1, 0, 0], v = [0, Math.sin(neig), -Math.cos(neig)];
    M.teil("muehlstein", { schatten: false, mitte: [cx, YW + AUSSEN, 0.6] });
    const umr = Array.from({ length: 28 }, (_, i) => [r + r * Math.cos(i / 28 * TAU), r + r * Math.sin(i / 28 * TAU)]);
    M.flaeche({ name: "ms-v", o: sub(sub(Cf, mul(u, r)), mul(v, r)), u: u, v: v, w: 2 * r, h: 2 * r, umriss: umr, keinAo: true, malen: (g, F) => {
      g.fillStyle = "rgb(98,98,102)"; g.fillRect(0, 0, 2 * r, 2 * r);
      rausch(g, 0, 0, 2 * r, 2 * r, 0.3, 0.45, 17, 3);
      if (F.px > 14) {
        const rng = zufall(3);
        g.fillStyle = "rgba(30,30,34,0.5)";
        for (let i = 0; i < 200; i++) { g.beginPath(); g.arc(rng() * 2 * r, rng() * 2 * r, 0.004 + rng() * 0.008, 0, TAU); g.fill(); }
        /* Schärfe: acht Felder mit parallelen Hauptfurchen */
        g.save(); g.translate(r, r);
        g.strokeStyle = "rgba(40,40,44,0.7)"; g.lineWidth = 0.018;
        for (let k = 0; k < 8; k++) {
          g.save(); g.rotate(k * TAU / 8);
          for (let j = 0; j < 4; j++) { g.beginPath(); g.moveTo(0.14 + j * 0.02, -0.05 + j * 0.07); g.lineTo(r - 0.04, -0.12 + j * 0.07 + 0.08); g.stroke(); }
          g.restore();
        }
        g.fillStyle = "rgb(30,28,30)"; g.beginPath(); g.arc(0, 0, 0.12, 0, TAU); g.fill();
        g.strokeStyle = "rgba(160,160,160,0.3)"; g.lineWidth = 0.01; g.beginPath(); g.arc(0, 0, 0.13, 0, TAU); g.stroke();
        g.restore();
      }
      if (S.winter) { g.fillStyle = "rgba(244,247,252,0.95)"; g.beginPath(); g.arc(r, r, r * 0.98, Math.PI * 1.08, Math.PI * 1.92); g.closePath(); g.fill(); }
      if (!S.winter) { g.fillStyle = "rgba(70,110,50,0.4)"; g.beginPath(); g.arc(r * 0.6, r * 1.5, 0.25, 0, TAU); g.fill(); }
    } });
    /* Rand (Mantel) in Stücken, mit Eisenreif (12 Stücke: die hintere Hälfte
       sieht man nie, die vordere bleibt rund genug) */
    const N = 12;
    for (let i = 0; i < N; i++) {
      const a0 = i / N * TAU, a1 = (i + 1) / N * TAU, am = (a0 + a1) / 2;
      const p0 = add(C, add(mul(u, r * Math.cos(a0)), mul(v, -r * Math.sin(a0))));
      const p1 = add(C, add(mul(u, r * Math.cos(a1)), mul(v, -r * Math.sin(a1))));
      const nr = nrm(add(mul(u, Math.cos(am)), mul(v, -Math.sin(am))));
      const L = Math.hypot(p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]);
      const uu = nrm(sub(p1, p0));
      const vv = kreuz(nr, uu);
      const o = add(p0, mul(vv, -dicke / 2));
      M.flaeche({ name: "ms-r" + i, o: add(o, mul(n, 0)), u: uu, v: mul(n, -1), w: L, h: dicke, keinAo: true, malen: (g, F) => {
        g.fillStyle = "rgb(90,90,94)"; g.fillRect(-0.02, -0.02, F.w + 0.04, F.h + 0.04);
        g.fillStyle = rgb(EISEN); g.fillRect(-0.02, F.h * 0.35, F.w + 0.04, F.h * 0.3);
        if (S.winter && nr[2] > 0.3) { g.fillStyle = "rgb(244,247,252)"; g.fillRect(-0.02, -0.02, F.w + 0.04, F.h + 0.04); }
      } });
      void vv;
    }
  }
  /* Bank unter dem Fenster links der Tür */
  function bankBauen(M, S, Z) {
    const x0 = -4.05, x1 = -2.55, y0 = YW + 0.08, y1 = YW + 0.5, zs = 0.46;
    const hc = [120, 86, 58];
    M.teil("bank", { schatten: false, mitte: [(x0 + x1) / 2, YW + AUSSEN, 0.4] });
    const m = (saat) => (g, F) => { holzMalen(g, F, -0.02, -0.02, F.w + 0.04, F.h + 0.04, hc, saat, { ohneAst: true }); };
    for (const x of [x0 + 0.1, x1 - 0.16]) kiste(M, x, y0 + 0.04, 0, x + 0.06, y1 - 0.04, zs - 0.05, { s: m(1), n: m(2), o: m(3), w: m(4) }, { name: "bb" + x, keinAo: true });
    kiste(M, x0, y0, zs - 0.05, x1, y1, zs, { s: m(5), o: m(6), w: m(7), t: S.winter ? schneeOben(m(8)) : (g, F) => { m(8)(g, F); if (F.px > 20) { g.fillStyle = "rgba(20,10,5,0.4)"; for (let y = F.h / 3; y < F.h; y += F.h / 3) g.fillRect(0, y - 0.005, F.w, 0.01); } } }, { name: "bs", keinAo: true });
    kiste(M, x0, y0, zs + 0.15, x1, y0 + 0.05, zs + 0.45, { s: S.winter ? (g, F) => { m(9)(g, F); g.fillStyle = "rgb(244,247,252)"; g.fillRect(0, 0, F.w, 0.03); } : m(9), t: S.winter ? schneeOben(null) : m(10) }, { name: "bl", keinAo: true });
  }
  /* Handwagen: Frühling mit Mehlsäcken, Winter mit frisch geschlagener Tanne */
  function wagenBauen(M, S, Z) {
    const x0 = -1.7, x1 = -0.2, y0 = 5.7, y1 = 6.6, zb = 0.52;
    const hc = [128, 94, 62];
    M.teil("wagen", { schatten: false, mitte: [(x0 + x1) / 2, (y0 + y1) / 2 + AUSSEN, 0.6] });
    const m = (saat) => (g, F) => { bretterMalen(g, F, 0, 0, F.w, F.h, hc, saat, { breite: 0.12 }); };
    kiste(M, x0, y0, zb, x1, y1, zb + 0.28, { s: m(1), n: m(2), o: m(3), w: m(4), t: (g, F) => { bretterMalen(g, F, 0, 0, F.w, F.h, hell(hc, -0.2), 5, { breite: 0.15, richtung: "v" }); if (S.winter) { g.fillStyle = "rgba(242,246,252,0.8)"; g.fillRect(0, 0, F.w, F.h); } } }, { name: "wk", keinAo: true });
    /* Räder mit Speichen */
    for (const [x, y] of [[x0 + 0.3, y1 + 0.02], [x1 - 0.3, y1 + 0.02], [x0 + 0.3, y0 - 0.02], [x1 - 0.3, y0 - 0.02]]) {
      const r = 0.34, s = y > (y0 + y1) / 2 ? 1 : -1;
      M.flaeche({ name: "rad" + x + y, o: [x - r, y, r * 2 + 0.02], u: [1, 0, 0], v: [0, 0, -1], w: 2 * r, h: 2 * r, umriss: Array.from({ length: 20 }, (_, i) => [r + r * Math.cos(i / 20 * TAU), r + r * Math.sin(i / 20 * TAU)]), beidseitig: true, keinAo: true, malen: (g, F) => {
        g.strokeStyle = "rgb(60,44,30)"; g.lineWidth = 0.05; g.beginPath(); g.arc(r, r, r - 0.03, 0, TAU); g.stroke();
        g.strokeStyle = rgb(EISEN); g.lineWidth = 0.02; g.beginPath(); g.arc(r, r, r - 0.01, 0, TAU); g.stroke();
        g.strokeStyle = "rgb(96,70,46)"; g.lineWidth = 0.03; g.beginPath(); for (let i = 0; i < 8; i++) { const a = i * TAU / 8; g.moveTo(r, r); g.lineTo(r + Math.cos(a) * (r - 0.04), r + Math.sin(a) * (r - 0.04)); } g.stroke();
        g.fillStyle = "rgb(60,44,30)"; g.beginPath(); g.arc(r, r, 0.06, 0, TAU); g.fill();
        if (S.winter) { g.fillStyle = "rgba(244,247,252,0.9)"; g.beginPath(); g.arc(r, r, r, Math.PI * 1.15, Math.PI * 1.85); g.lineTo(r, r - r * 0.8); g.closePath(); g.fill(); }
      } });
      void s;
    }
    /* Deichsel */
    balken3(M, [x0, (y0 + y1) / 2, zb + 0.1], [x0 - 1.0, (y0 + y1) / 2, 0.08], [0, 1, 0], 0.06, 0.06, () => (g, F) => { g.fillStyle = rgb(hell(hc, -0.2)); g.fillRect(0, 0, F.w, F.h); }, { name: "deichsel", seiten: "QqR" });
    /* Ladung als Figur */
    M.teil("ladung", { schatten: false, mitte: [(x0 + x1) / 2, (y0 + y1) / 2 + AUSSEN, 1.2] });
    M.figur({ x: (x0 + x1) / 2, y: (y0 + y1) / 2, z: zb + 0.28, breite: 1.8, hoehe: 1.2, malen: S.winter ? tanneLiegend() : saecke(S) });
  }
  /* Mehlsäcke (Frühling). Licht aus figurLicht: links Sonnenseite, rechts
     Schatten – Kritik Runde 1: „nachts leuchten die Mehlsäcke". Die
     Aufschrift erst ab 60 Bildpunkten je Meter und klein. */
  function saecke(S) {
    return function (g, s, F) {
      const k = s;
      if (F.schatten) { g.fillStyle = "#000"; g.beginPath(); g.ellipse(0.05 * k, -0.35 * k, 0.72 * k, 0.36 * k, 0, 0, TAU); g.fill(); return; }
      const FL = figurLicht(F);
      const sack = (x, y, b, h, dreh, hellK) => {
        g.save(); g.translate(x * k, y * k); g.rotate(dreh);
        const c = hell([226, 214, 186], hellK);
        const gr = g.createLinearGradient(-b * k / 2, 0, b * k / 2, 0);
        gr.addColorStop(0, FL.lit(hell(c, 0.04), FL.lL)); gr.addColorStop(0.55, FL.lit(c, FL.lV)); gr.addColorStop(1, FL.lit(hell(c, -0.1), FL.lR));
        g.fillStyle = gr;
        g.beginPath(); g.moveTo(-b * k / 2, 0); g.bezierCurveTo(-b * k * 0.6, -h * k * 0.6, -b * k * 0.4, -h * k, -b * k * 0.15, -h * k * 1.02);
        g.lineTo(b * k * 0.15, -h * k * 1.02); g.bezierCurveTo(b * k * 0.4, -h * k, b * k * 0.6, -h * k * 0.6, b * k / 2, 0); g.closePath(); g.fill();
        if (k > 16) {
          /* Zipfel mit Kordel, Falten */
          g.fillStyle = FL.lit(hell(c, -0.15), FL.lO); g.beginPath(); g.ellipse(0, -h * k * 1.05, b * k * 0.16, h * k * 0.08, 0, 0, TAU); g.fill();
          g.strokeStyle = FL.lit([120, 90, 50], FL.lV, 0.8); g.lineWidth = Math.max(0.6, k * 0.012); g.beginPath(); g.moveTo(-b * k * 0.14, -h * k * 0.95); g.lineTo(b * k * 0.14, -h * k * 0.95); g.stroke();
          g.strokeStyle = FL.lit([150, 136, 108], FL.lR, 0.5); g.lineWidth = Math.max(0.5, k * 0.008);
          g.beginPath(); g.moveTo(-b * k * 0.2, -h * k * 0.85); g.quadraticCurveTo(-b * k * 0.05, -h * k * 0.55, -b * k * 0.12, -h * k * 0.2); g.moveTo(b * k * 0.15, -h * k * 0.8); g.quadraticCurveTo(b * k * 0.28, -h * k * 0.5, b * k * 0.2, -h * k * 0.25); g.stroke();
          if (k > 60) { g.fillStyle = FL.lit([40, 70, 140], FL.lV, 0.6); g.font = "bold " + (0.06 * k).toFixed(1) + "px Georgia, serif"; g.textAlign = "center"; g.fillText("MEHL", 0, -h * k * 0.45); g.fillStyle = FL.lit([160, 40, 40], FL.lV, 0.5); g.fillRect(-b * k * 0.22, -h * k * 0.38, b * k * 0.44, 0.01 * k); }
        }
        g.restore();
      };
      sack(-0.35, 0, 0.42, 0.62, -0.08, 0);
      sack(0.1, 0, 0.44, 0.66, 0.05, -0.05);
      sack(0.5, 0.02, 0.4, 0.55, 0.12, 0.04);
      sack(-0.1, -0.35, 0.42, 0.5, -0.5, 0.06);
    };
  }
  /* Frisch geschlagene Tanne auf dem Handwagen (Winter), beleuchtet */
  function tanneLiegend() {
    return function (g, s, F) {
      const k = s;
      if (F.schatten) { g.fillStyle = "#000"; g.beginPath(); g.moveTo(-0.85 * k, -0.05 * k); g.lineTo(-0.5 * k, -0.42 * k); g.lineTo(0.85 * k, -0.12 * k); g.lineTo(-0.5 * k, 0.1 * k); g.closePath(); g.fill(); return; }
      const FL = figurLicht(F);
      g.fillStyle = FL.lit([92, 62, 40], FL.lV); g.fillRect(-0.85 * k, -0.08 * k, 0.4 * k, 0.07 * k);
      /* Zweige als liegender Kegel: oben Himmelslicht, unten Schatten */
      const rng = zufall(8);
      for (let i = 0; i < 90; i++) {
        const t = rng(), x = -0.5 * k + t * 1.35 * k, br = (1 - t) * 0.32 * k + 0.04 * k;
        const q = rng() - 0.3, y = -0.1 * k - q * br;
        g.fillStyle = FL.lit([30 + rng() * 22, 70 + rng() * 26, 44 + rng() * 10], q > 0.35 ? FL.lL : FL.lR);
        g.beginPath(); g.ellipse(x, y, 0.1 * k, 0.035 * k, (rng() - 0.5) * 1.2, 0, TAU); g.fill();
      }
      g.fillStyle = FL.lit([246, 249, 255], FL.lO, 0.9);
      for (let i = 0; i < 30; i++) { const t = rng(), x = -0.5 * k + t * 1.35 * k, br = (1 - t) * 0.28 * k + 0.03 * k; g.beginPath(); g.ellipse(x, -0.12 * k - br * 0.8, 0.07 * k, 0.02 * k, 0, 0, TAU); g.fill(); }
    };
  }
  /* Schlanker Christbaum im Holzkübel rechts neben der Tür (Winter).
     Kritik Runde 1: „der Baum steht vor der Tür" – jetzt vor dem rechten
     Pfeiler zwischen Tür und Fenster, schmaler; Kugeln, Strohsterne,
     Lichter; Nadeln und Kübel im Licht der Tageszeit. */
  function christbaumBauen(M, S, Z) {
    const x = 0.55, y = YW + 0.5;
    M.teil("christbaum", { schatten: false, mitte: [x, y + AUSSEN, 1] });
    M.figur({ x: x, y: y, z: 0, breite: 0.9, hoehe: 2.1, malen: function (g, s, F) {
      const k = s, rng = zufall(12);
      if (F.schatten) {
        g.fillStyle = "#000"; g.beginPath();
        g.moveTo(-0.2 * k, 0); g.lineTo(-0.22 * k, -0.38 * k); g.lineTo(-0.4 * k, -0.42 * k); g.lineTo(0, -2.02 * k); g.lineTo(0.4 * k, -0.42 * k); g.lineTo(0.22 * k, -0.38 * k); g.lineTo(0.2 * k, 0); g.closePath(); g.fill();
        return;
      }
      const FL = figurLicht(F);
      /* Kübel mit zwei Eisenreifen */
      const gk = g.createLinearGradient(-0.22 * k, 0, 0.22 * k, 0);
      gk.addColorStop(0, FL.lit([122, 82, 52], FL.lL)); gk.addColorStop(1, FL.lit([112, 74, 46], FL.lR));
      g.fillStyle = gk; g.beginPath(); g.moveTo(-0.18 * k, 0); g.lineTo(-0.22 * k, -0.36 * k); g.lineTo(0.22 * k, -0.36 * k); g.lineTo(0.18 * k, 0); g.closePath(); g.fill();
      g.fillStyle = FL.lit([50, 48, 48], FL.lV); g.fillRect(-0.21 * k, -0.3 * k, 0.42 * k, 0.025 * k); g.fillRect(-0.19 * k, -0.09 * k, 0.38 * k, 0.025 * k);
      g.fillStyle = FL.lit([244, 247, 252], FL.lO); g.beginPath(); g.ellipse(0, -0.36 * k, 0.22 * k, 0.04 * k, 0, 0, TAU); g.fill();
      /* Zweige in Etagen: links hell, rechts dunkel, oben Schnee */
      const lagen = 8;
      for (let i = 0; i < lagen; i++) {
        const t = i / (lagen - 1), yy = -0.42 * k - t * 1.45 * k, b = (0.4 - t * 0.33) * k;
        for (let j = 0; j < 12; j++) {
          const a = (j / 11 - 0.5) * 2, xx = a * b;
          g.fillStyle = FL.lit([24 + rng() * 20, 60 + rng() * 22, 38 + rng() * 8], a < -0.2 ? FL.lL : a > 0.3 ? FL.lR : FL.lV);
          g.beginPath(); g.ellipse(xx, yy + Math.abs(a) * 0.07 * k, 0.085 * k, 0.034 * k, a * 0.5, 0, TAU); g.fill();
        }
        g.fillStyle = FL.lit([246, 249, 255], FL.lO, 0.92); g.beginPath(); g.ellipse(-b * 0.15, yy - 0.03 * k, b * 0.55, 0.026 * k, 0, 0, TAU); g.fill();
      }
      /* Kugeln (mit Glanz, der nur bei Tag leuchtet), Strohsterne */
      const kugeln = [[-0.16, -0.68], [0.15, -0.84], [-0.08, -1.05], [0.1, -1.3], [-0.04, -1.55], [0.22, -0.6]];
      for (let i = 0; i < kugeln.length; i++) {
        g.fillStyle = FL.lit(i % 2 ? [192, 26, 44] : [217, 163, 58], FL.lV); g.beginPath(); g.arc(kugeln[i][0] * k, kugeln[i][1] * k, 0.04 * k, 0, TAU); g.fill();
        g.fillStyle = FL.lit([255, 255, 255], FL.lL, 0.6); g.beginPath(); g.arc(kugeln[i][0] * k - 0.011 * k, kugeln[i][1] * k - 0.011 * k, 0.012 * k, 0, TAU); g.fill();
      }
      if (k > 30) {
        g.strokeStyle = FL.lit([222, 190, 110], FL.lV); g.lineWidth = Math.max(0.6, 0.008 * k);
        for (const [sx, sy] of [[-0.2, -0.95], [0.18, -1.12], [0.02, -0.78]]) { g.beginPath(); for (let i = 0; i < 4; i++) { const a = i * Math.PI / 4; g.moveTo(sx * k - Math.cos(a) * 0.035 * k, sy * k - Math.sin(a) * 0.035 * k); g.lineTo(sx * k + Math.cos(a) * 0.035 * k, sy * k + Math.sin(a) * 0.035 * k); } g.stroke(); }
      }
      const nacht = F.nacht || 0;
      for (let i = 0; i < 16; i++) {
        const t = i / 15, xx = Math.sin(i * 2.4) * (0.34 - t * 0.28) * k, yy = -0.52 * k - t * 1.3 * k;
        g.fillStyle = nacht > 0.2 ? "rgba(255,236,170,1)" : FL.lit([250, 240, 210], FL.lV, 0.9);
        g.beginPath(); g.arc(xx, yy, Math.max(0.6, 0.016 * k), 0, TAU); g.fill();
        if (nacht > 0.2 && i % 2 === 0 && F.leuchtPunkt) F.leuchtPunkt(xx, yy, 0.3 * k, "255,200,120", 0.22, true);
      }
      /* Stern */
      g.fillStyle = nacht > 0.2 ? "#f6d670" : FL.lit([240, 200, 80], FL.lV); g.beginPath();
      for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = (i % 2 ? 0.035 : 0.09) * k; g.lineTo(Math.cos(a) * r, -1.93 * k + Math.sin(a) * r); }
      g.closePath(); g.fill();
      if (nacht > 0.2 && F.leuchtPunkt) F.leuchtPunkt(0, -1.93 * k, 0.5 * k, "255,220,140", 0.4, false);
    } });
  }
  /* Holzstapel an der Nordwand unter der Traufe */
  function holzstapelBauen(M, S, Z) {
    const x0 = -6.5, x1 = -3.9, y0 = -YW - 0.55, y1 = -YW - 0.02, h = 1.55;
    M.teil("holzstapel", { schatten: false, mitte: [(x0 + x1) / 2, -YW - AUSSEN, 0.8] });
    const stirn = (g, F) => {
      g.fillStyle = "rgb(70,52,36)"; g.fillRect(0, 0, F.w, F.h);
      const rng = zufall(33), px = F.px;
      const r0 = 0.07;
      for (let y = F.h - r0; y > r0 * 0.6; y -= r0 * 1.75) for (let x = r0 + (((y * 10) | 0) % 2) * r0 * 0.9; x < F.w - r0 * 0.5; x += r0 * 1.9) {
        const r = r0 * (0.75 + rng() * 0.4);
        g.fillStyle = rgb(PI.streu([196, 160, 116], rng, 0.12)); g.beginPath(); g.arc(x + (rng() - 0.5) * 0.02, y + (rng() - 0.5) * 0.02, r, 0, TAU); g.fill();
        if (px > 25) { g.strokeStyle = "rgba(120,84,50,0.45)"; g.lineWidth = Math.max(0.003, 0.7 / px); g.beginPath(); g.arc(x, y, r * 0.55, 0, TAU); g.stroke(); g.beginPath(); g.moveTo(x, y); g.lineTo(x + r * 0.8, y - r * 0.3); g.stroke(); }
      }
      if (S.winter) { g.fillStyle = "rgb(244,247,252)"; PI.rundRechteck(g, -0.02, -0.02, F.w + 0.04, 0.08, 0.03); g.fill(); }
    };
    const seite = (g, F) => { g.fillStyle = "rgb(96,70,48)"; g.fillRect(0, 0, F.w, F.h); for (let y = 0.07; y < F.h; y += 0.12) { g.fillStyle = "rgba(40,24,14,0.4)"; g.fillRect(0, y, F.w, 0.02); } };
    kiste(M, x0, y0, 0, x1, y1, h, { n: stirn, o: seite, w: seite, t: S.winter ? schneeOben(null) : seite }, { name: "hs", ao: true });
  }
  /* Aufzugsbalken mit Seilrolle unter dem Westwalm */
  function aufzugBauen(M, S, Z) {
    const zb = ZWE - 0.45, xe = XW0 - 1.05;
    M.teil("aufzug", { schatten: false, mitte: [XW0 - AUSSEN, 0, zb] });
    const hc = [96, 50, 34];
    balken3(M, [XW0, 0, zb], [xe, 0, zb], [0, 1, 0], 0.22, 0.26, () => holzMal(hc, 17, S.winter ? (g, F) => { if (F.flaeche.u[2] === 0 && F.flaeche.v[2] === 0) { g.fillStyle = "rgba(242,246,252,0.95)"; g.fillRect(0, 0, F.w, F.h); } } : null), { name: "ab", seiten: "QqRrae" });
    M.figur({ x: xe + 0.15, y: 0, z: 4.3, breite: 0.5, hoehe: zb - 4.3, malen: function (g, s, F) {
      const k = s, hh = (zb - 0.13 - 4.3) * ST.KZ * k;
      g.strokeStyle = F.schatten ? "#000" : "rgb(168,142,100)"; g.lineWidth = Math.max(1, 0.025 * k);
      g.beginPath(); g.moveTo(0, -hh); g.lineTo(0, 0); g.stroke();
      g.beginPath(); g.moveTo(0.1 * k, -hh); g.quadraticCurveTo(0.14 * k, -hh * 0.5, 0.12 * k, -hh * 0.35); g.stroke();
      /* Rolle */
      g.fillStyle = F.schatten ? "#000" : "rgb(56,50,46)"; g.beginPath(); g.arc(0.05 * k, -hh - 0.02 * k, 0.1 * k, 0, TAU); g.fill();
      /* Haken */
      g.strokeStyle = F.schatten ? "#000" : "rgb(40,38,38)"; g.lineWidth = Math.max(1, 0.03 * k);
      g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 0.06 * k); g.arc(0.04 * k, 0.06 * k, 0.04 * k, Math.PI, 0.2, true); g.stroke();
    } });
  }
  /* Pflaster vor der Tür */
  function pflasterBauen(M, S, Z) {
    M.teil("pflaster", { schatten: false, ebene: -1, mitte: [-1.2, YW + 1, 0] });
    M.flaeche({ name: "pflaster", o: [-2.8, YW, 0.01], u: [1, 0, 0], v: [0, 1, 0], w: 3.2, h: 3.55, umriss: [[0, 0], [3.2, 0], [3.0, 3.55], [0.3, 3.55]], malen: (g, F) => {
      const rng = zufall(8), w = F.w, h = F.h;
      g.fillStyle = "rgb(120,114,104)"; g.fillRect(0, 0, w, h);
      if (F.px > 8) for (let y = 0; y < h; y += 0.13) for (let x = -((y * 10) % 2) * 0.06; x < w; x += 0.13) { g.fillStyle = rgb(PI.streu([150, 142, 130], rng, 0.18)); PI.rundRechteck(g, x + 0.01, y + 0.01, 0.11, 0.11, 0.03); g.fill(); }
      rausch(g, 0, 0, w, h, 1.5, 0.25, 4, 3);
      if (S.winter) {
        /* geräumt: Schnee am Rand, in der Mitte ein freigefegter Weg */
        g.fillStyle = "rgba(244,247,252,0.95)"; g.fillRect(0, 0, 0.6, h); g.fillRect(w - 0.6, 0, 0.6, h);
        g.fillStyle = "rgba(244,247,252,0.45)"; g.fillRect(0.6, 0, w - 1.2, h);
      }
    } });
  }

  /* =====================================================================
     SCHATTEN, DIE DER KERN NICHT KANN (Radkranz mit Welle, Gerinne auf
     Böcken): eine Figur zeichnet sie im Schattendurchgang auf den Boden.
     ===================================================================== */
  const SLX = -ST.LICHT[0] / ST.LICHT[2], SLY = -ST.LICHT[1] / ST.LICHT[2];
  /* Leistung (Kritik: Sprite zu teuer): jeder Teil mit Schatten kostet den
     Kern zwei weichgezeichnete Füllungen (Wurf- und Kontaktschatten). Die
     kleinen Dinge (Gerinne, Böcke, Konsole, Lager, Kamin, Mühlstein, Bank,
     Wagen, Holzstapel, Christbaum, Rad) werfen ihren Schatten deshalb hier
     gemeinsam – EIN Pfad, EINE Füllung (Rad-Loch über den Umlaufsinn). */
  function schattenFigur(B, S, Z) {
    return function (g, s, F) {
      if (!F.schatten) return;
      const m = g.getTransform();
      if (Math.abs(m.d) < 1e-6) return;
      g.transform(1, 0, -m.c / m.d, 1 / m.d, 0, 0);
      const bp = (p) => { const a = p[0] * B.c - p[1] * B.s, b = p[0] * B.s + p[1] * B.c; const ga = a + SLX * p[2], gb = b + SLY * p[2]; return [(ga - gb) * ST.KX * s, (ga + gb) * ST.KY * s]; };
      const flaecheV = (P) => { let f = 0; for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length]; f += a[0] * b[1] - b[0] * a[1]; } return f; };
      g.fillStyle = "#000";
      g.beginPath();
      /* Vieleck mit festem Umlaufsinn (+1 = füllen, −1 = Loch) */
      const zug = (H, sinn) => { if (H.length < 3) return; if ((flaecheV(H) > 0 ? 1 : -1) !== sinn) H = H.slice().reverse(); g.moveTo(H[0][0], H[0][1]); for (let i = 1; i < H.length; i++) g.lineTo(H[i][0], H[i][1]); g.closePath(); };
      /* Schatten eines Körpers: Hülle seiner Schattenpunkte am Boden */
      const flach = (pts) => zug(huelle2(pts.map(bp)), 1);
      const stab = (a, b, d) => flach([add(a, [d, d, 0]), add(a, [-d, -d, 0]), add(a, [d, -d, 0]), add(a, [-d, d, 0]), add(b, [d, d, 0]), add(b, [-d, -d, 0]), add(b, [d, -d, 0]), add(b, [-d, d, 0])]);
      const kasten = (x0, y0, z0, x1, y1, z1) => flach(kastenPunkte(x0, y0, z0, x1, y1, z1));
      /* Gerinne, Böcke, Konsole */
      if (Z.gerinne > 0) kasten(GX0, GY0, GZ0, GX1, GY0 + (GY1 - GY0) * Z.gerinne, GZ1);
      if (Z.boecke > 0) for (const yb of BOECKE) {
        stab([GX0 - 0.35, yb, 0], [GX0 + 0.04, yb, GZ0 - 0.2], 0.08); stab([GX1 + 0.35, yb, 0], [GX1 - 0.04, yb, GZ0 - 0.2], 0.08);
        stab([GX0 - 0.35, yb, GZ0 - 0.1], [GX1 + 0.35, yb, GZ0 - 0.1], 0.1);
        stab([GX0 - 0.22, yb, 1.75], [GX1 + 0.1, yb, GZ0 - 0.4], 0.04); stab([GX1 + 0.22, yb, 1.75], [GX0 - 0.1, yb, GZ0 - 0.4], 0.04);
      }
      if (Z.konsole) { stab([XW1, KONSOLE_Y, GZ0 - 0.1], [GX1 + 0.12, KONSOLE_Y, GZ0 - 0.1], 0.1); stab([XW1, KONSOLE_Y, GZ0 - 1.3], [GX0 + 0.3, KONSOLE_Y, GZ0 - 0.2], 0.07); }
      /* Außenlager: Pfeiler, Stiele, Sattel, Deckel */
      if (Z.pfeiler > 0) kasten(LX0, -LY, 0, LX1, LY, Math.max(0.02, PZB + (LZ_P - PZB) * Z.pfeiler));
      if (Z.pfeiler >= 1 && Z.lagerbock) {
        for (const [a, b] of BOCK_STIELE) stab(a, b, 0.085);
        kasten(LX0 + 0.04, -0.34, LZ1, LX1 - 0.1, 0.34, LZB);
        kasten(X_LAGER - 0.16, -RW - 0.07, LZB - 0.02, X_LAGER + 0.12, RW + 0.07, RZ + RW + 0.08);
      }
      /* Kamin über dem First */
      if (Z.kamin > 0) kasten(KAMIN_X - KAMIN_B / 2, -KAMIN_T / 2, ZF - 0.5, KAMIN_X + KAMIN_B / 2, KAMIN_T / 2, ZF + KAMIN_H * Z.kamin + 0.1);
      if (Z.deko) {
        /* Mühlstein (angelehnte Scheibe), Bank, Handwagen mit Ladung, Holzstapel */
        const neig = 12 * RAD, r = 0.6, C = [1.6, YW + 0.5 - Math.sin(neig) * r - 0.14 * Math.cos(neig) + 0.05, r * Math.cos(neig) + 0.02];
        const ms = []; for (let i = 0; i < 14; i++) { const a = i / 14 * TAU; ms.push([C[0] + r * Math.cos(a), C[1] - r * Math.sin(a) * Math.sin(neig), C[2] - r * Math.sin(a) * Math.cos(neig)]); }
        flach(ms.concat(ms.map((p) => [p[0], p[1] + 0.27, p[2] + 0.06])));
        kasten(-4.05, YW + 0.08, 0.41, -2.55, YW + 0.5, 0.46); kasten(-4.05, YW + 0.08, 0.61, -2.55, YW + 0.13, 0.91);
        for (const x of [-3.95, -2.71]) kasten(x, YW + 0.12, 0, x + 0.06, YW + 0.46, 0.41);
        kasten(-1.7, 5.7, 0.35, -0.2, 6.6, 0.8); kasten(-1.55, 5.8, 0.8, -0.35, 6.5, S.winter ? 1.2 : 1.45);
        kasten(-6.5, -YW - 0.55, 0, -3.9, -YW - 0.02, 1.55);
        if (S.winter) {
          const C2 = [0.55, YW + 0.5], kegel = [[C2[0], C2[1], 2.02]];
          for (let i = 0; i < 10; i++) { const a = i / 10 * TAU; kegel.push([C2[0] + 0.4 * Math.cos(a), C2[1] + 0.4 * Math.sin(a), 0.42]); kegel.push([C2[0] + 0.2 * Math.cos(a), C2[1] + 0.2 * Math.sin(a), 0]); }
          flach(kegel);
        }
      }
      /* Rad: Welle und Kranz als Ring (die Speichen drehen sich – ihr
         Schatten stünde still, Kritik Runde 1) */
      if (Z.rad > 0) {
        stab([XW1, 0, RZ], [X_LAGER, 0, RZ], RW);
        const N = 40;
        const kreis = (x, r) => Array.from({ length: N }, (_, i) => bp(radPunkt(x, r, i / N * TAU)));
        const aus = huelle2(kreis(XK1, RR).concat(kreis(XK4, RR)));
        /* innen frei: Schnitt beider Innenkreise */
        let loch = kreis(XK1, RI);
        const k2 = kreis(XK4, RI), sgn = flaecheV(k2) > 0 ? 1 : -1;
        for (let i = 0; i < k2.length && loch.length >= 3; i++) {
          const a = k2[i], b = k2[(i + 1) % k2.length];
          loch = schneide(loch, (p) => sgn * ((b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0])));
        }
        zug(aus, 1);
        zug(loch, -1);
      }
      g.fill("nonzero");
    };
  }
  /* Unsichtbare Figuren, damit die Figurschatten ins Bild passen: der
     Schatten eines Punkts in der Höhe z liegt im Bild immer rechts davon
     (Licht kommt im Kameraraum stets von links oben), um etwa 1,24·z. */
  function grenzPunkte(M) {
    M.teil("grenzen", { schatten: false, ebene: -80, mitte: [0, 0, 0] });
    for (const p of [[RX, GY0, GZ1], [RX, GY1, GZ1], [RX, -RR, RZ + RR], [RX, RR, RZ + RR], [RX, -2.5, GZ1]]) {
      M.figur({ x: p[0], y: p[1], z: 0, breite: 2.2 * p[2], hoehe: 0.1, schatten: false, malen: () => {} });
    }
  }
  /* =====================================================================
     BAUZUSTAND
     ===================================================================== */
  function zustand(bau, lebend) {
    const k = (a, b) => phase(bau, a, b);
    const fwT = k(0.44, 0.52);
    const Z = {
      bau: bau, fertig: bau >= 1, lebend: lebend,
      grubeT: 1.3 * glatt(k(0, 0.07)),
      fundament: k(0.07, 0.12),
      mauerBis: ZE * k(0.13, 0.4),
      lage: 1,
      fw: fwT,
      fwBis: bau >= 0.55 ? 99 : ZE + (ZT - ZE) * Math.min(1, fwT * 1.6) + 0.001,
      gefach: k(0.52, 0.56),
      giebel: bau >= 0.55,
      kalk: k(0.9, 0.94),
      dach: bau >= 0.8,
      dachReihen: bau >= 0.8 ? null : (bau >= 0.66 ? 1 : 0),
      kamin: k(0.64, 0.72),
      dammH: TD_Z * glatt(k(0.14, 0.5)),
      rasen: bau >= 0.9,
      schuetz: bau >= 0.82,
      grubeStein: k(0.14, 0.3),
      pfeiler: k(0.2, 0.34),
      lagerbock: bau >= 0.84,
      rand: bau >= 0.3,
      boecke: k(0.8, 0.84),
      gerinne: k(0.84, 0.88),
      konsole: bau >= 0.82,
      rad: k(0.86, 0.97),
      gewaende: bau >= 0.13,
      fenster: bau >= 0.93,
      tueren: bau >= 0.95,
      deko: bau >= 0.98,
      wasser: bau >= 1
    };
    /* Lage für Lage: Fortschritt in der obersten Lage */
    const lagen = ZE / 0.24;
    Z.lage = (k(0.13, 0.4) * lagen) % 1 || 1;
    Z.holzC = misch(HOLZ_ROH, HOLZ_FW, k(0.9, 0.95));
    /* Hölzer in Reihenfolge: Schwellen, Ständer, Rähm, Riegel und Streben */
    const artZeit = { schwelle: 0.0, staender: 0.25, raehm: 0.5, riegel: 0.7, strebe: 0.85, ortsparren: 0.9 };
    Z.holzNur = (m) => fwT >= (artZeit[m.art] || 0) + 0.02 || (m.p0[1] > ZT - 0.01 && Z.giebel);
    return Z;
  }

  /* =====================================================================
     MODELL
     ===================================================================== */
  ST.modell("wassermuehle", {
    name: "Wassermühle", gruppe: "Häuser", grund: GRUND, hoehe: 13, bauzeit: 12 * 60,
    bauen(M0, o) {
      /* alles in Konstruktionskoordinaten (Haus um y = 0), der Bauer schiebt um DY */
      const M = verschoben(M0, DY);
      const B = neuerBlick();
      M.teil("blick", { ebene: -90, schatten: false, mitte: [0, 0, 0] });
      M.figur({ x: 0, y: 0, z: 0, breite: 0.01, hoehe: 0.01, schatten: false, malen(g, s, F) { if (!F.schatten && F.gier != null) blickSetzen(B, F.gier); } });
      const winter = o.jahr === "winter";
      const bau = o.bau == null ? 1 : klemm(o.bau, 0, 1);
      const lebend = !!o.objekt && bau >= 1;
      const Z = zustand(bau, lebend);
      const S = { winter: winter, saat: 7 + ((o.saat || 0) % 5), kaminX: KAMIN_X, inschrift: true, blumen: !winter };
      /* R: was das Sprite über sich weiß (für das Leben dieses Sprites) */
      const R = { spriteS: null };
      /* Schattenfigur (Radkranz und Welle; Gerinne, Böcke, Damm werfen ihre
         Schatten als Flächen selbst) */
      M.teil("schattenwurf", { ebene: -89, schatten: true, mitte: [0, 0, 0] });
      M.figur({ x: 0, y: 0, z: 0, breite: 0.01, hoehe: 0.01, malen: schattenFigur(B, S, Z) });
      grenzPunkte(M);
      /* Baugrube (vor dem Mauern) */
      if (bau < 0.14) {
        M.teil("baugrube", { ebene: -3, mitte: [0, 0, -3], schatten: false });
        const Rg = [XW0 - 0.5, -YW - 0.5, PX1 + 0.35, YW + 0.5];
        grubeBauen(M, B, Rg, Z.grubeT, 0, winter, 100, {});
        if (Z.fundament > 0) fundamentBauen(M, B, Z, Rg, bau, winter);
        /* Aushub (am Südrand des Grundstücks, damit er nicht in die Grube ragt) */
        M.teil("aushub", { mitte: [-5, 7 + AUSSEN, 0.5] });
        M.figur({ x: -4.6, y: 6.6, z: 0, breite: 4.5, hoehe: 1.6, malen: aushubFigur(glatt(Z.grubeT / 1.3), winter) });
      } else {
        radgrubeBauen(M, B, S, Z);
        randBauen(M, B, S, Z);
        untergrabenBauen(M, B, S, Z);
      }
      /* Haus */
      if (bau >= 0.13) hausBauen(M, B, S, Z);
      if (bau >= 0.6 && bau < 0.8) dachstuhlBauen(M, S, Z);
      if (bau >= 0.66 && bau < 0.8) dachImBau(M, S, Z);
      if (Z.dach) dachBauen(M, S, Z, B);
      kaminBauen(M, S, Z);
      if (Z.fertig) M.rauchAus(KAMIN_X, 0, ZF + KAMIN_H + 0.15, winter ? 1.0 : 0.6);
      /* Wasserseite: Teichdamm, Tosbecken, Lager, Böcke, Konsole, Gerinne */
      dammBauen(M, B, S, Z);
      tosbeckenBauen(M, B, S, Z);
      lagerBauen(M, B, S, Z);
      boeckeBauen(M, S, Z);
      konsoleBauen(M, S, Z);
      gerinneBauen(M, B, S, Z);
      /* Rad: im Sprite still (Bau, Vorschau, Übersicht unter LEBEN_S), sonst
         dreht es sich im Leben; im Sprite liegt dann nur eine schwach
         deckende Silhouette (damit ein Tipp auf das Rad die Mühle trifft). */
      if (Z.rad > 0) {
        M.teil("rad", { mitte: [AUSSEN + RX, 0, RZ], schatten: false });
        M.figur({ x: 0, y: 0, z: 0, breite: 0.01, hoehe: 0.01, schatten: false, malen(g, s, F) {
          if (F.schatten) return;
          R.spriteS = s;
          /* die Figur steht im Ursprung der Konstruktion: A rechnet von dort */
          const A = ansichtFigur(s, F.gier || 0, F.Z, F.jahr);
          if (!lebend || s < LEBEN_S) radMalen(g, A, PHI0, { winter: winter, wasser: Z.wasser, bau: Z.rad, still: true });
          else radSilhouette(g, A, 0.2);
        } });
      }
      if (lebend) M.lebendig((g, P) => lebenMalen(g, P, { winter: winter }, R));
      /* Hülle für die Bildgrenzen (das Rad wird ja erst später gemalt) */
      M.teil("huelle", { schatten: false, ebene: -85, mitte: [0, 0, 0] });
      M.flaeche(Object.assign({ name: "h-rad", o: [XK1 - 0.1, -RR - 0.2, RZ + RR + 0.2], u: [1, 0, 0], v: [0, 0, -1], w: XK4 - XK1 + 0.2, h: RR * 2 + 0.3 }, LEER));
      M.flaeche(Object.assign({ name: "h-rad2", o: [XK1 - 0.1, RR + 0.2, RZ + RR + 0.2], u: [0, -1, 0], v: [0, 0, -1], w: 2 * RR + 0.4, h: RR * 2 + 0.3 }, LEER));
      /* Vor dem Haus */
      if (Z.deko) {
        pflasterBauen(M, S, Z);
        muehlsteinBauen(M, S, Z);
        bankBauen(M, S, Z);
        wagenBauen(M, S, Z);
        holzstapelBauen(M, S, Z);
        aufzugBauen(M, S, Z);
        if (winter) christbaumBauen(M, S, Z);
      }
      /* Lichtpfützen vor Tür und Fenstern malt das Lebendige selbst – nur,
         wenn die Südseite zu sehen ist (der Kern würde sie sonst durch das
         Dach hindurch zeigen). Der Schein der Laterne kommt aus ihrer Wand. */
    }
  });

  /* Betonfundament mit Schalung (Bauphase) */
  function fundamentBauen(M, B, Z, Rg, bau, winter) {
    const zt = -Z.grubeT + (Z.grubeT) * glatt(Z.fundament);
    const fx0 = XW0 - 0.1, fx1 = XW1 + 0.1, fy = YW + 0.1;
    const beton = (g, F) => {
      g.save(); if (!lochClip(g, F, B, Rg)) { g.restore(); return; }
      const L = belichter(F, 0.03), w = F.w, h = F.h;
      if (Z.fundament < 0.5) { bretterMalen(g, F, 0, 0, w, h, [150, 118, 80], 5, { breite: 0.2 }); }
      else {
        g.fillStyle = L(bau < 0.11 ? [132, 132, 128] : [168, 166, 158]); g.fillRect(-0.05, -0.05, w + 0.1, h + 0.1);
        if (F.px > 8) {
          rausch(g, 0, 0, w, h, 1.1, 0.25, 40, 3);
          g.strokeStyle = L([120, 118, 112], 0.6); g.lineWidth = Math.max(0.005, 0.7 / F.px);
          for (let y = 0.2; y < h; y += 0.2) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
          for (let x = 0.5; x < w; x += 1.0) { g.fillStyle = L([70, 70, 68]); g.beginPath(); g.arc(x, h * 0.5, 0.012, 0, TAU); g.fill(); }
        }
      }
      g.restore();
    };
    const hF = zt + Z.grubeT;
    if (hF <= 0.02) return;
    const ex = { keinLicht: true, keinAo: true };
    wand(M, [fx0, fy, zt], [0, 1, 0], fx1 - fx0, hF, beton, Object.assign({ name: "f-s" }, ex));
    wand(M, [fx1, -fy, zt], [0, -1, 0], fx1 - fx0, hF, beton, Object.assign({ name: "f-n" }, ex));
    wand(M, [fx1, fy, zt], [1, 0, 0], 2 * fy, hF, beton, Object.assign({ name: "f-o" }, ex));
    wand(M, [fx0, -fy, zt], [-1, 0, 0], 2 * fy, hF, beton, Object.assign({ name: "f-w" }, ex));
    M.flaeche({ name: "f-t", o: [fx0, -fy, zt], u: [1, 0, 0], v: [0, 1, 0], w: fx1 - fx0, h: 2 * fy, ebene: 1, malen: (g, F) => {
      const w = F.w, h = F.h, nass = bau < 0.115;
      g.fillStyle = nass ? "rgb(112,114,116)" : "rgb(172,170,162)"; g.fillRect(-0.05, -0.05, w + 0.1, h + 0.1);
      if (F.px > 8) rausch(g, 0, 0, w, h, 0.9, 0.2, 31, 3);
      if (Z.fundament < 0.7) { g.strokeStyle = "rgb(96,64,44)"; g.lineWidth = 0.02; for (let x = 0.3; x < w; x += 0.3) { g.beginPath(); g.moveTo(x, 0.1); g.lineTo(x, h - 0.1); g.stroke(); } for (let y = 0.3; y < h; y += 0.3) { g.beginPath(); g.moveTo(0.1, y); g.lineTo(w - 0.1, y); g.stroke(); } }
      if (winter && !nass) { g.fillStyle = "rgba(240,244,250,0.5)"; g.fillRect(0, 0, w, h); }
    } });
  }

  /* Aushubhaufen */
  function aushubFigur(k, winter) {
    return function (g, s, F) {
      const b = 2.2 * s * Math.cbrt(Math.max(0.05, k)), h = 1.2 * s * ST.KZ * Math.cbrt(Math.max(0.05, k));
      g.beginPath(); g.moveTo(-b, 0); g.bezierCurveTo(-b * 0.6, -h * 0.9, b * 0.4, -h * 1.1, b, 0); g.closePath();
      if (F.schatten) { g.fillStyle = "#000"; g.fill(); return; }
      const FL = figurLicht(F);
      const gr = g.createLinearGradient(-b, -h, b, 0);
      gr.addColorStop(0, FL.lit([150, 112, 76], FL.lL)); gr.addColorStop(0.5, FL.lit([122, 90, 60], FL.lO)); gr.addColorStop(1, FL.lit([92, 66, 44], FL.lR));
      g.fillStyle = gr; g.fill();
      const rng = zufall(5);
      g.fillStyle = FL.lit([60, 44, 30], FL.lV, 0.6);
      g.beginPath(); for (let i = 0; i < 40; i++) { const x = (rng() - 0.5) * b * 1.6, y = -rng() * h * 0.7, r = Math.max(0.6, s * 0.03); g.moveTo(x + r, y); g.arc(x, y, r, 0, TAU); } g.fill();
      if (winter) { g.fillStyle = FL.lit([244, 247, 252], FL.lO, 0.85); g.beginPath(); g.moveTo(-b * 0.6, -h * 0.55); g.bezierCurveTo(-b * 0.3, -h * 1.0, b * 0.3, -h * 1.05, b * 0.6, -h * 0.5); g.bezierCurveTo(b * 0.2, -h * 0.7, -b * 0.2, -h * 0.72, -b * 0.6, -h * 0.55); g.fill(); }
    };
  }

  /* =====================================================================
     WINTERHAUSEN: die Mühle steht am Mühlbach (Kritik Runde 1: „der
     Untergraben endet blind, die Mühle steht irgendwo"). Das Dorf setzt
     sie nach (32,4 | −37,2); dieser Haken rückt sie danach an den Bach:
     Ostkante parallel zum Ufer, der Untergraben mündet genau ins Wasser,
     Teichdamm und Tosbecken bleiben auf dem Trockenen (gerechnet mit der
     Bachkurve aus dorf.js: Mündung 1,3 m von der Bachmitte, also im Wasser; die Ostkante liegt am Ufer).
     Was im Weg steht (Obstbäume, Tannen), wird geräumt; dazu ein Mühlweg
     von der Tür zur Hauptstraße. Mit ?mx=&my=&mg= lässt sich die Lage
     prüfen, ?muehle=0 lässt alles, wie das Dorf es setzt.
     ===================================================================== */
  (function dorfMuehle() {
    let q = null;
    try { q = new URLSearchParams(location.search); } catch (e) { return; }
    if (q && q.get("muehle") === "0") return;
    const MX = +(q.get("mx") || 32.2), MY = +(q.get("my") || -46.1), MG = +(q.get("mg") || 22);
    const inWelt = (x, y) => { const r = MG * RAD, c = Math.cos(r), sn = Math.sin(r), yy = y + DY; return [MX + x * c - yy * sn, MY + x * sn + yy * c]; };
    const altBoden = ST.dorfBoden;
    if (typeof altBoden === "function") {
      ST.dorfBoden = function () {
        altBoden.apply(this, arguments);
        /* Mühlweg: von der Tür (Pflaster) in einem Bogen zur Hauptstraße */
        const B = ST.boden;
        if (!B || !B.linie) return;
        const a = inWelt(-1.3, YG1 - 0.3), b = inWelt(-2.2, YG1 + 3);
        const pts = [[a[0], a[1]], [b[0], b[1]], [15, -31.5], [1.2, -27]];
        const kette = [];
        for (let i = 0; i + 1 < pts.length; i++) for (let k = 0; k < 8; k++) { const t = k / 8; kette.push([pts[i][0] + (pts[i + 1][0] - pts[i][0]) * t, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t]); }
        kette.push(pts[pts.length - 1]);
        B.linie(kette, 1.05, 0, 0.85);
      };
    }
    const alt = ST.dorfBauen;
    if (typeof alt !== "function") return;
    ST.dorfBauen = function () {
      alt.apply(this, arguments);
      const SZ = ST.szene;
      let m = SZ.objekte.find((o) => o.typ === "wassermuehle");
      if (!m) m = SZ.neu("wassermuehle", MX, MY, MG, { saat: 3 });
      m.x = MX; m.y = MY; m.gier = MG;
      /* was im Weg steht, räumen (Trennachsen-Test der Grundrisse) */
      const ecken = (typ, x, y, gier) => { const d = ST.MODELLE[typ]; const b = d.grund[0] / 2, t = d.grund[1] / 2, r = gier * RAD, c = Math.cos(r), sn = Math.sin(r); return [[-b, -t], [b, -t], [b, t], [-b, t]].map(([px, py]) => [x + px * c - py * sn, y + px * sn + py * c]); };
      const trennt = (A, Bq) => {
        for (const P of [A, Bq]) for (let i = 0; i < 4; i++) {
          const p = P[i], qq = P[(i + 1) % 4], nx = qq[1] - p[1], ny = p[0] - qq[0];
          let a0 = Infinity, a1 = -Infinity, b0 = Infinity, b1 = -Infinity;
          for (const v of A) { const d = v[0] * nx + v[1] * ny; a0 = Math.min(a0, d); a1 = Math.max(a1, d); }
          for (const v of Bq) { const d = v[0] * nx + v[1] * ny; b0 = Math.min(b0, d); b1 = Math.max(b1, d); }
          if (a1 <= b0 || b1 <= a0) return true;
        }
        return false;
      };
      const E = ecken("wassermuehle", MX, MY, MG);
      for (const o2 of SZ.objekte.slice()) {
        if (o2 === m || !ST.MODELLE[o2.typ]) continue;
        if (!trennt(E, ecken(o2.typ, o2.x, o2.y, o2.gier))) SZ.weg(o2);
      }
    };
  })();
})();
