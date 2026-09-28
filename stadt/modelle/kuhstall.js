/* =====================================================================
   KUHSTALL — niederdeutscher Fachwerkstall mit großem Scheunentor
   ---------------------------------------------------------------------
   XANDER: „richtig filigran. Richtig schön ausarbeiten mit schönen
   Texturen" · „keine Comic Grafik … viel mehr am Realismus" · „ohne
   Pixelkanten und komische Vektorrückstände" · „Man soll das Fundament
   sehen beim Aufbauen" · „Du bist dein schlimmster Kritiker".

   VORBILD: Stall- und Scheunengebäude in Niedersachsen und Westfalen
   (Hallenhaus-Wirtschaftsteil): Bruchsteinsockel, darauf Eichenfachwerk
   mit roter Backstein-Ausfachung, niedrige Traufe, steiles Dach mit
   Krüppelwalm und Hohlpfannen (S-Pfannen) in Mörtel gesetzten Firsten.
   Im Wirtschaftsgiebel das große, diagonal verstrebte Scheunentor mit
   Schlupftür, darüber der Torbalken mit Inschrift. Der Giebel über dem
   Rähm ist mit Brettern verschalt (Boden-Deckel-Schalung), darin die
   Heuluke; unter dem Krüppelwalm steht der Aufzugsbalken mit Rolle und
   Seil. Auf dem First ein Lüftungsreiter mit Lamellen und Wetterhahn.
   An der Ostseite die geteilte Stalltür (Klöntür) mit Stalllampe und
   kleine weiße Stallfenster; davor die Mistplatte mit dem Misthaufen,
   an der Westseite gestapelte Heuballen, am Giebel die Milchbank.

   MASSE (Meter; x Osten, y Süden, Grundrissmitte auf 0,0)
     Stall      8,0 × 7,0 m (x −4…4, y −4,3…2,7), Traufe 3,4 m,
                Sockel 0,6 m, Dachneigung 50°, First 8,6 m,
                Krüppelwalm (60°) ab 7,1 m, Lüftungsreiter bis 9,5 m,
                Wetterhahn bis rund 10 m
     Tor        3,2 × 3,1 m im Südgiebel, Stalltür 1,05 × 2,05 m (Ost)
     Stallfenster 0,8 × 0,7 m zwischen Brüstungs- und Sturzriegel

   AUFBAU (o.bau): Schnurgerüst → Baugrube und Aushub → Streifenfundament
   (Beton) → Verfüllen, Stallboden → Bruchsteinsockel Lage für Lage →
   Schwellen, Ständer, Riegel, Streben, Rähm (echte Hölzer) → Ausfachung
   Reihe für Reihe → Giebelschalung → Sparren und Kehlbalken → Schalung,
   Lattung, Pfannen Reihe für Reihe → Lüftungsreiter → Tor, Luke, Fenster,
   Türen → Lampen, Heu, Milchbank, Misthaufen.
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
  const toHex = (c) => "#" + c.map((v) => ("0" + Math.round(klemm(v, 0, 255)).toString(16)).slice(-2)).join("");
  function poly(g, p) { g.beginPath(); g.moveTo(p[0][0], p[0][1]); for (let i = 1; i < p.length; i++) g.lineTo(p[i][0], p[i][1]); g.closePath(); }

  /* ---------------- Rauschen, Maserung, Flecken ---------------- */
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
  /* Maserung: dasselbe Rauschen, entlang der Faser stark gestreckt – ein
     Füllbefehl statt hunderter Linien (auch bei 60 Bildpunkten je Meter) */
  function maser(g, x, y, w, h, quer, laengs, staerke, saat, senkrecht) {
    const s = Math.abs(saat | 0);
    const bild = PI.rauschBild(1 + (s % 5), 128, 4, 3, 1.6);
    const m = g.createPattern(bild, "repeat");
    const a = (senkrecht ? quer : laengs) / 128, d = (senkrecht ? laengs : quer) / 128;
    m.setTransform(new DOMMatrix([a, 0, 0, d, (s * 0.131) % 1, (s * 0.217) % 1]));
    g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = staerke; g.fillStyle = m; g.fillRect(x, y, w, h); g.restore();
  }
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
    const k = Math.min(600, Math.round(w * h * dichte));
    g.beginPath();
    for (let i = 0; i < k; i++) { const r = (0.5 + rng() * 0.8) / F.px; g.rect(x + rng() * w, y + rng() * h, r, r); }
    g.fillStyle = farbe || "rgba(255,255,255,0.95)"; g.fill();
  }

  /* ---------------- Licht für durchsichtige Flächen und Figuren ---------------- */
  function belichter(F, extra) {
    const lf = ST.lichtFaktor(F.n, F.zeit, extra || 0, F.jahr);
    return (c, a, k) => rgb([Math.min(255, c[0] * lf[0] * (k || 1)), Math.min(255, c[1] * lf[1] * (k || 1)), Math.min(255, c[2] * lf[2] * (k || 1))], a);
  }
  /* Blickrichtung im Modell aus der Fläche selbst: der Kern hat die Normale
     schon gedreht (F.n), die Fläche kennt ihre ungedrehte (u × v). */
  function blickAus(F) {
    const f = F.flaeche, n0 = kreuz(f.u, f.v), n1 = F.n;
    let c = 1, s = 0;
    if (Math.hypot(n0[0], n0[1]) > 0.2) { const a = Math.atan2(n1[1], n1[0]) - Math.atan2(n0[1], n0[0]); c = Math.cos(a); s = Math.sin(a); }
    return { c: c, s: s, e: [0.6124 * (c + s), 0.6124 * (c - s), 0.5] };
  }
  /* Versatz eines Punkts in der Tiefe d hinter der Fläche (Laibungen) */
  function parallaxe(F, B, d) {
    const f = F.flaeche, n = kreuz(f.u, f.v);
    const en = Math.max(0.12, dot(B.e, n));
    return [d * dot(B.e, f.u) / en, d * dot(B.e, f.v) / en];
  }
  /* Licht einer gedachten Fläche mit Modell-Normale n (Schnee auf der Kante) */
  function lichtN(F, B, n, extra) {
    const nc = [n[0] * B.c - n[1] * B.s, n[0] * B.s + n[1] * B.c, n[2]];
    return ST.lichtFaktor(nc, F.zeit, extra || 0, F.jahr);
  }
  const lichtMal = (lf) => (c, a, k) => rgb([Math.min(255, c[0] * lf[0] * (k || 1)), Math.min(255, c[1] * lf[1] * (k || 1)), Math.min(255, c[2] * lf[2] * (k || 1))], a);
  function figurLicht(F) {
    const Zt = F.Z || ST.ZEITEN.tag;
    const lL = ST.lichtFaktor([-0.707, 0.707, 0], Zt, 0, F.jahr), lR = ST.lichtFaktor([0.707, -0.707, 0], Zt, 0, F.jahr);
    const lV = ST.lichtFaktor([0.707, 0.707, 0], Zt, 0, F.jahr), lO = ST.lichtFaktor([0, 0, 1], Zt, 0, F.jahr);
    const lit = (c, l, a) => rgb([Math.min(255, c[0] * l[0]), Math.min(255, c[1] * l[1]), Math.min(255, c[2] * l[2])], a);
    return { lL: lL, lR: lR, lV: lV, lO: lO, lit: lit };
  }

  /* ---------------- Flächen-Hilfen ---------------- */
  function wand(M, o, n, w, h, malen, extra) {
    const u = kreuz(n, Z3);
    return M.flaeche(Object.assign({ o: o, u: u, v: [0, 0, -1], w: w, h: h, malen: malen }, extra || {}));
  }
  /* Kasten x0…x1, y0…y1, z0…z1; m = { s, n, o, w, t } Maler (Süd, Nord, Ost, West, oben) */
  function kiste(M, x0, y0, z0, x1, y1, z1, m, extra) {
    const ex = (name) => Object.assign({}, extra || {}, { name: ((extra && extra.name) || "k") + "-" + name });
    const h = z1 - z0, ao = z0 < 0.05 ? { ao: true } : {};
    if (m.s) wand(M, [x0, y1, z1], [0, 1, 0], x1 - x0, h, m.s, Object.assign(ao, ex("s")));
    if (m.n) wand(M, [x1, y0, z1], [0, -1, 0], x1 - x0, h, m.n, Object.assign({}, ao, ex("n")));
    if (m.o) wand(M, [x1, y1, z1], [1, 0, 0], y1 - y0, h, m.o, Object.assign({}, ao, ex("o")));
    if (m.w) wand(M, [x0, y0, z1], [-1, 0, 0], y1 - y0, h, m.w, Object.assign({}, ao, ex("w")));
    if (m.t) M.flaeche(Object.assign({ o: [x0, y0, z1], u: [1, 0, 0], v: [0, 1, 0], w: x1 - x0, h: y1 - y0, malen: m.t }, ex("t")));
  }
  /* Ebenes Vieleck aus Raumpunkten: n = Außennormale, u = Richtung „rechts"
     (v = n × u zeigt dann „nach unten" in der Fläche) */
  function vieleck(M, name, pts, n, u, malen, extra) {
    n = nrm(n); u = nrm(u);
    const v = kreuz(n, u), p0 = pts[0];
    const ab = pts.map((p) => { const d = sub(p, p0); return [dot(d, u), dot(d, v)]; });
    let a0 = Infinity, b0 = Infinity, a1 = -Infinity, b1 = -Infinity;
    for (const [a, b] of ab) { a0 = Math.min(a0, a); b0 = Math.min(b0, b); a1 = Math.max(a1, a); b1 = Math.max(b1, b); }
    const o = add(add(p0, mul(u, a0)), mul(v, b0));
    return M.flaeche(Object.assign({ name: name, o: o, u: u, v: v, w: a1 - a0, h: b1 - b0, umriss: ab.map(([a, b]) => [a - a0, b - b0]), malen: malen }, extra || {}));
  }
  /* Balken beliebiger Richtung: Achse P0→P1, Querschnitt b (entlang Q) × d */
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
    const langU = (n) => { let u = U; if (dot(kreuz(n, u), Z3) > 0) u = mul(U, -1); return u; };
    if (seiten.indexOf("Q") >= 0) rechteck(add(mid, mul(Q, b / 2)), Q, langU(Q), L, d, mal("Q", L, d), "Q");
    if (seiten.indexOf("q") >= 0) rechteck(add(mid, mul(Q, -b / 2)), mul(Q, -1), langU(mul(Q, -1)), L, d, mal("q", L, d), "q");
    if (seiten.indexOf("R") >= 0) rechteck(add(mid, mul(R, d / 2)), R, langU(R), L, b, mal("R", L, b), "R");
    if (seiten.indexOf("r") >= 0) rechteck(add(mid, mul(R, -d / 2)), mul(R, -1), langU(mul(R, -1)), L, b, mal("r", L, b), "r");
    if (seiten.indexOf("a") >= 0) rechteck(P0, mul(U, -1), Q, b, d, mal("a", b, d), "a");
    if (seiten.indexOf("e") >= 0) rechteck(P1, U, Q, b, d, mal("e", b, d), "e");
  }

  /* =====================================================================
     HAUPTMASSE
     ===================================================================== */
  const X1 = 4.0, YS = 2.7, YN = -4.3, YM = (YS + YN) / 2, LT = YS - YN;
  const ZS = 0.6, ZT = 3.4, PB = 0.2;             // Sockel, Rähm, Holzstärke
  const ZSW = ZS + 0.2, ZRA = ZT - 0.22;          // Oberkante Schwelle, Unterkante Rähm
  const R_BR = 1.57, R_ST = 2.43;                  // Riegel: Brüstung, Sturz (Mitte)
  const NEIG = 50 * RAD, TN = Math.tan(NEIG), cosN = Math.cos(NEIG), sinN = Math.sin(NEIG);
  const DICKE = 0.26, DV = DICKE / cosN;
  const UE = 0.5, OGV = 0.35;                      // Trauf- und Giebelüberstand
  const ZF = ZT + DV + X1 * TN;                    // First (Pfannenoberfläche) ≈ 8,57
  const XTE = X1 + UE, ZTE = ZT + DV - UE * TN;    // Traufkante
  const WNEIG = 60 * RAD, TW = Math.tan(WNEIG), cosW = Math.cos(WNEIG), sinW = Math.sin(WNEIG);
  const ZWE = 7.1;                                 // Traufe des Krüppelwalms
  const XWE = (ZF - ZWE) / TN;                     // halbe Breite der Walmtraufe
  const YWE1 = YS + OGV, YWE0 = YN - OGV;          // Walmtraufe Süd / Nord
  const YF1 = YWE1 - (ZF - ZWE) / TW, YF0 = YWE0 + (ZF - ZWE) / TW;   // Firstenden
  const GV = 0.06;                                 // Giebelschalung steht vor
  function giebelOben(yP) { return ZF - (Math.abs(yP - YM) - (YF1 - YM)) * TW - DICKE / cosW; }
  const ZG = giebelOben(YS + GV), XG = X1 - (ZG - ZT) / TN;
  const HAUS_M = [0, YM, 3];
  /* Lüftungsreiter auf dem First */
  const RX = 0.55, RY0 = YM - 0.65, RY1 = YM + 0.65, RZ = ZF + 0.62, RNEIG = 42 * RAD;
  /* Mistplatte und Heu */
  const MX0 = 4.45, MX1 = 5.55, MY0 = -3.95, MY1 = -1.35;

  /* =====================================================================
     WERKSTOFFE
     ===================================================================== */
  const EICHE = [78, 60, 46];            // gealtertes, dunkel geöltes Eichenholz
  const EICHE_ROH = [172, 134, 94];      // frisch abgebundenes Eichenholz
  const FUGE = [192, 186, 172];
  const BRETT = [124, 104, 84];          // Giebelschalung, silbrig verwittert
  const BRETT_ROH = [188, 152, 108];
  const PFANNE = [174, 80, 48];
  const EISEN = [46, 44, 44];
  const BETON = [168, 166, 160];
  const ERDE = [112, 88, 62];
  const TORFARBEN = [[122, 50, 38], [64, 88, 66], [128, 98, 70]];   // Ochsenblut, Tannengrün, Eiche natur

  /* ---------------- Holz ---------------- */
  function holzMalen(g, F, x, y, w, h, c, saat, senkrecht) {
    g.fillStyle = rgb(c); g.fillRect(x, y, w, h);
    if (F.px > 9) maser(g, x, y, w, h, 0.035, 1.4, 0.45, saat, senkrecht);
    rausch(g, x, y, w, h, 1.1, 0.2, saat + 3, 3);
  }
  /* Boden-Deckel-Schalung (senkrecht): Bretter, über den Fugen Deckleisten,
     die einen feinen Schatten werfen; Regenspuren von oben, unten dunkler */
  function schalungMalen(g, F, x, y, w, h, c, saat, opt) {
    opt = opt || {};
    const rng = zufall(saat), px = F.px, bb = 0.22;
    g.fillStyle = rgb(c); g.fillRect(x, y, w, h);
    if (px * bb > 3) {
      for (let xx = x; xx < x + w; xx += bb) {
        const cc = PI.streu(c, rng, 0.09);
        g.fillStyle = rgb(cc); g.fillRect(xx, y, bb, h);
      }
    }
    if (px > 9) maser(g, x, y, w, h, 0.03, 1.6, 0.5, saat, true);
    /* Regenspuren: dunkle senkrechte Schlieren von oben */
    if (px > 5) {
      g.save();
      for (let i = 0; i < w * 1.6; i++) {
        const sx = x + rng() * w, sl = 0.6 + rng() * 1.8, sb = 0.05 + rng() * 0.18;
        const gr = g.createLinearGradient(0, y, 0, y + sl);
        gr.addColorStop(0, "rgba(40,34,30,0.22)"); gr.addColorStop(1, "rgba(40,34,30,0)");
        g.fillStyle = gr; g.fillRect(sx, y, sb, sl);
      }
      g.restore();
    }
    /* Deckleisten */
    if (px * 0.06 > 1.2) {
      const sv = F.schatten ? F.schatten(0.025) : null;
      const lb = 0.06;
      for (let xx = x + bb; xx < x + w; xx += bb) {
        if (sv) { g.fillStyle = "rgba(20,16,14,0.35)"; g.fillRect(xx - lb / 2 + sv[0], y, lb, h); }
        const cl = hell(PI.streu(c, rng, 0.06), 0.06);
        const gr = g.createLinearGradient(xx - lb / 2, 0, xx + lb / 2, 0);
        gr.addColorStop(0, rgb(hell(cl, 0.1))); gr.addColorStop(0.5, rgb(cl)); gr.addColorStop(1, rgb(hell(cl, -0.25)));
        g.fillStyle = gr; g.fillRect(xx - lb / 2, y, lb, h);
        if (px > 40) { g.fillStyle = "rgba(30,28,26,0.7)"; for (let yy = y + 0.3 + rng() * 0.2; yy < y + h; yy += 0.7) { g.beginPath(); g.arc(xx, yy, 0.006, 0, TAU); g.fill(); } }
      }
    } else if (px * bb > 2.5) {
      g.fillStyle = rgb(hell(c, -0.35), 0.6);
      for (let xx = x + bb; xx < x + w; xx += bb) g.fillRect(xx - 0.01, y, 0.02, h);
    }
    /* unten Spritzwasser, oben Schatten */
    const gu = g.createLinearGradient(0, y + h - 0.8, 0, y + h);
    gu.addColorStop(0, "rgba(40,32,26,0)"); gu.addColorStop(1, "rgba(40,32,26,0.3)");
    g.fillStyle = gu; g.fillRect(x, y + h - 0.8, w, 0.8);
    rausch(g, x, y, w, h, 3, 0.18, saat + 5, 4);
    if (px > 10) bleich(g, x, y, w, h, 2.4, 0.1, saat + 2);
    void opt;
  }

  /* ---------------- Backstein-Ausfachung ----------------
     Handstrichziegel im Läuferverband, jede Lage gegen die vorige um einen
     halben Stein versetzt; nach Farbeimern gebündelt (wenige Füllungen). */
  const ZH = 0.075, ZL = 0.25;
  const ZIEGEL_T = [[150, 62, 44], [163, 75, 50], [138, 56, 41], [173, 92, 60], [116, 48, 36], [156, 68, 50], [146, 80, 58]];
  function ziegelMalen(g, F, x, y, w, h, saat, opt) {
    opt = opt || {};
    const px = F.px;
    g.fillStyle = rgb(FUGE); g.fillRect(x, y, w, h);
    if (px * ZH < 1.8) {
      g.fillStyle = "rgb(150,68,48)"; g.fillRect(x, y, w, h);
      if (px * ZH > 1.1) { g.fillStyle = "rgba(210,200,186,0.22)"; for (let yy = y + h; yy > y; yy -= ZH) g.fillRect(x, yy - 0.01, w, 0.012); }
      rausch(g, x, y, w, h, 2.5, 0.22, saat, 3);
      return;
    }
    const rng = zufall(saat * 17 + 5);
    const j = Math.max(0.011, 0.75 / px);
    const pf = ZIEGEL_T.map(() => new Path2D());
    const schatten = new Path2D(), licht = new Path2D();
    const sd = Math.max(0.006, 0.9 / px);
    let yb = y + h, reihe = 0;
    while (yb > y - 0.001) {
      const yt = yb - ZH, off = ((reihe + (opt.lage || 0)) % 2) * ZL / 2;
      for (let xx = x - off; xx < x + w; xx += ZL) {
        const r = rng();
        const k = r < 0.22 ? 0 : r < 0.42 ? 1 : r < 0.6 ? 2 : r < 0.7 ? 3 : r < 0.76 ? 4 : r < 0.92 ? 5 : 6;
        pf[k].rect(xx + j / 2, yt + j / 2, ZL - j, ZH - j);
        if (px > 22) { schatten.rect(xx + j / 2, yb - j / 2 - sd, ZL - j, sd); licht.rect(xx + j / 2, yt + j / 2, ZL - j, sd * 0.8); }
      }
      yb = yt; reihe++;
    }
    for (let i = 0; i < pf.length; i++) { g.fillStyle = rgb(ZIEGEL_T[i]); g.fill(pf[i]); }
    if (px > 22) {
      g.fillStyle = "rgba(40,16,10,0.32)"; g.fill(schatten);
      g.fillStyle = "rgba(255,220,190,0.18)"; g.fill(licht);
    }
    if (px > 30) rausch(g, x, y, w, h, 0.35, 0.16, saat + 9, 2);
    rausch(g, x, y, w, h, 2.6, 0.2, saat + 3, 4);
    if (px > 10) bleich(g, x, y, w, h, 1.9, 0.08, saat);
  }

  /* ---------------- Bruchstein (Sockel) ----------------
     Unregelmäßige Steine in Kalkmörtel, unten größere Blöcke; das Layout
     wird je Fläche einmal gebaut und gemerkt. */
  const BS_FARBEN = [[150, 140, 126], [168, 156, 136], [132, 124, 114], [120, 108, 96], [176, 164, 142], [144, 128, 110], [158, 150, 138], [114, 110, 104]];
  const MOERTEL = [190, 184, 170];
  const BS_CACHE = new Map();
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
    const neu = (s0, t0, s1, t1, yb, yt) => {
      if (s1 - s0 < 0.04 || t1 - t0 < 0.03) return;
      steine.push({ pts: steinUmriss(rng, s0, t0, s1, t1), box: [s0, t0, s1, t1], c: (rng() * BS_FARBEN.length) | 0, k: (rng() * 3) | 0, yb: yb, yt: yt });
    };
    let yb = h, reihe = 0;
    while (yb > 0.005) {
      const gross = reihe < 1;
      let rh = (gross ? 0.28 : 0.17) + rng() * (gross ? 0.12 : 0.14);
      if (yb - rh < 0.12) rh = yb;
      const yt = yb - rh;
      let x = -rng() * 0.4;
      while (x < w) {
        const lw = Math.max(0.2, rh * (1.0 + rng() * 1.8));
        const x1 = x + lw, m = 0.022 + rng() * 0.018;
        if (rng() < 0.25 && rh > 0.22) {
          const tm = yt + rh * (0.4 + rng() * 0.2);
          neu(x + m, yt + m * 0.7, x1 - m, tm - m * 0.5, yb, yt);
          neu(x + m, tm + m * 0.5, x1 - m, yb - m * 0.7, yb, yt);
        } else neu(x + m, yt + m * 0.7 + (rng() < 0.3 ? rng() * 0.04 : 0), x1 - m, yb - m * 0.7, yb, yt);
        x = x1;
      }
      yb = yt; reihe++;
    }
    L = { steine: steine, pfade: new Map() };
    BS_CACHE.set(key, L);
    if (BS_CACHE.size > 60) BS_CACHE.delete(BS_CACHE.keys().next().value);
    return L;
  }
  function bruchPfade(L, fein, filter) {
    const k = fein ? "f" : "g";
    let P = filter ? null : L.pfade.get(k);
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
      licht.moveTo(p[14][0], p[14][1]); for (let i = 15; i <= 16; i++) licht.lineTo(p[i][0], p[i][1]); for (let i = 0; i <= 3; i++) licht.lineTo(p[i][0], p[i][1]);
      fuge.moveTo(p[6][0], p[6][1]); for (let i = 7; i <= 13; i++) fuge.lineTo(p[i][0], p[i][1]);
    }
    P = { eimer: eimer, licht: licht, fuge: fuge };
    if (!filter) L.pfade.set(k, P);
    return P;
  }
  /* bis = gemauerte Höhe von unten (Bau), sonst ganz */
  function bruchsteinMalen(g, F, x, y, w, h, opt) {
    opt = opt || {};
    const px = F.px, saat = opt.saat || 1;
    const ob = opt.bis == null ? y : y + h - opt.bis;
    g.fillStyle = rgb(MOERTEL);
    g.fillRect(x - 0.02, ob - 0.02, w + 0.04, y + h - ob + 0.04);
    if (px < 6) {
      g.fillStyle = "rgba(146,136,122,0.8)"; g.fillRect(x, ob, w, y + h - ob);
      rausch(g, x, ob, w, y + h - ob, 3, 0.2, saat, 3);
      return;
    }
    const L = bruchLayout(saat, w, h);
    const fein = px > 28;
    const filter = opt.bis == null || opt.bis >= h - 0.005 ? null : (s) => s.yt >= h - opt.bis - 0.01;
    const P = bruchPfade(L, fein, filter);
    g.save();
    g.translate(x, y);
    for (const [key, e] of P.eimer) {
      const c = hell(BS_FARBEN[(key / 3) | 0], (key % 3 - 1) * 0.08);
      g.fillStyle = rgb(c); g.fill(e.stein);
      if (e.kern) { g.fillStyle = rgb(hell(c, 0.07)); g.fill(e.kern); }
    }
    if (fein) {
      g.lineWidth = Math.max(0.006, 1.1 / px);
      g.strokeStyle = "rgba(255,248,232," + (F.lichtN > 0.05 ? 0.3 : 0.14) + ")";
      g.stroke(P.licht);
      g.strokeStyle = "rgba(34,30,26,0.45)";
      g.lineWidth = Math.max(0.008, 1.4 / px);
      g.stroke(P.fuge);
    } else if (px > 12) {
      g.fillStyle = "rgba(34,30,26,0.28)";
      g.beginPath();
      for (const s of L.steine) if (!filter || filter(s)) g.rect(s.box[0], s.box[3] - Math.max(0.012, 1.1 / px), s.box[2] - s.box[0], Math.max(0.012, 1.1 / px));
      g.fill();
    }
    g.restore();
    rausch(g, x, ob, w, y + h - ob, 2.4, 0.16, saat + 5, 4);
    /* grüner Anflug unten (Spritzwasser, Algen) */
    const gr = g.createLinearGradient(0, y + h, 0, y + h - 0.35);
    gr.addColorStop(0, "rgba(70,80,50,0.28)"); gr.addColorStop(1, "rgba(70,80,50,0)");
    g.fillStyle = gr; g.fillRect(x, y + h - 0.35, w, 0.35);
  }

  /* ---------------- Beton und Erde (Bauphasen) ---------------- */
  function betonMalen(g, F, w, h, saat, frisch) {
    g.fillStyle = rgb(frisch ? hell(BETON, -0.12) : BETON); g.fillRect(-0.05, -0.05, w + 0.1, h + 0.1);
    rausch(g, 0, 0, w, h, 2.2, 0.25, saat, 4);
    if (F.px > 20) rausch(g, 0, 0, w, h, 0.3, 0.18, saat + 4, 2);
    bleich(g, 0, 0, w, h, 1.7, 0.1, saat + 1);
  }
  function erdeMalen(g, F, w, h, saat, winter) {
    g.fillStyle = rgb(ERDE); g.fillRect(-0.05, -0.05, w + 0.1, h + 0.1);
    tonFlecken(g, 0, 0, w, h, 1.6, 0.5, saat, "#5e4630");
    tonFlecken(g, 0, 0, w, h, 0.9, 0.35, saat + 3, "#9a7a56");
    if (F.px > 18) {
      const rng = zufall(saat + 11);
      g.fillStyle = "rgba(160,150,136,0.8)";
      g.beginPath();
      for (let i = 0; i < Math.min(500, w * h * 14); i++) { const x = rng() * w, y = rng() * h, r = 0.012 + rng() * 0.03; g.moveTo(x + r, y); g.ellipse(x, y, r, r * 0.7, rng() * 3, 0, TAU); }
      g.fill();
    }
    if (winter) tonFlecken(g, 0, 0, w, h, 1.3, 0.55, saat + 7, "#e6ecf4", true);
  }

  /* =====================================================================
     DACH: Hohlpfannen (S-Pfannen)
     In der Dachfläche: x entlang der Traufe, y vom First (0) zur Traufe.
     Eine Pfanne als Musterbild (Mulde links, Wulst rechts, Schatten der
     oberen Reihe mit gewellter Unterkante) – einmal gemalt, dann als
     Füllmuster gelegt: gestochen scharf in jeder Zoomstufe und schnell.
     ===================================================================== */
  const PF_B = 0.21, PF_R = 0.3;
  let PF_BILD = null;
  function pfannenBild() {
    if (PF_BILD) return PF_BILD;
    const W = 72, H = Math.round(72 * PF_R / PF_B);
    const c = document.createElement("canvas"); c.width = W; c.height = H;
    const g = c.getContext("2d");
    /* Profilhelligkeit quer: Mulde (0…0,62) und Wulst (0,62…1) */
    const P = [[0, 0.58], [0.06, 0.78], [0.26, 0.68], [0.44, 0.9], [0.6, 1.04], [0.72, 1.2], [0.8, 1.12], [0.92, 0.66], [1, 0.5]];
    const prof = (t) => { for (let i = 1; i < P.length; i++) if (t <= P[i][0]) { const a = P[i - 1], b = P[i], k = (t - a[0]) / (b[0] - a[0]); const s = k * k * (3 - 2 * k); return a[1] + (b[1] - a[1]) * s; } return P[P.length - 1][1]; };
    for (let x = 0; x < W; x++) {
      const k = prof((x + 0.5) / W);
      g.fillStyle = rgb(PFANNE.map((v) => Math.min(255, v * k)));
      g.fillRect(x, 0, 1, H);
    }
    /* Längs: unter der Überdeckung dunkler, zur Nase hin heller */
    const gl = g.createLinearGradient(0, 0, 0, H);
    gl.addColorStop(0, "rgba(40,14,8,0.28)"); gl.addColorStop(0.35, "rgba(40,14,8,0.05)"); gl.addColorStop(0.85, "rgba(255,210,170,0.06)"); gl.addColorStop(1, "rgba(255,210,170,0.12)");
    g.fillStyle = gl; g.fillRect(0, 0, W, H);
    /* Schlagschatten der oberen Reihe: in der Mulde länger als am Wulst */
    const tiefe = (t) => (t < 0.62 ? Math.sin(t / 0.62 * Math.PI) : -0.35 * Math.sin((t - 0.62) / 0.38 * Math.PI));
    g.beginPath(); g.moveTo(0, 0);
    for (let x = 0; x <= W; x += 2) g.lineTo(x, H * (0.1 + 0.07 * tiefe(x / W)));
    g.lineTo(W, 0); g.closePath();
    g.fillStyle = "rgba(34,10,6,0.55)"; g.fill();
    g.beginPath(); g.moveTo(0, 0);
    for (let x = 0; x <= W; x += 2) g.lineTo(x, H * (0.16 + 0.08 * tiefe(x / W)));
    g.lineTo(W, 0); g.closePath();
    g.fillStyle = "rgba(34,10,6,0.18)"; g.fill();
    /* Nase der eigenen Pfanne unten: helle Kante */
    g.strokeStyle = "rgba(255,214,176,0.35)"; g.lineWidth = 1.4;
    g.beginPath(); for (let x = 0; x <= W; x += 2) { const y = H - 1.5 - 3 * Math.max(0, -tiefe(x / W)); if (x) g.lineTo(x, y); else g.moveTo(x, y); } g.stroke();
    /* Tonkorn */
    const id = g.getImageData(0, 0, W, H), d = id.data, rng = zufall(77);
    for (let i = 0; i < W * H; i++) { const n = (rng() - 0.5) * 16; d[i * 4] = klemm(d[i * 4] + n, 0, 255); d[i * 4 + 1] = klemm(d[i * 4 + 1] + n * 0.8, 0, 255); d[i * 4 + 2] = klemm(d[i * 4 + 2] + n * 0.7, 0, 255); }
    g.putImageData(id, 0, 0);
    PF_BILD = c;
    return c;
  }
  const MOOS = [104, 106, 70], FLECHTE = [168, 160, 118];
  /* opt: nord (0…1), bisReihe/teilReihe (Bau), welt (Rauschversatz), laub */
  function pfannenMalen(g, F, x0, x1, yTraufe, yOben, saat, opt) {
    opt = opt || {};
    const px = F.px, w = x1 - x0, h = yTraufe - yOben;
    const nord = opt.nord || 0, ow = opt.welt || 0;
    const moos = (x, y) => {
      const r = ST.fbm((x + ow) * 0.45, y * 0.6 + saat * 0.13, 3, 7 + saat);
      const traufe = klemm(1 - (yTraufe - y) / 1.8, 0, 1);
      return klemm((r - 0.5) * 2.2 + traufe * 0.5 + nord * 0.5 - 0.3, 0, 1);
    };
    const yGrenze = opt.bisReihe != null ? yTraufe - (opt.bisReihe + 1) * PF_R : yOben - 0.1;
    g.save();
    if (opt.bisReihe != null) {
      g.beginPath();
      g.moveTo(x0 - 0.1, yTraufe + 0.1); g.lineTo(x1 + 0.1, yTraufe + 0.1); g.lineTo(x1 + 0.1, yGrenze + PF_R);
      const xt = x0 + w * (opt.teilReihe == null ? 1 : opt.teilReihe);
      g.lineTo(xt, yGrenze + PF_R); g.lineTo(xt, yGrenze); g.lineTo(x0 - 0.1, yGrenze); g.closePath(); g.clip();
    }
    if (px * PF_R < 3) {
      /* weit weg: Reihenstreifen */
      g.fillStyle = rgb(PFANNE); g.fillRect(x0 - 0.05, yOben - 0.05, w + 0.1, h + 0.1);
      g.fillStyle = "rgba(60,20,10,0.28)";
      for (let y = yTraufe; y > yOben; y -= PF_R) g.fillRect(x0 - 0.05, y - PF_R, w + 0.1, PF_R * 0.22);
    } else {
      const bild = pfannenBild();
      const m = g.createPattern(bild, "repeat");
      const k = PF_B / bild.width;
      m.setTransform(new DOMMatrix([k, 0, 0, PF_R / bild.height, x0, yTraufe]));
      g.fillStyle = m; g.fillRect(x0 - 0.05, yOben - 0.05, w + 0.1, h + 0.1);
      /* Farbe je Pfanne (gebrannt, nachgekauft, bemoost) – vier Eimer */
      if (px * PF_B > 4) {
        const rr = zufall(saat * 13 + 1);
        const E = [new Path2D(), new Path2D(), new Path2D(), new Path2D(), new Path2D()];
        for (let y = yTraufe; y > yOben - PF_R; y -= PF_R) {
          for (let x = x0 + Math.floor((-0.001) / PF_B) * PF_B; x < x1; x += PF_B) {
            const r = rr(), mo = moos(x, y);
            if (mo > 0.55 && rr() < mo) E[3].rect(x, y - PF_R, PF_B, PF_R);
            else if (mo > 0.3 && rr() < mo) E[4].rect(x, y - PF_R * 0.45, PF_B * 0.62, PF_R * 0.45);
            else if (r < 0.14) E[0].rect(x, y - PF_R, PF_B, PF_R);
            else if (r < 0.26) E[1].rect(x, y - PF_R, PF_B, PF_R);
            else if (r < 0.33) E[2].rect(x, y - PF_R, PF_B, PF_R);
          }
        }
        g.fillStyle = "rgba(60,18,8,0.16)"; g.fill(E[0]);
        g.fillStyle = "rgba(255,186,140,0.12)"; g.fill(E[1]);
        g.fillStyle = "rgba(96,86,76,0.2)"; g.fill(E[2]);
        g.fillStyle = rgb(MOOS, 0.34); g.fill(E[3]);
        g.fillStyle = rgb(MOOS, 0.45); g.fill(E[4]);
      }
      /* Flechten: gelbgraue Tupfen (nah) */
      if (px > 30) {
        const rr = zufall(saat + 51);
        g.fillStyle = rgb(FLECHTE, 0.55);
        g.beginPath();
        for (let i = 0; i < Math.min(900, w * h * 5); i++) { const x = x0 + rr() * w, y = yOben + rr() * h; if (moos(x, y) < 0.25) continue; const r = 0.008 + rr() * 0.02; g.moveTo(x + r, y); g.arc(x, y, r, 0, TAU); }
        g.fill();
      }
    }
    /* großes Moos und Verwitterung */
    tonFlecken(g, x0, yOben, w, h, 2.6, 0.22 + nord * 0.2, saat + 31, "#6a6a46");
    rausch(g, x0, yOben, w, h, 4.2, 0.2, saat + 8, 4);
    if (px > 12) bleich(g, x0, yOben, w, h, 3.1, 0.07, saat + 3);
    if (opt.laub) laubMalen(g, F, x0, yOben, w, h, saat + 91, 1.4, yTraufe);
    g.restore();
  }
  /* Herbstlaub: kleine Blätter, zur Traufe hin dichter */
  const LAUB = [[186, 104, 34], [204, 146, 46], [150, 70, 30], [120, 84, 44], [214, 170, 70]];
  function laubMalen(g, F, x, y, w, h, saat, dichte, yDicht) {
    if (F.px < 6) return;
    const rng = zufall(saat), px = F.px;
    const pf = LAUB.map(() => new Path2D());
    const n = Math.min(1600, Math.round(w * h * 4 * dichte));
    for (let i = 0; i < n; i++) {
      let yy = y + rng() * h;
      if (yDicht != null && rng() < 0.5) yy = yDicht - Math.pow(rng(), 2) * h * 0.4;
      const xx = x + rng() * w, r = Math.max(0.025, 0.7 / px) * (0.8 + rng() * 0.8), a = rng() * TAU;
      const p = pf[(rng() * pf.length) | 0];
      p.moveTo(xx + Math.cos(a) * r, yy + Math.sin(a) * r * 0.6);
      p.ellipse(xx, yy, r, r * 0.55, a, 0, TAU);
    }
    for (let i = 0; i < pf.length; i++) { g.fillStyle = rgb(LAUB[i], 0.9); g.fill(pf[i]); }
  }
  /* Firstziegel (rund, in Mörtel gesetzt) entlang einer Linie in der Fläche */
  function firstBand(g, F, p, q, winter) {
    const L = Math.hypot(q[0] - p[0], q[1] - p[1]);
    if (L < 0.05) return;
    g.save(); g.translate(p[0], p[1]); g.rotate(Math.atan2(q[1] - p[1], q[0] - p[0]));
    if (winter) { g.fillStyle = "rgba(246,249,253,0.95)"; g.fillRect(-0.02, -0.05, L + 0.04, 0.16); g.restore(); return; }
    g.fillStyle = "rgb(186,180,166)"; g.fillRect(-0.02, -0.02, L + 0.04, 0.2);
    rausch(g, 0, -0.02, L, 0.2, 0.6, 0.3, 7, 3);
    const c = hell(PFANNE, -0.08);
    for (let a = 0; a < L; a += 0.38) {
      const gr = g.createLinearGradient(0, -0.04, 0, 0.14);
      gr.addColorStop(0, rgb(hell(c, 0.14))); gr.addColorStop(0.5, rgb(c)); gr.addColorStop(1, rgb(hell(c, -0.3)));
      g.fillStyle = gr;
      g.beginPath(); g.moveTo(a, -0.04); g.lineTo(a + 0.4, -0.04); g.quadraticCurveTo(a + 0.42, 0.05, a + 0.4, 0.14); g.lineTo(a + 0.02, 0.14); g.closePath(); g.fill();
      if (F.px > 20) { g.fillStyle = "rgba(40,14,8,0.35)"; g.fillRect(a + 0.38, -0.04, 0.02, 0.18); }
    }
    g.restore();
  }
  /* Schalung und Lattung während des Eindeckens */
  function lattungMalen(g, F, x0, w, h) {
    holzMalen(g, F, x0 - 0.05, -0.05, w + 0.1, h + 0.1, hell(BRETT_ROH, -0.08), 41, true);
    g.fillStyle = "rgba(40,30,20,0.35)";
    for (let x = x0 + 0.2; x < x0 + w; x += 0.2) g.fillRect(x, -0.05, 0.008, h + 0.1);
    for (let y = h - 0.05; y > 0; y -= PF_R) {
      g.fillStyle = "rgba(30,22,16,0.4)"; g.fillRect(x0 - 0.05, y - 0.01, w + 0.1, 0.05);
      g.fillStyle = rgb(hell(EICHE_ROH, 0.08)); g.fillRect(x0 - 0.05, y - 0.03, w + 0.1, 0.04);
    }
  }

  /* ---------------- Schnee ---------------- */
  function schneeFlaeche(g, F, x, y, w, h, saat, opt) {
    opt = opt || {};
    const rng = zufall(saat * 131 + 7);
    g.fillStyle = "rgb(232,237,245)"; g.fillRect(x, y, w, h);
    if (F.px > 3) {
      tonFlecken(g, x, y, w, h, 3.3, 0.6, saat + 31, "#b4c2d8", true);
      if (opt.zwischen) opt.zwischen();
      tonFlecken(g, x, y, w, h, 1.9, 0.75, saat + 47, "#f6f8fc", true);
      if (F.px > 16) tonFlecken(g, x, y, w, h, 0.7, 0.3, saat + 53, "#c9d4e6");
    }
    const n = Math.min(7, Math.round(w * h * 0.08) + 2);
    for (let i = 0; i < n; i++) {
      const cx = x + rng() * w, cy = y + rng() * h, rx = 0.9 + rng() * 2.2, ry = 0.08 + rng() * 0.16;
      const gg = g.createRadialGradient(cx, cy, 0, cx, cy, rx);
      const hk = rng() < 0.5;
      gg.addColorStop(0, hk ? "rgba(252,253,255,0.55)" : "rgba(140,160,200,0.28)"); gg.addColorStop(1, hk ? "rgba(252,253,255,0)" : "rgba(140,160,200,0)");
      g.save(); g.translate(cx, cy); g.scale(1, ry / rx); g.fillStyle = gg; g.beginPath(); g.arc(0, 0, rx, 0, TAU); g.fill(); g.restore();
    }
    if (opt.glitzer !== false) glitzer(g, F, x, y, w, h, 6, rng);
  }
  /* Pfannenreihen unter dem Schnee: weiche Stufen, in Stücken */
  function schneeRippen(g, F, x0, x1, yTraufe, yAb, saat) {
    const pxV = F.pxV || F.px, ZR = PF_R;
    if (pxV * ZR < 2.2) return;
    const rng = zufall(saat * 3 + 1);
    const st = klemm((pxV * ZR - 2.2) / 3, 0.4, 1);
    const reihen = [[], [], []];
    for (let k = 1; ; k++) {
      const yu = yTraufe - k * ZR;
      if (yu < yAb) break;
      const t = klemm((yTraufe - yu) / Math.max(0.5, yTraufe - yAb), 0, 1);
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
      const m = st * [0.5, 0.3, 0.15][k];
      band(liste, -0.026, 0); g.fillStyle = "rgba(255,255,255," + (0.3 * m).toFixed(3) + ")"; g.fill();
      band(liste, 0, 0.055); g.fillStyle = "rgba(104,124,180," + (0.2 * m).toFixed(3) + ")"; g.fill();
    });
  }
  /* Schneedecke auf dem Dach: am First (Luv) weht der Wind die Pfannen
     frei – dort liegt Schnee nur in den Mulden, als senkrechte Streifen;
     darunter die geschlossene Decke mit gerundeter Abbruchkante. */
  function dachSchnee(g, F, x0, x1, yTraufe, yOben, saat, opt) {
    opt = opt || {};
    const w = x1 - x0, h = yTraufe - yOben, rng = zufall(saat * 7 + 3), px = F.px;
    const oben = opt.oben == null ? 0.3 : opt.oben;
    const grenze = (x) => yOben + klemm((0.05 + (ST.fbm(x * 0.42 + saat * 0.7, saat * 0.31, 3, saat) - 0.3) * 1.5) * oben / 0.36 + Math.sin(x * 1.7 + saat) * 0.03, 0.03, 0.95);
    const kanteP = []; for (let x = x0 - 0.1; x <= x1 + 0.15; x += 0.1) kanteP.push([x, grenze(x)]);
    if (oben > 0.01) {
      g.save(); g.beginPath(); g.rect(x0 - 0.1, yOben - 0.1, w + 0.2, oben + 0.9); g.clip();
      pfannenMalen(g, F, x0 - 0.05, x1 + 0.05, yTraufe, yOben, saat, { nord: opt.nord });
      g.fillStyle = "rgba(226,232,242,0.2)"; g.fillRect(x0 - 0.1, yOben - 0.1, w + 0.2, oben + 0.9);
      /* Schnee in den Mulden */
      if (px * PF_B > 3) {
        g.beginPath();
        for (let x = x0 + Math.floor(-0.001 / PF_B) * PF_B; x < x1; x += PF_B) {
          const lg = rng();
          const y1 = grenze(x + PF_B * 0.3) + 0.08, y0 = Math.min(y1 - 0.03, yOben + 0.02 + Math.pow(rng(), 0.7) * (y1 - yOben));
          if (lg < 0.3) continue;
          const bx = x + PF_B * (0.1 + rng() * 0.06), bw = PF_B * (0.34 + rng() * 0.1);
          g.moveTo(bx, y1); g.lineTo(bx, y0 + 0.03); g.quadraticCurveTo(bx + bw / 2, y0 - 0.02, bx + bw, y0 + 0.03); g.lineTo(bx + bw, y1); g.closePath();
        }
        g.fillStyle = "rgba(240,244,250,0.94)"; g.fill();
      }
      g.restore();
    }
    g.save();
    g.beginPath(); g.moveTo(x0 - 0.1, yTraufe + 0.1); for (const [x, y] of kanteP) g.lineTo(x, oben > 0.01 ? y : yOben - 0.05); g.lineTo(x1 + 0.15, yTraufe + 0.1); g.closePath(); g.clip();
    schneeFlaeche(g, F, x0 - 0.1, yOben - 0.05, w + 0.25, h + 0.15, saat, { glitzer: false, zwischen: () => schneeRippen(g, F, x0, x1, yTraufe, yOben + oben + 0.15, saat) });
    if (opt.reiter != null) {
      /* Lee hinter dem Lüftungsreiter: blaue Mulde, davor eine Wehe */
      const blob = (cx, cy, rx, ry, farbe, a) => {
        const gg = g.createRadialGradient(cx, cy, 0, cx, cy, rx);
        gg.addColorStop(0, "rgba(" + farbe + "," + a + ")"); gg.addColorStop(1, "rgba(" + farbe + ",0)");
        g.save(); g.translate(cx, cy); g.scale(1, ry / rx); g.translate(-cx, -cy); g.fillStyle = gg; g.beginPath(); g.arc(cx, cy, rx, 0, TAU); g.fill(); g.restore();
      };
      blob(opt.reiter, yOben + 1.0, 1.2, 0.7, "104,124,178", 0.3);
      blob(opt.reiter, yOben + 0.3, 1.0, 0.3, "252,253,255", 0.5);
    }
    g.restore();
    if (oben > 0.01) {
      g.lineJoin = "round"; g.lineCap = "round";
      g.beginPath(); kanteP.forEach(([x, y], i) => (i ? g.lineTo(x, y + 0.04) : g.moveTo(x, y + 0.04)));
      g.strokeStyle = "rgba(128,148,196,0.34)"; g.lineWidth = Math.max(0.035, 1.2 / px); g.stroke();
      g.beginPath(); kanteP.forEach(([x, y], i) => (i ? g.lineTo(x, y + 0.01) : g.moveTo(x, y + 0.01)));
      g.strokeStyle = "rgba(250,252,255,0.95)"; g.lineWidth = Math.max(0.025, 1.0 / px); g.stroke();
    }
    if (F.licht > 0.3) glitzer(g, F, x0, yOben + oben, w, h - oben, 5, rng);
  }
  /* Schneehaube auf einer schmalen Oberseite */
  function schneeOben(basis) {
    return function (g, F) {
      if (basis) { if (typeof basis === "function") basis(g, F); else { g.fillStyle = basis; g.fillRect(-0.02, -0.02, F.w + 0.04, F.h + 0.04); } }
      if (F.jahr !== "winter") return;
      g.fillStyle = "rgb(242,246,252)";
      PI.rundRechteck(g, -0.01, -0.01, F.w + 0.02, F.h + 0.02, Math.min(0.03, F.h * 0.3)); g.fill();
      const gr = g.createLinearGradient(0, 0, 0, F.h);
      gr.addColorStop(0, "rgba(200,212,235,0.3)"); gr.addColorStop(0.4, "rgba(255,255,255,0)"); gr.addColorStop(1, "rgba(215,225,245,0.25)");
      g.fillStyle = gr; g.fillRect(0, 0, F.w, F.h);
    };
  }
  function eiszapfenMalen(g, F, x0, x1, y0, maxL, saat, L) {
    const rng = zufall(saat);
    const Zp = [];
    let x = x0 + rng() * 0.2;
    while (x < x1 - 0.03) {
      const gruppe = rng() < 0.3;
      const l = maxL * (gruppe ? 0.45 + rng() * 0.55 : 0.08 + Math.pow(rng(), 2) * 0.55), b = 0.014 + l * 0.07;
      Zp.push([x, l, b, (rng() - 0.5) * 0.01]);
      x += gruppe ? 0.03 + rng() * 0.06 : 0.12 + rng() * 0.45;
    }
    const form = (sx, sb) => { g.beginPath(); for (const [x, l, b, d] of Zp) { g.moveTo(x - b * sb + sx * b, y0); g.quadraticCurveTo(x - b * 0.5 * sb + sx * b, y0 + l * 0.55, x + d, y0 + l); g.quadraticCurveTo(x + b * 0.5 + sx * b, y0 + l * 0.55, x + b, y0); g.closePath(); } };
    form(0, 1); g.fillStyle = L([214, 232, 248], 0.72); g.fill();
    form(0.35, 0.4); g.fillStyle = L([150, 182, 214], 0.5); g.fill();
    g.strokeStyle = L([255, 255, 255], 0.85); g.lineWidth = Math.max(0.004, 0.9 / F.px);
    g.beginPath(); for (const [x, l, b] of Zp) { g.moveTo(x - b * 0.45, y0 + 0.01); g.lineTo(x - b * 0.1, y0 + l * 0.7); } g.stroke();
  }
  function zapfenMal(saat, maxL, leuchtend) {
    return function (g, F) {
      if (leuchtend && F.nacht < 0.05) return;
      eiszapfenMalen(g, F, 0.1, F.w - 0.1, 0, maxL, saat, belichter(F, 0.15));
    };
  }
  /* Schneewechte an der Traufe (im Licht der Dachfläche nDach) */
  function wechteMal(saat, nDach) {
    return function (g, F) {
      const w = F.w, rng = zufall(saat), B = blickAus(F);
      const L = lichtMal(nDach ? lichtN(F, B, nDach, 0.06) : ST.lichtFaktor(F.n, F.zeit, 0.06, F.jahr));
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
  /* Schneewulst über einer schrägen Dachkante (Ortgang); kante(a) = Flächen-y */
  function schneeWulstMal(nDach, kante, saat, dick) {
    return function (g, F) {
      const w = F.w, rng = zufall(saat), B = blickAus(F), L = lichtMal(lichtN(F, B, nDach, 0.06));
      const d = dick || 0.18, ph = rng() * 6;
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
  /* Schneewehe unten an einer Wand; frei = [[a0,a1],…] (vor Türen geräumt) */
  function weheMalen(g, F, w, hWand, saat, frei) {
    const rng = zufall(saat), ph = rng() * 6;
    const hoehe = (a) => {
      let k = 0.2 + 0.1 * Math.sin(a * 1.3 + ph) + 0.06 * Math.sin(a * 4.1 + ph * 2) + 0.12 * ST.fbm(a * 0.8, saat, 2, saat);
      for (const [a0, a1] of frei || []) { const d = a < a0 ? a0 - a : a > a1 ? a - a1 : 0; k *= klemm(d / 0.5, 0, 1); }
      k *= klemm(a / 0.6, 0.3, 1) * klemm((w - a) / 0.6, 0.3, 1);
      return Math.max(0, k);
    };
    g.beginPath(); g.moveTo(-0.05, hWand + 0.05);
    for (let a = -0.05; a <= w + 0.05; a += 0.08) g.lineTo(a, hWand - hoehe(klemm(a, 0, w)));
    g.lineTo(w + 0.05, hWand + 0.05); g.closePath();
    const gr = g.createLinearGradient(0, hWand - 0.45, 0, hWand);
    gr.addColorStop(0, "rgb(246,249,253)"); gr.addColorStop(0.6, "rgb(232,238,247)"); gr.addColorStop(1, "rgb(206,216,234)");
    g.fillStyle = gr; g.fill();
    g.strokeStyle = "rgba(255,255,255,0.9)"; g.lineWidth = Math.max(0.012, 0.9 / F.px);
    g.beginPath(); for (let a = 0; a <= w; a += 0.08) { const y = hWand - hoehe(a) + 0.008; if (a) g.lineTo(a, y); else g.moveTo(a, y); } g.stroke();
  }

  /* =====================================================================
     FENSTER, TÜREN, TOR, LUKE
     ===================================================================== */
  /* Laibung: die Öffnung springt zurück; Seiten- und Sturzfläche */
  function laibung(g, F, B, x, y, w, h, tiefe, farbe) {
    const pT = parallaxe(F, B, tiefe);
    g.fillStyle = rgb(hell(farbe, -0.25)); g.fillRect(x, y, w, h);
    g.fillStyle = rgb(hell(farbe, 0.05));
    if (pT[0] > 0) poly(g, [[x, y], [x + pT[0], y + pT[1]], [x + pT[0], y + h + pT[1]], [x, y + h]]);
    else poly(g, [[x + w, y], [x + w + pT[0], y + pT[1]], [x + w + pT[0], y + h + pT[1]], [x + w, y + h]]);
    g.fill();
    g.fillStyle = rgb(hell(farbe, -0.4));
    if (pT[1] > 0) { poly(g, [[x, y], [x + w, y], [x + w + pT[0], y + pT[1]], [x + pT[0], y + pT[1]]]); g.fill(); }
    return pT;
  }
  function schattenL(g, F, x, y, w, h, tiefe, a) {
    const sv = F.schatten(tiefe);
    g.fillStyle = "rgba(18,16,24," + (a || 0.38) + ")";
    if (sv) {
      const [dx, dy] = sv;
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + w, y); g.lineTo(x + w + dx, y + dy); g.lineTo(x + dx, y + dy); g.closePath(); g.fill();
      g.beginPath();
      if (dx > 0) { g.moveTo(x, y); g.lineTo(x + dx, y + dy); g.lineTo(x + dx, y + h); g.lineTo(x, y + h); }
      else { g.moveTo(x + w, y); g.lineTo(x + w + dx, y + dy); g.lineTo(x + w + dx, y + h); g.lineTo(x + w, y + h); }
      g.closePath(); g.fill();
    } else { g.fillStyle = "rgba(18,16,24,0.18)"; g.fillRect(x, y, w, h); }
  }
  /* Stallfenster: weißer Holzrahmen, 3 × 2 Scheiben, staubiges Glas,
     Spinnweben in der Ecke; im Rohbau dunkle Öffnung */
  function stallFenster(g, F, B, x, y, w, h, Z, saat) {
    const px = F.px, rng = zufall(saat);
    g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
    const pT = laibung(g, F, B, x, y, w, h, 0.12, [196, 184, 166]);
    const fx = x + pT[0], fy = y + pT[1];
    if (!Z.fenster) {
      const gi = g.createLinearGradient(0, fy, 0, fy + h);
      gi.addColorStop(0, "rgb(22,18,16)"); gi.addColorStop(1, "rgb(48,38,30)");
      g.fillStyle = gi; g.fillRect(fx, fy, w, h);
      schattenL(g, F, x, y, w, h, 0.12);
      g.restore(); return;
    }
    const tag = 1 - F.nacht, rb = 0.055;
    /* Innen: dunkler Stall, Staub auf dem Glas */
    const gi = g.createLinearGradient(0, fy, 0, fy + h);
    gi.addColorStop(0, "rgb(34,30,26)"); gi.addColorStop(1, "rgb(58,48,38)");
    g.fillStyle = gi; g.fillRect(fx, fy, w, h);
    const himmel = (F.zeit && F.zeit.himmel) || ["#bcd3ea", "#e9f1f8"];
    const hO = misch(hex(himmel[0]), [190, 204, 220], tag * 0.5);
    const unten = (F.jahr === "winter" ? [210, 216, 226] : [110, 118, 96]).map((v) => v * (0.35 + 0.65 * tag));
    const sp = g.createLinearGradient(0, fy, 0, fy + h);
    const an = 0.42 * (0.3 + 0.7 * tag);
    sp.addColorStop(0, rgb(hO, an.toFixed(3))); sp.addColorStop(1, rgb(unten, (an * 0.9).toFixed(3)));
    g.fillStyle = sp; g.fillRect(fx, fy, w, h);
    g.fillStyle = "rgba(150,138,112," + (0.22 * (0.4 + 0.6 * tag)).toFixed(3) + ")"; g.fillRect(fx, fy, w, h);
    if (px > 12) { g.fillStyle = "rgba(255,255,255," + (0.06 + 0.08 * tag).toFixed(3) + ")"; poly(g, [[fx + w * 0.1, fy + h], [fx + w * 0.45, fy], [fx + w * 0.6, fy], [fx + w * 0.25, fy + h]]); g.fill(); }
    /* Rahmen und Sprossen */
    const rf = [236, 232, 222];
    const leiste = (x0, y0, x1, y1, b) => {
      g.fillStyle = rgb(rf);
      if (Math.abs(x1 - x0) > Math.abs(y1 - y0)) { g.fillRect(x0, y0 - b / 2, x1 - x0, b); if (px > 16) { g.fillStyle = rgb(hell(rf, -0.3)); g.fillRect(x0, y0 + b / 2 - b * 0.25, x1 - x0, b * 0.25); } }
      else { g.fillRect(x0 - b / 2, y0, b, y1 - y0); if (px > 16) { g.fillStyle = rgb(hell(rf, -0.3)); g.fillRect(x0 + b / 2 - b * 0.22, y0, b * 0.22, y1 - y0); } }
    };
    leiste(fx, fy + rb / 2, fx + w, fy + rb / 2, rb); leiste(fx, fy + h - rb / 2, fx + w, fy + h - rb / 2, rb);
    leiste(fx + rb / 2, fy, fx + rb / 2, fy + h, rb); leiste(fx + w - rb / 2, fy, fx + w - rb / 2, fy + h, rb);
    if (px > 6) {
      const sb = Math.max(0.026, 0.9 / px);
      for (let k = 1; k < 3; k++) leiste(fx + w * k / 3, fy, fx + w * k / 3, fy + h, sb);
      leiste(fx, fy + h / 2, fx + w, fy + h / 2, sb);
    }
    if (px > 18) {
      /* abblätternde Farbe am Rahmen */
      g.fillStyle = "rgba(110,90,70,0.45)";
      for (let i = 0; i < 5; i++) g.fillRect(fx + rng() * w, fy + (rng() < 0.5 ? h - rb : 0) + rng() * rb * 0.6, 0.03 + rng() * 0.05, 0.012);
    }
    if (px > 40) {
      /* Spinnweben in der oberen Ecke */
      g.strokeStyle = "rgba(230,230,226,0.45)"; g.lineWidth = 0.6 / px;
      const cx = fx + w - rb, cy = fy + rb;
      g.beginPath();
      for (let i = 0; i < 5; i++) { const a = Math.PI / 2 + i * (Math.PI / 2) / 4; g.moveTo(cx, cy); g.lineTo(cx + Math.cos(a) * 0.14, cy + Math.sin(a) * 0.14); }
      for (let r = 0.04; r < 0.15; r += 0.035) { g.moveTo(cx, cy + r); g.quadraticCurveTo(cx - r * 0.5, cy + r * 0.5, cx - r, cy); }
      g.stroke();
    }
    schattenL(g, F, x, y, w, h, 0.12, 0.34);
    g.restore();
  }
  function stallFensterLicht(g, F, B, x, y, w, h, an) {
    const a = F.nacht * an;
    if (a <= 0.01) return;
    const pT = parallaxe(F, B, 0.12), rb = 0.055;
    g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
    const gx = x + pT[0] + rb, gy = y + pT[1] + rb, gw = w - 2 * rb, gh = h - 2 * rb;
    const gr = g.createRadialGradient(gx + gw * 0.4, gy + gh * 0.9, 0, gx + gw / 2, gy + gh * 0.6, Math.max(gw, gh) * 1.1);
    gr.addColorStop(0, "rgba(255,214,140," + (0.95 * a).toFixed(3) + ")");
    gr.addColorStop(0.6, "rgba(236,164,80," + (0.8 * a).toFixed(3) + ")");
    gr.addColorStop(1, "rgba(150,86,40," + (0.75 * a).toFixed(3) + ")");
    g.fillStyle = gr; g.fillRect(gx, gy, gw, gh);
    g.fillStyle = "rgba(60,36,24," + (0.9 * a).toFixed(3) + ")";
    for (let k = 1; k < 3; k++) g.fillRect(x + pT[0] + w * k / 3 - 0.014, y, 0.028, h);
    g.fillRect(x, y + pT[1] + h / 2 - 0.014, w, 0.028);
    g.restore();
    F.leuchtPunkt(x + w / 2, y + h * 0.55, 1.1, "255,184,104", 0.42 * an);
  }
  /* Beschlag: Langband mit Kloben */
  function langband(g, x, y, l, b, rechts) {
    g.fillStyle = rgb(EISEN);
    const s = rechts ? -1 : 1;
    g.beginPath(); g.moveTo(x, y - b / 2); g.lineTo(x + s * l * 0.85, y - b * 0.35); g.lineTo(x + s * l, y); g.lineTo(x + s * l * 0.85, y + b * 0.35); g.lineTo(x, y + b / 2); g.closePath(); g.fill();
    g.beginPath(); g.arc(x, y, b * 0.7, 0, TAU); g.fill();
  }
  /* Bretter eines Torflügels / einer Tür, senkrecht */
  function bretterFluegel(g, F, x, y, w, h, c, saat) {
    const rng = zufall(saat), n = Math.max(2, Math.round(w / 0.16));
    for (let i = 0; i < n; i++) {
      const cc = PI.streu(c, rng, 0.08);
      const gr = g.createLinearGradient(x + w * i / n, 0, x + w * (i + 1) / n, 0);
      gr.addColorStop(0, rgb(hell(cc, 0.05))); gr.addColorStop(1, rgb(hell(cc, -0.1)));
      g.fillStyle = gr; g.fillRect(x + w * i / n, y, w / n + 0.002, h);
    }
    if (F.px > 9) maser(g, x, y, w, h, 0.03, 1.2, 0.45, saat, true);
    if (F.px * w / n > 4) { g.fillStyle = rgb(hell(c, -0.6), 0.75); for (let i = 1; i < n; i++) g.fillRect(x + w * i / n - 0.006, y, 0.012, h); }
    rausch(g, x, y, w, h, 1.2, 0.25, saat + 2, 3);
    bleich(g, x, y, w, h, 1.5, 0.12, saat);
  }
  /* aufgesetzte Rahmenhölzer und Diagonalstreben mit Schatten */
  function aufsatz(g, F, pts, b, c) {
    const sv = F.schatten ? F.schatten(0.035) : null;
    for (const [x0, y0, x1, y1] of pts) {
      if (sv) { g.strokeStyle = "rgba(16,12,10,0.4)"; g.lineWidth = b; g.lineCap = "butt"; g.beginPath(); g.moveTo(x0 + sv[0], y0 + sv[1]); g.lineTo(x1 + sv[0], y1 + sv[1]); g.stroke(); }
    }
    for (const [x0, y0, x1, y1] of pts) {
      g.strokeStyle = rgb(c); g.lineWidth = b; g.lineCap = "butt";
      g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
      if (F.px * b > 5) {
        const nx = -(y1 - y0), ny = x1 - x0, l = Math.hypot(nx, ny) || 1;
        g.strokeStyle = rgb(hell(c, 0.16)); g.lineWidth = b * 0.18;
        g.beginPath(); g.moveTo(x0 + nx / l * b * 0.4, y0 + ny / l * b * 0.4); g.lineTo(x1 + nx / l * b * 0.4, y1 + ny / l * b * 0.4); g.stroke();
        g.strokeStyle = rgb(hell(c, -0.35)); g.lineWidth = b * 0.2;
        g.beginPath(); g.moveTo(x0 - nx / l * b * 0.4, y0 - ny / l * b * 0.4); g.lineTo(x1 - nx / l * b * 0.4, y1 - ny / l * b * 0.4); g.stroke();
      }
    }
  }
  /* Scheunentor: zwei Flügel, je Rahmen mit Mittelriegel und zwei
     Diagonalstreben, Langbänder, Schlupftür im rechten Flügel */
  function torMalen(g, F, B, x, y, w, h, Z, farbe, saat) {
    const px = F.px, tiefe = 0.1;
    g.save(); g.beginPath(); g.rect(x, y - 0.01, w, h + 0.02); g.clip();
    const pT = laibung(g, F, B, x, y, w, h, tiefe, [120, 100, 80]);
    const fx = x + pT[0], fy = y + pT[1];
    if (!Z.tor) {
      const gi = g.createLinearGradient(0, fy, 0, fy + h);
      gi.addColorStop(0, "rgb(20,16,14)"); gi.addColorStop(1, "rgb(56,46,36)");
      g.fillStyle = gi; g.fillRect(fx, fy, w, h);
      schattenL(g, F, x, y, w, h, tiefe);
      g.restore(); return;
    }
    const c = farbe, rahmen = hell(c, -0.1);
    const fb = w / 2;
    for (let s = 0; s < 2; s++) {
      const lx = fx + s * fb, ly = fy;
      bretterFluegel(g, F, lx, ly, fb, h, c, saat + s * 11);
      const rb = 0.13, m = ly + h * 0.48;
      const hol = [
        [lx, ly + rb / 2, lx + fb, ly + rb / 2], [lx, ly + h - rb / 2, lx + fb, ly + h - rb / 2], [lx, m, lx + fb, m],
        [lx + rb / 2, ly, lx + rb / 2, ly + h], [lx + fb - rb / 2, ly, lx + fb - rb / 2, ly + h]
      ];
      /* Streben steigen vom Band (Außenseite unten) zum Schloss (Mitte oben) */
      const aus = s === 0 ? lx + rb : lx + fb - rb, inn = s === 0 ? lx + fb - rb : lx + rb;
      hol.push([aus, ly + h - rb, inn, m + rb * 0.5], [aus, m - rb * 0.5, inn, ly + rb]);
      aufsatz(g, F, hol.slice(5), rb * 0.9, rahmen);
      aufsatz(g, F, hol.slice(0, 5), rb, rahmen);
      if (px > 8) {
        /* Langbänder an der Außenkante */
        const bx = s === 0 ? lx + 0.02 : lx + fb - 0.02;
        for (const yy of [ly + 0.35, m, ly + h - 0.35]) langband(g, bx, yy, fb * 0.62, 0.07, s === 1);
      }
    }
    /* Stoß der Flügel, Schlagleiste */
    g.fillStyle = "rgba(16,12,10,0.8)"; g.fillRect(fx + fb - 0.012, fy, 0.024, h);
    if (px > 10) {
      /* Schlupftür im rechten Flügel */
      const sx = fx + fb + 0.28, sw = 0.82, sh = 1.86, sy = fy + h - sh - 0.08;
      g.strokeStyle = "rgba(20,14,10,0.85)"; g.lineWidth = Math.max(0.014, 1 / px);
      g.strokeRect(sx, sy, sw, sh);
      g.fillStyle = rgb(EISEN); g.fillRect(sx + sw - 0.12, sy + sh * 0.52, 0.09, 0.03);
      if (px > 20) { g.fillStyle = "rgb(20,18,18)"; g.beginPath(); g.arc(sx + sw - 0.08, sy + sh * 0.52 + 0.08, 0.012, 0, TAU); g.fill(); }
      /* Überwurf und Riegel am Stoß */
      g.fillStyle = rgb(EISEN); g.fillRect(fx + fb - 0.25, fy + h * 0.46, 0.5, 0.05);
      g.fillStyle = "rgba(255,255,255,0.12)"; g.fillRect(fx + fb - 0.25, fy + h * 0.46, 0.5, 0.012);
    }
    /* unten: Spritzwasser, Fäulnis, Mist */
    const gu = g.createLinearGradient(0, fy + h - 0.5, 0, fy + h);
    gu.addColorStop(0, "rgba(46,34,24,0)"); gu.addColorStop(1, "rgba(46,34,24,0.45)");
    g.fillStyle = gu; g.fillRect(fx, fy + h - 0.5, w, 0.5);
    schattenL(g, F, x, y, w, h, tiefe, 0.32);
    g.restore();
    /* Winter: Tannenkranz mit roter Schleife an der Schlupftür */
    if (F.jahr === "winter" && Z.fertig && px > 8) kranz(g, F, fx + fb + 0.69, fy + h - 1.35, 0.2);
  }
  function kranz(g, F, cx, cy, R) {
    const rng = zufall(9);
    g.fillStyle = "rgba(20,16,12,0.3)"; g.beginPath(); g.arc(cx + 0.02, cy + 0.03, R + 0.02, 0, TAU); g.arc(cx + 0.02, cy + 0.03, R * 0.5, 0, TAU, true); g.fill();
    for (let i = 0; i < 70; i++) {
      const a = rng() * TAU, r = R * (0.62 + rng() * 0.38);
      g.fillStyle = rgb(PI.streu([36, 78, 46], rng, 0.3));
      g.beginPath(); g.ellipse(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 0.05, 0.018, a + 1.2, 0, TAU); g.fill();
    }
    g.fillStyle = "rgba(246,249,253,0.9)";
    for (let i = 0; i < 9; i++) { const a = -Math.PI * (0.15 + rng() * 0.7), r = R * 0.85; g.beginPath(); g.ellipse(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 0.04, 0.015, a + 1.6, 0, TAU); g.fill(); }
    g.fillStyle = "#b3122a";
    g.beginPath(); g.moveTo(cx, cy + R); g.quadraticCurveTo(cx - 0.12, cy + R - 0.1, cx - 0.1, cy + R + 0.04); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(cx, cy + R); g.quadraticCurveTo(cx + 0.12, cy + R - 0.1, cx + 0.1, cy + R + 0.04); g.closePath(); g.fill();
    g.fillRect(cx - 0.035, cy + R, 0.02, 0.16); g.fillRect(cx + 0.015, cy + R, 0.02, 0.14);
  }
  /* Klöntür: waagerecht geteilte Stalltür, Bretter mit Z-Strebe */
  function tuerMalen(g, F, B, x, y, w, h, Z, farbe, saat) {
    const px = F.px, tiefe = 0.12;
    g.save(); g.beginPath(); g.rect(x, y - 0.01, w, h + 0.02); g.clip();
    const pT = laibung(g, F, B, x, y, w, h, tiefe, [150, 130, 108]);
    const fx = x + pT[0], fy = y + pT[1];
    if (!Z.tuer) {
      const gi = g.createLinearGradient(0, fy, 0, fy + h);
      gi.addColorStop(0, "rgb(20,16,14)"); gi.addColorStop(1, "rgb(52,42,34)");
      g.fillStyle = gi; g.fillRect(fx, fy, w, h);
      schattenL(g, F, x, y, w, h, tiefe);
      g.restore(); return;
    }
    const teil = h * 0.52;
    for (const [ty, th] of [[fy, teil], [fy + teil, h - teil]]) {
      bretterFluegel(g, F, fx, ty, w, th, farbe, saat + (ty > fy ? 5 : 0));
      const rb = 0.1;
      aufsatz(g, F, [[fx + rb, ty + th - rb * 1.2, fx + w - rb, ty + rb * 1.2]], rb * 0.9, hell(farbe, -0.1));
      aufsatz(g, F, [[fx, ty + rb * 0.7, fx + w, ty + rb * 0.7], [fx, ty + th - rb * 0.7, fx + w, ty + th - rb * 0.7]], rb, hell(farbe, -0.1));
      if (px > 8) for (const yy of [ty + 0.18, ty + th - 0.18]) langband(g, fx + 0.02, yy, w * 0.6, 0.06, false);
    }
    g.fillStyle = "rgba(16,12,10,0.85)"; g.fillRect(fx, fy + teil - 0.01, w, 0.02);
    if (px > 10) {
      g.fillStyle = rgb(EISEN); g.fillRect(fx + w - 0.16, fy + teil + 0.1, 0.1, 0.03);
      g.fillStyle = "rgb(150,130,90)"; g.fillRect(fx + w - 0.2, fy + teil - 0.04, 0.14, 0.025);
    }
    const gu = g.createLinearGradient(0, fy + h - 0.4, 0, fy + h);
    gu.addColorStop(0, "rgba(46,34,24,0)"); gu.addColorStop(1, "rgba(46,34,24,0.45)");
    g.fillStyle = gu; g.fillRect(fx, fy + h - 0.4, w, 0.4);
    schattenL(g, F, x, y, w, h, tiefe, 0.34);
    g.restore();
  }
  /* Hufeisen über der Stalltür (Öffnung nach oben: das Glück fällt nicht heraus) */
  function hufeisen(g, F, cx, cy) {
    if (F.px < 14) return;
    const sv = F.schatten(0.02);
    const form = (dx, dy) => { g.beginPath(); g.arc(cx + dx, cy + dy, 0.06, 0.15, Math.PI - 0.15, false); g.arc(cx + dx, cy + dy, 0.035, Math.PI - 0.2, 0.2, true); g.closePath(); };
    if (sv) { form(sv[0], sv[1]); g.fillStyle = "rgba(10,8,8,0.35)"; g.fill(); }
    form(0, 0); g.fillStyle = "rgb(84,70,58)"; g.fill();
    if (F.px > 30) { g.fillStyle = "rgba(150,76,40,0.6)"; g.beginPath(); g.arc(cx - 0.04, cy + 0.02, 0.012, 0, TAU); g.fill(); }
  }
  /* Stalllampe: Emaille-Schirm an einem Wandarm */
  function lampeMalen(g, F, x, y, an) {
    const px = F.px;
    an = an && F.nacht > 0.3;
    if (px < 7) return;
    const sv = F.schatten(0.18);
    if (sv) { g.fillStyle = "rgba(14,12,14,0.3)"; g.beginPath(); g.ellipse(x + sv[0], y + 0.1 + sv[1] * 0.6, 0.14, 0.05, 0, 0, TAU); g.fill(); }
    g.strokeStyle = rgb(EISEN); g.lineWidth = 0.025;
    g.beginPath(); g.moveTo(x, y - 0.22); g.quadraticCurveTo(x + 0.02, y - 0.06, x, y); g.stroke();
    g.fillStyle = rgb(EISEN); g.fillRect(x - 0.05, y - 0.26, 0.1, 0.06);
    const gr = g.createLinearGradient(x - 0.15, 0, x + 0.15, 0);
    gr.addColorStop(0, "rgb(40,70,58)"); gr.addColorStop(0.4, "rgb(70,110,92)"); gr.addColorStop(1, "rgb(30,52,44)");
    g.fillStyle = gr;
    g.beginPath(); g.moveTo(x - 0.035, y); g.lineTo(x + 0.035, y); g.lineTo(x + 0.15, y + 0.1); g.lineTo(x - 0.15, y + 0.1); g.closePath(); g.fill();
    g.fillStyle = "rgb(236,232,222)"; g.fillRect(x - 0.15, y + 0.095, 0.3, 0.015);
    g.fillStyle = an ? "rgb(255,236,190)" : "rgb(210,200,180)";
    g.beginPath(); g.ellipse(x, y + 0.12, 0.04, 0.03, 0, 0, TAU); g.fill();
  }
  function lampeLicht(g, F, x, y) {
    const a = F.nacht;
    if (a <= 0.01) return;
    const gg = g.createRadialGradient(x, y + 0.12, 0, x, y + 0.3, 1.3);
    gg.addColorStop(0, "rgba(255,226,160," + (0.55 * a).toFixed(3) + ")"); gg.addColorStop(0.35, "rgba(255,190,110," + (0.22 * a).toFixed(3) + ")"); gg.addColorStop(1, "rgba(255,170,90,0)");
    g.fillStyle = gg; g.fillRect(x - 1.3, y - 1, 2.6, 2.6);
    g.fillStyle = "rgba(255,246,220," + a.toFixed(3) + ")"; g.beginPath(); g.ellipse(x, y + 0.12, 0.045, 0.032, 0, 0, TAU); g.fill();
    F.leuchtPunkt(x, y + 0.14, 0.9, "255,206,130", 0.8);
  }
  /* Schwalbennest unter der Traufe */
  function schwalbennest(g, F, cx, cy) {
    if (F.px < 16) return;
    g.fillStyle = "rgba(20,16,14,0.25)"; g.beginPath(); g.ellipse(cx + 0.02, cy + 0.03, 0.1, 0.07, 0, 0, Math.PI); g.fill();
    g.fillStyle = "rgb(120,98,72)"; g.beginPath(); g.moveTo(cx - 0.1, cy); g.quadraticCurveTo(cx, cy + 0.16, cx + 0.1, cy); g.closePath(); g.fill();
    if (F.px > 30) { const rng = zufall(3); g.fillStyle = "rgba(80,62,44,0.8)"; for (let i = 0; i < 14; i++) { g.beginPath(); g.arc(cx + (rng() - 0.5) * 0.16, cy + rng() * 0.08, 0.012, 0, TAU); g.fill(); } }
  }

  /* =====================================================================
     WANDPLÄNE: Öffnungen → Ständer, Felder, Riegel, Streben
     a = Abstand vom linken Wandende (von außen gesehen), z = Höhe
     ===================================================================== */
  function wandPlan(L, oeff) {
    const kanten = [PB / 2, L - PB / 2];
    for (const o of oeff) kanten.push(o.a0 - PB / 2, o.a1 + PB / 2);
    kanten.sort((a, b) => a - b);
    const st = [];
    for (const k of kanten) if (!st.length || k - st[st.length - 1] > 0.28) st.push(k);
    const staender = [];
    for (let i = 0; i < st.length; i++) {
      staender.push(st[i]);
      if (i < st.length - 1) {
        const a = st[i], b = st[i + 1];
        const drin = oeff.some((o) => a >= o.a0 - PB && b <= o.a1 + PB);
        if (!drin) { const n = Math.ceil((b - a) / 1.3 - 0.01); for (let k = 1; k < n; k++) staender.push(a + (b - a) * k / n); }
      }
    }
    staender.sort((a, b) => a - b);
    const felder = [];
    for (let i = 0; i < staender.length - 1; i++) {
      const a = staender[i] + PB / 2, b = staender[i + 1] - PB / 2;
      const o = oeff.find((q) => q.a0 >= a - 0.06 && q.a1 <= b + 0.06) || null;
      felder.push({ a: a, b: b, o: o, i: i });
    }
    /* Streben in den Eckfeldern ohne Öffnung (steigen zur Wandmitte) */
    const n = felder.length;
    for (const f of felder) f.strebe = !f.o && (f.i === 0 ? 1 : f.i === n - 1 ? -1 : 0);
    const riegel = [];
    for (const f of felder) {
      if (!f.o) { riegel.push([f.a, f.b, R_BR], [f.a, f.b, R_ST]); continue; }
      if (f.o.art === "fenster") riegel.push([f.a, f.b, f.o.z0 - 0.08], [f.a, f.b, f.o.z1 + 0.08]);
      else if (f.o.z1 + 0.16 < ZRA) riegel.push([f.a, f.b, f.o.z1 + 0.08]);
    }
    return { L: L, oeff: oeff, staender: staender, felder: felder, riegel: riegel };
  }
  const OEFF = {
    sued: [{ art: "fenster", a0: 0.7, a1: 1.5, z0: 1.65, z1: 2.35 }, { art: "tor", a0: 2.4, a1: 5.6, z0: 0, z1: 3.1 }, { art: "fenster", a0: 6.5, a1: 7.3, z0: 1.65, z1: 2.35 }],
    ost: [{ art: "fenster", a0: 0.7, a1: 1.5, z0: 1.65, z1: 2.35 }, { art: "tuer", a0: 2.3, a1: 3.35, z0: 0, z1: 2.05 }, { art: "fenster", a0: 4.2, a1: 5.0, z0: 1.65, z1: 2.35 }, { art: "fenster", a0: 5.6, a1: 6.4, z0: 1.65, z1: 2.35 }],
    nord: [{ art: "fenster", a0: 1.0, a1: 1.8, z0: 1.65, z1: 2.35 }, { art: "tuer", a0: 3.5, a1: 4.5, z0: 0, z1: 2.05 }, { art: "fenster", a0: 6.2, a1: 7.0, z0: 1.65, z1: 2.35 }],
    west: [{ art: "fenster", a0: 0.7, a1: 1.5, z0: 1.65, z1: 2.35 }, { art: "fenster", a0: 2.2, a1: 3.0, z0: 1.65, z1: 2.35 }, { art: "fenster", a0: 4.0, a1: 4.8, z0: 1.65, z1: 2.35 }, { art: "fenster", a0: 5.5, a1: 6.3, z0: 1.65, z1: 2.35 }]
  };
  /* Wände: Außenfläche (o, n) und Innenfläche; a → Modellpunkt */
  const WAENDE = [
    { name: "sued", L: 2 * X1, o: [-X1, YS, ZT], n: [0, 1, 0], io: [X1 - PB, YS - PB, ZT], iL: 2 * X1 - 2 * PB, at: (a) => [-X1 + a, YS] },
    { name: "ost", L: LT, o: [X1, YS, ZT], n: [1, 0, 0], io: [X1 - PB, YN + PB, ZT], iL: LT - 2 * PB, at: (a) => [X1, YS - a] },
    { name: "nord", L: 2 * X1, o: [X1, YN, ZT], n: [0, -1, 0], io: [-X1 + PB, YN + PB, ZT], iL: 2 * X1 - 2 * PB, at: (a) => [X1 - a, YN] },
    { name: "west", L: LT, o: [-X1, YN, ZT], n: [-1, 0, 0], io: [-X1 + PB, YS - PB, ZT], iL: LT - 2 * PB, at: (a) => [-X1, YN + a] }
  ];
  for (const W of WAENDE) W.plan = wandPlan(W.L, OEFF[W.name]);

  /* =====================================================================
     BAUPHASEN
       0,00–0,10  Schnurgerüst, Baugrube wird ausgehoben
       0,10–0,16  Streifenfundament aus Beton
       0,165–0,22 Verfüllen; 0,20–0,235 Stallboden (Beton)
       0,22–0,34  Bruchsteinsockel Lage für Lage
       0,34–0,50  Schwellen, Ständer, Riegel und Streben, Rähm
       0,50–0,62  Ausfachung mit Backstein, Reihe für Reihe
       0,60–0,72  Giebelschalung wächst von unten
       0,63–0,74  Sparren, Kehlbalken, Gratsparren
       0,74–0,90  Schalung und Lattung, Pfannen Reihe für Reihe
       0,88–0,92  Lüftungsreiter
       0,90–0,95  Tor, Heuluke, Fenster, Türen, Aufzugsbalken
       0,95–1,00  Lampen, Heu, Milchbank, Misthaufen; Winter: Schnee
     ===================================================================== */
  function zustand(bau) {
    const f = (a, b) => klemm((bau - a) / (b - a), 0, 1);
    const Z = { bau: bau, fertig: bau >= 0.999 };
    Z.grube = bau < 0.22 ? { schnur: bau < 0.1, tiefe: f(0.004, 0.07), beton: f(0.1, 0.16), verfuellt: f(0.165, 0.215) } : null;
    Z.aushub = bau < 0.165 ? f(0.004, 0.07) : bau < 0.3 ? 1 - 0.85 * f(0.165, 0.3) : 0;
    Z.platte = f(0.2, 0.235);
    Z.sockel = f(0.22, 0.34);
    Z.schwelle = f(0.34, 0.37); Z.staender = f(0.36, 0.45); Z.riegel = f(0.43, 0.49); Z.raehm = f(0.47, 0.5);
    Z.wand = bau >= 0.5;
    Z.fach = f(0.5, 0.62);
    Z.giebel = f(0.6, 0.72);
    Z.sparren = f(0.63, 0.74);
    Z.dach = bau >= 0.74;
    Z.ziegel = f(0.76, 0.9);
    Z.innen = bau < 0.745;
    Z.reiter = f(0.88, 0.92);
    Z.tor = bau >= 0.9; Z.luke = bau >= 0.91; Z.fenster = bau >= 0.92; Z.tuer = bau >= 0.93; Z.aufzug = bau >= 0.935;
    Z.lampe = bau >= 0.95; Z.heu = bau >= 0.95; Z.milch = bau >= 0.97; Z.mist = bau >= 0.985;
    Z.alt = bau >= 0.9;
    return Z;
  }

  /* =====================================================================
     DIE WAND
     ===================================================================== */
  function holzFarbe(Z) { return Z.alt ? EICHE : EICHE_ROH; }
  function wandMaler(W, Z, S) {
    const P = W.plan;
    return function (g, F) {
      const L = F.w, px = F.px, B = blickAus(F);
      const yZ = (z) => ZT - z;
      const holz = toHex(holzFarbe(Z));
      const saat = S.saat + W.name.length * 13;
      const winter = F.jahr === "winter" && Z.fertig;
      /* 1. Gefache */
      const gy0 = yZ(ZRA) - 0.02, gh = ZRA - ZSW + 0.06;
      if (Z.fach >= 1) ziegelMalen(g, F, -0.02, gy0, L + 0.04, gh, saat, {});
      else {
        const gi = g.createLinearGradient(0, gy0, 0, gy0 + gh);
        gi.addColorStop(0, "rgb(38,32,28)"); gi.addColorStop(1, "rgb(70,58,46)");
        g.fillStyle = gi; g.fillRect(-0.02, gy0, L + 0.04, gh);
        const bis = gh * Z.fach;
        if (bis > 0.01) {
          g.save(); g.beginPath(); g.rect(-0.1, gy0 + gh - bis, L + 0.2, bis); g.clip();
          ziegelMalen(g, F, -0.02, gy0, L + 0.04, gh, saat, {});
          /* frische Lage: nasser Mörtel oben */
          g.fillStyle = "rgba(120,116,108,0.5)"; g.fillRect(-0.1, gy0 + gh - bis, L + 0.2, 0.03);
          g.restore();
        }
      }
      /* 2. Sockel (außer unter Tor und Türen) */
      bruchsteinMalen(g, F, -0.02, yZ(ZS), L + 0.04, ZS, { saat: saat + 1 });
      {
        g.fillStyle = "rgba(230,224,210,0.35)";
        let a0 = -0.02;
        for (const o of P.oeff.filter((q) => q.art !== "fenster").sort((p, q) => p.a0 - q.a0)) { g.fillRect(a0, yZ(ZS) - 0.01, o.a0 - 0.2 - a0, 0.025); a0 = o.a1 + 0.2; }
        g.fillRect(a0, yZ(ZS) - 0.01, L + 0.02 - a0, 0.025);
      }
      /* 3. Hölzer: Riegel, Streben, Ständer, Schwelle, Rähm */
      const bal = (x0, z0, x1, z1, b, opt) => PI.balken(g, x0, yZ(z0), x1, yZ(z1), b, holz, F, Object.assign({ vor: 0.03 }, opt || {}));
      for (const [a, b, z] of P.riegel) bal(a - 0.02, z, b + 0.02, z, 0.16, { naegel: false });
      for (const f of P.felder) if (f.strebe) {
        const aus = f.strebe > 0 ? f.a : f.b, inn = f.strebe > 0 ? f.b : f.a;
        g.save(); g.beginPath(); g.rect(f.a, yZ(ZRA), f.b - f.a, ZRA - ZSW); g.clip();
        bal(aus, ZSW - 0.05, inn, ZRA + 0.05, 0.18);
        g.restore();
      }
      for (const a of P.staender) bal(a, ZSW - 0.02, a, ZRA + 0.02, PB, {});
      /* Schwelle mit Unterbrechung an Tür und Tor */
      let s0 = 0;
      const tueren = P.oeff.filter((o) => o.art !== "fenster").sort((p, q) => p.a0 - q.a0);
      for (const o of tueren) { if (o.a0 - PB - s0 > 0.05) bal(s0, ZSW - 0.1, o.a0 - PB + 0.01, ZSW - 0.1, 0.2, { naegel: false }); s0 = o.a1 + PB - 0.01; }
      bal(s0, ZSW - 0.1, L, ZSW - 0.1, 0.2, { naegel: false });
      bal(0, ZT - 0.11, L, ZT - 0.11, 0.22, { naegel: false });
      /* Balkenköpfe der Dachbalken in den Traufwänden */
      if ((W.name === "ost" || W.name === "west") && px > 10) {
        for (let a = 0.45; a < L - 0.3; a += 0.95) {
          const c = hell(holzFarbe(Z), -0.12);
          g.fillStyle = rgb(c); g.fillRect(a - 0.08, 0.0, 0.16, 0.14);
          g.fillStyle = "rgba(20,14,10,0.5)"; g.fillRect(a - 0.08, 0.13, 0.16, 0.012);
        }
      }
      /* 4. Öffnungen */
      for (const o of P.oeff) {
        const x = o.a0, y = yZ(o.z1), w = o.a1 - o.a0, h = o.z1 - o.z0;
        if (o.art === "fenster") stallFenster(g, F, B, x, y, w, h, Z, saat + ((o.a0 * 10) | 0));
        else if (o.art === "tor") {
          torMalen(g, F, B, x, y, w, h, Z, S.torFarbe, saat + 3);
          /* Torbalken mit Inschrift */
          const tb = 0.34, tx0 = x - 0.35, tx1 = x + w + 0.35;
          PI.balken(g, tx0, y - tb / 2 + 0.02, tx1, y - tb / 2 + 0.02, tb, holz, F, { vor: 0.05, naegel: false });
          if (Z.alt && px > 24) inschrift(g, F, (tx0 + tx1) / 2, y - tb / 2 + 0.02, tb);
        } else tuerMalen(g, F, B, x, y, w, h, Z, S.torFarbe, saat + 7);
        /* Schnee auf Sohlbank / Sturz */
        if (winter && o.art === "fenster") { g.fillStyle = "rgb(242,246,252)"; PI.rundRechteck(g, x - 0.02, y + h - 0.005, w + 0.04, 0.035, 0.015); g.fill(); }
        if (winter && o.art !== "fenster") { g.fillStyle = "rgb(242,246,252)"; PI.rundRechteck(g, x - 0.3, y - (o.art === "tor" ? 0.33 : 0.18), w + 0.6, 0.03, 0.012); g.fill(); }
        if (!Z.alt && o.art === "fenster") { /* noch ohne Fenster: nichts weiter */ }
      }
      /* 5. Ausstattung */
      if (W.name === "ost") {
        const t = P.oeff[1];
        if (Z.tuer) hufeisen(g, F, (t.a0 + t.a1) / 2, yZ(t.z1) - 0.2);
        if (Z.lampe) lampeMalen(g, F, t.a1 + 0.42, yZ(2.55), S.nacht);
        if (Z.alt) { schwalbennest(g, F, 1.95, 0.24); schwalbennest(g, F, 4.6, 0.22); }
      }
      if (W.name === "sued" && Z.lampe) lampeMalen(g, F, 1.95, yZ(2.75), S.nacht);
      if (W.name === "nord" && Z.lampe) lampeMalen(g, F, 3.15, yZ(2.5), S.nacht);
      /* 6. Jahreszeit */
      if (F.jahr === "herbst" && Z.fertig) {
        g.save(); g.beginPath(); g.rect(-0.1, ZT - 0.5, L + 0.2, 0.52); g.clip();
        laubMalen(g, F, 0, ZT - 0.25, L, 0.26, saat + 5, 2.2, ZT);
        g.restore();
      }
      if (winter) {
        const frei = P.oeff.filter((o) => o.art !== "fenster").map((o) => [o.a0 - 0.2, o.a1 + 0.2]);
        weheMalen(g, F, L, ZT, saat + 9, frei);
      }
      /* Kanten-Schattierung: Ecken etwas dunkler (Umgebungsverdeckung) */
      const ge = g.createLinearGradient(0, 0, 0.35, 0);
      ge.addColorStop(0, "rgba(30,24,20,0.18)"); ge.addColorStop(1, "rgba(30,24,20,0)");
      g.fillStyle = ge; g.fillRect(0, 0, 0.35, ZT);
      const ge2 = g.createLinearGradient(L, 0, L - 0.35, 0);
      ge2.addColorStop(0, "rgba(30,24,20,0.18)"); ge2.addColorStop(1, "rgba(30,24,20,0)");
      g.fillStyle = ge2; g.fillRect(L - 0.35, 0, 0.35, ZT);
    };
  }
  function wandLeuchten(W, Z, S) {
    const P = W.plan;
    return function (g, F) {
      if (!S.licht) return;
      const B = blickAus(F), yZ = (z) => ZT - z;
      P.oeff.forEach((o, i) => {
        if (o.art === "fenster") stallFensterLicht(g, F, B, o.a0, yZ(o.z1), o.a1 - o.a0, o.z1 - o.z0, (i + W.name.length) % 5 === 3 ? 0.25 : 1);
        if (o.art === "tor") {
          /* Lichtspalt zwischen den Flügeln und unter dem Tor */
          const a = F.nacht, cx = (o.a0 + o.a1) / 2 + parallaxe(F, B, 0.1)[0], y0 = yZ(o.z1), h = o.z1 - o.z0;
          const gr = g.createLinearGradient(cx - 0.12, 0, cx + 0.12, 0);
          gr.addColorStop(0, "rgba(255,190,110,0)"); gr.addColorStop(0.5, "rgba(255,214,150," + (0.85 * a).toFixed(3) + ")"); gr.addColorStop(1, "rgba(255,190,110,0)");
          g.fillStyle = gr; g.fillRect(cx - 0.12, y0 + 0.1, 0.24, h - 0.12);
          g.fillStyle = "rgba(255,210,140," + (0.7 * a).toFixed(3) + ")"; g.fillRect(o.a0 + 0.1, ZT - 0.03, o.a1 - o.a0 - 0.2, 0.025);
          F.leuchtPunkt(cx, y0 + h * 0.6, 1.2, "255,190,110", 0.35);
        }
      });
      if (W.name === "ost" && Z.lampe) lampeLicht(g, F, P.oeff[1].a1 + 0.42, yZ(2.55));
      if (W.name === "sued" && Z.lampe) lampeLicht(g, F, 1.95, yZ(2.75));
      if (W.name === "nord" && Z.lampe) lampeLicht(g, F, 3.15, yZ(2.5));
    };
  }
  /* Inschrift im Torbalken (geschnitzt, weiß ausgelegt) */
  function inschrift(g, F, cx, cy, tb) {
    g.save();
    g.font = "bold " + (tb * 0.46).toFixed(3) + "px Georgia, 'Times New Roman', serif";
    g.textAlign = "center"; g.textBaseline = "middle";
    const text = "ANNO 1843 · GOTT SEGNE DIESES HAUS";
    if (F.px > 30) { g.fillStyle = "rgba(20,14,10,0.6)"; g.fillText(text, cx + 0.012, cy + 0.014); }
    g.fillStyle = "rgba(236,226,200,0.92)"; g.fillText(text, cx, cy);
    g.restore();
  }
  /* Innenseite (nur solange offen): Backstein dunkler, Hölzer */
  function innenMaler(W, Z, S) {
    return function (g, F) {
      const L = F.w, yZ = (z) => ZT - z;
      g.fillStyle = "rgb(60,50,42)"; g.fillRect(-0.05, -0.05, L + 0.1, ZT + 0.1);
      if (Z.wand) {
        const gh = ZRA - ZSW + 0.06, bis = gh * Z.fach;
        g.save(); g.beginPath(); g.rect(-0.1, yZ(ZSW) + 0.04 - bis, L + 0.2, bis); g.clip();
        ziegelMalen(g, F, -0.02, yZ(ZRA) - 0.02, L + 0.04, gh, S.saat + 77, {});
        g.restore();
      }
      bruchsteinMalen(g, F, -0.02, yZ(ZS), L + 0.04, ZS, { saat: S.saat + 5 });
      const holz = toHex(holzFarbe(Z));
      for (let a = 0.1; a < L; a += 1.2) PI.balken(g, a, yZ(ZSW), a, yZ(ZRA), PB, holz, F, { vor: 0.02, naegel: false });
      PI.balken(g, 0, yZ(ZT - 0.11), L, yZ(ZT - 0.11), 0.22, holz, F, { naegel: false });
      g.fillStyle = "rgba(10,8,8,0.35)"; g.fillRect(-0.05, -0.05, L + 0.1, ZT + 0.1);
      void W;
    };
  }

  /* ---------------- Giebeldreieck (Schalung) mit Heuluke ---------------- */
  const LUKE = { x0: -0.65, x1: 0.65, z0: 4.25, z1: 5.45 };
  const ZAUF = 6.1;                                // Aufzugsbalken (Mitte)
  function giebelMaler(sued, Z, S) {
    return function (g, F) {
      const w = F.w, h = F.h, px = F.px, B = blickAus(F);
      const c = Z.alt ? BRETT : BRETT_ROH;
      schalungMalen(g, F, -0.05, -0.05, w + 0.1, h + 0.1, c, S.saat + (sued ? 3 : 9));
      const zO = ZG;                       // Flächen-y = zO − z
      const ax = (x) => (sued ? x + X1 : X1 - x);
      /* Wetterbrett unten */
      holzMalen(g, F, -0.05, h - 0.16, w + 0.1, 0.16, hell(c, -0.18), S.saat + 5);
      g.fillStyle = "rgba(20,14,10,0.4)"; g.fillRect(-0.05, h - 0.02, w + 0.1, 0.02);
      /* Eulenloch unter dem Walm */
      if (px > 8) {
        const cx = ax(0), cy = zO - (ZG - 0.45);
        g.fillStyle = rgb(hell(c, -0.25)); g.beginPath(); g.arc(cx, cy, 0.16, 0, TAU); g.fill();
        g.fillStyle = "rgb(18,14,12)"; g.beginPath(); g.arc(cx, cy, 0.11, 0, TAU); g.fill();
      }
      if (sued) {
        const lx = ax(LUKE.x0), lw = LUKE.x1 - LUKE.x0, ly = zO - LUKE.z1, lh = LUKE.z1 - LUKE.z0;
        lukeMalen(g, F, B, lx, ly, lw, lh, Z, c, S);
        /* Loch für den Aufzugsbalken */
        if (px > 10) { g.fillStyle = "rgba(20,14,10,0.6)"; g.fillRect(ax(0) - 0.12, zO - (ZAUF + 0.14), 0.24, 0.28); }
      } else {
        /* Nordgiebel: kleine geschlossene Luke */
        const lx = ax(0.45), ly = zO - 5.3, lw = 0.9, lh = 0.8;
        if (!Z.luke) { g.fillStyle = "rgb(24,20,16)"; g.fillRect(lx, ly, lw, lh); }
        else {
          bretterFluegel(g, F, lx, ly, lw, lh, hell(c, -0.1), S.saat + 21);
          aufsatz(g, F, [[lx, ly + 0.08, lx + lw, ly + 0.08], [lx, ly + lh - 0.08, lx + lw, ly + lh - 0.08]], 0.09, hell(c, -0.2));
          if (px > 8) langband(g, lx + 0.02, ly + 0.2, lw * 0.6, 0.05, false);
        }
        g.strokeStyle = "rgba(16,12,10,0.6)"; g.lineWidth = 0.03; g.strokeRect(lx, ly, lw, lh);
      }
      /* Schatten unter dem Walmüberstand */
      const gr = g.createLinearGradient(0, 0, 0, 0.9);
      gr.addColorStop(0, "rgba(20,20,34,0.45)"); gr.addColorStop(1, "rgba(20,20,34,0)");
      g.fillStyle = gr; g.fillRect(-0.05, -0.05, w + 0.1, 0.95);
    };
  }
  /* Heuluke: rechter Flügel zu, linker offen (Winter: beide zu); drinnen Heu */
  function lukeMalen(g, F, B, x, y, w, h, Z, c, S) {
    const px = F.px;
    g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
    const gi = g.createLinearGradient(0, y, 0, y + h);
    gi.addColorStop(0, "rgb(16,12,10)"); gi.addColorStop(1, "rgb(44,34,24)");
    g.fillStyle = gi; g.fillRect(x, y, w, h);
    if (Z.luke) {
      /* Heu im Dunkeln: goldene Halme, unten ein Haufen, der über die Kante hängt */
      const rng = zufall(S.saat + 3);
      const pT = parallaxe(F, B, 0.4);
      g.fillStyle = "rgb(150,118,58)";
      g.beginPath(); g.moveTo(x, y + h); g.lineTo(x, y + h * 0.62 + pT[1] * 0.3);
      for (let a = 0; a <= 1.001; a += 0.1) g.lineTo(x + w * a, y + h * (0.55 + 0.1 * Math.sin(a * 7 + 1)) + pT[1] * 0.3);
      g.lineTo(x + w, y + h); g.closePath(); g.fill();
      if (px > 12) {
        g.strokeStyle = "rgba(226,196,120,0.75)"; g.lineWidth = Math.max(0.006, 0.7 / px);
        g.beginPath();
        for (let i = 0; i < 90; i++) { const sx = x + rng() * w, sy = y + h * (0.55 + rng() * 0.45), l = 0.06 + rng() * 0.12, a = -0.4 + rng() * 3.9; g.moveTo(sx, sy); g.lineTo(sx + Math.cos(a) * l, sy + Math.sin(a) * l * 0.6); }
        g.stroke();
      }
    }
    g.restore();
    if (!Z.luke) return;
    const zu = F.jahr === "winter";
    const lw = w / 2;
    for (let s = zu ? 0 : 1; s < 2; s++) {
      const lx = x + s * lw;
      bretterFluegel(g, F, lx, y, lw, h, hell(c, -0.12), S.saat + 30 + s);
      aufsatz(g, F, [[lx + 0.08, y + h - 0.1, lx + lw - 0.08, y + 0.1]], 0.08, hell(c, -0.22));
      aufsatz(g, F, [[lx, y + 0.07, lx + lw, y + 0.07], [lx, y + h - 0.07, lx + lw, y + h - 0.07]], 0.09, hell(c, -0.22));
      if (px > 8) for (const yy of [y + 0.2, y + h - 0.2]) langband(g, s ? lx + lw - 0.02 : lx + 0.02, yy, lw * 0.6, 0.05, s === 1);
    }
    /* Rahmen der Luke */
    aufsatz(g, F, [[x - 0.06, y - 0.05, x + w + 0.06, y - 0.05], [x - 0.05, y - 0.06, x - 0.05, y + h + 0.02], [x + w + 0.05, y - 0.06, x + w + 0.05, y + h + 0.02], [x - 0.08, y + h + 0.05, x + w + 0.08, y + h + 0.05]], 0.1, hell(c, -0.2));
    if (F.jahr === "winter" && Z.fertig) { g.fillStyle = "rgb(242,246,252)"; PI.rundRechteck(g, x - 0.1, y + h + 0.01, w + 0.2, 0.04, 0.015); g.fill(); }
  }

  /* =====================================================================
     FIGUREN
     ===================================================================== */
  function milchkanne(hoch, saat, schnee) {
    return function (g, s, F) {
      const r = 0.16 * s, H = hoch * s * ST.KZ, rh = 0.1 * s;
      const umriss = () => {
        g.beginPath();
        g.moveTo(-r, 0); g.lineTo(-r, -H * 0.72); g.quadraticCurveTo(-r, -H * 0.84, -rh, -H * 0.9); g.lineTo(-rh, -H); g.lineTo(rh, -H); g.lineTo(rh, -H * 0.9); g.quadraticCurveTo(r, -H * 0.84, r, -H * 0.72); g.lineTo(r, 0);
        g.ellipse(0, 0, r, r * 0.5, 0, 0, Math.PI); g.closePath();
      };
      if (F.schatten) { umriss(); g.fillStyle = "#000"; g.fill(); return; }
      const FL = figurLicht(F), c = [178, 184, 190];
      umriss();
      const gr = g.createLinearGradient(-r, 0, r, 0);
      gr.addColorStop(0, FL.lit(hell(c, 0.05), FL.lL)); gr.addColorStop(0.25, FL.lit(hell(c, 0.3), FL.lL)); gr.addColorStop(0.5, FL.lit(c, FL.lV)); gr.addColorStop(0.85, FL.lit(hell(c, -0.25), FL.lR)); gr.addColorStop(1, FL.lit(hell(c, -0.1), FL.lR));
      g.fillStyle = gr; g.fill();
      /* Wulstringe, Beulen, Deckel, Griffe */
      g.strokeStyle = FL.lit(hell(c, -0.35), FL.lV, 0.7); g.lineWidth = Math.max(0.6, s * 0.012);
      for (const k of [0.12, 0.62]) { g.beginPath(); g.ellipse(0, -H * k, r, r * 0.5, 0, 0, Math.PI); g.stroke(); }
      g.fillStyle = FL.lit(hell(c, -0.05), FL.lO); g.beginPath(); g.ellipse(0, -H, rh * 1.15, rh * 0.5, 0, 0, TAU); g.fill();
      g.fillStyle = FL.lit(hell(c, -0.3), FL.lV); g.fillRect(-rh * 0.3, -H - 0.05 * s, rh * 0.6, 0.05 * s);
      g.strokeStyle = FL.lit(hell(c, -0.4), FL.lV); g.lineWidth = Math.max(0.8, s * 0.018);
      g.beginPath(); g.arc(-r, -H * 0.66, 0.05 * s, Math.PI * 0.5, Math.PI * 1.5); g.stroke();
      g.beginPath(); g.arc(r, -H * 0.66, 0.05 * s, -Math.PI * 0.5, Math.PI * 0.5); g.stroke();
      if (s > 30) { const rng = zufall(saat); g.fillStyle = FL.lit([120, 110, 96], FL.lV, 0.3); for (let i = 0; i < 4; i++) { g.beginPath(); g.ellipse((rng() - 0.5) * r * 1.4, -H * (0.2 + rng() * 0.4), 0.03 * s, 0.02 * s, 0, 0, TAU); g.fill(); } }
      if (schnee) { g.fillStyle = FL.lit([246, 249, 253], FL.lO); g.beginPath(); g.ellipse(0, -H - 0.01 * s, rh * 1.3, rh * 0.55, 0, Math.PI, 0); g.quadraticCurveTo(0, -H - 0.07 * s, -rh * 1.3, -H - 0.01 * s); g.fill(); }
    };
  }
  function mistgabel(g, s, F) {
    const FL = F.schatten ? null : figurLicht(F);
    const col = (c, l) => (FL ? FL.lit(c, l) : "#000");
    g.lineCap = "round";
    g.strokeStyle = col([150, 116, 78], FL && FL.lV); g.lineWidth = Math.max(1, 0.035 * s);
    g.beginPath(); g.moveTo(0, 0); g.lineTo(0.35 * s, -1.2 * s * ST.KZ); g.stroke();
    g.strokeStyle = col([60, 58, 58], FL && FL.lV); g.lineWidth = Math.max(0.8, 0.02 * s);
    g.beginPath(); g.moveTo(-0.08 * s, 0.05 * s); g.lineTo(0.08 * s, -0.02 * s); g.stroke();
  }
  function rolleSeil(g, s, F) {
    const H = 1.55 * s * ST.KZ;
    const FL = F.schatten ? null : figurLicht(F);
    const col = (c, l) => (FL ? FL.lit(c, l) : "#000");
    g.strokeStyle = col([176, 150, 104], FL && FL.lV); g.lineWidth = Math.max(0.8, 0.022 * s);
    g.beginPath(); g.moveTo(-0.07 * s, -H + 0.08 * s); g.lineTo(-0.07 * s, -0.12 * s); g.moveTo(0.07 * s, -H + 0.08 * s); g.quadraticCurveTo(0.12 * s, -H * 0.5, 0.06 * s, -H * 0.18); g.stroke();
    g.fillStyle = col([60, 56, 54], FL && FL.lV);
    g.beginPath(); g.arc(0, -H + 0.08 * s, 0.09 * s, 0, TAU); g.fill();
    g.fillStyle = col([110, 104, 98], FL && FL.lL); g.beginPath(); g.arc(-0.015 * s, -H + 0.065 * s, 0.05 * s, 0, TAU); g.fill();
    g.strokeStyle = col([50, 48, 48], FL && FL.lV); g.lineWidth = Math.max(0.8, 0.02 * s);
    g.beginPath(); g.arc(-0.07 * s, -0.08 * s, 0.05 * s, -Math.PI * 0.5, Math.PI * 0.9); g.stroke();
  }
  function wetterhahn(g, s, F) {
    const k = s, FL = F.schatten ? null : figurLicht(F);
    const col = (c, l) => (FL ? FL.lit(c, l) : "#000");
    g.strokeStyle = col([40, 38, 38], FL && FL.lV); g.lineWidth = Math.max(0.8, 0.025 * k);
    g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -0.62 * k); g.stroke();
    g.beginPath(); g.moveTo(-0.22 * k, -0.2 * k); g.lineTo(0.22 * k, -0.2 * k); g.stroke();
    g.fillStyle = col([40, 38, 38], FL && FL.lV); g.beginPath(); g.arc(0, -0.34 * k, 0.03 * k, 0, TAU); g.fill();
    /* der Hahn (Silhouette aus Blech, vergoldet) */
    const c = [176, 140, 60];
    g.fillStyle = col(c, FL && FL.lL);
    g.save(); g.translate(0, -0.62 * k); g.scale(k / 100, k / 100);
    g.beginPath();
    g.moveTo(-18, 0); g.lineTo(14, 0); g.quadraticCurveTo(22, -8, 20, -22); g.quadraticCurveTo(30, -34, 18, -42);
    g.lineTo(16, -36); g.quadraticCurveTo(10, -30, 8, -22); g.quadraticCurveTo(0, -18, -8, -20);
    g.quadraticCurveTo(-24, -34, -30, -22); g.quadraticCurveTo(-26, -14, -34, -6); g.quadraticCurveTo(-24, -4, -18, 0); g.closePath(); g.fill();
    g.fillStyle = col([170, 40, 30], FL && FL.lL); g.beginPath(); g.moveTo(17, -42); g.quadraticCurveTo(22, -50, 26, -44); g.quadraticCurveTo(24, -40, 20, -40); g.fill();
    g.restore();
  }
  function aushubFigur(k, winter) {
    return function (g, s, F) {
      const b = 2.1 * s * Math.cbrt(Math.max(0.05, k)), h = 1.3 * s * ST.KZ * Math.cbrt(Math.max(0.05, k));
      g.beginPath(); g.moveTo(-b, 0); g.bezierCurveTo(-b * 0.6, -h * 0.9, b * 0.4, -h * 1.1, b, 0); g.closePath();
      if (F.schatten) { g.fillStyle = "#000"; g.fill(); return; }
      const FL = figurLicht(F);
      const gr = g.createLinearGradient(-b, -h, b, 0);
      gr.addColorStop(0, FL.lit([150, 116, 80], FL.lL)); gr.addColorStop(0.5, FL.lit([122, 92, 62], FL.lO)); gr.addColorStop(1, FL.lit([90, 66, 44], FL.lR));
      g.fillStyle = gr; g.fill();
      const rng = zufall(5);
      g.fillStyle = FL.lit([60, 46, 32], FL.lV, 0.6);
      g.beginPath(); for (let i = 0; i < 50; i++) { const x = (rng() - 0.5) * b * 1.6, y = -rng() * h * 0.7, r = Math.max(0.6, s * 0.03); g.moveTo(x + r, y); g.arc(x, y, r, 0, TAU); } g.fill();
      g.fillStyle = FL.lit([170, 160, 146], FL.lV, 0.8);
      g.beginPath(); for (let i = 0; i < 25; i++) { const x = (rng() - 0.5) * b * 1.5, y = -rng() * h * 0.6, r = Math.max(0.6, s * 0.035); g.moveTo(x + r, y); g.ellipse(x, y, r, r * 0.7, 0, 0, TAU); } g.fill();
      if (winter) { g.fillStyle = FL.lit([244, 247, 252], FL.lO, 0.85); g.beginPath(); g.moveTo(-b * 0.6, -h * 0.55); g.bezierCurveTo(-b * 0.3, -h * 1.0, b * 0.3, -h * 1.05, b * 0.6, -h * 0.5); g.bezierCurveTo(b * 0.2, -h * 0.7, -b * 0.2, -h * 0.72, -b * 0.6, -h * 0.55); g.fill(); }
    };
  }
  function schnurbock(g, s, F) {
    const FL = F.schatten ? null : figurLicht(F);
    const col = (c, l) => (FL ? FL.lit(c, l) : "#000");
    const H = 0.75 * s * ST.KZ;
    g.fillStyle = col([176, 140, 96], FL && FL.lL);
    g.fillRect(-0.3 * s, -H, 0.05 * s, H); g.fillRect(0.25 * s, -H, 0.05 * s, H);
    g.fillStyle = col([196, 160, 112], FL && FL.lV); g.fillRect(-0.36 * s, -H * 0.86, 0.72 * s, 0.07 * s);
  }

  /* =====================================================================
     DAS MODELL
     ===================================================================== */
  ST.modell("kuhstall", {
    name: "Kuhstall", gruppe: "Häuser", grund: [11, 9], hoehe: 10, bauzeit: 14 * 60,
    bauen(M, o) {
      const bau = o.bau == null ? 1 : klemm(o.bau, 0, 1);
      const Z = zustand(bau);
      const winter = o.jahr === "winter";
      const saat = ((o.saat || 7) >>> 0) % 100000;
      const S = {
        saat: saat, winter: winter, jahr: o.jahr,
        torFarbe: TORFARBEN[saat % TORFARBEN.length],
        licht: Z.fertig, nacht: false
      };
      S.nacht = Z.fertig;
      if (Z.grube || Z.aushub > 0.02) grubeBauen(M, Z, winter, S);
      if (Z.platte > 0) bodenBauen(M, Z, S);
      if (!Z.wand) { if (Z.sockel > 0) sockelBauen(M, Z, S); if (Z.schwelle > 0) gerippeBauen(M, Z, S); }
      else hausBauen(M, Z, S);
      if (Z.giebel > 0) giebelBauen(M, Z, S);
      if (Z.sparren > 0 && !Z.dach) sparrenBauen(M, Z, S);
      if (Z.dach) dachBauen(M, Z, S);
      if (Z.reiter > 0) reiterBauen(M, Z, S);
      if (Z.luke && !winter) lukeFluegel(M, Z, S);
      if (Z.aufzug) aufzugBauen(M, Z, S);
      if (Z.heu) heuBauen(M, Z, S);
      if (Z.milch) milchBauen(M, Z, S);
      if (Z.mist) mistBauen(M, Z, S);
      if (Z.fertig) lichterBauen(M, Z, S);
    }
  });

  /* ---------------- Baugrube, Fundament, Boden ---------------- */
  const GX = X1 + 0.5, GY0 = YN - 0.5, GY1 = YS + 0.5, GT = 0.9;
  function grubeBauen(M, Z, winter, S) {
    const G = Z.grube;
    if (G) {
      const T = GT * G.tiefe * (1 - G.verfuellt);
      if (T > 0.02) {
        M.teil("grube", { ebene: -2, schatten: false, mitte: [0, YM, -1] });
        const erde = (sa) => (g, F) => {
          erdeMalen(g, F, F.w, F.h, sa, false);
          const gr = g.createLinearGradient(0, 0, 0, F.h);
          gr.addColorStop(0, "rgba(20,14,10,0.1)"); gr.addColorStop(1, "rgba(20,14,10,0.35)");
          g.fillStyle = gr; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1);
        };
        M.flaeche({ name: "grube-boden", o: [-GX, GY0, -T], u: [1, 0, 0], v: [0, 1, 0], w: 2 * GX, h: GY1 - GY0, malen: (g, F) => { erdeMalen(g, F, F.w, F.h, S.saat + 1, winter && G.tiefe < 0.3); g.fillStyle = "rgba(20,14,10,0.22)"; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1); } });
        wand(M, [-GX, GY0, 0], [0, 1, 0], 2 * GX, T, erde(S.saat + 2), { name: "gw-n", keinAo: true });
        wand(M, [GX, GY1, 0], [0, -1, 0], 2 * GX, T, erde(S.saat + 3), { name: "gw-s", keinAo: true });
        wand(M, [-GX, GY1, 0], [1, 0, 0], GY1 - GY0, T, erde(S.saat + 4), { name: "gw-w", keinAo: true });
        wand(M, [GX, GY0, 0], [-1, 0, 0], GY1 - GY0, T, erde(S.saat + 5), { name: "gw-o", keinAo: true });
      }
      /* Streifenfundament unter den Wänden */
      if (G.beton > 0) {
        const zb = -GT, zt = -GT + GT * G.beton;
        M.teil("fundament", { ebene: -1, mitte: [0, YM, -0.5] });
        const b = 0.6, bet = (g, F) => { betonMalen(g, F, F.w, F.h, S.saat + 11, G.beton < 1); };
        const top = (g, F) => { betonMalen(g, F, F.w, F.h, S.saat + 12, G.beton < 1); };
        kiste(M, -X1 - 0.2, YS - 0.4, zb, X1 + 0.2, YS + 0.2, zt, { s: bet, n: bet, t: top }, { name: "fs" });
        kiste(M, -X1 - 0.2, YN - 0.2, zb, X1 + 0.2, YN + 0.4, zt, { s: bet, n: bet, t: top }, { name: "fn" });
        kiste(M, X1 - 0.4, YN + 0.4, zb, X1 + 0.2, YS - 0.4, zt, { o: bet, w: bet, t: top }, { name: "fo" });
        kiste(M, -X1 - 0.2, YN + 0.4, zb, -X1 + 0.4, YS - 0.4, zt, { o: bet, w: bet, t: top }, { name: "fw" });
        void b;
      }
      /* Schnurgerüst */
      if (G.schnur) {
        M.teil("schnur", { ebene: 1, schatten: false, mitte: [0, YM, 0.6] });
        for (const [x, y] of [[-X1 - 1, YN - 1], [X1 + 1, YN - 1], [X1 + 1, YS + 1], [-X1 - 1, YS + 1]]) M.figur({ x: x, y: y, z: 0, breite: 0.8, hoehe: 0.8, schatten: true, malen: schnurbock });
        M.flaeche({
          name: "schnuere", o: [-X1 - 1.2, YN - 1.2, 0.6], u: [1, 0, 0], v: [0, 1, 0], w: 2 * X1 + 2.4, h: LT + 2.4, keinLicht: true,
          malen: (g, F) => {
            g.strokeStyle = "rgba(240,190,40,0.95)"; g.lineWidth = Math.max(0.008, 0.9 / F.px);
            const ox = -X1 - 1.2, oy = YN - 1.2;
            g.beginPath();
            for (const x of [-X1, X1]) { g.moveTo(x - ox, 0.2); g.lineTo(x - ox, F.h - 0.2); }
            for (const y of [YN, YS]) { g.moveTo(0.2, y - oy); g.lineTo(F.w - 0.2, y - oy); }
            g.stroke();
          }
        });
      }
    }
    if (Z.aushub > 0.02) {
      M.teil("aushub", { mitte: [-2.5, YN - 2.2, 0.5] });
      M.figur({ x: -2.2, y: YN - 2.3, z: 0, breite: 4.4, hoehe: 1.5, malen: aushubFigur(Z.aushub, winter) });
      if (Z.aushub > 0.5) M.figur({ x: 1.6, y: YN - 2.0, z: 0, breite: 3, hoehe: 1, malen: aushubFigur((Z.aushub - 0.5) * 1.4, winter) });
    }
  }
  function bodenBauen(M, Z, S) {
    if (Z.dach) return;           // unter dem Dach sieht man ihn nicht mehr
    M.teil("boden", { ebene: -1, schatten: false, mitte: [0, YM, 0] });
    const h = 0.08 * Z.platte;
    M.flaeche({ name: "stallboden", o: [-X1 + 0.1, YN + 0.1, h + 0.01], u: [1, 0, 0], v: [0, 1, 0], w: 2 * X1 - 0.2, h: LT - 0.2, malen: (g, F) => {
      betonMalen(g, F, F.w, F.h, S.saat + 21, Z.platte < 1);
      /* Mistgang und Rinne (Kotrinne) längs */
      g.fillStyle = "rgba(60,58,54,0.4)"; g.fillRect(F.w * 0.62, 0, 0.3, F.h);
      if (F.jahr === "winter") tonFlecken(g, 0, 0, F.w, F.h, 1.4, 0.5, S.saat + 3, "#e8eef6", true);
    } });
  }
  /* ---------------- Sockel wächst ---------------- */
  function sockelBauen(M, Z, S) {
    const h = ZS * Z.sockel;
    if (h < 0.01) return;
    const d = 0.45;
    for (const W of WAENDE) {
      M.teil("sockel-" + W.name, { mitte: [W.at(W.L / 2)[0] * 0.95, W.at(W.L / 2)[1], 0.3] });
      const u = kreuz(W.n, Z3);
      const tueren = W.plan.oeff.filter((q) => q.art !== "fenster").sort((p, q) => p.a0 - q.a0);
      const stuecke = [];
      let a0 = 0;
      for (const t of tueren) { stuecke.push([a0, t.a0]); a0 = t.a1; }
      stuecke.push([a0, W.L]);
      for (const [a, b] of stuecke) {
        if (b - a < 0.05) continue;
        const p = W.at(a);
        const stein = (g, F) => {
          bruchsteinMalen(g, F, 0, 0, F.w, F.h, { saat: S.saat + ((a * 10) | 0) + W.name.length, bis: F.h });
          g.fillStyle = "rgba(255,252,240,0.12)"; g.fillRect(0, 0, F.w, Math.min(0.2, F.h));
        };
        wand(M, [p[0], p[1], h], W.n, b - a, h, stein, { name: "so-" + W.name + a, ao: true });
        /* Mauerkrone */
        const inn = mul(W.n, -d);
        const q0 = [p[0], p[1], h], q1 = add(q0, mul(u, b - a));
        vieleck(M, "sok-" + W.name + a, [q0, q1, add(q1, inn), add(q0, inn)], Z3, [1, 0, 0], (g, F) => {
          g.fillStyle = "rgb(166,160,148)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
          rausch(g, 0, 0, F.w, F.h, 0.8, 0.4, 17, 3);
          if (Z.sockel < 1) { g.fillStyle = "rgba(120,116,108,0.7)"; g.fillRect(0, F.h * 0.25, F.w, F.h * 0.5); }
        });
        /* Innenseite */
        const r0 = add([p[0], p[1], h], inn);
        wand(M, add(r0, mul(u, b - a)), mul(W.n, -1), b - a, h, (g, F) => { bruchsteinMalen(g, F, 0, 0, F.w, F.h, { saat: S.saat + 40, bis: F.h }); g.fillStyle = "rgba(10,8,8,0.3)"; g.fillRect(0, 0, F.w, F.h); }, { name: "soi-" + W.name + a });
      }
    }
    /* Steinstapel und Mörtelkübel, solange gemauert wird */
    if (Z.sockel < 1) {
      M.teil("baustoff", { mitte: [-X1 - 0.8, YS + 0.8, 0.2] });
      const st = (g, F) => { g.fillStyle = "rgb(150,142,128)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); bruchsteinMalen(g, F, 0, 0, F.w, F.h, { saat: 3 }); };
      kiste(M, -X1 - 1.3, YS + 0.3, 0, -X1 - 0.4, YS + 1.1, 0.45, { s: st, n: st, o: st, w: st, t: st }, { name: "steine" });
      const kb = (g, F) => { g.fillStyle = "rgb(36,36,38)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); g.fillStyle = "rgba(255,255,255,0.12)"; g.fillRect(-0.1, 0, F.w + 0.2, 0.03); };
      kiste(M, -X1 - 0.3, YS + 0.5, 0, 0.3 - X1, YS + 1.0, 0.32, { s: kb, n: kb, o: kb, w: kb, t: (g, F) => { g.fillStyle = "rgb(150,146,138)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); } }, { name: "kuebel" });
    }
  }
  /* ---------------- Fachwerk-Gerippe als echte Hölzer ---------------- */
  function gerippeBauen(M, Z, S) {
    sockelBauen(M, Object.assign({}, Z, { sockel: 1 }), S);
    const c = EICHE_ROH;
    const holz = (saat) => (seite, w, h) => (g, F) => {
      holzMalen(g, F, -0.02, -0.02, F.w + 0.04, F.h + 0.04, PI.streu(c, zufall(saat), 0.06), saat, false);
      g.fillStyle = "rgba(40,24,14,0.35)"; g.fillRect(-0.02, F.h - Math.min(0.02, F.h * 0.2), F.w + 0.04, 0.03);
    };
    const kasten = (name, p0, p1, b, d, saat) => {
      const m = mul(add(p0, p1), 0.5);
      M.teil(name, { mitte: m });
      const ax = sub(p1, p0), Q = Math.abs(ax[2]) > 0.5 ? [1, 0, 0] : nrm([-ax[1], ax[0], 0]);
      balken3(M, p0, p1, Q, b, d, holz(saat), { name: name });
    };
    let nr = 0;
    for (const W of WAENDE) {
      const u = kreuz(W.n, Z3), innen = mul(W.n, -PB / 2);
      const pt = (a, z) => { const p = W.at(a); return add([p[0], p[1], z], innen); };
      /* Schwelle */
      if (Z.schwelle > 0) {
        const tueren = W.plan.oeff.filter((q) => q.art !== "fenster").sort((p, q) => p.a0 - q.a0);
        let a0 = 0, k = 0;
        const stuecke = [];
        for (const t of tueren) { stuecke.push([a0, t.a0 - PB]); a0 = t.a1 + PB; }
        stuecke.push([a0, W.L]);
        for (const [a, b] of stuecke) {
          if (k++ / stuecke.length > Z.schwelle * 1.01) break;
          kasten("sw-" + W.name + k, pt(a, ZS + 0.1), pt(b, ZS + 0.1), 0.2, 0.2, S.saat + k);
        }
      }
      /* Ständer, einer nach dem anderen */
      const st = W.plan.staender;
      const nSt = Math.round(st.length * Z.staender);
      for (let i = 0; i < nSt; i++) {
        const a = st[i];
        kasten("st-" + W.name + i, pt(a, ZSW), pt(a, ZRA), PB, PB, S.saat + 50 + nr++);
      }
      if (Z.riegel > 0) {
        const nR = Math.round(W.plan.riegel.length * Z.riegel);
        for (let i = 0; i < nR; i++) {
          const [a, b, z] = W.plan.riegel[i];
          kasten("ri-" + W.name + i, pt(a, z), pt(b, z), 0.16, 0.16, S.saat + 90 + i);
        }
        for (const f of W.plan.felder) if (f.strebe && Z.riegel > 0.5) {
          const aus = f.strebe > 0 ? f.a : f.b, inn = f.strebe > 0 ? f.b : f.a;
          kasten("str-" + W.name + f.i, pt(aus, ZSW), pt(inn, ZRA), 0.16, 0.16, S.saat + 130 + f.i);
        }
      }
      if (Z.raehm > 0) kasten("ra-" + W.name, pt(0, ZT - 0.11), pt(W.L * Z.raehm, ZT - 0.11), 0.22, 0.22, S.saat + 160);
      void u;
    }
    /* Torbalken */
    if (Z.raehm >= 1) kasten("torbalken", [-1.95, YS - PB / 2, ZT - 0.2], [1.95, YS - PB / 2, ZT - 0.2], 0.3, 0.3, S.saat + 170);
  }
  /* ---------------- geschlossene Wände (ab Ausfachung) ---------------- */
  function hausBauen(M, Z, S) {
    M.teil("haus", { mitte: HAUS_M });
    for (const W of WAENDE) {
      wand(M, W.o, W.n, W.L, ZT, wandMaler(W, Z, S), { name: "w-" + W.name, ao: true, traufe: W.name === "ost" || W.name === "west" ? 0.5 : 0, leuchten: Z.fertig ? wandLeuchten(W, Z, S) : null });
      if (Z.innen) {
        wand(M, W.io, mul(W.n, -1), W.iL, ZT, innenMaler(W, Z, S), { name: "wi-" + W.name });
        /* Mauerkrone (Rähm oben) */
        const p0 = W.o, u = kreuz(W.n, Z3), p1 = add(p0, mul(u, W.L)), inn = mul(W.n, -PB);
        vieleck(M, "krone-" + W.name, [p0, p1, add(p1, inn), add(p0, inn)], Z3, [1, 0, 0], (g, F) => { holzMalen(g, F, -0.05, -0.05, F.w + 0.1, F.h + 0.1, holzFarbe(Z), 5, F.w < F.h); });
      }
    }
  }
  /* ---------------- Giebeldreiecke (Schalung) ---------------- */
  function giebelBauen(M, Z, S) {
    M.teil("giebel", { mitte: [0, YM, ZT + 1.5] });
    for (const sued of [true, false]) {
      const yP = sued ? YS + GV : YN - GV;
      const zO = giebelOben(yP), xO = X1 - (zO - ZT) / TN;
      const hh = (zO - ZT) * Z.giebel, zc = ZT + hh;
      if (hh < 0.02) continue;
      const xc = zc >= zO - 0.001 ? xO : X1 - (zc - ZT) / TN;
      const pts = [[-X1, yP, ZT], [-xc, yP, zc], [xc, yP, zc], [X1, yP, ZT]];
      if (zc >= zO - 0.001) { pts.splice(1, 2, [-xO, yP, zO], [xO, yP, zO]); }
      const P3 = sued ? pts : pts.slice().reverse();
      /* Fläche so anlegen, dass ihr y wie im Maler (zO − z) läuft */
      M.flaeche({
        name: sued ? "giebel-s" : "giebel-n",
        o: sued ? [-X1, yP, zO] : [X1, yP, zO], u: sued ? [1, 0, 0] : [-1, 0, 0], v: [0, 0, -1],
        w: 2 * X1, h: zO - ZT,
        umriss: P3.map((p) => [sued ? p[0] + X1 : X1 - p[0], zO - p[2]]),
        malen: giebelMaler(sued, Z, S), beidseitig: !Z.dach, keinAo: true
      });
      /* Oberseite des Vorsprungs (Wetterbrett) */
      const y0 = sued ? YS : YN, y1 = yP;
      M.flaeche({ name: "wetter-" + sued, o: [-X1, Math.min(y0, y1), ZT + 0.005], u: [1, 0, 0], v: [0, 1, 0], w: 2 * X1, h: Math.abs(y1 - y0), malen: schneeOben("rgb(70,56,44)") });
    }
  }
  /* ---------------- Sparren (offener Dachstuhl) ---------------- */
  function sparrenBauen(M, Z, S) {
    const holz = (saat) => () => (g, F) => { holzMalen(g, F, -0.02, -0.02, F.w + 0.04, F.h + 0.04, PI.streu(EICHE_ROH, zufall(saat), 0.06), saat, false); };
    const liste = [];
    const nP = 9;
    for (let i = 0; i < nP; i++) liste.push({ y: YF0 + 0.12 + (YF1 - YF0 - 0.24) * i / (nP - 1) });
    const n = Math.round((liste.length + 2) * Z.sparren);
    const zr = (x) => ZF - DV - 0.1 - Math.abs(x) * TN;
    liste.slice(0, n).forEach((sp, i) => {
      M.teil("sparren" + i, { ebene: 1, mitte: [0, sp.y, 6] });
      for (const s of [1, -1]) balken3(M, [0, sp.y, zr(0)], [s * XTE, sp.y, zr(XTE)], [0, 1, 0], 0.12, 0.18, holz(S.saat + i * 3 + s), { name: "sp" + i + s });
      /* Kehlbalken */
      const zk = 6.2, xk = (ZF - DV - 0.1 - zk) / TN;
      balken3(M, [-xk, sp.y + 0.1, zk], [xk, sp.y + 0.1, zk], [0, 1, 0], 0.1, 0.16, holz(S.saat + i * 5), { name: "kb" + i });
    });
    if (n > nP) {
      /* Walmsparren: Mitte und zwei Grate je Ende */
      for (const [yF, yE, s] of [[YF1, YWE1, 1], [YF0, YWE0, -1]]) {
        M.teil("walmsp" + s, { ebene: 1, mitte: [0, yF + s * 0.5, 7.5] });
        const top = [0, yF, ZF - DV - 0.1];
        balken3(M, top, [0, yE, ZWE - DV], [1, 0, 0], 0.12, 0.18, holz(S.saat + 200 + s), { name: "wm" + s });
        for (const t of [1, -1]) balken3(M, top, [t * XWE, yE, ZWE - DV], [0, 0, 1], 0.12, 0.18, holz(S.saat + 210 + s + t), { name: "wg" + s + t });
      }
    }
    if (Z.sparren > 0.6 && Z.sparren < 1) {
      /* Richtkrone auf dem First */
      M.teil("richtkrone", { ebene: 2, mitte: [0, YM, ZF + 1] });
      M.figur({ x: 0, y: YM, z: ZF - 0.2, breite: 0.8, hoehe: 1.6, schatten: true, malen: richtkrone(S.winter) });
    }
  }
  function richtkrone(winter) {
    return function (g, s, F) {
      if (F.schatten) return;
      const k = s, FL = figurLicht(F);
      g.fillStyle = FL.lit([84, 60, 40], FL.lV); g.fillRect(-0.03 * k, -1.5 * k, 0.06 * k, 1.5 * k);
      for (let i = 0; i < 5; i++) {
        const y = -1.6 * k + i * 0.2 * k, b = (0.12 + i * 0.08) * k;
        const c = winter ? [40, 74, 52] : [36, 86, 46];
        g.fillStyle = FL.lit(c, FL.lL); g.beginPath(); g.moveTo(0, y - 0.1 * k); g.lineTo(-b, y + 0.2 * k); g.lineTo(0, y + 0.2 * k); g.closePath(); g.fill();
        g.fillStyle = FL.lit(c, FL.lR); g.beginPath(); g.moveTo(0, y - 0.1 * k); g.lineTo(0, y + 0.2 * k); g.lineTo(b, y + 0.2 * k); g.closePath(); g.fill();
      }
      const farben = [[200, 32, 44], [242, 194, 48], [42, 98, 184], [255, 255, 255]];
      g.lineWidth = Math.max(1, 0.03 * k);
      for (let i = 0; i < 4; i++) { g.strokeStyle = FL.lit(farben[i], FL.lV); g.beginPath(); g.moveTo(0, -1.4 * k); g.quadraticCurveTo((i - 1.5) * 0.25 * k, -1.0 * k, (i - 1.5) * 0.3 * k, -0.7 * k); g.stroke(); }
    };
  }

  /* =====================================================================
     DAS DACH: zwei Hauptflächen, zwei Krüppelwalme, Untersichten,
     Ortgang- und Traufbretter; im Winter Wechten, Wülste, Eiszapfen
     ===================================================================== */
  function dachBauen(M, Z, S) {
    const winter = S.winter && Z.fertig, herbst = S.jahr === "herbst" && Z.fertig;
    const wS = YWE1 - YWE0, hS = XTE / cosN, bW = XWE / cosN, hW = (YWE1 - YF1) / cosW;
    const rTotal = Math.ceil(hS / PF_R), wTotal = Math.ceil(hW / PF_R);
    /* Ziegelreihen im Bau: erst die Hauptflächen, dann die Walme */
    const reihen = Z.ziegel >= 1 ? null : Z.ziegel * (rTotal + wTotal * 0.5);
    const rH = reihen == null ? null : Math.min(rTotal, reihen), rW = reihen == null ? null : Math.max(0, (reihen - rTotal) * 2);
    const dachMal = (seite) => function (g, F) {
      const nord = seite === 1 ? 0.6 : 0.1;
      if (rH != null) {
        lattungMalen(g, F, 0, wS, hS);
        if (rH > 0) pfannenMalen(g, F, -0.05, wS + 0.05, hS, 0, S.saat + seite, { bisReihe: Math.floor(rH), teilReihe: rH - Math.floor(rH), nord: nord });
        return;
      }
      if (winter) {
        dachSchnee(g, F, -0.05, wS + 0.05, hS, 0, S.saat + seite, { oben: seite === 0 ? 0.16 : 0, nord: nord, reiter: seite === 0 ? YWE1 - YM : YM - YWE0 });
      } else {
        pfannenMalen(g, F, -0.05, wS + 0.05, hS, 0, S.saat + seite, { nord: nord, welt: seite * 17, laub: herbst });
        firstBand(g, F, [YWE1 - YF1, -0.02], [YWE1 - YF0, -0.02], false);
        const um = F.flaeche.umriss;
        firstBand(g, F, [um[0][0], um[0][1] + 0.02], [um[5][0] + 0.04, um[5][1]], false);
        firstBand(g, F, [um[2][0] - 0.04, um[2][1]], [um[1][0], um[1][1] + 0.02], false);
      }
    };
    const walmMal = (seite) => (g, F) => {
      const w = F.w, h = F.h;
      if (rW != null) {
        lattungMalen(g, F, 0, w, h);
        if (rW > 0) pfannenMalen(g, F, -0.05, w + 0.05, h, 0, S.saat + 7, { bisReihe: Math.floor(rW), teilReihe: rW - Math.floor(rW) });
        return;
      }
      if (winter) dachSchnee(g, F, -0.05, w + 0.05, h, 0, S.saat + 9 + seite, { oben: 0 });
      else {
        pfannenMalen(g, F, -0.05, w + 0.05, h, 0, S.saat + 9 + seite, { nord: seite ? 0.7 : 0.2, welt: 40 + seite * 9, laub: herbst });
        firstBand(g, F, [w / 2, 0], [0, h], false);
        firstBand(g, F, [w, h], [w / 2, 0], false);
      }
    };
    M.teil("dach", { ebene: 2, mitte: [0, YM, ZF + 10] });
    const ex = { lichtExtra: winter ? 0.05 : 0 };
    const umS = [[YWE1 - YF1, 0], [YWE1 - YF0, 0], [wS, bW], [wS, hS], [0, hS], [0, bW]];
    M.flaeche(Object.assign({ name: "dach-o", o: [0, YWE1, ZF], u: [0, -1, 0], v: [cosN, 0, -sinN], w: wS, h: hS, umriss: umS, malen: dachMal(0) }, ex));
    M.flaeche(Object.assign({ name: "dach-w", o: [0, YWE0, ZF], u: [0, 1, 0], v: [-cosN, 0, -sinN], w: wS, h: hS, umriss: umS, malen: dachMal(1) }, ex));
    const umW = [[XWE, 0], [2 * XWE, hW], [0, hW]];
    M.flaeche(Object.assign({ name: "walm-s", o: [-XWE, YF1, ZF], u: [1, 0, 0], v: [0, cosW, -sinW], w: 2 * XWE, h: hW, umriss: umW, malen: walmMal(0) }, ex));
    M.flaeche(Object.assign({ name: "walm-n", o: [XWE, YF0, ZF], u: [-1, 0, 0], v: [0, -cosW, -sinW], w: 2 * XWE, h: hW, umriss: umW, malen: walmMal(1) }, ex));
    /* Untersichten am Giebelüberstand (unter den Hauptflächen) und unter dem Walm */
    const unters = (sa) => (g, F) => {
      schalungMalen(g, F, -0.05, -0.05, F.w + 0.1, F.h + 0.1, [96, 78, 60], sa);
      g.fillStyle = "rgba(14,12,16,0.35)"; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1);
    };
    const zU = (x) => ZT + (X1 - x) * TN;
    for (const [yWand, yK, s] of [[YS + GV, YWE1, 1], [YN - GV, YWE0, -1]]) {
      for (const t of [1, -1]) {
        vieleck(M, "unt" + s + t, [[t * XTE, yWand, zU(XTE)], [t * XTE, yK, zU(XTE)], [t * XWE, yK, zU(XWE)], [t * XG, yWand, zU(XG)]], [-t * sinN, 0, -cosN], [0, 1, 0], unters(60 + s + t), { keinAo: true });
      }
      /* unter dem Krüppelwalm */
      vieleck(M, "untw" + s, [[-XWE, yK, ZWE - DICKE / cosW], [XWE, yK, ZWE - DICKE / cosW], [XG, yWand, ZG], [-XG, yWand, ZG]], [0, -s * sinW, -cosW], [1, 0, 0], unters(70 + s), { keinAo: true });
    }
    /* Kanten: Traufbretter, Walmtraufen, Ortgänge (Windbretter) */
    const db = 0.22, dO = DV + 0.02;
    const brett = (g, F) => { holzMalen(g, F, -0.02, -0.02, F.w + 0.04, F.h + 0.04, [96, 74, 54], 71); g.fillStyle = "rgba(20,14,10,0.35)"; g.fillRect(-0.02, F.h - 0.04, F.w + 0.04, 0.04); if (winter) { g.fillStyle = "rgb(242,246,252)"; g.fillRect(-0.02, -0.02, F.w + 0.04, 0.04); } };
    M.flaeche({ name: "traufe-o", o: [XTE, YWE1, ZTE], u: [0, -1, 0], v: [0, 0, -1], w: wS, h: db, malen: brett, keinAo: true });
    M.flaeche({ name: "traufe-w", o: [-XTE, YWE0, ZTE], u: [0, 1, 0], v: [0, 0, -1], w: wS, h: db, malen: brett, keinAo: true });
    M.flaeche({ name: "wtraufe-s", o: [-XWE, YWE1, ZWE], u: [1, 0, 0], v: [0, 0, -1], w: 2 * XWE, h: db, malen: brett, keinAo: true });
    M.flaeche({ name: "wtraufe-n", o: [XWE, YWE0, ZWE], u: [-1, 0, 0], v: [0, 0, -1], w: 2 * XWE, h: db, malen: brett, keinAo: true });
    const ortBrett = (g, F) => {
      holzMalen(g, F, -0.02, -0.02, F.w + 0.04, F.h + 0.04, [92, 70, 50], 72);
      if (winter) { const um = F.flaeche.umriss; g.fillStyle = "rgb(242,246,252)"; g.beginPath(); g.moveTo(um[0][0], um[0][1] - 0.01); g.lineTo(um[1][0], um[1][1] - 0.01); g.lineTo(um[1][0], um[1][1] + 0.04); g.lineTo(um[0][0], um[0][1] + 0.04); g.closePath(); g.fill(); }
    };
    const spaet = [];
    for (const [yK, s] of [[YWE1, 1], [YWE0, -1]]) {
      const u = [s, 0, 0], n = [0, s, 0];
      for (const t of [1, -1]) {
        /* Ortgangbrett zwischen Haupttraufe (t·XTE, ZTE) und Walmtraufe (t·XWE, ZWE) */
        const A = [t * XTE, yK, ZTE], Bp = [t * XWE, yK, ZWE];
        vieleck(M, "ort" + s + t, [Bp, A, add(A, [0, 0, -dO]), add(Bp, [0, 0, -dO])], n, u, ortBrett, { keinAo: true });
        if (winter) {
          const ly = Math.abs(XTE - XWE);
          const links = (s > 0) === (t < 0);   // liegt die Haupttraufe links?
          const zl = links ? ZTE : ZWE, zr = links ? ZWE : ZTE, ztop = Math.max(zl, zr) + 0.3;
          const ox = s > 0 ? Math.min(t * XTE, t * XWE) : Math.max(t * XTE, t * XWE);
          spaet.push({ teil: "ortschnee" + s + t, mitte: [t * 20, yK + s * 30, ZF + 12], f: { name: "ortschnee" + s + t, o: [ox, yK + s * 0.01, ztop], u: u, v: [0, 0, -1], w: ly, h: ztop - Math.min(zl, zr) + 0.3, malen: schneeWulstMal([t * sinN, 0, cosN], (a) => (ztop - zl) + (a / ly) * (zl - zr), 90 + s + t * 3, 0.18), keinLicht: true, keinAo: true } });
        }
      }
      if (winter) {
        spaet.push({ teil: "walmschnee" + s, mitte: [0, yK + s * 30, ZF + 12], f: { name: "walmwechte" + s, o: [s > 0 ? -XWE - 0.05 : XWE + 0.05, yK + s * 0.06, ZWE + 0.24], u: u, v: [0, 0, -1], w: 2 * XWE + 0.1, h: 0.36, malen: wechteMal(S.saat + s * 5, [0, s * sinW, cosW]), keinLicht: true, keinAo: true } });
        spaet.push({ f: { name: "walmzapfen" + s, o: [s > 0 ? -XWE : XWE, yK + s * 0.03, ZWE - 0.2], u: u, v: [0, 0, -1], w: 2 * XWE, h: 0.5, malen: zapfenMal(S.saat + s * 11, 0.35), keinLicht: true, keinAo: true } });
      }
    }
    if (winter) {
      for (const t of [1, -1]) {
        const u = [0, -t, 0];
        spaet.push({ teil: "wechte" + t, mitte: [t * 30, YM, ZF + 11], f: { name: "wechte" + t, o: [t * (XTE + 0.06), t > 0 ? YWE1 + 0.05 : YWE0 - 0.05, ZTE + 0.24], u: u, v: [0, 0, -1], w: wS + 0.1, h: 0.4, malen: wechteMal(S.saat + t * 3, [t * sinN, 0, cosN]), keinLicht: true, keinAo: true } });
        spaet.push({ f: { name: "zapfen" + t, o: [t * (XTE + 0.02), t > 0 ? YWE1 : YWE0, ZTE - 0.18], u: u, v: [0, 0, -1], w: wS, h: 0.8, malen: zapfenMal(S.saat + t * 5, 0.65), leuchten: zapfenMal(S.saat + t * 5, 0.65, true), keinLicht: true, keinAo: true } });
      }
      /* Firstpolster */
      spaet.push({ teil: "firstschnee", mitte: [0, YM, ZF + 13], f: { name: "firstschnee", o: [0, YF1 + 0.05, ZF + 0.18], u: [0, -1, 0], v: [0, 0, -1], w: YF1 - YF0 + 0.1, h: 0.24, beidseitig: true, keinLicht: true, keinAo: true,
        umriss: (function () { const P = [[0, 0.22]], lf = YF1 - YF0 + 0.1; for (let a = 0; a <= lf; a += 0.3) P.push([a, 0.05 + 0.04 * Math.sin(a * 2.3) + 0.02 * Math.sin(a * 6.1)]); P.push([lf, 0.22]); return P; })(),
        malen: (g, F) => {
          const L = lichtMal(lichtN(F, blickAus(F), [0, 0, 1], 0.04));
          const gr = g.createLinearGradient(0, 0, 0, 0.24);
          gr.addColorStop(0, L([250, 252, 255], 1, 1.05)); gr.addColorStop(0.6, L([238, 243, 251])); gr.addColorStop(1, L([200, 212, 234], 1, 0.9));
          g.fillStyle = gr; g.fillRect(-0.05, -0.05, F.w + 0.1, 0.35);
        } } });
    }
    for (const e of spaet) { if (e.teil) M.teil(e.teil, { ebene: 3, schatten: false, mitte: e.mitte }); M.flaeche(e.f); }
  }

  /* ---------------- Lüftungsreiter mit Lamellen und Wetterhahn ---------------- */
  function reiterBauen(M, Z, S) {
    const winter = S.winter && Z.fertig;
    const hoch = RZ - (ZF - RX * TN);            // Wandhöhe an der Traufe des Reiters (über der Dachfläche)
    const zBoden = ZF - RX * TN;
    const zTop = zBoden + hoch * Z.reiter;
    M.teil("reiter", { ebene: 3, mitte: [0, YM, ZF + 20] });
    const c = Z.alt ? BRETT : BRETT_ROH;
    const lamellen = (g, F) => {
      const w = F.w, h = F.h;
      schalungMalen(g, F, -0.05, -0.05, w + 0.1, h + 0.1, c, S.saat + 61);
      /* Lamellenfeld oben */
      const ly0 = 0.08, ly1 = Math.min(h - 0.1, 0.62);
      if (ly1 - ly0 > 0.1 && Z.reiter >= 1) {
        g.fillStyle = "rgb(20,16,14)"; g.fillRect(0.08, ly0, w - 0.16, ly1 - ly0);
        for (let y = ly0 + 0.02; y < ly1; y += 0.085) {
          const gr = g.createLinearGradient(0, y, 0, y + 0.07);
          gr.addColorStop(0, rgb(hell(c, 0.12))); gr.addColorStop(1, rgb(hell(c, -0.3)));
          g.fillStyle = gr; g.fillRect(0.08, y, w - 0.16, 0.06);
          if (winter) { g.fillStyle = "rgba(244,247,252,0.85)"; g.fillRect(0.08, y - 0.006, w - 0.16, 0.014); }
        }
        g.strokeStyle = rgb(hell(c, -0.25)); g.lineWidth = 0.05; g.strokeRect(0.08, ly0, w - 0.16, ly1 - ly0);
      }
    };
    /* Seitenwände Ost/West (unten waagerecht auf der Dachfläche) */
    for (const t of [1, -1]) M.flaeche({ name: "rw" + t, o: [t * RX, t > 0 ? RY1 : RY0, zTop], u: [0, -t, 0], v: [0, 0, -1], w: RY1 - RY0, h: zTop - zBoden + 0.02, malen: lamellen, ao: true });
    /* Giebelseiten Süd/Nord: unten der Dachfirst (V-förmig), oben das Dreieck */
    const hf = RX * Math.tan(RNEIG);
    for (const s of [1, -1]) {
      const y = s > 0 ? RY1 : RY0;
      const full = Z.reiter >= 1;
      const top = full ? zTop + hf : zTop;
      const um = full ? [[0, hf], [RX, 0], [2 * RX, hf], [2 * RX, top - zBoden], [RX, top - ZF + 0.02], [0, top - zBoden]]
        : [[0, 0], [2 * RX, 0], [2 * RX, top - zBoden], [RX, top - ZF + 0.02], [0, top - zBoden]];
      M.flaeche({ name: "rg" + s, o: [s > 0 ? -RX : RX, y, top], u: [s, 0, 0], v: [0, 0, -1], w: 2 * RX, h: top - zBoden + 0.02, umriss: um, malen: lamellen, ao: true });
    }
    if (Z.reiter < 1) return;
    /* Dächlein: Pfannen, Überstand 0,15 m */
    const ue = 0.18, xE = RX + ue, zE = zTop - ue * Math.tan(RNEIG), zR = zTop + RX * Math.tan(RNEIG) * 1.0 + 0.04;
    const lang = Math.hypot(xE, zR - zE), y0 = RY0 - 0.15, y1 = RY1 + 0.15;
    const kl = Math.cos(Math.atan2(zR - zE, xE)), sl = Math.sin(Math.atan2(zR - zE, xE));
    const mal = (seite) => (g, F) => {
      if (winter) { schneeFlaeche(g, F, -0.05, -0.05, F.w + 0.1, F.h + 0.1, S.saat + 70 + seite, {}); g.fillStyle = "rgba(255,255,255,0.4)"; g.fillRect(-0.05, F.h - 0.08, F.w + 0.1, 0.08); }
      else { pfannenMalen(g, F, -0.05, F.w + 0.05, F.h, 0, S.saat + 70 + seite, { nord: 0.3 }); firstBand(g, F, [0, -0.03], [F.w, -0.03], false); }
    };
    M.flaeche({ name: "rd-o", o: [0, y1, zR], u: [0, -1, 0], v: [kl, 0, -sl], w: y1 - y0, h: lang, malen: mal(0) });
    M.flaeche({ name: "rd-w", o: [0, y0, zR], u: [0, 1, 0], v: [-kl, 0, -sl], w: y1 - y0, h: lang, malen: mal(1) });
    const kante = (g, F) => { holzMalen(g, F, -0.02, -0.02, F.w + 0.04, F.h + 0.04, [92, 70, 50], 5); if (winter) { g.fillStyle = "rgb(242,246,252)"; g.fillRect(-0.02, -0.02, F.w + 0.04, 0.05); } };
    for (const s of [1, -1]) {
      const y = s > 0 ? y1 : y0;
      vieleck(M, "rort" + s, [[-xE, y, zE], [0, y, zR], [xE, y, zE], [xE, y, zE - 0.08], [0, y, zR - 0.08], [-xE, y, zE - 0.08]], [0, s, 0], [s, 0, 0], kante, { keinAo: true });
    }
    M.figur({ x: 0, y: YM, z: zR, breite: 0.8, hoehe: 1.0, schatten: true, malen: wetterhahn });
  }

  /* ---------------- offener Flügel der Heuluke ---------------- */
  function lukeFluegel(M, Z, S) {
    M.teil("lukeflugel", { mitte: [LUKE.x0 - 0.1, YS + 0.45, 5.1] });
    const c = hell(Z.alt ? BRETT : BRETT_ROH, -0.12);
    const w = (LUKE.x1 - LUKE.x0) / 2, h = LUKE.z1 - LUKE.z0;
    /* um 100° aufgeschwenkt: vom Band an der linken Kante nach außen;
       zwei Flächen (je Seite eine), damit beide Seiten richtig im Licht stehen */
    const a = 100 * RAD, d = [Math.cos(a), Math.sin(a), 0];
    const p0 = [LUKE.x0 - 0.02, YS + GV + 0.02, LUKE.z1], p1 = add(p0, mul(d, w));
    const mal = (sa) => (g, F) => {
      bretterFluegel(g, F, -0.02, -0.02, F.w + 0.04, F.h + 0.04, c, S.saat + sa);
      aufsatz(g, F, [[0.08, F.h - 0.1, F.w - 0.08, 0.1]], 0.08, hell(c, -0.12));
      aufsatz(g, F, [[0, 0.07, F.w, 0.07], [0, F.h - 0.07, F.w, F.h - 0.07]], 0.09, hell(c, -0.12));
    };
    M.flaeche({ name: "luke-a", o: p0, u: d, v: [0, 0, -1], w: w, h: h, keinAo: true, malen: mal(33) });
    M.flaeche({ name: "luke-b", o: p1, u: mul(d, -1), v: [0, 0, -1], w: w, h: h, keinAo: true, malen: mal(34) });
  }
  /* ---------------- Aufzugsbalken mit Rolle und Seil ---------------- */
  function aufzugBauen(M, Z, S) {
    M.teil("aufzug", { mitte: [0, YS + 0.7, ZAUF] });
    const mal = () => (g, F) => { holzMalen(g, F, -0.02, -0.02, F.w + 0.04, F.h + 0.04, EICHE, S.saat + 81); };
    balken3(M, [0, YS + GV, ZAUF], [0, YS + 1.35, ZAUF], [1, 0, 0], 0.18, 0.22, mal, { name: "aufz" });
    if (S.winter && Z.fertig) M.flaeche({ name: "aufz-schnee", o: [-0.1, YS + GV, ZAUF + 0.115], u: [1, 0, 0], v: [0, 1, 0], w: 0.2, h: 1.3, malen: schneeOben(null), keinLicht: false });
    M.figur({ x: 0, y: YS + 1.2, z: ZAUF - 0.11 - 1.55, breite: 0.4, hoehe: 1.6, schatten: true, malen: rolleSeil });
  }

  /* ---------------- Heuballen an der Westseite ---------------- */
  function heuBauen(M, Z, S) {
    const winter = S.winter && Z.fertig, rng = zufall(S.saat + 5);
    const stroh = (stirn) => (g, F) => {
      const c = [196, 164, 96];
      g.fillStyle = rgb(c); g.fillRect(-0.02, -0.02, F.w + 0.04, F.h + 0.04);
      maser(g, 0, 0, F.w, F.h, stirn ? 0.08 : 0.02, stirn ? 0.08 : 0.5, 0.55, 3, false);
      tonFlecken(g, 0, 0, F.w, F.h, 0.5, 0.35, 7, "#8a7240");
      if (F.px > 25) {
        const r = zufall(F.w * 100 | 0);
        g.strokeStyle = "rgba(240,214,140,0.7)"; g.lineWidth = 0.7 / F.px;
        g.beginPath(); for (let i = 0; i < 60; i++) { const x = r() * F.w, y = r() * F.h, a = stirn ? r() * TAU : (r() - 0.5) * 0.5; g.moveTo(x, y); g.lineTo(x + Math.cos(a) * 0.08, y + Math.sin(a) * 0.08); } g.stroke();
      }
      if (!stirn) { g.fillStyle = "rgba(90,70,40,0.55)"; for (const k of [0.3, 0.7]) g.fillRect(F.w * k - 0.01, 0, 0.02, F.h); }
      if (F.jahr === "herbst") laubMalen(g, F, 0, 0, F.w, F.h, 17, 0.3);
    };
    const oben = (g, F) => { stroh(false)(g, F); if (winter) schneeOben(null)(g, F); };
    const ballen = [[-4.95, -3.4, 0], [-4.95, -2.45, 0], [-4.95, -1.5, 0], [-4.95, -2.95, 0.36], [-4.95, -2.0, 0.36]];
    ballen.forEach(([x, y, z], i) => {
      const bx = 0.48, by = 0.9, bz = 0.36, dx = (rng() - 0.5) * 0.06;
      M.teil("heu" + i, { mitte: [x, y, z + 0.18] });
      kiste(M, x - bx / 2 + dx, y - by / 2, z, x + bx / 2 + dx, y + by / 2, z + bz, { s: stroh(true), n: stroh(true), o: stroh(false), w: stroh(false), t: oben }, { name: "heu" + i });
    });
  }
  /* ---------------- Milchbank mit Kannen ---------------- */
  function milchBauen(M, Z, S) {
    const winter = S.winter && Z.fertig;
    const x0 = -3.95, x1 = -2.75, y0 = YS + 0.55, y1 = YS + 1.2, zb = 0.85;
    M.teil("milchbank", { mitte: [(x0 + x1) / 2, (y0 + y1) / 2, 0.5] });
    const holz = (g, F) => holzMalen(g, F, -0.02, -0.02, F.w + 0.04, F.h + 0.04, [118, 92, 66], 13, F.h > F.w);
    for (const [x, y] of [[x0, y0], [x1 - 0.1, y0], [x0, y1 - 0.1], [x1 - 0.1, y1 - 0.1]]) kiste(M, x, y, 0, x + 0.1, y + 0.1, zb - 0.06, { s: holz, n: holz, o: holz, w: holz }, { name: "bein" + x + y });
    kiste(M, x0 - 0.03, y0 - 0.03, zb - 0.06, x1 + 0.03, y1 + 0.03, zb, { s: holz, n: holz, o: holz, w: holz, t: (g, F) => {
      const rng = zufall(3);
      for (let y = 0; y < F.h; y += 0.16) { g.fillStyle = rgb(PI.streu([128, 100, 72], rng, 0.08)); g.fillRect(-0.02, y, F.w + 0.04, 0.15); }
      maser(g, 0, 0, F.w, F.h, 0.03, 1.2, 0.4, 5, false);
      g.fillStyle = "rgba(30,20,14,0.5)"; for (let y = 0.155; y < F.h; y += 0.16) g.fillRect(-0.02, y, F.w + 0.04, 0.01);
      if (winter) schneeOben(null)(g, F);
    } }, { name: "platte" });
    M.figur({ x: x0 + 0.3, y: (y0 + y1) / 2, z: zb, breite: 0.5, hoehe: 0.75, malen: milchkanne(0.72, 1, winter) });
    M.figur({ x: x1 - 0.32, y: (y0 + y1) / 2 + 0.05, z: zb, breite: 0.5, hoehe: 0.75, malen: milchkanne(0.72, 2, winter) });
    M.figur({ x: x1 + 0.35, y: y1 + 0.1, z: 0, breite: 0.5, hoehe: 0.75, malen: milchkanne(0.62, 3, winter) });
  }
  /* ---------------- Mistplatte mit Misthaufen ---------------- */
  function mistBauen(M, Z, S) {
    const winter = S.winter && Z.fertig;
    M.teil("mistplatte", { mitte: [(MX0 + MX1) / 2, (MY0 + MY1) / 2, 0.2] });
    const bet = (g, F) => { betonMalen(g, F, F.w, F.h, 31, false); g.fillStyle = "rgba(60,48,36,0.3)"; g.fillRect(-0.05, F.h * 0.5, F.w + 0.1, F.h * 0.5); };
    const hb = 0.4, d = 0.14;
    kiste(M, MX1 - d, MY0, 0, MX1, MY1, hb, { o: bet, w: bet, s: bet, n: bet, t: schneeOben(bet) }, { name: "mo" });
    kiste(M, MX0, MY0, 0, MX1 - d, MY0 + d, hb, { n: bet, s: bet, w: bet, t: schneeOben(bet) }, { name: "mn" });
    kiste(M, MX0, MY1 - d, 0, MX1 - d, MY1, hb, { s: bet, n: bet, w: bet, t: schneeOben(bet) }, { name: "ms" });
    /* der Haufen: ein flacher Walm aus Mist mit Stroh */
    M.teil("mist", { mitte: [(MX0 + MX1) / 2 - 0.05, (MY0 + MY1) / 2, 0.6] });
    const ax0 = MX0 + 0.02, ax1 = MX1 - d - 0.02, ay0 = MY0 + d + 0.02, ay1 = MY1 - d - 0.02, zH = 0.72;
    const xm = (ax0 + ax1) / 2, yk0 = ay0 + 0.55, yk1 = ay1 - 0.55;
    const mist = (sa) => (g, F) => {
      g.fillStyle = "rgb(78,60,44)"; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1);
      tonFlecken(g, 0, 0, F.w, F.h, 0.7, 0.6, sa, "#3a2a1e");
      tonFlecken(g, 0, 0, F.w, F.h, 0.45, 0.45, sa + 2, "#9a7c4c");
      if (F.px > 12) {
        const r = zufall(sa + 9);
        g.lineWidth = Math.max(0.008, 0.8 / F.px); g.strokeStyle = "rgba(214,184,110,0.8)";
        g.beginPath(); for (let i = 0; i < Math.min(400, F.w * F.h * 90); i++) { const x = r() * F.w, y = r() * F.h, a = r() * TAU, l = 0.05 + r() * 0.1; g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); } g.stroke();
      }
      const gr = g.createLinearGradient(0, 0, 0, F.h);
      gr.addColorStop(0, "rgba(255,240,210,0.08)"); gr.addColorStop(1, "rgba(30,20,12,0.3)");
      g.fillStyle = gr; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1);
      if (winter) { g.save(); tonFlecken(g, 0, 0, F.w, F.h * 0.6, 0.8, 0.8, sa + 5, "#e8eef6"); g.restore(); }
    };
    const K0 = [xm, yk0, zH], K1 = [xm, yk1, zH];
    const A = [ax0, ay0, 0], Bq = [ax1, ay0, 0], C = [ax1, ay1, 0], D = [ax0, ay1, 0];
    const nO = nrm(kreuz(sub(K0, Bq), sub(C, Bq))), nW = nrm(kreuz(sub(D, A), sub(K0, A)));
    vieleck(M, "mist-o", [K1, K0, Bq, C], nO[0] > 0 ? nO : mul(nO, -1), [0, -1, 0], mist(41), { ao: true });
    vieleck(M, "mist-w", [K0, K1, D, A], nW[0] < 0 ? nW : mul(nW, -1), [0, 1, 0], mist(43), { ao: true });
    const nS = nrm(kreuz(sub(C, D), sub(K1, D))), nN = nrm(kreuz(sub(A, Bq), sub(K0, Bq)));
    vieleck(M, "mist-s", [K1, C, D], nS[1] > 0 ? nS : mul(nS, -1), [1, 0, 0], mist(45), { ao: true });
    vieleck(M, "mist-n", [K0, A, Bq], nN[1] < 0 ? nN : mul(nN, -1), [-1, 0, 0], mist(47), { ao: true });
    M.figur({ x: xm + 0.1, y: yk0 + 0.4, z: zH - 0.05, breite: 0.6, hoehe: 1.2, schatten: true, malen: mistgabel });
    /* warmer Mist dampft im Winter */
    if (winter) M.rauchAus(xm, (MY0 + MY1) / 2, zH + 0.1, 0.25);
  }
  /* ---------------- Lichter der Nacht ---------------- */
  function lichterBauen(M, Z, S) {
    const ost = WAENDE[1], t = ost.plan.oeff[1];
    const pO = ost.at(t.a1 + 0.42);
    M.bodenlicht(pO[0] + 1.3, pO[1], 2.2, "255,196,120", 0.6);
    const pS = WAENDE[0].at(1.95);
    M.bodenlicht(pS[0], pS[1] + 1.4, 2.2, "255,196,120", 0.6);
    M.bodenlicht(0, YS + 1.1, 1.6, "255,190,110", 0.35);
    void Z;
  }
})();
