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
  const PF = { b: 0.09, h: 1.1, kappe: 0.05, x: [-1.955, 0, 1.955] };
  const RI = { d: 0.035, h: 0.07, z: [0.26, 0.8], y: PF.b / 2 + 0.035 / 2 };
  const ST_ = { b: 0.056, d: 0.022, z0: 0.07, z1: 0.98, spitze: 0.055, y: PF.b / 2 + 0.035 + 0.011 };
  const ANZAHL = 35;

  const HOLZ = [
    { name: "weiß gestrichen", f: [236, 234, 226], weiss: true },
    { name: "Lärche natur", f: [150, 138, 120], grau: true },
    { name: "braun lasiert", f: [104, 70, 46] }
  ];

  /* Staketen: Lage und kleine Unregelmäßigkeiten je Latte */
  function staketenPlan(saat) {
    const rng = ST.zufall(saat * 17 + 5);
    const liste = [];
    const x0 = -LAENGE / 2 + 0.1, x1 = LAENGE / 2 - 0.1;
    for (let i = 0; i < ANZAHL; i++) {
      liste.push({
        i: i, x: x0 + (x1 - x0) * i / (ANZAHL - 1) + (rng() - 0.5) * 0.008,
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
  function staketeMalen(g, V, F, L, holz, winter, schmuck) {
    const s = V.s, b = ST_.b / 2, d = ST_.d;
    const z0 = ST_.z0, z1 = ST_.z1 + L.dz, zs = z1 + ST_.spitze;
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

  function pfostenMalen(g, V, F, x, holz, winter, schmuck, rng) {
    const b = PF.b / 2, c = skal(holz.f, holz.weiss ? 0.97 : 0.92);
    kastenMalen(g, V, F, x - b, x + b, -b, b, 0, PF.h, c, holz, rng, { ohneOben: true });
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
  /* Schneefarbe genau wie der Boden (boden.js: schneeFarbe × Himmel +
     Sonne), damit eine Wehe nahtlos aus dem Bodenschnee wächst.
     sdif = Sonnenwinkel (0,66 = flacher Boden) */
  function bodenSchnee(Z, sdif) {
    const f = [0.93, 0.95, 0.99], m = [0.97, 0.99, 1.05];
    return [0, 1, 2].map((i) => 255 * f[i] * Math.min(1.05, Z.amb[i] * m[i] + Z.sonne[i] * sdif * 1.45));
  }
  function weheMalen(g, V, F, seite, saat) {
    const s = V.s, rng = ST.zufall(saat * 7 + (seite > 0 ? 3 : 9));
    const grund = bodenSchnee(F.Z, 0.66), hellS = bodenSchnee(F.Z, 0.9), dunkel = bodenSchnee(F.Z, 0.36);
    /* Kette weicher Hügel entlang des Zauns; auf der Rückseite (Wetterseite)
       höher. Jeder Hügel läuft weich in den Boden aus (keine Kante): unten
       Bodenfarbe, oben links ein Lichtschein, unten rechts die Schattenseite. */
    const hoch = seite < 0 ? 0.13 : 0.07, breit = seite < 0 ? 0.3 : 0.2;
    const huegel = [];
    for (let i = 0; i < 16; i++) huegel.push({ x: -LAENGE / 2 + 0.05 + (i + 0.5) / 16 * (LAENGE - 0.1) + (rng() - 0.5) * 0.12, y: seite * (0.05 + rng() * 0.05) + (seite > 0 ? ST_.y : 0), r: breit * (0.8 + rng() * 0.45), h: hoch * (0.7 + rng() * 0.6) });
    huegel.sort((p, q) => V.tiefe(p.x, p.y, 0) - V.tiefe(q.x, q.y, 0));
    const fleck = (x, y, R, sy, c, a0) => {
      g.save(); g.translate(x, y); g.scale(1, sy);
      const gr = g.createRadialGradient(0, 0, 0, 0, 0, R);
      gr.addColorStop(0, rgb(c, a0)); gr.addColorStop(0.55, rgb(c, a0 * 0.8)); gr.addColorStop(1, rgb(c, 0));
      g.fillStyle = gr; g.beginPath(); g.arc(0, 0, R, 0, TAU); g.fill(); g.restore();
    };
    for (const hg of huegel) {
      const m = V.p(hg.x, hg.y, 0), R = hg.r * s, H = hg.h * KZ * s;
      const sy = (R * 0.5 + H * 0.6) / R;
      fleck(m[0], m[1] - H * 0.45, R, sy, grund, 1);
      fleck(m[0] + R * 0.18, m[1] - H * 0.2, R * 0.75, sy, dunkel, 0.45);
      fleck(m[0] - R * 0.2, m[1] - H * 0.7, R * 0.6, sy, hellS, 0.7);
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
     teil = "hinten" | "vorn" – je nach Seite der Latten */
  const RANKEN = [
    { name: "Kletterrose", bl: [[226, 70, 110], [240, 120, 150]], blatt: [52, 96, 44], rose: true },
    { name: "Waldrebe", bl: [[120, 70, 170], [150, 96, 196]], blatt: [60, 108, 48] },
    { name: "Wicke", bl: [[236, 150, 196], [250, 250, 250], [170, 120, 220]], blatt: [84, 134, 64] }
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
          if (rng() < 0.3) continue;
          const t = [], l = 0.35 + rng() * 0.45;
          const xs = x0 + Math.sin(zr / hoch * 44 * 0.36 + p) * 0.14;
          for (let i = 0; i <= 18; i++) { const u = i / 18; t.push([xs + r * l * u, ST_.y + Math.sin(i * 0.9 + p) * 0.034, zr + 0.05 + Math.sin(u * 5 + p) * 0.04 + u * 0.06]); }
          triebe.push(t);
        }
      }
      const blaetter = [], blueten = [];
      for (const t of triebe) {
        for (let i = 2; i < t.length; i++) {
          for (let j = 0; j < 2; j++) {
            if (rng() < 0.3) continue;
            blaetter.push({ p: t[i], w: rng() * TAU, g: 0.75 + rng() * 0.6, seite: t[i][1] > ST_.y ? 1 : -1, dx: (rng() - 0.5) * 0.08, dz: (rng() - 0.5) * 0.07 });
          }
          if (rng() < 0.16 && t[i][2] > 0.25) blueten.push({ p: t[i], c: art.bl[(rng() * art.bl.length) | 0], g: 0.85 + rng() * 0.45, dx: (rng() - 0.5) * 0.1, dz: (rng() - 0.5) * 0.06, knospe: rng() < 0.18 });
        }
      }
      pflanzen.push({ triebe: triebe, blaetter: blaetter, blueten: blueten });
    }
    return { art: art, pflanzen: pflanzen };
  }
  function rankenMalen(g, V, F, R, teil) {
    const s = V.s;
    if (s < 12) return;
    const k = ST.lichtFaktor(V.n(0.3, 0.3, 0.9), F.Z, 0, F.jahr);
    const vornSicht = dot(V.n(0, 1, 0), AUGE) > 0;
    /* „nah" = auf der Seite der Latten, die zum Betrachter zeigt */
    const nahSeite = vornSicht ? 1 : -1;
    const passt = (y) => (teil === "vorn" ? (y - ST_.y) * nahSeite > 0 : (y - ST_.y) * nahSeite <= 0);
    g.lineCap = "round"; g.lineJoin = "round";
    for (const pf of R.pflanzen) {
      /* Stängel, nur die Stücke auf der passenden Seite */
      g.strokeStyle = rgb(mul([70, 88, 44], k)); g.lineWidth = Math.max(0.5, 0.008 * s);
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
      for (const b of pf.blaetter) {
        const y = b.p[1] + b.seite * 0.015;
        if (!passt(y)) continue;
        const p = V.p(b.p[0] + b.dx * 0.5, y, b.p[2] + b.dz);
        const r = 0.036 * s * b.g;
        g.fillStyle = rgb(mul(skal(R.art.blatt, 0.8 + (b.g - 0.7) * 0.4), k));
        g.beginPath(); g.ellipse(p[0], p[1], Math.max(0.6, r), Math.max(0.4, r * 0.5), b.w, 0, TAU); g.fill();
        if (s > 50) { g.strokeStyle = rgb(mul(skal(R.art.blatt, 0.6), k), 0.6); g.lineWidth = Math.max(0.3, s * 0.0015); g.beginPath(); g.moveTo(p[0] - Math.cos(b.w) * r, p[1] - Math.sin(b.w) * r); g.lineTo(p[0] + Math.cos(b.w) * r, p[1] + Math.sin(b.w) * r); g.stroke(); }
      }
      for (const b of pf.blueten) {
        const y = b.p[1];
        if (!passt(y)) continue;
        const p = V.p(b.p[0] + b.dx * 0.3, y + (y > ST_.y ? 0.02 : -0.02), b.p[2] + b.dz);
        const r = Math.max(0.8, (R.art.rose ? 0.042 : 0.05) * s * b.g), c = mul(b.c, k);
        if (b.knospe) { g.fillStyle = rgb(c); g.beginPath(); g.ellipse(p[0], p[1], r * 0.35, r * 0.5, 0, 0, TAU); g.fill(); continue; }
        if (R.art.rose && s > 30) {
          /* gefüllte Rosenblüte: Ringe von Blütenblättern */
          for (let j = 0; j < 3; j++) {
            const rr = r * (1 - j * 0.28);
            g.fillStyle = rgb(skal(c, 1 - j * 0.12));
            g.beginPath(); for (let q = 0; q < 6; q++) { const w = q / 6 * TAU + j; g.moveTo(p[0], p[1]); g.arc(p[0] + Math.cos(w) * rr * 0.35, p[1] + Math.sin(w) * rr * 0.3, rr * 0.5, 0, TAU); } g.fill();
          }
        } else if (s > 30) {
          /* sternförmige Blüte (Waldrebe, Wicke) */
          g.fillStyle = rgb(c);
          for (let q = 0; q < 5; q++) { const w = q / 5 * TAU + b.g; g.beginPath(); g.ellipse(p[0] + Math.cos(w) * r * 0.5, p[1] + Math.sin(w) * r * 0.42, r * 0.5, r * 0.26, w, 0, TAU); g.fill(); }
          g.fillStyle = rgb(mul([250, 226, 120], k)); g.beginPath(); g.arc(p[0], p[1], r * 0.18, 0, TAU); g.fill();
        } else { g.fillStyle = rgb(c); g.beginPath(); g.arc(p[0], p[1], r * 0.7, 0, TAU); g.fill(); }
      }
    }
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
          if (A.schmuck && winter) weheMalen(g, V, F, hinten, saat);
          if (A.schmuck && !winter) { grasMalen(g, V, F, saat, hinten); rankenMalen(g, V, F, ranken, "hinten"); }
          const pfosten = () => {
            const liste = PF.x.slice(0, A.pfosten).map((x) => ({ x: x, t: V.tiefe(x, 0, 0) })).sort((a, b) => a.t - b.t);
            for (const p of liste) pfostenMalen(g, V, F, p.x, holz, winter, A.schmuck, rng);
          };
          const riegel = () => { for (let i = 0; i < A.riegel; i++) riegelMalen(g, V, F, RI.z[i], holz, winter, A.schmuck, rng); };
          const staketen = () => {
            const liste = plan.slice(0, A.staketen).sort((a, b) => V.tiefe(a.x, 0, 0) - V.tiefe(b.x, 0, 0));
            for (const L of liste) staketeMalen(g, V, F, L, holz, winter, A.schmuck);
          };
          if (vornSicht) { pfosten(); riegel(); staketen(); }
          else { staketen(); riegel(); pfosten(); }
          if (A.schmuck && winter) weheMalen(g, V, F, -hinten, saat);
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
