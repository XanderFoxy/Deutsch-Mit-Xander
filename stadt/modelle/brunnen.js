/* =====================================================================
   BAUKASTEN-STADT — DER MARKTBRUNNEN (Sandstein, achteckiges Becken)
   ---------------------------------------------------------------------
   XANDER: „Richtig filigran. Richtig schön ausarbeiten mit schönen
   Texturen." – „Das soll keine Comic Grafik sein." – „dass wir das
   später in einen Frühlingsgewand packen können." – „Man soll sie in
   jedem Winkel aufstellen können."

   Vorbild: fränkische Marktbrunnen (Mainsandstein). Achteckiges Becken
   auf einer Sockelstufe, profilierte Beckenrand-Platten, in der Mitte der
   Brunnenstock mit vier Messingröhren hinter Löwenmasken, darüber eine
   Säule mit Kapitell und eine bemalte Ritterfigur mit dem Wappenschild
   von Winterhausen (grüne Tanne auf Silber, roter Bord) und Fahne.

   Winter: wie in Franken üblich ist das Wasser abgelassen und das Becken
   mit einer Bretterabdeckung winterfest gemacht. Auf den Brettern liegt
   ein Schneepolster mit sichtbarer Dicke, darauf stehen zwei kleine
   Tannen in Holzkübeln mit Lichterketten (abends/nachts an). Die Röhren
   tropfen nicht mehr, nur ein paar Eiszapfen hängen daran. Tannengrün mit
   roten Schleifen und Eiszapfen am Beckenrand, ein Kranz an der Säule,
   Schnee auf Figur und Kanten. Frühling: plätscherndes Wasser (M.lebendig: Strahlen, Tropfen,
   Ringe), Blumengirlanden mit bunten Eiern (wie ein fränkischer
   Osterbrunnen) und Blumentöpfe auf der Stufe.

   Maße: Stufe Ø 4,5 m, Becken Ø 3,9 m, Rand 0,74 m hoch, Wasser 0,56 m,
   Brunnenstock 0,68 m breit, Säule bis 3,3 m, Figur 1,45 m (bis ~4,9 m).
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT, PI = ST.pinsel;
  const KX = ST.KX, KY = ST.KY, KZ = ST.KZ, LICHT = ST.LICHT, AUGE = ST.ZUM_AUGE;
  const TAU = Math.PI * 2;

  /* ---------------- Helfer ---------------- */
  function blick(gier, s, ox, oy, oz) {
    const r = gier * Math.PI / 180, c = Math.cos(r), sn = Math.sin(r);
    const lx = -LICHT[0] / LICHT[2], ly = -LICHT[1] / LICHT[2];
    const X0 = ox || 0, Y0 = oy || 0, Z0 = oz || 0;
    return {
      c: c, sn: sn, s: s,
      p: function (x, y, z) { x -= X0; y -= Y0; z -= Z0; const a = x * c - y * sn, b = x * sn + y * c; return [(a - b) * KX * s, (a + b) * KY * s - z * KZ * s]; },
      tiefe: function (x, y, z) { return (x * c - y * sn + x * sn + y * c) * AUGE[0] + z * AUGE[2]; },
      waag: function (x, y) { return (x * c - y * sn + x * sn + y * c) * AUGE[0]; },
      n: function (x, y, z) { const l = Math.hypot(x, y, z) || 1; return [(x * c - y * sn) / l, (x * sn + y * c) / l, z / l]; },
      boden: function (x, y, z) { x -= X0; y -= Y0; const a = x * c - y * sn + lx * z, b = x * sn + y * c + ly * z; return [(a - b) * KX * s, (a + b) * KY * s]; }
    };
  }
  /* Kern-Lücke: beim Figurenschatten fehlt F.gier (kern.js, figurSchatten) */
  function mitGier(malen) {
    let merk = 0;
    return function (g, s, F) {
      if (F.gier != null && isFinite(F.gier)) merk = F.gier; else F = Object.assign({}, F, { gier: merk });
      return malen(g, s, F);
    };
  }
  function rgb(f, a) { return a == null ? "rgb(" + (f[0] | 0) + "," + (f[1] | 0) + "," + (f[2] | 0) + ")" : "rgba(" + (f[0] | 0) + "," + (f[1] | 0) + "," + (f[2] | 0) + "," + a + ")"; }
  function mul(f, k) { return [Math.min(255, f[0] * k[0]), Math.min(255, f[1] * k[1]), Math.min(255, f[2] * k[2])]; }
  function skal(f, k) { return [f[0] * k, f[1] * k, f[2] * k]; }
  function misch(a, b, k) { return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]; }
  function lichtK(n, Z, jahr) { return ST.lichtFaktor(ST.norm(n), Z, 0, jahr); }
  function phase(bau, a, b) { return Math.max(0, Math.min(1, (bau - a) / (b - a))); }
  function vieleck(g, pts) { g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]); g.closePath(); }
  function affin(g, V, o, eu, ev) {
    const p0 = V.p(o[0], o[1], o[2]), pu = V.p(o[0] + eu[0], o[1] + eu[1], o[2] + eu[2]), pv = V.p(o[0] + ev[0], o[1] + ev[1], o[2] + ev[2]);
    g.transform(pu[0] - p0[0], pu[1] - p0[1], pv[0] - p0[0], pv[1] - p0[1], p0[0], p0[1]);
  }
  function dazu(g, pts) {
    let fl = 0; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; fl += a[0] * b[1] - b[0] * a[1]; }
    if (fl < 0) pts = pts.slice().reverse();
    g.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]); g.closePath();
  }
  function huelle(pts) {
    pts = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    if (pts.length < 3) return pts;
    const kr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lo = [], hi = [];
    for (const p of pts) { while (lo.length >= 2 && kr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
    for (let i = pts.length - 1; i >= 0; i--) { const p = pts[i]; while (hi.length >= 2 && kr(hi[hi.length - 2], hi[hi.length - 1], p) <= 0) hi.pop(); hi.push(p); }
    hi.pop(); lo.pop(); return lo.concat(hi);
  }
  /* CPU-Leinwand: viele kleine Pfade dort malen, dann EIN drawImage
     (GPU-Leinwände sind bei tausenden Zeichenaufrufen sehr langsam) */
  function cpuLeinwand(W, H) { const c = document.createElement("canvas"); c.width = W; c.height = H; return [c, c.getContext("2d", { willReadFrequently: true })]; }
  function aufCpu(g, links, oben, breite, hoehe, fn) {
    const x0 = Math.floor(links), y0 = Math.floor(oben);
    const [c, cg] = cpuLeinwand(Math.max(1, Math.ceil(breite) + 2), Math.max(1, Math.ceil(hoehe) + 2));
    cg.translate(-x0, -y0); fn(cg); g.drawImage(c, x0, y0); c.width = c.height = 0;
  }
  /* Kern-Fläche „gebacken": den Werkstoff in eine CPU-Leinwand in
     Flächenauflösung malen und als ein Bild einsetzen */
  function gebacken(fn) {
    return function (g, F) {
      const sx = Math.max(1, F.pxU), sy = Math.max(1, F.pxV);
      const W = Math.ceil(F.w * sx) + 4, H = Math.ceil(F.h * sy) + 4;
      if (W * H > 6e6) return fn(g, F);
      const [c, cg] = cpuLeinwand(W, H);
      cg.scale(sx, sy); cg.translate(2 / sx, 2 / sy);
      fn(cg, F);
      g.drawImage(c, -2 / sx, -2 / sy, W / sx, H / sy);
      c.width = c.height = 0;
    };
  }
  /* eigenes Rauschen auf CPU-Leinwand (PI.rauschen nimmt eine GPU-Vorlage) */
  const RAUSCH = {};
  function rauschVorlage(saat) {
    if (RAUSCH[saat]) return RAUSCH[saat];
    const n = 96, [c, g] = cpuLeinwand(n, n), id = g.createImageData(n, n);
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      const a = x / n * TAU, b = y / n * TAU;
      const v = ST.fbm(Math.cos(a) * 1.3 + 3, Math.sin(a) * 1.3 + Math.cos(b) * 1.3 + saat, 4, saat) * 0.5 + ST.fbm(Math.sin(b) * 1.3 + 7, Math.cos(b) * 1.3 + Math.sin(a) * 1.3, 4, saat + 3) * 0.5;
      const w = Math.max(0, Math.min(255, (0.5 + (v - 0.5) * 2.2) * 255)), i = (y * n + x) * 4;
      id.data[i] = id.data[i + 1] = id.data[i + 2] = w; id.data[i + 3] = 255;
    }
    g.putImageData(id, 0, 0);
    return (RAUSCH[saat] = c);
  }
  function rauschen(g, x, y, w, h, meter, staerke, saat) {
    const m = g.createPattern(rauschVorlage(saat % 5), "repeat");
    m.setTransform(new DOMMatrix([meter / 96, 0, 0, meter / 96, (saat * 0.37) % meter, (saat * 0.61) % meter]));
    g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = staerke; g.fillStyle = m; g.fillRect(x, y, w, h); g.restore();
  }

  /* ---------------- Maße ---------------- */
  const RS = 2.25, ZS = 0.14;            // Sockelstufe
  const RA = 1.95, RI = 1.72;            // Becken außen / innen (Umkreisradius)
  const ZR0 = 0.62, ZR1 = 0.74;          // Randplatte unten / oben
  const ZW = 0.56;                       // Wasserspiegel
  const PB = 0.34, ZP = 1.45;            // Brunnenstock halbe Breite, Oberkante
  const SR = 0.17, ZS0 = 1.63, ZS1 = 3.12; // Säule
  const ZK = 3.3, ZF = 3.4;              // Kapitell, Figurenfuß
  const ROEHRE_Z = 1.12;
  const ZD = ZR1 + 0.05, PD = 0.09;      // Winterabdeckung: Brettoberkante, Schneedicke
  const STEIN = [178, 124, 98];          // Mainsandstein, rötlich
  const STEIN_HELL = [196, 150, 120];

  function ecke(r, k) { const a = (k + 0.5) * Math.PI / 4; return [r * Math.cos(a), r * Math.sin(a)]; }
  /* Achteckige Außenwand aus Kern-Flächen (Normale nach außen) */
  function achteckWand(M, r, z0, z1, malen, name, opt) {
    for (let k = 0; k < 8; k++) {
      const a = ecke(r, k), b = ecke(r, k + 1);
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u = [(a[0] - b[0]) / L, (a[1] - b[1]) / L, 0];
      M.flaeche(Object.assign({ name: name + k, o: [b[0], b[1], z1], u: u, v: [0, 0, -1], w: L, h: z1 - z0, malen: malen(k), ao: z0 < 0.05 }, opt || {}));
    }
  }
  /* Innenwand (Normale nach innen) */
  function achteckInnen(M, r, z0, z1, malen, name) {
    for (let k = 0; k < 8; k++) {
      const a = ecke(r, k), b = ecke(r, k + 1);
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u = [(b[0] - a[0]) / L, (b[1] - a[1]) / L, 0];
      M.flaeche({ name: name + k, o: [a[0], a[1], z1], u: u, v: [0, 0, -1], w: L, h: z1 - z0, malen: malen(k) });
    }
  }
  function achteckDeckel(M, r, z, malen, name, opt) {
    const um = []; for (let k = 0; k < 8; k++) { const p = ecke(r, k); um.push([p[0] + r, p[1] + r]); }
    M.flaeche(Object.assign({ name: name, o: [-r, -r, z], u: [1, 0, 0], v: [0, 1, 0], w: 2 * r, h: 2 * r, umriss: um, malen: malen }, opt || {}));
  }

  /* ---------------- Werkstoffe ---------------- */
  function sandstein(g, w, h, F, saat, opt) {
    opt = opt || {};
    const rng = ST.zufall(saat);
    const basis = opt.farbe || STEIN;
    g.fillStyle = rgb(skal(basis, 0.62)); g.fillRect(-0.05, -0.05, w + 0.1, h + 0.1);
    const lage = opt.lage || 0.3;
    let y = 0, r = 0;
    while (y < h - 0.005) {
      const lh = Math.min(lage * (0.85 + rng() * 0.3), h - y);
      let x = -(r % 2) * rng() * 0.3;
      while (x < w) {
        const lw = lage * (1.4 + rng() * 1.6), c = skal(basis, 0.88 + rng() * 0.2);
        const bx = Math.max(0, x) + 0.008, bw = Math.min(w, x + lw) - Math.max(0, x) - 0.016;
        if (bw > 0.02) {
          if (F.px * lh > 5) {
            const gr = g.createLinearGradient(0, y, 0, y + lh);
            gr.addColorStop(0, rgb(skal(c, 1.1))); gr.addColorStop(0.2, rgb(c)); gr.addColorStop(1, rgb(skal(c, 0.88)));
            g.fillStyle = gr;
          } else g.fillStyle = rgb(c);
          g.fillRect(bx, y + 0.008, bw, lh - 0.016);
          if (F.px > 60) { g.fillStyle = "rgba(60,30,20,0.12)"; for (let i = 0; i < 4; i++) g.fillRect(bx + rng() * bw, y + rng() * lh, 0.01 + rng() * 0.03, 0.006); }
        }
        x += lw;
      }
      y += lh; r++;
    }
    if (F.px > 14) rauschen(g, 0, 0, w, h, 1.4, 0.35, saat);
    /* Verwitterung: unten dunkler, grünlicher Anflug */
    if (opt.unten !== false) {
      const gr = g.createLinearGradient(0, h, 0, h - Math.min(h, 0.4));
      gr.addColorStop(0, "rgba(60,70,50,0.28)"); gr.addColorStop(1, "rgba(60,70,50,0)");
      g.fillStyle = gr; g.fillRect(0, h - 0.4, w, 0.4);
    }
  }

  /* Wappen von Winterhausen: Tanne auf Silber, roter Bord */
  function wappen(g, x, y, b, h, px) {
    g.save(); g.translate(x, y);
    const pfad = () => { g.beginPath(); g.moveTo(0, 0); g.lineTo(b, 0); g.lineTo(b, h * 0.55); g.quadraticCurveTo(b, h * 0.9, b / 2, h); g.quadraticCurveTo(0, h * 0.9, 0, h * 0.55); g.closePath(); };
    pfad(); g.fillStyle = "#b3262c"; g.fill();
    g.save(); g.translate(b * 0.1, h * 0.08); g.scale(0.8, 0.84); pfad(); g.fillStyle = "#e8e6df"; g.fill(); g.restore();
    if (px * b > 6) {
      g.fillStyle = "#2c6a3c";
      g.beginPath(); g.moveTo(b / 2, h * 0.15);
      for (let i = 0; i < 3; i++) { const yy = h * (0.35 + i * 0.17), ww = b * (0.16 + i * 0.07); g.lineTo(b / 2 + ww, yy); g.lineTo(b / 2 + ww * 0.4, yy); }
      g.lineTo(b / 2 + b * 0.05, h * 0.78); g.lineTo(b / 2 - b * 0.05, h * 0.78);
      for (let i = 2; i >= 0; i--) { const yy = h * (0.35 + i * 0.17), ww = b * (0.16 + i * 0.07); g.lineTo(b / 2 - ww * 0.4, yy); g.lineTo(b / 2 - ww, yy); }
      g.closePath(); g.fill();
      g.fillStyle = "#6b4a2a"; g.fillRect(b / 2 - b * 0.04, h * 0.74, b * 0.08, h * 0.1);
    }
    g.restore();
  }
  /* Löwenmaske aus Sandstein um die Röhre (Relief) */
  function loewenMaske(g, cx, cy, r, px) {
    const gr = g.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.1, cx, cy, r);
    gr.addColorStop(0, rgb(skal(STEIN_HELL, 1.12))); gr.addColorStop(1, rgb(skal(STEIN, 0.8)));
    g.fillStyle = gr;
    /* Mähne */
    g.beginPath(); for (let i = 0; i < 16; i++) { const a = i / 16 * TAU, rr = i % 2 ? r * 0.82 : r; g.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); } g.closePath(); g.fill();
    if (px * r < 4) return;
    g.fillStyle = rgb(skal(STEIN_HELL, 1.05)); g.beginPath(); g.ellipse(cx, cy + r * 0.05, r * 0.58, r * 0.66, 0, 0, TAU); g.fill();
    g.fillStyle = "rgba(50,25,15,0.55)";
    g.beginPath(); g.ellipse(cx - r * 0.22, cy - r * 0.2, r * 0.1, r * 0.06, 0, 0, TAU); g.fill();
    g.beginPath(); g.ellipse(cx + r * 0.22, cy - r * 0.2, r * 0.1, r * 0.06, 0, 0, TAU); g.fill();
    g.beginPath(); g.moveTo(cx - r * 0.12, cy + r * 0.05); g.lineTo(cx + r * 0.12, cy + r * 0.05); g.lineTo(cx, cy + r * 0.2); g.closePath(); g.fill();
    g.fillStyle = "rgba(20,10,5,0.75)"; g.beginPath(); g.arc(cx, cy + r * 0.35, r * 0.14, 0, TAU); g.fill();
  }

  /* ---------------- Röhren, Eis und Wasserstrahlen ---------------- */
  const RICHTUNGEN = [[1, 0], [0, 1], [-1, 0], [0, -1]];
  function strahlPunkt(d, t) {
    const h = PB + 0.3 + 0.62 * t, z = ROEHRE_Z + 0.1 * t - (ROEHRE_Z + 0.1 - ZW) * t * t;
    return [d[0] * h, d[1] * h, z];
  }
  function roehrenMalen(g, s, F, winter, eisAn) {
    if (F.schatten) return;
    const V = blick(F.gier, s), Z = F.Z, jahr = F.jahr;
    const liste = RICHTUNGEN.map((d) => { const nk = V.n(d[0], d[1], 0); return { d: d, sicht: nk[0] * AUGE[0] + nk[1] * AUGE[1], t: V.tiefe(d[0] * 0.5, d[1] * 0.5, ROEHRE_Z) }; })
      .filter((x) => x.sicht > -0.05).sort((a, b) => a.t - b.t);
    const km = lichtK([-0.5, 0.5, 0.7], Z, jahr);
    for (const { d } of liste) {
      /* Messingröhre */
      const a = V.p(d[0] * (PB - 0.02), d[1] * (PB - 0.02), ROEHRE_Z), b = V.p(d[0] * (PB + 0.3), d[1] * (PB + 0.3), ROEHRE_Z + 0.02);
      g.lineCap = "round";
      g.strokeStyle = rgb(mul([150, 112, 50], km)); g.lineWidth = Math.max(1, 0.055 * s); g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
      g.strokeStyle = rgb(mul([236, 200, 120], km)); g.lineWidth = Math.max(0.5, 0.018 * s); g.beginPath(); g.moveTo(a[0], a[1] - 0.012 * s); g.lineTo(b[0], b[1] - 0.012 * s); g.stroke();
      if (winter && eisAn) {
        /* Wasser abgestellt: nur ein paar Eiszapfen an der Röhre, durchscheinend
           mit hellem Glanzstreif (kein gefrorener Strahl mehr – der las sich
           wie fließendes Wasser) */
        const kE = lichtK([0, 0.6, 0.8], Z, jahr);
        for (let i = 0; i < 3; i++) {
          const u = PB + 0.12 + i * 0.075, q = V.p(d[0] * u, d[1] * u, ROEHRE_Z - 0.015);
          const l = (0.05 + [0.07, 0.11, 0.04][i]) * KZ * s, w = Math.max(0.5, 0.011 * s);
          g.fillStyle = rgb(mul([196, 222, 242], kE), 0.62); g.beginPath(); g.moveTo(q[0] - w, q[1]); g.quadraticCurveTo(q[0] - w * 0.3, q[1] + l * 0.6, q[0], q[1] + l); g.quadraticCurveTo(q[0] + w * 0.3, q[1] + l * 0.6, q[0] + w, q[1]); g.closePath(); g.fill();
          if (s > 40) { g.strokeStyle = "rgba(255,255,255,0.8)"; g.lineWidth = Math.max(0.4, 0.004 * s); g.beginPath(); g.moveTo(q[0] - w * 0.35, q[1]); g.lineTo(q[0] - w * 0.1, q[1] + l * 0.7); g.stroke(); }
        }
      }
    }
  }

  function strahlerMalen(g, V, F) {
    const s = V.s, k = lichtK([0, 0.5, 0.8], F.Z, F.jahr);
    for (const [x, y] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) {
      const px = x * (PB + 0.02), py = y * (PB + 0.02), nk = V.n(x, y, 0);
      if (nk[0] * AUGE[0] + nk[1] * AUGE[1] < -0.2) continue;
      const q = V.p(px, py, ZP + 0.1), r = Math.max(0.8, 0.035 * s);
      g.fillStyle = rgb(mul([40, 42, 46], k)); g.beginPath(); g.ellipse(q[0], q[1] - r * 0.6, r, r * 0.8, 0, 0, TAU); g.fill();
      if (F.nacht > 0) {
        g.fillStyle = "rgba(255,244,214," + F.nacht + ")"; g.beginPath(); g.ellipse(q[0], q[1] - r * 0.9, r * 0.6, r * 0.35, 0, 0, TAU); g.fill();
        if (F.leuchtPunkt) F.leuchtPunkt(q[0], q[1] - r, 0.5 * s, "255,210,150", 0.35, false);
      }
    }
  }

  /* ---------------- Kranz um die Säule (hinten / vorn getrennt) ---------------- */
  function kranzMalen(g, s, F, winter, vorn, z0) {
    if (F.schatten) return;
    const V = blick(F.gier, s), Z = F.Z, jahr = F.jahr;
    const R = SR + 0.07, n = Math.max(28, Math.round(R * s * 2.2));
    const rng = ST.zufall(5);
    for (let i = 0; i < n; i++) {
      const w = i / n * TAU, x = Math.cos(w) * R, y = Math.sin(w) * R;
      if ((V.waag(x, y) >= 0) !== vorn) { rng(); rng(); continue; }
      const p = V.p(x, y, z0 + (rng() - 0.5) * 0.05), k = lichtK(V.n(Math.cos(w), Math.sin(w), 0.5), Z, jahr);
      const c = winter ? [30 + rng() * 14, 70 + rng() * 20, 42] : [62 + rng() * 18, 120 + rng() * 20, 52];
      g.fillStyle = rgb(mul(c, k)); g.beginPath(); g.ellipse(p[0], p[1], Math.max(0.8, 0.07 * s), Math.max(0.6, 0.045 * s), rng() * 3, 0, TAU); g.fill();
      if (i % 5 === 0) {
        const bunt = winter ? [180, 20, 34] : [[230, 60, 80], [250, 210, 50], [80, 150, 220], [240, 140, 40]][(i / 5) % 4 | 0];
        g.fillStyle = rgb(mul(bunt, k));
        if (winter) { g.beginPath(); g.arc(p[0], p[1] - 0.02 * s, Math.max(0.6, 0.03 * s), 0, TAU); g.fill(); }
        else { g.beginPath(); g.ellipse(p[0], p[1] + 0.03 * s, Math.max(0.6, 0.028 * s), Math.max(0.8, 0.038 * s), 0, 0, TAU); g.fill(); }
      }
      if (winter && i % 3 === 0) { g.fillStyle = rgb(mul([246, 249, 255], k), 0.9); g.beginPath(); g.ellipse(p[0], p[1] - 0.03 * s, Math.max(0.6, 0.04 * s), Math.max(0.4, 0.014 * s), 0, 0, TAU); g.fill(); }
    }
    if (vorn && winter) {
      /* rote Samtschleife vorn */
      const nk = [AUGE[0], AUGE[1]];
      const w = Math.atan2(nk[1], nk[0]) - Math.atan2(V.sn, V.c);
      const p = V.p(Math.cos(w) * (R + 0.03), Math.sin(w) * (R + 0.03), z0 - 0.02), r = 0.1 * s;
      g.fillStyle = rgb(mul([168, 16, 28], lichtK([0.4, 0.4, 0.8], Z, jahr)));
      g.beginPath(); g.moveTo(p[0], p[1]); g.bezierCurveTo(p[0] - r, p[1] - r * 0.8, p[0] - r * 1.1, p[1] + r * 0.3, p[0], p[1]); g.fill();
      g.beginPath(); g.moveTo(p[0], p[1]); g.bezierCurveTo(p[0] + r, p[1] - r * 0.8, p[0] + r * 1.1, p[1] + r * 0.3, p[0], p[1]); g.fill();
      g.fillRect(p[0] - r * 0.25, p[1], r * 0.18, r * 1.3); g.fillRect(p[0] + r * 0.08, p[1], r * 0.18, r * 1.2);
    }
  }

  /* ---------------- Die Ritterfigur ----------------
     Glieder als gerundete Walzen im Raum (Gelenkpunkte in Metern),
     nach Tiefe sortiert; Rundung durch drei Striche: Schatten, Grundton,
     Glanz zur Lichtseite. Bemalt („gefasst"), aber verwittert. */
  function ritterMalen(g, s, F, winter, anteil) {
    /* nachts von unten warm angestrahlt (Strahler auf dem Brunnenstock) */
    const lichtKF = (n, Z, jahr) => { const k = lichtK(n, Z, jahr), w = F.nacht * 0.5 * (0.6 + 0.4 * Math.max(0, -ST.norm(n)[2] + 0.5)); return [k[0] + w, k[1] + w * 0.78, k[2] + w * 0.52]; };
    const V = blick(F.gier, s, 0, 0, 0), Z = F.Z, jahr = F.jahr;
    const P = (x, y, z) => V.p(x, y, ZF + z);
    if (F.schatten) {
      const T = g.getTransform(); g.setTransform(1, 0, 0, 1, T.e, T.f); g.fillStyle = "#000"; g.beginPath();
      const B = (x, y, z) => V.boden(x, y, ZF + z);
      dazu(g, huelle([B(-0.2, -0.1, 0), B(0.2, -0.1, 0), B(0.2, 0.15, 0), B(-0.2, 0.15, 0), B(-0.2, 0, 1.2), B(0.2, 0, 1.2), B(0, 0, 1.5), B(0.24, 0.18, 1.95)]));
      g.fill(); return;
    }
    const verw = (f) => misch(f, STEIN_HELL, 0.28);         // Farbe etwas verblasst
    const RUEST = verw([150, 152, 160]), ROCK = verw([150, 34, 38]), MANTEL = verw([48, 66, 112]), HAUT = verw([214, 172, 140]), GOLD = verw([200, 160, 70]), LEDER = verw([100, 70, 44]);
    const teile = [];
    const glied = (a, b, dicke, farbe, nx, ny) => teile.push({ art: 0, a: a, b: b, d: dicke, f: farbe, n: [nx || 0, ny || 1, 0.2], t: V.tiefe((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2) });
    /* Mantel hinten */
    teile.push({ art: 1, t: V.tiefe(0, -0.12, 0.7) - 0.3 });
    /* Beine in Rüstung (Beinschienen, Kniekacheln) */
    glied([-0.085, 0.02, 0.06], [-0.085, 0.03, 0.43], 0.1, RUEST); glied([-0.085, 0.03, 0.43], [-0.075, 0, 0.8], 0.12, RUEST);
    glied([0.085, 0.02, 0.06], [0.095, 0.03, 0.43], 0.1, RUEST); glied([0.095, 0.03, 0.43], [0.075, 0, 0.8], 0.12, RUEST);
    teile.push({ art: 7, t: V.tiefe(0, 0.06, 0.44) });
    /* Schuhe */
    glied([-0.09, 0.0, 0.03], [-0.09, 0.12, 0.03], 0.07, LEDER); glied([0.1, 0.0, 0.03], [0.11, 0.12, 0.03], 0.07, LEDER);
    /* Schwert an der linken Hüfte */
    teile.push({ art: 8, t: V.tiefe(-0.16, 0.02, 0.6) });
    /* Oberkörper: Brustpanzer, darüber der Waffenrock */
    teile.push({ art: 9, t: V.tiefe(0, 0.03, 1.0) });
    teile.push({ art: 2, t: V.tiefe(0, 0.06, 0.7) });
    /* Gürtel */
    teile.push({ art: 3, t: V.tiefe(0, 0.09, 0.84) });
    /* Hals, Kopf */
    glied([0, 0, 1.2], [0, 0.01, 1.3], 0.08, HAUT);
    teile.push({ art: 4, t: V.tiefe(0, 0.02, 1.4) });
    /* rechter Arm hält die Fahne, linker den Schild */
    glied([0.18, 0, 1.18], [0.24, 0.08, 0.98], 0.085, RUEST); glied([0.24, 0.08, 0.98], [0.21, 0.18, 1.02], 0.075, RUEST);
    glied([-0.18, 0, 1.18], [-0.24, 0.06, 0.97], 0.085, RUEST); glied([-0.24, 0.06, 0.97], [-0.18, 0.15, 0.92], 0.075, RUEST);
    /* Schulterstücke */
    glied([0.15, 0, 1.19], [0.21, 0.01, 1.17], 0.1, RUEST); glied([-0.15, 0, 1.19], [-0.21, 0.01, 1.17], 0.1, RUEST);
    teile.push({ art: 5, t: V.tiefe(0.21, 0.19, 0.9) });   // Fahnenstange
    teile.push({ art: 6, t: V.tiefe(-0.2, 0.2, 0.88) });   // Schild
    teile.sort((a, b) => a.t - b.t);
    const lschirm = [-0.87, -0.49];
    const walze = (a, b, d, f, n) => {
      const A = P(a[0], a[1], a[2]), B = P(b[0], b[1], b[2]), w = Math.max(1, d * s);
      const k = lichtKF(V.n(n[0], n[1], n[2]), Z, jahr);
      g.lineCap = "round";
      g.strokeStyle = rgb(mul(f, skal(k, 0.62))); g.lineWidth = w; g.beginPath(); g.moveTo(A[0], A[1]); g.lineTo(B[0], B[1]); g.stroke();
      const ox = lschirm[0] * w * 0.14, oy = lschirm[1] * w * 0.14;
      g.strokeStyle = rgb(mul(f, k)); g.lineWidth = w * 0.72; g.beginPath(); g.moveTo(A[0] + ox, A[1] + oy); g.lineTo(B[0] + ox, B[1] + oy); g.stroke();
      if (w > 3) { g.strokeStyle = rgb(mul(misch(f, [255, 250, 240], 0.35), k), 0.8); g.lineWidth = w * 0.22; g.beginPath(); g.moveTo(A[0] + ox * 2.4, A[1] + oy * 2.4); g.lineTo(B[0] + ox * 2.4, B[1] + oy * 2.4); g.stroke(); }
    };
    const schnee = rgb(mul([246, 249, 255], lichtKF([0, 0.2, 1], Z, jahr)));
    for (const e of teile) {
      if (e.art === 0) walze(e.a, e.b, e.d, e.f, e.n);
      else if (e.art === 1) {
        /* Mantel: von den Schultern bis fast zum Boden, hinten */
        const k = lichtKF(V.n(0, -1, 0.3), Z, jahr);
        const q = [P(-0.24, -0.06, 1.2), P(0.24, -0.06, 1.2), P(0.26, -0.12, 0.12), P(-0.26, -0.12, 0.12)];
        g.fillStyle = rgb(mul(MANTEL, skal(k, 0.9))); vieleck(g, q); g.fill();
      } else if (e.art === 2) {
        /* Waffenrock: Trapez von der Hüfte bis zum Knie */
        const k = lichtKF(V.n(0, 1, 0.2), Z, jahr);
        const q = [P(-0.16, 0.05, 0.88), P(0.16, 0.05, 0.88), P(0.21, 0.07, 0.46), P(-0.21, 0.07, 0.46)];
        const gr = g.createLinearGradient(q[0][0], 0, q[1][0], 0);
        gr.addColorStop(0, rgb(mul(ROCK, k))); gr.addColorStop(1, rgb(mul(ROCK, skal(k, 0.7))));
        g.fillStyle = gr; vieleck(g, q); g.fill();
        g.strokeStyle = rgb(mul(GOLD, k)); g.lineWidth = Math.max(0.6, 0.02 * s); g.beginPath(); g.moveTo(q[3][0], q[3][1]); g.lineTo(q[2][0], q[2][1]); g.stroke();
      } else if (e.art === 7) {
        /* Kniekacheln */
        const k = lichtKF(V.n(0, 1, 0.4), Z, jahr);
        for (const sx of [-1, 1]) { const q = P(sx * 0.09, 0.07, 0.44); g.fillStyle = rgb(mul(misch(RUEST, [255, 255, 255], 0.2), k)); g.beginPath(); g.ellipse(q[0], q[1], 0.06 * s, 0.05 * s, 0, 0, TAU); g.fill(); }
      } else if (e.art === 8) {
        /* Schwert in der Scheide, schräg an der Hüfte */
        const a = P(-0.17, 0.02, 0.82), b = P(-0.25, -0.04, 0.3), k = lichtKF(V.n(-1, 0.5, 0), Z, jahr);
        g.lineCap = "round"; g.strokeStyle = rgb(mul(LEDER, k)); g.lineWidth = Math.max(0.8, 0.035 * s); g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
        const h1 = P(-0.12, 0.05, 0.9), h2 = P(-0.22, -0.01, 0.84); g.strokeStyle = rgb(mul(GOLD, k)); g.lineWidth = Math.max(0.6, 0.02 * s); g.beginPath(); g.moveTo(h1[0], h1[1]); g.lineTo(h2[0], h2[1]); g.stroke();
      } else if (e.art === 9) {
        /* Brustpanzer: Schultern breit, zur Taille schmaler, gewölbt schattiert */
        const k = lichtKF(V.n(0, 1, 0.2), Z, jahr), kS = lichtKF(V.n(0.8, 0.3, 0.1), Z, jahr), kL = lichtKF(V.n(-0.8, 0.5, 0.2), Z, jahr);
        const q = [P(-0.19, 0.02, 1.2), P(0.19, 0.02, 1.2), P(0.14, 0.05, 0.86), P(-0.14, 0.05, 0.86)];
        const gr = g.createLinearGradient(q[0][0], 0, q[1][0], 0);
        gr.addColorStop(0, rgb(mul(RUEST, kL))); gr.addColorStop(0.45, rgb(mul(misch(RUEST, [255, 255, 255], 0.25), k))); gr.addColorStop(1, rgb(mul(RUEST, skal(kS, 0.8))));
        g.fillStyle = gr; vieleck(g, q); g.fill();
        /* Waffenrock-Oberteil (rot, mit Goldkante) über der Brust */
        const r2 = [P(-0.13, 0.06, 1.14), P(0.13, 0.06, 1.14), P(0.13, 0.07, 0.86), P(-0.13, 0.07, 0.86)];
        const gr2 = g.createLinearGradient(r2[0][0], 0, r2[1][0], 0);
        gr2.addColorStop(0, rgb(mul(ROCK, kL))); gr2.addColorStop(1, rgb(mul(ROCK, skal(kS, 0.8))));
        g.fillStyle = gr2; vieleck(g, r2); g.fill();
        g.strokeStyle = rgb(mul(GOLD, k)); g.lineWidth = Math.max(0.5, 0.012 * s); g.stroke();
        if (s > 60) { g.save(); affin(g, V, [-0.07, 0.075, ZF + 1.1], [1, 0, 0], [0, 0, -1]); wappen(g, 0, 0, 0.14, 0.17, s); g.restore(); }
      } else if (e.art === 3) {
        const a = P(-0.16, 0.06, 0.84), b = P(0.16, 0.06, 0.84);
        g.strokeStyle = rgb(mul(LEDER, lichtKF(V.n(0, 1, 0), Z, jahr))); g.lineWidth = Math.max(0.8, 0.04 * s); g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
      } else if (e.art === 4) {
        /* Kopf mit Barett (Federhut) */
        const m = P(0, 0.02, 1.39), r = 0.1 * s;
        const gr = g.createRadialGradient(m[0] - r * 0.35, m[1] - r * 0.3, r * 0.1, m[0], m[1], r * 1.1);
        gr.addColorStop(0, rgb(mul(HAUT, lichtKF([-0.5, 0.5, 0.7], Z, jahr)))); gr.addColorStop(1, rgb(mul(HAUT, skal(lichtKF([0.5, 0.5, 0.2], Z, jahr), 0.8))));
        g.fillStyle = gr; g.beginPath(); g.ellipse(m[0], m[1], r * 0.82, r, 0, 0, TAU); g.fill();
        /* Bart */
        g.fillStyle = rgb(mul(verw([120, 90, 60]), lichtKF([0, 1, 0.3], Z, jahr))); g.beginPath(); g.ellipse(m[0], m[1] + r * 0.55, r * 0.5, r * 0.4, 0, 0, Math.PI); g.fill();
        /* Barett */
        const kB = lichtKF([0, 0.3, 1], Z, jahr);
        g.fillStyle = rgb(mul(verw([40, 40, 46]), kB)); g.beginPath(); g.ellipse(m[0], m[1] - r * 0.7, r * 1.15, r * 0.42, -0.15, 0, TAU); g.fill();
        g.fillStyle = rgb(mul(verw([230, 226, 214]), kB)); g.beginPath(); g.ellipse(m[0] + r * 0.7, m[1] - r * 1.05, r * 0.2, r * 0.55, 0.6, 0, TAU); g.fill();
        if (winter) { g.fillStyle = schnee; g.beginPath(); g.ellipse(m[0], m[1] - r * 0.95, r * 0.95, r * 0.25, -0.15, 0, TAU); g.fill(); }
        if (s > 70) { g.fillStyle = "rgba(40,25,20,0.7)"; g.fillRect(m[0] - r * 0.4, m[1] - r * 0.05, r * 0.18, r * 0.08); g.fillRect(m[0] + r * 0.2, m[1] - r * 0.05, r * 0.18, r * 0.08); }
      } else if (e.art === 5) {
        /* Fahnenstange mit Wimpel (Wappenfarben) */
        const a = P(0.21, 0.19, 0.05), b = P(0.21, 0.19, 1.95), k = lichtKF(V.n(-1, 1, 0), Z, jahr);
        g.strokeStyle = rgb(mul(verw([110, 76, 46]), k)); g.lineWidth = Math.max(0.8, 0.03 * s); g.lineCap = "round"; g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
        const sp = P(0.21, 0.19, 2.02); g.fillStyle = rgb(mul(GOLD, k)); g.beginPath(); g.arc(sp[0], sp[1], Math.max(0.8, 0.035 * s), 0, TAU); g.fill();
        g.save(); affin(g, V, [0.21, 0.19, ZF + 1.9], [1, 0, 0], [0, 0, -1]);
        const kW = lichtKF(V.n(0, 1, 0), Z, jahr);
        g.fillStyle = rgb(mul(verw([200, 40, 44]), kW)); g.beginPath(); g.moveTo(0, 0); g.lineTo(0.55, 0.06); g.lineTo(0.42, 0.14); g.lineTo(0.55, 0.22); g.lineTo(0, 0.28); g.closePath(); g.fill();
        g.fillStyle = rgb(mul(verw([232, 230, 222]), kW)); g.fillRect(0, 0.1, 0.4, 0.08);
        if (winter) { g.fillStyle = schnee; g.fillRect(0, -0.015, 0.5, 0.025); }
        g.restore();
      } else if (e.art === 6) {
        /* Wappenschild vor dem linken Unterarm */
        const u = ST.norm([0.96, 0.28, 0]);
        g.save(); affin(g, V, [-0.2 - u[0] * 0.15, 0.2 - u[1] * 0.15, ZF + 1.08], u, [0, 0, -1]);
        const kS = lichtKF(V.n(-u[1], u[0], 0), Z, jahr);
        wappen(g, 0, 0, 0.3, 0.38, s);
        g.globalCompositeOperation = "multiply"; g.fillStyle = rgb(skal(kS, 255)); g.fillRect(-0.01, -0.01, 0.33, 0.41); g.globalCompositeOperation = "source-over";
        if (winter) { g.fillStyle = schnee; g.fillRect(0, -0.015, 0.3, 0.03); }
        g.restore();
      }
    }
    if (winter) {
      /* Schnee auf den Schultern */
      g.fillStyle = schnee;
      for (const sx of [-1, 1]) { const q = P(sx * 0.15, 0, 1.23); g.beginPath(); g.ellipse(q[0], q[1], 0.09 * s, 0.03 * s, 0, 0, TAU); g.fill(); }
    }
    void anteil;
  }

  /* ---------------- Blumentopf (Frühling) als Figur ---------------- */
  function topfMalen(g, s, F, farbe) {
    if (F.schatten) { g.fillStyle = "#000"; g.beginPath(); g.ellipse(0, -0.2 * s, 0.22 * s, 0.25 * s, 0, 0, TAU); g.fill(); return; }
    const Z = F.Z, jahr = F.jahr, k = lichtK([-0.3, 0.6, 0.7], Z, jahr), m = s;
    /* Terrakotta-Topf */
    const gr = g.createLinearGradient(-0.2 * m, 0, 0.2 * m, 0);
    gr.addColorStop(0, rgb(mul([196, 110, 70], skal(k, 1.1)))); gr.addColorStop(1, rgb(mul([150, 76, 48], skal(k, 0.8))));
    g.fillStyle = gr; g.beginPath(); g.moveTo(-0.16 * m, 0); g.lineTo(-0.2 * m, -0.3 * KZ * m); g.lineTo(0.2 * m, -0.3 * KZ * m); g.lineTo(0.16 * m, 0); g.ellipse(0, 0, 0.16 * m, 0.08 * m, 0, 0, Math.PI); g.fill();
    g.fillStyle = rgb(mul([206, 124, 84], k)); g.beginPath(); g.ellipse(0, -0.3 * KZ * m, 0.21 * m, 0.1 * m, 0, 0, TAU); g.fill();
    /* Blätter und Blüten */
    const rng = ST.zufall(farbe[0] + farbe[1]);
    for (let i = 0; i < 26; i++) {
      const a = rng() * TAU, r = rng() * 0.17 * m, x = Math.cos(a) * r, y = -0.33 * KZ * m + Math.sin(a) * r * 0.5 - rng() * 0.16 * m;
      g.fillStyle = rgb(mul([56 + rng() * 20, 110 + rng() * 20, 46], k)); g.beginPath(); g.ellipse(x, y, Math.max(0.8, 0.05 * m), Math.max(0.6, 0.03 * m), a, 0, TAU); g.fill();
    }
    for (let i = 0; i < 14; i++) {
      const a = rng() * TAU, r = rng() * 0.15 * m, x = Math.cos(a) * r, y = -0.4 * KZ * m + Math.sin(a) * r * 0.5 - rng() * 0.18 * m;
      g.fillStyle = rgb(mul(farbe, k)); g.beginPath(); g.arc(x, y, Math.max(0.8, 0.035 * m), 0, TAU); g.fill();
      if (m > 50) { g.fillStyle = rgb(mul([250, 230, 120], k)); g.beginPath(); g.arc(x, y, 0.01 * m, 0, TAU); g.fill(); }
    }
  }

  /* Nachts: Strahler auf dem Gesims leuchten die Säule von unten an */
  function anstrahlen(g, F) {
    const gr = g.createLinearGradient(0, F.h, 0, 0);
    gr.addColorStop(0, "rgba(255,206,150," + (0.42 * F.nacht) + ")"); gr.addColorStop(0.5, "rgba(255,196,130," + (0.2 * F.nacht) + ")"); gr.addColorStop(1, "rgba(255,190,120," + (0.08 * F.nacht) + ")");
    g.globalCompositeOperation = "lighter"; g.fillStyle = gr; g.fillRect(0, 0, F.w, F.h); g.globalCompositeOperation = "source-over";
  }

  /* ---------------- Grube (Bauphase) ---------------- */
  function grubeMalen(g, V, F, r, tiefe, fuell) {
    if (F.schatten) return;
    const Z = F.Z, jahr = F.jahr, s = V.s;
    const loch = []; for (let k = 0; k < 8; k++) loch.push(ecke(r, k));
    const oben = loch.map((q) => V.p(q[0], q[1], 0));
    const bo = fuell != null ? fuell : -tiefe;
    g.save(); vieleck(g, oben); g.clip();
    vieleck(g, loch.map((q) => V.p(q[0], q[1], bo)));
    g.fillStyle = rgb(mul(fuell != null ? [168, 166, 158] : [92, 70, 52], skal(lichtK([0, 0, 1], Z, jahr), fuell != null ? 0.9 : 0.62))); g.fill();
    for (let i = 0; i < 8; i++) {
      const a = loch[i], b = loch[(i + 1) % 8];
      const nx = -(b[1] - a[1]), ny = b[0] - a[0];
      const nk = V.n(-nx, -ny, 0);
      if (nk[0] * AUGE[0] + nk[1] * AUGE[1] <= 0) continue;
      vieleck(g, [V.p(a[0], a[1], 0), V.p(b[0], b[1], 0), V.p(b[0], b[1], bo), V.p(a[0], a[1], bo)]);
      g.fillStyle = rgb(mul([112, 86, 62], skal(lichtK(nk, Z, jahr), 0.8))); g.fill();
      if (s > 20) { g.strokeStyle = "rgba(40,28,18,0.3)"; g.lineWidth = Math.max(0.6, s * 0.012); for (let j = 1; j < 4; j++) { const p1 = V.p(a[0], a[1], bo * j / 4), p2 = V.p(b[0], b[1], bo * j / 4); g.beginPath(); g.moveTo(p1[0], p1[1]); g.lineTo(p2[0], p2[1]); g.stroke(); } }
    }
    g.restore();
    g.strokeStyle = "rgba(92,72,52,0.6)"; g.lineWidth = Math.max(1, s * 0.12); g.lineJoin = "round"; vieleck(g, oben); g.stroke();
  }

  /* ---------------- Winterabdeckung ----------------
     Bretter (Fichte, vergraut) auf dem Beckenrand, darauf ein Schneepolster
     mit echter Dicke: eigene Deckfläche mit unregelmäßigem Umriss und
     Seitenflächen rundherum. Am Rand bleiben die Bretter teils frei
     (dort hat der Wind den Schnee abgetragen). */
  function bretter(g, w, h, F, saat) {
    const rng = ST.zufall(saat);
    g.fillStyle = "rgb(58,46,36)"; g.fillRect(-0.05, -0.05, w + 0.1, h + 0.1);
    for (let y = 0; y < h; y += 0.19) {
      const c = [124 + rng() * 22, 104 + rng() * 16, 82 + rng() * 12];
      g.fillStyle = rgb(c); g.fillRect(0, y + 0.006, w, 0.178);
      if (F.px > 25) {
        g.strokeStyle = rgb(skal(c, 0.8), 0.6); g.lineWidth = Math.max(0.003, 0.7 / F.px);
        for (let i = 0; i < 4; i++) { const yy = y + 0.03 + rng() * 0.13; g.beginPath(); g.moveTo(0, yy); for (let x = 0.4; x < w + 0.4; x += 0.4) g.lineTo(x, yy + (rng() - 0.5) * 0.012); g.stroke(); }
        g.fillStyle = "rgba(50,34,24,0.5)"; for (let i = 0; i < 2; i++) { g.beginPath(); g.ellipse(rng() * w, y + 0.05 + rng() * 0.09, 0.018, 0.011, 0, 0, TAU); g.fill(); }
      }
    }
    if (F.px > 14) rauschen(g, 0, 0, w, h, 1.2, 0.3, saat % 50);
  }
  /* Randabstand des Schneepolsters zur Beckenkante: Achteck-Radius in
     Richtung a (Kantenmitten bei k·45°), minus unregelmäßiger Rand */
  function achteckRadius(r, a) {
    const d = ((a % (Math.PI / 4)) + Math.PI / 4) % (Math.PI / 4), dm = Math.min(d, Math.PI / 4 - d);
    return r * Math.cos(Math.PI / 8) / Math.cos(dm);
  }
  function abdeckungBauen(M, saat) {
    const R = RA + 0.02;
    /* Bretterkante (4 cm) und Bretter */
    achteckWand(M, R, ZR1, ZD, (k) => function (g, F) {
      g.fillStyle = "rgb(112,92,70)"; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1);
      g.fillStyle = "rgba(40,28,20,0.55)"; for (let x = 0.09 + (k % 3) * 0.05; x < F.w; x += 0.19) g.fillRect(x, 0, 0.01, F.h);
      g.fillStyle = "rgba(246,249,255,0.9)"; g.fillRect(0, 0, F.w, Math.min(0.012, F.h * 0.3));
    }, "deckel-kante");
    achteckDeckel(M, R, ZD, gebacken(function (g, F) { bretter(g, F.w, F.h, F, saat + 5); }), "deckel");
    /* Schneepolster */
    const N = 36, pts = [];
    for (let i = 0; i < N; i++) {
      const a = i / N * TAU, rr = achteckRadius(R, a) - (0.07 + 0.2 * (0.5 + 0.5 * ST.rausch(i * 0.55, saat % 17, 5)));
      pts.push([Math.cos(a) * rr, Math.sin(a) * rr]);
    }
    const zO = ZD + PD;
    for (let i = 0; i < N; i++) {
      const a = pts[i], b = pts[(i + 1) % N], L = Math.hypot(b[0] - a[0], b[1] - a[1]);
      M.flaeche({ name: "polster-seite" + i, o: [b[0], b[1], zO], u: [(a[0] - b[0]) / L, (a[1] - b[1]) / L, 0], v: [0, 0, -1], w: L, h: PD, ebene: 1, lichtExtra: 0.04, malen: function (g, F) {
        const gr = g.createLinearGradient(0, 0, 0, F.h);
        gr.addColorStop(0, "rgb(246,248,252)"); gr.addColorStop(0.55, "rgb(226,233,244)"); gr.addColorStop(1, "rgb(196,208,226)");
        g.fillStyle = gr; g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1);
      } });
    }
    M.flaeche({ name: "polster", o: [-R, -R, zO], u: [1, 0, 0], v: [0, 1, 0], w: 2 * R, h: 2 * R, ebene: 2, lichtExtra: 0.05, umriss: pts.map((p) => [p[0] + R, p[1] + R]), malen: gebacken(function (g, F) {
      const rng = ST.zufall(saat + 41);
      g.fillStyle = "rgb(247,249,253)"; g.fillRect(0, 0, F.w, F.h);
      /* weiche Rundung zur Kante hin: bläulicher Saum innen am Umriss */
      g.save(); g.beginPath(); pts.forEach((p, i) => (i ? g.lineTo(p[0] + R, p[1] + R) : g.moveTo(p[0] + R, p[1] + R))); g.closePath();
      g.strokeStyle = "rgba(186,200,224,0.45)"; g.lineWidth = 0.16; g.stroke();
      g.strokeStyle = "rgba(206,218,236,0.5)"; g.lineWidth = 0.07; g.stroke(); g.restore();
      /* Windrippeln und Glitzer */
      g.strokeStyle = "rgba(200,212,232,0.35)"; g.lineWidth = 0.012;
      for (let i = 0; i < 14; i++) { const x = R + (rng() - 0.5) * 2.4, y = R + (rng() - 0.5) * 2.4, l = 0.2 + rng() * 0.4; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + l / 2, y - 0.04, x + l, y + 0.01); g.stroke(); }
      if (F.px > 40) { g.fillStyle = "rgba(255,255,255,1)"; for (let i = 0; i < 90; i++) g.fillRect(rng() * F.w, rng() * F.h, 0.012, 0.012); }
    }) });
  }
  /* Kleine Tanne im Holzkübel (etwa 1,3 m) mit Schnee und Lichterkette.
     Als Figur gemalt: Kübel und Nadelkegel sind drehsymmetrisch, nur das
     Licht kommt aus der Welt (links hell, rechts im Schatten). */
  function baeumchenMalen(g, s, F, saat) {
    const Z = F.Z, jahr = F.jahr, rng = ST.zufall(saat * 31 + 7);
    const tiers = 6, spitze = 1.42;
    if (F.schatten) {
      g.fillStyle = "#000"; g.beginPath(); g.moveTo(-0.2 * s, 0); g.lineTo(-0.2 * s, -0.3 * KZ * s); g.lineTo(-0.46 * s, -0.36 * KZ * s);
      g.lineTo(0, -spitze * KZ * s); g.lineTo(0.46 * s, -0.36 * KZ * s); g.lineTo(0.2 * s, -0.3 * KZ * s); g.lineTo(0.2 * s, 0); g.closePath(); g.fill(); return;
    }
    const kL = lichtK([-0.62, 0.62, 0.35], Z, jahr), kV = lichtK([0.62, 0.62, 0.35], Z, jahr), kR = lichtK([0.62, -0.62, 0.35], Z, jahr), kO = lichtK([0, 0, 1], Z, jahr);
    const nacht = F.nacht || 0, an = nacht > 0.05;
    /* Holzkübel mit zwei Eisenbändern */
    const rK = 0.19 * s, hK = 0.3 * KZ * s, holz = [118, 84, 54];
    const gk = g.createLinearGradient(-rK, 0, rK, 0);
    gk.addColorStop(0, rgb(mul(holz, kL))); gk.addColorStop(0.45, rgb(mul(holz, kV))); gk.addColorStop(1, rgb(mul(holz, skal(kR, 0.9))));
    g.fillStyle = gk; g.beginPath(); g.moveTo(-rK * 0.9, 0); g.lineTo(-rK, -hK); g.lineTo(rK, -hK); g.lineTo(rK * 0.9, 0); g.ellipse(0, 0, rK * 0.9, rK * 0.45, 0, 0, Math.PI); g.closePath(); g.fill();
    if (s > 30) { g.strokeStyle = "rgba(40,26,16,0.45)"; g.lineWidth = Math.max(0.5, 0.006 * s); for (let i = -3; i <= 3; i++) { const x = i / 3.6 * rK; g.beginPath(); g.moveTo(x * 0.9, rK * 0.45 * Math.sqrt(1 - Math.pow(x / rK, 2)) * 0.95); g.lineTo(x, -hK); g.stroke(); } }
    g.strokeStyle = rgb(mul([46, 44, 42], kV)); g.lineWidth = Math.max(0.7, 0.022 * s);
    for (const zb of [0.07, 0.23]) { const y = -zb * KZ * s, rr = rK * (0.9 + 0.1 * zb / 0.3); g.beginPath(); g.ellipse(0, y, rr, rr * 0.5, 0, 0, Math.PI); g.stroke(); }
    g.fillStyle = rgb(mul([58, 42, 30], kO)); g.beginPath(); g.ellipse(0, -hK, rK, rK * 0.5, 0, 0, TAU); g.fill();
    if (jahr === "winter") { g.fillStyle = rgb(mul([244, 247, 253], kO)); g.beginPath(); g.ellipse(0, -hK + 0.01 * s, rK * 0.86, rK * 0.4, 0, 0, TAU); g.fill(); }
    /* Stämmchen */
    g.fillStyle = rgb(mul([86, 62, 44], kV)); g.fillRect(-0.025 * s, -(0.42 * KZ * s), 0.05 * s, 0.12 * KZ * s);
    /* Nadelkegel: sechs hängende Etagen von unten nach oben */
    const lampen = [];
    for (let i = 0; i < tiers; i++) {
      const zR = 0.4 + i * 0.16, zT = zR + 0.26 - i * 0.012, r = 0.46 * (1 - i / tiers * 0.8);
      const rx = r * s, ry = r * s * 0.5, cy = -zR * KZ * s, ty = -zT * KZ * s;
      const nZ = Math.max(8, Math.round(r * 40)), rand = [];
      for (let j = 0; j <= nZ; j++) { const ph = Math.PI - j / nZ * Math.PI, rr = (j % 2 ? 0.84 : 1.02) * (1 + 0.08 * (rng() - 0.5)); rand.push([Math.cos(ph) * rx * rr, cy + Math.sin(ph) * ry * rr + (j % 2 ? -0.015 : 0.02) * s]); }
      g.beginPath(); g.moveTo(0, ty); g.lineTo(rand[0][0], rand[0][1] - 0.03 * s);
      for (const p of rand) g.lineTo(p[0], p[1]);
      g.lineTo(rand[nZ][0], rand[nZ][1] - 0.03 * s); g.closePath();
      const gg = g.createLinearGradient(-rx, 0, rx, 0), gruen = [34, 72, 44];
      gg.addColorStop(0, rgb(mul(gruen, skal(kL, 1.05)))); gg.addColorStop(0.45, rgb(mul(gruen, skal(kV, 0.9)))); gg.addColorStop(1, rgb(mul(gruen, skal(kR, 0.7))));
      g.fillStyle = gg; g.fill();
      /* Nadelstriche von der Spitze der Etage nach außen */
      if (s > 30) {
        const nS = Math.round(r * s * 0.9);
        g.lineWidth = Math.max(0.5, 0.006 * s); g.lineCap = "round";
        for (let k = 0; k < nS; k++) {
          const ph = 0.06 * Math.PI + rng() * 0.88 * Math.PI, u0 = 0.35 + rng() * 0.35, u1 = Math.min(1, u0 + 0.25 + rng() * 0.2);
          const x0 = Math.cos(ph) * rx * u0, y0 = ty + (cy + Math.sin(ph) * ry * u0 - ty) * u0 + 0.01 * s, x1 = Math.cos(ph) * rx * u1, y1 = ty + (cy + Math.sin(ph) * ry * u1 - ty) * u1 + 0.02 * s;
          g.strokeStyle = Math.cos(ph) < -0.2 ? "rgba(150,200,140,0.35)" : "rgba(0,14,6,0.4)";
          g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
        }
      }
      /* Schneekappe auf der Etage */
      if (jahr === "winter") {
        g.beginPath(); g.moveTo(0, ty - 0.01 * s);
        for (let j = 0; j <= 10; j++) { const ph = Math.PI - j / 10 * Math.PI, rr = 0.62 + 0.2 * rng(); g.lineTo(Math.cos(ph) * rx * rr, cy + Math.sin(ph) * ry * rr - (0.07 + 0.03 * rng()) * s); }
        g.closePath();
        const gs = g.createLinearGradient(-rx, 0, rx, 0);
        gs.addColorStop(0, rgb(mul([246, 248, 253], kO))); gs.addColorStop(1, rgb(mul([214, 224, 240], kO)));
        g.fillStyle = gs; g.fill();
      }
      /* Lämpchen auf der Vorderseite */
      const nL = Math.max(3, Math.round(r * 13));
      for (let j = 0; j < nL; j++) { const ph = (0.1 + 0.8 * (j + 0.5) / nL + (rng() - 0.5) * 0.06) * Math.PI; lampen.push([Math.cos(ph) * rx * 0.9, cy + Math.sin(ph) * ry * 0.9 - 0.02 * s]); }
    }
    /* Strohstern an der Spitze */
    const sy = -(spitze + 0.02) * KZ * s, sr = Math.max(1.2, 0.07 * s);
    g.fillStyle = rgb(mul([226, 190, 110], kV)); g.beginPath(); for (let i = 0; i < 16; i++) { const a = i / 16 * TAU - Math.PI / 2, rr = i % 2 ? sr * 0.35 : sr; g.lineTo(Math.cos(a) * rr, sy + Math.sin(a) * rr); } g.closePath(); g.fill();
    /* Lichterkette: tagsüber kleine Birnchen, abends warm leuchtend */
    const lr = Math.max(0.6, 0.016 * s);
    for (let j = 0; j < lampen.length; j++) {
      const p = lampen[j];
      if (an) {
        const hof = g.createRadialGradient(p[0], p[1], 0, p[0], p[1], Math.max(2.5, 0.12 * s));
        hof.addColorStop(0, "rgba(255,236,190," + (0.9 * Math.min(1, nacht * 1.3)).toFixed(3) + ")"); hof.addColorStop(0.25, "rgba(255,200,120," + (0.35 * nacht).toFixed(3) + ")"); hof.addColorStop(1, "rgba(255,180,90,0)");
        g.fillStyle = hof; g.fillRect(p[0] - 0.12 * s, p[1] - 0.12 * s, 0.24 * s, 0.24 * s);
        g.fillStyle = "rgb(255,246,220)"; g.beginPath(); g.arc(p[0], p[1], lr, 0, TAU); g.fill();
        if (F.leuchtPunkt && j % 4 === 0) F.leuchtPunkt(p[0], p[1], 0.35 * s, "255,200,130", 0.22, j % 8 === 0);
      } else if (s > 20) {
        g.fillStyle = rgb(mul([226, 214, 180], kV), 0.9); g.beginPath(); g.arc(p[0], p[1], lr * 0.8, 0, TAU); g.fill();
      }
    }
  }

  /* =====================================================================
     DAS MODELL
     ===================================================================== */
  ST.modell("brunnen", {
    name: "Marktbrunnen", gruppe: "Deko", grund: [4.6, 4.6], hoehe: 5.4, bauzeit: 8 * 60,
    bauen: function (M, o) {
      const bau = o.bau == null ? 1 : o.bau;
      const winter = o.jahr === "winter";
      const saat = Math.abs(o.saat | 0) || 1;
      const fertig = bau >= 1;

      /* ---- 1. Grube, Fundament ---- */
      if (bau < 0.2) {
        const fuell = bau < 0.1 ? null : -0.45 + 0.45 * phase(bau, 0.1, 0.17);
        M.teil("grube", { ebene: -2, schatten: false, mitte: [0, 0, -1] });
        M.figur({ x: 0, y: 0, z: 0, breite: 8, hoehe: 0.3, schatten: false, malen: mitGier(function (g, s, F) { grubeMalen(g, blick(F.gier, s), F, RS + 0.1, 0.45, fuell); }) });
        if (bau < 0.17) return;
        M.teil("fundament", { ebene: -1 });
        achteckDeckel(M, RS + 0.05, 0.03, gebacken(function (g, F) {
          g.fillStyle = "#bdbab0"; g.fillRect(0, 0, F.w, F.h); rauschen(g, 0, 0, F.w, F.h, 1.2, 0.35, 4);
          g.strokeStyle = "rgba(90,86,76,0.35)"; g.lineWidth = 0.015; for (let y = 0.25; y < F.h; y += 0.25) { g.beginPath(); g.moveTo(0, y); g.lineTo(F.w, y + 0.02); g.stroke(); }
        }), "betonplatte");
        return;
      }
      /* ---- 2. Sockelstufe ---- */
      M.teil("stufe", { ebene: 0 });
      achteckWand(M, RS, 0, ZS, (k) => gebacken(function (g, F) { sandstein(g, F.w, F.h, F, 30 + k, { lage: 0.14, unten: false }); }), "stufe");
      achteckDeckel(M, RS, ZS, gebacken(function (g, F) {
        const rng = ST.zufall(saat + 3);
        g.fillStyle = rgb(skal(STEIN, 1.02)); g.fillRect(0, 0, F.w, F.h);
        /* Plattenfugen strahlenförmig */
        g.strokeStyle = rgb(skal(STEIN, 0.6)); g.lineWidth = 0.015;
        for (let k = 0; k < 16; k++) { const a = k / 16 * TAU; g.beginPath(); g.moveTo(RS + Math.cos(a) * RA * 0.95, RS + Math.sin(a) * RA * 0.95); g.lineTo(RS + Math.cos(a) * RS, RS + Math.sin(a) * RS); g.stroke(); }
        rauschen(g, 0, 0, F.w, F.h, 1.1, 0.35, 7);
        if (winter) {
          /* Schnee auf der Stufe, an der Beckenwand zusammengeweht */
          g.fillStyle = "rgba(246,249,255,0.93)";
          g.beginPath();
          for (let k = 0; k <= 64; k++) { const a = k / 64 * TAU, r = RA + 0.05 + 0.2 * (0.5 + 0.5 * ST.rausch(k * 0.5, 2, 5)); const x = RS + Math.cos(a) * r, y = RS + Math.sin(a) * r; if (k) g.lineTo(x, y); else g.moveTo(x, y); }
          g.closePath(); g.fill();
          for (let i = 0; i < 12; i++) { const a = rng() * TAU, r = RA + 0.15 + rng() * 0.2; g.beginPath(); g.ellipse(RS + Math.cos(a) * r, RS + Math.sin(a) * r, 0.18, 0.1, a, 0, TAU); g.fill(); }
        }
      }), "stufe-oben");
      if (bau < 0.26) return;

      /* ---- 3. Becken: Wände wachsen Lage für Lage ---- */
      const wandZ = ZS + (ZR0 - ZS) * phase(bau, 0.26, 0.46);
      const randAnteil = phase(bau, 0.46, 0.54);
      M.teil("innen", { ebene: 1, schatten: false, mitte: [0, 0, 0.3] });
      const wasserDa = bau >= 0.94;
      /* Winter: Wasser abgelassen, Becken mit Brettern abgedeckt */
      const abgedeckt = winter && wasserDa;
      /* Wasser (im Winter unter der Abdeckung, also gar nicht gemalt) */
      if (!abgedeckt) achteckDeckel(M, RI + 0.02, wasserDa ? ZW : ZS + 0.02, gebacken(function (g, F) {
        const w = F.w, h = F.h, rng = ST.zufall(saat + 17);
        if (!wasserDa) {
          /* trockener Beckenboden */
          g.fillStyle = rgb(skal(STEIN, 0.85)); g.fillRect(0, 0, w, h); rauschen(g, 0, 0, w, h, 1, 0.35, 9);
          return;
        }
        if (winter) {
          /* Eis: bläulich-weiß, Risse, eingeschlossene Luftblasen, Schneeverwehungen */
          const gr = g.createLinearGradient(0, 0, w, h);
          gr.addColorStop(0, "#c9dbe9"); gr.addColorStop(0.5, "#a9c2d6"); gr.addColorStop(1, "#bcd0e0");
          g.fillStyle = gr; g.fillRect(0, 0, w, h);
          rauschen(g, 0, 0, w, h, 1.6, 0.25, 11);
          g.strokeStyle = "rgba(255,255,255,0.7)"; g.lineWidth = 0.012;
          for (let i = 0; i < 9; i++) { let x = rng() * w, y = rng() * h; g.beginPath(); g.moveTo(x, y); for (let j = 0; j < 5; j++) { x += (rng() - 0.5) * 0.6; y += (rng() - 0.5) * 0.6; g.lineTo(x, y); } g.stroke(); }
          g.fillStyle = "rgba(255,255,255,0.5)"; for (let i = 0; i < 40; i++) { g.beginPath(); g.arc(rng() * w, rng() * h, 0.01 + rng() * 0.02, 0, TAU); g.fill(); }
          g.fillStyle = "rgba(247,250,255,0.92)";
          for (let i = 0; i < 7; i++) { const x = rng() * w, y = rng() * h; g.beginPath(); g.ellipse(x, y, 0.25 + rng() * 0.4, 0.12 + rng() * 0.15, rng() * 3, 0, TAU); g.fill(); }
          /* Schnee am Rand zusammengeweht */
          g.save(); g.strokeStyle = "rgba(247,250,255,0.9)"; g.lineWidth = 0.18; g.beginPath(); for (let k = 0; k <= 8; k++) { const p = ecke(RI + 0.02, k); if (k) g.lineTo(p[0] + w / 2, p[1] + h / 2); else g.moveTo(p[0] + w / 2, p[1] + h / 2); } g.stroke(); g.restore();
        } else {
          /* Wasser: dunkles Grün-Blau, Himmel spiegelt, Grund schimmert durch */
          const gr = g.createLinearGradient(0, 0, w * 0.6, h);
          gr.addColorStop(0, "#5f8d99"); gr.addColorStop(0.55, "#3d6873"); gr.addColorStop(1, "#4f7d88");
          g.fillStyle = gr; g.fillRect(0, 0, w, h);
          rauschen(g, 0, 0, w, h, 0.9, 0.25, 13);
          /* Münzen auf dem Grund */
          g.fillStyle = "rgba(200,170,90,0.55)"; for (let i = 0; i < 14; i++) { g.beginPath(); g.ellipse(rng() * w, rng() * h, 0.025, 0.02, 0, 0, TAU); g.fill(); }
          /* Himmelsspiegelung: helle Wellenbänder */
          g.strokeStyle = "rgba(220,236,245,0.35)"; g.lineWidth = 0.02;
          for (let i = 0; i < 16; i++) { const y = rng() * h, x = rng() * w; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 0.2, y - 0.04, x + 0.4, y); g.stroke(); }
        }
      }), "wasser", { keinLicht: false });
      /* Innenwand über dem Wasser */
      if (wandZ > ZS + 0.05) {
        const zI1 = Math.min(ZR1, wandZ + (randAnteil > 0 ? ZR1 - ZR0 : 0)), zI0 = wasserDa ? ZW : ZS + 0.02;
        if (zI1 > zI0 + 0.01 && !abgedeckt) achteckInnen(M, RI, zI0, zI1, (k) => gebacken(function (g, F) {
          sandstein(g, F.w, F.h, F, 50 + k, { lage: 0.22, unten: false });
          if (wasserDa) {
            /* Kalkrand an der Wasserlinie (Frühling) bzw. Eisrand */
            g.fillStyle = winter ? "rgba(235,244,252,0.85)" : "rgba(230,226,210,0.5)"; g.fillRect(0, F.h - 0.05, F.w, 0.05);
            if (!winter) { g.fillStyle = "rgba(70,100,60,0.3)"; g.fillRect(0, F.h - 0.1, F.w, 0.05); }
          }
        }), "innen");
      }
      /* Außenwand */
      M.teil("wand", { ebene: 2 });
      if (wandZ > ZS + 0.01) {
        achteckWand(M, RA, ZS, wandZ, (k) => gebacken(function (g, F) {
          const hGanz = ZR0 - ZS;
          g.save(); g.translate(0, -(hGanz - F.h));
          sandstein(g, F.w, hGanz, F, 70 + k, { lage: 0.24 });
          /* Füllung: jede zweite Wand mit einem vertieften Spiegel und Rosette */
          if (F.px > 20) {
            const mx = F.w / 2, my = hGanz / 2;
            g.strokeStyle = rgb(skal(STEIN, 0.6)); g.lineWidth = 0.02; g.strokeRect(0.12, 0.08, F.w - 0.24, hGanz - 0.16);
            g.strokeStyle = rgb(skal(STEIN_HELL, 1.1)); g.lineWidth = 0.012; g.strokeRect(0.135, 0.095, F.w - 0.27, hGanz - 0.19);
            if (k % 2 === 0) { g.fillStyle = rgb(skal(STEIN, 0.75)); g.beginPath(); g.arc(mx, my, 0.1, 0, TAU); g.fill(); g.fillStyle = rgb(skal(STEIN_HELL, 1.05)); for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; g.beginPath(); g.ellipse(mx + Math.cos(a) * 0.05, my + Math.sin(a) * 0.05, 0.035, 0.018, a, 0, TAU); g.fill(); } }
            else if (k === 1) { wappen(g, mx - 0.1, my - 0.12, 0.2, 0.25, F.px); }
          }
          /* Schmuck am oberen Rand: Tannengrün mit Schleifen bzw. Blumen und Eier */
          if (fertig || bau >= 0.97) girlandeWand(g, F, F.w, winter, k);
          g.restore();
        }), "aussen");
      }
      /* Randplatten */
      if (randAnteil > 0) {
        const nPl = Math.round(8 * randAnteil);
        for (let k = 0; k < nPl; k++) {
          const a = ecke(RA + 0.05, k), b = ecke(RA + 0.05, k + 1), ai = ecke(RI - 0.02, k), bi = ecke(RI - 0.02, k + 1);
          const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u = [(a[0] - b[0]) / L, (a[1] - b[1]) / L, 0];
          M.flaeche({ name: "rand-aussen" + k, o: [b[0], b[1], ZR1], u: u, v: [0, 0, -1], w: L, h: ZR1 - ZR0, malen: gebacken(function (g, F) {
            g.fillStyle = rgb(skal(STEIN_HELL, 1.02)); g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1);
            g.fillStyle = rgb(skal(STEIN, 0.7)); g.fillRect(0, F.h * 0.62, F.w, F.h * 0.1);
            g.fillStyle = rgb(skal(STEIN, 0.85)); g.fillRect(0, F.h * 0.72, F.w, F.h * 0.28);
            rauschen(g, 0, 0, F.w, F.h, 0.8, 0.3, 20 + k);
            if (winter && fertig) {
              g.fillStyle = "#f4f8fd"; g.beginPath(); g.moveTo(0, 0); for (let x = 0; x <= F.w; x += 0.08) g.lineTo(x, 0.02 + 0.03 * Math.abs(Math.sin(x * 9 + k))); g.lineTo(F.w, 0); g.fill();
            }
          }) });
          const ox = Math.min(a[0], b[0], ai[0], bi[0]), oy = Math.min(a[1], b[1], ai[1], bi[1]);
          const w = Math.max(a[0], b[0], ai[0], bi[0]) - ox, h = Math.max(a[1], b[1], ai[1], bi[1]) - oy;
          M.flaeche({ name: "rand-oben" + k, o: [ox, oy, ZR1], u: [1, 0, 0], v: [0, 1, 0], w: w, h: h, umriss: [a, b, bi, ai].map((q) => [q[0] - ox, q[1] - oy]), malen: gebacken(function (g, F) {
            g.fillStyle = rgb(skal(STEIN_HELL, 1.08)); g.fillRect(0, 0, F.w, F.h);
            rauschen(g, 0, 0, F.w, F.h, 0.7, 0.35, 40 + k);
            g.strokeStyle = rgb(skal(STEIN, 0.55)); g.lineWidth = 0.012;
            g.beginPath(); g.moveTo(a[0] - ox, a[1] - oy); g.lineTo(ai[0] - ox, ai[1] - oy); g.stroke();
            if (winter && fertig) {
              /* Schneepolster auf der Randplatte */
              const m1 = [(a[0] + ai[0]) / 2 - ox, (a[1] + ai[1]) / 2 - oy], m2 = [(b[0] + bi[0]) / 2 - ox, (b[1] + bi[1]) / 2 - oy];
              g.strokeStyle = "rgba(246,249,255,0.96)"; g.lineWidth = 0.2; g.lineCap = "round"; g.beginPath(); g.moveTo(m1[0], m1[1]); g.lineTo(m2[0], m2[1]); g.stroke();
            }
          }) });
        }
      }
      /* Winterabdeckung mit Schneepolster und zwei Tännchen */
      if (abgedeckt) {
        M.teil("abdeckung", { ebene: 2, mitte: [0, 0, 3] });
        abdeckungBauen(M, saat);
        if (fertig || bau >= 0.97) {
          const d = saat % 2 ? [[0.95, 0.95], [-0.95, -0.95]] : [[0.95, -0.95], [-0.95, 0.95]];
          d.forEach((q, i) => {
            /* Reihung gegen Brunnenstock (Mitte z ≈ 1,5) und Röhren (Mitte z = 12):
               die gestreckte Mitte legt das vordere Tännchen hinter die Röhren
               (also davor ins Bild), das hintere vor den Stock (dahinter) */
            M.teil("taennchen" + i, { ebene: 3, mitte: [q[0] * 6, q[1] * 6, 7] });
            M.figur({ x: q[0], y: q[1], z: ZD + PD - 0.02, breite: 1.1, hoehe: 1.6, malen: function (g, s, F) { baeumchenMalen(g, s, F, saat + i * 13); } });
          });
        }
      }
      if (bau < 0.54) return;

      /* ---- 4. Brunnenstock, Säule, Kapitell ---- */
      /* im Winter steht der Stock auf dem Schneepolster (darunter verdeckt) */
      const stockZ0 = abgedeckt ? ZD + PD - 0.01 : ZW - 0.1;
      const stockZ = ZW + (ZP - ZW) * phase(bau, 0.54, 0.64);
      M.teil("saeule", { ebene: 3 });
      M.quader({ x: -PB, y: -PB, z: stockZ0, b: 2 * PB, t: 2 * PB, h: stockZ - stockZ0 }, (function () {
        const seite = (i) => gebacken(function (g, F) {
          const hGanz = ZP - stockZ0;
          g.save(); g.translate(0, -(hGanz - F.h));
          sandstein(g, F.w, hGanz, F, 90 + i, { lage: 0.3, unten: false });
          if (abgedeckt && F.px > 12) {
            /* angewehter Schnee am Fuß des Stocks */
            g.fillStyle = "rgba(244,247,252,0.95)"; g.beginPath(); g.moveTo(0, hGanz);
            for (let x = 0; x <= F.w + 0.01; x += 0.05) g.lineTo(x, hGanz - 0.03 - 0.05 * Math.pow(Math.sin(Math.PI * x / F.w), 0.6) - 0.015 * Math.sin(x * 23 + i));
            g.lineTo(F.w, hGanz); g.closePath(); g.fill();
          }
          if (bau >= 0.64) {
            const my = hGanz - (ROEHRE_Z - stockZ0);
            loewenMaske(g, F.w / 2, my, 0.13, F.px);
            if (i === 0 && F.px > 25) { g.fillStyle = rgb(skal(STEIN_HELL, 1.1)); g.fillRect(F.w / 2 - 0.12, 0.08, 0.24, 0.12); g.fillStyle = "rgba(70,40,30,0.8)"; g.font = "bold 0.07px Georgia, serif"; g.textAlign = "center"; g.fillText("1587", F.w / 2, 0.17); }
          }
          g.restore();
        });
        return { sued: seite(0), ost: seite(1), nord: seite(2), west: seite(3), oben: bau >= 0.64 ? null : rgb(STEIN) };
      })());
      if (bau >= 0.64) {
        /* Gesims auf dem Brunnenstock */
        const ges = gebacken(function (g, F) { g.fillStyle = rgb(skal(STEIN_HELL, 1.05)); g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1); g.fillStyle = rgb(skal(STEIN, 0.72)); g.fillRect(0, F.h * 0.55, F.w, F.h * 0.12); rauschen(g, 0, 0, F.w, F.h, 0.6, 0.3, 61); });
        M.quader({ x: -PB - 0.06, y: -PB - 0.06, z: ZP, b: 2 * PB + 0.12, t: 2 * PB + 0.12, h: 0.1 }, { sued: ges, ost: ges, nord: ges, west: ges, oben: winter ? "#f3f7fc" : rgb(skal(STEIN_HELL, 1.1)) });
      }
      const saeuleZ = ZS0 + (ZS1 - ZS0) * phase(bau, 0.64, 0.76);
      if (bau >= 0.64 && saeuleZ > ZS0 + 0.01) {
        /* Säulenfuß */
        const fussR = 0.23;
        M.quader({ x: -fussR, y: -fussR, z: ZP + 0.1, b: 2 * fussR, t: 2 * fussR, h: ZS0 - ZP - 0.1 }, { sued: rgb(STEIN_HELL), ost: rgb(STEIN_HELL), nord: rgb(STEIN_HELL), west: rgb(STEIN_HELL), oben: winter ? "#f3f7fc" : rgb(STEIN_HELL) });
        /* Säulenschaft: zwölfeckig, mit leichter Schwellung */
        const n = 12;
        for (let i = 0; i < n; i++) {
          const a0 = (i + 0.5) / n * TAU, a1 = (i + 1.5) / n * TAU;
          const p0 = [SR * Math.cos(a0), SR * Math.sin(a0)], p1 = [SR * Math.cos(a1), SR * Math.sin(a1)];
          const L = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
          M.flaeche({ name: "schaft" + i, o: [p1[0], p1[1], saeuleZ], u: [(p0[0] - p1[0]) / L, (p0[1] - p1[1]) / L, 0], v: [0, 0, -1], w: L, h: saeuleZ - ZS0, leuchten: fertig ? anstrahlen : null, malen: gebacken(function (g, F) {
            g.fillStyle = rgb(skal(STEIN, 1.02 + (i % 2) * 0.03)); g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1);
            rauschen(g, 0, 0, F.w, F.h, 0.9, 0.35, 70 + i);
            g.fillStyle = "rgba(60,30,20,0.25)"; for (let y = 0.45; y < F.h; y += 0.5) g.fillRect(0, y, F.w, 0.01);
          }) });
        }
      }
      if (bau >= 0.76) {
        /* Kapitell: Hals, Wulst und Deckplatte */
        const kap = gebacken(function (g, F) { g.fillStyle = rgb(skal(STEIN_HELL, 1.05)); g.fillRect(-0.05, -0.05, F.w + 0.1, F.h + 0.1); g.fillStyle = rgb(skal(STEIN, 0.72)); g.fillRect(0, F.h * 0.3, F.w, F.h * 0.15); g.fillStyle = rgb(skal(STEIN_HELL, 1.15)); g.fillRect(0, 0, F.w, F.h * 0.12); rauschen(g, 0, 0, F.w, F.h, 0.5, 0.3, 83); });
        M.quader({ x: -0.21, y: -0.21, z: ZS1, b: 0.42, t: 0.42, h: 0.06 }, { sued: rgb(STEIN_HELL), ost: rgb(STEIN_HELL), nord: rgb(STEIN_HELL), west: rgb(STEIN_HELL) });
        M.quader({ x: -0.3, y: -0.3, z: ZS1 + 0.06, b: 0.6, t: 0.6, h: ZK - ZS1 - 0.06 }, { sued: kap, ost: kap, nord: kap, west: kap, oben: winter ? "#f3f7fc" : rgb(skal(STEIN_HELL, 1.1)) });
        M.quader({ x: -0.23, y: -0.23, z: ZK, b: 0.46, t: 0.46, h: ZF - ZK }, { sued: rgb(STEIN), ost: rgb(STEIN), nord: rgb(STEIN), west: rgb(STEIN), oben: winter ? "#f3f7fc" : rgb(STEIN_HELL) });
      }
      /* Röhren (und gefrorene Strahlen) vor dem Brunnenstock */
      if (bau >= 0.64) {
        M.teil("roehren", { ebene: 3, schatten: false, mitte: [0, 0, 12] });
        M.figur({ x: 0, y: 0, z: 0, breite: 3.2, hoehe: 1.6, schatten: false, malen: mitGier(function (g, s, F) { roehrenMalen(g, s, F, winter, wasserDa); if (fertig && !F.schatten) strahlerMalen(g, blick(F.gier, s), F); }) });
      }
      /* Kranz um die Säule: hintere Hälfte vor, vordere nach der Säule */
      if (fertig) {
        const kz = 2.25;
        M.teil("kranz-hinten", { ebene: 3, schatten: false, mitte: [0, 0, -12] });
        M.figur({ x: 0, y: 0, z: 0, breite: 0.8, hoehe: 2.6, schatten: false, malen: mitGier(function (g, s, F) { kranzMalen(g, s, F, winter, false, kz); }) });
        M.teil("kranz-vorn", { ebene: 3, schatten: false, mitte: [0, 0, 12.5] });
        M.figur({ x: 0, y: 0, z: 0, breite: 0.8, hoehe: 2.6, schatten: false, malen: mitGier(function (g, s, F) { kranzMalen(g, s, F, winter, true, kz); }) });
      }
      /* ---- 5. Die Figur ---- */
      if (bau >= 0.84) {
        M.teil("ritter", { ebene: 4, mitte: [0, 0, 4] });
        M.figur({ x: 0, y: 0, z: 0, breite: 1.4, hoehe: 5.6, malen: mitGier(function (g, s, F) {
          if (F.schatten) return ritterMalen(g, s, F, winter, 1);
          aufCpu(g, -0.9 * s, -5.6 * KZ * s, 1.8 * s, 2.4 * KZ * s, function (cg) { ritterMalen(cg, s, F, winter, 1); });
          if (F.nacht > 0 && F.leuchtPunkt && fertig) F.leuchtPunkt(0, -(ZF + 0.8) * KZ * s, 1.6 * s, "255,200,140", 0.3, false);
        }) });
      }
      /* Unsichtbare Hilfsflächen für die Bildgrenzen (der Kern zählt
         Figurenschatten nicht mit, und der Kontaktschatten ist breiter als
         der Rand): eine Fläche an der Wimpelspitze wirft ihren Schatten bis
         ans Ende des Figurenschattens; ein Achteck am Boden 1 m außerhalb
         der Stufe gibt dem weichen Kontaktschatten Platz. */
      if (bau >= 0.84) {
        M.teil("schattenhilfe", { mitte: [0, 0, 0] });
        M.flaeche({ name: "hilfe-spitze", o: [0.2, 0.18, ZF + 2.05], u: [1, 0, 0], v: [0, 1, 0], w: 0.6, h: 0.03, malen: function () {}, keinLicht: true });
      }
      M.teil("grenzhilfe", { schatten: false, ebene: -3, mitte: [0, 0, -5] });
      achteckDeckel(M, RS + 1.0, 0.001, function () {}, "grenzhilfe", { keinLicht: true });
      /* ---- 6. Frühling: Blumentöpfe auf der Stufe ---- */
      if (!winter && fertig) {
        const TF = [[220, 40, 60], [250, 200, 40], [240, 110, 160], [150, 80, 200]];
        for (let k = 0; k < 4; k++) {
          const a = (k * 2 + 1) * Math.PI / 4, r = RS - 0.2;
          M.teil("topf" + k, { ebene: 2 });
          M.figur({ x: Math.cos(a) * r, y: Math.sin(a) * r, z: ZS, breite: 0.6, hoehe: 0.8, malen: function (g, s, F) { topfMalen(g, s, F, TF[(k + saat) % 4]); } });
        }
      }
      /* ---- 7. Frühling: plätscherndes Wasser ---- */
      if (!winter && wasserDa) {
        M.lebendig(function (g, P) {
          const s = P.s, t = P.t, nacht = P.Z ? P.Z.nacht : 0;
          const hell = nacht > 0.5 ? "150,170,200" : "225,240,250";
          for (let i = 0; i < 4; i++) {
            const d = RICHTUNGEN[i];
            const a = d[0] * P.c - d[1] * P.sn, b = d[0] * P.sn + d[1] * P.c;
            if ((a + b) * 0.7 < -0.25) continue;               // hinter dem Brunnenstock
            const pts = [];
            for (let k = 0; k <= 12; k++) pts.push(P.proj.apply(null, strahlPunkt(d, k / 12)));
            g.lineCap = "round";
            g.strokeStyle = "rgba(" + hell + ",0.45)"; g.lineWidth = Math.max(1.2, 0.045 * s);
            g.beginPath(); pts.forEach((p, k) => (k ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.stroke();
            g.strokeStyle = "rgba(255,255,255,0.7)"; g.lineWidth = Math.max(0.5, 0.012 * s);
            g.beginPath(); pts.forEach((p, k) => (k ? g.lineTo(p[0] - 0.008 * s, p[1] - 0.006 * s) : g.moveTo(p[0], p[1]))); g.stroke();
            /* Tropfen, die im Strahl nach unten wandern */
            g.fillStyle = "rgba(255,255,255,0.85)";
            for (let k = 0; k < 5; k++) { const u = ((t * 1.3 + k / 5 + i * 0.13) % 1); const q = P.proj.apply(null, strahlPunkt(d, u)); g.beginPath(); g.arc(q[0], q[1], Math.max(0.6, 0.012 * s), 0, TAU); g.fill(); }
            /* Ringe und Spritzer am Auftreffpunkt */
            const e = P.proj.apply(null, strahlPunkt(d, 1));
            for (let k = 0; k < 3; k++) {
              const ph = (t * 0.9 + k / 3 + i * 0.21) % 1, r = (0.05 + ph * 0.35) * s;
              g.strokeStyle = "rgba(" + hell + "," + (0.5 * (1 - ph)).toFixed(3) + ")"; g.lineWidth = Math.max(0.5, 0.012 * s);
              g.beginPath(); g.ellipse(e[0], e[1], r, r * 0.5, 0, 0, TAU); g.stroke();
            }
            g.fillStyle = "rgba(255,255,255,0.6)";
            for (let k = 0; k < 4; k++) { const ph = (t * 2.1 + k * 0.27 + i * 0.3) % 1, w = (k - 1.5) * 0.06 * s; g.beginPath(); g.arc(e[0] + w * ph * 2, e[1] - Math.sin(ph * Math.PI) * 0.12 * s, Math.max(0.5, 0.01 * s), 0, TAU); g.fill(); }
          }
        });
      }
    }
  });

  /* Girlande außen am Becken (in die Außenwand gemalt, Wandkoordinaten) */
  function girlandeWand(g, F, w, winter, k) {
    const rng = ST.zufall(100 + k);
    const y = (x) => 0.05 + 0.16 * Math.sin(Math.PI * x / w);
    const n = Math.max(24, Math.round(w * (F.px > 40 ? 70 : 26)));
    for (let i = 0; i < n; i++) {
      const x = rng() * w, yy = y(x) + (rng() - 0.5) * 0.07, a = rng() * TAU;
      const c = winter ? [26 + rng() * 14, 64 + rng() * 20, 38] : [60 + rng() * 18, 116 + rng() * 22, 50];
      g.fillStyle = rgb(c); g.beginPath(); g.ellipse(x, yy, 0.055, 0.022, a, 0, TAU); g.fill();
    }
    if (winter) {
      g.fillStyle = "rgba(246,249,255,0.9)"; for (let i = 0; i < w * 5; i++) { const x = rng() * w; g.beginPath(); g.ellipse(x, y(x) - 0.03, 0.05, 0.014, 0, 0, TAU); g.fill(); }
      /* Schleife an der Ecke */
      g.fillStyle = "#b0142a";
      g.beginPath(); g.moveTo(0.02, 0.06); g.quadraticCurveTo(-0.08, -0.03, -0.07, 0.09); g.closePath(); g.fill();
      g.beginPath(); g.moveTo(0.02, 0.06); g.quadraticCurveTo(0.12, -0.03, 0.11, 0.09); g.closePath(); g.fill();
      g.fillRect(0.0, 0.06, 0.025, 0.14); g.fillRect(0.03, 0.06, 0.025, 0.12);
      /* Eiszapfen unter der Randplatte */
      let x = 0.05 + rng() * 0.1;
      while (x < w - 0.05) {
        const l = 0.04 + Math.pow(rng(), 2) * 0.22, b = 0.008 + l * 0.08;
        const gr = g.createLinearGradient(x - b, 0, x + b, 0);
        gr.addColorStop(0, "rgba(180,210,236,0.4)"); gr.addColorStop(0.4, "rgba(250,253,255,0.9)"); gr.addColorStop(1, "rgba(160,190,222,0.35)");
        g.fillStyle = gr; g.beginPath(); g.moveTo(x - b, 0); g.quadraticCurveTo(x - b * 0.4, l * 0.6, x, l); g.quadraticCurveTo(x + b * 0.4, l * 0.6, x + b, 0); g.closePath(); g.fill();
        x += 0.04 + rng() * 0.18;
      }
    } else {
      /* Blüten und bunte Eier (fränkischer Osterbrunnen) */
      const BL = [[240, 70, 90], [250, 220, 60], [252, 250, 245], [200, 120, 220]];
      for (let i = 0; i < n * 0.3; i++) { const x = rng() * w; g.fillStyle = rgb(BL[(rng() * 4) | 0]); g.beginPath(); g.arc(x, y(x) + (rng() - 0.5) * 0.05, 0.028, 0, TAU); g.fill(); }
      const EI = [[220, 50, 60], [250, 200, 50], [60, 130, 220], [90, 180, 90], [240, 130, 40]];
      for (let i = 0; i < 4; i++) {
        const x = (i + 0.5) / 4 * w, yy = y(x) + 0.08;
        const c = EI[(i + k) % EI.length];
        g.fillStyle = rgb(c); g.beginPath(); g.ellipse(x, yy, 0.04, 0.055, 0, 0, TAU); g.fill();
        g.fillStyle = "rgba(255,255,255,0.6)"; g.fillRect(x - 0.04, yy - 0.005, 0.08, 0.012);
      }
    }
  }
})();
