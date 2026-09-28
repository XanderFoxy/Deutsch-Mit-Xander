/* =====================================================================
   BAUKASTEN-STADT — DER STAKETENZAUN (4 m Abschnitt)
   ---------------------------------------------------------------------
   XANDER: „Ich möchte einen Liebreiz zur Weihnachtsdeko … mit Schnee …
   Das möchte ich in Perfektion." – „dass wir das später in einen
   Frühlingsgewand packen können." – „Richtig filigran." – „Man soll sie
   in jedem Winkel aufstellen können."

   Ein Gartenzaun, wie er vor Dorfhäusern steht: drei Kantholzpfosten
   (9 × 9 cm, mit Pyramidenkappe gegen Regen), zwei Querriegel und davor
   35 gespitzte Staketen (5,5 × 2,2 cm, 1 m hoch), jede mit zwei Nägeln
   an jedem Riegel. Die Latten stehen nie ganz gleich – ein alter Zaun
   ist ein wenig unruhig.
   Vorderseite = +y (die Staketen sind zur Straße genagelt).

   Varianten (o.saat): weiß gestrichen (Farbe blättert an den Kanten),
   Lärche natur (silbergrau verwittert) oder dunkelbraun lasiert.
   Winter: Schneehäubchen auf jeder Spitze und jedem Pfosten, Schnee auf
   den Riegeln, eine Wehe am Fuß des Zauns.
   Frühling: Rankpflanzen (Kletterrose, Waldrebe oder Wicke), die sich
   durch die Latten winden, Gras und Gänseblümchen am Fuß.

   WIE ES GEBAUT IST
   Eine Figur, die sich selbst in 3D ausrechnet: jede Stakete ist ein
   kleiner Körper (Vorderseite mit Spitze, Kanten, Schrägen der Spitze),
   alles nach Tiefe sortiert – so stimmt es von vorn, von hinten und
   schräg. Den Schatten wirft die Figur selbst (Latte für Latte, man
   sieht das Streifenmuster auf dem Schnee).
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
  function licht(f, n, F) {
    const k = ST.lichtFaktor(n, F.Z, 0, F.jahr);
    return [f[0] * k[0], f[1] * k[1], f[2] * k[2]];
  }

  /* =====================================================================
     MASSE
     ===================================================================== */
  const LAENGE = 4.0;
  /* Pfosten genau auf den Abschnittsgrenzen: Reiht man Abschnitte
     aneinander, fallen die Endpfosten zweier Nachbarn auf dieselbe Stelle
     (ein Pfosten, kein Doppelpfosten). */
  const PF = { b: 0.09, h: 1.1, kappe: 0.05, x: [-2.0, 0, 2.0] };
  const RI = { d: 0.035, h: 0.07, z: [0.26, 0.8], y: PF.b / 2 + 0.035 / 2 };
  const ST_ = { b: 0.056, d: 0.022, z0: 0.07, z1: 0.98, spitze: 0.055, y: PF.b / 2 + 0.035 + 0.011 };
  /* festes Raster: 36 Staketen je 4 m (Abstand 11,1 cm) – Abschnitte
     schließen nahtlos aneinander an */
  const ANZAHL = 36, RASTER = LAENGE / ANZAHL;

  const HOLZ = [
    { name: "weiß gestrichen", f: [236, 234, 226], weiss: true },
    { name: "Lärche natur", f: [150, 138, 120], grau: true },
    { name: "braun lasiert", f: [104, 70, 46] }
  ];

  /* Staketen: Lage und kleine Unregelmäßigkeiten je Latte */
  function staketenPlan(saat) {
    const rng = ST.zufall(saat * 17 + 5);
    const liste = [];
    for (let i = 0; i < ANZAHL; i++) {
      liste.push({
        i: i, x: -LAENGE / 2 + (i + 0.5) * RASTER + (rng() - 0.5) * 0.008,
        dz: (rng() - 0.5) * 0.025, kipp: (rng() - 0.5) * 0.02, hell: 0.92 + rng() * 0.14,
        saat: (rng() * 1e6) | 0, schnee: 0.7 + rng() * 0.6
      });
    }
    return liste;
  }

  /* =====================================================================
     BAUTEILE MALEN
     ===================================================================== */
  /* Holzfläche in ihrer Ebene: Maserung längs (senkrecht bei Latten) */
  function holzFlaeche(g, W, H, c, k, holz, s, rng, laengs) {
    if (s < 26) return;
    const n = Math.max(2, Math.min(8, Math.round((laengs ? W : H) * s / 2.2)));
    g.lineWidth = Math.max(0.0012, 0.8 / s);
    /* alle Fasern in EINEM Pfad (ein Zeichenaufruf) */
    const pf = new Path2D();
    for (let i = 0; i < n; i++) {
      const q = (i + 0.5) / n + (rng() - 0.5) * 0.08;
      if (laengs) { pf.moveTo(q * W, 0); for (let y = 0.1; y < H + 0.1; y += 0.1) pf.lineTo(q * W + (rng() - 0.5) * W * 0.06, y); }
      else { pf.moveTo(0, q * H); for (let x = 0.15; x < W + 0.15; x += 0.15) pf.lineTo(x, q * H + (rng() - 0.5) * H * 0.08); }
    }
    g.strokeStyle = rgb(mul(skal(c, holz.weiss ? 0.9 : 0.72), k), holz.weiss ? 0.25 : 0.4);
    g.stroke(pf);
    if (holz.grau) PI.rauschen(g, 0, 0, W, H, 0.3, 0.25, (rng() * 90) | 0, 3);
  }

  /* eine Stakete (kleiner Körper mit Spitze) */
  function staketeMalen(g, V, F, L, holz, winter, schmuck, zSchnee) {
    const s = V.s, b = ST_.b / 2, d = ST_.d;
    /* im Winter steckt der Fuß in der Wehe: gemalt wird erst ab der Schneeoberfläche */
    const z0 = Math.max(ST_.z0, zSchnee || 0), z1 = ST_.z1 + L.dz, zs = z1 + ST_.spitze;
    const yv = ST_.y + d / 2, yh = ST_.y - d / 2;
    const k0 = L.kipp;                                    // leichte Schräglage
    const P = (x, y, z) => V.p(L.x + x + k0 * (z - 0.5), y, z);
    const umriss = [[-b, z0], [b, z0], [b, z1], [0, zs], [-b, z1]];
    const c = skal(holz.f, L.hell);
    const rng = ST.zufall(L.saat);
    /* Seiten und Schrägen der Spitze (Dicke) */
    const seiten = [
      { n: [1, 0, 0], q: [[b, z0], [b, z1]] },
      { n: [-1, 0, 0], q: [[-b, z1], [-b, z0]] },
      { n: nrm([ST_.spitze, 0, b]), q: [[b, z1], [0, zs]] },
      { n: nrm([-ST_.spitze, 0, b]), q: [[0, zs], [-b, z1]] }
    ];
    for (const sd of seiten) {
      const nk = V.n(sd.n[0], sd.n[1], sd.n[2]);
      if (dot(nk, AUGE) <= 0.001) continue;
      const [a, e] = sd.q;
      vieleck(g, [P(a[0], yv, a[1]), P(e[0], yv, e[1]), P(e[0], yh, e[1]), P(a[0], yh, a[1])]);
      g.fillStyle = rgb(licht(skal(c, 0.9), nk, F)); g.fill();
    }
    /* Vorder- oder Rückseite */
    const vorn = dot(V.n(0, 1, 0), AUGE) > 0;
    const yF = vorn ? yv : yh, nF = vorn ? [0, 1, 0] : [0, -1, 0];
    const nk = V.n(nF[0], nF[1], nF[2]);
    const pts = umriss.map((q) => P(q[0], yF, q[1]));
    vieleck(g, pts);
    const k = ST.lichtFaktor(nk, F.Z, 0, F.jahr);
    g.fillStyle = rgb(mul(c, k)); g.fill();
    if (s > 26) {
      g.save(); vieleck(g, pts); g.clip();
      affin(g, V, [L.x - b + k0 * (z0 - 0.5), yF, z0], [1, 0, 0], [k0, 0, 1]);
      holzFlaeche(g, 2 * b, zs - z0, c, k, holz, s, rng, true);
      if (holz.weiss && s > 45) {
        /* abgeblätterte Farbe: das graue Holz schaut durch */
        g.fillStyle = rgb(mul([150, 138, 118], k), 0.75);
        for (let i = 0; i < 3; i++) { if (rng() < 0.45) continue; const y = rng() * (zs - z0); g.beginPath(); g.ellipse(rng() < 0.5 ? 0.004 : 2 * b - 0.004, y, 0.006, 0.02 + rng() * 0.03, 0, 0, TAU); g.fill(); }
        /* Grünspan (Algen) unten */
        const gr = g.createLinearGradient(0, 0, 0, 0.25);
        gr.addColorStop(0, rgb(mul([120, 140, 100], k), 0.28)); gr.addColorStop(1, rgb(mul([120, 140, 100], k), 0));
        g.fillStyle = gr; g.fillRect(0, 0, 2 * b, 0.25);
      }
      /* wo der Schnee anliegt: 3 cm bläulicher Hauch (Rückstrahlung, Nässe) */
      if (zSchnee > ST_.z0) {
        const gr = g.createLinearGradient(0, 0, 0, 0.035);
        gr.addColorStop(0, rgb(mul([60, 70, 100], k), 0.35)); gr.addColorStop(1, rgb(mul([60, 70, 100], k), 0));
        g.fillStyle = gr; g.fillRect(-0.01, 0, 2 * b + 0.02, 0.035);
      }
      /* Nägel an den Riegeln (nur vorn sichtbar) */
      if (vorn && s > 55) {
        g.fillStyle = rgb(mul([60, 58, 56], k));
        for (const zr of RI.z) for (const xn of [b * 0.55, b * 1.45]) { g.beginPath(); g.arc(xn, zr - z0 + (xn > b ? 0.012 : -0.012), 0.0035, 0, TAU); g.fill(); }
      }
      g.restore();
    }
    /* Schneehäubchen auf der Spitze */
    if (winter && schmuck) {
      const t = P(0, ST_.y, zs + 0.006);
      const w = Math.max(0.8, b * 1.35 * s * L.schnee), h = Math.max(0.6, 0.026 * s * L.schnee);
      const ks = ST.lichtFaktor([0, 0, 1], F.Z, 0, F.jahr);
      g.fillStyle = rgb(mul([214, 224, 242], ks));
      g.beginPath(); g.ellipse(t[0], t[1] + h * 0.35, w * 0.8, h * 0.55, 0, 0, TAU); g.fill();
      g.fillStyle = rgb(mul([250, 252, 255], ks));
      g.beginPath(); g.ellipse(t[0], t[1], w * 0.7, h * 0.7, 0, Math.PI, 0); g.ellipse(t[0], t[1], w * 0.7, h * 0.3, 0, 0, Math.PI); g.fill();
    }
  }

  /* Kasten (Riegel, Pfosten): acht Ecken, sichtbare Seiten, Maserung */
  function kastenMalen(g, V, F, x0, x1, y0, y1, z0, z1, c, holz, rng, opt) {
    const s = V.s;
    const F6 = [
      { n: [0, 1, 0], e: [[x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0]], w: x1 - x0, h: z1 - z0, o: [x0, y1, z1], u: [1, 0, 0], v: [0, 0, -1] },
      { n: [0, -1, 0], e: [[x1, y0, z1], [x0, y0, z1], [x0, y0, z0], [x1, y0, z0]], w: x1 - x0, h: z1 - z0, o: [x1, y0, z1], u: [-1, 0, 0], v: [0, 0, -1] },
      { n: [1, 0, 0], e: [[x1, y1, z1], [x1, y0, z1], [x1, y0, z0], [x1, y1, z0]], w: y1 - y0, h: z1 - z0, o: [x1, y1, z1], u: [0, -1, 0], v: [0, 0, -1] },
      { n: [-1, 0, 0], e: [[x0, y0, z1], [x0, y1, z1], [x0, y1, z0], [x0, y0, z0]], w: y1 - y0, h: z1 - z0, o: [x0, y0, z1], u: [0, 1, 0], v: [0, 0, -1] },
      { n: [0, 0, 1], e: [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], w: x1 - x0, h: y1 - y0, o: [x0, y0, z1], u: [1, 0, 0], v: [0, 1, 0], oben: true }
    ];
    for (const f of F6) {
      if (opt && opt.ohneOben && f.oben) continue;
      const nk = V.n(f.n[0], f.n[1], f.n[2]);
      if (dot(nk, AUGE) <= 0.001) continue;
      const pts = f.e.map((q) => V.p(q[0], q[1], q[2]));
      vieleck(g, pts);
      const k = ST.lichtFaktor(nk, F.Z, 0, F.jahr);
      g.fillStyle = rgb(mul(c, k)); g.fill();
      if (s * Math.min(f.w, f.h) > 3 && s > 26 && !f.oben) {
        g.save(); vieleck(g, pts); g.clip();
        affin(g, V, f.o, f.u, f.v);
        holzFlaeche(g, f.w, f.h, c, k, holz, s, rng, f.h > f.w);
        g.restore();
      }
    }
  }

  function pfostenMalen(g, V, F, x, holz, winter, schmuck, rng, zSchnee) {
    const b = PF.b / 2, c = skal(holz.f, holz.weiss ? 0.97 : 0.92);
    kastenMalen(g, V, F, x - b, x + b, -b, b, zSchnee || 0, PF.h, c, holz, rng, { ohneOben: true });
    /* Pyramidenkappe */
    const top = [x, 0, PF.h + PF.kappe];
    const ecken = [[x - b, -b], [x + b, -b], [x + b, b], [x - b, b]];
    for (let i = 0; i < 4; i++) {
      const a = ecken[i], e = ecken[(i + 1) % 4];
      const mx = (a[0] + e[0]) / 2 - x, my = (a[1] + e[1]) / 2;
      const n = nrm([mx * PF.kappe / b, my * PF.kappe / b, b]);
      const nk = V.n(n[0], n[1], n[2]);
      if (dot(nk, AUGE) <= 0) continue;
      vieleck(g, [V.p(a[0], a[1], PF.h), V.p(e[0], e[1], PF.h), V.p(top[0], top[1], top[2])]);
      g.fillStyle = rgb(winter && schmuck ? licht([246, 249, 255], nk, F) : licht(skal(c, 0.95), nk, F)); g.fill();
    }
    if (winter && schmuck) {
      /* Schneehaube, etwas überhängend */
      const m = V.p(x, 0, PF.h + PF.kappe * 0.6), s = V.s;
      g.fillStyle = rgb(licht([248, 250, 255], [0, 0, 1], F));
      g.beginPath(); g.ellipse(m[0], m[1], 0.075 * s, 0.045 * s, 0, 0, TAU); g.fill();
      g.fillStyle = rgb(licht([216, 226, 244], nrm([0.3, 0.6, 0.2]), F));
      g.beginPath(); g.ellipse(m[0], m[1] + 0.018 * s, 0.074 * s, 0.03 * s, 0, 0.1, Math.PI - 0.1); g.fill();
    }
  }

  function riegelMalen(g, V, F, zr, holz, winter, schmuck, rng) {
    const y0 = RI.y - RI.d / 2, y1 = RI.y + RI.d / 2, z0 = zr - RI.h / 2, z1 = zr + RI.h / 2;
    const c = skal(holz.f, holz.weiss ? 0.95 : 0.88);
    kastenMalen(g, V, F, -LAENGE / 2, LAENGE / 2, y0, y1, z0, z1, c, holz, rng);
    if (winter && schmuck) {
      /* Schneestreifen auf dem Riegel, leicht gewölbt */
      const s = V.s;
      const a = V.p(-LAENGE / 2 + 0.03, RI.y, z1 + 0.008), e = V.p(LAENGE / 2 - 0.03, RI.y, z1 + 0.008);
      g.lineCap = "round";
      g.strokeStyle = rgb(licht([222, 230, 246], nrm([0, 0.6, 0.6]), F)); g.lineWidth = Math.max(0.7, 0.03 * s);
      g.beginPath(); g.moveTo(a[0], a[1] + 0.004 * s); g.lineTo(e[0], e[1] + 0.004 * s); g.stroke();
      g.strokeStyle = rgb(licht([250, 252, 255], [0, 0, 1], F)); g.lineWidth = Math.max(0.5, 0.022 * s);
      g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(e[0], e[1]); g.stroke();
    }
  }

  /* =====================================================================
     BODEN: Schneewehe (Winter), Gras und Blumen (Frühling)
     ===================================================================== */
  /* Schneewehe. Der Zaun steckt im Schnee: Staketen und Pfosten beginnen
     erst an der Schneeoberfläche (8–12 cm, längs des Zauns wellig). Den
     Schnee selbst malt der Boden (boden.js) – eine eigene Schneefarbe
     trifft man nie (Dämmerung, Relief, Mondlicht; gemessen: rosa Watte).
     Wir tönen nur die Böschung zu beiden Seiten: ist sie heller als der
     flache Boden, ein Hauch Weiß, ist sie dunkler, das Blau der
     Szenenschatten – beides knapp (22–30 cm) und scharf am Zaun.
     Auf Pflaster (Weg, Platz) gibt es keine Wehe: dazu fragen wir die
     Bodenkarte an der Weltstelle des Zauns ab (o.objekt). */
  function wehePlan(saat, o) {
    const rng = ST.zufall(saat * 7 + 3);
    const ph = [rng() * 6, rng() * 6, rng() * 6];
    const ob = o && o.objekt, frei = [];
    for (let i = 0; i <= 20; i++) {
      const x = -LAENGE / 2 + LAENGE * i / 20;
      let w = 1;
      if (ob && ST.boden && ST.boden.wert) {
        const r = (ob.gier || 0) * Math.PI / 180, c = Math.cos(r), sn = Math.sin(r);
        let p = 0;
        for (const y of [-0.2, 0, 0.2]) p = Math.max(p, ST.boden.wert(ob.x + x * c - y * sn, ob.y + x * sn + y * c, 0));
        w = klemm((0.75 - p) / 0.4, 0, 1);
      }
      frei.push(w);
    }
    const w = (x) => { const u = klemm((x + LAENGE / 2) / LAENGE * 20, 0, 20), i = Math.min(19, Math.floor(u)); return frei[i] + (frei[i + 1] - frei[i]) * (u - i); };
    const h = (x) => w(x) * (0.095 + 0.022 * Math.sin(x * 2.1 + ph[0]) + 0.012 * Math.sin(x * 5.3 + ph[1]) + 0.006 * Math.sin(x * 13.7 + ph[2]));
    return { h: h, w: w };
  }
  function weheMalen(g, V, F, seite, W) {
    const yF = seite > 0 ? ST_.y + ST_.d / 2 : -PF.b / 2;
    const breit = seite > 0 ? 0.22 : 0.3;                  // hinten (Wetterseite) breiter
    const kB = ST.lichtFaktor(V.n(0, seite * 0.5, 1), F.Z, 0, F.jahr), kF = ST.lichtFaktor([0, 0, 1], F.Z, 0, F.jahr);
    const d = ((kB[0] + kB[1] + kB[2]) - (kF[0] + kF[1] + kF[2])) / 3;
    const farbe = d > 0 ? "255,255,255" : "40,62,120";
    const a = Math.min(0.3, Math.abs(d) * (d > 0 ? 1.6 : 2.4) + 0.03);
    for (let i = 0; i < 20; i++) {
      const xa = -LAENGE / 2 + LAENGE * i / 20, xb = xa + LAENGE / 20;
      const wm = (W.w(xa) + W.w(xb)) / 2;
      if (wm < 0.05) continue;
      const p0 = V.p(xa, yF, 0), p1 = V.p(xb, yF, 0), p2 = V.p(xb, yF + seite * breit, 0), p3 = V.p(xa, yF + seite * breit, 0);
      const gr = g.createLinearGradient(p0[0], p0[1], p3[0], p3[1]);
      gr.addColorStop(0, "rgba(" + farbe + "," + (a * wm).toFixed(3) + ")"); gr.addColorStop(0.35, "rgba(" + farbe + "," + (a * wm * 0.6).toFixed(3) + ")"); gr.addColorStop(1, "rgba(" + farbe + ",0)");
      g.fillStyle = gr; vieleck(g, [p0, p1, p2, p3]); g.fill();
    }
  }
  function grasMalen(g, V, F, saat, seite) {
    const s = V.s;
    if (s < 14) return;
    const rng = ST.zufall(saat * 5 + (seite > 0 ? 1 : 2));
    const k = ST.lichtFaktor([0, 0, 1], F.Z, 0, F.jahr);
    g.lineCap = "round";
    const n = Math.min(160, Math.round(s * 1.6));
    const halme = [new Path2D(), new Path2D(), new Path2D()];
    g.lineWidth = Math.max(0.4, s * 0.004);
    for (let i = 0; i < n; i++) {
      const x = -LAENGE / 2 + rng() * LAENGE, y = seite > 0 ? ST_.y + 0.02 + rng() * 0.08 : -0.02 - rng() * 0.1;
      const p = V.p(x, y, 0), l = (0.04 + rng() * 0.1) * s;
      const h = halme[i % 3];
      h.moveTo(p[0], p[1]); h.quadraticCurveTo(p[0] + (rng() - 0.5) * l, p[1] - l * 0.6, p[0] + (rng() - 0.5) * l * 0.8, p[1] - l);
      if (rng() < 0.05 && s > 30) {
        const q = [p[0] + (rng() - 0.5) * 0.02 * s, p[1] - l];
        g.fillStyle = rgb(mul([252, 252, 248], k));
        for (let j = 0; j < 8; j++) { const w = j / 8 * TAU; g.beginPath(); g.ellipse(q[0] + Math.cos(w) * 0.008 * s, q[1] + Math.sin(w) * 0.004 * s, 0.006 * s, 0.003 * s, w, 0, TAU); g.fill(); }
        g.fillStyle = rgb(mul([240, 200, 40], k)); g.beginPath(); g.arc(q[0], q[1], 0.004 * s, 0, TAU); g.fill();
      }
    }
    [[70, 128, 48], [90, 146, 56], [60, 112, 44]].forEach((c, i) => { g.strokeStyle = rgb(mul(c, k)); g.stroke(halme[i]); });
  }

  /* Rankpflanzen: Stängel winden sich vor und hinter den Latten hoch.
     teil = "hinten" | "vorn" – je nach Seite der Latten.
     Jede Art hat ihre echte Blattform und Blüte:
       Kletterrose – gefiederte Blätter (5 Blättchen), gefüllte Blüten 6–8 cm,
       Waldrebe (Clematis) – dreizählige Blätter, flache Sternblüten 9–11 cm,
       Wicke – paarige Fiederchen mit Wickelranken, kleine Schmetterlingsblüten
       in Trauben. Farbe über das Licht der Blattebene, nicht pauschal. */
  const RANKEN = [
    { name: "Kletterrose", bl: [[204, 44, 78], [228, 96, 128]], blatt: [44, 84, 40], art: "rose", r: 0.04 },
    { name: "Waldrebe", bl: [[104, 62, 168], [128, 82, 186]], blatt: [58, 100, 46], art: "waldrebe", r: 0.055 },
    { name: "Wicke", bl: [[232, 140, 188], [246, 242, 248], [172, 122, 212]], blatt: [84, 128, 64], art: "wicke", r: 0.014 }
  ];
  function rankenPlan(saat) {
    const rng = ST.zufall(saat * 29 + 11);
    const art = RANKEN[saat % RANKEN.length];
    const pflanzen = [];
    const n = 3 + (saat % 2);
    for (let p = 0; p < n; p++) {
      const x0 = -1.75 + (p + 0.2 + rng() * 0.6) * (3.5 / n);
      const triebe = [];
      /* Haupttrieb windet sich hoch, dazu Seitentriebe entlang der Riegel */
      const haupt = [];
      const hoch = 0.85 + rng() * 0.25;
      for (let i = 0; i <= 44; i++) {
        const z = i / 44 * hoch;
        const x = x0 + Math.sin(i * 0.36 + p) * 0.14 + i * 0.006 * (p % 2 ? 1 : -1);
        haupt.push([x, ST_.y + Math.sin(i * 0.62 + p * 1.3) * 0.036, z]);
      }
      triebe.push(haupt);
      for (const zr of RI.z) {
        for (const r of [-1, 1]) {
          if (rng() < 0.2) continue;
          const t = [], l = 0.4 + rng() * 0.5;
          const xs = x0 + Math.sin(zr / hoch * 44 * 0.36 + p) * 0.14;
          for (let i = 0; i <= 18; i++) { const u = i / 18; t.push([xs + r * l * u, ST_.y + Math.sin(i * 0.9 + p) * 0.034, zr + 0.05 + Math.sin(u * 5 + p) * 0.04 + u * 0.06]); }
          triebe.push(t);
        }
      }
      const blaetter = [], blueten = [];
      for (const t of triebe) {
        for (let i = 2; i < t.length; i++) {
          for (let j = 0; j < 3; j++) {
            if (rng() < 0.35) continue;
            blaetter.push({ p: t[i], w: rng() * TAU, g: 0.75 + rng() * 0.5, seite: rng() < 0.5 ? 1 : -1, dx: (rng() - 0.5) * 0.1, dz: (rng() - 0.5) * 0.08, ton: (rng() * 3) | 0 });
          }
          if (rng() < (art.art === "wicke" ? 0.12 : 0.15) && t[i][2] > 0.25) blueten.push({ p: t[i], c: art.bl[(rng() * art.bl.length) | 0], g: 0.85 + rng() * 0.35, dx: (rng() - 0.5) * 0.1, dz: (rng() - 0.5) * 0.06, knospe: rng() < 0.18, dreh: rng() * TAU, seite: rng() < 0.5 ? 1 : -1 });
        }
      }
      pflanzen.push({ triebe: triebe, blaetter: blaetter, blueten: blueten });
    }
    return { art: art, pflanzen: pflanzen };
  }
  /* ein Blatt der jeweiligen Art an die Pfade hängen (Bildkoordinaten) */
  function blattForm(P3, rippe, ranke, art, x, y, w, r) {
    const c = Math.cos(w), sn = Math.sin(w);
    const at = (d, q) => [x + c * d - sn * q, y + sn * d + c * q];
    const ell = (m, rx, ry, rot) => { P3.moveTo(m[0] + Math.cos(rot) * rx, m[1] + Math.sin(rot) * rx); P3.ellipse(m[0], m[1], rx, ry, rot, 0, TAU); };
    if (art === "rose") {
      const L = r * 1.5, a = at(0, 0), e = at(L, 0);
      rippe.moveTo(a[0], a[1]); rippe.lineTo(e[0], e[1]);
      for (const [d, sd] of [[0.3, 1], [0.3, -1], [0.62, 1], [0.62, -1]]) ell(at(L * d, sd * r * 0.3), r * 0.3, r * 0.17, w + sd * 1.0);
      ell(at(L * 1.05, 0), r * 0.36, r * 0.2, w);
    } else if (art === "waldrebe") {
      const L = r * 0.7, a = at(0, 0), e = at(L, 0);
      rippe.moveTo(a[0], a[1]); rippe.lineTo(e[0], e[1]);
      for (const [b, l] of [[0, 1], [1.0, 0.8], [-1.0, 0.8]]) ell(at(L + Math.cos(b) * r * 0.45 * l, Math.sin(b) * r * 0.45 * l), r * 0.44 * l, r * 0.2 * l, w + b);
    } else {
      for (const sd of [-1, 1]) ell(at(r * 0.45, sd * r * 0.22), r * 0.42, r * 0.12, w + sd * 0.45);
      /* Wickelranke am Blattende */
      const a = at(r * 0.7, 0); ranke.moveTo(a[0], a[1]);
      for (let i = 1; i <= 10; i++) { const t = i / 10, q = at(r * (0.7 + t * 0.6) + Math.cos(t * 9) * r * 0.12 * t, Math.sin(t * 9) * r * 0.12 * t); ranke.lineTo(q[0], q[1]); }
    }
  }
  /* Blüten in der Zaunebene (leicht nach oben gekippt), mit eigener
     Schattierung: heller Rand, dunkles Herz, die sonnenabgewandte Seite
     dunkler. ex/ez = Bildrichtung von 1 m in x bzw. schräg nach oben. */
  function bluteMalen(g, x, y, ex, ez, r, c, art, dreh) {
    g.save();
    g.transform(ex[0] * r, ex[1] * r, -ez[0] * r, -ez[1] * r, x, y);
    if (art === "rose") {
      const gr = g.createRadialGradient(-0.25, -0.3, 0.1, 0, 0, 1.05);
      gr.addColorStop(0, rgb(plus(c, [36, 30, 30]))); gr.addColorStop(0.7, rgb(c)); gr.addColorStop(1, rgb(skal(c, 0.7)));
      g.fillStyle = gr;
      g.beginPath(); for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + dreh; g.moveTo(Math.cos(a) * 0.5 + 0.5, Math.sin(a) * 0.5); g.arc(Math.cos(a) * 0.5, Math.sin(a) * 0.5, 0.5, 0, TAU); } g.fill();
      /* innere, gefüllte Blütenblätter: Schalen, zur Mitte dunkler */
      g.fillStyle = rgb(skal(c, 0.82));
      g.beginPath(); for (let i = 0; i < 5; i++) { const a = i / 5 * TAU + dreh + 0.4; g.moveTo(Math.cos(a) * 0.28 + 0.34, Math.sin(a) * 0.28); g.arc(Math.cos(a) * 0.28, Math.sin(a) * 0.28, 0.34, 0, TAU); } g.fill();
      g.strokeStyle = rgb(skal(c, 0.55)); g.lineWidth = 0.08;
      g.beginPath(); for (let i = 0; i <= 16; i++) { const a = i / 16 * TAU * 1.6 + dreh, rr = 0.34 * (1 - i / 20); if (i) g.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); else g.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); } g.stroke();
      g.fillStyle = rgb(plus(c, [50, 44, 44]), 0.5);
      g.beginPath(); g.ellipse(-0.35, -0.4, 0.3, 0.16, -0.5, 0, TAU); g.fill();
    } else if (art === "waldrebe") {
      /* sechs spitze Kelchblätter mit Mittelstreifen, cremefarbene Staubblätter */
      for (let i = 0; i < 6; i++) {
        const a = i / 6 * TAU + dreh, ca = Math.cos(a), sa = Math.sin(a);
        const hell = 0.9 + 0.2 * Math.max(0, -ca * 0.7 - sa * 0.7);
        g.fillStyle = rgb(skal(c, hell));
        g.beginPath(); g.moveTo(0, 0);
        g.quadraticCurveTo(ca * 0.5 - sa * 0.34, sa * 0.5 + ca * 0.34, ca * 1.0, sa * 1.0);
        g.quadraticCurveTo(ca * 0.5 + sa * 0.34, sa * 0.5 - ca * 0.34, 0, 0); g.fill();
        g.strokeStyle = rgb(skal(c, 0.72), 0.7); g.lineWidth = 0.06;
        g.beginPath(); g.moveTo(ca * 0.15, sa * 0.15); g.lineTo(ca * 0.85, sa * 0.85); g.stroke();
      }
      g.fillStyle = "rgb(236,226,170)"; g.beginPath(); g.arc(0, 0, 0.2, 0, TAU); g.fill();
      g.fillStyle = "rgb(150,120,60)"; for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; g.beginPath(); g.arc(Math.cos(a) * 0.2, Math.sin(a) * 0.2, 0.05, 0, TAU); g.fill(); }
    } else {
      /* Wicke: Fahne (groß, rund), zwei Flügel, Schiffchen */
      g.fillStyle = rgb(c); g.beginPath(); g.ellipse(0, -0.35, 1.0, 0.8, 0, 0, TAU); g.fill();
      g.fillStyle = rgb(skal(c, 0.85)); g.beginPath(); g.ellipse(-0.45, 0.45, 0.5, 0.42, 0.4, 0, TAU); g.ellipse(0.45, 0.45, 0.5, 0.42, -0.4, 0, TAU); g.fill();
      g.fillStyle = rgb(skal(c, 0.7)); g.beginPath(); g.ellipse(0, 0.6, 0.22, 0.35, 0, 0, TAU); g.fill();
      g.strokeStyle = rgb(skal(c, 0.72), 0.6); g.lineWidth = 0.08; g.beginPath(); g.moveTo(0, -0.1); g.lineTo(0, -0.9); g.stroke();
    }
    g.restore();
  }
  function rankenMalen(g, V, F, R, teil) {
    const s = V.s;
    if (s < 12) return;
    const vornSicht = dot(V.n(0, 1, 0), AUGE) > 0;
    const nahSeite = vornSicht ? 1 : -1;
    const passt = (y) => (teil === "vorn" ? (y - ST_.y) * nahSeite > 0 : (y - ST_.y) * nahSeite <= 0);
    const art = R.art.art;
    /* Licht der Blattebene: Blätter stehen schräg vom Zaun ab, zur Seite und nach oben */
    const kBlatt = [0, 1, 2].map((t) => ST.lichtFaktor(V.n((t - 1) * 0.5, nahSeite * 0.7, 0.6), F.Z, 0, F.jahr));
    const kBl = ST.lichtFaktor(V.n(0, nahSeite * 0.8, 0.6), F.Z, 0, F.jahr);
    /* Blütenebene: schaut vom Zaun weg und 35° nach oben (ihr „Oben" ist
       daher etwas zum Zaun hin geneigt) – so sieht man die Blüten aus
       jedem Winkel als Scheibe, nie als Strich */
    const o = V.p(0, 0, 0), ex = V.p(1, 0, 0), ez = V.p(0, -nahSeite * 0.57, 0.82);
    const eX = [(ex[0] - o[0]), (ex[1] - o[1])], eZ = [(ez[0] - o[0]), (ez[1] - o[1])];
    g.lineCap = "round"; g.lineJoin = "round";
    for (const pf of R.pflanzen) {
      /* Stängel, nur die Stücke auf der passenden Seite */
      g.strokeStyle = rgb(mul(art === "rose" ? [84, 76, 44] : [70, 96, 46], kBl)); g.lineWidth = Math.max(0.5, (art === "rose" ? 0.01 : 0.007) * s);
      g.beginPath();
      for (const t of pf.triebe) {
        for (let i = 0; i < t.length - 1; i++) {
          const a = t[i], e = t[i + 1];
          if (!passt((a[1] + e[1]) / 2)) continue;
          const pa = V.p(a[0], a[1], a[2]), pe = V.p(e[0], e[1], e[2]);
          g.moveTo(pa[0], pa[1]); g.lineTo(pe[0], pe[1]);
        }
      }
      g.stroke();
      const P3 = [new Path2D(), new Path2D(), new Path2D()], rippe = new Path2D(), ranke = new Path2D();
      for (const b of pf.blaetter) {
        const y = b.p[1] + b.seite * 0.018;
        if (!passt(y)) continue;
        const p = V.p(b.p[0] + b.dx * 0.5, y, b.p[2] + b.dz);
        const r = (art === "wicke" ? 0.05 : art === "waldrebe" ? 0.06 : 0.055) * s * b.g;
        if (r < 1.2) { P3[b.ton].moveTo(p[0] + r, p[1]); P3[b.ton].ellipse(p[0], p[1], Math.max(0.6, r), Math.max(0.4, r * 0.6), b.w, 0, TAU); continue; }
        blattForm(P3[b.ton], rippe, ranke, art, p[0], p[1], b.w, r);
      }
      const TON = [skal(R.art.blatt, 0.72), R.art.blatt, plus(R.art.blatt, [26, 30, 16])];
      P3.forEach((pp, i) => { g.fillStyle = rgb(mul(TON[i], kBlatt[i])); g.fill(pp); });
      if (s > 45) { g.strokeStyle = rgb(mul(plus(R.art.blatt, [60, 60, 40]), kBlatt[1]), 0.45); g.lineWidth = Math.max(0.3, s * 0.0014); g.stroke(rippe); }
      if (art === "wicke") { g.strokeStyle = rgb(mul([110, 150, 70], kBlatt[1]), 0.9); g.lineWidth = Math.max(0.3, s * 0.0016); g.stroke(ranke); }
      for (const b of pf.blueten) {
        const y = b.p[1] + b.seite * 0.02;
        if (!passt(y)) continue;
        const p = V.p(b.p[0] + b.dx * 0.3, y, b.p[2] + b.dz);
        const c = mul(b.c, kBl), r = R.art.r * b.g;
        if (r * s < 1.2) { g.fillStyle = rgb(c); g.beginPath(); g.arc(p[0], p[1], Math.max(0.7, r * s), 0, TAU); g.fill(); continue; }
        if (b.knospe && art !== "wicke") { g.fillStyle = rgb(skal(c, 0.85)); g.beginPath(); g.ellipse(p[0], p[1], r * s * 0.3, r * s * 0.5, 0, 0, TAU); g.fill(); continue; }
        if (art === "wicke") {
          /* eine kleine Traube aus drei, vier Blüten am Stiel */
          const sd = Math.cos(b.dreh) > 0 ? 1 : -1;
          for (let j = 3; j >= 0; j--) {
            const u = j / 3, dx = sd * (0.012 + 0.03 * u), dz = 0.05 * u - 0.03 * u * u;
            bluteMalen(g, p[0] + eX[0] * dx + eZ[0] * dz, p[1] + eX[1] * dx + eZ[1] * dz, eX, eZ, r * (1 - j * 0.14), skal(c, 1 - j * 0.04), art, b.dreh + j);
          }
        } else bluteMalen(g, p[0], p[1], eX, eZ, r, c, art, b.dreh);
      }
    }
  }

  /* Weihnachtsschmuck: ein Tannenkranz mit roter Schleife vorn an den
     Staketen über dem Mittelpfosten, dazu (je nach o.saat) an zwei, drei
     Staketen eine rote Schleife. Von hinten verdecken ihn die Latten. */
  function kranzMalen(g, V, F, saat) {
    const s = V.s;
    const y = ST_.y + ST_.d / 2 + 0.012, zm = 0.62, R = 0.15;
    const k = ST.lichtFaktor(V.n(0, 1, 0.3), F.Z, 0, F.jahr), kO = ST.lichtFaktor([0, 0, 1], F.Z, 0, F.jahr);
    const rng = ST.zufall(saat * 3 + 17);
    const P = (a, r) => V.p(Math.cos(a) * r, y, zm + Math.sin(a) * r);
    if (s < 16) {
      g.strokeStyle = rgb(mul([36, 70, 42], k)); g.lineWidth = Math.max(1, 0.06 * s);
      g.beginPath(); for (let i = 0; i <= 24; i++) { const p = P(i / 24 * TAU, R); if (i) g.lineTo(p[0], p[1]); else g.moveTo(p[0], p[1]); } g.stroke();
      return;
    }
    /* Grundring (dunkles Reisig), dann Nadelbüschel in drei Tönen */
    g.strokeStyle = rgb(mul([26, 52, 32], k)); g.lineWidth = 0.07 * s;
    g.beginPath(); for (let i = 0; i <= 32; i++) { const p = P(i / 32 * TAU, R); if (i) g.lineTo(p[0], p[1]); else g.moveTo(p[0], p[1]); } g.closePath(); g.stroke();
    const nadel = [new Path2D(), new Path2D(), new Path2D()];
    for (let i = 0; i < 150; i++) {
      const a = rng() * TAU, r = R + (rng() - 0.5) * 0.07, p = P(a, r), w = a + Math.PI / 2 + (rng() - 0.5) * 1.2, l = (0.02 + rng() * 0.025) * s;
      const q = nadel[(rng() * 3) | 0]; q.moveTo(p[0], p[1]); q.lineTo(p[0] + Math.cos(w) * l, p[1] + Math.sin(w) * l * 0.8);
    }
    g.lineCap = "round"; g.lineWidth = Math.max(0.4, 0.004 * s);
    [[30, 64, 40], [44, 84, 48], [66, 108, 64]].forEach((c, i) => { g.strokeStyle = rgb(mul(c, k)); g.stroke(nadel[i]); });
    /* Schnee oben auf dem Kranz */
    if (F.jahr === "winter") {
      g.fillStyle = rgb(mul([246, 249, 255], kO), 0.95);
      for (let i = 0; i < 9; i++) { const a = Math.PI * (0.15 + 0.7 * i / 8), p = P(a, R + 0.02); g.beginPath(); g.ellipse(p[0], p[1] - 0.008 * s, 0.03 * s, 0.01 * s, 0, 0, TAU); g.fill(); }
    }
    /* rote Kugeln und Zapfen */
    for (let i = 0; i < 6; i++) {
      const a = rng() * TAU, p = P(a, R + (rng() - 0.5) * 0.03), rr = Math.max(0.6, 0.013 * s);
      const gr = g.createRadialGradient(p[0] - rr * 0.35, p[1] - rr * 0.35, rr * 0.1, p[0], p[1], rr);
      gr.addColorStop(0, rgb(mul([255, 120, 120], k))); gr.addColorStop(1, rgb(mul([130, 10, 20], k)));
      g.fillStyle = gr; g.beginPath(); g.arc(p[0], p[1], rr, 0, TAU); g.fill();
    }
    /* Schleife unten */
    schleifeMalen(g, V, F, 0, y + 0.01, zm - R, 0.07, k);
  }
  function schleifeMalen(g, V, F, x, y, z, gr, k) {
    const s = V.s, m = V.p(x, y, z), r = gr * s;
    const rot = [184, 18, 32], c = mul(rot, k), cd = mul(skal(rot, 0.6), k);
    g.fillStyle = rgb(cd);
    for (const sd of [-1, 1]) { g.beginPath(); g.moveTo(m[0], m[1]); g.quadraticCurveTo(m[0] + sd * r * 0.5, m[1] + r * 1.0, m[0] + sd * r * 0.35, m[1] + r * 1.9); g.lineTo(m[0] + sd * r * 0.7, m[1] + r * 1.75); g.quadraticCurveTo(m[0] + sd * r * 0.8, m[1] + r * 0.9, m[0] + sd * r * 0.2, m[1]); g.fill(); }
    for (const sd of [-1, 1]) {
      const gg = g.createLinearGradient(0, m[1] - r, 0, m[1] + r * 0.6);
      gg.addColorStop(0, rgb(plus(c, [50, 30, 30]))); gg.addColorStop(1, rgb(cd));
      g.fillStyle = gg; g.beginPath(); g.moveTo(m[0], m[1]);
      g.bezierCurveTo(m[0] + sd * r * 0.4, m[1] - r * 1.1, m[0] + sd * r * 1.25, m[1] - r * 0.8, m[0] + sd * r * 1.05, m[1] + r * 0.05);
      g.bezierCurveTo(m[0] + sd * r * 1.0, m[1] + r * 0.55, m[0] + sd * r * 0.4, m[1] + r * 0.45, m[0], m[1]); g.fill();
    }
    g.fillStyle = rgb(c); g.beginPath(); g.ellipse(m[0], m[1], r * 0.28, r * 0.32, 0, 0, TAU); g.fill();
  }

  /* Pfostenlöcher (Bauphase) */
  function grubenMalen(g, V, F, tiefe, fuell, pfostenDa) {
    const s = V.s, kU = ST.lichtFaktor([0, 0, 1], F.Z, 0, F.jahr);
    const rng = ST.zufall(4);
    for (const x of PF.x) {
      const b = 0.16;
      const loch = [[x - b, -b], [x + b, -b], [x + b, b], [x - b, b]];
      for (let i = 0; i < 2; i++) {
        const p = V.p(x + (rng() - 0.5) * 0.3, -0.34 - rng() * 0.1, 0), R = (0.1 + rng() * 0.05) * s;
        const gr = g.createRadialGradient(p[0] - R * 0.3, p[1] - R * 0.5, R * 0.1, p[0], p[1] - R * 0.2, R);
        gr.addColorStop(0, rgb(mul([132, 104, 76], kU))); gr.addColorStop(1, rgb(mul([78, 58, 42], kU)));
        g.fillStyle = gr; g.beginPath(); g.ellipse(p[0], p[1], R, R * 0.5, 0, 0, Math.PI); g.ellipse(p[0], p[1], R, R * 0.8, 0, Math.PI, 0); g.fill();
      }
      const boden = fuell != null && fuell > -tiefe ? fuell : -tiefe;
      const beton = fuell != null && fuell > -tiefe + 0.01;
      g.save();
      vieleck(g, loch.map((q) => V.p(q[0], q[1], 0))); g.clip();
      vieleck(g, loch.map((q) => V.p(q[0], q[1], boden)));
      g.fillStyle = rgb(mul(beton ? [170, 168, 160] : [92, 70, 52], skal(kU, beton ? 0.92 : 0.6))); g.fill();
      for (let i = 0; i < 4; i++) {
        const a = loch[i], e = loch[(i + 1) % 4];
        const nk = V.n(-((a[0] + e[0]) / 2 - x), -(a[1] + e[1]) / 2, 0);
        if (dot(nk, AUGE) <= 0.001) continue;
        const k = ST.lichtFaktor(nk, F.Z, 0, F.jahr);
        vieleck(g, [V.p(a[0], a[1], 0), V.p(e[0], e[1], 0), V.p(e[0], e[1], boden), V.p(a[0], a[1], boden)]);
        g.fillStyle = rgb(mul([104, 80, 58], skal(k, 0.7))); g.fill();
      }
      g.restore();
      void pfostenDa;
    }
  }

  /* =====================================================================
     SCHATTEN
     ===================================================================== */
  function schattenMalen(g, s, F, A, plan) {
    const V = blick(F.gier || 0, s);
    const m = g.getTransform();
    g.save();
    g.setTransform(1, 0, 0, 1, m.e, m.f);
    g.fillStyle = "#000";
    g.beginPath();
    const kasten = (x0, x1, y0, y1, z0, z1) => { const e = []; for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) e.push(V.boden(x, y, z)); dazu(g, huelle(e)); };
    for (let i = 0; i < A.pfosten; i++) { const x = PF.x[i], b = PF.b / 2; kasten(x - b, x + b, -b, b, 0, PF.h + PF.kappe); }
    for (let i = 0; i < A.riegel; i++) { const zr = RI.z[i]; kasten(-LAENGE / 2, LAENGE / 2, RI.y - RI.d / 2, RI.y + RI.d / 2, zr - RI.h / 2, zr + RI.h / 2); }
    for (let i = 0; i < A.staketen; i++) {
      const L = plan[i], b = ST_.b / 2, z1 = ST_.z1 + L.dz;
      const P = (x, z) => V.boden(L.x + x + L.kipp * (z - 0.5), ST_.y, z);
      dazu(g, [P(-b, ST_.z0), P(b, ST_.z0), P(b, z1), P(0, z1 + ST_.spitze), P(-b, z1)]);
    }
    g.fill();
    g.restore();
  }
  function schaetzeGier(o) {
    return ((o.objekt && o.objekt.gier) || 0) + ((ST.kamera && ST.kamera.dreh) || 0) * 90;
  }

  /* =====================================================================
     DAS MODELL
     ===================================================================== */
  ST.modell("zaun", {
    name: "Staketenzaun", gruppe: "Deko", grund: [4.0, 0.3], hoehe: 1.2, bauzeit: 40,
    bauen: function (M, o) {
      const bau = o.bau == null ? 1 : o.bau;
      const saat = Math.abs(o.saat | 0) || 1;
      const winter = o.jahr === "winter";
      const holz = HOLZ[saat % HOLZ.length];
      const plan = staketenPlan(saat);
      const ranken = rankenPlan(saat);
      const W = winter ? wehePlan(saat, o) : null;
      const zS = (x) => (W && bau >= 1 ? W.h(x) : 0);
      /* Weihnachtsschmuck: Kranz über dem Mittelpfosten, rote Schleifen an
         zwei, drei Staketen (welche, hängt an o.saat) */
      const schleifen = [];
      { const r = ST.zufall(saat * 41 + 7); const n = 1 + (saat % 3); for (let i = 0; i < n; i++) { const j = (r() * ANZAHL) | 0; if (Math.abs(j - ANZAHL / 2) > 3) schleifen.push(j); } }
      const A = {
        grube: bau < 0.18,
        pfosten: bau < 0.18 ? 0 : 3,
        riegel: bau < 0.34 ? 0 : bau < 0.42 ? 1 : 2,
        staketen: bau < 0.45 ? 0 : Math.min(ANZAHL, Math.floor(phase(bau, 0.45, 0.95) * ANZAHL + 0.001)),
        schmuck: bau >= 1
      };
      const figur = {
        x: 0, y: 0, z: 0, breite: 3.6, hoehe: 1.25,
        malen: mitGier(function (g, s, F) {
          if (F.schatten) { if (A.pfosten) schattenMalen(g, s, F, A, plan); return; }
          const V = blick(F.gier || 0, s);
          const rng = ST.zufall(saat + 3);
          if (A.grube) { grubenMalen(g, V, F, 0.6, bau < 0.1 ? null : -0.6 + 0.6 * phase(bau, 0.1, 0.17)); return; }
          if (bau < 0.34) {
            /* frischer Beton um die Pfosten */
            const kU = ST.lichtFaktor([0, 0, 1], F.Z, 0, F.jahr);
            for (const x of PF.x) { vieleck(g, [[x - 0.15, -0.15], [x + 0.15, -0.15], [x + 0.15, 0.15], [x - 0.15, 0.15]].map((q) => V.p(q[0], q[1], 0.004))); g.fillStyle = rgb(mul([172, 170, 162], kU)); g.fill(); }
          }
          /* Lagen von hinten nach vorn: Pfosten (y = 0), Riegel, Staketen */
          const vornSicht = dot(V.n(0, 1, 0), AUGE) > 0;
          const hinten = vornSicht ? -1 : 1;
          if (A.schmuck && winter) weheMalen(g, V, F, hinten, W);
          if (A.schmuck && !winter) { grasMalen(g, V, F, saat, hinten); rankenMalen(g, V, F, ranken, "hinten"); }
          const pfosten = () => {
            const liste = PF.x.slice(0, A.pfosten).map((x) => ({ x: x, t: V.tiefe(x, 0, 0) })).sort((a, b) => a.t - b.t);
            for (const p of liste) pfostenMalen(g, V, F, p.x, holz, winter, A.schmuck, rng, zS(p.x));
          };
          const riegel = () => { for (let i = 0; i < A.riegel; i++) riegelMalen(g, V, F, RI.z[i], holz, winter, A.schmuck, rng); };
          const staketen = () => {
            const liste = plan.slice(0, A.staketen).sort((a, b) => V.tiefe(a.x, 0, 0) - V.tiefe(b.x, 0, 0));
            for (const L of liste) staketeMalen(g, V, F, L, holz, winter, A.schmuck, zS(L.x));
          };
          const schmuck = () => {
            if (!(A.schmuck && winter) || !vornSicht) return;
            const k = ST.lichtFaktor(V.n(0, 1, 0.3), F.Z, 0, F.jahr);
            for (const j of schleifen) { const L = plan[j]; schleifeMalen(g, V, F, L.x, ST_.y + ST_.d / 2 + 0.006, ST_.z1 + L.dz - 0.04, 0.04, k); }
            kranzMalen(g, V, F, saat);
          };
          if (vornSicht) { pfosten(); riegel(); staketen(); schmuck(); }
          else { staketen(); riegel(); pfosten(); }
          if (A.schmuck && winter) weheMalen(g, V, F, -hinten, W);
          if (A.schmuck && !winter) { rankenMalen(g, V, F, ranken, "vorn"); grasMalen(g, V, F, saat, -hinten); }
        })
      };
      M.teil("zaun", { mitte: [0, 0, 0.5] });
      M.figur(figur);
      /* Unsichtbare Hülle: Grundriss und Schatten müssen ins Sprite passen */
      M.teil("huelle", { schatten: false, mitte: [0, 0, -50] });
      const leer = { malen: null, keinLicht: true, keinAo: true };
      M.flaeche(Object.assign({ name: "huelle", o: [-2.1, -0.5, 0], u: [1, 0, 0], v: [0, 1, 0], w: 4.2, h: 1.0 }, leer));
      const H = 1.15, sx = -LICHT[0] / LICHT[2] * H, sy = -LICHT[1] / LICHT[2] * H;
      const gr = schaetzeGier(o) * Math.PI / 180, c = Math.cos(gr), sn = Math.sin(gr);
      const x = sx * c + sy * sn, y = -sx * sn + sy * c;
      M.flaeche(Object.assign({ name: "huelle-schatten", o: [x - 2.1, y - 0.4, 0], u: [1, 0, 0], v: [0, 1, 0], w: 4.2, h: 0.8 }, leer));
    }
  });
})();
