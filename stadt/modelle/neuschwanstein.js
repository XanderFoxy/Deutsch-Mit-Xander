/* =====================================================================
   SCHLOSS NEUSCHWANSTEIN (Ludwig II., 1869–1892) — Maßstab etwa 1:4
   ---------------------------------------------------------------------
   XANDER: „richtig filigran. Richtig schön ausarbeiten mit schönen
   Texturen" · „keine Comic Grafik … viel mehr am Realismus" · „ohne
   Pixelkanten und komische Vektorrückstände" · „Man soll das Fundament
   sehen beim Aufbauen" · „Du bist dein schlimmster Kritiker"

   WAS GEBAUT IST (x = Osten, y = Süden, z = oben; Felsplateau auf 1,5 m)
     • Felssockel: grauer Kalkfels mit Schichtbänken und Klüften, im Osten
       eine Stützmauer mit Auffahrt (Rampe von Süden zum Tor).
     • Palas im Westen: fünf Geschosse aus weißem Kalkstein, Rundbogen-
       Biforien, oben an der Hofseite die Arkaden des Sängersaals, im
       Westen der Balkon vor dem Thronsaal, steiles Schieferdach mit
       vergoldeten Firstspitzen, zwei auskragende Ecktürmchen.
     • Treppenturm (Nordturm) in der Hofecke: schlank, rund, Kranz mit
       Rundbogenfries und spitzer blaugrauer Schieferhelm – der höchste
       Punkt des Schlosses.
     • Ritterhaus an der Nordseite, Viereckturm mit Zinnenkranz, Kemenate
       an der Südseite mit Treppengiebel und rundem Eckturm.
     • Torbau im Osten aus rötlichem Backstein mit Kalksteinbändern,
       Torbogen mit bayerischem Rautenwappen, Zinnen, zwei Ecktürme.
     • Ringmauer mit Zinnen um den unteren Hof.
   Winter: Schnee auf Dächern, Zinnen, Simsen, im Hof. Nacht: das Schloss
   ist angestrahlt, einzelne Fenster und der Sängersaal leuchten.

   WIE ES GEMALT WIRD
   Wie die Dorfkirche: konvexe Körper, für jede Ansicht nach trennenden
   Ebenen geordnet (dann stimmt die Reihenfolge in jedem Winkel), Türme
   und hohe Bauteile werfen Eigenschatten auf Dächer, Wände und den Hof.
   Runde Türme sind Prismen, deren Facetten weich schattiert werden (Licht
   quer über jede Facette verlaufend) – keine sichtbaren Kanten.

   BAUPHASEN (o.bau) — wie die echte Baugeschichte: zuerst der Torbau
   (Ludwig wohnte dort, bevor der Palas stand), dann Palas, zuletzt der
   Viereckturm und die Kemenate.
     0,00–0,06  Felsplateau wird abgesprengt, Baugruben
     0,05–0,12  Fundamente
     0,12–0,32  Torbau (Backstein), Zinnen, Dach
     0,30–0,56  Palas wächst (erst Backsteinkern, dann Kalkverkleidung)
     0,56–0,64  Palasdach: Schalung, dann Schiefer von der Traufe her
     0,48–0,80  Treppenturm, Helm
     0,58–0,86  Ritterhaus, Viereckturm, Kemenate, Dächer
     0,80–0,92  Ecktürmchen und Helme
     0,92–1,00  Verglasung, Vergoldung, Schnee
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

  function Werk(o, B) { this.o = o; this.B = B; this.k = []; this.verbuende = {}; }
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
    for (const C of W.k) {
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
     WERKSTOFFE (bei weißem Licht)
     ===================================================================== */
  const KALK = [232, 227, 214], KALK_H = [246, 243, 236], KALK_D = [196, 190, 176];
  const ZIEGEL = [178, 102, 76], ZIEGEL_D = [150, 80, 60];
  const SCHIEFER = [92, 104, 120], SCHIEFER_D = [66, 76, 90];
  const FELS = [156, 151, 140];
  const GOLD = [222, 176, 78];
  const SCHNEE = [246, 248, 252];
  const HOLZ = [150, 112, 74];

  /* Rauschen über wenige Grundmuster, die Saat verschiebt nur */
  function rausch(g, x, y, w, h, meter, staerke, saat, hellen) {
    const bild = PI.rauschBild(hellen ? 53 : 3 + (saat % 3), 128, 4, 4, 1.6);
    const m = g.createPattern(bild, "repeat"), k = meter / 128;
    m.setTransform(new DOMMatrix([k, 0, 0, k, (saat * 0.37) % meter, (saat * 0.61) % meter]));
    g.save(); g.globalCompositeOperation = hellen ? "screen" : "multiply"; g.globalAlpha = staerke; g.fillStyle = m; g.fillRect(x, y, w, h); g.restore();
  }

  /* Kalkstein-Quaderwerk: Lagen von ~11 cm (im Original 45 cm), fein
     versetzte Stoßfugen, wolkige Verwitterung, graue Regenschlieren */
  function kalk(g, F, I, x, y, w, h, opt) {
    opt = opt || {};
    const c = opt.farbe || KALK, saat = opt.saat || 5;
    g.fillStyle = rgbS(c); g.fillRect(x, y, w, h);
    /* kleine Flächen (Zinnen, Stufen): nur Grundton und ein Rauschen */
    if (w * h * F.px * F.px < 500) { rausch(g, x, y, w, h, 5.5, 0.16, saat); return; }
    rausch(g, x, y, w, h, 5.5, 0.16, saat);
    if (F.px > 20) { rausch(g, x, y, w, h, 1.1, 0.10, saat + 1); rausch(g, x, y, w, h, 3.2, 0.10, saat, true); }
    const lage = opt.lage || 0.13;
    if (F.px * lage > 3.2 && opt.fugen !== false) {
      const al = klemm((F.px * lage - 3.2) / 6, 0, 1) * 0.16;
      g.strokeStyle = rgbS(hellF(c, -0.45), al); g.lineWidth = Math.max(0.006, 0.9 / F.px);
      g.beginPath();
      const j0 = Math.floor(y / lage), j1 = Math.ceil((y + h) / lage);
      for (let j = j0; j <= j1; j++) {
        const yy = j * lage; g.moveTo(x, yy); g.lineTo(x + w, yy);
        if (F.px * lage > 6) {
          let xx = x - hash(j, 3, saat) * 0.4;
          while (xx < x + w) { xx += 0.22 + hash(j, Math.round(xx * 10), saat) * 0.3; g.moveTo(xx, yy); g.lineTo(xx, yy + lage); }
        }
      }
      g.stroke();
    }
    /* Regenschlieren von oben (Gesimse, Fensterbänke) */
    if (opt.schlieren !== false && F.px > 6) {
      const rng = ST.zufall(saat * 7 + 3);
      for (let i = 0; i < w * 0.8; i++) {
        const sx = x + rng() * w, sy = y + rng() * h * 0.6, l = 0.6 + rng() * 2.2, b = 0.08 + rng() * 0.25;
        const gr = g.createLinearGradient(0, sy, 0, sy + l);
        gr.addColorStop(0, "rgba(90,92,86,0.13)"); gr.addColorStop(1, "rgba(90,92,86,0)");
        g.fillStyle = gr; g.fillRect(sx, sy, b, l);
      }
    }
  }
  /* Backstein (Torbau): rötlich, Lagen 1,8 cm – im Kleinen als feines Korn */
  function backstein(g, F, x, y, w, h, saat) {
    g.fillStyle = rgbS(ZIEGEL); g.fillRect(x, y, w, h);
    if (w * h * F.px * F.px < 500) { rausch(g, x, y, w, h, 4.5, 0.22, saat || 2); return; }
    rausch(g, x, y, w, h, 4.5, 0.22, saat || 2);
    if (F.px > 20) rausch(g, x, y, w, h, 2.4, 0.10, saat || 2, true);
    const lage = 0.055;
    if (F.px * lage > 2.6) {
      const al = klemm((F.px * lage - 2.6) / 4, 0, 1);
      g.strokeStyle = "rgba(226,206,186," + (0.35 * al).toFixed(3) + ")"; g.lineWidth = Math.max(0.004, 0.8 / F.px);
      g.beginPath();
      for (let yy = Math.floor(y / lage) * lage; yy < y + h; yy += lage) { g.moveTo(x, yy); g.lineTo(x + w, yy); }
      if (F.px * lage > 7) {
        for (let yy = Math.floor(y / lage) * lage, j = 0; yy < y + h; yy += lage, j++) for (let xx = x + ((j & 1) ? 0.06 : 0); xx < x + w; xx += 0.12) { g.moveTo(xx, yy); g.lineTo(xx, yy + lage); }
      }
      g.stroke();
      if (F.px * lage > 5) {
        const rng = ST.zufall(saat * 13 + 1);
        for (let i = 0; i < w * h * 30; i++) { g.fillStyle = rgbS(hellF(ZIEGEL, (rng() - 0.5) * 0.35), 0.5); g.fillRect(x + rng() * w, Math.floor((y + rng() * h) / lage) * lage + 0.004, 0.11, lage - 0.008); }
      }
    }
  }
  /* Schiefer: blaugrau, altdeutsche Deckung in Reihen; nah einzelne
     Schuppen mit leicht wechselndem Ton und feinen Schattenkanten */
  function schiefer(g, F, x, y, w, h, opt) {
    opt = opt || {};
    const reihe = opt.reihe || 0.075, saat = opt.saat || 4;
    g.fillStyle = rgbS(SCHIEFER); g.fillRect(x, y, w, h);
    rausch(g, x, y, w, h, 4, 0.20, saat);
    if (F.px * reihe > 2.2) {
      const al = klemm((F.px * reihe - 2.2) / 4, 0, 1);
      if (F.px * reihe > 5) {
        const rng = ST.zufall(saat * 31 + 7), bb = reihe * 1.5;
        for (let yy = Math.floor(y / reihe) * reihe, j = 0; yy < y + h; yy += reihe, j++) {
          for (let xx = x - ((j & 1) ? bb / 2 : 0); xx < x + w; xx += bb * (0.8 + rng() * 0.4)) {
            g.fillStyle = rgbS(hellF(SCHIEFER, (rng() - 0.5) * 0.28));
            g.beginPath(); g.moveTo(xx, yy); g.lineTo(xx + bb, yy); g.lineTo(xx + bb, yy + reihe * 0.7); g.quadraticCurveTo(xx + bb * 0.5, yy + reihe * 1.25, xx, yy + reihe * 0.85); g.closePath(); g.fill();
          }
        }
      }
      g.strokeStyle = rgbS(SCHIEFER_D, 0.55 * al); g.lineWidth = Math.max(0.005, 1 / F.px);
      g.beginPath();
      for (let yy = Math.floor(y / reihe) * reihe; yy < y + h; yy += reihe) { g.moveTo(x, yy + reihe * 0.9); g.lineTo(x + w, yy + reihe * 0.9); }
      g.stroke();
    }
    /* Himmelsspiegelung: der Schiefer glänzt ein wenig */
    const gr = g.createLinearGradient(0, y, 0, y + h);
    gr.addColorStop(0, "rgba(190,205,225,0.10)"); gr.addColorStop(1, "rgba(190,205,225,0)");
    g.fillStyle = gr; g.fillRect(x, y, w, h);
  }
  /* Schnee auf steilem Schiefer: er hält nur in den Reihen, unten eine
     Wehe am Traufrand, oben am First ein schmaler Kamm */
  function schneeSteil(g, F, x, y, w, h, k, steil) {
    if (k <= 0) return;
    const rng = ST.zufall(71), reihe = steil ? 0.06 : 0.075;
    g.save();
    /* Hauch über allem, wolkig dichter, wo der Wind ihn hingelegt hat */
    g.fillStyle = rgbS(SCHNEE, (steil ? 0.16 : 0.26) * k); g.fillRect(x, y, w, h);
    rausch(g, x, y, w, h, 1.7, (steil ? 0.38 : 0.6) * k, 21, true);
    /* in den Deckreihen liegen Reste: weich, unregelmäßig, oben seltener */
    if (F.px * reihe > 6) {
      for (let yy = Math.floor(y / reihe) * reihe; yy < y + h; yy += reihe) {
        const t = (yy - y) / h;
        let xx = x - rng() * 0.6;
        while (xx < x + w) {
          const l = 0.3 + rng() * (steil ? 0.5 : 1.2);
          if (rng() < 0.15 + 0.35 * t) {
            g.fillStyle = rgbS(SCHNEE, (0.12 + 0.22 * rng()) * k);
            g.beginPath(); g.ellipse(xx + l / 2, yy + reihe * 0.75, l / 2, reihe * (0.18 + 0.2 * rng()), 0, 0, 2 * Math.PI); g.fill();
          }
          xx += l + rng() * 0.35;
        }
      }
    }
    /* Wehe am Traufrand, schmaler Kamm am First */
    const tief = steil ? 0.3 : 0.7;
    const gr = g.createLinearGradient(0, y + h, 0, y + h - tief);
    gr.addColorStop(0, rgbS(SCHNEE, 0.95 * k)); gr.addColorStop(0.4, rgbS(SCHNEE, 0.6 * k)); gr.addColorStop(1, rgbS(SCHNEE, 0));
    g.fillStyle = gr; g.fillRect(x, y + h - tief, w, tief);
    g.fillStyle = rgbS(SCHNEE, 0.85 * k); g.fillRect(x, y, w, steil ? 0.03 : 0.07);
    g.restore();
  }
  function schneeFlach(g, F, x, y, w, h, k) {
    if (k <= 0) return;
    g.fillStyle = rgbS(SCHNEE, Math.min(1, 0.4 + 0.6 * k)); g.fillRect(x, y, w, h);
    rausch(g, x, y, w, h, 2.2, 0.06, 9);
    if (F.px > 26) { const rng = ST.zufall(5); g.fillStyle = "rgba(255,255,255,0.9)"; for (let i = 0; i < w * h * 4; i++) { const r = (0.6 + rng()) / F.px; g.fillRect(x + rng() * w, y + rng() * h, r, r); } }
  }

  /* ---------------- Fenster ---------------- */
  function bogenPfad(g, x, zU, w, h) {
    const r = w / 2, zk = zU + h - r;
    g.moveTo(x, -zU); g.lineTo(x, -zk); g.arc(x + r, -zk, r, Math.PI, 2 * Math.PI); g.lineTo(x + w, -zU); g.closePath();
  }
  function glas(g, F, x, zU, w, h, offen) {
    if (offen) { g.fillStyle = "rgb(34,30,28)"; g.beginPath(); bogenPfad(g, x, zU, w, h); g.fill(); return; }
    const gr = g.createLinearGradient(0, -zU - h, 0, -zU);
    gr.addColorStop(0, "rgb(128,146,166)"); gr.addColorStop(0.45, "rgb(62,74,90)"); gr.addColorStop(1, "rgb(38,44,54)");
    g.fillStyle = gr; g.beginPath(); bogenPfad(g, x, zU, w, h); g.fill();
    if (F.px * w > 9) {
      /* Bleisprossen: feines Rautennetz wie am Original */
      g.save(); g.beginPath(); bogenPfad(g, x, zU, w, h); g.clip();
      g.strokeStyle = "rgba(20,22,26,0.5)"; g.lineWidth = Math.max(0.004, 0.7 / F.px);
      g.beginPath(); g.moveTo(x + w / 2, -zU); g.lineTo(x + w / 2, -zU - h); g.moveTo(x, -zU - h * 0.55); g.lineTo(x + w, -zU - h * 0.55); g.stroke();
      g.restore();
    }
  }
  /* Rundbogenfenster: n Lichter mit Säulchen unter einem Überfangbogen
     (Biforium n=2, Triforium n=3), Kalksteingewände, Laibungsschatten,
     Sohlbank; Schnee auf der Bank im Winter */
  function fenster(g, F, I, f, W) {
    const { x, z, w, h } = f, n = f.n || 1, rahmen = f.rahmen == null ? 0.07 : f.rahmen;
    const offen = !W.Z.verglast;
    const klein = F.px * w < 7;
    /* Gewände */
    g.fillStyle = rgbS(f.gewaende || KALK_H);
    g.beginPath(); bogenPfad(g, x - rahmen, z - 0.02, w + 2 * rahmen, h + rahmen + 0.02); g.fill();
    if (!klein && F.px * rahmen > 2.5) { g.strokeStyle = "rgba(90,86,76,0.35)"; g.lineWidth = Math.max(0.005, 0.8 / F.px); g.beginPath(); bogenPfad(g, x - rahmen, z - 0.02, w + 2 * rahmen, h + rahmen + 0.02); g.stroke(); }
    /* Öffnung (Laibung im Schatten) */
    g.fillStyle = "rgb(88,84,78)"; g.beginPath(); bogenPfad(g, x, z, w, h); g.fill();
    if (klein) { glas(g, F, x + w * 0.1, z + 0.02, w * 0.8, h * 0.94, offen); }
    else {
      const s = 0.045, lw = (w - (n - 1) * s - 0.06) / n, hl = n > 1 ? h - w / 2 * 0.55 : h - 0.03;
      for (let i = 0; i < n; i++) glas(g, F, x + 0.03 + i * (lw + s), z + 0.02, lw, hl, offen);
      if (n > 1) {
        /* Säulchen mit Kapitell */
        g.fillStyle = rgbS(KALK_H);
        for (let i = 1; i < n; i++) { const sx = x + 0.03 + i * (lw + s) - s; g.fillRect(sx + s * 0.2, -z - hl + lw / 2, s * 0.6, hl - lw / 2); g.fillRect(sx - 0.005, -z - hl + lw / 2 - 0.03, s + 0.01, 0.035); }
        /* Tympanon mit kleinem Rundfenster */
        if (F.px * w > 16) { g.fillStyle = "rgb(58,62,70)"; g.beginPath(); g.arc(x + w / 2, -z - h + w * 0.3, w * 0.09, 0, 2 * Math.PI); g.fill(); }
      }
      /* Schatten der Laibung (Tiefe 0,12 m) */
      const sv = F.schatten(0.12);
      if (sv) {
        g.save(); g.beginPath(); bogenPfad(g, x, z, w, h); g.clip();
        g.fillStyle = "rgba(20,24,34,0.42)";
        g.beginPath(); bogenPfad(g, x, z, w, h); g.rect(x + sv[0] + w * 2, -z - h - 1 + sv[1], -w * 2 - 0.001, 0); g.fill();
        g.beginPath(); g.rect(x - 1, -z - h - 1, 1 + Math.max(0, -sv[0]), h + 2); g.rect(x + w + Math.min(0, -sv[0]), -z - h - 1, 1, h + 2); g.rect(x - 1, -z - h - 1, w + 2, 1 + Math.max(0, sv[1]) ); g.fill();
        g.restore();
      }
    }
    /* Sohlbank */
    g.fillStyle = rgbS(KALK_H); g.fillRect(x - rahmen - 0.03, -z, w + 2 * rahmen + 0.06, 0.05);
    const sb = F.schatten(0.06);
    if (sb) { g.fillStyle = "rgba(40,40,50,0.25)"; g.fillRect(x - rahmen - 0.03 + sb[0], -z + 0.05, w + 2 * rahmen + 0.06, Math.max(0.02, sb[1])); }
    if (W.winter && W.Z.schnee > 0) { g.fillStyle = rgbS(SCHNEE, W.Z.schnee); g.fillRect(x - rahmen - 0.03, -z - 0.035, w + 2 * rahmen + 0.06, 0.04); g.beginPath(); g.arc(x + w / 2, -z - h - rahmen + 0.01, w / 2 + rahmen, 1.15 * Math.PI, 1.85 * Math.PI); g.lineWidth = 0.025; g.strokeStyle = rgbS(SCHNEE, 0.8 * W.Z.schnee); g.stroke(); }
  }
  function fensterLicht(g, F, I, f, W, farbe) {
    const { x, z, w, h } = f;
    const gr = g.createLinearGradient(0, -z - h, 0, -z);
    gr.addColorStop(0, "rgba(255,214,140," + (0.95 * F.nacht).toFixed(3) + ")"); gr.addColorStop(1, "rgba(255,168,84," + (0.95 * F.nacht).toFixed(3) + ")");
    g.fillStyle = gr; g.beginPath(); bogenPfad(g, x + 0.03, z + 0.02, w - 0.06, h - 0.05); g.fill();
    if ((f.n || 1) > 1 && F.px * w > 7) { g.fillStyle = "rgba(120,90,60,0.8)"; const s = 0.045, lw = (w - (f.n - 1) * s - 0.06) / f.n; for (let i = 1; i < f.n; i++) g.fillRect(x + 0.03 + i * (lw + s) - s * 0.8, -z - h, s * 0.6, h); }
    I.lp(F, x + w / 2, z + h / 2, Math.max(0.6, w * 1.6), farbe || "255,190,110", 0.5);
  }
  /* Sängersaal-Arkaden: tiefe Loggia, Gruppen zu drei Bögen auf
     schlanken Säulchen, unten eine Brüstung mit Maßwerk */
  function arkade(g, F, I, a, W) {
    const { x, z, w, h } = a, gruppen = a.gruppen || 4, jeGruppe = 3;
    const pf = 0.16, gw = (w - (gruppen + 1) * pf) / gruppen;
    for (let i = 0; i < gruppen; i++) {
      const gx = x + pf + i * (gw + pf);
      /* Rahmen der Gruppe */
      g.fillStyle = rgbS(KALK_H); g.beginPath(); bogenPfad(g, gx - 0.06, z - 0.02, gw + 0.12, h + 0.08); g.fill();
      /* Tiefe der Loggia: dunkel, warmes Innenlicht am Tag nur als Ahnung */
      g.fillStyle = "rgb(70,62,56)"; g.beginPath(); bogenPfad(g, gx, z, gw, h); g.fill();
      if (F.px * gw > 10) {
        const s = 0.035, lw = (gw - (jeGruppe - 1) * s) / jeGruppe;
        /* innere Fenster (verglaste Rückwand) */
        for (let j = 0; j < jeGruppe; j++) { g.fillStyle = W.Z.verglast ? "rgb(56,62,74)" : "rgb(34,30,28)"; g.beginPath(); bogenPfad(g, gx + j * (lw + s) + lw * 0.2, z + 0.25, lw * 0.6, h * 0.62); g.fill(); }
        g.fillStyle = rgbS(KALK_H);
        for (let j = 1; j < jeGruppe; j++) { const sx = gx + j * (lw + s) - s; g.fillRect(sx, -z - h + lw * 0.55, s, h - lw * 0.55); }
        g.strokeStyle = rgbS(KALK_H); g.lineWidth = s * 0.8;
        for (let j = 0; j < jeGruppe; j++) { g.beginPath(); g.arc(gx + j * (lw + s) + lw / 2, -z - h + lw / 2 + 0.06, lw / 2, Math.PI, 2 * Math.PI); g.stroke(); }
        /* Brüstung */
        g.fillStyle = rgbS(KALK); g.fillRect(gx, -z - 0.3, gw, 0.3);
        if (F.px > 30) { g.strokeStyle = "rgba(90,86,76,0.5)"; g.lineWidth = 0.8 / F.px; for (let t = gx + 0.05; t < gx + gw - 0.05; t += 0.1) { g.beginPath(); g.arc(t + 0.05, -z - 0.15, 0.04, 0, 2 * Math.PI); g.stroke(); } }
        const sv = F.schatten(0.4);
        if (sv) { g.save(); g.beginPath(); bogenPfad(g, gx, z + 0.3, gw, h - 0.3); g.clip(); g.fillStyle = "rgba(10,12,20,0.35)"; g.fillRect(gx - 1, -z - h - 1, gw + 2, 1 + Math.max(0.05, sv[1])); g.fillRect(gx - 1, -z - h - 1, 1 + Math.max(0, sv[0]), h + 2); g.restore(); }
      }
      if (W.winter && W.Z.schnee > 0) { g.fillStyle = rgbS(SCHNEE, W.Z.schnee); g.fillRect(gx - 0.06, -z - 0.33, gw + 0.12, 0.04); }
    }
  }
  function arkadeLicht(g, F, I, a) {
    const { x, z, w, h } = a, gruppen = a.gruppen || 4, pf = 0.16, gw = (w - (gruppen + 1) * pf) / gruppen;
    for (let i = 0; i < gruppen; i++) {
      const gx = x + pf + i * (gw + pf);
      const gr = g.createLinearGradient(0, -z - h, 0, -z);
      gr.addColorStop(0, "rgba(255,206,120," + (0.8 * F.nacht).toFixed(3) + ")"); gr.addColorStop(1, "rgba(255,160,70," + (0.9 * F.nacht).toFixed(3) + ")");
      g.fillStyle = gr; g.beginPath(); bogenPfad(g, gx + 0.03, z + 0.3, gw - 0.06, h - 0.34); g.fill();
      I.lp(F, gx + gw / 2, z + h / 2, 1.4, "255,190,110", 0.55);
    }
  }
  /* Rundbogenfries unter einem Gesims */
  function bogenfries(g, F, x0, x1, z, farbe) {
    const b = 0.16, hh = 0.12;
    g.fillStyle = rgbS(farbe || KALK_H); g.fillRect(x0, -z, x1 - x0, 0.07);
    if (F.px * b < 4) { g.fillStyle = "rgba(60,56,50,0.25)"; g.fillRect(x0, -z + 0.07, x1 - x0, 0.04); return; }
    g.strokeStyle = rgbS(farbe || KALK_H); g.lineWidth = 0.025;
    g.fillStyle = "rgba(50,48,46,0.22)";
    for (let t = x0; t < x1 - 0.02; t += b) {
      g.beginPath(); g.arc(t + b / 2, -z + 0.07 + hh - b / 2, b / 2 - 0.015, Math.PI, 2 * Math.PI); g.lineTo(t + b - 0.015, -z + 0.07 + hh); g.lineTo(t + 0.015, -z + 0.07 + hh); g.closePath(); g.fill();
      g.beginPath(); g.arc(t + b / 2, -z + 0.07 + hh - b / 2, b / 2 - 0.015, Math.PI, 2 * Math.PI); g.stroke();
      g.fillStyle = rgbS(farbe || KALK_H); g.fillRect(t - 0.012, -z + 0.07, 0.024, hh + 0.02); g.fillStyle = "rgba(50,48,46,0.22)";
    }
  }
  /* Gesimsband (Kalkstein) mit Schatten darunter und Schnee darauf */
  function gesims(g, F, I, x0, x1, z, h, W, farbe) {
    g.fillStyle = rgbS(farbe || KALK_H); g.fillRect(x0, -z - h, x1 - x0, h);
    const sv = F.schatten(0.08);
    g.fillStyle = "rgba(40,40,50," + (sv ? 0.28 : 0.12) + ")"; g.fillRect(x0, -z, x1 - x0, sv ? Math.max(0.03, sv[1]) : 0.03);
    if (W.winter && W.Z.schnee > 0) { g.fillStyle = rgbS(SCHNEE, 0.95 * W.Z.schnee); g.fillRect(x0, -z - h - 0.03, x1 - x0, 0.045); }
  }

  /* =====================================================================
     HAUPTMASSE
     ===================================================================== */
  const ZP = 1.5;                        // Felsplateau
  const PA = { x0: -12.4, x1: -6.6, y0: -5.2, y1: 4.6, zt: ZP + 11, zf: ZP + 15.6 };   // Palas
  const TT = { x: -5.35, y: -5.0, r: 1.2, zk: ZP + 16.6, zh: ZP + 17.5, spitze: ZP + 22.6 };   // Treppenturm
  const RH = { x0: -4.1, x1: 3.2, y0: -6.0, y1: -3.4, zt: ZP + 8, zf: ZP + 9.7 };        // Ritterhaus
  const VT = { x0: 3.2, x1: 6.0, y0: -6.5, y1: -3.6, zt: ZP + 12.4 };                     // Viereckturm
  const KE = { x0: -6.6, x1: 1.5, x2: 1.9, y0: 2.0, y1: 4.8, zt: ZP + 7.5, zf: ZP + 9.4 };  // Kemenate
  const TB = { x0: 7.4, x1: 12.4, y0: -4.6, y1: 3.8, zt: ZP + 6.2 };                      // Torbau
  const TE = { x0: 11.3, x1: 12.9, h: ZP + 8.2 };                                          // Torbau-Ecktürme
  const GESCHOSS = [0, 2.2, 4.4, 6.6, 8.6];     // Geschosse des Palas (über dem Plateau)

  /* =====================================================================
     BAUPHASEN
     ===================================================================== */
  function zustand(bau) {
    const f = (a, b) => klemm((bau - a) / (b - a), 0, 1);
    const Z = { bau: bau, fertig: bau >= 0.999 };
    Z.sprengen = f(0, 0.06); Z.fundament = f(0.05, 0.12);
    Z.torbau = f(0.12, 0.26); Z.torbauOben = f(0.26, 0.32);
    Z.ring = f(0.3, 0.4);
    Z.palas = f(0.3, 0.56); Z.palasDach = f(0.56, 0.64);
    Z.turm = f(0.48, 0.72); Z.turmHelm = f(0.72, 0.8);
    Z.ritter = f(0.58, 0.74); Z.viereck = f(0.6, 0.8); Z.kemenate = f(0.64, 0.8); Z.nebenDach = f(0.78, 0.86);
    Z.eck = f(0.8, 0.88); Z.eckHelm = f(0.86, 0.92);
    Z.verglast = bau >= 0.92; Z.gold = bau >= 0.95;
    Z.schnee = Z.fertig ? 1 : f(0.9, 0.98);
    return Z;
  }

  /* =====================================================================
     MALER DER BAUTEILE
     ===================================================================== */
  /* Wand eines Bauteils: Werkstoff, Fenster, Gesimse. Die Fensterliste
     liegt in Wandkoordinaten (x ab linker Kante von außen, z absolut). */
  function wandMaler(W, spec) {
    return {
      ao: spec.ao !== false, flut: spec.flut == null ? 1 : spec.flut,
      malen(g, F, I) {
        const y0 = I.B0 - 0.05, h = F.h + 0.1;
        if (spec.stoff === "ziegel") backstein(g, F, -0.05, y0, F.w + 0.1, h, spec.saat || 2);
        else kalk(g, F, I, -0.05, y0, F.w + 0.1, h, { saat: spec.saat || 5 });
        /* im Bau: oben noch der rohe Backsteinkern, die Verkleidung folgt */
        if (spec.roh != null && spec.stoff !== "ziegel") { const zr = spec.roh; g.save(); g.beginPath(); g.rect(-0.05, -zr - 20, F.w + 0.1, 20); g.clip(); backstein(g, F, -0.05, -zr - 20, F.w + 0.1, 20, 7); g.restore(); g.fillStyle = "rgba(60,50,40,0.35)"; g.fillRect(-0.05, -zr, F.w + 0.1, 0.03); }
        if (spec.ecken && F.px > 10) {
          /* Eckquader: abwechselnd lang und kurz */
          g.fillStyle = rgbS(spec.stoff === "ziegel" ? KALK_H : hellF(KALK, 0.25));
          for (let zz = I.zmin; zz < I.zmax - 0.2; zz += 0.5) { const l = (Math.round(zz * 2) & 1) ? 0.4 : 0.25; g.fillRect(0, -zz - 0.24, l, 0.24); g.fillRect(F.w - l, -zz - 0.24, l, 0.24); }
        }
        for (const b of spec.baender || []) if (b.z < (spec.roh == null ? 99 : spec.roh)) gesims(g, F, I, -0.05, F.w + 0.05, b.z, b.h || 0.1, W, b.farbe);
        if (spec.fries != null && (spec.roh == null || spec.fries < spec.roh)) bogenfries(g, F, 0, F.w, spec.fries, spec.stoff === "ziegel" ? KALK_H : null);
        for (const f of spec.fenster || []) if (spec.roh == null || f.z + f.h < spec.roh) {
          if (f.art === "arkade") arkade(g, F, I, f, W);
          else if (f.art === "tor") tor(g, F, I, f, W);
          else if (f.art === "rechteck") fensterEckig(g, F, I, f, W);
          else if (f.art === "balkontuer") fenster(g, F, I, f, W);
          else fenster(g, F, I, f, W);
        }
        if (spec.extra) spec.extra(g, F, I);
      },
      leuchten: spec.fenster && spec.fenster.length ? function (g, F, I) {
        if (!W.Z.verglast || !W.Z.fertig) return;
        for (const f of spec.fenster) {
          if (f.art === "arkade") { arkadeLicht(g, F, I, f); continue; }
          if (f.art === "tor") { torLicht(g, F, I, f); continue; }
          if (hash(Math.round(f.x * 10), Math.round(f.z * 10), W.saat + (spec.saat || 0)) < (f.licht == null ? 0.3 : f.licht)) {
            if (f.art === "rechteck") fensterEckigLicht(g, F, I, f); else fensterLicht(g, F, I, f, W);
          }
        }
      } : null
    };
  }
  /* Rechteckfenster mit Kalksteinrahmen und Steinkreuz (Torbau) */
  function fensterEckig(g, F, I, f, W) {
    const { x, z, w, h } = f, r = 0.07;
    g.fillStyle = rgbS(KALK_H); g.fillRect(x - r, -z - h - r, w + 2 * r, h + 2 * r);
    const gr = g.createLinearGradient(0, -z - h, 0, -z);
    if (W.Z.verglast) { gr.addColorStop(0, "rgb(120,138,158)"); gr.addColorStop(0.5, "rgb(58,68,84)"); gr.addColorStop(1, "rgb(40,46,56)"); } else { gr.addColorStop(0, "rgb(36,32,30)"); gr.addColorStop(1, "rgb(36,32,30)"); }
    g.fillStyle = gr; g.fillRect(x, -z - h, w, h);
    if (F.px * w > 8) { g.fillStyle = rgbS(KALK_H); g.fillRect(x + w / 2 - 0.02, -z - h, 0.04, h); g.fillRect(x, -z - h * 0.66, w, 0.04); }
    const sv = F.schatten(0.1);
    if (sv) { g.fillStyle = "rgba(20,24,34,0.4)"; g.fillRect(x, -z - h, w, Math.max(0.02, sv[1])); g.fillRect(x, -z - h, Math.max(0.02, sv[0]), h); }
    if (W.winter && W.Z.schnee > 0) { g.fillStyle = rgbS(SCHNEE, W.Z.schnee); g.fillRect(x - r - 0.02, -z - 0.03, w + 2 * r + 0.04, 0.04); }
  }
  function fensterEckigLicht(g, F, I, f) {
    const { x, z, w, h } = f;
    g.fillStyle = "rgba(255,196,118," + (0.9 * F.nacht).toFixed(3) + ")"; g.fillRect(x + 0.01, -z - h + 0.01, w - 0.02, h - 0.02);
    if (F.px * w > 8) { g.fillStyle = "rgba(150,110,70,0.9)"; g.fillRect(x + w / 2 - 0.02, -z - h, 0.04, h); g.fillRect(x, -z - h * 0.66, w, 0.04); }
    I.lp(F, x + w / 2, z + h / 2, 0.9, "255,190,110", 0.45);
  }
  /* Tor des Torbaus: Rundbogen mit Keilsteinen, Tordurchfahrt, offene
     Eichentorflügel, darüber das bayerische Rautenwappen */
  function tor(g, F, I, f, W) {
    const { x, z, w, h } = f;
    g.fillStyle = rgbS(KALK_H); g.beginPath(); bogenPfad(g, x - 0.16, z, w + 0.32, h + 0.16); g.fill();
    if (F.px > 16) {
      g.strokeStyle = "rgba(90,86,76,0.5)"; g.lineWidth = 0.9 / F.px;
      const cx = x + w / 2, cz = z + h - w / 2;
      for (let i = 0; i <= 12; i++) { const a = Math.PI + i * Math.PI / 12; g.beginPath(); g.moveTo(cx + Math.cos(a) * w / 2, -cz + Math.sin(a) * w / 2); g.lineTo(cx + Math.cos(a) * (w / 2 + 0.16), -cz + Math.sin(a) * (w / 2 + 0.16)); g.stroke(); }
    }
    const gr = g.createLinearGradient(0, -z - h, 0, -z);
    gr.addColorStop(0, "rgb(28,24,22)"); gr.addColorStop(1, "rgb(64,58,50)");
    g.fillStyle = gr; g.beginPath(); bogenPfad(g, x, z, w, h); g.fill();
    /* Blick durch die Durchfahrt in den hellen Hof */
    g.fillStyle = "rgba(190,186,176,0.55)"; g.beginPath(); bogenPfad(g, x + w * 0.3, z, w * 0.4, h * 0.6); g.fill();
    /* offene Torflügel an der Laibung */
    g.fillStyle = "rgb(92,62,40)"; g.fillRect(x + 0.02, -z - h + w / 2, w * 0.14, h - w / 2); g.fillRect(x + w - w * 0.16, -z - h + w / 2, w * 0.14, h - w / 2);
    if (F.px > 20) { g.fillStyle = "rgba(20,14,10,0.6)"; for (let t = 0; t < 3; t++) { g.fillRect(x + 0.02, -z - 0.3 - t * 0.55, w * 0.14, 0.03); g.fillRect(x + w - w * 0.16, -z - 0.3 - t * 0.55, w * 0.14, 0.03); } }
    /* Wappen: blau-weiße Rauten */
    const wx = x + w / 2, wz = z + h + 0.55, ww = 0.36, wh = 0.44;
    g.save(); g.beginPath(); g.moveTo(wx - ww / 2, -wz); g.lineTo(wx + ww / 2, -wz); g.lineTo(wx + ww / 2, -wz + wh * 0.55); g.quadraticCurveTo(wx + ww / 2, -wz + wh, wx, -wz + wh); g.quadraticCurveTo(wx - ww / 2, -wz + wh, wx - ww / 2, -wz + wh * 0.55); g.closePath();
    g.fillStyle = "rgb(238,240,244)"; g.fill(); g.clip();
    if (F.px * ww > 6) { g.fillStyle = "rgb(40,110,190)"; const d = ww / 4; for (let i = -4; i < 6; i++) for (let j = -2; j < 5; j++) if (((i + j) & 1) === 0) { const cx = wx - ww / 2 + i * d / 2 + d / 4, cy = -wz + j * d * 0.9; g.beginPath(); g.moveTo(cx, cy - d * 0.45); g.lineTo(cx + d / 2, cy); g.lineTo(cx, cy + d * 0.45); g.lineTo(cx - d / 2, cy); g.closePath(); g.fill(); } }
    else { g.fillStyle = "rgba(60,120,190,0.6)"; g.fillRect(wx - ww / 2, -wz, ww, wh); }
    g.restore();
    g.strokeStyle = rgbS(GOLD); g.lineWidth = 0.02; g.beginPath(); g.moveTo(wx - ww / 2, -wz); g.lineTo(wx + ww / 2, -wz); g.stroke();
  }
  function torLicht(g, F, I, f) {
    const { x, z, w, h } = f;
    g.fillStyle = "rgba(255,190,110," + (0.5 * F.nacht).toFixed(3) + ")"; g.beginPath(); bogenPfad(g, x + w * 0.2, z, w * 0.6, h * 0.8); g.fill();
    I.lp(F, x + w / 2, z + h * 0.5, 1.6, "255,190,110", 0.6);
  }

  /* Schieferdach mit Traufschnee; deck = Anteil gedeckt (von der Traufe her) */
  function dachMaler(W, opt) {
    opt = opt || {};
    return {
      flut: 0.45,
      malen(g, F, I) {
        const x = -0.05, y = I.B0 - 0.05, w = F.w + 0.1, h = F.h + 0.1;
        const deck = opt.deck == null ? 1 : opt.deck;
        schiefer(g, F, x, y, w, h, { saat: opt.saat || 4 });
        if (deck < 1) {
          /* Schalung mit Sparren über dem schon gedeckten Teil */
          const yd = y + h * (1 - deck);
          g.fillStyle = rgbS(HOLZ); g.fillRect(x, y, w, yd - y);
          rausch(g, x, y, w, yd - y, 2, 0.2, 6);
          g.strokeStyle = "rgba(80,56,34,0.6)"; g.lineWidth = Math.max(0.01, 1 / F.px); g.beginPath();
          for (let yy = y; yy < yd; yy += 0.12) { g.moveTo(x, yy); g.lineTo(x + w, yy); } g.stroke();
          g.fillStyle = "rgba(30,26,24,0.4)"; g.fillRect(x, yd - 0.03, w, 0.04);
        }
        /* Grat- und Firstbleche */
        g.fillStyle = "rgba(140,150,160,0.5)"; g.fillRect(x, I.B0, w, 0.05);
        if (W.winter && deck >= 1) schneeSteil(g, F, x, y, w, h, W.Z.schnee, opt.steil);
      }
    };
  }
  /* Giebeldreieck des Dachprismas: Wand mit Ortgang (Schieferkante) */
  function giebelMaler(W, spec) {
    const m = wandMaler(W, spec);
    const alt = m.malen;
    m.ao = false;
    m.malen = function (g, F, I) {
      alt(g, F, I);
      /* Ortgang: Schieferkante entlang der beiden Schrägen */
      const pts = I.fl.pts.map((p) => [dot(p, I.u) - I.A0, dot(p, I.v)]);
      let top = pts[0]; for (const p of pts) if (p[1] < top[1]) top = p;
      const base = pts.filter((p) => p !== top);
      g.strokeStyle = rgbS(SCHIEFER_D); g.lineWidth = 0.3; g.lineJoin = "round";
      g.beginPath(); for (const b of base) { g.moveTo(top[0], top[1]); g.lineTo(b[0], b[1]); } g.stroke();
      if (W.winter && W.Z.schnee > 0) { g.strokeStyle = rgbS(SCHNEE, 0.85 * W.Z.schnee); g.lineWidth = 0.05; g.beginPath(); for (const b of base) { g.moveTo(top[0], top[1] - 0.08); g.lineTo(b[0], b[1] - 0.08); } g.stroke(); }
    };
    return m;
  }
  function steinOben(W, farbe) {
    return { malen(g, F, I) { g.fillStyle = rgbS(farbe || KALK); g.fillRect(-0.1, I.B0 - 0.1, F.w + 0.2, F.h + 0.2); rausch(g, -0.1, I.B0 - 0.1, F.w + 0.2, F.h + 0.2, 2, 0.15, 3); if (W.winter) schneeFlach(g, F, -0.1, I.B0 - 0.1, F.w + 0.2, F.h + 0.2, W.Z.schnee); } };
  }
  function rohOben(W) {
    return { malen(g, F, I) { backstein(g, F, -0.1, I.B0 - 0.1, F.w + 0.2, F.h + 0.2, 9); g.fillStyle = "rgba(210,200,186,0.35)"; g.fillRect(-0.1, I.B0 - 0.1, F.w + 0.2, F.h + 0.2); } };
  }

  /* Turmfacetten (rund): Kalkstein, Fenster auf bestimmten Seiten,
     Bogenfries unter dem Kranz, Schlitzfenster am Treppenlauf */
  function turmMaler(W, spec) {
    const h = Math.PI / spec.n;
    return function (fl) {
      const s = seite(fl.n);
      if (s === "oben") return spec.oben ? spec.oben : steinOben(W);
      if (s === "unten") return null;
      const phi = Math.atan2(fl.n[1], fl.n[0]);
      return {
        rund: h, flut: 1,
        malen(g, F, I) {
          const y0 = I.B0 - 0.05, hh = F.h + 0.1;
          if (spec.stoff === "ziegel") backstein(g, F, -0.05, y0, F.w + 0.1, hh, 3); else kalk(g, F, I, -0.05, y0, F.w + 0.1, hh, { saat: spec.saat || 6, schlieren: F.w > 0.3 });
          if (spec.roh != null) { g.save(); g.beginPath(); g.rect(-0.05, -spec.roh - 20, F.w + 0.1, 20); g.clip(); backstein(g, F, -0.05, -spec.roh - 20, F.w + 0.1, 20, 7); g.restore(); }
          for (const b of spec.baender || []) if (spec.roh == null || b.z < spec.roh) gesims(g, F, I, -0.05, F.w + 0.05, b.z, b.h || 0.08, W);
          if (spec.fries != null && (spec.roh == null || spec.fries < spec.roh)) bogenfries(g, F, -0.02, F.w + 0.02, spec.fries);
          for (const f of spec.fenster || []) {
            if (spec.roh != null && f.z + f.h > spec.roh) continue;
            if (f.phi != null) { let d = Math.abs(((phi - f.phi) % (2 * Math.PI) + 3 * Math.PI) % (2 * Math.PI) - Math.PI); if (d > h * 1.01) continue; }
            else if (f.jede && (Math.round((phi + Math.PI) / (2 * h)) % f.jede) !== 0) continue;
            fenster(g, F, I, { x: F.w / 2 - f.w / 2, z: f.z, w: f.w, h: f.h, n: f.n, rahmen: 0.05 }, W);
          }
        },
        leuchten(g, F, I) {
          if (!W.Z.fertig) return;
          for (const f of spec.fenster || []) {
            if (f.phi != null) { let d = Math.abs(((phi - f.phi) % (2 * Math.PI) + 3 * Math.PI) % (2 * Math.PI) - Math.PI); if (d > h * 1.01) continue; }
            else if (f.jede && (Math.round((phi + Math.PI) / (2 * h)) % f.jede) !== 0) continue;
            if (hash(Math.round(phi * 10), Math.round(f.z * 10), W.saat) < (f.licht == null ? 0.3 : f.licht)) fensterLicht(g, F, I, { x: F.w / 2 - f.w / 2, z: f.z, w: f.w, h: f.h, n: f.n }, W);
          }
        }
      };
    };
  }
  /* Kegelhelm aus Schiefer, Facetten weich schattiert */
  function helmMaler(W, n, opt) {
    const h = Math.PI / n;
    return function (fl) {
      if (seite(fl.n) === "unten") return null;
      return {
        rund: h, flut: 0.35,
        malen(g, F, I) {
          const x = -0.05, y = I.B0 - 0.05, w = F.w + 0.1, hh = F.h + 0.1;
          schiefer(g, F, x, y, w, hh, { reihe: 0.06, saat: 8 });
          if (opt && opt.deck != null && opt.deck < 1) { const yd = y + hh * (1 - opt.deck); g.fillStyle = rgbS(HOLZ); g.fillRect(x, y, w, yd - y); g.strokeStyle = "rgba(80,56,34,0.6)"; g.lineWidth = 1 / F.px; g.beginPath(); for (let yy = y; yy < yd; yy += 0.12) { g.moveTo(x, yy); g.lineTo(x + w, yy); } g.stroke(); }
          /* Traufblech unten */
          g.fillStyle = "rgba(150,160,170,0.6)"; g.fillRect(x, y + hh - 0.1, w, 0.06);
          if (W.winter && (!opt || opt.deck == null || opt.deck >= 1)) schneeSteil(g, F, x, y, w, hh, W.Z.schnee * 0.8, true);
        }
      };
    };
  }

  /* =====================================================================
     FELS UND HOF
     ===================================================================== */
  function felsMaler(W) {
    return function (fl) {
      const s = seite(fl.n);
      if (s === "unten") return null;
      if (s === "oben") return { malen: plateauMalen(W) };
      return {
        ao: true,
        malen(g, F, I) {
          const x = -0.1, y = I.B0 - 0.1, w = F.w + 0.2, h = F.h + 0.2;
          g.fillStyle = rgbS(FELS); g.fillRect(x, y, w, h);
          rausch(g, x, y, w, h, 4.5, 0.45, 12);
          if (F.px > 20) { rausch(g, x, y, w, h, 1.2, 0.3, 13); rausch(g, x, y, w, h, 2.8, 0.25, 12, true); }
          const rng = ST.zufall(ST.textHash(I.K.name + fl.n.join()) + 5);
          /* Felsrippen: jede hat eine Licht- und eine Schattenseite, der
             Fels ist so nicht glatt, sondern schrundig */
          for (let i = 0; i < w * 1.6; i++) {
            const bx = x + rng() * w, b0 = I.B0 + rng() * F.h * 0.4, l = F.h * (0.4 + rng() * 0.7), br = 0.12 + rng() * 0.3;
            g.fillStyle = "rgba(235,230,218," + (0.12 + rng() * 0.12).toFixed(3) + ")";
            g.beginPath(); g.moveTo(bx, b0); g.lineTo(bx - br, b0 + l * 0.5); g.lineTo(bx - br * 0.4, b0 + l); g.lineTo(bx, b0 + l * 0.7); g.closePath(); g.fill();
            g.fillStyle = "rgba(40,36,30," + (0.18 + rng() * 0.18).toFixed(3) + ")";
            g.beginPath(); g.moveTo(bx, b0); g.lineTo(bx + br * 0.8, b0 + l * 0.45); g.lineTo(bx + br * 0.3, b0 + l); g.lineTo(bx, b0 + l * 0.7); g.closePath(); g.fill();
          }
          /* Schichtbänke: Stücke, nicht durchgehend */
          for (let yy = I.B0 + 0.15; yy < I.B0 + F.h; yy += 0.25 + rng() * 0.35) {
            let xx = x + rng() * 1.5;
            while (xx < x + w) {
              const l = 0.6 + rng() * 2.2;
              g.beginPath(); g.moveTo(xx, yy);
              for (let t = 0.25; t <= l; t += 0.25) g.lineTo(xx + t, yy + (ST.fbm((xx + t) * 0.9, yy * 3, 2, 7) - 0.5) * 0.2);
              g.strokeStyle = "rgba(50,46,40,0.5)"; g.lineWidth = Math.max(0.02, 1.2 / F.px); g.stroke();
              g.save(); g.translate(0, -0.035); g.strokeStyle = "rgba(235,230,220,0.3)"; g.lineWidth = Math.max(0.015, 0.9 / F.px); g.stroke();
              if (W.winter && W.Z.schnee > 0 && rng() < 0.45) { g.translate(0, -0.02); g.strokeStyle = rgbS(SCHNEE, (0.4 + 0.3 * rng()) * W.Z.schnee); g.lineWidth = 0.03 + rng() * 0.04; g.stroke(); }
              g.restore();
              xx += l + 0.4 + rng() * 1.5;
            }
          }
          if (W.winter && W.Z.schnee > 0) {
            g.fillStyle = rgbS(SCHNEE, 0.92 * W.Z.schnee); g.beginPath(); g.moveTo(x, I.B0 - 0.1);
            for (let t = x; t <= x + w + 0.2; t += 0.15) g.lineTo(t, I.B0 + 0.04 + rng() * 0.1);
            g.lineTo(x + w, I.B0 - 0.1); g.closePath(); g.fill();
            const gr = g.createLinearGradient(0, I.B0 + F.h, 0, I.B0 + F.h - 0.35);
            gr.addColorStop(0, rgbS(SCHNEE, 0.9)); gr.addColorStop(1, rgbS(SCHNEE, 0));
            g.fillStyle = gr; g.fillRect(x, I.B0 + F.h - 0.35, w, 0.45);
          }
          /* Bewuchs: Moos, Gras in den Fugen, oben eine Grasnarbe */
          if (!W.winter) {
            const gruen = W.jahr === "herbst" ? [[150, 96, 40], [120, 104, 44], [96, 90, 50]] : [[70, 92, 50], [56, 80, 44], [88, 104, 58]];
            /* Moospolster und Grasbüschel: viele kleine Tupfen, keine Kreise */
            for (let i = 0; i < w * 1.2; i++) {
              const bx = x + rng() * w, by = I.B0 + F.h * (0.1 + rng() * 0.85), r = 0.1 + rng() * 0.2;
              for (let k = 0; k < 9; k++) { const c = gruen[(rng() * 3) | 0], a = rng() * 2 * Math.PI, d = r * Math.sqrt(rng()); g.fillStyle = rgbS(hellF(c, (rng() - 0.4) * 0.3), 0.5 + 0.4 * rng()); g.beginPath(); g.ellipse(bx + Math.cos(a) * d * 1.5, by + Math.sin(a) * d * 0.6, 0.03 + rng() * 0.05, 0.02 + rng() * 0.03, 0, 0, 2 * Math.PI); g.fill(); }
            }
            const c = gruen[0]; g.fillStyle = rgbS(c, 0.9); g.beginPath(); g.moveTo(x, I.B0 - 0.1);
            for (let t = x; t <= x + w + 0.2; t += 0.2) g.lineTo(t, I.B0 + 0.05 + rng() * 0.12);
            g.lineTo(x + w, I.B0 - 0.1); g.closePath(); g.fill();
          }
        }
      };
    };
  }
  /* Plateau: im Hof Plattenpflaster, draußen Fels mit Gras; beim Bau
     gesprengter Fels mit Bohrlöchern und Baugruben */
  function inHof(x, y) { return (x > -6.6 && x < 7.4 && y > -3.4 && y < 2.0) || (x > 1.5 && x < 7.4 && y > -3.6 && y < 4.4) || (x > 12.4 && x < 13 && y > -1.6 && y < 0.8); }
  function plateauMalen(W) {
    return function (g, F, I) {
      const x0 = -0.1, y0 = I.B0 - 0.1, w = F.w + 0.2, h = F.h + 0.2, ax = I.A0;
      const Z = W.Z;
      /* Grund: Fels mit Gras (Sommer), braun (Herbst) */
      const wiese = W.jahr === "herbst" ? [132, 128, 84] : W.jahr === "fruehling" ? [104, 138, 72] : [96, 124, 70];
      g.fillStyle = rgbS(Z.fertig ? wiese : mischF(FELS, [128, 110, 88], 0.4)); g.fillRect(x0, y0, w, h);
      rausch(g, x0, y0, w, h, 3, 0.3, 14);
      if (Z.fertig) rausch(g, x0, y0, w, h, 1.1, 0.25, 15);
      /* Hofpflaster */
      g.save(); g.translate(-ax, 0);
      g.beginPath();
      g.rect(-6.6, -3.4, 14.0, 5.4); g.rect(1.5, 2.0, 5.9, 2.4); g.rect(12.4, -2.2, 0.8, 3.0);
      g.clip();
      g.fillStyle = rgbS(Z.sprengen < 1 ? FELS : [196, 190, 176]); g.fillRect(-7, -4, 21, 9);
      rausch(g, -7, -4, 21, 9, 2.5, 0.2, 15);
      if (F.px * 0.28 > 4 && Z.sprengen >= 1) {
        g.strokeStyle = "rgba(100,94,84,0.45)"; g.lineWidth = Math.max(0.01, 0.9 / F.px); g.beginPath();
        for (let yy = -4; yy < 5; yy += 0.28) { g.moveTo(-7, yy); g.lineTo(14, yy); }
        for (let yy = -4, j = 0; yy < 5; yy += 0.28, j++) for (let xx = -7 + (j & 1) * 0.2; xx < 14; xx += 0.4) { g.moveTo(xx, yy); g.lineTo(xx, yy + 0.28); }
        g.stroke();
      }
      g.restore();
      /* Baugruben und Bohrlöcher */
      if (!Z.fertig && Z.fundament < 1) {
        g.save(); g.translate(-ax, 0);
        const gruben = [[PA.x0, PA.y0, PA.x1, PA.y1], [TB.x0, TB.y0, TE.x1, TB.y1], [RH.x0, RH.y0, VT.x1, RH.y1], [KE.x0, KE.y0, KE.x2, KE.y1]];
        for (const [a, b, c, d] of gruben) {
          g.fillStyle = "rgba(70,62,52," + (0.5 * Z.sprengen).toFixed(3) + ")"; g.fillRect(a - 0.2, b - 0.2, c - a + 0.4, d - b + 0.4);
          g.strokeStyle = "rgba(230,230,230,0.7)"; g.lineWidth = 0.03; g.strokeRect(a - 0.3, b - 0.3, c - a + 0.6, d - b + 0.6);
        }
        if (F.px > 10) { const rng = ST.zufall(9); g.fillStyle = "rgba(30,26,22,0.6)"; for (let i = 0; i < 80; i++) { g.beginPath(); g.arc(-12 + rng() * 25, -6 + rng() * 11, 0.03, 0, 2 * Math.PI); g.fill(); } }
        g.restore();
      }
      if (W.winter) {
        const k = W.Z.schnee || (Z.fertig ? 1 : 0.6);
        schneeFlach(g, F, x0, y0, w, h, k);
        /* ausgetretene Wege im Hof */
        if (Z.fertig) {
          g.save(); g.translate(-ax, 0); g.strokeStyle = "rgba(170,182,205,0.45)"; g.lineCap = "round"; g.lineWidth = 0.5;
          g.beginPath(); g.moveTo(13.2, -0.4); g.lineTo(4.5, -0.4); g.quadraticCurveTo(-2, -0.3, -6.5, 0.2); g.moveTo(-4.4, -3.3); g.quadraticCurveTo(-3.5, -1.2, -2, -0.4); g.stroke(); g.restore();
        }
      }
    };
  }

  /* =====================================================================
     FIGUREN: vergoldete Knäufe mit Wetterfahne, Kamin
     ===================================================================== */
  function knauf(x, y, z, gr, fahne) {
    return {
      x: x, y: y, z: z, breite: 0.5 * gr, hoehe: 1.1 * gr, schatten: true,
      malen(g, s, F) {
        const K = ST.KZ * s, sch = F.schatten;
        const lf = sch ? null : ST.lichtFaktor([0, 0.5, 0.86], F.Z, F.nacht > 0.1 ? 0.25 * F.nacht : 0.1, F.jahr);
        const farbe = (c, k) => sch ? "#000" : rgbS([Math.min(255, c[0] * lf[0] * (k || 1)), Math.min(255, c[1] * lf[1] * (k || 1)), Math.min(255, c[2] * lf[2] * (k || 1))]);
        g.strokeStyle = farbe([70, 66, 60]); g.lineWidth = Math.max(0.8, 0.03 * gr * s);
        g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -1.05 * gr * K); g.stroke();
        const r = 0.09 * gr * s;
        if (sch) { g.fillStyle = "#000"; g.beginPath(); g.arc(0, -0.3 * gr * K, r, 0, 2 * Math.PI); g.fill(); }
        else {
          const gg = g.createRadialGradient(-r * 0.4, -0.3 * gr * K - r * 0.4, 0, 0, -0.3 * gr * K, r);
          gg.addColorStop(0, farbe([255, 240, 190], 1.3)); gg.addColorStop(0.5, farbe(GOLD)); gg.addColorStop(1, farbe([120, 84, 30]));
          g.fillStyle = gg; g.beginPath(); g.arc(0, -0.3 * gr * K, r, 0, 2 * Math.PI); g.fill();
        }
        if (fahne && s * gr > 14) {
          /* Wetterfahne */
          g.fillStyle = sch ? "#000" : farbe(GOLD, 0.9);
          const zz = -0.8 * gr * K, fw = 0.26 * gr * s * (0.5 + 0.5 * Math.abs(Math.cos((F.gier + 40) * RAD))), fh = 0.14 * gr * s;
          g.beginPath(); g.moveTo(0, zz); g.lineTo(fw, zz + fh * 0.2); g.lineTo(fw * 0.8, zz + fh * 0.5); g.lineTo(fw, zz + fh * 0.8); g.lineTo(0, zz + fh); g.closePath(); g.fill();
        }
      }
    };
  }

  /* =====================================================================
     AUFBAU
     ===================================================================== */
  function schlossBauen(W, o) {
    const Z = W.Z, fertig = Z.fertig;
    const winter = W.winter;
    /* ---------- Felssockel ---------- */
    {
      const oben = [[-13.4, -6.4], [-12.2, -7.0], [-4, -7.2], [6, -7.1], [13, -6.9], [13, 6.0], [6, 6.3], [-4, 6.2], [-12.4, 5.8], [-13.5, 4.4], [-13.8, -0.5]];
      const unten = [[-14, -7.6], [-12.6, -9], [-4, -9], [6, -9], [13, -9], [13, 8.8], [6, 9], [-4, 9], [-12.8, 8.6], [-14, 6.4], [-14, 0]];
      const pts = oben.map(([x, y]) => [x, y, ZP]).concat(unten.map(([x, y]) => [x, y, 0]));
      W.fels = W.koerper("fels", pts, felsMaler(W), { schatten: true });
      /* Stützmauer mit Auffahrt im Osten */
      const mauer = (fl) => {
        const s = seite(fl.n);
        if (s === "unten") return null;
        if (s === "oben" || s === "dach") return { malen(g, F, I) { g.fillStyle = "rgb(150,142,128)"; g.fillRect(-0.1, I.B0 - 0.1, F.w + 0.2, F.h + 0.2); rausch(g, -0.1, I.B0 - 0.1, F.w + 0.2, F.h + 0.2, 1.5, 0.3, 16); if (F.px > 12) { g.strokeStyle = "rgba(80,74,64,0.4)"; g.lineWidth = 0.8 / F.px; g.beginPath(); for (let yy = I.B0; yy < I.B0 + F.h; yy += 0.12) { g.moveTo(-0.1, yy); g.lineTo(F.w + 0.1, yy); } g.stroke(); } if (winter) schneeFlach(g, F, -0.1, I.B0 - 0.1, F.w + 0.2, F.h + 0.2, Z.fertig ? 0.8 : Z.schnee * 0.8); } };
        return { ao: true, malen(g, F, I) { kalk(g, F, I, -0.1, I.B0 - 0.1, F.w + 0.2, F.h + 0.2, { farbe: [196, 190, 176], saat: 8, lage: 0.2 }); } };
      };
      W.koerper("rampe", [[13, 0.8, ZP], [14, 0.8, ZP], [13, 8.8, 0], [14, 8.8, 0], [13, 0.8, 0], [14, 0.8, 0]], mauer, { schatten: false });
      W.koerper("absatz", quaderP(13, -2.2, 0, 14, 0.8, ZP), mauer, { schatten: false });
      /* Brüstung der Rampe */
      W.koerper("rampenmauer", [[13.85, 0.8, ZP + 0.45], [14, 0.8, ZP + 0.45], [13.85, 8.8, 0.45], [14, 8.8, 0.45], [13.85, 0.8, ZP], [14, 0.8, ZP], [13.85, 8.8, 0], [14, 8.8, 0]], mauer, { schatten: false });
    }
    if (Z.bau < 0.05) return;

    /* ---------- Fundamente (grau, aus Bruchstein) ---------- */
    if (!fertig && Z.fundament > 0) {
      const fund = (name, x0, y0, x1, y1, k) => {
        if (k <= 0) return;
        W.koerper(name, quaderP(x0 - 0.15, y0 - 0.15, ZP, x1 + 0.15, y1 + 0.15, ZP + 0.25 * k), (fl) => seite(fl.n) === "unten" ? null : { ao: true, malen(g, F, I) { g.fillStyle = "rgb(150,146,138)"; g.fillRect(-0.1, I.B0 - 0.1, F.w + 0.2, F.h + 0.2); rausch(g, -0.1, I.B0 - 0.1, F.w + 0.2, F.h + 0.2, 0.8, 0.4, 17); } });
      };
      const kf = Z.fundament;
      if (Z.torbau <= 0) fund("fund-tor", TB.x0, TB.y0, TB.x1, TB.y1, klemm(kf * 4, 0, 1));
      if (Z.palas <= 0) fund("fund-palas", PA.x0, PA.y0, PA.x1, PA.y1, klemm(kf * 4 - 1, 0, 1));
      if (Z.ritter <= 0) fund("fund-ritter", RH.x0, RH.y0, RH.x1, RH.y1, klemm(kf * 4 - 2, 0, 1));
      if (Z.kemenate <= 0) fund("fund-kem", KE.x0, KE.y0, KE.x2, KE.y1, klemm(kf * 4 - 3, 0, 1));
    }

    const S = (x) => W.saat % 3;   // kleine Varianten
    void S;

    /* ---------- Torbau ---------- */
    if (Z.torbau > 0) {
      const zTop = ZP + (TB.zt - ZP) * Z.torbau, im = Z.torbau < 1;
      const bis = im ? zTop : null;
      const baender = [{ z: ZP + 0.6, h: 0.12 }, { z: ZP + 2.35, h: 0.1 }, { z: ZP + 4.2, h: 0.1 }, { z: TB.zt - 0.12, h: 0.12 }];
      const lang = (fx) => [{ art: "rechteck", x: fx - 0.3, z: ZP + 2.7, w: 0.42, h: 0.85 }, { art: "rechteck", x: fx - 0.3, z: ZP + 4.55, w: 0.42, h: 0.8 }];
      const ostF = [{ art: "tor", x: 4.2 - 0.65, z: ZP, w: 1.3, h: 2.1 }];
      for (const fx of [1.1, 2.4, 6.2, 7.5]) ostF.push(...lang(fx));
      ostF.push({ art: "rechteck", x: 4.2 - 0.25, z: ZP + 4.55, w: 0.42, h: 0.8 });
      const westF = [{ art: "tor", x: 4.2 - 0.65, z: ZP, w: 1.3, h: 2.1 }];
      for (const fx of [1.1, 2.4, 6.2, 7.5]) westF.push(...lang(fx));
      const kurzF = [...lang(2.5)];
      const tMal = (fl) => {
        const s = seite(fl.n);
        if (s === "unten") return null;
        if (s === "oben") return im ? rohOben(W) : steinOben(W);
        const fe = s === "o" ? ostF : s === "w" ? westF : kurzF;
        return wandMaler(W, { stoff: "ziegel", fenster: im ? fe.filter((f) => f.z + f.h < zTop) : fe, baender: baender.filter((b) => b.z < zTop - 0.1), saat: 2 });
      };
      W.torbau = W.koerper("torbau", quaderP(TB.x0, TB.y0, ZP, TB.x1, TB.y1, TB.zt), tMal, { bisZ: bis, wirft: true });
      /* Ecktürme */
      for (const [yy0, yy1, nm] of [[-6.2, TB.y0, "te-n"], [TB.y1, 5.4, "te-s"]]) {
        const hT = ZP + (TE.h - ZP) * Z.torbau;
        const eMal = (fl) => {
          const s = seite(fl.n);
          if (s === "unten") return null;
          if (s === "oben") return im ? rohOben(W) : steinOben(W);
          return wandMaler(W, { stoff: "ziegel", fenster: [{ art: "rechteck", x: 0.55, z: ZP + 3.0, w: 0.4, h: 0.8 }, { art: "rechteck", x: 0.55, z: ZP + 5.1, w: 0.4, h: 0.8 }].filter((f) => f.z + f.h < hT), baender: [{ z: ZP + 0.6, h: 0.12 }, { z: ZP + 2.35, h: 0.1 }, { z: ZP + 4.2, h: 0.1 }, { z: TE.h - 0.12, h: 0.12 }].filter((b) => b.z < hT - 0.1), saat: 3 });
        };
        W.koerper(nm, quaderP(TE.x0, yy0, ZP, TE.x1, yy1, TE.h), eMal, { bisZ: im ? hT : null, wirft: true });
      }
      if (!im && Z.torbauOben > 0) {
        /* Dach hinter den Zinnen, Kamin */
        const dz = TB.zt + 1.1 * Z.torbauOben;
        W.torDach = W.koerper("torbau-dach", dachP(TB.x0 + 0.3, TB.y0 + 0.3, TB.x1 - 0.3, TB.y1 - 0.3, TB.zt, dz, true), (fl) => { const s = seite(fl.n); if (s === "unten") return null; if (s === "dach") return dachMaler(W, { saat: 5 }); return giebelMaler(W, { stoff: "ziegel", saat: 4 }); });
        zinnen(W, "tb", TB.x0, TB.y0, TB.x1, TB.y1, TB.zt, "ziegel", Z.torbauOben, [[TE.x0, -99, 99, TB.y0 + 0.01], [TE.x0, TB.y1 - 0.01, 99, 99]]);
        zinnen(W, "ten", TE.x0, -6.2, TE.x1, TB.y0, TE.h, "ziegel", Z.torbauOben);
        zinnen(W, "tes", TE.x0, TB.y1, TE.x1, 5.4, TE.h, "ziegel", Z.torbauOben);
        if (Z.torbauOben >= 1) {
          const k = W.koerper("kamin", quaderP(9.2, -2.3, TB.zt + 0.2, 9.6, -1.9, TB.zt + 1.6), (fl) => { const s = seite(fl.n); if (s === "unten") return null; if (s === "oben") return { malen(g, F, I) { g.fillStyle = "rgb(40,36,34)"; g.fillRect(-0.1, I.B0 - 0.1, F.w + 0.2, F.h + 0.2); } }; return { flut: 0.6, malen(g, F, I) { backstein(g, F, -0.05, I.B0 - 0.05, F.w + 0.1, F.h + 0.1, 5); gesims(g, F, I, -0.05, F.w + 0.05, TB.zt + 1.45, 0.1, W); } }; }, { nach: [W.torDach] });
          void k;
          if (winter) W.rauch = [9.4, -2.1, TB.zt + 1.7];
        }
      }
    }

    /* ---------- Ringmauer ---------- */
    if (Z.ring > 0) {
      const hR = ZP + 2.4 * Z.ring;
      const rm = (fl) => { const s = seite(fl.n); if (s === "unten") return null; if (s === "oben") return steinOben(W); return wandMaler(W, { stoff: "kalk", saat: 9, fenster: s === "s" ? [{ x: 2.6, z: ZP + 1.0, w: 0.12, h: 0.5, rahmen: 0.03 }] : [] }); };
      W.koerper("ring-s", quaderP(KE.x2, 4.4, ZP, TB.x0, 4.8, ZP + 2.4), rm, { bisZ: Z.ring < 1 ? hR : null });
      W.koerper("ring-n", quaderP(VT.x1, -6.2, ZP, TB.x0, -5.8, ZP + 2.4), rm, { bisZ: Z.ring < 1 ? hR : null });
      if (Z.ring >= 1) { zinnen(W, "rs", KE.x2, 4.4, TB.x0, 4.8, ZP + 2.4, "kalk", 1); zinnen(W, "rn", VT.x1, -6.2, TB.x0, -5.8, ZP + 2.4, "kalk", 1); }
    }

    /* ---------- Palas ---------- */
    if (Z.palas > 0) {
      const im = Z.palas < 1, zTop = ZP + (PA.zt - ZP) * Z.palas;
      const roh = im ? zTop - 0.9 : null;
      const baender = [{ z: ZP + 0.55, h: 0.14 }, { z: ZP + GESCHOSS[1], h: 0.08 }, { z: ZP + GESCHOSS[2], h: 0.08 }, { z: ZP + GESCHOSS[3], h: 0.08 }, { z: ZP + GESCHOSS[4], h: 0.1 }];
      /* Fenster je Wand: x ab der linken Kante (von außen gesehen) */
      const reihe = (xs, zs, w, h, n) => { const a = []; for (const z of zs) for (const x of xs) a.push({ x: x - w / 2, z: z, w: w, h: h, n: n }); return a; };
      const fl0 = [ZP + 0.9, ZP + GESCHOSS[1] + 0.55, ZP + GESCHOSS[2] + 0.55, ZP + GESCHOSS[3] + 0.5];
      const ostF = reihe([1.35, 2.25, 4.45, 5.35, 7.55, 8.45], fl0.slice(1), 0.6, 1.15, 2).concat(reihe([1.8, 4.9, 8.0], fl0.slice(0, 1), 0.3, 0.9, 1)).concat([{ art: "arkade", x: 0.55, z: ZP + GESCHOSS[4] + 0.35, w: 8.7, h: 1.55, gruppen: 4 }]);
      const westF = reihe([1.35, 2.25, 7.55, 8.45], fl0.slice(1).concat([ZP + GESCHOSS[4] + 0.45]), 0.6, 1.15, 2).concat(reihe([1.8, 8.0], fl0.slice(0, 1), 0.3, 0.9, 1))
        .concat([{ art: "arkade", x: 4.05, z: ZP + GESCHOSS[3] + 0.3, w: 1.7, h: 1.6, gruppen: 1 }, { x: 4.6, z: ZP + GESCHOSS[4] + 0.4, w: 0.6, h: 1.2, n: 2 }])
        .concat(reihe([4.9], fl0.slice(1, 3), 0.9, 1.2, 3)).concat(reihe([4.9], fl0.slice(0, 1), 0.3, 0.9, 1));
      const suedF = reihe([1.3, 2.9, 4.5], fl0.slice(1).concat([ZP + GESCHOSS[4] + 0.45]), 0.62, 1.15, 2).concat(reihe([2.9], fl0.slice(0, 1), 0.3, 0.9, 1));
      const nordF = reihe([1.1, 2.9, 4.7], fl0.concat([ZP + GESCHOSS[4] + 0.45]), 0.62, 1.15, 2);
      const pMal = (fl) => {
        const s = seite(fl.n);
        if (s === "unten") return null;
        if (s === "oben") return im ? rohOben(W) : steinOben(W);
        const fe = s === "o" ? ostF : s === "w" ? westF : s === "s" ? suedF : nordF;
        return wandMaler(W, { stoff: "kalk", saat: s.charCodeAt(0), fenster: fe, baender: baender, fries: PA.zt - 0.3, roh: roh, ecken: true });
      };
      W.palas = W.koerper("palas", quaderP(PA.x0, PA.y0, ZP, PA.x1, PA.y1, PA.zt), pMal, { bisZ: im ? zTop : null, wirft: true });
      /* Balkon vor dem Thronsaal (Westseite) */
      if (!im) {
        const zb = ZP + GESCHOSS[3] + 0.1;
        const bal = (fl) => { const s = seite(fl.n); if (s === "unten") return { malen(g, F, I) { g.fillStyle = rgbS(KALK_D); g.fillRect(-0.1, I.B0 - 0.1, F.w + 0.2, F.h + 0.2); } }; if (s === "oben") return steinOben(W); return { flut: 1, malen(g, F, I) { kalk(g, F, I, -0.05, I.B0 - 0.05, F.w + 0.1, F.h + 0.1, { saat: 3, fugen: false }); } }; };
        W.koerper("balkon", quaderP(PA.x0 - 0.55, -1.25, zb - 0.14, PA.x0, 1.0, zb), bal);
        const bru = (fl) => { const s = seite(fl.n); if (s === "unten") return null; if (s === "oben") return steinOben(W); return { flut: 1, malen(g, F, I) { g.fillStyle = rgbS(KALK_H); g.fillRect(-0.05, I.B0 - 0.05, F.w + 0.1, F.h + 0.1); if (F.px > 12 && F.w > 0.3) { g.fillStyle = "rgba(60,56,52,0.55)"; for (let t = 0.06; t < F.w - 0.05; t += 0.1) { g.beginPath(); g.ellipse(t + 0.03, -zb - 0.26, 0.025, 0.1, 0, 0, 2 * Math.PI); g.fill(); } } } }; };
        W.koerper("bruestung-w", quaderP(PA.x0 - 0.55, -1.25, zb, PA.x0 - 0.47, 1.0, zb + 0.5), bru, { verbund: "balk" });
        W.koerper("bruestung-n", quaderP(PA.x0 - 0.47, -1.25, zb, PA.x0 - 0.01, -1.17, zb + 0.5), bru, { verbund: "balk" });
        W.koerper("bruestung-s", quaderP(PA.x0 - 0.47, 0.92, zb, PA.x0 - 0.01, 1.0, zb + 0.5), bru, { verbund: "balk" });
        W.verbund("balk", quaderP(PA.x0 - 0.55, -1.25, zb, PA.x0 - 0.01, 1.0, zb + 0.5));
      }
      /* Dach: erst Schalung, dann Schiefer */
      if (!im && Z.palasDach > 0) {
        const zf = PA.zt + (PA.zf - PA.zt) * Math.min(1, Z.palasDach * 2);
        const deck = klemm(Z.palasDach * 2 - 1, 0, 1);
        const gF = (s) => [{ x: 2.9 - 0.32, z: PA.zt + 0.7, w: 0.64, h: 1.2, n: 2 }, { x: 2.9 - 0.2, z: PA.zt + 2.6, w: 0.4, h: 0.8, n: 1 }];
        W.palasDach = W.koerper("palas-dach", dachP(PA.x0, PA.y0, PA.x1, PA.y1, PA.zt, PA.zf, true, 0.18), (fl) => {
          const s = seite(fl.n);
          if (s === "unten") return null;
          if (s === "dach") return dachMaler(W, { deck: deck, saat: 3 });
          return giebelMaler(W, { stoff: "kalk", saat: 11, fenster: gF(s).filter((f) => f.z + f.h < zf - 0.8) });
        }, { bisZ: zf < PA.zf - 0.01 ? zf : null, wirft: true });
        if (Z.palasDach >= 1 && Z.gold) {
          W.figur("knauf-ps", knauf((PA.x0 + PA.x1) / 2, PA.y1 + 0.02, PA.zf - 0.05, 1.3, true), [0.12, 0.12]);
          W.figur("knauf-pn", knauf((PA.x0 + PA.x1) / 2, PA.y0 - 0.02, PA.zf - 0.05, 1.3, true), [0.12, 0.12]);
        }
      }
      /* Ecktürmchen an den Westecken (auskragend, auf Konsolen) */
      if (!im && Z.eck > 0) {
        for (const [cx, cy, sy, nm] of [[PA.x0, PA.y0, -1, "eck-nw"], [PA.x0, PA.y1, 1, "eck-sw"]]) {
          eckTurm(W, nm, cx - 0.32, cy + sy * 0.32, 0.72, ZP + 6.6, ZP + 11.9, ZP + 15.3, [[[1, 0, 0], PA.x0]], [[[-1, 0, 0], -PA.x0], [[0, -sy, 0], -sy * cy]], Z.eck, Z.eckHelm);
        }
      }
    }

    /* ---------- Treppenturm ---------- */
    if (Z.turm > 0) {
      const n = 16, im = Z.turm < 1, zTop = ZP + (TT.zk - ZP) * Z.turm;
      const fenster = [];
      for (let i = 0; i < 7; i++) fenster.push({ phi: -Math.PI / 2 + (i % 2 ? 0.5 : -0.5) + Math.PI * 0.25, z: ZP + 1.4 + i * 2.1, w: 0.2, h: 0.6, n: 1, licht: 0.15 });
      for (let i = 0; i < 6; i++) fenster.push({ phi: Math.PI * 0.25 + (i % 2 ? 0.6 : 0), z: ZP + 2.3 + i * 2.1, w: 0.2, h: 0.55, n: 1, licht: 0.15 });
      fenster.push({ phi: Math.PI * 0.75, z: ZP + 12.3, w: 0.36, h: 0.9, n: 2 }, { phi: Math.PI * 0.1, z: ZP + 12.3, w: 0.36, h: 0.9, n: 2 }, { phi: Math.PI * 0.4, z: ZP + 14.8, w: 0.36, h: 0.9, n: 2 }, { phi: -Math.PI * 0.6, z: ZP + 14.8, w: 0.36, h: 0.9, n: 2 });
      const tm = turmMaler(W, { n: n, fenster: fenster, baender: [{ z: ZP + 0.55, h: 0.12 }, { z: ZP + 7.0, h: 0.08 }, { z: ZP + 11.6, h: 0.08 }, { z: ZP + 14.4, h: 0.08 }], roh: im ? zTop - 0.8 : null, oben: im ? rohOben(W) : undefined });
      W.turm = W.koerper("turm", ring(TT.x, TT.y, TT.r, ZP, n).concat(ring(TT.x, TT.y, TT.r, TT.zk, n)), tm, { bisZ: im ? zTop : null, wirft: true });
      if (!im) {
        /* Kranz: etwas breiter, Rundbogenfries, Fensterkranz */
        const km = turmMaler(W, { n: n, fries: TT.zh - 0.22, fenster: [{ jede: 2, z: TT.zk + 0.12, w: 0.24, h: 0.5, n: 1, licht: 0.4 }], baender: [{ z: TT.zk + 0.04, h: 0.06 }] });
        W.koerper("turm-kranz", ring(TT.x, TT.y, TT.r + 0.14, TT.zk, n).concat(ring(TT.x, TT.y, TT.r + 0.14, TT.zh, n)), km, { wirft: true });
        W.koerper("turm-konsole", ring(TT.x, TT.y, TT.r, TT.zk - 0.3, n).concat(ring(TT.x, TT.y, TT.r + 0.14, TT.zk, n)), turmMaler(W, { n: n }), { schatten: false });
        if (Z.turmHelm > 0) {
          const sp = TT.zh + (TT.spitze - TT.zh) * Math.min(1, Z.turmHelm * 1.6);
          const pts = ring(TT.x, TT.y, TT.r + 0.3, TT.zh, n).concat([[TT.x, TT.y, TT.spitze]]);
          W.koerper("turm-helm", pts, helmMaler(W, n, { deck: klemm(Z.turmHelm * 1.6 - 0.6, 0, 1) }), { bisZ: sp < TT.spitze - 0.01 ? sp : null, wirft: true });
          if (Z.gold) W.figur("knauf-turm", knauf(TT.x, TT.y, TT.spitze - 0.1, 1.5, true), [0.12, 0.12]);
        }
      }
    }

    /* ---------- Ritterhaus ---------- */
    if (Z.ritter > 0) {
      const im = Z.ritter < 1, zTop = ZP + (RH.zt - ZP) * Z.ritter, roh = im ? zTop - 0.8 : null;
      const reihe = (xs, zs) => { const a = []; for (const z of zs) for (const x of xs) a.push({ x: x - 0.28, z: z, w: 0.56, h: 1.05, n: 2 }); return a; };
      const zs = [ZP + 0.9, ZP + 3.2, ZP + 5.6];
      const sued = reihe([0.9, 2.3, 3.7, 5.1, 6.5], zs);
      const rm = (fl) => { const s = seite(fl.n); if (s === "unten") return null; if (s === "oben") return im ? rohOben(W) : steinOben(W); return wandMaler(W, { stoff: "kalk", saat: 21, fenster: s === "s" || s === "n" ? sued : [], baender: [{ z: ZP + 0.55, h: 0.12 }, { z: ZP + 2.8, h: 0.08 }, { z: ZP + 5.2, h: 0.08 }], fries: RH.zt - 0.28, roh: roh }); };
      W.ritter = W.koerper("ritterhaus", quaderP(RH.x0, RH.y0, ZP, RH.x1, RH.y1, RH.zt), rm, { bisZ: im ? zTop : null, wirft: true });
      if (!im && Z.nebenDach > 0) {
        const zf = RH.zt + (RH.zf - RH.zt) * Z.nebenDach;
        W.koerper("ritter-dach", dachP(RH.x0, RH.y0, RH.x1, RH.y1, RH.zt, RH.zf, false, 0.15), (fl) => { const s = seite(fl.n); if (s === "unten") return null; if (s === "dach") return dachMaler(W, { saat: 6 }); return giebelMaler(W, { stoff: "kalk", saat: 22 }); }, { bisZ: zf < RH.zf - 0.01 ? zf : null, wirft: true });
      }
    }

    /* ---------- Viereckturm ---------- */
    if (Z.viereck > 0) {
      const im = Z.viereck < 1, zTop = ZP + (VT.zt - ZP) * Z.viereck, roh = im ? zTop - 0.8 : null;
      const fe = [{ x: 1.4 - 0.3, z: ZP + 9.8, w: 0.6, h: 1.1, n: 2 }, { x: 1.4 - 0.12, z: ZP + 6.0, w: 0.24, h: 0.7, n: 1 }, { x: 1.4 - 0.12, z: ZP + 3.2, w: 0.24, h: 0.7, n: 1 }];
      const vm = (fl) => { const s = seite(fl.n); if (s === "unten") return null; if (s === "oben") return im ? rohOben(W) : steinOben(W); return wandMaler(W, { stoff: "kalk", saat: 31, fenster: fe, baender: [{ z: ZP + 0.55, h: 0.12 }, { z: ZP + 8.9, h: 0.1 }], fries: VT.zt - 0.3, roh: roh, ecken: true }); };
      W.viereck = W.koerper("viereckturm", quaderP(VT.x0, VT.y0, ZP, VT.x1, VT.y1, VT.zt), vm, { bisZ: im ? zTop : null, wirft: true });
      if (!im) {
        zinnen(W, "vt", VT.x0, VT.y0, VT.x1, VT.y1, VT.zt, "kalk", 1);
        if (Z.nebenDach > 0) {
          const sp = VT.zt + 2.4;
          const pts = [[VT.x0 + 0.3, VT.y0 + 0.3, VT.zt], [VT.x1 - 0.3, VT.y0 + 0.3, VT.zt], [VT.x0 + 0.3, VT.y1 - 0.3, VT.zt], [VT.x1 - 0.3, VT.y1 - 0.3, VT.zt], [(VT.x0 + VT.x1) / 2, (VT.y0 + VT.y1) / 2, sp]];
          W.koerper("viereck-dach", pts, (fl) => seite(fl.n) === "unten" ? null : dachMaler(W, { saat: 7, steil: true }), { bisZ: Z.nebenDach < 1 ? VT.zt + 2.4 * Z.nebenDach : null, wirft: true });
          if (Z.gold) W.figur("knauf-vt", knauf((VT.x0 + VT.x1) / 2, (VT.y0 + VT.y1) / 2, sp - 0.05, 1.2, true), [0.12, 0.12]);
        }
      }
    }

    /* ---------- Kemenate ---------- */
    if (Z.kemenate > 0) {
      const im = Z.kemenate < 1, zTop = ZP + (KE.zt - ZP) * Z.kemenate, roh = im ? zTop - 0.8 : null;
      const reihe = (xs, zs) => { const a = []; for (const z of zs) for (const x of xs) a.push({ x: x - 0.28, z: z, w: 0.56, h: 1.05, n: 2 }); return a; };
      const zs = [ZP + 0.9, ZP + 3.1, ZP + 5.3];
      const km = (fl) => { const s = seite(fl.n); if (s === "unten") return null; if (s === "oben") return im ? rohOben(W) : steinOben(W); const fe = s === "s" || s === "n" ? reihe([1.0, 2.4, 3.8, 5.2, 6.6], zs) : s === "o" ? reihe([0.8, 2.0], zs) : []; return wandMaler(W, { stoff: "kalk", saat: 41, fenster: fe, baender: [{ z: ZP + 0.55, h: 0.12 }, { z: ZP + 2.75, h: 0.08 }, { z: ZP + 4.95, h: 0.08 }], fries: KE.zt - 0.28, roh: roh }); };
      W.kemenate = W.koerper("kemenate", quaderP(KE.x0, KE.y0, ZP, KE.x2, KE.y1, KE.zt), km, { bisZ: im ? zTop : null, wirft: true });
      if (!im && Z.nebenDach > 0) {
        const zf = KE.zt + (KE.zf - KE.zt) * Z.nebenDach;
        W.koerper("kem-dach", dachP(KE.x0, KE.y0, KE.x1, KE.y1, KE.zt, KE.zf, false, 0.15), (fl) => { const s = seite(fl.n); if (s === "unten") return null; if (s === "dach") return dachMaler(W, { saat: 8 }); return giebelMaler(W, { stoff: "kalk", saat: 42 }); }, { bisZ: zf < KE.zf - 0.01 ? zf : null, wirft: true });
        /* Treppengiebel an der Hofseite (Osten) */
        if (Z.nebenDach >= 1) {
          const stufen = 5, bT = KE.y1 - KE.y0, hG = KE.zf - KE.zt + 0.5;
          const sm = (fl) => { const s = seite(fl.n); if (s === "unten") return null; if (s === "oben") return steinOben(W, KALK_H); return { flut: 1, malen(g, F, I) { kalk(g, F, I, -0.05, I.B0 - 0.05, F.w + 0.1, F.h + 0.1, { saat: 43, fugen: true }); g.fillStyle = rgbS(KALK_H); g.fillRect(-0.05, I.B0 - 0.05, F.w + 0.1, 0.07); } }; };
          for (let i = 0; i < stufen; i++) {
            const e = i * bT / (2 * stufen + 1.2), z0 = KE.zt + i * hG / stufen, z1 = KE.zt + (i + 1) * hG / stufen;
            W.koerper("stufe" + i, quaderP(KE.x1, KE.y0 + e, z0, KE.x2, KE.y1 - e, z1), sm, { verbund: "treppengiebel", wirft: true });
          }
          W.verbund("treppengiebel", quaderP(KE.x1, KE.y0, KE.zt, KE.x2, KE.y1, KE.zt + hG));
          if (Z.gold) W.figur("knauf-ke", knauf((KE.x1 + KE.x2) / 2, (KE.y0 + KE.y1) / 2, KE.zt + hG, 0.9, false), [0.1, 0.1]);
        }
      }
      /* runder Eckturm an der Südostecke */
      if (!im && Z.eck > 0) eckTurm(W, "eck-ke", KE.x2 + 0.1, KE.y1 + 0.1, 0.78, ZP, ZP + 9.4, ZP + 12.6, [[[-1, 0, 0], -KE.x2]], [[[1, 0, 0], KE.x2], [[0, -1, 0], -KE.y1]], Z.eck, Z.eckHelm, true);
    }
  }

  /* Zinnenkranz auf einem Rechteck: Brüstungsmauer + Zinnen (je Seite ein
     Verbund, der Eckzahn gehört zur Längsseite). aus: Rechtecke, die frei bleiben. */
  function zinnen(W, name, x0, y0, x1, y1, z, stoff, k, aus) {
    if (k <= 0) return;
    const d = 0.28, hb = 0.4 * Math.min(1, k * 2), hz = 0.42, zb = 0.3, luecke = 0.24;
    const frei = (xa, ya, xb, yb) => !(aus || []).some(([a, b, c, e]) => xa < c && xb > a && ya < e && yb > b);
    const wm = (fl) => {
      const s = seite(fl.n);
      if (s === "unten") return null;
      if (s === "oben") return steinOben(W, stoff === "ziegel" ? KALK_H : KALK);
      return { flut: 1, ao: false, malen(g, F, I) { if (stoff === "ziegel") backstein(g, F, -0.05, I.B0 - 0.05, F.w + 0.1, F.h + 0.1, 6); else kalk(g, F, I, -0.05, I.B0 - 0.05, F.w + 0.1, F.h + 0.1, { saat: 17, schlieren: false }); } };
    };
    const seiten = [
      ["s", x0, y1 - d, x1, y1, true], ["n", x0, y0, x1, y0 + d, true],
      ["o", x1 - d, y0 + d, x1, y1 - d, false], ["w", x0, y0 + d, x0 + d, y1 - d, false]
    ];
    for (const [sn, a, b, c, e, alongX] of seiten) {
      if (!frei(a, b, c, e)) {
        /* Seite teilweise frei: nur die freien Stücke */
      }
      const L = alongX ? c - a : e - b;
      if (L < 0.2) continue;
      const vb = name + "-" + sn;
      let any = false;
      /* Brüstung */
      if (frei(a, b, c, e)) W.koerper(vb + "-br", quaderP(a, b, z, c, e, z + hb), wm, { schatten: false });
      if (k < 0.5) continue;
      const nZ = Math.max(1, Math.round((L + luecke) / (zb + luecke)));
      const step = (L + luecke) / nZ, zbr = step - luecke;
      for (let i = 0; i < nZ; i++) {
        const s0 = (alongX ? a : b) + i * step, s1 = s0 + zbr;
        const q = alongX ? [s0, b, s1, e] : [a, s0, c, s1];
        if (!frei(q[0], q[1], q[2], q[3])) continue;
        W.koerper(vb + i, quaderP(q[0], q[1], z + hb, q[2], q[3], z + hb + hz), wm, { verbund: vb, schatten: false });
        any = true;
      }
      if (any) W.verbund(vb, quaderP(a, b, z + hb, c, e, z + hb + hz));
    }
  }

  /* Rundes Ecktürmchen, das in eine Hausecke greift: zwei konvexe Stücke
     (A außerhalb der einen, B außerhalb der anderen Wandebene) – so gibt es
     immer eine trennende Ebene zum Haus. */
  function eckTurm(W, name, cx, cy, r, z0, zk, spitze, schnittA, schnittB, k, kHelm, vomBoden) {
    const n = 12, zTop = z0 + (zk - z0) * k, im = k < 1;
    const fe = [{ jede: 3, z: zk - 1.6, w: 0.22, h: 0.6, n: 1, licht: 0.35 }];
    if (vomBoden) fe.push({ jede: 3, z: z0 + 3.2, w: 0.22, h: 0.6, n: 1 }, { jede: 3, z: z0 + 5.6, w: 0.22, h: 0.6, n: 1 });
    const tm = turmMaler(W, { n: n, fenster: fe, fries: zk - 0.25, baender: vomBoden ? [{ z: z0 + 0.55, h: 0.12 }] : [], roh: im ? zTop - 0.6 : null });
    const kons = turmMaler(W, { n: n });
    for (const [teil, sch] of [["a", schnittA], ["b", schnittB]]) {
      const zs = vomBoden ? z0 : z0 + 1.2;
      if (!vomBoden) W.koerper(name + "-kons-" + teil, ring(cx, cy, 0.18, z0, n).concat(ring(cx, cy, r, z0 + 1.2, n)), kons, { schnitte: sch, schatten: false, bisZ: im ? zTop : null });
      W.koerper(name + "-" + teil, ring(cx, cy, r, zs, n).concat(ring(cx, cy, r, zk, n)), tm, { schnitte: sch, bisZ: im ? zTop : null, wirft: true });
      if (!im && kHelm > 0) {
        const pts = ring(cx, cy, r + 0.16, zk, n).concat([[cx, cy, spitze]]);
        const sp = zk + (spitze - zk) * Math.min(1, kHelm * 1.6);
        W.koerper(name + "-helm-" + teil, pts, helmMaler(W, n, { deck: klemm(kHelm * 1.6 - 0.6, 0, 1) }), { schnitte: sch, bisZ: sp < spitze - 0.01 ? sp : null, wirft: true });
      }
    }
    if (!im && kHelm >= 1 && W.Z.gold) W.figur(name + "-knauf", knauf(cx, cy, spitze - 0.08, 1.0, true), [0.1, 0.1]);
  }

  /* =====================================================================
     ANMELDEN
     ===================================================================== */
  ST.modell("neuschwanstein", {
    name: "Schloss Neuschwanstein", gruppe: "Wahrzeichen", grund: [28, 18], hoehe: 24, bauzeit: 40 * 60,
    bauen(M, o) {
      const B = blickVon(o);
      const W = new Werk(o, B);
      const bau = o.bau == null ? 1 : klemm(o.bau, 0, 1);
      W.Z = zustand(bau);
      W.winter = o.jahr === "winter";
      W.jahr = o.jahr;
      W.saat = (o.saat >>> 0) % 1000 || 7;
      schlossBauen(W, o);
      ausgeben(W, M);
      if (W.rauch) M.rauchAus(W.rauch[0], W.rauch[1], W.rauch[2], 0.7);
      /* Laternen am Tor und im Hof (Lichtpfützen) */
      if (W.Z.fertig) {
        M.bodenlicht(13.5, -0.4, 2.2, "255,200,130", 0.7);
        M.licht(12.6, -1.5, ZP + 2.2, 0.9, "255,196,120", 0.6);
        M.licht(12.6, 0.7, ZP + 2.2, 0.9, "255,196,120", 0.6);
      }
    }
  });
})();
