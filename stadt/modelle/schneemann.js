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
   Treppenstufen. Abends und nachts brennt die Kerze in einer Laterne
   (Blech und Glas) zu seinen Füßen und wärmt die untere Kugel von der
   Seite; tagsüber ist sie aus. Am Boden: weicher Kontaktschatten, ein
   Schneekragen um den Fuß, die Rollspur der unteren Kugel (mit
   freigerolltem Gras) und Stiefelabdrücke. Auf der unteren Kugel kleben
   Laub, Erdkrümel und Halme vom Rollen.

   Kohleaugen, Karottennase, Mund, Knöpfe, Schal, Reisigarme und Hut
   haben ihren Platz im Raum: Dreht man den Schneemann, schaut er weg.
   Varianten über o.saat: Zylinder, alter Kochtopf oder Zinkeimer; Schal
   in drei Farben.

   FRÜHLING: ein Osterstrauch statt eines halb geschmolzenen Schneemanns.
   Begründung: In der Frühlingssonne neben frischem Grün wäre ein halber
   Schneehaufen grau und traurig – kein „Liebreiz". Ein blühender
   Forsythienstrauch mit bemalten Ostereiern ist ein echter deutscher
   Brauch, braucht denselben Platz und passt zum „Frühlingsgewand".
   Beet aus Rindenmulch mit Feldsteinrand, Forsythie mit Seitentrieben
   und Blütenbüscheln, Eier an Seidenbändern mit Schleife, Osterglocken
   und Tulpen, ein ausgesägter Holzhase. Der Name im Menü folgt der
   Jahreszeit („Schneemann" / „Osterstrauch").
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
    /* Beim Rollen nimmt die untere Kugel Laub, Erde und Grashalme mit */
    const flecken = [];
    for (let i = 0; i < 24; i++) flecken.push({ az: rng() * TAU, el: -0.62 + Math.pow(rng(), 1.8) * 1.0, art: rng() < 0.4 ? 0 : rng() < 0.55 ? 1 : 2, rot: rng() * 3, gr: 0.4 + rng() * 0.6, f: rng() });
    /* Fußabdrücke: ein Weg um den Schneemann herum */
    const tritte = [];
    const w0 = rng() * TAU;
    for (let i = 0; i < 9; i++) { const w = w0 + i * 0.36, r = 0.6 + 0.08 * Math.sin(i * 1.3), seite = i % 2 ? 1 : -1; tritte.push({ x: Math.cos(w) * (r + seite * 0.06), y: Math.sin(w) * (r + seite * 0.06), w: w + Math.PI / 2 + (rng() - 0.5) * 0.2 }); }
    return { kugeln: kugeln, hut: HUETE[(saat | 0) % 3], schal: SCHALS[((saat | 0) >> 2) % 3], neig: (rng() - 0.5) * 0.12, drehKopf: (rng() - 0.5) * 0.35,
      flecken: flecken, tritte: tritte, spurW: w0 + Math.PI + 0.4 + rng() * 0.6, spurPh: rng() * 3, saat: saat | 0 };
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
    /* Boden: Rollspur, Stiefelabdrücke, Kontaktschatten unter der Kugel */
    if (A.kugeln > 0) bodenMalen(g, V, F, D, A);
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
    /* Laub, Erde und Halme auf der unteren Kugel (beim Rollen aufgelesen) */
    {
      const unten = K3[0], r0 = unten.r * (A.kugeln === 1 ? A.letzte : 1), cz = r0 * 0.87;
      const ku = { c: [unten.c[0], unten.c[1], cz], r: r0 };
      for (const f of D.flecken) {
        const p = aufKugel(ku, f.az, f.el, 0.004);
        if (p[2] < 0.04) continue;
        const sv = sicht(ku, p);
        if (sv < 0.12) continue;
        rein(true, V.tiefe(p[0], p[1], p[2]), () => {
          const q = V.p(p[0], p[1], p[2]), kF = lichtK(V.n(p[0] - ku.c[0], p[1] - ku.c[1], p[2] - ku.c[2]), Z, jahr), sq = Math.sqrt(sv);
          if (f.art === 0) { g.fillStyle = rgb(mul([132 + f.f * 40, 88 + f.f * 24, 44], kF), 0.75); g.beginPath(); g.ellipse(q[0], q[1], Math.max(0.6, 0.02 * f.gr * s), Math.max(0.4, 0.011 * f.gr * s * sq), f.rot, 0, TAU); g.fill(); if (s > 60) { g.strokeStyle = rgb(mul([80, 48, 24], kF), 0.7); g.lineWidth = Math.max(0.4, 0.002 * s); g.beginPath(); g.moveTo(q[0] - Math.cos(f.rot) * 0.018 * f.gr * s, q[1] - Math.sin(f.rot) * 0.018 * f.gr * s); g.lineTo(q[0] + Math.cos(f.rot) * 0.018 * f.gr * s, q[1] + Math.sin(f.rot) * 0.018 * f.gr * s); g.stroke(); } }
          else if (f.art === 1) { g.fillStyle = rgb(mul([96, 80, 64], kF), 0.5); g.beginPath(); g.ellipse(q[0], q[1], Math.max(0.5, 0.012 * f.gr * s), Math.max(0.4, 0.008 * f.gr * s), f.rot, 0, TAU); g.fill(); }
          else { g.strokeStyle = rgb(mul([140, 146, 84], kF), 0.85); g.lineWidth = Math.max(0.4, 0.003 * s); g.beginPath(); g.moveTo(q[0], q[1]); g.quadraticCurveTo(q[0] + 0.012 * s, q[1] - 0.01 * s, q[0] + Math.cos(f.rot) * 0.03 * s, q[1] - 0.012 * s); g.stroke(); }
        });
      }
      /* Schneekragen: am Fuß angehäufter Schnee, vordere Hälfte nach der Kugel */
      rein(true, 98, () => kragenMalen(g, V, F, r0, cz));
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
      /* Griffe: zwei kleine Laschen seitlich auf halber Höhe (genietet) */
      const my = (u[1] + o[1]) / 2;
      for (const sx of [-1, 1]) {
        const kk = sx < 0 ? kL : skal(kR, 0.8), x0 = u[0] + sx * R0 - (sx < 0 ? 0.05 * s : 0);
        g.fillStyle = rgb(mul([36, 36, 40], kk)); g.beginPath(); g.moveTo(x0, my - 0.012 * s); g.lineTo(x0 + 0.05 * s, my - 0.012 * s); g.lineTo(x0 + 0.05 * s, my + 0.012 * s); g.lineTo(x0, my + 0.012 * s); g.closePath(); g.fill();
        if (s > 50) { g.fillStyle = "rgba(200,200,210,0.6)"; g.beginPath(); g.arc(u[0] + sx * R0 * 0.93, my, 0.006 * s, 0, TAU); g.fill(); }
      }
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

  /* Boden um den Schneemann: Rollspur der unteren Kugel (festgepresster,
     leicht bläulicher Schnee mit Randwülsten und freigerolltem Gras),
     Stiefelabdrücke und der weiche Kontaktschatten unter der Kugel */
  function bodenMalen(g, V, F, D, A) {
    const s = V.s, Z = F.Z, jahr = F.jahr, kU = lichtK([0, 0, 1], Z, jahr), rng = ST.zufall(D.saat * 5 + 1);
    const w = D.spurW, ex = [Math.cos(w), Math.sin(w)], ey = [-ex[1], ex[0]];
    const L = 0.85, B = 0.2;
    const P = (u, q) => { const c = 0.3 + u * L, bo = 0.12 * Math.sin(u * 2.4 + D.spurPh); const p = [ex[0] * c + ey[0] * (bo + q), ex[1] * c + ey[1] * (bo + q)]; return V.p(p[0], p[1], 0); };
    const li = [], re = [];
    /* Breite: vorn (an der Kugel) voll, zum Anfang hin schmal und rund auslaufend */
    for (let i = 0; i <= 18; i++) { const u = i / 18, b = B * Math.sqrt(Math.max(0, 1 - Math.pow(u, 3))) * (0.94 + 0.06 * Math.sin(i * 1.9)); li.push(P(u, -b)); re.push(P(u, b)); }
    const pfad = () => { g.beginPath(); li.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); for (let i = re.length - 1; i >= 0; i--) g.lineTo(re[i][0], re[i][1]); g.closePath(); };
    /* weiche Kante: erst breiter, blasser Rand, dann die gepresste Fläche */
    g.lineJoin = "round"; g.lineCap = "round";
    pfad(); g.strokeStyle = rgb(mul([226, 234, 246], kU), 0.35); g.lineWidth = Math.max(1, 0.05 * s); g.stroke();
    g.fillStyle = rgb(mul([222, 230, 244], kU), 0.7); g.fill();
    if (s > 24) {
      g.save(); pfad(); g.clip();
      /* freigerollter Boden: einzelne Grasbüschel und Erdkrümel schimmern durch */
      for (let i = 0; i < 9; i++) {
        const u = 0.15 + rng() * 0.75, q = (rng() - 0.5) * B * 1.1, p = P(u, q), gras = rng() < 0.65;
        g.fillStyle = gras ? rgb(mul([118, 128, 88], kU), 0.45) : rgb(mul([120, 100, 78], kU), 0.4);
        for (let k = 0; k < 4; k++) { g.beginPath(); g.ellipse(p[0] + (rng() - 0.5) * 0.04 * s, p[1] + (rng() - 0.5) * 0.02 * s, (0.008 + rng() * 0.014) * s, (0.005 + rng() * 0.008) * s, rng() * 3, 0, TAU); g.fill(); }
      }
      g.restore();
    }
    /* Randwülste: weggedrückter Schnee, oben hell, zur Spur hin Schatten */
    for (const kante of [li, re]) {
      g.strokeStyle = rgb(mul([176, 192, 222], kU), 0.35); g.lineWidth = Math.max(0.7, 0.022 * s);
      g.beginPath(); kante.forEach((p, i) => (i ? g.lineTo(p[0], p[1] + 0.006 * s) : g.moveTo(p[0], p[1] + 0.006 * s))); g.stroke();
      g.strokeStyle = rgb(mul([252, 253, 255], kU), 0.9); g.lineWidth = Math.max(0.6, 0.016 * s);
      g.beginPath(); kante.forEach((p, i) => (i ? g.lineTo(p[0], p[1] - 0.005 * s) : g.moveTo(p[0], p[1] - 0.005 * s))); g.stroke();
    }
    /* Stiefelabdrücke: Sohle und Absatz, bläulich im Schatten des Randes */
    if (s > 18) for (const t of D.tritte) {
      const c = Math.cos(t.w), sn = Math.sin(t.w);
      const ab = (x0, y0, lx, ly) => { const pts = []; for (let j = 0; j < 10; j++) { const a = j / 10 * TAU, x = x0 + Math.cos(a) * lx, y = y0 + Math.sin(a) * ly; pts.push(V.p(t.x + x * c - y * sn, t.y + x * sn + y * c, 0)); } g.beginPath(); pts.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.closePath(); g.fill(); };
      g.fillStyle = rgb(mul([168, 186, 220], kU), 0.55); ab(0.04, 0, 0.075, 0.045); ab(-0.09, 0, 0.035, 0.038);
      if (s > 50) { g.fillStyle = rgb(mul([150, 170, 208], kU), 0.35); ab(0.05, 0.008, 0.05, 0.028); }
    }
    /* Kontaktschatten: die Kugel sitzt schwer im Schnee */
    const r0 = D.kugeln[0].r * (A.kugeln === 1 ? A.letzte : 1), p = V.p(0, 0, 0);
    const ao = g.createRadialGradient(p[0], p[1], 0, p[0], p[1], r0 * 1.25 * s);
    ao.addColorStop(0, rgb(mul([96, 116, 160], kU), 0.55)); ao.addColorStop(0.6, rgb(mul([130, 150, 190], kU), 0.3)); ao.addColorStop(1, rgb(mul([200, 212, 236], kU), 0));
    g.save(); g.translate(p[0], p[1]); g.scale(1, 0.5); g.translate(-p[0], -p[1]);
    g.fillStyle = ao; g.beginPath(); g.arc(p[0], p[1], r0 * 1.25 * s, 0, TAU); g.fill(); g.restore();
  }
  /* Schneekragen: um den Fuß der unteren Kugel angehäufter Schnee.
     Nur die vordere Hälfte wird nach der Kugel gemalt. */
  function kragenMalen(g, V, F, r0, cz) {
    const s = V.s, Z = F.Z, jahr = F.jahr, kU = lichtK([0, 0.4, 0.9], Z, jahr);
    const zi = Math.min(0.12, cz), ri = Math.sqrt(Math.max(0, r0 * r0 - (cz - zi) * (cz - zi))) + 0.01, ra = ri + 0.12;
    const aus = [], ein = [];
    for (let j = 0; j <= 24; j++) {
      const w = j / 24 * Math.PI, dw = [Math.cos(w) * EX[0] + Math.sin(w) * Math.SQRT1_2, Math.cos(w) * EX[1] + Math.sin(w) * Math.SQRT1_2];
      const l = Math.hypot(dw[0], dw[1]) || 1, d = [dw[0] / l, dw[1] / l];
      /* Richtung im Kameraraum → Modellraum zurückdrehen */
      const mx = d[0] * V.c + d[1] * V.sn, my = -d[0] * V.sn + d[1] * V.c;
      const buckel = 1 + 0.07 * Math.sin(j * 0.9 + r0 * 10) + 0.03 * Math.sin(j * 2.1);
      aus.push(V.p(mx * ra * buckel, my * ra * buckel, 0));
      ein.push(V.p(mx * ri, my * ri, zi * (0.85 + 0.15 * Math.sin(j * 0.8))));
    }
    /* weich: Mittelpunkte mit Bézierkurven verbinden, keine Zacken */
    const glatt = (pts, erst) => { if (erst) g.moveTo(pts[0][0], pts[0][1]); else g.lineTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length - 1; i++) g.quadraticCurveTo(pts[i][0], pts[i][1], (pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2); g.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]); };
    g.beginPath(); glatt(aus, true); glatt(ein.slice().reverse(), false); g.closePath();
    const top = Math.min(...ein.map((p) => p[1])), bot = Math.max(...aus.map((p) => p[1]));
    const gr = g.createLinearGradient(0, top, 0, bot);
    gr.addColorStop(0, rgb(mul([250, 252, 255], kU))); gr.addColorStop(0.6, rgb(mul([232, 238, 248], kU))); gr.addColorStop(1, rgb(mul([196, 210, 234], kU)));
    g.fillStyle = gr; g.fill();
  }

  /* Windlicht zu Füßen: Laterne aus Blech und Glas mit Stumpenkerze.
     Die Kerze brennt nur abends und nachts. */
  function windlichtMalen(g, s, F) {
    const r = 0.065 * s, h = 0.2 * KZ * s;
    if (F.schatten) { g.fillStyle = "#000"; g.fillRect(-r, -h - 0.06 * s, 2 * r, h + 0.06 * s); return; }
    const Z = F.Z, jahr = F.jahr, n = F.nacht || 0, an = n > 0.05;
    const kL = lichtK([-0.62, 0.62, 0.3], Z, jahr), kV = lichtK([0.62, 0.62, 0.3], Z, jahr), kR = lichtK([0.62, -0.62, 0.3], Z, jahr), kO = lichtK([0, 0, 1], Z, jahr);
    const blech = [52, 50, 48];
    const zyl = (y0, y1, rr, farbe, a) => {
      const gr = g.createLinearGradient(-rr, 0, rr, 0);
      gr.addColorStop(0, rgb(mul(farbe, kL), a)); gr.addColorStop(0.4, rgb(mul(farbe, kV), a)); gr.addColorStop(1, rgb(mul(farbe, skal(kR, 0.8)), a));
      g.fillStyle = gr; g.beginPath(); g.moveTo(-rr, y1); g.lineTo(-rr, y0); g.ellipse(0, y0, rr, rr * 0.5, 0, Math.PI, 0, true); g.lineTo(rr, y1); g.ellipse(0, y1, rr, rr * 0.5, 0, 0, Math.PI); g.closePath(); g.fill();
    };
    /* Boden aus Blech */
    zyl(-0.025 * s, 0, r * 1.12, blech, 1);
    g.fillStyle = rgb(mul(blech, skal(kO, 1.1))); g.beginPath(); g.ellipse(0, -0.025 * s, r * 1.12, r * 0.56, 0, 0, TAU); g.fill();
    /* Kerze */
    const kh = 0.1 * KZ * s, ky = -0.025 * s;
    zyl(ky - kh, ky, r * 0.5, [238, 230, 212], 1);
    g.fillStyle = rgb(mul([246, 240, 226], kO)); g.beginPath(); g.ellipse(0, ky - kh, r * 0.5, r * 0.25, 0, 0, TAU); g.fill();
    g.strokeStyle = "rgba(30,24,20,0.8)"; g.lineWidth = Math.max(0.4, 0.004 * s); g.beginPath(); g.moveTo(0, ky - kh); g.lineTo(0, ky - kh - 0.012 * s); g.stroke();
    if (an) {
      const fy = ky - kh - 0.03 * s;
      const fl = g.createRadialGradient(0, fy + 0.006 * s, 0, 0, fy, 0.022 * s);
      fl.addColorStop(0, "rgba(255,252,230,1)"); fl.addColorStop(0.5, "rgba(255,200,90,0.95)"); fl.addColorStop(1, "rgba(255,140,40,0)");
      g.fillStyle = fl; g.beginPath(); g.moveTo(0, fy - 0.03 * s); g.quadraticCurveTo(0.012 * s, fy, 0, fy + 0.014 * s); g.quadraticCurveTo(-0.012 * s, fy, 0, fy - 0.03 * s); g.fill();
      /* warmes Licht im Glas */
      const gl = g.createRadialGradient(0, fy, 0, 0, fy, r * 1.3);
      gl.addColorStop(0, "rgba(255,210,140," + (0.55 * n).toFixed(3) + ")"); gl.addColorStop(1, "rgba(255,170,80,0)");
      g.globalCompositeOperation = "lighter"; g.fillStyle = gl; g.fillRect(-r * 1.3, fy - r * 1.3, r * 2.6, r * 2.6); g.globalCompositeOperation = "source-over";
    }
    /* Glaszylinder: fast durchsichtig, Glanzkanten links, dunkle Kante rechts */
    const gy0 = -0.025 * s, gy1 = -h - 0.025 * s;
    g.fillStyle = an ? "rgba(255,226,170,0.12)" : rgb(mul([200, 220, 236], kV), 0.18); g.beginPath(); g.moveTo(-r, gy0); g.lineTo(-r, gy1); g.lineTo(r, gy1); g.lineTo(r, gy0); g.ellipse(0, gy0, r, r * 0.5, 0, 0, Math.PI); g.closePath(); g.fill();
    g.strokeStyle = "rgba(255,255,255,0.7)"; g.lineWidth = Math.max(0.5, 0.008 * s); g.beginPath(); g.moveTo(-r * 0.7, gy0 - 0.01 * s); g.lineTo(-r * 0.7, gy1 + 0.01 * s); g.stroke();
    g.strokeStyle = rgb(mul(blech, kV), 0.9); g.lineWidth = Math.max(0.5, 0.006 * s);
    for (const x of [-r, r]) { g.beginPath(); g.moveTo(x, gy0); g.lineTo(x, gy1); g.stroke(); }
    /* Deckel mit kleinem Dach und Bügel */
    zyl(gy1 - 0.02 * s, gy1, r * 1.1, blech, 1);
    g.fillStyle = rgb(mul(blech, kV)); g.beginPath(); g.ellipse(0, gy1 - 0.02 * s, r * 1.1, r * 0.55, 0, 0, TAU); g.fill();
    g.fillStyle = rgb(mul(blech, kL)); g.beginPath(); g.moveTo(-r * 0.9, gy1 - 0.02 * s); g.lineTo(0, gy1 - 0.065 * s); g.lineTo(r * 0.9, gy1 - 0.02 * s); g.closePath(); g.fill();
    if (jahr === "winter") { g.fillStyle = rgb(mul([246, 249, 255], kO)); g.beginPath(); g.moveTo(-r * 0.75, gy1 - 0.028 * s); g.quadraticCurveTo(0, gy1 - 0.085 * s, r * 0.6, gy1 - 0.03 * s); g.closePath(); g.fill(); }
    g.strokeStyle = rgb(mul(blech, kV)); g.lineWidth = Math.max(0.5, 0.006 * s); g.beginPath(); g.ellipse(0, gy1 - 0.075 * s, 0.025 * s, 0.02 * s, 0, Math.PI, 0); g.stroke();
    /* Der Lichtschein der Szene liegt über allem (unverdeckt). Steht die
       Laterne hinter der unteren Kugel, wird er darum abgeschwächt bzw.
       weggelassen – sonst leuchtet sie durch den Schneemann hindurch. */
    if (an && F.leuchtPunkt) {
      const V = blick(F.gier || 0, s), pL = V.p(0.44, 0.22, 0.12), pK = V.p(0, 0, 0.33);
      const hinten = V.tiefe(0.44, 0.22, 0) < V.tiefe(0, 0, 0), d = Math.hypot(pL[0] - pK[0], pL[1] - pK[1]) / (0.4 * s);
      const sicht = hinten ? Math.max(0, Math.min(1, (d - 0.75) / 0.5)) : 1;
      if (sicht > 0.05) { F.leuchtPunkt(0, -h * 0.5, 0.7 * s, "255,190,110", 0.5 * sicht, true); F.leuchtPunkt(0, 0, 1.4 * s, "255,170,90", 0.2 * sicht, true); }
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
      /* Seitentriebe: kurze, leicht aufsteigende Zweige, auch sie blühen */
      const zweige = [];
      const nz = 1 + ((rng() * 3) | 0);
      for (let k = 0; k < nz; k++) zweige.push({ t: 0.35 + rng() * 0.45, dw: (rng() < 0.5 ? -1 : 1) * (0.4 + rng() * 0.5), l: 0.14 + rng() * 0.2, auf: 0.05 + rng() * 0.25 });
      aeste.push({ az: az, r: r, h: h, b0: [(rng() - 0.5) * 0.12, (rng() - 0.5) * 0.12], id: i, zweige: zweige });
    }
    const EI = [[214, 38, 50], [246, 196, 40], [52, 112, 206], [74, 164, 78], [236, 116, 36], [190, 84, 184], [246, 244, 236]];
    const BAND = [[200, 30, 40], [40, 90, 180], [250, 250, 245], [240, 190, 40]];
    const eier = [];
    for (let i = 0; i < 24; i++) {
      const a = aeste[(rng() * aeste.length) | 0], t = 0.45 + rng() * 0.4;
      eier.push({ a: a, t: t, f: EI[i % EI.length], f2: EI[(i * 3 + 2) % EI.length], band: BAND[i % BAND.length], muster: i % 4, lang: 0.07 + rng() * 0.06, kipp: (rng() - 0.5) * 0.3 });
    }
    const blumen = [];
    for (let i = 0; i < 24; i++) { const w = rng() * TAU, r = 0.52 + rng() * 0.3; blumen.push({ x: Math.cos(w) * r, y: Math.sin(w) * r, h: 0.2 + rng() * 0.12, art: rng() < 0.55 ? 0 : 1, dreh: rng() * TAU, n: rng() }); }
    /* Einfassung aus Feldsteinen */
    const steine = [];
    for (let i = 0; i < 30; i++) { const w = (i + rng() * 0.4) / 30 * TAU; steine.push({ w: w, r: 0.96 + (rng() - 0.5) * 0.04, g: 0.07 + rng() * 0.035, f: 0.85 + rng() * 0.3, h: rng() }); }
    /* ein Holzhase (ausgesägt, bemalt) steht im Beet */
    const hw = rng() * TAU;
    return { aeste: aeste, eier: eier, blumen: blumen, steine: steine, hase: { x: Math.cos(hw) * 0.66, y: Math.sin(hw) * 0.66, w: hw + Math.PI / 2 + (rng() - 0.5) * 0.6 }, saat: saat | 0 };
  }
  function astPunkt(A, t, wachs) {
    /* quadratischer Bogen: steigt auf und hängt zur Spitze über */
    const P0 = [A.b0[0], A.b0[1], 0], P1 = [Math.cos(A.az) * A.r * 0.35, Math.sin(A.az) * A.r * 0.35, A.h * 1.05], P2 = [Math.cos(A.az) * A.r, Math.sin(A.az) * A.r, A.h * 0.5];
    const u = 1 - t;
    return [(u * u * P0[0] + 2 * u * t * P1[0] + t * t * P2[0]) * wachs, (u * u * P0[1] + 2 * u * t * P1[1] + t * t * P2[1]) * wachs, (u * u * P0[2] + 2 * u * t * P1[2] + t * t * P2[2]) * wachs];
  }
  function zweigEnde(A, z, wachs) {
    const b = astPunkt(A, z.t, wachs), w = A.az + z.dw;
    return [b, [b[0] + Math.cos(w) * z.l * wachs, b[1] + Math.sin(w) * z.l * wachs, b[2] + z.auf * z.l * wachs]];
  }
  function affin(g, V, o, eu, ev) {
    const p0 = V.p(o[0], o[1], o[2]), pu = V.p(o[0] + eu[0], o[1] + eu[1], o[2] + eu[2]), pv = V.p(o[0] + ev[0], o[1] + ev[1], o[2] + ev[2]);
    g.transform(pu[0] - p0[0], pu[1] - p0[1], pv[0] - p0[0], pv[1] - p0[1], p0[0], p0[1]);
  }
  /* Beet: Rindenmulch (Späne, Krümel, kleine Schatten) mit Feldsteinrand */
  function beetMalen(g, V, F, D) {
    const s = V.s, Z = F.Z, jahr = F.jahr, kU = lichtK([0, 0, 1], Z, jahr), p0 = V.p(0, 0, 0), rng = ST.zufall(D.saat * 3 + 11);
    const R = 0.95;
    g.fillStyle = rgb(mul([74, 54, 38], kU)); g.beginPath(); g.ellipse(p0[0], p0[1], R * s, R * s * 0.5, 0, 0, TAU); g.fill();
    g.save(); g.beginPath(); g.ellipse(p0[0], p0[1], R * s, R * s * 0.5, 0, 0, TAU); g.clip();
    const n = s > 60 ? 420 : s > 30 ? 180 : 60;
    for (let i = 0; i < n; i++) {
      const w = rng() * TAU, r = Math.sqrt(rng()) * R, x = p0[0] + Math.cos(w) * r * s, y = p0[1] + Math.sin(w) * r * 0.5 * s;
      const l = (0.018 + rng() * 0.03) * s, b = (0.006 + rng() * 0.008) * s, ro = rng() * 3, c = [104 + rng() * 50, 70 + rng() * 30, 44 + rng() * 18];
      if (s > 40) { g.fillStyle = "rgba(20,12,6,0.35)"; g.beginPath(); g.ellipse(x + 0.003 * s, y + 0.004 * s, l, b, ro, 0, TAU); g.fill(); }
      g.fillStyle = rgb(mul(c, kU)); g.beginPath(); g.ellipse(x, y, l, b, ro, 0, TAU); g.fill();
    }
    g.fillStyle = rgb(mul([40, 28, 20], kU), 0.6); for (let i = 0; i < n * 0.3; i++) { const w = rng() * TAU, r = Math.sqrt(rng()) * R; g.beginPath(); g.arc(p0[0] + Math.cos(w) * r * s, p0[1] + Math.sin(w) * r * 0.5 * s, Math.max(0.4, 0.006 * s), 0, TAU); g.fill(); }
    /* Schatten des Strauchs auf dem Mulch (Mitte dunkler) */
    const ao = g.createRadialGradient(p0[0], p0[1], 0, p0[0], p0[1], 0.6 * s);
    ao.addColorStop(0, "rgba(20,12,6,0.45)"); ao.addColorStop(1, "rgba(20,12,6,0)");
    g.save(); g.translate(p0[0], p0[1]); g.scale(1, 0.5); g.translate(-p0[0], -p0[1]); g.fillStyle = ao; g.fillRect(p0[0] - 0.6 * s, p0[1] - 0.6 * s, 1.2 * s, 1.2 * s); g.restore();
    g.restore();
    /* Feldsteine, nach Tiefe */
    const st = D.steine.map((q) => ({ q: q, x: Math.cos(q.w) * q.r, y: Math.sin(q.w) * q.r })).sort((a, b) => V.tiefe(a.x, a.y, 0) - V.tiefe(b.x, b.y, 0));
    const kL = lichtK([-0.5, 0.5, 0.7], Z, jahr);
    for (const e of st) {
      const q = e.q, p = V.p(e.x, e.y, q.g * 0.4), rx = q.g * s, ry = q.g * s * 0.62, c = [150 * q.f, 144 * q.f, 132 * q.f];
      g.fillStyle = "rgba(30,24,18,0.35)"; g.beginPath(); g.ellipse(p[0] + 0.01 * s, p[1] + ry * 0.5, rx, ry * 0.6, 0, 0, TAU); g.fill();
      const gr = g.createRadialGradient(p[0] - rx * 0.35, p[1] - ry * 0.45, rx * 0.1, p[0], p[1], rx * 1.1);
      gr.addColorStop(0, rgb(mul(c, skal(kL, 1.15)))); gr.addColorStop(1, rgb(mul(c, skal(kU, 0.55))));
      g.fillStyle = gr; g.beginPath(); g.ellipse(p[0], p[1], rx, ry, q.h * 0.6 - 0.3, 0, TAU); g.fill();
      if (s > 60 && q.h > 0.6) { g.fillStyle = "rgba(96,120,60,0.45)"; g.beginPath(); g.ellipse(p[0] + rx * 0.2, p[1] + ry * 0.3, rx * 0.35, ry * 0.25, 0, 0, TAU); g.fill(); }
    }
    /* Grashalme am Außenrand */
    const rngE = ST.zufall(3);
    g.lineCap = "round"; g.lineWidth = Math.max(0.5, 0.01 * s);
    for (let i = 0; i < 110; i++) {
      const w = rngE() * TAU, r = 1.02 + rngE() * 0.08, x = p0[0] + Math.cos(w) * r * s, y = p0[1] + Math.sin(w) * r * 0.5 * s;
      g.strokeStyle = rgb(mul([70 + rngE() * 40, 130 + rngE() * 40, 50], kU)); g.beginPath(); g.moveTo(x, y); g.lineTo(x + (rngE() - 0.5) * 0.04 * s, y - (0.03 + rngE() * 0.05) * s); g.stroke();
    }
  }
  /* Forsythienblüte: vier schmale, hängende Kronblätter, innen dunkler */
  function bluetenBueschel(g, q, s, kb, rr, n) {
    for (let j = 0; j < n; j++) {
      const x = q[0] + (rr() - 0.5) * 0.035 * s, y = q[1] + (rr() - 0.5) * 0.025 * s, dreh = rr() * TAU;
      if (s > 45) {
        for (let k = 0; k < 4; k++) {
          const ang = dreh + k * Math.PI / 2, cx = x + Math.cos(ang) * 0.011 * s, cy = y + Math.sin(ang) * 0.008 * s + 0.004 * s;
          g.fillStyle = rgb(mul([226, 164, 18], kb)); g.beginPath(); g.ellipse(cx, cy, 0.014 * s, 0.0055 * s, ang, 0, TAU); g.fill();
          g.fillStyle = rgb(mul([255, 222, 86], kb)); g.beginPath(); g.ellipse(cx + Math.cos(ang) * 0.004 * s, cy + Math.sin(ang) * 0.003 * s - 0.001 * s, 0.009 * s, 0.0035 * s, ang, 0, TAU); g.fill();
        }
        g.fillStyle = rgb(mul([196, 120, 20], kb)); g.beginPath(); g.arc(x, y + 0.004 * s, 0.004 * s, 0, TAU); g.fill();
      } else { g.fillStyle = rgb(mul(j % 3 ? [250, 206, 40] : [226, 170, 24], kb)); g.beginPath(); g.arc(x, y, Math.max(0.7, 0.02 * s), 0, TAU); g.fill(); }
    }
  }
  /* Osterhase aus Sperrholz: vorn bemalt, hinten rohes Holz mit Pflock */
  function haseMalen(g, V, F, H) {
    const s = V.s, Z = F.Z, jahr = F.jahr;
    const eu = [Math.cos(H.w), Math.sin(H.w), 0], nrm = [-eu[1], eu[0], 0];
    const nk = V.n(nrm[0], nrm[1], 0), vorn = dot(nk, EZ) > 0;
    const k = lichtK(vorn ? V.n(nrm[0], nrm[1], 0.2) : V.n(-nrm[0], -nrm[1], 0.2), Z, jahr);
    const B = 0.3, Hh = 0.44;
    g.save();
    affin(g, V, [H.x - eu[0] * B / 2, H.y - eu[1] * B / 2, Hh + 0.04], eu, [0, 0, -1]);
    const umriss = () => {
      g.beginPath();
      g.ellipse(0.17, 0.31, 0.12, 0.1, 0, 0, TAU);                    // Körper
      g.moveTo(0.14, 0.17); g.arc(0.09, 0.17, 0.058, 0, TAU);         // Kopf
      g.moveTo(0.11, 0.1); g.ellipse(0.1, 0.05, 0.02, 0.07, -0.25, 0, TAU);   // Ohren
      g.moveTo(0.15, 0.1); g.ellipse(0.135, 0.055, 0.019, 0.066, 0.18, 0, TAU);
      g.moveTo(0.3, 0.3); g.arc(0.285, 0.3, 0.03, 0, TAU);            // Blume (Schwanz)
      g.moveTo(0.1, 0.4); g.ellipse(0.075, 0.395, 0.035, 0.018, 0, 0, TAU);   // Pfote
    };
    /* Pflock */
    g.fillStyle = rgb(mul([130, 98, 64], k)); g.fillRect(0.14, 0.38, 0.03, 0.1);
    umriss(); g.fillStyle = rgb(mul(vorn ? [214, 196, 168] : [200, 164, 116], k)); g.fill();
    g.strokeStyle = rgb(mul(vorn ? [120, 100, 80] : [150, 116, 76], k)); g.lineWidth = 0.008; g.stroke();
    if (vorn && s > 25) {
      g.fillStyle = rgb(mul([246, 244, 238], k)); g.beginPath(); g.arc(0.285, 0.3, 0.026, 0, TAU); g.fill(); g.beginPath(); g.ellipse(0.2, 0.33, 0.07, 0.05, 0, 0, TAU); g.fill();
      g.fillStyle = rgb(mul([236, 170, 176], k)); g.beginPath(); g.ellipse(0.1, 0.055, 0.009, 0.05, -0.25, 0, TAU); g.fill();
      g.fillStyle = "#1c1814"; g.beginPath(); g.arc(0.07, 0.16, 0.009, 0, TAU); g.fill();
      g.fillStyle = rgb(mul([200, 110, 120], k)); g.beginPath(); g.arc(0.035, 0.18, 0.007, 0, TAU); g.fill();
      /* rote Schleife am Hals */
      g.fillStyle = rgb(mul([196, 28, 40], k)); g.beginPath(); g.moveTo(0.12, 0.22); g.lineTo(0.09, 0.2); g.lineTo(0.09, 0.245); g.closePath(); g.fill(); g.beginPath(); g.moveTo(0.12, 0.22); g.lineTo(0.15, 0.2); g.lineTo(0.15, 0.245); g.closePath(); g.fill();
    } else if (!vorn && s > 40) {
      g.save(); umriss(); g.clip(); g.strokeStyle = rgb(mul([168, 132, 90], k), 0.5); g.lineWidth = 0.004; for (let y = 0.02; y < 0.45; y += 0.03) { g.beginPath(); g.moveTo(0, y); g.lineTo(0.32, y + 0.01); g.stroke(); } g.restore();
    }
    g.restore();
  }
  function straussMalen(g, s, F, D, A) {
    const V = blick(F.gier, s), Z = F.Z, jahr = F.jahr, w = A.wachs;
    if (F.schatten) {
      const T = g.getTransform(); g.setTransform(1, 0, 0, 1, T.e, T.f); g.fillStyle = "#000"; g.beginPath();
      const pts = [];
      for (const a of D.aeste) for (const t of [0.3, 0.6, 1]) { const p = astPunkt(a, t, w); pts.push(V.boden(p[0], p[1], p[2])); }
      pts.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
      const kr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
      const lo = [], hi = [];
      for (const p of pts) { while (lo.length >= 2 && kr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
      for (let i = pts.length - 1; i >= 0; i--) { const p = pts[i]; while (hi.length >= 2 && kr(hi[hi.length - 2], hi[hi.length - 1], p) <= 0) hi.pop(); hi.push(p); }
      hi.pop(); lo.pop(); dazu(g, lo.concat(hi));
      g.globalAlpha = 0.75; g.fill(); g.globalAlpha = 1;
      return;
    }
    beetMalen(g, V, F, D);
    /* Teile sammeln */
    const dinge = [];
    for (const a of D.aeste) {
      for (let k = 0; k < 3; k++) {
        const t0 = k / 3, t1 = (k + 1) / 3, m = astPunkt(a, (t0 + t1) / 2, w);
        dinge.push({ art: 0, a: a, t0: t0, t1: t1, t: V.tiefe(m[0], m[1], m[2]) });
      }
      for (const z of a.zweige) { const [b, e] = zweigEnde(a, z, w); dinge.push({ art: 3, a: a, z: z, b: b, e: e, t: V.tiefe((b[0] + e[0]) / 2, (b[1] + e[1]) / 2, (b[2] + e[2]) / 2) }); }
    }
    if (A.eier) for (const e of D.eier) { const p = astPunkt(e.a, e.t, w); dinge.push({ art: 1, e: e, p: p, t: V.tiefe(p[0], p[1], p[2] - e.lang) + 0.01 }); }
    if (A.blumen) for (const b of D.blumen) dinge.push({ art: 2, b: b, t: V.tiefe(b.x, b.y, 0.1) });
    if (A.eier) dinge.push({ art: 4, t: V.tiefe(D.hase.x, D.hase.y, 0.2) });
    dinge.sort((a, b) => a.t - b.t);
    for (const d of dinge) {
      if (d.art === 0 || d.art === 3) {
        const a = d.a, kA = lichtK(V.n(Math.cos(a.az), Math.sin(a.az), 0.6), Z, jahr);
        const pts = [];
        if (d.art === 0) { for (let i = 0; i <= 5; i++) { const p = astPunkt(a, d.t0 + (d.t1 - d.t0) * i / 5, w); pts.push(V.p(p[0], p[1], p[2])); } }
        else { pts.push(V.p(d.b[0], d.b[1], d.b[2]), V.p(d.e[0], d.e[1], d.e[2])); }
        g.strokeStyle = rgb(mul([112, 86, 58], kA)); g.lineWidth = Math.max(0.5, (d.art === 0 ? 0.022 - d.t0 * 0.012 : 0.007) * s); g.lineCap = "round";
        g.beginPath(); pts.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.stroke();
        /* Blüten in Büscheln an den Knoten (Forsythie blüht vor dem Laub) */
        if (A.bluete > 0 && (d.art === 3 || d.t1 > 0.2)) {
          const rr = ST.zufall(a.id * 17 + (d.art === 3 ? 900 + ((d.z.t * 100) | 0) : ((d.t0 * 10) | 0)));
          const knoten = Math.round((d.art === 3 ? (s > 40 ? 5 : 3) : (s > 40 ? 9 : 5)) * A.bluete);
          for (let i = 0; i < knoten; i++) {
            const u = (i + rr()) / knoten;
            let p;
            if (d.art === 0) p = astPunkt(a, d.t0 + u * (d.t1 - d.t0), w); else p = [d.b[0] + (d.e[0] - d.b[0]) * u, d.b[1] + (d.e[1] - d.b[1]) * u, d.b[2] + (d.e[2] - d.b[2]) * u];
            const q = V.p(p[0] + (rr() - 0.5) * 0.03, p[1] + (rr() - 0.5) * 0.03, p[2] - 0.01);
            const kb = rr() < 0.3 ? skal(kA, 0.72) : kA;
            bluetenBueschel(g, q, s, kb, rr, 2 + ((rr() * 3) | 0));
            if (rr() < 0.18) { g.fillStyle = rgb(mul([112, 176, 66], kA)); g.beginPath(); g.ellipse(q[0] + 0.012 * s, q[1] - 0.004 * s, Math.max(0.6, 0.018 * s), Math.max(0.4, 0.007 * s), rr() * 3, 0, TAU); g.fill(); }
          }
        }
      } else if (d.art === 1) {
        /* bemaltes Ei an einem Seidenband mit Schleife */
        const e = d.e, p = d.p, oben = V.p(p[0], p[1], p[2]), unten = V.p(p[0], p[1], p[2] - e.lang);
        const kE = lichtK([-0.3, 0.6, 0.6], Z, jahr);
        g.strokeStyle = rgb(mul(e.band, kE)); g.lineWidth = Math.max(0.5, 0.006 * s);
        g.beginPath(); g.moveTo(oben[0], oben[1]); g.lineTo(unten[0], unten[1]); g.stroke();
        const rx = Math.max(1.1, 0.05 * s), ry = Math.max(1.5, 0.068 * s), cx = unten[0], cy = unten[1] + ry;
        g.save(); g.translate(cx, cy); g.rotate(e.kipp); g.translate(-cx, -cy);
        const gr = g.createRadialGradient(cx - rx * 0.4, cy - ry * 0.4, rx * 0.1, cx, cy, ry * 1.1);
        gr.addColorStop(0, rgb(mul(e.f, skal(kE, 1.25)))); gr.addColorStop(1, rgb(mul(e.f, skal(kE, 0.6))));
        g.fillStyle = gr; g.beginPath(); g.ellipse(cx, cy, rx, ry, 0, 0, TAU); g.fill();
        if (s > 35) {
          g.save(); g.beginPath(); g.ellipse(cx, cy, rx, ry, 0, 0, TAU); g.clip();
          g.fillStyle = rgb(mul(e.f2, kE)); g.strokeStyle = rgb(mul(e.f2, kE));
          if (e.muster === 0) { g.fillRect(cx - rx, cy - ry * 0.15, rx * 2, ry * 0.3); g.fillStyle = rgb(mul([250, 250, 245], kE)); g.fillRect(cx - rx, cy - ry * 0.2, rx * 2, ry * 0.05); g.fillRect(cx - rx, cy + ry * 0.15, rx * 2, ry * 0.05); }
          else if (e.muster === 1) { for (let j = 0; j < 7; j++) { g.beginPath(); g.arc(cx + ((j * 37) % 5 - 2) * rx * 0.35, cy + (((j * 53) % 5) - 2) * ry * 0.3, rx * 0.15, 0, TAU); g.fill(); } }
          else if (e.muster === 2) { g.beginPath(); for (let j = 0; j <= 8; j++) { const x = cx - rx + j * rx / 4, y = cy + (j % 2 ? -0.2 : 0.2) * ry; if (j) g.lineTo(x, y); else g.moveTo(x, y); } g.lineWidth = Math.max(0.6, rx * 0.22); g.stroke(); }
          else { for (let j = 0; j < 4; j++) { const y = cy - ry * 0.55 + j * ry * 0.36; g.beginPath(); g.moveTo(cx - rx, y); g.lineTo(cx + rx, y + ry * 0.1); g.lineWidth = Math.max(0.5, ry * 0.08); g.stroke(); } }
          g.restore();
          g.fillStyle = "rgba(255,255,255,0.5)"; g.beginPath(); g.ellipse(cx - rx * 0.35, cy - ry * 0.42, rx * 0.2, ry * 0.16, -0.4, 0, TAU); g.fill();
          /* Schleife oben am Ei */
          const bx = cx, by = cy - ry * 0.95, bw = Math.max(0.8, 0.018 * s);
          g.fillStyle = rgb(mul(e.band, kE));
          g.beginPath(); g.moveTo(bx, by); g.quadraticCurveTo(bx - bw * 1.6, by - bw * 1.2, bx - bw * 1.3, by + bw * 0.4); g.closePath(); g.fill();
          g.beginPath(); g.moveTo(bx, by); g.quadraticCurveTo(bx + bw * 1.6, by - bw * 1.2, bx + bw * 1.3, by + bw * 0.4); g.closePath(); g.fill();
        }
        g.restore();
      } else if (d.art === 2) {
        const b = d.b, f = V.p(b.x, b.y, 0), k = V.p(b.x, b.y, b.h), kB = lichtK([-0.3, 0.6, 0.7], Z, jahr);
        /* schmale Blätter um den Stängel */
        g.fillStyle = rgb(mul([62, 124, 60], kB));
        for (const sx of [-1, 1]) { g.beginPath(); g.moveTo(f[0], f[1]); g.quadraticCurveTo(f[0] + sx * 0.03 * s, f[1] - b.h * 0.5 * s, f[0] + sx * (0.04 + b.n * 0.02) * s, f[1] - b.h * (0.75 + 0.2 * b.n) * KZ * s); g.quadraticCurveTo(f[0] + sx * 0.012 * s, f[1] - b.h * 0.4 * s, f[0] + sx * 0.008 * s, f[1]); g.fill(); }
        g.strokeStyle = rgb(mul([78, 136, 60], kB)); g.lineWidth = Math.max(0.5, 0.01 * s); g.beginPath(); g.moveTo(f[0], f[1]); g.lineTo(k[0], k[1]); g.stroke();
        const r = Math.max(0.9, 0.035 * s);
        if (b.art === 0) {
          /* Osterglocke: sechs blasse Blütenblätter, gelbe Trompete zur Seite */
          const ox = Math.cos(b.dreh) * r * 0.35;
          g.fillStyle = rgb(mul([250, 236, 150], kB));
          for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + b.dreh; g.beginPath(); g.ellipse(k[0] + Math.cos(a) * r * 0.55, k[1] + Math.sin(a) * r * 0.4, r * 0.5, r * 0.26, a, 0, TAU); g.fill(); }
          g.fillStyle = rgb(mul([242, 170, 30], kB)); g.beginPath(); g.ellipse(k[0] + ox, k[1] + 0.1 * r, r * 0.34, r * 0.3, 0, 0, TAU); g.fill();
          g.fillStyle = rgb(mul([206, 126, 20], kB)); g.beginPath(); g.ellipse(k[0] + ox * 1.6, k[1] + 0.1 * r, r * 0.2, r * 0.17, 0, 0, TAU); g.fill();
        } else {
          /* Tulpe: geschlossener Kelch aus drei Blättern, Licht von links */
          const fT = [[214, 36, 56], [236, 120, 40], [236, 200, 60], [206, 90, 160]][(b.n * 4) | 0];
          const gt = g.createLinearGradient(k[0] - r, 0, k[0] + r, 0);
          gt.addColorStop(0, rgb(mul(fT, skal(kB, 1.15)))); gt.addColorStop(1, rgb(mul(fT, skal(kB, 0.7))));
          g.fillStyle = gt; g.beginPath(); g.moveTo(k[0] - r * 0.8, k[1] - r * 1.4); g.quadraticCurveTo(k[0] - r * 1.05, k[1] + r * 0.3, k[0], k[1] + r * 0.35); g.quadraticCurveTo(k[0] + r * 1.05, k[1] + r * 0.3, k[0] + r * 0.8, k[1] - r * 1.4); g.quadraticCurveTo(k[0] + r * 0.3, k[1] - r * 0.9, k[0], k[1] - r * 1.5); g.quadraticCurveTo(k[0] - r * 0.3, k[1] - r * 0.9, k[0] - r * 0.8, k[1] - r * 1.4); g.fill();
          g.strokeStyle = rgb(mul(fT, skal(kB, 0.55)), 0.6); g.lineWidth = Math.max(0.4, 0.004 * s); g.beginPath(); g.moveTo(k[0], k[1] - r * 1.4); g.lineTo(k[0], k[1] + r * 0.3); g.stroke();
        }
      } else if (d.art === 4) haseMalen(g, V, F, D.hase);
    }
  }

  /* =====================================================================
     DAS MODELL
     ===================================================================== */
  ST.modell("schneemann", {
    /* Im Frühling steht hier der Osterstrauch – dann heißt er auch so */
    get name() { return ST.szene && ST.szene.jahr && ST.szene.jahr !== "winter" ? "Osterstrauch" : "Schneemann"; },
    gruppe: "Weihnachten", grund: [1.3, 1.3], hoehe: 1.9, bauzeit: 90,
    bauen: function (M, o) {
      const bau = o.bau == null ? 1 : o.bau;
      const saat = Math.abs(o.saat | 0) || 1;
      /* Unsichtbare Hilfsfläche über der Figur: so nimmt der Kern den
         Figurenschatten in die Bildgrenzen auf (sonst wird er abgeschnitten) */
      M.teil("schattenhilfe", { mitte: [0, 0, 0] });
      M.flaeche({ name: "hilfe", o: [-0.02, -0.02, o.jahr === "winter" ? 2.0 : 1.75], u: [1, 0, 0], v: [0, 1, 0], w: 0.04, h: 0.04, malen: function () {}, keinLicht: true });
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
          M.figur({ x: 0.44, y: 0.22, z: 0, breite: 0.3, hoehe: 0.3, malen: mitGier(windlichtMalen) });
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
