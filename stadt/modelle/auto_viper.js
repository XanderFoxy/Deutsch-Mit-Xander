/* =====================================================================
   BAUKASTEN-STADT — DODGE VIPER RT/10 (1992), roter Roadster
   ---------------------------------------------------------------------
   XANDER: „Hier sind die Ersatz für den Dodge Viper und auch die
   Innenansichten vom Cockpit, damit es alles realistisch gebaut werden
   kann."

   Vorbild (Fotos vorn, Seite, hinten, zwei Cockpit-Bilder):
     • 4,45 m lang, 1,92 m breit, mit Windschutzscheibe 1,12 m hoch,
       Radstand 2,44 m, kurzer Bug, langer Hinterwagen.
     • Signalrot, lange Motorhaube mit zwei Luftschlitzen am Scheibenfuß,
       stark gewölbte Kotflügel, tropfenförmige Scheinwerfer unter Glas,
       breites Maul mit zwei Querstreben, runde Nebelscheinwerfer.
     • Hinter dem Vorderrad die „Kieme" (Luftauslass), darunter die
       seitlichen Auspuffrohre (Sidepipes) mit schwarzem Hitzeschild.
     • Offenes Cockpit: graue Ledersitze, graues Armaturenbrett mit zwei
       großen und vier kleinen Rundinstrumenten, drei Lüftungsdüsen,
       Radio, Mittelkonsole mit Schalthebel, schwarzes Dreispeichen-Lenkrad
       links, schwarzer Bügel hinter den Sitzen.
     • Heck: ovale dunkelrote Rückleuchten, darunter Blinker, schwarzes
       Kennzeichen „DODGE", Schriftzug in der Stoßstange.
     • Dreispeichen-Felgen (silbern) mit Sechskant-Nabe.

   KOORDINATEN: Meter, Mitte des Grundrisses auf (0,0,0), die Front zeigt
   nach +y. Die Fahrerseite (links im Auto) liegt bei +x.

   WIE ES GEBAUT IST (Werkstatt, gleich in auto_batmobil.js)
   Die Karosserie ist ein „Loft": Querschnitte entlang der Länge, dazwischen
   Dreiecke. Jedes Dreieck bekommt je Ecke eine gemittelte Normale – daraus
   entsteht ein weicher Verlauf von Licht und Lackglanz (keine Kanten wie
   bei Klötzchen). Bemalt wird durch Projektion: Seite (y,z), Draufsicht
   (x,y), Front/Heck (x,z) – so laufen Linien, Leuchten und Schriftzüge
   nahtlos über viele Dreiecke. Die Karosserie ist in Teile zerlegt
   (Nase, Vorderwagen, zwei Türen, Hinterwagen, Heck, Innenraum), damit
   Sitze, Lenkrad und Räder in jedem Drehwinkel richtig verdeckt werden.
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT;

  /* =====================================================================
     WERKSTATT — Helfer für gewölbte Karosserien
     ===================================================================== */
  const pkt = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const minus = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const plus = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  const mal = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
  const kreuz = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const einheit = (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const klemm = (x, a, b) => (x < a ? a : x > b ? b : x);
  const rgb = (f, a) => (a == null ? "rgb(" + (f[0] | 0) + "," + (f[1] | 0) + "," + (f[2] | 0) + ")" : "rgba(" + (f[0] | 0) + "," + (f[1] | 0) + "," + (f[2] | 0) + "," + a + ")");

  /* Sonne und Auge in Modellkoordinaten: der Kern liefert die Sonne in den
     (gedrehten) Achsen der Fläche – daraus lässt sich der Drehwinkel
     zurückrechnen, ohne ihn zu kennen. */
  function sichtModell(F, u, v, n) {
    const L = [u[0] * F.lichtU + v[0] * F.lichtV + n[0] * F.lichtN, u[1] * F.lichtU + v[1] * F.lichtV + n[1] * F.lichtN, u[2] * F.lichtU + v[2] * F.lichtV + n[2] * F.lichtN];
    const LK = ST.LICHT, E = ST.ZUM_AUGE;
    const gier = Math.atan2(LK[1], LK[0]) - Math.atan2(L[1], L[0]);
    const c = Math.cos(gier), s = Math.sin(gier);
    return { L: L, E: [E[0] * c + E[1] * s, -E[0] * s + E[1] * c, E[2]] };
  }
  /* Licht wie im Kern (ST.lichtFaktor), aber für eine Normale in Modellkoordinaten */
  function lichtWert(n, L, Z, jahr) {
    const k = Math.max(0, pkt(n, L)), nz = n[2];
    const oben = 0.82 + 0.18 * Math.max(0, nz);
    const seit = Math.max(0, 1 - Math.abs(nz) - Math.max(0, nz) * 0.5);
    const hell = Z.amb[1] + Z.sonne[1] * 0.6;
    const rueck = jahr === "winter" ? [0.20, 0.21, 0.23] : [0.08, 0.10, 0.06];
    return [0, 1, 2].map((i) => Math.min(1, Z.amb[i] * oben + Z.sonne[i] * k * 1.35 + rueck[i] * seit * hell));
  }
  /* Lackglanz: Sonnenglanzlicht + gespiegelter Himmel (Fresnel) */
  function glanzWert(n, L, E, Z, st) {
    const H = einheit(plus(L, E));
    const sonne = (Z.sonne[0] + Z.sonne[1] + Z.sonne[2]) / 3;
    const sp = Math.pow(Math.max(0, pkt(n, H)), st.haerte || 40) * sonne * 2.4 * (st.glanz || 0);
    const ne = Math.max(0, pkt(n, E));
    const fres = 0.05 + 0.95 * Math.pow(1 - ne, 4);
    const r = minus(mal(n, 2 * pkt(n, E)), E);
    const himmel = r[2] > 0 ? 0.45 + 0.55 * Math.min(1, r[2] * 1.6) : 0.12 * Math.max(0, 1 + r[2] * 2);
    const amb = (Z.amb[0] + Z.amb[1] + Z.amb[2]) / 3;
    return Math.min(0.9, sp + fres * himmel * amb * (st.spiegel || 0));
  }
  /* Linearer Verlauf über ein Dreieck: ein Wert je Ecke (affin → exakt) */
  function verlauf(g, p, w, farbe, box) {
    let lo = 0, hi = 0;
    for (let i = 1; i < 3; i++) { if (w[i] < w[lo]) lo = i; if (w[i] > w[hi]) hi = i; }
    const d1x = p[1][0] - p[0][0], d1y = p[1][1] - p[0][1], d2x = p[2][0] - p[0][0], d2y = p[2][1] - p[0][1];
    const det = d1x * d2y - d1y * d2x;
    if (w[hi] - w[lo] < 0.004 || Math.abs(det) < 1e-12) { g.fillStyle = farbe(hi); g.fillRect(box[0], box[1], box[2], box[3]); return; }
    const w1 = w[1] - w[0], w2 = w[2] - w[0];
    const ga = (w1 * d2y - w2 * d1y) / det, gb = (d1x * w2 - d2x * w1) / det;
    const gl = ga * ga + gb * gb;
    const kA = (w[lo] - w[0]) / gl, kB = (w[hi] - w[0]) / gl;
    const gr = g.createLinearGradient(p[0][0] + ga * kA, p[0][1] + gb * kA, p[0][0] + ga * kB, p[0][1] + gb * kB);
    gr.addColorStop(0, farbe(lo)); gr.addColorStop(1, farbe(hi));
    g.fillStyle = gr; g.fillRect(box[0], box[1], box[2], box[3]);
  }
  /* Farbe eines Werkstoffs unter dem Licht der Fläche (für flache Kleinteile) */
  function beleuchtet(f, F) {
    const l = ST.lichtFaktor(F.n, F.zeit, 0, F.jahr);
    return rgb([f[0] * l[0], f[1] * l[1], f[2] * l[2]]);
  }
  /* Monotone kubische Interpolation (Fritsch–Carlson): kein Überschwingen */
  function monoton(xs, ys) {
    const n = xs.length, d = [], m = new Array(n);
    for (let i = 0; i < n - 1; i++) d.push((ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]));
    m[0] = d[0]; m[n - 1] = d[n - 2];
    for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
    for (let i = 0; i < n - 1; i++) {
      if (d[i] === 0) { m[i] = 0; m[i + 1] = 0; continue; }
      const a = m[i] / d[i], b = m[i + 1] / d[i], s = a * a + b * b;
      if (s > 9) { const t = 3 / Math.sqrt(s); m[i] = t * a * d[i]; m[i + 1] = t * b * d[i]; }
    }
    return function (x) {
      let i = 0;
      while (i < n - 2 && x > xs[i + 1]) i++;
      const h = xs[i + 1] - xs[i], t = (x - xs[i]) / h, t2 = t * t, t3 = t2 * t;
      return (2 * t3 - 3 * t2 + 1) * ys[i] + (t3 - 2 * t2 + t) * h * m[i] + (-2 * t3 + 3 * t2) * ys[i + 1] + (t3 - t2) * h * m[i + 1];
    };
  }

  /* Die Werkstatt sammelt Flächen je Teil und gibt sie am Ende dem Bauer */
  function Werkstatt(M) { this.M = M; this.teile = new Map(); this.nr = 0; }
  Werkstatt.prototype.teil = function (name, opt) {
    if (!this.teile.has(name)) this.teile.set(name, { opt: opt || {}, fl: [], fig: [] });
    else if (opt) Object.assign(this.teile.get(name).opt, opt);
    return this.teile.get(name);
  };
  Werkstatt.prototype.fertig = function () {
    for (const [name, t] of this.teile) {
      if (!t.fl.length && !t.fig.length) continue;
      this.M.teil(name, t.opt);
      for (const f of t.fl) this.M.flaeche(f);
      for (const f of t.fig) this.M.figur(f);
    }
  };
  /* Bemalung durch Projektion: die Kunst malt in Modellkoordinaten
     seite: (y, z) · oben: (x, y) · front: (x, z) */
  const LAGEN = [["seite", 1, 2, 0], ["oben", 0, 1, 2], ["front", 0, 2, 1]];
  function kunstMalen(g, D, phase, F, c) {
    const K = D.kunst;
    for (const [lage, i1, i2, ia] of LAGEN) {
      const fn = K[lage];
      if (!fn) continue;
      const na = D.n[ia];
      if (Math.abs(na) < ((K.schwellen && K.schwellen[lage]) || K.schwelle || 0.3)) continue;
      const u = D.u, v = D.v, A = D.A;
      const det = u[i1] * v[i2] - v[i1] * u[i2];
      if (Math.abs(det) < 1e-6) continue;
      const m11 = v[i2] / det, m21 = -v[i1] / det, m12 = -u[i2] / det, m22 = u[i1] / det;
      g.save();
      g.transform(m11, m12, m21, m22, -(m11 * A[i1] + m21 * A[i2]), -(m12 * A[i1] + m22 * A[i2]));
      fn(g, Math.sign(na), phase, D.info, F, c || ((f, a) => rgb(f, a)));
      g.restore();
    }
    /* Eigene Projektionen entlang einer Richtung d (z. B. senkrecht auf
       einen Scheinwerfer): Ebene durch o mit den Achsen e1, e2 */
    for (const P of K.lagen || []) {
      if (pkt(D.n, P.d) < (P.schwelle || 0.3)) continue;
      const u = D.u, v = D.v, A = D.A, e1 = P.e1, e2 = P.e2, AO = minus(A, P.o);
      const a11 = pkt(u, e1), a12 = pkt(v, e1), a21 = pkt(u, e2), a22 = pkt(v, e2);
      const det = a11 * a22 - a12 * a21;
      if (Math.abs(det) < 1e-6) continue;
      const i11 = a22 / det, i12 = -a12 / det, i21 = -a21 / det, i22 = a11 / det;
      const X0 = pkt(AO, e1), Y0 = pkt(AO, e2);
      g.save();
      /* (X, Y) → (a, b): a = i11 (X − X0) + i12 (Y − Y0), b = i21 (X − X0) + i22 (Y − Y0) */
      g.transform(i11, i21, i12, i22, -(i11 * X0 + i12 * Y0), -(i21 * X0 + i22 * Y0));
      P.fn(g, phase, D.info, F, c || ((f, a) => rgb(f, a)));
      g.restore();
    }
  }
  /* Projektionslage entlang d um den Punkt o; e1 möglichst entlang „rechts" */
  function lage(o, d, rechts, fn, schwelle) {
    d = einheit(d);
    const e1 = einheit(minus(rechts, mal(d, pkt(rechts, d)))), e2 = kreuz(d, e1);
    return { o: o, d: d, e1: e1, e2: e2, fn: fn, schwelle: schwelle };
  }
  /* Ein Dreieck mit Normalen je Ecke (weiche Schattierung) */
  Werkstatt.prototype.dreieck = function (teil, A, B, C, nA, nB, nC, stoff, kunst, info) {
    const e1 = minus(B, A), e2 = minus(C, A), n0 = kreuz(e1, e2), fl = Math.hypot(n0[0], n0[1], n0[2]);
    if (fl < 1e-7) return;
    const u = einheit(e1), n = mal(n0, 1 / fl), v = kreuz(n, u);
    const w = Math.hypot(e1[0], e1[1], e1[2]), cu = pkt(e2, u), cv = pkt(e2, v);
    const P2 = [[0, 0], [w, 0], [cu, cv]];
    const a0 = Math.min(0, cu), a1 = Math.max(w, cu), b0 = Math.min(0, cv), b1 = Math.max(0, cv);
    const box = [a0 - 0.02, b0 - 0.02, a1 - a0 + 0.04, b1 - b0 + 0.04];
    const D = { A: A, u: u, v: v, n: n, kunst: kunst, info: Object.assign({ c: mal(plus(plus(A, B), C), 1 / 3), n: n }, info || {}) };
    const NN = [nA || n, nB || n, nC || n];
    const f = {
      name: "d" + (this.nr++), o: A, u: u, v: v, w: a1, h: b1, umriss: P2, keinLicht: true,
      malen: function (g, F) {
        /* Alles in EINEM deckenden Verlauf (Farbe × Licht + Glanz): würde man
           Licht per „multiply" darüberlegen, dunkelten die Kantenglättungen
           benachbarter Dreiecke doppelt ab – feine Gitterlinien im Lack. */
        const s = sichtModell(F, u, v, n);
        const Lw = NN.map((q) => lichtWert(q, s.L, F.zeit, F.jahr));
        const gw = stoff.glanz || stoff.spiegel ? NN.map((q) => glanzWert(q, s.L, s.E, F.zeit, stoff)) : [0, 0, 0];
        const b = stoff.farbe, hf = stoff.glanzRGB || [236, 242, 252];
        const col = Lw.map((l, i) => [0, 1, 2].map((c) => Math.min(255, b[c] * l[c] + hf[c] * gw[i])));
        verlauf(g, P2, col.map((c) => c[0] + c[1] + c[2]), (i) => rgb(col[i]), box);
        if (kunst) {
          const Lm = [0, 1, 2].map((c) => (Lw[0][c] + Lw[1][c] + Lw[2][c]) / 3);
          const gm = (gw[0] + gw[1] + gw[2]) / 3 * 0.5;
          const c = (f, a) => rgb([Math.min(255, f[0] * Lm[0] + hf[0] * gm), Math.min(255, f[1] * Lm[1] + hf[1] * gm), Math.min(255, f[2] * Lm[2] + hf[2] * gm)], a);
          kunstMalen(g, D, "farbe", F, c);
          kunstMalen(g, D, "danach", F, c);
        }
      }
    };
    if (kunst && kunst.leuchten) f.leuchten = function (g, F) { kunstMalen(g, D, "leuchten", F); };
    this.teil(teil).fl.push(f);
  };
  /* Aufrecht gemalte Figur in einem Teil (M.figur) */
  Werkstatt.prototype.figur = function (teil, fi) { this.teil(teil).fig.push(fi); return fi; };
  /* Figur, die Modellpunkte selbst ins Bild rechnet (Fußpunkt f):
     liefert P(p) → [x, y] in Bildpunkten relativ zum Fußpunkt */
  function figurProjektion(f, s, F) {
    const a = (F.gier || 0) * Math.PI / 180, c = Math.cos(a), sn = Math.sin(a);
    return function (p) {
      const dx = p[0] - f[0], dy = p[1] - f[1], dz = p[2] - f[2];
      const rx = dx * c - dy * sn, ry = dx * sn + dy * c;
      return [(rx - ry) * ST.KX * s, (rx + ry) * ST.KY * s - dz * ST.KZ * s];
    };
  }
  /* Ebene Fläche aus Punkten (Umlaufsinn: Außenseite zeigt nach Newell-Normale) */
  Werkstatt.prototype.platte = function (teil, pts, malen, opt) {
    let nx = 0, ny = 0, nz = 0;
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length];
      nx += (a[1] - b[1]) * (a[2] + b[2]); ny += (a[2] - b[2]) * (a[0] + b[0]); nz += (a[0] - b[0]) * (a[1] + b[1]);
    }
    const n = einheit([nx, ny, nz]);
    const o = pts[0], u = einheit(minus(pts[1], pts[0])), v = kreuz(n, u);
    const um = pts.map((p) => { const d = minus(p, o); return [pkt(d, u), pkt(d, v)]; });
    let w = 0, h = 0;
    for (const q of um) { w = Math.max(w, q[0]); h = Math.max(h, q[1]); }
    const f = Object.assign({ name: (opt && opt.name) || "p" + (this.nr++), o: o, u: u, v: v, w: w, h: h, umriss: um, malen: malen }, opt || {});
    this.teil(teil).fl.push(f);
    return f;
  };
  /* Prisma: ebenes Vieleck, um d verschoben; malen(art) mit art = "vorn" | "hinten" | "rand" */
  Werkstatt.prototype.prisma = function (teil, pts, d, maler, opt) {
    const mitte = mal(pts.reduce((a, p) => plus(a, p), [0, 0, 0]), 1 / pts.length);
    const hinten = pts.map((p) => plus(p, d));
    /* Umlaufsinn so, dass die Vorderseite von d weg zeigt */
    let nx = 0, ny = 0, nz = 0;
    for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; nx += (a[1] - b[1]) * (a[2] + b[2]); ny += (a[2] - b[2]) * (a[0] + b[0]); nz += (a[0] - b[0]) * (a[1] + b[1]); }
    let vorn = pts.slice();
    if (pkt([nx, ny, nz], d) > 0) vorn = vorn.reverse();
    const rueck = vorn.map((p) => plus(p, d)).reverse();
    this.platte(teil, vorn, maler("vorn"), opt);
    this.platte(teil, rueck, maler("hinten"), opt);
    for (let i = 0; i < vorn.length; i++) {
      const a = vorn[i], b = vorn[(i + 1) % vorn.length];
      /* Rand: a → a+d → b+d → b; außen = weg von der Mitte */
      let q = [b, plus(b, d), plus(a, d), a];
      const nn = kreuz(minus(q[1], q[0]), minus(q[3], q[0]));
      const cm = mal(plus(a, b), 0.5);
      if (pkt(nn, minus(cm, plus(mitte, mal(d, 0.5)))) < 0) q = q.reverse();
      if (Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]) > 1e-4) this.platte(teil, q, maler("rand", i), opt);
    }
    void hinten;
  };
  /* Kiste aus Ecke o und drei Kanten (darf schief sein) */
  Werkstatt.prototype.kiste = function (teil, o, ex, ey, ez, farben, opt) {
    const P = (a, b, c) => plus(plus(plus(o, mal(ex, a)), mal(ey, b)), mal(ez, c));
    const F = farben;
    const seiten = [
      ["unten", [P(0, 0, 0), P(0, 1, 0), P(1, 1, 0), P(1, 0, 0)]],
      ["oben", [P(0, 0, 1), P(1, 0, 1), P(1, 1, 1), P(0, 1, 1)]],
      ["vorn", [P(0, 1, 0), P(0, 1, 1), P(1, 1, 1), P(1, 1, 0)]],
      ["hinten", [P(0, 0, 0), P(1, 0, 0), P(1, 0, 1), P(0, 0, 1)]],
      ["links", [P(0, 0, 0), P(0, 0, 1), P(0, 1, 1), P(0, 1, 0)]],
      ["rechts", [P(1, 0, 0), P(1, 1, 0), P(1, 1, 1), P(1, 0, 1)]]
    ];
    const mitte = P(0.5, 0.5, 0.5);
    for (const [name, q] of seiten) {
      const m = F[name] === undefined ? F.rest : F[name];
      if (m == null) continue;
      let pts = q;
      const nn = kreuz(minus(pts[1], pts[0]), minus(pts[3], pts[0]));
      const cm = mal(pts.reduce((a, p) => plus(a, p), [0, 0, 0]), 0.25);
      /* Newell-Normale von pts muss nach außen zeigen */
      if (pkt(nn, minus(cm, mitte)) < 0) pts = pts.slice().reverse();
      this.platte(teil, pts, m, Object.assign({ name: teil + "-" + name }, opt || {}));
    }
  };
  /* Loft: Querschnitte (konstantes y), Halbprofil wird gespiegelt.
     def = { schnitte: [{ y, p: [[x,z]…], typ, kante }], zuordnen(q) → { teil, stoff, kunst, info },
             kanteJ(typ, j) → true = Knick (keine gemittelte Normale), deckel: { vorn, hinten } } */
  Werkstatt.prototype.loft = function (def) {
    const S = def.schnitte, N = S[0].p.length, voll = !!def.voll;
    const R = voll ? N : 2 * N - 2;
    const jVon = (k) => (voll ? k : k < N ? k : R - k);
    const V = S.map((s) => {
      const r = [];
      for (let k = 0; k < R; k++) {
        const j = jVon(k), p = s.p[j];
        const x = voll ? p[0] : (k < N ? p[0] : -p[0]);
        r.push([x + (def.dx || 0), s.y + (p[2] || 0), p[1]]);
      }
      return r;
    });
    const I = S.length;
    /* Vierecks-Normalen */
    const Q = [];
    for (let i = 0; i < I - 1; i++) {
      Q.push([]);
      for (let k = 0; k < R; k++) {
        const k2 = (k + 1) % R;
        Q[i].push(kreuz(minus(V[i + 1][k2], V[i][k]), minus(V[i][k2], V[i + 1][k])));
      }
    }
    const kanteI = (i) => S[i].kante;
    const kanteJ = def.kanteJ || (() => false);
    const zu = (i) => (i + R) % R;
    /* Normale der Ecke (i,k) für das Viereck (qi,qk) */
    function normale(i, k, qi, qk) {
      let s = [0, 0, 0];
      const kI = kanteI(i), kJ = kanteJ(S[i].typ, jVon(k), k);
      for (const ii of [i - 1, i]) {
        if (ii < 0 || ii >= I - 1) continue;
        if (kI && ii !== qi) continue;
        for (const kk of [zu(k - 1), k]) {
          if (kJ && kk !== qk) continue;
          s = plus(s, Q[ii][kk]);
        }
      }
      return einheit(s);
    }
    for (let i = 0; i < I - 1; i++) {
      for (let k = 0; k < R; k++) {
        const k2 = (k + 1) % R;
        const A = V[i][k], B = V[i + 1][k], C = V[i][k2], Dd = V[i + 1][k2];
        const js = voll ? k : (k < N - 1 ? k : R - 1 - k);
        const seite = voll ? 1 : (k < N - 1 ? 1 : -1);
        const yc = (A[1] + B[1] + C[1] + Dd[1]) / 4;
        const z = def.zuordnen({ i: i, js: js, seite: seite, yc: yc, typA: S[i].typ, typB: S[i + 1].typ, A: A, B: B, C: C, D: Dd });
        if (!z) continue;
        this.dreieck(z.teil, A, B, C, normale(i, k, i, k), normale(i + 1, k, i, k), normale(i, k2, i, k), z.stoff, z.kunst, z.info);
        this.dreieck(z.teil, Dd, C, B, normale(i + 1, k2, i, k), normale(i, k2, i, k), normale(i + 1, k, i, k), z.stoff, z.kunst, z.info);
      }
    }
    /* Deckel vorn und hinten (eben, Fächer aus der Mitte) */
    const deckel = (i, richtung, z) => {
      if (!z) return;
      const r = V[i], m = mal(r.reduce((a, p) => plus(a, p), [0, 0, 0]), 1 / R);
      const n = [0, richtung, 0];
      for (let k = 0; k < R; k++) {
        const a = r[k], b = r[(k + 1) % R];
        if (richtung > 0) this.dreieck(z.teil, m, b, a, n, n, n, z.stoff, z.kunst, z.info);
        else this.dreieck(z.teil, m, a, b, n, n, n, z.stoff, z.kunst, z.info);
      }
    };
    if (def.deckel) { deckel(0, -1, def.deckel.hinten); deckel(I - 1, 1, def.deckel.vorn); }
    return V;
  };
  /* Querschnitte zwischen Schlüsselschnitten glatt einfügen */
  function schnitteGlatt(keys, schritt) {
    const ys = keys.map((k) => k.y), N = keys[0].p.length, D = keys[0].p[0].length;
    const f = [];
    for (let j = 0; j < N; j++) { f.push([]); for (let c = 0; c < D; c++) f[j].push(monoton(ys, keys.map((k) => k.p[j][c]))); }
    const aus = [];
    for (let i = 0; i < keys.length; i++) {
      aus.push(keys[i]);
      if (i === keys.length - 1) break;
      const h = keys[i + 1].y - keys[i].y, n = Math.max(1, Math.round(h / schritt));
      for (let s = 1; s < n; s++) {
        const y = keys[i].y + h * s / n;
        aus.push({ y: y, typ: keys[i].typ, p: f.map((fj) => fj.map((fc) => fc(y))) });
      }
    }
    return aus;
  }
  /* Rad: Reifen (Lauffläche unten und vorn/hinten sichtbar), Flanken, Felge.
     FASSUNG 812 — XANDER: „dieses Batmobil hätte ich nicht nur in dem Spiel gerne das als
     fahrendes Auto zu sehen ist, sondern auch als Einstiegsanimation … in diesem 3-D Maßstab".
     Für das Drehblatt des Auftritts (werkzeug/stadt-backen.js, „drehblaetter") lässt sich
     jedes Rad LENKEN (opt.lenk, Grad um die Hochachse, + = nach rechts), DREHEN (opt.roll,
     Grad der Felge) und AUSBLENDEN (opt.unsichtbar: die Flächen bleiben als Maß im Modell –
     Umriss und Schatten ändern sich nicht –, gemalt wird aber nichts). Ohne diese Angaben
     ist alles genau wie bisher. */
  Werkstatt.prototype.rad = function (teil, cx, cy, r, breite, aussen, felge, opt) {
    opt = opt || {};
    const lenk = (opt.lenk || 0) * Math.PI / 180, roll = (opt.roll || 0) * Math.PI / 180, weg = !!opt.unsichtbar;
    const lc = Math.cos(lenk), ls = Math.sin(lenk);
    /* Drehung um die Hochachse durch die Radmitte (Lenkeinschlag) */
    const D = (p) => { const dx = p[0] - cx, dy = p[1] - cy; return [cx + dx * lc - dy * ls, cy + dx * ls + dy * lc, p[2]]; };
    const Dv = (v) => [v[0] * lc - v[1] * ls, v[0] * ls + v[1] * lc, v[2]];
    const nichts = function () {};
    const leer = weg ? { keinLicht: true } : {};
    const cz = r, xa = cx + aussen * breite / 2, xi = cx - aussen * breite / 2;
    const n = 28, kreis = [];
    for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; kreis.push([Math.sin(a), Math.cos(a)]); }
    this.teil(teil, Object.assign({ mitte: [cx, cy, cz] }, opt));
    /* Lauffläche: nur der untere Teil (oben steckt das Rad im Radkasten) */
    const reifen = [26, 26, 28];
    const SEG = 14;
    for (let i = 0; i < SEG; i++) {
      const a1 = Math.PI * (0.5 + i / SEG), a2 = Math.PI * (0.5 + (i + 1) / SEG);
      const p1 = [xi, cy + r * Math.sin(a1), cz + r * Math.cos(a1)], p2 = [xi, cy + r * Math.sin(a2), cz + r * Math.cos(a2)];
      const q = [p1, plus(p1, [xa - xi, 0, 0]), plus(p2, [xa - xi, 0, 0]), p2].map(D);
      const nn = kreuz(minus(q[1], q[0]), minus(q[3], q[0]));
      const aus = Dv([0, Math.sin((a1 + a2) / 2), Math.cos((a1 + a2) / 2)]);
      const pts = pkt(nn, aus) > 0 ? q : q.slice().reverse();
      this.platte(teil, pts, weg ? nichts : function (g, F) {
        g.fillStyle = rgb(reifen); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
        g.strokeStyle = "rgba(0,0,0,0.55)"; g.lineWidth = 0.012;
        for (let k = 1; k < 4; k++) { g.beginPath(); g.moveTo(F.w * k / 4, -0.1); g.lineTo(F.w * k / 4, F.h + 0.1); g.stroke(); }
        /* leichte Rundung zur Flanke hin */
        const gr = g.createLinearGradient(0, 0, F.w, 0);
        gr.addColorStop(0, "rgba(0,0,0,0.35)"); gr.addColorStop(0.18, "rgba(0,0,0,0)"); gr.addColorStop(0.82, "rgba(0,0,0,0)"); gr.addColorStop(1, "rgba(0,0,0,0.35)");
        g.fillStyle = gr; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
      }, Object.assign({ name: teil + "-lauf" + i }, leer));
    }
    /* Flanken: außen mit Felge, innen dunkel */
    const achse = Dv([1, 0, 0]);
    const scheibe = (x, nx, malen, name) => {
      const pts = kreis.map((k) => D([x, cy + r * k[0], cz + r * k[1]]));
      const nn = [0, 0, 0];
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i], b = pts[(i + 1) % pts.length];
        nn[0] += (a[1] - b[1]) * (a[2] + b[2]); nn[1] += (a[2] - b[2]) * (a[0] + b[0]); nn[2] += (a[0] - b[0]) * (a[1] + b[1]);
      }
      this.platte(teil, pkt(nn, achse) * nx > 0 ? pts : pts.slice().reverse(), weg ? nichts : malen, Object.assign({ name: name }, leer));
    };
    const RR = r;
    scheibe(xa, aussen, function (g, F) {
      /* Flächenkoordinaten: Mitte des Rades finden (Umriss ist ein Kreis) */
      const um = F.flaeche.umriss;
      let mx = 0, my = 0;
      for (const q of um) { mx += q[0]; my += q[1]; }
      mx /= um.length; my /= um.length;
      g.save(); g.translate(mx, my);
      felge(g, RR, F, aussen, roll * aussen);
      g.restore();
    }, teil + "-aussen");
    scheibe(xi, -aussen, function (g, F) {
      g.fillStyle = "#161618"; g.fillRect(-1, -1, F.w + 2, F.h + 2);
      const um = F.flaeche.umriss;
      let mx = 0, my = 0;
      for (const q of um) { mx += q[0]; my += q[1]; }
      mx /= um.length; my /= um.length;
      g.fillStyle = "#3a3a3e"; g.beginPath(); g.arc(mx, my, RR * 0.62, 0, Math.PI * 2); g.fill();
      g.fillStyle = "#222"; g.beginPath(); g.arc(mx, my, RR * 0.25, 0, Math.PI * 2); g.fill();
    }, teil + "-innen");
  };
  /* FASSUNG 812 — welche Räder das Drehblatt gerade malt: variante „rad:aus" (keines –
     die Karosserie allein) oder „rad:<vl|vr|hl|hr>:<lenk>:<roll>" (nur dieses eine Rad,
     gelenkt und gedreht). Ohne variante: alle vier wie immer. */
  function radWahl(o) {
    const m = /^rad:(aus|[vh][lr])(?::(-?[\d.]+))?(?::(-?[\d.]+))?$/.exec((o && o.variante) || "");
    return m ? { nur: m[1] === "aus" ? "" : m[1], lenk: +(m[2] || 0), roll: +(m[3] || 0) } : null;
  }
  function radOpt(RW, k) {
    if (!RW) return {};
    if (RW.nur !== k) return { unsichtbar: true };
    return { lenk: k[0] === "v" ? RW.lenk : 0, roll: RW.roll };
  }
  /* Schrift in der Projektion: z zeigt nach oben, sx wählt die Leserichtung */
  function schrift(g, text, x, y, hoehe, sx, farbe, stil) {
    g.save(); g.translate(x, y); g.scale(sx * hoehe / 100, -hoehe / 100);
    g.font = (stil || "italic bold") + " 100px sans-serif"; g.textAlign = "center"; g.textBaseline = "middle";
    g.fillStyle = farbe; g.fillText(text, 0, 0);
    g.restore();
  }
  function ellipse(g, x, y, rx, ry, rot) { g.beginPath(); g.ellipse(x, y, rx, ry, rot || 0, 0, Math.PI * 2); }
  function vieleck(g, pts) { g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]); g.closePath(); }
  function rundRechteck(g, x, y, w, h, r) {
    r = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
    g.beginPath(); g.moveTo(x + r, y); g.lineTo(x + w - r, y); g.quadraticCurveTo(x + w, y, x + w, y + r); g.lineTo(x + w, y + h - r);
    g.quadraticCurveTo(x + w, y + h, x + w - r, y + h); g.lineTo(x + r, y + h); g.quadraticCurveTo(x, y + h, x, y + h - r); g.lineTo(x, y + r); g.quadraticCurveTo(x, y, x + r, y); g.closePath();
  }

  /* =====================================================================
     DER VIPER
     ===================================================================== */
  const L2 = 2.224;                 // halbe Länge
  const VA = 1.384, HA = -1.06;     // Vorder- und Hinterachse (Radstand 2,444 m)
  const RV = 0.326, RH = 0.333;     // Reifenhalbmesser 275/40 R17 und 335/35 R17
  const SPV = 0.755, SPH = 0.77;    // halbe Spurweite

  /* Werkstoffe */
  const ROT = [196, 14, 22];
  const STOFF = {
    lack: { farbe: ROT, glanz: 1.3, haerte: 55, spiegel: 0.85 },
    boden: { farbe: [40, 30, 30] },
    innen: { farbe: [128, 124, 118], glanz: 0.15, haerte: 12, spiegel: 0.05 },
    teppich: { farbe: [38, 38, 40] },
    schwarz: { farbe: [30, 30, 32], glanz: 0.2, haerte: 20, spiegel: 0.08 },
    armatur: { farbe: [132, 124, 114], glanz: 0.1, haerte: 10, spiegel: 0.04 },
    armOben: { farbe: [70, 68, 66], glanz: 0.1, haerte: 10, spiegel: 0.05 },
    rohr: { farbe: [26, 26, 28], glanz: 0.5, haerte: 30, spiegel: 0.25 },
    chrom: { farbe: [170, 172, 178], glanz: 1.4, haerte: 25, spiegel: 1.0 }
  };

  /* Halbprofile (12 Punkte): Boden → Schweller → breiteste Stelle →
     Schulter → Kotflügelkamm (bzw. Türoberkante) → Deck/Innenraum → Mitte */
  function aussen(w, zb, zm, zsh, zf, fk) {
    return [[0, zb], [w - 0.2, zb], [w - 0.05, zb + 0.1], [w, zm], [w - 0.05, zsh], [w - fk, zf]];
  }
  /* Deck: vom Kotflügelkamm (zf) zur Mitte (zc). „mulde" macht die Mitte
     flacher und die Flanken der Kotflügel steiler – die Viper-Kotflügel
     stehen wie Buckel neben der Haube. */
  function deck(y, w, zb, zm, zsh, zf, zc, mulde, fk) {
    fk = fk || 0.17;
    const p = aussen(w, zb, zm, zsh, zf, fk);
    const wf = w - fk;
    const q = 2 + (mulde || 0) * 25;
    for (const f of [0.8, 0.62, 0.45, 0.28, 0.12, 0]) p.push([wf * f, zc + (zf - zc) * Math.pow(f, q)]);
    return { y: y, typ: "deck", p: p };
  }
  function cockpit(y, w, zb, zm, zsh, zt, zfl) {
    const p = aussen(w, zb, zm, zsh, zt, 0.07);
    p.push([w - 0.16, zt - 0.005], [w - 0.19, zt - 0.2], [w - 0.21, zfl + 0.1], [w - 0.3, zfl], [0.25, zfl], [0, zfl]);
    return { y: y, typ: "cockpit", p: p };
  }
  function armatur(y, w, zb, zm, zsh, zt, zd) {
    const p = aussen(w, zb, zm, zsh, zt, 0.07);
    p.push([w - 0.16, zt - 0.005], [w - 0.19, zd], [w - 0.21, zd + 0.005], [w - 0.3, zd + 0.01], [0.25, zd + 0.02], [0, zd + 0.02]);
    return { y: y, typ: "armatur", p: p };
  }
  const K = (o, k) => Object.assign(o, { kante: k });
  const SCHNITTE = [
    /* Heck: runder Entenbürzel, die Rückleuchten sitzen in der senkrechten Heckwand */
    deck(-L2, 0.60, 0.30, 0.42, 0.55, 0.60, 0.62, 0, 0.14),
    deck(-2.205, 0.735, 0.24, 0.43, 0.615, 0.685, 0.70, 0, 0.15),
    deck(-2.14, 0.845, 0.20, 0.45, 0.665, 0.75, 0.765, 0),
    deck(-1.98, 0.92, 0.17, 0.46, 0.70, 0.805, 0.81, 0.01),
    deck(-1.65, 0.952, 0.15, 0.47, 0.72, 0.855, 0.845, 0.022),
    deck(-1.10, 0.96, 0.14, 0.46, 0.72, 0.878, 0.84, 0.035),
    K(deck(-0.90, 0.95, 0.14, 0.46, 0.72, 0.87, 0.845, 0.03), true),
    /* Cockpit: Türen, dahinter die Wanne mit Boden und Mitteltunnel */
    K(cockpit(-0.86, 0.945, 0.14, 0.46, 0.71, 0.845, 0.2), true),
    cockpit(-0.45, 0.9, 0.14, 0.455, 0.70, 0.815, 0.2),
    K(cockpit(0.06, 0.9, 0.14, 0.45, 0.69, 0.80, 0.2), true),
    K(armatur(0.10, 0.902, 0.14, 0.45, 0.69, 0.80, 0.755), true),
    /* Scheibenfuß, dann die lange Haube mit den hohen Kotflügeln */
    K(deck(0.36, 0.918, 0.14, 0.45, 0.69, 0.835, 0.855, 0.005), true),
    deck(0.80, 0.93, 0.14, 0.45, 0.68, 0.835, 0.79, 0.04, 0.22),
    deck(1.38, 0.94, 0.14, 0.45, 0.66, 0.81, 0.70, 0.07, 0.25),
    deck(1.80, 0.92, 0.15, 0.44, 0.62, 0.755, 0.615, 0.06, 0.25),
    deck(2.02, 0.85, 0.165, 0.42, 0.585, 0.68, 0.565, 0.03, 0.22),
    deck(2.14, 0.755, 0.18, 0.40, 0.535, 0.595, 0.525, 0.01, 0.15),
    deck(2.20, 0.665, 0.195, 0.38, 0.49, 0.525, 0.49, 0, 0.14),
    /* Bugschürze: breite, fast senkrechte Front mit dem Maul */
    deck(L2, 0.585, 0.205, 0.36, 0.445, 0.47, 0.46, 0, 0.12)
  ];

  /* ---------- Bemalung der Karosserie ----------
     Jede Kunst bekommt c(farbe, alpha) → Farbe unter dem Licht des Dreiecks */
  const KIEME = [[0.47, 0.25], [0.44, 0.38], [0.46, 0.5], [0.53, 0.6], [0.66, 0.665], [0.8, 0.675], [0.72, 0.62], [0.63, 0.55], [0.58, 0.44], [0.575, 0.3], [0.58, 0.25]];
  const KUNST = {
    schwelle: 0.3, schwellen: { front: 0.1 },
    seite(g, sx, phase, info, F, c) {
      if (!info.aussen) return;
      if (phase === "farbe") {
        /* Tür: Fuge vorn an der Kieme, hinten senkrecht, unten am Schweller */
        g.strokeStyle = c([70, 0, 6], 0.85); g.lineWidth = 0.008;
        g.beginPath(); g.moveTo(-0.80, 0.83); g.bezierCurveTo(-0.84, 0.6, -0.84, 0.4, -0.80, 0.26); g.lineTo(0.46, 0.26); g.stroke();
        /* Kieme: dunkler Luftauslass mit Lamellen */
        vieleck(g, KIEME); g.fillStyle = c([30, 8, 10]); g.fill();
        g.save(); vieleck(g, KIEME); g.clip();
        g.strokeStyle = c([130, 20, 26], 0.9); g.lineWidth = 0.013;
        for (let k = 0; k < 5; k++) { g.beginPath(); g.moveTo(0.44 + k * 0.012, 0.3 + k * 0.08); g.lineTo(0.62 + k * 0.04, 0.33 + k * 0.08); g.stroke(); }
        g.restore();
        g.strokeStyle = c([255, 150, 150], 0.4); g.lineWidth = 0.008; vieleck(g, KIEME); g.stroke();
        /* Schriftzug „VIPER RT/10" auf dem vorderen Kotflügel */
        schrift(g, "VIPER", 0.905 + sx * 0.05, 0.5, 0.05, -sx, c([205, 165, 95], 0.95));
        schrift(g, "RT/10", 0.905 - sx * 0.075, 0.497, 0.03, -sx, c([205, 165, 95], 0.95));
        /* Seitenmarkierungen: vorn gelb, hinten rot */
        rundRechteck(g, 1.94, 0.33, 0.1, 0.035, 0.012); g.fillStyle = c([235, 160, 30]); g.fill();
        rundRechteck(g, -2.04, 0.42, 0.1, 0.035, 0.012); g.fillStyle = c([150, 14, 18]); g.fill();
        /* Radlauf-Kante */
        g.strokeStyle = c([90, 0, 8], 0.55); g.lineWidth = 0.022;
        for (const [ya, rr] of [[VA, RV], [HA, RH]]) { g.beginPath(); g.arc(ya, rr, rr + 0.06, 0, Math.PI); g.stroke(); }
      } else if (phase === "danach") {
        /* Radkästen: dunkel, das Rad steht darin */
        g.fillStyle = c([16, 13, 14]);
        for (const [ya, rr] of [[VA, RV], [HA, RH]]) { g.beginPath(); g.arc(ya, rr, rr + 0.045, 0, Math.PI * 2); g.fill(); }
      }
    },
    oben(g, sz, phase, info, F, c) {
      if (sz < 0 || !info.aussen || phase !== "farbe") return;
      /* Motorhaube: Fuge am Scheibenfuß, zwei Luftschlitze */
      g.strokeStyle = c([70, 0, 6], 0.7); g.lineWidth = 0.009;
      g.beginPath(); g.moveTo(-0.84, 0.40); g.quadraticCurveTo(0, 0.44, 0.84, 0.40); g.stroke();
      for (const s of [-1, 1]) {
        const q = [[s * 0.30, 0.50], [s * 0.52, 0.47], [s * 0.60, 0.62], [s * 0.36, 0.66]];
        vieleck(g, q); g.fillStyle = c([26, 8, 10]); g.fill();
        g.strokeStyle = c([120, 18, 24], 0.9); g.lineWidth = 0.008;
        for (let k = 1; k < 5; k++) { g.beginPath(); g.moveTo(s * (0.30 + k * 0.012), 0.50 + k * 0.032); g.lineTo(s * (0.52 + k * 0.017), 0.47 + k * 0.03); g.stroke(); }
      }
      /* Heckdeckel und Fuge der Persenning-Klappe hinter dem Bügel */
      g.strokeStyle = c([70, 0, 6], 0.6); g.lineWidth = 0.008;
      rundRechteck(g, -0.62, -2.0, 1.24, 0.9, 0.2); g.stroke();
      g.beginPath(); g.moveTo(-0.78, -1.0); g.quadraticCurveTo(0, -1.06, 0.78, -1.0); g.stroke();
    },
    front(g, sy, phase, info, F, c) {
      if (!info.aussen) return;
      const y = info.c[1];
      if (sy > 0 && y > 1.5) {
        if (phase === "farbe") {
          /* Maul mit zwei Querstreben in Wagenfarbe */
          rundRechteck(g, -0.58, 0.215, 1.16, 0.16, 0.06); g.fillStyle = c([18, 16, 17]); g.fill();
          g.save(); rundRechteck(g, -0.58, 0.215, 1.16, 0.16, 0.06); g.clip();
          g.strokeStyle = c([90, 90, 96], 0.5); g.lineWidth = 0.004;
          for (let x = -0.6; x < 0.6; x += 0.025) { g.beginPath(); g.moveTo(x, 0.2); g.lineTo(x + 0.02, 0.38); g.stroke(); }
          g.restore();
          g.fillStyle = c(ROT);
          rundRechteck(g, -0.6, 0.255, 1.2, 0.026, 0.013); g.fill();
          rundRechteck(g, -0.6, 0.31, 1.2, 0.026, 0.013); g.fill();
          for (const s of [-1, 1]) {
            /* Nebelscheinwerfer rund, Blinker gelb */
            ellipse(g, s * 0.69, 0.3, 0.05, 0.048); g.fillStyle = c([40, 40, 44]); g.fill();
            ellipse(g, s * 0.69, 0.3, 0.038, 0.036); g.fillStyle = c([200, 200, 206]); g.fill();
            ellipse(g, s * 0.68, 0.31, 0.017, 0.012); g.fillStyle = c([255, 255, 255], 0.8); g.fill();
            rundRechteck(g, s * 0.66 - 0.035, 0.385, 0.07, 0.028, 0.012); g.fillStyle = c([240, 160, 30]); g.fill();
          }
          /* Widder-Wappen */
          vieleck(g, [[-0.03, 0.46], [0.03, 0.46], [0.03, 0.432], [0, 0.41], [-0.03, 0.432]]); g.fillStyle = c([205, 198, 186]); g.fill();
          vieleck(g, [[-0.02, 0.453], [0.02, 0.453], [0.02, 0.434], [0, 0.418], [-0.02, 0.434]]); g.fillStyle = c([150, 10, 16]); g.fill();
        } else if (phase === "leuchten") {
          const a = F.nacht;
          for (const s of [-1, 1]) {
            ellipse(g, s * 0.69, 0.3, 0.04, 0.038); g.fillStyle = "rgba(255,240,200," + (0.85 * a) + ")"; g.fill();
          }
        }
      } else if (sy < 0 && y < -1.5) {
        if (phase === "farbe") {
          for (const s of [-1, 1]) {
            /* Rückleuchten: ovale dunkelrote Gläser, darunter Blinker */
            ellipse(g, s * 0.6, 0.63, 0.2, 0.062, s * 0.08); g.fillStyle = c([52, 4, 8]); g.fill();
            ellipse(g, s * 0.6, 0.63, 0.186, 0.05, s * 0.08); g.fillStyle = c([150, 14, 24]); g.fill();
            g.strokeStyle = c([60, 0, 0], 0.6); g.lineWidth = 0.004;
            for (let k = -3; k <= 3; k++) { g.beginPath(); g.moveTo(s * 0.6 + k * 0.045, 0.585); g.lineTo(s * 0.6 + k * 0.045, 0.675); g.stroke(); }
            ellipse(g, s * 0.57, 0.65, 0.11, 0.013, s * 0.08); g.fillStyle = c([255, 200, 200], 0.4); g.fill();
            rundRechteck(g, s * 0.6 - 0.09, 0.53, 0.18, 0.028, 0.012); g.fillStyle = c([190, 120, 40]); g.fill();
          }
          /* Kennzeichenmulde und schwarzes Schild „DODGE" */
          rundRechteck(g, -0.24, 0.46, 0.48, 0.17, 0.03); g.fillStyle = c([130, 8, 14]); g.fill();
          rundRechteck(g, -0.2, 0.48, 0.4, 0.12, 0.012); g.fillStyle = c([16, 16, 18]); g.fill();
          schrift(g, "DODGE", 0, 0.54, 0.07, -1, c([210, 20, 34]), "bold");
          schrift(g, "DODGE", 0, 0.36, 0.05, -1, c([110, 0, 8], 0.8), "bold");
          vieleck(g, [[-0.025, 0.69], [0.025, 0.69], [0.025, 0.665], [0, 0.645], [-0.025, 0.665]]); g.fillStyle = c([205, 198, 186]); g.fill();
        } else if (phase === "leuchten") {
          const a = F.nacht;
          for (const s of [-1, 1]) { ellipse(g, s * 0.6, 0.63, 0.18, 0.048, s * 0.08); g.fillStyle = "rgba(255,40,40," + (0.85 * a) + ")"; g.fill(); }
          rundRechteck(g, -0.2, 0.48, 0.4, 0.12, 0.012); g.fillStyle = "rgba(255,250,230," + (0.25 * a) + ")"; g.fill();
        }
      }
    },
    leuchten: true,
    /* Scheinwerfer: langgezogene Tropfen unter Klarglas, schräg auf der
       Kotflügelnase – gemalt senkrecht zu ihrer Fläche */
    lagen: [-1, 1].map((s) => lage([s * 0.6, 2.06, 0.63], [s * 0.22, 0.5, 0.84], [s, 0, 0], function (g, phase, info, F, c) {
      if (!info.aussen) return;
      const r = -0.32;
      if (phase === "farbe") {
        ellipse(g, 0, 0, 0.215, 0.085, r); g.fillStyle = c([40, 40, 46]); g.fill();
        ellipse(g, 0, 0, 0.2, 0.07, r); g.fillStyle = c([140, 146, 158]); g.fill();
        ellipse(g, 0.075, -0.02, 0.058, 0.045, 0); g.fillStyle = c([222, 226, 234]); g.fill();
        ellipse(g, -0.065, 0.025, 0.055, 0.043, 0); g.fillStyle = c([200, 206, 218]); g.fill();
        ellipse(g, 0.075, -0.02, 0.025, 0.02, 0); g.fillStyle = c([120, 124, 134]); g.fill();
        ellipse(g, -0.065, 0.025, 0.024, 0.019, 0); g.fillStyle = c([120, 124, 134]); g.fill();
        ellipse(g, 0.02, -0.035, 0.14, 0.018, r); g.fillStyle = c([255, 255, 255], 0.6); g.fill();
        ellipse(g, 0, 0, 0.212, 0.082, r); g.strokeStyle = c([255, 255, 255], 0.35); g.lineWidth = 0.006; g.stroke();
      } else if (phase === "leuchten") {
        const a = F.nacht;
        ellipse(g, 0, 0, 0.2, 0.07, r); g.fillStyle = "rgba(255,244,215," + (0.85 * a) + ")"; g.fill();
        ellipse(g, 0.075, -0.02, 0.058, 0.045, 0); g.fillStyle = "rgba(255,255,255," + a + ")"; g.fill();
        ellipse(g, -0.065, 0.025, 0.055, 0.043, 0); g.fillStyle = "rgba(255,255,255," + a + ")"; g.fill();
      }
    }, 0.35))
  };
  /* Armaturenbrett (Rückseite des Querschnitts „armatur") */
  const KUNST_ARMATUR = {
    schwelle: 0.3,
    front(g, sy, phase, info, F, c) {
      if (sy > 0) return;
      if (phase === "farbe") {
        /* Fußräume unter dem Brett: dunkel (Teppich im Schatten) */
        g.fillStyle = c([22, 21, 22]);
        rundRechteck(g, -0.72, 0.15, 0.6, 0.29, 0.05); g.fill();
        rundRechteck(g, 0.12, 0.15, 0.6, 0.29, 0.05); g.fill();
        /* Handschuhfach auf der Beifahrerseite */
        rundRechteck(g, -0.66, 0.48, 0.42, 0.2, 0.03); g.fillStyle = c([150, 142, 132]); g.fill();
        g.strokeStyle = c([60, 56, 50], 0.6); g.lineWidth = 0.006; g.stroke();
        /* Mittelteil: Lüftungsdüsen, Klima, Radio */
        for (let k = -1; k <= 1; k++) {
          rundRechteck(g, k * 0.09 - 0.035, 0.62, 0.07, 0.045, 0.008); g.fillStyle = c([28, 28, 30]); g.fill();
          g.strokeStyle = c([90, 90, 90]); g.lineWidth = 0.003;
          for (let l = 1; l < 4; l++) { g.beginPath(); g.moveTo(k * 0.09 - 0.03, 0.62 + l * 0.011); g.lineTo(k * 0.09 + 0.03, 0.62 + l * 0.011); g.stroke(); }
        }
        rundRechteck(g, -0.09, 0.42, 0.18, 0.18, 0.015); g.fillStyle = c([58, 56, 54]); g.fill();
        rundRechteck(g, -0.075, 0.44, 0.15, 0.05, 0.008); g.fillStyle = c([20, 20, 20]); g.fill();
        for (let k = -1; k <= 1; k++) { ellipse(g, k * 0.05, 0.55, 0.016, 0.016); g.fillStyle = c([18, 18, 18]); g.fill(); }
        /* vier kleine Rundinstrumente */
        for (let k = 0; k < 4; k++) {
          const x = -0.15 + k * 0.1;
          ellipse(g, x, 0.715, 0.034, 0.034); g.fillStyle = c([42, 40, 38]); g.fill();
          ellipse(g, x, 0.715, 0.026, 0.026); g.fillStyle = c([236, 232, 222]); g.fill();
          g.strokeStyle = c([200, 24, 24]); g.lineWidth = 0.004; g.beginPath(); g.moveTo(x, 0.715); g.lineTo(x - 0.015, 0.725); g.stroke();
        }
        /* Tacho und Drehzahlmesser vor dem Fahrer (+x) */
        for (const [x, r] of [[0.28, 0.058], [0.47, 0.064]]) {
          ellipse(g, x, 0.63, r + 0.012, r + 0.012); g.fillStyle = c([42, 40, 38]); g.fill();
          ellipse(g, x, 0.63, r, r); g.fillStyle = c([238, 234, 226]); g.fill();
          g.strokeStyle = c([30, 30, 30]); g.lineWidth = 0.003;
          for (let k = 0; k < 9; k++) { const a = -2.4 + k * 0.6; g.beginPath(); g.moveTo(x + Math.cos(a) * r * 0.75, 0.63 + Math.sin(a) * r * 0.75); g.lineTo(x + Math.cos(a) * r * 0.92, 0.63 + Math.sin(a) * r * 0.92); g.stroke(); }
          g.strokeStyle = c([210, 16, 16]); g.lineWidth = 0.005; g.beginPath(); g.moveTo(x, 0.63); g.lineTo(x - r * 0.6, 0.63 + r * 0.35); g.stroke();
        }
      } else if (phase === "leuchten") {
        g.fillStyle = "rgba(255,190,120," + (0.35 * F.nacht) + ")";
        for (const [x, r] of [[0.28, 0.058], [0.47, 0.064]]) { ellipse(g, x, 0.63, r, r); g.fill(); }
        for (let k = 0; k < 4; k++) { ellipse(g, -0.15 + k * 0.1, 0.715, 0.026, 0.026); g.fill(); }
      }
    },
    leuchten: true
  };

  /* Felge: drei breite, leicht gedrehte Speichen, Sechskant-Nabe */
  function viperFelge(g, r, F, aussen, roll) {
    const L = (f) => beleuchtet(f, F);
    /* FASSUNG 812: die ganze Felge dreht sich mit dem Rad (Drehblatt des Auftritts) */
    if (roll) g.rotate(roll);
    g.fillStyle = L([22, 22, 24]); g.beginPath(); g.arc(0, 0, r, 0, Math.PI * 2); g.fill();
    /* Reifenflanke mit leichtem Wulst */
    g.strokeStyle = L([44, 44, 46]); g.lineWidth = r * 0.06; g.beginPath(); g.arc(0, 0, r * 0.84, 0, Math.PI * 2); g.stroke();
    const rf = r * 0.66;
    g.fillStyle = L([214, 216, 222]); g.beginPath(); g.arc(0, 0, rf, 0, Math.PI * 2); g.fill();
    g.fillStyle = L([48, 50, 54]); g.beginPath(); g.arc(0, 0, rf * 0.9, 0, Math.PI * 2); g.fill();
    /* Speichen */
    for (let k = 0; k < 3; k++) {
      const a = k * Math.PI * 2 / 3 + 0.3 * aussen;
      g.save(); g.rotate(a);
      g.beginPath();
      g.moveTo(-rf * 0.22, 0); g.quadraticCurveTo(-rf * 0.35, rf * 0.55, -rf * 0.62, rf * 0.9);
      g.lineTo(rf * 0.5, rf * 0.9); g.quadraticCurveTo(rf * 0.25, rf * 0.45, rf * 0.22, 0); g.closePath();
      g.fillStyle = L([232, 234, 240]); g.fill();
      g.beginPath(); g.moveTo(rf * 0.05, rf * 0.15); g.quadraticCurveTo(rf * 0.1, rf * 0.5, rf * 0.3, rf * 0.88); g.lineTo(rf * 0.5, rf * 0.9); g.quadraticCurveTo(rf * 0.25, rf * 0.45, rf * 0.22, 0); g.closePath();
      g.fillStyle = L([176, 178, 186]); g.fill();
      g.restore();
    }
    g.strokeStyle = L([240, 242, 246]); g.lineWidth = r * 0.04; g.beginPath(); g.arc(0, 0, rf * 0.95, 0, Math.PI * 2); g.stroke();
    /* Nabe: Sechskant */
    g.fillStyle = L([150, 152, 158]); g.beginPath(); g.arc(0, 0, rf * 0.3, 0, Math.PI * 2); g.fill();
    g.beginPath();
    for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; g.lineTo(Math.cos(a) * rf * 0.17, Math.sin(a) * rf * 0.17); }
    g.closePath(); g.fillStyle = L([210, 212, 216]); g.fill();
    g.fillStyle = L([90, 92, 96]); g.beginPath(); g.arc(0, 0, rf * 0.07, 0, Math.PI * 2); g.fill();
  }

  ST.modell("auto_viper", {
    name: "Dodge Viper RT/10", gruppe: "Fahrzeuge", grund: [1.92, 4.45], hoehe: 1.12, bauzeit: 60,
    auto: { laenge: 4.448, breite: 1.92, hoehe: 1.118, radstand: 2.444, vorn: "+y" },
    bauen(M, o) {
      const W = new Werkstatt(M);
      /* Reihenfolge der Teile: Innenraum (Wanne) zuerst, alles andere nach Nähe */
      W.teil("wanne", { ebene: 0 });
      const E1 = { ebene: 1 };
      for (const t of ["hinten", "hinterwagen", "tuer-l", "tuer-r", "armaturen", "vorderwagen", "nase"]) W.teil(t, E1);

      /* ---------- Karosserie ---------- */
      W.loft({
        schnitte: schnitteGlatt(SCHNITTE, 0.16),
        kanteJ: (typ, j) => j === 1 || ((typ === "cockpit" || typ === "armatur") && (j === 5 || j === 6)),
        zuordnen(q) {
          const innen = q.js >= 6 && (q.typA !== "deck" || q.typB !== "deck");
          if (innen) {
            const arm = q.typA === "armatur" || q.typB === "armatur";
            if (arm) {
              const gesicht = q.typA === "cockpit" && q.typB === "armatur";
              return { teil: "armaturen", stoff: gesicht ? STOFF.armatur : STOFF.armOben, kunst: gesicht ? KUNST_ARMATUR : null, info: {} };
            }
            if (q.typA === "deck" || q.typB === "deck") return { teil: "wanne", stoff: STOFF.schwarz };
            return { teil: "wanne", stoff: q.js >= 9 ? STOFF.teppich : STOFF.innen };
          }
          let teil;
          if (q.yc > 1.75) teil = "nase";
          else if (q.yc > 0.36) teil = "vorderwagen";
          else if (q.yc > -0.9) teil = q.seite > 0 ? "tuer-l" : "tuer-r";
          else if (q.yc > -1.75) teil = "hinterwagen";
          else teil = "hinten";
          return { teil: teil, stoff: q.js === 0 ? STOFF.boden : STOFF.lack, kunst: KUNST, info: { aussen: true } };
        },
        deckel: { vorn: { teil: "nase", stoff: STOFF.lack, kunst: KUNST, info: { aussen: true } }, hinten: { teil: "hinten", stoff: STOFF.lack, kunst: KUNST, info: { aussen: true } } }
      });

      /* ---------- Windschutzscheibe mit schwarzem Rahmen ---------- */
      W.teil("scheibe", { ebene: 1 });
      const S0 = [0.36, 0.858], S1 = [-0.02, 1.105], BU = 0.77, BO = 0.64;
      W.platte("scheibe", [[-BO, S1[0], S1[1]], [BO, S1[0], S1[1]], [BU, S0[0], S0[1]], [-BU, S0[0], S0[1]]], function (g, F) {
        /* Flächenkoordinaten: um[0] oben links, um[1] oben rechts, um[2] unten rechts, um[3] unten links; b nach unten */
        const um = F.flaeche.umriss, H = um[2][1];
        const nacht = F.nacht || 0;
        g.fillStyle = "rgba(" + (nacht ? "30,40,60" : "150,175,200") + ",0.16)"; g.fillRect(-1, -1, F.w + 2, H + 2);
        /* Spiegelung des Himmels: schräge helle Streifen */
        const gr = g.createLinearGradient(0, 0, F.w, H);
        gr.addColorStop(0, "rgba(255,255,255,0.22)"); gr.addColorStop(0.3, "rgba(255,255,255,0.03)"); gr.addColorStop(0.5, "rgba(255,255,255,0.18)"); gr.addColorStop(0.58, "rgba(255,255,255,0.02)"); gr.addColorStop(1, "rgba(255,255,255,0.08)");
        g.fillStyle = gr; g.globalAlpha = 1 - 0.8 * nacht; g.fillRect(-1, -1, F.w + 2, H + 2); g.globalAlpha = 1;
        /* Rahmen: Säulen, Oberkante, Fuß */
        const rahmen = beleuchtet([26, 26, 28], F);
        g.strokeStyle = rahmen; g.lineWidth = 0.07; g.lineJoin = "round";
        vieleck(g, um); g.stroke();
        g.lineWidth = 0.05; g.beginPath(); g.moveTo(um[0][0], um[0][1] + 0.03); g.lineTo(um[1][0], um[1][1] + 0.03); g.stroke();
        /* Innenspiegel */
        const mx = (um[0][0] + um[1][0]) / 2;
        g.fillStyle = rahmen; rundRechteck(g, mx - 0.1, 0.06, 0.2, 0.05, 0.015); g.fill();
        g.fillRect(mx - 0.008, 0.02, 0.016, 0.05);
        /* Scheibenwischer */
        g.strokeStyle = rahmen; g.lineWidth = 0.012;
        g.beginPath(); g.moveTo(um[3][0] + 0.35, H - 0.04); g.lineTo(um[3][0] + 0.78, H - 0.1); g.stroke();
        g.beginPath(); g.moveTo(um[3][0] + 0.95, H - 0.04); g.lineTo(um[3][0] + 1.36, H - 0.1); g.stroke();
      }, { keinLicht: true, beidseitig: true, name: "scheibe" });

      /* ---------- Sitze (graues Leder) ---------- */
      const GRAU = [138, 134, 128];
      const leder = (art) => function (g, F) {
        g.fillStyle = rgb(GRAU); g.fillRect(-1, -1, F.w + 2, F.h + 2);
        if (art === "vorn" && F.w > 0.3) {
          /* Wangen links und rechts, Steppnähte */
          const gr = g.createLinearGradient(0, 0, F.w, 0);
          gr.addColorStop(0, "rgba(255,255,255,0.18)"); gr.addColorStop(0.2, "rgba(0,0,0,0.12)"); gr.addColorStop(0.24, "rgba(0,0,0,0)"); gr.addColorStop(0.76, "rgba(0,0,0,0)"); gr.addColorStop(0.8, "rgba(0,0,0,0.12)"); gr.addColorStop(1, "rgba(255,255,255,0.18)");
          g.fillStyle = gr; g.fillRect(-1, -1, F.w + 2, F.h + 2);
          g.strokeStyle = "rgba(80,76,70,0.5)"; g.lineWidth = 0.006;
          for (const x of [0.22, 0.78]) { g.beginPath(); g.moveTo(F.w * x, 0); g.lineTo(F.w * x, F.h); g.stroke(); }
          for (let k = 1; k < 4; k++) { g.beginPath(); g.moveTo(F.w * 0.22, F.h * k / 4); g.lineTo(F.w * 0.78, F.h * k / 4); g.stroke(); }
        }
      };
      for (const s of [1, -1]) {
        const cx = s * 0.37, name = "sitz" + (s > 0 ? "-l" : "-r");
        W.teil(name, { ebene: 1, mitte: [cx, -0.5, 0.5] });
        /* Sitzfläche */
        W.kiste(name, [cx - 0.23, -0.72, 0.2], [0.46, 0, 0], [0, 0.5, 0], [0, 0, 0.16], { oben: leder("vorn"), rest: leder("rand"), unten: null });
        /* Wangen der Sitzfläche */
        for (const w of [-1, 1]) W.kiste(name, [cx + w * 0.2 - 0.04, -0.72, 0.34], [0.08, 0, 0], [0, 0.46, 0], [0, 0, 0.06], { rest: leder("rand"), unten: null });
        /* Lehne: nach hinten geneigt, hoch, oben gerundet (Schalensitz) */
        const t = einheit([0, -0.26, 1]), d = [0, -0.15, 0];
        const P = (a, b) => [cx + a, -0.66 + t[1] * b, 0.3 + t[2] * b];
        const um = [P(-0.24, 0), P(0.24, 0), P(0.26, 0.38), P(0.24, 0.64), P(0.15, 0.76), P(-0.15, 0.76), P(-0.24, 0.64), P(-0.26, 0.38)];
        W.prisma(name, um, d, (art) => leder(art));
      }
      /* Mittelkonsole mit Schalthebel und Handbremse */
      W.teil("konsole", { ebene: 1, mitte: [0, -0.3, 0.4] });
      W.kiste("konsole", [-0.12, -0.78, 0.2], [0.24, 0, 0], [0, 0.84, 0], [0, 0, 0.2], {
        oben: function (g, F) {
          g.fillStyle = rgb([140, 134, 126]); g.fillRect(-1, -1, F.w + 2, F.h + 2);
          /* Schaltsack (schwarz) vorn, Handbremse hinten */
          g.fillStyle = "#1a1a1a"; ellipse(g, F.w / 2, F.h - 0.2, 0.05, 0.06); g.fill();
          rundRechteck(g, F.w / 2 - 0.03, F.h * 0.45, 0.06, 0.2, 0.02); g.fill();
          g.fillStyle = "#6b6660"; rundRechteck(g, F.w / 2 + 0.05, F.h - 0.14, 0.05, 0.035, 0.008); g.fill();
        }, rest: rgb([128, 122, 114]), unten: null
      });
      M.figur({ x: 0, y: 0.03, z: 0.4, breite: 0.2, hoehe: 0.26, schatten: false, malen(g, s, F) {
        /* Schalthebel mit schwarzem Knauf */
        g.strokeStyle = "#1c1c1c"; g.lineWidth = Math.max(1, 0.022 * s); g.lineCap = "round";
        g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -0.2 * s * ST.KZ); g.stroke();
        g.fillStyle = "#2a2a2a"; g.beginPath(); g.arc(0, -0.21 * s * ST.KZ, 0.032 * s, 0, Math.PI * 2); g.fill();
      } });

      /* ---------- Lenkrad (links = +x), drei Speichen ---------- */
      W.teil("lenkrad", { ebene: 1, mitte: [0.37, -0.08, 0.66] });
      {
        const c = [0.37, -0.1, 0.665], nL = einheit([0, -0.8, 0.6]);
        const e1 = [1, 0, 0], e2 = kreuz(nL, e1);
        const pts = [];
        for (let k = 0; k < 20; k++) { const a = k / 20 * Math.PI * 2; pts.push(plus(c, plus(mal(e1, Math.cos(a) * 0.19), mal(e2, Math.sin(a) * 0.19)))); }
        W.platte("lenkrad", pts, function (g, F) {
          const um = F.flaeche.umriss;
          let mx = 0, my = 0; for (const q of um) { mx += q[0]; my += q[1]; } mx /= um.length; my /= um.length;
          const f = beleuchtet([24, 24, 26], F);
          g.strokeStyle = f; g.lineWidth = 0.035; g.beginPath(); g.arc(mx, my, 0.165, 0, Math.PI * 2); g.stroke();
          g.fillStyle = f;
          for (const a of [0, Math.PI, Math.PI / 2]) { g.save(); g.translate(mx, my); g.rotate(a); rundRechteck(g, -0.022, 0, 0.044, 0.16, 0.01); g.fill(); g.restore(); }
          g.beginPath(); g.arc(mx, my, 0.055, 0, Math.PI * 2); g.fill();
          g.fillStyle = "#b01018"; g.beginPath(); g.arc(mx, my, 0.022, 0, Math.PI * 2); g.fill();
        }, { keinLicht: true, beidseitig: true, name: "lenkrad" });
        /* Lenksäule */
        W.kiste("lenkrad", [0.345, -0.08, 0.6], [0.05, 0, 0], [0, 0.2, 0.0], [0, 0, 0.05], { rest: "#1e1e20", unten: null });
      }

      /* ---------- Bügel hinter den Sitzen (schwarz) ---------- */
      W.teil("buegel", { ebene: 1, mitte: [0, -0.92, 0.9] });
      {
        const y = -0.87, ptsB = [];
        const aussenB = [[-0.84, 0.82], [-0.8, 1.0], [-0.64, 1.12], [0.64, 1.12], [0.8, 1.0], [0.84, 0.82]];
        const innenB = [[0.68, 0.82], [0.66, 0.96], [0.54, 1.055], [-0.54, 1.055], [-0.66, 0.96], [-0.68, 0.82]];
        for (const [x, z] of aussenB.concat(innenB)) ptsB.push([x, y, z]);
        W.prisma("buegel", ptsB, [0, -0.1, 0], () => (g, F) => { g.fillStyle = "#1d1d1f"; g.fillRect(-1, -1, F.w + 2, F.h + 2); });
      }

      /* ---------- Außenspiegel (rot, auf der Tür am Scheibenfuß) ---------- */
      for (const s of [1, -1]) {
        const name = "spiegel" + (s > 0 ? "-l" : "-r");
        W.teil(name, { ebene: 1, mitte: [s * 0.98, 0.22, 0.85] });
        /* Fuß auf der Türoberkante, Arm nach außen, Gehäuse in Wagenfarbe */
        W.kiste(name, [s * 0.87 - 0.02, 0.2, 0.79], [0.04, 0, 0], [0, 0.06, 0], [0, 0, 0.05], { rest: rgb([170, 14, 22]), unten: null });
        W.kiste(name, [s > 0 ? 0.87 : -0.98, 0.215, 0.825], [0.11, 0, 0], [0, 0.03, 0], [0, 0, 0.025], { rest: rgb([170, 14, 22]), unten: null });
        W.kiste(name, [s > 0 ? 0.93 : -1.07, 0.18, 0.8], [0.14, 0, 0], [0, 0.1, 0], [0, 0, 0.09], {
          rest: rgb([190, 16, 24]), unten: null,
          hinten: function (g, F) { g.fillStyle = rgb([190, 16, 24]); g.fillRect(-1, -1, F.w + 2, F.h + 2); rundRechteck(g, 0.012, 0.012, F.w - 0.024, F.h - 0.024, 0.02); g.fillStyle = "#8fa2b8"; g.fill(); }
        });
      }

      /* ---------- Seitenrohre (Sidepipes) mit Hitzeschild ---------- */
      for (const s of [1, -1]) {
        const name = "rohr" + (s > 0 ? "-l" : "-r");
        W.teil(name, { ebene: 1, mitte: [s * 0.9, -0.05, 0.2] });
        const ring = (r, rz) => { const p = []; for (let k = 0; k < 10; k++) { const a = k / 10 * Math.PI * 2; p.push([Math.sin(a) * r, 0.205 + Math.cos(a) * rz]); } return p.reverse(); };
        const ks = [
          { y: -0.60, p: ring(0.06, 0.06) }, { y: -0.52, p: ring(0.075, 0.07) }, { y: 0.35, p: ring(0.075, 0.07) }, { y: 0.47, p: ring(0.03, 0.04) }
        ];
        const KUNST_ROHR = {
          schwelle: 0.2,
          seite(g, sx, phase, info, F, c) {
            if (phase !== "farbe") return;
            /* Lüftungsschlitze im Hitzeschild */
            g.fillStyle = c([100, 100, 106], 0.8);
            for (let k = 0; k < 3; k++) rundRechteck(g, -0.45, 0.19 + k * 0.022, 0.75, 0.01, 0.005), g.fill();
          }
        };
        W.loft({
          voll: true, dx: s * 0.9,
          schnitte: ks.map((k) => ({ y: k.y, typ: "rohr", p: k.p.map((q) => [q[0], q[1]]) })),
          zuordnen: () => ({ teil: name, stoff: STOFF.rohr, kunst: KUNST_ROHR, info: {} }),
          deckel: { vorn: { teil: name, stoff: STOFF.rohr }, hinten: null }
        });
        /* Endrohr (Chrom), leicht nach außen */
        const endR = [];
        for (let k = 0; k < 10; k++) { const a = k / 10 * Math.PI * 2; endR.push([Math.sin(a) * 0.042, 0.2 + Math.cos(a) * 0.042]); }
        W.loft({
          voll: true, dx: s * 0.91,
          schnitte: [{ y: -0.70, typ: "rohr", p: endR.slice().reverse() }, { y: -0.56, typ: "rohr", p: endR.slice().reverse() }],
          zuordnen: () => ({ teil: name, stoff: STOFF.chrom }),
          deckel: { hinten: { teil: name, stoff: { farbe: [12, 12, 12] } }, vorn: null }
        });
      }

      /* ---------- Räder (FASSUNG 812: fürs Drehblatt einzeln, gelenkt und gedreht) ---------- */
      const RW = radWahl(o);
      for (const [cy, r, sp, b, nm] of [[VA, RV, SPV, 0.275, "v"], [HA, RH, SPH, 0.335, "h"]]) {
        for (const s of [1, -1]) { const k = nm + (s > 0 ? "l" : "r"); W.rad("rad-" + k, s * sp, cy, r, b, s, viperFelge, Object.assign({ ebene: 1 }, radOpt(RW, k))); }
      }

      /* ---------- Antenne auf dem linken hinteren Kotflügel ---------- */
      M.figur({ x: 0.72, y: -1.55, z: 0.86, breite: 0.1, hoehe: 0.36, malen(g, s, F) {
        g.strokeStyle = F.schatten ? "#000" : "#2a2a2c"; g.lineWidth = Math.max(0.8, 0.008 * s);
        g.beginPath(); g.moveTo(0, 0); g.lineTo(0.02 * s, -0.34 * s * ST.KZ); g.stroke();
      } });

      W.fertig();

      /* ---------- Licht bei Nacht: Scheinwerfer und Rückleuchten ---------- */
      for (const s of [-1, 1]) {
        M.licht(s * 0.6, 2.15, 0.59, 0.9, "255,244,215", 1.0);
        M.licht(s * 0.6, -2.2, 0.63, 0.45, "255,40,30", 0.8);
      }
      M.bodenlicht(0, 4.2, 2.6, "255,240,205", 0.9);
      M.bodenlicht(0, -2.7, 0.9, "255,30,20", 0.5);
    }
  });
})();
