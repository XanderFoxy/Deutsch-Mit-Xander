/* =====================================================================
   BAUKASTEN-STADT — DAS BATMOBIL (Fernsehserie 1966)
   ---------------------------------------------------------------------
   XANDER: Das Batmobil soll „als fahrendes Auto" durch die Stadt fahren.

   Vorbild (zwei Standbilder aus der Serie, Flugfeld):
     • Glänzend schwarz, sehr lang und flach (5,8 m mit den Flossen,
       2,1 m breit, mit den Blasenscheiben 1,12 m hoch), Radstand 3,2 m.
     • Rote Zierlinien („Pinstripes") entlang aller Kanten: über den
       Radläufen, unten am Schweller, auf den Kotflügelkämmen, an den
       Flossen und um die Öffnungen der Front.
     • Die Front als Fledermausmaske: hohe Kotflügel-„Augenbrauen" mit
       je einer Lampe, dazwischen die tiefere Haube, unten zwei große
       rot umrandete Öffnungen.
     • Zwei getrennte Blasenscheiben aus Plexiglas vor Fahrer und
       Beifahrer, dazwischen die Mittelkonsole mit dem roten Bat-Licht.
     • Hinten riesige Flossen, die weit über das Heck hinausragen, in der
       Mitte die Düse der „Atomturbine".
     • Rotes Fledermaus-Wappen auf der Tür, Chromfelgen mit roter
       Fledermaus-Nabe.

   KOORDINATEN: Meter, Mitte auf (0,0,0), die Front zeigt nach +y,
   Fahrerseite (links) bei +x.

   WIE ES GEBAUT IST: dieselbe Werkstatt wie beim Dodge Viper
   (auto_viper.js) – Karosserie als Loft aus Querschnitten mit weicher
   Schattierung und Lackglanz, Bemalung per Projektion, Teile so zerlegt,
   dass Sitze, Scheiben und Räder in jedem Drehwinkel richtig verdeckt
   werden. Die Werkstatt steht in beiden Dateien, damit jedes Auto für
   sich allein geladen und gebacken werden kann.
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
     DAS BATMOBIL
     ===================================================================== */
  const L2 = 2.85;                  // halbe Länge der Karosserie (Flossenspitzen bis −2,95)
  const VA = 1.70, HA = -1.50;      // Achsen (Radstand 3,20 m)
  const RR = 0.355, SP = 0.82, RB = 0.23;   // Reifenhalbmesser, halbe Spur, Reifenbreite

  const SCHWARZ = [14, 14, 18];
  const PIN = [236, 44, 30];        // das leuchtende Rot der Zierlinien
  const STOFF = {
    lack: { farbe: SCHWARZ, glanz: 1.8, haerte: 70, spiegel: 1.25, glanzRGB: [215, 225, 245] },
    boden: { farbe: [12, 12, 14] },
    innen: { farbe: [34, 30, 32], glanz: 0.2, haerte: 14, spiegel: 0.08 },
    teppich: { farbe: [70, 14, 18] },
    schwarz: { farbe: [20, 20, 22], glanz: 0.2, haerte: 20, spiegel: 0.08 },
    armatur: { farbe: [30, 28, 30], glanz: 0.3, haerte: 20, spiegel: 0.1 },
    armOben: { farbe: [26, 24, 26], glanz: 0.2, haerte: 14, spiegel: 0.08 },
    chrom: { farbe: [175, 178, 186], glanz: 1.6, haerte: 30, spiegel: 1.2 }
  };

  /* Halbprofile (12 Punkte) wie beim Viper */
  function aussen(w, zb, zm, zsh, zf, fk) {
    return [[0, zb], [w - 0.26, zb], [w - 0.06, zb + 0.12], [w, zm], [w - 0.035, zsh], [w - fk, zf]];
  }
  /* Haube: vom Kotflügelkamm (zf) tief in die Mitte (zc) – die hohen
     Kotflügel bilden die „Augenbrauen" der Fledermausmaske */
  function deck(y, w, zb, zm, zsh, zf, zc, q, fk) {
    fk = fk || 0.14;
    const p = aussen(w, zb, zm, zsh, zf, fk), wf = w - fk;
    for (const f of [0.8, 0.62, 0.45, 0.28, 0.12, 0]) p.push([wf * f, zc + (zf - zc) * Math.pow(f, q || 2)]);
    return { y: y, typ: "deck", p: p };
  }
  /* Heck mit Flossen: schmale flache Flossenoberkante außen, innen steil
     hinab auf das tiefe Deck */
  function finne(y, w, zb, zm, zsh, zf, zd) {
    const p = aussen(w, zb, zm, zsh, zf, 0.05);
    p.push([w - 0.13, zf - 0.008], [w - 0.2, zd + 0.05], [0.62, zd + 0.01], [0.4, zd], [0.18, zd], [0, zd]);
    return { y: y, typ: "flosse", p: p };
  }
  function cockpit(y, w, zb, zm, zsh, zt, zfl) {
    const p = aussen(w, zb, zm, zsh, zt, 0.05);
    p.push([w - 0.13, zt - 0.005], [w - 0.17, zt - 0.2], [w - 0.2, zfl + 0.1], [w - 0.3, zfl], [0.2, zfl], [0, zfl]);
    return { y: y, typ: "cockpit", p: p };
  }
  function armatur(y, w, zb, zm, zsh, zt, zd) {
    const p = aussen(w, zb, zm, zsh, zt, 0.05);
    p.push([w - 0.13, zt - 0.005], [w - 0.17, zd], [w - 0.2, zd + 0.005], [w - 0.3, zd + 0.01], [0.2, zd + 0.02], [0, zd + 0.02]);
    return { y: y, typ: "armatur", p: p };
  }
  const K = (o) => Object.assign(o, { kante: true });
  const SCHNITTE = [
    /* Heckwand mit Turbinendüse, dann die Flossen über den Hinterrädern */
    finne(-2.55, 0.94, 0.30, 0.44, 0.58, 0.90, 0.60),
    finne(-2.45, 1.0, 0.25, 0.45, 0.61, 0.915, 0.64),
    finne(-2.15, 1.03, 0.21, 0.45, 0.62, 0.915, 0.68),
    finne(-1.50, 1.05, 0.19, 0.45, 0.62, 0.895, 0.71),
    finne(-1.10, 1.045, 0.19, 0.45, 0.62, 0.86, 0.72),
    K(finne(-0.95, 1.04, 0.19, 0.45, 0.62, 0.845, 0.72)),
    /* Cockpit */
    K(cockpit(-0.92, 1.035, 0.19, 0.45, 0.62, 0.8, 0.24)),
    cockpit(-0.35, 1.025, 0.19, 0.45, 0.62, 0.775, 0.24),
    K(cockpit(0.2, 1.025, 0.19, 0.45, 0.62, 0.77, 0.24)),
    K(armatur(0.24, 1.025, 0.19, 0.45, 0.62, 0.77, 0.73)),
    /* Scheibenfuß und die lange Haube */
    K(deck(0.45, 1.03, 0.19, 0.45, 0.62, 0.785, 0.77, 2)),
    deck(1.0, 1.04, 0.19, 0.46, 0.63, 0.77, 0.70, 2.5),
    deck(1.70, 1.05, 0.19, 0.47, 0.635, 0.765, 0.635, 3),
    deck(2.30, 1.035, 0.20, 0.46, 0.625, 0.75, 0.575, 3.5),
    deck(2.60, 0.99, 0.22, 0.45, 0.61, 0.735, 0.525, 4, 0.16),
    deck(2.76, 0.92, 0.25, 0.44, 0.585, 0.70, 0.485, 4, 0.17),
    deck(L2, 0.84, 0.28, 0.42, 0.55, 0.64, 0.46, 4, 0.16)
  ];
  /* Kamm der Kotflügel (für die roten Linien in der Draufsicht) */
  const KAMM = (function () {
    const ys = SCHNITTE.map((s) => s.y), xs = SCHNITTE.map((s) => s.p[5][0]), zs = SCHNITTE.map((s) => s.p[5][1]);
    return { x: monoton(ys, xs), z: monoton(ys, zs) };
  })();

  /* Fledermaus-Umriss (Breite 2, Mitte 0, y nach oben) */
  function fledermaus(g, x, y, b, sx) {
    const k = b / 2;
    g.save(); g.translate(x, y); g.scale(k * sx, k);
    g.beginPath();
    g.moveTo(0, 0.12);
    g.lineTo(0.08, 0.3); g.lineTo(0.12, 0.16);                       // Ohr
    g.quadraticCurveTo(0.45, 0.28, 1.0, 0.42);                        // Flügeloberkante
    g.quadraticCurveTo(0.86, 0.12, 0.92, -0.12);
    g.quadraticCurveTo(0.74, -0.02, 0.62, -0.18);                     // Zacken unten
    g.quadraticCurveTo(0.5, -0.06, 0.34, -0.2);
    g.quadraticCurveTo(0.22, -0.1, 0.1, -0.24);
    g.lineTo(0, -0.36);
    g.lineTo(-0.1, -0.24);
    g.quadraticCurveTo(-0.22, -0.1, -0.34, -0.2);
    g.quadraticCurveTo(-0.5, -0.06, -0.62, -0.18);
    g.quadraticCurveTo(-0.74, -0.02, -0.92, -0.12);
    g.quadraticCurveTo(-0.86, 0.12, -1.0, 0.42);
    g.quadraticCurveTo(-0.45, 0.28, -0.12, 0.16);
    g.lineTo(-0.08, 0.3); g.closePath();
    g.restore();
  }

  /* ---------- Bemalung der Karosserie ---------- */
  const KUNST = {
    schwelle: 0.3, schwellen: { front: 0.12, seite: 0.4 },
    seite(g, sx, phase, info, F, c) {
      if (!info.aussen) return;
      /* Innenwand einer Flosse (zeigt zur Wagenmitte): nur die Flossenlinie */
      const innenwand = Math.sign(info.n[0]) !== Math.sign(info.c[0]);
      if (phase === "farbe" || phase === "leuchten") {
        /* nachts glimmen die Zierlinien leicht (wie die Leuchtfarbe im Film) */
        const rot = phase === "farbe" ? c(PIN) : "rgba(255,60,40," + (0.35 * F.nacht).toFixed(3) + ")", br = 0.018;
        g.strokeStyle = rot; g.lineWidth = br; g.lineJoin = "round"; g.lineCap = "round";
        /* untere Linie: von der Front über beide Radläufe bis zum Heck */
        const ra = RR + 0.085;
        if (!innenwand) {
        g.beginPath();
        g.moveTo(2.84, 0.36);
        g.lineTo(VA + ra + 0.02, 0.36);
        g.arc(VA, RR, ra, 0.07, Math.PI - 0.07, false);
        g.lineTo(HA + ra + 0.02, 0.4);
        g.arc(HA, RR, ra, 0.12, Math.PI - 0.12, false);
        g.lineTo(-2.54, 0.44);
        g.stroke();
        }
        /* obere Linie: unter der Flossenkante vom Türende bis zum Heck */
        g.beginPath();
        for (let y = -0.55; y >= -2.56; y -= 0.05) {
          const z = Math.min(KAMM.z(Math.max(-2.55, y)), 0.95) - 0.035;
          if (y === -0.55) g.moveTo(y, z - 0.02); else g.lineTo(y, z);
        }
        g.stroke();
        if (innenwand) return;
        /* Fledermaus-Wappen auf der Tür */
        fledermaus(g, -0.25, 0.6, 0.44, -sx); g.fillStyle = rot; g.fill();
        if (phase === "leuchten") return;
        /* Türfuge */
        g.strokeStyle = c([0, 0, 0], 0.9); g.lineWidth = 0.008;
        g.beginPath(); g.moveTo(0.42, 0.76); g.lineTo(0.42, 0.42); g.moveTo(-0.9, 0.78); g.lineTo(-0.9, 0.44); g.stroke();
      } else if (phase === "danach") {
        /* Radkästen dunkel – nur unterhalb der Schulter, sonst läge das
           Dunkel oben auf dem Kotflügel */
        if (Math.abs(info.n[0]) < 0.5 || innenwand) return;
        g.save(); g.beginPath(); g.rect(-4, -1, 8, 1.62); g.clip();
        g.fillStyle = c([8, 8, 10]);
        for (const ya of [VA, HA]) { g.beginPath(); g.arc(ya, RR, RR + 0.06, 0, Math.PI * 2); g.fill(); }
        g.restore();
      }
    },
    oben(g, sz, phase, info, F, c) {
      if (sz < 0 || !info.aussen || (phase !== "farbe" && phase !== "leuchten")) return;
      const rot = phase === "farbe" ? c(PIN) : "rgba(255,60,40," + (0.35 * F.nacht).toFixed(3) + ")";
      g.strokeStyle = rot; g.lineWidth = 0.02; g.lineCap = "round";
      /* rote Linien auf den Kotflügelkämmen, vorn zur „Augenbraue" gebogen */
      for (const s of [-1, 1]) {
        g.beginPath();
        for (let y = 0.5; y <= 2.86; y += 0.05) { const x = s * (KAMM.x(Math.min(y, 2.85)) - 0.01); if (y === 0.5) g.moveTo(x, y); else g.lineTo(x, y); }
        g.stroke();
        /* Flossenoberkante */
        g.beginPath();
        for (let y = -0.95; y >= -2.56; y -= 0.05) { const x = s * (KAMM.x(Math.max(y, -2.55)) - 0.04); if (y === -0.95) g.moveTo(x, y); else g.lineTo(x, y); }
        g.stroke();
      }
      if (phase === "leuchten") return;
      /* Haubenfuge und Mittellinie */
      g.strokeStyle = c([0, 0, 0], 0.8); g.lineWidth = 0.008;
      g.beginPath(); g.moveTo(-0.7, 0.55); g.quadraticCurveTo(0, 0.6, 0.7, 0.55); g.stroke();
      /* Heckdeckel zwischen den Flossen */
      g.beginPath(); g.moveTo(-0.6, -1.1); g.lineTo(0.6, -1.1); g.lineTo(0.6, -2.45); g.lineTo(-0.6, -2.45); g.closePath(); g.stroke();
    },
    front(g, sy, phase, info, F, c) {
      if (!info.aussen) return;
      const y = info.c[1], rot = c(PIN);
      if (sy > 0 && y > 2.3) {
        if (phase === "farbe") {
          /* zwei große Öffnungen, rot umrandet, mit dunklem Gitter */
          for (const s of [-1, 1]) {
            const q = [[s * 0.07, 0.29], [s * 0.07, 0.43], [s * 0.26, 0.47], [s * 0.66, 0.45], [s * 0.7, 0.33], [s * 0.6, 0.29]];
            vieleck(g, q); g.fillStyle = c([6, 6, 8]); g.fill();
            g.save(); vieleck(g, q); g.clip();
            g.strokeStyle = c([60, 60, 66], 0.8); g.lineWidth = 0.005;
            for (let z = 0.3; z < 0.48; z += 0.022) { g.beginPath(); g.moveTo(-0.8, z); g.lineTo(0.8, z); g.stroke(); }
            g.restore();
            vieleck(g, q); g.strokeStyle = rot; g.lineWidth = 0.02; g.stroke();
            /* Lampen in den Kotflügelköpfen, rot umrandete Rahmen */
            const l = [[s * 0.66, 0.53], [s * 0.93, 0.56], [s * 0.93, 0.64], [s * 0.7, 0.62]];
            vieleck(g, l); g.fillStyle = c([20, 18, 18]); g.fill();
            rundRechteck(g, s > 0 ? 0.72 : -0.9, 0.555, 0.18, 0.05, 0.015); g.fillStyle = c([240, 150, 60]); g.fill();
            rundRechteck(g, s > 0 ? 0.74 : -0.84, 0.565, 0.1, 0.018, 0.008); g.fillStyle = c([255, 230, 190]); g.fill();
            vieleck(g, l); g.strokeStyle = rot; g.lineWidth = 0.018; g.stroke();
          }
          /* Mittelsteg mit Kettenmesser */
          rundRechteck(g, -0.05, 0.27, 0.1, 0.2, 0.02); g.fillStyle = c([40, 40, 46]); g.fill();
          g.strokeStyle = rot; g.lineWidth = 0.014; g.stroke();
          /* Stoßstange unten */
          g.strokeStyle = rot; g.lineWidth = 0.016;
          g.beginPath(); g.moveTo(-0.78, 0.3); g.quadraticCurveTo(0, 0.24, 0.78, 0.3); g.stroke();
        } else if (phase === "leuchten") {
          const a = F.nacht;
          for (const s of [-1, 1]) {
            rundRechteck(g, s > 0 ? 0.72 : -0.9, 0.555, 0.18, 0.05, 0.015); g.fillStyle = "rgba(255,236,200," + (0.95 * a) + ")"; g.fill();
          }
        }
      } else if (sy < 0 && y < -2.3) {
        if (phase === "farbe") {
          /* Turbinendüse der „Atomturbine" */
          ellipse(g, 0, 0.45, 0.15, 0.13); g.fillStyle = c([150, 152, 160]); g.fill();
          ellipse(g, 0, 0.45, 0.12, 0.105); g.fillStyle = c([10, 10, 12]); g.fill();
          ellipse(g, 0, 0.45, 0.06, 0.05); g.fillStyle = c([60, 20, 10]); g.fill();
          g.strokeStyle = rot; g.lineWidth = 0.016; ellipse(g, 0, 0.45, 0.165, 0.145); g.stroke();
          /* Rückleuchten unten an den Flossen, Heckumrandung */
          for (const s of [-1, 1]) {
            rundRechteck(g, s > 0 ? 0.55 : -0.85, 0.36, 0.3, 0.07, 0.02); g.fillStyle = c([150, 10, 16]); g.fill();
            g.strokeStyle = rot; g.lineWidth = 0.012; g.stroke();
          }
          g.strokeStyle = rot; g.lineWidth = 0.016;
          g.beginPath(); g.moveTo(-0.9, 0.3); g.quadraticCurveTo(0, 0.26, 0.9, 0.3); g.stroke();
        } else if (phase === "leuchten") {
          const a = F.nacht;
          for (const s of [-1, 1]) { rundRechteck(g, s > 0 ? 0.55 : -0.85, 0.36, 0.3, 0.07, 0.02); g.fillStyle = "rgba(255,40,40," + (0.9 * a) + ")"; g.fill(); }
          const gr = g.createRadialGradient(0, 0.45, 0, 0, 0.45, 0.12);
          gr.addColorStop(0, "rgba(255,210,120," + a + ")"); gr.addColorStop(0.6, "rgba(255,110,30," + (0.8 * a) + ")"); gr.addColorStop(1, "rgba(255,60,10,0)");
          g.fillStyle = gr; ellipse(g, 0, 0.45, 0.12, 0.105); g.fill();
        }
      }
    },
    leuchten: true
  };
  /* Armaturenbrett: schwarz mit vielen Schaltern und Rundinstrumenten */
  const KUNST_ARMATUR = {
    schwelle: 0.3,
    front(g, sy, phase, info, F, c) {
      if (sy > 0) return;
      if (phase === "farbe") {
        for (const s of [-1, 1]) {
          for (let k = 0; k < 3; k++) {
            const x = s * (0.28 + k * 0.12);
            ellipse(g, x, 0.62, 0.042, 0.042); g.fillStyle = c([150, 150, 156]); g.fill();
            ellipse(g, x, 0.62, 0.034, 0.034); g.fillStyle = c([230, 226, 214]); g.fill();
            g.strokeStyle = c([200, 20, 20]); g.lineWidth = 0.004; g.beginPath(); g.moveTo(x, 0.62); g.lineTo(x + 0.02, 0.63); g.stroke();
          }
          for (let k = 0; k < 6; k++) { rundRechteck(g, s * (0.25 + k * 0.07) - 0.012, 0.5, 0.024, 0.04, 0.006); g.fillStyle = c(k % 2 ? [200, 30, 30] : [210, 210, 214]); g.fill(); }
        }
        rundRechteck(g, -0.1, 0.44, 0.2, 0.22, 0.02); g.fillStyle = c([60, 10, 12]); g.fill();
      } else if (phase === "leuchten") {
        g.fillStyle = "rgba(255,120,80," + (0.35 * F.nacht) + ")";
        for (const s of [-1, 1]) for (let k = 0; k < 3; k++) { ellipse(g, s * (0.28 + k * 0.12), 0.62, 0.034, 0.034); g.fill(); }
      }
    },
    leuchten: true
  };

  /* Felge: Chrom, rote Fledermaus-Nabe, schmale rote Linie am Reifen */
  function batFelge(g, r, F, aussen, roll) {
    const L = (f) => beleuchtet(f, F);
    g.fillStyle = L([16, 16, 18]); g.beginPath(); g.arc(0, 0, r, 0, Math.PI * 2); g.fill();
    g.strokeStyle = L([200, 40, 30]); g.lineWidth = r * 0.03; g.beginPath(); g.arc(0, 0, r * 0.8, 0, Math.PI * 2); g.stroke();
    const rf = r * 0.68;
    const gr = g.createLinearGradient(-rf, -rf, rf, rf);
    gr.addColorStop(0, L([250, 250, 255])); gr.addColorStop(0.45, L([150, 154, 164])); gr.addColorStop(0.55, L([230, 232, 240])); gr.addColorStop(1, L([120, 124, 134]));
    g.fillStyle = gr; g.beginPath(); g.arc(0, 0, rf, 0, Math.PI * 2); g.fill();
    /* Lochkranz und Speichen-Rippen – FASSUNG 812: sie drehen sich mit dem Rad (Drehblatt),
       Glanz und Fledermaus-Nabe bleiben stehen wie eine Radkappe, die aufrecht bleibt */
    g.save(); if (roll) g.rotate(roll);
    g.strokeStyle = L([90, 94, 104]); g.lineWidth = r * 0.02;
    for (let k = 0; k < 10; k++) { const a = k * Math.PI / 5; g.beginPath(); g.moveTo(Math.cos(a) * rf * 0.45, Math.sin(a) * rf * 0.45); g.lineTo(Math.cos(a) * rf * 0.88, Math.sin(a) * rf * 0.88); g.stroke(); }
    g.restore();
    g.strokeStyle = L([245, 246, 250]); g.lineWidth = r * 0.03; g.beginPath(); g.arc(0, 0, rf * 0.94, 0, Math.PI * 2); g.stroke();
    /* Nabe: rote Scheibe mit schwarzer Fledermaus */
    g.fillStyle = L([200, 24, 24]); g.beginPath(); g.arc(0, 0, rf * 0.38, 0, Math.PI * 2); g.fill();
    fledermaus(g, 0, 0, rf * 0.6, aussen); g.fillStyle = L([10, 10, 12]); g.fill();
  }

  /* Blasenscheibe vor einem Sitz: vordere Hälfte einer halben Ellipsoid-
     Kuppel aus Plexiglas, hinten offen (der Rand ist ein Chrombogen).
     Als EINE Figur gemalt – eine Glasfläche ohne Nähte zwischen Dreiecken –,
     die sich selbst ins Bild rechnet. */
  function blase(W, teil, cx) {
    const A = 0.33, B = 0.42, C = 0.3, Y0 = -0.05, Z0 = 0.775, NT = 12, NP = 5;
    const pkt3 = (t, f) => [cx + A * Math.cos(f) * Math.sin(t), Y0 + B * Math.cos(f) * Math.cos(t), Z0 + C * Math.sin(f)];
    const netz = [];
    for (let i = 0; i <= NT; i++) { netz.push([]); for (let k = 0; k <= NP; k++) netz[i].push(pkt3(-Math.PI / 2 + Math.PI * i / NT, Math.PI / 2 * k / NP)); }
    const fuss = [cx, Y0, Z0];
    W.figur(teil, { x: fuss[0], y: fuss[1], z: fuss[2], breite: 0.8, hoehe: 0.36, schatten: false, malen(g, s, F) {
      const P = figurProjektion(fuss, s, F), N = netz.map((r) => r.map(P));
      const nacht = F.nacht || 0;
      g.save();
      /* Vereinigung aller Glasfelder: jedes mit gleichem Umlaufsinn,
         dann füllt „nonzero" jede Stelle genau einmal */
      g.beginPath();
      let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      for (let i = 0; i < NT; i++) for (let k = 0; k < NP; k++) {
        let q = [N[i][k], N[i + 1][k], N[i + 1][k + 1], N[i][k + 1]];
        let fl = 0;
        for (let m = 0; m < 4; m++) { const a = q[m], b = q[(m + 1) % 4]; fl += a[0] * b[1] - b[0] * a[1]; x0 = Math.min(x0, a[0]); x1 = Math.max(x1, a[0]); y0 = Math.min(y0, a[1]); y1 = Math.max(y1, a[1]); }
        if (fl < 0) q = q.reverse();
        g.moveTo(q[0][0], q[0][1]); for (let m = 1; m < 4; m++) g.lineTo(q[m][0], q[m][1]); g.closePath();
      }
      g.fillStyle = "rgba(" + (nacht > 0.5 ? "40,50,75" : "175,195,220") + ",0.24)"; g.fill();
      /* Spiegelung: heller schräger Streifen und helle Kuppe */
      g.clip();
      const gr = g.createLinearGradient(x0, y0, x1, y1);
      gr.addColorStop(0, "rgba(255,255,255,0.08)"); gr.addColorStop(0.3, "rgba(255,255,255,0.38)"); gr.addColorStop(0.42, "rgba(255,255,255,0.06)"); gr.addColorStop(0.7, "rgba(255,255,255,0.16)"); gr.addColorStop(1, "rgba(255,255,255,0.03)");
      g.globalAlpha = 1 - 0.8 * nacht; g.fillStyle = gr; g.fillRect(x0, y0, x1 - x0, y1 - y0);
      g.restore();
      /* Chromrand: hinterer Bogen und Fuß */
      g.strokeStyle = nacht > 0.5 ? "rgba(120,125,140,0.9)" : "rgba(228,231,238,0.95)"; g.lineWidth = Math.max(0.8, 0.016 * s); g.lineJoin = "round";
      g.beginPath();
      for (let k = 0; k <= NP; k++) { const q = N[0][k]; if (k) g.lineTo(q[0], q[1]); else g.moveTo(q[0], q[1]); }
      for (let k = NP; k >= 0; k--) { const q = N[NT][k]; g.lineTo(q[0], q[1]); }
      g.stroke();
      g.lineWidth = Math.max(0.6, 0.01 * s);
      g.beginPath(); for (let i = 0; i <= NT; i++) { const q = N[i][0]; if (i) g.lineTo(q[0], q[1]); else g.moveTo(q[0], q[1]); } g.stroke();
    } });
  }

  ST.modell("auto_batmobil", {
    name: "Batmobil", gruppe: "Fahrzeuge", grund: [2.1, 5.9], hoehe: 1.12, bauzeit: 60,
    auto: { laenge: 5.9, breite: 2.1, hoehe: 1.12, radstand: 3.2, vorn: "+y" },
    bauen(M, o) {
      const W = new Werkstatt(M);
      W.teil("wanne", { ebene: 0 });
      for (const t of ["hinten", "hinterwagen", "tuer-l", "tuer-r", "armaturen", "vorderwagen", "nase"]) W.teil(t, { ebene: 1 });

      /* ---------- Karosserie ---------- */
      W.loft({
        schnitte: schnitteGlatt(SCHNITTE, 0.17),
        kanteJ: (typ, j) => j === 1 || (typ !== "deck" && (j === 5 || j === 6)),
        zuordnen(q) {
          const deckArtig = (t) => t === "deck" || t === "flosse";
          const innen = q.js >= 6 && (!deckArtig(q.typA) || !deckArtig(q.typB));
          if (innen) {
            const arm = q.typA === "armatur" || q.typB === "armatur";
            if (arm) {
              const gesicht = q.typA === "cockpit" && q.typB === "armatur";
              return { teil: "armaturen", stoff: gesicht ? STOFF.armatur : STOFF.armOben, kunst: gesicht ? KUNST_ARMATUR : null, info: {} };
            }
            if (deckArtig(q.typA) || deckArtig(q.typB)) return { teil: "wanne", stoff: STOFF.schwarz };
            return { teil: "wanne", stoff: q.js >= 9 ? STOFF.teppich : STOFF.innen };
          }
          let teil;
          if (q.yc > 2.3) teil = "nase";
          else if (q.yc > 0.45) teil = "vorderwagen";
          else if (q.yc > -0.95) teil = q.seite > 0 ? "tuer-l" : "tuer-r";
          else if (q.yc > -2.0) teil = "hinterwagen";
          else teil = "hinten";
          return { teil: teil, stoff: q.js === 0 ? STOFF.boden : STOFF.lack, kunst: KUNST, info: { aussen: true } };
        },
        deckel: { vorn: { teil: "nase", stoff: STOFF.lack, kunst: KUNST, info: { aussen: true } }, hinten: { teil: "hinten", stoff: STOFF.lack, kunst: KUNST, info: { aussen: true } } }
      });

      /* ---------- Flossenspitzen: ragen weit über das Heck hinaus ---------- */
      for (const s of [1, -1]) {
        const name = "flosse" + (s > 0 ? "-l" : "-r");
        W.teil(name, { ebene: 1, mitte: [s * 0.9, -2.7, 0.8] });
        const x0 = s * 0.845, d = [s * 0.08, 0, 0];
        const um = [[x0, -2.5, 0.91], [x0, -2.97, 0.955], [x0, -2.93, 0.88], [x0, -2.5, 0.52]];
        W.prisma(name, um, d, (art) => function (g, F) {
          g.fillStyle = beleuchtet(SCHWARZ, F); g.fillRect(-1, -1, F.w + 2, F.h + 2);
          /* Glanz und rote Kante */
          const gr = g.createLinearGradient(0, 0, 0, F.h);
          gr.addColorStop(0, "rgba(200,210,235,0.28)"); gr.addColorStop(0.4, "rgba(200,210,235,0.05)"); gr.addColorStop(1, "rgba(0,0,0,0)");
          g.fillStyle = gr; g.fillRect(-1, -1, F.w + 2, F.h + 2);
          if (art !== "rand") {
            const um2 = F.flaeche.umriss;
            g.strokeStyle = beleuchtet(PIN, F); g.lineWidth = 0.02; g.lineJoin = "round";
            vieleck(g, um2); g.stroke();
          } else if (F.w > 0.2) {
            g.fillStyle = beleuchtet(PIN, F); g.fillRect(-1, -1, F.w + 2, F.h + 2);
          }
        }, { keinLicht: true });
      }

      /* ---------- zwei Blasenscheiben ---------- */
      for (const s of [1, -1]) {
        const name = "blase" + (s > 0 ? "-l" : "-r");
        W.teil(name, { ebene: 1, mitte: [s * 0.45, 0.12, 0.88] });
        blase(W, name, s * 0.45);
      }

      /* ---------- Sitze (schwarz, rote Kedern) ---------- */
      const sitz = (art) => function (g, F) {
        g.fillStyle = "rgb(30,28,30)"; g.fillRect(-1, -1, F.w + 2, F.h + 2);
        if (art === "vorn" && F.w > 0.3) {
          g.strokeStyle = "rgb(170,24,24)"; g.lineWidth = 0.012;
          rundRechteck(g, 0.03, 0.03, F.w - 0.06, F.h - 0.06, 0.05); g.stroke();
          g.strokeStyle = "rgba(0,0,0,0.5)"; g.lineWidth = 0.006;
          for (let k = 1; k < 5; k++) { g.beginPath(); g.moveTo(F.w * k / 5, 0.05); g.lineTo(F.w * k / 5, F.h - 0.05); g.stroke(); }
        }
      };
      for (const s of [1, -1]) {
        const cx = s * 0.45, name = "sitz" + (s > 0 ? "-l" : "-r");
        W.teil(name, { ebene: 1, mitte: [cx, -0.5, 0.5] });
        W.kiste(name, [cx - 0.25, -0.8, 0.24], [0.5, 0, 0], [0, 0.5, 0], [0, 0, 0.15], { oben: sitz("vorn"), rest: sitz("rand"), unten: null });
        const t = einheit([0, -0.3, 1]), d = [0, -0.13, 0];
        const P = (a, b) => [cx + a, -0.76 + t[1] * b, 0.34 + t[2] * b];
        const um = [P(-0.25, 0), P(0.25, 0), P(0.26, 0.4), P(0.2, 0.56), P(-0.2, 0.56), P(-0.26, 0.4)];
        W.prisma(name, um, d, (art) => sitz(art));
      }

      /* ---------- Mittelkonsole mit Bat-Licht und Antennen ---------- */
      W.teil("konsole", { ebene: 1, mitte: [0, -0.2, 0.6] });
      W.kiste("konsole", [-0.12, -0.95, 0.24], [0.24, 0, 0], [0, 0.9, 0], [0, 0, 0.28], {
        oben: function (g, F) {
          g.fillStyle = "rgb(24,22,24)"; g.fillRect(-1, -1, F.w + 2, F.h + 2);
          g.strokeStyle = "rgb(200,30,30)"; g.lineWidth = 0.012; rundRechteck(g, 0.02, 0.05, F.w - 0.04, F.h - 0.1, 0.03); g.stroke();
          for (let k = 0; k < 4; k++) { g.fillStyle = k % 2 ? "rgb(200,30,30)" : "rgb(170,170,176)"; g.fillRect(F.w / 2 - 0.04 + (k % 2) * 0.05, 0.2 + k * 0.14, 0.03, 0.05); }
        },
        rest: "rgb(26,24,26)", unten: null
      });
      /* Mittelrücken zwischen den Blasen – trägt das Bat-Licht */
      W.kiste("konsole", [-0.07, -0.05, 0.24], [0.14, 0, 0], [0, 0.5, 0], [0, 0, 0.55], { rest: rgb(SCHWARZ), oben: rgb([30, 30, 34]), unten: null });
      W.figur("konsole", { x: 0, y: 0.12, z: 0.79, breite: 0.3, hoehe: 0.34, malen(g, s, F) {
        const k = ST.KZ;
        if (F.schatten) { g.fillStyle = "#000"; g.fillRect(-0.05 * s, -0.12 * s * k, 0.1 * s, 0.12 * s * k); return; }
        /* Bat-Licht: roter Glaskegel auf Chromfuß */
        g.fillStyle = "#9a9ca4"; g.fillRect(-0.05 * s, -0.035 * s * k, 0.1 * s, 0.035 * s * k);
        g.fillStyle = "#b8141a"; g.beginPath(); g.moveTo(-0.045 * s, -0.035 * s * k); g.lineTo(-0.03 * s, -0.12 * s * k); g.lineTo(0.03 * s, -0.12 * s * k); g.lineTo(0.045 * s, -0.035 * s * k); g.closePath(); g.fill();
        g.fillStyle = "rgba(255,200,200,0.6)"; g.fillRect(-0.02 * s, -0.11 * s * k, 0.012 * s, 0.06 * s * k);
        g.fillStyle = "#9a9ca4"; g.fillRect(-0.035 * s, -0.135 * s * k, 0.07 * s, 0.015 * s * k);
        if (F.nacht > 0.05) F.leuchtPunkt(0, -0.08 * s * k, 0.9 * s, "255,40,30", 0.9 * F.nacht, true);
      } });
      W.figur("konsole", { x: 0, y: -0.85, z: 0.52, breite: 0.4, hoehe: 0.7, malen(g, s, F) {
        /* zwei Antennenstäbe hinter den Sitzen */
        const k = ST.KZ;
        g.strokeStyle = F.schatten ? "#000" : "#b0b4bc"; g.lineWidth = Math.max(0.8, 0.012 * s); g.lineCap = "round";
        for (const x of [-0.08, 0.08]) { g.beginPath(); g.moveTo(x * s, 0); g.lineTo(x * 1.6 * s, -0.7 * s * k); g.stroke(); }
        if (!F.schatten) { g.fillStyle = "#b8141a"; for (const x of [-0.08, 0.08]) { g.beginPath(); g.arc(x * 1.6 * s, -0.7 * s * k, 0.02 * s, 0, Math.PI * 2); g.fill(); } }
      } });

      /* ---------- Lenkrad links (+x) ---------- */
      W.teil("lenkrad", { ebene: 1, mitte: [0.45, -0.05, 0.66] });
      {
        const c0 = [0.45, -0.08, 0.66], nL = einheit([0, -0.8, 0.6]);
        const e1 = [1, 0, 0], e2 = kreuz(nL, e1), pts = [];
        for (let k = 0; k < 20; k++) { const a = k / 20 * Math.PI * 2; pts.push(plus(c0, plus(mal(e1, Math.cos(a) * 0.19), mal(e2, Math.sin(a) * 0.19)))); }
        W.platte("lenkrad", pts, function (g, F) {
          const um = F.flaeche.umriss;
          let mx = 0, my = 0; for (const q of um) { mx += q[0]; my += q[1]; } mx /= um.length; my /= um.length;
          const f = beleuchtet([20, 20, 22], F);
          g.strokeStyle = f; g.lineWidth = 0.03; g.beginPath(); g.arc(mx, my, 0.17, 0, Math.PI * 2); g.stroke();
          g.strokeStyle = beleuchtet([190, 192, 200], F); g.lineWidth = 0.012;
          for (let k = 0; k < 3; k++) { const a = Math.PI / 2 + k * Math.PI * 2 / 3; g.beginPath(); g.moveTo(mx, my); g.lineTo(mx + Math.cos(a) * 0.16, my + Math.sin(a) * 0.16); g.stroke(); }
          g.fillStyle = beleuchtet([200, 24, 24], F); g.beginPath(); g.arc(mx, my, 0.035, 0, Math.PI * 2); g.fill();
        }, { keinLicht: true, beidseitig: true, name: "lenkrad" });
      }

      /* ---------- Räder ---------- */
      /* FASSUNG 812: fürs Drehblatt einzeln, gelenkt und gedreht */
      const RW = radWahl(o);
      for (const [cy, nm] of [[VA, "v"], [HA, "h"]]) {
        for (const s of [1, -1]) { const k = nm + (s > 0 ? "l" : "r"); W.rad("rad-" + k, s * SP, cy, RR, RB, s, batFelge, Object.assign({ ebene: 1 }, radOpt(RW, k))); }
      }

      W.fertig();

      /* ---------- Licht bei Nacht ---------- */
      for (const s of [-1, 1]) {
        M.licht(s * 0.81, 2.86, 0.58, 0.9, "255,236,200", 1.0);
        M.licht(s * 0.7, -2.56, 0.4, 0.5, "255,40,30", 0.8);
      }
      M.licht(0, -2.58, 0.45, 0.6, "255,140,50", 0.8);
      M.bodenlicht(0, 5.0, 2.8, "255,236,200", 0.9);
      M.bodenlicht(0, -3.3, 1.0, "255,40,20", 0.5);
    }
  });
})();
