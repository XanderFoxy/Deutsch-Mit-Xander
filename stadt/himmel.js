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
   Beim Überflug winkt er hinunter. Hinter dem Schlitten bleibt ein
   weicher Sternenschleier zurück (kein Strich), und der Schatten des
   Gespanns gleitet weich über den Schnee – genau dort, wo die Sonne ihn
   hinwirft (dieselbe Richtung wie bei den Häusern), UNTER Häusern und
   Lichtern. Nur im Winter; der erste Flug etwa 22 s nach dem Öffnen, dann
   ungefähr jede Minute (14 s lang, 12,5 m/s, Kurve mit 60–120° Kurs-
   änderung und Querneigung). Die Bahn wird bei Flugbeginn so gelegt, dass
   sie durch das Bild führt, das man gerade ansieht – danach bleibt sie
   fest in der Welt. Damit man die Höhe liest: Luftperspektive (das
   Gespann ist etwas heller, bläulicher, kontrastärmer), Dunstschleier
   5–8 m darunter, die langsamer ziehen, und eine Bahn, auf der der
   Schatten dieselbe Bildgegend kreuzt. Schlittenglöckchen als Web-Audio-
   Schleife mit Ein- und Ausblenden, Lautstärke und Links-rechts nach der
   Lage im Bild (ersatzweise ST.ton("schlitten")). Nachts leuchten die
   Schlittenlaternen den Weihnachtsmann an. Hohe Türme (Dom) verdecken
   das Gespann, wenn es dahinter vorbeifliegt.

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
     B.ao(c, a1, a2, k) (Kontaktschatten) · B.malen(g) · B.schattenMalen(sg)
   Stoffe (Optionen von B.koerper): matt (stumpfes Licht statt Plastik),
   fell { n, laenge, richtung } (Fell- oder Stoffstriche, nur nah),
   pelz (flockiger Rand und Flockenrauschen), samt (Glanzkante), kontur.
   Detailstufen nach Pixeln je Meter (B.s): klein nur die Form, groß
   Augen, Glöckchen, Goldzier, Knöpfe, Fellzeichnung.

   PRÜFBILDER (URL-Parameter)
     santa=0.5        Flugphase 0…1 erzwingen (unabhängig von der Zeit)
     santakurs=45     gerade Bahn durch die Bildmitte, Kurs im Bild
                      (0 = nach rechts, 90 = auf den Betrachter zu …)
     santahoehe=40    Flughöhe dazu
     santamitte=7     welcher Punkt des Gespanns in der Bildmitte liegt
                      (Meter hinter Rudolph; ohne Angabe der Schlitten)
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

  /* Luftperspektive: solange DUNST gesetzt ist (nur beim Malen des
     Gespanns in 40 m Höhe), wird jede Farbe ein wenig zur Farbe der Luft
     hin gemischt – heller, bläulicher, weniger Kontrast. So liest sich
     das Gespann als „weit oben", nicht als Spielzeug auf dem Dach. */
  let DUNST = null;
  function rgbAus(alb, f, a) {
    let r = Math.min(255, alb[0] * f[0]), g = Math.min(255, alb[1] * f[1]), b = Math.min(255, alb[2] * f[2]);
    if (DUNST) { const k = DUNST[3]; r += (DUNST[0] - r) * k; g += (DUNST[1] - g) * k; b += (DUNST[2] - b) * k; }
    r = r | 0; g = g | 0; b = b | 0;
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

  /* Stumpfes Licht (Fell, Wolle, Loden): weniger Unterschied zwischen Licht-
     und Schattenseite als bei glattem Lack – sonst wirkt alles wie Plastik */
  BP.lichtMatt = function (n, p, matt) {
    const f = this.licht(n, p);
    if (!matt) return f;
    const m = this.licht(KUGEL[3].n, p);
    return [f[0] + (m[0] - f[0]) * matt, f[1] + (m[1] - f[1]) * matt, f[2] + (m[2] - f[2]) * matt];
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
    /* Fell- oder Stoffstruktur: Richtung der Striche (lokal) in den Kameraraum */
    if (opt.fell) t.fell = Object.assign({}, opt.fell, { R: opt.fell.richtung ? einheit(this.rk(opt.fell.richtung)) : null });
    this.gr.teile.push(t);
    return t;
  };
  /* Umgebungsverdeckung: weicher dunkler Fleck, wo zwei Dinge sich berühren
     (Sack auf dem Boden, Bart auf der Brust, Rumpf über den Beinen).
     c = Mitte, a1/a2 = Halbachsen der Fläche, auf der er liegt (lokal). */
  BP.ao = function (c, a1, a2, k, opt) {
    opt = opt || {};
    const p = this.pk(c);
    const t = { art: "a", c: p, a: [this.rk(a1), this.rk(a2), [0, 0, 0.001]], k: k, opt: opt, m: p, ebene: opt.ebene || 0, tiefe: pkt(p, AUGE) + (opt.tiefe || 0) };
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
        else if (t.art === "a") this.aoMalen(g, t);
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
          gr.addColorStop((tq + 1) / 2, rgbAus(alb, this.lichtMatt(n, t.m, o.matt)));
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
        for (const k of KUGEL) gr.addColorStop(k.f, rgbAus(alb, this.lichtMatt(k.n, t.m, o.matt)));
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
    /* Fell/Stoff: kurze Striche entlang der Wuchs- bzw. Fadenrichtung (nur nah) */
    if (t.fell && kl > 9) this.fellMalen(g, t, ells);
    /* Pelz: flockiger, unruhiger Rand und Flockenrauschen statt glatter Ellipse */
    if (o.pelz && kl > 2.2) this.pelzMalen(g, t, ells, kl);
    /* Samt: helle Glanzkante an den Wölbungen, zur Sonne hin kräftiger */
    if (o.samt && kl > 3) {
      g.save(); g.beginPath(); koerperPfad(g, ells); g.clip();
      const e = groesste, r = Math.max(e.r1, e.r2);
      const gr = g.createLinearGradient(e.cx + HDX * r, e.cy + HDY * r, e.cx - HDX * r, e.cy - HDY * r);
      const hellS = mix(alb, [255, 228, 226], 0.5);
      gr.addColorStop(0, rgbAus(hellS, this.licht(KUGEL[1].n, t.m), (0.5 * o.samt).toFixed(3)));
      gr.addColorStop(1, rgbAus(hellS, this.licht(KUGEL[7].n, t.m), (0.12 * o.samt).toFixed(3)));
      g.strokeStyle = gr; g.lineWidth = Math.max(1, kl * 0.14); g.stroke();
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

  /* Fell- oder Stoffstriche auf einem Körper: Punkte auf den Ellipsoiden,
     die zum Betrachter zeigen, kurze Striche in Wuchsrichtung (in der
     Tangentialebene). Neutral dunkle bzw. helle Striche – so passen sie auf
     jede Fellpartie (dunkler Rücken, heller Bauch). Fester Zufall je Teil. */
  BP.fellMalen = function (g, t, ells) {
    const F = t.fell, s = this.s, rng = ST.zufall(F.saat || 7);
    const n = F.n || 60, lw = Math.max(0.55, s * (F.breite || 0.005)), aa = F.a == null ? 0.3 : F.a;
    g.save(); g.beginPath(); koerperPfad(g, ells); g.clip();
    g.lineCap = "round";
    const dunkelS = [], hellS = [];
    for (let i = 0; i < n; i++) {
      const e = t.E[(rng() * t.E.length) | 0];
      let u0 = rng() * 2 - 1, u1 = rng() * 2 - 1, u2 = rng() * 2 - 1;
      const z1 = rng(), z2 = rng();
      const lu = Math.hypot(u0, u1, u2) || 1; u0 /= lu; u1 /= lu; u2 /= lu;
      const A = e.a || [[e.r, 0, 0], [0, e.r, 0], [0, 0, e.r]];
      const p = plus(e.c, plus(mal(A[0], u0), plus(mal(A[1], u1), mal(A[2], u2))));
      const q0 = pkt(A[0], A[0]) || 1e-6, q1 = pkt(A[1], A[1]) || 1e-6, q2 = pkt(A[2], A[2]) || 1e-6;
      const nn = einheit(plus(mal(A[0], u0 / q0), plus(mal(A[1], u1 / q1), mal(A[2], u2 / q2))));
      const sicht = pkt(nn, AUGE);
      if (sicht < 0.18) continue;
      const R = F.R || einheit(minus(t.E[t.E.length - 1].c, t.E[0].c));
      const d = minus(R, mal(nn, pkt(R, nn)));
      let dx = pkt(R1, d), dy = pkt(R2, d);
      const ld = Math.hypot(dx, dy);
      if (ld < 0.05) continue;
      dx /= ld; dy /= ld;
      const wj = (z2 - 0.5) * (F.streu == null ? 0.5 : F.streu), cw = Math.cos(wj), sw = Math.sin(wj);
      const ex = dx * cw - dy * sw, ey = dx * sw + dy * cw;
      const len = (F.laenge || 0.05) * s * (0.6 + z1 * 0.8) * Math.min(1, ld);
      const X = this.X0 + pkt(R1, p) * s, Y = this.Y0 + pkt(R2, p) * s;
      (z1 < 0.58 ? dunkelS : hellS).push(X, Y, X + ex * len, Y + ey * len);
    }
    const zug = (L, farbe) => { if (!L.length) return; g.strokeStyle = farbe; g.beginPath(); for (let i = 0; i < L.length; i += 4) { g.moveTo(L[i], L[i + 1]); g.lineTo(L[i + 2], L[i + 3]); } g.stroke(); };
    g.lineWidth = lw;
    const lichtK = Math.min(1, (this.Z.sonne[0] + this.Z.amb[0]) / 0.9);
    zug(dunkelS, "rgba(24,14,8," + (aa * 0.75).toFixed(3) + ")");
    zug(hellS, "rgba(255,246,232," + (aa * 0.55 * lichtK).toFixed(3) + ")");
    g.restore();
  };
  /* Pelz (Besatz am Mantel, Bart, Bommel): kleine Flocken rund um den Umriss
     – im Licht der Randnormalen gefärbt – und leises Flockenrauschen innen */
  BP.pelzMalen = function (g, t, ells, kl) {
    const s = this.s, f = [];
    for (const e of ells) ellipsePunkte(e, Math.max(16, Math.min(72, Math.ceil(e.r1 * 0.9))), f);
    const h = huelle(f);
    if (h.length < 3) return;
    let cx = 0, cy = 0;
    for (const i of h) { cx += f[2 * i]; cy += f[2 * i + 1]; }
    cx /= h.length; cy /= h.length;
    const rng = ST.zufall(t.opt.pelzSaat || ((t.m[0] * 997 + t.m[2] * 131) | 0) || 5);
    const rB = Math.max(0.7, Math.min(kl * 0.16, s * (t.opt.flocke || 0.02)));
    const schritt = rB * 1.25;
    for (let k = 0; k < h.length; k++) {
      const a = h[k], b = h[(k + 1) % h.length];
      const ax = f[2 * a], ay = f[2 * a + 1], bx = f[2 * b], by = f[2 * b + 1];
      const l = Math.hypot(bx - ax, by - ay), m = Math.max(1, Math.round(l / schritt));
      let nx = by - ay, ny = -(bx - ax);
      const ln = Math.hypot(nx, ny) || 1; nx /= ln; ny /= ln;
      if ((ax - cx) * nx + (ay - cy) * ny < 0) { nx = -nx; ny = -ny; }
      const nn = einheit(plus(mal(R1, nx), mal(R2, ny)));
      g.fillStyle = rgbAus(t.alb, this.licht(nn, t.m));
      g.beginPath();
      for (let j = 0; j < m; j++) {
        const q = (j + rng()) / m, x = ax + (bx - ax) * q, y = ay + (by - ay) * q;
        const r = rB * (0.55 + rng() * 0.8), aus = rB * (rng() * 0.85 - 0.35);
        g.moveTo(x + nx * aus + r, y + ny * aus); g.arc(x + nx * aus, y + ny * aus, r, 0, TAU);
      }
      g.fill();
    }
    if (kl > 7) {
      /* Flockenrauschen innen: helle und dunkle Tupfen im Umriss */
      g.save(); g.beginPath(); koerperPfad(g, ells); g.clip();
      let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      for (const i of h) { x0 = Math.min(x0, f[2 * i]); x1 = Math.max(x1, f[2 * i]); y0 = Math.min(y0, f[2 * i + 1]); y1 = Math.max(y1, f[2 * i + 1]); }
      const n = Math.min(160, Math.round((x1 - x0) * (y1 - y0) / (rB * rB * 5)));
      const dunkel = [], hell = [];
      for (let i = 0; i < n; i++) { const x = x0 + rng() * (x1 - x0), y = y0 + rng() * (y1 - y0), r = rB * (0.35 + rng() * 0.5); (rng() < 0.5 ? dunkel : hell).push(x, y, r); }
      const tupf = (L, farbe) => { g.fillStyle = farbe; g.beginPath(); for (let i = 0; i < L.length; i += 3) { g.moveTo(L[i] + L[i + 2], L[i + 1]); g.arc(L[i], L[i + 1], L[i + 2], 0, TAU); } g.fill(); };
      tupf(dunkel, "rgba(70,62,86,0.13)");
      tupf(hell, "rgba(255,255,255,0.2)");
      g.restore();
    }
  };
  /* Umgebungsverdeckung malen (weicher dunkler Fleck) */
  BP.aoMalen = function (g, t) {
    const e = ellipse({ c: t.c, a: t.a }, MB, this.s, this.X0, this.Y0);
    if (e.r1 < 1.2) return;
    const k = t.k * (DUNST ? 1 - DUNST[3] * 1.5 : 1) * (0.55 + 0.45 * Math.min(1, this.Z.amb[0] / 0.6));
    if (k <= 0.01) return;
    g.save();
    g.translate(e.cx, e.cy); g.rotate(e.phi); g.scale(Math.max(0.5, e.r1), Math.max(0.5, e.r2));
    const gr = g.createRadialGradient(0, 0, 0, 0, 0, 1);
    gr.addColorStop(0, "rgba(18,10,14," + k.toFixed(3) + ")"); gr.addColorStop(0.45, "rgba(18,10,14," + (k * 0.6).toFixed(3) + ")"); gr.addColorStop(1, "rgba(18,10,14,0)");
    g.fillStyle = gr; g.beginPath(); g.arc(0, 0, 1, 0, TAU); g.fill();
    g.restore();
  };

  BP.bandMalen = function (g, t) {
    const s = this.s;
    const n = t.n || einheit(plus(AUGE, [0, 0, 0.6]));
    const f = t.opt.leucht ? [1, 1, 1] : this.licht(n, t.m);
    const farbe = rgbAus(t.alb, f);
    g.lineCap = "round"; g.lineJoin = "round";
    const pts = t.P.map((p) => this.bild(p));
    if (t.opt.praege && t.breite * s > 1.4) {
      /* geprägte Leiste: Schattenkante auf der dem Licht abgewandten Seite */
      const dx = -HDX * t.breite * s * 0.3, dy = -HDY * t.breite * s * 0.3;
      g.strokeStyle = rgbAus(mal(t.alb, 0.3), f, 0.75); g.lineWidth = t.breite * s;
      g.beginPath(); g.moveTo(pts[0][0] + dx, pts[0][1] + dy);
      for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0] + dx, pts[i][1] + dy);
      g.stroke();
    }
    g.strokeStyle = farbe;
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
    if (t.opt.samt && this.s > 22 && sicht > 0) {
      /* Samt: an den Kanten glänzt der Flor hell auf */
      g.save(); g.clip();
      g.lineWidth = Math.max(1, this.s * 0.05);
      g.strokeStyle = rgbAus(mix(alb, [255, 226, 224], 0.45), this.licht(n, t.m), (0.3 * t.opt.samt).toFixed(3));
      g.stroke();
      g.restore();
    }
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
  const MITTE = q.has("santamitte") ? +q.get("santamitte") : null;
  const TEST = q.get("santatest");
  const WERKBANK = !!q.get("werkbank");
  const STILL = q.get("still") === "1";
  /* Gespann: Abstände entlang der Bahn (Meter hinter Rudolph) */
  const PAARE = [2.55, 5.1, 7.65, 10.2];
  const D_SCHLITTEN = 13.5, TEAM = D_SCHLITTEN + 1.9, SEITE = 0.72;
  const D_SCHL = D_SCHLITTEN, TEAM_S = TEAM;

  let flug = null;     // { n, pfad, p, ton }
  const MESS = {};     // nur zum Messen der Rechenzeit (ST.himmel.mess)

  /* Die Flugbahn: eine weite Kurve (60–120° Kursänderung), die durch das
     Bild führt, das man beim Start des Flugs ansieht – danach bleibt sie
     fest in der Welt. Gerechnet in Bodenachsen: r = Meter nach rechts,
     v = Meter „auf den Betrachter zu". Das Tempo ist fest (≈ 12,5 m/s,
     wie ein zügiger Galopp) – die Weglänge folgt aus 14 s Flugzeit, nicht
     aus der Bildbreite. Der Kurvenradius und der Scheitel sind dagegen
     Bildanteile, damit man die Kurve bei jedem Zoom sieht.
     WARUM DIAGONAL: in der Schrägsicht verrät nur der Schatten die Höhe.
     In 40 m Höhe liegt er ≈ 1,24·z nach rechts und ≈ 0,7·z tiefer im Bild.
     Fliegt das Gespann diagonal auf den Betrachter zu, läuft sein Schatten
     auf derselben Linie voraus: bei s ≈ 10–16 sieht man beide zugleich
     (Gespann oben links, Schatten unten rechts), bei stärkerem Zoom kreuzt
     erst der Schatten und dann das Gespann dieselbe Bildgegend. */
  const TEMPO = 12.5;
  function pfadBauen(n, pZiel, opt) {
    opt = opt || {};
    const rng = ST.zufall((opt.saat || 4242) + n * 977);
    const team = opt.team || TEAM_S, anker = opt.anker == null ? D_SCHL : opt.anker;
    const tempo = opt.tempo || TEMPO, dauer = opt.dauer || DAUER;
    const gesamt = tempo * dauer, L = gesamt - team;
    const s0 = Math.max(3, K.s), W = K.W, H = K.H, sCss = s0 / (K.dpr || 1);
    /* Bildpunkt (relativ zur Bildmitte, Gerätepixel) in Höhe z → Bodenachsen */
    const rv = (X, Y, z) => [X / s0, 2 * (Y / s0 + KZ * z)];
    const z0 = HOEHE || opt.hoehe || 40;
    const schritt = 0.5;
    let pts;
    if (KURS != null) {
      /* Prüfbahn: gerade durch die Bildmitte */
      const w = KURS * Math.PI / 180, dr = Math.cos(w), dv = Math.sin(w);
      const dS = (pZiel == null ? 0.5 : pZiel) * gesamt - (MITTE == null || opt.team ? anker : MITTE);
      const m = rv(0, 0, z0);
      pts = [];
      for (let d = 0; d <= L + 1e-6; d += schritt) pts.push([m[0] + dr * (d - dS), m[1] + dv * (d - dS), z0]);
    } else {
      /* Schattenversatz im Bild (Gerätepixel) in Flughöhe */
      const offX = (LA - LB) * KX * z0 * s0, offY = ((LA + LB) * KY + KZ) * z0 * s0;
      const psiDiag = Math.atan2(2 * offY, offX);
      const RICHT = [48, 18, 140, 78, 332, 168];     // weit draußen: wechselnde Anflüge (Grad)
      const psiM = sCss >= 11 ? psiDiag + (rng() - 0.5) * 0.45 : RICHT[n % RICHT.length] * Math.PI / 180 + (rng() - 0.5) * 0.3;
      const sigma = (n >> 1) % 2 ? 1 : -1;
      const dPsi = (60 + rng() * 60) * Math.PI / 180;
      let Rk = klemm(0.3 * Math.min(W, 2 * H) / s0, 16, 60);
      if (Rk * dPsi > 0.7 * L) Rk = 0.7 * L / dPsi;
      /* Scheitel = Ort des Schlittens bei p = 0,5 */
      let Xa = klemm(-offX / 2 + 0.02 * W, -0.42 * W, 0.2 * W), Ya = klemm(-offY / 2 + 0.03 * H, -0.36 * H, 0.1 * H);
      Xa += (rng() - 0.5) * 0.04 * W; Ya += (rng() - 0.5) * 0.04 * H;
      /* nah herangezoomt passt der Schatten nie mit ins Bild: dann den
         Schlitten im oberen Bilddrittel nahe der Mitte zeigen */
      const nah = glatt(22, 40, sCss);
      Xa += (-0.08 * W - Xa) * nah; Ya += (-0.16 * H - Ya) * nah;
      const za = z0 - 2;
      const apex = rv(Xa, Ya, za);
      const dS = 0.5 * gesamt - anker, bogen = Rk * dPsi;
      /* Wo liegt die Kurve? Weit draußen um den Scheitel herum (man sieht sie
         ganz); ab s ≈ 12 erst, wenn das Gespann das Bild auf der Diagonale
         durchquert hat – vorher läuft der Schatten dieselbe Linie entlang */
      const diag = glatt(10, 14, sCss);
      const dA = -bogen / 2 + diag * (bogen / 2 + 0.85 * Math.hypot(W, H) / s0);
      const kurs = (dr) => psiM + sigma * (klemm(dr - dA, 0, bogen) - klemm(-dA, 0, bogen)) / Rk;
      const kette = (dir, lang) => {
        const aus = [];
        let x = apex[0], y = apex[1];
        for (let d = schritt; d <= lang + 1e-6; d += schritt) {
          const psi = kurs(dir * (d - schritt / 2));
          x += dir * Math.cos(psi) * schritt; y += dir * Math.sin(psi) * schritt;
          aus.push([x, y, d]);
        }
        return aus;
      };
      const hin = kette(-1, dS).reverse(), weg = kette(1, L - dS);
      /* Höhe 35–45 m: in der Kurve etwas tiefer, zu den Enden hin höher */
      const zVon = (d) => za + (z0 + 3 - za) * glatt(0, 1, d / 70);
      pts = hin.map((p) => [p[0], p[1], zVon(p[2])]).concat([[apex[0], apex[1], za]], weg.map((p) => [p[0], p[1], zVon(p[2])]));
    }
    /* Bodenachsen → Kamera → Welt */
    const inv = (4 - (K.dreh & 3)) & 3;
    const welt = pts.map(function (p) {
      const a = (p[0] + p[1]) * Math.SQRT1_2, b = (p[1] - p[0]) * Math.SQRT1_2;
      const w = ST.drehXY(a, b, inv);
      return [w[0] + K.x, w[1] + K.y, p[2]];
    });
    const lut = [0];
    let Lw = 0;
    for (let i = 1; i < welt.length; i++) { Lw += Math.hypot(welt[i][0] - welt[i - 1][0], welt[i][1] - welt[i - 1][1], welt[i][2] - welt[i - 1][2]); lut.push(Lw); }
    const tan = welt.map((p, i) => einheit(minus(welt[Math.min(welt.length - 1, i + 1)], welt[Math.max(0, i - 1)])));
    return { pts: welt, tan: tan, lut: lut, L: Lw, tA: tan[0], tE: tan[tan.length - 1] };
  }
  function pfadPunkt(pf, d) {
    const n = pf.pts.length - 1;
    if (d <= 0) return { p: plus(pf.pts[0], mal(pf.tA, d)), t: pf.tA };
    if (d >= pf.L) return { p: plus(pf.pts[n], mal(pf.tE, d - pf.L)), t: pf.tE };
    let lo = 0, hi = n;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (pf.lut[m] <= d) lo = m; else hi = m; }
    const k = (d - pf.lut[lo]) / Math.max(1e-6, pf.lut[hi] - pf.lut[lo]);
    return { p: mix(pf.pts[lo], pf.pts[hi], k), t: einheit(mix(pf.tan[lo], pf.tan[hi], k)) };
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

  /* ---------------- Schlittenglöckchen ----------------
     Eine eigene Web-Audio-Schleife: die Glöckchen (4 s) werden überlappend
     nachgelegt, solange das Gespann fliegt, mit Ein- und Ausblenden; die
     Lautstärke folgt dem Abstand des Schlittens zur Bildmitte, links/rechts
     folgt seiner Lage im Bild, nachts etwas leiser. Ohne Web Audio (oder
     bevor der Browser Ton erlaubt) ersatzweise ST.ton("schlitten") an drei
     Stellen des Überflugs. Der Tonschalter der Seite (stadt_ton) gilt. */
  const KLANG = { ctx: null, puffer: null, laedt: false, fehler: false, bus: null, pan: null, naechste: 0 };
  const ENDUNG = (function () { try { return document.createElement("audio").canPlayType('audio/ogg; codecs="opus"') ? ".opus" : ".m4a"; } catch (e) { return ".m4a"; } })();
  function tonErlaubt() { try { return localStorage.getItem("stadt_ton") !== "0"; } catch (e) { return true; } }
  function klangBereit() {
    if (STILL || KLANG.fehler || !tonErlaubt()) return false;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) { KLANG.fehler = true; return false; }
    if (!KLANG.ctx) {
      try { KLANG.ctx = new AC(); } catch (e) { KLANG.fehler = true; return false; }
      const weiter = () => { try { if (KLANG.ctx.state === "suspended") KLANG.ctx.resume(); } catch (e) {} };
      addEventListener("pointerdown", weiter, { passive: true }); addEventListener("keydown", weiter);
      KLANG.bus = KLANG.ctx.createGain(); KLANG.bus.gain.value = 0;
      KLANG.pan = KLANG.ctx.createStereoPanner ? KLANG.ctx.createStereoPanner() : null;
      if (KLANG.pan) { KLANG.bus.connect(KLANG.pan); KLANG.pan.connect(KLANG.ctx.destination); } else KLANG.bus.connect(KLANG.ctx.destination);
    }
    if (!KLANG.puffer && !KLANG.laedt) {
      KLANG.laedt = true;
      fetch("ton/schlitten" + ENDUNG).then((r) => r.arrayBuffer())
        .then((b) => new Promise((ok, nein) => KLANG.ctx.decodeAudioData(b, ok, nein)))
        .then((p) => { KLANG.puffer = p; }).catch(() => { KLANG.fehler = true; });
    }
    return !!KLANG.puffer && KLANG.ctx.state === "running";
  }
  function klangFlug(p, X, Y, Z) {
    const huelle = glatt(0.04, 0.16, p) * (1 - glatt(0.84, 0.97, p));
    const dx = (X - K.W / 2) / (K.W / 2), dy = (Y - K.H / 2) / (K.H / 2);
    const naehe = klemm(1 - (Math.hypot(dx, dy) - 0.3) / 1.2, 0, 1);
    const laut = huelle * (0.2 + 0.3 * naehe) * (Z.nacht > 0.8 ? 0.75 : 1);
    if (klangBereit()) {
      const c = KLANG.ctx, jetzt = c.currentTime;
      KLANG.bus.gain.setTargetAtTime(laut, jetzt, 0.15);
      if (KLANG.pan) KLANG.pan.pan.setTargetAtTime(klemm(dx * 0.8, -0.9, 0.9), jetzt, 0.15);
      if (huelle > 0.01 && jetzt >= KLANG.naechste - 0.05) {
        const d = KLANG.puffer.duration, start = Math.max(jetzt, KLANG.naechste);
        const q = c.createBufferSource(), gl = c.createGain();
        q.buffer = KLANG.puffer;
        gl.gain.setValueAtTime(0, start); gl.gain.linearRampToValueAtTime(1, start + 0.4);
        gl.gain.setValueAtTime(1, Math.max(start + 0.4, start + d - 0.8)); gl.gain.linearRampToValueAtTime(0, start + d);
        q.connect(gl); gl.connect(KLANG.bus); q.start(start); q.stop(start + d + 0.05);
        KLANG.naechste = start + Math.max(1, d - 1.4);
      }
      return;
    }
    if (STILL || typeof ST.ton !== "function" || !flug) return;
    [0.15, 0.4, 0.62].forEach(function (pp, i) {
      if (!(flug.tonMarke & (1 << i)) && p >= pp) { flug.tonMarke |= 1 << i; ST.ton("schlitten", klemm(laut, 0.2, 0.5)); }
    });
  }
  function klangAus() { if (KLANG.ctx && KLANG.bus) try { KLANG.bus.gain.setTargetAtTime(0, KLANG.ctx.currentTime, 0.3); } catch (e) {} }

  function bewegen(dt, t, SZ) {
    if (!aktiv(SZ)) { if (flug) klangAus(); flug = null; return; }
    if (ZWANG != null) {
      if (!flug) flug = { n: 0, pfad: pfadBauen(0, ZWANG), p: ZWANG, tonMarke: 0 };
      flug.p = ZWANG;
      return;
    }
    const z = zyklus(t);
    if (!z || z.p < 0 || z.p > 1) { if (flug) klangAus(); flug = null; return; }
    if (!flug || flug.n !== z.n) flug = { n: z.n, pfad: pfadBauen(z.n), p: z.p, tonMarke: 0 };
    flug.p = z.p;
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
     Anatomie nach dem echten Ren: tiefe Brust mit Widerrist, kräftige
     Keule, eigener Hals (≈ 0,47 m, schräg nach vorn oben) mit heller
     Halsmähne, breite gespaltene Schaufelhufe mit Afterklauen, kurzer
     flacher Wedel (oben braun, unten weiß) im hellen Spiegel. Das Geweih
     schwingt erst nach hinten und dann in weitem Bogen nach vorn oben, über
     der Stirn die Augsprosse als Schaufel. Fell: Rücken und Beine dunkler,
     Hals, Bauch und Spiegel hell; ganz nah kurze Fellstriche.
     ===================================================================== */
  function rentier(B, R0, ph, o) {
    const w = ph * TAU;
    /* Rumpf wiegt im Galopp: Nicken und Heben */
    const R = nicken(R0, 0.06 * Math.sin(w + 0.9), 0.05 * Math.sin(w + 2.3));
    B.rahmen(R);
    const fein = B.s > 34, sehrFein = B.s > 60, grob = B.s < 28;   // Detailstufe nach Pixeln je Meter
    const fell = o.fell, hell = FARBE.fellHell;
    const dunkel = mal(fell, 0.62), creme = mix(fell, hell, 0.78), bauch = mix(fell, hell, 0.62), flanke = mix(fell, hell, 0.3);
    const beinF = mal(fell, 0.7), socke = mix(fell, hell, 0.82);
    const matt = 0.35, saat = o.saat || 3;
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
      const k = seite * fernSeite < 0 ? 0.78 : 1;
      const oben = mal(vorn ? fell : mix(fell, dunkel, 0.3), k);
      B.glied(J, vorn ? 0.11 : 0.14, p1, vorn ? 0.078 : 0.092, oben, { tiefe: t, matt: matt });
      if (grob) {
        /* weit weg: Unterschenkel und Röhrbein in einem Zug, Huf als breiter Fleck */
        B.glied(p1, vorn ? 0.066 : 0.074, p2, 0.05, mal(beinF, k), { tiefe: t });
        B.glied(p2, 0.048, p3, 0.043, mal(mix(beinF, socke, 0.4), k), { tiefe: t });
        B.ei(plus(p3, mal(dirV(th[2] + 0.9), 0.035)), mal(dirV(th[2] + 0.9), 0.06), [0, 0.055, 0], [0, 0, 0.04], FARBE.huf, { tiefe: t + 0.01 });
        return;
      }
      /* Unterarm bzw. Unterschenkel: oben muskulös, zum Gelenk hin schlank */
      B.glied(p1, vorn ? 0.072 : 0.078, p2, 0.05, mal(mix(fell, beinF, 0.5), k), { tiefe: t, matt: matt });
      if (!vorn && fein) B.ei(p2, [0.035, 0, 0], [0, 0.04, 0], [0, 0, 0.04], mal(beinF, k * 0.95), { tiefe: t + 0.002 });   // Sprunggelenk
      /* Röhrbein (20 % kräftiger als zuvor) mit hellem Fesselband über dem Huf */
      B.glied(p2, 0.049, mix(p2, p3, 0.72), 0.043, mal(beinF, k * 0.92), { tiefe: t });
      B.glied(mix(p2, p3, 0.7), 0.044, p3, 0.046, mal(socke, k), { tiefe: t, matt: 0.5 });
      /* Huf: breit (≈ 0,11 × 0,1 m) und gespalten, zwei Zehen mit Spalt; darüber die Afterklauen */
      const hd = dirV(th[2] + 0.9), qu = [0, 1, 0], hoch = einheit(kreuz(qu, hd));
      for (const z of [1, -1]) {
        B.ei(plus(p3, plus(mal(hd, 0.045), mal(qu, z * 0.027))), mal(hd, 0.058), mal(qu, 0.029), mal(hoch, 0.036), mal(FARBE.huf, z * seite > 0 ? 1 : 0.85), { tiefe: t + 0.01 + z * 0.001, glanz: sehrFein ? 0.25 : 0 });
      }
      if (B.s > 40) for (const z of [1, -1]) B.ei(plus(p3, plus(mal(dirV(th[2] - 1.3), 0.05), mal(qu, z * 0.024))), mal(dirV(th[2] - 0.4), 0.022), mal(qu, 0.014), mal(hoch, 0.014), FARBE.huf, { tiefe: t });
    };
    const pv = o.phasen || [0, 0.1, 0.48, 0.58];
    /* hinten links, hinten rechts, vorn links, vorn rechts */
    bein(false, 1, ph + pv[0]); bein(false, -1, ph + pv[1]); bein(true, 1, ph + pv[2]); bein(true, -1, ph + pv[3]);
    /* Umgebungsverdeckung: wo die Beine aus dem Rumpf kommen */
    if (fein) for (const sd of [1, -1]) {
      B.ao([0.34, sd * 0.13, -0.3], [0.13, 0, 0], [0, 0.07, 0], 0.4, { tiefe: 0.005 });
      B.ao([-0.48, sd * 0.13, -0.2], [0.16, 0, 0], [0, 0.08, 0], 0.35, { tiefe: 0.005 });
    }

    /* ---- Rumpf ---- vorn tiefe Brust mit Widerrist, hinten Bauch und Keule */
    const fellStr = sehrFein ? { n: 110, laenge: 0.055, richtung: [-1, 0, -0.2], a: 0.32, saat: saat } : null;
    B.koerper([
      { c: [0.28, 0, -0.04], a: [[0.28, 0, 0], [0, 0.205, 0], [0, 0, 0.32]] },
      { c: [0.26, 0, 0.21], a: [[0.24, 0, 0], [0, 0.15, 0], [0, 0, 0.16]] },     // Widerrist
      { c: [0.44, 0, -0.18], a: [[0.14, 0, 0], [0, 0.15, 0], [0, 0, 0.16]] }     // Brustbein
    ], fell, { matt: matt, fell: fellStr, flecken: fein ? [
      { c: [0.18, 0, -0.34], a: [[0.3, 0, 0], [0, 0.18, 0], [0, 0, 0.1]], alb: bauch, n: [0, 0, -1], k: 0.85 },
      { c: [0.18, 0, 0.3], a: [[0.34, 0, 0], [0, 0.13, 0], [0, 0, 0.1]], alb: dunkel, n: [0, 0, 1], k: 0.6 },
      /* Schulter: oben Licht, hinten die Kante des Trizeps */
      { c: [0.34, 0.2, 0.06], a: [[0.13, 0, 0], [0, 0.04, 0], [0, 0, 0.2]], alb: flanke, n: [0.2, 1, 0.3], k: 0.45 },
      { c: [0.34, -0.2, 0.06], a: [[0.13, 0, 0], [0, 0.04, 0], [0, 0, 0.2]], alb: flanke, n: [0.2, -1, 0.3], k: 0.45 },
      { c: [0.12, 0.2, -0.08], a: [[0.045, 0, 0], [0, 0.04, 0], [0, 0, 0.17]], alb: dunkel, n: [-0.3, 1, 0], k: 0.4, hart: 0.3 },
      { c: [0.12, -0.2, -0.08], a: [[0.045, 0, 0], [0, 0.04, 0], [0, 0, 0.17]], alb: dunkel, n: [-0.3, -1, 0], k: 0.4, hart: 0.3 }
    ] : null });
    B.koerper([
      { c: [-0.12, 0, 0.02], a: [[0.32, 0, 0], [0, 0.222, 0], [0, 0, 0.25]] },
      { c: [-0.5, 0, 0.06], a: [[0.28, 0, 0], [0, 0.212, 0], [0, 0, 0.26]] },    // Keule
      { c: [-0.64, 0, 0.17], a: [[0.16, 0, 0], [0, 0.16, 0], [0, 0, 0.12]] }     // Kruppe
    ], fell, { tiefe: -0.01, matt: matt, fell: fellStr ? Object.assign({}, fellStr, { saat: saat + 5 }) : null, flecken: fein ? [
      { c: [-0.2, 0, -0.24], a: [[0.3, 0, 0], [0, 0.18, 0], [0, 0, 0.08]], alb: bauch, n: [0, 0, -1], k: 0.8 },
      { c: [-0.82, 0, 0.1], a: [[0.08, 0, 0], [0, 0.17, 0], [0, 0, 0.2]], alb: hell, n: [-1, 0, 0], k: 0.95, hart: 0.5 },   // Spiegel
      { c: [-0.3, 0, 0.27], a: [[0.44, 0, 0], [0, 0.13, 0], [0, 0, 0.08]], alb: dunkel, n: [0, 0, 1], k: 0.6 },
      /* Keule: Licht oben, Kniefalte davor dunkel; heller Flankenstreif */
      { c: [-0.46, 0.21, 0.12], a: [[0.2, 0, 0], [0, 0.04, 0], [0, 0, 0.17]], alb: flanke, n: [0, 1, 0.3], k: 0.35 },
      { c: [-0.46, -0.21, 0.12], a: [[0.2, 0, 0], [0, 0.04, 0], [0, 0, 0.17]], alb: flanke, n: [0, -1, 0.3], k: 0.35 },
      { c: [-0.27, 0.22, -0.1], a: [[0.04, 0, 0], [0, 0.04, 0], [0, 0, 0.15]], alb: dunkel, n: [0.3, 1, 0], k: 0.35, hart: 0.3 },
      { c: [-0.27, -0.22, -0.1], a: [[0.04, 0, 0], [0, 0.04, 0], [0, 0, 0.15]], alb: dunkel, n: [0.3, -1, 0], k: 0.35, hart: 0.3 },
      { c: [-0.02, 0.22, -0.13], a: [[0.34, 0, 0], [0, 0.04, 0], [0, 0, 0.045]], alb: creme, n: [0, 1, -0.3], k: 0.45 },
      { c: [-0.02, -0.22, -0.13], a: [[0.34, 0, 0], [0, 0.04, 0], [0, 0, 0.045]], alb: creme, n: [0, -1, -0.3], k: 0.45 }
    ] : null });
    /* Wedel: kurz und flach, oben braun, unten weiß (zwei Lagen – man sieht je nach Blick die eine oder andere) */
    if (!grob) {
      const wa = einheit([-0.55, 0, 0.83]), wq = einheit(kreuz([0, 1, 0], wa));
      B.ei(plus([-0.8, 0, 0.2], mal(wq, -0.012)), mal(wa, 0.075), [0, 0.05, 0], mal(wq, 0.016), hell, { tiefe: -0.022 });
      B.ei(plus([-0.8, 0, 0.2], mal(wq, 0.01)), mal(wa, 0.068), [0, 0.046, 0], mal(wq, 0.014), mix(fell, dunkel, 0.3), { tiefe: -0.02 });
    }

    /* ---- Hals mit Halsmähne ---- */
    const kopfNick = 0.06 * Math.sin(w + 0.3);
    const N0 = [0.5, 0, 0.14], N1 = [0.9, 0, 0.38 + kopfNick * 0.25];
    const A = einheit(minus(N1, N0)), Q = [0, 1, 0], Pn = einheit(kreuz(A, Q));   // Pn: quer zum Hals nach oben
    const halsF = mix(fell, hell, 0.28);
    B.koerper([
      { c: plus(N1, mal(A, -0.02)), a: [mal(A, 0.1), mal(Q, 0.08), mal(Pn, 0.105)] }
    , { c: plus(N0, mal(A, 0.06)), a: [mal(A, 0.16), mal(Q, 0.125), mal(Pn, 0.2)] }
    ], halsF, { matt: matt, fell: sehrFein ? { n: 45, laenge: 0.05, richtung: mal(A, -1), a: 0.3, saat: saat + 9 } : null, flecken: fein ? [
      { c: plus(mix(N0, N1, 0.5), mal(Pn, 0.1)), a: [mal(A, 0.24), mal(Q, 0.07), mal(Pn, 0.05)], alb: mix(fell, dunkel, 0.2), n: Pn, k: 0.5 }
    ] : null });
    /* Mähne: hängt unter dem Hals, hell und zottelig */
    B.koerper([
      { c: plus(plus(N0, mal(A, 0.09)), mal(Pn, -0.17)), a: [mal(A, 0.14), mal(Q, 0.105), mal(Pn, 0.13)] },
      { c: plus(mix(N0, N1, 0.6), mal(Pn, -0.12)), a: [mal(A, 0.12), mal(Q, 0.085), mal(Pn, 0.1)] },
      { c: plus(N1, mal(Pn, -0.06)), a: [mal(A, 0.07), mal(Q, 0.07), mal(Pn, 0.07)] }
    ], creme, { tiefe: -0.03, matt: 0.5, pelz: fein, flocke: 0.018, pelzSaat: saat * 31 + 1 });
    if (sehrFein) for (let i = 0; i < 9; i++) {
      /* einzelne Zotteln der Mähne */
      const u = 0.05 + i * 0.045, a0 = plus(plus(N0, mal(A, u + 0.05)), mal(Pn, -0.2 + u * 0.18)), l = 0.05 + ((i * 37) % 5) * 0.012;
      B.band([a0, plus(a0, [-0.012, ((i % 3) - 1) * 0.02, -l])], 0.012, mix(creme, hell, 0.5), { tiefe: -0.028, breite2: 0.005, schatten: false });
    }

    /* ---- Kopf ---- (Kopfachsen: u nach vorn, z nach oben; nach vorn unten geneigt) */
    const H1 = plus(N1, mal(A, 0.04));
    const al = 0.55 + kopfNick;
    const ca = Math.cos(al), sa = Math.sin(al);
    const hk = (u, y, z) => [H1[0] + u * ca + z * sa, y, H1[2] - u * sa + z * ca];
    const gesicht = mix(mal(fell, 0.82), hell, 0.08), maul = mix(fell, hell, 0.38);
    B.koerper([{ c: hk(0.08, 0, 0.02), a: [[0.13, 0, 0], [0, 0.095, 0], [0, 0, 0.1]] }, { c: hk(0.3, 0, -0.025), a: [[0.13, 0, 0], [0, 0.075, 0], [0, 0, 0.075]] }], gesicht, {
      matt: matt,
      flecken: fein ? [
        { c: hk(0.33, 0, -0.07), a: [[0.1, 0, 0], [0, 0.07, 0], [0, 0, 0.035]], alb: maul, n: [0, 0, -1], k: 0.75 },
        { c: hk(0.12, 0, 0.1), a: [[0.12, 0, 0], [0, 0.05, 0], [0, 0, 0.03]], alb: dunkel, n: [0, 0, 1], k: 0.5 },
        { c: hk(0.1, 0.07, 0.03), a: [[0.04, 0, 0], [0, 0.02, 0], [0, 0, 0.03]], alb: mix(fell, hell, 0.45), n: [0, 1, 0], k: 0.5 },
        { c: hk(0.1, -0.07, 0.03), a: [[0.04, 0, 0], [0, 0.02, 0], [0, 0, 0.03]], alb: mix(fell, hell, 0.45), n: [0, -1, 0], k: 0.5 }
      ] : null
    });
    /* Nase */
    if (o.rudolph) {
      const nk = [0.43, 0, -0.03];
      B.kugel(hk(nk[0], nk[1], nk[2]), 0.05, [255, 70, 50], { leucht: true });
      if (fein) B.kugel(hk(0.425, 0.016, -0.01), 0.018, [255, 190, 170], { leucht: true, tiefe: 0.02 });
      aus.nase = B.pk(hk(nk[0], nk[1], nk[2]));
    } else {
      B.ei(hk(0.42, 0, -0.025), [0.028, 0, 0], [0, 0.045, 0], [0, 0, 0.03], FARBE.nase, { tiefe: 0.005, glanz: sehrFein ? 0.3 : 0 });
    }
    /* Augen und Ohren */
    for (const sd of [1, -1]) {
      if (fein) B.kugel(hk(0.1, sd * 0.086, 0.045), 0.017, FARBE.auge, { glanz: sehrFein ? 0.8 : 0, tiefe: 0.01 });
      if (grob) continue;
      B.ei(hk(-0.04, sd * 0.1, 0.085), [-0.03, 0, 0.012], [0, sd * 0.066, 0.026], [0, 0, 0.028], mix(fell, hell, 0.15), { tiefe: 0.01, matt: matt });
    }

    /* ---- Geweih ---- erst nach hinten, dann in weitem Bogen nach vorn oben;
       über der Stirn die Augsprosse als Schaufel (nur auf einer Seite) */
    const gk = o.geweih;
    const bw = Math.max(0.022, 0.048 * gk);
    const GW = [128, 104, 78], GS = FARBE.geweihSpitze;
    for (const sd of [1, -1]) {
      const fuss = hk(-0.03, sd * 0.05, 0.09);
      const gp = (X, Y, Z) => [fuss[0] + X * gk, fuss[1] + sd * Y * gk, fuss[2] + Z * gk];
      const stange = [gp(0, 0, 0), gp(-0.06, 0.06, 0.12), gp(-0.17, 0.14, 0.28), gp(-0.26, 0.21, 0.46), gp(-0.27, 0.26, 0.64), gp(-0.2, 0.28, 0.8), gp(-0.08, 0.27, 0.92), gp(0.05, 0.23, 0.98)];
      if (grob) {
        B.band(stange, bw * 0.8, GW, { tiefe: 0.02, n: [0, sd, 0.5] });
        B.band([gp(-0.01, 0.02, 0.04), gp(0.1, 0.03, 0.1), gp(0.2, 0.02, 0.12)], bw * 0.6, GW, { tiefe: 0.02 });
        continue;
      }
      B.band(stange, bw, GW, { breite2: bw * 0.5, tiefe: 0.02, n: [0, sd, 0.5] });
      /* Augsprosse: auf der einen Seite als breite Schaufel über dem Gesicht */
      B.band([gp(-0.01, 0.02, 0.04), gp(0.08, 0.03, 0.1), gp(0.18, 0.025, 0.12)], bw * 0.65, GW, { breite2: bw * 0.45, tiefe: 0.02 });
      if (sd > 0 && fein) B.platte([gp(0.13, 0.005, 0.07), gp(0.27, -0.01, 0.12), gp(0.3, 0.02, 0.19), gp(0.2, 0.04, 0.17), gp(0.14, 0.035, 0.12)], mix(GW, GS, 0.2), { n: [0, 1, 0], beidseitig: true, tiefe: 0.021 });
      /* Eissprosse, Hintersprosse, Krone mit mehreren Enden */
      B.band([gp(-0.06, 0.06, 0.12), gp(0.03, 0.1, 0.22), gp(0.12, 0.1, 0.27)], bw * 0.5, GW, { breite2: bw * 0.3, tiefe: 0.02 });
      B.band([gp(-0.26, 0.21, 0.46), gp(-0.4, 0.26, 0.53)], bw * 0.5, GW, { breite2: bw * 0.28, tiefe: 0.02 });
      B.band([gp(-0.08, 0.27, 0.92), gp(-0.07, 0.34, 1.06)], bw * 0.45, GS, { breite2: bw * 0.25, tiefe: 0.02 });
      B.band([gp(0.05, 0.23, 0.98), gp(0.15, 0.26, 1.06)], bw * 0.42, GS, { breite2: bw * 0.24, tiefe: 0.02 });
      B.band([gp(0.05, 0.23, 0.98), gp(0.17, 0.17, 1.0)], bw * 0.4, GS, { breite2: bw * 0.22, tiefe: 0.02 });
      if (fein) B.band([gp(-0.2, 0.28, 0.8), gp(-0.28, 0.33, 0.9)], bw * 0.4, GS, { breite2: bw * 0.22, tiefe: 0.02 });
    }

    /* ---- Geschirr ---- gepolstertes Kummet eng am Hals (Tropfenform, oben
       schmal), Brustblatt quer über die Brust mit Glöckchen, Rückenpolster
       und Bauchgurt */
    const kc = plus(N0, mal(A, 0.13));
    const kring = (n, aussen, breite, alb, tiefe) => {
      const pts = [];
      for (let i = 0; i <= n; i++) {
        const a = i / n * TAU, sn = Math.sin(a), cs = Math.cos(a);
        const rq = (0.145 - 0.07 * Math.max(0, sn) + 0.015 * Math.max(0, -sn)) * aussen, rp = (sn > 0 ? 0.215 : 0.235) * aussen;
        pts.push(plus(kc, plus(mal(Q, cs * rq), mal(Pn, sn * rp))));
      }
      /* vordere Hälfte vor dem Hals, hintere dahinter (sonst läge der Ring wie ein Rettungsring auf dem Hals) */
      const st = Math.max(2, Math.ceil(n / (grob ? 2 : 8)));
      for (let i = 0; i < n; i += st) {
        const seg = pts.slice(i, Math.min(n, i + st) + 1), m = seg[seg.length >> 1];
        const vorn = pkt(B.rk(minus(m, kc)), AUGE) > 0;
        B.band(seg, breite, alb, { tiefe: vorn ? tiefe + 0.3 : tiefe - 0.4 });
      }
      return pts;
    };
    kring(grob ? 8 : 20, 1.0, 0.06, FARBE.leder, 0.03);
    if (!grob) kring(20, 0.86, 0.032, [206, 176, 128], 0.031);        // Polster innen
    if (sehrFein) for (const sd of [1, -1]) B.band([plus(kc, plus(mal(Q, sd * 0.13), mal(Pn, -0.1))), plus(kc, plus(mal(Q, sd * 0.1), mal(Pn, 0.12))), plus(kc, plus(mal(Q, sd * 0.05), mal(Pn, 0.23)))], 0.018, FARBE.messing, { glanz: 1, tiefe: 0.035 });
    /* Brustblatt */
    const brust = [[0.4, 0.205, 0.02], [0.53, 0.16, -0.06], [0.61, 0, -0.1], [0.53, -0.16, -0.06], [0.4, -0.205, 0.02]];
    B.band(brust, 0.075, FARBE.leder, { tiefe: 0.035 });
    const bim = 0.012 * Math.sin(w * 2);
    if (!grob) for (const [x, y, z] of [[0.58, 0.09, -0.12], [0.615, 0, -0.145], [0.58, -0.09, -0.12], [0.49, 0.18, -0.08], [0.49, -0.18, -0.08]]) {
      B.kugel([x, y, z - 0.02 + bim], 0.024, FARBE.gold, { glanz: 0.9, tiefe: 0.05 });
      if (sehrFein) B.kugel([x + 0.012, y, z - 0.038 + bim], 0.007, [60, 40, 20], { tiefe: 0.051 });
    } else B.kugel([0.615, 0, -0.16 + bim], 0.035, FARBE.gold, { glanz: 0.9, tiefe: 0.05 });
    /* Rückenpolster und Bauchgurt */
    if (!grob) B.ei([0.08, 0, 0.29], [0.12, 0, 0], [0, 0.12, 0], [0, 0, 0.03], FARBE.leder, { tiefe: 0.04 });
    {
      const pts = [];
      const n = grob ? 8 : 18;
      for (let i = 0; i <= n; i++) { const a = i / n * TAU; pts.push([0.08, Math.cos(a) * 0.235, -0.02 + Math.sin(a) * 0.305]); }
      const st = Math.ceil(n / (grob ? 2 : 8));
      for (let i = 0; i < n; i += st) B.band(pts.slice(i, Math.min(n, i + st) + 1), 0.05, FARBE.leder, { tiefe: 0.03 });
    }
    if (!grob) for (const sd of [1, -1]) B.kugel([0.08, sd * 0.1, 0.33], 0.024, FARBE.gold, { glanz: 0.9, tiefe: 0.05 });
    aus.kummet = [B.pk([0.4, 0.21, 0.0]), B.pk([0.4, -0.21, 0.0])];
    aus.brust = B.pk([0.6, 0, -0.1]);
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
    B.platte([[-1.3, 0.56, 0.02], [1.05, 0.56, 0.02], [1.05, -0.56, 0.02], [-1.3, -0.56, 0.02]], FARBE.holz, {
      ebene: 1, n: [0, 0, 1], schatten: false, ursprung: [-1.3, 0.56, 0.02], u: [1, 0, 0], v: [0, -1, 0],
      /* Dielen: Fugen und leise Maserung */
      muster: fein ? function (g, f) {
        g.strokeStyle = rgbAus([40, 24, 12], f, 0.55); g.lineWidth = 0.012;
        g.beginPath(); for (let k = 1; k < 8; k++) { g.moveTo(0, k * 0.14); g.lineTo(2.4, k * 0.14); } g.stroke();
        g.strokeStyle = rgbAus([150, 104, 64], f, 0.35); g.lineWidth = 0.008;
        g.beginPath(); for (let k = 0; k < 16; k++) { const y = k * 0.07 + 0.03; g.moveTo(0.1 + (k * 0.37) % 1, y); g.bezierCurveTo(0.6, y + 0.01, 1.2, y - 0.012, 2.3, y + 0.004); } g.stroke();
      } : null
    });
    /* Seitenwände: innen Samt, außen Lack mit Goldzier */
    for (const sd of [1, -1]) {
      const pts = PROFIL.map((p) => [p[0], sd * yBei(p[1]), p[1]]);
      const n = [0, sd, -0.05];
      const zu = pkt(B.rk(n), AUGE) > 0;
      B.platte(pts, FARBE.lack, {
        n: n, innen: FARBE.lackInnen, ebene: zu ? 3 : 1,
        ursprung: [0, sd * 0.62, 0], u: [sd > 0 ? -1 : 1, 0, 0], v: [0, 0.08 * sd, 1],
        muster: fein ? function (g, f, s) { zierSeite(g, f, s, sd > 0 ? -1 : 1, sehrFein, oberKante); } : null
      });
      /* Goldleiste an der Oberkante */
      const oben = oberKante.map((p) => [p[0], sd * (yBei(p[1]) + 0.01), p[1]]);
      B.band(oben, 0.045, FARBE.gold, { ebene: zu ? 3 : 1, glanz: 1, praege: true, tiefe: 0.01 });
    }
    /* Rückwand mit gerundeter Oberkante */
    {
      const pts = [[-1.36, 0.66, 0.2], [-1.36, 0.66, 1.0], [-1.34, 0.44, 1.14], [-1.33, 0, 1.2], [-1.34, -0.44, 1.14], [-1.36, -0.66, 1.0], [-1.36, -0.66, 0.2], [-1.3, -0.6, 0], [-1.3, 0.6, 0]];
      B.platte(pts, FARBE.lack, { n: [-1, 0, 0], innen: FARBE.lackInnen, ebene: hintenSicht ? 3 : 1 });
      B.band([[-1.36, 0.66, 1.0], [-1.34, 0.44, 1.14], [-1.33, 0, 1.2], [-1.34, -0.44, 1.14], [-1.36, -0.66, 1.0]], 0.045, FARBE.gold, { ebene: hintenSicht ? 3 : 1, glanz: 1, praege: true, tiefe: 0.01 });
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
    B.platte([[-0.48, 0.58, 0.42], [0.16, 0.58, 0.42], [0.16, -0.58, 0.42], [-0.48, -0.58, 0.42]], FARBE.samt, { ebene: 2, n: [0, 0, 1], tiefe: -0.3, samt: 1 });
    B.platte([[0.16, 0.58, 0.42], [0.16, 0.58, 0.02], [0.16, -0.58, 0.02], [0.16, -0.58, 0.42]], FARBE.lackInnen, { ebene: 2, n: [1, 0, 0], tiefe: -0.3 });
    B.platte([[-0.5, 0.6, 1.0], [-0.5, 0.6, 0.42], [-0.5, -0.6, 0.42], [-0.5, -0.6, 1.0]], FARBE.samt, { ebene: 2, n: [1, 0, 0], innen: FARBE.lackInnen, tiefe: -0.25, samt: 1 });
    B.band([[-0.5, 0.6, 1.0], [-0.5, -0.6, 1.0]], 0.05, FARBE.gold, { ebene: 2, glanz: 1, praege: true, tiefe: -0.2 });

    /* Laternen an den vorderen Ecken */
    for (const sd of [1, -1]) {
      const c = [1.3, sd * 0.74, 1.05];
      B.band([[1.22, sd * 0.66, 0.9], [1.3, sd * 0.74, 0.96]], 0.02, FARBE.messing, { ebene: vornSicht ? 4 : 3 });
      B.koerper([{ c: c, a: [[0.05, 0, 0], [0, 0.05, 0], [0, 0, 0.07]] }], [255, 216, 140], { leucht: true, ebene: vornSicht ? 4 : 3 });
      B.glied(plus(c, [0, 0, 0.07]), 0.055, plus(c, [0, 0, 0.13]), 0.012, FARBE.messing, { ebene: vornSicht ? 4 : 3, glanz: 0.8 });
      B.leuchte(c, 1.6, "255,196,120", 0.35 + 0.65 * Z.nacht);
    }

    /* ---- Der Sack mit Geschenken (hinten im Laderaum) ----
       Jute: unten prall, zum Hals hin gerafft – Faltenbündel laufen zur
       Kordel zusammen; darunter ein weicher Schatten auf dem Boden */
    B.ao([-0.92, -0.04, 0.03], [0.42, 0, 0], [0, 0.5, 0], 0.55, { ebene: 2, tiefe: -0.6 });
    {
      const hals = [-0.96, 0.0, 1.0], falten = [];
      if (fein) for (let k = 0; k < 9; k++) {
        const a = k / 9 * TAU + 0.3, fx = Math.cos(a) * 0.33, fy = Math.sin(a) * 0.42;
        const unten = [-0.92 + fx, -0.04 + fy, 0.5], d = einheit(minus(hals, unten));
        const m = mix(unten, hals, 0.42), q = einheit(kreuz(d, [0, 0, 1]));
        falten.push({ c: m, a: [mal(d, 0.26), mal(q, 0.028), [Math.cos(a) * 0.03, Math.sin(a) * 0.03, 0]], alb: FARBE.sackDunkel.map((x) => x * 0.8), n: [Math.cos(a), Math.sin(a), 0.3], k: 0.55, hart: 0.35 });
        falten.push({ c: plus(m, mal(q, 0.06)), a: [mal(d, 0.22), mal(q, 0.022), [Math.cos(a) * 0.02, Math.sin(a) * 0.02, 0]], alb: [196, 164, 118], n: [Math.cos(a), Math.sin(a), 0.5], k: 0.4 });
      }
      B.koerper([
        { c: [-0.92, -0.04, 0.46], a: [[0.36, 0, 0.02], [0, 0.46, 0], [-0.04, 0, 0.42]] },
        { c: [-0.95, -0.01, 0.86], a: [[0.2, 0, 0], [0, 0.26, 0], [0, 0, 0.16]] }
      ], FARBE.sack, { ebene: 2, matt: 0.3, flecken: falten.length ? falten : null, fell: sehrFein ? { n: 90, laenge: 0.03, streu: 3.2, a: 0.22, saat: 77 } : null });
      B.glied(hals, 0.13, [-0.98, 0.02, 1.15], 0.1, FARBE.sack, { ebene: 2, matt: 0.3 });
      if (fein) {
        /* Raffung am Hals: kleine Wülste über der Kordel */
        for (let k = 0; k < 6; k++) { const a = k / 6 * TAU; B.ei([-0.97 + Math.cos(a) * 0.1, 0.01 + Math.sin(a) * 0.1, 1.14], [0.035, 0, 0], [0, 0.035, 0], [0, 0, 0.05], FARBE.sack.map((x) => x * 0.95), { ebene: 2, tiefe: 0.01, matt: 0.3 }); }
        B.band([[-0.96, 0.14, 1.07], [-0.86, 0.02, 1.06], [-0.96, -0.12, 1.07], [-1.08, 0.02, 1.09], [-0.96, 0.14, 1.07]], 0.028, FARBE.kordel, { ebene: 2, tiefe: 0.03 });
        B.band([[-0.86, 0.02, 1.06], [-0.8, 0.07, 0.94], [-0.78, 0.04, 0.86]], 0.022, FARBE.kordel, { ebene: 2, tiefe: 0.03 });
      }
    }
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

  /* Goldzier auf der Seitenwand (lokal: x = rx · Modell-x, y nach oben, Meter).
     Lack: oben spiegelt sich der helle Himmel als weicher Streif entlang der
     Kante, zur Unterkante wird er satter. Das Gold ist geprägt – je Leiste
     eine Schattenkante, das Gold und eine feine Lichtkante –, statt Spiralen
     eine Akanthusranke mit sich verjüngendem Stiel und Blättern. */
  function zierSeite(g, f, s, rx, sehrFein, kante) {
    g.lineCap = "round"; g.lineJoin = "round";
    /* Himmelsreflex im Lack entlang der Oberkante */
    if (kante) {
      const pfad = () => { g.beginPath(); kante.forEach((p, i) => { const x = rx * p[0], y = p[1] - 0.11; if (i) g.lineTo(x, y); else g.moveTo(x, y); }); };
      pfad(); g.strokeStyle = rgbAus([196, 220, 246], f, 0.13); g.lineWidth = 0.17; g.stroke();
      g.strokeStyle = rgbAus([226, 240, 255], f, 0.16); g.lineWidth = 0.05; g.stroke();
    }
    /* zur Unterkante hin satter, dunkler Lack */
    const gu = g.createLinearGradient(0, 0, 0, 0.32);
    gu.addColorStop(0, "rgba(4,10,8,0.34)"); gu.addColorStop(1, "rgba(4,10,8,0)");
    g.fillStyle = gu; g.fillRect(-2, -0.05, 4, 0.37);

    const gold = rgbAus([226, 180, 80], f), dunkel = rgbAus([62, 38, 10], f, 0.8), licht = rgbAus([255, 242, 196], f, 0.85);
    /* geprägte Linie: Schatten nach unten versetzt, Gold, Lichtkante nach oben */
    const praeg = (pfad, b) => {
      g.save(); g.translate(0, -b * 0.45); pfad(); g.strokeStyle = dunkel; g.lineWidth = b; g.stroke(); g.restore();
      pfad(); g.strokeStyle = gold; g.lineWidth = b; g.stroke();
      g.save(); g.translate(0, b * 0.3); pfad(); g.strokeStyle = licht; g.lineWidth = b * 0.3; g.stroke(); g.restore();
    };
    /* Rahmenleiste: unten entlang, vorn in die Schnecke hinauf, hinten senkrecht */
    praeg(() => { g.beginPath(); g.moveTo(rx * -1.18, 0.86); g.lineTo(rx * -1.18, 0.11); g.lineTo(rx * 0.98, 0.11); g.quadraticCurveTo(rx * 1.34, 0.17, rx * 1.4, 0.6); }, 0.03);
    /* Akanthusranke: Stiel als Bézierkurve, von hinten nach vorn dünner werdend */
    const P0 = [-0.92, 0.3], P1 = [-0.5, 0.6], P2 = [0.1, 0.12], P3 = [0.72, 0.36];
    const bz = (u) => { const m = 1 - u; return [m * m * m * P0[0] + 3 * m * m * u * P1[0] + 3 * m * u * u * P2[0] + u * u * u * P3[0], m * m * m * P0[1] + 3 * m * m * u * P1[1] + 3 * m * u * u * P2[1] + u * u * u * P3[1]]; };
    const N = 14, stiel = [];
    for (let i = 0; i <= N; i++) stiel.push(bz(i / N));
    for (let i = 0; i < N; i++) {
      const a = stiel[i], b = stiel[i + 1], br = 0.042 - 0.024 * i / N;
      praeg(() => { g.beginPath(); g.moveTo(rx * a[0], a[1]); g.lineTo(rx * b[0], b[1]); }, br);
    }
    /* Schnecke am Ende: eine halbe Windung, kein Kringel */
    praeg(() => { g.beginPath(); g.moveTo(rx * 0.72, 0.36); g.bezierCurveTo(rx * 0.95, 0.42, rx * 1.02, 0.6, rx * 0.9, 0.64); g.quadraticCurveTo(rx * 0.8, 0.64, rx * 0.82, 0.56); }, 0.018);
    /* Blätter: spitz zulaufend, abwechselnd links und rechts des Stiels */
    const blatt = (x, y, l, b, w) => {
      const c = Math.cos(w), sn = Math.sin(w), tx = x + c * l, ty = y + sn * l, mx = x + c * l * 0.45, my = y + sn * l * 0.45, nx = -sn * b, ny = c * b;
      g.moveTo(rx * x, y); g.quadraticCurveTo(rx * (mx + nx), my + ny, rx * tx, ty); g.quadraticCurveTo(rx * (mx - nx), my - ny, rx * x, y);
    };
    const blaetter = [];
    for (let i = 1; i < N; i += 2) {
      const a = stiel[i], b = stiel[i + 1], w = Math.atan2(b[1] - a[1], b[0] - a[0]), seite = (i >> 1) % 2 ? 1 : -1;
      blaetter.push([a[0], a[1], 0.19 - i * 0.006, 0.055, w + seite * 0.75]);
    }
    blaetter.push([-0.92, 0.3, 0.18, 0.055, 2.2], [-0.92, 0.3, 0.16, 0.05, -2.4]);
    g.save(); g.translate(0, -0.012); g.beginPath(); for (const bl of blaetter) blatt(...bl); g.fillStyle = dunkel; g.fill(); g.restore();
    g.beginPath(); for (const bl of blaetter) blatt(...bl); g.fillStyle = gold; g.fill();
    if (sehrFein) {
      /* Blattrippen als Lichtkante */
      g.strokeStyle = licht; g.lineWidth = 0.007; g.beginPath();
      for (const [x, y, l, , w] of blaetter) { g.moveTo(rx * x, y); g.lineTo(rx * (x + Math.cos(w) * l * 0.8), y + Math.sin(w) * l * 0.8); }
      g.stroke();
    }
    /* Rosette hinten oben */
    const rp = [-0.98, 0.72];
    g.fillStyle = dunkel; g.beginPath(); g.arc(rx * rp[0], rp[1] - 0.01, 0.055, 0, TAU); g.fill();
    g.fillStyle = gold; g.beginPath(); g.arc(rx * rp[0], rp[1], 0.052, 0, TAU); g.fill();
    g.fillStyle = licht; g.beginPath(); g.arc(rx * rp[0] - 0.012, rp[1] + 0.018, 0.018, 0, TAU); g.fill();
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

  /* Der Weihnachtsmann: sitzt, hält die Zügel, winkt beim Überflug.
     Mantel aus Samt (helle Glanzkante an den Wölbungen, feiner Flor),
     Besatz, Bart und Bommel aus Pelz (flockiger Rand, Flockenrauschen),
     Kontaktschatten unter Bart, Armen und Oberschenkeln; ab s > 60 ein
     Gesicht mit Augenschatten unter den Brauen, Nasenrücken und Wangenlicht. */
  function weihnachtsmann(B, t, winken, fein, sehrFein) {
    const E = 2;
    const wind = Math.sin(t * 5.3) * 0.02;
    const gesicht = B.s > 60;
    const pelz = (saat, extra) => Object.assign({ ebene: E, pelz: fein, flocke: 0.016, matt: 0.35, pelzSaat: saat }, extra || {});
    const flor = sehrFein ? { n: 70, laenge: 0.025, streu: 3.2, a: 0.14, saat: 5 } : null;
    /* Beine: Oberschenkel rot, hohe schwarze Stiefel mit Pelzkrempe */
    for (const sd of [1, -1]) {
      B.ao([-0.02, sd * 0.16, 0.43], [0.26, 0, 0], [0, 0.11, 0], 0.5, { ebene: E, tiefe: -0.28 });
      B.glied([-0.16, sd * 0.15, 0.55], 0.115, [0.3, sd * 0.17, 0.6], 0.095, FARBE.mantel, { ebene: E, samt: 0.8, matt: 0.2 });
      B.glied([0.3, sd * 0.17, 0.6], 0.085, [0.42, sd * 0.17, 0.16], 0.075, FARBE.stiefel, { ebene: E, glanz: 0.25 });
      B.ei([0.49, sd * 0.17, 0.09], [0.13, 0, 0], [0, 0.07, 0], [0, 0, 0.07], FARBE.stiefel, { ebene: E, glanz: 0.35 });
      {
        /* Pelzkrempe der Stiefel: flacher Ring um das Schienbein */
        const ax = einheit([0.12, 0, -0.44]), qa = [0, 1, 0], qb = kreuz(ax, qa);
        B.ei([0.355, sd * 0.17, 0.4], mal(ax, 0.035), mal(qa, 0.094), mal(qb, 0.094), FARBE.pelz, pelz(20 + sd, { tiefe: 0.02 }));
      }
    }
    /* Rumpf: Samtmantel über dem runden Bauch; Falten, Achselschatten und der
       Schatten des Barts auf der Brust */
    B.koerper([
      { c: [-0.22, 0, 0.58], a: [[0.26, 0, 0], [0, 0.3, 0], [0, 0, 0.16]] },
      { c: [-0.12, 0, 0.8], a: [[0.29, 0, 0], [0, 0.33, 0], [0, 0, 0.3]] },
      { c: [-0.2, 0, 1.08], a: [[0.2, 0, 0], [0, 0.28, 0], [0, 0, 0.2]] }
    ], FARBE.mantel, { ebene: E, samt: 1, matt: 0.2, fell: flor, flecken: fein ? [
      { c: [-0.05, 0.3, 0.72], a: [[0.14, 0, 0], [0, 0.04, 0], [0, 0, 0.05]], alb: [110, 10, 16], n: [0, 1, 0], k: 0.55 },
      { c: [-0.05, -0.3, 0.72], a: [[0.14, 0, 0], [0, 0.04, 0], [0, 0, 0.05]], alb: [110, 10, 16], n: [0, -1, 0], k: 0.55 },
      { c: [0.02, 0, 1.08], a: [[0.08, 0, 0], [0, 0.17, 0], [0, 0, 0.09]], alb: [70, 6, 12], n: [1, 0, 0.3], k: 0.6 },
      { c: [-0.16, 0.29, 0.96], a: [[0.1, 0, 0], [0, 0.04, 0], [0, 0, 0.08]], alb: [70, 6, 12], n: [0, 1, 0], k: 0.5 },
      { c: [-0.16, -0.29, 0.96], a: [[0.1, 0, 0], [0, 0.04, 0], [0, 0, 0.08]], alb: [70, 6, 12], n: [0, -1, 0], k: 0.5 },
      { c: [0.1, 0.16, 0.66], a: [[0.03, 0, 0], [0, 0.03, 0], [0, 0, 0.1]], alb: [120, 10, 18], n: [1, 0.4, 0], k: 0.4 },
      { c: [0.1, -0.16, 0.66], a: [[0.03, 0, 0], [0, 0.03, 0], [0, 0, 0.1]], alb: [120, 10, 18], n: [1, -0.4, 0], k: 0.4 }
    ] : null });
    /* Pelzbesatz vorn, vom Kragen zum Saum, auf der Mantelwölbung */
    const besatz = [[0.0, 0, 1.13], [0.12, 0, 0.98], [0.18, 0, 0.8], [0.15, 0, 0.62]];
    for (let i = 0; i < besatz.length - 1; i++) B.glied(besatz[i], 0.048, besatz[i + 1], 0.05, FARBE.pelz, pelz(30 + i, { tiefe: 0.1 }));
    /* Gürtel mit Goldschnalle */
    {
      const pts = [];
      for (let i = 0; i <= 20; i++) { const a = i / 20 * TAU; pts.push([-0.12 + Math.cos(a) * 0.3, Math.sin(a) * 0.34, 0.74]); }
      /* vordere Hälfte vor dem Mantel, hintere dahinter */
      for (let i = 0; i < 20; i += 4) { const m = pts[i + 2]; const vorn = pkt(B.rk([m[0] + 0.12, m[1], 0]), AUGE) > 0; B.band(pts.slice(i, i + 5), 0.075, FARBE.guertel, { ebene: E, tiefe: vorn ? 0.12 : -0.5, glanz: sehrFein ? 0.3 : 0 }); }
      B.platte([[0.19, 0.06, 0.79], [0.19, -0.06, 0.79], [0.19, -0.06, 0.69], [0.19, 0.06, 0.69]], FARBE.gold, { ebene: E, n: [1, 0, 0], tiefe: 0.14, kante: "rgba(90,60,10,0.8)" });
    }
    B.ei([-0.19, 0, 1.22], [0.14, 0, 0], [0, 0.17, 0], [0, 0, 0.065], FARBE.pelz, pelz(40, { tiefe: 0.02 }));
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
      B.glied(S, 0.09, El, 0.075, FARBE.mantel, { ebene: E, tiefe: 0.05, samt: 0.8, matt: 0.2 });
      B.glied(El, 0.074, mix(El, Ha, 0.8), 0.064, FARBE.mantel, { ebene: E, tiefe: 0.05, samt: 0.8, matt: 0.2 });
      B.glied(mix(El, Ha, 0.74), 0.076, mix(El, Ha, 0.86), 0.072, FARBE.pelz, pelz(50 + sd, { tiefe: 0.06 }));
      /* Fäustling: länglich in Armrichtung, mit Daumen */
      const ar = einheit(minus(Ha, El)), qu = einheit(kreuz(ar, [0, 0, 1]));
      const hm = plus(Ha, mal(ar, 0.02));
      B.ei(hm, mal(ar, 0.065), mal(qu, 0.048), mal(einheit(kreuz(qu, ar)), 0.034), FARBE.handschuh, { ebene: E, tiefe: 0.07, matt: 0.3 });
      B.ei(plus(hm, plus(mal(ar, -0.01), mal(qu, -sd * 0.045))), mal(ar, 0.03), mal(qu, 0.02), [0, 0, 0.02], FARBE.handschuh, { ebene: E, tiefe: 0.075 });
    }
    /* Kopf: Gesicht, Bart, Schnurrbart, Brauen, Mütze mit Bommel */
    const kopf = [-0.17, 0, 1.36];
    B.ei([-0.25, 0, 1.37], [0.08, 0, 0], [0, 0.12, 0], [0, 0, 0.1], FARBE.bart, pelz(60));   // weißes Haar hinten
    B.kugel(kopf, 0.105, FARBE.haut, { ebene: E, matt: 0.25, flecken: gesicht ? [
      /* Augenhöhlen unter den Brauen, Wangenlicht, Schläfen etwas dunkler */
      { c: [-0.08, 0.045, 1.392], a: [[0.02, 0, 0], [0, 0.028, 0], [0, 0, 0.018]], alb: [150, 92, 78], n: [1, 0, 0], k: 0.7 },
      { c: [-0.08, -0.045, 1.392], a: [[0.02, 0, 0], [0, 0.028, 0], [0, 0, 0.018]], alb: [150, 92, 78], n: [1, 0, 0], k: 0.7 },
      { c: [-0.085, 0.07, 1.352], a: [[0.02, 0, 0], [0, 0.03, 0], [0, 0, 0.022]], alb: [255, 214, 196], n: [0.6, 0.6, 0.3], k: 0.55 },
      { c: [-0.085, -0.07, 1.352], a: [[0.02, 0, 0], [0, 0.03, 0], [0, 0, 0.022]], alb: [255, 214, 196], n: [0.6, -0.6, 0.3], k: 0.55 }
    ] : null });
    if (fein) for (const sd of [1, -1]) B.kugel([-0.1, sd * 0.066, 1.34], 0.032, FARBE.wange, { ebene: E, tiefe: 0.04, matt: 0.3 });
    /* Bart: Pelz mit flockigem Rand, ganz nah einzelne Strähnen */
    B.koerper([{ c: [-0.11, 0, 1.3], a: [[0.1, 0, 0], [0, 0.15, 0], [0, 0, 0.11]] }, { c: [-0.06, 0, 1.18], a: [[0.085, 0, 0], [0, 0.115, 0], [0, 0, 0.08]] }], FARBE.bart, pelz(70, { tiefe: 0.03, flocke: 0.013 }));
    if (sehrFein) for (let i = 0; i < 9; i++) {
      const y = (i - 4) * 0.026, z0 = 1.3 - Math.abs(y) * 0.4;
      B.band([[-0.02, y, z0], [0.0, y * 1.05, z0 - 0.08], [-0.02, y * 1.1, z0 - 0.15 + Math.abs(y) * 0.5]], 0.006, [206, 206, 214], { ebene: E, tiefe: 0.05, schatten: false });
    }
    /* Nase mit Nasenrücken, rote Spitze */
    if (gesicht) B.glied([-0.075, 0, 1.405], 0.012, [-0.058, 0, 1.372], 0.018, FARBE.haut.map((x) => x * 1.02), { ebene: E, tiefe: 0.075, matt: 0.3 });
    B.kugel([-0.055, 0, 1.365], 0.026, FARBE.wange, { ebene: E, tiefe: 0.08, glanz: gesicht ? 0.25 : 0 });
    for (const sd of [1, -1]) B.ei([-0.055, sd * 0.05, 1.33], [0.03, 0, 0], [0, 0.06, -0.012], [0, 0, 0.024], FARBE.bart, pelz(80 + sd, { tiefe: 0.09, flocke: 0.01 }));
    if (gesicht) {
      for (const sd of [1, -1]) {
        B.kugel([-0.083, sd * 0.043, 1.398], 0.011, [58, 44, 40], { ebene: E, tiefe: 0.1, glanz: sehrFein ? 0.7 : 0 });
        B.ei([-0.078, sd * 0.047, 1.423], [0.02, 0, 0], [0, 0.032, 0], [0, 0, 0.011], FARBE.bart, pelz(90 + sd, { tiefe: 0.11, flocke: 0.008 }));
      }
    }
    /* Mütze: Pelzkrempe, roter Zipfel aus Samt weht nach hinten, Bommel */
    B.ei([-0.18, 0, 1.45], [0.125, 0, 0], [0, 0.13, 0], [0, 0, 0.048], FARBE.pelz, pelz(100, { tiefe: 0.03 }));
    const m1 = [-0.2, 0, 1.49], m2 = [-0.33, 0.03 + wind, 1.62], m3 = [-0.48, 0.08 + wind * 2, 1.58];
    B.glied(m1, 0.11, m2, 0.065, FARBE.mantel, { ebene: E, tiefe: 0.02, samt: 0.8, matt: 0.2 });
    B.glied(m2, 0.065, m3, 0.03, FARBE.mantel, { ebene: E, tiefe: 0.02, samt: 0.8, matt: 0.2 });
    B.kugel([-0.52, 0.09 + wind * 2.4, 1.55], 0.055, FARBE.pelz, pelz(110, { tiefe: 0.02 }));
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

  /* Rahmen an der Bahn: vorn = Flugrichtung, oben in die Kurve geneigt
     (Querneigung aus Tempo und Krümmung: tan φ = v²·κ / g) */
  function bahnRahmen(pf, d, seit, hoch, v, kam) {
    const pp = pfadPunkt(pf, d);
    const F = einheit(kam.v(pp.t));
    const a = pfadPunkt(pf, d - 3).t, b = pfadPunkt(pf, d + 3).t;
    let dpsi = Math.atan2(b[1], b[0]) - Math.atan2(a[1], a[0]);
    if (dpsi > Math.PI) dpsi -= TAU; if (dpsi < -Math.PI) dpsi += TAU;
    const neig = klemm(Math.atan(v * v * (dpsi / 6) / 9.81), -0.5, 0.5);
    const U0 = einheit(minus([0, 0, 1], mal(F, F[2]))), L0 = kreuz(U0, F);
    const c = Math.cos(neig), s = Math.sin(neig);
    const U = plus(mal(U0, c), mal(L0, s)), Lv = minus(mal(L0, c), mal(U0, s));
    const o = plus(kam.p(pp.p), plus(mal(Lv, seit), mal(U, hoch)));
    return rahmen(o, F, Lv, U);
  }

  /* ---------------- Sternenspur ----------------
     Kein Strich: der Schleier besteht aus weichen Lichtflecken, die der
     Schlitten zurücklässt – jeder an seinem Geburtsort, er sinkt, treibt
     quer auseinander, wird größer und verblasst. Dazu Funken, die langsam
     sinken und verglimmen; nur die hellsten 5 % haben kurze, leicht
     gedrehte Strahlen, die schnell vergehen. */
  function spurMalen(g, pf, p, t, Z, anker, sF, kam) {
    const gesamt = pf.L + TEAM, nacht = Z.nacht;
    const proj = (w) => { const c = kam.p(w); return [anker[0] + pkt(R1, c) * sF, anker[1] + pkt(R2, c) * sF]; };
    g.save();
    g.globalCompositeOperation = "lighter";
    const dS = 0.08, nS = 28, lebenS = nS * dS;
    const tS = Math.floor(t / dS);
    for (let k = 0; k < nS; k++) {
      const nr = tS - k, alter = t - nr * dS;
      if (alter < 0 || alter > lebenS) continue;
      const pk = p - alter / DAUER;
      if (pk < 0 || pk > 1) continue;
      const pp = pfadPunkt(pf, pk * gesamt - D_SCHLITTEN - 1.3), w = pp.p;
      const h1 = ST.hash2(nr, 7, 9) - 0.5, h2 = ST.hash2(nr, 8, 9);
      const quer = h1 * (0.3 + alter * 0.6);
      const [x, y] = proj([w[0] - pp.t[1] * quer, w[1] + pp.t[0] * quer, w[2] - 0.3 - alter * 0.28]);
      const r = sF * (0.26 + alter * 0.42 + h2 * 0.1);
      const a = 0.12 * (0.4 + 0.6 * nacht) * Math.pow(1 - alter / lebenS, 1.7);
      if (a < 0.004 || r < 1) continue;
      const gr = g.createRadialGradient(x, y, 0, x, y, r);
      gr.addColorStop(0, "rgba(255,226,168," + a.toFixed(3) + ")");
      gr.addColorStop(0.45, "rgba(255,226,168," + (a * 0.45).toFixed(3) + ")");
      gr.addColorStop(1, "rgba(255,226,168,0)");
      g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r);
    }
    /* Funken */
    const dt = 0.022, leben = 2.6, n = Math.floor(leben / dt);
    const t0 = Math.floor(t / dt);
    for (let k = 0; k < n; k++) {
      const nr = t0 - k, alter = t - nr * dt;
      if (alter < 0 || alter > leben) continue;
      const pk = p - alter / DAUER;
      if (pk < 0 || pk > 1) continue;
      const h1 = ST.hash2(nr, 1, 5), h2 = ST.hash2(nr, 2, 5), h3 = ST.hash2(nr, 3, 5), h4 = ST.hash2(nr, 4, 5);
      const pp = pfadPunkt(pf, pk * gesamt - D_SCHLITTEN - 1.4 - h4 * 0.6), w = pp.p;
      const seite = (h1 - 0.5) * 1.6 + (h1 - 0.5) * alter * 0.9;
      const [x, y] = proj([w[0] - pp.t[1] * seite + alter * 0.25, w[1] + pp.t[0] * seite, w[2] - 0.45 - alter * (0.35 + h2 * 0.5) - alter * alter * 0.08]);
      if (x < -20 || y < -20 || x > K.W + 20 || y > K.H + 20) continue;
      const blende = Math.min(1, alter / 0.12) * Math.pow(1 - alter / leben, 1.4);
      const funkeln = 0.55 + 0.45 * Math.sin(t * (9 + h3 * 8) + nr);
      const a = blende * funkeln;
      if (a < 0.03) continue;
      const farbe = h3 < 0.55 ? "255,222,150" : h3 < 0.85 ? "255,250,236" : "200,222,255";
      const r = Math.max(1.1 * K.dpr, sF * (0.022 + h2 * 0.04)) * (0.8 + 0.4 * funkeln);
      const gr = g.createRadialGradient(x, y, 0, x, y, r * 2.6);
      gr.addColorStop(0, "rgba(" + farbe + "," + (0.95 * a).toFixed(3) + ")");
      gr.addColorStop(0.25, "rgba(" + farbe + "," + (0.35 * a).toFixed(3) + ")");
      gr.addColorStop(1, "rgba(" + farbe + ",0)");
      g.fillStyle = gr; g.fillRect(x - r * 2.6, y - r * 2.6, r * 5.2, r * 5.2);
      /* heller Kern – auch vor hellem Schnee am Tag sichtbar */
      g.globalCompositeOperation = "source-over";
      g.fillStyle = "rgba(255,250,232," + (0.85 * a).toFixed(3) + ")";
      g.beginPath(); g.arc(x, y, Math.max(0.6, r * 0.42), 0, TAU); g.fill();
      g.globalCompositeOperation = "lighter";
      const strahlA = a * Math.max(0, 1 - alter / 0.9);
      if (h2 > 0.95 && strahlA > 0.08) {
        /* nur die hellsten: vier kurze Strahlen, leicht gedreht, schnell verblassend */
        const l = r * (1.4 + 2.6 * strahlA), wD = (h1 - 0.5) * 0.7, c = Math.cos(wD) * l, sn = Math.sin(wD) * l;
        g.strokeStyle = "rgba(" + farbe + "," + (0.55 * strahlA).toFixed(3) + ")";
        g.lineWidth = Math.max(0.5, r * 0.18); g.lineCap = "round";
        g.beginPath(); g.moveTo(x - c, y - sn); g.lineTo(x + c, y + sn); g.moveTo(x + sn, y - c); g.lineTo(x - sn, y + c); g.stroke();
      }
    }
    g.restore();
  }

  /* Dunstfetzen 5–8 m unter der Flugbahn: flache, weiche Schleier, die
     langsam mit dem Wind ziehen – das Gespann gleitet viel schneller über
     sie hinweg. Diese Scheinparallaxe und die Luftperspektive verraten die
     Höhe, auch wenn der Schatten außerhalb des Bildes liegt. */
  function dunstMalen(g, pf, p, Z) {
    const huelle = glatt(0.02, 0.14, p) * (1 - glatt(0.86, 0.98, p));
    if (huelle < 0.01) return;
    const farbe = Z.nacht > 0.8 ? "150,166,214" : Z.nacht > 0.3 ? "222,214,238" : "250,252,255";
    const grund = (Z.nacht > 0.8 ? 0.15 : Z.nacht > 0.3 ? 0.24 : 0.3) * huelle;
    const tf = p * DAUER, s = K.s;
    g.save();
    for (let i = 0; i < 20; i++) {
      const h1 = ST.hash2(i, 11, 3), h2 = ST.hash2(i, 12, 3), h3 = ST.hash2(i, 13, 3);
      const pp = pfadPunkt(pf, (i + 0.5) / 20 * pf.L);
      const seit = (h1 - 0.5) * 14;
      const x = pp.p[0] - pp.t[1] * seit + 1.1 * tf, y = pp.p[1] + pp.t[0] * seit + 0.45 * tf, z = pp.p[2] - 5 - h2 * 3;
      const R = 3.5 + h3 * 4.5;
      for (let j = 0; j < 3; j++) {
        const P = ST.proj(x + (j - 1) * R * 0.8, y + (j - 1) * R * 0.3 * (h1 - 0.5), z);
        const rx = R * s * (0.7 + 0.25 * ST.hash2(i, j, 17)), ry = rx * 0.5;
        if (P[0] < -rx || P[0] > K.W + rx || P[1] < -ry || P[1] > K.H + ry) continue;
        const a = grund * (0.45 + 0.55 * h1) * (j === 1 ? 1 : 0.7);
        g.setTransform(rx, 0, 0, ry, P[0], P[1]);
        const gr = g.createRadialGradient(0, 0, 0, 0, 0, 1);
        gr.addColorStop(0, "rgba(" + farbe + "," + a.toFixed(3) + ")");
        gr.addColorStop(0.5, "rgba(" + farbe + "," + (a * 0.5).toFixed(3) + ")");
        gr.addColorStop(1, "rgba(" + farbe + ",0)");
        g.fillStyle = gr; g.fillRect(-1, -1, 2, 2);
      }
    }
    g.restore();
  }

  /* ---------------- alles zusammen ---------------- */
  let schattenLw = null, schattenCache = null, lage = null;
  /* Weicher Schatten eines fliegenden Dings auf dem Boden: auf einer
     kleinen Leinwand um den Schattenort gemalt, in der Auflösung des
     Halbschattens (≈ 0,35 m aus 40–50 m Höhe) – die weiche Kante entsteht
     beim Vergrößern, ohne Weichzeichner. Gemalt wird er mit
     „destination-over": der Boden ist eine eigene Leinwand, auf dieser hier
     ist er durchsichtig – so liegt der Schatten von selbst UNTER allen
     Häusern, Menschen und Lichtern und fällt nur auf freien Boden. */
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
    g.globalCompositeOperation = "destination-over";
    g.globalAlpha = Math.min(0.6, schattenK);
    g.imageSmoothingEnabled = true;
    g.drawImage(schattenLw, 0, 0, w, h, SX0 - rS, SY0 - rS, w / f, h / f);
    g.restore();
  }

  /* Hohe Türme (Dom 52,5 m, Kirchturm 37 m) können das Gespann verdecken,
     wenn es hinter ihnen vorbeifliegt: Tiefe des Turmpunkts, der im Bild am
     Gespann liegt, gegen die Tiefe des Gespanns. */
  function tiefeVon(x, y, z) { const d = ST.drehXY(x - K.x, y - K.y, K.dreh); return (d[0] + d[1]) * KZ * Math.SQRT1_2 + 0.5 * z; }
  function verdecker(A, box) {
    const SZ = ST.szene, aus = [];
    if (!SZ || !SZ.sichtbare) return aus;
    const tA = tiefeVon(A[0], A[1], A[2]);
    for (const e of SZ.sichtbare) {
      if (e.live || !e.sp || !e.sp.bild || !e.sp.bild.width || e.o.rand) continue;
      const def = ST.MODELLE[e.o.typ];
      if (!def || !(def.hoehe >= A[2] - 5)) continue;
      if (e.x1 < box[0] || e.x0 > box[2] || e.y1 < box[1] || e.y0 > box[3]) continue;
      const zT = klemm((e.Y - (box[1] + box[3]) / 2) / (KZ * K.s), 0, def.hoehe);
      if (tiefeVon(e.o.x, e.o.y, zT) > tA) aus.push(e);
    }
    return aus;
  }

  function santaZeichnen(g, t, Z) {
    const pf = flug.pfad, p = flug.p;
    const gesamt = pf.L + TEAM, v = gesamt / DAUER;
    const dK = p * gesamt;
    /* Größe: wächst mit dem Zoom; weit herausgezoomt wird das Gespann nur
       sanft überhöht (Wurzel), damit es erkennbar bleibt, ohne riesig zu wirken */
    const sF = Math.max(K.s, Math.sqrt(24 * K.dpr * K.s));
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
    const galopp = 1.6 + 0.04 * v;     // Schrittfrequenz steigt mit dem Tempo

    /* Rentiere */
    const punkte = [];
    for (const r of TIERE) {
      const R = bahnRahmen(pf, dK - r.d, r.seite * SEITE, 0.62, v, kam);
      B.gruppe(pkt(R.o, AUGE));
      const a = rentier(B, R, t * galopp + r.ph, { rudolph: r.rudolph, geweih: r.geweih, fell: r.fell, saat: r.saat });
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

    /* Glöckchen: Lautstärke und Richtung nach der Lage im Bild */
    klangFlug(p, AS[0], AS[1], Z);

    /* 1. Schatten auf dem Schnee – unter allem, was schon gemalt ist */
    if (!MESS.ohneSchatten) weicherSchatten(g, B, SX0, SY0, TEAM * sF * 1.6, Z, t, pf, "santa");
    /* Bildgrenzen des Gespanns (Rudolph bis Schlitten) */
    const RU = ST.proj(...pfadPunkt(pf, dK).p);
    const rand = 3 * sF;
    const box = [Math.min(AS[0], RU[0]) - rand, Math.min(AS[1], RU[1]) - rand * 1.2, Math.max(AS[0], RU[0]) + rand, Math.max(AS[1], RU[1]) + rand];
    const sichtbar = box[2] > 0 && box[0] < K.W && box[3] > 0 && box[1] < K.H;
    /* verdeckt ein hoher Turm das Gespann? Dann erst auf eine eigene Lage
       malen und dort das Turmbild ausstanzen */
    const vor = sichtbar && !MESS.ohneGespann ? verdecker(A, box) : [];
    let ziel = g;
    if (vor.length) {
      if (!lage) lage = document.createElement("canvas");
      if (lage.width !== K.W || lage.height !== K.H) { lage.width = K.W; lage.height = K.H; }
      ziel = lage.getContext("2d");
      ziel.setTransform(1, 0, 0, 1, 0, 0); ziel.clearRect(0, 0, K.W, K.H);
    }
    /* 2. Dunstschleier unter dem Gespann */
    dunstMalen(ziel, pf, p, Z);
    /* 3. Sternenspur hinter dem Schlitten */
    if (!MESS.ohneSpur) spurMalen(ziel, pf, p, t, Z, AS, sF, kam);
    /* 4. Gespann – in Luftperspektive: heller, bläulicher, weicher im Kontrast */
    if (!MESS.ohneGespann && sichtbar) {
      DUNST = Z.nacht > 0.8 ? [58, 70, 112, 0.1] : Z.nacht > 0.3 ? [150, 160, 198, 0.12] : [214, 226, 242, 0.14];
      try { B.malen(ziel); } finally { DUNST = null; }
    }
    if (vor.length) {
      ziel.globalCompositeOperation = "destination-out";
      for (const e of vor) ziel.drawImage(e.sp.bild, e.x0, e.y0, e.sp.W * e.k, e.sp.H * e.k);
      ziel.globalCompositeOperation = "source-over";
      g.drawImage(lage, 0, 0);
    }
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
  const S_OPT = { hoehe: 34, team: S_TEAM, anker: 0, saat: 777, tempo: 10, dauer: S_DAUER };
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
