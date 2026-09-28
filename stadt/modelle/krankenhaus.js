/* =====================================================================
   KRANKENHAUS — kleines Kreiskrankenhaus um 1906
   ---------------------------------------------------------------------
   XANDER: „richtig filigran. Richtig schön ausarbeiten mit schönen
   Texturen" · „keine Comic Grafik … viel mehr am Realismus" · „ohne
   Pixelkanten und komische Vektorrückstände" · „Man soll das Fundament
   sehen beim Aufbauen" · „Du bist dein schlimmster Kritiker" · Stil
   „von Anno oder geiler", „trotzdem mit SVG Grafiken".

   VORBILD: Kreiskrankenhäuser der späten Gründerzeit mit Anklängen an
   den Jugendstil: zweigeschossiger Putzbau über einem hohen Sockel aus
   gebossten Sandsteinquadern (Hochparterre über dem Keller), Gliederung
   in rotem Mainsandstein (Eckquader, Gurtgesims, Fenstergewände,
   Sohlbänke auf Konsolen, Verdachungen, Kranzgesims mit Konsolfries),
   Mansardwalmdach mit Schiefer in Schuppendeckung und Gauben. In der
   Mitte ein Risalit mit geschweiftem Jugendstilgiebel (Schriftband
   „KRANKENHAUS", Bogenfenster, Kugel auf dem Scheitel), davor die
   Einfahrt mit gläsernem Vordach auf gusseisernen Säulen; auf dem
   Vordach das weiße Emailleschild mit dem roten Kreuz. Rechts vor dem
   Haus, dezent, der Stellplatz für den Krankenwagen mit Schild.

   MASSE (Meter; Mitte des Grundrisses = 0,0,0; Eingang nach Süden, +y)
     Hauptbau      11,0 × 6,4 m (x −5,5…5,5, y −4,5…1,9)
     Risalit       4,0 m breit, 0,6 m vor der Flucht (bis y 2,5)
     Sockel 0,9 · Erdgeschoss bis 4,55 · Gurtgesims bis 4,8 · Traufwand
     bis 8,2 · Kranzgesims bis 8,6 (0,32 m Ausladung)
     Mansarde      unten 72° bis 10,9, oben 25° bis First 12,07
     Zwerchgiebel  Dach First 11,6, Giebel bis 12,4 (+ Kugel)
     Vordach       3,8 × 2,0 m, Wand 4,25 m, vorn 3,95 m
     Schornsteine  bis 13,25 m
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT, PI = ST.pinsel;
  const hex = PI.hex, rgb = PI.rgb, misch = PI.misch, hell = PI.hell, streu = PI.streu;

  /* ---------------- kleine Werkzeuge ---------------- */
  const klemm = (x, a, b) => (x < a ? a : x > b ? b : x);
  const glatt = (x) => { x = klemm(x, 0, 1); return x * x * (3 - 2 * x); };
  const phase = (bau, a, b) => klemm((bau - a) / (b - a), 0, 1);
  const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const kreuz = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const nrm = (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const Z3 = [0, 0, 1];
  const TAU = Math.PI * 2, RAD = Math.PI / 180;
  const zufall = (n) => ST.zufall((n >>> 0) || 1);

  function poly(g, p) { g.beginPath(); g.moveTo(p[0][0], p[0][1]); for (let i = 1; i < p.length; i++) g.lineTo(p[i][0], p[i][1]); g.closePath(); }
  /* Vieleck an einer Bedingung abschneiden (f(p) >= 0 bleibt) */
  function schneide(P, f) {
    const aus = [];
    for (let i = 0; i < P.length; i++) {
      const a = P[i], b = P[(i + 1) % P.length], fa = f(a), fb = f(b);
      if (fa >= 0) aus.push(a);
      if ((fa >= 0) !== (fb >= 0)) { const t = fa / (fa - fb); aus.push(a.map((v, k) => v + (b[k] - v) * t)); }
    }
    return aus;
  }
  /* Rauschen und Bleiche mit versetzbarem Muster (wie in der Mühle) */
  function rausch(g, x, y, w, h, meter, staerke, saat, okt) {
    const s = Math.abs(saat | 0);
    const bild = PI.rauschBild(1 + (s % 5), 128, 4, 3, 1.6);
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
  /* Licht einer Fläche selbst rechnen (für keinLicht-Flächen) */
  function belichter(F, extra, n) {
    const lf = ST.lichtFaktor(n || F.n, F.zeit, extra || 0, F.jahr);
    return (c, a) => rgb([c[0] * lf[0], c[1] * lf[1], c[2] * lf[2]], a);
  }

  /* Licht von Hand auflegen (für Flächen mit eigenem Beschnitt) */
  function lichtAuf(g, F, extra) {
    const lf = ST.lichtFaktor(F.n, F.zeit, extra || 0, F.jahr);
    g.save(); g.globalCompositeOperation = "multiply";
    g.fillStyle = rgb([lf[0] * 255, lf[1] * 255, lf[2] * 255]); g.fillRect(-1, -1, F.w + 2, F.h + 2);
    g.restore();
  }

  /* ---------------- Malen auf einer CPU-Leinwand ----------------
     (wie im Fachwerkerker) Jede Fläche wird in Geräte-Pixeln auf eine
     vom Prozessor gerasterte Leinwand gemalt und als EIN Bild ins Sprite
     gesetzt – hunderte kleine Pinselstriche sind so viel schneller. */
  const CPU = new Map();
  const CPU_MAX = 4, CPU_PX = 2.5e6;
  function cpuLeinwand(w, h) {
    const st = (a) => a <= 512 ? Math.ceil(a / 128) * 128 : Math.ceil(a / 256) * 256;
    const sw = st(w), sh = st(h), k = sw + "x" + sh;
    let c = CPU.get(k);
    if (c) { CPU.delete(k); CPU.set(k, c); return c; }
    const cv = document.createElement("canvas"); cv.width = sw; cv.height = sh;
    c = cv.getContext("2d", { willReadFrequently: true });
    CPU.set(k, c);
    while (CPU.size > CPU_MAX) { const alt = CPU.keys().next().value, ac = CPU.get(alt); ac.canvas.width = ac.canvas.height = 0; CPU.delete(alt); }
    return c;
  }
  function aufCpu(m) {
    return function (g, F) {
      const T = g.getTransform();
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      for (const p of F.flaeche.umriss) {
        const X = T.a * p[0] + T.c * p[1] + T.e, Y = T.b * p[0] + T.d * p[1] + T.f;
        if (X < x0) x0 = X; if (X > x1) x1 = X; if (Y < y0) y0 = Y; if (Y > y1) y1 = Y;
      }
      const W = g.canvas.width, H = g.canvas.height;
      x0 = Math.max(0, Math.floor(x0) - 2); y0 = Math.max(0, Math.floor(y0) - 2);
      x1 = Math.min(W, Math.ceil(x1) + 2); y1 = Math.min(H, Math.ceil(y1) + 2);
      const w = x1 - x0, h = y1 - y0;
      if (w <= 0 || h <= 0) return;
      if (w * h < 2500 || w * h > CPU_PX) { m(g, F); return; }
      const c = cpuLeinwand(w, h);
      c.setTransform(1, 0, 0, 1, 0, 0);
      c.clearRect(0, 0, w + 2, h + 2);
      c.globalAlpha = 1; c.globalCompositeOperation = "source-over";
      c.setTransform(T.a, T.b, T.c, T.d, T.e - x0, T.f - y0);
      c.save(); m(c, F); c.restore();
      g.setTransform(1, 0, 0, 1, 0, 0);
      g.drawImage(c.canvas, 0, 0, w, h, x0, y0, w, h);
      g.setTransform(T);
    };
  }
  function beschleunigen(M) {
    for (const t of M.teile) for (const f of t.flaechen) {
      if (typeof f.malen !== "function") continue;
      /* verdeckte Flächen legen ihr Licht selbst auf (nur im Beschnitt) */
      if (f.malen.selbstLicht) f.keinLicht = true;
      if (!f.direkt && !f.malen.direkt) f.malen = aufCpu(f.malen);
    }
  }

  /* ---------------- Blickrichtung ----------------
     Die Flächen kennen die Drehung nicht; eine unsichtbare Figur ganz vorn
     in der Malreihenfolge merkt sie sich. Gebraucht für die Baugrube (was
     unter der Erde liegt, sieht man nur durch die Öffnung) und für die
     Verdeckung von Gauben, Zwerchhaus und Schornsteinen durch das Dach. */
  function neuerBlick() { return { c: 1, s: 0, e: [0.6124, 0.6124, 0.5], gier: 0 }; }
  function blickSetzen(B, gier) {
    const r = gier * RAD, c = Math.cos(r), s = Math.sin(r);
    B.c = c; B.s = s; B.gier = gier;
    B.e = [0.6124 * (c + s), 0.6124 * (c - s), 0.5];
  }
  /* Punkt p entlang der Blickrichtung auf die Ebene der Fläche legen →
     Flächenkoordinaten und Abstand (t > 0: p liegt vor der Fläche) */
  function aufFlaeche(F, B, p) {
    const f = F.flaeche, n = kreuz(f.u, f.v), en = dot(B.e, n);
    const t = dot(sub(p, f.o), n) / en;
    const X = sub(p, mul(B.e, t)), d = sub(X, f.o);
    return [dot(d, f.u), dot(d, f.v), t];
  }
  /* nur zeigen, was durch die Öffnung (Vieleck in Höhe z) zu sehen ist */
  function lochClip(g, F, B, loch, z) {
    const f = F.flaeche, n = kreuz(f.u, f.v);
    if (Math.abs(dot(B.e, n)) < 1e-3) return false;
    poly(g, loch.map((q) => aufFlaeche(F, B, [q[0], q[1], z || 0])));
    g.clip();
    return true;
  }
  /* Verdeckung: alles abschneiden, was hinter einer (dem Betrachter
     zugewandten) Dachfläche liegt. occ = Liste von 3D-Vielecken */
  function verdecken(g, F, B, occ) {
    const f = F.flaeche, n = kreuz(f.u, f.v);
    if (dot(B.e, n) < 1e-3) return;
    for (const P of occ) {
      const on = P.n || (P.n = neuNormale(P));
      if (dot(on, B.e) < 0.02) continue;
      /* nur der Teil vor der Fläche verdeckt */
      const pp = P.map((p) => { const q = aufFlaeche(F, B, p); return [q[0], q[1], q[2]]; });
      const vorn = schneide(pp, (q) => q[2] - 0.02);
      if (vorn.length < 3) continue;
      /* nur, wenn es die Fläche überhaupt trifft */
      let a0 = Infinity, a1 = -Infinity, b0 = Infinity, b1 = -Infinity;
      for (const q of vorn) { a0 = Math.min(a0, q[0]); a1 = Math.max(a1, q[0]); b0 = Math.min(b0, q[1]); b1 = Math.max(b1, q[1]); }
      if (a1 < 0 || a0 > F.w || b1 < 0 || b0 > F.h) continue;
      g.beginPath(); g.rect(-60, -60, F.w + 120, F.h + 120);
      g.moveTo(vorn[0][0], vorn[0][1]); for (let i = 1; i < vorn.length; i++) g.lineTo(vorn[i][0], vorn[i][1]); g.closePath();
      g.clip("evenodd");
    }
  }
  function neuNormale(P) {
    let n = [0, 0, 0];
    for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length]; n[0] += (a[1] - b[1]) * (a[2] + b[2]); n[1] += (a[2] - b[2]) * (a[0] + b[0]); n[2] += (a[0] - b[0]) * (a[1] + b[1]); }
    return nrm(n);
  }

  /* ---------------- Flächen aus 3D-Vielecken ----------------
     pts gegen den Uhrzeigersinn von außen; opt.n erzwingt die Außenseite.
     u liegt waagerecht (Dach: entlang der Traufe), v zeigt hangabwärts. */
  function poly3(M, pts, malen, opt) {
    opt = opt || {};
    let n = neuNormale(pts);
    if (opt.n && dot(n, opt.n) < 0) n = mul(n, -1);
    const u = opt.u ? nrm(sub(opt.u, mul(n, dot(opt.u, n)))) : (Math.abs(n[2]) > 0.999 ? [1, 0, 0] : nrm(kreuz(n, Z3)));
    const v = kreuz(n, u);
    const p0 = pts[0];
    const ab = pts.map((p) => { const d = sub(p, p0); return [dot(d, u), dot(d, v)]; });
    let a0 = Infinity, b0 = Infinity, a1 = -Infinity, b1 = -Infinity;
    for (const q of ab) { a0 = Math.min(a0, q[0]); b0 = Math.min(b0, q[1]); a1 = Math.max(a1, q[0]); b1 = Math.max(b1, q[1]); }
    const o = add(p0, add(mul(u, a0), mul(v, b0)));
    const f = { o: o, u: u, v: v, w: a1 - a0, h: b1 - b0, umriss: ab.map((q) => [q[0] - a0, q[1] - b0]), malen: malen };
    for (const k in opt) if (k !== "n" && k !== "u") f[k] = opt[k];
    f.pts3 = pts;
    return M.flaeche(f);
  }
  /* senkrechte Wand von p0 nach p1 (von außen links → rechts) */
  function wand(M, p0, p1, z0, z1, malen, extra) {
    const dx = p1[0] - p0[0], dy = p1[1] - p0[1], L = Math.hypot(dx, dy);
    return M.flaeche(Object.assign({ o: [p0[0], p0[1], z1], u: [dx / L, dy / L, 0], v: [0, 0, -1], w: L, h: z1 - z0, malen: malen }, extra || {}));
  }
  /* Vieleck (Grundriss, gegen den Uhrzeigersinn im Sinn von wand())
     um d nach außen versetzen – für rechtwinklige Grundrisse */
  function versatz(P, d) {
    const n = P.length, aus = [];
    const nor = (a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [-dy / l, dx / l]; };
    for (let i = 0; i < n; i++) {
      const a = P[(i + n - 1) % n], c = P[i], b = P[(i + 1) % n];
      const n1 = nor(a, c), n2 = nor(c, b);
      const k = 1 + n1[0] * n2[0] + n1[1] * n2[1];
      aus.push([c[0] + d * (n1[0] + n2[0]) / k, c[1] + d * (n1[1] + n2[1]) / k]);
    }
    return aus;
  }

  /* =====================================================================
     MASSE
     ===================================================================== */
  const BX0 = -5.5, BX1 = 5.5, BY0 = -4.5, BY1 = 1.9;
  const RX0 = -2.0, RX1 = 2.0, RY1 = 2.5;
  const SOCKEL = 0.9, GURT0 = 4.55, GURT1 = 4.8, ZW = 8.2, ZG = 8.6, GES = 0.32;
  const DICKE = 0.45;                       // Außenmauer
  const TIEFE = 2.4;                        // Keller
  const PLAN = [[BX0, BY1], [RX0, BY1], [RX0, RY1], [RX1, RY1], [RX1, BY1], [BX1, BY1], [BX1, BY0], [BX0, BY0]];
  const INNEN = versatz(PLAN, -DICKE);
  const GESIMS = versatz(PLAN, GES);
  /* Mansarde */
  const MB = 0.05, MK = 0.75, ZK = 10.9, NEIG_O = 25 * RAD;
  const MX0 = BX0 - MB, MX1 = BX1 + MB, MY0 = BY0 - MB, MY1 = BY1 + MB;
  const KX0 = MX0 + MK, KX1 = MX1 - MK, KY0 = MY0 + MK, KY1 = MY1 - MK;
  const YM = (MY0 + MY1) / 2, HT = (KY1 - KY0) / 2;
  const ZF = ZK + HT * Math.tan(NEIG_O);
  const FX = (KX1 - KX0) / 2 - HT;          // halbe Firstlänge
  const SL_U = MK / (ZK - ZG);              // waagerecht je Meter Höhe (unten)
  const SL_O = HT / (ZF - ZK);              // (oben)
  /* Zwerchhaus */
  const ZR = 11.6, ZE = 2.05, ZSL = (ZR - 8.525) / ZE, ZY = RY1 - 0.3;
  const GIEBEL_TOP = 12.4;
  /* Vordach */
  const VX = 1.9, VY0 = RY1, VY1 = 4.5, VZW = 4.25, VZV = 3.95, VBL = 0.35;
  const SAEULEN = [[-1.72, 4.34], [1.72, 4.34]];
  /* Treppe vor dem Portal */
  const TR_B = 1.15, TR_N = 4, TR_H = 0.19, TR_T = 0.28;
  const PORTAL_Z = TR_N * TR_H;

  /* Höhe der Mansarde über einem Punkt (für Gauben und Kamine) */
  function mansardHoehe(x, y) {
    /* Abstand nach innen von der Grundlinie, je Seite */
    const d = Math.min(x - MX0, MX1 - x, y - MY0, MY1 - y);
    if (d <= MK) return ZG + d / SL_U;
    /* oben: Abstand zum Knick-Rechteck */
    const dk = Math.min(x - KX0, KX1 - x, y - KY0, KY1 - y);
    return ZK + dk / SL_O;
  }
  /* Lage der Mansardenfläche (Abstand nach innen) in Höhe z */
  const ddUnten = (z) => (z - ZG) * SL_U;

  /* =====================================================================
     FARBEN
     ===================================================================== */
  const PUTZE = [[233, 223, 199], [236, 226, 204], [226, 222, 208], [238, 229, 208]];
  const SANDSTEINE = [[176, 108, 86], [168, 102, 82], [186, 150, 112]];
  const SCHIEFER = [74, 80, 94];
  const ZINK = [150, 156, 160];
  const EISEN = [38, 52, 46];               // Gusseisen, tannengrün gestrichen
  const ZIEGEL_ROH = [178, 96, 64];
  const HOLZ_ROH = [182, 142, 98];
  const BETON = [168, 166, 158];

  /* =====================================================================
     WERKSTOFFE
     ===================================================================== */
  /* Ziegel als Muster (Kreuzverband 25 × 12 × 6,5 cm, Schicht 7,7 cm):
     einmal je Farbe gebacken, dann als Füllmuster in Metern */
  const ZMUSTER = {};
  function ziegelMuster(farbe, fuge, saat) {
    const k = farbe.join(",") + "|" + fuge.join(",") + "|" + saat;
    if (ZMUSTER[k]) return ZMUSTER[k];
    const R = 120, B = 2.08, H = 0.616;
    const c = document.createElement("canvas"); c.width = Math.round(B * R); c.height = Math.round(H * R);
    const g = c.getContext("2d", { willReadFrequently: true }), rng = zufall(saat);
    g.scale(R, R);
    g.fillStyle = rgb(fuge); g.fillRect(0, 0, B, H);
    const sh = 0.077, fz = 0.011;
    for (let r = 0; r < 8; r++) {
      const y = r * sh;
      const laeufer = r % 2 === 0;
      const lw = laeufer ? 0.26 : 0.13;
      const vers = laeufer ? (r % 4 === 0 ? 0 : 0.13) : 0.065;
      for (let x = -vers; x < B; x += lw) {
        let cc = streu(farbe, rng, 0.1);
        if (rng() < 0.08) cc = hell(cc, -0.22);
        if (rng() < 0.06) cc = misch(cc, [200, 150, 110], 0.3);
        const bx = x + fz / 2, bw = lw - fz;
        const gr = g.createLinearGradient(0, y, 0, y + sh);
        gr.addColorStop(0, rgb(hell(cc, 0.08))); gr.addColorStop(0.3, rgb(cc)); gr.addColorStop(1, rgb(hell(cc, -0.12)));
        g.fillStyle = gr;
        const zeichne = (xx) => { g.fillRect(xx, y + fz / 2, bw, sh - fz); };
        zeichne(bx); if (bx + bw > B) zeichne(bx - B); if (bx < 0) zeichne(bx + B);
      }
    }
    ZMUSTER[k] = { bild: c, R: R };
    return ZMUSTER[k];
  }
  function ziegel(g, x, y, w, h, F, opt) {
    opt = opt || {};
    const farbe = opt.farbe || ZIEGEL_ROH, fuge = opt.fuge || [196, 188, 172];
    if (F.px < 9) {
      g.fillStyle = rgb(misch(farbe, fuge, 0.2)); g.fillRect(x, y, w, h);
      rausch(g, x, y, w, h, 2.4, 0.25, opt.saat || 3, 3);
      return;
    }
    const zm = ziegelMuster(farbe, fuge, opt.saat || 5);
    const m = g.createPattern(zm.bild, "repeat");
    m.setTransform(new DOMMatrix([1 / zm.R, 0, 0, 1 / zm.R, opt.ox || 0, opt.oy || 0]));
    g.fillStyle = m; g.fillRect(x, y, w, h);
    rausch(g, x, y, w, h, 3.1, 0.2, (opt.saat || 5) + 3, 3);
  }
  /* glatter Sandstein (Gewände, Gesimse) */
  function sandstein(g, x, y, w, h, F, farbe, opt) {
    opt = opt || {};
    g.fillStyle = rgb(farbe); g.fillRect(x, y, w, h);
    if (F.px > 6) rausch(g, x, y, w, h, 0.7, 0.2, (opt.saat || 11), 3);
    rausch(g, x, y, w, h, 2.6, 0.12, (opt.saat || 11) + 5, 3);
    if (opt.fugen && F.px > 14) {
      g.fillStyle = rgb(hell(farbe, -0.35), 0.7);
      const st = opt.fugen;
      for (let xx = x + st * (0.6 + 0.3 * F.rng()); xx < x + w - 0.1; xx += st * (0.8 + 0.4 * F.rng())) g.fillRect(xx, y, Math.max(0.008, 0.8 / F.px), h);
    }
  }
  /* gebosster Sockel: Quader mit Randschlag, tiefe Fugen, raue Spiegel */
  function bossen(g, x, y, w, h, F, farbe, saat) {
    const rng = zufall(saat || 9);
    g.fillStyle = rgb(hell(farbe, -0.45)); g.fillRect(x, y, w, h);
    const lh = h / 3, fz = 0.025;
    const fein = F.px > 16;
    for (let r = 0; r < 3; r++) {
      const yy = y + r * lh;
      let xx = x - (r % 2 ? 0.3 : 0.05) - rng() * 0.2;
      while (xx < x + w) {
        const lw = 0.55 + rng() * 0.5;
        const c = streu(farbe, rng, 0.1);
        const bx = xx + fz / 2, bw = lw - fz, by = yy + fz / 2, bh = lh - fz;
        g.fillStyle = rgb(c); g.fillRect(bx, by, bw, bh);
        if (fein) {
          /* Randschlag hell oben/links, dunkel unten/rechts */
          const rs = 0.035;
          g.fillStyle = rgb(hell(c, 0.16)); g.fillRect(bx, by, bw, rs); g.fillRect(bx, by, rs * 0.7, bh);
          g.fillStyle = rgb(hell(c, -0.2)); g.fillRect(bx, by + bh - rs, bw, rs); g.fillRect(bx + bw - rs * 0.7, by, rs * 0.7, bh);
          /* rauer Spiegel */
          if (F.px > 30) rausch(g, bx + rs, by + rs, bw - 2 * rs, bh - 2 * rs, 0.35, 0.3, (rng() * 97) | 0, 3);
        }
        xx += lw;
      }
    }
    rausch(g, x, y, w, h, 2.2, 0.18, (saat || 9) + 2, 3);
  }
  /* Kalkputz mit feinem Korn, Flecken und Verschmutzung */
  function putz(g, x, y, w, h, F, farbe, saat) {
    g.fillStyle = rgb(farbe); g.fillRect(x, y, w, h);
    rausch(g, x, y, w, h, 3.4, 0.14, saat || 3, 4);
    if (F.px > 24) rausch(g, x, y, w, h, 0.4, 0.08, (saat || 3) + 7, 3);
    bleich(g, x, y, w, h, 2.3, 0.1, saat || 3);
  }
  /* Schiefer in Schuppendeckung (Jugendstil). Dachfläche: x entlang der
     Traufe, y vom First (0) zur Traufe (F.h). Reihen von unten nach oben
     gelegt – jede obere Reihe überdeckt die untere. */
  /* Schiefer als Muster: 10 Steine breit, 6 Reihen hoch, periodisch –
     Reihe für Reihe von unten nach oben gelegt (die obere deckt die untere) */
  const SMUSTER = {};
  function schieferMuster(basis, rh, tb, saat) {
    const key = basis.join(",") + "|" + rh + "|" + tb + "|" + saat;
    if (SMUSTER[key]) return SMUSTER[key];
    const R = 110, B = tb * 10, H = rh * 6;
    const c = document.createElement("canvas"); c.width = Math.round(B * R); c.height = Math.round(H * R);
    const g = c.getContext("2d", { willReadFrequently: true });
    g.setTransform(c.width / B, 0, 0, c.height / H, 0, 0);
    g.fillStyle = rgb(hell(basis, -0.42)); g.fillRect(0, 0, B, H);
    for (let k = -2; k <= 8; k++) {
      const km = ((k % 6) + 6) % 6, rng = zufall(saat * 31 + km * 7 + 1);
      const yy = H - k * rh, vers = (km % 2) * tb / 2;
      for (let j = -1; j <= 10; j++) {
        const jm = ((j % 10) + 10) % 10;
        let cc = streu(basis, zufall(saat * 97 + km * 13 + jm * 3 + 5), 0.09);
        const r2 = zufall(saat * 11 + km * 29 + jm * 17 + 2);
        if (r2() < 0.12) cc = misch(cc, [96, 86, 104], 0.4);
        if (r2() < 0.06) cc = hell(cc, 0.12);
        const xx = j * tb + vers, b = tb * 0.96, top = yy - rh * 1.6, bot = yy;
        g.fillStyle = "rgba(10,12,20,0.4)";
        g.beginPath(); g.moveTo(xx, top); g.lineTo(xx, bot - b * 0.35 + rh * 0.12); g.quadraticCurveTo(xx + b / 2, bot + b * 0.2 + rh * 0.12, xx + b, bot - b * 0.35 + rh * 0.12); g.lineTo(xx + b, top); g.closePath(); g.fill();
        const gr = g.createLinearGradient(0, top + rh, 0, bot);
        gr.addColorStop(0, rgb(hell(cc, -0.1))); gr.addColorStop(0.8, rgb(cc)); gr.addColorStop(1, rgb(hell(cc, 0.1)));
        g.fillStyle = gr;
        g.beginPath(); g.moveTo(xx, top); g.lineTo(xx, bot - b * 0.35); g.quadraticCurveTo(xx + b / 2, bot + b * 0.2, xx + b, bot - b * 0.35); g.lineTo(xx + b, top); g.closePath(); g.fill();
        g.strokeStyle = rgb(hell(cc, 0.25), 0.35); g.lineWidth = 0.7 / R;
        g.beginPath(); g.moveTo(xx + b * 0.04, bot - b * 0.36); g.quadraticCurveTo(xx + b / 2, bot + b * 0.15, xx + b * 0.96, bot - b * 0.36); g.stroke();
        void rng;
      }
    }
    SMUSTER[key] = { bild: c, B: B, H: H };
    return SMUSTER[key];
  }
  /* Schiefer in Schuppendeckung (Jugendstil). Dachfläche: x entlang der
     Traufe, y vom First (0) zur Traufe (F.h); die Reihen sitzen auf der Traufe */
  function schiefer(g, x0, y0, w, h, F, opt) {
    opt = opt || {};
    const basis = opt.farbe || SCHIEFER;
    const rh = opt.reihe || 0.16, tb = opt.breite || 0.22;
    if (F.px * rh < 2.4) {
      const rng = zufall(opt.saat || 17);
      g.fillStyle = rgb(hell(basis, -0.42)); g.fillRect(x0, y0, w, h);
      for (let yy = y0 + h; yy > y0 - rh; yy -= rh) { g.fillStyle = rgb(streu(basis, rng, 0.05)); g.fillRect(x0, yy - rh, w, rh * 0.78); }
      rausch(g, x0, y0, w, h, 3, 0.2, 5, 3);
      return;
    }
    const sm = schieferMuster(basis, rh, tb, 3);
    const m = g.createPattern(sm.bild, "repeat");
    const unten = y0 + h - rh * 0.25;
    const k = sm.H / sm.bild.height;
    m.setTransform(new DOMMatrix([sm.B / sm.bild.width, 0, 0, k, (opt.ox || 0) % sm.B, unten - Math.ceil(unten / sm.H) * sm.H]));
    g.fillStyle = m; g.fillRect(x0, y0, w, h);
    rausch(g, x0, y0, w, h, 4, 0.16, (opt.saat || 17) + 4, 4);
    bleich(g, x0, y0, w, h, 2.8, 0.06, 5);
  }
  /* Zinkblech mit Stehfalzen */
  function zinkblech(g, x, y, w, h, F, opt) {
    opt = opt || {};
    const c = opt.farbe || ZINK;
    g.fillStyle = rgb(c); g.fillRect(x, y, w, h);
    if (F.px > 8) {
      const ab = opt.falz || 0.5;
      for (let xx = x + ab; xx < x + w; xx += ab) {
        g.fillStyle = rgb(hell(c, 0.2)); g.fillRect(xx - 0.012, y, 0.012, h);
        g.fillStyle = rgb(hell(c, -0.25)); g.fillRect(xx, y, 0.012, h);
      }
    }
    rausch(g, x, y, w, h, 1.6, 0.14, opt.saat || 23, 3);
  }
  /* Schnee auf steilen Flächen: nur Reste auf den Schieferkanten */
  function schneeSteil(g, F, deck, saat, reihe) {
    if (deck <= 0) return;
    const rng = zufall(saat || 3), rh = reihe || 0.16;
    g.save();
    g.fillStyle = "rgba(244,247,252," + (0.85 * deck) + ")";
    g.beginPath();
    for (let yy = F.h - rh * 0.25; yy > 0; yy -= rh) {
      let x = -rng() * 0.4;
      while (x < F.w) {
        const l = 0.15 + rng() * 0.9 * deck;
        if (rng() < 0.55 + 0.35 * deck) {
          const d = 0.015 + rng() * 0.03 * deck;
          g.moveTo(x, yy); g.quadraticCurveTo(x + l / 2, yy - d * 2.2, x + l, yy); g.quadraticCurveTo(x + l / 2, yy + d * 0.5, x, yy);
        }
        x += l + rng() * 0.35;
      }
    }
    g.fill();
    /* Wehen in den Ecken und unten */
    for (let i = 0; i < F.w * 0.8; i++) {
      const cx = rng() * F.w, cy = F.h * (0.55 + rng() * 0.45), rx = 0.3 + rng() * 0.6, ry = 0.08 + rng() * 0.12;
      const gg = g.createRadialGradient(cx, cy, 0, cx, cy, rx);
      gg.addColorStop(0, "rgba(246,249,253," + (0.55 * deck) + ")"); gg.addColorStop(1, "rgba(246,249,253,0)");
      g.fillStyle = gg; g.save(); g.translate(cx, cy); g.scale(1, ry / rx); g.beginPath(); g.arc(0, 0, rx, 0, TAU); g.fill(); g.restore();
    }
    g.restore();
  }
  /* Schneekante (Wulst) entlang einer waagerechten Oberkante */
  function schneeKante(g, x0, x1, y, dick, F, saat) {
    const rng = zufall(saat || 7);
    g.fillStyle = "rgb(246,249,253)";
    g.beginPath(); g.moveTo(x0, y + 0.01);
    for (let x = x0; x <= x1 + 0.08; x += 0.08) g.lineTo(Math.min(x, x1), y - dick * (0.75 + rng() * 0.45));
    g.lineTo(x1, y + dick * 0.25);
    for (let x = x1; x >= x0 - 0.1; x -= 0.12) g.lineTo(Math.max(x, x0), y + dick * (0.15 + rng() * 0.3));
    g.closePath(); g.fill();
    g.fillStyle = "rgba(160,180,215,0.35)"; g.fillRect(x0, y + dick * 0.12, x1 - x0, Math.max(0.01, dick * 0.12));
  }
  /* Laub (Herbst) auf Simsen und Glas */
  function laub(g, x, y, w, h, n, saat) {
    const rng = zufall(saat || 13);
    const farben = [[176, 92, 32], [196, 138, 40], [140, 60, 30], [120, 96, 40], [206, 160, 60]];
    for (let i = 0; i < n; i++) {
      const c = farben[(rng() * farben.length) | 0];
      g.fillStyle = rgb(streu(c, rng, 0.15), 0.95);
      g.beginPath(); g.ellipse(x + rng() * w, y + rng() * h, 0.03 + rng() * 0.03, 0.018 + rng() * 0.015, rng() * 3, 0, TAU); g.fill();
    }
  }

  /* =====================================================================
     BAUZUSTAND
     XANDER: „Man soll das Fundament sehen beim Aufbauen … Schritt für
     Schritt, wie das nach 2 Minuten aussieht, nach 5 … 10 … 15 Minuten."
       0,00–0,07  Baugrube für den Keller (2,4 m), Aushubhaufen
       0,07–0,11  Streifenfundamente (Stampfbeton), Kellersohle
       0,11–0,20  Kellermauern Schicht für Schicht
       0,20–0,25  Arbeitsraum verfüllen, Haufen abgefahren
       0,24–0,30  Sockel aus gebossten Sandsteinquadern, dann Kellerdecke
       0,30–0,47  Erdgeschoss in Ziegeln, Gewände und Sohlbänke aus
                  Sandstein werden mit vermauert; 0,47 Gurtgesims
       0,49–0,51  Decke über dem Erdgeschoss
       0,51–0,66  Obergeschoss, 0,66–0,69 Kranzgesims, 0,68–0,74 Giebel
       0,70       Dachboden, 0,72–0,78 Dachstuhl der Mansarde
       0,77–0,86  Richtkrone auf dem First
       0,79–0,88  Schieferdeckung von der Traufe zum First, Gauben,
                  Zwerchdach, Schornsteine
       0,86–0,93  Putz von oben nach unten (vom Gerüst aus)
       0,90–0,96  Fenster, Portal, Vordach auf den Säulen, Schild
       0,95–1,00  Vorplatz, Stellplatz, Laterne; Schnee wächst 0,9–0,98
     ===================================================================== */
  function zustand(bau) {
    const k = (a, b) => phase(bau, a, b);
    const Z = { bau: bau, fertig: bau >= 0.999 };
    Z.grubeT = bau < 0.25 ? TIEFE * glatt(k(0, 0.07)) * (1 - glatt(k(0.2, 0.25))) : 0;
    Z.aushub = bau < 0.2 ? glatt(k(0, 0.07)) : 1 - glatt(k(0.2, 0.26));
    Z.fundament = k(0.07, 0.11);
    Z.kellerZ = bau < 0.11 ? null : -TIEFE + 0.3 + (TIEFE - 0.3) * k(0.11, 0.2);
    let m = 0;
    if (bau >= 0.24) m = SOCKEL * k(0.24, 0.3);
    if (bau >= 0.3) m = SOCKEL + (GURT0 - SOCKEL) * k(0.3, 0.47);
    if (bau >= 0.47) m = GURT0 + (GURT1 - GURT0) * k(0.47, 0.49);
    if (bau >= 0.51) m = GURT1 + (ZW - GURT1) * k(0.51, 0.66);
    if (bau >= 0.66) m = ZW;
    Z.mauerZ = m;
    Z.gesims = bau >= 0.66 ? k(0.66, 0.69) : 0;
    Z.giebelZ = bau < 0.68 ? 0 : ZG + (GIEBEL_TOP - ZG) * k(0.68, 0.74);
    Z.decke = bau < 0.3 ? null : bau < 0.51 ? (bau >= 0.49 ? GURT1 : SOCKEL) : (bau >= 0.7 ? null : GURT1);
    Z.dachboden = bau >= 0.7 && bau < 0.9;
    Z.stuhl = bau < 0.72 ? 0 : k(0.72, 0.78);
    Z.richt = bau >= 0.77 && bau < 0.86;
    Z.deckU = k(0.79, 0.85); Z.deckO = k(0.84, 0.88); Z.deckZ = k(0.8, 0.86);
    Z.dachFertig = bau >= 0.88;
    Z.gauben = bau < 0.83 ? 0 : bau < 0.87 ? 1 : 2;
    Z.kamin = k(0.78, 0.86);
    Z.putzZ = bau < 0.86 ? 99 : 0.9 + (GIEBEL_TOP - 0.9) * (1 - k(0.86, 0.93));
    Z.fensterOG = bau >= 0.9; Z.fensterEG = bau >= 0.92; Z.tuer = bau >= 0.93;
    Z.saeulen = bau >= 0.91; Z.vordach = bau >= 0.94; Z.schild = bau >= 0.96;
    Z.hof = bau >= 0.95; Z.ausstattung = bau >= 0.97;
    Z.schnee = Z.fertig ? 1 : k(0.9, 0.98);
    Z.licht = Z.fertig;
    return Z;
  }

  /* =====================================================================
     FASSADE
     Jede Wand malt in „Weltkoordinaten": Y(z) = Oberkante − z. Wächst die
     Mauer noch, ist die Fläche niedriger – gemalt wird trotzdem wie am
     fertigen Haus, der Umriss schneidet ab.
     Elemente: { art: "eg"|"og"|"portal"|"drei"|"keller", a (Mitte), w, h, zs }
     ===================================================================== */
  const FENSTER_W = 1.05, EG_ZS = 1.55, EG_H = 2.1, OG_ZS = 5.4, OG_H = 1.85;

  function wandMaler(S, Z, W) {
    return function (g, F) {
      const zTop = F.flaeche.zTop == null ? W.z1 : F.flaeche.zTop;
      g.save();
      g.translate(0, zTop - W.z1);
      fassadeMalen(g, F, S, Z, W);
      g.restore();
    };
  }
  function fassadeMalen(g, F, S, Z, W) {
    const Y = (z) => W.z1 - z, L = W.L;
    const ss = S.sandstein, px = F.px;
    /* Grund: Putz über putzZ, darunter roher Ziegel */
    const pa = Math.max(SOCKEL, Z.putzZ);
    if (pa < W.z1) putz(g, -0.1, -0.1, L + 0.2, Y(pa) + 0.1, F, S.putz, W.saat);
    if (pa > SOCKEL) { const zo = Math.min(pa, W.z1); ziegel(g, -0.1, Y(zo), L + 0.2, zo - SOCKEL, F, { saat: W.saat, ox: W.ox || 0 }); }
    /* Sockel */
    if (W.z0 < SOCKEL) {
      bossen(g, -0.1, Y(SOCKEL), L + 0.2, SOCKEL + 0.1, F, ss, W.saat + 1);
      /* Sockelgesims: Schräge mit Wasserschlag */
      sandstein(g, -0.1, Y(SOCKEL + 0.12), L + 0.2, 0.12, F, hell(ss, 0.06), { saat: W.saat + 4 });
      g.fillStyle = rgb(hell(ss, 0.25)); g.fillRect(-0.1, Y(SOCKEL + 0.12), L + 0.2, 0.025);
      g.fillStyle = "rgba(40,20,20,0.35)"; g.fillRect(-0.1, Y(SOCKEL), L + 0.2, 0.03);
    }
    /* Eckquader */
    if (W.ecken) for (const seite of W.ecken) eckquader(g, F, S, seite === "l" ? 0 : L, seite === "l" ? 1 : -1, Y);
    /* Gurtgesims */
    if (W.z1 > GURT0) band(g, F, ss, -0.1, L + 0.2, Y(GURT1), GURT1 - GURT0, 0.12, W.saat + 6);
    /* Konsolfries unter dem Kranzgesims */
    if (W.fries && W.z1 >= ZW - 0.01) fries(g, F, S, Z, L, Y);
    /* Öffnungen */
    for (const e of W.elemente || []) {
      if (e.art === "eg") fensterEG(g, F, S, Z, e, Y);
      else if (e.art === "og") fensterOG(g, F, S, Z, e, Y);
      else if (e.art === "keller") kellerFenster(g, F, S, Z, e, Y);
      else if (e.art === "portal") portal(g, F, S, Z, e, Y);
      else if (e.art === "drei") dreiFenster(g, F, S, Z, e, Y);
    }
    /* Winter: Schnee auf dem Sockelgesims und dem Gurtgesims */
    if (S.winter && Z.schnee > 0 && Z.mauerZ >= ZW) {
      schneeKante(g, -0.1, L + 0.1, Y(SOCKEL + 0.12), 0.05 * Z.schnee, F, W.saat + 31);
      schneeKante(g, -0.1, L + 0.1, Y(GURT1), 0.045 * Z.schnee, F, W.saat + 32);
    }
    if (S.herbst && Z.fertig) laub(g, 0, Y(SOCKEL + 0.14), L, 0.05, L * 3, W.saat);
  }
  /* waagerechtes Sandsteinband mit Profil und Schlagschatten */
  function band(g, F, farbe, x0, x1, y, h, tiefe, saat) {
    const sv = F.schatten ? F.schatten(tiefe) : null;
    if (sv) { g.fillStyle = "rgba(40,24,30,0.32)"; g.beginPath(); g.rect(x0 + sv[0], y + h, x1 - x0, Math.max(0.02, sv[1])); g.fill(); }
    else { const gr = g.createLinearGradient(0, y + h, 0, y + h + 0.12); gr.addColorStop(0, "rgba(40,24,30,0.28)"); gr.addColorStop(1, "rgba(40,24,30,0)"); g.fillStyle = gr; g.fillRect(x0, y + h, x1 - x0, 0.12); }
    sandstein(g, x0, y, x1 - x0, h, F, farbe, { saat: saat, fugen: 0.9 });
    g.fillStyle = rgb(hell(farbe, 0.22)); g.fillRect(x0, y, x1 - x0, h * 0.18);
    g.fillStyle = rgb(hell(farbe, -0.12)); g.fillRect(x0, y + h * 0.42, x1 - x0, h * 0.1);
    g.fillStyle = rgb(hell(farbe, -0.3)); g.fillRect(x0, y + h - h * 0.12, x1 - x0, h * 0.12);
  }
  function eckquader(g, F, S, x, r, Y) {
    const ss = S.sandstein, rng = zufall(17 + (x > 0 ? 3 : 0));
    const sv = F.schatten ? F.schatten(0.03) : null;
    let z = SOCKEL + 0.12, i = 0;
    while (z < ZW - 0.05) {
      const hq = Math.min(0.36, ZW - z);
      if (z + hq > GURT0 && z < GURT1) { z = GURT1; continue; }
      const b = i % 2 ? 0.34 : 0.56;
      const x0 = r > 0 ? x - 0.05 : x - b + 0.05;
      if (sv) { g.fillStyle = "rgba(40,24,30,0.28)"; g.fillRect(x0 + sv[0], Y(z + hq) + sv[1], b, hq - 0.02); }
      const c = streu(ss, rng, 0.07);
      sandstein(g, x0, Y(z + hq) + 0.01, b, hq - 0.02, F, c, { saat: 40 + i });
      g.fillStyle = rgb(hell(c, 0.18)); g.fillRect(x0, Y(z + hq) + 0.01, b, 0.022);
      g.fillStyle = rgb(hell(c, -0.25)); g.fillRect(x0, Y(z) - 0.03, b, 0.02);
      z += hq; i++;
    }
  }
  function fries(g, F, S, Z, L, Y) {
    const ss = S.sandstein;
    /* Fries: ein schmales Putzband mit Zahnschnitt darüber, Konsolen */
    const z0 = ZW - 0.42;
    g.fillStyle = "rgba(90,70,60,0.1)"; g.fillRect(-0.1, Y(ZW), L + 0.2, 0.42);
    if (F.px > 10) {
      /* Zahnschnitt */
      const zy = Y(ZW), zh = 0.09;
      g.fillStyle = rgb(hell(ss, -0.35)); g.fillRect(-0.1, zy, L + 0.2, zh);
      g.fillStyle = rgb(ss);
      for (let x = 0.02; x < L; x += 0.14) g.fillRect(x, zy, 0.08, zh - 0.015);
    }
    const n = Math.max(2, Math.round(L / 0.62));
    const ab = L / n;
    const sv = F.schatten ? F.schatten(0.2) : null;
    for (let i = 0; i < n; i++) {
      const cx = ab * (i + 0.5), cw = 0.12, ch = 0.33, top = Y(ZW) + 0.09;
      if (sv) {
        g.fillStyle = "rgba(40,24,30,0.3)";
        g.beginPath(); g.moveTo(cx - cw / 2 + sv[0] * 0.3, top + sv[1] * 0.3); g.lineTo(cx + cw / 2 + sv[0], top + sv[1]); g.lineTo(cx + cw / 2 + sv[0], top + ch + sv[1] * 0.4); g.lineTo(cx - cw / 2 + sv[0] * 0.3, top + ch * 0.6); g.closePath(); g.fill();
      }
      const gr = g.createLinearGradient(cx - cw / 2, 0, cx + cw / 2, 0);
      gr.addColorStop(0, rgb(hell(ss, 0.15))); gr.addColorStop(0.5, rgb(ss)); gr.addColorStop(1, rgb(hell(ss, -0.28)));
      g.fillStyle = gr;
      g.beginPath();
      g.moveTo(cx - cw / 2, top); g.lineTo(cx + cw / 2, top);
      g.lineTo(cx + cw / 2, top + ch * 0.35);
      g.quadraticCurveTo(cx + cw * 0.15, top + ch * 0.7, cx + cw * 0.05, top + ch);
      g.lineTo(cx - cw * 0.05, top + ch);
      g.quadraticCurveTo(cx - cw * 0.15, top + ch * 0.7, cx - cw / 2, top + ch * 0.35);
      g.closePath(); g.fill();
      if (F.px > 30) { g.fillStyle = rgb(hell(ss, -0.4)); g.beginPath(); g.arc(cx, top + ch * 0.45, cw * 0.18, 0, TAU); g.fill(); }
    }
    void z0; void Z;
  }
  /* Fensteröffnung: Glas (fertig) oder dunkle Höhle (Rohbau) */
  function oeffnung(g, F, S, Z, x, y, w, h, fertig, opt) {
    if (fertig) {
      PI.fenster(g, x, y, w, h, F, Object.assign({ rahmen: "#f3f0e8", laibung: rgb(hell(S.sandstein, 0.35)), sprossen: [1, 2], fluegel: 2, bank: false, vorhangFarbe: "#f5f2ea", tiefe: 0.16 }, opt || {}));
    } else {
      const gr = g.createLinearGradient(0, y, 0, y + h);
      gr.addColorStop(0, "rgb(34,28,26)"); gr.addColorStop(1, "rgb(58,48,42)");
      g.fillStyle = gr; g.fillRect(x, y, w, h);
      /* Laibung aus Ziegel ahnen */
      const sv = F.schatten ? F.schatten(0.4) : null;
      g.fillStyle = "rgba(150,80,56,0.55)";
      if (sv && sv[0] > 0) g.fillRect(x + w - 0.1, y, 0.1, h); else g.fillRect(x, y, 0.1, h);
    }
  }
  function sohlbank(g, F, S, x, y, w, konsolen) {
    const ss = S.sandstein;
    const bw = w + 0.36, bx = x - 0.18, bh = 0.1;
    const sv = F.schatten ? F.schatten(0.1) : null;
    if (sv) { g.fillStyle = "rgba(40,24,30,0.33)"; g.fillRect(bx + sv[0], y + bh, bw, Math.max(0.03, sv[1])); }
    if (konsolen) for (const kx of [bx + 0.1, bx + bw - 0.22]) {
      g.fillStyle = rgb(hell(ss, -0.12)); g.beginPath(); g.moveTo(kx, y + bh); g.lineTo(kx + 0.12, y + bh); g.lineTo(kx + 0.1, y + bh + 0.18); g.quadraticCurveTo(kx + 0.06, y + bh + 0.22, kx + 0.02, y + bh + 0.18); g.closePath(); g.fill();
      if (sv) { g.fillStyle = "rgba(40,24,30,0.25)"; g.fillRect(kx + 0.12 + sv[0] * 0.4, y + bh + 0.02, Math.abs(sv[0]) * 0.4, 0.16); }
    }
    sandstein(g, bx, y, bw, bh, F, ss, { saat: 71 });
    g.fillStyle = rgb(hell(ss, 0.26)); g.fillRect(bx, y, bw, 0.025);
    g.fillStyle = rgb(hell(ss, -0.3)); g.fillRect(bx, y + bh - 0.015, bw, 0.015);
    PI.schliere(g, x + 0.1, y + bh + (konsolen ? 0.2 : 0), w - 0.2, 0.45 + F.rng() * 0.4, F);
  }
  function gewaende(g, F, S, x, y, w, h, b, opt) {
    opt = opt || {};
    const ss = S.sandstein;
    const sv = F.schatten ? F.schatten(0.04) : null;
    const top = y - (opt.oben || b);
    if (sv) { g.fillStyle = "rgba(40,24,30,0.25)"; g.fillRect(x - b + sv[0], top + sv[1], w + 2 * b, h + (y - top)); }
    sandstein(g, x - b, top, w + 2 * b, h + (y - top), F, ss, { saat: 60 + ((x * 10) | 0) });
    /* Fase an der Öffnung */
    g.fillStyle = rgb(hell(ss, -0.22)); g.fillRect(x - 0.03, y - 0.03, w + 0.06, 0.03); g.fillRect(x - 0.03, y, 0.03, h); g.fillRect(x + w, y, 0.03, h);
    g.fillStyle = rgb(hell(ss, 0.18)); g.fillRect(x - b, top, w + 2 * b, 0.02);
  }
  function fensterEG(g, F, S, Z, e, Y) {
    const x = e.a - e.w / 2, y = Y(e.zs + e.h), w = e.w, h = e.h, ss = S.sandstein;
    /* Gewände mit Segmentbogen-Sturz und Schlussstein */
    gewaende(g, F, S, x, y, w, h, 0.14, { oben: 0.3 });
    if (F.px > 8) {
      g.strokeStyle = rgb(hell(ss, -0.35), 0.8); g.lineWidth = Math.max(0.01, 0.9 / F.px);
      g.beginPath(); g.moveTo(x - 0.14, y - 0.06); g.quadraticCurveTo(x + w / 2, y - 0.34, x + w + 0.14, y - 0.06); g.stroke();
      /* Keilsteinfugen */
      for (let i = 1; i < 6; i++) { if (i === 3) continue; const t = i / 6, bx = x - 0.14 + (w + 0.28) * t, by = y - 0.06 - 0.28 * 4 * t * (1 - t) * 0.5; g.beginPath(); g.moveTo(bx + (t - 0.5) * 0.08, by - 0.14); g.lineTo(bx, y); g.stroke(); }
    }
    /* Schlussstein */
    const sv = F.schatten ? F.schatten(0.06) : null;
    const kx = x + w / 2, ky = y - 0.36;
    if (sv) { g.fillStyle = "rgba(40,24,30,0.3)"; g.beginPath(); g.moveTo(kx - 0.11 + sv[0], ky + sv[1]); g.lineTo(kx + 0.11 + sv[0], ky + sv[1]); g.lineTo(kx + 0.08 + sv[0], y + 0.02 + sv[1]); g.lineTo(kx - 0.08 + sv[0], y + 0.02 + sv[1]); g.closePath(); g.fill(); }
    g.fillStyle = rgb(hell(ss, 0.06)); g.beginPath(); g.moveTo(kx - 0.11, ky); g.lineTo(kx + 0.11, ky); g.lineTo(kx + 0.08, y + 0.02); g.lineTo(kx - 0.08, y + 0.02); g.closePath(); g.fill();
    g.fillStyle = rgb(hell(ss, 0.25)); g.fillRect(kx - 0.11, ky, 0.22, 0.02);
    oeffnung(g, F, S, Z, x, y, w, h, Z.fensterEG, { sprossen: [1, 2] });
    sohlbank(g, F, S, x, Y(e.zs), w, false);
    if (S.winter && Z.schnee > 0 && Z.fensterEG) { schneeKante(g, x - 0.18, x + w + 0.18, Y(e.zs), 0.05 * Z.schnee, F, (e.a * 10) | 0); schneeKante(g, kx - 0.1, kx + 0.1, ky, 0.03 * Z.schnee, F, 3); }
  }
  function fensterOG(g, F, S, Z, e, Y) {
    const x = e.a - e.w / 2, y = Y(e.zs + e.h), w = e.w, h = e.h, ss = S.sandstein;
    /* Brüstungsfeld mit Jugendstil-Girlande */
    const by0 = Y(e.zs) + 0.1, by1 = Y(GURT1) - 0.04;
    if (by1 - by0 > 0.2) {
      g.fillStyle = "rgba(80,60,50,0.1)"; g.fillRect(x, by0 + 0.04, w, by1 - by0 - 0.04);
      if (F.px > 18) {
        g.strokeStyle = rgb(hell(S.putz, -0.2), 0.9); g.lineWidth = 0.025;
        g.strokeRect(x + 0.04, by0 + 0.08, w - 0.08, by1 - by0 - 0.12);
        g.strokeStyle = rgb(hell(S.putz, -0.12), 0.9); g.lineWidth = 0.03;
        const my = (by0 + by1) / 2;
        g.beginPath(); g.moveTo(x + 0.15, my - 0.05); g.quadraticCurveTo(x + w / 2, my + 0.18, x + w - 0.15, my - 0.05); g.stroke();
        g.fillStyle = rgb(hell(S.putz, -0.12)); g.beginPath(); g.arc(x + w / 2, my + 0.06, 0.05, 0, TAU); g.fill();
      }
    }
    gewaende(g, F, S, x, y, w, h, 0.13, { oben: 0.13 });
    /* Verdachung: gerades Gesims auf zwei Volutenkonsolen */
    const vy = y - 0.3, vw = w + 0.5, vx = x - 0.25;
    const sv = F.schatten ? F.schatten(0.14) : null;
    if (sv) { g.fillStyle = "rgba(40,24,30,0.33)"; g.fillRect(vx + sv[0], vy + 0.14, vw, Math.max(0.03, sv[1])); }
    for (const kx of [x - 0.2, x + w + 0.07]) {
      g.fillStyle = rgb(hell(ss, -0.1));
      g.beginPath(); g.moveTo(kx, vy + 0.14); g.lineTo(kx + 0.13, vy + 0.14); g.lineTo(kx + 0.11, vy + 0.36); g.quadraticCurveTo(kx + 0.065, vy + 0.42, kx + 0.02, vy + 0.36); g.closePath(); g.fill();
    }
    sandstein(g, vx, vy, vw, 0.14, F, ss, { saat: 81 });
    g.fillStyle = rgb(hell(ss, 0.28)); g.fillRect(vx, vy, vw, 0.03);
    g.fillStyle = rgb(hell(ss, -0.3)); g.fillRect(vx, vy + 0.12, vw, 0.02);
    oeffnung(g, F, S, Z, x, y, w, h, Z.fensterOG, { sprossen: [1, 2] });
    sohlbank(g, F, S, x, Y(e.zs), w, true);
    if (S.winter && Z.schnee > 0 && Z.fensterOG) { schneeKante(g, x - 0.18, x + w + 0.18, Y(e.zs), 0.05 * Z.schnee, F, (e.a * 13) | 0); schneeKante(g, vx, vx + vw, vy, 0.06 * Z.schnee, F, (e.a * 7) | 0); }
    if (S.sommer && Z.fertig && e.kasten) PI.blumenkasten(g, x + 0.03, Y(e.zs) - 0.02, w - 0.06, F, "sommer", { kastenFarbe: "#3f5a45" });
  }
  function kellerFenster(g, F, S, Z, e, Y) {
    const x = e.a - 0.35, y = Y(0.72), w = 0.7, h = 0.38;
    g.fillStyle = rgb(hell(S.sandstein, -0.4)); g.fillRect(x - 0.05, y - 0.05, w + 0.1, h + 0.1);
    g.fillStyle = "rgb(30,28,30)"; g.fillRect(x, y, w, h);
    if (Z.fensterEG) {
      g.fillStyle = "rgba(120,140,160,0.35)"; g.fillRect(x + 0.04, y + 0.04, w - 0.08, h - 0.08);
      g.fillStyle = "rgb(36,36,38)"; for (let i = 1; i < 5; i++) g.fillRect(x + w * i / 5 - 0.012, y, 0.024, h);
    }
  }
  /* Portal: Rundbogen mit Sandsteinrahmung, zweiflügelige Tür mit Glas */
  function portal(g, F, S, Z, e, Y) {
    const ss = S.sandstein, w = e.w, h = e.h, x = e.a - w / 2, zs = e.zs, y = Y(zs + h), r = w / 2;
    const sv = F.schatten ? F.schatten(0.08) : null;
    /* Rahmung: Pilaster und Archivolte */
    const rb = 0.3;
    if (sv) { g.fillStyle = "rgba(40,24,30,0.3)"; g.beginPath(); g.moveTo(x - rb + sv[0], Y(zs) + sv[1]); g.lineTo(x - rb + sv[0], y + r + sv[1]); g.arc(x + r + sv[0], y + r + sv[1], r + rb, Math.PI, 0); g.lineTo(x + w + rb + sv[0], Y(zs) + sv[1]); g.closePath(); g.fill(); }
    g.save();
    g.beginPath(); g.moveTo(x - rb, Y(zs)); g.lineTo(x - rb, y + r); g.arc(x + r, y + r, r + rb, Math.PI, 0); g.lineTo(x + w + rb, Y(zs)); g.closePath(); g.clip();
    sandstein(g, x - rb - 0.1, y - rb - 0.1, w + 2 * rb + 0.2, h + rb + 0.2, F, ss, { saat: 90 });
    if (F.px > 10) {
      g.strokeStyle = rgb(hell(ss, -0.3), 0.8); g.lineWidth = Math.max(0.01, 0.9 / F.px);
      for (let i = 1; i < 9; i++) { const a = Math.PI + Math.PI * i / 9; g.beginPath(); g.moveTo(x + r + Math.cos(a) * r, y + r + Math.sin(a) * r); g.lineTo(x + r + Math.cos(a) * (r + rb), y + r + Math.sin(a) * (r + rb)); g.stroke(); }
      for (let zz = zs + 0.4; zz < zs + h - r; zz += 0.4) { g.beginPath(); g.moveTo(x - rb, Y(zz)); g.lineTo(x, Y(zz)); g.moveTo(x + w, Y(zz)); g.lineTo(x + w + rb, Y(zz)); g.stroke(); }
    }
    g.restore();
    /* Schlussstein */
    g.fillStyle = rgb(hell(ss, 0.08)); g.beginPath(); g.moveTo(x + r - 0.14, y - rb - 0.05); g.lineTo(x + r + 0.14, y - rb - 0.05); g.lineTo(x + r + 0.1, y + 0.04); g.lineTo(x + r - 0.1, y + 0.04); g.closePath(); g.fill();
    /* Türöffnung */
    g.save();
    g.beginPath(); g.moveTo(x, Y(zs)); g.lineTo(x, y + r); g.arc(x + r, y + r, r, Math.PI, 0); g.lineTo(x + w, Y(zs)); g.closePath(); g.clip();
    if (!Z.tuer) {
      g.fillStyle = "rgb(36,30,28)"; g.fillRect(x, y, w, h);
    } else {
      /* Oberlicht */
      g.fillStyle = "rgb(40,52,70)"; g.fillRect(x, y, w, r + 0.05);
      if (F.px > 12) {
        g.strokeStyle = "rgb(30,34,32)"; g.lineWidth = 0.03;
        for (let i = 1; i < 6; i++) { const a = Math.PI + Math.PI * i / 6; g.beginPath(); g.moveTo(x + r, y + r); g.lineTo(x + r + Math.cos(a) * r, y + r + Math.sin(a) * r); g.stroke(); }
        g.beginPath(); g.arc(x + r, y + r, r * 0.45, Math.PI, 0); g.stroke();
      }
      g.fillStyle = "rgba(255,255,255,0.12)"; g.beginPath(); g.moveTo(x + r * 0.4, y + r); g.lineTo(x + r * 0.9, y + 0.05); g.lineTo(x + r * 1.1, y + 0.1); g.lineTo(x + r * 0.6, y + r); g.fill();
      /* Kämpfer */
      g.fillStyle = "rgb(62,42,30)"; g.fillRect(x, y + r - 0.02, w, 0.1);
      /* zwei Flügel: Eiche, unten Füllung, oben Glas hinter Gitter */
      const ty = y + r + 0.08, th = Y(zs) - ty;
      for (const s of [0, 1]) {
        const fx = x + s * w / 2, fw = w / 2;
        const gr = g.createLinearGradient(fx, 0, fx + fw, 0);
        gr.addColorStop(0, "rgb(92,58,36)"); gr.addColorStop(1, "rgb(70,44,28)");
        g.fillStyle = gr; g.fillRect(fx, ty, fw, th);
        g.fillStyle = "rgb(46,58,72)"; g.fillRect(fx + 0.1, ty + 0.12, fw - 0.2, th * 0.42);
        if (F.px > 14) {
          g.strokeStyle = "rgb(28,30,28)"; g.lineWidth = 0.02;
          for (let k = 1; k < 4; k++) { g.beginPath(); g.moveTo(fx + 0.1, ty + 0.12 + th * 0.42 * k / 4); g.lineTo(fx + fw - 0.1, ty + 0.12 + th * 0.42 * k / 4); g.stroke(); }
          g.strokeStyle = "rgba(30,18,10,0.7)"; g.lineWidth = 0.02; g.strokeRect(fx + 0.1, ty + th * 0.62, fw - 0.2, th * 0.3);
        }
        g.fillStyle = "rgba(20,12,8,0.6)"; g.fillRect(fx + fw - 0.012, ty, 0.012, th);
      }
      /* Messinggriffe */
      g.fillStyle = "#c9a45a"; g.fillRect(x + w / 2 - 0.09, ty + th * 0.5, 0.03, 0.22); g.fillRect(x + w / 2 + 0.06, ty + th * 0.5, 0.03, 0.22);
    }
    /* Laibungsschatten */
    if (sv) { g.fillStyle = "rgba(20,15,20,0.35)"; g.beginPath(); g.moveTo(x, y + r); g.arc(x + r, y + r, r, Math.PI, 0); g.lineTo(x + w + sv[0] * 2, y + r + sv[1] * 2); g.arc(x + r + sv[0] * 2, y + r + sv[1] * 2, r, 0, Math.PI, true); g.closePath(); g.fill(); }
    g.restore();
  }
  /* Dreiergruppe im Risalit: Rundbogenfenster mit zwei schmalen Seitenlichtern */
  function dreiFenster(g, F, S, Z, e, Y) {
    const ss = S.sandstein, zs = e.zs, h = e.h, wm = 1.1, ws = 0.42, sp = 0.2;
    const xm = e.a - wm / 2, y = Y(zs + h);
    const xl = xm - sp - ws, xr = xm + wm + sp;
    /* gemeinsames Gewände */
    gewaende(g, F, S, xl, Y(zs + h - 0.2), xr + ws - xl, h - 0.2, 0.14, { oben: 0.14 });
    const r = wm / 2;
    g.fillStyle = rgb(ss); g.beginPath(); g.arc(e.a, y + r, r + 0.18, Math.PI, 0); g.fill();
    sandstein(g, xm - 0.2, y - 0.2, wm + 0.4, r + 0.2, F, ss, { saat: 99 });
    /* Pfeiler zwischen den Fenstern (Säulchen) */
    oeffnung(g, F, S, Z, xl, Y(zs + h - 0.2), ws, h - 0.2, Z.fensterOG, { sprossen: [1, 3], fluegel: 1, vorhang: false });
    oeffnung(g, F, S, Z, xr, Y(zs + h - 0.2), ws, h - 0.2, Z.fensterOG, { sprossen: [1, 3], fluegel: 1, vorhang: false });
    oeffnung(g, F, S, Z, xm, y + r, wm, h - r, Z.fensterOG, { sprossen: [1, 2], fluegel: 2 });
    /* Bogenfeld: Glas mit Jugendstil-Sprossen */
    g.save(); g.beginPath(); g.arc(e.a, y + r + 0.005, r, Math.PI, 0); g.closePath(); g.clip();
    if (Z.fensterOG) {
      const gl = g.createLinearGradient(0, y, 0, y + r); gl.addColorStop(0, "rgb(150,172,200)"); gl.addColorStop(1, "rgb(52,64,84)");
      g.fillStyle = gl; g.fillRect(xm, y, wm, r + 0.01);
      g.strokeStyle = "#f3f0e8"; g.lineWidth = 0.05; g.beginPath(); g.arc(e.a, y + r, r - 0.025, Math.PI, 0); g.stroke();
      g.lineWidth = 0.035; g.beginPath(); g.arc(e.a, y + r, r * 0.45, Math.PI, 0); g.stroke();
      for (const a of [-2.3, -1.57, -0.84]) { g.beginPath(); g.moveTo(e.a + Math.cos(a) * r * 0.45, y + r + Math.sin(a) * r * 0.45); g.lineTo(e.a + Math.cos(a) * r, y + r + Math.sin(a) * r); g.stroke(); }
    } else { g.fillStyle = "rgb(34,28,26)"; g.fillRect(xm, y, wm, r + 0.01); }
    g.restore();
    sohlbank(g, F, S, xl, Y(zs), xr + ws - xl, true);
    if (S.winter && Z.schnee > 0 && Z.fensterOG) schneeKante(g, xl - 0.18, xr + ws + 0.18, Y(zs), 0.05 * Z.schnee, F, 44);
  }
  /* nächtliches Licht der Fenster einer Wand */
  function wandLicht(S, Z, W) {
    return function (g, F) {
      if (!Z.licht) return;
      const zTop = F.flaeche.zTop == null ? W.z1 : F.flaeche.zTop;
      g.save(); g.translate(0, zTop - W.z1);
      const Y = (z) => W.z1 - z;
      for (const e of W.elemente || []) {
        const an = lichtAn(S, e);
        if (e.art === "eg" || e.art === "og") PI.fensterLicht(g, e.a - e.w / 2, Y(e.zs + e.h), e.w, e.h, F, { an: an, sprossen: [1, 2], fluegel: 2, farbe: e.art === "eg" && e.flur ? [255, 214, 160] : [255, 196, 124] });
        else if (e.art === "drei") {
          const wm = 1.1, ws = 0.42, sp = 0.2, xm = e.a - wm / 2;
          PI.fensterLicht(g, xm, Y(e.zs + e.h) + wm / 2, wm, e.h - wm / 2, F, { an: 1, sprossen: [1, 2], fluegel: 2, farbe: [255, 206, 140] });
          PI.fensterLicht(g, xm - sp - ws, Y(e.zs + e.h - 0.2), ws, e.h - 0.2, F, { an: 1, sprossen: [1, 3], fluegel: 1, farbe: [255, 206, 140] });
          PI.fensterLicht(g, xm + wm + sp, Y(e.zs + e.h - 0.2), ws, e.h - 0.2, F, { an: 1, sprossen: [1, 3], fluegel: 1, farbe: [255, 206, 140] });
        } else if (e.art === "portal") {
          const w = e.w, r = w / 2, x = e.a - w / 2, y = Y(e.zs + e.h);
          g.save(); g.beginPath(); g.arc(x + r, y + r, r - 0.04, Math.PI, 0); g.closePath(); g.clip();
          g.fillStyle = "rgba(255,206,140," + (0.85 * F.nacht) + ")"; g.fillRect(x, y, w, r);
          g.restore();
          F.leuchtPunkt(e.a, y + r, 1.4, "255,200,130", 0.6);
        }
      }
      g.restore();
    };
  }
  function lichtAn(S, e) {
    const r = zufall(S.saat * 31 + Math.round(e.a * 17) + Math.round(e.zs * 5) + (e.seite || 0) * 101)();
    return r < 0.62 ? 1 : 0;
  }

  /* =====================================================================
     WÄNDE (Liste aller Außenwände mit ihren Öffnungen)
     ===================================================================== */
  function waendePlan() {
    const W = [];
    const eg = (a, extra) => Object.assign({ art: "eg", a: a, w: FENSTER_W, h: EG_H, zs: EG_ZS }, extra || {});
    const og = (a, extra) => Object.assign({ art: "og", a: a, w: FENSTER_W, h: OG_H, zs: OG_ZS }, extra || {});
    const kf = (a) => ({ art: "keller", a: a, zs: 0.3, w: 0.7, h: 0.4 });
    const achsen = (liste, s) => { const r = []; for (const a of liste) r.push(kf(a), eg(a, { seite: s }), og(a, { seite: s })); return r; };
    /* Süden, westlich des Risalits */
    W.push({ p0: PLAN[0], p1: PLAN[1], ecken: ["l"], elemente: achsen([1.15, 2.55], 1), fries: true });
    /* Risalit: Westseite, Front, Ostseite */
    W.push({ p0: PLAN[1], p1: PLAN[2], ecken: [], elemente: [], fries: true, schmal: true });
    W.push({ p0: PLAN[2], p1: PLAN[3], ecken: ["l", "r"], elemente: [{ art: "portal", a: 2.0, w: 1.5, h: 2.75, zs: PORTAL_Z }, { art: "drei", a: 2.0, zs: 5.3, h: 2.2 }], fries: true, risalit: true });
    W.push({ p0: PLAN[3], p1: PLAN[4], ecken: [], elemente: [], fries: true, schmal: true });
    /* Süden, östlich */
    W.push({ p0: PLAN[4], p1: PLAN[5], ecken: ["r"], elemente: achsen([0.95, 2.35], 2), fries: true });
    /* Osten, Norden, Westen */
    W.push({ p0: PLAN[5], p1: PLAN[6], ecken: ["l", "r"], elemente: achsen([1.3, 3.2, 5.1], 3), fries: true });
    W.push({ p0: PLAN[6], p1: PLAN[7], ecken: ["l", "r"], elemente: achsen([1.15, 2.55, 4.05, 5.5, 6.95, 8.45, 9.85], 4), fries: true });
    W.push({ p0: PLAN[7], p1: PLAN[0], ecken: ["l", "r"], elemente: achsen([1.3, 3.2, 5.1], 5), fries: true });
    let saat = 3, ox = 0;
    for (const w of W) { w.L = Math.hypot(w.p1[0] - w.p0[0], w.p1[1] - w.p0[1]); w.z0 = 0; w.z1 = ZW; w.saat = saat += 7; w.ox = ox; ox += 0.37; }
    return W;
  }
  const WAENDE = waendePlan();

  /* =====================================================================
     BAUGRUBE, FUNDAMENT, KELLER
     ===================================================================== */
  const GRUBE = [[-6.1, 3.1], [6.1, 3.1], [6.1, -5.1], [-6.1, -5.1]];
  function erdeWand(saat, S) {
    return function (g, F) {
      g.save();
      if (!lochClip(g, F, S.B, GRUBE, 0)) { g.restore(); return; }
      const L = belichter(F, 0.04), w = F.w, h = F.h, rng = zufall(saat);
      const sch = [[0, [70, 52, 36]], [0.3, [128, 94, 60]], [0.9, [160, 124, 82]], [1.7, [138, 112, 86]]];
      for (let i = 0; i < sch.length; i++) {
        g.fillStyle = L(sch[i][1]);
        g.beginPath(); g.moveTo(-0.1, h + 0.2); g.lineTo(-0.1, sch[i][0]);
        for (let x = 0; x <= w + 0.3; x += 0.3) g.lineTo(x, sch[i][0] + (i ? Math.sin(x * 1.7 + i * 3 + saat) * 0.05 + Math.sin(x * 4.1 + i) * 0.03 : 0));
        g.lineTo(w + 0.3, h + 0.2); g.closePath(); g.fill();
      }
      if (F.px > 6) rausch(g, 0, 0, w, h, 0.9, 0.35, saat + 3, 3);
      if (F.px > 10) {
        for (let i = 0; i < Math.min(260, w * h * 6); i++) { const x = rng() * w, y = 0.3 + rng() * (h - 0.3), r = 0.015 + rng() * 0.04; g.fillStyle = L(hell([140, 130, 118], (rng() - 0.5) * 0.4)); g.beginPath(); g.ellipse(x, y, r * 1.3, r, rng() * 3, 0, TAU); g.fill(); }
        g.strokeStyle = L([30, 20, 14], 0.2); g.lineWidth = 0.02;
        for (let x = rng() * 0.3; x < w; x += 0.25 + rng() * 0.25) { g.beginPath(); g.moveTo(x, 0.3); g.lineTo(x + 0.04, h); g.stroke(); }
      }
      const gd = g.createLinearGradient(0, 0, 0, h); gd.addColorStop(0, "rgba(10,8,20,0)"); gd.addColorStop(1, "rgba(10,8,20,0.3)");
      g.fillStyle = gd; g.fillRect(-0.1, 0, w + 0.2, h + 0.1);
      if (S.winter) { g.fillStyle = L([240, 244, 251]); g.fillRect(-0.1, -0.1, w + 0.2, 0.13); }
      g.restore();
    };
  }
  function grubeBauen(M, S, Z) {
    const T = Math.max(0.05, Z.grubeT);
    const [x0, y1] = GRUBE[0], [x1, y0] = [GRUBE[2][0], GRUBE[2][1]];
    const ex = { keinLicht: true, keinAo: true };
    M.teil("baugrube", { ebene: -5, mitte: [0, 0, -3], schatten: false });
    M.flaeche(Object.assign({ name: "grube-sohle", o: [x0, y0, -T], u: [1, 0, 0], v: [0, 1, 0], w: x1 - x0, h: y1 - y0, ebene: -1, malen: (g, F) => {
      g.save();
      if (!lochClip(g, F, S.B, GRUBE, 0)) { g.restore(); return; }
      const L = belichter(F, 0.04);
      g.fillStyle = L(Z.grubeT < TIEFE - 0.05 && Z.bau > 0.19 ? [150, 118, 82] : [120, 90, 62]); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
      if (F.px > 6) rausch(g, 0, 0, F.w, F.h, 1.2, 0.3, 17, 3);
      if (F.px > 6) { g.strokeStyle = L([92, 68, 46], 0.55); g.lineWidth = 0.35; g.beginPath(); g.moveTo(1, F.h - 0.8); g.quadraticCurveTo(F.w * 0.4, F.h * 0.45, F.w - 1.5, 0.9); g.stroke(); }
      if (S.winter) { g.fillStyle = L([236, 240, 248], 0.45); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); }
      /* Schatten der Grubenwand (Sonne kommt von links oben) */
      const gd = g.createLinearGradient(0, 0, 0, 1.4); gd.addColorStop(0, "rgba(20,24,52,0.35)"); gd.addColorStop(1, "rgba(20,24,52,0)");
      g.fillStyle = gd; g.fillRect(-0.1, -0.1, F.w + 0.2, 1.5);
      g.restore();
    } }, ex));
    wand(M, [x0, y0], [x1, y0], -T, 0, erdeWand(101, S), Object.assign({ name: "gw-n" }, ex));
    M.flaeche(Object.assign({ name: "gw-s", o: [x1, y1, 0], u: [-1, 0, 0], v: [0, 0, -1], w: x1 - x0, h: T, malen: erdeWand(102, S) }, ex));
    M.flaeche(Object.assign({ name: "gw-o", o: [x1, y0, 0], u: [0, 1, 0], v: [0, 0, -1], w: y1 - y0, h: T, malen: erdeWand(103, S) }, ex));
    M.flaeche(Object.assign({ name: "gw-w", o: [x0, y1, 0], u: [0, -1, 0], v: [0, 0, -1], w: y1 - y0, h: T, malen: erdeWand(104, S) }, ex));
    /* Streifenfundament: zuerst Schalung und Eisen, dann Beton */
    if (Z.fundament > 0) {
      const zf = -TIEFE, hf = 0.3 * glatt(Z.fundament * 1.4);
      const A = versatz(PLAN, 0.2), I = versatz(PLAN, -DICKE - 0.2);
      const nass = Z.bau < 0.1;
      const betonMal = (g, F) => {
        g.save(); if (!lochClip(g, F, S.B, GRUBE, 0)) { g.restore(); return; }
        const L = belichter(F, 0.03);
        if (Z.fundament < 0.4) { g.fillStyle = L([160, 124, 84]); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); g.strokeStyle = L([110, 84, 56]); g.lineWidth = 0.015; for (let y = 0.1; y < F.h; y += 0.1) { g.beginPath(); g.moveTo(0, y); g.lineTo(F.w, y); g.stroke(); } }
        else { g.fillStyle = L(nass ? [124, 124, 122] : BETON); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); if (F.px > 8) rausch(g, 0, 0, F.w, F.h, 1.0, 0.25, 40, 3); }
        g.restore();
      };
      if (hf > 0.01) {
        M.teil("fundament", { ebene: -4, mitte: [0, 0, -2.2], schatten: false });
        for (let i = 0; i < A.length; i++) {
          const a = A[i], b = A[(i + 1) % A.length];
          wand(M, a, b, zf, zf + hf, betonMal, { name: "fu" + i, keinLicht: true, keinAo: true });
        }
        /* Oberseite als Ring (Streifen je Seite) und Kellersohle innen */
        for (let i = 0; i < A.length; i++) {
          const j = (i + 1) % A.length;
          poly3(M, [[A[i][0], A[i][1], zf + hf], [A[j][0], A[j][1], zf + hf], [I[j][0], I[j][1], zf + hf], [I[i][0], I[i][1], zf + hf]], (g, F) => {
            g.save(); if (!lochClip(g, F, S.B, GRUBE, 0)) { g.restore(); return; }
            const L = belichter(F, 0.03);
            g.fillStyle = L(Z.fundament < 0.7 ? [110, 110, 108] : BETON); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
            if (Z.fundament < 0.7) { g.strokeStyle = L([100, 62, 40]); g.lineWidth = 0.016; for (let x = 0.15; x < F.w; x += 0.2) { g.beginPath(); g.moveTo(x, 0.05); g.lineTo(x, F.h - 0.05); g.stroke(); } }
            g.restore();
          }, { n: [0, 0, 1], name: "fut" + i, keinLicht: true, ebene: 1 });
        }
      }
    }
  }
  /* Kellersohle innen (Beton, noch nass glänzend) */
  function kellerSohle(M, S, Z) {
    const z = -TIEFE + 0.3;
    poly3(M, INNEN.map((p) => [p[0], p[1], z]), (g, F) => {
      g.save();
      const loch = Z.grubeT > 0.02 ? GRUBE : INNEN;
      if (!lochClip(g, F, S.B, loch, 0)) { g.restore(); return; }
      const L = belichter(F, 0.02);
      g.fillStyle = L(BETON); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
      if (F.px > 6) rausch(g, 0, 0, F.w, F.h, 1.4, 0.22, 61, 3);
      const gd = g.createLinearGradient(0, 0, 0, 1.6); gd.addColorStop(0, "rgba(20,24,52,0.4)"); gd.addColorStop(1, "rgba(20,24,52,0)");
      g.fillStyle = gd; g.fillRect(-0.1, -0.1, F.w + 0.2, 1.7);
      g.restore();
    }, { n: [0, 0, 1], name: "kellersohle", keinLicht: true });
  }

  /* =====================================================================
     MAUERRING im Bau: außen die Fassaden, innen roher Ziegel, oben die
     Mauerkrone. Unter der Erde nur durch die Öffnung sichtbar.
     ===================================================================== */
  function mauerRing(M, S, Z, z0, z1, fertigeWand, opt) {
    opt = opt || {};
    if (z1 - z0 < 0.01) return;
    const unter = z0 < -0.01;
    const clip = (g, F) => {
      if (!unter) return true;
      const loch = Z.grubeT > 0.02 ? GRUBE : INNEN;
      return lochClip(g, F, S.B, loch, 0);
    };
    /* innen (nur, solange oben offen) */
    if (opt.mitInnen) {
      const zi0 = opt.innen0 == null ? z0 : opt.innen0;
      const iu = zi0 < -0.01;
      M.teil("innen", { ebene: -2, mitte: [0, -1.3, zi0], schatten: false });
      const innenMal = (g, F) => {
        g.save(); if (iu && !lochClip(g, F, S.B, Z.grubeT > 0.02 ? GRUBE : INNEN, 0)) { g.restore(); return; }
        ziegel(g, -0.1, -0.1, F.w + 0.2, F.h + 0.2, F, { saat: 91, farbe: hell(ZIEGEL_ROH, -0.12) });
        const gd = g.createLinearGradient(0, F.h, 0, F.h - 1.5); gd.addColorStop(0, "rgba(20,16,30,0.45)"); gd.addColorStop(1, "rgba(20,16,30,0)");
        g.fillStyle = gd; g.fillRect(-0.1, F.h - 1.5, F.w + 0.2, 1.6);
        if (iu) lichtAuf(g, F, 0);
        g.restore();
      };
      for (let i = 0; i < INNEN.length; i++) {
        const a = INNEN[i], b = INNEN[(i + 1) % INNEN.length];
        /* von innen gesehen: umgekehrte Richtung */
        wand(M, b, a, zi0, z1, innenMal, { name: "in" + i, keinLicht: iu });
      }
    }
    /* Boden innen (Decke des Geschosses darunter) */
    if (Z.decke != null && Z.decke <= z1 && !unter) {
      const zd = Z.decke;
      poly3(M, INNEN.map((p) => [p[0], p[1], zd]), (g, F) => {
        /* Holzbalkendecke mit Blindboden */
        g.fillStyle = rgb(HOLZ_ROH); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
        if (F.px > 8) { g.fillStyle = rgb(hell(HOLZ_ROH, -0.25)); for (let x = 0.2; x < F.w; x += 0.2) g.fillRect(x, 0, 0.012, F.h); }
        rausch(g, 0, 0, F.w, F.h, 1.2, 0.25, 71, 3);
      }, { n: [0, 0, 1], name: "decke" });
    }
    /* außen */
    M.teil("mauern", { mitte: [0, -1.3, (z0 + z1) / 2], schatten: !unter });
    for (const W of WAENDE) {
      const zt = Math.min(z1, W.z1);
      if (zt - z0 < 0.01) continue;
      const mal = unter ? (g, F) => {
        g.save(); if (!clip(g, F)) { g.restore(); return; }
        ziegel(g, -0.1, -0.1, F.w + 0.2, F.h + 0.2, F, { saat: W.saat });
        const gd = g.createLinearGradient(0, F.h, 0, 0); gd.addColorStop(0, "rgba(20,16,30,0.4)"); gd.addColorStop(1, "rgba(20,16,30,0)");
        g.fillStyle = gd; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
        lichtAuf(g, F, 0);
        g.restore();
      } : wandMaler(S, Z, W);
      const f = wand(M, W.p0, W.p1, z0, zt, mal, { name: "w" + W.saat, ao: !unter, keinLicht: unter, traufe: fertigeWand ? 0.45 : 0, leuchten: fertigeWand ? wandLicht(S, Z, W) : null });
      f.zTop = zt;
    }
    /* Mauerkrone */
    if (!fertigeWand) {
      for (let i = 0; i < PLAN.length; i++) {
        const j = (i + 1) % PLAN.length;
        const ku = z1 < -0.01;
        poly3(M, [[PLAN[i][0], PLAN[i][1], z1], [PLAN[j][0], PLAN[j][1], z1], [INNEN[j][0], INNEN[j][1], z1], [INNEN[i][0], INNEN[i][1], z1]], (g, F) => {
          g.save(); if (ku && !clip(g, F)) { g.restore(); return; }
          const mitSandstein = z1 <= SOCKEL + 0.01 || Math.abs(z1 - GURT1) < 0.2;
          g.fillStyle = rgb(mitSandstein ? S.sandstein : hell(ZIEGEL_ROH, 0.08)); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
          if (F.px > 8 && !mitSandstein) { g.fillStyle = "rgba(210,200,184,0.8)"; for (let x = 0.13; x < F.w; x += 0.26) g.fillRect(x, 0, 0.012, F.h); g.fillRect(0, F.h / 2 - 0.006, F.w, 0.012); }
          rausch(g, 0, 0, F.w, F.h, 1, 0.2, 8, 3);
          if (ku) lichtAuf(g, F, 0);
          g.restore();
        }, { n: [0, 0, 1], name: "krone" + i, keinLicht: ku });
      }
    }
  }

  /* =====================================================================
     KRANZGESIMS (umlaufend, 0,32 m Ausladung)
     ===================================================================== */
  function gesimsBauen(M, S, Z) {
    const k = Z.gesims;
    if (k <= 0) return;
    const z0 = ZW, z1 = ZW + (ZG - ZW) * glatt(k);
    const ss = S.sandstein;
    M.teil("gesims", { mitte: [0, -1.3, 8.3], schatten: true });
    const front = (g, F) => {
      const h = F.h;
      sandstein(g, -0.1, -0.1, F.w + 0.2, h + 0.2, F, ss, { saat: 120, fugen: 1.1 });
      /* Profil: Platte, Hohlkehle, Karnies */
      g.fillStyle = rgb(hell(ss, 0.2)); g.fillRect(-0.1, 0, F.w + 0.2, 0.05);
      g.fillStyle = rgb(hell(ss, -0.08)); g.fillRect(-0.1, 0.16, F.w + 0.2, 0.05);
      g.fillStyle = rgb(hell(ss, -0.32)); g.fillRect(-0.1, 0.21, F.w + 0.2, 0.06);
      g.fillStyle = rgb(hell(ss, 0.08)); g.fillRect(-0.1, 0.27, F.w + 0.2, 0.08);
      g.fillStyle = rgb(hell(ss, -0.4)); g.fillRect(-0.1, h - 0.03, F.w + 0.2, 0.03);
      if (S.winter && Z.schnee > 0) PI.eiszapfen(g, 0.1, F.w - 0.1, h + 0.02, F, { laenge: 0.3 * Z.schnee, saat: (F.w * 10) | 0 });
    };
    for (let i = 0; i < GESIMS.length; i++) {
      const a = GESIMS[i], b = GESIMS[(i + 1) % GESIMS.length];
      const f = wand(M, a, b, z0, z1, front, { name: "gesims" + i, keinAo: true });
      f.zTop = z1;
    }
    /* Oberseite: Abdeckung aus Zinkblech, Schnee darauf */
    for (let i = 0; i < GESIMS.length; i++) {
      const j = (i + 1) % GESIMS.length;
      poly3(M, [[GESIMS[i][0], GESIMS[i][1], z1], [GESIMS[j][0], GESIMS[j][1], z1], [PLAN[j][0], PLAN[j][1], z1], [PLAN[i][0], PLAN[i][1], z1]], (g, F) => {
        zinkblech(g, -0.1, -0.1, F.w + 0.2, F.h + 0.2, F, { falz: 0.9 });
        if (S.winter && Z.schnee > 0) {
          g.fillStyle = "rgba(246,249,253," + Math.min(1, Z.schnee * 1.2) + ")"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
          rausch(g, 0, 0, F.w, F.h, 0.8, 0.1, 5, 3);
        } else if (S.herbst) laub(g, 0, 0, F.w, F.h, F.w * 4, i + 3);
      }, { n: [0, 0, 1], name: "gesimsOben" + i });
    }
  }

  /* =====================================================================
     MANSARDE: 12 Flächen (unten 4 Trapeze, oben 2 Trapeze + 2 Dreiecke)
     ===================================================================== */
  const P_B = (x, y) => [x, y, ZG], P_K = (x, y) => [x, y, ZK], P_F = (x) => [x, YM, ZF];
  const DACH = {
    uS: [P_B(MX0, MY1), P_B(MX1, MY1), P_K(KX1, KY1), P_K(KX0, KY1)],
    uN: [P_B(MX1, MY0), P_B(MX0, MY0), P_K(KX0, KY0), P_K(KX1, KY0)],
    uO: [P_B(MX1, MY1), P_B(MX1, MY0), P_K(KX1, KY0), P_K(KX1, KY1)],
    uW: [P_B(MX0, MY0), P_B(MX0, MY1), P_K(KX0, KY1), P_K(KX0, KY0)],
    oS: [P_K(KX0, KY1), P_K(KX1, KY1), P_F(FX), P_F(-FX)],
    oN: [P_K(KX1, KY0), P_K(KX0, KY0), P_F(-FX), P_F(FX)],
    oO: [P_K(KX1, KY1), P_K(KX1, KY0), P_F(FX)],
    oW: [P_K(KX0, KY0), P_K(KX0, KY1), P_F(-FX)]
  };
  const DACH_OCC = Object.keys(DACH).map((k) => DACH[k]);
  /* Zwerchdach (zwei Flächen) */
  const zwY = (z) => (z <= ZK ? MY1 - (z - ZG) * SL_U : KY1 - (z - ZK) * SL_O);
  const ZW_XK = (ZR - ZK) / ZSL;
  const ZWERCH = {
    w: [[-ZE, ZY, 8.525], [0, ZY, ZR], [0, zwY(ZR), ZR], [-ZW_XK, KY1, ZK], [-ZE, MY1 + 0.03, 8.525]],
    o: [[ZE, MY1 + 0.03, 8.525], [ZW_XK, KY1, ZK], [0, zwY(ZR), ZR], [0, ZY, ZR], [ZE, ZY, 8.525]]
  };
  /* Umriss des Schweifgiebels (x, z) von links unten über den Scheitel */
  function giebelUmriss() {
    const L = [];
    const bez = (p0, p1, p2, p3, n) => { for (let i = 1; i <= n; i++) { const t = i / n, s = 1 - t; L.push([s * s * s * p0[0] + 3 * s * s * t * p1[0] + 3 * s * t * t * p2[0] + t * t * t * p3[0], s * s * s * p0[1] + 3 * s * s * t * p1[1] + 3 * s * t * t * p2[1] + t * t * t * p3[1]]); } };
    L.push([-2.0, ZG], [-2.0, 9.45], [-2.1, 9.45], [-2.1, 9.6], [-1.98, 9.62]);
    bez([-1.98, 9.62], [-1.9, 10.2], [-1.6, 10.4], [-1.2, 10.42], 7);
    bez([-1.2, 10.42], [-0.8, 10.45], [-0.6, 10.9], [-0.58, 11.45], 7);
    L.push([-0.66, 11.45], [-0.66, 11.58], [-0.48, 11.6]);
    for (let i = 1; i < 6; i++) { const a = Math.PI + Math.PI * i / 12; L.push([Math.cos(a) * 0.48, 11.6 - Math.sin(a) * 0.8]); }
    const rechts = L.slice().reverse().map((p) => [-p[0], p[1]]);
    return L.concat([[0, 12.4]]).concat(rechts);
  }
  const GIEBEL = (function () {
    const L = giebelUmriss();
    /* Scheitel: Halbkreis mit r 0,48 über z 11,6 → oben 12,08 + Aufsatz */
    return L.map((p) => [p[0], p[1]]);
  })();

  /* Dach im Bau: Sparren, Pfetten, Latten; beidseitig sichtbar */
  function stuhlMalen(g, F, anteil, deck, kanten) {
    const vorn = F.sicht > 0;
    const n = vorn ? F.n : [-F.n[0], -F.n[1], -F.n[2]];
    const L = ST.lichtFaktor(n, F.zeit, 0.05, F.jahr);
    const c = (col, a) => rgb([col[0] * L[0], col[1] * L[1], col[2] * L[2]], a);
    const w = F.w, h = F.h, holz = HOLZ_ROH;
    /* bereits gedeckt: unterer Teil */
    const hd = h * deck;
    if (hd > 0.01) {
      g.save(); g.beginPath(); g.rect(-1, h - hd, w + 2, hd + 1); g.clip();
      schiefer(g, -0.1, 0, w + 0.2, h + 0.05, F, { saat: 7 });
      g.globalCompositeOperation = "multiply"; g.fillStyle = c([255, 255, 255]); g.fillRect(-1, h - hd, w + 2, hd + 1); g.globalCompositeOperation = "source-over";
      g.restore();
    }
    /* Lattung über dem gedeckten Teil (sobald gedeckt wird) */
    if (deck > 0 && deck < 1) {
      g.fillStyle = c(hell(holz, 0.05));
      for (let y = h - hd - 0.16; y > 0; y -= 0.16) g.fillRect(-0.1, y, w + 0.2, 0.035);
    }
    /* Sparren */
    const ab = 0.85;
    const nx = Math.floor(w / ab);
    for (let i = 0; i <= nx; i++) {
      const x = (w - nx * ab) / 2 + i * ab;
      if (i / Math.max(1, nx) > anteil + 0.001) continue;
      g.fillStyle = c(holz); g.fillRect(x - 0.06, 0, 0.12, h - hd);
      g.fillStyle = c(hell(holz, -0.25)); g.fillRect(x + 0.035, 0, 0.025, h - hd);
    }
    /* Grat- und Knickhölzer entlang der Kanten */
    if (anteil > 0.3 && kanten) {
      g.strokeStyle = c(hell(holz, -0.1)); g.lineWidth = 0.14;
      const U = F.flaeche.umriss;
      g.beginPath();
      for (const i of kanten) { const a = U[i], b = U[(i + 1) % U.length]; g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); }
      g.stroke();
    }
  }
  function dachFlaecheMalen(S, Z, teil, kanten) {
    return function (g, F) {
      const unten = teil === "u", zwerch = teil === "z";
      const deck = zwerch ? Z.deckZ : unten ? Z.deckU : Z.deckO;
      if (!Z.dachFertig) { stuhlMalen(g, F, Z.stuhl, deck, kanten); return; }
      /* Schiefer; die Hauptdachflächen im Raster der Nachbarflächen */
      schiefer(g, -0.1, 0, F.w + 0.2, F.h + 0.02, F, { saat: 7 + (F.name || "").length, reihe: unten || zwerch ? 0.16 : 0.18 });
      /* Grate, Knick und First: Zinkblech (im Winter auf den flachen
         Flächen unter dem Schnee – nur ein heller Wulst) */
      const verschneit = S.winter && Z.schnee > 0.5 && !unten && !zwerch;
      if (kanten && !verschneit) {
        g.lineCap = "round";
        const U = F.flaeche.umriss;
        for (const i of kanten) {
          const a = U[i], b = U[(i + 1) % U.length];
          g.strokeStyle = rgb(hell(ZINK, -0.25)); g.lineWidth = 0.13;
          g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
          g.strokeStyle = rgb(ZINK); g.lineWidth = 0.08;
          g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
          g.strokeStyle = rgb(hell(ZINK, 0.3)); g.lineWidth = 0.02;
          g.beginPath(); g.moveTo(a[0], a[1] - 0.025); g.lineTo(b[0], b[1] - 0.025); g.stroke();
        }
      }
      /* Schnee */
      if (S.winter && Z.schnee > 0) {
        if (zwerch) PI.schneeDach(g, -0.1, 0, F.w + 0.2, F.h, F, { deck: 0.55 * Z.schnee, saat: 12, durch: false });
        if (unten || zwerch) schneeSteil(g, F, Z.schnee * (zwerch ? 1 : 0.7), (F.name || "").length * 7, 0.16);
        else {
          PI.schneeDach(g, -0.1, 0, F.w + 0.2, F.h, F, { deck: 0.95 * Z.schnee, saat: (F.name || "x").length + 3 });
          g.fillStyle = "rgba(246,249,253," + Z.schnee + ")";
          g.beginPath(); g.moveTo(-0.1, F.h); for (let x = -0.1; x <= F.w + 0.2; x += 0.2) g.lineTo(x, F.h - 0.08 - 0.05 * Math.sin(x * 3.1)); g.lineTo(F.w + 0.2, F.h + 0.1); g.closePath(); g.fill();
        }
      } else if (S.herbst && !unten) laub(g, 0, F.h * 0.5, F.w, F.h * 0.5, F.w * 2, 5);
    };
  }

  function dachBauen(M, S, Z) {
    const fertig = Z.dachFertig;
    const opt = (name) => ({ name: name, beidseitig: !fertig, keinLicht: !fertig, dach: true });
    M.teil("dach", { ebene: 1, mitte: [0, YM, 10.2] });
    /* Kanten je Fläche (Indizes der Umrisskanten mit Blech):
       unten: Knick (2) und Grate (1, 3); oben: First (2) und Grate (1, 3) */
    poly3(M, DACH.uS, dachFlaecheMalen(S, Z, "u", [1, 2, 3]), Object.assign({ n: [0, 1, 0.3] }, opt("dach-uS")));
    poly3(M, DACH.uN, dachFlaecheMalen(S, Z, "u", [1, 2, 3]), Object.assign({ n: [0, -1, 0.3] }, opt("dach-uN")));
    poly3(M, DACH.uO, dachFlaecheMalen(S, Z, "u", [1, 2, 3]), Object.assign({ n: [1, 0, 0.3] }, opt("dach-uO")));
    poly3(M, DACH.uW, dachFlaecheMalen(S, Z, "u", [1, 2, 3]), Object.assign({ n: [-1, 0, 0.3] }, opt("dach-uW")));
    poly3(M, DACH.oS, dachFlaecheMalen(S, Z, "o", [1, 2, 3]), Object.assign({ n: [0, 1, 2] }, opt("dach-oS")));
    poly3(M, DACH.oN, dachFlaecheMalen(S, Z, "o", [1, 2, 3]), Object.assign({ n: [0, -1, 2] }, opt("dach-oN")));
    poly3(M, DACH.oO, dachFlaecheMalen(S, Z, "o", [1, 2]), Object.assign({ n: [1, 0, 2] }, opt("dach-oO")));
    poly3(M, DACH.oW, dachFlaecheMalen(S, Z, "o", [1, 2]), Object.assign({ n: [-1, 0, 2] }, opt("dach-oW")));
    /* Traufkante: Kastenrinne auf dem Gesims (schmale senkrechte Leiste) */
    if (fertig) {
      const R = [[MX0, MY1], [MX1, MY1], [MX1, MY0], [MX0, MY0]];
      for (let i = 0; i < 4; i++) {
        const a = R[i], b = R[(i + 1) % 4];
        wand(M, a, b, ZG, ZG + 0.14, (g, F) => {
          g.fillStyle = rgb(ZINK); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
          g.fillStyle = rgb(hell(ZINK, 0.3)); g.fillRect(-0.1, 0, F.w + 0.2, 0.03);
          if (S.winter && Z.schnee > 0) { g.fillStyle = "rgb(246,249,253)"; g.fillRect(-0.1, -0.1, F.w + 0.2, 0.12); }
        }, { name: "rinne" + i, keinAo: true, ebene: 1 });
      }
    }
    /* Dachboden (solange offen) */
    if (Z.dachboden) {
      M.teil("dachboden", { ebene: 0, mitte: [0, -1.3, ZG], schatten: false });
      poly3(M, versatz(PLAN, 0.05).map((p) => [p[0], p[1], ZG]), (g, F) => {
        g.fillStyle = rgb(HOLZ_ROH); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
        if (F.px > 8) { g.fillStyle = rgb(hell(HOLZ_ROH, -0.22)); for (let y = 0.18; y < F.h; y += 0.18) g.fillRect(0, y, F.w, 0.012); }
        rausch(g, 0, 0, F.w, F.h, 1.3, 0.25, 72, 3);
        /* Stapel Schieferplatten und Latten */
        g.fillStyle = "rgb(70,76,88)"; g.fillRect(2.2, 1.6, 0.8, 0.5); g.fillRect(7.6, 3.9, 0.8, 0.5);
        g.fillStyle = rgb(hell(HOLZ_ROH, 0.1)); for (let i = 0; i < 5; i++) g.fillRect(4.2, 4.6 + i * 0.07, 2.8, 0.05);
      }, { n: [0, 0, 1], name: "dachboden" });
    }
  }

  /* Zwerchhaus: Dach + Schweifgiebel (Front, Rückseite, Abdeckung) */
  function zwerchBauen(M, S, Z) {
    const fertig = Z.dachFertig;
    M.teil("zwerch", { ebene: 2, mitte: [0, 1.6, 10.5] });
    const occ = (m) => { const f = (g, F) => { if (fertig) { verdecken(g, F, S.B, DACH_OCC); m(g, F); lichtAuf(g, F, 0); } else m(g, F); }; f.selbstLicht = fertig; return f; };
    if (Z.stuhl > 0) {
      const o = { beidseitig: !fertig, keinLicht: !fertig, dach: true };
      poly3(M, ZWERCH.w, occ(dachFlaecheMalen(S, Z, "z", [1, 2, 3])), Object.assign({ n: [-1, 0, 0.7], name: "zw-w" }, o));
      poly3(M, ZWERCH.o, occ(dachFlaecheMalen(S, Z, "z", [0, 1, 2])), Object.assign({ n: [1, 0, 0.7], name: "zw-o" }, o));
    }
    /* Giebel */
    if (Z.giebelZ > ZG + 0.01) {
      const zg = Z.giebelZ;
      let um = GIEBEL.map((p) => [p[0], p[1]]);
      if (zg < GIEBEL_TOP - 0.01) um = schneide(um, (p) => zg - p[1]);
      if (um.length >= 3) {
        const vorn = um.map((p) => [p[0], RY1, p[1]]);
        const f = poly3(M, vorn, occ(giebelMaler(S, Z)), { n: [0, 1, 0], name: "giebel" });
        f.zTop = GIEBEL_TOP;
        poly3(M, um.map((p) => [p[0], ZY, p[1]]).reverse(), occ((g, F) => {
          if (Z.putzZ < 90) putz(g, -0.1, -0.1, F.w + 0.2, F.h + 0.2, F, hell(S.putz, -0.04), 5); else ziegel(g, -0.1, -0.1, F.w + 0.2, F.h + 0.2, F, { saat: 77 });
        }), { n: [0, -1, 0], name: "giebel-hinten" });
        if (zg >= GIEBEL_TOP - 0.01) {
          /* Abdeckplatten entlang des Umrisses */
          const G = GIEBEL;
          for (let i = 0; i < G.length - 1; i++) {
            const a = G[i], b = G[i + 1];
            const dx = b[0] - a[0], dz = b[1] - a[1], l = Math.hypot(dx, dz);
            if (l < 1e-3) continue;
            const nn = [-dz / l, 0, dx / l];
            poly3(M, [[a[0], RY1 + 0.02, a[1]], [b[0], RY1 + 0.02, b[1]], [b[0], ZY - 0.02, b[1]], [a[0], ZY - 0.02, a[1]]], occ((g, F) => {
              sandstein(g, -0.1, -0.1, F.w + 0.2, F.h + 0.2, F, hell(S.sandstein, 0.05), { saat: 130 });
              if (S.winter && Z.schnee > 0 && nn[2] > 0.3) { g.fillStyle = "rgba(246,249,253," + Z.schnee + ")"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); }
            }), { n: nn, name: "abdeck" + i, keinAo: true });
          }
        }
      }
    }
  }
  function giebelMaler(S, Z) {
    return function (g, F) {
      /* Flächenkoordinaten: a = x + 2, y = GIEBEL_TOP − z */
      const zTop = GIEBEL_TOP, ax = (x) => x - F.flaeche.o[0], Y = (z) => zTop - z;
      const ss = S.sandstein;
      g.translate(0, F.flaeche.o[2] - GIEBEL_TOP);
      if (Z.putzZ < 90 && Z.putzZ < zTop) putz(g, -0.1, -0.1, F.w + 0.2, Y(Math.max(ZG, Z.putzZ)) + 0.1, F, S.putz, 8);
      if (Z.putzZ > ZG) ziegel(g, -0.1, Y(Math.min(zTop, Z.putzZ)), F.w + 0.2, Math.min(zTop, Z.putzZ) - ZG + 0.1, F, { saat: 78 });
      /* Sandsteinrand entlang des Umrisses */
      g.save();
      g.lineJoin = "round";
      g.strokeStyle = rgb(ss); g.lineWidth = 0.34;
      g.beginPath(); GIEBEL.forEach((p, i) => { if (i) g.lineTo(ax(p[0]), Y(p[1])); else g.moveTo(ax(p[0]), Y(p[1])); }); g.stroke();
      g.strokeStyle = rgb(hell(ss, 0.2)); g.lineWidth = 0.06;
      g.beginPath(); GIEBEL.forEach((p, i) => { if (i) g.lineTo(ax(p[0]), Y(p[1]) + 0.01); else g.moveTo(ax(p[0]), Y(p[1]) + 0.01); }); g.stroke();
      g.restore();
      /* Schriftband über dem Gesims */
      const bz0 = 8.78, bz1 = 9.28;
      band(g, F, ss, ax(-1.72), ax(1.72), Y(bz1), bz1 - bz0, 0.04, 131);
      if (F.px > 6) {
        g.save();
        g.fillStyle = F.px > 16 ? "rgb(58,40,26)" : "rgba(58,40,26,0.75)";
        g.font = "bold 0.27px 'DejaVu Serif', Georgia, serif"; g.textAlign = "center"; g.textBaseline = "middle";
        if (g.letterSpacing !== undefined) g.letterSpacing = "0.035px";
        g.fillText("KRANKENHAUS", ax(0), Y((bz0 + bz1) / 2) + 0.01, 3.2);
        g.restore();
      }
      /* Bogenfenster im Giebel */
      const fz0 = 9.6, fw = 1.0, fh = 1.25, fx = ax(-fw / 2), fy = Y(fz0 + fh);
      g.fillStyle = rgb(ss); g.beginPath(); g.moveTo(fx - 0.14, Y(fz0 - 0.08)); g.lineTo(fx - 0.14, fy + fw / 2); g.arc(ax(0), fy + fw / 2, fw / 2 + 0.14, Math.PI, 0); g.lineTo(fx + fw + 0.14, Y(fz0 - 0.08)); g.closePath(); g.fill();
      rausch(g, fx - 0.2, fy - 0.2, fw + 0.4, fh + 0.4, 0.7, 0.2, 5, 3);
      g.save(); g.beginPath(); g.moveTo(fx, Y(fz0)); g.lineTo(fx, fy + fw / 2); g.arc(ax(0), fy + fw / 2, fw / 2, Math.PI, 0); g.lineTo(fx + fw, Y(fz0)); g.closePath(); g.clip();
      if (Z.fensterOG) {
        oeffnung(g, F, S, Z, fx, fy, fw, fh, true, { sprossen: [1, 2], fluegel: 2, rahmenBreite: 0.06, vorhang: false });
        g.strokeStyle = "#f3f0e8"; g.lineWidth = 0.05; g.beginPath(); g.arc(ax(0), fy + fw / 2, fw / 2 - 0.03, Math.PI, 0); g.stroke();
        g.beginPath(); g.moveTo(fx, fy + fw / 2); g.lineTo(fx + fw, fy + fw / 2); g.stroke();
      } else { g.fillStyle = "rgb(34,28,26)"; g.fillRect(fx, fy, fw, fh); }
      g.restore();
      sohlbank(g, F, S, fx, Y(fz0), fw, false);
      /* Jahreszahl im Scheitel */
      g.fillStyle = rgb(hell(ss, 0.05)); PI.rundRechteck(g, ax(-0.3), Y(11.95), 0.6, 0.26, 0.06); g.fill();
      if (F.px > 22) { g.fillStyle = "rgb(70,46,32)"; g.font = "bold 0.15px 'DejaVu Serif', serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(S.jahrzahl, ax(0), Y(11.82)); }
      /* Jugendstil-Ranke seitlich */
      if (F.px > 14) {
        g.strokeStyle = rgb(hell(S.putz, -0.2)); g.lineWidth = 0.035;
        for (const s of [-1, 1]) { g.beginPath(); g.moveTo(ax(s * 0.72), Y(9.55)); g.bezierCurveTo(ax(s * 0.9), Y(10.3), ax(s * 1.3), Y(10.1), ax(s * 1.15), Y(9.75)); g.stroke(); g.beginPath(); g.arc(ax(s * 1.15), Y(9.82), 0.07, 0, TAU); g.stroke(); }
      }
      if (S.winter && Z.schnee > 0 && Z.fensterOG) { schneeKante(g, ax(-1.72), ax(1.72), Y(bz1), 0.05 * Z.schnee, F, 51); schneeKante(g, fx - 0.18, fx + fw + 0.18, Y(fz0), 0.045 * Z.schnee, F, 52); }
    };
  }

  /* =====================================================================
     GAUBEN (Mansardgauben mit Dreiecksgiebel)
     ===================================================================== */
  const GAUBEN = [
    { s: "S", a: -4.3 }, { s: "S", a: -2.95 }, { s: "S", a: 2.95 }, { s: "S", a: 4.3 },
    { s: "N", a: -4.2 }, { s: "N", a: -2.1 }, { s: "N", a: 0 }, { s: "N", a: 2.1 }, { s: "N", a: 4.2 },
    { s: "O", a: -1.3 }, { s: "W", a: -1.3 }
  ];
  function gaubeRahmen(G) {
    /* e = nach außen, t = von außen gesehen nach rechts, b = Grundlinie */
    if (G.s === "S") return { e: [0, 1, 0], t: [1, 0, 0], b: [G.a, MY1, 0] };
    if (G.s === "N") return { e: [0, -1, 0], t: [-1, 0, 0], b: [-G.a, MY0, 0] };
    if (G.s === "O") return { e: [1, 0, 0], t: [0, -1, 0], b: [MX1, G.a, 0] };
    return { e: [-1, 0, 0], t: [0, 1, 0], b: [MX0, G.a, 0] };
  }
  function gaubeBauen(M, S, Z, G, i) {
    const R = gaubeRahmen(G);
    const P = (a, d, z) => [R.b[0] + R.t[0] * a + R.e[0] * d, R.b[1] + R.t[1] * a + R.e[1] * d, z];
    const hw = 0.52, dF = -0.08, zU = ZG + 0.08 / SL_U + 0.02, zT = 10.12, zFi = 10.58, ue = 0.06;
    const pitch = (zFi - zT) / (hw + ue);
    const dS = (z) => -ddUnten(z);
    const occ = DACH_OCC.concat([ZWERCH.w, ZWERCH.o]);
    const mal = (m) => { const f = (g, F) => { verdecken(g, F, S.B, occ); m(g, F); lichtAuf(g, F, 0); }; f.selbstLicht = true; return f; };
    const zEa = zT - ue * pitch;
    M.teil("gaube" + i, { ebene: 3, mitte: P(0, -0.2, 9.8) });
    /* Front mit Dreiecksgiebel */
    const front = [P(-hw, dF, zU), P(hw, dF, zU), P(hw, dF, zT), P(0, dF, zFi), P(-hw, dF, zT)];
    const ff = poly3(M, front, mal(gaubeFrontMaler(S, Z, i)), { n: R.e, name: "gaube-front" + i });
    ff.gz = [zU, zFi];
    /* Wangen (Schiefer) */
    for (const s of [-1, 1]) {
      const pts = [P(s * hw, dF, zU), P(s * hw, dF, zT), P(s * hw, dS(zT), zT)];
      poly3(M, s > 0 ? pts : pts.reverse(), mal((g, F) => {
        if (Z.gauben < 2) { g.fillStyle = rgb(HOLZ_ROH); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); g.fillStyle = rgb(hell(HOLZ_ROH, -0.25)); for (let x = 0.12; x < F.w; x += 0.12) g.fillRect(x, 0, 0.01, F.h); return; }
        schiefer(g, -0.1, -0.1, F.w + 0.2, F.h + 0.2, F, { saat: 30 + i, reihe: 0.12, breite: 0.16 });
      }), { n: mul(R.t, s), name: "gaube-wange" + i + s });
    }
    /* Dach */
    for (const s of [-1, 1]) {
      const pts = [P(0, dF + 0.14, zFi), P(s * (hw + ue), dF + 0.14, zEa), P(s * (hw + ue), dS(zEa), zEa), P(0, dS(zFi), zFi)];
      poly3(M, s > 0 ? pts.slice().reverse() : pts, mal((g, F) => {
        if (Z.gauben < 2) { g.fillStyle = rgb(hell(HOLZ_ROH, 0.05)); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); g.fillStyle = rgb(hell(HOLZ_ROH, -0.2)); for (let y = 0.15; y < F.h; y += 0.15) g.fillRect(0, y, F.w, 0.012); return; }
        schiefer(g, -0.1, -0.1, F.w + 0.2, F.h + 0.2, F, { saat: 40 + i, reihe: 0.12, breite: 0.16 });
        if (S.winter && Z.schnee > 0) {
          PI.schneeDach(g, -0.1, 0, F.w + 0.2, F.h, F, { deck: Z.schnee, saat: i * 3 + (s > 0 ? 1 : 2) });
          g.fillStyle = "rgb(246,249,253)"; g.beginPath(); g.moveTo(-0.1, F.h + 0.02); for (let x = -0.1; x <= F.w + 0.1; x += 0.1) g.lineTo(x, F.h - 0.06 - 0.03 * Math.sin(x * 9 + i)); g.lineTo(F.w + 0.1, F.h + 0.05); g.closePath(); g.fill();
        }
        /* Firstblech und Traufbrett */
        g.fillStyle = rgb(hell(ZINK, S.winter && Z.schnee > 0 ? 0.45 : 0)); g.fillRect(-0.1, -0.02, F.w + 0.2, 0.05);
        g.fillStyle = "rgb(58,50,46)"; g.fillRect(-0.1, F.h - 0.045, F.w + 0.2, 0.05);
      }), { n: add(mul(R.t, s), [0, 0, 1.2]), name: "gaube-dach" + i + s, dach: true });
    }
  }
  function gaubeFrontMaler(S, Z, i) {
    return function (g, F) {
      const w = F.w, h = F.h, ss = S.sandstein;
      /* h = zFi − zU; Traufe bei zT → y = zFi − zT */
      const yT = 10.58 - 10.12;
      if (Z.gauben < 2) { g.fillStyle = rgb(HOLZ_ROH); g.fillRect(-0.1, -0.1, w + 0.2, h + 0.2); g.fillStyle = rgb(hell(HOLZ_ROH, -0.25)); g.fillRect(0.08, yT + 0.1, 0.1, h); g.fillRect(w - 0.18, yT + 0.1, 0.1, h); g.fillRect(0, yT, w, 0.08); return; }
      putz(g, -0.1, -0.1, w + 0.2, h + 0.2, F, S.putz, 20 + i);
      /* Giebeldreieck mit Sandsteinrand */
      g.strokeStyle = rgb(ss); g.lineWidth = 0.1;
      g.beginPath(); g.moveTo(0, yT); g.lineTo(w / 2, 0); g.lineTo(w, yT); g.closePath(); g.stroke();
      g.fillStyle = rgb(hell(ss, 0.1)); g.fillRect(-0.05, yT - 0.04, w + 0.1, 0.1);
      if (F.px > 16) { g.fillStyle = rgb(hell(S.putz, -0.12)); g.beginPath(); g.arc(w / 2, yT * 0.55, 0.06, 0, TAU); g.fill(); }
      /* Fenster */
      const fw = 0.66, fh = 0.95, fx = (w - fw) / 2, fy = yT + 0.2;
      g.fillStyle = rgb(ss); g.fillRect(fx - 0.08, fy - 0.08, fw + 0.16, fh + 0.12);
      rausch(g, fx - 0.08, fy - 0.08, fw + 0.16, fh + 0.16, 0.6, 0.2, i, 3);
      oeffnung(g, F, S, Z, fx, fy, fw, fh, Z.fensterOG, { sprossen: [1, 2], fluegel: 2, rahmenBreite: 0.055 });
      sohlbank(g, F, S, fx + 0.05, fy + fh, fw - 0.1, false);
      if (S.winter && Z.schnee > 0 && Z.fensterOG) schneeKante(g, fx - 0.1, fx + fw + 0.1, fy + fh, 0.04, F, i);
    };
  }
  function gaubeLicht(S, Z, i) {
    return function (g, F) {
      if (!Z.licht) return;
      const w = F.w, yT = 10.58 - 10.12, fw = 0.66, fh = 0.95;
      const an = zufall(S.saat * 7 + i * 13)() < 0.4 ? 1 : 0;
      PI.fensterLicht(g, (w - fw) / 2, yT + 0.2, fw, fh, F, { an: an, sprossen: [1, 2], fluegel: 2, rahmenBreite: 0.055 });
    };
  }

  /* =====================================================================
     SCHORNSTEINE
     ===================================================================== */
  const KAMINE = [[-1.6, YM], [1.6, YM]];
  function kaminBauen(M, S, Z) {
    if (Z.kamin <= 0) return;
    const hk = 13.25, b = 0.6, t = 0.85;
    for (let i = 0; i < KAMINE.length; i++) {
      const [cx, cy] = KAMINE[i];
      const zo = 11.5 + (hk - 11.5) * Z.kamin;
      M.teil("kamin" + i, { ebene: 3, mitte: [cx, cy, 12.6] });
      const mal0 = (g, F) => {
        ziegel(g, -0.1, -0.1, F.w + 0.2, F.h + 0.2, F, { saat: 55 + i, farbe: [150, 70, 50], fuge: [170, 160, 150] });
        if (Z.kamin >= 1) {
          /* Kopf: Sandsteinplatte, darunter Rußspuren */
          sandstein(g, -0.1, -0.1, F.w + 0.2, 0.16, F, hell(S.sandstein, 0.05), { saat: 3 });
          g.fillStyle = "rgba(30,26,26,0.35)"; g.fillRect(-0.1, 0.16, F.w + 0.2, 0.25);
          g.fillStyle = "rgb(60,56,54)"; g.fillRect(-0.1, 0.4, F.w + 0.2, 0.05);
        }
      };
      const mal = Z.dachFertig ? (g, F) => { verdecken(g, F, S.B, DACH_OCC); mal0(g, F); lichtAuf(g, F, 0); } : mal0;
      mal.selbstLicht = Z.dachFertig;
      const x0 = cx - b / 2, x1 = cx + b / 2, y0 = cy - t / 2, y1 = cy + t / 2, zu = 11.4;
      const w1 = wand(M, [x0, y1], [x1, y1], zu, zo, mal, { name: "ks" + i, keinAo: true });
      const w2 = wand(M, [x1, y1], [x1, y0], zu, zo, mal, { name: "ko" + i, keinAo: true });
      const w3 = wand(M, [x1, y0], [x0, y0], zu, zo, mal, { name: "kn" + i, keinAo: true });
      const w4 = wand(M, [x0, y0], [x0, y1], zu, zo, mal, { name: "kw" + i, keinAo: true });
      void w1; void w2; void w3; void w4;
      if (Z.kamin >= 1) {
        poly3(M, [[x0, y0, zo], [x1, y0, zo], [x1, y1, zo], [x0, y1, zo]], (g, F) => {
          g.fillStyle = rgb(hell(S.sandstein, 0.1)); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
          g.fillStyle = "rgb(22,20,20)"; g.fillRect(0.12, 0.14, F.w - 0.24, (F.h - 0.36) / 2); g.fillRect(0.12, F.h / 2 + 0.04, F.w - 0.24, (F.h - 0.36) / 2);
          if (S.winter && Z.schnee > 0) { g.fillStyle = "rgba(246,249,253,0.9)"; g.fillRect(-0.1, -0.1, F.w + 0.2, 0.18); g.fillRect(-0.1, F.h - 0.1, F.w + 0.2, 0.2); }
        }, { n: [0, 0, 1], name: "kopf" + i });
      }
    }
  }

  /* =====================================================================
     VORDACH MIT SÄULEN UND SCHILD, TREPPE
     ===================================================================== */
  function treppeBauen(M, S, Z) {
    M.teil("treppe", { mitte: [0, 3.0, 0.4] });
    const ss = hell(S.sandstein, 0.05);
    const stufe = (g, F) => {
      sandstein(g, -0.1, -0.1, F.w + 0.2, F.h + 0.2, F, ss, { saat: 140, fugen: 0.8 });
      g.fillStyle = rgb(hell(ss, 0.2)); g.fillRect(-0.1, -0.1, F.w + 0.2, 0.12);
      if (S.winter && Z.schnee > 0 && F.flaeche.n2 > 0.5) { g.fillStyle = "rgba(244,247,252,0.7)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); }
    };
    const yF = RY1, x0 = -TR_B, x1 = TR_B;
    /* Seitenwangen als Treppenprofil */
    const prof = [[0, 0]];
    for (let i = 0; i < TR_N; i++) { const y = (TR_N - i) * TR_T; prof.push([y, i * TR_H], [y, (i + 1) * TR_H]); }
    prof.push([0, TR_N * TR_H]);
    poly3(M, prof.map((p) => [x1, yF + p[0], p[1]]), stufe, { n: [1, 0, 0], name: "tr-o" });
    poly3(M, prof.map((p) => [x0, yF + p[0], p[1]]), stufe, { n: [-1, 0, 0], name: "tr-w" });
    for (let i = 0; i < TR_N; i++) {
      const y = yF + (TR_N - i) * TR_T, z0 = i * TR_H, z1 = (i + 1) * TR_H;
      wand(M, [x0, y], [x1, y], z0, z1, stufe, { name: "tr-s" + i, ao: i === 0 });
      const f = poly3(M, [[x0, y, z1], [x1, y, z1], [x1, y - TR_T, z1], [x0, y - TR_T, z1]], stufe, { n: [0, 0, 1], name: "tr-t" + i });
      f.n2 = 1;
    }
  }
  function saeuleFigur(S, Z) {
    return function (g, s, F) {
      const k = ST.KZ * s, hoch = VZV - VBL;
      const bas = 0.16 * s, schaft = 0.075 * s;
      const L = F.schatten ? null : ST.lichtFaktor([0, 0, 1], F.Z, 0, F.jahr);
      const c = (col, a) => F.schatten ? "#000" : rgb([col[0] * L[0], col[1] * L[1], col[2] * L[2]], a);
      const zyl = (x0, x1, y0, y1, col) => {
        if (F.schatten) { g.fillStyle = "#000"; g.fillRect(x0, y0, x1 - x0, y1 - y0); return; }
        const gr = g.createLinearGradient(x0, 0, x1, 0);
        gr.addColorStop(0, c(hell(col, 0.25))); gr.addColorStop(0.35, c(hell(col, 0.1))); gr.addColorStop(0.75, c(hell(col, -0.3))); gr.addColorStop(1, c(hell(col, -0.45)));
        g.fillStyle = gr; g.fillRect(x0, y0, x1 - x0, y1 - y0);
      };
      /* Sockel aus Sandstein */
      zyl(-bas * 1.1, bas * 1.1, -0.45 * k, 0, S.sandstein);
      /* Basis, Schaft mit Kanneluren, Kapitell mit Blattkranz */
      zyl(-bas * 0.8, bas * 0.8, -0.62 * k, -0.45 * k, EISEN);
      zyl(-schaft, schaft, -(hoch - 0.35) * k, -0.62 * k, EISEN);
      if (!F.schatten && s > 25) { g.fillStyle = c(hell(EISEN, -0.5), 0.5); for (let i = -2; i <= 2; i++) g.fillRect(i * schaft * 0.38 - 0.5, -(hoch - 0.4) * k, 1, (hoch - 1.05) * k); }
      zyl(-schaft * 1.3, schaft * 1.3, -(hoch - 0.3) * k, -(hoch - 0.36) * k, EISEN);
      if (F.schatten) { g.fillStyle = "#000"; g.beginPath(); g.moveTo(-schaft, -(hoch - 0.3) * k); g.lineTo(-bas, -hoch * k); g.lineTo(bas, -hoch * k); g.lineTo(schaft, -(hoch - 0.3) * k); g.fill(); return; }
      const gr = g.createLinearGradient(-bas, 0, bas, 0); gr.addColorStop(0, c(hell(EISEN, 0.25))); gr.addColorStop(1, c(hell(EISEN, -0.4)));
      g.fillStyle = gr; g.beginPath(); g.moveTo(-schaft, -(hoch - 0.3) * k); g.quadraticCurveTo(-schaft * 1.2, -(hoch - 0.08) * k, -bas, -hoch * k); g.lineTo(bas, -hoch * k); g.quadraticCurveTo(schaft * 1.2, -(hoch - 0.08) * k, schaft, -(hoch - 0.3) * k); g.closePath(); g.fill();
      if (S.winter && Z.schnee > 0) { g.fillStyle = c([246, 249, 253]); g.beginPath(); g.ellipse(0, -0.45 * k, bas * 1.05, bas * 0.35, 0, Math.PI, 0); g.fill(); }
    };
  }
  function vordachBauen(M, S, Z) {
    if (Z.saeulen) {
      for (let i = 0; i < 2; i++) {
        M.teil("saeule" + i, { mitte: [SAEULEN[i][0], SAEULEN[i][1], 1.8] });
        M.figur({ x: SAEULEN[i][0], y: SAEULEN[i][1], z: 0, breite: 0.5, hoehe: VZV - VBL, malen: saeuleFigur(S, Z) });
      }
    }
    if (!Z.vordach) return;
    M.teil("vordach", { mitte: [0, 4.5, 5.2] });
    const glas = (g, F) => {
      const L = belichter(F, 0.03);
      const w = F.w, h = F.h;
      /* Drahtglas: halb durchsichtig, spiegelt den Himmel */
      const gl = g.createLinearGradient(0, 0, w * 0.3, h);
      gl.addColorStop(0, L([170, 196, 214], 0.62)); gl.addColorStop(1, L([96, 120, 140], 0.55));
      g.fillStyle = gl; g.fillRect(-0.1, -0.1, w + 0.2, h + 0.2);
      /* T-Eisen von der Wand nach vorn und Querpfetten */
      g.fillStyle = L(hell(EISEN, 0.1));
      for (let x = 0; x <= w + 0.01; x += w / 8) g.fillRect(x - 0.025, 0, 0.05, h);
      g.fillRect(-0.1, h * 0.5 - 0.02, w + 0.2, 0.04);
      g.fillRect(-0.1, -0.1, w + 0.2, 0.14); g.fillRect(-0.1, h - 0.08, w + 0.2, 0.1);
      if (S.winter && Z.schnee > 0) {
        g.fillStyle = L([244, 247, 252], Z.schnee);
        g.fillRect(-0.1, -0.1, w + 0.2, h + 0.2);
        const rng = zufall(9);
        g.fillStyle = L([200, 214, 236], 0.35 * Z.schnee);
        for (let i = 0; i < 9; i++) { g.beginPath(); g.ellipse(rng() * w, rng() * h, 0.4 + rng() * 0.5, 0.08, 0, 0, TAU); g.fill(); }
        g.fillStyle = L([180, 196, 222], 0.3); for (let x = 0; x <= w + 0.01; x += w / 8) g.fillRect(x - 0.012, 0, 0.024, h);
      } else if (S.herbst) laub(g, 0, 0, w, h, 50, 3);
    };
    poly3(M, [[-VX, VY0, VZW], [VX, VY0, VZW], [VX, VY1, VZV], [-VX, VY1, VZV]], glas, { n: [0, 0.1, 1], name: "vd-glas", keinLicht: true });
    /* Stirnblende mit Lambrequin (ausgesägte Bogen) */
    const blende = (g, F) => {
      const w = F.w, h = F.h;
      g.fillStyle = rgb(EISEN); g.fillRect(-0.1, -0.1, w + 0.2, h + 0.2);
      g.fillStyle = rgb(hell(EISEN, 0.25)); g.fillRect(-0.1, 0, w + 0.2, 0.04);
      g.fillStyle = rgb(hell(EISEN, -0.35)); g.fillRect(-0.1, 0.13, w + 0.2, 0.025);
      if (F.px > 12) {
        g.strokeStyle = "rgb(186,150,78)"; g.lineWidth = 0.018;
        for (let x = 0.2; x < w - 0.1; x += 0.4) { g.beginPath(); g.moveTo(x, 0.2); g.bezierCurveTo(x + 0.1, 0.06, x + 0.3, 0.3, x + 0.4, 0.2); g.stroke(); }
      }
      if (S.winter && Z.schnee > 0) { g.fillStyle = "rgb(246,249,253)"; g.fillRect(-0.1, -0.1, w + 0.2, 0.07); PI.eiszapfen(g, 0.1, w - 0.1, h - 0.05, F, { laenge: 0.18, saat: 4 }); }
    };
    const bogen = (w, h) => { const U = [[0, 0], [w, 0]]; const n = 12; for (let i = n; i >= 0; i--) { const x = w * i / n; U.push([x, h - 0.08]); if (i > 0) U.push([x - w / n / 2, h]); } return U; };
    M.flaeche({ name: "vd-front", o: [-VX, VY1, VZV], u: [1, 0, 0], v: [0, 0, -1], w: 2 * VX, h: VBL, umriss: bogen(2 * VX, VBL), malen: blende, keinAo: true });
    for (const s of [-1, 1]) {
      const pts = [[s * VX, VY1, VZV], [s * VX, VY0, VZW], [s * VX, VY0, VZW - VBL], [s * VX, VY1, VZV - VBL]];
      poly3(M, s > 0 ? pts : pts.slice().reverse(), blende, { n: [s, 0, 0], name: "vd-seite" + s, keinAo: true });
    }
    /* Schild mit dem roten Kreuz: aufgesetzt auf die Stirn */
    if (Z.schild) {
      const r = 0.42, cz = VZV + r + 0.1, yS = VY1 + 0.03;
      const kreis = [];
      for (let i = 0; i < 28; i++) { const a = -i / 28 * TAU; kreis.push([Math.cos(a) * r, yS, cz + Math.sin(a) * r]); }
      poly3(M, kreis.map((p) => [p[0], p[1], p[2]]), (g, F) => {
        const w = F.w, h = F.h, cx = w / 2, cy = h / 2;
        g.fillStyle = "rgb(30,40,36)"; g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.fill();
        const gr = g.createRadialGradient(cx - 0.12, cy - 0.12, 0.05, cx, cy, r);
        gr.addColorStop(0, "rgb(252,252,250)"); gr.addColorStop(1, "rgb(226,228,226)");
        g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, r - 0.045, 0, TAU); g.fill();
        g.strokeStyle = "rgb(190,160,90)"; g.lineWidth = 0.015; g.beginPath(); g.arc(cx, cy, r - 0.07, 0, TAU); g.stroke();
        const a = 0.1, b = 0.3;
        g.fillStyle = "rgb(200,24,32)";
        g.fillRect(cx - a, cy - b, 2 * a, 2 * b); g.fillRect(cx - b, cy - a, 2 * b, 2 * a);
        g.fillStyle = "rgba(255,255,255,0.18)"; g.beginPath(); g.ellipse(cx - 0.1, cy - 0.16, 0.2, 0.08, -0.5, 0, TAU); g.fill();
        if (S.winter && Z.schnee > 0) schneeKante(g, cx - 0.3, cx + 0.3, cy - r + 0.05, 0.04, F, 3);
      }, { n: [0, 1, 0], name: "schild", keinAo: true, leuchten: (g, F) => {
        if (!Z.licht) return;
        const w = F.w, h = F.h;
        g.fillStyle = "rgba(255,236,210," + (0.35 * F.nacht) + ")"; g.beginPath(); g.arc(w / 2, h / 2, r - 0.05, 0, TAU); g.fill();
        g.fillStyle = "rgba(255,60,60," + (0.45 * F.nacht) + ")"; g.fillRect(w / 2 - 0.1, h / 2 - 0.3, 0.2, 0.6); g.fillRect(w / 2 - 0.3, h / 2 - 0.1, 0.6, 0.2);
        F.leuchtPunkt(w / 2, h / 2, 0.9, "255,220,200", 0.35);
      } });
      poly3(M, kreis.map((p) => [p[0], p[1] - 0.02, p[2]]).reverse(), "rgb(40,48,44)", { n: [0, -1, 0], name: "schild-hinten", keinAo: true });
      /* Halter */
      wand(M, [-0.03, yS - 0.01], [0.03, yS - 0.01], VZV, cz - r + 0.02, "rgb(36,44,40)", { name: "schild-halter", keinAo: true });
    }
  }

  /* =====================================================================
     VORPLATZ, STELLPLATZ, LATERNE, KÜBEL
     ===================================================================== */
  function hofBauen(M, S, Z) {
    M.teil("hof", { ebene: -1, mitte: [0, 3.5, 0], schatten: false });
    const x0 = -6.0, x1 = 6.0, y0 = BY1, y1 = 5.0;
    poly3(M, [[x0, y0, 0.012], [x1, y0, 0.012], [x1, y1, 0.012], [x0, y1, 0.012]], (g, F) => {
      const w = F.w, h = F.h, rng = zufall(77);
      /* Granitkleinpflaster in Segmentbögen */
      g.fillStyle = "rgb(118,116,112)"; g.fillRect(-0.1, -0.1, w + 0.2, h + 0.2);
      if (F.px > 10) {
        const pm = pflasterMuster();
        const m = g.createPattern(pm.bild, "repeat");
        m.setTransform(new DOMMatrix([1 / pm.R, 0, 0, 1 / pm.R, 0, 0]));
        g.fillStyle = m; g.fillRect(-0.1, -0.1, w + 0.2, h + 0.2);
      }
      void rng;
      rausch(g, 0, 0, w, h, 2, 0.25, 12, 3);
      /* Bordstein vorn */
      g.fillStyle = "rgb(170,168,160)"; g.fillRect(-0.1, h - 0.16, w + 0.2, 0.16);
      g.fillStyle = "rgba(0,0,0,0.25)"; g.fillRect(-0.1, h - 0.02, w + 0.2, 0.02);
      /* Stellplatz Krankenwagen: weiße Linien, dezent */
      const sx0 = 2.45 - x0, sx1 = 5.75 - x0, sy0 = 2.75 - y0, sy1 = 4.75 - y0;
      g.strokeStyle = "rgba(236,234,226,0.8)"; g.lineWidth = 0.08;
      g.beginPath(); g.moveTo(sx0, sy1); g.lineTo(sx0, sy0); g.lineTo(sx1, sy0); g.lineTo(sx1, sy1); g.stroke();
      if (F.px > 14) {
        g.save(); g.translate((sx0 + sx1) / 2, (sy0 + sy1) / 2 + 0.3); g.fillStyle = "rgba(236,234,226,0.75)";
        g.font = "bold 0.3px 'DejaVu Sans', sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("KRANKENWAGEN", 0, 0, 3.0); g.restore();
      }
      if (S.winter) {
        /* Schnee, der Weg zur Treppe und der Stellplatz sind geräumt */
        const sn = g.createLinearGradient(0, 0, 0, h); sn.addColorStop(0, "rgba(242,246,252,0.95)"); sn.addColorStop(1, "rgba(236,242,250,0.95)");
        g.save();
        g.beginPath(); g.rect(-0.1, -0.1, w + 0.2, h + 0.2);
        g.moveTo(-x0 - 1.3, 3.4 - y0); g.lineTo(-x0 + 1.3, 3.4 - y0); g.lineTo(-x0 + 1.6, h + 0.1); g.lineTo(-x0 - 1.6, h + 0.1); g.closePath();
        g.rect(sx0 - 0.1, sy0 - 0.1, sx1 - sx0 + 0.2, h - sy0 + 0.2);
        g.clip("evenodd");
        g.fillStyle = sn; g.fillRect(-0.1, -0.1, w + 0.2, h + 0.2);
        rausch(g, 0, 0, w, h, 1.5, 0.08, 4, 3);
        g.restore();
        /* Schneewälle am Rand der geräumten Flächen */
        g.fillStyle = "rgba(250,252,255,0.95)";
        for (const x of [-x0 - 1.45, -x0 + 1.45, sx0 - 0.2, sx1 + 0.2]) { g.beginPath(); g.ellipse(x, h * 0.7, 0.14, h * 0.32, 0, 0, TAU); g.fill(); }
        g.fillStyle = "rgba(200,210,226,0.35)"; g.fillRect(-x0 - 1.3, 3.4 - y0, 2.6, h);
      } else if (S.herbst) laub(g, 0, 0, w, h, 120, 21);
    }, { n: [0, 0, 1], name: "hof", keinAo: true });
    if (!Z.ausstattung) return;
    /* Schild „Krankenwagen" */
    M.teil("stellschild", { mitte: [5.85, 4.8, 1] });
    M.figur({ x: 5.85, y: 4.8, z: 0, breite: 0.7, hoehe: 2.3, malen: (g, s, F) => {
      const k = ST.KZ * s;
      const L = F.schatten ? null : ST.lichtFaktor([0, 0.7, 0.7], F.Z, 0.05, F.jahr);
      const c = (col) => F.schatten ? "#000" : rgb([col[0] * L[0], col[1] * L[1], col[2] * L[2]]);
      g.fillStyle = c([90, 94, 98]); g.fillRect(-0.03 * s, -2.1 * k, 0.06 * s, 2.1 * k);
      const bw = 0.62 * s, bh = 0.42 * k * 1.1;
      g.fillStyle = c([240, 240, 236]); PI.rundRechteck(g, -bw / 2, -2.25 * k, bw, bh, 0.04 * s); g.fill();
      if (F.schatten) return;
      g.fillStyle = c([28, 72, 150]); PI.rundRechteck(g, -bw / 2 + 0.03 * s, -2.25 * k + 0.03 * s, bw - 0.06 * s, bh - 0.06 * s, 0.03 * s); g.fill();
      g.fillStyle = c([245, 245, 245]); g.fillRect(-bw / 2 + 0.08 * s, -2.25 * k + 0.07 * s, 0.14 * s, 0.14 * s);
      g.fillStyle = c([200, 30, 36]); g.fillRect(-bw / 2 + 0.135 * s, -2.25 * k + 0.08 * s, 0.03 * s, 0.12 * s); g.fillRect(-bw / 2 + 0.09 * s, -2.25 * k + 0.125 * s, 0.12 * s, 0.03 * s);
      if (s > 30) {
        g.fillStyle = c([245, 245, 245]); g.font = "bold " + (0.085 * s).toFixed(1) + "px 'DejaVu Sans', sans-serif"; g.textAlign = "left"; g.textBaseline = "middle";
        g.fillText("Kranken-", -bw / 2 + 0.25 * s, -2.25 * k + bh * 0.35); g.fillText("wagen", -bw / 2 + 0.25 * s, -2.25 * k + bh * 0.68);
      }
      if (F.jahr === "winter") { g.fillStyle = c([246, 249, 253]); g.fillRect(-bw / 2, -2.25 * k - 0.04 * s, bw, 0.05 * s); }
    } });
    /* Laterne am Vorplatz */
    M.teil("laterne", { mitte: [-5.6, 4.6, 1.5] });
    M.figur({ x: -5.6, y: 4.6, z: 0, breite: 0.6, hoehe: 3.6, malen: laterneFigur(S) });
    if (Z.licht) { M.licht(-5.6, 4.6, 3.3, 3.2, "255,206,140", 0.9); M.bodenlicht(-5.6, 4.6, 3.0, "255,200,130", 0.7); }
    /* Kübel mit Buchs beidseits der Treppe */
    for (const s of [-1, 1]) {
      M.teil("kuebel" + s, { mitte: [s * 1.45, 4.1, 0.5] });
      M.figur({ x: s * 1.42, y: 3.9, z: 0, breite: 0.7, hoehe: 1.3, malen: kuebelFigur(S) });
    }
  }
  /* Granitkleinpflaster als Muster (1,2 × 1,2 m, einmal gebacken) */
  let PFLASTER = null;
  function pflasterMuster() {
    if (PFLASTER) return PFLASTER;
    const R = 100, B = 1.2, c = document.createElement("canvas");
    c.width = c.height = Math.round(B * R);
    const g = c.getContext("2d", { willReadFrequently: true }), rng = zufall(77);
    g.scale(R, R);
    g.fillStyle = "rgb(104,102,98)"; g.fillRect(0, 0, B, B);
    const st = 0.1;
    for (let r = 0; r < 12; r++) for (let k = -1; k < 13; k++) {
      const x = k * st + (r % 2) * st / 2, y = r * st;
      const col = streu([150, 146, 140], rng, 0.12);
      const gr = g.createLinearGradient(0, y, 0, y + st);
      gr.addColorStop(0, rgb(hell(col, 0.1))); gr.addColorStop(1, rgb(hell(col, -0.12)));
      g.fillStyle = gr; PI.rundRechteck(g, x + 0.008, y + 0.008, st - 0.016, st - 0.016, 0.015); g.fill();
    }
    PFLASTER = { bild: c, R: R };
    return PFLASTER;
  }
  function laterneFigur(S) {
    return function (g, s, F) {
      const k = ST.KZ * s;
      const L = F.schatten ? null : ST.lichtFaktor([0, 0, 1], F.Z, 0, F.jahr);
      const c = (col, a) => F.schatten ? "#000" : rgb([col[0] * L[0], col[1] * L[1], col[2] * L[2]], a);
      g.fillStyle = c([34, 42, 38]);
      g.beginPath(); g.moveTo(-0.14 * s, 0); g.lineTo(0.14 * s, 0); g.lineTo(0.06 * s, -0.5 * k); g.lineTo(0.035 * s, -3.0 * k); g.lineTo(-0.035 * s, -3.0 * k); g.lineTo(-0.06 * s, -0.5 * k); g.closePath(); g.fill();
      /* Leuchte */
      g.beginPath(); g.moveTo(-0.08 * s, -3.0 * k); g.lineTo(0.08 * s, -3.0 * k); g.lineTo(0.16 * s, -3.4 * k); g.lineTo(-0.16 * s, -3.4 * k); g.closePath();
      if (F.schatten) { g.fill(); return; }
      const an = F.nacht > 0.05;
      g.fillStyle = an ? "rgba(255,214,150," + (0.6 + 0.4 * F.nacht) + ")" : c([150, 164, 170]); g.fill();
      g.fillStyle = c([30, 36, 34]); g.beginPath(); g.moveTo(-0.2 * s, -3.4 * k); g.lineTo(0.2 * s, -3.4 * k); g.lineTo(0, -3.62 * k); g.closePath(); g.fill();
      if (F.jahr === "winter") { g.fillStyle = c([246, 249, 253]); g.beginPath(); g.moveTo(-0.17 * s, -3.42 * k); g.lineTo(0.17 * s, -3.42 * k); g.lineTo(0, -3.58 * k); g.closePath(); g.fill(); }
      if (an && F.leuchtPunkt) F.leuchtPunkt(0, -3.2 * k, 1.2 * s, "255,206,140", 0.6);
      void S;
    };
  }
  function kuebelFigur(S) {
    return function (g, s, F) {
      const k = ST.KZ * s;
      const L = F.schatten ? null : ST.lichtFaktor([0, 0, 1], F.Z, 0, F.jahr);
      const c = (col, a) => F.schatten ? "#000" : rgb([col[0] * L[0], col[1] * L[1], col[2] * L[2]], a);
      /* Sandsteinkübel */
      g.fillStyle = c(hell(S.sandstein, 0.05));
      g.beginPath(); g.moveTo(-0.22 * s, 0); g.lineTo(0.22 * s, 0); g.lineTo(0.28 * s, -0.5 * k); g.lineTo(-0.28 * s, -0.5 * k); g.closePath(); g.fill();
      if (F.schatten) { g.beginPath(); g.arc(0, -0.85 * k, 0.33 * s, 0, TAU); g.fill(); return; }
      g.fillStyle = c(hell(S.sandstein, -0.2)); g.fillRect(0.05 * s, -0.5 * k, 0.23 * s, 0.5 * k);
      g.fillStyle = c(hell(S.sandstein, 0.2)); g.fillRect(-0.3 * s, -0.56 * k, 0.6 * s, 0.07 * k);
      /* Buchskugel */
      const jahr = F.jahr, rng = zufall(5);
      const grund = jahr === "herbst" ? [70, 88, 40] : [44, 82, 44];
      const gr = g.createRadialGradient(-0.1 * s, -0.95 * k, 0.03 * s, 0, -0.85 * k, 0.34 * s);
      gr.addColorStop(0, c(hell(grund, 0.25))); gr.addColorStop(1, c(hell(grund, -0.35)));
      g.fillStyle = gr; g.beginPath(); g.arc(0, -0.85 * k, 0.32 * s, 0, TAU); g.fill();
      if (s > 20) for (let i = 0; i < 40; i++) { const a = rng() * TAU, r = Math.sqrt(rng()) * 0.3 * s; g.fillStyle = c(hell(grund, (rng() - 0.4) * 0.5)); g.beginPath(); g.arc(Math.cos(a) * r, -0.85 * k + Math.sin(a) * r, 0.03 * s, 0, TAU); g.fill(); }
      if (jahr === "fruehling" || jahr === "sommer") { for (let i = 0; i < 12; i++) { const a = rng() * TAU, r = Math.sqrt(rng()) * 0.28 * s; g.fillStyle = c(jahr === "sommer" ? [214, 40, 60] : [240, 220, 90]); g.beginPath(); g.arc(Math.cos(a) * r, -0.85 * k + Math.sin(a) * r * 0.8, 0.025 * s, 0, TAU); g.fill(); } }
      if (jahr === "winter") { g.fillStyle = c([246, 249, 253]); g.beginPath(); g.ellipse(0, -1.02 * k, 0.26 * s, 0.13 * s, 0, Math.PI, 0); g.fill(); }
    };
  }
  /* Kugel auf dem Giebelscheitel */
  function kugelFigur(S) {
    return function (g, s, F) {
      const r = 0.16 * s, k = ST.KZ * s;
      if (F.schatten) { g.fillStyle = "#000"; g.fillRect(-0.06 * s, -0.25 * k, 0.12 * s, 0.25 * k); g.beginPath(); g.arc(0, -0.25 * k - r, r, 0, TAU); g.fill(); return; }
      const L = ST.lichtFaktor([0, 0, 1], F.Z, 0, F.jahr);
      const c = (col) => rgb([col[0] * L[0], col[1] * L[1], col[2] * L[2]]);
      g.fillStyle = c(hell(S.sandstein, -0.1)); g.fillRect(-0.07 * s, -0.25 * k, 0.14 * s, 0.25 * k);
      const gr = g.createRadialGradient(-r * 0.4, -0.25 * k - r * 1.4, r * 0.1, 0, -0.25 * k - r, r);
      gr.addColorStop(0, c(hell(S.sandstein, 0.3))); gr.addColorStop(1, c(hell(S.sandstein, -0.35)));
      g.fillStyle = gr; g.beginPath(); g.arc(0, -0.25 * k - r, r, 0, TAU); g.fill();
      if (F.jahr === "winter") { g.fillStyle = c([246, 249, 253]); g.beginPath(); g.ellipse(0, -0.25 * k - r * 1.55, r * 0.8, r * 0.45, 0, Math.PI, 0); g.fill(); }
    };
  }
  /* Richtkrone auf dem First */
  function richtkroneFigur(g, s, F) {
    const k = ST.KZ * s;
    if (F.schatten) { g.fillStyle = "#000"; g.fillRect(-0.03 * s, -1.6 * k, 0.06 * s, 1.6 * k); g.beginPath(); g.ellipse(0, -1.5 * k, 0.35 * s, 0.3 * k, 0, 0, TAU); g.fill(); return; }
    const L = ST.lichtFaktor([0, 0, 1], F.Z, 0.05, F.jahr);
    const c = (col) => rgb([col[0] * L[0], col[1] * L[1], col[2] * L[2]]);
    g.fillStyle = c(HOLZ_ROH); g.fillRect(-0.03 * s, -1.6 * k, 0.06 * s, 1.6 * k);
    const rng = zufall(3);
    for (let i = 0; i < 60; i++) { const a = rng() * TAU, r = Math.sqrt(rng()); g.fillStyle = c(streu([40, 84, 44], rng, 0.3)); g.beginPath(); g.ellipse(Math.cos(a) * r * 0.3 * s, -1.5 * k + Math.sin(a) * r * 0.26 * k, 0.05 * s, 0.03 * s, a, 0, TAU); g.fill(); }
    const bunt = [[200, 30, 40], [240, 200, 40], [40, 90, 180], [250, 250, 250]];
    g.lineWidth = Math.max(1, 0.025 * s);
    for (let i = 0; i < 8; i++) { g.strokeStyle = c(bunt[i % 4]); const a = -0.3 + i * 0.1; g.beginPath(); g.moveTo(0, -1.3 * k); g.quadraticCurveTo(Math.cos(a) * 0.3 * s, -1.0 * k, (i - 3.5) * 0.06 * s, -0.75 * k); g.stroke(); }
  }

  /* =====================================================================
     DAS MODELL
     ===================================================================== */
  ST.modell("krankenhaus", {
    name: "Krankenhaus", gruppe: "Häuser", grund: [12, 10], hoehe: 13, bauzeit: 15 * 60,
    bauen(M, o) {
      const B = neuerBlick();
      M.teil("blick", { ebene: -90, schatten: false, mitte: [0, 0, 0] });
      M.figur({ x: 0, y: 0, z: 0, breite: 0.01, hoehe: 0.01, schatten: false, malen(g, s, F) { if (!F.schatten && F.gier != null) blickSetzen(B, F.gier); } });
      const bau = o.bau == null ? 1 : klemm(o.bau, 0, 1);
      const Z = zustand(bau);
      const saat = (o.saat == null ? 7 : o.saat) >>> 0;
      const jahr = o.jahr || "winter";
      const S = {
        B: B, saat: saat, winter: jahr === "winter", herbst: jahr === "herbst", sommer: jahr === "sommer" || jahr === "fruehling",
        putz: PUTZE[saat % PUTZE.length], sandstein: SANDSTEINE[(saat >> 2) % 2 === 0 ? 0 : (saat % 3 === 0 ? 2 : 1)],
        jahrzahl: String(1904 + (saat % 7))
      };
      /* Grube und Keller */
      if (Z.grubeT > 0.01 || bau < 0.25) {
        if (Z.grubeT > 0.01) grubeBauen(M, S, Z);
        if (Z.aushub > 0.02) {
          M.teil("aushub", { mitte: [-4.5, 5.2, 0.6] });
          M.figur({ x: -4.2, y: 4.9, z: 0, breite: 4.5, hoehe: 1.8, malen: aushubFigur(Z.aushub, S.winter) });
        }
      }
      if (Z.kellerZ != null && bau < 0.3) {
        M.teil("kellersohle", { ebene: -3, mitte: [0, 0, -2.1], schatten: false });
        kellerSohle(M, S, Z);
        const zk = Math.min(0, Z.kellerZ);
        mauerRing(M, S, Z, -Math.max(0.02, Math.min(TIEFE - 0.3, Z.grubeT)), zk, false, { mitInnen: true, innen0: -TIEFE + 0.3 });
      }
      /* Mauern über der Erde */
      if (Z.mauerZ > 0.01) mauerRing(M, S, Z, 0, Z.mauerZ, Z.mauerZ >= ZW && bau >= 0.7, { mitInnen: bau < 0.7 });
      gesimsBauen(M, S, Z);
      /* Dach */
      if (bau >= 0.7) dachBauen(M, S, Z);
      if (Z.giebelZ > ZG || Z.stuhl > 0) zwerchBauen(M, S, Z);
      if (Z.gauben > 0) GAUBEN.forEach((G, i) => { gaubeBauen(M, S, Z, G, i); });
      kaminBauen(M, S, Z);
      if (Z.giebelZ >= GIEBEL_TOP - 0.01) {
        M.teil("kugel", { ebene: 3, mitte: [0, RY1 - 0.15, 12.6] });
        M.figur({ x: 0, y: RY1 - 0.15, z: GIEBEL_TOP - 0.02, breite: 0.4, hoehe: 0.6, malen: kugelFigur(S) });
      }
      if (Z.richt) {
        M.teil("richtkrone", { ebene: 4, mitte: [0, YM, ZF + 1] });
        M.figur({ x: 0, y: YM, z: ZF - 0.05, breite: 0.8, hoehe: 1.7, malen: richtkroneFigur });
      }
      /* Eingang */
      if (bau >= 0.3) treppeBauen(M, S, Z);
      vordachBauen(M, S, Z);
      if (Z.hof) hofBauen(M, S, Z);
      /* Licht und Rauch */
      if (Z.licht) {
        M.licht(0, 3.5, 3.4, 2.4, "255,204,140", 0.8);
        M.bodenlicht(0, 3.6, 2.6, "255,200,130", 0.9);
      }
      if (Z.fertig && (S.winter || jahr === "herbst")) for (const [kx, ky] of KAMINE) M.rauchAus(kx, ky, 13.4, S.winter ? 0.8 : 0.45);
      if (Z.fertig && !S.winter && jahr !== "herbst") M.rauchAus(KAMINE[1][0], KAMINE[1][1], 13.4, 0.25);
      /* Gaubenlicht: nachträglich anhängen (die Flächen stehen schon) */
      if (Z.licht) for (const t of M.teile) if (/^gaube\d+$/.test(t.name)) { const i = +t.name.slice(5); const f = t.flaechen.find((q) => q.name === "gaube-front" + i); if (f) f.leuchten = gaubeLicht(S, Z, i); }
      beschleunigen(M);
      if (Z.licht) for (const t of M.teile) if (t.name === "zwerch") { const f = t.flaechen.find((q) => q.name === "giebel"); if (f) f.leuchten = (g, F) => { const ax = (x) => x - F.flaeche.o[0], Y = (z) => GIEBEL_TOP - z; PI.fensterLicht(g, ax(-0.5), Y(10.85), 1.0, 1.25, F, { an: 1, sprossen: [1, 2], fluegel: 2 }); }; }
    }
  });

  function aushubFigur(k, winter) {
    return function (g, s, F) {
      const q = Math.cbrt(Math.max(0.05, k));
      const b = 2.1 * s * q, h = 1.4 * s * ST.KZ * q;
      g.beginPath(); g.moveTo(-b, 0); g.bezierCurveTo(-b * 0.6, -h * 0.95, b * 0.35, -h * 1.1, b, 0); g.closePath();
      if (F.schatten) { g.fillStyle = "#000"; g.fill(); return; }
      const lf = ST.lichtFaktor([0, 0, 1], F.Z, 0, F.jahr);
      const gr = g.createLinearGradient(-b, -h, b, 0);
      gr.addColorStop(0, rgb([150 * lf[0], 112 * lf[1], 76 * lf[2]])); gr.addColorStop(1, rgb([90 * lf[0], 64 * lf[1], 42 * lf[2]]));
      g.fillStyle = gr; g.fill();
      const rng = zufall(5);
      g.fillStyle = rgb([60 * lf[0], 44 * lf[1], 30 * lf[2]], 0.6);
      g.beginPath(); for (let i = 0; i < 50; i++) { const x = (rng() - 0.5) * b * 1.6, y = -rng() * h * 0.7, r = Math.max(0.6, s * 0.03); g.moveTo(x + r, y); g.arc(x, y, r, 0, TAU); } g.fill();
      if (winter) { g.fillStyle = rgb([244 * lf[0], 247 * lf[1], 252 * lf[2]], 0.9); g.beginPath(); g.moveTo(-b * 0.6, -h * 0.55); g.bezierCurveTo(-b * 0.3, -h * 1.0, b * 0.3, -h * 1.05, b * 0.6, -h * 0.5); g.bezierCurveTo(b * 0.2, -h * 0.7, -b * 0.2, -h * 0.72, -b * 0.6, -h * 0.55); g.fill(); }
    };
  }
})();
