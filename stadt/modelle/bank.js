/* =====================================================================
   BAUKASTEN-STADT — DIE PARKBANK (Holzlatten, gusseiserne Wangen)
   ---------------------------------------------------------------------
   XANDER: „Ich möchte einen Liebreiz zur Weihnachtsdeko … dieses
   Weihnachtsdorf … mit Schmücken, mit Schnee … Das möchte ich in
   Perfektion." – „Richtig filigran. Richtig schön ausarbeiten mit
   schönen Texturen." – „Man soll sie in jedem Winkel aufstellen können."

   Die klassische Parkbank aus dem Stadtpark: zwei gusseiserne Wangen
   mit Löwenfuß-Schnecken, geschwungener Rückenlehne und Armlehnen, die
   vorn in einer Volute enden; dazwischen fünf Sitzlatten und drei
   Rückenlatten (je 1,70 m), mit Schlossschrauben befestigt, unter dem
   Sitz eine Zugstange. Auf der mittleren Rückenlatte ein kleines
   Messingschild vom Verschönerungsverein.
   Maße: 1,80 m lang, 0,70 m tief, Sitzhöhe 0,43 m, Lehne bis 0,87 m.
   Vorderseite = +y (wie bei den Häusern: Front zur Straße).

   Varianten (o.saat): Eiche geölt, grün lackiert oder silbergrau
   verwitterte Lärche; Wangen in Tannengrün, Schwarz oder Eisenglimmer.
   Winter: ein dickes Schneekissen auf dem Sitz (manchmal hat jemand
   mit dem Handschuh eine Ecke freigewischt), Schneegrate auf den
   Rückenlatten und Armlehnen.
   Frühling: Kirschblütenblätter auf dem Sitz und im Gras, Grasbüschel
   an den Füßen, ein Löwenzahn.

   WIE ES GEBAUT IST
   Eine Figur, die sich selbst in 3D ausrechnet: Jede Wange ist eine
   ebene Zeichnung (Pfade mit echter Strichbreite in Metern), die mit
   einer affinen Abbildung in ihre Ebene gelegt wird – so verkürzt sie
   sich in jedem Drehwinkel richtig. Die 3,5 cm Gusseisendicke entsteht,
   indem die Wange einige Male hintereinander gemalt wird (hinten dunkel,
   vorn die Sichtfläche). Latten sind Kästen mit Holzmaserung. Den
   Schatten wirft die Figur selbst: dieselben Pfade, flach auf den Boden
   gelegt – mit allen Löchern der Wangen.
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT, PI = ST.pinsel;
  const KX = ST.KX, KY = ST.KY, KZ = ST.KZ, LICHT = ST.LICHT, AUGE = ST.ZUM_AUGE;
  const TAU = Math.PI * 2;

  /* =====================================================================
     HELFER
     ===================================================================== */
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const nrm = (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const klemm = (x, a, b) => (x < a ? a : x > b ? b : x);
  function rgb(f, a) { return a == null ? "rgb(" + (f[0] | 0) + "," + (f[1] | 0) + "," + (f[2] | 0) + ")" : "rgba(" + (f[0] | 0) + "," + (f[1] | 0) + "," + (f[2] | 0) + "," + a + ")"; }
  function mul(f, k) { return [Math.min(255, f[0] * k[0]), Math.min(255, f[1] * k[1]), Math.min(255, f[2] * k[2])]; }
  function skal(f, k) { return [f[0] * k, f[1] * k, f[2] * k]; }
  function plus(f, d) { return [Math.min(255, f[0] + d[0]), Math.min(255, f[1] + d[1]), Math.min(255, f[2] + d[2])]; }
  function misch(a, b, k) { return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]; }
  function phase(bau, a, b) { return klemm((bau - a) / (b - a), 0, 1); }
  function vieleck(g, pts) { g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]); g.closePath(); }
  const HALB = nrm([LICHT[0] + AUGE[0], LICHT[1] + AUGE[1], LICHT[2] + AUGE[2]]);

  function blick(gier, s) {
    const r = gier * Math.PI / 180, c = Math.cos(r), sn = Math.sin(r);
    const lx = -LICHT[0] / LICHT[2], ly = -LICHT[1] / LICHT[2];
    return {
      c: c, sn: sn, s: s,
      p(x, y, z) { const a = x * c - y * sn, b = x * sn + y * c; return [(a - b) * KX * s, (a + b) * KY * s - z * KZ * s]; },
      tiefe(x, y, z) { return (x * c - y * sn + x * sn + y * c) * AUGE[0] + z * AUGE[2]; },
      n(x, y, z) { const l = Math.hypot(x, y, z) || 1; return [(x * c - y * sn) / l, (x * sn + y * c) / l, z / l]; },
      boden(x, y, z) { const a = x * c - y * sn + lx * z, b = x * sn + y * c + ly * z; return [(a - b) * KX * s, (a + b) * KY * s]; }
    };
  }
  function affin(g, V, o, eu, ev) {
    const p0 = V.p(o[0], o[1], o[2]), pu = V.p(o[0] + eu[0], o[1] + eu[1], o[2] + eu[2]), pv = V.p(o[0] + ev[0], o[1] + ev[1], o[2] + ev[2]);
    g.transform(pu[0] - p0[0], pu[1] - p0[1], pv[0] - p0[0], pv[1] - p0[1], p0[0], p0[1]);
  }
  /* dasselbe, aber auf den Boden geworfen (Schatten) */
  function affinBoden(g, V, o, eu, ev) {
    const p0 = V.boden(o[0], o[1], o[2]), pu = V.boden(o[0] + eu[0], o[1] + eu[1], o[2] + eu[2]), pv = V.boden(o[0] + ev[0], o[1] + ev[1], o[2] + ev[2]);
    g.transform(pu[0] - p0[0], pu[1] - p0[1], pv[0] - p0[0], pv[1] - p0[1], p0[0], p0[1]);
  }
  /* Kern-Lücke: beim Figurenschatten (kern.js, figurSchatten) fehlt F.gier */
  function mitGier(malen) {
    let merk = 0;
    return function (g, s, F) {
      if (F.gier != null && isFinite(F.gier)) merk = F.gier; else F = Object.assign({}, F, { gier: merk });
      return malen(g, s, F);
    };
  }
  function dazu(g, pts) {
    let fl = 0;
    for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; fl += a[0] * b[1] - b[0] * a[1]; }
    if (fl < 0) pts = pts.slice().reverse();
    g.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]);
    g.closePath();
  }
  function huelle(pts) {
    pts = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    if (pts.length < 3) return pts;
    const kr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lo = [], hi = [];
    for (const p of pts) { while (lo.length >= 2 && kr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
    for (let i = pts.length - 1; i >= 0; i--) { const p = pts[i]; while (hi.length >= 2 && kr(hi[hi.length - 2], hi[hi.length - 1], p) <= 0) hi.pop(); hi.push(p); }
    hi.pop(); lo.pop();
    return lo.concat(hi);
  }
  function licht(f, n, F, opt) {
    const k = ST.lichtFaktor(n, F.Z, 0, F.jahr);
    let c = [f[0] * k[0], f[1] * k[1], f[2] * k[2]];
    if (opt && opt.glanz) {
      const nh = dot(n, HALB), ab = opt.ab == null ? 0.55 : opt.ab;
      const sp = Math.pow(Math.max(0, (nh - ab) / (1 - ab)), 2) * opt.glanz;
      const so = (F.Z.sonne[0] + F.Z.sonne[1] + F.Z.sonne[2]) / 1.04;
      c = plus(c, [255 * sp * so, 250 * sp * so, 238 * sp * so]);
    }
    return c;
  }

  /* =====================================================================
     MASSE UND FORMEN
     ===================================================================== */
  const XW = 0.872, TW = 0.034;          // Wangen (Mitte) und Gussdicke
  const XL = 0.853;                      // Lattenenden
  /* Sitzlatten: Mitte y, Unterkante z */
  const SITZ = [0.228, 0.139, 0.050, -0.039, -0.128].map((y) => ({ y: y, z: 0.408 - (0.27 - y) * 0.062, b: 0.078, d: 0.03 }));
  /* Rückenlehne: Linie der Wange */
  const L0 = [-0.172, 0.455], L1 = [-0.268, 0.852];
  const LD = (() => { const dy = L1[0] - L0[0], dz = L1[1] - L0[1], l = Math.hypot(dy, dz); return [dy / l, dz / l, l]; })();
  const LN = [LD[1], -LD[0]];            // nach vorn/oben
  const RUECK = [0.2, 0.5, 0.8].map((t) => ({ y: L0[0] + (L1[0] - L0[0]) * t + LN[0] * 0.02, z: L0[1] + (L1[1] - L0[1]) * t + LN[1] * 0.02, b: 0.092, d: 0.026 }));

  /* Die Wange als Striche in ihrer Ebene: (u = y, v = z), Breite in Metern */
  function spirale(cx, cy, r0, w0, w1, dreh) {
    const pts = [];
    for (let i = 0; i <= 26; i++) { const t = i / 26, w = w0 + (w1 - w0) * t, r = r0 * (1 - t * 0.72); pts.push([cx + Math.cos(w) * r * dreh, cy + Math.sin(w) * r]); }
    return pts;
  }
  const WANGE = (() => {
    const Q = (a, b, c, n) => { const o = []; for (let i = 0; i <= (n || 10); i++) { const t = i / (n || 10), u = 1 - t; o.push([u * u * a[0] + 2 * u * t * b[0] + t * t * c[0], u * u * a[1] + 2 * u * t * b[1] + t * t * c[1]]); } return o; };
    const C = (a, b, c, d, n) => { const o = []; for (let i = 0; i <= (n || 14); i++) { const t = i / (n || 14), u = 1 - t; o.push([u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0], u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1]]); } return o; };
    const zug = [];
    /* Vorderbein mit Armlehnenstütze, unten Löwenfuß-Schnecke */
    zug.push({ w: 0.042, p: [...Q([0.335, 0.012], [0.278, 0.02], [0.276, 0.11]), ...Q([0.272, 0.2], [0.262, 0.33], [0.262, 0.43]).slice(1), ...Q([0.262, 0.5], [0.255, 0.57], [0.268, 0.628]).slice(1)] });
    zug.push({ w: 0.018, p: spirale(0.322, 0.04, 0.03, Math.PI * 0.5, Math.PI * 2.3, 1) });
    /* Hinterbein und Rückenlehnenträger, oben eine kleine Schnecke */
    zug.push({ w: 0.044, p: [...Q([-0.345, 0.012], [-0.24, 0.04], [-0.205, 0.2]), ...Q([-0.18, 0.3], [-0.168, 0.38], [-0.172, 0.455]).slice(1), ...Q([-0.19, 0.62], [-0.23, 0.74], [-0.268, 0.852]).slice(1)] });
    zug.push({ w: 0.018, p: spirale(-0.296, 0.842, 0.028, -Math.PI * 0.3, Math.PI * 1.6, -1) });
    zug.push({ w: 0.016, p: spirale(-0.33, 0.038, 0.026, Math.PI * 0.5, Math.PI * 2.2, -1) });
    /* Sitzträger */
    zug.push({ w: 0.046, p: [[0.27, 0.41], [-0.17, 0.384]] });
    /* Armlehne mit Volute vorn */
    zug.push({ w: 0.04, p: Q([-0.214, 0.63], [0.05, 0.668], [0.268, 0.642], 12) });
    zug.push({ w: 0.02, p: spirale(0.284, 0.61, 0.036, -Math.PI * 0.45, Math.PI * 1.55, 1) });
    /* Zierschnecken: unter der Armlehne und unter dem Sitz (S-Schwung) */
    zug.push({ w: 0.017, p: [...C([0.2, 0.622], [0.13, 0.6], [0.11, 0.5], [0.16, 0.455]), ...spirale(0.135, 0.49, 0.028, Math.PI * 0.2, Math.PI * 1.9, 1).slice(1)] });
    zug.push({ w: 0.017, p: [...spirale(0.19, 0.3, 0.035, Math.PI * 1.5, -Math.PI * 0.3, 1).reverse(), ...C([0.19 + 0.035 * 0.28 * Math.cos(-Math.PI * 0.3), 0.3], [0.1, 0.36], [0.0, 0.2], [-0.12, 0.26]).slice(1), ...spirale(-0.12, 0.3, 0.035, Math.PI * 0.5, Math.PI * 2.3, -1).slice(1)] });
    return zug;
  })();

  const HOLZ = [
    { name: "Eiche geölt", f: [152, 104, 62] },
    { name: "grün lackiert", f: [44, 96, 64], lack: true },
    { name: "Lärche verwittert", f: [150, 144, 132], grau: true }
  ];
  const EISEN = [[34, 56, 44], [34, 35, 38], [74, 76, 78]];

  /* =====================================================================
     WANGE MALEN (mehrfach hintereinander = Gussdicke)
     ===================================================================== */
  function wangeMalen(g, V, F, xf, farbe, schnee, bis) {
    const s = V.s;
    const dir = V.tiefe(1, 0, 0) >= 0 ? 1 : -1;       // +x kommt näher?
    const n = klemm(Math.ceil(TW * 0.8 * s / 0.7), 1, 7);
    const vorn = licht(farbe, V.n(dir, 0, 0), F, { glanz: 0.45, ab: 0.5 });
    const kante = skal(licht(farbe, V.n(0.2, 0.5, 0.8), F), 0.8);
    const zuege = bis == null ? WANGE : WANGE.slice(0, bis);
    g.lineCap = "round"; g.lineJoin = "round";
    /* Gussdicke als Band entlang jeder Mittellinie: steht die Wange genau
       in Blickrichtung (Kante voraus), fällt ihre Ebene im Bild zu einer
       Linie zusammen – dann sieht man nur noch diese 3,5 cm Dicke */
    g.beginPath();
    for (const z of zuege) {
      const a0 = z.p.map((q) => V.p(xf - TW / 2, q[0], q[1])), a1 = z.p.map((q) => V.p(xf + TW / 2, q[0], q[1]));
      for (let j = 0; j < a0.length - 1; j++) dazu(g, [a0[j], a0[j + 1], a1[j + 1], a1[j]]);
    }
    g.fillStyle = rgb(kante); g.fill();
    for (let i = 0; i <= n; i++) {
      const dx = (-TW / 2 + TW * i / n) * dir;
      g.save();
      affin(g, V, [xf + dx, 0, 0], [0, 1, 0], [0, 0, 1]);
      g.strokeStyle = rgb(i === n ? vorn : kante);
      for (const z of zuege) {
        g.lineWidth = z.w;
        g.beginPath(); z.p.forEach((p, j) => (j ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.stroke();
      }
      if (i === n && s > 30) {
        /* Gusskante: feines Licht oben an jedem Strich */
        g.strokeStyle = rgb(plus(vorn, [26, 26, 24]), 0.5);
        for (const z of zuege) {
          g.lineWidth = z.w * 0.25;
          g.beginPath(); z.p.forEach((p, j) => (j ? g.lineTo(p[0] - z.w * 0.18, p[1] + z.w * 0.28) : g.moveTo(p[0] - z.w * 0.18, p[1] + z.w * 0.28))); g.stroke();
        }
      }
      if (i === n && schnee) {
        /* Schneegrat auf der Armlehne und oben auf der Lehnenschnecke */
        const ws = [246, 249, 255];
        g.strokeStyle = rgb(licht(ws, [0, 0, 1], F));
        g.lineWidth = 0.034;
        const arm = WANGE[6].p;
        g.beginPath(); arm.forEach((p, j) => { if (j < 1 || j > arm.length - 2) return; g.lineTo(p[0], p[1] + 0.028); }); g.stroke();
        g.lineWidth = 0.024;
        g.beginPath(); g.moveTo(-0.28, 0.875); g.lineTo(-0.25, 0.872); g.stroke();
      }
      g.restore();
    }
  }

  /* =====================================================================
     LATTE (Kasten mit Holzmaserung)
     a = Breitenrichtung (y,z), b = Dickenrichtung (y,z) – nach außen
     ===================================================================== */
  function latteMalen(g, V, F, L, a, b, holz, saat, opt) {
    const s = V.s;
    const x0 = -XL, x1 = XL;
    const ha = L.b / 2, hb = L.d / 2;
    const P = (x, sa, sb) => [x, L.y + a[0] * sa * ha + b[0] * sb * hb, L.z + a[1] * sa * ha + b[1] * sb * hb];
    const flaechen = [
      { n: [0, b[0], b[1]], e: [P(x0, -1, 1), P(x1, -1, 1), P(x1, 1, 1), P(x0, 1, 1)], art: "oben" },
      { n: [0, -b[0], -b[1]], e: [P(x0, 1, -1), P(x1, 1, -1), P(x1, -1, -1), P(x0, -1, -1)], art: "unten" },
      { n: [0, a[0], a[1]], e: [P(x0, 1, 1), P(x1, 1, 1), P(x1, 1, -1), P(x0, 1, -1)], art: "kante" },
      { n: [0, -a[0], -a[1]], e: [P(x0, -1, -1), P(x1, -1, -1), P(x1, -1, 1), P(x0, -1, 1)], art: "kante" },
      { n: [1, 0, 0], e: [P(x1, -1, 1), P(x1, -1, -1), P(x1, 1, -1), P(x1, 1, 1)], art: "hirn" },
      { n: [-1, 0, 0], e: [P(x0, 1, 1), P(x0, 1, -1), P(x0, -1, -1), P(x0, -1, 1)], art: "hirn" }
    ];
    const f = holz.f, rng = ST.zufall(saat);
    const c = skal(f, 0.9 + rng() * 0.18);
    for (const fl of flaechen) {
      const nk = V.n(fl.n[0], fl.n[1], fl.n[2]);
      if (dot(nk, AUGE) <= 0.001) continue;
      const pts = fl.e.map((q) => V.p(q[0], q[1], q[2]));
      vieleck(g, pts);
      const kf = licht(fl.art === "hirn" ? skal(c, 0.82) : c, nk, F, holz.lack ? { glanz: 0.35, ab: 0.45 } : null);
      g.fillStyle = rgb(kf); g.fill();
      if (fl.art === "oben" && s * L.b > 5) {
        /* Maserung längs, Äste, Schrauben – in der Fläche gemalt */
        g.save();
        vieleck(g, pts); g.clip();
        const o = fl.e[0];
        affin(g, V, o, [1, 0, 0], [0, a[0], a[1]]);
        const W = x1 - x0, H = L.b;
        const k = ST.lichtFaktor(nk, F.Z, 0, F.jahr);
        if (s > 22) {
          const zeilen = Math.max(3, Math.min(14, Math.round(s * H / 1.4)));
          g.lineWidth = Math.max(0.0015, 0.9 / s);
          /* Maserung in zwei Tönen gebündelt (ein Strich je Ton statt je Faser) */
          const faser = [new Path2D(), new Path2D()];
          for (let i = 0; i < zeilen; i++) {
            const y0 = H * (i + 0.5) / zeilen + (rng() - 0.5) * H * 0.06;
            const pf = faser[i % 2];
            pf.moveTo(0, y0);
            for (let x = 0.12; x < W + 0.12; x += 0.12) pf.lineTo(x, y0 + (rng() - 0.5) * H * 0.08 + Math.sin(x * 3 + i) * H * 0.02);
          }
          g.strokeStyle = rgb(mul(skal(c, holz.grau ? 0.78 : 0.72), k), 0.5); g.stroke(faser[0]);
          g.strokeStyle = rgb(mul(skal(c, holz.grau ? 0.84 : 0.8), k), 0.4); g.stroke(faser[1]);
          /* Äste */
          for (let i = 0; i < 2; i++) {
            if (rng() < 0.4) continue;
            const x = 0.15 + rng() * (W - 0.3), y = H * (0.3 + rng() * 0.4);
            g.fillStyle = rgb(mul(skal(c, 0.55), k), 0.8);
            g.beginPath(); g.ellipse(x, y, 0.012 + rng() * 0.01, 0.008, 0, 0, TAU); g.fill();
            g.strokeStyle = rgb(mul(skal(c, 0.7), k), 0.5); g.lineWidth = Math.max(0.0015, 0.7 / s);
            g.beginPath(); g.ellipse(x, y, 0.03, 0.013, 0, 0, TAU); g.stroke();
          }
          if (holz.grau) PI.rauschen(g, 0, 0, W, H, 0.4, 0.2, (saat % 40) + 3, 3);
          if (holz.lack && s > 40) {
            /* abgeplatzter Lack an den Kanten: das Holz schaut durch */
            g.fillStyle = rgb(mul([150, 110, 70], k), 0.7);
            for (let i = 0; i < 5; i++) { const x = rng() * W; g.beginPath(); g.ellipse(x, rng() < 0.5 ? 0.004 : H - 0.004, 0.02 + rng() * 0.03, 0.004, 0, 0, TAU); g.fill(); }
          }
        }
        /* Schlossschrauben über den Wangen */
        if (s > 50) {
          for (const x of [0.018, W - 0.018]) {
            g.fillStyle = rgb(mul([70, 70, 72], k));
            g.beginPath(); g.arc(x, H / 2, 0.009, 0, TAU); g.fill();
            g.fillStyle = rgb(mul([150, 150, 150], k), 0.6);
            g.beginPath(); g.arc(x - 0.002, H / 2 - 0.002, 0.004, 0, TAU); g.fill();
          }
        }
        /* Kante: Licht auf der gerundeten Vorderkante */
        g.fillStyle = rgb(plus(mul(c, k), [30, 28, 24]), 0.35);
        g.fillRect(0, H - 0.006, W, 0.006);
        if (opt && opt.schild && s > 45) schildMalen(g, W / 2 - 0.07, H / 2 - 0.022, k, s);
        g.restore();
      }
      if (fl.art === "hirn" && s > 40) {
        /* Hirnholz: Jahresringe */
        g.save(); vieleck(g, pts); g.clip();
        const m = [(pts[0][0] + pts[2][0]) / 2, (pts[0][1] + pts[2][1]) / 2];
        g.strokeStyle = rgb(skal(kf, 0.75), 0.6); g.lineWidth = Math.max(0.4, s * 0.0015);
        for (let r = 0.01; r < 0.08; r += 0.012) { g.beginPath(); g.arc(m[0] + 0.03 * s, m[1] + 0.06 * s, r * s, 0, TAU); g.stroke(); }
        g.restore();
      }
    }
  }
  /* Messingschild: „Gestiftet vom Verschönerungsverein 1912" */
  function schildMalen(g, x, y, k, s) {
    const w = 0.14, h = 0.044;
    g.fillStyle = rgb(mul([120, 92, 40], k)); PI.rundRechteck(g, x, y, w, h, 0.005); g.fill();
    const gr = g.createLinearGradient(x, y, x + w, y + h);
    gr.addColorStop(0, rgb(mul([236, 206, 120], k))); gr.addColorStop(0.5, rgb(mul([196, 158, 72], k))); gr.addColorStop(1, rgb(mul([226, 190, 104], k)));
    g.fillStyle = gr; PI.rundRechteck(g, x + 0.002, y + 0.002, w - 0.004, h - 0.004, 0.004); g.fill();
    g.fillStyle = rgb(mul([90, 68, 30], k));
    for (const [px, py] of [[0.008, 0.008], [w - 0.008, 0.008], [0.008, h - 0.008], [w - 0.008, h - 0.008]]) { g.beginPath(); g.arc(x + px, y + py, 0.0025, 0, TAU); g.fill(); }
    if (s > 110) {
      g.font = "italic 0.0105px Georgia, 'DejaVu Serif', serif"; g.textAlign = "center"; g.textBaseline = "middle";
      g.fillText("Gestiftet vom", x + w / 2, y + h * 0.33);
      g.fillText("Verschönerungsverein 1912", x + w / 2, y + h * 0.68);
    } else {
      g.fillRect(x + w * 0.2, y + h * 0.3, w * 0.6, 0.003); g.fillRect(x + w * 0.1, y + h * 0.62, w * 0.8, 0.003);
    }
  }

  /* Zugstange unter dem Sitz (Rundstahl zwischen den Wangen) */
  function stangeMalen(g, V, F, farbe) {
    const s = V.s;
    const a = V.p(-XW, 0.02, 0.33), b = V.p(XW, 0.02, 0.33);
    g.lineCap = "butt";
    g.strokeStyle = rgb(licht(farbe, V.n(0, 0.4, -0.5), F)); g.lineWidth = Math.max(0.6, 0.018 * s);
    g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
    g.strokeStyle = rgb(licht(plus(farbe, [30, 30, 30]), V.n(0, 0.4, 0.9), F, { glanz: 0.6 }), 0.8); g.lineWidth = Math.max(0.4, 0.006 * s);
    g.beginPath(); g.moveTo(a[0], a[1] - 0.004 * s); g.lineTo(b[0], b[1] - 0.004 * s); g.stroke();
  }

  /* =====================================================================
     SCHNEEKISSEN (Winter)
     ===================================================================== */
  function kissenMalen(g, V, F, saat) {
    const s = V.s;
    const rng = ST.zufall(saat * 5 + 1);
    const y0 = -0.172, y1 = 0.27, x0 = -XL + 0.004, x1 = XL - 0.004;
    const zU = (y) => SITZ[0].z + 0.03 + (y - 0.27) * 0.062;          // Oberkante der Latten
    const dick = 0.06 + (saat % 3) * 0.012;
    /* manchmal hat jemand eine Ecke freigewischt, um sich zu setzen */
    const frei = saat % 3 === 1 ? { x0: 0.12 + (saat % 5) * 0.05, x1: 0.5 + (saat % 5) * 0.05 } : null;
    const r = 0.06;
    /* Umriss als Vieleck (x, y); an Wischkanten zerzaust */
    const umriss = (xa, xb, ein, zausL, zausR) => {
      const pts = [];
      const ecke = (cx, cy, w0) => { for (let i = 0; i <= 5; i++) { const w = w0 + i / 5 * Math.PI / 2; pts.push([cx + Math.cos(w) * (r - ein), cy + Math.sin(w) * (r - ein)]); } };
      const kante = (x, von, bis, zaus) => { if (!zaus) return; for (let i = 1; i < 8; i++) { const y = von + (bis - von) * i / 8; pts.push([x + (rng() - 0.5) * 0.04 * zaus, y]); } };
      ecke(xb - r, y1 - r, 0); ecke(xa + r, y1 - r, Math.PI / 2);
      kante(xa + ein, y1 - r, y0 + r, zausL);
      ecke(xa + r, y0 + r, Math.PI); ecke(xb - r, y0 + r, Math.PI * 1.5);
      kante(xb - ein, y0 + r, y1 - r, zausR);
      return pts;
    };
    const stuecke = frei ? [[x0, frei.x0, 0, 1], [frei.x1, x1, 1, 0]] : [[x0, x1, 0, 0]];
    const seite = licht([222, 230, 246], V.n(0.2, 0.9, 0.2), F);
    const kO = licht([248, 250, 255], [0, 0, 1], F);
    for (const [xa, xb, zl, zr] of stuecke) {
      if (xb - xa < 0.12) continue;
      const u2 = umriss(xa, xb, -0.012, zl, zr), o2 = umriss(xa, xb, 0.02, zl, zr);
      const mitte = (xa + xb) / 2, halb = (xb - xa) / 2;
      const hoch = (q) => dick * (0.8 + 0.2 * Math.cos(klemm((q[0] - mitte) / halb, -1, 1) * Math.PI / 2));
      const unten = u2.map((q) => V.p(q[0], q[1], zU(q[1]) - 0.004));
      const oben = o2.map((q) => V.p(q[0], q[1], zU(q[1]) + hoch(q)));
      /* Flanken: Hülle beider Umrisse, nach unten bläulich */
      vieleck(g, huelle(unten.concat(oben)));
      const ya = Math.min(...oben.map((p) => p[1])), yb = Math.max(...unten.map((p) => p[1]));
      const gs = g.createLinearGradient(0, ya, 0, yb);
      gs.addColorStop(0, rgb(seite)); gs.addColorStop(1, rgb(mul(seite, [0.72, 0.76, 0.86])));
      g.fillStyle = gs; g.fill();
      /* Oberseite mit weicher, gerundeter Kante */
      vieleck(g, oben);
      const m = V.p(mitte, (y0 + y1) / 2, zU(0.05) + dick);
      const gr = g.createRadialGradient(m[0] - 0.12 * s, m[1] - 0.05 * s, 0.03 * s, m[0], m[1], halb * 1.3 * s);
      gr.addColorStop(0, rgb(plus(kO, [5, 5, 4]))); gr.addColorStop(0.7, rgb(kO)); gr.addColorStop(1, rgb(misch(kO, seite, 0.45)));
      g.fillStyle = gr; g.fill();
      g.lineJoin = "round"; g.strokeStyle = rgb(misch(kO, seite, 0.35)); g.lineWidth = Math.max(0.6, 0.02 * s); g.stroke();
      /* Wulst an der Vorderkante: der Schnee hängt über die vorderste Latte */
      if (s > 18) {
        const vorn = o2.filter((q) => q[1] > y1 - r * 0.9).sort((p, q) => p[0] - q[0]);
        const nk = V.n(0, 1, 0.3);
        if (vorn.length > 1 && dot(nk, AUGE) > 0) {
          const wp = vorn.map((q) => V.p(q[0], q[1] + 0.012, zU(q[1]) + hoch(q) - 0.022));
          g.lineCap = "round"; g.strokeStyle = rgb(licht([232, 238, 250], nk, F)); g.lineWidth = Math.max(0.8, 0.034 * s);
          g.beginPath(); wp.forEach((p, j) => (j ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.stroke();
          g.strokeStyle = rgb(kO, 0.9); g.lineWidth = Math.max(0.5, 0.016 * s);
          g.beginPath(); wp.forEach((p, j) => (j ? g.lineTo(p[0], p[1] - 0.012 * s) : g.moveTo(p[0], p[1] - 0.012 * s))); g.stroke();
        }
      }
      if (s > 35) {
        g.fillStyle = "rgba(255,255,255,0.85)";
        for (let i = 0; i < (xb - xa) * 26; i++) { const p = V.p(xa + 0.04 + rng() * (xb - xa - 0.08), y0 + 0.05 + rng() * (y1 - y0 - 0.1), zU(0.05) + dick + 0.004); g.fillRect(p[0], p[1], Math.max(0.6, s * 0.004), Math.max(0.6, s * 0.004)); }
      }
    }
    if (frei) {
      /* Wischspuren: dünne Schneereste in den Fugen und auf den Latten */
      g.fillStyle = rgb(licht([238, 243, 252], [0, 0, 1], F), 0.85);
      for (const L of SITZ) {
        for (let j = 0; j < 2; j++) {
          if (rng() < 0.35) continue;
          const xa = frei.x0 + rng() * (frei.x1 - frei.x0) * 0.6, xb = xa + 0.06 + rng() * 0.12;
          const a = V.p(xa, L.y + (rng() - 0.5) * 0.04, L.z + L.d + 0.003), b = V.p(Math.min(frei.x1, xb), L.y + (rng() - 0.5) * 0.04, L.z + L.d + 0.003);
          g.beginPath(); g.ellipse((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, Math.hypot(b[0] - a[0], b[1] - a[1]) * 0.5, Math.max(0.5, 0.009 * s), Math.atan2(b[1] - a[1], b[0] - a[0]), 0, TAU); g.fill();
        }
      }
    }
  }
  /* Schneegrat auf einer Rückenlatte */
  function gratMalen(g, V, F, L) {
    const s = V.s;
    const oy = L.y + LD[0] * L.b / 2, oz = L.z + LD[1] * L.b / 2 + 0.008;
    const a = V.p(-XL + 0.01, oy, oz), b = V.p(XL - 0.01, oy, oz);
    g.lineCap = "round";
    g.strokeStyle = rgb(licht([220, 230, 246], V.n(0, 0.6, 0.6), F)); g.lineWidth = Math.max(0.8, 0.026 * s);
    g.beginPath(); g.moveTo(a[0], a[1] + 0.004 * s); g.lineTo(b[0], b[1] + 0.004 * s); g.stroke();
    g.strokeStyle = rgb(licht([250, 252, 255], [0, 0, 1], F)); g.lineWidth = Math.max(0.6, 0.018 * s);
    g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
  }

  /* =====================================================================
     BODEN: Grasbüschel, Blütenblätter, Löwenzahn (Frühling)
     ===================================================================== */
  function fruehlingBoden(g, V, F, saat) {
    const s = V.s;
    if (s < 14) return;
    const rng = ST.zufall(saat * 3 + 7);
    const k = ST.lichtFaktor([0, 0, 1], F.Z, 0, F.jahr);
    g.lineCap = "round";
    for (const xf of [-XW, XW]) for (const y of [0.33, -0.34]) {
      for (let i = 0; i < 12; i++) {
        const p = V.p(xf + (rng() - 0.5) * 0.12, y + (rng() - 0.5) * 0.08, 0);
        const l = (0.04 + rng() * 0.07) * s;
        g.strokeStyle = rgb(mul([70 + rng() * 34, 130 + rng() * 30, 50], k)); g.lineWidth = Math.max(0.4, s * 0.004);
        g.beginPath(); g.moveTo(p[0], p[1]); g.quadraticCurveTo(p[0] + (rng() - 0.5) * l, p[1] - l * 0.6, p[0] + (rng() - 0.5) * l, p[1] - l); g.stroke();
      }
    }
    /* Löwenzahn vorn links */
    const lz = V.p(-0.55, 0.42, 0);
    g.fillStyle = rgb(mul([70, 120, 46], k));
    for (let i = 0; i < 6; i++) { const w = i / 6 * TAU; g.beginPath(); g.ellipse(lz[0] + Math.cos(w) * 0.04 * s, lz[1] + Math.sin(w) * 0.02 * s, 0.045 * s, 0.01 * s, w, 0, TAU); g.fill(); }
    g.strokeStyle = rgb(mul([96, 140, 60], k)); g.lineWidth = Math.max(0.4, 0.004 * s);
    g.beginPath(); g.moveTo(lz[0], lz[1]); g.lineTo(lz[0] + 0.01 * s, lz[1] - 0.14 * s); g.stroke();
    g.fillStyle = rgb(mul([250, 206, 30], k)); g.beginPath(); g.arc(lz[0] + 0.01 * s, lz[1] - 0.14 * s, Math.max(0.8, 0.02 * s), 0, TAU); g.fill();
    blaetterMalen(g, V, F, saat, 0, 26);
  }
  /* Kirschblütenblätter: auf dem Boden (z = 0) oder auf dem Sitz */
  function blaetterMalen(g, V, F, saat, aufSitz, n) {
    const s = V.s;
    if (s < 20) return;
    const rng = ST.zufall(saat * 11 + (aufSitz ? 5 : 9));
    const k = ST.lichtFaktor([0, 0, 1], F.Z, 0, F.jahr);
    for (let i = 0; i < n; i++) {
      let p;
      if (aufSitz) { const L = SITZ[(rng() * SITZ.length) | 0]; p = V.p(-XL + rng() * 2 * XL, L.y + (rng() - 0.5) * L.b * 0.8, L.z + L.d + 0.002); }
      else p = V.p((rng() - 0.5) * 2.6, (rng() - 0.5) * 1.4, 0);
      const c = rng() < 0.6 ? [250, 214, 226] : [255, 240, 244];
      g.fillStyle = rgb(mul(c, k), 0.95);
      g.beginPath(); g.ellipse(p[0], p[1], Math.max(0.6, 0.011 * s), Math.max(0.4, 0.006 * s), rng() * 3, 0, TAU); g.fill();
    }
  }

  /* Baugrube für die Streifenfundamente unter den Wangen */
  function grubeMalen(g, V, F, tiefe, fuell) {
    const s = V.s, Z = F.Z, jahr = F.jahr;
    const kU = ST.lichtFaktor([0, 0, 1], Z, 0, jahr);
    const rng = ST.zufall(3);
    for (const xf of [-XW, XW]) {
      const loch = [[xf - 0.12, -0.38], [xf + 0.12, -0.38], [xf + 0.12, 0.38], [xf - 0.12, 0.38]];
      const boden = fuell != null && fuell > -tiefe ? fuell : -tiefe;
      const beton = fuell != null && fuell > -tiefe + 0.01;
      /* Aushub daneben */
      for (let i = 0; i < 3; i++) {
        const p = V.p(xf + (xf > 0 ? 0.3 : -0.3) + (rng() - 0.5) * 0.1, (rng() - 0.5) * 0.6, 0), R = (0.1 + rng() * 0.06) * s;
        const gr = g.createRadialGradient(p[0] - R * 0.3, p[1] - R * 0.5, R * 0.1, p[0], p[1] - R * 0.2, R);
        gr.addColorStop(0, rgb(mul([132, 104, 76], kU))); gr.addColorStop(1, rgb(mul([78, 58, 42], kU)));
        g.fillStyle = gr; g.beginPath(); g.ellipse(p[0], p[1], R, R * 0.5, 0, 0, Math.PI); g.ellipse(p[0], p[1], R, R * 0.8, 0, Math.PI, 0); g.fill();
      }
      g.save();
      vieleck(g, loch.map((q) => V.p(q[0], q[1], 0))); g.clip();
      vieleck(g, loch.map((q) => V.p(q[0], q[1], boden)));
      g.fillStyle = rgb(mul(beton ? [170, 168, 160] : [92, 70, 52], skal(kU, beton ? 0.92 : 0.6))); g.fill();
      for (let i = 0; i < 4; i++) {
        const a = loch[i], c = loch[(i + 1) % 4];
        const nk = V.n(-((a[0] + c[0]) / 2 - xf), -(a[1] + c[1]) / 2, 0);
        if (dot(nk, AUGE) <= 0.001) continue;
        const k = ST.lichtFaktor(nk, Z, 0, jahr);
        vieleck(g, [V.p(a[0], a[1], 0), V.p(c[0], c[1], 0), V.p(c[0], c[1], boden), V.p(a[0], a[1], boden)]);
        g.fillStyle = rgb(mul([104, 80, 58], skal(k, 0.7))); g.fill();
      }
      g.restore();
    }
  }
  /* fertiges Streifenfundament: bündig, nur die Betonoberkante zeigt sich */
  function fundamentMalen(g, V, F, frisch) {
    const s = V.s;
    const kU = ST.lichtFaktor([0, 0, 1], F.Z, 0, F.jahr);
    for (const xf of [-XW, XW]) {
      const pts = [[xf - 0.1, -0.36], [xf + 0.1, -0.36], [xf + 0.1, 0.36], [xf - 0.1, 0.36]].map((q) => V.p(q[0], q[1], 0.005));
      vieleck(g, pts);
      g.fillStyle = rgb(mul(frisch ? [176, 174, 166] : [150, 148, 142], kU)); g.fill();
      if (s > 30) { g.strokeStyle = rgb(mul([110, 108, 102], kU), 0.6); g.lineWidth = Math.max(0.4, s * 0.004); g.stroke(); }
    }
  }

  /* =====================================================================
     SCHATTEN
     ===================================================================== */
  function schattenMalen(g, s, F, A) {
    const V = blick(F.gier || 0, s);
    const m = g.getTransform();
    g.save();
    g.setTransform(1, 0, 0, 1, m.e, m.f);
    g.fillStyle = "#000"; g.strokeStyle = "#000";
    /* Wangen: dieselben Pfade, flach auf den Boden gelegt */
    if (A.wangen) {
      for (const xf of [-XW, XW]) {
        g.save();
        affinBoden(g, V, [xf, 0, 0], [0, 1, 0], [0, 0, 1]);
        g.lineCap = "round"; g.lineJoin = "round";
        for (const z of WANGE) { g.lineWidth = z.w * 1.1; g.beginPath(); z.p.forEach((p, j) => (j ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.stroke(); }
        g.restore();
      }
    }
    g.beginPath();
    const latte = (L, a, b) => {
      const e = [];
      for (const x of [-XL, XL]) for (const sa of [-1, 1]) for (const sb of [-1, 1]) e.push(V.boden(x, L.y + a[0] * sa * L.b / 2 + b[0] * sb * L.d / 2, L.z + a[1] * sa * L.b / 2 + b[1] * sb * L.d / 2));
      dazu(g, huelle(e));
    };
    for (let i = 0; i < A.sitz; i++) latte(SITZ[i], [1, 0], [0, 1]);
    for (let i = 0; i < A.rueck; i++) latte(RUECK[i], LD, LN);
    if (A.schmuck && F.jahr === "winter") {
      const e = [];
      for (const x of [-XL, XL]) for (const y of [-0.17, 0.27]) e.push(V.boden(x, y, SITZ[0].z + 0.1));
      dazu(g, huelle(e));
    }
    g.fill();
    /* Zugstange */
    if (A.stange) {
      const a = V.boden(-XW, 0.02, 0.33), b = V.boden(XW, 0.02, 0.33);
      g.lineWidth = Math.max(0.5, 0.018 * s); g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
    }
    g.restore();
  }
  function schaetzeGier(o) {
    return ((o.objekt && o.objekt.gier) || 0) + ((ST.kamera && ST.kamera.dreh) || 0) * 90;
  }

  /* =====================================================================
     DAS MODELL
     ===================================================================== */
  ST.modell("bank", {
    name: "Parkbank", gruppe: "Deko", grund: [1.9, 0.75], hoehe: 0.9, bauzeit: 30,
    bauen: function (M, o) {
      const bau = o.bau == null ? 1 : o.bau;
      const saat = Math.abs(o.saat | 0) || 1;
      const winter = o.jahr === "winter";
      const holz = HOLZ[saat % HOLZ.length];
      const eisen = EISEN[(saat >> 1) % EISEN.length];
      const A = {
        grube: bau < 0.3,
        wangen: bau >= 0.3,
        sitz: bau < 0.44 ? 0 : Math.min(5, Math.floor(phase(bau, 0.44, 0.7) * 5 + 0.001)),
        rueck: bau < 0.7 ? 0 : Math.min(3, Math.floor(phase(bau, 0.7, 0.88) * 3 + 0.001)),
        stange: bau >= 0.36,
        schmuck: bau >= 1
      };
      const figur = {
        x: 0, y: 0, z: 0, breite: 2.4, hoehe: 1.0,
        malen: mitGier(function (g, s, F) {
          if (F.schatten) { if (A.wangen) schattenMalen(g, s, F, A); return; }
          const V = blick(F.gier || 0, s);
          if (A.grube) { grubeMalen(g, V, F, 0.5, bau < 0.18 ? null : -0.5 + 0.5 * phase(bau, 0.18, 0.29)); return; }
          if (bau < 0.5) fundamentMalen(g, V, F, true);
          if (!winter && A.schmuck) fruehlingBoden(g, V, F, saat);
          /* Teile nach Tiefe: ferne Wange, Latten (von hinten nach vorn), nahe Wange */
          const nahX = V.tiefe(1, 0, 0) >= 0 ? XW : -XW;
          const teile = [];
          for (let i = 0; i < A.sitz; i++) { const L = SITZ[i]; teile.push({ t: V.tiefe(0, L.y, L.z), f: () => latteMalen(g, V, F, L, [1, 0], [0, 1], holz, saat * 7 + i) }); }
          for (let i = 0; i < A.rueck; i++) { const L = RUECK[i]; teile.push({ t: V.tiefe(0, L.y, L.z), f: () => { latteMalen(g, V, F, L, LD, LN, holz, saat * 7 + 10 + i, { schild: i === 1 }); if (winter && A.schmuck) gratMalen(g, V, F, L); } }); }
          if (A.stange) teile.push({ t: V.tiefe(0, 0.02, 0.33), f: () => stangeMalen(g, V, F, eisen) });
          teile.sort((a, b) => a.t - b.t);
          wangeMalen(g, V, F, -nahX, eisen, winter && A.schmuck);
          /* Latten; das Schneekissen liegt über den Sitzlatten, aber unter
             den Rückenlatten, wenn man von hinten schaut */
          const kissen = winter && A.schmuck;
          const tKissen = V.tiefe(0, 0.05, SITZ[2].z + 0.06);
          let kissenGemalt = !kissen;
          for (const e of teile) {
            if (!kissenGemalt && e.t > tKissen + 0.02) { kissenMalen(g, V, F, saat); kissenGemalt = true; }
            e.f();
          }
          if (!kissenGemalt) kissenMalen(g, V, F, saat);
          if (!winter && A.schmuck) blaetterMalen(g, V, F, saat, 1, 14);
          wangeMalen(g, V, F, nahX, eisen, winter && A.schmuck);
        })
      };
      M.teil("bank", { mitte: [0, 0, 0.4] });
      M.figur(figur);
      /* Unsichtbare Hülle: das Sprite muss den Schatten mit fassen */
      M.teil("huelle", { schatten: false, mitte: [0, 0, -50] });
      const leer = { malen: null, keinLicht: true, keinAo: true };
      M.flaeche(Object.assign({ name: "huelle", o: [-1.0, -0.45, 0], u: [1, 0, 0], v: [0, 1, 0], w: 2.0, h: 0.9 }, leer));
      const H = 0.9, sx = -LICHT[0] / LICHT[2] * H, sy = -LICHT[1] / LICHT[2] * H;
      const gr = schaetzeGier(o) * Math.PI / 180, c = Math.cos(gr), sn = Math.sin(gr);
      const x = sx * c + sy * sn, y = -sx * sn + sy * c;
      M.flaeche(Object.assign({ name: "huelle-schatten", o: [x - 1.0, y - 0.45, 0], u: [1, 0, 0], v: [0, 1, 0], w: 2.0, h: 0.9 }, leer));
    }
  });
})();
