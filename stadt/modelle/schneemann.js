/* =====================================================================
   BAUKASTEN-STADT — DER SCHNEEMANN (Winter) · DER OSTERSTRAUCH (Frühling)
   ---------------------------------------------------------------------
   XANDER: „Ich möchte einen Liebreiz zur Weihnachtsdeko … mit Schnee …
   alles dabei." – „Das soll keine Comic Grafik sein. Das soll noch viel
   mehr am Realismus dran sein." – „ohne Pixelkanten und komische
   Vektorrückstände."

   ECHTES SCHNEELICHT
   Die drei Kugeln werden nicht als flache Kreise mit Verlauf gemalt,
   sondern Bildpunkt für Bildpunkt ausgerechnet (kleiner Strahlverfolger
   auf einer CPU-Leinwand): Sonne mit Eigenschatten und dem Schlagschatten
   der oberen Kugeln auf die unteren, Himmelslicht (bläulich), das
   Rücklicht vom Schnee am Boden (Unterseiten hell), Umgebungsverdeckung
   an den Berührstellen, leichte Unebenheiten gepresster Schnee und
   Glitzern. Die Ränder werden über die Abdeckung geglättet – keine
   Treppenstufen. Nachts leuchtet ein Windlicht zu seinen Füßen und
   wärmt die untere Kugel von der Seite.

   Kohleaugen, Karottennase, Mund, Knöpfe, Schal, Reisigarme und Hut
   haben ihren Platz im Raum: Dreht man den Schneemann, schaut er weg.
   Varianten über o.saat: Zylinder, alter Kochtopf oder Zinkeimer; Schal
   in drei Farben.

   FRÜHLING: ein Osterstrauch statt eines halb geschmolzenen Schneemanns.
   Begründung: In der Frühlingssonne neben frischem Grün wäre ein halber
   Schneehaufen grau und traurig – kein „Liebreiz". Ein blühender
   Forsythienstrauch mit bemalten Ostereiern ist ein echter deutscher
   Brauch, braucht denselben Platz und passt zum „Frühlingsgewand".
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT;
  const KX = ST.KX, KY = ST.KY, KZ = ST.KZ, LICHT = ST.LICHT, AUGE = ST.ZUM_AUGE;
  const TAU = Math.PI * 2;
  /* Bildachsen im Kameraraum: rechts, unten, zum Betrachter */
  const EX = [Math.SQRT1_2, -Math.SQRT1_2, 0];
  const EY = [Math.SQRT1_2 * 0.5, Math.SQRT1_2 * 0.5, -KZ];
  const EZ = AUGE;

  /* ---------------- Helfer ---------------- */
  function blick(gier, s) {
    const r = gier * Math.PI / 180, c = Math.cos(r), sn = Math.sin(r);
    const lx = -LICHT[0] / LICHT[2], ly = -LICHT[1] / LICHT[2];
    return {
      c: c, sn: sn, s: s,
      kam: function (x, y, z) { return [x * c - y * sn, x * sn + y * c, z]; },
      p: function (x, y, z) { const a = x * c - y * sn, b = x * sn + y * c; return [(a - b) * KX * s, (a + b) * KY * s - z * KZ * s]; },
      tiefe: function (x, y, z) { return (x * c - y * sn + x * sn + y * c) * AUGE[0] + z * AUGE[2]; },
      n: function (x, y, z) { const l = Math.hypot(x, y, z) || 1; return [(x * c - y * sn) / l, (x * sn + y * c) / l, z / l]; },
      boden: function (x, y, z) { const a = x * c - y * sn + lx * z, b = x * sn + y * c + ly * z; return [(a - b) * KX * s, (a + b) * KY * s]; },
      bodenKam: function (a, b, z) { const A = a + lx * z, Bb = b + ly * z; return [(A - Bb) * KX * s, (A + Bb) * KY * s]; }
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
  function lichtK(n, Z, jahr) { return ST.lichtFaktor(ST.norm(n), Z, 0, jahr); }
  function phase(bau, a, b) { return Math.max(0, Math.min(1, (bau - a) / (b - a))); }
  function dazu(g, pts) {
    let fl = 0; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; fl += a[0] * b[1] - b[0] * a[1]; }
    if (fl < 0) pts = pts.slice().reverse();
    g.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]); g.closePath();
  }
  function cpuLeinwand(W, H) { const c = document.createElement("canvas"); c.width = W; c.height = H; return [c, c.getContext("2d", { willReadFrequently: true })]; }
  function aufCpu(g, links, oben, breite, hoehe, fn) {
    const x0 = Math.floor(links), y0 = Math.floor(oben);
    const [c, cg] = cpuLeinwand(Math.max(1, Math.ceil(breite) + 2), Math.max(1, Math.ceil(hoehe) + 2));
    cg.translate(-x0, -y0); fn(cg); g.drawImage(c, x0, y0); c.width = c.height = 0;
  }
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }

  /* ---------------- Der Schneemann: Aufbau ---------------- */
  const HUETE = ["zylinder", "topf", "eimer"];
  const SCHALS = [[[176, 26, 38], [240, 236, 228]], [[34, 86, 58], [196, 32, 40]], [[40, 70, 140], [236, 232, 222]]];
  function schneemannDaten(saat) {
    const rng = ST.zufall((saat | 0) * 13 + 5);
    const R = [0.38, 0.285, 0.195];
    const kugeln = [
      { c: [0, 0, 0.33], r: R[0] },
      { c: [(rng() - 0.5) * 0.03, (rng() - 0.5) * 0.03, 0.33 + R[0] + R[1] - 0.08], r: R[1] },
      { c: [(rng() - 0.5) * 0.04, 0.01 + (rng() - 0.5) * 0.02, 0 + 0], r: R[2] }
    ];
    kugeln[2].c[2] = kugeln[1].c[2] + R[1] + R[2] - 0.055;
    return { kugeln: kugeln, hut: HUETE[(saat | 0) % 3], schal: SCHALS[((saat | 0) >> 2) % 3], neig: (rng() - 0.5) * 0.12, drehKopf: (rng() - 0.5) * 0.35 };
  }

  /* Strahlverfolger für die drei Kugeln → ImageData (mit Kantenglättung) */
  function kugelnRechnen(V, F, D, anteil, lampe) {
    const s = V.s, Z = F.Z, jahr = F.jahr, nacht = F.nacht;
    const K = D.kugeln.slice(0, anteil.n).map((k, i) => {
      const r = k.r * (i === anteil.n - 1 ? anteil.letzte : 1);
      const zc = i === 0 ? r * 0.87 : k.c[2];
      return { c: V.kam(k.c[0], k.c[1], zc), r: r, i: i };
    });
    if (!K.length) return null;
    /* Bildgrenzen */
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const k of K) {
      const X = dot(k.c, EX) * s, Y = dot(k.c, EY) * s, R = k.r * s + 2;
      x0 = Math.min(x0, X - R); x1 = Math.max(x1, X + R); y0 = Math.min(y0, Y - R); y1 = Math.max(y1, Y + R);
    }
    x0 = Math.floor(x0); y0 = Math.floor(y0); x1 = Math.ceil(x1); y1 = Math.ceil(y1);
    const W = x1 - x0, H = y1 - y0;
    if (W <= 0 || H <= 0 || W * H > 4e6) return null;
    const [cv, cg] = cpuLeinwand(W, H);
    const bild = cg.createImageData(W, H), d = bild.data;
    const amb = Z.amb, so = Z.sonne, winterRueck = [0.2, 0.21, 0.23], hell = amb[1] + so[1] * 0.6;
    const L = LICHT;
    const glitzer = Math.max(0, Math.min(1, (so[1] - 0.1) / 0.25));   // nur bei Sonne
    /* Windlicht (nachts) im Kameraraum */
    const lp = lampe ? V.kam(lampe[0], lampe[1], lampe[2]) : null;
    const c = V.c, sn = V.sn;
    const treffer = [];
    for (let py = 0; py < H; py++) {
      for (let px = 0; px < W; px++) {
        const X = (x0 + px + 0.5) / s, Y = (y0 + py + 0.5) / s;
        treffer.length = 0;
        for (const k of K) {
          /* Strahl: Q(t) = X·EX + Y·EY + t·EZ */
          const Dx = X * EX[0] + Y * EY[0] - k.c[0], Dy = X * EX[1] + Y * EY[1] - k.c[1], Dz = X * EX[2] + Y * EY[2] - k.c[2];
          const de = Dx * EZ[0] + Dy * EZ[1] + Dz * EZ[2];
          const perp2 = Dx * Dx + Dy * Dy + Dz * Dz - de * de;
          const perp = Math.sqrt(Math.max(0, perp2));
          const abd = Math.max(0, Math.min(1, (k.r - perp) * s + 0.5));
          if (abd <= 0) continue;
          const disc = Math.max(0, k.r * k.r - perp2);
          const t = -de + Math.sqrt(disc);
          treffer.push([t, k, Dx + t * EZ[0], Dy + t * EZ[1], Dz + t * EZ[2], abd]);
        }
        if (!treffer.length) continue;
        treffer.sort((a, b) => b[0] - a[0]);
        let cr = 0, cgc = 0, cb = 0, a = 0;
        for (const [t, k, nx0, ny0, nz0, abd] of treffer) {
          const nx = nx0 / k.r, ny = ny0 / k.r, nz = nz0 / k.r;
          const P = [k.c[0] + nx0, k.c[1] + ny0, k.c[2] + nz0];
          /* Sonne mit Schlagschatten der anderen Kugeln */
          let sun = Math.max(0, nx * L[0] + ny * L[1] + nz * L[2]);
          if (sun > 0) for (const o of K) {
            if (o === k) continue;
            const wx = o.c[0] - P[0], wy = o.c[1] - P[1], wz = o.c[2] - P[2];
            const u = wx * L[0] + wy * L[1] + wz * L[2];
            if (u <= 0) continue;
            const q = Math.sqrt(Math.max(0, wx * wx + wy * wy + wz * wz - u * u));
            sun *= Math.min(1, Math.max(0, (q - o.r + 0.02) / 0.05));
          }
          /* Umgebungsverdeckung an den Berührstellen und am Boden */
          let ao = 1;
          for (const o of K) { if (o === k) continue; const dd = Math.hypot(P[0] - o.c[0], P[1] - o.c[1], P[2] - o.c[2]) - o.r; ao *= 1 - 0.5 * Math.exp(-Math.max(0, dd) / 0.05); }
          ao *= 0.72 + 0.28 * Math.min(1, P[2] / 0.18);
          /* Unebenheiten: Rauschen auf der Oberfläche (im Modell, dreht mit) */
          const mx = nx * c + ny * sn, my = -nx * sn + ny * c;
          const beule = ST.rausch(mx * 7 + k.i * 13, my * 7 + nz * 5, 3) - 0.5, fein = ST.rausch(mx * 23 + 7, my * 23 + nz * 19, 9) - 0.5;
          const bump = 1 + beule * 0.09 + fein * 0.05;
          const oben = 0.82 + 0.18 * Math.max(0, nz);
          const seit = Math.max(0, 1 - Math.abs(nz) - Math.max(0, nz) * 0.5), unten = Math.max(0, -nz);
          let lr = amb[0] * oben * ao + so[0] * sun * 1.35 + winterRueck[0] * (seit + unten * 1.4) * hell * ao;
          let lg = amb[1] * oben * ao + so[1] * sun * 1.35 + winterRueck[1] * (seit + unten * 1.4) * hell * ao;
          let lb = amb[2] * oben * ao + so[2] * sun * 1.35 + winterRueck[2] * (seit + unten * 1.4) * hell * ao;
          /* Schnee streut Licht unter die Oberfläche: Schatten bläulich */
          const sss = (1 - Math.min(1, sun * 2)) * ao;
          lg += 0.02 * sss; lb += 0.07 * sss;
          if (lp && nacht > 0) {
            const wx = lp[0] - P[0], wy = lp[1] - P[1], wz = lp[2] - P[2], dl = Math.hypot(wx, wy, wz) || 1;
            const kk = Math.max(0, (nx * wx + ny * wy + nz * wz) / dl) * nacht * 0.9 / (1 + (dl / 0.45) * (dl / 0.45));
            lr += kk * 1.0; lg += kk * 0.66; lb += kk * 0.32;
          }
          let r = 244 * lr * bump, gg = 248 * lg * bump, b = 255 * lb * bump;
          /* Glitzer in der Sonne */
          if (glitzer > 0 && sun > 0.35 && ST.hash2((mx * 400) | 0, (my * 400 + nz * 900) | 0, k.i) > 0.992) { r = g255(r + 90 * glitzer); gg = g255(gg + 90 * glitzer); b = g255(b + 90 * glitzer); }
          const aa = abd * (1 - a);
          cr += Math.min(255, r) * aa; cgc += Math.min(255, gg) * aa; cb += Math.min(255, b) * aa; a += aa;
          if (a > 0.995) break;
        }
        const i = (py * W + px) * 4;
        d[i] = cr / Math.max(a, 1e-6); d[i + 1] = cgc / Math.max(a, 1e-6); d[i + 2] = cb / Math.max(a, 1e-6); d[i + 3] = a * 255;
      }
    }
    cg.putImageData(bild, 0, 0);
    return { bild: cv, x0: x0, y0: y0, K: K };
  }
  function g255(v) { return Math.min(255, v); }

  /* Punkt auf einer Kugel (Modell): Richtung aus Höhe (el) und Winkel (az, 0 = vorn, +y) */
  function aufKugel(k, az, el, extra) {
    const r = k.r + (extra || 0);
    return [k.c[0] + Math.sin(az) * Math.cos(el) * r, k.c[1] + Math.cos(az) * Math.cos(el) * r, k.c[2] + Math.sin(el) * r];
  }
  function kohle(g, p, r, s) {
    const R = Math.max(0.7, r * s);
    g.fillStyle = "#1b1a1c"; g.beginPath(); g.ellipse(p[0], p[1], R, R * 0.9, 0.3, 0, TAU); g.fill();
    if (R > 2) { g.fillStyle = "rgba(160,170,190,0.55)"; g.beginPath(); g.arc(p[0] - R * 0.35, p[1] - R * 0.35, R * 0.28, 0, TAU); g.fill(); }
  }

  function schneemannMalen(g, s, F, D, A) {
    const V = blick(F.gier, s), Z = F.Z, jahr = F.jahr, nacht = F.nacht;
    const K3 = D.kugeln;
    const kopf = K3[2], bauch = K3[1];
    const vorn = D.drehKopf;         // Kopf leicht zur Seite gedreht
    if (F.schatten) {
      const T = g.getTransform(); g.setTransform(1, 0, 0, 1, T.e, T.f); g.fillStyle = "#000"; g.beginPath();
      /* Schatten jeder Kugel: Umriss senkrecht zum Licht, auf den Boden gelegt */
      const u1 = ST.norm(ST.kreuz(LICHT, [0, 0, 1])), u2 = ST.kreuz(LICHT, u1);
      const n = A.kugeln;
      for (let i = 0; i < n; i++) {
        const k = K3[i], r = k.r * (i === n - 1 ? A.letzte : 1), cz = i === 0 ? r * 0.87 : k.c[2];
        const cc = V.kam(k.c[0], k.c[1], cz), pts = [];
        for (let j = 0; j < 20; j++) { const w = j / 20 * TAU; const q = [cc[0] + (u1[0] * Math.cos(w) + u2[0] * Math.sin(w)) * r, cc[1] + (u1[1] * Math.cos(w) + u2[1] * Math.sin(w)) * r, cc[2] + (u1[2] * Math.cos(w) + u2[2] * Math.sin(w)) * r]; pts.push(V.bodenKam(q[0], q[1], Math.max(0, q[2]))); }
        dazu(g, pts);
      }
      if (A.hut) { const k = kopf, top = k.c[2] + k.r; const cc = V.kam(k.c[0], k.c[1], top + 0.12), pts = []; for (let j = 0; j < 12; j++) { const w = j / 12 * TAU; pts.push(V.bodenKam(cc[0] + Math.cos(w) * 0.15, cc[1] + Math.sin(w) * 0.15, cc[2])); } dazu(g, pts); }
      g.fill();
      if (A.arme) {
        g.strokeStyle = "#000"; g.lineWidth = Math.max(1, 0.03 * s); g.lineCap = "round";
        for (const sx of [-1, 1]) { const a = aufKugel(bauch, sx * 1.5 + vorn * 0.3, 0.2), b = [a[0] + sx * 0.42, a[1] + 0.05, a[2] + 0.22]; const pa = V.boden(a[0], a[1], a[2]), pb = V.boden(b[0], b[1], b[2]); g.beginPath(); g.moveTo(pa[0], pa[1]); g.lineTo(pb[0], pb[1]); g.stroke(); }
      }
      return;
    }
    /* Schneehügel am Fuß (festgetretener Schnee) */
    if (A.kugeln > 0) {
      const r = K3[0].r * (A.kugeln === 1 ? A.letzte : 1) * 1.25, p = V.p(0, 0, 0);
      const kU = lichtK([0, 0, 1], Z, jahr);
      const gr = g.createRadialGradient(p[0], p[1], r * s * 0.3, p[0], p[1], r * s);
      gr.addColorStop(0, rgb(mul([236, 242, 252], kU))); gr.addColorStop(1, rgb(mul([236, 242, 252], kU), 0));
      g.fillStyle = gr; g.beginPath(); g.ellipse(p[0], p[1], r * s, r * s * 0.5, 0, 0, TAU); g.fill();
    }
    /* Dinge sammeln: vor oder hinter dem Körper */
    const vornListe = [], hintenListe = [];
    const sicht = (k, p) => { const n = V.n(p[0] - k.c[0], p[1] - k.c[1], p[2] - k.c[2]); return dot(n, EZ); };
    const rein = (vorne, t, fn) => (vorne ? vornListe : hintenListe).push({ t: t, fn: fn });
    const kH = lichtK([0.3, 0.4, 0.85], Z, jahr);
    if (A.gesicht) {
      /* Augen, Mund */
      for (const sx of [-1, 1]) {
        const p = aufKugel(kopf, vorn + sx * 0.33, 0.24, 0.005);
        rein(sicht(kopf, p) > 0.08, V.tiefe(p[0], p[1], p[2]), () => kohle(g, V.p(p[0], p[1], p[2]), 0.022, s));
      }
      for (let i = 0; i < 5; i++) {
        const u = (i - 2) / 2, p = aufKugel(kopf, vorn + u * 0.36, -0.28 + 0.1 * u * u, 0.003);
        rein(sicht(kopf, p) > 0.08, V.tiefe(p[0], p[1], p[2]), () => kohle(g, V.p(p[0], p[1], p[2]), 0.013, s));
      }
      /* Karottennase */
      const basis = aufKugel(kopf, vorn, 0.02, -0.01), dir = [Math.sin(vorn), Math.cos(vorn), -0.12];
      const spitze = [basis[0] + dir[0] * 0.17, basis[1] + dir[1] * 0.17, basis[2] + dir[2] * 0.17];
      const nasSicht = dot(V.n(dir[0], dir[1], 0), EZ);
      rein(nasSicht > -0.15, V.tiefe(spitze[0], spitze[1], spitze[2]), () => {
        const a = V.p(basis[0], basis[1], basis[2]), b = V.p(spitze[0], spitze[1], spitze[2]);
        let qx = b[0] - a[0], qy = b[1] - a[1]; const ql = Math.hypot(qx, qy) || 1; qx /= ql; qy /= ql;
        const w = 0.028 * s;
        const kN = lichtK(V.n(dir[0], dir[1], 0.4), Z, jahr);
        g.fillStyle = rgb(mul([230, 110, 30], kN));
        g.beginPath(); g.moveTo(a[0] - qy * w, a[1] + qx * w); g.lineTo(b[0], b[1]); g.lineTo(a[0] + qy * w, a[1] - qx * w); g.closePath(); g.fill();
        g.fillStyle = rgb(mul([250, 150, 60], kN)); g.beginPath(); g.moveTo(a[0] - qy * w * 0.9, a[1] + qx * w * 0.9 - w * 0.2); g.lineTo(b[0], b[1]); g.lineTo(a[0], a[1] - w * 0.3); g.closePath(); g.fill();
        if (s > 50) { g.strokeStyle = "rgba(120,50,10,0.6)"; g.lineWidth = Math.max(0.5, 0.004 * s); for (let i = 1; i < 4; i++) { const u = i / 4, m = [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u], ww = w * (1 - u) * 0.8; g.beginPath(); g.moveTo(m[0] - qy * ww, m[1] + qx * ww); g.lineTo(m[0] + qy * ww * 0.4, m[1] - qx * ww * 0.4); g.stroke(); } }
      });
      /* Kohleknöpfe */
      for (let i = 0; i < 3; i++) {
        const p = aufKugel(bauch, vorn * 0.3, 0.42 - i * 0.3, 0.005);
        rein(sicht(bauch, p) > 0.08, V.tiefe(p[0], p[1], p[2]), () => kohle(g, V.p(p[0], p[1], p[2]), 0.026, s));
      }
    }
    if (A.arme) {
      /* Reisigarme mit Verzweigungen */
      for (const sx of [-1, 1]) {
        const a = aufKugel(bauch, sx * 1.5 + vorn * 0.3, 0.2, -0.03);
        const b = [a[0] + sx * 0.42 * Math.cos(vorn * 0.3), a[1] + 0.05 - sx * 0.42 * Math.sin(vorn * 0.3), a[2] + 0.22 + (sx > 0 ? 0.08 : 0)];
        const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
        const nm = V.n(m[0], m[1], 0);
        rein(dot(nm, EZ) > -0.05, V.tiefe(m[0], m[1], m[2]), () => {
          const kA = lichtK([sx * 0.5, 0.5, 0.7], Z, jahr);
          const pa = V.p(a[0], a[1], a[2]), pb = V.p(b[0], b[1], b[2]);
          g.lineCap = "round";
          g.strokeStyle = rgb(mul([86, 60, 40], kA)); g.lineWidth = Math.max(0.9, 0.024 * s);
          g.beginPath(); g.moveTo(pa[0], pa[1]); g.quadraticCurveTo((pa[0] + pb[0]) / 2, (pa[1] + pb[1]) / 2 - 0.03 * s, pb[0], pb[1]); g.stroke();
          g.lineWidth = Math.max(0.6, 0.012 * s);
          for (const [u, dz, lz] of [[0.6, 0.12, 0.14], [0.8, -0.06, 0.1], [0.95, 0.1, 0.1], [0.95, -0.02, 0.09]]) {
            const q = [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u];
            const e = [q[0] + sx * lz, q[1], q[2] + dz];
            const p1 = V.p(q[0], q[1], q[2]), p2 = V.p(e[0], e[1], e[2]);
            g.beginPath(); g.moveTo(p1[0], p1[1]); g.lineTo(p2[0], p2[1]); g.stroke();
          }
          if (jahrWinter(jahr)) { g.strokeStyle = rgb(mul([246, 249, 255], kA), 0.9); g.lineWidth = Math.max(0.5, 0.01 * s); g.beginPath(); g.moveTo(pa[0], pa[1] - 0.012 * s); g.lineTo((pa[0] + pb[0]) / 2, (pa[1] + pb[1]) / 2 - 0.03 * s); g.stroke(); }
        });
      }
    }
    if (A.schal) {
      /* Schal: vorderer Ring nach dem Körper, Knoten und Enden nach Tiefe */
      const zS = bauch.c[2] + bauch.r - 0.04, rS = 0.17;
      const [f1, f2] = D.schal;
      rein(true, 99, () => {
        const pts = [];
        for (let i = 0; i <= 24; i++) {
          const w = i / 24 * TAU, x = kopf.c[0] + Math.cos(w) * rS, y = kopf.c[1] + Math.sin(w) * rS;
          if (dot(V.n(Math.cos(w), Math.sin(w), 0), EZ) < -0.05) { pts.push(null); continue; }
          pts.push([V.p(x, y, zS), w]);
        }
        g.lineCap = "round";
        for (let i = 0; i < 24; i++) {
          const a = pts[i], b = pts[i + 1]; if (!a || !b) continue;
          const kS = lichtK(V.n(Math.cos(a[1]), Math.sin(a[1]), 0.3), Z, jahr);
          g.strokeStyle = rgb(mul(i % 4 < 2 ? f1 : f2, kS)); g.lineWidth = Math.max(1, 0.075 * s);
          g.beginPath(); g.moveTo(a[0][0], a[0][1]); g.lineTo(b[0][0], b[0][1]); g.stroke();
        }
      });
      /* herabhängendes Ende auf der Brust, seitlich */
      const w0 = vorn + 0.55, x0 = kopf.c[0] + Math.sin(w0) * rS, y0 = kopf.c[1] + Math.cos(w0) * rS;
      rein(dot(V.n(Math.sin(w0), Math.cos(w0), 0), EZ) > -0.1, V.tiefe(x0, y0, zS) + 0.3, () => {
        const kS = lichtK(V.n(Math.sin(w0), Math.cos(w0), 0.1), Z, jahr);
        const pts = [];
        for (let i = 0; i <= 6; i++) { const u = i / 6, e = aufKugel(bauch, w0 + u * 0.15, 0.62 - u * 0.75, 0.035); pts.push(V.p(e[0], e[1], e[2])); }
        for (let i = 0; i < 6; i++) {
          g.strokeStyle = rgb(mul(i % 2 ? D.schal[1] : D.schal[0], kS)); g.lineWidth = Math.max(1, 0.09 * s); g.lineCap = "butt";
          g.beginPath(); g.moveTo(pts[i][0], pts[i][1]); g.lineTo(pts[i + 1][0], pts[i + 1][1]); g.stroke();
        }
        if (s > 40) { const e = pts[6]; g.strokeStyle = rgb(mul(D.schal[0], kS)); g.lineWidth = Math.max(0.5, 0.01 * s); for (let j = -3; j <= 3; j++) { g.beginPath(); g.moveTo(e[0] + j * 0.012 * s, e[1]); g.lineTo(e[0] + j * 0.014 * s, e[1] + 0.06 * s); g.stroke(); } }
      });
    }
    hintenListe.sort((a, b) => a.t - b.t); vornListe.sort((a, b) => a.t - b.t);
    for (const e of hintenListe) e.fn();
    /* Der Körper */
    const K = kugelnRechnen(V, F, D, { n: A.kugeln, letzte: A.letzte }, A.lampe ? [0.44, 0.22, 0.12] : null);
    if (K) g.drawImage(K.bild, K.x0, K.y0);
    for (const e of vornListe) e.fn();
    /* Hut */
    if (A.hut) hutMalen(g, V, F, D, kopf);
  }
  function jahrWinter(j) { return j === "winter"; }

  function hutMalen(g, V, F, D, kopf) {
    const s = V.s, Z = F.Z, jahr = F.jahr;
    const top = kopf.c[2] + kopf.r * 0.82;
    const m = [kopf.c[0] + D.neig * 0.3, kopf.c[1], top];
    const kL = lichtK([-0.6, 0.6, 0.3], Z, jahr), kR = lichtK([0.6, 0.2, 0.3], Z, jahr), kO = lichtK([0, 0, 1], Z, jahr);
    const zyl = (r0, r1, h, farbe, deckel) => {
      const u = V.p(m[0], m[1], m[2]), o = V.p(m[0] + D.neig * h, m[1], m[2] + h), R0 = r0 * s, R1 = r1 * s;
      const gr = g.createLinearGradient(u[0] - R0, 0, u[0] + R0, 0);
      gr.addColorStop(0, rgb(mul(farbe, kL))); gr.addColorStop(0.4, rgb(mul(farbe, [(kL[0] + kR[0]) * 0.6, (kL[1] + kR[1]) * 0.6, (kL[2] + kR[2]) * 0.6]))); gr.addColorStop(1, rgb(mul(farbe, skal(kR, 0.7))));
      g.fillStyle = gr;
      g.beginPath(); g.moveTo(o[0] - R1, o[1]); g.lineTo(u[0] - R0, u[1]); g.ellipse(u[0], u[1], R0, R0 * 0.5, 0, Math.PI, 0, true); g.lineTo(o[0] + R1, o[1]); g.closePath(); g.fill();
      g.fillStyle = rgb(mul(deckel || farbe, kO)); g.beginPath(); g.ellipse(o[0], o[1], R1, R1 * 0.5, 0, 0, TAU); g.fill();
      return [u, o, R0, R1];
    };
    if (D.hut === "zylinder") {
      /* Krempe, Hutband mit Stechpalmenzweig */
      const u = V.p(m[0], m[1], m[2] - 0.005), R = 0.2 * s;
      g.fillStyle = rgb(mul([30, 30, 34], kO)); g.beginPath(); g.ellipse(u[0], u[1], R, R * 0.5, 0, 0, TAU); g.fill();
      const [uu, oo, R0] = zyl(0.13, 0.135, 0.26, [34, 34, 38], [44, 44, 48]);
      g.fillStyle = rgb(mul([150, 20, 30], kL)); const bu = V.p(m[0], m[1], m[2] + 0.02), bo = V.p(m[0], m[1], m[2] + 0.06);
      g.beginPath(); g.moveTo(bu[0] - R0, bu[1]); g.lineTo(bo[0] - R0, bo[1]); g.ellipse(bo[0], bo[1], R0, R0 * 0.5, 0, Math.PI, 0, true); g.lineTo(bu[0] + R0, bu[1]); g.ellipse(bu[0], bu[1], R0, R0 * 0.5, 0, 0, Math.PI); g.fill();
      if (s > 30) { const p = V.p(m[0] - 0.08, m[1] + 0.1, m[2] + 0.05); g.fillStyle = "#1f5a30"; for (const a of [-0.6, 0.4]) { g.beginPath(); g.ellipse(p[0] + a * 0.04 * s, p[1], 0.035 * s, 0.015 * s, a, 0, TAU); g.fill(); } g.fillStyle = "#c01824"; for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(p[0] + (i - 1) * 0.012 * s, p[1] - 0.01 * s, 0.011 * s, 0, TAU); g.fill(); } }
      if (jahrWinter(jahr)) { g.fillStyle = rgb(mul([246, 249, 255], kO)); g.beginPath(); g.ellipse(oo[0], oo[1], R0 * 0.9, R0 * 0.4, 0, 0, TAU); g.fill(); }
      void uu;
    } else if (D.hut === "topf") {
      /* alter Emaille-Kochtopf, blau mit weißem Rand, Griffe */
      const [u, o, R0] = zyl(0.15, 0.15, 0.16, [40, 76, 150], [30, 50, 100]);
      g.strokeStyle = rgb(mul([236, 236, 240], kO)); g.lineWidth = Math.max(0.8, 0.02 * s); g.beginPath(); g.ellipse(u[0], u[1], R0, R0 * 0.5, 0, 0, Math.PI); g.stroke();
      g.fillStyle = rgb(mul([30, 30, 34], kL)); for (const sx of [-1, 1]) g.fillRect(o[0] + sx * R0 - (sx < 0 ? 0.06 * s : 0), o[1] + 0.04 * s, 0.06 * s, 0.025 * s);
      if (s > 40) { g.fillStyle = "rgba(20,20,30,0.7)"; g.beginPath(); g.ellipse(u[0] - R0 * 0.3, u[1] - 0.08 * s, 0.02 * s, 0.015 * s, 0, 0, TAU); g.fill(); }
      if (jahrWinter(jahr)) { g.fillStyle = rgb(mul([246, 249, 255], kO)); g.beginPath(); g.ellipse(o[0], o[1], R0 * 0.85, R0 * 0.38, 0, 0, TAU); g.fill(); }
    } else {
      /* Zinkeimer, umgedreht: unten weit, oben schmal, mit Rillen und Henkel */
      const [u, o, R0, R1] = zyl(0.16, 0.12, 0.2, [168, 172, 178], [150, 154, 160]);
      g.strokeStyle = "rgba(90,95,105,0.6)"; g.lineWidth = Math.max(0.5, 0.008 * s);
      for (const f of [0.3, 0.6]) { const y = u[1] + (o[1] - u[1]) * f, r = R0 + (R1 - R0) * f; g.beginPath(); g.ellipse(u[0], y, r, r * 0.5, 0, 0, Math.PI); g.stroke(); }
      g.strokeStyle = rgb(mul([120, 124, 130], kL)); g.lineWidth = Math.max(0.6, 0.01 * s); g.beginPath(); g.moveTo(u[0] - R0, u[1] - 0.02 * s); g.quadraticCurveTo(u[0], u[1] + 0.12 * s, u[0] + R0, u[1] - 0.02 * s); g.stroke();
      if (jahrWinter(jahr)) { g.fillStyle = rgb(mul([246, 249, 255], kO)); g.beginPath(); g.ellipse(o[0], o[1], R1 * 0.9, R1 * 0.4, 0, 0, TAU); g.fill(); }
    }
  }

  /* Windlicht zu Füßen (Glas, Kerze) */
  function windlichtMalen(g, s, F) {
    if (F.schatten) { g.fillStyle = "#000"; g.fillRect(-0.05 * s, -0.2 * s, 0.1 * s, 0.2 * s); return; }
    const k = lichtK([-0.4, 0.6, 0.6], F.Z, F.jahr), n = F.nacht, w = 0.055 * s, h = 0.17 * KZ * s;
    g.fillStyle = rgb(mul([40, 40, 44], k)); g.fillRect(-w * 1.1, -h - 0.02 * s, w * 2.2, 0.025 * s);
    g.fillStyle = rgb(mul([200, 220, 235], k), 0.35); g.fillRect(-w, -h, w * 2, h);
    g.strokeStyle = rgb(mul([40, 40, 44], k)); g.lineWidth = Math.max(0.5, 0.008 * s); g.strokeRect(-w, -h, w * 2, h);
    g.fillStyle = rgb(mul([236, 230, 214], k)); g.fillRect(-w * 0.4, -h * 0.45, w * 0.8, h * 0.45);
    const fx = 0, fy = -h * 0.45;
    const gr = g.createRadialGradient(fx, fy - 0.02 * s, 0, fx, fy - 0.02 * s, 0.05 * s);
    gr.addColorStop(0, "rgba(255,250,220,1)"); gr.addColorStop(0.5, "rgba(255,190,80,0.8)"); gr.addColorStop(1, "rgba(255,150,40,0)");
    g.fillStyle = gr; g.beginPath(); g.ellipse(fx, fy - 0.025 * s, 0.015 * s, 0.035 * s, 0, 0, TAU); g.fill();
    if (n > 0) {
      const gl = g.createRadialGradient(0, -h * 0.5, 0, 0, -h * 0.5, 0.25 * s);
      gl.addColorStop(0, "rgba(255,210,140," + (0.55 * n) + ")"); gl.addColorStop(1, "rgba(255,180,90,0)");
      g.globalCompositeOperation = "lighter"; g.fillStyle = gl; g.fillRect(-0.25 * s, -h * 0.5 - 0.25 * s, 0.5 * s, 0.5 * s); g.globalCompositeOperation = "source-over";
      if (F.leuchtPunkt) { F.leuchtPunkt(0, -h * 0.5, 0.9 * s, "255,190,110", 0.55, true); F.leuchtPunkt(0, 0, 1.6 * s, "255,170,90", 0.22, true); }
    }
  }

  /* =====================================================================
     DER OSTERSTRAUCH (Forsythie mit Ostereiern)
     ===================================================================== */
  function straussDaten(saat) {
    const rng = ST.zufall((saat | 0) * 7 + 3);
    const aeste = [];
    for (let i = 0; i < 30; i++) {
      const az = i / 30 * TAU + (rng() - 0.5) * 0.3, r = 0.45 + rng() * 0.4, h = 1.05 + rng() * 0.55;
      aeste.push({ az: az, r: r, h: h, b0: [(rng() - 0.5) * 0.12, (rng() - 0.5) * 0.12], id: i });
    }
    const EI = [[220, 40, 50], [250, 200, 40], [60, 120, 210], [80, 170, 80], [240, 120, 40], [200, 90, 190], [250, 250, 245]];
    const eier = [];
    for (let i = 0; i < 26; i++) {
      const a = aeste[(rng() * aeste.length) | 0], t = 0.45 + rng() * 0.4;
      eier.push({ a: a, t: t, f: EI[i % EI.length], f2: EI[(i * 3 + 2) % EI.length], muster: i % 3, lang: 0.06 + rng() * 0.06 });
    }
    const blumen = [];
    for (let i = 0; i < 22; i++) { const w = rng() * TAU, r = 0.55 + rng() * 0.3; blumen.push({ x: Math.cos(w) * r, y: Math.sin(w) * r, h: 0.18 + rng() * 0.12, art: rng() < 0.5 ? 0 : 1 }); }
    return { aeste: aeste, eier: eier, blumen: blumen };
  }
  function astPunkt(A, t, wachs) {
    /* quadratischer Bogen: steigt auf und hängt zur Spitze über */
    const P0 = [A.b0[0], A.b0[1], 0], P1 = [Math.cos(A.az) * A.r * 0.35, Math.sin(A.az) * A.r * 0.35, A.h * 1.05], P2 = [Math.cos(A.az) * A.r, Math.sin(A.az) * A.r, A.h * 0.5];
    const u = 1 - t;
    return [(u * u * P0[0] + 2 * u * t * P1[0] + t * t * P2[0]) * wachs, (u * u * P0[1] + 2 * u * t * P1[1] + t * t * P2[1]) * wachs, (u * u * P0[2] + 2 * u * t * P1[2] + t * t * P2[2]) * wachs];
  }
  function straussMalen(g, s, F, D, A) {
    const V = blick(F.gier, s), Z = F.Z, jahr = F.jahr, w = A.wachs;
    if (F.schatten) {
      const T = g.getTransform(); g.setTransform(1, 0, 0, 1, T.e, T.f); g.fillStyle = "#000"; g.beginPath();
      const pts = [];
      for (const a of D.aeste) for (const t of [0.3, 0.6, 1]) { const p = astPunkt(a, t, w); pts.push(V.boden(p[0], p[1], p[2])); }
      /* Hülle */
      pts.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
      const kr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
      const lo = [], hi = [];
      for (const p of pts) { while (lo.length >= 2 && kr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
      for (let i = pts.length - 1; i >= 0; i--) { const p = pts[i]; while (hi.length >= 2 && kr(hi[hi.length - 2], hi[hi.length - 1], p) <= 0) hi.pop(); hi.push(p); }
      hi.pop(); lo.pop(); dazu(g, lo.concat(hi));
      g.globalAlpha = 0.75; g.fill(); g.globalAlpha = 1;
      return;
    }
    /* Beet: dunkle Erde mit frischem Grasrand */
    const kU = lichtK([0, 0, 1], Z, jahr), p0 = V.p(0, 0, 0);
    g.fillStyle = rgb(mul([96, 72, 52], kU)); g.beginPath(); g.ellipse(p0[0], p0[1], 0.95 * s, 0.475 * s, 0, 0, TAU); g.fill();
    const rngE = ST.zufall(3);
    /* Grasbüschel wachsen über den Beetrand */
    g.lineCap = "round"; g.lineWidth = Math.max(0.5, 0.012 * s);
    for (let i = 0; i < 140; i++) {
      const w = rngE() * TAU, r = 0.9 + rngE() * 0.12, x = p0[0] + Math.cos(w) * r * s, y = p0[1] + Math.sin(w) * r * 0.5 * s;
      g.strokeStyle = rgb(mul([70 + rngE() * 40, 130 + rngE() * 40, 50], kU)); g.beginPath(); g.moveTo(x, y); g.lineTo(x + (rngE() - 0.5) * 0.05 * s, y - (0.04 + rngE() * 0.06) * s); g.stroke();
    }
    g.fillStyle = rgb(mul([70, 52, 38], kU)); for (let i = 0; i < 40; i++) { g.beginPath(); g.arc(p0[0] + (rngE() - 0.5) * 1.6 * s, p0[1] + (rngE() - 0.5) * 0.7 * s, Math.max(0.5, 0.02 * s), 0, TAU); g.fill(); }
    /* Teile sammeln */
    const dinge = [];
    for (const a of D.aeste) {
      for (let k = 0; k < 3; k++) {
        const t0 = k / 3, t1 = (k + 1) / 3, m = astPunkt(a, (t0 + t1) / 2, w);
        dinge.push({ art: 0, a: a, t0: t0, t1: t1, t: V.tiefe(m[0], m[1], m[2]) });
      }
    }
    if (A.eier) for (const e of D.eier) { const p = astPunkt(e.a, e.t, w); dinge.push({ art: 1, e: e, p: p, t: V.tiefe(p[0], p[1], p[2] - e.lang) + 0.01 }); }
    if (A.blumen) for (const b of D.blumen) dinge.push({ art: 2, b: b, t: V.tiefe(b.x, b.y, 0.1) });
    dinge.sort((a, b) => a.t - b.t);
    const bluete = [252, 206, 40];
    for (const d of dinge) {
      if (d.art === 0) {
        const a = d.a, kA = lichtK(V.n(Math.cos(a.az), Math.sin(a.az), 0.6), Z, jahr);
        const pts = []; for (let i = 0; i <= 5; i++) { const p = astPunkt(a, d.t0 + (d.t1 - d.t0) * i / 5, w); pts.push(V.p(p[0], p[1], p[2])); }
        g.strokeStyle = rgb(mul([112, 84, 56], kA)); g.lineWidth = Math.max(0.6, (0.022 - d.t0 * 0.012) * s); g.lineCap = "round";
        g.beginPath(); pts.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.stroke();
        /* Blüten dicht an den Zweigen (Forsythie blüht vor dem Laub) */
        if (A.bluete > 0 && d.t1 > 0.2) {
          const rr = ST.zufall(a.id * 17 + ((d.t0 * 10) | 0));
          const n = Math.round((s > 40 ? 26 : 12) * A.bluete);
          for (let i = 0; i < n; i++) {
            const t = d.t0 + rr() * (d.t1 - d.t0), p = astPunkt(a, t, w);
            const q = V.p(p[0] + (rr() - 0.5) * 0.08, p[1] + (rr() - 0.5) * 0.08, p[2] + (rr() - 0.5) * 0.06);
            const kb = rr() < 0.25 ? skal(kA, 0.75) : kA;
            if (s > 45) {
              g.fillStyle = rgb(mul(bluete, kb));
              for (let j = 0; j < 4; j++) { const ang = j * Math.PI / 2 + rr(); g.beginPath(); g.ellipse(q[0] + Math.cos(ang) * 0.012 * s, q[1] + Math.sin(ang) * 0.012 * s, 0.014 * s, 0.006 * s, ang, 0, TAU); g.fill(); }
            } else { g.fillStyle = rgb(mul(bluete, kb)); g.beginPath(); g.arc(q[0], q[1], Math.max(0.7, 0.022 * s), 0, TAU); g.fill(); }
            if (rr() < 0.12) { g.fillStyle = rgb(mul([120, 180, 70], kA)); g.beginPath(); g.ellipse(q[0] + 0.01 * s, q[1], Math.max(0.6, 0.02 * s), Math.max(0.4, 0.009 * s), rr() * 3, 0, TAU); g.fill(); }
          }
        }
      } else if (d.art === 1) {
        const e = d.e, p = d.p, oben = V.p(p[0], p[1], p[2]), unten = V.p(p[0], p[1], p[2] - e.lang);
        g.strokeStyle = rgb(mul([230, 60, 80], lichtK([0, 1, 0.3], Z, jahr))); g.lineWidth = Math.max(0.4, 0.004 * s);
        g.beginPath(); g.moveTo(oben[0], oben[1]); g.lineTo(unten[0], unten[1]); g.stroke();
        const kE = lichtK([-0.3, 0.6, 0.6], Z, jahr), rx = Math.max(1, 0.04 * s), ry = Math.max(1.3, 0.055 * s), cy = unten[1] + ry;
        const gr = g.createRadialGradient(unten[0] - rx * 0.4, cy - ry * 0.4, rx * 0.1, unten[0], cy, ry * 1.1);
        gr.addColorStop(0, rgb(mul(e.f, skal(kE, 1.25)))); gr.addColorStop(1, rgb(mul(e.f, skal(kE, 0.62))));
        g.fillStyle = gr; g.beginPath(); g.ellipse(unten[0], cy, rx, ry, 0, 0, TAU); g.fill();
        if (s > 40) {
          g.save(); g.beginPath(); g.ellipse(unten[0], cy, rx, ry, 0, 0, TAU); g.clip();
          g.fillStyle = rgb(mul(e.f2, kE));
          if (e.muster === 0) { g.fillRect(unten[0] - rx, cy - ry * 0.15, rx * 2, ry * 0.3); }
          else if (e.muster === 1) { for (let j = 0; j < 5; j++) { g.beginPath(); g.arc(unten[0] + (j % 3 - 1) * rx * 0.5, cy + (j < 3 ? -0.3 : 0.35) * ry, rx * 0.18, 0, TAU); g.fill(); } }
          else { g.beginPath(); for (let j = 0; j <= 8; j++) { const x = unten[0] - rx + j * rx / 4, y = cy + (j % 2 ? -0.2 : 0.2) * ry; if (j) g.lineTo(x, y); else g.moveTo(x, y); } g.lineWidth = Math.max(0.6, rx * 0.25); g.strokeStyle = rgb(mul(e.f2, kE)); g.stroke(); }
          g.restore();
          g.fillStyle = "rgba(255,255,255,0.45)"; g.beginPath(); g.ellipse(unten[0] - rx * 0.35, cy - ry * 0.4, rx * 0.22, ry * 0.18, -0.4, 0, TAU); g.fill();
        }
      } else {
        const b = d.b, f = V.p(b.x, b.y, 0), k = V.p(b.x, b.y, b.h), kB = lichtK([-0.3, 0.6, 0.7], Z, jahr);
        g.strokeStyle = rgb(mul([70, 130, 55], kB)); g.lineWidth = Math.max(0.5, 0.015 * s); g.beginPath(); g.moveTo(f[0], f[1]); g.lineTo(k[0], k[1]); g.stroke();
        const r = Math.max(0.9, 0.04 * s);
        if (b.art === 0) {
          g.fillStyle = rgb(mul([250, 226, 70], kB)); g.beginPath(); for (let i = 0; i < 12; i++) { const a = i / 12 * TAU, rr = i % 2 ? r * 0.45 : r; g.lineTo(k[0] + Math.cos(a) * rr, k[1] + Math.sin(a) * rr * 0.7); } g.closePath(); g.fill();
          g.fillStyle = rgb(mul([245, 150, 30], kB)); g.beginPath(); g.arc(k[0], k[1], r * 0.4, 0, TAU); g.fill();
        } else {
          g.fillStyle = rgb(mul([220, 40, 60], kB)); g.beginPath(); g.moveTo(k[0] - r, k[1] - r * 1.3); g.quadraticCurveTo(k[0] - r * 1.1, k[1] + r * 0.4, k[0], k[1] + r * 0.3); g.quadraticCurveTo(k[0] + r * 1.1, k[1] + r * 0.4, k[0] + r, k[1] - r * 1.3); g.lineTo(k[0], k[1] - r * 0.8); g.closePath(); g.fill();
        }
      }
    }
  }

  /* =====================================================================
     DAS MODELL
     ===================================================================== */
  ST.modell("schneemann", {
    name: "Schneemann", gruppe: "Weihnachten", grund: [1.3, 1.3], hoehe: 1.9, bauzeit: 90,
    bauen: function (M, o) {
      const bau = o.bau == null ? 1 : o.bau;
      const saat = Math.abs(o.saat | 0) || 1;
      M.teil("figur", { mitte: [0, 0, 0] });
      if (o.jahr === "winter") {
        const D = schneemannDaten(saat);
        /* Bauen wie im echten Leben: untere Kugel rollen, mittlere drauf,
           Kopf drauf, dann Kohle, Nase, Arme, Schal, Hut */
        const n = bau < 0.35 ? 1 : bau < 0.6 ? 2 : 3;
        const letzte = n === 1 ? 0.3 + 0.7 * phase(bau, 0, 0.3) : n === 2 ? 0.5 + 0.5 * phase(bau, 0.35, 0.5) : 0.6 + 0.4 * phase(bau, 0.6, 0.72);
        const A = { kugeln: n, letzte: letzte, gesicht: bau >= 0.8, arme: bau >= 0.85, schal: bau >= 0.9, hut: bau >= 0.95, lampe: bau >= 1 };
        M.figur({ x: 0, y: 0, z: 0, breite: 2.0, hoehe: 2.0, malen: mitGier(function (g, s, F) {
          if (F.schatten) return schneemannMalen(g, s, F, D, A);
          aufCpu(g, -1.1 * s, -2.1 * KZ * s, 2.2 * s, 2.1 * KZ * s + 0.8 * s, function (cg) { schneemannMalen(cg, s, F, D, A); });
        }) });
        if (A.lampe) {
          M.figur({ x: 0.44, y: 0.22, z: 0, breite: 0.3, hoehe: 0.3, malen: windlichtMalen });
        }
      } else {
        const D = straussDaten(saat);
        const A = { wachs: 0.3 + 0.7 * phase(bau, 0.1, 0.6), bluete: phase(bau, 0.4, 0.8), eier: bau >= 0.85, blumen: bau >= 0.7 };
        M.figur({ x: 0, y: 0, z: 0, breite: 2.2, hoehe: 1.9, malen: mitGier(function (g, s, F) {
          if (F.schatten) return straussMalen(g, s, F, D, A);
          aufCpu(g, -1.2 * s, -2.0 * KZ * s, 2.4 * s, 2.0 * KZ * s + 0.8 * s, function (cg) { straussMalen(cg, s, F, D, A); });
        }) });
      }
    }
  });
})();
