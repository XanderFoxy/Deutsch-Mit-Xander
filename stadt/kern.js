/* =====================================================================
   BAUKASTEN-STADT — DER KERN
   ---------------------------------------------------------------------
   XANDER: „Ich möchte, dass du vom allerfeinsten als Mega Produktdesigner
   unser ganzes Spielkonzept vom Aufbau her … dass wir uns selber eine
   Stadt bauen können … erst mal in einer separaten Oberfläche … mit
   Häusern, die man drehen kann … Man soll sie in jedem Winkel aufstellen
   können. Man soll das Fundament sehen beim Aufbauen."

   WARUM EIN ECHTES 3D-GERÜST STATT FERTIGER BILDER
   Ein gemaltes Haus kann man nicht drehen, nicht Stein für Stein
   entstehen lassen und nicht im Winter anders beleuchten. Deshalb ist
   jedes Gebäude hier ein kleines Modell aus Flächen im Raum (Meter).
   Jede Wand wird in ihrem EIGENEN flachen Koordinatensystem gemalt –
   Mörtelfugen, Fachwerkbalken, Klingel, Hausnummer – und dann mit einer
   affinen Abbildung genau so auf das Bild gelegt, wie man die Wand aus
   dem Blickwinkel sieht. Dadurch:
     • drehen in jedem Winkel (nicht nur spiegeln) – Licht und Schatten
       stimmen immer, weil jede Fläche ihre Richtung kennt,
     • Vektor bis in die feinste Stufe: es wird bei jeder Zoomstufe neu
       gemalt, nie ein Bild vergrößert → keine Pixelkanten,
     • Bauphasen: das Modell bekommt „bau" (0…1) und malt nur, was
       schon steht – Grube, Sockel, Balken, Dach, Fenster.

   KOORDINATEN
     Welt in Metern: x nach Osten, y nach Süden, z nach oben.
     Kamera: orthografisch, 45° gedreht, 30° von oben (2:1 wie in
     klassischen Aufbauspielen). Die Kamera lässt sich in 90°-Schritten
     drehen. Licht kommt immer von links oben (Kameraraum), damit jedes
     Haus gut aussieht, egal wie man die Karte dreht.
   ===================================================================== */
(function () {
  "use strict";
  const ST = (window.STADT = window.STADT || {});
  ST.MODELLE = ST.MODELLE || {};

  /* ---------------- Grundmaße der Abbildung ---------------- */
  const KX = Math.SQRT1_2;            // Bildbreite je Meter entlang (a−b)
  const KY = Math.SQRT1_2 * 0.5;      // Bildhöhe je Meter entlang (a+b)
  const KZ = Math.sqrt(3) / 2;        // Bildhöhe je Meter Höhe
  const ZUM_AUGE = [KZ * Math.SQRT1_2, KZ * Math.SQRT1_2, 0.5];   // Richtung zum Betrachter
  ST.KX = KX; ST.KY = KY; ST.KZ = KZ; ST.ZUM_AUGE = ZUM_AUGE;

  /* Licht im Kameraraum: tiefe Wintersonne von links oben. Die linke
     (dem Betrachter links zugewandte) Seite ist hell, die rechte liegt im
     Schatten; Schatten fallen nach rechts hinten – sie verdecken so
     nichts von der Vorderseite. */
  function norm(v) { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; }
  ST.norm = norm;
  const LICHT = norm([-0.42, 0.74, 0.66]);
  ST.LICHT = LICHT;

  /* ---------------- Zufall und Rauschen ---------------- */
  function zufall(seed) {
    let s = (seed >>> 0) || 1;
    return function () {
      s = (s + 0x6D2B79F5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function hash2(x, y, s) {
    let h = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(s | 0, 2147483647);
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  }
  function rausch(x, y, s) {
    const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
    const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    const a = hash2(xi, yi, s), b = hash2(xi + 1, yi, s), c = hash2(xi, yi + 1, s), d = hash2(xi + 1, yi + 1, s);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  }
  function fbm(x, y, okt, s) {
    let sum = 0, amp = 0.5, f = 1, n = 0;
    for (let i = 0; i < okt; i++) { sum += amp * rausch(x * f, y * f, s + i * 17); n += amp; amp *= 0.5; f *= 2.03; }
    return sum / n;
  }
  ST.zufall = zufall; ST.hash2 = hash2; ST.rausch = rausch; ST.fbm = fbm;
  ST.textHash = function (t) { let h = 2166136261; for (let i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };

  /* ---------------- Tageszeiten ----------------
     amb  = Himmelslicht (trifft jede Fläche)
     sonne= direktes Licht (× Winkel zur Sonne)
     nacht= wie stark Fenster/Laternen leuchten (0…1) */
  ST.ZEITEN = {
    tag:   { name: "Tag",        amb: [0.64, 0.68, 0.78], sonne: [0.40, 0.36, 0.28], nacht: 0,    schatten: 0.34, himmel: ["#bcd3ea", "#e9f1f8"] },
    abend: { name: "Dämmerung",  amb: [0.42, 0.50, 0.66], sonne: [0.27, 0.22, 0.17], nacht: 0.75, schatten: 0.26, himmel: ["#2b3b66", "#e7a27a"] },
    nacht: { name: "Nacht",      amb: [0.20, 0.24, 0.40], sonne: [0.06, 0.07, 0.12], nacht: 1,    schatten: 0.18, himmel: ["#0b1330", "#1d2b55"] }
  };

  /* ---------------- Kamera ---------------- */
  const kam = (ST.kamera = { x: 0, y: 0, s: 40, dreh: 0, W: 800, H: 600, dpr: 1 });
  /* Welt → Kameraraum (gedreht, um die Kameramitte) */
  function drehXY(x, y, d) {
    switch (d & 3) { case 1: return [-y, x]; case 2: return [-x, -y]; case 3: return [y, -x]; default: return [x, y]; }
  }
  ST.drehXY = drehXY;
  /* Welt → Bild (Gerätepixel) */
  ST.proj = function (x, y, z) {
    const r = drehXY(x - kam.x, y - kam.y, kam.dreh);
    return [kam.W / 2 + (r[0] - r[1]) * KX * kam.s, kam.H / 2 + (r[0] + r[1]) * KY * kam.s - (z || 0) * KZ * kam.s];
  };
  /* Bild → Boden (z = 0) */
  ST.aufBoden = function (px, py) {
    const u = (px - kam.W / 2) / (KX * kam.s), v = (py - kam.H / 2) / (KY * kam.s);
    const a = (u + v) / 2, b = (v - u) / 2;
    const w = drehXY(a, b, (4 - (kam.dreh & 3)) & 3);
    return [w[0] + kam.x, w[1] + kam.y];
  };

  /* =====================================================================
     DER BAUER — sammelt die Flächen eines Modells
     ===================================================================== */
  function Bauer(o) {
    this.o = o; this.teile = []; this.akt = null; this.lichter = []; this.rauch = []; this.leben = [];
    this.teil("rumpf");
  }
  Bauer.prototype.teil = function (name, opt) {
    this.akt = { name: name, flaechen: [], figuren: [], ebene: (opt && opt.ebene) || 0, schatten: !(opt && opt.schatten === false), mitte: opt && opt.mitte };
    this.teile.push(this.akt);
    return this.akt;
  };
  /* Eine ebene Fläche: o = linke obere Ecke (von außen gesehen),
     u = Richtung „nach rechts", v = Richtung „nach unten" (Einheitsvektoren),
     w/h = Größe in Metern, umriss = Vieleck in Flächen-Koordinaten. */
  Bauer.prototype.flaeche = function (f) {
    f.u = norm(f.u); f.v = norm(f.v);
    if (!f.umriss) f.umriss = [[0, 0], [f.w, 0], [f.w, f.h], [0, f.h]];
    this.akt.flaechen.push(f);
    return f;
  };
  /* Quader: x,y,z = Ecke mit kleinsten Werten, b (x), t (y), h (z).
     m = { sued, nord, ost, west, oben } → Malfunktionen oder Farben. */
  Bauer.prototype.quader = function (q, m, opt) {
    const x0 = q.x, y0 = q.y, z0 = q.z || 0, x1 = q.x + q.b, y1 = q.y + q.t, z1 = z0 + q.h;
    const ao = z0 <= 0.05;
    const f = (name, o, u, w) => {
      if (m[name] === undefined || m[name] === null) return;
      this.flaeche(Object.assign({ name: name, o: o, u: u, v: [0, 0, -1], w: w, h: q.h, malen: m[name], ao: ao, z0: z0 }, opt || {}));
    };
    f("sued", [x0, y1, z1], [1, 0, 0], q.b);
    f("nord", [x1, y0, z1], [-1, 0, 0], q.b);
    f("ost", [x1, y1, z1], [0, -1, 0], q.t);
    f("west", [x0, y0, z1], [0, 1, 0], q.t);
    if (m.oben !== undefined && m.oben !== null) this.flaeche({ name: "oben", o: [x0, y0, z1], u: [1, 0, 0], v: [0, 1, 0], w: q.b, h: q.t, malen: m.oben });
  };
  /* Figur: ein aufrecht gemaltes Ding (Baum, Mensch, Laterne) — wird im
     Bild immer aufrecht gezeigt. malen(g, s, F) zeichnet mit Ursprung am
     Fußpunkt, s = Pixel je Meter, y nach oben NEGATIV (wie im Bild). */
  Bauer.prototype.figur = function (fi) {
    fi.z = fi.z || 0; this.akt.figuren.push(fi); return fi;
  };
  Bauer.prototype.licht = function (x, y, z, r, farbe, staerke) { this.lichter.push({ p: [x, y, z], r: r, farbe: farbe || "255,196,120", k: staerke == null ? 1 : staerke }); };
  Bauer.prototype.rauchAus = function (x, y, z, staerke) { this.rauch.push({ p: [x, y, z], k: staerke || 1 }); };
  Bauer.prototype.lebendig = function (fn) { this.leben.push(fn); };

  /* ---------------- Werkzeuge für Modelle ---------------- */
  /* Satteldach mit First entlang x (vor dem Drehen). Liefert die Höhen,
     damit Giebelwände dazu passen. d = { x, y, b, t, z (Traufe), hf (Firsthöhe
     über Traufe), ueT (Überstand Traufe), ueG (Überstand Giebel), dicke } */
  Bauer.prototype.satteldach = function (d, malS, malN, opt) {
    const xm0 = d.x - d.ueG, xm1 = d.x + d.b + d.ueG, ym = d.y + d.t / 2, zt = d.z + d.hf;
    const halb = d.t / 2, neig = d.hf / halb;
    const yE1 = d.y + d.t + d.ueT, yE0 = d.y - d.ueT, zE = d.z - d.ueT * neig;
    const lang = Math.hypot(halb + d.ueT, d.hf + d.ueT * neig);
    const dicke = d.dicke == null ? 0.22 : d.dicke;
    const o = opt || {};
    const S = this.flaeche(Object.assign({ name: "dach-sued", o: [xm0, ym, zt], u: [1, 0, 0], v: [0, yE1 - ym, zE - zt], w: xm1 - xm0, h: lang, malen: malS, dach: true }, o));
    const N = this.flaeche(Object.assign({ name: "dach-nord", o: [xm1, ym, zt], u: [-1, 0, 0], v: [0, yE0 - ym, zE - zt], w: xm1 - xm0, h: lang, malen: malN || malS, dach: true }, o));
    /* Dachkanten: Stirnbrett an der Traufe und Ortgang an den Giebeln */
    const kante = o.kante || "#5a3a24";
    this.flaeche({ name: "traufe-sued", o: [xm0, yE1, zE], u: [1, 0, 0], v: [0, 0, -1], w: xm1 - xm0, h: dicke, malen: o.traufeMalen || kante, keinAo: true });
    this.flaeche({ name: "traufe-nord", o: [xm1, yE0, zE], u: [-1, 0, 0], v: [0, 0, -1], w: xm1 - xm0, h: dicke, malen: o.traufeMalen || kante, keinAo: true });
    const ort = (x, u, name, links) => {
      /* Ortgang: schmale Leiste entlang beider Dachschrägen an der Giebelseite */
      const pS = [x, yE1, zE], pT = [x, ym, zt], pN = [x, yE0, zE];
      const a = links ? pN : pS, b = links ? pS : pN;
      const w = Math.hypot(b[1] - a[1], 0);
      this.flaeche({
        name: name, o: [x, a[1], zt], u: [0, Math.sign(b[1] - a[1]), 0], v: [0, 0, -1], w: w, h: d.hf + d.ueT * neig + dicke,
        umriss: [[0, zt - a[2]], [w / 2, 0], [w, zt - b[2]], [w, zt - b[2] + dicke], [w / 2, dicke * 1.15], [0, zt - a[2] + dicke]],
        malen: o.ortMalen || kante, keinAo: true
      });
      void pT;
    };
    ort(xm1, [0, -1, 0], "ort-ost", false);
    ort(xm0, [0, 1, 0], "ort-west", true);
    return { S: S, N: N, zt: zt, neig: neig, zE: zE, yE0: yE0, yE1: yE1, xm0: xm0, xm1: xm1, lang: lang };
  };
  /* Höhe der Dachfläche über Punkt (x,y) eines Satteldachs (für Gauben, Kamine) */
  ST.dachHoehe = function (d, y) {
    const ym = d.y + d.t / 2; return d.z + d.hf - Math.abs(y - ym) * (d.hf / (d.t / 2));
  };

  /* =====================================================================
     FLÄCHEN MALEN — affin ins Bild, dann Licht darüber
     ===================================================================== */
  function kreuz(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function punkt(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  ST.kreuz = kreuz; ST.punkt = punkt;

  /* Drehen eines Modellpunkts um die senkrechte Achse (Grad) */
  function drehP(p, c, s) { return [p[0] * c - p[1] * s, p[0] * s + p[1] * c, p[2]]; }

  function farbeMal(farbe) { return function (g, F) { g.fillStyle = farbe; g.fillRect(-1, -1, F.w + 2, F.h + 2); }; }

  /* Licht auf einer Fläche: Faktor je Farbkanal (0…1) */
  function lichtFaktor(n, Z, extra, jahr) {
    const k = Math.max(0, punkt(n, LICHT));
    const amb = Z.amb, so = Z.sonne;
    /* Himmelslicht: nach oben zeigende Flächen bekommen mehr davon */
    const oben = 0.82 + 0.18 * Math.max(0, n[2]);
    /* Licht vom Boden zurück: Schnee hellt Schattenseiten deutlich auf,
       Wiese nur ein wenig (und grünlich) */
    const seit = Math.max(0, 1 - Math.abs(n[2]) - Math.max(0, n[2]) * 0.5);
    const hell = (Z.amb[1] + Z.sonne[1] * 0.6);
    const rueck = jahr === "winter" ? [0.20, 0.21, 0.23] : [0.08, 0.10, 0.06];
    return [0, 1, 2].map((i) => Math.min(1, amb[i] * oben + so[i] * k * 1.35 + rueck[i] * seit * hell + (extra || 0)));
  }
  ST.lichtFaktor = lichtFaktor;

  /* Vieleck um d nach außen versetzen (Gehrung, begrenzt) */
  function aufblasen(poly, d) {
    const n = poly.length;
    if (n < 3 || !(d > 0)) return poly;
    let fl = 0;
    for (let i = 0; i < n; i++) { const a = poly[i], b = poly[(i + 1) % n]; fl += a[0] * b[1] - b[0] * a[1]; }
    const sg = fl > 0 ? 1 : -1;     // Umlaufsinn
    const aus = [];
    for (let i = 0; i < n; i++) {
      const p = poly[(i + n - 1) % n], c = poly[i], q = poly[(i + 1) % n];
      let e1x = c[0] - p[0], e1y = c[1] - p[1], e2x = q[0] - c[0], e2y = q[1] - c[1];
      const l1 = Math.hypot(e1x, e1y) || 1, l2 = Math.hypot(e2x, e2y) || 1;
      e1x /= l1; e1y /= l1; e2x /= l2; e2y /= l2;
      /* Außennormale (y nach unten, Umlaufsinn beachten) */
      const n1x = e1y * sg, n1y = -e1x * sg, n2x = e2y * sg, n2y = -e2x * sg;
      let mx = n1x + n2x, my = n1y + n2y;
      const ml = Math.hypot(mx, my);
      if (ml < 1e-6) { aus.push([c[0] + n1x * d, c[1] + n1y * d]); continue; }
      mx /= ml; my /= ml;
      const cosh = mx * n1x + my * n1y;
      const k = Math.min(3, 1 / Math.max(0.2, cosh));
      aus.push([c[0] + mx * d * k, c[1] + my * d * k]);
    }
    return aus;
  }
  ST.aufblasen = aufblasen;

  /* Eine Fläche in einen Zeichenkontext malen.
     T = { s (Pixel/m), ox, oy (Bildpunkt des Modell-Ursprungs), c, sn (Drehung) } */
  function flaecheZeichnen(g, f, T, P, pass) {
    const o = drehP(f.o, T.c, T.sn), u = drehP(f.u, T.c, T.sn), v = drehP(f.v, T.c, T.sn);
    const n = kreuz(u, v);
    const sicht = punkt(n, ZUM_AUGE);
    if (sicht <= 0.002 && !f.beidseitig) return false;
    const s = T.s;
    const ux = (u[0] - u[1]) * KX * s, uy = (u[0] + u[1]) * KY * s - u[2] * KZ * s;
    const vx = (v[0] - v[1]) * KX * s, vy = (v[0] + v[1]) * KY * s - v[2] * KZ * s;
    const det = ux * vy - uy * vx;
    if (Math.abs(det) < 1e-6) return false;
    const ox = T.ox + (o[0] - o[1]) * KX * s, oy = T.oy + (o[0] + o[1]) * KY * s - o[2] * KZ * s;
    g.save();
    g.setTransform(ux, uy, vx, vy, ox, oy);
    g.beginPath();
    /* Umriss um gut einen halben Bildpunkt aufblasen: benachbarte Flächen
       überlappen dann minimal – sonst blitzen an den Kanten helle
       Haarlinien durch (Kantenglättung zweier Flächen addiert sich nicht). */
    const um = aufblasen(f.umriss, 0.65 / Math.max(1e-3, Math.min(Math.hypot(ux, uy), Math.hypot(vx, vy))));
    g.moveTo(um[0][0], um[0][1]);
    for (let i = 1; i < um.length; i++) g.lineTo(um[i][0], um[i][1]);
    g.closePath();
    g.clip();
    /* Pixel je Meter entlang der Fläche — für feinere oder gröbere Details */
    const pxU = Math.hypot(ux, uy), pxV = Math.hypot(vx, vy);
    const F = {
      w: f.w, h: f.h, name: f.name, n: n, sicht: sicht, px: Math.min(pxU, pxV), pxU: pxU, pxV: pxV, s: s,
      o: P.o, jahr: P.o.jahr, nacht: P.Z.nacht, zeit: P.Z, bau: P.o.bau, t: P.t || 0,
      licht: Math.max(0, punkt(n, LICHT)), rng: zufall(ST.textHash((f.name || "") + (P.o.saat || 1))),
      flaeche: f,
      /* Richtung der Sonne in der Fläche: u nach rechts, v nach unten, n heraus */
      lichtU: punkt(LICHT, u), lichtV: punkt(LICHT, v), lichtN: punkt(LICHT, n)
    };
    /* Schatten eines Vorsprungs der Tiefe d (Meter) auf der Fläche:
       Versatz in Flächen-Koordinaten. In der Tiefe einer Öffnung gilt
       derselbe Versatz nach innen. Liegt die Fläche im Schatten → null. */
    F.schatten = function (d) {
      if (F.lichtN <= 0.04) return null;
      let dx = -F.lichtU * d / F.lichtN, dy = -F.lichtV * d / F.lichtN;
      const l = Math.hypot(dx, dy), max = d * 2.6;
      if (l > max) { dx *= max / l; dy *= max / l; }
      return [dx, dy];
    };
    /* Lichtschein an einer Stelle der Fläche anmelden (a, b in Metern) */
    F.leuchtPunkt = function (a, b, r, farbe, k, flacker) {
      if (!P.lichter) return;
      const p = [o[0] + u[0] * a + v[0] * b, o[1] + u[1] * a + v[1] * b, o[2] + u[2] * a + v[2] * b];
      P.lichter.push({ x: T.ox + (p[0] - p[1]) * KX * s, y: T.oy + (p[0] + p[1]) * KY * s - p[2] * KZ * s, r: r * s, farbe: farbe || "255,190,110", k: k == null ? 1 : k, flacker: flacker });
    };
    if (pass === "leuchten") {
      if (typeof f.leuchten === "function") f.leuchten(g, F);
      g.restore();
      return true;
    }
    const m = typeof f.malen === "string" ? farbeMal(f.malen) : f.malen;
    if (m) m(g, F);
    if (!f.keinLicht) {
      const lf = lichtFaktor(n, P.Z, f.lichtExtra, P.o.jahr);
      g.globalCompositeOperation = "multiply";
      g.fillStyle = "rgb(" + Math.round(lf[0] * 255) + "," + Math.round(lf[1] * 255) + "," + Math.round(lf[2] * 255) + ")";
      g.fillRect(-1, -1, f.w + 2, f.h + 2);
      /* Kontaktschatten am Boden: Wände werden unten dunkler */
      if (f.ao && !f.keinAo && Math.abs(n[2]) < 0.3) {
        const hoch = Math.min(0.55, f.h * 0.5);
        const gr = g.createLinearGradient(0, f.h, 0, f.h - hoch);
        gr.addColorStop(0, "rgba(70,70,90,1)"); gr.addColorStop(1, "rgba(255,255,255,1)");
        g.fillStyle = gr; g.fillRect(-1, f.h - hoch, f.w + 2, hoch + 1);
      }
      /* Schatten des Dachüberstands auf der Wand */
      if (f.traufe && Math.abs(n[2]) < 0.3) {
        const k = Math.max(0, punkt(n, LICHT));
        const tief = f.traufe * (0.55 + 0.9 * k);
        const gr = g.createLinearGradient(0, (f.traufeY || 0), 0, (f.traufeY || 0) + tief * 1.3);
        gr.addColorStop(0, "rgb(120,128,160)"); gr.addColorStop(0.7, "rgb(200,204,222)"); gr.addColorStop(1, "rgb(255,255,255)");
        g.fillStyle = gr; g.fillRect(-1, (f.traufeY || 0) - 0.01, f.w + 2, tief * 1.3 + 0.02);
      }
      g.globalCompositeOperation = "source-over";
    }
    if (typeof f.danach === "function") f.danach(g, F);
    g.restore();
    return true;
  }

  /* Mitte eines Teils (für die Reihenfolge) */
  function teilMitte(t, c, sn) {
    if (t.mitte) return drehP(t.mitte, c, sn);
    let sx = 0, sy = 0, sz = 0, n = 0;
    for (const f of t.flaechen) {
      for (const q of f.umriss) {
        const p = [f.o[0] + f.u[0] * q[0] + f.v[0] * q[1], f.o[1] + f.u[1] * q[0] + f.v[1] * q[1], f.o[2] + f.u[2] * q[0] + f.v[2] * q[1]];
        sx += p[0]; sy += p[1]; sz += p[2]; n++;
      }
    }
    for (const fi of t.figuren) { sx += fi.x; sy += fi.y; sz += fi.z + (fi.hoehe || 1) / 2; n++; }
    if (!n) return [0, 0, 0];
    return drehP([sx / n, sy / n, sz / n], c, sn);
  }

  /* Alle Eckpunkte (Kameraraum) eines Teils */
  function teilPunkte(t, c, sn) {
    const pts = [];
    for (const f of t.flaechen) {
      for (const q of f.umriss) {
        pts.push(drehP([f.o[0] + f.u[0] * q[0] + f.v[0] * q[1], f.o[1] + f.u[1] * q[0] + f.v[1] * q[1], f.o[2] + f.u[2] * q[0] + f.v[2] * q[1]], c, sn));
      }
    }
    return pts;
  }

  /* =====================================================================
     SPRITES — ein Modell einmal fertig gemalt (je Zoom, Drehung, Zeit)
     ===================================================================== */
  const SPEICHER = new Map();        // Schlüssel → { bild, schatten, ox, oy, … }
  let speicherPixel = 0;
  const SPEICHER_MAX = 90e6;         // ~ 360 MB RGBA wären zu viel; 90 Mio. Pixel = 360 MB? → Pixel, nicht Bytes
  ST.SPEICHER = SPEICHER;

  function modellBauen(id, o) {
    const def = ST.MODELLE[id];
    if (!def) throw new Error("Modell fehlt: " + id);
    const M = new Bauer(o);
    def.bauen(M, o);
    return M;
  }
  ST.modellBauen = modellBauen;

  /* Grenzen im Bild berechnen */
  function grenzen(M, c, sn, s) {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    const nimm = (p) => {
      const X = (p[0] - p[1]) * KX * s, Y = (p[0] + p[1]) * KY * s - p[2] * KZ * s;
      if (X < x0) x0 = X; if (X > x1) x1 = X; if (Y < y0) y0 = Y; if (Y > y1) y1 = Y;
    };
    for (const t of M.teile) {
      for (const p of teilPunkte(t, c, sn)) nimm(p);
      for (const fi of t.figuren) {
        const p = drehP([fi.x, fi.y, fi.z], c, sn);
        const X = (p[0] - p[1]) * KX * s, Y = (p[0] + p[1]) * KY * s - p[2] * KZ * s;
        const b = (fi.breite || 1) * s * 0.6, h = (fi.hoehe || 1) * s * KZ * 1.15;
        x0 = Math.min(x0, X - b); x1 = Math.max(x1, X + b); y0 = Math.min(y0, Y - h); y1 = Math.max(y1, Y + b * 0.4);
      }
    }
    for (const l of M.lichter) {
      const p = drehP(l.p, c, sn);
      const X = (p[0] - p[1]) * KX * s, Y = (p[0] + p[1]) * KY * s - p[2] * KZ * s;
      x0 = Math.min(x0, X - l.r * s); x1 = Math.max(x1, X + l.r * s); y0 = Math.min(y0, Y - l.r * s); y1 = Math.max(y1, Y + l.r * s);
    }
    if (!isFinite(x0)) { x0 = y0 = -1; x1 = y1 = 1; }
    return [x0, y0, x1, y1];
  }

  /* Schattenumriss eines Teils auf dem Boden (konvexe Hülle der
     entlang des Lichts auf z = 0 geworfenen Eckpunkte) */
  function huelle(pts) {
    pts = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    if (pts.length < 3) return pts;
    const kr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lo = [], hi = [];
    for (const p of pts) { while (lo.length >= 2 && kr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
    for (let i = pts.length - 1; i >= 0; i--) { const p = pts[i]; while (hi.length >= 2 && kr(hi[hi.length - 2], hi[hi.length - 1], p) <= 0) hi.pop(); hi.push(p); }
    hi.pop(); lo.pop();
    return lo.concat(hi);
  }

  function spriteMalen(id, o, gier, s, Z, t) {
    const M = modellBauen(id, o);
    const rad = gier * Math.PI / 180, c = Math.cos(rad), sn = Math.sin(rad);
    const P = { o: o, Z: Z, t: t, lichter: [] };
    /* Schattenwurf: Richtung auf dem Boden */
    const sx = -LICHT[0] / LICHT[2], sy = -LICHT[1] / LICHT[2];
    const schattenPunkte = [];
    for (const tl of M.teile) {
      if (!tl.schatten) continue;
      const pts = teilPunkte(tl, c, sn).map((p) => [p[0] + sx * p[2], p[1] + sy * p[2]]);
      if (pts.length) schattenPunkte.push({ pts: huelle(pts.concat(teilPunkte(tl, c, sn).map((p) => [p[0], p[1]]))) });
      for (const fi of tl.figuren) if (fi.schatten !== false) schattenPunkte.push({ figur: fi, p: drehP([fi.x, fi.y, fi.z], c, sn) });
    }
    let [x0, y0, x1, y1] = grenzen(M, c, sn, s);
    /* Schatten mit in die Grenzen */
    for (const sp of schattenPunkte) {
      if (!sp.pts) continue;
      for (const p of sp.pts) {
        const X = (p[0] - p[1]) * KX * s, Y = (p[0] + p[1]) * KY * s;
        if (X < x0) x0 = X; if (X > x1) x1 = X; if (Y < y0) y0 = Y; if (Y > y1) y1 = Y;
      }
    }
    const rand = Math.ceil(4 + s * 0.15);
    x0 = Math.floor(x0 - rand); y0 = Math.floor(y0 - rand); x1 = Math.ceil(x1 + rand); y1 = Math.ceil(y1 + rand);
    const W = Math.max(2, x1 - x0), H = Math.max(2, y1 - y0);
    const bild = document.createElement("canvas"); bild.width = W; bild.height = H;
    const g = bild.getContext("2d");
    const T = { s: s, ox: -x0, oy: -y0, c: c, sn: sn };
    /* Reihenfolge: hinten zuerst */
    const teile = M.teile.map((tl) => { const m = teilMitte(tl, c, sn); return { tl: tl, nah: punkt(m, ZUM_AUGE) + tl.ebene * 1000 }; });
    teile.sort((a, b) => a.nah - b.nah);
    for (const e of teile) {
      const tl = e.tl;
      /* Flächen eines Teils: hintere zuerst (für nicht-konvexe Teile) */
      const fl = tl.flaechen.map((f) => { let m = [0, 0, 0]; for (const q of f.umriss) { m[0] += f.o[0] + f.u[0] * q[0] + f.v[0] * q[1]; m[1] += f.o[1] + f.u[1] * q[0] + f.v[1] * q[1]; m[2] += f.o[2] + f.u[2] * q[0] + f.v[2] * q[1]; } const k = f.umriss.length; m = drehP([m[0] / k, m[1] / k, m[2] / k], c, sn); return { f: f, nah: punkt(m, ZUM_AUGE) + (f.ebene || 0) * 100 }; });
      fl.sort((a, b) => a.nah - b.nah);
      for (const x of fl) flaecheZeichnen(g, x.f, T, P, "malen");
      const figs = tl.figuren.map((fi) => ({ fi: fi, p: drehP([fi.x, fi.y, fi.z], c, sn) })).sort((a, b) => punkt(a.p, ZUM_AUGE) - punkt(b.p, ZUM_AUGE));
      for (const x of figs) figurZeichnen(g, x.fi, x.p, T, P);
    }
    /* Leuchten: Fenster, Lichterketten — nach dem Licht, damit sie hell bleiben */
    if (Z.nacht > 0.01) {
      for (const e of teile) for (const f of e.tl.flaechen) if (f.leuchten) flaecheZeichnen(g, f, T, P, "leuchten");
    }
    /* Schattenbild */
    const schatten = document.createElement("canvas"); schatten.width = W; schatten.height = H;
    const gs = schatten.getContext("2d");
    gs.fillStyle = "#000";
    /* weiche Schattenkante (Halbschatten) – mitwachsend mit dem Zoom */
    gs.filter = "blur(" + Math.max(0.6, s * 0.035).toFixed(2) + "px)";
    for (const sp of schattenPunkte) {
      if (sp.pts) {
        gs.beginPath();
        sp.pts.forEach((p, i) => { const X = T.ox + (p[0] - p[1]) * KX * s, Y = T.oy + (p[0] + p[1]) * KY * s; if (i) gs.lineTo(X, Y); else gs.moveTo(X, Y); });
        gs.closePath(); gs.fill();
      } else if (sp.figur && sp.figur.malen) {
        figurSchatten(gs, sp.figur, sp.p, T, P);
      }
    }
    /* Lichtpunkte im Bild (für den Schein über allem) */
    const lichter = M.lichter.map((l) => { const p = drehP(l.p, c, sn); return { x: T.ox + (p[0] - p[1]) * KX * s, y: T.oy + (p[0] + p[1]) * KY * s - p[2] * KZ * s, r: l.r * s, farbe: l.farbe, k: l.k, flacker: l.flacker }; }).concat(P.lichter);
    const rauch = M.rauch.map((r) => { const p = drehP(r.p, c, sn); return { x: T.ox + (p[0] - p[1]) * KX * s, y: T.oy + (p[0] + p[1]) * KY * s - p[2] * KZ * s, k: r.k }; });
    return { bild: bild, schatten: schatten, ox: x0, oy: y0, W: W, H: H, lichter: lichter, rauch: rauch, leben: M.leben, s: s, c: c, sn: sn };
  }

  function figurZeichnen(g, fi, p, T, P) {
    const X = T.ox + (p[0] - p[1]) * KX * T.s, Y = T.oy + (p[0] + p[1]) * KY * T.s - p[2] * KZ * T.s;
    g.save();
    g.setTransform(1, 0, 0, 1, X, Y);
    fi.malen(g, T.s, { o: P.o, Z: P.Z, nacht: P.Z.nacht, jahr: P.o.jahr, t: P.t || 0, gier: Math.atan2(T.sn, T.c) * 180 / Math.PI, schatten: false,
      leuchtPunkt: function (dx, dy, r, farbe, k, flacker) { if (P.lichter) P.lichter.push({ x: X + dx, y: Y + dy, r: r, farbe: farbe || "255,190,110", k: k == null ? 1 : k, flacker: flacker }); } });
    g.restore();
  }
  /* Schatten einer Figur: dieselbe Zeichnung, flach auf den Boden gelegt */
  function figurSchatten(g, fi, p, T, P) {
    const X = T.ox + (p[0] - p[1]) * KX * T.s, Y = T.oy + (p[0] + p[1]) * KY * T.s - p[2] * KZ * T.s;
    /* Bild-x bleibt (Kamera-rechts auf dem Boden), Bild-hoch wird zur
       Schattenrichtung: ein Meter Höhe → Versatz (sx, sy) am Boden */
    const s = T.s, sx = -LICHT[0] / LICHT[2], sy = -LICHT[1] / LICHT[2];
    const hx = (sx - sy) * KX, hy = (sx + sy) * KY;       // Bildversatz je Meter Höhe
    /* Zeichnung: 1 Pixel nach oben entspricht 1/(KZ*s) Metern Höhe */
    const k = 1 / (KZ);
    g.save();
    g.setTransform(1, 0, -hx * k, -hy * k, X, Y);
    g.globalCompositeOperation = "source-over";
    fi.malen(g, s, { o: P.o, Z: P.Z, nacht: 0, jahr: P.o.jahr, t: 0, schatten: true });
    g.restore();
  }

  /* Sprite aus dem Speicher (oder neu malen) */
  /* Zoom fein gestuft (0,1 %): im Ruhezustand wird genau in Bildschirmgröße
     gemalt – nie gestreckt, also gestochen scharf. Während die Finger
     zoomen, streckt die Szene das letzte Bild (szene.js). */
  function sStufe(s) { return Math.exp(Math.round(Math.log(s) / 0.001) * 0.001); }
  function spriteSchluessel(id, o, gier, s, Z) {
    return id + "|" + (o.schluessel || "") + "|" + o.jahr + "|" + Math.round(gier * 10) / 10 + "|" + sStufe(s).toFixed(3) + "|" + Z.name + "|" + (o.bau == null ? 1 : Math.round(o.bau * 200) / 200);
  }
  ST.spriteSchluessel = spriteSchluessel;
  function spriteHolen(id, o, gier, s, Z, t) {
    const sq = sStufe(s);
    const schl = spriteSchluessel(id, o, gier, s, Z);
    let sp = SPEICHER.get(schl);
    if (sp) { sp.zuletzt = ST.jetzt || 0; return sp; }
    sp = spriteMalen(id, o, gier, sq, Z, t);
    sp.schl = schl; sp.zuletzt = ST.jetzt || 0;
    SPEICHER.set(schl, sp);
    speicherPixel += sp.W * sp.H * 2;
    if (speicherPixel > SPEICHER_MAX) aufraeumen();
    return sp;
  }
  function aufraeumen() {
    const alle = [...SPEICHER.values()].sort((a, b) => a.zuletzt - b.zuletzt);
    for (const sp of alle) {
      if (speicherPixel < SPEICHER_MAX * 0.6) break;
      SPEICHER.delete(sp.schl); speicherPixel -= sp.W * sp.H * 2;
      sp.bild.width = sp.bild.height = 0; sp.schatten.width = sp.schatten.height = 0;
    }
  }
  ST.spriteHolen = spriteHolen;
  ST.spriteMalen = spriteMalen;
  ST.speicherLeeren = function () { for (const sp of SPEICHER.values()) { sp.bild.width = 0; sp.schatten.width = 0; } SPEICHER.clear(); speicherPixel = 0; };

  /* =====================================================================
     MODELLE ANMELDEN
     def = { name, gruppe, grund: [b, t], hoehe, bauzeit (s), bauen(M, o),
             symbol?, saison? }
     ===================================================================== */
  ST.modell = function (id, def) { def.id = id; ST.MODELLE[id] = def; };

  ST.farbeMal = farbeMal;
})();
