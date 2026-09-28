/* =====================================================================
   BAUKASTEN-STADT — DER HIMMEL: WEIHNACHTSMANN MIT RENTIERSCHLITTEN
   ---------------------------------------------------------------------
   XANDER: „Ich möchte einen Liebreiz zur Weihnachtsdeko … dieses
   Weihnachtsdorf … mit Schmücken, mit Schnee, mit Santa Claus, der
   animiert durch den Himmel fliegt, alles dabei. Das möchte ich in
   Perfektion." – „Das soll keine Comic Grafik sein. Das soll noch viel
   mehr am Realismus dran sein." – „ohne Pixelkanten und komische
   Vektorrückstände."

   WAS HIER FLIEGT
   Etwa jede Minute zieht der Weihnachtsmann in rund 40 m Höhe in einer
   weiten Kurve über Winterhausen: vorneweg Rudolph mit der roten,
   leuchtenden Nase, dahinter acht Rentiere in vier Paaren im echten
   Galopp (die Beine greifen im Wechsel), Kummet und Bauchgurt mit
   Glöckchen, Mittelleine und Zugstränge, der Schlitten mit geschwungenen
   Kufen, Laternen und Goldzier, der Weihnachtsmann im roten Mantel mit
   Pelz, Bart und Zipfelmütze, hinter ihm der Sack voller Geschenke.
   Beim Überflug winkt er hinunter. Hinter dem Schlitten funkelt eine
   Sternenspur, und der Schatten des Gespanns gleitet weich über den
   Schnee – genau dort, wo die Sonne ihn hinwirft (dieselbe Richtung wie
   bei den Häusern). Nur im Winter; der erste Flug etwa 22 s nach dem
   Öffnen, dann ungefähr jede Minute (14 s lang), mit Schlittenglöckchen
   (ST.ton("schlitten")). Die Bahn wird bei Flugbeginn so gelegt, dass sie
   durch das Bild führt, das man gerade ansieht – danach bleibt sie fest
   in der Welt. In 40 m Höhe liegt etwas mehr Himmelslicht auf dem
   Gespann; nachts leuchten die Schlittenlaternen den Weihnachtsmann an.

   IM FRÜHLING („… dass wir das später in einen Frühlingsgewand packen
   können"): statt des Schlittens segeln drei Weißstörche über das Dorf
   (tagsüber und in der Dämmerung, nicht nachts).

   WIE GEZEICHNET WIRD – „ST.gestalt" (auch für die Menschen im Dorf)
   Alles Lebendige ist ein kleines echtes 3D-Modell aus Ellipsoiden,
   Kapseln (Hülle zweier Kugeln), Bändern und Platten. Die Kamera ist
   orthografisch: eine Kugel wird im Bild ein Kreis, ein Ellipsoid eine
   Ellipse – exakt berechnet, also bei jeder Zoomstufe eine glatte
   Vektorkante. Jeder Körper wird nach seinen Normalen mit demselben
   Licht schattiert wie die Häuser (ST.lichtFaktor): Kugeln mit einem
   Verlauf vom Glanzpunkt zur Schattenseite, Glieder quer zur Achse wie
   ein Zylinder. Die Teile werden von hinten nach vorn gemalt. Darum
   stimmt jede Blickrichtung, jede Tageszeit – ohne eine Bilddatei.
   Kurz zur Benutzung (siehe modelle/menschen.js):
     const B = new ST.gestalt.Buehne({ s, X0, Y0, Z, jahr, lampen });
     B.rahmen(ST.gestalt.modellRahmen(P.c, P.sn)); B.gruppe(tiefe);
     B.kugel(c, r, farbe) · B.ei(c, a1, a2, a3, farbe) · B.glied(p1, r1, p2, r2, farbe)
     B.koerper([{c, r}|{c, a:[a1,a2,a3]}…], farbe, { flecken, glanz, tiefe, ebene })
     B.band(punkte, breite, farbe) · B.platte(punkte, farbe, { n, innen, muster })
     B.malen(g) · B.schattenMalen(sg)
   Detailstufen nach Pixeln je Meter (B.s): klein nur die Form, groß
   Augen, Glöckchen, Goldzier, Knöpfe, Fellzeichnung.

   PRÜFBILDER (URL-Parameter)
     santa=0.5        Flugphase 0…1 erzwingen (unabhängig von der Zeit)
     santakurs=45     gerade Bahn durch die Bildmitte, Kurs im Bild
                      (0 = nach rechts, 90 = auf den Betrachter zu …)
     santahoehe=40    Flughöhe dazu
     santatest=galopp Galopp-Bogen: ein Rentier in acht Phasen
                      (santagier=… dreht die Ansicht)
     storch=0.5       Störche im Frühling erzwingen (wie santa)
   In der Werkbank fliegt nichts, außer „santa" bzw. „storch" ist gesetzt.
   ===================================================================== */
(function () {
  "use strict";
  const ST = (window.STADT = window.STADT || {});
  const K = ST.kamera;
  const KX = ST.KX, KY = ST.KY, KZ = ST.KZ, AUGE = ST.ZUM_AUGE, LICHT = ST.LICHT;
  const TAU = Math.PI * 2;
  const q = new URLSearchParams(location.search);

  /* ---------------- kleine Vektorhilfen ---------------- */
  function plus(a, b) { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
  function minus(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
  function mal(a, k) { return [a[0] * k, a[1] * k, a[2] * k]; }
  function pkt(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function kreuz(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function einheit(a) { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
  function mix(a, b, k) { return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]; }
  function klemm(x, a, b) { return x < a ? a : x > b ? b : x; }
  function glatt(a, b, x) { const t = klemm((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }
  /* Catmull-Rom: aus wenigen Stützpunkten eine weiche Kurve (2D oder 3D) */
  function kurve(pts, n) {
    const aus = [], d = pts[0].length;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
      for (let k = 0; k < n; k++) {
        const t = k / n, t2 = t * t, t3 = t2 * t, q = [];
        for (let a = 0; a < d; a++) q.push(0.5 * (2 * p1[a] + (-p0[a] + p2[a]) * t + (2 * p0[a] - 5 * p1[a] + 4 * p2[a] - p3[a]) * t2 + (-p0[a] + 3 * p1[a] - 3 * p2[a] + p3[a]) * t3));
        aus.push(q);
      }
    }
    aus.push(pts[pts.length - 1].slice());
    return aus;
  }

  /* Bildrichtungen im Kameraraum: rechts (R1) und unten (R2), je Länge 1.
     Die Abbildung ist eine echte orthografische Projektion mit gleichem
     Maßstab in beide Richtungen – Kugeln werden Kreise. */
  const R1 = [KX, -KX, 0], R2 = [KY, KY, -KZ];
  const MB = [R1, R2];
  /* Schattenwurf: Punkt entlang des Sonnenlichts auf den Boden, dann ins Bild */
  const LA = -LICHT[0] / LICHT[2], LB = -LICHT[1] / LICHT[2];
  const MS = [[KX, -KX, (LA - LB) * KX], [KY, KY, (LA + LB) * KY]];
  /* Die Sonne im Bild: hellster Punkt einer Kugel */
  const LSX = pkt(LICHT, R1), LSY = pkt(LICHT, R2);
  const HL = Math.hypot(LSX, LSY), HDX = LSX / HL, HDY = LSY / HL, RAD = HL + 1;
  /* Normalen entlang der Linie Glanzpunkt → gegenüberliegender Rand */
  const KUGEL = [0, 0.12, 0.26, 0.4, 0.54, 0.68, 0.8, 0.9, 1].map(function (f) {
    const d = HL - f * RAD, px = HDX * d, py = HDY * d, w = Math.sqrt(Math.max(0, 1 - px * px - py * py));
    return { f: f, n: einheit([px * R1[0] + py * R2[0] + w * AUGE[0], px * R1[1] + py * R2[1] + w * AUGE[1], px * R1[2] + py * R2[2] + w * AUGE[2]]) };
  });
  const QUER = [-1, -0.8, -0.5, -0.2, 0.15, 0.5, 0.8, 1];

  function rgbAus(alb, f, a) {
    const r = Math.min(255, alb[0] * f[0]) | 0, g = Math.min(255, alb[1] * f[1]) | 0, b = Math.min(255, alb[2] * f[2]) | 0;
    return a == null ? "rgb(" + r + "," + g + "," + b + ")" : "rgba(" + r + "," + g + "," + b + "," + a + ")";
  }

  /* Konvexe Hülle (monotone Kette) einer flachen Punktliste [x0,y0,x1,y1,…] */
  function huelle(f) {
    const n = f.length / 2, idx = new Array(n);
    for (let i = 0; i < n; i++) idx[i] = i;
    idx.sort((a, b) => f[2 * a] - f[2 * b] || f[2 * a + 1] - f[2 * b + 1]);
    const kr = (o, a, b) => (f[2 * a] - f[2 * o]) * (f[2 * b + 1] - f[2 * o + 1]) - (f[2 * a + 1] - f[2 * o + 1]) * (f[2 * b] - f[2 * o]);
    const lo = [], hi = [];
    for (const i of idx) { while (lo.length >= 2 && kr(lo[lo.length - 2], lo[lo.length - 1], i) <= 0) lo.pop(); lo.push(i); }
    for (let k = idx.length - 1; k >= 0; k--) { const i = idx[k]; while (hi.length >= 2 && kr(hi[hi.length - 2], hi[hi.length - 1], i) <= 0) hi.pop(); hi.push(i); }
    hi.pop(); lo.pop();
    return lo.concat(hi);
  }

  /* Ellipsoid (Mitte c, Halbachsen a[0..2] oder Kugel r) → Ellipse im Bild */
  function ellipse(e, M, s, X0, Y0) {
    const C = e.c;
    const cx = X0 + (M[0][0] * C[0] + M[0][1] * C[1] + M[0][2] * C[2]) * s;
    const cy = Y0 + (M[1][0] * C[0] + M[1][1] * C[1] + M[1][2] * C[2]) * s;
    if (e.r != null && M === MB) return { cx: cx, cy: cy, r1: e.r * s, r2: e.r * s, phi: 0 };
    const A = e.a || [[e.r, 0, 0], [0, e.r, 0], [0, 0, e.r]];
    let p = 0, qq = 0, r = 0;
    for (let i = 0; i < 3; i++) {
      const a = A[i];
      const u = M[0][0] * a[0] + M[0][1] * a[1] + M[0][2] * a[2], v = M[1][0] * a[0] + M[1][1] * a[1] + M[1][2] * a[2];
      p += u * u; qq += u * v; r += v * v;
    }
    const m = (p + r) / 2, d = Math.sqrt((p - r) * (p - r) / 4 + qq * qq);
    return { cx: cx, cy: cy, r1: Math.sqrt(m + d) * s, r2: Math.sqrt(Math.max(0, m - d)) * s, phi: 0.5 * Math.atan2(2 * qq, p - r) };
  }
  function ellipsePunkte(e, n, aus) {
    const c = Math.cos(e.phi), s = Math.sin(e.phi);
    for (let i = 0; i < n; i++) {
      const w = i / n * TAU, x = e.r1 * Math.cos(w), y = e.r2 * Math.sin(w);
      aus.push(e.cx + c * x - s * y, e.cy + s * x + c * y);
    }
  }
  /* Umriss eines Körpers (eine Ellipse oder Hülle mehrerer) als Pfad */
  function koerperPfad(g, ells) {
    if (ells.length === 1) {
      const e = ells[0];
      g.ellipse(e.cx, e.cy, Math.max(0.2, e.r1), Math.max(0.2, e.r2), e.phi, 0, TAU);
      return;
    }
    const f = [];
    for (const e of ells) ellipsePunkte(e, Math.max(12, Math.min(48, Math.ceil(e.r1 * 0.7))), f);
    const h = huelle(f);
    g.moveTo(f[2 * h[0]], f[2 * h[0] + 1]);
    for (let i = 1; i < h.length; i++) g.lineTo(f[2 * h[i]], f[2 * h[i] + 1]);
    g.closePath();
  }

  /* =====================================================================
     DIE BÜHNE — sammelt Körper, sortiert sie, malt Bild und Schatten
     ===================================================================== */
  function Buehne(o) {
    this.s = o.s; this.X0 = o.X0; this.Y0 = o.Y0;
    this.SX0 = o.SX0 == null ? o.X0 : o.SX0; this.SY0 = o.SY0 == null ? o.Y0 : o.SY0;
    this.Z = o.Z; this.jahr = o.jahr || "winter";
    this.lampen = o.lampen || null;
    this.gruppen = []; this.gr = null; this.glanz = [];
    this.R = { o: [0, 0, 0], x: [1, 0, 0], y: [0, 1, 0], z: [0, 0, 1] };
    this.gruppe(0);
  }
  const BP = Buehne.prototype;
  /* Eine Gruppe = ein Ding (Rentier, Schlitten, Mensch); Gruppen werden
     als Ganzes nach Tiefe sortiert, ihre Teile nach Ebene und Tiefe. */
  BP.gruppe = function (tiefe) { this.gr = { tiefe: tiefe || 0, teile: [] }; this.gruppen.push(this.gr); return this.gr; };
  BP.rahmen = function (R) { this.R = R; return this; };
  /* lokaler Punkt / lokale Richtung → Kameraraum */
  BP.pk = function (l) { const R = this.R; return [R.o[0] + l[0] * R.x[0] + l[1] * R.y[0] + l[2] * R.z[0], R.o[1] + l[0] * R.x[1] + l[1] * R.y[1] + l[2] * R.z[1], R.o[2] + l[0] * R.x[2] + l[1] * R.y[2] + l[2] * R.z[2]]; };
  BP.rk = function (l) { const R = this.R; return [l[0] * R.x[0] + l[1] * R.y[0] + l[2] * R.z[0], l[0] * R.x[1] + l[1] * R.y[1] + l[2] * R.z[1], l[0] * R.x[2] + l[1] * R.y[2] + l[2] * R.z[2]]; };
  BP.bild = function (p) { return [this.X0 + pkt(R1, p) * this.s, this.Y0 + pkt(R2, p) * this.s]; };
  BP.tiefeVon = function (p) { return pkt(p, AUGE); };
  /* Licht auf einer Normalen (Kameraraum) an einer Stelle: Sonne und
     Himmel wie bei den Häusern, dazu warme Lampen in der Nähe */
  BP.licht = function (n, p) {
    const f = ST.lichtFaktor(n, this.Z, 0, this.jahr);
    if (this.lampen && p) {
      for (const L of this.lampen) {
        const d = minus(L.p, p), l = Math.hypot(d[0], d[1], d[2]);
        if (l >= L.r) continue;
        const w = (1 - l / L.r) * (1 - l / L.r) * L.k * Math.max(0, 0.3 + 0.7 * pkt(n, d) / (l || 1));
        f[0] += L.farbe[0] * w; f[1] += L.farbe[1] * w; f[2] += L.farbe[2] * w;
      }
    }
    return f;
  };

  /* ---- Körper ---- */
  BP.koerper = function (liste, alb, opt) {
    opt = opt || {};
    const E = [];
    let m = [0, 0, 0];
    for (const e of liste) {
      const c = this.pk(e.c);
      E.push({ c: c, r: e.r, a: e.a ? [this.rk(e.a[0]), this.rk(e.a[1]), this.rk(e.a[2])] : null });
      m = plus(m, c);
    }
    m = mal(m, 1 / E.length);
    const t = { art: "k", E: E, alb: alb, opt: opt, m: m, ebene: opt.ebene || 0, tiefe: pkt(m, AUGE) + (opt.tiefe || 0) };
    if (opt.flecken) t.flecken = opt.flecken.map((fl) => ({ c: this.pk(fl.c), a: [this.rk(fl.a[0]), this.rk(fl.a[1]), this.rk(fl.a[2])], alb: fl.alb, n: fl.n ? einheit(this.rk(fl.n)) : null, k: fl.k == null ? 1 : fl.k, hart: fl.hart || 0 }));
    this.gr.teile.push(t);
    return t;
  };
  BP.kugel = function (c, r, alb, opt) { return this.koerper([{ c: c, r: r }], alb, opt); };
  BP.ei = function (c, a1, a2, a3, alb, opt) { return this.koerper([{ c: c, a: [a1, a2, a3] }], alb, opt); };
  BP.glied = function (p1, r1, p2, r2, alb, opt) { return this.koerper([{ c: p1, r: r1 }, { c: p2, r: r2 }], alb, opt); };
  /* Band: Riemen, Leine, Geweihstange (Polylinie, Breite in Metern) */
  BP.band = function (pts, breite, alb, opt) {
    opt = opt || {};
    const P = pts.map((p) => this.pk(p));
    let m = [0, 0, 0]; for (const p of P) m = plus(m, p); m = mal(m, 1 / P.length);
    const t = { art: "b", P: P, breite: breite, breite2: opt.breite2 == null ? breite : opt.breite2, alb: alb, opt: opt, m: m, ebene: opt.ebene || 0, tiefe: pkt(m, AUGE) + (opt.tiefe || 0), n: opt.n ? einheit(this.rk(opt.n)) : null };
    this.gr.teile.push(t);
    return t;
  };
  /* Platte: ebenes Vieleck; opt.n = Außennormale (lokal), opt.innen = Farbe der Rückseite */
  BP.platte = function (pts, alb, opt) {
    opt = opt || {};
    const P = pts.map((p) => this.pk(p));
    let m = [0, 0, 0]; for (const p of P) m = plus(m, p); m = mal(m, 1 / P.length);
    let n = opt.n ? einheit(this.rk(opt.n)) : einheit(kreuz(minus(P[1], P[0]), minus(P[2], P[0])));
    const t = { art: "p", P: P, alb: alb, opt: opt, m: m, n: n, ebene: opt.ebene || 0, tiefe: pkt(m, AUGE) + (opt.tiefe || 0) };
    if (opt.muster) t.lok = { o: this.pk(opt.ursprung || [0, 0, 0]), u: this.rk(opt.u || [1, 0, 0]), v: this.rk(opt.v || [0, 0, 1]) };
    this.gr.teile.push(t);
    return t;
  };
  /* Eigenes Malen an einer Stelle (Dampf, Funken) */
  BP.eigen = function (c, fn, opt) {
    opt = opt || {};
    const p = this.pk(c);
    const t = { art: "e", fn: fn, m: p, opt: opt, ebene: opt.ebene || 0, tiefe: pkt(p, AUGE) + (opt.tiefe || 0) };
    this.gr.teile.push(t);
    return t;
  };
  /* Lichtschein (addierend, nach allem) */
  BP.leuchte = function (c, r, farbe, k) { this.glanz.push({ p: this.pk(c), r: r, farbe: farbe, k: k }); };

  /* ---- Malen ---- */
  BP.malen = function (g) {
    this.gruppen.sort((a, b) => a.tiefe - b.tiefe);
    for (const gr of this.gruppen) {
      gr.teile.sort((a, b) => a.ebene - b.ebene || a.tiefe - b.tiefe);
      for (const t of gr.teile) {
        if (t.art === "k") this.koerperMalen(g, t);
        else if (t.art === "b") this.bandMalen(g, t);
        else if (t.art === "p") this.platteMalen(g, t);
        else if (t.art === "e") { g.save(); t.fn(g, this, t); g.restore(); }
      }
    }
    this.glanzMalen(g);
  };

  BP.koerperMalen = function (g, t) {
    const s = this.s, ells = t.E.map((e) => ellipse(e, MB, s, this.X0, this.Y0));
    let groesste = ells[0];
    for (const e of ells) if (e.r1 > groesste.r1) groesste = e;
    if (groesste.r1 < 0.25) return;
    g.beginPath();
    koerperPfad(g, ells);
    const alb = t.alb, o = t.opt;
    if (o.leucht) {
      /* selbstleuchtend (Laternenglas, Rudolphs Nase) */
      g.fillStyle = "rgb(" + (alb[0] | 0) + "," + (alb[1] | 0) + "," + (alb[2] | 0) + ")";
      g.fill();
      return;
    }
    const kl = Math.max(groesste.r1, 1);
    if (kl < 1.6 || o.flach) {
      /* sehr klein: eine Farbe (Mittelwert), spart Verläufe */
      g.fillStyle = rgbAus(alb, this.licht(KUGEL[3].n, t.m));
      g.fill();
    } else {
      let achse = null;
      if (ells.length > 1) {
        const a = minus(t.E[t.E.length - 1].c, t.E[0].c), la = Math.hypot(a[0], a[1], a[2]);
        if (la > 1e-4) {
          const A = mal(a, 1 / la), vp = minus(AUGE, mal(A, pkt(AUGE, A))), lv = Math.hypot(vp[0], vp[1], vp[2]);
          if (lv > 0.35) achse = { A: A, Vp: mal(vp, 1 / lv) };
        }
      }
      if (achse) {
        /* wie ein Zylinder: quer zur Achse von der Licht- zur Schattenseite */
        const S = einheit(kreuz(achse.A, achse.Vp));
        let sx = pkt(S, R1), sy = pkt(S, R2); const ls = Math.hypot(sx, sy) || 1; sx /= ls; sy /= ls;
        let cx = 0, cy = 0, w = 0;
        for (const e of ells) {
          cx += e.cx; cy += e.cy;
          const wa = Math.atan2(sy, sx) - e.phi;
          w = Math.max(w, Math.hypot(e.r1 * Math.cos(wa), e.r2 * Math.sin(wa)));
        }
        cx /= ells.length; cy /= ells.length;
        const gr = g.createLinearGradient(cx - sx * w, cy - sy * w, cx + sx * w, cy + sy * w);
        for (const tq of QUER) {
          const n = plus(mal(S, tq), mal(achse.Vp, Math.sqrt(1 - tq * tq)));
          gr.addColorStop((tq + 1) / 2, rgbAus(alb, this.licht(n, t.m)));
        }
        g.fillStyle = gr;
        g.fill();
      } else {
        /* wie eine Kugel: Verlauf vom Glanzpunkt zur Schattenseite */
        const e = groesste, c = Math.cos(-e.phi), sn = Math.sin(-e.phi);
        const hx = (c * HDX - sn * HDY) * HL, hy = (sn * HDX + c * HDY) * HL;
        g.save();
        g.translate(e.cx, e.cy); g.rotate(e.phi); g.scale(Math.max(0.2, e.r1), Math.max(0.2, e.r2));
        const gr = g.createRadialGradient(hx, hy, 0, hx, hy, RAD);
        for (const k of KUGEL) gr.addColorStop(k.f, rgbAus(alb, this.licht(k.n, t.m)));
        g.fillStyle = gr;
        g.fill();
        g.restore();
      }
    }
    /* Flecken: hellere oder dunklere Fellpartien, weich, im Umriss */
    if (t.flecken && kl > 3) {
      g.save(); g.clip();
      for (const fl of t.flecken) {
        const e = ellipse(fl, MB, s, this.X0, this.Y0);
        if (e.r1 < 0.5) continue;
        const f = this.licht(fl.n || KUGEL[2].n, fl.c);
        g.save();
        g.translate(e.cx, e.cy); g.rotate(e.phi); g.scale(Math.max(0.3, e.r1), Math.max(0.3, e.r2));
        const gr = g.createRadialGradient(0, 0, 0, 0, 0, 1);
        /* hart = schärfere Kante (Haaransatz, Nähte), sonst weich verlaufend */
        const h = fl.hart;
        gr.addColorStop(0, rgbAus(fl.alb, f, fl.k)); gr.addColorStop(0.55 + 0.35 * h, rgbAus(fl.alb, f, fl.k * (0.75 + 0.25 * h))); gr.addColorStop(1, rgbAus(fl.alb, f, 0));
        g.fillStyle = gr;
        g.fillRect(-1, -1, 2, 2);
        g.restore();
      }
      g.restore();
    }
    if (o.glanz && kl > 1.2) {
      /* Glanzlicht (Metall, Glocken, Lack) */
      const e = groesste, k = o.glanz * (0.35 + 0.65 * (this.Z.sonne[0] / 0.4));
      const x = e.cx + HDX * e.r1 * 0.45, y = e.cy + HDY * e.r2 * 0.45, r = Math.max(0.6, e.r1 * 0.38);
      const gr = g.createRadialGradient(x, y, 0, x, y, r);
      gr.addColorStop(0, "rgba(255,252,240," + klemm(k, 0, 1).toFixed(3) + ")"); gr.addColorStop(1, "rgba(255,252,240,0)");
      g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r);
    }
    if (o.kontur && kl > 2) {
      g.lineWidth = Math.max(0.5, o.kontur * s);
      g.strokeStyle = "rgba(20,14,10,0.28)";
      g.beginPath(); koerperPfad(g, ells); g.stroke();
    }
  };

  BP.bandMalen = function (g, t) {
    const s = this.s;
    const n = t.n || einheit(plus(AUGE, [0, 0, 0.6]));
    const f = t.opt.leucht ? [1, 1, 1] : this.licht(n, t.m);
    const farbe = rgbAus(t.alb, f);
    g.lineCap = "round"; g.lineJoin = "round"; g.strokeStyle = farbe;
    const pts = t.P.map((p) => this.bild(p));
    if (t.breite2 === t.breite) {
      let b = t.breite * s;
      if (b < 0.25) return;
      g.globalAlpha = b < 0.9 ? b / 0.9 : 1;
      g.lineWidth = Math.max(0.9, b);
      g.beginPath(); g.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]);
      g.stroke();
      g.globalAlpha = 1;
    } else {
      const N = pts.length - 1;
      for (let i = 0; i < N; i++) {
        const b = (t.breite + (t.breite2 - t.breite) * (i + 0.5) / N) * s;
        if (b < 0.25) continue;
        g.globalAlpha = b < 0.9 ? b / 0.9 : 1;
        g.lineWidth = Math.max(0.9, b);
        g.beginPath(); g.moveTo(pts[i][0], pts[i][1]); g.lineTo(pts[i + 1][0], pts[i + 1][1]); g.stroke();
      }
      g.globalAlpha = 1;
    }
    if (t.opt.glanz && t.breite * s > 1.6) {
      /* feine Glanzkante auf Metall */
      g.strokeStyle = "rgba(255,246,214," + (0.45 * t.opt.glanz * (0.3 + this.Z.sonne[0] / 0.4 * 0.7)).toFixed(3) + ")";
      g.lineWidth = Math.max(0.5, t.breite * s * 0.3);
      g.beginPath();
      const dx = HDX * t.breite * s * 0.22, dy = HDY * t.breite * s * 0.22;
      g.moveTo(pts[0][0] + dx, pts[0][1] + dy);
      for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0] + dx, pts[i][1] + dy);
      g.stroke();
    }
  };

  BP.platteMalen = function (g, t) {
    let n = t.n, alb = t.alb;
    const sicht = pkt(n, AUGE);
    if (sicht <= 0) {
      if (!t.opt.innen && !t.opt.beidseitig) return;
      n = mal(n, -1);
      if (t.opt.innen) alb = t.opt.innen;
    }
    const pts = t.P.map((p) => this.bild(p));
    g.beginPath(); g.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]);
    g.closePath();
    g.fillStyle = t.opt.leucht ? "rgb(" + (alb[0] | 0) + "," + (alb[1] | 0) + "," + (alb[2] | 0) + ")" : rgbAus(alb, this.licht(n, t.m));
    g.fill();
    if (t.opt.kante && this.s > 20) { g.strokeStyle = t.opt.kante; g.lineWidth = Math.max(0.5, this.s * 0.012); g.stroke(); }
    if (t.opt.muster && t.lok && sicht > 0) {
      /* Zier in der Fläche: lokale Ebene (u nach rechts, v nach oben) affin ins Bild */
      const L = t.lok, O = this.bild(L.o), s = this.s;
      const ux = pkt(R1, L.u) * s, uy = pkt(R2, L.u) * s, vx = pkt(R1, L.v) * s, vy = pkt(R2, L.v) * s;
      g.save(); g.clip();
      g.transform(ux, uy, vx, vy, O[0], O[1]);
      t.opt.muster(g, this.licht(n, t.m), s, this);
      g.restore();
    }
  };

  BP.glanzMalen = function (g) {
    if (!this.glanz.length) return;
    g.save();
    g.globalCompositeOperation = "lighter";
    for (const l of this.glanz) {
      const p = this.bild(l.p), r = Math.max(2, l.r * this.s);
      if (l.k <= 0.01) continue;
      const gr = g.createRadialGradient(p[0], p[1], 0, p[0], p[1], r);
      gr.addColorStop(0, "rgba(" + l.farbe + "," + klemm(0.85 * l.k, 0, 1).toFixed(3) + ")");
      gr.addColorStop(0.16, "rgba(" + l.farbe + "," + klemm(0.42 * l.k, 0, 1).toFixed(3) + ")");
      gr.addColorStop(0.45, "rgba(" + l.farbe + "," + klemm(0.12 * l.k, 0, 1).toFixed(3) + ")");
      gr.addColorStop(1, "rgba(" + l.farbe + ",0)");
      g.fillStyle = gr; g.fillRect(p[0] - r, p[1] - r, 2 * r, 2 * r);
    }
    g.restore();
  };

  /* Schatten aller Teile auf dem Boden (schwarz; die Szene färbt ihn ein) */
  BP.schattenMalen = function (g, k) {
    const s = this.s * (k || 1), X0 = this.SX0 * (k || 1), Y0 = this.SY0 * (k || 1);
    g.fillStyle = "#000"; g.strokeStyle = "#000"; g.lineCap = "round"; g.lineJoin = "round";
    g.beginPath();
    for (const gr of this.gruppen) for (const t of gr.teile) {
      if (t.opt.schatten === false) continue;
      if (t.art === "k") {
        const ells = t.E.map((e) => ellipse(e, MS, s, X0, Y0));
        if (ells.length === 1) { const e = ells[0]; g.moveTo(e.cx + Math.cos(e.phi) * e.r1, e.cy + Math.sin(e.phi) * e.r1); g.ellipse(e.cx, e.cy, Math.max(0.2, e.r1), Math.max(0.2, e.r2), e.phi, 0, TAU); }
        else koerperPfad(g, ells);
      } else if (t.art === "p") {
        for (let i = 0; i < t.P.length; i++) {
          const p = t.P[i], x = X0 + pkt(MS[0], p) * s, y = Y0 + pkt(MS[1], p) * s;
          if (i) g.lineTo(x, y); else g.moveTo(x, y);
        }
        g.closePath();
      }
    }
    g.fill();
    for (const gr of this.gruppen) for (const t of gr.teile) {
      if (t.art !== "b" || t.opt.schatten === false) continue;
      /* dünner als ein halber Bildpunkt: verschwindet ohnehin im Halbschatten */
      if (t.breite * s < 0.5) continue;
      g.lineWidth = Math.max(0.6, t.breite * s);
      g.beginPath();
      t.P.forEach((p, i) => { const x = X0 + pkt(MS[0], p) * s, y = Y0 + pkt(MS[1], p) * s; if (i) g.lineTo(x, y); else g.moveTo(x, y); });
      g.stroke();
    }
  };

  /* Rahmen: lokale Achsen im Kameraraum */
  function rahmen(o, x, y, z) { return { o: o, x: x, y: y, z: z }; }
  /* Rahmen um seine y-Achse nicken (Nase hoch bei w > 0) und anheben */
  function nicken(R, w, hub) {
    const c = Math.cos(w), s = Math.sin(w);
    return { o: plus(R.o, mal(R.z, hub || 0)), x: plus(mal(R.x, c), mal(R.z, s)), y: R.y, z: minus(mal(R.z, c), mal(R.x, s)) };
  }
  /* Rahmen für ein Modell in der Stadt (gedreht um gier + Kamera) */
  function modellRahmen(c, sn) { return { o: [0, 0, 0], x: [c, sn, 0], y: [-sn, c, 0], z: [0, 0, 1] }; }

  /* Lichter der Szene (Laternen, Fenster, Buden) im Bild – einmal je
     Bild gesammelt, damit Figuren nachts warm angestrahlt werden. Zu
     jedem Licht merken wir den Standort seines Dings (Weltmeter): daraus
     lässt sich die Tiefe schätzen – ein Licht hinter einer Figur scheint
     auf ihre abgewandte Seite, nicht auf die, die man sieht. */
  let lichtBild = -1, lichtListe = [];
  function szenenLichter() {
    if (lichtBild === ST.jetzt) return lichtListe;
    lichtBild = ST.jetzt; lichtListe = [];
    const SZ = ST.szene;
    if (!SZ || !SZ.sichtbare) return lichtListe;
    for (const e of SZ.sichtbare) {
      if (!e.sp || !e.sp.lichter || !e.sp.lichter.length) continue;
      for (const l of e.sp.lichter) {
        if (l.boden || l.k < 0.15) continue;
        const r = l.r * e.k;
        if (r < 3) continue;
        lichtListe.push({ x: e.x0 + l.x * e.k, y: e.y0 + l.y * e.k, r: r, farbe: l.farbe, k: l.k, ox: e.o.x, oy: e.o.y });
      }
    }
    return lichtListe;
  }
  /* Lampen für eine Figur, die bei Weltpunkt (wx, wy) steht und im Bild
     bei (X, Y) ihre Füße hat; Lampenorte im Kameraraum relativ zu ihr */
  function lampenBei(X, Y, s, nacht, wx, wy) {
    if (nacht < 0.05) return null;
    const aus = [];
    for (const l of szenenLichter()) {
      const dX = l.x - X, dY = l.y - Y, reichweite = l.r * 1.5;
      if (Math.abs(dX) > reichweite || dY > reichweite * 0.6 || dY < -reichweite * 1.6) continue;
      const o = ST.drehXY(l.ox - wx, l.oy - wy, K.dreh);
      const sab = o[0] + o[1], dab = dX / (KX * s);
      const z = (sab * KY * s - dY) / (KZ * s);
      const p = [(dab + sab) / 2, (sab - dab) / 2, Math.max(0.3, z)];
      const d = Math.hypot(p[0], p[1], p[2] - 1);
      const r = Math.max(3, reichweite / s * 1.2);
      if (d > r) continue;
      const f = l.farbe.split(",").map((x) => (+x) / 255);
      aus.push({ p: p, r: r, farbe: f, k: 0.85 * nacht * Math.min(1.2, l.k) });
      if (aus.length >= 4) break;
    }
    return aus.length ? aus : null;
  }

  ST.gestalt = {
    Buehne: Buehne, rahmen: rahmen, nicken: nicken, modellRahmen: modellRahmen, lampenBei: lampenBei,
    MB: MB, MS: MS, R1: R1, R2: R2, LA: LA, LB: LB,
    v: { plus: plus, minus: minus, mal: mal, pkt: pkt, kreuz: kreuz, einheit: einheit, mix: mix, klemm: klemm, glatt: glatt }
  };

  /* =====================================================================
     DER WEIHNACHTSMANN
     ===================================================================== */
  const PERIODE = 60, DAUER = 14, ERSTER = 22;
  const ZWANG = q.has("santa") ? klemm(+q.get("santa") || 0, 0, 1) : null;
  const KURS = q.has("santakurs") ? +q.get("santakurs") : null;
  const HOEHE = q.has("santahoehe") ? +q.get("santahoehe") : null;
  const TEST = q.get("santatest");
  const WERKBANK = !!q.get("werkbank");
  const STILL = q.get("still") === "1";
  /* Gespann: Abstände entlang der Bahn (Meter hinter Rudolph) */
  const PAARE = [2.55, 5.1, 7.65, 10.2];
  const D_SCHLITTEN = 13.5, TEAM = D_SCHLITTEN + 1.9, SEITE = 0.72;
  const D_SCHL = D_SCHLITTEN, TEAM_S = TEAM;

  let flug = null;     // { n, pfad, p, ton }
  const MESS = {};     // nur zum Messen der Rechenzeit (ST.himmel.mess)

  /* Kubische Bézierkurve und Ableitung */
  function bez(P, u) {
    const m = 1 - u, a = m * m * m, b = 3 * m * m * u, c = 3 * m * u * u, d = u * u * u;
    return [a * P[0][0] + b * P[1][0] + c * P[2][0] + d * P[3][0], a * P[0][1] + b * P[1][1] + c * P[2][1] + d * P[3][1], a * P[0][2] + b * P[1][2] + c * P[2][2] + d * P[3][2]];
  }
  function bezT(P, u) {
    const m = 1 - u, a = 3 * m * m, b = 6 * m * u, c = 3 * u * u;
    return [a * (P[1][0] - P[0][0]) + b * (P[2][0] - P[1][0]) + c * (P[3][0] - P[2][0]), a * (P[1][1] - P[0][1]) + b * (P[2][1] - P[1][1]) + c * (P[3][1] - P[2][1]), a * (P[1][2] - P[0][2]) + b * (P[2][2] - P[1][2]) + c * (P[3][2] - P[2][2])];
  }

  /* Die Flugbahn: eine weite Kurve, die durch das Bild führt, das man
     gerade ansieht (bei Beginn des Flugs festgelegt, danach fest in der
     Welt – schiebt man die Karte, bleibt der Schlitten am Himmel über
     derselben Stelle). Gerechnet in Bildachsen: r = Meter nach rechts,
     v = Meter „auf den Betrachter zu" am Boden. */
  function pfadBauen(n, pZiel, opt) {
    opt = opt || {};
    const rng = ST.zufall((opt.saat || 4242) + n * 977);
    const TEAM = opt.team || TEAM_S, D_SCHLITTEN = opt.anker == null ? D_SCHL : opt.anker;
    const s0 = Math.max(4, K.s), W = K.W, H = K.H;
    const rW = W / (2 * s0);
    const vVon = (fy, z) => 2 * (fy * H / s0 + KZ * z);
    let P;
    if (KURS != null) {
      const w = KURS * Math.PI / 180, z = HOEHE || opt.hoehe || 40, dr = Math.cos(w), dv = Math.sin(w), L = 120;
      /* Schlitten genau in der Bildmitte, wenn p = pZiel */
      const dS = (pZiel == null ? 0.5 : pZiel) * (L + TEAM) - D_SCHLITTEN;
      const m = [0, vVon(0, z), z], a = [m[0] - dr * dS, m[1] - dv * dS, z], e = [a[0] + dr * L, a[1] + dv * L, z];
      P = [a, mix(a, e, 1 / 3), mix(a, e, 2 / 3), e];
    } else {
      const dir = q.has("santarichtung") ? (+q.get("santarichtung") < 0 ? -1 : 1) : (n % 2 ? -1 : 1);
      const rand = 14;
      const z0 = opt.hoehe || 40;
      const za = z0 + rng() * 5, zm = z0 - 5 + rng() * 3, ze = z0 + 1 + rng() * 5;
      const ra = -dir * (rW + rand), re = dir * (rW + rand);
      const fyA = -0.3 - rng() * 0.1, fyM = -0.1 - rng() * 0.08, fyE = -0.32 - rng() * 0.1;
      const bogen = 8 + rng() * 10;
      P = [[ra, vVon(fyA, za), za], [ra * 0.3, vVon(fyM, zm) + bogen, zm], [re * 0.3, vVon(fyM, zm) + bogen * 0.4, zm], [re, vVon(fyE, ze), ze]];
      if (HOEHE) for (const p of P) { const dz = HOEHE - 40; p[1] += 2 * KZ * dz; p[2] += dz; }
    }
    /* Bildachsen → Kamera → Welt */
    const inv = (4 - (K.dreh & 3)) & 3;
    const welt = P.map(function (p) {
      const a = (p[0] + p[1]) * Math.SQRT1_2, b = (p[1] - p[0]) * Math.SQRT1_2;
      const w = ST.drehXY(a, b, inv);
      return [w[0] + K.x, w[1] + K.y, p[2]];
    });
    /* Bogenlänge tabellieren */
    const N = 160, lut = [0];
    let alt = bez(welt, 0), L = 0;
    for (let i = 1; i <= N; i++) { const p = bez(welt, i / N); L += Math.hypot(p[0] - alt[0], p[1] - alt[1], p[2] - alt[2]); lut.push(L); alt = p; }
    return { P: welt, lut: lut, N: N, L: L, tA: einheit(bezT(welt, 0)), tE: einheit(bezT(welt, 1)) };
  }
  function pfadPunkt(pf, d) {
    if (d <= 0) return { p: plus(pf.P[0], mal(pf.tA, d)), t: pf.tA };
    if (d >= pf.L) return { p: plus(pf.P[3], mal(pf.tE, d - pf.L)), t: pf.tE };
    let lo = 0, hi = pf.N;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (pf.lut[m] < d) lo = m; else hi = m; }
    const u = (lo + (d - pf.lut[lo]) / Math.max(1e-6, pf.lut[hi] - pf.lut[lo])) / pf.N;
    return { p: bez(pf.P, u), t: einheit(bezT(pf.P, u)) };
  }

  /* Welches Flugfenster gerade? (etwa jede Minute, leicht gestreut) */
  function zyklus(t) {
    if (t < ERSTER) return null;
    const n = Math.floor((t - ERSTER) / PERIODE);
    const start = ERSTER + n * PERIODE + ST.hash2(n, 3, 77) * 6;
    return { n: n, p: (t - start) / DAUER };
  }
  function aktiv(SZ) {
    if (TEST) return true;
    if (!SZ || SZ.jahr !== "winter") return false;
    if (WERKBANK && ZWANG == null) return false;
    return true;
  }

  function bewegen(dt, t, SZ) {
    if (!aktiv(SZ)) { flug = null; return; }
    if (ZWANG != null) {
      if (!flug) flug = { n: 0, pfad: pfadBauen(0, ZWANG), p: ZWANG, ton: true };
      flug.p = ZWANG;
      return;
    }
    const z = zyklus(t);
    if (!z || z.p < 0 || z.p > 1) { flug = null; return; }
    if (!flug || flug.n !== z.n) flug = { n: z.n, pfad: pfadBauen(z.n), p: z.p, ton: false };
    flug.p = z.p;
    if (!flug.ton && z.p > 0.08) {
      flug.ton = true;
      /* Schlittenglöckchen – einmal je Überflug */
      if (!STILL && typeof ST.ton === "function") ST.ton("schlitten", 0.45);
    }
  }

  /* ---------------- Farben ---------------- */
  const FARBE = {
    fellHell: [214, 204, 186], huf: [52, 46, 42], geweih: [150, 128, 100], geweihSpitze: [214, 200, 176],
    nase: [44, 36, 32], auge: [22, 16, 14],
    leder: [122, 28, 24], gold: [224, 178, 72], messing: [196, 150, 64], leine: [96, 36, 26],
    mantel: [178, 22, 28], pelz: [242, 238, 230], haut: [236, 184, 156], wange: [226, 136, 120], bart: [240, 238, 232],
    guertel: [30, 26, 24], stiefel: [30, 26, 24], handschuh: [52, 36, 28],
    lack: [34, 66, 50], lackInnen: [110, 26, 34], samt: [134, 22, 36], holz: [98, 64, 38],
    sack: [156, 122, 82], sackDunkel: [120, 90, 58], kordel: [170, 40, 34]
  };

  /* =====================================================================
     EIN RENTIER (lokal: x vorn, y links, z oben; Ursprung Rumpfmitte)
     ===================================================================== */
  function rentier(B, R0, ph, o) {
    const w = ph * TAU;
    /* Rumpf wiegt im Galopp: Nicken und Heben */
    const R = nicken(R0, 0.07 * Math.sin(w + 0.9), 0.05 * Math.sin(w + 2.3));
    B.rahmen(R);
    const fein = B.s > 34, sehrFein = B.s > 70, grob = B.s < 28;   // Detailstufe nach Pixeln je Meter
    const fell = o.fell, dunkel = mal(fell, 0.66), hell = FARBE.fellHell, bauch = mix(fell, hell, 0.55);
    const beinF = mal(fell, 0.78), socke = mix(fell, hell, 0.7);
    const aus = {};

    /* ---- Beine ---- (Winkel: 0 = senkrecht nach unten, + = nach vorn) */
    const dirV = (th) => [Math.sin(th), 0, -Math.cos(th)];
    const fernSeite = pkt(R.y, AUGE);
    const bein = (vorn, seite, phase) => {
      const pw = phase * TAU, sw = Math.cos(pw), bg = Math.max(0, -Math.sin(pw));
      const y = seite * 0.12;
      let J, L, th;
      if (vorn) {
        /* Vorderbein: Oberarm, Unterarm, Röhrbein; beim Vorschwingen klappt das Vorderfußwurzelgelenk nach hinten */
        J = [0.34, y, -0.08]; L = [0.25, 0.27, 0.27];
        const a = -0.2 + 0.5 * sw, b = a + 0.25 + 0.35 * sw + 1.0 * bg, c = b - 1.9 * bg - 0.1;
        th = [a, b, c];
      } else {
        /* Hinterbein: Oberschenkel, Unterschenkel, Röhrbein; das Sprunggelenk beugt sich beim Vorholen */
        J = [-0.5, y, 0.0]; L = [0.3, 0.32, 0.3];
        const a = 0.45 + 0.45 * sw, b = a - 1.05 - 0.25 * bg, c = b + 0.25 + 1.2 * bg + 0.35 * Math.max(0, sw);
        th = [a, b, c];
      }
      const p1 = plus(J, mal(dirV(th[0]), L[0])), p2 = plus(p1, mal(dirV(th[1]), L[1])), p3 = plus(p2, mal(dirV(th[2]), L[2]));
      const t = seite * 0.004;
      /* die abgewandten Beine liegen im Schatten des Rumpfs */
      const k = seite * fernSeite < 0 ? 0.8 : 1;
      B.glied(J, vorn ? 0.1 : 0.13, p1, vorn ? 0.066 : 0.078, mal(fell, k), { tiefe: t });
      if (grob) {
        /* weit weg: Unterschenkel und Röhrbein in einem Zug, Huf als Punkt */
        B.glied(p1, vorn ? 0.058 : 0.064, p2, 0.042, mal(beinF, k), { tiefe: t });
        B.glied(p2, 0.04, p3, 0.036, mal(mix(beinF, socke, 0.4), k), { tiefe: t });
        B.kugel(p3, 0.05, FARBE.huf, { tiefe: t + 0.01 });
        return;
      }
      B.glied(p1, vorn ? 0.06 : 0.066, p2, 0.043, mal(beinF, k), { tiefe: t });
      B.glied(p2, 0.04, mix(p2, p3, 0.7), 0.034, mal(beinF, k * 0.92), { tiefe: t });
      B.glied(mix(p2, p3, 0.68), 0.035, p3, 0.034, mal(socke, k), { tiefe: t });
      /* Huf: breit, gespalten, mit Afterklauen */
      const hd = dirV(th[2] + 0.9);
      B.ei(plus(p3, mal(hd, 0.03)), mal(hd, 0.065), [0, 0.058, 0], [0, 0, 0.036], FARBE.huf, { tiefe: t + 0.01 });
      if (sehrFein) B.kugel(plus(p3, mal(dirV(th[2] - 1.2), 0.05)), 0.016, FARBE.huf, { tiefe: t });
    };
    const pv = o.phasen || [0, 0.1, 0.48, 0.58];
    /* hinten links, hinten rechts, vorn links, vorn rechts */
    bein(false, 1, ph + pv[0]); bein(false, -1, ph + pv[1]); bein(true, 1, ph + pv[2]); bein(true, -1, ph + pv[3]);

    /* ---- Rumpf ---- vorn tiefe Brust mit Widerrist, hinten Bauch und Keule */
    const flanke = mix(fell, hell, 0.35);
    B.koerper([
      { c: [0.3, 0, -0.04], a: [[0.27, 0, 0], [0, 0.215, 0], [0, 0, 0.33]] },
      { c: [0.2, 0, 0.19], a: [[0.27, 0, 0], [0, 0.17, 0], [0, 0, 0.15]] },
      { c: [-0.1, 0, 0.02], a: [[0.3, 0, 0], [0, 0.235, 0], [0, 0, 0.265]] }
    ], fell, { flecken: fein ? [
      { c: [0.05, 0, -0.27], a: [[0.34, 0, 0], [0, 0.2, 0], [0, 0, 0.1]], alb: bauch, n: [0, 0, -1], k: 0.85 },
      { c: [0.15, 0, 0.26], a: [[0.4, 0, 0], [0, 0.15, 0], [0, 0, 0.08]], alb: dunkel, n: [0, 0, 1], k: 0.5 },
      { c: [-0.05, 0.21, -0.08], a: [[0.34, 0, 0], [0, 0.05, 0], [0, 0, 0.07]], alb: flanke, n: [0, 1, 0], k: 0.45 },
      { c: [-0.05, -0.21, -0.08], a: [[0.34, 0, 0], [0, 0.05, 0], [0, 0, 0.07]], alb: flanke, n: [0, -1, 0], k: 0.45 }
    ] : null });
    B.koerper([
      { c: [-0.12, 0, 0.03], a: [[0.3, 0, 0], [0, 0.232, 0], [0, 0, 0.255]] },
      { c: [-0.5, 0, 0.06], a: [[0.27, 0, 0], [0, 0.205, 0], [0, 0, 0.265]] }
    ], fell, { tiefe: -0.01, flecken: fein ? [
      { c: [-0.2, 0, -0.24], a: [[0.3, 0, 0], [0, 0.18, 0], [0, 0, 0.08]], alb: bauch, n: [0, 0, -1], k: 0.8 },
      { c: [-0.76, 0, 0.1], a: [[0.1, 0, 0], [0, 0.15, 0], [0, 0, 0.16]], alb: hell, n: [-1, 0, 0], k: 0.95 },
      { c: [-0.3, 0, 0.27], a: [[0.4, 0, 0], [0, 0.14, 0], [0, 0, 0.08]], alb: dunkel, n: [0, 0, 1], k: 0.5 },
      { c: [-0.2, 0.22, -0.06], a: [[0.3, 0, 0], [0, 0.05, 0], [0, 0, 0.07]], alb: flanke, n: [0, 1, 0], k: 0.45 },
      { c: [-0.2, -0.22, -0.06], a: [[0.3, 0, 0], [0, 0.05, 0], [0, 0, 0.07]], alb: flanke, n: [0, -1, 0], k: 0.45 }
    ] : null });
    /* Schwanz: kurzer heller Wedel */
    if (!grob) B.ei([-0.77, 0, 0.16], [0.045, 0, 0.03], [0, 0.035, 0], [-0.02, 0, 0.045], hell, { tiefe: -0.02 });

    /* ---- Hals, Mähne, Kopf ---- */
    const kopfNick = 0.06 * Math.sin(w + 0.3);
    const H0 = [0.42, 0, 0.1], H1 = [0.76, 0, 0.3 + kopfNick * 0.2];
    B.glied([0.44, 0, -0.1], 0.14, [0.72, 0, 0.18], 0.1, hell, { tiefe: -0.02 });    // helle Halsmähne hängt unten heraus
    B.glied(H0, 0.165, H1, 0.1, mix(fell, hell, 0.25));
    const al = 0.3 + kopfNick;           // Kopf nach vorn unten geneigt
    const ca = Math.cos(al), sa = Math.sin(al);
    const hk = (u, y, z) => [H1[0] + u * ca + z * sa, y, H1[2] - u * sa + z * ca];
    B.koerper([{ c: hk(0.07, 0, 0.03), a: [[0.14, 0, 0], [0, 0.095, 0], [0, 0, 0.105]] }, { c: hk(0.29, 0, -0.02), a: [[0.11, 0, 0], [0, 0.08, 0], [0, 0, 0.078]] }], mix(fell, hell, 0.12), {
      flecken: fein ? [{ c: hk(0.31, 0, -0.08), a: [[0.08, 0, 0], [0, 0.07, 0], [0, 0, 0.03]], alb: mix(fell, hell, 0.5), n: [0, 0, -1], k: 0.7 }] : null
    });
    /* Nase */
    if (o.rudolph) {
      const nk = [0.4, 0, -0.025];
      B.kugel(hk(nk[0], nk[1], nk[2]), 0.052, [255, 70, 50], { leucht: true });
      if (fein) B.kugel(hk(0.395, 0.017, -0.005), 0.02, [255, 190, 170], { leucht: true, tiefe: 0.02 });
      aus.nase = B.pk(hk(nk[0], nk[1], nk[2]));
    } else {
      B.kugel(hk(0.39, 0, -0.025), 0.04, FARBE.nase);
    }
    /* Augen und Ohren */
    for (const sd of [1, -1]) {
      if (fein) B.kugel(hk(0.14, sd * 0.086, 0.06), 0.018, FARBE.auge, { glanz: sehrFein ? 0.8 : 0, tiefe: 0.01 });
      if (grob) continue;
      const oh = hk(-0.01, sd * 0.1, 0.1);
      B.ei(oh, [-0.02, 0, 0.015], [0, sd * 0.07, 0.02], [0.0, 0, 0.03], mix(fell, hell, 0.2), { tiefe: 0.01 });
    }
    /* ---- Geweih ---- (in Kopfkoordinaten) */
    const gk = o.geweih;
    const gw = (sd, pts) => pts.map((p) => hk(p[0] * gk, sd * (0.045 + (p[1] - 0.045) * gk), 0.08 + (p[2] - 0.08) * gk));
    for (const sd of [1, -1]) {
      /* Hauptstange: erst weit nach hinten-oben, dann in großem Bogen nach vorn (C-Form) */
      const stange = gw(sd, [[0.0, 0.05, 0.1], [-0.08, 0.12, 0.24], [-0.19, 0.2, 0.4], [-0.23, 0.26, 0.57], [-0.15, 0.28, 0.71], [-0.02, 0.25, 0.79], [0.1, 0.19, 0.8]]);
      const bw = Math.max(0.022, 0.05 * gk);
      if (grob) {
        B.band(stange, bw * 0.8, FARBE.geweih, { tiefe: 0.02, n: [0, sd, 0.5] });
        B.band(gw(sd, [[0.01, 0.05, 0.13], [0.09, 0.05, 0.19], [0.17, 0.035, 0.19]]), bw * 0.6, FARBE.geweih, { tiefe: 0.02 });
        continue;
      }
      B.band(stange, bw, FARBE.geweih, { breite2: bw * 0.5, tiefe: 0.02, n: [0, sd, 0.5] });
      /* Augsprosse als Schaufel über der Stirn, Eissprosse, Hintersprosse, Krone mit mehreren Enden */
      B.band(gw(sd, [[0.01, 0.05, 0.13], [0.09, 0.05, 0.19], [0.17, 0.035, 0.19]]), bw * 0.8, FARBE.geweih, { breite2: bw * 0.55, tiefe: 0.02 });
      if (fein) B.band(gw(sd, [[0.1, 0.05, 0.19], [0.16, 0.07, 0.24]]), bw * 0.45, FARBE.geweih, { breite2: bw * 0.3, tiefe: 0.02 });
      B.band(gw(sd, [[-0.08, 0.12, 0.24], [0.02, 0.17, 0.33]]), bw * 0.6, FARBE.geweih, { breite2: bw * 0.4, tiefe: 0.02 });
      B.band(gw(sd, [[-0.21, 0.23, 0.48], [-0.33, 0.28, 0.54]]), bw * 0.55, FARBE.geweih, { breite2: bw * 0.35, tiefe: 0.02 });
      B.band(gw(sd, [[-0.15, 0.28, 0.71], [-0.19, 0.35, 0.84]]), bw * 0.5, FARBE.geweihSpitze, { breite2: bw * 0.3, tiefe: 0.02 });
      B.band(gw(sd, [[-0.02, 0.25, 0.79], [-0.02, 0.31, 0.91]]), bw * 0.5, FARBE.geweihSpitze, { breite2: bw * 0.3, tiefe: 0.02 });
      B.band(gw(sd, [[0.06, 0.21, 0.8], [0.12, 0.25, 0.9]]), bw * 0.45, FARBE.geweihSpitze, { breite2: bw * 0.28, tiefe: 0.02 });
    }

    /* ---- Geschirr: Kummet mit Glöckchen, Rückengurt, Bauchgurt ---- */
    const kc = [0.5, 0, 0.14], na = einheit([0.34, 0, 0.2]), e1 = [0, 1, 0], e2 = kreuz(na, e1);
    const ring = (c, ra, rb, u, v, n, breite, alb, teile) => {
      const pts = [];
      for (let i = 0; i <= n; i++) { const a = i / n * TAU; pts.push(plus(c, plus(mal(u, Math.cos(a) * ra), mal(v, Math.sin(a) * rb)))); }
      const st = Math.ceil(n / teile);
      for (let i = 0; i < n; i += st) B.band(pts.slice(i, Math.min(n, i + st) + 1), breite, alb, { tiefe: 0.03 });
      return pts;
    };
    const kum = ring(kc, 0.2, 0.19, e1, e2, grob ? 8 : 18, 0.065, FARBE.leder, grob ? 2 : 6);
    /* Glöckchen am Kummet (untere Hälfte) */
    const bim = 0.012 * Math.sin(w * 2);
    if (!grob) for (const i of [11, 13, 15, 3, 5, 7]) {
      const p = kum[i];
      if (p[2] > kc[2] + 0.05) continue;
      B.kugel(plus(p, [0, 0, -0.03 + bim]), 0.03, FARBE.gold, { glanz: 0.9, tiefe: 0.05 });
    }
    B.kugel(plus(kc, plus(mal(e2, -0.2), [0.02, 0, -0.05 + bim])), 0.038, FARBE.gold, { glanz: 0.9, tiefe: 0.06 });
    /* Rückenpolster und Bauchgurt */
    if (!grob) B.ei([0.08, 0, 0.275], [0.11, 0, 0], [0, 0.11, 0], [0, 0, 0.028], FARBE.leder, { tiefe: 0.04 });
    ring([0.08, 0, -0.01], 0.255, 0.305, [0, 1, 0], [0, 0, 1], grob ? 8 : 16, 0.05, FARBE.leder, grob ? 2 : 8);
    if (!grob) for (const sd of [1, -1]) B.kugel([0.08, sd * 0.2, 0.22], 0.026, FARBE.gold, { glanz: 0.9, tiefe: 0.05 });
    aus.kummet = [B.pk(plus(kc, [0, 0.2, 0])), B.pk(plus(kc, [0, -0.2, 0]))];
    aus.brust = B.pk([0.62, 0, -0.1]);
    aus.hinten = B.pk([-0.85, 0, -0.05]);
    aus.mitte = B.pk([0, 0, 0]);
    return aus;
  }

  /* =====================================================================
     DER SCHLITTEN MIT DEM WEIHNACHTSMANN (lokal: x vorn, y links, z oben;
     Ursprung Mitte des Schlittenbodens)
     ===================================================================== */
  function schlitten(B, R, t, winken, Z) {
    B.rahmen(R);
    const fein = B.s > 30, sehrFein = B.s > 70;
    const vornSicht = pkt(R.x, AUGE) > 0, hintenSicht = !vornSicht;
    const aus = {};
    /* Seitenwand-Umriss (x, z): hohe Rückenlehne, Mulde am Sitz, vorn die Schnecke */
    const ROH = [[-1.3, 0], [1.05, 0], [1.28, 0.12], [1.45, 0.38], [1.55, 0.7], [1.52, 0.95], [1.41, 1.08], [1.25, 1.04], [1.12, 0.88], [0.85, 0.7], [0.4, 0.6], [-0.3, 0.6], [-0.46, 0.66], [-0.64, 0.84], [-0.84, 1.0], [-1.06, 1.12], [-1.28, 1.14], [-1.37, 1.02], [-1.36, 0.3]];
    /* weich gerundet (keine Ecken im Umriss) – die Unterkante bleibt gerade */
    const PROFIL = [ROH[0]].concat(kurve(ROH.slice(1), fein ? 4 : 2));
    const oberKante = kurve(ROH.slice(2, 18), fein ? 4 : 2);
    const yBei = (z) => 0.58 + 0.08 * z;
    /* Kufen (Messing) mit Streben */
    for (const sd of [1, -1]) {
      const y = sd * 0.5;
      const k1 = kurve([[-1.62, -0.33], [-1.5, -0.44], [-1.2, -0.47], [1.2, -0.47]], fein ? 4 : 2);
      const k2 = kurve([[1.2, -0.47], [1.52, -0.39], [1.76, -0.2], [1.88, 0.1], [1.84, 0.4], [1.7, 0.55], [1.57, 0.5], [1.56, 0.4], [1.64, 0.36]], fein ? 4 : 2);
      const hinten = k1.map((p) => [p[0], y, p[1]]), vorn = k2.map((p) => [p[0], y, p[1]]);
      B.band(hinten, 0.055, FARBE.messing, { ebene: 0, glanz: 1 });
      B.band(vorn, 0.055, FARBE.messing, { ebene: vornSicht ? 4 : 0, glanz: 1 });
      for (const x of [-1.0, -0.15, 0.7]) B.band([[x, y, -0.45], [x + 0.06, sd * 0.56, 0.02]], 0.04, FARBE.messing, { ebene: 0, glanz: 0.6 });
      B.band([[-1.0, y, -0.2], [-0.15, sd * 0.53, -0.2], [0.7, y, -0.2]], 0.025, FARBE.messing, { ebene: 0 });
    }
    /* Boden */
    B.platte([[-1.3, 0.56, 0.02], [1.05, 0.56, 0.02], [1.05, -0.56, 0.02], [-1.3, -0.56, 0.02]], FARBE.holz, { ebene: 1, n: [0, 0, 1], schatten: false });
    /* Seitenwände: innen Samt, außen Lack mit Goldzier */
    for (const sd of [1, -1]) {
      const pts = PROFIL.map((p) => [p[0], sd * yBei(p[1]), p[1]]);
      const n = [0, sd, -0.05];
      const zu = pkt(B.rk(n), AUGE) > 0;
      B.platte(pts, FARBE.lack, {
        n: n, innen: FARBE.lackInnen, ebene: zu ? 3 : 1,
        ursprung: [0, sd * 0.62, 0], u: [sd > 0 ? -1 : 1, 0, 0], v: [0, 0.08 * sd, 1],
        muster: fein ? function (g, f, s) { zierSeite(g, f, s, sd > 0 ? -1 : 1, sehrFein); } : null
      });
      /* Goldleiste an der Oberkante */
      const oben = oberKante.map((p) => [p[0], sd * (yBei(p[1]) + 0.01), p[1]]);
      B.band(oben, 0.045, FARBE.gold, { ebene: zu ? 3 : 1, glanz: 1, tiefe: 0.01 });
    }
    /* Rückwand mit gerundeter Oberkante */
    {
      const pts = [[-1.36, 0.66, 0.2], [-1.36, 0.66, 1.0], [-1.34, 0.44, 1.14], [-1.33, 0, 1.2], [-1.34, -0.44, 1.14], [-1.36, -0.66, 1.0], [-1.36, -0.66, 0.2], [-1.3, -0.6, 0], [-1.3, 0.6, 0]];
      B.platte(pts, FARBE.lack, { n: [-1, 0, 0], innen: FARBE.lackInnen, ebene: hintenSicht ? 3 : 1 });
      B.band([[-1.36, 0.66, 1.0], [-1.34, 0.44, 1.14], [-1.33, 0, 1.2], [-1.34, -0.44, 1.14], [-1.36, -0.66, 1.0]], 0.045, FARBE.gold, { ebene: hintenSicht ? 3 : 1, glanz: 1, tiefe: 0.01 });
    }
    /* Vorderschild (Spritzbrett), gewölbt: Streifen zwischen den Seitenwänden */
    {
      const pr = [[1.05, 0], [1.28, 0.12], [1.45, 0.38], [1.55, 0.7], [1.52, 0.95], [1.41, 1.08]];
      for (let i = 0; i < pr.length - 1; i++) {
        const a = pr[i], b = pr[i + 1];
        const ya = yBei(a[1]), yb = yBei(b[1]);
        const tx = b[0] - a[0], tz = b[1] - a[1];
        const n = [tz, 0, -tx];     // nach vorn-oben
        B.platte([[a[0], ya, a[1]], [b[0], yb, b[1]], [b[0], -yb, b[1]], [a[0], -ya, a[1]]], FARBE.lack, { n: n, innen: FARBE.lackInnen, ebene: vornSicht ? 3 : 1 });
      }
    }
    /* Sitzbank und Lehne (roter Samt) */
    B.platte([[-0.48, 0.58, 0.42], [0.16, 0.58, 0.42], [0.16, -0.58, 0.42], [-0.48, -0.58, 0.42]], FARBE.samt, { ebene: 2, n: [0, 0, 1], tiefe: -0.3 });
    B.platte([[0.16, 0.58, 0.42], [0.16, 0.58, 0.02], [0.16, -0.58, 0.02], [0.16, -0.58, 0.42]], FARBE.lackInnen, { ebene: 2, n: [1, 0, 0], tiefe: -0.3 });
    B.platte([[-0.5, 0.6, 1.0], [-0.5, 0.6, 0.42], [-0.5, -0.6, 0.42], [-0.5, -0.6, 1.0]], FARBE.samt, { ebene: 2, n: [1, 0, 0], innen: FARBE.lackInnen, tiefe: -0.25 });
    B.band([[-0.5, 0.6, 1.0], [-0.5, -0.6, 1.0]], 0.05, FARBE.gold, { ebene: 2, glanz: 1, tiefe: -0.2 });

    /* Laternen an den vorderen Ecken */
    for (const sd of [1, -1]) {
      const c = [1.3, sd * 0.74, 1.05];
      B.band([[1.22, sd * 0.66, 0.9], [1.3, sd * 0.74, 0.96]], 0.02, FARBE.messing, { ebene: vornSicht ? 4 : 3 });
      B.koerper([{ c: c, a: [[0.05, 0, 0], [0, 0.05, 0], [0, 0, 0.07]] }], [255, 216, 140], { leucht: true, ebene: vornSicht ? 4 : 3 });
      B.glied(plus(c, [0, 0, 0.07]), 0.055, plus(c, [0, 0, 0.13]), 0.012, FARBE.messing, { ebene: vornSicht ? 4 : 3, glanz: 0.8 });
      B.leuchte(c, 1.6, "255,196,120", 0.35 + 0.65 * Z.nacht);
    }

    /* ---- Der Sack mit Geschenken (hinten im Laderaum) ---- */
    B.ei([-0.92, -0.04, 0.56], [0.36, 0, 0.04], [0, 0.46, 0], [-0.06, 0, 0.5], FARBE.sack, {
      ebene: 2,
      flecken: fein ? [
        { c: [-0.7, 0.1, 0.5], a: [[0.08, 0, 0], [0, 0.03, 0], [0, 0, 0.3]], alb: FARBE.sackDunkel, n: [1, 0, 0], k: 0.6 },
        { c: [-0.72, -0.22, 0.62], a: [[0.08, 0, 0], [0, 0.03, 0], [0.02, 0, 0.28]], alb: FARBE.sackDunkel, n: [1, 0, 0], k: 0.5 },
        { c: [-0.9, 0.35, 0.5], a: [[0.2, 0, 0], [0, 0.05, 0], [0, 0, 0.3]], alb: FARBE.sackDunkel, n: [0, 1, 0], k: 0.4 }
      ] : null
    });
    B.glied([-0.95, 0, 1.0], 0.17, [-0.98, 0.02, 1.14], 0.1, FARBE.sack, { ebene: 2 });
    if (fein) B.band([[-0.96, 0.15, 1.08], [-0.86, 0.02, 1.07], [-0.96, -0.13, 1.08], [-1.08, 0.02, 1.1], [-0.96, 0.15, 1.08]], 0.025, FARBE.kordel, { ebene: 2, tiefe: 0.02 });
    geschenk(B, [-0.78, 0.26, 1.02], [0.24, 0.2, 0.2], 0.4, [34, 104, 62], [196, 32, 36]);
    geschenk(B, [-1.1, -0.22, 1.04], [0.2, 0.2, 0.18], -0.3, [214, 176, 72], [170, 24, 30]);
    geschenk(B, [-0.84, -0.3, 0.98], [0.18, 0.22, 0.16], 0.9, [150, 26, 34], [226, 196, 110]);
    geschenk(B, [-1.14, 0.3, 0.96], [0.2, 0.18, 0.2], 0.1, [40, 70, 130], [236, 232, 220]);

    /* ---- Der Weihnachtsmann ---- */
    weihnachtsmann(B, t, winken, fein, sehrFein);
    aus.haken = B.pk([1.52, 0, 0.3]);
    aus.haende = [B.pk([0.28, 0.2, 0.92]), B.pk([0.28, -0.2, 0.92])];
    aus.hinten = B.pk([-1.35, 0, 0.3]);
    aus.kufen = [B.pk([-1.55, 0.5, -0.38]), B.pk([-1.55, -0.5, -0.38])];
    return aus;
  }

  /* Goldzier auf der Seitenwand: Rahmenleiste und Ranken (lokal x nach vorn
     bzw. hinten, y nach oben) */
  function zierSeite(g, f, s, rx, sehrFein) {
    const gold = "rgb(" + Math.min(255, 230 * f[0]) + "," + Math.min(255, 186 * f[1]) + "," + Math.min(255, 84 * f[2]) + ")";
    /* Lackglanz: oben spiegelt der helle Himmel, unten wird es satter */
    const gl = g.createLinearGradient(0, 0, 0, 1.15);
    gl.addColorStop(0, "rgba(0,0,0,0.2)"); gl.addColorStop(0.5, "rgba(255,255,255,0)");
    gl.addColorStop(0.9, "rgba(255,255,255,0.13)"); gl.addColorStop(1, "rgba(255,255,255,0.04)");
    g.fillStyle = gl; g.fillRect(-2, -0.1, 4, 1.4);
    g.strokeStyle = gold; g.lineCap = "round";
    g.lineWidth = 0.028;
    /* Zierlinie parallel zur Kante */
    g.beginPath();
    g.moveTo(rx * -1.18, 0.12); g.lineTo(rx * 0.98, 0.12);
    g.quadraticCurveTo(rx * 1.36, 0.2, rx * 1.4, 0.62);
    g.moveTo(rx * -1.18, 0.12); g.lineTo(rx * -1.2, 0.9);
    g.stroke();
    /* Ranken: Spiralen */
    const spirale = (x, y, r, dreh) => {
      g.beginPath();
      for (let i = 0; i <= 36; i++) {
        const a = i / 36 * TAU * 1.4, rr = r * (1 - i / 44);
        const px = x + rx * Math.cos(a * dreh) * rr, py = y + Math.sin(a * dreh) * rr;
        if (i) g.lineTo(px, py); else g.moveTo(px, py);
      }
      g.stroke();
    };
    g.lineWidth = 0.022;
    spirale(rx * 1.22, 0.62, 0.16, 1);
    spirale(rx * -0.95, 0.62, 0.14, -1);
    g.beginPath();
    g.moveTo(rx * -0.8, 0.5); g.bezierCurveTo(rx * -0.4, 0.2, rx * 0.2, 0.44, rx * 0.55, 0.3);
    g.bezierCurveTo(rx * 0.8, 0.22, rx * 1.0, 0.35, rx * 1.1, 0.5);
    g.stroke();
    if (sehrFein) {
      g.lineWidth = 0.012;
      for (let i = 0; i < 5; i++) {
        const x = -0.6 + i * 0.3, y = 0.33 + Math.sin(i * 1.7) * 0.05;
        g.beginPath(); g.ellipse(rx * x, y, 0.05, 0.022, rx * 0.6, 0, TAU); g.stroke();
      }
    }
  }

  /* Geschenk: Schachtel mit Schleifenband (Mitte c, Maße m, Drehung um z) */
  function geschenk(B, c, m, dreh, farbe, band) {
    const co = Math.cos(dreh), sn = Math.sin(dreh);
    const ax = [co * m[0] / 2, sn * m[0] / 2, 0], ay = [-sn * m[1] / 2, co * m[1] / 2, 0], az = [0, 0, m[2] / 2];
    const P = (i, j, k) => plus(c, plus(mal(ax, i), plus(mal(ay, j), mal(az, k))));
    const seite = (a, b, cc, d, n, muster) => B.platte([a, b, cc, d], farbe, { n: n, ebene: 2, muster: muster, ursprung: mix(a, cc, 0.5), u: minus(b, a), v: minus(a, d) });
    const kreuzband = function (g, f) {
      g.strokeStyle = rgbAus(band, f); g.lineWidth = 0.28; g.beginPath(); g.moveTo(-0.5, 0); g.lineTo(0.5, 0); g.stroke();
    };
    seite(P(-1, 1, 1), P(1, 1, 1), P(1, -1, 1), P(-1, -1, 1), [0, 0, 1], function (g, f) {
      g.strokeStyle = rgbAus(band, f); g.lineWidth = 0.22; g.beginPath(); g.moveTo(-0.55, 0); g.lineTo(0.55, 0); g.moveTo(0, -0.55); g.lineTo(0, 0.55); g.stroke();
    });
    seite(P(-1, 1, 1), P(-1, 1, -1), P(1, 1, -1), P(1, 1, 1), ay, null);
    seite(P(1, 1, 1), P(1, 1, -1), P(1, -1, -1), P(1, -1, 1), ax, kreuzband);
    seite(P(1, -1, 1), P(1, -1, -1), P(-1, -1, -1), P(-1, -1, 1), mal(ay, -1), null);
    seite(P(-1, -1, 1), P(-1, -1, -1), P(-1, 1, -1), P(-1, 1, 1), mal(ax, -1), kreuzband);
    /* Schleife obenauf */
    B.ei(plus(c, [0, 0, m[2] / 2 + 0.03]), [0.06, 0, 0], [0, 0.03, 0], [0, 0, 0.03], band, { ebene: 2, tiefe: 0.05 });
  }

  /* Der Weihnachtsmann: sitzt, hält die Zügel, winkt beim Überflug */
  function weihnachtsmann(B, t, winken, fein, sehrFein) {
    const E = 2;
    const wind = Math.sin(t * 5.3) * 0.02;
    /* Beine: Oberschenkel rot, hohe schwarze Stiefel mit Pelzkrempe */
    for (const sd of [1, -1]) {
      B.glied([-0.16, sd * 0.15, 0.55], 0.115, [0.3, sd * 0.17, 0.6], 0.095, FARBE.mantel, { ebene: E });
      B.glied([0.3, sd * 0.17, 0.6], 0.085, [0.42, sd * 0.17, 0.16], 0.075, FARBE.stiefel, { ebene: E });
      B.ei([0.49, sd * 0.17, 0.09], [0.13, 0, 0], [0, 0.07, 0], [0, 0, 0.07], FARBE.stiefel, { ebene: E, glanz: 0.3 });
      {
        /* Pelzkrempe der Stiefel: flacher Ring um das Schienbein */
        const ax = einheit([0.12, 0, -0.44]), qa = [0, 1, 0], qb = kreuz(ax, qa);
        B.ei([0.355, sd * 0.17, 0.4], mal(ax, 0.035), mal(qa, 0.094), mal(qb, 0.094), FARBE.pelz, { ebene: E, tiefe: 0.02 });
      }
    }
    /* Rumpf: Mantel über dem runden Bauch */
    B.koerper([
      { c: [-0.22, 0, 0.58], a: [[0.26, 0, 0], [0, 0.3, 0], [0, 0, 0.16]] },
      { c: [-0.12, 0, 0.8], a: [[0.29, 0, 0], [0, 0.33, 0], [0, 0, 0.3]] },
      { c: [-0.2, 0, 1.08], a: [[0.2, 0, 0], [0, 0.28, 0], [0, 0, 0.2]] }
    ], FARBE.mantel, { ebene: E, flecken: fein ? [
      /* Pelzbesatz vorn: breiter weißer Streifen auf dem Mantel */
      { c: [0.16, 0, 0.8], a: [[0.08, 0, 0], [0, 0.065, 0], [0, 0, 0.32]], alb: FARBE.pelz, n: [1, 0, 0.2], k: 1, hart: 0.85 },
      { c: [0.05, 0, 1.1], a: [[0.08, 0, 0], [0, 0.06, 0], [0, 0, 0.12]], alb: FARBE.pelz, n: [0.7, 0, 0.7], k: 1, hart: 0.85 },
      /* Falten im Mantel: dunklere Züge seitlich am Bauch */
      { c: [-0.05, 0.3, 0.72], a: [[0.14, 0, 0], [0, 0.04, 0], [0, 0, 0.05]], alb: [120, 12, 18], n: [0, 1, 0], k: 0.5 },
      { c: [-0.05, -0.3, 0.72], a: [[0.14, 0, 0], [0, 0.04, 0], [0, 0, 0.05]], alb: [120, 12, 18], n: [0, -1, 0], k: 0.5 }
    ] : null });
    /* Pelzbesatz, Gürtel mit Goldschnalle, Kragen */
    if (!fein) B.glied([0.1, 0, 1.0], 0.04, [0.15, 0, 0.62], 0.04, FARBE.pelz, { ebene: E, tiefe: 0.1 });
    {
      const pts = [];
      for (let i = 0; i <= 20; i++) { const a = i / 20 * TAU; pts.push([-0.12 + Math.cos(a) * 0.3, Math.sin(a) * 0.34, 0.74]); }
      for (let i = 0; i < 20; i += 4) B.band(pts.slice(i, i + 5), 0.075, FARBE.guertel, { ebene: E, tiefe: 0.03 });
      B.platte([[0.19, 0.06, 0.79], [0.19, -0.06, 0.79], [0.19, -0.06, 0.69], [0.19, 0.06, 0.69]], FARBE.gold, { ebene: E, n: [1, 0, 0], tiefe: 0.12 });
    }
    B.ei([-0.19, 0, 1.22], [0.14, 0, 0], [0, 0.17, 0], [0, 0, 0.065], FARBE.pelz, { ebene: E, tiefe: 0.02 });
    /* Arme: links hält die Zügel, rechts winkt beim Überflug */
    for (const sd of [1, -1]) {
      const S = [-0.2, sd * 0.28, 1.1];
      const w = sd < 0 ? winken : 0;
      const zugEl = [-0.02, sd * 0.35, 0.88], zugHa = [0.26, sd * 0.2, 0.92];
      let El = zugEl, Ha = zugHa;
      if (w > 0) {
        /* Winken: Ellbogen seitlich auf Schulterhöhe, Unterarm aufrecht, die Hand pendelt */
        const pend = Math.sin(t * 8.5) * 0.09 * w;
        El = mix(zugEl, [-0.14, sd * 0.5, 1.16], w);
        Ha = mix(zugHa, [-0.1 + pend * 0.5, sd * 0.56 + pend, 1.46], w);
      }
      B.glied(S, 0.085, El, 0.075, FARBE.mantel, { ebene: E, tiefe: 0.05 });
      B.glied(El, 0.074, mix(El, Ha, 0.8), 0.064, FARBE.mantel, { ebene: E, tiefe: 0.05 });
      B.glied(mix(El, Ha, 0.74), 0.076, mix(El, Ha, 0.86), 0.072, FARBE.pelz, { ebene: E, tiefe: 0.06 });
      /* Fäustling: länglich in Armrichtung, mit Daumen */
      const ar = einheit(minus(Ha, El)), qu = einheit(kreuz(ar, [0, 0, 1]));
      const hm = plus(Ha, mal(ar, 0.02));
      B.ei(hm, mal(ar, 0.065), mal(qu, 0.048), mal(einheit(kreuz(qu, ar)), 0.034), FARBE.handschuh, { ebene: E, tiefe: 0.07 });
      B.ei(plus(hm, plus(mal(ar, -0.01), mal(qu, -sd * 0.045))), mal(ar, 0.03), mal(qu, 0.02), [0, 0, 0.02], FARBE.handschuh, { ebene: E, tiefe: 0.075 });
    }
    /* Kopf: Gesicht, Bart, Schnurrbart, Brauen, Mütze mit Bommel */
    const kopf = [-0.17, 0, 1.36];
    B.ei([-0.25, 0, 1.37], [0.08, 0, 0], [0, 0.12, 0], [0, 0, 0.1], FARBE.bart, { ebene: E });   // weißes Haar hinten
    B.kugel(kopf, 0.105, FARBE.haut, { ebene: E });
    if (fein) for (const sd of [1, -1]) B.kugel([-0.1, sd * 0.066, 1.345], 0.034, FARBE.wange, { ebene: E, tiefe: 0.04 });
    B.koerper([{ c: [-0.11, 0, 1.3], a: [[0.1, 0, 0], [0, 0.15, 0], [0, 0, 0.11]] }, { c: [-0.06, 0, 1.18], a: [[0.085, 0, 0], [0, 0.115, 0], [0, 0, 0.08]] }], FARBE.bart, { ebene: E, tiefe: 0.03 });
    B.kugel([-0.06, 0, 1.365], 0.026, FARBE.wange, { ebene: E, tiefe: 0.08 });
    for (const sd of [1, -1]) B.ei([-0.055, sd * 0.05, 1.33], [0.03, 0, 0], [0, 0.06, -0.012], [0, 0, 0.024], FARBE.bart, { ebene: E, tiefe: 0.09 });
    if (sehrFein) {
      for (const sd of [1, -1]) {
        B.kugel([-0.085, sd * 0.042, 1.4], 0.011, [74, 54, 46], { ebene: E, tiefe: 0.1 });
        B.ei([-0.08, sd * 0.046, 1.422], [0.02, 0, 0], [0, 0.03, 0], [0, 0, 0.01], FARBE.bart, { ebene: E, tiefe: 0.11 });
      }
    }
    /* Mütze: Pelzkrempe, roter Zipfel weht nach hinten, Bommel */
    B.ei([-0.18, 0, 1.45], [0.125, 0, 0], [0, 0.13, 0], [0, 0, 0.048], FARBE.pelz, { ebene: E, tiefe: 0.03 });
    const m1 = [-0.2, 0, 1.49], m2 = [-0.33, 0.03 + wind, 1.62], m3 = [-0.48, 0.08 + wind * 2, 1.58];
    B.glied(m1, 0.11, m2, 0.065, FARBE.mantel, { ebene: E, tiefe: 0.02 });
    B.glied(m2, 0.065, m3, 0.03, FARBE.mantel, { ebene: E, tiefe: 0.02 });
    B.kugel([-0.52, 0.09 + wind * 2.4, 1.55], 0.055, FARBE.pelz, { ebene: E, tiefe: 0.02 });
  }

  /* ---------------- Rentier-Aufstellung ---------------- */
  const TIERE = (function () {
    const liste = [{ d: 0, seite: 0, rudolph: true, saat: 3, geweih: 0.62, fell: [128, 90, 60], ph: 0.0 }];
    const fell = [[104, 84, 66], [96, 78, 60], [110, 90, 70], [92, 74, 58], [100, 82, 64], [114, 94, 74], [98, 80, 62], [106, 86, 68]];
    PAARE.forEach(function (d, i) {
      liste.push({ d: d, seite: 1, saat: 10 + i * 2, geweih: 0.92 + ((i * 37) % 17) / 60, fell: fell[i * 2], ph: 0.17 + i * 0.29 });
      liste.push({ d: d, seite: -1, saat: 11 + i * 2, geweih: 0.88 + ((i * 53) % 19) / 60, fell: fell[i * 2 + 1], ph: 0.3 + i * 0.31 });
    });
    return liste;
  })();

  /* Rahmen an der Bahn: vorn = Flugrichtung, oben leicht in die Kurve geneigt */
  function bahnRahmen(pf, d, seit, hoch, v, kam) {
    const pp = pfadPunkt(pf, d);
    const F = einheit(kam.v(pp.t));
    /* Querneigung aus der Krümmung (Kurvenflug) */
    const a = pfadPunkt(pf, d - 3).t, b = pfadPunkt(pf, d + 3).t;
    let dpsi = Math.atan2(b[1], b[0]) - Math.atan2(a[1], a[0]);
    if (dpsi > Math.PI) dpsi -= TAU; if (dpsi < -Math.PI) dpsi += TAU;
    const neig = klemm(Math.atan(v * v * (dpsi / 6) / 9.81) * 2.2, -0.42, 0.42);
    const U0 = einheit(minus([0, 0, 1], mal(F, F[2]))), L0 = kreuz(U0, F);
    const c = Math.cos(neig), s = Math.sin(neig);
    const U = plus(mal(U0, c), mal(L0, s)), Lv = minus(mal(L0, c), mal(U0, s));
    const o = plus(kam.p(pp.p), plus(mal(Lv, seit), mal(U, hoch)));
    return rahmen(o, F, Lv, U);
  }

  /* ---------------- Sternenspur ---------------- */
  function spurMalen(g, pf, p, t, Z, anker, sF, kam) {
    const gesamt = pf.L + TEAM;
    const dt = 0.022, leben = 2.6, n = Math.floor(leben / dt);
    const nacht = Z.nacht;
    g.save();
    g.globalCompositeOperation = "lighter";
    /* weicher Schleier dicht hinter dem Schlitten */
    const schleier = [];
    for (let k = 0; k < 28; k++) {
      const pk = p - k * 0.05 / DAUER * 1.0;
      if (pk < 0) break;
      const d = pk * gesamt - D_SCHLITTEN - 1.5;
      const w = pfadPunkt(pf, d).p;
      const c = kam.p([w[0], w[1], w[2] - 0.35 - k * 0.012]);
      schleier.push([anker[0] + pkt(R1, c) * sF, anker[1] + pkt(R2, c) * sF, k]);
    }
    if (schleier.length > 2) {
      const a = schleier[0], b = schleier[schleier.length - 1];
      const gr = g.createLinearGradient(a[0], a[1], b[0], b[1]);
      const al = 0.16 * (0.45 + 0.55 * nacht);
      gr.addColorStop(0, "rgba(255,226,160," + al.toFixed(3) + ")"); gr.addColorStop(1, "rgba(255,226,160,0)");
      g.strokeStyle = gr; g.lineCap = "round"; g.lineJoin = "round";
      g.lineWidth = Math.max(1.5, sF * 0.32);
      g.beginPath(); g.moveTo(a[0], a[1]);
      for (let i = 1; i < schleier.length; i++) g.lineTo(schleier[i][0], schleier[i][1]);
      g.stroke();
      g.lineWidth = Math.max(0.8, sF * 0.08);
      g.stroke();
    }
    /* Funken: fester Zufall je Geburtsstunde, sinken langsam und verglimmen */
    const t0 = Math.floor(t / dt);
    for (let k = 0; k < n; k++) {
      const nr = t0 - k, tb = nr * dt, alter = t - tb;
      if (alter < 0 || alter > leben) continue;
      const pk = p - alter / DAUER;
      if (pk < 0 || pk > 1) continue;
      const h1 = ST.hash2(nr, 1, 5), h2 = ST.hash2(nr, 2, 5), h3 = ST.hash2(nr, 3, 5), h4 = ST.hash2(nr, 4, 5);
      const d = pk * gesamt - D_SCHLITTEN - 1.4 - h4 * 0.6;
      const pp = pfadPunkt(pf, d);
      const w = pp.p;
      /* seitlich an den Kufen, leicht gestreut; sinkt, driftet */
      const quer = [-pp.t[1], pp.t[0], 0];
      const seite = (h1 - 0.5) * 1.6 + (h1 - 0.5) * alter * 0.9;
      const pw = [w[0] + quer[0] * seite + alter * 0.25, w[1] + quer[1] * seite, w[2] - 0.45 - alter * (0.35 + h2 * 0.5) - alter * alter * 0.08];
      const c = kam.p(pw);
      const x = anker[0] + pkt(R1, c) * sF, y = anker[1] + pkt(R2, c) * sF;
      if (x < -20 || y < -20 || x > K.W + 20 || y > K.H + 20) continue;
      const blende = Math.min(1, alter / 0.12) * Math.pow(1 - alter / leben, 1.4);
      const funkeln = 0.55 + 0.45 * Math.sin(t * (9 + h3 * 8) + nr);
      const a = blende * funkeln;
      if (a < 0.03) continue;
      const farbe = h3 < 0.55 ? "255,222,150" : h3 < 0.85 ? "255,250,236" : "200,222,255";
      const r = Math.max(1.1 * K.dpr, sF * (0.025 + h2 * 0.045)) * (0.8 + 0.4 * funkeln);
      const gr = g.createRadialGradient(x, y, 0, x, y, r * 2.6);
      gr.addColorStop(0, "rgba(" + farbe + "," + (0.95 * a).toFixed(3) + ")");
      gr.addColorStop(0.25, "rgba(" + farbe + "," + (0.35 * a).toFixed(3) + ")");
      gr.addColorStop(1, "rgba(" + farbe + ",0)");
      g.fillStyle = gr; g.fillRect(x - r * 2.6, y - r * 2.6, r * 5.2, r * 5.2);
      /* heller Kern – auch vor hellem Schnee am Tag sichtbar */
      g.globalCompositeOperation = "source-over";
      g.fillStyle = "rgba(255,250,232," + (0.9 * a).toFixed(3) + ")";
      g.beginPath(); g.arc(x, y, Math.max(0.6, r * 0.45), 0, TAU); g.fill();
      g.globalCompositeOperation = "lighter";
      if (h2 > 0.62) {
        /* Sternchen: vier feine Strahlen */
        const l = r * (2.2 + 2 * funkeln);
        g.strokeStyle = "rgba(" + farbe + "," + (0.7 * a).toFixed(3) + ")";
        g.lineWidth = Math.max(0.6, r * 0.22);
        g.beginPath(); g.moveTo(x - l, y); g.lineTo(x + l, y); g.moveTo(x, y - l); g.lineTo(x, y + l); g.stroke();
      }
    }
    g.restore();
  }

  /* ---------------- alles zusammen ---------------- */
  let schattenLw = null, schattenCache = null;
  /* Weicher Schatten eines fliegenden Dings auf dem Boden: auf einer
     kleinen Leinwand um den Schattenort gemalt, in der Auflösung des
     Halbschattens (≈ 0,35 m aus 40–50 m Höhe) – die weiche Kante entsteht
     beim Vergrößern, ohne Weichzeichner. Der Umriss wird nur alle 0,1 s
     neu gerechnet und dazwischen mitgeschoben. */
  function weicherSchatten(g, B, SX0, SY0, rS, Z, t, pf, name) {
    const schattenK = Z.schatten * 1.2;
    if (schattenK <= 0.02 || SX0 < -rS || SX0 > K.W + rS || SY0 < -rS || SY0 > K.H + rS) return;
    const f = klemm(1 / (0.35 * K.s), 0.07, 0.35);
    const w = Math.ceil(2 * rS * f) + 2, h = w;
    let c = schattenCache;
    if (!c || c.name !== name || c.s !== K.s || c.rS !== rS || c.dreh !== K.dreh || Math.abs(t - c.t) > 0.1 || c.pfad !== pf) {
      if (!schattenLw) schattenLw = document.createElement("canvas");
      if (schattenLw.width !== w || schattenLw.height !== h) { schattenLw.width = w; schattenLw.height = h; }
      const sg = schattenLw.getContext("2d");
      sg.setTransform(1, 0, 0, 1, 0, 0);
      sg.clearRect(0, 0, w, h);
      sg.save();
      sg.translate(-(SX0 - rS) * f, -(SY0 - rS) * f);
      B.schattenMalen(sg, f);
      sg.restore();
      sg.globalCompositeOperation = "source-in";
      sg.fillStyle = B.jahr === "winter" ? "rgb(40,62,120)" : "rgb(22,34,52)";
      sg.fillRect(0, 0, w, h);
      sg.globalCompositeOperation = "source-over";
      c = schattenCache = { name: name, s: K.s, rS: rS, dreh: K.dreh, t: t, pfad: pf };
    }
    g.save();
    g.globalAlpha = Math.min(0.6, schattenK);
    g.imageSmoothingEnabled = true;
    g.drawImage(schattenLw, 0, 0, w, h, SX0 - rS, SY0 - rS, w / f, h / f);
    g.restore();
  }
  function santaZeichnen(g, t, Z) {
    const pf = flug.pfad, p = flug.p;
    const gesamt = pf.L + TEAM, v = gesamt / DAUER;
    const dK = p * gesamt;
    /* Größe: wächst mit dem Zoom; weit herausgezoomt wird das Gespann nur
       sanft überhöht (Wurzel), damit es erkennbar bleibt, ohne riesig zu wirken */
    const sF = Math.max(K.s, Math.sqrt(17 * K.dpr * K.s));
    const A = pfadPunkt(pf, dK - D_SCHLITTEN).p;
    const AS = ST.proj(A[0], A[1], A[2]);
    const kam = {
      p: function (w) { const r = ST.drehXY(w[0] - A[0], w[1] - A[1], K.dreh); return [r[0], r[1], w[2] - A[2]]; },
      v: function (w) { const r = ST.drehXY(w[0], w[1], K.dreh); return [r[0], r[1], w[2]]; }
    };
    const nadir = ST.proj(A[0], A[1], 0);
    const SX0 = nadir[0] + (LA - LB) * KX * A[2] * K.s, SY0 = nadir[1] + (LA + LB) * KY * A[2] * K.s;
    /* In 40 m Höhe liegt mehr Himmelslicht auf dem Gespann als unten
       zwischen den Häusern; nachts ein kühler Mondschimmer */
    const Zh = Object.assign({}, Z, { amb: Z.amb.map((x, i) => x + (Z.nacht > 0.5 ? [0.1, 0.12, 0.2][i] : 0.08)) });
    const B = new Buehne({ s: sF, X0: AS[0], Y0: AS[1], SX0: SX0, SY0: SY0, Z: Zh, jahr: "winter" });
    const winken = glatt(0.3, 0.42, p) * (1 - glatt(0.64, 0.74, p));

    /* Rentiere */
    const punkte = [];
    for (const r of TIERE) {
      const R = bahnRahmen(pf, dK - r.d, r.seite * SEITE, 0.62, v, kam);
      B.gruppe(pkt(R.o, AUGE));
      const ph = t * 2.05 + r.ph;
      const a = rentier(B, R, ph, { rudolph: r.rudolph, geweih: r.geweih, fell: r.fell });
      a.r = r;
      punkte.push(a);
      if (r.rudolph) {
        const puls = 0.85 + 0.15 * Math.sin(t * 3.1);
        B.glanz.push({ p: a.nase, r: 0.35 + 0.6 * Z.nacht, farbe: "255,70,50", k: (0.5 + 0.5 * Z.nacht) * puls });
        if (Z.nacht > 0.1) B.glanz.push({ p: a.nase, r: 2.8, farbe: "255,40,30", k: 0.34 * Z.nacht * puls });
      }
    }
    /* Schlitten */
    const RS = bahnRahmen(pf, dK - D_SCHLITTEN, 0, 0, v, kam);
    B.gruppe(pkt(RS.o, AUGE));
    /* die beiden Schlittenlaternen leuchten den Weihnachtsmann warm an */
    B.rahmen(RS);
    B.lampen = [1, -1].map((sd) => ({ p: B.pk([1.3, sd * 0.74, 1.05]), r: 2.6, farbe: [1, 0.72, 0.4], k: 0.12 + 0.55 * Z.nacht }));
    const sl = schlitten(B, RS, t, winken, Z);

    /* Mittelleine, Zugstränge, Zügel */
    B.rahmen(rahmen([0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1]));
    const leine = (a, b, sack, breite, alb) => {
      const m = plus(mix(a, b, 0.5), [0, 0, -sack]);
      B.gruppe(pkt(m, AUGE) + 0.2);
      B.band([a, mix(mix(a, m, 0.5), mix(a, b, 0.25), 0.5), m, mix(mix(m, b, 0.5), mix(a, b, 0.75), 0.5), b], breite, alb);
    };
    const paar = (i) => [punkte[1 + i * 2], punkte[2 + i * 2]];
    let vorne = sl.haken;
    for (let i = PAARE.length - 1; i >= 0; i--) {
      const [l, r] = paar(i);
      const mitte = mix(l.brust, r.brust, 0.5), hinten = mix(l.hinten, r.hinten, 0.5);
      leine(vorne, hinten, 0.12, 0.028, FARBE.leine);
      leine(hinten, mitte, 0.03, 0.028, FARBE.leine);
      leine(l.kummet[1], hinten, 0.04, 0.03, FARBE.leder);
      leine(r.kummet[0], hinten, 0.04, 0.03, FARBE.leder);
      vorne = mitte;
    }
    const ru = punkte[0];
    leine(vorne, ru.hinten, 0.12, 0.028, FARBE.leine);
    leine(ru.kummet[0], ru.hinten, 0.04, 0.03, FARBE.leder);
    leine(ru.kummet[1], ru.hinten, 0.04, 0.03, FARBE.leder);
    /* Zügel von den Händen zum hintersten Paar */
    const [hl, hr] = paar(PAARE.length - 1);
    leine(sl.haende[0], hl.kummet[0], 0.25, 0.018, FARBE.leder);
    leine(sl.haende[winken > 0.3 ? 0 : 1], hr.kummet[1], 0.25, 0.018, FARBE.leder);

    /* 1. Schatten auf dem Schnee */
    if (!MESS.ohneSchatten) weicherSchatten(g, B, SX0, SY0, TEAM * sF * 1.6, Z, t, pf, "santa");
    /* 2. Sternenspur hinter dem Schlitten */
    if (!MESS.ohneSpur) spurMalen(g, pf, p, t, Z, AS, sF, kam);
    /* 3. Gespann */
    const rand = TEAM * sF * 1.2;
    if (!MESS.ohneGespann && AS[0] > -rand && AS[0] < K.W + rand && AS[1] > -rand && AS[1] < K.H + rand) B.malen(g);
  }

  /* Prüfbogen: ein Rentier in acht Galopp-Phasen, von der Seite */
  function galoppBogen(g, t, Z) {
    const s = Math.max(40, K.s);
    for (let i = 0; i < 8; i++) {
      const X = K.W * (0.13 + (i % 4) * 0.25), Y = K.H * (i < 4 ? 0.35 : 0.8);
      const B = new Buehne({ s: s, X0: X, Y0: Y, Z: Z, jahr: "winter" });
      /* Blick von der Seite (santagier=0: vorn = Bild rechts) */
      const h = -Math.PI / 4 + (+q.get("santagier") || 0) * Math.PI / 180;
      const F = [Math.cos(h), Math.sin(h), 0], Lv = kreuz([0, 0, 1], F);
      const R = rahmen([0, 0, 0], F, Lv, [0, 0, 1]);
      B.gruppe(0);
      rentier(B, R, i / 8, { rudolph: i === 0, geweih: 1, fell: [104, 84, 66], phasen: [0, 0.1, 0.48, 0.58] });
      B.malen(g);
      g.fillStyle = "rgba(255,255,255,0.8)"; g.font = (12 * K.dpr) + "px sans-serif"; g.fillText("Phase " + i + "/8", X - 30, Y + s * 1.2);
    }
  }

  /* =====================================================================
     IM FRÜHLING: WEISSSTÖRCHE
     XANDER: „… dass wir das später in einen Frühlingsgewand packen können."
     Statt des Weihnachtsmanns ziehen im Frühling drei Weißstörche in
     großen Bögen über das Dorf – meist segelnd, dann ein paar ruhige
     Flügelschläge; die schwarzen Handschwingen gespreizt wie Finger,
     roter Schnabel, rote Beine nach hinten gestreckt. Ihr Schatten zieht
     über die Wiese. Prüfbild: storch=0.5 (wie santa=…).
     ===================================================================== */
  const S_PERIODE = 50, S_DAUER = 18, S_ERSTER = 10, S_TEAM = 9;
  const S_ZWANG = q.has("storch") ? klemm(+q.get("storch") || 0, 0, 1) : null;
  const STOERCHE = [{ d: 0, seite: 0, hoch: 0, ph: 0 }, { d: 4.2, seite: 2.8, hoch: 1.3, ph: 0.37 }, { d: 7.6, seite: -2.3, hoch: -0.9, ph: 0.71 }];
  const S_OPT = { hoehe: 34, team: S_TEAM, anker: 0, saat: 777 };
  let vogel = null;
  function vogelAktiv(SZ) {
    if (!SZ || SZ.jahr === "winter") return false;
    if (SZ.zeit === "nacht" && S_ZWANG == null) return false;      // Störche fliegen nicht bei Nacht
    if (WERKBANK && S_ZWANG == null) return false;
    return true;
  }
  function vogelBewegen(dt, t, SZ) {
    if (!vogelAktiv(SZ)) { vogel = null; return; }
    if (S_ZWANG != null) { if (!vogel) vogel = { n: 0, pfad: pfadBauen(0, S_ZWANG, S_OPT), p: S_ZWANG }; vogel.p = S_ZWANG; return; }
    if (t < S_ERSTER) { vogel = null; return; }
    const n = Math.floor((t - S_ERSTER) / S_PERIODE), start = S_ERSTER + n * S_PERIODE + ST.hash2(n, 5, 71) * 8;
    const p = (t - start) / S_DAUER;
    if (p < 0 || p > 1) { vogel = null; return; }
    if (!vogel || vogel.n !== n) vogel = { n: n, pfad: pfadBauen(n + 3, null, S_OPT), p: p };
    vogel.p = p;
  }
  const WEISS = [238, 236, 230], SCHWARZ = [34, 32, 34], SCHNABEL = [218, 72, 44];
  function storch(B, R, t, ph) {
    B.rahmen(R);
    const fein = B.s > 30;
    /* meist Segeln (Flügel leicht angehoben), alle paar Sekunden zwei, drei ruhige Schläge */
    const zyk = (t * 0.2 + ph) % 1;
    const schlag = zyk < 0.3 ? Math.sin(zyk / 0.3 * Math.PI * 5) * Math.sin(zyk / 0.3 * Math.PI) : 0;
    const d1 = 0.07 + 0.42 * schlag, d2 = d1 * 1.35 + 0.1 - 0.12 * Math.max(0, -schlag);
    /* Rumpf, Schwanz, Hals, Kopf, Schnabel, Beine */
    B.ei([0, 0, 0], [0.3, 0, 0], [0, 0.13, 0], [0, 0, 0.12], WEISS);
    B.ei([-0.34, 0, 0.01], [0.12, 0, 0], [0, 0.1, 0], [0, 0, 0.03], WEISS, { tiefe: -0.01 });
    B.glied([0.2, 0, 0.03], 0.075, [0.5, 0, 0.01], 0.042, WEISS);
    B.ei([0.56, 0, 0.01], [0.065, 0, 0], [0, 0.042, 0], [0, 0, 0.048], WEISS, { tiefe: 0.01 });
    B.glied([0.6, 0, 0.0], 0.02, [0.85, 0, -0.035], 0.005, SCHNABEL, { tiefe: 0.02 });
    if (fein) for (const sd of [1, -1]) B.kugel([0.585, sd * 0.03, 0.022], 0.009, SCHWARZ, { tiefe: 0.02 });
    for (const sd of [1, -1]) B.band([[-0.14, sd * 0.045, -0.09], [-0.5, sd * 0.04, -0.11], [-0.8, sd * 0.03, -0.12]], 0.02, SCHNABEL, { tiefe: -0.02 });
    /* Flügel: Armschwinge und Handschwinge mit eigenem Winkel; vorn weiß, hinten schwarz */
    for (const sd of [1, -1]) {
      const wp = (x, y) => { const yi = Math.min(y, 0.5), yo = Math.max(0, y - 0.5); return [x, sd * (0.1 + yi * Math.cos(d1) + yo * Math.cos(d2)), 0.03 + yi * Math.sin(d1) + yo * Math.sin(d2)]; };
      const o = { beidseitig: true, tiefe: 0.01 };
      B.platte([wp(0.16, 0), wp(0.18, 0.5), wp(-0.02, 0.5), wp(-0.05, 0)], WEISS, o);
      B.platte([wp(-0.05, 0), wp(-0.02, 0.5), wp(-0.21, 0.5), wp(-0.2, 0)], SCHWARZ, o);
      B.platte([wp(0.18, 0.5), wp(0.12, 0.93), wp(0.0, 0.95), wp(-0.02, 0.5)], WEISS, o);
      B.platte([wp(-0.02, 0.5), wp(0.0, 0.95), wp(-0.17, 0.97), wp(-0.21, 0.5)], SCHWARZ, o);
      /* gespreizte Handschwingen */
      for (let i = 0; i < 5; i++) B.band([wp(0.09 - i * 0.055, 0.93), wp(0.12 - i * 0.07, 1.14 - i * 0.025)], 0.04, SCHWARZ, { breite2: 0.018, tiefe: 0.012 });
    }
  }
  function vogelZeichnen(g, t, Z) {
    const pf = vogel.pfad, p = vogel.p;
    const gesamt = pf.L + S_TEAM, v = gesamt / S_DAUER, dK = p * gesamt;
    const sF = Math.max(K.s, Math.sqrt(20 * K.dpr * K.s));
    const A = pfadPunkt(pf, dK).p;
    const AS = ST.proj(A[0], A[1], A[2]);
    const kam = {
      p: function (w) { const r = ST.drehXY(w[0] - A[0], w[1] - A[1], K.dreh); return [r[0], r[1], w[2] - A[2]]; },
      v: function (w) { const r = ST.drehXY(w[0], w[1], K.dreh); return [r[0], r[1], w[2]]; }
    };
    const nadir = ST.proj(A[0], A[1], 0);
    const SX0 = nadir[0] + (LA - LB) * KX * A[2] * K.s, SY0 = nadir[1] + (LA + LB) * KY * A[2] * K.s;
    const Zh = Object.assign({}, Z, { amb: Z.amb.map((x) => x + 0.06) });
    const B = new Buehne({ s: sF, X0: AS[0], Y0: AS[1], SX0: SX0, SY0: SY0, Z: Zh, jahr: "fruehling" });
    for (const st of STOERCHE) {
      /* Störche schaukeln leicht auf und ab (Thermik) */
      const R = bahnRahmen(pf, dK - st.d, st.seite, st.hoch + 0.25 * Math.sin(t * 0.7 + st.ph * 6), v, kam);
      B.gruppe(pkt(R.o, AUGE));
      storch(B, R, t, st.ph);
    }
    weicherSchatten(g, B, SX0, SY0, S_TEAM * sF * 1.4, Z, t, pf, "storch");
    const rand = S_TEAM * sF * 1.4;
    if (AS[0] > -rand && AS[0] < K.W + rand && AS[1] > -rand && AS[1] < K.H + rand) B.malen(g);
  }

  ST.himmel = {
    bewegen: function (dt, t, SZ) {
      try { bewegen(dt, t, SZ); } catch (e) { console.error(e); flug = null; }
      try { vogelBewegen(dt, t, SZ); } catch (e) { console.error(e); vogel = null; }
    },
    zeichnen: function (g, t, Z, SZ) {
      if (TEST === "galopp") { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); galoppBogen(g, t, Z); g.restore(); return; }
      if (vogel && vogelAktiv(SZ)) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); try { vogelZeichnen(g, t, Z); } catch (e) { console.error(e); } g.restore(); }
      if (!flug || !aktiv(SZ)) return;
      if (ZWANG != null && !flug.pfad) flug.pfad = pfadBauen(0, ZWANG);
      g.save();
      g.setTransform(1, 0, 0, 1, 0, 0);
      try { santaZeichnen(g, t, Z); } catch (e) { console.error(e); } finally { g.restore(); }
    },
    /* für andere Module: fliegt er gerade, und wo? */
    flug: function () { return flug; },
    mess: MESS
  };
})();
