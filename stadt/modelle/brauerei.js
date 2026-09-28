/* =====================================================================
   BRAUEREI — kleine fränkische Landbrauerei (Sudhaus, Mälzerei, Schlot)
   ---------------------------------------------------------------------
   XANDER: „richtig filigran. Richtig schön ausarbeiten mit schönen
   Texturen" · „keine Comic Grafik … viel mehr am Realismus" · „ohne
   Pixelkanten und komische Vektorrückstände" · „Man soll das Fundament
   sehen beim Aufbauen" · „Du bist dein schlimmster Kritiker" · Stil
   „von Anno oder geiler", „trotzdem mit SVG Grafiken".

   VORBILD
   Eine Landbrauerei, wie sie in Oberfranken und der Oberpfalz noch in
   fast jedem zweiten Dorf steht (Aufseß, Buttenheim, Schlüsselfeld):
   ein giebelständiges Sudhaus aus rotem Backstein mit hohen
   Rundbogenfenstern – hinter dem großen Fenster im Obergeschoss (dem
   Sudboden) glänzt die kupferne Sudpfanne –, daneben die niedrigere
   Mälzerei mit kleinen Stichbogenfenstern in drei niedrigen Tennen und
   dem Dachreiter über der Darre (Darrhaube mit Lamellen, aus der der
   Dunst zieht). Hinten der hohe runde Backsteinschlot des Kesselhauses.
   Im Hof ein Fasslager und der grüne Bierwagen. Am Eck hängt der
   Brauerstern (Zoiglstern), über dem Sudhaustor steht in gemalten
   Lettern „Brauerei".
   Schmuck wie an den Industriebauten um 1880: Lisenen an den Ecken,
   Rundbogenfries und Deutsches Band unter der Traufe, Rollschichten
   über den Fenstern mit Schlusssteinen aus hellem Sandstein,
   Sandsteinsockel und -gesimse, geschmiedete Maueranker.

   MASSE (Meter, x = Osten, y = Süden, Mitte des Grundrisses = 0,0)
     Grund         12 × 10 m
     Sudhaus       6,4 × 6,8 m, Traufe 7,2 m, Satteldach 45°, First 10,8 m,
                   Giebel nach Süden (Straße); Tor 1,6 × 3,1 m
     Mälzerei      4,6 × 5,6 m, Traufe 5,4 m, Satteldach 50°, First 8,6 m,
                   Darrhaube bis 10,9 m
     Schlot        rund, Sockel 1,16 m im Quadrat bis 2,45 m, Schaft
                   Ø 1,12 → 0,80 m, Kopf bis 15,0 m
   Mensch 1,75 m, Tür 2,1 m (Mälzerei), Fenster 1,0 × 2,0 m.

   WIE ES GEBAUT IST
   Wie die Dorfkirche: alles aus konvexen Körpern, deren Reihenfolge je
   Blickwinkel über trennende Ebenen bestimmt wird; Körper werfen echte
   Schatten auf Wände und Dächer. Gemalt wird in Flächenkoordinaten, die
   an der Welt haften (Backstein und Ziegel wandern beim Bauen nicht).
   Rundes (Schlot, Dunstrohr, Fässer, Räder) sind aufrecht gemalte
   Figuren mit eigener Kleinst-3D-Rechnung: Fassdauben, Reifen und Böden
   werden als echte Flächen im Licht der Szene gemalt.

   BAUPHASEN (o.bau 0 … 1)
     0,00–0,07  Baugrube (1,2 m) mit Aushubhaufen
     0,07–0,15  Streifenfundamente: Schalung, Beton, ausgeschalt
     0,15–0,20  Verfüllen, Bodenplatte
     0,19–0,54  Mauern wachsen Lage für Lage, dann die Giebel; man sieht
                in den offenen Rohbau
     0,22–0,62  Schlot: Sockel, dann der runde Schaft
     0,52–0,62  offene Dachstühle, Richtbaum auf dem Sudhaus
     0,58–0,72  Eindecken von der Traufe zum First, Darrhaube 0,70–0,76
     0,78–0,90  Fenster (eines nach dem anderen), Sudpfanne, Tore
     0,86–0,98  Stufen, Rinnen, Schild, Stern, Laterne, Pflaster, Fässer,
                zuletzt der Bierwagen
   Gerüst, Kran, Bagger und Arbeiter malt stadt/baustelle.js.

   JAHRESZEITEN, TAGESZEIT, VARIANTEN
   Winter: Schnee auf Dächern, Gesimsen, Sohlbänken, Fässern und Wagen,
   Eiszapfen an den Traufen, Tannenkranz am Tor. Herbst: der wilde Wein
   an der Ostwand leuchtet rot, Laub im Hof. Frühling/Sommer: Wein grün,
   Blumen in halben Fässern neben der Tür. Nacht: Sudboden und Stube
   warm erleuchtet (die Sudpfanne glüht kupfern), Laterne am Tor.
   o.saat: Backstein rot oder braun, Tor grün, braun oder blau.
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
  const glatt = (x) => { x = klemm(x, 0, 1); return x * x * (3 - 2 * x); };
  const mischF = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
  const hellF = (c, k) => (k >= 0 ? mischF(c, [255, 255, 255], k) : mischF(c, [0, 0, 0], -k));
  function mitteVon(p) { let x = 0, y = 0, z = 0; for (const q of p) { x += q[0]; y += q[1]; z += q[2]; } return [x / p.length, y / p.length, z / p.length]; }
  function rgbS(c, a) { return a == null ? "rgb(" + (c[0] | 0) + "," + (c[1] | 0) + "," + (c[2] | 0) + ")" : "rgba(" + (c[0] | 0) + "," + (c[1] | 0) + "," + (c[2] | 0) + "," + a + ")"; }
  const hash = (a, b, c) => ST.hash2(a | 0, b | 0, (c | 0) + 11);
  const zuf = (n) => ST.zufall((n >>> 0) || 1);
  function belicht(c, lf, a) { return rgbS([Math.min(255, c[0] * lf[0]), Math.min(255, c[1] * lf[1]), Math.min(255, c[2] * lf[2])], a); }
  const SCHNEE = [240, 244, 251];

  /* =====================================================================
     BLICK — Drehung des Objekts + Kamera (wie Kirche, Tanne, Laterne)
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

  /* =====================================================================
     KONVEXE KÖRPER UND IHRE REIHENFOLGE (nach dem Vorbild der Kirche)
     ===================================================================== */
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
  function kanten(H) {
    const k = [];
    for (const f of H.flaechen) for (let i = 0; i < f.pts.length; i++) k.push([f.pts[i], f.pts[(i + 1) % f.pts.length]]);
    return k;
  }
  function schneide(pts, n, d) {
    const H = huelle3(pts), aus = [];
    for (const p of H.punkte) if (dot(n, p) <= d + 1e-6) aus.push(p);
    for (const [a, b] of kanten(H)) {
      const sa = dot(n, a) - d, sb = dot(n, b) - d;
      if ((sa < -1e-6 && sb > 1e-6) || (sa > 1e-6 && sb < -1e-6)) { const t = sa / (sa - sb); aus.push(add(a, mul(sub(b, a), t))); }
    }
    return aus;
  }
  function Werk(o, B) { this.o = o; this.B = B; this.k = []; this.verbuende = {}; this.grube = null; this.boden = []; }
  Werk.prototype.verbund = function (name, pts) { this.verbuende[name] = huelle3(pts); };
  Werk.prototype.koerper = function (name, pts, mal, opt) {
    opt = opt || {};
    if (opt.bisZ != null) {
      let zmax = -Infinity, zmin = Infinity; for (const p of pts) { zmax = Math.max(zmax, p[2]); zmin = Math.min(zmin, p[2]); }
      if (opt.bisZ < zmax - 1e-4) {
        if (opt.bisZ <= zmin + 0.01) return null;
        pts = schneide(pts, [0, 0, 1], opt.bisZ);
      }
    }
    if (opt.schnitte) for (const [n, d] of opt.schnitte) { pts = schneide(pts, n, d); if (pts.length < 4) return null; }
    const H = huelle3(pts);
    if (H.flaechen.length < 4) return null;
    const K = Object.assign({ name: name, H: H, mal: mal, schatten: true, wirft: false, nach: null, gruppe: null }, opt);
    K.mitte = mitteVon(H.punkte);
    this.k.push(K);
    return K;
  };
  Werk.prototype.figur = function (name, fi, halb, opt) {
    const h = halb || [0.3, 0.3], pts = [];
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const z of [fi.z || 0, (fi.z || 0) + (fi.hoehe || 1)]) pts.push([fi.x + sx * h[0], fi.y + sy * h[1], z]);
    const K = this.koerper(name, pts, () => null, Object.assign({ schatten: false }, opt || {}));
    if (K) K.figur = fi;
    return K;
  };
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
  function ordnen(W) {
    const B = W.B, e = B.e, liste = [], vb = {};
    for (const K of W.k) {
      if (K.verbund && W.verbuende[K.verbund]) {
        let N = vb[K.verbund];
        if (!N) { const H = W.verbuende[K.verbund]; N = vb[K.verbund] = { name: K.verbund, H: H, mitte: mitteVon(H.punkte), glieder: [] }; liste.push(N); }
        N.glieder.push(K);
        K.tief = dot(K.mitte, e);
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
        const s = dot(f.n, e);
        if (s > 1e-5) return 1; if (s < -1e-5) return -1;
      }
      for (const f of C.H.flaechen) {
        let alle = true;
        for (const p of A.H.punkte) if (dot(f.n, p) - f.d < -eps) { alle = false; break; }
        if (!alle) continue;
        const s = dot(f.n, e);
        if (s > 1e-5) return -1; if (s < -1e-5) return 1;
      }
      return 0;
    };
    const n = liste.length, rand = 0.02;
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      const A = liste[i], C = liste[j];
      if (A.bb[2] < C.bb[0] - rand || C.bb[2] < A.bb[0] - rand || A.bb[3] < C.bb[1] - rand || C.bb[3] < A.bb[1] - rand) continue;
      if (!ueberdecken(A.umriss2, C.umriss2)) continue;
      let r = 0;
      if (A.nach && A.nach.indexOf(C) >= 0) r = -1;
      else if (C.nach && C.nach.indexOf(A) >= 0) r = 1;
      else r = vergleich(A, C);
      if (r === 0) r = A.tief <= C.tief ? 1 : -1;
      if (r > 0) { A.vor.push(C); C.grad++; } else { C.vor.push(A); A.grad++; }
    }
    const bereit = liste.filter((K) => K.grad === 0).sort((a, b) => b.tief - a.tief), aus = [];
    while (bereit.length) {
      const K = bereit.pop();
      aus.push(K);
      for (const V of K.vor) { V.grad--; if (V.grad === 0) { let i = bereit.length; while (i > 0 && bereit[i - 1].tief < V.tief) i--; bereit.splice(i, 0, V); } }
    }
    if (aus.length < n) aus.push(...liste.filter((K) => aus.indexOf(K) < 0).sort((a, b) => a.tief - b.tief));
    const voll = [];
    for (const K of aus) { if (K.glieder) voll.push(...K.glieder.sort((a, b) => a.tief - b.tief)); else voll.push(K); }
    return voll;
  }
  function schattenAufFlaeche(W, fl, K, rahmen) {
    const L = W.B.L, n = fl.n, ln = dot(L, n);
    if (ln < 0.03) return [];
    const polys = [], [u, v] = rahmen;
    let a0 = Infinity, b0 = Infinity, a1 = -Infinity, b1 = -Infinity;
    for (const p of fl.pts) { const a = dot(p, u), b = dot(p, v); a0 = Math.min(a0, a); a1 = Math.max(a1, a); b0 = Math.min(b0, b); b1 = Math.max(b1, b); }
    for (const C of W.k) {
      if (C === K || !C.wirft) continue;
      let kg = C._kugel;
      if (!kg || kg.H !== C.H) { const m = mitteVon(C.H.punkte); let r = 0; for (const p of C.H.punkte) r = Math.max(r, lang(sub(p, m))); kg = C._kugel = { m: m, r: r, H: C.H }; }
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
  function rahmenVon(n) {
    let v = [n[0] * n[2], n[1] * n[2], -1 + n[2] * n[2]];
    if (lang(v) < 1e-3) v = [0, 1, 0]; else v = nrm(v);
    return [nrm(kreuz(v, n)), v];
  }
  function ausgeben(W, M) {
    /* Bodenschatten: Körper einer Gruppe werfen EINEN gemeinsamen Schatten */
    const gruppen = {};
    for (const K of W.k) if (K.gruppe) { (gruppen[K.gruppe] = gruppen[K.gruppe] || []).push(K); K.schatten = false; }
    for (const name in gruppen) {
      const pts = []; for (const K of gruppen[name]) for (const p of K.H.punkte) pts.push(p);
      const H = huelle3(pts);
      M.teil("schatten-" + name, { ebene: 0, schatten: true, mitte: mitteVon(H.punkte) });
      for (const fl of H.flaechen) {
        const [u, v] = rahmenVon(fl.n);
        let mu = Infinity, mv = Infinity, Mu = -Infinity, Mv = -Infinity;
        const q = fl.pts.map((p) => { const a = dot(p, u), b = dot(p, v); mu = Math.min(mu, a); Mu = Math.max(Mu, a); mv = Math.min(mv, b); Mv = Math.max(Mv, b); return [a, b]; });
        M.flaeche({ name: "sch", o: add(add(mul(u, mu), mul(v, mv)), mul(fl.n, fl.d)), u: u, v: v, w: Mu - mu, h: Mv - mv, umriss: q.map((a) => [a[0] - mu, a[1] - mv]), malen: null, keinLicht: true, keinAo: true });
      }
    }
    if (W.grube && W.grube.length) {
      M.teil("grube", { ebene: 0.5, schatten: false, mitte: [0, 0, -2] });
      for (const gf of W.grube) flaecheAusgeben(M, W, gf.fl, { name: "grube" }, gf.m, gf.ebene);
    }
    if (W.boden.length) {
      M.teil("hofboden", { ebene: 0.6, schatten: false, mitte: [0, 0, 0] });
      for (const bf of W.boden) flaecheAusgeben(M, W, bf.fl, { name: bf.name }, bf.m, 0);
    }
    const reihe = ordnen(W);
    reihe.forEach((K, rang) => {
      M.teil(K.name, { ebene: rang + 1, schatten: K.schatten, mitte: K.mitte });
      if (K.figur) { M.figur(K.figur); return; }
      for (const fl of K.H.flaechen) flaecheAusgeben(M, W, fl, K, dot(fl.n, W.B.e) > 0.002 ? K.mal(fl, K) : null);
    });
  }
  function flaecheAusgeben(M, W, fl, K, m, ebene) {
    const [u, v] = rahmenVon(fl.n);
    let mu = Infinity, mv = Infinity, Mu = -Infinity, Mv = -Infinity;
    const q = fl.pts.map((p) => { const a = dot(p, u), b = dot(p, v); mu = Math.min(mu, a); Mu = Math.max(Mu, a); mv = Math.min(mv, b); Mv = Math.max(Mv, b); return [a, b]; });
    const o = add(add(mul(u, mu), mul(v, mv)), mul(fl.n, fl.d));
    const umriss = q.map((a) => [a[0] - mu, a[1] - mv]);
    const basis = { name: K.name + "|" + fl.n.map((x) => x.toFixed(2)).join(","), o: o, u: u, v: v, w: Mu - mu, h: Mv - mv, umriss: umriss, ebene: ebene || 0 };
    if (!m) { M.flaeche(Object.assign(basis, { malen: null, keinLicht: true, keinAo: true })); return; }
    let zmin = Infinity; for (const p of fl.pts) zmin = Math.min(zmin, p[2]);
    const schatten = m.keinSchatten || !K.H ? [] : schattenAufFlaeche(W, fl, K, [u, v]);
    const A0 = mu, B0 = mv;
    const info = { fl: fl, K: K, A0: A0, B0: B0, u: u, v: v, n: fl.n, schatten: schatten, zmin: zmin, W: W };
    const maler = m.malen;
    M.flaeche(Object.assign(basis, {
      ao: !!m.ao && zmin < 0.05, keinAo: !m.ao,
      malen: function (g, F) {
        g.save(); g.translate(-A0, -B0);
        if (maler) maler(g, F, info);
        if (schatten.length) eigenschattenMalen(g, F, info);
        g.restore();
      },
      danach: m.danach ? function (g, F) { g.save(); g.translate(-A0, -B0); m.danach(g, F, info); g.restore(); } : null,
      keinLicht: !!m.keinLicht, lichtExtra: m.lichtExtra
    }));
  }
  function eigenschattenMalen(g, F, info) {
    const Zt = F.zeit;
    const lf = ST.lichtFaktor(F.n, Zt, F.flaeche.lichtExtra, F.jahr);
    const ls = ST.lichtFaktor(F.n, { amb: Zt.amb, sonne: [0, 0, 0] }, F.flaeche.lichtExtra, F.jahr);
    const k = [0, 1, 2].map((i) => Math.round(255 * klemm(ls[i] / Math.max(0.01, lf[i]), 0, 1)));
    g.save();
    g.globalCompositeOperation = "multiply";
    g.fillStyle = "rgb(" + k.join(",") + ")";
    g.beginPath();
    for (const h of info.schatten) { g.moveTo(h[0][0], h[0][1]); for (let i = 1; i < h.length; i++) g.lineTo(h[i][0], h[i][1]); g.closePath(); }
    g.fill("nonzero");
    g.restore();
  }
  function prisma(g2, z0, z1) { const p = []; for (const [x, y] of g2) { p.push([x, y, z0]); p.push([x, y, z1]); } return p; }
  function quaderP(x0, y0, z0, x1, y1, z1) { return prisma([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z0, z1); }

  /* =====================================================================
     HAUPTMASSE
     ===================================================================== */
  /* Sudhaus: Giebel nach Süden, First entlang y */
  const SU = { x0: -1.0, x1: 5.4, y0: -3.5, y1: 3.3, zT: 7.2, neig: 1.0, ue: 0.32, ort: 0.3, d: 0.24 };
  SU.xm = (SU.x0 + SU.x1) / 2; SU.hb = (SU.x1 - SU.x0) / 2; SU.zF = SU.zT + SU.hb * SU.neig;
  SU.dv = SU.d * Math.hypot(1, SU.neig); SU.ze = SU.zT - SU.ue * SU.neig;
  SU.gurt = 3.85;                                  // Gurtgesims zwischen Erdgeschoss und Sudboden
  /* Mälzerei: niedriger, ebenfalls giebelständig, links (Westen) angebaut */
  const MA = { x0: -5.6, x1: -1.0, y0: -4.6, y1: 1.0, zT: 5.4, neig: Math.tan(50 * RAD), ue: 0.3, ort: 0.3, d: 0.22 };
  MA.xm = (MA.x0 + MA.x1) / 2; MA.hb = (MA.x1 - MA.x0) / 2; MA.zF = MA.zT + MA.hb * MA.neig;
  MA.dv = MA.d * Math.hypot(1, MA.neig); MA.ze = MA.zT - MA.ue * MA.neig;
  /* Schlot hinter dem Sudhaus (Kesselhaus) */
  const SCH = { x: 4.55, y: -4.4, hb: 0.58, h0: 2.3, hk: 2.45, top: 15.0, r0: 0.56, r1: 0.4 };
  /* Darrhaube auf dem First der Mälzerei */
  const DR = { x: MA.xm, y: -3.1, hb: 0.64, sockel: 0.22, lam: 1.05, ue: 0.16, spitze: 0.95 };
  const dachZ = (D, x) => D.zT + (D.hb - Math.abs(x - D.xm)) * D.neig + D.dv;   // Dachoberfläche
  /* Baugrube: Hüllvieleck beider Häuser und des Schlotsockels (+0,4 m) */
  const GRUBE = [[-6.0, -5.0], [5.8, -5.0], [5.8, 3.7], [-1.4, 3.7], [-1.4, 1.4], [-6.0, 1.4]];

  /* ---------------- Farben (bei weißem Licht) ---------------- */
  const ZIEGEL = {
    rot: { name: "rot", pal: [[168, 78, 56], [156, 70, 50], [180, 92, 66], [148, 66, 50], [162, 86, 62], [172, 74, 52]], dunkel: [96, 48, 42], fuge: [196, 188, 172] },
    braun: { name: "braun", pal: [[142, 76, 56], [130, 68, 52], [154, 88, 64], [122, 66, 54], [146, 82, 62], [136, 72, 50]], dunkel: [82, 46, 40], fuge: [188, 180, 164] }
  };
  const STEIN = [206, 184, 146];            // heller Burgsandstein (Sohlbänke, Gesimse, Sockel)
  const BIBER = [150, 68, 44];
  const HOLZ = [206, 170, 118];
  const TORFARBEN = [[46, 82, 58], [92, 54, 34], [42, 66, 102]];
  const KUPFER = [184, 98, 50];
  const ZINK = [132, 138, 144];

  /* ---------------- kleine Helfer für Maler ---------------- */
  function tief(I, d) {
    const e = I.W.B.e, en = Math.max(0.14, dot(e, I.n));
    return [d * dot(e, I.u) / en, d * dot(e, I.v) / en];
  }
  function lp(F, I, A, B, r, farbe, k) { if (F.leuchtPunkt) F.leuchtPunkt(A - I.A0, B - I.B0, r, farbe, k); }
  function lichtVon(F, extra) { return ST.lichtFaktor(F.n, F.zeit, extra || 0, F.jahr); }
  function rausch(g, x, y, w, h, meter, staerke, saat, okt) {
    const basis = [3, 17, 29][Math.abs(saat | 0) % 3];
    const dx = hash(saat, 1, 2) * meter * 3.1, dy = hash(saat, 2, 3) * meter * 2.7;
    g.save(); g.translate(dx, dy);
    PI.rauschen(g, x - dx, y - dy, w, h, meter, staerke, basis, okt && okt < 4 ? 3 : 4);
    g.restore();
  }
  function bleich(g, x, y, w, h, meter, staerke, saat) {
    const dx = hash(saat, 5, 2) * meter * 3.1;
    g.save(); g.translate(dx, 0); PI.bleichen(g, x - dx, y, w, h, meter, staerke, 4); g.restore();
  }
  const aufloesung = (F) => Math.min(360, Math.pow(2, Math.ceil(Math.log2(Math.max(F.pxU || F.px, F.pxV || F.px, 1) * 1.05) * 4) / 4));

  /* =====================================================================
     BACKSTEIN
     Kreuzverband: Binder- und Läuferschichten im Wechsel, jede zweite
     Läuferschicht um einen halben Stein versetzt. Stein 25 × 12 × 6,5 cm,
     Fuge 1 cm, Schichthöhe 7,5 cm. Die Steine streuen in der Farbe
     (Brandfarben), einzelne Köpfe sind dunkel überbrannt. Die Fuge liegt
     zurück: unter jedem Stein eine feine Schattenkante in Lichtrichtung.
     Gemalt wird eine nahtlose Kachel (2,0 × 1,2 m) in der Auflösung der
     Fläche und als Muster an die Welt gelegt.
     ===================================================================== */
  const LAGE = 0.075;
  const BKACH = new Map(); let bkPixel = 0;
  function backsteinKachel(pt, Zg, sd) {
    const schl = [pt, Zg.name, sd[0], sd[1]].join("|");
    let K = BKACH.get(schl);
    if (K) return K;
    const NR = 16, Wt = 2.0, Ht = NR * LAGE;
    const cw = Math.max(2, Math.round(Wt * pt)), ch = Math.max(2, Math.round(Ht * pt));
    if (bkPixel + cw * ch > 9e6) { BKACH.clear(); bkPixel = 0; }
    const cv = document.createElement("canvas"); cv.width = cw; cv.height = ch;
    const g = cv.getContext("2d");
    g.scale(cw / Wt, ch / Ht);
    g.fillStyle = rgbS(Zg.fuge); g.fillRect(0, 0, Wt, Ht);
    const m = Math.max(0.008, Math.min(0.013, 0.9 / pt));
    const nF = Zg.pal.length, eimer = [], alle = new Path2D();
    for (let i = 0; i <= nF; i++) eimer.push(new Path2D());
    for (let r = 0; r < NR; r++) {
      const binder = r % 2 === 0, bl = binder ? 0.125 : 0.25;
      const off = binder ? 0 : (r % 4 === 1 ? 0.0625 : 0.1875);
      let i = 0;
      for (let x = -off; x < Wt - 1e-6; x += bl, i++) {
        const h = hash(i, r, 7);
        const k = binder && hash(i, r, 9) < 0.12 ? nF : (h * nF) | 0;
        const y = r * LAGE + m / 2, w = bl - m;
        eimer[k].rect(x + m / 2, y, w, LAGE - m); alle.rect(x + m / 2, y, w, LAGE - m);
        if (x + bl > Wt) { eimer[k].rect(x + m / 2 - Wt, y, w, LAGE - m); alle.rect(x + m / 2 - Wt, y, w, LAGE - m); }
      }
    }
    g.save(); g.translate(sd[0], Math.max(m * 0.5, sd[1])); g.fillStyle = "rgba(46,30,24,0.5)"; g.fill(alle); g.restore();
    for (let i = 0; i < nF; i++) { g.fillStyle = rgbS(Zg.pal[i]); g.fill(eimer[i]); }
    g.fillStyle = rgbS(Zg.dunkel); g.fill(eimer[nF]);
    if (pt > 26) {
      /* Lichtkante oben am Stein und feines Korn */
      g.save(); g.translate(-sd[0] * 0.4, -Math.max(m * 0.3, sd[1] * 0.4));
      g.globalCompositeOperation = "screen"; g.fillStyle = "rgba(60,40,30,0.25)"; g.fill(alle); g.restore();
      for (let i = 0; i < nF; i++) { g.fillStyle = rgbS(Zg.pal[i]); g.save(); g.translate(0, m * 0.3); g.fill(eimer[i]); g.restore(); }
      rausch(g, 0, 0, Wt, Ht, 0.5, 0.2, 5, 3);
    }
    K = { bild: cv, cw: cw, ch: ch, Wt: Wt, Ht: Ht };
    BKACH.set(schl, K); bkPixel += cw * ch;
    return K;
  }
  function backstein(g, F, I, x0, y0, x1, y1, saat) {
    const Zg = I.W.ziegel, px = F.px;
    const mitte = Zg.pal.reduce((a, c) => [a[0] + c[0] / Zg.pal.length, a[1] + c[1] / Zg.pal.length, a[2] + c[2] / Zg.pal.length], [0, 0, 0]);
    if (px * LAGE < 1.7) {
      g.fillStyle = rgbS(mischF(mitte, Zg.fuge, 0.14)); g.fillRect(x0, y0, x1 - x0, y1 - y0);
      if (px * LAGE > 0.8) {
        g.fillStyle = rgbS(Zg.fuge, 0.16);
        for (let y = Math.ceil(y0 / (LAGE * 2)) * LAGE * 2; y < y1; y += LAGE * 2) g.fillRect(x0, y, x1 - x0, LAGE * 0.4);
      }
      rausch(g, x0, y0, x1 - x0, y1 - y0, 3.2, 0.2, saat, 3);
      return;
    }
    const sv = F.schatten ? F.schatten(0.012) : null;
    const sd = sv ? [Math.round(sv[0] / 0.004) * 0.004, Math.round(sv[1] / 0.004) * 0.004] : [0, 0.004];
    const K = backsteinKachel(aufloesung(F), Zg, sd);
    const mu = g.createPattern(K.bild, "repeat");
    mu.setTransform(new DOMMatrix([K.Wt / K.cw, 0, 0, K.Ht / K.ch, 0, 0]));
    g.fillStyle = mu; g.fillRect(x0, y0, x1 - x0, y1 - y0);
    rausch(g, x0, y0, x1 - x0, y1 - y0, 3.6, 0.22, saat, 4);
    if (px > 12) bleich(g, x0, y0, x1 - x0, y1 - y0, 2.4, 0.06, saat + 3);
  }

  /* ---------------- Sandstein (Werkstein) ---------------- */
  function sandstein(g, F, I, x0, y0, x1, y1, saat, opt) {
    opt = opt || {};
    const c = opt.farbe || STEIN, px = F.px, lage = opt.lage || 0.35;
    g.fillStyle = rgbS(hellF(c, -0.22)); g.fillRect(x0, y0, x1 - x0, y1 - y0);
    if (px * lage < 3) {
      g.fillStyle = rgbS(c); g.fillRect(x0, y0, x1 - x0, y1 - y0);
      rausch(g, x0, y0, x1 - x0, y1 - y0, 2.2, 0.18, saat, 3);
      return;
    }
    const f = Math.max(0.01, 0.7 / px), z0 = opt.z0 || 0, cl = opt.block || 0.9;
    const r0 = Math.floor((-y1 - z0) / lage), r1 = Math.ceil((-y0 - z0) / lage);
    const eimer = [new Path2D(), new Path2D(), new Path2D(), new Path2D()], alle = new Path2D();
    for (let r = r0; r < r1; r++) {
      const ya = -(z0 + (r + 1) * lage) + f / 2, yb = -(z0 + r * lage) - f / 2;
      const off = hash(r, 17, saat) * cl;
      const i0 = Math.floor((x0 - off) / cl) - 1, i1 = Math.floor((x1 - off) / cl) + 1;
      const fuge = (i) => off + i * cl + (hash(i, r, saat + 4) - 0.5) * cl * 0.3;
      for (let i = i0; i <= i1; i++) {
        const a = fuge(i) + f / 2, b = fuge(i + 1) - f / 2;
        if (b < x0 - 0.05 || a > x1 + 0.05) continue;
        const k = (hash(i, r, saat + 6) * 4) | 0;
        eimer[k].rect(a, ya, b - a, yb - ya); alle.rect(a, ya, b - a, yb - ya);
      }
    }
    const sv = F.schatten ? F.schatten(0.01) : null;
    if (sv && px > 14) { g.save(); g.translate(sv[0], sv[1]); g.fillStyle = "rgba(70,56,40,0.35)"; g.fill(alle); g.restore(); }
    for (let i = 0; i < 4; i++) { g.fillStyle = rgbS(hellF(c, (i - 1.5) * 0.04)); g.fill(eimer[i]); }
    rausch(g, x0, y0, x1 - x0, y1 - y0, 1.6, 0.2, saat + 2, 4);
    if (px > 24) rausch(g, x0, y0, x1 - x0, y1 - y0, 0.35, 0.14, saat + 9, 3);
  }
  /* waagrechtes Sandsteingesims (z = Oberkante, h = Höhe), mit Schnee */
  function gesims(g, F, I, x0, x1, z, h, vor) {
    const c = STEIN, y = -z;
    const sv = F.schatten ? F.schatten(vor || 0.1) : null;
    if (sv && sv[1] > 0) {
      g.fillStyle = "rgba(30,20,20,0.34)";
      g.beginPath(); g.moveTo(x0, y + h); g.lineTo(x1, y + h); g.lineTo(x1 + sv[0], y + h + sv[1]); g.lineTo(x0 + sv[0], y + h + sv[1]); g.closePath(); g.fill();
    } else {
      const gr = g.createLinearGradient(0, y + h, 0, y + h + 0.2); gr.addColorStop(0, "rgba(20,16,20,0.28)"); gr.addColorStop(1, "rgba(20,16,20,0)");
      g.fillStyle = gr; g.fillRect(x0, y + h, x1 - x0, 0.2);
    }
    g.fillStyle = rgbS(hellF(c, 0.16)); g.fillRect(x0, y, x1 - x0, h * 0.3);
    g.fillStyle = rgbS(c); g.fillRect(x0, y + h * 0.3, x1 - x0, h * 0.45);
    g.fillStyle = rgbS(hellF(c, -0.3)); g.fillRect(x0, y + h * 0.75, x1 - x0, h * 0.25);
    if (F.px * 0.9 > 6) { g.fillStyle = rgbS(hellF(c, -0.35), 0.5); for (let x = Math.ceil(x0 / 0.95) * 0.95; x < x1; x += 0.95) g.fillRect(x, y, Math.max(0.008, 0.7 / F.px), h); }
    rausch(g, x0, y, x1 - x0, h, 1.2, 0.2, 33, 3);
    if (I.W.winter) { g.fillStyle = rgbS(SCHNEE); schneeKante(g, x0, x1, y, 0.055, (z * 13) | 0); }
  }
  function schneeKante(g, x0, x1, y, dick, saat) {
    g.beginPath(); g.moveTo(x0, y + 0.012);
    for (let x = x0; x <= x1 + 0.1; x += 0.1) g.lineTo(Math.min(x, x1), y - dick * (0.55 + 0.45 * hash(Math.round(x * 10), saat, 1)));
    g.lineTo(x1, y + 0.012); g.closePath(); g.fill();
  }
  function schneeWehe(g, F, x0, x1, saat) {
    g.fillStyle = rgbS(SCHNEE);
    g.beginPath(); g.moveTo(x0 - 0.1, 0.1);
    for (let x = x0; x <= x1 + 0.3; x += 0.3) g.lineTo(x, -0.07 - 0.17 * hash(Math.round(x * 3), saat, 4));
    g.lineTo(x1 + 0.1, 0.1); g.closePath(); g.fill();
    g.fillStyle = "rgba(170,188,222,0.35)";
    g.beginPath(); g.moveTo(x0 - 0.1, 0.1);
    for (let x = x0; x <= x1 + 0.3; x += 0.3) g.lineTo(x, -0.02 - 0.05 * hash(Math.round(x * 3), saat, 4));
    g.lineTo(x1 + 0.1, 0.1); g.closePath(); g.fill();
  }

  /* =====================================================================
     ÖFFNUNGEN
     op: { art, a (Mitte, Flächenkoordinate), w, z0 (Sohlbank), zk (Kämpfer),
           innen ("kessel" | "bottich" | "raum" | "stube"), licht (0…1), nr }
     ===================================================================== */
  function rundPfad(p, x, bK, w, bU) {
    const r = w / 2;
    p.moveTo(x, bU); p.lineTo(x, bK); p.arc(x + r, bK, r, Math.PI, 2 * Math.PI); p.lineTo(x + w, bU); p.closePath();
  }
  function stichPfad(p, x, bK, w, bU, stich) {
    /* Stichbogen: Kreisbogen mit Stich (Pfeilhöhe) über der Breite w */
    const R = (w * w / 4 + stich * stich) / (2 * stich), cy = bK - stich + R;
    const phi = Math.asin((w / 2) / R);
    p.moveTo(x, bU); p.lineTo(x, bK);
    p.arc(x + w / 2, cy, R, -Math.PI / 2 - phi, -Math.PI / 2 + phi);
    p.lineTo(x + w, bU); p.closePath();
  }
  /* Rollschicht (hochkant gestellte Steine) über einem Rund- oder Stichbogen */
  function rollschicht(g, F, I, cx, cy, r0, r1, a0, a1, saat, schluss) {
    const Zg = I.W.ziegel, px = F.px;
    const n = Math.max(3, Math.round((a1 - a0) * (r0 + r1) / 2 / 0.083));
    const f = Math.max(0.008, 0.7 / px);
    g.fillStyle = rgbS(Zg.fuge); g.beginPath(); g.arc(cx, cy, r1, a0, a1); g.arc(cx, cy, r0, a1, a0, true); g.closePath(); g.fill();
    if (px * 0.08 < 2) { g.fillStyle = rgbS(hellF(Zg.pal[0], -0.08)); g.fill(); }
    else {
      for (let i = 0; i < n; i++) {
        const b0 = a0 + (a1 - a0) * i / n + f / (2 * r0), b1 = a0 + (a1 - a0) * (i + 1) / n - f / (2 * r0);
        g.fillStyle = rgbS(hellF(Zg.pal[(hash(i, saat, 3) * Zg.pal.length) | 0], -0.06 + (hash(i, saat, 5) - 0.5) * 0.08));
        g.beginPath(); g.arc(cx, cy, r1 - f / 2, b0, b1); g.arc(cx, cy, r0 + f / 2, b1, b0, true); g.closePath(); g.fill();
      }
    }
    if (schluss) {
      /* Schlussstein aus Sandstein */
      const am = (a0 + a1) / 2, da = 0.13 / r1;
      g.fillStyle = rgbS(hellF(STEIN, 0.06));
      g.beginPath(); g.arc(cx, cy, r1 + 0.05, am - da, am + da); g.arc(cx, cy, r0 - 0.02, am + da * 0.75, am - da * 0.75, true); g.closePath(); g.fill();
      g.strokeStyle = rgbS(hellF(STEIN, -0.35), 0.6); g.lineWidth = Math.max(0.008, 0.6 / px); g.stroke();
    }
  }
  /* Sohlbank aus Sandstein mit Schatten und Schnee */
  function sohlbank(g, F, I, x, w, bU, ue) {
    const h = 0.11, xa = x - ue, wa = w + 2 * ue;
    const sv = F.schatten ? F.schatten(0.09) : null;
    if (sv) { g.fillStyle = "rgba(30,22,24,0.34)"; g.beginPath(); g.moveTo(xa, bU + h); g.lineTo(xa + wa, bU + h); g.lineTo(xa + wa + sv[0], bU + h + Math.max(0.02, sv[1])); g.lineTo(xa + sv[0], bU + h + Math.max(0.02, sv[1])); g.closePath(); g.fill(); }
    g.fillStyle = rgbS(hellF(STEIN, 0.18)); g.fillRect(xa, bU - 0.012, wa, 0.04);
    g.fillStyle = rgbS(STEIN); g.fillRect(xa, bU + 0.028, wa, h - 0.05);
    g.fillStyle = rgbS(hellF(STEIN, -0.3)); g.fillRect(xa, bU + h - 0.022, wa, 0.022);
    if (F.px > 30) rausch(g, xa, bU, wa, h, 0.5, 0.2, 7, 3);
    if (I.W.winter) { g.fillStyle = rgbS(SCHNEE); schneeKante(g, xa, xa + wa, bU - 0.01, 0.07, (x * 31) | 0); }
  }
  /* Farbwandler für Innenräume: Tag = Werkstoff, Nacht = warmes Licht */
  const TAGF = (c) => c;
  const NACHTF = (c) => [Math.min(255, c[0] * 1.3 + 30), Math.min(255, c[1] * 0.95 + 14), Math.min(255, c[2] * 0.45 + 4)];
  /* Blick in den Raum hinter dem Glas. (x, bK, w, bU) = Glasfeld,
     d0 = Tiefe des Glases; alles weitere mit eigener Parallaxe */
  function innenraum(g, F, I, op, x, bS, w, bU, fc) {
    const px = F.px, art = op.innen || "raum";
    /* Rückwand (weiß gekalkt, im Halbdunkel) */
    const tv = tief(I, 2.0);
    g.save(); g.translate(tv[0], tv[1]);
    const gr = g.createLinearGradient(0, bS - 0.5, 0, bU + 0.5);
    gr.addColorStop(0, rgbS(fc([44, 42, 42]))); gr.addColorStop(0.6, rgbS(fc([70, 66, 60]))); gr.addColorStop(1, rgbS(fc([54, 48, 42])));
    g.fillStyle = gr; g.fillRect(x - 1, bS - 3, w + 2, bU - bS + 4);
    if (art === "stube" && px > 10) {
      /* Wirtsstube: Holzvertäfelung, Bilderrahmen */
      g.fillStyle = rgbS(fc([84, 56, 36])); g.fillRect(x - 1, bU - 1.0, w + 2, 2);
      g.fillStyle = rgbS(fc([110, 90, 60])); g.fillRect(x + w * 0.25, bU - 1.9, w * 0.3, 0.35);
    }
    g.restore();
    if (art === "kessel" || art === "bottich") {
      /* die kupferne Sudpfanne (oder der Läuterbottich) auf dem Sudboden */
      const tk = tief(I, 0.85);
      g.save(); g.translate(tk[0], tk[1]);
      const cx = op.kx == null ? x + w / 2 : op.kx, zB = op.kz0 || 3.7, zD = op.kz1 || 4.95, R = op.kr || 1.2;
      const kup = art === "kessel" ? KUPFER : [170, 120, 80];
      /* Zarge (Körper) */
      const gk = g.createLinearGradient(cx - R, 0, cx + R, 0);
      gk.addColorStop(0, rgbS(fc(hellF(kup, -0.55)))); gk.addColorStop(0.2, rgbS(fc(hellF(kup, -0.05)))); gk.addColorStop(0.28, rgbS(fc([250, 196, 132])));
      gk.addColorStop(0.34, rgbS(fc(hellF(kup, 0.05)))); gk.addColorStop(0.62, rgbS(fc(hellF(kup, -0.22)))); gk.addColorStop(0.86, rgbS(fc(hellF(kup, -0.45)))); gk.addColorStop(1, rgbS(fc(hellF(kup, -0.6))));
      g.fillStyle = gk; g.fillRect(cx - R, -zD, 2 * R, zD - zB);
      if (art === "kessel") {
        /* Haube: flache Kuppel, darauf der Dunstschlot */
        const hH = 0.85;
        g.beginPath(); g.ellipse(cx, -zD, R, hH, 0, Math.PI, 2 * Math.PI); g.closePath(); g.fill();
        const gd = g.createRadialGradient(cx - R * 0.35, -zD - hH * 0.55, 0.02, cx - R * 0.2, -zD - hH * 0.4, R * 0.9);
        gd.addColorStop(0, rgbS(fc([255, 224, 180]), 0.8)); gd.addColorStop(0.35, rgbS(fc(hellF(kup, 0.2)), 0.3)); gd.addColorStop(1, rgbS(fc(kup), 0));
        g.fillStyle = gd; g.beginPath(); g.ellipse(cx, -zD, R, hH, 0, Math.PI, 2 * Math.PI); g.closePath(); g.fill();
        /* Dunstschlot nach oben */
        const rw = 0.17;
        const gp = g.createLinearGradient(cx - rw, 0, cx + rw, 0);
        gp.addColorStop(0, rgbS(fc(hellF(kup, -0.4)))); gp.addColorStop(0.35, rgbS(fc(hellF(kup, 0.4)))); gp.addColorStop(1, rgbS(fc(hellF(kup, -0.5))));
        g.fillStyle = gp; g.fillRect(cx - rw, -zD - hH - 3, 2 * rw, 3.1);
        /* Messingband am Haubenfuß, Mannloch */
        g.fillStyle = rgbS(fc([214, 178, 96])); g.fillRect(cx - R, -zD - 0.035, 2 * R, 0.07);
        if (px > 14) {
          g.fillStyle = rgbS(fc(hellF(kup, -0.35))); g.beginPath(); g.ellipse(cx + R * 0.38, -zD - hH * 0.32, R * 0.2, hH * 0.2, 0, 0, 2 * Math.PI); g.fill();
          g.strokeStyle = rgbS(fc([226, 190, 110])); g.lineWidth = 0.025; g.stroke();
        }
      }
      /* Nietreihen */
      if (px > 18) {
        g.fillStyle = rgbS(fc(hellF(kup, -0.4)), 0.8);
        for (const z of [zB + 0.35, zB + 0.8, zD - 0.12]) for (let xx = cx - R + 0.06; xx < cx + R; xx += 0.09) { g.beginPath(); g.arc(xx, -z, 0.012, 0, 2 * Math.PI); g.fill(); }
      }
      g.restore();
      /* Geländer des Sudbodens (näher am Fenster → andere Parallaxe) */
      const tg = tief(I, 0.4);
      g.save(); g.translate(tg[0], tg[1]);
      const zr = (op.boden || 3.6) + 0.95;
      g.fillStyle = rgbS(fc([120, 100, 70]));
      g.fillRect(x - 0.5, -zr - 0.015, w + 1, 0.03);
      for (let xx = x - 0.45; xx < x + w + 0.5; xx += 0.62) g.fillRect(xx, -zr, 0.025, 0.95);
      g.restore();
    } else if (art === "malz") {
      /* Tenne: niedrige Decke, Malz auf dem Boden */
      const tm = tief(I, 1.2);
      g.save(); g.translate(tm[0], tm[1]);
      g.fillStyle = rgbS(fc([150, 116, 70])); g.fillRect(x - 1, bU - 0.12, w + 2, 1);
      g.fillStyle = rgbS(fc([60, 44, 34])); g.fillRect(x - 1, bS - 1, w + 2, 1.08);
      g.restore();
    } else {
      /* Leitungen und ein Deckenbalken */
      const tr = tief(I, 1.2);
      g.save(); g.translate(tr[0], tr[1]);
      g.fillStyle = rgbS(fc([72, 56, 44])); g.fillRect(x - 1, bS - 0.2, w + 2, 0.28);
      if (art === "stube" && px > 10) {
        /* Lampe über dem Stammtisch */
        g.fillStyle = rgbS(fc([60, 50, 40])); g.fillRect(x + w * 0.5 - 0.01, bS + 0.05, 0.02, 0.5);
        g.fillStyle = rgbS(fc([220, 200, 150])); g.beginPath(); g.ellipse(x + w * 0.5, bS + 0.6, 0.18, 0.1, 0, Math.PI, 2 * Math.PI); g.fill();
      } else {
        g.fillStyle = rgbS(fc([96, 98, 100])); g.fillRect(x + w * 0.2, bS - 1, 0.09, bU - bS + 2);
      }
      g.restore();
    }
  }
  /* Glas: Himmelsspiegelung (Tag) – leicht, damit man hineinsieht */
  function glasTag(g, F, x, y0, w, y1, saat) {
    const tag = 1 - F.nacht;
    g.fillStyle = "rgba(150,176,206," + (0.16 + 0.1 * tag).toFixed(3) + ")"; g.fillRect(x, y0, w, y1 - y0);
    const k = hash(saat, 3, 1);
    g.fillStyle = "rgba(255,255,255," + (0.07 + 0.1 * tag).toFixed(3) + ")";
    const h = y1 - y0, x0 = x + w * (0.1 + 0.3 * k);
    g.beginPath(); g.moveTo(x0, y1); g.lineTo(x0 + h * 0.5, y0); g.lineTo(x0 + h * 0.5 + w * 0.22, y0); g.lineTo(x0 + w * 0.22, y1); g.closePath(); g.fill();
    g.fillStyle = "rgba(255,255,255," + (0.04 + 0.05 * tag).toFixed(3) + ")";
    g.beginPath(); g.moveTo(x0 + w * 0.34, y1); g.lineTo(x0 + h * 0.5 + w * 0.34, y0); g.lineTo(x0 + h * 0.5 + w * 0.42, y0); g.lineTo(x0 + w * 0.42, y1); g.closePath(); g.fill();
  }
  /* gusseisernes Sprossenwerk eines Rundbogenfensters */
  function sprossenRund(g, F, x, bK, w, bU, farbe, nacht) {
    const r = w / 2, cx = x + r, px = F.px, rb = 0.045;
    const sb = Math.max(0.018, 0.9 / px);
    g.fillStyle = farbe;
    /* Blendrahmen */
    g.save(); const p = new Path2D(); rundPfad(p, x, bK, w, bU); const q = new Path2D(); rundPfad(q, x + rb, bK, w - 2 * rb, bU - rb); p.addPath(q); g.fill(p, "evenodd"); g.restore();
    if (px * w < 6) return;
    const nV = Math.max(2, Math.round(w / 0.28));
    for (let i = 1; i < nV; i++) g.fillRect(x + w * i / nV - sb / 2, bK, sb, bU - bK);
    for (let y = bU - 0.36; y > bK + 0.1; y -= 0.36) g.fillRect(x, y - sb / 2, w, sb);
    g.fillRect(x, bK - sb / 2, w, sb * 1.4);
    /* Bogenfeld: Fächer und innerer Ring */
    g.strokeStyle = farbe; g.lineWidth = sb;
    g.beginPath(); g.arc(cx, bK, r * 0.45, Math.PI, 2 * Math.PI); g.stroke();
    for (let i = 1; i < nV; i++) { const a = Math.PI + Math.PI * i / nV; g.beginPath(); g.moveTo(cx + Math.cos(a) * r * 0.45, bK + Math.sin(a) * r * 0.45); g.lineTo(cx + Math.cos(a) * r, bK + Math.sin(a) * r); g.stroke(); }
    if (!nacht && px > 26) {
      /* Kippflügel in der Mitte, einen Spalt offen */
      g.fillStyle = "rgba(255,255,255,0.18)"; g.fillRect(x + rb, bU - 0.72 - 0.01, w - 2 * rb, 0.012);
    }
  }
  function rundbogenFenster(g, F, I, op) {
    const w = op.w, x = op.a - w / 2, r = w / 2, bU = -op.z0, bK = -op.zk, cx = op.a;
    const W = I.W, roh = !W.Z.fenster(op.nr || 0);
    /* Rollschicht mit Schlussstein, Sohlbank */
    rollschicht(g, F, I, cx, bK, r, r + 0.25, Math.PI, 2 * Math.PI, (op.nr || 0) * 7 + 3, true);
    /* Öffnung */
    g.save();
    const p = new Path2D(); rundPfad(p, x, bK, w, bU); g.clip(p);
    g.fillStyle = rgbS(hellF(W.ziegel.pal[1], -0.25)); g.fillRect(x - 0.1, bK - r - 0.1, w + 0.2, bU - bK + r + 0.2);
    if (roh) {
      /* Rohbau: offen, man sieht ins Dunkel */
      g.fillStyle = "rgba(34,30,30,0.92)"; const t0 = tief(I, 0.36); g.save(); g.translate(t0[0], t0[1]); g.fill(p); g.restore();
    } else {
      const tg = tief(I, 0.16);
      g.save(); g.translate(tg[0], tg[1]); g.clip(p);
      innenraum(g, F, I, op, x, bK - r, w, bU, TAGF);
      glasTag(g, F, x, bK - r, w, bU, op.nr || 1);
      sprossenRund(g, F, x, bK, w, bU, rgbS(op.rahmen || [52, 62, 58]), false);
      g.restore();
    }
    /* Schatten der Laibung */
    const sv = F.schatten ? F.schatten(0.36) : null;
    if (sv) {
      const q = new Path2D(); q.rect(x - 2, bK - r - 2, w + 4, bU - bK + r + 4);
      const s2 = new Path2D(); rundPfad(s2, x + sv[0], bK + sv[1], w, bU + sv[1] + 1); q.addPath(s2);
      g.fillStyle = "rgba(14,12,26,0.42)"; g.fill(q, "evenodd");
    } else { g.fillStyle = "rgba(14,12,26,0.2)"; g.fillRect(x, bK - r, w, 0.3); }
    g.restore();
    sohlbank(g, F, I, x, w, bU, 0.08);
  }
  function rundbogenNacht(g, F, I, op) {
    const an = op.licht || 0;
    if (an <= 0 || F.nacht < 0.02 || !I.W.Z.licht || !I.W.Z.fenster(op.nr || 0)) return;
    const w = op.w, x = op.a - w / 2, r = w / 2, bU = -op.z0, bK = -op.zk;
    const p = new Path2D(); rundPfad(p, x, bK, w, bU);
    g.save(); g.clip(p);
    const tg = tief(I, 0.16);
    g.translate(tg[0], tg[1]); g.clip(p);
    g.globalAlpha = klemm(F.nacht * an, 0, 1);
    innenraum(g, F, I, op, x, bK - r, w, bU, NACHTF);
    const gl = g.createRadialGradient(op.a, bU - (bU - bK) * 0.3, 0.05, op.a, bU - (bU - bK) * 0.4, Math.max(w, bU - bK + r));
    gl.addColorStop(0, "rgba(255,214,150,0.35)"); gl.addColorStop(1, "rgba(255,170,90,0)");
    g.fillStyle = gl; g.fillRect(x, bK - r, w, bU - bK + r);
    sprossenRund(g, F, x, bK, w, bU, "rgb(40,30,24)", true);
    g.restore();
    lp(F, I, op.a, bU - (bU - bK + r) * 0.45, Math.max(w, 1.2) * 1.2, "255,196,120", 0.5 * an);
  }
  /* Kleines Stichbogenfenster der Mälzerei (Holzrahmen, Lamellenladen) */
  function stichFenster(g, F, I, op) {
    const w = op.w, h = op.h, x = op.a - w / 2, bU = -op.z0, bK = bU - h, st = 0.1;
    const W = I.W, roh = !W.Z.fenster(op.nr || 0), px = F.px;
    const R = (w * w / 4 + st * st) / (2 * st), cy = bK - st + R, phi = Math.asin((w / 2) / R);
    rollschicht(g, F, I, x + w / 2, cy, R, R + 0.24, -Math.PI / 2 - phi - 0.05, -Math.PI / 2 + phi + 0.05, (op.nr || 0) * 5 + 1, false);
    g.save();
    const p = new Path2D(); stichPfad(p, x, bK, w, bU, st); g.clip(p);
    g.fillStyle = rgbS(hellF(W.ziegel.pal[1], -0.25)); g.fillRect(x - 0.1, bK - 0.2, w + 0.2, h + 0.3);
    if (roh) { g.fillStyle = "rgba(34,30,30,0.92)"; const t0 = tief(I, 0.3); g.save(); g.translate(t0[0], t0[1]); g.fill(p); g.restore(); }
    else {
      const tg = tief(I, 0.12);
      g.save(); g.translate(tg[0], tg[1]); g.clip(p);
      innenraum(g, F, I, op, x, bK - st, w, bU, TAGF);
      glasTag(g, F, x, bK - st, w, bU, (op.nr || 1) + 5);
      holzRahmen(g, F, x, bK - st, w, bU, op.rahmen || [236, 230, 216]);
      g.restore();
    }
    const sv = F.schatten ? F.schatten(0.3) : null;
    if (sv) { const q = new Path2D(); q.rect(x - 2, bK - 2, w + 4, h + 4); const s2 = new Path2D(); stichPfad(s2, x + sv[0], bK + sv[1], w, bU + sv[1] + 1, st); q.addPath(s2); g.fillStyle = "rgba(14,12,26,0.4)"; g.fill(q, "evenodd"); }
    g.restore();
    /* Lamellenladen (halb aufgeklappt oder zu), sonst Sohlbank */
    if (!roh && op.laden != null && px > 5) lamellenLaden(g, F, I, x, bK - st, w, bU, op.laden, op.ladenFarbe || W.torFarbe);
    sohlbank(g, F, I, x, w, bU, 0.06);
  }
  function holzRahmen(g, F, x, y0, w, y1, c) {
    const rb = 0.05, sb = Math.max(0.014, 0.8 / F.px);
    g.fillStyle = rgbS(c);
    g.fillRect(x, y0, rb, y1 - y0); g.fillRect(x + w - rb, y0, rb, y1 - y0); g.fillRect(x, y1 - rb, w, rb); g.fillRect(x, y0, w, rb * 1.2);
    g.fillRect(x + w / 2 - rb * 0.5, y0, rb, y1 - y0);
    for (let k = 1; k < 3; k++) g.fillRect(x, y0 + (y1 - y0) * k / 3 - sb / 2, w, sb);
    g.fillStyle = rgbS(hellF(c, -0.3), 0.7); g.fillRect(x + rb, y1 - rb, w - 2 * rb, 0.012);
  }
  function lamellenLaden(g, F, I, x, y0, w, y1, zu, farbe) {
    /* zu = 0 … 1: der Laden hängt oben am Kloben und steht unten ab */
    const hh = (y1 - y0) * (0.35 + 0.65 * zu), c = farbe;
    const sv = F.schatten ? F.schatten(0.08 + (1 - zu) * 0.2) : null;
    if (sv) { g.fillStyle = "rgba(20,16,24,0.35)"; g.fillRect(x + sv[0], y0 + sv[1], w, hh); }
    g.fillStyle = rgbS(c); g.fillRect(x - 0.02, y0, w + 0.04, hh);
    if (F.px > 8) {
      for (let y = y0 + 0.04; y < y0 + hh - 0.02; y += 0.07) { g.fillStyle = rgbS(hellF(c, -0.35)); g.fillRect(x, y + 0.035, w, 0.02); g.fillStyle = rgbS(hellF(c, 0.18)); g.fillRect(x, y, w, 0.012); }
      g.fillStyle = rgbS(hellF(c, -0.2)); g.fillRect(x - 0.02, y0, 0.05, hh); g.fillRect(x + w - 0.03, y0, 0.05, hh);
    }
  }
  function lamellenNacht(g, F, I, op) {
    const an = op.licht || 0;
    if (an <= 0 || F.nacht < 0.02 || !I.W.Z.licht) return;
    const w = op.w, h = op.h, x = op.a - w / 2, bU = -op.z0, bK = bU - h, st = 0.1;
    const p = new Path2D(); stichPfad(p, x, bK, w, bU, st);
    g.save(); g.clip(p); const tg = tief(I, 0.12); g.translate(tg[0], tg[1]); g.clip(p);
    g.globalAlpha = klemm(F.nacht * an, 0, 1);
    innenraum(g, F, I, op, x, bK - st, w, bU, NACHTF);
    holzRahmen(g, F, x, bK - st, w, bU, [60, 44, 34]);
    g.restore();
    if (op.laden != null) { g.save(); g.globalAlpha = 1; lamellenLaden(g, F, I, x, bK - st, w, bU, op.laden, hellF(I.W.torFarbe, -0.5)); g.restore(); }
    lp(F, I, op.a, bU - h * 0.5, 0.9, "255,190,110", 0.4 * an);
  }
  /* Ochsenauge (Rundfenster) im Giebel */
  function ochsenauge(g, F, I, op) {
    const cx = op.a, cy = -op.z, r = op.r, W = I.W;
    rollschicht(g, F, I, cx, cy, r, r + 0.22, 0, 2 * Math.PI, 17, false);
    g.save(); g.beginPath(); g.arc(cx, cy, r, 0, 2 * Math.PI); g.clip();
    g.fillStyle = rgbS(hellF(W.ziegel.pal[1], -0.25)); g.fillRect(cx - r, cy - r, 2 * r, 2 * r);
    const tg = tief(I, 0.14); g.translate(tg[0], tg[1]);
    g.fillStyle = "rgb(40,40,44)"; g.fillRect(cx - r, cy - r, 2 * r, 2 * r);
    glasTag(g, F, cx - r, cy - r, 2 * r, cy + r, 9);
    g.strokeStyle = "rgb(52,62,58)"; g.lineWidth = Math.max(0.03, 0.9 / F.px);
    g.beginPath(); g.moveTo(cx - r, cy); g.lineTo(cx + r, cy); g.moveTo(cx, cy - r); g.lineTo(cx, cy + r); g.stroke();
    g.beginPath(); g.arc(cx, cy, r * 0.5, 0, 2 * Math.PI); g.stroke();
    g.restore();
    const sv = F.schatten ? F.schatten(0.3) : null;
    if (sv) { g.save(); g.beginPath(); g.arc(cx, cy, r, 0, 2 * Math.PI); g.clip(); g.beginPath(); g.rect(cx - 2, cy - 2, 4, 4); g.arc(cx + sv[0], cy + sv[1], r, 0, 2 * Math.PI, true); g.fillStyle = "rgba(14,12,26,0.4)"; g.fill(); g.restore(); }
  }
  /* Das Sudhaustor: Rundbogen in Sandsteingewände, zweiflügelig mit
     Fischgrätbrettern, darüber ein Oberlicht mit Fächersprossen */
  function tor(g, F, I, op) {
    const w = op.w, x = op.a - w / 2, bU = -op.z0, bK = -op.zk, r = w / 2, cx = op.a, W = I.W, px = F.px;
    const gw = 0.2;
    /* Gewände mit Kämpfer und Schlussstein */
    g.fillStyle = rgbS(STEIN);
    g.beginPath(); g.moveTo(x - gw, bU); g.lineTo(x - gw, bK); g.arc(cx, bK, r + gw, Math.PI, 2 * Math.PI); g.lineTo(x + w + gw, bU); g.closePath(); g.fill();
    g.save(); g.beginPath(); g.moveTo(x - gw, bU); g.lineTo(x - gw, bK); g.arc(cx, bK, r + gw, Math.PI, 2 * Math.PI); g.lineTo(x + w + gw, bU); g.closePath(); g.clip();
    sandstein(g, F, I, x - gw - 0.05, bK - r - gw - 0.05, x + w + gw + 0.05, bU, 41, { lage: 0.3, block: 0.45 });
    g.restore();
    g.fillStyle = rgbS(hellF(STEIN, 0.1)); g.fillRect(x - gw - 0.04, bK - 0.06, gw + 0.06, 0.12); g.fillRect(x + w - 0.02, bK - 0.06, gw + 0.06, 0.12);
    g.fillStyle = rgbS(hellF(STEIN, 0.14)); g.beginPath(); g.moveTo(cx - 0.12, bK - r - gw - 0.05); g.lineTo(cx + 0.12, bK - r - gw - 0.05); g.lineTo(cx + 0.08, bK - r + 0.05); g.lineTo(cx - 0.08, bK - r + 0.05); g.closePath(); g.fill();
    if (px > 30) { g.fillStyle = "rgba(80,60,40,0.8)"; g.font = "bold 0.07px serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("1878", cx, bK - r - 0.08); }
    /* Öffnung */
    g.save();
    const p = new Path2D(); rundPfad(p, x, bK, w, bU); g.clip(p);
    g.fillStyle = rgbS(hellF(STEIN, -0.3)); g.fillRect(x - 0.1, bK - r - 0.1, w + 0.2, bU - bK + r + 0.2);
    const offen = !W.Z.tueren;
    const tv = tief(I, 0.3); g.save(); g.translate(tv[0], tv[1]); g.clip(p);
    if (offen) { g.fillStyle = "rgb(30,26,26)"; g.fillRect(x - 0.5, bK - r - 0.5, w + 1, bU - bK + r + 1); }
    else {
      /* Oberlicht */
      g.fillStyle = "rgb(36,40,46)"; g.beginPath(); g.arc(cx, bK, r, Math.PI, 2 * Math.PI); g.closePath(); g.fill();
      glasTag(g, F, x, bK - r, w, bK, 13);
      g.strokeStyle = "rgb(40,44,40)"; g.lineWidth = Math.max(0.02, 0.8 / px);
      for (let i = 1; i < 6; i++) { const a = Math.PI + Math.PI * i / 6; g.beginPath(); g.moveTo(cx, bK); g.lineTo(cx + Math.cos(a) * r, bK + Math.sin(a) * r); g.stroke(); }
      g.beginPath(); g.arc(cx, bK, r * 0.3, Math.PI, 2 * Math.PI); g.stroke();
      /* Kämpferholz */
      const c = W.torFarbe;
      g.fillStyle = rgbS(hellF(c, -0.1)); g.fillRect(x, bK - 0.04, w, 0.12);
      /* zwei Flügel mit Fischgrätbrettern in Rahmen */
      for (const s of [0, 1]) {
        const fx = x + s * w / 2, fw = w / 2;
        g.fillStyle = rgbS(c); g.fillRect(fx, bK + 0.08, fw, bU - bK - 0.08);
        if (px > 9) {
          g.save(); g.beginPath(); g.rect(fx + 0.08, bK + 0.16, fw - 0.16, bU - bK - 0.24); g.clip();
          g.strokeStyle = rgbS(hellF(c, -0.3)); g.lineWidth = Math.max(0.01, 0.6 / px);
          const dir = s ? -1 : 1;
          for (let y = bK - 1; y < bU + 1; y += 0.11) { g.beginPath(); g.moveTo(fx, y); g.lineTo(fx + fw, y + dir * fw * 0.9); g.stroke(); }
          g.restore();
          g.strokeStyle = rgbS(hellF(c, -0.4)); g.lineWidth = Math.max(0.012, 0.7 / px);
          g.strokeRect(fx + 0.08, bK + 0.16, fw - 0.16, bU - bK - 0.24);
          g.strokeStyle = rgbS(hellF(c, 0.25), 0.6); g.strokeRect(fx + 0.095, bK + 0.175, fw - 0.16, bU - bK - 0.24);
        }
        g.fillStyle = rgbS(hellF(c, -0.45)); g.fillRect(fx + (s ? 0 : fw - 0.012), bK + 0.08, 0.012, bU - bK);
      }
      /* Beschläge: Griffe und Schloss */
      g.fillStyle = "rgb(196,160,84)"; g.fillRect(cx - 0.09, bU - 1.12, 0.035, 0.18); g.fillRect(cx + 0.055, bU - 1.12, 0.035, 0.18);
      g.fillStyle = "rgb(34,30,28)"; for (const yy of [bK + 0.4, bU - 0.4]) { g.fillRect(x, yy, 0.3, 0.035); g.fillRect(x + w - 0.3, yy, 0.3, 0.035); }
      rausch(g, x, bK - r, w, bU - bK + r, 0.8, 0.22, 12, 3);
      if (W.winter && W.Z.deko) kranz(g, F, cx, bK + 0.62, 0.3);
    }
    g.restore();
    const sv = F.schatten ? F.schatten(0.3) : null;
    if (sv) { const q = new Path2D(); q.rect(x - 2, bK - r - 2, w + 4, bU - bK + r + 4); const s2 = new Path2D(); rundPfad(s2, x + sv[0], bK + sv[1], w, bU + sv[1] + 1); q.addPath(s2); g.fillStyle = "rgba(14,12,26,0.4)"; g.fill(q, "evenodd"); }
    g.restore();
  }
  function torNacht(g, F, I, op) {
    if (F.nacht < 0.02 || !I.W.Z.licht) return;
    const w = op.w, r = w / 2, cx = op.a, bK = -op.zk;
    g.save(); g.beginPath(); g.arc(cx, bK, r, Math.PI, 2 * Math.PI); g.closePath(); g.clip();
    const tv = tief(I, 0.3); g.translate(tv[0], tv[1]);
    g.globalAlpha = F.nacht * 0.9;
    const gl = g.createRadialGradient(cx, bK, 0, cx, bK, r);
    gl.addColorStop(0, "rgb(255,214,150)"); gl.addColorStop(1, "rgb(230,150,70)");
    g.fillStyle = gl; g.fillRect(cx - r, bK - r, 2 * r, r);
    g.strokeStyle = "rgb(50,36,28)"; g.lineWidth = Math.max(0.02, 0.8 / F.px);
    for (let i = 1; i < 6; i++) { const a = Math.PI + Math.PI * i / 6; g.beginPath(); g.moveTo(cx, bK); g.lineTo(cx + Math.cos(a) * r, bK + Math.sin(a) * r); g.stroke(); }
    g.beginPath(); g.arc(cx, bK, r * 0.3, Math.PI, 2 * Math.PI); g.stroke();
    g.restore();
    lp(F, I, cx, bK - r * 0.4, 1.0, "255,196,120", 0.35);
  }
  /* Tür der Mälzerei (Brettertür mit Stichbogen) */
  function kleineTuer(g, F, I, op) {
    const w = op.w, h = op.h, x = op.a - w / 2, bU = -op.z0, bK = bU - h, st = 0.12, W = I.W;
    const R = (w * w / 4 + st * st) / (2 * st), cy = bK - st + R, phi = Math.asin((w / 2) / R);
    rollschicht(g, F, I, x + w / 2, cy, R, R + 0.24, -Math.PI / 2 - phi - 0.05, -Math.PI / 2 + phi + 0.05, 23, false);
    g.save(); const p = new Path2D(); stichPfad(p, x, bK, w, bU, st); g.clip(p);
    g.fillStyle = rgbS(hellF(W.ziegel.pal[1], -0.25)); g.fillRect(x - 0.1, bK - 0.3, w + 0.2, h + 0.4);
    const tv = tief(I, 0.25); g.translate(tv[0], tv[1]); g.clip(p);
    if (!W.Z.tueren) { g.fillStyle = "rgb(30,26,26)"; g.fillRect(x - 0.3, bK - 0.3, w + 0.6, h + 0.6); }
    else {
      const c = W.torFarbe;
      for (let i = 0; i < 6; i++) { g.fillStyle = rgbS(hellF(c, (hash(i, 3, 5) - 0.5) * 0.14)); g.fillRect(x + w * i / 6, bK - 0.3, w / 6 + 0.003, h + 0.4); }
      if (F.px > 10) {
        g.fillStyle = rgbS(hellF(c, -0.4)); for (let i = 1; i < 6; i++) g.fillRect(x + w * i / 6 - 0.006, bK - 0.3, 0.012, h + 0.4);
        g.fillStyle = rgbS(hellF(c, -0.15)); g.fillRect(x, bK + 0.35, w, 0.1); g.fillRect(x, bU - 0.45, w, 0.1);
        g.fillStyle = "rgb(34,30,28)"; g.fillRect(x, bK + 0.37, w * 0.7, 0.03); g.fillRect(x, bU - 0.43, w * 0.7, 0.03);
        g.beginPath(); g.arc(x + w - 0.12, bU - 1.0, 0.03, 0, 2 * Math.PI); g.fill();
      }
      rausch(g, x, bK, w, h, 0.8, 0.25, 21, 3);
    }
    g.restore();
    g.save(); g.clip(p);
    const sv = F.schatten ? F.schatten(0.25) : null;
    if (sv) { const q = new Path2D(); q.rect(x - 2, bK - 2, w + 4, h + 4); const s2 = new Path2D(); stichPfad(s2, x + sv[0], bK + sv[1], w, bU + sv[1] + 1, st); q.addPath(s2); g.fillStyle = "rgba(14,12,26,0.4)"; g.fill(q, "evenodd"); }
    g.restore();
  }
  /* Tannenkranz mit roter Schleife */
  function kranz(g, F, cx, cy, R) {
    const rng = zuf(77);
    g.strokeStyle = "rgb(34,70,44)"; g.lineWidth = R * 0.32; g.beginPath(); g.arc(cx, cy, R * 0.8, 0, 2 * Math.PI); g.stroke();
    if (F.px > 16) {
      g.lineWidth = Math.max(0.008, 0.7 / F.px);
      for (let i = 0; i < 90; i++) { const a = rng() * 2 * Math.PI, rr = R * (0.62 + rng() * 0.36); g.strokeStyle = rgbS(hellF([40, 84, 50], (rng() - 0.5) * 0.4)); g.beginPath(); g.moveTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); g.lineTo(cx + Math.cos(a + 0.25) * (rr + 0.03), cy + Math.sin(a + 0.25) * (rr + 0.03)); g.stroke(); }
      g.fillStyle = "rgba(246,249,253,0.9)"; for (let i = 0; i < 10; i++) { const a = Math.PI * (1.1 + rng() * 0.8); g.beginPath(); g.ellipse(cx + Math.cos(a) * R * 0.8, cy + Math.sin(a) * R * 0.8 - 0.02, 0.05, 0.02, 0, 0, 2 * Math.PI); g.fill(); }
    }
    g.fillStyle = "rgb(178,22,38)";
    g.beginPath(); g.moveTo(cx, cy + R * 0.8); g.lineTo(cx - 0.12, cy + R * 0.8 - 0.07); g.lineTo(cx - 0.11, cy + R * 0.8 + 0.07); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(cx, cy + R * 0.8); g.lineTo(cx + 0.12, cy + R * 0.8 - 0.07); g.lineTo(cx + 0.11, cy + R * 0.8 + 0.07); g.closePath(); g.fill();
    g.fillRect(cx - 0.035, cy + R * 0.8, 0.03, 0.2); g.fillRect(cx + 0.01, cy + R * 0.8, 0.03, 0.18);
  }
  /* Das Schild: gemalte Lettern „Brauerei" auf einem hellen Putzfeld mit
     profiliertem Sandsteinrahmen */
  function schild(g, F, I, op) {
    const w = op.w, h = op.h, x = op.a - w / 2, y = -op.z1, px = F.px;
    const sv = F.schatten ? F.schatten(0.06) : null;
    if (sv) { g.fillStyle = "rgba(30,20,20,0.3)"; PI.rundRechteck(g, x + sv[0], y + sv[1], w, h, 0.05); g.fill(); }
    g.fillStyle = rgbS(STEIN); PI.rundRechteck(g, x, y, w, h, 0.05); g.fill();
    g.fillStyle = rgbS(hellF(STEIN, -0.3)); PI.rundRechteck(g, x + 0.05, y + 0.05, w - 0.1, h - 0.1, 0.03); g.fill();
    g.fillStyle = "rgb(236,226,200)"; PI.rundRechteck(g, x + 0.07, y + 0.07, w - 0.14, h - 0.14, 0.025); g.fill();
    rausch(g, x, y, w, h, 0.8, 0.2, 51, 3);
    if (!I.W.Z.schild) return;
    if (px * h < 5) { g.fillStyle = "rgba(40,50,40,0.55)"; g.fillRect(x + 0.25, y + h * 0.35, w - 0.5, h * 0.3); return; }
    const txt = "BRAUEREI";
    const fh = h * 0.56;
    g.save();
    g.font = "bold " + fh.toFixed(3) + "px Georgia, 'Times New Roman', serif";
    g.textAlign = "center"; g.textBaseline = "middle";
    const breite = g.measureText(txt).width, soll = w - 0.5;
    const k = Math.min(1.25, soll / Math.max(0.01, breite));
    g.translate(op.a, y + h / 2 + h * 0.03); g.scale(k, 1);
    /* Schattenkante (gemalt), dann Goldkontur, dann die Lettern */
    g.fillStyle = "rgba(120,90,40,0.55)"; g.fillText(txt, 0.015 / k, 0.015);
    g.lineWidth = Math.max(0.012, 1.1 / px); g.strokeStyle = "rgb(190,150,70)"; g.strokeText(txt, 0, 0);
    g.fillStyle = "rgb(36,52,40)"; g.fillText(txt, 0, 0);
    g.restore();
    if (px > 40) {
      g.fillStyle = "rgb(150,112,52)";
      for (const s of [-1, 1]) { g.beginPath(); g.arc(op.a + s * (w / 2 - 0.16), y + h / 2, 0.035, 0, 2 * Math.PI); g.fill(); }
    }
  }
  /* Schildleuchte: nachts ein warmer Lichtkegel von oben auf das Schild */
  function schildNacht(g, F, I, op) {
    if (F.nacht < 0.02 || !I.W.Z.licht) return;
    const w = op.w, h = op.h, x = op.a - w / 2, y = -op.z1;
    g.save(); g.globalCompositeOperation = "screen";
    const gr = g.createRadialGradient(op.a, y - 0.1, 0.05, op.a, y + h * 0.4, w * 0.62);
    gr.addColorStop(0, "rgba(255,210,150," + (0.55 * F.nacht).toFixed(3) + ")"); gr.addColorStop(1, "rgba(255,190,120,0)");
    g.fillStyle = gr; g.fillRect(x - 0.5, y - 0.5, w + 1, h + 1);
    g.restore();
    lp(F, I, op.a, y + h * 0.3, 1.4, "255,200,140", 0.25);
  }
  /* Maueranker: geschmiedetes S am Ende der Deckenbalken */
  function anker(g, F, a, z) {
    if (F.px < 7) return;
    const y = -z, s = 0.2;
    const sv = F.schatten ? F.schatten(0.03) : [0.01, 0.01];
    for (const [dx, dy, c] of [[sv ? sv[0] : 0.01, sv ? sv[1] : 0.01, "rgba(20,14,14,0.4)"], [0, 0, "rgb(40,36,34)"]]) {
      g.strokeStyle = c; g.lineWidth = 0.035; g.lineCap = "round";
      g.beginPath(); g.moveTo(a + dx, y - s + dy); g.bezierCurveTo(a + 0.12 + dx, y - s * 0.7 + dy, a - 0.12 + dx, y + s * 0.7 + dy, a + dx, y + s + dy); g.stroke();
      g.fillStyle = c; g.beginPath(); g.arc(a + dx, y + dy, 0.03, 0, 2 * Math.PI); g.fill();
    }
    g.lineCap = "butt";
  }

  /* =====================================================================
     SCHMUCK DER WAND: Lisenen, Rundbogenfries, Deutsches Band, Ortgang
     ===================================================================== */
  function lisene(g, F, I, a0, a1, y0, y1) {
    /* Lisene: 6 cm vorstehender Mauerstreifen – Seitenlicht und Schatten */
    const sv = F.schatten ? F.schatten(0.06) : null;
    if (sv) {
      g.fillStyle = "rgba(34,20,18,0.32)";
      if (sv[0] > 0) g.fillRect(a1, y0, sv[0], y1 - y0); else g.fillRect(a0 + sv[0], y0, -sv[0], y1 - y0);
    }
    const tv = tief(I, -0.06);
    g.fillStyle = "rgba(255,230,210,0.10)"; g.fillRect(a0, y0, a1 - a0, y1 - y0);
    g.fillStyle = "rgba(40,20,16,0.35)";
    if (tv[0] > 0.002) g.fillRect(a1, y0, Math.min(0.06, tv[0]), y1 - y0);
    else if (tv[0] < -0.002) g.fillRect(a0 + Math.max(-0.06, tv[0]), y0, Math.min(0.06, -tv[0]), y1 - y0);
  }
  function fries(g, F, I, x0, x1, zT, saat) {
    /* Unter der Traufe (zT): Kranzschicht, Deutsches Band, Rundbogenfries */
    const Zg = I.W.ziegel, px = F.px, y = -zT;
    const sv = F.schatten ? F.schatten(0.08) : null;
    const hK = 0.15, hD = 0.12, hB = 0.3;
    /* Schatten unter dem vorspringenden Fries */
    if (sv && sv[1] > 0) { g.fillStyle = "rgba(30,16,16,0.3)"; g.fillRect(x0, y + hK + hD + hB, x1 - x0, Math.max(0.03, sv[1])); }
    /* Kranzschicht: zwei vorkragende Schichten, oben hell */
    g.fillStyle = rgbS(hellF(Zg.pal[2], -0.05)); g.fillRect(x0, y, x1 - x0, hK);
    g.fillStyle = rgbS(hellF(Zg.pal[2], 0.12)); g.fillRect(x0, y, x1 - x0, 0.03);
    g.fillStyle = "rgba(30,16,16,0.35)"; g.fillRect(x0, y + hK - 0.02, x1 - x0, 0.02);
    if (px * 0.06 < 1.4) { g.fillStyle = rgbS(hellF(Zg.pal[0], -0.12)); g.fillRect(x0, y + hK, x1 - x0, hD + hB); return; }
    /* Deutsches Band: übereck gestellte Steine – Sägezahn aus Licht und Schatten */
    const yd = y + hK, n = Math.ceil((x1 - x0) / 0.125) + 1, s0 = Math.floor(x0 / 0.125) * 0.125;
    g.fillStyle = rgbS(Zg.fuge); g.fillRect(x0, yd, x1 - x0, hD);
    for (let i = 0; i < n; i++) {
      const xa = s0 + i * 0.125;
      g.fillStyle = rgbS(hellF(Zg.pal[i % Zg.pal.length], 0.1)); g.beginPath(); g.moveTo(xa, yd + 0.01); g.lineTo(xa + 0.0625, yd + 0.01); g.lineTo(xa, yd + hD - 0.01); g.closePath(); g.fill();
      g.fillStyle = rgbS(hellF(Zg.pal[(i + 2) % Zg.pal.length], -0.3)); g.beginPath(); g.moveTo(xa + 0.0625, yd + 0.01); g.lineTo(xa + 0.125, yd + hD - 0.01); g.lineTo(xa, yd + hD - 0.01); g.closePath(); g.fill();
    }
    /* Rundbogenfries: kleine Bögen auf Konsolsteinen, die Felder vertieft */
    const yb = yd + hD, bw = 0.42, rb = 0.15, m0 = Math.floor(x0 / bw) * bw;
    for (let xa = m0; xa < x1; xa += bw) {
      const cx = xa + bw / 2;
      g.fillStyle = "rgba(40,22,20,0.42)"; g.beginPath(); g.moveTo(cx - rb, yb + hB); g.lineTo(cx - rb, yb + 0.12); g.arc(cx, yb + 0.12, rb, Math.PI, 2 * Math.PI); g.lineTo(cx + rb, yb + hB); g.closePath(); g.fill();
      g.strokeStyle = rgbS(hellF(Zg.pal[1], 0.08)); g.lineWidth = 0.05; g.beginPath(); g.arc(cx, yb + 0.12, rb + 0.025, Math.PI, 2 * Math.PI); g.stroke();
      g.fillStyle = rgbS(hellF(Zg.pal[3], 0.05)); g.fillRect(xa - 0.035, yb + 0.1, 0.07, hB - 0.02);
      g.fillStyle = "rgba(30,16,16,0.4)"; g.fillRect(xa - 0.035, yb + hB - 0.03, 0.07, 0.03);
    }
    if (I.W.winter) { g.fillStyle = rgbS(SCHNEE); schneeKante(g, x0, x1, y, 0.05, saat); }
  }
  /* Ortgang: Rollschicht entlang der Giebelschrägen */
  function ortgang(g, F, I, zAb) {
    const pts = I.fl.pts.map((p) => [dot(p, I.u), dot(p, I.v)]);
    const mx = pts.reduce((a, p) => a + p[0], 0) / pts.length, my = pts.reduce((a, p) => a + p[1], 0) / pts.length;
    const Zg = I.W.ziegel, b = 0.22;
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], c = pts[(i + 1) % pts.length];
      if (Math.abs(a[1] - c[1]) < 0.05 || Math.abs(a[0] - c[0]) < 0.05) continue;
      if (-Math.max(a[1], c[1]) < zAb - 0.05) continue;
      const L = Math.hypot(c[0] - a[0], c[1] - a[1]), tx = (c[0] - a[0]) / L, ty = (c[1] - a[1]) / L;
      let nx = -ty, ny = tx; if ((mx - a[0]) * nx + (my - a[1]) * ny < 0) { nx = -nx; ny = -ny; }
      g.fillStyle = rgbS(hellF(Zg.pal[0], -0.1));
      g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(c[0], c[1]); g.lineTo(c[0] + nx * b, c[1] + ny * b); g.lineTo(a[0] + nx * b, a[1] + ny * b); g.closePath(); g.fill();
      if (F.px * 0.08 > 2) {
        g.strokeStyle = rgbS(Zg.fuge, 0.8); g.lineWidth = Math.max(0.008, 0.7 / F.px); g.beginPath();
        for (let t = 0; t < L; t += 0.085) { g.moveTo(a[0] + tx * t, a[1] + ty * t); g.lineTo(a[0] + tx * t + nx * b, a[1] + ty * t + ny * b); }
        g.stroke();
      }
      g.fillStyle = "rgba(30,16,16,0.3)";
      g.beginPath(); g.moveTo(a[0] + nx * b, a[1] + ny * b); g.lineTo(c[0] + nx * b, c[1] + ny * b); g.lineTo(c[0] + nx * (b + 0.05), c[1] + ny * (b + 0.05)); g.lineTo(a[0] + nx * (b + 0.05), a[1] + ny * (b + 0.05)); g.closePath(); g.fill();
    }
  }
  /* Wilder Wein: klettert von unten an der Wand hoch (Jahreszeit!) */
  const WEIN = new Map();
  function weinPlan(xa, xb, hoch, saat) {
    const schl = [xa, xb, hoch, saat].join("|");
    let P = WEIN.get(schl);
    if (P) return P;
    const rng = zuf(saat), triebe = [], blaetter = [];
    const n = Math.max(3, Math.round((xb - xa) * 1.4));
    for (let i = 0; i < n; i++) {
      let x = xa + (xb - xa) * (i + 0.3 + rng() * 0.4) / n, z = 0, a = -Math.PI / 2 + (rng() - 0.5) * 0.5;
      const pfad = [[x, 0]];
      const h = hoch * (0.55 + 0.45 * rng());
      while (z < h) {
        const l = 0.25 + rng() * 0.2;
        a += (rng() - 0.5) * 0.7; a = klemm(a, -Math.PI / 2 - 0.8, -Math.PI / 2 + 0.8);
        x += Math.cos(a) * l; z -= Math.sin(a) * l;
        x = klemm(x, xa, xb);
        pfad.push([x, z]);
        if (rng() < 0.45) {
          /* Seitentrieb */
          let sx = x, sz = z, sa = a + (rng() < 0.5 ? -1 : 1) * (0.7 + rng() * 0.6);
          const sp = [[sx, sz]];
          for (let k = 0; k < 3; k++) { sx += Math.cos(sa) * 0.22; sz -= Math.sin(sa) * 0.22; sx = klemm(sx, xa, xb); sp.push([sx, sz]); sa += (rng() - 0.5) * 0.6; }
          triebe.push({ p: sp, d: 0.018 });
          for (const q of sp) for (let k = 0; k < 3; k++) blaetter.push([q[0] + (rng() - 0.5) * 0.3, q[1] + (rng() - 0.5) * 0.3, rng(), rng()]);
        }
        for (let k = 0; k < 4; k++) blaetter.push([x + (rng() - 0.5) * 0.38, z + (rng() - 0.5) * 0.34, rng(), rng()]);
      }
      triebe.push({ p: pfad, d: 0.035 });
    }
    P = { triebe: triebe, blaetter: blaetter };
    WEIN.set(schl, P);
    return P;
  }
  function wein(g, F, I, xa, xb, hoch, saat) {
    const P = weinPlan(xa, xb, hoch, saat), jahr = F.jahr, px = F.px;
    const sv = F.schatten ? F.schatten(0.08) : null;
    /* Triebe */
    g.lineCap = "round"; g.lineJoin = "round";
    for (const t of P.triebe) {
      g.strokeStyle = jahr === "winter" ? "rgb(92,78,66)" : "rgb(100,78,58)"; g.lineWidth = Math.max(t.d, 0.8 / px);
      g.beginPath(); t.p.forEach((q, i) => (i ? g.lineTo(q[0], -q[1]) : g.moveTo(q[0], -q[1]))); g.stroke();
    }
    g.lineCap = "butt"; g.lineJoin = "miter";
    if (jahr === "winter") return;
    const pal = jahr === "herbst" ? [[196, 46, 34], [214, 84, 30], [168, 30, 38], [226, 132, 40], [140, 28, 40]]
      : jahr === "fruehling" ? [[128, 176, 72], [110, 160, 64], [146, 190, 86]] : [[58, 108, 50], [70, 124, 56], [48, 94, 46], [84, 132, 60]];
    const r0 = 0.085;
    if (px * r0 < 1.2) {
      g.fillStyle = rgbS(pal[0], 0.7);
      for (const b of P.blaetter) g.fillRect(b[0] - 0.1, -b[1] - 0.1, 0.2, 0.2);
      return;
    }
    /* Blätter: dreilappig, mit Schatten auf der Wand */
    const blatt = (p, x, y, r, dreh) => {
      for (let k = 0; k < 3; k++) { const a = dreh + (k - 1) * 0.9 - Math.PI / 2; p.moveTo(x, y); p.ellipse(x + Math.cos(a) * r * 0.55, y + Math.sin(a) * r * 0.55, r * 0.55, r * 0.34, a, 0, 2 * Math.PI); }
    };
    if (sv) { const ps = new Path2D(); for (const b of P.blaetter) blatt(ps, b[0] + sv[0], -b[1] + sv[1], r0, b[3] - 0.5); g.fillStyle = "rgba(24,20,20,0.3)"; g.fill(ps); }
    const eimer = pal.map(() => new Path2D());
    for (const b of P.blaetter) blatt(eimer[(b[2] * pal.length) | 0], b[0], -b[1], r0 * (0.8 + b[3] * 0.4), b[3] - 0.5);
    pal.forEach((c, i) => { g.fillStyle = rgbS(c); g.fill(eimer[i]); });
    if (jahr === "herbst" && px > 20) { g.fillStyle = "rgb(40,30,60)"; for (let i = 0; i < P.blaetter.length; i += 7) { const b = P.blaetter[i]; g.beginPath(); g.arc(b[0] + 0.05, -b[1] + 0.06, 0.018, 0, 2 * Math.PI); g.fill(); } }
  }

  /* =====================================================================
     WANDMALER
     spec: { saat, sockel, traufe (Fries), gurte [z], lisenen [[a0,a1]],
             oeff [...], anker [[a, z]], wein [xa, xb, hoch], extra }
     ===================================================================== */
  function wandMaler(spec) {
    return function (g, F, I) {
      const x0 = I.A0, x1 = I.A0 + F.w, y0 = I.B0, y1 = I.B0 + F.h, zTop = -y0, W = I.W;
      backstein(g, F, I, x0, y0, x1, y1, spec.saat || 1);
      /* Verwitterung: Rußschleier unter der Traufe, Spritzwasser unten */
      if (F.px > 5) {
        const gr = g.createLinearGradient(0, y0, 0, y0 + 2.2);
        gr.addColorStop(0, "rgba(40,30,28,0.22)"); gr.addColorStop(1, "rgba(40,30,28,0)");
        g.fillStyle = gr; g.fillRect(x0, y0, x1 - x0, 2.2);
      }
      if (spec.ortgang != null) ortgang(g, F, I, spec.ortgang);
      for (const [a0, a1] of spec.lisenen || []) lisene(g, F, I, a0, a1, y0, -(spec.sockel || 0));
      if (spec.traufe && spec.traufe <= zTop + 0.01) fries(g, F, I, x0, x1, spec.traufe, spec.saat || 1);
      for (const z of spec.gurte || []) if (z < zTop + 0.1) gesims(g, F, I, x0, x1, z, 0.2, 0.1);
      for (const [a, z] of spec.anker || []) if (z < zTop) anker(g, F, a, z);
      for (const op of spec.oeff || []) oeffnung(g, F, I, op);
      if (spec.sockel) {
        sandstein(g, F, I, x0, -spec.sockel, x1, 0.02, (spec.saat || 1) + 70, { lage: spec.sockel / 2, block: 1.0 });
        g.fillStyle = rgbS(hellF(STEIN, 0.2)); g.fillRect(x0, -spec.sockel, x1 - x0, 0.05);
        g.fillStyle = "rgba(40,30,24,0.3)"; g.fillRect(x0, -spec.sockel + 0.05, x1 - x0, 0.025);
        const gs = g.createLinearGradient(0, 0, 0, -0.6);
        gs.addColorStop(0, W.winter ? "rgba(60,58,62,0.3)" : "rgba(70,80,52,0.32)"); gs.addColorStop(1, "rgba(70,70,60,0)");
        g.fillStyle = gs; g.fillRect(x0, -0.6, x1 - x0, 0.6);
        if (W.winter && spec.sockel < zTop) { g.fillStyle = rgbS(SCHNEE); schneeKante(g, x0, x1, -spec.sockel, 0.04, (spec.saat || 1) + 3); }
      }
      if (spec.wein && W.Z.deko) wein(g, F, I, spec.wein[0], spec.wein[1], spec.wein[2], (spec.saat || 1) + 9);
      if (spec.extra) spec.extra(g, F, I);
      if (W.winter && W.Z.bau > 0.3) schneeWehe(g, F, x0, x1, spec.saat || 1);
    };
  }
  function oeffnung(g, F, I, op) {
    if (op.art === "rund") rundbogenFenster(g, F, I, op);
    else if (op.art === "stich") stichFenster(g, F, I, op);
    else if (op.art === "auge") ochsenauge(g, F, I, op);
    else if (op.art === "tor") tor(g, F, I, op);
    else if (op.art === "tuer") kleineTuer(g, F, I, op);
    else if (op.art === "schild") schild(g, F, I, op);
  }
  function wandNacht(spec) {
    return function (g, F, I) {
      if (F.nacht < 0.02) return;
      for (const op of spec.oeff || []) {
        if (op.art === "rund") rundbogenNacht(g, F, I, op);
        else if (op.art === "stich") lamellenNacht(g, F, I, op);
        else if (op.art === "tor") torNacht(g, F, I, op);
        else if (op.art === "schild") schildNacht(g, F, I, op);
      }
    };
  }
  /* Innenseite einer Rohbaumauer */
  function innenMaler(spec) {
    return function (g, F, I) {
      const x0 = I.A0, x1 = I.A0 + F.w, y0 = I.B0, y1 = I.B0 + F.h;
      backstein(g, F, I, x0, y0, x1, y1, (spec && spec.saat || 1) + 40);
      g.fillStyle = "rgba(40,30,30,0.32)"; g.fillRect(x0, y0, x1 - x0, y1 - y0);
      if (!spec) return;
      g.fillStyle = "rgb(40,36,36)";
      for (const op of spec.oeff || []) {
        const a = -op.a;
        g.beginPath();
        if (op.art === "rund" || op.art === "tor") rundPfad(g, a - op.w / 2, -op.zk, op.w, -op.z0);
        else if (op.art === "stich" || op.art === "tuer") g.rect(a - op.w / 2, -op.z0 - op.h, op.w, op.h);
        else if (op.art === "auge") g.arc(a, -op.z, op.r, 0, 2 * Math.PI);
        else continue;
        g.fill();
      }
    };
  }
  /* Mauerkrone (Rohbau): frischer Mörtel auf der obersten Schicht */
  function mauerkrone(g, F, I) {
    const x0 = I.A0, y0 = I.B0, Zg = I.W.ziegel;
    g.fillStyle = rgbS(Zg.fuge); g.fillRect(x0, y0, F.w, F.h);
    if (F.px > 8) {
      for (let x = Math.floor(x0 / 0.25) * 0.25; x < x0 + F.w; x += 0.25) for (let y = Math.floor(y0 / 0.13) * 0.13; y < y0 + F.h; y += 0.13) {
        g.fillStyle = rgbS(Zg.pal[(hash(Math.round(x * 4), Math.round(y * 8), 3) * Zg.pal.length) | 0]); g.fillRect(x + 0.006, y + 0.006, 0.238, 0.118);
      }
    }
    if (I.W.winter) { g.fillStyle = "rgba(240,244,251,0.8)"; g.fillRect(x0, y0, F.w, F.h); }
  }

  /* =====================================================================
     DACH: Biberschwanz-Doppeldeckung als Kachel, Schnee, Lattung
     ===================================================================== */
  const DKACH = new Map(); let dkPixel = 0;
  function biberKachel(pt, basis, sd, rund) {
    const schl = [pt, basis.join(","), sd[0], sd[1], rund ? 1 : 0].join("|");
    let K = DKACH.get(schl);
    if (K) return K;
    const rh = 0.155, sw = 0.18, NR = 12, NC = 12, Wt = NC * sw, Ht = NR * rh;
    const cw = Math.max(2, Math.round(Wt * pt)), ch = Math.max(2, Math.round(Ht * pt));
    if (dkPixel + cw * ch > 8e6) { DKACH.clear(); dkPixel = 0; }
    const cv = document.createElement("canvas"); cv.width = cw; cv.height = ch;
    const g = cv.getContext("2d");
    g.scale(cw / Wt, ch / Ht);
    g.fillStyle = rgbS(hellF(basis, -0.5)); g.fillRect(0, 0, Wt, Ht);
    const farben = [hellF(basis, -0.08), hellF(basis, -0.03), hellF(basis, 0.03), hellF(basis, 0.08), mischF(basis, [110, 60, 44], 0.35), mischF(basis, [120, 112, 80], 0.22)];
    for (let k = -2; k <= NR; k++) {
      /* Reihe k: von der Traufe (unten) gezählt; jede Reihe überdeckt die nächste obere */
      const kk = ((k % NR) + NR) % NR;
      const yb = Ht - k * rh;                 // Unterkante (Schwanz) der Reihe
      const off = (kk % 2) * sw / 2;
      const schat = new Path2D(), eimer = farben.map(() => new Path2D());
      for (let i = -1; i <= NC; i++) {
        const ii = ((i % NC) + NC) % NC;
        const xa = off + i * sw + 0.005, xb = off + (i + 1) * sw - 0.005, xm = (xa + xb) / 2, q = (xb - xa) / 2;
        const p = eimer[(hash(ii, kk, 31) * farben.length) | 0];
        const form = (pp, dx, dy) => {
          const top = yb - rh * 2.2 + dy;
          if (rund) { pp.moveTo(xa + dx, top); pp.lineTo(xb + dx, top); pp.lineTo(xb + dx, yb - q + dy); pp.arc(xm + dx, yb - q + dy, q, 0, Math.PI); pp.closePath(); }
          else pp.rect(xa + dx, top, xb - xa, yb - top + dy);
        };
        form(schat, sd[0], sd[1]); form(p, 0, 0);
      }
      g.fillStyle = "rgba(24,10,6,0.6)"; g.fill(schat);
      for (let j = 0; j < farben.length; j++) { g.fillStyle = rgbS(farben[j]); g.fill(eimer[j]); }
      if (rund && pt > 40) {
        /* Lichtkante am Schwanz */
        g.strokeStyle = rgbS(hellF(basis, 0.25), 0.4); g.lineWidth = 0.8 / pt;
        g.beginPath();
        for (let i = -1; i <= NC; i++) { const xa = off + i * sw + 0.005, xb = off + (i + 1) * sw - 0.005, xm = (xa + xb) / 2, q = (xb - xa) / 2; g.moveTo(xa, yb - q); g.arc(xm, yb - q, q, Math.PI, 0, true); }
        g.stroke();
      }
    }
    K = { bild: cv, cw: cw, ch: ch, Wt: Wt, Ht: Ht };
    DKACH.set(schl, K); dkPixel += cw * ch;
    return K;
  }
  function biber(g, F, I, x0, y0, x1, y1, bE, opt) {
    const px = F.px, basis = opt.farbe || BIBER, saat = opt.saat || 1, rh = 0.155;
    g.fillStyle = rgbS(hellF(basis, -0.4)); g.fillRect(x0, y0, x1 - x0, y1 - y0);
    if (px * rh < 2.2) {
      for (let y = bE; y > y0 - rh; y -= rh) { g.fillStyle = rgbS(hellF(basis, (hash(Math.round(y / rh), 1, saat) - 0.5) * 0.12)); g.fillRect(x0, y - rh, x1 - x0, rh * 0.8); }
      rausch(g, x0, y0, x1 - x0, y1 - y0, 3.2, 0.22, saat + 3, 3);
      return;
    }
    const sv = F.schatten ? F.schatten(0.016) : null;
    const sd = sv ? [Math.round(sv[0] / 0.005) * 0.005, Math.max(0.012, Math.round(sv[1] / 0.005) * 0.005)] : [0, 0.016];
    const K = biberKachel(aufloesung(F), basis, sd, px * 0.18 > 6);
    const mu = g.createPattern(K.bild, "repeat");
    mu.setTransform(new DOMMatrix([K.Wt / K.cw, 0, 0, K.Ht / K.ch, (saat * 1.37) % K.Wt, bE - K.Ht]));
    g.fillStyle = mu; g.fillRect(x0, y0, x1 - x0, y1 - y0);
    rausch(g, x0, y0, x1 - x0, y1 - y0, 5, 0.16, saat + 3, 4);
    if (!I.W.winter) bleich(g, x0, y0, x1 - x0, y1 - y0, 4, 0.06, saat + 4);
  }
  function schneeDach(g, F, I, x0, x1, bR, bE, opt) {
    opt = opt || {};
    const px = F.px, h = bE - bR, saat = opt.saat || 7, rng = zuf(saat);
    const gr = g.createLinearGradient(0, bR, 0, bE);
    gr.addColorStop(0, "rgba(232,238,248," + (opt.oben == null ? 0.82 : opt.oben) + ")");
    gr.addColorStop(0.25, "rgba(238,243,251,0.96)"); gr.addColorStop(1, "rgb(246,249,253)");
    g.fillStyle = gr;
    g.beginPath(); g.moveTo(x0 - 0.1, bR + 0.05);
    for (let x = x0; x <= x1 + 0.25; x += 0.25) g.lineTo(x, bR + 0.03 + hash(Math.round(x * 4), saat, 2) * 0.06);
    g.lineTo(x1 + 0.1, bE + 0.1); g.lineTo(x0 - 0.1, bE + 0.1); g.closePath(); g.fill();
    if (opt.rutsch !== false) {
      const n = Math.round((x1 - x0) * 0.3);
      for (let i = 0; i < n; i++) {
        const cx = x0 + rng() * (x1 - x0), cy = bR + h * (0.12 + rng() * 0.4), rx = 0.3 + rng() * 0.8, ry = 0.4 + rng() * h * 0.2;
        const gg = g.createRadialGradient(cx, cy, 0, cx, cy, rx);
        gg.addColorStop(0, "rgba(150,80,60,0.28)"); gg.addColorStop(1, "rgba(150,80,60,0)");
        g.save(); g.translate(cx, cy); g.scale(1, ry / rx); g.fillStyle = gg; g.beginPath(); g.arc(0, 0, rx, 0, 2 * Math.PI); g.fill(); g.restore();
      }
    }
    for (let i = 0; i < (x1 - x0) * 0.8; i++) {
      const cx = x0 + rng() * (x1 - x0), cy = bR + h * (0.3 + rng() * 0.6), rx = 0.5 + rng() * 1.3;
      const gg = g.createRadialGradient(cx, cy, 0, cx, cy, rx);
      gg.addColorStop(0, "rgba(160,182,222,0.16)"); gg.addColorStop(1, "rgba(160,182,222,0)");
      g.save(); g.translate(cx, cy); g.scale(1, 0.3); g.fillStyle = gg; g.beginPath(); g.arc(0, 0, rx, 0, 2 * Math.PI); g.fill(); g.restore();
    }
    if (px * 0.155 > 2.5) {
      /* Ziegelreihen zeichnen sich unter der dünnen Decke ab */
      const p = new Path2D(), q = new Path2D();
      for (let y = bE - 0.155, k = 0; y > bR; y -= 0.155, k++) {
        const t = 1 - (y - bR) / h, d = 0.03 + 0.03 * (1 - t);
        let x = x0 - hash(k, 1, saat) * 3, i = 0;
        while (x < x1) {
          const l = 2 + 3 * hash(k, i, saat + 2), luecke = 0.3 + 1.2 * hash(k, i, saat + 3);
          if (hash(k, i, saat + 1) > t * 0.55) { p.rect(x, y, l, d); q.rect(x + 0.1, y - 0.03, l - 0.2, 0.03); }
          x += l + luecke; i++;
        }
      }
      g.fillStyle = "rgba(130,146,176,0.08)"; g.fill(p);
      g.fillStyle = "rgba(255,255,255,0.3)"; g.fill(q);
    }
    const gk = g.createLinearGradient(0, bE - 0.32, 0, bE);
    gk.addColorStop(0, "rgba(255,255,255,0)"); gk.addColorStop(0.6, "rgba(255,255,255,0.7)"); gk.addColorStop(0.85, "rgba(214,226,244,0.9)"); gk.addColorStop(1, "rgba(170,188,222,0.9)");
    g.fillStyle = gk; g.fillRect(x0, bE - 0.32, x1 - x0, 0.32);
    rausch(g, x0, bR, x1 - x0, h, 1.8, 0.06, 31, 3);
    if (px > 18) {
      g.fillStyle = "rgba(255,255,255,0.95)";
      for (let i = 0; i < Math.min(900, (x1 - x0) * h * 4); i++) { const r = (0.6 + rng()) / px; g.fillRect(x0 + rng() * (x1 - x0), bR + rng() * h, r, r); }
    }
  }
  function lattung(g, F, I, x0, y0, x1, y1) {
    if (y1 <= y0) return;
    g.save(); g.beginPath(); g.rect(x0 - 0.1, y0 - 0.1, x1 - x0 + 0.2, y1 - y0 + 0.1); g.clip();
    const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, "rgb(52,44,38)"); gr.addColorStop(1, "rgb(68,56,46)");
    g.fillStyle = gr; g.fillRect(x0 - 0.1, y0 - 0.1, x1 - x0 + 0.2, y1 - y0 + 0.2);
    for (let x = Math.ceil(x0 / 0.8) * 0.8; x < x1; x += 0.8) {
      g.fillStyle = "rgba(20,16,14,0.45)"; g.fillRect(x + 0.06, y0 - 0.1, 0.05, y1 - y0 + 0.2);
      g.fillStyle = rgbS(hellF(HOLZ, -0.18 + (hash(Math.round(x * 3), 1, 7) - 0.5) * 0.1)); g.fillRect(x - 0.06, y0 - 0.1, 0.12, y1 - y0 + 0.2);
    }
    let k = 0;
    for (let y = y1; y > y0 - 0.2; y -= 0.32, k++) {
      const dy = (hash(k, 3, 9) - 0.5) * 0.03, c = hellF(HOLZ, (hash(k, 4, 9) - 0.5) * 0.16);
      g.fillStyle = "rgba(24,18,14,0.5)"; g.fillRect(x0 - 0.1, y + dy + 0.02, x1 - x0 + 0.2, 0.025);
      g.fillStyle = rgbS(c); g.fillRect(x0 - 0.1, y + dy - 0.03, x1 - x0 + 0.2, 0.05);
      if (I.W.winter) { g.fillStyle = "rgba(244,247,252,0.85)"; g.fillRect(x0 - 0.1, y + dy - 0.045, x1 - x0 + 0.2, 0.02); }
    }
    g.restore();
  }
  /* First: Firstziegel (Hohlziegel) als Band an der oberen Kante */
  function firstBand(g, F, I, bR, x0, x1) {
    const px = F.px, c = hellF(BIBER, -0.08);
    g.fillStyle = "rgba(20,10,8,0.35)"; g.fillRect(x0, bR + 0.16, x1 - x0, 0.05);
    const gr = g.createLinearGradient(0, bR, 0, bR + 0.18); gr.addColorStop(0, rgbS(hellF(c, 0.2))); gr.addColorStop(1, rgbS(hellF(c, -0.2)));
    g.fillStyle = gr; g.fillRect(x0, bR - 0.02, x1 - x0, 0.2);
    if (px > 14) { g.strokeStyle = rgbS(hellF(c, -0.45), 0.7); g.lineWidth = Math.max(0.008, 0.7 / px); g.beginPath(); for (let x = Math.ceil(x0 / 0.36) * 0.36; x < x1; x += 0.36) { g.moveTo(x, bR - 0.02); g.quadraticCurveTo(x + 0.05, bR + 0.08, x, bR + 0.18); } g.stroke(); }
    if (I.W.winter) { g.fillStyle = "rgba(244,247,252,0.95)"; g.fillRect(x0, bR - 0.02, x1 - x0, 0.14); }
  }
  function dachMaler(opt) {
    return function (g, F, I) {
      const x0 = I.A0, x1 = I.A0 + F.w, y0 = I.B0, y1 = I.B0 + F.h;
      let bE = -Infinity, bR = Infinity;
      for (const p of I.fl.pts) { const b = dot(p, I.v); bE = Math.max(bE, b); bR = Math.min(bR, b); }
      const W = I.W;
      const k = opt.eindeck == null ? 1 : opt.eindeck;
      if (k < 1) {
        const bG = bE - (bE - bR) * k;
        lattung(g, F, I, x0, y0, x1, bG + 0.05);
        if (k <= 0) return;
        g.save(); g.beginPath(); g.rect(x0 - 1, bG, x1 - x0 + 2, y1 - bG + 1); g.clip();
        biber(g, F, I, x0, bG, x1, y1, bE, opt);
        if (W.winter) schneeDach(g, F, I, x0, x1, bG, bE, { saat: opt.saat, oben: 0.4, rutsch: false });
        g.restore();
        return;
      }
      biber(g, F, I, x0, y0, x1, y1, bE, opt);
      if (W.winter) schneeDach(g, F, I, x0, x1, bR, bE, { saat: opt.saat, rutsch: true });
      if (opt.first) firstBand(g, F, I, bR, x0, x1);
      if (opt.rinneWand && !W.winter) {
        /* Kastenrinne an der Brandwand zum Sudhaus */
        g.fillStyle = rgbS(ZINK); g.fillRect(x0, bE - 0.28, x1 - x0, 0.28);
        g.fillStyle = "rgba(20,20,24,0.35)"; g.fillRect(x0, bE - 0.3, x1 - x0, 0.03);
      }
    };
  }
  /* Stirnbrett an der Traufe, Windbrett am Ortgang */
  function brettMaler(c) {
    return function (g, F, I) {
      const x0 = I.A0, y0 = I.B0, w = F.w, h = F.h;
      g.fillStyle = rgbS(c); g.fillRect(x0 - 0.05, y0 - 0.05, w + 0.1, h + 0.1);
      const gr = g.createLinearGradient(0, y0, 0, y0 + h); gr.addColorStop(0, "rgba(255,255,255,0.12)"); gr.addColorStop(1, "rgba(0,0,0,0.25)");
      g.fillStyle = gr; g.fillRect(x0 - 0.05, y0 - 0.05, w + 0.1, h + 0.1);
      rausch(g, x0, y0, w, h, 1.0, 0.25, 19, 3);
      if (I.W.winter && Math.abs(I.n[2]) < 0.5) {
        g.fillStyle = rgbS(SCHNEE); g.beginPath(); g.moveTo(x0 - 0.1, y0 - 0.05);
        for (let x = x0; x <= x0 + w + 0.2; x += 0.2) g.lineTo(x, y0 + h * (0.25 + 0.35 * hash(Math.round(x * 5), 3, 7)));
        g.lineTo(x0 + w + 0.1, y0 - 0.05); g.closePath(); g.fill();
      }
    };
  }
  /* Windbrett am Ortgang: dunkles Holz, oben die Kante der Ortgangziegel */
  function ortMaler(g, F, I) {
    const x0 = I.A0, y0 = I.B0, w = F.w, h = F.h, c = [66, 50, 38];
    g.fillStyle = rgbS(c); g.fillRect(x0 - 0.05, y0 - 0.05, w + 0.1, h + 0.1);
    rausch(g, x0, y0, w, h, 0.9, 0.25, 29, 3);
    const pts = I.fl.pts.map((p) => [dot(p, I.u), dot(p, I.v)]);
    const my = pts.reduce((a, p) => a + p[1], 0) / pts.length;
    /* obere Kanten: Ziegelband (rot) bzw. Schnee; untere: Schattenfuge */
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length];
      if (Math.abs(a[0] - b[0]) < 0.02) continue;
      const oben = (a[1] + b[1]) / 2 < my;
      g.fillStyle = oben ? (I.W.winter ? rgbS(SCHNEE) : rgbS(hellF(BIBER, -0.05))) : "rgba(20,14,10,0.5)";
      const d = oben ? 0.09 : -0.035;
      g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.lineTo(b[0], b[1] + d); g.lineTo(a[0], a[1] + d); g.closePath(); g.fill();
    }
  }
  function blechMaler(farbe, falz) {
    return function (g, F, I) {
      const x0 = I.A0, y0 = I.B0, w = F.w, h = F.h;
      g.fillStyle = rgbS(farbe); g.fillRect(x0 - 0.05, y0 - 0.05, w + 0.1, h + 0.1);
      if (falz && F.px > 8) {
        /* Stehfalz: helle Kante, dunkle Schattenseite */
        for (let x = Math.ceil(x0 / 0.42) * 0.42; x < x0 + w; x += 0.42) { g.fillStyle = rgbS(hellF(farbe, 0.25)); g.fillRect(x, y0 - 0.05, 0.02, h + 0.1); g.fillStyle = rgbS(hellF(farbe, -0.3)); g.fillRect(x + 0.02, y0 - 0.05, 0.025, h + 0.1); }
      }
      rausch(g, x0, y0, w, h, 1.2, 0.25, 19, 3);
      if (I.W.winter && I.n[2] > 0.3) { g.fillStyle = rgbS(SCHNEE); g.fillRect(x0 - 0.05, y0 - 0.05, w + 0.1, h * 0.92); g.fillStyle = "rgba(170,190,225,0.35)"; g.fillRect(x0, y0 + h * 0.88, w, h * 0.06); }
    };
  }
  function rinneMaler(g, F, I) {
    const x0 = I.A0, x1 = I.A0 + F.w, y0 = I.B0, y1 = I.B0 + F.h;
    if (I.n[2] > 0.5) {
      g.fillStyle = "rgb(60,62,66)"; g.fillRect(x0, y0, x1 - x0, y1 - y0);
      if (I.W.winter) { g.fillStyle = rgbS(SCHNEE); g.fillRect(x0, y0 + (y1 - y0) * 0.1, x1 - x0, (y1 - y0) * 0.8); }
      return;
    }
    const gr = g.createLinearGradient(0, y0, 0, y1);
    gr.addColorStop(0, rgbS(hellF(ZINK, 0.35))); gr.addColorStop(0.3, rgbS(hellF(ZINK, 0.1))); gr.addColorStop(0.8, rgbS(hellF(ZINK, -0.2))); gr.addColorStop(1, rgbS(hellF(ZINK, -0.45)));
    g.fillStyle = gr; g.fillRect(x0, y0, x1 - x0, y1 - y0);
    if (F.px > 16) { g.fillStyle = "rgba(30,34,40,0.6)"; for (let x = Math.ceil(x0 / 0.8) * 0.8; x < x1; x += 0.8) g.fillRect(x, y0, 0.025, y1 - y0); }
    if (I.W.winter) { g.fillStyle = rgbS(SCHNEE); g.fillRect(x0, y0 - 0.02, x1 - x0, (y1 - y0) * 0.3); }
  }
  function rohrMaler(g, F, I) {
    const x0 = I.A0, y0 = I.B0, w = F.w, h = F.h;
    const gr = g.createLinearGradient(x0, 0, x0 + w, 0);
    gr.addColorStop(0, rgbS(hellF(ZINK, 0.1))); gr.addColorStop(0.4, rgbS(hellF(ZINK, 0.3))); gr.addColorStop(1, rgbS(hellF(ZINK, -0.3)));
    g.fillStyle = gr; g.fillRect(x0, y0, w, h);
    if (F.px > 10 && Math.abs(I.n[2]) < 0.3) { g.fillStyle = "rgba(30,34,38,0.7)"; for (let z = 1.0; z < 8; z += 1.8) g.fillRect(x0, -z - 0.03, w, 0.05); }
  }
  function eisMaler(saat) {
    return function (g, F, I) {
      const lf = lichtVon(F, 0.15), x0 = I.A0, x1 = I.A0 + F.w, y0 = I.B0, rng = zuf(saat);
      let x = x0 + rng() * 0.2;
      while (x < x1) {
        const l = 0.05 + Math.pow(rng(), 2.3) * 0.36, b = 0.02 + l * 0.1;
        const gr = g.createLinearGradient(x - b, 0, x + b, 0);
        gr.addColorStop(0, belicht([196, 222, 244], lf, 0.7)); gr.addColorStop(0.35, belicht([250, 254, 255], lf, 0.95)); gr.addColorStop(1, belicht([150, 180, 214], lf, 0.7));
        g.fillStyle = gr;
        g.beginPath(); g.moveTo(x - b, y0); g.quadraticCurveTo(x - b * 0.35, y0 + l * 0.6, x, y0 + l); g.quadraticCurveTo(x + b * 0.35, y0 + l * 0.6, x + b, y0); g.closePath(); g.fill();
        x += 0.08 + rng() * 0.32;
      }
    };
  }
  function stufeMaler(g, F, I) {
    const x0 = I.A0, x1 = I.A0 + F.w, y0 = I.B0, y1 = I.B0 + F.h, c = STEIN;
    g.fillStyle = rgbS(c); g.fillRect(x0, y0, x1 - x0, y1 - y0);
    if (F.px > 10) { g.fillStyle = rgbS(hellF(c, -0.35), 0.6); for (let x = Math.ceil(x0 / 0.9) * 0.9; x < x1; x += 0.9) g.fillRect(x, y0, Math.max(0.01, 0.7 / F.px), y1 - y0); }
    rausch(g, x0, y0, x1 - x0, y1 - y0, 1.0, 0.3, 41, 3);
    if (I.n[2] > 0.5) {
      const xm = (x0 + x1) / 2;
      const gt = g.createLinearGradient(xm - 0.8, 0, xm + 0.8, 0); gt.addColorStop(0, "rgba(255,240,220,0)"); gt.addColorStop(0.5, "rgba(255,240,220,0.18)"); gt.addColorStop(1, "rgba(255,240,220,0)");
      g.fillStyle = gt; g.fillRect(xm - 0.8, y0, 1.6, y1 - y0);
      if (I.W.winter) {
        g.fillStyle = rgbS(SCHNEE); g.fillRect(x0, y0, (x1 - x0) * 0.24, y1 - y0); g.fillRect(x1 - (x1 - x0) * 0.24, y0, (x1 - x0) * 0.24, y1 - y0);
        g.fillStyle = "rgba(236,240,248,0.5)"; g.fillRect(x0 + (x1 - x0) * 0.24, y0, (x1 - x0) * 0.52, y1 - y0);
      }
    } else if (I.W.winter) { g.fillStyle = rgbS(SCHNEE); g.fillRect(x0, y0, (x1 - x0) * 0.24, 0.03); g.fillRect(x1 - (x1 - x0) * 0.24, y0, (x1 - x0) * 0.24, 0.03); }
  }
  /* Pflasterkachel (1,04 m, nahtlos): 8 × 8 Steine im Reihenverband */
  const PKACH = new Map();
  function pflasterKachel(pt) {
    let K = PKACH.get(pt);
    if (K) return K;
    const st = 0.13, N = 8, Wt = st * N, cw = Math.max(2, Math.round(Wt * pt));
    const cv = document.createElement("canvas"); cv.width = cv.height = cw;
    const g = cv.getContext("2d"); g.scale(cw / Wt, cw / Wt);
    g.fillStyle = "rgb(96,92,86)"; g.fillRect(0, 0, Wt, Wt);
    const eimer = [new Path2D(), new Path2D(), new Path2D(), new Path2D()], sch = new Path2D();
    for (let j = -1; j <= N; j++) for (let i = -1; i <= N; i++) {
      const jj = (j + N) % N, ii = (i + N) % N;
      const xx = i * st + (jj % 2) * st * 0.5 + (hash(ii, jj, 3) - 0.5) * 0.02, yy = j * st + (hash(ii, jj, 4) - 0.5) * 0.02;
      const k = (hash(ii, jj, 5) * 4) | 0, a = hash(ii, jj, 6);
      eimer[k].moveTo(xx + st * 0.94, yy + st * 0.5); eimer[k].ellipse(xx + st * 0.5, yy + st * 0.5, st * 0.44, st * 0.41, a, 0, 2 * Math.PI);
      sch.moveTo(xx + st * 0.96, yy + st * 0.53); sch.ellipse(xx + st * 0.52, yy + st * 0.53, st * 0.44, st * 0.41, a, 0, 2 * Math.PI);
    }
    g.fillStyle = "rgba(40,36,34,0.5)"; g.fill(sch);
    [[92, 90, 92], [126, 120, 112], [104, 100, 98], [140, 132, 120]].forEach((c, i) => { g.fillStyle = rgbS(c); g.fill(eimer[i]); });
    K = { bild: cv, cw: cw, Wt: Wt };
    if (PKACH.size > 12) PKACH.clear();
    PKACH.set(pt, K);
    return K;
  }
  /* Kopfsteinpflaster im Hof (Basalt und Granit), im Winter geräumt */
  function pflasterMaler(g, F, I) {
    const x0 = I.A0, x1 = I.A0 + F.w, y0 = I.B0, y1 = I.B0 + F.h, px = F.px, W = I.W;
    g.save();
    if (W.winter) {
      /* Winter: nur die geräumten Wege zeigen Pflaster, der Rest ist
         Schnee wie ringsum (die Fläche bleibt dort durchsichtig) */
      g.beginPath(); g.moveTo(1.25, 3.3); g.lineTo(3.15, 3.3); g.lineTo(3.45, 5.0); g.lineTo(0.95, 5.0); g.closePath();
      g.moveTo(-3.95, 1.0); g.lineTo(-2.65, 1.0); g.lineTo(-2.35, 2.6); g.lineTo(-4.15, 2.6); g.closePath();
      g.clip();
    }
    g.fillStyle = "rgb(118,114,108)"; g.fillRect(x0, y0, x1 - x0, y1 - y0);
    if (px * 0.12 > 2) {
      const K = pflasterKachel(aufloesung(F));
      const mu = g.createPattern(K.bild, "repeat");
      mu.setTransform(new DOMMatrix([K.Wt / K.cw, 0, 0, K.Wt / K.cw, 0, 0]));
      g.fillStyle = mu; g.fillRect(x0, y0, x1 - x0, y1 - y0);
    }
    rausch(g, x0, y0, x1 - x0, y1 - y0, 2.5, 0.25, 61, 3);
    if (W.winter) {
      /* Schneereste in den Fugen, Ränder der Räumung */
      g.fillStyle = "rgba(236,241,250,0.45)"; g.fillRect(x0, y0, x1 - x0, y1 - y0);
      g.strokeStyle = "rgba(240,244,251,0.95)"; g.lineWidth = 0.14;
      g.beginPath(); g.moveTo(1.25, 3.3); g.lineTo(0.95, 5.0); g.moveTo(3.15, 3.3); g.lineTo(3.45, 5.0);
      g.moveTo(-3.95, 1.0); g.lineTo(-4.15, 2.6); g.moveTo(-2.65, 1.0); g.lineTo(-2.35, 2.6); g.stroke();
    } else if (W.o.jahr === "herbst") {
      const rng = zuf(88);
      for (let i = 0; i < Math.min(700, (x1 - x0) * (y1 - y0) * 12); i++) {
        g.fillStyle = rgbS([[196, 60, 34], [214, 124, 40], [168, 40, 40], [190, 150, 60]][(rng() * 4) | 0]);
        g.beginPath(); g.ellipse(x0 + rng() * (x1 - x0), y0 + rng() * (y1 - y0), 0.05, 0.03, rng() * 3, 0, 2 * Math.PI); g.fill();
      }
    }
    /* Licht selbst auflegen (nur wo gemalt wurde) */
    const lf = lichtVon(F);
    g.globalCompositeOperation = "multiply";
    g.fillStyle = "rgb(" + lf.map((v) => Math.round(v * 255)).join(",") + ")"; g.fillRect(x0, y0, x1 - x0, y1 - y0);
    g.restore();
  }

  /* =====================================================================
     KLEINE 3D-RECHNUNG FÜR FIGUREN (Schlot, Fässer, Wagen, Stern)
     Ursprung = Fußpunkt der Figur; Licht wie im Kern (ST.lichtFaktor).
     ===================================================================== */
  function kleinBlick(F, s) {
    const r = (F.gier || 0) * RAD, c = Math.cos(r), sn = Math.sin(r), e = ST.ZUM_AUGE;
    const rot = (v) => [v[0] * c - v[1] * sn, v[0] * sn + v[1] * c, v[2]];
    return {
      s: s, rot: rot,
      p(v) { const a = v[0] * c - v[1] * sn, b = v[0] * sn + v[1] * c; return [(a - b) * ST.KX * s, (a + b) * ST.KY * s - v[2] * ST.KZ * s]; },
      tief(v) { const a = v[0] * c - v[1] * sn, b = v[0] * sn + v[1] * c; return (a + b) * e[0] + v[2] * e[2]; },
      sicht(n) { const q = rot(n); return q[0] * e[0] + q[1] * e[1] + q[2] * e[2]; },
      lf(n, extra) { return ST.lichtFaktor(nrm(rot(n)), F.Z, extra || 0, F.jahr); }
    };
  }
  function vielP(g, K, pts) { g.beginPath(); pts.forEach((v, i) => { const q = K.p(v); if (i) g.lineTo(q[0], q[1]); else g.moveTo(q[0], q[1]); }); g.closePath(); }
  /* Kiste als Liste von Flächen */
  function kisteFl(liste, x0, y0, z0, x1, y1, z1, farbe, opt) {
    const f = (pts, n) => liste.push(Object.assign({ pts: pts, n: n, farbe: farbe }, opt || {}));
    f([[x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0]], [0, 1, 0]);
    f([[x1, y0, z1], [x0, y0, z1], [x0, y0, z0], [x1, y0, z0]], [0, -1, 0]);
    f([[x1, y1, z1], [x1, y0, z1], [x1, y0, z0], [x1, y1, z0]], [1, 0, 0]);
    f([[x0, y0, z1], [x0, y1, z1], [x0, y1, z0], [x0, y0, z0]], [-1, 0, 0]);
    f([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], [0, 0, 1]);
  }
  /* Balken zwischen zwei Punkten (Querschnitt b × h) */
  function balkenFl(liste, P0, P1, b, h, farbe, opt) {
    const ax = nrm(sub(P1, P0)), sd = nrm(kreuz(ax, Math.abs(ax[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1])), hh = nrm(kreuz(sd, ax));
    const ecke = (P, a, c) => add(P, add(mul(sd, a * b / 2), mul(hh, c * h / 2)));
    const q = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
    for (let i = 0; i < 4; i++) {
      const [a0, c0] = q[i], [a1, c1] = q[(i + 1) % 4];
      const n = nrm(add(mul(sd, (a0 + a1) / 2), mul(hh, (c0 + c1) / 2)));
      liste.push(Object.assign({ pts: [ecke(P0, a0, c0), ecke(P0, a1, c1), ecke(P1, a1, c1), ecke(P1, a0, c0)], n: n, farbe: farbe }, opt || {}));
    }
    liste.push(Object.assign({ pts: q.map(([a, c]) => ecke(P1, a, c)), n: ax, farbe: farbe }, opt || {}));
    liste.push(Object.assign({ pts: q.map(([a, c]) => ecke(P0, a, c)), n: mul(ax, -1), farbe: farbe }, opt || {}));
  }
  /* Flächen und Sonderteile sortiert malen */
  function kleinMalen(g, K, F, teile) {
    const sch = F.schatten;
    const items = [];
    for (const t of teile) {
      if (t.zeichnen) { items.push({ tief: t.tief != null ? t.tief : K.tief(t.mitte), t: t }); continue; }
      if (!t.beidseitig && K.sicht(t.n) <= 0.002 && !sch) continue;
      items.push({ tief: K.tief(mitteVon(t.pts)) + (t.vor || 0), t: t });
    }
    items.sort((a, b) => a.tief - b.tief);
    for (const it of items) {
      const t = it.t;
      if (t.zeichnen) { t.zeichnen(g, K, F); continue; }
      if (sch) { g.fillStyle = "#000"; vielP(g, K, t.pts); g.fill(); continue; }
      let n = t.n; if (t.beidseitig && K.sicht(n) < 0) n = mul(n, -1);
      let c = t.farbe;
      if (t.schnee !== false && F.jahr === "winter" && n[2] > 0.6 && t.schneeOk) c = SCHNEE;
      g.fillStyle = belicht(c, K.lf(n, t.extra));
      vielP(g, K, t.pts); g.fill();
      if (t.kante && K.s > 18) { g.strokeStyle = belicht(hellF(c, -0.45), K.lf(n), 0.6); g.lineWidth = Math.max(0.6, K.s * 0.008); g.stroke(); }
    }
  }
  /* Ein Fass: Dauben als Flächen, Reifen, Böden. C = Mitte, ax = Achse */
  function fassTeile(C, ax, L, R0, R1, holz, opt) {
    opt = opt || {};
    ax = nrm(ax);
    const e1 = nrm(kreuz(ax, Math.abs(ax[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0])), e2 = kreuz(ax, e1);
    const NS = 6, NA = 16;
    const rad = (t) => R0 + (R1 - R0) * (1 - t * t);
    const pos = (t, a) => add(add(C, mul(ax, t * L / 2)), mul(add(mul(e1, Math.cos(a)), mul(e2, Math.sin(a))), rad(t)));
    const norm = (t, a) => nrm(sub(add(mul(e1, Math.cos(a)), mul(e2, Math.sin(a))), mul(ax, -4 * (R1 - R0) * t / L)));
    return {
      mitte: C, fass: true,
      zeichnen(g, K, F) {
        const sch = F.schatten;
        if (sch) {
          const pk = [];
          for (let j = 0; j <= NS; j++) for (let i = 0; i < NA; i++) pk.push(K.p(pos(-1 + 2 * j / NS, i * 2 * Math.PI / NA)));
          const h = huelle2(pk); g.fillStyle = "#000"; g.beginPath(); h.forEach((q, i) => (i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]))); g.closePath(); g.fill();
          return;
        }
        const winter = F.jahr === "winter" && opt.schnee !== false;
        const quads = [];
        for (let i = 0; i < NA; i++) {
          const a0 = i * 2 * Math.PI / NA, a1 = (i + 1) * 2 * Math.PI / NA, am = (a0 + a1) / 2;
          const c = hellF(holz, (hash(i, opt.saat || 1, 7) - 0.5) * 0.16);
          for (let j = 0; j < NS; j++) {
            const t0 = -1 + 2 * j / NS, t1 = -1 + 2 * (j + 1) / NS, tm = (t0 + t1) / 2;
            const n = norm(tm, am);
            if (K.sicht(n) <= 0) continue;
            quads.push({ pts: [pos(t0, a0), pos(t0, a1), pos(t1, a1), pos(t1, a0)], n: n, c: winter && n[2] > 0.72 ? SCHNEE : c });
          }
        }
        quads.sort((a, b) => K.tief(mitteVon(a.pts)) - K.tief(mitteVon(b.pts)));
        for (const q of quads) { g.fillStyle = belicht(q.c, K.lf(q.n)); vielP(g, K, q.pts); g.fill(); g.strokeStyle = g.fillStyle; g.lineWidth = 0.6; g.stroke(); }
        /* Fugen zwischen den Dauben */
        if (K.s > 24) {
          g.strokeStyle = "rgba(40,26,16,0.35)"; g.lineWidth = Math.max(0.5, K.s * 0.004);
          for (let i = 0; i < NA; i++) {
            const a = i * 2 * Math.PI / NA; if (K.sicht(norm(0, a)) <= 0.05) continue;
            g.beginPath(); for (let j = 0; j <= NS; j++) { const q = K.p(pos(-1 + 2 * j / NS, a)); if (j) g.lineTo(q[0], q[1]); else g.moveTo(q[0], q[1]); } g.stroke();
          }
        }
        /* Reifen */
        const reif = opt.reif || [60, 58, 56];
        for (const t of opt.reifen || [-0.86, -0.56, 0.56, 0.86]) {
          const pts = [];
          for (let i = 0; i <= 32; i++) { const a = i * 2 * Math.PI / 32; if (K.sicht(norm(t, a)) > -0.02) pts.push([K.p(pos(t, a)), norm(t, a)]); else pts.push(null); }
          g.lineWidth = Math.max(1, 0.045 * K.s); g.lineCap = "butt";
          for (let i = 0; i < 32; i++) {
            if (!pts[i] || !pts[i + 1]) continue;
            g.strokeStyle = belicht(reif, K.lf(pts[i][1], 0.05));
            g.beginPath(); g.moveTo(pts[i][0][0], pts[i][0][1]); g.lineTo(pts[i + 1][0][0], pts[i + 1][0][1]); g.stroke();
          }
        }
        /* Böden */
        for (const sg of [-1, 1]) {
          const n = mul(ax, sg);
          if (K.sicht(n) <= 0.01) continue;
          const c0 = K.p(add(C, mul(ax, sg * (L / 2 - 0.02)))), u = sub3(K.p(add(C, mul(ax, sg * (L / 2 - 0.02)))), K.p(add(add(C, mul(ax, sg * (L / 2 - 0.02))), mul(e1, 1)))), v = sub3(c0, K.p(add(add(C, mul(ax, sg * (L / 2 - 0.02))), mul(e2, 1))));
          g.save(); g.transform(-u[0], -u[1], -v[0], -v[1], c0[0], c0[1]);
          const bodenC = winter && n[2] > 0.7 ? SCHNEE : hellF(holz, 0.12);
          g.fillStyle = belicht(bodenC, K.lf(n)); g.beginPath(); g.arc(0, 0, R0 * 0.94, 0, 2 * Math.PI); g.fill();
          g.strokeStyle = belicht(hellF(holz, -0.45), K.lf(n)); g.lineWidth = R0 * 0.06; g.stroke();
          if (!(winter && n[2] > 0.7) && K.s > 20) {
            g.lineWidth = R0 * 0.02; g.strokeStyle = belicht(hellF(holz, -0.25), K.lf(n), 0.7);
            for (const d of [-0.5, 0, 0.5]) { g.beginPath(); g.moveTo(d * R0, -Math.sqrt(1 - d * d) * R0 * 0.94); g.lineTo(d * R0, Math.sqrt(1 - d * d) * R0 * 0.94); g.stroke(); }
            if (opt.hahn) { g.fillStyle = belicht([190, 150, 70], K.lf(n)); g.beginPath(); g.arc(0, R0 * 0.55, R0 * 0.1, 0, 2 * Math.PI); g.fill(); }
          }
          g.restore();
        }
      }
    };
  }
  const sub3 = (a, b) => [a[0] - b[0], a[1] - b[1]];
  /* Senkrechter Zylinder (Schlot, Rohr): Mantel mit Lichtverlauf */
  function mantelVerlauf(g, F, K, xl, xr, farbe, extra) {
    const gr = g.createLinearGradient(xl, 0, xr, 0);
    for (let i = 0; i <= 8; i++) {
      const t = -1 + 2 * i / 8, q = Math.sqrt(Math.max(0, 1 - t * t));
      const n = [(t + q) * Math.SQRT1_2, (q - t) * Math.SQRT1_2, 0];
      gr.addColorStop(i / 8, belicht(farbe, ST.lichtFaktor(n, F.Z, extra || 0, F.jahr)));
    }
    return gr;
  }
  function zylinderPfad(g, s, z0, z1, r0, r1) {
    const y0 = -z0 * ST.KZ * s, y1 = -z1 * ST.KZ * s;
    g.beginPath(); g.moveTo(-r0 * s, y0); g.lineTo(-r1 * s, y1); g.ellipse(0, y1, r1 * s, r1 * s * 0.5, 0, Math.PI, 0, true);
    g.lineTo(r0 * s, y0); g.ellipse(0, y0, r0 * s, r0 * s * 0.5, 0, 0, Math.PI, false); g.closePath();
  }

  /* ---------------- Der Schlot ----------------
     Runder Backsteinschaft auf quadratischem Sockel (der Sockel ist ein
     Körper), verjüngt sich, Eisenbänder alle 1,6 m, oben ein Kopf aus
     drei vorkragenden Schichten, Abdeckung, Blitzableiter. */
  function schlotFigur(W, hBis) {
    const H = SCH.top - SCH.hk, Zg = W.ziegel;
    const r = (z) => SCH.r0 + (SCH.r1 - SCH.r0) * (z / H);
    const hh = Math.min(H, hBis);
    return function (g, s, F) {
      const sch = F.schatten, KZ = ST.KZ;
      const kopf = hh >= H - 0.01;
      const zK = H - 0.85;
      /* Umriss (mit Kopf) */
      const umriss = () => {
        g.beginPath();
        const zs = kopf ? zK : hh;
        g.moveTo(-r(0) * s, 0); g.lineTo(-r(zs) * s, -zs * KZ * s);
        if (kopf) { const rk = r(zK) + 0.14; g.lineTo(-rk * s, -(zK + 0.25) * KZ * s); g.lineTo(-rk * s, -H * KZ * s); g.ellipse(0, -H * KZ * s, rk * s, rk * s * 0.5, 0, Math.PI, 0, false); g.lineTo(rk * s, -(zK + 0.25) * KZ * s); g.lineTo(r(zK) * s, -zK * KZ * s); }
        else { g.ellipse(0, -zs * KZ * s, r(zs) * s, r(zs) * s * 0.5, 0, Math.PI, 0, false); }
        g.lineTo(r(0) * s, 0); g.ellipse(0, 0, r(0) * s, r(0) * s * 0.5, 0, 0, Math.PI, false); g.closePath();
      };
      if (sch) { g.fillStyle = "#000"; umriss(); g.fill(); return; }
      const mitte = Zg.pal.reduce((a, c) => [a[0] + c[0] / Zg.pal.length, a[1] + c[1] / Zg.pal.length, a[2] + c[2] / Zg.pal.length], [0, 0, 0]);
      g.fillStyle = mantelVerlauf(g, F, null, -r(0) * s, r(0) * s, mitte);
      umriss(); g.fill();
      g.save(); umriss(); g.clip();
      /* Backstein: Schichten als Ellipsenbögen, Stoßfugen versetzt */
      const lage = LAGE, pxL = lage * KZ * s;
      if (pxL > 1.6) {
        const eimer = [new Path2D(), new Path2D(), new Path2D(), new Path2D()];
        const fuge = new Path2D();
        const n0 = 0, n1 = Math.floor(Math.min(hh, kopf ? zK : hh) / lage);
        for (let k = n0; k < n1; k++) {
          const z = k * lage, rr = r(z) * s, y = -z * KZ * s;
          const N = Math.max(8, Math.round(2 * Math.PI * r(z) / 0.25));
          const off = (k % 2) * Math.PI / N;
          for (let i = 0; i < N; i++) {
            const a0 = off + i * 2 * Math.PI / N, a1 = a0 + 2 * Math.PI / N;
            if (Math.sin((a0 + a1) / 2) < -0.05) continue;
            const x0 = Math.cos(a0) * rr, x1 = Math.cos(a1) * rr;
            if (Math.abs(x1 - x0) < 0.6) continue;
            const yA = y + Math.sin(a0) * rr * 0.5, yB = y + Math.sin(a1) * rr * 0.5;
            const e = eimer[(hash(i, k, 5) * 4) | 0];
            e.moveTo(x0, yA); e.lineTo(x1, yB); e.lineTo(x1, yB - pxL * 0.82); e.lineTo(x0, yA - pxL * 0.82); e.closePath();
          }
          fuge.moveTo(-rr, y); fuge.ellipse(0, y, rr, rr * 0.5, 0, Math.PI, 0, true);
        }
        g.save(); g.globalCompositeOperation = "multiply";
        [0.96, 1.06, 0.9, 1.0].forEach((k, i) => { g.fillStyle = "rgba(" + Math.round(255 * Math.min(1, k)) + "," + Math.round(240 * k) + "," + Math.round(232 * k) + ",0.55)"; g.fill(eimer[i]); });
        g.restore();
        g.strokeStyle = rgbS(Zg.fuge, 0.35); g.lineWidth = Math.max(0.5, pxL * 0.16); g.stroke(fuge);
      }
      /* Schmutzfahne oben, Spritzwasser unten */
      const gs = g.createLinearGradient(0, -H * KZ * s, 0, -(H - 3) * KZ * s);
      gs.addColorStop(0, "rgba(30,26,26,0.5)"); gs.addColorStop(1, "rgba(30,26,26,0)");
      g.fillStyle = gs; g.fillRect(-s, -H * KZ * s, 2 * s, 3 * KZ * s);
      /* Eisenbänder */
      g.lineWidth = Math.max(1, 0.05 * s);
      for (let z = 1.2; z < Math.min(hh, zK) - 0.2; z += 1.6) {
        const rr = r(z) * s + 0.5;
        g.strokeStyle = belicht([56, 54, 54], ST.lichtFaktor([0.5, 0.5, 0], F.Z, 0.05, F.jahr));
        g.beginPath(); g.ellipse(0, -z * KZ * s, rr, rr * 0.5, 0, 0, Math.PI, false); g.stroke();
      }
      g.restore();
      if (kopf) {
        /* Kopf: drei Kragschichten, heller Ring */
        const rk = r(zK) + 0.14;
        for (let i = 0; i < 3; i++) {
          const z = zK + 0.08 * i, rr = (r(zK) + 0.05 * (i + 1)) * s;
          g.strokeStyle = belicht(hellF(mitte, 0.12 - i * 0.04), ST.lichtFaktor([0.2, 0.6, 0.4], F.Z, 0, F.jahr), 0.8); g.lineWidth = Math.max(0.8, 0.03 * s);
          g.beginPath(); g.ellipse(0, -z * KZ * s, rr, rr * 0.5, 0, 0, Math.PI, false); g.stroke();
        }
        g.fillStyle = mantelVerlauf(g, F, null, -rk * s, rk * s, hellF(mitte, 0.05));
        g.fillRect(-rk * s, -(H - 0.02) * KZ * s, 2 * rk * s, 0.25 * KZ * s);
        g.fillStyle = mantelVerlauf(g, F, null, -rk * s, rk * s, [110, 110, 112]);
        g.fillRect(-rk * s, -(H - 0.1) * KZ * s, 2 * rk * s, 0.06 * KZ * s);
        /* Öffnung oben */
        const lfO = ST.lichtFaktor([0, 0, 1], F.Z, 0, F.jahr);
        g.fillStyle = belicht(F.jahr === "winter" ? SCHNEE : [120, 110, 104], lfO); g.beginPath(); g.ellipse(0, -H * KZ * s, rk * s, rk * s * 0.5, 0, 0, 2 * Math.PI); g.fill();
        g.fillStyle = "rgb(18,16,16)"; g.beginPath(); g.ellipse(0, -H * KZ * s, (rk - 0.14) * s, (rk - 0.14) * s * 0.5, 0, 0, 2 * Math.PI); g.fill();
        /* Blitzableiter */
        g.strokeStyle = belicht([70, 70, 74], lfO); g.lineWidth = Math.max(0.7, 0.02 * s);
        g.beginPath(); g.moveTo(rk * s * 0.7, -H * KZ * s + rk * s * 0.2); g.lineTo(rk * s * 0.7, -(H + 1.1) * KZ * s); g.stroke();
      } else if (hh > 0.05) {
        /* frische Mauerkrone */
        const rr = r(hh) * s, y = -hh * KZ * s;
        g.fillStyle = belicht(Zg.fuge, ST.lichtFaktor([0, 0, 1], F.Z, 0, F.jahr)); g.beginPath(); g.ellipse(0, y, rr, rr * 0.5, 0, 0, 2 * Math.PI); g.fill();
        g.fillStyle = "rgb(30,26,26)"; g.beginPath(); g.ellipse(0, y, rr * 0.6, rr * 0.3, 0, 0, 2 * Math.PI); g.fill();
      }
    };
  }
  /* Dunstrohr der Sudpfanne auf dem First: Kupferrohr mit Regenhut */
  function dunstrohr(g, s, F) {
    const sch = F.schatten, KZ = ST.KZ, r = 0.17, h = 1.5;
    const hut = () => { g.beginPath(); g.moveTo(-0.42 * s, -(h + 0.25) * KZ * s); g.lineTo(0, -(h + 0.62) * KZ * s); g.lineTo(0.42 * s, -(h + 0.25) * KZ * s); g.ellipse(0, -(h + 0.25) * KZ * s, 0.42 * s, 0.21 * s, 0, 0, Math.PI, false); g.closePath(); };
    if (sch) { g.fillStyle = "#000"; zylinderPfad(g, s, -0.3, h, r, r); g.fill(); hut(); g.fill(); return; }
    const kup = [98, 150, 128];      // grün angelaufenes Kupfer
    g.fillStyle = mantelVerlauf(g, F, null, -r * s, r * s, kup);
    zylinderPfad(g, s, -0.3, h + 0.25, r, r); g.fill();
    /* Stege zum Hut */
    g.fillStyle = belicht(hellF(kup, -0.3), ST.lichtFaktor([0.5, 0.5, 0], F.Z, 0, F.jahr));
    g.fillStyle = mantelVerlauf(g, F, null, -0.42 * s, 0.42 * s, hellF(kup, 0.05));
    hut(); g.fill();
    if (F.jahr === "winter") { g.fillStyle = belicht(SCHNEE, ST.lichtFaktor([0, 0, 1], F.Z, 0, F.jahr)); g.beginPath(); g.moveTo(-0.3 * s, -(h + 0.36) * KZ * s); g.lineTo(0, -(h + 0.64) * KZ * s); g.lineTo(0.3 * s, -(h + 0.36) * KZ * s); g.quadraticCurveTo(0, -(h + 0.3) * KZ * s, -0.3 * s, -(h + 0.36) * KZ * s); g.fill(); }
    /* Manschette am First */
    g.fillStyle = mantelVerlauf(g, F, null, -0.26 * s, 0.26 * s, [90, 92, 96]);
    zylinderPfad(g, s, -0.2, 0.12, 0.26, 0.24); g.fill();
  }
  /* Wetterfahne auf der Darrhaube */
  function wetterfahne(g, s, F) {
    const sch = F.schatten, KZ = ST.KZ;
    const lf = sch ? null : ST.lichtFaktor([0.3, 0.6, 0.7], F.Z, 0.05, F.jahr);
    const c = (f) => (sch ? "#000" : belicht(f, lf));
    g.fillStyle = c([60, 58, 56]); g.fillRect(-0.025 * s, -1.1 * KZ * s, 0.05 * s, 1.1 * KZ * s);
    g.fillStyle = c([190, 150, 70]); g.beginPath(); g.arc(0, -0.75 * KZ * s, 0.07 * s, 0, 2 * Math.PI); g.fill();
    /* Fähnchen: ein kleiner Brauerstern im Kreis */
    const y = -1.0 * KZ * s;
    g.beginPath(); g.moveTo(0, y - 0.12 * s); g.lineTo(0.55 * s, y - 0.12 * s); g.lineTo(0.55 * s, y + 0.1 * s); g.lineTo(0, y + 0.1 * s); g.closePath();
    g.fillStyle = c([50, 48, 48]); g.fill();
    if (!sch && s > 30) { g.fillStyle = belicht([200, 170, 90], lf); g.beginPath(); g.arc(0.38 * s, y - 0.01 * s, 0.05 * s, 0, 2 * Math.PI); g.fill(); }
  }
  /* Aushubhaufen */
  function aushubFigur(k, winter) {
    return function (g, s, F) {
      const sch = F.schatten, rng = zuf(12);
      const b = 1.6 * Math.cbrt(k) * s, hh = 1.2 * Math.cbrt(k) * ST.KZ * s;
      const pfad = () => { g.beginPath(); g.moveTo(-b, 0); g.bezierCurveTo(-b * 0.7, -hh * 0.6, -b * 0.35, -hh * 1.05, 0, -hh); g.bezierCurveTo(b * 0.3, -hh * 1.02, b * 0.75, -hh * 0.5, b, 0); g.bezierCurveTo(b * 0.4, b * 0.22, -b * 0.4, b * 0.22, -b, 0); g.closePath(); };
      if (sch) { g.fillStyle = "#000"; pfad(); g.fill(); return; }
      const lf = ST.lichtFaktor([0, 0, 1], F.Z, 0, F.jahr);
      const gr = g.createLinearGradient(-b, -hh, b, 0);
      gr.addColorStop(0, belicht([150, 112, 74], lf)); gr.addColorStop(0.6, belicht([118, 86, 56], lf)); gr.addColorStop(1, belicht([82, 60, 40], lf));
      g.fillStyle = gr; pfad(); g.fill();
      g.save(); pfad(); g.clip();
      for (let i = 0; i < 120; i++) { const x = (rng() - 0.5) * 2 * b, y = -rng() * hh * 1.05, r = (0.03 + rng() * 0.07) * s; g.fillStyle = belicht(hellF([120, 92, 62], (rng() - 0.5) * 0.5), lf); g.beginPath(); g.ellipse(x, y, r * 1.3, r, rng() * 3, 0, 2 * Math.PI); g.fill(); }
      if (winter) { g.fillStyle = belicht(SCHNEE, lf); g.beginPath(); g.moveTo(-b * 0.75, -hh * 0.45); g.bezierCurveTo(-b * 0.4, -hh * 1.1, b * 0.3, -hh * 1.1, b * 0.7, -hh * 0.4); g.bezierCurveTo(b * 0.2, -hh * 0.7, -b * 0.3, -hh * 0.72, -b * 0.75, -hh * 0.45); g.fill(); }
      g.restore();
    };
  }
  /* Richtbaum zum Richtfest */
  function richtbaum(g, s, F) {
    const sch = F.schatten, z = (m) => -m * ST.KZ * s;
    const lf = sch ? null : ST.lichtFaktor([0.2, 0.5, 0.8], F.Z, 0.05, F.jahr);
    g.fillStyle = sch ? "#000" : belicht([90, 64, 40], lf); g.fillRect(-0.04 * s, z(0.9), 0.08 * s, -z(0.9));
    g.fillStyle = sch ? "#000" : belicht([34, 80, 46], lf);
    g.beginPath(); g.moveTo(0, z(2.2)); g.lineTo(-0.45 * s, z(0.7)); g.lineTo(0.45 * s, z(0.7)); g.closePath(); g.fill();
    if (sch) return;
    const farben = [[200, 30, 40], [240, 200, 40], [40, 90, 200], [250, 250, 250], [40, 150, 70]];
    for (let i = 0; i < 9; i++) {
      const y0 = z(1.0 + 0.12 * i), x0 = (i % 2 ? 0.22 : -0.22) * s * (1 - i / 12);
      g.strokeStyle = belicht(farben[i % farben.length], lf); g.lineWidth = Math.max(1, 0.04 * s);
      g.beginPath(); g.moveTo(x0, y0); g.quadraticCurveTo(x0 + 0.2 * s, y0 + 0.2 * s, x0 + (i % 2 ? 0.3 : -0.3) * s, y0 + 0.45 * s); g.stroke();
    }
  }

  /* ---------------- Fasslager im Hof ---------------- */
  function fasslagerFigur(W) {
    return function (g, s, F) {
      const K = kleinBlick(F, s), holz = [150, 106, 64], lag = [110, 84, 60];
      const teile = [];
      kisteFl(teile, -0.95, -0.36, 0, 0.95, -0.22, 0.12, lag, { schneeOk: true, kante: true, vor: -5 });
      kisteFl(teile, -0.95, 0.22, 0, 0.95, 0.36, 0.12, lag, { schneeOk: true, kante: true, vor: -5 });
      const R1 = 0.3, R0 = 0.26, L = 0.8;
      const ax = [0, 1, 0];
      const reihe1 = [-0.62, 0, 0.62].map((x, i) => fassTeile([x, 0, 0.12 + R1], ax, L, R0, R1, hellF(holz, (i - 1) * 0.05), { saat: i + 1 }));
      const z2 = 0.12 + R1 + Math.sqrt(4 * R1 * R1 - 0.31 * 0.31);
      const reihe2 = [-0.31, 0.31].map((x, i) => fassTeile([x, 0, z2], ax, L, R0, R1, hellF(holz, (i - 0.5) * 0.06), { saat: i + 7 }));
      const z3 = z2 + Math.sqrt(4 * R1 * R1 - 0.31 * 0.31);
      const oben = fassTeile([0, 0, z3], ax, L, R0, R1, holz, { saat: 11, hahn: true });
      /* Keile unter den äußeren Fässern */
      kisteFl(teile, -0.98, -0.3, 0.12, -0.86, 0.3, 0.2, [96, 72, 50], { vor: -4 });
      kisteFl(teile, 0.86, -0.3, 0.12, 0.98, 0.3, 0.2, [96, 72, 50], { vor: -4 });
      /* Fässer nach Lage (untere Reihe zuerst, dann darüber) */
      for (const f of reihe1.concat(reihe2, [oben])) { f.tief = K.tief(f.mitte) + f.mitte[2] * 0.6; teile.push(f); }
      kleinMalen(g, K, F, teile);
    };
  }
  /* zwei stehende Fässer / halbe Fässer mit Blumen neben der Mälzereitür */
  function kuebelFigur(W, saat) {
    return function (g, s, F) {
      const K = kleinBlick(F, s), winter = F.jahr === "winter", holz = [146, 102, 62];
      if (winter) {
        const f = fassTeile([0, 0, 0.45], [0, 0, 1], 0.9, 0.27, 0.31, holz, { saat: saat });
        kleinMalen(g, K, F, [f]);
        return;
      }
      /* halbes Fass als Pflanzkübel */
      const f = fassTeile([0, 0, 0.25], [0, 0, 1], 0.5, 0.3, 0.33, holz, { saat: saat, reifen: [-0.6, 0.7], schnee: false });
      kleinMalen(g, K, F, [f]);
      if (F.schatten) { g.fillStyle = "#000"; g.beginPath(); g.ellipse(0, -0.62 * ST.KZ * s, 0.34 * s, 0.25 * s, 0, 0, 2 * Math.PI); g.fill(); return; }
      /* Erde und Blumen */
      const lf = ST.lichtFaktor([0, 0, 1], F.Z, 0.05, F.jahr), y0 = -0.5 * ST.KZ * s, rng = zuf(saat * 13);
      g.fillStyle = belicht([70, 52, 38], lf); g.beginPath(); g.ellipse(0, y0, 0.29 * s, 0.145 * s, 0, 0, 2 * Math.PI); g.fill();
      const blueten = F.jahr === "fruehling" ? [[240, 200, 40], [230, 90, 120], [150, 90, 200], [250, 250, 245]] : F.jahr === "herbst" ? [[200, 90, 40], [170, 40, 90], [230, 170, 50]] : [[214, 30, 42], [226, 58, 110], [250, 250, 245]];
      for (let i = 0; i < 40; i++) {
        const a = rng() * 2 * Math.PI, rr = Math.sqrt(rng()) * 0.3;
        const x = Math.cos(a) * rr * s, y = y0 + Math.sin(a) * rr * 0.5 * s - (0.05 + rng() * 0.22) * s;
        g.fillStyle = belicht(hellF([62, 110, 50], (rng() - 0.5) * 0.3), lf); g.beginPath(); g.ellipse(x, y, 0.05 * s, 0.035 * s, rng() * 3, 0, 2 * Math.PI); g.fill();
      }
      for (let i = 0; i < 16; i++) {
        const a = rng() * 2 * Math.PI, rr = Math.sqrt(rng()) * 0.26;
        const x = Math.cos(a) * rr * s, y = y0 + Math.sin(a) * rr * 0.5 * s - (0.15 + rng() * 0.2) * s;
        g.fillStyle = belicht(blueten[(rng() * blueten.length) | 0], lf); g.beginPath(); g.arc(x, y, Math.max(0.8, 0.035 * s), 0, 2 * Math.PI); g.fill();
      }
    };
  }
  /* ---------------- Der Bierwagen ----------------
     Brückenwagen mit niedrigen Bordwänden, vier Speichenrädern (hinten
     größer), Deichsel auf dem Boden, drei Fässer quer geladen. */
  function wagenFigur(W) {
    return function (g, s, F) {
      const K = kleinBlick(F, s), gruen = [50, 90, 62], rad = [130, 56, 38], eisen = [52, 52, 54], holz = [150, 106, 64];
      const teile = [];
      /* Brücke und Bordwände */
      kisteFl(teile, -1.2, -0.62, 0.84, 1.2, 0.62, 0.94, gruen, { schneeOk: true, kante: true });
      kisteFl(teile, -1.2, 0.56, 0.94, 1.2, 0.62, 1.14, hellF(gruen, 0.05), { schneeOk: true, kante: true });
      kisteFl(teile, -1.2, -0.62, 0.94, 1.2, -0.56, 1.14, hellF(gruen, 0.05), { schneeOk: true, kante: true });
      kisteFl(teile, 1.14, -0.56, 0.94, 1.2, 0.56, 1.1, hellF(gruen, 0.05), { schneeOk: true, kante: true });
      kisteFl(teile, -1.2, -0.56, 0.94, -1.14, 0.56, 1.1, hellF(gruen, 0.05), { schneeOk: true, kante: true });
      /* Achsen und Schemel */
      const xh = 0.82, xv = -0.85, rh = 0.52, rv = 0.42;
      kisteFl(teile, xh - 0.07, -0.76, rh - 0.05, xh + 0.07, 0.76, rh + 0.05, hellF(gruen, -0.25), {});
      kisteFl(teile, xh - 0.08, -0.5, rh + 0.05, xh + 0.08, 0.5, 0.84, hellF(gruen, -0.2), {});
      kisteFl(teile, xv - 0.07, -0.76, rv - 0.05, xv + 0.07, 0.76, rv + 0.05, hellF(gruen, -0.25), {});
      kisteFl(teile, xv - 0.08, -0.5, rv + 0.05, xv + 0.08, 0.5, 0.84, hellF(gruen, -0.2), {});
      /* Deichsel: liegt vorn auf dem Boden, Ortscheit quer */
      balkenFl(teile, [xv - 0.1, 0, rv], [-2.55, 0, 0.07], 0.09, 0.09, hellF(holz, -0.1), { kante: true, schneeOk: true });
      balkenFl(teile, [-2.1, -0.4, 0.2], [-2.1, 0.4, 0.2], 0.07, 0.07, hellF(holz, -0.1), {});
      /* Räder */
      const radT = (x, y, r) => ({
        mitte: [x, y, r],
        zeichnen(g2, K2, F2) {
          const sch = F2.schatten, n = [0, Math.sign(y), 0];
          const sicht = K2.sicht(n) > 0 ? n : mul(n, -1);
          const lf = K2.lf(sicht, 0.04);
          const C0 = [x, y - sicht[1] * 0.04, r], C1 = [x, y + sicht[1] * 0.04, r];
          const ellip = (C, rr) => { const c = K2.p(C), u = sub3(K2.p(add(C, [1, 0, 0])), c), v = sub3(K2.p(add(C, [0, 0, 1])), c); g2.save(); g2.transform(u[0], u[1], v[0], v[1], c[0], c[1]); g2.beginPath(); g2.arc(0, 0, rr, 0, 2 * Math.PI); g2.restore(); };
          if (sch) { g2.fillStyle = "#000"; ellip(C1, r); g2.fill(); return; }
          /* hintere Kante der Felge (Dicke) */
          g2.fillStyle = belicht(hellF(eisen, -0.3), lf); ellip(C0, r); g2.fill();
          const c = K2.p(C1), u = sub3(K2.p(add(C1, [1, 0, 0])), c), v = sub3(K2.p(add(C1, [0, 0, 1])), c);
          g2.save(); g2.transform(u[0], u[1], v[0], v[1], c[0], c[1]);
          g2.fillStyle = belicht(eisen, lf); g2.beginPath(); g2.arc(0, 0, r, 0, 2 * Math.PI); g2.arc(0, 0, r - 0.04, 0, 2 * Math.PI, true); g2.fill();
          g2.fillStyle = belicht(rad, lf); g2.beginPath(); g2.arc(0, 0, r - 0.04, 0, 2 * Math.PI); g2.arc(0, 0, r - 0.11, 0, 2 * Math.PI, true); g2.fill();
          g2.strokeStyle = belicht(rad, lf); g2.lineWidth = 0.045;
          for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; g2.beginPath(); g2.moveTo(Math.cos(a) * 0.09, Math.sin(a) * 0.09); g2.lineTo(Math.cos(a) * (r - 0.1), Math.sin(a) * (r - 0.1)); g2.stroke(); }
          g2.fillStyle = belicht(hellF(rad, -0.15), lf); g2.beginPath(); g2.arc(0, 0, 0.1, 0, 2 * Math.PI); g2.fill();
          g2.fillStyle = belicht(eisen, lf); g2.beginPath(); g2.arc(0, 0, 0.045, 0, 2 * Math.PI); g2.fill();
          if (F2.jahr === "winter") { g2.strokeStyle = belicht(SCHNEE, K2.lf([0, 0, 1])); g2.lineWidth = 0.03; g2.beginPath(); g2.arc(0, 0, r - 0.02, Math.PI * 0.25, Math.PI * 0.75); g2.stroke(); }
          g2.restore();
        }
      });
      for (const [x, r] of [[xh, rh], [xv, rv]]) for (const y of [-0.8, 0.8]) teile.push(radT(x, y, r));
      /* Ladung: drei Fässer quer */
      const R1 = 0.33, R0 = 0.28;
      [-0.74, 0, 0.74].forEach((x, i) => teile.push(fassTeile([x, 0, 0.94 + R1], [0, 1, 0], 0.92, R0, R1, hellF(holz, (i - 1) * 0.05), { saat: 20 + i, hahn: i === 1 })));
      /* Bremskurbel hinten */
      balkenFl(teile, [1.22, 0.5, 0.7], [1.22, 0.5, 1.45], 0.04, 0.04, eisen, {});
      kleinMalen(g, K, F, teile);
    };
  }
  /* ---------------- Brauerstern (Zoiglstern) am Wandarm ----------------
     Ein Sechsstern aus zwei Dreiecken schmaler Latten (blau und weiß),
     hängt an Ketten unter einem geschmiedeten Ausleger. Ursprung: dort,
     wo der Ausleger aus der Wand kommt (Wand = Ebene y = 0, außen +y). */
  function sternFigur() {
    return function (g, s, F) {
      const K = kleinBlick(F, s), eisen = [44, 42, 42];
      const teile = [];
      const aus = 1.0;
      balkenFl(teile, [0, 0, 0], [0, aus, 0], 0.04, 0.05, eisen, {});
      balkenFl(teile, [0, 0, -0.5], [0, aus * 0.62, -0.02], 0.03, 0.03, eisen, {});
      balkenFl(teile, [0, 0.02, -0.08], [0, 0.02, 0.08], 0.14, 0.03, eisen, {});
      /* Ketten */
      const yS = aus * 0.78, zS = -0.62, R = 0.42;
      const kette = (y0, z0, y1, z1) => ({ mitte: [0, (y0 + y1) / 2, (z0 + z1) / 2], zeichnen(g2, K2, F2) { const a = K2.p([0, y0, z0]), b = K2.p([0, y1, z1]); g2.strokeStyle = F2.schatten ? "#000" : belicht(eisen, K2.lf([0.5, 0.5, 0.3])); g2.lineWidth = Math.max(0.6, 0.012 * K2.s); g2.beginPath(); g2.moveTo(a[0], a[1]); g2.lineTo(b[0], b[1]); g2.stroke(); } });
      teile.push(kette(yS - 0.2, 0, yS - R * 0.87, zS + R * 0.5), kette(yS + 0.2, 0, yS + R * 0.87, zS + R * 0.5));
      /* Latten des Sterns (Ebene x = 0) */
      const P = (k) => { const a = (90 + k * 60) * RAD; return [0, yS + Math.cos(a) * R, zS + Math.sin(a) * R]; };
      const latte = (A, B, c, vor) => {
        const d = sub(B, A), l = lang(d), q = nrm(kreuz(d, [1, 0, 0])), b = 0.03;
        const pa = add(A, mul(nrm(d), -0.03)), pb = add(B, mul(nrm(d), 0.03));
        teile.push({ pts: [add(pa, mul(q, b)), add(pb, mul(q, b)), add(pb, mul(q, -b)), add(pa, mul(q, -b))].map((p) => add(p, [vor, 0, 0])), n: [1, 0, 0], farbe: c, beidseitig: true, vor: vor * 0.01 });
        void l;
      };
      const blau = [44, 86, 164], weiss = [238, 236, 228];
      for (let i = 0; i < 3; i++) latte(P(2 * i), P(2 * i + 2), blau, 0.012);
      for (let i = 0; i < 3; i++) latte(P(2 * i + 1), P(2 * i + 3), weiss, -0.012);
      kleinMalen(g, K, F, teile);
    };
  }
  /* ---------------- Laterne am Tor (Wandarm, sechseckig) ---------------- */
  function laterneFigur() {
    return function (g, s, F) {
      const K = kleinBlick(F, s), eisen = [40, 40, 42];
      const teile = [];
      balkenFl(teile, [0, 0, 0.1], [0, 0.34, 0.1], 0.03, 0.04, eisen, {});
      balkenFl(teile, [0, 0, -0.18], [0, 0.22, 0.08], 0.02, 0.02, eisen, {});
      const C = [0, 0.36, -0.2];
      teile.push({
        mitte: C, zeichnen(g2, K2, F2) {
          const c = K2.p(C), sch = F2.schatten, w = 0.11 * K2.s, h = 0.3 * ST.KZ * K2.s;
          const lf = K2.lf([0.5, 0.6, 0.3], 0.05);
          g2.fillStyle = sch ? "#000" : belicht(eisen, lf);
          g2.beginPath(); g2.moveTo(c[0] - w * 1.3, c[1] - h * 0.5); g2.lineTo(c[0], c[1] - h * 0.5 - w * 0.9); g2.lineTo(c[0] + w * 1.3, c[1] - h * 0.5); g2.closePath(); g2.fill();
          g2.fillRect(c[0] - w * 0.7, c[1] + h * 0.5, w * 1.4, h * 0.12);
          if (sch) { g2.fillRect(c[0] - w, c[1] - h * 0.5, 2 * w, h); return; }
          const an = F2.nacht > 0.02;
          g2.fillStyle = an ? "rgba(255,226,160," + (0.55 + 0.45 * F2.nacht) + ")" : belicht([150, 164, 170], lf, 0.85);
          g2.fillRect(c[0] - w, c[1] - h * 0.5, 2 * w, h);
          g2.fillStyle = belicht(eisen, lf); g2.fillRect(c[0] - 0.012 * K2.s, c[1] - h * 0.5, 0.024 * K2.s, h);
          g2.fillRect(c[0] - w, c[1] - h * 0.5, 0.02 * K2.s, h); g2.fillRect(c[0] + w - 0.02 * K2.s, c[1] - h * 0.5, 0.02 * K2.s, h);
          if (F2.jahr === "winter") { g2.fillStyle = belicht(SCHNEE, K2.lf([0, 0, 1])); g2.beginPath(); g2.ellipse(c[0], c[1] - h * 0.5 - w * 0.55, w * 0.9, w * 0.3, 0, 0, 2 * Math.PI); g2.fill(); }
          if (an) F2.leuchtPunkt(c[0], c[1], 0.9 * K2.s, "255,206,140", 0.55 * F2.nacht);
        }
      });
      kleinMalen(g, K, F, teile);
    };
  }

  /* =====================================================================
     BAUZUSTAND
     ===================================================================== */
  function zustand(bau) {
    const k = (a, b) => klemm((bau - a) / (b - a), 0, 1);
    const stueck = (pts) => {
      if (bau < pts[0][0]) return 0;
      for (let i = pts.length - 1; i >= 0; i--) if (bau >= pts[i][0]) {
        if (i === pts.length - 1) return pts[i][1];
        return pts[i][1] + (pts[i + 1][1] - pts[i][1]) * (bau - pts[i][0]) / (pts[i + 1][0] - pts[i][0]);
      }
      return 0;
    };
    const fertig = bau >= 0.999;
    const Z = { bau: bau, fertig: fertig };
    Z.grubeT = bau < 0.19 ? 1.2 * glatt(k(0.0, 0.06)) * (1 - glatt(k(0.155, 0.19))) : 0;
    Z.aushub = bau < 0.2 ? glatt(k(0.0, 0.06)) * (1 - 0.85 * k(0.155, 0.19)) : 0;
    Z.fundament = bau >= 0.07 && bau < 0.2 ? k(0.07, 0.15) : -1;
    Z.boden = k(0.165, 0.2);
    Z.suH = stueck([[0.19, 0.001], [0.46, SU.zT], [0.54, SU.zF + 0.01]]);
    Z.maH = stueck([[0.2, 0.001], [0.44, MA.zT], [0.52, MA.zF + 0.01]]);
    Z.schlotH = stueck([[0.22, 0.001], [0.3, SCH.hk], [0.62, SCH.top]]);
    Z.schale = bau < 0.74;
    Z.stuhlSU = bau >= 0.54 && bau < 0.72 ? k(0.54, 0.6) : 0;
    Z.stuhlMA = bau >= 0.52 && bau < 0.7 ? k(0.52, 0.58) : 0;
    Z.richt = bau >= 0.58 && bau < 0.7;
    Z.dachSU = bau >= 0.6; Z.deckSU = k(0.6, 0.72);
    Z.dachMA = bau >= 0.58; Z.deckMA = k(0.58, 0.7);
    Z.reiter = k(0.7, 0.76);
    Z.fenster = (i) => bau >= 0.78 + (i % 12) * 0.009;
    Z.tueren = bau >= 0.88;
    Z.treppe = bau >= 0.86;
    Z.dunst = bau >= 0.84;
    Z.rinnen = bau >= 0.9;
    Z.schild = bau >= 0.93;
    Z.hof = bau >= 0.94;
    Z.stern = bau >= 0.96;
    Z.fass = bau >= 0.96;
    Z.wagen = bau >= 0.985;
    Z.deko = bau >= 0.97;
    Z.licht = fertig;
    return Z;
  }

  /* =====================================================================
     BAUGRUBE UND FUNDAMENTE (unter der Erde, durch die Öffnung gesehen)
     ===================================================================== */
  function imVieleck(x, y, P) {
    let drin = false;
    for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const a = P[i], b = P[j]; if ((a[1] > y) !== (b[1] > y) && x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]) drin = !drin; }
    return drin;
  }
  function lochClip(g, I) {
    const e = I.W.B.e, n = I.n, en = dot(e, n);
    if (en < 1e-3) return false;
    g.beginPath();
    GRUBE.forEach(([x, y], i) => { const t = (x * n[0] + y * n[1] - I.fl.d) / en; const P = [x - e[0] * t, y - e[1] * t, -e[2] * t]; const A = dot(P, I.u), B = dot(P, I.v); if (i) g.lineTo(A, B); else g.moveTo(A, B); });
    g.closePath(); g.clip();
    return true;
  }
  function grubenLicht(g, I, x0, y0, x1, y1) {
    const L = I.W.B.L, n = I.n, ln = dot(L, n);
    g.save();
    g.beginPath(); g.rect(x0 - 1, y0 - 1, x1 - x0 + 2, y1 - y0 + 2);
    if (ln > 0.02) GRUBE.forEach(([x, y], i) => { const t = (x * n[0] + y * n[1] - I.fl.d) / ln; const P = [x - L[0] * t, y - L[1] * t, -L[2] * t]; const A = dot(P, I.u), B = dot(P, I.v); if (i) g.lineTo(A, B); else g.moveTo(A, B); });
    g.fillStyle = "rgba(24,26,52,0.45)"; g.fill("evenodd");
    g.restore();
  }
  function lichtAuflegen(g, F, x0, y0, x1, y1) {
    const lf = lichtVon(F);
    g.save(); g.globalCompositeOperation = "multiply";
    g.fillStyle = "rgb(" + lf.map((v) => Math.round(v * 255)).join(",") + ")"; g.fillRect(x0 - 1, y0 - 1, x1 - x0 + 2, y1 - y0 + 2);
    g.restore();
  }
  function erdeWand(saat) {
    return function (g, F, I) {
      const x0 = I.A0, x1 = I.A0 + F.w, y0 = I.B0, y1 = I.B0 + F.h, px = F.px;
      g.save();
      if (!lochClip(g, I)) { g.restore(); return; }
      const lagen = [[-0.1, [68, 50, 34]], [0.3, [128, 92, 58]], [0.85, [172, 134, 88]]];
      lagen.forEach(([t, c], i) => {
        g.fillStyle = rgbS(c); g.beginPath(); g.moveTo(x0 - 0.2, y1 + 0.3); g.lineTo(x0 - 0.2, t);
        for (let x = x0 - 0.2; x <= x1 + 0.3; x += 0.3) g.lineTo(x, t + (i ? Math.sin(x * 1.3 + i * 2 + saat) * 0.05 + Math.sin(x * 3.7 + i) * 0.02 : 0));
        g.lineTo(x1 + 0.3, y1 + 0.3); g.closePath(); g.fill();
      });
      rausch(g, x0, y0, x1 - x0, y1 - y0, 0.9, 0.34, saat, 3);
      if (px > 10) {
        const rng = zuf(saat), n = Math.min(400, (x1 - x0) * (y1 - y0) * 7);
        for (let i = 0; i < n; i++) { const x = x0 + rng() * (x1 - x0), y = 0.3 + rng() * (y1 - 0.3), r = 0.015 + rng() * 0.04; g.fillStyle = rgbS(hellF([140, 130, 118], (rng() - 0.5) * 0.4)); g.beginPath(); g.ellipse(x, y, r * 1.3, r, rng() * 3, 0, 2 * Math.PI); g.fill(); }
        g.strokeStyle = "rgba(40,28,20,0.7)"; g.lineWidth = Math.max(0.005, 0.7 / px);
        for (let i = 0; i < (x1 - x0) * 1.2; i++) { const x = x0 + rng() * (x1 - x0); g.beginPath(); g.moveTo(x, 0.04); g.quadraticCurveTo(x + (rng() - 0.5) * 0.2, 0.15, x + (rng() - 0.5) * 0.25, 0.1 + rng() * 0.3); g.stroke(); }
      }
      const gd = g.createLinearGradient(0, 0, 0, y1); gd.addColorStop(0, "rgba(10,8,20,0)"); gd.addColorStop(1, "rgba(10,8,20,0.25)");
      g.fillStyle = gd; g.fillRect(x0 - 0.2, 0, x1 - x0 + 0.4, y1 + 0.1);
      grubenLicht(g, I, x0, y0, x1, y1);
      if (I.W.winter) { g.fillStyle = rgbS(SCHNEE); g.fillRect(x0 - 0.2, -0.1, x1 - x0 + 0.4, 0.18); }
      lichtAuflegen(g, F, x0, y0, x1, y1);
      g.restore();
    };
  }
  function erdeBoden(g, F, I) {
    const x0 = I.A0, x1 = I.A0 + F.w, y0 = I.B0, y1 = I.B0 + F.h;
    g.save();
    if (!lochClip(g, I)) { g.restore(); return; }
    g.fillStyle = "rgb(120,90,62)"; g.fillRect(x0, y0, x1 - x0, y1 - y0);
    rausch(g, x0, y0, x1 - x0, y1 - y0, 1.4, 0.36, 21, 3);
    if (F.px > 6) {
      g.strokeStyle = "rgba(70,50,34,0.45)"; g.lineWidth = 0.45;
      for (const d of [-0.8, 0.8]) { g.beginPath(); g.moveTo(x0 + 1, y0 + (y1 - y0) * 0.5 + d); g.bezierCurveTo(x0 + (x1 - x0) * 0.3, y0 + (y1 - y0) * 0.35 + d, x0 + (x1 - x0) * 0.6, y0 + (y1 - y0) * 0.65 + d, x1 - 1, y0 + (y1 - y0) * 0.5 + d); g.stroke(); }
    }
    if (I.W.winter) {
      const rng = zuf(33);
      for (let i = 0; i < 6; i++) { const cx = x0 + rng() * (x1 - x0), cy = y0 + rng() * (y1 - y0); g.fillStyle = "rgba(190,206,226,0.8)"; g.beginPath(); g.ellipse(cx, cy, 0.4 + rng() * 0.8, 0.25 + rng() * 0.4, rng() * 3, 0, 2 * Math.PI); g.fill(); }
      g.fillStyle = "rgba(236,241,250,0.35)"; g.fillRect(x0, y0, x1 - x0, y1 - y0);
    }
    grubenLicht(g, I, x0, y0, x1, y1);
    lichtAuflegen(g, F, x0, y0, x1, y1);
    g.restore();
  }
  function grubeBauen(W, T) {
    W.grube = [];
    W.grube.push({ fl: { n: [0, 0, 1], d: -T, pts: GRUBE.map(([x, y]) => [x, y, -T]) }, m: { malen: erdeBoden, keinLicht: true, keinSchatten: true }, ebene: -1 });
    const n = GRUBE.length;
    for (let i = 0; i < n; i++) {
      const a = GRUBE[i], b = GRUBE[(i + 1) % n];
      const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
      let nx = (b[1] - a[1]) / l, ny = -(b[0] - a[0]) / l;
      if (!imVieleck((a[0] + b[0]) / 2 + nx * 0.05, (a[1] + b[1]) / 2 + ny * 0.05, GRUBE)) { nx = -nx; ny = -ny; }
      const nn = [nx, ny, 0];
      const pts = [[a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], -T], [a[0], a[1], -T]];
      W.grube.push({ fl: { n: nn, d: nx * a[0] + ny * a[1], pts: pts }, m: dot(nn, W.B.e) > 0.002 ? { malen: erdeWand(i * 7 + 3), keinLicht: true, keinSchatten: true } : null, ebene: 0 });
    }
  }
  function fundamentMaler(st) {
    return function (g, F, I) {
      const x0 = I.A0, x1 = I.A0 + F.w, y0 = I.B0, y1 = I.B0 + F.h, px = F.px, oben = I.n[2] > 0.5, winter = I.W.winter;
      g.save();
      if (!oben && !lochClip(g, I)) { g.restore(); return; }
      if (oben) {
        if (st < 0.45) {
          g.fillStyle = "rgb(58,46,36)"; g.fillRect(x0, y0, x1 - x0, y1 - y0);
          g.strokeStyle = "rgb(118,70,44)"; g.lineWidth = Math.max(0.014, 0.8 / px);
          g.beginPath();
          for (let x = Math.ceil(x0 / 0.25) * 0.25; x < x1; x += 0.25) { g.moveTo(x, y0 + 0.08); g.lineTo(x, y1 - 0.08); }
          for (let y = Math.ceil(y0 / 0.25) * 0.25; y < y1; y += 0.25) { g.moveTo(x0 + 0.08, y); g.lineTo(x1 - 0.08, y); }
          g.stroke();
          g.fillStyle = "rgb(206,172,120)"; g.fillRect(x0, y0, x1 - x0, 0.05); g.fillRect(x0, y1 - 0.05, x1 - x0, 0.05); g.fillRect(x0, y0, 0.05, y1 - y0); g.fillRect(x1 - 0.05, y0, 0.05, y1 - y0);
        } else {
          const nass = st < 0.75;
          g.fillStyle = nass ? "rgb(104,106,108)" : "rgb(170,168,160)"; g.fillRect(x0, y0, x1 - x0, y1 - y0);
          rausch(g, x0, y0, x1 - x0, y1 - y0, 1.0, 0.22, 31, 3);
          if (nass) { g.fillStyle = "rgba(220,230,240,0.12)"; g.fillRect(x0, y0, x1 - x0, (y1 - y0) * 0.4); }
          if (px > 12) { g.fillStyle = "rgb(110,62,40)"; for (let x = Math.ceil(x0 / 0.6) * 0.6; x < x1; x += 0.6) for (let y = Math.ceil(y0 / 0.6) * 0.6; y < y1; y += 0.6) g.fillRect(x - 0.02, y - 0.02, 0.04, 0.04); }
          if (winter && !nass) { g.fillStyle = "rgba(240,244,251,0.7)"; g.fillRect(x0, y0, x1 - x0, y1 - y0); }
        }
      } else if (st < 0.7) {
        g.fillStyle = "rgb(60,46,32)"; g.fillRect(x0, y0, x1 - x0, y1 - y0);
        const rng = zuf(71);
        for (let y = y0; y < y1; y += 0.2) { g.fillStyle = rgbS(hellF([204, 168, 116], (rng() - 0.5) * 0.18)); g.fillRect(x0, y + 0.006, x1 - x0, 0.188); }
        g.fillStyle = "rgb(176,138,90)";
        for (let x = Math.ceil(x0 / 0.7) * 0.7; x < x1; x += 0.7) g.fillRect(x - 0.04, y0, 0.08, y1 - y0);
      } else {
        g.fillStyle = "rgb(168,166,158)"; g.fillRect(x0, y0, x1 - x0, y1 - y0);
        rausch(g, x0, y0, x1 - x0, y1 - y0, 1.1, 0.25, 40, 3);
        if (px > 8) { g.strokeStyle = "rgba(110,108,102,0.7)"; g.lineWidth = Math.max(0.005, 0.7 / px); g.beginPath(); for (let y = Math.ceil(y0 / 0.2) * 0.2; y < y1; y += 0.2) { g.moveTo(x0, y); g.lineTo(x1, y); } g.stroke(); }
      }
      if (!oben) { grubenLicht(g, I, x0, y0, x1, y1); lichtAuflegen(g, F, x0, y0, x1, y1); }
      g.restore();
    };
  }
  function fundamenteBauen(W, Z) {
    const st = Z.fundament, T = 1.2, tv = Z.grubeT;
    const unten = [[[0, 0, -1], Math.max(0, tv) - 0.001]];
    const mal = fundamentMaler(st);
    const m = (fl) => (fl.n[2] < -0.5 ? null : { malen: mal, keinLicht: fl.n[2] < 0.5, keinSchatten: fl.n[2] < 0.5 });
    const box = (name, x0, y0, x1, y1) => W.koerper("fund-" + name, quaderP(x0, y0, -T, x1, y1, 0), m, { schatten: false, schnitte: unten });
    const b = 0.3;
    box("su-s", SU.x0 - b, SU.y1 - 0.5, SU.x1 + b, SU.y1 + b); box("su-n", SU.x0 - b, SU.y0 - b, SU.x1 + b, SU.y0 + 0.5);
    box("su-o", SU.x1 - 0.5, SU.y0 + 0.5, SU.x1 + b, SU.y1 - 0.5); box("su-w", SU.x0 - b, SU.y0 + 0.5, SU.x0 + 0.5, SU.y1 - 0.5);
    box("ma-s", MA.x0 - b, MA.y1 - 0.5, SU.x0 - b, MA.y1 + b); box("ma-n", MA.x0 - b, MA.y0 - b, SU.x0 - b, MA.y0 + 0.5);
    box("ma-w", MA.x0 - b, MA.y0 + 0.5, MA.x0 + 0.5, MA.y1 - 0.5);
    box("ma-o", SU.x0 - b - 0.01 - 0.5, MA.y0 - b, SU.x0 - b - 0.01, SU.y0 - b - 0.01);
    box("schlot", SCH.x - SCH.hb - 0.15, SCH.y - SCH.hb - 0.15 + 0.1, SCH.x + SCH.hb + 0.15, SCH.y + SCH.hb - 0.02);
  }
  /* Rohes Bauholz für die Dachstühle */
  function holzMaler(g, F, I) {
    const x0 = I.A0, y0 = I.B0, w = F.w, h = F.h, px = F.px;
    g.fillStyle = rgbS(HOLZ); g.fillRect(x0 - 0.05, y0 - 0.05, w + 0.1, h + 0.1);
    if (px * Math.min(w, h) > 3) {
      g.strokeStyle = "rgba(120,86,50,0.35)"; g.lineWidth = Math.max(0.004, 0.6 / px);
      const lg = w > h, n = Math.min(5, Math.round((lg ? h : w) * px / 3));
      g.beginPath();
      for (let i = 0; i < n; i++) { const t = (i + 0.5) / n; if (lg) { g.moveTo(x0, y0 + h * t); g.lineTo(x0 + w, y0 + h * t + 0.01); } else { g.moveTo(x0 + w * t, y0); g.lineTo(x0 + w * t + 0.01, y0 + h); } }
      g.stroke();
    }
    if (I.W.winter && I.n[2] > 0.4) { g.fillStyle = "rgba(242,246,252,0.95)"; g.fillRect(x0 - 0.05, y0 - 0.05, w + 0.1, h + 0.1); }
  }
  function balken(W, name, P0, P1, b, t, hoch, verbund) {
    const ax = nrm(sub(P1, P0)), sd = nrm(kreuz(ax, hoch || [0, 0, 1])), hh = nrm(kreuz(sd, ax));
    const pts = [];
    for (const P of [P0, P1]) for (const a of [-b / 2, b / 2]) for (const c of [-t / 2, t / 2]) pts.push(add(P, add(mul(sd, a), mul(hh, c))));
    return W.koerper(name, pts, (fl) => (fl.n[2] < -0.6 ? null : { malen: holzMaler }), { schatten: false, wirft: false, verbund: verbund });
  }
  /* Offener Dachstuhl eines giebelständigen Hauses (First entlang y) */
  function dachstuhl(W, D, k, name) {
    const ys = []; for (let y = D.y0 + 0.35; y <= D.y1 - 0.3; y += 0.85) ys.push(y);
    const n = Math.ceil(ys.length * k);
    const zk = D.zT + (D.zF - D.zT) * 0.62, xk = (D.zF - zk) / D.neig;
    const vb = "stuhl-" + name;
    W.verbund(vb, [[D.x0, D.y0, D.zT], [D.x1, D.y0, D.zT], [D.x0, D.y1, D.zT], [D.x1, D.y1, D.zT], [D.xm, D.y0, D.zF + 0.4], [D.xm, D.y1, D.zF + 0.4]]);
    for (let i = 0; i < n; i++) {
      const y = ys[i];
      balken(W, name + "-dbalken" + i, [D.x0 + 0.05, y, D.zT + 0.1], [D.x1 - 0.05, y, D.zT + 0.1], 0.14, 0.2, [0, 1, 0], vb);
      for (const sx of [1, -1]) balken(W, name + "-sparren" + i + sx, [D.xm + sx * (D.hb - 0.1), y, D.zT + 0.3], [D.xm, y, D.zF + 0.3], 0.12, 0.18, [0, 1, 0], vb);
      balken(W, name + "-kehl" + i, [D.xm - xk, y, zk + 0.12], [D.xm + xk, y, zk + 0.12], 0.1, 0.14, [0, 1, 0], vb);
    }
    if (k >= 1) balken(W, name + "-pfette", [D.xm, D.y0 + 0.2, D.zF + 0.18], [D.xm, D.y1 - 0.2, D.zF + 0.18], 0.16, 0.16, [1, 0, 0], vb);
  }

  /* =====================================================================
     DAS MODELL
     ===================================================================== */
  function brauereiBauen(W, M, o) {
    const Z = W.Z, winter = W.winter;
    /* ---------------- Wandbeschreibungen (A = Flächenkoordinate) ----------------
       Süd: A = x · Ost: A = −y · Nord: A = −x · West: A = y */
    const rund = (a, w, z0, zk, nr, extra) => Object.assign({ art: "rund", a: a, w: w, z0: z0, zk: zk, nr: nr, licht: 0 }, extra || {});
    const stich = (a, z0, nr, extra) => Object.assign({ art: "stich", a: a, w: 0.62, h: 0.82, z0: z0, nr: nr, innen: "malz", licht: 0 }, extra || {});
    const lisSU = (a0, a1) => [[a0, a0 + 0.46], [a1 - 0.46, a1]];
    const ladenZu = (i) => (hash(i, W.saat, 3) < 0.35 ? null : 0.2 + 0.8 * hash(i, W.saat, 4));
    const SUS = {
      saat: 11, sockel: 0.7, traufe: SU.zT, gurte: [SU.gurt], lisenen: lisSU(SU.x0, SU.x1), ortgang: SU.zT,
      anker: [[SU.x0 + 1.2, SU.gurt + 0.25], [SU.x1 - 1.2, SU.gurt + 0.25]],
      oeff: [
        { art: "tor", a: SU.xm, w: 1.6, z0: 0.3, zk: 2.6 },
        rund(SU.xm - 2.05, 1.0, 1.15, 2.75, 1, { innen: "stube", licht: 1 }), rund(SU.xm + 2.05, 1.0, 1.15, 2.75, 2, { innen: "stube", licht: 0.9 }),
        rund(SU.xm, 1.8, 4.25, 5.45, 3, { innen: "kessel", licht: 1 }),
        rund(SU.xm - 2.05, 0.95, 4.45, 5.75, 4, { innen: "raum", licht: 0.7 }), rund(SU.xm + 2.05, 0.95, 4.45, 5.75, 5, { innen: "raum", licht: 0.8 }),
        { art: "schild", a: SU.xm, w: 3.5, h: 0.62, z1: 8.2 },
        { art: "auge", a: SU.xm, z: 9.05, r: 0.34 }
      ]
    };
    const SUO = {
      saat: 12, sockel: 0.7, traufe: SU.zT, gurte: [SU.gurt], lisenen: lisSU(-SU.y1, -SU.y0).concat([[-0.33, 0.13]]),
      anker: [[-2.0, SU.gurt + 0.25], [1.9, SU.gurt + 0.25]],
      wein: [-1.55, -0.4, 6.0],
      oeff: [
        rund(-2.15, 1.0, 1.15, 2.75, 6, { innen: "stube", licht: 0.8 }), rund(1.95, 1.0, 1.15, 2.75, 7, { innen: "raum", licht: 0 }),
        rund(-2.15, 1.1, 4.3, 5.6, 8, { innen: "bottich", licht: 1, kz0: 3.6, kz1: 5.2, kr: 1.0 }), rund(1.95, 1.1, 4.3, 5.6, 9, { innen: "kessel", licht: 1 })
      ]
    };
    const SUN = {
      saat: 13, sockel: 0.7, traufe: SU.zT, gurte: [SU.gurt], lisenen: lisSU(-SU.x1, -SU.x0), ortgang: SU.zT,
      oeff: [rund(-SU.xm - 1.6, 1.0, 4.45, 5.75, 10, { licht: 0.5 }), rund(-SU.xm + 1.6, 1.0, 4.45, 5.75, 11, { licht: 0 }), { art: "auge", a: -SU.xm, z: 8.6, r: 0.34 }]
    };
    const SUW = {
      saat: 14, sockel: 0.7, traufe: SU.zT, gurte: [SU.gurt], lisenen: lisSU(SU.y0, SU.y1),
      oeff: [rund(2.2, 1.0, 1.15, 2.75, 12, { innen: "stube", licht: 1 }), rund(2.2, 1.0, 4.45, 5.75, 13, { licht: 0.6 }),
        rund(-0.4, 0.8, 6.0, 6.45, 14, { licht: 0 }), rund(-2.3, 0.8, 6.0, 6.45, 15, { licht: 0 })]
    };
    const MAS = {
      saat: 21, sockel: 0.55, traufe: null, ortgang: MA.zT, lisenen: [[MA.x0, MA.x0 + 0.42], [MA.x1 - 0.36, MA.x1]],
      gurte: [MA.zT - 0.1],
      oeff: [
        { art: "tuer", a: MA.xm, w: 1.15, h: 2.15, z0: 0.18 },
        stich(MA.xm - 1.35, 1.1, 20), stich(MA.xm + 1.35, 1.1, 21, { licht: 0.7, innen: "stube" }),
        stich(MA.xm - 1.35, 2.85, 22, { laden: ladenZu(1) }), stich(MA.xm, 2.85, 23, { laden: ladenZu(2) }), stich(MA.xm + 1.35, 2.85, 24, { laden: ladenZu(3) }),
        stich(MA.xm - 0.75, 4.45, 25, { laden: ladenZu(4) }), stich(MA.xm + 0.75, 4.45, 26, { laden: ladenZu(5) }),
        stich(MA.xm, 6.2, 27, { w: 0.5, h: 0.6, laden: 0.9 })
      ]
    };
    const maReihe = (as, nr) => {
      const l = [];
      as.forEach((a, i) => { l.push(stich(a, 1.1, nr + i * 3)); l.push(stich(a, 2.85, nr + i * 3 + 1, { laden: ladenZu(nr + i) })); l.push(stich(a, 4.45, nr + i * 3 + 2, { laden: ladenZu(nr + i + 7) })); });
      return l;
    };
    const MAW = { saat: 22, sockel: 0.55, traufe: MA.zT, lisenen: [[MA.y0, MA.y0 + 0.42], [MA.y1 - 0.42, MA.y1]], oeff: maReihe([-3.55, -1.8, -0.05], 30), wein: [0.36, 0.96, 4.6] };
    const MAN = { saat: 23, sockel: 0.55, traufe: null, ortgang: MA.zT, gurte: [MA.zT - 0.1], lisenen: [[-MA.x1, -MA.x1 + 0.36], [-MA.x0 - 0.42, -MA.x0]], oeff: maReihe([-MA.xm - 0.9, -MA.xm + 0.9], 40) };
    const MAO = { saat: 24, sockel: 0.55, traufe: MA.zT };
    const wand = (spec) => ({ malen: wandMaler(spec), danach: wandNacht(spec), ao: true });
    const nachNormale = (n, tab) => { let best = null, bd = -2; for (const [d, s] of tab) { const k = n[0] * d[0] + n[1] * d[1]; if (k > bd) { bd = k; best = s; } } return best; };
    const SU_TAB = [[[0, 1], SUS], [[1, 0], SUO], [[0, -1], SUN], [[-1, 0], SUW]];
    const MA_TAB = [[[0, 1], MAS], [[-1, 0], MAW], [[0, -1], MAN], [[1, 0], MAO]];

    /* ---------------- Baugrube, Fundament ---------------- */
    if (Z.grubeT > 0.02) grubeBauen(W, Z.grubeT);
    if (Z.fundament >= 0) fundamenteBauen(W, Z);
    if (Z.aushub > 0.02) W.figur("aushub", { x: -3.6, y: 3.3, z: 0, breite: 3.4, hoehe: 1.4, malen: aushubFigur(Z.aushub, winter) }, [1.5, 1.0]);

    /* ---------------- Häuser: Rohbau (offene Schalen) oder geschlossen ---------------- */
    const haus = (D, TAB, h, name, gr) => {
      const giebel = (x0, x1, y0, y1) => {
        const p = [];
        for (const y of [y0, y1]) {
          p.push([x0, y, 0], [x1, y, 0], [x0, y, D.zT], [x1, y, D.zT]);
          const xa = Math.max(x0, D.x0), xb = Math.min(x1, D.x1);
          if (xa <= D.xm && xb >= D.xm) p.push([D.xm, y, D.zF]);
          else { p.push([xa, y, dachZ(D, xa) - D.dv], [xb, y, dachZ(D, xb) - D.dv]); }
        }
        return p;
      };
      if (!Z.schale) {
        W.koerper(name, giebel(D.x0, D.x1, D.y0, D.y1), (fl) => {
          if (fl.n[2] < -0.5) return null;
          if (fl.n[2] > 0.3) return null;
          return wand(nachNormale(fl.n, TAB));
        }, { wirft: true, gruppe: gr });
        return;
      }
      if (h <= 0.01) return;
      const t = 0.42;
      const eb = TAB.map(([d, spec]) => [d, spec]);
      const schale = (fl) => {
        if (fl.n[2] > 0.5) return { malen: mauerkrone };
        if (fl.n[2] < -0.5) return null;
        if (Math.abs(fl.n[2]) > 0.3) return { malen: mauerkrone };
        for (const [d, spec] of eb) {
          const dd = d[0] === 0 ? (d[1] > 0 ? D.y1 : -D.y0) : (d[0] > 0 ? D.x1 : -D.x0);
          if (fl.n[0] * d[0] + fl.n[1] * d[1] > 0.995 && Math.abs(fl.d - dd) < 0.03) return wand(spec);
        }
        for (const [d, spec] of eb) if (fl.n[0] * d[0] + fl.n[1] * d[1] < -0.995) {
          const dd = d[0] === 0 ? (d[1] > 0 ? D.y1 - t : -(D.y0 + t)) : (d[0] > 0 ? D.x1 - t : -(D.x0 + t));
          if (Math.abs(fl.d + dd) < 0.03) return { malen: innenMaler(spec) };
        }
        return { malen: innenMaler(null) };
      };
      const o = { wirft: true, bisZ: h, gruppe: "haus" };
      W.koerper(name + "-s", giebel(D.x0, D.x1, D.y1 - t, D.y1), schale, o);
      W.koerper(name + "-n", giebel(D.x0, D.x1, D.y0, D.y0 + t), schale, o);
      W.koerper(name + "-o", quaderP(D.x1 - t, D.y0 + t, 0, D.x1, D.y1 - t, D.zT), schale, o);
      W.koerper(name + "-w", quaderP(D.x0, D.y0 + t, 0, D.x0 + t, D.y1 - t, D.zT), schale, o);
      if (Z.boden > 0) W.koerper(name + "-boden", quaderP(D.x0 + t, D.y0 + t, 0, D.x1 - t, D.y1 - t, 0.15 * Z.boden), (fl) => (fl.n[2] < 0.5 ? null : { malen: bodenMaler }), { schatten: false });
    };
    haus(SU, SU_TAB, Z.suH, "sudhaus", "haus");
    haus(MA, MA_TAB, Z.maH, "malz", "haus");

    /* ---------------- Dachstühle, Richtbaum ---------------- */
    if (Z.stuhlSU > 0) dachstuhl(W, SU, Z.stuhlSU, "su");
    if (Z.stuhlMA > 0) dachstuhl(W, MA, Z.stuhlMA, "ma");
    if (Z.richt) W.figur("richtbaum", { x: SU.xm, y: SU.y1 - 0.4, z: SU.zF + 0.35, breite: 1.1, hoehe: 2.3, malen: richtbaum }, [0.3, 0.3]);

    /* ---------------- Dächer ---------------- */
    const dach = (D, name, gr, ueW, ueO, deck, opt) => {
      for (const sx of [1, -1]) {
        const ue = sx > 0 ? ueO : ueW;
        const xe = D.xm + sx * (D.hb + ue), ze = D.zT - ue * D.neig, p = [];
        for (const y of [D.y0 - D.ort, D.y1 + D.ort]) p.push([D.xm, y, D.zF], [D.xm, y, D.zF + D.dv], [xe, y, ze], [xe, y, ze + D.dv]);
        const dm = dachMaler(Object.assign({ saat: (sx > 0 ? 5 : 6) + name.length, eindeck: deck, first: true, rinneWand: opt && opt.rinneWand && sx > 0 }, opt || {}));
        W.koerper("dach-" + name + sx, p, (fl) => {
          if (fl.n[2] > 0.3) return { malen: dm };
          if (fl.n[2] < -0.3) return null;
          if (Math.abs(fl.n[1]) > 0.9) return { malen: ortMaler };
          return { malen: brettMaler([72, 58, 46]) };
        }, { wirft: true, gruppe: gr });
      }
    };
    if (Z.dachSU) dach(SU, "su", "haus", SU.ue, SU.ue, Z.deckSU);
    if (Z.dachMA) dach(MA, "ma", "haus", MA.ue, 0, Z.deckMA, { rinneWand: true });

    /* ---------------- Darrhaube auf der Mälzerei ---------------- */
    if (Z.reiter > 0) {
      const x0 = DR.x - DR.hb, x1 = DR.x + DR.hb, y0 = DR.y - DR.hb, y1 = DR.y + DR.hb;
      const zS = MA.zF + MA.dv + DR.sockel, zL = zS + DR.lam, zSp = zL + DR.spitze;
      const sockelPts = [];
      for (const y of [y0, y1]) sockelPts.push([x0, y, dachZ(MA, x0) - 0.02], [DR.x, y, MA.zF + MA.dv - 0.02], [x1, y, dachZ(MA, x1) - 0.02], [x0, y, zS], [x1, y, zS]);
      const zink = [120, 128, 136];
      W.koerper("darre-sockel", sockelPts, (fl) => (fl.n[2] < -0.3 ? null : { malen: blechMaler(zink, true) }), { wirft: true, gruppe: "haus" });
      if (Z.reiter > 0.35) W.koerper("darre-lamellen", quaderP(x0 + 0.06, y0 + 0.06, zS, x1 - 0.06, y1 - 0.06, zL), (fl) => (Math.abs(fl.n[2]) > 0.5 ? null : { malen: lamellenMaler }), { wirft: true, gruppe: "haus" });
      if (Z.reiter > 0.7) {
        const u = DR.ue, hp = [[x0 - u, y0 - u, zL - 0.05], [x1 + u, y0 - u, zL - 0.05], [x1 + u, y1 + u, zL - 0.05], [x0 - u, y1 + u, zL - 0.05], [DR.x, DR.y, zSp]];
        W.koerper("darre-haube", hp, (fl) => (fl.n[2] < -0.3 ? null : { malen: blechMaler([84, 92, 100], true) }), { wirft: true, gruppe: "haus" });
        if (Z.fertig || Z.bau > 0.8) W.figur("fahne", { x: DR.x, y: DR.y, z: zSp - 0.05, breite: 1.2, hoehe: 1.2, malen: wetterfahne }, [0.08, 0.08]);
      }
    }

    /* ---------------- Schlot ---------------- */
    if (Z.schlotH > 0.01) {
      const hs = Math.min(SCH.hk, Z.schlotH);
      const sock = (fl) => {
        if (fl.n[2] > 0.5) return { malen: sockelKappe };
        if (fl.n[2] < -0.5) return null;
        return { malen: wandMaler({ saat: 31, sockel: 0.45, gurte: [SCH.hk - 0.05] }), ao: true };
      };
      W.koerper("schlot-sockel", quaderP(SCH.x - SCH.hb, SCH.y - SCH.hb, 0, SCH.x + SCH.hb, SCH.y + SCH.hb, SCH.hk), sock, { wirft: true, bisZ: hs, gruppe: "haus" });
      if (Z.schlotH > SCH.hk + 0.05) {
        const hb = Z.schlotH - SCH.hk;
        W.figur("schlot", { x: SCH.x, y: SCH.y, z: SCH.hk, breite: 1.6, hoehe: Math.max(0.5, hb) + 1.2, malen: schlotFigur(W, hb) }, [0.55, 0.55]);
        /* unsichtbarer Körper: der Schlot wirft Schatten auf Dach und Wand */
        const acht = [];
        for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; acht.push([SCH.x + Math.cos(a) * 0.5, SCH.y + Math.sin(a) * 0.5]); }
        W.koerper("schlot-schatten", prisma(acht, SCH.hk + 0.02, SCH.hk + hb), () => null, { wirft: true, schatten: false, unsichtbar: true });
      }
    }

    /* ---------------- Dunstrohr auf dem Sudhausfirst ---------------- */
    if (Z.dunst && Z.dachSU && Z.deckSU >= 1) {
      const d = W.figur("dunst", { x: SU.xm, y: 0.9, z: SU.zF + SU.dv - 0.02, breite: 1.0, hoehe: 2.2, malen: dunstrohr }, [0.3, 0.3]);
      if (d) d.nach = W.k.filter((K) => /^dach-su/.test(K.name));
    }

    /* ---------------- Stufen, Rinnen, Fallrohre, Eiszapfen ---------------- */
    if (Z.treppe) {
      W.koerper("stufe0", quaderP(SU.xm - 1.15, SU.y1, 0, SU.xm + 1.15, SU.y1 + 0.62, 0.15), (fl) => (fl.n[2] < -0.3 ? null : { malen: stufeMaler }), { schatten: false });
      W.koerper("stufe1", quaderP(SU.xm - 1.0, SU.y1, 0.15, SU.xm + 1.0, SU.y1 + 0.32, 0.3), (fl) => (fl.n[2] < -0.3 ? null : { malen: stufeMaler }), { schatten: false });
      W.koerper("stufe-ma", quaderP(MA.xm - 0.8, MA.y1, 0, MA.xm + 0.8, MA.y1 + 0.34, 0.17), (fl) => (fl.n[2] < -0.3 ? null : { malen: stufeMaler }), { schatten: false });
    }
    if (Z.rinnen) {
      const rinne = (name, x0, x1, y0, y1, z) => W.koerper(name, quaderP(x0, y0, z - 0.17, x1, y1, z), (fl) => (fl.n[2] < -0.3 ? null : { malen: rinneMaler }), { schatten: false });
      /* Sudhaus: Traufen Ost und West (Rinne quer zur Wand, entlang y) */
      const rq = (name, x0, x1, y0, y1, z) => W.koerper(name, quaderP(x0, y0, z - 0.17, x1, y1, z), (fl) => (fl.n[2] < -0.3 ? null : { malen: rinneMaler }), { schatten: false });
      rq("rinne-su-o", SU.x1 + SU.ue, SU.x1 + SU.ue + 0.16, SU.y0 - SU.ort + 0.05, SU.y1 + SU.ort - 0.05, SU.ze + 0.02);
      rq("rinne-su-w", SU.x0 - SU.ue - 0.16, SU.x0 - SU.ue, SU.y0 - SU.ort + 0.05, SU.y1 + SU.ort - 0.05, SU.ze + 0.02);
      rq("rinne-ma-w", MA.x0 - MA.ue - 0.16, MA.x0 - MA.ue, MA.y0 - MA.ort + 0.05, MA.y1 + MA.ort - 0.05, MA.ze + 0.02);
      void rinne;
      const rohr = (name, x, y, zo, xw) => {
        W.koerper(name, quaderP(x - 0.06, y - 0.06, 0, x + 0.06, y + 0.06, zo), (fl) => (fl.n[2] < -0.3 ? null : { malen: rohrMaler }), { schatten: false });
        void xw;
      };
      rohr("rohr-su-o1", SU.x1 + 0.12, SU.y1 - 0.25, SU.ze - 0.6);
      rohr("rohr-su-o2", SU.x1 + 0.12, SU.y0 + 0.25, SU.ze - 0.6);
      rohr("rohr-ma-w", MA.x0 - 0.12, MA.y1 - 0.25, MA.ze - 0.55);
      /* Schwanenhälse */
      const hals = (name, x0, x1, y, z0, z1) => { const pp = []; for (const dy of [-0.06, 0.06]) pp.push([x0, y + dy, z0], [x0 + Math.sign(x1 - x0) * 0.12, y + dy, z0], [x1, y + dy, z1], [x1 + Math.sign(x1 - x0) * 0.12, y + dy, z1]); W.koerper(name, pp, (fl) => (fl.n[2] < -0.5 ? null : { malen: rohrMaler }), { schatten: false }); };
      hals("hals-su-o1", SU.x1 + 0.06, SU.x1 + SU.ue + 0.02, SU.y1 - 0.25, SU.ze - 0.6, SU.ze - 0.18);
      hals("hals-su-o2", SU.x1 + 0.06, SU.x1 + SU.ue + 0.02, SU.y0 + 0.25, SU.ze - 0.6, SU.ze - 0.18);
      hals("hals-ma-w", MA.x0 - 0.06, MA.x0 - MA.ue - 0.02, MA.y1 - 0.25, MA.ze - 0.55, MA.ze - 0.18);
      if (winter) {
        const eis = (name, x, y0, y1, z, sg, saat) => W.koerper(name, quaderP(Math.min(x, x + sg * 0.01), y0, z - 0.5, Math.max(x, x + sg * 0.01), y1, z - 0.15),
          (fl) => (Math.abs(fl.n[0]) > 0.9 ? { malen: eisMaler(saat), keinLicht: true, keinSchatten: true } : null), { schatten: false });
        eis("eis-su-o", SU.x1 + SU.ue + 0.17, SU.y0 + 0.4, SU.y1 - 0.4, SU.ze, 1, 3);
        eis("eis-su-w", SU.x0 - SU.ue - 0.17, SU.y0 + 0.4, SU.y1 - 0.4, SU.ze, -1, 4);
        eis("eis-ma-w", MA.x0 - MA.ue - 0.17, MA.y0 + 0.4, MA.y1 - 0.4, MA.ze, -1, 5);
      }
    }

    /* ---------------- Hof: Pflaster ---------------- */
    if (Z.hof) {
      const P = [[-6.0, MA.y1], [SU.x0, MA.y1], [SU.x0, SU.y1], [5.9, SU.y1], [5.9, 5.0], [-6.0, 5.0]];
      W.boden.push({ name: "pflaster", fl: { n: [0, 0, 1], d: 0.012, pts: P.map(([x, y]) => [x, y, 0.012]) }, m: { malen: pflasterMaler, keinSchatten: true, keinLicht: true } });
    }

    /* ---------------- Figuren: Stern, Laterne, Fässer, Wagen ---------------- */
    if (Z.stern) W.figur("stern", { x: SU.x1 - 0.23, y: SU.y1 + 0.02, z: 3.6, breite: 2.0, hoehe: 1.3, malen: sternFigur() }, [0.12, 0.02], {});
    if (Z.stern) {
      const st = W.k[W.k.length - 1];
      /* Box des Sterns: vom Ausleger bis unter den Stern (vor der Südwand) */
      const pts = quaderP(SU.x1 - 0.33, SU.y1 + 0.01, 2.45, SU.x1 - 0.13, SU.y1 + 1.3, 3.7);
      st.H = huelle3(pts); st.mitte = mitteVon(st.H.punkte);
    }
    if (Z.deko) {
      W.figur("laterne", { x: SU.xm + 1.22, y: SU.y1 + 0.02, z: 2.7, breite: 0.8, hoehe: 0.7, malen: laterneFigur() }, [0.12, 0.02]);
      const la = W.k[W.k.length - 1];
      la.H = huelle3(quaderP(SU.xm + 1.1, SU.y1 + 0.01, 2.3, SU.xm + 1.34, SU.y1 + 0.5, 2.85)); la.mitte = mitteVon(la.H.punkte);
    }
    if (Z.fass) {
      W.figur("fasslager", { x: -4.85, y: 1.85, z: 0, breite: 2.4, hoehe: 1.9, malen: fasslagerFigur(W) }, [0.98, 0.42]);
      W.figur("kuebel1", { x: -2.3, y: 1.55, z: 0, breite: 0.8, hoehe: 1.0, malen: kuebelFigur(W, 3) }, [0.34, 0.34]);
      W.figur("kuebel2", { x: -1.65, y: 1.7, z: 0, breite: 0.8, hoehe: 1.0, malen: kuebelFigur(W, 5) }, [0.34, 0.34]);
    }
    if (Z.wagen) W.figur("wagen", { x: -3.3, y: 3.75, z: 0, breite: 4.2, hoehe: 1.8, malen: wagenFigur(W) }, [2.6, 0.85]);
    /* die Box des Wagens reicht von der Deichsel (−2,6) bis hinten (1,25) */
    if (Z.wagen) { const wg = W.k[W.k.length - 1]; wg.H = huelle3(quaderP(-3.3 - 2.62, 3.75 - 0.86, 0, -3.3 + 1.26, 3.75 + 0.86, 1.8)); wg.mitte = mitteVon(wg.H.punkte); }

    /* ---------------- Rauch und Licht ---------------- */
    if (Z.fertig) {
      M.rauchAus(SCH.x, SCH.y, SCH.top + 0.1, 1.0);
      M.rauchAus(SU.xm, 0.9, SU.zF + SU.dv + 2.1, 0.45);
      M.rauchAus(DR.x, DR.y, MA.zF + MA.dv + DR.sockel + DR.lam * 0.6, 0.3);
    }
  }
  /* Boden im Rohbau: Estrich */
  function bodenMaler(g, F, I) {
    const x0 = I.A0, y0 = I.B0;
    g.fillStyle = "rgb(164,160,152)"; g.fillRect(x0, y0, F.w, F.h);
    rausch(g, x0, y0, F.w, F.h, 1.5, 0.22, 23, 3);
    if (I.W.winter) { g.fillStyle = "rgba(240,244,251,0.8)"; g.fillRect(x0, y0, F.w, F.h); }
  }
  /* Sandsteinabdeckung auf dem Schlotsockel */
  function sockelKappe(g, F, I) {
    const x0 = I.A0, y0 = I.B0;
    g.fillStyle = rgbS(STEIN); g.fillRect(x0, y0, F.w, F.h);
    rausch(g, x0, y0, F.w, F.h, 0.8, 0.25, 9, 3);
    if (I.W.winter) { g.fillStyle = rgbS(SCHNEE); g.fillRect(x0 + 0.04, y0 + 0.04, F.w - 0.08, F.h - 0.08); }
  }
  /* Lamellen der Darrhaube: schräge Bretter, dahinter Dunkel */
  function lamellenMaler(g, F, I) {
    const x0 = I.A0, x1 = I.A0 + F.w, y0 = I.B0, y1 = I.B0 + F.h, px = F.px, c = [92, 84, 76];
    g.fillStyle = "rgb(30,26,24)"; g.fillRect(x0, y0, x1 - x0, y1 - y0);
    for (let y = y0 + 0.02; y < y1; y += 0.11) {
      g.fillStyle = rgbS(hellF(c, 0.12)); g.fillRect(x0, y, x1 - x0, 0.06);
      g.fillStyle = rgbS(hellF(c, -0.25)); g.fillRect(x0, y + 0.06, x1 - x0, 0.02);
      if (I.W.winter && px > 10) { g.fillStyle = "rgba(244,247,252,0.8)"; g.fillRect(x0, y - 0.01, x1 - x0, 0.015); }
    }
    /* Eckpfosten und Rahmen */
    g.fillStyle = rgbS(hellF(c, -0.1)); g.fillRect(x0, y0, 0.08, y1 - y0); g.fillRect(x1 - 0.08, y0, 0.08, y1 - y0); g.fillRect(x0, y1 - 0.08, x1 - x0, 0.08); g.fillRect(x0, y0, x1 - x0, 0.06);
    rausch(g, x0, y0, x1 - x0, y1 - y0, 0.8, 0.25, 7, 3);
  }

  /* =====================================================================
     ANMELDEN
     ===================================================================== */
  ST.modell("brauerei", {
    name: "Brauerei", gruppe: "Häuser", grund: [12, 10], hoehe: 15, bauzeit: 15 * 60,
    bauen(M, o) {
      const B = blickVon(o);
      const W = new Werk(o, B);
      const bau = o.bau == null ? 1 : klemm(o.bau, 0, 1);
      W.Z = zustand(bau);
      W.winter = o.jahr === "winter";
      const saat = (o.saat >>> 0) || 7;
      W.saat = saat;
      W.ziegel = o.variante === "braun" || (o.variante !== "rot" && saat % 4 === 3) ? ZIEGEL.braun : ZIEGEL.rot;
      W.torFarbe = TORFARBEN[saat % 3];
      brauereiBauen(W, M, o);
      ausgeben(W, M);
      /* Licht vor dem Tor, nur wenn die Südseite zum Betrachter zeigt */
      if (W.Z.licht && B.e[1] > 0.05) {
        M.bodenlicht(SU.xm, SU.y1 + 1.2, 2.6, "255,200,130", 0.7);
        M.bodenlicht(SU.xm + 1.22, SU.y1 + 0.8, 1.4, "255,206,140", 0.5);
      }
    }
  });
})();
