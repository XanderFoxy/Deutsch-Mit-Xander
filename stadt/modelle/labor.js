/* =====================================================================
   LABOR — Physikalisches Laboratorium mit Sternwarte, um 1889
   ---------------------------------------------------------------------
   XANDER: „richtig filigran. Richtig schön ausarbeiten mit schönen
   Texturen" · „keine Comic Grafik … viel mehr am Realismus" · „ohne
   Pixelkanten und komische Vektorrückstände" · „Man soll das Fundament
   sehen beim Aufbauen" · „Du bist dein schlimmster Kritiker" · Stil
   „von Anno oder geiler", „trotzdem mit SVG Grafiken".

   VORBILD: Institutsbauten der Kaiserzeit (Physikalische Institute,
   kleine Universitätssternwarten um 1880–1900): zweigeschossiger
   Backsteinbau (roter Klinker im Kreuzverband, Bänder aus gelben
   Ziegeln) über einem Sockel aus gebossten Sandsteinquadern, Gurt- und
   Abdeckgesims aus Sandstein, Ecklisenen, Rundbogenfries unter der
   Attika, flaches Dach hinter der Brüstung. Unten große Werkstatt-
   fenster mit gusseisernen Sprossen unter Stichbögen, dahinter
   Glaskolben, Retorten und Instrumente; ein Fenster leuchtet nachts
   grünlich-blau. Auf dem Dach die Beobachtungskuppel: Tambour aus
   Backstein, Kuppel aus Kupfer mit Patina, offener Spalt mit dem
   Fernrohr. Dazu ein hoher Schornstein (Laborofen), der Wettermast mit
   Windfahne und Schalenkreuz-Anemometer, eine Wetterhütte und die
   Blitzableiter mit ihren Ableitungen. Über dem Portal die Tafel
   „LABORATORIUM", darüber eine Sonnenuhr.

   MASSE (Meter; Mitte des Grundrisses = 0,0,0; Eingang nach Süden, +y)
     Bau           9,0 × 6,2 m (x −4,5…4,5, y −3,6…2,6), Treppe bis 3,5
     Sockel 0,7 · Erdgeschoss bis 4,35 (Werkstatt, hohe Fenster) ·
     Gurtgesims bis 4,55 · Obergeschoss · Rundbogenfries 7,2–7,55 ·
     Dach 7,9 · Attika bis 8,5
     Kuppel        Tambour r 1,75 m, 1,3 m hoch; Kuppel r 1,85 m,
                   Scheitel 11,1 m, Blitzableiter bis 11,9 m
     Schornstein   bis 11,6 m · Wettermast bis 11,2 m
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
    for (const t of M.teile) for (const f of t.flaechen) if (typeof f.malen === "function" && !f.direkt && !f.malen.direkt) f.malen = aufCpu(f.malen);
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
  const BX0 = -4.5, BX1 = 4.5, BY0 = -3.6, BY1 = 2.6;
  const SOCKEL = 0.7, GURT0 = 4.35, GURT1 = 4.55, FRIES0 = 7.2, FRIES1 = 7.55, DACHZ = 7.9, ZW = 8.5;
  const DICKE = 0.45, TIEFE = 2.2;
  const PLAN = [[BX0, BY1], [BX1, BY1], [BX1, BY0], [BX0, BY0]];
  const INNEN = versatz(PLAN, -DICKE);
  const KUPPEL = { x: -0.9, y: -0.75, rt: 1.75, ht: 1.3, rd: 1.85, spalt: 62 };
  const KAMIN = { x: 3.2, y: -2.55, b: 0.7, z1: 11.6 };
  const MAST = [3.55, 1.55], HUETTE = [-3.05, 1.2];
  const TR_B = 1.0, TR_N = 3, TR_H = 0.18, TR_T = 0.3;
  const PORTAL_Z = TR_N * TR_H;
  const RY1 = BY1;

  /* =====================================================================
     FARBEN
     ===================================================================== */
  const KLINKER = [[150, 64, 46], [142, 58, 42], [158, 74, 52]];
  const FUGE = [196, 190, 178];
  const GELB = [212, 182, 126];
  const SANDSTEINE = [[194, 174, 138], [186, 164, 128], [200, 182, 146]];
  const PATINA = [96, 152, 130], KUPFER = [178, 104, 62];
  const EISEN = [40, 46, 48];
  const ZIEGEL_ROH = [150, 70, 50];
  const HOLZ_ROH = [182, 142, 98];
  const BETON = [168, 166, 158];
  const ZINK = [150, 156, 160];
  const PAPPE = [74, 74, 76];

  /* =====================================================================
     BAUZUSTAND
     XANDER: „Man soll das Fundament sehen beim Aufbauen … Schritt für
     Schritt, wie das nach 2 Minuten aussieht, nach 5 … 10 … 15 Minuten."
       0,00–0,07  Baugrube für den Keller, Aushub
       0,07–0,11  Streifenfundamente, Kellersohle
       0,11–0,19  Kellermauern, 0,19–0,24 verfüllen
       0,24–0,29  Sockel aus Sandsteinquadern, Kellerdecke
       0,29–0,46  Erdgeschoss (Klinker; Bögen, Sohlbänke, Bänder werden
                  mit vermauert), 0,46–0,48 Gurtgesims, 0,48 Decke
       0,50–0,63  Obergeschoss bis zum Rundbogenfries
       0,63–0,69  Fries und Attika, 0,69 Flachdach (Holzschalung, Pappe)
       0,69–0,80  Schornstein
       0,70–0,77  Tambour der Kuppel
       0,77–0,82  eisernes Kuppelgerippe (Rippen, Ringe)
       0,82–0,89  Kupferblech von unten nach oben, dann der Spalt
       0,90–0,93  Fenster, Portal, 0,95 Fernrohr und Wettermast,
                  0,96 Wetterhütte; Schnee wächst 0,9–0,98
     ===================================================================== */
  function zustand(bau) {
    const k = (a, b) => phase(bau, a, b);
    const Z = { bau: bau, fertig: bau >= 0.999, putzZ: 99 };
    Z.grubeT = bau < 0.24 ? TIEFE * glatt(k(0, 0.07)) * (1 - glatt(k(0.19, 0.24))) : 0;
    Z.aushub = bau < 0.19 ? glatt(k(0, 0.07)) : 1 - glatt(k(0.19, 0.25));
    Z.fundament = k(0.07, 0.11);
    Z.kellerZ = bau < 0.11 ? null : -TIEFE + 0.3 + (TIEFE - 0.3) * k(0.11, 0.19);
    let m = 0;
    if (bau >= 0.24) m = SOCKEL * k(0.24, 0.29);
    if (bau >= 0.29) m = SOCKEL + (GURT0 - SOCKEL) * k(0.29, 0.46);
    if (bau >= 0.46) m = GURT0 + (GURT1 - GURT0) * k(0.46, 0.48);
    if (bau >= 0.5) m = GURT1 + (FRIES1 - GURT1) * k(0.5, 0.63);
    if (bau >= 0.63) m = FRIES1 + (ZW - FRIES1) * k(0.63, 0.69);
    Z.mauerZ = m;
    Z.decke = bau < 0.29 ? null : bau < 0.5 ? (bau >= 0.48 ? GURT1 : SOCKEL) : (bau >= 0.69 ? null : GURT1);
    Z.dach = bau >= 0.69;
    Z.pappe = bau >= 0.74;
    Z.tambour = k(0.7, 0.77); Z.gerippe = k(0.77, 0.82); Z.blech = k(0.82, 0.89);
    Z.kamin = k(0.69, 0.8);
    Z.fensterOG = bau >= 0.9; Z.fensterEG = bau >= 0.92; Z.tuer = bau >= 0.93;
    Z.fernrohr = bau >= 0.95; Z.mast = bau >= 0.95; Z.huette = bau >= 0.96; Z.ausstattung = bau >= 0.97;
    Z.instrumente = bau >= 0.96;
    Z.schnee = Z.fertig ? 1 : k(0.9, 0.98);
    Z.licht = Z.fertig;
    return Z;
  }

  /* =====================================================================
     FASSADE (Backstein mit Sandstein)
     ===================================================================== */
  const EG = { w: 1.35, zs: 1.25, h: 2.45, stich: 0.2 }, OG = { w: 1.05, zs: 5.15, h: 1.75 };
  function wandMaler(S, Z, W) {
    return function (g, F) {
      const zTop = F.flaeche.zTop == null ? W.z1 : F.flaeche.zTop;
      g.save(); g.translate(0, zTop - W.z1);
      fassadeMalen(g, F, S, Z, W);
      g.restore();
    };
  }
  function fassadeMalen(g, F, S, Z, W) {
    const Y = (z) => W.z1 - z, L = W.L, ss = S.sandstein;
    ziegel(g, -0.1, -0.1, L + 0.2, Y(SOCKEL) + 0.1, F, { farbe: S.klinker, fuge: FUGE, saat: W.saat, ox: W.ox });
    /* Bänder aus gelben Ziegeln (drei Schichten) */
    for (const zb of [2.95, 6.3]) ziegel(g, -0.1, Y(zb + 0.231), L + 0.2, 0.231, F, { farbe: GELB, fuge: FUGE, saat: W.saat + 2, ox: W.ox });
    /* Sockel */
    bossen(g, -0.1, Y(SOCKEL), L + 0.2, SOCKEL + 0.1, F, ss, W.saat + 1);
    sandstein(g, -0.1, Y(SOCKEL + 0.1), L + 0.2, 0.1, F, hell(ss, 0.05), { saat: W.saat + 4 });
    g.fillStyle = rgb(hell(ss, 0.25)); g.fillRect(-0.1, Y(SOCKEL + 0.1), L + 0.2, 0.022);
    g.fillStyle = "rgba(40,20,20,0.35)"; g.fillRect(-0.1, Y(SOCKEL), L + 0.2, 0.03);
    /* Ecklisenen */
    lisene(g, F, S, 0.0, 0.46, Y);
    lisene(g, F, S, L - 0.46, L, Y);
    /* Gurtgesims */
    band(g, F, ss, -0.1, L + 0.2, Y(GURT1), GURT1 - GURT0, 0.12, W.saat + 6);
    /* Rundbogenfries, Abdeckband, Attika mit Blendfeldern, Abdeckplatte */
    rundbogenfries(g, F, S, L, Y);
    /* Öffnungen */
    for (const e of W.elemente || []) {
      if (e.art === "eg") fensterEG(g, F, S, Z, e, Y);
      else if (e.art === "og") fensterOG(g, F, S, Z, e, Y);
      else if (e.art === "keller") kellerFenster(g, F, S, Z, e, Y);
      else if (e.art === "portal") portal(g, F, S, Z, e, Y);
      else if (e.art === "sonnenuhr") sonnenuhr(g, F, S, Z, e, Y);
      else if (e.art === "blitz") ableitung(g, F, S, Z, e, Y);
    }
    if (W.ranke) ranke(g, F, S, Z, W, Y);
    if (S.winter && Z.schnee > 0 && Z.mauerZ >= ZW) {
      schneeKante(g, -0.1, L + 0.1, Y(SOCKEL + 0.1), 0.05 * Z.schnee, F, W.saat + 31);
      schneeKante(g, -0.1, L + 0.1, Y(GURT1), 0.045 * Z.schnee, F, W.saat + 32);
      schneeKante(g, -0.1, L + 0.1, Y(FRIES1 + 0.08), 0.035 * Z.schnee, F, W.saat + 33);
      schneeKante(g, -0.1, L + 0.1, Y(ZW), 0.08 * Z.schnee, F, W.saat + 34);
      PI.eiszapfen(g, 0.2, L - 0.2, Y(ZW - 0.1), F, { laenge: 0.25 * Z.schnee, saat: W.saat });
    }
  }
  function lisene(g, F, S, x0, x1, Y) {
    const sv = F.schatten ? F.schatten(0.07) : null;
    if (sv) { g.fillStyle = "rgba(30,14,14,0.32)"; if (sv[0] > 0) g.fillRect(x1, Y(FRIES0), Math.min(0.2, sv[0]), FRIES0 - SOCKEL - 0.1); else g.fillRect(x0 + sv[0], Y(FRIES0), Math.min(0.2, -sv[0]), FRIES0 - SOCKEL - 0.1); }
    g.fillStyle = "rgba(255,230,210,0.12)"; g.fillRect(x0, Y(FRIES0), x1 - x0, FRIES0 - SOCKEL - 0.1);
    g.fillStyle = "rgba(255,236,220,0.35)"; g.fillRect(x0, Y(FRIES0), 0.025, FRIES0 - SOCKEL - 0.1);
    g.fillStyle = "rgba(40,16,12,0.35)"; g.fillRect(x1 - 0.025, Y(FRIES0), 0.025, FRIES0 - SOCKEL - 0.1);
  }
  function rundbogenfries(g, F, S, L, Y) {
    const ss = S.sandstein;
    const n = Math.max(3, Math.round(L / 0.38)), ab = L / n;
    const zf = FRIES0 + 0.08, r = ab * 0.38;
    const sv = F.schatten ? F.schatten(0.08) : null;
    /* Blende unter jedem Bogen liegt zurück: Schatten */
    g.fillStyle = "rgba(40,14,10,0.34)";
    g.beginPath();
    for (let i = 0; i < n; i++) {
      const cx = ab * (i + 0.5), yb = Y(FRIES1 - 0.06 - r);
      g.moveTo(cx - r, Y(zf)); g.lineTo(cx - r, yb); g.arc(cx, yb, r, Math.PI, 0); g.lineTo(cx + r, Y(zf)); g.closePath();
    }
    g.fill();
    if (sv) {
      g.fillStyle = "rgba(30,10,10,0.25)";
      g.beginPath();
      for (let i = 0; i < n; i++) { const cx = ab * (i + 0.5), yb = Y(FRIES1 - 0.06 - r); g.moveTo(cx - r, yb + sv[1] * 0.5); g.arc(cx, yb + sv[1] * 0.5, r, Math.PI, 0); g.closePath(); }
      g.fill();
    }
    if (F.px > 8) {
      /* Bögen aus gelben Formsteinen, Konsolsteine an den Füßen */
      g.strokeStyle = rgb(GELB); g.lineWidth = 0.05;
      g.beginPath();
      for (let i = 0; i < n; i++) { const cx = ab * (i + 0.5), yb = Y(FRIES1 - 0.06 - r); g.moveTo(cx - r - 0.025, yb); g.arc(cx, yb, r + 0.025, Math.PI, 0); }
      g.stroke();
      g.fillStyle = rgb(hell(GELB, -0.15));
      for (let i = 0; i <= n; i++) { const x = ab * i; g.fillRect(x - 0.05, Y(FRIES1 - 0.06 - r), 0.1, 0.1); }
    }
    /* Abdeckband über dem Fries */
    band(g, F, ss, -0.1, L + 0.2, Y(FRIES1 + 0.08), 0.1, 0.08, 17);
    /* Attika: Blendfelder zwischen Pfeilern */
    const z0 = FRIES1 + 0.08, z1 = ZW - 0.12;
    const m = Math.max(2, Math.round((L - 0.9) / 1.6)), fb = (L - 0.9) / m;
    for (let i = 0; i < m; i++) {
      const x = 0.45 + i * fb + 0.14, w = fb - 0.28;
      g.fillStyle = "rgba(40,14,10,0.22)"; g.fillRect(x, Y(z1) + 0.06, w, z1 - z0 - 0.12);
      if (sv) { g.fillStyle = "rgba(30,10,10,0.3)"; g.fillRect(x, Y(z1) + 0.06, w, Math.max(0.02, sv[1] * 0.6)); if (sv[0] > 0) g.fillRect(x, Y(z1) + 0.06, Math.min(0.05, sv[0] * 0.6), z1 - z0 - 0.12); else g.fillRect(x + w + sv[0] * 0.6, Y(z1) + 0.06, Math.min(0.05, -sv[0] * 0.6), z1 - z0 - 0.12); }
      if (F.px > 14) { g.strokeStyle = rgb(hell(GELB, -0.1), 0.45); g.lineWidth = 0.025; g.beginPath(); g.moveTo(x + 0.05, Y(z0) - 0.1); g.lineTo(x + w / 2, Y(z1) + 0.15); g.lineTo(x + w - 0.05, Y(z0) - 0.1); g.stroke(); }
    }
    /* Abdeckplatte */
    sandstein(g, -0.1, Y(ZW), L + 0.2, 0.12, F, hell(ss, 0.04), { saat: 23, fugen: 0.9 });
    g.fillStyle = rgb(hell(ss, 0.25)); g.fillRect(-0.1, Y(ZW), L + 0.2, 0.025);
    g.fillStyle = rgb(hell(ss, -0.35)); g.fillRect(-0.1, Y(ZW - 0.12) - 0.02, L + 0.2, 0.02);
  }
  /* Werkstattfenster: Stichbogen, gusseiserne Sprossen, dahinter Geräte */
  function stichPfad(g, x, y, w, h, st) {
    g.beginPath(); g.moveTo(x, y + h); g.lineTo(x, y + st); g.quadraticCurveTo(x + w / 2, y - st, x + w, y + st); g.lineTo(x + w, y + h); g.closePath();
  }
  function fensterEG(g, F, S, Z, e, Y) {
    const w = e.w, h = e.h, x = e.a - w / 2, y = Y(e.zs + h), st = EG.stich, ss = S.sandstein;
    /* Rollschicht aus gelben Ziegeln über dem Stichbogen */
    const rb = 0.26;
    g.fillStyle = rgb(GELB);
    g.beginPath(); g.moveTo(x - 0.06, y + st + 0.02); g.quadraticCurveTo(x + w / 2, y - st - 2 * rb, x + w + 0.06, y + st + 0.02); g.lineTo(x + w, y + st); g.quadraticCurveTo(x + w / 2, y - st, x, y + st); g.closePath(); g.fill();
    if (F.px > 12) {
      g.strokeStyle = rgb(FUGE, 0.8); g.lineWidth = Math.max(0.008, 0.8 / F.px);
      g.beginPath();
      const n = Math.round(w / 0.085);
      for (let i = 1; i < n; i++) {
        const t = i / n, bx = (1 - t) * (1 - t) * x + 2 * (1 - t) * t * (x + w / 2) + t * t * (x + w), by = (1 - t) * (1 - t) * (y + st) + 2 * (1 - t) * t * (y - st) + t * t * (y + st);
        const nx = (t - 0.5) * 0.35, ny = -1;
        g.moveTo(bx, by); g.lineTo(bx + nx * rb, by + ny * rb * (0.85 + 0.3 * (1 - Math.abs(t - 0.5) * 2)));
      }
      g.stroke();
    }
    /* Schlussstein und Kämpfer aus Sandstein */
    g.fillStyle = rgb(ss);
    g.beginPath(); g.moveTo(x + w / 2 - 0.1, y - st - rb * 0.95); g.lineTo(x + w / 2 + 0.1, y - st - rb * 0.95); g.lineTo(x + w / 2 + 0.07, y + 0.02); g.lineTo(x + w / 2 - 0.07, y + 0.02); g.closePath(); g.fill();
    g.fillStyle = rgb(hell(ss, 0.2)); g.fillRect(x + w / 2 - 0.1, y - st - rb * 0.95, 0.2, 0.02);
    for (const kx of [x - 0.12, x + w - 0.02]) { sandstein(g, kx, y + st - 0.02, 0.14, 0.14, F, ss, { saat: 5 }); g.fillStyle = rgb(hell(ss, 0.2)); g.fillRect(kx, y + st - 0.02, 0.14, 0.02); }
    laborGlas(g, F, S, Z, x, y, w, h, st, e, Z.fensterEG);
    sohlbank(g, F, S, x, Y(e.zs), w, false);
    if (S.winter && Z.schnee > 0 && Z.fensterEG) schneeKante(g, x - 0.18, x + w + 0.18, Y(e.zs), 0.05 * Z.schnee, F, (e.a * 10) | 0);
  }
  function laborGlas(g, F, S, Z, x, y, w, h, st, e, fertig) {
    g.save(); stichPfad(g, x, y, w, h, st); g.clip();
    if (!fertig) {
      const gr = g.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, "rgb(34,28,26)"); gr.addColorStop(1, "rgb(58,48,42)");
      g.fillStyle = gr; g.fillRect(x, y - st, w, h + st);
      g.restore(); return;
    }
    const tag = 1 - F.nacht;
    const gl = g.createLinearGradient(x, y, x + w * 0.4, y + h);
    gl.addColorStop(0, "rgb(" + [140, 164, 190].map((v) => Math.round(v * (0.45 + 0.55 * tag))).join(",") + ")");
    gl.addColorStop(0.5, "rgb(" + [54, 66, 82].map((v) => Math.round(v * (0.6 + 0.4 * tag))).join(",") + ")");
    gl.addColorStop(1, "rgb(30,34,42)");
    g.fillStyle = gl; g.fillRect(x, y - st, w, h + st);
    /* Geräte hinter dem Glas, tagsüber nur als Ahnung */
    if (Z.instrumente && F.px > 10) instrumente(g, x, y, w, h, e.saat || 3, "rgba(20,24,30,0.42)", null);
    /* Spiegelung */
    g.fillStyle = "rgba(255,255,255," + (0.08 + 0.12 * tag) + ")";
    g.beginPath(); g.moveTo(x + w * 0.1, y + h); g.lineTo(x + w * 0.55, y - st); g.lineTo(x + w * 0.72, y - st); g.lineTo(x + w * 0.27, y + h); g.closePath(); g.fill();
    /* Laibungsschatten */
    const sv = F.schatten ? F.schatten(0.22) : null;
    g.fillStyle = "rgba(20,24,40,0.42)";
    if (sv) { g.beginPath(); g.moveTo(x, y - st); g.lineTo(x + w, y - st); g.lineTo(x + w + sv[0], y - st + sv[1] * 1.3); g.lineTo(x + sv[0], y - st + sv[1] * 1.3); g.closePath(); g.fill(); if (sv[0] > 0) g.fillRect(x, y, sv[0], h); else g.fillRect(x + w + sv[0], y, -sv[0], h); }
    g.restore();
    eisenSprossen(g, F, x, y, w, h, st, 3, 5);
  }
  function eisenSprossen(g, F, x, y, w, h, st, sp, zl) {
    const b = Math.max(0.022, 0.9 / F.px), rahmen = 0.06;
    g.save(); stichPfad(g, x, y, w, h, st); g.clip();
    g.fillStyle = "rgb(44,48,50)";
    g.fillRect(x, y - st, rahmen, h + st); g.fillRect(x + w - rahmen, y - st, rahmen, h + st); g.fillRect(x, y + h - rahmen, w, rahmen);
    g.strokeStyle = "rgb(44,48,50)"; g.lineWidth = rahmen; stichPfad(g, x, y, w, h, st); g.stroke();
    g.fillStyle = "rgb(52,56,58)";
    for (let i = 1; i < sp; i++) g.fillRect(x + w * i / sp - b / 2, y - st, b, h + st);
    for (let k = 1; k < zl; k++) g.fillRect(x, y + h * k / zl - b / 2, w, b);
    /* Lüftungsflügel in der Mitte, etwas geöffnet */
    const fx = x + w / sp, fy = y + h * 2 / zl;
    g.fillStyle = "rgba(20,22,26,0.45)"; g.fillRect(fx, fy + h / zl - 0.05, w / sp, 0.05);
    g.restore();
  }
  /* Glaskolben, Retorte, Flaschen im Regal, Stativ (Silhouetten) */
  function instrumente(g, x, y, w, h, saat, farbe, fluessig) {
    const rng = zufall(saat * 13 + 7);
    const tisch = y + h * 0.72, regal = y + h * 0.36;
    g.fillStyle = farbe;
    /* Arbeitstisch und Regalbrett */
    g.fillRect(x, tisch, w, 0.05); g.fillRect(x, regal, w, 0.035);
    /* Flaschen im Regal */
    for (let bx = x + 0.08 + rng() * 0.08; bx < x + w - 0.1; bx += 0.1 + rng() * 0.08) {
      const bh = 0.12 + rng() * 0.12, bw = 0.05 + rng() * 0.04;
      g.fillStyle = farbe; g.fillRect(bx, regal - bh, bw, bh); g.fillRect(bx + bw * 0.3, regal - bh - 0.05, bw * 0.4, 0.05);
      if (fluessig && rng() < 0.6) { g.fillStyle = fluessig[(rng() * fluessig.length) | 0]; g.fillRect(bx + 0.008, regal - bh * 0.6, bw - 0.016, bh * 0.6 - 0.005); }
    }
    /* Rundkolben auf dem Stativ */
    const kx = x + w * (0.22 + rng() * 0.1), ky = tisch - 0.28, kr = 0.1;
    g.fillStyle = farbe;
    g.fillRect(kx - 0.012, tisch - 0.62, 0.024, 0.62); g.fillRect(kx - 0.12, tisch - 0.02, 0.24, 0.02);
    g.fillRect(kx - 0.06, ky + kr * 0.8, 0.12, 0.015);
    g.beginPath(); g.arc(kx, ky, kr, 0, TAU); g.fill(); g.fillRect(kx - 0.02, ky - kr - 0.14, 0.04, 0.15);
    if (fluessig) { g.fillStyle = fluessig[0]; g.beginPath(); g.arc(kx, ky, kr * 0.82, 0.25, Math.PI - 0.25); g.fill(); }
    /* Retorte mit schrägem Hals */
    g.fillStyle = farbe;
    const rx = x + w * (0.62 + rng() * 0.1), ry = tisch - 0.12;
    g.beginPath(); g.arc(rx, ry, 0.1, 0, TAU); g.fill();
    g.save(); g.translate(rx + 0.05, ry - 0.06); g.rotate(-0.5); g.fillRect(0, -0.018, 0.34, 0.036); g.restore();
    if (fluessig) { g.fillStyle = fluessig[1 % fluessig.length]; g.beginPath(); g.arc(rx, ry, 0.08, 0.2, Math.PI - 0.2); g.fill(); }
    /* Erlenmeyerkolben */
    g.fillStyle = farbe;
    const ex = x + w * 0.45;
    g.beginPath(); g.moveTo(ex - 0.08, tisch); g.lineTo(ex - 0.02, tisch - 0.16); g.lineTo(ex - 0.02, tisch - 0.24); g.lineTo(ex + 0.02, tisch - 0.24); g.lineTo(ex + 0.02, tisch - 0.16); g.lineTo(ex + 0.08, tisch); g.closePath(); g.fill();
    if (fluessig) { g.fillStyle = fluessig[2 % fluessig.length]; g.beginPath(); g.moveTo(ex - 0.07, tisch - 0.005); g.lineTo(ex - 0.045, tisch - 0.08); g.lineTo(ex + 0.045, tisch - 0.08); g.lineTo(ex + 0.07, tisch - 0.005); g.closePath(); g.fill(); }
  }
  function fensterOG(g, F, S, Z, e, Y) {
    const w = e.w, h = e.h, x = e.a - w / 2, y = Y(e.zs + h), ss = S.sandstein;
    /* gerader Sturz mit Schlussstein */
    const sv = F.schatten ? F.schatten(0.05) : null;
    if (sv) { g.fillStyle = "rgba(30,12,10,0.3)"; g.fillRect(x - 0.12 + sv[0], y - 0.2 + sv[1], w + 0.24, 0.2); }
    sandstein(g, x - 0.12, y - 0.2, w + 0.24, 0.2, F, ss, { saat: 31 });
    g.fillStyle = rgb(hell(ss, 0.22)); g.fillRect(x - 0.12, y - 0.2, w + 0.24, 0.022);
    g.fillStyle = rgb(hell(ss, 0.08)); g.beginPath(); g.moveTo(x + w / 2 - 0.09, y - 0.24); g.lineTo(x + w / 2 + 0.09, y - 0.24); g.lineTo(x + w / 2 + 0.06, y); g.lineTo(x + w / 2 - 0.06, y); g.closePath(); g.fill();
    if (Z.fensterOG) PI.fenster(g, x, y, w, h, F, { rahmen: "#efe7d6", laibung: rgb(hell(ZIEGEL_ROH, 0.1)), sprossen: [1, 3], fluegel: 2, bank: false, vorhangFarbe: "#e9dcc0", tiefe: 0.18 });
    else { g.fillStyle = "rgb(40,32,30)"; g.fillRect(x, y, w, h); }
    sohlbank(g, F, S, x, Y(e.zs), w, false);
    if (S.winter && Z.schnee > 0 && Z.fensterOG) { schneeKante(g, x - 0.18, x + w + 0.18, Y(e.zs), 0.05 * Z.schnee, F, (e.a * 13) | 0); schneeKante(g, x - 0.12, x + w + 0.12, y - 0.2, 0.04 * Z.schnee, F, 7); }
    if (S.sommer && Z.fertig && e.kasten) PI.blumenkasten(g, x + 0.03, Y(e.zs) - 0.02, w - 0.06, F, "sommer", { kastenFarbe: "#3f5a45" });
  }
  function portal(g, F, S, Z, e, Y) {
    const ss = S.sandstein, w = e.w, h = e.h, x = e.a - w / 2, zs = e.zs, y = Y(zs + h), r = w / 2, rb = 0.26;
    const sv = F.schatten ? F.schatten(0.08) : null;
    const umriss = (d) => { g.beginPath(); g.moveTo(x - rb + d[0], Y(zs) + d[1]); g.lineTo(x - rb + d[0], y + r + d[1]); g.arc(x + r + d[0], y + r + d[1], r + rb, Math.PI, 0); g.lineTo(x + w + rb + d[0], Y(zs) + d[1]); g.closePath(); };
    if (sv) { g.fillStyle = "rgba(30,12,10,0.3)"; umriss(sv); g.fill(); }
    g.save(); umriss([0, 0]); g.clip();
    sandstein(g, x - rb - 0.1, y - rb - 0.1, w + 2 * rb + 0.2, h + rb + 0.2, F, ss, { saat: 90 });
    if (F.px > 10) {
      g.strokeStyle = rgb(hell(ss, -0.3), 0.8); g.lineWidth = Math.max(0.01, 0.9 / F.px);
      for (let i = 1; i < 9; i++) { const a = Math.PI + Math.PI * i / 9; g.beginPath(); g.moveTo(x + r + Math.cos(a) * r, y + r + Math.sin(a) * r); g.lineTo(x + r + Math.cos(a) * (r + rb), y + r + Math.sin(a) * (r + rb)); g.stroke(); }
      for (let zz = zs + 0.45; zz < zs + h - r; zz += 0.45) { g.beginPath(); g.moveTo(x - rb, Y(zz)); g.lineTo(x, Y(zz)); g.moveTo(x + w, Y(zz)); g.lineTo(x + w + rb, Y(zz)); g.stroke(); }
    }
    g.restore();
    g.fillStyle = rgb(hell(ss, 0.08)); g.beginPath(); g.moveTo(x + r - 0.13, y - rb - 0.05); g.lineTo(x + r + 0.13, y - rb - 0.05); g.lineTo(x + r + 0.09, y + 0.04); g.lineTo(x + r - 0.09, y + 0.04); g.closePath(); g.fill();
    g.save();
    g.beginPath(); g.moveTo(x, Y(zs)); g.lineTo(x, y + r); g.arc(x + r, y + r, r, Math.PI, 0); g.lineTo(x + w, Y(zs)); g.closePath(); g.clip();
    if (!Z.tuer) { g.fillStyle = "rgb(36,30,28)"; g.fillRect(x, y, w, h); }
    else {
      g.fillStyle = "rgb(40,52,70)"; g.fillRect(x, y, w, r + 0.05);
      if (F.px > 12) { g.strokeStyle = "rgb(30,34,32)"; g.lineWidth = 0.03; for (let i = 1; i < 6; i++) { const a = Math.PI + Math.PI * i / 6; g.beginPath(); g.moveTo(x + r, y + r); g.lineTo(x + r + Math.cos(a) * r, y + r + Math.sin(a) * r); g.stroke(); } }
      g.fillStyle = "rgb(58,40,28)"; g.fillRect(x, y + r - 0.02, w, 0.1);
      const ty = y + r + 0.08, th = Y(zs) - ty;
      for (const s of [0, 1]) {
        const fx = x + s * w / 2, fw = w / 2;
        const gr = g.createLinearGradient(fx, 0, fx + fw, 0); gr.addColorStop(0, "rgb(46,74,62)"); gr.addColorStop(1, "rgb(34,58,48)");
        g.fillStyle = gr; g.fillRect(fx, ty, fw, th);
        g.strokeStyle = "rgba(14,26,20,0.8)"; g.lineWidth = 0.025;
        g.strokeRect(fx + 0.08, ty + 0.1, fw - 0.16, th * 0.4); g.strokeRect(fx + 0.08, ty + th * 0.55, fw - 0.16, th * 0.38);
        g.fillStyle = "rgba(10,20,16,0.6)"; g.fillRect(fx + fw - 0.012, ty, 0.012, th);
      }
      g.fillStyle = "#c9a45a"; g.fillRect(x + w / 2 - 0.08, ty + th * 0.48, 0.03, 0.2); g.fillRect(x + w / 2 + 0.05, ty + th * 0.48, 0.03, 0.2);
    }
    if (sv) { g.fillStyle = "rgba(20,15,20,0.35)"; g.beginPath(); g.moveTo(x, y + r); g.arc(x + r, y + r, r, Math.PI, 0); g.lineTo(x + w + sv[0] * 2, y + r + sv[1] * 2); g.arc(x + r + sv[0] * 2, y + r + sv[1] * 2, r, 0, Math.PI, true); g.closePath(); g.fill(); }
    g.restore();
    /* Tafel „LABORATORIUM" über dem Portal */
    const tz0 = 3.78, tz1 = 4.2, tw = 2.5;
    band(g, F, ss, e.a - tw / 2, e.a + tw / 2, Y(tz1), tz1 - tz0, 0.04, 44);
    if (F.px > 6) {
      g.save(); g.fillStyle = F.px > 16 ? "rgb(52,40,30)" : "rgba(52,40,30,0.75)";
      g.font = "bold 0.24px 'DejaVu Serif', Georgia, serif"; g.textAlign = "center"; g.textBaseline = "middle";
      g.fillText("LABORATORIUM", e.a, Y((tz0 + tz1) / 2) + 0.01, tw - 0.2); g.restore();
    }
    if (S.winter && Z.schnee > 0 && Z.tuer) schneeKante(g, e.a - tw / 2, e.a + tw / 2, Y(tz1), 0.04 * Z.schnee, F, 9);
  }
  /* Sonnenuhr: Zifferblatt auf Putz, eiserner Schattenstab */
  function sonnenuhr(g, F, S, Z, e, Y) {
    const w = 1.0, h = 1.2, x = e.a - w / 2, y = Y(e.zs + h), ss = S.sandstein;
    sandstein(g, x - 0.08, y - 0.08, w + 0.16, h + 0.16, F, ss, { saat: 71 });
    g.fillStyle = "rgb(234,226,206)"; g.fillRect(x, y, w, h);
    rausch(g, x, y, w, h, 0.8, 0.15, 3, 3);
    const cx = x + w / 2, cy = y + 0.12;
    if (F.px > 10) {
      g.strokeStyle = "rgb(70,54,40)"; g.lineWidth = Math.max(0.008, 0.7 / F.px);
      for (let i = -6; i <= 6; i++) { const a = Math.PI / 2 + i * 0.2; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(a) * 0.95, cy + Math.sin(a) * 0.95); g.stroke(); }
      g.strokeStyle = "rgb(150,40,30)"; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx, cy + 1.0); g.stroke();
      if (F.px > 30) {
        g.fillStyle = "rgb(60,44,32)"; g.font = "0.07px 'DejaVu Serif', serif"; g.textAlign = "center"; g.textBaseline = "middle";
        const Zr = ["VI", "VII", "VIII", "IX", "X", "XI", "XII", "I", "II", "III", "IV", "V", "VI"];
        for (let i = -6; i <= 6; i++) { const a = Math.PI / 2 - i * 0.2; const px = cx + Math.cos(a) * 0.72, py = cy + Math.sin(a) * 0.72; if (py < y + h - 0.05 && px > x + 0.05 && px < x + w - 0.05) g.fillText(Zr[i + 6], px, py); }
        g.font = "italic 0.055px 'DejaVu Serif', serif"; g.fillText("SINE SOLE SILEO", cx, y + h - 0.07);
      }
    }
    /* Stab und sein Schatten */
    const sv = F.schatten ? F.schatten(0.45) : null;
    if (sv) { g.strokeStyle = "rgba(30,20,20,0.5)"; g.lineWidth = 0.025; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + sv[0], cy + 0.5 + sv[1]); g.stroke(); }
    g.strokeStyle = "rgb(30,30,32)"; g.lineWidth = 0.03; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx, cy + 0.42); g.stroke();
    void Z;
  }
  /* Blitzableiter: Ableitung aus verzinktem Rundstahl mit Schellen */
  function ableitung(g, F, S, Z, e, Y) {
    if (!Z.dach) return;
    const x = e.a;
    g.fillStyle = "rgba(20,20,24,0.3)"; const sv = F.schatten ? F.schatten(0.05) : null;
    if (sv) g.fillRect(x + sv[0] - 0.012, Y(ZW), 0.024, ZW - 0.15);
    g.fillStyle = "rgb(128,134,138)"; g.fillRect(x - 0.012, Y(ZW), 0.024, ZW - 0.15);
    g.fillStyle = "rgb(170,176,180)"; g.fillRect(x - 0.012, Y(ZW), 0.007, ZW - 0.15);
    g.fillStyle = "rgb(60,64,66)"; for (let z = 0.5; z < ZW; z += 1.1) g.fillRect(x - 0.035, Y(z), 0.07, 0.03);
    /* Trennstelle mit Messschelle unten */
    g.fillStyle = "rgb(90,94,96)"; g.fillRect(x - 0.03, Y(0.55), 0.06, 0.08);
  }
  /* Wilder Wein an der Ostwand: Sommer grün, Herbst rot, Winter kahl */
  function ranke(g, F, S, Z, W, Y) {
    if (!Z.fertig || F.px < 6) return;
    const rng = zufall(W.saat * 5 + 1), jahr = F.jahr;
    const x0 = W.ranke[0], x1 = W.ranke[1];
    /* Triebe */
    g.strokeStyle = jahr === "winter" ? "rgba(90,62,44,0.85)" : "rgba(80,58,40,0.7)"; g.lineWidth = 0.025;
    const spitzen = [];
    for (let i = 0; i < 7; i++) {
      let x = x0 + (x1 - x0) * (0.2 + rng() * 0.6), z = 0.8;
      g.beginPath(); g.moveTo(x, Y(z));
      const top = 3.5 + rng() * 3.2;
      while (z < top) { x += (rng() - 0.5) * 0.35; x = klemm(x, x0 - 0.6, x1 + 0.8); z += 0.2 + rng() * 0.2; g.lineTo(x, Y(z)); spitzen.push([x, z]); }
      g.stroke();
    }
    if (jahr === "winter") return;
    const farben = jahr === "herbst" ? [[170, 40, 30], [196, 70, 34], [140, 30, 36], [208, 120, 40]] : jahr === "fruehling" ? [[96, 150, 60], [120, 170, 70]] : [[56, 104, 44], [70, 122, 50], [44, 88, 40]];
    const n = F.px > 30 ? 5 : 2;
    for (const [sx, sz] of spitzen) for (let k = 0; k < n; k++) {
      const c = farben[(rng() * farben.length) | 0];
      g.fillStyle = rgb(streu(c, rng, 0.15), 0.95);
      const bx = sx + (rng() - 0.5) * 0.5, by = Y(sz + (rng() - 0.5) * 0.35), r = 0.05 + rng() * 0.05;
      g.beginPath(); g.moveTo(bx, by - r); g.lineTo(bx + r, by); g.lineTo(bx + r * 0.3, by + r * 0.2); g.lineTo(bx, by + r * 0.9); g.lineTo(bx - r * 0.3, by + r * 0.2); g.lineTo(bx - r, by); g.closePath(); g.fill();
    }
  }
  function wandLicht(S, Z, W) {
    return function (g, F) {
      if (!Z.licht) return;
      const zTop = F.flaeche.zTop == null ? W.z1 : F.flaeche.zTop;
      g.save(); g.translate(0, zTop - W.z1);
      const Y = (z) => W.z1 - z;
      for (const e of W.elemente || []) {
        if (e.art === "og") PI.fensterLicht(g, e.a - e.w / 2, Y(e.zs + e.h), e.w, e.h, F, { an: lichtAn(S, e), sprossen: [1, 3], fluegel: 2 });
        else if (e.art === "eg" && (lichtAn(S, e) || e.gruen)) laborLicht(g, F, e, Y);
        else if (e.art === "portal") {
          const w = e.w, r = w / 2, x = e.a - w / 2, y = Y(e.zs + e.h);
          g.save(); g.beginPath(); g.arc(x + r, y + r, r - 0.04, Math.PI, 0); g.closePath(); g.clip();
          g.fillStyle = "rgba(255,206,140," + (0.8 * F.nacht) + ")"; g.fillRect(x, y, w, r); g.restore();
        }
      }
      g.restore();
    };
  }
  /* Nachtlicht im Labor: warm – oder grünlich-blau (ein Fenster) –,
     davor die Geräte als dunkle Schattenrisse, farbige Flüssigkeiten */
  function laborLicht(g, F, e, Y) {
    const w = e.w, h = e.h, x = e.a - w / 2, y = Y(e.zs + h), st = EG.stich, a = F.nacht;
    const farbe = e.gruen ? [120, 236, 204] : [255, 200, 128];
    g.save(); stichPfad(g, x, y, w, h, st); g.clip();
    const gr = g.createRadialGradient(x + w / 2, y + h * 0.6, 0.1, x + w / 2, y + h * 0.5, h);
    gr.addColorStop(0, "rgba(" + farbe.map((v) => Math.min(255, v + 25)).join(",") + "," + (0.95 * a) + ")");
    gr.addColorStop(0.7, "rgba(" + farbe.join(",") + "," + (0.8 * a) + ")");
    gr.addColorStop(1, "rgba(" + farbe.map((v) => v * 0.55).join(",") + "," + (0.75 * a) + ")");
    g.fillStyle = gr; g.fillRect(x, y - st, w, h + st);
    instrumente(g, x, y, w, h, e.saat || 3, "rgba(24,20,18," + (0.9 * a) + ")", e.gruen ? ["rgba(90,255,210,0.9)", "rgba(60,200,255,0.85)", "rgba(160,255,120,0.85)"] : ["rgba(255,150,40,0.85)", "rgba(80,200,120,0.8)", "rgba(90,140,255,0.8)"]);
    g.restore();
    eisenSprossen(g, F, x, y, w, h, st, 3, 5);
    F.leuchtPunkt(e.a, y + h * 0.55, Math.max(w, h) * 1.3, farbe.join(","), e.gruen ? 0.75 : 0.55, e.gruen);
  }
  function lichtAn(S, e) {
    const r = zufall(S.saat * 31 + Math.round(e.a * 17) + Math.round(e.zs * 5) + (e.seite || 0) * 101)();
    return r < 0.62 ? 1 : 0;
  }

  /* =====================================================================
     WÄNDE
     ===================================================================== */
  function waendePlan() {
    const W = [];
    let n = 0;
    const eg = (a, s, extra) => Object.assign({ art: "eg", a: a, w: EG.w, h: EG.h, zs: EG.zs, seite: s, saat: ++n }, extra || {});
    const og = (a, s) => ({ art: "og", a: a, w: OG.w, h: OG.h, zs: OG.zs, seite: s });
    const kf = (a) => ({ art: "keller", a: a, zs: 0.3, w: 0.7, h: 0.4 });
    const achsen = (liste, s, gruen) => { const r = []; for (const a of liste) r.push(kf(a), eg(a, s, { gruen: gruen === a }), og(a, s)); return r; };
    W.push({ p0: PLAN[0], p1: PLAN[1], elemente: achsen([1.2, 2.9, 6.1, 7.8], 1, 6.1).concat([
      { art: "portal", a: 4.5, w: 1.3, h: 2.9, zs: PORTAL_Z }, { art: "sonnenuhr", a: 4.5, zs: 5.4 }, { art: "blitz", a: 0.62 }]) });
    W.push({ p0: PLAN[1], p1: PLAN[2], elemente: achsen([1.7, 4.5], 2), ranke: [2.6, 3.6] });
    W.push({ p0: PLAN[2], p1: PLAN[3], elemente: achsen([1.2, 2.9, 4.5, 6.1, 7.8], 3) });
    W.push({ p0: PLAN[3], p1: PLAN[0], elemente: achsen([1.7, 4.5], 4) });
    let saat = 3, ox = 0;
    for (const w of W) { w.L = Math.hypot(w.p1[0] - w.p0[0], w.p1[1] - w.p0[1]); w.z0 = 0; w.z1 = ZW; w.saat = saat += 7; w.ox = ox; ox += 0.37; }
    return W;
  }
  const WAENDE = waendePlan();
  const ATTIKA_OCC = PLAN.map((p, i) => { const q = PLAN[(i + 1) % PLAN.length]; return [[p[0], p[1], ZW], [q[0], q[1], ZW], [q[0], q[1], DACHZ - 0.6], [p[0], p[1], DACHZ - 0.6]]; });

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
    const g = c.getContext("2d"), rng = zufall(saat);
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
     BAUGRUBE, KELLER, MAUERRING (wie beim Krankenhaus)
     ===================================================================== */
  const GRUBE = [[-5.1, 3.4], [5.1, 3.4], [5.1, -4.5], [-5.1, -4.5]];
  function band(g, F, farbe, x0, x1, y, h, tiefe, saat) {
    const sv = F.schatten ? F.schatten(tiefe) : null;
    if (sv) { g.fillStyle = "rgba(40,24,30,0.32)"; g.beginPath(); g.rect(x0 + sv[0], y + h, x1 - x0, Math.max(0.02, sv[1])); g.fill(); }
    else { const gr = g.createLinearGradient(0, y + h, 0, y + h + 0.12); gr.addColorStop(0, "rgba(40,24,30,0.28)"); gr.addColorStop(1, "rgba(40,24,30,0)"); g.fillStyle = gr; g.fillRect(x0, y + h, x1 - x0, 0.12); }
    sandstein(g, x0, y, x1 - x0, h, F, farbe, { saat: saat, fugen: 0.9 });
    g.fillStyle = rgb(hell(farbe, 0.22)); g.fillRect(x0, y, x1 - x0, h * 0.18);
    g.fillStyle = rgb(hell(farbe, -0.12)); g.fillRect(x0, y + h * 0.42, x1 - x0, h * 0.1);
    g.fillStyle = rgb(hell(farbe, -0.3)); g.fillRect(x0, y + h - h * 0.12, x1 - x0, h * 0.12);
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
  function kellerFenster(g, F, S, Z, e, Y) {
    const x = e.a - 0.35, y = Y(0.72), w = 0.7, h = 0.38;
    g.fillStyle = rgb(hell(S.sandstein, -0.4)); g.fillRect(x - 0.05, y - 0.05, w + 0.1, h + 0.1);
    g.fillStyle = "rgb(30,28,30)"; g.fillRect(x, y, w, h);
    if (Z.fensterEG) {
      g.fillStyle = "rgba(120,140,160,0.35)"; g.fillRect(x + 0.04, y + 0.04, w - 0.08, h - 0.08);
      g.fillStyle = "rgb(36,36,38)"; for (let i = 1; i < 5; i++) g.fillRect(x + w * i / 5 - 0.012, y, 0.024, h);
    }
  }
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
      const f = wand(M, W.p0, W.p1, z0, zt, mal, { name: "w" + W.saat, ao: !unter, keinLicht: unter, traufe: 0, leuchten: fertigeWand ? wandLicht(S, Z, W) : null });
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
  /* =====================================================================
     FLACHDACH HINTER DER ATTIKA
     ===================================================================== */
  function dachBauen(M, S, Z) {
    if (!Z.dach) return;
    M.teil("dach", { mitte: [0, -0.5, DACHZ + 0.2] });
    const K = KUPPEL;
    /* Dachfläche: Holzschalung, dann Teerpappe in Bahnen, Schnee */
    poly3(M, INNEN.map((p) => [p[0], p[1], DACHZ]), (g, F) => {
      const w = F.w, h = F.h, ox = INNEN[0][0], oy = Math.min(INNEN[0][1], INNEN[2][1]);
      const X = (x) => x - ox, Yd = (y) => y - oy;
      if (!Z.pappe) {
        g.fillStyle = rgb(HOLZ_ROH); g.fillRect(-0.1, -0.1, w + 0.2, h + 0.2);
        if (F.px > 8) { g.fillStyle = rgb(hell(HOLZ_ROH, -0.22)); for (let y = 0.16; y < h; y += 0.16) g.fillRect(0, y, w, 0.012); }
        rausch(g, 0, 0, w, h, 1.3, 0.25, 72, 3);
      } else {
        g.fillStyle = rgb(PAPPE); g.fillRect(-0.1, -0.1, w + 0.2, h + 0.2);
        rausch(g, 0, 0, w, h, 1.1, 0.3, 6, 3);
        bleich(g, 0, 0, w, h, 2.4, 0.12, 2);
        if (F.px > 8) { g.fillStyle = "rgba(20,20,22,0.5)"; for (let x = 0.95; x < w; x += 1.0) g.fillRect(x, 0, 0.03, h); g.fillStyle = "rgba(140,140,140,0.25)"; for (let x = 0.98; x < w; x += 1.0) g.fillRect(x, 0, 0.015, h); }
        /* Kies am Rand, Wasserflecken */
        g.fillStyle = "rgba(120,116,108,0.35)"; g.fillRect(-0.1, -0.1, w + 0.2, 0.3); g.fillRect(-0.1, h - 0.2, w + 0.2, 0.3);
      }
      if (S.winter && Z.schnee > 0) {
        g.fillStyle = "rgba(242,246,252," + (0.96 * Z.schnee) + ")"; g.fillRect(-0.1, -0.1, w + 0.2, h + 0.2);
        rausch(g, 0, 0, w, h, 1.6, 0.1, 4, 3);
        /* Wehen an der Attika */
        const gr = g.createLinearGradient(0, 0, 0, 0.8); gr.addColorStop(0, "rgba(255,255,255,0.8)"); gr.addColorStop(1, "rgba(255,255,255,0)");
        g.fillStyle = gr; g.fillRect(-0.1, -0.1, w + 0.2, 0.9);
      } else if (S.herbst && Z.fertig) laub(g, 0, 0, w, h, 60, 8);
      /* Schatten: Attika, Tambour und Kuppel, Schornstein, Mast */
      g.save();
      g.fillStyle = "rgba(24,30,60,0.3)";
      const s1 = F.schatten ? F.schatten(ZW - DACHZ) : null;
      if (s1) {
        g.beginPath();
        for (let i = 0; i < INNEN.length; i++) { const a = INNEN[i], b = INNEN[(i + 1) % INNEN.length]; g.moveTo(X(a[0]), Yd(a[1])); g.lineTo(X(b[0]), Yd(b[1])); g.lineTo(X(b[0]) + s1[0], Yd(b[1]) + s1[1]); g.lineTo(X(a[0]) + s1[0], Yd(a[1]) + s1[1]); g.closePath(); }
        g.fill();
        const huelle = (h0, r) => { const sv = F.schatten(h0); if (!sv) return; g.moveTo(X(K.x) + sv[0] + r, Yd(K.y) + sv[1]); g.arc(X(K.x) + sv[0], Yd(K.y) + sv[1], r, 0, TAU); };
        if (Z.tambour > 0) {
          g.beginPath();
          const ht = K.ht * Z.tambour;
          for (let hh = 0; hh <= ht; hh += 0.25) huelle(hh, K.rt);
          huelle(ht, K.rt);
          if (Z.blech > 0) for (let t = 0; t <= Math.PI / 2 * Z.blech; t += 0.15) huelle(ht + Math.sin(t) * K.rd, Math.cos(t) * K.rd);
          g.fill("nonzero");
        }
        if (Z.kamin > 0) {
          const hk = (KAMIN.z1 - DACHZ) * Z.kamin, sv = F.schatten(hk), b = KAMIN.b / 2;
          g.beginPath();
          const q = [[-b, -b], [b, -b], [b, b], [-b, b]].map((p) => [X(KAMIN.x) + p[0], Yd(KAMIN.y) + p[1]]);
          for (const p of q) { g.moveTo(p[0], p[1]); g.lineTo(p[0] + sv[0], p[1] + sv[1]); }
          g.lineWidth = KAMIN.b; g.strokeStyle = "rgba(24,30,60,0.3)"; g.stroke();
        }
        if (Z.mast) { const sv = F.schatten(3.2); g.strokeStyle = "rgba(24,30,60,0.35)"; g.lineWidth = 0.06; g.beginPath(); g.moveTo(X(MAST[0]), Yd(MAST[1])); g.lineTo(X(MAST[0]) + sv[0], Yd(MAST[1]) + sv[1]); g.stroke(); }
        if (Z.huette) { const sv = F.schatten(1.5); g.fillStyle = "rgba(24,30,60,0.3)"; g.fillRect(X(HUETTE[0]) - 0.3 + sv[0] * 0.6, Yd(HUETTE[1]) - 0.25 + sv[1] * 0.6, 0.6 + Math.abs(sv[0]) * 0.4, 0.5 + Math.abs(sv[1]) * 0.4); }
      }
      g.restore();
    }, { n: [0, 0, 1], name: "dach" });
    /* Innenseite der Attika */
    const innen = (g, F) => {
      ziegel(g, -0.1, -0.1, F.w + 0.2, F.h + 0.2, F, { farbe: S.klinker, fuge: FUGE, saat: 61 });
      sandstein(g, -0.1, -0.1, F.w + 0.2, 0.12, F, hell(S.sandstein, 0.04), { saat: 23 });
      g.fillStyle = "rgba(60,60,64,0.9)"; g.fillRect(-0.1, F.h - 0.18, F.w + 0.2, 0.2);
      if (S.winter && Z.schnee > 0) { g.fillStyle = "rgba(244,247,252,0.95)"; g.fillRect(-0.1, F.h - 0.22, F.w + 0.2, 0.3); }
    };
    for (let i = 0; i < INNEN.length; i++) {
      const a = INNEN[i], b = INNEN[(i + 1) % INNEN.length];
      wand(M, b, a, DACHZ, ZW, innen, { name: "attika-innen" + i, keinAo: true });
    }
    /* Abdeckplatten */
    for (let i = 0; i < PLAN.length; i++) {
      const j = (i + 1) % PLAN.length;
      poly3(M, [[PLAN[i][0], PLAN[i][1], ZW], [PLAN[j][0], PLAN[j][1], ZW], [INNEN[j][0], INNEN[j][1], ZW], [INNEN[i][0], INNEN[i][1], ZW]], (g, F) => {
        sandstein(g, -0.1, -0.1, F.w + 0.2, F.h + 0.2, F, hell(S.sandstein, 0.06), { saat: 30 + i, fugen: 0.9 });
        if (S.winter && Z.schnee > 0) { g.fillStyle = "rgba(246,249,253," + Math.min(1, Z.schnee * 1.2) + ")"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); }
        else if (S.herbst) laub(g, 0, 0, F.w, F.h, F.w * 2, i);
      }, { n: [0, 0, 1], name: "abdeckung" + i });
    }
  }

  /* =====================================================================
     KUPPEL: eine gemalte Figur, aber echt projiziert. Tambour (Zylinder)
     und Halbkugel sind in der Abbildung Kreis und Ellipsen; Nähte,
     Spalt, Fernrohr und Fenster werden als 3D-Punkte gerechnet und nur
     gezeigt, wo sie dem Betrachter zugewandt sind.
     ===================================================================== */
  function kuppelFigur(S, Z) {
    return function (g, s, F) {
      if (F.schatten) return;
      const K = KUPPEL, KX = ST.KX, KY = ST.KY, KZ = ST.KZ, AUGE = ST.ZUM_AUGE;
      const r = (F.gier || 0) * RAD, c = Math.cos(r), sn = Math.sin(r);
      const cam = (p) => [p[0] * c - p[1] * sn, p[0] * sn + p[1] * c, p[2]];
      const P = (p) => { const q = cam(p); return [(q[0] - q[1]) * KX * s, (q[0] + q[1]) * KY * s - q[2] * KZ * s]; };
      const eM = [AUGE[0] * c + AUGE[1] * sn, -AUGE[0] * sn + AUGE[1] * c, AUGE[2]];
      const lfN = (nCam) => ST.lichtFaktor(nCam, F.Z, 0.02, F.jahr);
      const lit = (col, L, a) => rgb([col[0] * L[0], col[1] * L[1], col[2] * L[2]], a);
      const yz = (z) => -z * KZ * s;
      const ht = K.ht * Z.tambour, Rt = K.rt, Rd = K.rd, zc = ht;
      const cyl = (n) => [0.7071 * (Math.cos(n) + Math.sin(n)), 0.7071 * (Math.cos(n) - Math.sin(n)), 0];
      /* ---- Tambour ---- */
      const zylinder = (R, z0, z1, col, ziegelZ) => {
        g.save();
        g.beginPath(); g.moveTo(-R * s, yz(z1)); g.lineTo(-R * s, yz(z0));
        g.ellipse(0, yz(z0), R * s, 0.5 * R * s, 0, Math.PI, 0, true);
        g.lineTo(R * s, yz(z1));
        g.ellipse(0, yz(z1), R * s, 0.5 * R * s, 0, 0, Math.PI, false);
        g.closePath();
        const gr = g.createLinearGradient(-R * s, 0, R * s, 0);
        for (let i = 0; i <= 8; i++) { const u = -1 + i / 4, ph = Math.asin(klemm(u, -1, 1)); gr.addColorStop(i / 8, lit(col, lfN(cyl(ph)))); }
        g.fillStyle = gr; g.fill();
        if (ziegelZ && s > 14) {
          g.clip();
          rausch(g, -R * s, yz(z1) - R * s, 2 * R * s, (z1 - z0) * KZ * s + 2 * R * s, 2.4 * s, 0.22, 5, 3);
          g.strokeStyle = "rgba(220,212,196,0.35)"; g.lineWidth = Math.max(0.6, 0.012 * s);
          g.beginPath();
          for (let z = z0 + 0.077; z < z1; z += 0.077) { g.moveTo(-R * s, yz(z)); g.ellipse(0, yz(z), R * s, 0.5 * R * s, 0, Math.PI, 0, true); }
          g.stroke();
          if (s > 30) {
            g.beginPath();
            let k = 0;
            for (let z = z0; z < z1 - 0.07; z += 0.077, k++) for (let ph = -1.5 + (k % 2) * 0.075; ph < 1.5; ph += 0.15) { const X = R * s * Math.sin(ph), Y0 = yz(z) + 0.5 * R * s * Math.cos(ph); g.moveTo(X, Y0); g.lineTo(X, Y0 - 0.077 * KZ * s); }
            g.stroke();
          }
          /* gelbes Band */
          g.fillStyle = lit(GELB, lfN([0.7071, 0.7071, 0]), 0.85);
          const zb = z0 + (z1 - z0) * 0.55;
          g.beginPath(); g.moveTo(-R * s, yz(zb)); g.ellipse(0, yz(zb), R * s, 0.5 * R * s, 0, Math.PI, 0, true); g.lineTo(R * s, yz(zb + 0.23)); g.ellipse(0, yz(zb + 0.23), R * s, 0.5 * R * s, 0, 0, Math.PI, false); g.closePath(); g.fill();
        }
        g.restore();
      };
      if (Z.tambour > 0) {
        zylinder(Rt, 0, ht, S.klinker, true);
        /* Fenster im Tambour (schmale Rundbogenfenster) */
        if (Z.tambour >= 1) {
          for (const az of [20, 110, 200, 290]) {
            const a = az * RAD, n = [Math.cos(a), Math.sin(a), 0];
            if (dot(n, eM) < 0.15) continue;
            const t = [-Math.sin(a), Math.cos(a), 0], m = [n[0] * Rt, n[1] * Rt, 0];
            const q = (u, z) => P([m[0] + t[0] * u, m[1] + t[1] * u, z]);
            const L = lfN(cam(n));
            g.fillStyle = lit(S.sandstein, L);
            g.beginPath(); for (const [u, z] of [[-0.3, 0.2], [0.3, 0.2], [0.3, 0.95], [0, 1.12], [-0.3, 0.95]]) { const p = q(u, z); g.lineTo(p[0], p[1]); } g.closePath(); g.fill();
            g.fillStyle = Z.fensterOG ? (F.nacht > 0.1 && Z.licht ? "rgba(255,180,110," + (0.35 + 0.35 * F.nacht) + ")" : lit([60, 72, 90], L)) : "rgb(30,26,24)";
            g.beginPath(); for (const [u, z] of [[-0.2, 0.28], [0.2, 0.28], [0.2, 0.9], [0, 1.03], [-0.2, 0.9]]) { const p = q(u, z); g.lineTo(p[0], p[1]); } g.closePath(); g.fill();
          }
          /* Gesims oben am Tambour */
          zylinder(Rt + 0.1, ht - 0.2, ht, S.sandstein, false);
          g.fillStyle = lit(hell(S.sandstein, 0.1), lfN([0, 0, 1]));
          g.beginPath(); g.ellipse(0, yz(ht), (Rt + 0.1) * s, 0.5 * (Rt + 0.1) * s, 0, 0, TAU); g.ellipse(0, yz(ht), (Rt - 0.3) * s, 0.5 * (Rt - 0.3) * s, 0, 0, TAU); g.fill("evenodd");
          if (Z.blech < 1) {
            /* offen: innen Dielenboden und der gemauerte Pfeiler des Fernrohrs */
            g.fillStyle = lit([118, 92, 66], lfN([0, 0, 1]));
            g.beginPath(); g.ellipse(0, yz(ht), (Rt - 0.3) * s, 0.5 * (Rt - 0.3) * s, 0, 0, TAU); g.fill();
            g.fillStyle = "rgba(20,16,24,0.45)"; g.beginPath(); g.ellipse(0, yz(ht) - 0.08 * s, (Rt - 0.3) * s, 0.5 * (Rt - 0.3) * s, 0, Math.PI, TAU); g.fill();
            zylinder(0.35, ht - 0.3, ht + 0.4, [120, 116, 110], false);
          }
          if (S.winter && Z.schnee > 0) { g.fillStyle = lit([246, 249, 253], lfN([0, 0, 1]), Z.schnee); g.beginPath(); g.ellipse(0, yz(ht), (Rt + 0.1) * s, 0.5 * (Rt + 0.1) * s, 0, 0, TAU); g.fill(); }
        } else {
          /* rohe Mauerkrone */
          g.fillStyle = lit(hell(S.klinker, 0.1), lfN([0, 0, 1]));
          g.beginPath(); g.ellipse(0, yz(ht), Rt * s, 0.5 * Rt * s, 0, 0, TAU); g.ellipse(0, yz(ht), (Rt - 0.4) * s, 0.5 * (Rt - 0.4) * s, 0, 0, TAU); g.fill("evenodd");
          g.fillStyle = lit([90, 80, 70], lfN([0, 0, 1]));
          g.beginPath(); g.ellipse(0, yz(ht), (Rt - 0.4) * s, 0.5 * (Rt - 0.4) * s, 0, 0, TAU); g.fill();
        }
      }
      if (Z.gerippe <= 0) return;
      /* ---- Halbkugel ---- */
      const kugel = (t, az) => [Math.cos(t) * Math.cos(az) * Rd, Math.cos(t) * Math.sin(az) * Rd, zc + Math.sin(t) * Rd];
      const umriss = () => { g.beginPath(); g.arc(0, yz(zc), Rd * s, 0, -Math.PI, true); g.ellipse(0, yz(zc), Rd * s, 0.5 * Rd * s, 0, Math.PI, 0, true); g.closePath(); };
      const Lc = cam(ST.LICHT ? [0, 0, 0] : [0, 0, 0]); void Lc;
      const LI = ST.LICHT;
      const hx = (LI[0] - LI[1]) * KX * Rd * s, hy = yz(zc) + (LI[0] + LI[1]) * KY * Rd * s - LI[2] * KZ * Rd * s;
      const flaeche = (col, glanz) => {
        const gr = g.createRadialGradient(hx, hy, 0, hx, hy, Rd * s * 2.1);
        gr.addColorStop(0, lit(hell(col, glanz), lfN(LI)));
        gr.addColorStop(0.35, lit(col, lfN(nrm([LI[0] + 0.6, LI[1] - 0.6, LI[2] * 0.5]))));
        gr.addColorStop(1, lit(hell(col, -0.1), lfN([0.7, -0.7, 0])));
        g.fillStyle = gr;
      };
      const kupfer = Z.fertig || Z.bau >= 0.9 ? PATINA : KUPFER;
      const tb = Z.blech >= 1 ? Math.PI / 2 + 0.01 : Z.blech * Math.PI / 2;
      /* Nähte, Rippen: sichtbare Stücke einer Linie auf der Kugel */
      const linie = (pts, stil, breite, hinten) => {
        g.strokeStyle = stil; g.lineWidth = breite;
        g.beginPath();
        let an = false;
        for (const p of pts) {
          const v = dot(nrm([p[0], p[1], p[2] - zc]), eM) >= 0;
          if (v === !hinten) { const q = P(p); if (an) g.lineTo(q[0], q[1]); else g.moveTo(q[0], q[1]); an = true; } else an = false;
        }
        g.stroke();
      };
      /* Blech (von unten nach oben) */
      if (tb > 0) {
        g.save(); umriss(); g.clip();
        if (tb < Math.PI / 2) {
          const zt = zc + Math.sin(tb) * Rd, rr = Math.cos(tb) * Rd;
          g.beginPath(); g.moveTo(-Rd * s - 2, yz(zc) + 0.6 * Rd * s); g.lineTo(-rr * s, yz(zt)); g.ellipse(0, yz(zt), rr * s, 0.5 * rr * s, 0, Math.PI, 0, true); g.lineTo(Rd * s + 2, yz(zc) + 0.6 * Rd * s); g.closePath(); g.clip();
        }
        flaeche(kupfer, 0.25); g.fillRect(-Rd * s - 2, yz(zc + Rd) - 2, 2 * Rd * s + 4, 1.6 * Rd * s + 4);
        if (s > 10) {
          rausch(g, -Rd * s, yz(zc + Rd), 2 * Rd * s, 1.6 * Rd * s, 1.4 * s, 0.18, 3, 3);
          if (kupfer === PATINA) { g.globalAlpha = 0.35; g.fillStyle = lit([150, 98, 64], lfN(LI)); g.globalCompositeOperation = "multiply"; rausch(g, -Rd * s, yz(zc + Rd), 2 * Rd * s, 1.6 * Rd * s, 0.9 * s, 0.25, 4, 3); g.globalCompositeOperation = "source-over"; g.globalAlpha = 1; }
          for (let i = 0; i < 24; i++) { const az = i * TAU / 24, pts = []; for (let t = 0; t <= Math.min(tb, Math.PI / 2); t += 0.08) pts.push(kugel(t, az)); pts.push(kugel(Math.min(tb, Math.PI / 2), az)); linie(pts, "rgba(20,40,34,0.35)", Math.max(0.7, 0.014 * s), false); }
          for (const t of [0.45, 0.9, 1.25]) { if (t > tb) continue; const pts = []; for (let az = 0; az <= TAU + 0.01; az += 0.1) pts.push(kugel(t, az)); linie(pts, "rgba(230,255,240,0.18)", Math.max(0.6, 0.01 * s), false); }
        }
        /* Schneekappe */
        if (S.winter && Z.schnee > 0 && Z.blech >= 1) {
          /* Schneekappe mit weichem Rand (unscharf gemalt) */
          const kappe = (t0, al, weich) => {
            const zt = zc + Math.sin(t0) * Rd, rr = Math.cos(t0) * Rd;
            g.save(); g.filter = "blur(" + Math.max(0.5, weich * s).toFixed(1) + "px)";
            g.beginPath(); g.moveTo(-rr * s, yz(zt)); g.ellipse(0, yz(zt), rr * s, 0.5 * rr * s, 0, Math.PI, 0, true); g.lineTo(rr * s, yz(zc + Rd) - 0.3 * s); g.lineTo(-rr * s, yz(zc + Rd) - 0.3 * s); g.closePath();
            g.fillStyle = lit([244, 247, 252], lfN([0, 0, 1]), al * Z.schnee); g.fill(); g.restore();
          };
          kappe(0.5, 0.35, 0.12); kappe(0.66, 0.9, 0.07);
          if (s > 12) { g.globalAlpha = 0.5; rausch(g, -Rd * s, yz(zc + Rd), 2 * Rd * s, Rd * s, 0.9 * s, 0.12, 2, 3); g.globalAlpha = 1; }
        }
        g.restore();
      }
      /* Gerippe: Rippen aus Winkeleisen, solange nicht ganz gedeckt */
      if (Z.blech < 1) {
        const n = Math.max(2, Math.round(16 * Z.gerippe));
        for (const hinten of [true, false]) {
          for (let i = 0; i < n; i++) { const az = i * TAU / 16, pts = []; for (let t = 0; t <= Math.PI / 2 + 0.001; t += 0.08) pts.push(kugel(t, az)); pts.push(kugel(Math.PI / 2, az)); linie(pts, hinten ? "rgba(40,40,44,0.55)" : "rgb(52,54,58)", Math.max(1, 0.06 * s), hinten); }
          for (const t of [0, 0.7, 1.2]) { const pts = []; for (let az = 0; az <= TAU + 0.01; az += 0.1) pts.push(kugel(t, az)); linie(pts, hinten ? "rgba(40,40,44,0.55)" : "rgb(58,60,64)", Math.max(1, 0.05 * s), hinten); }
        }
      }
      if (Z.blech < 1) return;
      /* ---- Spalt mit Fernrohr ---- */
      const az = K.spalt * RAD, d = [Math.cos(az), Math.sin(az), 0], lat = [-Math.sin(az), Math.cos(az), 0], a = 0.34;
      const tmax = Math.PI / 2 + 0.32;
      const kante = (sg) => { const L = []; for (let t = 0; t <= tmax + 1e-6; t += tmax / 14) { const cc = [d[0] * Math.cos(t), d[1] * Math.cos(t), Math.sin(t)]; const p = nrm([cc[0] + lat[0] * sg * a / Rd, cc[1] + lat[1] * sg * a / Rd, cc[2]]); L.push([p[0] * Rd, p[1] * Rd, p[2] * Rd]); } return L; };
      const li = kante(1), re = kante(-1);
      let spalt = li.concat(re.slice().reverse());
      spalt = schneide(spalt, (p) => dot(p, eM) + 0.02);
      if (spalt.length >= 3) {
        const pts2 = spalt.map((p) => P([p[0], p[1], p[2] + zc]));
        g.save();
        g.beginPath(); pts2.forEach((q, i) => (i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]))); g.closePath();
        const gi = g.createLinearGradient(0, yz(zc + Rd), 0, yz(zc));
        gi.addColorStop(0, "rgb(30,34,44)"); gi.addColorStop(1, "rgb(52,50,54)");
        g.fillStyle = gi; g.fill();
        g.clip();
        /* Innenschale: Ringe des Gerippes, im Innern dunkler Raum */
        if (s > 12 && F.nacht < 0.3) {
          g.strokeStyle = "rgba(120,126,130,0.4)"; g.lineWidth = Math.max(0.6, 0.025 * s);
          g.beginPath();
          for (let t = 0.2; t < tmax; t += 0.22) { const q0 = P([d[0] * Math.cos(t) * Rd + lat[0] * 0.5, d[1] * Math.cos(t) * Rd + lat[1] * 0.5, zc + Math.sin(t) * Rd]), q1 = P([d[0] * Math.cos(t) * Rd - lat[0] * 0.5, d[1] * Math.cos(t) * Rd - lat[1] * 0.5, zc + Math.sin(t) * Rd]); g.moveTo(q0[0], q0[1]); g.lineTo(q1[0], q1[1]); }
          g.stroke();
        }
        /* Innen: Rippen und bei Nacht schwaches Rotlicht */
        if (F.nacht > 0.1) { g.fillStyle = "rgba(6,8,14," + (0.6 * F.nacht) + ")"; g.fillRect(-Rd * s, yz(zc + Rd), 2 * Rd * s, Rd * s * 1.6); }
        if (Z.fernrohr) fernrohr(true);
        g.restore();
        /* Spaltkanten (Blechzargen) */
        const kz = (L) => L.map((p) => [p[0], p[1], p[2] + zc]);
        linie(kz(li), lit(hell(PATINA, 0.2), lfN(LI)), Math.max(1, 0.05 * s), false);
        linie(kz(re), lit(hell(PATINA, -0.3), lfN([0.7, -0.7, 0])), Math.max(1, 0.05 * s), false);
      }
      if (Z.fernrohr) fernrohr(false);
      /* Blitzableiter auf dem Scheitel */
      const t0 = P([0, 0, zc + Rd]), t1 = P([0, 0, zc + Rd + 0.75]);
      g.strokeStyle = lit([150, 156, 160], lfN([0.7, 0.7, 0])); g.lineWidth = Math.max(1, 0.035 * s);
      g.beginPath(); g.moveTo(t0[0], t0[1]); g.lineTo(t1[0], t1[1]); g.stroke();
      g.fillStyle = lit([190, 160, 90], lfN(LI)); g.beginPath(); g.arc(t1[0], t1[1], Math.max(1, 0.06 * s), 0, TAU); g.fill();

      function fernrohr(innen) {
        const el = 38 * RAD, dir = [d[0] * Math.cos(el), d[1] * Math.cos(el), Math.sin(el)];
        const piv = [0, 0, zc + 0.25];
        const A = add(piv, mul(dir, innen ? -0.6 : Rd * 0.96)), E = add(piv, mul(dir, Rd + 0.85));
        if (!innen && dot(dir, eM) < 0.05) return;
        const pa = P(A), pe = P(E);
        const Lr = lfN(cam(nrm([dir[1], -dir[0], 0.4])));
        g.lineCap = "butt";
        g.strokeStyle = lit([232, 230, 220], Lr); g.lineWidth = 0.34 * s;
        g.beginPath(); g.moveTo(pa[0], pa[1]); g.lineTo(pe[0], pe[1]); g.stroke();
        g.strokeStyle = "rgba(0,0,0,0.25)"; g.lineWidth = 0.12 * s;
        const off = [0.06 * s, 0.06 * s];
        g.beginPath(); g.moveTo(pa[0] + off[0], pa[1] + off[1]); g.lineTo(pe[0] + off[0], pe[1] + off[1]); g.stroke();
        /* Messingringe, Objektiv */
        const ring = (k, br) => { const p = P(add(piv, mul(dir, k))); g.fillStyle = lit([196, 160, 80], Lr); g.beginPath(); g.arc(p[0], p[1], br * s, 0, TAU); g.fill(); };
        if (!innen) { ring(Rd + 0.83, 0.19); ring(Rd + 0.25, 0.18); const p = P(E); g.fillStyle = "rgb(20,24,34)"; g.beginPath(); g.arc(p[0], p[1], 0.12 * s, 0, TAU); g.fill(); g.fillStyle = "rgba(160,200,255,0.5)"; g.beginPath(); g.arc(p[0] - 0.03 * s, p[1] - 0.03 * s, 0.04 * s, 0, TAU); g.fill(); }
        else ring(0.2, 0.2);
      }
    };
  }
  /* unsichtbarer Körper für den Schatten der Kuppel auf dem Boden */
  function kuppelSchatten(M, Z) {
    if (Z.tambour <= 0) return;
    const K = KUPPEL, ht = K.ht * Z.tambour, n = 10;
    M.teil("kuppelschatten", { mitte: [K.x, K.y, DACHZ + 1] });
    const ring = (r, z) => { const L = []; for (let i = 0; i < n; i++) { const a = i * TAU / n; L.push([K.x + Math.cos(a) * r, K.y + Math.sin(a) * r, z]); } return L; };
    const leer = { keinLicht: true, keinAo: true };
    const z0 = DACHZ, z1 = DACHZ + ht;
    const stufen = [[K.rt, z0], [K.rt, z1]];
    if (Z.blech > 0) stufen.push([K.rd * 0.87, z1 + K.rd * 0.5], [K.rd * 0.5, z1 + K.rd * 0.87], [0.05, z1 + K.rd]);
    for (let k = 0; k < stufen.length - 1; k++) {
      const A = ring(stufen[k][0], stufen[k][1]), B = ring(stufen[k + 1][0], stufen[k + 1][1]);
      for (let i = 0; i < n; i++) { const j = (i + 1) % n; poly3(M, [A[i], A[j], B[j], B[i]], null, Object.assign({ name: "ks" + k + "-" + i, n: [A[i][0] - K.x, A[i][1] - K.y, 0.3] }, leer)); }
    }
  }

  /* =====================================================================
     SCHORNSTEIN (Laborofen)
     ===================================================================== */
  function kaminBauen(M, S, Z, B) {
    if (Z.kamin <= 0) return;
    const b = KAMIN.b / 2, x0 = KAMIN.x - b, x1 = KAMIN.x + b, y0 = KAMIN.y - b, y1 = KAMIN.y + b;
    const zo = DACHZ + (KAMIN.z1 - DACHZ) * Z.kamin, fertig = Z.kamin >= 1;
    M.teil("kamin", { mitte: [KAMIN.x, KAMIN.y, 9.8] });
    const mal = (g, F) => {
      verdecken(g, F, B, ATTIKA_OCC);
      ziegel(g, -0.1, -0.1, F.w + 0.2, F.h + 0.2, F, { farbe: S.klinker, fuge: FUGE, saat: 70 });
      const Y = (z) => zo - z;
      if (fertig) {
        for (const zb of [KAMIN.z1 - 0.15, KAMIN.z1 - 0.9]) { sandstein(g, -0.1, Y(zb), F.w + 0.2, 0.15, F, hell(S.sandstein, 0.05), { saat: 3 }); g.fillStyle = rgb(hell(S.sandstein, 0.25)); g.fillRect(-0.1, Y(zb), F.w + 0.2, 0.02); }
        g.fillStyle = "rgba(24,20,20,0.4)"; g.fillRect(-0.1, Y(KAMIN.z1 - 0.15), F.w + 0.2, 0.5);
        ziegel(g, -0.1, Y(9.3), F.w + 0.2, 0.231, F, { farbe: GELB, fuge: FUGE, saat: 71 });
      }
    };
    mal.direkt = true;
    wand(M, [x0, y1], [x1, y1], DACHZ - 0.5, zo, mal, { name: "ks", keinAo: true });
    wand(M, [x1, y1], [x1, y0], DACHZ - 0.5, zo, mal, { name: "ko", keinAo: true });
    wand(M, [x1, y0], [x0, y0], DACHZ - 0.5, zo, mal, { name: "kn", keinAo: true });
    wand(M, [x0, y0], [x0, y1], DACHZ - 0.5, zo, mal, { name: "kw", keinAo: true });
    poly3(M, [[x0, y0, zo], [x1, y0, zo], [x1, y1, zo], [x0, y1, zo]], (g, F) => {
      g.fillStyle = rgb(hell(S.sandstein, fertig ? 0.1 : -0.1)); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
      g.fillStyle = "rgb(22,20,20)"; g.fillRect(0.14, 0.14, F.w - 0.28, F.h - 0.28);
      if (S.winter && Z.schnee > 0 && fertig) { g.fillStyle = "rgba(246,249,253,0.85)"; g.fillRect(-0.1, -0.1, F.w + 0.2, 0.14); }
    }, { n: [0, 0, 1], name: "kopf" });
    if (fertig) {
      M.figur({ x: KAMIN.x - b + 0.08, y: KAMIN.y + b - 0.08, z: KAMIN.z1, breite: 0.2, hoehe: 0.9, schatten: false, malen: (g, s, F) => {
        if (F.schatten) return;
        const k = ST.KZ * s;
        g.strokeStyle = "rgb(120,126,130)"; g.lineWidth = Math.max(1, 0.03 * s);
        g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -0.85 * k); g.stroke();
        g.fillStyle = "rgb(170,150,90)"; g.beginPath(); g.arc(0, -0.85 * k, Math.max(1, 0.05 * s), 0, TAU); g.fill();
      } });
    }
  }

  /* =====================================================================
     WETTERMAST (Windfahne, Schalenkreuz) UND WETTERHÜTTE
     ===================================================================== */
  function mastFigur(S) {
    return function (g, s, F) {
      if (F.schatten) return;
      const KX = ST.KX, KY = ST.KY, KZ = ST.KZ;
      const r = (F.gier || 0) * RAD, c = Math.cos(r), sn = Math.sin(r);
      const P = (x, y, z) => { const X = x * c - y * sn, Yy = x * sn + y * c; return [(X - Yy) * KX * s, (X + Yy) * KY * s - z * KZ * s]; };
      const L = ST.lichtFaktor([0.7, 0.7, 0], F.Z, 0.05, F.jahr);
      const lit = (col) => rgb([col[0] * L[0], col[1] * L[1], col[2] * L[2]]);
      const H = 3.2;
      /* Mast mit Abspannung */
      g.strokeStyle = lit([60, 64, 66]); g.lineWidth = Math.max(1, 0.06 * s);
      const f = P(0, 0, 0), t = P(0, 0, H);
      g.beginPath(); g.moveTo(f[0], f[1]); g.lineTo(t[0], t[1]); g.stroke();
      g.strokeStyle = lit([90, 94, 96]); g.lineWidth = Math.max(0.5, 0.012 * s);
      g.beginPath(); for (const [x, y] of [[0.4, 0.3], [-0.45, 0.25], [0.05, -0.45]]) { const a = P(0, 0, H * 0.6), b = P(x, y, 0); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); } g.stroke();
      /* Schalenkreuz (Anemometer) */
      const zA = H * 0.78;
      const na = P(0, 0, zA);
      g.strokeStyle = lit([70, 72, 74]); g.lineWidth = Math.max(0.8, 0.02 * s);
      for (let i = 0; i < 3; i++) {
        const a = 0.4 + i * TAU / 3, e = P(Math.cos(a) * 0.35, Math.sin(a) * 0.35, zA);
        g.beginPath(); g.moveTo(na[0], na[1]); g.lineTo(e[0], e[1]); g.stroke();
        g.fillStyle = lit([200, 202, 204]); g.beginPath(); g.arc(e[0], e[1], Math.max(1, 0.07 * s), 0, TAU); g.fill();
        g.fillStyle = lit([90, 92, 96]); g.beginPath(); g.arc(e[0] + 0.015 * s, e[1], Math.max(0.6, 0.045 * s), 0, TAU); g.fill();
      }
      /* Windkreuz mit Buchstaben, darüber die Fahne (Pfeil) */
      const zK = H * 0.9;
      g.strokeStyle = lit([60, 64, 66]); g.lineWidth = Math.max(0.8, 0.02 * s);
      const kr = [["N", 0, -0.4], ["S", 0, 0.4], ["O", 0.4, 0], ["W", -0.4, 0]];
      for (const [b, x, y] of kr) {
        const m = P(0, 0, zK), e = P(x, y, zK);
        g.beginPath(); g.moveTo(m[0], m[1]); g.lineTo(e[0], e[1]); g.stroke();
        if (s > 24) { g.fillStyle = lit([200, 170, 90]); g.font = "bold " + (0.14 * s).toFixed(1) + "px 'DejaVu Sans', sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(b, e[0], e[1]); }
      }
      const wa = 205 * RAD, ux = Math.cos(wa), uy = Math.sin(wa);
      const pk = P(ux * 0.55, uy * 0.55, H), ps = P(-ux * 0.45, -uy * 0.45, H);
      g.strokeStyle = lit([40, 40, 42]); g.lineWidth = Math.max(1, 0.035 * s);
      g.beginPath(); g.moveTo(pk[0], pk[1]); g.lineTo(ps[0], ps[1]); g.stroke();
      /* Pfeilspitze und Fahne (senkrecht stehend) */
      g.fillStyle = lit([196, 160, 72]);
      const sp = [P(ux * 0.55, uy * 0.55, H), P(ux * 0.4, uy * 0.4, H + 0.09), P(ux * 0.4, uy * 0.4, H - 0.09)];
      g.beginPath(); sp.forEach((q, i) => (i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]))); g.closePath(); g.fill();
      const fa = [P(-ux * 0.2, -uy * 0.2, H), P(-ux * 0.45, -uy * 0.45, H + 0.24), P(-ux * 0.45, -uy * 0.45, H - 0.02)];
      g.beginPath(); fa.forEach((q, i) => (i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]))); g.closePath(); g.fill();
      const kg = P(0, 0, H + 0.1); g.beginPath(); g.arc(kg[0], kg[1], Math.max(1, 0.05 * s), 0, TAU); g.fill();
      if (F.jahr === "winter") { g.fillStyle = "rgba(246,249,253,0.9)"; g.beginPath(); g.arc(na[0], na[1] - 0.02 * s, Math.max(1, 0.04 * s), 0, TAU); g.fill(); }
    };
  }
  function huetteFigur(S) {
    return function (g, s, F) {
      if (F.schatten) return;
      const KX = ST.KX, KY = ST.KY, KZ = ST.KZ, AUGE = ST.ZUM_AUGE;
      const r = (F.gier || 0) * RAD, c = Math.cos(r), sn = Math.sin(r);
      const cam = (p) => [p[0] * c - p[1] * sn, p[0] * sn + p[1] * c, p[2]];
      const P = (x, y, z) => { const q = cam([x, y, z]); return [(q[0] - q[1]) * KX * s, (q[0] + q[1]) * KY * s - q[2] * KZ * s]; };
      const lit = (col, n) => { const L = ST.lichtFaktor(cam(n), F.Z, 0.03, F.jahr); return rgb([col[0] * L[0], col[1] * L[1], col[2] * L[2]]); };
      const b = 0.32, t = 0.26, z0 = 0.9, z1 = 1.55, weiss = [236, 234, 226];
      /* Beine */
      g.strokeStyle = lit([200, 198, 190], [0.7, 0.7, 0]); g.lineWidth = Math.max(1, 0.04 * s);
      g.beginPath(); for (const [x, y] of [[-b, -t], [b, -t], [b, t], [-b, t]]) { const a = P(x * 0.9, y * 0.9, 0), e = P(x * 0.9, y * 0.9, z0); g.moveTo(a[0], a[1]); g.lineTo(e[0], e[1]); } g.stroke();
      const seite = (n, pts, lamellen) => {
        if (dot(cam(n), AUGE) <= 0) return;
        const q = pts.map((p) => P(p[0], p[1], p[2]));
        g.fillStyle = lit(weiss, n); g.beginPath(); q.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.closePath(); g.fill();
        if (lamellen && s > 16) {
          g.strokeStyle = "rgba(90,90,96,0.45)"; g.lineWidth = Math.max(0.5, 0.01 * s);
          g.beginPath(); for (let k = 1; k < 7; k++) { const f = k / 7; const a = [pts[0][0] + (pts[3][0] - pts[0][0]) * f, pts[0][1] + (pts[3][1] - pts[0][1]) * f, pts[0][2] + (pts[3][2] - pts[0][2]) * f], e = [pts[1][0] + (pts[2][0] - pts[1][0]) * f, pts[1][1] + (pts[2][1] - pts[1][1]) * f, pts[1][2] + (pts[2][2] - pts[1][2]) * f]; const A = P(a[0], a[1], a[2]), E = P(e[0], e[1], e[2]); g.moveTo(A[0], A[1]); g.lineTo(E[0], E[1]); } g.stroke();
        }
      };
      seite([0, 1, 0], [[-b, t, z1], [b, t, z1], [b, t, z0], [-b, t, z0]], true);
      seite([0, -1, 0], [[b, -t, z1], [-b, -t, z1], [-b, -t, z0], [b, -t, z0]], true);
      seite([1, 0, 0], [[b, t, z1], [b, -t, z1], [b, -t, z0], [b, t, z0]], true);
      seite([-1, 0, 0], [[-b, -t, z1], [-b, t, z1], [-b, t, z0], [-b, -t, z0]], true);
      /* Satteldach */
      const zf = z1 + 0.14;
      seite([0, 1, 1.6], [[-b - 0.05, t + 0.05, z1], [b + 0.05, t + 0.05, z1], [b + 0.05, 0, zf], [-b - 0.05, 0, zf]], false);
      seite([0, -1, 1.6], [[b + 0.05, -t - 0.05, z1], [-b - 0.05, -t - 0.05, z1], [-b - 0.05, 0, zf], [b + 0.05, 0, zf]], false);
      if (F.jahr === "winter") { g.fillStyle = "rgba(246,249,253,0.95)"; const q = [P(-b - 0.05, t + 0.05, z1 + 0.02), P(b + 0.05, t + 0.05, z1 + 0.02), P(b + 0.05, 0, zf + 0.04), P(b + 0.05, -t - 0.05, z1 + 0.02), P(-b - 0.05, -t - 0.05, z1 + 0.02), P(-b - 0.05, 0, zf + 0.04)]; g.beginPath(); q.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.closePath(); g.fill(); }
    };
  }

  /* =====================================================================
     TREPPE, WEG, LATERNE ÜBER DEM PORTAL
     ===================================================================== */
  function treppeBauen(M, S, Z) {
    M.teil("treppe", { mitte: [0, BY1 + 0.5, 0.3] });
    const ss = hell(S.sandstein, 0.02);
    const stufe = (g, F) => {
      sandstein(g, -0.1, -0.1, F.w + 0.2, F.h + 0.2, F, ss, { saat: 140, fugen: 0.8 });
      g.fillStyle = rgb(hell(ss, 0.2)); g.fillRect(-0.1, -0.1, F.w + 0.2, 0.1);
      if (S.winter && Z.schnee > 0 && F.flaeche.n2 > 0.5) { g.fillStyle = "rgba(244,247,252,0.7)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); }
    };
    const yF = BY1, x0 = -TR_B, x1 = TR_B;
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
  function wegBauen(M, S, Z) {
    M.teil("weg", { ebene: -1, mitte: [0, 4, 0], schatten: false });
    const x0 = -1.3, x1 = 1.3, y0 = BY1 + TR_N * TR_T, y1 = 5.0;
    poly3(M, [[x0, y0, 0.012], [x1, y0, 0.012], [x1, y1, 0.012], [x0, y1, 0.012]], (g, F) => {
      const w = F.w, h = F.h;
      g.fillStyle = "rgb(150,146,138)"; g.fillRect(-0.1, -0.1, w + 0.2, h + 0.2);
      if (F.px > 8) {
        /* Sandsteinplatten im Läuferverband */
        const rng = zufall(9);
        for (let y = 0; y < h; y += 0.5) for (let x = -((y / 0.5) % 2) * 0.35; x < w; x += 0.7) {
          g.fillStyle = rgb(streu(hell(S.sandstein, -0.08), rng, 0.08)); g.fillRect(x + 0.015, y + 0.015, 0.67, 0.47);
        }
      }
      rausch(g, 0, 0, w, h, 1.5, 0.22, 7, 3);
      if (S.winter) { g.fillStyle = "rgba(240,244,250,0.55)"; g.fillRect(-0.1, -0.1, w + 0.2, h + 0.2); g.fillStyle = "rgba(250,252,255,0.95)"; g.fillRect(-0.1, -0.1, 0.18, h + 0.2); g.fillRect(w - 0.08, -0.1, 0.2, h + 0.2); }
      else if (S.herbst) laub(g, 0, 0, w, h, 40, 5);
    }, { n: [0, 0, 1], name: "weg", keinAo: true });
  }
  function laterneFigur(S) {
    return function (g, s, F) {
      const k = ST.KZ * s;
      if (F.schatten) return;
      const L = ST.lichtFaktor([0, 0.7, 0.7], F.Z, 0, F.jahr);
      const c = (col) => rgb([col[0] * L[0], col[1] * L[1], col[2] * L[2]]);
      /* Wandarm und Laterne */
      g.strokeStyle = c([34, 36, 36]); g.lineWidth = Math.max(1, 0.03 * s);
      g.beginPath(); g.moveTo(0, -0.62 * k); g.quadraticCurveTo(0.02 * s, -0.8 * k, -0.02 * s, -0.95 * k); g.stroke();
      g.fillStyle = c([30, 34, 32]);
      g.beginPath(); g.moveTo(-0.12 * s, -0.62 * k); g.lineTo(0.12 * s, -0.62 * k); g.lineTo(0, -0.74 * k); g.closePath(); g.fill();
      const an = F.nacht > 0.05;
      g.fillStyle = an ? "rgba(255,214,150," + (0.6 + 0.4 * F.nacht) + ")" : c([150, 164, 170]);
      g.beginPath(); g.moveTo(-0.09 * s, -0.62 * k); g.lineTo(0.09 * s, -0.62 * k); g.lineTo(0.07 * s, -0.28 * k); g.lineTo(-0.07 * s, -0.28 * k); g.closePath(); g.fill();
      g.fillStyle = c([30, 34, 32]); g.fillRect(-0.09 * s, -0.3 * k, 0.18 * s, 0.05 * k);
      if (F.jahr === "winter") { g.fillStyle = c([246, 249, 253]); g.beginPath(); g.moveTo(-0.1 * s, -0.63 * k); g.lineTo(0.1 * s, -0.63 * k); g.lineTo(0, -0.72 * k); g.closePath(); g.fill(); }
      if (an && F.leuchtPunkt) F.leuchtPunkt(0, -0.45 * k, 0.9 * s, "255,206,140", 0.6);
      void S;
    };
  }

  /* =====================================================================
     DAS MODELL
     ===================================================================== */
  ST.modell("labor", {
    name: "Labor", gruppe: "Häuser", grund: [10, 10], hoehe: 12, bauzeit: 15 * 60,
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
        klinker: KLINKER[saat % KLINKER.length], sandstein: SANDSTEINE[(saat >> 1) % SANDSTEINE.length]
      };
      if (Z.grubeT > 0.01 || bau < 0.24) {
        if (Z.grubeT > 0.01) grubeBauen(M, S, Z);
        if (Z.aushub > 0.02) {
          M.teil("aushub", { mitte: [-3.4, 4.6, 0.6] });
          M.figur({ x: -3.2, y: 4.4, z: 0, breite: 4.2, hoehe: 1.7, malen: aushubFigur(Z.aushub, S.winter) });
        }
      }
      if (Z.kellerZ != null && bau < 0.29) {
        M.teil("kellersohle", { ebene: -3, mitte: [0, 0, -2], schatten: false });
        kellerSohle(M, S, Z);
        mauerRing(M, S, Z, -Math.max(0.02, Math.min(TIEFE - 0.3, Z.grubeT)), Math.min(0, Z.kellerZ), false, { mitInnen: true, innen0: -TIEFE + 0.3 });
      }
      if (Z.mauerZ > 0.01) mauerRing(M, S, Z, 0, Z.mauerZ, Z.dach, { mitInnen: !Z.dach });
      dachBauen(M, S, Z);
      kaminBauen(M, S, Z, B);
      if (Z.tambour > 0) {
        M.teil("kuppel", { mitte: [KUPPEL.x, KUPPEL.y, 10.2] });
        M.figur({ x: KUPPEL.x, y: KUPPEL.y, z: DACHZ, breite: 4.6, hoehe: KUPPEL.ht + KUPPEL.rd + 1.2, schatten: false, malen: kuppelFigur(S, Z) });
        kuppelSchatten(M, Z);
      }
      if (Z.mast) { M.teil("mast", { mitte: [MAST[0], MAST[1], 9.5] }); M.figur({ x: MAST[0], y: MAST[1], z: DACHZ, breite: 2.2, hoehe: 3.6, schatten: false, malen: mastFigur(S) }); }
      if (Z.huette) { M.teil("huette", { mitte: [HUETTE[0], HUETTE[1], 8.7] }); M.figur({ x: HUETTE[0], y: HUETTE[1], z: DACHZ, breite: 1.2, hoehe: 1.8, schatten: false, malen: huetteFigur(S) }); }
      if (bau >= 0.29) treppeBauen(M, S, Z);
      if (Z.ausstattung) {
        wegBauen(M, S, Z);
        M.teil("laterne", { mitte: [0, BY1 + 0.25, 3.6] });
        M.figur({ x: 0, y: BY1 + 0.12, z: 3.95, breite: 0.4, hoehe: 1.0, schatten: false, malen: laterneFigur(S) });
      }
      if (Z.licht) { M.licht(0, BY1 + 0.2, 3.6, 2.2, "255,204,140", 0.8); M.bodenlicht(0, BY1 + 1.2, 2.2, "255,200,130", 0.8); }
      if (Z.fertig) M.rauchAus(KAMIN.x, KAMIN.y, KAMIN.z1 + 0.1, S.winter ? 0.9 : 0.5);
      beschleunigen(M);
    }
  });
})();
