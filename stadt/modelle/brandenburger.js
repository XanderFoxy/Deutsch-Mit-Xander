/* =====================================================================
   BRANDENBURGER TOR — Berlin (Carl Gotthard Langhans, 1788–1791;
   Quadriga von Johann Gottfried Schadow, 1793)
   ---------------------------------------------------------------------
   XANDER: „ein Baukastensystem für ein Dorf, wo wir sämtliche
   Sehenswürdigkeiten aus Deutschland, die filigran und detailreich
   perfekt nach ihrem Vorbild nachgearbeitet wurden" · „richtig
   filigran. Richtig schön ausarbeiten mit schönen Texturen" · „keine
   Comic Grafik … viel mehr am Realismus" · „ohne Pixelkanten und
   komische Vektorrückstände" · „Man soll das Fundament sehen beim
   Aufbauen" · „Du bist dein schlimmster Kritiker" · Stil „von Anno oder
   geiler", „trotzdem mit SVG Grafiken".

   VORBILD UND MASSSTAB 1:2,5
   Das Tor ist mit den Torhäusern 65,5 m breit und mit der Quadriga 26 m
   hoch. In 1:2,5 wird es 26 m breit und knapp 11 m hoch; alles ist
   gleichmäßig verkleinert.
     • Mittelbau: zwei Reihen zu je sechs dorischen Säulen (Säulen mit
       20 Kanneluren, attischer Basis, Echinus und Abakus), dazwischen
       die fünf Durchfahrten – die mittlere breiter (früher nur für den
       König). Hinter jedem Säulenpaar eine Querwand; in den
       Durchfahrten Relieftafeln. Gebälk mit Architrav und Triglyphen-
       fries (Metopen mit Kentaurenkämpfen), weit ausladendes Kranz-
       gesims.
     • Attika mit dem großen Relieffries (Zug der Friedensgöttin),
       darauf der gestufte Sockel und die Quadriga: die Siegesgöttin im
       Wagen, vier Pferde nebeneinander, die äußeren leicht nach außen
       gewandt; in der Rechten der Stab mit Eichenkranz, Eisernem Kreuz
       und preußischem Adler. Kupfer mit grüner Patina, als echtes
       kleines 3D-Modell (Ellipsoide und Glieder, ST.gestalt), also in
       jedem Drehwinkel richtig.
     • Seitenflügel: Verbindungsmauern und die beiden Torhäuser, kleine
       dorische Tempel mit je vier Säulen an beiden Stirnseiten.
     • Werkstoff: heller Elbsandstein, Quader mit feinen Fugen,
       Schmutzfahnen unter den Gesimsen.
   Ausrichtung: Die Quadriga fährt nach Osten auf den Pariser Platz –
   im Modell nach Süden (+y), der „Hausfront".

   WIE ES GEMALT WIRD
   Ein normales Sprite des Kerns; Körper nach trennenden Ebenen
   geordnet (das Modell kennt den Blickwinkel). Die Säulen sind Figuren:
   ein senkrechter Zylinder sieht aus jeder Richtung gleich aus, darum
   wird er im Bild als echter Zylinder gemalt (quer schattiert, die
   Kanneluren wandern mit der Drehung mit, Abakus und Plinthe als
   kleine 3D-Kästen). Nachts: warmes Flutlicht von Strahlern am Boden
   (im Licht der Flächen selbst gerechnet, damit keine Nähte aufleuchten),
   Lichtpfützen, erleuchtete Durchfahrten, die Quadriga von unten
   angestrahlt.

   BAUPHASEN (o.bau 0…1)
     0,00–0,05  Baugrube
     0,05–0,10  Gründungspfähle (Berliner Sand über Torf)
     0,10–0,16  Fundament aus Sandsteinquadern
     0,16–0,22  Plinthen und Sockel
     0,22–0,52  Säulen Trommel für Trommel, Querwände Lage für Lage,
                die Torhäuser wachsen mit
     0,50–0,62  Architrav, Fries, Kranzgesims
     0,60–0,74  Attika mit Relief
     0,72–0,82  Stufen und Sockel der Quadriga
     0,82–0,95  Quadriga: Pferd für Pferd, dann Wagen, zuletzt Victoria
     0,95–1,00  Schnee, Licht
   Gerüst, Kran und Arbeiter malt stadt/baustelle.js.
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT, PI = ST.pinsel;
  const KX = ST.KX, KY = ST.KY, KZ = ST.KZ;
  const RAD = Math.PI / 180, TAU = Math.PI * 2;

  /* ---------------- Vektoren und Kleinkram ---------------- */
  const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const kreuz = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const nrm = (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const klemm = (x, a, b) => (x < a ? a : x > b ? b : x);
  const glatt = (x) => { x = klemm(x, 0, 1); return x * x * (3 - 2 * x); };
  const mischF = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
  function rgbS(c, a) { return a == null ? "rgb(" + (c[0] | 0) + "," + (c[1] | 0) + "," + (c[2] | 0) + ")" : "rgba(" + (c[0] | 0) + "," + (c[1] | 0) + "," + (c[2] | 0) + "," + (+a).toFixed(3) + ")"; }
  function lfS(f) { return "rgb(" + Math.round(klemm(f[0], 0, 1) * 255) + "," + Math.round(klemm(f[1], 0, 1) * 255) + "," + Math.round(klemm(f[2], 0, 1) * 255) + ")"; }
  function mod(a, m) { return ((a % m) + m) % m; }

  /* Rauschen wie PI.rauschen, aber nur mit den zwei Mustern, die auch
     Putz und Dächer der anderen Modelle benutzen (jedes neue Muster kostet
     beim ersten Malen spürbar Zeit); Abwechslung durch Versatz. */
  function musterVon(g, bild) { return g.createPattern(bild, "repeat"); }
  function rausch(g, x, y, w, h, meter, staerke, v, fein) {
    const bild = fein ? PI.rauschBild(10, 128, 4, 3, 1.6) : PI.rauschBild(3, 128, 4, 4, 1.6);
    const m = musterVon(g, bild), k = meter / 128;
    m.setTransform(new DOMMatrix([k, 0, 0, k, (v || 0) * 0.37 * meter, (v || 0) * 0.61 * meter]));
    g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = staerke; g.fillStyle = m; g.fillRect(x, y, w, h); g.restore();
  }
  function bleich(g, x, y, w, h, meter, staerke, v) {
    const bild = PI.rauschBild(53, 128, 3, 3, 2.2);
    const m = musterVon(g, bild), k = meter / 128;
    m.setTransform(new DOMMatrix([k, 0, 0, k, (v || 0) * 0.29 * meter, (v || 0) * 0.43 * meter]));
    g.save(); g.globalCompositeOperation = "screen"; g.globalAlpha = staerke; g.fillStyle = m; g.fillRect(x, y, w, h); g.restore();
  }

  /* ---------------- Schneller malen: Flächen auf einer CPU-Leinwand ----------------
     Wie beim Fachwerkhaus mit Erker (fachwerkerker.js): jede größere Fläche
     wird zuerst auf einer kleinen Leinwand im Hauptspeicher gemalt und dann
     mit einem Zug ins Sprite gesetzt. Hunderte Fugen, Steine und Verläufe
     sind so viel schneller als einzeln auf der Grafikkarten-Leinwand. Der
     Umriss der Fläche (Beschnitt des Kerns) gilt weiter beim Einsetzen. */
  const CPU = new Map();
  const CPU_MAX = 4, CPU_PX = 2.5e6;
  function cpuLeinwand(w, h) {
    const st = (a) => a <= 512 ? Math.ceil(a / 128) * 128 : Math.ceil(a / 256) * 256;
    const sw = st(w), sh = st(h), k = sw + "x" + sh;
    let c = CPU.get(k);
    if (c) { CPU.delete(k); CPU.set(k, c); return c; }
    const cv = document.createElement("canvas"); cv.width = sw; cv.height = sh;
    c = cv.getContext("2d", { willReadFrequently: true });
    CPU.set(k, c);
    while (CPU.size > CPU_MAX) { const alt = CPU.keys().next().value, ac = CPU.get(alt); ac.canvas.width = ac.canvas.height = 0; CPU.delete(alt); }
    return c;
  }
  function aufCpu(m) {
    return function (g, F) {
      const T = g.getTransform();
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      for (const p of F.flaeche.umriss) {
        const X = T.a * p[0] + T.c * p[1] + T.e, Y = T.b * p[0] + T.d * p[1] + T.f;
        if (X < x0) x0 = X; if (X > x1) x1 = X; if (Y < y0) y0 = Y; if (Y > y1) y1 = Y;
      }
      const W = g.canvas.width, H = g.canvas.height;
      x0 = Math.max(0, Math.floor(x0) - 2); y0 = Math.max(0, Math.floor(y0) - 2);
      x1 = Math.min(W, Math.ceil(x1) + 2); y1 = Math.min(H, Math.ceil(y1) + 2);
      const w = x1 - x0, h = y1 - y0;
      if (w <= 0 || h <= 0) return;
      if (w * h < 2500 || w * h > CPU_PX) { m(g, F); return; }
      const c = cpuLeinwand(w, h);
      c.setTransform(1, 0, 0, 1, 0, 0);
      c.clearRect(0, 0, w + 2, h + 2);
      c.globalAlpha = 1; c.globalCompositeOperation = "source-over";
      c.setTransform(T.a, T.b, T.c, T.d, T.e - x0, T.f - y0);
      c.save(); m(c, F); c.restore();
      g.setTransform(1, 0, 0, 1, 0, 0);
      g.drawImage(c.canvas, 0, 0, w, h, x0, y0, w, h);
      g.setTransform(T);
    };
  }
  function beschleunigen(M) {
    for (const t of M.teile) for (const f of t.flaechen) if (typeof f.malen === "function") f.malen = aufCpu(f.malen);
  }

  /* =====================================================================
     BLICK — aus welcher Richtung sieht die Kamera das Modell?
     (Objekt-Drehung + Kameradrehung; ohne Objekt – Vorschaubild – 30°)
     ===================================================================== */
  function blickVon(o) {
    const ob = o && o.objekt;
    const gier = ob ? (ob.gier || 0) + ((ST.kamera && ST.kamera.dreh) || 0) * 90 : 30;
    const r = gier * RAD, c = Math.cos(r), s = Math.sin(r), a = KZ * Math.SQRT1_2;
    return {
      gier: gier, c: c, s: s,
      e: [a * (c + s), a * (c - s), 0.5],
      nk(n) { return [n[0] * c - n[1] * s, n[0] * s + n[1] * c, n[2]]; },
      bild(p) { const x = p[0] * c - p[1] * s, y = p[0] * s + p[1] * c; return [(x - y) * KX, (x + y) * KY - p[2] * KZ]; }
    };
  }

  /* =====================================================================
     WERK — Körper sammeln und nach trennenden Ebenen ordnen
     ===================================================================== */
  function Werk(M, B) { this.M = M; this.B = B; this.K = []; this.akt = null; }
  Werk.prototype.teil = function (name, opt) {
    opt = opt || {};
    const t = this.M.teil(name, { schatten: opt.schatten !== false, mitte: opt.mitte, ebene: opt.fest || 0 });
    const k = { t: t, name: name, pts: [], pl: [], fest: opt.fest };
    this.K.push(k); this.akt = k;
    return k;
  };
  /* Ebenen und Punkte eines Körpers von Hand (für Figuren) */
  Werk.prototype.huelle = function (pts, pl) { const k = this.akt; for (const p of pts) k.pts.push(p); for (const e of pl || []) k.pl.push(e); };
  /* Ebene Fläche aus 3D-Punkten (Umlauf egal), innen = ein Punkt im
     Körper. u liegt waagrecht, v zeigt „nach unten" in der Fläche –
     so stimmen Muster auf Wänden und Dächern. */
  Werk.prototype.poly = function (pts, innen, malen, opt) {
    if (this.scher) { pts = pts.map(this.scher); innen = this.scher(innen); }
    let n = [0, 0, 0];
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length];
      n[0] += (a[1] - b[1]) * (a[2] + b[2]); n[1] += (a[2] - b[2]) * (a[0] + b[0]); n[2] += (a[0] - b[0]) * (a[1] + b[1]);
    }
    n = nrm(n);
    let m = [0, 0, 0]; for (const p of pts) m = add(m, p); m = mul(m, 1 / pts.length);
    /* innen = ein Punkt im Körper: die Normale zeigt von ihm weg */
    if (dot(n, sub(m, innen)) < 0) n = mul(n, -1);
    let u = kreuz(n, [0, 0, 1]);
    if (Math.hypot(u[0], u[1], u[2]) < 1e-6) u = [1, 0, 0]; else u = nrm(u);
    const v = kreuz(n, u);
    const q = pts.map((p) => { const d = sub(p, pts[0]); return [dot(d, u), dot(d, v)]; });
    let a0 = Infinity, b0 = Infinity, a1 = -Infinity, b1 = -Infinity;
    for (const [a, b] of q) { a0 = Math.min(a0, a); b0 = Math.min(b0, b); a1 = Math.max(a1, a); b1 = Math.max(b1, b); }
    const o = add(pts[0], add(mul(u, a0), mul(v, b0)));
    const f = Object.assign({ o: o, u: u, v: v, w: a1 - a0, h: b1 - b0, umriss: q.map(([a, b]) => [a - a0, b - b0]), malen: malen, keinLicht: true }, opt || {});
    const r = this.M.flaeche(f);
    const k = this.akt;
    for (const p of pts) k.pts.push(p);
    k.pl.push([n, dot(n, pts[0])]);
    return r;
  };
  /* Reihenfolge: je zwei Körper, die sich im Bild überdecken, über eine
     trennende Ebene (eine Fläche des einen oder anderen) ordnen; ohne
     Ebene entscheidet die Tiefe der Mitte. Danach topologisch sortieren. */
  Werk.prototype.ordnen = function () {
    const e = this.B.e, B = this.B, eps = 0.05;
    const L = this.K.filter((k) => k.fest == null && k.pts.length);
    for (const k of L) {
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity, m = [0, 0, 0];
      for (const p of k.pts) { const q = B.bild(p); x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]); m = add(m, p); }
      k.box = [x0, y0, x1, y1]; k.tief = dot(mul(m, 1 / k.pts.length), e);
    }
    const trenne = (A, Bk) => {
      for (const [n, d] of A.pl.concat(Bk.pl)) {
        const ne = dot(n, e);
        if (Math.abs(ne) < 1e-4) continue;
        let aMin = Infinity, aMax = -Infinity, bMin = Infinity, bMax = -Infinity;
        for (const p of A.pts) { const s = dot(n, p) - d; if (s < aMin) aMin = s; if (s > aMax) aMax = s; }
        for (const p of Bk.pts) { const s = dot(n, p) - d; if (s < bMin) bMin = s; if (s > bMax) bMax = s; }
        if (aMax <= eps && bMin >= -eps) return ne > 0 ? 1 : -1;
        if (bMax <= eps && aMin >= -eps) return ne > 0 ? -1 : 1;
      }
      return 0;
    };
    const N = L.length, nach = L.map(() => []), grad = new Array(N).fill(0);
    for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
      const a = L[i].box, b = L[j].box;
      if (a[2] < b[0] - 0.02 || b[2] < a[0] - 0.02 || a[3] < b[1] - 0.02 || b[3] < a[1] - 0.02) continue;
      let r = trenne(L[i], L[j]);
      if (!r) r = L[i].tief <= L[j].tief ? 1 : -1;
      if (r > 0) { nach[i].push(j); grad[j]++; } else { nach[j].push(i); grad[i]++; }
    }
    const fertig = new Array(N).fill(false);
    for (let rang = 0; rang < N; rang++) {
      let best = -1;
      for (let i = 0; i < N; i++) if (!fertig[i] && grad[i] === 0 && (best < 0 || L[i].tief < L[best].tief)) best = i;
      if (best < 0) for (let i = 0; i < N; i++) if (!fertig[i] && (best < 0 || grad[i] < grad[best] || (grad[i] === grad[best] && L[i].tief < L[best].tief))) best = i;
      fertig[best] = true; L[best].t.ebene = rang;
      for (const j of nach[best]) grad[j]--;
    }
    return N;
  };

  /* ---------------- Licht auf eigene Rechnung ----------------
     Alle Flächen malen ihr Licht selbst (keinLicht): so lassen sich gekrümmte
     Flächen weich schattieren und Schlagschatten ohne
     Sonnenanteil malen. */
  function lichtVon(B, F, n, ohneSonne) {
    const Z = ohneSonne ? { amb: F.zeit.amb, sonne: [0, 0, 0], nacht: F.zeit.nacht } : F.zeit;
    return ST.lichtFaktor(B.nk(n), Z, 0, F.jahr);
  }
  function belichten(g, F, B, nL, nR, opt) {
    opt = opt || {};
    g.save();
    g.globalCompositeOperation = "multiply";
    if (opt.flut && F.nacht > 0) lichtkarte(g, F, B, nL, nR, opt.flut, opt.flutK);
    else {
      const a = lichtVon(B, F, nL), b = nR ? lichtVon(B, F, nR) : a;
      if (nR) { const gr = g.createLinearGradient(0, 0, F.w, 0); gr.addColorStop(0, lfS(a)); gr.addColorStop(1, lfS(b)); g.fillStyle = gr; }
      else g.fillStyle = lfS(a);
      g.fillRect(-1, -1, F.w + 2, F.h + 2);
    }
    if (opt.traufe && F.h > 0.5) {
      /* Schatten des Dachüberstands */
      const k = Math.max(0, F.lichtN), tief = opt.traufe * (0.6 + 1.2 * k);
      const gr = g.createLinearGradient(0, 0, 0, tief);
      gr.addColorStop(0, "rgb(120,126,156)"); gr.addColorStop(0.6, "rgb(196,200,220)"); gr.addColorStop(1, "rgb(255,255,255)");
      g.fillStyle = gr; g.fillRect(-1, -0.01, F.w + 2, tief + 0.02);
    }
    if (opt.ao) {
      const hoch = Math.min(0.6, F.h * 0.5);
      const gr = g.createLinearGradient(0, F.h, 0, F.h - hoch);
      gr.addColorStop(0, "rgba(80,80,100,1)"); gr.addColorStop(1, "rgba(255,255,255,1)");
      g.fillStyle = gr; g.fillRect(-1, F.h - hoch, F.w + 2, hoch + 1);
    }
    g.restore();
  }
  /* Schlagschatten fremder Körper (Punktwolken) auf diese Fläche */
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
  function schlagschatten(g, F, B, n, werfer) {
    if (!werfer || !werfer.length || F.lichtN <= 0.04) return;
    const f = F.flaeche;
    const mit = lichtVon(B, F, n), ohne = lichtVon(B, F, n, true);
    const k = [ohne[0] / Math.max(0.01, mit[0]), ohne[1] / Math.max(0.01, mit[1]), ohne[2] / Math.max(0.01, mit[2])];
    g.save();
    g.globalCompositeOperation = "multiply";
    g.fillStyle = lfS(k);
    /* alle Schatten in EINEN Pfad (Vereinigung): überlappende Schatten
       dürfen nicht doppelt abdunkeln */
    g.beginPath();
    let irgend = false;
    for (const pts of werfer) {
      const q = [];
      for (const p of pts) {
        const d = sub(p, f.o), hh = dot(d, n);
        if (hh < 0.02) continue;
        const sv = F.schatten(hh);
        if (!sv) continue;
        const a = dot(d, f.u), b = dot(d, f.v);
        q.push([a + sv[0], b + sv[1]], [a, b]);
      }
      if (q.length < 3) continue;
      const H = huelle2(q);
      /* gleicher Umlaufsinn für alle Hüllen, damit „nonzero" vereinigt */
      g.moveTo(H[0][0], H[0][1]); for (let i = 1; i < H.length; i++) g.lineTo(H[i][0], H[i][1]); g.closePath();
      irgend = true;
    }
    if (irgend) g.fill("nonzero");
    g.restore();
  }

  /* ---------------- Flutlicht bei Nacht ----------------
     Strahler am Boden werfen nach oben gezogene Lichtkegel. Die
     Helligkeit wird auf einem groben Raster in WELTkoordinaten gerechnet
     (Abstand und Einfallswinkel zu jedem Strahler), als kleines Lichtbild
     weich über die Fläche gelegt und wie das Tageslicht multipliziert:
     der Stein bleibt Stein (Fugen dunkel, Glasur glänzt), er wird nur
     warm angestrahlt – und die Kegel laufen ohne Kante über Säulen und Gesimse. */
  let FLUT_C = null;
  const WARM = [1.0, 0.74, 0.44];
  function flutWert(strahler, P, n) {
    let a = 0;
    for (const S of strahler) {
      const d = sub(S, P), l = Math.hypot(d[0], d[1], d[2]) || 1;
      const cs = (n[0] * d[0] + n[1] * d[1] + n[2] * d[2]) / l;
      if (cs <= 0.02) continue;
      /* Kegel nach oben: seitlich schneller dunkel als in der Höhe */
      const hz = Math.hypot(d[0], d[1]), vz = Math.abs(P[2] - S[2]);
      a += cs * 2.9 / (1 + (hz / 1.9) * (hz / 1.9) + (vz / 6.5) * (vz / 6.5));
    }
    return a > 0 ? 0.2 + a : 0;
  }
  /* Licht einer Fläche bei Nacht: Himmelslicht (wie der Kern) plus warmes
     Flutlicht, als kleines Lichtbild multipliziert. Weil es im Malen der
     Fläche geschieht (nicht darüber), entstehen an den Nähten zwischen
     Facetten keine doppelt aufgehellten Streifen. */
  function lichtkarte(g, F, B, nL, nR, strahler, k0) {
    const f = F.flaeche;
    const k = (F.nacht > 0.9 ? 1 : 0.5 * F.nacht) * (k0 == null ? 1 : k0);
    const nx = klemm(Math.ceil(F.w / 0.45) + 1, 2, 48), ny = klemm(Math.ceil(F.h / 0.45) + 1, 2, 48);
    /* Lichtbild auf einer CPU-Leinwand (sonst müsste jede Fläche es aus der Grafikkarte zurücklesen) */
    if (!FLUT_C) { FLUT_C = document.createElement("canvas"); FLUT_C.width = FLUT_C.height = 48; FLUT_C.getContext("2d", { willReadFrequently: true }); }
    const c = FLUT_C.getContext("2d", { willReadFrequently: true });
    const id = c.createImageData(nx, ny);
    const lL = lichtVon(B, F, nL), lR = nR ? lichtVon(B, F, nR) : lL;
    for (let i = 0; i < nx; i++) {
      const t = i / (nx - 1), x = F.w * t;
      const n = nR ? nrm(mischF(nL, nR, t)) : nL;
      const l0 = mischF(lL, lR, t);
      for (let j = 0; j < ny; j++) {
        const y = F.h * j / (ny - 1);
        const P = add(f.o, add(mul(f.u, x), mul(f.v, y)));
        const a = k * flutWert(strahler, P, n);
        const q = (j * nx + i) * 4;
        id.data[q] = Math.round(klemm(l0[0] + a * WARM[0], 0, 1) * 255);
        id.data[q + 1] = Math.round(klemm(l0[1] + a * WARM[1], 0, 1) * 255);
        id.data[q + 2] = Math.round(klemm(l0[2] + a * WARM[2], 0, 1) * 255);
        id.data[q + 3] = 255;
      }
    }
    c.putImageData(id, 0, 0);
    const dx = F.w / (nx - 1), dy = F.h / (ny - 1);
    g.save();
    g.globalCompositeOperation = "multiply";
    g.imageSmoothingEnabled = true; g.imageSmoothingQuality = "high";
    g.drawImage(FLUT_C, 0, 0, nx, ny, -dx / 2, -dy / 2, F.w + dx, F.h + dy);
    g.restore();
  }


  /* =====================================================================
     MASSE (Modell 1:2,5, Meter; x = Osten, y = Süden = Pariser Platz)
     ===================================================================== */
  const GRUND = [26, 8];
  const SX = [-5.92, -3.7, -1.48, 1.48, 3.7, 5.92];   // Säulenachsen (Durchfahrt Mitte 2,26 m, sonst 1,52 m)
  const SY = 1.85;                                    // Säulenreihen bei ±y
  const SR0 = 0.35, SR1 = 0.3;                        // Säulenradius unten / oben (Verjüngung)
  const Z_ST = 0.22;       // Oberkante Plinthen
  const Z_SAE = 5.55;      // Oberkante Säulen = Unterkante Architrav
  const Z_ARCH = 6.05;     // Architrav / Fries
  const Z_FR = 6.62;       // Fries / Kranzgesims
  const Z_GES = 6.95;      // Oberkante Kranzgesims
  const Z_ATT = 8.3;       // Attika
  const Z_ATTG = 8.45;     // Attikagesims
  const Z_ST1 = 8.85, Z_ST2 = 9.2, Z_SOCK = 9.45;     // Stufen und Quadrigasockel
  const XE0 = 5.62, XE1 = 6.62;                       // Endwände
  const WT = 1.45, WB = 0.27;                         // Querwände: halbe Tiefe, halbe Dicke
  /* Torhäuser */
  const HX0 = 9.4, HX1 = 13.0, HY = 4.0, HYK = 3.15;
  const Z_H0 = 0.2, Z_HS = 3.35, Z_HG = 4.05, Z_HA = 4.35;
  const HSX = [9.78, 10.73, 11.67, 12.62], HSY = 3.6, HR0 = 0.2, HR1 = 0.172;
  /* Verbindungsmauern */
  const VY = 0.75, Z_V = 3.0, Z_VK = 3.2;
  /* Triglyphen: über jeder Säulenachse und im Abstand von 0,74 m */
  const TRIG_X = []; for (let x = -5.92; x <= 5.93; x += 0.74) TRIG_X.push(+x.toFixed(3)); TRIG_X.push(-6.46, 6.46);
  const TRIG_Y = [-1.85, -1.11, -0.37, 0.37, 1.11, 1.85];

  /* ---------------- Farben ---------------- */
  const STEIN = [214, 204, 182];      // Elbsandstein, gereinigt
  const KUPFER = [86, 148, 126];      // Patina
  const SCHNEE = [240, 244, 250];

  /* =====================================================================
     SANDSTEIN — Quader mit feinen Fugen, Schmutzfahnen, Ausbesserungen
     ===================================================================== */
  function a0Von(F) { return dot(F.flaeche.o, F.flaeche.u); }
  function stein(g, F, zTop, opt) {
    opt = opt || {};
    const w = F.w, h = F.h, a0 = a0Von(F);
    g.fillStyle = rgbS(opt.farbe || STEIN); g.fillRect(-0.2, -0.2, w + 0.4, h + 0.4);
    rausch(g, -0.2, -0.2, w + 0.4, h + 0.4, 3.6, 0.15, (a0 * 3 + zTop) | 0, false);
    if (F.px > 18) rausch(g, -0.2, -0.2, w + 0.4, h + 0.4, 0.8, 0.1, 5, true);
    if (F.px > 12) bleich(g, -0.2, -0.2, w + 0.4, h + 0.4, 2.6, 0.08, 3);
    if (F.px > 7 && !opt.glatt) {
      const lage = opt.lage || 0.46, lang = opt.lang || 1.15, zMin = zTop - h;
      /* einzelne Quader etwas anders getönt (ausgetauschte Steine) */
      if (F.px > 20) {
        const rng = ST.zufall(((a0 * 7 + zTop * 13) | 0) + 5);
        for (let z = Math.floor(zMin / lage) * lage; z < zTop; z += lage) {
          const ri = Math.round(z / lage), off = (ri % 2) * lang / 2;
          for (let x = -mod(a0 + off, lang); x < w; x += lang) {
            const r = rng();
            if (r < 0.22) { g.fillStyle = r < 0.1 ? "rgba(255,248,230,0.16)" : "rgba(120,104,80,0.1)"; g.fillRect(x, zTop - z - lage, lang, lage); }
          }
        }
      }
      g.strokeStyle = "rgba(96,84,66,0.34)"; g.lineWidth = Math.max(0.008, 0.6 / F.px);
      g.beginPath();
      for (let z = Math.ceil(zMin / lage) * lage; z < zTop + lage; z += lage) {
        const y = zTop - z, ri = Math.round(z / lage), off = (ri % 2) * lang / 2;
        g.moveTo(-0.2, y); g.lineTo(w + 0.2, y);
        for (let x = -mod(a0 + off, lang); x < w; x += lang) { g.moveTo(x, y); g.lineTo(x, y - lage); }
      }
      g.stroke();
    }
    if (opt.fahnen !== false) {
      /* Schmutzfahnen: vom Regen unter den Gesimsen herabgezogen */
      const gr = g.createLinearGradient(0, 0, 0, Math.min(h, 1.6));
      gr.addColorStop(0, "rgba(80,72,60,0.22)"); gr.addColorStop(1, "rgba(80,72,60,0)");
      g.fillStyle = gr; g.fillRect(-0.2, 0, w + 0.4, Math.min(h, 1.6));
      if (F.px > 16 && h > 0.8) {
        const rng = ST.zufall(((a0 * 11) | 0) + 17);
        for (let i = 0; i < Math.min(6, w * 0.5); i++) {
          const x = rng() * w, l = 0.4 + rng() * 1.6, b = 0.05 + rng() * 0.12;
          const gg = g.createLinearGradient(0, 0, 0, l);
          gg.addColorStop(0, "rgba(70,62,52,0.16)"); gg.addColorStop(1, "rgba(70,62,52,0)");
          g.fillStyle = gg; g.fillRect(x, 0, b, l);
        }
      }
    }
    if (opt.boden) {
      const gr = g.createLinearGradient(0, h, 0, h - 0.8);
      gr.addColorStop(0, "rgba(70,64,56,0.3)"); gr.addColorStop(1, "rgba(70,64,56,0)");
      g.fillStyle = gr; g.fillRect(-0.2, h - 0.8, w + 0.4, 0.8);
    }
  }
  function steinOben(Z) {
    return function (g, F) {
      /* Abdeckplatten aus Sandstein, verwittert, mit Fugen */
      const f = F.flaeche;
      g.fillStyle = rgbS([198, 188, 168]); g.fillRect(-1, -1, F.w + 2, F.h + 2);
      rausch(g, -1, -1, F.w + 2, F.h + 2, 4.5, 0.12, 9, false);
      if (F.px > 8) rausch(g, -1, -1, F.w + 2, F.h + 2, 0.6, 0.1, 4, true);
      if (F.px > 6) {
        const ox = mod(f.o[0], 1.2), oy = mod(f.o[1], 0.8);
        g.strokeStyle = "rgba(90,80,64,0.3)"; g.lineWidth = Math.max(0.01, 0.6 / F.px);
        g.beginPath();
        for (let y = -oy; y < F.h; y += 0.8) { g.moveTo(-1, y); g.lineTo(F.w + 1, y); const r = Math.round((y + f.o[1]) / 0.8) % 2 ? 0.6 : 0; for (let x = -mod(ox + r, 1.2); x < F.w; x += 1.2) { g.moveTo(x, y); g.lineTo(x, y + 0.8); } }
        g.stroke();
      }
      if (Z.schnee > 0) schneeOben(g, F, Z.schnee);
    };
  }
  function schneeOben(g, F, k) {
    const rng = ST.zufall(((F.w * 31 + F.h * 7) | 0) + 3);
    g.fillStyle = rgbS(SCHNEE, 0.95 * k); g.fillRect(-1, -1, F.w + 2, F.h + 2);
    rausch(g, -1, -1, F.w + 2, F.h + 2, 1.2, 0.12, 31, false);
    /* Verwehungen */
    for (let i = 0; i < F.w * F.h * 0.4; i++) {
      const cx = rng() * F.w, cy = rng() * F.h, r = 0.3 + rng() * 0.8;
      const gr = g.createRadialGradient(cx, cy, 0, cx, cy, r);
      gr.addColorStop(0, "rgba(180,196,226,0.14)"); gr.addColorStop(1, "rgba(180,196,226,0)");
      g.fillStyle = gr; g.fillRect(cx - r, cy - r, 2 * r, 2 * r);
    }
  }
  /* Schneekante an der Oberkante einer senkrechten Fläche (überhängend) */
  function schneeKante(g, F, k, dick) {
    const rng = ST.zufall(((a0Von(F) * 13) | 0) + 7);
    g.fillStyle = rgbS(SCHNEE, 0.97 * k);
    g.beginPath(); g.moveTo(-0.2, -0.05);
    for (let x = -0.2; x <= F.w + 0.3; x += 0.12) g.lineTo(x, dick * (0.5 + rng() * 0.7));
    g.lineTo(F.w + 0.3, -0.05); g.closePath(); g.fill();
    g.fillStyle = "rgba(160,180,215,0.35)";
    g.fillRect(-0.2, dick * 0.45, F.w + 0.4, Math.max(0.01, 0.8 / F.px));
  }

  /* ---------------- Relief (Attika, Durchfahrten, Metopen) ----------------
     Flaches Relief wie gemeißelt: weiche, gerundete Gestalten (Gewand
     in Falten, Pferde im Schritt), nur wenig heller als der Grund; jede
     Gestalt wirft um die Relieftiefe versetzt einen Schatten und hat an
     der Lichtkante einen feinen Glanz. Keine Piktogramme. */
  const FALTEN = { an: false };
  function reliefPfad(g, art, x, yU, k, s, rng) {
    /* s = Blickrichtung der Gestalt (1 = nach rechts) */
    const X = (dx) => x + dx * k * s, Yy = (dy) => yU - dy * k;
    if (art === "mensch" || art === "frau") {
      const vor = 0.04 + rng() * 0.05, arm = rng();
      /* Kopf */
      g.moveTo(X(0.06), Yy(0.93)); g.ellipse(X(0), Yy(0.93), 0.055 * k, 0.066 * k, 0, 0, TAU);
      /* Gewand: Schultern, Gürtel, schwingender Saum, Schrittbein */
      g.moveTo(X(-0.02), Yy(0.86));
      g.bezierCurveTo(X(-0.1), Yy(0.84), X(-0.12), Yy(0.72), X(-0.1), Yy(0.6));
      g.bezierCurveTo(X(-0.12), Yy(0.4), X(-0.18 - vor), Yy(0.15), X(-0.2 - vor), Yy(0));
      g.bezierCurveTo(X(-0.1), Yy(0.02), X(0.02), Yy(-0.01), X(0.08), Yy(0.02));
      g.bezierCurveTo(X(0.12 + vor), Yy(0.0), X(0.2 + vor), Yy(0.02), X(0.22 + vor), Yy(0.0));
      g.bezierCurveTo(X(0.16 + vor * 0.5), Yy(0.25), X(0.12), Yy(0.45), X(0.1), Yy(0.6));
      g.bezierCurveTo(X(0.12), Yy(0.72), X(0.1), Yy(0.84), X(0.02), Yy(0.86));
      g.closePath();
      if (FALTEN.an) {
        /* Falten des Gewands (nur ganz nah; als dünne Stege gezeichnet) */
        for (const q of [-0.06, 0.0, 0.07]) { g.moveTo(X(q), Yy(0.58)); g.bezierCurveTo(X(q * 1.4 - 0.01), Yy(0.36), X(q * 1.9 + vor * 0.4), Yy(0.16), X(q * 2.2 + vor * 0.5), Yy(0.02)); g.lineTo(X(q * 2.2 + vor * 0.5 + 0.012), Yy(0.02)); g.bezierCurveTo(X(q * 1.9 + vor * 0.4 + 0.01), Yy(0.16), X(q * 1.4), Yy(0.36), X(q + 0.01), Yy(0.58)); g.closePath(); }
      }
      if (arm > 0.45) {
        /* erhobener Arm mit Zweig */
        g.moveTo(X(0.08), Yy(0.8)); g.bezierCurveTo(X(0.16), Yy(0.86), X(0.2), Yy(0.96), X(0.24), Yy(1.04));
        g.lineTo(X(0.27), Yy(1.02)); g.bezierCurveTo(X(0.22), Yy(0.92), X(0.18), Yy(0.8), X(0.1), Yy(0.72)); g.closePath();
        g.moveTo(X(0.25), Yy(1.03)); g.ellipse(X(0.27), Yy(1.1), 0.035 * k, 0.07 * k, 0.4 * s, 0, TAU);
      }
    } else if (art === "pferd") {
      /* Pferd im Schritt, Kopf gehoben */
      g.moveTo(X(-0.38), Yy(0.62));
      g.bezierCurveTo(X(-0.3), Yy(0.72), X(0.05), Yy(0.7), X(0.24), Yy(0.72));
      g.bezierCurveTo(X(0.34), Yy(0.86), X(0.4), Yy(1.0), X(0.46), Yy(1.02));
      g.bezierCurveTo(X(0.52), Yy(1.0), X(0.58), Yy(0.92), X(0.6), Yy(0.88));
      g.bezierCurveTo(X(0.56), Yy(0.84), X(0.5), Yy(0.86), X(0.46), Yy(0.82));
      g.bezierCurveTo(X(0.42), Yy(0.7), X(0.38), Yy(0.56), X(0.3), Yy(0.46));
      g.bezierCurveTo(X(0.1), Yy(0.4), X(-0.2), Yy(0.42), X(-0.36), Yy(0.46));
      g.bezierCurveTo(X(-0.44), Yy(0.5), X(-0.44), Yy(0.58), X(-0.38), Yy(0.62));
      g.closePath();
      /* Beine: schlanke, sich verjüngende Formen; eines erhoben */
      const bein = (x0, x1, y1) => { g.moveTo(X(x0 - 0.035), Yy(0.48)); g.bezierCurveTo(X(x0 - 0.03), Yy(0.3), X(x1 - 0.02), Yy(y1 + 0.12), X(x1 - 0.018), Yy(y1)); g.lineTo(X(x1 + 0.018), Yy(y1)); g.bezierCurveTo(X(x1 + 0.02), Yy(y1 + 0.12), X(x0 + 0.03), Yy(0.3), X(x0 + 0.035), Yy(0.48)); g.closePath(); };
      bein(-0.3, -0.34, 0); bein(-0.2, -0.16, 0); bein(0.18, 0.3, 0.14); bein(0.26, 0.26, 0);
      /* Schweif */
      g.moveTo(X(-0.38), Yy(0.62)); g.bezierCurveTo(X(-0.48), Yy(0.56), X(-0.5), Yy(0.36), X(-0.46), Yy(0.26)); g.lineTo(X(-0.43), Yy(0.3)); g.bezierCurveTo(X(-0.44), Yy(0.42), X(-0.42), Yy(0.54), X(-0.36), Yy(0.58)); g.closePath();
    } else if (art === "wagen") {
      g.moveTo(X(0.13), Yy(0.26)); g.ellipse(X(0), Yy(0.26), 0.13 * k, 0.13 * k, 0, 0, TAU);
      g.moveTo(X(-0.18), Yy(0.36)); g.bezierCurveTo(X(-0.2), Yy(0.6), X(0.1), Yy(0.66), X(0.2), Yy(0.56)); g.lineTo(X(0.18), Yy(0.36)); g.closePath();
      reliefPfad(g, "frau", x + 0.02 * k * s, yU - 0.3 * k, k * 0.72, s, rng);
    } else {
      /* Metope: Kentaur und Lapith im Ringen */
      g.moveTo(X(-0.36), Yy(0.5)); g.bezierCurveTo(X(-0.3), Yy(0.62), X(0.0), Yy(0.6), X(0.1), Yy(0.56)); g.bezierCurveTo(X(0.14), Yy(0.44), X(0.0), Yy(0.36), X(-0.3), Yy(0.38)); g.closePath();
      g.moveTo(X(0.02), Yy(0.56)); g.bezierCurveTo(X(0.0), Yy(0.8), X(0.1), Yy(0.9), X(0.14), Yy(0.92)); g.lineTo(X(0.2), Yy(0.86)); g.bezierCurveTo(X(0.16), Yy(0.72), X(0.14), Yy(0.6), X(0.1), Yy(0.52)); g.closePath();
      g.moveTo(X(0.2), Yy(0.98)); g.ellipse(X(0.16), Yy(0.98), 0.05 * k, 0.06 * k, 0, 0, TAU);
      for (const [x0, x1] of [[-0.3, -0.36], [-0.22, -0.18], [0.0, 0.08], [0.06, 0.02]]) { g.moveTo(X(x0 - 0.025), Yy(0.42)); g.lineTo(X(x1 - 0.015), Yy(0)); g.lineTo(X(x1 + 0.015), Yy(0)); g.lineTo(X(x0 + 0.025), Yy(0.42)); g.closePath(); }
      reliefPfad(g, "mensch", x - 0.24 * k * s, yU, k * 0.9, -s, rng);
    }
  }
  function reliefZeichnen(g, F, liste, yU, hh, saat) {
    const sv = F.schatten(0.035) || [0.02, 0.02];
    const lage = [[sv[0], sv[1], "rgba(78,66,50,0.34)"], [0, 0, "rgba(226,216,194,0.62)"]];
    for (const [dx, dy, farbe] of lage) {
      g.save(); g.translate(dx, dy); g.fillStyle = farbe;
      const rng = ST.zufall(saat);
      g.beginPath();
      for (const [art, xx, sp] of liste) reliefPfad(g, art, xx, yU, hh, sp ? -1 : 1, rng);
      g.fill("nonzero");
      g.restore();
    }
    if (F.px * hh > 70) {
      /* Falten: dunkle Stege im Gewand */
      g.save(); g.fillStyle = "rgba(96,84,66,0.28)"; FALTEN.an = true;
      const rng = ST.zufall(saat);
      g.beginPath(); for (const [art, xx, sp] of liste) if (art === "mensch" || art === "frau") reliefPfad(g, art, xx, yU, hh, sp ? -1 : 1, rng); else reliefPfad(g, art, xx, yU, hh, sp ? -1 : 1, ST.zufall(1));
      FALTEN.an = false; g.restore();
    }
    /* Lichtkante: ein Hauch Glanz auf der dem Licht zugewandten Seite */
    if (F.px * hh > 30) {
      g.save(); g.translate(-sv[0] * 0.35, -sv[1] * 0.35); g.fillStyle = "rgba(255,252,240,0.22)";
      const rng = ST.zufall(saat);
      g.beginPath(); for (const [art, xx, sp] of liste) reliefPfad(g, art, xx, yU, hh, sp ? -1 : 1, rng); g.fill("nonzero");
      g.restore();
      g.save(); g.fillStyle = "rgba(214,204,182,0.55)";
      const rng2 = ST.zufall(saat);
      g.beginPath(); for (const [art, xx, sp] of liste) reliefPfad(g, art, xx, yU, hh, sp ? -1 : 1, rng2); g.fill("nonzero");
      g.restore();
    }
  }
  function relief(g, F, x0, y0, w, h, saat, arten) {
    /* vertiefte Tafel mit Rahmen: oben und an der Lichtseite Schatten */
    const sv = F.schatten(0.05) || [0, 0];
    g.fillStyle = "rgba(150,138,114,0.16)"; g.fillRect(x0, y0, w, h);
    g.fillStyle = "rgba(70,60,46,0.3)"; g.beginPath(); g.rect(x0, y0, w, h); g.rect(x0 + sv[0] + w, y0 + sv[1], -w, h); g.fill("evenodd");
    g.strokeStyle = "rgba(255,250,236,0.35)"; g.lineWidth = Math.max(0.012, 0.7 / F.px); g.strokeRect(x0 - 0.03, y0 - 0.03, w + 0.06, h + 0.06);
    if (F.px * h < 10) { rausch(g, x0, y0, w, h, 0.35, 0.3, saat, true); return; }
    const rng = ST.zufall(saat);
    const hh = h * 0.82, yU = y0 + h * 0.93;
    const liste = [];
    let x = x0 + hh * 0.35;
    while (x < x0 + w - hh * 0.3) {
      const art = arten[(rng() * arten.length) | 0];
      if (art === "pferd" && x + hh * 0.6 > x0 + w) break;
      liste.push([art, x, rng() < 0.25]);
      x += art === "pferd" ? hh * 0.95 : art === "wagen" ? hh * 0.45 : hh * (0.3 + rng() * 0.12);
    }
    g.save(); g.beginPath(); g.rect(x0, y0, w, h); g.clip();
    reliefZeichnen(g, F, liste, yU, hh, saat);
    g.restore();
  }

  /* ---------------- Gebälk: Architrav, Triglyphenfries ---------------- */
  function gebaelk(g, F, zTop, achsen, Z) {
    stein(g, F, zTop, { lage: 0.57, lang: 1.48, fahnen: false });
    const f = F.flaeche, w = F.w;
    const yA = zTop - Z_ARCH, yF = zTop - Z_FR;     // Architrav-Oberkante, Friesoberkante (Flächen-y)
    const sv = F.schatten(0.05) || [0, 0];
    /* Architrav: Faszie und Tänie */
    g.fillStyle = "rgba(90,80,64,0.35)"; g.fillRect(-0.2, yA, w + 0.4, Math.max(0.012, 0.9 / F.px));
    g.fillStyle = "rgba(255,250,236,0.35)"; g.fillRect(-0.2, yA + 0.02, w + 0.4, 0.04);
    /* Metopen liegen zurück: etwas dunkler */
    g.fillStyle = "rgba(110,98,78,0.14)"; g.fillRect(-0.2, yF, w + 0.4, yA - yF);
    const tb = 0.32;
    for (const X of achsen) {
      const x = X - 0; // Flächen-x
      if (x < -0.5 || x > w + 0.5) continue;
      /* Schatten der vorstehenden Triglyphe auf die Metope */
      g.fillStyle = "rgba(60,52,40,0.3)"; g.fillRect(x - tb / 2 + sv[0], yF + sv[1], tb, yA - yF);
      g.fillStyle = rgbS([222, 212, 190]); g.fillRect(x - tb / 2, yF, tb, yA - yF);
      if (F.px * tb > 5) {
        /* zwei Schlitze und zwei halbe am Rand */
        g.fillStyle = "rgba(70,62,50,0.55)";
        for (const k of [-0.5, -1 / 6, 1 / 6, 0.5]) { const b = Math.abs(k) === 0.5 ? 0.02 : 0.04; g.fillRect(x + k * tb - b / 2, yF + 0.06, b, yA - yF - 0.06); }
        /* Regula mit Tropfen unter der Tänie */
        g.fillStyle = "rgba(80,70,56,0.45)"; g.fillRect(x - tb / 2, yA + 0.06, tb, 0.025);
        if (F.px > 30) for (let i = 0; i < 6; i++) { g.beginPath(); g.arc(x - tb / 2 + tb * (i + 0.5) / 6, yA + 0.1, 0.012, 0, TAU); g.fill(); }
      }
    }
    /* Metopenreliefs (Kentaurenkämpfe) */
    if (F.px > 22) {
      g.save(); g.beginPath(); g.rect(-0.2, yF, w + 0.4, yA - yF); g.clip();
      for (let i = 0; i < achsen.length - 1; i++) {
        const a = achsen[i], b = achsen[i + 1];
        if (b - a > 1 || b < 0 || a > w) continue;
        const m = (a + b) / 2, mh = yA - yF - 0.1;
        reliefZeichnen(g, F, [["kentaur", m + mh * 0.06, i % 2 === 0]], yA - 0.04, mh * 0.82, i + 3);
      }
      g.restore();
    }
    void f; void Z;
  }
  /* Kranzgesims: Hängeplatte, darunter Mutuli im Schatten */
  function gesims(g, F, zTop, Z) {
    stein(g, F, zTop, { glatt: true, fahnen: false, farbe: [220, 210, 190] });
    const h = F.h, w = F.w;
    g.fillStyle = "rgba(255,250,236,0.3)"; g.fillRect(-0.2, 0, w + 0.4, 0.04);
    g.fillStyle = "rgba(80,70,56,0.4)"; g.fillRect(-0.2, h * 0.55, w + 0.4, Math.max(0.01, 0.8 / F.px));
    /* Mutuli / Zahnschnitt */
    if (F.px > 12) {
      const a0 = a0Von(F), t = 0.16;
      g.fillStyle = "rgba(70,60,48,0.45)";
      for (let x = -mod(a0, t); x < w; x += t) g.fillRect(x, h * 0.62, t * 0.45, h * 0.38);
    }
    const gr = g.createLinearGradient(0, h * 0.55, 0, h);
    gr.addColorStop(0, "rgba(40,36,50,0.08)"); gr.addColorStop(1, "rgba(40,36,50,0.32)");
    g.fillStyle = gr; g.fillRect(-0.2, h * 0.55, w + 0.4, h * 0.45);
    if (Z.schnee > 0) schneeKante(g, F, Z.schnee, 0.07);
  }

  /* Fenster eines Torhauses: hohes Rechteck mit Faschen und Verdachung */
  function hausFenster(g, F, Z, x, yO, w, h) {
    const sv = F.schatten(0.12) || [0, 0];
    g.fillStyle = "rgba(255,250,236,0.35)"; g.fillRect(x - 0.08, yO - 0.08, w + 0.16, h + 0.16);
    g.fillStyle = "rgba(90,80,64,0.45)"; g.fillRect(x - 0.14, yO - 0.2, w + 0.28, 0.1);
    const gr = g.createLinearGradient(0, yO, 0, yO + h);
    gr.addColorStop(0, "rgb(120,134,150)"); gr.addColorStop(0.5, "rgb(52,60,72)"); gr.addColorStop(1, "rgb(36,40,48)");
    g.fillStyle = gr; g.fillRect(x, yO, w, h);
    if (F.px > 16) {
      g.strokeStyle = "rgb(226,222,210)"; g.lineWidth = Math.max(0.018, 0.7 / F.px);
      g.beginPath(); g.moveTo(x + w / 2, yO); g.lineTo(x + w / 2, yO + h);
      for (let k = 1; k < 4; k++) { g.moveTo(x, yO + h * k / 4); g.lineTo(x + w, yO + h * k / 4); }
      g.stroke();
    }
    g.fillStyle = "rgba(30,26,34,0.5)";
    g.beginPath(); g.rect(x, yO, w, h); g.rect(x + w + sv[0], yO + sv[1], -w, h); g.fill("evenodd");
    g.fillStyle = "rgba(200,190,170,1)"; g.fillRect(x - 0.1, yO + h, w + 0.2, 0.07);
    if (Z.schnee > 0) { g.fillStyle = rgbS(SCHNEE, 0.95 * Z.schnee); g.fillRect(x - 0.1, yO + h - 0.035, w + 0.2, 0.045); g.fillRect(x - 0.14, yO - 0.24, w + 0.28, 0.045); }
    if (F.nacht > 0.3 && Z.fertig) { g.fillStyle = "rgba(255,196,120," + (0.6 * F.nacht).toFixed(3) + ")"; g.fillRect(x, yO, w, h); }
  }
  function hausTuer(g, F, Z, x, yO, w, h) {
    const sv = F.schatten(0.18) || [0, 0];
    g.fillStyle = "rgba(255,250,236,0.35)"; g.fillRect(x - 0.1, yO - 0.1, w + 0.2, h + 0.1);
    g.fillStyle = rgbS([88, 70, 52]); g.fillRect(x, yO, w, h);
    if (F.px > 14) {
      g.strokeStyle = "rgba(40,30,20,0.6)"; g.lineWidth = Math.max(0.012, 0.6 / F.px);
      g.beginPath(); g.moveTo(x + w / 2, yO); g.lineTo(x + w / 2, yO + h);
      for (const k of [0.1, 0.45, 0.55, 0.9]) { g.rect(x + w * 0.08, yO + h * k - 0.05, w * 0.34, 0.001); g.rect(x + w * 0.58, yO + h * k - 0.05, w * 0.34, 0.001); }
      g.stroke();
      g.strokeRect(x + w * 0.08, yO + h * 0.08, w * 0.34, h * 0.36); g.strokeRect(x + w * 0.58, yO + h * 0.08, w * 0.34, h * 0.36);
      g.strokeRect(x + w * 0.08, yO + h * 0.52, w * 0.34, h * 0.4); g.strokeRect(x + w * 0.58, yO + h * 0.52, w * 0.34, h * 0.4);
    }
    g.fillStyle = "rgba(30,26,34,0.45)";
    g.beginPath(); g.rect(x, yO, w, h); g.rect(x + w + sv[0], yO + sv[1], -w, h); g.fill("evenodd");
  }

  /* =====================================================================
     SÄULE — als Figur: ein senkrechter Zylinder sieht aus jeder Richtung
     gleich aus; quer schattiert, Kanneluren drehen sich mit, Plinthe und
     Abakus als kleine 3D-Kästen
     ===================================================================== */
  function saeule(o) {
    /* o: r0, r1, H (bis Oberkante Abakus), hBau, Z, flut (Strahler), P0 (Weltfuß), zFuss */
    return function (g, s, F) {
      const gier = (F.gier || 0) * RAD, c = Math.cos(gier), sn = Math.sin(gier);
      const Y = (z) => -z * KZ * s;
      const H = Math.min(o.H, o.hBau);
      const hp = 0.1 * o.r0 / 0.35, ht = 0.08 * o.r0 / 0.35, hc = 0.32 * o.r0 / 0.35, ha = 0.12 * o.r0 / 0.35;
      const fertig = o.hBau >= o.H - 1e-3;
      const zS0 = hp + ht, zS1 = fertig ? o.H - hc : H;
      const rAt = (z) => o.r0 + (o.r1 - o.r0) * klemm((z - zS0) / (o.H - hc - zS0), 0, 1) - 0.012 * Math.sin(Math.PI * klemm((z - zS0) / (o.H - zS0), 0, 1));
      /* Kasten (Plinthe, Abakus) in 3D */
      const P = (p) => { const x = p[0] * c - p[1] * sn, y = p[0] * sn + p[1] * c; return [(x - y) * KX * s, (x + y) * KY * s - p[2] * KZ * s]; };
      const kasten = (a, z0, z1, farbe, schneeOben) => {
        const ecken = [[-a, -a], [a, -a], [a, a], [-a, a]];
        const e = [KZ * Math.SQRT1_2 * (c + sn), KZ * Math.SQRT1_2 * (c - sn), 0.5];
        const seiten = [[[0, -1], 0, 1], [[1, 0], 1, 2], [[0, 1], 2, 3], [[-1, 0], 3, 0]];
        for (const [n, i, j] of seiten) {
          if (n[0] * e[0] + n[1] * e[1] <= 0) continue;
          const lf = licht([n[0], n[1], 0], P, [0, 0, (z0 + z1) / 2]);
          g.fillStyle = rgbS([farbe[0] * lf[0], farbe[1] * lf[1], farbe[2] * lf[2]]);
          const q = [P([ecken[i][0], ecken[i][1], z0]), P([ecken[j][0], ecken[j][1], z0]), P([ecken[j][0], ecken[j][1], z1]), P([ecken[i][0], ecken[i][1], z1])];
          g.beginPath(); g.moveTo(q[0][0], q[0][1]); for (const p of q) g.lineTo(p[0], p[1]); g.closePath(); g.fill();
        }
        const lf = licht([0, 0, 1], P, [0, 0, z1]);
        const col = schneeOben ? SCHNEE : farbe;
        g.fillStyle = rgbS([col[0] * lf[0], col[1] * lf[1], col[2] * lf[2]]);
        const q = ecken.map(([x, y]) => P([x, y, z1]));
        g.beginPath(); g.moveTo(q[0][0], q[0][1]); for (const p of q) g.lineTo(p[0], p[1]); g.closePath(); g.fill();
      };
      /* Licht (Kameraraum-Normale aus Modellnormale) + Flutlicht */
      const licht = (nM, _P, pz) => {
        const nk = [nM[0] * c - nM[1] * sn, nM[0] * sn + nM[1] * c, nM[2]];
        const f = ST.lichtFaktor(nk, F.Z, 0, F.jahr);
        if (o.flut && F.nacht > 0) {
          const k = (F.nacht > 0.9 ? 1 : 0.5 * F.nacht) * 0.62;
          const a = k * flutWert(o.flut, [o.P0[0] + (pz ? pz[0] : 0), o.P0[1] + (pz ? pz[1] : 0), o.zFuss + (pz ? pz[2] : 1)], nM);
          f[0] += a * WARM[0]; f[1] += a * WARM[1]; f[2] += a * WARM[2];
        }
        return f;
      };
      if (F.schatten) {
        g.fillStyle = "#000";
        g.fillRect(-o.r0 * s * 1.2, Y(H), o.r0 * s * 2.4, -Y(H));
        return;
      }
      const winter = o.Z.schnee > 0;
      /* Plinthe und Wulst (attische Basis) */
      kasten(o.r0 * 1.32, 0, hp, STEIN, winter);
      if (o.hBau > hp) {
        const rt = o.r0 * 1.16;
        const gr = g.createLinearGradient(-rt * s, 0, rt * s, 0);
        for (const t of [-1, -0.6, -0.2, 0.2, 0.6, 1]) { const ph = 45 * RAD - Math.asin(t); const n = [Math.cos(ph), Math.sin(ph), 0]; const nm = [n[0] * c + n[1] * sn, -n[0] * sn + n[1] * c, 0]; const lf = licht(nm, null, [0, 0, hp]); gr.addColorStop((t + 1) / 2, rgbS([STEIN[0] * lf[0], STEIN[1] * lf[1], STEIN[2] * lf[2]])); }
        g.fillStyle = gr;
        g.beginPath(); g.ellipse(0, Y(hp + ht / 2), rt * s, rt * s * 0.5 + ht * KZ * s / 2, 0, 0, TAU); g.fill();
      }
      if (zS1 > zS0) {
        /* Schaft */
        const z0 = zS0, z1 = zS1, ra = rAt(z0), rb = rAt(z1);
        const gr = g.createLinearGradient(-ra * s, 0, ra * s, 0);
        const zm = (z0 + z1) / 2;
        for (const t of [-1, -0.85, -0.6, -0.3, 0, 0.3, 0.6, 0.85, 1]) {
          const ph = 45 * RAD - Math.asin(t);
          const nm = [Math.cos(ph) * c + Math.sin(ph) * sn, -Math.cos(ph) * sn + Math.sin(ph) * c, 0];
          const lf = licht(nm, null, [0, 0, Math.min(zm, 2.2)]);
          gr.addColorStop((t + 1) / 2, rgbS([STEIN[0] * lf[0], STEIN[1] * lf[1], STEIN[2] * lf[2]]));
        }
        g.beginPath();
        g.moveTo(-ra * s, Y(z0));
        const nSt = 8;
        for (let i = 1; i <= nSt; i++) { const z = z0 + (z1 - z0) * i / nSt; g.lineTo(-rAt(z) * s, Y(z)); }
        g.ellipse(0, Y(z1), rb * s, rb * s * 0.5, 0, Math.PI, TAU);
        for (let i = nSt - 1; i >= 0; i--) { const z = z0 + (z1 - z0) * i / nSt; g.lineTo(rAt(z) * s, Y(z)); }
        g.ellipse(0, Y(z0), ra * s, ra * s * 0.5, 0, 0, Math.PI);
        g.closePath();
        g.fillStyle = gr; g.fill();
        g.save(); g.clip();
        /* Kanneluren: 20 Stege, mit der Drehung wandernd */
        if (ra * s > 6) {
          const al = Math.min(1, (ra * s - 6) / 10);
          for (let k = 0; k < 20; k++) {
            const th = (k * 18 + 9) * RAD + gier, ps = th - 45 * RAD;
            if (Math.cos(ps) < 0.08) continue;
            const t = -Math.sin(ps), vis = Math.cos(ps);
            g.lineWidth = Math.max(0.6, 0.012 * s * vis);
            g.strokeStyle = "rgba(255,250,236," + (0.35 * al * vis).toFixed(3) + ")";
            g.beginPath(); g.moveTo(t * ra * s, Y(z0) + ra * s * 0.5 * vis); g.lineTo(t * rb * s, Y(z1) + rb * s * 0.5 * vis); g.stroke();
            const t2 = -Math.sin(ps + 9 * RAD);
            g.lineWidth = Math.max(0.6, 0.03 * s * vis);
            g.strokeStyle = "rgba(60,52,40," + (0.2 * al * vis).toFixed(3) + ")";
            g.beginPath(); g.moveTo(t2 * ra * s, Y(z0) + ra * s * 0.5 * vis); g.lineTo(t2 * rb * s, Y(z1) + rb * s * 0.5 * vis); g.stroke();
          }
        }
        /* Trommelfugen, im Bau die frische Oberkante */
        if (ra * s > 4) {
          g.strokeStyle = "rgba(90,80,64,0.35)"; g.lineWidth = Math.max(0.5, 0.01 * s);
          for (let z = z0 + 0.9; z < z1 - 0.1; z += 0.9) { g.beginPath(); g.ellipse(0, Y(z), rAt(z) * s, rAt(z) * s * 0.5, 0, 0, Math.PI); g.stroke(); }
        }
        /* Schmutz unten, Schatten unter dem Kapitell */
        const gg = g.createLinearGradient(0, Y(z1), 0, Y(z1 - 0.6));
        gg.addColorStop(0, "rgba(40,36,48,0.3)"); gg.addColorStop(1, "rgba(40,36,48,0)");
        if (fertig) { g.fillStyle = gg; g.fillRect(-ra * s * 1.2, Y(z1), ra * s * 2.4, 0.6 * KZ * s); }
        g.restore();
        if (!fertig) {
          /* frische Trommel-Oberseite */
          const lf = licht([0, 0, 1], null, [0, 0, z1]);
          g.fillStyle = rgbS([232 * lf[0], 224 * lf[1], 206 * lf[2]]);
          g.beginPath(); g.ellipse(0, Y(z1), rb * s, rb * s * 0.5, 0, 0, TAU); g.fill();
        }
      }
      if (fertig) {
        /* Kapitell: Halsringe, Echinus, Abakus */
        const zN = o.H - hc, zE = o.H - ha, rE = o.r1 * 1.36;
        const gr = g.createLinearGradient(-rE * s, 0, rE * s, 0);
        for (const t of [-1, -0.5, 0, 0.5, 1]) {
          const ph = 45 * RAD - Math.asin(t);
          const nm0 = [Math.cos(ph) * c + Math.sin(ph) * sn, -Math.cos(ph) * sn + Math.sin(ph) * c, 0.55];
          const lf = licht(nrm(nm0), null, [0, 0, zE]);
          gr.addColorStop((t + 1) / 2, rgbS([STEIN[0] * lf[0], STEIN[1] * lf[1], STEIN[2] * lf[2]]));
        }
        g.fillStyle = gr;
        g.beginPath();
        g.moveTo(-o.r1 * s, Y(zN));
        g.quadraticCurveTo(-rE * s * 0.98, Y(zN + (zE - zN) * 0.35), -rE * s, Y(zE));
        g.ellipse(0, Y(zE), rE * s, rE * s * 0.5, 0, Math.PI, TAU);
        g.quadraticCurveTo(rE * s * 0.98, Y(zN + (zE - zN) * 0.35), o.r1 * s, Y(zN));
        g.ellipse(0, Y(zN), o.r1 * s, o.r1 * s * 0.5, 0, 0, Math.PI);
        g.closePath(); g.fill();
        if (o.r1 * s > 5) {
          g.strokeStyle = "rgba(80,70,56,0.4)"; g.lineWidth = Math.max(0.5, 0.012 * s);
          for (const dz of [0, 0.04, 0.08]) { g.beginPath(); g.ellipse(0, Y(zN + dz), o.r1 * s, o.r1 * s * 0.5, 0, 0, Math.PI); g.stroke(); }
        }
        kasten(rE * 1.02, zE, o.H, STEIN, winter);
      }
    };
  }

  /* =====================================================================
     QUADRIGA — Kupfer, Patina; mit ST.gestalt als echtes 3D-Modell
     ===================================================================== */
  function quadrigaFigur(Z, flut) {
    return function (g, s, F) {
      if (F.schatten) return;
      const GS = ST.gestalt; if (!GS) return;
      const gier = (F.gier || 0) * RAD, c = Math.cos(gier), sn = Math.sin(gier);
      /* Maßstab der Quadriga: etwas über 1:2,5, damit sie wie am Vorbild den
         Bau krönt (dort ~5 m hoch) */
      const Bh = new GS.Buehne({ s: s * 1.2, X0: 0, Y0: 0, Z: F.Z, jahr: F.jahr });
      Bh.rahmen(GS.modellRahmen(c, sn));
      if (flut && F.nacht > 0) {
        const k = F.nacht > 0.9 ? 1 : 0.5 * F.nacht;
        /* Strahler auf Dächern am Platz: von vorn unten und von hinten unten */
        Bh.lampen = [
          { p: Bh.pk([0, 6, -3]), r: 11, farbe: [1, 0.78, 0.5], k: 0.9 * k },
          { p: Bh.pk([0, -6, -3]), r: 11, farbe: [1, 0.78, 0.5], k: 0.7 * k },
          { p: Bh.pk([4, 1, -2]), r: 8, farbe: [1, 0.78, 0.5], k: 0.4 * k }
        ];
      }
      const fein = s > 26;
      const dunkel = [54, 102, 88], hellK = [118, 176, 150];
      const schnee = Z.schnee > 0;
      const opt = (x) => Object.assign({ matt: 0.25, glanz: fein ? 0.12 : 0 }, x || {});
      /* ---------- Pferde ---------- */
      const PF = [[-0.6, 0.12, 0.16], [-0.2, 0.2, 0.04], [0.2, 0.2, -0.04], [0.6, 0.12, -0.16]];
      PF.forEach(([px, py, dreh], idx) => {
        if (Z.quadriga < (idx + 1) * 0.16) return;
        const cg = Math.cos(dreh), sg = Math.sin(dreh);
        const T = (p) => [px + p[0] * cg - p[1] * sg, py + p[0] * sg + p[1] * cg, p[2]];
        const V = (v) => [v[0] * cg - v[1] * sg, v[0] * sg + v[1] * cg, v[2]];
        const tiefe = dot(Bh.pk(T([0, 0, 0.5])), ST.ZUM_AUGE);
        Bh.gruppe(tiefe);
        const links = idx % 2 === 0;
        /* Beine: ein Vorderbein im Schritt erhoben */
        const bein = (a, b, cc, r1, r2) => { Bh.glied(T(a), r1, T(b), r2, KUPFER, opt()); Bh.glied(T(b), r2, T(cc), r2 * 0.8, mischF(KUPFER, dunkel, 0.3), opt()); Bh.ei(T(add(cc, [0, 0.012, -0.012])), V([0.034, 0, 0]), V([0, 0.042, 0]), [0, 0, 0.022], dunkel, opt()); };
        for (const sx of [-1, 1]) {
          const hoch = (sx < 0) === links;
          if (hoch) bein([sx * 0.075, 0.34, 0.5], [sx * 0.075, 0.52, 0.4], [sx * 0.075, 0.44, 0.24], 0.05, 0.034);
          else bein([sx * 0.075, 0.34, 0.5], [sx * 0.075, 0.37, 0.24], [sx * 0.075, 0.38, 0.02], 0.05, 0.032);
          bein([sx * 0.075, -0.3, 0.52], [sx * 0.075, -0.36, 0.25], [sx * 0.075, -0.31, 0.02], 0.065, 0.033);
        }
        /* Rumpf: Brust, Mitte, Kruppe als eine Hülle */
        const fl = [];
        if (fein) fl.push({ c: T([0, 0.02, 0.73]), a: [V([0.1, 0, 0]), V([0, 0.34, 0]), [0, 0, 0.03]], alb: hellK, n: [0, 0, 1], k: 0.6 });
        if (fein) fl.push({ c: T([0, 0.0, 0.47]), a: [V([0.12, 0, 0]), V([0, 0.3, 0]), [0, 0, 0.04]], alb: dunkel, n: [0, 0, -1], k: 0.7 });
        if (schnee && fein) fl.push({ c: T([0, -0.05, 0.765]), a: [V([0.08, 0, 0]), V([0, 0.3, 0]), [0, 0, 0.02]], alb: SCHNEE, n: [0, 0, 1], k: 0.95 * Z.schnee });
        Bh.koerper([
          { c: T([0, 0.28, 0.62]), a: [V([0.13, 0, 0]), V([0, 0.15, 0]), [0, 0, 0.16]] },
          { c: T([0, 0.02, 0.6]), a: [V([0.14, 0, 0]), V([0, 0.26, 0]), [0, 0, 0.15]] },
          { c: T([0, -0.24, 0.62]), a: [V([0.145, 0, 0]), V([0, 0.16, 0]), [0, 0, 0.155]] }
        ], KUPFER, opt({ flecken: fl.length ? fl : null }));
        /* Hals, hoch aufgerichtet, und Kopf, leicht zur Seite */
        const kopfDreh = (idx < 2 ? 1 : -1) * 0.12;
        const N0 = [0, 0.38, 0.7], N1 = [kopfDreh * 0.3, 0.52, 0.98];
        Bh.glied(T(N0), 0.1, T(N1), 0.065, KUPFER, opt());
        const hd = nrm(V([kopfDreh, 0.55, -0.55]));
        Bh.ei(T([kopfDreh * 0.4, 0.6, 0.98]), mul(hd, 0.13), V([0.048, 0, 0]), mul(nrm(kreuz(hd, V([1, 0, 0]))), 0.058), KUPFER, opt());
        Bh.band([T([0, 0.36, 0.8]), T([kopfDreh * 0.25, 0.47, 1.02]), T([kopfDreh * 0.35, 0.53, 1.07])], 0.035, dunkel, opt());   // Mähne
        if (fein) for (const ex of [-0.025, 0.025]) Bh.glied(T([kopfDreh * 0.35 + ex, 0.55, 1.05]), 0.012, T([kopfDreh * 0.35 + ex * 1.4, 0.54, 1.12]), 0.006, KUPFER, opt());
        /* Schweif */
        Bh.glied(T([0, -0.4, 0.66]), 0.04, T([0, -0.49, 0.42]), 0.022, dunkel, opt());
      });
      /* ---------- Wagen ---------- */
      if (Z.quadriga >= 0.72) {
        Bh.gruppe(dot(Bh.pk([0, -0.6, 0.4]), ST.ZUM_AUGE));
        for (const sx of [-1, 1]) {
          const rad = [];
          for (let i = 0; i < 18; i++) { const w = i / 18 * TAU; rad.push([sx * 0.27, -0.6 + Math.cos(w) * 0.25, 0.26 + Math.sin(w) * 0.25]); }
          Bh.platte(rad, dunkel, { n: [sx, 0, 0], beidseitig: true });
          Bh.kugel([sx * 0.29, -0.6, 0.26], 0.04, KUPFER, opt());
        }
        Bh.koerper([{ c: [0, -0.52, 0.44], a: [[0.24, 0, 0], [0, 0.14, 0], [0, 0, 0.17]] }, { c: [0, -0.64, 0.4], a: [[0.22, 0, 0], [0, 0.1, 0], [0, 0, 0.12]] }], KUPFER, opt());
        Bh.band([[0, -0.4, 0.42], [0, 0.0, 0.5], [0, 0.42, 0.62]], 0.04, dunkel, opt());   // Deichsel
      }
      /* ---------- Victoria ---------- */
      if (Z.quadriga >= 0.86) {
        const VY = -0.6;
        Bh.gruppe(dot(Bh.pk([0, VY, 0.9]), ST.ZUM_AUGE) + 0.05);
        /* Flügel: weit nach hinten oben, gefiedert */
        for (const sx of [-1, 1]) {
          const w = [[sx * 0.06, VY - 0.08, 1.02], [sx * 0.22, VY - 0.2, 1.08], [sx * 0.36, VY - 0.3, 1.32], [sx * 0.4, VY - 0.34, 1.55], [sx * 0.3, VY - 0.3, 1.45], [sx * 0.2, VY - 0.24, 1.28], [sx * 0.12, VY - 0.18, 1.16], [sx * 0.05, VY - 0.1, 1.1]];
          Bh.platte(w, mischF(KUPFER, hellK, 0.15), { beidseitig: true, innen: dunkel, tiefe: -0.05 });
        }
        /* Gewand in Falten, Oberkörper, Kopf mit Kranz */
        Bh.koerper([{ c: [0, VY, 0.55], a: [[0.13, 0, 0], [0, 0.11, 0], [0, 0, 0.2]] }, { c: [0, VY, 0.78], a: [[0.11, 0, 0], [0, 0.09, 0], [0, 0, 0.16]] }], KUPFER, opt({ flecken: fein ? [{ c: [0.04, VY + 0.08, 0.6], a: [[0.02, 0, 0], [0, 0.02, 0], [0, 0, 0.18]], alb: dunkel, n: [0, 1, 0], k: 0.6 }, { c: [-0.05, VY + 0.08, 0.58], a: [[0.02, 0, 0], [0, 0.02, 0], [0, 0, 0.16]], alb: dunkel, n: [0, 1, 0], k: 0.6 }] : null }));
        Bh.koerper([{ c: [0, VY, 0.98], a: [[0.1, 0, 0], [0, 0.07, 0], [0, 0, 0.1]] }], KUPFER, opt());
        Bh.glied([0, VY, 1.06], 0.035, [0, VY + 0.01, 1.12], 0.03, KUPFER, opt());
        Bh.kugel([0, VY + 0.01, 1.17], 0.055, KUPFER, opt({ flecken: schnee && fein ? [{ c: [0, VY, 1.215], a: [[0.04, 0, 0], [0, 0.04, 0], [0, 0, 0.01]], alb: SCHNEE, n: [0, 0, 1], k: 0.9 }] : null }));
        /* linker Arm mit den Zügeln */
        Bh.glied([-0.1, VY, 1.04], 0.03, [-0.14, VY + 0.12, 0.88], 0.024, KUPFER, opt());
        for (const px of [-0.6, -0.2, 0.2, 0.6]) Bh.band([[-0.14, VY + 0.14, 0.88], [px * 0.5, 0.1, 0.8], [px, 0.45, 0.95]], 0.008, dunkel, { schatten: false });
        /* rechter Arm erhoben mit dem Siegeszeichen */
        const hand = [0.2, VY + 0.12, 1.3];
        Bh.glied([0.1, VY, 1.05], 0.03, hand, 0.024, KUPFER, opt());
        Bh.band([[0.2, VY + 0.12, 0.55], [0.2, VY + 0.12, 1.95]], 0.022, dunkel, opt());
        /* Eichenkranz mit dem Eisernen Kreuz */
        const kr = [];
        for (let i = 0; i <= 20; i++) { const w = i / 20 * TAU; kr.push([0.2 + Math.cos(w) * 0.13, VY + 0.12, 1.7 + Math.sin(w) * 0.13]); }
        Bh.band(kr, 0.04, KUPFER, opt());
        if (fein) {
          const kz = (x, z) => [0.2 + x, VY + 0.13, 1.7 + z];
          const a = 0.09, b = 0.025;
          Bh.platte([kz(-b, a), kz(b, a), kz(b * 0.6, b), kz(a, b), kz(a, -b), kz(b * 0.6, -b * 0.6), kz(b, -a), kz(-b, -a), kz(-b * 0.6, -b * 0.6), kz(-a, -b), kz(-a, b), kz(-b * 0.6, b)], [40, 60, 54], { beidseitig: true });
        }
        /* Preußischer Adler auf der Spitze */
        Bh.ei([0.2, VY + 0.12, 2.0], [0.03, 0, 0], [0, 0.04, 0], [0, 0, 0.06], KUPFER, opt());
        for (const sx of [-1, 1]) Bh.platte([[0.2 + sx * 0.02, VY + 0.12, 2.02], [0.2 + sx * 0.16, VY + 0.12, 2.12], [0.2 + sx * 0.14, VY + 0.12, 1.98], [0.2 + sx * 0.03, VY + 0.12, 1.96]], KUPFER, { beidseitig: true });
      }
      Bh.malen(g);
    };
  }

  /* =====================================================================
     BAUZUSTAND
     ===================================================================== */
  function zustand(bau, jahr) {
    const f = (a, b) => klemm((bau - a) / (b - a), 0, 1);
    const Z = { bau: bau, fertig: bau >= 0.999, winter: jahr === "winter" };
    Z.grube = bau < 0.16;
    Z.tiefe = 1.1 * glatt(f(0, 0.05));
    Z.pfaehle = f(0.05, 0.1); Z.fund = f(0.1, 0.16);
    Z.plinthe = f(0.16, 0.22);
    Z.wand = f(0.22, 0.52);
    Z.gebaelk = f(0.5, 0.62);
    Z.attika = f(0.6, 0.74);
    Z.stufen = f(0.72, 0.82);
    Z.quadriga = f(0.82, 0.95);
    Z.schnee = Z.winter ? (Z.fertig ? 1 : f(0.95, 0.995)) : 0;
    return Z;
  }

  /* =====================================================================
     MODELL
     ===================================================================== */
  ST.modell("brandenburger", {
    name: "Brandenburger Tor", gruppe: "Wahrzeichen", grund: GRUND, hoehe: 11.8, bauzeit: 40 * 60,
    bauen(M, o) {
      const B = blickVon(o), W = new Werk(M, B);
      const bau = o.bau == null ? 1 : o.bau;
      const Z = zustand(bau, o.jahr);

      /* Strahler: vor jeder Säule (Platz- und Tiergartenseite), vor den
         Torhäusern, in den Durchfahrten */
      const STR = [];
      for (const x of SX) { STR.push([x, SY + 1.5, 0.2]); STR.push([x, -SY - 1.5, 0.2]); }
      for (const sx of [-1, 1]) { STR.push([sx * 11.2, HY + 1.3, 0.2]); STR.push([sx * 11.2, -HY - 1.3, 0.2]); STR.push([sx * 14.3, 0, 0.2]); STR.push([sx * 8.0, 1.8, 0.2]); STR.push([sx * 8.0, -1.8, 0.2]); }
      const DURCH = [0, -2.59, 2.59, -4.81, 4.81];
      for (const x of DURCH) STR.push([x, 0, 0.3]);
      const flut = Z.fertig ? STR : null;

      /* ---------- Baugrube, Pfähle, Fundament ---------- */
      if (Z.grube) {
        grubeBauen(W, M, B, Z, [-13.2, -4.1, 13.2, 4.1]);
        if (Z.fund < 1) pfaehleBauen(W, M, Z);
        if (Z.fund > 0) {
          const z1 = -Z.tiefe * (1 - glatt(Z.fund));
          W.teil("fundament", { fest: -20, schatten: false });
          const fl = [[-6.8, -2.45, 6.8, 2.45], [-13.1, -4.05, -9.3, 4.05], [9.3, -4.05, 13.1, 4.05], [-9.4, -0.85, -6.7, 0.85], [6.7, -0.85, 9.4, 0.85]];
          for (const [x0, y0, x1, y1] of fl) kastenRoh(W, x0, y0, -Z.tiefe, x1, y1, z1, (g, F) => { stein(g, F, z1, { farbe: [176, 166, 146], lage: 0.4, lang: 0.8, fahnen: false }); }, { oben: true });
        }
      }
      if (Z.grube) { W.ordnen(); beschleunigen(M); return; }

      /* Kasten mit Malern je Seite */
      const kasten = (name, x0, y0, z0, x1, y1, z1, mal, opt) => {
        opt = opt || {};
        W.teil(name, opt.teil);
        const innen = [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2];
        const S = {
          sued: [[x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0]], nord: [[x1, y0, z1], [x0, y0, z1], [x0, y0, z0], [x1, y0, z0]],
          ost: [[x1, y1, z1], [x1, y0, z1], [x1, y0, z0], [x1, y1, z0]], west: [[x0, y0, z1], [x0, y1, z1], [x0, y1, z0], [x0, y0, z0]],
          oben: [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]]
        };
        /* Deckfläche, die zum größten Teil unter dem nächsten Bauteil liegt:
           nur der sichtbare Rand als vier Streifen (spart viel Malzeit) */
        if (opt.loch) {
          const [a0, b0, a1, b1] = opt.loch;
          S.oben = [[x0, b1, z1], [x1, b1, z1], [x1, y1, z1], [x0, y1, z1]];
          S.oben2 = [[x0, y0, z1], [x1, y0, z1], [x1, b0, z1], [x0, b0, z1]];
          S.oben3 = [[x0, b0, z1], [a0, b0, z1], [a0, b1, z1], [x0, b1, z1]];
          S.oben4 = [[a1, b0, z1], [x1, b0, z1], [x1, b1, z1], [a1, b1, z1]];
        }
        const N = { sued: [0, 1, 0], nord: [0, -1, 0], ost: [1, 0, 0], west: [-1, 0, 0], oben: [0, 0, 1] };
        void N;
        for (const k0 of Object.keys(S)) {
          const k = k0.indexOf("oben") === 0 ? "oben" : k0;
          if (opt.ohne && opt.ohne.indexOf(k) >= 0) continue;
          const m = mal(k); if (!m) continue;
          const oben = k === "oben";
          W.poly(S[k0], innen, (g, F) => {
            m(g, F, z1, k);
            if (opt.werfer && !oben) schlagschatten(g, F, B, N[k], opt.werfer);
            belichten(g, F, B, N[k], null, { ao: z0 < 0.3 && !oben, traufe: oben ? 0 : (opt.traufe || 0), flut: flut, flutK: oben ? 0.3 : 1 });
          }, { name: name + "-" + k0 });
        }
        return W.akt;
      };
      const glattStein = (opt) => (k) => k === "oben" ? steinOben(Z) : (g, F, zTop) => stein(g, F, zTop, opt);

      /* ---------- Plinthen und Sockel ---------- */
      const zP = Z_ST * Z.plinthe;
      if (zP > 0.02) {
        for (let i = 0; i < 6; i++) {
          const x = SX[i], ende = i === 0 || i === 5;
          const x0 = ende ? (x < 0 ? -XE1 - 0.13 : x - 0.47) : x - 0.47, x1 = ende ? (x < 0 ? x + 0.47 : XE1 + 0.13) : x + 0.47;
          const [wx0, wx1] = i === 0 ? [-XE1, -XE0] : i === 5 ? [XE0, XE1] : [x - WB, x + WB];
          kasten("plinthe" + i, x0, -SY - 0.47, 0, x1, SY + 0.47, zP, glattStein({ lage: 0.22, lang: 0.94, fahnen: false }), { loch: Z.wand > 0.05 ? [wx0 + 0.05, -WT + 0.05, wx1 - 0.05, WT - 0.05] : null });
        }
        for (const sx of [-1, 1]) {
          const [x0, x1] = sx > 0 ? [HX0, HX1] : [-HX1, -HX0];
          kasten("hsockel" + sx, x0, -HY, 0, x1, HY, Math.min(Z_H0, zP), glattStein({ lage: 0.2, lang: 0.9, fahnen: false }), { loch: Z.wand > 0 ? [x0 + 0.3, -HYK + 0.1, x1 - 0.3, HYK - 0.1] : null });
        }
      }

      /* ---------- Querwände und Säulen ---------- */
      const zW = Z_ST + (Z_SAE - Z_ST) * Z.wand;
      const werferWand = [];
      const entKoerper = [];
      if (Z.gebaelk > 0) {
        const z1 = Z_SAE + (Z_FR - Z_SAE) * Z.gebaelk;
        entKoerper.push([[-6.65, -2.25, z1], [6.65, -2.25, z1], [6.65, 2.25, z1], [-6.65, 2.25, z1], [-6.65, -2.25, Z_SAE], [6.65, -2.25, Z_SAE], [6.65, 2.25, Z_SAE], [-6.65, 2.25, Z_SAE]]);
      }
      const wandBox = (i) => { const x = SX[i]; return i === 0 ? [-XE1, -XE0] : i === 5 ? [XE0, XE1] : [x - WB, x + WB]; };
      for (let i = 0; i < 6; i++) { const [x0, x1] = wandBox(i); werferWand.push([[x0, -WT, zW], [x1, -WT, zW], [x0, WT, zW], [x1, WT, zW], [x0, -WT, Z_ST], [x1, WT, Z_ST]]); }
      if (Z.wand > 0) {
        for (let i = 0; i < 6; i++) {
          const [x0, x1] = wandBox(i);
          const werfer = entKoerper.concat(werferWand.filter((_, j) => j !== i));
          kasten("wand" + i, x0, -WT, Z_ST, x1, WT, zW, (k) => {
            if (k === "oben") return Z.gebaelk > 0 ? null : (g, F) => { steinOben(Z)(g, F); };
            return (g, F, zTop, seite) => {
              const aussen = (i === 0 && seite === "west") || (i === 5 && seite === "ost");
              stein(g, F, zTop, { lage: 0.46, lang: 1.2 });
              if (seite === "ost" || seite === "west") {
                /* Durchfahrt: Kämpfergesims, Sockelband und Relieftafel */
                const yK = zTop - 4.75;
                if (yK > 0) { g.fillStyle = "rgba(90,80,64,0.35)"; g.fillRect(-0.2, yK, F.w + 0.4, 0.05); g.fillStyle = "rgba(255,250,236,0.3)"; g.fillRect(-0.2, yK - 0.06, F.w + 0.4, 0.06); }
                g.fillStyle = "rgba(90,80,64,0.25)"; g.fillRect(-0.2, zTop - 0.75, F.w + 0.4, 0.04);
                if (aussen) {
                  /* Außenseite zur Verbindungsmauer: Lisenen */
                  for (const xx of [0.05, F.w - 0.35]) { g.fillStyle = "rgba(255,250,236,0.18)"; g.fillRect(xx, 0, 0.3, F.h); g.fillStyle = "rgba(80,70,56,0.2)"; g.fillRect(xx + 0.3, 0, 0.03, F.h); }
                } else if (zTop > 4.2) relief(g, F, F.w / 2 - 0.95, zTop - 4.1, 1.9, 1.35, 11 + i * 7 + (seite === "ost" ? 3 : 0), ["mensch", "mensch", "pferd"]);
                if (!aussen && F.nacht > 0.5 && Z.fertig) {
                  /* Durchfahrt nachts: Laternenlicht an den Wänden */
                  const gr = g.createRadialGradient(F.w / 2, zTop - 0.5, 0.2, F.w / 2, zTop - 1.5, 3.5);
                  gr.addColorStop(0, "rgba(255,190,120,0.18)"); gr.addColorStop(1, "rgba(255,190,120,0)");
                  g.fillStyle = gr; g.fillRect(-0.2, -0.2, F.w + 0.4, F.h + 0.4);
                }
              }
            };
          }, { werfer: werfer });
        }
        /* Säulen */
        const hBau = zW - Z_ST;
        for (const x of SX) for (const y of [-SY, SY]) {
          W.teil("saeule");
          const r = SR0 * 1.34, pts = [], pl = [];
          for (let k = 0; k < 8; k++) { const w = (k + 0.5) / 8 * TAU; pts.push([x + Math.cos(w) * r, y + Math.sin(w) * r, Z_ST], [x + Math.cos(w) * r, y + Math.sin(w) * r, zW]); const n = [Math.cos((k + 0.5) / 8 * TAU), Math.sin((k + 0.5) / 8 * TAU), 0]; pl.push([n, dot(n, [x, y, 0]) + r * Math.cos(TAU / 16)]); }
          pl.push([[0, 0, 1], zW], [[0, 0, -1], -Z_ST]);
          W.huelle(pts, pl);
          M.figur({ x: x, y: y, z: Z_ST, breite: 1.2, hoehe: Z_SAE - Z_ST + 0.2, schatten: true, malen: saeule({ r0: SR0, r1: SR1, H: Z_SAE - Z_ST, hBau: hBau, Z: Z, flut: flut, P0: [x, y], zFuss: Z_ST }) });
        }
      }

      /* ---------- Gebälk, Kranzgesims ---------- */
      if (Z.gebaelk > 0) {
        const z1 = Z_SAE + (Z_FR - Z_SAE) * Z.gebaelk;
        kasten("gebaelk", -6.65, -2.25, Z_SAE, 6.65, 2.25, z1, (k) => {
          if (k === "oben") return Z.gebaelk < 1 ? steinOben(Z) : null;
          return (g, F, zTop, seite) => {
            const f = F.flaeche;
            const achsen = (seite === "sued" || seite === "nord" ? TRIG_X.map((X) => dot(sub([X, f.o[1], 0], f.o), f.u)) : TRIG_Y.map((Yw) => dot(sub([f.o[0], Yw, 0], f.o), f.u))).sort((a, b) => a - b);
            if (Z.gebaelk >= 1) gebaelk(g, F, zTop, achsen, Z);
            else stein(g, F, zTop, { lage: 0.5, lang: 1.48 });
          };
        }, { traufe: 0.2 });
        if (Z.gebaelk >= 1) kasten("gesims", -6.82, -2.42, Z_FR, 6.82, 2.42, Z_GES, (k) => k === "oben" ? steinOben(Z) : (g, F, zTop) => gesims(g, F, zTop, Z), { loch: Z.attika > 0 ? [-6.3, -2.0, 6.3, 2.0] : null });
      }

      /* ---------- Attika mit Relief ---------- */
      if (Z.attika > 0) {
        const z1 = Z_GES + (Z_ATT - Z_GES) * Z.attika;
        kasten("attika", -6.4, -2.1, Z_GES, 6.4, 2.1, z1, (k) => {
          if (k === "oben") return Z.attika < 1 ? steinOben(Z) : null;
          return (g, F, zTop, seite) => {
            stein(g, F, zTop, { lage: 0.45, lang: 1.3 });
            if (Z.attika < 1) return;
            const lang = seite === "sued" || seite === "nord";
            /* Rahmenleisten, Relief in der Mitte, Tafeln an den Enden */
            const yP = zTop - 8.12, hP = 1.0;
            if (lang) {
              relief(g, F, F.w / 2 - 3.2, yP, 6.4, hP, seite === "sued" ? 41 : 43, ["mensch", "mensch", "mensch", "pferd", "wagen"]);
              for (const xx of [0.35, F.w - 2.35]) { g.strokeStyle = "rgba(90,80,64,0.45)"; g.lineWidth = Math.max(0.012, 0.7 / F.px); g.strokeRect(xx, yP + 0.08, 2.0, hP - 0.16); g.strokeStyle = "rgba(255,250,236,0.4)"; g.strokeRect(xx + 0.04, yP + 0.12, 2.0, hP - 0.16); }
            } else {
              relief(g, F, F.w / 2 - 1.5, yP, 3.0, hP, seite === "ost" ? 47 : 49, ["mensch", "mensch"]);
            }
          };
        }, { traufe: 0.12 });
        if (Z.attika >= 1) kasten("attikagesims", -6.5, -2.2, Z_ATT, 6.5, 2.2, Z_ATTG, (k) => k === "oben" ? steinOben(Z) : (g, F, zTop) => { stein(g, F, zTop, { glatt: true, fahnen: false, farbe: [222, 212, 192] }); g.fillStyle = "rgba(80,70,56,0.35)"; g.fillRect(-0.2, F.h * 0.6, F.w + 0.4, F.h * 0.4); if (Z.schnee > 0) schneeKante(g, F, Z.schnee, 0.06); }, { loch: Z.stufen > 0 ? [-3.0, -1.4, 3.0, 1.4] : null });
      }

      /* ---------- Stufen und Sockel der Quadriga ---------- */
      if (Z.stufen > 0) {
        const st = [[-3.1, -1.5, Z_ATTG, 3.1, 1.5, Z_ST1], [-2.15, -1.18, Z_ST1, 2.15, 1.18, Z_ST2], [-1.4, -1.0, Z_ST2, 1.4, 1.0, Z_SOCK]];
        st.forEach(([x0, y0, z0, x1, y1, z1], i) => {
          const zz = z0 + (z1 - z0) * klemm(Z.stufen * 3 - i, 0, 1);
          if (zz - z0 < 0.02) return;
          const naechste = st[i + 1], fertigI = Z.stufen * 3 - i >= 1 && Z.stufen * 3 - i - 1 > 0;
          const loch = naechste && fertigI ? [naechste[0] + 0.1, naechste[1] + 0.1, naechste[3] - 0.1, naechste[4] - 0.1] : (i === 2 && Z.quadriga > 0 ? null : null);
          kasten("stufe" + i, x0, y0, z0, x1, y1, zz, (k) => k === "oben" ? steinOben(Z) : (g, F, zTop) => {
            stein(g, F, zTop, { glatt: true, fahnen: false });
            g.fillStyle = "rgba(255,250,236,0.35)"; g.fillRect(-0.2, 0, F.w + 0.4, 0.04);
            g.fillStyle = "rgba(80,70,56,0.3)"; g.fillRect(-0.2, 0.05, F.w + 0.4, Math.max(0.01, 0.7 / F.px));
            if (Z.schnee > 0) schneeKante(g, F, Z.schnee, 0.05);
          }, { loch: loch });
        });
      }

      /* ---------- Quadriga ---------- */
      if (Z.quadriga > 0) {
        W.teil("quadriga");
        W.huelle([[-1.1, -1.1, Z_SOCK], [1.1, -1.1, Z_SOCK], [1.1, 1.1, Z_SOCK], [-1.1, 1.1, Z_SOCK], [-1.3, -1.3, Z_SOCK + 2.6], [1.3, 1.3, Z_SOCK + 2.6]], [[[0, 0, -1], -Z_SOCK]]);
        M.figur({ x: 0, y: 0, z: Z_SOCK, breite: 3.2, hoehe: 2.8, schatten: false, malen: quadrigaFigur(Z, flut) });
      }

      /* ---------- Verbindungsmauern und Torhäuser ---------- */
      const zV = Math.min(Z_V, Z.wand * Z_V * 1.6);
      for (const sx of [-1, 1]) {
        if (Z.wand <= 0) break;
        const [vx0, vx1] = sx > 0 ? [XE1, HX0] : [-HX0, -XE1];
        kasten("vmauer" + sx, vx0, -VY, 0, vx1, VY, zV, (k) => k === "oben" ? (zV < Z_V ? steinOben(Z) : null) : (g, F, zTop, seite) => {
          stein(g, F, zTop, { lage: 0.5, lang: 1.1, boden: true });
          if ((seite === "sued" || seite === "nord") && zTop >= Z_V) {
            /* vertiefte Tafel */
            const sv = F.schatten(0.06) || [0, 0];
            g.fillStyle = "rgba(60,52,40,0.28)"; g.beginPath(); g.rect(0.3, 0.55, F.w - 0.6, 1.5); g.rect(0.3 + sv[0] + F.w - 0.6, 0.55 + sv[1], -(F.w - 0.6), 1.5); g.fill("evenodd");
            g.strokeStyle = "rgba(90,80,64,0.35)"; g.lineWidth = Math.max(0.01, 0.6 / F.px); g.strokeRect(0.3, 0.55, F.w - 0.6, 1.5);
          }
        });
        if (zV >= Z_V) kasten("vkopf" + sx, vx0, -VY - 0.1, Z_V, vx1, VY + 0.1, Z_VK, (k) => k === "oben" ? steinOben(Z) : (g, F, zTop) => { stein(g, F, zTop, { glatt: true, fahnen: false, farbe: [222, 212, 192] }); if (Z.schnee > 0) schneeKante(g, F, Z.schnee, 0.06); });

        /* Torhaus */
        const [hx0, hx1] = sx > 0 ? [HX0, HX1] : [-HX1, -HX0];
        const zH = Z_H0 + (Z_HS - Z_H0) * klemm(Z.wand * 1.25, 0, 1);
        const kx0 = hx0 + 0.2, kx1 = hx1 - 0.2;
        kasten("torhaus" + sx, kx0, -HYK, Z_H0, kx1, HYK, zH, (k) => {
          if (k === "oben") return zH < Z_HS ? steinOben(Z) : null;
          return (g, F, zTop, seite) => {
            stein(g, F, zTop, { lage: 0.42, lang: 1.05 });
            if (zTop < Z_HS) return;
            const lang = seite === "ost" || seite === "west";
            if (lang) for (const t of [0.2, 0.5, 0.8]) hausFenster(g, F, Z, F.w * t - 0.32, zTop - 2.75, 0.64, 1.45);
            else hausTuer(g, F, Z, F.w / 2 - 0.55, zTop - 2.45, 1.1, 2.45);
            g.fillStyle = "rgba(90,80,64,0.3)"; g.fillRect(-0.2, zTop - Z_H0 - 0.5, F.w + 0.4, 0.04);
          };
        });
        /* Säulen der beiden Vorhallen */
        if (zH > Z_H0 + 0.05) for (const hy of [-HSY, HSY]) for (const hxr of HSX) {
          const x = sx * hxr;
          W.teil("hsaeule");
          const r = HR0 * 1.34, pts = [], pl = [];
          for (let q = 0; q < 8; q++) { const w = (q + 0.5) / 8 * TAU; pts.push([x + Math.cos(w) * r, hy + Math.sin(w) * r, Z_H0], [x + Math.cos(w) * r, hy + Math.sin(w) * r, zH]); const n = [Math.cos(w), Math.sin(w), 0]; pl.push([n, dot(n, [x, hy, 0]) + r * Math.cos(TAU / 16)]); }
          pl.push([[0, 0, 1], zH], [[0, 0, -1], -Z_H0]);
          W.huelle(pts, pl);
          M.figur({ x: x, y: hy, z: Z_H0, breite: 0.7, hoehe: Z_HS - Z_H0 + 0.1, schatten: true, malen: saeule({ r0: HR0, r1: HR1, H: Z_HS - Z_H0, hBau: zH - Z_H0, Z: Z, flut: flut, P0: [x, hy], zFuss: Z_H0 }) });
        }
        if (Z.gebaelk > 0) {
          const zg = Z_HS + (Z_HG - Z_HS) * Z.gebaelk;
          kasten("hgebaelk" + sx, hx0, -HY, Z_HS, hx1, HY, zg, (k) => {
            if (k === "oben") return steinOben(Z);
            return (g, F, zTop, seite) => {
              const f = F.flaeche;
              const ach = [];
              if (seite === "sued" || seite === "nord") { for (const hxr of HSX) ach.push(sx * hxr); for (let i = 0; i < 3; i++) ach.push(sx * (HSX[i] + HSX[i + 1]) / 2); ach.push(hx0 + 0.16, hx1 - 0.16); }
              else for (let yy = -HY + 0.16; yy <= HY - 0.15; yy += 0.49) ach.push(yy);
              const achsen = ach.map((v) => seite === "sued" || seite === "nord" ? dot(sub([v, f.o[1], 0], f.o), f.u) : dot(sub([f.o[0], v, 0], f.o), f.u)).sort((a, b) => a - b);
              /* Maße des kleinen Gebälks auf das große abbilden */
              g.save(); g.translate(0, 0);
              if (Z.gebaelk >= 1) hGebaelk(g, F, zTop, achsen, Z);
              else stein(g, F, zTop, { lage: 0.35, lang: 1.0 });
              g.restore();
            };
          }, { traufe: 0.1, loch: Z.attika > 0 ? [hx0 + 0.22, -HY + 0.22, hx1 - 0.22, HY - 0.22] : null });
          if (Z.attika > 0) {
            const za = Z_HG + (Z_HA - Z_HG) * Z.attika;
            kasten("hattika" + sx, hx0 + 0.12, -HY + 0.12, Z_HG, hx1 - 0.12, HY - 0.12, za, (k) => k === "oben" ? steinOben(Z) : (g, F, zTop) => { stein(g, F, zTop, { glatt: true, fahnen: false, farbe: [220, 210, 190] }); if (Z.schnee > 0) schneeKante(g, F, Z.schnee, 0.06); });
          }
        }
      }

      /* ---------- Nacht: Strahler, Lichtpfützen, Durchfahrten ---------- */
      if (Z.fertig) {
        for (const S of STR) {
          if (Math.abs(S[1]) < 0.5) { M.bodenlicht(S[0], 0, 1.6, "255,190,120", 0.4); M.licht(S[0], 0, 5.0, 1.2, "255,200,140", 0.35); continue; }
          M.bodenlicht(S[0], S[1], 1.3, "255,196,128", 0.28);
          M.licht(S[0], S[1], 0.3, 0.5, "255,214,160", 0.5);
        }
      }
      W.ordnen();
      beschleunigen(M);
    }
  });

  /* Kleines Gebälk der Torhäuser (Architrav 0,3 m, Fries 0,4 m) */
  function hGebaelk(g, F, zTop, achsen, Z) {
    stein(g, F, zTop, { lage: 0.35, lang: 1.0, fahnen: false });
    const w = F.w, yF = 0.0, yA = 0.4, sv = F.schatten(0.04) || [0, 0], tb = 0.2;
    g.fillStyle = "rgba(90,80,64,0.35)"; g.fillRect(-0.2, yA, w + 0.4, Math.max(0.012, 0.9 / F.px));
    g.fillStyle = "rgba(110,98,78,0.14)"; g.fillRect(-0.2, yF, w + 0.4, yA - yF);
    for (const x of achsen) {
      if (x < -0.3 || x > w + 0.3) continue;
      g.fillStyle = "rgba(60,52,40,0.3)"; g.fillRect(x - tb / 2 + sv[0], yF + sv[1], tb, yA - yF);
      g.fillStyle = rgbS([222, 212, 190]); g.fillRect(x - tb / 2, yF, tb, yA - yF);
      if (F.px * tb > 5) { g.fillStyle = "rgba(70,62,50,0.55)"; for (const k of [-1 / 6, 1 / 6]) g.fillRect(x + k * tb - 0.012, yF + 0.04, 0.024, yA - yF - 0.04); }
    }
    g.fillStyle = "rgba(255,250,236,0.3)"; g.fillRect(-0.2, yA + 0.02, w + 0.4, 0.03);
    if (Z.schnee > 0) schneeKante(g, F, Z.schnee, 0.05);
  }

  /* Roher Kasten (Fundament) mit Kernlicht */
  function kastenRoh(W, x0, y0, z0, x1, y1, z1, mal, opt) {
    const innen = [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2];
    const S = [[[x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0]], [[x1, y0, z1], [x0, y0, z1], [x0, y0, z0], [x1, y0, z0]], [[x1, y1, z1], [x1, y0, z1], [x1, y0, z0], [x1, y1, z0]], [[x0, y0, z1], [x0, y1, z1], [x0, y1, z0], [x0, y0, z0]]];
    if (opt && opt.oben) S.push([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]]);
    S.forEach((p, i) => W.poly(p, innen, mal, { name: "fu" + i, keinLicht: false }));
  }

  /* ---------- Baugrube ---------- */
  function grubeBauen(W, M, B, Z, Rg) {
    const T = Math.max(0.05, Z.tiefe), [x0, y0, x1, y1] = Rg, e = B.e;
    const loch = (g, F) => {
      const f = F.flaeche, n = nrm(kreuz(f.u, f.v)), en = dot(e, n);
      if (Math.abs(en) < 1e-4) return false;
      const q = [];
      for (const [x, y] of [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]) {
        const C = [x, y, 0], t = dot(sub(C, f.o), n) / en, P = sub(C, mul(e, t)), d = sub(P, f.o);
        q.push([dot(d, f.u), dot(d, f.v)]);
      }
      g.beginPath(); g.moveTo(q[0][0], q[0][1]); for (let i = 1; i < 4; i++) g.lineTo(q[i][0], q[i][1]); g.closePath(); g.clip();
      return true;
    };
    const erde = (g, F, saat) => {
      g.fillStyle = rgbS([196, 170, 124]); g.fillRect(-1, -1, F.w + 2, F.h + 2);       // märkischer Sand
      if (F.px > 6) rausch(g, -1, -1, F.w + 2, F.h + 2, 1.0, 0.35, saat, true);
      g.fillStyle = "rgba(70,52,36,0.6)"; g.fillRect(-1, -1, F.w + 2, 0.3);
      g.fillStyle = "rgba(60,48,40,0.45)"; g.fillRect(-1, 0.75, F.w + 2, 0.2);        // Torfschicht
      if (Z.winter) { g.fillStyle = "rgba(236,240,248,0.18)"; g.fillRect(-1, -1, F.w + 2, F.h + 2); }
    };
    W.teil("grube", { fest: -30, schatten: false });
    W.poly([[x0, y0, -T], [x1, y0, -T], [x1, y1, -T], [x0, y1, -T]], [0, 0, -T - 5], (g, F) => {
      g.save(); if (!loch(g, F)) { g.restore(); return; }
      g.fillStyle = rgbS([170, 146, 106]); g.fillRect(-1, -1, F.w + 2, F.h + 2);
      if (F.px > 6) rausch(g, -1, -1, F.w + 2, F.h + 2, 1.4, 0.3, 17, true);
      g.fillStyle = "rgba(80,92,100,0.35)"; g.beginPath(); g.ellipse(F.w * 0.7, F.h * 0.4, 2.4, 0.8, 0.2, 0, TAU); g.fill();
      if (Z.winter) { g.fillStyle = "rgba(236,240,248,0.2)"; g.fillRect(-1, -1, F.w + 2, F.h + 2); }
      g.restore();
    }, { name: "g-sohle", keinLicht: false });
    const wand = (a, b, n, name, saat) => W.poly([[a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], -T], [a[0], a[1], -T]], [a[0] + n[0] * 5, a[1] + n[1] * 5, -T / 2], (g, F) => {
      g.save(); if (!loch(g, F)) { g.restore(); return; } erde(g, F, saat); g.restore();
    }, { name: name, keinLicht: false });
    wand([x0, y0], [x1, y0], [0, -1], "g-n", 3);
    wand([x1, y1], [x0, y1], [0, 1], "g-s", 4);
    wand([x1, y0], [x1, y1], [1, 0], "g-o", 5);
    wand([x0, y1], [x0, y0], [-1, 0], "g-w", 6);
  }
  /* Gründungspfähle (Kiefer) unter Tor, Mauern und Torhäusern */
  function pfaehleBauen(W, M, Z) {
    const T = Z.tiefe, st = [], pf = [];
    for (let x = -12.8; x <= 12.81; x += 0.9) for (let y = -3.7; y <= 3.71; y += 0.9) {
      const ax = Math.abs(x);
      if ((ax < 6.8 && Math.abs(y) < 2.45) || (ax > 9.3 && Math.abs(y) < 4.0) || (ax >= 6.8 && ax <= 9.3 && Math.abs(y) < 0.9)) pf.push([x, y]);
    }
    const n = Math.round(pf.length * Z.pfaehle);
    for (let i = 0; i < n; i++) { const [x, y] = pf[i]; const hoch = i > n - 4 && Z.pfaehle < 1 ? 1.3 : 0.15; st.push([[x, y, -T], [x, y, -T + hoch], 0.13, [150, 118, 80]]); }
    if (!st.length) return;
    W.teil("pfaehle", { fest: -25, schatten: false });
    M.figur({ x: 0, y: 0, z: 0, breite: 32, hoehe: 2, schatten: false, malen: stabwerk(st) });
  }
  /* Stabwerk als Figur (Hölzer in 3D, projiziert) */
  function stabwerk(stabe) {
    return function (g, s, F) {
      if (F.schatten) return;
      const r = (F.gier || 0) * RAD, c = Math.cos(r), sn = Math.sin(r), a = KZ * Math.SQRT1_2;
      const e = [a * (c + sn), a * (c - sn), 0.5];
      const P = (p) => { const x = p[0] * c - p[1] * sn, y = p[0] * sn + p[1] * c; return [(x - y) * KX * s, (x + y) * KY * s - p[2] * KZ * s]; };
      const L = stabe.map((st) => ({ st: st, t: dot(mul(add(st[0], st[1]), 0.5), e) })).sort((x, y) => x.t - y.t);
      for (const { st } of L) {
        const p0 = P(st[0]), p1 = P(st[1]);
        const lf = ST.lichtFaktor([-0.5, 0.5, 0.7], F.Z, 0, F.jahr), col = st[3];
        g.strokeStyle = rgbS([col[0] * lf[0], col[1] * lf[1], col[2] * lf[2]]);
        g.lineWidth = Math.max(0.7, st[2] * s);
        g.beginPath(); g.moveTo(p0[0], p0[1]); g.lineTo(p1[0], p1[1]); g.stroke();
      }
    };
  }
})();
