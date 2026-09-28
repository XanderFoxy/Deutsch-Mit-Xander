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
   Ostgiebelseite ein oberschlächtiges Wasserrad; das Wasser kommt aus
   dem Stauwerk im Norden über ein hölzernes Gerinne auf Böcken und fällt
   knapp hinter dem Scheitel in die Zellen. Unter dem Rad die gemauerte
   Radgrube, aus der das Wasser durch einen Durchlass nach Osten abfließt.
   Das Rad steht an +x, damit man die Mühle an einen Bach stellen kann.

   MASSE (Meter, Mitte des Grundrisses = 0,0,0; x Osten, y Süden)
     Haus        10,5 × 8,0 m (x −7,0…3,5), Bruchstein bis 3,3 m,
                 Fachwerk-Obergeschoss bis 6,05 m, Traufe 6,25 m,
                 Dachneigung 50°, First 11,45 m, Krüppelwalm ab 9,3 m
     Wasserrad   Ø 5,0 m, lichte Breite 0,95 m, 36 Zellen, 2 × 8 Arme,
                 Welle (Eiche, achteckig) Ø 0,54 m, Mitte auf 2,62 m
     Gerinne     0,8 m breit, Boden auf 5,25 m, vom Stauwerk bis über den
                 Scheitel des Rades
     Radgrube    2,7 × 6,2 m, 1,1 m tief, Wasserspiegel 0,55 m unter Gelände

   WAS SICH DREHT, WIRD JEDES BILD GEMALT (M.lebendig): Rad, Welle,
   Wasser in Gerinne, Zellen und Grube. Was davor liegt (Haus, Lagerstein,
   Gerinne, Böcke, Stauwerk), wird als Umriss aus dem Malbereich
   ausgespart – so stimmt die Verdeckung in jedem Drehwinkel.
   Im Vorschaubild (ohne Objekt) und während des Baus steht das Rad still
   im Sprite.

   AUFBAU (o.bau): Schnurgerüst und Baugrube (Haus und Radgrube) →
   Betonfundament mit Schalung → Bruchsteinmauern Lage für Lage → Balken-
   lage → Fachwerk (Holz, dann Ausfachung) → offener Dachstuhl mit
   Richtbaum → Lattung, Eindecken Reihe für Reihe → Stauwerk, Böcke,
   Gerinne → Wasserrad (Welle, Arme, Kränze, Zellen) → Fenster, Türen,
   Schmuck → Wasser marsch.
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

  /* Wasserrad */
  const RX = 4.4, RZ = 2.62, RR = 2.5, RI = 2.12, RK0 = 2.0;
  const RB = 0.95, RKD = 0.07;
  const XK1 = RX - RB / 2 - RKD, XK2 = RX - RB / 2, XK3 = RX + RB / 2, XK4 = RX + RB / 2 + RKD;
  const NZ = 36, NA = 8, RW = 0.27;
  const X_LAGER = 5.25;                            // Stirnseite des Lagersteins
  /* Gerinne */
  const GX0 = 4.0, GX1 = 4.8, GW = 0.05;           // außen, Brettstärke
  const GZ0 = 5.2, GZB = 5.28, GZ1 = 5.72;         // Unterkante, Boden innen, Oberkante
  const GY0 = -5.8, GY1 = 0.35;                    // Anfang am Stauwerk, Ende über dem Rad
  const GZW = 5.5;                                 // Wasserspiegel im Gerinne
  /* Stauwerk */
  const SX0 = 3.4, SX1 = 5.4, SY0 = -7.6, SY1 = GY0, SZ1 = 5.95;
  /* Radgrube */
  const PX0 = XW1, PX1 = 6.2, PY0 = -3.1, PY1 = 3.1, PZB = -1.1, PZW = -0.55;
  const RAND_B = 0.34, RAND_H = 0.12;              // Randsteine
  /* Lagerstein */
  const LX0 = X_LAGER, LX1 = 6.05, LY = 0.46, LZ1 = RZ - RW - 0.02, LZB = RZ + 0.36;
  /* Böcke */
  const BOECKE = [-4.95, -3.45];
  const KONSOLE_Y = -1.5;
  /* Reihenfolge: Anbauten liegen weit außen (siehe Kopf) */
  const AUSSEN = 100;

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
    rausch(g, x, ob, w, y + h - ob, 0.7, 0.18, saat + 2, 3);
    const L = bruchLayout(saat, w, h);
    const eimer = new Map();
    const fein = px > 16;
    const oben = [], unten = [];
    g.save();
    g.translate(x, y);
    for (const s of L.steine) {
      if (opt.bis != null) {
        if (s.yb < h - opt.bis - 0.01) continue;
        if (s.yt < h - opt.bis - 0.01) {
          /* oberste Lage wird gerade gemauert: von links nach rechts */
          if (s.box[0] > w * (opt.lage == null ? 1 : opt.lage)) continue;
        }
      }
      const key = s.c * 3 + s.k;
      let e = eimer.get(key);
      if (!e) { e = []; eimer.set(key, e); }
      e.push(s);
    }
    for (const [key, liste] of eimer) {
      const c = hell(BS_FARBEN[(key / 3) | 0], (key % 3 - 1) * 0.08);
      g.fillStyle = rgb(c);
      g.beginPath();
      for (const s of liste) {
        if (fein) { const p = s.pts; g.moveTo(p[0][0], p[0][1]); for (let i = 1; i < p.length; i++) g.lineTo(p[i][0], p[i][1]); g.closePath(); }
        else g.rect(s.box[0], s.box[1], s.box[2] - s.box[0], s.box[3] - s.box[1]);
        if (fein) { oben.push(s); unten.push(s); }
      }
      g.fill();
      if (fein) {
        /* Wölbung: jeder Stein ist bossiert – hellerer Kern, zum Licht versetzt */
        g.fillStyle = rgb(hell(c, 0.07));
        g.beginPath();
        for (const s of liste) {
          const b = s.box, cx = (b[0] + b[2]) / 2 - 0.012, cy = (b[1] + b[3]) / 2 - 0.012, k = 0.62;
          const p = s.pts; g.moveTo(cx + (p[0][0] - cx) * k, cy + (p[0][1] - cy) * k);
          for (let i = 1; i < p.length; i++) g.lineTo(cx + (p[i][0] - cx) * k, cy + (p[i][1] - cy) * k);
          g.closePath();
        }
        g.fill();
      }
    }
    if (fein) {
      /* Relief: Lichtkante oben, Schattenfuge unten (der Mörtel liegt zurück) */
      const lichtKante = F.lichtN > 0.05 ? 0.3 : 0.14;
      g.lineWidth = Math.max(0.006, 1.1 / px);
      g.strokeStyle = "rgba(255,244,226," + lichtKante + ")";
      g.beginPath();
      for (const s of oben) { const p = s.pts; g.moveTo(p[14][0], p[14][1]); g.lineTo(p[15][0], p[15][1]); g.lineTo(p[16][0], p[16][1]); g.lineTo(p[0][0], p[0][1]); g.lineTo(p[1][0], p[1][1]); g.lineTo(p[2][0], p[2][1]); g.lineTo(p[3][0], p[3][1]); }
      g.stroke();
      g.strokeStyle = "rgba(40,28,22,0.42)";
      g.lineWidth = Math.max(0.008, 1.4 / px);
      g.beginPath();
      for (const s of unten) { const p = s.pts; g.moveTo(p[6][0], p[6][1]); for (let i = 7; i <= 13; i++) g.lineTo(p[i][0], p[i][1]); }
      g.stroke();
      if (px > 40) {
        /* Poren, Flechten, abgeplatzte Kanten */
        const rng = zufall(saat + 99);
        g.fillStyle = "rgba(60,44,36,0.25)";
        for (const s of oben) if (s.fl < 0.5) for (let i = 0; i < 3; i++) { const b = s.box; g.beginPath(); g.arc(b[0] + rng() * (b[2] - b[0]), b[1] + rng() * (b[3] - b[1]), 0.006 + rng() * 0.01, 0, TAU); g.fill(); }
      }
    }
    g.restore();
    rausch(g, x, ob, w, y + h - ob, 2.8, 0.14, saat + 5, 4);
    bleich(g, x, ob, w, y + h - ob, 2.2, 0.07, saat + 1);
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

  /* ---------------- Schnee und Eis ---------------- */
  function schneeFlaeche(g, F, x, y, w, h, saat) {
    const rng = zufall(saat * 131 + 7);
    const gr = g.createLinearGradient(0, y, 0, y + h);
    gr.addColorStop(0, "rgb(236,241,249)"); gr.addColorStop(1, "rgb(247,250,254)");
    g.fillStyle = gr; g.fillRect(x, y, w, h);
    /* Verwehungen: wenige große, weiche Mulden, dazu Rauschen */
    const n = Math.min(6, Math.round(w * h * 0.08) + 1);
    for (let i = 0; i < n; i++) {
      const cx = x + rng() * w, cy = y + rng() * h, rx = 0.8 + rng() * 1.6, ry = 0.15 + rng() * 0.25;
      const gg = g.createRadialGradient(cx, cy, 0, cx, cy, rx);
      gg.addColorStop(0, "rgba(165,185,222,0.13)"); gg.addColorStop(1, "rgba(165,185,222,0)");
      g.save(); g.translate(cx, cy); g.scale(1, ry / rx); g.fillStyle = gg; g.beginPath(); g.arc(0, 0, rx, 0, TAU); g.fill(); g.restore();
    }
    rausch(g, x, y, w, h, 2.4, 0.07, saat + 31, 3);
    if (F.px > 16) rausch(g, x, y, w, h, 0.5, 0.05, saat + 37, 2);
    if (F.px > 20) {
      /* Glitzer, in einem Pfad */
      g.fillStyle = "rgba(255,255,255,0.95)";
      g.beginPath();
      const k = Math.min(500, Math.round(w * h * 6));
      for (let i = 0; i < k; i++) { const r = (0.5 + rng() * 0.8) / F.px; g.rect(x + rng() * w, y + rng() * h, r, r); }
      g.fill();
    }
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
  function biberMalen(g, F, x0, x1, yTraufe, yOben, saat, opt) {
    opt = opt || {};
    const px = F.px, basis = opt.farbe || BIBER;
    const w = x1 - x0;
    g.fillStyle = rgb(hell(basis, -0.45)); g.fillRect(x0 - 0.05, yOben - 0.05, w + 0.1, yTraufe - yOben + 0.1);
    if (px * ZR_ < 2.6) {
      const rng = zufall(saat);
      for (let yy = yTraufe; yy > yOben - ZR_; yy -= ZR_) {
        g.fillStyle = rgb(PI.streu(basis, rng, 0.07)); g.fillRect(x0 - 0.05, yy - ZR_, w + 0.1, ZR_ * 0.8);
      }
      rausch(g, x0, yOben, w, yTraufe - yOben, 3.5, 0.22, saat + 5, 3);
      return;
    }
    const kante = px * ZB_ > 9;
    const NE = 6;
    for (let k = 0; ; k++) {
      const yu = yTraufe - k * ZR_;
      if (yu < yOben - 0.02) break;
      if (opt.bisReihe != null && k > opt.bisReihe) break;
      const rr = zufall(saat * 31 + k * 7919);
      const vers = (k % 2) * ZB_ / 2;
      const eimer = [];
      for (let i = 0; i < NE; i++) eimer.push([]);
      /* Schatten des Schwanzes auf die Reihe darunter (ein Pfad je Reihe) */
      g.fillStyle = "rgba(25,10,6,0.3)";
      g.beginPath();
      const xEnde = opt.teilReihe != null && k === opt.bisReihe ? x0 + w * opt.teilReihe : x1 + ZB_;
      for (let xx = x0 - ZB_ + vers - 0.02; xx < xEnde; xx += ZB_) {
        const b = ZB_ - 0.008, xa = xx + 0.004;
        g.moveTo(xa + 0.01, yu - ZR_); g.lineTo(xa + 0.01, yu - b * 0.45 + 0.018);
        g.quadraticCurveTo(xa + b / 2 + 0.01, yu + 0.022, xa + b + 0.01, yu - b * 0.45 + 0.018);
        g.lineTo(xa + b + 0.01, yu - ZR_); g.closePath();
        eimer[(rr() * NE) | 0].push(xa);
      }
      g.fill();
      for (let i = 0; i < NE; i++) {
        if (!eimer[i].length) continue;
        let c = hell(basis, (i - 2.5) * 0.045);
        if (i === 5) c = misch(c, [112, 106, 76], 0.3);
        g.fillStyle = rgb(c);
        g.beginPath();
        const b = ZB_ - 0.008, lang = 2.05 * ZR_;
        for (const xa of eimer[i]) {
          g.moveTo(xa, yu - lang); g.lineTo(xa, yu - b * 0.42);
          g.quadraticCurveTo(xa + b / 2, yu + 0.004, xa + b, yu - b * 0.42);
          g.lineTo(xa + b, yu - lang); g.closePath();
        }
        g.fill();
      }
      if (kante) {
        g.strokeStyle = "rgba(255,210,180,0.22)"; g.lineWidth = Math.max(0.004, 0.8 / px);
        g.beginPath();
        const b = ZB_ - 0.008;
        for (let xx = x0 - ZB_ + vers - 0.02; xx < xEnde; xx += ZB_) { const xa = xx + 0.004; g.moveTo(xa + 0.01, yu - b * 0.36); g.quadraticCurveTo(xa + b / 2, yu - 0.004, xa + b - 0.01, yu - b * 0.36); }
        g.stroke();
      }
      if (px * ZR_ > 5) {
        const gr = g.createLinearGradient(0, yu - ZR_ - 0.01, 0, yu - ZR_ + 0.05);
        gr.addColorStop(0, "rgba(30,12,8,0.26)"); gr.addColorStop(1, "rgba(30,12,8,0)");
        g.fillStyle = gr; g.fillRect(x0 - 0.05, yu - ZR_ - 0.01, w + 0.1, 0.06);
      }
    }
    rausch(g, x0, yOben, w, yTraufe - yOben, 4.2, 0.2, saat + 8, 4);
    bleich(g, x0, yOben, w, yTraufe - yOben, 3.1, 0.06, saat + 3);
  }
  /* Schneedecke auf dem Dach: geschlossen, mit Wellen quer (Ziegelreihen
     drücken durch), Verwehungen, Glitzer */
  function dachSchnee(g, F, x0, x1, yTraufe, yOben, saat, opt) {
    opt = opt || {};
    const w = x1 - x0, h = yTraufe - yOben, rng = zufall(saat * 7 + 3), px = F.px;
    schneeFlaeche(g, F, x0 - 0.1, yOben - 0.05, w + 0.2, h + 0.1, saat);
    if (px * ZR_ > 2.5) {
      /* die Ziegelreihen drücken sich als flache Wellen durch (ein Pfad) */
      g.fillStyle = "rgba(170,188,222,0.17)";
      g.beginPath();
      for (let yu = yTraufe - ZR_; yu > yOben + 0.1; yu -= ZR_) {
        let x = x0 - rng() * 0.3;
        while (x < x1) {
          const len = 0.3 + Math.pow(rng(), 1.5) * 2.2, gap = 0.05 + Math.pow(rng(), 2) * 0.6;
          const d = 0.015 + rng() * 0.03;
          g.rect(x, yu - d * 0.5, len, d);
          x += len + gap;
        }
      }
      g.fill();
    }
    /* am First dünner: die Firstziegel schauen durch */
    if (opt.first) {
      const gr = g.createLinearGradient(0, yOben, 0, yOben + 0.35);
      gr.addColorStop(0, "rgba(120,70,56,0.45)"); gr.addColorStop(1, "rgba(120,70,56,0)");
      g.fillStyle = gr; g.fillRect(x0, yOben, w, 0.35);
    }
    if (opt.kamin != null) {
      const gg = g.createRadialGradient(opt.kamin, yOben + 0.2, 0, opt.kamin, yOben + 0.2, 0.9);
      gg.addColorStop(0, "rgba(60,30,24,0.42)"); gg.addColorStop(1, "rgba(60,30,24,0)");
      g.fillStyle = gg; g.fillRect(opt.kamin - 0.9, yOben - 0.1, 1.8, 1.2);
    }
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

  /* Ein Wandmaler: Bruchstein unten, Fachwerk oben, Öffnungen, Schmuck */
  function wandMaler(W, B, S, Z) {
    return function (g, F) {
      const w = F.w, h = F.h, px = F.px, top = W.top;
      const yE = top - ZE;                         // Flächen-y der Oberkante Bruchstein
      const winter = S.winter;
      /* ---- Fachwerk (oben) ---- */
      if (Z.fw > 0) {
        const bisZ = Z.fwBis == null ? top : Z.fwBis;
        g.save();
        g.beginPath(); g.rect(-0.1, top - bisZ, w + 0.2, bisZ - ZE + 0.001); g.clip();
        const ausgefacht = Z.gefach;
        if (ausgefacht > 0) {
          const c = misch(LEHM, KALK, Z.kalk);
          gefachGrund(g, F, -0.05, -0.05, w + 0.1, yE + 0.06, c, W.saat);
          /* jedes Gefach einzeln verputzt: leicht andere Tönung */
          if (px > 8) {
            const rng = zufall(W.saat * 5);
            for (let i = 0; i < 30; i++) { g.fillStyle = "rgba(" + (rng() < 0.5 ? "120,100,70" : "255,250,240") + "," + (0.03 + rng() * 0.04).toFixed(3) + ")"; g.fillRect(rng() * w, rng() * yE, 0.6 + rng() * 1.2, 0.5 + rng() * 1.0); }
          }
        } else {
          /* offenes Gerippe: dahinter dunkler Rohbau */
          g.fillStyle = "rgb(40,34,30)"; g.fillRect(-0.05, -0.05, w + 0.1, yE + 0.06);
        }
        /* Fenster im Fachwerk */
        const alleF = W.fw.F.concat(W.giebel ? W.giebel.F : []);
        for (let i = 0; i < alleF.length; i++) {
          const fe = alleF[i];
          const fy = top - fe.z - fe.h;
          if (fe.luke) { lukeMalen(g, F, B, fe.a, fy, fe.w, fe.h, S, Z); continue; }
          if (ausgefacht <= 0) continue;
          const fo = fensterArt(W, i, S, Z, false);
          fensterMalen(g, F, B, fe.a, fy, fe.w, fe.h, fo);
          if (!fo.leer && fo.laeden && px > 6) laedenMalen(g, F, fe.a, fy, fe.w, fe.h, fo.laeden, W.saat + i);
          if (!fo.leer && winter && px > 6) {
            /* Schnee auf dem Brustriegel und Tannengrün darauf */
            g.fillStyle = "rgb(244,247,252)"; PI.rundRechteck(g, fe.a - 0.04, fy + fe.h - 0.015, fe.w + 0.08, 0.05, 0.02); g.fill();
          }
          if (!fo.leer && !winter && S.blumen && px > 8 && (i + W.saat) % 2 === 0) blumenkastenMalen(g, F, fe.a, fy + fe.h, fe.w, W.saat + i);
        }
        hoelzerMalen(g, F, W.fw.H.concat(W.giebel ? W.giebel.H : []), top, Z.holzC, W.saat, { nur: Z.holzNur });
        if (W.fw && S.inschrift && W.name === "sued" && px > 30 && Z.fertig) {
          /* Inschrift im Rähm: „ANNO 1786" */
          g.fillStyle = "rgba(236,214,160,0.85)"; g.font = "0.1px Georgia, 'Times New Roman', serif"; g.textAlign = "center"; g.textBaseline = "middle";
          g.fillText("ANNO · 1786 · JOH · CONRAD · MÜLLER", w / 2, top - ZO + 0.09);
        }
        g.restore();
      }
      /* ---- Bruchstein (unten) ---- */
      const bisS = Z.mauerBis;
      if (bisS > 0) {
        bruchsteinMalen(g, F, 0, yE, w, ZE, { saat: W.saat, bis: Math.min(ZE, bisS), lage: Z.lage });
        /* Eckquader */
        eckquader(g, F, 0, yE, ZE, Math.min(ZE, bisS), false, W.saat);
        eckquader(g, F, w, yE, ZE, Math.min(ZE, bisS), true, W.saat + 1);
        /* Öffnungen im Erdgeschoss */
        for (let i = 0; i < (W.eg || []).length; i++) {
          const fe = W.eg[i];
          const fy = top - fe.z - fe.h;
          if (fe.z > bisS) continue;
          const fo = fensterArt(W, 100 + i, S, Z, true);
          fo.gitter = !fe.klein && W.name !== "west";
          fo.tiefe = 0.24;
          fo.fluegel = fe.klein ? 1 : 2; fo.sprossen = fe.klein ? [1, 2] : [1, 2];
          const hSicht = Math.min(fe.h, bisS - fe.z);
          g.save(); g.beginPath(); g.rect(-1, top - bisS, w + 2, bisS + 1); g.clip();
          if (Z.gewaende) gewaendeMalen(g, F, B, fe.a, fy, fe.w, fe.h, { winter: winter && Z.fertig });
          fensterMalen(g, F, B, fe.a, fy, fe.w, fe.h, fo);
          g.restore();
          void hSicht;
        }
        if (W.tuer) {
          const T = W.tuer, ty = top - T.h;
          g.save(); g.beginPath(); g.rect(-1, top - bisS, w + 2, bisS + 1); g.clip();
          tuerMalen(g, F, B, T.a, ty, T.w, T.h, { bogen: T.bogen, jahr: T.jahr, leer: !Z.tueren, kranz: W.name === "sued", girlande: W.name === "sued", farbe: W.name === "sued" ? "#5a3620" : "#4e3524" }, S);
          g.restore();
        }
        if (W.welle && bisS > RZ - 0.5) welleLoch(g, F, B, top, winter);
        /* Sockel: Spritzwasser, Moos, Schneewehe an der Wand */
        const gr = g.createLinearGradient(0, h, 0, h - 0.7);
        gr.addColorStop(0, S.winter ? "rgba(60,64,80,0.25)" : "rgba(64,70,40,0.32)"); gr.addColorStop(1, "rgba(60,64,60,0)");
        g.fillStyle = gr; g.fillRect(0, h - 0.7, w, 0.7);
        if (winter && Z.fertig) schneeWehe(g, F, w, h, W.saat, W.tuer ? [W.tuer.a - 0.3, W.tuer.a + W.tuer.w + 0.3] : null);
      }
      /* Schatten des Ortgangs auf dem Giebel */
      if (W.giebel && Z.dach) {
        const sv = F.schatten(OGV);
        if (sv) {
          g.fillStyle = "rgba(30,34,60,0.28)";
          const U = giebelUmriss(top);
          g.beginPath();
          g.moveTo(U[0][0] - 1, U[0][1]); g.lineTo(U[1][0], U[1][1]); g.lineTo(U[2][0], U[2][1]); g.lineTo(U[3][0] + 1, U[3][1]);
          g.lineTo(U[3][0] + 1 + sv[0], U[3][1] + sv[1] + 0.12); g.lineTo(U[2][0] + sv[0], U[2][1] + sv[1] + 0.12); g.lineTo(U[1][0] + sv[0], U[1][1] + sv[1] + 0.12); g.lineTo(U[0][0] - 1 + sv[0], U[0][1] + sv[1] + 0.12);
          g.closePath(); g.fill();
        }
      }
    };
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
  function dachBauen(M, S, Z, B) {
    const winter = S.winter;
    const cosN = Math.cos(NEIG), cosW = Math.cos(WNEIG);
    const wS = XWE1 - XWE0, hS = YTE / cosN;
    const bW = YWE / cosN;                                    // Flächen-y der Walmtraufe
    const umrS = [[XF0 - XWE0, 0], [XF1 - XWE0, 0], [wS, bW], [wS, hS], [0, hS], [0, bW]];
    const kaminA = S.kaminX - XWE0;
    const reihen = Z.dachReihen;                              // null = ganz gedeckt
    const dachMal = (seite) => function (g, F) {
      if (reihen === 0) return latten(g, F, 0, wS, hS);
      if (reihen != null) {
        latten(g, F, 0, wS, hS);
        biberMalen(g, F, 0, wS, hS, 0, S.saat + seite, { bisReihe: reihen, teilReihe: Z.dachTeil });
        return;
      }
      if (winter) {
        dachSchnee(g, F, -0.05, wS + 0.05, hS, 0, S.saat + seite, { first: true, kamin: seite === 0 ? null : null });
        firstZiegel(g, F, 0, wS, true);
      } else {
        biberMalen(g, F, -0.05, wS + 0.05, hS, 0, S.saat + seite, {});
        firstZiegel(g, F, XF0 - XWE0, XF1 - XWE0, false);
        gratZiegel(g, F, [[XF1 - XWE0, 0], [wS, bW]], false);
        gratZiegel(g, F, [[XF0 - XWE0, 0], [0, bW]], false);
      }
      void kaminA;
    };
    const walmMal = (g, F) => {
      const w = F.w, h = F.h;
      if (reihen === 0) return latten(g, F, 0, w, h);
      if (reihen != null) { latten(g, F, 0, w, h); biberMalen(g, F, 0, w, h, 0, S.saat + 7, { bisReihe: reihen, teilReihe: Z.dachTeil }); return; }
      if (winter) dachSchnee(g, F, -0.05, w + 0.05, h, 0, S.saat + 9, {});
      else biberMalen(g, F, -0.05, w + 0.05, h, 0, S.saat + 9, {});
    };
    M.teil("dach", { mitte: [HAUS_M[0], 0, HAUS_M[2] + 10] });
    const vS = [0, cosN, -Math.sin(NEIG)], vN = [0, -cosN, -Math.sin(NEIG)];
    M.flaeche({ name: "dach-s", o: [XWE0, 0, ZF], u: [1, 0, 0], v: vS, w: wS, h: hS, umriss: umrS, malen: dachMal(0) });
    M.flaeche({ name: "dach-n", o: [XWE1, 0, ZF], u: [-1, 0, 0], v: vN, w: wS, h: hS, umriss: umrS, malen: dachMal(1) });
    const hW = (XWE1 - XF1) / cosW;
    M.flaeche({ name: "walm-o", o: [XF1, YWE, ZF], u: [0, -1, 0], v: [cosW, 0, -Math.sin(WNEIG)], w: 2 * YWE, h: hW, umriss: [[YWE, 0], [2 * YWE, hW], [0, hW]], malen: walmMal });
    M.flaeche({ name: "walm-w", o: [XF0, -YWE, ZF], u: [0, 1, 0], v: [-cosW, 0, -Math.sin(WNEIG)], w: 2 * YWE, h: hW, umriss: [[YWE, 0], [2 * YWE, hW], [0, hW]], malen: walmMal });
    /* Kanten: Traufbretter, Ortgangbretter, Walmtraufbretter */
    const brett = (g, F) => { holzMalen(g, F, -0.02, -0.02, F.w + 0.04, F.h + 0.04, [118, 84, 58], 71, { ohneAst: true }); if (winter) { g.fillStyle = "rgb(242,246,252)"; g.fillRect(-0.02, -0.02, F.w + 0.04, 0.05); } };
    const db = 0.24;
    M.flaeche({ name: "traufe-s", o: [XWE0, YTE, ZTE], u: [1, 0, 0], v: [0, 0, -1], w: wS, h: db, malen: brett, keinAo: true });
    M.flaeche({ name: "traufe-n", o: [XWE1, -YTE, ZTE], u: [-1, 0, 0], v: [0, 0, -1], w: wS, h: db, malen: brett, keinAo: true });
    for (const s of [1, -1]) {
      const xo = s > 0 ? XWE1 : XWE0;
      const u = s > 0 ? [0, -1, 0] : [0, 1, 0];
      /* Ortgang: Streifen entlang der Dachkante von der Traufe bis zur Walmtraufe (beide Seiten) */
      const ly = YTE - YWE, lz = ZWE - ZTE;
      for (const t of [1, -1]) {
        /* t = +1: Südseite, −1: Nordseite (von außen gesehen links/rechts je nach s) */
        const yA = t * YTE, yB = t * YWE;
        const links = (s > 0) === (t > 0);   // liegt die Traufe links?
        const a0 = links ? yA : yB, a1 = links ? yB : yA;
        const z0 = links ? ZTE : ZWE, z1 = links ? ZWE : ZTE;
        const oy = s > 0 ? Math.max(a0, a1) : Math.min(a0, a1);
        const w = ly;
        const ztop = Math.max(z0, z1);
        const um = links ? [[0, ztop - z0], [w, ztop - z1], [w, ztop - z1 + db], [0, ztop - z0 + db]] : [[0, ztop - z0], [w, ztop - z1], [w, ztop - z1 + db], [0, ztop - z0 + db]];
        M.flaeche({ name: "ort" + s + t, o: [xo, oy, ztop], u: u, v: [0, 0, -1], w: w, h: lz + db, umriss: um, malen: brett, keinAo: true });
        void a1; void z1;
      }
      M.flaeche({ name: "walmtraufe" + s, o: [xo, s > 0 ? YWE : -YWE, ZWE], u: u, v: [0, 0, -1], w: 2 * YWE, h: db, malen: brett, keinAo: true });
    }
    /* Dachrinnen an beiden Traufen */
    for (const t of [1, -1]) {
      M.teil("rinne" + t, { schatten: false, mitte: [HAUS_M[0], t * 20, HAUS_M[2] + 10] });
      const y = t * (YTE + 0.09);
      M.flaeche({ name: "rinne" + t, o: t > 0 ? [XWE0 - 0.05, y, ZTE - 0.05] : [XWE1 + 0.05, y, ZTE - 0.05], u: [t, 0, 0], v: [0, 0, -1], w: wS + 0.1, h: 0.14, malen: rinneMal(winter, S.saat + t), keinAo: true });
      if (winter) {
        /* Schneewechte und Eiszapfen */
        M.flaeche({ name: "wechte" + t, o: t > 0 ? [XWE0 - 0.08, y + 0.08, ZTE + 0.2] : [XWE1 + 0.08, y - 0.08, ZTE + 0.2], u: [t, 0, 0], v: [0, 0, -1], w: wS + 0.16, h: 0.34, malen: wechteMal(S.saat + t * 3), keinLicht: true, keinAo: true });
        M.flaeche({ name: "zapfen" + t, o: t > 0 ? [XWE0, y + 0.02, ZTE - 0.18] : [XWE1, y - 0.02, ZTE - 0.18], u: [t, 0, 0], v: [0, 0, -1], w: wS, h: 0.7, malen: zapfenMal(S.saat + t * 5, 0.6), keinLicht: true, keinAo: true });
      }
    }
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
  function wechteMal(saat) {
    return function (g, F) {
      const w = F.w, L = belichter(F, 0.06), rng = zufall(saat);
      const unten = (x) => 0.22 + Math.sin(x * 2.1 + saat) * 0.04 + Math.sin(x * 5.3 + saat * 3) * 0.02;
      g.beginPath(); g.moveTo(-0.02, 0.02); g.lineTo(w + 0.02, 0.02);
      for (let x = w; x >= -0.02; x -= 0.12) g.lineTo(x, unten(x));
      g.closePath();
      const gr = g.createLinearGradient(0, 0, 0, 0.3);
      gr.addColorStop(0, L([248, 250, 254])); gr.addColorStop(0.5, L([240, 244, 251])); gr.addColorStop(1, L([196, 208, 230]));
      g.fillStyle = gr; g.fill();
      if (F.px > 18) { g.fillStyle = L([255, 255, 255], 0.9); for (let i = 0; i < w * 30; i++) { const r = (0.6 + rng()) / F.px; g.fillRect(rng() * w, 0.03 + rng() * 0.15, r, r); } }
    };
  }
  function zapfenMal(saat, maxL) {
    return function (g, F) { eiszapfenMalen(g, F, 0.1, F.w - 0.1, 0, maxL, saat, belichter(F, 0.15)); };
  }

  /* =====================================================================
     DAS WASSERRAD
     Ansicht A: p(x,y,z) → Bildpunkt, E (Blickrichtung im Modell), c/sn
     (Drehung), Z (Tageszeit), jahr, s (Pixel je Meter).
     Gemalt wird mit eigener Tiefenordnung (hinten zuerst):
       Welle hinten → Kranz hinten → Arme hinten → Radboden innen →
       Welle Mitte → Zellen, Radboden außen, Wasser (nach Tiefe) →
       Kranz vorn → Arme vorn mit Nabe → Welle vorn
     Das gilt für jede Drehung, weil „hinten" und „vorn" aus E kommen.
     ===================================================================== */
  function ansichtFigur(s, gier, Zt, jahr) {
    const r = gier * RAD, c = Math.cos(r), sn = Math.sin(r);
    return {
      s: s, c: c, sn: sn, Z: Zt, jahr: jahr, E: [0.6124 * (c + sn), 0.6124 * (c - sn), 0.5],
      p(x, y, z) { const a = x * c - y * sn, b = x * sn + y * c; return [(a - b) * ST.KX * s, (a + b) * ST.KY * s - z * ST.KZ * s]; }
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
  const radHolz = (winter) => (winter ? misch(HOLZ_ALT, [192, 204, 222], 0.2) : HOLZ_ALT);

  function radMalen(g, A, phi, o) {
    const E = A.E, sg = E[0] >= 0 ? 1 : -1;
    const bau = o.bau == null ? 1 : o.bau;
    const holz = radHolz(o.winter);
    const tWelle = phase(bau, 0, 0.12), tArme = phase(bau, 0.1, 0.4), tKranz = phase(bau, 0.35, 0.65), tZellen = phase(bau, 0.6, 1);
    /* Welle: vom Haus (XW1) bis zum Lagerstein (X_LAGER) */
    const xFern = sg > 0 ? XW1 : X_LAGER, xNah = sg > 0 ? X_LAGER : XW1;
    const armeHa = sg > 0 ? XK1 - 0.03 : XK4 + 0.03, armeHi = sg > 0 ? XK2 + 0.04 : XK3 - 0.04;   // hintere Arme: außen / innen
    const armeVi = sg > 0 ? XK3 - 0.04 : XK2 + 0.04, armeVa = sg > 0 ? XK4 + 0.03 : XK1 - 0.03;   // vordere Arme
    if (tWelle > 0) {
      const xe = xFern + (xNah - xFern) * tWelle;
      welleMalen(g, A, phi, xFern, sg > 0 ? Math.min(xe, armeHa) : Math.max(xe, armeHa), holz);
    }
    if (tKranz > 0) radKranzMalen(g, A, sg > 0 ? XK1 : XK4, sg > 0 ? XK2 : XK3, phi, holz, tKranz, o, false);
    if (tArme > 0) armeMalen(g, A, armeHa, armeHi, phi, holz, tArme, o, false);
    if (tZellen > 0) bodenInnen(g, A, phi, holz, tZellen);
    if (tWelle > 0 && tWelle * (xNah - xFern) * sg > (armeHa - xFern) * sg) welleMalen(g, A, phi, armeHa, sg > 0 ? Math.min(xFern + (xNah - xFern) * tWelle, armeVa) : Math.max(xFern + (xNah - xFern) * tWelle, armeVa), holz);
    if (tZellen > 0) bandMalen(g, A, phi, holz, tZellen, o);
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
      /* Maserung in Bögen, Nässe unten, Stöße der Felgen, Eisenlaschen */
      g.lineWidth = Math.max(0.004, 0.9 / px);
      const rng = zufall(vorn ? 31 : 37);
      for (let i = 0; i < 7; i++) {
        const r = RK0 + (RR - RK0) * (0.1 + 0.8 * i / 6);
        g.strokeStyle = lit(hell(holz, -0.35), 0.28);
        for (let k = 0; k < 8; k++) { const w0 = phi + k * TAU / 8 + rng() * 0.3, w1 = w0 + 0.4 + rng() * 0.3; g.beginPath(); g.arc(0, 0, r + (rng() - 0.5) * 0.02, w0, w1); g.stroke(); }
      }
      /* jede Felge ein wenig anders im Ton */
      for (let k = 0; k < 8; k++) {
        const w0 = phi + (k - 0.5) * TAU / 8, w1 = w0 + TAU / 8;
        g.fillStyle = k % 3 === 0 ? "rgba(255,240,220,0.06)" : k % 3 === 1 ? "rgba(30,18,10,0.08)" : "rgba(60,40,20,0.04)";
        ringPfad(g, RK0, RR + 0.015, w0, w1); g.fill();
      }
      /* Zellenwände zeichnen sich außen als Nagelreihen ab */
      if (px > 22) {
        g.strokeStyle = lit(hell(holz, -0.45), 0.22); g.lineWidth = Math.max(0.004, 0.8 / px);
        g.fillStyle = lit([34, 30, 28], 0.8);
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
        if (naegel.length) { g.beginPath(); for (const [x, y] of naegel) { g.moveTo(x + 0.012, y); g.arc(x, y, 0.012, 0, TAU); } g.fill(); }
      }
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
        /* Raureif und Eispanzer am Außenrand */
        /* belichtet – sonst leuchtet der Reif nachts wie ein Ring */
        g.strokeStyle = lit([236, 244, 255], 0.75); g.lineWidth = 0.06;
        g.beginPath(); g.arc(0, 0, RR - 0.02, a0, a1); g.stroke();
        g.fillStyle = lit([240, 246, 255], 0.55);
        g.beginPath();
        for (let i = 0; i < 90; i++) { const w = a0 + rng() * (a1 - a0), r = RR - rng() * 0.3, rr = 0.008 + rng() * 0.015; g.moveTo(Math.cos(w) * r + rr, Math.sin(w) * r); g.arc(Math.cos(w) * r, Math.sin(w) * r, rr, 0, TAU); }
        g.fill();
      }
      g.restore();
      /* Lichtkante außen oben */
      g.strokeStyle = lit(hell(holz, 0.35), 0.5); g.lineWidth = Math.max(0.006, 1 / px);
      g.beginPath(); g.arc(0, 0, RR + 0.01, Math.max(a0, 0.3), Math.min(a1, Math.PI - 0.3)); g.stroke();
    }
    g.restore();
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
      g.fillStyle = lit(hell(holz, (k % 3) * 0.03));
      g.fillRect(rA, -b / 2, rE - rA, b);
      if (px > 16) {
        g.strokeStyle = lit(hell(holz, -0.4), 0.35); g.lineWidth = Math.max(0.004, 0.9 / px);
        g.beginPath(); for (const yy of [-0.04, 0.0, 0.035]) { g.moveTo(rA, yy); g.lineTo(rE, yy + 0.005); } g.stroke();
        g.fillStyle = lit(EISEN); g.fillRect(RK0 - 0.1, -b / 2 - 0.01, 0.07, b + 0.02);
        g.fillStyle = lit([255, 255, 255], 0.1); g.fillRect(rA, -b / 2, rE - rA, 0.02);
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
  function bodenInnen(g, A, phi, holz, t) {
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
    for (const e of L) {
      g.fillStyle = farbeA(A, hell(holz, -0.5), e.nn);
      pfad3(g, A, [radPunkt(XK2, RI, e.w0), radPunkt(XK3, RI, e.w0), radPunkt(XK3, RI, e.w0 + dA), radPunkt(XK2, RI, e.w0 + dA)]); g.fill();
    }
  }
  /* Zellen: Radboden außen, Zellenwände (Stoß- und Kropfbrett), Wasser */
  const Z_DELTA = 0.13, Z_KNICK = 0.16;
  function zellenWand(w) { return [[RI, w], [RI + Z_KNICK, w], [RR, w + Z_DELTA]]; }
  function yzVon(r, w) { return [r * Math.cos(w), RZ + r * Math.sin(w)]; }
  function wasserInZelle(phi, k) {
    /* Füllung aus der Lage: gefüllt, nachdem die Zelle unter dem Strahl
       durch ist (φ ≈ 80°), ausgießend, sobald die Mündung kippt */
    const dA = TAU / NZ, w0 = phi + k * dA, w1 = w0 + dA;
    let wm = ((w0 + dA / 2) % TAU + TAU) % TAU; if (wm > Math.PI) wm -= TAU;
    const grad = wm / RAD;
    if (grad > 96 || grad < -110) return null;
    const f = klemm((86 - grad) / 16, 0, 1);
    if (f <= 0.02) return null;
    const P = [yzVon(RI, w0), yzVon(RI + Z_KNICK, w0), yzVon(RR, w0 + Z_DELTA), yzVon(RR, w1 + Z_DELTA), yzVon(RI + Z_KNICK, w1), yzVon(RI, w1)];
    let zmin = Infinity; for (const p of P) zmin = Math.min(zmin, p[1]);
    const lippe = Math.min(P[2][1], P[3][1]);
    const pegel = Math.min(lippe - 0.01, zmin + 0.3 * f);
    if (pegel <= zmin + 0.01) return null;
    /* Schnitt der Waagerechten mit dem Sechseck */
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
      /* Radboden außen */
      if (rd > 0) {
        const pts = [radPunkt(XK2, RI, w0), radPunkt(XK3, RI, w0), radPunkt(XK3, RI, w0 + dA), radPunkt(XK2, RI, w0 + dA)];
        els.push({ d: tiefe(radPunkt(RX, RI, wm)), art: 0, pts: pts, n: rad });
      }
      /* Zellenwand k in zwei Stücken */
      const Wd = zellenWand(w0);
      for (let s = 0; s < 2; s++) {
        const [r0, a0] = Wd[s], [r1, a1] = Wd[s + 1];
        const p0 = yzVon(r0, a0), p1 = yzVon(r1, a1);
        const dy = p1[0] - p0[0], dz = p1[1] - p0[1];
        let nn = nrm([0, -dz, dy]); if (dot(nn, E) < 0) nn = mul(nn, -1);
        const pts = [[XK2, p0[0], p0[1]], [XK3, p0[0], p0[1]], [XK3, p1[0], p1[1]], [XK2, p1[0], p1[1]]];
        els.push({ d: tiefe([RX, (p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2]) + 0.001, art: 1, pts: pts, n: nn, s: s });
      }
      /* Wasser in der Zelle */
      if (o.wasser) {
        const W = wasserInZelle(phi, k);
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
      else {
        const w = o.winter ? [150, 176, 196] : [104, 142, 160];
        g.fillStyle = farbeA(A, w, [0, 0, 1], 0.92);
      }
      pfad3(g, A, e.pts); g.fill();
      if (e.art === 1 && A.s > 18) {
        /* helle Brettkante außen */
        const q0 = A.p(...e.pts[2]), q1 = A.p(...e.pts[3]);
        if (e.s) { g.strokeStyle = farbeA(A, hell(holz, 0.25), [0, 0, 1], 0.6); g.lineWidth = Math.max(0.6, A.s * 0.012); g.beginPath(); g.moveTo(q0[0], q0[1]); g.lineTo(q1[0], q1[1]); g.stroke(); }
      }
      if (e.art === 2 && A.s > 10) {
        /* Glanz und Schaum im frisch gefüllten Kasten */
        const q = e.pts.map((p) => A.p(...p));
        const schaum = e.W.grad > 55 ? 0.55 : 0.15;
        g.strokeStyle = weissA(A, [255, 255, 255], schaum); g.lineWidth = Math.max(0.6, A.s * 0.02);
        g.beginPath(); g.moveTo(q[0][0], q[0][1]); g.lineTo(q[1][0], q[1][1]); g.stroke();
      }
    }
  }

  /* ---------------- Wasser: Strahl, Vorhang, Grube, Gerinne ---------------- */
  const WASSER_T = [118, 150, 168];
  function strahlMalen(g, A, t, o) {
    /* aus dem Gerinne über die Lippe auf den Scheitel (knapp dahinter):
       eine glasige Zunge, oben glatt, unten aufgeraut */
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
    /* Rückseite (dicker Strahl: Ober- und Unterkante als Fläche) */
    const O = rand(xa, 0), U = rand(xb, 0), O2 = rand(xa, 0.05), U2 = rand(xb, 0.05);
    const band = (P, Q) => { g.beginPath(); P.forEach((q, i) => (i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]))); for (let i = Q.length - 1; i >= 0; i--) g.lineTo(Q[i][0], Q[i][1]); g.closePath(); };
    band(O2, U2); g.fillStyle = farbeA(A, [96, 132, 150], [0, 1, 0.2], 0.55); g.fill();
    band(O, U); g.fillStyle = farbeA(A, [168, 204, 222], [0, 0.5, 1], 0.72); g.fill();
    g.save(); band(O, U); g.clip();
    g.lineWidth = Math.max(0.5, A.s * 0.012); g.setLineDash([A.s * 0.06, A.s * 0.05]); g.lineDashOffset = -t * A.s * 2.4;
    for (let i = 0; i < 7; i++) {
      const Q = rand(xa + (xb - xa) * (i + 0.5) / 7, 0.01);
      g.strokeStyle = weissA(A, [255, 255, 255], (0.25 + 0.25 * ((i * 5) % 3) / 2).toFixed(2));
      g.beginPath(); Q.forEach((q, j) => (j ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]))); g.stroke();
    }
    g.restore();
    /* Glanzlinie auf der Lippe */
    const l0 = A.p(xa, y0, z0 + 0.01), l1 = A.p(xb, y0, z0 + 0.01);
    g.strokeStyle = weissA(A, [255, 255, 255], 0.75); g.lineWidth = Math.max(0.8, A.s * 0.02);
    g.beginPath(); g.moveTo(l0[0], l0[1]); g.lineTo(l1[0], l1[1]); g.stroke();
    /* Gischt am Aufschlag */
    const e = pts[pts.length - 1];
    const c = A.p(RX, e[0] + 0.08, e[1] + 0.05);
    const r = A.s * (o.winter ? 0.26 : 0.46);
    const gg = g.createRadialGradient(c[0], c[1], 0, c[0], c[1], r);
    gg.addColorStop(0, weissA(A, [255, 255, 255], 0.55)); gg.addColorStop(0.5, weissA(A, [236, 246, 252], 0.2)); gg.addColorStop(1, weissA(A, [255, 255, 255], 0));
    g.fillStyle = gg; g.fillRect(c[0] - r, c[1] - r, 2 * r, 2 * r);
    g.fillStyle = weissA(A, [255, 255, 255], 0.8);
    g.beginPath();
    for (let i = 0; i < 16; i++) {
      const ph = (t * 1.6 + i * 0.137) % 1;
      const x = xa + (xb - xa) * ((i * 0.618) % 1);
      const q = A.p(x, e[0] + 0.05 + ph * 0.3, e[1] + Math.sin(ph * Math.PI) * 0.16);
      const rr = Math.max(0.5, A.s * 0.009 * (1 - ph));
      g.moveTo(q[0] + rr, q[1]); g.arc(q[0], q[1], rr, 0, TAU);
    }
    g.fill();
  }
  /* Wasser, das unten aus den kippenden Zellen in die Grube fällt:
     durchscheinende Schleier, oben geschlossen, unten zerstäubt */
  const VORHANG = [-24, -36, -48, -60, -72];
  function vorhangMalen(g, A, t, o, oberirdisch) {
    const winkel = o.winter ? [-30, -50] : VORHANG;
    for (let i = 0; i < winkel.length; i++) {
      const w = winkel[i] * RAD;
      const y0 = (RR + 0.01) * Math.cos(w), z0 = RZ + (RR + 0.01) * Math.sin(w);
      const zU = oberirdisch ? 0 : PZW, zO = oberirdisch ? z0 : Math.min(0, z0);
      if (zO <= zU) continue;
      const bahn = (zz) => y0 + 0.04 + Math.sqrt(Math.max(0, z0 - zz)) * 0.2;
      const pts = [];
      for (let k = 0; k <= 8; k++) { const zz = zO - (zO - zU) * k / 8; pts.push([bahn(zz), zz]); }
      const br = (o.winter ? 0.3 : 0.62) * (1 - i * 0.07);
      const xa = RX - br / 2 + ((i * 0.37) % 0.2) - 0.1, xb = xa + br;
      const L = pts.map((p) => A.p(xa, p[0], p[1])), R = pts.map((p) => A.p(xb, p[0], p[1]));
      g.beginPath(); L.forEach((q, j) => (j ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]))); for (let j = R.length - 1; j >= 0; j--) g.lineTo(R[j][0], R[j][1]); g.closePath();
      const oben = A.p(RX, bahn(z0), z0), unten = A.p(RX, bahn(PZW), PZW);
      const gr = g.createLinearGradient(oben[0], oben[1], unten[0], unten[1]);
      const lf = lichtA(A, [0, 1, 0.3]);
      const c = (a) => "rgba(" + [214, 232, 242].map((v, k) => Math.round(v * Math.min(1, lf[k] + 0.25))).join(",") + "," + a + ")";
      gr.addColorStop(0, c(0.42 - i * 0.03)); gr.addColorStop(0.6, c(0.24)); gr.addColorStop(1, c(0.1));
      g.fillStyle = gr; g.fill();
      g.save(); g.clip();
      g.lineWidth = Math.max(0.5, A.s * 0.009); g.setLineDash([A.s * 0.14, A.s * 0.1]); g.lineDashOffset = -t * A.s * 3.2 - i * 11;
      g.strokeStyle = weissA(A, [255, 255, 255], 0.3);
      g.beginPath();
      for (let j = 0; j < 4; j++) {
        const x = xa + (xb - xa) * (j + 0.5) / 4;
        pts.forEach((p, k) => { const q = A.p(x, p[0], p[1]); if (k) g.lineTo(q[0], q[1]); else g.moveTo(q[0], q[1]); });
      }
      g.stroke();
      g.restore();
    }
  }
  /* Wasserspiegel der Radgrube: dunkles Mühlwasser, Himmel spiegelt sich,
     Schaum treibt vom Rad zum Durchlass in der Ostwand */
  function grubeWasserMalen(g, A, t, o, statisch) {
    const z = PZW, px = A.s;
    pfad3(g, A, [[PX0, PY0, z], [PX1, PY0, z], [PX1, PY1, z], [PX0, PY1, z]]);
    const nacht = A.Z.nacht;
    const grund = o.winter ? [70, 92, 104] : [44, 66, 62];
    g.fillStyle = farbeA(A, grund, [0, 0, 1]); g.fill();
    g.save(); g.clip();
    const p0 = A.p(PX0, PY0, z), p1 = A.p(PX1, PY1, z);
    const bx = Math.min(p0[0], p1[0]) - px * 4, by = Math.min(p0[1], p1[1]) - px * 4, bw = Math.abs(p1[0] - p0[0]) + px * 8, bh = Math.abs(p1[1] - p0[1]) + px * 8;
    /* Himmelsspiegel: heller Streifen quer, zu den Wänden hin dunkel */
    const gr = g.createLinearGradient(p0[0], p0[1], p1[0], p1[1]);
    gr.addColorStop(0, "rgba(10,18,20,0.45)"); gr.addColorStop(0.45, "rgba(196,214,232," + (0.22 * (1 - nacht)).toFixed(3) + ")"); gr.addColorStop(0.6, "rgba(196,214,232," + (0.12 * (1 - nacht)).toFixed(3) + ")"); gr.addColorStop(1, "rgba(10,18,20,0.4)");
    g.fillStyle = gr; g.fillRect(bx, by, bw, bh);
    if (!statisch) {
      /* Wellen: kurze helle Striche, die zum Durchlass ziehen */
      g.lineWidth = Math.max(0.5, px * 0.014);
      g.strokeStyle = weissA(A, [226, 238, 246], 0.28);
      g.beginPath();
      for (let i = 0; i < 22; i++) {
        const y = PY0 + 0.3 + (PY1 - PY0 - 0.6) * ((i * 0.618) % 1);
        const ph = (t * 0.3 + i * 0.173) % 1;
        const x0 = PX0 + 0.25 + ph * (PX1 - PX0 - 0.4);
        const yy = y * (1 - ph * 0.7);
        const a = A.p(x0, yy, z), b = A.p(x0 + 0.28, yy - yy * 0.06, z);
        g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]);
      }
      g.stroke();
      /* Schaum: weiche, fleckige Teppiche, wo der Schleier aufschlägt */
      const winkel = o.winter ? [-30, -50] : VORHANG;
      const rng = zufall(17);
      for (let i = 0; i < winkel.length; i++) {
        const yA = (RR + 0.01) * Math.cos(winkel[i] * RAD) + 0.3;
        for (let k = 0; k < 7; k++) {
          const ph = (t * 0.22 + k / 7 + i * 0.13) % 1;
          const x = RX + (rng() - 0.5) * 0.7 + ph * 1.1, y = yA + (rng() - 0.5) * 0.4 - ph * yA * 0.5;
          const c = A.p(x, y, z), r = px * (0.12 + rng() * 0.16) * (1 + ph);
          const gg = g.createRadialGradient(c[0], c[1], 0, c[0], c[1], r);
          gg.addColorStop(0, weissA(A, [244, 248, 252], (0.4 * (1 - ph)).toFixed(3))); gg.addColorStop(1, weissA(A, [244, 248, 252], 0));
          g.fillStyle = gg; g.save(); g.translate(c[0], c[1]); g.scale(1, 0.55); g.translate(-c[0], -c[1]); g.fillRect(c[0] - r, c[1] - r, 2 * r, 2 * r); g.restore();
        }
        /* Ringe */
        for (let k = 0; k < 2; k++) {
          const ph = (t * 0.9 + k / 2 + i * 0.21) % 1, r = 0.1 + ph * 0.45;
          const c = A.p(RX, yA, z), ex = A.p(RX + r, yA, z), ey = A.p(RX, yA + r, z);
          g.strokeStyle = weissA(A, [240, 248, 255], (0.3 * (1 - ph)).toFixed(3)); g.lineWidth = Math.max(0.5, px * 0.01);
          g.beginPath(); g.ellipse(c[0], c[1], Math.hypot(ex[0] - c[0], ex[1] - c[1]), Math.hypot(ey[0] - c[0], ey[1] - c[1]) * 0.9, Math.atan2(ex[1] - c[1], ex[0] - c[0]), 0, TAU); g.stroke();
        }
      }
      /* Sog vor dem Durchlass */
      const d = A.p(PX1 - 0.2, 0, z);
      const gd = g.createRadialGradient(d[0], d[1], 0, d[0], d[1], px * 0.6);
      gd.addColorStop(0, "rgba(10,16,18,0.5)"); gd.addColorStop(1, "rgba(10,16,18,0)");
      g.fillStyle = gd; g.fillRect(d[0] - px * 0.6, d[1] - px * 0.6, px * 1.2, px * 1.2);
    }
    /* Winter: Eisränder, nur die Mitte fließt offen */
    if (o.winter) {
      const rand = 0.6;
      g.fillStyle = farbeA(A, [214, 228, 240], [0, 0, 1], 0.92);
      for (const [a, b, c, d] of [[PX0, PY0, PX1, PY0 + rand], [PX0, PY1 - rand, PX1, PY1], [PX1 - 0.45, PY0, PX1, PY1], [PX0, PY0, PX0 + 0.35, PY1]]) {
        pfad3(g, A, [[a, b, z + 0.01], [c, b, z + 0.01], [c, d, z + 0.01], [a, d, z + 0.01]]); g.fill();
      }
      g.strokeStyle = weissA(A, [255, 255, 255], 0.55); g.lineWidth = Math.max(0.5, px * 0.012);
      const rng = zufall(4);
      g.beginPath();
      for (let i = 0; i < 10; i++) { const x = PX0 + rng() * (PX1 - PX0), y = rng() < 0.5 ? PY0 + rng() * rand : PY1 - rng() * rand; const a = A.p(x, y, z + 0.01), b = A.p(x + 0.3, y + (rng() - 0.5) * 0.3, z + 0.01); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); }
      g.stroke();
    }
    g.restore();
  }
  function gerinneWasserMalen(g, A, t, o, statisch) {
    const z = GZW, x0 = GX0 + GW, x1 = GX1 - GW;
    pfad3(g, A, [[x0, GY0, z], [x1, GY0, z], [x1, GY1, z], [x0, GY1, z]]);
    g.fillStyle = farbeA(A, o.winter ? [132, 156, 174] : WASSER_T, [0, 0, 1], 0.95); g.fill();
    if (statisch) return;
    g.save(); g.clip();
    g.lineWidth = Math.max(0.6, A.s * 0.016);
    for (let i = 0; i < 18; i++) {
      const x = x0 + 0.06 + (x1 - x0 - 0.12) * ((i * 0.618) % 1);
      const ph = (t * (o.winter ? 0.25 : 0.45) + i * 0.137) % 1;
      const y = GY0 + ph * (GY1 - GY0);
      const a = A.p(x, y, z), b = A.p(x, y + 0.45, z);
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
     „liegt vor dem Rad/vor dem Gerinnewasser" aus dem Blick.
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
  function verdeckerListe() {
    const V = [];
    V.push({ name: "haus", pts: HAUS_PUNKTE, rad: (E) => E[0] < 0, grube: () => true, gerinne: (E) => E[0] < 0, strahl: (E) => E[0] < 0 });
    V.push({ name: "lager", pts: kastenPunkte(LX0, -LY - 0.08, PZW, LX1 + 0.05, LY + 0.08, LZB + 0.12), rad: (E) => E[0] > 0, grube: () => true, gerinne: () => false, strahl: (E) => E[0] > 0 });
    V.push({ name: "gerinne", pts: kastenPunkte(GX0, GY0, GZ0, GX1, GY1, GZ1), rad: () => true, grube: () => true, gerinne: () => false, strahl: (E) => E[1] < 0 });
    V.push({ name: "konsole", pts: kastenPunkte(XW1, KONSOLE_Y - 0.09, GZ0 - 0.2, GX1 + 0.12, KONSOLE_Y + 0.09, GZ0), rad: () => true, grube: () => true, gerinne: () => false, strahl: () => false });
    for (const yb of BOECKE) V.push({ name: "bock", pts: kastenPunkte(GX0 - 0.35, yb - 0.12, 0, GX1 + 0.35, yb + 0.12, GZ0), rad: (E) => E[1] < 0, grube: () => true, gerinne: () => false, strahl: () => false });
    V.push({ name: "stauwerk", pts: kastenPunkte(SX0 - 0.1, SY0 - 0.1, 0, SX1 + 0.1, SY1 + 0.02, SZ1 + 1.5), rad: (E) => E[1] < 0, grube: () => true, gerinne: (E) => E[1] < 0, strahl: (E) => E[1] < 0 });
    V.push({ name: "rand-s", pts: kastenPunkte(PX0, PY1, 0, PX1 + RAND_B, PY1 + RAND_B, RAND_H + 0.1), rad: (E) => E[1] > 0, grube: () => true, gerinne: () => false, strahl: () => false });
    V.push({ name: "rand-n", pts: kastenPunkte(PX0, PY0 - RAND_B, 0, PX1 + RAND_B, PY0, RAND_H + 0.1), rad: (E) => E[1] < 0, grube: () => true, gerinne: () => false, strahl: () => false });
    V.push({ name: "rand-o", pts: kastenPunkte(PX1, PY0 - RAND_B, 0, PX1 + RAND_B, PY1 + RAND_B, RAND_H + 0.1), rad: (E) => E[0] > 0, grube: () => true, gerinne: () => false, strahl: () => false });
    return V;
  }
  const VERDECKER = verdeckerListe();
  /* Malbereich = alles außer den Umrissen der Verdecker, die vorn liegen */
  function aussparen(g, A, art, extra) {
    const W = g.canvas.width, H = g.canvas.height;
    for (const v of VERDECKER) {
      if (!v[art](A.E)) continue;
      const h = huelle2(v.pts.map((p) => A.p(p[0], p[1], p[2])));
      if (h.length < 3) continue;
      g.beginPath(); g.rect(-W * 2, -H * 2, W * 5, H * 5);
      g.moveTo(h[0][0], h[0][1]); for (let i = h.length - 1; i > 0; i--) g.lineTo(h[i][0], h[i][1]); g.closePath();
      g.clip("evenodd");
    }
    if (extra) extra();
  }
  /* Öffnung der Radgrube (auf Geländehöhe) als Clip */
  function grubeClip(g, A) {
    pfad3(g, A, [[PX0, PY0, 0], [PX1, PY0, 0], [PX1, PY1, 0], [PX0, PY1, 0]]); g.clip();
  }
  function gerinneClip(g, A) {
    pfad3(g, A, [[GX0 + GW, GY0, GZ1], [GX1 - GW, GY0, GZ1], [GX1 - GW, GY1, GZ1], [GX0 + GW, GY1, GZ1]]); g.clip();
  }
  const OMEGA = 0.62, OMEGA_W = 0.36;                 // rad/s (Umfang ≈ 1,5 m/s)
  function lebenMalen(g, P, o) {
    const A = ansichtLeben(P);
    const t = P.t || 0;
    const winter = o.winter;
    const phi = PHI0 - t * (winter ? OMEGA_W : OMEGA);
    const W = { winter: winter, wasser: true, bau: 1 };
    /* 0. Lichtpfützen auf dem Boden (nur wenn die Südseite zu sehen ist) */
    if (P.Z.nacht > 0.02 && A.E[1] > 0.03) lichtPfuetzen(g, A, P.Z.nacht, winter);
    /* 1. Grubenwasser */
    g.save(); grubeClip(g, A); aussparen(g, A, "grube"); grubeWasserMalen(g, A, t, W, false); vorhangMalen(g, A, t, W, false); g.restore();
    /* 2. Rad */
    g.save(); aussparen(g, A, "rad"); radMalen(g, A, phi, W); vorhangMalen(g, A, t, W, true); g.restore();
    /* 3. Strahl aus dem Gerinne */
    g.save(); aussparen(g, A, "strahl"); strahlMalen(g, A, t, W); g.restore();
    /* 4. Wasser im Gerinne */
    g.save(); gerinneClip(g, A); aussparen(g, A, "gerinne"); gerinneWasserMalen(g, A, t, W, false); g.restore();
  }
  const PHI0 = 0.21;
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
      const t = dot(sub(C, f.o), n) / en;
      const P = sub(C, mul(e, t)), d = sub(P, f.o);
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
      const d = sub([x, y, 0], f.o), a = dot(d, f.u), b = dot(d, f.v), hh = dot(d, n);
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
          const cx = opt.durchlass, bw = 0.9, yb = wl + 0.05;
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
    wand(M, [x0, y0, 0], [0, 1, 0], x1 - x0, T, grubenWandMal(B, R, T, stein, winter, saat + 1, opt), Object.assign({ name: "gw-n" + saat }, ex));
    wand(M, [x1, y1, 0], [0, -1, 0], x1 - x0, T, grubenWandMal(B, R, T, stein, winter, saat + 2, opt), Object.assign({ name: "gw-s" + saat }, ex));
    wand(M, [x1, y0, 0], [-1, 0, 0], y1 - y0, T, grubenWandMal(B, R, T, stein, winter, saat + 3, Object.assign({}, opt, { durchlass: opt.durchlass ? (0 - y0) : null })), Object.assign({ name: "gw-o" + saat }, ex));
    wand(M, [x0, y1, 0], [1, 0, 0], y1 - y0, T, grubenWandMal(B, R, T, stein, winter, saat + 4, opt), Object.assign({ name: "gw-w" + saat }, ex));
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
  function steinLeuchten(W, B, S, Z) {
    return function (g, F) {
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
      const k = s;
      g.fillStyle = "rgb(84,60,40)"; g.fillRect(-0.03 * k, -1.8 * k, 0.06 * k, 1.8 * k);
      for (let i = 0; i < 6; i++) {
        const y = -1.9 * k + i * 0.22 * k, b = (0.15 + i * 0.09) * k;
        g.fillStyle = winter ? "rgb(40,74,52)" : "rgb(36,86,46)";
        g.beginPath(); g.moveTo(0, y - 0.1 * k); g.lineTo(-b, y + 0.2 * k); g.lineTo(b, y + 0.2 * k); g.closePath(); g.fill();
        if (winter) { g.fillStyle = "rgba(245,248,255,0.9)"; g.beginPath(); g.moveTo(0, y - 0.08 * k); g.lineTo(-b * 0.8, y + 0.14 * k); g.lineTo(b * 0.5, y + 0.05 * k); g.closePath(); g.fill(); }
      }
      const farben = ["#c8202c", "#f2c230", "#2a62b8", "#ffffff", "#2a9a4a"];
      g.lineWidth = Math.max(1, 0.03 * k);
      for (let i = 0; i < 5; i++) { g.strokeStyle = farben[i]; g.beginPath(); g.moveTo(0, -1.7 * k); g.quadraticCurveTo((i - 2) * 0.25 * k, -1.2 * k, (i - 2) * 0.32 * k + Math.sin((F.t || 0) * 3 + i) * 0.05 * k, -0.8 * k); g.stroke(); }
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
    M.teil("kamin", { mitte: [KAMIN_X, 0, HAUS_M[2] + 12] });
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
      kiste(M, x0 - d, y0 - d, zk, x1 + d, y1 + d, zk + 0.1, { s: platte, n: platte, o: platte, w: platte, t: S.winter ? schneeOben(null) : (g, F) => { platte(g, F); g.fillStyle = "rgb(24,20,20)"; g.fillRect(F.w * 0.25, F.h * 0.25, F.w * 0.5, F.h * 0.5); } }, { name: "kk", keinAo: true });
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
     STAUWERK, GERINNE, BÖCKE, KONSOLE, LAGERSTEIN, RANDSTEINE
     ===================================================================== */
  function holzMal(c, saat, extra) {
    return function (g, F) {
      holzMalen(g, F, -0.02, -0.02, F.w + 0.04, F.h + 0.04, c, saat + ((F.w * 13) | 0), { ohneAst: F.w < 0.3 });
      if (extra) extra(g, F);
    };
  }
  function stauwerkBauen(M, B, S, Z) {
    const h = SZ1 * Z.stauwerk;
    if (h < 0.05) return;
    const winter = S.winter;
    M.teil("stauwerk", { mitte: [AUSSEN + (SX0 + SX1) / 2, -2 * AUSSEN, h / 2] });
    const mal = (saat) => (g, F) => {
      bruchsteinMalen(g, F, 0, 0, F.w, F.h, { saat: saat });
      eckquader(g, F, 0, 0, F.h, F.h, false, saat, SANDSTEIN_H);
      eckquader(g, F, F.w, 0, F.h, F.h, true, saat + 1, SANDSTEIN_H);
      const gr = g.createLinearGradient(0, F.h, 0, F.h - 0.6);
      gr.addColorStop(0, "rgba(50,60,40,0.3)"); gr.addColorStop(1, "rgba(50,60,40,0)");
      g.fillStyle = gr; g.fillRect(0, F.h - 0.6, F.w, 0.6);
      if (Z.wasser && !winter) {
        /* nasse Spur unter dem Überlauf */
        const gn = g.createLinearGradient(0, 0, 0, F.h);
        gn.addColorStop(0, "rgba(30,40,40,0.35)"); gn.addColorStop(1, "rgba(30,40,40,0)");
        g.fillStyle = gn; g.fillRect(F.w * 0.42, 0, F.w * 0.16, F.h);
      }
      if (winter && Z.fertig) { eiszapfenMalen(g, F, 0.1, F.w - 0.1, 0.18, 0.8, saat, (c, a) => rgb(c, a)); schneeWehe(g, F, F.w, F.h, saat, null); }
    };
    kiste(M, SX0, SY0, 0, SX1, SY1, h, { s: mal(21), n: mal(22), o: mal(23), w: mal(24), t: h >= SZ1 - 0.01 ? null : (g, F) => { g.fillStyle = rgb(MOERTEL); g.fillRect(0, 0, F.w, F.h); bruchsteinMalen(g, F, 0, 0, F.w, F.h, { saat: 29 }); } }, { name: "stau", ao: true });
    if (h >= SZ1 - 0.01) {
      /* Abdeckung aus gelbem Sandstein mit Wasserbecken */
      M.teil("stau-deckel", { schatten: false, mitte: [AUSSEN + (SX0 + SX1) / 2, -2 * AUSSEN, SZ1 + 1] });
      const d = 0.07, zd = SZ1;
      const platte = (g, F) => { quaderMalen(g, F, 0, 0, F.w, F.h, { farbe: SANDSTEIN_G, lage: F.h, laenge: 0.7, saat: 3 }); if (winter) { g.fillStyle = "rgb(244,247,252)"; g.fillRect(-0.02, -0.02, F.w + 0.04, 0.05); } };
      kiste(M, SX0 - d, SY0 - d, zd, SX1 + d, SY1 + d, zd + 0.16, { s: platte, n: platte, o: platte, w: platte, t: (g, F) => {
        const w = F.w, hh = F.h, r = 0.3;
        g.fillStyle = rgb(SANDSTEIN_G); g.fillRect(0, 0, w, hh);
        rausch(g, 0, 0, w, hh, 0.6, 0.25, 7, 3);
        if (winter) { g.fillStyle = "rgb(242,246,252)"; g.fillRect(0, 0, w, hh); }
        /* Becken (Oberwasser) */
        const gw = g.createLinearGradient(0, r, 0, hh - r);
        gw.addColorStop(0, winter ? "rgb(170,190,208)" : "rgb(58,84,92)"); gw.addColorStop(1, winter ? "rgb(200,214,228)" : "rgb(96,128,138)");
        g.fillStyle = gw; g.fillRect(r, r, w - 2 * r, hh - 2 * r);
        g.fillStyle = "rgba(20,30,34,0.35)"; g.fillRect(r, r, w - 2 * r, 0.05); g.fillRect(r, r, 0.05, hh - 2 * r);
        if (!winter) { g.fillStyle = "rgba(220,236,246,0.35)"; g.fillRect(r + 0.1, r + 0.2, w - 2 * r - 0.3, 0.03); }
        else { g.strokeStyle = "rgba(255,255,255,0.6)"; g.lineWidth = 0.01; g.beginPath(); g.moveTo(r + 0.1, r + 0.2); g.lineTo(w - r - 0.2, hh - r - 0.3); g.stroke(); }
      } }, { name: "stau-d", keinAo: true });
      /* Schützenaufzug: zwei Pfosten, Querholz, Zahnstange, Handrad, Schützbrett */
      if (Z.schuetz) {
        M.teil("schuetz", { schatten: false, mitte: [AUSSEN + (SX0 + SX1) / 2, -2 * AUSSEN + 50, SZ1 + 1] });
        const hc = [104, 76, 50];
        const m = (seite) => holzMal(hc, 81, winter ? (g, F) => { if (seite === "R" || seite === "e") { g.fillStyle = "rgba(242,246,252,0.9)"; g.fillRect(0, 0, F.w, Math.min(F.h, 0.04)); } } : null);
        const pf = (g) => m(g);
        for (const x of [GX0 - 0.02, GX1 + 0.02]) balken3(M, [x, SY1 + 0.08, SZ1 - 0.4], [x, SY1 + 0.08, SZ1 + 1.25], [1, 0, 0], 0.15, 0.15, pf, { name: "sp" + x });
        balken3(M, [GX0 - 0.12, SY1 + 0.08, SZ1 + 1.1], [GX1 + 0.12, SY1 + 0.08, SZ1 + 1.1], [0, 1, 0], 0.18, 0.14, pf, { name: "sq" });
        /* Schützbrett (halb gezogen) */
        balken3(M, [GX0 + 0.05, SY1 + 0.08, GZB + 0.15], [GX0 + 0.05, SY1 + 0.08, SZ1 + 0.35], [0, 1, 0], 0.06, 0.02, () => holzMal(hell(hc, -0.1), 82), { name: "brett", seiten: "Qq" });
        M.flaeche({ name: "schuetzbrett", o: [GX0 + 0.05, SY1 + 0.11, SZ1 + 0.35], u: [1, 0, 0], v: [0, 0, -1], w: GX1 - GX0 - 0.1, h: SZ1 + 0.2 - GZB, malen: (g, F) => { bretterMalen(g, F, 0, 0, F.w, F.h, hell(hc, -0.12), 83, { breite: 0.18 }); g.fillStyle = rgb(EISEN); g.fillRect(F.w / 2 - 0.03, 0, 0.06, F.h); } , keinAo: true });
        balken3(M, [RX, SY1 + 0.13, SZ1 + 0.35], [RX, SY1 + 0.13, SZ1 + 1.5], [1, 0, 0], 0.05, 0.05, () => (g, F) => { g.fillStyle = "rgb(44,42,42)"; g.fillRect(0, 0, F.w, F.h); if (F.px > 30) { g.fillStyle = "rgb(90,88,86)"; for (let x = 0.02; x < F.w; x += 0.05) g.fillRect(x, 0, 0.02, F.h); } }, { name: "zahn" });
        M.flaeche({ name: "handrad", o: [RX + 0.12, SY1 + 0.22 + 0.25, SZ1 + 1.45], u: [0, -1, 0], v: [0, 0, -1], w: 0.5, h: 0.5, umriss: Array.from({ length: 16 }, (_, i) => [0.25 + 0.25 * Math.cos(i / 16 * TAU), 0.25 + 0.25 * Math.sin(i / 16 * TAU)]), beidseitig: true, keinAo: true, malen: (g, F) => {
          g.strokeStyle = "rgb(40,38,38)"; g.lineWidth = 0.04; g.beginPath(); g.arc(0.25, 0.25, 0.22, 0, TAU); g.stroke();
          g.lineWidth = 0.025; g.beginPath(); for (let i = 0; i < 6; i++) { const a = i * TAU / 6; g.moveTo(0.25, 0.25); g.lineTo(0.25 + Math.cos(a) * 0.22, 0.25 + Math.sin(a) * 0.22); } g.stroke();
          g.fillStyle = "rgb(40,38,38)"; g.beginPath(); g.arc(0.25, 0.25, 0.05, 0, TAU); g.fill();
        } });
      }
    }
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
      /* unten nass und dunkel, im Frühling etwas Moos */
      const gr = g.createLinearGradient(0, F.h * 0.3, 0, F.h);
      gr.addColorStop(0, "rgba(20,24,20,0)"); gr.addColorStop(1, winter ? "rgba(30,34,44,0.3)" : "rgba(30,44,26,0.45)");
      g.fillStyle = gr; g.fillRect(0, 0, F.w, F.h);
      /* Eisenbänder: in Flächenkoordinaten liegen sie bei festen y des Modells */
      const f = F.flaeche;
      for (const yb of bandX) {
        const a = (yb - f.o[1]) / (f.u[1] || 1e-9);
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
      if (!Z.lebend && Z.wasser) {
        M.flaeche({ name: "g-wasser" + i, o: [GX0 + GW, ya, GZW], u: [1, 0, 0], v: [0, 1, 0], w: GX1 - GX0 - 2 * GW, h: L, ebene: 2, malen: (g, F) => {
          g.save(); if (!lochClip(g, F, B, [GX0 + GW, GY0, GX1 - GW, GY1, GZ1])) { g.restore(); return; }
          g.fillStyle = winter ? "rgb(150,172,190)" : rgb(WASSER_T); g.fillRect(0, 0, F.w, F.h);
          g.fillStyle = "rgba(255,255,255,0.2)"; for (let y = 0.2; y < F.h; y += 0.5) g.fillRect(0.1, y, F.w - 0.2, 0.02);
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
      }
      if (winter && Z.fertig) {
        for (const [x, n, u] of [[GX1 + 0.005, [1, 0, 0], [0, -1, 0]], [GX0 - 0.005, [-1, 0, 0], [0, 1, 0]]]) {
          const o = n[0] > 0 ? [x, yb, GZ0] : [x, ya, GZ0];
          M.flaeche({ name: "g-zapfen" + i + n[0], o: o, u: u, v: [0, 0, -1], w: L, h: 0.9, keinLicht: true, keinAo: true, malen: zapfenMal(900 + i * 7 + n[0], 0.75) });
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
      /* gespreizte Beine */
      for (const [xu, xo] of [[GX0 - 0.35, GX0 + 0.04], [GX1 + 0.35, GX1 - 0.04]]) {
        balken3(M, [xu, yb, 0.15], [xo, yb, zk], [0, 1, 0], 0.16, 0.16, m(60 + i), { name: "bein" + xu, seiten: "QqRr" });
        /* Fundamentstein */
        const st = (g, F) => { quaderMalen(g, F, 0, 0, F.w, F.h, { lage: F.h, saat: 9, farbe: SANDSTEIN_H }); };
        kiste(M, xu - 0.16, yb - 0.16, 0, xu + 0.16, yb + 0.16, 0.18, { s: st, n: st, o: st, w: st, t: winter ? schneeOben(null) : st }, { name: "fs" + xu, keinAo: true });
      }
      /* Holm unter dem Gerinne */
      balken3(M, [GX0 - 0.35, yb, zk + 0.1], [GX1 + 0.35, yb, zk + 0.1], [0, 1, 0], 0.2, 0.2, m(70 + i), { name: "holm" + i, seiten: "QqRrae" });
      /* Zangen und Andreaskreuz (auf der Südseite der Beine) */
      balken3(M, [GX0 - 0.2, yb + 0.12, 1.6], [GX1 + 0.2, yb + 0.12, 1.6], [0, 1, 0], 0.06, 0.18, m(80 + i), { name: "zange" + i, seiten: "QRr" });
      balken3(M, [GX0 - 0.22, yb + 0.12, 1.75], [GX1 + 0.1, yb + 0.12, zk - 0.2], [0, 1, 0], 0.06, 0.14, m(90 + i), { name: "kreuz1" + i, seiten: "QRr" });
      balken3(M, [GX1 + 0.22, yb + 0.12, 1.75], [GX0 - 0.1, yb + 0.12, zk - 0.2], [0, 1, 0], 0.06, 0.14, m(95 + i), { name: "kreuz2" + i, seiten: "QRr" });
      if (winter && Z.fertig) M.flaeche({ name: "bock-zapfen" + i, o: [GX0 - 0.35, yb + 0.105, zk], u: [1, 0, 0], v: [0, 0, -1], w: GX1 - GX0 + 0.7, h: 0.6, keinLicht: true, keinAo: true, malen: zapfenMal(500 + i, 0.5) });
    }
  }
  function konsoleBauen(M, S, Z) {
    if (!Z.konsole) return;
    const hc = [104, 78, 54];
    const m = () => holzMal(hc, 55, S.winter ? (g, F) => { if (F.flaeche.u[2] === 0 && F.flaeche.v[2] === 0) { g.fillStyle = "rgba(242,246,252,0.95)"; g.fillRect(0, 0, F.w, F.h); } } : null);
    M.teil("konsole", { mitte: [AUSSEN + 4.1, KONSOLE_Y, GZ0 + 5], schatten: false });
    balken3(M, [XW1, KONSOLE_Y, GZ0 - 0.1], [GX1 + 0.12, KONSOLE_Y, GZ0 - 0.1], [0, 1, 0], 0.18, 0.2, m, { name: "kons", seiten: "QqRe" });
    balken3(M, [XW1, KONSOLE_Y, GZ0 - 1.3], [GX0 + 0.3, KONSOLE_Y, GZ0 - 0.2], [0, 1, 0], 0.14, 0.14, m, { name: "strebe", seiten: "QqR" });
  }
  function lagerBauen(M, B, S, Z) {
    const h = Z.pfeiler;
    if (h <= 0.01) return;
    const winter = S.winter;
    const zTop = PZB + (LZ1 - PZB) * h;
    const st = (saat) => (g, F) => { quaderMalen(g, F, 0, 0, F.w, F.h, { saat: saat, lage: 0.44, laenge: 0.95, farbe: SANDSTEIN_H }); const gr = g.createLinearGradient(0, F.h, 0, F.h - 0.5); gr.addColorStop(0, "rgba(40,50,40,0.35)"); gr.addColorStop(1, "rgba(40,50,40,0)"); g.fillStyle = gr; g.fillRect(0, F.h - 0.5, F.w, 0.5); };
    if (zTop > 0.01) {
      M.teil("lager", { mitte: [AUSSEN + 50 + (LX0 + LX1) / 2, 0, 1.2] });
      kiste(M, LX0, -LY, 0, LX1, LY, zTop, { s: st(1), n: st(2), o: st(3), w: st(4), t: (g, F) => { g.fillStyle = rgb(SANDSTEIN_H); g.fillRect(0, 0, F.w, F.h); rausch(g, 0, 0, F.w, F.h, 0.6, 0.25, 5, 3); if (winter) { g.fillStyle = "rgb(242,246,252)"; g.fillRect(0, 0, F.w, F.h); } } }, { name: "lg", keinAo: false });
      if (h >= 1 && Z.lagerbock) {
        /* Lagerbock: Eichenklotz mit eisernem Lagerdeckel */
        const hc = [96, 70, 48];
        const bm = (g, F) => {
          holzMalen(g, F, 0, 0, F.w, F.h, hc, 66, {});
          /* eiserner Lagerdeckel, zwei Bügel mit Muttern */
          g.fillStyle = rgb(EISEN); g.fillRect(-0.01, -0.01, F.w + 0.02, 0.1);
          g.fillStyle = "rgba(150,80,40,0.35)"; g.fillRect(-0.01, 0.05, F.w + 0.02, 0.05);
          for (const x of [0.12, F.w - 0.12]) { g.fillStyle = rgb(EISEN); g.fillRect(x - 0.025, 0, 0.05, F.h * 0.8); if (F.px > 25) { g.fillStyle = "rgb(28,26,26)"; g.fillRect(x - 0.04, F.h * 0.8 - 0.05, 0.08, 0.06); } }
          if (winter) { g.fillStyle = "rgb(242,246,252)"; g.fillRect(-0.01, -0.01, F.w + 0.02, 0.035); }
        };
        kiste(M, LX0, -0.3, LZ1, LX1 - 0.1, 0.3, LZB, { s: bm, n: bm, o: bm, w: bm, t: winter ? schneeOben(null) : (g, F) => { g.fillStyle = rgb(EISEN); g.fillRect(0, 0, F.w, F.h); g.fillStyle = "rgba(255,255,255,0.15)"; g.fillRect(0, 0, F.w, 0.03); } }, { name: "lb", keinAo: true });
      }
    }
  }
  /* Randsteine um die Radgrube, Ablaufrinne nach Osten */
  function randBauen(M, B, S, Z) {
    if (!Z.rand) return;
    const winter = S.winter;
    M.teil("rand", { schatten: false, ebene: -1, mitte: [RX, 0, 0] });
    const st = (saat) => (g, F) => { quaderMalen(g, F, 0, 0, F.w, F.h, { saat: saat, lage: F.h, laenge: 0.8, farbe: SANDSTEIN_H }); };
    const oben = (saat) => winter ? schneeOben(null) : (g, F) => { quaderMalen(g, F, 0, 0, F.w, F.h, { saat: saat, lage: F.h, laenge: 0.8, farbe: SANDSTEIN_H }); };
    kiste(M, PX0, PY0 - RAND_B, 0, PX1 + RAND_B, PY0, RAND_H, { s: st(1), n: st(2), o: st(3), w: null, t: oben(4) }, { name: "rn", keinAo: true });
    kiste(M, PX0, PY1, 0, PX1 + RAND_B, PY1 + RAND_B, RAND_H, { s: st(5), n: st(6), o: st(7), w: null, t: oben(8) }, { name: "rs", keinAo: true });
    kiste(M, PX1, PY0, 0, PX1 + RAND_B, PY1, RAND_H, { o: st(9), w: st(10), t: oben(11) }, { name: "ro", keinAo: true });
    /* Ablaufrinne vom Durchlass bis an den Rand des Grundstücks */
    const xa = PX1 + RAND_B, xe = 7.5, yr = 0.55;
    M.flaeche({ name: "ablauf", o: [xa, -yr, 0.012], u: [1, 0, 0], v: [0, 1, 0], w: xe - xa, h: 2 * yr, malen: (g, F) => {
      const w = F.w, h = F.h;
      quaderMalen(g, F, 0, 0, w, h, { farbe: [150, 120, 100], lage: 0.25, saat: 12 });
      const wl = winter ? [196, 212, 228] : [70, 100, 108];
      const gr = g.createLinearGradient(0, 0.18, 0, h - 0.18);
      gr.addColorStop(0, rgb(hell(wl, -0.2))); gr.addColorStop(0.5, rgb(wl)); gr.addColorStop(1, rgb(hell(wl, -0.2)));
      g.fillStyle = gr; g.fillRect(-0.02, 0.18, w + 0.04, h - 0.36);
      if (!winter) { g.fillStyle = "rgba(230,242,250,0.35)"; for (let x = 0.05; x < w; x += 0.3) g.fillRect(x, h / 2 - 0.1 + ((x * 7) % 0.2), 0.18, 0.02); }
      else { g.fillStyle = "rgba(250,252,255,0.8)"; g.fillRect(-0.02, 0.18, w + 0.04, 0.12); g.fillRect(-0.02, h - 0.3, w + 0.04, 0.12); }
    } });
  }

  /* ---------------- Radgrube (unter Gelände) mit Pfeiler ---------------- */
  function radgrubeBauen(M, B, S, Z) {
    const winter = S.winter;
    M.teil("radgrube", { ebene: -2, mitte: [RX, 0, -3], schatten: false });
    const R = [PX0, PY0, PX1, PY1];
    const T = -PZB;
    grubeBauen(M, B, R, T, T * Z.grubeStein, winter, 300, { wasser: Z.wasser, durchlass: Z.grubeStein >= 1, beton: true });
    /* Pfeiler unter Gelände */
    if (Z.pfeiler > 0) {
      const zTop = Math.min(0, PZB + (LZ1 - PZB) * Z.pfeiler);
      const h = zTop - PZB;
      if (h > 0.02) {
        const mal = (saat) => (g, F) => {
          g.save(); if (!lochClip(g, F, B, R)) { g.restore(); return; }
          quaderMalen(g, F, 0, 0, F.w, F.h, { saat: saat, lage: 0.44, laenge: 0.95, farbe: SANDSTEIN_H });
          g.fillStyle = "rgba(20,30,24,0.4)"; g.fillRect(0, F.h - (h - (-PZW + PZB) * 0), F.w, F.h);
          const L = ST.lichtFaktor(F.n, F.zeit, 0, F.jahr);
          g.globalCompositeOperation = "multiply"; g.fillStyle = rgb([L[0] * 255, L[1] * 255, L[2] * 255]); g.fillRect(0, 0, F.w, F.h); g.globalCompositeOperation = "source-over";
          grubenSchatten(g, F, R, F.w, F.h);
          g.restore();
        };
        const ex = { keinLicht: true, keinAo: true, ebene: 1 };
        wand(M, [LX0, LY, zTop], [0, 1, 0], LX1 - LX0, h, mal(1), Object.assign({ name: "pf-s" }, ex));
        wand(M, [LX1, -LY, zTop], [0, -1, 0], LX1 - LX0, h, mal(2), Object.assign({ name: "pf-n" }, ex));
        wand(M, [LX1, LY, zTop], [1, 0, 0], 2 * LY, h, mal(3), Object.assign({ name: "pf-o" }, ex));
        wand(M, [LX0, -LY, zTop], [-1, 0, 0], 2 * LY, h, mal(4), Object.assign({ name: "pf-w" }, ex));
      }
    }
    /* Wasser (im Sprite nur, solange das Rad nicht lebt) */
    if (Z.wasser && !Z.lebend) {
      M.flaeche({ name: "grube-wasser", o: [PX0, PY0, PZW], u: [1, 0, 0], v: [0, 1, 0], w: PX1 - PX0, h: PY1 - PY0, ebene: 2, keinLicht: true, malen: (g, F) => {
        g.save(); if (!lochClip(g, F, B, R)) { g.restore(); return; }
        const L = belichter(F, 0);
        g.fillStyle = L(winter ? [150, 170, 186] : [48, 70, 66]); g.fillRect(0, 0, F.w, F.h);
        g.fillStyle = "rgba(220,236,246,0.18)"; for (let y = 0.3; y < F.h; y += 0.45) g.fillRect(0.2, y, F.w - 0.4, 0.03);
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
    M.teil("muehlstein", { mitte: [cx, YW + AUSSEN, 0.6] });
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
    /* Rand (Mantel) in Stücken, mit Eisenreif */
    const N = 20;
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
    M.teil("bank", { mitte: [(x0 + x1) / 2, YW + AUSSEN, 0.4] });
    const m = (saat) => (g, F) => { holzMalen(g, F, -0.02, -0.02, F.w + 0.04, F.h + 0.04, hc, saat, { ohneAst: true }); };
    for (const x of [x0 + 0.1, x1 - 0.16]) kiste(M, x, y0 + 0.04, 0, x + 0.06, y1 - 0.04, zs - 0.05, { s: m(1), n: m(2), o: m(3), w: m(4) }, { name: "bb" + x, keinAo: true });
    kiste(M, x0, y0, zs - 0.05, x1, y1, zs, { s: m(5), o: m(6), w: m(7), t: S.winter ? schneeOben(m(8)) : (g, F) => { m(8)(g, F); if (F.px > 20) { g.fillStyle = "rgba(20,10,5,0.4)"; for (let y = F.h / 3; y < F.h; y += F.h / 3) g.fillRect(0, y - 0.005, F.w, 0.01); } } }, { name: "bs", keinAo: true });
    kiste(M, x0, y0, zs + 0.15, x1, y0 + 0.05, zs + 0.45, { s: S.winter ? (g, F) => { m(9)(g, F); g.fillStyle = "rgb(244,247,252)"; g.fillRect(0, 0, F.w, 0.03); } : m(9), t: S.winter ? schneeOben(null) : m(10) }, { name: "bl", keinAo: true });
  }
  /* Handwagen: Frühling mit Mehlsäcken, Winter mit frisch geschlagener Tanne */
  function wagenBauen(M, S, Z) {
    const x0 = -1.7, x1 = -0.2, y0 = 5.7, y1 = 6.6, zb = 0.52;
    const hc = [128, 94, 62];
    M.teil("wagen", { mitte: [(x0 + x1) / 2, (y0 + y1) / 2 + AUSSEN, 0.6] });
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
    M.teil("ladung", { mitte: [(x0 + x1) / 2, (y0 + y1) / 2 + AUSSEN, 1.2] });
    M.figur({ x: (x0 + x1) / 2, y: (y0 + y1) / 2, z: zb + 0.28, breite: 1.8, hoehe: 1.2, malen: S.winter ? tanneLiegend() : saecke(S) });
  }
  function saecke(S) {
    return function (g, s, F) {
      const k = s;
      const sack = (x, y, b, h, dreh, hellK) => {
        g.save(); g.translate(x * k, y * k); g.rotate(dreh);
        const c = F.schatten ? [0, 0, 0] : hell([226, 214, 186], hellK);
        const gr = F.schatten ? "#000" : g.createLinearGradient(-b * k / 2, 0, b * k / 2, 0);
        if (!F.schatten) { gr.addColorStop(0, rgb(hell(c, 0.08))); gr.addColorStop(0.7, rgb(c)); gr.addColorStop(1, rgb(hell(c, -0.3))); }
        g.fillStyle = gr;
        g.beginPath(); g.moveTo(-b * k / 2, 0); g.bezierCurveTo(-b * k * 0.6, -h * k * 0.6, -b * k * 0.4, -h * k, -b * k * 0.15, -h * k * 1.02);
        g.lineTo(b * k * 0.15, -h * k * 1.02); g.bezierCurveTo(b * k * 0.4, -h * k, b * k * 0.6, -h * k * 0.6, b * k / 2, 0); g.closePath(); g.fill();
        if (!F.schatten && k > 16) {
          /* Zipfel mit Kordel, Aufdruck */
          g.fillStyle = rgb(hell(c, -0.15)); g.beginPath(); g.ellipse(0, -h * k * 1.05, b * k * 0.16, h * k * 0.08, 0, 0, TAU); g.fill();
          g.strokeStyle = "rgba(120,90,50,0.8)"; g.lineWidth = Math.max(0.6, k * 0.012); g.beginPath(); g.moveTo(-b * k * 0.14, -h * k * 0.95); g.lineTo(b * k * 0.14, -h * k * 0.95); g.stroke();
          if (k > 30) { g.fillStyle = "rgba(40,70,140,0.7)"; g.font = "bold " + (0.09 * k).toFixed(1) + "px Georgia, serif"; g.textAlign = "center"; g.fillText("MEHL", 0, -h * k * 0.45); g.fillStyle = "rgba(160,40,40,0.6)"; g.fillRect(-b * k * 0.3, -h * k * 0.35, b * k * 0.6, 0.012 * k); }
        }
        g.restore();
      };
      if (F.schatten) { g.fillStyle = "#000"; g.beginPath(); g.ellipse(0.05 * k, -0.35 * k, 0.72 * k, 0.36 * k, 0, 0, TAU); g.fill(); return; }
      sack(-0.35, 0, 0.42, 0.62, -0.08, 0);
      sack(0.1, 0, 0.44, 0.66, 0.05, -0.05);
      sack(0.5, 0.02, 0.4, 0.55, 0.12, 0.04);
      sack(-0.1, -0.35, 0.42, 0.5, -0.5, 0.06);
    };
  }
  function tanneLiegend() {
    return function (g, s, F) {
      const k = s;
      if (F.schatten) { g.fillStyle = "#000"; g.beginPath(); g.moveTo(-0.85 * k, -0.05 * k); g.lineTo(-0.5 * k, -0.42 * k); g.lineTo(0.85 * k, -0.12 * k); g.lineTo(-0.5 * k, 0.1 * k); g.closePath(); g.fill(); return; }
      g.save();
      if (F.schatten) g.fillStyle = "#000";
      /* Stamm */
      g.fillStyle = F.schatten ? "#000" : "rgb(92,62,40)"; g.fillRect(-0.85 * k, -0.08 * k, 0.4 * k, 0.07 * k);
      /* Zweige als liegender Kegel */
      const rng = zufall(8);
      for (let i = 0; i < 90; i++) {
        const t = rng(), x = -0.5 * k + t * 1.35 * k, br = (1 - t) * 0.32 * k + 0.04 * k;
        const y = -0.1 * k - (rng() - 0.3) * br;
        g.fillStyle = F.schatten ? "#000" : rgb([30 + rng() * 22, 70 + rng() * 26, 44 + rng() * 10]);
        g.beginPath(); g.ellipse(x, y, 0.1 * k, 0.035 * k, (rng() - 0.5) * 1.2, 0, TAU); g.fill();
      }
      if (!F.schatten) {
        g.fillStyle = "rgba(246,249,255,0.9)";
        for (let i = 0; i < 30; i++) { const t = rng(), x = -0.5 * k + t * 1.35 * k, br = (1 - t) * 0.28 * k + 0.03 * k; g.beginPath(); g.ellipse(x, -0.12 * k - br * 0.8, 0.07 * k, 0.02 * k, 0, 0, TAU); g.fill(); }
      }
      g.restore();
    };
  }
  /* Kleiner Christbaum im Holzkübel neben der Tür (Winter) */
  function christbaumBauen(M, S, Z) {
    const x = -0.05, y = YW + 0.45;
    M.teil("christbaum", { mitte: [x, y + AUSSEN, 1] });
    M.figur({ x: x, y: y, z: 0, breite: 1.1, hoehe: 2.1, malen: function (g, s, F) {
      const k = s, sch = F.schatten;
      const rng = zufall(12);
      if (sch) {
        /* Schatten: eine Silhouette, eine Füllung (der Weichzeichner kostet je Füllung) */
        g.fillStyle = "#000"; g.beginPath();
        g.moveTo(-0.24 * k, 0); g.lineTo(-0.26 * k, -0.42 * k); g.lineTo(-0.52 * k, -0.45 * k); g.lineTo(0, -2.08 * k); g.lineTo(0.52 * k, -0.45 * k); g.lineTo(0.26 * k, -0.42 * k); g.lineTo(0.24 * k, 0); g.closePath(); g.fill();
        return;
      }
      /* Kübel */
      g.fillStyle = sch ? "#000" : "rgb(112,74,46)";
      g.beginPath(); g.moveTo(-0.22 * k, 0); g.lineTo(-0.26 * k, -0.4 * k); g.lineTo(0.26 * k, -0.4 * k); g.lineTo(0.22 * k, 0); g.closePath(); g.fill();
      if (!sch) { g.fillStyle = "rgb(50,48,48)"; g.fillRect(-0.25 * k, -0.33 * k, 0.5 * k, 0.03 * k); g.fillRect(-0.23 * k, -0.1 * k, 0.46 * k, 0.03 * k); g.fillStyle = "rgba(0,0,0,0.25)"; g.fillRect(0.05 * k, -0.4 * k, 0.2 * k, 0.4 * k); }
      /* Zweige in Etagen */
      const lagen = 7;
      for (let i = 0; i < lagen; i++) {
        const t = i / (lagen - 1), yy = -0.45 * k - t * 1.45 * k, b = (0.5 - t * 0.42) * k;
        for (let j = 0; j < 14; j++) {
          const a = (j / 13 - 0.5) * 2, xx = a * b;
          g.fillStyle = sch ? "#000" : rgb([24 + rng() * 20, 60 + rng() * 22, 38 + rng() * 8]);
          g.beginPath(); g.ellipse(xx, yy + Math.abs(a) * 0.08 * k, 0.1 * k, 0.04 * k, a * 0.5, 0, TAU); g.fill();
        }
        if (!sch) { g.fillStyle = "rgba(246,249,255,0.92)"; g.beginPath(); g.ellipse(-b * 0.15, yy - 0.03 * k, b * 0.6, 0.03 * k, 0, 0, TAU); g.fill(); }
      }
      if (sch) return;
      /* Kugeln, Strohsterne, Lichter */
      const kugeln = [[-0.2, -0.7], [0.18, -0.85], [-0.1, -1.05], [0.12, -1.3], [-0.05, -1.55], [0.28, -0.6]];
      for (let i = 0; i < kugeln.length; i++) { g.fillStyle = i % 2 ? "#c01a2c" : "#d9a33a"; g.beginPath(); g.arc(kugeln[i][0] * k, kugeln[i][1] * k, 0.045 * k, 0, TAU); g.fill(); g.fillStyle = "rgba(255,255,255,0.6)"; g.beginPath(); g.arc(kugeln[i][0] * k - 0.012 * k, kugeln[i][1] * k - 0.012 * k, 0.014 * k, 0, TAU); g.fill(); }
      const nacht = F.nacht || 0;
      for (let i = 0; i < 16; i++) {
        const t = i / 15, xx = Math.sin(i * 2.4) * (0.42 - t * 0.35) * k, yy = -0.55 * k - t * 1.3 * k;
        g.fillStyle = nacht > 0.2 ? "rgba(255,236,170,1)" : "rgba(250,240,210,0.9)";
        g.beginPath(); g.arc(xx, yy, Math.max(0.6, 0.018 * k), 0, TAU); g.fill();
        if (nacht > 0.2 && i % 2 === 0 && F.leuchtPunkt) F.leuchtPunkt(xx, yy, 0.35 * k, "255,200,120", 0.25, true);
      }
      /* Stern */
      g.fillStyle = "#f0c850"; g.beginPath();
      for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = (i % 2 ? 0.04 : 0.1) * k; g.lineTo(Math.cos(a) * r, -1.98 * k + Math.sin(a) * r); }
      g.closePath(); g.fill();
      if (nacht > 0.2 && F.leuchtPunkt) F.leuchtPunkt(0, -1.98 * k, 0.6 * k, "255,220,140", 0.45, false);
    } });
  }
  /* Holzstapel an der Nordwand unter der Traufe */
  function holzstapelBauen(M, S, Z) {
    const x0 = -6.5, x1 = -3.9, y0 = -YW - 0.55, y1 = -YW - 0.02, h = 1.55;
    M.teil("holzstapel", { mitte: [(x0 + x1) / 2, -YW - AUSSEN, 0.8] });
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
     SCHATTEN, DIE DER KERN NICHT KANN (Rad mit Speichen, Gerinne auf
     Stelzen): eine Figur zeichnet sie im Schattendurchgang auf den Boden.
     ===================================================================== */
  const SLX = -ST.LICHT[0] / ST.LICHT[2], SLY = -ST.LICHT[1] / ST.LICHT[2];
  function schattenFigur(B, S, Z) {
    return function (g, s, F) {
      if (!F.schatten) return;
      const m = g.getTransform();
      if (Math.abs(m.d) < 1e-6) return;
      g.transform(1, 0, -m.c / m.d, 1 / m.d, 0, 0);
      const bp = (p) => { const a = p[0] * B.c - p[1] * B.s, b = p[0] * B.s + p[1] * B.c; const ga = a + SLX * p[2], gb = b + SLY * p[2]; return [(ga - gb) * ST.KX * s, (ga + gb) * ST.KY * s]; };
      g.fillStyle = "#000";
      /* alle Umrisse in EINEM Pfad (jede Füllung mit Weichzeichner kostet) */
      g.beginPath();
      const flach = (pts) => { const h = huelle2(pts.map(bp)); if (h.length < 3) return; g.moveTo(h[0][0], h[0][1]); for (let i = 1; i < h.length; i++) g.lineTo(h[i][0], h[i][1]); g.closePath(); };
      const stab = (a, b, d) => flach([add(a, [d, d, 0]), add(a, [-d, -d, 0]), add(a, [d, -d, 0]), add(a, [-d, d, 0]), add(b, [d, d, 0]), add(b, [-d, -d, 0]), add(b, [d, -d, 0]), add(b, [-d, d, 0])]);
      /* Gerinne */
      if (Z.gerinne > 0) flach(kastenPunkte(GX0, GY0, GZ0, GX1, GY0 + (GY1 - GY0) * Z.gerinne, GZ1));
      /* Böcke */
      if (Z.boecke > 0) for (const yb of BOECKE) {
        stab([GX0 - 0.35, yb, 0], [GX0 + 0.04, yb, GZ0 - 0.2], 0.08); stab([GX1 + 0.35, yb, 0], [GX1 - 0.04, yb, GZ0 - 0.2], 0.08);
        stab([GX0 - 0.35, yb, GZ0 - 0.1], [GX1 + 0.35, yb, GZ0 - 0.1], 0.1);
        stab([GX0 - 0.22, yb, 1.75], [GX1 + 0.1, yb, GZ0 - 0.4], 0.04); stab([GX1 + 0.22, yb, 1.75], [GX0 - 0.1, yb, GZ0 - 0.4], 0.04);
      }
      if (Z.konsole) stab([XW1, KONSOLE_Y, GZ0 - 0.1], [GX1 + 0.12, KONSOLE_Y, GZ0 - 0.1], 0.1);
      if (Z.rad > 0) {
        for (let k = 0; k < NA; k++) {
          const w = PHI0 + k * TAU / NA + TAU / 16;
          for (const x of [XK1, XK4]) stab(radPunkt(x, 0.3, w), radPunkt(x, RK0, w), 0.07);
        }
        stab([XW1, 0, RZ], [X_LAGER, 0, RZ], RW);
      }
      g.fill();
      /* Rad: beide Kränze als Ringe, dazwischen der geschlossene Zellenkranz, Arme */
      if (Z.rad > 0) {
        const N = 40;
        const kreis = (x, r) => Array.from({ length: N }, (_, i) => bp(radPunkt(x, r, i / N * TAU)));
        const aus = huelle2(kreis(XK1, RR).concat(kreis(XK4, RR)));
        /* innen frei: Schnitt beider Innenkreise */
        let loch = kreis(XK1, RI);
        const k2 = kreis(XK4, RI);
        for (let i = 0; i < k2.length; i++) {
          const a = k2[i], b = k2[(i + 1) % k2.length];
          loch = schneide(loch, (p) => (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]) >= 0 ? 1 : -1);
          if (loch.length < 3) break;
        }
        const umlauf = (P) => { let f = 0; for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length]; f += a[0] * b[1] - b[0] * a[1]; } return f; };
        if (umlauf(k2) < 0) { /* Drehsinn prüfen: bei falschem Sinn bleibt nichts übrig */ }
        g.beginPath(); g.moveTo(aus[0][0], aus[0][1]); for (let i = 1; i < aus.length; i++) g.lineTo(aus[i][0], aus[i][1]); g.closePath();
        if (loch.length >= 3) { g.moveTo(loch[0][0], loch[0][1]); for (let i = 1; i < loch.length; i++) g.lineTo(loch[i][0], loch[i][1]); g.closePath(); }
        g.fill("evenodd");
      }
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
      stauwerk: k(0.3, 0.5),
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
    name: "Wassermühle", gruppe: "Häuser", grund: [15, 15.2], hoehe: 13, bauzeit: 12 * 60,
    bauen(M, o) {
      const B = neuerBlick();
      M.teil("blick", { ebene: -90, schatten: false, mitte: [0, 0, 0] });
      M.figur({ x: 0, y: 0, z: 0, breite: 0.01, hoehe: 0.01, schatten: false, malen(g, s, F) { if (!F.schatten && F.gier != null) blickSetzen(B, F.gier); } });
      const winter = o.jahr === "winter";
      const bau = o.bau == null ? 1 : klemm(o.bau, 0, 1);
      const lebend = !!o.objekt && bau >= 1;
      const Z = zustand(bau, lebend);
      const S = { winter: winter, saat: 7 + ((o.saat || 0) % 5), kaminX: KAMIN_X, inschrift: true, blumen: !winter };
      /* Schattenfigur (Rad, Gerinne, Böcke) */
      M.teil("schattenwurf", { ebene: -89, schatten: true, mitte: [0, 0, 0] });
      M.figur({ x: 0, y: 0, z: 0, breite: 0.01, hoehe: 0.01, malen: schattenFigur(B, S, Z) });
      grenzPunkte(M);
      /* Baugrube (vor dem Mauern) */
      if (bau < 0.14) {
        M.teil("baugrube", { ebene: -3, mitte: [0, 0, -3], schatten: false });
        const R = [XW0 - 0.5, -YW - 0.5, PX1 + 0.35, YW + 0.5];
        grubeBauen(M, B, R, Z.grubeT, 0, winter, 100, {});
        if (Z.fundament > 0) {
          const zt = -Z.grubeT + (Z.grubeT) * glatt(Z.fundament);
          const fx0 = XW0 - 0.1, fx1 = XW1 + 0.1, fy = YW + 0.1;
          const beton = (g, F) => {
            g.save(); if (!lochClip(g, F, B, R)) { g.restore(); return; }
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
          if (hF > 0.02) {
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
        }
        /* Aushub */
        M.teil("aushub", { mitte: [-5, 7 + AUSSEN, 0.5] });
        M.figur({ x: -4.6, y: 6.6, z: 0, breite: 4.5, hoehe: 1.6, malen: aushubFigur(glatt(Z.grubeT / 1.3), winter) });
      } else {
        radgrubeBauen(M, B, S, Z);
        randBauen(M, B, S, Z);
      }
      /* Haus */
      if (bau >= 0.13) hausBauen(M, B, S, Z);
      if (bau >= 0.6 && bau < 0.8) dachstuhlBauen(M, S, Z);
      if (bau >= 0.66 && bau < 0.8) dachImBau(M, S, Z);
      if (Z.dach) dachBauen(M, S, Z, B);
      kaminBauen(M, S, Z);
      if (Z.fertig) M.rauchAus(KAMIN_X, 0, ZF + KAMIN_H + 0.15, winter ? 1.0 : 0.6);
      /* Wasserseite */
      stauwerkBauen(M, B, S, Z);
      lagerBauen(M, B, S, Z);
      boeckeBauen(M, S, Z);
      konsoleBauen(M, S, Z);
      gerinneBauen(M, B, S, Z);
      /* Rad: im Sprite still (Bau, Vorschau), in der Stadt lebendig */
      if (Z.rad > 0 && !lebend) {
        M.teil("rad", { mitte: [AUSSEN + RX, 0, RZ], schatten: false });
        M.figur({ x: 0, y: 0, z: 0, breite: 0.01, hoehe: 0.01, schatten: false, malen(g, s, F) {
          if (F.schatten) return;
          const A = ansichtFigur(s, F.gier || 0, F.Z, F.jahr);
          radMalen(g, A, PHI0, { winter: winter, wasser: Z.wasser, bau: Z.rad });
        } });
      }
      if (lebend) M.lebendig((g, P) => lebenMalen(g, P, { winter: winter }));
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

  /* Aushubhaufen */
  function aushubFigur(k, winter) {
    return function (g, s, F) {
      const b = 2.2 * s * Math.cbrt(Math.max(0.05, k)), h = 1.2 * s * ST.KZ * Math.cbrt(Math.max(0.05, k));
      g.beginPath(); g.moveTo(-b, 0); g.bezierCurveTo(-b * 0.6, -h * 0.9, b * 0.4, -h * 1.1, b, 0); g.closePath();
      if (F.schatten) { g.fillStyle = "#000"; g.fill(); return; }
      const gr = g.createLinearGradient(-b, -h, b, 0);
      gr.addColorStop(0, "rgb(150,112,76)"); gr.addColorStop(1, "rgb(92,66,44)");
      g.fillStyle = gr; g.fill();
      const rng = zufall(5);
      for (let i = 0; i < 40; i++) { g.fillStyle = "rgba(60,44,30,0.6)"; g.beginPath(); g.arc((rng() - 0.5) * b * 1.6, -rng() * h * 0.7, Math.max(0.6, s * 0.03), 0, TAU); g.fill(); }
      if (winter) { g.fillStyle = "rgba(244,247,252,0.85)"; g.beginPath(); g.moveTo(-b * 0.6, -h * 0.55); g.bezierCurveTo(-b * 0.3, -h * 1.0, b * 0.3, -h * 1.05, b * 0.6, -h * 0.5); g.bezierCurveTo(b * 0.2, -h * 0.7, -b * 0.2, -h * 0.72, -b * 0.6, -h * 0.55); g.fill(); }
    };
  }

  /* =====================================================================
     WINTERHAUSEN: mit ?muehle=1 steht die Mühle am Mühlbach.
     Der Bach kommt von Nordosten (oben) und fließt nach Süden; die Mühle
     steht am Westufer, das Rad (+x) zum Wasser, das Gerinne (−y) kommt
     von bachaufwärts.
     ===================================================================== */
  (function dorfMuehle() {
    let q = null;
    try { q = new URLSearchParams(location.search); } catch (e) { return; }
    if (!q || q.get("muehle") !== "1") return;
    const alt = ST.dorfBauen;
    if (typeof alt !== "function") return;
    const MX = +(q.get("mx") || 32.4), MY = +(q.get("my") || -37.2), MG = +(q.get("mg") || 12);
    ST.dorfBauen = function () {
      alt.apply(this, arguments);
      const SZ = ST.szene;
      const m = SZ.neu("wassermuehle", MX, MY, MG, { saat: 3 });
      /* was im Weg steht (Bäume), räumen */
      const ecken = (typ, x, y, gier) => { const d = ST.MODELLE[typ]; const b = d.grund[0] / 2, t = d.grund[1] / 2, r = gier * RAD, c = Math.cos(r), s = Math.sin(r); return [[-b, -t], [b, -t], [b, t], [-b, t]].map(([px, py]) => [x + px * c - py * s, y + px * s + py * c]); };
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
