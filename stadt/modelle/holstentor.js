/* =====================================================================
   HOLSTENTOR — Lübeck (Backsteingotik, 1464–1478)
   ---------------------------------------------------------------------
   XANDER: „ein Baukastensystem für ein Dorf, wo wir sämtliche
   Sehenswürdigkeiten aus Deutschland, die filigran und detailreich
   perfekt nach ihrem Vorbild nachgearbeitet wurden" · „richtig
   filigran. Richtig schön ausarbeiten mit schönen Texturen" · „keine
   Comic Grafik … viel mehr am Realismus" · „ohne Pixelkanten und
   komische Vektorrückstände" · „Man soll das Fundament sehen beim
   Aufbauen" · „Du bist dein schlimmster Kritiker" · Stil „von Anno oder
   geiler", „trotzdem mit SVG Grafiken".

   VORBILD UND MASSSTAB 1:2
   Das Holstentor ist rund 35 m breit und bis zur Spitze der Turmhelme
   etwa 30 m hoch. In 1:2 wird es 18 m breit und 15 m hoch – so steht es
   neben den Fachwerkhäusern (Traufe ~6 m) wie ein Stadttor über einer
   Altstadt, ohne die Karte zu sprengen. ALLES ist gleichmäßig verkleinert:
   Türme, Durchgang, Friese, Fenster, Dachneigung.
     • Zwei Rundtürme (Südturm, Nordturm). Zur Feldseite (Westen, im
       Modell Süden = +y, die „Hausfront") treten sie als Halbrund weit
       vor, zur Stadtseite bilden Türme und Mittelbau EINE gerade Front –
       genau wie am Vorbild. Grundriss je Turm: Halbkreis (Radius 3,3 m)
       plus Rechteck bis zur Stadtfront.
     • Kegeldächer mit Schiefer, Knauf und Stange auf der Spitze; zur
       Stadtseite sind sie wie die Mauer darunter abgeflacht.
     • Mittelbau mit dem spitzbogigen Durchgang, darüber auf der
       Feldseite die Inschrift „CONCORDIA DOMI FORIS PAX" (Eintracht
       drinnen, draußen Friede), auf der Stadtseite „S · P · Q · L" mit
       den Jahreszahlen 1477 und 1871. Oben auf beiden Seiten ein
       Staffelgiebel mit weiß geputzten Blendnischen.
     • Backstein im Wendischen Verband, dazu Bänder aus dunkel
       glasierten Steinen und zwei umlaufende Terrakottafriese mit
       Vierpässen; unter der Traufe ein Kreuzbogenfries auf Putzgrund.
       Feldseite: wehrhaft, wenige kleine Fenster, runde Kanonenscharten.
       Stadtseite: „weitaus filigraner" – Reihen spitzbogiger Fenster in
       Blendnischen.
     • „Leicht in den Boden gesunken": der Südturm (im Modell der
       westliche, x < 0) neigt sich um knapp ein Grad nach außen, der
       Sockel steckt zum Teil im Boden, der Durchgang liegt tiefer als
       der Platz davor.

   WIE ES GEMALT WIRD
   Ein normales Sprite des Kerns. Die Reihenfolge der Körper rechnet das
   Modell selbst: Es kennt beim Bauen den Blickwinkel (Objekt-Drehung +
   Kamera, wie Kirche und Tanne) und ordnet je zwei Körper, die sich im
   Bild überdecken, über eine trennende Ebene. Die Rundtürme sind
   20-eckige Prismen, aber weich schattiert (das Licht wird quer über
   jede Facette von Kante zu Kante verlaufen), so dass sie rund wirken.
   Muster hängen an Weltkoordinaten (Bogenlänge und Höhe), also laufen
   Steinlagen und Friese nahtlos um den Turm und wandern beim Bauen nicht.
   Türme werfen echte Schlagschatten auf den zurückliegenden Mittelbau.
   Nachts: warmes Flutlicht von Strahlern am Boden (Lichtkegel auf den
   Wänden über „color-dodge", Lichtpfützen mit M.bodenlicht), der
   Durchgang ist von innen erleuchtet.

   BAUPHASEN (o.bau 0…1) — wie im 15. Jahrhundert auf weichem Grund
     0,00–0,06  Baugrube
     0,05–0,10  Eichenpfähle werden eingerammt (Pfahlgründung – der
                weiche Boden ist der Grund, warum das Tor später sank)
     0,10–0,13  Schwellrost aus Balken auf den Pfahlköpfen
     0,13–0,19  Fundament aus Feldsteinen und Backstein bis zum Boden
     0,19–0,64  Mauern wachsen Lage für Lage (Mauerkrone mit Innenraum
                sichtbar); über dem Durchgang steht ein hölzerner
                Lehrbogen, bis der Bogen geschlossen ist
     0,60–0,68  Staffelgiebel
     0,64–0,76  Dachstuhl: Kaiserstiel, Sparren, Ringe
     0,76–0,90  Schieferdeckung von der Traufe zur Spitze
     0,90–1,00  Fenster, Inschrift, Knäufe, zuletzt Schnee
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
     Alle Flächen malen ihr Licht selbst (keinLicht): so lassen sich die
     Facetten der Rundtürme weich schattieren und Schlagschatten ohne
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
     warm angestrahlt – und die Kegel laufen ohne Kante über die Facetten der Rundtürme. */
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
        /* Streulicht: auch abgewandte und waagrechte Flächen bekommen einen Hauch */
        const a = k * (flutWert(strahler, P, n) + (n[2] > 0.9 ? 0 : 0.09));
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
     MASSE (Modell 1:2, Meter; x = Osten, y = Süden = Feldseite)
     ===================================================================== */
  const R = 3.3;               // Turmradius
  const XC = 5.6;              // Turmmitte (±x)
  const YC = 0.2;              // Mitte des Halbrunds
  const YS = -3.5;             // Stadtfront
  const YM = 1.2;              // Feldfront des Mittelbaus (zurückliegend)
  const XM = XC - R;           // 2,3 = Seitenkante des Mittelbaus
  const TRAUFE = 9.8;
  const Z_SPITZE = 15.0;       // Turmhelm
  const UE = 0.16;             // Dachüberstand
  const Z_FIRST = 12.55;       // First Mittelbau
  const GIEBEL_T = 0.36;       // Dicke der Staffelgiebel
  const NF = 20;               // Facetten des Halbrunds
  const NEIG = 0.014;          // Neigung zum Südturm hin (m je m Höhe, ~0,8°)
  const GRUND = [18, 8];
  /* Geschosse, Bänder, Friese (Höhen über dem Platz) */
  const Z_SOCKEL = 0.34;
  const FRIES = [[3.02, 3.36], [7.56, 7.9]];          // Terrakottafriese
  const GLASUR = [[2.94, 3.02], [3.36, 3.44], [5.34, 5.58], [7.48, 7.56], [7.9, 7.98]];
  const Z_KB0 = 9.22, Z_KB1 = 9.68;                     // Kreuzbogenfries
  /* Tor */
  const TOR_B = 2.3, TOR_K = 2.2, TOR_S = 3.85;         // Breite, Kämpfer, Scheitel

  /* ---------------- Farben (Werkstoff bei weißem Licht) ---------------- */
  const ZIEGEL = [146, 66, 46];
  const GLAS_D = [44, 42, 38];
  const TERRA = [184, 108, 68];
  const PUTZ = [222, 214, 198];
  const GRANIT = [120, 118, 112];
  const SCHIEFER = [72, 80, 88];
  const SCHNEE = [240, 244, 250];
  const HOLZ = [132, 98, 64];
  const ERDE = [104, 80, 58];
  const GOLD = [222, 178, 84];

  /* =====================================================================
     MUSTER — Backstein im Wendischen Verband (zwei Läufer, ein Binder),
     einmal je Detailstufe als Kachel gemalt, an Weltkoordinaten gehängt
     ===================================================================== */
  const MUSTER = {};
  const KW = 2.4, KH = 0.96, LAGE = 0.08;
  function ziegelBild(art, r) {
    const W = Math.round(KW * r), H = Math.round(KH * r);
    const c = document.createElement("canvas"); c.width = W; c.height = H;
    const g = c.getContext("2d");
    g.scale(W / KW, H / KH);
    const glas = art === "glasur", fund = art === "fund";
    g.fillStyle = rgbS(glas ? [96, 92, 86] : fund ? [120, 114, 104] : [176, 166, 148]);
    g.fillRect(0, 0, KW, KH);
    const rng = ST.zufall(ST.textHash(art) + 11);
    const j = r >= 40 ? 0.013 : 0.011;
    const farben = glas ? [[40, 44, 40], [52, 46, 40], [34, 36, 38], [58, 52, 42]]
      : fund ? [[112, 106, 98], [134, 124, 108], [96, 92, 88], [150, 140, 122]]
      : [[146, 64, 44], [132, 58, 40], [160, 76, 50], [120, 54, 38], [152, 82, 58], [138, 70, 48]];
    for (let i = 0; i < KH / LAGE; i++) {
      const y0 = i * LAGE;
      const seq = fund ? [0.3, 0.22, 0.34, 0.26, 0.28] : [0.24, 0.24, 0.12];
      let x = -mod(i * 0.18 + (fund ? i * 0.07 : 0), 0.6), s = 0;
      while (x < KW) {
        const len = seq[s % seq.length]; s++;
        let f = farben[(rng() * farben.length) | 0];
        if (!glas && !fund) {
          if (len < 0.15 && rng() < 0.16) f = [58, 46, 40];           // glasierter Binder
          else if (rng() < 0.05) f = [96, 50, 40];                     // Brandfleck
        }
        const d = 0.9 + rng() * 0.2;
        const col = [f[0] * d, f[1] * d, f[2] * d];
        for (const off of [0, KW, -KW]) {
          const xa = x + off + j / 2, xb = x + off + len - j / 2;
          if (xb < 0 || xa > KW) continue;
          g.fillStyle = rgbS(col);
          g.fillRect(xa, y0 + j / 2, xb - xa, LAGE - j);
          if (r >= 40) {
            /* Unterkante etwas dunkler, Oberkante heller: der Stein hat Körper */
            g.fillStyle = "rgba(0,0,0,0.13)"; g.fillRect(xa, y0 + LAGE - j / 2 - 0.012, xb - xa, 0.012);
            g.fillStyle = glas ? "rgba(255,255,240,0.22)" : "rgba(255,240,220,0.10)"; g.fillRect(xa, y0 + j / 2, xb - xa, glas ? 0.008 : 0.01);
            if (glas && rng() < 0.5) { g.fillStyle = "rgba(255,255,245,0.35)"; g.fillRect(xa + (xb - xa) * rng() * 0.7, y0 + j / 2 + 0.006, 0.04, 0.006); }
            if (!glas && rng() < 0.35) { g.fillStyle = "rgba(40,20,10,0.18)"; g.fillRect(xa + (xb - xa) * rng(), y0 + j / 2 + rng() * 0.04, 0.012, 0.012); }
          }
        }
        x += len;
      }
    }
    return { bild: c, r: r };
  }
  function muster(art, px) {
    const stufen = [14, 28, 56, 110, 180];
    let r = stufen[stufen.length - 1];
    for (const st of stufen) if (st >= px * 1.1) { r = st; break; }
    const k = art + "|" + r;
    if (!MUSTER[k]) MUSTER[k] = ziegelBild(art, r);
    return MUSTER[k];
  }
  /* Rechteck (Flächenkoordinaten) mit Mauerwerk füllen; a0 = Bogenlänge
     am linken Rand der Fläche, zTop = Höhe am oberen Rand */
  function mauerwerk(g, F, art, x, y, w, h, a0, zTop) {
    if (F.px < 5) {
      g.fillStyle = rgbS(art === "glasur" ? GLAS_D : art === "fund" ? [128, 120, 108] : [150, 72, 52]);
      g.fillRect(x, y, w, h);
      return;
    }
    const M = muster(art, F.px);
    const p = musterVon(g, M.bild);
    const k = 1 / M.r;
    p.setTransform(new DOMMatrix([k * KW * M.r / M.bild.width, 0, 0, k * KH * M.r / M.bild.height, -mod(a0, KW), mod(zTop, KH)]));
    g.fillStyle = p;
    g.fillRect(x, y, w, h);
  }

  /* =====================================================================
     BAUTEILE DER FASSADE (alles in Flächenkoordinaten: x nach rechts,
     y nach unten, Meter)
     ===================================================================== */
  function spitzPfad(g, x, yS, w, yU, stich) {
    /* Spitzbogen: zwei Kreisbögen, Radius = stich × Breite */
    const r = w * (stich || 0.8), phi = Math.acos(klemm((r - w / 2) / r, -1, 1));
    g.moveTo(x, yU); g.lineTo(x, yS);
    g.arc(x + r, yS, r, Math.PI, Math.PI + phi, false);
    g.arc(x + w - r, yS, r, -phi, 0, false);
    g.lineTo(x + w, yU); g.closePath();
  }
  function spitzHoehe(w, stich) { const r = w * (stich || 0.8); return Math.sqrt(Math.max(0, r * r - (r - w / 2) * (r - w / 2))); }

  /* Laibungsschatten: die Öffnung liegt um tiefe hinter der Wand */
  function laibung(g, F, pfad, tiefe, farbe) {
    const sv = F.schatten(tiefe);
    if (!sv) return;
    g.save();
    g.beginPath(); pfad(g); g.clip();
    g.beginPath(); g.rect(-50, -50, 200, 200);
    g.translate(sv[0], sv[1]); pfad(g); g.translate(-sv[0], -sv[1]);
    g.fillStyle = farbe || "rgba(20,16,24,0.55)";
    g.fill("evenodd");
    g.restore();
  }

  function schneeLeiste(g, x0, x1, y, dick, saat) {
    const rng = ST.zufall(saat || 5);
    g.fillStyle = rgbS(SCHNEE);
    g.beginPath(); g.moveTo(x0, y + 0.01);
    for (let x = x0; x <= x1 + 0.08; x += 0.08) g.lineTo(Math.min(x, x1), y - dick * (0.6 + rng() * 0.5));
    g.lineTo(x1, y + 0.01); g.closePath(); g.fill();
    g.fillStyle = "rgba(170,190,220,0.35)"; g.fillRect(x0, y - 0.005, x1 - x0, 0.012);
  }

  /* Terrakottafries: quadratische Platten mit Vierpass und Rosette auf
     dunkel glasiertem Grund */
  function terrakotta(g, F, x0, x1, y, h, a0) {
    g.fillStyle = rgbS([60, 48, 40]); g.fillRect(x0, y, x1 - x0, h);
    if (F.px * h < 5) { g.fillStyle = rgbS(TERRA, 0.7); g.fillRect(x0, y + h * 0.18, x1 - x0, h * 0.64); return; }
    const t = h, sv = F.schatten(0.03) || [0, 0];
    const i0 = Math.floor((a0 + x0) / t) - 1, i1 = Math.ceil((a0 + x1) / t) + 1;
    const fein = F.px * h > 14;
    for (let i = i0; i <= i1; i++) {
      const cx = i * t - a0 + t / 2, cy = y + h / 2;
      /* Platte */
      g.fillStyle = rgbS(mischF(TERRA, [120, 60, 40], (i * 7919 % 5) / 12));
      g.fillRect(cx - t * 0.46, y + h * 0.06, t * 0.92, h * 0.88);
      if (!fein) { g.fillStyle = "rgba(60,30,20,0.35)"; g.beginPath(); g.arc(cx, cy, t * 0.2, 0, TAU); g.fill(); continue; }
      /* Vierpass: Schatten, dann Relief */
      const pass = (dx, dy) => { g.beginPath(); for (let k = 0; k < 4; k++) { const w = k * Math.PI / 2; g.moveTo(cx + dx + Math.cos(w) * t * 0.17 + t * 0.14, cy + dy + Math.sin(w) * t * 0.17); g.arc(cx + dx + Math.cos(w) * t * 0.17, cy + dy + Math.sin(w) * t * 0.17, t * 0.14, 0, TAU); } };
      g.fillStyle = "rgba(50,24,16,0.55)"; pass(sv[0], sv[1]); g.fill();
      g.fillStyle = rgbS([206, 134, 90]); pass(0, 0); g.fill();
      g.fillStyle = "rgba(90,40,24,0.55)"; g.beginPath(); g.arc(cx, cy, t * 0.12, 0, TAU); g.fill();
      g.fillStyle = rgbS([214, 148, 100]); g.beginPath(); g.arc(cx, cy, t * 0.07, 0, TAU); g.fill();
      if (F.px * h > 30) {
        g.fillStyle = "rgba(60,26,16,0.5)";
        for (let k = 0; k < 4; k++) { const w = k * Math.PI / 2 + Math.PI / 4; g.beginPath(); g.arc(cx + Math.cos(w) * t * 0.36, cy + Math.sin(w) * t * 0.36, t * 0.035, 0, TAU); g.fill(); }
      }
    }
    /* Profilleisten oben und unten */
    g.fillStyle = "rgba(20,16,14,0.5)"; g.fillRect(x0, y, x1 - x0, h * 0.06); g.fillRect(x0, y + h * 0.94, x1 - x0, h * 0.06);
  }

  /* Kreuzbogenfries unter der Traufe: sich überschneidende Rundbögen aus
     Backstein auf weißem Putz */
  function kreuzbogen(g, F, x0, x1, y0, y1, a0) {
    const h = y1 - y0;
    g.fillStyle = rgbS(PUTZ); g.fillRect(x0, y0, x1 - x0, h);
    rausch(g, x0, y0, x1 - x0, h, 1.6, 0.18, 21, true);
    if (F.px * h < 4) { g.fillStyle = "rgba(150,70,50,0.35)"; g.fillRect(x0, y0, x1 - x0, h * 0.35); return; }
    const t = 0.3, r = t;
    const i0 = Math.floor((a0 + x0) / t) - 2, i1 = Math.ceil((a0 + x1) / t) + 2;
    g.save();
    g.beginPath(); g.rect(x0, y0, x1 - x0, h); g.clip();
    const sv = F.schatten(0.05) || [0, 0];
    g.lineWidth = Math.max(0.045, 0.8 / F.px);
    for (const [dx, dy, farbe] of [[sv[0], sv[1], "rgba(60,50,50,0.35)"], [0, 0, rgbS(ZIEGEL)]]) {
      g.strokeStyle = farbe;
      g.beginPath();
      for (let i = i0; i <= i1; i++) { const cx = i * t - a0 + dx; g.moveTo(cx + r, y1 + dy); g.arc(cx, y1 + dy, r, 0, Math.PI, true); }
      g.stroke();
    }
    /* Konsolen an den Bogenfüßen */
    if (F.px > 16) { g.fillStyle = rgbS(GLAS_D); for (let i = i0; i <= i1; i++) { const cx = i * t - a0; g.fillRect(cx - 0.035, y1 - 0.07, 0.07, 0.07); } }
    g.restore();
    /* oben ein Rollschicht-Gesims */
    g.fillStyle = rgbS([120, 52, 38]); g.fillRect(x0, y0, x1 - x0, 0.05);
  }

  /* Spitzbogenfenster in einer Blendnische */
  function fenster(g, F, Z, x, zU, zK, w, zTop, opt) {
    opt = opt || {};
    const yK = zTop - zK, yU = zTop - zU, stich = opt.stich || 0.75;
    const pf = (gg) => spitzPfad(gg, x, yK, w, yU, stich);
    const klein = F.px * w < 6;
    if (klein) { g.fillStyle = "rgba(24,22,26,0.85)"; g.beginPath(); pf(g); g.fill(); return; }
    /* Bogen aus wechselnd glasierten und roten Steinen */
    if (F.px > 10) {
      g.save();
      g.lineWidth = 0.11;
      g.strokeStyle = rgbS(GLAS_D); g.beginPath(); spitzPfad(g, x - 0.055, yK, w + 0.11, yU, stich * w / (w + 0.11) * 1.0 + 0.0); g.stroke();
      g.setLineDash([0.07, 0.07]); g.strokeStyle = rgbS([150, 66, 44]); g.stroke();
      g.restore();
    }
    const offen = !Z.fenster;
    g.save(); g.beginPath(); pf(g); g.clip();
    if (offen) { g.fillStyle = rgbS([28, 24, 22]); g.fillRect(x - 1, yK - 3, w + 2, 6); }
    else {
      /* Glas: Himmel spiegelt sich oben, unten dunkler */
      const gr = g.createLinearGradient(0, yK - spitzHoehe(w, stich), 0, yU);
      gr.addColorStop(0, "rgb(122,138,156)"); gr.addColorStop(0.45, "rgb(58,66,80)"); gr.addColorStop(1, "rgb(34,38,46)");
      g.fillStyle = gr; g.fillRect(x - 1, yK - 3, w + 2, 6);
      if (F.px > 28) {
        /* Bleiverglasung: Rauten */
        g.strokeStyle = "rgba(30,30,34,0.7)"; g.lineWidth = Math.max(0.008, 0.6 / F.px);
        g.beginPath();
        const d = 0.1;
        for (let k = -20; k < 40; k++) { g.moveTo(x + k * d, yK - 3); g.lineTo(x + k * d + 6, yK + 3); g.moveTo(x + k * d, yK + 3); g.lineTo(x + k * d + 6, yK - 3); }
        g.stroke();
      }
      /* Mittelpfosten und Kämpferriegel */
      if (w > 0.6 && F.px > 12) {
        g.fillStyle = rgbS([168, 150, 128]); g.fillRect(x + w / 2 - 0.03, yK - 2, 0.06, 4);
        g.fillRect(x, yK - 0.02, w, 0.04);
      }
    }
    g.restore();
    laibung(g, F, pf, 0.3);
    /* Sohlbank aus glasierten Formsteinen */
    g.fillStyle = rgbS([56, 50, 44]); g.fillRect(x - 0.05, yU, w + 0.1, 0.07);
    if (Z.winter && Z.schnee > 0) schneeLeiste(g, x - 0.06, x + w + 0.06, yU + 0.01, 0.06 * Z.schnee, (x * 100) | 0);
    else if (F.px > 20) PI.schliere(g, x, yU + 0.07, w, 0.7, F);
  }

  /* Blendnische mit weißem Putz (Giebel, Stadtseite) */
  function blende(g, F, x, zU, zK, w, zTop, stich) {
    const yK = zTop - zK, yU = zTop - zU;
    const pf = (gg) => spitzPfad(gg, x, yK, w, yU, stich || 0.8);
    g.fillStyle = rgbS(PUTZ); g.beginPath(); pf(g); g.fill();
    if (F.px > 12) { g.save(); g.beginPath(); pf(g); g.clip(); rausch(g, x, yK - 2, w, yU - yK + 2, 1.2, 0.2, 7, true); g.restore(); }
    laibung(g, F, pf, 0.14, "rgba(40,36,48,0.45)");
  }

  /* Kanonenscharte der Feldseite: runde Öffnung mit Sehschlitz,
     Sandsteinrahmen */
  function scharte(g, F, cx, z, r, zTop) {
    const cy = zTop - z;
    if (F.px * r < 2) { g.fillStyle = "rgba(20,18,20,0.8)"; g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.fill(); return; }
    g.fillStyle = rgbS([138, 128, 112]);
    g.beginPath(); g.arc(cx, cy, r + 0.06, 0, TAU); g.rect(cx - 0.07, cy - r - 0.42, 0.14, 0.42); g.fill();
    const pf = (gg) => { gg.moveTo(cx + r, cy); gg.arc(cx, cy, r, 0, TAU); gg.rect(cx - 0.028, cy - r - 0.36, 0.056, 0.4); };
    g.fillStyle = rgbS([22, 20, 22]); g.beginPath(); pf(g); g.fill();
    if (F.px > 20) { g.strokeStyle = "rgba(60,54,48,0.6)"; g.lineWidth = 0.015; g.beginPath(); g.arc(cx, cy, r + 0.07, 0, TAU); g.stroke(); }
  }

  /* Feldsteinsockel (halb im Boden) */
  function sockel(g, F, x0, x1, y0, y1, a0) {
    g.fillStyle = rgbS(GRANIT); g.fillRect(x0, y0, x1 - x0, y1 - y0);
    if (F.px > 10) {
      const rng = ST.zufall(((a0 * 13) | 0) + 3);
      g.strokeStyle = "rgba(40,38,36,0.55)"; g.lineWidth = Math.max(0.012, 0.7 / F.px);
      g.beginPath();
      let x = x0 - mod(a0, 0.5);
      while (x < x1) { const b = 0.3 + rng() * 0.35; g.moveTo(x, y0); g.lineTo(x + (rng() - 0.5) * 0.06, y1); x += b; }
      g.moveTo(x0, (y0 + y1) / 2 + 0.02); g.lineTo(x1, (y0 + y1) / 2 - 0.02);
      g.stroke();
      rausch(g, x0, y0, x1 - x0, y1 - y0, 0.8, 0.35, 9, true);
    }
    /* Moos und Feuchte */
    const gr = g.createLinearGradient(0, y1, 0, y0 - 0.5);
    gr.addColorStop(0, "rgba(60,70,40,0.45)"); gr.addColorStop(1, "rgba(60,70,40,0)");
    g.fillStyle = gr; g.fillRect(x0, y0 - 0.5, x1 - x0, y1 - y0 + 0.5);
  }

  /* =====================================================================
     DIE WAND — eine Ansicht (Aufriss) mit ihren Öffnungen
     S = { laenge, el: [...] }, gemalt für den Abschnitt aL … aL + F.w
     ===================================================================== */
  function wandMalen(g, F, Z, S, aL, zTop, feld, giebel) {
    const w = F.w, h = F.h, Y = (z) => zTop - z;
    const amBoden = zTop - h < 0.5;
    mauerwerk(g, F, "rot", -0.2, -0.2, w + 0.4, h + 0.4, aL, zTop);
    /* großflächige Tönung: nachgedunkelt, verrußt, hellere Flicken */
    rausch(g, -0.2, -0.2, w + 0.4, h + 0.4, 4.2, 0.22, 13 + (Z.saat % 7), false);
    bleich(g, -0.2, -0.2, w + 0.4, h + 0.4, 3.0, 0.07, 5);
    /* Glasurbänder */
    for (const [z0, z1] of GLASUR) if (z0 < zTop) mauerwerk(g, F, "glasur", -0.2, Y(Math.min(z1, zTop)), w + 0.4, Math.min(z1, zTop) - z0, aL, zTop);
    /* Feldseite: in den oberen Geschossen gestreift (je zwei glasierte Lagen) */
    if (feld && F.px > 3) for (let z = 3.84; z < 9.1; z += 0.64) if (z < zTop && !(z > 5.2 && z < 5.7) && !(z > 7.4 && z < 8.0)) mauerwerk(g, F, "glasur", -0.2, Y(Math.min(z + 0.16, zTop)), w + 0.4, Math.min(0.16, zTop - z), aL, zTop);
    /* Friese */
    for (const [z0, z1] of FRIES) if (z1 <= zTop) terrakotta(g, F, -0.2, w + 0.2, Y(z1), z1 - z0, aL);
    if (!giebel && Z_KB1 <= zTop) kreuzbogen(g, F, -0.2, w + 0.2, Y(Z_KB1), Y(Z_KB0), aL);
    if (!giebel && TRAUFE <= zTop + 0.01) mauerwerk(g, F, "glasur", -0.2, -0.2, w + 0.4, Y(Z_KB1) + 0.2, aL, zTop);
    if (giebel) {
      /* Giebel: glasierte Streifen je 0,64 m, wie die Feldseite der Türme */
      for (let z = TRAUFE + 0.32; z < zTop; z += 0.64) mauerwerk(g, F, "glasur", -0.2, Y(Math.min(z + 0.16, zTop)), w + 0.4, Math.min(0.16, zTop - z), aL, zTop);
    }
    /* Öffnungen */
    for (const e of S.el) {
      const x = e.a - aL;
      if (x > w + 2 || x + (e.w || 1) < -2) continue;
      if (e.z0 != null && e.z0 > zTop) continue;
      if (e.t === "fenster") fenster(g, F, Z, x, e.z0, e.z1, e.w, zTop, e);
      else if (e.t === "blende") blende(g, F, x, e.z0, e.z1, e.w, zTop, e.stich);
      else if (e.t === "scharte") scharte(g, F, x, e.z, e.r, zTop);
      else if (e.t === "tor") torMalen(g, F, Z, x, zTop, e);
      else if (e.t === "schrift") schriftMalen(g, F, Z, x, zTop, e);
    }
    if (amBoden) {
      /* Sockel, halb eingesunken */
      sockel(g, F, -0.2, w + 0.2, Y(Z_SOCKEL), h + 0.2, aL);
      /* Spritzwasser und Schmutz unten */
      const gr = g.createLinearGradient(0, h, 0, h - 1.4);
      gr.addColorStop(0, "rgba(50,40,34,0.35)"); gr.addColorStop(1, "rgba(50,40,34,0)");
      g.fillStyle = gr; g.fillRect(-0.2, h - 1.4, w + 0.4, 1.4);
    }
    /* Schnee auf Friesen und Gesimsen */
    if (Z.winter && Z.schnee > 0 && !giebel) {
      for (const [, z1] of FRIES) if (z1 <= zTop) schneeLeiste(g, -0.2, w + 0.2, Y(z1 + 0.08), 0.07 * Z.schnee, (z1 * 10 + aL * 3) | 0);
      schneeLeiste(g, -0.2, w + 0.2, Y(5.58), 0.05 * Z.schnee, (aL * 7) | 0);
      if (zTop < TRAUFE - 0.05) schneeLeiste(g, -0.2, w + 0.2, 0.03, 0.08 * Z.schnee, 3);
    }
  }

  /* Tor: gestufte Gewände, Durchblick durch die Durchfahrt */
  function torMalen(g, F, Z, x, zTop, e) {
    const w = TOR_B, yU = zTop + 0.25, yK = zTop - TOR_K, stich = e.stich || 0.72;
    const ringe = 3, st = 0.15;
    /* Gewände: äußere Ringe zuerst */
    for (let i = ringe; i >= 1; i--) {
      const xa = x - i * st, wa = w + 2 * i * st;
      const pf = (gg) => spitzPfad(gg, xa, yK, wa, yU, stich);
      g.fillStyle = rgbS(i === ringe ? GLAS_D : i === 2 ? [150, 70, 48] : [128, 58, 42]);
      g.beginPath(); pf(g); g.fill();
      if (F.px > 14) {
        /* Keilsteine */
        g.save(); g.beginPath(); pf(g); g.clip();
        g.strokeStyle = "rgba(190,176,150,0.5)"; g.lineWidth = Math.max(0.01, 0.6 / F.px);
        const r = wa * stich, cxl = xa + r, cxr = xa + wa - r;
        g.beginPath();
        for (let k = 0; k < 14; k++) {
          const t = k / 14, phi = Math.acos(klemm((r - wa / 2) / r, -1, 1));
          const al = Math.PI + phi * t, ar = -phi * t;
          g.moveTo(cxl + Math.cos(al) * (r - st * 1.1), yK + Math.sin(al) * (r - st * 1.1)); g.lineTo(cxl + Math.cos(al) * r, yK + Math.sin(al) * r);
          g.moveTo(cxr + Math.cos(ar) * (r - st * 1.1), yK + Math.sin(ar) * (r - st * 1.1)); g.lineTo(cxr + Math.cos(ar) * r, yK + Math.sin(ar) * r);
        }
        g.stroke(); g.restore();
      }
      laibung(g, F, (gg) => spitzPfad(gg, xa + st, yK, wa - 2 * st, yU, stich), 0.12, "rgba(24,18,20,0.4)");
    }
    const pf = (gg) => spitzPfad(gg, x, yK, w, yU, stich);
    /* Durchfahrt */
    g.save(); g.beginPath(); pf(g); g.clip();
    const top = yK - spitzHoehe(w, stich);
    const gr = g.createLinearGradient(0, top, 0, yU);
    gr.addColorStop(0, "rgb(26,20,18)"); gr.addColorStop(1, "rgb(52,44,38)");
    g.fillStyle = gr; g.fillRect(x - 1, top - 1, w + 2, yU - top + 2);
    /* Tonnengewölbe: Steinlagen im Dunkel */
    if (F.px > 20) { g.strokeStyle = "rgba(90,70,60,0.35)"; g.lineWidth = 0.012; g.beginPath(); for (let y = top; y < yK; y += 0.16) { g.moveTo(x, y); g.lineTo(x + w, y); } g.stroke(); }
    /* das andere Ende: Tageslicht bzw. Nacht */
    const d = e.durch || [0, 0];
    if (Z.tor) {
      g.save(); g.translate(d[0], d[1]);
      const aus = F.nacht > 0.5 ? [40, 48, 70] : Z.winter ? [214, 222, 232] : [196, 204, 196];
      g.fillStyle = rgbS(mischF(aus, [0, 0, 0], 0.15)); g.beginPath(); pf(g); g.fill();
      /* Pflaster und Häuser der Altstadt jenseits des Tors */
      g.fillStyle = rgbS(F.nacht > 0.5 ? [30, 30, 40] : Z.winter ? [226, 232, 240] : [150, 140, 128]); g.fillRect(x - 1, yU - 0.5, w + 2, 1);
      if (F.px > 12 && F.nacht < 0.5) {
        g.fillStyle = "rgba(120,80,60,0.45)"; g.fillRect(x + w * 0.1, yU - 1.6, w * 0.35, 1.1);
        g.fillStyle = "rgba(170,150,120,0.4)"; g.fillRect(x + w * 0.55, yU - 1.9, w * 0.4, 1.4);
      }
      g.restore();
    }
    /* Boden der Durchfahrt (liegt tiefer als der Platz) */
    g.fillStyle = rgbS([70, 62, 56]);
    g.beginPath(); g.moveTo(x - 1, yU); g.lineTo(x + w + 1, yU); g.lineTo(x + w + 1 + d[0], yU + d[1]); g.lineTo(x - 1 + d[0], yU + d[1]); g.closePath(); g.fill();
    /* Lehrbogen während des Baus */
    if (Z.lehrbogen) {
      g.strokeStyle = rgbS(HOLZ); g.lineWidth = 0.1;
      g.beginPath(); spitzPfad(g, x + 0.08, yK, w - 0.16, yU + 5, stich); g.stroke();
      g.lineWidth = 0.08; g.beginPath();
      g.moveTo(x + 0.2, yU); g.lineTo(x + 0.2, yK); g.moveTo(x + w - 0.2, yU); g.lineTo(x + w - 0.2, yK);
      g.moveTo(x + 0.2, yK); g.lineTo(x + w / 2, top + 0.15); g.lineTo(x + w - 0.2, yK); g.moveTo(x + w / 2, top + 0.15); g.lineTo(x + w / 2, yK); g.lineTo(x + 0.2, yK + 0.02); g.lineTo(x + w - 0.2, yK + 0.02);
      g.moveTo(x + 0.2, yK + 0.9); g.lineTo(x + w - 0.2, yK + 0.9);
      g.stroke();
    }
    g.restore();
    laibung(g, F, pf, 0.4, "rgba(10,8,10,0.45)");
  }

  /* Inschrift: goldene Versalien auf dunkel glasiertem Band */
  function schriftMalen(g, F, Z, x, zTop, e) {
    if (!Z.schrift) return;
    const y = zTop - e.z1, h = e.z1 - e.z0;
    g.fillStyle = rgbS([46, 40, 36]); g.fillRect(x, y, e.w, h);
    g.strokeStyle = rgbS([150, 120, 70]); g.lineWidth = Math.max(0.012, 0.5 / F.px); g.strokeRect(x + 0.03, y + 0.03, e.w - 0.06, h - 0.06);
    if (F.px * h < 6) { g.fillStyle = rgbS(GOLD, 0.55); g.fillRect(x + 0.15, y + h * 0.35, e.w - 0.3, h * 0.3); return; }
    g.save();
    g.translate(x + e.w / 2, y + h * 0.54);
    const k = 100;
    g.scale(1 / k, 1 / k);
    g.font = "600 " + Math.round(h * 0.62 * k) + "px 'Times New Roman', Georgia, serif";
    g.textAlign = "center"; g.textBaseline = "middle";
    const tw = g.measureText(e.text).width, max = (e.w - 0.24) * k;
    if (tw > max) g.scale(max / tw, 1);
    g.fillStyle = "rgba(20,14,8,0.6)"; g.fillText(e.text, h * 0.03 * k, h * 0.04 * k);
    g.fillStyle = rgbS(GOLD); g.fillText(e.text, 0, 0);
    g.restore();
  }

  /* =====================================================================
     SCHIEFER — Schuppendeckung in waagrechten Reihen
     (Flächenkoordinaten eines Dachs: x waagrecht, y hangab)
     ===================================================================== */
  function schiefer(g, F, Z, w, h, a0, yOff) {
    const reihe = 0.15;
    g.fillStyle = rgbS(SCHIEFER); g.fillRect(-0.2, -0.2, w + 0.4, h + 0.4);
    rausch(g, -0.2, -0.2, w + 0.4, h + 0.4, 2.2, 0.25, 41, false);
    if (F.px * reihe > 2.2) {
      const rng = ST.zufall(((a0 * 31) | 0) + 7);
      const fein = F.px * reihe > 7;
      const y0 = -mod(yOff, reihe);
      for (let y = y0; y < h + reihe; y += reihe) {
        const ri = Math.round((y + yOff) / reihe);
        if (fein) {
          const tb = 0.2, x0 = -mod(a0 + (ri % 2) * tb / 2, tb);
          for (let x = x0; x < w + tb; x += tb) {
            const d = 0.82 + rng() * 0.3;
            g.fillStyle = rgbS([SCHIEFER[0] * d, SCHIEFER[1] * d, SCHIEFER[2] * d * 1.02]);
            g.beginPath(); g.moveTo(x, y); g.lineTo(x + tb, y); g.lineTo(x + tb, y + reihe * 0.55); g.quadraticCurveTo(x + tb, y + reihe * 1.05, x + tb / 2, y + reihe * 1.05); g.quadraticCurveTo(x, y + reihe * 1.05, x, y + reihe * 0.55); g.closePath(); g.fill();
          }
        }
        g.fillStyle = "rgba(20,24,30,0.45)"; g.fillRect(-0.2, y + reihe - 0.012, w + 0.4, 0.02);
      }
    }
    /* Kupferne Schneefanggitter? Nein – Schnee rutscht vom steilen Helm,
       bleibt nur in den Reihen hängen und liegt dicker an der Traufe */
    if (Z.winter && Z.schnee > 0) {
      /* Schnee am steilen Helm: ein feiner Hauch überall, in den
         Schuppenreihen bleiben schmale Streifen hängen (unterbrochen),
         an der Traufe liegt er dicker */
      const k = Z.schnee, rng = ST.zufall(((a0 * 17) | 0) + 91);
      g.fillStyle = rgbS(SCHNEE, 0.22 * k); g.fillRect(-0.2, -0.2, w + 0.4, h + 0.4);
      if (F.px * reihe > 1.5) {
        const y0 = -mod(yOff, reihe);
        for (let y = y0; y < h + reihe; y += reihe) {
          const tief = klemm((y + yOff) / 5, 0.25, 1);
          let x = -0.2 - rng() * 0.5;
          g.lineCap = "round";
          while (x < w + 0.2) {
            const l = 0.15 + Math.pow(rng(), 1.6) * 1.1;
            if (rng() < 0.4 + 0.35 * tief) {
              /* weiche, ungleich dicke Schneewülste an der Schuppenkante */
              const d = reihe * (0.08 + 0.22 * tief * rng());
              g.strokeStyle = rgbS(SCHNEE, (0.35 + 0.5 * rng()) * k);
              g.lineWidth = d;
              const yy = y + reihe * (0.6 + 0.25 * rng());
              g.beginPath(); g.moveTo(x, yy); g.quadraticCurveTo(x + l / 2, yy - d * 0.4, x + l, yy + d * 0.2 * (rng() - 0.5)); g.stroke();
            }
            x += l + 0.05 + rng() * 0.5;
          }
        }
      }
      const gr = g.createLinearGradient(0, h, 0, h - 0.8);
      gr.addColorStop(0, rgbS(SCHNEE, 0.96 * k)); gr.addColorStop(0.45, rgbS(SCHNEE, 0.6 * k)); gr.addColorStop(1, rgbS(SCHNEE, 0));
      g.fillStyle = gr; g.fillRect(-0.2, h - 0.8, w + 0.4, 0.85);
    }
  }

  /* =====================================================================
     BAUZUSTAND
     ===================================================================== */
  function zustand(bau, jahr) {
    const f = (a, b) => klemm((bau - a) / (b - a), 0, 1);
    const Z = { bau: bau, fertig: bau >= 0.999, winter: jahr === "winter" };
    Z.grube = bau < 0.19;
    Z.tiefe = 1.3 * glatt(f(0, 0.06));
    Z.pfaehle = f(0.05, 0.1); Z.rost = f(0.1, 0.13); Z.fund = f(0.13, 0.19);
    Z.wand = f(0.19, 0.64);
    Z.zWand = bau >= 0.64 ? TRAUFE : Z.wand * TRAUFE;
    Z.lehrbogen = Z.zWand > TOR_K - 0.2 && bau < 0.5;
    Z.giebel = f(0.6, 0.68);
    Z.stuhl = f(0.64, 0.76);
    Z.deck = f(0.76, 0.9);
    Z.fenster = bau >= 0.9; Z.tor = bau >= 0.3 || Z.zWand > TOR_S;
    Z.schrift = bau >= 0.95; Z.knauf = bau >= 0.92;
    Z.schnee = Z.winter ? (Z.fertig ? 1 : f(0.92, 0.99)) : 0;
    return Z;
  }

  /* Vieleck (3D) an der Ebene z ≤ zc abschneiden */
  function kappeZ(pts, zc) {
    const aus = [];
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length], ia = a[2] <= zc + 1e-9, ib = b[2] <= zc + 1e-9;
      if (ia) aus.push(a);
      if (ia !== ib) { const t = (zc - a[2]) / (b[2] - a[2]); aus.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, zc]); }
    }
    return aus;
  }

  /* Stabwerk (Pfähle, Rost, Dachstuhl) als Figur: Hölzer in 3D, im
     Blickwinkel projiziert und von hinten nach vorn gemalt */
  function stabwerk(stabe, B0) {
    return function (g, s, F) {
      if (F.schatten) return;
      const r = (F.gier || 0) * RAD, c = Math.cos(r), sn = Math.sin(r), a = KZ * Math.SQRT1_2;
      const e = [a * (c + sn), a * (c - sn), 0.5];
      const P = (p) => { const x = (p[0] - B0[0]) * c - (p[1] - B0[1]) * sn, y = (p[0] - B0[0]) * sn + (p[1] - B0[1]) * c; return [(x - y) * KX * s, (x + y) * KY * s - (p[2] - B0[2]) * KZ * s]; };
      const L = stabe.map((st) => ({ st: st, t: dot(mul(add(st[0], st[1]), 0.5), e) })).sort((x, y) => x.t - y.t);
      g.lineCap = "butt";
      for (const { st } of L) {
        const p0 = P(st[0]), p1 = P(st[1]);
        const dir = nrm(sub(st[1], st[0]));
        /* Normale: quer zum Holz, zum Betrachter hin */
        let n = sub(e, mul(dir, dot(e, dir))); n = nrm(add(n, [0, 0, 0.3]));
        const lf = ST.lichtFaktor([n[0] * c - n[1] * sn, n[0] * sn + n[1] * c, n[2]], F.Z, 0, F.jahr);
        const col = st[3] || HOLZ;
        g.strokeStyle = rgbS([col[0] * lf[0], col[1] * lf[1], col[2] * lf[2]]);
        g.lineWidth = Math.max(0.7, st[2] * s);
        g.beginPath(); g.moveTo(p0[0], p0[1]); g.lineTo(p1[0], p1[1]); g.stroke();
        if (st[4] && F.jahr === "winter") { g.strokeStyle = "rgba(240,244,250,0.85)"; g.lineWidth = Math.max(0.5, st[2] * s * 0.4); g.beginPath(); g.moveTo(p0[0], p0[1] - st[2] * s * 0.4); g.lineTo(p1[0], p1[1] - st[2] * s * 0.4); g.stroke(); }
      }
    };
  }

  /* =====================================================================
     MODELL
     ===================================================================== */
  ST.modell("holstentor", {
    name: "Holstentor", gruppe: "Wahrzeichen", grund: GRUND, hoehe: 15.2, bauzeit: 40 * 60,
    bauen(M, o) {
      const B = blickVon(o), W = new Werk(M, B);
      const bau = o.bau == null ? 1 : o.bau;
      const Z = zustand(bau, o.jahr);
      Z.saat = (o.saat || 1) >>> 0;
      const e = B.e;

      /* Strahler (Flutlicht) am Boden: vor jedem Turm zwei, vor dem
         Mittelbau zwei, auf der Stadtseite vier, an den Flanken je einer */
      const STRAHLER = [];
      for (const sx of [-1, 1]) {
        for (const th of [55, 125]) STRAHLER.push([sx * XC + Math.cos(th * RAD) * (R + 1.3), YC + Math.sin(th * RAD) * (R + 1.3), 0.25]);
        STRAHLER.push([sx * 1.3, YM + 1.4, 0.25]);
        STRAHLER.push([sx * 1.6, YS - 1.3, 0.25]); STRAHLER.push([sx * 6.2, YS - 1.3, 0.25]);
        STRAHLER.push([sx * (XC + R + 1.3), -1.6, 0.25]);
      }

      /* ---------- Baugrube, Pfähle, Rost, Fundament ---------- */
      const GX0 = -9.2, GX1 = 9.2, GY0 = -3.95, GY1 = 3.95;
      if (Z.grube) grubeBauen(W, M, B, Z, [GX0, GY0, GX1, GY1]);

      /* Grundrisse (für Fundament und Mauern) */
      const turmGrund = (sx) => {
        const P = [];
        for (let i = 0; i <= NF; i++) { const th = (180 - i * 180 / NF) * RAD; P.push([sx * XC + Math.cos(th) * R, YC + Math.sin(th) * R]); }
        P.push([sx * XC + R, YS]); P.push([sx * XC - R, YS]);
        return P;
      };
      const mitteGrund = [[-XM, YM], [XM, YM], [XM, YS], [-XM, YS]];

      /* „Leicht in den Boden gesunken": der Bau neigt sich zum Südturm
         (x < 0) hin – die ganze Masse, damit keine Fuge aufreißt */
      const scher = (p) => p[2] > 0 ? [p[0] - NEIG * p[2], p[1] + NEIG * 0.3 * p[2], p[2]] : p;
      W.scher = scher;

      if (Z.grube && Z.fund > 0) {
        const zF = -Z.tiefe + Z.tiefe * glatt(Z.fund);
        fundamentBauen(W, Z, B, [turmGrund(-1), turmGrund(1), mitteGrund], -Z.tiefe, zF, [GX0, GY0, GX1, GY1]);
      }
      if (Z.grube && Z.fund < 1) stabwerkGrube(W, M, Z);

      /* ---------- Mauern ---------- */
      const zW = Z.zWand;
      const wandOpt = { keinLicht: true };
      const werferTuerme = [];
      if (zW > 0.02) {
        for (const sx of [-1, 1]) {
          const G = turmGrund(sx);
          const k = W.teil("turm" + sx);
          /* Aufrisse: Feld-Halbrund, Außenflanke, Stadtfront */
          const lenArc = NF * 2 * R * Math.sin(Math.PI / 2 / NF);
          const spieg = (el, len) => sx > 0 ? el : el.map((q) => Object.assign({}, q, { a: len - q.a - (q.w || 0) }));
          const Sarc = { el: spieg(ELEMENTE.arc(lenArc), lenArc) };
          const lenFl = YC - YS, lenSt = 2 * R;
          const Sfl = { el: spieg(ELEMENTE.flanke(lenFl), lenFl) };
          const Sst = { el: spieg(ELEMENTE.stadtTurm(lenSt), lenSt) };
          const n = G.length;
          for (let i = 0; i < n; i++) {
            const a = G[i], b = G[(i + 1) % n];
            /* innere Flanke (zum Mittelbau) weglassen */
            const innen = (sx > 0 && i === n - 1) || (sx < 0 && i === NF);
            if (innen) {
              /* nur über dem Mittelbau sichtbar? Der Mittelbau ist gleich hoch → nie */
              continue;
            }
            const pts = [[a[0], a[1], zW], [b[0], b[1], zW], [b[0], b[1], 0], [a[0], a[1], 0]];
            let S, aL, nL, nR, feld = false;
            if (i < NF) {
              S = Sarc; feld = true;
              const wf = lenArc / NF;
              aL = sx > 0 ? i * wf : i * wf;
              const t0 = (180 - i * 180 / NF) * RAD, t1 = (180 - (i + 1) * 180 / NF) * RAD;
              nL = [Math.cos(t0), Math.sin(t0), 0]; nR = [Math.cos(t1), Math.sin(t1), 0];
            } else if ((sx > 0 && i === NF) || (sx < 0 && i === n - 1)) {
              S = Sfl; aL = 0; nL = [sx, 0, 0]; nR = null;
            } else {
              S = Sst; aL = 0; nL = [0, -1, 0]; nR = null;
            }
            const info = { S: S, aL: aL, nL: nL, nR: nR, feld: feld };
            W.poly(pts, [sx * XC, YC - 1, zW / 2], (g, F) => {
              wandMalen(g, F, Z, info.S, info.aL, zW, info.feld);
              belichten(g, F, B, info.nL, info.nR, { ao: true, traufe: zW >= TRAUFE - 0.01 && Z.deck >= 1 ? 0.35 : 0, flut: Z.fertig ? STRAHLER : null });
            }, Object.assign({ name: "t" + sx + "w" + i }, wandOpt));
          }
          W.huelle([], [[[0, 0, 1], zW]]);
          /* Mauerkrone, solange gebaut wird bzw. das Dach noch offen ist */
          if (zW < TRAUFE - 0.01 || Z.deck < 1) {
            W.poly(G.map((p) => [p[0], p[1], zW]), [sx * XC, YC, zW - 5], (g, F) => {
              kroneMalen(g, F, Z, G.map((p) => scher([p[0], p[1], zW])), scher([sx * XC, YC, zW]), 1.5);
              belichten(g, F, B, [0, 0, 1]);
            }, { name: "krone" + sx });
          }
          werferTuerme.push(k.pts.slice());
        }
        /* Mittelbau */
        W.teil("mitte");
        const durchT = 4.7;
        const durch = (n, u, v) => { const t = durchT / Math.max(0.2, dot(e, n)); return [t * dot(e, u), t * dot(e, v)]; };
        const Sfeld = { el: ELEMENTE.mitteFeld() }, Sstadt = { el: ELEMENTE.mitteStadt() };
        const wandM = (pts, S, n, name) => {
          const f = W.poly(pts, [0, (YM + YS) / 2, zW / 2], (g, F) => {
            if (S.el.length) for (const el of S.el) if (el.t === "tor") el.durch = durch(n, F.flaeche.u, F.flaeche.v);
            wandMalen(g, F, Z, S, 0, zW, false);
            schlagschatten(g, F, B, n, werferTuerme);
            belichten(g, F, B, n, null, { ao: true, flut: Z.fertig ? STRAHLER : null });
          }, Object.assign({ name: name, leuchten: (g, F) => torLicht(g, F, Z) }, wandOpt));
          return f;
        };
        wandM([[-XM, YM, zW], [XM, YM, zW], [XM, YM, 0], [-XM, YM, 0]], Sfeld, [0, 1, 0], "m-feld");
        wandM([[XM, YS, zW], [-XM, YS, zW], [-XM, YS, 0], [XM, YS, 0]], Sstadt, [0, -1, 0], "m-stadt");
        /* schmale Seitenstücke zwischen Halbrund und Feldfront */
        for (const sx of [-1, 1]) {
          const pts = sx > 0 ? [[XM, YM, zW], [XM, YC, zW], [XM, YC, 0], [XM, YM, 0]] : [[-XM, YC, zW], [-XM, YM, zW], [-XM, YM, 0], [-XM, YC, 0]];
          const S0 = { el: [] };
          W.poly(pts, [0, YC, zW / 2], (g, F) => {
            wandMalen(g, F, Z, S0, sx > 0 ? 0 : 4, zW, false);
            schlagschatten(g, F, B, [sx, 0, 0], werferTuerme);
            belichten(g, F, B, [sx, 0, 0], null, { ao: true, flut: Z.fertig ? STRAHLER : null });
          }, Object.assign({ name: "m-seite" + sx }, wandOpt));
        }
        W.huelle([], [[[0, 0, 1], zW]]);
        {
          /* Mauerkrone; fertig: die Bleirinnen zwischen Dach und Türmen */
          const pts = mitteGrund.map((p) => [p[0], p[1], zW]);
          W.poly(pts, [0, 0, zW - 5], (g, F) => {
            if (zW < TRAUFE - 0.01 || Z.deck < 1) kroneMalen(g, F, Z, pts, [0, (YM + YS) / 2], 0.9);
            else { g.fillStyle = rgbS([96, 100, 104]); g.fillRect(-1, -1, F.w + 2, F.h + 2); if (Z.winter && Z.schnee > 0) { g.fillStyle = rgbS(SCHNEE, 0.9 * Z.schnee); g.fillRect(-1, -1, F.w + 2, F.h + 2); } }
            belichten(g, F, B, [0, 0, 1]);
          }, { name: "krone-m" });
        }
      }

      /* ---------- Staffelgiebel ---------- */
      const werferDach = werferTuerme.slice();
      if (Z.giebel > 0) {
        const zG = TRAUFE + (13.45 - TRAUFE) * Z.giebel;
        for (const seite of [1, -1]) {
          const y0 = seite > 0 ? YM : YS, y1 = y0 - seite * GIEBEL_T;
          giebelBauen(W, B, Z, seite, y0, y1, zG, STRAHLER, werferTuerme);
          if (Z.giebel >= 1) werferDach.push(W.akt.pts.slice());
        }
      }

      /* ---------- Dächer ---------- */
      if (Z.stuhl > 0) {
        for (const sx of [-1, 1]) kegelBauen(W, M, B, Z, sx, scher, STRAHLER, werferDach);
        mitteDachBauen(W, M, B, Z, STRAHLER, werferDach);
      }

      /* ---------- Nacht: Strahler und Lichtpfützen ---------- */
      if (Z.fertig) {
        for (const S of STRAHLER) {
          M.bodenlicht(S[0], S[1], 1.5, "255,196,128", 0.3);
          M.licht(S[0], S[1], 0.35, 0.55, "255,214,160", 0.55);
        }
        /* Laterne im Durchgang wirft Licht auf den Platz davor und dahinter */
        M.bodenlicht(0, YM + 1.2, 2.2, "255,190,120", 0.35);
        M.bodenlicht(0, YS - 1.2, 2.2, "255,190,120", 0.3);
      }

      W.ordnen();
      beschleunigen(M);
    }
  });

  /* =====================================================================
     AUFRISSE (Öffnungen je Wand, für den Ostturm; der Westturm gespiegelt)
     ===================================================================== */
  const ELEMENTE = {
    /* Feldseite, Halbrund: unten Kanonenscharten, darüber wenige kleine
       Fenster – die Wehrseite */
    arc(len) {
      const el = [], at = (t) => t * len;
      for (const t of [0.3, 0.52, 0.74]) el.push({ t: "scharte", a: at(t), z: 1.35, r: 0.2 });
      for (const t of [0.22, 0.46, 0.7, 0.9]) el.push({ t: "scharte", a: at(t), z: 4.35, r: 0.17 });
      for (const t of [0.34, 0.62]) el.push({ t: "fenster", a: at(t) - 0.24, z0: 5.95, z1: 6.85, w: 0.48 });
      for (const t of [0.2, 0.42, 0.64, 0.84]) el.push({ t: "fenster", a: at(t) - 0.2, z0: 8.2, z1: 8.75, w: 0.4 });
      return el;
    },
    flanke(len) {
      return [
        { t: "scharte", a: len * 0.5, z: 1.35, r: 0.2 },
        { t: "fenster", a: len * 0.5 - 0.3, z0: 4.0, z1: 4.8, w: 0.6 },
        { t: "fenster", a: len * 0.5 - 0.3, z0: 6.0, z1: 6.9, w: 0.6 },
        { t: "fenster", a: len * 0.5 - 0.25, z0: 8.15, z1: 8.75, w: 0.5 }
      ];
    },
    /* Stadtseite der Türme: je Geschoss drei Fenster in hohen Blenden */
    stadtTurm(len) {
      const el = [];
      for (const a of [1.15, 3.3, 5.45]) {
        el.push({ t: "fenster", a: a - 0.3, z0: 1.0, z1: 2.1, w: 0.6 });
        el.push({ t: "blende", a: a - 0.48, z0: 3.62, z1: 4.9, w: 0.96 });
        el.push({ t: "fenster", a: a - 0.34, z0: 3.8, z1: 4.75, w: 0.68 });
        el.push({ t: "blende", a: a - 0.48, z0: 5.8, z1: 7.0, w: 0.96 });
        el.push({ t: "fenster", a: a - 0.34, z0: 5.95, z1: 6.85, w: 0.68 });
        el.push({ t: "fenster", a: a - 0.3, z0: 8.15, z1: 8.8, w: 0.6 });
      }
      void len;
      return el;
    },
    mitteFeld() {
      const W = 2 * XM;
      return [
        { t: "tor", a: W / 2 - TOR_B / 2, w: TOR_B, z0: 0 },
        { t: "schrift", a: 0.2, z0: 4.28, z1: 4.72, w: W - 0.4, text: "CONCORDIA DOMI FORIS PAX" },
        { t: "fenster", a: W / 2 - 1.3, z0: 5.95, z1: 6.85, w: 0.55 },
        { t: "fenster", a: W / 2 + 0.75, z0: 5.95, z1: 6.85, w: 0.55 },
        { t: "fenster", a: W / 2 - 0.95, z0: 8.15, z1: 8.8, w: 0.5 },
        { t: "fenster", a: W / 2 - 0.25, z0: 8.15, z1: 8.9, w: 0.5 },
        { t: "fenster", a: W / 2 + 0.45, z0: 8.15, z1: 8.8, w: 0.5 }
      ];
    },
    mitteStadt() {
      const W = 2 * XM;
      return [
        { t: "tor", a: W / 2 - TOR_B / 2, w: TOR_B, z0: 0 },
        { t: "schrift", a: 0.9, z0: 4.3, z1: 4.7, w: W - 1.8, text: "S · P · Q · L" },
        { t: "blende", a: W / 2 - 1.45, z0: 5.8, z1: 7.0, w: 1.0 },
        { t: "fenster", a: W / 2 - 1.3, z0: 5.95, z1: 6.85, w: 0.7 },
        { t: "blende", a: W / 2 + 0.45, z0: 5.8, z1: 7.0, w: 1.0 },
        { t: "fenster", a: W / 2 + 0.6, z0: 5.95, z1: 6.85, w: 0.7 },
        { t: "fenster", a: W / 2 - 1.2, z0: 8.15, z1: 8.8, w: 0.55 },
        { t: "fenster", a: W / 2 - 0.275, z0: 8.15, z1: 8.9, w: 0.55 },
        { t: "fenster", a: W / 2 + 0.65, z0: 8.15, z1: 8.8, w: 0.55 }
      ];
    }
  };

  /* Licht im Durchgang (nachts): warmes Gewölbe, Lichtschein davor */
  function torLicht(g, F, Z) {
    if (!Z.fertig || !(F.nacht > 0)) return;
    const w = F.w, zTop = TRAUFE, x = w / 2 - TOR_B / 2, yU = zTop + 0.25, yK = zTop - TOR_K;
    g.save();
    g.beginPath(); spitzPfad(g, x, yK, TOR_B, yU, 0.72); g.clip();
    g.globalCompositeOperation = "lighter";
    const gr = g.createRadialGradient(x + TOR_B / 2, yK - 0.9, 0.05, x + TOR_B / 2, yK - 0.2, 2.2);
    gr.addColorStop(0, "rgba(255,210,150," + (0.85 * F.nacht).toFixed(3) + ")"); gr.addColorStop(0.4, "rgba(220,140,70," + (0.45 * F.nacht).toFixed(3) + ")"); gr.addColorStop(1, "rgba(120,60,20,0)");
    g.fillStyle = gr; g.fillRect(x - 1, yK - 3, TOR_B + 2, 6);
    g.restore();
    F.leuchtPunkt(w / 2, yK - 0.8, 1.6, "255,196,130", 0.45 * F.nacht);
  }

  /* Mauerkrone im Bau: frischer Mörtel auf dem Ring, innen der dunkle
     Raum mit den Balkenlagen */
  function kroneMalen(g, F, Z, pts, mitte, dicke) {
    const f = F.flaeche;
    const P = (p) => { const d = sub(p, f.o); return [dot(d, f.u), dot(d, f.v)]; };
    g.fillStyle = rgbS([170, 96, 70]); g.fillRect(-1, -1, F.w + 2, F.h + 2);
    if (F.px > 10) rausch(g, -1, -1, F.w + 2, F.h + 2, 0.6, 0.3, 5, true);
    /* Innenraum: Umriss nach innen versetzt */
    const inner = pts.map((p) => { const dx = p[0] - mitte[0], dy = p[1] - mitte[1], l = Math.hypot(dx, dy) || 1, k = Math.max(0.2, (l - dicke) / l); return [mitte[0] + dx * k, mitte[1] + dy * k, p[2]]; });
    g.fillStyle = rgbS([36, 28, 24]);
    g.beginPath(); inner.forEach((p, i) => { const q = P(p); if (i) g.lineTo(q[0], q[1]); else g.moveTo(q[0], q[1]); }); g.closePath(); g.fill();
    if (Z.winter) { g.fillStyle = "rgba(240,244,250,0.22)"; g.fillRect(-1, -1, F.w + 2, F.h + 2); }
  }

  /* Flächen der Baugrube nur innerhalb des Grubenrands malen (der Rand
     entlang der Blickrichtung auf die Ebene der Fläche projiziert) */
  function lochClip(g, F, e, Rg) {
    const [x0, y0, x1, y1] = Rg;
    const f = F.flaeche, n = nrm(kreuz(f.u, f.v)), en = dot(e, n);
    if (Math.abs(en) < 1e-4) return false;
    const q = [];
    for (const [x, y] of [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]) {
      const C = [x, y, 0], t = dot(sub(C, f.o), n) / en, P = sub(C, mul(e, t)), d = sub(P, f.o);
      q.push([dot(d, f.u), dot(d, f.v)]);
    }
    g.beginPath(); g.moveTo(q[0][0], q[0][1]); for (let i = 1; i < 4; i++) g.lineTo(q[i][0], q[i][1]); g.closePath(); g.clip();
    return true;
  }
  /* ---------- Baugrube ---------- */
  function grubeBauen(W, M, B, Z, Rg) {
    const T = Math.max(0.05, Z.tiefe), [x0, y0, x1, y1] = Rg, e = B.e;
    /* Flächen nur innerhalb des Grubenrands malen (entlang der Blickrichtung
       auf die Fläche projiziert) */
    const loch = (g, F) => lochClip(g, F, e, Rg);
    const erde = (g, F, saat) => {
      g.fillStyle = rgbS(ERDE); g.fillRect(-1, -1, F.w + 2, F.h + 2);
      if (F.px > 6) rausch(g, -1, -1, F.w + 2, F.h + 2, 1.0, 0.4, saat, true);
      /* Schichten: Mutterboden oben, darunter Lehm und Sand */
      g.fillStyle = "rgba(60,44,30,0.6)"; g.fillRect(-1, -1, F.w + 2, 0.36);
      g.fillStyle = "rgba(170,140,96,0.35)"; g.fillRect(-1, 0.7, F.w + 2, 0.25);
      if (Z.winter) { g.fillStyle = "rgba(236,240,248,0.35)"; g.fillRect(-1, -1, F.w + 2, F.h + 2); }
    };
    W.teil("grube", { fest: -30, schatten: false });
    const ex = { keinLicht: true };
    W.poly([[x0, y0, -T], [x1, y0, -T], [x1, y1, -T], [x0, y1, -T]], [0, 0, -T - 5], (g, F) => {
      g.save(); if (!loch(g, F)) { g.restore(); return; }
      g.fillStyle = rgbS([92, 72, 52]); g.fillRect(-1, -1, F.w + 2, F.h + 2);
      if (F.px > 6) rausch(g, -1, -1, F.w + 2, F.h + 2, 1.4, 0.35, 17, true);
      /* Wasser in der Sohle – der Grund ist nass */
      g.fillStyle = "rgba(70,84,96,0.4)"; g.beginPath(); g.ellipse(F.w * 0.3, F.h * 0.6, 2.2, 0.7, 0.3, 0, TAU); g.fill();
      if (Z.winter) { g.fillStyle = "rgba(236,240,248,0.18)"; g.fillRect(-1, -1, F.w + 2, F.h + 2); }
      belichten(g, F, B, [0, 0, 1]);
      g.restore();
    }, Object.assign({ name: "g-sohle" }, ex));
    const wand = (a, b, n, name, saat) => W.poly([[a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], -T], [a[0], a[1], -T]], [a[0] + n[0] * 5, a[1] + n[1] * 5, -T / 2], (g, F) => {
      g.save(); if (!loch(g, F)) { g.restore(); return; } erde(g, F, saat); belichten(g, F, B, mul([n[0], n[1], 0], -1)); g.restore();
    }, Object.assign({ name: name }, ex));
    wand([x0, y0], [x1, y0], [0, -1], "g-n", 3);
    wand([x1, y1], [x0, y1], [0, 1], "g-s", 4);
    wand([x1, y0], [x1, y1], [1, 0], "g-o", 5);
    wand([x0, y1], [x0, y0], [-1, 0], "g-w", 6);
    /* Aushub neben der Grube */
    W.teil("aushub", { fest: -29 });
    const k = glatt(Z.tiefe / 1.3);
    M.figur({ x: x0 - 1.8, y: y1 - 1, z: 0, breite: 5, hoehe: 1.8, malen: haufen(k, Z.winter) });
    M.figur({ x: x1 + 1.8, y: y0 + 1.5, z: 0, breite: 4, hoehe: 1.5, malen: haufen(k * 0.8, Z.winter) });
  }
  function haufen(k, winter) {
    return function (g, s, F) {
      const b = 2.2 * s * Math.cbrt(Math.max(0.05, k)), h = 1.3 * s * KZ * Math.cbrt(Math.max(0.05, k));
      g.beginPath(); g.moveTo(-b, 0); g.bezierCurveTo(-b * 0.6, -h * 0.9, b * 0.4, -h * 1.1, b, 0); g.closePath();
      if (F.schatten) { g.fillStyle = "#000"; g.fill(); return; }
      const lf = ST.lichtFaktor([0, 0, 1], F.Z, 0, F.jahr);
      const gr = g.createLinearGradient(-b, -h, b, 0);
      gr.addColorStop(0, rgbS([150 * lf[0], 116 * lf[1], 80 * lf[2]])); gr.addColorStop(1, rgbS([90 * lf[0], 68 * lf[1], 46 * lf[2]]));
      g.fillStyle = gr; g.fill();
      if (winter) { g.fillStyle = rgbS([244 * lf[0], 247 * lf[1], 252 * lf[2]], 0.9); g.beginPath(); g.moveTo(-b * 0.6, -h * 0.55); g.bezierCurveTo(-b * 0.3, -h * 1.0, b * 0.3, -h * 1.05, b * 0.6, -h * 0.5); g.bezierCurveTo(b * 0.2, -h * 0.7, -b * 0.2, -h * 0.72, -b * 0.6, -h * 0.55); g.fill(); }
    };
  }
  /* Pfähle und Schwellrost in der Grube */
  function stabwerkGrube(W, M, Z) {
    const T = Z.tiefe, st = [];
    const pf = [];
    for (let x = -8.6; x <= 8.61; x += 0.95) for (let y = -3.3; y <= 3.31; y += 0.95) {
      const tt = Math.abs(x) > XM ? Math.hypot(Math.abs(x) - XC, Math.max(0, y - YC)) <= R + 0.1 : y <= YM + 0.1;
      if (tt) pf.push([x, y]);
    }
    const n = Math.round(pf.length * Z.pfaehle);
    for (let i = 0; i < n; i++) {
      const [x, y] = pf[i];
      /* die zuletzt gerammten ragen noch hoch heraus */
      const hoch = i > n - 4 && Z.pfaehle < 1 ? 1.4 : 0.15;
      st.push([[x, y, -T], [x, y, -T + hoch], 0.14, [120, 92, 60]]);
    }
    if (Z.rost > 0) {
      const zr = -T + 0.2;
      const nx = Math.round(15 * Z.rost);
      for (let i = 0; i < nx; i++) { const y = -3.3 + i * 0.475; if (y > 3.4) break; st.push([[-8.8, y, zr], [8.8, y, zr], 0.16, [110, 84, 56], true]); }
      if (Z.rost > 0.5) for (let x = -8.6; x <= 8.61; x += 0.95) st.push([[x, -3.4, zr + 0.14], [x, 3.4, zr + 0.14], 0.14, [128, 98, 64], true]);
    }
    if (!st.length) return;
    W.teil("pfaehle", { fest: -25, schatten: false });
    M.figur({ x: 0, y: 0, z: 0, breite: 26, hoehe: 3, schatten: false, malen: stabwerk(st, [0, 0, 0]) });
  }
  function fundamentBauen(W, Z, B, grundrisse, z0, z1, Rg) {
    if (z1 - z0 < 0.02) return;
    W.teil("fundament", { fest: -20, schatten: false });
    for (const G of grundrisse) {
      const n = G.length;
      let mx = 0, my = 0; for (const p of G) { mx += p[0]; my += p[1]; } mx /= n; my /= n;
      for (let i = 0; i < n; i++) {
        const a = G[i], b = G[(i + 1) % n];
        W.poly([[a[0], a[1], z1], [b[0], b[1], z1], [b[0], b[1], z0], [a[0], a[1], z0]], [mx, my, (z0 + z1) / 2], (g, F) => {
          g.save(); if (!lochClip(g, F, B.e, Rg)) { g.restore(); return; }
          mauerwerk(g, F, "fund", -0.2, -0.2, F.w + 0.4, F.h + 0.4, i * 0.7, z1);
          belichten(g, F, B, nrm(kreuz(F.flaeche.u, F.flaeche.v)));
          g.restore();
        }, { name: "fu" + i });
      }
      W.poly(G.map((p) => [p[0], p[1], z1]), [mx, my, z1 - 3], (g, F) => {
        g.fillStyle = rgbS([150, 140, 124]); g.fillRect(-1, -1, F.w + 2, F.h + 2);
        if (F.px > 8) rausch(g, -1, -1, F.w + 2, F.h + 2, 0.7, 0.35, 23, true);
        belichten(g, F, B, [0, 0, 1]);
      }, { name: "fu-o" });
    }
  }

  /* ---------- Staffelgiebel ---------- */
  function giebelBauen(W, B, Z, seite, y0, y1, zG, STRAHLER, werfer) {
    /* Umriss (x, z) von links nach rechts, von der Feldseite gesehen */
    const stufen = [[-XM, TRAUFE], [-XM, 10.55], [-1.72, 10.55], [-1.72, 11.3], [-1.15, 11.3], [-1.15, 12.05], [-0.6, 12.05], [-0.6, 12.8], [-0.3, 12.8], [-0.3, 13.45]];
    const um = stufen.concat(stufen.slice().reverse().map(([x, z]) => [-x, z]));
    /* auf die Bauhöhe kappen */
    const um3 = (y) => kappeZ(um.map(([x, z]) => [x, y, z]), zG);
    const P0 = um3(y0), P1 = um3(y1);
    if (P0.length < 3) return;
    W.teil("giebel" + seite);
    const n = [0, seite, 0];
    const mitte = [0, (y0 + y1) / 2, TRAUFE + 1];
    const aufriss = { el: [] };
    /* weiße Blendnischen: fünf, die mittlere am höchsten */
    for (const [x, z1] of [[-1.62, 10.3], [-1.02, 11.1], [-0.28, 11.85], [0.46, 11.1], [1.06, 10.3]]) aufriss.el.push({ t: "blende", a: x + XM, z0: TRAUFE + 0.2, z1: z1, w: 0.56, stich: 0.7 });
    if (seite < 0) aufriss.el.push({ t: "fenster", a: XM - 0.2, z0: 10.2, z1: 10.75, w: 0.4 });
    const vorn = (g, F) => {
      const aL = seite > 0 ? 0 : 0;
      const zTop = F.flaeche.o[2];
      wandMalen(g, F, Z, aufriss, aL, zTop, false, true);
      schlagschatten(g, F, B, n, werfer);
      belichten(g, F, B, n, null, { flut: Z.fertig ? STRAHLER : null });
    };
    W.poly(P0, mitte, vorn, { name: "gv" + seite });
    W.poly(P1, mitte, (g, F) => { mauerwerk(g, F, "rot", -0.2, -0.2, F.w + 0.4, F.h + 0.4, 0, F.flaeche.o[2]); belichten(g, F, B, [0, -seite, 0]); }, { name: "gh" + seite });
    /* Stufen: Abdeckungen oben (glasiert, im Winter Schnee) und Seiten */
    const N = P0.length;
    for (let i = 0; i < N; i++) {
      const a0 = P0[i], a1 = P0[(i + 1) % N], b0 = P1[i], b1 = P1[(i + 1) % N];
      if (!b0 || !b1) continue;
      const waag = Math.abs(a0[2] - a1[2]) < 1e-4, senk = Math.abs(a0[0] - a1[0]) < 1e-4;
      if (waag && a0[2] <= TRAUFE + 1e-3) continue;
      const pts = [a0, a1, b1, b0];
      const nn = waag ? [0, 0, 1] : senk ? [Math.sign(a0[0] - 0) * (a0[2] > a1[2] ? 1 : 1), 0, 0] : [0, 0, 1];
      W.poly(pts, mitte, (g, F) => {
        const oben = F.flaeche.v[2] === 0 || Math.abs(nrm(kreuz(F.flaeche.u, F.flaeche.v))[2]) > 0.9;
        if (oben) {
          g.fillStyle = rgbS([60, 52, 46]); g.fillRect(-1, -1, F.w + 2, F.h + 2);
          if (Z.winter && Z.schnee > 0) { g.fillStyle = rgbS(SCHNEE, 0.95 * Z.schnee); g.fillRect(-1, -1, F.w + 2, F.h + 2); }
        } else mauerwerk(g, F, "rot", -0.2, -0.2, F.w + 0.4, F.h + 0.4, 1.3 * i, F.flaeche.o[2]);
        const nf = nrm(kreuz(F.flaeche.u, F.flaeche.v));
        belichten(g, F, B, nf, null, { flut: Z.fertig ? STRAHLER : null, flutK: 0.8 });
      }, { name: "gs" + seite + "_" + i });
      void nn;
    }
  }

  /* ---------- Kegeldach eines Turms ---------- */
  function kegelBauen(W, M, B, Z, sx, scher, STRAHLER, werfer) {
    const zE = TRAUFE - 0.03, H = Z_SPITZE - zE;
    const G = [];
    for (let i = 0; i <= NF; i++) { const th = (180 - i * 180 / NF) * RAD; G.push([sx * XC + Math.cos(th) * (R + UE), YC + Math.sin(th) * (R + UE), zE]); }
    G.push([sx * XC + R + UE, YS - UE, zE]); G.push([sx * XC - R - UE, YS - UE, zE]);
    const A = [sx * XC, YC, Z_SPITZE], As = scher(A);
    const Gs = G;
    const zDeck = zE + H * Z.deck;
    const alpha = Math.atan2(H, R + UE);
    /* Deckung (von der Traufe bis zDeck) */
    if (Z.deck > 0) {
      W.teil("kegel" + sx);
      const n = Gs.length;
      for (let i = 0; i < n; i++) {
        const a = Gs[i], b = Gs[(i + 1) % n];
        let pts = [A, a, b];
        if (Z.deck < 1) pts = kappeZ(pts, zDeck);
        if (pts.length < 3) continue;
        let nL, nR;
        if (i < NF) {
          const t0 = (180 - i * 180 / NF) * RAD, t1 = (180 - (i + 1) * 180 / NF) * RAD;
          nL = [Math.cos(t0) * Math.sin(alpha), Math.sin(t0) * Math.sin(alpha), Math.cos(alpha)];
          nR = [Math.cos(t1) * Math.sin(alpha), Math.sin(t1) * Math.sin(alpha), Math.cos(alpha)];
        } else {
          nL = nrm(kreuz(sub(b, a), sub(A, a))); if (nL[2] < 0) nL = mul(nL, -1); nR = null;
        }
        const lenArc = (R + UE) * Math.PI;
        const aL = i < NF ? i * lenArc / NF : 0;
        const info = { nL: nL, nR: nR, aL: aL };
        W.poly(pts, [sx * XC, YC - 0.5, zE + 1], (g, F) => {
          /* Reihen laufen in gleichem Abstand von der Traufe um den ganzen Helm */
          const f = F.flaeche, zTopF = f.o[2];
          const yOff = (Z_SPITZE - zTopF) / Math.sin(alpha);
          schiefer(g, F, Z, F.w, F.h, info.aL, yOff);
          schlagschatten(g, F, B, nrm(kreuz(f.u, f.v)), werfer.filter((_, j) => j !== (sx > 0 ? 1 : 0)));
          belichten(g, F, B, info.nL, info.nR, { flut: Z.fertig ? STRAHLER : null, flutK: 0.6 });
        }, { name: "k" + sx + "_" + i });
      }
      /* Traufkante (Kastenrinne) */
    }
    /* Dachstuhl über der Deckung */
    if (Z.deck < 1) {
      const st = [];
      const nS = Math.round(16 * glatt(Z.stuhl / 0.8));
      const col = [138, 104, 68];
      st.push([scher([sx * XC, YC, TRAUFE]), As, 0.22, col]);    // Kaiserstiel
      for (let i = 0; i < nS; i++) {
        const th = i / 16 * TAU;
        let p = [sx * XC + Math.cos(th) * R, YC + Math.sin(th) * R, TRAUFE];
        if (p[1] < YS) p = [p[0], YS + 0.1, TRAUFE];
        let a = scher(p), b = As;
        if (Z.deck > 0) { const t = (zDeck - a[2]) / (b[2] - a[2]); a = add(a, mul(sub(b, a), t)); }
        st.push([a, b, 0.14, col, true]);
      }
      if (Z.stuhl > 0.8) for (let k = 1; k <= 3; k++) {
        const zr = TRAUFE + H * k / 4; if (zr < zDeck) continue;
        const rr = (R) * (1 - k / 4);
        for (let i = 0; i < 16; i++) { const t0 = i / 16 * TAU, t1 = (i + 1) / 16 * TAU; st.push([scher([sx * XC + Math.cos(t0) * rr, YC + Math.sin(t0) * rr, zr]), scher([sx * XC + Math.cos(t1) * rr, YC + Math.sin(t1) * rr, zr]), 0.1, col]); }
      }
      W.teil("stuhl" + sx);
      const pts = []; for (const s of st) pts.push(s[0], s[1]);
      W.huelle(pts, [[[0, 0, -1], -Math.max(TRAUFE, zDeck)]]);
      M.figur({ x: sx * XC, y: YC, z: 0, breite: 8, hoehe: Z_SPITZE + 1, schatten: false, malen: stabwerk(st, [sx * XC, YC, 0]) });
    } else if (Z.knauf) {
      /* Knauf und Stange auf der Spitze */
      W.teil("knauf" + sx);
      W.huelle([As, add(As, [0, 0, 1.1])], [[[0, 0, -1], -Z_SPITZE + 0.3]]);
      M.figur({ x: As[0], y: As[1], z: As[2] - 0.2, breite: 0.6, hoehe: 1.4, schatten: false, malen: knauf(Z) });
    }
  }
  function knauf(Z) {
    return function (g, s, F) {
      if (F.schatten) return;
      const lf = ST.lichtFaktor([-0.4, 0.3, 0.8], F.Z, 0, F.jahr);
      const c = (k) => rgbS([k[0] * lf[0], k[1] * lf[1], k[2] * lf[2]]);
      const y0 = 0, st = 1.2 * KZ * s;
      g.strokeStyle = c([46, 44, 42]); g.lineWidth = Math.max(0.8, 0.05 * s);
      g.beginPath(); g.moveTo(0, y0); g.lineTo(0, y0 - st); g.stroke();
      const r = Math.max(1, 0.11 * s);
      const gr = g.createRadialGradient(-r * 0.4, -0.55 * KZ * s - r * 0.4, 0, 0, -0.55 * KZ * s, r);
      gr.addColorStop(0, c([250, 214, 120])); gr.addColorStop(1, c([150, 104, 40]));
      g.fillStyle = gr; g.beginPath(); g.arc(0, -0.55 * KZ * s, r, 0, TAU); g.fill();
      if (s > 20) {
        /* Wetterfahne */
        g.fillStyle = c([60, 58, 54]);
        g.beginPath(); g.moveTo(0, y0 - st * 0.95); g.lineTo(0.32 * s, y0 - st * 0.9); g.lineTo(0.3 * s, y0 - st * 0.78); g.lineTo(0, y0 - st * 0.8); g.closePath(); g.fill();
      }
      if (Z.winter && Z.schnee > 0) { g.fillStyle = rgbS(SCHNEE, 0.9); g.beginPath(); g.ellipse(0, -0.55 * KZ * s - r * 0.75, r * 0.8, r * 0.35, 0, Math.PI, TAU); g.fill(); }
    };
  }

  /* ---------- Satteldach des Mittelbaus (First quer zur Front) ---------- */
  function mitteDachBauen(W, M, B, Z, STRAHLER, werfer) {
    const scher = W.scher;
    const yA = YM - GIEBEL_T, yB = YS + GIEBEL_T, zE = TRAUFE + 0.02, xE = XM - 0.2;
    const zD = zE + (Z_FIRST - zE) * Z.deck;
    if (Z.deck > 0) {
      W.teil("mdach");
      for (const sx of [-1, 1]) {
        let pts = sx > 0 ? [[0, yA, Z_FIRST], [0, yB, Z_FIRST], [xE, yB, zE], [xE, yA, zE]] : [[0, yB, Z_FIRST], [0, yA, Z_FIRST], [-xE, yA, zE], [-xE, yB, zE]];
        if (Z.deck < 1) pts = kappeZ(pts, zD);
        if (pts.length < 3) continue;
        const n = nrm([sx * (Z_FIRST - zE), 0, xE]);
        W.poly(pts, [0, (yA + yB) / 2, zE - 3], (g, F) => {
          const yOff = (Z_FIRST - F.flaeche.o[2]) / (n[2] || 1) * 0 + (Z_FIRST - F.flaeche.o[2]) * Math.hypot(xE, Z_FIRST - zE) / (Z_FIRST - zE);
          schiefer(g, F, Z, F.w, F.h, 0, yOff);
          schlagschatten(g, F, B, n, werfer);
          belichten(g, F, B, n, null, { flut: Z.fertig ? STRAHLER : null, flutK: 0.45 });
        }, { name: "md" + sx });
      }
    }
    if (Z.deck < 1) {
      const st = [], col = [138, 104, 68];
      const nP = Math.round(8 * glatt(Z.stuhl));
      for (let i = 0; i < nP; i++) {
        const y = yA - 0.2 - i * (yA - yB - 0.4) / 7;
        for (const sx of [-1, 1]) {
          let a = [sx * xE, y, zE];
          if (zD > zE) { const t = (zD - zE) / (Z_FIRST - zE); a = [sx * xE * (1 - t), y, zD]; }
          st.push([a, [0, y, Z_FIRST], 0.12, col, true]);
        }
      }
      if (Z.stuhl > 0.6) st.push([[0, yA, Z_FIRST - 0.08], [0, yB, Z_FIRST - 0.08], 0.14, col]);
      if (!st.length) return;
      for (const s of st) { s[0] = scher(s[0]); s[1] = scher(s[1]); }
      W.teil("mstuhl");
      const pts = []; for (const s of st) pts.push(s[0], s[1]);
      W.huelle(pts, [[[0, 0, -1], -Math.max(TRAUFE, zD)]]);
      M.figur({ x: 0, y: (yA + yB) / 2, z: 0, breite: 6, hoehe: Z_FIRST + 0.5, schatten: false, malen: stabwerk(st, [0, (yA + yB) / 2, 0]) });
    }
  }
})();
