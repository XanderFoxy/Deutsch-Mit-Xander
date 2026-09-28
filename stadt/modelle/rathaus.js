/* =====================================================================
   RATHAUS — repräsentatives Kleinstadt-Rathaus der Renaissance
   ---------------------------------------------------------------------
   XANDER: „richtig filigran. Richtig schön ausarbeiten mit schönen
   Texturen" · „keine Comic Grafik … viel mehr am Realismus" · „ohne
   Pixelkanten und komische Vektorrückstände" · „Man soll das Fundament
   sehen beim Aufbauen" · „Du bist dein schlimmster Kritiker" · Stil „von
   Anno oder geiler", „trotzdem mit SVG Grafiken".

   VORBILD: die Fachwerk-Rathäuser von Michelstadt, Esslingen und
   Wernigerode (16. Jahrhundert). Erdgeschoss aus rotem Mainsandstein mit
   offener Laube (drei Rundbogen-Arkaden; hier war früher der Markt unter
   Dach), davor eine Freitreppe mit Wangen und zwei Laternen. Darüber zwei
   Fachwerk-Obergeschosse, jedes um 30 cm vorkragend (Balkenköpfe,
   Kragsteine), mit Zierfachwerk: Wilder Mann, geschweifte Andreaskreuze,
   Feuerböcke, Rauten, Fächerrosetten auf den Brüstungsbohlen. In der
   Mitte ein Zwerchhaus mit hohem Treppengiebel (Stufen mit Kugel-
   Obelisken), darin das Schriftband „RATHAUS". Rechts ein zweigeschossiger
   Erker auf Kragsteinen mit spitzem Schieferhelm. Auf dem First ein
   Dachreiter mit vier Zifferblättern, Schallarkaden und Welscher Spitze.
   Über der mittleren Arkade das Stadtwappen (Silbertanne auf Blau unter
   der Mauerkrone), an einer schrägen Stange die Stadtfahne.

   MASSE (Meter; Mitte des Grundrisses = 0,0,0; Front nach Süden, +y)
     Erdgeschoss  11,2 × 7,2 (y −4,0 … 3,2), Oberkante 4,05, Hallenboden 0,60
     1. OG        vorkragend bis y 3,5, 4,05 … 6,85
     2. OG        vorkragend bis y 3,8, 6,85 … 9,35
     Dach         Satteldach 50°, First 14,2, Traufe vorn 0,55 m über
     Zwerchhaus   4,9 breit, Treppengiebel bis 12,6 (Obelisk bis 13,3)
     Dachreiter   1,5 × 1,5, Uhr in 14,75 m, Spitze mit Wetterfahne ≈ 17,6
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
  const RAD = Math.PI / 180, TAU = Math.PI * 2;
  const zufall = (n) => ST.zufall((n >>> 0) || 1);
  const glatt = (x) => { x = klemm(x, 0, 1); return x * x * (3 - 2 * x); };
  const phase = (bau, a, b) => klemm((bau - a) / (b - a), 0, 1);
  const AUSSEN = 100;          // Anbauten einer Fassade: Mitte weit vor die Wand (Reihenfolge)

  /* =====================================================================
     MASSE
     ===================================================================== */
  const X0 = -5.6, X1 = 5.6, YN = -4.0;
  const YE = 3.2, Y1 = 3.5, Y2 = 3.8;          // Südwand EG, 1. OG, 2. OG
  const Z0 = 0.60;                              // Hallenboden
  const ZE = 4.05, ZB = 6.65, Z2 = 6.85, ZT = 9.35;
  const NEIG = 50 * RAD, TN = Math.tan(NEIG), CN = Math.cos(NEIG), SN = Math.sin(NEIG);
  const YM = (YN + Y2) / 2, HALB = (Y2 - YN) / 2;
  const ZDT = ZT + 0.2;                         // Dachhaut über der Wandlinie
  const ZF = ZDT + HALB * TN;                   // First ≈ 14,2
  const UE = 0.55, UEG = 0.35;                  // Überstand Traufe / Ortgang
  const YTS = Y2 + UE, YTN = YN - UE;            // Traufkanten
  const dachZ = (y) => ZF - Math.abs(y - YM) * TN;
  const ZTR = dachZ(YTS);                       // Traufhöhe ≈ 8,9
  /* Arkaden */
  const BOGEN = [-2.7, 0, 2.7], BR = 1.05, BK = 1.85, TW = 0.55, HT = 2.9;
  /* Zwerchhaus mit Treppengiebel */
  const QB = 2.45, QY0 = 3.45, QY1 = 3.9;       // halbe Breite, Rück- und Vorderseite
  const QZF = ZDT + 2.3 * TN;                   // First des Zwerchdachs ≈ 12,29
  const QVAL = ZF - QZF;                        // Kehle: y = YM + QVAL/TN + |x|
  const kehleY = (x) => YM + QVAL / TN + Math.abs(x);
  const STUFEN = [[2.45, 10.35], [1.85, 11.1], [1.25, 11.85], [0.65, 12.6]];
  const QZTOP = 12.6;
  /* Erker */
  const EX0 = 3.7, EX1 = 5.35, EY0 = Y1, EY1 = 4.3, EZ0 = 3.3, EZ1 = 9.6, EHZ = 11.9;
  /* Dachreiter */
  const RX = 0.75, RY0 = YM - 0.75, RY1 = YM + 0.75, RZ1 = 15.3, UHR_Z = 14.75, UHR_R = 0.44;
  /* Kamin auf dem First */
  const KX0 = -4.05, KX1 = -3.55, KY0 = YM - 0.3, KY1 = YM + 0.3, KZ1 = 15.0;
  /* Freitreppe */
  const TR_B = 1.6, TR_N = 4, TR_A = 0.32, TR_H = Z0 / 4;

  /* ---------------- Farben ---------------- */
  const SANDSTEIN = [178, 116, 92];     // roter Mainsandstein
  const SANDSTEIN_H = [196, 142, 112];  // Gliederungen, etwas heller
  const PUTZ = [234, 218, 180];         // Kalkputz, warmes Ocker
  const PUTZ_G = [238, 232, 218];       // Putz des Treppengiebels
  const HOLZ = [104, 44, 32];           // Fachwerk: Ochsenblut
  const HOLZ_ROH = [176, 136, 92];
  const ZIEGEL = "#a14a30";
  const SCHIEFER = [74, 80, 94];
  const GOLD = [214, 168, 72];
  const EISEN = [40, 40, 44];
  const BLAU = [36, 72, 142];

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
        biber(g, F, L, -0.05, yZ, w + 0.1, h - yZ + 0.05, hex(o.farbe || ZIEGEL), o.saat || 11);
        g.restore();
        /* Firstziegel */
        if (kz >= 1) {
          g.fillStyle = L([118, 52, 36]); g.fillRect(-0.05, 0, w + 0.1, 0.12);
          if (px > 10) { g.fillStyle = L([150, 70, 48]); for (let x = 0; x < w; x += 0.36) { g.beginPath(); g.ellipse(x + 0.18, 0.06, 0.18, 0.055, 0, 0, TAU); g.fill(); } }
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

  /* Stadtwappen: Silbertanne auf blauem Grund über grünem Dreiberg, darüber
     ein goldener Stern; auf dem Schild die Mauerkrone (Zeichen der Stadt). */
  function wappenMalen(g, F, cx, cy, s, L, opt) {
    L = L || L0; opt = opt || {};
    const px = F.px * s;
    if (opt.kartusche !== false) {
      /* Kartusche aus Sandstein mit Rollwerk */
      g.fillStyle = L(hell(SANDSTEIN_H, 0.06));
      g.beginPath(); g.ellipse(cx, cy + s * 0.05, s * 0.62, s * 0.66, 0, 0, TAU); g.fill();
      g.fillStyle = L(hell(SANDSTEIN_H, -0.2));
      for (const sx of [-1, 1]) { g.beginPath(); g.arc(cx + sx * s * 0.55, cy - s * 0.25, s * 0.13, 0, TAU); g.fill(); g.beginPath(); g.arc(cx + sx * s * 0.5, cy + s * 0.45, s * 0.1, 0, TAU); g.fill(); }
      g.fillStyle = L(hell(SANDSTEIN_H, 0.18));
      for (const sx of [-1, 1]) { g.beginPath(); g.arc(cx + sx * s * 0.55, cy - s * 0.26, s * 0.07, 0, TAU); g.fill(); }
    }
    /* Schild */
    const sw = s * 0.42, sh = s * 0.52, sy = cy - s * 0.2;
    const schild = () => { g.beginPath(); g.moveTo(cx - sw, sy); g.lineTo(cx + sw, sy); g.lineTo(cx + sw, sy + sh * 0.55); g.quadraticCurveTo(cx + sw, sy + sh * 0.95, cx, sy + sh * 1.1); g.quadraticCurveTo(cx - sw, sy + sh * 0.95, cx - sw, sy + sh * 0.55); g.closePath(); };
    schild(); g.fillStyle = L(hell(GOLD, -0.2)); g.save(); g.translate(0, 0); g.fill(); g.restore();
    g.save(); g.translate(cx, sy + sh * 0.5); g.scale(0.9, 0.92); g.translate(-cx, -(sy + sh * 0.5)); schild(); g.fillStyle = L(BLAU); g.fill(); g.clip();
    /* Dreiberg */
    g.fillStyle = L([52, 110, 58]);
    g.beginPath(); g.moveTo(cx - sw, sy + sh * 1.1); g.lineTo(cx - sw, sy + sh * 0.92); g.quadraticCurveTo(cx - sw * 0.6, sy + sh * 0.72, cx - sw * 0.25, sy + sh * 0.86); g.quadraticCurveTo(cx, sy + sh * 0.62, cx + sw * 0.25, sy + sh * 0.86); g.quadraticCurveTo(cx + sw * 0.6, sy + sh * 0.72, cx + sw, sy + sh * 0.92); g.lineTo(cx + sw, sy + sh * 1.1); g.fill();
    /* Tanne */
    g.fillStyle = L([238, 240, 244]);
    g.beginPath();
    const tx = cx, ty = sy + sh * 0.12, th = sh * 0.62;
    g.moveTo(tx, ty);
    for (let i = 0; i < 4; i++) {
      const y = ty + th * (i + 1) / 4, b = sw * (0.22 + 0.16 * i);
      g.lineTo(tx + b, y); g.lineTo(tx + b * 0.45, y);
    }
    g.lineTo(tx + sw * 0.08, ty + th); g.lineTo(tx + sw * 0.08, ty + th + sh * 0.1); g.lineTo(tx - sw * 0.08, ty + th + sh * 0.1); g.lineTo(tx - sw * 0.08, ty + th);
    for (let i = 3; i >= 0; i--) {
      const y = ty + th * (i + 1) / 4, b = sw * (0.22 + 0.16 * i);
      g.lineTo(tx - b * 0.45, y); g.lineTo(tx - b, y);
      if (i > 0) g.lineTo(tx - sw * (0.22 + 0.16 * (i - 1)) * 0.45, ty + th * i / 4);
    }
    g.closePath(); g.fill();
    /* Stern */
    if (px > 10) {
      g.fillStyle = L(GOLD);
      const scx = cx + sw * 0.6, scy = sy + sh * 0.2, r = sw * 0.16;
      g.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.42 : r; g.lineTo(scx + Math.cos(a) * rr, scy + Math.sin(a) * rr); } g.closePath(); g.fill();
    }
    g.restore();
    /* Mauerkrone */
    const kw = sw * 0.95, ky = sy - s * 0.02;
    g.fillStyle = L(hell(SANDSTEIN_H, 0.1));
    g.fillRect(cx - kw, ky - s * 0.12, kw * 2, s * 0.12);
    for (let i = 0; i < 5; i++) g.fillRect(cx - kw + i * kw * 0.5 - s * 0.03, ky - s * 0.2, s * 0.08, s * 0.1);
    if (px > 20) { g.fillStyle = L([60, 40, 34], 0.6); for (let i = 0; i < 3; i++) g.fillRect(cx - kw * 0.55 + i * kw * 0.55 - s * 0.02, ky - s * 0.09, s * 0.04, s * 0.07); }
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

  /* =====================================================================
     FACHWERK — Plan einer Wand (Flächenkoordinaten: a nach rechts, b nach
     unten, b = 0 an der Oberkante der Fläche)
     ===================================================================== */
  const ART = { schwelle: 0, staender: 1, rahm: 2, riegel: 3, strebe: 4, zier: 4 };
  function Plan(W, H) { this.W = W; this.H = H; this.h = []; this.f = []; this.z = []; }
  Plan.prototype.s = function (x0, y0, x1, y1, b, art) { this.h.push({ k: 0, p: [x0, y0, x1, y1], b: b, art: art }); };
  Plan.prototype.k = function (p, b, art) { this.h.push({ k: 1, p: p, b: b, art: art || "zier" }); };
  Plan.prototype.fenster = function (x, y, w, h, o) { this.f.push({ x: x, y: y, w: w, h: h, o: o || {} }); };
  Plan.prototype.zier = function (art, x0, y0, x1, y1) { this.z.push({ art: art, x0: x0, y0: y0, x1: x1, y1: y1 }); };
  /* Wilder Mann: Ständer mit geschweiften Fuß- und Kopfstreben */
  function mann(P, x0, x1, y0, y1, b) {
    const xm = (x0 + x1) / 2, H = y1 - y0;
    P.s(xm, y0, xm, y1, b, "staender");
    for (const sx of [-1, 1]) {
      const xa = sx < 0 ? x0 : x1;
      P.k([xa, y1 - b * 0.4, xa + (xm - xa) * 0.25, y0 + H * 0.45, xm, y0 + H * 0.28], b * 0.9, "strebe");
      P.k([xa, y0 + b * 0.4, xa + (xm - xa) * 0.35, y0 + H * 0.42, xm, y0 + H * 0.62], b * 0.75, "zier");
    }
  }
  /* Brüstungsfeld: Andreaskreuz, Feuerbock, Raute */
  function brust(P, art, x0, x1, y0, y1, b) {
    const w = x1 - x0, h = y1 - y0, xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
    if (art === "kreuz") { P.s(x0, y0, x1, y1, b, "zier"); P.s(x0, y1, x1, y0, b, "zier"); }
    else if (art === "feuerbock") {
      P.k([x0, y1, x0 + w * 0.15, ym, xm, y0 + b * 0.2], b, "zier");
      P.k([x1, y1, x1 - w * 0.15, ym, xm, y0 + b * 0.2], b, "zier");
      P.k([x0, y0, x0 + w * 0.3, ym, xm - w * 0.05, y1], b * 0.8, "zier");
      P.k([x1, y0, x1 - w * 0.3, ym, xm + w * 0.05, y1], b * 0.8, "zier");
    } else if (art === "raute") {
      P.s(xm, y0, x1, ym, b * 0.85, "zier"); P.s(x1, ym, xm, y1, b * 0.85, "zier");
      P.s(xm, y1, x0, ym, b * 0.85, "zier"); P.s(x0, ym, xm, y0, b * 0.85, "zier");
      P.s(x0, y0, x1, y1, b * 0.7, "zier"); P.s(x0, y1, x1, y0, b * 0.7, "zier");
    } else if (art === "rosette") {
      P.zier("rosette", x0, y0, x1, y1);
    }
  }
  /* Zwei Fenster nebeneinander mit Ständern und Brüstung */
  function fensterPaar(P, xc, ww, yO, yU, yBr, yS, b, zier, fo) {
    const xs = [xc - ww - 0.09 - b / 2, xc, xc + ww + 0.09 + b / 2];
    for (const x of xs) P.s(x, yO, x, yS, x === xc ? b * 0.9 : b, "staender");
    P.fenster(xc - 0.09 - ww, yO + 0.02, ww, yU - yO - 0.02, fo);
    P.fenster(xc + 0.09, yO + 0.02, ww, yU - yO - 0.02, fo);
    P.s(xs[0] - b / 2, yU + 0.075, xs[2] + b / 2, yU + 0.075, 0.15, "riegel");
    const by0 = yU + 0.15, by1 = yS;
    if (zier === "rosette") P.zier("rosette", xs[0] + b / 2, by0, xs[2] - b / 2, by1);
    else {
      brust(P, zier, xs[0] + b / 2, xc - b * 0.45, by0, by1, 0.1);
      brust(P, zier, xc + b * 0.45, xs[2] - b / 2, by0, by1, 0.1);
    }
    /* Kopfbänder an den äußeren Ständern */
    P.k([xs[0] - 0.42, yO, xs[0] - 0.12, yO + 0.05, xs[0] - b / 2, yO + 0.42], 0.1, "zier");
    P.k([xs[2] + 0.42, yO, xs[2] + 0.12, yO + 0.05, xs[2] + b / 2, yO + 0.42], 0.1, "zier");
    return xs;
  }
  /* Regelwand: Ständer ≤ 1,2 m, Fenster, Riegel, Streben an den Ecken */
  function regelWand(W, H, geo, fenster, opt) {
    opt = opt || {};
    const P = new Plan(W, H);
    const [yr, br] = geo.rahm, [ys, bs] = geo.schwelle;
    const yO = yr + br / 2, yU = ys - bs / 2;
    P.s(0, yr, W, yr, br, "rahm"); P.s(0, ys, W, ys, bs, "schwelle");
    let xs = [0.11, W - 0.11];
    for (const f of fenster) xs.push(f[0] - 0.1, f[0] + f[1] + 0.1);
    xs.sort((a, b) => a - b);
    const alle = [];
    for (let i = 0; i < xs.length; i++) {
      alle.push(xs[i]);
      if (i < xs.length - 1) { const d = xs[i + 1] - xs[i]; const n = Math.floor(d / 1.25); for (let k = 1; k <= n; k++) alle.push(xs[i] + d * k / (n + 1)); }
    }
    for (const x of alle) P.s(x, yO, x, yU, x < 0.2 || x > W - 0.2 ? 0.22 : 0.18, "staender");
    const yM = geo.brust != null ? geo.brust : (yO + yU) / 2;
    for (let i = 0; i < alle.length - 1; i++) {
      const a = alle[i] + 0.09, e = alle[i + 1] - 0.09;
      if (e - a < 0.1) continue;
      const f = fenster.find((q) => q[0] > a - 0.05 && q[0] + q[1] < e + 0.05);
      if (f) {
        P.fenster(f[0], geo.fo, f[1], geo.fu - geo.fo, opt.fo);
        P.s(a, geo.fu + 0.07, e, geo.fu + 0.07, 0.14, "riegel");
        if (geo.fo - yO > 0.12) P.s(a, geo.fo - 0.06, e, geo.fo - 0.06, 0.12, "riegel");
        brust(P, opt.brust || "kreuz", a, e, geo.fu + 0.14, yU, 0.09);
      } else {
        P.s(a, yM, e, yM, 0.15, "riegel");
        if (i === 0) P.s(a, yU, e, yM + 0.08, 0.15, "strebe");
        else if (i === alle.length - 2) P.s(e, yU, a, yM + 0.08, 0.15, "strebe");
        else if (opt.streben !== false && i % 2) P.s(a, yM - 0.07, e, yO, 0.13, "strebe");
      }
    }
    return P;
  }

  /* Rosette (Fächerrosette) auf einer Brüstungsbohle, geschnitzt */
  function rosetteMalen(g, F, L, x0, y0, x1, y1) {
    const w = x1 - x0, h = y1 - y0;
    const c = hell(HOLZ, 0.06);
    g.fillStyle = L(c); g.fillRect(x0, y0, w, h);
    g.fillStyle = L(hell(c, -0.3)); g.fillRect(x0, y1 - 0.02, w, 0.02);
    if (F.px < 12) return;
    const n = Math.max(1, Math.round(w / (h * 1.5)));
    for (let i = 0; i < n; i++) {
      const cx = x0 + w * (i + 0.5) / n, cy = y1 - h * 0.12, r = Math.min(h * 0.78, w / n * 0.46);
      g.fillStyle = L(hell(c, -0.22)); g.beginPath(); g.arc(cx, cy, r, Math.PI, 0); g.fill();
      for (let k = 0; k < 9; k++) {
        const a0 = Math.PI + k * Math.PI / 9, a1 = a0 + Math.PI / 9;
        g.fillStyle = L(hell(c, k % 2 ? 0.14 : -0.05));
        g.beginPath(); g.moveTo(cx, cy); g.arc(cx, cy, r * 0.92, a0 + 0.03, a1 - 0.03); g.closePath(); g.fill();
      }
      g.fillStyle = L(hell(c, -0.4)); g.beginPath(); g.arc(cx, cy, r * 0.18, Math.PI, 0); g.fill();
    }
    /* Taustab oben */
    if (F.px > 30) { g.strokeStyle = L(hell(c, -0.35)); g.lineWidth = 0.01; g.beginPath(); for (let x = x0; x < x1; x += 0.05) { g.moveTo(x, y0 + 0.02); g.lineTo(x + 0.03, y0 + 0.05); } g.stroke(); }
  }

  /* Eine Fachwerkwand malen.
     st = { holz: 0…1 (Anteil der Hölzer), fach: 0…1 (ausgefacht), fenster: bool }
     Solange nicht ausgefacht ist, ist die Fläche durchsichtig (Lm). */
  function fwMaler(P, st, opt) {
    opt = opt || {};
    return function (g, F) {
      const W = F.w, H = F.h, voll = st.fach >= 1;
      const L = voll ? L0 : Lm(F);
      const saat = ST.textHash(F.name) % 97 + 3;
      const winter = F.jahr === "winter";
      g.save();
      if (opt.dy) g.translate(0, opt.dy);
      /* Ausfachung: Lehm und Kalkputz, von unten nach oben */
      if (st.fach > 0) {
        const yF = voll ? -0.1 : P.H * (1 - st.fach);
        g.save(); g.beginPath(); g.rect(-0.1, yF, W + 0.2, P.H - yF + 0.2); g.clip();
        if (voll) putz(g, F, L, -0.05, -0.05, W + 0.1, P.H + 0.1, opt.putz || PUTZ, saat);
        else { g.fillStyle = L([150, 120, 88]); g.fillRect(-0.05, yF, W + 0.1, P.H); rausch(g, -0.05, yF, W + 0.1, P.H, 0.6, 0.3, saat, 3); }
        g.restore();
        if (voll && F.px > 6) {
          /* Wetterschatten: unten etwas Spritzwasser, oben unter dem Rähm Schmutz */
          const gr = g.createLinearGradient(0, P.H, 0, P.H - 0.5);
          gr.addColorStop(0, "rgba(90,80,60,0.22)"); gr.addColorStop(1, "rgba(90,80,60,0)");
          g.fillStyle = gr; g.fillRect(0, P.H - 0.5, W, 0.5);
        }
      }
      /* Fenster und Öffnungen */
      if (voll) {
        for (const f of P.f) {
          if (st.fenster) fensterK(g, F, f.x, f.y, f.w, f.h, Object.assign({ winter: winter, blei: true, rahmen: [70, 36, 28], bankFarbe: hell(HOLZ, 0.05) }, opt.fo, f.o));
          else { g.fillStyle = "rgb(40,34,32)"; g.fillRect(f.x, f.y, f.w, f.h); }
        }
      }
      /* Schatten der Hölzer auf dem Putz */
      const hl = P.h.filter((m, i) => { const t = (ART[m.art] + (i % 7) / 7) / 5; return st.holz >= 1 || t <= st.holz; });
      if (voll && F.schatten) {
        const sv = F.schatten(0.03);
        if (sv) {
          g.save(); g.translate(sv[0], sv[1]);
          g.strokeStyle = "rgba(40,28,22,0.28)"; g.lineCap = "butt";
          for (const m of hl) {
            g.lineWidth = m.b; g.beginPath(); g.moveTo(m.p[0], m.p[1]);
            if (m.k) { if (m.p.length === 6) g.quadraticCurveTo(m.p[2], m.p[3], m.p[4], m.p[5]); else g.bezierCurveTo(m.p[2], m.p[3], m.p[4], m.p[5], m.p[6], m.p[7]); }
            else g.lineTo(m.p[2], m.p[3]);
            g.stroke();
          }
          g.restore();
        }
      }
      /* Zierbohlen */
      if (st.fach > 0.99) for (const z of P.z) if (z.art === "rosette") rosetteMalen(g, F, L, z.x0, z.y0, z.x1, z.y1);
      /* Hölzer: erst Streben und Zier, dann Riegel, Ständer, Schwelle/Rähm */
      const c = st.roh ? misch(HOLZ_ROH, HOLZ, st.roh) : HOLZ;
      const reihe = [4, 3, 1, 0, 2];
      for (const r of reihe) for (let i = 0; i < hl.length; i++) {
        const m = hl[i]; if (ART[m.art] !== r) continue;
        if (m.k) krumm(g, F, L, m.p, m.b, c);
        else holz(g, F, L, m.p[0], m.p[1], m.p[2], m.p[3], m.b, c, saat + i * 13);
      }
      if (voll && opt.danach) opt.danach(g, F, L);
      g.restore();
    };
  }
  function fwLeuchten(P, st, opt) {
    opt = opt || {};
    return function (g, F) {
      if (!st.fenster) return;
      const rng = zufall(ST.textHash(F.name) + 5);
      if (opt.dy) g.translate(0, opt.dy);
      const liste = [];
      for (const f of P.f) {
        const an = rng() < (opt.anteil == null ? 0.8 : opt.anteil) ? 1 : 0;
        if (!an) continue;
        fensterKLicht(g, F, f.x, f.y, f.w, f.h, Object.assign({ blei: true }, opt.fo, f.o), an);
        liste.push([f.x + f.w / 2, f.y + f.h / 2]);
      }
      fensterSchein(F, liste);
    };
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

  /* =====================================================================
     ERDGESCHOSS — Sandstein mit Laube
     ===================================================================== */
  function bogenPfad(g, xc, yFuss, yKampf, r) {
    g.moveTo(xc - r, yFuss); g.lineTo(xc - r, yKampf); g.arc(xc, yKampf, r, Math.PI, TAU); g.lineTo(xc + r, yFuss); g.closePath();
  }
  /* Blick in die Laube: Boden, Rückwand mit Tür, Seitenwände, Brüstungen,
     Laibungen – mit Parallaxe gemalt, stimmt in jedem Drehwinkel */
  function laubeMalen(g, F, B, Z, S) {
    const H = ZE, bF = H - Z0, bK = H - BK, bD = H - HT;         // Boden, Kämpfer, Decke (Flächen-y)
    const a0 = -3.9 - X0, a1 = 3.9 - X0;
    const p = parallaxe(F, B, 1);
    const P = (a, b, d) => [a + p[0] * d, b + p[1] * d];
    const dunkel = 0.62;
    const Ld = (c, al) => rgb(mul(c, dunkel), al);
    const oeffnung = (dx, dy) => { g.beginPath(); for (const x of BOGEN) bogenPfad(g, x - X0 + dx, (x === 0 ? bF : bF) + dy, bK + dy, BR); };
    g.save();
    oeffnung(0, 0); g.clip();
    /* Grund: dunkel */
    g.fillStyle = Ld([80, 64, 56]); g.fillRect(0, 0, F.w, F.h);
    /* Decke (Balken) – nur sichtbar, wenn man von unten schaut (nie), dafür
       die Rückwand, Seitenwände und der Boden */
    const d0 = TW, d1 = TW + 2.3;
    /* Seitenwände */
    const wandL = [P(a0, bD, d0), P(a0, bD, d1), P(a0, bF, d1), P(a0, bF, d0)];
    const wandR = [P(a1, bD, d0), P(a1, bD, d1), P(a1, bF, d1), P(a1, bF, d0)];
    poly(g, wandL); g.fillStyle = Ld([178, 150, 126]); g.fill();
    poly(g, wandR); g.fillStyle = Ld([160, 132, 110]); g.fill();
    /* Rückwand: Putz, Tür, Aushangkasten */
    const r0 = P(a0, bD, d1), r1 = P(a1, bF, d1);
    g.fillStyle = Ld([206, 184, 152]); g.fillRect(r0[0], r0[1], r1[0] - r0[0], r1[1] - r0[1]);
    if (F.px > 8) rausch(g, r0[0], r0[1], r1[0] - r0[0], r1[1] - r0[1], 1.5, 0.2, 9, 3);
    /* Tür (zweiflügelig, Rundbogen, Sandsteingewände) */
    const tx = -X0 + 0, tw = 1.4, th = 2.45;
    const tg = P(tx - tw / 2 - 0.16, bF - th - 0.16, d1), tg2 = P(tx + tw / 2 + 0.16, bF, d1);
    g.fillStyle = Ld(SANDSTEIN_H); g.beginPath(); g.moveTo(tg[0], tg2[1]); g.lineTo(tg[0], tg[1] + tw / 2 + 0.16); g.arc((tg[0] + tg2[0]) / 2, tg[1] + tw / 2 + 0.16, tw / 2 + 0.16, Math.PI, TAU); g.lineTo(tg2[0], tg2[1]); g.fill();
    const t0 = P(tx - tw / 2, bF - th, d1);
    g.fillStyle = Ld([92, 48, 30]); g.beginPath(); g.moveTo(t0[0], t0[1] + th); g.lineTo(t0[0], t0[1] + tw / 2); g.arc(t0[0] + tw / 2, t0[1] + tw / 2, tw / 2, Math.PI, TAU); g.lineTo(t0[0] + tw, t0[1] + th); g.fill();
    if (F.px > 14) {
      g.strokeStyle = Ld([54, 26, 16]); g.lineWidth = 0.025;
      g.beginPath(); g.moveTo(t0[0] + tw / 2, t0[1] + 0.05); g.lineTo(t0[0] + tw / 2, t0[1] + th); g.stroke();
      for (const s of [0, 1]) { const kx = t0[0] + 0.12 + s * (tw / 2); g.strokeRect(kx, t0[1] + tw / 2 + 0.1, tw / 2 - 0.24, 0.7); g.strokeRect(kx, t0[1] + tw / 2 + 0.95, tw / 2 - 0.24, 0.7); }
      g.fillStyle = Ld(GOLD); g.fillRect(t0[0] + tw / 2 - 0.12, t0[1] + th * 0.55, 0.08, 0.03); g.fillRect(t0[0] + tw / 2 + 0.04, t0[1] + th * 0.55, 0.08, 0.03);
    }
    /* Kranz an der Tür (Winter) */
    if (S.winter && Z.deko) {
      const k = P(tx, bF - th * 0.62, d1);
      kranzMalen(g, k[0], k[1], 0.2, F.px);
    }
    /* Aushangkästen links und rechts */
    for (const ax of [tx - 2.2, tx + 2.2]) {
      const k0 = P(ax - 0.4, bF - 2.0, d1);
      g.fillStyle = Ld([70, 44, 30]); g.fillRect(k0[0], k0[1], 0.8, 0.6);
      g.fillStyle = Ld([228, 222, 206]); g.fillRect(k0[0] + 0.05, k0[1] + 0.05, 0.7, 0.5);
      if (F.px > 16) { g.fillStyle = Ld([120, 110, 100]); for (let i = 0; i < 5; i++) g.fillRect(k0[0] + 0.1, k0[1] + 0.1 + i * 0.08, 0.3 + (i % 2) * 0.2, 0.02); }
    }
    /* Boden: Sandsteinplatten */
    const b0 = P(a0, bF, d0), b1 = P(a1, bF, d0), b2 = P(a1, bF, d1), b3 = P(a0, bF, d1);
    poly(g, [b0, b1, b2, b3]); g.fillStyle = Ld([168, 136, 116]); g.fill();
    if (F.px > 10) {
      g.strokeStyle = Ld([110, 86, 72]); g.lineWidth = Math.max(0.006, 0.8 / F.px);
      g.beginPath();
      for (let a = a0; a <= a1; a += 0.6) { const q0 = P(a, bF, d0), q1 = P(a, bF, d1); g.moveTo(q0[0], q0[1]); g.lineTo(q1[0], q1[1]); }
      for (let d = d0; d <= d1; d += 0.55) { const q0 = P(a0, bF, d), q1 = P(a1, bF, d); g.moveTo(q0[0], q0[1]); g.lineTo(q1[0], q1[1]); }
      g.stroke();
    }
    if (S.winter) { poly(g, [b0, b1, P(a1, bF, d0 + 0.5), P(a0, bF, d0 + 0.5)]); g.fillStyle = "rgba(236,242,250,0.8)"; g.fill(); }
    if (S.jahr === "herbst") { g.save(); poly(g, [b0, b1, b2, b3]); g.clip(); laub(g, F, b0[0], b3[1], a1 - a0, b0[1] - b3[1], 3, 9); g.restore(); }
    /* Hängelaterne in der Mitte */
    const lp = P(tx, bD + 0.9, TW + 1.1);
    g.strokeStyle = Ld([30, 30, 30]); g.lineWidth = 0.02; g.beginPath(); g.moveTo(lp[0], lp[1] - 0.9); g.lineTo(lp[0], lp[1]); g.stroke();
    g.fillStyle = Ld([30, 30, 32]); g.fillRect(lp[0] - 0.14, lp[1], 0.28, 0.05); g.fillRect(lp[0] - 0.1, lp[1] + 0.05, 0.2, 0.3);
    g.fillStyle = Ld([220, 210, 170]); g.fillRect(lp[0] - 0.08, lp[1] + 0.07, 0.16, 0.25);
    /* Brüstungen in den äußeren Bögen: Sandstein mit Balustern */
    for (const x of [BOGEN[0], BOGEN[2]]) {
      const xa = x - X0 - BR, xb = x - X0 + BR, dB = 0.18, bO = bF - 0.92;
      const o0 = P(xa, bO, dB), o1 = P(xb, bF, dB);
      /* Baluster */
      for (let xx = xa + 0.14; xx < xb - 0.08; xx += 0.2) {
        const q = P(xx, bO + 0.1, dB);
        balusterMalen(g, q[0], q[1], 0.12, bF - bO - 0.22, F.px);
      }
      g.fillStyle = rgb(hell(SANDSTEIN_H, -0.05)); g.fillRect(o0[0], o1[1] - 0.14, xb - xa, 0.14);
      /* Handlauf: Oberseite und Stirn */
      const h0 = P(xa, bO, dB - 0.14), h1 = P(xb, bO, dB + 0.14);
      g.fillStyle = S.winter ? "rgb(240,244,250)" : rgb(hell(SANDSTEIN_H, 0.15)); g.fillRect(h0[0], h0[1] - 0.02, xb - xa, Math.max(0.04, h1[1] - h0[1] + 0.06));
      g.fillStyle = rgb(SANDSTEIN_H); g.fillRect(o0[0], o0[1], xb - xa, 0.1);
    }
    /* Laibungen der Bögen: Pfeilerseiten und Bogenleibung */
    g.beginPath();
    for (const x of BOGEN) { bogenPfad(g, x - X0, bF, bK, BR); bogenPfad(g, x - X0 + p[0] * TW, bF + p[1] * TW, bK + p[1] * TW, BR); }
    g.fillStyle = rgb(mul(SANDSTEIN, 0.8)); g.fill("evenodd");
    g.restore();
  }
  function balusterMalen(g, x, y, b, h, px) {
    g.fillStyle = rgb(hell(SANDSTEIN_H, 0.02));
    if (px * b < 3) { g.fillRect(x - b * 0.3, y, b * 0.6, h); return; }
    g.beginPath();
    g.moveTo(x - b * 0.3, y); g.lineTo(x + b * 0.3, y);
    g.quadraticCurveTo(x + b * 0.15, y + h * 0.3, x + b * 0.5, y + h * 0.62);
    g.quadraticCurveTo(x + b * 0.5, y + h * 0.85, x + b * 0.35, y + h);
    g.lineTo(x - b * 0.35, y + h);
    g.quadraticCurveTo(x - b * 0.5, y + h * 0.85, x - b * 0.5, y + h * 0.62);
    g.quadraticCurveTo(x - b * 0.15, y + h * 0.3, x - b * 0.3, y);
    g.fill();
    g.fillStyle = rgb(hell(SANDSTEIN_H, -0.3), 0.6);
    g.fillRect(x + b * 0.15, y + h * 0.35, b * 0.25, h * 0.6);
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

  /* Südwand des Erdgeschosses (Flächenkoordinaten a = x − X0, b = ZE − z) */
  function egSuedMaler(B, Z, S, hoch) {
    return function (g, F) {
      const W = F.w, H = ZE;
      g.save();
      g.translate(0, -(ZE - hoch));
      const L = L0;
      /* Mauerwerk */
      quaderwerk(g, F, L, 0, 0, W, H, { saat: 21, lage: 0.34 });
      /* Sockel: Bossenquader bis zum Hallenboden */
      quaderwerk(g, F, L, 0, H - Z0, W, Z0, { saat: 23, lage: 0.3, bossen: true, farbe: hell(SANDSTEIN, -0.06) });
      g.fillStyle = L(hell(SANDSTEIN, 0.1)); g.fillRect(0, H - Z0 - 0.06, W, 0.06);
      /* Eckquader */
      if (F.px > 4) for (const xa of [0, W - 0.42]) for (let y = H - Z0 - 0.4, i = 0; y > 0; y -= 0.4, i++) {
        const bw = i % 2 ? 0.42 : 0.62, x = xa === 0 ? 0 : W - bw;
        g.fillStyle = L(PI.streu(hell(SANDSTEIN, 0.06), zufall(i + 3), 0.06)); g.fillRect(x, y - 0.38, bw, 0.38);
        g.fillStyle = L([60, 30, 20], 0.35); g.fillRect(x, y - 0.012, bw, 0.012);
      }
      /* Bögen: Keilsteine und Schlussstein */
      for (const x of BOGEN) {
        const xc = x - X0, yk = H - BK;
        const n = 11;
        for (let i = 0; i < n; i++) {
          const a0 = Math.PI + i / n * Math.PI, a1 = Math.PI + (i + 1) / n * Math.PI, r0 = BR, r1 = BR + (i === (n - 1) / 2 ? 0.52 : 0.42);
          g.fillStyle = L(PI.streu(SANDSTEIN_H, zufall(i * 7 + 1), 0.07));
          g.beginPath(); g.arc(xc, yk, r1, a0, a1); g.arc(xc, yk, r0, a1, a0, true); g.closePath(); g.fill();
          g.strokeStyle = L([70, 36, 24], 0.5); g.lineWidth = Math.max(0.008, 0.9 / F.px); g.stroke();
        }
        /* Kämpfergesims */
        for (const sx of [-1, 1]) { g.fillStyle = L(hell(SANDSTEIN_H, 0.1)); g.fillRect(xc + sx * BR - (sx < 0 ? 0.22 : 0), yk - 0.02, 0.22, 0.14); g.fillStyle = L(hell(SANDSTEIN_H, -0.25)); g.fillRect(xc + sx * BR - (sx < 0 ? 0.22 : 0), yk + 0.1, 0.22, 0.03); }
      }
      /* Blick in die Laube */
      laubeMalen(g, F, B, Z, S);
      /* Bogenschatten: die Wand wirft Schatten in die Öffnung (Sonne) */
      /* Wappen über der mittleren Arkade */
      if (Z.wappen) {
        const sv = F.schatten ? F.schatten(0.08) : null;
        const cx = -X0, cy = H - 3.3;
        if (sv) { g.save(); g.translate(sv[0], sv[1]); g.fillStyle = "rgba(40,20,16,0.3)"; g.beginPath(); g.ellipse(cx, cy + 0.02, 0.36, 0.38, 0, 0, TAU); g.fill(); g.restore(); }
        wappenMalen(g, F, cx, cy, 0.68, L);
        if (S.winter && Z.deko) {
          /* Tannengirlande unter dem Gesims, mit Schleifen */
          girlande(g, F, [[BOGEN[0] - X0 - 1.35, H - 3.72], [-X0 - 1.35, H - 3.72], [-X0 + 1.35, H - 3.72], [BOGEN[2] - X0 + 1.0, H - 3.72]], 0.32, false);
        }
      }
      /* Gurtgesims (die Stirn des Kastens davor malt das Profil) */
      g.fillStyle = L(hell(SANDSTEIN_H, 0.05)); g.fillRect(0, H - 3.78, W, 0.05);
      /* Spritzwasser, Kontakt */
      const gr = g.createLinearGradient(0, H, 0, H - 0.5);
      gr.addColorStop(0, "rgba(60,40,30,0.3)"); gr.addColorStop(1, "rgba(60,40,30,0)");
      g.fillStyle = gr; g.fillRect(0, H - 0.5, W, 0.5);
      if (S.winter) { g.fillStyle = "rgba(240,244,250,0.9)"; g.beginPath(); g.moveTo(0, H); for (let x = 0; x <= W; x += 0.3) g.lineTo(x, H - 0.08 - 0.06 * Math.sin(x * 3.1)); g.lineTo(W, H); g.fill(); }
      /* frische Lage oben (im Bau) */
      if (hoch < ZE - 0.01) { g.fillStyle = "rgba(255,240,220,0.25)"; g.fillRect(0, ZE - hoch, W, 0.34); }
      g.restore();
    };
  }
  function egLeuchten(B, Z, S) {
    return function (g, F) {
      if (!Z.fertig && !Z.halle) return;
      const a = F.nacht;
      /* Lichterkette in der Tannengirlande */
      if (S.winter && Z.deko) girlande(g, F, [[BOGEN[0] - X0 - 1.35, ZE - 3.72], [-X0 - 1.35, ZE - 3.72], [-X0 + 1.35, ZE - 3.72], [BOGEN[2] - X0 + 1.0, ZE - 3.72]], 0.32, true);
      const p = parallaxe(F, B, 1);
      g.save();
      g.beginPath(); for (const x of BOGEN) bogenPfad(g, x - X0, ZE - Z0, ZE - BK, BR); g.clip();
      /* warmer Schein der Hängelaterne auf Rückwand und Boden */
      const lp = [-X0 + p[0] * (TW + 1.1), ZE - HT + 1.1 + p[1] * (TW + 1.1)];
      const gr = g.createRadialGradient(lp[0], lp[1], 0, lp[0], lp[1], 3.2);
      gr.addColorStop(0, "rgba(255,210,140," + (0.75 * a) + ")"); gr.addColorStop(0.4, "rgba(255,180,100," + (0.35 * a) + ")"); gr.addColorStop(1, "rgba(255,160,80,0)");
      g.fillStyle = gr; g.fillRect(lp[0] - 3.2, lp[1] - 3.2, 6.4, 6.4);
      g.fillStyle = "rgba(255,236,180," + a + ")"; g.fillRect(lp[0] - 0.08, lp[1] + 0.07, 0.16, 0.25);
      g.restore();
      schein(F, lp[0], lp[1] + 0.2, 2.2, "255,196,120", 0.6);
    };
  }
  /* Seiten- und Rückwände des Erdgeschosses */
  function egWandMaler(fenster, tuer, hoch, S, Z) {
    return function (g, F) {
      const W = F.w, H = ZE;
      g.save(); g.translate(0, -(ZE - hoch));
      const L = L0;
      quaderwerk(g, F, L, 0, 0, W, H, { saat: ST.textHash(F.name) % 50 + 30, lage: 0.34 });
      quaderwerk(g, F, L, 0, H - Z0, W, Z0, { saat: 23, lage: 0.3, bossen: true, farbe: hell(SANDSTEIN, -0.06) });
      g.fillStyle = L(hell(SANDSTEIN, 0.1)); g.fillRect(0, H - Z0 - 0.06, W, 0.06);
      if (F.px > 4) for (const xa of [0, 1]) for (let y = H - Z0 - 0.4, i = 0; y > 0; y -= 0.4, i++) {
        const bw = i % 2 ? 0.62 : 0.42, x = xa === 0 ? 0 : W - bw;
        g.fillStyle = L(PI.streu(hell(SANDSTEIN, 0.06), zufall(i + 9), 0.06)); g.fillRect(x, y - 0.38, bw, 0.38);
        g.fillStyle = L([60, 30, 20], 0.35); g.fillRect(x, y - 0.012, bw, 0.012);
      }
      /* Gesims */
      g.fillStyle = L(hell(SANDSTEIN_H, 0.08)); g.fillRect(0, H - 4.05, W, 0.12);
      g.fillStyle = L(SANDSTEIN_H); g.fillRect(0, H - 3.93, W, 0.1);
      g.fillStyle = L(hell(SANDSTEIN_H, -0.3)); g.fillRect(0, H - 3.83, W, 0.04);
      if (S.winter) schneeKappe(g, F, 0, H - 4.05, W, 0.05, 5);
      for (const f of fenster) {
        const top = H - f[2] - f[3];
        if (hoch < f[2] + 0.2) continue;
        if (Z.fenster) fensterK(g, F, f[0], top, f[1], f[3], { gewaende: 0.12, gitter: true, winter: S.winter, rahmen: [70, 36, 28], blei: true, bank: false, sprossen: null });
        else { g.fillStyle = L(SANDSTEIN_H); g.fillRect(f[0] - 0.12, top - 0.12, f[1] + 0.24, f[3] + 0.24); g.fillStyle = "rgb(40,34,32)"; g.fillRect(f[0], top, f[1], f[3]); }
      }
      if (tuer && hoch > 2.6) {
        const [tx, tw, th] = tuer, ty = H - th;
        g.fillStyle = L(SANDSTEIN_H); g.fillRect(tx - 0.16, ty - 0.2, tw + 0.32, th + 0.2);
        g.fillStyle = L([88, 46, 30]); g.fillRect(tx, ty, tw, th);
        if (F.px > 12) { g.strokeStyle = L([50, 24, 16]); g.lineWidth = 0.02; for (let i = 1; i < 6; i++) { g.beginPath(); g.moveTo(tx + tw * i / 6, ty); g.lineTo(tx + tw * i / 6, ty + th); g.stroke(); } g.fillStyle = L(EISEN); g.fillRect(tx, ty + 0.4, tw * 0.7, 0.05); g.fillRect(tx, ty + th - 0.5, tw * 0.7, 0.05); }
        g.fillStyle = L(hell(SANDSTEIN, -0.1)); g.fillRect(tx - 0.3, H - 0.02, tw + 0.6, 0.02);
      }
      const gr = g.createLinearGradient(0, H, 0, H - 0.5);
      gr.addColorStop(0, "rgba(60,40,30,0.3)"); gr.addColorStop(1, "rgba(60,40,30,0)");
      g.fillStyle = gr; g.fillRect(0, H - 0.5, W, 0.5);
      if (S.winter) { g.fillStyle = "rgba(240,244,250,0.9)"; g.beginPath(); g.moveTo(0, H); for (let x = 0; x <= W; x += 0.3) g.lineTo(x, H - 0.08 - 0.06 * Math.sin(x * 2.3 + 1)); g.lineTo(W, H); g.fill(); }
      if (hoch < ZE - 0.01) { g.fillStyle = "rgba(255,240,220,0.25)"; g.fillRect(0, ZE - hoch, W, 0.34); }
      g.restore();
    };
  }
  function egWandLeuchten(fenster, Z) {
    return function (g, F) {
      if (!Z.fenster) return;
      const rng = zufall(ST.textHash(F.name) + 1), liste = [];
      for (const f of fenster) {
        if (rng() > 0.6) continue;
        fensterKLicht(g, F, f[0], ZE - f[2] - f[3], f[1], f[3], { blei: true }, 1);
        liste.push([f[0] + f[1] / 2, ZE - f[2] - f[3] / 2]);
      }
      fensterSchein(F, liste);
    };
  }

  /* =====================================================================
     BAUGRUBE UND FUNDAMENT
     ===================================================================== */
  const GRUBE = [X0 - 0.7, YN - 0.7, X1 + 0.7, Y1 + 0.5];
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
  function grubeBauen(M, B, S, Z) {
    const R = GRUBE, T = Math.max(0.04, Z.grubeT);
    const [x0, y0, x1, y1] = R;
    const ex = { keinLicht: true, keinAo: true, schatten: false };
    M.teil("baugrube", { ebene: -3, mitte: [0, 0, -3], schatten: false });
    const wandMal = (saat) => (g, F) => {
      g.save(); if (!lochClip(g, F, B, R)) { g.restore(); return; }
      erdeMalen(g, F, Lm(F, 0.85), F.w, F.h, saat, S.winter);
      g.restore();
    };
    M.flaeche(Object.assign({ name: "gb", o: [x0, y0, -T], u: [1, 0, 0], v: [0, 1, 0], w: x1 - x0, h: y1 - y0, ebene: -1, malen: (g, F) => {
      g.save(); if (!lochClip(g, F, B, R)) { g.restore(); return; }
      const L = Lm(F, 0.9);
      g.fillStyle = L([120, 90, 62]); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
      if (F.px > 6) rausch(g, 0, 0, F.w, F.h, 1.2, 0.3, 17, 3);
      if (F.px > 6) { g.strokeStyle = L([92, 68, 46], 0.6); g.lineWidth = 0.4; g.beginPath(); g.moveTo(1, F.h - 1); g.quadraticCurveTo(F.w * 0.45, F.h * 0.35, F.w - 1.5, 1.2); g.stroke(); }
      if (S.winter) { g.fillStyle = L([236, 240, 248], 0.4); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); }
      g.restore();
    } }, ex));
    wand(M, "gw-n", [x0, y0], [x1, y0], -T, 0, wandMal(101), ex);
    wand(M, "gw-s", [x1, y1], [x0, y1], -T, 0, wandMal(102), ex);
    wand(M, "gw-o", [x1, y0], [x1, y1], -T, 0, wandMal(103), ex);
    wand(M, "gw-w", [x0, y1], [x0, y0], -T, 0, wandMal(104), ex);
    /* Fundament: erst Schalung und Eisen, dann Beton */
    if (Z.fund > 0) {
      const zt = -T + Math.min(T, 0.9) * glatt(Z.fund);
      const fx0 = X0 - 0.15, fx1 = X1 + 0.15, fy0 = YN - 0.15, fy1 = Y1 + 0.15;
      const nass = Z.fund < 0.8;
      const beton = (g, F) => {
        g.save(); if (!lochClip(g, F, B, R)) { g.restore(); return; }
        const L = Lm(F), w = F.w, h = F.h;
        if (Z.fund < 0.45) {
          for (let x = 0; x < w; x += 0.22) { g.fillStyle = L(PI.streu([168, 132, 88], zufall(x * 100 + 3), 0.08)); g.fillRect(x, -0.1, 0.21, h + 0.2); }
        } else {
          g.fillStyle = L(nass ? [126, 126, 122] : [172, 170, 162]); g.fillRect(-0.05, -0.05, w + 0.1, h + 0.1);
          if (F.px > 8) rausch(g, 0, 0, w, h, 1.1, 0.25, 40, 3);
        }
        g.restore();
      };
      const hF = zt + T;
      if (hF > 0.02) {
        wand(M, "f-s", [fx0, fy1], [fx1, fy1], -T, zt, beton, ex);
        wand(M, "f-n", [fx1, fy0], [fx0, fy0], -T, zt, beton, ex);
        wand(M, "f-o", [fx1, fy1], [fx1, fy0], -T, zt, beton, ex);
        wand(M, "f-w", [fx0, fy0], [fx0, fy1], -T, zt, beton, ex);
        M.flaeche(Object.assign({ name: "f-t", o: [fx0, fy0, zt], u: [1, 0, 0], v: [0, 1, 0], w: fx1 - fx0, h: fy1 - fy0, ebene: 1, malen: (g, F) => {
          const L = Lm(F), w = F.w, h = F.h;
          g.fillStyle = L(Z.fund < 0.45 ? [120, 96, 70] : nass ? [118, 120, 122] : [176, 174, 166]); g.fillRect(-0.05, -0.05, w + 0.1, h + 0.1);
          if (F.px > 8) rausch(g, 0, 0, w, h, 0.9, 0.2, 31, 3);
          if (Z.fund < 0.75) { g.strokeStyle = L([96, 62, 42]); g.lineWidth = 0.025; g.beginPath(); for (let x = 0.3; x < w; x += 0.3) { g.moveTo(x, 0.1); g.lineTo(x, h - 0.1); } for (let y = 0.3; y < h; y += 0.3) { g.moveTo(0.1, y); g.lineTo(w - 0.1, y); } g.stroke(); }
          else if (F.px > 6) { g.strokeStyle = L([60, 60, 60], 0.5); g.lineWidth = 0.03; g.strokeRect(0.15, 0.15, X1 - X0, YE - YN); }
          if (S.winter && !nass) { g.fillStyle = "rgba(240,244,250,0.45)"; g.fillRect(0, 0, w, h); }
        } }, ex));
      }
    }
    /* Aushub neben der Grube */
    M.teil("aushub", { mitte: [X1 + 3, 0, 0.5] });
    M.figur({ x: X1 + 2.4, y: -1.5, z: 0, breite: 5, hoehe: 1.8, malen: aushubFigur(glatt(Z.grubeT / 1.2) * (Z.verfuellt ? 0.4 : 1), S.winter) });
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
     BAUZUSTAND
     XANDER: „Man soll das Fundament sehen beim Aufbauen … wie das nach
     2 Minuten aussieht, nach 5 … 10 … 15 Minuten, bis es fertig ist."
       0,00–0,06  Baugrube wird ausgehoben, Aushubhaufen wächst
       0,06–0,12  Fundament: Schalung und Eisen, dann Beton
       0,12–0,14  verfüllt, Bodenplatte
       0,14–0,40  Erdgeschoss aus Sandstein, Lage für Lage; ab dem
                  Kämpfer stehen hölzerne Lehrgerüste in den Bögen
       0,40–0,46  Balkenlage und Dielen über dem Erdgeschoss
       0,46–0,55  Gerippe des 1. OG (Schwellen, Ständer, Rähm, Riegel,
                  Streben), 0,55–0,60 ausgefacht
       0,60–0,72  2. OG ebenso, dazu der Erker
       0,72–0,79  Dachstuhl (Sparren), Treppengiebel wird gemauert
       0,78–0,86  Richtfest: Richtkrone auf dem First
       0,79–0,90  Lattung, dann Ziegel von der Traufe zum First
       0,86–0,94  Dachreiter (Gerippe, dann Schiefer), Kamin, Erkerhelm
       0,88–0,96  Freitreppe, Fenster, Laube, Uhr, Wappen, Laternen
       0,96–1,00  Fahne, Schmuck, Schnee
     ===================================================================== */
  function zustand(bau) {
    const k = (a, b) => phase(bau, a, b);
    const Z = { bau: bau, fertig: bau >= 0.999 };
    Z.grube = bau < 0.14;
    Z.grubeT = 1.2 * glatt(k(0.0, 0.06));
    Z.fund = k(0.06, 0.12);
    Z.verfuellt = bau >= 0.12;
    Z.egZ = bau < 0.14 ? 0 : ZE * k(0.14, 0.40);
    Z.lehr = bau >= 0.24 && bau < 0.44;
    Z.decke1 = bau >= 0.40 ? k(0.40, 0.46) : 0;
    Z.og1 = { holz: k(0.46, 0.55), fach: k(0.55, 0.60), roh: 1 - k(0.86, 0.9) * 0 };
    Z.decke2 = bau >= 0.58 ? k(0.58, 0.62) : 0;
    Z.og2 = { holz: k(0.62, 0.68), fach: k(0.68, 0.72) };
    Z.erker = { holz: k(0.56, 0.66), fach: k(0.66, 0.72) };
    Z.stuhl = k(0.72, 0.79);
    Z.giebelZ = bau < 0.72 ? 0 : k(0.72, 0.8);
    Z.richt = bau >= 0.78 && bau < 0.86;
    Z.latten = k(0.79, 0.83); Z.ziegel = k(0.83, 0.9);
    Z.dachFertig = bau >= 0.9;
    Z.reiter = bau < 0.86 ? 0 : bau < 0.9 ? 1 : 2;
    Z.kamin = k(0.84, 0.9);
    Z.treppe = k(0.88, 0.93);
    Z.fenster = bau >= 0.9; Z.halle = bau >= 0.92; Z.uhr = bau >= 0.94;
    Z.wangen = bau >= 0.93; Z.laternen = bau >= 0.95; Z.wappen = bau >= 0.95;
    Z.fahne = bau >= 0.97; Z.deko = bau >= 0.97;
    Z.schnee = Z.fertig ? 1 : k(0.9, 0.98);
    Z.licht = bau >= 0.99;
    for (const o of [Z.og1, Z.og2, Z.erker]) { o.fenster = Z.fenster; o.roh = 0; }
    return Z;
  }

  /* =====================================================================
     AUFBAU DER TEILE
     ===================================================================== */
  /* Teil einer Fassade: Mitte weit vor der Wand (n = Außennormale) */
  function fassadenTeil(M, name, n, c, opt) {
    return M.teil(name, Object.assign({ mitte: [c[0] + n[0] * AUSSEN, c[1] + n[1] * AUSSEN, c[2]] }, opt || {}));
  }

  function erdgeschossBauen(M, B, S, Z) {
    const hoch = Math.max(0.05, Z.egZ);
    const ex = (name) => ({ name: name, ao: true });
    M.teil("eg", { mitte: [0, (YN + YE) / 2, hoch / 2] });
    const fOst = [[1.4, 0.9, 1.4, 1.2], [4.6, 0.9, 1.4, 1.2]];
    const fWest = [[1.7, 0.9, 1.4, 1.2], [4.9, 0.9, 1.4, 1.2]];
    const fNord = [[1.0, 0.9, 1.4, 1.2], [5.6, 0.9, 1.4, 1.2], [8.2, 0.9, 1.4, 1.2], [9.9, 0.9, 1.4, 1.2]];
    const tNord = [2.6, 1.2, 2.3];
    wand(M, "eg-s", [X0, YE], [X1, YE], 0, hoch, egSuedMaler(B, Z, S, hoch), Object.assign(ex("eg-s"), { leuchten: egLeuchten(B, Z, S) }));
    wand(M, "eg-o", [X1, YE], [X1, YN], 0, hoch, egWandMaler(fOst, null, hoch, S, Z), Object.assign(ex("eg-o"), { leuchten: egWandLeuchten(fOst, Z) }));
    wand(M, "eg-w", [X0, YN], [X0, YE], 0, hoch, egWandMaler(fWest, null, hoch, S, Z), Object.assign(ex("eg-w"), { leuchten: egWandLeuchten(fWest, Z) }));
    wand(M, "eg-n", [X1, YN], [X0, YN], 0, hoch, egWandMaler(fNord, tNord, hoch, S, Z), Object.assign(ex("eg-n"), { leuchten: egWandLeuchten(fNord, Z) }));
    /* Mauerkrone im Bau: Wandstärke hell, innen der Blick in den Raum */
    if (Z.egZ < ZE - 0.01) {
      M.flaeche({ name: "eg-krone", o: [X0, YN, hoch], u: [1, 0, 0], v: [0, 1, 0], w: X1 - X0, h: YE - YN, keinAo: true, malen: (g, F) => {
        const w = F.w, h = F.h;
        g.fillStyle = "rgb(84,70,62)"; g.fillRect(-0.05, -0.05, w + 0.1, h + 0.1);
        const p = parallaxe(F, B, 0);
        void p;
        g.fillStyle = rgb(hell(SANDSTEIN, 0.12));
        g.fillRect(0, 0, w, TW); g.fillRect(0, h - TW, w, TW); g.fillRect(0, 0, TW, h); g.fillRect(w - TW, 0, TW, h);
        if (S.winter) { g.fillStyle = "rgba(240,244,250,0.6)"; g.fillRect(0, 0, w, TW * 0.5); }
        /* Aussparungen der Bögen in der Mauerkrone */
        if (hoch > Z0 + 0.05 && hoch < ZE - 0.9) { g.fillStyle = "rgb(84,70,62)"; for (const x of BOGEN) { const hw = hoch < BK ? BR : Math.sqrt(Math.max(0, BR * BR - (hoch - BK) * (hoch - BK))); if (hw > 0.02) g.fillRect(x - X0 - hw, h - TW - 0.01, hw * 2, TW + 0.02); } }
      } });
      /* Lehrgerüste in den Bögen */
      if (Z.lehr) {
        fassadenTeil(M, "lehr", [0, 1, 0], [0, YE, 2.5], { schatten: false });
        for (const x of BOGEN) {
          if (hoch < BK - 0.2) continue;
          rechteck(M, "lehr" + x, [x, YE - 0.1, (BK + BK + BR) / 2 - 0.05], [0, 1, 0], [1, 0, 0], BR * 2, BR + 0.1, (g, F) => {
            const L = Lm(F), w = F.w, h = F.h;
            g.fillStyle = L(HOLZ_ROH);
            g.beginPath(); g.moveTo(0, h); g.lineTo(0, h - 0.1); g.arc(w / 2, h - 0.1, w / 2, Math.PI, TAU); g.lineTo(w, h); g.lineTo(w - 0.12, h); g.arc(w / 2, h - 0.1, w / 2 - 0.12, TAU, Math.PI, true); g.lineTo(0.12, h); g.closePath(); g.fill();
            g.fillRect(0, h - 0.12, w, 0.08);
            g.strokeStyle = L(hell(HOLZ_ROH, -0.2)); g.lineWidth = 0.06;
            g.beginPath(); g.moveTo(w / 2, h - 0.1); g.lineTo(w / 2, 0.1); g.moveTo(w * 0.15, h - 0.1); g.lineTo(w / 2, 0.3); g.moveTo(w * 0.85, h - 0.1); g.lineTo(w / 2, 0.3); g.stroke();
            /* Stützen bis zum Boden */
          }, { keinLicht: true, beidseitig: true, keinAo: true });
        }
      }
    }
  }
  /* Gurtgesims mit Kragsteinen vorn (trägt die Auskragung des 1. OG) */
  function gesimsBauen(M, S, Z) {
    if (Z.egZ < ZE - 0.01) return;
    const winter = S.winter;
    fassadenTeil(M, "gesims", [0, 1, 0], [0, (YE + Y1) / 2, 3.9]);
    const profil = (g, F) => {
      const w = F.w, h = F.h;
      g.fillStyle = rgb(hell(SANDSTEIN_H, 0.12)); g.fillRect(-0.05, 0, w + 0.1, h * 0.3);
      const gr = g.createLinearGradient(0, h * 0.3, 0, h * 0.85);
      gr.addColorStop(0, rgb(hell(SANDSTEIN_H, 0.05))); gr.addColorStop(1, rgb(hell(SANDSTEIN_H, -0.35)));
      g.fillStyle = gr; g.fillRect(-0.05, h * 0.3, w + 0.1, h * 0.55);
      g.fillStyle = rgb(hell(SANDSTEIN_H, 0.1)); g.fillRect(-0.05, h * 0.85, w + 0.1, h * 0.15);
      if (F.px > 8) rausch(g, 0, 0, w, h, 1.2, 0.2, 61, 3);
      if (F.px > 16) { g.fillStyle = "rgba(60,30,20,0.3)"; for (let x = 0.9; x < w; x += 1.1) g.fillRect(x, 0, 0.012, h); }
    };
    kiste(M, "gesims", X0 - 0.05, YE, 3.75, X1 + 0.05, Y1, ZE, { s: profil, o: profil, w: profil });
    /* Kragsteine */
    for (const x of [-5.3, -4.05, -1.35, 1.35]) {
      const mal = (g, F) => {
        const w = F.w, h = F.h;
        g.fillStyle = rgb(SANDSTEIN_H); g.fillRect(-0.02, -0.02, w + 0.04, h + 0.04);
        g.fillStyle = rgb(hell(SANDSTEIN_H, -0.25)); g.beginPath(); g.moveTo(0, h * 0.4); g.quadraticCurveTo(w * 0.5, h * 1.1, w, h * 0.4); g.lineTo(w, h); g.lineTo(0, h); g.fill();
        g.fillStyle = rgb(hell(SANDSTEIN_H, 0.15)); g.fillRect(0, 0, w, h * 0.12);
        if (F.px > 8) rausch(g, 0, 0, w, h, 0.5, 0.2, 77, 2);
      };
      kiste(M, "krag" + x, x - 0.11, YE, 3.35, x + 0.11, YE + 0.26, 3.75, { s: mal, o: mal, w: mal });
    }
    void winter;
  }

  /* Balkenlage (Dielen) über einem Geschoss – im Bau sichtbar */
  function deckeBauen(M, name, y1, z, k, S) {
    if (k <= 0) return;
    M.teil(name, { mitte: [0, (YN + y1) / 2, z - 0.3] });
    M.flaeche({ name: name, o: [X0, YN, z], u: [1, 0, 0], v: [0, 1, 0], w: X1 - X0, h: y1 - YN, keinAo: true, malen: (g, F) => {
      const w = F.w, h = F.h;
      /* Balken quer (alle 0,8 m), dann Dielen von Westen nach Osten */
      g.fillStyle = "rgb(70,58,50)"; g.fillRect(-0.05, -0.05, w + 0.1, h + 0.1);
      g.fillStyle = rgb(hell(SANDSTEIN, 0.1)); g.fillRect(0, 0, w, 0.3); g.fillRect(0, 0, 0.3, h); g.fillRect(w - 0.3, 0, 0.3, h);
      const nb = Math.round(w / 0.8);
      for (let i = 0; i <= nb; i++) { if (i / nb > k * 2) break; const x = i * w / nb; g.fillStyle = rgb(hell(HOLZ_ROH, -0.05)); g.fillRect(x - 0.1, 0, 0.2, h); g.fillStyle = rgb(hell(HOLZ_ROH, -0.35)); g.fillRect(x + 0.07, 0, 0.03, h); }
      const kd = klemm((k - 0.4) / 0.6, 0, 1);
      if (kd > 0) {
        const xe = w * kd;
        for (let x = 0; x < xe; x += 0.2) { g.fillStyle = rgb(PI.streu(hell(HOLZ_ROH, 0.08), zufall(x * 50 + 1), 0.07)); g.fillRect(x, 0, 0.19, h); }
        if (F.px > 10) { g.fillStyle = "rgba(60,40,24,0.35)"; for (let x = 0; x < xe; x += 0.2) g.fillRect(x + 0.19, 0, 0.012, h); }
      }
      if (S.winter) { g.fillStyle = "rgba(240,244,250,0.35)"; g.fillRect(0, 0, w, h); }
    } });
  }

  /* ---------------- Obergeschosse ---------------- */
  const OG1_GEO = { rahm: [0.3, 0.2], schwelle: [2.69, 0.22], fo: 0.44, fu: 1.78, brust: 1.5 };
  const OG2_GEO = { rahm: [0.1, 0.2], schwelle: [2.39, 0.22], fo: 0.56, fu: 1.72, brust: 1.3 };
  const PAARE = [2.9, 5.6, 8.3];
  function og1Sued() {
    const W = X1 - X0, P = new Plan(W, 2.8);
    const g = OG1_GEO, yO = 0.4, yS = 2.58;
    P.s(0, g.rahm[0], W, g.rahm[0], g.rahm[1], "rahm"); P.s(0, g.schwelle[0], W, g.schwelle[0], g.schwelle[1], "schwelle");
    P.s(0.11, yO, 0.11, yS, 0.22, "staender"); P.s(W - 0.11, yO, W - 0.11, yS, 0.22, "staender");
    const z = ["feuerbock", "rosette", "kreuz"];
    PAARE.forEach((xc, i) => fensterPaar(P, xc, 0.75, yO, 1.78, 1.86, yS, 0.2, z[i], {}));
    mann(P, 0.22, 1.86, yO, yS, 0.2);
    /* schmale Felder zwischen den Paaren: geschweifte Andreaskreuze */
    for (const [a, e] of [[3.94, 4.56], [6.64, 7.26]]) {
      P.s(a, 1.5, e, 1.5, 0.14, "riegel");
      P.k([a, yS, a + 0.05, 1.9, e, 1.52], 0.11, "zier"); P.k([e, yS, e - 0.05, 1.9, a, 1.52], 0.11, "zier");
      P.k([a, yO, a + 0.05, 1.05, e, 1.48], 0.11, "zier"); P.k([e, yO, e - 0.05, 1.05, a, 1.48], 0.11, "zier");
    }
    mann(P, 9.34, 11.0, yO, yS, 0.2);
    return P;
  }
  function og2Sued() {
    const W = X1 - X0, P = new Plan(W, 2.5);
    const g = OG2_GEO, yO = 0.2, yS = 2.28;
    P.s(0, g.rahm[0], W, g.rahm[0], g.rahm[1], "rahm"); P.s(0, g.schwelle[0], W, g.schwelle[0], g.schwelle[1], "schwelle");
    P.s(0.11, yO, 0.11, yS, 0.22, "staender"); P.s(W - 0.11, yO, W - 0.11, yS, 0.22, "staender");
    PAARE.forEach((xc) => fensterPaar(P, xc, 0.72, g.fo, g.fu, 1.8, yS, 0.2, "raute", {}));
    for (const xc of PAARE) { const x0 = xc - 0.72 - 0.19, x1 = xc + 0.72 + 0.19; P.s(x0 - 0.1, g.fo - 0.06, x1 + 0.1, g.fo - 0.06, 0.12, "riegel"); }
    mann(P, 0.22, 1.86, yO, yS, 0.2);
    for (const [a, e] of [[3.94, 4.56], [6.64, 7.26]]) { P.s(a, 1.3, e, 1.3, 0.14, "riegel"); brust(P, "kreuz", a, e, 1.37, yS, 0.1); brust(P, "kreuz", a, e, yO, 1.23, 0.1); }
    mann(P, 9.34, 11.0, yO, yS, 0.2);
    return P;
  }
  function ogBauen(M, B, S, Z, stufe) {
    const og2 = stufe === 2;
    const st = og2 ? Z.og2 : Z.og1;
    if (st.holz <= 0) return;
    const za = og2 ? Z2 : ZE, ze = og2 ? ZT : Z2, ys = og2 ? Y2 : Y1, H = ze - za;
    const geo = og2 ? OG2_GEO : OG1_GEO;
    const voll = st.fach >= 1;
    const ex = (name, extra) => Object.assign({ name: name, keinAo: true }, voll ? {} : { keinLicht: true, beidseitig: true }, extra || {});
    const W_OW = ys - YN, W_NS = X1 - X0;
    const suedPlan = og2 ? og2Sued() : og1Sued();
    const fo = { bankFarbe: hell(HOLZ, 0.05) };
    const winterK = S.winter && Z.deko ? "winter" : (S.jahr === "sommer" || S.jahr === "fruehling") && Z.fenster ? "sommer" : null;
    if (!og2 && winterK) for (const f of suedPlan.f) if (Math.abs(f.x + f.w / 2 - 5.6) < 1.2 || winterK === "sommer") f.o.kasten = winterK;
    const ostPlan = regelWand(W_OW, H, geo, [[1.0, 0.75], [3.2, 0.75], [5.4, 0.75]], { brust: og2 ? "raute" : "kreuz" });
    const westPlan = regelWand(W_OW, H, geo, [[1.3, 0.75], [3.5, 0.75], [5.7, 0.75]], { brust: og2 ? "raute" : "kreuz" });
    const nordPlan = regelWand(W_NS, H, geo, [[0.9, 0.75], [2.6, 0.75], [4.3, 0.75], [6.9, 0.75], [8.6, 0.75], [10.0, 0.75]], { brust: "kreuz" });
    const teil = (name, n, c) => voll ? null : fassadenTeil(M, name, n, c, { schatten: false });
    if (voll) M.teil(og2 ? "og2" : "og1", { mitte: [0, (YN + ys) / 2, (za + ze) / 2] });
    const mitte = (za + ze) / 2;
    const traufe = og2 ? { traufe: 0.55, traufeY: 0 } : {};
    teil("s" + stufe, [0, 1, 0], [0, ys, mitte]);
    wand(M, "og" + stufe + "-s", [X0, ys], [X1, ys], za, ze, fwMaler(suedPlan, st, { fo: fo, danach: og2 ? null : knaggenMaler }), ex("og" + stufe + "-s", Object.assign({ leuchten: voll ? fwLeuchten(suedPlan, st, { anteil: 0.85 }) : null }, traufe)));
    teil("o" + stufe, [1, 0, 0], [X1, (YN + ys) / 2, mitte]);
    wand(M, "og" + stufe + "-o", [X1, ys], [X1, YN], za, ze, fwMaler(ostPlan, st, { fo: fo }), ex("og" + stufe + "-o", { leuchten: voll ? fwLeuchten(ostPlan, st, { anteil: 0.6 }) : null }));
    teil("w" + stufe, [-1, 0, 0], [X0, (YN + ys) / 2, mitte]);
    wand(M, "og" + stufe + "-w", [X0, YN], [X0, ys], za, ze, fwMaler(westPlan, st, { fo: fo }), ex("og" + stufe + "-w", { leuchten: voll ? fwLeuchten(westPlan, st, { anteil: 0.6 }) : null }));
    teil("n" + stufe, [0, -1, 0], [0, YN, mitte]);
    wand(M, "og" + stufe + "-n", [X1, YN], [X0, YN], za, ze, fwMaler(nordPlan, st, { fo: fo }), ex("og" + stufe + "-n", Object.assign({ leuchten: voll ? fwLeuchten(nordPlan, st, { anteil: 0.5 }) : null }, og2 ? { traufe: 0.55, traufeY: 0 } : {})));
  }
  /* Knaggen unter der Balkenlage des 2. OG (auf die Wand des 1. OG gemalt) */
  function knaggenMaler(g, F, L) {
    const xs = [0.11, 1.04, 1.86, 3.84, 4.66, 6.54, 7.36, 9.24, 11.09];
    const sv = F.schatten ? F.schatten(0.25) : null;
    for (const x of xs) {
      const p = [[x - 0.09, 0.2], [x + 0.09, 0.2], [x + 0.09, 0.62], [x - 0.09, 0.62]];
      if (sv) { g.fillStyle = "rgba(40,24,18,0.3)"; g.beginPath(); g.moveTo(x - 0.1, 0.2); g.lineTo(x + 0.1, 0.2); g.lineTo(x + 0.1 + sv[0] * 0.5, 0.62 + sv[1] * 0.2); g.lineTo(x - 0.1 + sv[0] * 0.5, 0.62 + sv[1] * 0.2); g.fill(); }
      g.fillStyle = L(hell(HOLZ, 0.1)); poly(g, p); g.fill();
      g.fillStyle = L(hell(HOLZ, -0.25)); g.beginPath(); g.moveTo(x + 0.03, 0.22); g.quadraticCurveTo(x + 0.09, 0.42, x + 0.03, 0.6); g.lineTo(x + 0.09, 0.6); g.lineTo(x + 0.09, 0.22); g.fill();
      if (F.px > 30) { g.strokeStyle = L(hell(HOLZ, -0.4)); g.lineWidth = 0.008; for (let y = 0.28; y < 0.6; y += 0.08) { g.beginPath(); g.moveTo(x - 0.08, y); g.lineTo(x + 0.08, y + 0.02); g.stroke(); } }
    }
  }
  /* Balkenköpfe mit Füllhölzern zwischen den Geschossen (vorn) */
  function balkenBandBauen(M, S, Z) {
    if (Z.og1.holz < 1) return;
    fassadenTeil(M, "band2", [0, 1, 0], [0, (Y1 + Y2) / 2, 6.75]);
    const mal = (g, F) => {
      const w = F.w, h = F.h;
      const roh = Z.og1.fach < 1;
      const L = roh ? Lm(F) : L0;
      g.fillStyle = L(hell(HOLZ, -0.1)); g.fillRect(-0.02, -0.02, w + 0.04, h + 0.04);
      /* Füllholz mit Schiffskehle und Taustab */
      g.fillStyle = L(hell(HOLZ, 0.08)); g.fillRect(0, h * 0.18, w, h * 0.22);
      g.fillStyle = L(hell(HOLZ, -0.35)); g.fillRect(0, h * 0.4, w, h * 0.12);
      if (F.px > 20) { g.strokeStyle = L(hell(HOLZ, -0.45)); g.lineWidth = 0.012; g.beginPath(); for (let x = 0; x < w; x += 0.06) { g.moveTo(x, h * 0.2); g.lineTo(x + 0.04, h * 0.38); } g.stroke(); }
      /* Balkenköpfe */
      for (let x = 0.3; x < w - 0.1; x += 0.9) {
        g.fillStyle = L(hell(HOLZ, 0.12)); g.fillRect(x - 0.1, h * 0.52, 0.2, h * 0.48);
        if (F.px > 16) { g.strokeStyle = L(hell(HOLZ, -0.2)); g.lineWidth = 0.008; for (let r = 0.03; r < 0.1; r += 0.025) { g.beginPath(); g.arc(x, h * 0.76, r, 0, TAU); g.stroke(); } }
      }
      if (S.winter) schneeKappe(g, F, 0, 0.005, w, 0.05, 3);
    };
    const mt = (g, F) => { g.fillStyle = rgb(hell(HOLZ, -0.1)); g.fillRect(-0.02, -0.02, F.w + 0.04, F.h + 0.04); if (S.winter) { g.fillStyle = "rgb(242,246,252)"; g.fillRect(-0.02, -0.02, F.w + 0.04, F.h + 0.04); } };
    kiste(M, "band2a", X0, Y1, ZB, EX0, Y2, Z2, { s: mal, w: mal, o: mal, t: mt });
    kiste(M, "band2b", EX1, Y1, ZB, X1, Y2, Z2, { s: mal, o: mal, w: mal, t: mt });
  }

  /* ---------------- Erker ---------------- */
  function erkerBauen(M, B, S, Z) {
    const st = Z.erker;
    /* Kragsteine unter dem Erker wachsen mit dem Erdgeschoss */
    const kr = [[3.9, 5.15, YE + 0.3, 2.45, 2.8], [3.8, 5.25, YE + 0.65, 2.8, 3.1], [3.72, 5.33, EY1 - 0.05, 3.1, 3.3]];
    fassadenTeil(M, "erker-krag", [0, 1, 0], [4.5, 3.8, 2.8]);
    for (const [xa, xb, yb, za, zb] of kr) {
      if (Z.egZ < za + 0.02 && Z.egZ < ZE - 0.01) continue;
      const m = (g, F) => {
        const w = F.w, h = F.h;
        g.fillStyle = rgb(SANDSTEIN_H); g.fillRect(-0.02, -0.02, w + 0.04, h + 0.04);
        const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, rgb(hell(SANDSTEIN_H, 0.12))); gr.addColorStop(1, rgb(hell(SANDSTEIN_H, -0.3)));
        g.fillStyle = gr; g.fillRect(0, h * 0.15, w, h * 0.85);
        if (F.px > 8) rausch(g, 0, 0, w, h, 0.6, 0.2, 81, 2);
      };
      kiste(M, "ek" + za, xa, YE, za, xb, yb, zb, { s: m, o: m, w: m });
    }
    if (st.holz <= 0) return;
    const voll = st.fach >= 1;
    const ex = (name, extra) => Object.assign({ name: name, keinAo: true }, voll ? {} : { keinLicht: true, beidseitig: true }, extra || {});
    const H = EZ1 - EZ0;
    /* Pläne: b = 0 in 9,6 m */
    const bz = (z) => EZ1 - z;
    const plan = (W, n) => {
      const P = new Plan(W, H);
      P.s(0, 0.1, W, 0.1, 0.2, "rahm");
      P.s(0, bz(Z2) - 0.1, W, bz(Z2) - 0.1, 0.2, "schwelle"); P.s(0, bz(ZB) + 0.1, W, bz(ZB) + 0.1, 0.2, "rahm");
      P.s(0, H - 0.8, W, H - 0.8, 0.2, "schwelle");
      P.s(0.1, 0.2, 0.1, H - 0.7, 0.2, "staender"); P.s(W - 0.1, 0.2, W - 0.1, H - 0.7, 0.2, "staender");
      const fw = n === 2 ? 0.52 : 0.46;
      const xs = n === 2 ? [W / 2 - 0.09 - fw, W / 2 + 0.09] : [(W - fw) / 2];
      if (n === 2) P.s(W / 2, 0.2, W / 2, H - 0.7, 0.18, "staender");
      for (const [z0, z1, zb] of [[Z2 + 0.2, ZT - 0.55, Z2], [ZE + 0.62, ZB - 0.12, ZE]]) {
        for (const x of xs) P.fenster(x, bz(z1), fw, z1 - z0, { kasten: null });
        P.s(0.2, bz(z0) + 0.07, W - 0.2, bz(z0) + 0.07, 0.14, "riegel");
        for (const x of xs) brust(P, n === 2 ? "feuerbock" : "raute", x, x + fw, bz(z0) + 0.14, bz(zb) - 0.2, 0.08);
        if (n === 1) for (const x of [0.2, W - 0.2]) void x;
      }
      if (n === 1) for (const zb of [Z2, ZE]) { P.s(0.2, bz(zb + 1.5), xs[0] - 0.04, bz(zb + 1.5), 0.1, "riegel"); P.s(xs[0] + fw + 0.04, bz(zb + 1.5), W - 0.2, bz(zb + 1.5), 0.1, "riegel"); }
      P.zier("bohle", 0.2, H - 0.7, W - 0.2, H);
      return P;
    };
    const Ps = plan(EX1 - EX0, 2), Po = plan(EY1 - EY0, 1);
    const danachS = (g, F, L) => {
      /* Brüstungsbohle mit Inschrift */
      const w = F.w, h = F.h;
      g.fillStyle = L(hell(HOLZ, 0.1)); g.fillRect(0.2, h - 0.7, w - 0.4, 0.62);
      g.fillStyle = L(hell(HOLZ, -0.3)); g.fillRect(0.2, h - 0.12, w - 0.4, 0.04);
      if (F.px > 18) {
        g.fillStyle = L(GOLD); g.font = "bold 0.17px serif"; g.textAlign = "center"; g.textBaseline = "middle";
        g.fillText("ANNO", w / 2, h - 0.52); g.fillText("1579", w / 2, h - 0.3);
      }
      g.strokeStyle = L(hell(HOLZ, -0.35)); g.lineWidth = 0.015; g.strokeRect(0.28, h - 0.64, w - 0.56, 0.48);
    };
    const danachO = (g, F, L) => {
      const w = F.w, h = F.h;
      g.fillStyle = L(hell(HOLZ, 0.1)); g.fillRect(0.2, h - 0.7, w - 0.4, 0.62);
      if (F.px > 14) { g.fillStyle = L(hell(HOLZ, -0.2)); g.beginPath(); g.arc(w / 2, h - 0.38, 0.18, 0, TAU); g.fill(); g.fillStyle = L(hell(HOLZ, 0.2)); for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; g.beginPath(); g.ellipse(w / 2 + Math.cos(a) * 0.1, h - 0.38 + Math.sin(a) * 0.1, 0.06, 0.025, a, 0, TAU); g.fill(); } }
    };
    const kasten = S.winter && Z.deko ? "winter" : null;
    if (kasten) for (const f of Ps.f) if (f.y > 2) f.o.kasten = kasten;
    const stE = Object.assign({}, st, { fach: st.fach });
    fassadenTeil(M, "erker", [0, 1, 0], [(EX0 + EX1) / 2, EY1 + 0.6, 6.4], voll ? {} : { schatten: false });
    wand(M, "erker-s", [EX0, EY1], [EX1, EY1], EZ0, EZ1, fwMaler(Ps, stE, { danach: danachS }), ex("erker-s", { leuchten: voll ? fwLeuchten(Ps, stE, { anteil: 0.9 }) : null, traufe: 0.3 }));
    wand(M, "erker-o", [EX1, EY1], [EX1, EY0], EZ0, EZ1, fwMaler(Po, stE, { danach: danachO }), ex("erker-o", { leuchten: voll ? fwLeuchten(Po, stE, { anteil: 0.9 }) : null, traufe: 0.3 }));
    wand(M, "erker-w", [EX0, EY0], [EX0, EY1], EZ0, EZ1, fwMaler(Po, stE, { danach: danachO }), ex("erker-w", { leuchten: voll ? fwLeuchten(Po, stE, { anteil: 0.9 }) : null, traufe: 0.3 }));
    /* Helm */
    if (Z.stuhl > 0) {
      const a = [EX0 - 0.1, EY0 - 0.1, EZ1], b = [EX1 + 0.1, EY0 - 0.1, EZ1], c = [EX1 + 0.1, EY1 + 0.1, EZ1], d = [EX0 - 0.1, EY1 + 0.1, EZ1];
      const sp = [(EX0 + EX1) / 2, (EY0 + EY1) / 2, EHZ];
      const offen = !Z.dachFertig;
      const helm = helmMaler(S, Z, offen, 71);
      const exH = offen ? { keinLicht: true, beidseitig: true } : {};
      vieleck(M, "eh-s", [d, c, sp], [0, 1, 0.4], [1, 0, 0], helm, exH);
      vieleck(M, "eh-o", [c, b, sp], [1, 0, 0.2], [0, -1, 0], helm, exH);
      vieleck(M, "eh-w", [a, d, sp], [-1, 0, 0.2], [0, 1, 0], helm, exH);
      if (!offen) M.figur({ x: sp[0], y: sp[1], z: sp[2] - 0.05, breite: 0.3, hoehe: 0.9, malen: spitzeFigur(0.8, S.winter, false) });
    }
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

  /* ---------------- Dach ---------------- */
  function dachFlaeche(M, B, S, Z, sued) {
    /* Umriss im Grundriss (x, y), dann auf die Dachfläche gehoben */
    const yT = sued ? YTS : YTN;
    let plan;
    if (sued) {
      plan = [[X0, YM], [X1, YM], [X1, yT], [EX1, yT], [EX1, Y2], [EX0, Y2], [EX0, yT], [QB, yT], [QB, kehleY(QB)], [0, kehleY(0)], [-QB, kehleY(QB)], [-QB, yT], [X0, yT]];
    } else plan = [[X1, YM], [X0, YM], [X0, yT], [X1, yT]];
    const pts = plan.map(([x, y]) => [x, y, dachZ(y)]);
    const n = sued ? [0, SN, CN] : [0, -SN, CN];
    const offen = !Z.dachFertig;
    const extra = offen ? { keinLicht: true, beidseitig: true } : {};
    M.teil(sued ? "dach-s" : "dach-n", { mitte: [0, sued ? YM + 2.2 : YM - 2.2, ZF - 2.5] });
    const mal = dachMaler({ offen: offen, sparren: Z.stuhl, latten: Z.latten, ziegel: offen ? Z.ziegel : 1, schnee: S.winter ? Z.schnee : 0, jahr: S.jahr, saat: sued ? 11 : 13 });
    vieleck(M, sued ? "dach-s" : "dach-n", pts, n, sued ? [1, 0, 0] : [-1, 0, 0], mal, extra);
    if (offen && Z.ziegel <= 0) return;
    /* Traufbrett mit Rinne; Eiszapfen darunter */
    const segs = sued ? [[X0, -QB], [QB, EX0], [EX1, X1]] : [[X0, X1]];
    for (const [xa, xb] of segs) {
      const p0 = sued ? [xa, yT] : [xb, yT], p1 = sued ? [xb, yT] : [xa, yT];
      wand(M, "traufe" + xa, p0, p1, ZTR - 0.22, ZTR, rinneMaler(S, Z, offen), { keinAo: true });
      if (S.winter && Z.schnee > 0.6 && !offen) wand(M, "eis" + xa, p0, p1, ZTR - 0.8, ZTR - 0.22, eisMaler(xa), { keinAo: true, keinLicht: true });
    }
    /* Stirnseiten an den Ausschnitten (Zwerchhaus) */
    if (sued) for (const sx of [-1, 1]) {
      const x = sx * QB, ya = kehleY(QB), yb = YTS;
      const p = [[x, ya, dachZ(ya)], [x, yb, dachZ(yb)], [x, yb, dachZ(yb) - 0.22], [x, ya, dachZ(ya) - 0.22]];
      vieleck(M, "stirn" + sx, p, [-sx, 0, 0], [0, sx, 0], "#6a3624", {});
    }
  }
  function rinneMaler(S, Z, offen) {
    return function (g, F) {
      const w = F.w, h = F.h;
      const L = L0;
      g.fillStyle = L([96, 58, 40]); g.fillRect(-0.02, 0, w + 0.04, h);
      if (offen) return;
      /* Kupferrinne, patiniert */
      const gr = g.createLinearGradient(0, h * 0.3, 0, h);
      gr.addColorStop(0, rgb([150, 110, 80])); gr.addColorStop(0.5, rgb([112, 128, 108])); gr.addColorStop(1, rgb([70, 80, 70]));
      g.fillStyle = gr; g.fillRect(-0.02, h * 0.35, w + 0.04, h * 0.65);
      if (S.winter && Z.schnee > 0.3) { g.fillStyle = "rgb(244,247,252)"; g.beginPath(); g.moveTo(-0.02, h * 0.5); for (let x = 0; x <= w + 0.02; x += 0.25) g.lineTo(x, h * 0.12 - 0.05 * Math.sin(x * 2.7)); g.lineTo(w + 0.02, h * 0.5); g.fill(); }
      if (S.jahr === "herbst") laub(g, F, 0, 0, w, h * 0.4, 30, 5);
    };
  }
  function eisMaler(saat) {
    return function (g, F) {
      const L = Lm(F);
      eiszapfen(g, F, 0.1, F.w - 0.1, 0, 0.45, (saat * 100) | 0 + 17, L);
    };
  }
  /* Giebeldreiecke Ost/West (Fachwerk) */
  function giebelBauen(M, B, S, Z) {
    if (Z.stuhl <= 0) return;
    const W = Y2 - YN, H = ZF - 0.2 - ZT;
    const P = new Plan(W, H);
    const yK = H - 2.3;                           // Kehlbalkenlage
    P.s(0, H - 0.11, W, H - 0.11, 0.22, "schwelle");
    P.s(0, yK, W, yK, 0.2, "rahm");
    const xs = [0.9, 2.2, 3.9, 5.6, 6.9];
    for (const x of xs) P.s(x, H - 0.2, x, yK, 0.18, "staender");
    for (const x of [1.4, 3.0, 4.8, 6.4]) P.s(x, yK - 0.1, x, yK - 1.5, 0.16, "staender");
    P.fenster(2.5, H - 1.95, 0.7, 1.15, {}); P.fenster(4.6, H - 1.95, 0.7, 1.15, {});
    P.fenster(3.55, yK - 1.25, 0.7, 0.95, {});
    P.s(2.3, H - 0.7, 3.4, H - 0.7, 0.12, "riegel"); P.s(4.4, H - 0.7, 5.5, H - 0.7, 0.12, "riegel");
    P.s(0.1, H - 0.2, 0.9, yK + 0.1, 0.16, "strebe"); P.s(W - 0.1, H - 0.2, W - 0.9, yK + 0.1, 0.16, "strebe");
    brust(P, "raute", 2.5, 3.2, H - 0.65, H - 0.25, 0.08); brust(P, "raute", 4.6, 5.3, H - 0.65, H - 0.25, 0.08);
    /* Ortbalken entlang der Dachschrägen */
    P.s(0, H, W / 2, 0, 0.22, "rahm"); P.s(W / 2, 0, W, H, 0.22, "rahm");
    const um = [[0, H], [W / 2, 0], [W, H]];
    const st = { holz: Z.stuhl, fach: Z.dachFertig ? 1 : phase(Z.bau, 0.82, 0.88), fenster: Z.fenster };
    const voll = st.fach >= 1;
    const ex = Object.assign({ keinAo: true, umriss: um }, voll ? {} : { keinLicht: true, beidseitig: true });
    for (const sx of [1, -1]) {
      M.teil("giebel" + sx, { mitte: [sx * (X1 + AUSSEN * 0.99), YM, ZT + 1.5], schatten: voll });
      const o = sx > 0 ? [X1, Y2, ZF - 0.2] : [X0, YN, ZF - 0.2];
      const u = sx > 0 ? [0, -1, 0] : [0, 1, 0];
      M.flaeche(Object.assign({ name: "giebel" + sx, o: o, u: u, v: [0, 0, -1], w: W, h: H, malen: fwMaler(P, st, {}), leuchten: voll ? fwLeuchten(P, st, { anteil: 0.5 }) : null }, ex));
    }
  }
  /* Ortgang-Überstände an den Giebeln (eigene Teile: vor dem Giebel) */
  function ortgangBauen(M, S, Z) {
    if (!Z.dachFertig && Z.ziegel <= 0) return;
    for (const sx of [1, -1]) {
      const xa = sx > 0 ? X1 : X0 - UEG, xb = sx > 0 ? X1 + UEG : X0;
      const xe = sx > 0 ? xb : xa;
      /* je Dachseite ein Teil: die nördliche Hälfte liegt, von Süden gesehen,
         hinter dem First und wird vor der Südfläche gemalt */
      for (const sued of [true, false]) {
        M.teil("ort" + sx + sued, { mitte: [sx * (X1 + AUSSEN), YM + (sued ? 30 : -30), ZF - 2] });
        const yT = sued ? YTS : YTN;
        const pts = [[xa, YM, ZF], [xb, YM, ZF], [xb, yT, dachZ(yT)], [xa, yT, dachZ(yT)]];
        const mal = dachMaler({ offen: false, ziegel: 1, schnee: S.winter ? Z.schnee : 0, jahr: S.jahr, saat: 21 + (sued ? 1 : 0) });
        vieleck(M, "ort" + sx + sued, pts, sued ? [0, SN, CN] : [0, -SN, CN], sued ? [1, 0, 0] : [-1, 0, 0], mal, {});
        /* Windbrett */
        const d = 0.24;
        const wp = [[xe, yT, dachZ(yT)], [xe, YM, ZF], [xe, YM, ZF - d / CN], [xe, yT, dachZ(yT) - d]];
        vieleck(M, "wind" + sx + sued, wp, [sx, 0, 0], [0, -sx, 0], (g, F) => {
          g.fillStyle = rgb([92, 46, 32]); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
          if (S.winter && Z.schnee > 0.3) { g.strokeStyle = "rgb(244,247,252)"; g.lineWidth = 0.08; const u = F.flaeche.umriss; g.beginPath(); g.moveTo(u[0][0], u[0][1] - 0.02); g.lineTo(u[1][0], u[1][1] - 0.02); g.stroke(); }
        }, {});
      }
    }
  }

  /* ---------------- Zwerchhaus mit Treppengiebel ---------------- */
  function stufenUmriss() {
    const p = [[-QB, ZT]];
    for (let i = 0; i < STUFEN.length; i++) { const [x, z] = STUFEN[i]; p.push([-x, i ? STUFEN[i - 1][1] : z]); p.push([-x, z]); }
    for (let i = STUFEN.length - 1; i >= 0; i--) { const [x, z] = STUFEN[i]; p.push([x, z]); p.push([x, i ? STUFEN[i - 1][1] : z]); }
    p.push([QB, ZT]);
    /* doppelte Punkte am Fuß entfernen */
    return p.filter((q, i) => i === 0 || Math.abs(q[0] - p[i - 1][0]) + Math.abs(q[1] - p[i - 1][1]) > 1e-6);
  }
  function zwerchBauen(M, B, S, Z) {
    if (Z.giebelZ <= 0) return;
    const zTop = ZT + (QZTOP - ZT) * Z.giebelZ;
    const U = stufenUmriss().map(([x, z]) => [x, Math.min(z, zTop)]);
    const fertig = Z.giebelZ >= 1;
    /* Zwerchdach (Dreiecke hinter dem Giebel) */
    if (Z.stuhl > 0) {
      M.teil("zwerchdach", { mitte: [0, AUSSEN + 2.6, 20] });
      const xk = QY0 - kehleY(0);
      const offen = !Z.dachFertig;
      const mal = dachMaler({ offen: offen, sparren: Z.stuhl, latten: Z.latten, ziegel: offen ? Z.ziegel : 1, schnee: S.winter ? Z.schnee : 0, jahr: S.jahr, saat: 31 });
      for (const sx of [-1, 1]) {
        const pts = [[0, QY0, QZF], [sx * xk, QY0, QZF - xk * TN], [0, kehleY(0), QZF]];
        vieleck(M, "zd" + sx, pts, [sx * SN, 0, CN], [0, -sx, 0], mal, offen ? { keinLicht: true, beidseitig: true } : {});
      }
    }
    M.teil("treppengiebel", { mitte: [0, AUSSEN + QY1 + 1, 20] });
    const bz = (z) => QZTOP - z;
    const frontMal = (g, F) => {
      const w = F.w, h = F.h, L = L0;
      g.save(); g.translate(QB, 0);                     // a = x + QB
      putz(g, F, L, -QB - 0.1, -0.1, 2 * QB + 0.2, h + 0.2, PUTZ_G, 41);
      /* Eckquader */
      for (let z = ZT, i = 0; z < QZTOP; z += 0.36, i++) {
        const bw = i % 2 ? 0.28 : 0.44;
        for (const sx of [-1, 1]) {
          const xr = sx < 0 ? -QB : QB - bw;
          if (z + 0.34 > (sx < 0 ? 99 : 99)) void 0;
          g.fillStyle = L(PI.streu(SANDSTEIN_H, zufall(i * 3 + sx + 5), 0.06)); g.fillRect(xr, bz(z + 0.34), bw, 0.34);
        }
      }
      /* Schriftband RATHAUS */
      const sb = [-1.3, bz(9.92), 2.6, 0.36];
      g.fillStyle = L([60, 30, 26]); g.fillRect(sb[0], sb[1], sb[2], sb[3]);
      g.strokeStyle = L(GOLD); g.lineWidth = 0.02; g.strokeRect(sb[0] + 0.03, sb[1] + 0.03, sb[2] - 0.06, sb[3] - 0.06);
      if (F.px > 7) {
        g.fillStyle = L(hell(GOLD, 0.1)); g.font = "bold 0.25px serif"; g.textAlign = "center"; g.textBaseline = "middle";
        g.fillText("RATHAUS", 0, sb[1] + sb[3] / 2 + 0.01);
      }
      /* Zwillingsfenster mit Rundbogen und Säule */
      const fz0 = 10.15, fh = 1.0, fw = 0.5;
      g.fillStyle = L(SANDSTEIN_H); g.fillRect(-fw - 0.22, bz(fz0 + fh + 0.1), 2 * fw + 0.44, fh + 0.22);
      for (const sx of [-1, 1]) {
        const x = sx < 0 ? -fw - 0.07 : 0.07;
        if (Z.fenster) {
          g.save(); g.beginPath(); g.moveTo(x, bz(fz0)); g.lineTo(x, bz(fz0 + fh - fw / 2)); g.arc(x + fw / 2, bz(fz0 + fh - fw / 2), fw / 2, Math.PI, TAU); g.lineTo(x + fw, bz(fz0)); g.closePath(); g.clip();
          fensterK(g, F, x, bz(fz0 + fh), fw, fh, { rahmen: [70, 36, 28], blei: true, bank: false, kreuz: false, winter: S.winter });
          g.restore();
        } else { g.fillStyle = "rgb(40,34,32)"; g.beginPath(); g.moveTo(x, bz(fz0)); g.lineTo(x, bz(fz0 + fh - fw / 2)); g.arc(x + fw / 2, bz(fz0 + fh - fw / 2), fw / 2, Math.PI, TAU); g.lineTo(x + fw, bz(fz0)); g.fill(); }
      }
      g.fillStyle = L(hell(SANDSTEIN_H, 0.1)); g.fillRect(-0.07, bz(fz0 + fh - 0.1), 0.14, fh - 0.1);
      g.fillStyle = L(hell(SANDSTEIN_H, -0.1)); g.fillRect(-fw - 0.3, bz(fz0) - 0.01, 2 * fw + 0.6, 0.08);
      if (S.winter) schneeKappe(g, F, -fw - 0.3, bz(fz0) - 0.005, 2 * fw + 0.6, 0.05, 8);
      /* Ochsenauge */
      const oz = 11.72;
      if (zTop > oz + 0.3) {
        g.fillStyle = L(SANDSTEIN_H); g.beginPath(); g.arc(0, bz(oz), 0.3, 0, TAU); g.fill();
        g.fillStyle = Z.fenster ? L([50, 58, 74]) : "rgb(40,34,32)"; g.beginPath(); g.arc(0, bz(oz), 0.19, 0, TAU); g.fill();
        if (Z.fenster && F.px > 12) { g.strokeStyle = L([70, 36, 28]); g.lineWidth = 0.03; g.beginPath(); g.moveTo(-0.19, bz(oz)); g.lineTo(0.19, bz(oz)); g.moveTo(0, bz(oz) - 0.19); g.lineTo(0, bz(oz) + 0.19); g.stroke(); }
      }
      /* Gesims auf jeder Stufe (Abdeckplatten) */
      for (let i = 0; i < STUFEN.length; i++) {
        const [x, z] = STUFEN[i], xi = i < STUFEN.length - 1 ? STUFEN[i + 1][0] : -x;
        if (z > zTop + 0.01) continue;
        for (const sx of i < STUFEN.length - 1 ? [-1, 1] : [1]) {
          const xa = i < STUFEN.length - 1 ? (sx < 0 ? -x : xi) : -x, xb = i < STUFEN.length - 1 ? (sx < 0 ? -xi : x) : x;
          g.fillStyle = L(hell(SANDSTEIN_H, 0.12)); g.fillRect(xa - 0.02, bz(z), xb - xa + 0.04, 0.06);
          g.fillStyle = L(hell(SANDSTEIN_H, -0.25)); g.fillRect(xa - 0.02, bz(z) + 0.06, xb - xa + 0.04, 0.05);
          if (S.winter) schneeKappe(g, F, xa - 0.02, bz(z) + 0.01, xb - xa + 0.04, 0.07, i * 7 + sx);
        }
      }
      /* Schatten der Stufen auf die Wand fehlt bewusst (die Stufen sind bündig) */
      if (!fertig) { g.fillStyle = "rgba(255,240,220,0.3)"; g.fillRect(-QB, bz(zTop), 2 * QB, 0.3); }
      g.restore();
    };
    const frontLeuchten = (g, F) => {
      if (!Z.fenster) return;
      g.translate(QB, 0);
      const fz0 = 10.15, fh = 1.0, fw = 0.5;
      for (const sx of [-1, 1]) {
        const x = sx < 0 ? -fw - 0.07 : 0.07;
        g.save(); g.beginPath(); g.moveTo(x, bz(fz0)); g.lineTo(x, bz(fz0 + fh - fw / 2)); g.arc(x + fw / 2, bz(fz0 + fh - fw / 2), fw / 2, Math.PI, TAU); g.lineTo(x + fw, bz(fz0)); g.closePath(); g.clip();
        fensterKLicht(g, F, x, bz(fz0 + fh), fw, fh, { kreuz: false, blei: true }, 1);
        g.restore();
      }
      schein(F, 0, bz(fz0 + fh / 2), 1.4, "255,190,110", 0.4);
    };
    const um = U.map(([x, z]) => [x + QB, QZTOP - z]);
    M.flaeche({ name: "tg-s", o: [-QB, QY1, QZTOP], u: [1, 0, 0], v: [0, 0, -1], w: 2 * QB, h: QZTOP - ZT, umriss: um, malen: frontMal, leuchten: frontLeuchten, keinAo: true });
    /* Rückseite */
    M.flaeche({ name: "tg-n", o: [QB, QY0, QZTOP], u: [-1, 0, 0], v: [0, 0, -1], w: 2 * QB, h: QZTOP - ZT, umriss: U.map(([x, z]) => [QB - x, QZTOP - z]), keinAo: true, malen: (g, F) => { putz(g, F, L0, -0.1, -0.1, F.w + 0.2, F.h + 0.2, PUTZ_G, 43); } });
    /* Stufen: Abdeckplatten oben, Stirnseiten außen */
    const deck = S.winter ? schneeOben(rgb(SANDSTEIN_H)) : (g, F) => { g.fillStyle = rgb(hell(SANDSTEIN_H, 0.1)); g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1); if (F.px > 10) rausch(g, 0, 0, F.w, F.h, 0.5, 0.2, 5, 2); };
    const seite = (g, F) => { putz(g, F, L0, -0.1, -0.1, F.w + 0.2, F.h + 0.2, PUTZ_G, 45); g.fillStyle = rgb(hell(SANDSTEIN_H, 0.05)); g.fillRect(-0.1, -0.1, F.w + 0.2, 0.2); };
    for (let i = 0; i < STUFEN.length; i++) {
      const [x, z] = STUFEN[i];
      if (z > zTop + 0.01) break;
      const xi = i < STUFEN.length - 1 ? STUFEN[i + 1][0] : 0;
      for (const sx of [-1, 1]) {
        const xa = sx < 0 ? -x - 0.03 : xi, xb = sx < 0 ? -xi : x + 0.03;
        if (i === STUFEN.length - 1 && sx > 0) continue;
        const xa2 = i === STUFEN.length - 1 ? -x - 0.03 : xa, xb2 = i === STUFEN.length - 1 ? x + 0.03 : xb;
        M.flaeche({ name: "tg-d" + i + sx, o: [xa2, QY0 - 0.03, z], u: [1, 0, 0], v: [0, 1, 0], w: xb2 - xa2, h: QY1 - QY0 + 0.06, malen: deck, keinAo: true });
      }
      /* Stirnseite der Stufe außen (senkrecht) */
      const zU = i ? STUFEN[i - 1][1] : null;
      for (const sx of [-1, 1]) {
        const xf = sx * x;
        if (i === 0) {
          /* unterste Stufe: bis auf das Hauptdach */
          const pts = [[xf, QY0, z], [xf, QY1, z], [xf, QY1, dachZ(QY1)], [xf, QY0, dachZ(QY0)]];
          vieleck(M, "tg-a" + sx, pts, [sx, 0, 0], [0, -sx, 0], seite, {});
        } else {
          const zu = Math.max(zU, QZF - Math.abs(xf) * TN);
          if (z - zu > 0.01) vieleck(M, "tg-a" + i + sx, [[xf, QY0, z], [xf, QY1, z], [xf, QY1, zu], [xf, QY0, zu]], [sx, 0, 0], [0, -sx, 0], seite, {});
        }
      }
    }
    /* Obelisken mit Kugeln auf den Stufen */
    if (fertig) {
      for (let i = 0; i < STUFEN.length; i++) {
        const [x, z] = STUFEN[i];
        for (const sx of [-1, 1]) M.figur({ x: sx * (x - 0.08), y: (QY0 + QY1) / 2, z: z, breite: 0.25, hoehe: 0.55, malen: obeliskFigur(0.5, S.winter) });
      }
      M.figur({ x: 0, y: (QY0 + QY1) / 2, z: QZTOP, breite: 0.35, hoehe: 0.95, malen: obeliskFigur(0.85, S.winter) });
    }
  }
  function obeliskFigur(hoehe, winter) {
    return function (g, s, F) {
      const h = hoehe * s * ST.KZ, b = hoehe * s * 0.16;
      const form = () => {
        g.beginPath();
        g.moveTo(-b * 0.9, 0); g.lineTo(b * 0.9, 0); g.lineTo(b * 0.9, -h * 0.14); g.lineTo(b * 0.6, -h * 0.16);
        g.lineTo(b * 0.28, -h * 0.72); g.lineTo(-b * 0.28, -h * 0.72); g.lineTo(-b * 0.6, -h * 0.16); g.lineTo(-b * 0.9, -h * 0.14); g.closePath();
        g.moveTo(b * 0.42, -h * 0.84); g.arc(0, -h * 0.84, b * 0.42, 0, TAU);
      };
      if (F.schatten) { form(); g.fillStyle = "#000"; g.fill(); return; }
      const lf = ST.lichtFaktor([0, 0.6, 0.8], F.Z, 0, F.jahr), lf2 = ST.lichtFaktor([0.7, 0, 0.7], F.Z, 0, F.jahr);
      const L = (c, l) => rgb([c[0] * l[0], c[1] * l[1], c[2] * l[2]]);
      form(); g.fillStyle = L(SANDSTEIN_H, lf); g.fill();
      /* Schattenseite rechts */
      g.fillStyle = L(hell(SANDSTEIN_H, -0.2), lf2);
      g.beginPath(); g.moveTo(0, 0); g.lineTo(b * 0.9, 0); g.lineTo(b * 0.9, -h * 0.14); g.lineTo(b * 0.6, -h * 0.16); g.lineTo(b * 0.28, -h * 0.72); g.lineTo(0, -h * 0.72); g.closePath(); g.fill();
      const gr = g.createRadialGradient(-b * 0.15, -h * 0.88, 0, 0, -h * 0.84, b * 0.42);
      gr.addColorStop(0, L(hell(SANDSTEIN_H, 0.3), lf)); gr.addColorStop(1, L(hell(SANDSTEIN_H, -0.3), lf));
      g.fillStyle = gr; g.beginPath(); g.arc(0, -h * 0.84, b * 0.42, 0, TAU); g.fill();
      if (winter) { g.fillStyle = L([246, 249, 253], lf); g.beginPath(); g.ellipse(0, -h * 0.84 - b * 0.3, b * 0.34, b * 0.16, 0, 0, TAU); g.fill(); g.fillRect(-b * 0.9, -h * 0.16, b * 1.8, h * 0.03); }
    };
  }

  /* ---------------- Dachreiter mit Uhr ---------------- */
  function reiterBauen(M, B, S, Z) {
    if (Z.reiter <= 0) return;
    const gerippe = Z.reiter < 2;
    const exG = gerippe ? { keinLicht: true, beidseitig: true } : {};
    M.teil("reiter", { ebene: 5, mitte: [0, YM, 14.3] });
    /* Unterbau: Schiefer, vier Zifferblätter */
    const wandMal = (mitUhr) => (g, F) => {
      const w = F.w, h = F.h;
      if (gerippe) {
        const L = Lm(F);
        g.fillStyle = L(HOLZ_ROH);
        g.fillRect(0, 0, 0.14, h); g.fillRect(w - 0.14, 0, 0.14, h); g.fillRect(0, 0, w, 0.14); g.fillRect(w / 2 - 0.07, 0, 0.14, h);
        g.strokeStyle = L(HOLZ_ROH); g.lineWidth = 0.1; g.beginPath(); g.moveTo(0.1, h); g.lineTo(w / 2, 0.3); g.lineTo(w - 0.1, h); g.stroke();
        return;
      }
      schuppen(g, F, L0, -0.05, -0.05, w + 0.1, h + 0.1, SCHIEFER, 91 + (F.name.length % 5), 0.09);
      /* Eckbretter */
      g.fillStyle = rgb([230, 222, 204]); g.fillRect(0, 0, 0.06, h); g.fillRect(w - 0.06, 0, 0.06, h);
      if (mitUhr && Z.uhr) {
        const cy = RZ1 - UHR_Z;
        g.fillStyle = "rgba(20,20,30,0.3)"; g.beginPath(); g.arc(w / 2 + 0.03, cy + 0.04, UHR_R * 1.16, 0, TAU); g.fill();
        uhrMalen(g, F, w / 2, cy, UHR_R, false);
      }
    };
    const leucht = (g, F) => {
      if (!Z.uhr || gerippe) return;
      const cy = RZ1 - UHR_Z;
      uhrMalen(g, F, F.w / 2, cy, UHR_R, true);
      /* nur das Blatt leuchtet, der Ring bleibt dunkel */
      schein(F, F.w / 2, cy, 1.1, "255,226,160", 0.55);
    };
    const zS = dachZ(RY1);
    wand(M, "r-s", [-RX, RY1], [RX, RY1], zS, RZ1, wandMal(true), Object.assign({ leuchten: leucht, keinAo: true }, exG));
    wand(M, "r-n", [RX, RY0], [-RX, RY0], zS, RZ1, wandMal(true), Object.assign({ leuchten: leucht, keinAo: true }, exG));
    for (const sx of [-1, 1]) {
      const x = sx * RX;
      const pts = [[x, RY1, RZ1], [x, RY0, RZ1], [x, RY0, zS], [x, YM, ZF], [x, RY1, zS]];
      vieleck(M, "r-" + sx, sx > 0 ? pts : pts.slice().reverse(), [sx, 0, 0], [0, -sx, 0], wandMal(true), Object.assign({ leuchten: leucht }, exG));
    }
    if (gerippe) return;
    /* Gesims */
    M.teil("reiter-gesims", { ebene: 5, mitte: [0, YM, RZ1 + 0.07] });
    const gs = (g, F) => { g.fillStyle = rgb([226, 216, 196]); g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1); g.fillStyle = rgb([150, 140, 124]); g.fillRect(-0.05, F.h * 0.6, F.w + 0.1, F.h * 0.4); };
    kiste(M, "rg", -RX - 0.1, RY0 - 0.1, RZ1, RX + 0.1, RY1 + 0.1, RZ1 + 0.15, { s: gs, n: gs, o: gs, w: gs, t: S.winter ? schneeOben("#e8e0d0") : "#d8cdb6" });
    /* Glockenstube mit Schallarkaden */
    const zg0 = RZ1 + 0.15, zg1 = zg0 + 0.85, gx = 0.6;
    M.teil("reiter-stube", { ebene: 5, mitte: [0, YM, zg0 + 0.4] });
    const stube = (g, F) => {
      const w = F.w, h = F.h;
      g.fillStyle = rgb([220, 208, 186]); g.fillRect(-0.05, -0.05, w + 0.1, h + 0.1);
      if (F.px > 8) rausch(g, 0, 0, w, h, 0.8, 0.15, 3, 2);
      const n = 2, bw = (w - 0.3) / n - 0.1;
      for (let i = 0; i < n; i++) {
        const x = 0.15 + i * (bw + 0.1) + 0.05, y0 = 0.15, y1 = h - 0.12;
        g.fillStyle = "rgb(30,26,26)"; g.beginPath(); g.moveTo(x, y1); g.lineTo(x, y0 + bw / 2); g.arc(x + bw / 2, y0 + bw / 2, bw / 2, Math.PI, TAU); g.lineTo(x + bw, y1); g.fill();
        if (F.px > 10) { g.fillStyle = rgb([96, 70, 52]); for (let y = y0 + bw / 2; y < y1 - 0.03; y += 0.09) g.fillRect(x + 0.02, y, bw - 0.04, 0.045); }
      }
      g.fillStyle = rgb([176, 164, 144]); g.fillRect(-0.05, h - 0.06, w + 0.1, 0.06);
    };
    kiste(M, "rs", -gx, YM - gx, zg0, gx, YM + gx, zg1, { s: stube, n: stube, o: stube, w: stube });
    /* Helm: Welsche Spitze (Pyramide über geschweiftem Fuß) */
    const zh0 = zg1, zh1 = zh0 + 0.45, zsp = zh0 + 1.55;
    M.teil("reiter-helm", { ebene: 5, mitte: [0, YM, zh0 + 0.6] });
    const helm = helmMaler(S, Z, false, 97);
    const r0 = gx + 0.12, r1 = gx * 0.55;
    const ring = (r, z) => [[-r, YM - r, z], [r, YM - r, z], [r, YM + r, z], [-r, YM + r, z]];
    const A = ring(r0, zh0), Bq = ring(r1, zh1), top = [0, YM, zsp];
    const seiten = [[3, 2, [0, 1, 0], [1, 0, 0]], [2, 1, [1, 0, 0], [0, -1, 0]], [1, 0, [0, -1, 0], [-1, 0, 0]], [0, 3, [-1, 0, 0], [0, 1, 0]]];
    for (const [i, j, n, u] of seiten) {
      vieleck(M, "rh-u" + i, [A[i], A[j], Bq[j], Bq[i]], [n[0], n[1], 0.9], u, helm, {});
      vieleck(M, "rh-o" + i, [Bq[i], Bq[j], top], [n[0], n[1], 0.25], u, helm, {});
    }
    M.figur({ x: 0, y: YM, z: zsp - 0.05, breite: 0.8, hoehe: 1.0, malen: spitzeFigur(0.95, S.winter, true) });
  }
  /* Kamin auf dem First */
  function kaminBauen(M, S, Z) {
    if (Z.kamin <= 0) return;
    const zTop = ZF - 0.4 + (KZ1 - ZF + 0.4) * Z.kamin;
    M.teil("kamin", { ebene: 5, mitte: [(KX0 + KX1) / 2, YM, zTop - 0.5] });
    const mal = (g, F) => {
      const w = F.w, h = F.h;
      g.fillStyle = rgb([120, 60, 44]); g.fillRect(-0.05, -0.05, w + 0.1, h + 0.1);
      if (F.px > 10) {
        for (let y = 0, r = 0; y < h; y += 0.075, r++) for (let x = -(r % 2) * 0.12; x < w; x += 0.24) { g.fillStyle = rgb(PI.streu([150, 70, 50], zufall(r * 31 + x * 100 + 7), 0.12)); g.fillRect(x + 0.01, y + 0.008, 0.22, 0.06); }
      }
      g.fillStyle = rgb([80, 76, 74]); g.fillRect(-0.05, 0, w + 0.1, 0.1);
      const gr = g.createLinearGradient(0, 0, 0, 0.6); gr.addColorStop(0, "rgba(20,16,14,0.45)"); gr.addColorStop(1, "rgba(20,16,14,0)");
      g.fillStyle = gr; g.fillRect(0, 0.1, w, 0.6);
    };
    const zS = dachZ(KY1);
    wand(M, "k-s", [KX0, KY1], [KX1, KY1], zS, zTop, mal, { keinAo: true });
    wand(M, "k-n", [KX1, KY0], [KX0, KY0], zS, zTop, mal, { keinAo: true });
    for (const sx of [-1, 1]) {
      const x = sx > 0 ? KX1 : KX0;
      const pts = [[x, KY1, zTop], [x, KY0, zTop], [x, KY0, zS], [x, YM, ZF], [x, KY1, zS]];
      vieleck(M, "k" + sx, sx > 0 ? pts : pts.slice().reverse(), [sx, 0, 0], [0, -sx, 0], mal, {});
    }
    M.flaeche({ name: "k-t", o: [KX0 - 0.03, KY0 - 0.03, zTop], u: [1, 0, 0], v: [0, 1, 0], w: KX1 - KX0 + 0.06, h: KY1 - KY0 + 0.06, malen: (g, F) => { g.fillStyle = S.winter ? "rgb(240,244,250)" : "rgb(90,86,84)"; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1); g.fillStyle = "rgb(24,20,20)"; g.fillRect(0.12, 0.14, F.w - 0.24, F.h - 0.28); } });
    if (Z.fertig) M.rauchAus((KX0 + KX1) / 2, YM, zTop + 0.1, 0.8);
  }
  /* Richtkrone (Richtfest) */
  function richtBauen(M, S, Z) {
    if (!Z.richt) return;
    M.teil("richt", { ebene: 6, mitte: [2.5, YM, ZF + 1] });
    M.figur({ x: 2.5, y: YM, z: ZF - 0.1, breite: 1.2, hoehe: 1.8, malen(g, s, F) {
      const h = 1.6 * s * ST.KZ;
      if (F.schatten) { g.fillStyle = "#000"; g.fillRect(-s * 0.03, -h, s * 0.06, h); g.beginPath(); g.ellipse(0, -h * 0.75, s * 0.4, h * 0.3, 0, 0, TAU); g.fill(); return; }
      g.fillStyle = "#6a4a2a"; g.fillRect(-s * 0.03, -h, s * 0.06, h);
      const rng = zufall(3);
      for (let i = 0; i < 40; i++) { g.fillStyle = rgb(PI.streu([56, 110, 50], rng, 0.3)); g.beginPath(); g.arc((rng() - 0.5) * s * 0.7, -h * (0.55 + rng() * 0.45), s * 0.08, 0, TAU); g.fill(); }
      const f = ["#c8102e", "#f2c200", "#1e5aa8", "#ffffff", "#2e8b3d"];
      for (let i = 0; i < 6; i++) { g.strokeStyle = f[i % 5]; g.lineWidth = Math.max(1, s * 0.03); g.beginPath(); const x = (i - 2.5) * s * 0.1; g.moveTo(x, -h * 0.55); g.quadraticCurveTo(x + s * 0.12, -h * 0.35, x + s * 0.05, -h * 0.15); g.stroke(); }
    } });
  }

  /* ---------------- Freitreppe, Wangen, Laternen ---------------- */
  function treppeBauen(M, S, Z) {
    if (Z.treppe <= 0) return;
    const n = Math.ceil(TR_N * Z.treppe - 1e-6);
    const winter = S.winter;
    for (let i = 0; i < n; i++) {
      /* Stufe i von oben (an der Wand) nach unten gezählt: jede eine Säule */
      const k = TR_N - 1 - i;
      const y0 = YE + i * TR_A, y1 = y0 + TR_A, zt = TR_H * (TR_N - i);
      void k;
      fassadenTeil(M, "stufe" + i, [0, 1, 0], [0, (y0 + y1) / 2, zt / 2]);
      const stirn = (g, F) => {
        const w = F.w, h = F.h;
        g.fillStyle = rgb(hell(SANDSTEIN, 0.05)); g.fillRect(-0.02, -0.02, w + 0.04, h + 0.04);
        if (F.px > 8) rausch(g, 0, 0, w, h, 0.9, 0.25, 50 + i, 3);
        g.fillStyle = rgb(hell(SANDSTEIN, 0.2)); g.fillRect(0, 0, w, 0.03);
        g.fillStyle = "rgba(40,20,14,0.35)"; for (let y = TR_H; y < h; y += TR_H) g.fillRect(0, y - 0.01, w, 0.012);
      };
      const tritt = (g, F) => {
        const w = F.w, h = F.h;
        g.fillStyle = rgb(hell(SANDSTEIN, 0.12)); g.fillRect(-0.02, -0.02, w + 0.04, h + 0.04);
        if (F.px > 8) rausch(g, 0, 0, w, h, 0.8, 0.22, 60 + i, 3);
        if (F.px > 12) { g.fillStyle = "rgba(60,30,20,0.3)"; for (let x = 0.8; x < w; x += 0.8) g.fillRect(x, 0, 0.012, h); }
        if (winter) {
          schneeFlaeche(g, F, -0.02, -0.02, w + 0.04, h + 0.04, 70 + i);
          /* ausgetretene Mitte */
          const gr = g.createLinearGradient(w * 0.3, 0, w * 0.7, 0);
          gr.addColorStop(0, "rgba(180,160,140,0)"); gr.addColorStop(0.5, "rgba(170,140,120,0.45)"); gr.addColorStop(1, "rgba(180,160,140,0)");
          g.fillStyle = gr; g.fillRect(w * 0.25, 0, w * 0.5, h);
        }
        if (S.jahr === "herbst") laub(g, F, 0, 0, w, h, 14, 80 + i);
      };
      kiste(M, "st" + i, -TR_B, y0, 0, TR_B, y1, zt, { s: stirn, o: stirn, w: stirn, t: tritt }, { ao: true });
    }
    if (!Z.wangen) return;
    /* Wangen: schräge Mauer mit Deckplatte, unten ein Postament */
    for (const sx of [-1, 1]) {
      const xa = sx < 0 ? -TR_B - 0.3 : TR_B, xb = sx < 0 ? -TR_B : TR_B + 0.3;
      const yP = YE + TR_N * TR_A - 0.1;
      fassadenTeil(M, "wange" + sx, [0, 1, 0], [sx * (TR_B + 0.15), YE + 0.6, 0.6]);
      const zO = (y) => Z0 + 0.7 - (y - YE) / (yP - YE) * 0.35;
      const stein = (g, F) => { g.fillStyle = rgb(SANDSTEIN); g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1); if (F.px > 8) rausch(g, 0, 0, F.w, F.h, 0.9, 0.22, 90, 3); g.fillStyle = rgb(hell(SANDSTEIN_H, 0.08)); g.fillRect(-0.05, -0.05, F.w + 0.1, 0.13); };
      const pw = [[YE, 0], [yP, 0], [yP, zO(yP)], [YE, zO(YE)]];
      /* Seitenflächen */
      vieleck(M, "wg-a" + sx, pw.map(([y, z]) => [xa, y, z]), [-1, 0, 0], [0, 1, 0], stein, { ao: true });
      vieleck(M, "wg-b" + sx, pw.map(([y, z]) => [xb, y, z]), [1, 0, 0], [0, -1, 0], stein, { ao: true });
      /* Deckplatte schräg */
      const dz = (y) => zO(y);
      vieleck(M, "wg-t" + sx, [[xa - 0.03, YE, dz(YE)], [xb + 0.03, YE, dz(YE)], [xb + 0.03, yP, dz(yP)], [xa - 0.03, yP, dz(yP)]], [0, 0.3, 1], [1, 0, 0], winter ? schneeOben(rgb(SANDSTEIN_H)) : rgb(hell(SANDSTEIN_H, 0.1)), {});
      /* Postament */
      const pa = xa - 0.05, pb = xb + 0.05, py0 = yP, py1 = yP + 0.4, pz = 1.0;
      fassadenTeil(M, "postament" + sx, [0, 1, 0], [sx * (TR_B + 0.15), py0 + 0.2 + 0.5, pz / 2]);
      const post = (g, F) => { stein(g, F); g.fillStyle = rgb(hell(SANDSTEIN_H, -0.2)); g.fillRect(0.05, 0.2, F.w - 0.1, 0.02); g.fillRect(0.05, F.h - 0.2, F.w - 0.1, 0.02); };
      kiste(M, "pm" + sx, pa, py0, 0, pb, py1, pz, { s: post, o: post, w: post, n: post, t: winter ? schneeOben(rgb(SANDSTEIN_H)) : rgb(hell(SANDSTEIN_H, 0.1)) }, { ao: true });
      if (Z.laternen) {
        const lx = (pa + pb) / 2, ly = (py0 + py1) / 2;
        M.figur({ x: lx, y: ly, z: pz, breite: 0.5, hoehe: 1.0, malen: laterneFigur(winter) });
        M.licht(lx, ly, pz + 0.55, 2.2, "255,200,120", 0.85);
        M.bodenlicht(lx, ly + 0.4, 3.0, "255,196,120", 0.8);
      }
      /* Christbäumchen im Kübel neben der Treppe (Winter) */
      if (winter && Z.deko) {
        const bx = sx * (TR_B + 1.05), by = YE + 0.75;
        fassadenTeil(M, "baeumchen" + sx, [0, 1, 0], [bx, by + 0.3, 0.8]);
        M.figur({ x: bx, y: by, z: 0, breite: 1.0, hoehe: 1.9, malen: baeumchenFigur(sx) });
        M.licht(bx, by, 1.0, 1.2, "255,210,140", 0.35);
      }
    }
  }
  function laterneFigur(winter) {
    return function (g, s, F) {
      const k = s, KZ = ST.KZ;
      const h = 0.78 * k * KZ;
      const pfad = () => {
        g.beginPath();
        g.moveTo(-k * 0.05, 0); g.lineTo(k * 0.05, 0); g.lineTo(k * 0.05, -h * 0.25); g.lineTo(k * 0.13, -h * 0.3); g.lineTo(k * 0.16, -h * 0.72);
        g.lineTo(k * 0.2, -h * 0.76); g.lineTo(0, -h * 0.94); g.lineTo(-k * 0.2, -h * 0.76); g.lineTo(-k * 0.16, -h * 0.72); g.lineTo(-k * 0.13, -h * 0.3); g.lineTo(-k * 0.05, -h * 0.25); g.closePath();
      };
      if (F.schatten) { pfad(); g.fillStyle = "#000"; g.fill(); g.fillRect(-k * 0.015, -h, k * 0.03, h * 0.1); return; }
      const lf = ST.lichtFaktor([0, 0.7, 0.7], F.Z, 0, F.jahr);
      const L = (c, a) => rgb([c[0] * lf[0], c[1] * lf[1], c[2] * lf[2]], a);
      pfad(); g.fillStyle = L([34, 34, 38]); g.fill();
      /* Glas */
      const n = F.nacht || 0;
      g.fillStyle = n > 0.05 ? "rgba(255,226,150," + (0.4 + 0.6 * n) + ")" : L([120, 136, 150]);
      g.beginPath(); g.moveTo(-k * 0.1, -h * 0.33); g.lineTo(k * 0.1, -h * 0.33); g.lineTo(k * 0.125, -h * 0.7); g.lineTo(-k * 0.125, -h * 0.7); g.closePath(); g.fill();
      g.fillStyle = L([34, 34, 38]); g.fillRect(-k * 0.012, -h * 0.7, k * 0.024, h * 0.37);
      g.fillStyle = L([34, 34, 38]); g.fillRect(-k * 0.015, -h, k * 0.03, h * 0.08);
      g.beginPath(); g.arc(0, -h, k * 0.025, 0, TAU); g.fill();
      if (winter) { g.fillStyle = L([244, 247, 252]); g.beginPath(); g.ellipse(0, -h * 0.8, k * 0.17, k * 0.04, 0, Math.PI, TAU); g.fill(); }
      if (n > 0.05) F.leuchtPunkt(0, -h * 0.52, k * 0.6, "255,210,140", 0.9 * n);
    };
  }
  function baeumchenFigur(sx) {
    return function (g, s, F) {
      const k = s, KZ = ST.KZ, h = 1.8 * k * KZ;
      const rng = zufall(sx > 0 ? 11 : 12);
      const form = () => {
        g.beginPath(); g.moveTo(0, -h);
        for (let i = 1; i <= 5; i++) { const y = -h + h * 0.72 * i / 5, b = k * (0.1 + 0.075 * i); g.lineTo(b, y + h * 0.02); g.lineTo(b * 0.6, y); }
        g.lineTo(k * 0.45, -h * 0.26); g.lineTo(-k * 0.45, -h * 0.26);
        for (let i = 5; i >= 1; i--) { const y = -h + h * 0.72 * i / 5, b = k * (0.1 + 0.075 * i); g.lineTo(-b * 0.6, y); g.lineTo(-b, y + h * 0.02); }
        g.closePath();
      };
      if (F.schatten) { form(); g.fillStyle = "#000"; g.fill(); g.fillRect(-k * 0.2, -h * 0.26, k * 0.4, h * 0.26); return; }
      const lf = ST.lichtFaktor([0, 0.7, 0.7], F.Z, 0, F.jahr);
      const L = (c, a) => rgb([c[0] * lf[0], c[1] * lf[1], c[2] * lf[2]], a);
      /* Kübel */
      g.fillStyle = L([96, 58, 36]); g.beginPath(); g.moveTo(-k * 0.2, 0); g.lineTo(k * 0.2, 0); g.lineTo(k * 0.24, -h * 0.26); g.lineTo(-k * 0.24, -h * 0.26); g.fill();
      g.fillStyle = L([40, 40, 44]); g.fillRect(-k * 0.23, -h * 0.08, k * 0.46, k * 0.03); g.fillRect(-k * 0.24, -h * 0.22, k * 0.48, k * 0.03);
      form(); g.fillStyle = L([34, 76, 46]); g.fill();
      g.save(); form(); g.clip();
      g.fillStyle = L([22, 52, 32]); g.fillRect(0, -h, k, h);
      g.fillStyle = L([244, 247, 252], 0.9);
      for (let i = 1; i <= 5; i++) { const y = -h + h * 0.72 * i / 5, b = k * (0.1 + 0.075 * i); g.beginPath(); g.ellipse(-b * 0.2, y - h * 0.03, b * 0.7, k * 0.03, 0, 0, TAU); g.fill(); }
      g.restore();
      /* Kugeln */
      const n = F.nacht || 0;
      for (let i = 0; i < 9; i++) {
        const t = 0.15 + rng() * 0.8, y = -h + h * 0.72 * t, b = k * (0.1 + 0.375 * t) * (rng() - 0.5) * 1.4;
        g.fillStyle = i % 2 ? L([196, 20, 40]) : L([214, 168, 72]); g.beginPath(); g.arc(b, y, k * 0.035, 0, TAU); g.fill();
        if (n > 0.05) { g.fillStyle = "rgba(255,230,160," + n + ")"; g.beginPath(); g.arc(-b * 0.8, y - k * 0.08, k * 0.018, 0, TAU); g.fill(); }
      }
      g.fillStyle = L(GOLD); g.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? k * 0.03 : k * 0.07; g.lineTo(Math.cos(a) * r, -h - k * 0.02 + Math.sin(a) * r); } g.fill();
    };
  }

  /* ---------------- Stadtfahne an schräger Stange ---------------- */
  function fahneBauen(M, S, Z) {
    if (!Z.fahne) return;
    /* Die Stange steht an der Südwestecke schräg nach außen (45°): so sieht
       man das Tuch von vorn und von der Seite breit, nie nur als Strich. */
    const P0 = [X0 + 0.05, Y2 - 0.05, 7.35], P1 = [X0 - 0.6, Y2 + 0.6, 8.65];
    fassadenTeil(M, "fahne", [-0.7, 0.7, 0], [X0 - 0.4, Y2 + 0.4, 8]);
    stab(M, "fstange", P0, P1, 0.05, [236, 232, 224]);
    const d = sub(P1, P0), L = Math.hypot(d[0], d[1], d[2]), U = mul(d, 1 / L);
    const a0 = 0.3, a1 = 0.97, fl = (a1 - a0) * L, fh = 1.25;
    const o = add(P0, mul(d, a0));
    /* Tuch: hängt senkrecht an der Stange */
    const wel = (t) => 0.06 * Math.sin(t * 7.5) + 0.12 * t;
    const um = [];
    for (let t = 0; t <= 1.0001; t += 0.1) um.push([t * fl, 0]);
    for (let t = 1; t >= -0.0001; t -= 0.1) um.push([t * fl, fh + wel(t) - (t > 0.9 ? (t - 0.9) * 0.8 : 0)]);
    M.flaeche({ name: "tuch", o: o, u: U, v: [0, 0, -1], w: fl, h: fh + 0.3, umriss: um, beidseitig: true, keinAo: true, malen: (g, F) => {
      const w = F.w, h = F.h;
      g.fillStyle = rgb(BLAU); g.fillRect(-0.05, -0.05, w + 0.1, h * 0.5);
      g.fillStyle = rgb([244, 244, 240]); g.fillRect(-0.05, fh * 0.5, w + 0.1, h);
      /* Falten */
      for (let x = 0.1; x < w; x += 0.22) { const gr = g.createLinearGradient(x - 0.1, 0, x + 0.1, 0); gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(0.5, "rgba(0,0,20,0.16)"); gr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr; g.fillRect(x - 0.1, 0, 0.2, h); }
      if (F.px > 10) wappenMalen(g, F, w / 2, fh * 0.5, 0.42, L0, { kartusche: false });
    } });
    /* Knauf */
    M.figur({ x: P1[0], y: P1[1], z: P1[2] - 0.05, breite: 0.2, hoehe: 0.2, malen(g, s, F) { if (F.schatten) return; g.fillStyle = rgb(GOLD); g.beginPath(); g.arc(0, 0, s * 0.06, 0, TAU); g.fill(); } });
  }

  /* =====================================================================
     MODELL
     ===================================================================== */
  ST.modell("rathaus", {
    name: "Rathaus", gruppe: "Häuser", grund: [12, 10], hoehe: 17, bauzeit: 20 * 60,
    bauen(M, o) {
      const B = neuerBlick();
      M.teil("blick", { ebene: -90, schatten: false, mitte: [0, 0, 0] });
      M.figur({ x: 0, y: 0, z: 0, breite: 0.01, hoehe: 0.01, schatten: false, malen(g, s, F) { if (!F.schatten && F.gier != null) blickSetzen(B, F.gier); } });
      const bau = o.bau == null ? 1 : klemm(o.bau, 0, 1);
      const Z = zustand(bau);
      const S = { winter: o.jahr === "winter", jahr: o.jahr, saat: o.saat || 7 };
      if (Z.grube) { grubeBauen(M, B, S, Z); if (bau < 0.14 && Z.egZ <= 0) return; }
      erdgeschossBauen(M, B, S, Z);
      gesimsBauen(M, S, Z);
      erkerBauen(M, B, S, Z);
      if (Z.decke1 > 0 && Z.og1.fach < 1) deckeBauen(M, "decke1", Y1, ZE, Z.decke1, S);
      ogBauen(M, B, S, Z, 1);
      balkenBandBauen(M, S, Z);
      if (Z.decke2 > 0 && Z.og2.fach < 1) deckeBauen(M, "decke2", Y2, Z2, Z.decke2, S);
      ogBauen(M, B, S, Z, 2);
      if (Z.og2.fach >= 1 && !Z.dachFertig) deckeBauen(M, "decke3", Y2, ZT, 1, S);
      if (Z.stuhl > 0) { dachFlaeche(M, B, S, Z, true); dachFlaeche(M, B, S, Z, false); }
      giebelBauen(M, B, S, Z);
      ortgangBauen(M, S, Z);
      zwerchBauen(M, B, S, Z);
      reiterBauen(M, B, S, Z);
      kaminBauen(M, S, Z);
      richtBauen(M, S, Z);
      treppeBauen(M, S, Z);
      fahneBauen(M, S, Z);
    }
  });
})();
