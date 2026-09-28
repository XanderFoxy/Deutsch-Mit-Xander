/* =====================================================================
   DORFKIRCHE — gotische Kirche auf dem Kirchberg (Winterhausen)
   ---------------------------------------------------------------------
   XANDER: „Ich möchte einen Liebreiz zur Weihnachtsdeko … dieses
   Weihnachtsdorf … mit Schmücken, mit Schnee, mit Santa Claus … alles
   dabei. Das möchte ich in Perfektion." · „dass wir das später in einen
   Frühlingsgewand packen können." · „Das soll keine Comic Grafik sein.
   Das soll noch viel mehr am Realismus dran sein." · „Richtig filigran.
   Richtig schön ausarbeiten mit schönen Texturen." · „ohne Pixelkanten
   und komische Vektorrückstände." · „Man soll sie in jedem Winkel
   aufstellen können." · „Man soll das Fundament sehen beim Aufbauen …
   Schritt für Schritt." · „Du bist dein schlimmster Kritiker."

   VORBILD
   Eine spätgotische Dorfkirche, wie sie in Franken, Hessen oder am Main
   auf dem Kirchberg steht: Langhaus aus Bruchsteinmauerwerk, alle Ecken,
   Fenstergewände, Gesimse und Strebepfeiler aus rotem Mainsandstein,
   steiles Dach in Schuppenschiefer, Westturm mit Glockenstube und
   achteckigem Spitzhelm, polygonaler Chor im Osten, Sakristei im Winkel
   zwischen Chor und Langhaus, Südportal mit Freitreppe.

   MASSE (Meter, x = Osten, y = Süden; Mitte des Grundrisses = 0,0)
     Westturm      6 × 6 m, Mauerwerk bis 22,0 m, Traufgesims 22,3 m,
                   Glockenstube mit Schallarkaden 19,2–22,0 m,
                   Zifferblätter bei 18,3 m, Helm (Achteck mit vier
                   Zwickeln) bis 35,0 m, Kreuz bzw. Hahn bis ~37 m
     Langhaus      22 × 10 m, Traufe 9,0 m, Dachneigung 57°, First 16,7 m
     Chor          7,6 m breit, 5/8-Schluss, Traufe 8,4 m, First 14,3 m
     Sakristei     3,7 × 2,7 m, Pultdach an der Chornordwand
     Südportal     Vorbau 3,7 × 0,6 m mit Giebel, Freitreppe mit vier Stufen
   Maßstab wie die Fachwerkhäuser: Mensch 1,75 m, Tür 2,1 m (hier das
   Portal 3,9 m bis zum Scheitel, weil Kirchenportale hoch sind).

   WIE ES GEBAUT IST — EIN KLEINES EIGENES 3D-WERK
   Der Kern sortiert Teile nach ihrer Mitte. Für eine Kirche reicht das
   nicht: ein langes Schiff, ein hoher Turm und viele kleine Pfeiler
   liegen je nach Blickwinkel einmal vor, einmal hinter einander. Deshalb:
     • Alles besteht aus KONVEXEN Körpern (Punktwolke → konvexe Hülle).
     • Der Blickwinkel ist beim Bauen bekannt (Objekt-Drehung + Kamera,
       wie bei Tanne und Laterne). Für JEDES Paar von Körpern, die sich
       im Bild überdecken, wird eine trennende Ebene gesucht (Flächen
       beider Körper): wer auf der Seite des Betrachters liegt, wird
       später gemalt. Daraus eine Reihenfolge (topologisch), die als
       „ebene" an den Kern geht.
     • Eigenschatten: Turm, Pfeiler, Portal, Dachüberstand werfen echte
       Schatten auf Wände und Dächer (Körper entlang des Sonnenlichts auf
       die Ebene der Fläche geworfen, konvexe Hülle, Lichtverhältnis wie
       im Kern ohne Sonne).
     • Leuchtendes (Bleiglas, Zifferblatt, Stern) wird in „danach"
       gemalt – also in der richtigen Reihenfolge und nicht über die
       Pfeiler davor.
     • Alle Muster hängen an Weltkoordinaten: wächst eine Mauer, wandert
       ihr Stein nicht.

   BAUPHASEN (o.bau 0 … 1, Einzelheiten in zustand())
     Grube unter z = 0 → Betonfundament mit Schalungsspuren → Mauern
     wachsen (Schnitt zeigt Mauerkern und Innenseite) → offener
     Dachstuhl mit Richtbaum → Eindecken von der Traufe zum First →
     Turmhelm (Gerüst des Helms, dann Schiefer) → Fenster, Läden,
     Türen, Treppe, Rinnen, Uhr, Kreuz → zuletzt der Schmuck.
     Gerüst, Kran, Bagger und Arbeiter malt baustelle.js, nicht dieses
     Modell.

   JAHRESZEITEN, TAGESZEIT, VARIANTEN
     Winter: Schnee auf allen Dächern, Gesimsen und Sohlbänken,
     Eiszapfen an der Traufe, Adventskranz mit Kerzen (nach Datum) und
     Tannengirlande am Portal, zwei Christbäume im Kübel, Herrnhuter
     Stern. Frühling: Efeu an Turm-Süd- und Westseite, Forsythie am
     Chor, Blumenbeete an der Südwand.
     Abend/Nacht: Bleiglas glüht farbig von innen, Zifferblatt
     beleuchtet, Turm im Flutlicht, Portallaterne bzw. Girlande,
     Lichtschein vor dem Portal auf dem Boden.
     o.saat: jede dritte Kirche trägt einen Wetterhahn statt des Kreuzes,
     jede fünfte ist aus gelbem statt rotem Sandstein.
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
  const lerp = (a, b, k) => a + (b - a) * k;
  const mischF = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
  function mitteVon(p) { let x = 0, y = 0, z = 0; for (const q of p) { x += q[0]; y += q[1]; z += q[2]; } return [x / p.length, y / p.length, z / p.length]; }
  function rgbS(c, a) { return a == null ? "rgb(" + (c[0] | 0) + "," + (c[1] | 0) + "," + (c[2] | 0) + ")" : "rgba(" + (c[0] | 0) + "," + (c[1] | 0) + "," + (c[2] | 0) + "," + a + ")"; }
  const hash = (a, b, c) => ST.hash2(a | 0, b | 0, (c | 0) + 11);

  /* =====================================================================
     BLICK — aus welcher Richtung sieht die Kamera das Modell?
     Wie tanne.js/laterne.js: Drehung des Objekts + Kameradrehung. Ohne
     Objekt (Vorschaubild der Bauleiste) malt oberflaeche.js mit 30°.
     ===================================================================== */
  function blickVon(o) {
    const ob = o && o.objekt;
    const gier = ob ? (ob.gier || 0) + ((ST.kamera && ST.kamera.dreh) || 0) * 90 : 30;
    const r = gier * RAD, c = Math.cos(r), s = Math.sin(r), a = ST.KZ * Math.SQRT1_2, L = ST.LICHT;
    return {
      gier: gier, c: c, s: s,
      /* Richtung zum Betrachter und zur Sonne, in Modellkoordinaten */
      e: [a * (c + s), a * (c - s), 0.5],
      L: [L[0] * c + L[1] * s, L[1] * c - L[0] * s, L[2]],
      /* Bildpunkt (je Meter, Ursprung = Modellmitte) */
      bild(p) { const x = p[0] * c - p[1] * s, y = p[0] * s + p[1] * c; return [(x - y) * ST.KX, (x + y) * ST.KY - p[2] * ST.KZ]; }
    };
  }

  /* =====================================================================
     KONVEXE KÖRPER
     ===================================================================== */
  /* Konvexe Hülle einer kleinen Punktwolke: jede Stützebene aus drei
     Punkten, gleiche Ebenen zusammengefasst, Punkte der Ebene im
     Gegenuhrzeigersinn (von außen gesehen) sortiert. */
  function huelle3(roh) {
    const P = [];
    for (const p of roh) { let neu = true; for (const q of P) if (Math.abs(q[0] - p[0]) < 1e-5 && Math.abs(q[1] - p[1]) < 1e-5 && Math.abs(q[2] - p[2]) < 1e-5) { neu = false; break; } if (neu) P.push(p); }
    const n = P.length, eps = 1e-5;
    const eb = [];
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
  /* Kanten einer Hülle */
  function kanten(H) {
    const k = [];
    for (const f of H.flaechen) for (let i = 0; i < f.pts.length; i++) k.push([f.pts[i], f.pts[(i + 1) % f.pts.length]]);
    return k;
  }
  /* Körper an einer Ebene abschneiden: behalten wird n·p ≤ d */
  function schneide(pts, n, d) {
    const H = huelle3(pts);
    const aus = [];
    for (const p of H.punkte) if (dot(n, p) <= d + 1e-6) aus.push(p);
    for (const [a, b] of kanten(H)) {
      const sa = dot(n, a) - d, sb = dot(n, b) - d;
      if ((sa < -1e-6 && sb > 1e-6) || (sa > 1e-6 && sb < -1e-6)) { const t = sa / (sa - sb); aus.push(add(a, mul(sub(b, a), t))); }
    }
    return aus;
  }

  function schattenGruppe(name) {
    if (/^(turm|helm|zwickel)/.test(name)) return "turm";
    if (/^(langhaus|dach-lh)/.test(name)) return "lh";
    if (/^(chor|dach-ch)/.test(name)) return "ch";
    if (/^(sakristei|dach-sa)/.test(name)) return "sa";
    if (/^pf-/.test(name)) return name.replace(/[ab][12]?$/, "");
    return null;
  }
  /* Ein Körper: Punkte + Maler. mal(fl) → { malen, … } oder null (unsichtbar) */
  function Werk(o, B) {
    this.o = o; this.B = B; this.k = []; this.figs = []; this.verbuende = {};
  }
  /* Verbund: viele kleine Glieder, die sich an den Knoten durchdringen
     (Dachstuhl, Helmgerüst). Für die Reihenfolge zählt der Verbund als EIN
     konvexer Körper (Hülle aus wenigen Punkten), innen nach Tiefe. */
  Werk.prototype.verbund = function (name, pts) { this.verbuende[name] = huelle3(pts); };
  Werk.prototype.koerper = function (name, pts, mal, opt) {
    opt = opt || {};
    if (opt.bisZ != null) {
      let zmax = -Infinity; for (const p of pts) zmax = Math.max(zmax, p[2]);
      if (opt.bisZ < zmax - 1e-4) {
        let zmin = Infinity; for (const p of pts) zmin = Math.min(zmin, p[2]);
        if (opt.bisZ <= zmin + 0.01) return null;
        pts = schneide(pts, [0, 0, 1], opt.bisZ);
        opt.gekappt = opt.bisZ;
      }
    }
    if (opt.schnitte) for (const [n, d] of opt.schnitte) { pts = schneide(pts, n, d); if (pts.length < 4) return null; }
    const H = huelle3(pts);
    if (H.flaechen.length < 4) return null;
    const K = Object.assign({ name: name, H: H, mal: mal, schatten: true, wirft: false, nach: null, gruppe: schattenGruppe(name) }, opt);
    if (/^(stufe|tstufe|rinne|rohr|hals|eis)/.test(name)) K.schatten = false;
    K.mitte = mitteVon(H.punkte);
    this.k.push(K);
    return K;
  };
  /* Figur (aufrecht gemalt) als kleiner Körper für die Reihenfolge */
  Werk.prototype.figur = function (name, fi, halb, opt) {
    const h = halb || [0.3, 0.3];
    const pts = [];
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const z of [fi.z || 0, (fi.z || 0) + (fi.hoehe || 1)]) pts.push([fi.x + sx * h[0], fi.y + sy * h[1], z]);
    const K = this.koerper(name, pts, () => null, Object.assign({ schatten: false }, opt || {}));
    if (K) K.figur = fi;
    return K;
  };

  /* Überdecken sich zwei konvexe Umrisse im Bild echt (mehr als eine Berührung)? */
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
  /* ---------------- Reihenfolge ---------------- */
  function ordnen(W) {
    const B = W.B, e = B.e;
    const liste = [], vb = {};
    for (const K of W.k) {
      K.tief = dot(K.mitte, e);
      if (K.verbund && W.verbuende[K.verbund]) {
        let N = vb[K.verbund];
        if (!N) { const H = W.verbuende[K.verbund]; N = vb[K.verbund] = { name: K.verbund, H: H, mitte: mitteVon(H.punkte), glieder: [] }; liste.push(N); }
        N.glieder.push(K);
      } else liste.push(K);
    }
    for (const K of liste) {
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      const pk = [];
      for (const p of K.H.punkte) { const q = B.bild(p); pk.push(q); if (q[0] < x0) x0 = q[0]; if (q[0] > x1) x1 = q[0]; if (q[1] < y0) y0 = q[1]; if (q[1] > y1) y1 = q[1]; }
      K.bb = [x0, y0, x1, y1];
      K.umriss2 = huelle2(pk);
      K.tief = dot(K.mitte, e);
      K.vor = []; K.grad = 0;
    }
    const eps = 2e-4;
    /* +1: B vor A (A zuerst malen), −1: A vor B, 0: unbekannt */
    const vergleich = (A, C) => {
      for (const f of A.H.flaechen.concat(A.extraEbenen || [])) {
        let alle = true;
        for (const p of C.H.punkte) if (dot(f.n, p) - f.d < -eps) { alle = false; break; }
        if (!alle) continue;
        const s = dot(f.n, e);
        if (s > 1e-5) return 1; if (s < -1e-5) return -1;
      }
      for (const f of C.H.flaechen.concat(C.extraEbenen || [])) {
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
      /* Nur wer sich im Bild wirklich überdeckt, bekommt eine Reihenfolge –
         sonst entstehen widersprüchliche Paare (Zyklen) */
      if (!ueberdecken(A.umriss2, C.umriss2)) continue;
      let r = 0;
      if (A.nach && A.nach.indexOf(C) >= 0) r = -1;
      else if (C.nach && C.nach.indexOf(A) >= 0) r = 1;
      else r = vergleich(A, C);
      if (r === 0) { r = A.tief <= C.tief ? 1 : -1; if (ST.kircheMessen) (ST.kircheMessen.rueckfall = ST.kircheMessen.rueckfall || []).push(A.name + "|" + C.name); }
      if (r > 0) { A.vor.push(C); C.grad++; } else { C.vor.push(A); A.grad++; }
    }
    /* Kahn: unter den bereiten immer den entferntesten zuerst */
    const bereit = liste.filter((K) => K.grad === 0).sort((a, b) => b.tief - a.tief);
    const aus = [];
    while (bereit.length) {
      const K = bereit.pop();
      aus.push(K);
      for (const V of K.vor) { V.grad--; if (V.grad === 0) { let i = bereit.length; while (i > 0 && bereit[i - 1].tief < V.tief) i--; bereit.splice(i, 0, V); } }
    }
    if (aus.length < n) {
      const rest = liste.filter((K) => aus.indexOf(K) < 0).sort((a, b) => a.tief - b.tief);
      if (ST.kircheMessen) { ST.kircheMessen.zyklus = rest.map((K) => K.name); ST.kircheMessen.graph = liste.map((K) => [K.name, K.vor.map((V) => V.name)]); }
      aus.push(...rest);
    }
    const voll = [];
    for (const K of aus) { if (K.glieder) voll.push(...K.glieder.sort((a, b) => a.tief - b.tief)); else voll.push(K); }
    return voll;
  }

  /* ---------------- Eigenschatten ----------------
     Für jede besonnte Fläche: welche Körper liegen (teilweise) vor ihrer
     Ebene und werfen entlang des Lichts einen Schatten auf sie? */
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
  function schattenAufFlaeche(W, fl, K, rahmen) {
    const L = W.B.L, n = fl.n;
    const ln = dot(L, n);
    if (ln < 0.03) return [];
    const polys = [];
    const [u, v] = rahmen;
    /* Umriss der Fläche (absolut) für einen schnellen Test */
    let a0 = Infinity, b0 = Infinity, a1 = -Infinity, b1 = -Infinity;
    for (const p of fl.pts) { const a = dot(p, u), b = dot(p, v); a0 = Math.min(a0, a); a1 = Math.max(a1, a); b0 = Math.min(b0, b); b1 = Math.max(b1, b); }
    for (const C of W.k) {
      if (C === K || !C.wirft) continue;
      if (C.wirftNur && C.wirftNur.indexOf(K) < 0) continue;
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

  /* Rahmen einer Fläche wie im Kern: v = Gefälle nach unten, u = v × n */
  function rahmenVon(n) {
    let v = [n[0] * n[2], n[1] * n[2], -1 + n[2] * n[2]];
    if (lang(v) < 1e-3) v = [0, 1, 0]; else v = nrm(v);
    const u = nrm(kreuz(v, n));
    return [u, v];
  }

  /* Zeitmessung je Körperart (nur zum Prüfen: STADT.kircheMessen = {}) */
  let MESSEN = null;
  /* ---------------- Ausgabe an den Kern ---------------- */
  function ausgeben(W, M) {
    MESSEN = ST.kircheMessen || null;
    /* Bodenschatten: Körper einer Gruppe werfen EINEN gemeinsamen Schatten
       (Hülle aller Punkte) – der Kern weicht jeden Schatten einzeln weich
       auf, das spart viel Rechenzeit und gibt saubere Schattenkanten. */
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
    /* Baugrube: alles unter der Erde, vor allen Körpern gemalt */
    if (W.grube && W.grube.length) {
      M.teil("grube", { ebene: 0.5, schatten: false, mitte: [0, 0, -2] });
      for (const gf of W.grube) flaecheAusgeben(M, W, gf.fl, { name: "grube" }, gf.m, gf.ebene);
    }
    const reihe = ordnen(W);
    reihe.forEach((K, rang) => {
      M.teil(K.name, { ebene: rang + 1, schatten: K.schatten, mitte: K.mitte });
      if (K.figur) { M.figur(K.figur); return; }
      for (const fl of K.H.flaechen) flaecheAusgeben(M, W, fl, K, dot(fl.n, W.B.e) > 0.002 ? K.mal(fl, K) : null);
    });
  }
  /* Eine ebene Fläche (Punkte, Normale, Abstand) an den Kern: Rahmen wie im
     Kern, gemalt wird in absoluten Flächenkoordinaten (A, B), damit Muster
     an der Welt haften. */
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
        const t0 = MESSEN ? performance.now() : 0;
        g.save(); g.translate(-A0, -B0);
        if (maler) maler(g, F, info);
        if (schatten.length) eigenschattenMalen(g, F, info);
        g.restore();
        if (MESSEN) { const k = K.name.replace(/[-0-9.]+.*$/, ""); MESSEN[k] = (MESSEN[k] || 0) + performance.now() - t0; }
      },
      danach: m.danach ? function (g, F) { g.save(); g.translate(-A0, -B0); m.danach(g, F, info); g.restore(); } : null,
      keinLicht: !!m.keinLicht, lichtExtra: m.lichtExtra
    }));
  }
  /* Eigenschatten: Verhältnis „ohne Sonne / mit Sonne" wie im Kern */
  function eigenschattenMalen(g, F, info) {
    const Z = F.zeit;
    const lf = ST.lichtFaktor(F.n, Z, F.flaeche.lichtExtra, F.jahr);
    const ls = ST.lichtFaktor(F.n, { amb: Z.amb, sonne: [0, 0, 0] }, F.flaeche.lichtExtra, F.jahr);
    const k = [0, 1, 2].map((i) => Math.round(255 * klemm(ls[i] / Math.max(0.01, lf[i]), 0, 1)));
    g.save();
    g.globalCompositeOperation = "multiply";
    g.fillStyle = "rgb(" + k.join(",") + ")";
    g.beginPath();
    for (const h of info.schatten) { g.moveTo(h[0][0], h[0][1]); for (let i = 1; i < h.length; i++) g.lineTo(h[i][0], h[i][1]); g.closePath(); }
    g.fill("nonzero");
    g.restore();
  }

  /* =====================================================================
     HAUPTMASSE
     ===================================================================== */
  const NEIG = Math.tan(57 * RAD);            // Dachneigung Langhaus und Chor
  const TU = {
    x0: -18, x1: -12, y: 3.0, h: 22.0, gz: 22.3, ge: 3.3, spitze: 35.0,
    g1: 9.0, g2: 17.3,                        // Gurtgesimse
    uhr: 18.3, uhrR: 0.72,                    // Zifferblätter
    glU: 19.25, glK: 20.45, glW: 2.5          // Glockenstube: Sohlbank, Kämpfer, Breite
  };
  TU.xm = (TU.x0 + TU.x1) / 2;
  const LH = { x0: -12, x1: 10, y: 5.0, tr: 9.0, dv: 0.34, ue: 0.5, ort: 0.4 };
  LH.zf = LH.tr + LH.y * NEIG;                 // Unterseite First
  LH.ze = LH.tr - LH.ue * NEIG;                // Unterkante Traufe
  const CH = { x0: 10, y: 3.8, tr: 8.4, dv: 0.32, ue: 0.45 };
  CH.xc = 12.93;
  CH.s = 2 * CH.y * Math.tan(22.5 * RAD);
  CH.xj = CH.xc + CH.s / 2;
  CH.xk = CH.xc + CH.y;
  CH.zf = CH.tr + CH.y * NEIG;
  CH.ze = CH.tr - CH.ue * NEIG;
  /* Sakristei im Winkel zwischen Chor und Langhaus (Nordseite), Pultdach */
  const SA = { x0: 10, x1: 13.7, y0: -6.5, y1: -CH.y, zi: 6.0, neig: Math.tan(35 * RAD), ue: 0.35, ort: 0.3, dv: 0.26 };
  SA.zA = SA.zi - (SA.y1 - SA.y0) * SA.neig;
  /* Südportal: Vorbau mit Giebel, Freitreppe */
  const PO = { x0: -5.6, x1: -1.9, y0: LH.y, y1: LH.y + 0.6, h: 5.0, hg: 6.2 };
  PO.xm = (PO.x0 + PO.x1) / 2;
  const FE = { w: 1.6, z0: 3.4, zk: 6.4, x: [-9.25, -3.75, 1.75, 7.25] };
  const ROSE = { z: 7.3, r: 0.5 };


  /* Grundriss des Chors (gegen den Uhrzeigersinn von oben), off = Überstand */
  function chorGrund(off) {
    const r = (CH.y + (off || 0)) / CH.y;
    const P = [[CH.xj, CH.y], [CH.xk, CH.s / 2], [CH.xk, -CH.s / 2], [CH.xj, -CH.y]].map(([x, y]) => [CH.xc + (x - CH.xc) * r, y * r]);
    return [[CH.x0, -(CH.y + (off || 0))], P[3], P[2], P[1], P[0], [CH.x0, CH.y + (off || 0)]];
  }
  /* Prisma: Grundriss (xy) von z0 bis z1 */
  function prisma(g2, z0, z1) { const p = []; for (const [x, y] of g2) { p.push([x, y, z0]); p.push([x, y, z1]); } return p; }
  function quaderP(x0, y0, z0, x1, y1, z1) { return prisma([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z0, z1); }

  /* ---------------- Farben (bei weißem Licht) ---------------- */
  const MOERTEL = [200, 192, 174];
  const BRUCH = [[184, 168, 142], [172, 154, 128], [160, 143, 118], [194, 180, 154], [178, 152, 122], [152, 138, 116], [188, 164, 132], [166, 146, 118]];
  const WERK = { rot: [168, 100, 80], gelb: [194, 170, 124] };
  const SCHIEFER = [70, 80, 96];
  const KUPFER = [98, 158, 136];
  const GOLD = [218, 176, 86];
  const SCHNEE = [240, 244, 251];
  const EICHE = [104, 72, 46];
  const hellF = (c, k) => (k >= 0 ? mischF(c, [255, 255, 255], k) : mischF(c, [0, 0, 0], -k));
  const zuf = (n) => ST.zufall((n >>> 0) || 1);

  /* ---------------- kleine Helfer für Maler ---------------- */
  /* Versatz eines Punkts in der Tiefe d hinter der Fläche (Blickwinkel) */
  function tief(I, d) {
    const e = I.W.B.e, en = Math.max(0.14, dot(e, I.n));
    return [d * dot(e, I.u) / en, d * dot(e, I.v) / en];
  }
  function lp(F, I, A, B, r, farbe, k) { if (F.leuchtPunkt) F.leuchtPunkt(A - I.A0, B - I.B0, r, farbe, k); }
  /* Licht der Fläche (für Flächen ohne Kernlicht) */
  function lichtVon(F, extra) { return ST.lichtFaktor(F.n, F.zeit, extra || 0, F.jahr); }
  function belicht(c, lf, a) { return rgbS([Math.min(255, c[0] * lf[0]), Math.min(255, c[1] * lf[1]), Math.min(255, c[2] * lf[2])], a); }


  /* Rauschen über wenige Grundmuster (jedes Muster kostet beim ersten Mal
     Rechenzeit): die Saat verschiebt nur, statt ein neues Muster zu bauen */
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

  /* =====================================================================
     STEIN
     ===================================================================== */
  /* Lagen des Bruchsteinmauerwerks: einmal für alle Wände (Weltmaß) */
  const REIHEN = (function () { const z = [0]; for (let i = 0; z[i] < 48; i++) z.push(z[i] + 0.2 + 0.15 * hash(i, 3, 5)); return z; })();
  function steinPfad(p, a, b, c, d, j, rs) {
    const k = Math.min(0.05, (d - c) * 0.26, (b - a) * 0.2);
    const J = (n) => (hash(rs, n, 91) - 0.5) * 2 * j;
    p.moveTo(a + k + J(1), c + J(2)); p.lineTo(b - k + J(3), c + J(4)); p.lineTo(b + J(5), c + k + J(6)); p.lineTo(b + J(7), d - k + J(8));
    p.lineTo(b - k + J(9), d + J(10)); p.lineTo(a + k + J(11), d + J(12)); p.lineTo(a + J(13), d - k + J(14)); p.lineTo(a + J(15), c + k + J(16)); p.closePath();
  }
  /* Bruchsteinmauerwerk in (A, B) = (waagrecht, −Höhe) */
  function bruchstein(g, F, I, x0, y0, x1, y1, saat) {
    const px = F.px;
    g.fillStyle = rgbS(MOERTEL); g.fillRect(x0, y0, x1 - x0, y1 - y0);
    if (px < 5.5) {
      g.fillStyle = rgbS([174, 158, 132], 0.85); g.fillRect(x0, y0, x1 - x0, y1 - y0);
      rausch(g, x0, y0, x1 - x0, y1 - y0, 3.4, 0.22, saat, 3);
      return;
    }
    const zB = -y1, zT = -y0;
    let r = 0; while (r < REIHEN.length - 2 && REIHEN[r + 1] < zB) r++;
    const fein = px >= 26, grob = px < 12;
    const alle = new Path2D(), eimer = [];
    for (let i = 0; i < 8; i++) eimer.push(new Path2D());
    const m = Math.max(0.016, 0.8 / px);
    for (; r < REIHEN.length - 1 && REIHEN[r] < zT; r++) {
      const za = REIHEN[r], zb = REIHEN[r + 1];
      const c = grob ? 1.1 : 0.84, off = hash(r, 7, saat) * c;
      const i0 = Math.floor((x0 - off) / c) - 1, i1 = Math.floor((x1 - off) / c) + 1;
      const fuge = (i) => off + i * c + (hash(i, r, saat) - 0.5) * 0.42;
      for (let i = i0; i <= i1; i++) {
        const a = fuge(i), b = fuge(i + 1);
        const teile = !grob && hash(i, r, saat + 1) < 0.36 ? [a, a + (b - a) * (0.35 + 0.3 * hash(i, r, saat + 2)), b] : [a, b];
        for (let k = 0; k < teile.length - 1; k++) {
          const sa = teile[k] + m / 2, sb = teile[k + 1] - m / 2;
          if (sb < x0 - 0.1 || sa > x1 + 0.1) continue;
          /* Unebene Lagen: Steine mal etwas niedriger */
          const ya = -zb + m / 2 + (fein ? hash(i * 5 + k, r, saat + 8) * 0.03 : 0), yb = -za - m / 2;
          const hk = hash(i * 3 + k, r, saat + 3);
          const p = eimer[(hk * 8) | 0];
          if (fein) { steinPfad(p, sa, sb, ya, yb, 0.012, (i * 7 + k) * 131 + r); steinPfad(alle, sa, sb, ya, yb, 0.012, (i * 7 + k) * 131 + r); }
          else { p.rect(sa, ya, sb - sa, yb - ya); alle.rect(sa, ya, sb - sa, yb - ya); }
        }
      }
    }
    const sv = F.schatten ? F.schatten(0.022) : null;
    if (sv && !grob) { g.save(); g.translate(sv[0], sv[1]); g.fillStyle = "rgba(58,50,42,0.5)"; g.fill(alle); g.restore(); }
    for (let i = 0; i < 8; i++) { g.fillStyle = rgbS(BRUCH[i]); g.fill(eimer[i]); }
    if (fein && sv) {
      /* Lichtkante: die der Sonne zugewandte Steinkante hellt auf */
      g.save(); g.globalCompositeOperation = "screen"; g.translate(-sv[0] * 0.35, -sv[1] * 0.35);
      g.strokeStyle = "rgba(120,110,90,0.35)"; g.lineWidth = Math.max(0.006, 0.7 / px); g.stroke(alle); g.restore();
    }
    rausch(g, x0, y0, x1 - x0, y1 - y0, 3.6, 0.22, saat, 4);
    if (px > 22) rausch(g, x0, y0, x1 - x0, y1 - y0, 0.55, 0.16, saat + 5, 3);
  }

  /* Quadermauerwerk (Werkstein) — Strebepfeiler, Portal, Sockel */
  function quader(g, F, I, x0, y0, x1, y1, saat, opt) {
    opt = opt || {};
    const c = opt.farbe || I.W.werk, px = F.px, lage = opt.lage || 0.4, z0 = opt.z0 || 0;
    g.fillStyle = rgbS(mischF(c, [230, 220, 204], 0.42)); g.fillRect(x0, y0, x1 - x0, y1 - y0);
    if (px * lage < 3.2) {
      g.fillStyle = rgbS(c, 0.9); g.fillRect(x0, y0, x1 - x0, y1 - y0);
      rausch(g, x0, y0, x1 - x0, y1 - y0, 2.8, 0.2, saat, 3);
      return;
    }
    const f = Math.max(0.012, 0.75 / px);
    const zB = -y1, zT = -y0;
    const r0 = Math.floor((zB - z0) / lage), r1 = Math.ceil((zT - z0) / lage);
    const alle = new Path2D(), eimer = [];
    for (let i = 0; i < 6; i++) eimer.push(new Path2D());
    const cl = opt.block || 0.95;
    for (let r = r0; r < r1; r++) {
      const ya = -(z0 + (r + 1) * lage) + f / 2, yb = -(z0 + r * lage) - f / 2;
      const off = hash(r, 17, saat) * cl;
      const i0 = Math.floor((x0 - off) / cl) - 1, i1 = Math.floor((x1 - off) / cl) + 1;
      const fuge = (i) => off + i * cl + (hash(i, r, saat + 4) - 0.5) * cl * 0.36;
      for (let i = i0; i <= i1; i++) {
        const a = fuge(i) + f / 2, b = fuge(i + 1) - f / 2;
        if (b < x0 - 0.05 || a > x1 + 0.05) continue;
        const k = (hash(i, r, saat + 6) * 6) | 0;
        eimer[k].rect(a, ya, b - a, yb - ya); alle.rect(a, ya, b - a, yb - ya);
      }
    }
    const sv = F.schatten ? F.schatten(0.012) : null;
    if (sv && px > 14) { g.save(); g.translate(sv[0], sv[1]); g.fillStyle = "rgba(60,40,34,0.42)"; g.fill(alle); g.restore(); }
    for (let i = 0; i < 6; i++) { g.fillStyle = rgbS(hellF(c, (i - 2.5) * 0.045)); g.fill(eimer[i]); }
    rausch(g, x0, y0, x1 - x0, y1 - y0, 2.6, 0.2, saat + 2, 4);
    if (px > 24) rausch(g, x0, y0, x1 - x0, y1 - y0, 0.38, 0.14, saat + 9, 3);
    if (px > 55) {
      /* Scharrierung: feine senkrechte Hiebe des Steinmetzen */
      g.strokeStyle = rgbS(hellF(c, -0.25), 0.16); g.lineWidth = Math.max(0.003, 0.6 / px);
      g.beginPath();
      for (let x = Math.ceil(x0 / 0.018) * 0.018; x < x1; x += 0.018) { g.moveTo(x, y0); g.lineTo(x + 0.004, y1); }
      g.stroke();
    }
  }
  /* Eckquader: abwechselnd lange und kurze Binder an einer Kante */
  function eckquader(g, F, I, a, dir, zB, zT, saat) {
    const c = I.W.werk, px = F.px, lage = 0.42;
    if (px < 4) return;
    const f = Math.max(0.012, 0.75 / px);
    const sv = F.schatten ? F.schatten(0.015) : null;
    const pf = new Path2D(), eimer = [new Path2D(), new Path2D(), new Path2D()];
    for (let r = Math.max(0, Math.floor(zB / lage)); r * lage < zT; r++) {
      const L = (r % 2 ? 0.5 : 0.84) + (hash(r, 5, saat) - 0.5) * 0.1;
      const za = Math.max(zB, r * lage), zb = Math.min(zT, (r + 1) * lage);
      if (zb - za < 0.02) continue;
      const xa = dir > 0 ? a : a - L, xb = dir > 0 ? a + L : a;
      const rect = [xa + (dir > 0 ? 0 : f / 2), -zb + f / 2, L - f / 2, zb - za - f];
      pf.rect(...rect); eimer[(hash(r, 9, saat) * 3) | 0].rect(...rect);
    }
    if (sv) { g.save(); g.translate(sv[0], sv[1]); g.fillStyle = "rgba(50,40,36,0.32)"; g.fill(pf); g.restore(); }
    for (let i = 0; i < 3; i++) { g.fillStyle = rgbS(hellF(c, (i - 1) * 0.06)); g.fill(eimer[i]); }
  }
  /* Sockel mit Schräge */
  function sockel(g, F, I, x0, x1, zS, saat) {
    const c = hellF(I.W.werk, -0.06);
    quader(g, F, I, x0, -zS + 0.13, x1, 0.02, saat + 70, { lage: (zS - 0.13) / 2, farbe: c, block: 1.1 });
    /* Sockelschräge: zeigt nach oben, hell */
    g.fillStyle = rgbS(hellF(I.W.werk, 0.16)); g.fillRect(x0, -zS, x1 - x0, 0.1);
    g.fillStyle = rgbS(hellF(I.W.werk, -0.3), 0.8); g.fillRect(x0, -zS + 0.1, x1 - x0, 0.03);
    /* Spritzwasser, Algen im Frühling */
    const gr = g.createLinearGradient(0, 0, 0, -0.7);
    gr.addColorStop(0, I.W.winter ? "rgba(60,58,62,0.32)" : "rgba(70,84,50,0.36)"); gr.addColorStop(1, "rgba(70,70,60,0)");
    g.fillStyle = gr; g.fillRect(x0, -0.7, x1 - x0, 0.7);
  }
  /* Gurtgesims (Band mit Wasserschlag): z = Oberkante */
  function gesims(g, F, I, x0, x1, z, h) {
    const c = I.W.werk, y = -z;
    const sv = F.schatten ? F.schatten(0.13) : null;
    if (sv && sv[1] > 0) {
      g.fillStyle = "rgba(24,20,30,0.34)";
      g.beginPath(); g.moveTo(x0, y + h); g.lineTo(x1, y + h); g.lineTo(x1 + sv[0], y + h + sv[1]); g.lineTo(x0 + sv[0], y + h + sv[1]); g.closePath(); g.fill();
    } else {
      const gr = g.createLinearGradient(0, y + h, 0, y + h + 0.25); gr.addColorStop(0, "rgba(20,20,30,0.25)"); gr.addColorStop(1, "rgba(20,20,30,0)");
      g.fillStyle = gr; g.fillRect(x0, y + h, x1 - x0, 0.25);
    }
    g.fillStyle = rgbS(hellF(c, 0.2)); g.fillRect(x0, y, x1 - x0, h * 0.34);
    g.fillStyle = rgbS(c); g.fillRect(x0, y + h * 0.34, x1 - x0, h * 0.5);
    g.fillStyle = rgbS(hellF(c, -0.32)); g.fillRect(x0, y + h * 0.84, x1 - x0, h * 0.16);
    if (F.px * 0.9 > 6) {
      g.fillStyle = rgbS(hellF(c, -0.35), 0.55);
      for (let x = Math.ceil(x0 / 1.1) * 1.1; x < x1; x += 1.1) g.fillRect(x, y, Math.max(0.01, 0.7 / F.px), h);
    }
    rausch(g, x0, y, x1 - x0, h, 1.5, 0.2, 33, 3);
    if (I.W.winter) { g.fillStyle = rgbS(SCHNEE); schneeKante(g, x0, x1, y, 0.06, 71); }
  }
  /* weiche Schneekante auf einem Sims (oben bei y) */
  function schneeKante(g, x0, x1, y, dick, saat) {
    g.beginPath(); g.moveTo(x0, y + 0.01);
    for (let x = x0; x <= x1 + 0.12; x += 0.12) g.lineTo(x, y - dick * (0.55 + 0.45 * hash(Math.round(x * 8), saat, 1)));
    g.lineTo(x1, y + 0.012); g.closePath(); g.fill();
  }
  /* Traufgesims unter dem Dach: Kehle */
  function traufgesims(g, F, I, x0, x1, zT) {
    const c = I.W.werk, y = -zT, h = 0.32;
    g.fillStyle = rgbS(hellF(c, -0.1)); g.fillRect(x0, y, x1 - x0, h);
    const gr = g.createLinearGradient(0, y, 0, y + h);
    gr.addColorStop(0, "rgba(30,24,24,0.55)"); gr.addColorStop(0.55, "rgba(30,24,24,0.12)"); gr.addColorStop(0.8, "rgba(255,240,220,0.1)"); gr.addColorStop(1, "rgba(30,24,24,0.3)");
    g.fillStyle = gr; g.fillRect(x0, y, x1 - x0, h);
  }

  /* =====================================================================
     SPITZBOGEN, MASSWERK, GLAS
     ===================================================================== */
  function spitzH(w, k) { const r = w * (k || 1); return Math.sqrt(Math.max(0, r * r - (r - w / 2) * (r - w / 2))); }
  function spitz(p, x, bS, w, bU, k) {
    const r = w * (k || 1), h = spitzH(w, k);
    p.moveTo(x, bU); p.lineTo(x, bS);
    p.arc(x + r, bS, r, Math.PI, Math.atan2(-h, w / 2 - r) + 2 * Math.PI);
    p.arc(x + w - r, bS, r, Math.atan2(-h, r - w / 2), 0);
    p.lineTo(x + w, bU); p.closePath();
  }
  function spitzLinie(p, x, bS, w, k) {
    const r = w * (k || 1), h = spitzH(w, k);
    p.moveTo(x, bS);
    p.arc(x + r, bS, r, Math.PI, Math.atan2(-h, w / 2 - r) + 2 * Math.PI);
    p.arc(x + w - r, bS, r, Math.atan2(-h, r - w / 2), 0);
  }
  /* Pass (Drei-, Vier-, Sechspass): äußerer Umriss aus Kreisbögen mit Nasen */
  function pass(p, cx, cy, r, n, dreh) {
    const rr = r * (n === 3 ? 0.5 : n === 4 ? 0.45 : 0.36), d = r - rr, ph = Math.PI / n;
    const rho = d * Math.cos(ph) + Math.sqrt(Math.max(0, rr * rr - d * d * Math.sin(ph) * Math.sin(ph)));
    for (let i = 0; i < n; i++) {
      const a = dreh + i * 2 * ph, cxi = cx + Math.cos(a) * d, cyi = cy + Math.sin(a) * d;
      const p0 = [cx + Math.cos(a - ph) * rho, cy + Math.sin(a - ph) * rho], p1 = [cx + Math.cos(a + ph) * rho, cy + Math.sin(a + ph) * rho];
      const w0 = Math.atan2(p0[1] - cyi, p0[0] - cxi); let w1 = Math.atan2(p1[1] - cyi, p1[0] - cxi);
      while (w1 < w0) w1 += 2 * Math.PI;
      if (i === 0) p.moveTo(p0[0], p0[1]);
      p.arc(cxi, cyi, rr, w0, w1);
    }
    p.closePath();
  }
  /* Maßwerk einer zwei- oder einbahnigen Öffnung */
  function masswerk(p, x, bS, w, bU, n, fein) {
    spitz(p, x, bS, w, bU);
    if (n === 2) {
      const wl = w / 2;
      spitzLinie(p, x, bS, wl); spitzLinie(p, x + wl, bS, wl);
      p.moveTo(x + wl, bS - spitzH(wl)); p.lineTo(x + wl, bU);
      const r = w / 4, cy = bS - w * 0.559;
      p.moveTo(x + w / 2 + r, cy); p.arc(x + w / 2, cy, r, 0, 2 * Math.PI);
      if (fein) {
        pass(p, x + w / 2, cy, r * 0.9, 4, Math.PI / 4);
        for (let i = 0; i < 2; i++) pass(p, x + (i + 0.5) * wl, bS - spitzH(wl) * 0.42, wl * 0.3, 3, -Math.PI / 2);
      }
    } else if (fein) {
      pass(p, x + w / 2, bS - spitzH(w) * 0.4, w * 0.3, 3, -Math.PI / 2);
    }
  }
  const BUNT = [[52, 84, 196], [186, 36, 48], [226, 164, 56], [52, 140, 86], [124, 64, 164], [60, 120, 204], [214, 92, 40]];
  /* Bleiglas am Tag: dunkel, Rauten aus Blei, ein Hauch Farbe, Himmel */
  function glasTag(g, F, x, bS, w, bU, saat) {
    const px = F.px, bA = bS - spitzH(w), tag = 1 - F.nacht;
    const gr = g.createLinearGradient(x, bA, x + w * 0.4, bU);
    gr.addColorStop(0, "rgb(" + [84, 98, 118].map((v) => Math.round(v * (0.55 + 0.45 * tag))).join(",") + ")");
    gr.addColorStop(0.5, "rgb(44,50,64)"); gr.addColorStop(1, "rgb(30,33,44)");
    g.fillStyle = gr; g.fillRect(x - 0.1, bA - 0.1, w + 0.2, bU - bA + 0.2);
    if (px * w > 22) {
      const rng = zuf(saat);
      const d = Math.max(0.13, 2.6 / px);
      for (let yy = bA; yy < bU; yy += d * 1.3) for (let xx = x; xx < x + w; xx += d) {
        if (rng() > 0.3) continue;
        const c = BUNT[(rng() * BUNT.length) | 0];
        g.fillStyle = rgbS(c, (0.12 + 0.12 * rng()) * (0.4 + 0.6 * tag)); g.fillRect(xx, yy, d, d * 1.3);
      }
      g.strokeStyle = "rgba(16,16,20,0.55)"; g.lineWidth = Math.max(0.007, 0.65 / px);
      g.beginPath();
      const H = bU - bA;
      for (let s = -H; s < w + H; s += d) { g.moveTo(x + s, bU); g.lineTo(x + s + H * 0.62, bA); g.moveTo(x + s, bA); g.lineTo(x + s + H * 0.62, bU); }
      g.stroke();
    }
    /* Himmelsspiegelung */
    g.fillStyle = "rgba(210,224,244," + (0.05 + 0.12 * tag).toFixed(3) + ")";
    g.beginPath(); g.moveTo(x + w * 0.1, bU); g.lineTo(x + w * 0.62, bA); g.lineTo(x + w * 0.85, bA); g.lineTo(x + w * 0.33, bU); g.closePath(); g.fill();
  }
  /* Bleiglas bei Nacht (in „danach"): innen brennt Licht. Aufbau wie in
     einer echten Dorfkirche: Rautenfeld aus hellem, leicht gelblichem
     Glas (Grisaille), farbige Randborte, je Bahn zwei Medaillons (tiefblau
     mit goldenem und rotem Innenfeld), das Maßwerk oben rubinrot/blau. */
  function glasNacht(g, F, x, bS, w, bU, saat, n, k) {
    const a = F.nacht * (k == null ? 1 : k);
    if (a < 0.02) return;
    const bA = bS - spitzH(w), h = bU - bA, px = F.px;
    const A = (v) => (v * a).toFixed(3);
    /* Grundschein: unten wärmer (Kerzen), oben kühler */
    const gr = g.createLinearGradient(0, bA, 0, bU);
    gr.addColorStop(0, "rgba(206,150,210," + A(0.85) + ")"); gr.addColorStop(0.3, "rgba(250,206,150," + A(0.9) + ")"); gr.addColorStop(1, "rgba(255,196,120," + A(0.95) + ")");
    g.fillStyle = gr; g.fillRect(x - 0.1, bA - 0.1, w + 0.2, h + 0.2);
    if (px * w < 12) return;
    const nb = n || 1, wl = w / nb, bo = wl * 0.13;
    const blei = "rgba(38,26,24," + A(0.85) + ")", lw = Math.max(0.008, 0.8 / px);
    for (let i = 0; i < nb; i++) {
      const xi = x + i * wl;
      g.save(); g.beginPath(); spitz(g, xi, bS, wl, bU); g.clip();
      /* Randborte: rubinrot und blau im Wechsel */
      for (let yy = bA - 0.2, m = 0; yy < bU; yy += 0.3, m++) { g.fillStyle = m % 2 ? "rgba(60,90,220," + A(0.95) + ")" : "rgba(214,40,52," + A(0.95) + ")"; g.fillRect(xi - 0.1, yy, wl + 0.2, 0.3); }
      /* Rautenfeld */
      const ix = xi + bo, iw = wl - 2 * bo;
      g.beginPath(); spitz(g, ix, bS, iw, bU - bo * 0.6); g.save(); g.clip();
      const gf = g.createLinearGradient(0, bA, 0, bU);
      gf.addColorStop(0, "rgba(236,214,190," + A(0.95) + ")"); gf.addColorStop(1, "rgba(255,226,160," + A(1) + ")");
      g.fillStyle = gf; g.fillRect(ix - 0.1, bA - 0.1, iw + 0.2, h + 0.2);
      if (px * iw > 16) {
        const d = Math.max(0.12, iw / 3);
        g.strokeStyle = blei; g.lineWidth = lw; g.beginPath();
        for (let t = -h; t < iw + h; t += d) { g.moveTo(ix + t, bU); g.lineTo(ix + t + h * 0.6, bA); g.moveTo(ix + t, bA); g.lineTo(ix + t + h * 0.6, bU); }
        g.stroke();
      }
      /* Medaillons */
      for (const [t, innen] of [[0.42, [236, 176, 60]], [0.72, [206, 44, 56]]]) {
        const cx = ix + iw / 2, cy = bA + h * t, r = iw * 0.44;
        g.fillStyle = "rgba(44,70,206," + A(1) + ")"; g.beginPath(); g.arc(cx, cy, r, 0, 2 * Math.PI); g.fill();
        g.fillStyle = rgbS(innen, A(1)); g.beginPath(); g.arc(cx, cy, r * 0.66, 0, 2 * Math.PI); g.fill();
        if (px * r > 10) {
          /* angedeutete Figur: Heiligenschein und Gewand */
          g.fillStyle = "rgba(255,240,190," + A(1) + ")"; g.beginPath(); g.arc(cx, cy - r * 0.28, r * 0.17, 0, 2 * Math.PI); g.fill();
          g.fillStyle = "rgba(90,40,120," + A(0.9) + ")"; g.beginPath(); g.moveTo(cx, cy - r * 0.12); g.lineTo(cx + r * 0.3, cy + r * 0.55); g.lineTo(cx - r * 0.3, cy + r * 0.55); g.closePath(); g.fill();
        }
        g.strokeStyle = blei; g.lineWidth = lw * 1.4; g.beginPath(); g.arc(cx, cy, r, 0, 2 * Math.PI); g.moveTo(cx + r * 0.66, cy); g.arc(cx, cy, r * 0.66, 0, 2 * Math.PI); g.stroke();
      }
      g.restore();
      g.strokeStyle = blei; g.lineWidth = lw * 1.4; g.beginPath(); spitz(g, ix, bS, iw, bU - bo * 0.6); g.stroke();
      g.restore();
    }
    /* Maßwerk oben: Kreis rubinrot, Pässe blau */
    if (nb === 2) {
      const r = w / 4, cy = bS - w * 0.559;
      const gm = g.createRadialGradient(x + w / 2, cy, 0, x + w / 2, cy, r);
      gm.addColorStop(0, "rgba(255,226,140," + A(1) + ")"); gm.addColorStop(0.5, "rgba(220,50,60," + A(0.95) + ")"); gm.addColorStop(1, "rgba(60,80,220," + A(0.95) + ")");
      g.fillStyle = gm; g.beginPath(); g.arc(x + w / 2, cy, r, 0, 2 * Math.PI); g.fill();
    }
  }

  /* Maßwerkfenster mit Gewände, Laibung, Glas, Sohlbank.
     op = { a (Mitte), w, z0 (Sohlbank), zk (Kämpfer), bahnen, tiefe } */
  function masswerkFenster(g, F, I, op) {
    const px = F.px, w = op.w, x = op.a - w / 2, bU = -op.z0, bS = -op.zk, gw = op.gew || 0.17, c = I.W.werk;
    const bA = bS - spitzH(w);
    const zu = I.W.bau == null ? 1 : op.glas;
    /* Gewände */
    g.fillStyle = rgbS(c); g.beginPath(); spitz(g, x - gw, bS, w + 2 * gw, bU + 0.04); g.fill();
    if (px * gw > 3) {
      g.save(); g.beginPath(); spitz(g, x - gw, bS, w + 2 * gw, bU + 0.04); g.clip();
      g.strokeStyle = rgbS(hellF(c, -0.38), 0.6); g.lineWidth = Math.max(0.008, 0.7 / px);
      g.beginPath();
      for (let z = op.z0 + 0.45; z < op.zk; z += 0.5) { g.moveTo(x - gw, -z); g.lineTo(x, -z); g.moveTo(x + w, -z); g.lineTo(x + w + gw, -z); }
      for (const t of [0.3, 0.62]) for (const s of [-1, 1]) {
        const cxr = s < 0 ? x + w : x, ang = s < 0 ? Math.PI + t * Math.PI / 3 : -t * Math.PI / 3;
        g.moveTo(cxr + Math.cos(ang) * w, bS + Math.sin(ang) * w); g.lineTo(cxr + Math.cos(ang) * (w + gw * 1.6), bS + Math.sin(ang) * (w + gw * 1.6));
      }
      g.stroke();
      rausch(g, x - gw, bA - gw, w + 2 * gw, bU - bA + gw, 1.2, 0.2, 51, 3);
      g.restore();
      /* Fase: schmale Schräge am inneren Rand */
      g.lineWidth = gw * 0.34; g.strokeStyle = rgbS(hellF(c, 0.12), 0.7);
      g.beginPath(); spitz(g, x - gw * 0.17, bS, w + gw * 0.34, bU); g.stroke();
    }
    g.save();
    g.beginPath(); spitz(g, x, bS, w, bU); g.clip();
    g.fillStyle = rgbS(hellF(c, -0.18)); g.fillRect(x - 0.2, bA - 0.2, w + 0.4, bU - bA + 0.4);
    const tv = tief(I, op.tiefe || 0.3);
    g.translate(tv[0], tv[1]);
    if (zu) {
      g.save(); g.beginPath(); spitz(g, x, bS, w, bU); g.clip();
      glasTag(g, F, x, bS, w, bU, op.saat || 3);
      g.restore();
      if (px * w > 9) {
        const p = new Path2D();
        masswerk(p, x, bS, w, bU, op.bahnen || 2, px * w > 60);
        const st = Math.max(0.05, w * 0.045);
        const s2 = F.schatten ? F.schatten(0.06) : null;
        if (s2) { g.save(); g.translate(s2[0], s2[1]); g.lineWidth = st; g.strokeStyle = "rgba(8,10,16,0.5)"; g.stroke(p); g.restore(); }
        g.lineWidth = st; g.strokeStyle = rgbS(hellF(c, 0.1)); g.stroke(p);
        if (px * st > 3) { g.lineWidth = st * 0.3; g.strokeStyle = rgbS(hellF(c, 0.35), 0.5); g.save(); g.translate(-st * 0.18, -st * 0.18); g.stroke(p); g.restore(); }
      } else if (px * w > 4) { g.fillStyle = rgbS(c); g.fillRect(x + w / 2 - 0.05, bA + w * 0.4, 0.1, bU - bA); }
    } else {
      /* Rohbau: Öffnung noch leer – dunkler Innenraum */
      g.fillStyle = "rgb(26,24,26)"; g.fillRect(x - 0.3, bA - 0.3, w + 0.6, bU - bA + 0.6);
    }
    g.translate(-tv[0], -tv[1]);
    const sv = F.schatten ? F.schatten(op.tiefe || 0.3) : null;
    if (sv) { g.beginPath(); g.rect(x - 1, bA - 1, w + 2, bU - bA + 2); spitz(g, x + sv[0], bS + sv[1], w, bU + sv[1]); g.fillStyle = "rgba(10,12,26,0.42)"; g.fill("evenodd"); }
    else { g.fillStyle = "rgba(10,12,26,0.16)"; g.fillRect(x - 1, bA - 1, w + 2, bU - bA + 2); }
    g.restore();
    /* Sohlbank mit Wasserschlag */
    g.fillStyle = rgbS(hellF(c, 0.2)); g.fillRect(x - gw - 0.05, bU, w + 2 * gw + 0.1, 0.07);
    g.fillStyle = rgbS(hellF(c, -0.25)); g.fillRect(x - gw - 0.05, bU + 0.07, w + 2 * gw + 0.1, 0.05);
    const s3 = F.schatten ? F.schatten(0.1) : null;
    if (s3 && s3[1] > 0) { g.fillStyle = "rgba(20,18,30,0.28)"; g.fillRect(x - gw - 0.05 + s3[0], bU + 0.12, w + 2 * gw + 0.1, s3[1] * 0.7); }
    if (!I.W.winter) PI.schliere(g, x - gw + 0.1, bU + 0.12, w + 2 * gw - 0.2, 0.9, F);
    if (I.W.winter) { g.fillStyle = rgbS(SCHNEE); schneeKante(g, x - gw - 0.05, x + w + gw + 0.05, bU + 0.01, 0.09, (op.a * 10) | 0); }
  }
  function masswerkNacht(g, F, I, op) {
    if (F.nacht < 0.02 || (I.W.bau != null && !op.glas)) return;
    const w = op.w, x = op.a - w / 2, bU = -op.z0, bS = -op.zk;
    g.save(); g.beginPath(); spitz(g, x, bS, w, bU); g.clip();
    const tv = tief(I, op.tiefe || 0.3);
    g.translate(tv[0], tv[1]);
    g.save(); g.beginPath(); spitz(g, x, bS, w, bU); g.clip();
    glasNacht(g, F, x, bS, w, bU, op.saat || 3, op.bahnen || 2, op.k);
    g.restore();
    if (F.px * w > 9) {
      const p = new Path2D(); masswerk(p, x, bS, w, bU, op.bahnen || 2, F.px * w > 60);
      g.lineWidth = Math.max(0.05, w * 0.045); g.strokeStyle = "rgba(40,28,26," + (0.85 * F.nacht).toFixed(3) + ")"; g.stroke(p);
    }
    g.restore();
    lp(F, I, op.a, bS - spitzH(w) * 0.3, Math.max(1.2, w * 1.1), "190,150,255", 0.3 * (op.k == null ? 1 : op.k));
  }
  /* Rundfenster (Rosette) mit Sechspass */
  function rosette(g, F, I, op) {
    const c = I.W.werk, cx = op.a, cy = -op.z, R = op.r, px = F.px;
    g.fillStyle = rgbS(c); g.beginPath(); g.arc(cx, cy, R + 0.15, 0, 2 * Math.PI); g.fill();
    if (px * R > 6) { g.strokeStyle = rgbS(hellF(c, -0.35), 0.6); g.lineWidth = Math.max(0.008, 0.7 / px); g.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; g.moveTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R); g.lineTo(cx + Math.cos(a) * (R + 0.15), cy + Math.sin(a) * (R + 0.15)); } g.stroke(); }
    g.save(); g.beginPath(); g.arc(cx, cy, R, 0, 2 * Math.PI); g.clip();
    g.fillStyle = rgbS(hellF(c, -0.2)); g.fillRect(cx - R - 0.2, cy - R - 0.2, 2 * R + 0.4, 2 * R + 0.4);
    const tv = tief(I, 0.25); g.translate(tv[0], tv[1]);
    if (I.W.bau == null || op.glas) {
      glasTag(g, F, cx - R, cy + R * 0.2, 2 * R, cy + R, 17);
      g.fillStyle = "rgb(36,40,52)"; g.beginPath(); g.arc(cx, cy, R, 0, 2 * Math.PI); g.fill();
      glasTag(g, F, cx - R, cy - R + 2 * R * 0.866, 2 * R, cy + R, 19);
      if (px * R > 5) {
        const p = new Path2D(); p.arc(cx, cy, R * 0.98, 0, 2 * Math.PI); pass(p, cx, cy, R * 0.9, 6, -Math.PI / 2);
        p.moveTo(cx + R * 0.2, cy); p.arc(cx, cy, R * 0.2, 0, 2 * Math.PI);
        g.lineWidth = Math.max(0.045, R * 0.08); g.strokeStyle = rgbS(hellF(c, 0.1)); g.stroke(p);
      }
    } else { g.fillStyle = "rgb(26,24,26)"; g.fillRect(cx - R - 0.3, cy - R - 0.3, 2 * R + 0.6, 2 * R + 0.6); }
    g.translate(-tv[0], -tv[1]);
    const sv = F.schatten ? F.schatten(0.25) : null;
    if (sv) { g.beginPath(); g.rect(cx - 2, cy - 2, 4, 4); g.arc(cx + sv[0], cy + sv[1], R, 0, 2 * Math.PI); g.fillStyle = "rgba(10,12,26,0.42)"; g.fill("evenodd"); }
    g.restore();
  }
  function rosetteNacht(g, F, I, op) {
    if (F.nacht < 0.02 || (I.W.bau != null && !op.glas)) return;
    const cx = op.a, cy = -op.z, R = op.r, a = F.nacht;
    g.save(); g.beginPath(); g.arc(cx, cy, R, 0, 2 * Math.PI); g.clip();
    const tv = tief(I, 0.25); g.translate(tv[0], tv[1]);
    const gr = g.createRadialGradient(cx, cy, 0, cx, cy, R);
    gr.addColorStop(0, "rgba(255,220,130," + (0.95 * a).toFixed(3) + ")"); gr.addColorStop(0.35, "rgba(220,60,70," + (0.85 * a).toFixed(3) + ")"); gr.addColorStop(1, "rgba(70,90,240," + (0.85 * a).toFixed(3) + ")");
    g.fillStyle = gr; g.fillRect(cx - R, cy - R, 2 * R, 2 * R);
    if (F.px * R > 5) { const p = new Path2D(); pass(p, cx, cy, R * 0.9, 6, -Math.PI / 2); p.moveTo(cx + R * 0.2, cy); p.arc(cx, cy, R * 0.2, 0, 2 * Math.PI); g.lineWidth = Math.max(0.045, R * 0.08); g.strokeStyle = "rgba(40,28,26," + (0.85 * a).toFixed(3) + ")"; g.stroke(p); }
    g.restore();
    lp(F, I, cx, cy, R * 2.2, "230,150,200", 0.3);
  }
  /* schmales Lanzettfenster (Turm) */
  function lanzette(g, F, I, op) {
    const c = I.W.werk, w = op.w, x = op.a - w / 2, bU = -op.z0, bS = -op.zk, gw = 0.14, bA = bS - spitzH(w);
    g.fillStyle = rgbS(c); g.beginPath(); spitz(g, x - gw, bS, w + 2 * gw, bU + 0.03); g.fill();
    if (F.px * gw > 3) { g.strokeStyle = rgbS(hellF(c, -0.38), 0.55); g.lineWidth = Math.max(0.008, 0.7 / F.px); g.beginPath(); for (let z = op.z0 + 0.4; z < op.zk; z += 0.45) { g.moveTo(x - gw, -z); g.lineTo(x, -z); g.moveTo(x + w, -z); g.lineTo(x + w + gw, -z); } g.stroke(); }
    g.save(); g.beginPath(); spitz(g, x, bS, w, bU); g.clip();
    g.fillStyle = rgbS(hellF(c, -0.2)); g.fillRect(x - 0.3, bA - 0.3, w + 0.6, bU - bA + 0.6);
    const tv = tief(I, 0.5); g.translate(tv[0], tv[1]);
    if (op.glas !== false) glasTag(g, F, x, bS, w, bU, 23); else { g.fillStyle = "rgb(22,20,22)"; g.fillRect(x - 0.3, bA - 0.3, w + 0.6, bU - bA + 0.6); }
    g.translate(-tv[0], -tv[1]);
    const sv = F.schatten ? F.schatten(0.5) : null;
    if (sv) { g.beginPath(); g.rect(x - 1, bA - 1, w + 2, bU - bA + 2); spitz(g, x + sv[0], bS + sv[1], w, bU + sv[1]); g.fillStyle = "rgba(10,12,26,0.45)"; g.fill("evenodd"); }
    g.restore();
    g.fillStyle = rgbS(hellF(c, 0.18)); g.fillRect(x - gw - 0.03, bU, w + 2 * gw + 0.06, 0.06);
    if (I.W.winter) { g.fillStyle = rgbS(SCHNEE); schneeKante(g, x - gw - 0.03, x + w + gw + 0.03, bU + 0.01, 0.07, 5); }
  }

  /* =====================================================================
     GLOCKENSTUBE, UHR
     ===================================================================== */
  /* Schallarkade: großer Spitzbogen, darin zwei offene Lanzetten mit
     Mittelsäule und ein Okulus; dahinter die Schallläden (Holzlamellen) */
  function schallarkade(g, F, I, op) {
    const c = I.W.werk, w = op.w, x = op.a - w / 2, bU = -op.z0, bS = -op.zk, gw = 0.2, px = F.px;
    const bA = bS - spitzH(w);
    g.fillStyle = rgbS(c); g.beginPath(); spitz(g, x - gw, bS, w + 2 * gw, bU + 0.05); g.fill();
    if (px * gw > 3) {
      g.strokeStyle = rgbS(hellF(c, -0.38), 0.55); g.lineWidth = Math.max(0.008, 0.7 / px);
      g.beginPath(); for (let z = op.z0 + 0.45; z < op.zk; z += 0.5) { g.moveTo(x - gw, -z); g.lineTo(x, -z); g.moveTo(x + w, -z); g.lineTo(x + w + gw, -z); } g.stroke();
    }
    g.save(); g.beginPath(); spitz(g, x, bS, w, bU); g.clip();
    /* Laibung, dann das Bogenfeld etwas zurückgesetzt */
    g.fillStyle = rgbS(hellF(c, -0.22)); g.fillRect(x - 0.3, bA - 0.3, w + 0.6, bU - bA + 0.6);
    const t1 = tief(I, 0.22); g.translate(t1[0], t1[1]);
    g.fillStyle = rgbS(hellF(c, -0.05)); g.beginPath(); spitz(g, x, bS, w, bU); g.fill();
    rausch(g, x, bA, w, bU - bA, 1.4, 0.2, 61, 3);
    /* Öffnungen: zwei Lanzetten + Okulus */
    const m = 0.16, wl = (w - m) / 2 - 0.06, cyO = bS - w * 0.52, rO = w * 0.17;
    const loch = new Path2D();
    spitz(loch, x + 0.06, bS, wl, bU); spitz(loch, x + w / 2 + m / 2, bS, wl, bU);
    loch.moveTo(x + w / 2 + rO, cyO); loch.arc(x + w / 2, cyO, rO, 0, 2 * Math.PI);
    g.save(); g.clip(loch);
    g.fillStyle = "rgb(14,12,14)"; g.fillRect(x - 0.3, bA - 0.3, w + 0.6, bU - bA + 0.6);
    const t2 = tief(I, 0.3); g.translate(t2[0], t2[1]);
    if (px > 10 && (I.W.bau == null || op.laeden)) {
      /* Schallläden: schräge, verwitterte Holzlamellen */
      const d = 0.2;
      for (let y = bA + 0.1; y < bU; y += d) {
        g.fillStyle = "rgb(118,106,92)"; g.fillRect(x, y, w, d * 0.18);
        g.fillStyle = "rgb(82,72,62)"; g.fillRect(x, y + d * 0.18, w, d * 0.4);
        g.fillStyle = "rgb(34,30,28)"; g.fillRect(x, y + d * 0.58, w, d * 0.06);
      }
    }
    g.restore();
    /* Schatten der Säule und des Bogenfelds in die Öffnungen */
    const sv = F.schatten ? F.schatten(0.3) : null;
    if (sv) { g.save(); g.clip(loch); g.fillStyle = "rgba(0,0,0,0.35)"; g.beginPath(); g.rect(x - 1, bA - 1, w + 2, bU - bA + 2); g.translate(sv[0], sv[1]); g.fillStyle = "rgba(0,0,0,0.35)"; g.restore(); }
    /* Mittelsäule mit Kapitell und Basis */
    if (px * m > 1.5) {
      const xs = x + w / 2 - m / 2;
      const gr = g.createLinearGradient(xs, 0, xs + m, 0);
      gr.addColorStop(0, rgbS(hellF(c, 0.2))); gr.addColorStop(0.5, rgbS(c)); gr.addColorStop(1, rgbS(hellF(c, -0.3)));
      g.fillStyle = gr; g.fillRect(xs, bS - 0.05, m, bU - bS + 0.05);
      g.fillStyle = rgbS(hellF(c, 0.1)); g.fillRect(xs - 0.06, bS - 0.14, m + 0.12, 0.12); g.fillRect(xs - 0.05, bU - 0.1, m + 0.1, 0.1);
    }
    g.translate(-t1[0], -t1[1]);
    const s2 = F.schatten ? F.schatten(0.22) : null;
    if (s2) { g.beginPath(); g.rect(x - 1, bA - 1, w + 2, bU - bA + 2); spitz(g, x + s2[0], bS + s2[1], w, bU + s2[1]); g.fillStyle = "rgba(10,12,26,0.4)"; g.fill("evenodd"); }
    g.restore();
    g.fillStyle = rgbS(hellF(c, 0.2)); g.fillRect(x - gw - 0.05, bU, w + 2 * gw + 0.1, 0.08);
    if (I.W.winter) { g.fillStyle = rgbS(SCHNEE); schneeKante(g, x - gw - 0.05, x + w + gw + 0.05, bU + 0.01, 0.1, 9); }
  }
  /* Deutsche Uhrzeit (Kirchturmuhr) */
  let UHR_FORMAT = null;
  function uhrzeit() {
    const d = new Date();
    try {
      if (!UHR_FORMAT) UHR_FORMAT = new Intl.DateTimeFormat("de-DE", { timeZone: "Europe/Berlin", hour: "numeric", minute: "numeric", second: "numeric", hour12: false });
      const t = {}; for (const p of UHR_FORMAT.formatToParts(d)) t[p.type] = +p.value;
      return (t.hour % 12) + t.minute / 60 + t.second / 3600;
    } catch (e) { return (d.getHours() % 12) + d.getMinutes() / 60; }
  }
  const ROEM = ["XII", "I", "II", "III", "IIII", "V", "VI", "VII", "VIII", "IX", "X", "XI"];
  function zifferblatt(g, F, I, op) {
    const c = I.W.werk, cx = op.a, cy = -op.z, R = op.r, px = F.px;
    /* Steinrahmen mit Profil */
    g.fillStyle = rgbS(hellF(c, 0.05)); g.beginPath(); g.arc(cx, cy, R + 0.16, 0, 2 * Math.PI); g.fill();
    const sv = F.schatten ? F.schatten(0.05) : null;
    g.fillStyle = "rgba(20,20,30,0.45)"; g.beginPath(); g.arc(cx + (sv ? sv[0] : 0.01), cy + (sv ? sv[1] : 0.02), R + 0.01, 0, 2 * Math.PI); g.fill();
    /* Blatt: tiefblau, vergoldete Ringe und Stundenzeichen */
    const gr = g.createRadialGradient(cx - R * 0.3, cy - R * 0.3, 0, cx, cy, R);
    gr.addColorStop(0, "rgb(40,58,102)"); gr.addColorStop(1, "rgb(22,32,60)");
    g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, R, 0, 2 * Math.PI); g.fill();
    const gold = rgbS(GOLD);
    g.strokeStyle = gold; g.lineWidth = Math.max(0.02, R * 0.04);
    g.beginPath(); g.arc(cx, cy, R * 0.94, 0, 2 * Math.PI); g.stroke();
    if (px * R > 8) { g.lineWidth = Math.max(0.01, R * 0.02); g.beginPath(); g.arc(cx, cy, R * 0.64, 0, 2 * Math.PI); g.stroke(); }
    if (px * R > 34) {
      g.fillStyle = gold; g.textAlign = "center"; g.textBaseline = "middle";
      g.font = "bold " + (R * 0.2).toFixed(3) + "px serif";
      for (let i = 0; i < 12; i++) { g.save(); g.translate(cx, cy); g.rotate(i * Math.PI / 6); g.fillText(ROEM[i], 0, -R * 0.79); g.restore(); }
      g.lineWidth = Math.max(0.006, R * 0.012);
      g.beginPath(); for (let i = 0; i < 60; i++) { const a = i * Math.PI / 30; g.moveTo(cx + Math.sin(a) * R * 0.9, cy - Math.cos(a) * R * 0.9); g.lineTo(cx + Math.sin(a) * R * (i % 5 ? 0.87 : 0.84), cy - Math.cos(a) * R * (i % 5 ? 0.87 : 0.84)); } g.stroke();
    } else if (px * R > 6) {
      g.fillStyle = gold;
      for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; g.beginPath(); g.arc(cx + Math.sin(a) * R * 0.8, cy - Math.cos(a) * R * 0.8, R * (i % 3 ? 0.05 : 0.08), 0, 2 * Math.PI); g.fill(); }
    }
    if (op.zeiger) zeigerMalen(g, cx, cy, R, uhrzeit(), gold, 1);
  }
  function zeigerMalen(g, cx, cy, R, std, farbe, k) {
    const aH = std / 12 * 2 * Math.PI, aM = (std % 1) * 2 * Math.PI;
    g.strokeStyle = farbe; g.lineCap = "round";
    g.lineWidth = R * 0.08 * k; g.beginPath(); g.moveTo(cx - Math.sin(aH) * R * 0.1, cy + Math.cos(aH) * R * 0.1); g.lineTo(cx + Math.sin(aH) * R * 0.5, cy - Math.cos(aH) * R * 0.5); g.stroke();
    g.lineWidth = R * 0.05 * k; g.beginPath(); g.moveTo(cx - Math.sin(aM) * R * 0.14, cy + Math.cos(aM) * R * 0.14); g.lineTo(cx + Math.sin(aM) * R * 0.78, cy - Math.cos(aM) * R * 0.78); g.stroke();
    g.fillStyle = farbe; g.beginPath(); g.arc(cx, cy, R * 0.07, 0, 2 * Math.PI); g.fill();
    g.lineCap = "butt";
  }

  /* =====================================================================
     PORTALE
     ===================================================================== */
  /* Gestuftes Spitzbogenportal: die Gewände springen in Stufen zurück
     (jede Stufe in ihrer Tiefe, von hinten nach vorn gemalt), hinten die
     Eichentür mit Bogenfeld. op = { a, w, z0, zk, stufen, tiefe } */
  function portal(g, F, I, op) {
    const c = I.W.werk, px = F.px, n = op.stufen || 3, st = op.st || 0.15, T = op.tiefe || 0.5;
    const bU = -op.z0, bS = -op.zk;
    const breite = (k) => op.w + 2 * (n - k) * st;          // Stufe k: 0 = vorn … n = Türebene
    const tiefeK = (k) => T * k / n;
    const xk = (k) => op.a - breite(k) / 2;
    const bogenK = (p, k, t) => spitz(p, xk(k) + t[0], bS + t[1], breite(k), bU + t[1] + 0.001);
    const sv = F.schatten ? F.schatten(1) : null;
    /* 1. Tür (hinten) */
    const tT = tief(I, T);
    g.save();
    g.beginPath(); bogenK(g, n, tT); g.clip();
    tuerMalen(g, F, I, op, tT);
    g.restore();
    /* 2. Stufen von innen nach außen */
    for (let k = n - 1; k >= 0; k--) {
      const t0 = tief(I, tiefeK(k)), t1 = tief(I, tiefeK(k + 1));
      /* Laibung zwischen Stufe k und k+1 */
      g.save(); g.beginPath(); bogenK(g, k + 1, t0); g.clip();
      g.beginPath(); g.rect(op.a - 5, bS - 5, 10, 10); bogenK(g, k + 1, t1);
      g.fillStyle = rgbS(hellF(c, -0.2 - 0.04 * k)); g.fill("evenodd");
      /* Sonnenschatten in der Laibung */
      if (sv) { g.fillStyle = "rgba(14,12,24,0.35)"; g.beginPath(); g.rect(op.a - 5, bS - 5, 10, 10); const s = [sv[0] * (T / n), sv[1] * (T / n)]; bogenK(g, k + 1, [t0[0] + s[0], t0[1] + s[1]]); g.fill("evenodd"); }
      g.restore();
      /* Stirn der Stufe k: Ring */
      g.beginPath(); bogenK(g, k, t0); bogenK(g, k + 1, t0);
      g.fillStyle = rgbS(hellF(c, 0.04 - 0.05 * k)); g.fill("evenodd");
      if (px * st > 4) {
        /* Rundstab: helle Kante am inneren Rand */
        g.lineWidth = st * 0.28; g.strokeStyle = rgbS(hellF(c, 0.22), 0.6);
        g.beginPath(); spitz(g, xk(k + 1) + t0[0] - st * 0.2, bS + t0[1], breite(k + 1) + st * 0.4, bU + t0[1]); g.stroke();
      }
    }
    /* Kämpferfugen und Steinfugen des äußeren Gewändes */
    if (px > 14) {
      g.strokeStyle = rgbS(hellF(c, -0.4), 0.5); g.lineWidth = Math.max(0.008, 0.7 / px);
      g.beginPath();
      for (let z = op.z0 + 0.5; z < op.zk; z += 0.55) { g.moveTo(xk(0), -z); g.lineTo(xk(n), -z); g.moveTo(xk(n) + op.w, -z); g.lineTo(xk(0) + breite(0), -z); }
      g.stroke();
    }
    /* Außen: Profil, Schatten unter dem Bogen */
    g.lineWidth = 0.05; g.strokeStyle = rgbS(hellF(c, -0.3), 0.5);
    g.beginPath(); spitz(g, xk(0), bS, breite(0), bU); g.stroke();
  }
  /* Eichentür mit Beschlägen, darüber das Bogenfeld (Tympanon) */
  function tuerMalen(g, F, I, op, t) {
    const px = F.px, w = op.w, x = op.a - w / 2 + t[0], bU = -op.z0 + t[1], bS = -op.zk + t[1];
    if (I.W.bau != null && !I.W.Z.tueren) { g.fillStyle = "rgb(24,22,24)"; g.fillRect(x - 1, bS - 3, w + 2, bU - bS + 4); return; }
    const bA = bS - spitzH(w), c = I.W.werk;
    const sturz = bS + 0.05;       // Oberkante der Türflügel
    /* Bogenfeld */
    g.fillStyle = rgbS(hellF(c, -0.08)); g.fillRect(x - 0.2, bA - 0.2, w + 0.4, sturz - bA + 0.2);
    if (px > 12) {
      rausch(g, x, bA, w, sturz - bA, 1, 0.2, 7, 3);
      /* Relief: Kreuz im Kreis */
      const cx = x + w / 2, cy = bS - spitzH(w) * 0.38, r = Math.min(w * 0.2, spitzH(w) * 0.3);
      const sv = F.schatten ? F.schatten(0.04) : null;
      const kreuzP = (dx, dy) => { g.beginPath(); g.arc(cx + dx, cy + dy, r, 0, 2 * Math.PI); g.moveTo(cx + dx, cy + dy - r * 0.8); g.lineTo(cx + dx, cy + dy + r * 0.8); g.moveTo(cx + dx - r * 0.55, cy + dy - r * 0.15); g.lineTo(cx + dx + r * 0.55, cy + dy - r * 0.15); };
      g.lineWidth = r * 0.16;
      if (sv) { kreuzP(sv[0], sv[1]); g.strokeStyle = "rgba(30,20,20,0.45)"; g.stroke(); }
      kreuzP(0, 0); g.strokeStyle = rgbS(hellF(c, 0.15)); g.stroke();
    }
    /* Türsturz */
    g.fillStyle = rgbS(hellF(c, 0.08)); g.fillRect(x - 0.1, sturz - 0.16, w + 0.2, 0.16);
    g.fillStyle = "rgba(20,16,20,0.4)"; g.fillRect(x - 0.1, sturz, w + 0.2, 0.05);
    /* Türflügel: senkrechte Eichenbohlen */
    const hT = bU - sturz;
    const nB = 8;
    for (let i = 0; i < nB; i++) {
      const cc = mischF(EICHE, [0, 0, 0], (hash(i, 3, 17) - 0.3) * 0.25);
      const gr = g.createLinearGradient(x + w * i / nB, 0, x + w * (i + 1) / nB, 0);
      gr.addColorStop(0, rgbS(hellF(cc, 0.07))); gr.addColorStop(1, rgbS(hellF(cc, -0.14)));
      g.fillStyle = gr; g.fillRect(x + w * i / nB, sturz, w / nB + 0.002, hT);
    }
    rausch(g, x, sturz, w, hT, 0.8, 0.28, 12, 4);
    if (px > 18) {
      g.strokeStyle = "rgba(30,18,10,0.6)"; g.lineWidth = Math.max(0.006, 0.7 / px);
      g.beginPath(); for (let i = 1; i < nB; i++) { g.moveTo(x + w * i / nB, sturz); g.lineTo(x + w * i / nB, bU); } g.stroke();
      /* Mittelfuge der beiden Flügel */
      g.fillStyle = "rgba(20,12,8,0.8)"; g.fillRect(x + w / 2 - 0.012, sturz, 0.024, hT);
    }
    /* Beschläge: geschmiedete Langbänder mit Ranken, Ringe */
    if (px > 9) {
      g.fillStyle = "rgb(36,32,30)"; g.strokeStyle = "rgb(36,32,30)";
      for (const yy of [sturz + hT * 0.2, sturz + hT * 0.78]) for (const s of [-1, 1]) {
        const x0 = s < 0 ? x : x + w, x1 = x + w / 2 - s * 0.08;
        g.beginPath(); g.moveTo(x0, yy - 0.035); g.lineTo(x1, yy - 0.012); g.lineTo(x1, yy + 0.012); g.lineTo(x0, yy + 0.035); g.closePath(); g.fill();
        if (px > 30) {
          g.lineWidth = 0.022;
          const xm = x0 + (x1 - x0) * 0.55;
          g.beginPath(); g.moveTo(xm, yy); g.quadraticCurveTo(xm + (x1 - x0) * 0.12, yy - 0.16, xm + (x1 - x0) * 0.25, yy - 0.1); g.stroke();
          g.beginPath(); g.moveTo(xm, yy); g.quadraticCurveTo(xm + (x1 - x0) * 0.12, yy + 0.16, xm + (x1 - x0) * 0.25, yy + 0.1); g.stroke();
          g.beginPath(); g.arc(x1, yy, 0.03, 0, 2 * Math.PI); g.fill();
        }
      }
      /* Türringe */
      for (const s of [-1, 1]) {
        const rx = x + w / 2 + s * 0.2, ry = sturz + hT * 0.52;
        g.lineWidth = 0.025; g.strokeStyle = "rgb(56,50,44)"; g.beginPath(); g.arc(rx, ry + 0.07, 0.08, 0, 2 * Math.PI); g.stroke();
        g.fillStyle = "rgb(46,40,36)"; g.beginPath(); g.arc(rx, ry, 0.05, 0, 2 * Math.PI); g.fill();
      }
    }
    /* Schwelle */
    g.fillStyle = rgbS(hellF(c, 0.12)); g.fillRect(x - 0.1, bU - 0.06, w + 0.2, 0.06);
    /* Schatten des Gewändes auf die Tür */
    const sv = F.schatten ? F.schatten(op.tiefe || 0.5) : null;
    g.fillStyle = "rgba(10,8,16,0.28)"; g.fillRect(x - 1, bA - 1, w + 2, bU - bA + 2);
    if (sv) {
      g.save(); g.beginPath(); spitz(g, x + sv[0], bS + sv[1], w, bU + sv[1]); g.clip();
      g.globalCompositeOperation = "screen"; g.fillStyle = "rgba(90,74,60,0.35)"; g.fillRect(x - 1, bA - 1, w + 2, bU - bA + 2);
      g.restore();
    }
    if (I.W.winter && op.kranz && (I.W.bau == null || I.W.deko)) adventskranz(g, F, x + w / 2, sturz + hT * 0.36, Math.min(0.42, w * 0.2));
  }
  /* Adventskranz an der Tür: Tannengrün, rote Schleife, vier Kerzen */
  function adventskranz(g, F, cx, cy, R) {
    const px = F.px, rng = zuf(4711);
    if (px * R < 3) return;
    g.fillStyle = "rgba(0,0,0,0.3)"; g.beginPath(); g.arc(cx + 0.03, cy + 0.05, R * 1.05, 0, 2 * Math.PI); g.arc(cx + 0.03, cy + 0.05, R * 0.5, 0, 2 * Math.PI, true); g.fill();
    g.fillStyle = "rgb(30,62,40)"; g.beginPath(); g.arc(cx, cy, R, 0, 2 * Math.PI); g.arc(cx, cy, R * 0.55, 0, 2 * Math.PI, true); g.fill();
    if (px * R > 10) {
      g.lineWidth = Math.max(0.006, 0.7 / px);
      for (let i = 0; i < 160; i++) {
        const a = rng() * 2 * Math.PI, rr = R * (0.55 + 0.45 * rng()), l = R * 0.18;
        const x0 = cx + Math.cos(a) * rr, y0 = cy + Math.sin(a) * rr, b = a + Math.PI / 2 + (rng() - 0.5);
        g.strokeStyle = rgbS(hellF([36, 84, 50], (rng() - 0.4) * 0.5)); g.beginPath(); g.moveTo(x0, y0); g.lineTo(x0 + Math.cos(b) * l, y0 + Math.sin(b) * l); g.stroke();
      }
      g.fillStyle = "rgb(150,20,34)";
      for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3 + 0.3; g.beginPath(); g.arc(cx + Math.cos(a) * R * 0.78, cy + Math.sin(a) * R * 0.78, R * 0.07, 0, 2 * Math.PI); g.fill(); }
    }
    /* rote Schleife unten mit Bändern */
    g.fillStyle = "rgb(176,18,36)";
    const by = cy + R * 0.9;
    g.beginPath(); g.moveTo(cx, by); g.quadraticCurveTo(cx - R * 0.5, by - R * 0.35, cx - R * 0.42, by + R * 0.12); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(cx, by); g.quadraticCurveTo(cx + R * 0.5, by - R * 0.35, cx + R * 0.42, by + R * 0.12); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(cx - 0.02, by); g.lineTo(cx - R * 0.3, by + R * 0.8); g.lineTo(cx - R * 0.18, by + R * 0.78); g.lineTo(cx, by + 0.02); g.fill();
    g.beginPath(); g.moveTo(cx + 0.02, by); g.lineTo(cx + R * 0.26, by + R * 0.85); g.lineTo(cx + R * 0.38, by + R * 0.8); g.lineTo(cx, by + 0.02); g.fill();
    /* vier Kerzen oben auf dem Kranz */
    for (let i = 0; i < 4; i++) {
      const a = -Math.PI / 2 + (i - 1.5) * 0.42, kx = cx + Math.cos(a) * R * 0.78, ky = cy + Math.sin(a) * R * 0.78;
      g.fillStyle = "rgb(190,28,40)"; g.fillRect(kx - R * 0.06, ky - R * 0.4, R * 0.12, R * 0.4);
      g.fillStyle = "rgba(255,255,255,0.35)"; g.fillRect(kx - R * 0.06, ky - R * 0.4, R * 0.03, R * 0.4);
    }
  }
  function kranzLicht(g, F, I, cx, cy, R) {
    if (F.nacht < 0.02) return;
    const brennen = adventKerzen();
    for (let i = 0; i < 4; i++) {
      if (i >= brennen) continue;
      const a = -Math.PI / 2 + (i - 1.5) * 0.42, kx = cx + Math.cos(a) * R * 0.78, ky = cy + Math.sin(a) * R * 0.78 - R * 0.46;
      const gr = g.createRadialGradient(kx, ky, 0, kx, ky, R * 0.2);
      gr.addColorStop(0, "rgba(255,244,200," + F.nacht + ")"); gr.addColorStop(1, "rgba(255,170,60,0)");
      g.fillStyle = gr; g.fillRect(kx - R * 0.2, ky - R * 0.2, R * 0.4, R * 0.4);
      g.fillStyle = "rgba(255,230,150," + F.nacht + ")"; g.beginPath(); g.ellipse(kx, ky, R * 0.035, R * 0.07, 0, 0, 2 * Math.PI); g.fill();
      lp(F, I, kx, ky, 0.5, "255,190,110", 0.35);
    }
  }
  /* Wie viele Adventskerzen brennen? Im Advent nach dem Datum, sonst alle */
  function adventKerzen() {
    const d = new Date(), j = d.getFullYear();
    const hl = new Date(j, 11, 24), a4 = new Date(j, 11, 24 - ((hl.getDay() + 7) % 7 || 7));
    let n = 0;
    for (let k = 3; k >= 0; k--) { const s = new Date(a4.getTime() - k * 7 * 864e5); if (d >= s) n++; }
    return d.getMonth() === 11 && d.getDate() <= 26 && n > 0 ? n : 4;
  }

  /* =====================================================================
     DACH: SCHUPPENSCHIEFER, SCHNEE
     ===================================================================== */
  /* Schiefer in (A, B): A entlang der Traufe, B vom First zur Traufe.
     Reihen von der Traufe (bE) nach oben, jede Reihe überdeckt die untere. */
  function schiefer(g, F, I, x0, y0, x1, y1, bE, opt) {
    opt = opt || {};
    const px = F.px, rh = opt.reihe || 0.17, sw = opt.breite || 0.25, saat = opt.saat || 1;
    const basis = opt.farbe || SCHIEFER;
    g.fillStyle = rgbS(hellF(basis, -0.35)); g.fillRect(x0, y0, x1 - x0, y1 - y0);
    const k0 = Math.max(0, Math.floor((bE - y1) / rh) - 1), k1 = Math.ceil((bE - y0) / rh) + 1;
    if (px * rh < 2.4) {
      for (let k = k0; k < k1; k++) { g.fillStyle = rgbS(hellF(basis, (hash(k, 1, saat) - 0.5) * 0.12)); g.fillRect(x0, bE - (k + 1) * rh, x1 - x0, rh * 0.82); }
      rausch(g, x0, y0, x1 - x0, y1 - y0, 3.2, 0.22, saat + 3, 3);
      return;
    }
    const rund = px * sw > 7;
    const sv = F.schatten ? F.schatten(0.014) : null;
    const sd = sv ? [sv[0], Math.max(0.012, sv[1])] : [0, 0.014];
    const farben = [hellF(basis, -0.06), hellF(basis, -0.02), hellF(basis, 0.02), hellF(basis, 0.06), mischF(basis, [104, 102, 102], 0.18)];
    for (let k = k0; k < k1; k++) {
      const yb = bE - k * rh, yt = yb - rh;
      if (yb < y0 - rh || yt > y1 + rh) continue;
      const off = (k % 2) * sw / 2 + (hash(k, 2, saat) - 0.5) * 0.04;
      const i0 = Math.floor((x0 - off) / sw) - 1, i1 = Math.floor((x1 - off) / sw) + 1;
      const schat = new Path2D(), eimer = farben.map(() => new Path2D()), kante = new Path2D();
      for (let i = i0; i <= i1; i++) {
        const xa = off + i * sw + 0.006, xb = off + (i + 1) * sw - 0.006, xm = (xa + xb) / 2;
        const q = sw * 0.34;
        const p = eimer[(hash(i, k, saat) * farben.length) | 0];
        const form = (pp, dx, dy) => {
          if (rund) {
            pp.moveTo(xa + dx, yt - rh * 0.7 + dy); pp.lineTo(xb + dx, yt - rh * 0.7 + dy); pp.lineTo(xb + dx, yb - q + dy);
            pp.quadraticCurveTo(xb + dx, yb + dy, xm + dx, yb + dy); pp.quadraticCurveTo(xa + dx, yb + dy, xa + dx, yb - q + dy); pp.closePath();
          } else pp.rect(xa + dx, yt - rh * 0.5 + dy, xb - xa, rh * 1.5);
        };
        form(schat, sd[0], sd[1]); form(p, 0, 0);
        if (rund && px > 34) { kante.moveTo(xb, yb - q); kante.quadraticCurveTo(xb, yb, xm, yb); kante.quadraticCurveTo(xa, yb, xa, yb - q); }
      }
      g.fillStyle = "rgba(10,12,18,0.72)"; g.fill(schat);
      for (let j = 0; j < farben.length; j++) { g.fillStyle = rgbS(farben[j]); g.fill(eimer[j]); }
      if (rund && px > 34) { g.strokeStyle = rgbS(hellF(basis, 0.3), 0.45); g.lineWidth = Math.max(0.005, 0.8 / px); g.stroke(kante); }
    }
    rausch(g, x0, y0, x1 - x0, y1 - y0, 5, 0.12, saat + 3, 4);
    /* Flechten und helle Wasserspuren (nicht im Schnee zu sehen) */
    if (!I.W.winter) bleich(g, x0, y0, x1 - x0, y1 - y0, 4, 0.07, saat + 4);
  }
  /* Schneedecke auf einer Dachfläche: bR = First, bE = Traufe */
  function schneeDach(g, F, I, x0, x1, bR, bE, opt) {
    opt = opt || {};
    const px = F.px, h = bE - bR, saat = opt.saat || 7, rng = zuf(saat);
    const gr = g.createLinearGradient(0, bR, 0, bE);
    gr.addColorStop(0, "rgba(232,238,248," + (opt.oben == null ? 0.8 : opt.oben) + ")");
    gr.addColorStop(0.25, "rgba(238,243,251,0.96)"); gr.addColorStop(1, "rgb(246,249,253)");
    g.fillStyle = gr;
    g.beginPath(); g.moveTo(x0 - 0.1, bR + 0.05);
    for (let x = x0; x <= x1 + 0.25; x += 0.25) g.lineTo(x, bR + 0.03 + hash(Math.round(x * 4), saat, 2) * 0.06);
    g.lineTo(x1 + 0.1, bE + 0.1); g.lineTo(x0 - 0.1, bE + 0.1); g.closePath(); g.fill();
    /* Wo der Schnee abgerutscht ist, schaut der Schiefer durch */
    if (opt.rutsch !== false) {
      const n = Math.round((x1 - x0) * 0.35);
      for (let i = 0; i < n; i++) {
        const cx = x0 + rng() * (x1 - x0), cy = bR + h * (0.15 + rng() * 0.45), rx = 0.3 + rng() * 0.9, ry = 0.5 + rng() * h * 0.25;
        const gg = g.createRadialGradient(cx, cy, 0, cx, cy, rx);
        gg.addColorStop(0, "rgba(96,106,124,0.42)"); gg.addColorStop(1, "rgba(96,106,124,0)");
        g.save(); g.translate(cx, cy); g.scale(1, ry / rx); g.fillStyle = gg; g.beginPath(); g.arc(0, 0, rx, 0, 2 * Math.PI); g.fill(); g.restore();
      }
    }
    /* Verwehungen: bläuliche Mulden */
    for (let i = 0; i < (x1 - x0) * 0.8; i++) {
      const cx = x0 + rng() * (x1 - x0), cy = bR + h * (0.3 + rng() * 0.6), rx = 0.5 + rng() * 1.3;
      const gg = g.createRadialGradient(cx, cy, 0, cx, cy, rx);
      gg.addColorStop(0, "rgba(160,182,222,0.16)"); gg.addColorStop(1, "rgba(160,182,222,0)");
      g.save(); g.translate(cx, cy); g.scale(1, 0.3); g.fillStyle = gg; g.beginPath(); g.arc(0, 0, rx, 0, 2 * Math.PI); g.fill(); g.restore();
    }
    /* Die Schieferreihen zeichnen sich unter der dünnen Decke ab – oben
       deutlich, zur Traufe hin (dicker Schnee) kaum noch */
    if (px * 0.17 > 2.5) {
      const p = new Path2D();
      for (let y = bE - 0.17, k = 0; y > bR; y -= 0.17, k++) {
        const t = 1 - (y - bR) / h, d = 0.012 + 0.02 * (1 - t);
        for (let x = x0 - hash(k, 1, saat) * 1.5; x < x1; x += 1.5) { const l = 1.5 * (0.3 + 0.7 * hash(Math.round(x * 3), k, saat)); if (hash(Math.round(x * 3), k, saat + 1) < 0.25 + t * 0.45) continue; p.rect(x, y, l, d); }
      }
      g.fillStyle = "rgba(118,130,152,0.2)"; g.fill(p);
    }
    /* Dicker Rand an der Traufe */
    const gk = g.createLinearGradient(0, bE - 0.35, 0, bE);
    gk.addColorStop(0, "rgba(255,255,255,0)"); gk.addColorStop(0.6, "rgba(255,255,255,0.7)"); gk.addColorStop(0.85, "rgba(214,226,244,0.9)"); gk.addColorStop(1, "rgba(170,188,222,0.9)");
    g.fillStyle = gk; g.fillRect(x0, bE - 0.35, x1 - x0, 0.35);
    rausch(g, x0, bR, x1 - x0, h, 1.8, 0.06, 31, 3);
    if (px > 18) {
      g.fillStyle = "rgba(255,255,255,0.95)";
      for (let i = 0; i < (x1 - x0) * h * 4; i++) { const r = (0.6 + rng()) / px; g.fillRect(x0 + rng() * (x1 - x0), bR + rng() * h, r, r); }
    }
  }
  /* Schnee auf einem sehr steilen Helm: er hält nur auf den Kanten der
     Schieferschuppen, unten dichter als oben */
  function schneeSteil(g, F, I, x0, x1, bR, bE, rh, saat, menge) {
    const h = bE - bR, px = F.px, m = menge || 1;
    if (px * rh < 2.5) { g.fillStyle = "rgba(236,241,250," + (0.3 * m).toFixed(2) + ")"; g.fillRect(x0, bR, x1 - x0, h); return; }
    /* Schneereste auf den Schuppenkanten: kurze, unregelmäßige Polster */
    const p = new Path2D();
    const n = Math.ceil(h / rh);
    for (let k = 0; k < n; k++) {
      const yb = bE - k * rh, unten = 1 - k / n;
      for (let x = x0 - hash(k, 7, saat) * 0.6; x < x1; ) {
        const l = 0.08 + 0.5 * hash(Math.round(x * 10), k, saat + 1);
        if (hash(Math.round(x * 10), k, saat) < Math.min(0.92, (0.55 + 0.3 * (1 - unten)) / m)) { x += l; continue; }
        const t = (0.012 + 0.045 * Math.pow(unten, 1.5)) * m * (0.6 + 0.8 * hash(Math.round(x * 10), k, saat + 2));
        p.moveTo(x, yb); p.quadraticCurveTo(x + l * 0.5, yb - t * 2, x + l, yb); p.closePath();
        x += l + 0.03;
      }
    }
    g.fillStyle = "rgba(242,246,252,0.92)"; g.fill(p);
    /* Schneesaum am Fuß */
    const gr = g.createLinearGradient(0, bE - 1.0 * m, 0, bE);
    gr.addColorStop(0, "rgba(242,246,252,0)"); gr.addColorStop(1, "rgba(242,246,252,0.85)");
    g.fillStyle = gr; g.fillRect(x0, bE - 1.0 * m, x1 - x0, 1.0 * m);
  }
  /* Schneefanggitter über der Traufe */
  function schneefang(g, F, I, x0, x1, b) {
    if (F.px < 9) return;
    const sv = F.schatten ? F.schatten(0.12) : [0.02, 0.04];
    const d = I.W.winter ? "rgba(70,80,100,0.8)" : "rgba(40,44,52,0.9)";
    for (const [dx, dy, farbe] of [[sv ? sv[0] : 0, sv ? sv[1] : 0.04, "rgba(10,12,20,0.3)"], [0, 0, d]]) {
      g.fillStyle = farbe;
      g.fillRect(x0 + dx, b - 0.16 + dy, x1 - x0, 0.022); g.fillRect(x0 + dx, b - 0.06 + dy, x1 - x0, 0.022);
      for (let x = Math.ceil(x0 / 0.9) * 0.9; x < x1; x += 0.9) g.fillRect(x + dx, b - 0.2 + dy, 0.03, 0.22);
    }
  }

  /* =====================================================================
     EFEU (Frühling) — wächst vom Boden an der Wand hoch
     Echte Triebe: einige Hauptranken klettern in leichten Bögen nach oben
     und verzweigen sich; an ihnen sitzen die Blätter (unten dicht und
     dunkel, an den Spitzen hell und locker). Aus der Ferne ergibt das
     einen dunkelgrünen Teppich mit ausfransendem Rand.
     ===================================================================== */
  function efeuRanken(xa, xb, hoch, saat) {
    const rng = zuf(saat + 101), ranken = [];
    const n = Math.max(3, Math.round((xb - xa) * 1.6));
    const wachse = (x, y, h, dicke, tiefe) => {
      const pts = [[x, y]];
      let a = -Math.PI / 2 + (rng() - 0.5) * 0.5;
      const schritte = Math.max(3, Math.round(h / 0.35));
      for (let k = 0; k < schritte; k++) {
        a += (rng() - 0.5) * 0.7; a = klemm(a, -Math.PI / 2 - 0.9, -Math.PI / 2 + 0.9);
        x += Math.cos(a) * 0.35; y += Math.sin(a) * 0.35;
        x = klemm(x, xa - 0.2, xb + 0.2);
        pts.push([x, y]);
        if (tiefe < 2 && rng() < 0.22) wachse(x, y, h * (0.3 + 0.4 * rng()) * (1 - k / schritte), dicke * 0.6, tiefe + 1);
      }
      ranken.push({ pts: pts, dicke: dicke });
    };
    for (let i = 0; i < n; i++) wachse(xa + (i + 0.5) / n * (xb - xa) + (rng() - 0.5) * 0.3, 0.05, hoch * (0.45 + 0.6 * rng()), 0.9, 0);
    return ranken;
  }
  function efeu(g, F, I, xa, xb, hoch, saat) {
    const px = F.px, rng = zuf(saat);
    const ranken = efeuRanken(xa, xb, hoch, saat);
    const sv = F.schatten ? F.schatten(0.12) : [0.03, 0.05];
    g.save(); g.lineCap = "round"; g.lineJoin = "round";
    /* Masse: dicke, weiche Striche entlang der Ranken (erst Schatten) */
    const masse = (dx, dy, farbe, k) => {
      g.strokeStyle = farbe;
      for (const r of ranken) {
        const n = r.pts.length;
        for (let i = 1; i < n; i++) {
          const t = i / n;
          g.lineWidth = Math.max(0.12, r.dicke * (1 - 0.75 * t) * k);
          g.beginPath(); g.moveTo(r.pts[i - 1][0] + dx, r.pts[i - 1][1] + dy); g.lineTo(r.pts[i][0] + dx, r.pts[i][1] + dy); g.stroke();
        }
      }
    };
    if (sv) masse(sv[0], sv[1], "rgba(20,24,16,0.28)", 1);
    masse(0, 0, "rgb(32,58,28)", 1);
    if (px > 9) {
      /* Blätter: je Ranke dicht an dicht, unten dunkel, oben frisch */
      const farben = [[34, 64, 30], [46, 84, 38], [58, 102, 46], [72, 118, 52], [94, 142, 64]];
      const eim = farben.map(() => new Path2D());
      const gr = Math.max(0.07, 1.8 / px);
      for (const r of ranken) {
        const n = r.pts.length;
        for (let i = 1; i < n; i++) {
          const a = r.pts[i - 1], b = r.pts[i], t = i / n, breite = r.dicke * (1 - 0.75 * t) * 0.55;
          const anz = Math.min(40, Math.round(0.35 * breite * 2 / (gr * gr) * 0.35 * 3));
          for (let k = 0; k < anz; k++) {
            const u = rng(), x = a[0] + (b[0] - a[0]) * u + (rng() - 0.5) * 2 * breite, y = a[1] + (b[1] - a[1]) * u + (rng() - 0.5) * 2 * breite * 0.8;
            const h = t * 0.6 + rng() * 0.5;
            const p = eim[Math.min(farben.length - 1, (h * farben.length) | 0)];
            const rr = gr * (0.75 + rng() * 0.6);
            if (px > 38) {
              const w = rng() * 6.28, c = Math.cos(w) * rr * 0.25, sn = Math.sin(w) * rr * 0.25;
              p.moveTo(x, y - rr); p.quadraticCurveTo(x + rr * 0.55 + c, y - rr * 0.5 + sn, x + rr, y - rr * 0.1);
              p.quadraticCurveTo(x + rr * 0.55, y + rr * 0.35, x + rr * 0.35, y + rr * 0.75); p.quadraticCurveTo(x, y + rr * 0.5, x - rr * 0.35, y + rr * 0.75);
              p.quadraticCurveTo(x - rr * 0.55, y + rr * 0.35, x - rr, y - rr * 0.1); p.quadraticCurveTo(x - rr * 0.55 + c, y - rr * 0.5 + sn, x, y - rr); p.closePath();
            } else { p.moveTo(x + rr, y); p.arc(x, y, rr, 0, 2 * Math.PI); }
          }
        }
      }
      farben.forEach((c, i) => { g.fillStyle = rgbS(c); g.fill(eim[i]); });
    }
    if (px > 26) {
      /* sichtbare Stängel an den Spitzen */
      g.strokeStyle = "rgba(88,70,44,0.8)"; g.lineWidth = Math.max(0.012, 0.8 / px);
      for (const r of ranken) { const n = r.pts.length, m = Math.floor(n * 0.7); g.beginPath(); g.moveTo(r.pts[m][0], r.pts[m][1]); for (let i = m + 1; i < n; i++) g.lineTo(r.pts[i][0], r.pts[i][1]); g.stroke(); }
    }
    g.restore();
  }

  /* =====================================================================
     WAND-MALER: eine Beschreibung je Wand
     spec = { saat, ecken: [[A, dir]], sockel, gesimse: [z], traufe,
              oeff: [...], efeu: [xa, xb, hoch] }
     ===================================================================== */
  function wandMaler(spec) {
    return function (g, F, I) {
      const x0 = I.A0, x1 = I.A0 + F.w, y0 = I.B0, y1 = I.B0 + F.h;
      const zTop = -y0, W = I.W;
      bruchstein(g, F, I, x0, y0, x1, y1, spec.saat || 1);
      /* Verwitterung: dunkle Bahnen von der Traufe, heller in der Sonne */
      if (F.px > 6) {
        const gr = g.createLinearGradient(0, y0, 0, y0 + 2.5);
        gr.addColorStop(0, "rgba(50,44,40,0.22)"); gr.addColorStop(1, "rgba(50,44,40,0)");
        g.fillStyle = gr; g.fillRect(x0, y0, x1 - x0, 2.5);
      }
      if (spec.traufe && spec.traufe <= zTop + 0.01) traufgesims(g, F, I, x0, x1, spec.traufe);
      for (const [a, dir] of spec.ecken || []) eckquader(g, F, I, a, dir, 0.9, Math.min(zTop, spec.eckeBis || 99), (spec.saat || 1) + a * 7);
      for (const z of spec.gesimse || []) if (z < zTop + 0.2) gesims(g, F, I, x0, x1, z, 0.24);
      for (const op of spec.oeff || []) oeffnung(g, F, I, op);
      if (spec.sockel) sockel(g, F, I, x0, x1, spec.sockel, spec.saat || 1);
      if (spec.efeu && !W.winter && W.fertig) efeu(g, F, I, spec.efeu[0], spec.efeu[1], spec.efeu[2], spec.saat + 3);
      if (W.winter) schneeWehe(g, F, x0, x1, spec.saat || 1);
      if (spec.extra) spec.extra(g, F, I);
    };
  }
  function oeffnung(g, F, I, op) {
    const a = op.a == null ? I.A0 + F.w / 2 + (op.da || 0) : op.a;
    const o2 = Object.assign({}, op, { a: a });
    if (op.zeigt === false) return;
    if (op.art === "fenster") masswerkFenster(g, F, I, o2);
    else if (op.art === "rose") rosette(g, F, I, o2);
    else if (op.art === "lanzette") lanzette(g, F, I, o2);
    else if (op.art === "schall") schallarkade(g, F, I, o2);
    else if (op.art === "uhr") zifferblatt(g, F, I, o2);
    else if (op.art === "portal") portal(g, F, I, o2);
    else if (op.art === "tuer") kleineTuer(g, F, I, o2);
    else if (op.art === "gitter") gitterfenster(g, F, I, o2);
  }
  function oeffnungNacht(g, F, I, op) {
    const a = op.a == null ? I.A0 + F.w / 2 + (op.da || 0) : op.a;
    const o2 = Object.assign({}, op, { a: a });
    if (op.art === "fenster") masswerkNacht(g, F, I, o2);
    else if (op.art === "rose") rosetteNacht(g, F, I, o2);
    else if (op.art === "uhr") uhrNacht(g, F, I, o2);
  }
  function wandNacht(spec) {
    return function (g, F, I) {
      if (F.nacht < 0.02) return;
      if (spec.flut && I.W.fertig) flutlicht(g, F, I);
      for (const op of spec.oeff || []) oeffnungNacht(g, F, I, op);
      if (spec.nachtExtra) spec.nachtExtra(g, F, I);
    };
  }
  /* Anstrahlung: zwei Scheinwerfer am Fuß des Turms tauchen ihn nachts in
     warmes Licht, nach oben schwächer, zu den Kanten hin weicher */
  function flutlicht(g, F, I) {
    const x0 = I.A0, x1 = I.A0 + F.w, zT = -I.B0, a = F.nacht;
    g.save(); g.globalCompositeOperation = "screen";
    for (const t of [0.28, 0.72]) {
      const cx = x0 + (x1 - x0) * t;
      const gr = g.createRadialGradient(cx, 2.5, 0.3, cx, -2, Math.max(8, zT * 0.9));
      gr.addColorStop(0, "rgba(170,126,70," + (0.62 * a).toFixed(3) + ")"); gr.addColorStop(0.3, "rgba(130,98,58," + (0.4 * a).toFixed(3) + ")"); gr.addColorStop(0.75, "rgba(80,62,42," + (0.14 * a).toFixed(3) + ")"); gr.addColorStop(1, "rgba(60,46,32,0)");
      g.fillStyle = gr; g.fillRect(x0, -zT, x1 - x0, zT + 0.1);
    }
    g.restore();
  }
  function uhrNacht(g, F, I, op) {
    /* das Zifferblatt wird nachts angestrahlt */
    const a = F.nacht;
    g.save(); g.globalCompositeOperation = "screen";
    const gr = g.createRadialGradient(op.a, -op.z + op.r * 0.8, 0, op.a, -op.z, op.r * 1.4);
    gr.addColorStop(0, "rgba(120,100,70," + (0.55 * a).toFixed(3) + ")"); gr.addColorStop(1, "rgba(120,100,70,0)");
    g.fillStyle = gr; g.fillRect(op.a - op.r * 1.5, -op.z - op.r * 1.5, op.r * 3, op.r * 3);
    g.restore();
  }
  /* Schnee, der sich unten an der Wand anhäuft */
  function schneeWehe(g, F, x0, x1, saat) {
    g.fillStyle = "rgb(236,241,250)";
    g.beginPath(); g.moveTo(x0 - 0.1, 0.1);
    for (let x = x0; x <= x1 + 0.3; x += 0.3) g.lineTo(x, -0.06 - 0.16 * hash(Math.round(x * 3), saat, 4));
    g.lineTo(x1 + 0.1, 0.1); g.closePath(); g.fill();
  }
  /* kleine Tür (Sakristei) */
  function kleineTuer(g, F, I, op) {
    const c = I.W.werk, w = op.w, x = op.a - w / 2, bU = -op.z0, bS = -op.zk, gw = 0.16;
    g.fillStyle = rgbS(c); g.beginPath(); spitz(g, x - gw, bS, w + 2 * gw, bU + 0.02, 0.8); g.fill();
    g.save(); g.beginPath(); spitz(g, x, bS, w, bU, 0.8); g.clip();
    g.fillStyle = rgbS(hellF(c, -0.2)); g.fillRect(x - 0.3, bS - 1.5, w + 0.6, bU - bS + 2);
    const tv = tief(I, 0.25); g.translate(tv[0], tv[1]);
    for (let i = 0; i < 5; i++) { g.fillStyle = rgbS(hellF(EICHE, (hash(i, 8, 1) - 0.5) * 0.2)); g.fillRect(x + w * i / 5, bS - 1.5, w / 5 + 0.002, bU - bS + 2); }
    if (F.px > 10) { g.fillStyle = "rgb(36,32,30)"; for (const yy of [bS + 0.2, bU - 0.4]) g.fillRect(x, yy, w * 0.7, 0.05); g.beginPath(); g.arc(x + w * 0.82, bU - 1.0, 0.035, 0, 2 * Math.PI); g.fill(); }
    g.translate(-tv[0], -tv[1]);
    const sv = F.schatten ? F.schatten(0.25) : null;
    if (sv) { g.beginPath(); g.rect(x - 1, bS - 2, w + 2, 4); spitz(g, x + sv[0], bS + sv[1], w, bU + sv[1], 0.8); g.fillStyle = "rgba(10,12,26,0.4)"; g.fill("evenodd"); }
    g.restore();
  }
  function gitterfenster(g, F, I, op) {
    const c = I.W.werk, w = op.w, h = op.h, x = op.a - w / 2, y = -op.z0 - h, gw = 0.13;
    g.fillStyle = rgbS(c); g.fillRect(x - gw, y - gw, w + 2 * gw, h + 2 * gw);
    g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
    g.fillStyle = rgbS(hellF(c, -0.2)); g.fillRect(x, y, w, h);
    const tv = tief(I, 0.3); g.translate(tv[0], tv[1]);
    glasTag(g, F, x, y + w, w, y + h, 29);
    g.fillStyle = "rgb(30,30,32)";
    if (F.px > 10) { for (let i = 1; i < 4; i++) g.fillRect(x + w * i / 4 - 0.012, y, 0.024, h); for (let i = 1; i < 3; i++) g.fillRect(x, y + h * i / 3 - 0.012, w, 0.024); }
    g.restore();
    g.fillStyle = rgbS(hellF(c, 0.18)); g.fillRect(x - gw - 0.03, y + h, w + 2 * gw + 0.06, 0.06);
    if (I.W.winter) { g.fillStyle = rgbS(SCHNEE); schneeKante(g, x - gw - 0.03, x + w + gw + 0.03, y + h + 0.01, 0.07, 3); }
  }

  /* =====================================================================
     WEITERE MALER: Werkstein-Körper, Dach, Blech, Stufen, Eis
     ===================================================================== */
  /* Werksteinfläche (Strebepfeiler, Portalvorbau): senkrecht → Quader,
     schräg → Wasserschlag mit Schnee */
  function werksteinMaler(saat, opt) {
    opt = opt || {};
    return function (g, F, I) {
      const x0 = I.A0, x1 = I.A0 + F.w, y0 = I.B0, y1 = I.B0 + F.h;
      if (Math.abs(I.n[2]) < 0.3) {
        quader(g, F, I, x0, y0, x1, y1, saat, { lage: 0.42 });
        if (I.zmin < 0.05) sockel(g, F, I, x0, x1, 0.9, saat);
        if (opt.nachQuader) opt.nachQuader(g, F, I);
        if (I.W.winter && I.zmin < 0.05) schneeWehe(g, F, x0, x1, saat);
      } else {
        /* Wasserschlag / Abdeckung: Platten, Fugen quer */
        const c = hellF(I.W.werk, 0.06);
        g.fillStyle = rgbS(c); g.fillRect(x0, y0, x1 - x0, y1 - y0);
        if (F.px > 10) { g.fillStyle = rgbS(hellF(c, -0.35), 0.6); for (let x = Math.ceil(x0 / 0.7) * 0.7; x < x1; x += 0.7) g.fillRect(x, y0, Math.max(0.01, 0.7 / F.px), y1 - y0); }
        rausch(g, x0, y0, x1 - x0, y1 - y0, 1.2, 0.26, saat, 3);
        if (I.W.winter) {
          g.fillStyle = "rgb(242,246,252)"; g.fillRect(x0, y0, x1 - x0, y1 - y0 - Math.min(0.05, (y1 - y0) * 0.2));
          g.fillStyle = "rgba(170,190,225,0.35)"; g.fillRect(x0, y1 - 0.06, x1 - x0, 0.03);
        } else {
          /* Flechten und Moos auf der Abdeckung */
          g.fillStyle = "rgba(96,120,60,0.18)"; g.fillRect(x0, y1 - (y1 - y0) * 0.3, x1 - x0, (y1 - y0) * 0.3);
        }
      }
    };
  }
  /* Kanten einer Dachfläche: First, Grate, Ortgang, Anschluss */
  function dachKanten(g, F, I, bE, bR, opt) {
    const pts = I.fl.pts.map((p) => [dot(p, I.u), dot(p, I.v)]);
    const band = opt.band || 0.2;
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length];
      if (Math.abs(a[1] - bE) < 0.02 && Math.abs(b[1] - bE) < 0.02) continue;      // Traufe
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 0.05) continue;
      const tx = (b[0] - a[0]) / L, ty = (b[1] - a[1]) / L;
      /* Richtung ins Innere der Fläche */
      const mx = pts.reduce((s, p) => s + p[0], 0) / pts.length, my = pts.reduce((s, p) => s + p[1], 0) / pts.length;
      let nx = -ty, ny = tx; if ((mx - a[0]) * nx + (my - a[1]) * ny < 0) { nx = -nx; ny = -ny; }
      const blech = opt.kantenFarbe || [96, 104, 114];
      g.fillStyle = "rgba(10,12,18,0.35)";
      g.beginPath(); g.moveTo(a[0] + nx * band, a[1] + ny * band); g.lineTo(b[0] + nx * band, b[1] + ny * band); g.lineTo(b[0] + nx * (band + 0.05), b[1] + ny * (band + 0.05)); g.lineTo(a[0] + nx * (band + 0.05), a[1] + ny * (band + 0.05)); g.fill();
      const gr = g.createLinearGradient(a[0], a[1], a[0] + nx * band, a[1] + ny * band);
      gr.addColorStop(0, rgbS(hellF(blech, 0.25))); gr.addColorStop(0.5, rgbS(blech)); gr.addColorStop(1, rgbS(hellF(blech, -0.2)));
      g.fillStyle = gr;
      g.beginPath(); g.moveTo(a[0] - tx * 0.05, a[1] - ty * 0.05); g.lineTo(b[0] + tx * 0.05, b[1] + ty * 0.05); g.lineTo(b[0] + nx * band, b[1] + ny * band); g.lineTo(a[0] + nx * band, a[1] + ny * band); g.closePath(); g.fill();
      if (F.px > 30) { g.strokeStyle = rgbS(hellF(blech, -0.3), 0.6); g.lineWidth = Math.max(0.006, 0.7 / F.px); g.beginPath(); for (let t = 0.5; t < L; t += 0.5) { g.moveTo(a[0] + tx * t, a[1] + ty * t); g.lineTo(a[0] + tx * t + nx * band, a[1] + ty * t + ny * band); } g.stroke(); }
    }
  }
  function dachMaler(opt) {
    opt = opt || {};
    return function (g, F, I) {
      const x0 = I.A0, x1 = I.A0 + F.w, y0 = I.B0, y1 = I.B0 + F.h;
      let bE = -Infinity, bR = Infinity;
      for (const p of I.fl.pts) { const b = dot(p, I.v); bE = Math.max(bE, b); bR = Math.min(bR, b); }
      const W = I.W;
      const bauK = W.bau != null && opt.eindeck != null ? opt.eindeck : 1;
      if (bauK < 1) {
        /* Eindecken von der Traufe her: darüber Lattung auf den Sparren */
        const bG = bE - (bE - bR) * bauK;
        lattung(g, F, I, x0, y0, x1, bG + 0.05, opt);
        if (bauK <= 0) return;
        g.save(); g.beginPath(); g.rect(x0 - 1, bG, x1 - x0 + 2, y1 - bG + 1); g.clip();
        schiefer(g, F, I, x0, bG, x1, y1, bE, opt);
        g.restore();
        return;
      }
      schiefer(g, F, I, x0, y0, x1, y1, bE, opt);
      dachKanten(g, F, I, bE, bR, opt);
      if (W.winter && opt.steil) schneeSteil(g, F, I, x0, x1, bR, bE, opt.reihe || 0.17, opt.saat || 1, opt.steil === true ? 1 : opt.steil);
      else if (W.winter) schneeDach(g, F, I, x0, x1, bR, bE, { saat: opt.saat, oben: opt.schneeOben, rutsch: opt.rutsch });
      if (opt.schneefang && bE - bR > 3) schneefang(g, F, I, x0 + 0.3, x1 - 0.3, bE - 0.85);
      if (opt.gauben) for (const a of opt.gauben) fledermausgaube(g, F, I, a, bE - (bE - bR) * 0.42);
    };
  }
  /* Fledermausgaube: geschwungene Lüftungsöffnung. Die Schieferhaut hebt
     sich wie eine Welle (Licht oben, Schatten unten), darunter das
     dunkle Auge; im Winter trägt die Welle eine Schneehaube. */
  function fledermausgaube(g, F, I, a, b) {
    if (F.px < 7) return;
    const w = 1.6, h = 0.55, winter = I.W.winter;
    const sv = F.schatten ? F.schatten(0.25) : null;
    const welle = (p, dx, dy, k) => { p.moveTo(a - w + dx, b + 0.12 * k + dy); p.bezierCurveTo(a - w * 0.45 + dx, b + 0.1 * k + dy, a - w * 0.32 + dx, b - h * k + dy, a + dx, b - h * k + dy); p.bezierCurveTo(a + w * 0.32 + dx, b - h * k + dy, a + w * 0.45 + dx, b + 0.1 * k + dy, a + w + dx, b + 0.12 * k + dy); p.closePath(); };
    /* Schlagschatten der Welle */
    g.fillStyle = "rgba(12,16,30," + (winter ? 0.22 : 0.4) + ")";
    g.beginPath(); welle(g, sv ? sv[0] : 0.03, (sv ? Math.max(0.04, sv[1]) : 0.06), 1); g.fill();
    /* die Welle */
    const gr = g.createLinearGradient(0, b - h, 0, b + 0.1);
    const c = winter ? [238, 243, 251] : hellF(SCHIEFER, 0.12);
    gr.addColorStop(0, rgbS(hellF(c, 0.08))); gr.addColorStop(0.7, rgbS(c)); gr.addColorStop(1, rgbS(hellF(c, -0.12)));
    g.fillStyle = gr; g.beginPath(); welle(g, 0, 0, 1); g.fill();
    if (!winter && F.px > 20) { g.strokeStyle = rgbS(hellF(SCHIEFER, -0.3), 0.6); g.lineWidth = Math.max(0.006, 0.7 / F.px); for (let k = 0.3; k < 1; k += 0.22) { g.beginPath(); g.moveTo(a - w * k, b + 0.1); g.quadraticCurveTo(a, b - h * 2 * (1 - k) - 0.05, a + w * k, b + 0.1); g.stroke(); } }
    /* das Auge: dunkle Öffnung mit Lamellen */
    g.fillStyle = "rgb(16,16,20)"; g.beginPath(); g.ellipse(a, b + 0.1, w * 0.3, h * 0.52, 0, Math.PI, 2 * Math.PI); g.closePath(); g.fill();
    if (F.px > 30) { g.fillStyle = "rgba(90,84,76,0.8)"; for (let y = b - h * 0.4; y < b + 0.08; y += 0.07) g.fillRect(a - w * 0.26, y, w * 0.52, 0.018); }
  }
  /* Lattung auf den Sparren (Bauphase) */
  function lattung(g, F, I, x0, y0, x1, y1, opt) {
    if (y1 <= y0) return;
    g.save(); g.beginPath(); g.rect(x0 - 0.1, y0 - 0.1, x1 - x0 + 0.2, y1 - y0 + 0.1); g.clip();
    g.fillStyle = "rgb(40,34,30)"; g.fillRect(x0 - 0.1, y0 - 0.1, x1 - x0 + 0.2, y1 - y0 + 0.2);
    const holz = [196, 160, 112];
    g.fillStyle = rgbS(hellF(holz, -0.15));
    for (let x = Math.ceil(x0 / 0.85) * 0.85; x < x1; x += 0.85) g.fillRect(x - 0.06, y0 - 0.1, 0.12, y1 - y0 + 0.2);
    g.fillStyle = rgbS(holz);
    for (let y = y1; y > y0 - 0.2; y -= 0.34) g.fillRect(x0 - 0.1, y - 0.03, x1 - x0 + 0.2, 0.05);
    if (I.W.winter) { g.fillStyle = "rgba(244,247,252,0.85)"; for (let y = y1; y > y0 - 0.2; y -= 0.34) g.fillRect(x0 - 0.1, y - 0.045, x1 - x0 + 0.2, 0.02); }
    g.restore();
  }
  /* Traufblech (Kupfer, grün patiniert) mit überhängendem Schnee */
  function traufMaler(g, F, I) {
    const x0 = I.A0, x1 = I.A0 + F.w, y0 = I.B0, y1 = I.B0 + F.h;
    const gr = g.createLinearGradient(0, y0, 0, y1);
    gr.addColorStop(0, rgbS(hellF(KUPFER, 0.15))); gr.addColorStop(0.7, rgbS(KUPFER)); gr.addColorStop(1, rgbS(hellF(KUPFER, -0.35)));
    g.fillStyle = gr; g.fillRect(x0, y0, x1 - x0, y1 - y0);
    rausch(g, x0, y0, x1 - x0, y1 - y0, 1.4, 0.3, 13, 3);
    if (I.W.winter) {
      g.fillStyle = "rgb(244,247,252)";
      g.beginPath(); g.moveTo(x0, y0 - 0.1);
      for (let x = x0; x <= x1 + 0.2; x += 0.2) g.lineTo(x, y0 + (y1 - y0) * (0.35 + 0.35 * hash(Math.round(x * 5), 3, 7)));
      g.lineTo(x1, y0 - 0.1); g.closePath(); g.fill();
    }
  }
  function blechMaler(farbe) {
    return function (g, F, I) {
      const x0 = I.A0, y0 = I.B0;
      g.fillStyle = rgbS(farbe); g.fillRect(x0, y0, F.w, F.h);
      rausch(g, x0, y0, F.w, F.h, 1.2, 0.25, 19, 3);
      if (I.W.winter && I.n[2] > 0.3) { g.fillStyle = "rgb(242,246,252)"; g.fillRect(x0, y0, F.w, F.h); }
    };
  }
  /* Dachrinne: halbrunde Kupferrinne mit Wulst und Rinneisen */
  function rinneMaler(g, F, I) {
    const x0 = I.A0, x1 = I.A0 + F.w, y0 = I.B0, y1 = I.B0 + F.h;
    if (I.n[2] > 0.5) {
      g.fillStyle = "rgb(40,52,48)"; g.fillRect(x0, y0, x1 - x0, y1 - y0);
      if (I.W.winter) { g.fillStyle = "rgb(240,244,251)"; g.fillRect(x0, y0 + (y1 - y0) * 0.15, x1 - x0, (y1 - y0) * 0.7); }
      return;
    }
    const gr = g.createLinearGradient(0, y0, 0, y1);
    gr.addColorStop(0, rgbS(hellF(KUPFER, 0.35))); gr.addColorStop(0.25, rgbS(hellF(KUPFER, 0.1))); gr.addColorStop(0.8, rgbS(hellF(KUPFER, -0.2))); gr.addColorStop(1, rgbS(hellF(KUPFER, -0.45)));
    g.fillStyle = gr; g.fillRect(x0, y0, x1 - x0, y1 - y0);
    if (F.px > 16) { g.fillStyle = "rgba(30,36,34,0.7)"; for (let x = Math.ceil(x0 / 0.8) * 0.8; x < x1; x += 0.8) g.fillRect(x, y0, 0.03, y1 - y0); }
    rausch(g, x0, y0, x1 - x0, y1 - y0, 0.9, 0.3, 23, 3);
  }
  function rohrMaler(g, F, I) {
    const x0 = I.A0, y0 = I.B0, w = F.w, h = F.h;
    const gr = g.createLinearGradient(x0, 0, x0 + w, 0);
    gr.addColorStop(0, rgbS(hellF(KUPFER, 0.1))); gr.addColorStop(0.4, rgbS(hellF(KUPFER, 0.22))); gr.addColorStop(1, rgbS(hellF(KUPFER, -0.3)));
    g.fillStyle = gr; g.fillRect(x0, y0, w, h);
    if (F.px > 10 && Math.abs(I.n[2]) < 0.3) { g.fillStyle = "rgba(30,34,32,0.75)"; for (let z = 1.2; z < 9; z += 2.0) g.fillRect(x0, -z - 0.03, w, 0.06); }
  }
  /* Stufen: Sandsteinplatten, im Winter geräumter Mittelstreifen */
  function stufeMaler(g, F, I) {
    const x0 = I.A0, x1 = I.A0 + F.w, y0 = I.B0, y1 = I.B0 + F.h, c = hellF(I.W.werk, 0.04);
    g.fillStyle = rgbS(c); g.fillRect(x0, y0, x1 - x0, y1 - y0);
    if (F.px > 10) { g.fillStyle = rgbS(hellF(c, -0.35), 0.6); for (let x = Math.ceil(x0 / 1.05) * 1.05; x < x1; x += 1.05) g.fillRect(x, y0, Math.max(0.01, 0.7 / F.px), y1 - y0); }
    rausch(g, x0, y0, x1 - x0, y1 - y0, 1.0, 0.3, 41, 3);
    if (I.n[2] > 0.5) {
      /* Trittspur: in der Mitte ausgetreten und heller */
      const xm = (x0 + x1) / 2;
      const gt = g.createLinearGradient(xm - 1, 0, xm + 1, 0); gt.addColorStop(0, "rgba(255,240,220,0)"); gt.addColorStop(0.5, "rgba(255,240,220,0.18)"); gt.addColorStop(1, "rgba(255,240,220,0)");
      g.fillStyle = gt; g.fillRect(xm - 1, y0, 2, y1 - y0);
      if (I.W.winter) {
        g.fillStyle = "rgb(240,244,251)";
        g.fillRect(x0, y0, (x1 - x0) * 0.26, y1 - y0); g.fillRect(x1 - (x1 - x0) * 0.26, y0, (x1 - x0) * 0.26, y1 - y0);
        g.fillStyle = "rgba(236,240,248,0.55)"; g.fillRect(x0 + (x1 - x0) * 0.26, y0, (x1 - x0) * 0.48, y1 - y0);
        if (F.px > 30) { const rng = zuf(9); g.fillStyle = "rgba(255,255,255,0.9)"; for (let i = 0; i < 80; i++) g.fillRect(x0 + (x1 - x0) * (0.3 + rng() * 0.4), y0 + rng() * (y1 - y0), 0.012, 0.012); }
      }
    } else if (I.W.winter) {
      g.fillStyle = "rgb(240,244,251)"; g.fillRect(x0, y0, (x1 - x0) * 0.26, 0.03); g.fillRect(x1 - (x1 - x0) * 0.26, y0, (x1 - x0) * 0.26, 0.03);
    }
  }
  /* Eiszapfen an einer durchsichtigen Fläche unter der Traufe */
  function eisMaler(saat) {
    return function (g, F, I) {
      const lf = lichtVon(F, 0.15), x0 = I.A0, x1 = I.A0 + F.w, y0 = I.B0;
      const rng = zuf(saat);
      let x = x0 + rng() * 0.2;
      while (x < x1) {
        const l = 0.08 + Math.pow(rng(), 2.3) * 0.62, b = 0.022 + l * 0.1;
        const gr = g.createLinearGradient(x - b, 0, x + b, 0);
        gr.addColorStop(0, belicht([196, 222, 244], lf, 0.7)); gr.addColorStop(0.35, belicht([250, 254, 255], lf, 0.95)); gr.addColorStop(1, belicht([150, 180, 214], lf, 0.7));
        g.fillStyle = gr;
        g.beginPath(); g.moveTo(x - b, y0); g.quadraticCurveTo(x - b * 0.35, y0 + l * 0.6, x, y0 + l); g.quadraticCurveTo(x + b * 0.35, y0 + l * 0.6, x + b, y0); g.closePath(); g.fill();
        x += 0.07 + rng() * 0.3;
      }
    };
  }

  /* =====================================================================
     FIGUREN: Turmkreuz / Wetterhahn, Giebelkreuz, Christbäume,
     Herrnhuter Stern, Frühlingsblumen
     ===================================================================== */
  /* Richtung (Modell) → Bildversatz je Meter */
  function bildRichtung(gier, d) {
    const r = gier * RAD, c = Math.cos(r), s = Math.sin(r);
    const a = d[0] * c - d[1] * s, b = d[0] * s + d[1] * c;
    return [(a - b) * ST.KX, (a + b) * ST.KY - (d[2] || 0) * ST.KZ];
  }
  function turmspitze(hahn) {
    return function (g, s, F) {
      const sch = F.schatten, gier = F.gier || 0;
      const lf = sch ? [0, 0, 0] : ST.lichtFaktor([0, 0, 1], F.Z, 0.1, F.jahr);
      const gold = sch ? "#000" : belicht(GOLD, lf), goldH = sch ? "#000" : belicht(hellF(GOLD, 0.45), lf), goldD = sch ? "#000" : belicht(hellF(GOLD, -0.35), lf);
      const z = (m) => -m * ST.KZ * s;
      /* Stange */
      g.fillStyle = sch ? "#000" : belicht([60, 62, 66], lf);
      g.fillRect(-0.035 * s, z(hahn ? 2.1 : 1.0), 0.07 * s, -z(hahn ? 2.1 : 1.0));
      /* Turmknopf */
      const ky = z(0.62), kr = 0.22 * s;
      if (sch) { g.beginPath(); g.arc(0, ky, kr, 0, 2 * Math.PI); g.fill(); }
      else { const gr = g.createRadialGradient(-kr * 0.35, ky - kr * 0.35, kr * 0.1, 0, ky, kr); gr.addColorStop(0, goldH); gr.addColorStop(0.6, gold); gr.addColorStop(1, goldD); g.fillStyle = gr; g.beginPath(); g.arc(0, ky, kr, 0, 2 * Math.PI); g.fill(); }
      if (!hahn) {
        /* Kreuz: Arme in Nord-Süd-Richtung, ~1,4 m hoch */
        const arm = bildRichtung(gier, [0, 1, 0]);
        const b = 0.075 * s;
        g.strokeStyle = gold; g.lineWidth = b; g.lineCap = "square";
        g.beginPath(); g.moveTo(0, z(0.85)); g.lineTo(0, z(2.2)); g.stroke();
        const ay = z(1.8);
        g.beginPath(); g.moveTo(-arm[0] * 0.42 * s, ay - arm[1] * 0.42 * s); g.lineTo(arm[0] * 0.42 * s, ay + arm[1] * 0.42 * s); g.stroke();
        if (!sch && s > 30) { g.strokeStyle = goldH; g.lineWidth = b * 0.3; g.beginPath(); g.moveTo(-b * 0.2, z(0.9)); g.lineTo(-b * 0.2, z(2.15)); g.stroke(); }
        g.lineCap = "butt";
      } else {
        /* Windrichtungskreuz N–S und O–W, darauf der Hahn */
        const nx = bildRichtung(gier, [0, -1, 0]), ox = bildRichtung(gier, [1, 0, 0]), hy = z(1.35);
        g.strokeStyle = sch ? "#000" : belicht([50, 50, 54], lf); g.lineWidth = 0.04 * s;
        g.beginPath(); g.moveTo(-nx[0] * 0.5 * s, hy - nx[1] * 0.5 * s); g.lineTo(nx[0] * 0.5 * s, hy + nx[1] * 0.5 * s); g.moveTo(-ox[0] * 0.5 * s, hy - ox[1] * 0.5 * s); g.lineTo(ox[0] * 0.5 * s, hy + ox[1] * 0.5 * s); g.stroke();
        if (!sch && s > 24) {
          g.fillStyle = gold; g.font = "bold " + (0.18 * s).toFixed(1) + "px serif"; g.textAlign = "center"; g.textBaseline = "middle";
          for (const [d, t] of [[[0, -1, 0], "N"], [[0, 1, 0], "S"], [[1, 0, 0], "O"], [[-1, 0, 0], "W"]]) { const q = bildRichtung(gier, d); g.fillText(t, q[0] * 0.62 * s, hy + q[1] * 0.62 * s); }
        }
        /* Hahn: flaches Kupferblech, vergoldet, in der Ost-West-Ebene –
           Kamm, Schnabel, Kehllappen, Sichelfedern am Schwanz */
        const u = bildRichtung(gier, [1, 0, 0]);
        g.save(); g.transform(u[0] * s, u[1] * s, 0, -ST.KZ * s, 0, z(1.95));
        const hahnPfad = () => {
          g.beginPath();
          g.moveTo(-0.30, 0.12);
          g.quadraticCurveTo(-0.47, 0.34, -0.36, 0.66); g.quadraticCurveTo(-0.30, 0.46, -0.21, 0.42);
          g.quadraticCurveTo(-0.25, 0.62, -0.13, 0.70); g.quadraticCurveTo(-0.13, 0.48, -0.04, 0.39);
          g.quadraticCurveTo(0.08, 0.35, 0.15, 0.42); g.lineTo(0.19, 0.54);
          g.quadraticCurveTo(0.19, 0.63, 0.23, 0.62); g.quadraticCurveTo(0.24, 0.69, 0.28, 0.645); g.quadraticCurveTo(0.31, 0.70, 0.335, 0.62);
          g.lineTo(0.35, 0.585); g.lineTo(0.42, 0.56); g.lineTo(0.35, 0.535);
          g.quadraticCurveTo(0.35, 0.47, 0.315, 0.485);
          g.quadraticCurveTo(0.31, 0.36, 0.22, 0.25); g.quadraticCurveTo(0.12, 0.13, -0.02, 0.13);
          g.lineTo(0.03, 0.02); g.lineTo(0.0, 0.0); g.lineTo(0.08, 0.0); g.lineTo(0.06, 0.03); g.lineTo(0.05, 0.13);
          g.quadraticCurveTo(-0.16, 0.10, -0.30, 0.12); g.closePath();
        };
        hahnPfad(); g.fillStyle = gold; g.fill();
        if (!sch && s > 20) {
          g.lineWidth = 0.012; g.strokeStyle = goldD; g.stroke();
          g.strokeStyle = goldH; g.lineWidth = 0.02;
          g.beginPath(); g.moveTo(-0.32, 0.2); g.quadraticCurveTo(-0.38, 0.4, -0.33, 0.58); g.moveTo(-0.18, 0.44); g.quadraticCurveTo(-0.2, 0.56, -0.13, 0.64); g.stroke();
          g.fillStyle = "rgb(190,40,40)"; g.beginPath(); g.moveTo(0.2, 0.6); g.quadraticCurveTo(0.24, 0.69, 0.28, 0.645); g.quadraticCurveTo(0.31, 0.7, 0.335, 0.62); g.closePath(); g.fill();
          g.fillStyle = "rgb(30,24,20)"; g.beginPath(); g.arc(0.3, 0.575, 0.012, 0, 2 * Math.PI); g.fill();
        }
        g.restore();
      }
    };
  }
  /* Steinernes Giebelkreuz auf dem Ostgiebel: Sockel und Kreuz als echte
     kleine Steinkörper (Schaft, zwei Arme), jede Seite nach ihrer Lage zum
     Licht, im Winter Schnee auf allen Oberseiten. Die Arme liegen in der
     Giebelebene (Nord-Süd). */
  function giebelkreuz(c) {
    return function (g, s, F) {
      const sch = F.schatten, r = (F.gier || 0) * RAD, co = Math.cos(r), si = Math.sin(r);
      const winter = F.jahr === "winter";
      const farbe = (n, d) => {
        if (sch) return "#000";
        if (winter && n[2] > 0.5) return belicht([236, 240, 247], ST.lichtFaktor([0, 0, 1], F.Z, 0, F.jahr));
        return belicht(hellF(c, d), ST.lichtFaktor([n[0] * co - n[1] * si, n[0] * si + n[1] * co, n[2]], F.Z, 0.03, F.jahr));
      };
      const P = (x, y, z) => { const q = bildRichtung(F.gier || 0, [x, y, z]); return [q[0] * s, q[1] * s]; };
      const sx = co + si >= 0 ? 1 : -1, sy = co - si >= 0 ? 1 : -1;
      const flaeche = (pts, n, d) => { g.fillStyle = farbe(n, d); g.beginPath(); pts.forEach((p, k) => (k ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.closePath(); g.fill(); };
      const quader = (x0, x1, y0, y1, z0, z1) => {
        const xs = sx > 0 ? x1 : x0, ys = sy > 0 ? y1 : y0;
        flaeche([P(xs, y0, z0), P(xs, y1, z0), P(xs, y1, z1), P(xs, y0, z1)], [sx, 0, 0], -0.02);
        flaeche([P(x0, ys, z0), P(x1, ys, z0), P(x1, ys, z1), P(x0, ys, z1)], [0, sy, 0], -0.02);
        flaeche([P(x0, y0, z1), P(x1, y0, z1), P(x1, y1, z1), P(x0, y1, z1)], [0, 0, 1], 0.08);
      };
      /* Sockel mit Deckplatte */
      quader(-0.15, 0.15, -0.2, 0.2, 0, 0.24);
      quader(-0.18, 0.18, -0.24, 0.24, 0.24, 0.32);
      /* Kreuz: ferner Arm, Schaft, naher Arm */
      const d = 0.075, b = 0.08, za = 0.98, zb = 1.14;
      quader(-d, d, sy > 0 ? -0.42 : b, sy > 0 ? -b : 0.42, za, zb);
      quader(-d, d, -b, b, 0.32, 1.48);
      quader(-d, d, sy > 0 ? b : -0.42, sy > 0 ? 0.42 : -b, za, zb);
      /* feine Kante an der Lichtseite */
      if (!sch && s > 40) {
        g.strokeStyle = "rgba(255,240,225,0.25)"; g.lineWidth = 0.7;
        const xs = sx > 0 ? d : -d, a = P(xs, -b, 0.33), e = P(xs, -b, 1.47);
        g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(e[0], e[1]); g.stroke();
      }
    };
  }
  /* Knauf mit kleinem Kreuz auf der Spitze des Chordachs */
  function chorknauf(g, s, F) {
    const sch = F.schatten, z = (m) => -m * ST.KZ * s;
    const lf = sch ? null : ST.lichtFaktor([0, 0, 1], F.Z, 0.1, F.jahr);
    const gold = sch ? "#000" : belicht(GOLD, lf), goldH = sch ? "#000" : belicht(hellF(GOLD, 0.4), lf);
    g.fillStyle = sch ? "#000" : belicht([60, 62, 66], lf); g.fillRect(-0.025 * s, z(1.1), 0.05 * s, -z(1.1));
    g.fillStyle = gold; g.beginPath(); g.arc(0, z(0.45), 0.12 * s, 0, 2 * Math.PI); g.fill();
    if (!sch) { g.fillStyle = goldH; g.beginPath(); g.arc(-0.04 * s, z(0.49), 0.04 * s, 0, 2 * Math.PI); g.fill(); }
    const arm = bildRichtung(F.gier || 0, [0, 1, 0]);
    g.strokeStyle = gold; g.lineWidth = 0.05 * s; g.beginPath(); g.moveTo(0, z(0.6)); g.lineTo(0, z(1.15)); g.moveTo(-arm[0] * 0.18 * s, z(0.95) - arm[1] * 0.18 * s); g.lineTo(arm[0] * 0.18 * s, z(0.95) + arm[1] * 0.18 * s); g.stroke();
  }
  /* Forsythie in voller Blüte (Frühling): überhängende Ruten, gelbe Blüten */
  function forsythie(g, s, F) {
    const sch = F.schatten, rng = zuf(81), z = (m) => -m * ST.KZ * s;
    const lf = sch ? null : ST.lichtFaktor([0.2, 0.5, 0.8], F.Z, 0.05, F.jahr);
    const ruten = [];
    for (let i = 0; i < 26; i++) {
      const a = -Math.PI / 2 + (rng() - 0.5) * 2.2, l = 1.1 + rng() * 0.8;
      const ex = Math.cos(a) * l * 0.75, ey = 0.3 + (-Math.sin(a)) * l * 0.9;
      ruten.push([ex, ey, ex * 1.25, ey * 0.75 - 0.2]);
    }
    if (sch) { g.fillStyle = "#000"; g.beginPath(); g.ellipse(0, z(0.8), 1.0 * s, 0.8 * ST.KZ * s, 0, 0, 2 * Math.PI); g.fill(); return; }
    g.lineWidth = Math.max(0.6, 0.02 * s); g.strokeStyle = belicht([110, 86, 58], lf);
    g.beginPath(); for (const [mx, my, ex, ey] of ruten) { g.moveTo(0, 0); g.quadraticCurveTo(mx * s, z(my), ex * s, z(Math.max(0.2, ey))); } g.stroke();
    const gelb = [[250, 208, 40], [255, 226, 80], [226, 176, 20]];
    for (const [mx, my, ex, ey] of ruten) for (let k = 0; k < 16; k++) {
      const t = 0.3 + 0.7 * rng(), x = 2 * (1 - t) * t * mx + t * t * ex, y = 2 * (1 - t) * t * my + t * t * Math.max(0.2, ey);
      g.fillStyle = belicht(gelb[(rng() * 3) | 0], lf); g.beginPath(); g.arc((x + (rng() - 0.5) * 0.08) * s, z(y + (rng() - 0.5) * 0.08), Math.max(0.6, 0.035 * s), 0, 2 * Math.PI); g.fill();
    }
  }
  /* Liegt die Südseite (Portal) zum Betrachter hin? Sonst ist der Schein
     der Lichter vom Portal verdeckt und darf nicht durch das Dach leuchten. */
  function sichtSued(gier) {
    const r = (gier || 0) * RAD;
    return 0.6124 * (Math.cos(r) - Math.sin(r)) > -0.04;
  }
  /* kleine Nordmanntanne im Holzkübel mit Lichterkette: Astetagen aus
     vielen hängenden Zweigen, links heller (Sonne), innen dunkel,
     Schneepolster auf den Zweigen, warme Birnchen */
  function christbaum(saat) {
    return function (g, s, F) {
      const sch = F.schatten, rng = zuf(saat);
      const lf = sch ? null : ST.lichtFaktor([0.2, 0.5, 0.8], F.Z, 0, F.jahr);
      const col = (c, a) => (sch ? "#000" : belicht(c, lf, a));
      const z = (m) => -m * ST.KZ * s;
      /* Kübel aus Holzdauben mit Eisenreifen */
      g.fillStyle = col([112, 76, 46]); g.beginPath(); g.moveTo(-0.3 * s, 0); g.lineTo(0.3 * s, 0); g.lineTo(0.36 * s, z(0.48)); g.lineTo(-0.36 * s, z(0.48)); g.closePath(); g.fill();
      if (!sch) {
        g.fillStyle = col([86, 58, 36]); for (let k = -3; k <= 3; k++) g.fillRect(k * 0.09 * s - 0.004 * s, z(0.47), 0.008 * s, 0.46 * ST.KZ * s);
        g.fillStyle = col([52, 48, 46]); g.fillRect(-0.35 * s, z(0.42), 0.7 * s, 0.035 * s); g.fillRect(-0.32 * s, z(0.1), 0.64 * s, 0.035 * s);
      }
      const H = 2.35, basis = 0.5, lagen = 8;
      for (let i = 0; i < lagen; i++) {
        const t0 = i / lagen, zu = basis + (H - basis - 0.25) * t0, zo = Math.min(H, zu + 0.55);
        const br = 0.66 * Math.pow(1 - t0, 0.95) + 0.06;
        const n = 12;
        /* Umriss der Etage: hängende Zweigspitzen */
        const pfad = () => {
          g.beginPath(); g.moveTo(0, z(zo));
          for (let k = 0; k <= n; k++) {
            const tt = k / n, x = (-1 + 2 * tt) * br, h = zu + 0.06 * Math.sin(tt * Math.PI) - (k % 2 ? 0.07 : 0) + (rng() - 0.5) * 0.04;
            g.lineTo(x * s, z(h));
          }
          g.closePath();
        };
        if (sch) { g.fillStyle = "#000"; pfad(); g.fill(); continue; }
        const gr = g.createLinearGradient(-br * s, 0, br * s, 0);
        gr.addColorStop(0, belicht([52, 100, 62], lf)); gr.addColorStop(0.5, belicht([30, 68, 42], lf)); gr.addColorStop(1, belicht([18, 44, 30], lf));
        g.fillStyle = gr; pfad(); g.fill();
        /* Nadeln an den Zweigspitzen */
        if (s > 24) {
          g.lineWidth = Math.max(0.6, 0.012 * s);
          for (let k = 0; k < 26; k++) {
            const x = (rng() * 2 - 1) * br, y = zu + 0.05 + rng() * 0.3 * (1 - Math.abs(x) / br);
            g.strokeStyle = belicht(hellF([40, 86, 52], (rng() - 0.3) * 0.5), lf, 0.8);
            g.beginPath(); g.moveTo(x * s, z(y)); g.lineTo((x + (x > 0 ? 0.06 : -0.06)) * s, z(y - 0.05)); g.stroke();
          }
        }
        if (F.jahr === "winter") {
          /* Schneepolster oben auf der Etage, in Stücken */
          g.fillStyle = belicht([244, 248, 253], lf);
          for (let k = 0; k < 4; k++) {
            const x = (-0.7 + 0.45 * k + (rng() - 0.5) * 0.15) * br, w = br * (0.22 + rng() * 0.12);
            g.beginPath(); g.ellipse(x * s, z(zu + 0.12 + (0.3 - Math.abs(x) / br * 0.25)), w * s, 0.045 * s, (x < 0 ? 0.35 : -0.35), 0, 2 * Math.PI); g.fill();
          }
        }
      }
      if (sch) return;
      /* Lichterkette: kleine warme Birnchen, nachts leuchtend */
      const rng2 = zuf(saat + 3);
      for (let i = 0; i < 40; i++) {
        const t = rng2(), zz = basis + 0.12 + t * (H - basis - 0.35), br = (0.66 * Math.pow(1 - (zz - basis) / (H - basis), 0.95) + 0.05) * (0.25 + rng2() * 0.65);
        const x = (rng2() * 2 - 1) * br * s, y = z(zz);
        if (F.nacht > 0.05) {
          g.fillStyle = "rgba(255,226,150," + (0.6 + 0.4 * F.nacht).toFixed(2) + ")"; g.beginPath(); g.arc(x, y, Math.max(0.8, 0.026 * s), 0, 2 * Math.PI); g.fill();
          if (i % 4 === 0 && sichtSued(F.gier)) F.leuchtPunkt(x, y, 0.35 * s, "255,200,120", 0.25);
        } else { g.fillStyle = "rgba(250,240,210,0.9)"; g.beginPath(); g.arc(x, y, Math.max(0.5, 0.016 * s), 0, 2 * Math.PI); g.fill(); }
      }
      /* Stern an der Spitze */
      g.fillStyle = F.nacht > 0.05 ? "rgb(255,236,160)" : col(GOLD);
      stern5(g, 0, z(H + 0.08), 0.1 * s);
      if (F.nacht > 0.05 && sichtSued(F.gier)) F.leuchtPunkt(0, z(H + 0.08), 0.5 * s, "255,220,140", 0.35);
    };
  }
  function stern5(g, x, y, r) {
    g.beginPath();
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); }
    g.closePath(); g.fill();
  }
  /* Herrnhuter Stern: 26 Zacken (18 vierkantige, 8 dreikantige) */
  const STERN_RICHTUNGEN = (function () {
    const r = [];
    for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) for (let z = -1; z <= 1; z++) { if (!x && !y && !z) continue; r.push(nrm([x, y, z])); }
    return r;
  })();
  function herrnhuter(g, s, F) {
    const sch = F.schatten, gier = F.gier || 0, R = 0.34, cy = -0.55 * ST.KZ * s;
    /* Kette zum Arm */
    g.strokeStyle = sch ? "#000" : "rgb(40,40,44)"; g.lineWidth = Math.max(1, 0.02 * s);
    g.beginPath(); g.moveTo(0, -1.15 * ST.KZ * s); g.lineTo(0, cy); g.stroke();
    const e = [0.6124, 0.6124, 0.5];
    const r = gier * RAD, c = Math.cos(r), sn = Math.sin(r);
    const zack = STERN_RICHTUNGEN.map((d) => {
      const a = d[0] * c - d[1] * sn, b = d[0] * sn + d[1] * c;
      return { d: d, x: (a - b) * ST.KX, y: (a + b) * ST.KY - d[2] * ST.KZ, t: a * e[0] + b * e[1] + d[2] * e[2] };
    }).sort((p, q) => p.t - q.t);
    const nacht = F.nacht || 0;
    for (const z of zack) {
      const L = R * s * (Math.abs(z.d[0]) + Math.abs(z.d[1]) + Math.abs(z.d[2]) === 3 ? 0.92 : 1);
      const tx = z.x * L, ty = cy + z.y * L;
      const bx = -z.y, by = z.x, bl = Math.hypot(bx, by) || 1, b = 0.13 * s;
      if (sch) g.fillStyle = "#000";
      else {
        const k = 0.55 + 0.45 * (z.t + 1) / 2;
        const tagF = [236 * k, 232 * k, 222 * k];
        const col = nacht > 0.05 ? mischF(tagF, [255, 238, 190], nacht) : tagF;
        g.fillStyle = rgbS(z.d[0] > 0.5 && !nacht ? mischF(col, [200, 40, 50], 0.6) : col);
      }
      g.beginPath(); g.moveTo(tx, ty); g.lineTo(bx / bl * b, cy + by / bl * b); g.lineTo(-bx / bl * b, cy - by / bl * b); g.closePath(); g.fill();
    }
    if (!sch) {
      g.fillStyle = nacht > 0.05 ? "rgb(255,244,210)" : "rgb(226,222,210)";
      g.beginPath(); g.arc(0, cy, 0.13 * s, 0, 2 * Math.PI); g.fill();
      if (nacht > 0.05 && sichtSued(F.gier)) F.leuchtPunkt(0, cy, 1.4 * s, "255,226,160", 0.7);
    }
  }
  /* Frühlingsblumen am Mauerfuß: Narzissen, Tulpen, Traubenhyazinthen */
  function blumen(saat) {
    return function (g, s, F) {
      if (F.schatten) return;
      const rng = zuf(saat), lf = ST.lichtFaktor([0.2, 0.5, 0.8], F.Z, 0.05, F.jahr);
      const z = (m) => -m * ST.KZ * s;
      for (let i = 0; i < 16; i++) {
        const x = (rng() - 0.5) * 1.1 * s, y = (rng() - 0.5) * 0.2 * s, h = 0.18 + rng() * 0.18;
        g.strokeStyle = belicht([70, 128, 58], lf); g.lineWidth = Math.max(0.8, 0.02 * s);
        g.beginPath(); g.moveTo(x, y); g.lineTo(x + (rng() - 0.5) * 0.04 * s, y + z(h)); g.stroke();
        const art = rng();
        const c = art < 0.4 ? [246, 214, 60] : art < 0.7 ? [214, 48, 60] : art < 0.85 ? [110, 96, 200] : [250, 248, 240];
        g.fillStyle = belicht(c, lf);
        g.beginPath(); g.ellipse(x, y + z(h), 0.045 * s, 0.06 * s, 0, 0, 2 * Math.PI); g.fill();
      }
    };
  }

  /* =====================================================================
     DER BAU — alle Körper
     ===================================================================== */
  function kircheBauen(W, o) {
    const winter = W.winter;
    const Z = W.Z;          // Bauzustand
    const zeiger = !o.objekt;

    /* ---------------- Wandbeschreibungen ---------------- */
    const turmOeff = (west) => {
      const l = [];
      if (west) {
        l.push({ art: "portal", a: 0, w: 1.5, z0: 0.3, zk: 2.55, stufen: 2, st: 0.14, tiefe: 0.4 });
        l.push({ art: "lanzette", a: 0, w: 0.55, z0: 5.9, zk: 7.9 });
      } else l.push({ art: "lanzette", da: 0, w: 0.3, z0: 3.8, zk: 5.3 });
      l.push({ art: "lanzette", da: 0, w: 0.45, z0: 12.2, zk: 14.1 });
      l.push({ art: "uhr", da: 0, z: TU.uhr, r: TU.uhrR, zeiger: zeiger, zeigt: Z.uhr });
      l.push({ art: "schall", da: 0, w: TU.glW, z0: TU.glU, zk: TU.glK, laeden: Z.laeden });
      return l;
    };
    const TS = {
      sued: { saat: 11, flut: true, ecken: [[TU.x0, 1], [TU.x1, -1]], sockel: 0.9, gesimse: [TU.g1, TU.g2], oeff: turmOeff(false), efeu: [TU.x0 - 0.05, TU.x0 + 2.9, 9.5] },
      nord: { saat: 12, flut: true, ecken: [[-TU.x1, 1], [-TU.x0, -1]], sockel: 0.9, gesimse: [TU.g1, TU.g2], oeff: turmOeff(false) },
      west: { saat: 13, flut: true, ecken: [[-TU.y, 1], [TU.y, -1]], sockel: 0.9, gesimse: [TU.g1, TU.g2], oeff: turmOeff(true), efeu: [0.95, TU.y + 0.05, 6.5] },
      ost: { saat: 14, flut: true, ecken: [[-TU.y, 1], [TU.y, -1]], gesimse: [TU.g2], oeff: turmOeff(false).slice(1) }
    };
    const fenster = (a, extra) => Object.assign({ art: "fenster", a: a, w: FE.w, z0: FE.z0, zk: FE.zk, bahnen: 2, tiefe: 0.32, saat: (a * 13) | 0 }, extra || {});
    const LS = {
      sued: { saat: 21, innenTuer: { a: PO.xm, w: 1.8, z0: 0.6, zk: 2.9 }, ecken: [[LH.x0, 1], [LH.x1, -1]], sockel: 0.9, traufe: LH.tr, oeff: [fenster(-9.25, { glas: Z.glas(0) }), fenster(1.75, { glas: Z.glas(2) }), fenster(7.25, { glas: Z.glas(3) }), { art: "rose", a: -3.75, z: ROSE.z, r: ROSE.r, glas: Z.glas(1) }] },
      nord: { saat: 22, ecken: [[-LH.x1, 1], [-LH.x0, -1]], sockel: 0.9, traufe: LH.tr, oeff: FE.x.map((x, i) => fenster(-x, { glas: Z.glas(4 + i) })) },
      west: { saat: 23, ecken: [[-LH.y, 1], [LH.y, -1]], sockel: 0.9 },
      ost: { saat: 24, ecken: [[-LH.y, 1], [LH.y, -1]], sockel: 0.9 }
    };
    const chorFenster = (w, i) => ({ art: "fenster", w: w, z0: 3.1, zk: 5.9, bahnen: 2, tiefe: 0.3, saat: 70 + i, glas: Z.glas(8 + i) });
    const CS = {
      s: { saat: 31, sockel: 0.9, traufe: CH.tr, oeff: [chorFenster(1.3, 0)] },
      so: { saat: 32, sockel: 0.9, traufe: CH.tr, oeff: [chorFenster(1.2, 1)] },
      o: { saat: 33, sockel: 0.9, traufe: CH.tr, oeff: [chorFenster(1.2, 2)] },
      no: { saat: 34, sockel: 0.9, traufe: CH.tr, oeff: [chorFenster(1.2, 3)] },
      n: { saat: 35, sockel: 0.9, traufe: CH.tr }
    };
    const SS = {
      nord: { saat: 41, ecken: [[-SA.x1, 1], [-SA.x0, -1]], sockel: 0.6, oeff: [{ art: "gitter", da: 0, w: 0.6, h: 0.9, z0: 2.0 }] },
      ost: { saat: 42, ecken: [[CH.y, 1], [-SA.y0, -1]], sockel: 0.6, oeff: [{ art: "tuer", a: 5.2, w: 0.95, z0: 0.15, zk: 1.85 }] },
      west: { saat: 43, ecken: [[SA.y0, 1]], sockel: 0.6 }
    };
    const wand = (spec) => ({ malen: wandMaler(spec), danach: wandNacht(spec), ao: true });
    const nachNormale = (n, tab) => {
      let best = null, bd = -2;
      for (const [d, s] of tab) { const k = n[0] * d[0] + n[1] * d[1]; if (k > bd) { bd = k; best = s; } }
      return best;
    };

    /* ---------------- Turm ---------------- */
    const turmMal = (fl) => {
      if (Math.abs(fl.n[2]) > 0.5) return null;
      return wand(nachNormale(fl.n, [[[0, 1], TS.sued], [[0, -1], TS.nord], [[-1, 0], TS.west], [[1, 0], TS.ost]]));
    };
    const hT = Z.turmH;
    if (Z.grubeT > 0.02) grubeBauen(W, Z.grubeT);
    if (Z.fundament >= 0) fundamenteBauen(W, Z);
    if (Z.aushub > 0.02) W.figur("aushub", { x: -16, y: 5.7, z: 0, breite: 5, hoehe: 1.8, malen: aushubFigur(Z.aushub, W.winter) }, [2.2, 1.2]);
    if (hT > 0 && Z.turmSchale) rohbauTurm(W, TS, hT);
    else if (hT > 0) W.koerper("turm", quaderP(TU.x0, -TU.y, 0, TU.x1, TU.y, TU.h), turmMal, { wirft: true, bisZ: hT });
    if (Z.helmGeruest > 0) helmGeruest(W, Z.helmGeruest);
    if (Z.turmFertig) {
      const ge = TU.ge;
      W.koerper("turm-gesims", quaderP(TU.xm - ge, -ge, TU.h, TU.xm + ge, ge, TU.gz), (fl) => (fl.n[2] > 0.5 || fl.n[2] < -0.5 ? null : { malen: gesimsKoerperMaler }), { wirft: true });
    }
    helmBauen(W, o);

    /* ---------------- Langhaus ---------------- */
    const lhMal = (fl) => {
      if (Math.abs(fl.n[2]) > 0.3) return fl.n[2] > 0 && Z.mauerKappe ? { malen: mauerkrone } : null;
      return wand(nachNormale(fl.n, [[[0, 1], LS.sued], [[0, -1], LS.nord], [[-1, 0], LS.west], [[1, 0], LS.ost]]));
    };
    if (Z.schale) { if (Z.lhH > 0) rohbauLanghaus(W, LS, Z.lhH); }
    else W.koerper("langhaus", [
      [LH.x0, -LH.y, 0], [LH.x1, -LH.y, 0], [LH.x1, LH.y, 0], [LH.x0, LH.y, 0],
      [LH.x0, -LH.y, LH.tr], [LH.x1, -LH.y, LH.tr], [LH.x1, LH.y, LH.tr], [LH.x0, LH.y, LH.tr],
      [LH.x0, 0, LH.zf], [LH.x1, 0, LH.zf]], lhMal, { wirft: true, bisZ: Z.lhH });
    /* Dachplatten Süd und Nord */
    if (Z.dachLH) for (const sy of [1, -1]) {
      const ye = sy * (LH.y + LH.ue), p = [];
      for (const x of [LH.x0, LH.x1 + LH.ort]) p.push([x, 0, LH.zf], [x, 0, LH.zf + LH.dv], [x, ye, LH.ze], [x, ye, LH.ze + LH.dv]);
      const dm = dachMaler({ saat: sy > 0 ? 5 : 6, schneefang: true, gauben: [-6.5, 4.0], eindeck: Z.eindeckLH, rutsch: true });
      W.koerper("dach-lh" + sy, p, (fl) => {
        if (fl.n[2] > 0.3) return { malen: dm };
        if (fl.n[2] < -0.3) return null;
        if (Math.abs(fl.n[1]) > 0.9 && Math.abs(fl.d) > 1) return { malen: traufMaler };
        if (Math.abs(fl.n[0]) > 0.9) return { malen: blechMaler([84, 92, 104]) };
        return null;
      }, { wirft: true });
    }

    /* ---------------- Chor ---------------- */
    const cg = chorGrund(0);
    const chorMal = (fl) => {
      if (Math.abs(fl.n[2]) > 0.3) return fl.n[2] > 0 && Z.mauerKappe ? { malen: mauerkrone } : null;
      const q = Math.SQRT1_2;
      return wand(nachNormale(fl.n, [[[0, 1], CS.s], [[q, q], CS.so], [[1, 0], CS.o], [[q, -q], CS.no], [[0, -1], CS.n], [[-1, 0], CS.n]]));
    };
    if (Z.schale) { if (Z.chH > 0) rohbauChor(W, CS, Z.chH); }
    else W.koerper("chor", prisma(cg, 0, CH.tr).concat([[CH.x0, 0, CH.zf], [CH.xc, 0, CH.zf]]), chorMal, { wirft: true, bisZ: Z.chH });
    if (Z.dachstuhlLH > 0) dachstuhlLH(W, Z.dachstuhlLH);
    if (Z.dachstuhlCH > 0) dachstuhlCH(W, Z.dachstuhlCH);
    if (Z.richtbaum) { const rb = W.figur("richtbaum", { x: LH.x1 - 0.5, y: 0, z: LH.zf + 0.2, breite: 1.2, hoehe: 2.5, malen: richtbaum }, [0.3, 0.4]); if (rb) rb.nach = W.k.filter((K) => /^(dach-lh|langhaus)/.test(K.name)); }
    if (Z.dachCH) {
      const cu = chorGrund(CH.ue);
      const f0 = [CH.x0, 0], f1 = [CH.xc, 0];
      const facetten = [[cu[0], cu[1], f1, f0], [cu[1], cu[2], f1], [cu[2], cu[3], f1], [cu[3], cu[4], f1], [cu[4], cu[5], f0, f1]];
      facetten.forEach((fc, i) => {
        const a = fc[0], b = fc[1];
        const t = nrm([b[0] - a[0], b[1] - a[1], 0]), inn = [-t[1], t[0]];
        const hoehe = (x, y) => CH.ze + ((x - a[0]) * inn[0] + (y - a[1]) * inn[1]) * NEIG;
        const p = [];
        for (const q of fc) { const z = hoehe(q[0], q[1]); p.push([q[0], q[1], z], [q[0], q[1], z + CH.dv]); }
        const dm = dachMaler({ saat: 40 + i, eindeck: Z.eindeckCH, schneefang: i === 0 || i === 4, rutsch: i === 0 || i === 4 });
        W.koerper("dach-ch" + i, p, (fl) => {
          if (fl.n[2] > 0.3) return { malen: dm };
          if (fl.n[2] < -0.3) return null;
          /* Stirnbrett an der Traufe: die Ebene durch die Traufkante */
          const d = fl.n[0] * a[0] + fl.n[1] * a[1];
          if (Math.abs(fl.d - d) < 0.01 && Math.abs(fl.n[0] * inn[0] + fl.n[1] * inn[1] + 1) < 0.01) return { malen: traufMaler };
          return null;
        }, { wirft: true });
      });
    }

    /* ---------------- Sakristei ---------------- */
    if (Z.sakristei > 0) {
      const sMal = (fl) => {
        if (Math.abs(fl.n[2]) > 0.3) return fl.n[2] > 0 && Z.mauerKappe ? { malen: mauerkrone } : null;
        return wand(nachNormale(fl.n, [[[0, -1], SS.nord], [[1, 0], SS.ost], [[-1, 0], SS.west]]));
      };
      W.koerper("sakristei", [[SA.x0, SA.y0, 0], [SA.x1, SA.y0, 0], [SA.x1, SA.y1, 0], [SA.x0, SA.y1, 0], [SA.x0, SA.y0, SA.zA], [SA.x1, SA.y0, SA.zA], [SA.x1, SA.y1, SA.zi], [SA.x0, SA.y1, SA.zi]], sMal, { wirft: true, bisZ: Z.saH });
      if (Z.dachSA) {
        const ye = SA.y0 - SA.ue, ze = SA.zA - SA.ue * SA.neig, p = [];
        for (const x of [SA.x0, SA.x1 + SA.ort]) p.push([x, SA.y1, SA.zi], [x, SA.y1, SA.zi + SA.dv], [x, ye, ze], [x, ye, ze + SA.dv]);
        const dm = dachMaler({ saat: 51, eindeck: Z.eindeckSA });
        W.koerper("dach-sa", p, (fl) => {
          if (fl.n[2] > 0.3) return { malen: dm };
          if (fl.n[2] < -0.3) return null;
          if (fl.n[1] < -0.9) return { malen: traufMaler };
          if (fl.n[0] > 0.9) return { malen: blechMaler([84, 92, 104]) };
          return null;
        }, { wirft: true });
      }
    }

    /* ---------------- Strebepfeiler ---------------- */
    const pfeiler = (name, C, dir, hw, st, waende, zeigeBis) => {
      const d = nrm([dir[0], dir[1], 0]), q = [-d[1], d[0], 0];
      const tB = waende ? -0.75 : 0;
      const P = (t, l, z) => [C[0] + d[0] * t + q[0] * l, C[1] + d[1] * t + q[1] * l, z];
      const oben1 = (t) => st.z1 + (st.d1 - t) * st.k1, oben2 = (t) => st.z2 + (st.d2 - t) * st.k2;
      const s1 = [], s2 = [];
      for (const t of [tB, st.d1]) for (const l of [-hw, hw]) { s1.push(P(t, l, 0), P(t, l, oben1(t))); }
      for (const t of [tB, st.d2]) for (const l of [-hw, hw]) { s2.push(P(t, l, oben1(t)), P(t, l, oben2(t))); }
      const mal = werksteinMaler(name.length * 7 + (C[0] * 3 | 0));
      const malW = (fl) => (fl.n[2] < -0.3 ? null : { malen: mal, ao: true });
      const stufen = [["a", s1], ["b", s2]];
      for (const [nm, pts] of stufen) {
        if (waende) {
          const [n1, d1] = waende[0], [n2, d2] = waende[1];
          W.koerper(name + nm + "1", pts, malW, { wirft: true, bisZ: zeigeBis, schnitte: [[mul(n1, -1), -d1]] });
          W.koerper(name + nm + "2", pts, malW, { wirft: true, bisZ: zeigeBis, schnitte: [[n1, d1], [mul(n2, -1), -d2]] });
        } else W.koerper(name + nm, pts, malW, { wirft: true, bisZ: zeigeBis });
      }
    };
    const stLH = { d1: 1.1, z1: 3.0, k1: 1.0, d2: 0.8, z2: 6.4, k2: 1.25 };
    const stDiag = { d1: 1.15, z1: 3.0, k1: 1.0, d2: 0.85, z2: 6.3, k2: 1.25 };
    const stCH = { d1: 0.95, z1: 2.8, k1: 1.0, d2: 0.68, z2: 5.8, k2: 1.3 };
    const bisLH = Z.lhH, bisCH = Z.chH;
    for (const x of [-6.5, -1.0, 4.5]) { pfeiler("pf-s" + x, [x, LH.y], [0, 1], 0.4, stLH, null, bisLH); pfeiler("pf-n" + x, [x, -LH.y], [0, -1], 0.4, stLH, null, bisLH); }
    const nS = [[0, 1, 0], LH.y], nN = [[0, -1, 0], LH.y], nW = [[-1, 0, 0], -LH.x0], nO = [[1, 0, 0], LH.x1];
    pfeiler("pf-sw", [LH.x0, LH.y], [-1, 1], 0.42, stDiag, [nS, nW], bisLH);
    pfeiler("pf-nw", [LH.x0, -LH.y], [-1, -1], 0.42, stDiag, [nN, nW], bisLH);
    pfeiler("pf-so", [LH.x1, LH.y], [1, 1], 0.42, stDiag, [nS, nO], bisLH);
    {
      const q = Math.SQRT1_2;
      const wS = [[0, 1, 0], CH.y], wN = [[0, -1, 0], CH.y], wO = [[1, 0, 0], CH.xk];
      const wSO = [[q, q, 0], q * CH.xj + q * CH.y], wNO = [[q, -q, 0], q * CH.xj + q * CH.y];
      const bis = (a, b) => nrm([a[0] + b[0], a[1] + b[1], 0]);
      pfeiler("pf-cs", [CH.xj, CH.y], bis(wS[0], wSO[0]), 0.35, stCH, [wS, wSO], bisCH);
      pfeiler("pf-cso", [CH.xk, CH.s / 2], bis(wSO[0], wO[0]), 0.35, stCH, [wSO, wO], bisCH);
      pfeiler("pf-cno", [CH.xk, -CH.s / 2], bis(wNO[0], wO[0]), 0.35, stCH, [wNO, wO], bisCH);
      pfeiler("pf-cn", [CH.xj, -CH.y], bis(wN[0], wNO[0]), 0.35, stCH, [wN, wNO], bisCH);
    }

    /* ---------------- Südportal: Vorbau mit Giebel, Freitreppe ---------------- */
    if (Z.portal > 0) {
      const pSpec = { saat: 61, oeff: [{ art: "portal", a: PO.xm, w: 1.8, z0: 0.6, zk: 2.9, stufen: 3, st: 0.13, tiefe: 0.5, kranz: true }] };
      const vorn = werksteinMaler(61, { nachQuader: (g, F, I) => { for (const op of pSpec.oeff) oeffnung(g, F, I, op); portalSchmuck(g, F, I); } });
      const seite = werksteinMaler(62);
      W.koerper("portal", [[PO.x0, PO.y0, 0], [PO.x1, PO.y0, 0], [PO.x1, PO.y1, 0], [PO.x0, PO.y1, 0], [PO.x0, PO.y0, PO.h], [PO.x1, PO.y0, PO.h], [PO.x1, PO.y1, PO.h], [PO.x0, PO.y1, PO.h], [PO.xm, PO.y0, PO.hg], [PO.xm, PO.y1, PO.hg]],
        (fl) => {
          if (fl.n[2] < -0.3) return null;
          if (fl.n[1] > 0.9) return { malen: vorn, danach: portalNacht, ao: true };
          return { malen: seite, ao: true };
        }, { wirft: true, bisZ: Z.portalH });
      /* Freitreppe */
      if (Z.treppe) for (let k = 0; k < 4; k++) {
        W.koerper("stufe" + k, quaderP(PO.x0 - 0.2, PO.y1, 0.15 * k, PO.x1 + 0.2, PO.y1 + (4 - k) * 0.3, 0.15 * (k + 1)), (fl) => (fl.n[2] < -0.3 ? null : { malen: stufeMaler }), { wirft: false });
      }
    }
    /* Turmtreppe (Westportal) */
    if (Z.treppe) for (let k = 0; k < 2; k++) {
      W.koerper("tstufe" + k, quaderP(TU.x0 - (2 - k) * 0.32, -1.3, 0.15 * k, TU.x0, 1.3, 0.15 * (k + 1)), (fl) => (fl.n[2] < -0.3 ? null : { malen: stufeMaler }), { wirft: false });
    }

    /* ---------------- Rinnen, Fallrohre, Eiszapfen ---------------- */
    if (Z.rinnen) for (const sy of [1, -1]) {
      const ya = sy * (LH.y + LH.ue), yb = sy * (LH.y + LH.ue + 0.17);
      const y0 = Math.min(ya, yb), y1 = Math.max(ya, yb);
      W.koerper("rinne" + sy, quaderP(LH.x0 + 0.05, y0, LH.ze - 0.2, LH.x1 + LH.ort - 0.05, y1, LH.ze + 0.01), (fl) => (fl.n[2] < -0.3 ? null : { malen: rinneMaler }));
      for (const xr of [LH.x0 + 0.95, LH.x1 - 1.0]) {
        const yw = sy * (LH.y + 0.03), yr = sy * (LH.y + 0.15);
        W.koerper("rohr" + sy + xr, quaderP(xr - 0.06, Math.min(yw, yr), 0, xr + 0.06, Math.max(yw, yr), LH.ze - 0.75), (fl) => (fl.n[2] < -0.3 ? null : { malen: rohrMaler }));
        /* Schwanenhals von der Rinne zur Wand */
        const pp = [];
        for (const dx of [-0.06, 0.06]) { pp.push([xr + dx, sy * (LH.y + 0.03), LH.ze - 0.75], [xr + dx, sy * (LH.y + 0.15), LH.ze - 0.75], [xr + dx, sy * (LH.y + LH.ue + 0.02), LH.ze - 0.28], [xr + dx, sy * (LH.y + LH.ue + 0.14), LH.ze - 0.28]); }
        W.koerper("hals" + sy + xr, pp, (fl) => (fl.n[2] < -0.5 ? null : { malen: rohrMaler }));
      }
      if (winter) {
        const ye = sy * (LH.y + LH.ue + 0.18);
        W.koerper("eis" + sy, quaderP(LH.x0 + 0.95, Math.min(ye, ye + sy * 0.01), LH.ze - 0.9, LH.x1 - 0.95, Math.max(ye, ye + sy * 0.01), LH.ze - 0.2),
          (fl) => (Math.abs(fl.n[1]) > 0.9 ? { malen: eisMaler(sy > 0 ? 3 : 4), keinLicht: true, keinSchatten: true } : null), { schatten: false });
      }
    }

    /* ---------------- Figuren ---------------- */
    if (Z.kreuz) {
      const hahn = W.variante === 1;
      const k = W.figur("turmkreuz", { x: TU.xm, y: 0, z: TU.spitze - 0.15, breite: 1.2, hoehe: 2.4, malen: turmspitze(hahn) }, [0.45, 0.45]);
      if (k) k.nach = W.k.filter((K) => K.name === "helm");
      const gk = W.figur("giebelkreuz", { x: LH.x1 + 0.2, y: 0, z: LH.zf + LH.dv - 0.05, breite: 0.9, hoehe: 1.5, malen: giebelkreuz(W.werk) }, [0.12, 0.35]);
      if (gk) gk.nach = W.k.filter((K) => /^dach-lh/.test(K.name));
      const ck = W.figur("chorknauf", { x: CH.xc, y: 0, z: CH.zf + CH.dv - 0.05, breite: 0.6, hoehe: 1.2, malen: chorknauf }, [0.15, 0.15]);
      if (ck) ck.nach = W.k.filter((K) => /^dach-ch/.test(K.name));
    }
    if (Z.deko && winter) {
      W.figur("baum-w", { x: -6.5, y: LH.y + 1.75, z: 0, breite: 1.4, hoehe: 2.6, malen: christbaum(3) }, [0.5, 0.5]);
      W.figur("baum-o", { x: -1.0, y: LH.y + 1.75, z: 0, breite: 1.4, hoehe: 2.6, malen: christbaum(8) }, [0.5, 0.5]);
      W.figur("stern", { x: PO.xm, y: PO.y1 + 0.42, z: 4.35, breite: 0.9, hoehe: 1.3, malen: herrnhuter }, [0.3, 0.3]);
    }
    if (Z.deko && !winter) {
      W.figur("forsythie", { x: 12.2, y: 5.0, z: 0, breite: 2.4, hoehe: 1.9, malen: forsythie }, [0.9, 0.65]);
      [[-10.6, 0.9], [-8.0, 0.9], [0.4, 0.9], [3.0, 0.9], [6.0, 0.9], [8.4, 0.9]].forEach(([x], i) => W.figur("blumen" + i, { x: x, y: LH.y + 0.35, z: 0, breite: 1.2, hoehe: 0.5, malen: blumen(7 + i) }, [0.55, 0.15]));
    }
  }


  /* =====================================================================
     BAUPHASEN
     XANDER: „Man soll das Fundament sehen beim Aufbauen … wenn der Bagger
     dann kommt und damit baut und dass man sieht wie das entsteht. Schritt
     für Schritt … wie die kleinen Menschen realistisch mit ihren
     Hämmerchen dieses Werk aufbauen."
       0,00–0,07  Baugrube: 1,4 m tief, Erdschichten, Aushubhaufen
       0,07–0,15  Streifenfundamente: Schalung und Bewehrung, Beton,
                  Ausschalen (Schalungsspuren bleiben im Beton)
       0,15–0,20  Verfüllen, Schotter als Unterbau der Fußböden
       0,18–0,40  Mauern wachsen Lage für Lage (Langhaus, Chor, Turm bis
                  9 m), Strebepfeiler mit, Fensteröffnungen noch leer;
                  man sieht in den offenen Rohbau hinein
       0,22–0,46  Sakristei mit Pultdach
       0,40–0,48  Giebel; der Turm wächst weiter bis 22 m (0,60)
       0,48–0,56  offener Dachstuhl: Sparren, Kehlbalken, Dachbalken –
                  zum Richtfest der geschmückte Richtbaum auf dem Giebel
       0,57–0,68  Eindecken: Lattung, Schiefer von der Traufe zum First
       0,60–0,69  Helmgerüst: Kaiserstiel, Gratsparren, Ringe
       0,69–0,80  der Helm wird verschiefert
       0,80–0,90  Bleiglasfenster eines nach dem anderen, Schallläden
       0,88–0,95  Türen, Freitreppe, Rinnen und Fallrohre, Zifferblätter
       0,96–1,00  Kreuz, Giebelkreuz, Schmuck
     Gerüst, Kran, Bagger und Arbeiter malt stadt/baustelle.js.
     ===================================================================== */
  /* Umriss der Baugrube (von oben): Turm, Langhaus mit Pfeilern und
     Portal, Chor mit Pfeilern, Sakristei – je 0,8 m Arbeitsraum */
  const GRUBE = [[-19.0, -3.9], [-12.9, -3.9], [-12.9, -6.9], [9.2, -6.9], [9.2, -7.4], [14.6, -7.4], [14.6, -5.4], [18.3, -5.4],
    [18.3, 5.4], [10.9, 5.4], [10.9, 6.9], [-12.9, 6.9], [-12.9, 3.9], [-19.0, 3.9]];
  function imVieleck(x, y, P) {
    let drin = false;
    for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const a = P[i], b = P[j]; if ((a[1] > y) !== (b[1] > y) && x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]) drin = !drin; }
    return drin;
  }
  /* Alles unter der Erde ist nur durch die Öffnung der Grube zu sehen:
     die Öffnung wird entlang der Blickrichtung auf die Fläche gelegt */
  function lochClip(g, I) {
    const e = I.W.B.e, n = I.n, en = dot(e, n);
    if (en < 1e-3) return false;
    g.beginPath();
    GRUBE.forEach(([x, y], i) => { const t = (x * n[0] + y * n[1] - I.fl.d) / en; const P = [x - e[0] * t, y - e[1] * t, -e[2] * t]; const A = dot(P, I.u), B = dot(P, I.v); if (i) g.lineTo(A, B); else g.moveTo(A, B); });
    g.closePath(); g.clip();
    return true;
  }
  /* Schatten des Grubenrands: Sonne erreicht nur, was durch die Öffnung
     entlang des Lichts sichtbar ist */
  function grubenLicht(g, I, x0, y0, x1, y1) {
    const L = I.W.B.L, n = I.n, ln = dot(L, n);
    g.save();
    g.beginPath(); g.rect(x0 - 1, y0 - 1, x1 - x0 + 2, y1 - y0 + 2);
    if (ln > 0.02) GRUBE.forEach(([x, y], i) => { const t = (x * n[0] + y * n[1] - I.fl.d) / ln; const P = [x - L[0] * t, y - L[1] * t, -L[2] * t]; const A = dot(P, I.u), B = dot(P, I.v); if (i) g.lineTo(A, B); else g.moveTo(A, B); });
    g.fillStyle = "rgba(24,26,52,0.45)"; g.fill("evenodd");
    g.restore();
  }
  /* Licht selbst auflegen (für Flächen, die sich selbst beschneiden): der
     Kern würde sonst den ganzen Umriss einfärben, auch Unsichtbares */
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
      /* Schichten: Mutterboden, Lehm, sandiger Kies (B = Tiefe) */
      const lagen = [[-0.1, [68, 50, 34]], [0.32, [128, 92, 58]], [0.95, [172, 134, 88]]];
      lagen.forEach(([t, c], i) => {
        g.fillStyle = rgbS(c); g.beginPath(); g.moveTo(x0 - 0.2, y1 + 0.3); g.lineTo(x0 - 0.2, t);
        for (let x = x0 - 0.2; x <= x1 + 0.3; x += 0.3) g.lineTo(x, t + (i ? Math.sin(x * 1.3 + i * 2 + saat) * 0.05 + Math.sin(x * 3.7 + i) * 0.02 : 0));
        g.lineTo(x1 + 0.3, y1 + 0.3); g.closePath(); g.fill();
      });
      rausch(g, x0, y0, x1 - x0, y1 - y0, 0.9, 0.34, saat, 3);
      if (px > 10) {
        const rng = zuf(saat);
        const n = Math.min(500, (x1 - x0) * (y1 - y0) * 7);
        for (let i = 0; i < n; i++) { const x = x0 + rng() * (x1 - x0), y = 0.3 + rng() * (y1 - 0.3), r = 0.015 + rng() * 0.04; g.fillStyle = rgbS(hellF([140, 130, 118], (rng() - 0.5) * 0.4)); g.beginPath(); g.ellipse(x, y, r * 1.3, r, rng() * 3, 0, 2 * Math.PI); g.fill(); }
        g.strokeStyle = "rgba(40,28,20,0.7)"; g.lineWidth = Math.max(0.005, 0.7 / px);
        for (let i = 0; i < (x1 - x0) * 1.2; i++) { const x = x0 + rng() * (x1 - x0); g.beginPath(); g.moveTo(x, 0.04); g.quadraticCurveTo(x + (rng() - 0.5) * 0.2, 0.15, x + (rng() - 0.5) * 0.25, 0.1 + rng() * 0.3); g.stroke(); }
        g.strokeStyle = "rgba(30,20,14,0.16)"; g.lineWidth = 0.03;
        for (let x = x0 + rng() * 0.4; x < x1; x += 0.3 + rng() * 0.3) { g.beginPath(); g.moveTo(x, 0.35); g.lineTo(x + 0.04, y1); g.stroke(); }
      }
      const gd = g.createLinearGradient(0, 0, 0, y1); gd.addColorStop(0, "rgba(10,8,20,0)"); gd.addColorStop(1, "rgba(10,8,20,0.25)");
      g.fillStyle = gd; g.fillRect(x0 - 0.2, 0, x1 - x0 + 0.4, y1 + 0.1);
      grubenLicht(g, I, x0, y0, x1, y1);
      if (I.W.winter) { g.fillStyle = "rgb(240,244,251)"; g.fillRect(x0 - 0.2, -0.1, x1 - x0 + 0.4, 0.2); g.fillStyle = "rgb(200,212,234)"; g.fillRect(x0 - 0.2, 0.08, x1 - x0 + 0.4, 0.025); }
      lichtAuflegen(g, F, x0, y0, x1, y1);
      g.restore();
    };
  }
  function erdeBoden(g, F, I) {
    const x0 = I.A0, x1 = I.A0 + F.w, y0 = I.B0, y1 = I.B0 + F.h, px = F.px;
    g.save();
    if (!lochClip(g, I)) { g.restore(); return; }
    g.fillStyle = "rgb(120,90,62)"; g.fillRect(x0, y0, x1 - x0, y1 - y0);
    rausch(g, x0, y0, x1 - x0, y1 - y0, 1.4, 0.36, 21, 3);
    if (px > 6) {
      /* Kettenspuren des Baggers */
      g.strokeStyle = "rgba(70,50,34,0.45)"; g.lineWidth = 0.5;
      for (const d of [-0.9, 0.9]) { g.beginPath(); g.moveTo(x0 + 2, y0 + (y1 - y0) * 0.5 + d); g.bezierCurveTo(x0 + (x1 - x0) * 0.3, y0 + (y1 - y0) * 0.35 + d, x0 + (x1 - x0) * 0.6, y0 + (y1 - y0) * 0.65 + d, x1 - 2, y0 + (y1 - y0) * 0.5 + d); g.stroke(); }
      if (px > 12) { g.strokeStyle = "rgba(60,42,28,0.35)"; g.lineWidth = 0.06; for (let x = x0 + 2; x < x1 - 2; x += 0.35) for (const d of [-0.9, 0.9]) { g.beginPath(); g.moveTo(x, y0 + (y1 - y0) * 0.5 + d - 0.25); g.lineTo(x + 0.05, y0 + (y1 - y0) * 0.5 + d + 0.25); g.stroke(); } }
    }
    if (I.W.winter) {
      /* gefrorene Pfützen, Schneestaub */
      const rng = zuf(33);
      for (let i = 0; i < 9; i++) { const cx = x0 + rng() * (x1 - x0), cy = y0 + rng() * (y1 - y0); g.fillStyle = "rgba(190,206,226,0.8)"; g.beginPath(); g.ellipse(cx, cy, 0.5 + rng() * 1.2, 0.3 + rng() * 0.6, rng() * 3, 0, 2 * Math.PI); g.fill(); }
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
  /* Streifenfundamente: erst Schalung mit Bewehrung, dann Beton, dann
     ausgeschalt mit den Abdrücken der Bretter */
  function fundamentMaler(st) {
    return function (g, F, I) {
      const x0 = I.A0, x1 = I.A0 + F.w, y0 = I.B0, y1 = I.B0 + F.h, px = F.px, oben = I.n[2] > 0.5, winter = I.W.winter;
      g.save();
      if (!oben && !lochClip(g, I)) { g.restore(); return; }
      if (oben) {
        if (st < 0.45) {
          /* offene Schalung: Blick auf den Bewehrungskorb */
          g.fillStyle = "rgb(58,46,36)"; g.fillRect(x0, y0, x1 - x0, y1 - y0);
          g.strokeStyle = "rgb(118,70,44)"; g.lineWidth = Math.max(0.014, 0.8 / px);
          g.beginPath();
          for (let x = Math.ceil(x0 / 0.25) * 0.25; x < x1; x += 0.25) { g.moveTo(x, y0 + 0.1); g.lineTo(x, y1 - 0.1); }
          for (let y = Math.ceil(y0 / 0.25) * 0.25; y < y1; y += 0.25) { g.moveTo(x0 + 0.1, y); g.lineTo(x1 - 0.1, y); }
          g.stroke();
          /* Schalbretter oben als Rand */
          g.fillStyle = "rgb(206,172,120)"; g.fillRect(x0, y0, x1 - x0, 0.05); g.fillRect(x0, y1 - 0.05, x1 - x0, 0.05); g.fillRect(x0, y0, 0.05, y1 - y0); g.fillRect(x1 - 0.05, y0, 0.05, y1 - y0);
        } else {
          const nass = st < 0.75;
          g.fillStyle = nass ? "rgb(104,106,108)" : "rgb(170,168,160)"; g.fillRect(x0, y0, x1 - x0, y1 - y0);
          rausch(g, x0, y0, x1 - x0, y1 - y0, 1.0, 0.22, 31, 3);
          if (nass) { g.fillStyle = "rgba(220,230,240,0.12)"; g.fillRect(x0, y0, x1 - x0, (y1 - y0) * 0.4); }
          /* Anschlusseisen für die Mauer */
          if (px > 12) { g.fillStyle = "rgb(110,62,40)"; for (let x = Math.ceil(x0 / 0.6) * 0.6; x < x1; x += 0.6) for (let y = Math.ceil(y0 / 0.6) * 0.6; y < y1; y += 0.6) g.fillRect(x - 0.02, y - 0.02, 0.04, 0.04); }
          if (winter && !nass) { g.fillStyle = "rgba(240,244,251,0.7)"; g.fillRect(x0, y0, x1 - x0, y1 - y0); }
        }
      } else if (st < 0.7) {
        /* Schalung: waagrechte Bretter, senkrechte Kanthölzer, Nagelköpfe */
        g.fillStyle = "rgb(60,46,32)"; g.fillRect(x0, y0, x1 - x0, y1 - y0);
        const rng = zuf(71);
        for (let y = y0; y < y1; y += 0.2) { g.fillStyle = rgbS(hellF([204, 168, 116], (rng() - 0.5) * 0.18)); g.fillRect(x0, y + 0.006, x1 - x0, 0.188); }
        g.fillStyle = "rgb(176,138,90)";
        for (let x = Math.ceil(x0 / 0.7) * 0.7; x < x1; x += 0.7) g.fillRect(x - 0.04, y0, 0.08, y1 - y0);
        if (px > 30) { g.fillStyle = "rgb(60,60,62)"; for (let x = Math.ceil(x0 / 0.7) * 0.7; x < x1; x += 0.7) for (let y = y0 + 0.1; y < y1; y += 0.2) g.fillRect(x - 0.01, y - 0.01, 0.02, 0.02); }
      } else {
        /* Beton mit Schalungsspuren: Brettfugen, Maserung, Ankerlöcher */
        g.fillStyle = "rgb(168,166,158)"; g.fillRect(x0, y0, x1 - x0, y1 - y0);
        rausch(g, x0, y0, x1 - x0, y1 - y0, 1.1, 0.25, 40, 3);
        if (px > 8) {
          g.strokeStyle = "rgba(110,108,102,0.7)"; g.lineWidth = Math.max(0.005, 0.7 / px);
          g.beginPath(); for (let y = Math.ceil(y0 / 0.2) * 0.2; y < y1; y += 0.2) { g.moveTo(x0, y); g.lineTo(x1, y); } g.stroke();
          g.fillStyle = "rgb(70,70,68)"; for (let x = Math.ceil(x0 / 1.0) * 1.0 + 0.5; x < x1; x += 1.0) { g.beginPath(); g.arc(x, y0 + (y1 - y0) * 0.5, 0.014, 0, 2 * Math.PI); g.fill(); }
        }
      }
      if (!oben) { grubenLicht(g, I, x0, y0, x1, y1); lichtAuflegen(g, F, x0, y0, x1, y1); }
      g.restore();
    };
  }
  function fundamenteBauen(W, Z) {
    const st = Z.fundament, T = 1.4, tv = Z.grubeT;
    const unten = [[[0, 0, -1], Math.max(0, tv) - 0.001]];
    const mal = fundamentMaler(st);
    const m = (fl) => (fl.n[2] < -0.5 ? null : { malen: mal, keinLicht: fl.n[2] < 0.5, keinSchatten: fl.n[2] < 0.5 });
    const box = (name, x0, y0, x1, y1) => W.koerper("fund-" + name, quaderP(x0, y0, -T, x1, y1, 0), m, { schatten: false, schnitte: unten });
    box("s", -12.3, 3.7, 10.3, 5.3); box("n", -12.3, -5.3, 10.3, -3.7);
    box("w", -12.3, -3.7, -10.7, 3.7); box("o", 8.7, -3.7, 10.3, 3.7);
    box("turm", -18.3, -3.3, -12.3, 3.3);
    box("sak", 10.3, -6.8, 14.0, -4.1);
    box("portal", -5.9, 5.3, -1.6, 6.0);
    const cg = chorGrund(0.3).map(([x, y]) => [Math.max(x, 10.3), y]);
    W.koerper("fund-chor", prisma(cg, -T, 0), m, { schatten: false, schnitte: unten });
  }
  /* Rohes Bauholz: Sparren, Balken, Helmgerüst */
  const HOLZ = [206, 170, 118];
  function holzMaler(g, F, I) {
    const x0 = I.A0, y0 = I.B0, w = F.w, h = F.h, px = F.px;
    g.fillStyle = rgbS(HOLZ); g.fillRect(x0 - 0.05, y0 - 0.05, w + 0.1, h + 0.1);
    if (px * Math.min(w, h) > 3) {
      g.strokeStyle = "rgba(120,86,50,0.35)"; g.lineWidth = Math.max(0.004, 0.6 / px);
      const lang = w > h, n = Math.min(5, Math.round((lang ? h : w) * px / 3));
      g.beginPath();
      for (let i = 0; i < n; i++) { const t = (i + 0.5) / n; if (lang) { g.moveTo(x0, y0 + h * t); g.lineTo(x0 + w, y0 + h * t + 0.01); } else { g.moveTo(x0 + w * t, y0); g.lineTo(x0 + w * t + 0.01, y0 + h); } }
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
  /* Offener Dachstuhl des Langhauses: Gebinde von Westen nach Osten */
  function dachstuhlLH(W, k) {
    /* Gebinde zwischen den Giebelmauern; die Sparren stehen auf den
       Dachbalken über der Mauerkrone (Aufschieblinge kommen mit der Deckung) */
    const xs = []; for (let x = LH.x0 + 1.2; x <= LH.x1 - 1.15; x += 0.95) xs.push(x);
    const n = Math.ceil(xs.length * k);
    const zk = LH.tr + (LH.zf - LH.tr) * 0.6, yk = (LH.zf - zk) / NEIG;
    for (let i = 0; i < n; i++) {
      const x = xs[i], vb = "gebinde" + i;
      const ya = LH.y + 0.02;
      W.verbund(vb, [[x - 0.1, -ya, LH.tr], [x + 0.1, -ya, LH.tr], [x - 0.1, ya, LH.tr], [x + 0.1, ya, LH.tr], [x - 0.1, 0, LH.zf + 0.5], [x + 0.1, 0, LH.zf + 0.5], [x - 0.1, -ya, LH.tr + 0.45], [x + 0.1, -ya, LH.tr + 0.45], [x - 0.1, ya, LH.tr + 0.45], [x + 0.1, ya, LH.tr + 0.45]]);
      balken(W, "balken" + i, [x, -LH.y, LH.tr + 0.1], [x, LH.y, LH.tr + 0.1], 0.16, 0.2, null, vb);
      for (const sy of [1, -1]) balken(W, "sparren" + i + sy, [x, sy * (LH.y - 0.1), LH.tr + 0.32], [x, 0, LH.zf + 0.32], 0.12, 0.18, [0, 0, 1], vb);
      balken(W, "kehl" + i, [x, -yk, zk + 0.1], [x, yk, zk + 0.1], 0.12, 0.16, null, vb);
    }
  }
  function dachstuhlCH(W, k) {
    const liste = [];
    for (const x of [10.35, 11.3, 12.25]) for (const sy of [1, -1]) liste.push([[x, sy * (CH.y - 0.1), CH.tr + 0.15], [x, 0, CH.zf + 0.15]]);
    const ap = [CH.xc, 0, CH.zf + 0.15];
    const ecken = chorGrund(-0.1).slice(1, 5);
    for (const [x, y] of ecken) liste.push([[x, y, CH.tr + 0.15], ap]);
    liste.push([[CH.xk - 0.1, 0, CH.tr + 0.15], ap]);
    const n = Math.ceil(liste.length * k);
    const hu = chorGrund(0.5).map(([x, y]) => [x, y, CH.tr - 0.5 * NEIG]).concat([[CH.x0 - 0.1, 0, CH.zf + 0.3], [CH.xc + 0.1, 0, CH.zf + 0.3], [CH.x0 - 0.1, -CH.y - 0.5, CH.zf + 0.3], [CH.x0 - 0.1, CH.y + 0.5, CH.zf + 0.3]]);
    W.verbund("chorstuhl", chorGrund(0.05).map(([x, y]) => [Math.max(x, CH.x0 + 0.2), y, CH.tr]).concat([[CH.x0 + 0.2, 0, CH.zf + 0.4], [CH.xc, 0, CH.zf + 0.4]]));
    void hu;
    for (let i = 0; i < n; i++) balken(W, "csparren" + i, liste[i][0], liste[i][1], 0.12, 0.18, null, "chorstuhl");
  }
  /* Helmgerüst: Kaiserstiel, acht Gratsparren, zwei Ringe */
  function helmGeruest(W, k) {
    const ge = TU.ge, R = ge / Math.cos(22.5 * RAD), ap = [TU.xm, 0, TU.spitze];
    const ecke = (i, z) => { const a = (22.5 + i * 45) * RAD, f = (TU.spitze - z) / (TU.spitze - TU.gz); return [TU.xm + Math.cos(a) * R * f, Math.sin(a) * R * f, z]; };
    const hu = [[TU.xm, 0, TU.spitze + 0.3]];
    for (let i = 0; i < 8; i++) { const a = (22.5 + i * 45) * RAD; hu.push([TU.xm + Math.cos(a) * (R + 0.2), Math.sin(a) * (R + 0.2), TU.gz]); }
    W.verbund("helmstuhl", hu);
    if (k > 0) balken(W, "stiel", [TU.xm, 0, TU.gz], [TU.xm, 0, TU.gz + (TU.spitze - TU.gz) * klemm(k / 0.3, 0.05, 1)], 0.3, 0.3, [1, 0, 0], "helmstuhl");
    const nGrat = Math.floor(klemm((k - 0.25) / 0.4, 0, 1) * 8);
    for (let i = 0; i < nGrat; i++) balken(W, "grat" + i, ecke(i, TU.gz + 0.1), ap, 0.16, 0.2, null, "helmstuhl");
    const nRing = Math.floor(klemm((k - 0.6) / 0.4, 0, 1) * 16);
    for (let j = 0; j < nRing; j++) { const z = j < 8 ? 25.5 : 29.5, i = j % 8; balken(W, "ring" + j, ecke(i, z), ecke(i + 1, z), 0.12, 0.14, null, "helmstuhl"); }
  }
  /* Rohbau als offene Mauerschalen: man sieht hinein */
  function schalenMal(ebenen) {
    return function (fl) {
      if (fl.n[2] > 0.5) return { malen: mauerkrone };
      if (fl.n[2] < -0.5) return null;
      for (const [n, d, spec] of ebenen) if (fl.n[0] * n[0] + fl.n[1] * n[1] > 0.995 && Math.abs(fl.d - d) < 0.03) return { malen: wandMaler(spec), danach: wandNacht(spec), ao: true };
      for (const [n, , spec] of ebenen) if (fl.n[0] * n[0] + fl.n[1] * n[1] < -0.995) return { malen: innenMaler(spec) };
      return { malen: innenMaler(null) };
    };
  }
  function innenMaler(spec) {
    return function (g, F, I) {
      const x0 = I.A0, x1 = I.A0 + F.w, y0 = I.B0, y1 = I.B0 + F.h;
      bruchstein(g, F, I, x0, y0, x1, y1, 97);
      g.fillStyle = "rgba(54,48,44,0.3)"; g.fillRect(x0, y0, x1 - x0, y1 - y0);
      if (!spec) return;
      for (const op of spec.oeff || []) {
        if (op.art === "uhr") continue;
        const a = op.a == null ? I.A0 + F.w / 2 - (op.da || 0) : -op.a;
        g.fillStyle = "rgb(84,92,110)"; g.strokeStyle = "rgba(40,36,34,0.8)"; g.lineWidth = 0.08;
        g.beginPath();
        if (op.art === "rose") g.arc(a, -op.z, op.r, 0, 2 * Math.PI);
        else spitz(g, a - op.w / 2 - 0.1, -op.zk, op.w + 0.2, -op.z0);
        g.fill(); g.stroke();
      }
      if (spec.innenTuer) { const t = spec.innenTuer; g.fillStyle = "rgb(84,92,110)"; g.beginPath(); spitz(g, -t.a - t.w / 2, -t.zk, t.w, -t.z0); g.fill(); }
    };
  }
  /* Unterbau und Boden im Inneren: erst Schotter, dann Sandsteinplatten */
  function bodenMaler(g, F, I) {
    const x0 = I.A0, x1 = I.A0 + F.w, y0 = I.B0, y1 = I.B0 + F.h, px = F.px, Z = I.W.Z;
    if (I.n[2] < 0.5) { g.fillStyle = "rgb(150,146,138)"; g.fillRect(x0, y0, x1 - x0, y1 - y0); return; }
    if (Z.bau < 0.3) {
      g.fillStyle = "rgb(150,144,134)"; g.fillRect(x0, y0, x1 - x0, y1 - y0);
      rausch(g, x0, y0, x1 - x0, y1 - y0, 1.6, 0.25, 23, 3);
      if (px > 14) { const rng = zuf(5), n = Math.min(2500, (x1 - x0) * (y1 - y0) * Math.min(60, px)); for (let i = 0; i < n; i++) { g.fillStyle = rgbS(hellF([150, 144, 134], (rng() - 0.5) * 0.45)); g.beginPath(); g.ellipse(x0 + rng() * (x1 - x0), y0 + rng() * (y1 - y0), 0.03, 0.022, rng() * 3, 0, 2 * Math.PI); g.fill(); } }
    } else {
      const c = hellF(I.W.werk, 0.12);
      g.fillStyle = rgbS(hellF(c, -0.3)); g.fillRect(x0, y0, x1 - x0, y1 - y0);
      if (px > 6) for (let x = Math.floor(x0 / 0.6) * 0.6; x < x1; x += 0.6) for (let y = Math.floor(y0 / 0.6) * 0.6; y < y1; y += 0.6) { g.fillStyle = rgbS(hellF(c, (hash(Math.round(x * 5), Math.round(y * 5), 3) - 0.5) * 0.14)); g.fillRect(x + 0.01, y + 0.01, 0.58, 0.58); }
      rausch(g, x0, y0, x1 - x0, y1 - y0, 1.5, 0.2, 27, 3);
    }
    if (I.W.winter && !Z.dachLH) { g.fillStyle = "rgba(240,244,251,0.82)"; g.fillRect(x0, y0, x1 - x0, y1 - y0); }
  }
  function rohbauLanghaus(W, LS, h) {
    const t = 1.0, yi = LH.y - t;
    const eb = [[[0, 1], LH.y, LS.sued], [[0, -1], LH.y, LS.nord], [[-1, 0], -LH.x0, LS.west], [[1, 0], LH.x1, LS.ost]];
    const m = schalenMal(eb);
    const o = { wirft: true, bisZ: h };
    /* Längswände in drei Stücke (an den Giebelmauern geteilt): sonst
       überdecken sich lange Mauer, Dachstuhl und Giebel reihum */
    for (const [xa, xb, nm] of [[LH.x0, LH.x0 + t, "a"], [LH.x0 + t, LH.x1 - t, "b"], [LH.x1 - t, LH.x1, "c"]]) {
      W.koerper("langhaus-s" + nm, quaderP(xa, yi, 0, xb, LH.y, LH.tr), m, o);
      W.koerper("langhaus-n" + nm, quaderP(xa, -LH.y, 0, xb, -yi, LH.tr), m, o);
    }
    const giebel = (x0, x1, y0, y1, z0) => { const p = []; for (const x of [x0, x1]) p.push([x, y0, z0], [x, y1, z0], [x, y0, LH.tr + (LH.y + y0) * NEIG], [x, y1, LH.tr + (LH.y - y1) * NEIG], [x, 0, LH.zf]); return p.filter((q) => q[1] >= y0 - 1e-6 && q[1] <= y1 + 1e-6); };
    W.koerper("langhaus-w", giebel(LH.x0, LH.x0 + t, -yi, yi, 0), m, o);
    /* Ostgiebel mit dem Triumphbogen zum Chor */
    W.koerper("langhaus-o1", quaderP(LH.x1 - t, -yi, 0, LH.x1, -2.9, 7.2), m, o);
    W.koerper("langhaus-o2", quaderP(LH.x1 - t, 2.9, 0, LH.x1, yi, 7.2), m, o);
    if (h > 7.2) W.koerper("langhaus-o3", giebel(LH.x1 - t, LH.x1, -yi, yi, 7.2), m, o);
    if (W.Z.boden > 0) W.koerper("boden-lh", quaderP(LH.x0 + t, -yi, 0, LH.x1 - t, yi, 0.6 * W.Z.boden), (fl) => (fl.n[2] < -0.5 ? null : { malen: bodenMaler }), { schatten: false });
  }
  function rohbauChor(W, CS, h) {
    const t = 0.9, A = chorGrund(0), B = chorGrund(-t);
    const q = Math.SQRT1_2;
    const specs = [CS.n, CS.no, CS.o, CS.so, CS.s];
    for (let i = 0; i < 5; i++) {
      const pts = prisma([A[i], A[i + 1], B[i + 1], B[i]], 0, CH.tr);
      const n2 = nrm([A[i + 1][1] - A[i][1], -(A[i + 1][0] - A[i][0]), 0]);
      const aussen = [n2[0] > 0 || (Math.abs(n2[0]) < 1e-6 && n2[1] < 0) ? n2 : mul(n2, -1)];
      void q; void aussen;
      /* Außenseite zeigt vom Achteckmittelpunkt weg */
      let n = n2; const mx = (A[i][0] + A[i + 1][0]) / 2, my = (A[i][1] + A[i + 1][1]) / 2;
      if ((mx - CH.xc) * n[0] + my * n[1] < 0) n = mul(n, -1);
      const d = n[0] * A[i][0] + n[1] * A[i][1];
      W.koerper("chor-" + i, pts, schalenMal([[[n[0], n[1]], d, specs[i]]]), { wirft: true, bisZ: h });
    }
    if (W.Z.boden > 0) W.koerper("boden-ch", prisma(B.map(([x, y]) => [Math.max(x, CH.x0), y]), 0, 0.6 * W.Z.boden), (fl) => (fl.n[2] < -0.5 ? null : { malen: bodenMaler }), { schatten: false });
  }
  function rohbauTurm(W, TS, h) {
    const t = 1.2;
    const eb = [[[0, 1], TU.y, TS.sued], [[0, -1], TU.y, TS.nord], [[-1, 0], -TU.x0, TS.west], [[1, 0], TU.x1, TS.ost]];
    const m = schalenMal(eb), o = { wirft: true, bisZ: h };
    W.koerper("turm-w", quaderP(TU.x0, -TU.y, 0, TU.x0 + t, TU.y, TU.h), m, o);
    W.koerper("turm-o", quaderP(TU.x1 - t, -TU.y, 0, TU.x1, TU.y, TU.h), m, o);
    W.koerper("turm-s", quaderP(TU.x0 + t, TU.y - t, 0, TU.x1 - t, TU.y, TU.h), m, o);
    W.koerper("turm-n", quaderP(TU.x0 + t, -TU.y, 0, TU.x1 - t, -TU.y + t, TU.h), m, o);
    if (W.Z.boden > 0) W.koerper("boden-turm", quaderP(TU.x0 + t, -TU.y + t, 0, TU.x1 - t, TU.y - t, 0.3 * W.Z.boden), (fl) => (fl.n[2] < -0.5 ? null : { malen: bodenMaler }), { schatten: false });
  }
  /* Aushubhaufen */
  function aushubFigur(k, winter) {
    return function (g, s, F) {
      const sch = F.schatten, rng = zuf(12);
      const b = 2.3 * Math.cbrt(k) * s, hh = 1.5 * Math.cbrt(k) * ST.KZ * s;
      const pfad = () => { g.beginPath(); g.moveTo(-b, 0); g.bezierCurveTo(-b * 0.7, -hh * 0.6, -b * 0.35, -hh * 1.05, 0, -hh); g.bezierCurveTo(b * 0.3, -hh * 1.02, b * 0.75, -hh * 0.5, b, 0); g.bezierCurveTo(b * 0.4, b * 0.22, -b * 0.4, b * 0.22, -b, 0); g.closePath(); };
      if (sch) { g.fillStyle = "#000"; pfad(); g.fill(); return; }
      const lf = ST.lichtFaktor([0, 0, 1], F.Z, 0, F.jahr);
      const gr = g.createLinearGradient(-b, -hh, b, 0);
      gr.addColorStop(0, belicht([150, 112, 74], lf)); gr.addColorStop(0.6, belicht([118, 86, 56], lf)); gr.addColorStop(1, belicht([82, 60, 40], lf));
      g.fillStyle = gr; pfad(); g.fill();
      g.save(); pfad(); g.clip();
      for (let i = 0; i < 160; i++) { const x = (rng() - 0.5) * 2 * b, y = -rng() * hh * 1.05, r = (0.03 + rng() * 0.08) * s; g.fillStyle = belicht(hellF([120, 92, 62], (rng() - 0.5) * 0.5), lf); g.beginPath(); g.ellipse(x, y, r * 1.3, r, rng() * 3, 0, 2 * Math.PI); g.fill(); }
      if (winter) { g.fillStyle = belicht([240, 244, 251], lf); g.beginPath(); g.moveTo(-b * 0.75, -hh * 0.45); g.bezierCurveTo(-b * 0.4, -hh * 1.1, b * 0.3, -hh * 1.1, b * 0.7, -hh * 0.4); g.bezierCurveTo(b * 0.2, -hh * 0.7, -b * 0.3, -hh * 0.72, -b * 0.75, -hh * 0.45); g.fill(); }
      g.restore();
    };
  }
  /* Richtbaum zum Richtfest: kleine Tanne mit bunten Bändern */
  function richtbaum(g, s, F) {
    const sch = F.schatten, z = (m) => -m * ST.KZ * s;
    const lf = sch ? null : ST.lichtFaktor([0.2, 0.5, 0.8], F.Z, 0.05, F.jahr);
    g.fillStyle = sch ? "#000" : belicht([90, 64, 40], lf); g.fillRect(-0.04 * s, z(0.9), 0.08 * s, -z(0.9));
    g.fillStyle = sch ? "#000" : belicht([34, 80, 46], lf);
    g.beginPath(); g.moveTo(0, z(2.4)); g.lineTo(-0.5 * s, z(0.8)); g.lineTo(0.5 * s, z(0.8)); g.closePath(); g.fill();
    if (sch) return;
    const farben = [[200, 30, 40], [240, 200, 40], [40, 90, 200], [250, 250, 250], [40, 150, 70]];
    for (let i = 0; i < 10; i++) {
      const y0 = z(1.1 + 0.12 * i), x0 = (i % 2 ? 0.25 : -0.25) * s * (1 - i / 12);
      g.strokeStyle = belicht(farben[i % farben.length], lf); g.lineWidth = Math.max(1, 0.04 * s);
      g.beginPath(); g.moveTo(x0, y0); g.quadraticCurveTo(x0 + 0.2 * s, y0 + 0.2 * s, x0 + (i % 2 ? 0.3 : -0.3) * s, y0 + 0.45 * s); g.stroke();
    }
  }

  /* Achteckiger Spitzhelm mit Zwickeln */
  function helmBauen(W, o) {
    const Z = W.Z;
    if (Z.helm <= 0) return;
    const ge = TU.ge, t8 = Math.tan(22.5 * RAD), zS = TU.spitze;
    const acht = [];
    for (let i = 0; i < 8; i++) { const a = (22.5 + i * 45) * RAD, r = ge / Math.cos(22.5 * RAD); acht.push([TU.xm + Math.cos(a) * r, Math.sin(a) * r, TU.gz]); }
    const helmMal = dachMaler({ reihe: 0.13, breite: 0.19, saat: 81, band: 0.14, steil: true, eindeck: Z.eindeckHelm });
    W.koerper("helm", acht.concat([[TU.xm, 0, zS]]), (fl) => (fl.n[2] < -0.3 ? null : { malen: helmMal }), { wirft: true, bisZ: Z.helmH });
    for (const [sx, sy] of [[1, 1], [-1, 1], [-1, -1], [1, -1]]) {
      const hz = 4.0, k = (zS - TU.gz - hz) / (zS - TU.gz);
      const pts = [[TU.xm + sx * ge, sy * ge * t8, TU.gz], [TU.xm + sx * ge * t8, sy * ge, TU.gz], [TU.xm + sx * ge, sy * ge, TU.gz],
        [TU.xm + sx * ge * k, sy * ge * t8 * k, TU.gz + hz], [TU.xm + sx * ge * t8 * k, sy * ge * k, TU.gz + hz], [TU.xm + sx * ge, sy * ge, TU.gz + 0.3]];
      const zm = dachMaler({ reihe: 0.13, breite: 0.19, saat: 90 + sx * 3 + sy, band: 0.12, steil: 1.6, eindeck: Z.eindeckHelm });
      W.koerper("zwickel" + sx + sy, pts, (fl) => {
        if (fl.n[2] < -0.3) return null;
        if (fl.n[2] > 0.3) return { malen: zm };
        return { malen: blechMaler([84, 92, 104]) };
      }, { wirft: true, bisZ: Z.helmH });
    }
  }
  /* Profil des Turm-Traufgesimses */
  function gesimsKoerperMaler(g, F, I) {
    const c = I.W.werk, x0 = I.A0, x1 = I.A0 + F.w, y0 = I.B0, h = F.h;
    g.fillStyle = rgbS(hellF(c, 0.1)); g.fillRect(x0, y0, x1 - x0, h);
    const gr = g.createLinearGradient(0, y0, 0, y0 + h);
    gr.addColorStop(0, "rgba(255,240,220,0.25)"); gr.addColorStop(0.3, "rgba(0,0,0,0)"); gr.addColorStop(0.55, "rgba(30,20,20,0.35)"); gr.addColorStop(0.8, "rgba(0,0,0,0.05)"); gr.addColorStop(1, "rgba(30,20,20,0.4)");
    g.fillStyle = gr; g.fillRect(x0, y0, x1 - x0, h);
    rausch(g, x0, y0, x1 - x0, h, 1.2, 0.2, 5, 3);
  }
  /* Mauerkrone (Bauphase): Oberseite einer wachsenden Mauer */
  function mauerkrone(g, F, I) {
    const x0 = I.A0, y0 = I.B0;
    g.fillStyle = "rgb(150,138,118)"; g.fillRect(x0, y0, F.w, F.h);
    if (F.px > 6) {
      const rng = zuf(7);
      for (let i = 0; i < Math.min(900, F.w * F.h * 6); i++) { g.fillStyle = rgbS(BRUCH[(rng() * 8) | 0]); g.fillRect(x0 + rng() * F.w, y0 + rng() * F.h, 0.2 + rng() * 0.3, 0.12 + rng() * 0.15); }
    }
    if (I.W.winter) { g.fillStyle = "rgba(240,244,251,0.8)"; g.fillRect(x0, y0, F.w, F.h); }
  }
  /* Schmuck am Portalvorbau: Tannengirlande mit Lichtern (Winter),
     geschmiedete Laterne (sonst) */
  function portalSchmuck(g, F, I) {
    const W = I.W, px = F.px;
    if (I.n[1] < 0.9) return;
    const cx = PO.xm, w = 1.8 + 6 * 0.13, bS = -2.9;
    if (W.winter && W.fertig) {
      /* Girlande entlang des äußeren Bogens */
      const rng = zuf(33);
      const r = w, h = spitzH(w);
      const pts = [];
      for (let t = 0; t <= 1.0001; t += 0.02) {
        /* linker Bogen, dann rechter */
        let x, y;
        if (t < 0.5) { const a = Math.PI + (Math.atan2(-h, w / 2 - r) + 2 * Math.PI - Math.PI) * (t / 0.5); x = cx - w / 2 + r + Math.cos(a) * (r + 0.08); y = bS + Math.sin(a) * (r + 0.08); }
        else { const a0 = Math.atan2(-h, r - w / 2), a = a0 + (0 - a0) * ((t - 0.5) / 0.5); x = cx + w / 2 - r + Math.cos(a) * (r + 0.08); y = bS + Math.sin(a) * (r + 0.08); }
        pts.push([x, y]);
      }
      pts.unshift([cx - w / 2 - 0.08, -1.2]); pts.push([cx + w / 2 + 0.08, -1.2]);
      if (px > 6) {
        g.lineCap = "round";
        g.strokeStyle = "rgba(0,0,0,0.3)"; g.lineWidth = 0.2; g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x + 0.04, y + 0.06) : g.moveTo(x + 0.04, y + 0.06))); g.stroke();
        g.strokeStyle = "rgb(30,64,40)"; g.lineWidth = 0.19; g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.stroke();
        if (px > 16) {
          g.lineWidth = Math.max(0.006, 0.7 / px);
          for (const [x, y] of pts) for (let k = 0; k < 6; k++) { const a = rng() * 2 * Math.PI, l = 0.07 + rng() * 0.06; g.strokeStyle = rgbS(hellF([40, 86, 52], (rng() - 0.4) * 0.5)); g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke(); }
          g.fillStyle = "rgb(236,242,250)"; for (const [x, y] of pts) if (rng() < 0.5) { g.beginPath(); g.ellipse(x, y - 0.06, 0.06, 0.025, 0, 0, 2 * Math.PI); g.fill(); }
        }
        g.lineCap = "butt";
        /* rote Schleifen */
        g.fillStyle = "rgb(178,20,36)";
        for (const i of [0, Math.floor(pts.length / 2), pts.length - 1]) { const [x, y] = pts[i]; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x - 0.16, y - 0.12, x - 0.13, y + 0.04); g.closePath(); g.fill(); g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 0.16, y - 0.12, x + 0.13, y + 0.04); g.closePath(); g.fill(); g.fillRect(x - 0.02, y, 0.04, 0.2); }
      }
      I.girlande = pts;
    } else if (W.fertig) {
      /* Wandlaterne links vom Portal */
      const lx = cx - w / 2 - 0.3, ly = -3.4;
      if (px > 8) {
        g.fillStyle = "rgb(30,30,32)"; g.fillRect(lx - 0.02, ly - 0.05, 0.3, 0.035); g.fillRect(lx - 0.02, ly - 0.05, 0.04, 0.2);
        g.fillStyle = "rgb(34,34,36)"; g.beginPath(); g.moveTo(lx + 0.1, ly); g.lineTo(lx + 0.34, ly); g.lineTo(lx + 0.3, ly + 0.36); g.lineTo(lx + 0.14, ly + 0.36); g.closePath(); g.fill();
        g.fillStyle = "rgb(230,214,170)"; g.fillRect(lx + 0.16, ly + 0.05, 0.12, 0.26);
        g.fillStyle = "rgb(34,34,36)"; g.beginPath(); g.moveTo(lx + 0.06, ly); g.lineTo(lx + 0.22, ly - 0.14); g.lineTo(lx + 0.38, ly); g.closePath(); g.fill();
      }
    }
  }
  function portalNacht(g, F, I) {
    const W = I.W;
    if (F.nacht < 0.02 || !W.fertig) return;
    const cx = PO.xm, w = 1.8 + 6 * 0.13;
    if (W.winter && I.girlande) {
      for (let i = 1; i < I.girlande.length - 1; i += 2) {
        const [x, y] = I.girlande[i];
        const gr = g.createRadialGradient(x, y, 0, x, y, 0.1);
        gr.addColorStop(0, "rgba(255,236,170," + F.nacht + ")"); gr.addColorStop(1, "rgba(255,190,90,0)");
        g.fillStyle = gr; g.fillRect(x - 0.1, y - 0.1, 0.2, 0.2);
      }
      lp(F, I, cx, -4.6, 2.2, "255,200,120", 0.35);
      /* Kerzen am Adventskranz (Tür liegt 0,5 m tief) */
      const tv = tief(I, 0.5);
      const sturz = -2.9 + 0.05, hT = -0.6 - sturz;
      kranzLicht(g, F, I, cx + tv[0], sturz + hT * 0.36 + tv[1], Math.min(0.42, 1.8 * 0.2));
    } else if (!W.winter) {
      const lx = cx - w / 2 - 0.3 + 0.22, ly = -3.4 + 0.18;
      /* die Laterne leuchtet Portal, Tür und Stufen warm an */
      g.save(); g.globalCompositeOperation = "screen";
      const ga = g.createRadialGradient(lx, ly, 0, lx + 0.6, ly + 0.8, 2.8);
      ga.addColorStop(0, "rgba(200,150,80," + (0.55 * F.nacht).toFixed(3) + ")"); ga.addColorStop(0.5, "rgba(140,100,56," + (0.3 * F.nacht).toFixed(3) + ")"); ga.addColorStop(1, "rgba(80,60,40,0)");
      g.fillStyle = ga; g.fillRect(lx - 3, ly - 3, 6.5, 6.5);
      g.restore();
      const gr = g.createRadialGradient(lx, ly, 0, lx, ly, 0.6);
      gr.addColorStop(0, "rgba(255,236,180," + F.nacht + ")"); gr.addColorStop(0.2, "rgba(255,200,120," + (0.6 * F.nacht) + ")"); gr.addColorStop(1, "rgba(255,170,80,0)");
      g.fillStyle = gr; g.fillRect(lx - 0.6, ly - 0.6, 1.2, 1.2);
      lp(F, I, lx, ly, 2.4, "255,196,120", 0.55);
    }
  }

  /* =====================================================================
     BAUZUSTAND (vorläufig: fertig)
     ===================================================================== */
  function zustand(bau) {
    const k = (a, b) => klemm((bau - a) / (b - a), 0, 1);
    /* stückweise linear: [[bau, wert], …] */
    const stueck = (pts) => {
      if (bau < pts[0][0]) return 0;
      for (let i = pts.length - 1; i >= 0; i--) if (bau >= pts[i][0]) {
        if (i === pts.length - 1) return pts[i][1];
        return pts[i][1] + (pts[i + 1][1] - pts[i][1]) * (bau - pts[i][0]) / (pts[i + 1][0] - pts[i][0]);
      }
      return 0;
    };
    const fertig = bau >= 1;
    const Z = { bau: bau, fertig: fertig, k: k };
    Z.grubeT = bau < 0.19 ? 1.4 * glatt(k(0.0, 0.06)) * (1 - glatt(k(0.155, 0.19))) : 0;
    Z.aushub = bau < 0.2 ? glatt(k(0.0, 0.06)) * (1 - 0.85 * k(0.155, 0.19)) : 0;
    Z.fundament = bau >= 0.07 && bau < 0.2 ? k(0.07, 0.15) : -1;
    Z.boden = k(0.165, 0.2);
    Z.lhH = stueck([[0.18, 0.001], [0.40, LH.tr], [0.48, LH.zf + 0.01]]);
    Z.chH = stueck([[0.19, 0.001], [0.40, CH.tr + 0.01]]);
    Z.saH = stueck([[0.22, 0.001], [0.36, SA.zi + 0.01]]);
    Z.turmH = stueck([[0.18, 0.001], [0.40, LH.tr], [0.60, TU.h + 0.01]]);
    Z.portalH = stueck([[0.2, 0.001], [0.36, PO.hg + 0.01]]);
    Z.turmFertig = bau >= 0.6;
    Z.schale = bau < 0.68; Z.turmSchale = bau < 0.69;
    Z.dachstuhlLH = bau >= 0.48 && bau < 0.57 ? k(0.48, 0.55) : 0;
    Z.dachstuhlCH = bau >= 0.49 && bau < 0.58 ? k(0.49, 0.56) : 0;
    Z.richtbaum = bau >= 0.55 && bau < 0.63;
    Z.dachLH = bau >= 0.57; Z.eindeckLH = k(0.57, 0.67);
    Z.dachCH = bau >= 0.58; Z.eindeckCH = k(0.58, 0.68);
    Z.sakristei = bau >= 0.22 ? 1 : 0; Z.dachSA = bau >= 0.37; Z.eindeckSA = k(0.38, 0.46);
    Z.helmGeruest = bau >= 0.60 && bau < 0.70 ? k(0.60, 0.69) : 0;
    Z.helm = bau >= 0.69 ? 1 : 0; Z.helmH = 99; Z.eindeckHelm = k(0.70, 0.80);
    Z.glas = (i) => bau >= 0.8 + (i % 13) * 0.0075;
    Z.laeden = bau >= 0.84;
    Z.tueren = bau >= 0.88;
    Z.treppe = bau >= 0.88;
    Z.rinnen = bau >= 0.91;
    Z.uhr = bau >= 0.94;
    Z.kreuz = bau >= 0.96;
    Z.portal = bau >= 0.2 ? 1 : 0;
    Z.deko = fertig;
    Z.mauerKappe = !fertig;
    return Z;
  }

  /* =====================================================================
     ANMELDEN
     ===================================================================== */
  ST.modell("kirche", {
    name: "Dorfkirche", gruppe: "Wahrzeichen", grund: [38, 15], hoehe: 37, bauzeit: 30 * 60,
    bauen(M, o) {
      const B = blickVon(o);
      const W = new Werk(o, B);
      const bau = o.bau == null ? 1 : klemm(o.bau, 0, 1);
      W.Z = zustand(bau);
      W.bau = bau >= 1 ? null : bau;
      W.fertig = bau >= 1;
      W.deko = W.Z.deko;
      W.winter = o.jahr === "winter";
      const saat = (o.saat >>> 0) || 7;
      W.variante = saat % 3 === 0 ? 1 : 0;
      W.werk = saat % 5 === 4 ? WERK.gelb : WERK.rot;
      kircheBauen(W, o);
      ausgeben(W, M);
      /* Lichtpfützen vor dem Portal – nur wenn die Südseite zum Betrachter
         zeigt, sonst schiene der Schein durch die Kirche */
      if (W.Z.deko && sichtSued(B.gier)) {
        if (W.winter) { M.bodenlicht(PO.xm, PO.y1 + 1.4, 3.6, "255,206,140", 0.8); M.bodenlicht(-6.5, LH.y + 1.9, 1.6, "255,200,120", 0.5); M.bodenlicht(-1.0, LH.y + 1.9, 1.6, "255,200,120", 0.5); }
        else M.bodenlicht(PO.xm - 0.9, PO.y1 + 1.2, 3.2, "255,196,120", 0.75);
      }
      /* Turmuhr: Zeiger jedes Bild nach der echten (deutschen) Uhrzeit */
      if (o.objekt && W.Z.uhr) M.lebendig((g, P) => turmuhrZeiger(g, P));
    }
  });
  function turmuhrZeiger(g, P) {
    const r = P.gier * RAD, c = Math.cos(r), s = Math.sin(r), a = ST.KZ * Math.SQRT1_2;
    const e = [a * (c + s), a * (c - s), 0.5];
    const std = uhrzeit();
    const lf = ST.lichtFaktor([0, 0, 1], P.Z, 0.15, P.jahr);
    const gold = belicht(GOLD, [Math.min(1, lf[0] + 0.25 * P.Z.nacht), Math.min(1, lf[1] + 0.2 * P.Z.nacht), Math.min(1, lf[2] + 0.1 * P.Z.nacht)]);
    const flaechen = [
      { n: [0, 1, 0], m: [TU.xm, TU.y + 0.01, TU.uhr], u: [1, 0, 0] }, { n: [0, -1, 0], m: [TU.xm, -TU.y - 0.01, TU.uhr], u: [-1, 0, 0] },
      { n: [-1, 0, 0], m: [TU.x0 - 0.01, 0, TU.uhr], u: [0, 1, 0] }, { n: [1, 0, 0], m: [TU.x1 + 0.01, 0, TU.uhr], u: [0, -1, 0] }
    ];
    for (const f of flaechen) {
      if (dot(f.n, e) < 0.05) continue;
      const R = TU.uhrR;
      const pt = (ang, l) => { const q = add(f.m, add(mul(f.u, Math.sin(ang) * l), [0, 0, Math.cos(ang) * l])); return P.proj(q[0], q[1], q[2]); };
      const aH = std / 12 * 2 * Math.PI, aM = (std % 1) * 2 * Math.PI;
      g.lineCap = "round";
      g.strokeStyle = "rgba(0,0,0,0.35)";
      for (const [ang, l0, l1, b] of [[aH, -0.1, 0.5, 0.075], [aM, -0.14, 0.78, 0.05]]) {
        const p0 = pt(ang, l0 * R), p1 = pt(ang, l1 * R);
        g.lineWidth = Math.max(1, b * R * P.s * 1.3); g.strokeStyle = "rgba(0,0,0,0.3)"; g.beginPath(); g.moveTo(p0[0] + 1, p0[1] + 1); g.lineTo(p1[0] + 1, p1[1] + 1); g.stroke();
        g.lineWidth = Math.max(1, b * R * P.s); g.strokeStyle = gold; g.beginPath(); g.moveTo(p0[0], p0[1]); g.lineTo(p1[0], p1[1]); g.stroke();
      }
      const m = pt(0, 0); g.fillStyle = gold; g.beginPath(); g.arc(m[0], m[1], Math.max(1, 0.06 * R * P.s), 0, 2 * Math.PI); g.fill();
      g.lineCap = "butt";
    }
  }
})();
