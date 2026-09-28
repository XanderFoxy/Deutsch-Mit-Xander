/* =====================================================================
   BIBLIOTHEK — klassizistische Stadtbibliothek mit Säulenportikus
   ---------------------------------------------------------------------
   XANDER: „richtig filigran. Richtig schön ausarbeiten mit schönen
   Texturen" · „keine Comic Grafik … viel mehr am Realismus" · „ohne
   Pixelkanten und komische Vektorrückstände" · „Man soll das Fundament
   sehen beim Aufbauen" · „Du bist dein schlimmster Kritiker" · Stil
   „von Anno oder geiler", „trotzdem mit SVG Grafiken".

   VORBILD
   Die kleinen klassizistischen Bibliotheken und Lesehallen um 1830–1840
   (Leo von Klenze, Friedrich Weinbrenner, Georg Moller): ein strenger
   Quaderbau aus hellem Sandstein auf einem rustizierten Sockel, vor der
   Mitte ein viersäuliger ionischer Portikus mit Dreiecksgiebel. Im
   Giebelfeld (Tympanon) ein Relief: die Eule der Minerva auf einem
   Bücherstapel zwischen Lorbeerzweigen. Im Fries über den Säulen steht
   in Bronzelettern „BIBLIOTHEK", im Architrav die Jahreszahl MDCCCXL.
   Hohe Rundbogenfenster mit profilierten Gewänden und Schlusssteinen –
   dahinter der Lesesaal mit Bücherwänden bis unter die Decke und einer
   Galerie. Flaches Walmdach aus Kupfer mit grüner Patina, obenauf eine
   verglaste Dachlaterne, die Licht in den Lesesaal bringt. Eine
   Freitreppe mit Wangen führt zum Portal, auf den Wangen zwei
   gusseiserne Kandelaber.

   MASSE (Meter, x = Osten, y = Süden, Mitte des Grundrisses = 0,0)
     Grund          12 × 10 m
     Hauptbau       10,4 × 6,0 m, Sockel 0,9 m (Bossenquader),
                    Architrav 7,0 m, Fries 7,35 m, Kranzgesims 8,0–8,35 m
     Dach           Walmdach 33°, First 10,4 m
     Dachlaterne    1,4 × 1,4 m, Spitze 12,9 m
     Portikus       6,3 × 1,85 m, vier Säulen Ø 0,6 m, 6,1 m hoch
                    (Basis, kannelierter Schaft mit Entasis, Volutenkapitell),
                    Giebel 22°, bis 9,6 m
     Freitreppe     5 Stufen à 18 cm, Auftritt 30 cm
   Mensch 1,75 m; Portal 1,7 × 3,2 m; Fenster 1,4 × 4,1 m.

   WIE ES GEBAUT IST
   Wie Brauerei und Dorfkirche: konvexe Körper mit trennenden Ebenen
   (Reihenfolge je Blickwinkel), echte Eigenschatten, Muster an der Welt.
   Säulen, Kandelaber, Kübel und Knauf sind aufrecht gemalte Figuren mit
   kleiner 3D-Rechnung (Kanneluren, Voluten als Polster mit Schnecke).
   Die Bücherwand ist eine nahtlose Kachel (Buchrücken in Leder- und
   Leinenfarben, Goldprägung nah), hinter dem Glas mit Parallaxe: vorn die
   Galerie mit Brüstung, dahinter die Regale.

   BAUPHASEN (o.bau 0 … 1)
     0,00–0,07  Baugrube · 0,07–0,15 Fundamente · 0,15–0,20 Bodenplatte
     0,20–0,30  rustizierter Sockel und Podest des Portikus
     0,19–0,52  Mauern wachsen (offene Schalen, Fensteröffnungen leer)
     0,44–0,56  Säulen, Trommel für Trommel; 0,53 Kranzgesims
     0,56–0,64  Gebälk und Giebel des Portikus
     0,60–0,72  Dachstuhl mit Richtbaum, Eindecken in blankem Kupfer
     0,76–0,84  Dachlaterne · 0,80–0,90 Fenster · 0,84–0,90 Freitreppe
     0,86–0,97  das Kupfer dunkelt nach und wird grün (Patina)
     0,90–1,00  Portal, Relief, Lettern, Kandelaber, Kübel
   Gerüst, Kran, Bagger und Arbeiter malt stadt/baustelle.js.

   JAHRESZEITEN, TAGESZEIT, VARIANTEN
   Winter: Schnee auf Dach, Laterne, Gesimsen, Sohlbänken, Kapitellen,
   Stufen (Mitte geräumt), Eiszapfen am Kranzgesims, Kranz am Portal,
   kleine Tannen in den Kübeln. Herbst: Laub auf Stufen und Podest.
   Frühling/Sommer: Buchskugeln. Nacht: die Bücherwände im warmen Licht,
   die Laterne leuchtet, Kandelaber brennen.
   o.saat: Sandstein gelblich, rötlich oder grau; Portal grün oder Eiche.
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
  const HB = { x0: -5.2, x1: 5.2, y0: -4.4, y1: 1.6, zS: 0.9, zA: 7.0, zF: 7.35, zG: 8.0, zT: 8.35 };
  const DA = { x0: -5.3, x1: 5.3, y0: -4.5, y1: 1.7, z: 8.35, neig: Math.tan(33 * RAD) };
  DA.ym = (DA.y0 + DA.y1) / 2; DA.hb = (DA.y1 - DA.y0) / 2; DA.zF = DA.z + DA.hb * DA.neig;
  const PO = { x0: -3.15, x1: 3.15, y0: 1.6, y1: 3.45, yg: 1.85, neig: Math.tan(22 * RAD) };
  PO.zSp = HB.zT + PO.x1 * PO.neig;              // Giebelspitze
  const SAEULE = { xs: [-2.6, -0.87, 0.87, 2.6], y: 3.02, r: 0.3, z0: HB.zS, h: HB.zA - HB.zS };
  const TREPPE = { x0: -2.9, x1: 2.9, y0: PO.y1, n: 5, st: 0.18, auf: 0.3 };
  TREPPE.y1 = TREPPE.y0 + TREPPE.n * TREPPE.auf;
  const DL = { x: 0, y: DA.ym, hb: 0.7, sockel: 0.18, glas: 0.95, dach: 0.78 };
  const GRUBE = [[-5.7, -4.9], [5.7, -4.9], [5.7, 2.0], [3.7, 2.0], [3.7, 4.0], [-3.7, 4.0], [-3.7, 2.0], [-5.7, 2.0]];

  /* ---------------- Farben (bei weißem Licht) ---------------- */
  const STEINE = { gelb: [214, 194, 152], rot: [206, 164, 136], grau: [196, 190, 176] };
  let STEIN = STEINE.gelb;
  const HOLZ = [206, 170, 118];
  const PATINA = [112, 162, 138], KUPFER_NEU = [186, 110, 70];
  const TUERF = [[40, 66, 54], [92, 62, 38]];
  const BRONZE = [150, 116, 60];
  const aufloesung = (F) => Math.min(360, Math.pow(2, Math.ceil(Math.log2(Math.max(F.pxU || F.px, F.pxV || F.px, 1) * 1.05) * 4) / 4));
  const TAGF = (c) => c;
  const NACHTF = (c) => [Math.min(255, c[0] * 1.3 + 30), Math.min(255, c[1] * 0.95 + 14), Math.min(255, c[2] * 0.45 + 4)];


  /* =====================================================================
     GEMEINSAME MALER (wie in der Brauerei)
     ===================================================================== */
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
  function lichtVon(F, extra) { return ST.lichtFaktor(F.n, F.zeit, extra || 0, F.jahr); }
  function rausch(g, x, y, w, h, meter, staerke, saat, okt) {
    const basis = [3, 17, 29][Math.abs(saat | 0) % 3];
    const dx = hash(saat, 1, 2) * meter * 3.1, dy = hash(saat, 2, 3) * meter * 2.7;
    g.save(); g.translate(dx, dy);
    PI.rauschen(g, x - dx, y - dy, w, h, meter, staerke, basis, okt && okt < 4 ? 3 : 4);
    g.restore();
  }
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
  function rundPfad(p, x, bK, w, bU) {
    const r = w / 2;
    p.moveTo(x, bU); p.lineTo(x, bK); p.arc(x + r, bK, r, Math.PI, 2 * Math.PI); p.lineTo(x + w, bU); p.closePath();
  }
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
        gg.addColorStop(0, opt.rutschFarbe ? rgbS(opt.rutschFarbe, 0.4) : "rgba(150,80,60,0.28)"); gg.addColorStop(1, opt.rutschFarbe ? rgbS(opt.rutschFarbe, 0) : "rgba(150,80,60,0)");
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
  function kisteFl(liste, x0, y0, z0, x1, y1, z1, farbe, opt) {
    const f = (pts, n) => liste.push(Object.assign({ pts: pts, n: n, farbe: farbe }, opt || {}));
    f([[x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0]], [0, 1, 0]);
    f([[x1, y0, z1], [x0, y0, z1], [x0, y0, z0], [x1, y0, z0]], [0, -1, 0]);
    f([[x1, y1, z1], [x1, y0, z1], [x1, y0, z0], [x1, y1, z0]], [1, 0, 0]);
    f([[x0, y0, z1], [x0, y1, z1], [x0, y1, z0], [x0, y0, z0]], [-1, 0, 0]);
    f([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], [0, 0, 1]);
  }
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
  function bodenMaler(g, F, I) {
    const x0 = I.A0, y0 = I.B0;
    g.fillStyle = "rgb(164,160,152)"; g.fillRect(x0, y0, F.w, F.h);
    rausch(g, x0, y0, F.w, F.h, 1.5, 0.22, 23, 3);
    if (I.W.winter) { g.fillStyle = "rgba(240,244,251,0.8)"; g.fillRect(x0, y0, F.w, F.h); }
  }
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
  function fassTeile(C, ax, L, R0, R1, holz, opt) {
    opt = opt || {};
    ax = nrm(ax);
    const e1 = nrm(kreuz(ax, Math.abs(ax[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0])), e2 = kreuz(ax, e1);
    const NS = opt.ns || 6, NA = opt.na || 16;
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
          if (opt.deckel) opt.deckel(g, R0, K.lf(n), n, K);
          g.restore();
        }
      }
    };
  }
  const sub3 = (a, b) => [a[0] - b[0], a[1] - b[1]];

  /* =====================================================================
     SANDSTEIN: Quaderwand, Bossensockel, Pilaster, Gebälk
     ===================================================================== */
  function quaderWand(g, F, I, x0, y0, x1, y1, saat) {
    sandstein(g, F, I, x0, y0, x1, y1, saat, { farbe: STEIN, lage: 0.44, block: 1.15 });
    if (F.px > 6) {
      /* Patina des Steins: unten dunkler, unter dem Gesims Regenschatten */
      const gr = g.createLinearGradient(0, y0, 0, y0 + 1.6);
      gr.addColorStop(0, "rgba(60,54,44,0.2)"); gr.addColorStop(1, "rgba(60,54,44,0)");
      g.fillStyle = gr; g.fillRect(x0, y0, x1 - x0, 1.6);
      bleich(g, x0, y0, x1 - x0, y1 - y0, 3.0, 0.07, saat + 5);
    }
  }
  /* Rustizierter Sockel: Bossenquader mit tiefen, schrägen Fugen */
  function rustika(g, F, I, x0, x1, zT, saat, z0) {
    z0 = z0 || 0;
    const c = hellF(STEIN, -0.07), px = F.px, lage = 0.3, f = 0.035;
    g.fillStyle = rgbS(hellF(c, -0.4)); g.fillRect(x0, -zT, x1 - x0, zT - z0 + 0.02);
    const sv = F.schatten ? F.schatten(0.04) : null;
    for (let r = 0; r * lage < zT - z0 - 0.01; r++) {
      const za = z0 + r * lage, zb = Math.min(zT, za + lage);
      const bl = 0.95, off = (r % 2) * bl / 2 + hash(r, saat, 3) * 0.1;
      for (let x = Math.floor((x0 - off) / bl) * bl + off; x < x1; x += bl) {
        const a = Math.max(x0, x + f / 2), b = Math.min(x1, x + bl - f / 2);
        if (b - a < 0.05) continue;
        const ya = -zb + f / 2, yb = -za - f / 2, cc = hellF(c, (hash(Math.round(x * 3), r, saat) - 0.5) * 0.08);
        g.fillStyle = rgbS(cc); g.fillRect(a, ya, b - a, yb - ya);
        if (px * f > 0.8) {
          /* Fasen: oben/links hell, unten/rechts dunkel (je nach Licht) */
          const hell = sv ? 0.22 : 0.1, dunkel = sv ? 0.34 : 0.2, fb = Math.min(0.03, (yb - ya) * 0.2);
          g.fillStyle = "rgba(255,248,230," + hell + ")"; g.fillRect(a, ya, b - a, fb);
          g.fillStyle = "rgba(40,30,20," + dunkel + ")"; g.fillRect(a, yb - fb, b - a, fb);
          g.fillStyle = sv && sv[0] > 0 ? "rgba(40,30,20," + dunkel * 0.8 + ")" : "rgba(255,248,230," + hell * 0.8 + ")"; g.fillRect(b - fb, ya, fb, yb - ya);
          g.fillStyle = sv && sv[0] > 0 ? "rgba(255,248,230," + hell * 0.8 + ")" : "rgba(40,30,20," + dunkel * 0.8 + ")"; g.fillRect(a, ya, fb, yb - ya);
        }
      }
    }
    rausch(g, x0, -zT, x1 - x0, zT - z0, 1.4, 0.24, saat + 3, 4);
    if (px > 22) rausch(g, x0, -zT, x1 - x0, zT - z0, 0.3, 0.18, saat + 8, 3);
    const gs = g.createLinearGradient(0, -z0, 0, -z0 - 0.5);
    gs.addColorStop(0, I.W.winter ? "rgba(60,58,62,0.28)" : "rgba(70,80,52,0.3)"); gs.addColorStop(1, "rgba(70,70,60,0)");
    g.fillStyle = gs; g.fillRect(x0, -z0 - 0.5, x1 - x0, 0.5);
  }
  /* waagrechtes Profil (Sockelgesims, Kämpfer) als gemaltes Band */
  function profil(g, F, I, x0, x1, z, h, vor) {
    const c = hellF(STEIN, 0.06), y = -z;
    const sv = F.schatten ? F.schatten(vor || 0.08) : null;
    if (sv && sv[1] > 0) { g.fillStyle = "rgba(40,30,24,0.32)"; g.beginPath(); g.moveTo(x0, y + h); g.lineTo(x1, y + h); g.lineTo(x1 + sv[0], y + h + sv[1]); g.lineTo(x0 + sv[0], y + h + sv[1]); g.closePath(); g.fill(); }
    else { const gr = g.createLinearGradient(0, y + h, 0, y + h + 0.16); gr.addColorStop(0, "rgba(30,24,20,0.26)"); gr.addColorStop(1, "rgba(30,24,20,0)"); g.fillStyle = gr; g.fillRect(x0, y + h, x1 - x0, 0.16); }
    g.fillStyle = rgbS(hellF(c, 0.16)); g.fillRect(x0, y, x1 - x0, h * 0.3);
    g.fillStyle = rgbS(c); g.fillRect(x0, y + h * 0.3, x1 - x0, h * 0.4);
    g.fillStyle = rgbS(hellF(c, -0.25)); g.fillRect(x0, y + h * 0.7, x1 - x0, h * 0.3);
    if (I.W.winter) { g.fillStyle = rgbS(SCHNEE); schneeKante(g, x0, x1, y, 0.05, (z * 17) | 0); }
  }
  /* Pilaster: flach vorstehend, mit Basis und dorischem Kapitell */
  function pilaster(g, F, I, a0, a1, zB, zT) {
    const c = hellF(STEIN, 0.05), px = F.px;
    const sv = F.schatten ? F.schatten(0.09) : null;
    if (sv) { g.fillStyle = "rgba(40,30,24,0.3)"; if (sv[0] > 0) g.fillRect(a1, -zT, sv[0], zT - zB); else g.fillRect(a0 + sv[0], -zT, -sv[0], zT - zB); }
    g.fillStyle = rgbS(c); g.fillRect(a0, -zT, a1 - a0, zT - zB);
    sandstein(g, F, I, a0, -zT, a1, -zB, 91, { farbe: c, lage: 0.44, block: 2.0 });
    const tv = tief(I, -0.09);
    g.fillStyle = "rgba(40,30,24,0.32)";
    if (tv[0] > 0.003) g.fillRect(a1, -zT, Math.min(0.09, tv[0]), zT - zB); else if (tv[0] < -0.003) g.fillRect(a0 + Math.max(-0.09, tv[0]), -zT, Math.min(0.09, -tv[0]), zT - zB);
    /* Basis und Kapitell */
    const b = 0.06;
    for (const [z, h] of [[zB + 0.22, 0.22], [zT, 0.3]]) {
      g.fillStyle = rgbS(hellF(c, 0.12)); g.fillRect(a0 - b, -z, a1 - a0 + 2 * b, h * 0.35);
      g.fillStyle = rgbS(hellF(c, -0.05)); g.fillRect(a0 - b * 0.6, -z + h * 0.35, a1 - a0 + 1.2 * b, h * 0.3);
      g.fillStyle = "rgba(40,30,24,0.35)"; g.fillRect(a0 - b * 0.6, -z + h * 0.62, a1 - a0 + 1.2 * b, h * 0.08);
      g.fillStyle = rgbS(hellF(c, 0.06)); g.fillRect(a0 - b * 0.3, -z + h * 0.7, a1 - a0 + 0.6 * b, h * 0.3);
    }
    if (px > 30) { g.strokeStyle = "rgba(60,46,34,0.18)"; g.lineWidth = Math.max(0.005, 0.6 / px); for (let x = a0 + 0.08; x < a1 - 0.04; x += 0.1) { g.beginPath(); g.moveTo(x, -zT + 0.32); g.lineTo(x, -zB - 0.25); g.stroke(); } }
    if (I.W.winter) { g.fillStyle = rgbS(SCHNEE); schneeKante(g, a0 - b, a1 + b, -zT, 0.04, 5); }
  }
  /* Gebälk: Architrav mit zwei Faszien, glatter Fries; auf Wunsch Lettern */
  function gebaelk(g, F, I, x0, x1, opt) {
    opt = opt || {};
    const c = hellF(STEIN, 0.04), px = F.px, zA = HB.zA, zF = HB.zF, zG = HB.zG;
    sandstein(g, F, I, x0, -zG, x1, -zA, 71, { farbe: c, lage: 0.35, block: 1.6 });
    /* Faszien des Architravs */
    g.fillStyle = rgbS(hellF(c, -0.04)); g.fillRect(x0, -(zA + 0.15), x1 - x0, 0.15);
    g.fillStyle = "rgba(40,30,24,0.28)"; g.fillRect(x0, -(zA + 0.15), x1 - x0, 0.015);
    g.fillStyle = rgbS(hellF(c, 0.05)); g.fillRect(x0, -(zF - 0.06), x1 - x0, 0.14);
    g.fillStyle = "rgba(40,30,24,0.28)"; g.fillRect(x0, -(zF - 0.06) + 0.14, x1 - x0, 0.012);
    /* Kymation-Leiste zwischen Architrav und Fries */
    g.fillStyle = rgbS(hellF(c, 0.16)); g.fillRect(x0, -zF - 0.01, x1 - x0, 0.06);
    if (px > 26) { g.fillStyle = "rgba(60,44,30,0.35)"; for (let x = Math.ceil(x0 / 0.08) * 0.08; x < x1; x += 0.08) { g.beginPath(); g.ellipse(x, -zF + 0.02, 0.022, 0.024, 0, 0, 2 * Math.PI); g.fill(); } }
    g.fillStyle = "rgba(40,30,24,0.3)"; g.fillRect(x0, -zF + 0.05, x1 - x0, 0.012);
    if (opt.jahr != null && px > 16 && I.W.Z.schrift) {
      g.save(); g.fillStyle = "rgba(92,72,48,0.8)"; g.font = "0.1px Georgia, 'Times New Roman', serif"; g.textAlign = "center"; g.textBaseline = "middle";
      g.fillText("MDCCCXL", opt.jahr, -(zA + 0.23)); g.restore();
    }
    if (opt.schrift != null) schrift(g, F, I, opt.schrift, (zF + zG) / 2);
    /* Schatten des Kranzgesimses auf dem Fries */
    const gr = g.createLinearGradient(0, -zG, 0, -zG + 0.3); gr.addColorStop(0, "rgba(30,24,30,0.3)"); gr.addColorStop(1, "rgba(30,24,30,0)");
    g.fillStyle = gr; g.fillRect(x0, -zG, x1 - x0, 0.3);
  }
  /* Bronzelettern im Fries, mit feinem Schlagschatten */
  function schrift(g, F, I, xm, zm) {
    if (!I.W.Z.schrift) return;
    const px = F.px, h = 0.36;
    if (px * h < 4) { g.fillStyle = "rgba(90,70,40,0.55)"; g.fillRect(xm - 2.2, -zm - h * 0.3, 4.4, h * 0.6); return; }
    const txt = "BIBLIOTHEK";
    g.save();
    g.font = h.toFixed(3) + "px Georgia, 'Times New Roman', serif";
    g.textAlign = "left"; g.textBaseline = "middle";
    /* gesperrt: jeden Buchstaben einzeln setzen, Gesamtbreite 4,6 m */
    const breiten = [...txt].map((ch) => g.measureText(ch).width), summe = breiten.reduce((a, b) => a + b, 0);
    const soll = 4.6, sperr = (soll - summe) / (txt.length - 1);
    const sv = F.schatten ? F.schatten(0.03) : [0.01, 0.014];
    for (const [dx, dy, farbe] of [[sv ? sv[0] : 0.01, sv ? sv[1] : 0.014, "rgba(30,20,14,0.6)"], [0, 0, null]]) {
      let x = xm - soll / 2;
      for (let i = 0; i < txt.length; i++) {
        if (farbe) g.fillStyle = farbe;
        else {
          const gr = g.createLinearGradient(0, -zm - h / 2, 0, -zm + h / 2);
          gr.addColorStop(0, rgbS(hellF(BRONZE, 0.2))); gr.addColorStop(0.45, rgbS(hellF(BRONZE, -0.25))); gr.addColorStop(1, rgbS(hellF(BRONZE, -0.55)));
          g.fillStyle = gr;
        }
        g.fillText(txt[i], x + dx, -zm + dy);
        x += breiten[i] + sperr;
      }
    }
    g.restore();
  }

  /* =====================================================================
     BÜCHERWAND (Kachel) UND LESESAAL HINTER DEM GLAS
     ===================================================================== */
  const RKACH = new Map();
  const BUCH = [[122, 40, 34], [74, 42, 30], [46, 70, 52], [40, 54, 84], [150, 112, 62], [98, 70, 46], [136, 124, 100], [66, 30, 42], [168, 148, 112], [104, 36, 30], [58, 82, 72], [126, 84, 40]];
  function regalKachel(pt, nacht) {
    const schl = pt + "|" + (nacht ? 1 : 0);
    let K = RKACH.get(schl);
    if (K) return K;
    const Wt = 2.0, rh = 0.36, NR = 6, Ht = NR * rh, fc = nacht ? NACHTF : TAGF;
    const cw = Math.max(2, Math.round(Wt * pt)), ch = Math.max(2, Math.round(Ht * pt));
    const cv = document.createElement("canvas"); cv.width = cw; cv.height = ch;
    const g = cv.getContext("2d"); g.scale(cw / Wt, ch / Ht);
    g.fillStyle = rgbS(fc([40, 28, 22])); g.fillRect(0, 0, Wt, Ht);
    const eimer = BUCH.map(() => new Path2D()), gold = new Path2D();
    for (let r = 0; r < NR; r++) {
      const yb = (r + 1) * rh - 0.035;       // Oberkante des Bodens darunter
      let x = 0.02, i = 0;
      while (x < Wt - 0.02) {
        const bw = 0.025 + 0.045 * hash(i, r, 3), bh = 0.2 + 0.11 * hash(i, r, 4);
        if (x + bw > Wt - 0.02) break;
        if (hash(i, r, 9) < 0.04) { x += 0.06; i++; continue; }        // Lücke
        const k = (hash(i, r, 5) * BUCH.length) | 0;
        const schraeg = hash(i, r, 11) < 0.05;
        if (schraeg) { eimer[k].moveTo(x, yb); eimer[k].lineTo(x + bw, yb); eimer[k].lineTo(x + bw + bh * 0.3, yb - bh * 0.95); eimer[k].lineTo(x + bh * 0.3, yb - bh * 0.95); eimer[k].closePath(); x += bw + bh * 0.3; }
        else {
          eimer[k].rect(x, yb - bh, bw - 0.003, bh);
          if (hash(i, r, 7) < 0.6) { gold.rect(x + 0.004, yb - bh + 0.03, bw - 0.011, 0.006); gold.rect(x + 0.004, yb - bh * 0.35, bw - 0.011, 0.005); }
          x += bw;
        }
        i++;
      }
      /* Regalboden */
      g.fillStyle = rgbS(fc([96, 64, 40])); g.fillRect(0, yb, Wt, 0.035);
      g.fillStyle = rgbS(fc([130, 92, 58])); g.fillRect(0, yb, Wt, 0.008);
    }
    BUCH.forEach((c, i) => { g.fillStyle = rgbS(fc(c)); g.fill(eimer[i]); });
    if (pt > 40) { g.fillStyle = rgbS(fc([196, 160, 80])); g.fill(gold); }
    /* Schatten unter jedem Boden, senkrechte Wangen */
    for (let r = 0; r < NR; r++) { const gr = g.createLinearGradient(0, r * rh, 0, r * rh + 0.12); gr.addColorStop(0, "rgba(10,6,4,0.55)"); gr.addColorStop(1, "rgba(10,6,4,0)"); g.fillStyle = gr; g.fillRect(0, r * rh, Wt, 0.12); }
    g.fillStyle = rgbS(fc([84, 56, 36])); g.fillRect(0, 0, 0.05, Ht); g.fillRect(Wt / 2, 0, 0.05, Ht);
    K = { bild: cv, cw: cw, ch: ch, Wt: Wt, Ht: Ht };
    if (RKACH.size > 16) RKACH.clear();
    RKACH.set(schl, K);
    return K;
  }
  function lesesaal(g, F, I, x, bS, w, bU, nacht) {
    const fc = nacht ? NACHTF : TAGF, px = F.px;
    /* Bücherwand (2,2 m hinter dem Glas) */
    const tv = tief(I, 2.2);
    g.save(); g.translate(tv[0], tv[1]);
    const x0 = x - 7, x1 = x + w + 7, y0 = bS - 7, y1 = bU + 5;
    if (px * 0.36 > 3) {
      const K = regalKachel(Math.min(160, aufloesung(F)), nacht);
      const mu = g.createPattern(K.bild, "repeat");
      mu.setTransform(new DOMMatrix([K.Wt / K.cw, 0, 0, K.Ht / K.ch, (I.K.name.length * 0.37) % 2, -HB.zS]));
      g.fillStyle = mu; g.fillRect(x0, y0, x1 - x0, y1 - y0);
    } else { g.fillStyle = rgbS(fc([82, 52, 40])); g.fillRect(x0, y0, x1 - x0, y1 - y0); }
    /* Decke im Halbdunkel */
    const gd = g.createLinearGradient(0, -7.0, 0, -4.8); gd.addColorStop(0, nacht ? "rgba(60,30,10,0.55)" : "rgba(14,12,12,0.7)"); gd.addColorStop(1, "rgba(14,12,12,0)");
    g.fillStyle = gd; g.fillRect(x0, -7.2, x1 - x0, 2.4);
    g.restore();
    /* Galerie mit Brüstung (1,0 m hinter dem Glas) */
    const tg = tief(I, 1.0);
    g.save(); g.translate(tg[0], tg[1]);
    const zG = 4.3;
    const ga = x - 4, gb = x + w + 4;
    g.fillStyle = rgbS(fc([70, 46, 30])); g.fillRect(ga, -(zG + 0.2), gb - ga, 0.24);
    g.fillStyle = rgbS(fc([120, 84, 52])); g.fillRect(ga, -(zG + 0.22), gb - ga, 0.04);
    g.fillStyle = rgbS(fc([92, 62, 38]));
    g.fillRect(ga, -(zG + 1.05), gb - ga, 0.06);
    if (px > 14) for (let xx = Math.floor(ga / 0.14) * 0.14; xx < gb; xx += 0.14) g.fillRect(xx, -(zG + 1.0), 0.03, 0.78);
    g.restore();
    if (nacht) {
      /* warmes Licht der Leselampen */
      const gl = g.createRadialGradient(x + w / 2, bU - 0.6, 0.05, x + w / 2, bU - 1.2, Math.max(w, bU - bS));
      gl.addColorStop(0, "rgba(255,214,150,0.35)"); gl.addColorStop(1, "rgba(255,170,90,0)");
      g.fillStyle = gl; g.fillRect(x - 0.5, bS - 0.5, w + 1, bU - bS + 1);
    }
  }
  /* Fensterrahmen aus Holz: zwei Flügel, Kämpfer, Sprossen, Fächer im Bogen */
  function rahmenBib(g, F, x, bK, w, bU, farbe) {
    const r = w / 2, cx = x + r, px = F.px, rb = 0.055, sb = Math.max(0.02, 0.9 / px);
    g.fillStyle = farbe;
    const p = new Path2D(); rundPfad(p, x, bK, w, bU); const q = new Path2D(); rundPfad(q, x + rb, bK, w - 2 * rb, bU - rb); p.addPath(q); g.fill(p, "evenodd");
    if (px * w < 5) return;
    g.fillRect(cx - rb * 0.6, bK, rb * 1.2, bU - bK);
    g.fillRect(x, bK - 0.02, w, rb * 1.3);
    const n = 4;
    for (let k = 1; k < n; k++) g.fillRect(x, bK + (bU - bK) * k / n - sb / 2, w, sb);
    for (const s of [-1, 1]) g.fillRect(cx + s * w / 4 - sb / 2, bK, sb, bU - bK);
    g.strokeStyle = farbe; g.lineWidth = sb;
    g.beginPath(); g.arc(cx, bK, r * 0.4, Math.PI, 2 * Math.PI); g.stroke();
    for (let i = 1; i < 4; i++) { const a = Math.PI + Math.PI * i / 4; g.beginPath(); g.moveTo(cx + Math.cos(a) * r * 0.4, bK + Math.sin(a) * r * 0.4); g.lineTo(cx + Math.cos(a) * r, bK + Math.sin(a) * r); g.stroke(); }
  }
  /* Rundbogenfenster mit profiliertem Gewände, Schlussstein, Sohlbank auf Konsolen */
  function fensterBib(g, F, I, op) {
    const w = op.w, x = op.a - w / 2, r = w / 2, bU = -op.z0, bK = -op.zk, cx = op.a, W = I.W, px = F.px;
    const gb = 0.2, c = hellF(STEIN, 0.1);
    /* Schatten des Gewändes auf der Wand */
    const sv = F.schatten ? F.schatten(0.06) : null;
    const gewPfad = (p, dx, dy) => { p.moveTo(x - gb + dx, bU + dy); p.lineTo(x - gb + dx, bK + dy); p.arc(cx + dx, bK + dy, r + gb, Math.PI, 2 * Math.PI); p.lineTo(x + w + gb + dx, bU + dy); p.closePath(); };
    if (sv) { const p = new Path2D(); gewPfad(p, sv[0], sv[1]); g.fillStyle = "rgba(40,30,24,0.3)"; g.fill(p); }
    { const p = new Path2D(); gewPfad(p, 0, 0); g.fillStyle = rgbS(c); g.fill(p); }
    if (px > 10) {
      g.lineWidth = Math.max(0.008, 0.7 / px);
      for (const [d, farbe] of [[0.05, "rgba(60,44,30,0.4)"], [0.1, "rgba(255,248,230,0.35)"], [0.14, "rgba(60,44,30,0.3)"]]) {
        g.strokeStyle = farbe; g.beginPath(); g.moveTo(x - gb + d, bU); g.lineTo(x - gb + d, bK); g.arc(cx, bK, r + gb - d, Math.PI, 2 * Math.PI); g.lineTo(x + w + gb - d, bU); g.stroke();
      }
    }
    /* Kämpferstein */
    g.fillStyle = rgbS(hellF(c, 0.06)); g.fillRect(x - gb - 0.04, bK - 0.02, gb + 0.04, 0.1); g.fillRect(x + w, bK - 0.02, gb + 0.04, 0.1);
    /* Öffnung */
    g.save();
    const p = new Path2D(); rundPfad(p, x, bK, w, bU); g.clip(p);
    g.fillStyle = rgbS(hellF(STEIN, -0.28)); g.fillRect(x - 0.1, bK - r - 0.1, w + 0.2, bU - bK + r + 0.2);
    if (!W.Z.fenster(op.nr || 0)) { g.fillStyle = "rgba(34,30,30,0.92)"; const t0 = tief(I, 0.5); g.save(); g.translate(t0[0], t0[1]); g.fill(p); g.restore(); }
    else {
      const tg = tief(I, 0.22);
      g.save(); g.translate(tg[0], tg[1]); g.clip(p);
      lesesaal(g, F, I, x, bK - r, w, bU, false);
      glasTag(g, F, x, bK - r, w, bU, op.nr || 1);
      rahmenBib(g, F, x, bK, w, bU, "rgb(236,230,214)");
      g.restore();
    }
    const s2 = F.schatten ? F.schatten(0.5) : null;
    if (s2) { const q = new Path2D(); q.rect(x - 2, bK - r - 2, w + 4, bU - bK + r + 4); const s3 = new Path2D(); rundPfad(s3, x + s2[0], bK + s2[1], w, bU + s2[1] + 1); q.addPath(s3); g.fillStyle = "rgba(14,12,26,0.42)"; g.fill(q, "evenodd"); }
    else { g.fillStyle = "rgba(14,12,26,0.2)"; g.fillRect(x, bK - r, w, 0.4); }
    g.restore();
    /* Schlussstein */
    const ks = (dx, dy, farbe) => { g.fillStyle = farbe; g.beginPath(); g.moveTo(cx - 0.13 + dx, bK - r - gb - 0.1 + dy); g.lineTo(cx + 0.13 + dx, bK - r - gb - 0.1 + dy); g.lineTo(cx + 0.09 + dx, bK - r + 0.06 + dy); g.lineTo(cx - 0.09 + dx, bK - r + 0.06 + dy); g.closePath(); g.fill(); };
    const sk = F.schatten ? F.schatten(0.1) : null;
    if (sk) ks(sk[0], sk[1], "rgba(40,30,24,0.35)");
    ks(0, 0, rgbS(hellF(c, 0.1)));
    if (px > 20) { g.strokeStyle = "rgba(60,44,30,0.4)"; g.lineWidth = Math.max(0.006, 0.6 / px); g.beginPath(); g.moveTo(cx - 0.06, bK - r - gb - 0.02); g.lineTo(cx - 0.05, bK - r); g.moveTo(cx + 0.06, bK - r - gb - 0.02); g.lineTo(cx + 0.05, bK - r); g.stroke(); }
    if (W.winter) { g.fillStyle = rgbS(SCHNEE); schneeKante(g, cx - 0.14, cx + 0.14, bK - r - gb - 0.1, 0.05, 3); }
    /* Sohlbank auf zwei Konsolen */
    const sb = w + 2 * gb + 0.12, sx = x - gb - 0.06, sh = 0.12;
    const s4 = F.schatten ? F.schatten(0.12) : null;
    for (const kx of [sx + 0.12, sx + sb - 0.26]) {
      if (s4) { g.fillStyle = "rgba(40,30,24,0.3)"; g.fillRect(kx + s4[0], bU + sh + s4[1], 0.14, 0.2); }
      g.fillStyle = rgbS(hellF(c, -0.04)); g.beginPath(); g.moveTo(kx, bU + sh); g.lineTo(kx + 0.14, bU + sh); g.lineTo(kx + 0.12, bU + sh + 0.22); g.quadraticCurveTo(kx + 0.07, bU + sh + 0.26, kx + 0.02, bU + sh + 0.22); g.closePath(); g.fill();
    }
    if (s4) { g.fillStyle = "rgba(40,30,24,0.3)"; g.fillRect(sx + s4[0], bU + sh, sb, Math.max(0.02, s4[1])); }
    g.fillStyle = rgbS(hellF(c, 0.16)); g.fillRect(sx, bU - 0.01, sb, 0.04);
    g.fillStyle = rgbS(c); g.fillRect(sx, bU + 0.03, sb, sh - 0.05);
    g.fillStyle = rgbS(hellF(c, -0.28)); g.fillRect(sx, bU + sh - 0.02, sb, 0.02);
    if (W.winter) { g.fillStyle = rgbS(SCHNEE); schneeKante(g, sx, sx + sb, bU - 0.01, 0.07, (op.a * 13) | 0); }
  }
  function fensterBibNacht(g, F, I, op) {
    const an = op.licht || 0;
    if (an <= 0 || F.nacht < 0.02 || !I.W.Z.licht) return;
    const w = op.w, x = op.a - w / 2, r = w / 2, bU = -op.z0, bK = -op.zk;
    const p = new Path2D(); rundPfad(p, x, bK, w, bU);
    g.save(); g.clip(p);
    const tg = tief(I, 0.22); g.translate(tg[0], tg[1]); g.clip(p);
    g.globalAlpha = klemm(F.nacht * an, 0, 1);
    lesesaal(g, F, I, x, bK - r, w, bU, true);
    rahmenBib(g, F, x, bK, w, bU, "rgb(70,52,36)");
    g.restore();
    lp(F, I, op.a, bU - (bU - bK + r) * 0.45, Math.max(w, 1.2) * 1.3, "255,196,120", 0.5 * an);
  }
  /* Kellerfenster im Sockel: Eisengitter */
  function kellerfenster(g, F, I, a) {
    const w = 0.7, h = 0.38, x = a - w / 2, y = -0.72;
    g.fillStyle = rgbS(hellF(STEIN, -0.35)); g.fillRect(x - 0.02, y - 0.02, w + 0.04, h + 0.04);
    g.fillStyle = "rgb(30,30,34)"; g.fillRect(x + 0.03, y + 0.03, w - 0.06, h - 0.06);
    glasTag(g, F, x + 0.03, y + 0.03, w - 0.06, y + h - 0.03, (a * 7) | 0);
    if (F.px > 8) { g.fillStyle = "rgb(36,36,38)"; for (let i = 1; i < 6; i++) g.fillRect(x + w * i / 6 - 0.012, y, 0.024, h); g.fillRect(x, y + h * 0.5 - 0.01, w, 0.02); }
    if (I.W.winter) { g.fillStyle = rgbS(SCHNEE); g.fillRect(x - 0.02, y + h - 0.04, w + 0.04, 0.06); }
  }
  /* Das Portal: Rechtecktür mit Ohrengewände, Oberlicht, Verdachung auf Konsolen */
  function portal(g, F, I, op) {
    const w = op.w, x = op.a - w / 2, bU = -op.z0, bT = -(op.z0 + op.h), bO = bT - 0.62, W = I.W, px = F.px, c = hellF(STEIN, 0.1);
    const gb = 0.24;
    const sv = F.schatten ? F.schatten(0.07) : null;
    const gew = (dx, dy, farbe) => { g.fillStyle = farbe; g.beginPath(); g.moveTo(x - gb + dx, bU + dy); g.lineTo(x - gb + dx, bO - gb + 0.1 + dy); g.lineTo(x - gb - 0.1 + dx, bO - gb + 0.1 + dy); g.lineTo(x - gb - 0.1 + dx, bO - gb + dy); g.lineTo(x + w + gb + 0.1 + dx, bO - gb + dy); g.lineTo(x + w + gb + 0.1 + dx, bO - gb + 0.1 + dy); g.lineTo(x + w + gb + dx, bO - gb + 0.1 + dy); g.lineTo(x + w + gb + dx, bU + dy); g.closePath(); g.fill(); };
    if (sv) gew(sv[0], sv[1], "rgba(40,30,24,0.3)");
    gew(0, 0, rgbS(c));
    if (px > 10) { g.strokeStyle = "rgba(60,44,30,0.4)"; g.lineWidth = Math.max(0.008, 0.7 / px); g.strokeRect(x - gb + 0.06, bO - gb + 0.06, w + 2 * gb - 0.12, bU - bO + gb); g.strokeStyle = "rgba(255,248,230,0.35)"; g.strokeRect(x - gb + 0.11, bO - gb + 0.11, w + 2 * gb - 0.22, bU - bO + gb); }
    /* Verdachung mit Konsolen */
    const vz = bO - gb - 0.02;
    const sv2 = F.schatten ? F.schatten(0.22) : null;
    if (sv2) { g.fillStyle = "rgba(40,30,24,0.33)"; g.fillRect(x - gb - 0.25 + sv2[0], vz - 0.22 + sv2[1], w + 2 * gb + 0.5, 0.22); }
    for (const kx of [x - gb - 0.16, x + w + gb + 0.02]) { g.fillStyle = rgbS(hellF(c, -0.04)); g.beginPath(); g.moveTo(kx, vz); g.lineTo(kx + 0.14, vz); g.lineTo(kx + 0.12, vz + 0.42); g.quadraticCurveTo(kx + 0.07, vz + 0.48, kx + 0.02, vz + 0.42); g.closePath(); g.fill(); }
    g.fillStyle = rgbS(hellF(c, 0.18)); g.fillRect(x - gb - 0.25, vz - 0.22, w + 2 * gb + 0.5, 0.06);
    g.fillStyle = rgbS(c); g.fillRect(x - gb - 0.25, vz - 0.16, w + 2 * gb + 0.5, 0.1);
    g.fillStyle = rgbS(hellF(c, -0.3)); g.fillRect(x - gb - 0.25, vz - 0.06, w + 2 * gb + 0.5, 0.05);
    if (W.winter) { g.fillStyle = rgbS(SCHNEE); schneeKante(g, x - gb - 0.25, x + w + gb + 0.25, vz - 0.22, 0.07, 9); }
    /* Öffnung: Oberlicht und Tür */
    g.save(); g.beginPath(); g.rect(x, bO, w, bU - bO); g.clip();
    g.fillStyle = rgbS(hellF(STEIN, -0.3)); g.fillRect(x, bO, w, bU - bO);
    const tv = tief(I, 0.3); g.translate(tv[0], tv[1]);
    g.beginPath(); g.rect(x, bO, w, bU - bO); g.clip();
    if (!W.Z.tuer) { g.fillStyle = "rgb(30,26,26)"; g.fillRect(x - 0.5, bO - 0.5, w + 1, bU - bO + 1); }
    else {
      g.fillStyle = "rgb(36,40,46)"; g.fillRect(x, bO, w, 0.62);
      glasTag(g, F, x, bO, w, bO + 0.62, 21);
      const tc = W.tuerFarbe;
      g.fillStyle = rgbS(hellF(tc, -0.2));
      g.fillRect(x, bO + 0.56, w, 0.08); for (let i = 1; i < 4; i++) g.fillRect(x + w * i / 4 - 0.015, bO, 0.03, 0.6);
      for (const s of [0, 1]) {
        const fx = x + s * w / 2, fw = w / 2;
        g.fillStyle = rgbS(tc); g.fillRect(fx, bT, fw, bU - bT);
        if (px > 8) {
          for (const [ky, kh] of [[0.12, 0.75], [0.97, 1.3], [2.37, 0.7]]) {
            const kx0 = fx + 0.1, kw = fw - 0.2, ya = bT + ky;
            g.fillStyle = rgbS(hellF(tc, -0.35)); g.fillRect(kx0, ya, kw, kh);
            g.fillStyle = rgbS(hellF(tc, 0.12)); g.fillRect(kx0 + 0.03, ya + 0.03, kw - 0.06, kh - 0.06);
            g.fillStyle = rgbS(tc); g.fillRect(kx0 + 0.06, ya + 0.06, kw - 0.12, kh - 0.12);
          }
        }
        g.fillStyle = rgbS(hellF(tc, -0.5)); g.fillRect(fx + (s ? 0 : fw - 0.012), bT, 0.012, bU - bT);
      }
      rausch(g, x, bT, w, bU - bT, 0.9, 0.2, 12, 3);
      g.fillStyle = rgbS(hellF(BRONZE, 0.25)); for (const s of [-1, 1]) { g.beginPath(); g.arc(op.a + s * 0.09, bU - 1.1, 0.035, 0, 2 * Math.PI); g.fill(); }
      if (W.winter && W.Z.deko) kranz(g, F, op.a, bT + 0.75, 0.32);
    }
    g.restore();
    const s2 = F.schatten ? F.schatten(0.3) : null;
    if (s2) { g.save(); g.beginPath(); g.rect(x, bO, w, bU - bO); g.clip(); g.fillStyle = "rgba(14,12,26,0.4)"; g.beginPath(); g.rect(x - 2, bO - 2, w + 4, bU - bO + 4); g.rect(x + s2[0], bO + s2[1], w, bU - bO + 2); g.fill("evenodd"); g.restore(); }
  }
  function portalNacht(g, F, I, op) {
    if (F.nacht < 0.02 || !I.W.Z.licht) return;
    const w = op.w, x = op.a - w / 2, bO = -(op.z0 + op.h) - 0.62;
    g.save(); g.beginPath(); g.rect(x, bO, w, 0.56); g.clip();
    const tv = tief(I, 0.3); g.translate(tv[0], tv[1]);
    g.globalAlpha = F.nacht * 0.9;
    g.fillStyle = "rgb(255,206,140)"; g.fillRect(x, bO, w, 0.56);
    g.fillStyle = "rgb(60,44,32)"; for (let i = 1; i < 4; i++) g.fillRect(x + w * i / 4 - 0.015, bO, 0.03, 0.6);
    g.restore();
    lp(F, I, op.a, bO + 0.3, 1.2, "255,196,120", 0.3);
  }

  /* =====================================================================
     WANDMALER
     ===================================================================== */
  function wandMalerBib(spec) {
    return function (g, F, I) {
      const x0 = I.A0, x1 = I.A0 + F.w, y0 = I.B0, y1 = I.B0 + F.h, zTop = -y0, W = I.W;
      quaderWand(g, F, I, x0, y0, x1, y1, spec.saat);
      rustika(g, F, I, x0, x1, Math.min(zTop, HB.zS), spec.saat);
      if (zTop > HB.zS) profil(g, F, I, x0, x1, HB.zS + 0.02, 0.14, 0.08);
      for (const [a0, a1] of spec.pilaster || []) if (zTop > HB.zS + 0.3) pilaster(g, F, I, a0, a1, HB.zS + 0.14, Math.min(zTop, HB.zA));
      if (zTop >= HB.zA + 0.05) gebaelk(g, F, I, x0, x1, {});
      for (const a of spec.keller || []) kellerfenster(g, F, I, a);
      for (const op of spec.oeff || []) {
        if (op.art === "rund") fensterBib(g, F, I, op);
        else if (op.art === "portal") portal(g, F, I, op);
      }
      if (W.winter && W.Z.bau > 0.3) schneeWehe(g, F, x0, x1, spec.saat);
    };
  }
  function wandNachtBib(spec) {
    return function (g, F, I) {
      if (F.nacht < 0.02) return;
      for (const op of spec.oeff || []) {
        if (op.art === "rund") fensterBibNacht(g, F, I, op);
        else if (op.art === "portal") portalNacht(g, F, I, op);
      }
    };
  }
  function innenMalerBib(spec) {
    return function (g, F, I) {
      const x0 = I.A0, x1 = I.A0 + F.w, y0 = I.B0, y1 = I.B0 + F.h;
      sandstein(g, F, I, x0, y0, x1, y1, 97, { farbe: hellF(STEIN, -0.1), lage: 0.3, block: 0.5 });
      g.fillStyle = "rgba(40,34,30,0.3)"; g.fillRect(x0, y0, x1 - x0, y1 - y0);
      if (!spec) return;
      g.fillStyle = "rgb(40,36,36)";
      for (const op of spec.oeff || []) {
        const a = -op.a;
        g.beginPath();
        if (op.art === "rund") rundPfad(g, a - op.w / 2, -op.zk, op.w, -op.z0);
        else if (op.art === "portal") g.rect(a - op.w / 2, -(op.z0 + op.h + 0.62), op.w, op.h + 0.62);
        g.fill();
      }
    };
  }
  function mauerkroneBib(g, F, I) {
    const x0 = I.A0, y0 = I.B0;
    g.fillStyle = rgbS(hellF(STEIN, -0.05)); g.fillRect(x0, y0, F.w, F.h);
    if (F.px > 8) { g.strokeStyle = "rgba(90,76,60,0.6)"; g.lineWidth = Math.max(0.01, 0.8 / F.px); g.beginPath(); for (let x = Math.ceil(x0 / 1.1) * 1.1; x < x0 + F.w; x += 1.1) { g.moveTo(x, y0); g.lineTo(x, y0 + F.h); } g.stroke(); }
    if (I.W.winter) { g.fillStyle = "rgba(240,244,251,0.8)"; g.fillRect(x0, y0, F.w, F.h); }
  }

  /* =====================================================================
     GESIMSE, PODEST, STUFEN, GIEBEL
     ===================================================================== */
  /* Kranzgesims (Körper 0,35 m): Sima, Hängeplatte, Zahnschnitt */
  function kranzMaler(g, F, I) {
    const x0 = I.A0, x1 = I.A0 + F.w, y0 = I.B0, y1 = I.B0 + F.h, c = hellF(STEIN, 0.08), px = F.px, W = I.W;
    if (I.n[2] > 0.5) {
      /* Abdeckung (Blech) */
      g.fillStyle = rgbS(mischF(W.dachFarbe, [150, 150, 150], 0.3)); g.fillRect(x0, y0, x1 - x0, y1 - y0);
      rausch(g, x0, y0, x1 - x0, y1 - y0, 1.0, 0.25, 7, 3);
      if (W.winter) { g.fillStyle = rgbS(SCHNEE); g.fillRect(x0, y0, x1 - x0, y1 - y0); }
      return;
    }
    const h = y1 - y0;
    g.fillStyle = rgbS(c); g.fillRect(x0, y0, x1 - x0, h);
    g.fillStyle = rgbS(hellF(c, 0.2)); g.fillRect(x0, y0, x1 - x0, h * 0.18);
    g.fillStyle = "rgba(40,30,24,0.25)"; g.fillRect(x0, y0 + h * 0.18, x1 - x0, h * 0.06);
    g.fillStyle = rgbS(hellF(c, 0.08)); g.fillRect(x0, y0 + h * 0.24, x1 - x0, h * 0.36);
    g.fillStyle = "rgba(40,30,24,0.4)"; g.fillRect(x0, y0 + h * 0.6, x1 - x0, h * 0.06);
    /* Zahnschnitt */
    const yz = y0 + h * 0.66, hz = h * 0.3;
    g.fillStyle = "rgba(40,30,24,0.55)"; g.fillRect(x0, yz, x1 - x0, hz);
    if (px * 0.06 > 1.2) { g.fillStyle = rgbS(hellF(c, 0.02)); for (let x = Math.ceil(x0 / 0.11) * 0.11; x < x1; x += 0.11) g.fillRect(x, yz, 0.07, hz * 0.95); }
    else { g.fillStyle = rgbS(hellF(c, -0.1), 0.6); g.fillRect(x0, yz, x1 - x0, hz); }
    rausch(g, x0, y0, x1 - x0, h, 1.2, 0.2, 13, 3);
    if (W.winter) { g.fillStyle = rgbS(SCHNEE); schneeKante(g, x0, x1, y0, 0.06, 21); }
  }
  /* Gebälk des Portikus (Körper): Architrav und Fries, vorn die Lettern */
  function gebaelkMaler(g, F, I) {
    const x0 = I.A0, x1 = I.A0 + F.w;
    if (I.n[2] > 0.5) { g.fillStyle = rgbS(STEIN); g.fillRect(x0, I.B0, F.w, F.h); return; }
    gebaelk(g, F, I, x0, x1, I.n[1] > 0.9 ? { schrift: 0, jahr: 0 } : {});
  }
  /* Podest und Treppenwangen: Bossen, oben Platten */
  function podestMaler(g, F, I) {
    const x0 = I.A0, x1 = I.A0 + F.w, y0 = I.B0, y1 = I.B0 + F.h, W = I.W, px = F.px;
    if (I.n[2] > 0.5) {
      const c = hellF(STEIN, 0.02);
      g.fillStyle = rgbS(hellF(c, -0.3)); g.fillRect(x0, y0, x1 - x0, y1 - y0);
      for (let x = Math.floor(x0 / 0.62) * 0.62; x < x1; x += 0.62) for (let y = Math.floor(y0 / 0.62) * 0.62; y < y1; y += 0.62) { g.fillStyle = rgbS(hellF(c, (hash(Math.round(x * 5), Math.round(y * 5), 3) - 0.5) * 0.12)); g.fillRect(x + 0.008, y + 0.008, 0.604, 0.604); }
      rausch(g, x0, y0, x1 - x0, y1 - y0, 1.5, 0.2, 27, 3);
      if (W.winter) { g.fillStyle = "rgba(240,244,251,0.9)"; g.fillRect(x0, y0, x1 - x0, y1 - y0); g.fillStyle = "rgba(200,210,226,0.5)"; g.fillRect(-0.9, y0, 1.8, y1 - y0); }
      else if (W.o.jahr === "herbst" && px > 6) laub(g, x0, y0, x1, y1, 41);
      return;
    }
    let zT = -y0;
    rustika(g, F, I, x0, x1, zT, 31);
    g.fillStyle = rgbS(hellF(STEIN, 0.15)); g.fillRect(x0, y0, x1 - x0, 0.1);
    g.fillStyle = "rgba(40,30,24,0.3)"; g.fillRect(x0, y0 + 0.1, x1 - x0, 0.02);
    if (W.winter) { g.fillStyle = rgbS(SCHNEE); schneeKante(g, x0, x1, y0, 0.05, 31); }
  }
  function laub(g, x0, y0, x1, y1, saat) {
    const rng = zuf(saat);
    for (let i = 0; i < Math.min(300, (x1 - x0) * (y1 - y0) * 14); i++) {
      g.fillStyle = rgbS([[196, 60, 34], [214, 124, 40], [168, 40, 40], [190, 150, 60]][(rng() * 4) | 0]);
      g.beginPath(); g.ellipse(x0 + rng() * (x1 - x0), y0 + rng() * (y1 - y0), 0.05, 0.03, rng() * 3, 0, 2 * Math.PI); g.fill();
    }
  }
  function stufeMalerBib(g, F, I) {
    const x0 = I.A0, x1 = I.A0 + F.w, y0 = I.B0, y1 = I.B0 + F.h, c = STEIN, W = I.W;
    g.fillStyle = rgbS(c); g.fillRect(x0, y0, x1 - x0, y1 - y0);
    if (F.px > 10) { g.fillStyle = rgbS(hellF(c, -0.35), 0.6); for (let x = Math.ceil(x0 / 1.16) * 1.16; x < x1; x += 1.16) g.fillRect(x, y0, Math.max(0.01, 0.7 / F.px), y1 - y0); }
    rausch(g, x0, y0, x1 - x0, y1 - y0, 1.0, 0.26, 41, 3);
    if (I.n[2] > 0.5) {
      g.fillStyle = "rgba(255,248,230,0.25)"; g.fillRect(x0, y1 - 0.04, x1 - x0, 0.04);
      if (W.winter) {
        g.fillStyle = rgbS(SCHNEE); g.fillRect(x0, y0, 1.35, y1 - y0); g.fillRect(x1 - 1.35, y0, 1.35, y1 - y0);
        g.fillStyle = "rgba(236,240,248,0.5)"; g.fillRect(x0 + 1.35, y0, x1 - x0 - 2.7, y1 - y0);
      } else if (W.o.jahr === "herbst" && F.px > 6) laub(g, x0, y0, x1, y1, 43 + ((y0 * 7) | 0));
    } else {
      g.fillStyle = "rgba(40,30,24,0.22)"; g.fillRect(x0, y1 - 0.03, x1 - x0, 0.03);
      if (W.winter) { g.fillStyle = rgbS(SCHNEE); g.fillRect(x0, y0 - 0.01, 1.35, 0.035); g.fillRect(x1 - 1.35, y0 - 0.01, 1.35, 0.035); }
    }
  }
  /* Giebelfeld (Tympanon) vorn: Geison, Schräggesimse, Relief */
  function giebelMaler(vorn) {
    return function (g, F, I) {
      const x0 = I.A0, x1 = I.A0 + F.w, y0 = I.B0, y1 = I.B0 + F.h, W = I.W, px = F.px, c = hellF(STEIN, 0.06);
      quaderWand(g, F, I, x0, y0, x1, y1, 61);
      if (!vorn) return;
      /* vertieftes Feld etwas dunkler */
      const zT = HB.zT, zS = PO.zSp, xa = PO.x0, xb = PO.x1, bnd = 0.22;
      const feld = () => { g.beginPath(); g.moveTo(xa + 0.5, -(zT + 0.14)); g.lineTo(xb - 0.5, -(zT + 0.14)); g.lineTo(0, -(zS - bnd - 0.06)); g.closePath(); };
      g.fillStyle = "rgba(60,50,40,0.12)"; feld(); g.fill();
      /* Geison unten */
      g.fillStyle = rgbS(hellF(c, 0.16)); g.fillRect(xa, -(zT + 0.14), xb - xa, 0.05);
      g.fillStyle = rgbS(c); g.fillRect(xa, -(zT + 0.09), xb - xa, 0.09);
      /* Schräggesimse mit Zahnschnitt */
      const k = PO.neig;
      for (const s of [-1, 1]) {
        const xe = s > 0 ? xb : xa;
        g.fillStyle = rgbS(c); g.beginPath(); g.moveTo(xe, -zT); g.lineTo(0, -zS); g.lineTo(0, -zS + bnd / Math.cos(Math.atan(k))); g.lineTo(xe - s * bnd * 1.5, -zT - 0.02); g.closePath(); g.fill();
        if (px > 12) {
          g.save(); g.beginPath(); g.moveTo(xe, -zT); g.lineTo(0, -zS); g.lineTo(0, -zS + bnd * 1.2); g.lineTo(xe - s * bnd * 2.4, -zT); g.closePath(); g.clip();
          g.fillStyle = "rgba(40,30,24,0.4)";
          for (let t = 0.1; t < Math.abs(xe); t += 0.11) { const xx = xe - s * t, zz = zT + t * k; g.fillRect(xx - 0.03, -zz + 0.13, 0.04, 0.07); }
          g.restore();
        }
      }
      /* Schatten der Schräggesimse ins Feld */
      g.save(); feld(); g.clip();
      const gr = g.createLinearGradient(0, -zS, 0, -zT); gr.addColorStop(0, "rgba(30,24,20,0.3)"); gr.addColorStop(0.4, "rgba(30,24,20,0)"); g.fillStyle = gr; g.fillRect(xa, -zS, xb - xa, zS - zT);
      g.restore();
      if (W.Z.relief) relief(g, F, I, zT + 0.16);
    };
  }
  /* Relief: Eule der Minerva auf Büchern zwischen Lorbeerzweigen */
  function relief(g, F, I, zB) {
    const px = F.px, c = hellF(STEIN, 0.14);
    if (px < 5) return;
    const sv = F.schatten ? F.schatten(0.05) : [0.015, 0.02];
    const y = (z) => -(zB + z);
    const formen = (p) => {
      /* Bücherstapel */
      p.rect(-0.36, y(0.12), 0.72, 0.12); p.rect(-0.3, y(0.23), 0.6, 0.11);
      /* Eule: Körper, Kopf mit Federohren */
      p.moveTo(0.2, y(0.28)); p.ellipse(0, y(0.44), 0.19, 0.22, 0, 0, 2 * Math.PI);
      p.moveTo(0.16, y(0.68)); p.ellipse(0, y(0.7), 0.16, 0.13, 0, 0, 2 * Math.PI);
      p.moveTo(-0.14, y(0.76)); p.lineTo(-0.1, y(0.9)); p.lineTo(-0.04, y(0.8)); p.closePath();
      p.moveTo(0.14, y(0.76)); p.lineTo(0.1, y(0.9)); p.lineTo(0.04, y(0.8)); p.closePath();
      /* Lorbeerzweige */
      for (const s of [-1, 1]) {
        for (let i = 0; i < 9; i++) {
          const t = i / 8, xx = s * (0.42 + t * 1.55), zz = 0.08 + 0.26 * Math.sin(t * Math.PI * 0.9) * (1 - t * 0.5);
          const a = s > 0 ? -0.5 + t * 0.4 : Math.PI + 0.5 - t * 0.4;
          p.moveTo(xx + 0.09, y(zz + 0.05)); p.ellipse(xx, y(zz + 0.05), 0.09 * (1 - t * 0.4), 0.035, a - 0.6, 0, 2 * Math.PI);
          p.moveTo(xx + 0.09, y(zz - 0.03)); p.ellipse(xx, y(zz - 0.03), 0.09 * (1 - t * 0.4), 0.035, a + 0.6, 0, 2 * Math.PI);
        }
      }
    };
    const p = new Path2D(); formen(p);
    g.save(); g.translate(sv ? sv[0] : 0.015, sv ? sv[1] : 0.02); g.fillStyle = "rgba(40,30,20,0.35)"; g.fill(p); g.restore();
    const gr = g.createLinearGradient(-0.3, y(0.9), 0.3, y(0));
    gr.addColorStop(0, rgbS(hellF(c, 0.12))); gr.addColorStop(1, rgbS(hellF(c, -0.08)));
    g.fillStyle = gr; g.fill(p);
    /* Zeichnung: Augen, Gefieder, Buchkanten, Zweig */
    g.strokeStyle = "rgba(70,54,38,0.55)"; g.lineWidth = Math.max(0.008, 0.7 / px);
    g.beginPath();
    for (const s of [-1, 1]) g.moveTo(s * 0.06 + 0.045, y(0.71)), g.arc(s * 0.06, y(0.71), 0.045, 0, 2 * Math.PI);
    g.moveTo(-0.12, y(0.3)); g.quadraticCurveTo(-0.2, y(0.45), -0.1, y(0.6)); g.moveTo(0.12, y(0.3)); g.quadraticCurveTo(0.2, y(0.45), 0.1, y(0.6));
    g.moveTo(-0.36, y(0.06)); g.lineTo(0.36, y(0.06)); g.moveTo(-0.3, y(0.175)); g.lineTo(0.3, y(0.175));
    for (const s of [-1, 1]) { g.moveTo(s * 0.4, y(0.08)); for (let i = 1; i <= 8; i++) { const t = i / 8; g.lineTo(s * (0.42 + t * 1.55), y(0.08 + 0.26 * Math.sin(t * Math.PI * 0.9) * (1 - t * 0.5))); } }
    g.stroke();
    if (px > 30) { g.fillStyle = "rgba(60,44,30,0.7)"; for (const s of [-1, 1]) { g.beginPath(); g.arc(s * 0.06, y(0.71), 0.015, 0, 2 * Math.PI); g.fill(); } }
    if (I.W.winter) { g.fillStyle = "rgba(244,247,252,0.9)"; g.beginPath(); g.ellipse(0, y(0.82), 0.14, 0.03, 0, 0, 2 * Math.PI); g.fill(); g.fillRect(-0.3, y(0.24), 0.6, 0.02); }
  }

  /* =====================================================================
     KUPFERDACH mit Stehfalzen und Patina
     ===================================================================== */
  function schalung(g, F, I, x0, y0, x1, y1) {
    if (y1 <= y0) return;
    g.save(); g.beginPath(); g.rect(x0 - 0.1, y0 - 0.1, x1 - x0 + 0.2, y1 - y0 + 0.1); g.clip();
    g.fillStyle = "rgb(60,48,38)"; g.fillRect(x0 - 0.1, y0 - 0.1, x1 - x0 + 0.2, y1 - y0 + 0.2);
    let k = 0;
    for (let y = y1; y > y0 - 0.2; y -= 0.15, k++) { g.fillStyle = rgbS(hellF(HOLZ, (hash(k, 4, 9) - 0.5) * 0.16 - 0.05)); g.fillRect(x0 - 0.1, y - 0.14, x1 - x0 + 0.2, 0.135); }
    if (I.W.winter) { g.fillStyle = "rgba(244,247,252,0.6)"; g.fillRect(x0 - 0.1, y0 - 0.1, x1 - x0 + 0.2, y1 - y0 + 0.2); }
    g.restore();
  }
  function kupfer(g, F, I, x0, y0, x1, y1, bE, farbe, saat) {
    const px = F.px, patina = I.W.Z.patina;
    g.fillStyle = rgbS(farbe); g.fillRect(x0, y0, x1 - x0, y1 - y0);
    /* Laufspuren: in Fallrichtung gestrecktes Rauschen */
    g.save(); g.scale(1, 5); rausch(g, x0, y0 / 5, x1 - x0, (y1 - y0) / 5, 1.0, 0.22, saat, 3); g.restore();
    rausch(g, x0, y0, x1 - x0, y1 - y0, 5, 0.1, saat + 4, 4);
    if (patina > 0.3) { g.save(); g.globalAlpha = 0.5 * patina; bleich(g, x0, y0, x1 - x0, y1 - y0, 1.6, 0.16, saat + 2); g.restore(); }
    /* Stehfalze entlang der Fallinie, Querfalze versetzt */
    if (px * 0.55 > 2.5) {
      const sv = F.schatten ? F.schatten(0.03) : null;
      const d = sv ? Math.max(-0.03, Math.min(0.03, sv[0])) : 0.012;
      const hellL = rgbS(hellF(farbe, 0.28)), dunkel = "rgba(20,30,26,0.4)";
      for (let x = Math.ceil(x0 / 0.52) * 0.52; x < x1; x += 0.52) {
        g.fillStyle = dunkel; g.fillRect(x + (d > 0 ? 0.012 : d - 0.004), y0, Math.abs(d) + 0.006, y1 - y0);
        g.fillStyle = hellL; g.fillRect(x - 0.008, y0, 0.016, y1 - y0);
      }
      if (px > 16) {
        g.fillStyle = "rgba(20,30,26,0.25)";
        let i = 0;
        for (let x = Math.floor(x0 / 0.52) * 0.52; x < x1; x += 0.52, i++) for (let y = bE - 2.8 - (i % 2) * 1.4; y > y0 - 3; y -= 2.8) g.fillRect(x, y, 0.52, 0.012);
      }
    }
  }
  /* Grat- und Firstabdeckung: Kupferwulst entlang geneigter Kanten */
  function dachKanten(g, F, I, bE, farbe, first) {
    const pts = I.fl.pts.map((p) => [dot(p, I.u), dot(p, I.v)]);
    const mx = pts.reduce((a, p) => a + p[0], 0) / pts.length, my = pts.reduce((a, p) => a + p[1], 0) / pts.length;
    const b = 0.1;
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], c = pts[(i + 1) % pts.length];
      if (Math.abs(a[1] - bE) < 0.03 && Math.abs(c[1] - bE) < 0.03) continue;
      if (!first && Math.abs(a[1] - c[1]) < 0.03) continue;
      const L = Math.hypot(c[0] - a[0], c[1] - a[1]); if (L < 0.05) continue;
      const tx = (c[0] - a[0]) / L, ty = (c[1] - a[1]) / L;
      let nx = -ty, ny = tx; if ((mx - a[0]) * nx + (my - a[1]) * ny < 0) { nx = -nx; ny = -ny; }
      g.fillStyle = "rgba(10,20,16,0.35)";
      g.beginPath(); g.moveTo(a[0] + nx * b, a[1] + ny * b); g.lineTo(c[0] + nx * b, c[1] + ny * b); g.lineTo(c[0] + nx * (b + 0.04), c[1] + ny * (b + 0.04)); g.lineTo(a[0] + nx * (b + 0.04), a[1] + ny * (b + 0.04)); g.closePath(); g.fill();
      const gr = g.createLinearGradient(a[0], a[1], a[0] + nx * b, a[1] + ny * b);
      gr.addColorStop(0, rgbS(hellF(farbe, 0.3))); gr.addColorStop(1, rgbS(hellF(farbe, -0.1)));
      g.fillStyle = I.W.winter ? rgbS(SCHNEE) : gr;
      g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(c[0], c[1]); g.lineTo(c[0] + nx * b, c[1] + ny * b); g.lineTo(a[0] + nx * b, a[1] + ny * b); g.closePath(); g.fill();
    }
  }
  function kupferMaler(opt) {
    return function (g, F, I) {
      const x0 = I.A0, x1 = I.A0 + F.w, y0 = I.B0, y1 = I.B0 + F.h, W = I.W;
      let bE = -Infinity, bR = Infinity;
      for (const p of I.fl.pts) { const b = dot(p, I.v); bE = Math.max(bE, b); bR = Math.min(bR, b); }
      const farbe = W.dachFarbe, k = opt.eindeck == null ? 1 : opt.eindeck;
      if (k < 1) {
        const bG = bE - (bE - bR) * k;
        schalung(g, F, I, x0, y0, x1, bG + 0.05);
        if (k <= 0) return;
        g.save(); g.beginPath(); g.rect(x0 - 1, bG, x1 - x0 + 2, y1 - bG + 1); g.clip();
        kupfer(g, F, I, x0, bG, x1, y1, bE, farbe, opt.saat || 1);
        if (W.winter) schneeDach(g, F, I, x0, x1, bG, bE, { saat: opt.saat, oben: 0.4, rutsch: false });
        g.restore();
        return;
      }
      kupfer(g, F, I, x0, y0, x1, y1, bE, farbe, opt.saat || 1);
      if (W.winter) schneeDach(g, F, I, x0, x1, bR, bE, { saat: opt.saat, rutsch: opt.rutsch !== false, rutschFarbe: farbe });
      dachKanten(g, F, I, bE, farbe, opt.first !== false);
    };
  }
  function kupferKante(g, F, I) {
    const x0 = I.A0, y0 = I.B0, w = F.w, h = F.h, farbe = I.W.dachFarbe;
    const gr = g.createLinearGradient(0, y0, 0, y0 + h); gr.addColorStop(0, rgbS(hellF(farbe, 0.2))); gr.addColorStop(1, rgbS(hellF(farbe, -0.3)));
    g.fillStyle = gr; g.fillRect(x0 - 0.05, y0 - 0.05, w + 0.1, h + 0.1);
    if (I.W.winter && Math.abs(I.n[2]) < 0.5) { g.fillStyle = rgbS(SCHNEE); g.fillRect(x0 - 0.05, y0 - 0.05, w + 0.1, h * 0.45); }
  }
  /* Glas der Dachlaterne: Sprossen aus Kupfer, dahinter der Lichtschacht */
  function laterneGlas(g, F, I) {
    const x0 = I.A0, x1 = I.A0 + F.w, y0 = I.B0, y1 = I.B0 + F.h, farbe = I.W.dachFarbe;
    g.fillStyle = "rgb(46,52,62)"; g.fillRect(x0, y0, x1 - x0, y1 - y0);
    glasTag(g, F, x0, y0, x1 - x0, y1, 71);
    g.fillStyle = rgbS(hellF(farbe, -0.1));
    const n = 3;
    for (let i = 0; i <= n; i++) g.fillRect(x0 + (x1 - x0) * i / n - 0.03, y0, 0.06, y1 - y0);
    g.fillRect(x0, y0, x1 - x0, 0.07); g.fillRect(x0, y1 - 0.08, x1 - x0, 0.08); g.fillRect(x0, (y0 + y1) / 2 - 0.02, x1 - x0, 0.04);
    if (I.W.winter) { g.fillStyle = rgbS(SCHNEE); g.fillRect(x0, y1 - 0.12, x1 - x0, 0.06); }
  }
  function laterneNacht(g, F, I) {
    if (F.nacht < 0.02 || !I.W.Z.licht) return;
    const x0 = I.A0, x1 = I.A0 + F.w, y0 = I.B0, y1 = I.B0 + F.h;
    g.save(); g.globalAlpha = F.nacht * 0.85;
    const gr = g.createLinearGradient(0, y1, 0, y0); gr.addColorStop(0, "rgb(255,200,130)"); gr.addColorStop(1, "rgb(230,150,80)");
    g.fillStyle = gr; g.fillRect(x0, y0, x1 - x0, y1 - y0);
    g.fillStyle = "rgb(60,44,30)"; const n = 3;
    for (let i = 0; i <= n; i++) g.fillRect(x0 + (x1 - x0) * i / n - 0.03, y0, 0.06, y1 - y0);
    g.fillRect(x0, (y0 + y1) / 2 - 0.02, x1 - x0, 0.04);
    g.restore();
    lp(F, I, (x0 + x1) / 2, (y0 + y1) / 2, 1.3, "255,196,120", 0.35);
  }

  /* =====================================================================
     FIGUREN: Säule, Kandelaber, Buchskübel, Knauf
     ===================================================================== */
  /* Ionische Säule. Ursprung = Mitte der Basis auf dem Podest.
     k (0…1): wie weit sie steht (Trommel für Trommel) */
  function saeuleFigur(k) {
    const H = SAEULE.h, zB = 0.3, zE = H - 0.45, r0 = SAEULE.r, r1 = 0.26;
    const rS = (z) => { const t = klemm((z - zB) / (zE - zB), 0, 1); return r0 - (r0 - r1) * Math.pow(t, 1.6); };
    return function (g, s, F) {
      const K = kleinBlick(F, s), sch = F.schatten, KZ = ST.KZ, c = hellF(STEIN, 0.1);
      const hoch = k >= 1 ? zE : zB + (zE - zB) * k;
      const teile = [];
      kisteFl(teile, -0.38, -0.38, 0, 0.38, 0.38, 0.12, hellF(c, -0.02), { schneeOk: true, vor: -10 });
      /* Torus und Schaft als Drehkörper */
      const dreh = (z0, z1, ra, rb, farbe, fein, tf) => ({
        mitte: [0, 0, (z0 + z1) / 2], tief: K.tief([0, 0, 0]) + tf,
        zeichnen(g2) {
          const n = 14, L = [], R = [];
          for (let i = 0; i <= n; i++) { const z = z0 + (z1 - z0) * i / n, rr = typeof ra === "function" ? ra(z) : ra + (rb - ra) * i / n; L.push([-rr * s, -z * KZ * s]); R.push([rr * s, -z * KZ * s]); }
          const rOben = typeof ra === "function" ? ra(z1) : rb, rUnten = typeof ra === "function" ? ra(z0) : ra;
          const pfad = () => { g2.beginPath(); g2.moveTo(L[0][0], L[0][1]); for (const q of L) g2.lineTo(q[0], q[1]); g2.ellipse(0, -z1 * KZ * s, rOben * s, rOben * s * 0.5, 0, Math.PI, 0, true); for (let i = R.length - 1; i >= 0; i--) g2.lineTo(R[i][0], R[i][1]); g2.ellipse(0, -z0 * KZ * s, rUnten * s, rUnten * s * 0.5, 0, 0, Math.PI, false); g2.closePath(); };
          if (sch) { g2.fillStyle = "#000"; pfad(); g2.fill(); return; }
          g2.fillStyle = mantelVerlauf(g2, F, null, -r0 * s, r0 * s, farbe); pfad(); g2.fill();
          if (fein && s > 9) {
            /* Kanneluren: 20 Rillen, sichtbar auf der Vorderseite */
            g2.save(); pfad(); g2.clip();
            const nF = 20, off = ((F.gier || 0) * RAD) % (2 * Math.PI / nF);
            for (let i = 0; i < nF; i++) {
              const phi = off + i * 2 * Math.PI / nF - Math.PI;
              const sx = Math.sin(phi), cz = Math.cos(phi);
              if (cz < 0.05) continue;
              const licht = sx < 0 ? 0.28 : 0.46;
              g2.strokeStyle = "rgba(40,30,22," + (licht * (0.4 + 0.6 * cz)).toFixed(3) + ")"; g2.lineWidth = Math.max(0.6, 0.014 * s * cz);
              g2.beginPath(); for (let j = 0; j <= 10; j++) { const z = z0 + 0.12 + (z1 - z0 - 0.24) * j / 10; const x = rS(z) * s * sx; if (j) g2.lineTo(x, -z * KZ * s + rS(z) * s * 0.5 * cz); else g2.moveTo(x, -z * KZ * s + rS(z) * s * 0.5 * cz); } g2.stroke();
              if (s > 30) { g2.strokeStyle = "rgba(255,248,230," + (0.25 * cz).toFixed(3) + ")"; g2.lineWidth = Math.max(0.5, 0.006 * s); g2.beginPath(); for (let j = 0; j <= 10; j++) { const z = z0 + 0.12 + (z1 - z0 - 0.24) * j / 10; const x = rS(z) * s * Math.sin(phi + 0.1); if (j) g2.lineTo(x, -z * KZ * s + rS(z) * s * 0.5 * cz); else g2.moveTo(x, -z * KZ * s + rS(z) * s * 0.5 * cz); } g2.stroke(); }
            }
            g2.restore();
          }
          if (!fein && F.jahr === "winter" && tf > 0) { g2.fillStyle = belicht(SCHNEE, ST.lichtFaktor([0, 0, 1], F.Z, 0, F.jahr)); g2.beginPath(); g2.ellipse(0, -z1 * KZ * s, rOben * s * 0.95, rOben * s * 0.45, 0, 0, 2 * Math.PI); g2.fill(); }
        }
      });
      teile.push(dreh(0.12, 0.22, 0.35, 0.34, hellF(c, 0.04), false, -9));
      teile.push(dreh(0.22, zB, 0.31, 0.3, hellF(c, 0.06), false, -8));
      if (hoch > zB + 0.02) teile.push(dreh(zB, hoch, rS, null, c, true, -7));
      if (k < 1 && hoch > zB + 0.02) {
        /* obere Trommel: frische Lagerfläche */
        teile.push({ mitte: [0, 0, hoch], tief: K.tief([0, 0, 0]) - 6, zeichnen(g2) { if (sch) return; const rr = rS(hoch) * s; g2.fillStyle = belicht(hellF(c, 0.08), ST.lichtFaktor([0, 0, 1], F.Z, 0, F.jahr)); g2.beginPath(); g2.ellipse(0, -hoch * KZ * s, rr, rr * 0.5, 0, 0, 2 * Math.PI); g2.fill(); g2.fillStyle = "rgba(60,44,30,0.4)"; g2.beginPath(); g2.arc(0, -hoch * KZ * s, rr * 0.12, 0, 2 * Math.PI); g2.fill(); } });
      }
      if (k >= 1) {
        /* Echinus, Voluten (Polster mit Schnecke), Abakus */
        teile.push(dreh(zE, zE + 0.13, 0.27, 0.33, hellF(c, 0.08), false, -5));
        const spirale = (g3, R0, lf) => {
          if (K.s < 10) return;
          g3.strokeStyle = belicht(hellF(c, -0.4), lf); g3.lineWidth = R0 * 0.1;
          g3.beginPath();
          for (let i = 0; i <= 60; i++) { const a = i / 60 * 5 * Math.PI, rr = R0 * 0.92 * (1 - i / 66); const px = Math.cos(a) * rr, py = Math.sin(a) * rr; if (i) g3.lineTo(px, py); else g3.moveTo(px, py); }
          g3.stroke();
          g3.fillStyle = belicht(hellF(c, -0.3), lf); g3.beginPath(); g3.arc(0, 0, R0 * 0.14, 0, 2 * Math.PI); g3.fill();
        };
        for (const sx of [-1, 1]) {
          const f = fassTeile([sx * 0.27, 0, zE + 0.2], [0, 1, 0], 0.66, 0.13, 0.12, hellF(c, 0.05), { reifen: [0], reif: hellF(c, -0.25), schnee: true, na: 14, ns: 3, deckel: (g3, R0, lf) => spirale(g3, R0, lf) });
          f.tief = K.tief(f.mitte) - 2;
          teile.push(f);
        }
        kisteFl(teile, -0.27, -0.33, zE + 0.13, 0.27, 0.33, zE + 0.3, hellF(c, 0.04), { vor: -3 });
        kisteFl(teile, -0.4, -0.4, zE + 0.33, 0.4, 0.4, H, hellF(c, 0.1), { schneeOk: true, vor: 20, kante: true });
      }
      kleinMalen(g, K, F, teile);
    };
  }
  /* Kandelaber: gusseiserner Mast mit Laterne (auf der Treppenwange) */
  function kandelaber(g, s, F) {
    const sch = F.schatten, KZ = ST.KZ, z = (m) => -m * KZ * s;
    const eisen = [44, 48, 46];
    const lf = sch ? null : ST.lichtFaktor([0.4, 0.6, 0.3], F.Z, 0.05, F.jahr);
    const col = (c) => (sch ? "#000" : belicht(c, lf));
    /* Sockel, Mast, Ringe */
    g.fillStyle = sch ? "#000" : mantelVerlauf(g, F, null, -0.16 * s, 0.16 * s, eisen);
    g.beginPath(); g.moveTo(-0.16 * s, 0); g.lineTo(-0.12 * s, z(0.35)); g.lineTo(-0.05 * s, z(0.45)); g.lineTo(-0.04 * s, z(2.0)); g.lineTo(0.04 * s, z(2.0)); g.lineTo(0.05 * s, z(0.45)); g.lineTo(0.12 * s, z(0.35)); g.lineTo(0.16 * s, 0); g.closePath(); g.fill();
    g.fillStyle = col(hellF(eisen, 0.15)); for (const m of [0.45, 1.2, 1.95]) g.fillRect(-0.07 * s, z(m) - 0.02 * s, 0.14 * s, 0.05 * s);
    /* Laterne: nach oben weiter, Dach mit Knauf */
    const lb = 0.14, lt = 0.2, l0 = 2.05, l1 = 2.55;
    g.fillStyle = col(eisen);
    g.beginPath(); g.moveTo(-lb * s, z(l0)); g.lineTo(-lt * s, z(l1)); g.lineTo(lt * s, z(l1)); g.lineTo(lb * s, z(l0)); g.closePath();
    if (sch) { g.fill(); g.beginPath(); g.moveTo(-0.25 * s, z(l1)); g.lineTo(0, z(l1 + 0.25)); g.lineTo(0.25 * s, z(l1)); g.fill(); return; }
    const an = F.nacht > 0.02;
    g.fillStyle = an ? "rgba(255,226,160," + (0.6 + 0.4 * F.nacht) + ")" : belicht([150, 166, 176], lf, 0.9); g.fill();
    g.strokeStyle = col(eisen); g.lineWidth = Math.max(0.7, 0.025 * s); g.stroke();
    g.beginPath(); g.moveTo(0, z(l0)); g.lineTo(0, z(l1)); g.stroke();
    g.fillStyle = col(eisen); g.beginPath(); g.moveTo(-0.26 * s, z(l1)); g.lineTo(0, z(l1 + 0.24)); g.lineTo(0.26 * s, z(l1)); g.closePath(); g.fill();
    g.beginPath(); g.arc(0, z(l1 + 0.3), Math.max(1, 0.04 * s), 0, 2 * Math.PI); g.fill();
    if (F.jahr === "winter") { g.fillStyle = belicht(SCHNEE, ST.lichtFaktor([0, 0, 1], F.Z, 0, F.jahr)); g.beginPath(); g.moveTo(-0.2 * s, z(l1 + 0.04)); g.lineTo(0, z(l1 + 0.22)); g.lineTo(0.2 * s, z(l1 + 0.04)); g.closePath(); g.fill(); }
    /* Schein nur, wenn die Südseite (Treppe) zum Betrachter zeigt – sonst
       stünde er hinter dem Haus und schiene durch das Dach */
    const gr = (F.gier || 0) * RAD;
    if (an && Math.cos(gr) - Math.sin(gr) > -0.35) F.leuchtPunkt(0, z((l0 + l1) / 2), 1.1 * s, "255,210,150", 0.6 * F.nacht);
  }
  /* Buchskugel im Sandsteinkübel (Winter: Schneehaube) */
  function kuebelFigur(saat) {
    return function (g, s, F) {
      const K = kleinBlick(F, s), sch = F.schatten, KZ = ST.KZ;
      const teile = [];
      kisteFl(teile, -0.3, -0.3, 0, 0.3, 0.3, 0.5, hellF(STEIN, 0.06), { kante: true });
      kisteFl(teile, -0.34, -0.34, 0.5, 0.34, 0.34, 0.58, hellF(STEIN, 0.12), { kante: true, schneeOk: true });
      teile.push({
        mitte: [0, 0, 0.95], tief: 99, zeichnen(g2) {
          const cy = -0.93 * KZ * s, r = 0.36 * s;
          if (sch) { g2.fillStyle = "#000"; g2.beginPath(); g2.arc(0, cy, r, 0, 2 * Math.PI); g2.fill(); return; }
          const lf = ST.lichtFaktor([0, 0, 1], F.Z, 0.02, F.jahr);
          const gr = g2.createRadialGradient(-r * 0.35, cy - r * 0.4, r * 0.1, 0, cy, r);
          const gruen = F.jahr === "fruehling" ? [92, 140, 62] : [52, 92, 50];
          gr.addColorStop(0, belicht(hellF(gruen, 0.25), lf)); gr.addColorStop(0.7, belicht(gruen, lf)); gr.addColorStop(1, belicht(hellF(gruen, -0.45), lf));
          g2.fillStyle = gr; g2.beginPath(); g2.arc(0, cy, r, 0, 2 * Math.PI); g2.fill();
          if (s > 20) { const rng = zuf(saat); for (let i = 0; i < 70; i++) { const a = rng() * 2 * Math.PI, rr = Math.sqrt(rng()) * r * 0.95; g2.fillStyle = belicht(hellF(gruen, (rng() - 0.5) * 0.5), lf); g2.beginPath(); g2.arc(Math.cos(a) * rr, cy + Math.sin(a) * rr, Math.max(0.6, 0.03 * s), 0, 2 * Math.PI); g2.fill(); } }
          if (F.jahr === "winter") { g2.fillStyle = belicht(SCHNEE, lf); g2.beginPath(); g2.ellipse(0, cy - r * 0.55, r * 0.75, r * 0.42, 0, Math.PI, 2 * Math.PI); g2.quadraticCurveTo(0, cy - r * 0.35, -r * 0.75, cy - r * 0.55); g2.fill(); }
        }
      });
      kleinMalen(g, K, F, teile);
    };
  }
  function knauf(g, s, F) {
    const sch = F.schatten, KZ = ST.KZ;
    const lf = sch ? null : ST.lichtFaktor([0.3, 0.6, 0.6], F.Z, 0.1, F.jahr);
    g.fillStyle = sch ? "#000" : mantelVerlauf(g, F, null, -0.1 * s, 0.1 * s, [206, 170, 86]);
    g.beginPath(); g.arc(0, -0.15 * KZ * s, 0.1 * s, 0, 2 * Math.PI); g.fill();
    g.fillStyle = sch ? "#000" : belicht([196, 160, 80], lf);
    g.beginPath(); g.moveTo(-0.02 * s, -0.22 * KZ * s); g.lineTo(0, -0.62 * KZ * s); g.lineTo(0.02 * s, -0.22 * KZ * s); g.closePath(); g.fill();
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
    Z.hbH = stueck([[0.19, 0.001], [0.52, HB.zG]]);
    Z.podH = stueck([[0.2, 0.001], [0.3, HB.zS]]);
    Z.saeulen = k(0.44, 0.56);
    Z.kranz = bau >= 0.53;
    Z.gebaelk = bau >= 0.56;
    Z.giebel = bau >= 0.58 ? stueck([[0.58, HB.zT + 0.01], [0.64, PO.zSp + 0.01]]) : 0;
    Z.schale = bau < 0.68;
    Z.stuhl = bau >= 0.6 && bau < 0.74 ? k(0.6, 0.66) : 0;
    Z.richt = bau >= 0.64 && bau < 0.74;
    Z.dach = bau >= 0.66; Z.deck = k(0.66, 0.78);
    Z.giebelDach = bau >= 0.64; Z.deckG = k(0.64, 0.7);
    Z.laterne = k(0.76, 0.84);
    Z.patina = k(0.86, 0.97);
    Z.fenster = (i) => bau >= 0.8 + (i % 12) * 0.008;
    Z.treppe = k(0.84, 0.9);
    Z.tuer = bau >= 0.9;
    Z.relief = bau >= 0.91;
    Z.schrift = bau >= 0.93;
    Z.lampen = bau >= 0.96;
    Z.deko = bau >= 0.97;
    Z.kuebel = bau >= 0.98;
    Z.licht = fertig;
    return Z;
  }
  /* Offener Walmdachstuhl: Gratsparren, First, Sparren und Schifter */
  function walmstuhl(W, k) {
    const D = DA, z = D.z + 0.1, xr = D.x1 - D.hb, vb = "stuhl";
    W.verbund(vb, [[D.x0, D.y0, D.z], [D.x1, D.y0, D.z], [D.x0, D.y1, D.z], [D.x1, D.y1, D.z], [-xr, D.ym, D.zF + 0.35], [xr, D.ym, D.zF + 0.35]]);
    const liste = [];
    liste.push([[-xr, D.ym, D.zF + 0.1], [xr, D.ym, D.zF + 0.1]]);
    for (const [sx, sy] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) liste.push([[sx > 0 ? D.x1 - 0.1 : D.x0 + 0.1, sy > 0 ? D.y1 - 0.1 : D.y0 + 0.1, z], [sx * xr, D.ym, D.zF + 0.1]]);
    for (let x = D.x0 + 0.5; x <= D.x1 - 0.45; x += 0.85) {
      for (const sy of [1, -1]) {
        const ye = sy > 0 ? D.y1 - 0.1 : D.y0 + 0.1;
        const d = Math.min(D.hb - 0.1, Math.abs(x) > xr ? D.x1 - Math.abs(x) - 0.1 : D.hb - 0.1);
        liste.push([[x, ye, z], [x, ye - sy * d, z + d * D.neig]]);
      }
    }
    for (let y = D.y0 + 0.6; y <= D.y1 - 0.5; y += 0.85) for (const sx of [1, -1]) {
      const xe = sx > 0 ? D.x1 - 0.1 : D.x0 + 0.1, d = Math.min(Math.abs(y - D.y0), Math.abs(D.y1 - y)) - 0.1;
      if (d > 0.2) liste.push([[xe, y, z], [xe - sx * d, y, z + d * D.neig]]);
    }
    const n = Math.ceil(liste.length * k);
    for (let i = 0; i < n; i++) balken(W, "sparren" + i, liste[i][0], liste[i][1], 0.12, 0.16, null, vb);
  }

  /* =====================================================================
     DAS MODELL
     ===================================================================== */
  function bibliothekBauen(W, M) {
    const Z = W.Z, winter = W.winter;
    const rund = (a, w, nr, licht, extra) => Object.assign({ art: "rund", a: a, w: w, z0: 1.95, zk: 5.25, nr: nr, licht: licht }, extra || {});
    const pil = (a0, a1) => [[a0, a0 + 0.55], [a1 - 0.55, a1]];
    const SUED = { saat: 11, pilaster: pil(HB.x0, HB.x1), keller: [-4.05, 4.05],
      oeff: [rund(-4.05, 1.4, 1, 1), rund(4.05, 1.4, 2, 0.9), rund(-1.72, 1.2, 3, 1, { z0: 2.05 }), rund(1.72, 1.2, 4, 1, { z0: 2.05 }), { art: "portal", a: 0, w: 1.7, z0: HB.zS, h: 3.2 }] };
    const OST = { saat: 12, pilaster: pil(-HB.y1, -HB.y0), keller: [0.2, 2.6], oeff: [rund(0.2, 1.4, 5, 0.8), rund(2.6, 1.4, 6, 1)] };
    const WEST = { saat: 13, pilaster: pil(HB.y0, HB.y1), keller: [-2.6, -0.2], oeff: [rund(-2.6, 1.4, 7, 1), rund(-0.2, 1.4, 8, 0.7)] };
    const NORD = { saat: 14, pilaster: pil(-HB.x1, -HB.x0), keller: [-3.55, -1.25, 1.25, 3.55], oeff: [rund(-3.55, 1.4, 9, 0.6), rund(-1.25, 1.4, 10, 1), rund(1.25, 1.4, 11, 1), rund(3.55, 1.4, 12, 0.8)] };
    const TAB = [[[0, 1], SUED], [[1, 0], OST], [[0, -1], NORD], [[-1, 0], WEST]];
    const wand = (spec) => ({ malen: wandMalerBib(spec), danach: wandNachtBib(spec), ao: true });
    const nachNormale = (n) => { let best = null, bd = -2; for (const [d, s] of TAB) { const kk = n[0] * d[0] + n[1] * d[1]; if (kk > bd) { bd = kk; best = s; } } return best; };

    /* ---------------- Grube, Fundamente ---------------- */
    if (Z.grubeT > 0.02) grubeBauen(W, Z.grubeT);
    if (Z.fundament >= 0) {
      const st = Z.fundament, T = 1.2, unten = [[[0, 0, -1], Math.max(0, Z.grubeT) - 0.001]];
      const mal = fundamentMaler(st);
      const m = (fl) => (fl.n[2] < -0.5 ? null : { malen: mal, keinLicht: fl.n[2] < 0.5, keinSchatten: fl.n[2] < 0.5 });
      const box = (name, x0, y0, x1, y1) => W.koerper("fund-" + name, quaderP(x0, y0, -T, x1, y1, 0), m, { schatten: false, schnitte: unten });
      const b = 0.3;
      box("s", HB.x0 - b, HB.y1 - 0.5, HB.x1 + b, HB.y1 + b); box("n", HB.x0 - b, HB.y0 - b, HB.x1 + b, HB.y0 + 0.5);
      box("o", HB.x1 - 0.5, HB.y0 + 0.5, HB.x1 + b, HB.y1 - 0.5); box("w", HB.x0 - b, HB.y0 + 0.5, HB.x0 + 0.5, HB.y1 - 0.5);
      box("p", PO.x0 - 0.2, HB.y1 + b + 0.01, PO.x1 + 0.2, PO.y1 + 0.35);
    }
    if (Z.aushub > 0.02) W.figur("aushub", { x: 4.3, y: 3.6, z: 0, breite: 3.2, hoehe: 1.3, malen: aushubFigur(Z.aushub, winter) }, [1.1, 1.0]);

    /* ---------------- Hauptbau ---------------- */
    const gr = "haus";
    if (!Z.schale) {
      W.koerper("haupt", quaderP(HB.x0, HB.y0, 0, HB.x1, HB.y1, HB.zG), (fl) => (Math.abs(fl.n[2]) > 0.5 ? null : wand(nachNormale(fl.n))), { wirft: true, gruppe: gr });
    } else if (Z.hbH > 0.01) {
      const t = 0.5, D = HB;
      const schale = (fl) => {
        if (Math.abs(fl.n[2]) > 0.5) return fl.n[2] > 0 ? { malen: mauerkroneBib } : null;
        for (const [d, spec] of TAB) {
          const dd = d[0] === 0 ? (d[1] > 0 ? D.y1 : -D.y0) : (d[0] > 0 ? D.x1 : -D.x0);
          if (fl.n[0] * d[0] + fl.n[1] * d[1] > 0.995 && Math.abs(fl.d - dd) < 0.03) return wand(spec);
        }
        for (const [d, spec] of TAB) if (fl.n[0] * d[0] + fl.n[1] * d[1] < -0.995) {
          const dd = d[0] === 0 ? (d[1] > 0 ? D.y1 - t : -(D.y0 + t)) : (d[0] > 0 ? D.x1 - t : -(D.x0 + t));
          if (Math.abs(fl.d + dd) < 0.03) return { malen: innenMalerBib(spec) };
        }
        return { malen: innenMalerBib(null) };
      };
      const o = { wirft: true, bisZ: Z.hbH, gruppe: gr };
      W.koerper("haupt-s", quaderP(D.x0, D.y1 - t, 0, D.x1, D.y1, D.zG), schale, o);
      W.koerper("haupt-n", quaderP(D.x0, D.y0, 0, D.x1, D.y0 + t, D.zG), schale, o);
      W.koerper("haupt-o", quaderP(D.x1 - t, D.y0 + t, 0, D.x1, D.y1 - t, D.zG), schale, o);
      W.koerper("haupt-w", quaderP(D.x0, D.y0 + t, 0, D.x0 + t, D.y1 - t, D.zG), schale, o);
      if (Z.boden > 0) W.koerper("boden", quaderP(D.x0 + t, D.y0 + t, 0, D.x1 - t, D.y1 - t, 0.15 * Z.boden), (fl) => (fl.n[2] < 0.5 ? null : { malen: bodenMaler }), { schatten: false });
    }
    if (Z.kranz) {
      /* Kranzgesims als Ring (solange das Dach fehlt, sieht man hinein) */
      const u = 0.25, t = 0.62, km = (fl) => (fl.n[2] < -0.5 ? null : { malen: kranzMaler });
      const ring = Z.dach && Z.deck >= 1 ? [["kranz", HB.x0 - u, HB.y0 - u, HB.x1 + u, HB.y1 + u]]
        : [["kranz-s", HB.x0 - u, HB.y1 - t, HB.x1 + u, HB.y1 + u], ["kranz-n", HB.x0 - u, HB.y0 - u, HB.x1 + u, HB.y0 + t],
          ["kranz-o", HB.x1 - t, HB.y0 + t, HB.x1 + u, HB.y1 - t], ["kranz-w", HB.x0 - u, HB.y0 + t, HB.x0 + t, HB.y1 - t]];
      for (const [nm, x0, y0, x1, y1] of ring) W.koerper(nm, quaderP(x0, y0, HB.zG, x1, y1, HB.zT), km, { wirft: true, gruppe: gr });
    }

    /* ---------------- Portikus ---------------- */
    if (Z.podH > 0.01) W.koerper("podest", quaderP(PO.x0 - 0.15, PO.y0, 0, PO.x1 + 0.15, PO.y1, HB.zS), (fl) => (fl.n[2] < -0.5 ? null : { malen: podestMaler, ao: true }), { wirft: true, bisZ: Z.podH, gruppe: gr });
    if (Z.saeulen > 0) SAEULE.xs.forEach((x, i) => W.figur("saeule" + i, { x: x, y: SAEULE.y, z: SAEULE.z0, breite: 0.9, hoehe: SAEULE.h * Math.max(0.1, Z.saeulen), malen: saeuleFigur(Z.saeulen) }, [0.38, 0.38]));
    if (Z.gebaelk) {
      W.koerper("gebaelk", quaderP(PO.x0, PO.y0, HB.zA, PO.x1, PO.y1, HB.zG), (fl) => (fl.n[2] < -0.5 ? null : { malen: gebaelkMaler }), { wirft: true, gruppe: gr });
      W.koerper("pkranz", quaderP(PO.x0 - 0.2, HB.y1 + 0.25, HB.zG, PO.x1 + 0.2, PO.y1 + 0.2, HB.zT), (fl) => (fl.n[2] < -0.5 ? null : { malen: kranzMaler }), { wirft: true, gruppe: gr });
    }
    if (Z.giebel > 0) {
      const p = [];
      for (const y of [PO.yg, PO.y1]) p.push([PO.x0, y, HB.zT], [PO.x1, y, HB.zT], [0, y, PO.zSp]);
      W.koerper("giebel", p, (fl) => {
        if (fl.n[2] > 0.3) return null;
        if (fl.n[2] < -0.5) return null;
        return { malen: giebelMaler(fl.n[1] > 0.9) };
      }, { wirft: true, bisZ: Z.giebel, gruppe: gr });
    }
    if (Z.giebelDach) {
      for (const sx of [1, -1]) {
        const ue = 0.12, xe = sx * (PO.x1 + ue), ze = HB.zT - ue * PO.neig, dv = 0.14 / Math.cos(Math.atan(PO.neig)), p = [];
        for (const y of [PO.yg, PO.y1 + 0.16]) p.push([0, y, PO.zSp], [0, y, PO.zSp + dv], [xe, y, ze], [xe, y, ze + dv]);
        const km = kupferMaler({ saat: 30 + sx, eindeck: Z.deckG, rutsch: false });
        W.koerper("gdach" + sx, p, (fl) => (fl.n[2] > 0.3 ? { malen: km } : fl.n[2] < -0.3 ? null : { malen: kupferKante }), { wirft: true, gruppe: gr });
      }
      if (Z.fertig || Z.deckG >= 1) {
        const kn = W.figur("akroter", { x: 0, y: PO.y1 + 0.1, z: PO.zSp + 0.12, breite: 0.4, hoehe: 0.7, malen: knauf }, [0.1, 0.1]);
        if (kn) kn.nach = W.k.filter((K) => /^gdach/.test(K.name));
      }
    }

    /* ---------------- Dach und Laterne ---------------- */
    if (Z.stuhl > 0) walmstuhl(W, Z.stuhl);
    if (Z.richt) W.figur("richtbaum", { x: 0, y: DA.ym, z: DA.zF + 0.3, breite: 1.1, hoehe: 2.3, malen: richtbaum }, [0.3, 0.3]);
    if (Z.dach) {
      const xr = DA.x1 - DA.hb;
      const p = [[DA.x0, DA.y0, DA.z], [DA.x1, DA.y0, DA.z], [DA.x1, DA.y1, DA.z], [DA.x0, DA.y1, DA.z], [-xr, DA.ym, DA.zF], [xr, DA.ym, DA.zF]];
      const km = [0, 1, 2, 3].map((i) => kupferMaler({ saat: 40 + i, eindeck: Z.deck }));
      W.koerper("dach", p, (fl) => {
        if (fl.n[2] < 0.2) return null;
        const i = Math.abs(fl.n[1]) > Math.abs(fl.n[0]) ? (fl.n[1] > 0 ? 0 : 1) : (fl.n[0] > 0 ? 2 : 3);
        return { malen: km[i] };
      }, { wirft: true, gruppe: gr });
    }
    if (Z.laterne > 0 && Z.dach && Z.deck >= 1) {
      const h = DL.hb, y0 = DL.y - h, y1 = DL.y + h, zS = DA.zF + DL.sockel, zG = zS + DL.glas, zSp = zG + DL.dach;
      const zDach = (y) => DA.zF - Math.abs(y - DA.ym) * DA.neig;
      const sp = [];
      for (const x of [-h, h]) sp.push([x, y0, zDach(y0) - 0.01], [x, DA.ym, DA.zF - 0.01], [x, y1, zDach(y1) - 0.01], [x, y0, zS], [x, y1, zS]);
      W.koerper("lat-sockel", sp, (fl) => (fl.n[2] < -0.3 ? null : fl.n[2] > 0.5 ? { malen: kupferKante } : { malen: kupferMaler({ saat: 51, first: false, rutsch: false }) }), { wirft: true, gruppe: gr });
      if (Z.laterne > 0.4) W.koerper("lat-glas", quaderP(-h + 0.08, y0 + 0.08, zS, h - 0.08, y1 - 0.08, zG), (fl) => (Math.abs(fl.n[2]) > 0.5 ? null : { malen: laterneGlas, danach: laterneNacht }), { wirft: true, gruppe: gr });
      if (Z.laterne > 0.8) {
        const u = 0.1;
        W.koerper("lat-dach", [[-h - u, y0 - u, zG - 0.03], [h + u, y0 - u, zG - 0.03], [h + u, y1 + u, zG - 0.03], [-h - u, y1 + u, zG - 0.03], [0, DL.y, zSp]], (fl) => (fl.n[2] < -0.3 ? null : { malen: kupferMaler({ saat: 53, rutsch: false }) }), { wirft: true, gruppe: gr });
        if (Z.laterne >= 1) { const kn = W.figur("knauf", { x: 0, y: DL.y, z: zSp - 0.05, breite: 0.4, hoehe: 0.7, malen: knauf }, [0.1, 0.1]); if (kn) kn.nach = W.k.filter((K) => K.name === "lat-dach"); }
      }
    }

    /* ---------------- Freitreppe, Wangen, Kandelaber, Kübel ---------------- */
    if (Z.treppe > 0) {
      const n = Math.ceil(TREPPE.n * Z.treppe);
      for (let kk = 0; kk < n; kk++) {
        W.koerper("stufe" + kk, quaderP(TREPPE.x0, TREPPE.y0, TREPPE.st * kk, TREPPE.x1, TREPPE.y1 - kk * TREPPE.auf, TREPPE.st * (kk + 1)), (fl) => (fl.n[2] < -0.3 ? null : { malen: stufeMalerBib }), { schatten: false });
      }
      for (const s of [-1, 1]) {
        const xa = s > 0 ? TREPPE.x1 : TREPPE.x0 - 0.42, xb = xa + 0.42;
        W.koerper("wange" + s, quaderP(xa, TREPPE.y0, 0, xb, TREPPE.y1, HB.zS), (fl) => (fl.n[2] < -0.5 ? null : { malen: podestMaler, ao: true }), { wirft: true });
      }
    }
    if (Z.lampen) for (const s of [-1, 1]) {
      const x = s > 0 ? TREPPE.x1 + 0.21 : TREPPE.x0 - 0.21;
      W.figur("kandelaber" + s, { x: x, y: TREPPE.y1 - 0.25, z: HB.zS, breite: 0.6, hoehe: 2.9, malen: kandelaber }, [0.18, 0.18]);
    }
    if (Z.kuebel) for (const s of [-1, 1]) W.figur("kuebel" + s, { x: s * 4.35, y: HB.y1 + 0.75, z: 0, breite: 0.9, hoehe: 1.35, malen: kuebelFigur(s > 0 ? 3 : 5) }, [0.34, 0.34]);

    /* ---------------- Eiszapfen am Kranzgesims ---------------- */
    if (winter && Z.kranz && Z.fertig) {
      const eis = (name, x0, y0, x1, y1, saat, nAchse) => W.koerper(name, quaderP(x0, y0, HB.zG - 0.42, x1, y1, HB.zG - 0.02),
        (fl) => (Math.abs(fl.n[nAchse]) > 0.9 ? { malen: eisMaler(saat), keinLicht: true, keinSchatten: true } : null), { schatten: false });
      const yS = HB.y1 + 0.26, yN = HB.y0 - 0.26, xO = HB.x1 + 0.26, xW = HB.x0 - 0.26;
      eis("eis-sw", HB.x0 + 0.2, yS, PO.x0 - 0.3, yS + 0.01, 3, 1); eis("eis-so", PO.x1 + 0.3, yS, HB.x1 - 0.2, yS + 0.01, 4, 1);
      eis("eis-n", HB.x0 + 0.2, yN - 0.01, HB.x1 - 0.2, yN, 5, 1);
      eis("eis-o", xO, HB.y0 + 0.2, xO + 0.01, HB.y1 - 0.2, 6, 0); eis("eis-w", xW - 0.01, HB.y0 + 0.2, xW, HB.y1 - 0.2, 7, 0);
    }

    /* ---------------- Licht ---------------- */
    if (Z.licht && Z.lampen && W.B.e[1] > -0.25) for (const s of [-1, 1]) M.licht(s > 0 ? TREPPE.x1 + 0.21 : TREPPE.x0 - 0.21, TREPPE.y1 - 0.25, HB.zS + 2.3, 1.6, "255,210,150", 0.6);
  }

  /* =====================================================================
     ANMELDEN
     ===================================================================== */
  ST.modell("bibliothek", {
    name: "Bibliothek", gruppe: "Häuser", grund: [12, 10], hoehe: 13, bauzeit: 15 * 60,
    bauen(M, o) {
      const B = blickVon(o);
      const W = new Werk(o, B);
      const bau = o.bau == null ? 1 : klemm(o.bau, 0, 1);
      W.Z = zustand(bau);
      W.winter = o.jahr === "winter";
      const saat = (o.saat >>> 0) || 7;
      W.saat = saat;
      const art = o.variante && STEINE[o.variante] ? o.variante : ["gelb", "gelb", "rot", "grau"][saat % 4];
      STEIN = STEINE[art];
      W.stein = STEIN;
      W.tuerFarbe = TUERF[saat % 2];
      W.dachFarbe = mischF(KUPFER_NEU, PATINA, W.Z.patina);
      bibliothekBauen(W, M);
      ausgeben(W, M);
      if (W.Z.licht && B.e[1] > 0.05) {
        M.bodenlicht(0, TREPPE.y1 + 0.9, 3.0, "255,200,130", 0.7);
        M.bodenlicht(TREPPE.x0 - 0.2, TREPPE.y1 + 0.3, 1.4, "255,210,150", 0.5);
        M.bodenlicht(TREPPE.x1 + 0.2, TREPPE.y1 + 0.3, 1.4, "255,210,150", 0.5);
      }
    }
  });
})();
