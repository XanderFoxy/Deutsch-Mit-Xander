/* =====================================================================
   BAUKASTEN-STADT — DIE GASLATERNE (Berliner Aufsatzleuchte)
   ---------------------------------------------------------------------
   XANDER: „Ich möchte einen Liebreiz zur Weihnachtsdeko … dieses
   Weihnachtsdorf … mit Schmücken, mit Schnee … Das möchte ich in
   Perfektion." – „Das soll keine Comic Grafik sein. Das soll noch viel
   mehr am Realismus dran sein." – „Richtig filigran." – „Man soll sie in
   jedem Winkel aufstellen können."

   Vorbild: die gusseiserne Gaslaterne, wie sie seit Schinkel in Berlin
   und in vielen Altstädten steht. Von unten nach oben:
     • Granitplatte im Pflaster, darauf der gegossene Sockel mit Wulst,
       Kehle und der kleinen Revisionstür (dahinter sitzt der Gashahn),
     • ein Baluster-Bauch, dann der schlanke, kannelierte Schaft (16
       Rillen), Ringe, der Kragen mit dem Leiterhaken (auf den der
       Laternenanzünder früher seine Leiter legte),
     • der Kelch, darauf der vierseitige Laternenkopf: nach oben weiter
       werdende Glasscheiben in einem Eisenrahmen, innen die Gasleitung,
       der weiße Reflektorteller und vier hängende Glühstrümpfe,
     • Gesims, geschweiftes Dach, Entlüftungshut und Spitze.
   Mast 3,3 m, mit Kopf 4,4 m. Grundfarbe: Tannengrün, Anthrazit oder
   Graugrün (je nach o.saat), Lack mit leichtem Glanz.

   Winter: Tannenzweige mit roter Schleife am Mast, Schneehaube auf dem
   Dach, Schneestreifen auf jedem Ring, eine Schneewehe um den Fuß.
   Frühling: eine Blumenampel mit Hängepetunien am geschwungenen Arm,
   frisches Gras in den Fugen der Granitplatte.
   Dämmerung und Nacht: das Gasglühlicht brennt – warmes, leicht
   grünlich-gelbes Licht, großer weicher Schein mit hellem Kern, eine
   Lichtpfütze auf dem Boden.

   WIE ES GEBAUT IST
   Eine Laterne besteht fast nur aus Drehkörpern und ist dünn – das malt
   eine einzige Figur, die sich selbst in echtem 3D ausrechnet (wie die
   Tanne und der Christbaum): der Mast als Drehkörper (jede Scheibe mit
   dem Licht ihres Neigungswinkels, Glanzlicht, Rillen), der Kopf aus
   ebenen Flächen, die sich mit dem Drehwinkel drehen. Den Schatten malt
   sie selbst flach auf den Boden (Stäbe, Rahmen und Dach werfen Schatten,
   die Scheiben lassen Licht durch).
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
  const HALB = nrm([LICHT[0] + AUGE[0], LICHT[1] + AUGE[1], LICHT[2] + AUGE[2]]);
  const klemm = (x, a, b) => (x < a ? a : x > b ? b : x);
  function rgb(f, a) { return a == null ? "rgb(" + (f[0] | 0) + "," + (f[1] | 0) + "," + (f[2] | 0) + ")" : "rgba(" + (f[0] | 0) + "," + (f[1] | 0) + "," + (f[2] | 0) + "," + a + ")"; }
  function mul(f, k) { return [Math.min(255, f[0] * k[0]), Math.min(255, f[1] * k[1]), Math.min(255, f[2] * k[2])]; }
  function skal(f, k) { return [f[0] * k, f[1] * k, f[2] * k]; }
  function plus(f, d) { return [Math.min(255, f[0] + d[0]), Math.min(255, f[1] + d[1]), Math.min(255, f[2] + d[2])]; }
  function misch(a, b, k) { return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]; }
  function phase(bau, a, b) { return klemm((bau - a) / (b - a), 0, 1); }
  function vieleck(g, pts) { g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]); g.closePath(); }

  /* Blick: Modellpunkt → Bildpunkt (Ursprung = Fußpunkt der Figur, Pixel) */
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
  /* Fläche im Raum für Malarbeiten in Flächenmetern (o = Ecke, eu/ev = Richtungen) */
  function affin(g, V, o, eu, ev) {
    const p0 = V.p(o[0], o[1], o[2]), pu = V.p(o[0] + eu[0], o[1] + eu[1], o[2] + eu[2]), pv = V.p(o[0] + ev[0], o[1] + ev[1], o[2] + ev[2]);
    g.transform(pu[0] - p0[0], pu[1] - p0[1], pv[0] - p0[0], pv[1] - p0[1], p0[0], p0[1]);
  }
  /* Kern-Lücke: beim Figurenschatten (kern.js, figurSchatten) fehlt F.gier –
     der Schatten wird direkt nach dem Bild gemalt, also merken wir ihn uns. */
  function mitGier(malen) {
    let merk = 0;
    return function (g, s, F) {
      if (F.gier != null && isFinite(F.gier)) merk = F.gier; else F = Object.assign({}, F, { gier: merk });
      return malen(g, s, F);
    };
  }
  /* Vieleck an den laufenden Pfad hängen – immer gleich herum, damit sich
     überlappende Schattenstücke bei EINEM fill() vereinigen */
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
  /* Ellipse (Kreis am Boden) als Vieleck – für den Schattenpfad */
  function kreisBoden(V, x, y, z, r, n) {
    const pts = [];
    for (let i = 0; i < n; i++) { const a = i / n * TAU; pts.push(V.boden(x + Math.cos(a) * r, y + Math.sin(a) * r, z)); }
    return pts;
  }

  /* ---------------- Licht ----------------
     Farbe eines Werkstoffs unter der Normale n (Kameraraum): Himmel +
     Sonne aus dem Kern, dazu ein weiches Glanzlicht (Lack) und nachts
     das warme Licht der eigenen Flamme von oben. */
  function licht(f, n, F, opt) {
    const k = ST.lichtFaktor(n, F.Z, 0, F.jahr);
    let c = [f[0] * k[0], f[1] * k[1], f[2] * k[2]];
    if (opt && opt.glanz) {
      const nh = dot(n, HALB), ab = opt.ab == null ? 0.52 : opt.ab;
      const sp = Math.pow(Math.max(0, (nh - ab) / (1 - ab)), opt.exp || 2) * opt.glanz;
      const so = (F.Z.sonne[0] + F.Z.sonne[1] + F.Z.sonne[2]) / 1.04;
      const him = 0.25 * (F.Z.amb[2] || 0.6);
      c = plus(c, [255 * sp * (so + him), 250 * sp * (so + him), 238 * sp * (so + him * 1.1)]);
    }
    if (opt && opt.flamme && F.nacht > 0) {
      /* Lichtquelle direkt darüber: trifft nach oben zeigende Flächen */
      const w = F.nacht * opt.flamme * Math.max(0, n[2] * 0.8 + 0.2);
      c = plus(c, [255 * w * 0.9, 200 * w * 0.9, 120 * w * 0.9]);
    }
    return c;
  }
  const himmelSpiegel = (F) => { const a = F.Z.amb; return [a[0] * 255 * 1.25, a[1] * 255 * 1.22, a[2] * 255 * 1.18]; };

  /* =====================================================================
     MASSE
     ===================================================================== */
  /* Mastprofil [Höhe, Halbmesser] von unten nach oben. Gleiche Höhe
     zweimal = waagerechte Stufe (Oberseite eines Rings). */
  const PROFIL = [
    [0.000, 0.205], [0.030, 0.205],                          // Fußplatte
    [0.030, 0.190], [0.042, 0.198], [0.056, 0.198], [0.068, 0.188],   // Wulst
    [0.068, 0.172], [0.086, 0.168],                          // Kehle
    [0.086, 0.180], [0.100, 0.180],                          // Plättchen
    [0.100, 0.163], [0.300, 0.159], [0.540, 0.153],          // Sockelkörper (Revisionstür)
    [0.540, 0.170], [0.575, 0.170],                          // Deckplatte
    [0.575, 0.148], [0.600, 0.139], [0.640, 0.124], [0.690, 0.110], [0.740, 0.101],   // Anlauf (Kehle)
    [0.740, 0.113], [0.772, 0.113],                          // Ring
    [0.772, 0.096], [0.820, 0.104], [0.880, 0.108], [0.940, 0.104], [1.000, 0.094], [1.040, 0.086],   // Baluster
    [1.040, 0.097], [1.072, 0.097],                          // Ring
    [1.072, 0.080], [1.100, 0.076],                          // Hals
    [1.100, 0.072], [2.000, 0.065], [2.880, 0.058],          // Schaft (kanneliert)
    [2.880, 0.069], [2.912, 0.069],                          // Ring
    [2.912, 0.060], [3.050, 0.057],                          // Hals
    [3.050, 0.074], [3.100, 0.074],                          // Kragen mit Leiterhaken
    [3.100, 0.058], [3.130, 0.057],
    [3.130, 0.064], [3.170, 0.074], [3.210, 0.088], [3.250, 0.106], [3.280, 0.124],   // Kelch
    [3.280, 0.132], [3.300, 0.132]                           // Teller
  ];
  const Z_SOCKEL = 1.10, Z_SCHAFT = 2.912, Z_MAST = 3.30;
  const RILLEN = { z0: 1.12, z1: 2.86, n: 16 };
  const HAKEN = { z: 3.075, l: 0.30, r: 0.016 };
  /* Laternenkopf (vierseitig, Seiten entlang der Modellachsen) */
  const KOPF = {
    zb0: 3.30, zb1: 3.355, bb: 0.128,              // Bodenrahmen
    zg0: 3.355, zg1: 3.905, b0: 0.122, b1: 0.212,  // Glaskörper
    zs0: 3.905, zs1: 3.965, s0: 0.232, s1: 0.250,  // Gesims
    zd0: 3.965, zd1: 4.05, zd2: 4.215, d0: 0.26, d1: 0.17, d2: 0.034,   // geschweiftes Dach
    zh0: 4.20, zh1: 4.255, rh: 0.036, zk: 4.272, rk: 0.064,   // Entlüftung mit Hut
    zs: 4.325, zsp: 4.42                             // Kugel und Spitze
  };
  const Z_LICHT = 3.66;
  const Z_SCHNEE = 0.058;                         // so tief steckt der Fuß im Schnee

  const FARBEN = [
    { name: "Tannengrün", f: [50, 78, 64] },
    { name: "Anthrazit", f: [60, 64, 69] },
    { name: "Graugrün", f: [74, 88, 82] }
  ];

  /* Mastradius in Höhe z (für Anbauten) */
  function radiusBei(z) {
    for (let i = 0; i < PROFIL.length - 1; i++) {
      const a = PROFIL[i], b = PROFIL[i + 1];
      if (z >= a[0] && z <= b[0] && b[0] > a[0]) return a[1] + (b[1] - a[1]) * (z - a[0]) / (b[0] - a[0]);
    }
    return 0.06;
  }

  /* =====================================================================
     DREHKÖRPER — Scheibe für Scheibe, jede mit dem Licht ihrer Neigung
     ===================================================================== */
  function drehkoerper(g, V, F, prof, f, zMax, opt) {
    const s = V.s, winter = F.jahr === "winter";
    const naht = 0.6;                    // Überlappung gegen Haarlinien
    const band = (z0, r0, z1, r1, rs) => {
      const y0 = -z0 * KZ * s, y1 = -z1 * KZ * s, R0 = r0 * s, R1 = r1 * s;
      if (R0 < 0.05 && R1 < 0.05) return;
      g.beginPath();
      g.moveTo(-R0, y0);
      g.ellipse(0, y0, Math.max(0.01, R0), Math.max(0.01, R0 / 2), 0, Math.PI, 0, true);
      g.lineTo(R1, y1 - naht);
      g.ellipse(0, y1 - naht, Math.max(0.01, R1), Math.max(0.01, R1 / 2), 0, 0, Math.PI, false);
      g.closePath();
      const Rm = Math.max(0.3, (R0 + R1) / 2);
      const gr = g.createLinearGradient(-Rm, 0, Rm, 0);
      const N = 10;
      for (let j = 0; j <= N; j++) {
        const phi = Math.PI * (1 - j / N);          // π … 0  → links … rechts
        const u = Math.cos(phi);
        const th = phi - Math.PI / 4;
        const n = nrm([Math.cos(th), Math.sin(th), -rs]);
        /* Rand: die Rundung dunkelt zum Umriss hin etwas nach (Hohlkehle des Blicks) */
        const rand = 1 - 0.12 * Math.pow(Math.abs(u), 6);
        gr.addColorStop((u + 1) / 2, rgb(skal(licht(f, n, F, opt), rand)));
      }
      g.fillStyle = gr; g.fill();
    };
    const deckel = (z, r, schnee) => {
      const y = -z * KZ * s, R = r * s;
      if (R < 0.3) return;
      g.beginPath(); g.ellipse(0, y, R, R / 2, 0, 0, TAU);
      g.fillStyle = rgb(schnee ? licht([246, 249, 255], [0, 0, 1], F) : licht(f, [0, 0, 1], F, opt));
      g.fill();
      /* Kante vorn: feines Licht */
      if (R > 2 && !schnee) {
        g.strokeStyle = rgb(licht(plus(f, [30, 30, 30]), nrm([0.5, 0.5, 0.7]), F, opt), 0.6);
        g.lineWidth = Math.max(0.4, s * 0.004);
        g.beginPath(); g.ellipse(0, y, R, R / 2, 0, 0.15, Math.PI - 0.15); g.stroke();
      }
    };
    /* Steigung je Abschnitt; an den Knoten gemittelt, wo zwei Abschnitte
       fast gleich geneigt anschließen (Kehle, Wulst, Baluster) – dann läuft
       das Licht stufenlos über die Rundung. Echte Kanten (Ringe, Stufen)
       bleiben scharf. Die Zahl der Bänder richtet sich nach der Bildhöhe
       (etwa alle 3 Pixel ein Band), nicht nach der Form. */
    const zMin = (opt && opt.zMin) || 0;
    const seg = [];
    for (let i = 0; i < prof.length - 1; i++) {
      let [za, ra] = prof[i], [zb, rb] = prof[i + 1];
      if (za >= zMax) break;
      if (zb - za < 1e-6) {
        if (za >= zMin && rb < ra - 1e-4) seg.push({ stufe: true, z: za, r: ra, schnee: winter && opt && opt.schneeAufStufen && ra - rb > 0.02 });
        continue;
      }
      if (zb <= zMin) continue;
      if (za < zMin) { ra = ra + (rb - ra) * (zMin - za) / (zb - za); za = zMin; }
      if (zb > zMax) { rb = ra + (rb - ra) * (zMax - za) / (zb - za); zb = zMax; }
      seg.push({ za: za, ra: ra, zb: zb, rb: rb, rs: (rb - ra) / (zb - za) });
    }
    const passt = (x, y) => x && y && !x.stufe && !y.stufe && Math.abs(x.zb - y.za) < 1e-6 && Math.abs(x.rb - y.ra) < 1e-4 && Math.abs(Math.atan(x.rs) - Math.atan(y.rs)) < 0.6;
    let zEnde = 0, rEnde = 0;
    for (let j = 0; j < seg.length; j++) {
      const S = seg[j];
      if (S.stufe) { deckel(S.z, S.r, S.schnee); continue; }
      const rsA = passt(seg[j - 1], S) ? (seg[j - 1].rs + S.rs) / 2 : S.rs;
      const rsB = passt(S, seg[j + 1]) ? (seg[j + 1].rs + S.rs) / 2 : S.rs;
      const teile = Math.abs(rsA - rsB) < 1e-3 ? 1 : klemm(Math.ceil((S.zb - S.za) * KZ * s / 3), 2, 24);
      for (let k = 0; k < teile; k++) {
        const z0 = S.za + (S.zb - S.za) * k / teile, z1 = S.za + (S.zb - S.za) * (k + 1) / teile;
        band(z0, S.ra + (S.rb - S.ra) * k / teile, z1, S.ra + (S.rb - S.ra) * (k + 1) / teile, rsA + (rsB - rsA) * (k + 0.5) / teile);
      }
      zEnde = S.zb; rEnde = S.rb;
    }
    if (rEnde > 0) deckel(zEnde, rEnde, false);
  }

  /* Umriss des Mastes als Pfad (für Beschneiden: Rauschen, Rillen) */
  function mastPfad(g, V, prof, zMax, zMin) {
    const s = V.s, L = [], R = [];
    zMin = zMin || 0;
    const r0 = radiusBei(Math.max(0.0005, zMin));
    L.push([-r0 * s, -zMin * KZ * s]); R.push([r0 * s, -zMin * KZ * s]);
    for (const [z, r] of prof) { if (z > zMax) break; if (z <= zMin) continue; L.push([-r * s, -z * KZ * s]); R.push([r * s, -z * KZ * s]); }
    g.beginPath();
    g.moveTo(L[0][0], L[0][1]);
    g.ellipse(0, -zMin * KZ * s, r0 * s, r0 * s / 2, 0, Math.PI, 0, true);
    for (const p of R) g.lineTo(p[0], p[1]);
    const zt = Math.min(zMax, prof[prof.length - 1][0]), rt = radiusBei(Math.min(zt, 3.299)) * s;
    g.ellipse(0, -zt * KZ * s, rt, rt / 2, 0, 0, Math.PI, true);
    for (let i = L.length - 1; i >= 0; i--) g.lineTo(L[i][0], L[i][1]);
    g.closePath();
  }

  /* Rillen (Kanneluren) im Schaft: je Rille eine dunkle Kehle und eine
     helle Kante – sie drehen sich mit dem Modell */
  function rillenMalen(g, V, F, gierRad, f) {
    const s = V.s;
    if (s < 18) return;
    const { z0, z1, n } = RILLEN;
    g.save();
    g.lineCap = "round";
    for (let i = 0; i < n; i++) {
      const th = i / n * TAU + gierRad;
      const vis = Math.sin(th + Math.PI / 4);
      if (vis < 0.12) continue;
      const u = Math.cos(th + Math.PI / 4);
      const nk = [Math.cos(th), Math.sin(th), 0];
      const k = ST.lichtFaktor(nk, F.Z, 0, F.jahr);
      const hellig = (k[0] + k[1] + k[2]) / 3;
      const a = Math.min(0.55, 0.25 + 0.4 * vis);
      g.strokeStyle = rgb(skal(f, 0.35 * hellig), a);
      g.lineWidth = Math.max(0.5, s * 0.0065 * vis);
      g.beginPath();
      for (let j = 0; j <= 6; j++) {
        const z = z0 + (z1 - z0) * j / 6, r = radiusBei(z);
        const x = r * s * u, y = -z * KZ * s + r * s * 0.5 * vis;
        if (j) g.lineTo(x, y); else g.moveTo(x, y);
      }
      g.stroke();
      /* helle Kante der Rippe daneben (zur Lichtseite) */
      const th2 = th + Math.PI / n;
      const vis2 = Math.sin(th2 + Math.PI / 4);
      if (vis2 < 0.12) continue;
      const u2 = Math.cos(th2 + Math.PI / 4);
      const n2 = [Math.cos(th2), Math.sin(th2), 0];
      const c2 = licht(plus(f, [26, 28, 26]), n2, F, { glanz: 0.5, exp: 2, ab: 0.45 });
      g.strokeStyle = rgb(c2, 0.35 * vis2);
      g.lineWidth = Math.max(0.4, s * 0.004 * vis2);
      g.beginPath();
      for (let j = 0; j <= 6; j++) {
        const z = z0 + (z1 - z0) * j / 6, r = radiusBei(z);
        const x = r * s * u2, y = -z * KZ * s + r * s * 0.5 * vis2;
        if (j) g.lineTo(x, y); else g.moveTo(x, y);
      }
      g.stroke();
    }
    g.restore();
  }

  /* Punkt auf der Mastoberfläche (Modellwinkel a, Höhe z, Abstand d vor der Haut) */
  function aufMast(a, z, d) { const r = radiusBei(z) + (d || 0); return [Math.cos(a) * r, Math.sin(a) * r, z]; }

  /* Revisionstür im Sockel: gegossener Rahmen, Schlüsselloch, Rosette */
  function tuerMalen(g, V, F, f) {
    const s = V.s;
    if (s < 14) return;
    const a = Math.PI / 4;                          // Vorderseite (zur Straße, schräg zum Betrachter)
    const nk = V.n(Math.cos(a), Math.sin(a), 0);
    if (nk[0] * AUGE[0] + nk[1] * AUGE[1] < 0.05) return;
    const breite = 0.5, zu = 0.17, zo = 0.47;
    const rand = (da, z) => V.p(...aufMast(a + da, z, 0.002));
    const umriss = [];
    for (let j = 0; j <= 8; j++) umriss.push(rand(-breite + 2 * breite * j / 8, zu));
    for (let j = 0; j <= 4; j++) umriss.push(rand(breite, zu + (zo - zu - 0.06) * j / 4));
    /* oben ein kleiner Rundbogen */
    for (let j = 0; j <= 8; j++) { const w = Math.PI * j / 8; umriss.push(rand(breite * Math.cos(w), zo - 0.06 + Math.sin(w) * 0.06)); }
    for (let j = 4; j >= 0; j--) umriss.push(rand(-breite, zu + (zo - zu - 0.06) * j / 4));
    const kl = licht(f, nk, F);
    /* Fuge (dunkel) und erhabener Rahmen (hell) */
    vieleck(g, umriss);
    g.strokeStyle = rgb(skal(kl, 0.35), 0.9); g.lineWidth = Math.max(0.6, s * 0.009); g.stroke();
    g.save(); g.translate(-Math.max(0.3, s * 0.003), -Math.max(0.3, s * 0.003));
    vieleck(g, umriss); g.strokeStyle = rgb(licht(plus(f, [40, 42, 40]), nk, F, { glanz: 0.6 }), 0.55); g.lineWidth = Math.max(0.4, s * 0.004); g.stroke();
    g.restore();
    if (s > 40) {
      /* Schlüsselloch und Rosette */
      const k = V.p(...aufMast(a + 0.3, 0.3, 0.004));
      g.fillStyle = "rgba(10,10,10,0.9)"; g.beginPath(); g.arc(k[0], k[1], Math.max(0.6, s * 0.006), 0, TAU); g.fill();
      g.fillRect(k[0] - s * 0.002, k[1], s * 0.004, s * 0.012);
      const m = V.p(...aufMast(a, 0.40, 0.004));
      const rr = s * 0.03;
      for (let i = 0; i < 8; i++) {
        const w = i / 8 * TAU;
        g.fillStyle = rgb(licht(plus(f, [26, 26, 24]), nk, F, { glanz: 0.7 }), 0.8);
        g.beginPath(); g.ellipse(m[0] + Math.cos(w) * rr * 0.55 * Math.abs(nk[0] - nk[1] + 0.3), m[1] + Math.sin(w) * rr * 0.5, rr * 0.28, rr * 0.2, w, 0, TAU); g.fill();
      }
      g.fillStyle = rgb(skal(kl, 0.6)); g.beginPath(); g.arc(m[0], m[1], rr * 0.25, 0, TAU); g.fill();
    }
  }

  /* Laternennummer: kleines Emailleschild am Schaft (Modell +x) */
  function nummerMalen(g, V, F, nummer) {
    const s = V.s;
    if (s < 30) return;
    const a = Math.PI / 4, z = 1.7;
    const nk = V.n(Math.cos(a), Math.sin(a), 0);
    const sicht = nk[0] * AUGE[0] + nk[1] * AUGE[1];
    if (sicht < 0.15) return;
    const w = 0.085, h = 0.06;
    const o = aufMast(a, z + h / 2, 0.006);
    g.save();
    const t = [-Math.sin(a), Math.cos(a), 0];
    affin(g, V, [o[0] - t[0] * w / 2, o[1] - t[1] * w / 2, o[2]], t, [0, 0, -1]);
    const kl = ST.lichtFaktor(nk, F.Z, 0, F.jahr);
    g.fillStyle = rgb(mul([238, 236, 228], kl)); PI.rundRechteck(g, 0, 0, w, h, 0.008); g.fill();
    g.strokeStyle = rgb(mul([30, 30, 30], kl)); g.lineWidth = 0.004; PI.rundRechteck(g, 0.005, 0.005, w - 0.01, h - 0.01, 0.006); g.stroke();
    if (s > 70) {
      g.fillStyle = rgb(mul([24, 24, 26], kl)); g.font = "bold 0.034px sans-serif"; g.textAlign = "center"; g.textBaseline = "middle";
      g.fillText(String(nummer), w / 2, h / 2 + 0.002);
    } else { g.fillStyle = rgb(mul([60, 60, 60], kl)); g.fillRect(w * 0.25, h * 0.4, w * 0.5, h * 0.22); }
    g.restore();
  }

  /* Leiterhaken: waagerechter Stab durch den Kragen, Kugeln an den Enden.
     seite = −1 / +1 (die Hälfte hinter bzw. vor dem Mast wird getrennt gemalt) */
  function hakenMalen(g, V, F, f, seite, winter) {
    const s = V.s, H = HAKEN;
    const a = V.p(0, 0, H.z), b = V.p(seite * H.l, 0, H.z);
    const nOben = nrm([0.25, 0.25, 1]);
    const kf = licht(f, V.n(0.3, 0.3, 1), F, { glanz: 0.6, flamme: 0.35 });
    const ku = licht(f, [0.45, 0.45, -0.3], F);
    const w = Math.max(0.8, H.r * 2 * s);
    g.lineCap = "butt";
    g.strokeStyle = rgb(ku); g.lineWidth = w;
    g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
    g.strokeStyle = rgb(kf); g.lineWidth = w * 0.55;
    g.beginPath(); g.moveTo(a[0], a[1] - w * 0.2); g.lineTo(b[0], b[1] - w * 0.2); g.stroke();
    if (winter && s > 10) {
      g.strokeStyle = rgb(licht([246, 249, 255], nOben, F)); g.lineWidth = Math.max(0.7, s * 0.014); g.lineCap = "round";
      const c = V.p(seite * H.l * 0.28, 0, H.z), d = V.p(seite * H.l * 0.9, 0, H.z);
      g.beginPath(); g.moveTo(c[0], c[1] - w * 0.55); g.lineTo(d[0], d[1] - w * 0.55); g.stroke();
    }
    /* Kugel am Ende */
    const rk = Math.max(0.8, 0.026 * s);
    const gk = g.createRadialGradient(b[0] - rk * 0.4, b[1] - rk * 0.45, rk * 0.1, b[0], b[1], rk);
    gk.addColorStop(0, rgb(licht(plus(f, [40, 40, 40]), nrm([-0.4, 0.6, 0.7]), F, { glanz: 1.2 })));
    gk.addColorStop(1, rgb(licht(f, [0.6, 0.6, -0.2], F)));
    g.fillStyle = gk; g.beginPath(); g.arc(b[0], b[1], rk, 0, TAU); g.fill();
    if (winter && s > 16) { g.fillStyle = rgb(licht([246, 249, 255], [0, 0, 1], F)); g.beginPath(); g.ellipse(b[0], b[1] - rk * 0.75, rk * 0.8, rk * 0.45, 0, Math.PI, 0); g.fill(); }
  }

  /* =====================================================================
     DER LATERNENKOPF
     ===================================================================== */
  /* vier Seiten eines quadratischen Kegelstumpfs (Halbbreite b0 unten, b1 oben) */
  function stumpf(z0, b0, z1, b1) {
    const seiten = [];
    const m = (b1 - b0) / (z1 - z0);
    for (let k = 0; k < 4; k++) {
      const a = k * Math.PI / 2, d = [Math.cos(a), Math.sin(a)], t = [-d[1], d[0]];
      seiten.push({
        d: d, t: t, n: nrm([d[0], d[1], -m]),
        /* Ecken: unten links, unten rechts, oben rechts, oben links (von außen) */
        e: [[d[0] * b0 - t[0] * b0, d[1] * b0 - t[1] * b0, z0], [d[0] * b0 + t[0] * b0, d[1] * b0 + t[1] * b0, z0],
            [d[0] * b1 + t[0] * b1, d[1] * b1 + t[1] * b1, z1], [d[0] * b1 - t[0] * b1, d[1] * b1 - t[1] * b1, z1]]
      });
    }
    return seiten;
  }
  const sichtbar = (V, n) => { const k = V.n(n[0], n[1], n[2]); return dot(k, AUGE); };

  function kopfMalen(g, V, F, f, A, o) {
    const s = V.s, K = KOPF, winter = F.jahr === "winter";
    const nacht = A.licht ? F.nacht : 0;
    const P = (q) => V.p(q[0], q[1], q[2]);
    const flaeche = (pts, farbe) => { vieleck(g, pts.map(P)); g.fillStyle = farbe; g.fill(); };
    const glasFarbe = [255, 222, 158];

    /* --- Bodenrahmen (kleiner Kasten unter dem Glas) --- */
    if (A.kopf > 0) {
      for (const sd of stumpf(K.zb0, K.bb * 0.92, K.zb1, K.bb)) {
        if (sichtbar(V, sd.n) <= 0) continue;
        flaeche(sd.e, rgb(licht(f, V.n(...sd.n), F, { glanz: 0.5, flamme: 0 })));
      }
    }
    const glas = stumpf(K.zg0, K.b0, K.zg1, K.b1);
    const hinten = glas.filter((sd) => sichtbar(V, sd.n) <= 0);
    const vorn = glas.filter((sd) => sichtbar(V, sd.n) > 0);
    /* Eckstäbe: nach Tiefe sortiert, hintere zuerst */
    const ecken = [];
    for (let k = 0; k < 4; k++) {
      const a = Math.PI / 4 + k * Math.PI / 2, cx = Math.cos(a) * Math.SQRT2, cy = Math.sin(a) * Math.SQRT2;
      ecken.push({ u: [cx * K.b0, cy * K.b0, K.zg0], o: [cx * K.b1, cy * K.b1, K.zg1], n: nrm([cx, cy, -0.3]), t: V.tiefe(cx, cy, 0) });
    }
    ecken.sort((a, b) => a.t - b.t);
    const stab = (e, dunkel) => {
      const a = P(e.u), b = P(e.o);
      g.lineCap = "butt";
      g.strokeStyle = rgb(dunkel ? skal(licht(f, V.n(...e.n), F), 0.8) : licht(f, V.n(...e.n), F, { glanz: 0.7 }));
      g.lineWidth = Math.max(0.7, 0.024 * s);
      g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
      if (s > 50 && !dunkel) {
        g.strokeStyle = rgb(licht(plus(f, [40, 40, 36]), V.n(e.n[0] - 0.5, e.n[1] + 0.5, 0.5), F, { glanz: 1 }), 0.5);
        g.lineWidth = Math.max(0.4, 0.006 * s);
        g.beginPath(); g.moveTo(a[0] - 0.006 * s, a[1]); g.lineTo(b[0] - 0.006 * s, b[1]); g.stroke();
      }
    };

    if (A.glas > 0) {
      /* --- hintere Scheiben (von innen gesehen) --- */
      for (const sd of hinten) {
        const pts = sd.e.map(P);
        vieleck(g, pts);
        if (nacht > 0.02) {
          /* von innen hell ausgeleuchtet: Licht fällt von der Flamme auf das Glas */
          const m = V.p(0, 0, Z_LICHT);
          const gr = g.createRadialGradient(m[0], m[1] + 0.02 * s, 0, m[0], m[1], 0.36 * s);
          gr.addColorStop(0, rgb(misch([90, 96, 110], [255, 246, 214], nacht)));
          gr.addColorStop(0.45, rgb(misch([80, 88, 104], glasFarbe, nacht)));
          gr.addColorStop(1, rgb(misch([60, 66, 80], skal(glasFarbe, 0.78), nacht)));
          g.fillStyle = gr;
        } else {
          const hs = himmelSpiegel(F);
          const gr = g.createLinearGradient(0, pts[3][1], 0, pts[0][1]);
          gr.addColorStop(0, rgb(skal(hs, 0.62))); gr.addColorStop(1, rgb(skal(hs, 0.42)));
          g.fillStyle = gr;
        }
        g.fill();
      }
    }
    /* hintere Eckstäbe */
    if (A.kopf > 0) for (const e of ecken) if (dot(V.n(e.n[0], e.n[1], 0), AUGE) <= 0) stab(e, true);

    if (A.innen > 0) {
      /* --- Gasleitung, Reflektorteller, Glühstrümpfe --- */
      const r0 = V.p(0, 0, K.zg0), r1 = V.p(0, 0, 3.84);
      g.strokeStyle = nacht > 0.02 ? "rgba(70,50,30,0.9)" : rgb(licht([150, 140, 110], V.n(0.5, 0.5, 0.2), F));
      g.lineWidth = Math.max(0.5, 0.012 * s);
      g.beginPath(); g.moveTo(r0[0], r0[1]); g.lineTo(r1[0], r1[1]); g.stroke();
      /* Reflektorteller: weiß emailliert, oben grau */
      const t = V.p(0, 0, 3.855), rt = 0.1 * s;
      g.fillStyle = nacht > 0.02 ? rgb(misch([120, 120, 120], [255, 236, 190], nacht * 0.8)) : rgb(licht([200, 200, 196], [0, 0, 1], F));
      g.beginPath(); g.ellipse(t[0], t[1], rt, rt * 0.5, 0, 0, TAU); g.fill();
      g.fillStyle = nacht > 0.02 ? rgb(misch([90, 90, 90], [255, 220, 160], nacht * 0.6)) : rgb(licht([150, 150, 148], [0, 0, 1], F));
      g.beginPath(); g.ellipse(t[0], t[1] - 0.012 * s, rt * 0.4, rt * 0.2, 0, 0, TAU); g.fill();
      /* vier hängende Glühstrümpfe, nach Tiefe sortiert */
      const st = [];
      for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + Math.PI / 4; st.push({ x: Math.cos(a) * 0.045, y: Math.sin(a) * 0.045 }); }
      st.sort((a, b) => V.tiefe(a.x, a.y, 0) - V.tiefe(b.x, b.y, 0));
      for (const q of st) {
        const top = V.p(q.x, q.y, 3.835), w = Math.max(0.6, 0.017 * s), h = 0.075 * KZ * s;
        const gr = g.createLinearGradient(0, top[1], 0, top[1] + h);
        if (nacht > 0.02) {
          gr.addColorStop(0, rgb(misch([230, 226, 214], [255, 252, 238], nacht)));
          gr.addColorStop(1, rgb(misch([210, 204, 190], [255, 236, 190], nacht)));
        } else {
          const kk = ST.lichtFaktor(V.n(0.5, 0.5, 0), F.Z, 0, F.jahr);
          gr.addColorStop(0, rgb(mul([236, 232, 218], kk))); gr.addColorStop(1, rgb(mul([196, 190, 176], kk)));
        }
        g.fillStyle = gr;
        g.beginPath();
        g.moveTo(top[0] - w * 0.35, top[1]);
        g.bezierCurveTo(top[0] - w, top[1] + h * 0.45, top[0] - w * 0.6, top[1] + h, top[0], top[1] + h);
        g.bezierCurveTo(top[0] + w * 0.6, top[1] + h, top[0] + w, top[1] + h * 0.45, top[0] + w * 0.35, top[1]);
        g.closePath(); g.fill();
        if (nacht > 0.02) {
          /* weißglühend: kleiner Hof um jeden Strumpf */
          const m = [top[0], top[1] + h * 0.55], R = Math.max(1.5, 0.05 * s);
          const gr2 = g.createRadialGradient(m[0], m[1], 0, m[0], m[1], R);
          gr2.addColorStop(0, "rgba(255,252,236," + (0.7 * nacht).toFixed(3) + ")"); gr2.addColorStop(1, "rgba(255,230,170,0)");
          g.fillStyle = gr2; g.fillRect(m[0] - R, m[1] - R, 2 * R, 2 * R);
        }
      }
    }

    if (A.glas > 0) {
      /* --- vordere Scheiben: Spiegelung des Himmels, leicht getönt --- */
      for (const sd of vorn) {
        const pts = sd.e.map(P);
        g.save();
        vieleck(g, pts); g.clip();
        if (nacht > 0.02) {
          const m = V.p(0, 0, Z_LICHT);
          const gr = g.createRadialGradient(m[0], m[1], 0, m[0], m[1], 0.34 * s);
          gr.addColorStop(0, "rgba(255,250,228," + (0.32 * nacht).toFixed(3) + ")");
          gr.addColorStop(1, "rgba(255,214,140," + (0.14 * nacht).toFixed(3) + ")");
          g.fillStyle = gr; g.fillRect(m[0] - s, m[1] - s, 2 * s, 2 * s);
        } else {
          const hs = himmelSpiegel(F);
          const gr = g.createLinearGradient(0, pts[3][1], 0, pts[0][1]);
          gr.addColorStop(0, rgb(hs, 0.42)); gr.addColorStop(1, rgb(skal(hs, 0.8), 0.18));
          g.fillStyle = gr; g.fillRect(-s, pts[3][1] - s, 2 * s, 2 * s);
        }
        /* schräger Lichtreflex über die Scheibe */
        const a = pts[3], b = pts[2], c = pts[1], d = pts[0];
        const L = (p, q, k) => [p[0] + (q[0] - p[0]) * k, p[1] + (q[1] - p[1]) * k];
        g.fillStyle = "rgba(255,255,255," + (0.16 + 0.1 * (1 - nacht)).toFixed(3) + ")";
        vieleck(g, [L(a, b, 0.18), L(a, b, 0.34), L(d, c, 0.14), L(d, c, 0.02)]); g.fill();
        g.fillStyle = "rgba(255,255,255," + (0.08 + 0.06 * (1 - nacht)).toFixed(3) + ")";
        vieleck(g, [L(a, b, 0.44), L(a, b, 0.5), L(d, c, 0.3), L(d, c, 0.24)]); g.fill();
        g.restore();
        /* Kitt- und Rahmenkante unten und oben */
        g.strokeStyle = rgb(licht(f, V.n(...sd.n), F));
        g.lineWidth = Math.max(0.5, 0.012 * s);
        g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); g.lineTo(pts[1][0], pts[1][1]); g.stroke();
      }
    }
    /* vordere Eckstäbe (alle Stäbe über das Glas – die hinteren liegen im Glas und sind schwach) */
    if (A.kopf > 0) {
      for (const e of ecken) {
        if (dot(V.n(e.n[0], e.n[1], 0), AUGE) > 0) stab(e, false);
      }
      /* unterer Glasrahmen */
      const r0 = [];
      for (let k = 0; k < 4; k++) { const a = Math.PI / 4 + k * Math.PI / 2; r0.push([Math.cos(a) * Math.SQRT2 * K.b0, Math.sin(a) * Math.SQRT2 * K.b0, K.zg0 + 0.008]); }
      g.strokeStyle = rgb(licht(f, [0.5, 0.5, 0.3], F)); g.lineWidth = Math.max(0.6, 0.016 * s);
      vieleck(g, r0.map(P)); g.stroke();
    }

    if (A.dach > 0) {
      /* --- Gesims --- */
      for (const sd of stumpf(K.zs0, K.s0, K.zs1, K.s1)) {
        const sv = sichtbar(V, sd.n);
        if (sv <= 0) continue;
        const pts = sd.e.map(P);
        vieleck(g, pts);
        const gr = g.createLinearGradient(0, pts[3][1], 0, pts[0][1]);
        const c = licht(f, V.n(...sd.n), F, { glanz: 0.5 });
        gr.addColorStop(0, rgb(plus(c, [14, 14, 12]))); gr.addColorStop(0.5, rgb(c)); gr.addColorStop(1, rgb(skal(c, 0.72)));
        g.fillStyle = gr; g.fill();
        if (s > 45) {
          /* Profillinie */
          const L = (p, q, k) => [p[0] + (q[0] - p[0]) * k, p[1] + (q[1] - p[1]) * k];
          g.strokeStyle = rgb(skal(c, 0.55), 0.8); g.lineWidth = Math.max(0.4, s * 0.003);
          const p1 = L(pts[0], pts[3], 0.45), p2 = L(pts[1], pts[2], 0.45);
          g.beginPath(); g.moveTo(p1[0], p1[1]); g.lineTo(p2[0], p2[1]); g.stroke();
        }
      }
      /* --- geschweiftes Dach (zwei Neigungen), mit Schnee --- */
      const dachFarbe = f;
      const unten = stumpf(K.zd0, K.d0, K.zd1, K.d1), oben = stumpf(K.zd1, K.d1, K.zd2, K.d2);
      /* Traufkante des Dachs: kurzer senkrechter Rand */
      for (const sd of stumpf(K.zs1, K.d0, K.zd0, K.d0)) {
        if (sichtbar(V, sd.n) <= 0) continue;
        flaeche(sd.e, rgb(skal(licht(f, V.n(...sd.n), F), 0.9)));
      }
      /* Gusseisen, dunkel lackiert: breite, schwache Glanzkeule und ein
         weicher Verlauf je Fläche – so bleibt die Lackfarbe lesbar (kein
         Weiß-Schwarz-Origami). Im Winter liegt Schnee nur auf der flacheren
         unteren Stufe als Kappe; die steile obere Stufe bleibt frei, nur an
         den Graten halten sich schmale Schneelinien. */
      for (let nr = 0; nr < 2; nr++) {
        for (const sd of nr ? oben : unten) {
          if (sichtbar(V, sd.n) <= 0) continue;
          const nk = V.n(...sd.n);
          const pts = sd.e.map(P);
          vieleck(g, pts);
          const c = licht(dachFarbe, nk, F, { glanz: 0.35, exp: 1.5, ab: 0.3 });
          const gr = g.createLinearGradient(0, pts[3][1], 0, pts[0][1]);
          gr.addColorStop(0, rgb(plus(c, [9, 9, 8]))); gr.addColorStop(1, rgb(skal(c, 0.88)));
          g.fillStyle = gr; g.fill();
          if (winter && A.schmuck && nr === 0) {
            const sc = licht([242, 246, 253], nk, F);
            const L = (p, q, k) => [p[0] + (q[0] - p[0]) * k, p[1] + (q[1] - p[1]) * k];
            const rngS = ST.zufall(7 + ((o.saat | 0) % 11) + sd.d[0] * 3 + sd.d[1] * 5);
            const rand = [];
            for (let j = 0; j <= 6; j++) { const u = j / 6; const oben = L(pts[3], pts[2], u), unten = L(pts[0], pts[1], u); rand.push(L(oben, unten, 0.08 + rngS() * 0.18 + (j === 0 || j === 6 ? 0.2 : 0))); }
            g.beginPath(); g.moveTo(pts[0][0], pts[0][1]);
            for (const q of rand) g.lineTo(q[0], q[1]);
            g.lineTo(pts[1][0], pts[1][1]); g.closePath();
            const gs = g.createLinearGradient(0, rand[3][1], 0, pts[0][1]);
            gs.addColorStop(0, rgb(skal(sc, 0.94))); gs.addColorStop(0.35, rgb(sc)); gs.addColorStop(1, rgb(plus(sc, [4, 4, 4])));
            g.fillStyle = gs; g.fill();
          }
        }
      }
      /* Grate (Kanten zwischen den Dachflächen) */
      if (s > 20) {
        g.strokeStyle = rgb(licht(plus(f, [30, 30, 30]), [0, 0, 1], F, { glanz: 0.4 }), 0.6);
        g.lineWidth = Math.max(0.4, s * 0.004);
        for (let k = 0; k < 4; k++) {
          const a = Math.PI / 4 + k * Math.PI / 2, cx = Math.cos(a) * Math.SQRT2, cy = Math.sin(a) * Math.SQRT2;
          if (V.tiefe(cx, cy, 0) < -0.2) continue;
          const p0 = V.p(cx * K.d0, cy * K.d0, K.zd0), p1 = V.p(cx * K.d1, cy * K.d1, K.zd1), p2 = V.p(cx * K.d2, cy * K.d2, K.zd2);
          g.beginPath();
          if (winter && A.schmuck) g.moveTo(p1[0], p1[1]); else { g.moveTo(p0[0], p0[1]); g.lineTo(p1[0], p1[1]); }
          g.lineTo(p2[0], p2[1]); g.stroke();
        }
      }
      if (winter && A.schmuck && s > 14) {
        /* schmale Schneelinien auf den Graten der oberen Stufe */
        g.lineCap = "round"; g.lineWidth = Math.max(0.6, 0.011 * s);
        g.strokeStyle = rgb(licht([244, 247, 253], [0, 0, 1], F));
        for (let k = 0; k < 4; k++) {
          const a = Math.PI / 4 + k * Math.PI / 2, cx = Math.cos(a) * Math.SQRT2, cy = Math.sin(a) * Math.SQRT2;
          if (V.tiefe(cx, cy, 0) < -0.2) continue;
          const p1 = V.p(cx * K.d1, cy * K.d1, K.zd1), p2 = V.p(cx * K.d2 * 1.4, cy * K.d2 * 1.4, K.zd2 - 0.02);
          g.beginPath(); g.moveTo(p1[0], p1[1] - 0.004 * s); g.lineTo(p2[0], p2[1] - 0.004 * s); g.stroke();
        }
      }
      /* Schneehaube: dicker, weicher Wulst an der Traufe – die sichtbaren
         Kanten als EIN Zug (sonst stehen an den Ecken Enden über) */
      if (winter && A.schmuck) {
        const rng = ST.zufall(31 + ((o.saat | 0) % 7));
        const kante = [];
        for (let k = 0; k < 4; k++) { const a = Math.PI / 4 + k * Math.PI / 2; kante.push([Math.cos(a) * Math.SQRT2 * (K.d0 + 0.006), Math.sin(a) * Math.SQRT2 * (K.d0 + 0.006), K.zd0 + 0.012]); }
        const sicht = [];
        for (let k = 0; k < 4; k++) { const a = kante[k], b = kante[(k + 1) % 4]; sicht.push(dot(V.n((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 0), AUGE) > 0.02); }
        let start = 0;
        for (let k = 0; k < 4; k++) if (sicht[k] && !sicht[(k + 3) % 4]) start = k;
        const zug = [], kanten = [];
        for (let j = 0; j < 4; j++) { const k = (start + j) % 4; if (!sicht[k]) break; if (!zug.length) zug.push(kante[k]); zug.push(kante[(k + 1) % 4]); kanten.push(k); }
        if (zug.length > 1) {
          const bp = zug.map(P), d = Math.max(1, 0.036 * s);
          g.lineJoin = "round"; g.lineCap = "butt";
          g.strokeStyle = rgb(licht([206, 218, 238], [0.3, 0.6, -0.3], F)); g.lineWidth = d;
          g.beginPath(); bp.forEach((p, i) => (i ? g.lineTo(p[0], p[1] + d * 0.28) : g.moveTo(p[0], p[1] + d * 0.28))); g.stroke();
          g.strokeStyle = rgb(licht([248, 250, 255], [0.1, 0.4, 0.9], F)); g.lineWidth = d * 0.78;
          g.beginPath(); bp.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.stroke();
          if (s > 25) {
            /* kleine Überhänge und zwei, drei feine Eiszapfen */
            for (const k of kanten) {
              const a = kante[k], b = kante[(k + 1) % 4];
              const nk = V.n((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, -0.2);
              for (let j = 0; j < 2; j++) {
                const u = 0.2 + rng() * 0.6, p = P([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2]]);
                g.fillStyle = rgb(licht([238, 243, 252], nk, F));
                g.beginPath(); g.ellipse(p[0], p[1] + d * 0.5, d * (0.45 + rng() * 0.4), d * 0.36, 0, 0, Math.PI); g.fill();
              }
              if (s > 40) {
                for (let j = 0; j < 2; j++) {
                  const u = 0.12 + rng() * 0.76, p = P([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] - 0.028]);
                  const l = (0.025 + rng() * 0.05) * s, bb = Math.max(0.45, 0.0055 * s);
                  const gr = g.createLinearGradient(p[0] - bb, 0, p[0] + bb, 0);
                  gr.addColorStop(0, "rgba(180,208,236,0.45)"); gr.addColorStop(0.4, "rgba(248,252,255,0.9)"); gr.addColorStop(1, "rgba(150,182,218,0.4)");
                  g.fillStyle = gr;
                  g.beginPath(); g.moveTo(p[0] - bb, p[1]); g.quadraticCurveTo(p[0] - bb * 0.3, p[1] + l * 0.6, p[0], p[1] + l); g.quadraticCurveTo(p[0] + bb * 0.3, p[1] + l * 0.6, p[0] + bb, p[1]); g.fill();
                }
              }
            }
          }
        }
      }
    }
    if (A.hut > 0) {
      /* --- Entlüftung, Hut, Kugel, Spitze (als kleiner Drehkörper) --- */
      const oben = [[K.zh0, K.rh], [K.zh1, K.rh * 0.9], [K.zh1, K.rk * 0.7], [K.zk, K.rk], [K.zk, K.rk * 0.95], [K.zk + 0.012, K.rk * 0.55], [K.zk + 0.03, 0.02], [K.zs - 0.02, 0.012], [K.zs - 0.022, 0.012]];
      drehkoerper(g, V, F, oben, f, 9, { glanz: 0.8, exp: 2.5 });
      const k = V.p(0, 0, K.zs), rk = Math.max(0.8, 0.024 * s);
      const gk = g.createRadialGradient(k[0] - rk * 0.4, k[1] - rk * 0.45, rk * 0.1, k[0], k[1], rk);
      gk.addColorStop(0, rgb(licht(plus(f, [50, 50, 50]), nrm([-0.4, 0.6, 0.7]), F, { glanz: 1.4 })));
      gk.addColorStop(1, rgb(licht(f, [0.6, 0.6, -0.2], F)));
      g.fillStyle = gk; g.beginPath(); g.arc(k[0], k[1], rk, 0, TAU); g.fill();
      const sp = V.p(0, 0, K.zsp);
      g.fillStyle = rgb(licht(f, [0.2, 0.5, 0.4], F, { glanz: 0.8 }));
      g.beginPath(); g.moveTo(k[0] - rk * 0.35, k[1] - rk * 0.8); g.lineTo(sp[0], sp[1]); g.lineTo(k[0] + rk * 0.35, k[1] - rk * 0.8); g.closePath(); g.fill();
      if (winter && A.schmuck) {
        /* Schneekäppchen auf dem Hut */
        const h = V.p(0, 0, K.zk + 0.015), rh = K.rk * s;
        g.fillStyle = rgb(licht([246, 249, 255], [0, 0, 1], F));
        g.beginPath(); g.ellipse(h[0], h[1], rh * 1.02, rh * 0.52, 0, 0, TAU); g.fill();
        g.beginPath(); g.ellipse(h[0], h[1] - rh * 0.1, rh * 0.8, rh * 0.5, 0, Math.PI, 0); g.fill();
      }
    }
  }

  /* =====================================================================
     SCHMUCK: Tannenzweige mit roter Schleife (Winter), Blumenampel (Frühling)
     ===================================================================== */
  const ZWEIG = { a: Math.PI / 4, z: 2.45 };
  function zweigDaten(saat) {
    const rng = ST.zufall(saat * 7 + 3);
    const zweige = [];
    /* Bündel: die meisten Zweige hängen nach unten und fächern auf, zwei kurze nach oben */
    const n = 13;
    for (let i = 0; i < n; i++) {
      const auf = i >= n - 3;
      const quer = ((i * 5) % (n - 3) / (n - 4) - 0.5) * 1.7 + (rng() - 0.5) * 0.3;
      zweige.push({
        quer: auf ? [0.55, -0.5, 0.05][i - (n - 3)] : quer,
        vor: 0.3 + rng() * 0.4,
        hoch: auf ? 0.6 + rng() * 0.25 : -(0.6 + rng() * 0.5),
        l: auf ? 0.2 + rng() * 0.1 : 0.3 + rng() * 0.24,
        dunkel: 0.85 + rng() * 0.3, saat: (rng() * 1e6) | 0
      });
    }
    return zweige;
  }
  /* Tannenzweig-Bündel. Jeder Zweig wird an der Mastachse geteilt: was
     (waagerecht gesehen) hinter der Achse liegt, malt teil = "hinten" vor
     dem Mast, der Rest teil = "vorn" danach – so werden keine Nadeln mehr
     an der Mastkante senkrecht abgeschnitten, egal aus welchem Winkel. */
  function zweigMalen(g, V, F, D, teil) {
    const s = V.s, a = ZWEIG.a;
    const o = [Math.cos(a), Math.sin(a), 0], t = [-Math.sin(a), Math.cos(a), 0];
    const P0 = aufMast(a, ZWEIG.z, 0.012);
    const k = ST.lichtFaktor(V.n(o[0] * 0.5, o[1] * 0.5, 0.85), F.Z, 0, F.jahr);
    const kW = k;
    const nadelL = 0.04;
    const fein = s * nadelL > 1.8;
    const rel = (q) => V.tiefe(q[0], q[1], 0);            // < 0: hinter der Mastachse
    const meins = (q0, q1) => { const r = rel([(q0[0] + q1[0]) / 2, (q0[1] + q1[1]) / 2]); return teil === "hinten" ? r < 0 : r >= 0; };
    /* Stücke eines Zuges, die zu diesem Teil gehören */
    const stuecke = (pts) => {
      const aus = []; let lauf = null;
      for (let j = 0; j < pts.length - 1; j++) {
        if (meins(pts[j], pts[j + 1])) { if (!lauf) { lauf = [pts[j]]; aus.push(lauf); } lauf.push(pts[j + 1]); }
        else lauf = null;
      }
      return aus;
    };
    const liste = D.map((d) => {
      const dir = nrm([o[0] * d.vor + t[0] * d.quer, o[1] * d.vor + t[1] * d.quer, d.hoch]);
      const spitze = [P0[0] + dir[0] * d.l, P0[1] + dir[1] * d.l, P0[2] + dir[2] * d.l];
      return { d: d, dir: dir, t: V.tiefe(spitze[0], spitze[1], spitze[2]) };
    }).sort((x, y) => x.t - y.t);
    g.lineCap = "round";
    /* Ein Nadelzweig entlang einer Bildlinie: Stiel, zwei Nadelreihen */
    const nadelzweig = (bp, lang0, gruen, hell, rng) => {
      if (bp.length < 2) return;
      if (!fein) {
        g.strokeStyle = rgb(gruen); g.lineWidth = Math.max(0.8, lang0 * 1.6);
        g.beginPath(); bp.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.stroke();
        g.strokeStyle = rgb(hell, 0.55); g.lineWidth = Math.max(0.5, lang0 * 0.7);
        g.beginPath(); bp.forEach((p, i) => (i ? g.lineTo(p[0], p[1] - lang0 * 0.3) : g.moveTo(p[0], p[1] - lang0 * 0.3))); g.stroke();
        return;
      }
      g.strokeStyle = rgb(mul([86, 64, 42], kW)); g.lineWidth = Math.max(0.5, 0.007 * s);
      g.beginPath(); bp.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.stroke();
      g.lineWidth = Math.max(0.45, 0.0042 * s);
      const pfade = [new Path2D(), new Path2D(), new Path2D()];
      const n = bp.length - 1;
      for (let j = 0; j < n; j++) {
        const p = bp[j], q = bp[j + 1];
        const dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy) || 1;
        const ex = dx / L, ey = dy / L, nx = -ey, ny = ex;
        const m = Math.max(2, Math.round(L / Math.max(0.8, 0.007 * s)));
        for (let i = 0; i < m; i++) {
          const u = i / m, x = p[0] + dx * u, y = p[1] + dy * u;
          const lang = lang0 * (0.85 + rng() * 0.3);
          for (const sd of [-1, 1]) {
            const pf = pfade[rng() < 0.5 ? 0 : rng() < 0.5 ? 1 : 2];
            pf.moveTo(x, y);
            pf.lineTo(x + (nx * sd * 0.8 + ex * 0.55) * lang, y + (ny * sd * 0.8 + ey * 0.55) * lang);
          }
        }
      }
      [gruen, misch(gruen, hell, 0.55), misch(gruen, hell, 0.9)].forEach((c, i) => { g.strokeStyle = rgb(c); g.stroke(pfade[i]); });
    };
    const schneeAuf = (bp, rng, dichte) => {
      if (F.jahr !== "winter") return;
      g.fillStyle = rgb(mul([246, 249, 255], k), 0.95);
      for (let j = 0; j < bp.length - 1; j++) {
        if (rng() > dichte) continue;
        const p = bp[j], q = bp[j + 1];
        const w = Math.atan2(q[1] - p[1], q[0] - p[0]);
        g.beginPath(); g.ellipse(p[0] + (q[0] - p[0]) * 0.5, p[1] + (q[1] - p[1]) * 0.5 - nadelL * s * 0.45, Math.max(0.7, 0.028 * s), Math.max(0.45, 0.011 * s), Math.abs(Math.cos(w)) > 0.3 ? w : 0, 0, TAU); g.fill();
      }
    };
    const P = (q) => V.p(q[0], q[1], q[2]);
    for (const z of liste) {
      const { d, dir } = z;
      const pts = [];
      for (let j = 0; j <= 8; j++) {
        const u = j / 8, l = d.l * u;
        pts.push([P0[0] + dir[0] * l, P0[1] + dir[1] * l, P0[2] + dir[2] * l - 0.05 * u * u * (d.hoch > 0 ? -0.5 : 1)]);
      }
      /* Nadellänge nimmt zur Spitze ab: je Stück aus der Lage im Zweig */
      const gruen = mul([34 * d.dunkel, 70 * d.dunkel, 44 * d.dunkel], kW);
      const hell = mul([62, 110, 66], kW);
      for (const [u, sd] of [[0.3, 1], [0.45, -1], [0.6, 1], [0.72, -1]]) {
        const i = Math.round(u * 8), q0 = pts[i];
        const w = sd * 0.62;
        const sdir = nrm([dir[0] * Math.cos(w) + t[0] * Math.sin(w) * 0.9, dir[1] * Math.cos(w) + t[1] * Math.sin(w) * 0.9, dir[2] * Math.cos(w) + 0.08]);
        const l = d.l * (0.42 - u * 0.25);
        const sp = [];
        for (let j = 0; j <= 4; j++) sp.push([q0[0] + sdir[0] * l * j / 4, q0[1] + sdir[1] * l * j / 4, q0[2] + sdir[2] * l * j / 4 - 0.02 * (j / 4) * (j / 4)]);
        for (const st of stuecke(sp)) {
          const rng = ST.zufall(d.saat + i * 13);
          const bp = st.map(P);
          nadelzweig(bp, nadelL * s * 0.8, skal(gruen, 0.94), hell, rng);
          schneeAuf(bp, rng, 0.45);
        }
      }
      for (const st of stuecke(pts)) {
        const rng = ST.zufall(d.saat + st.length);
        const bp = st.map(P);
        nadelzweig(bp, nadelL * s, gruen, hell, rng);
        schneeAuf(bp, rng, 0.5);
      }
    }
    /* zwei Kiefernzapfen */
    for (const [q, h] of [[-0.05, -0.1], [0.04, -0.14]]) {
      const w = [P0[0] + t[0] * q + o[0] * 0.05, P0[1] + t[1] * q + o[1] * 0.05, P0[2] + h];
      if ((rel(w) < 0) !== (teil === "hinten")) continue;
      const p = P(w);
      const rz = Math.max(0.8, 0.022 * s);
      const gz = g.createLinearGradient(p[0] - rz, 0, p[0] + rz, 0);
      gz.addColorStop(0, rgb(mul([150, 104, 60], k))); gz.addColorStop(1, rgb(mul([80, 52, 30], k)));
      g.fillStyle = gz; g.beginPath(); g.ellipse(p[0], p[1], rz * 0.75, rz * 1.35, 0, 0, TAU); g.fill();
      if (s > 45) {
        g.strokeStyle = rgb(mul([60, 38, 22], k), 0.7); g.lineWidth = Math.max(0.4, s * 0.0025);
        for (let i = -2; i <= 2; i++) { g.beginPath(); g.moveTo(p[0] - rz * 0.7, p[1] + i * rz * 0.45); g.lineTo(p[0] + rz * 0.7, p[1] + i * rz * 0.45 + rz * 0.2); g.stroke(); }
      }
    }
    /* Satinband: zweimal um Mast und Bündel gewickelt – aus jedem Winkel
       sieht man Rot; die hintere Hälfte verdeckt der Mast */
    if (teil === "vorn") bandMalen(g, V, F, a);
    /* Schleife vor dem Bündel */
    const M0 = [P0[0] + o[0] * 0.045, P0[1] + o[1] * 0.045, P0[2] + 0.015];
    if ((rel(M0) < 0) === (teil === "hinten")) schleifeMalen(g, V, F, M0, o, t);
  }
  const BAND = { z0: 2.4, z1: 2.56, runden: 2, b: 0.032 };
  function bandMalen(g, V, F, aZweig) {
    const s = V.s, rot = [178, 16, 30];
    const N = 56;
    const pt = (i, dz) => {
      const u = i / N, th = aZweig + Math.PI * 0.35 + u * TAU * BAND.runden, z = BAND.z0 + (BAND.z1 - BAND.z0) * u;
      const buckel = 0.028 * Math.pow(Math.max(0, Math.cos(th - aZweig)), 2);   // über die Zweigenden am Bündel
      const r = radiusBei(z) + 0.005 + buckel;
      return { th: th, p: V.p(Math.cos(th) * r, Math.sin(th) * r, z + dz) };
    };
    for (let i = 0; i < N; i++) {
      const a0 = pt(i, BAND.b / 2), a1 = pt(i + 1, BAND.b / 2), b1 = pt(i + 1, -BAND.b / 2), b0 = pt(i, -BAND.b / 2);
      const thm = (a0.th + a1.th) / 2;
      const nk = V.n(Math.cos(thm), Math.sin(thm), 0.12);
      if (dot(nk, AUGE) <= 0.02) continue;
      vieleck(g, [a0.p, a1.p, b1.p, b0.p]);
      g.fillStyle = rgb(licht(rot, nk, F, { glanz: 0.7, exp: 3, ab: 0.35 })); g.fill();
    }
    if (s > 30) {
      /* Satinkanten: feine dunkle Säume oben und unten */
      g.strokeStyle = rgb(mul([90, 8, 16], ST.lichtFaktor([0.5, 0.5, 0.3], F.Z, 0, F.jahr)), 0.6); g.lineWidth = Math.max(0.4, 0.003 * s);
      for (const dz of [BAND.b / 2, -BAND.b / 2]) {
        g.beginPath(); let an = false;
        for (let i = 0; i <= N; i++) { const q = pt(i, dz); const nk = V.n(Math.cos(q.th), Math.sin(q.th), 0); if (dot(nk, AUGE) <= 0.02) { an = false; continue; } if (an) g.lineTo(q.p[0], q.p[1]); else { g.moveTo(q.p[0], q.p[1]); an = true; } }
        g.stroke();
      }
    }
  }
  /* Rote Satinschleife aus echten Flächen: zwei Schlaufen, je um 35° aus
     der Tangentialebene nach außen gedreht (so ist aus jedem Winkel
     mindestens eine schräg zu sehen), zwei hängende Bänder mit
     Schwalbenschwanz und ein Knoten. Rückseiten dunkler. */
  function schleifeMalen(g, V, F, M0, o, t) {
    const s = V.s;
    const rot = [184, 18, 32];
    const w35 = 35 * Math.PI / 180, w18 = 18 * Math.PI / 180;
    const ebene = (sd, w) => { const e = [t[0] * sd * Math.cos(w) + o[0] * Math.sin(w), t[1] * sd * Math.cos(w) + o[1] * Math.sin(w), 0]; let n = [-e[1], e[0], 0]; if (n[0] * o[0] + n[1] * o[1] < 0) n = [-n[0], -n[1], 0]; return { e: e, n: n }; };
    const farben = (n, rueck) => {
      const nk = V.n(n[0], n[1], 0.2), vorn = dot(nk, AUGE) > 0;
      const k = ST.lichtFaktor(vorn ? nk : [-nk[0], -nk[1], nk[2]], F.Z, 0, F.jahr);
      const f = vorn && !rueck ? rot : skal(rot, 0.66);
      return { c: mul(f, k), cd: mul(skal(f, 0.62), k), ch: mul(plus(f, [70, 40, 40]), k) };
    };
    /* Bänder */
    const baender = [-1, 1].map((sd) => ({ sd: sd, E: ebene(sd, w18), t: V.tiefe(M0[0] + t[0] * sd * 0.05, M0[1] + t[1] * sd * 0.05, 0) })).sort((x, y) => x.t - y.t);
    for (const B of baender) {
      const F2 = farben(B.E.n);
      g.save(); affin(g, V, M0, B.E.e, [0, 0, -1]);
      g.fillStyle = rgb(F2.c);
      g.beginPath();
      g.moveTo(0.004, 0.01); g.quadraticCurveTo(0.04, 0.1, 0.03, 0.25);
      g.lineTo(0.06, 0.268); g.lineTo(0.052, 0.236); g.lineTo(0.075, 0.206);
      g.quadraticCurveTo(0.07, 0.09, 0.03, 0.01); g.closePath(); g.fill();
      g.fillStyle = rgb(F2.cd, 0.5); g.beginPath(); g.moveTo(0.02, 0.02); g.quadraticCurveTo(0.05, 0.12, 0.045, 0.24); g.lineTo(0.052, 0.236); g.quadraticCurveTo(0.06, 0.1, 0.03, 0.01); g.closePath(); g.fill();
      g.restore();
    }
    /* Schlaufen, die hintere zuerst */
    const lw = 0.12, lh = 0.078;
    const schlaufen = [-1, 1].map((sd) => { const E = ebene(sd, w35); return { E: E, t: V.tiefe(M0[0] + E.e[0] * lw * 0.6, M0[1] + E.e[1] * lw * 0.6, 0) }; }).sort((x, y) => x.t - y.t);
    for (const S of schlaufen) {
      const F2 = farben(S.E.n);
      g.save(); affin(g, V, M0, S.E.e, [0, 0, -1]);
      const gr = g.createLinearGradient(0, -lh, 0, lh);
      gr.addColorStop(0, rgb(F2.ch)); gr.addColorStop(0.5, rgb(F2.c)); gr.addColorStop(1, rgb(F2.cd));
      g.fillStyle = gr;
      g.beginPath();
      g.moveTo(0, 0);
      g.bezierCurveTo(lw * 0.4, -lh * 1.3, lw * 1.15, -lh * 1.1, lw, -lh * 0.05);
      g.bezierCurveTo(lw * 1.05, lh * 0.7, lw * 0.4, lh * 0.8, 0, 0);
      g.closePath(); g.fill();
      /* Innenfalte: man sieht in die Schlaufe hinein (dunkle Innenseite) */
      g.fillStyle = rgb(skal(F2.cd, 0.8), 0.85);
      g.beginPath(); g.moveTo(0.004, 0); g.quadraticCurveTo(lw * 0.5, -lh * 0.45, lw * 0.78, -lh * 0.08); g.quadraticCurveTo(lw * 0.5, lh * 0.12, 0.004, 0); g.fill();
      if (F.jahr === "winter" && s > 25) { g.fillStyle = rgb(mul([246, 249, 255], ST.lichtFaktor([0, 0, 1], F.Z, 0, F.jahr)), 0.92); g.beginPath(); g.ellipse(lw * 0.55, -lh * 0.98, lw * 0.28, lh * 0.16, 0.12, 0, TAU); g.fill(); }
      g.restore();
    }
    /* Knoten: kleiner gerundeter Wulst (im Bild gemalt, damit er in jedem
       Winkel Körper hat) */
    const m = V.p(M0[0], M0[1], M0[2]), rk = Math.max(0.8, 0.022 * s);
    const kk = ST.lichtFaktor(V.n(o[0], o[1], 0.3), F.Z, 0, F.jahr);
    const gk = g.createRadialGradient(m[0] - rk * 0.35, m[1] - rk * 0.4, rk * 0.1, m[0], m[1], rk * 1.1);
    gk.addColorStop(0, rgb(mul(plus(rot, [60, 40, 40]), kk))); gk.addColorStop(1, rgb(mul(skal(rot, 0.6), kk)));
    g.fillStyle = gk; g.beginPath(); g.ellipse(m[0], m[1], rk * 0.85, rk, 0, 0, TAU); g.fill();
  }

  /* Blumenampel am geschwungenen Arm (Frühling) */
  const AMPEL = { a: 1.92, z: 2.62, aus: 0.42, zk: 2.1, r: 0.19 };
  function ampelMalen(g, V, F, f, saat, teil) {
    const s = V.s, A = AMPEL, a = A.a;
    const o = [Math.cos(a), Math.sin(a), 0];
    const P = (d, z) => V.p(o[0] * d, o[1] * d, z);
    if (teil === "arm") {
      /* Arm: Flacheisen mit Schnecke, Kette zur Ampel */
      const kf = licht(f, V.n(o[0] * 0.3, o[1] * 0.3, 1), F, { glanz: 0.5 });
      g.strokeStyle = rgb(kf); g.lineWidth = Math.max(0.7, 0.016 * s); g.lineCap = "round";
      const r0 = radiusBei(A.z);
      g.beginPath();
      const p0 = P(r0, A.z), p1 = P(A.aus * 0.5, A.z + 0.02), p2 = P(A.aus, A.z);
      g.moveTo(p0[0], p0[1]); g.quadraticCurveTo(p1[0], p1[1] - 0.03 * s, p2[0], p2[1]); g.stroke();
      /* Strebe darunter mit Schnecke */
      const q0 = P(r0, A.z - 0.22), q1 = P(A.aus * 0.62, A.z - 0.02);
      g.lineWidth = Math.max(0.5, 0.01 * s);
      g.beginPath(); g.moveTo(q0[0], q0[1]); g.quadraticCurveTo(P(A.aus * 0.2, A.z - 0.05)[0], P(A.aus * 0.2, A.z - 0.05)[1], q1[0], q1[1]); g.stroke();
      if (s > 25) {
        const m = P(A.aus * 0.28, A.z - 0.1), rr = 0.045 * s;
        g.beginPath();
        for (let i = 0; i <= 30; i++) { const w = i / 30 * TAU * 1.6, r = rr * (1 - i / 36); const x = m[0] + Math.cos(w) * r, y = m[1] + Math.sin(w) * r * 0.9; if (i) g.lineTo(x, y); else g.moveTo(x, y); }
        g.stroke();
      }
      /* Ketten: drei Stränge zum Korbrand */
      const h = P(A.aus, A.z - 0.02);
      g.strokeStyle = rgb(licht([120, 120, 118], [0.3, 0.6, 0.5], F, { glanz: 0.4 }), 0.95); g.lineWidth = Math.max(0.6, 0.006 * s);
      for (let i = 0; i < 3; i++) {
        const w = i / 3 * TAU + 0.4;
        const q = V.p(o[0] * A.aus + Math.cos(w) * A.r * 0.92, o[1] * A.aus + Math.sin(w) * A.r * 0.92, A.zk + 0.02);
        g.beginPath(); g.moveTo(h[0], h[1]); g.lineTo(q[0], q[1]); g.stroke();
      }
      return;
    }
    /* Hängekorb als Kaskade: Drahtkorb mit Kokoseinlage, obenauf eine
       geschlossene Laubkuppel (die Einlage ist nirgends zu sehen), ringsum
       hängende Triebe, die nach unten schmaler werden. Weniger, dafür
       echte Petunien (Trichter mit hellem Rand, dunklem Schlund, eine
       Seite im Schatten) und Blätter in drei Grüntönen mit Mittelrippe. */
    const m = P(A.aus, A.zk), R = A.r * s;
    const kO = ST.lichtFaktor([0, 0, 1], F.Z, 0, F.jahr);
    const kL = ST.lichtFaktor(V.n(-0.6, 0.6, 0.3), F.Z, 0, F.jahr), kD = ST.lichtFaktor(V.n(0.6, -0.6, 0.1), F.Z, 0, F.jahr);
    const rng = ST.zufall(saat * 13 + 5);
    const BL = [[196, 40, 120], [236, 236, 244], [132, 52, 168], [214, 44, 60], [238, 128, 176]];
    const haupt = BL[saat % BL.length], zweit = BL[(saat + 2) % BL.length];
    const fein = s > 30;
    /* Blätter werden gesammelt und je Ton in EINEM Pfad gefüllt */
    const BLATT = [[42, 80, 34], [62, 110, 44], [92, 142, 58]];
    const sammel = () => ({ p: [new Path2D(), new Path2D(), new Path2D()], rippe: new Path2D(), blueten: [] });
    const blatt = (S, x, y, r, w, ton) => {
      const c = Math.cos(w), sn = Math.sin(w);
      S.p[ton].moveTo(x + c * r, y + sn * r);
      S.p[ton].ellipse(x, y, r, r * 0.55, w, 0, TAU);
      if (fein && r > 1.6) { S.rippe.moveTo(x - c * r * 0.8, y - sn * r * 0.8); S.rippe.lineTo(x + c * r * 0.8, y + sn * r * 0.8); }
    };
    const fuellen = (S, k) => {
      S.p.forEach((pf, i) => { g.fillStyle = rgb(mul(BLATT[i], k)); g.fill(pf); });
      if (fein) { g.strokeStyle = rgb(mul([150, 186, 110], k), 0.45); g.lineWidth = Math.max(0.3, 0.0025 * s); g.stroke(S.rippe); }
      for (const b of S.blueten) blueteMalen(g, b.x, b.y, b.r, b.c, s, b.w, k);
    };
    /* Triebe: von der Korbkante nach außen und dann nach unten hängend */
    const triebe = (vorn) => {
      const S = sammel();
      const n = 14;
      for (let i = 0; i < n; i++) {
        const w = (i + rng() * 0.8) / n * Math.PI + (vorn ? 0 : Math.PI);
        const x0 = m[0] + Math.cos(w) * R * 0.95, y0 = m[1] + Math.sin(w) * R * 0.48;
        const lang = (0.18 + rng() * 0.3) * s * (vorn ? 1 : 0.8), aus = Math.cos(w) * R * (0.25 + rng() * 0.2);
        g.strokeStyle = rgb(mul([60, 96, 40], kO)); g.lineWidth = Math.max(0.4, 0.006 * s);
        g.beginPath(); g.moveTo(x0, y0); g.quadraticCurveTo(x0 + aus * 1.3, y0 + lang * 0.3, x0 + aus * 0.9, y0 + lang); g.stroke();
        const schritte = 8;
        for (let j = 1; j <= schritte; j++) {
          const u = j / schritte, x = x0 + aus * (1.3 * 2 * u * (1 - u) + 0.9 * u * u), y = y0 + lang * (0.6 * u + 0.4 * u * u);
          const r = (0.028 - u * 0.008) * s;
          const lichtSeite = Math.cos(w) < 0.2;
          blatt(S, x + (rng() - 0.5) * 0.03 * s, y, Math.max(0.6, r), rng() * TAU, klemm(Math.floor(rng() * 2 + (lichtSeite ? 1 : 0)), 0, 2));
          blatt(S, x + (rng() - 0.5) * 0.03 * s, y + 0.01 * s, Math.max(0.6, r * 0.9), rng() * TAU, rng() < 0.6 ? 0 : 1);
          if (u < 0.7) blatt(S, x + (rng() - 0.5) * 0.05 * s, y - 0.006 * s, Math.max(0.6, r * 1.05), rng() * TAU, rng() < 0.5 ? 1 : 2);
          if (rng() < (vorn ? 0.3 : 0.2)) S.blueten.push({ x: x + (rng() - 0.5) * 0.02 * s, y: y + 0.012 * s, r: Math.max(0.8, (0.03 + rng() * 0.008) * s), c: rng() < 0.75 ? haupt : zweit, w: 0.5 + rng() * 0.5 });
        }
      }
      return S;
    };
    const hinten = triebe(false);
    fuellen(hinten, skal(kD, 0.9));
    /* Korb: Kokosfaser, Drahtbügel */
    const gk = g.createLinearGradient(m[0] - R, 0, m[0] + R, 0);
    gk.addColorStop(0, rgb(mul([122, 92, 60], kL))); gk.addColorStop(1, rgb(mul([78, 58, 38], kD)));
    g.fillStyle = gk;
    g.beginPath(); g.ellipse(m[0], m[1], R, R * 0.5, 0, 0, Math.PI); g.ellipse(m[0], m[1], R, R * 0.95, 0, Math.PI, 0, true); g.closePath(); g.fill();
    if (fein) {
      g.strokeStyle = rgb(mul([150, 116, 76], kO), 0.55); g.lineWidth = Math.max(0.4, 0.003 * s);
      for (let i = 0; i < 26; i++) { const w = rng() * Math.PI, r = R * (0.3 + rng() * 0.65); const x = m[0] + Math.cos(w) * r, y = m[1] + Math.sin(w) * r * 0.9; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (rng() - 0.5) * 0.03 * s, y + (rng() - 0.5) * 0.02 * s); g.stroke(); }
      g.strokeStyle = rgb(mul([50, 50, 52], kO), 0.9); g.lineWidth = Math.max(0.4, 0.005 * s);
      for (let i = 1; i < 4; i++) { const w = Math.PI * i / 4; g.beginPath(); g.moveTo(m[0] + Math.cos(w) * R, m[1] + Math.sin(w) * R * 0.5); g.quadraticCurveTo(m[0] + Math.cos(w) * R * 0.9, m[1] + R * 0.7, m[0], m[1] + R * 0.95); g.stroke(); }
    }
    /* Laubkuppel: deckt die ganze Korböffnung und wölbt sich darüber */
    const kuppel = sammel();
    g.fillStyle = rgb(mul([34, 64, 28], kO));
    g.beginPath(); g.ellipse(m[0], m[1] - R * 0.08, R * 1.04, R * 0.62, 0, 0, TAU); g.fill();
    for (let i = 0; i < 44; i++) {
      const w = rng() * TAU, r = Math.sqrt(rng()) * R * 1.02;
      const x = m[0] + Math.cos(w) * r, y = m[1] + Math.sin(w) * r * 0.52 - (1 - r / R) * 0.1 * s - 0.02 * s;
      const links = Math.cos(w) < 0.1 && Math.sin(w) < 0.5;
      blatt(kuppel, x, y, Math.max(0.6, 0.03 * s), rng() * TAU, klemm(Math.floor(rng() * 2 + (links ? 1 : 0) + (r < R * 0.5 ? 0.5 : 0)), 0, 2));
    }
    for (let i = 0; i < 9; i++) {
      const w = rng() * TAU, r = Math.sqrt(rng()) * R * 0.95;
      kuppel.blueten.push({ x: m[0] + Math.cos(w) * r, y: m[1] + Math.sin(w) * r * 0.5 - (1 - r / R) * 0.12 * s - 0.035 * s, r: Math.max(0.9, (0.034 + rng() * 0.008) * s), c: rng() < 0.75 ? haupt : zweit, w: 0.2 + rng() * 0.3 });
    }
    kuppel.blueten.sort((p, q) => p.y - q.y);
    fuellen(kuppel, kO);
    fuellen(triebe(true), kL);
  }
  /* Petunie: ein Trichter aus fünf verwachsenen Blütenblättern. Heller,
     leicht gewellter Rand, zum Schlund dunkler (Adern), die zur Sonne
     abgewandte Seite im Schatten. w = wie weit die Blüte zur Seite kippt
     (0 = schaut nach oben, 1 = zur Seite) – dann ist der Trichter oval. */
  function blueteMalen(g, x, y, r, c, s, w, k) {
    const f = k ? mul(c, k) : c;
    if (s < 30) { g.fillStyle = rgb(f); g.beginPath(); g.arc(x, y, r * 0.8, 0, TAU); g.fill(); return; }
    const sy = 0.55 + 0.45 * (1 - (w || 0.3));
    g.save(); g.translate(x, y); g.scale(1, sy);
    const gr = g.createRadialGradient(-r * 0.25, -r * 0.3, r * 0.1, 0, 0, r * 1.05);
    gr.addColorStop(0, rgb(plus(f, [30, 26, 26]))); gr.addColorStop(0.55, rgb(f)); gr.addColorStop(1, rgb(skal(f, 0.72)));
    g.fillStyle = gr;
    g.beginPath();
    for (let i = 0; i <= 10; i++) { const a = i / 10 * TAU, rr = r * (i % 2 ? 0.9 : 1.02); const px = Math.cos(a) * rr, py = Math.sin(a) * rr; if (i) g.quadraticCurveTo(Math.cos(a - TAU / 20) * r * 1.08, Math.sin(a - TAU / 20) * r * 1.08, px, py); else g.moveTo(px, py); }
    g.closePath(); g.fill();
    if (r > 2.5) {
      /* Adern zum Schlund */
      g.strokeStyle = rgb(skal(f, 0.6), 0.5); g.lineWidth = Math.max(0.3, r * 0.05);
      g.beginPath(); for (let i = 0; i < 5; i++) { const a = i / 5 * TAU + 0.3; g.moveTo(Math.cos(a) * r * 0.2, Math.sin(a) * r * 0.2); g.lineTo(Math.cos(a) * r * 0.75, Math.sin(a) * r * 0.75); } g.stroke();
    }
    /* Schlund: dunkler Trichter, etwas zur Lichtseite verschoben (man sieht hinein) */
    const gs = g.createRadialGradient(r * 0.06, r * 0.04, 0, r * 0.06, r * 0.04, r * 0.42);
    gs.addColorStop(0, rgb(skal(f, 0.28))); gs.addColorStop(0.6, rgb(skal(f, 0.5), 0.8)); gs.addColorStop(1, rgb(skal(f, 0.7), 0));
    g.fillStyle = gs; g.beginPath(); g.arc(r * 0.06, r * 0.04, r * 0.42, 0, TAU); g.fill();
    g.fillStyle = "rgba(250,236,150,0.85)"; g.beginPath(); g.arc(r * 0.06, r * 0.04, Math.max(0.3, r * 0.08), 0, TAU); g.fill();
    g.restore();
  }

  /* =====================================================================
     BODEN UM DEN FUSS: Granitplatte, Schneewehe, Gras in den Fugen
     ===================================================================== */
  function fussMalen(g, V, F, saat, schmuck) {
    const s = V.s, winter = F.jahr === "winter";
    const kU = ST.lichtFaktor([0, 0, 1], F.Z, 0, F.jahr);
    const b = 0.35, h = 0.025;
    const ecke = [[-b, -b], [b, -b], [b, b], [-b, b]];
    /* Granitplatte 0,7 × 0,7 m, leicht erhaben im Pflaster – im Winter
       liegt sie unter der Schneewehe */
    if (!(winter && schmuck)) {
      for (let i = 0; i < 4; i++) {
        const a = ecke[i], c = ecke[(i + 1) % 4];
        const nk = V.n((a[0] + c[0]) / 2, (a[1] + c[1]) / 2, 0);
        if (dot(nk, AUGE) <= 0) continue;
        vieleck(g, [V.p(a[0], a[1], h), V.p(c[0], c[1], h), V.p(c[0], c[1], 0), V.p(a[0], a[1], 0)]);
        g.fillStyle = rgb(mul([150, 146, 140], ST.lichtFaktor(nk, F.Z, 0, F.jahr))); g.fill();
      }
      const top = ecke.map((q) => V.p(q[0], q[1], h));
      vieleck(g, top);
      g.fillStyle = rgb(mul([168, 164, 158], kU)); g.fill();
      if (s > 22) {
        /* Granitkörnung */
        g.save(); vieleck(g, top); g.clip();
        const rng = ST.zufall(saat + 17);
        const n = Math.min(260, Math.round(s * 2.2));
        for (let i = 0; i < n; i++) {
          const p = V.p((rng() - 0.5) * 2 * b, (rng() - 0.5) * 2 * b, h);
          const r = rng();
          g.fillStyle = r < 0.35 ? rgb(mul([96, 92, 90], kU), 0.7) : r < 0.6 ? rgb(mul([220, 214, 206], kU), 0.7) : rgb(mul([150, 118, 110], kU), 0.5);
          g.fillRect(p[0], p[1], Math.max(0.5, s * 0.006), Math.max(0.5, s * 0.004));
        }
        g.restore();
      }
      /* Fuge rundherum */
      g.strokeStyle = rgb(mul([70, 66, 62], kU), 0.6); g.lineWidth = Math.max(0.4, s * 0.005);
      vieleck(g, ecke.map((q) => V.p(q[0], q[1], 0.002))); g.stroke();
    }
    if (!schmuck) return;
    if (winter) {
      /* Schnee am Sockel: der Mast steckt gut 5 cm tief im Schnee (der
         Drehkörper beginnt erst bei Z_SCHNEE). Keine eigene Schneefarbe –
         die rät man nie richtig (Dämmerung, Relief, Mondlicht). Den Schnee
         malt der Boden (boden.js); wir tönen ihn nur: eine knappe Kuppe um
         den Sockel, zur Sonne hin etwas heller, abgewandt bläulich wie die
         Schatten der Szene, und ein feiner Kragen, wo der Schnee an den Guss
         stößt. Nachts (kaum Sonne) bleibt davon fast nichts übrig. */
      const m = V.p(0, 0, 0);
      const sonne = klemm((F.Z.sonne[0] + F.Z.sonne[1] + F.Z.sonne[2]) / 1.04, 0, 1);
      const R = 0.34 * s;
      const fleck = (dx, dy, r, farbe, a) => {
        g.save(); g.translate(m[0] + dx, m[1] + dy); g.scale(1, 0.5);
        const gr = g.createRadialGradient(0, 0, r * 0.3, 0, 0, r);
        gr.addColorStop(0, "rgba(" + farbe + "," + a.toFixed(3) + ")"); gr.addColorStop(1, "rgba(" + farbe + ",0)");
        g.fillStyle = gr; g.beginPath(); g.arc(0, 0, r, 0, TAU); g.fill(); g.restore();
      };
      fleck(R * 0.32, -0.01 * s, R * 0.8, "40,62,120", 0.06 + 0.12 * sonne);
      fleck(-R * 0.32, -0.015 * s, R * 0.7, "255,255,255", 0.13 * sonne);
      const c = V.p(0, 0, Z_SCHNEE), rS = (radiusBei(Z_SCHNEE) + 0.012) * s;
      if (s > 12) {
        g.lineWidth = Math.max(0.6, 0.014 * s);
        g.strokeStyle = "rgba(40,62,120," + (0.12 + 0.14 * sonne).toFixed(3) + ")";
        g.beginPath(); g.ellipse(c[0], c[1], rS, rS * 0.5, 0, -0.3 * Math.PI, 0.55 * Math.PI); g.stroke();
        g.strokeStyle = "rgba(255,255,255," + (0.03 + 0.2 * sonne).toFixed(3) + ")";
        g.beginPath(); g.ellipse(c[0], c[1], rS, rS * 0.5, 0, 0.55 * Math.PI, 1.15 * Math.PI); g.stroke();
      }
    } else {
      /* frisches Gras und ein paar Gänseblümchen in der Fuge */
      const rng = ST.zufall(saat + 9);
      if (s < 14) return;
      g.lineCap = "round";
      for (let i = 0; i < 46; i++) {
        const seite = (rng() * 4) | 0, u = rng() * 2 - 1;
        const x = seite === 0 ? -b : seite === 1 ? b : u * b, y = seite === 2 ? -b : seite === 3 ? b : u * b;
        const p = V.p(x, y, 0);
        const l = (0.03 + rng() * 0.06) * s;
        g.strokeStyle = rgb(mul([72 + rng() * 30, 128 + rng() * 30, 50], kU));
        g.lineWidth = Math.max(0.4, s * 0.004);
        g.beginPath(); g.moveTo(p[0], p[1]); g.quadraticCurveTo(p[0] + (rng() - 0.5) * l, p[1] - l * 0.6, p[0] + (rng() - 0.5) * l * 0.8, p[1] - l); g.stroke();
        if (rng() < 0.08 && s > 30) {
          const q = [p[0] + (rng() - 0.5) * 0.02 * s, p[1] - l];
          g.fillStyle = rgb(mul([250, 250, 246], kU));
          for (let j = 0; j < 8; j++) { const w = j / 8 * TAU; g.beginPath(); g.ellipse(q[0] + Math.cos(w) * 0.008 * s, q[1] + Math.sin(w) * 0.004 * s, 0.006 * s, 0.003 * s, w, 0, TAU); g.fill(); }
          g.fillStyle = rgb(mul([240, 200, 40], kU)); g.beginPath(); g.arc(q[0], q[1], 0.004 * s, 0, TAU); g.fill();
        }
      }
    }
  }

  /* Baugrube (Bauphase): Öffnung beschnitten, Wände, Sohle, Beton */
  function grubeMalen(g, V, F, b, tiefe, fuell) {
    const s = V.s, Z = F.Z, jahr = F.jahr;
    const loch = [[-b, -b], [b, -b], [b, b], [-b, b]];
    const oben = loch.map((q) => V.p(q[0], q[1], 0));
    const boden = fuell != null && fuell > -tiefe ? fuell : -tiefe;
    const beton = fuell != null && fuell > -tiefe + 0.01;
    /* Erdwall rund um die Grube (ausgehobene Erde) */
    const kU = ST.lichtFaktor([0, 0, 1], Z, 0, jahr);
    const rng = ST.zufall(5);
    /* Aushub als Haufen neben der Grube: runde Kuppen, oben hell, unten dunkel */
    const haufen = [];
    for (let i = 0; i < 7; i++) { const w = -0.6 + rng() * 1.6, r = b + 0.28 + rng() * 0.18; haufen.push({ x: Math.cos(w) * r, y: Math.sin(w) * r, r: 0.14 + rng() * 0.12 }); }
    haufen.sort((p, q) => V.tiefe(p.x, p.y, 0) - V.tiefe(q.x, q.y, 0));
    for (const hf of haufen) {
      const p = V.p(hf.x, hf.y, 0), R = hf.r * s;
      const gr = g.createRadialGradient(p[0] - R * 0.3, p[1] - R * 0.55, R * 0.1, p[0], p[1] - R * 0.2, R * 1.05);
      gr.addColorStop(0, rgb(mul([132, 104, 76], kU))); gr.addColorStop(0.7, rgb(mul([98, 74, 54], kU))); gr.addColorStop(1, rgb(mul([70, 52, 38], kU)));
      g.fillStyle = gr;
      g.beginPath(); g.ellipse(p[0], p[1], R, R * 0.5, 0, 0, Math.PI); g.ellipse(p[0], p[1], R, R * 0.8, 0, Math.PI, 0); g.fill();
      if (s > 30) { g.fillStyle = rgb(mul([150, 140, 124], kU), 0.7); for (let j = 0; j < 5; j++) { g.beginPath(); g.arc(p[0] + (rng() - 0.5) * R * 1.4, p[1] - rng() * R * 0.6, Math.max(0.5, 0.012 * s), 0, TAU); g.fill(); } }
    }
    g.save();
    vieleck(g, oben); g.clip();
    const sohle = loch.map((q) => V.p(q[0], q[1], boden));
    vieleck(g, sohle);
    g.fillStyle = rgb(mul(beton ? [170, 168, 160] : [92, 70, 52], skal(kU, beton ? 0.92 : 0.6))); g.fill();
    for (let i = 0; i < 4; i++) {
      const a = loch[i], c = loch[(i + 1) % 4];
      const mx = (a[0] + c[0]) / 2, my = (a[1] + c[1]) / 2;
      const nk = V.n(-mx, -my, 0);
      if (dot(nk, AUGE) <= 0.001) continue;
      const k = ST.lichtFaktor(nk, Z, 0, jahr);
      const q = [V.p(a[0], a[1], 0), V.p(c[0], c[1], 0), V.p(c[0], c[1], boden), V.p(a[0], a[1], boden)];
      vieleck(g, q);
      const gr = g.createLinearGradient(0, q[0][1], 0, q[3][1]);
      gr.addColorStop(0, rgb(mul([118, 90, 64], skal(k, 0.85)))); gr.addColorStop(1, rgb(mul([70, 52, 38], skal(k, 0.55))));
      g.fillStyle = gr; g.fill();
      if (s > 20) {
        g.fillStyle = "rgba(170,160,140,0.6)";
        for (let j = 0; j < 10; j++) { const u = rng(), zz = boden * rng(); const p = V.p(a[0] + (c[0] - a[0]) * u, a[1] + (c[1] - a[1]) * u, zz); g.beginPath(); g.arc(p[0], p[1], Math.max(0.5, s * 0.012), 0, TAU); g.fill(); }
      }
    }
    if (beton && boden > -0.25) {
      /* Ankerschrauben ragen aus dem frischen Beton */
      for (const [x, y] of [[-0.1, -0.1], [0.1, -0.1], [0.1, 0.1], [-0.1, 0.1]]) {
        const a = V.p(x, y, boden), c = V.p(x, y, boden + 0.08);
        g.strokeStyle = "#5b5e63"; g.lineWidth = Math.max(0.6, 0.016 * s);
        g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(c[0], c[1]); g.stroke();
      }
    }
    g.restore();
  }

  /* =====================================================================
     SCHATTEN — flach auf den Boden gelegt, EIN Pfad
     ===================================================================== */
  function schattenMalen(g, s, F, A) {
    const V = blick(F.gier || 0, s);
    const m = g.getTransform();
    g.save();
    g.setTransform(1, 0, 0, 1, m.e, m.f);
    g.fillStyle = "#000";
    g.beginPath();
    /* Mast: Kreise entlang der Höhe, verbunden */
    const zMax = A.zMast;
    let alt = null;
    for (const [z, r] of PROFIL) {
      if (z > zMax + 1e-6) break;
      const c = V.boden(0, 0, z);
      if (alt) {
        const dx = c[0] - alt.c[0], dy = c[1] - alt.c[1], L = Math.hypot(dx, dy);
        if (L > 0.3) {
          const nx = -dy / L, ny = dx / L;
          const h0 = Math.hypot(alt.r * s * nx, alt.r * s * 0.5 * ny), h1 = Math.hypot(r * s * nx, r * s * 0.5 * ny);
          dazu(g, [[alt.c[0] + nx * h0, alt.c[1] + ny * h0], [c[0] + nx * h1, c[1] + ny * h1], [c[0] - nx * h1, c[1] - ny * h1], [alt.c[0] - nx * h0, alt.c[1] - ny * h0]]);
        }
      }
      alt = { c: c, r: r };
    }
    for (const z of [0, 0.3, 0.57, 0.76, 0.9, 1.06]) if (z <= zMax) dazu(g, kreisBoden(V, 0, 0, z, radiusBei(Math.max(0.001, z)), 14));
    if (A.haken && zMax >= HAKEN.z) {
      const a = V.boden(-HAKEN.l, 0, HAKEN.z), b = V.boden(HAKEN.l, 0, HAKEN.z);
      const w = HAKEN.r * s;
      dazu(g, [[a[0], a[1] - w], [b[0], b[1] - w], [b[0], b[1] + w], [a[0], a[1] + w]]);
      for (const x of [-HAKEN.l, HAKEN.l]) dazu(g, kreisBoden(V, x, 0, HAKEN.z, 0.028, 10));
    }
    const K = KOPF;
    if (A.kopf > 0) {
      /* Eckstäbe und Rahmen des Glaskörpers */
      for (let k = 0; k < 4; k++) {
        const a = Math.PI / 4 + k * Math.PI / 2, cx = Math.cos(a) * Math.SQRT2, cy = Math.sin(a) * Math.SQRT2;
        const u = V.boden(cx * K.b0, cy * K.b0, K.zg0), o = V.boden(cx * K.b1, cy * K.b1, K.zg1);
        const dx = o[0] - u[0], dy = o[1] - u[1], L = Math.hypot(dx, dy) || 1, w = Math.max(0.5, 0.013 * s);
        dazu(g, [[u[0] - dy / L * w, u[1] + dx / L * w], [o[0] - dy / L * w, o[1] + dx / L * w], [o[0] + dy / L * w, o[1] - dx / L * w], [u[0] + dy / L * w, u[1] - dx / L * w]]);
      }
      const ring = (b, z, w) => {
        const pts = [];
        for (let k = 0; k < 4; k++) { const a = Math.PI / 4 + k * Math.PI / 2; pts.push(V.boden(Math.cos(a) * Math.SQRT2 * b, Math.sin(a) * Math.SQRT2 * b, z)); }
        for (let k = 0; k < 4; k++) {
          const p = pts[k], q = pts[(k + 1) % 4];
          const dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy) || 1;
          dazu(g, [[p[0] - dy / L * w, p[1] + dx / L * w], [q[0] - dy / L * w, q[1] + dx / L * w], [q[0] + dy / L * w, q[1] - dx / L * w], [p[0] + dy / L * w, p[1] - dx / L * w]]);
        }
      };
      ring(K.b0, K.zg0, Math.max(0.6, 0.02 * s));
      /* Bodenrahmen voll */
      const e = [];
      for (const [b, z] of [[K.bb, K.zb0], [K.bb, K.zb1]]) for (let k = 0; k < 4; k++) { const a = Math.PI / 4 + k * Math.PI / 2; e.push(V.boden(Math.cos(a) * Math.SQRT2 * b, Math.sin(a) * Math.SQRT2 * b, z)); }
      dazu(g, huelle(e));
    }
    if (A.dach > 0) {
      /* Gesims und Dach: voller Körper */
      const e = [];
      for (const [b, z] of [[K.s0, K.zs0], [K.d0, K.zd0], [K.d1, K.zd1], [K.d2, K.zd2]]) for (let k = 0; k < 4; k++) { const a = Math.PI / 4 + k * Math.PI / 2; e.push(V.boden(Math.cos(a) * Math.SQRT2 * b, Math.sin(a) * Math.SQRT2 * b, z)); }
      e.push(V.boden(0, 0, K.zk + 0.03));
      dazu(g, huelle(e));
    }
    if (A.hut > 0) {
      dazu(g, kreisBoden(V, 0, 0, K.zk, K.rk, 12));
      const a = V.boden(0, 0, K.zk), b = V.boden(0, 0, K.zsp), w = 0.012 * s;
      dazu(g, [[a[0], a[1] - w], [b[0], b[1] - w], [b[0], b[1] + w], [a[0], a[1] + w]]);
      dazu(g, kreisBoden(V, 0, 0, K.zs, 0.024, 10));
    }
    if (A.schmuck && F.jahr === "winter") {
      /* Tannenzweig-Bündel: ein paar Kleckse */
      const a = ZWEIG.a, o = [Math.cos(a), Math.sin(a)], t = [-o[1], o[0]];
      for (const [q, h, r] of [[0, -0.05, 0.1], [-0.12, -0.2, 0.09], [0.12, -0.2, 0.09], [0, -0.3, 0.09], [0, 0.1, 0.06]]) {
        const x = o[0] * 0.12 + t[0] * q, y = o[1] * 0.12 + t[1] * q;
        dazu(g, kreisBoden(V, x, y, ZWEIG.z + h, r, 10));
      }
    }
    if (A.schmuck && F.jahr !== "winter") {
      const a = AMPEL.a, o = [Math.cos(a), Math.sin(a)];
      dazu(g, kreisBoden(V, o[0] * AMPEL.aus, o[1] * AMPEL.aus, AMPEL.zk, AMPEL.r * 1.15, 14));
      dazu(g, kreisBoden(V, o[0] * AMPEL.aus, o[1] * AMPEL.aus, AMPEL.zk - 0.15, AMPEL.r * 0.9, 12));
      const p = V.boden(0, 0, AMPEL.z), q = V.boden(o[0] * AMPEL.aus, o[1] * AMPEL.aus, AMPEL.z), w = 0.008 * s;
      dazu(g, [[p[0], p[1] - w], [q[0], q[1] - w], [q[0], q[1] + w], [p[0], p[1] + w]]);
    }
    g.fill();
    g.restore();
  }

  /* Schattenspitze in Modellkoordinaten (für die Bildgrenzen des Sprites) */
  function schaetzeGier(o) {
    return ((o.objekt && o.objekt.gier) || 0) + ((ST.kamera && ST.kamera.dreh) || 0) * 90;
  }

  /* =====================================================================
     DAS MODELL
     ===================================================================== */
  ST.modell("laterne", {
    name: "Gaslaterne", gruppe: "Deko", grund: [0.8, 0.8], hoehe: 4.4, bauzeit: 60,
    bauen: function (M, o) {
      const bau = o.bau == null ? 1 : o.bau;
      const saat = Math.abs(o.saat | 0) || 1;
      const winter = o.jahr === "winter";
      const farbe = FARBEN[saat % FARBEN.length].f;
      const nummer = 100 + (saat * 37) % 800;
      /* Bauphasen */
      const A = {
        grube: bau < 0.3,
        zMast: bau < 0.3 ? 0 : bau < 0.42 ? Z_SOCKEL : bau < 0.54 ? Z_SCHAFT : Z_MAST,
        haken: bau >= 0.54,
        kopf: bau >= 0.64 ? 1 : 0,
        dach: bau >= 0.64 ? 1 : 0,
        hut: bau >= 0.72 ? 1 : 0,
        glas: bau >= 0.82 ? 1 : 0,
        innen: bau >= 0.9 ? 1 : 0,
        schmuck: bau >= 1,
        licht: bau >= 1
      };
      const D = zweigDaten(saat);
      const figur = {
        x: 0, y: 0, z: 0, breite: 1.4, hoehe: 4.5,
        malen: mitGier(function (g, s, F) {
          if (F.schatten) { if (!A.grube || A.zMast > 0) schattenMalen(g, s, F, A); return; }
          const V = blick(F.gier || 0, s);
          const gierRad = (F.gier || 0) * Math.PI / 180;
          if (A.grube) {
            /* Grube (0 … 0,2), Beton steigt (0,2 … 0,3) */
            grubeMalen(g, V, F, 0.42, 1.0, bau < 0.18 ? null : -1.0 + 1.0 * phase(bau, 0.18, 0.29));
            return;
          }
          fussMalen(g, V, F, saat, A.schmuck);
          /* Anbauten hinter dem Mast zuerst */
          const tiefeAchse = V.tiefe(0, 0, 0);
          const ampelHinten = V.tiefe(Math.cos(AMPEL.a), Math.sin(AMPEL.a), 0) < tiefeAchse;
          const hakenHinten = V.tiefe(1, 0, 0) < tiefeAchse ? 1 : -1;
          if (A.haken) hakenMalen(g, V, F, farbe, hakenHinten, winter && A.schmuck);
          if (A.schmuck && winter) zweigMalen(g, V, F, D, "hinten");
          if (A.schmuck && !winter && ampelHinten) { ampelMalen(g, V, F, farbe, saat, "arm"); ampelMalen(g, V, F, farbe, saat, "korb"); }
          /* Mast */
          const zFuss = winter && A.schmuck ? Z_SCHNEE : 0;
          drehkoerper(g, V, F, PROFIL, farbe, A.zMast, { glanz: 0.55, exp: 2.2, ab: 0.5, schneeAufStufen: winter, flamme: A.licht ? 0.25 : 0, zMin: zFuss });
          if (s > 44) {
            /* Gusshaut: feine Unebenheiten und Lackglanz (beschnitten auf den Mast) */
            g.save(); mastPfad(g, V, PROFIL, A.zMast, zFuss); g.clip();
            PI.rauschen(g, -0.3 * s, -A.zMast * s, 0.6 * s, (A.zMast + 0.3) * s, 0.7 * s, 0.22, 7 + (saat % 5), 4);
            g.restore();
          }
          if (A.zMast >= Z_SCHAFT) rillenMalen(g, V, F, gierRad, farbe);
          tuerMalen(g, V, F, farbe);
          if (A.zMast >= Z_SCHAFT) nummerMalen(g, V, F, nummer);
          if (A.haken) hakenMalen(g, V, F, farbe, -hakenHinten, winter && A.schmuck);
          if (A.kopf > 0) kopfMalen(g, V, F, farbe, A, o);
          if (A.schmuck && winter) zweigMalen(g, V, F, D, "vorn");
          if (A.schmuck && !winter && !ampelHinten) { ampelMalen(g, V, F, farbe, saat, "arm"); ampelMalen(g, V, F, farbe, saat, "korb"); }
        })
      };
      M.teil("laterne", { mitte: [0, 0, 1] });
      M.figur(figur);
      /* Licht: großer weicher Schein, kleiner heller Kern, Lichtpfütze */
      const zeit = ST.szene && ST.szene.zeit;
      if (A.licht && zeit !== "tag") {
        M.licht(0, 0, Z_LICHT, 4.6, "255,194,120", 0.5);
        M.licht(0, 0, Z_LICHT, 0.8, "255,238,196", 0.95);
        /* Lichtpfütze auf dem Boden (M.bodenlicht, addierend über dem Schnee –
           nicht mehr im eigenen Bild, sonst wäre sie auf blauem Schnee fast
           unsichtbar, tönte alles dahinter und machte beim Antippen einen
           Kreis von 2 m um den Fuß zur Laterne).
           Wie bei einer echten Gasleuchte: direkt unter dem Kopf ein
           dunklerer Fleck (Bodenrahmen und Mast halten das Licht ab, etwa
           1 m), darum ein heller Ring, weich auslaufend bis 3,5 m. */
        for (let i = 0; i < 8; i++) { const w = i / 8 * TAU + 0.2; M.bodenlicht(Math.cos(w) * 1.3, Math.sin(w) * 1.3, 1.45, "255,202,134", 0.26); }
        for (let i = 0; i < 6; i++) { const w = i / 6 * TAU + 0.5; M.bodenlicht(Math.cos(w) * 2.3, Math.sin(w) * 2.3, 2.4, "255,186,110", 0.15); }
      }
      /* Unsichtbare Hülle: das Sprite muss den langen Schatten mit fassen */
      M.teil("huelle", { schatten: false, mitte: [0, 0, -50] });
      const leer = { malen: null, keinLicht: true, keinAo: true };
      const hr = 0.45;
      M.flaeche(Object.assign({ name: "huelle", o: [-hr, -hr, 0], u: [1, 0, 0], v: [0, 1, 0], w: 2 * hr, h: 2 * hr }, leer));
      const H = A.kopf ? 4.42 : Math.max(0.2, A.zMast);
      const sx = -LICHT[0] / LICHT[2] * H, sy = -LICHT[1] / LICHT[2] * H;
      const gr = schaetzeGier(o) * Math.PI / 180, c = Math.cos(gr), sn = Math.sin(gr);
      const x = sx * c + sy * sn, y = -sx * sn + sy * c;
      M.flaeche(Object.assign({ name: "huelle-schatten", o: [x - 0.4, y - 0.4, 0], u: [1, 0, 0], v: [0, 1, 0], w: 0.8, h: 0.8 }, leer));
    }
  });
})();
