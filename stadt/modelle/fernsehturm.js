/* =====================================================================
   BERLINER FERNSEHTURM (Alexanderplatz, 1965–1969) — Maßstab 1:8
   ---------------------------------------------------------------------
   XANDER: „richtig filigran. Richtig schön ausarbeiten mit schönen
   Texturen" · „keine Comic Grafik … viel mehr am Realismus" · „ohne
   Pixelkanten und komische Vektorrückstände" · „Man soll das Fundament
   sehen beim Aufbauen"

   MASSE (Original → Modell 1:8)
     Gesamthöhe 368 m → 46 m · Kugel Ø 32 m → 4 m, Mitte in 213 m → 26,6 m
     Betonschaft: unten Ø 32 m (Fuß ausgerundet), verjüngt sich bis unter
     die Kugel auf Ø 9 m · Antennenträger ab 250 m (31,2 m), rot-weiß
     gebändert bis zur Spitze.
     Pavillon am Fuß: zwei Geschosse, verglast, mit dem gefalteten Dach
     aus spitz nach außen steigenden Betonfalten (Zackendach), rund um den
     Schaft; davor der Platz mit Granitpflaster.

   WIE ES GEMALT WIRD
   Schaft, Kugel und Antenne sind drehrund – sie werden als eine Figur
   gemalt (weich schattiert, wie ein echter Zylinder und eine echte
   Kugel): die Kugel aus rautenförmigen Edelstahlfeldern, jedes Feld eine
   flache Pyramide aus vier Dreiecken – daher das Glitzern und das
   berühmte Lichtkreuz. Das Fensterband (Aussichtsgeschoss und
   Telecafé) liegt unter dem Äquator. Der Pavillon besteht aus konvexen
   Körpern (zwölf Sektoren, jede Falte ein Körper), in jeder Ansicht nach
   trennenden Ebenen geordnet.
   Nacht: Kugel angestrahlt, Fensterband leuchtet, Schaft von unten
   angestrahlt; rote Flugbefeuerung an Antenne und Kugel blinkt (M.lebendig,
   nur wenige Punkte). Winter: Reif am Sockel, Schnee auf den Falten und
   dem Platz, ein Hauch Raureif auf der Kugelkappe.

   BAUPHASEN (o.bau)
     0,00–0,06  Baugrube, rund
     0,06–0,12  Fundament (Ringplatte)
     0,12–0,55  Schaft wächst in der Gleitschalung (Arbeitsbühne oben)
     0,55–0,70  Stahlskelett der Kugel, Ring für Ring
     0,68–0,80  Kugel wird verkleidet
     0,78–0,90  Antenne wird aufgesetzt
     0,60–0,95  Pavillon: Wände, dann die Falten des Dachs
     0,95–1,00  Glas, Licht, Befeuerung
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT, PI = ST.pinsel;
  const RAD = Math.PI / 180;

  /* ---------------- Vektoren ---------------- */
  const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const kreuz = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const lang = (a) => Math.hypot(a[0], a[1], a[2]);
  const nrm = (a) => { const l = lang(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const klemm = (x, a, b) => (x < a ? a : x > b ? b : x);
  const mischF = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
  const rgbS = (c, a) => (a == null ? "rgb(" + (c[0] | 0) + "," + (c[1] | 0) + "," + (c[2] | 0) + ")" : "rgba(" + (c[0] | 0) + "," + (c[1] | 0) + "," + (c[2] | 0) + "," + a + ")");
  const hellF = (c, k) => (k >= 0 ? mischF(c, [255, 255, 255], k) : mischF(c, [0, 0, 0], -k));
  function hash(a, b, c) { return ST.hash2(a | 0, b | 0, (c | 0) + 11); }
  function mitteVon(p) { let x = 0, y = 0, z = 0; for (const q of p) { x += q[0]; y += q[1]; z += q[2]; } return [x / p.length, y / p.length, z / p.length]; }

  /* =====================================================================
     DAS KLEINE 3D-WERK (nach dem Vorbild der Dorfkirche)
     ===================================================================== */
  function blickVon(o) {
    const ob = o && o.objekt;
    const gier = ob ? (ob.gier || 0) + ((ST.kamera && ST.kamera.dreh) || 0) * 90 : 30;
    const r = gier * RAD, c = Math.cos(r), s = Math.sin(r), a = ST.KZ * Math.SQRT1_2, L = ST.LICHT;
    return {
      gier: gier, c: c, s: s,
      e: [a * (c + s), a * (c - s), 0.5],
      L: [L[0] * c + L[1] * s, L[1] * c - L[0] * s, L[2]],
      bild(p) { const x = p[0] * c - p[1] * s, y = p[0] * s + p[1] * c; return [(x - y) * ST.KX, (x + y) * ST.KY - p[2] * ST.KZ]; }
    };
  }
  /* Konvexe Hülle einer kleinen Punktwolke (Flächen gegen den Uhrzeigersinn von außen) */
  function huelle3(roh) {
    const P = [];
    for (const p of roh) { let neu = true; for (const q of P) if (Math.abs(q[0] - p[0]) < 1e-5 && Math.abs(q[1] - p[1]) < 1e-5 && Math.abs(q[2] - p[2]) < 1e-5) { neu = false; break; } if (neu) P.push(p); }
    const n = P.length, eps = 1e-5, eb = [];
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) for (let k = j + 1; k < n; k++) {
      let nn = kreuz(sub(P[j], P[i]), sub(P[k], P[i]));
      const l = lang(nn); if (l < 1e-8) continue;
      nn = [nn[0] / l, nn[1] / l, nn[2] / l];
      let d = dot(nn, P[i]), pos = 0, neg = 0;
      for (let m = 0; m < n; m++) { const s = dot(nn, P[m]) - d; if (s > eps) pos++; else if (s < -eps) neg++; if (pos && neg) break; }
      if ((pos && neg) || (!pos && !neg)) continue;
      if (pos) { nn = [-nn[0], -nn[1], -nn[2]]; d = -d; }
      let da = false;
      for (const e of eb) if (dot(e.n, nn) > 1 - 1e-6 && Math.abs(e.d - d) < 1e-4) { da = true; break; }
      if (!da) eb.push({ n: nn, d: d });
    }
    const fl = [];
    for (const e of eb) {
      const auf = P.filter((p) => Math.abs(dot(e.n, p) - e.d) <= 2e-4);
      if (auf.length < 3) continue;
      const c = mitteVon(auf);
      let u = sub(auf[0], c); if (lang(u) < 1e-9) u = sub(auf[1], c);
      u = nrm(u); const w = kreuz(e.n, u);
      const wi = (p) => Math.atan2(dot(sub(p, c), w), dot(sub(p, c), u));
      auf.sort((a, b) => wi(a) - wi(b));
      fl.push({ n: e.n, d: e.d, pts: auf });
    }
    return { punkte: P, flaechen: fl };
  }
  function kanten(H) { const k = []; for (const f of H.flaechen) for (let i = 0; i < f.pts.length; i++) k.push([f.pts[i], f.pts[(i + 1) % f.pts.length]]); return k; }
  /* an einer Ebene abschneiden: behalten wird n·p ≤ d */
  function schneide(pts, n, d) {
    const H = huelle3(pts), aus = [];
    for (const p of H.punkte) if (dot(n, p) <= d + 1e-6) aus.push(p);
    for (const [a, b] of kanten(H)) {
      const sa = dot(n, a) - d, sb = dot(n, b) - d;
      if ((sa < -1e-6 && sb > 1e-6) || (sa > 1e-6 && sb < -1e-6)) { const t = sa / (sa - sb); aus.push(add(a, mul(sub(b, a), t))); }
    }
    return aus;
  }
  function huelle2(p) {
    p = p.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    if (p.length < 3) return p;
    const kr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lo = [], hi = [];
    for (const q of p) { while (lo.length >= 2 && kr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
    for (let i = p.length - 1; i >= 0; i--) { const q = p[i]; while (hi.length >= 2 && kr(hi[hi.length - 2], hi[hi.length - 1], q) <= 0) hi.pop(); hi.push(q); }
    hi.pop(); lo.pop();
    return lo.concat(hi);
  }
  function ueberdecken(P, Q) {
    if (P.length < 3 || Q.length < 3) return true;
    for (const R of [P, Q]) for (let i = 0; i < R.length; i++) {
      const a = R[i], b = R[(i + 1) % R.length], nx = b[1] - a[1], ny = a[0] - b[0], l = Math.hypot(nx, ny) || 1;
      let p0 = Infinity, p1 = -Infinity, q0 = Infinity, q1 = -Infinity;
      for (const v of P) { const d = (v[0] * nx + v[1] * ny) / l; if (d < p0) p0 = d; if (d > p1) p1 = d; }
      for (const v of Q) { const d = (v[0] * nx + v[1] * ny) / l; if (d < q0) q0 = d; if (d > q1) q1 = d; }
      if (p1 <= q0 + 0.003 || q1 <= p0 + 0.003) return false;
    }
    return true;
  }

  function Werk(o, B) { this.o = o; this.B = B; this.k = []; this.verbuende = {}; this.werfer = []; }
  Werk.prototype.verbund = function (name, pts) { this.verbuende[name] = huelle3(pts); };
  /* Körper: Punkte + Maler. mal(fl, K) → { malen, leuchten, danach, ao, rund, flut } oder null */
  Werk.prototype.koerper = function (name, pts, mal, opt) {
    opt = opt || {};
    if (opt.schnitte) for (const [n, d] of opt.schnitte) { pts = schneide(pts, n, d); if (pts.length < 4) return null; }
    if (opt.bisZ != null) {
      let zmin = Infinity, zmax = -Infinity; for (const p of pts) { zmin = Math.min(zmin, p[2]); zmax = Math.max(zmax, p[2]); }
      if (opt.bisZ <= zmin + 0.02) return null;
      if (opt.bisZ < zmax - 1e-4) { pts = schneide(pts, [0, 0, 1], opt.bisZ); opt.gekappt = opt.bisZ; }
    }
    const H = huelle3(pts);
    if (H.flaechen.length < 4) return null;
    const K = Object.assign({ name: name, H: H, mal: mal, schatten: true, wirft: false, nach: null }, opt);
    K.mitte = mitteVon(H.punkte);
    this.k.push(K);
    return K;
  };
  /* Figur (aufrecht gemalt) als kleiner Körper für die Reihenfolge */
  Werk.prototype.figur = function (name, fi, halb, opt) {
    const h = halb || [0.2, 0.2], pts = [];
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const z of [fi.z || 0, (fi.z || 0) + (fi.hoehe || 1)]) pts.push([fi.x + sx * h[0], fi.y + sy * h[1], z]);
    const K = this.koerper(name, pts, () => null, Object.assign({ schatten: false }, opt || {}));
    if (K) K.figur = fi;
    return K;
  };

  function ordnen(W) {
    const B = W.B, e = B.e, liste = [], vb = {};
    for (const K of W.k) {
      if (K.verbund && W.verbuende[K.verbund]) {
        let N = vb[K.verbund];
        if (!N) { const H = W.verbuende[K.verbund]; N = vb[K.verbund] = { name: K.verbund, H: H, mitte: mitteVon(H.punkte), glieder: [] }; liste.push(N); }
        K.tief = dot(K.mitte, e);
        N.glieder.push(K);
      } else liste.push(K);
    }
    for (const K of liste) {
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      const pk = [];
      for (const p of K.H.punkte) { const q = B.bild(p); pk.push(q); if (q[0] < x0) x0 = q[0]; if (q[0] > x1) x1 = q[0]; if (q[1] < y0) y0 = q[1]; if (q[1] > y1) y1 = q[1]; }
      K.bb = [x0, y0, x1, y1]; K.umriss2 = huelle2(pk); K.tief = dot(K.mitte, e); K.vor = []; K.grad = 0;
    }
    const eps = 2e-4;
    const vergleich = (A, C) => {
      for (const f of A.H.flaechen) {
        let alle = true;
        for (const p of C.H.punkte) if (dot(f.n, p) - f.d < -eps) { alle = false; break; }
        if (!alle) continue;
        const s = dot(f.n, e); if (s > 1e-5) return 1; if (s < -1e-5) return -1;
      }
      for (const f of C.H.flaechen) {
        let alle = true;
        for (const p of A.H.punkte) if (dot(f.n, p) - f.d < -eps) { alle = false; break; }
        if (!alle) continue;
        const s = dot(f.n, e); if (s > 1e-5) return -1; if (s < -1e-5) return 1;
      }
      return 0;
    };
    const n = liste.length, rand = 0.02;
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      const A = liste[i], C = liste[j];
      if (A.bb[2] < C.bb[0] - rand || C.bb[2] < A.bb[0] - rand || A.bb[3] < C.bb[1] - rand || C.bb[3] < A.bb[1] - rand) continue;
      if (!ueberdecken(A.umriss2, C.umriss2)) continue;
      let r;
      if (A.nach && A.nach.indexOf(C) >= 0) r = -1;
      else if (C.nach && C.nach.indexOf(A) >= 0) r = 1;
      else r = vergleich(A, C);
      if (r === 0) r = A.tief <= C.tief ? 1 : -1;
      if (r > 0) { A.vor.push(C); C.grad++; } else { C.vor.push(A); A.grad++; }
    }
    const bereit = liste.filter((K) => K.grad === 0).sort((a, b) => b.tief - a.tief), aus = [];
    while (bereit.length) {
      const K = bereit.pop(); aus.push(K);
      for (const V of K.vor) { V.grad--; if (V.grad === 0) { let i = bereit.length; while (i > 0 && bereit[i - 1].tief < V.tief) i--; bereit.splice(i, 0, V); } }
    }
    if (aus.length < n) aus.push(...liste.filter((K) => aus.indexOf(K) < 0).sort((a, b) => a.tief - b.tief));
    const voll = [];
    for (const K of aus) { if (K.glieder) voll.push(...K.glieder.sort((a, b) => a.tief - b.tief)); else voll.push(K); }
    return voll;
  }

  /* Rahmen einer Fläche wie im Kern: v = Gefälle nach unten, u = v × n */
  function rahmenVon(n) {
    let v = [n[0] * n[2], n[1] * n[2], -1 + n[2] * n[2]];
    if (lang(v) < 1e-3) v = [0, 1, 0]; else v = nrm(v);
    return [nrm(kreuz(v, n)), v];
  }
  /* Eigenschatten: welche werfenden Körper liegen vor der Fläche und
     werfen entlang des Lichts einen Schatten auf sie? (absolute a, b) */
  function schattenAufFlaeche(W, fl, K, rahmen) {
    const L = W.B.L, n = fl.n, ln = dot(L, n);
    if (ln < 0.03) return [];
    const polys = [], [u, v] = rahmen;
    let a0 = Infinity, b0 = Infinity, a1 = -Infinity, b1 = -Infinity;
    for (const p of fl.pts) { const a = dot(p, u), b = dot(p, v); a0 = Math.min(a0, a); a1 = Math.max(a1, a); b0 = Math.min(b0, b); b1 = Math.max(b1, b); }
    for (const C of (W._alle || (W._alle = W.k.concat(W.werfer.map((H) => ({ H: H, wirft: true })))))) {
      if (C === K || !C.wirft || C.figur) continue;
      let kg = C._kugel;
      if (!kg) { const m = mitteVon(C.H.punkte); let r = 0; for (const p of C.H.punkte) r = Math.max(r, lang(sub(p, m))); kg = C._kugel = { m: m, r: r }; }
      const dm = dot(n, kg.m) - fl.d;
      if (dm + kg.r <= 0.01) continue;
      { const q = sub(kg.m, mul(L, dm / ln)), qa = dot(q, u), qb = dot(q, v), rr = kg.r / ln + 0.05;
        if (qa + rr < a0 || qa - rr > a1 || qb + rr < b0 || qb - rr > b1) continue; }
      let vorn = false;
      for (const p of C.H.punkte) if (dot(n, p) - fl.d > 0.01) { vorn = true; break; }
      if (!vorn) continue;
      const pk = [];
      const nimm = (p) => { const t = (dot(n, p) - fl.d) / ln; const q = sub(p, mul(L, t)); pk.push([dot(q, u), dot(q, v)]); };
      for (const p of C.H.punkte) if (dot(n, p) - fl.d >= -1e-6) nimm(p);
      for (const [a, b] of kanten(C.H)) {
        const sa = dot(n, a) - fl.d, sb = dot(n, b) - fl.d;
        if ((sa < 0) !== (sb < 0) && Math.abs(sa - sb) > 1e-9) { const t = sa / (sa - sb); nimm(add(a, mul(sub(b, a), t))); }
      }
      if (pk.length < 3) continue;
      const h = huelle2(pk);
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      for (const q of h) { x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]); }
      if (x1 < a0 || x0 > a1 || y1 < b0 || y0 > b1) continue;
      polys.push(h);
    }
    return polys;
  }
  function eigenschattenMalen(g, F, I) {
    const Z = F.zeit, ex = F.flaeche.lichtExtra || 0;
    const lf = ST.lichtFaktor(F.n, Z, ex, F.jahr), ls = ST.lichtFaktor(F.n, { amb: Z.amb, sonne: [0, 0, 0] }, ex, F.jahr);
    const k = [0, 1, 2].map((i) => Math.round(255 * klemm(ls[i] / Math.max(0.01, lf[i]), 0, 1)));
    g.save();
    g.translate(-I.A0, 0);
    g.globalCompositeOperation = "multiply";
    g.fillStyle = "rgb(" + k.join(",") + ")";
    g.beginPath();
    for (const h of I.schatten) { g.moveTo(h[0][0], h[0][1]); for (let i = 1; i < h.length; i++) g.lineTo(h[i][0], h[i][1]); g.closePath(); }
    g.fill("nonzero");
    g.restore();
  }
  /* Runde Körper: Licht quer über die Facette verlaufend (weich, ohne Kanten) */
  function rundLicht(g, F, I, h) {
    const Z = F.zeit, ex = F.flaeche.lichtExtra || 0, n = F.n;
    const rz = (a) => [n[0] * Math.cos(a) - n[1] * Math.sin(a), n[0] * Math.sin(a) + n[1] * Math.cos(a), n[2]];
    const s = (lf) => "rgb(" + Math.round(lf[0] * 255) + "," + Math.round(lf[1] * 255) + "," + Math.round(lf[2] * 255) + ")";
    const gr = g.createLinearGradient(0, 0, F.w, 0);
    gr.addColorStop(0, s(ST.lichtFaktor(rz(h), Z, ex, F.jahr)));
    gr.addColorStop(0.5, s(ST.lichtFaktor(n, Z, ex, F.jahr)));
    gr.addColorStop(1, s(ST.lichtFaktor(rz(-h), Z, ex, F.jahr)));
    g.save();
    g.globalCompositeOperation = "multiply";
    g.fillStyle = gr; g.fillRect(-1, I.B0 - 1, F.w + 2, F.h + 2);
    g.restore();
  }
  /* Anstrahlung bei Nacht: die Fläche bekommt mehr Licht (lichtExtra wird
     gesetzt, bevor der Kern das Licht darüberlegt), danach warm getönt –
     unten wärmer und heller, nach oben kühler (Strahler stehen am Fuß). */
  function flutTon(g, F, I, k) {
    const a = F.nacht * k;
    if (a < 0.02 || F.w * F.h * F.px * F.px < 400) return;
    const z0 = I.zmin, z1 = Math.max(I.zmax, z0 + 1);
    g.save();
    g.globalCompositeOperation = "multiply";
    const gr = g.createLinearGradient(0, -z0, 0, -z1);
    gr.addColorStop(0, rgbS(mischF([255, 255, 255], [255, 214, 160], a)));
    gr.addColorStop(1, rgbS(mischF([255, 255, 255], [196, 184, 176], a)));
    g.fillStyle = gr; g.fillRect(-1, I.B0 - 1, F.w + 2, F.h + 2);
    g.restore();
  }

  function flaecheAusgeben(M, W, fl, K, m, idx) {
    const [u, v] = rahmenVon(fl.n);
    let mu = Infinity, mv = Infinity, Mu = -Infinity, Mv = -Infinity, zmin = Infinity, zmax = -Infinity;
    const q = fl.pts.map((p) => { const a = dot(p, u), b = dot(p, v); mu = Math.min(mu, a); Mu = Math.max(Mu, a); mv = Math.min(mv, b); Mv = Math.max(Mv, b); zmin = Math.min(zmin, p[2]); zmax = Math.max(zmax, p[2]); return [a, b]; });
    const o = add(add(mul(u, mu), mul(v, mv)), mul(fl.n, fl.d));
    const basis = { name: K.name + "|" + idx, o: o, u: u, v: v, w: Mu - mu, h: Mv - mv, umriss: q.map((a) => [a[0] - mu, a[1] - mv]) };
    if (!m) { M.flaeche(Object.assign(basis, { malen: null, keinLicht: true, keinAo: true })); return; }
    const schatten = m.keinSchatten ? [] : schattenAufFlaeche(W, fl, K, [u, v]);
    const I = { fl: fl, K: K, W: W, A0: mu, B0: mv, u: u, v: v, n: fl.n, zmin: zmin, zmax: zmax, schatten: schatten };
    I.lp = (F, x, z, r, farbe, k) => F.leuchtPunkt(x, -z - mv, r, farbe, k);
    M.flaeche(Object.assign(basis, {
      ao: !!m.ao, keinAo: !m.ao, keinLicht: !!(m.rund || m.keinLicht),
      malen: function (g, F) {
        if (m.flut && F.nacht > 0.02) F.flaeche.lichtExtra = m.flut * F.nacht * 0.62;
        g.save(); g.translate(0, -mv);
        if (m.malen) m.malen(g, F, I);
        if (m.rund) rundLicht(g, F, I, m.rund);
        if (schatten.length) eigenschattenMalen(g, F, I);
        g.restore();
      },
      danach: (m.danach || m.flut) ? function (g, F) {
        g.save(); g.translate(0, -mv);
        if (m.flut) flutTon(g, F, I, m.flut);
        if (m.danach) m.danach(g, F, I);
        g.restore();
      } : null,
      leuchten: m.leuchten ? function (g, F) { g.save(); g.translate(0, -mv); m.leuchten(g, F, I); g.restore(); } : null
    }));
  }
  function ausgeben(W, M) {
    const reihe = ordnen(W);
    reihe.forEach((K, rang) => {
      M.teil(K.name, { ebene: rang + 1, schatten: K.schatten, mitte: K.mitte });
      if (K.figur) { M.figur(K.figur); return; }
      K.H.flaechen.forEach((fl, i) => flaecheAusgeben(M, W, fl, K, dot(fl.n, W.B.e) > 0.002 ? K.mal(fl, K) : null, i));
    });
  }

  /* ---------------- Formen ---------------- */
  function quaderP(x0, y0, z0, x1, y1, z1) { const p = []; for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) p.push([x, y, z]); return p; }
  function ring(cx, cy, r, z, n, dreh) { const p = []; for (let i = 0; i < n; i++) { const a = (dreh || 0) + (i + 0.5) * 2 * Math.PI / n; p.push([cx + r * Math.cos(a), cy + r * Math.sin(a), z]); } return p; }
  /* Satteldach als Prisma (First entlang x oder y) */
  function dachP(x0, y0, x1, y1, zt, zf, alongY, ue) {
    ue = ue || 0;
    if (alongY) { const xm = (x0 + x1) / 2; return [[x0 - ue, y0, zt], [x1 + ue, y0, zt], [x0 - ue, y1, zt], [x1 + ue, y1, zt], [xm, y0, zf], [xm, y1, zf]]; }
    const ym = (y0 + y1) / 2; return [[x0, y0 - ue, zt], [x1, y0 - ue, zt], [x0, y1 + ue, zt], [x1, y1 + ue, zt], [x0, ym, zf], [x1, ym, zf]];
  }
  /* Richtung einer Fläche: s, n, o, w, oben, unten, dach */
  function seite(n) {
    if (n[2] > 0.95) return "oben"; if (n[2] < -0.95) return "unten";
    if (Math.abs(n[2]) > 0.05) return "dach";
    if (n[1] > 0.9) return "s"; if (n[1] < -0.9) return "n"; if (n[0] > 0.9) return "o"; if (n[0] < -0.9) return "w";
    return "rund";
  }

  /* =====================================================================
     WERKSTOFFE UND MASSE
     ===================================================================== */
  function rausch(g, x, y, w, h, meter, staerke, saat, hellen) {
    const bild = PI.rauschBild(hellen ? 53 : 3 + (saat % 3), 128, 4, 4, 1.6);
    const m = g.createPattern(bild, "repeat"), k = meter / 128;
    m.setTransform(new DOMMatrix([k, 0, 0, k, (saat * 0.37) % meter, (saat * 0.61) % meter]));
    g.save(); g.globalCompositeOperation = hellen ? "screen" : "multiply"; g.globalAlpha = staerke; g.fillStyle = m; g.fillRect(x, y, w, h); g.restore();
  }
  const SCHNEE = [246, 248, 252], BETON = [206, 204, 198], STAHL = [192, 198, 206];
  const ROT = [200, 44, 38], WEISS = [238, 238, 234];
  const R_IN = 2.35, R_AUS = 7.3, Z_PL = 0.03, Z_PAV = 1.55, Z_SPITZE = 2.85;
  const KU = { z: 26.6, r: 2.0 };
  const Z_KU = KU.z - KU.r, Z_KO = KU.z + KU.r, Z_ANT = 31.2, Z_TOP = 46;
  const Z_FUSS = 0.25;                    // Oberkante der Fundamentplatte = Fuß des Schafts
  /* Schaftradius: unten ausgerundeter Fuß (Ø 32 m → 4 m), dann gerade
     Verjüngung bis unter die Kugel (Ø 9 m → 1,125 m) */
  function schaftR(z) {
    if (z < 2.2) { const t = klemm((z - Z_FUSS) / (2.2 - Z_FUSS), 0, 1); return 1.5 + 0.5 * Math.pow(1 - t, 2.2); }
    return 1.5 + (0.58 - 1.5) * klemm((z - 2.2) / (Z_KU + 0.4 - 2.2), 0, 1);
  }
  function antR(z) {
    if (z < Z_KO) return 0.58;
    if (z < Z_ANT) return 0.5;
    if (z < 36.5) return 0.3 - (z - Z_ANT) * 0.02;
    return Math.max(0.05, 0.16 - (z - 36.5) * 0.011);
  }

  function zustand(bau) {
    const f = (a, b) => klemm((bau - a) / (b - a), 0, 1);
    const Z = { bau: bau, fertig: bau >= 0.999 };
    Z.grube = f(0, 0.06); Z.fund = f(0.06, 0.12); Z.schaft = f(0.12, 0.55);
    Z.skelett = f(0.55, 0.7); Z.haut = f(0.68, 0.8); Z.antenne = f(0.78, 0.9);
    Z.pavWand = f(0.6, 0.8); Z.pavDach = f(0.8, 0.95);
    Z.glas = bau >= 0.95;
    Z.schnee = Z.fertig ? 1 : f(0.9, 0.98);
    return Z;
  }

  /* =====================================================================
     DER TURM (Figur: Schaft, Kugel, Antenne)
     ===================================================================== */
  const EH = [Math.SQRT1_2, Math.SQRT1_2], TQ = [Math.SQRT1_2, -Math.SQRT1_2];
  const AUGE = ST.ZUM_AUGE;
  const nQuer = (a) => [Math.cos(a) * EH[0] + Math.sin(a) * TQ[0], Math.cos(a) * EH[1] + Math.sin(a) * TQ[1], 0];
  function farbeL(c, lf, extra) { const e = extra || [0, 0, 0]; return [Math.min(255, c[0] * lf[0] + e[0]), Math.min(255, c[1] * lf[1] + e[1]), Math.min(255, c[2] * lf[2] + e[2])]; }

  function turmMalen(g, s, F, Z, W) {
    const sch = F.schatten, K = ST.KZ * s, Zt = F.Z, nacht = sch ? 0 : F.nacht, jahr = F.jahr;
    const Y = (z) => -(z - Z_FUSS) * K;
    const lfN = (n) => ST.lichtFaktor(n, Zt, 0, jahr);
    /* Zylinder-Verlauf quer (Bild-x von −r·s bis +r·s): Licht je Richtung,
       nachts Streulicht der Strahler */
    const zylGrad = (r, farbe, flut) => {
      const gr = g.createLinearGradient(-r * s, 0, r * s, 0);
      for (let i = 0; i <= 10; i++) {
        const u = -1 + i / 5, a = Math.asin(klemm(u, -1, 1)), n = nQuer(a);
        const ex = flut ? [flut[0] * Math.cos(a), flut[1] * Math.cos(a), flut[2] * Math.cos(a)] : null;
        gr.addColorStop(i / 10, rgbS(farbeL(farbe, lfN(n), ex)));
      }
      return gr;
    };
    const flutS = nacht > 0.02 ? [70 * nacht, 64 * nacht, 58 * nacht] : null;
    /* ---------- Schaft ---------- */
    const zS = Z.schaft >= 1 ? Z_KU + 0.3 : Z_FUSS + (Z_KU + 0.3 - Z_FUSS) * Z.schaft;
    const schaftPfad = (z0, z1, rf) => {
      g.beginPath();
      const n = 28;
      for (let i = 0; i <= n; i++) { const z = z0 + (z1 - z0) * i / n; g.lineTo(-rf(z) * s, Y(z)); }
      const r1 = rf(z1);
      g.ellipse(0, Y(z1), r1 * s, r1 * 0.5 * s, 0, Math.PI, 0, true);
      for (let i = n; i >= 0; i--) { const z = z0 + (z1 - z0) * i / n; g.lineTo(rf(z) * s, Y(z)); }
      const r0 = rf(z0);
      g.ellipse(0, Y(z0), r0 * s, r0 * 0.5 * s, 0, 0, Math.PI, false);
      g.closePath();
    };
    if (Z.schaft > 0) {
      schaftPfad(Z_FUSS, zS, schaftR);
      if (sch) { g.fillStyle = "#000"; g.fill(); }
      else {
        g.fillStyle = zylGrad(1.2, BETON, flutS); g.fill();
        g.save(); g.clip();
        /* Beton: Gleitschalungs-Ringe, Flecken, Regenspuren */
        rausch(g, -2.2 * s, Y(zS) - s, 4.4 * s, (zS - Z_FUSS + 2) * K, 6 * s, 0.12, 4);
        if (s * 0.5 > 4) {
          g.strokeStyle = "rgba(90,88,84,0.10)"; g.lineWidth = 1;
          for (let z = Z_FUSS + 0.5; z < zS; z += 0.5) { const r = schaftR(z); g.beginPath(); g.ellipse(0, Y(z), r * s, r * 0.5 * s, 0, 0, Math.PI); g.stroke(); }
        }
        /* Schatten der Kugel auf dem Schaft */
        if (Z.haut > 0.3) {
          const lf = lfN([0, 0, 0.2]), ls = ST.lichtFaktor([0, 0, 0.2], { amb: Zt.amb, sonne: [0, 0, 0] }, 0, jahr);
          const k = klemm(ls[1] / Math.max(0.01, lf[1]), 0, 1);
          const gr = g.createLinearGradient(0, Y(Z_KU), 0, Y(Z_KU - 3.2));
          gr.addColorStop(0, "rgba(20,26,44," + ((1 - k) * 0.9).toFixed(3) + ")"); gr.addColorStop(0.6, "rgba(20,26,44," + ((1 - k) * 0.5).toFixed(3) + ")"); gr.addColorStop(1, "rgba(20,26,44,0)");
          g.fillStyle = gr; g.fillRect(-2 * s, Y(Z_KU), 4 * s, 3.3 * K);
        }
        /* Reif am Fuß */
        if (jahr === "winter") {
          const gr = g.createLinearGradient(0, Y(Z_FUSS), 0, Y(Z_FUSS + 2.2));
          gr.addColorStop(0, "rgba(236,242,250,0.75)"); gr.addColorStop(1, "rgba(236,242,250,0)");
          g.fillStyle = gr; g.fillRect(-2.2 * s, Y(Z_FUSS + 2.2), 4.4 * s, 2.4 * K);
          rausch(g, -2.2 * s, Y(Z_FUSS + 2.2), 4.4 * s, 2.4 * K, 1.2 * s, 0.35, 9, true);
        }
        /* nachts: Strahler am Fuß */
        if (nacht > 0.02) {
          const gr = g.createLinearGradient(0, Y(Z_FUSS), 0, Y(14));
          gr.addColorStop(0, "rgba(255,226,180," + (0.55 * nacht).toFixed(3) + ")"); gr.addColorStop(1, "rgba(255,226,180,0)");
          g.save(); g.globalCompositeOperation = "screen"; g.fillStyle = gr; g.fillRect(-2.2 * s, Y(14), 4.4 * s, (14 - Z_FUSS) * K); g.restore();
        }
        g.restore();
        /* Gleitschalung mit Arbeitsbühne oben am wachsenden Schaft */
        if (Z.schaft < 1) {
          const r = schaftR(zS) + 0.35;
          g.fillStyle = "rgb(60,58,56)"; g.beginPath(); g.ellipse(0, Y(zS), r * s, r * 0.5 * s, 0, 0, 2 * Math.PI); g.fill();
          g.fillStyle = zylGrad(r, [120, 96, 70]); g.fillRect(-r * s, Y(zS + 0.5), 2 * r * s, 0.5 * K + r * 0.5 * s * 0);
          g.strokeStyle = "rgba(230,190,40,0.9)"; g.lineWidth = Math.max(1, 0.03 * s);
          g.beginPath(); g.ellipse(0, Y(zS + 1.0), r * s, r * 0.5 * s, 0, 0, 2 * Math.PI); g.stroke();
          for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, x = Math.sin(a) * r * s, y = Math.cos(a) * r * 0.5 * s; g.beginPath(); g.moveTo(x, Y(zS + 0.5) + y); g.lineTo(x, Y(zS + 1.0) + y); g.stroke(); }
        }
      }
    }
    /* ---------- Kugel ---------- */
    if (Z.skelett > 0) kugelMalen(g, s, F, Z, W, Y(KU.z), sch, nacht);
    /* ---------- Schaft über der Kugel und Antenne ---------- */
    if (Z.haut >= 1 || (Z.skelett >= 1 && Z.antenne > 0)) {
      const zTop = Z.antenne > 0 ? Z_ANT + (Z_TOP - Z_ANT) * Z.antenne : Z_ANT;
      /* Betonstück bis zum Antennenträger */
      schaftPfad(Z_KO - 0.25, Z_ANT, antR);
      if (sch) { g.fillStyle = "#000"; g.fill(); } else { g.fillStyle = zylGrad(0.5, BETON, flutS ? [flutS[0] * 1.2, flutS[1] * 1.2, flutS[2] * 1.2] : null); g.fill(); }
      /* Bühnen */
      for (const [z, r] of [[29.9, 0.54], [Z_ANT, 0.5]]) {
        if (sch) { g.fillStyle = "#000"; g.beginPath(); g.ellipse(0, Y(z), r * s, r * 0.5 * s, 0, 0, 2 * Math.PI); g.fill(); continue; }
        g.fillStyle = rgbS(farbeL([110, 112, 116], lfN([0, 0, 1]))); g.beginPath(); g.ellipse(0, Y(z), r * s, r * 0.5 * s, 0, 0, 2 * Math.PI); g.fill();
        g.fillStyle = zylGrad(r, [150, 152, 156]); g.beginPath(); g.ellipse(0, Y(z) + 0.12 * K, r * s, r * 0.5 * s, 0, 0, Math.PI); g.lineTo(-r * s, Y(z)); g.ellipse(0, Y(z), r * s, r * 0.5 * s, 0, Math.PI, 0, true); g.fill();
      }
      /* Antenne: rot-weiß gebändert, oben rot */
      if (Z.antenne > 0) {
        const band = 1.15, gRot = sch ? null : zylGrad(0.3, ROT), gWeiss = sch ? null : zylGrad(0.3, WEISS);
        let i = 0;
        for (let z1 = Z_TOP; z1 > Z_ANT; z1 -= band, i++) {
          const z0 = Math.max(Z_ANT, z1 - band);
          const a0 = z0, a1 = Math.min(z1, zTop);
          if (a1 <= a0) continue;
          schaftPfad(a0, a1, antR);
          g.fillStyle = sch ? "#000" : (i % 2 === 0 ? gRot : gWeiss);
          g.fill();
        }
        if (!sch && s > 20) {
          /* Stöße der Antennenrohre */
          g.strokeStyle = "rgba(40,30,30,0.25)"; g.lineWidth = 1;
          for (let z = Z_ANT + 0.6; z < zTop; z += 0.6) { const r = antR(z); g.beginPath(); g.ellipse(0, Y(z), r * s, r * 0.5 * s, 0, 0, Math.PI); g.stroke(); }
        }
      }
    }
  }

  /* Kugel aus rautenförmigen Edelstahlfeldern; jedes Feld eine flache
     Pyramide aus vier Dreiecken. Fensterband unter dem Äquator. */
  function kugelMalen(g, s, F, Z, W, yc, sch, nacht) {
    const R = KU.r * s, Zt = F.Z, jahr = F.jahr;
    const gier = (F.gier || 0) * RAD;
    const NR = 16, NL = 32, dL = 2 * Math.PI / NL;
    const th = (i) => -Math.PI / 2 + i * Math.PI / NR;
    const P = (t, p) => { const c = Math.cos(t), n = [c * Math.cos(p + gier), c * Math.sin(p + gier), Math.sin(t)]; return { n: n, x: R * (n[0] * TQ[0] + n[1] * TQ[1]), y: yc + R * (0.5 * (n[0] * EH[0] + n[1] * EH[1]) - ST.KZ * n[2]) }; };
    const sicht = (n) => n[0] * AUGE[0] + n[1] * AUGE[1] + n[2] * AUGE[2];
    const tHaut = -Math.PI / 2 + Math.PI * Z.haut;           // bis hierher verkleidet
    const tSkel = -Math.PI / 2 + Math.PI * Z.skelett;
    const BAND0 = -40 * RAD, BAND1 = -12 * RAD;
    if (sch) {
      if (Z.haut > 0.2) { g.fillStyle = "#000"; g.beginPath(); g.arc(0, yc, R, 0, 2 * Math.PI); g.fill(); }
      else { g.strokeStyle = "#000"; g.lineWidth = Math.max(1, 0.03 * s); g.beginPath(); g.arc(0, yc, R, 0, 2 * Math.PI); g.stroke(); }
      return;
    }
    /* Umgebung, die sich im Stahl spiegelt */
    const hx = PI.hex(Zt.himmel[0]), hz = PI.hex(Zt.himmel[1]);
    const boden = jahr === "winter" ? [226, 232, 242] : [128, 130, 118];
    const amb = Zt.amb;
    const L = ST.LICHT;
    const farbeFeld = (n, glas) => {
      const lf = ST.lichtFaktor(n, Zt, 0, jahr);
      const e = AUGE, d = 2 * (n[0] * e[0] + n[1] * e[1] + n[2] * e[2]);
      const r = [n[0] * d - e[0], n[1] * d - e[1], n[2] * d - e[2]];
      let env;
      if (r[2] > 0) env = mischF(hz, hx, klemm(r[2] * 1.4, 0, 1));
      else env = [boden[0] * amb[0] * 1.2, boden[1] * amb[1] * 1.2, boden[2] * amb[2] * 1.2];
      const sp = Math.pow(Math.max(0, r[0] * L[0] + r[1] * L[1] + r[2] * L[2]), 18) * Zt.sonne[0] * 1.8;
      const basis = glas ? [34, 42, 54] : STAHL;
      const k = glas ? 0.35 : 0.5;
      let c = [basis[0] * lf[0] * (1 - k) + env[0] * k + 255 * sp, basis[1] * lf[1] * (1 - k) + env[1] * k + 250 * sp, basis[2] * lf[2] * (1 - k) + env[2] * k + 236 * sp];
      if (nacht > 0.02 && !glas) { const f = 0.35 + 0.35 * Math.max(0, -n[2] + 0.4); c = [c[0] + 150 * f * nacht, c[1] + 156 * f * nacht, c[2] + 172 * f * nacht]; }
      if (jahr === "winter" && n[2] > 0.72 && !glas) c = mischF(c, [236, 240, 248], 0.55 * (n[2] - 0.72) / 0.28 * (Z.fertig ? 1 : Z.schnee));
      return rgbS([Math.min(255, c[0]), Math.min(255, c[1]), Math.min(255, c[2])]);
    };
    g.save();
    g.beginPath(); g.arc(0, yc, R + 0.5, 0, 2 * Math.PI); g.clip();
    /* Grundton (auch für den Rand) */
    if (Z.haut > 0) {
      const gr = g.createRadialGradient(-R * 0.35, yc - R * 0.35, R * 0.1, 0, yc, R);
      gr.addColorStop(0, farbeFeld(nrm([-0.3, 0.3, 0.6]))); gr.addColorStop(1, farbeFeld(nrm([0.2, 0.7, -0.4])));
      g.fillStyle = gr;
      g.beginPath();
      if (Z.haut >= 1) g.arc(0, yc, R, 0, 2 * Math.PI);
      else { g.rect(-R, yc - R * ST.KZ * Math.sin(tHaut) - R * 0.5 * Math.cos(tHaut), 2 * R, 2 * R); }
      g.fill();
    }
    const fein = R > 22;
    for (let i = 1; i < NR; i++) {
      const t = th(i);
      if (t - Math.PI / NR > tHaut) break;
      const off = (i % 2) * dL / 2;
      for (let j = 0; j < NL; j++) {
        const p = j * dL + off;
        const C = P(t, p);
        if (sicht(C.n) < -0.05) continue;
        if (t > BAND0 - 0.01 && t < BAND1 + 0.01) continue;   // Fensterband folgt
        const A = P(th(i - 1), p), Bq = P(t, p + dL / 2), Cq = P(th(i + 1), p), D = P(t, p - dL / 2);
        if (!fein) {
          g.fillStyle = farbeFeld(C.n);
          g.beginPath(); g.moveTo(A.x, A.y); g.lineTo(Bq.x, Bq.y); g.lineTo(Cq.x, Cq.y); g.lineTo(D.x, D.y); g.closePath(); g.fill();
          continue;
        }
        /* flache Pyramide: vier Dreiecke, jedes zur eigenen Kante geneigt */
        const ecken = [A, Bq, Cq, D];
        for (let k = 0; k < 4; k++) {
          const a = ecken[k], b = ecken[(k + 1) % 4];
          const m = nrm(add(a.n, b.n)), nt = nrm(add(C.n, mul(sub(m, C.n), 0.9)));
          g.fillStyle = farbeFeld(nt);
          g.beginPath(); g.moveTo(C.x, C.y); g.lineTo(a.x, a.y); g.lineTo(b.x, b.y); g.closePath(); g.fill();
        }
        /* feine Fugen zwischen den Feldern */
        g.strokeStyle = "rgba(60,66,76,0.28)"; g.lineWidth = Math.max(0.5, R * 0.006);
        g.beginPath(); g.moveTo(A.x, A.y); g.lineTo(Bq.x, Bq.y); g.lineTo(Cq.x, Cq.y); g.lineTo(D.x, D.y); g.closePath(); g.stroke();
      }
    }
    /* Fensterband: Aussichtsgeschoss und Telecafé, zwei Reihen */
    if (tHaut > BAND1) {
      for (const [t0, t1] of [[BAND0, -26 * RAD], [-26 * RAD, BAND1]]) {
        for (let j = 0; j < NL; j++) {
          const p0 = j * dL, p1 = p0 + dL;
          const a = P(t0, p0), b = P(t0, p1), c = P(t1, p1), d = P(t1, p0);
          const nm = P((t0 + t1) / 2, p0 + dL / 2).n;
          if (sicht(nm) < -0.05) continue;
          g.fillStyle = farbeFeld(nm, true);
          g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.lineTo(c.x, c.y); g.lineTo(d.x, d.y); g.closePath(); g.fill();
          if (nacht > 0.02 && Z.glas) {
            g.fillStyle = "rgba(255,206,130," + (0.85 * nacht).toFixed(3) + ")"; g.fill();
          }
        }
        /* Rahmen */
        g.strokeStyle = "rgba(200,204,210,0.55)"; g.lineWidth = Math.max(0.6, R * 0.012);
        g.beginPath();
        for (let j = 0; j < NL; j++) { const p0 = j * dL, n = P((t0 + t1) / 2, p0).n; if (sicht(n) < 0) continue; const a = P(t0, p0), d = P(t1, p0); g.moveTo(a.x, a.y); g.lineTo(d.x, d.y); }
        g.stroke();
      }
      /* Gesimsringe über und unter dem Band */
      g.strokeStyle = farbeFeld(nrm([0, 0.5, 0.8])); g.lineWidth = Math.max(1, R * 0.03);
      for (const t of [BAND0, BAND1]) { g.beginPath(); let erst = true; for (let k = 0; k <= 48; k++) { const q = P(t, k * 2 * Math.PI / 48 - gier); if (sicht(q.n) < 0) { erst = true; continue; } if (erst) g.moveTo(q.x, q.y); else g.lineTo(q.x, q.y); erst = false; } g.stroke(); }
      if (nacht > 0.02 && Z.glas) { F.leuchtPunkt(0, yc + R * 0.55, R * 1.6, "255,200,130", 0.55); }
    }
    /* Stahlskelett, das noch nicht verkleidet ist */
    if (Z.haut < 1) {
      g.strokeStyle = "rgba(70,74,80,0.9)"; g.lineWidth = Math.max(0.8, R * 0.012);
      for (let j = 0; j < NL / 2; j++) {
        g.beginPath(); let erst = true;
        for (let i = 0; i <= NR; i++) { const t = th(i); if (t > tSkel) break; const q = P(t, j * 2 * dL); if (erst) g.moveTo(q.x, q.y); else g.lineTo(q.x, q.y); erst = false; }
        g.stroke();
      }
      for (let i = 1; i < NR; i += 2) {
        const t = th(i); if (t > tSkel) break;
        g.beginPath(); for (let k = 0; k <= 32; k++) { const q = P(t, k * 2 * Math.PI / 32); if (k) g.lineTo(q.x, q.y); else g.moveTo(q.x, q.y); } g.stroke();
      }
    }
    g.restore();
    /* weiche Randabdunklung und Glanzkante */
    if (Z.haut >= 1) {
      const gr = g.createRadialGradient(0, yc, R * 0.75, 0, yc, R);
      gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(1, "rgba(20,26,40,0.25)");
      g.fillStyle = gr; g.beginPath(); g.arc(0, yc, R, 0, 2 * Math.PI); g.fill();
    }
  }

  /* Rote Flugbefeuerung (jedes Bild): Spitze blinkt, die übrigen leuchten ruhig */
  function befeuerung(g, P) {
    const nacht = P.Z.nacht;
    if (nacht < 0.05) return;
    const t = P.t || 0;
    const punkte = [[0, 0, Z_TOP + 0.1, 1], [0.13, 0, 41, 0], [-0.13, 0, 41, 0], [0.3, 0, 36.2, 0], [-0.3, 0, 36.2, 0], [0.62, 0, 29.9, 0], [-0.62, 0, 29.9, 0], [0, 0.62, 29.9, 0], [0, -0.62, 29.9, 0]];
    g.save(); g.globalCompositeOperation = "lighter";
    for (const [x, y, z, blink] of punkte) {
      const an = blink ? (((t % 1.6) < 0.55) ? 1 : 0.08) : 0.75 + 0.25 * Math.sin(t * 2.1 + z);
      const [px, py] = P.proj(x, y, z);
      const r = Math.max(3, P.s * 0.35) * (blink ? 1.4 : 1);
      const gr = g.createRadialGradient(px, py, 0, px, py, r);
      gr.addColorStop(0, "rgba(255,70,50," + (0.95 * an * nacht).toFixed(3) + ")"); gr.addColorStop(0.25, "rgba(255,30,20," + (0.45 * an * nacht).toFixed(3) + ")"); gr.addColorStop(1, "rgba(255,0,0,0)");
      g.fillStyle = gr; g.fillRect(px - r, py - r, 2 * r, 2 * r);
      g.fillStyle = "rgba(255,220,210," + (an * nacht).toFixed(3) + ")"; g.beginPath(); g.arc(px, py, Math.max(0.8, P.s * 0.04), 0, 2 * Math.PI); g.fill();
    }
    g.restore();
  }

  /* =====================================================================
     PAVILLON UND PLATZ
     ===================================================================== */
  const winkel = (k) => (k + 0.5) * Math.PI / 6;   // Ecken der zwölf Sektoren (Mitte von Sektor 2 = Süden)
  function glasWand(W, sued) {
    return {
      ao: true, flut: 0.5,
      malen(g, F, I) {
        const w = F.w, y0 = I.B0, Z = W.Z;
        const zT = Math.min(Z_PAV, I.zmax);
        /* Sockel und Stirnband aus hellem Beton */
        g.fillStyle = rgbS(BETON); g.fillRect(-0.1, y0 - 0.1, w + 0.2, F.h + 0.2);
        rausch(g, -0.1, y0 - 0.1, w + 0.2, F.h + 0.2, 2, 0.12, 5);
        if (Z.pavWand < 1) return;
        /* Glasfront zwischen 0,15 m und 1,35 m, Geschossband bei 0,78 m */
        const z0 = Z_PL + 0.12, z1 = Z_PAV - 0.2;
        const gr = g.createLinearGradient(0, -z1, 0, -z0);
        if (Z.glas) { gr.addColorStop(0, "rgb(120,138,160)"); gr.addColorStop(0.5, "rgb(62,74,90)"); gr.addColorStop(1, "rgb(44,50,60)"); }
        else { gr.addColorStop(0, "rgb(40,38,36)"); gr.addColorStop(1, "rgb(40,38,36)"); }
        g.fillStyle = gr; g.fillRect(0.06, -z1, w - 0.12, z1 - z0);
        /* Spiegelung: schräge helle Bahnen */
        if (Z.glas) { g.save(); g.beginPath(); g.rect(0.06, -z1, w - 0.12, z1 - z0); g.clip(); g.fillStyle = "rgba(220,230,240,0.10)"; for (let x = 0.3; x < w; x += 1.7) { g.beginPath(); g.moveTo(x, -z1); g.lineTo(x + 0.5, -z1); g.lineTo(x - 0.1, -z0); g.lineTo(x - 0.6, -z0); g.closePath(); g.fill(); } g.restore(); }
        g.fillStyle = rgbS(BETON); g.fillRect(0, -0.86, w, 0.1);
        /* Pfosten */
        g.fillStyle = "rgb(186,190,196)";
        const n = Math.max(2, Math.round(w / 0.36));
        for (let i = 0; i <= n; i++) g.fillRect(i * w / n - 0.015, -z1, 0.03, z1 - z0);
        if (sued) {
          /* Eingang: Glastüren unter einem schmalen Vordach */
          const tx = w / 2 - 0.6;
          g.fillStyle = "rgb(30,34,40)"; g.fillRect(tx, -0.74, 1.2, 0.72);
          g.fillStyle = "rgb(186,190,196)"; for (let i = 0; i <= 4; i++) g.fillRect(tx + i * 0.3 - 0.015, -0.74, 0.03, 0.72);
          g.fillStyle = "rgb(236,236,232)"; g.fillRect(tx - 0.2, -0.82, 1.6, 0.07);
          const sv = F.schatten(0.4); if (sv) { g.fillStyle = "rgba(20,24,34,0.35)"; g.fillRect(tx - 0.2 + sv[0], -0.75, 1.6, Math.max(0.03, sv[1])); }
        }
        /* Reif: unten an der Scheibe */
        if (W.winter) {
          const k = Z.fertig ? 1 : Z.schnee;
          const gr2 = g.createLinearGradient(0, -z0, 0, -z0 - 0.35);
          gr2.addColorStop(0, "rgba(236,242,250," + (0.7 * k).toFixed(3) + ")"); gr2.addColorStop(1, "rgba(236,242,250,0)");
          g.fillStyle = gr2; g.fillRect(0, -z0 - 0.35, w, 0.35);
          g.fillStyle = rgbS(SCHNEE, 0.9 * k); g.fillRect(-0.1, -Z_PL - 0.08, w + 0.2, 0.08);
        }
      },
      leuchten(g, F, I) {
        if (!W.Z.fertig) return;
        const w = F.w, z0 = Z_PL + 0.12, z1 = Z_PAV - 0.2;
        const gr = g.createLinearGradient(0, -z1, 0, -z0);
        gr.addColorStop(0, "rgba(255,220,160," + (0.7 * F.nacht).toFixed(3) + ")"); gr.addColorStop(1, "rgba(255,190,110," + (0.8 * F.nacht).toFixed(3) + ")");
        g.fillStyle = gr; g.fillRect(0.06, -z1, w - 0.12, z1 - z0);
        g.fillStyle = "rgba(90,80,70,0.8)"; g.fillRect(0, -0.86, w, 0.1);
        const n = Math.max(2, Math.round(w / 0.36));
        g.fillStyle = "rgba(110,100,90,0.8)"; for (let i = 0; i <= n; i++) g.fillRect(i * w / n - 0.015, -z1, 0.03, z1 - z0);
        I.lp(F, w / 2, 0.7, 2.2, "255,200,130", 0.5);
      }
    };
  }
  /* Faltdach: Betonschalen, hell; Winter mit Schnee */
  function faltMaler(W) {
    return function (fl) {
      const s = seite(fl.n);
      if (s === "unten") return null;
      if (s === "dach" || s === "oben") return {
        flut: 0.3,
        malen(g, F, I) {
          const x = -0.1, y = I.B0 - 0.1, w = F.w + 0.2, h = F.h + 0.2;
          g.fillStyle = "rgb(214,212,206)"; g.fillRect(x, y, w, h);
          rausch(g, x, y, w, h, 2.5, 0.16, 7);
          if (F.px > 14) { g.strokeStyle = "rgba(120,118,112,0.3)"; g.lineWidth = 0.9 / F.px; g.beginPath(); for (let t = y; t < y + h; t += 0.5) { g.moveTo(x, t); g.lineTo(x + w, t); } g.stroke(); }
          if (W.winter) {
            const k = W.Z.fertig ? 1 : W.Z.schnee;
            g.fillStyle = rgbS(SCHNEE, 0.9 * k); g.fillRect(x, y, w, h);
            rausch(g, x, y, w, h, 1.5, 0.08, 9);
          }
        }
      };
      /* Stirnseiten der Falten: Glasdreiecke mit Betonkante */
      return {
        flut: 0.4,
        malen(g, F, I) {
          const pts = I.fl.pts.map((p) => [dot(p, I.u) - I.A0, dot(p, I.v)]);
          g.fillStyle = W.Z.glas ? "rgb(70,84,102)" : "rgb(40,38,36)"; g.fillRect(-0.1, I.B0 - 0.1, F.w + 0.2, F.h + 0.2);
          if (W.Z.glas) { g.fillStyle = "rgba(200,212,228,0.25)"; g.fillRect(-0.1, I.B0 - 0.1, F.w + 0.2, F.h * 0.4); g.fillStyle = "rgb(186,190,196)"; const n = Math.max(2, Math.round(F.w / 0.36)); for (let i = 0; i <= n; i++) g.fillRect(i * F.w / n - 0.015, I.B0, 0.03, F.h); }
          g.strokeStyle = "rgb(226,224,218)"; g.lineWidth = 0.14; g.lineJoin = "round";
          g.beginPath(); pts.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.closePath(); g.stroke();
        },
        leuchten(g, F, I) { if (!W.Z.fertig) return; g.fillStyle = "rgba(255,210,150," + (0.45 * F.nacht).toFixed(3) + ")"; g.fillRect(0.1, I.B0 + 0.1, F.w - 0.2, F.h - 0.1); }
      };
    };
  }
  function platzMaler(W) {
    return function (fl) {
      const s = seite(fl.n);
      if (s === "unten") return null;
      if (s !== "oben") return { malen(g, F, I) { g.fillStyle = "rgb(150,148,142)"; g.fillRect(-0.1, I.B0 - 0.1, F.w + 0.2, F.h + 0.2); } };
      return {
        malen(g, F, I) {
          const Z = W.Z, ax = I.A0;
          g.save(); g.translate(-ax, 0);
          /* Granitpflaster in Bahnen, hell und dunkel */
          g.fillStyle = "rgb(178,174,166)"; g.fillRect(-8.1, -8.1, 16.2, 16.2);
          rausch(g, -8.1, -8.1, 16.2, 16.2, 3, 0.18, 11);
          g.fillStyle = "rgba(96,94,90,0.35)";
          for (let r = R_AUS + 0.4; r < 11; r += 1.4) { g.beginPath(); g.arc(0, 0, r, 0, 2 * Math.PI); g.arc(0, 0, r + 0.25, 0, 2 * Math.PI, true); g.fill(); }
          if (F.px * 0.3 > 4) {
            g.strokeStyle = "rgba(90,86,80,0.35)"; g.lineWidth = 0.8 / F.px; g.beginPath();
            for (let t = -8; t <= 8; t += 0.3) { g.moveTo(-8, t); g.lineTo(8, t); }
            for (let t = -8, j = 0; t <= 8; t += 0.3, j++) for (let u = -8 + (j & 1) * 0.3; u <= 8; u += 0.6) { g.moveTo(u, t); g.lineTo(u, t + 0.3); }
            g.stroke();
          }
          /* Baugrube */
          if (!Z.fertig && Z.grube > 0 && Z.pavWand <= 0) {
            g.fillStyle = "rgba(96,78,58," + (0.9 * Math.min(1, Z.grube * 2)).toFixed(3) + ")"; g.beginPath(); g.arc(0, 0, 3.4, 0, 2 * Math.PI); g.fill();
            g.fillStyle = "rgba(60,48,36,0.6)"; g.beginPath(); g.arc(0, 0, 2.6, 0, 2 * Math.PI); g.fill();
            g.strokeStyle = "rgba(200,200,196,0.8)"; g.lineWidth = 0.04; g.beginPath(); g.arc(0, 0, 3.6, 0, 2 * Math.PI); g.stroke();
          }
          if (W.winter) {
            const k = Z.fertig ? 1 : Z.schnee * 0.8 + 0.2;
            g.fillStyle = rgbS(SCHNEE, 0.92 * k); g.fillRect(-8.1, -8.1, 16.2, 16.2);
            rausch(g, -8.1, -8.1, 16.2, 16.2, 2, 0.07, 9);
            if (Z.fertig) {
              /* geräumte Wege zum Eingang und rund um den Pavillon */
              g.strokeStyle = "rgba(160,160,158,0.55)"; g.lineCap = "round"; g.lineWidth = 1.0;
              g.beginPath(); g.moveTo(0, R_AUS); g.lineTo(0, 8.2); g.moveTo(0, 7.8); g.lineTo(-8.2, 7.8); g.moveTo(0, 7.8); g.lineTo(8.2, 7.8); g.stroke();
              g.lineWidth = 0.6; g.beginPath(); g.arc(0, 0, R_AUS + 0.6, 0, 2 * Math.PI); g.stroke();
            }
          }
          g.restore();
        }
      };
    };
  }

  /* =====================================================================
     AUFBAU
     ===================================================================== */
  function turmBauen(W, M) {
    const Z = W.Z;
    W.koerper("platz", quaderP(-8, -8, 0, 8, 8, Z_PL), platzMaler(W), { schatten: false, keinWerfen: true });
    if (Z.fund > 0) {
      const zf = Z_PL + (Z_FUSS - Z_PL) * Z.fund;
      W.koerper("fundament", ring(0, 0, 2.3, Z_PL, 12).concat(ring(0, 0, 2.3, zf, 12)), (fl) => seite(fl.n) === "unten" ? null : {
        malen(g, F, I) { g.fillStyle = "rgb(168,166,160)"; g.fillRect(-0.1, I.B0 - 0.1, F.w + 0.2, F.h + 0.2); rausch(g, -0.1, I.B0 - 0.1, F.w + 0.2, F.h + 0.2, 1, 0.3, 8); if (W.winter && Z.fertig) { g.fillStyle = rgbS(SCHNEE, 0.8); g.fillRect(-0.1, I.B0 - 0.1, F.w + 0.2, F.h + 0.2); } }
      }, { schatten: false });
    }
    /* Turm als Figur, für die Reihenfolge ein Zwölfeck-Prisma */
    if (Z.schaft > 0) {
      const fi = { x: 0, y: 0, z: Z_FUSS, breite: 4.6, hoehe: Z_TOP - Z_FUSS + 0.5, schatten: true, malen(g, s, F) { turmMalen(g, s, F, Z, W); } };
      const K = W.koerper("turm", ring(0, 0, 2.12, Z_FUSS, 12).concat(ring(0, 0, 2.12, Z_TOP, 12)), () => null, { schatten: true });
      K.figur = fi;
      /* unsichtbare Schattenwerfer für Pavillon und Platz: Schaft, Kugel, Antenne */
      const zS = Z.schaft >= 1 ? Z_KU + 0.3 : Z_FUSS + (Z_KU + 0.3 - Z_FUSS) * Z.schaft;
      const kegel = (z0, z1, r0, r1) => ring(0, 0, r0, z0, 12).concat(ring(0, 0, r1, z1, 12));
      W.werfer.push(huelle3(kegel(Z_FUSS, 2.2, 1.9, 1.5)), huelle3(kegel(2.2, zS, 1.5, schaftR(zS))));
      if (Z.haut > 0.5) { const p = []; for (let i = -3; i <= 3; i++) { const t = i * Math.PI / 8; p.push(...ring(0, 0, KU.r * Math.cos(t), KU.z + KU.r * Math.sin(t), 12)); } W.werfer.push(huelle3(p)); }
      if (Z.antenne > 0) W.werfer.push(huelle3(kegel(Z_KO, Z_TOP, 0.4, 0.05)));
    }
    /* Pavillon: zwölf Sektoren, darüber die Falten */
    if (Z.pavWand > 0) {
      const zW = Z_PL + (Z_PAV - Z_PL) * Z.pavWand;
      for (let k = 0; k < 12; k++) {
        const a0 = winkel(k), a1 = winkel(k + 1), am = (a0 + a1) / 2;
        const sued = k === 2;
        const P2 = (r, a, z) => [r * Math.cos(a), r * Math.sin(a), z];
        const pts = [P2(R_IN, a0, Z_PL), P2(R_IN, a1, Z_PL), P2(R_AUS, a0, Z_PL), P2(R_AUS, a1, Z_PL), P2(R_IN, a0, Z_PAV), P2(R_IN, a1, Z_PAV), P2(R_AUS, a0, Z_PAV), P2(R_AUS, a1, Z_PAV)];
        const wand = glasWand(W, sued);
        const mal = (fl) => {
          const s = seite(fl.n);
          if (s === "unten") return null;
          if (s === "oben") return { malen(g, F, I) { g.fillStyle = "rgb(120,116,110)"; g.fillRect(-0.1, I.B0 - 0.1, F.w + 0.2, F.h + 0.2); } };
          /* außen (Normale zeigt vom Turm weg) = Glasfront */
          const aussen = fl.n[0] * Math.cos(am) + fl.n[1] * Math.sin(am) > 0.9;
          return aussen ? wand : { ao: true, malen(g, F, I) { g.fillStyle = rgbS(BETON); g.fillRect(-0.1, I.B0 - 0.1, F.w + 0.2, F.h + 0.2); rausch(g, -0.1, I.B0 - 0.1, F.w + 0.2, F.h + 0.2, 2, 0.14, 5); } };
        };
        W.koerper("pav" + k, pts, mal, { bisZ: Z.pavWand < 1 ? zW : null, wirft: true, schatten: false });
        if (Z.pavWand >= 1 && Z.pavDach > 0) {
          const ci = Math.cos(Math.PI / 12);
          /* Innenpunkt so hoch, dass jede Faltenhälfte eine ebene Fläche ist
             (sonst zerfiele sie in Dreiecke mit sichtbaren Knicken) */
          const zs = Z_PAV + (Z_SPITZE - Z_PAV) * Z.pavDach, zi = Z_PAV + (zs - Z_PAV) * R_IN / R_AUS;
          const dp = [P2(R_IN, a0, Z_PAV), P2(R_IN, a1, Z_PAV), P2(R_AUS, a0, Z_PAV), P2(R_AUS, a1, Z_PAV), P2(R_IN * ci, am, zi), P2(R_AUS * ci, am, zs)];
          W.koerper("falte" + k, dp, faltMaler(W), { wirft: true, schatten: false });
        }
      }
    }
  }

  /* =====================================================================
     ANMELDEN
     ===================================================================== */
  ST.modell("fernsehturm", {
    name: "Fernsehturm", gruppe: "Wahrzeichen", grund: [16, 16], hoehe: 46, bauzeit: 40 * 60,
    bauen(M, o) {
      const B = blickVon(o);
      const W = new Werk(o, B);
      const bau = o.bau == null ? 1 : klemm(o.bau, 0, 1);
      W.Z = zustand(bau);
      W.winter = o.jahr === "winter";
      W.jahr = o.jahr;
      W.saat = (o.saat >>> 0) % 1000 || 7;
      turmBauen(W, M);
      ausgeben(W, M);
      if (W.Z.fertig) {
        /* Strahler am Fuß, Lichtpfütze vor dem Eingang */
        M.bodenlicht(0, R_AUS + 1.2, 3.0, "255,206,140", 0.8);
        M.licht(0, 0, KU.z - 1.2, 3.2, "255,210,150", 0.35);
        M.lebendig(befeuerung);
      }
    }
  });
})();
