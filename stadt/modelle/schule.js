/* =====================================================================
   SCHULE — alte Dorfschule um 1900
   ---------------------------------------------------------------------
   XANDER: „richtig filigran. Richtig schön ausarbeiten mit schönen
   Texturen" · „keine Comic Grafik … viel mehr am Realismus" · „ohne
   Pixelkanten und komische Vektorrückstände" · „Man soll das Fundament
   sehen beim Aufbauen" · „Du bist dein schlimmster Kritiker" · Stil „von
   Anno oder geiler", „trotzdem mit SVG Grafiken".

   VORBILD: preußische und hessische Volksschulen der Kaiserzeit (Typen-
   entwürfe um 1895–1910). Zweigeschossiger Backsteinbau im Kreuzverband
   auf einem Sockel aus gelbem Sandstein (Hochparterre), gelbe Klinker-
   bänder, Stichbogenfenster mit Rollschicht und Schlussstein, hohe weiße
   Sprossenfenster mit Oberlicht (die Klassenzimmer brauchten Licht),
   Kordongesims, Traufgesims mit Deutschem Band. In der Mitte ein
   Risalit mit Giebel und Uhr, darunter das Sandsteinportal mit Freitreppe
   und dem Schriftzug „SCHULE" auf dem Gebälk. Auf dem First ein
   Glockentürmchen (Dachreiter) mit offener Glockenstube: die Schulglocke
   rief morgens die Kinder aus dem Dorf. Schieferdach, zwei Kamine (jedes
   Klassenzimmer hatte seinen Ofen). Davor der Schulhof mit Kies, einem
   gusseisernen Zaun auf Backsteinsockel mit Pfeilern und – dezent – ein
   Turnreck.

   MASSE (Meter; Mitte des Grundrisses = 0,0,0; Front nach Süden, +y)
     Haus        11,2 × 6,0 (y −4,3 … 1,7), Sockel bis 0,9 (Hochparterre)
     Geschosse   EG 0,9 … 4,4 · Kordongesims 4,4 … 4,6 · OG bis 8,1
     Risalit     3,4 breit, 0,4 vor der Front, Giebel bis 9,8 mit Uhr
     Dach        Satteldach 42°, First 11,0, Schiefer
     Dachreiter  1,2 × 1,2, Glockenstube 11,8 … 12,6, Spitze ≈ 14,0
     Hof         bis y 4,2, Zaun 1,15 hoch, Freitreppe sechs Stufen
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT, PI = ST.pinsel;
  const hex = PI.hex, rgb = PI.rgb, misch = PI.misch, hell = PI.hell;

  /* =====================================================================
     MASSE
     ===================================================================== */
  const RAD_ = Math.PI / 180;
  const X0 = -5.6, X1 = 5.6, YN = -4.3, YS = 1.7;      // Hauskanten
  const RB = 1.7, YR = 2.1;                             // Risalit: halbe Breite, Front
  const ZS = 0.9, ZE = 4.4, ZK = 4.6, ZT = 8.1;         // Sockel, Kordon unten/oben, Traufwand
  const NEIG = 42 * RAD_, TN = Math.tan(NEIG), CN = Math.cos(NEIG), SN = Math.sin(NEIG);
  const YM = (YN + YS) / 2, HALB = (YS - YN) / 2;
  const ZDT = ZT + 0.2, ZF = ZDT + HALB * TN;            // Dachhaut an der Wandlinie, First ≈ 11,0
  const UE = 0.45, UEG = 0.3;
  const YTS = YS + UE, YTN = YN - UE;
  const dachZ = (y) => ZF - Math.abs(y - YM) * TN;
  const ZTR = dachZ(YTS);
  const QZF = ZDT + RB * TN;                             // First des Risalitdachs ≈ 9,83
  const kehleY = (x) => YM + (ZF - QZF) / TN + Math.abs(x);
  const YRD = YR + 0.3;                                  // Vorderkante Risalitdach
  const ZG = QZF - 0.2;                                  // Giebelspitze unter dem Dach
  const UHR_Z = 8.72, UHR_R = 0.34;
  /* Dachreiter */
  const RX = 0.6, RY0 = YM - RX, RY1 = YM + RX, RZ1 = 11.72, ZG0 = RZ1 + 0.1, ZG1 = ZG0 + 0.8;
  /* Kamine auf dem First */
  const KAMINE = [-3.7, 3.7];
  /* Freitreppe */
  const TR_B = 1.15, TR_N = 6, TR_A = 0.3, TR_H = ZS / 6;
  /* Hof und Zaun */
  const HOF_Y = 4.2, ZX = 5.95, TOR = 1.35, ZAUN_H = 1.15;
  const RECK = [3.9, 3.05];

  /* ---------------- Farben ---------------- */
  const SANDSTEIN = [196, 180, 146];     // gelber Sandstein (Sockel, Gesimse, Portal)
  const SANDSTEIN_H = [212, 198, 164];
  const BACKSTEIN = [150, 64, 46];
  const KLINKER = [222, 194, 136];      // gelbe Zierziegel
  const MOERTEL = [198, 190, 176];
  const HOLZ = [60, 76, 64];            // Anstrich Holz: Schulgrün
  const HOLZ_ROH = [176, 136, 92];
  const ZIEGEL = "#a14a30";
  const SCHIEFER = [70, 76, 90];
  const GOLD = [214, 168, 72];
  const EISEN = [34, 36, 38];
  const WEISS = [238, 236, 228];
  const BRONZE = [150, 110, 56];
  /* ---------------- kleine Werkzeuge ---------------- */
  const klemm = (x, a, b) => (x < a ? a : x > b ? b : x);
  const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const kreuz = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const nrm = (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const RAD = Math.PI / 180, TAU = Math.PI * 2;
  const zufall = (n) => ST.zufall((n >>> 0) || 1);
  const glatt = (x) => { x = klemm(x, 0, 1); return x * x * (3 - 2 * x); };
  const phase = (bau, a, b) => klemm((bau - a) / (b - a), 0, 1);
  const AUSSEN = 100;          // Anbauten einer Fassade: Mitte weit vor die Wand (Reihenfolge)


  /* =====================================================================
     GEMEINSAME HELFER
     ===================================================================== */
  function poly(g, p) { g.beginPath(); g.moveTo(p[0][0], p[0][1]); for (let i = 1; i < p.length; i++) g.lineTo(p[i][0], p[i][1]); g.closePath(); }
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

  /* Farbe → Pinselfarbe. Normale Flächen: der Kern legt das Licht darüber
     (L0). Offene Bauteile (Gerippe, Lattung, Gitter) sind durchsichtig und
     rechnen das Licht selbst (Lm) – von hinten gesehen mit der Rückseite. */
  const L0 = (c, a) => rgb(c, a);
  function lichtVon(F) {
    const n = (F.sicht == null || F.sicht >= 0) ? F.n : [-F.n[0], -F.n[1], -F.n[2]];
    return ST.lichtFaktor(n, F.zeit, 0, F.jahr);
  }
  function Lm(F, k) {
    const lf = lichtVon(F), m = k || 1;
    return (c, a) => rgb([c[0] * lf[0] * m, c[1] * lf[1] * m, c[2] * lf[2] * m], a);
  }

  /* ---------------- Blickrichtung ----------------
     bauen() kennt den Drehwinkel nicht – eine unsichtbare Figur, die als
     allererste gemalt wird, merkt ihn sich (wie im Fachwerkhaus). */
  function neuerBlick() { return { c: 1, s: 0, e: [0.6124, 0.6124, 0.5] }; }
  function blickSetzen(B, gier) {
    const r = gier * RAD, c = Math.cos(r), s = Math.sin(r);
    B.c = c; B.s = s; B.e = [0.6124 * (c + s), 0.6124 * (c - s), 0.5];
  }
  /* Versatz eines Punkts in der Tiefe d hinter der Fläche (Flächenkoordinaten) */
  function parallaxe(F, B, d) {
    const f = F.flaeche, n = kreuz(f.u, f.v);
    const en = Math.max(0.12, dot(B.e, n));
    return [d * dot(B.e, f.u) / en, d * dot(B.e, f.v) / en];
  }

  /* ---------------- Flächen ---------------- */
  /* Senkrechte Wand von p0 nach p1 (von außen links → rechts) */
  function wand(M, name, p0, p1, z0, z1, malen, extra) {
    const dx = p1[0] - p0[0], dy = p1[1] - p0[1], w = Math.hypot(dx, dy);
    return M.flaeche(Object.assign({ name: name, o: [p0[0], p0[1], z1], u: [dx / w, dy / w, 0], v: [0, 0, -1], w: w, h: z1 - z0, malen: malen }, extra || {}));
  }
  /* Kasten; m = { s, n, o, w, t } (Süd, Nord, Ost, West, oben) */
  function kiste(M, name, x0, y0, z0, x1, y1, z1, m, extra) {
    const ex = (s) => Object.assign({ keinAo: z0 > 0.05 }, extra || {}, { name: name + "-" + s });
    if (m.s) wand(M, "", [x0, y1], [x1, y1], z0, z1, m.s, ex("s"));
    if (m.n) wand(M, "", [x1, y0], [x0, y0], z0, z1, m.n, ex("n"));
    if (m.o) wand(M, "", [x1, y1], [x1, y0], z0, z1, m.o, ex("o"));
    if (m.w) wand(M, "", [x0, y0], [x0, y1], z0, z1, m.w, ex("w"));
    if (m.t) M.flaeche(Object.assign({}, extra || {}, { name: name + "-t", o: [x0, y0, z1], u: [1, 0, 0], v: [0, 1, 0], w: x1 - x0, h: y1 - y0, malen: m.t, ao: false }));
  }
  /* Ebenes Vieleck im Raum: n = Außennormale, uR = Richtung „rechts" */
  function vieleck(M, name, pts, n, uR, malen, extra) {
    n = nrm(n);
    const u = nrm(sub(uR, mul(n, dot(uR, n)))), v = kreuz(n, u);
    const ab = pts.map((p) => [dot(p, u), dot(p, v)]);
    let a0 = 1e9, b0 = 1e9, a1 = -1e9, b1 = -1e9;
    for (const q of ab) { a0 = Math.min(a0, q[0]); b0 = Math.min(b0, q[1]); a1 = Math.max(a1, q[0]); b1 = Math.max(b1, q[1]); }
    const o = add(add(mul(u, a0), mul(v, b0)), mul(n, dot(pts[0], n)));
    return M.flaeche(Object.assign({ name: name, o: o, u: u, v: v, w: a1 - a0, h: b1 - b0, umriss: ab.map((q) => [q[0] - a0, q[1] - b0]), malen: malen, keinAo: true }, extra || {}));
  }
  /* Rechteck mit Mitte c, Normale n, Richtung u */
  function rechteck(M, name, c, n, u, w, h, malen, extra) {
    n = nrm(n); u = nrm(u);
    const v = kreuz(n, u);
    const o = sub(sub(c, mul(u, w / 2)), mul(v, h / 2));
    return M.flaeche(Object.assign({ name: name, o: o, u: u, v: v, w: w, h: h, malen: malen, keinAo: true }, extra || {}));
  }
  /* Dünner Stab (Fahnenstange, Pfosten) als vierseitiger Kasten */
  function stab(M, name, P0, P1, b, farbe, extra) {
    const ax = sub(P1, P0), L = Math.hypot(ax[0], ax[1], ax[2]);
    const U = mul(ax, 1 / L);
    let Q = Math.abs(U[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1];
    Q = nrm(sub(Q, mul(U, dot(Q, U))));
    const R = nrm(kreuz(U, Q)), mid = add(P0, mul(ax, 0.5));
    const mal = (g, F) => { const gr = g.createLinearGradient(0, 0, 0, F.h); gr.addColorStop(0, rgb(hell(farbe, 0.2))); gr.addColorStop(1, rgb(hell(farbe, -0.15))); g.fillStyle = gr; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); };
    for (const [n, w] of [[Q, b], [mul(Q, -1), b], [R, b], [mul(R, -1), b]]) rechteck(M, name, add(mid, mul(n, b / 2)), n, U, L, w, mal, extra);
  }

  /* =====================================================================
     WERKSTOFFE
     ===================================================================== */
  /* Sandstein-Quader, Lage für Lage von unten; frisch = oberste Lage heller */
  function quaderwerk(g, F, L, x, y, w, h, opt) {
    opt = opt || {};
    const rng = zufall(opt.saat || 5), px = F.px;
    const basis = opt.farbe || SANDSTEIN, lage = opt.lage || 0.34;
    g.fillStyle = L(hell(basis, -0.3)); g.fillRect(x, y, w, h);
    if (px < 3) { g.fillStyle = L(basis); g.fillRect(x, y, w, h); return; }
    let yy = y + h, reihe = 0;
    const fuge = Math.max(0.012, 0.8 / px);
    while (yy > y + 0.001) {
      const lh = Math.min(lage * (0.85 + rng() * 0.3), yy - y);
      let xx = x - (reihe % 2 ? lage * 0.9 : 0) - rng() * 0.15;
      while (xx < x + w) {
        const lw = lage * (1.4 + rng() * 1.3);
        let c = PI.streu(basis, rng, 0.09);
        if (rng() < 0.12) c = misch(c, [206, 170, 140], 0.35);     // hellere, gelbliche Steine
        const bx = Math.max(x, xx) + fuge / 2, bw = Math.min(x + w, xx + lw) - Math.max(x, xx) - fuge;
        if (bw > 0.02) {
          g.fillStyle = L(c);
          g.fillRect(bx, yy - lh + fuge / 2, bw, lh - fuge);
          if (px > 16) {
            g.fillStyle = L([255, 236, 214], 0.16); g.fillRect(bx, yy - lh + fuge / 2, bw, Math.max(0.008, 1 / px));
            g.fillStyle = L([50, 24, 16], 0.2); g.fillRect(bx, yy - fuge / 2 - Math.max(0.008, 1 / px), bw, Math.max(0.008, 1 / px));
          }
          if (opt.bossen && px > 10) {
            /* Bossen: die Steinfläche steht als Kissen vor, Randschlag ringsum */
            const r = Math.min(0.05, lh * 0.18);
            g.fillStyle = L(hell(c, 0.1), 0.6); g.fillRect(bx + r, yy - lh + fuge / 2 + r, bw - 2 * r, lh - fuge - 2 * r);
            g.fillStyle = L(hell(c, -0.25), 0.5); g.fillRect(bx + r, yy - fuge / 2 - r - 0.012, bw - 2 * r, 0.012);
          }
        }
        xx += lw;
      }
      yy -= lh; reihe++;
    }
    if (px > 6) rausch(g, x, y, w, h, 1.7, 0.2, (opt.saat || 5) + 3, 3);
    if (px > 30) rausch(g, x, y, w, h, 0.45, 0.12, (opt.saat || 5) + 8, 2);
  }
  function putz(g, F, L, x, y, w, h, farbe, saat) {
    g.fillStyle = L(farbe); g.fillRect(x, y, w, h);
    if (F.px > 5) {
      rausch(g, x, y, w, h, 3.0, 0.14, saat, 4);
      if (F.px > 26) rausch(g, x, y, w, h, 0.5, 0.09, saat + 7, 3);
      bleich(g, x, y, w, h, 2.2, 0.08, saat);
    }
  }
  /* Ein gerades Holz (Ständer, Riegel, Strebe) */
  function holz(g, F, L, x0, y0, x1, y1, b, c, saat) {
    const len = Math.hypot(x1 - x0, y1 - y0); if (len < 1e-4) return;
    const rng = zufall(saat), px = F.px;
    g.save(); g.translate(x0, y0); g.rotate(Math.atan2(y1 - y0, x1 - x0));
    const cc = PI.streu(c, rng, 0.07);
    g.fillStyle = L(cc); g.fillRect(-0.004, -b / 2, len + 0.008, b);
    if (px * b > 3.5) {
      g.fillStyle = L(hell(cc, 0.16)); g.fillRect(0, -b / 2, len, b * 0.13);
      g.fillStyle = L(hell(cc, -0.3)); g.fillRect(0, b / 2 - b * 0.15, len, b * 0.15);
    }
    if (px * b > 8) {
      const n = Math.min(7, Math.round(b * 38));
      g.lineWidth = Math.max(0.003, 0.8 / px);
      g.strokeStyle = L(hell(cc, -0.32), 0.4);
      g.beginPath();
      for (let i = 0; i < n; i++) {
        const yy = -b / 2 + b * (i + 0.5) / n + (rng() - 0.5) * b * 0.05;
        g.moveTo(rng() * len * 0.15, yy);
        for (let k = 1; k <= 4; k++) g.lineTo(len * k / 4 - (k < 4 ? rng() * 0.1 : 0), yy + (rng() - 0.5) * b * 0.06);
      }
      g.stroke();
      /* Trockenrisse und Holznägel */
      g.strokeStyle = L(hell(cc, -0.6), 0.7); g.lineWidth = Math.max(0.004, 1.1 / px);
      g.beginPath();
      const risse = Math.floor(len * 0.9 * rng());
      for (let i = 0; i < risse; i++) { const sx = rng() * len * 0.8, yy = (rng() - 0.5) * b * 0.4; g.moveTo(sx, yy); g.lineTo(Math.min(len, sx + 0.15 + rng() * 0.4), yy + (rng() - 0.5) * 0.02); }
      g.stroke();
      if (len > 0.5 && px > 30) { g.fillStyle = L(hell(cc, -0.4)); for (const q of [b * 0.5, len - b * 0.5]) { g.beginPath(); g.arc(q, 0, b * 0.08, 0, TAU); g.fill(); } }
    }
    g.restore();
  }
  /* Ein geschweiftes Holz (Kopfband, Feuerbock, Wilder Mann) */
  function krumm(g, F, L, p, b, c) {
    g.save();
    g.lineCap = "butt"; g.lineJoin = "round";
    const pfad = (dx, dy) => { g.beginPath(); g.moveTo(p[0] + dx, p[1] + dy); if (p.length === 6) g.quadraticCurveTo(p[2] + dx, p[3] + dy, p[4] + dx, p[5] + dy); else g.bezierCurveTo(p[2] + dx, p[3] + dy, p[4] + dx, p[5] + dy, p[6] + dx, p[7] + dy); };
    pfad(0, 0); g.lineWidth = b; g.strokeStyle = L(c); g.stroke();
    if (F.px * b > 3.5) {
      pfad(b * 0.28, b * 0.28); g.lineWidth = b * 0.3; g.strokeStyle = L(hell(c, -0.28), 0.8); g.stroke();
      pfad(-b * 0.3, -b * 0.3); g.lineWidth = b * 0.18; g.strokeStyle = L(hell(c, 0.16), 0.8); g.stroke();
    }
    g.restore();
  }

  /* ---------------- Schnee, Eis, Laub ---------------- */
  function schneeFlaeche(g, F, x, y, w, h, saat) {
    const rng = zufall(saat * 131 + 7);
    const gr = g.createLinearGradient(0, y, 0, y + h);
    gr.addColorStop(0, "rgb(236,241,249)"); gr.addColorStop(1, "rgb(247,250,254)");
    g.fillStyle = gr; g.fillRect(x, y, w, h);
    if (F.px < 4) return;
    tonFlecken(g, x, y, w, h, 2.6, 0.5, saat + 3, "#a9bbdc", true);
    tonFlecken(g, x, y, w, h, 1.3, 0.45, saat + 9, "#fbfdff", true);
    rausch(g, x, y, w, h, 2.4, 0.08, saat + 31, 3);
    if (F.px > 20) {
      g.fillStyle = "rgba(255,255,255,0.95)";
      g.beginPath();
      const k = Math.min(400, Math.round(w * h * 6));
      for (let i = 0; i < k; i++) { const r = (0.5 + rng() * 0.8) / F.px; g.rect(x + rng() * w, y + rng() * h, r, r); }
      g.fill();
    }
  }
  /* Schneehaube auf einer waagerechten Fläche (Sims, Stufe, Mauerkrone) */
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
  /* weiße Kappe auf einer Kante in einer senkrechten Fläche (Gesims, Sohlbank) */
  function schneeKappe(g, F, x, y, w, d, saat) {
    const rng = zufall(saat);
    g.fillStyle = "rgb(244,247,252)";
    g.beginPath(); g.moveTo(x - 0.01, y);
    for (let t = 0; t <= 1.0001; t += 0.1) g.lineTo(x + w * t, y - d * (0.75 + rng() * 0.5));
    g.lineTo(x + w + 0.01, y); g.lineTo(x + w + 0.01, y + d * 0.35); g.lineTo(x - 0.01, y + d * 0.35); g.closePath(); g.fill();
    g.fillStyle = "rgba(170,188,220,0.45)"; g.fillRect(x, y + d * 0.2, w, d * 0.15);
  }
  function eiszapfen(g, F, x0, x1, y0, maxL, saat, L) {
    const rng = zufall(saat);
    const Zp = [];
    let x = x0 + rng() * 0.2;
    while (x < x1 - 0.03) {
      const gruppe = rng() < 0.25;
      const l = maxL * (gruppe ? 0.45 + rng() * 0.55 : 0.08 + Math.pow(rng(), 2) * 0.5), b = 0.014 + l * 0.07;
      Zp.push([x, l, b]);
      x += gruppe ? 0.04 + rng() * 0.06 : 0.14 + rng() * 0.5;
    }
    g.beginPath();
    for (const [x, l, b] of Zp) { g.moveTo(x - b, y0); g.quadraticCurveTo(x - b * 0.5, y0 + l * 0.55, x, y0 + l); g.quadraticCurveTo(x + b * 0.5, y0 + l * 0.55, x + b, y0); g.closePath(); }
    g.fillStyle = L([214, 232, 248], 0.75); g.fill();
    g.strokeStyle = L([255, 255, 255], 0.85); g.lineWidth = Math.max(0.004, 0.9 / F.px);
    g.beginPath(); for (const [x, l, b] of Zp) { g.moveTo(x - b * 0.45, y0 + 0.01); g.lineTo(x - b * 0.1, y0 + l * 0.7); } g.stroke();
  }
  function laub(g, F, x, y, w, h, dichte, saat) {
    if (F.px < 6) return;
    const rng = zufall(saat), n = Math.min(260, Math.round(w * h * dichte));
    const farben = [[196, 92, 36], [214, 150, 48], [150, 70, 34], [180, 120, 40], [120, 60, 30]];
    for (let i = 0; i < n; i++) {
      const c = farben[(rng() * farben.length) | 0], r = 0.035 + rng() * 0.035;
      g.fillStyle = rgb(c, 0.9);
      g.beginPath(); g.ellipse(x + rng() * w, y + rng() * h, r, r * 0.55, rng() * TAU, 0, TAU); g.fill();
    }
  }

  /* ---------------- Dachdeckung ----------------
     Biberschwanz-Doppeldeckung (Pinsel) und Schiefer in Schuppenform */
  /* Biberschwanz-Doppeldeckung, Reihe für Reihe von der Traufe zum First:
     der runde Schwanz jeder Reihe liegt über der Reihe darunter und wirft
     dort einen feinen Schatten. Wenige, ruhige Farbtöne (je Ton ein Pfad)
     statt Einzelfarben – sonst rauscht das Dach wie ein Pixelbild. */
  function biber(g, F, L, x, y, w, h, basis, saat, opt) {
    opt = opt || {};
    const zr = opt.reihe || 0.155, zb = opt.breite || 0.18, px = F.px;
    const rng = zufall(saat);
    g.fillStyle = L(hell(basis, -0.42)); g.fillRect(x, y, w, h);
    const toene = [hell(basis, -0.1), hell(basis, -0.04), basis, hell(basis, 0.05), misch(basis, [96, 52, 40], 0.4), misch(basis, [128, 120, 84], 0.35)];
    if (px * zr < 2.4) {
      for (let yy = y + h - zr, i = 0; yy > y - zr; yy -= zr, i++) { g.fillStyle = L(toene[i % 4]); g.fillRect(x, yy, w, zr * 0.82); }
      if (px > 3) rausch(g, x, y, w, h, 4, 0.14, saat, 3);
      return;
    }
    const n = Math.ceil(h / zr) + 1, rb = zb * 0.47, rv = zr * 0.55;
    for (let i = 0; i < n; i++) {
      const yT = y + h - (i + 1) * zr;                 // Oberkante des sichtbaren Bands
      const vs = (i % 2) * zb / 2;
      const pf = toene.map(() => new Path2D()), sch = new Path2D();
      for (let xx = x - zb + vs; xx < x + w; xx += zb) {
        const xm = xx + zb / 2, yu = yT + zr;
        const r = rng();
        const t = r < 0.035 ? 4 : r < 0.05 && i < 4 ? 5 : (rng() * 4) | 0;
        const p = pf[t];
        p.moveTo(xm - rb, yT - zr); p.lineTo(xm - rb, yu - rv * 0.3);
        p.ellipse(xm, yu - rv * 0.3, rb, rv, 0, Math.PI, 0, true);
        p.lineTo(xm + rb, yT - zr); p.closePath();
        sch.moveTo(xm + 0.012 + rb, yu - rv * 0.3 + 0.022); sch.ellipse(xm + 0.012, yu - rv * 0.3 + 0.022, rb, rv, 0, 0, Math.PI);
      }
      g.fillStyle = "rgba(34,12,6,0.42)"; g.fill(sch);
      toene.forEach((c, k) => { g.fillStyle = L(c); g.fill(pf[k]); });
      if (px * zr > 7) {
        /* Licht auf der Rundung, Schatten unter dem Band darüber */
        g.fillStyle = "rgba(255,230,200,0.07)"; g.fillRect(x, yT + zr * 0.55, w, zr * 0.3);
        g.fillStyle = "rgba(30,10,6,0.16)"; g.fillRect(x, yT, w, zr * 0.18);
      }
    }
    rausch(g, x, y, w, h, 4.5, 0.13, saat + 8, 4);
    if (px > 20) rausch(g, x, y, w, h, 0.9, 0.08, saat + 3, 2);
    /* Schmutzfahnen und Flechten */
    tonFlecken(g, x, y, w, h, 5.5, 0.12, saat + 5, "#5e4a3a", false);
  }
  function schuppen(g, F, L, x, y, w, h, c, saat, reihe) {
    const rng = zufall(saat), zr = reihe || 0.14, zb = zr * 1.25;
    g.fillStyle = L(hell(c, -0.35)); g.fillRect(x, y, w, h);
    if (F.px * zr < 2.5) { g.fillStyle = L(c); g.fillRect(x, y, w, h); if (F.px > 3) rausch(g, x, y, w, h, 2, 0.2, saat, 3); return; }
    const toene = [hell(c, -0.08), c, hell(c, 0.07), hell(c, 0.13)];
    const n = Math.ceil(h / zr) + 1;
    for (let k = 0; k < n; k++) {
      const yy = y + h - (k + 1) * zr, vs = (k % 2) * zb / 2;
      const pf = toene.map(() => new Path2D()), sch = new Path2D();
      for (let xx = x - zb + vs; xx < x + w; xx += zb) {
        const p = pf[(rng() * 4) | 0];
        p.moveTo(xx + zb * 0.05, yy - zr); p.lineTo(xx + zb * 0.05, yy + zr * 0.6); p.quadraticCurveTo(xx + zb / 2, yy + zr * 1.5, xx + zb * 0.95, yy + zr * 0.6); p.lineTo(xx + zb * 0.95, yy - zr); p.closePath();
        sch.moveTo(xx + zb * 0.05, yy + zr * 0.7); sch.quadraticCurveTo(xx + zb / 2, yy + zr * 1.7, xx + zb * 0.95, yy + zr * 0.7); sch.closePath();
      }
      g.fillStyle = "rgba(10,12,20,0.4)"; g.fill(sch);
      toene.forEach((t, i) => { g.fillStyle = L(t); g.fill(pf[i]); });
    }
    rausch(g, x, y, w, h, 1.6, 0.16, saat + 2, 3);
  }
  /* Schnee auf einer Dachfläche: x0…x1, yOben = First, yTraufe = Traufe */
  function dachSchnee(g, F, x0, x1, yOben, yTraufe, saat, reihe) {
    const w = x1 - x0, h = yTraufe - yOben, rng = zufall(saat * 7 + 3), zr = reihe || 0.15;
    schneeFlaeche(g, F, x0 - 0.1, yOben - 0.05, w + 0.2, h + 0.1, saat);
    if (F.px * zr > 2.5) {
      g.fillStyle = "rgba(160,180,220,0.26)";
      g.beginPath();
      for (let yu = yTraufe - zr; yu > yOben + 0.1; yu -= zr) {
        let x = x0 - rng() * 0.3;
        while (x < x1) {
          const len = 0.3 + Math.pow(rng(), 1.5) * 2.2, gap = 0.05 + Math.pow(rng(), 2) * 0.6, d = 0.015 + rng() * 0.03;
          g.rect(x, yu - d * 0.5, len, d); x += len + gap;
        }
      }
      g.fill();
    }
    /* am First dünner: die Firstziegel schauen durch */
    const gr = g.createLinearGradient(0, yOben, 0, yOben + 0.3);
    gr.addColorStop(0, "rgba(120,70,56,0.4)"); gr.addColorStop(1, "rgba(120,70,56,0)");
    g.fillStyle = gr; g.fillRect(x0, yOben, w, 0.3);
    /* dicker Wulst an der Traufe */
    const gw = g.createLinearGradient(0, yTraufe - 0.3, 0, yTraufe);
    gw.addColorStop(0, "rgba(255,255,255,0)"); gw.addColorStop(0.6, "rgba(252,253,255,0.9)"); gw.addColorStop(1, "rgba(200,214,238,0.9)");
    g.fillStyle = gw; g.fillRect(x0, yTraufe - 0.3, w, 0.3);
  }
  /* Ziegeldach malen, im Bau: unten Ziegel bis zum Anteil k, darüber Lattung
     über Sparren (durchsichtig), ganz ohne Latten nur Sparren. */
  function dachMaler(o) {
    return function (g, F) {
      const w = F.w, h = F.h, px = F.px;
      const L = o.offen ? Lm(F) : L0;
      const kz = o.ziegel == null ? 1 : o.ziegel;
      const yZ = h * (1 - kz);
      if (o.offen) {
        /* Sparren (alle 0,8 m), darauf Latten */
        const sp = o.sparren == null ? 1 : o.sparren;
        const holzC = HOLZ_ROH;
        for (let x = 0.05, i = 0; x < w; x += 0.82, i++) {
          if (i / Math.max(1, w / 0.82) > sp) break;
          g.fillStyle = L(hell(holzC, -0.1)); g.fillRect(x, 0, 0.12, h);
          g.fillStyle = L(hell(holzC, -0.35)); g.fillRect(x + 0.1, 0, 0.03, h);
        }
        if (o.latten > 0 && px > 4) {
          const yl = h * (1 - o.latten);
          g.fillStyle = L(hell(holzC, 0.08));
          for (let y = h - 0.05; y > yl; y -= 0.33) g.fillRect(-0.05, y - 0.035, w + 0.1, 0.05);
        }
      }
      if (kz > 0) {
        g.save(); g.beginPath(); g.rect(-0.1, yZ, w + 0.2, h - yZ + 0.1); g.clip();
        if (o.schiefer) schieferDeck(g, F, L, -0.05, yZ, w + 0.1, h - yZ + 0.05, SCHIEFER, o.saat || 11);
        else biber(g, F, L, -0.05, yZ, w + 0.1, h - yZ + 0.05, hex(o.farbe || ZIEGEL), o.saat || 11);
        g.restore();
        /* Firstziegel */
        if (kz >= 1) {
          if (o.schiefer) { g.fillStyle = L([128, 134, 136]); g.fillRect(-0.05, 0, w + 0.1, 0.09); g.fillStyle = L([90, 96, 100]); g.fillRect(-0.05, 0.08, w + 0.1, 0.02); }
          else {
            g.fillStyle = L([118, 52, 36]); g.fillRect(-0.05, 0, w + 0.1, 0.12);
            if (px > 10) { g.fillStyle = L([150, 70, 48]); for (let x = 0; x < w; x += 0.36) { g.beginPath(); g.ellipse(x + 0.18, 0.06, 0.18, 0.055, 0, 0, TAU); g.fill(); } }
          }
        }
      }
      if (kz >= 1 && o.jahr === "herbst") laub(g, F, 0, h - 1.4, w, 1.4, 5, 71);
      if (kz >= 1 && o.schnee > 0) {
        g.save(); g.globalAlpha = klemm(o.schnee, 0, 1);
        dachSchnee(g, F, -0.05, w + 0.05, 0, h, o.saat || 11, 0.15);
        g.restore();
      }
      if (o.danach) o.danach(g, F, L);
    };
  }

  /* =====================================================================
     BAUTEILE, GEMALT
     ===================================================================== */
  /* Fenster mit Kreuzstock und Bleiverglasung (Renaissance).
     x, y = linke obere Ecke der Öffnung. */
  function fensterK(g, F, x, y, w, h, fo) {
    fo = fo || {};
    const rng = zufall(ST.textHash(F.name + x.toFixed(2) + y.toFixed(2)));
    const px = F.px, nacht = F.nacht || 0, tag = 1 - nacht;
    const rahmen = fo.rahmen || [226, 214, 186];
    /* Gewände (Stein oder Bohle) */
    if (fo.gewaende) {
      const gw = fo.gewaende, gc = fo.gewaendeFarbe || SANDSTEIN_H;
      g.fillStyle = rgb(gc); g.fillRect(x - gw, y - gw, w + 2 * gw, h + gw * 1.6);
      g.fillStyle = rgb(hell(gc, -0.25)); g.fillRect(x - gw, y + h + gw * 0.6, w + 2 * gw, gw);
      if (px > 30) { g.strokeStyle = rgb(hell(gc, -0.3)); g.lineWidth = 0.01; g.strokeRect(x - gw * 0.6, y - gw * 0.6, w + gw * 1.2, h + gw * 1.2); }
    }
    /* Laibung */
    g.fillStyle = "rgb(76,64,58)"; g.fillRect(x, y, w, h);
    const rb = Math.min(0.06, w * 0.08);
    const gx = x + rb, gy = y + rb, gW = w - 2 * rb, gH = h - 2 * rb;
    /* Glas */
    const gl = g.createLinearGradient(gx, gy, gx + gW * 0.5, gy + gH);
    gl.addColorStop(0, rgb([150, 170, 196].map((v) => v * (0.4 + 0.6 * tag))));
    gl.addColorStop(0.5, rgb([66, 78, 96].map((v) => v * (0.6 + 0.4 * tag))));
    gl.addColorStop(1, "rgb(34,38,50)");
    g.fillStyle = gl; g.fillRect(gx, gy, gW, gH);
    /* Vorhänge innen */
    if (fo.vorhang !== false && px > 10) {
      const vf = fo.vorhangFarbe || [236, 226, 206];
      g.fillStyle = rgb(hell(vf, -0.25), 0.8);
      const vw = gW * 0.22;
      g.beginPath(); g.moveTo(gx, gy); g.lineTo(gx + vw, gy); g.quadraticCurveTo(gx + vw * 0.6, gy + gH * 0.5, gx + vw * 0.8, gy + gH); g.lineTo(gx, gy + gH); g.fill();
      g.beginPath(); g.moveTo(gx + gW, gy); g.lineTo(gx + gW - vw, gy); g.quadraticCurveTo(gx + gW - vw * 0.6, gy + gH * 0.5, gx + gW - vw * 0.8, gy + gH); g.lineTo(gx + gW, gy + gH); g.fill();
    }
    /* Bleiverglasung: Rauten */
    if (fo.blei && px > 22) {
      g.save(); g.beginPath(); g.rect(gx, gy, gW, gH); g.clip();
      g.strokeStyle = "rgba(40,40,44,0.55)"; g.lineWidth = Math.max(0.004, 0.8 / px);
      const d = 0.11;
      g.beginPath();
      for (let t = -gH; t < gW + gH; t += d) { g.moveTo(gx + t, gy); g.lineTo(gx + t + gH * 0.6, gy + gH); g.moveTo(gx + t, gy); g.lineTo(gx + t - gH * 0.6, gy + gH); }
      g.stroke();
      g.restore();
    }
    /* Spiegelung */
    g.save(); g.beginPath(); g.rect(gx, gy, gW, gH); g.clip();
    g.fillStyle = "rgba(255,255,255," + (0.08 + 0.14 * tag) + ")";
    g.beginPath(); g.moveTo(gx + gW * 0.1, gy + gH); g.lineTo(gx + gW * 0.55, gy); g.lineTo(gx + gW * 0.75, gy); g.lineTo(gx + gW * 0.3, gy + gH); g.fill();
    g.restore();
    /* Schatten der Laibung */
    const sv = F.schatten ? F.schatten(fo.tiefe || 0.1) : null;
    g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
    g.fillStyle = "rgba(20,22,36,0.45)";
    if (sv) {
      const [dx, dy] = sv;
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + w, y); g.lineTo(x + w + dx, y + dy); g.lineTo(x + dx, y + dy); g.closePath(); g.fill();
      g.beginPath();
      if (dx > 0) { g.moveTo(x, y); g.lineTo(x + dx, y + dy); g.lineTo(x + dx, y + h + dy); g.lineTo(x, y + h); }
      else { g.moveTo(x + w, y); g.lineTo(x + w + dx, y + dy); g.lineTo(x + w + dx, y + h + dy); g.lineTo(x + w, y + h); }
      g.closePath(); g.fill();
    } else g.fillRect(x, y, w, 0.06);
    g.restore();
    /* Rahmen, Kreuzstock, Flügel */
    const st = (x0, y0, x1, y1, b) => {
      g.fillStyle = rgb(rahmen);
      if (Math.abs(x1 - x0) > Math.abs(y1 - y0)) { g.fillRect(x0, y0 - b / 2, x1 - x0, b); if (px * b > 3) { g.fillStyle = rgb(hell(rahmen, -0.3)); g.fillRect(x0, y0 + b / 2 - b * 0.25, x1 - x0, b * 0.25); } }
      else { g.fillRect(x0 - b / 2, y0, b, y1 - y0); if (px * b > 3) { g.fillStyle = rgb(hell(rahmen, -0.3)); g.fillRect(x0 + b / 2 - b * 0.25, y0, b * 0.25, y1 - y0); } }
    };
    st(x, y + rb / 2, x + w, y + rb / 2, rb); st(x, y + h - rb / 2, x + w, y + h - rb / 2, rb);
    st(x + rb / 2, y, x + rb / 2, y + h, rb); st(x + w - rb / 2, y, x + w - rb / 2, y + h, rb);
    const ky = fo.kaempfer == null ? 0.36 : fo.kaempfer;
    if (fo.kreuz !== false) { st(x, y + h * ky, x + w, y + h * ky, rb * 0.9); st(x + w / 2, y, x + w / 2, y + h, rb * 0.9); }
    if (fo.sprossen && px > 14) {
      const [sp, sz] = fo.sprossen, sb = rb * 0.4;
      const halb = fo.kreuz !== false ? 2 : 1;
      for (let i = 0; i < halb; i++) {
        const fx = x + w * i / halb, fw = w / halb;
        for (let k = 1; k < sp; k++) st(fx + fw * k / sp, y, fx + fw * k / sp, y + h, sb);
      }
      const y0 = fo.kreuz !== false ? y + h * ky : y;
      for (let k = 1; k < sz; k++) st(x, y0 + (y + h - y0) * k / sz, x + w, y0 + (y + h - y0) * k / sz, sb);
      if (fo.kreuz !== false) st(x, y + h * ky / 2, x + w, y + h * ky / 2, sb);
    }
    /* Fensterbank */
    if (fo.bank !== false) {
      const bc = fo.bankFarbe || hell(HOLZ, 0.05);
      g.fillStyle = rgb(hell(bc, 0.15)); g.fillRect(x - 0.05, y + h, w + 0.1, 0.03);
      g.fillStyle = rgb(bc); g.fillRect(x - 0.05, y + h + 0.03, w + 0.1, 0.045);
      if (fo.winter) schneeKappe(g, F, x - 0.05, y + h + 0.005, w + 0.1, 0.05, (rng() * 999) | 0);
    }
    if (fo.gitter) {
      g.strokeStyle = "rgb(36,34,36)"; g.lineWidth = 0.022;
      g.beginPath();
      for (let i = 1; i < 5; i++) { g.moveTo(x + w * i / 5, y); g.lineTo(x + w * i / 5, y + h); }
      g.moveTo(x, y + h * 0.35); g.lineTo(x + w, y + h * 0.35); g.moveTo(x, y + h * 0.7); g.lineTo(x + w, y + h * 0.7);
      g.stroke();
    }
    if (fo.kasten) PI.blumenkasten(g, x - 0.02, y + h - 0.01, w + 0.04, F, fo.kasten, { kastenFarbe: "#4d3322" });
  }
  function fensterKLicht(g, F, x, y, w, h, fo, an) {
    const a = (F.nacht || 0) * an;
    if (a <= 0.01) return;
    const rb = Math.min(0.06, w * 0.08);
    const gx = x + rb, gy = y + rb, gW = w - 2 * rb, gH = h - 2 * rb;
    const farbe = fo.lichtFarbe || [255, 192, 112];
    const gr = g.createRadialGradient(gx + gW / 2, gy + gH * 0.7, 0, gx + gW / 2, gy + gH * 0.6, Math.max(gW, gH));
    gr.addColorStop(0, rgb(farbe.map((v) => Math.min(255, v + 30)), 0.96 * a));
    gr.addColorStop(0.7, rgb(farbe, 0.85 * a));
    gr.addColorStop(1, rgb(farbe.map((v) => v * 0.65), 0.75 * a));
    g.fillStyle = gr; g.fillRect(gx, gy, gW, gH);
    g.fillStyle = "rgba(140,70,34," + (0.35 * a) + ")";
    g.fillRect(gx, gy, gW * 0.2, gH); g.fillRect(gx + gW * 0.8, gy, gW * 0.2, gH);
    g.fillStyle = "rgba(56,34,24," + (0.9 * a) + ")";
    const ky = fo.kaempfer == null ? 0.36 : fo.kaempfer;
    if (fo.kreuz !== false) { g.fillRect(x, y + h * ky - rb * 0.45, w, rb * 0.9); g.fillRect(x + w / 2 - rb * 0.45, y, rb * 0.9, h); }
    if (fo.blei && F.px > 22) {
      g.save(); g.beginPath(); g.rect(gx, gy, gW, gH); g.clip();
      g.strokeStyle = "rgba(70,40,24," + (0.45 * a) + ")"; g.lineWidth = Math.max(0.004, 0.8 / F.px);
      g.beginPath();
      for (let t = -gH; t < gW + gH; t += 0.11) { g.moveTo(gx + t, gy); g.lineTo(gx + t + gH * 0.6, gy + gH); g.moveTo(gx + t, gy); g.lineTo(gx + t - gH * 0.6, gy + gH); }
      g.stroke(); g.restore();
    }
    if (fo.sprossen && F.px > 14) {
      const [sp, sz] = fo.sprossen;
      const halb = fo.kreuz !== false ? 2 : 1;
      for (let i = 0; i < halb; i++) for (let k = 1; k < sp; k++) g.fillRect(x + w * i / halb + w / halb * k / sp - rb * 0.2, y, rb * 0.4, h);
      const y0 = fo.kreuz !== false ? y + h * ky : y;
      for (let k = 1; k < sz; k++) g.fillRect(x, y0 + (y + h - y0) * k / sz - rb * 0.2, w, rb * 0.4);
    }
  }

  /* Zifferblatt: gebrochen weißes Email, schwarze römische Ziffern,
     vergoldeter Ring und Zeiger. XANDER: „richtig filigran". */
  const UHR_STD = 10 + 8 / 60;      // zehn nach zehn … acht nach zehn: die Zeiger rahmen die XII
  function uhrMalen(g, F, cx, cy, r, leuchtend) {
    const px = F.px;
    /* Rahmen aus Holz und Gold */
    g.fillStyle = rgb([58, 50, 44]); g.beginPath(); g.arc(cx, cy, r * 1.16, 0, TAU); g.fill();
    const gg = g.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
    gg.addColorStop(0, rgb(hell(GOLD, 0.35))); gg.addColorStop(0.5, rgb(GOLD)); gg.addColorStop(1, rgb(hell(GOLD, -0.35)));
    g.fillStyle = gg; g.beginPath(); g.arc(cx, cy, r * 1.08, 0, TAU); g.fill();
    /* Blatt */
    const bl = g.createRadialGradient(cx - r * 0.3, cy - r * 0.3, 0, cx, cy, r);
    if (leuchtend) { bl.addColorStop(0, "rgba(255,250,228,1)"); bl.addColorStop(1, "rgba(255,226,160,1)"); }
    else { bl.addColorStop(0, "rgb(246,242,230)"); bl.addColorStop(1, "rgb(214,206,188)"); }
    g.fillStyle = bl; g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.fill();
    const tinte = leuchtend ? "rgb(30,24,22)" : "rgb(26,24,26)";
    /* Minutenkreis */
    g.strokeStyle = tinte; g.lineWidth = Math.max(0.004, r * 0.018);
    g.beginPath(); g.arc(cx, cy, r * 0.9, 0, TAU); g.stroke();
    if (px * r > 26) { g.beginPath(); g.arc(cx, cy, r * 0.82, 0, TAU); g.stroke(); }
    /* Stundenstriche bzw. römische Ziffern */
    g.fillStyle = tinte;
    const ziffern = ["XII", "I", "II", "III", "IIII", "V", "VI", "VII", "VIII", "IX", "X", "XI"];
    for (let i = 0; i < 12; i++) {
      const a = i / 12 * TAU - Math.PI / 2;
      if (px * r > 26) {
        g.save(); g.translate(cx + Math.cos(a) * r * 0.68, cy + Math.sin(a) * r * 0.68); g.rotate(a + Math.PI / 2);
        g.font = "bold " + (r * 0.22).toFixed(4) + "px serif"; g.textAlign = "center"; g.textBaseline = "middle";
        g.fillText(ziffern[i], 0, 0);
        g.restore();
        g.save(); g.translate(cx + Math.cos(a) * r * 0.86, cy + Math.sin(a) * r * 0.86); g.rotate(a); g.fillRect(-r * 0.04, -r * 0.012, r * 0.08, r * 0.024); g.restore();
      } else {
        const l = i % 3 === 0 ? 0.22 : 0.12;
        g.save(); g.translate(cx, cy); g.rotate(a); g.fillRect(r * (0.9 - l), -r * 0.035, r * l, r * 0.07); g.restore();
      }
    }
    if (px * r > 40) for (let i = 0; i < 60; i++) { if (i % 5 === 0) continue; const a = i / 60 * TAU; g.save(); g.translate(cx, cy); g.rotate(a); g.fillRect(r * 0.83, -r * 0.005, r * 0.06, r * 0.01); g.restore(); }
    /* Zeiger */
    const std = UHR_STD, min = (std % 1) * 60;
    zeiger(g, cx, cy, r * 0.52, (std / 12) * TAU, r * 0.075, px, leuchtend);
    zeiger(g, cx, cy, r * 0.8, (min / 60) * TAU, r * 0.05, px, leuchtend);
    g.fillStyle = rgb(GOLD); g.beginPath(); g.arc(cx, cy, r * 0.07, 0, TAU); g.fill();
    g.fillStyle = rgb(hell(GOLD, -0.4)); g.beginPath(); g.arc(cx, cy, r * 0.03, 0, TAU); g.fill();
  }
  function zeiger(g, cx, cy, l, w, b, px, leuchtend) {
    g.save(); g.translate(cx, cy); g.rotate(w);
    g.beginPath();
    g.moveTo(-b * 0.4, l * 0.18); g.lineTo(-b * 0.4, -l * 0.55); g.lineTo(-b * 0.9, -l * 0.7); g.lineTo(0, -l); g.lineTo(b * 0.9, -l * 0.7); g.lineTo(b * 0.4, -l * 0.55); g.lineTo(b * 0.4, l * 0.18); g.closePath();
    g.fillStyle = leuchtend ? "rgb(40,30,20)" : rgb(hell(GOLD, -0.15)); g.fill();
    if (!leuchtend && px * l > 20) { g.strokeStyle = rgb(hell(GOLD, -0.55)); g.lineWidth = b * 0.2; g.stroke(); }
    g.restore();
  }

  /* Tannengirlande mit roten Schleifen und (nachts) warmen Lichtern */
  function girlande(g, F, pkte, durchhang, leuchtend) {
    const rng = zufall(ST.textHash(F.name + "gir"));
    const pfad = [];
    for (let i = 0; i < pkte.length - 1; i++) {
      const [x0, y0] = pkte[i], [x1, y1] = pkte[i + 1];
      for (let t = 0; t <= 1.0001; t += 0.05) pfad.push([x0 + (x1 - x0) * t, y0 + (y1 - y0) * t + Math.sin(t * Math.PI) * durchhang]);
    }
    if (!leuchtend) {
      g.lineCap = "round";
      g.strokeStyle = "rgb(30,62,40)"; g.lineWidth = 0.13; g.beginPath(); pfad.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.stroke();
      if (F.px > 12) {
        g.lineWidth = Math.max(0.006, 0.9 / F.px);
        for (const p of pfad) for (let k = 0; k < 5; k++) {
          const a = rng() * TAU, l = 0.05 + rng() * 0.06;
          g.strokeStyle = rgb(PI.streu([44, 88, 52], rng, 0.25));
          g.beginPath(); g.moveTo(p[0], p[1]); g.lineTo(p[0] + Math.cos(a) * l, p[1] + Math.sin(a) * l * 0.7); g.stroke();
        }
        g.fillStyle = "rgba(246,249,255,0.85)";
        for (const p of pfad) if (rng() < 0.35) { g.beginPath(); g.ellipse(p[0], p[1] - 0.04, 0.05, 0.02, 0, 0, TAU); g.fill(); }
      }
      for (const [x, y] of pkte) {
        g.fillStyle = "#b3122a";
        g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x - 0.1, y - 0.08, x - 0.09, y + 0.03); g.closePath(); g.fill();
        g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 0.1, y - 0.08, x + 0.09, y + 0.03); g.closePath(); g.fill();
        g.fillRect(x - 0.02, y - 0.02, 0.04, 0.04);
        g.beginPath(); g.moveTo(x - 0.01, y); g.lineTo(x - 0.05, y + 0.16); g.lineTo(x - 0.02, y + 0.15); g.closePath(); g.fill();
        g.beginPath(); g.moveTo(x + 0.01, y); g.lineTo(x + 0.05, y + 0.16); g.lineTo(x + 0.02, y + 0.15); g.closePath(); g.fill();
      }
    } else {
      const a = F.nacht;
      for (let i = 0; i < pfad.length; i += 2) {
        const p = pfad[i];
        const gr = g.createRadialGradient(p[0], p[1], 0, p[0], p[1], 0.07);
        gr.addColorStop(0, "rgba(255,236,170," + a + ")"); gr.addColorStop(1, "rgba(255,190,90,0)");
        g.fillStyle = gr; g.fillRect(p[0] - 0.07, p[1] - 0.07, 0.14, 0.14);
      }
    }
  }


  function schein(F, a, b, r, farbe, k) {
    if (!F.leuchtPunkt) return;
    const s = klemm((F.sicht == null ? 1 : F.sicht) * 3, 0, 1);
    if (s < 0.05 || k <= 0) return;
    F.leuchtPunkt(a, b, r * s, farbe, k * s);
  }

  function fensterSchein(F, liste) {
    if (!liste.length) return;
    let sx = 0, sy = 0;
    for (const [x, y] of liste) { sx += x; sy += y; }
    const mx = sx / liste.length, my = sy / liste.length;
    let r = 0; for (const [x, y] of liste) r = Math.max(r, Math.hypot(x - mx, y - my));
    schein(F, mx, my, 1.2 + r * 0.7, "255,190,110", Math.min(0.85, 0.3 * Math.sqrt(liste.length)));
  }

  function kranzMalen(g, cx, cy, r, px) {
    const rng = zufall(77);
    g.strokeStyle = "rgb(34,70,42)"; g.lineWidth = r * 0.45; g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.stroke();
    if (px * r > 8) {
      g.lineWidth = Math.max(0.006, 0.8 / px);
      for (let i = 0; i < 60; i++) { const a = rng() * TAU, rr = r * (0.8 + rng() * 0.4); g.strokeStyle = rgb(PI.streu([50, 96, 58], rng, 0.3)); g.beginPath(); g.moveTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); g.lineTo(cx + Math.cos(a + 0.2) * (rr + 0.04), cy + Math.sin(a + 0.2) * (rr + 0.04)); g.stroke(); }
      g.fillStyle = "#c21a2c"; for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + 0.3; g.beginPath(); g.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, r * 0.09, 0, TAU); g.fill(); }
    }
    g.fillStyle = "#b3122a";
    g.beginPath(); g.moveTo(cx, cy + r); g.quadraticCurveTo(cx - r * 0.45, cy + r * 0.7, cx - r * 0.4, cy + r * 1.2); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(cx, cy + r); g.quadraticCurveTo(cx + r * 0.45, cy + r * 0.7, cx + r * 0.4, cy + r * 1.2); g.closePath(); g.fill();
    g.fillRect(cx - r * 0.08, cy + r * 0.9, r * 0.16, r * 0.6);
  }

  /* Schieferhelm (Erker, Dachreiter) */
  function helmMaler(S, Z, offen, saat) {
    return function (g, F) {
      const w = F.w, h = F.h;
      if (offen) {
        const L = Lm(F);
        g.strokeStyle = L(HOLZ_ROH); g.lineWidth = 0.08;
        g.beginPath(); for (const p of F.flaeche.umriss) { g.moveTo(p[0], p[1]); } g.stroke();
        poly(g, F.flaeche.umriss); g.lineWidth = 0.1; g.stroke();
        for (let y = h * 0.2; y < h; y += 0.3) { g.fillStyle = L(hell(HOLZ_ROH, 0.1)); g.fillRect(0, y, w, 0.04); }
        return;
      }
      schuppen(g, F, L0, -0.05, -0.05, w + 0.1, h + 0.1, SCHIEFER, saat, 0.1);
      /* Gratbleche an den Kanten */
      g.strokeStyle = rgb([150, 156, 160]); g.lineWidth = 0.05; poly(g, F.flaeche.umriss); g.stroke();
      if (S.winter) {
        g.save(); g.globalAlpha = 0.85 * Z.schnee;
        const rng = zufall(saat);
        g.fillStyle = "rgb(244,247,252)";
        for (let y = 0.2; y < h; y += 0.1) { if (rng() < 0.55) { g.fillRect(-0.05, y, w + 0.1, 0.03 + rng() * 0.03); } }
        const gr = g.createLinearGradient(0, h - 0.25, 0, h); gr.addColorStop(0, "rgba(246,249,253,0)"); gr.addColorStop(1, "rgba(246,249,253,1)");
        g.fillStyle = gr; g.fillRect(-0.05, h - 0.25, w + 0.1, 0.26);
        g.restore();
      }
    };
  }

  /* Turmspitze: vergoldete Kugel, Stange, Wetterfahne mit Stern */
  function spitzeFigur(hoehe, winter, fahne) {
    return function (g, s, F) {
      const k = s, h = hoehe * k * ST.KZ;
      if (F.schatten) { g.fillStyle = "#000"; g.fillRect(-k * 0.02, -h, k * 0.04, h); g.beginPath(); g.arc(0, -h * 0.35, k * 0.09, 0, TAU); g.fill(); return; }
      const lf = ST.lichtFaktor([0, 0.4, 0.9], F.Z, 0, F.jahr);
      const L = (c) => rgb([c[0] * lf[0], c[1] * lf[1], c[2] * lf[2]]);
      g.fillStyle = L(EISEN); g.fillRect(-k * 0.018, -h, k * 0.036, h);
      const gr = g.createRadialGradient(-k * 0.03, -h * 0.35 - k * 0.03, 0, 0, -h * 0.35, k * 0.1);
      gr.addColorStop(0, L(hell(GOLD, 0.5))); gr.addColorStop(1, L(hell(GOLD, -0.3)));
      g.fillStyle = gr; g.beginPath(); g.arc(0, -h * 0.35, k * 0.1, 0, TAU); g.fill();
      if (winter) { g.fillStyle = L([244, 247, 252]); g.beginPath(); g.ellipse(0, -h * 0.35 - k * 0.08, k * 0.07, k * 0.03, 0, 0, TAU); g.fill(); }
      if (fahne) {
        /* Wetterfahne: Wimpel mit ausgeschnittenem Stern */
        g.fillStyle = L(hell(GOLD, -0.1));
        g.beginPath(); g.moveTo(0, -h * 0.82); g.lineTo(k * 0.36, -h * 0.8); g.lineTo(k * 0.28, -h * 0.73); g.lineTo(k * 0.36, -h * 0.66); g.lineTo(0, -h * 0.68); g.closePath(); g.fill();
        g.beginPath(); g.moveTo(0, -h * 0.72); g.lineTo(-k * 0.14, -h * 0.74); g.lineTo(-k * 0.14, -h * 0.7); g.closePath(); g.fill();
        g.fillStyle = L(GOLD);
        const sy = -h * 0.93, r = k * 0.07;
        g.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; g.lineTo(Math.cos(a) * rr, sy + Math.sin(a) * rr); } g.closePath(); g.fill();
      }
    };
  }

  /* Den Grubenrand (z = 0) durch die Fläche gesehen als Beschneidung */
  function lochClip(g, F, B, R) {
    const f = F.flaeche, n = kreuz(f.u, f.v), en = dot(B.e, n);
    if (Math.abs(en) < 1e-3) return false;
    const pk = [[R[0], R[1], 0], [R[2], R[1], 0], [R[2], R[3], 0], [R[0], R[3], 0]].map((P) => {
      const s = dot(sub(P, f.o), n) / en;
      const X = sub(P, mul(B.e, s)), d = sub(X, f.o);
      return [dot(d, f.u), dot(d, f.v)];
    });
    poly(g, pk); g.clip();
    return true;
  }

  function erdeMalen(g, F, L, w, h, saat, winter) {
    g.fillStyle = L([112, 84, 58]); g.fillRect(-0.1, -0.1, w + 0.2, h + 0.2);
    if (F.px > 6) {
      rausch(g, 0, 0, w, h, 0.8, 0.35, saat, 3);
      const rng = zufall(saat);
      g.fillStyle = L([150, 130, 110]);
      for (let i = 0; i < w * h * 4; i++) { g.beginPath(); g.ellipse(rng() * w, rng() * h, 0.03 + rng() * 0.05, 0.02 + rng() * 0.03, rng() * 3, 0, TAU); g.fill(); }
      /* Schichten */
      g.fillStyle = L([84, 60, 40], 0.5); g.fillRect(0, 0, w, 0.25);
      g.fillStyle = L([150, 118, 80], 0.35); g.fillRect(0, 0.5, w, 0.12);
    }
    if (winter) { g.fillStyle = "rgba(236,241,249,0.9)"; g.fillRect(0, 0, w, 0.06); }
  }

  function aushubFigur(k, winter) {
    return function (g, s, F) {
      const b = 2.3 * s * Math.cbrt(Math.max(0.05, k)), h = 1.25 * s * ST.KZ * Math.cbrt(Math.max(0.05, k));
      g.beginPath(); g.moveTo(-b, 0); g.bezierCurveTo(-b * 0.6, -h * 0.9, b * 0.4, -h * 1.1, b, 0); g.closePath();
      if (F.schatten) { g.fillStyle = "#000"; g.fill(); return; }
      const lf = ST.lichtFaktor([0, 0, 1], F.Z, 0, F.jahr);
      const gr = g.createLinearGradient(-b, -h, b, 0);
      gr.addColorStop(0, rgb([150 * lf[0], 112 * lf[1], 76 * lf[2]])); gr.addColorStop(1, rgb([92 * lf[0], 66 * lf[1], 44 * lf[2]]));
      g.fillStyle = gr; g.fill();
      const rng = zufall(5);
      g.fillStyle = rgb([60 * lf[0], 44 * lf[1], 30 * lf[2]], 0.6);
      g.beginPath(); for (let i = 0; i < 40; i++) { const x = (rng() - 0.5) * b * 1.6, y = -rng() * h * 0.7, r = Math.max(0.6, s * 0.03); g.moveTo(x + r, y); g.arc(x, y, r, 0, TAU); } g.fill();
      if (winter) { g.fillStyle = rgb([244 * lf[0], 247 * lf[1], 252 * lf[2]], 0.9); g.beginPath(); g.moveTo(-b * 0.6, -h * 0.55); g.bezierCurveTo(-b * 0.3, -h * 1.0, b * 0.3, -h * 1.05, b * 0.6, -h * 0.5); g.bezierCurveTo(b * 0.2, -h * 0.7, -b * 0.2, -h * 0.72, -b * 0.6, -h * 0.55); g.fill(); }
    };
  }

  /* =====================================================================
     SCHIEFER UND BACKSTEIN
     ===================================================================== */
  /* Schiefer in Rechteckdoppeldeckung, Reihe für Reihe von der Traufe zum
     First (untere Ecken leicht gestutzt). Je Farbton ein Pfad. */
  function schieferDeck(g, F, L, x, y, w, h, c, saat) {
    const zr = 0.16, zb = 0.3, px = F.px, rng = zufall(saat);
    g.fillStyle = L(hell(c, -0.4)); g.fillRect(x, y, w, h);
    const toene = [hell(c, -0.07), c, hell(c, 0.05), hell(c, 0.11), misch(c, [96, 88, 90], 0.3)];
    if (px * zr < 2.4) {
      for (let yy = y + h - zr, i = 0; yy > y - zr; yy -= zr, i++) { g.fillStyle = L(toene[i % 4]); g.fillRect(x, yy, w, zr * 0.85); }
      if (px > 3) rausch(g, x, y, w, h, 4, 0.12, saat, 3);
      return;
    }
    const n = Math.ceil(h / zr) + 1, ec = zb * 0.12;
    for (let i = 0; i < n; i++) {
      const yT = y + h - (i + 1) * zr, vs = (i % 2) * zb / 2;
      const pf = toene.map(() => new Path2D()), sch = new Path2D();
      for (let xx = x - zb + vs; xx < x + w; xx += zb) {
        const r = rng(), t = r < 0.04 ? 4 : (rng() * 4) | 0;
        const a = xx + 0.008, b = xx + zb - 0.008, yu = yT + zr + 0.02;
        pf[t].moveTo(a, yT - zr); pf[t].lineTo(a, yu - ec); pf[t].lineTo(a + ec, yu); pf[t].lineTo(b, yu); pf[t].lineTo(b, yT - zr); pf[t].closePath();
        sch.rect(a + 0.01, yu, b - a, 0.02);
      }
      g.fillStyle = "rgba(8,10,18,0.45)"; g.fill(sch);
      toene.forEach((tc, k) => { g.fillStyle = L(tc); g.fill(pf[k]); });
      if (px * zr > 7) { g.fillStyle = "rgba(255,255,255,0.05)"; g.fillRect(x, yT + zr * 0.6, w, zr * 0.35); }
    }
    rausch(g, x, y, w, h, 4.5, 0.12, saat + 8, 4);
    if (px > 20) rausch(g, x, y, w, h, 0.8, 0.07, saat + 3, 2);
    tonFlecken(g, x, y, w, h, 5.5, 0.1, saat + 5, "#6e7a70", false);
  }

  /* Backstein im Kreuzverband: Läufer- und Binderschichten im Wechsel.
     Die Schichten zählen von z = 0, damit sie über alle Wände und beim
     Aufmauern stehen bleiben. zOben = Höhe von b = 0. */
  const LH = 0.077;
  function backstein(g, F, L, x, y, w, h, zOben, opt) {
    opt = opt || {};
    const px = F.px, rng = zufall(opt.saat || 3);
    g.fillStyle = L(MOERTEL); g.fillRect(x, y, w, h);
    const rot = [hell(BACKSTEIN, -0.1), hell(BACKSTEIN, -0.03), BACKSTEIN, hell(BACKSTEIN, 0.06), misch(BACKSTEIN, [90, 50, 60], 0.35), misch(BACKSTEIN, [196, 120, 80], 0.25)];
    const gelb = [hell(KLINKER, -0.08), KLINKER, hell(KLINKER, 0.06), misch(KLINKER, [200, 150, 90], 0.3)];
    const gelbZ = opt.gelb || (() => false);
    if (px * LH < 2.2) {
      g.fillStyle = L(misch(BACKSTEIN, MOERTEL, 0.12)); g.fillRect(x, y, w, h);
      /* gelbe Bänder bleiben auch klein sichtbar */
      for (let z = 0; z < zOben + 1; z += LH) if (gelbZ(z)) { g.fillStyle = L(misch(KLINKER, MOERTEL, 0.1)); g.fillRect(x, zOben - z - LH, w, LH + 0.002); }
      if (px > 3) rausch(g, x, y, w, h, 2.5, 0.16, (opt.saat || 3) + 2, 3);
      return;
    }
    const pr = rot.map(() => new Path2D()), pg = gelb.map(() => new Path2D());
    const r0 = Math.max(0, Math.floor((zOben - (y + h)) / LH)), r1 = Math.ceil((zOben - y) / LH);
    const fg = 0.011;
    for (let r = r0; r <= r1; r++) {
      const zu = r * LH, yy = zOben - zu - LH;
      const laeufer = r % 2 === 0, sb = laeufer ? 0.25 : 0.12;
      const vs = laeufer ? ((r / 2) % 2 ? 0.125 : 0) : 0.06;
      const gl = gelbZ(zu + LH / 2);
      for (let xx = x - vs - (opt.a0 || 0) % (2 * sb); xx < x + w; xx += sb + fg) {
        const a = Math.max(x, xx), b = Math.min(x + w, xx + sb);
        if (b - a < 0.01) continue;
        if (gl) pg[(rng() * 4) | 0].rect(a, yy + fg / 2, b - a, LH - fg);
        else { const t = rng() < 0.06 ? 4 : rng() < 0.05 ? 5 : (rng() * 4) | 0; pr[t].rect(a, yy + fg / 2, b - a, LH - fg); }
      }
    }
    rot.forEach((c, k) => { g.fillStyle = L(c); g.fill(pr[k]); });
    gelb.forEach((c, k) => { g.fillStyle = L(c); g.fill(pg[k]); });
    if (px * LH > 6) {
      /* Lagerfugen werfen einen Hauch Schatten (Ziegel stehen vor dem Mörtel) */
      g.fillStyle = "rgba(30,14,10,0.16)";
      for (let r = r0; r <= r1; r++) g.fillRect(x, zOben - r * LH - fg / 2, w, Math.max(0.004, 0.6 / px));
    }
    rausch(g, x, y, w, h, 3.0, 0.14, (opt.saat || 3) + 2, 3);
    if (px > 30) rausch(g, x, y, w, h, 0.5, 0.1, (opt.saat || 3) + 5, 2);
  }
  const GELB_BAENDER = (z) => (z > ZS && z < ZS + 0.23) || (z > 1.32 && z < 1.47) || (z > 4.96 && z < 5.04) || (z > 7.38 && z < 7.54);

  /* ---------------- Stichbogenfenster ---------------- */
  function fensterPfad(g, x, y, w, h, st) {
    const r = (w * w / 4 + st * st) / (2 * st), cy = y + r;
    const a = Math.asin((w / 2) / r);
    g.moveTo(x, y + h); g.lineTo(x, y + st);
    g.arc(x + w / 2, cy, r, -Math.PI / 2 - a, -Math.PI / 2 + a);
    g.lineTo(x + w, y + h); g.closePath();
  }
  /* f = { a (Mitte), w, z0 (Brüstung), h } ; zOben = Höhe von b = 0 */
  function fensterS(g, F, L, f, zOben, S, Z, opt) {
    opt = opt || {};
    const w = f.w, x = f.a - w / 2, yU = zOben - f.z0, y = yU - f.h, st = w * 0.14, px = F.px;
    /* Rollschicht (gelb/rot im Wechsel) und Schlussstein */
    const r = (w * w / 4 + st * st) / (2 * st), cx = x + w / 2, cy = y + r, a = Math.asin((w / 2 + 0.03) / r);
    const n = Math.max(7, Math.round(w / 0.085));
    for (let i = 0; i < n; i++) {
      const w0 = -Math.PI / 2 - a + i * 2 * a / n, w1 = w0 + 2 * a / n;
      g.fillStyle = L(i % 2 ? KLINKER : hell(BACKSTEIN, -0.05));
      g.beginPath(); g.arc(cx, cy, r + 0.27, w0, w1); g.arc(cx, cy, r + 0.01, w1, w0, true); g.closePath(); g.fill();
    }
    if (px > 10) { g.strokeStyle = L(MOERTEL); g.lineWidth = Math.max(0.006, 0.6 / px); g.beginPath(); for (let i = 0; i <= n; i++) { const t = -Math.PI / 2 - a + i * 2 * a / n; g.moveTo(cx + Math.cos(t) * (r + 0.01), cy + Math.sin(t) * (r + 0.01)); g.lineTo(cx + Math.cos(t) * (r + 0.27), cy + Math.sin(t) * (r + 0.27)); } g.stroke(); }
    g.fillStyle = L(SANDSTEIN_H);
    g.beginPath(); g.moveTo(cx - 0.08, y - 0.3); g.lineTo(cx + 0.08, y - 0.3); g.lineTo(cx + 0.06, y + 0.04); g.lineTo(cx - 0.06, y + 0.04); g.closePath(); g.fill();
    g.fillStyle = L(hell(SANDSTEIN_H, -0.25)); g.fillRect(cx + 0.04, y - 0.28, 0.02, 0.3);
    /* Öffnung */
    g.save(); g.beginPath(); fensterPfad(g, x, y, w, f.h, st); g.clip();
    if (Z.fenster) {
      fensterK(g, F, x, y, w, f.h, { rahmen: WEISS, kreuz: true, kaempfer: 0.27, sprossen: [1, 3], bank: false, tiefe: 0.16, vorhangFarbe: [226, 222, 206], vorhang: opt.vorhang !== false });
      /* Winter: Strohsterne der Kinder im Fenster */
      if (S.winter && Z.deko && opt.sterne && px > 14) {
        const rs = zufall(ST.textHash(F.name + f.a));
        for (let k = 0; k < 2; k++) {
          const sx = x + w * (0.28 + 0.44 * k), sy = y + f.h * (0.45 + rs() * 0.2), rr = 0.07;
          g.strokeStyle = "rgba(240,220,160,0.95)"; g.lineWidth = Math.max(0.006, 0.8 / px);
          g.beginPath(); for (let i = 0; i < 8; i++) { const t = i * Math.PI / 4; g.moveTo(sx, sy); g.lineTo(sx + Math.cos(t) * rr * (i % 2 ? 0.6 : 1), sy + Math.sin(t) * rr * (i % 2 ? 0.6 : 1)); } g.stroke();
        }
      }
    } else { g.fillStyle = "rgb(40,34,32)"; g.fillRect(x, y - 0.2, w, f.h + 0.2); }
    g.restore();
    /* Sohlbank aus Sandstein */
    const sv = F.schatten ? F.schatten(0.07) : null;
    if (sv) { g.fillStyle = "rgba(30,20,20,0.3)"; g.fillRect(x - 0.1 + sv[0], yU + 0.09, w + 0.2, Math.max(0.02, sv[1] * 0.8)); }
    g.fillStyle = L(hell(SANDSTEIN_H, 0.12)); g.fillRect(x - 0.1, yU, w + 0.2, 0.035);
    g.fillStyle = L(SANDSTEIN_H); g.fillRect(x - 0.1, yU + 0.035, w + 0.2, 0.06);
    g.fillStyle = L(hell(SANDSTEIN_H, -0.3)); g.fillRect(x - 0.1, yU + 0.09, w + 0.2, 0.012);
    if (S.winter && Z.schnee > 0.5) schneeKappe(g, F, x - 0.1, yU + 0.004, w + 0.2, 0.05, (f.a * 100) | 0);
    if (opt.kasten) PI.blumenkasten(g, x + 0.02, yU - 0.01, w - 0.04, F, opt.kasten, { kastenFarbe: "#3c5a46" });
  }
  function fensterSLicht(g, F, f, zOben, an) {
    const w = f.w, x = f.a - w / 2, y = zOben - f.z0 - f.h, st = w * 0.14;
    g.save(); g.beginPath(); fensterPfad(g, x, y, w, f.h, st); g.clip();
    fensterKLicht(g, F, x, y, w, f.h, { kreuz: true, kaempfer: 0.27, sprossen: [1, 3], lichtFarbe: [255, 200, 124] }, an);
    g.restore();
  }

  /* =====================================================================
     FASSADEN
     spec = { fenster: [{a, w, z0, h, eg}], keller: [a…], tuer: {a, w, h},
              portal: bool, ecken: [links, rechts] }
     ===================================================================== */
  function fassadeMaler(spec, hoch, S, Z) {
    return function (g, F) {
      const W = F.w, H = ZT, L = L0, px = F.px;
      g.save(); g.translate(0, -(ZT - hoch));
      const saat = ST.textHash(F.name) % 90 + 3;
      /* Sockel: Bossenquader aus gelbem Sandstein, oben eine Schräge */
      quaderwerk(g, F, L, -0.02, H - ZS, W + 0.04, ZS, { saat: saat, lage: 0.3, bossen: true, farbe: SANDSTEIN });
      g.fillStyle = L(hell(SANDSTEIN_H, 0.1)); g.fillRect(-0.02, H - ZS - 0.02, W + 0.04, 0.07);
      g.fillStyle = L(hell(SANDSTEIN_H, -0.28)); g.fillRect(-0.02, H - ZS + 0.05, W + 0.04, 0.02);
      /* Backstein */
      backstein(g, F, L, -0.02, 0, W + 0.04, H - ZS - 0.02, ZT, { saat: saat, gelb: GELB_BAENDER, a0: spec.a0 || 0 });
      /* Eckverzahnung aus gelben Klinkern */
      if (px * LH > 2.2) for (const [e, links] of [[spec.ecken ? spec.ecken[0] : true, true], [spec.ecken ? spec.ecken[1] : true, false]]) {
        if (!e) continue;
        for (let z = ZS + 0.23, i = 0; z < ZT - 0.5; z += LH * 4, i++) {
          const bw = i % 2 ? 0.25 : 0.38, xx = links ? 0 : W - bw;
          g.fillStyle = L(PI.streu(KLINKER, zufall(i * 3 + (links ? 1 : 2)), 0.05)); g.fillRect(xx, H - z - LH * 4 + 0.006, bw, LH * 4 - 0.012);
          g.fillStyle = L(MOERTEL); for (let k = 1; k < 4; k++) g.fillRect(xx, H - z - LH * k, bw, 0.01);
        }
      }
      /* Kordongesims zwischen den Geschossen */
      g.fillStyle = L(hell(SANDSTEIN_H, 0.12)); g.fillRect(-0.02, H - ZK, W + 0.04, 0.05);
      const gk = g.createLinearGradient(0, H - ZK + 0.05, 0, H - ZE);
      gk.addColorStop(0, L(SANDSTEIN_H)); gk.addColorStop(1, L(hell(SANDSTEIN_H, -0.3)));
      g.fillStyle = gk; g.fillRect(-0.02, H - ZK + 0.05, W + 0.04, 0.15);
      if (F.schatten) { const sv = F.schatten(0.09); if (sv) { g.fillStyle = "rgba(30,20,20,0.25)"; g.fillRect(-0.02, H - ZE, W + 0.04, Math.max(0.02, sv[1] * 0.9)); } }
      if (S.winter && Z.schnee > 0.5) schneeKappe(g, F, -0.02, H - ZK + 0.005, W + 0.04, 0.05, saat);
      /* Traufgesims: gelbe Schicht, Deutsches Band (übereck gestellte Steine), Auskragung */
      if (hoch > 7.5) {
        const y0 = H - 7.72;
        g.fillStyle = L(hell(BACKSTEIN, -0.12)); g.fillRect(-0.02, H - ZT, W + 0.04, ZT - 7.72);
        if (px > 6) {
          g.fillStyle = L(KLINKER);
          const zb = 0.12;
          g.beginPath();
          for (let x = -0.02; x < W; x += zb) { g.moveTo(x, y0); g.lineTo(x + zb / 2, y0 - 0.1); g.lineTo(x + zb, y0); }
          g.fill();
          g.fillStyle = L(hell(KLINKER, -0.35));
          g.beginPath();
          for (let x = -0.02; x < W; x += zb) { g.moveTo(x + zb / 2, y0 - 0.1); g.lineTo(x + zb, y0); g.lineTo(x + zb * 0.62, y0); g.closePath(); }
          g.fill();
        }
        g.fillStyle = L(hell(BACKSTEIN, 0.05)); g.fillRect(-0.02, H - 7.95, W + 0.04, 0.1);
        g.fillStyle = L(hell(BACKSTEIN, -0.3)); g.fillRect(-0.02, H - 7.86, W + 0.04, 0.03);
        g.fillStyle = L(hell(BACKSTEIN, 0.08)); g.fillRect(-0.02, H - ZT, W + 0.04, 0.15);
      }
      /* Fenster */
      for (const f of spec.fenster) {
        if (hoch < f.z0 + 0.3) continue;
        const kasten = !f.eg && Z.fenster && (S.jahr === "sommer" || S.jahr === "fruehling") ? "sommer" : null;
        if (hoch < f.z0 + f.h + 0.5) { g.fillStyle = "rgb(40,34,32)"; g.fillRect(f.a - f.w / 2, H - Math.min(hoch, f.z0 + f.h), f.w, Math.min(hoch, f.z0 + f.h) - f.z0); g.fillStyle = L(hell(SANDSTEIN_H, 0.05)); g.fillRect(f.a - f.w / 2 - 0.1, H - f.z0, f.w + 0.2, 0.09); continue; }
        fensterS(g, F, L, f, ZT, S, Z, { sterne: f.eg, kasten: kasten });
      }
      /* Kellerfenster im Sockel */
      for (const a of spec.keller || []) {
        const kw = 0.55, kh = 0.3, ky = H - 0.62;
        g.fillStyle = L(hell(SANDSTEIN_H, 0.05)); g.fillRect(a - kw / 2 - 0.07, ky - 0.07, kw + 0.14, kh + 0.14);
        g.fillStyle = "rgb(32,30,30)"; g.fillRect(a - kw / 2, ky, kw, kh);
        g.strokeStyle = L(EISEN); g.lineWidth = 0.02; g.beginPath(); for (let i = 1; i < 5; i++) { g.moveTo(a - kw / 2 + kw * i / 5, ky); g.lineTo(a - kw / 2 + kw * i / 5, ky + kh); } g.stroke();
      }
      /* Hintertür */
      if (spec.tuer && hoch > 2.6) {
        const t = spec.tuer, tx = t.a - t.w / 2, ty = H - t.h;
        g.fillStyle = L(SANDSTEIN_H); g.fillRect(tx - 0.15, ty - 0.22, t.w + 0.3, t.h + 0.22);
        g.fillStyle = L(hell(SANDSTEIN_H, -0.2)); g.fillRect(tx - 0.15, ty - 0.22, t.w + 0.3, 0.04);
        if (Z.tuer) {
          g.fillStyle = L(HOLZ); g.fillRect(tx, ty, t.w, t.h);
          if (px > 12) { g.strokeStyle = L(hell(HOLZ, -0.35)); g.lineWidth = 0.02; g.strokeRect(tx + 0.1, ty + 0.15, t.w - 0.2, t.h * 0.38); g.strokeRect(tx + 0.1, ty + t.h * 0.5, t.w - 0.2, t.h * 0.4); g.fillStyle = L(GOLD); g.fillRect(tx + t.w - 0.16, ty + t.h * 0.52, 0.1, 0.025); }
        } else { g.fillStyle = "rgb(40,34,32)"; g.fillRect(tx, ty, t.w, t.h); }
      }
      /* Fallrohr aus Zink an der Hausecke */
      if (spec.rohr != null && Z.dachFertig) {
        const rx = spec.rohr;
        g.fillStyle = L([128, 134, 138]); g.fillRect(rx - 0.05, H - ZT + 0.15, 0.1, ZT - 0.2);
        g.fillStyle = L([176, 182, 186]); g.fillRect(rx - 0.035, H - ZT + 0.15, 0.025, ZT - 0.2);
        g.fillStyle = L([90, 94, 98]); for (let z = 0.8; z < ZT; z += 1.6) g.fillRect(rx - 0.07, H - z, 0.14, 0.04);
      }
      /* Spritzwasser und Kontaktschatten */
      const gr = g.createLinearGradient(0, H, 0, H - 0.45);
      gr.addColorStop(0, "rgba(60,48,36,0.3)"); gr.addColorStop(1, "rgba(60,48,36,0)");
      g.fillStyle = gr; g.fillRect(0, H - 0.45, W, 0.45);
      if (S.winter) { g.fillStyle = "rgba(240,244,250,0.92)"; g.beginPath(); g.moveTo(0, H); for (let x = 0; x <= W + 0.3; x += 0.3) g.lineTo(x, H - 0.08 - 0.06 * Math.sin(x * 2.9 + saat)); g.lineTo(W, H); g.fill(); }
      if (hoch < ZT - 0.01) { g.fillStyle = "rgba(255,236,220,0.22)"; g.fillRect(0, ZT - hoch, W, 0.3); }
      if (spec.danach) spec.danach(g, F, L);
      g.restore();
    };
  }
  function fassadeLeuchten(spec, hoch, Z, anteil) {
    return function (g, F) {
      if (!Z.fenster || hoch < ZT - 0.01) return;
      const rng = zufall(ST.textHash(F.name) + 3), liste = [];
      for (const f of spec.fenster) {
        if (rng() > anteil) continue;
        fensterSLicht(g, F, f, ZT, 1);
        liste.push([f.a, ZT - f.z0 - f.h / 2]);
      }
      fensterSchein(F, liste);
      if (spec.leuchten) spec.leuchten(g, F);
    };
  }

  /* ---------------- Portal im Risalit ---------------- */
  const PORTAL = { w: 1.3, z0: ZS, h: 2.55 };
  function portalMalen(g, F, L, S, Z, W) {
    const H = ZT, cx = W / 2, px = F.px;
    const tw = PORTAL.w, tx = cx - tw / 2, tUnten = H - ZS, tOben = H - ZS - PORTAL.h, bogenY = tOben + tw / 2;
    /* Rahmen: Pilaster, Bogen, Gebälk mit Schrift */
    g.fillStyle = L(SANDSTEIN); g.fillRect(cx - 1.12, H - 4.02, 2.24, 4.02 - ZS + 0.02);
    quaderwerk(g, F, L, cx - 1.12, H - 3.72, 2.24, 3.72 - ZS, { saat: 57, lage: 0.29, farbe: SANDSTEIN });
    /* Pilaster */
    for (const sx of [-1, 1]) {
      const px0 = cx + sx * 0.95 - 0.13;
      g.fillStyle = L(hell(SANDSTEIN_H, 0.08)); g.fillRect(px0, H - 3.72, 0.26, 3.72 - ZS);
      g.fillStyle = L(hell(SANDSTEIN_H, -0.22)); g.fillRect(px0 + (sx < 0 ? 0.22 : 0), H - 3.72, 0.04, 3.72 - ZS);
      g.fillStyle = L(hell(SANDSTEIN_H, 0.15)); g.fillRect(px0 - 0.04, H - 3.78, 0.34, 0.08); g.fillRect(px0 - 0.04, H - ZS - 0.12, 0.34, 0.12);
    }
    /* Gebälk */
    const gy = H - 4.3;
    g.fillStyle = L(hell(SANDSTEIN_H, 0.1)); g.fillRect(cx - 1.25, gy, 2.5, 0.58);
    g.fillStyle = L(hell(SANDSTEIN_H, -0.25)); g.fillRect(cx - 1.25, gy + 0.56, 2.5, 0.03);
    g.fillStyle = L(hell(SANDSTEIN_H, 0.2)); g.fillRect(cx - 1.32, gy - 0.1, 2.64, 0.1);
    g.fillStyle = L(hell(SANDSTEIN_H, -0.3)); g.fillRect(cx - 1.32, gy - 0.02, 2.64, 0.02);
    if (S.winter && Z.schnee > 0.5) schneeKappe(g, F, cx - 1.32, gy - 0.095, 2.64, 0.06, 13);
    if (Z.schrift) {
      /* Schriftzug SCHULE: eingehauen und schwarz ausgelegt */
      g.font = "bold 0.3px serif"; g.textAlign = "center"; g.textBaseline = "middle";
      const txt = "S C H U L E";
      if (px > 5) {
        g.fillStyle = "rgba(255,250,236,0.55)"; g.fillText(txt, cx + 0.012, gy + 0.31);
        g.fillStyle = L([34, 30, 28]); g.fillText(txt, cx, gy + 0.295);
      } else { g.fillStyle = L([60, 54, 48]); g.fillRect(cx - 0.9, gy + 0.2, 1.8, 0.2); }
    }
    /* Türöffnung mit Rundbogen */
    const tpfad = (dx, dy) => { g.beginPath(); g.moveTo(tx + dx, tUnten + dy); g.lineTo(tx + dx, bogenY + dy); g.arc(cx + dx, bogenY + dy, tw / 2, Math.PI, 2 * Math.PI); g.lineTo(tx + tw + dx, tUnten + dy); g.closePath(); };
    /* Bogen aus Keilsteinen mit Schlussstein und Jahreszahl */
    for (let i = 0; i < 9; i++) {
      const a0 = Math.PI + i * Math.PI / 9, a1 = a0 + Math.PI / 9;
      g.fillStyle = L(PI.streu(SANDSTEIN_H, zufall(i + 40), 0.05));
      g.beginPath(); g.arc(cx, bogenY, tw / 2 + (i === 4 ? 0.3 : 0.22), a0, a1); g.arc(cx, bogenY, tw / 2, a1, a0, true); g.closePath(); g.fill();
      g.strokeStyle = L(hell(SANDSTEIN_H, -0.3)); g.lineWidth = Math.max(0.006, 0.7 / px); g.stroke();
    }
    if (px > 22) { g.fillStyle = L([60, 50, 40]); g.font = "bold 0.075px serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("1902", cx, bogenY - tw / 2 - 0.12); }
    tpfad(0, 0); g.fillStyle = "rgb(46,40,36)"; g.fill();
    const sv = F.schatten ? F.schatten(0.25) : null;
    if (Z.tuer) {
      g.save(); tpfad(0, 0); g.clip();
      /* Oberlicht mit Sonnenfächer */
      g.fillStyle = "rgb(58,68,86)"; g.fillRect(tx, tOben, tw, tw / 2 + 0.08);
      g.strokeStyle = L(WEISS); g.lineWidth = 0.03;
      g.beginPath(); for (let i = 0; i <= 6; i++) { const a = Math.PI + i * Math.PI / 6; g.moveTo(cx, bogenY + 0.06); g.lineTo(cx + Math.cos(a) * tw / 2, bogenY + 0.06 + Math.sin(a) * tw / 2); } g.stroke();
      g.beginPath(); g.arc(cx, bogenY + 0.06, tw * 0.16, Math.PI, 2 * Math.PI); g.stroke();
      g.fillStyle = L(WEISS); g.fillRect(tx, bogenY + 0.04, tw, 0.06);
      /* zweiflügelige Tür in Schulgrün mit Kassetten */
      const ty = bogenY + 0.1;
      for (let s = 0; s < 2; s++) {
        const fx = tx + s * tw / 2, fw = tw / 2;
        g.fillStyle = L(HOLZ); g.fillRect(fx, ty, fw, tUnten - ty);
        g.fillStyle = L(hell(HOLZ, -0.3)); g.fillRect(fx + (s ? 0 : fw - 0.02), ty, 0.02, tUnten - ty);
        if (px > 10) {
          g.strokeStyle = L(hell(HOLZ, -0.35)); g.lineWidth = 0.02;
          g.strokeRect(fx + 0.1, ty + 0.12, fw - 0.2, 0.75); g.strokeRect(fx + 0.1, ty + 1.02, fw - 0.2, tUnten - ty - 1.15);
          g.strokeStyle = L(hell(HOLZ, 0.25)); g.lineWidth = 0.01;
          g.strokeRect(fx + 0.115, ty + 0.135, fw - 0.2, 0.75);
          /* Glas im oberen Feld */
          g.fillStyle = "rgb(62,72,92)"; g.fillRect(fx + 0.14, ty + 0.16, fw - 0.28, 0.67);
          g.fillStyle = "rgba(255,255,255,0.18)"; g.beginPath(); g.moveTo(fx + 0.14, ty + 0.83); g.lineTo(fx + fw * 0.6, ty + 0.16); g.lineTo(fx + fw * 0.8, ty + 0.16); g.lineTo(fx + 0.3, ty + 0.83); g.fill();
        }
      }
      g.fillStyle = L(GOLD); g.fillRect(cx - 0.12, ty + 1.2, 0.09, 0.03); g.fillRect(cx + 0.03, ty + 1.2, 0.09, 0.03);
      if (S.winter && Z.deko) kranzMalen(g, cx, ty + 0.5, 0.22, px);
      g.restore();
    }
    if (sv) {
      g.save(); tpfad(0, 0); g.clip();
      g.fillStyle = "rgba(20,16,20,0.4)";
      g.beginPath(); g.moveTo(tx, tUnten); g.lineTo(tx, bogenY); g.arc(cx, bogenY, tw / 2, Math.PI, 2 * Math.PI);
      g.lineTo(tx + tw + sv[0], bogenY + sv[1]); g.arc(cx + sv[0], bogenY + sv[1], tw / 2, 2 * Math.PI, Math.PI, true); g.lineTo(tx + sv[0], tUnten); g.closePath(); g.fill();
      g.restore();
    }
    /* Wandlaterne neben der Tür */
    const lx = cx + 1.42, ly = H - 3.05;
    g.strokeStyle = L(EISEN); g.lineWidth = 0.03; g.beginPath(); g.moveTo(lx - 0.15, ly - 0.05); g.quadraticCurveTo(lx, ly - 0.2, lx, ly - 0.1); g.stroke();
    g.fillStyle = L(EISEN); g.beginPath(); g.moveTo(lx - 0.11, ly - 0.08); g.lineTo(lx + 0.11, ly - 0.08); g.lineTo(lx, ly - 0.2); g.fill();
    g.fillRect(lx - 0.08, ly - 0.08, 0.16, 0.3);
    g.fillStyle = (F.nacht || 0) > 0.05 ? "rgb(255,226,150)" : L([150, 160, 170]); g.fillRect(lx - 0.06, ly - 0.05, 0.12, 0.23);
    /* Klingelzug und Schild „Volksschule" */
    if (px > 18) {
      g.fillStyle = L([30, 50, 110]); PI.rundRechteck(g, cx - 1.6, H - 2.4, 0.34, 0.22, 0.02); g.fill();
      g.strokeStyle = L(WEISS); g.lineWidth = 0.01; PI.rundRechteck(g, cx - 1.58, H - 2.38, 0.3, 0.18, 0.015); g.stroke();
      g.fillStyle = L(WEISS); g.font = "bold 0.045px sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("Volks-", cx - 1.43, H - 2.33); g.fillText("schule", cx - 1.43, H - 2.25);
    }
  }
  function portalLeuchten(g, F, W) {
    const H = ZT, cx = W / 2, a = F.nacht || 0;
    const lx = cx + 1.42, ly = H - 3.05;
    g.fillStyle = "rgba(255,230,160," + a + ")"; g.fillRect(lx - 0.06, ly - 0.05, 0.12, 0.23);
    const gr = g.createRadialGradient(lx, ly, 0, lx, ly, 1.6);
    gr.addColorStop(0, "rgba(255,200,120," + (0.5 * a) + ")"); gr.addColorStop(1, "rgba(255,180,90,0)");
    g.fillStyle = gr; g.fillRect(lx - 1.6, ly - 1.6, 3.2, 3.2);
    schein(F, lx, ly + 0.05, 1.6, "255,206,130", 0.75);
    /* Oberlicht der Tür warm */
    const tw = PORTAL.w, tOben = H - ZS - PORTAL.h, bogenY = tOben + tw / 2;
    g.save(); g.beginPath(); g.moveTo(cx - tw / 2, bogenY + 0.05); g.arc(cx, bogenY + 0.05, tw / 2 - 0.02, Math.PI, 2 * Math.PI); g.closePath(); g.clip();
    g.fillStyle = "rgba(255,200,120," + (0.8 * a) + ")"; g.fillRect(cx - tw / 2, tOben, tw, tw / 2 + 0.06);
    g.strokeStyle = "rgba(70,40,24," + a + ")"; g.lineWidth = 0.03; g.beginPath(); for (let i = 0; i <= 6; i++) { const t = Math.PI + i * Math.PI / 6; g.moveTo(cx, bogenY + 0.06); g.lineTo(cx + Math.cos(t) * tw / 2, bogenY + 0.06 + Math.sin(t) * tw / 2); } g.stroke();
    g.restore();
  }

  /* ---------------- Risalitgiebel mit Uhr ---------------- */
  function giebelMaler(S, Z, hochG) {
    return function (g, F) {
      const W = F.w, H = F.h, L = L0;          // b = 0 in ZG
      backstein(g, F, L, -0.05, -0.05, W + 0.1, H + 0.1, ZG, { saat: 71, gelb: (z) => z > ZT && z < ZT + 0.16 });
      /* Zahnfries entlang der Schrägen */
      if (F.px > 8) {
        g.fillStyle = L(KLINKER);
        for (const sx of [-1, 1]) for (let t = 0.1; t < 1; t += 0.07) {
          const x = W / 2 + sx * t * W / 2, y = t * H + 0.12;
          g.fillRect(x - 0.05, y, 0.1, 0.1);
        }
      }
      if (Z.uhr) {
        const cy = ZG - UHR_Z;
        g.fillStyle = L(SANDSTEIN_H); g.beginPath(); g.arc(W / 2, cy, UHR_R * 1.32, 0, TAU); g.fill();
        g.strokeStyle = L(hell(SANDSTEIN_H, -0.3)); g.lineWidth = 0.02; g.stroke();
        uhrMalen(g, F, W / 2, cy, UHR_R, false);
      }
      if (hochG < 1) { g.fillStyle = "rgba(255,236,220,0.22)"; g.fillRect(0, 0, W, H); }
    };
  }

  /* =====================================================================
     BAUGRUBE UND FUNDAMENT
     ===================================================================== */
  const GRUBE = [X0 - 0.7, YN - 0.7, X1 + 0.7, YR + 0.6];
  function grubeBauen(M, B, S, Z) {
    const R = GRUBE, T = Math.max(0.04, Z.grubeT);
    const [x0, y0, x1, y1] = R;
    const ex = { keinLicht: true, keinAo: true };
    M.teil("baugrube", { ebene: -3, mitte: [0, 0, -3], schatten: false });
    const wandMal = (saat) => (g, F) => { g.save(); if (!lochClip(g, F, B, R)) { g.restore(); return; } erdeMalen(g, F, Lm(F, 0.85), F.w, F.h, saat, S.winter); g.restore(); };
    M.flaeche(Object.assign({ name: "gb", o: [x0, y0, -T], u: [1, 0, 0], v: [0, 1, 0], w: x1 - x0, h: y1 - y0, ebene: -1, malen: (g, F) => {
      g.save(); if (!lochClip(g, F, B, R)) { g.restore(); return; }
      const L = Lm(F, 0.9);
      g.fillStyle = L([120, 90, 62]); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
      if (F.px > 6) rausch(g, 0, 0, F.w, F.h, 1.2, 0.3, 17, 3);
      if (S.winter) { g.fillStyle = L([236, 240, 248], 0.4); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); }
      g.restore();
    } }, ex));
    wand(M, "gw-n", [x0, y0], [x1, y0], -T, 0, wandMal(101), ex);
    wand(M, "gw-s", [x1, y1], [x0, y1], -T, 0, wandMal(102), ex);
    wand(M, "gw-o", [x1, y0], [x1, y1], -T, 0, wandMal(103), ex);
    wand(M, "gw-w", [x0, y1], [x0, y0], -T, 0, wandMal(104), ex);
    if (Z.fund > 0) {
      const zt = -T + Math.min(T, 0.9) * glatt(Z.fund);
      const fx0 = X0 - 0.15, fx1 = X1 + 0.15, fy0 = YN - 0.15, fy1 = YR + 0.15;
      const nass = Z.fund < 0.8;
      const beton = (g, F) => {
        g.save(); if (!lochClip(g, F, B, R)) { g.restore(); return; }
        const L = Lm(F), w = F.w, h = F.h;
        if (Z.fund < 0.45) for (let x = 0; x < w; x += 0.22) { g.fillStyle = L(PI.streu([168, 132, 88], zufall(x * 100 + 3), 0.08)); g.fillRect(x, -0.1, 0.21, h + 0.2); }
        else { g.fillStyle = L(nass ? [126, 126, 122] : [172, 170, 162]); g.fillRect(-0.05, -0.05, w + 0.1, h + 0.1); if (F.px > 8) rausch(g, 0, 0, w, h, 1.1, 0.25, 40, 3); }
        g.restore();
      };
      if (zt + T > 0.02) {
        wand(M, "f-s", [fx0, fy1], [fx1, fy1], -T, zt, beton, ex);
        wand(M, "f-n", [fx1, fy0], [fx0, fy0], -T, zt, beton, ex);
        wand(M, "f-o", [fx1, fy1], [fx1, fy0], -T, zt, beton, ex);
        wand(M, "f-w", [fx0, fy0], [fx0, fy1], -T, zt, beton, ex);
        M.flaeche(Object.assign({ name: "f-t", o: [fx0, fy0, zt], u: [1, 0, 0], v: [0, 1, 0], w: fx1 - fx0, h: fy1 - fy0, ebene: 1, malen: (g, F) => {
          const L = Lm(F), w = F.w, h = F.h;
          g.fillStyle = L(Z.fund < 0.45 ? [120, 96, 70] : nass ? [118, 120, 122] : [176, 174, 166]); g.fillRect(-0.05, -0.05, w + 0.1, h + 0.1);
          if (F.px > 8) rausch(g, 0, 0, w, h, 0.9, 0.2, 31, 3);
          if (Z.fund < 0.75) { g.strokeStyle = L([96, 62, 42]); g.lineWidth = 0.025; g.beginPath(); for (let x = 0.3; x < w; x += 0.3) { g.moveTo(x, 0.1); g.lineTo(x, h - 0.1); } for (let y = 0.3; y < h; y += 0.3) { g.moveTo(0.1, y); g.lineTo(w - 0.1, y); } g.stroke(); }
          else if (F.px > 6) { g.strokeStyle = L([60, 60, 60], 0.5); g.lineWidth = 0.03; g.strokeRect(0.15, 0.15, X1 - X0, YS - YN); g.strokeRect(0.15 + X1 - RB, 0.15 + YS - YN, 2 * RB, YR - YS); }
          if (S.winter && !nass) { g.fillStyle = "rgba(240,244,250,0.45)"; g.fillRect(0, 0, w, h); }
        } }, ex));
      }
    }
    M.teil("aushub", { mitte: [X1 + 3, 0, 0.5] });
    M.figur({ x: X1 + 2.3, y: -1.8, z: 0, breite: 5, hoehe: 1.8, malen: aushubFigur(glatt(Z.grubeT / 1.2), S.winter) });
  }

  /* =====================================================================
     BAUZUSTAND
     XANDER: „Man soll das Fundament sehen beim Aufbauen … wie das nach
     2 Minuten aussieht, nach 5 … 10 … 15 Minuten, bis es fertig ist."
       0,00–0,06  Baugrube, Aushub
       0,06–0,12  Fundament: Schalung, Eisen, Beton
       0,12–0,20  Sockel aus Sandstein (Hochparterre)
       0,20–0,40  Erdgeschoss, Schicht für Schicht; Fensterstürze
       0,40–0,44  Kordongesims und Balkenlage
       0,44–0,62  Obergeschoss bis zur Traufe
       0,62–0,68  Risalitgiebel wird gemauert
       0,68–0,76  Dachstuhl, 0,75–0,84 Richtkrone
       0,76–0,88  Lattung, dann Schiefer von der Traufe zum First
       0,82–0,92  Kamine, Dachreiter (Gerippe, dann Schiefer), Glocke
       0,86–0,95  Freitreppe, Fenster, Tür, Uhr, Schriftzug
       0,92–1,00  Hof, Zaun, Reck, Schmuck und Schnee
     ===================================================================== */
  function zustand(bau) {
    const k = (a, b) => phase(bau, a, b);
    const Z = { bau: bau, fertig: bau >= 0.999 };
    Z.grube = bau < 0.14;
    Z.grubeT = 1.2 * glatt(k(0.0, 0.06));
    Z.fund = k(0.06, 0.12);
    Z.wandZ = bau < 0.12 ? 0 : bau < 0.2 ? ZS * k(0.12, 0.2) : bau < 0.4 ? ZS + (ZE - ZS) * k(0.2, 0.4) : bau < 0.44 ? ZE + (ZK - ZE) * k(0.4, 0.44) : ZK + (ZT - ZK) * k(0.44, 0.62);
    Z.giebel = k(0.62, 0.68);
    Z.stuhl = k(0.68, 0.76);
    Z.richt = bau >= 0.75 && bau < 0.84;
    Z.latten = k(0.76, 0.8); Z.deck = k(0.8, 0.88);
    Z.dachFertig = bau >= 0.88;
    Z.kamin = k(0.82, 0.88);
    Z.reiter = bau < 0.84 ? 0 : bau < 0.88 ? 1 : 2;
    Z.glocke = bau >= 0.9;
    Z.treppe = k(0.86, 0.9); Z.gelaender = bau >= 0.92;
    Z.fenster = bau >= 0.88; Z.tuer = bau >= 0.9; Z.uhr = bau >= 0.93; Z.schrift = bau >= 0.93;
    Z.hof = bau >= 0.9; Z.zaun = k(0.92, 0.97); Z.reck = bau >= 0.97;
    Z.deko = bau >= 0.97;
    Z.schnee = Z.fertig ? 1 : k(0.88, 0.98);
    return Z;
  }

  function fassadenTeil(M, name, n, c, opt) {
    return M.teil(name, Object.assign({ mitte: [c[0] + n[0] * AUSSEN, c[1] + n[1] * AUSSEN, c[2]] }, opt || {}));
  }

  /* =====================================================================
     HAUS
     ===================================================================== */
  const F_EG = { z0: 1.55, h: 2.25, eg: true }, F_OG = { z0: 5.12, h: 2.08 };
  const fen = (as, w, art) => as.map((a) => Object.assign({ a: a, w: w }, art));
  function hausBauen(M, B, S, Z) {
    const hoch = Math.max(0.05, Math.min(ZT, Z.wandZ));
    const ex = (name, extra) => Object.assign({ name: name, ao: true }, extra || {});
    /* Südfront: zwei Flügel neben dem Risalit */
    const wingW = { fenster: fen([1.05, 2.2, 3.35], 0.85, F_EG).concat(fen([1.05, 2.2, 3.35], 0.85, F_OG)), keller: [1.05, 2.2, 3.35], ecken: [true, false], rohr: 0.22 };
    const wingO = { fenster: fen([0.55, 1.7, 2.85], 0.85, F_EG).concat(fen([0.55, 1.7, 2.85], 0.85, F_OG)), keller: [0.55, 1.7, 2.85], ecken: [false, true], rohr: 3.68, a0: 0.3 };
    const ost = { fenster: fen([1.5, 4.3], 0.9, F_EG).concat(fen([1.5, 4.3], 0.9, F_OG)), keller: [1.5, 4.3] };
    const west = { fenster: fen([1.7, 4.5], 0.9, F_EG).concat(fen([1.7, 4.5], 0.9, F_OG)), keller: [1.7, 4.5] };
    const nord = { fenster: fen([1.3, 3.2, 8.0, 9.9], 0.9, F_EG).concat(fen([1.3, 3.2, 5.6, 8.0, 9.9], 0.9, F_OG)), keller: [1.3, 3.2, 8.0, 9.9], tuer: { a: 5.6, w: 1.1, h: 2.3 } };
    M.teil("haus", { mitte: [0, (YN + YS) / 2, hoch / 2] });
    wand(M, "s-w", [X0, YS], [-RB, YS], 0, hoch, fassadeMaler(wingW, hoch, S, Z), ex("s-w", { leuchten: fassadeLeuchten(wingW, hoch, Z, 0.7), traufe: hoch >= ZT ? UE : 0, traufeY: 0 }));
    wand(M, "s-o", [RB, YS], [X1, YS], 0, hoch, fassadeMaler(wingO, hoch, S, Z), ex("s-o", { leuchten: fassadeLeuchten(wingO, hoch, Z, 0.7), traufe: hoch >= ZT ? UE : 0, traufeY: 0 }));
    wand(M, "o", [X1, YS], [X1, YN], 0, hoch, fassadeMaler(ost, hoch, S, Z), ex("o", { leuchten: fassadeLeuchten(ost, hoch, Z, 0.5) }));
    wand(M, "w", [X0, YN], [X0, YS], 0, hoch, fassadeMaler(west, hoch, S, Z), ex("w", { leuchten: fassadeLeuchten(west, hoch, Z, 0.5) }));
    wand(M, "n", [X1, YN], [X0, YN], 0, hoch, fassadeMaler(nord, hoch, S, Z), ex("n", { leuchten: fassadeLeuchten(nord, hoch, Z, 0.45), traufe: hoch >= ZT ? UE : 0, traufeY: 0 }));
    /* Mauerkrone im Bau: Wandstärke hell, innen Balkenlage oder dunkler Raum */
    if (Z.wandZ < ZT - 0.01) {
      M.flaeche({ name: "krone", o: [X0, YN, hoch], u: [1, 0, 0], v: [0, 1, 0], w: X1 - X0, h: YR - YN, keinAo: true, umriss: [[0, 0], [X1 - X0, 0], [X1 - X0, YS - YN], [X1 - RB - X0, YS - YN], [X1 - RB - X0, YR - YN], [RB - X0 - 2 * RB, YR - YN], [-RB - X0, YS - YN], [0, YS - YN]], malen: (g, F) => {
        const w = F.w, t = YS - YN, d = 0.42;
        g.fillStyle = "rgb(78,64,56)"; g.fillRect(-0.05, -0.05, w + 0.1, F.h + 0.1);
        if (hoch > ZK - 0.05) {
          /* Dielen des Obergeschosses */
          for (let x = d; x < w - d; x += 0.2) { g.fillStyle = rgb(PI.streu(hell(HOLZ_ROH, -0.05), zufall(x * 40 + 1), 0.07)); g.fillRect(x, d, 0.19, t - 2 * d); }
          g.fillStyle = "rgba(0,0,0,0.25)"; g.fillRect(d, d, w - 2 * d, 0.3);
        }
        const c = hoch <= ZS + 0.01 ? SANDSTEIN_H : BACKSTEIN;
        g.fillStyle = rgb(hell(c, 0.08));
        g.fillRect(0, 0, w, d); g.fillRect(0, t - d, w, d); g.fillRect(0, 0, d, t); g.fillRect(w - d, 0, d, t);
        g.fillRect(X1 - RB - X0 - d, t - d, d, YR - YS + d); g.fillRect(-RB - X0, t - d, d, YR - YS + d); g.fillRect(-RB - X0, YR - YN - d, 2 * RB, d);
        if (S.winter) { g.fillStyle = "rgba(240,244,250,0.55)"; g.fillRect(0, 0, w, d * 0.5); }
      } });
    }
    /* Risalit */
    fassadenTeil(M, "risalit", [0, 1, 0], [0, (YS + YR) / 2, hoch / 2]);
    const risS = { fenster: fen([RB - 0.55, RB + 0.55], 0.78, F_OG), keller: [], ecken: [true, true], a0: 0.12, danach: (g, F, L) => { if (hoch > ZE) portalMalen(g, F, L, S, Z, 2 * RB); }, leuchten: (g, F) => portalLeuchten(g, F, 2 * RB) };
    const risSeite = { fenster: [], ecken: [false, true] };
    const risSeiteW = { fenster: [], ecken: [true, false] };
    wand(M, "r-s", [-RB, YR], [RB, YR], 0, hoch, fassadeMaler(risS, hoch, S, Z), ex("r-s", { leuchten: fassadeLeuchten(risS, hoch, Z, 0.9) }));
    wand(M, "r-o", [RB, YR], [RB, YS], 0, hoch, fassadeMaler(risSeite, hoch, S, Z), ex("r-o"));
    wand(M, "r-w", [-RB, YS], [-RB, YR], 0, hoch, fassadeMaler(risSeiteW, hoch, S, Z), ex("r-w"));
    /* Giebel des Risalits */
    if (Z.giebel > 0) {
      const zg = ZT + (ZG - ZT) * Z.giebel, hw = RB * (1 - (zg - ZT) / (ZG - ZT));
      const um = Z.giebel >= 1 ? [[0, ZG - ZT], [RB, 0], [2 * RB, ZG - ZT]] : [[0, zg - ZT], [0, zg - ZT], [RB - hw, 0], [RB + hw, 0], [2 * RB, zg - ZT]].map(([a, b]) => [a, b]);
      const umG = Z.giebel >= 1 ? um : [[0, zg - ZT], [RB - hw, 0], [RB + hw, 0], [2 * RB, zg - ZT]];
      fassadenTeil(M, "r-giebel", [0, 1, 0], [0, YR, 9]);
      M.flaeche({ name: "r-giebel", o: [-RB, YR, zg], u: [1, 0, 0], v: [0, 0, -1], w: 2 * RB, h: zg - ZT, umriss: umG, keinAo: true, malen: (g, F) => { g.save(); g.translate(0, -(ZG - zg)); giebelMaler(S, Z, Z.giebel)(g, F); g.restore(); }, leuchten: (g, F) => { if (!Z.uhr) return; g.translate(0, -(ZG - zg)); uhrMalen(g, F, RB, ZG - UHR_Z, UHR_R, true); schein(F, RB, ZG - UHR_Z, 1.0, "255,226,160", 0.5); } });
    }
  }

  /* ---------------- Dach ---------------- */
  function dachBauen(M, B, S, Z) {
    if (Z.stuhl <= 0) return;
    const offen = !Z.dachFertig;
    const ext = offen ? { keinLicht: true, beidseitig: true } : {};
    const malO = (saat) => dachMaler({ offen: offen, schiefer: true, sparren: Z.stuhl, latten: Z.latten, ziegel: offen ? Z.deck : 1, schnee: S.winter ? Z.schnee : 0, jahr: S.jahr, saat: saat });
    for (const sued of [true, false]) {
      const yT = sued ? YTS : YTN;
      const plan = sued ? [[X0, YM], [X1, YM], [X1, yT], [RB, yT], [RB, kehleY(RB)], [0, kehleY(0)], [-RB, kehleY(RB)], [-RB, yT], [X0, yT]] : [[X1, YM], [X0, YM], [X0, yT], [X1, yT]];
      M.teil(sued ? "dach-s" : "dach-n", { mitte: [0, sued ? YM + 1.6 : YM - 1.6, ZF - 1.8] });
      vieleck(M, sued ? "dach-s" : "dach-n", plan.map(([x, y]) => [x, y, dachZ(y)]), sued ? [0, SN, CN] : [0, -SN, CN], sued ? [1, 0, 0] : [-1, 0, 0], malO(sued ? 11 : 13), ext);
      if (offen && Z.deck <= 0) continue;
      const segs = sued ? [[X0, -RB], [RB, X1]] : [[X0, X1]];
      for (const [xa, xb] of segs) {
        const p0 = sued ? [xa, yT] : [xb, yT], p1 = sued ? [xb, yT] : [xa, yT];
        wand(M, "traufe" + xa, p0, p1, ZTR - 0.2, ZTR, rinneMaler(S, Z, offen), { keinAo: true });
        if (S.winter && Z.schnee > 0.6 && !offen) wand(M, "eis" + xa + sued, p0, p1, ZTR - 0.7, ZTR - 0.2, eisMaler(xa + (sued ? 1 : 3)), { keinAo: true, keinLicht: true });
      }
    }
    /* Giebel Ost/West: Backstein-Dreiecke */
    for (const sx of [1, -1]) {
      M.teil("giebel" + sx, { mitte: [sx * (X1 + AUSSEN * 0.99), YM, ZT + 1], schatten: !offen });
      const W = YS - YN, H = ZF - 0.2 - ZT;
      const o = sx > 0 ? [X1, YS, ZF - 0.2] : [X0, YN, ZF - 0.2];
      M.flaeche({ name: "g" + sx, o: o, u: sx > 0 ? [0, -1, 0] : [0, 1, 0], v: [0, 0, -1], w: W, h: H, umriss: [[0, H], [W / 2, 0], [W, H]], keinAo: true, malen: (g, F) => {
        backstein(g, F, L0, -0.05, -0.05, F.w + 0.1, F.h + 0.1, ZF - 0.2, { saat: 80 + sx, gelb: (z) => z > ZT && z < ZT + 0.16 });
        /* Bodenfenster (Rundbogen) */
        const cx = W / 2, fy = H - 1.35, fw = 0.6;
        g.fillStyle = L0(KLINKER); g.beginPath(); g.moveTo(cx - fw / 2 - 0.12, fy + 0.9); g.lineTo(cx - fw / 2 - 0.12, fy + 0.2); g.arc(cx, fy + 0.2, fw / 2 + 0.12, Math.PI, 2 * Math.PI); g.lineTo(cx + fw / 2 + 0.12, fy + 0.9); g.fill();
        g.fillStyle = Z.fenster ? "rgb(50,58,74)" : "rgb(40,34,32)"; g.beginPath(); g.moveTo(cx - fw / 2, fy + 0.85); g.lineTo(cx - fw / 2, fy + 0.2); g.arc(cx, fy + 0.2, fw / 2, Math.PI, 2 * Math.PI); g.lineTo(cx + fw / 2, fy + 0.85); g.fill();
        if (Z.fenster && F.px > 10) { g.strokeStyle = L0(WEISS); g.lineWidth = 0.04; g.beginPath(); g.moveTo(cx, fy - 0.1); g.lineTo(cx, fy + 0.85); g.moveTo(cx - fw / 2, fy + 0.35); g.lineTo(cx + fw / 2, fy + 0.35); g.stroke(); }
        g.fillStyle = L0(SANDSTEIN_H); g.fillRect(cx - fw / 2 - 0.1, fy + 0.85, fw + 0.2, 0.07);
        /* Maueranker */
        if (F.px > 8) { g.fillStyle = L0(EISEN); for (const a of [W * 0.3, W * 0.7]) { g.fillRect(a - 0.02, H - 0.9, 0.04, 0.3); g.fillRect(a - 0.12, H - 0.77, 0.24, 0.04); } }
      } });
      /* Ortgang-Überstand und Windbrett, je Dachseite ein Teil */
      if (offen && Z.deck <= 0) continue;
      const xa = sx > 0 ? X1 : X0 - UEG, xb = sx > 0 ? X1 + UEG : X0, xe = sx > 0 ? xb : xa;
      for (const sued of [true, false]) {
        M.teil("ort" + sx + sued, { mitte: [sx * (X1 + AUSSEN), YM + (sued ? 30 : -30), ZF - 2] });
        const yT = sued ? YTS : YTN;
        vieleck(M, "ort" + sx + sued, [[xa, YM, ZF], [xb, YM, ZF], [xb, yT, dachZ(yT)], [xa, yT, dachZ(yT)]], sued ? [0, SN, CN] : [0, -SN, CN], sued ? [1, 0, 0] : [-1, 0, 0], malO(21 + (sued ? 1 : 0)), ext);
        const d = 0.22;
        vieleck(M, "wind" + sx + sued, [[xe, yT, dachZ(yT)], [xe, YM, ZF], [xe, YM, ZF - d / CN], [xe, yT, dachZ(yT) - d]], [sx, 0, 0], [0, -sx, 0], windMaler(S, Z), {});
      }
    }
    /* Risalitdach: zwei Flächen bis zur Kehle, vorn das Windbrett */
    M.teil("risalitdach", { mitte: [0, AUSSEN + 1.2, 12] });
    for (const sx of [-1, 1]) {
      const pts = [[0, kehleY(0)], [0, YRD], [sx * RB, YRD], [sx * RB, kehleY(RB)]].map(([x, y]) => [x, y, QZF - Math.abs(x) * TN]);
      vieleck(M, "rd" + sx, pts, [sx * SN, 0, CN], [0, -sx, 0], malO(31 + sx), ext);
    }
    if (!offen || Z.deck > 0) {
      const d = 0.22;
      for (const sx of [-1, 1]) {
        vieleck(M, "rw" + sx, [[0, YRD, QZF], [sx * RB, YRD, ZDT], [sx * RB, YRD, ZDT - d], [0, YRD, QZF - d / CN]], [0, 1, 0], [1, 0, 0], windMaler(S, Z), {});
        wand(M, "rt" + sx, sx > 0 ? [RB, YRD] : [-RB, kehleY(RB)], sx > 0 ? [RB, kehleY(RB)] : [-RB, YRD], ZDT - 0.2, ZDT, rinneMaler(S, Z, offen), { keinAo: true });
      }
    }
  }
  function windMaler(S, Z) {
    return (g, F) => {
      g.fillStyle = rgb([226, 222, 210]); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
      g.fillStyle = rgb([150, 146, 136]); g.fillRect(-0.1, F.h * 0.7, F.w + 0.2, F.h);
      if (S.winter && Z.schnee > 0.3) { const u = F.flaeche.umriss; g.strokeStyle = "rgb(244,247,252)"; g.lineWidth = 0.08; g.beginPath(); g.moveTo(u[0][0], u[0][1] - 0.02); g.lineTo(u[1][0], u[1][1] - 0.02); g.stroke(); }
    };
  }
  function rinneMaler(S, Z, offen) {
    return function (g, F) {
      const w = F.w, h = F.h;
      g.fillStyle = rgb([200, 196, 186]); g.fillRect(-0.02, 0, w + 0.04, h);
      if (offen) return;
      const gr = g.createLinearGradient(0, h * 0.3, 0, h);
      gr.addColorStop(0, rgb([176, 182, 186])); gr.addColorStop(0.5, rgb([140, 146, 150])); gr.addColorStop(1, rgb([100, 104, 108]));
      g.fillStyle = gr; g.fillRect(-0.02, h * 0.35, w + 0.04, h * 0.65);
      if (S.winter && Z.schnee > 0.3) { g.fillStyle = "rgb(244,247,252)"; g.beginPath(); g.moveTo(-0.02, h * 0.5); for (let x = 0; x <= w + 0.02; x += 0.25) g.lineTo(x, h * 0.12 - 0.05 * Math.sin(x * 2.7)); g.lineTo(w + 0.02, h * 0.5); g.fill(); }
      if (S.jahr === "herbst") laub(g, F, 0, 0, w, h * 0.4, 30, 5);
    };
  }
  function eisMaler(saat) {
    return function (g, F) { eiszapfen(g, F, 0.1, F.w - 0.1, 0, 0.4, (saat * 100) | 0 + 17, Lm(F)); };
  }

  /* ---------------- Dachreiter mit Schulglocke ---------------- */
  function reiterBauen(M, B, S, Z) {
    if (Z.reiter <= 0) return;
    const gerippe = Z.reiter < 2;
    const exG = gerippe ? { keinLicht: true, beidseitig: true } : {};
    const wandMal = (g, F) => {
      const w = F.w, h = F.h;
      if (gerippe) { const L = Lm(F); g.fillStyle = L(HOLZ_ROH); g.fillRect(0, 0, 0.12, h); g.fillRect(w - 0.12, 0, 0.12, h); g.fillRect(0, 0, w, 0.12); g.strokeStyle = L(HOLZ_ROH); g.lineWidth = 0.09; g.beginPath(); g.moveTo(0.1, h); g.lineTo(w - 0.1, 0.2); g.stroke(); return; }
      schuppen(g, F, L0, -0.05, -0.05, w + 0.1, h + 0.1, SCHIEFER, 91 + (F.name.length % 5), 0.09);
      g.fillStyle = rgb(WEISS); g.fillRect(0, 0, 0.06, h); g.fillRect(w - 0.06, 0, 0.06, h);
      /* kleines Schallfenster */
      if (F.w > 1 && F.h > 0.9) { g.fillStyle = rgb(WEISS); g.fillRect(w / 2 - 0.2, 0.18, 0.4, 0.36); g.fillStyle = "rgb(40,34,32)"; g.fillRect(w / 2 - 0.15, 0.22, 0.3, 0.28); if (F.px > 12) { g.fillStyle = rgb([110, 104, 96]); for (let y = 0.24; y < 0.48; y += 0.06) g.fillRect(w / 2 - 0.15, y, 0.3, 0.03); } }
    };
    M.teil("reiter", { ebene: 5, mitte: [0, YM, ZF + 0.3] });
    const zS = dachZ(RY1);
    wand(M, "rs", [-RX, RY1], [RX, RY1], zS, RZ1, wandMal, Object.assign({ keinAo: true }, exG));
    wand(M, "rn", [RX, RY0], [-RX, RY0], zS, RZ1, wandMal, Object.assign({ keinAo: true }, exG));
    for (const sx of [-1, 1]) {
      const x = sx * RX, pts = [[x, RY1, RZ1], [x, RY0, RZ1], [x, RY0, zS], [x, YM, ZF], [x, RY1, zS]];
      vieleck(M, "rr" + sx, sx > 0 ? pts : pts.slice().reverse(), [sx, 0, 0], [0, -sx, 0], wandMal, exG);
    }
    if (gerippe) return;
    /* Gesims als Boden der Glockenstube */
    M.teil("reiter-gesims", { ebene: 5, mitte: [0, YM, RZ1 + 0.05] });
    const gs = (g, F) => { g.fillStyle = rgb(WEISS); g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1); g.fillStyle = rgb([160, 156, 146]); g.fillRect(-0.05, F.h * 0.6, F.w + 0.1, F.h); };
    kiste(M, "rg", -RX - 0.08, RY0 - 0.08, RZ1, RX + 0.08, RY1 + 0.08, ZG0, { s: gs, n: gs, o: gs, w: gs, t: S.winter ? schneeOben("#e4e0d6") : "#d6d0c4" });
    /* Glockenstube: vier Eckpfosten, unten eine Brüstung, in der Mitte die Glocke */
    const pb = 0.11, gx = RX - 0.06;
    const pfosten = (g, F) => { g.fillStyle = rgb(WEISS); g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1); g.fillStyle = rgb([196, 192, 182]); g.fillRect(F.w * 0.65, -0.05, F.w, F.h + 0.1); };
    for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      M.teil("pf" + sx + sy, { ebene: 5, mitte: [sx * gx, YM + sy * gx, ZG0 + 0.4] });
      kiste(M, "pf" + sx + sy, sx * gx - pb / 2, YM + sy * gx - pb / 2, ZG0, sx * gx + pb / 2, YM + sy * gx + pb / 2, ZG1, { s: pfosten, n: pfosten, o: pfosten, w: pfosten });
    }
    /* Brüstungsbretter (nur außen), weit nach außen sortiert */
    const bh = 0.28;
    const brett = (g, F) => { g.fillStyle = rgb(WEISS); g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1); if (F.px > 10) { g.fillStyle = rgb([196, 192, 182]); for (let x = 0.1; x < F.w; x += 0.12) g.fillRect(x, 0, 0.012, F.h); g.fillStyle = "rgb(40,36,34)"; for (let x = 0.2; x < F.w - 0.1; x += 0.26) { g.beginPath(); g.ellipse(x, F.h * 0.5, 0.04, 0.07, 0, 0, TAU); g.fill(); } } };
    for (const [n, p0, p1] of [[[0, 1, 0], [-gx, YM + gx], [gx, YM + gx]], [[0, -1, 0], [gx, YM - gx], [-gx, YM - gx]], [[1, 0, 0], [gx, YM + gx], [gx, YM - gx]], [[-1, 0, 0], [-gx, YM - gx], [-gx, YM + gx]]]) {
      M.teil("br" + n.join(), { ebene: 5, mitte: [n[0] * 6, YM + n[1] * 6, ZG0 + 0.2] });
      wand(M, "br" + n.join(), p0, p1, ZG0, ZG0 + bh, brett, { keinAo: true });
    }
    /* Glocke im Joch */
    if (Z.glocke) {
      M.teil("glocke", { ebene: 5, mitte: [0, YM, ZG0 + 0.4] });
      M.figur({ x: 0, y: YM, z: ZG0 + 0.12, breite: 1.0, hoehe: 0.75, malen: glockeFigur(gx) });
    }
    /* Helm: Pyramide mit Wetterhahn */
    const zh0 = ZG1, zsp = zh0 + 1.05, r0 = RX + 0.14;
    M.teil("reiter-helm", { ebene: 5, mitte: [0, YM, zh0 + 0.4] });
    const A = [[-r0, YM - r0, zh0], [r0, YM - r0, zh0], [r0, YM + r0, zh0], [-r0, YM + r0, zh0]], top = [0, YM, zsp];
    const helm = helmMaler(S, Z, false, 57);
    for (const [i, j, n, u] of [[3, 2, [0, 1, 0], [1, 0, 0]], [2, 1, [1, 0, 0], [0, -1, 0]], [1, 0, [0, -1, 0], [-1, 0, 0]], [0, 3, [-1, 0, 0], [0, 1, 0]]]) vieleck(M, "rh" + i, [A[i], A[j], top], [n[0], n[1], 0.45], u, helm, {});
    M.figur({ x: 0, y: YM, z: zsp - 0.04, breite: 0.7, hoehe: 0.95, malen: hahnFigur(S.winter) });
  }
  function glockeFigur(gx) {
    return function (g, s, F) {
      const k = s, KZ = ST.KZ, h = 0.5 * k * KZ;
      const form = () => {
        g.beginPath();
        g.moveTo(-k * 0.08, -h); g.quadraticCurveTo(-k * 0.2, -h * 0.98, -k * 0.2, -h * 0.6);
        g.quadraticCurveTo(-k * 0.2, -h * 0.25, -k * 0.3, -h * 0.05); g.lineTo(-k * 0.32, 0);
        g.lineTo(k * 0.32, 0); g.lineTo(k * 0.3, -h * 0.05); g.quadraticCurveTo(k * 0.2, -h * 0.25, k * 0.2, -h * 0.6);
        g.quadraticCurveTo(k * 0.2, -h * 0.98, k * 0.08, -h); g.closePath();
      };
      const jy = -h - k * 0.08 * KZ;
      if (F.schatten) { form(); g.fillStyle = "#000"; g.fill(); return; }
      const lf = ST.lichtFaktor([0, 0.5, 0.8], F.Z, 0, F.jahr);
      const L = (c) => rgb([c[0] * lf[0] * 0.85, c[1] * lf[1] * 0.85, c[2] * lf[2] * 0.85]);
      /* Joch (Balken quer durch die Stube) */
      g.fillStyle = L([110, 76, 48]); g.fillRect(-k * gx, jy - k * 0.05, k * gx * 2, k * 0.1);
      g.fillStyle = L(EISEN); g.fillRect(-k * 0.03, jy, k * 0.06, h * 0.1);
      form();
      const gr = g.createLinearGradient(-k * 0.3, 0, k * 0.3, 0);
      gr.addColorStop(0, L(hell(BRONZE, -0.3))); gr.addColorStop(0.3, L(hell(BRONZE, 0.35))); gr.addColorStop(0.55, L(BRONZE)); gr.addColorStop(1, L(hell(BRONZE, -0.45)));
      g.fillStyle = gr; g.fill();
      g.fillStyle = L(hell(BRONZE, -0.5)); g.fillRect(-k * 0.3, -h * 0.08, k * 0.6, h * 0.04); g.fillRect(-k * 0.2, -h * 0.72, k * 0.4, h * 0.03);
      /* Klöppel */
      g.fillStyle = L([40, 34, 30]); g.beginPath(); g.ellipse(0, -h * 0.02, k * 0.2, k * 0.035, 0, 0, Math.PI); g.fill();
      g.beginPath(); g.arc(k * 0.02, h * 0.05, k * 0.04, 0, TAU); g.fill();
    };
  }
  function hahnFigur(winter) {
    return function (g, s, F) {
      const k = s, h = 0.9 * k * ST.KZ;
      if (F.schatten) { g.fillStyle = "#000"; g.fillRect(-k * 0.015, -h, k * 0.03, h); return; }
      const lf = ST.lichtFaktor([0, 0.4, 0.9], F.Z, 0, F.jahr);
      const L = (c) => rgb([c[0] * lf[0], c[1] * lf[1], c[2] * lf[2]]);
      g.fillStyle = L(EISEN); g.fillRect(-k * 0.015, -h, k * 0.03, h);
      const gr = g.createRadialGradient(-k * 0.02, -h * 0.3, 0, 0, -h * 0.28, k * 0.07);
      gr.addColorStop(0, L(hell(GOLD, 0.5))); gr.addColorStop(1, L(hell(GOLD, -0.3)));
      g.fillStyle = gr; g.beginPath(); g.arc(0, -h * 0.28, k * 0.07, 0, TAU); g.fill();
      /* Kreuz der Himmelsrichtungen */
      g.fillStyle = L(EISEN); g.fillRect(-k * 0.2, -h * 0.55, k * 0.4, k * 0.015);
      /* Wetterhahn */
      const y = -h * 0.82, c = L(hell(GOLD, -0.05));
      g.fillStyle = c;
      g.beginPath();
      g.moveTo(-k * 0.18, y + k * 0.02); g.quadraticCurveTo(-k * 0.28, y - k * 0.2, -k * 0.12, y - k * 0.16);
      g.lineTo(-k * 0.05, y - k * 0.04); g.lineTo(k * 0.07, y - k * 0.05); g.lineTo(k * 0.1, y - k * 0.17);
      g.quadraticCurveTo(k * 0.13, y - k * 0.23, k * 0.17, y - k * 0.17); g.lineTo(k * 0.2, y - k * 0.14); g.lineTo(k * 0.15, y - k * 0.12);
      g.quadraticCurveTo(k * 0.14, y, k * 0.02, y + k * 0.05); g.lineTo(-k * 0.02, y + k * 0.1); g.lineTo(-k * 0.05, y + k * 0.05); g.closePath(); g.fill();
      g.fillStyle = L([180, 40, 30]); g.beginPath(); g.arc(k * 0.13, y - k * 0.22, k * 0.025, 0, TAU); g.fill();
      if (winter) { g.fillStyle = L([244, 247, 252]); g.fillRect(-k * 0.2, -h * 0.55 - k * 0.012, k * 0.4, k * 0.012); }
    };
  }
  /* Kamine auf dem First */
  function kaminBauen(M, S, Z) {
    if (Z.kamin <= 0) return;
    for (const kx of KAMINE) {
      const x0 = kx - 0.26, x1 = kx + 0.26, y0 = YM - 0.3, y1 = YM + 0.3;
      const zTop = ZF - 0.3 + (1.3) * Z.kamin;
      M.teil("kamin" + kx, { ebene: 5, mitte: [kx, YM, zTop - 0.5] });
      const mal = (g, F) => {
        backstein(g, F, L0, -0.05, -0.05, F.w + 0.1, F.h + 0.1, zTop, { saat: 5, gelb: (z) => z > zTop - 0.35 && z < zTop - 0.2 });
        g.fillStyle = rgb([110, 104, 98]); g.fillRect(-0.05, 0, F.w + 0.1, 0.08);
        const gr = g.createLinearGradient(0, 0, 0, 0.5); gr.addColorStop(0, "rgba(20,16,14,0.4)"); gr.addColorStop(1, "rgba(20,16,14,0)"); g.fillStyle = gr; g.fillRect(0, 0.08, F.w, 0.5);
      };
      const zS = dachZ(y1);
      wand(M, "ks" + kx, [x0, y1], [x1, y1], zS, zTop, mal, { keinAo: true });
      wand(M, "kn" + kx, [x1, y0], [x0, y0], zS, zTop, mal, { keinAo: true });
      for (const sx of [-1, 1]) {
        const x = sx > 0 ? x1 : x0, pts = [[x, y1, zTop], [x, y0, zTop], [x, y0, zS], [x, YM, ZF], [x, y1, zS]];
        vieleck(M, "k" + kx + sx, sx > 0 ? pts : pts.slice().reverse(), [sx, 0, 0], [0, -sx, 0], mal, {});
      }
      M.flaeche({ name: "kt" + kx, o: [x0 - 0.03, y0 - 0.03, zTop], u: [1, 0, 0], v: [0, 1, 0], w: x1 - x0 + 0.06, h: y1 - y0 + 0.06, malen: (g, F) => { g.fillStyle = S.winter ? "rgb(240,244,250)" : "rgb(96,92,88)"; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1); g.fillStyle = "rgb(24,20,20)"; g.fillRect(0.12, 0.12, F.w - 0.24, F.h - 0.24); } });
      if (Z.fertig) M.rauchAus(kx, YM, zTop + 0.1, 0.7);
    }
  }
  function richtBauen(M, S, Z) {
    if (!Z.richt) return;
    M.teil("richt", { ebene: 6, mitte: [2.0, YM, ZF + 1] });
    M.figur({ x: 2.0, y: YM, z: ZF - 0.1, breite: 1.2, hoehe: 1.8, malen(g, s, F) {
      const h = 1.6 * s * ST.KZ;
      if (F.schatten) { g.fillStyle = "#000"; g.fillRect(-s * 0.03, -h, s * 0.06, h); g.beginPath(); g.ellipse(0, -h * 0.75, s * 0.4, h * 0.3, 0, 0, TAU); g.fill(); return; }
      g.fillStyle = "#6a4a2a"; g.fillRect(-s * 0.03, -h, s * 0.06, h);
      const rng = zufall(3);
      for (let i = 0; i < 40; i++) { g.fillStyle = rgb(PI.streu([56, 110, 50], rng, 0.3)); g.beginPath(); g.arc((rng() - 0.5) * s * 0.7, -h * (0.55 + rng() * 0.45), s * 0.08, 0, TAU); g.fill(); }
      const f = ["#c8102e", "#f2c200", "#1e5aa8", "#ffffff", "#2e8b3d"];
      for (let i = 0; i < 6; i++) { g.strokeStyle = f[i % 5]; g.lineWidth = Math.max(1, s * 0.03); g.beginPath(); const x = (i - 2.5) * s * 0.1; g.moveTo(x, -h * 0.55); g.quadraticCurveTo(x + s * 0.12, -h * 0.35, x + s * 0.05, -h * 0.15); g.stroke(); }
    } });
  }

  /* ---------------- Freitreppe mit Geländer ---------------- */
  function treppeBauen(M, S, Z) {
    if (Z.treppe <= 0) return;
    const n = Math.ceil(TR_N * Z.treppe - 1e-6);
    for (let i = 0; i < n; i++) {
      const y0 = YR + i * TR_A, y1 = y0 + TR_A, zt = TR_H * (TR_N - i);
      fassadenTeil(M, "stufe" + i, [0, 1, 0], [0, (y0 + y1) / 2, zt / 2]);
      const stirn = (g, F) => { g.fillStyle = rgb(hell(SANDSTEIN, 0.02)); g.fillRect(-0.02, -0.02, F.w + 0.04, F.h + 0.04); if (F.px > 8) rausch(g, 0, 0, F.w, F.h, 0.9, 0.25, 50 + i, 3); g.fillStyle = rgb(hell(SANDSTEIN, 0.18)); g.fillRect(0, 0, F.w, 0.03); g.fillStyle = "rgba(40,30,14,0.3)"; for (let y = TR_H; y < F.h; y += TR_H) g.fillRect(0, y - 0.01, F.w, 0.012); };
      const tritt = (g, F) => {
        const w = F.w, h = F.h;
        g.fillStyle = rgb(hell(SANDSTEIN, 0.1)); g.fillRect(-0.02, -0.02, w + 0.04, h + 0.04);
        if (F.px > 8) rausch(g, 0, 0, w, h, 0.8, 0.22, 60 + i, 3);
        if (S.winter) {
          schneeFlaeche(g, F, -0.02, -0.02, w + 0.04, h + 0.04, 70 + i);
          const gr = g.createLinearGradient(w * 0.3, 0, w * 0.7, 0);
          gr.addColorStop(0, "rgba(180,170,150,0)"); gr.addColorStop(0.5, "rgba(170,156,130,0.5)"); gr.addColorStop(1, "rgba(180,170,150,0)");
          g.fillStyle = gr; g.fillRect(w * 0.25, 0, w * 0.5, h);
        }
        if (S.jahr === "herbst") laub(g, F, 0, 0, w, h, 14, 80 + i);
      };
      kiste(M, "st" + i, -TR_B, y0, 0, TR_B, y1, zt, { s: stirn, o: stirn, w: stirn, t: tritt }, { ao: true });
    }
    if (!Z.gelaender) return;
    /* schmiedeeisernes Geländer beiderseits: Pfosten, Handlauf, Stäbe */
    for (const sx of [-1, 1]) {
      const x = sx * (TR_B - 0.08), yA = YR + 0.1, yB = YR + TR_N * TR_A - 0.12;
      const zA = ZS + 0.9, zB = TR_H * 1 + 0.9;
      fassadenTeil(M, "gel" + sx, [0, 1, 0], [x, (yA + yB) / 2 + 0.3, 1.2], { schatten: false });
      stab(M, "hl" + sx, [x, yA, zA], [x, yB, zB], 0.045, [34, 36, 38]);
      stab(M, "p1" + sx, [x, yB, TR_H], [x, yB, zB + 0.05], 0.05, [34, 36, 38]);
      stab(M, "p0" + sx, [x, yA, ZS], [x, yA, zA + 0.03], 0.04, [34, 36, 38]);
      /* Stäbe als eine durchsichtige Fläche */
      const pts = [[x, yA, zA], [x, yB, zB], [x, yB, TR_H * 1 + 0.05], [x, yA, ZS + 0.05]];
      vieleck(M, "stb" + sx, pts, [sx, 0, 0], [0, -sx, 0], (g, F) => {
        const L = Lm(F);
        g.strokeStyle = L([34, 36, 38]); g.lineWidth = 0.018;
        g.beginPath(); for (let a = 0.12; a < F.w; a += 0.12) { g.moveTo(a, 0); g.lineTo(a, F.h); } g.stroke();
        g.lineWidth = 0.025; const u = F.flaeche.umriss; g.beginPath(); g.moveTo(u[3][0], u[3][1] - 0.15); g.lineTo(u[2][0], u[2][1] - 0.15); g.stroke();
      }, { keinLicht: true, beidseitig: true });
    }
  }

  /* ---------------- Schulhof, Zaun, Reck ---------------- */
  function hofBauen(M, S, Z) {
    M.teil("hof", { ebene: -2, mitte: [0, 3, -1], schatten: false });
    const y0 = YS, y1 = HOF_Y;
    M.flaeche({ name: "hof", o: [-ZX, y0, 0.015], u: [1, 0, 0], v: [0, 1, 0], w: 2 * ZX, h: y1 - y0, keinAo: true, malen: (g, F) => {
      const w = F.w, h = F.h, px = F.px, rng = zufall(41);
      /* Kies, ohne harte Kante am Rand */
      g.fillStyle = Z.hof ? "rgb(222,206,172)" : "rgb(140,112,82)"; g.fillRect(-0.1, -0.1, w + 0.2, h + 0.2);
      if (px > 5) rausch(g, 0, 0, w, h, 1.4, 0.25, 12, 3);
      if (Z.hof && px > 14) {
        g.beginPath(); for (let i = 0; i < Math.min(2600, w * h * 90); i++) { const x = rng() * w, y = rng() * h, r = (0.6 + rng() * 1.1) / px * 1.4; g.rect(x, y, r, r); }
        g.fillStyle = "rgba(130,114,92,0.4)"; g.fill();
      }
      if (Z.hof && !S.winter && (S.jahr === "fruehling" || S.jahr === "sommer") && px > 8) {
        /* Himmel und Hölle mit Kreide */
        g.strokeStyle = "rgba(250,250,245,0.85)"; g.lineWidth = 0.035;
        const hx = w * 0.22, hy = h * 0.25, q = 0.42;
        const kaest = [[0, 0], [0, 1], [-0.5, 2], [0.5, 2], [0, 3], [-0.5, 4], [0.5, 4]];
        for (const [a, b] of kaest) g.strokeRect(hx + a * q - q / 2 + (a ? 0 : 0), hy + b * q * 0.9, q, q * 0.9);
        g.beginPath(); g.arc(hx, hy + 5 * q * 0.9 + q * 0.3, q * 0.55, 0, Math.PI); g.stroke();
      }
      if (S.winter) {
        schneeFlaeche(g, F, -0.1, -0.1, w + 0.2, h + 0.2, 23);
        /* ausgetretener Weg vom Tor zur Treppe, Fußspuren */
        const gr = g.createLinearGradient(w / 2 - 1.3, 0, w / 2 + 1.3, 0);
        gr.addColorStop(0, "rgba(170,160,150,0)"); gr.addColorStop(0.5, "rgba(170,156,140,0.45)"); gr.addColorStop(1, "rgba(170,160,150,0)");
        g.fillStyle = gr; g.fillRect(w / 2 - 1.3, 0, 2.6, h);
        if (px > 10) { g.fillStyle = "rgba(150,166,200,0.35)"; for (let i = 0; i < 40; i++) { g.beginPath(); g.ellipse(w / 2 + (rng() - 0.5) * 3 + (rng() - 0.5) * 4 * (i % 3 === 0 ? 1 : 0), rng() * h, 0.05, 0.09, 0.3, 0, TAU); g.fill(); } }
      }
      if (S.jahr === "herbst") laub(g, F, 0, 0, w, h, 5, 44);
    } });
  }
  function zaunBauen(M, S, Z) {
    if (Z.zaun <= 0) return;
    const winter = S.winter;
    /* Stücke: vorn links/rechts vom Tor, dazu die Seiten bis zur Hauswand */
    const stuecke = [
      { n: [0, 1, 0], p0: [-ZX, HOF_Y], p1: [-TOR, HOF_Y] }, { n: [0, 1, 0], p0: [TOR, HOF_Y], p1: [ZX, HOF_Y] },
      { n: [1, 0, 0], p0: [ZX, HOF_Y], p1: [ZX, YS + 0.1] }, { n: [-1, 0, 0], p0: [-ZX, YS + 0.1], p1: [-ZX, HOF_Y] }
    ];
    const zs = 0.36;
    stuecke.forEach((st, i) => {
      if (i / stuecke.length > Z.zaun + 0.01) return;
      const c = [(st.p0[0] + st.p1[0]) / 2, (st.p0[1] + st.p1[1]) / 2];
      fassadenTeil(M, "zaun" + i, st.n, [c[0], c[1] + (st.n[1] ? 0 : 0), 0.6]);
      const d = 0.12, nx = st.n[0] * d, ny = st.n[1] * d;
      /* Sockelmauer (Backstein, Sandsteinabdeckung): Außen- und Innenseite, oben */
      const mauer = (g, F) => { backstein(g, F, L0, -0.05, -0.05, F.w + 0.1, F.h + 0.1, zs, { saat: 30 + i }); g.fillStyle = rgb(hell(SANDSTEIN_H, 0.05)); g.fillRect(-0.05, -0.05, F.w + 0.1, 0.07); if (winter) { g.fillStyle = "rgba(242,246,252,0.9)"; g.fillRect(-0.05, F.h - 0.08, F.w + 0.1, 0.1); } };
      wand(M, "zm" + i, [st.p0[0] + nx, st.p0[1] + ny], [st.p1[0] + nx, st.p1[1] + ny], 0, zs, mauer, { ao: true });
      wand(M, "zi" + i, [st.p1[0] - nx, st.p1[1] - ny], [st.p0[0] - nx, st.p0[1] - ny], 0, zs, mauer, { ao: true });
      const xa = Math.min(st.p0[0], st.p1[0]) - Math.abs(ny), xb = Math.max(st.p0[0], st.p1[0]) + Math.abs(ny);
      const ya = Math.min(st.p0[1], st.p1[1]) - Math.abs(nx), yb = Math.max(st.p0[1], st.p1[1]) + Math.abs(nx);
      M.flaeche({ name: "zt" + i, o: [xa, ya, zs], u: [1, 0, 0], v: [0, 1, 0], w: xb - xa, h: yb - ya, keinAo: true, malen: winter ? schneeOben(rgb(SANDSTEIN_H)) : rgb(hell(SANDSTEIN_H, 0.1)) });
      /* Gitter: Stäbe mit Spitzen, zwei Riegel – durchsichtig */
      wand(M, "zg" + i, st.p0, st.p1, zs, ZAUN_H, (g, F) => {
        const L = Lm(F), w = F.w, h = F.h;
        g.strokeStyle = L([30, 32, 34]); g.lineWidth = 0.02;
        g.beginPath();
        for (let a = 0.06; a < w; a += 0.12) { g.moveTo(a, h); g.lineTo(a, 0.06); }
        g.moveTo(0, 0.14); g.lineTo(w, 0.14); g.moveTo(0, h - 0.1); g.lineTo(w, h - 0.1);
        g.stroke();
        g.fillStyle = L([30, 32, 34]);
        g.beginPath(); for (let a = 0.06; a < w; a += 0.12) { g.moveTo(a - 0.025, 0.07); g.lineTo(a, 0); g.lineTo(a + 0.025, 0.07); g.closePath(); } g.fill();
        if (F.px > 16) { g.fillStyle = L(GOLD); for (let a = 0.06; a < w; a += 0.12) { g.beginPath(); g.arc(a, 0.02, 0.012, 0, TAU); g.fill(); } }
        if (winter) { g.fillStyle = "rgba(244,247,252,0.95)"; g.fillRect(0, 0.12, w, 0.018); }
      }, { keinLicht: true, beidseitig: true, keinAo: true });
    });
    /* Pfeiler am Tor und an den Ecken */
    const pf = [[-TOR - 0.2, HOF_Y], [TOR + 0.2, HOF_Y], [-ZX, HOF_Y], [ZX, HOF_Y]];
    pf.forEach(([x, y], i) => {
      if (i / pf.length > Z.zaun + 0.01) return;
      const b = 0.2, hp = 1.4;
      fassadenTeil(M, "pfeiler" + i, [0, 1, 0], [x, y + 0.5, 0.7]);
      const m = (g, F) => { backstein(g, F, L0, -0.05, -0.05, F.w + 0.1, F.h + 0.1, hp, { saat: 40 + i, gelb: (z) => z > 0.9 && z < 1.06 }); };
      kiste(M, "pf" + i, x - b, y - b, 0, x + b, y + b, hp, { s: m, n: m, o: m, w: m }, { ao: true });
      const cap = (g, F) => { g.fillStyle = rgb(SANDSTEIN_H); g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1); g.fillStyle = rgb(hell(SANDSTEIN_H, -0.25)); g.fillRect(-0.05, F.h * 0.6, F.w + 0.1, F.h); };
      kiste(M, "pc" + i, x - b - 0.05, y - b - 0.05, hp, x + b + 0.05, y + b + 0.05, hp + 0.1, { s: cap, n: cap, o: cap, w: cap, t: winter ? schneeOben(rgb(SANDSTEIN_H)) : rgb(hell(SANDSTEIN_H, 0.12)) });
      M.figur({ x: x, y: y, z: hp + 0.1, breite: 0.3, hoehe: 0.3, malen: kugelFigur(0.13, winter) });
    });
  }
  function kugelFigur(r, winter) {
    return function (g, s, F) {
      const k = r * s;
      if (F.schatten) { g.fillStyle = "#000"; g.beginPath(); g.arc(0, -k, k, 0, TAU); g.fill(); return; }
      const lf = ST.lichtFaktor([0, 0.5, 0.8], F.Z, 0, F.jahr);
      const L = (c) => rgb([c[0] * lf[0], c[1] * lf[1], c[2] * lf[2]]);
      const gr = g.createRadialGradient(-k * 0.35, -k * 1.35, 0, 0, -k, k);
      gr.addColorStop(0, L(hell(SANDSTEIN_H, 0.3))); gr.addColorStop(1, L(hell(SANDSTEIN_H, -0.35)));
      g.fillStyle = L(SANDSTEIN_H); g.fillRect(-k * 0.5, -k * 0.35, k, k * 0.35);
      g.fillStyle = gr; g.beginPath(); g.arc(0, -k * 1.1, k, 0, TAU); g.fill();
      if (winter) { g.fillStyle = L([246, 249, 253]); g.beginPath(); g.ellipse(0, -k * 1.75, k * 0.75, k * 0.4, 0, 0, TAU); g.fill(); }
    };
  }
  function reckBauen(M, S, Z) {
    if (!Z.reck) return;
    const [x, y] = RECK, b = 0.8, h = 1.75;
    fassadenTeil(M, "reck", [0, 1, 0], [x, y, 1]);
    const eisen = [60, 64, 68];
    stab(M, "rp1", [x - b, y, 0], [x - b, y, h + 0.05], 0.07, eisen);
    stab(M, "rp2", [x + b, y, 0], [x + b, y, h + 0.05], 0.07, eisen);
    stab(M, "rst", [x - b, y, h - 0.02], [x + b, y, h - 0.02], 0.035, [170, 174, 178]);
    /* Abspannungen */
    stab(M, "ra1", [x - b, y, h * 0.8], [x - b - 0.55, y, 0], 0.025, eisen);
    stab(M, "ra2", [x + b, y, h * 0.8], [x + b + 0.55, y, 0], 0.025, eisen);
    if (S.winter) M.flaeche({ name: "reck-schnee", o: [x - b, y - 0.03, h + 0.02], u: [1, 0, 0], v: [0, 1, 0], w: 2 * b, h: 0.06, malen: "rgb(244,247,252)", keinAo: true });
  }

  /* =====================================================================
     MODELL
     ===================================================================== */
  ST.modell("schule", {
    name: "Schule", gruppe: "Häuser", grund: [12, 9], hoehe: 13, bauzeit: 18 * 60,
    bauen(M, o) {
      const B = neuerBlick();
      M.teil("blick", { ebene: -90, schatten: false, mitte: [0, 0, 0] });
      M.figur({ x: 0, y: 0, z: 0, breite: 0.01, hoehe: 0.01, schatten: false, malen(g, s, F) { if (!F.schatten && F.gier != null) blickSetzen(B, F.gier); } });
      const bau = o.bau == null ? 1 : klemm(o.bau, 0, 1);
      const Z = zustand(bau);
      const S = { winter: o.jahr === "winter", jahr: o.jahr, saat: o.saat || 7 };
      if (Z.grube) grubeBauen(M, B, S, Z);
      if (Z.wandZ <= 0) return;
      hofBauen(M, S, Z);
      hausBauen(M, B, S, Z);
      dachBauen(M, B, S, Z);
      reiterBauen(M, B, S, Z);
      kaminBauen(M, S, Z);
      richtBauen(M, S, Z);
      treppeBauen(M, S, Z);
      zaunBauen(M, S, Z);
      reckBauen(M, S, Z);
      /* Wandlaterne am Portal: Schein und Lichtpfütze auf dem Hof */
      if (Z.tuer) { M.licht(1.42, YR + 0.2, 3.15, 1.4, "255,206,130", 0.6); M.bodenlicht(0.8, YR + 1.6, 2.6, "255,200,120", 0.7); }
    }
  });
})();
