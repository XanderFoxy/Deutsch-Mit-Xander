/* =====================================================================
   BAUKASTEN-STADT — DIE BAUSTELLE
   ---------------------------------------------------------------------
   XANDER: „Man soll das Fundament sehen beim Aufbauen … wenn der Bagger
   dann kommt und damit baut und dass man sieht wie das entsteht. Schritt
   für Schritt … wie die kleinen Menschen realistisch mit ihren
   Hämmerchen dieses Werk aufbauen." – „Das soll keine Comic Grafik
   sein. Das soll noch viel mehr am Realismus dran sein." – „Richtig
   filigran." – „ohne Pixelkanten und komische Vektorrückstände." –
   „Man soll sie in jedem Winkel aufstellen können." – „Du bist dein
   schlimmster Kritiker."

   WAS HIER ENTSTEHT (für jedes Objekt mit laufendem Bau, bau 0…1)
     0,00–0,12  Hydraulikbagger an der Grube: Kette, Oberwagen dreht,
                Ausleger, Stiel und Löffel graben, die Erde fällt auf den
                Aushubhaufen; Fahrer in der Kabine
     0,12–0,22  Fahrmischer: Trommel dreht, Beton läuft über die Schurre
                in die Schalung; Arbeiter mit Rüttelflasche
     ab 0,22    Fassadengerüst (Stahlrohr-Rahmen, Holzbohlen, Geländer,
                Leitergang, rot-weiße Bordbretter) wächst Lage für Lage
                mit der Wand, an den Giebeln gestuft bis unter den First
     ab 0,30    Turmdrehkran (Gittermast, Ausleger mit Laufkatze,
                Gegenausleger mit Ballast, Turmspitze mit Abspannungen)
                dreht sich und hebt Balken, Ziegel und Paletten
     immer      Arbeiter mit Helm und Warnweste (1,75 m): hämmern, sägen,
                schieben Schubkarren, tragen Balken; Bauzaun mit Planen,
                Bauschild „Hier baut die Gemeinde Winterhausen",
                Materiallager, Bauwagen; nachts Baustrahler, Warnleuchten
                und rote Flugbefeuerung am Kran
     ab 0,95    Abbau: Gerüst von oben, Kran, Zaun, Lager
   Winter: Schnee auf Bohlen, Paletten, Haufen, Zaunfüßen; ein
   leuchtendes Tannenbäumchen auf der Kranspitze. Frühling: kein Schnee,
   Gras am Zaun, die Leute in leichterer Kleidung.
   Häuser ohne eigene Bauphasen (das Probehaus steht von Anfang an): der
   Bagger hebt statt der Baugrube einen Leitungsgraben vor der Westwand
   aus, der Fahrmischer gießt darin das Streifenfundament.
   Töne: ST.ton("hammerschlag", 0,25) und ST.ton("bagger", 0,2) – nur,
   wenn das klingende Teil gerade im Bild gemalt wird, für alle
   Baustellen zusammen selten (Hammer frühestens alle 2,6 s, Bagger alle
   12 s), nie im Prüfbild (still=1).

   WIE GEZEICHNET WIRD
   Alles in Modellkoordinaten des Gebäudes (Meter, x Ost, y Süd, z oben),
   jedes Bild neu und im Licht der Szene (ST.lichtFaktor), also scharf in
   jeder Zoomstufe und in jedem Drehwinkel. Rohre werden je Farbe
   gebündelt (ein Pfad je Lichtwert) – so bleibt ein Gerüst mit hunderten
   Rohren billig. Menschen, Maschinen und Rundes mit ST.gestalt (himmel.js):
   echte Ellipsoide und Kapseln, im selben Licht schattiert.
   Sparen, ohne dass man es sieht: Festes (Gerüst, Zaun, Lager, Kranmast)
   liegt je Zoom, Drehung und Licht als Bild bereit, seine Schatten
   zusammen in einem Bild. Der Oberkran wird nur neu gebaut, wenn er sich
   dreht. Weit weg gezoomt (unter 44 Bildpunkten je Meter) bekommen die
   Menschen 15 neue Haltungen je Sekunde, jeder in seinem eigenen Takt.

   VOR ODER HINTER DEM HAUS
   Der Kern ruft hinten() vor dem Gebäude und vorne() danach. Jedes Teil
   (Gerüstseite, Gerüstecke, Zaunfeld, Maschine, Mensch, Stapel) hat einen
   Grundriss. Liegt es auf einer Seite des Hauses, die zum Betrachter
   zeigt (trennende Ebene = Hauswand), kommt es nach vorn, sonst nach
   hinten. Untereinander werden die Teile ebenso über trennende Ebenen
   sortiert (topologisch, wie die Szene die Häuser sortiert). In einer
   Gerüstseite gilt: Innenebene – Bohlen – Leute auf den Bohlen –
   Außenebene; bei abgewandten Seiten umgekehrt.

   MODELLE KÖNNEN MITREDEN (optional, in der Modell-Definition):
     baustelle: { art: "klein"|"mittel"|"gross"|"riesig", geruest, kran,
                  bagger, mischer, zaun (true/false), traufe, first (m),
                  wand: { x0, x1, y0, y1 } (Fassade in m, wenn das Modell
                  keine messbaren Wände hat, etwa der Dom) }
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT;
  if (!ST) return;
  const KX = ST.KX, KY = ST.KY, KZ = ST.KZ, AUGE = ST.ZUM_AUGE, LICHT = ST.LICHT;
  const TAU = Math.PI * 2;
  const q = new URLSearchParams(location.search);
  const STILL = q.get("still") === "1";

  /* ---------------- kleine Helfer ---------------- */
  const klemm = (x, a, b) => (x < a ? a : x > b ? b : x);
  const glatt = (x) => { x = klemm(x, 0, 1); return x * x * (3 - 2 * x); };
  const zw = (x, a, b) => klemm((x - a) / (b - a), 0, 1);
  const lerp = (a, b, k) => a + (b - a) * k;
  const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const kreuz = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const len = (a) => Math.hypot(a[0], a[1], a[2]);
  const nrm = (a) => { const l = len(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const mix3 = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
  const hash = (a, b, c) => ST.hash2(a | 0, b | 0, c | 0);
  function rgbS(c, a) {
    const r = Math.max(0, Math.min(255, c[0])) | 0, g = Math.max(0, Math.min(255, c[1])) | 0, b = Math.max(0, Math.min(255, c[2])) | 0;
    return a == null || a >= 1 ? "rgb(" + r + "," + g + "," + b + ")" : "rgba(" + r + "," + g + "," + b + "," + a.toFixed(3) + ")";
  }
  /* Richtung der Sonne im Bild (für Glanzkanten an Rohren) */
  const R1 = [KX, -KX, 0], R2 = [KY, KY, -KZ];
  const LSX0 = dot(LICHT, R1), LSY0 = dot(LICHT, R2), LSL = Math.hypot(LSX0, LSY0);
  const LSX = LSX0 / LSL, LSY = LSY0 / LSL;
  /* Schattenwurf: Versatz am Boden je Meter Höhe (Kameraraum) */
  const LA = -LICHT[0] / LICHT[2], LB = -LICHT[1] / LICHT[2];

  /* ---------------- Farben (Werkstoff bei weißem Licht) ---------------- */
  const F = {
    stahl: [176, 180, 184], stahlDunkel: [120, 124, 130],
    bohle: [184, 150, 104], bohleAlt: [150, 124, 92], kappe: [150, 154, 160],
    rot: [200, 36, 34], weiss: [238, 236, 230],
    krangelb: [240, 180, 24], baggergelb: [236, 168, 18], schwarz: [40, 40, 42], gummi: [34, 34, 36],
    beton: [158, 156, 150], betonHell: [190, 188, 182], glas: [44, 58, 70],
    holz: [196, 158, 104], holzHell: [214, 182, 132], hirn: [214, 184, 136], palette: [176, 142, 96],
    ziegel: [168, 74, 52], sand: [206, 176, 128], erde: [96, 72, 52], erdeHell: [150, 116, 78],
    schnee: [246, 248, 252], plane: [44, 104, 70], zaunFuss: [150, 146, 138],
    blau: [26, 72, 150], gelbSchild: [246, 196, 20]
  };

  /* =====================================================================
     KAMERA JE OBJEKT UND BILD
     P kommt von der Szene: proj (Modellkoordinaten, schon gedreht), s,
     c/sn (Drehung inkl. Kamera), Z (Licht), t (Sekunden).
     ===================================================================== */
  function kamera(P, bau) {
    const c = P.c, sn = P.sn, s = P.s;
    const O = P.proj(0, 0, 0);
    const Z = P.Z;
    const jahr = P.jahr || (ST.szene && ST.szene.jahr) || "winter";
    const K = {
      /* Bildpunkte relativ zum Modell-Ursprung: gemalt wird verschoben um
         (ox, oy) – so bleibt Gebautes beim Verschieben der Karte gültig */
      P: P, s: s, c: c, sn: sn, X0: 0, Y0: 0, ox: O[0], oy: O[1], Z: Z, t: P.t || 0, bau: bau, jahr: jahr,
      winter: jahr === "winter", nacht: Z.nacht || 0, dpr: P.dpr || 1,
      ex: 0.6124 * (c + sn), ey: 0.6124 * (c - sn), lampen: [], lampenB: null
    };
    K.E = [K.ex, K.ey, 0.5];
    K.p = function (x, y, z) {
      const a = x * c - y * sn, b = x * sn + y * c;
      return [K.X0 + (a - b) * KX * s, K.Y0 + (a + b) * KY * s - z * KZ * s];
    };
    K.sp = function (x, y, z) {
      const a = x * c - y * sn + LA * z, b = x * sn + y * c + LB * z;
      return [K.X0 + (a - b) * KX * s, K.Y0 + (a + b) * KY * s];
    };
    K.tiefe = (x, y, z) => x * K.ex + y * K.ey + 0.5 * z;
    K.nk = (n) => [n[0] * c - n[1] * sn, n[0] * sn + n[1] * c, n[2]];
    /* Licht auf einer Fläche mit Normale n (Modell) an der Stelle p */
    K.licht = function (n, p) {
      const f = ST.lichtFaktor(K.nk(n), Z, 0, jahr);
      if (K.lampen.length && p) {
        for (const L of K.lampen) {
          const d = sub(L.p, p), l = len(d);
          if (l >= L.r) continue;
          const w = (1 - l / L.r) * (1 - l / L.r) * L.k * Math.max(0, 0.3 + 0.7 * dot(n, d) / (l || 1));
          f[0] += L.farbe[0] * w; f[1] += L.farbe[1] * w; f[2] += L.farbe[2] * w;
        }
      }
      return f;
    };
    K.farbe = (alb, n, p, a) => { const f = K.licht(n, p); return rgbS([alb[0] * f[0], alb[1] * f[1], alb[2] * f[2]], a); };
    /* Bildpunkte je Meter entlang einer Richtung (für Detailstufen) */
    K.pxAuf = function (d) { const a = K.p(0, 0, 0), b = K.p(d[0], d[1], d[2]); return Math.hypot(b[0] - a[0], b[1] - a[1]); };
    return K;
  }

  /* =====================================================================
     SCHICHT — gesammelte Rohre, Flächen und eigene Zeichnungen, die in
     genau der Reihenfolge gemalt werden, in der sie angemeldet wurden
     (Blöcke). Rohre gleicher Farbe und Stärke in einem Block → ein Pfad.
     ===================================================================== */
  function Schicht(K) { this.K = K; this.bl = []; this.akt = null; this.sch = []; }
  const SP = Schicht.prototype;
  SP.block = function (art) {
    if (!this.akt || this.akt.art !== art) {
      this.akt = { art: art, liste: [], map: new Map() };
      this.bl.push(this.akt);
    }
    return this.akt;
  };
  SP.schnitt = function () { this.akt = null; return this; };
  /* Rohr von a nach b (Modell), Radius r (m) */
  SP.rohr = function (a, b, r, alb, opt) {
    opt = opt || {};
    const K = this.K;
    const d0 = sub(b, a), L = len(d0);
    if (L < 1e-4) return;
    const d = mul(d0, 1 / L), E = K.E, ed = dot(E, d);
    let n = sub(E, mul(d, ed));
    const ln = len(n);
    n = ln < 1e-3 ? E : mul(n, 1 / ln);
    const m = mul(add(a, b), 0.5);
    const f = K.licht(n, m);
    const A = K.p(a[0], a[1], a[2]), B = K.p(b[0], b[1], b[2]);
    let w = 2 * r * K.s;
    const blk = this.block("r");
    /* Farbe fein gestuft → gleiche Rohre landen im selben Pfad */
    const k0 = Math.round(f[0] * 40) / 40, k1 = Math.round(f[1] * 40) / 40, k2 = Math.round(f[2] * 40) / 40;
    const wq = w < 3 ? Math.round(w * 8) / 8 : Math.round(w * 2) / 2;
    const key = alb.join(",") + "|" + k0 + "," + k1 + "," + k2 + "|" + wq + (opt.schnee ? "|s" : "");
    let e = blk.map.get(key);
    if (!e) { e = { alb: alb, f: [k0, k1, k2], w: wq, seg: [], schnee: !!opt.schnee, kappe: opt.kappe || "round" }; blk.map.set(key, e); }
    let tx = B[0] - A[0], ty = B[1] - A[1];
    const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
    let px = -ty, py = tx;
    if (px * LSX + py * LSY < 0) { px = -px; py = -py; }
    e.seg.push(A[0], A[1], B[0], B[1], px, py);
    if (opt.schatten !== false) this.sch.push({ l: [a, b], w: 2 * r });
  };
  /* Ebene Fläche (Punkte im Modell, n = Außennormale).
     opt: stapel (gleiche Farbe bündeln), beidseitig, alpha, muster(g, L, M)
     mit lok = { o, u, v } (Flächenkoordinaten in Metern, v nach unten) */
  SP.flaeche = function (pts, n, alb, opt) {
    opt = opt || {};
    const K = this.K;
    if (opt.schatten !== false) this.sch.push({ poly: pts });
    let sicht = dot(K.nk(n), AUGE);
    if (sicht <= 0.002) {
      if (!opt.beidseitig) return;
      n = mul(n, -1); sicht = -sicht;
    }
    let m = [0, 0, 0];
    for (const p of pts) m = add(m, p);
    m = mul(m, 1 / pts.length);
    const f = opt.leucht ? [1, 1, 1] : K.licht(n, m);
    const scr = pts.map((p) => K.p(p[0], p[1], p[2]));
    const blk = this.block("f");
    if (opt.stapel && !opt.muster) {
      const col = rgbS([alb[0] * f[0], alb[1] * f[1], alb[2] * f[2]], opt.alpha);
      let e = blk.map.get(col);
      if (!e) { e = { farbe: col, polys: [] }; blk.map.set(col, e); }
      e.polys.push(scr);
      return;
    }
    let lok = opt.lok;
    if (opt.muster && lok && lok.w == null) {
      /* Ausdehnung der Fläche in ihren eigenen Achsen */
      let w = 0, h = 0;
      for (const p of pts) { const d = sub(p, lok.o); w = Math.max(w, dot(d, lok.u)); h = Math.max(h, dot(d, lok.v)); }
      lok = Object.assign({}, lok, { w: w, h: h });
    }
    blk.liste.push({ scr: scr, f: f, alb: alb, alpha: opt.alpha, muster: opt.muster, lok: lok, kante: opt.kante });
  };
  /* Eigene Zeichnung an dieser Stelle der Reihenfolge */
  SP.eigen = function (fn) { this.block("e").liste.push(fn); this.akt = null; };
  SP.schatten = function (form) { this.sch.push(form); };

  SP.malen = function (g) {
    const K = this.K, s = K.s;
    for (const blk of this.bl) {
      if (blk.art === "r") {
        g.lineCap = "round"; g.lineJoin = "round";
        for (const e of blk.map.values()) {
          const A = e.alb, f = e.f, S = e.seg, n = S.length;
          let w = e.w, alpha = 1;
          if (w < 0.8) { alpha = Math.max(0.15, w / 0.8); w = 0.8; }
          g.lineCap = e.kappe;
          const grund = [A[0] * f[0], A[1] * f[1], A[2] * f[2]];
          const pfad = (o) => { const p = new Path2D(); for (let i = 0; i < n; i += 6) { const ox = S[i + 4] * o, oy = S[i + 5] * o; p.moveTo(S[i] + ox, S[i + 1] + oy); p.lineTo(S[i + 2] + ox, S[i + 3] + oy); } return p; };
          if (!e.p0) e.p0 = pfad(0);
          g.globalAlpha = alpha;
          if (w >= 2.6) {
            /* Zylinder: dunkle Schattenkante, Körper, Glanzlinie zur Sonne */
            if (!e.p1) { e.p1 = pfad(w * 0.14); e.p2 = pfad(w * 0.26); }
            g.strokeStyle = rgbS(mul(grund, 0.62)); g.lineWidth = w; g.stroke(e.p0);
            g.strokeStyle = rgbS(grund); g.lineWidth = w * 0.64; g.stroke(e.p1);
            g.strokeStyle = rgbS(mix3(grund, [255, 255, 250], 0.42)); g.lineWidth = Math.max(0.6, w * 0.2); g.stroke(e.p2);
          } else {
            g.strokeStyle = rgbS(grund); g.lineWidth = w; g.stroke(e.p0);
          }
          if (e.schnee && K.winter) {
            /* Schneegrat oben auf waagerechten Rohren */
            if (!e.ps) {
              e.ps = new Path2D();
              const hoch = e.w * 0.38;
              for (let i = 0; i < n; i += 6) {
                if (Math.abs(S[i + 3] - S[i + 1]) > Math.abs(S[i + 2] - S[i]) * 0.9) continue;
                e.ps.moveTo(S[i], S[i + 1] - hoch); e.ps.lineTo(S[i + 2], S[i + 3] - hoch);
              }
            }
            g.globalAlpha = Math.min(1, alpha * 1.1);
            g.strokeStyle = rgbS(mul(F.schnee, Math.min(1, K.licht([0, 0, 1], null)[1] * 1.02)));
            g.lineWidth = Math.max(0.6, e.w * 0.55);
            g.stroke(e.ps);
          }
          g.globalAlpha = 1;
        }
      } else if (blk.art === "f") {
        for (const e of blk.map.values()) {
          if (!e.pfad) { e.pfad = new Path2D(); for (const P of e.polys) { e.pfad.moveTo(P[0][0], P[0][1]); for (let i = 1; i < P.length; i++) e.pfad.lineTo(P[i][0], P[i][1]); e.pfad.closePath(); } }
          g.fillStyle = e.farbe;
          g.fill(e.pfad);
        }
        for (const e of blk.liste) {
          const P = e.scr, f = e.f;
          if (!e.pfad) { e.pfad = new Path2D(); e.pfad.moveTo(P[0][0], P[0][1]); for (let i = 1; i < P.length; i++) e.pfad.lineTo(P[i][0], P[i][1]); e.pfad.closePath(); }
          const L = (alb, a) => rgbS([alb[0] * f[0], alb[1] * f[1], alb[2] * f[2]], a == null ? e.alpha : a);
          g.fillStyle = L(e.alb);
          g.fill(e.pfad);
          if (e.muster && e.lok) {
            const lo = e.lok, O = K.p(lo.o[0], lo.o[1], lo.o[2]);
            const U = K.p(lo.o[0] + lo.u[0], lo.o[1] + lo.u[1], lo.o[2] + lo.u[2]), V = K.p(lo.o[0] + lo.v[0], lo.o[1] + lo.v[1], lo.o[2] + lo.v[2]);
            const ux = U[0] - O[0], uy = U[1] - O[1], vx = V[0] - O[0], vy = V[1] - O[1];
            if (Math.abs(ux * vy - uy * vx) > 1e-4) {
              g.save(); g.clip(e.pfad);
              g.transform(ux, uy, vx, vy, O[0], O[1]);
              e.muster(g, L, { px: Math.min(Math.hypot(ux, uy), Math.hypot(vx, vy)), pxU: Math.hypot(ux, uy), pxV: Math.hypot(vx, vy), K: K, w: lo.w, h: lo.h });
              g.restore();
            }
          }
          if (e.kante) { g.strokeStyle = e.kante; g.lineWidth = Math.max(0.5, s * 0.012); g.stroke(e.pfad); }
        }
      } else if (blk.art === "e") {
        for (const fn of blk.liste) { g.save(); fn(g, K); g.restore(); }
      }
    }
  };
  SP.schattenMalen = function (sg) {
    const K = this.K;
    sg.fillStyle = "#000"; sg.strokeStyle = "#000"; sg.lineCap = "round";
    if (!this._sp) {
      /* Schattenformen einmal als Pfade (relativ zum Ursprung) */
      this._sp = new Path2D();
      for (const e of this.sch) {
        if (!e.poly) continue;
        e.poly.forEach((p, i) => { const S = K.sp(p[0], p[1], p[2]); if (i) this._sp.lineTo(S[0], S[1]); else this._sp.moveTo(S[0], S[1]); });
        this._sp.closePath();
      }
      this._sl = new Map();
      for (const e of this.sch) {
        if (!e.l) continue;
        const w = Math.max(0.6, e.w * K.s);
        const k = Math.round(w * 4) / 4;
        if (!this._sl.has(k)) this._sl.set(k, new Path2D());
        const A = K.sp(e.l[0][0], e.l[0][1], e.l[0][2]), B = K.sp(e.l[1][0], e.l[1][1], e.l[1][2]);
        const p = this._sl.get(k); p.moveTo(A[0], A[1]); p.lineTo(B[0], B[1]);
      }
    }
    sg.fill(this._sp);
    for (const [w, p] of this._sl) { sg.lineWidth = w; sg.stroke(p); }
    for (const e of this.sch) if (e.fn) { sg.save(); e.fn(sg, K); sg.restore(); }
  };

  /* Quader als Flächen (für Stapel, Paletten, Fundamente): x0…x1 usw. */
  function kiste(S, x0, y0, z0, x1, y1, z1, alb, opt) {
    opt = opt || {};
    const o = Object.assign({}, opt);
    const m = opt.muster || {};
    const seite = (pts, n, name) => S.flaeche(pts, n, (opt.farben && opt.farben[name]) || alb, Object.assign({}, o, { muster: m[name], lok: m[name] ? lokVon(pts) : null }));
    seite([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], [0, 0, 1], "oben");
    seite([[x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0]], [0, 1, 0], "sued");
    seite([[x1, y0, z1], [x0, y0, z1], [x0, y0, z0], [x1, y0, z0]], [0, -1, 0], "nord");
    seite([[x1, y1, z1], [x1, y0, z1], [x1, y0, z0], [x1, y1, z0]], [1, 0, 0], "ost");
    seite([[x0, y0, z1], [x0, y1, z1], [x0, y1, z0], [x0, y0, z0]], [-1, 0, 0], "west");
  }
  /* Flächenkoordinaten aus den ersten drei Ecken: o = Ecke 0, u → Ecke 1, v → Ecke 3 */
  function lokVon(pts) {
    const o = pts[0], u = sub(pts[1], o), v = sub(pts[pts.length - 1], o);
    return { o: o, u: nrm(u), v: nrm(v), w: len(u), h: len(v) };
  }

  /* =====================================================================
     DER PLAN: wo was steht (Modellkoordinaten, je Objekt einmal)
     ===================================================================== */
  function stadtName() { try { return localStorage.getItem("stadt_name") || "Winterhausen"; } catch (e) { return "Winterhausen"; } }

  /* Maße des fertigen Modells, einmal je Modellart aus seinen Flächen
     gelesen: Fassadenflucht je Seite (große senkrechte Flächen zwischen
     2,2 m und Traufe – Treppe, Schild, Blumenkasten zählen nicht),
     Traufe und First aus den geneigten Dachflächen, Firstrichtung aus
     den Dachnormalen. So steht das Gerüst 30 cm vor der echten Wand. */
  function modellMasse(def) {
    if (def._bsMasse !== undefined) return def._bsMasse;
    let m = null;
    try {
      const M = ST.modellBauen(def.id, { jahr: "fruehling", bau: 1, saat: 7, schluessel: "bs|mass" });
      const dach = [], waende = [];
      let nx = 0, ny = 0;
      for (const t of M.teile) for (const f of t.flaechen) {
        if (!f.umriss || !f.u || !f.v) continue;
        const n = nrm(kreuz(f.u, f.v));
        const pts = f.umriss.map((q) => [f.o[0] + f.u[0] * q[0] + f.v[0] * q[1], f.o[1] + f.u[1] * q[0] + f.v[1] * q[1], f.o[2] + f.u[2] * q[0] + f.v[2] * q[1]]);
        let fl = 0;
        for (let i = 0; i < f.umriss.length; i++) { const a = f.umriss[i], b = f.umriss[(i + 1) % f.umriss.length]; fl += a[0] * b[1] - b[0] * a[1]; }
        fl = Math.abs(fl) / 2;
        if (n[2] > 0.25 && n[2] < 0.97 && fl > 1.5) dach.push({ pts: pts, fl: fl, n: n });
        else if (Math.abs(n[2]) < 0.15 && fl > 2.5) waende.push({ n: n, pts: pts });
      }
      if (dach.length && waende.length) {
        /* Hauptdach: die größten Dachflächen, bis 70 % der Dachfläche
           (Turmhelm, Vordach und Gauben verfälschen Traufe und First nicht) */
        dach.sort((a, b) => b.fl - a.fl);
        const summe = dach.reduce((a, d) => a + d.fl, 0);
        let zT = Infinity, zF = -Infinity, dx = 0, dy = 0, acc = 0, zH = Infinity;
        const gross = [];
        for (const d of dach) {
          if (d.fl < dach[0].fl * 0.1) break;
          d.haupt = acc <= summe * 0.7 && d.fl >= dach[0].fl * 0.5;
          acc += d.fl;
          d.zmax = -Infinity;
          for (const p of d.pts) { d.zmax = Math.max(d.zmax, p[2]); if (d.haupt && p[2] > 1.8) zH = Math.min(zH, p[2]); }
          gross.push(d);
        }
        for (const d of gross) {
          /* ein niedriger Anbau (ganz unter der Traufe des Hauptdachs, etwa
             der Güterschuppen am Bahnhof) zieht die Traufe nicht herunter */
          if (!d.haupt && d.zmax < zH - 0.05) continue;
          if (d.haupt) { nx += Math.abs(d.n[0]) * d.fl; ny += Math.abs(d.n[1]) * d.fl; }
          for (const p of d.pts) {
            if (p[2] > 1.8) zT = Math.min(zT, p[2]);
            if (d.haupt) { zF = Math.max(zF, p[2]); dx = Math.max(dx, Math.abs(p[0])); dy = Math.max(dy, Math.abs(p[1])); }
          }
        }
        const W = { x0: 0, x1: 0, y0: 0, y1: 0 };
        for (const w of waende) {
          let z0 = Infinity, z1 = -Infinity;
          for (const p of w.pts) { z0 = Math.min(z0, p[2]); z1 = Math.max(z1, p[2]); }
          if (z1 < 2.2 || z0 > zT - 1.2) continue;
          for (const p of w.pts) {
            if (w.n[0] > 0.85) W.x1 = Math.max(W.x1, p[0]);
            if (w.n[0] < -0.85) W.x0 = Math.min(W.x0, p[0]);
            if (w.n[1] > 0.85) W.y1 = Math.max(W.y1, p[1]);
            if (w.n[1] < -0.85) W.y0 = Math.min(W.y0, p[1]);
          }
        }
        if (isFinite(zT) && W.x1 > 0.5 && W.y1 > 0.5 && W.x0 < -0.5 && W.y0 < -0.5) {
          const n0 = dach[0].n;
          m = { wand: W, traufe: zT, first: zF, dachX: dx, dachY: dy, firstX: ny >= nx, neig: Math.hypot(n0[0], n0[1]) / Math.max(0.1, n0[2]) };
        }
      }
    } catch (e) { m = null; }
    def._bsMasse = m;
    return m;
  }

  /* Kennt das Modell Bauphasen? Manche (das Probehaus) stehen von Anfang an
     fertig da. Dort kann der Bagger keine Baugrube unter dem Haus ausheben:
     er zieht stattdessen einen Leitungsgraben neben der Westwand, und der
     Fahrmischer gießt darin das Streifenfundament (Anschlussarbeiten). */
  function modellPhasen(def) {
    if (def._bsPhasen !== undefined) return def._bsPhasen;
    let ja = true;
    try {
      const zug = (bau) => {
        const M = ST.modellBauen(def.id, { jahr: "winter", bau: bau, saat: 7, schluessel: "bs|phasen" + bau });
        let n = 0, z = 0;
        for (const t of M.teile) { n += t.flaechen.length + t.figuren.length; for (const f of t.flaechen) z = Math.max(z, f.o[2]); }
        return n + "|" + z.toFixed(2);
      };
      ja = zug(0.06) !== zug(1);
    } catch (e) { ja = true; }
    def._bsPhasen = ja;
    return ja;
  }
  const OHNE_BAUSTELLE = ["schneemann"];
  const LEER = { hinten: [], vorne: [], alle: [], ox: 0, oy: 0, skal: 1, K: { nacht: 0 } };
  function planFuer(o, def) {
    const key = def.id + "|" + (o.saat | 0);
    if (o._bsPlan && o._bsPlan.key === key) return o._bsPlan;
    const g0 = def.grund || [4, 4], H = def.hoehe || 6;
    const hx = g0[0] / 2, hy = g0[1] / 2;
    const ov = def.baustelle || {};
    const gruppe = def.gruppe || "";
    const haus = /Häuser|Wahrzeichen/.test(gruppe);
    const fl = g0[0] * g0[1];
    /* ein Schneemann braucht keine Baustelle */
    const art = ov.art || (OHNE_BAUSTELLE.indexOf(def.id) >= 0 ? "keine" : haus ? (fl > 300 ? "riesig" : "gross") : (fl < 3 || (Math.max(g0[0], g0[1]) < 2.6 && H < 3.4) ? "klein" : "mittel"));
    const gross = art === "gross" || art === "riesig";
    const pl = { key: key, art: art, hx: hx, hy: hy, H: H, def: def, saat: o.saat | 0, gross: gross };
    const MM = gross ? modellMasse(def) : null;
    pl.masse = MM;
    /* Fassade (für Gerüst und die Frage „vor oder hinter dem Haus") */
    pl.wand = ov.wand || (MM ? MM.wand : { x0: -hx, x1: hx, y0: -hy, y1: hy });
    pl.traufe = ov.traufe || (MM ? MM.traufe : (art === "riesig" ? Math.min(0.54 * H, 0.75 * Math.min(g0[0], g0[1])) : klemm(0.54 * H, 2.4, 12)));
    pl.first = ov.first || (MM ? Math.max(MM.first, pl.traufe + 0.5) : Math.max(pl.traufe + 1.2, Math.min(0.88 * H, pl.traufe + 0.7 * Math.min(g0[0], g0[1]))));
    pl.firstX = MM ? MM.firstX : hx >= hy;
    pl.dachHalb = MM ? (pl.firstX ? MM.dachY : MM.dachX) : (hx >= hy ? hy : hx);
    /* Dachneigung (tan): aus der größten Dachfläche, sonst aus First und Traufe */
    pl.neig = MM ? MM.neig : (pl.first - pl.traufe) / Math.max(1, pl.dachHalb);
    pl.mit = {
      /* ohne messbare Fassaden (der Dom malt sich selbst als Ganzes) stünde
         ein Riesengerüst meterweit vor den Wänden: dann lieber keins */
      geruest: ov.geruest != null ? ov.geruest : gross && H >= 4.5 && !(art === "riesig" && !MM && !ov.wand),
      kran: ov.kran != null ? ov.kran : gross && H >= 7,
      bagger: ov.bagger != null ? ov.bagger : gross,
      mischer: ov.mischer != null ? ov.mischer : art !== "klein",
      zaun: ov.zaun != null ? ov.zaun : art !== "klein"
    };
    /* Ränder bis zum Bauzaun: Norden Kran und Lager, Westen Fahrzeuge */
    const m = art === "riesig" ? 7 : gross ? 1 : 0;
    pl.phasen = gross ? modellPhasen(def) : true;
    pl.rand = gross ? { n: 5.6 + m, s: 2.8 + m * 0.5, o: 3.8 + m * 0.5, w: 4.0 + m * 0.6 } : art === "mittel" ? { n: 2.6, s: 1.8, o: 2.2, w: 2.6 } : { n: 1, s: 1, o: 1, w: 1 };
    /* Leitungsgraben: der Bagger steht weiter draußen, der Zaun rückt mit */
    if (gross && !pl.phasen) pl.rand.w += 2.2;
    pl.zaun = { x0: -hx - pl.rand.w, x1: hx + pl.rand.o, y0: -hy - pl.rand.n, y1: hy + pl.rand.s };
    pl.geruest = pl.mit.geruest ? geruestPlan(pl) : null;
    pl.kran = pl.mit.kran ? kranPlan(pl) : null;
    pl.bagger = pl.mit.bagger ? baggerPlan(pl) : null;
    pl.mischer = pl.mit.mischer && pl.gross ? mischerPlan(pl) : null;
    pl.torY = pl.bagger ? pl.bagger.y : null;
    o._bsPlan = pl;
    return pl;
  }

  /* =====================================================================
     DAS GERÜST (Fassadengerüst, Rahmenbauweise)
     Rahmen 0,73 m breit, 2 m hoch, Feldlänge bis 2,6 m, 0,30 m vor der
     Wand. Lagen bei 2,3 · 4,3 · 6,3 m … (Fußspindel + Bohle unten).
     ===================================================================== */
  const G_ABST = 0.3, G_BREITE = 0.73, G_Z0 = 0.3, G_DZ = 2.0, G_ROHR = 0.024;
  function geruestPlan(pl) {
    const W = pl.wand, w = G_BREITE;
    const X0 = W.x0 - G_ABST, X1 = W.x1 + G_ABST, Y0 = W.y0 - G_ABST, Y1 = W.y1 + G_ABST;
    /* Lagen bis unter die Traufe: oberster Belag 1,3 m darunter (Geländer
       bleibt frei vom Dachüberstand), Lagenhöhe um 2 m gleichmäßig verteilt */
    const zTop = Math.max(G_Z0 + 1.5, pl.traufe - 1.3);
    const nT = Math.max(1, Math.round((zTop - G_Z0) / G_DZ));
    const d = (zTop - G_Z0) / nT;
    const zL = [G_Z0];
    for (let k = 1; k <= nT; k++) zL.push(G_Z0 + d * k);
    for (let k = 1; k <= 8; k++) zL.push(zTop + G_DZ * k);
    const giebelX = pl.firstX;         // First entlang x → Giebel an Ost und West
    const def = [
      { name: "n", A: [X0, Y0], B: [X1, Y0], N: [0, -1], giebel: !giebelX },
      { name: "o", A: [X1, Y0], B: [X1, Y1], N: [1, 0], giebel: giebelX },
      { name: "s", A: [X1, Y1], B: [X0, Y1], N: [0, 1], giebel: !giebelX },
      { name: "w", A: [X0, Y1], B: [X0, Y0], N: [-1, 0], giebel: giebelX }
    ];
    /* Dachhöhe über der Giebelwand, v = Abstand von der Firstlinie */
    const dachZ = (v) => Math.max(pl.traufe, pl.first - pl.neig * Math.abs(v));
    const einheiten = [];
    let idx = 0, nMax = nT;
    for (let i = 0; i < 4; i++) {
      const sd = def[i];
      const L = Math.hypot(sd.B[0] - sd.A[0], sd.B[1] - sd.A[1]);
      const nb = Math.max(1, Math.ceil(L / 2.6));
      const T = [(sd.B[0] - sd.A[0]) / L, (sd.B[1] - sd.A[1]) / L];
      const felder = [];
      for (let j = 0; j < nb; j++) {
        let lv = nT;
        if (sd.giebel) {
          /* gestuft unter dem Ortgang: maßgeblich ist das firstferne Feldende */
          const pa = [sd.A[0] + T[0] * L * j / nb, sd.A[1] + T[1] * L * j / nb], pb = [sd.A[0] + T[0] * L * (j + 1) / nb, sd.A[1] + T[1] * L * (j + 1) / nb];
          const v = giebelX ? Math.max(Math.abs(pa[1]), Math.abs(pb[1])) : Math.max(Math.abs(pa[0]), Math.abs(pb[0]));
          const zDach = dachZ(v);
          let k = nT;
          while (k + 1 < zL.length && zL[k + 1] + 1.35 <= zDach) k++;
          lv = k;
        }
        nMax = Math.max(nMax, lv);
        felder.push({ j: j, lv: lv, idx: idx++, diag: nb >= 3 && j % 4 === 1, leiter: (i === 2 && j === nb - 1) || (i === 0 && j === 0 && nb > 2) });
      }
      einheiten.push({ art: "seite", i: i, sd: sd, L: L, nb: nb, T: T, N: sd.N, felder: felder, nT: nT });
      /* Ecke am Ende dieser Seite */
      const nx = def[(i + 1) % 4];
      einheiten.push({ art: "ecke", i: i, C: sd.B, N1: sd.N, N2: nx.N, idx: idx++, lv: nT });
    }
    return { X0: X0, X1: X1, Y0: Y0, Y1: Y1, w: w, nT: nT, nMax: nMax, zL: zL, einheiten: einheiten, anzahl: idx };
  }

  /* Fortschritt eines Felds (Ring-Index i) in Lage k: 0 = nichts, 1 = fertig */
  function geruestQ(pl, GP, i, k, bau) {
    const N = GP.anzahl, nT = GP.nT;
    let t0, dur;
    if (k <= nT) { t0 = Math.max(0.225, 0.24 + 0.48 * (GP.zL[k] - 2.4) / pl.traufe); dur = 0.03; }
    else { t0 = 0.715 + (k - nT - 1) * 0.02; dur = 0.02; }
    const ab0 = 0.952, abDauer = 0.034 / GP.nMax, a0 = ab0 + (GP.nMax - k) * abDauer;
    if (bau >= a0) {
      const f = zw(bau, a0, a0 + abDauer);
      return 1 - klemm((f * (N + 2) - (N - 1 - i)) / 2.2, 0, 1);
    }
    const f = zw(bau, t0, t0 + dur);
    return klemm((f * (N + 2) - i) / 2.2, 0, 1);
  }

  /* Zustand einer Gerüsteinheit als kurze Zeichenkette (für den Bildspeicher) */
  const Q_STUFEN = [0, 0.12, 0.4, 0.5, 0.6, 0.65, 0.8, 0.999];
  function geruestZustand(pl, E, bau) {
    const GP = pl.geruest;
    let z = "";
    const idx = E.art === "seite" ? E.felder.map((fe) => [fe.idx, fe.lv]) : [[E.idx, E.lv]];
    for (const [i, lv] of idx) for (let k = 1; k <= GP.nMax; k++) {
      const q = k <= lv ? geruestQ(pl, GP, i, k, bau) : 0;
      let st = 0;
      for (const thr of Q_STUFEN) if (q > thr) st++;
      z += st;
    }
    return z;
  }
  function geruestLeuteMalen(g, pl, seite) {
    const L = (pl._geruestLeute && pl._geruestLeute[seite]) || [];
    for (const x of L.slice().sort((a, b) => a.lage - b.lage)) { g.save(); x.malen(g); g.restore(); }
  }

  /* Holzbohle (Belag) von oben: Maserung, Stahlkappen, Schnee */
  function bohleMuster(saat, winter, lang) {
    return function (g, L, M) {
      const r = ST.zufall(saat);
      if (M.px > 14) {
        g.lineWidth = Math.max(0.004, 0.8 / M.px);
        for (let i = 0; i < 4; i++) {
          g.strokeStyle = L(mix3(F.bohle, [110, 84, 56], 0.3 + r() * 0.3), 0.35);
          const y = 0.03 + r() * 0.18;
          g.beginPath(); g.moveTo(0, y); g.bezierCurveTo(lang * 0.3, y + (r() - 0.5) * 0.03, lang * 0.6, y + (r() - 0.5) * 0.03, lang, y + (r() - 0.5) * 0.02); g.stroke();
        }
        /* Stahlkappen an den Enden (verzinkte Bänder) */
        g.fillStyle = L(F.kappe);
        g.fillRect(0, -0.01, 0.05, 0.26); g.fillRect(lang - 0.05, -0.01, 0.05, 0.26);
        if (M.px > 60) {
          g.fillStyle = L([90, 94, 100]);
          for (const x of [0.025, lang - 0.025]) for (const y of [0.06, 0.18]) { g.beginPath(); g.arc(x, y, 0.008, 0, TAU); g.fill(); }
        }
      }
      if (winter) {
        /* Schnee: in der Mitte zertreten, am Rand weich */
        g.fillStyle = L(F.schnee, 0.92);
        g.beginPath(); g.moveTo(0.02, 0.02);
        for (let x = 0; x <= lang; x += 0.2) g.lineTo(x, 0.015 + Math.sin(x * 7 + saat) * 0.006);
        g.lineTo(lang - 0.02, 0.225); g.lineTo(0.02, 0.225); g.closePath(); g.fill();
        if (M.px > 10) {
          g.fillStyle = L([188, 184, 180], 0.55);
          for (let x = 0.2 + r() * 0.3; x < lang - 0.2; x += 0.35 + r() * 0.25) { g.beginPath(); g.ellipse(x, 0.12 + (r() - 0.5) * 0.06, 0.1, 0.045, 0, 0, TAU); g.fill(); }
        }
      }
    };
  }
  /* Bordbrett rot-weiß: schräge Warnstreifen */
  function bordMuster(winter) {
    return function (g, L, M) {
      const w = M.w, h = 0.15;
      if (M.px * 0.3 < 3) { g.fillStyle = L(mix3(F.rot, F.weiss, 0.45)); g.fillRect(-0.1, -0.1, w + 0.2, h + 0.2); }
      else {
        g.fillStyle = L(F.weiss); g.fillRect(-0.1, -0.1, w + 0.2, h + 0.2);
        g.fillStyle = L(F.rot);
        for (let x = -0.3; x < w + 0.3; x += 0.5) { g.beginPath(); g.moveTo(x, h + 0.02); g.lineTo(x + 0.25, h + 0.02); g.lineTo(x + 0.25 + 0.17, -0.02); g.lineTo(x + 0.17, -0.02); g.closePath(); g.fill(); }
        if (M.px > 40) { g.fillStyle = L([0, 0, 0], 0.18); g.fillRect(-0.1, h - 0.012, w + 0.2, 0.02); }
      }
      if (winter) { g.fillStyle = L(F.schnee); g.fillRect(-0.1, -0.1, w + 0.2, 0.125); }
    };
  }

  /* Eine Gerüstseite als Teil: drei Ebenen (fern, mitte, nah) */
  function geruestSeite(K, pl, E, bau) {
    const GP = pl.geruest, sd = E.sd, N = [E.N[0], E.N[1], 0], T = [E.T[0], E.T[1], 0];
    const A = [sd.A[0], sd.A[1], 0], w = G_BREITE;
    const vorn = N[0] * K.ex + N[1] * K.ey > 0;           // Außenseite zeigt zum Betrachter
    const innenP = (j) => add(A, mul(T, E.L * j / E.nb));
    const aussenP = (j) => add(innenP(j), mul(N, w));
    const nb = E.nb;
    /* Fortschritt je Feld und Lage, je Rahmen (Maximum der Nachbarfelder) */
    const Q = E.felder.map((fe) => { const a = [0]; for (let k = 1; k <= GP.nMax; k++) a.push(k <= fe.lv ? geruestQ(pl, GP, fe.idx, k, bau) : 0); return a; });
    const RQ = [];
    for (let j = 0; j <= nb; j++) {
      const a = [0];
      for (let k = 1; k <= GP.nMax; k++) a.push(Math.max(j > 0 ? Q[j - 1][k] : 0, j < nb ? Q[j][k] : 0));
      RQ.push(a);
    }
    if (!Q.some((a) => a.some((x) => x > 0))) return null;
    const fern = new Schicht(K), mitte = new Schicht(K), nah = new Schicht(K);
    const innenS = vorn ? fern : nah, aussenS = vorn ? nah : fern;
    const r = G_ROHR, winter = K.winter;
    const s = K.s, fein = s > 22, sehrFein = s > 60;
    /* ---- Fuß: Unterlagsbohlen und Spindeln ---- */
    for (let j = 0; j <= nb; j++) {
      if (!(RQ[j][1] > 0)) continue;
      const pi = innenP(j), pa = aussenP(j);
      const b0 = add(pi, mul(N, -0.12)), b1 = add(pa, mul(N, 0.12));
      const qv = mul(T, 0.1), z5 = [0, 0, 0.05];
      const oben = [add(add(b0, mul(qv, -1)), z5), add(add(b1, mul(qv, -1)), z5), add(add(b1, qv), z5), add(add(b0, qv), z5)];
      mitte.flaeche(oben, [0, 0, 1], winter ? mix3(F.bohleAlt, F.schnee, 0.55) : F.bohleAlt, { stapel: true, schatten: false });
      mitte.flaeche([add(add(b0, mul(qv, 1)), z5), add(add(b1, mul(qv, 1)), z5), add(b1, qv), add(b0, qv)], T, mul(F.bohleAlt, 0.8), { stapel: true, schatten: false });
      mitte.flaeche([add(add(b0, mul(qv, -1)), z5), add(add(b1, mul(qv, -1)), z5), add(b1, mul(qv, -1)), add(b0, mul(qv, -1))], mul(T, -1), mul(F.bohleAlt, 0.8), { stapel: true, schatten: false });
      if (fein) {
        for (const p of [pi, pa]) mitte.rohr(add(p, [0, 0, 0.05]), add(p, [0, 0, G_Z0]), 0.016, F.stahlDunkel);
      }
    }
    mitte.schnitt();
    /* ---- Beine: innen und außen, Lage für Lage ---- */
    const beinStueck = (Sch, P0, k, q, qOben, aussen) => {
      const z0 = GP.zL[k - 1], z1 = GP.zL[k];
      Sch.rohr(add(P0, [0, 0, z0]), add(P0, [0, 0, z1]), r, F.stahl);
      /* Geländerpfosten über der obersten Lage */
      if (aussen && q > 0.6 && !(qOben > 0)) Sch.rohr(add(P0, [0, 0, z1]), add(P0, [0, 0, z1 + 1.05]), r, F.stahl);
    };
    for (let j = 0; j <= nb; j++) {
      for (let k = 1; k <= GP.nMax; k++) {
        const qk = RQ[j][k];
        if (!(qk > 0)) continue;
        const qo = k < GP.nMax ? RQ[j][k + 1] : 0;
        beinStueck(innenS, innenP(j), k, qk, qo, false);
      }
    }
    innenS.schnitt();
    /* ---- Mitte: Querriegel, Beläge, Leiter, Leute ---- */
    for (let k = 1; k <= GP.nMax; k++) {
      const z = GP.zL[k];
      for (let j = 0; j <= nb; j++) {
        if (!(RQ[j][k] > 0.12)) continue;
        const pi = innenP(j), pa = aussenP(j);
        mitte.rohr(add(pi, [0, 0, z]), add(pa, [0, 0, z]), r * 0.95, F.stahl);
        if (fein) mitte.rohr(add(pi, [0, 0, z - 0.42]), add(add(pi, mul(N, 0.32)), [0, 0, z]), r * 0.7, F.stahl);
      }
    }
    mitte.schnitt();
    const saatS = pl.saat + E.i * 101;
    for (let k = 1; k <= GP.nMax; k++) {
      const z = GP.zL[k] + 0.045;
      for (let j = 0; j < nb; j++) {
        if (!(Q[j][k] > 0.4)) continue;
        const fe = E.felder[j];
        const pa0 = innenP(j), pa1 = innenP(j + 1);
        const lang = E.L / nb;
        for (let b = 0; b < 3; b++) {
          const d0 = 0.005 + b * 0.24, d1 = d0 + 0.235;
          if (fe.leiter && b === 1 && k < fe.lv) {
            /* Durchstieg: Alu-Klappe */
            const p0 = add(pa0, mul(N, d0)), p1 = add(pa1, mul(N, d0)), p2 = add(pa1, mul(N, d1)), p3 = add(pa0, mul(N, d1));
            mitte.flaeche([add(p0, [0, 0, z]), add(p1, [0, 0, z]), add(p2, [0, 0, z]), add(p3, [0, 0, z])], [0, 0, 1], [150, 156, 162], { schatten: false });
            continue;
          }
          const p0 = add(pa0, mul(N, d0)), p1 = add(pa1, mul(N, d0)), p2 = add(pa1, mul(N, d1)), p3 = add(pa0, mul(N, d1));
          const ton = hash(saatS + j * 7, k * 3 + b, 11);
          const alb = mix3(F.bohle, F.bohleAlt, ton * 0.8);
          const oben = [add(p0, [0, 0, z]), add(p1, [0, 0, z]), add(p2, [0, 0, z]), add(p3, [0, 0, z])];
          if (s * 0.24 > 5 || winter) {
            mitte.flaeche(oben, [0, 0, 1], alb, { muster: bohleMuster(saatS + j * 31 + k * 7 + b, winter, lang), lok: { o: oben[0], u: T, v: N } });
          } else mitte.flaeche(oben, [0, 0, 1], winter ? F.schnee : alb, { stapel: true });
          /* Stirnkante der äußeren Bohle */
          if (b === 2) mitte.flaeche([add(p3, [0, 0, z]), add(p2, [0, 0, z]), add(p2, [0, 0, z - 0.05]), add(p3, [0, 0, z - 0.05])].reverse().reverse(), N, mix3(alb, [60, 40, 20], 0.25), { stapel: true, schatten: false });
          if (b === 0) mitte.flaeche([add(p1, [0, 0, z]), add(p0, [0, 0, z]), add(p0, [0, 0, z - 0.05]), add(p1, [0, 0, z - 0.05])], mul(N, -1), mix3(alb, [60, 40, 20], 0.25), { stapel: true, schatten: false });
        }
        mitte.schnitt();
      }
      /* Leiter im Leitergang von Lage k-1 nach k */
      for (let j = 0; j < nb; j++) {
        const fe = E.felder[j];
        if (!fe.leiter || !(Q[j][k] > 0.5) || k > fe.lv) continue;
        const z0 = k === 1 ? 0 : GP.zL[k - 1] + 0.05, z1 = GP.zL[k] + 1.0;
        const lang = E.L / nb, hin = k % 2 === 1;
        const u0 = hin ? 0.25 : lang - 0.25, u1 = hin ? lang * 0.62 : lang * 0.38;
        const dN = 0.36;
        const fuss = add(innenP(j), add(mul(T, u0), mul(N, dN))), kopf = add(innenP(j), add(mul(T, u1 + (u1 - u0) * (1.0 / (GP.zL[k] - z0))), mul(N, dN)));
        const F0 = add(fuss, [0, 0, z0]), F1 = add(kopf, [0, 0, z1]);
        for (const sgn of [-1, 1]) mitte.rohr(add(F0, mul(N, sgn * 0.2)), add(F1, mul(N, sgn * 0.2)), 0.02, [196, 200, 204]);
        const n = Math.round((z1 - z0) / 0.28);
        if (fein) for (let i = 1; i < n; i++) { const P = add(F0, mul(sub(F1, F0), i / n)); mitte.rohr(add(P, mul(N, -0.2)), add(P, mul(N, 0.2)), 0.012, [186, 190, 196], { schatten: false }); }
        mitte.schnitt();
      }

    }
    /* ---- Außenebene: Bordbretter, Beine, Geländer, Diagonalen ---- */
    const bord = new Schicht(K), beine = new Schicht(K), gel = new Schicht(K);
    for (let k = 1; k <= GP.nMax; k++) {
      const z = GP.zL[k] + 0.045;
      for (let j = 0; j < nb; j++) {
        const q = Q[j][k];
        if (!(q > 0.65)) continue;
        const a0 = add(aussenP(j), mul(N, -0.04)), a1 = add(aussenP(j + 1), mul(N, -0.04));
        const pts = [add(a0, [0, 0, z + 0.15]), add(a1, [0, 0, z + 0.15]), add(a1, [0, 0, z]), add(a0, [0, 0, z])];
        bord.flaeche(pts, N, F.weiss, { beidseitig: true, muster: bordMuster(winter), lok: { o: pts[0], u: T, v: [0, 0, -1] } });
        if (winter) bord.flaeche([add(a0, [0, 0, z + 0.152]), add(a1, [0, 0, z + 0.152]), add(add(a1, mul(N, -0.03)), [0, 0, z + 0.152]), add(add(a0, mul(N, -0.03)), [0, 0, z + 0.152])], [0, 0, 1], F.schnee, { stapel: true, schatten: false });
        /* Geländerholm und Zwischenholm */
        const g0 = aussenP(j), g1 = aussenP(j + 1);
        gel.rohr(add(g0, [0, 0, z + 1.0]), add(g1, [0, 0, z + 1.0]), r * 0.95, F.stahl, { schnee: true });
        gel.rohr(add(g0, [0, 0, z + 0.5]), add(g1, [0, 0, z + 0.5]), r * 0.95, F.stahl, { schnee: true });
        if (E.felder[j].diag && q > 0.8) {
          const z0 = k === 1 ? G_Z0 + 0.1 : GP.zL[k - 1], up = k % 2 === 1;
          gel.rohr(add(up ? g0 : g1, [0, 0, z0]), add(up ? g1 : g0, [0, 0, GP.zL[k]]), r * 0.9, F.stahl);
        }
      }
    }
    for (let j = 0; j <= nb; j++) {
      for (let k = 1; k <= GP.nMax; k++) {
        const qk = RQ[j][k];
        if (!(qk > 0)) continue;
        beinStueck(beine, aussenP(j), k, qk, k < GP.nMax ? RQ[j][k + 1] : 0, true);
        if (sehrFein && qk > 0.12) {
          /* Kupplungen an den Holmen */
          const P0 = aussenP(j), z = GP.zL[k];
          for (const dz of [0.5, 1.0]) if (qk > 0.65) beine.rohr(add(P0, [0, 0, z + dz - 0.03]), add(P0, [0, 0, z + dz + 0.03]), r * 1.6, F.stahlDunkel, { schatten: false });
        }
      }
    }
    if (vorn) { aussenS.bl.push(...bord.bl, ...beine.bl, ...gel.bl); aussenS.sch.push(...bord.sch, ...beine.sch, ...gel.sch); }
    else { aussenS.bl.push(...gel.bl, ...beine.bl, ...bord.bl); aussenS.sch.push(...gel.sch, ...beine.sch, ...bord.sch); }
    aussenS.akt = null;
    /* Grundriss des Teils */
    const P0 = innenP(0), P1 = aussenP(nb);
    const bb = [Math.min(P0[0], P1[0]), Math.min(P0[1], P1[1]), Math.max(P0[0], P1[0]), Math.max(P0[1], P1[1])];
    const S = [fern, mitte, nah];
    /* A = Innen/Außen-fern und Beläge, dann die Leute (lebend), B = nahe Ebene */
    return {
      name: "geruest-" + sd.name, bb: bb, z1: GP.zL[GP.nMax] + 1.1, seite: E.i,
      malenA: (g) => { fern.malen(g); mitte.malen(g); },
      malenB: (g) => nah.malen(g),
      malen: (g) => { fern.malen(g); mitte.malen(g); geruestLeuteMalen(g, pl, E.i); nah.malen(g); },
      schatten: (sg) => { for (const x of S) x.schattenMalen(sg); }
    };
  }

  /* Gerüstecke: Eckbein, Riegel, Belag, Bordbretter und Geländer auf den
     beiden Außenkanten */
  function geruestEcke(K, pl, E, bau) {
    const GP = pl.geruest, w = G_BREITE, r = G_ROHR, winter = K.winter;
    const C = [E.C[0], E.C[1], 0], N1 = [E.N1[0], E.N1[1], 0], N2 = [E.N2[0], E.N2[1], 0];
    const Q = [0];
    for (let k = 1; k <= GP.nMax; k++) Q.push(k <= E.lv ? geruestQ(pl, GP, E.idx, k, bau) : 0);
    if (!Q.some((x) => x > 0)) return null;
    const pA = add(C, mul(N1, w)), pB = add(C, mul(N2, w)), pE = add(pA, mul(N2, w));
    const fern = new Schicht(K), mitte = new Schicht(K), nah = new Schicht(K);
    const v1 = N1[0] * K.ex + N1[1] * K.ey > 0, v2 = N2[0] * K.ex + N2[1] * K.ey > 0;
    const S1 = v1 ? nah : fern, S2 = v2 ? nah : fern, SE = (v1 || v2) ? nah : fern;
    for (let k = 1; k <= GP.nMax; k++) {
      const q = Q[k];
      if (!(q > 0)) continue;
      const z0 = GP.zL[k - 1], z1 = GP.zL[k], z = z1 + 0.045;
      SE.rohr(add(pE, [0, 0, z0]), add(pE, [0, 0, z1]), r, F.stahl);
      if (q > 0.6 && !(Q[k + 1] > 0)) SE.rohr(add(pE, [0, 0, z1]), add(pE, [0, 0, z1 + 1.05]), r, F.stahl);
      if (k === 1 && K.s > 22) SE.rohr(add(pE, [0, 0, 0.05]), add(pE, [0, 0, G_Z0]), 0.016, F.stahlDunkel);
      if (q > 0.12) { mitte.rohr(add(pA, [0, 0, z1]), add(pE, [0, 0, z1]), r * 0.95, F.stahl); mitte.rohr(add(pB, [0, 0, z1]), add(pE, [0, 0, z1]), r * 0.95, F.stahl); }
      if (q > 0.4) {
        const pts = [add(C, [0, 0, z]), add(pA, [0, 0, z]), add(pE, [0, 0, z]), add(pB, [0, 0, z])];
        mitte.flaeche(pts, [0, 0, 1], winter ? F.schnee : F.bohle, { beidseitig: true });
      }
      if (q > 0.65) {
        for (const [P0, P1, NN, Sch] of [[pA, pE, N1, S1], [pB, pE, N2, S2]]) {
          const T = nrm(sub(P1, P0));
          const a0 = add(P0, mul(NN, -0.04)), a1 = add(P1, mul(NN, -0.04));
          const pts = [add(a0, [0, 0, z + 0.15]), add(a1, [0, 0, z + 0.15]), add(a1, [0, 0, z]), add(a0, [0, 0, z])];
          Sch.flaeche(pts, NN, F.weiss, { beidseitig: true, muster: bordMuster(winter), lok: { o: pts[0], u: T, v: [0, 0, -1] } });
          Sch.rohr(add(P0, [0, 0, z1 + 1.0]), add(P1, [0, 0, z1 + 1.0]), r * 0.95, F.stahl, { schnee: true });
          Sch.rohr(add(P0, [0, 0, z1 + 0.5]), add(P1, [0, 0, z1 + 0.5]), r * 0.95, F.stahl, { schnee: true });
        }
      }
    }
    const xs = [C[0], pA[0], pB[0], pE[0]], ys = [C[1], pA[1], pB[1], pE[1]];
    const bb = [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
    const S = [fern, mitte, nah];
    return { name: "ecke-" + E.i, bb: bb, z1: GP.zL[GP.nMax] + 1.1, malen: (g) => { for (const x of S) x.malen(g); }, schatten: (sg) => { for (const x of S) x.schattenMalen(sg); } };
  }

  /* =====================================================================
     BAUZAUN mit Planen, Warnschild und Bauschild
     ===================================================================== */
  const ZAUN_H = 2.0;
  function zaunFelder(pl) {
    if (pl._zf) return pl._zf;
    const Zn = pl.zaun, felder = [];
    const ecken = [[Zn.x0, Zn.y0], [Zn.x1, Zn.y0], [Zn.x1, Zn.y1], [Zn.x0, Zn.y1]];
    const namen = ["n", "o", "s", "w"];
    for (let i = 0; i < 4; i++) {
      const A = ecken[i], B = ecken[(i + 1) % 4];
      const L = Math.hypot(B[0] - A[0], B[1] - A[1]);
      const n = Math.max(1, Math.round(L / 3.45));
      const T = [(B[0] - A[0]) / L, (B[1] - A[1]) / L], N = [T[1], -T[0]];
      for (let j = 0; j < n; j++) {
        const u0 = L * j / n, u1 = L * (j + 1) / n;
        /* Tor im Westen: zwei Felder offen (Einfahrt der Fahrzeuge) */
        const mitteU = (u0 + u1) / 2;
        const torU = pl.torY != null ? Zn.y1 - pl.torY : L * 0.62;
        if (namen[i] === "w" && pl.gross && Math.abs(mitteU - torU) < 2.6) { felder.push({ seite: namen[i], tor: true, A: [A[0] + T[0] * u0, A[1] + T[1] * u0], B: [A[0] + T[0] * u1, A[1] + T[1] * u1], T: T, N: N, j: j }); continue; }
        const h = hash(pl.saat + i * 17, j, 5);
        felder.push({
          seite: namen[i], A: [A[0] + T[0] * u0, A[1] + T[1] * u0], B: [A[0] + T[0] * u1, A[1] + T[1] * u1], T: T, N: N, j: j,
          plane: (namen[i] === "n" || namen[i] === "o") ? (j % 3 !== 1) : h < 0.18,
          warn: false
        });
      }
    }
    /* Warnschild neben dem Tor */
    const tor = felder.findIndex((f) => f.tor);
    if (tor > 0 && !felder[tor - 1].tor) felder[tor - 1].warn = true;
    else if (felder.length) felder[felder.length - 1].warn = true;
    pl._zf = felder;
    return felder;
  }
  /* Planenmuster: grünes Gewebe, bei Nähe mit Webstruktur und Ösen */
  function planeMuster(seite, K) {
    return function (g, L, M) {
      const w = M.w, h = 1.8;
      if (M.px > 24) {
        g.strokeStyle = L([20, 60, 40], 0.25); g.lineWidth = Math.max(0.004, 0.6 / M.px);
        g.beginPath();
        for (let x = 0; x < w; x += 0.05) { g.moveTo(x, 0); g.lineTo(x, h); }
        for (let y = 0; y < h; y += 0.05) { g.moveTo(0, y); g.lineTo(w, y); }
        g.stroke();
        g.fillStyle = L([200, 204, 210]);
        for (let x = 0.15; x < w; x += 0.5) for (const y of [0.05, h - 0.05]) { g.beginPath(); g.arc(x, y, 0.018, 0, TAU); g.fill(); }
      }
      /* Falten und Wind: leichte senkrechte Wellen */
      const gr = g.createLinearGradient(0, 0, w, 0);
      for (let i = 0; i <= 8; i++) gr.addColorStop(i / 8, "rgba(0,0,0," + (0.05 + 0.06 * Math.abs(Math.sin(i * 1.7 + seite))).toFixed(3) + ")");
      g.fillStyle = gr; g.fillRect(0, 0, w, h);
      if (K.winter) {
        const gs = g.createLinearGradient(0, h, 0, h - 0.35);
        gs.addColorStop(0, L(F.schnee, 0.95)); gs.addColorStop(1, L(F.schnee, 0));
        g.fillStyle = gs; g.fillRect(0, h - 0.35, w, 0.36);
      }
    };
  }
  function zaunFeld(K, pl, fe, sicht) {
    const S = new Schicht(K);
    const A = [fe.A[0], fe.A[1], 0], B = [fe.B[0], fe.B[1], 0], T = [fe.T[0], fe.T[1], 0], N = [fe.N[0], fe.N[1], 0];
    const winter = K.winter, s = K.s;
    const aussenVorn = N[0] * K.ex + N[1] * K.ey > 0;
    const L = len(sub(B, A));
    const fuss = (P) => {
      /* Betonfuß quer zum Zaun */
      const q = mul(N, 0.35), t = mul(T, 0.11);
      kiste(S, P[0] - Math.abs(q[0]) - Math.abs(t[0]), P[1] - Math.abs(q[1]) - Math.abs(t[1]), 0, P[0] + Math.abs(q[0]) + Math.abs(t[0]), P[1] + Math.abs(q[1]) + Math.abs(t[1]), 0.15, F.zaunFuss, { farben: winter ? { oben: F.schnee } : null });
    };
    if (fe.tor) {
      /* offene Einfahrt: rot-weiße Absperrbake an jeder Seite */
      for (const P of [A, B]) {
        fuss(P);
        S.rohr(add(P, [0, 0, 0.15]), add(P, [0, 0, 1.25]), 0.03, F.weiss);
        S.flaeche([add(P, add(mul(N, 0.05), [0, 0, 1.25])), add(P, add(mul(N, 0.05), [0, 0, 1.25])), add(P, [0, 0, 1.0]), add(P, [0, 0, 1.0])], N, F.rot, { schatten: false });
      }
    } else {
      fuss(A); fuss(B);
      const o = 0.12, z0 = 0.15, z1 = z0 + ZAUN_H;
      const P0 = add(A, mul(T, o)), P1 = add(B, mul(T, -o));
      const pts = [add(P0, [0, 0, z1 - 0.1]), add(P1, [0, 0, z1 - 0.1]), add(P1, [0, 0, z0 + 0.1]), add(P0, [0, 0, z0 + 0.1])];
      const hinterSeite = !aussenVorn;
      /* Gitter: nah fein gezeichnet, fern als Schleier */
      const gitter = (g, K2) => {
        const Pa = K.p(pts[0][0], pts[0][1], pts[0][2]), Pb = K.p(pts[1][0], pts[1][1], pts[1][2]), Pc = K.p(pts[2][0], pts[2][1], pts[2][2]), Pd = K.p(pts[3][0], pts[3][1], pts[3][2]);
        const lU = Math.hypot(Pb[0] - Pa[0], Pb[1] - Pa[1]) / Math.max(0.1, L - 2 * o);
        const f = K.licht(aussenVorn ? N : mul(N, -1), mul(add(A, B), 0.5));
        const farbe = rgbS([F.stahl[0] * f[0], F.stahl[1] * f[1], F.stahl[2] * f[2]]);
        const hoch = z1 - z0 - 0.2;
        if (lU * 0.1 >= 3.5) {
          g.strokeStyle = farbe; g.lineWidth = Math.max(0.5, 0.005 * s); g.globalAlpha = 0.85;
          g.beginPath();
          const n = Math.round((L - 2 * o) / 0.1);
          for (let i = 1; i < n; i++) { const k = i / n; g.moveTo(Pa[0] + (Pb[0] - Pa[0]) * k, Pa[1] + (Pb[1] - Pa[1]) * k); g.lineTo(Pd[0] + (Pc[0] - Pd[0]) * k, Pd[1] + (Pc[1] - Pd[1]) * k); }
          const m = Math.round(hoch / 0.25);
          for (let i = 1; i < m; i++) { const k = i / m; g.moveTo(Pa[0] + (Pd[0] - Pa[0]) * k, Pa[1] + (Pd[1] - Pa[1]) * k); g.lineTo(Pb[0] + (Pc[0] - Pb[0]) * k, Pb[1] + (Pc[1] - Pb[1]) * k); }
          g.stroke();
        } else {
          g.fillStyle = farbe; g.globalAlpha = 0.22;
          g.beginPath(); g.moveTo(Pa[0], Pa[1]); g.lineTo(Pb[0], Pb[1]); g.lineTo(Pc[0], Pc[1]); g.lineTo(Pd[0], Pd[1]); g.closePath(); g.fill();
        }
        g.globalAlpha = 1;
      };
      const plane = () => {
        const p2 = [add(P0, add(mul(N, 0.02), [0, 0, z1 - 0.12])), add(P1, add(mul(N, 0.02), [0, 0, z1 - 0.12])), add(P1, add(mul(N, 0.02), [0, 0, z0 + 0.08])), add(P0, add(mul(N, 0.02), [0, 0, z0 + 0.08]))];
        if (aussenVorn) S.flaeche(p2, N, F.plane, { alpha: 0.9, muster: planeMuster(fe.j + fe.A[0], K), lok: { o: p2[0], u: T, v: [0, 0, -1] } });
        else S.flaeche(p2.slice().reverse().map((x) => x), mul(N, -1), mix3(F.plane, [200, 210, 200], 0.15), { alpha: 0.82 });
      };
      if (fe.plane && hinterSeite) plane();
      S.eigen(gitter);
      /* Rahmenrohr */
      S.rohr(add(P0, [0, 0, z0]), add(P0, [0, 0, z1]), 0.02, F.stahl);
      S.rohr(add(P1, [0, 0, z0]), add(P1, [0, 0, z1]), 0.02, F.stahl);
      S.rohr(add(P0, [0, 0, z1]), add(P1, [0, 0, z1]), 0.02, F.stahl, { schnee: true });
      S.rohr(add(P0, [0, 0, z0 + 0.06]), add(P1, [0, 0, z0 + 0.06]), 0.02, F.stahl);
      S.schatten({ poly: [add(P0, [0, 0, z0]), add(P1, [0, 0, z0]), add(P1, [0, 0, fe.plane ? z1 : z0 + 0.05]), add(P0, [0, 0, fe.plane ? z1 : z0 + 0.05])] });
      if (fe.plane && !hinterSeite) plane();
      /* Schelle an der Stoßstelle */
      if (s > 20) for (const z of [z0 + 0.4, z1 - 0.3]) S.rohr(add(A, [0, 0, z]), add(A, [0, 0, z + 0.07]), 0.035, F.stahlDunkel, { schatten: false });
      if (fe.warn) warnschild(S, K, add(mul(add(P0, P1), 0.5), mul(N, 0.04)), T, N, pl);
    }
    const xs = [A[0], B[0]], ys = [A[1], B[1]];
    return { name: "zaun-" + fe.seite + fe.j, bb: [Math.min(...xs) - 0.36, Math.min(...ys) - 0.36, Math.max(...xs) + 0.36, Math.max(...ys) + 0.36], z1: 2.2, dünn: true, malen: (g) => S.malen(g), schatten: (sg) => S.schattenMalen(sg) };
  }
  /* Gelbes Warnschild „Baustelle – Betreten verboten" (außen am Zaun) */
  function warnschild(S, K, M, T0, N, pl) {
    const w = 0.6, h = 0.42, zU = 1.05;
    const T = kreuz(N, [0, 0, 1]);          // Leserichtung für den Betrachter vor dem Schild
    const o = add(add(M, mul(T, -w / 2)), [0, 0, zU + h]);
    const pts = [o, add(o, mul(T, w)), add(add(o, mul(T, w)), [0, 0, -h]), add(o, [0, 0, -h])];
    S.flaeche(pts, N, F.gelbSchild, {
      muster: function (g, L, Mm) {
        g.strokeStyle = L([20, 20, 20]); g.lineWidth = 0.012; g.strokeRect(0.02, 0.02, w - 0.04, h - 0.04);
        if (Mm.px * 0.05 < 2.5) { g.fillStyle = L([30, 30, 30], 0.6); for (let i = 0; i < 3; i++) g.fillRect(0.08, 0.1 + i * 0.1, w - 0.16, 0.035); return; }
        g.fillStyle = L([20, 20, 20]); g.textAlign = "center"; g.textBaseline = "middle";
        g.font = "bold 0.075px 'DejaVu Sans', sans-serif"; g.fillText("BAUSTELLE", w / 2, 0.1);
        g.font = "bold 0.05px 'DejaVu Sans', sans-serif"; g.fillText("Betreten verboten!", w / 2, 0.2);
        g.font = "0.04px 'DejaVu Sans', sans-serif"; g.fillText("Eltern haften für", w / 2, 0.28); g.fillText("ihre Kinder", w / 2, 0.33);
      },
      lok: { o: o, u: T, v: [0, 0, -1] }
    });
  }

  /* Bauschild auf zwei Pfosten */
  function bauschild(K, pl) {
    const S = new Schicht(K);
    const Zn = pl.zaun, def = pl.def;
    const w = pl.gross ? 3.0 : 1.8, h = pl.gross ? 2.0 : 1.2, zU = pl.gross ? 1.1 : 0.8;
    /* außen vor dem Südzaun, links neben der Mitte, Schrift nach Süden */
    const M = [Zn.x0 + Math.min(4.2, (Zn.x1 - Zn.x0) * 0.3), Zn.y1 + 0.75, 0];
    const T = [1, 0, 0], N = [0, 1, 0];
    const P0 = add(M, [-w / 2 + 0.25, 0, 0]), P1 = add(M, [w / 2 - 0.25, 0, 0]);
    const vorn = K.ey > 0;
    const pfosten = () => {
      for (const P of [P0, P1]) {
        kiste(S, P[0] - 0.06, P[1] - 0.06 - 0.07, 0, P[0] + 0.06, P[1] + 0.06 - 0.07, zU + h + 0.05, F.holz, { farben: K.winter ? { oben: F.schnee } : null });
      }
    };
    if (vorn) pfosten();
    const o = add(add(M, [-w / 2, 0, 0]), [0, 0, zU + h]);
    const pts = [o, add(o, mul(T, w)), add(add(o, mul(T, w)), [0, 0, -h]), add(o, [0, 0, -h])];
    const name = stadtName(), titel = def.name || "Neubau";
    const minuten = def.bauzeit ? Math.round(def.bauzeit / 60) : 0;
    S.flaeche(pts, N, F.weiss, {
      muster: function (g, L, Mm) {
        const px = Mm.px;
        /* Rahmen, Kopfband in Blau mit Wappen */
        g.fillStyle = L(F.blau); g.fillRect(0, 0, w, h * 0.3);
        g.fillStyle = L([200, 200, 196]); g.fillRect(0, h - 0.04, w, 0.04);
        const wx = 0.12 * w / 3, wy = 0.07 * h / 2, ww = 0.3 * w / 3, wh = 0.44 * h / 2;
        g.fillStyle = L([240, 240, 236]);
        g.beginPath(); g.moveTo(wx, wy); g.lineTo(wx + ww, wy); g.lineTo(wx + ww, wy + wh * 0.6); g.quadraticCurveTo(wx + ww, wy + wh, wx + ww / 2, wy + wh * 1.08); g.quadraticCurveTo(wx, wy + wh, wx, wy + wh * 0.6); g.closePath(); g.fill();
        g.fillStyle = L([30, 96, 56]);
        g.beginPath(); g.moveTo(wx + ww / 2, wy + wh * 0.12); g.lineTo(wx + ww * 0.8, wy + wh * 0.78); g.lineTo(wx + ww * 0.2, wy + wh * 0.78); g.closePath(); g.fill();
        if (px * h * 0.08 < 3) {
          g.fillStyle = L([240, 240, 240], 0.8); g.fillRect(w * 0.18, h * 0.08, w * 0.7, h * 0.06); g.fillRect(w * 0.18, h * 0.18, w * 0.55, h * 0.05);
          g.fillStyle = L([60, 60, 70], 0.55); for (let i = 0; i < 4; i++) g.fillRect(w * 0.08, h * (0.42 + i * 0.12), w * (0.8 - i * 0.12), h * 0.05);
          return;
        }
        const fs = h / 2;
        g.textBaseline = "middle"; g.textAlign = "left";
        g.fillStyle = L([250, 250, 250]);
        g.font = "bold " + (0.11 * fs).toFixed(3) + "px 'DejaVu Sans', sans-serif"; g.fillText("Hier baut die", w * 0.16, h * 0.085);
        g.font = "bold " + (0.17 * fs).toFixed(3) + "px 'DejaVu Sans', sans-serif"; g.fillText("Gemeinde " + name, w * 0.16, h * 0.2, w * 0.8);
        g.fillStyle = L([30, 36, 50]);
        g.font = "bold " + (0.16 * fs).toFixed(3) + "px 'DejaVu Sans', sans-serif"; g.fillText("Neubau: " + titel, w * 0.06, h * 0.42, w * 0.9);
        g.font = (0.09 * fs).toFixed(3) + "px 'DejaVu Sans', sans-serif";
        g.fillText("Bauherr: Gemeinde " + name, w * 0.06, h * 0.58, w * 0.88);
        g.fillText("Bauleitung: Bauamt " + name, w * 0.06, h * 0.68, w * 0.88);
        if (minuten) g.fillText("Bauzeit: " + minuten + (minuten === 1 ? " Minute" : " Minuten"), w * 0.06, h * 0.78, w * 0.88);
        g.fillStyle = L([200, 40, 36]); g.font = "bold " + (0.085 * fs).toFixed(3) + "px 'DejaVu Sans', sans-serif";
        g.fillText("Betreten der Baustelle verboten", w * 0.06, h * 0.9, w * 0.88);
        if (K.winter) {
          /* Schnee auf der Oberkante */
          g.fillStyle = L(F.schnee); g.beginPath(); g.moveTo(0, 0.03);
          for (let x = 0; x <= w; x += 0.1) g.lineTo(x, 0.02 + Math.sin(x * 9) * 0.008);
          g.lineTo(w, 0); g.lineTo(0, 0); g.closePath(); g.fill();
        }
      },
      lok: { o: o, u: T, v: [0, 0, -1] }
    });
    /* Rückseite: graue Tafel mit Latten */
    S.flaeche(pts.slice().reverse(), mul(N, -1), [196, 196, 190], {
      muster: function (g, L) { g.fillStyle = L([150, 120, 80]); for (const y of [0.15, h - 0.25]) g.fillRect(0.1, y, w - 0.2, 0.1); }, lok: { o: pts[1], u: mul(T, -1), v: [0, 0, -1] }
    });
    if (K.winter) S.flaeche([add(o, [0, -0.02, 0.03]), add(o, [w, -0.02, 0.03]), add(o, [w, 0.03, 0.03]), add(o, [0, 0.03, 0.03])], [0, 0, 1], F.schnee, { schatten: false });
    if (!vorn) pfosten();
    return { name: "bauschild", bb: [M[0] - w / 2, M[1] - 0.14, M[0] + w / 2, M[1] + 0.06], z1: zU + h, malen: (g) => S.malen(g), schatten: (sg) => S.schattenMalen(sg) };
  }

  /* =====================================================================
     3D-HELFER: gedrehte Quader, Prismen, Rotationskörper, Haufen
     ===================================================================== */
  /* Quader mit Mitte M, Achsen A, B, C (Einheitsvektoren) und halben
     Kantenlängen a, b, c. opt.muster = { "A+": fn, … }, opt.ohne = […] */
  function quaderR(S, M, A, B, C, a, b, c, alb, opt) {
    opt = opt || {};
    const P = (i, j, k) => add(M, add(mul(A, a * i), add(mul(B, b * j), mul(C, c * k))));
    /* Flächen-Achsen so, dass u × v = Außennormale (Schrift nie gespiegelt) */
    const fl = [
      ["A+", A, [P(1, 1, 1), P(1, -1, 1), P(1, -1, -1), P(1, 1, -1)], mul(B, -1), mul(C, -1)],
      ["A-", mul(A, -1), [P(-1, -1, 1), P(-1, 1, 1), P(-1, 1, -1), P(-1, -1, -1)], B, mul(C, -1)],
      ["B+", B, [P(-1, 1, 1), P(1, 1, 1), P(1, 1, -1), P(-1, 1, -1)], A, mul(C, -1)],
      ["B-", mul(B, -1), [P(1, -1, 1), P(-1, -1, 1), P(-1, -1, -1), P(1, -1, -1)], mul(A, -1), mul(C, -1)],
      ["C+", C, [P(-1, -1, 1), P(1, -1, 1), P(1, 1, 1), P(-1, 1, 1)], A, B],
      ["C-", mul(C, -1), [P(-1, 1, -1), P(1, 1, -1), P(1, -1, -1), P(-1, -1, -1)], A, mul(B, -1)]
    ];
    for (const [name, n, pts, u, v] of fl) {
      if (opt.ohne && opt.ohne.indexOf(name) >= 0) continue;
      const mu = opt.muster && opt.muster[name];
      const farbe = (opt.farben && opt.farben[name]) || alb;
      S.flaeche(pts, n, farbe, { muster: mu, lok: mu ? { o: pts[0], u: u, v: v } : null, schatten: opt.schatten, stapel: !mu && opt.stapel, alpha: opt.alpha, leucht: opt.leucht && opt.leucht[name] });
    }
  }
  /* Balken von p nach q mit Querschnitt b (quer, Richtung seit) × h */
  function balken(S, p, q, b, h, seit, alb, opt) {
    const d = sub(q, p), L = len(d);
    if (L < 1e-3) return;
    const A = mul(d, 1 / L);
    let B = sub(seit, mul(A, dot(seit, A)));
    B = len(B) < 1e-3 ? nrm(kreuz(A, [0, 0, 1])) : nrm(B);
    const C = kreuz(A, B);
    quaderR(S, mul(add(p, q), 0.5), A, B, C, L / 2, b / 2, h / 2, alb, opt);
  }
  /* Prisma: Grundriss pts (2D in der Ebene U,V um O), entlang D um L gezogen */
  function prisma(S, O, U, V, pts, D, L, alb, opt) {
    opt = opt || {};
    const base = pts.map((p) => add(O, add(mul(U, p[0]), mul(V, p[1]))));
    const top = base.map((p) => add(p, mul(D, L)));
    let c = [0, 0, 0];
    for (const p of base) c = add(c, p);
    c = mul(c, 1 / base.length);
    const n = base.length;
    for (let i = 0; i < n; i++) {
      const a = base[i], b = base[(i + 1) % n];
      if (len(sub(b, a)) < 1e-4) continue;
      let nn = nrm(kreuz(sub(b, a), D));
      if (dot(nn, sub(mul(add(a, b), 0.5), c)) < 0) nn = mul(nn, -1);
      const farbe = opt.seite ? opt.seite(i, nn) : alb;
      if (!farbe) continue;
      const mu = opt.seitenMuster ? opt.seitenMuster(i, nn) : null;
      S.flaeche([a, b, top[(i + 1) % n], top[i]], nn, farbe, { schatten: opt.schatten, muster: mu, lok: mu ? { o: a, u: nrm(sub(b, a)), v: D } : null });
    }
    if (opt.deckel !== false) {
      const df = opt.deckelFarbe || alb;
      S.flaeche(base, mul(D, -1), df, { schatten: false, muster: opt.deckelMuster, lok: opt.deckelMuster ? { o: O, u: U, v: V } : null });
      S.flaeche(top, D, df, { schatten: false, muster: opt.deckelMuster, lok: opt.deckelMuster ? { o: add(O, mul(D, L)), u: U, v: V } : null });
    }
  }
  /* Konvexe Hülle von Bildpunkten [[x,y], …] */
  function huelle2(pts) {
    const P = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    if (P.length < 3) return P;
    const kr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lo = [], hi = [];
    for (const p of P) { while (lo.length >= 2 && kr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
    for (let i = P.length - 1; i >= 0; i--) { const p = P[i]; while (hi.length >= 2 && kr(hi[hi.length - 2], hi[hi.length - 1], p) <= 0) hi.pop(); hi.push(p); }
    hi.pop(); lo.pop();
    return lo.concat(hi);
  }
  function achsen(a) {
    const h = Math.abs(a[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0];
    const e1 = nrm(kreuz(a, h));
    return [e1, kreuz(a, e1)];
  }
  /* Rotationskörper (Trommel, Rad, Seiltrommel): Achse A→B, Profil [[t, r], …].
     Umriss = Hülle der Kreise, quer zur Achse wie ein Zylinder schattiert.
     opt.streifen = { n, windungen, breite, farbe, phase } (Mischtrommel),
     opt.deckel = Farbe der sichtbaren Stirnseite, opt.deckelMalen(g, K, C, e1, e2, r) */
  function walze(S, A, B, prof, alb, opt) {
    opt = opt || {};
    S.eigen((g, K) => walzeMalen(g, K, A, B, prof, alb, opt));
    if (opt.schatten !== false) S.schatten({ fn: (sg, K) => walzeSchatten(sg, K, A, B, prof) });
  }
  function walzePunkte(K, A, B, prof, sp) {
    const ax = sub(B, A), a = nrm(ax), [e1, e2] = achsen(a);
    const rmax = prof.reduce((m, p) => Math.max(m, p[1]), 0);
    const n = rmax * K.s > 40 ? 36 : rmax * K.s > 12 ? 22 : 12;
    const pts = [];
    for (const [t, r] of prof) {
      const C = add(A, mul(ax, t));
      for (let i = 0; i < n; i++) {
        const w = i / n * TAU, p = add(C, add(mul(e1, Math.cos(w) * r), mul(e2, Math.sin(w) * r)));
        pts.push(sp ? K.sp(p[0], p[1], p[2]) : K.p(p[0], p[1], p[2]));
      }
    }
    return pts;
  }
  function walzeSchatten(sg, K, A, B, prof) {
    const h = huelle2(walzePunkte(K, A, B, prof, true));
    sg.beginPath(); h.forEach((p, i) => (i ? sg.lineTo(p[0], p[1]) : sg.moveTo(p[0], p[1]))); sg.closePath(); sg.fill();
  }
  function walzeMalen(g, K, A, B, prof, alb, opt) {
    const ax = sub(B, A), L = len(ax), a = mul(ax, 1 / L), [e1, e2] = achsen(a);
    const rmax = prof.reduce((m, p) => Math.max(m, p[1]), 0);
    if (rmax * K.s < 0.4) return;
    const h = huelle2(walzePunkte(K, A, B, prof, false));
    const pfad = () => { g.beginPath(); h.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.closePath(); };
    pfad();
    const E = K.E, M = add(A, mul(ax, 0.5));
    let Vp = sub(E, mul(a, dot(E, a)));
    const lv = len(Vp);
    const farbeN = (n, p) => { const f = K.licht(n, p); return rgbS([alb[0] * f[0], alb[1] * f[1], alb[2] * f[2]]); };
    if (lv > 0.15) {
      Vp = mul(Vp, 1 / lv);
      const Sd = nrm(kreuz(a, Vp));
      const P0 = K.p(...add(M, mul(Sd, -rmax))), P1 = K.p(...add(M, mul(Sd, rmax)));
      const gr = g.createLinearGradient(P0[0], P0[1], P1[0], P1[1]);
      for (const tq of [-1, -0.8, -0.45, 0, 0.45, 0.8, 1]) gr.addColorStop((tq + 1) / 2, farbeN(add(mul(Sd, tq), mul(Vp, Math.sqrt(1 - tq * tq))), M));
      g.fillStyle = gr;
    } else g.fillStyle = farbeN(dot(a, E) > 0 ? a : mul(a, -1), M);
    g.fill();
    if (opt.streifen && rmax * K.s > 3) {
      const st = opt.streifen;
      g.save(); pfad(); g.clip();
      g.lineCap = "round";
      const n = 36;
      for (let k = 0; k < st.n; k++) {
        let alt = null;
        for (let i = 0; i <= n; i++) {
          const t = i / n;
          let r = 0;
          for (let j = 0; j < prof.length - 1; j++) if (t >= prof[j][0] && t <= prof[j + 1][0]) { const u = (t - prof[j][0]) / Math.max(1e-6, prof[j + 1][0] - prof[j][0]); r = lerp(prof[j][1], prof[j + 1][1], u); }
          const w = st.phase + TAU * (k / st.n + st.windungen * t);
          const nn = add(mul(e1, Math.cos(w)), mul(e2, Math.sin(w)));
          const p = add(add(A, mul(ax, t)), mul(nn, r * 1.005));
          const sicht = dot(nn, E);
          const P = K.p(p[0], p[1], p[2]);
          if (alt && sicht > 0.02 && alt.s > 0.02) {
            const f = K.licht(nn, p);
            g.strokeStyle = rgbS([st.farbe[0] * f[0], st.farbe[1] * f[1], st.farbe[2] * f[2]]);
            g.lineWidth = Math.max(0.7, st.breite * K.s * Math.min(1, 0.35 + sicht));
            g.beginPath(); g.moveTo(alt.P[0], alt.P[1]); g.lineTo(P[0], P[1]); g.stroke();
          }
          alt = { P: P, s: sicht };
        }
      }
      g.restore();
    }
    if (opt.deckel) {
      /* sichtbare Stirnseite */
      const vorn = dot(a, E) > 0;
      const [t, r] = vorn ? prof[prof.length - 1] : prof[0];
      const C = add(A, mul(ax, t)), nD = vorn ? a : mul(a, -1);
      if (Math.abs(dot(a, E)) > 0.03) {
        const n = r * K.s > 30 ? 32 : 18;
        g.beginPath();
        for (let i = 0; i < n; i++) { const w = i / n * TAU, p = add(C, add(mul(e1, Math.cos(w) * r), mul(e2, Math.sin(w) * r))), P = K.p(p[0], p[1], p[2]); if (i) g.lineTo(P[0], P[1]); else g.moveTo(P[0], P[1]); }
        g.closePath();
        g.fillStyle = K.farbe(opt.deckel, nD, C); g.fill();
        if (opt.deckelMalen) opt.deckelMalen(g, K, C, e1, e2, r, nD);
      }
    }
  }
  /* Ellipse eines Kreises (Mitte C, Achsen e1, e2, Radius r) als Pfad */
  function kreisPfad(g, K, C, e1, e2, r) {
    const n = r * K.s > 30 ? 28 : 14;
    g.beginPath();
    for (let i = 0; i < n; i++) { const w = i / n * TAU, p = add(C, add(mul(e1, Math.cos(w) * r), mul(e2, Math.sin(w) * r))), P = K.p(p[0], p[1], p[2]); if (i) g.lineTo(P[0], P[1]); else g.moveTo(P[0], P[1]); }
    g.closePath();
  }
  /* Rad: Reifen (Gummi) mit Felge und Nabe, Achse A→B */
  function rad(S, A, B, r, felge, opt) {
    opt = opt || {};
    walze(S, A, B, [[0, r * 0.9], [0.12, r], [0.88, r], [1, r * 0.9]], F.gummi, {
      deckel: F.gummi,
      deckelMalen: function (g, K, C, e1, e2, rr, nD) {
        const f = K.licht(nD, C);
        g.fillStyle = rgbS([felge[0] * f[0], felge[1] * f[1], felge[2] * f[2]]);
        kreisPfad(g, K, C, e1, e2, rr * 0.62); g.fill();
        g.fillStyle = rgbS([felge[0] * f[0] * 0.55, felge[1] * f[1] * 0.55, felge[2] * f[2] * 0.55]);
        kreisPfad(g, K, add(C, mul(nD, 0.01)), e1, e2, rr * 0.22); g.fill();
        if (rr * K.s > 10) {
          g.fillStyle = rgbS([60, 60, 60], 0.8);
          for (let i = 0; i < 6; i++) { const w = i / 6 * TAU, p = add(C, add(mul(e1, Math.cos(w) * rr * 0.4), mul(e2, Math.sin(w) * rr * 0.4))), P = K.p(p[0], p[1], p[2]); g.beginPath(); g.arc(P[0], P[1], Math.max(0.6, rr * K.s * 0.04), 0, TAU); g.fill(); }
        }
        if (opt.schnee && K.winter) { g.strokeStyle = rgbS(mul(F.schnee, 0.9), 0.8); g.lineWidth = Math.max(0.6, rr * K.s * 0.08); kreisPfad(g, K, C, e1, e2, rr * 0.96); g.stroke(); }
      }
    });
  }
  /* Erd-, Sand- oder Kieshaufen aus Dreiecksfacetten, jede mit eigenem Licht */
  function haufen(S, K, cx, cy, rx, ry, h, farbe, saat, opt) {
    opt = opt || {};
    if (h < 0.03) return;
    const r = ST.zufall(saat), N = 12;
    const r0 = [], r1 = [];
    for (let i = 0; i < N; i++) {
      const a = i / N * TAU, f0 = 1 + (r() - 0.5) * 0.24, f1 = 0.5 + (r() - 0.5) * 0.16;
      r0.push([cx + Math.cos(a) * rx * f0, cy + Math.sin(a) * ry * f0, 0]);
      r1.push([cx + Math.cos(a + 0.13) * rx * f1, cy + Math.sin(a + 0.13) * ry * f1, h * (0.62 + (r() - 0.5) * 0.14)]);
    }
    const top = [cx + (r() - 0.5) * rx * 0.15, cy + (r() - 0.5) * ry * 0.15, h];
    const schnee = opt.schnee ? opt.schnee : 0;
    const dreieck = (a, b, c, i) => {
      let n = nrm(kreuz(sub(b, a), sub(c, a)));
      if (n[2] < 0) n = mul(n, -1);
      const zM = (a[2] + b[2] + c[2]) / 3;
      let alb = mix3(farbe, mul(farbe, 0.8 + 0.3 * hash(saat, i, 3)), 0.6);
      if (schnee > 0 && n[2] > 0.45) alb = mix3(alb, F.schnee, klemm(schnee * (0.55 + zM / h * 0.6), 0, 0.95));
      S.flaeche([a, b, c], n, alb, { stapel: !opt.muster, muster: opt.muster, lok: opt.muster ? lokVon([a, b, c]) : null });
    };
    for (let i = 0; i < N; i++) {
      const j = (i + 1) % N;
      dreieck(r0[i], r0[j], r1[j], i * 3);
      dreieck(r0[i], r1[j], r1[i], i * 3 + 1);
      dreieck(r1[i], r1[j], top, i * 3 + 2);
    }
  }

  /* =====================================================================
     DER TURMDREHKRAN (Obendreher)
     XANDER: „wenn der Bagger dann kommt und damit baut und dass man sieht
     wie das entsteht" – ab 0,30 steht der Kran: Gittermast auf einem
     Kreuzfundament mit Ballast, oben Drehbühne mit Führerhaus, Turmspitze,
     Ausleger mit Laufkatze, Gegenausleger mit Ballastplatten und Winde.
     Er schwenkt langsam zum Lager, der Anschläger hängt die Last an, sie
     schwebt zum Haus und wird oben abgesetzt.
     ===================================================================== */
  function kranPlan(pl) {
    const W = pl.wand, Zn = pl.zaun;
    const a = pl.H > 22 ? 1.6 : 1.3;
    const x = lerp(W.x0, W.x1, 0.28);
    const y = Math.max(Zn.y0 + 1.9, W.y0 - G_ABST - G_BREITE - 2.1);
    const Hm = Math.max(pl.first + 6, pl.H + 4, 12);
    let weit = 0;
    for (const [cx, cy] of [[W.x0, W.y0], [W.x1, W.y0], [W.x1, W.y1], [W.x0, W.y1]]) weit = Math.max(weit, Math.hypot(cx - x, cy - y));
    const Lj = klemm(weit + 2.2, 15, 55), Lg = 0.3 * Lj + 1.6;
    /* Abholplatz am Lager (Ziegelpalette, Balkenbündel) */
    const depot = [Math.min(Zn.x1 - 2.2, x + 5.2), Math.max(Zn.y0 + 1.1, y - 1.0)];
    return { x: x, y: y, a: a, Hm: Hm, Lj: Lj, Lg: Lg, depot: depot, kopf: 4.4 + a * 0.4 };
  }
  /* Geschätzte Oberkante des Rohbaus (für Gerüst, Hakenziel) */
  function oberkante(pl, bau) {
    if (bau < 0.22) return 0;
    if (bau < 0.32) return 1.2 * zw(bau, 0.22, 0.32);
    if (bau < 0.72) return lerp(1.2, pl.traufe, zw(bau, 0.32, 0.72));
    return lerp(pl.traufe, pl.first, zw(bau, 0.72, 0.8));
  }
  const winkelDiff = (a, b) => { let d = a - b; while (d > Math.PI) d -= TAU; while (d < -Math.PI) d += TAU; return d; };
  function kranZustand(K, pl, KP, bau) {
    const t = K.t + (pl.saat % 53) * 1.9;
    const T = 44, zyk = Math.floor(t / T), u = t - zyk * T;
    const W = pl.wand;
    /* Ziel über dem Haus: Punkte im Grundriss, je Hub ein anderer */
    const ziele = [[0.5, 0.5], [0.72, 0.62], [0.3, 0.4], [0.62, 0.3], [0.38, 0.7]];
    const zi = ziele[((zyk % ziele.length) + ziele.length) % ziele.length];
    const zB = bau < 0.9 ? [lerp(W.x0, W.x1, zi[0]), lerp(W.y0, W.y1, zi[1])] : [W.x1 + 2.2, lerp(W.y0, W.y1, 0.6)];
    const pol = (p) => ({ phi: Math.atan2(p[1] - KP.y, p[0] - KP.x), r: klemm(Math.hypot(p[0] - KP.x, p[1] - KP.y), 2.4, KP.Lj - 0.7) });
    const A = pol(KP.depot), B = pol(zB);
    const arten = bau < 0.72 ? ["balken", "ziegel", "balken", "latten"] : bau < 0.9 ? ["dach", "latten", "dach", "balken"] : ["ziegel", "balken"];
    const art = arten[((zyk % arten.length) + arten.length) % arten.length];
    const lastH = art === "balken" ? 0.5 : art === "latten" ? 0.4 : 0.95;
    const seil = 1.25;                         // Anschlagketten: Haken über der Last
    const hoch = KP.Hm - 2.4;                  // Hakenhöhe beim Schwenken
    const zDep = lastH + seil + 0.15;
    const zAb = (bau < 0.9 ? oberkante(pl, bau) + 0.6 : 0) + lastH + seil + 0.15;
    const dB = winkelDiff(B.phi, A.phi);
    const sw = (k) => glatt(k);
    let phi, r, zh, last = null;
    const lastBei = (pos, alpha) => ({ art: art, pos: pos, alpha: alpha, h: lastH, seil: seil, schnee: K.winter && true });
    if (u < 8) {                     // leer zum Lager schwenken
      const k = sw(u / 8); phi = B.phi - dB * k; r = lerp(B.r, A.r, k); zh = hoch;
      last = lastBei(null, 1);
    } else if (u < 12) {             // Haken senken
      phi = A.phi; r = A.r; zh = lerp(hoch, zDep, sw((u - 8) / 4)); last = lastBei(null, 1);
    } else if (u < 15) {             // anschlagen
      phi = A.phi; r = A.r; zh = zDep; last = lastBei(null, 1);
    } else if (u < 19.5) {           // heben
      phi = A.phi; r = A.r; zh = lerp(zDep, hoch, sw((u - 15) / 4.5)); last = lastBei("haken", 1);
    } else if (u < 29) {             // zum Haus schwenken
      const k = sw((u - 19.5) / 9.5); phi = A.phi + dB * k; r = lerp(A.r, B.r, k); zh = hoch; last = lastBei("haken", 1);
    } else if (u < 33.5) {           // absenken
      phi = B.phi; r = B.r; zh = lerp(hoch, zAb, sw((u - 29) / 4.5)); last = lastBei("haken", 1);
    } else if (u < 37) {             // absetzen, abschlagen
      phi = B.phi; r = B.r; zh = zAb - 0.45 * sw((u - 33.5) / 1.5); last = lastBei("haken", u < 35 ? 1 : 1 - zw(u, 35, 37));
    } else {                         // leer hoch
      phi = B.phi; r = B.r; zh = lerp(zAb - 0.45, hoch, sw((u - 37) / 5)); last = null;
    }
    if (last && last.pos === null) last.pos = "lager";
    return { phi: phi, r: r, zh: zh, last: last, u: u, anschlagen: u >= 8 && u < 17, schwenk: (u < 8) || (u >= 19.5 && u < 29) };
  }

  function kranTeile(K, pl, bau, teile, art) {
    const KP = pl.kran;
    if (!KP) return;
    const auf = zw(bau, 0.262, 0.3), ab = zw(bau, 0.958, 0.985);
    if (auf <= 0 || ab >= 1) { pl._kranZ = null; return; }
    if (art === "fest") {
      const nSek = Math.max(5, Math.round(KP.Hm / KP.a));
      const sekH = KP.Hm / nSek;
      const nSicht = bau < 0.3 ? Math.floor(auf * nSek + 1e-6) : bau < 0.958 ? nSek : Math.ceil((1 - ab) * nSek - 1e-6);
      teile("kranfuss", "", () => kranFuss(K, pl, KP));
      if (nSicht > 0) teile("kranmast", String(nSicht), () => kranMast(K, pl, KP, nSicht, sekH));
      return;
    }
    if (bau >= 0.3 && bau < 0.958) {
      const Z = kranZustand(K, pl, KP, bau);
      pl._kranZ = Z;
      /* Der Oberkran hängt nur an Drehwinkel und Katzstellung: steht er
         still (anschlagen, heben, senken), wird er nicht neu gebaut, und
         klein gezoomt liegt er als fertiges Bild bereit */
      const schl = Z.phi.toFixed(4) + "|" + Z.r.toFixed(3) + "|" + kameraSchl(K);
      let ob = pl._kranOben;
      if (!ob || ob.schl !== schl) {
        const it = kranOben(K, pl, KP, Z);
        ob = pl._kranOben = { schl: schl, it: it, bild: ob ? ob.bild : null, sbild: ob ? ob.sbild : null };
        if (!Z.schwenk && K.s < STUFE_S) alsBild(K, it, ob);
      }
      teile.push(ob.it);
      const h = kranHaken(K, pl, KP, Z, bau);
      if (h) teile.push(h);
    } else pl._kranZ = null;
  }
  function kranFuss(K, pl, KP) {
    const S = new Schicht(K), x = KP.x, y = KP.y, L = 2.1, winter = K.winter;
    /* Kreuzrahmen aus zwei Trägern, vier Ballastblöcke, Fußstück */
    kiste(S, x - L, y - 0.22, 0, x + L, y + 0.22, 0.42, [70, 72, 76], { farben: winter ? { oben: [214, 218, 224] } : null });
    kiste(S, x - 0.22, y - L, 0, x + 0.22, y + L, 0.45, [70, 72, 76], { farben: winter ? { oben: [214, 218, 224] } : null });
    const bl = 0.6;
    for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      const cx = x + sx * 1.2, cy = y + sy * 1.2;
      for (let k = 0; k < 2; k++) {
        const z0 = k * 0.46, z1 = z0 + 0.44;
        const alb = mix3([128, 126, 120], [150, 140, 126], hash(pl.saat, sx * 3 + sy + k, 7) * 0.5);
        kiste(S, cx - bl, cy - bl, z0, cx + bl, cy + bl, z1, alb, {
          muster: K.s > 16 ? Object.assign({ sued: kanteBeton, nord: kanteBeton, ost: kanteBeton, west: kanteBeton }, k === 1 ? { oben: ballastOben(winter, sx * 7 + sy) } : {}) : null
        });
      }
    }
    return { name: "kran-fuss", bb: [x - L - 0.05, y - L - 0.05, x + L + 0.05, y + L + 0.05], z1: 1.1, malen: (g) => S.malen(g), schatten: (sg) => S.schattenMalen(sg) };
  }
  /* Oberseite eines Ballastblocks: Beton mit Hebeösen, im Winter eine
     Schneedecke, die nicht ganz bis an die Kanten reicht */
  function ballastOben(winter, saat) {
    return function (g, L, M) {
      const w = M.w || 1.2, h = M.h || 1.2;
      g.fillStyle = L([70, 70, 72]);
      for (const [a, b] of [[0.25, 0.25], [w - 0.25, h - 0.25]]) { g.beginPath(); g.arc(a, b, 0.05, 0, TAU); g.fill(); }
      if (winter) {
        const r = ST.zufall(saat + 50);
        g.fillStyle = L(F.schnee, 0.95);
        g.beginPath();
        const n = 14;
        for (let i = 0; i < n; i++) {
          const a = i / n * TAU, rr = 0.5 + r() * 0.06;
          const x = w / 2 + Math.cos(a) * Math.min(w / 2 - 0.05, rr * w * 0.95), y = h / 2 + Math.sin(a) * Math.min(h / 2 - 0.05, rr * h * 0.95);
          if (i) g.lineTo(x, y); else g.moveTo(x, y);
        }
        g.closePath(); g.fill();
      }
    };
  }
  function kanteBeton(g, L, M) {
    g.strokeStyle = L([90, 88, 84], 0.5); g.lineWidth = Math.max(0.005, 1 / M.px);
    g.strokeRect(0.02, 0.02, (M.w || 1.2) - 0.04, (M.h || 0.5) - 0.04);
    if (M.px > 40) { g.fillStyle = L([110, 108, 104], 0.5); for (let i = 0; i < 6; i++) { g.beginPath(); g.arc(0.1 + i * 0.19, 0.12 + (i % 2) * 0.2, 0.012, 0, TAU); g.fill(); } }
  }
  function kranMast(K, pl, KP, n, sekH) {
    const S = new Schicht(K);
    const a2 = KP.a / 2, x = KP.x, y = KP.y, z0 = 0.9, gelb = F.krangelb;
    const E = [[x - a2, y - a2], [x + a2, y - a2], [x + a2, y + a2], [x - a2, y + a2]];
    const seiten = [{ i0: 0, i1: 1, N: [0, -1] }, { i0: 1, i1: 2, N: [1, 0] }, { i0: 2, i1: 3, N: [0, 1] }, { i0: 3, i1: 0, N: [-1, 0] }];
    const hTop = z0 + n * sekH;
    const fein = K.s > 16;
    const verband = (sd) => {
      const P = E[sd.i0], Q = E[sd.i1];
      for (let i = 0; i < n; i++) {
        const za = z0 + i * sekH, zb = za + sekH;
        S.rohr([P[0], P[1], za], [Q[0], Q[1], za], 0.026, gelb, { schnee: true });
        if (i % 2) S.rohr([P[0], P[1], za], [Q[0], Q[1], zb], 0.024, gelb);
        else S.rohr([Q[0], Q[1], za], [P[0], P[1], zb], 0.024, gelb);
      }
      S.rohr([P[0], P[1], hTop], [Q[0], Q[1], hTop], 0.026, gelb);
    };
    const vorn = (sd) => sd.N[0] * K.ex + sd.N[1] * K.ey > 0;
    /* Fußstück (Übergang zum Kreuz) */
    kiste(S, x - a2 - 0.1, y - a2 - 0.1, 0.4, x + a2 + 0.1, y + a2 + 0.1, z0, gelb);
    for (const sd of seiten) if (!vorn(sd)) verband(sd);
    S.schnitt();
    /* Steigleiter innen */
    if (fein) {
      const lx = x - a2 * 0.3, ly = y + a2 * 0.55;
      S.rohr([lx - 0.2, ly, z0], [lx - 0.2, ly, hTop], 0.018, [90, 94, 98]);
      S.rohr([lx + 0.2, ly, z0], [lx + 0.2, ly, hTop], 0.018, [90, 94, 98]);
      if (K.s > 34) for (let z = z0 + 0.3; z < hTop; z += 0.3) S.rohr([lx - 0.2, ly, z], [lx + 0.2, ly, z], 0.01, [90, 94, 98], { schatten: false });
    }
    S.schnitt();
    const eck = E.map((p, i) => ({ p: p, t: K.tiefe(p[0], p[1], 0), i: i })).sort((u, v) => u.t - v.t);
    for (const e of eck) S.rohr([e.p[0], e.p[1], z0], [e.p[0], e.p[1], hTop], 0.058, gelb);
    S.schnitt();
    for (const sd of seiten) if (vorn(sd)) verband(sd);
    return { name: "kran-mast", bb: [x - a2, y - a2, x + a2, y + a2], z1: hTop, malen: (g) => S.malen(g), schatten: (sg) => S.schattenMalen(sg) };
  }

  /* Glasfläche (Führerhaus): dunkles Glas mit Himmelsspiegelung, Rahmen,
     dahinter schemenhaft der Fahrer */
  function glasMuster(mitFahrer, helm) {
    return function (g, L, M) {
      const w = M.w, h = M.h, K = M.K;
      g.fillStyle = L([46, 58, 68]); g.fillRect(-0.05, -0.05, w + 0.1, h + 0.1);
      if (mitFahrer && M.px > 6) {
        g.fillStyle = L([30, 34, 40]);
        g.beginPath(); g.ellipse(w * 0.5, h * 0.72, w * 0.26, h * 0.3, 0, 0, TAU); g.fill();
        g.fillStyle = L([150, 120, 100], 0.8);
        g.beginPath(); g.ellipse(w * 0.5, h * 0.42, w * 0.09, h * 0.1, 0, 0, TAU); g.fill();
        g.fillStyle = L(helm || [240, 190, 30]);
        g.beginPath(); g.ellipse(w * 0.5, h * 0.35, w * 0.1, h * 0.06, 0, Math.PI, TAU); g.fill();
      }
      /* Spiegelung: schräges helles Band */
      const nacht = K.nacht;
      const gr = g.createLinearGradient(0, 0, w, h);
      const hell = nacht > 0.5 ? "rgba(120,140,180," : "rgba(210,226,244,";
      gr.addColorStop(0, hell + "0.45)"); gr.addColorStop(0.35, hell + "0.12)"); gr.addColorStop(0.5, hell + "0.3)"); gr.addColorStop(0.62, hell + "0.06)"); gr.addColorStop(1, hell + "0.18)");
      g.fillStyle = gr; g.fillRect(0, 0, w, h);
      if (nacht > 0.3) { g.fillStyle = "rgba(255,210,140," + (0.25 * nacht).toFixed(3) + ")"; g.fillRect(0, 0, w, h); }
      g.strokeStyle = L([40, 40, 44]); g.lineWidth = Math.max(0.02, 1.2 / M.px); g.strokeRect(0.02, 0.02, w - 0.04, h - 0.04);
    };
  }

  function kranOben(K, pl, KP, Z) {
    const x = KP.x, y = KP.y, zR = KP.Hm + 0.9, zJ = zR + 0.75, gelb = F.krangelb, winter = K.winter;
    const D = [Math.cos(Z.phi), Math.sin(Z.phi), 0], Wd = [-Math.sin(Z.phi), Math.cos(Z.phi), 0], U = [0, 0, 1];
    const J = (l, w, u) => [x + D[0] * l + Wd[0] * w, y + D[1] * l + Wd[1] * w, zJ + u];
    const Lj = KP.Lj, Lg = KP.Lg;
    const hJ = (l) => 1.15 - 0.55 * klemm(l / Lj, 0, 1);
    const teile = [];
    const neu = (l, w, u) => { const S = new Schicht(K); const p = J(l, w, u); teile.push({ S: S, t: K.tiefe(p[0], p[1], p[2]) }); return S; };
    /* Drehbühne und Führerhaus */
    const Sb = neu(0, 0, -0.4);
    quaderR(Sb, [x, y, zR + 0.38], D, Wd, U, 0.85, 0.85, 0.38, gelb, { farben: winter ? { "C+": [226, 230, 236] } : null });
    walze(Sb, [x, y, zR - 0.05], [x, y, zR + 0.02], [[0, 0.72], [1, 0.72]], [120, 122, 126], { schatten: false });
    const Sc = neu(0.5, -1.25, -0.4);
    const kab = J(0.45, -1.28, -0.5);
    quaderR(Sc, kab, D, Wd, U, 0.72, 0.52, 0.95, [228, 226, 220], {
      muster: { "A+": glasMuster(true, [246, 246, 240]), "B-": glasMuster(false) },
      farben: winter ? { "C+": F.schnee } : null
    });
    /* Turmspitze: vier Stiele, zusammenlaufend, mit Verband */
    const Sk = neu(0, 0, KP.kopf * 0.5);
    const hk = KP.kopf;
    const fussP = [J(0.62, 0.62, 0), J(0.62, -0.62, 0), J(-0.62, -0.62, 0), J(-0.62, 0.62, 0)];
    const kopfP = [J(0.18, 0.18, hk), J(0.18, -0.18, hk), J(-0.18, -0.18, hk), J(-0.18, 0.18, hk)];
    const mitteP = fussP.map((p, i) => mul(add(p, kopfP[i]), 0.5));
    const kopfSeiten = [];
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4, mz = mul(add(add(fussP[i], fussP[j]), add(kopfP[i], kopfP[j])), 0.25);
      const nn = nrm([mz[0] - x, mz[1] - y, 0]);
      kopfSeiten.push({ i: i, j: j, vorn: nn[0] * K.ex + nn[1] * K.ey > 0 });
    }
    const kopfVerband = (sd) => {
      Sk.rohr(mitteP[sd.i], mitteP[sd.j], 0.03, gelb);
      Sk.rohr(fussP[sd.i], mitteP[sd.j], 0.026, gelb);
      Sk.rohr(mitteP[sd.i], kopfP[sd.j], 0.026, gelb);
    };
    for (const sd of kopfSeiten) if (!sd.vorn) kopfVerband(sd);
    for (let i = 0; i < 4; i++) Sk.rohr(fussP[i], kopfP[i], 0.06, gelb);
    for (const sd of kopfSeiten) if (sd.vorn) kopfVerband(sd);
    quaderR(Sk, J(0, 0, hk + 0.12), D, Wd, U, 0.26, 0.26, 0.12, gelb);
    /* Ausleger: Dreiecksgitter, Untergurte = Katzfahrbahn */
    const Sa = neu(Lj * 0.5, 0, 0.5);
    const l0 = 0.7, nP = Math.max(4, Math.round((Lj - l0) / 1.5));
    const li = (i) => l0 + (Lj - l0) * i / nP;
    const nL = nrm(add(mul(Wd, 1.15), mul(U, 0.45))), nR = nrm(add(mul(Wd, -1.15), mul(U, 0.45)));
    const vis = (n) => dot(n, K.E) > 0;
    const flanke = (w) => {
      for (let i = 0; i < nP; i++) {
        const a = li(i), b = li(i + 1), m = (a + b) / 2;
        Sa.rohr(J(a, w, 0), J(m, 0, hJ(m)), 0.022, gelb);
        Sa.rohr(J(m, 0, hJ(m)), J(b, w, 0), 0.022, gelb);
      }
    };
    const boden = () => {
      for (let i = 0; i <= nP; i++) Sa.rohr(J(li(i), 0.45, 0), J(li(i), -0.45, 0), 0.02, gelb, { schnee: true });
      for (let i = 0; i < nP; i++) Sa.rohr(J(li(i), 0.45, 0), J(li(i + 1), -0.45, 0), 0.018, gelb);
    };
    boden();
    if (!vis(nL)) flanke(0.45);
    if (!vis(nR)) flanke(-0.45);
    Sa.schnitt();
    Sa.rohr(J(l0, 0.45, 0), J(Lj, 0.45, 0), 0.05, gelb, { schnee: true });
    Sa.rohr(J(l0, -0.45, 0), J(Lj, -0.45, 0), 0.05, gelb, { schnee: true });
    Sa.rohr(J(l0, 0, hJ(l0)), J(Lj, 0, hJ(Lj)), 0.045, gelb, { schnee: true });
    Sa.schnitt();
    if (vis(nL)) flanke(0.45);
    if (vis(nR)) flanke(-0.45);
    Sa.rohr(J(Lj, 0.45, 0), J(Lj, 0, hJ(Lj)), 0.03, gelb); Sa.rohr(J(Lj, -0.45, 0), J(Lj, 0, hJ(Lj)), 0.03, gelb);
    /* Abspannung Turmspitze → Ausleger */
    const lp = Lj * 0.64;
    Sa.rohr(J(0, 0.12, hk + 0.2), J(lp, 0, hJ(lp)), 0.022, [80, 84, 90]);
    Sa.rohr(J(0, -0.12, hk + 0.2), J(lp, 0, hJ(lp)), 0.022, [80, 84, 90]);
    /* Laufkatze */
    const Sl = neu(Z.r, 0, -0.2);
    quaderR(Sl, J(Z.r, 0, -0.22), D, Wd, U, 0.45, 0.55, 0.18, gelb);
    if (K.s > 20) { for (const sw of [-1, 1]) walze(Sl, J(Z.r, sw * 0.3, -0.42), J(Z.r, sw * 0.12, -0.42), [[0, 0.1], [1, 0.1]], [60, 60, 64], { schatten: false }); }
    /* Gegenausleger: zwei Träger, Laufsteg, Geländer, Ballast, Winde */
    const Sg = neu(-Lg * 0.55, 0, 0.3);
    for (const w of [0.55, -0.55]) balken(Sg, J(-0.5, w, 0.2), J(-Lg, w, 0.2), 0.28, 0.4, Wd, gelb);
    const steg = [J(-0.6, 0.45, 0.42), J(-Lg + 0.2, 0.45, 0.42), J(-Lg + 0.2, -0.45, 0.42), J(-0.6, -0.45, 0.42)];
    Sg.flaeche(steg, U, winter ? [220, 224, 230] : [96, 100, 106], {
      muster: K.s > 26 ? function (g, L2, M) { g.strokeStyle = L2([60, 62, 66]); g.lineWidth = 0.02; for (let a = 0.1; a < M.w; a += 0.15) { g.beginPath(); g.moveTo(a, 0); g.lineTo(a, M.h); g.stroke(); } } : null,
      lok: { o: steg[0], u: mul(D, -1), v: mul(Wd, -1) }
    });
    for (const w of [0.72, -0.72]) {
      Sg.rohr(J(-0.4, w, 1.4), J(-Lg + 1.9, w, 1.4), 0.022, gelb, { schnee: true });
      Sg.rohr(J(-0.4, w, 0.9), J(-Lg + 1.9, w, 0.9), 0.018, gelb);
      for (let l = -0.4; l > -Lg + 1.8; l -= 1.6) Sg.rohr(J(l, w, 0.4), J(l, w, 1.4), 0.02, gelb);
    }
    /* Winde mit Seiltrommel */
    const wl = -1.9;
    quaderR(Sg, J(wl - 0.55, 0.25, 0.72), D, Wd, U, 0.3, 0.22, 0.3, [70, 74, 80]);
    walze(Sg, J(wl, 0.42, 0.78), J(wl, -0.42, 0.78), [[0, 0.34], [0.05, 0.34], [0.07, 0.26], [0.93, 0.26], [0.95, 0.34], [1, 0.34]], [96, 98, 104], { deckel: [120, 124, 130] });
    /* Ballastplatten */
    for (let k = 0; k < 4; k++) {
      const l = -Lg + 0.35 + k * 0.42;
      quaderR(Sg, J(l, 0, -0.1), D, Wd, U, 0.19, 0.78, 1.05, mix3(F.beton, [130, 126, 118], hash(pl.saat, k, 9) * 0.5), { farben: winter ? { "C+": F.schnee } : null });
    }
    /* Abspannung Turmspitze → Gegenausleger */
    Sg.rohr(J(0, 0.12, hk + 0.2), J(-Lg + 1.9, 0.55, 0.4), 0.022, [80, 84, 90]);
    Sg.rohr(J(0, -0.12, hk + 0.2), J(-Lg + 1.9, -0.55, 0.4), 0.022, [80, 84, 90]);
    /* Schild am Gegenausleger (Kranverleih) */
    if (K.s > 12) {
      const o = J(-0.9, 0.74, 1.35), u = mul(D, -1), v = [0, 0, -1];
      const w = Math.min(4.2, Lg - 2.4);
      const schild = function (g, L2, M) {
        g.fillStyle = L2(F.blau); g.fillRect(0, 0, M.w, 0.08); g.fillRect(0, 0.34, M.w, 0.08);
        if (M.px * 0.2 > 3) { g.fillStyle = L2(F.blau); g.font = "bold 0.2px 'DejaVu Sans', sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(stadtName().toUpperCase() + " BAU", M.w / 2, 0.215, M.w * 0.92); }
      };
      /* zwei Seiten, jede mit richtiger Leserichtung */
      const pA = [add(o, mul(u, w)), o, add(o, mul(v, 0.42)), add(add(o, mul(u, w)), mul(v, 0.42))];
      Sg.flaeche(pA, Wd, [240, 240, 236], { muster: schild, lok: { o: pA[0], u: D, v: v } });
      const pB = [o, add(o, mul(u, w)), add(add(o, mul(u, w)), mul(v, 0.42)), add(o, mul(v, 0.42))];
      Sg.flaeche(pB, mul(Wd, -1), [240, 240, 236], { muster: schild, lok: { o: pB[0], u: mul(D, -1), v: v } });
    }
    teile.sort((a, b) => a.t - b.t);
    /* Befeuerung (rot) und im Winter ein Tannenbäumchen auf der Spitze */
    const befeuerung = [J(0, 0, hk + 0.32), J(Lj + 0.05, 0, hJ(Lj) + 0.1), J(-Lg - 0.05, 0, 1.2)];
    const spitze = J(0, 0, hk + 0.24);
    const alle = [];
    for (const tt of teile) alle.push(tt.S);
    const zier = new Schicht(K);
    zier.eigen((g) => {
      for (const p of befeuerung) {
        const P = K.p(p[0], p[1], p[2]);
        const r = Math.max(1.2, 0.09 * K.s);
        g.fillStyle = K.nacht > 0.3 ? "rgb(255,70,50)" : "rgb(170,30,26)";
        g.beginPath(); g.arc(P[0], P[1], r, 0, TAU); g.fill();
      }
      if (winter) kranBaum(g, K, spitze);
    });
    alle.push(zier);
    const pts = [J(Lj, -0.5, 0), J(Lj, 0.5, 0), J(-Lg, -0.9, 0), J(-Lg, 0.9, 0), [x - 1.2, y - 1.2, 0], [x + 1.2, y + 1.2, 0]];
    const bb = [Math.min(...pts.map((p) => p[0])), Math.min(...pts.map((p) => p[1])), Math.max(...pts.map((p) => p[0])), Math.max(...pts.map((p) => p[1]))];
    return {
      name: "kran-oben", lage: "vorne", bb: bb, z0: zR - 1.5, z1: zJ + hk + 2, zSort: zJ,
      malen: (g) => { for (const S of alle) S.malen(g); },
      schatten: (sg) => { for (const S of alle) S.schattenMalen(sg); },
      glanz: (g) => { for (const p of befeuerung) glanzPunkt(g, K, p, 0.9, "255,60,40", 0.9 * K.nacht); if (winter) kranBaumLicht(g, K, spitze); }
    };
  }
  /* Tannenbäumchen auf der Kranspitze (Brauch auf deutschen Baustellen im Advent) */
  function kranBaum(g, K, p) {
    const P = K.p(p[0], p[1], p[2]), s = K.s, H = 1.7 * s * KZ, B = 0.62 * s;
    if (H < 3) return;
    const f = K.licht([0.3, 0.3, 0.9], p);
    const gruen = (k) => rgbS([34 * f[0] * k, 78 * f[1] * k, 46 * f[2] * k]);
    g.fillStyle = rgbS([90 * f[0], 60 * f[1], 40 * f[2]]); g.fillRect(P[0] - B * 0.05, P[1] - H * 0.15, B * 0.1, H * 0.16);
    for (let i = 0; i < 4; i++) {
      const y0 = P[1] - H * (0.12 + i * 0.22), w = B * (1 - i * 0.22);
      g.fillStyle = gruen(1 - i * 0.05);
      g.beginPath(); g.moveTo(P[0] - w / 2, y0); g.quadraticCurveTo(P[0], y0 + H * 0.05, P[0] + w / 2, y0); g.lineTo(P[0], y0 - H * 0.32); g.closePath(); g.fill();
      g.fillStyle = rgbS(mul(F.schnee, f[1]), 0.85);
      g.beginPath(); g.moveTo(P[0] - w * 0.3, y0 - H * 0.1); g.lineTo(P[0], y0 - H * 0.26); g.lineTo(P[0] + w * 0.25, y0 - H * 0.12); g.closePath(); g.fill();
    }
    if (s > 20) {
      for (let i = 0; i < 9; i++) {
        const hy = 0.15 + 0.08 * i, hx = Math.sin(i * 2.4) * (0.42 - hy * 0.4);
        g.fillStyle = K.nacht > 0.3 ? "rgb(255,226,150)" : "rgb(230,200,120)";
        g.beginPath(); g.arc(P[0] + hx * B, P[1] - H * hy, Math.max(0.7, s * 0.03), 0, TAU); g.fill();
      }
    }
  }
  function kranBaumLicht(g, K, p) {
    if (K.nacht < 0.05) return;
    const P = K.p(p[0], p[1], p[2] + 0.9);
    const r = Math.max(4, 1.6 * K.s);
    const gr = g.createRadialGradient(P[0], P[1], 0, P[0], P[1], r);
    gr.addColorStop(0, "rgba(255,210,130," + (0.4 * K.nacht).toFixed(3) + ")"); gr.addColorStop(1, "rgba(255,210,130,0)");
    g.fillStyle = gr; g.fillRect(P[0] - r, P[1] - r, 2 * r, 2 * r);
  }
  /* weicher Lichtschein (addierend) um einen Punkt */
  function glanzPunkt(g, K, p, rM, farbe, k) {
    if (k <= 0.01) return;
    const P = K.p(p[0], p[1], p[2]), r = Math.max(3, rM * K.s);
    const gr = g.createRadialGradient(P[0], P[1], 0, P[0], P[1], r);
    gr.addColorStop(0, "rgba(" + farbe + "," + klemm(0.9 * k, 0, 1).toFixed(3) + ")");
    gr.addColorStop(0.2, "rgba(" + farbe + "," + klemm(0.35 * k, 0, 1).toFixed(3) + ")");
    gr.addColorStop(1, "rgba(" + farbe + ",0)");
    g.fillStyle = gr; g.fillRect(P[0] - r, P[1] - r, 2 * r, 2 * r);
  }

  /* Haken, Seile und Last */
  function kranHaken(K, pl, KP, Z, bau) {
    const x = KP.x, y = KP.y, zJ = KP.Hm + 0.9 + 0.75;
    const D = [Math.cos(Z.phi), Math.sin(Z.phi), 0], Wd = [-Math.sin(Z.phi), Math.cos(Z.phi), 0];
    const hx = x + D[0] * Z.r, hy = y + D[1] * Z.r;
    const S = new Schicht(K);
    const L = Z.last;
    /* Last am Lager: steht auf dem Boden bereit */
    let lastPos = null;
    if (L) lastPos = L.pos === "lager" ? [KP.depot[0], KP.depot[1], 0] : [hx, hy, Z.zh - L.seil - L.h - 0.15];
    const katze = [hx, hy, zJ - 0.42];
    const block = [hx, hy, Z.zh + 0.45];
    /* Seile (zwei Stränge) */
    for (const sw of [-0.1, 0.1]) S.rohr(add(katze, mul(Wd, sw)), add(block, add(mul(Wd, sw * 0.8), [0, 0, 0.2])), 0.009, [60, 60, 62], { kappe: "butt" });
    S.schnitt();
    /* Unterflasche: gelb-schwarz, darunter der Haken */
    quaderR(S, block, D, Wd, [0, 0, 1], 0.14, 0.2, 0.24, [236, 180, 30], { muster: K.s > 30 ? { "A+": warnStreifen, "A-": warnStreifen, "B+": warnStreifen, "B-": warnStreifen } : null });
    S.rohr([hx, hy, Z.zh + 0.2], [hx, hy, Z.zh + 0.05], 0.03, [70, 70, 74]);
    S.eigen((g) => {
      /* Haken als Bogen */
      const a = K.p(hx, hy, Z.zh + 0.06), b = K.p(hx + D[0] * 0.12, hy + D[1] * 0.12, Z.zh - 0.12), c = K.p(hx - D[0] * 0.06, hy - D[1] * 0.06, Z.zh - 0.04);
      g.strokeStyle = K.farbe([80, 80, 84], [0, 0, 1], block); g.lineWidth = Math.max(0.8, 0.05 * K.s); g.lineCap = "round";
      g.beginPath(); g.moveTo(a[0], a[1]); g.quadraticCurveTo(b[0], b[1] + 0.06 * K.s, c[0], c[1]); g.stroke();
    });
    let alpha = 1;
    if (L && lastPos) {
      alpha = L.alpha;
      const top = lastPos[2] + L.h;
      const haken = L.pos === "lager" ? null : [hx, hy, Z.zh - 0.1];
      lastMalen(S, K, L.art, lastPos, D, Wd, haken, pl, alpha);
    }
    const bbP = [[hx, hy]];
    if (lastPos) bbP.push([lastPos[0], lastPos[1]]);
    const r = 1.4;
    const bb = [Math.min(...bbP.map((p) => p[0])) - r, Math.min(...bbP.map((p) => p[1])) - r, Math.max(...bbP.map((p) => p[0])) + r, Math.max(...bbP.map((p) => p[1])) + r];
    /* über dem Haus (höher als alles, was steht) → immer vorn */
    const unten = lastPos ? lastPos[2] : Z.zh;
    const ueber = unten > pl.H + 0.3 || (bau < 0.9 && L && L.pos !== "lager" && unten > oberkante(pl, bau) + 0.2 && innenHaus(pl, hx, hy));
    return { name: "kran-haken", lage: ueber ? "vorne" : "auto", bb: bb, z0: unten, z1: zJ, zSort: unten, malen: (g) => { if (alpha < 1) g.globalAlpha = 1; S.malen(g); }, schatten: (sg) => S.schattenMalen(sg) };
  }
  function innenHaus(pl, x, y) { const W = pl.wand; return x > W.x0 && x < W.x1 && y > W.y0 && y < W.y1; }
  function warnStreifen(g, L, M) {
    const w = M.w || 0.4, h = M.h || 0.5;
    g.fillStyle = L([30, 30, 32]);
    for (let a = -h; a < w + h; a += 0.16) { g.beginPath(); g.moveTo(a, h); g.lineTo(a + 0.08, h); g.lineTo(a + 0.08 + h, 0); g.lineTo(a + h, 0); g.closePath(); g.fill(); }
  }
  /* Eine Last: Balkenbündel, Lattenbund, Ziegelpalette, Dachziegelpalette */
  function lastMalen(S, K, art, p, D, Wd, haken, pl, alpha) {
    const U = [0, 0, 1], winter = K.winter;
    const x = p[0], y = p[1], z = p[2];
    const ecken = [];
    if (art === "balken" || art === "latten") {
      const n = art === "balken" ? 3 : 5, lage = art === "balken" ? 2 : 2, b = art === "balken" ? 0.16 : 0.06, h = art === "balken" ? 0.2 : 0.04, L = art === "balken" ? 4.2 : 4.0;
      for (let j = 0; j < lage; j++) for (let i = 0; i < n; i++) {
        const w = (i - (n - 1) / 2) * (b + 0.01), zz = z + j * (h + 0.005) + h / 2 + 0.02;
        const c = [x + Wd[0] * w, y + Wd[1] * w, zz];
        quaderR(S, c, D, Wd, U, L / 2, b / 2, h / 2, mix3(F.holz, F.holzHell, hash(i, j, 3) * 0.6), {
          farben: { "A+": F.hirn, "A-": F.hirn, "C+": winter && j === lage - 1 ? mix3(F.holz, F.schnee, 0.75) : null },
          muster: K.s > 50 && art === "balken" ? { "A+": hirnholz, "A-": hirnholz } : null, alpha: alpha < 1 ? alpha : undefined
        });
      }
      const top = z + lage * (h + 0.005) + 0.02;
      for (const l of [-1.3, 1.3]) ecken.push([x + D[0] * l, y + D[1] * l, top]);
    } else {
      /* Europalette mit Ziegeln bzw. Biberschwänzen, in Folie */
      const a = 0.6, b = 0.4;
      palette(S, K, [x, y, z], D, Wd, alpha);
      const hoch = 0.8;
      const zi = art === "ziegel";
      quaderR(S, [x, y, z + 0.145 + hoch / 2], D, Wd, U, a * 0.95, b * 0.95, hoch / 2, zi ? F.ziegel : [176, 84, 60], {
        muster: K.s > 14 ? { "A+": ziegelStapel(zi), "A-": ziegelStapel(zi), "B+": ziegelStapel(zi), "B-": ziegelStapel(zi), "C+": winter ? schneeDeckel : null } : null,
        farben: winter ? { "C+": F.schnee } : null, alpha: alpha < 1 ? alpha : undefined
      });
      const top = z + 0.145 + hoch;
      for (const [i, j] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) ecken.push([x + D[0] * a * 0.9 * i + Wd[0] * b * 0.9 * j, y + D[1] * a * 0.9 * i + Wd[1] * b * 0.9 * j, top]);
    }
    if (haken) for (const e of ecken) S.rohr(e, haken, 0.01, [70, 70, 72], { kappe: "butt" });
  }
  function palette(S, K, p, D, Wd, alpha) {
    const U = [0, 0, 1], x = p[0], y = p[1], z = p[2];
    for (const w of [-0.34, 0, 0.34]) quaderR(S, [x + Wd[0] * w, y + Wd[1] * w, z + 0.06], D, Wd, U, 0.6, 0.05, 0.06, F.palette, { alpha: alpha < 1 ? alpha : undefined, stapel: alpha >= 1 });
    quaderR(S, [x, y, z + 0.13], D, Wd, U, 0.6, 0.4, 0.015, mix3(F.palette, [200, 170, 120], 0.3), { alpha: alpha < 1 ? alpha : undefined, stapel: alpha >= 1 });
  }
  function hirnholz(g, L, M) {
    const w = M.w || 0.16, h = M.h || 0.2;
    g.strokeStyle = L([150, 110, 70], 0.6); g.lineWidth = Math.max(0.003, 0.8 / M.px);
    for (let r = 0.02; r < 0.12; r += 0.018) { g.beginPath(); g.ellipse(w * 0.45, h * 0.55, r, r * 0.9, 0, 0, TAU); g.stroke(); }
  }
  function ziegelStapel(rot) {
    return function (g, L, M) {
      const w = M.w || 1.2, h = M.h || 0.8;
      const lh = rot ? 0.075 : 0.035;
      g.strokeStyle = L(rot ? [120, 50, 36] : [120, 56, 40], 0.7); g.lineWidth = Math.max(0.004, 0.7 / M.px);
      g.beginPath();
      for (let y = lh; y < h; y += lh) { g.moveTo(0, y); g.lineTo(w, y); }
      if (rot && M.px > 25) for (let y = 0, k = 0; y < h; y += lh, k++) for (let x = (k % 2) * 0.12; x < w; x += 0.24) { g.moveTo(x, y); g.lineTo(x, y + lh); }
      g.stroke();
      /* Folie: heller Glanzstreif */
      g.fillStyle = "rgba(255,255,255,0.12)"; g.fillRect(w * 0.1, 0, w * 0.12, h);
    };
  }
  function schneeDeckel(g, L, M) {
    const w = M.w || 1, h = M.h || 1;
    g.fillStyle = L([200, 206, 216], 0.5);
    g.fillRect(0, 0, w, 0.03); g.fillRect(0, h - 0.03, w, 0.03);
  }

  /* =====================================================================
     DER HYDRAULIKBAGGER (Kettenbagger, etwa 14 t)
     XANDER: „wenn der Bagger dann kommt und damit baut" – er fährt durch
     das Tor an die Grube, gräbt (Stiel zieht, Löffel kippt ein), hebt,
     schwenkt, schüttet die Erde auf den Aushubhaufen und schwenkt zurück.
     Oberwagen dreht auf dem Kettenlaufwerk, Fahrer in der Kabine.
     ===================================================================== */
  /* Wo das Modell seinen Aushub hinlegt: einmal je Modellart aus seinen
     Flächen und Figuren bei bau = 0,08 gelesen (höhere Dinge außerhalb
     der Fassade, nahe der Westseite, wo der Bagger steht) */
  function modellHaufen(def, pl) {
    if (def._bsHaufen !== undefined) return def._bsHaufen;
    let res = null;
    try {
      const M = ST.modellBauen(def.id, { jahr: "fruehling", bau: 0.08, saat: 7, schluessel: "bs|haufen" });
      const W = pl.wand, pts = [];
      const aussen = (p) => p[0] < W.x0 - 0.25 || p[0] > W.x1 + 0.25 || p[1] < W.y0 - 0.25 || p[1] > W.y1 + 0.25;
      for (const t of M.teile) {
        for (const f of t.flaechen) {
          if (!f.umriss) continue;
          for (const q of f.umriss) { const p = [f.o[0] + f.u[0] * q[0] + f.v[0] * q[1], f.o[1] + f.u[1] * q[0] + f.v[1] * q[1], f.o[2] + f.u[2] * q[0] + f.v[2] * q[1]]; if (p[2] > 0.9 && p[2] < 4 && aussen(p)) pts.push(p); }
        }
        for (const fi of t.figuren) if ((fi.hoehe || 0) > 1.1 && fi.hoehe < 4 && aussen([fi.x, fi.y])) pts.push([fi.x, fi.y, fi.hoehe * 0.8]);
      }
      if (pts.length) {
        const ref = [W.x0, (W.y0 + W.y1) / 2];
        pts.sort((a, b) => Math.hypot(a[0] - ref[0], a[1] - ref[1]) - Math.hypot(b[0] - ref[0], b[1] - ref[1]));
        const p0 = pts[0], nah = pts.filter((p) => Math.hypot(p[0] - p0[0], p[1] - p0[1]) < 2.2);
        let x = 0, y = 0, z = 0;
        for (const p of nah) { x += p[0]; y += p[1]; z = Math.max(z, p[2]); }
        res = { x: x / nah.length, y: y / nah.length, z: z };
      }
    } catch (e) { res = null; }
    def._bsHaufen = res;
    return res;
  }
  function baggerPlan(pl) {
    const W = pl.wand;
    const gr = { x0: W.x0 - 0.35, x1: W.x1 + 0.35, y0: W.y0 - 0.35, y1: W.y1 + 0.35 };
    if (!pl.phasen) {
      /* Haus steht schon: Leitungsgraben 0,9 m breit vor der Westwand */
      const y = lerp(gr.y0, gr.y1, 0.42);
      const G = { x0: W.x0 - 1.6, x1: W.x0 - 0.7, y0: y - 1.3, y1: y + 1.3 };
      const x = (G.x0 + G.x1) / 2 - 3.6;
      return { x: x, y: y, grube: G, graben: true, tief: 1.2, kippe: [(G.x0 + G.x1) / 2 - 1.0, y - 3.6, 0], eigen: true };
    }
    const hf = modellHaufen(pl.def, pl);
    const y = hf ? klemm(hf.y + 3.8, gr.y0 + 1.2, gr.y1 - 1.2) : lerp(gr.y0, gr.y1, 0.42);
    const x = gr.x0 - 2.3;
    const kippe = hf ? [lerp(hf.x, x, 0.12), hf.y + 0.5, hf.z] : [x + 1.3, y - 4.2, 0];
    return { x: x, y: y, grube: gr, tief: 2.2, kippe: kippe, eigen: !hf };
  }
  const BOOM1 = 2.8, BOOM2 = 2.5, KNICK = 0.8, STIEL = 2.45;
  const BOOM_L = Math.sqrt(BOOM1 * BOOM1 + BOOM2 * BOOM2 + 2 * BOOM1 * BOOM2 * Math.cos(KNICK));
  const DELTA = Math.atan2(BOOM2 * Math.sin(KNICK), BOOM1 + BOOM2 * Math.cos(KNICK));
  function baggerZustand(K, pl, BP, bau) {
    const t = K.t + (pl.saat % 29) * 0.77;
    const an = zw(bau, 0, 0.008), weg = zw(bau, 0.116, 0.13);
    const fahr = an < 1 ? (1 - glatt(an)) * 10 : weg > 0 ? glatt(weg) * 10 : 0;
    const tiefe = BP.tief * glatt(zw(bau, 0.004, 0.09));
    const Tz = 11.5, zyk = Math.floor(t / Tz), u = t - zyk * Tz;
    const kip = BP.kippe;
    const thK = Math.atan2(kip[1] - BP.y, kip[0] - BP.x);
    const rK = klemm(Math.hypot(kip[0] - BP.x, kip[1] - BP.y), 3.4, 6.4);
    const zK = kip[2] + (BP.eigen ? pl._haufenH || 1.2 : 0) + 1.25;
    const grab = (z) => {
      const h1 = hash(z, pl.saat, 17), h2 = hash(z, pl.saat, 23);
      return BP.graben ? { r0: 4.0 - h1 * 0.2, r1: 3.2 + h1 * 0.1, th: (h2 - 0.5) * 0.36 } : { r0: 5.5 - h1 * 0.7, r1: 3.5 + h1 * 0.4, th: (h2 - 0.5) * 0.5 };
    };
    const G = grab(zyk), Gn = grab(zyk + 1);
    const zD = -tiefe + 0.7;
    if (fahr > 0.01 || bau >= 0.116) {
      /* Transportstellung: Arm eingeklappt, Löffel angezogen */
      return { th: 0, S: [3.4, 0.9], ga: 3.3, voll: 0, fahr: fahr, kipp: -1, u: u, tiefe: tiefe, faehrt: fahr > 0.01 };
    }
    const kf = [
      [0, G.th, G.r0, zD + 0.35, 4.3, 0],
      [2.4, G.th, G.r1, zD, 3.35, 1],
      [3.9, G.th, G.r1 + 0.6, 2.3, 3.1, 1],
      [5.8, thK, rK, zK, 3.14, 1],
      [7.0, thK, rK, zK + 0.2, 5.9, 0],
      [9.2, Gn.th, Gn.r0, 1.4, 5.3, 0],
      [11.5, Gn.th, Gn.r0, zD + 0.35, 4.3, 0]
    ];
    let i = 0;
    while (i < kf.length - 2 && u > kf[i + 1][0]) i++;
    const a = kf[i], b = kf[i + 1], k = glatt((u - a[0]) / (b[0] - a[0]));
    const th = a[1] + winkelDiff(b[1], a[1]) * k;
    return { th: th, S: [lerp(a[2], b[2], k), lerp(a[3], b[3], k)], ga: lerp(a[4], b[4], k), voll: lerp(a[5], b[5], k), fahr: 0, kipp: u >= 5.9 && u < 7.6 ? u - 5.9 : -1, u: u, tiefe: tiefe, zyk: zyk };
  }
  /* Zwei-Glieder-Rechnung: Ausleger (Sehne LB) und Stiel zum Ziel S */
  function baggerArm(S) {
    const Fr = 0.95, Fz = 1.55;
    let dx = S[0] - Fr, dz = S[1] - Fz, D = Math.hypot(dx, dz);
    const Dk = klemm(D, Math.abs(BOOM_L - STIEL) + 0.05, BOOM_L + STIEL - 0.05);
    const th = Math.atan2(dz, dx);
    const cA = klemm((BOOM_L * BOOM_L + Dk * Dk - STIEL * STIEL) / (2 * BOOM_L * Dk), -1, 1);
    const ac = th + Math.acos(cA);
    const tip = [Fr + BOOM_L * Math.cos(ac), Fz + BOOM_L * Math.sin(ac)];
    const al = ac + DELTA;
    const kn = [Fr + BOOM1 * Math.cos(al), Fz + BOOM1 * Math.sin(al)];
    const Sx = [Fr + dx / D * Dk, Fz + dz / D * Dk];
    const be = Math.atan2(Sx[1] - tip[1], Sx[0] - tip[0]);
    return { F: [Fr, Fz], kn: kn, tip: tip, S: [tip[0] + STIEL * Math.cos(be), tip[1] + STIEL * Math.sin(be)], al: al, be: be };
  }
  /* Kettenlaufwerk-Seite: Kettenglieder, Laufrollen, Turas, Leitrad */
  function ketteSeite(g, L, M) {
    const px = M.px;
    g.fillStyle = L([44, 44, 46]);
    g.beginPath(); g.moveTo(-1.44, 0.03); g.lineTo(1.44, 0.03); g.arc(1.44, 0.41, 0.38, -Math.PI / 2, Math.PI / 2); g.lineTo(-1.44, 0.79); g.arc(-1.44, 0.41, 0.38, Math.PI / 2, Math.PI * 1.5); g.closePath(); g.fill();
    g.fillStyle = L([70, 70, 72]);
    g.beginPath(); g.moveTo(-1.3, 0.16); g.lineTo(1.3, 0.16); g.lineTo(1.5, 0.4); g.lineTo(1.3, 0.66); g.lineTo(-1.3, 0.66); g.lineTo(-1.5, 0.4); g.closePath(); g.fill();
    if (px > 8) {
      g.fillStyle = L([90, 90, 94]);
      for (let i = 0; i < 5; i++) { g.beginPath(); g.arc(-1.0 + i * 0.5, 0.16, 0.1, 0, TAU); g.fill(); }
      g.beginPath(); g.arc(-1.44, 0.41, 0.3, 0, TAU); g.fill();
      g.beginPath(); g.arc(1.44, 0.41, 0.28, 0, TAU); g.fill();
      g.fillStyle = L([54, 54, 58]);
      g.beginPath(); g.arc(-1.44, 0.41, 0.12, 0, TAU); g.fill(); g.beginPath(); g.arc(1.44, 0.41, 0.1, 0, TAU); g.fill();
      if (px > 25) {
        g.strokeStyle = L([30, 30, 32]); g.lineWidth = 0.02;
        for (let k = 0; k < 12; k++) { const w = k / 12 * TAU; g.beginPath(); g.moveTo(-1.44 + Math.cos(w) * 0.26, 0.41 + Math.sin(w) * 0.26); g.lineTo(-1.44 + Math.cos(w) * 0.34, 0.41 + Math.sin(w) * 0.34); g.stroke(); }
        g.strokeStyle = L([28, 28, 30], 0.8); g.lineWidth = 0.015;
        for (let x = -1.4; x <= 1.4; x += 0.17) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 0.06); g.moveTo(x, 0.76); g.lineTo(x, 0.82); g.stroke(); }
      }
    }
  }
  function ketteBand(g, L, M) {
    g.fillStyle = L([52, 50, 48]); g.fillRect(-0.1, -0.1, (M.w || 1) + 0.2, 0.7);
    if (M.px > 10) { g.fillStyle = L([30, 30, 30]); for (let x = 0.05; x < (M.w || 1); x += 0.17) g.fillRect(x, -0.05, 0.035, 0.6); }
  }
  function lamellen(g, L, M) {
    const w = M.w || 1, h = M.h || 1;
    if (M.px < 10) return;
    g.fillStyle = L([40, 40, 42]);
    for (let y = 0.12; y < h - 0.1; y += 0.07) g.fillRect(w * 0.18, y, w * 0.55, 0.03);
  }
  function baggerTeile(K, pl, bau, teile, art) {
    const BP = pl.bagger;
    if (!BP) return;
    if (art === "fest") {
      if (BP.eigen) aushubHaufen(K, pl, BP, bau, teile);
      if (BP.graben) grabenTeil(K, pl, BP, bau, teile);
      return;
    }
    if (bau >= 0.13) return;
    const Z = baggerZustand(K, pl, BP, bau);
    pl._baggerZ = Z;
    const gelb = F.baggergelb, dunkel = [52, 52, 54];
    const bx = BP.x - Z.fahr, by = BP.y;
    const U = [0, 0, 1], g0 = [1, 0, 0], h0 = [0, 1, 0];
    /* ---- Unterwagen ---- */
    const koerper = [];
    const teil = (p) => { const S = new Schicht(K); koerper.push({ S: S, t: K.tiefe(p[0], p[1], p[2]) }); return S; };
    for (const sd of [-1, 1]) {
      const S = teil([bx, by + sd * 0.98, 0.4]);
      const prof = [];
      for (let i = 0; i <= 6; i++) { const w = -Math.PI / 2 + i / 6 * Math.PI; prof.push([1.44 + Math.cos(w) * 0.41, 0.41 + Math.sin(w) * 0.41]); }
      for (let i = 0; i <= 6; i++) { const w = Math.PI / 2 + i / 6 * Math.PI; prof.push([-1.44 + Math.cos(w) * 0.41, 0.41 + Math.sin(w) * 0.41]); }
      prisma(S, [bx, by + sd * 0.73, 0], g0, U, prof, [0, sd, 0], 0.5 * sd > 0 ? 0.5 : 0.5, [52, 50, 48], {
        seitenMuster: () => ketteBand, deckelMuster: ketteSeite, deckelFarbe: [44, 44, 46]
      });
      void S;
    }
    const Sm = teil([bx, by, 0.55]);
    quaderR(Sm, [bx, by, 0.55], g0, h0, U, 1.0, 0.6, 0.2, dunkel);
    /* Planierschild vorn */
    const Sp = teil([bx + 2.1, by, 0.35]);
    quaderR(Sp, [bx + 2.12, by, 0.36], g0, h0, U, 0.1, 1.24, 0.3, gelb);
    balken(Sp, [bx + 1.3, by + 0.6, 0.5], [bx + 2.0, by + 0.6, 0.45], 0.14, 0.14, h0, gelb);
    balken(Sp, [bx + 1.3, by - 0.6, 0.5], [bx + 2.0, by - 0.6, 0.45], 0.14, 0.14, h0, gelb);
    /* ---- Oberwagen ---- */
    const f = [Math.cos(Z.th), Math.sin(Z.th), 0], l = [-Math.sin(Z.th), Math.cos(Z.th), 0];
    const O = (af, al, z) => [bx + f[0] * af + l[0] * al, by + f[1] * af + l[1] * al, z];
    const Sd = teil(O(0, 0, 0.9));
    walze(Sd, [bx, by, 0.78], [bx, by, 0.98], [[0, 0.78], [1, 0.78]], [40, 40, 42], { schatten: false });
    quaderR(Sd, O(-0.25, 0, 1.14), f, l, U, 1.45, 1.22, 0.14, gelb);
    const Sg = teil(O(-1.85, 0, 1.5));
    const gw = [[-1.55, -1.22], [-1.55, 1.22], [-1.95, 1.12], [-2.13, 0.72], [-2.2, 0], [-2.13, -0.72], [-1.95, -1.12]];
    prisma(Sg, O(0, 0, 1.0), f, l, gw, U, 0.95, gelb, { deckelFarbe: gelb });
    const Sh = teil(O(-1.0, -0.1, 1.7));
    quaderR(Sh, O(-1.0, -0.12, 1.72), f, l, U, 0.55, 1.08, 0.44, gelb, { muster: { "B+": lamellen, "B-": lamellen } });
    Sh.rohr(O(-0.85, -0.72, 2.12), O(-0.85, -0.72, 2.5), 0.05, [34, 34, 36]);
    const St = teil(O(0.55, -0.75, 1.55));
    quaderR(St, O(0.55, -0.76, 1.55), f, l, U, 0.58, 0.42, 0.28, gelb);
    if (K.s > 18) { St.rohr(O(0.1, -1.15, 1.83), O(0.1, -1.15, 2.2), 0.018, [30, 30, 30]); St.rohr(O(0.1, -1.15, 2.2), O(1.0, -1.15, 2.2), 0.018, [30, 30, 30]); St.rohr(O(1.0, -1.15, 1.83), O(1.0, -1.15, 2.2), 0.018, [30, 30, 30]); }
    const Sk = teil(O(0.5, 0.66, 2.1));
    quaderR(Sk, O(0.5, 0.66, 2.08), f, l, U, 0.62, 0.5, 0.8, [60, 62, 64], {
      /* der Fahrer ist nur durch die Scheibe zu sehen, die am meisten zum Betrachter zeigt */
      muster: { "A+": glasMuster(dot(f, K.E) >= dot(l, K.E), [246, 196, 30]), "B+": glasMuster(dot(l, K.E) > dot(f, K.E), [246, 196, 30]), "A-": glasMuster(false) },
      farben: { "C+": [70, 72, 74] }
    });
    koerper.sort((a, b) => a.t - b.t);
    const bb0 = [bx - 2.3, by - 2.3, bx + 2.3, by + 2.3];
    teile.push({
      name: "bagger", bb: bb0, z1: 3.0,
      /* Ton: beim Anfahren und zu Beginn jedes Grabens (wenn man ihn sieht) */
      ton: Z.faehrt || (Z.u < 0.8 && bau < 0.116) ? "bagger" : null,
      malen: (g) => { for (const k of koerper) k.S.malen(g); },
      schatten: (sg) => { for (const k of koerper) k.S.schattenMalen(sg); }
    });
    /* ---- Ausleger, Stiel, Löffel (immer nach dem Haus: reicht in die Grube) ---- */
    const A = baggerArm(Z.S);
    const w0 = -0.15;
    const P = (r, z, w) => O(r, w0 + (w || 0), z);
    const arm = [];
    const aTeil = (p) => { const S = new Schicht(K); arm.push({ S: S, t: K.tiefe(p[0], p[1], p[2]), z: p[2] }); return S; };
    const senk = (d) => [-d[1], d[0]];            // senkrecht in der Armebene
    const in3 = (r, z) => nrm(add(mul(f, r), [0, 0, z]));
    /* Ausleger: zwei Kastenstücke mit Knick */
    const d1 = [Math.cos(A.al), Math.sin(A.al)], d2 = [Math.cos(A.al - KNICK), Math.sin(A.al - KNICK)];
    const S1 = aTeil(P((A.F[0] + A.kn[0]) / 2, (A.F[1] + A.kn[1]) / 2));
    balken(S1, P(A.F[0] - d1[0] * 0.2, A.F[1] - d1[1] * 0.2), P(A.kn[0], A.kn[1]), 0.44, 0.62, l, gelb);
    const S2 = aTeil(P((A.kn[0] + A.tip[0]) / 2, (A.kn[1] + A.tip[1]) / 2));
    balken(S2, P(A.kn[0] - d2[0] * 0.25, A.kn[1] - d2[1] * 0.25), P(A.tip[0] + d2[0] * 0.15, A.tip[1] + d2[1] * 0.15), 0.4, 0.46, l, gelb);
    /* Auslegerzylinder (zwei, seitlich) */
    const fuss = [1.25, 1.05], an1 = [A.F[0] + d1[0] * 1.7 - senk(d1)[0] * 0.33, A.F[1] + d1[1] * 1.7 - senk(d1)[1] * 0.33];
    for (const sw of [-0.3, 0.3]) {
      const Sz = aTeil(P((fuss[0] + an1[0]) / 2, (fuss[1] + an1[1]) / 2, sw));
      const mitte = [lerp(fuss[0], an1[0], 0.55), lerp(fuss[1], an1[1], 0.55)];
      Sz.rohr(P(fuss[0], fuss[1], sw), P(mitte[0], mitte[1], sw), 0.1, gelb);
      Sz.rohr(P(mitte[0], mitte[1], sw), P(an1[0], an1[1], sw), 0.055, [214, 218, 224]);
    }
    /* Stielzylinder oben auf dem Ausleger */
    const ds = [Math.cos(A.be), Math.sin(A.be)];
    const hinten = [A.tip[0] - ds[0] * 0.55 + senk(ds)[0] * 0.1, A.tip[1] - ds[1] * 0.55 + senk(ds)[1] * 0.1];
    const b1 = [A.F[0] + d1[0] * 2.0 + senk(d1)[0] * 0.38, A.F[1] + d1[1] * 2.0 + senk(d1)[1] * 0.38];
    const Sz2 = aTeil(P((b1[0] + hinten[0]) / 2, (b1[1] + hinten[1]) / 2 + 0.3));
    const m2 = [lerp(b1[0], hinten[0], 0.55), lerp(b1[1], hinten[1], 0.55)];
    Sz2.rohr(P(b1[0], b1[1]), P(m2[0], m2[1]), 0.09, gelb);
    Sz2.rohr(P(m2[0], m2[1]), P(hinten[0], hinten[1]), 0.05, [214, 218, 224]);
    /* Stiel – an der Erdoberfläche geteilt (unter der Erde nur in der Grube sichtbar) */
    const s0 = hinten, s1 = A.S;
    const stielStueck = (a, b) => { const S = aTeil(P((a[0] + b[0]) / 2, (a[1] + b[1]) / 2)); balken(S, P(a[0], a[1]), P(b[0], b[1]), 0.34, 0.42, l, gelb); };
    if ((s0[1] > 0) !== (s1[1] > 0)) { const k = s0[1] / (s0[1] - s1[1]), m = [lerp(s0[0], s1[0], k), 0]; stielStueck(s0, m); stielStueck(m, s1); }
    else stielStueck(s0, s1);
    /* Löffelzylinder auf dem Stiel */
    const lz0 = [A.tip[0] - ds[0] * 0.3 + senk(ds)[0] * 0.3, A.tip[1] - ds[1] * 0.3 + senk(ds)[1] * 0.3];
    const lz1 = [A.S[0] - ds[0] * 0.4 + senk(ds)[0] * 0.28, A.S[1] - ds[1] * 0.4 + senk(ds)[1] * 0.28];
    const Sz3 = aTeil(P((lz0[0] + lz1[0]) / 2, (lz0[1] + lz1[1]) / 2 + 0.25));
    const m3 = [lerp(lz0[0], lz1[0], 0.55), lerp(lz0[1], lz1[1], 0.55)];
    Sz3.rohr(P(lz0[0], lz0[1]), P(m3[0], m3[1]), 0.075, gelb);
    Sz3.rohr(P(m3[0], m3[1]), P(lz1[0], lz1[1]), 0.042, [214, 218, 224]);
    /* Löffel: Seitenwangen als Prisma, Zähne, Erdfüllung */
    const ga = Z.ga, ua = [Math.cos(ga), Math.sin(ga)], vb = [-Math.sin(ga), Math.cos(ga)];
    const lp = (a, b) => [A.S[0] + ua[0] * a + vb[0] * b, A.S[1] + ua[1] * a + vb[1] * b];
    const prof = [[-0.08, -0.12], [0.02, 0.2], [0.2, 0.46], [0.5, 0.6], [0.8, 0.52], [1.02, 0.2], [0.42, -0.16]];
    const mL = lp(0.45, 0.2);
    const Sl = aTeil(P(mL[0], mL[1]));
    const U3 = in3(ua[0], ua[1]), V3 = in3(vb[0], vb[1]);
    prisma(Sl, P(A.S[0], A.S[1], -0.45), U3, V3, prof, l, 0.9, [70, 66, 58], {
      deckelFarbe: gelb,
      seite: (i) => (i === 5 || i === 6) ? [34, 30, 28] : [74, 70, 62]
    });
    const zahnA = lp(1.02, 0.2), zahnB = lp(1.2, 0.08);
    if (K.s > 12) for (let k = 0; k < 5; k++) { const w = -0.36 + k * 0.18; Sl.rohr(P(zahnA[0], zahnA[1], w), P(zahnB[0], zahnB[1], w), 0.035, [60, 58, 56]); }
    if (Z.voll > 0.05) {
      /* Erde oben in der Öffnung */
      const e0 = lp(0.0, -0.1), e1 = lp(0.98, 0.18), hoch = lp(0.5, -0.1 - 0.28 * Z.voll);
      const erde = [P(e0[0], e0[1], -0.42), P(e1[0], e1[1], -0.42), P(e1[0], e1[1], 0.42), P(e0[0], e0[1], 0.42)];
      const nE = in3(-vb[0], -vb[1]);
      const Se = aTeil(P(hoch[0], hoch[1]));
      Se.flaeche(erde, dot(nE, K.E) > 0 ? nE : mul(nE, -1), F.erde, { beidseitig: true, muster: erdMuster(Z.zyk || 0), lok: { o: erde[0], u: nrm(sub(erde[1], erde[0])), v: l } });
      const kuppe = [P(e0[0], e0[1], -0.3), P(hoch[0], hoch[1], 0), P(e1[0], e1[1], 0.3)];
      void kuppe;
    }
    /* Erdbrocken beim Auskippen */
    if (Z.kipp >= 0) {
      const mund = lp(0.9, 0.0);
      const Sb = aTeil(P(mund[0], mund[1] - 1));
      Sb.eigen((g) => brockenMalen(g, K, P(mund[0], mund[1]), f, l, Z.kipp, BP, pl, Z.zyk || 0));
    }
    /* Reihenfolge der Armteile nach Tiefe; unter der Erde nur durch die Grubenöffnung */
    arm.sort((a, b) => a.t - b.t);
    const gr = BP.grube;
    const oeffnung = [[gr.x0, gr.y0, 0], [gr.x1, gr.y0, 0], [gr.x1, gr.y1, 0], [gr.x0, gr.y1, 0]].map((p) => K.p(p[0], p[1], 0));
    const bbA = [Math.min(bx, P(A.S[0], 0)[0]) - 1.2, Math.min(by, P(A.S[0], 0)[1]) - 1.2, Math.max(bx, P(A.S[0], 0)[0]) + 1.2, Math.max(by, P(A.S[0], 0)[1]) + 1.2];
    /* Graben neben dem stehenden Haus: der Arm bleibt vor der Wand und
       wird wie alles andere vor oder hinter dem Haus einsortiert */
    if (BP.graben) bbA[2] = Math.min(bbA[2], pl.wand.x0 - 0.05);
    teile.push({
      name: "bagger-arm", lage: BP.graben ? null : "vorne", bb: bbA, z0: Math.min(0, A.S[1] - 1), z1: Math.max(A.kn[1], A.tip[1]) + 0.5, zSort: 1.5,
      malen: (g) => {
        g.save();
        g.beginPath(); oeffnung.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.closePath(); g.clip();
        for (const a of arm) if (a.z < 0) a.S.malen(g);
        g.restore();
        for (const a of arm) if (a.z >= 0) a.S.malen(g);
      },
      schatten: (sg) => { for (const a of arm) if (a.z >= 0) a.S.schattenMalen(sg); }
    });
  }
  /* eigener Aushubhaufen, wenn das Modell keinen hat: wächst beim Graben,
     schrumpft beim Verfüllen (0,17–0,24), Rest wird abgefahren (bis 0,3) */
  function aushubHaufen(K, pl, BP, bau, teile) {
    const w = glatt(zw(bau, 0.004, 0.1)) * (1 - 0.75 * glatt(zw(bau, 0.17, 0.24))) * (1 - glatt(zw(bau, 0.26, 0.3)));
    const wq = Math.round(w * 60) / 60, h = 1.5 * Math.sqrt(wq);
    pl._haufenH = h * (BP.graben ? 0.6 : 1);
    if (h > 0.05) {
      const schnee = K.winter ? Math.round(0.25 * zw(bau, 0.04, 0.12) * 20) / 20 : 0;
      teile("aushub", wq + "|" + schnee, () => {
        const S = new Schicht(K), k = BP.kippe;
        const gk = BP.graben ? 0.6 : 1;
        haufen(S, K, k[0], k[1], 2.0 * gk * Math.cbrt(wq), 1.5 * gk * Math.cbrt(wq), h * gk, F.erde, pl.saat + 5, { schnee: schnee, muster: K.s > 20 ? erdMuster(3) : null });
        return { name: "aushub", bb: [k[0] - 2.2 * gk, k[1] - 1.7 * gk, k[0] + 2.2 * gk, k[1] + 1.7 * gk], z1: h * gk, malen: (g) => S.malen(g), schatten: (sg) => S.schattenMalen(sg) };
      });
    }
  }
  /* Leitungsgraben (Haus ohne Bauphasen): ein Loch im Boden mit Erdwänden.
     Ab 0,135 steigt der Beton darin (Streifenfundament), ab 0,24 ist der
     Graben zugeschüttet. */
  function grabenTeil(K, pl, BP, bau, teile) {
    if (bau >= 0.24) return;
    const d = Math.round(BP.tief * glatt(zw(bau, 0.004, 0.09)) * 20) / 20;
    if (d < 0.05) return;
    const beton = Math.round(glatt(zw(bau, 0.135, 0.2)) * 20) / 20;
    teile("graben", d + "|" + beton, () => graben(K, pl, BP.grube, d, beton));
  }
  function graben(K, pl, G, d, beton) {
    const S = new Schicht(K), winter = K.winter;
    const zS = -d + beton * (d - 0.06);          // Sohle oder Betonoberkante
    const mitte = [(G.x0 + G.x1) / 2, (G.y0 + G.y1) / 2, zS];
    const ecken = (z, m) => [[G.x0 - m, G.y0 - m], [G.x1 + m, G.y0 - m], [G.x1 + m, G.y1 + m], [G.x0 - m, G.y1 + m]].map((p) => K.p(p[0], p[1], z));
    const pfad = (g, pts) => { g.beginPath(); pts.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.closePath(); };
    S.eigen((g) => {
      /* zertretener Rand aus Erde (im Winter mit schmutzigem Schnee) */
      pfad(g, ecken(0, 0.35));
      g.fillStyle = winter ? "rgba(128,112,98,0.45)" : "rgba(96,74,52,0.5)"; g.fill();
      pfad(g, ecken(0, 0.14));
      g.fillStyle = K.farbe(F.erde, [0, 0, 1], mitte); g.fill();
      /* Innen: Sohle, dann die Wände, die zum Betrachter schauen */
      g.save(); pfad(g, ecken(0, 0)); g.clip();
      pfad(g, ecken(zS, 0));
      g.fillStyle = beton > 0.02 ? K.farbe([132, 132, 128], [0, 0, 1], mitte) : K.farbe(mul(F.erde, 0.62), [0, 0, 1], mitte);
      g.fill();
      const E = [[G.x0, G.y0], [G.x1, G.y0], [G.x1, G.y1], [G.x0, G.y1]];
      const nInnen = [[0, 1, 0], [-1, 0, 0], [0, -1, 0], [1, 0, 0]];
      for (let i = 0; i < 4; i++) {
        const n = nInnen[i];
        if (dot(n, K.E) <= 0) continue;
        const a = E[i], b = E[(i + 1) % 4];
        const q = [K.p(a[0], a[1], 0), K.p(b[0], b[1], 0), K.p(b[0], b[1], zS), K.p(a[0], a[1], zS)];
        pfad(g, q);
        g.fillStyle = K.farbe(mul(F.erde, 0.82), n, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, zS / 2]); g.fill();
        /* Mutterboden oben dunkler, darunter Lehmschichten */
        const band = (z0, z1, farbe, al) => {
          const r = [K.p(a[0], a[1], z0), K.p(b[0], b[1], z0), K.p(b[0], b[1], z1), K.p(a[0], a[1], z1)];
          pfad(g, r); g.fillStyle = K.farbe(farbe, n, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, z0], al); g.fill();
        };
        band(0, Math.max(zS, -0.3), [58, 44, 34], 0.8);
        if (zS < -0.7) band(-0.62, Math.max(zS, -0.75), [150, 118, 80], 0.35);
        if (beton > 0.02) band(zS, zS - 0.02, [100, 100, 98], 1);
      }
      /* frischer Beton glänzt nass */
      if (beton > 0.02 && beton < 1) {
        const P = K.p(mitte[0], mitte[1], zS);
        g.fillStyle = "rgba(230,232,236,0.18)";
        g.beginPath(); g.ellipse(P[0], P[1], 0.3 * K.s, 0.12 * K.s, 0, 0, TAU); g.fill();
      }
      g.restore();
      /* Schnee auf der Oberkante */
      if (winter) {
        g.strokeStyle = "rgba(246,248,252,0.8)"; g.lineWidth = Math.max(0.6, 0.05 * K.s);
        pfad(g, ecken(0, 0.02)); g.stroke();
      }
    });
    return { name: "graben", boden: true, lage: "hinten", bb: [G.x0 - 0.4, G.y0 - 0.4, G.x1 + 0.4, G.y1 + 0.4], z1: 0.01, malen: (g) => S.malen(g) };
  }
  function erdMuster(saat) {
    return function (g, L, M) {
      if (M.px < 12) return;
      const r = ST.zufall(saat * 31 + 7), w = M.w || 1, h = M.h || 1;
      for (let i = 0; i < 30; i++) {
        g.fillStyle = L(r() < 0.5 ? [70, 52, 38] : [128, 100, 72], 0.7);
        g.beginPath(); g.ellipse(r() * w, r() * h, 0.03 + r() * 0.05, 0.02 + r() * 0.03, r() * 3, 0, TAU); g.fill();
      }
    };
  }
  /* Erdbrocken: fallen aus dem Löffelmaul auf den Haufen, dazu etwas Staub */
  function brockenMalen(g, K, mund, f, l, alter, BP, pl, zyk) {
    const r = ST.zufall(zyk * 131 + 17);
    const boden = BP.eigen ? (pl._haufenH || 0.5) : BP.kippe[2];
    for (let i = 0; i < 18; i++) {
      const t0 = r() * 0.8, a = alter - t0;
      const dx = (r() - 0.5) * 0.5, dy = (r() - 0.5) * 0.5, gr = 0.06 + r() * 0.12;
      if (a < 0) continue;
      let z = mund[2] - 4.9 * a * a;
      if (z < boden * (0.6 + r() * 0.4)) continue;
      const p = [mund[0] + dx + f[0] * a * 0.4, mund[1] + dy + f[1] * a * 0.4, z];
      const P = K.p(p[0], p[1], p[2]);
      g.fillStyle = K.farbe(r() < 0.5 ? F.erde : F.erdeHell, [0.2, 0.2, 1], p);
      g.beginPath(); g.ellipse(P[0], P[1], Math.max(0.6, gr * K.s), Math.max(0.5, gr * K.s * 0.8), r() * 3, 0, TAU); g.fill();
    }
    if (alter > 0.5) {
      const k = zw(alter, 0.5, 1.7);
      const P = K.p(BP.kippe[0], BP.kippe[1], boden + 0.3);
      const rr = (0.6 + k * 1.4) * K.s;
      const gr = g.createRadialGradient(P[0], P[1], 0, P[0], P[1], rr);
      const c = K.winter ? "220,220,226" : "150,126,100";
      gr.addColorStop(0, "rgba(" + c + "," + (0.35 * (1 - k)).toFixed(3) + ")"); gr.addColorStop(1, "rgba(" + c + ",0)");
      g.fillStyle = gr; g.fillRect(P[0] - rr, P[1] - rr, 2 * rr, 2 * rr);
    }
  }

  /* =====================================================================
     DER FAHRMISCHER (Betonmischer-LKW), 0,12–0,22
     Fährt rückwärts durch das Tor an die Grube, die Trommel dreht (die
     weißen Spiralstreifen laufen mit), Beton läuft über die Schurre in
     die Fundamentschalung.
     ===================================================================== */
  function mischerPlan(pl) {
    const BP = pl.bagger, W = pl.wand;
    const y = BP ? BP.y : lerp(W.y0, W.y1, 0.45);
    /* Schurrenende über der Grubenkante bzw. über der Grabenmitte */
    const heck = BP && BP.graben ? (BP.grube.x0 + BP.grube.x1) / 2 - 2.2 : W.x0 - 1.9;
    return { x: heck - 4.0, y: y, heck: heck };
  }
  function mischerTeile(K, pl, bau, teile) {
    const MP = pl.mischer;
    if (!MP || bau < 0.118 || bau >= 0.222) return;
    const an = zw(bau, 0.118, 0.13), weg = zw(bau, 0.205, 0.222);
    const off = an < 1 ? (1 - glatt(an)) * 11 : glatt(weg) * 11;
    const giesst = bau >= 0.13 && bau < 0.2;
    const Fw = [-1, 0, 0], Lw = [0, -1, 0], U = [0, 0, 1];
    const C = [MP.x - off, MP.y, 0];
    const Q = (X, Y, Z) => [C[0] + Fw[0] * X + Lw[0] * Y, C[1] + Fw[1] * X + Lw[1] * Y, Z];
    const koerper = [];
    const teil = (X, Y, Z) => { const S = new Schicht(K); const p = Q(X, Y, Z); koerper.push({ S: S, t: K.tiefe(p[0], p[1], p[2]) }); return S; };
    const weiss = [236, 236, 232], dunkel = [46, 48, 52];
    /* Räder */
    for (const X of [2.9, -1.3, -2.65]) for (const sd of [-1, 1]) {
      const S = teil(X, sd * 1.0, 0.5);
      const breit = X < 0 ? 0.55 : 0.36;
      rad(S, Q(X, sd * (1.24 - breit), 0.52), Q(X, sd * 1.24, 0.52), 0.52, [196, 198, 204], { schnee: true });
    }
    /* Rahmen, Kotflügel, Tanks */
    const Sr = teil(-0.3, 0, 0.9);
    balken(Sr, Q(-4.0, 0.45, 0.9), Q(3.3, 0.45, 0.9), 0.2, 0.3, Lw, dunkel);
    balken(Sr, Q(-4.0, -0.45, 0.9), Q(3.3, -0.45, 0.9), 0.2, 0.3, Lw, dunkel);
    for (const sd of [-1, 1]) {
      const Sk = teil(-2.0, sd * 1.0, 1.1);
      quaderR(Sk, Q(-2.0, sd * 1.0, 1.12), Fw, Lw, U, 1.05, 0.28, 0.04, dunkel);
      const St = teil(0.8, sd * 0.95, 0.85);
      walze(St, Q(0.25, sd * 0.95, 0.85), Q(1.35, sd * 0.95, 0.85), [[0, 0.26], [1, 0.26]], sd > 0 ? [190, 194, 200] : [70, 74, 80], { deckel: sd > 0 ? [170, 174, 180] : [60, 64, 70] });
    }
    /* Fahrerhaus */
    const Sc = teil(3.15, 0, 2.0);
    quaderR(Sc, Q(3.15, 0, 2.02), Fw, Lw, U, 0.85, 1.24, 1.02, weiss, {
      muster: { "A+": fahrerhausFront, "B+": fahrerhausSeite(1), "B-": fahrerhausSeite(-1) },
      farben: K.winter ? { "C+": F.schnee } : null
    });
    quaderR(Sc, Q(3.95, 0, 0.95), Fw, Lw, U, 0.14, 1.2, 0.2, [50, 52, 56]);
    if (K.s > 16) for (const sd of [-1, 1]) { Sc.rohr(Q(3.7, sd * 1.24, 2.6), Q(3.8, sd * 1.5, 2.6), 0.02, dunkel); quaderR(Sc, Q(3.8, sd * 1.52, 2.35), Fw, Lw, U, 0.05, 0.1, 0.24, dunkel); }
    /* Trommelbock */
    const Sb = teil(-1.0, 0, 1.6);
    quaderR(Sb, Q(1.95, 0, 1.55), Fw, Lw, U, 0.18, 0.55, 0.5, dunkel);
    for (const sd of [-1, 1]) balken(Sb, Q(-3.3, sd * 0.55, 1.05), Q(-3.3, sd * 0.35, 2.55), 0.16, 0.16, Fw, dunkel);
    /* Trommel mit Spiralstreifen */
    const Sd = teil(-0.7, 0, 2.5);
    const dreh = K.t * (giesst ? 3.2 : 1.6);
    walze(Sd, Q(2.05, 0, 2.05), Q(-3.45, 0, 2.95), [[0, 0.72], [0.14, 1.08], [0.5, 1.2], [0.8, 0.95], [1, 0.56]], [228, 108, 34], {
      streifen: { n: 2, windungen: 1.25, breite: 0.2, farbe: [242, 240, 234], phase: dreh }
    });
    /* Einfülltrichter und Leiter */
    const Sh = teil(-3.7, 0, 3.3);
    prisma(Sh, Q(-3.75, -0.4, 3.0), Fw, U, [[-0.25, 0], [0.25, 0], [0.42, 0.55], [-0.42, 0.55]], Lw, 0.8, [210, 100, 32], { deckelFarbe: [200, 96, 30] });
    if (K.s > 14) {
      Sh.rohr(Q(-4.05, 0.7, 0.4), Q(-3.75, 0.7, 3.1), 0.02, dunkel); Sh.rohr(Q(-4.05, 0.3, 0.4), Q(-3.75, 0.3, 3.1), 0.02, dunkel);
      if (K.s > 30) for (let z = 0.6; z < 3; z += 0.3) Sh.rohr(Q(-4.05 + (z - 0.4) * 0.11, 0.7, z), Q(-4.05 + (z - 0.4) * 0.11, 0.3, z), 0.012, dunkel, { schatten: false });
    }
    koerper.sort((a, b) => a.t - b.t);
    const P1 = Q(-4.1, -1.3, 0), P2 = Q(4.1, 1.3, 0);
    teile.push({ name: "mischer", bb: [Math.min(P1[0], P2[0]), Math.min(P1[1], P2[1]), Math.max(P1[0], P2[0]), Math.max(P1[1], P2[1])], z1: 4, malen: (g) => { for (const k of koerper) k.S.malen(g); }, schatten: (sg) => { for (const k of koerper) k.S.schattenMalen(sg); } });
    /* Schurre und Betonstrahl (reicht in die Grube → nach dem Haus) */
    if (off < 0.05) {
      const Ss = new Schicht(K);
      const a0 = Q(-3.8, 0, 2.35), a1 = Q(-4.9, 0.25, 1.75), a2 = Q(-5.85, 0.6, 1.15);
      rinne(Ss, K, a0, a1, 0.34, giesst); rinne(Ss, K, a1, a2, 0.34, giesst);
      if (giesst) Ss.eigen((g) => betonStrahl(g, K, a2, pl, MP));
      const ende = a2;
      teile.push({ name: "schurre", lage: pl.bagger && pl.bagger.graben ? null : "vorne", bb: [Math.min(a0[0], ende[0]) - 0.4, Math.min(a0[1], ende[1]) - 0.4, Math.max(a0[0], ende[0]) + 0.4, Math.max(a0[1], ende[1]) + 0.4], z1: 2.5, zSort: 1.5, malen: (g) => Ss.malen(g), schatten: (sg) => Ss.schattenMalen(sg) });
    }
  }
  function fahrerhausFront(g, L, M) {
    const w = M.w || 2.5, h = M.h || 2;
    g.fillStyle = L([236, 236, 232]); g.fillRect(-0.1, -0.1, w + 0.2, h + 0.2);
    glasMuster(true, [240, 240, 236])(g, L, Object.assign({}, M, { w: w, h: h }));
    g.save(); g.beginPath(); g.rect(0, h * 0.5, w, h); g.clip();
    g.fillStyle = L([236, 236, 232]); g.fillRect(-0.1, h * 0.5, w + 0.2, h);
    g.fillStyle = L([70, 72, 76]); g.fillRect(w * 0.18, h * 0.62, w * 0.64, h * 0.2);
    if (M.px > 10) { g.strokeStyle = L([40, 40, 44]); g.lineWidth = 0.02; for (let y = h * 0.64; y < h * 0.8; y += 0.06) { g.beginPath(); g.moveTo(w * 0.2, y); g.lineTo(w * 0.8, y); g.stroke(); } }
    g.fillStyle = L([250, 246, 220]); g.fillRect(w * 0.04, h * 0.84, w * 0.12, h * 0.07); g.fillRect(w * 0.84, h * 0.84, w * 0.12, h * 0.07);
    g.fillStyle = L([30, 80, 150]); g.fillRect(0, h * 0.53, w, h * 0.04);
    g.restore();
  }
  function fahrerhausSeite(sd) {
    return function (g, L, M) {
      const w = M.w || 1.7, h = M.h || 2;
      g.save(); g.beginPath(); g.rect(w * 0.3, h * 0.08, w * 0.62, h * 0.4); g.clip();
      glasMuster(false)(g, L, Object.assign({}, M, { w: w, h: h }));
      g.restore();
      g.fillStyle = L([30, 80, 150]); g.fillRect(0, h * 0.53, w, h * 0.04);
      if (M.px > 12) { g.strokeStyle = L([150, 150, 150]); g.lineWidth = 0.015; g.strokeRect(w * 0.28, h * 0.06, w * 0.66, h * 0.86); }
      void sd;
    };
  }
  /* offene Rinne (U-Profil) von a nach b, Breite w; innen Beton */
  function rinne(S, K, a, b, w, voll) {
    const d = nrm(sub(b, a)), q = nrm(kreuz(d, [0, 0, 1])), up = kreuz(q, d);
    const h = 0.16;
    const p = (P, sq, su) => add(P, add(mul(q, sq * w / 2), mul(up, su)));
    const boden = [p(a, -1, 0), p(b, -1, 0), p(b, 1, 0), p(a, 1, 0)];
    S.flaeche([p(a, 1, h), p(b, 1, h), p(b, 1, 0), p(a, 1, 0)], q, [150, 154, 160], { beidseitig: true });
    S.flaeche([p(a, -1, h), p(b, -1, h), p(b, -1, 0), p(a, -1, 0)], mul(q, -1), [150, 154, 160], { beidseitig: true });
    S.flaeche(boden, up, voll ? [150, 148, 142] : [120, 124, 130], { beidseitig: true, muster: voll ? betonFluss : null, lok: voll ? { o: boden[0], u: d, v: q } : null });
  }
  function betonFluss(g, L, M) {
    const t = M.K.t, w = M.w || 1;
    g.fillStyle = L([150, 148, 142]); g.fillRect(-0.1, -0.1, w + 0.2, 0.6);
    g.strokeStyle = L([184, 182, 176], 0.7); g.lineWidth = 0.03;
    for (let i = 0; i < 6; i++) { const x = ((t * 1.6 + i * 0.37) % 1.4) - 0.2; g.beginPath(); g.moveTo(x, 0.08 + (i % 3) * 0.08); g.lineTo(x + 0.25, 0.1 + (i % 3) * 0.08); g.stroke(); }
  }
  function betonStrahl(g, K, a, pl, MP) {
    /* fällt in die Fundamentschalung (Grube): über der Erde frei, darunter
       nur durch die Grubenöffnung zu sehen */
    const W = pl.wand, BP = pl.bagger;
    const ziel = [a[0] + 0.35, a[1], BP && BP.graben ? -BP.tief + 0.2 : -1.7];
    const n = 12, pts = [];
    for (let i = 0; i <= n; i++) { const k = i / n; pts.push(K.p(lerp(a[0], ziel[0], k * 0.6), a[1], lerp(a[2], ziel[2], k * k))); }
    const f = K.licht([0.3, 0.3, 0.9], a);
    const gr = BP ? BP.grube : { x0: W.x0 - 0.35, x1: W.x1 + 0.35, y0: W.y0 - 0.35, y1: W.y1 + 0.35 };
    const O = [K.p(gr.x0, gr.y0, 0), K.p(gr.x1, gr.y0, 0), K.p(gr.x1, gr.y1, 0), K.p(gr.x0, gr.y1, 0)];
    const yB = K.p(a[0], a[1], 0)[1];
    const strahl = () => {
      g.lineCap = "round"; g.lineJoin = "round";
      g.strokeStyle = rgbS([142 * f[0], 140 * f[1], 134 * f[2]]); g.lineWidth = Math.max(1, 0.22 * K.s);
      g.beginPath(); pts.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.stroke();
      g.strokeStyle = rgbS([196 * f[0], 194 * f[1], 188 * f[2]], 0.6); g.lineWidth = Math.max(0.6, 0.06 * K.s);
      g.setLineDash([0.12 * K.s, 0.2 * K.s]); g.lineDashOffset = -K.t * 3 * K.s;
      g.beginPath(); pts.forEach((p, i) => (i ? g.lineTo(p[0] - 0.03 * K.s, p[1]) : g.moveTo(p[0] - 0.03 * K.s, p[1]))); g.stroke();
      g.setLineDash([]);
    };
    const W2 = ST.kamera.W * 2;
    g.save(); g.beginPath(); g.rect(-W2, -W2, 3 * W2, yB + W2); g.clip(); strahl(); g.restore();
    g.save(); g.beginPath(); g.rect(-W2, yB, 3 * W2, W2); g.clip();
    g.beginPath(); O.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.closePath(); g.clip();
    strahl(); g.restore();
  }

  /* =====================================================================
     DIE ARBEITER
     XANDER: „wie die kleinen Menschen realistisch mit ihren Hämmerchen
     dieses Werk aufbauen." – Echte Proportionen (1,68–1,84 m), Helm
     (weiß der Polier, gelb, orange, blau die Leute), Warnweste mit
     silbernen Reflexstreifen, im Winter dicke Jacke und Handschuhe, im
     Frühling Hemd, manche mit hochgekrempelten Ärmeln. Gezeichnet wie die
     Leute im Dorf mit ST.gestalt: Ellipsoide und Kapseln im Licht der
     Szene, Arme über zwei Gelenke zum Werkzeug gerechnet.
     ===================================================================== */
  const GS = ST.gestalt;
  const HAUT = [[236, 198, 172], [228, 184, 154], [214, 164, 132], [178, 126, 94], [140, 96, 70]];
  const HAAR = [[58, 40, 28], [28, 24, 22], [150, 120, 80], [120, 118, 116], [96, 64, 40]];
  const HELM = [[246, 246, 242], [246, 196, 22], [242, 116, 24], [36, 92, 176], [246, 196, 22], [242, 116, 24]];
  function tracht(nr, saat, jahr) {
    const r = ST.zufall(((saat | 0) * 7919 + nr * 104729) >>> 0 || 1);
    const w = (L) => L[Math.floor(r() * L.length) % L.length];
    const winter = jahr === "winter" || jahr === "herbst";
    const a = {
      H: 1.68 + r() * 0.16, breit: 0.96 + r() * 0.12, haut: w(HAUT), haar: w(HAAR),
      helm: nr === 0 ? HELM[0] : w(HELM.slice(1)),
      weste: r() < 0.62 ? [255, 108, 18] : [214, 236, 36],
      hose: r() < 0.3 ? [34, 34, 36] : w([[46, 54, 72], [62, 66, 72], [52, 60, 80], [70, 60, 48]]),
      schuh: w([[60, 44, 30], [40, 36, 34], [96, 70, 40]]),
      bart: r() < 0.35
    };
    if (winter) {
      a.aermel = w([[40, 44, 52], [58, 62, 68], [34, 50, 84], [74, 56, 42], [96, 30, 30]]);
      a.hand = w([[70, 70, 74], [196, 158, 60], [210, 90, 30]]);
      a.kragen = w([[30, 30, 34], [60, 60, 66], [120, 30, 30]]);
      a.nackt = false;
    } else {
      a.aermel = w([[150, 50, 44], [64, 90, 132], [96, 100, 104], [176, 164, 140], [60, 110, 80], [226, 222, 212]]);
      a.hand = r() < 0.5 ? [200, 176, 90] : null;
      a.nackt = r() < 0.45;
      a.kragen = null;
    }
    return a;
  }
  function masseA(a) {
    const H = a.H;
    return { H: H, huefte: 0.53 * H, schulter: 0.815 * H, sb: 0.105 * H * a.breit, hb: 0.052 * H * a.breit, oa: 0.172 * H, ua: 0.152 * H, hals: 0.84 * H, kopf: 0.927 * H, kr: 0.066 * H };
  }
  function ikA(S, T, L1, L2, pol) {
    const d = sub(T, S);
    let l = len(d);
    const dir = mul(d, 1 / (l || 1));
    l = klemm(l, Math.abs(L1 - L2) + 1e-3, L1 + L2 - 1e-3);
    const ca = (L1 * L1 + l * l - L2 * L2) / (2 * L1 * l), h = L1 * Math.sqrt(Math.max(0, 1 - ca * ca));
    const pp = nrm(sub(pol, mul(dir, dot(pol, dir))));
    return [add(S, add(mul(dir, ca * L1), mul(pp, h))), add(S, mul(dir, l))];
  }
  /* Skelett in Körperkoordinaten (x rechts, y vorn, z oben, Fußpunkt 0) */
  function skelettA(a, P) {
    const m = masseA(a), H = m.H;
    const bl = m.huefte, Lt = bl * 0.462, Ls = bl * 0.465, Lf = bl - Lt - Ls;
    const beinH = (b) => Lt * Math.cos(b.a) * Math.cos(b.b || 0) + Ls * Math.cos(b.a - b.k) * Math.cos(b.b || 0) + Lf;
    const z0 = P.z0 != null ? P.z0 : Math.max(beinH(P.bein[0]), beinH(P.bein[1])) + (P.z || 0);
    const P0 = [P.x || 0, P.y || 0, z0];
    const U = nrm([Math.sin(P.seit || 0), Math.sin(P.neig || 0), Math.cos(P.neig || 0) * Math.cos(P.seit || 0)]);
    let X = [Math.cos(P.dreh || 0), Math.sin(P.dreh || 0), 0];
    X = nrm(sub(X, mul(U, dot(X, U))));
    const Y = kreuz(U, X);
    const T = (dx, dy, dz) => add(P0, add(mul(X, dx), add(mul(Y, dy), mul(U, dz))));
    const sk = { m: m, P0: P0, U: U, X: X, Y: Y, T: T, bein: [], arm: [] };
    for (let i = 0; i < 2; i++) {
      const sd = i ? 1 : -1, b = P.bein[i], sb = Math.sin(b.b || 0) * sd, cb = Math.cos(b.b || 0);
      const Hj = add(P0, [sd * m.hb, 0, 0]);
      const Kn = add(Hj, mul([sb, Math.sin(b.a) * cb, -Math.cos(b.a) * cb], Lt));
      const An = add(Kn, mul([sb, Math.sin(b.a - b.k) * cb, -Math.cos(b.a - b.k) * cb], Ls));
      const phi = (b.a - b.k) + (b.f || 0);
      const D = [0, Math.cos(phi), Math.sin(phi)];
      sk.bein.push({ H: Hj, K: Kn, A: An, D: D, fuss: add(An, add(mul(D, 0.045 * H), [0, 0, -0.018 * H])) });
    }
    const Sm = T(0, 0, m.schulter - m.huefte);
    for (let i = 0; i < 2; i++) {
      const sd = i ? 1 : -1, ar = P.arm[i];
      const S = add(Sm, mul(X, sd * m.sb));
      let E, Hd;
      if (ar.ziel) {
        const pol = ar.pol || add(mul(X, sd * 0.5), add(mul(Y, -0.5), mul(U, -0.7)));
        [E, Hd] = ikA(S, ar.ziel, m.oa, m.ua, pol);
      } else {
        const ab = ar.ab || 0.08;
        const d1 = nrm(add(mul(X, sd * Math.sin(ab)), add(mul(Y, Math.sin(ar.a) * Math.cos(ab)), mul(U, -Math.cos(ar.a) * Math.cos(ab)))));
        E = add(S, mul(d1, m.oa));
        const w2 = ar.a + ar.e;
        const d2 = nrm(add(mul(X, sd * Math.sin(ab) * 0.4), add(mul(Y, Math.sin(w2)), mul(U, -Math.cos(w2)))));
        Hd = add(E, mul(d2, m.ua));
      }
      sk.arm.push({ S: S, E: E, Hd: Hd });
    }
    sk.N = T(0, 0, m.hals - m.huefte);
    const kn = P.kopfNick || 0, kd = P.kopfDreh || 0;
    const Xh0 = nrm(add(mul(X, Math.cos(kd)), mul(Y, Math.sin(kd)))), Yh0 = kreuz(U, Xh0);
    const Uh = nrm(add(mul(U, Math.cos(kn)), mul(Yh0, Math.sin(kn))));
    const Yh = nrm(sub(Yh0, mul(Uh, dot(Yh0, Uh))));
    sk.Xh = Xh0; sk.Yh = Yh; sk.Uh = Uh;
    sk.K = add(sk.N, mul(Uh, m.kopf - m.hals));
    return sk;
  }
  function eiA(B, c, A, ra, Bv, rb, C, rc, farbe, opt) { return B.ei(c, mul(A, ra), mul(Bv, rb), mul(C, rc), farbe, opt); }
  /* Der ganze Arbeiter */
  function arbeiterKoerper(B, a, sk) {
    const m = sk.m, H = m.H, s = B.s;
    const fein = s > 24, sehrFein = s > 64;
    /* Beine: Arbeitshose, Sicherheitsschuhe */
    for (let i = 0; i < 2; i++) {
      const b = sk.bein[i];
      B.glied(b.H, 0.055 * H, b.K, 0.041 * H, a.hose);
      B.glied(b.K, 0.039 * H, b.A, 0.03 * H, a.hose);
      B.glied(mix3(b.K, b.A, 0.66), 0.034 * H, b.A, 0.032 * H, a.schuh, { tiefe: 0.005 });
      const qu = nrm([b.D[2] * 0 + 1, 0, 0]);
      eiA(B, b.fuss, b.D, 0.078 * H, qu, 0.034 * H, nrm(kreuz(qu, b.D)), 0.03 * H, a.schuh, { tiefe: 0.01 });
    }
    /* Rumpf: Warnweste mit zwei Reflexstreifen rundum */
    const hz = m.huefte;
    const Ralt = B.R;
    B.rahmen(GS.rahmen(B.pk(sk.P0), B.rk(sk.X), B.rk(sk.Y), B.rk(sk.U)));
    const lok = (dx, dy, dz) => [dx, dy, dz];
    const wOpt = {};
    if (fein) wOpt.flecken = [{ c: [0, 0.07 * H, 0.66 * H - hz], a: [[0.006 * H, 0, 0], [0, 0.02 * H, 0], [0, 0, 0.12 * H]], alb: mul(a.weste, 0.7), n: [0, 1, 0], k: 0.5 }];
    B.koerper([
      { c: lok(0, -0.004 * H, m.schulter - hz + 0.01 * H), a: [[0.115 * H * a.breit, 0, 0], [0, 0.07 * H, 0], [0, 0, 0.045 * H]] },
      { c: lok(0, 0.006 * H, 0.71 * H - hz), a: [[0.108 * H * a.breit, 0, 0], [0, 0.078 * H, 0], [0, 0, 0.07 * H]] },
      { c: lok(0, 0.004 * H, 0.585 * H - hz), a: [[0.1 * H * a.breit, 0, 0], [0, 0.072 * H, 0], [0, 0, 0.05 * H]] },
      { c: lok(0, 0, 0.535 * H - hz), a: [[0.1 * H * a.breit, 0, 0], [0, 0.07 * H, 0], [0, 0, 0.02 * H]] }
    ], a.weste, wOpt);
    /* Reflexstreifen: zwei Bänder rund um die Weste, nur der sichtbare Bogen */
    if (s > 16) {
      const silber = [226, 230, 234], bw = Math.max(0.03, 0.028 * H);
      for (const [zS, rx, ry] of [[0.695 * H - hz, 0.113 * H * a.breit, 0.082 * H], [0.6 * H - hz, 0.106 * H * a.breit, 0.077 * H]]) {
        let lauf = [];
        const runs = [];
        for (let i = 0; i <= 24; i++) {
          const w = -Math.PI + i / 24 * TAU;
          const nl = nrm([Math.sin(w) / rx, Math.cos(w) / ry, 0]);
          if (dot(B.rk(nl), AUGE) > 0.05) lauf.push({ p: [Math.sin(w) * rx * 1.05, Math.cos(w) * ry * 1.05, zS], n: nl });
          else if (lauf.length) { runs.push(lauf); lauf = []; }
        }
        if (lauf.length) runs.push(lauf);
        for (const r of runs) if (r.length > 1) B.band(r.map((q) => q.p), bw, silber, { n: r[Math.floor(r.length / 2)].n, tiefe: 0.08, glanz: 0.6 });
      }
    }
    /* Gürtel und Hosenbund */
    B.ei(lok(0, 0, 0.52 * H - hz), [0.1 * H * a.breit, 0, 0], [0, 0.07 * H, 0], [0, 0, 0.02 * H], a.hose, { tiefe: -0.002 });
    if (a.kragen) B.ei(lok(0, 0, m.hals - hz - 0.01 * H), [0.05 * H, 0, 0], [0, 0.048 * H, 0], [0, 0, 0.028 * H], a.kragen, { tiefe: 0.01 });
    B.rahmen(Ralt);
    /* Arme */
    for (let i = 0; i < 2; i++) {
      const ar = sk.arm[i];
      B.glied(ar.S, 0.045 * H, ar.E, 0.037 * H, a.aermel, { tiefe: 0.002 });
      if (a.nackt) {
        B.glied(ar.E, 0.034 * H, mix3(ar.E, ar.Hd, 0.25), 0.032 * H, a.aermel, { tiefe: 0.003 });
        B.glied(mix3(ar.E, ar.Hd, 0.25), 0.028 * H, mix3(ar.E, ar.Hd, 0.92), 0.022 * H, a.haut, { tiefe: 0.003 });
      } else B.glied(ar.E, 0.036 * H, mix3(ar.E, ar.Hd, 0.92), 0.03 * H, a.aermel, { tiefe: 0.003 });
      const dir = nrm(sub(ar.Hd, ar.E));
      const q = len(kreuz(dir, [0, 0, 1])) > 0.1 ? nrm(kreuz(dir, [0, 0, 1])) : [1, 0, 0];
      B.ei(add(ar.Hd, mul(dir, 0.018 * H)), mul(dir, 0.036 * H), mul(q, 0.026 * H), [0, 0, 0.024 * H], a.hand || a.haut, { tiefe: 0.004 });
    }
    /* Kopf, Gesicht, Helm */
    const K = sk.K, Xh = sk.Xh, Yh = sk.Yh, Uh = sk.Uh, kr = m.kr;
    B.glied(sk.N, 0.029 * H, add(sk.N, mul(Uh, 0.05 * H)), 0.027 * H, a.haut);
    const kopfOpt = { flecken: [] };
    if (a.bart && fein) kopfOpt.flecken.push({ c: add(K, add(mul(Yh, 0.62 * kr), mul(Uh, -0.55 * kr))), a: [mul(Xh, 0.62 * kr), mul(Yh, 0.4 * kr), mul(Uh, 0.4 * kr)], alb: mul(a.haar, 0.9), n: Yh, k: 0.85, hart: 0.6 });
    const kopfAlb = s < 22 ? mix3(a.haut, a.helm, 0.25) : a.haut;
    eiA(B, K, Xh, 0.8 * kr, Yh, 0.88 * kr, Uh, kr, kopfAlb, kopfOpt);
    eiA(B, add(K, add(mul(Yh, -0.4 * kr), mul(Uh, -0.25 * kr))), Xh, 0.76 * kr, Yh, 0.5 * kr, Uh, 0.6 * kr, a.haar, { tiefe: -0.03 });
    if (fein) {
      eiA(B, add(K, add(mul(Yh, 0.86 * kr), mul(Uh, -0.1 * kr))), Xh, 0.13 * kr, Yh, 0.16 * kr, Uh, 0.2 * kr, mul(a.haut, 0.97), { tiefe: 0.02 });
      for (const sd of [1, -1]) eiA(B, add(K, mul(Xh, sd * 0.8 * kr)), Xh, 0.08 * kr, Yh, 0.16 * kr, Uh, 0.24 * kr, mul(a.haut, 0.95), { tiefe: -0.005 });
    }
    if (sehrFein) for (const sd of [1, -1]) eiA(B, add(K, add(mul(Yh, 0.8 * kr), add(mul(Xh, sd * 0.3 * kr), mul(Uh, 0.1 * kr)))), Xh, 0.07 * kr, Yh, 0.04 * kr, Uh, 0.05 * kr, [48, 36, 32], { tiefe: 0.015 });
    /* Schutzhelm: Kalotte, Schirm vorn, umlaufende Krempe */
    eiA(B, add(K, add(mul(Uh, 0.42 * kr), mul(Yh, -0.02 * kr))), Xh, 1.06 * kr, Yh, 1.16 * kr, Uh, 0.86 * kr, a.helm, { tiefe: 0.02, glanz: fein ? 0.5 : 0 });
    eiA(B, add(K, add(mul(Uh, 0.2 * kr), mul(Yh, 0.22 * kr))), Xh, 1.1 * kr, Yh, 1.36 * kr, Uh, 0.09 * kr, mul(a.helm, 0.92), { tiefe: 0.021 });
    if (fein) eiA(B, add(K, mul(Uh, 1.2 * kr)), Xh, 0.16 * kr, Yh, 0.9 * kr, Uh, 0.12 * kr, mul(a.helm, 0.95), { tiefe: 0.022 });
  }
  /* Kiste aus Platten (für Werkzeug und Lasten in der Hand) */
  function bKiste(B, M, A, Bv, C, a, b, c, alb, opt) {
    const P = (i, j, k) => add(M, add(mul(A, a * i), add(mul(Bv, b * j), mul(C, c * k))));
    const o = opt || {};
    B.platte([P(1, -1, -1), P(1, 1, -1), P(1, 1, 1), P(1, -1, 1)], alb, Object.assign({ n: A }, o));
    B.platte([P(-1, -1, -1), P(-1, 1, -1), P(-1, 1, 1), P(-1, -1, 1)], alb, Object.assign({ n: mul(A, -1) }, o));
    B.platte([P(-1, 1, -1), P(1, 1, -1), P(1, 1, 1), P(-1, 1, 1)], alb, Object.assign({ n: Bv }, o));
    B.platte([P(-1, -1, -1), P(1, -1, -1), P(1, -1, 1), P(-1, -1, 1)], alb, Object.assign({ n: mul(Bv, -1) }, o));
    B.platte([P(-1, -1, 1), P(1, -1, 1), P(1, 1, 1), P(-1, 1, 1)], (o.oben || alb), Object.assign({ n: C }, o));
    B.platte([P(-1, -1, -1), P(1, -1, -1), P(1, 1, -1), P(-1, 1, -1)], alb, Object.assign({ n: mul(C, -1) }, o));
  }

  /* ---------------- Gangbild und Haltungen ---------------- */
  function gehBeine(a, ph, g) {
    const m = masseA(a), bl = m.huefte;
    const A = (0.41 * a.H) / (Math.PI * bl) * g;
    const bein = [];
    for (let i = 0; i < 2; i++) {
      const w = (ph + (i ? 0.5 : 0)) * TAU;
      bein.push({
        a: A * Math.sin(w) + 0.03,
        k: 0.07 + g * (0.88 * Math.pow(Math.max(0, Math.cos(w + 0.35)), 1.7) + 0.14 * Math.max(0, Math.sin(2 * w - 0.6))),
        f: g * (-0.32 * Math.pow(Math.max(0, -Math.cos(w + 0.9)), 2) + 0.1 * Math.max(0, Math.sin(w + 0.3))), b: 0
      });
    }
    return bein;
  }
  const STAND = () => [{ a: 0.06, k: 0.12, b: 0.05 }, { a: -0.04, k: 0.08, b: 0.05 }];
  /* Hin und her auf einer Strecke: Position, Blickrichtung, Schrittphase */
  function pendel(A, B, t, v, pause) {
    const L = Math.hypot(B[0] - A[0], B[1] - A[1]) || 0.01;
    const T1 = L / v, T = 2 * (T1 + pause);
    let u = t % T; if (u < 0) u += T;
    const hH = Math.atan2(B[1] - A[1], B[0] - A[0]), hR = hH + Math.PI;
    let k, hin, geht, h;
    if (u < T1) { k = u / T1; hin = true; geht = true; h = hH; }
    else if (u < T1 + pause) { k = 1; hin = true; geht = false; h = hH + winkelDiff(hR, hH) * glatt((u - T1 - pause + 0.8) / 0.8); }
    else if (u < 2 * T1 + pause) { k = 1 - (u - T1 - pause) / T1; hin = false; geht = true; h = hR; }
    else { k = 0; hin = false; geht = false; h = hR + winkelDiff(hH, hR) * glatt((u - 2 * T1 - 2 * pause + 0.8) / 0.8); }
    const weg = geht ? (hin ? u : u - T1 - pause) * v : 0;
    return { x: lerp(A[0], B[0], k), y: lerp(A[1], B[1], k), h: h, geht: geht, hin: hin, ph: weg / 1.5, u: u, T1: T1 };
  }

  /* Eine Buehne für einen Arbeiter an (x, y, z) mit Blickrichtung h (Modell) */
  function buehneA(K, x, y, z, h) {
    const B = new GS.Buehne({ s: K.s, X0: K.X0, Y0: K.Y0, Z: K.Z, jahr: K.jahr, lampen: K.lampenB });
    const vor = [Math.cos(h), Math.sin(h), 0], rechts = [Math.sin(h), -Math.cos(h), 0];
    B.rahmen(GS.rahmen(K.nk([x, y, z]), K.nk(rechts), K.nk(vor), [0, 0, 1]));
    B.gruppe(0);
    return B;
  }
  /* Kontaktschatten am Boden oder auf der Bohle */
  function fussSchatten(g, K, x, y, z, r, k) {
    const P = K.p(x, y, z), rr = r * K.s;
    if (rr < 1) return;
    g.save(); g.translate(P[0], P[1]); g.scale(1, 0.5);
    const gr = g.createRadialGradient(0, 0, 0, 0, 0, rr);
    gr.addColorStop(0, "rgba(20,24,40," + (0.35 * (k || 1)).toFixed(3) + ")"); gr.addColorStop(1, "rgba(20,24,40,0)");
    g.fillStyle = gr; g.fillRect(-rr, -rr, 2 * rr, 2 * rr);
    g.restore();
  }

  /* ---------------- Tätigkeiten ----------------
     Jede liefert eine Haltung P (Körperkoordinaten) und malt ihr Werkzeug.
     t = Sekunden, a = Tracht. */
  const HOLZSTIEL = [176, 132, 80], STAHLW = [120, 124, 132];
  const TUN = {
    /* Hämmern: Nagel vor sich auf Hüft- bis Brusthöhe; Schlag alle 0,8 s */
    haemmern(a, t, o) {
      const zN = o.hoehe || 1.05, T = 0.82, ph = ((t + (o.versatz || 0)) / T) % 1;
      const N = [0.04, o.weit || 0.5, zN];
      let k;
      if (ph < 0.58) k = glatt(ph / 0.58);            // ausholen
      else if (ph < 0.7) k = 1 - Math.pow((ph - 0.58) / 0.12, 2);   // Schlag
      else k = 0;
      const tief = zN < 0.9;
      const hand0 = add(N, [0.1, -0.22, 0.06]), hand1 = [0.26, 0.08, Math.min(1.75, zN + 0.62)];
      const hand = mix3(hand0, hand1, k);
      const P = {
        bein: tief ? [{ a: 0.35, k: 0.75, b: 0.08 }, { a: -0.1, k: 0.5, b: 0.08 }] : STAND(),
        neig: tief ? 0.45 : 0.12 + (1 - k) * 0.05, dreh: 0, kopfNick: tief ? 0.5 : 0.35,
        arm: [{ ziel: add(N, [-0.13, -0.05, 0.03]) }, { ziel: hand, pol: [0.8, -0.2, -0.5] }]
      };
      P.werkzeug = (B, sk) => {
        const Hd = sk.arm[1].Hd;
        const dS = nrm(sub(N, Hd)), dO = nrm([0.1, -0.5, 0.8]);
        const d = nrm(mix3(dS, dO, k));
        B.glied(add(Hd, mul(d, -0.04)), 0.014, add(Hd, mul(d, 0.3)), 0.012, HOLZSTIEL);
        const quer = nrm(kreuz(d, [1, 0, 0]));
        B.ei(add(Hd, mul(d, 0.31)), mul(quer, 0.07), mul(d, 0.022), [0.022, 0, 0], STAHLW, { glanz: 0.6 });
        B.ei(add(N, [0, 0, 0.005]), [0.006, 0, 0], [0, 0.006, 0], [0, 0, 0.02], [150, 150, 156]);
      };
      P.schlag = ph >= 0.68 && ph < 0.7 + 0.02;
      P.schlagZeit = Math.floor((t + (o.versatz || 0)) / T);
      return P;
    },
    /* Sägen mit dem Fuchsschwanz am Sägebock */
    saegen(a, t, o) {
      const ph = Math.sin((t + (o.versatz || 0)) * TAU / 0.95);
      const G = [0.16, 0.36 + 0.18 * ph, 0.98 - 0.06 * ph];
      const d = nrm([0, 1, -0.55]);
      const P = {
        bein: [{ a: 0.2, k: 0.3, b: 0.12 }, { a: -0.18, k: 0.15, b: 0.1 }],
        neig: 0.32, dreh: -0.1, kopfNick: 0.45,
        arm: [{ ziel: [-0.24, 0.42, 0.86] }, { ziel: G, pol: [0.9, -0.4, -0.3] }]
      };
      P.werkzeug = (B, sk) => {
        const Hd = sk.arm[1].Hd, n = [1, 0, 0], unten = nrm(kreuz(d, n));
        const p = (l, q) => add(Hd, add(mul(d, l), mul(unten, q)));
        B.platte([p(0.07, -0.02), p(0.62, 0.0), p(0.62, 0.08), p(0.07, 0.13)], [196, 200, 206], { n: n, beidseitig: true, kante: "rgba(60,60,60,0.5)" });
        B.glied(p(-0.03, 0.02), 0.022, p(0.07, 0.05), 0.022, [150, 40, 30]);
        /* Sägemehl rieselt unter dem Schnitt */
        const sp = [0.08, 0.72, 0.8];
        B.eigen(sp, (g, B2) => {
          const ss = B2.s;
          for (let i = 0; i < 7; i++) {
            const ft = ((t * 1.3 + i / 7) % 1), q = B2.bild(B2.pk([0.08 + Math.sin(i * 7) * 0.03, 0.72 + Math.cos(i * 3) * 0.03, 0.8 - ft * 0.75]));
            g.fillStyle = "rgba(226,196,140," + (0.9 * (1 - ft)).toFixed(3) + ")";
            g.fillRect(q[0], q[1], Math.max(0.8, ss * 0.012), Math.max(0.8, ss * 0.012));
          }
        });
      };
      return P;
    },
    /* Stehen mit Bauplan (der Polier) */
    plan(a, t, o) {
      const blick = Math.sin(t * 0.4 + (o.versatz || 0)) > 0.3;
      const P = {
        bein: STAND(), neig: 0.03, dreh: 0, kopfNick: blick ? -0.05 : 0.45, kopfDreh: blick ? 0.3 * Math.sin(t * 0.3) : 0,
        arm: [{ ziel: [-0.2, 0.34, 1.12] }, { ziel: [0.2, 0.34, 1.12] }]
      };
      P.werkzeug = (B) => {
        B.platte([[-0.24, 0.36, 1.2], [0.24, 0.36, 1.2], [0.24, 0.42, 1.0], [-0.24, 0.42, 1.0]], [236, 236, 228], { n: [0, -0.9, 0.4], beidseitig: true, innen: [226, 230, 236], muster: (g) => { g.strokeStyle = "rgba(40,60,120,0.6)"; g.lineWidth = 0.006; g.strokeRect(-0.2, 0.03, 0.4, 0.16); g.beginPath(); g.moveTo(-0.2, 0.1); g.lineTo(0.2, 0.1); g.moveTo(0, 0.03); g.lineTo(0, 0.19); g.stroke(); }, ursprung: [0, 0.39, 1.0], u: [1, 0, 0], v: [0, -0.3, 1] });
      };
      return P;
    },
    /* Einweisen: Anschläger am Lager, Arm hoch, Hand kreist (Zeichen „heben") */
    einweisen(a, t, o) {
      const aktiv = o.aktiv;
      const w = t * 5;
      const P = {
        bein: STAND(), neig: -0.05, dreh: 0, kopfNick: aktiv ? -0.55 : 0.1,
        arm: aktiv ? [{ a: 0.1, e: 0.4 }, { ziel: [0.3 + 0.05 * Math.cos(w), 0.15 + 0.05 * Math.sin(w), 1.95] }] : [{ a: 0.05, e: 0.3 }, { a: 0.05, e: 0.3 }]
      };
      return P;
    },
    /* Messlatte halten (rot-weiß, 4 m) */
    messen(a, t, o) {
      const P = { bein: STAND(), neig: 0.02, dreh: 0, kopfNick: 0.2, arm: [{ ziel: [-0.12, 0.34, 1.2] }, { ziel: [-0.1, 0.34, 0.95] }] };
      P.werkzeug = (B) => {
        const x = -0.12, y = 0.36;
        for (let i = 0; i < 8; i++) B.glied([x, y, 0.02 + i * 0.5], 0.025, [x, y, 0.5 + i * 0.5], 0.025, i % 2 ? [236, 236, 230] : [200, 36, 34], { flach: true });
      };
      return P;
    },
    /* Schurre führen */
    schurre(a, t, o) {
      const P = { bein: [{ a: 0.2, k: 0.25, b: 0.1 }, { a: -0.15, k: 0.12, b: 0.08 }], neig: 0.22, dreh: 0, kopfNick: 0.5, arm: [{ ziel: [-0.15, 0.5, 1.08] }, { ziel: [0.18, 0.52, 1.1] }] };
      return P;
    },
    /* Rüttelflasche in den frischen Beton */
    ruetteln(a, t, o) {
      const zit = Math.sin(t * 40) * 0.006;
      const P = { bein: [{ a: 0.25, k: 0.35, b: 0.1 }, { a: -0.15, k: 0.2, b: 0.1 }], neig: 0.4, dreh: 0, kopfNick: 0.5, arm: [{ ziel: [-0.08, 0.5 + zit, 0.8] }, { ziel: [0.12, 0.45, 0.95 + zit] }] };
      P.werkzeug = (B, sk) => {
        const h = sk.arm[0].Hd;
        B.band([h, [0.0, 0.8, 0.55], [0.0, 1.0, 0.0], [0.02, 1.05, -1.2 + zit]], 0.035, [40, 40, 42]);
        B.band([sk.arm[1].Hd, [0.6, 0.2, 0.6], [0.9, -0.3, 0.2], [1.1, -0.8, 0.05]], 0.03, [30, 30, 30]);
        bKiste(B, [1.2, -0.95, 0.15], [1, 0, 0], [0, 1, 0], [0, 0, 1], 0.2, 0.14, 0.15, [214, 96, 30]);
      };
      return P;
    },
    /* Malerrolle an der Wand (Ausbau) */
    rollen(a, t, o) {
      const ph = Math.sin((t + (o.versatz || 0)) * TAU / 1.6);
      const zR = 1.35 + 0.35 * ph;
      const P = { bein: STAND(), neig: 0.05, dreh: 0, kopfNick: -0.1 * ph, arm: [{ ziel: [-0.05, 0.42, zR - 0.28] }, { ziel: [0.08, 0.4, zR - 0.15] }] };
      P.werkzeug = (B, sk) => {
        const h = sk.arm[1].Hd, w = [0.05, o.weit - 0.05, zR];
        B.band([h, add(h, [0, 0.1, 0.1]), [w[0], w[1] - 0.04, w[2] - 0.02]], 0.014, [60, 60, 64]);
        B.glied([w[0] - 0.12, w[1], w[2]], 0.035, [w[0] + 0.12, w[1], w[2]], 0.035, o.farbe || [240, 236, 226]);
      };
      return P;
    },
    /* Stange/Rohr beim Abbau reichen */
    reichen(a, t, o) {
      const ph = (Math.sin(t * 1.3 + (o.versatz || 0)) + 1) / 2;
      const P = { bein: STAND(), neig: 0.05, dreh: 0, kopfNick: -0.3, arm: [{ ziel: [-0.2, 0.35, 1.3 + ph * 0.5] }, { ziel: [0.2, 0.35, 1.25 + ph * 0.5] }] };
      P.werkzeug = (B, sk) => { const a0 = sk.arm[0].Hd, a1 = sk.arm[1].Hd; const d = nrm(sub(a1, a0)); B.glied(add(a0, mul(d, -0.8)), 0.024, add(a1, mul(d, 0.9)), 0.024, F.stahl, { glanz: 0.5 }); };
      return P;
    }
  };

  /* ---------------- Weit weg: Menschen in Stufen ----------------
     Klein gezoomt (unter 44 Bildpunkten je Meter) reichen 15 neue Haltungen
     je Sekunde. Jeder Arbeiter hat seinen eigenen Takt (versetzt, damit
     nicht alle im selben Bild neu entstehen); dazwischen wird sein fertiges
     Bild und das seines Schattens nur aufgelegt. Nah dran entsteht jeder
     Mensch in jedem Bild neu. */
  const STUFE = 1 / 15, STUFE_S = 44;
  /* alles, was ein fertiges Bild ungültig macht: Zoom, Drehung, Licht */
  function kameraSchl(K) { return K.s + "|" + K.c.toFixed(4) + "|" + K.sn.toFixed(4) + "|" + K.nacht.toFixed(2) + "|" + K.jahr + "|" + K.lampen.length; }
  function stufig(K, pl, name, bauen) {
    if (K.s >= STUFE_S) return bauen(K);
    const C = pl._stufen || (pl._stufen = new Map());
    const schl = kameraSchl(K);
    let hs = 0;
    for (let i = 0; i < name.length; i++) hs = (hs * 31 + name.charCodeAt(i)) >>> 0;
    const off = (hs % 4) / 4, n = Math.floor(K.t / STUFE + off);
    let e = C.get(name);
    if (e && e.n === n && e.schl === schl) { e.jetzt = ST.jetzt; return e.it; }
    const Kq = Object.create(K);
    Kq.t = (n - off) * STUFE;
    const it = bauen(Kq);
    if (!it) { C.delete(name); return null; }
    if (!e) { e = { bild: null, sbild: null }; C.set(name, e); }
    e.n = n; e.schl = schl; e.it = it; e.jetzt = ST.jetzt;
    alsBild(K, it, e);
    /* wer nicht mehr gebraucht wird (Phase vorbei), fliegt raus */
    if (C.size > 24) for (const [k, x] of C) if (x.jetzt !== ST.jetzt) C.delete(k);
    return it;
  }
  /* Malen und Schatten eines Teils einmal in ein kleines Bild, dann nur
     noch auflegen (die Leinwände werden wiederverwendet) */
  function alsBild(K, it, e) {
    const malen = it.malen, schatten = it.schatten, pad = Math.ceil(3 + K.s * 0.35);
    bildGrenzen(K, it);
    const rahmen = (b) => { const x0 = Math.floor(b[0]) - pad, y0 = Math.floor(b[1]) - pad; return [x0, y0, Math.ceil(b[2]) + pad - x0, Math.ceil(b[3]) + pad - y0]; };
    const auf = (c, R) => {
      if (!c) c = document.createElement("canvas");
      if (c.width !== R[2] || c.height !== R[3]) { c.width = R[2]; c.height = R[3]; }
      const cg = c.getContext("2d");
      cg.setTransform(1, 0, 0, 1, 0, 0); cg.clearRect(0, 0, R[2], R[3]); cg.translate(-R[0], -R[1]);
      return c;
    };
    const R = rahmen(it.sb);
    let fertig = false;
    it.malen = (g) => {
      if (!fertig) { e.bild = auf(e.bild, R); malen(e.bild.getContext("2d")); fertig = true; }
      g.drawImage(e.bild, R[0], R[1]);
    };
    if (schatten) {
      /* Schattengrenzen: die Kiste des Teils auf den Boden gelegt */
      const [x0, y0, x1, y1] = it.bb, z0 = it.z0 || 0, z1 = it.z1 || 1;
      let a = Infinity, b = Infinity, c = -Infinity, d = -Infinity;
      for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) {
        const P = K.sp(x, y, z);
        if (P[0] < a) a = P[0]; if (P[0] > c) c = P[0]; if (P[1] < b) b = P[1]; if (P[1] > d) d = P[1];
      }
      const RS = rahmen([a, b, c, d]);
      let sFertig = false;
      it.schatten = (sg) => {
        if (!sFertig) { e.sbild = auf(e.sbild, RS); schatten(e.sbild.getContext("2d")); sFertig = true; }
        sg.drawImage(e.sbild, RS[0], RS[1]);
      };
    }
  }

  /* Ein stehender Arbeiter mit Tätigkeit als Posten (Boden) */
  function arbeiterPosten(K, pl, nr, x, y, z, h, tun, o, liste, name) {
    if (!GS) return null;
    const it = stufig(K, pl, (name || "arbeiter-" + nr) + "|" + tun + "|" + x.toFixed(2) + "|" + y.toFixed(2) + "|" + z.toFixed(2), (Kq) => arbeiterBauen(Kq, pl, nr, x, y, z, h, tun, o, name));
    if (it && liste) liste.push(it);
    return it;
  }
  function arbeiterBauen(K, pl, nr, x, y, z, h, tun, o, name) {
    const a = tracht(nr, pl.saat, K.jahr);
    const P = TUN[tun](a, K.t + nr * 1.7, o || {});
    const sk = skelettA(a, P);
    const B = buehneA(K, x, y, z, h);
    arbeiterKoerper(B, a, sk);
    if (P.werkzeug) P.werkzeug(B, sk);
    const it = {
      name: name || "arbeiter-" + nr, ton: P.schlag ? "hammer" : null, bb: [x - 0.45, y - 0.45, x + 0.45, y + 0.45], z0: z, z1: z + 2, zSort: z,
      malen: (g) => { fussSchatten(g, K, x, y, z + 0.01, 0.45, 0.8); B.malen(g); },
      schatten: z < 0.3 ? (sg) => B.schattenMalen(sg) : null
    };
    return it;
  }
  /* Schubkarre schieben: hin beladen, zurück leer */
  function karrePosten(K, pl, nr, A, Bp, inhalt, liste) {
    if (!GS) return;
    const it = stufig(K, pl, "karre-" + nr + "|" + inhalt, (Kq) => karreBauen(Kq, pl, nr, A, Bp, inhalt));
    if (it) liste.push(it);
  }
  function karreBauen(K, pl, nr, A, Bp, inhalt) {
    const a = tracht(nr, pl.saat, K.jahr);
    const pd = pendel(A, Bp, K.t + nr * 3.1, 1.05, 2.2);
    const beine = pd.geht ? gehBeine(a, pd.ph, 1) : STAND();
    const P = { bein: beine, neig: 0.16, dreh: 0, kopfNick: 0.15, arm: [{ ziel: [-0.29, 0.44, 0.74] }, { ziel: [0.29, 0.44, 0.74] }], z: pd.geht ? 0.01 * Math.abs(Math.sin(pd.ph * TAU)) : 0 };
    const sk = skelettA(a, P);
    const B = buehneA(K, pd.x, pd.y, 0, pd.h);
    arbeiterKoerper(B, a, sk);
    /* Schubkarre: Mulde, Rad, Holme, Stützen – vorn im Körperkoordinatensystem */
    const voll = pd.hin || (!pd.geht && pd.u < pd.T1 + 1.2);
    const gruen = [60, 96, 70], rahmen = [40, 42, 46];
    B.glied([-0.29, 0.44, 0.74], 0.018, [-0.18, 1.3, 0.46], 0.018, rahmen);
    B.glied([0.29, 0.44, 0.74], 0.018, [0.18, 1.3, 0.46], 0.018, rahmen);
    B.ei([0, 1.52, 0.2], [0.05, 0, 0], [0, 0.2, 0], [0, 0, 0.2], F.gummi);
    B.glied([-0.06, 1.52, 0.2], 0.012, [-0.15, 1.2, 0.46], 0.012, rahmen);
    B.glied([0.06, 1.52, 0.2], 0.012, [0.15, 1.2, 0.46], 0.012, rahmen);
    for (const sd of [-1, 1]) B.glied([sd * 0.2, 0.85, 0.45], 0.014, [sd * 0.22, 0.8, 0.1], 0.014, rahmen);
    const mu = [[-0.3, 0.7, 0.72], [0.3, 0.7, 0.72], [0.34, 1.42, 0.7], [-0.34, 1.42, 0.7]];
    const bo = [[-0.18, 0.84, 0.44], [0.18, 0.84, 0.44], [0.2, 1.22, 0.42], [-0.2, 1.22, 0.42]];
    B.platte([mu[0], mu[1], bo[1], bo[0]], gruen, { n: [0, -0.8, 0.3], innen: mul(gruen, 0.7) });
    B.platte([mu[3], mu[2], bo[2], bo[3]], gruen, { n: [0, 0.8, 0.3], innen: mul(gruen, 0.7) });
    B.platte([mu[0], mu[3], bo[3], bo[0]], gruen, { n: [-0.9, 0, 0.2], innen: mul(gruen, 0.7) });
    B.platte([mu[1], mu[2], bo[2], bo[1]], gruen, { n: [0.9, 0, 0.2], innen: mul(gruen, 0.7) });
    if (voll) {
      const farbe = inhalt === "beton" ? [150, 148, 140] : inhalt === "erde" ? F.erde : F.sand;
      B.ei([0, 1.08, 0.7], [0.3, 0, 0], [0, 0.34, 0], [0, 0, 0.12], farbe, { tiefe: 0.02 });
    }
    const x = pd.x, y = pd.y, vx = Math.cos(pd.h), vy = Math.sin(pd.h);
    const bx = [x, x + vx * 1.6], by = [y, y + vy * 1.6];
    return ({
      name: "karre-" + nr, bb: [Math.min(...bx) - 0.45, Math.min(...by) - 0.45, Math.max(...bx) + 0.45, Math.max(...by) + 0.45], z1: 2, zSort: 0,
      malen: (g) => { fussSchatten(g, K, x + vx * 0.6, y + vy * 0.6, 0.01, 0.9, 0.7); B.malen(g); },
      schatten: (sg) => B.schattenMalen(sg)
    });
  }
  /* Zwei tragen einen Balken auf der Schulter (hin beladen, zurück leer) */
  function tragenPosten(K, pl, nr, A, Bp, liste, art) {
    if (!GS) return;
    const it = stufig(K, pl, "tragen-" + nr + "|" + art + "|" + A.join(",") + "|" + Bp.join(","), (Kq) => tragenBauen(Kq, pl, nr, A, Bp, art));
    if (it) liste.push(it);
  }
  function tragenBauen(K, pl, nr, A, Bp, art) {
    const a1 = tracht(nr, pl.saat, K.jahr), a2 = tracht(nr + 1, pl.saat, K.jahr);
    const pd = pendel(A, Bp, K.t + nr * 2.3, 0.9, 3.0);
    const vx = Math.cos(pd.h), vy = Math.sin(pd.h);
    const traegt = pd.hin;
    const leute = [];
    const lang = art === "bohlen" ? 3.0 : 4.2, abst = lang * 0.36;
    for (let i = 0; i < 2; i++) {
      const a = i ? a2 : a1, off = i ? -abst : abst;
      const x = pd.x + vx * off, y = pd.y + vy * off;
      const beine = pd.geht ? gehBeine(a, pd.ph + i * 0.08, 0.9) : STAND();
      const sch = masseA(a).schulter + 0.03;
      const P = {
        bein: beine, neig: 0.06, dreh: 0, kopfNick: 0.1, kopfDreh: traegt ? -0.15 : 0,
        arm: traegt ? [{ a: -0.3 * Math.sin(pd.ph * TAU), e: 0.25 }, { ziel: [0.18, 0.06, sch + 0.06], pol: [0.9, -0.3, -0.4] }] : [{ a: -0.3 * Math.sin(pd.ph * TAU), e: 0.25 }, { a: 0.3 * Math.sin(pd.ph * TAU), e: 0.25 }]
      };
      const sk = skelettA(a, P);
      const B = buehneA(K, x, y, 0, pd.h);
      arbeiterKoerper(B, a, sk);
      leute.push({ B: B, x: x, y: y });
    }
    const Sb = new Schicht(K);
    if (traegt) {
      /* der Balken liegt auf den rechten Schultern */
      const rx = Math.sin(pd.h), ry = -Math.cos(pd.h);
      const zB = masseA(a1).schulter + 0.1;
      const m = [pd.x + rx * 0.2, pd.y + ry * 0.2, zB];
      const D = [vx, vy, 0], Wq = [rx, ry, 0];
      if (art === "bohlen") for (let k = 0; k < 3; k++) quaderR(Sb, add(m, [0, 0, k * 0.05]), D, Wq, [0, 0, 1], lang / 2, 0.12, 0.024, mix3(F.bohle, F.bohleAlt, k * 0.3));
      else quaderR(Sb, m, D, Wq, [0, 0, 1], lang / 2, 0.08, 0.1, F.holz, { farben: { "A+": F.hirn, "A-": F.hirn } });
    }
    const xs = [pd.x - vx * (lang / 2 + 0.4), pd.x + vx * (lang / 2 + 0.4)], ys = [pd.y - vy * (lang / 2 + 0.4), pd.y + vy * (lang / 2 + 0.4)];
    return ({
      name: "tragen-" + nr, bb: [Math.min(...xs) - 0.45, Math.min(...ys) - 0.45, Math.max(...xs) + 0.45, Math.max(...ys) + 0.45], z1: 2.1, zSort: 0,
      malen: (g) => {
        /* hinterer Träger, Balken, vorderer Träger */
        const L2 = leute.slice().sort((p, q) => K.tiefe(p.x, p.y, 0) - K.tiefe(q.x, q.y, 0));
        for (const l of L2) fussSchatten(g, K, l.x, l.y, 0.01, 0.45, 0.8);
        L2[0].B.malen(g);
        Sb.malen(g);
        L2[1].B.malen(g);
      },
      schatten: (sg) => { for (const l of leute) l.B.schattenMalen(sg); Sb.schattenMalen(sg); }
    });
  }

  /* Töne: Hammerschläge und Bagger – selten, für alle Baustellen zusammen
     gezählt, und nur, wenn das klingende Teil gerade im Bild zu sehen ist
     (ausgelöst beim Malen, siehe zeichneListe) */
  const TON = { hammer: -1e9, bagger: -1e9 };
  const TON_ART = { hammer: { datei: "hammerschlag", laut: 0.25, pause: 2600 }, bagger: { datei: "bagger", laut: 0.2, pause: 12000 } };
  function darfTon() { return !STILL && typeof ST.ton === "function" && document.visibilityState !== "hidden"; }
  function tonFuer(art, saat) {
    const A = TON_ART[art];
    if (!A || !darfTon()) return;
    const jetzt = performance.now();
    if (jetzt - TON[art] < A.pause + (saat % 7) * 150) return;
    TON[art] = jetzt;
    ST.ton(A.datei, A.laut);
  }

  /* =====================================================================
     LAGER, BAUWAGEN, KLEINZEUG
     ===================================================================== */
  /* Holzstapel: Kanthölzer in Lagen mit Stapelhölzern dazwischen */
  function holzstapel(K, pl, x0, y0, x1, y1, lagen, name) {
    const S = new Schicht(K), winter = K.winter;
    const lang = x1 - x0 > y1 - y0, L = lang ? x1 - x0 : y1 - y0, B = lang ? y1 - y0 : x1 - x0;
    const n = Math.max(2, Math.floor(B / 0.2));
    const hirnM = K.s > 45 ? hirnholz : null;
    let z = 0;
    for (let k = 0; k < lagen; k++) {
      /* Stapelhölzer quer */
      for (const f of [0.12, 0.5, 0.88]) {
        const u = lerp(lang ? x0 : y0, lang ? x1 : y1, f);
        if (lang) kiste(S, u - 0.03, y0 - 0.02, z, u + 0.03, y1 + 0.02, z + 0.04, F.holzHell, { stapel: true });
        else kiste(S, x0 - 0.02, u - 0.03, z, x1 + 0.02, u + 0.03, z + 0.04, F.holzHell, { stapel: true });
      }
      z += 0.04;
      for (let i = 0; i < n; i++) {
        const q0 = lerp(lang ? y0 : x0, lang ? y1 : x1, i / n) + 0.008, q1 = lerp(lang ? y0 : x0, lang ? y1 : x1, (i + 1) / n) - 0.008;
        const alb = mix3(F.holz, F.holzHell, hash(pl.saat + k, i, 13) * 0.8);
        const oben = winter && k === lagen - 1 ? mix3(alb, F.schnee, 0.85) : null;
        const kurz = hash(pl.saat, k * 7 + i, 5) * 0.4;
        if (lang) kiste(S, x0 + kurz * 0.3, q0, z, x1 - kurz * 0.2, q1, z + 0.16, alb, { farben: { ost: F.hirn, west: F.hirn, oben: oben }, muster: hirnM ? { ost: hirnM, west: hirnM } : null });
        else kiste(S, q0, y0 + kurz * 0.3, z, q1, y1 - kurz * 0.2, z + 0.16, alb, { farben: { sued: F.hirn, nord: F.hirn, oben: oben }, muster: hirnM ? { sued: hirnM, nord: hirnM } : null });
      }
      z += 0.165;
    }
    return { name: name || "holz", bb: [x0 - 0.05, y0 - 0.05, x1 + 0.05, y1 + 0.05], z1: z, malen: (g) => S.malen(g), schatten: (sg) => S.schattenMalen(sg) };
  }
  /* Palette mit Ziegeln (oder Biberschwänzen), in Folie, Schnee obenauf */
  function ziegelPalette(K, x, y, art, name, hoehe) {
    const S = new Schicht(K), winter = K.winter, D = [1, 0, 0], Wd = [0, 1, 0], U = [0, 0, 1];
    palette(S, K, [x, y, 0], D, Wd, 1);
    const hoch = hoehe || 0.8, zi = art !== "dach";
    quaderR(S, [x, y, 0.145 + hoch / 2], D, Wd, U, 0.57, 0.38, hoch / 2, zi ? F.ziegel : [176, 84, 60], {
      muster: K.s > 14 ? { "A+": ziegelStapel(zi), "A-": ziegelStapel(zi), "B+": ziegelStapel(zi), "B-": ziegelStapel(zi) } : null,
      farben: winter ? { "C+": F.schnee } : null
    });
    return { name: name || "palette", bb: [x - 0.62, y - 0.42, x + 0.62, y + 0.42], z1: 0.15 + hoch, malen: (g) => S.malen(g), schatten: (sg) => S.schattenMalen(sg) };
  }
  /* Zementsäcke auf der Palette */
  function saeckePalette(K, x, y) {
    const S = new Schicht(K), D = [1, 0, 0], Wd = [0, 1, 0], U = [0, 0, 1];
    palette(S, K, [x, y, 0], D, Wd, 1);
    for (let k = 0; k < 4; k++) for (let i = 0; i < 2; i++) {
      const lg = k % 2 === 0;
      const cx = x + (lg ? 0 : (i - 0.5) * 0.55), cy = y + (lg ? (i - 0.5) * 0.4 : 0);
      quaderR(S, [cx, cy, 0.145 + 0.07 + k * 0.13], lg ? D : Wd, lg ? Wd : D, U, lg ? 0.52 : 0.36, lg ? 0.19 : 0.26, 0.065, [214, 204, 180], { farben: K.winter && k === 3 ? { "C+": F.schnee } : null, muster: K.s > 30 ? { "A+": sackMuster, "B+": sackMuster, "A-": sackMuster, "B-": sackMuster } : null });
    }
    return { name: "saecke", bb: [x - 0.62, y - 0.42, x + 0.62, y + 0.42], z1: 0.7, malen: (g) => S.malen(g), schatten: (sg) => S.schattenMalen(sg) };
  }
  function sackMuster(g, L, M) { g.fillStyle = L([60, 110, 170]); g.fillRect((M.w || 1) * 0.3, 0.02, (M.w || 1) * 0.4, 0.05); }
  /* Sandhaufen */
  function sandhaufen(K, pl, x, y, rx, ry, h, name) {
    const S = new Schicht(K);
    haufen(S, K, x, y, rx, ry, h, F.sand, pl.saat + 77, { schnee: K.winter ? 0.42 : 0, muster: K.s > 22 ? sandMuster : null });
    return { name: name || "sand", bb: [x - rx * 1.15, y - ry * 1.15, x + rx * 1.15, y + ry * 1.15], z1: h, malen: (g) => S.malen(g), schatten: (sg) => S.schattenMalen(sg) };
  }
  function sandMuster(g, L, M) {
    const r = ST.zufall(11), w = M.w || 1, h = M.h || 1;
    for (let i = 0; i < 40; i++) { g.fillStyle = L(r() < 0.5 ? [180, 150, 104] : [226, 200, 150], 0.6); g.fillRect(r() * w, r() * h, 0.02, 0.02); }
  }
  /* Sägeböcke mit Kantholz, Späne am Boden */
  function saegeplatz(K, pl, x, y0, y1) {
    const S = new Schicht(K), winter = K.winter;
    for (const y of [lerp(y0, y1, 0.18), lerp(y0, y1, 0.82)]) {
      for (const sd of [-1, 1]) {
        S.rohr([x + sd * 0.32, y - 0.25, 0], [x + sd * 0.06, y, 0.72], 0.03, [150, 110, 70]);
        S.rohr([x + sd * 0.32, y + 0.25, 0], [x + sd * 0.06, y, 0.72], 0.03, [150, 110, 70]);
      }
      kiste(S, x - 0.08, y - 0.4, 0.68, x + 0.08, y + 0.4, 0.76, [170, 126, 80]);
    }
    kiste(S, x - 0.08, y0, 0.76, x + 0.08, y1, 0.96, F.holzHell, { farben: { sued: F.hirn, nord: F.hirn, oben: winter ? mix3(F.holzHell, F.schnee, 0.4) : null } });
    /* Späne und Abschnitte */
    S.eigen((g) => {
      const r = ST.zufall(pl.saat + 3);
      for (let i = 0; i < 26; i++) {
        const p = K.p(x + (r() - 0.3) * 1.0, lerp(y0, y1, 0.75) + (r() - 0.5) * 0.9, 0.01);
        g.fillStyle = "rgba(232,206,150,0.8)"; g.beginPath(); g.ellipse(p[0], p[1], Math.max(0.6, 0.05 * K.s), Math.max(0.4, 0.025 * K.s), 0, 0, TAU); g.fill();
      }
    });
    kiste(S, x + 0.5, lerp(y0, y1, 0.9) - 0.1, 0, x + 0.66, lerp(y0, y1, 0.9) + 0.2, 0.16, F.holzHell, { farben: { oben: F.hirn } });
    return { name: "saegeplatz", bb: [x - 0.5, y0 - 0.1, x + 0.75, y1 + 0.1], z1: 1, malen: (g) => S.malen(g), schatten: (sg) => S.schattenMalen(sg) };
  }
  /* Mörtelkübel (schwarz) mit Kelle */
  function moertelkuebel(K, x, y) {
    const S = new Schicht(K);
    walze(S, [x, y, 0], [x, y, 0.32], [[0, 0.3], [1, 0.38]], [34, 34, 36], { deckel: [150, 146, 138], deckelMalen: (g, K2, C, e1, e2, r) => { g.fillStyle = K2.farbe([156, 150, 140], [0, 0, 1], C); kreisPfad(g, K2, add(C, [0, 0, -0.02]), e1, e2, r * 0.9); g.fill(); } });
    return { name: "kuebel", bb: [x - 0.4, y - 0.4, x + 0.4, y + 0.4], z1: 0.4, malen: (g) => S.malen(g), schatten: (sg) => S.schattenMalen(sg) };
  }
  /* Baustromverteiler: der orange Kasten auf Füßen */
  function stromkasten(K, x, y, h) {
    const S = new Schicht(K), D = [Math.cos(h), Math.sin(h), 0], Wd = [-Math.sin(h), Math.cos(h), 0], U = [0, 0, 1];
    for (const sd of [-1, 1]) S.rohr([x + Wd[0] * sd * 0.2, y + Wd[1] * sd * 0.2, 0], [x + Wd[0] * sd * 0.2, y + Wd[1] * sd * 0.2, 0.5], 0.025, [80, 84, 90]);
    quaderR(S, [x, y, 0.95], D, Wd, U, 0.18, 0.3, 0.45, [228, 110, 30], { muster: { "A+": function (g, L, M) { g.fillStyle = L([60, 60, 66]); g.fillRect(0.08, 0.1, 0.44, 0.3); g.fillStyle = L([40, 40, 44]); for (let i = 0; i < 4; i++) { g.beginPath(); g.arc(0.14 + i * 0.1, 0.62, 0.035, 0, TAU); g.fill(); } } }, farben: K.winter ? { "C+": F.schnee } : null });
    return { name: "strom", bb: [x - 0.35, y - 0.35, x + 0.35, y + 0.35], z1: 1.4, malen: (g) => S.malen(g), schatten: (sg) => S.schattenMalen(sg) };
  }
  /* Mobiltoilette: blaue Kabine */
  function toilette(K, x, y, h) {
    const S = new Schicht(K), D = [Math.cos(h), Math.sin(h), 0], Wd = [-Math.sin(h), Math.cos(h), 0], U = [0, 0, 1];
    quaderR(S, [x, y, 1.15], D, Wd, U, 0.58, 0.58, 1.15, [40, 96, 170], {
      muster: { "A+": function (g, L, M) { g.strokeStyle = L([24, 60, 120]); g.lineWidth = 0.02; g.strokeRect(0.12, 0.2, 0.92, 2.0); g.fillStyle = L([220, 40, 40]); g.fillRect(0.82, 1.05, 0.1, 0.05); for (let i = 0; i < 4; i++) { g.fillStyle = L([30, 70, 130]); g.fillRect(0.3 + i * 0.16, 0.08, 0.08, 0.08); } } },
      farben: { "C+": K.winter ? F.schnee : [236, 236, 236] }
    });
    return { name: "toilette", bb: [x - 0.62, y - 0.62, x + 0.62, y + 0.62], z1: 2.4, malen: (g) => S.malen(g), schatten: (sg) => S.schattenMalen(sg) };
  }
  /* Der Bauwagen: grüner Holzwagen auf vier Rädern, Ofenrohr (raucht im
     Winter), Fenster abends warm erleuchtet, Stufe vor der Tür */
  function bauwagen(K, pl, x, y, h) {
    const S = new Schicht(K), D = [Math.cos(h), Math.sin(h), 0], Wd = [-Math.sin(h), Math.cos(h), 0], U = [0, 0, 1];
    const Q = (l, w, z) => [x + D[0] * l + Wd[0] * w, y + D[1] * l + Wd[1] * w, z];
    const gruen = [58, 104, 72], winter = K.winter, nacht = K.nacht;
    const teile = [];
    const teil = (l, w, z) => { const S2 = new Schicht(K); const p = Q(l, w, z); teile.push({ S: S2, t: K.tiefe(p[0], p[1], p[2]) }); return S2; };
    for (const l of [-1.5, 1.5]) for (const sd of [-1, 1]) { const Sr = teil(l, sd * 1.0, 0.35); rad(Sr, Q(l, sd * 0.85, 0.36), Q(l, sd * 1.05, 0.36), 0.36, [170, 40, 34]); }
    const Sk = teil(0, 0, 1.6);
    const wandM = function (tuer) {
      return function (g, L, M) {
        const w = M.w, hh = M.h;
        g.strokeStyle = L(mul(gruen, 0.7)); g.lineWidth = Math.max(0.006, 0.8 / M.px);
        for (let yy = 0.12; yy < hh; yy += 0.12) { g.beginPath(); g.moveTo(0, yy); g.lineTo(w, yy); g.stroke(); }
        const fenster = (fx) => {
          g.fillStyle = L([236, 232, 220]); g.fillRect(fx - 0.04, 0.36, 0.78, 0.62);
          g.fillStyle = nacht > 0.3 ? "rgba(255,214,140," + (0.5 + 0.5 * nacht).toFixed(3) + ")" : L([60, 76, 92]);
          g.fillRect(fx, 0.4, 0.7, 0.54);
          g.fillStyle = L([236, 232, 220]); g.fillRect(fx + 0.33, 0.4, 0.04, 0.54);
          if (nacht < 0.3) { g.fillStyle = "rgba(210,226,244,0.25)"; g.fillRect(fx, 0.4, 0.3, 0.25); }
        };
        if (tuer) {
          fenster(0.5);
          g.fillStyle = L([46, 80, 58]); g.fillRect(w - 1.45, 0.25, 0.85, hh - 0.25);
          g.fillStyle = L([200, 190, 160]); g.beginPath(); g.arc(w - 0.72, hh * 0.58, 0.035, 0, TAU); g.fill();
          if (M.px > 30) { g.fillStyle = L([240, 240, 236]); g.fillRect(1.6, 0.5, 0.9, 0.34); g.fillStyle = L([30, 70, 130]); g.font = "bold 0.12px 'DejaVu Sans', sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("BAULEITUNG", 2.05, 0.67); }
        } else { fenster(0.6); fenster(w - 1.35); }
      };
    };
    quaderR(Sk, Q(0, 0, 1.62), D, Wd, U, 2.3, 1.1, 0.95, gruen, { muster: { "B+": wandM(true), "B-": wandM(false), "A+": wandM(false) }, farben: { "C+": winter ? F.schnee : [70, 72, 76] } });
    /* gewölbtes Dach: zwei schräge Flächen mit Überstand */
    const dachF = (sd) => {
      const pts = [Q(-2.45, 0, 2.78), Q(2.45, 0, 2.78), Q(2.45, sd * 1.25, 2.52), Q(-2.45, sd * 1.25, 2.52)];
      Sk.flaeche(pts, nrm([Wd[0] * sd * 0.26, Wd[1] * sd * 0.26, 1.25]), [74, 78, 84], { beidseitig: true, muster: dachpappe(winter), lok: { o: pts[0], u: D, v: nrm(sub(pts[3], pts[0])) } });
      /* Stirnbrett am Dachrand */
      Sk.flaeche([Q(-2.45, sd * 1.25, 2.52), Q(2.45, sd * 1.25, 2.52), Q(2.45, sd * 1.25, 2.4), Q(-2.45, sd * 1.25, 2.4)], mul(Wd, sd), [40, 70, 50], { schatten: false });
    };
    dachF(1); dachF(-1);
    /* Ofenrohr mit Hut */
    const rohrP = Q(1.6, -0.5, 2.7);
    Sk.rohr(rohrP, add(rohrP, [0, 0, 0.7]), 0.07, [60, 60, 64]);
    Sk.flaeche([add(rohrP, [-0.14, -0.14, 0.78]), add(rohrP, [0.14, -0.14, 0.78]), add(rohrP, [0.14, 0.14, 0.78]), add(rohrP, [-0.14, 0.14, 0.78])], [0, 0, 1], [50, 50, 54], { schatten: false });
    /* Stufe vor der Tür */
    const St = teil(1.3, 1.5, 0.2);
    kiste(St, Q(1.3, 1.25, 0)[0] - 0.35, Q(1.3, 1.25, 0)[1] - 0.3, 0, Q(1.3, 1.25, 0)[0] + 0.35, Q(1.3, 1.25, 0)[1] + 0.3, 0.3, [150, 146, 138], { farben: winter ? { oben: F.schnee } : null });
    teile.sort((a, b) => a.t - b.t);
    const alle = teile.map((t) => t.S);
    const ecken = [Q(-2.5, -1.3, 0), Q(2.5, 1.9, 0), Q(-2.5, 1.9, 0), Q(2.5, -1.3, 0)];
    const bb = [Math.min(...ecken.map((p) => p[0])), Math.min(...ecken.map((p) => p[1])), Math.max(...ecken.map((p) => p[0])), Math.max(...ecken.map((p) => p[1]))];
    return {
      name: "bauwagen", bb: bb, z1: 3.5, malen: (g) => { for (const S2 of alle) S2.malen(g); }, schatten: (sg) => { for (const S2 of alle) S2.schattenMalen(sg); },
      glanz: (g) => { if (nacht > 0.3) { const p = Q(0, 1.2, 1.3); glanzPunkt(g, K, p, 2.4, "255,196,120", 0.5 * nacht); } }
    };
  }
  /* Dachpappe mit Leisten; im Winter Schnee, der an den Leisten dünner ist */
  function dachpappe(winter) {
    return function (g, L, M) {
      const w = M.w || 4.9, h = M.h || 1.28;
      g.fillStyle = L([60, 62, 66], 0.9);
      for (let x = 0.4; x < w; x += 0.8) g.fillRect(x, 0, 0.05, h);
      if (winter) {
        g.fillStyle = L(F.schnee, 0.96);
        g.beginPath(); g.moveTo(0.05, 0.02);
        for (let x = 0; x <= w; x += 0.35) g.lineTo(x, 0.01 + Math.sin(x * 5.3) * 0.02);
        g.lineTo(w - 0.05, h - 0.12);
        for (let x = w; x >= 0; x -= 0.35) g.lineTo(x, h - 0.1 - Math.abs(Math.sin(x * 3.1)) * 0.1);
        g.closePath(); g.fill();
      }
    };
  }
  /* Rauch aus dem Ofenrohr: weiche Wölkchen, steigen und verwehen */
  function rauchFahne(g, K, p, saat) {
    const t = K.t, s = K.s;
    if (s < 5) return;
    for (let i = 0; i < 5; i++) {
      const ph = (t * 0.22 + i / 5 + (saat % 5) * 0.1) % 1;
      const P = K.p(p[0] + ph * ph * 2.2, p[1] - ph * 0.6, p[2] + ph * 3.2);
      const r = (0.18 + ph * 0.9) * s, a = (1 - ph) * Math.min(1, ph / 0.12) * 0.3;
      const hell = K.nacht > 0.5 ? "150,156,176" : "226,228,234";
      const gr = g.createRadialGradient(P[0], P[1], 0, P[0], P[1], r);
      gr.addColorStop(0, "rgba(" + hell + "," + a.toFixed(3) + ")"); gr.addColorStop(1, "rgba(" + hell + ",0)");
      g.fillStyle = gr; g.beginPath(); g.arc(P[0], P[1], r, 0, TAU); g.fill();
    }
  }

  /* =====================================================================
     LICHT: Baustrahler auf Stativ, gelbe Warnleuchten
     ===================================================================== */
  function strahler(K, x, y, zielX, zielY, name) {
    const S = new Schicht(K), hoch = 3.3;
    const d = nrm([zielX - x, zielY - y, 0]);
    for (let i = 0; i < 3; i++) { const w = i / 3 * TAU; S.rohr([x + Math.cos(w) * 0.55, y + Math.sin(w) * 0.55, 0], [x, y, 1.3], 0.02, [60, 62, 66]); }
    S.rohr([x, y, 1.3], [x, y, hoch], 0.025, [80, 84, 90]);
    S.schnitt();
    const kopf = [x + d[0] * 0.1, y + d[1] * 0.1, hoch + 0.12];
    const blick = nrm([d[0], d[1], -0.45]), quer = nrm(kreuz(blick, [0, 0, 1])), hoch2 = kreuz(quer, blick);
    quaderR(S, kopf, blick, quer, hoch2, 0.09, 0.2, 0.16, [236, 180, 30], { leucht: K.nacht > 0.3 ? { "A+": true } : null, farben: { "A+": K.nacht > 0.3 ? [255, 250, 236] : [180, 196, 210] } });
    const lampe = add(kopf, mul(blick, 0.1));
    return {
      name: name || "strahler", bb: [x - 0.6, y - 0.6, x + 0.6, y + 0.6], z1: hoch + 0.3, malen: (g) => S.malen(g), schatten: (sg) => S.schattenMalen(sg),
      lampe: { p: lampe, r: 16, farbe: [1.0, 0.97, 0.9], k: 1.1, blick: blick },
      glanz: (g) => {
        const k = K.nacht;
        if (k < 0.05) return;
        glanzPunkt(g, K, lampe, 1.4, "255,248,230", 0.9 * k);
        /* Lichtkegel: zarter Schleier Richtung Haus */
        const A = K.p(lampe[0], lampe[1], lampe[2]), ziel = add(lampe, mul(blick, 9)), Z = K.p(ziel[0], ziel[1], Math.max(0, ziel[2]));
        const q = mul(quer, 3.2), Z1 = K.p(ziel[0] + q[0], ziel[1] + q[1], Math.max(0, ziel[2])), Z2 = K.p(ziel[0] - q[0], ziel[1] - q[1], Math.max(0, ziel[2]));
        const gr = g.createLinearGradient(A[0], A[1], Z[0], Z[1]);
        gr.addColorStop(0, "rgba(255,244,220," + (0.16 * k).toFixed(3) + ")"); gr.addColorStop(1, "rgba(255,244,220,0)");
        g.fillStyle = gr; g.beginPath(); g.moveTo(A[0], A[1]); g.lineTo(Z1[0], Z1[1]); g.lineTo(Z2[0], Z2[1]); g.closePath(); g.fill();
        /* Lichtpfütze am Boden */
        const B0 = add(lampe, mul([blick[0], blick[1], 0], 4.5)), P = K.p(B0[0], B0[1], 0), r = 5 * K.s;
        g.save(); g.translate(P[0], P[1]); g.scale(1, 0.5);
        const g2 = g.createRadialGradient(0, 0, 0, 0, 0, r);
        g2.addColorStop(0, "rgba(255,240,210," + (0.2 * k).toFixed(3) + ")"); g2.addColorStop(1, "rgba(255,240,210,0)");
        g.fillStyle = g2; g.fillRect(-r, -r, 2 * r, 2 * r); g.restore();
      }
    };
  }
  /* Warnleuchte (gelb, blinkt) oben auf einer Bake oder am Zaun */
  function warnleuchte(K, p, versatz) {
    const S = new Schicht(K);
    const an = K.nacht > 0.1 && ((K.t + versatz) % 1.2) < 0.55;
    S.eigen((g) => {
      const P = K.p(p[0], p[1], p[2]), r = Math.max(1.2, 0.09 * K.s);
      g.fillStyle = "rgb(40,40,40)"; g.fillRect(P[0] - r * 0.8, P[1], r * 1.6, r * 0.9);
      g.fillStyle = an ? "rgb(255,210,60)" : K.farbe([220, 150, 20], [0.3, 0.3, 0.9], p);
      g.beginPath(); g.arc(P[0], P[1] - r * 0.2, r, Math.PI, 0); g.lineTo(P[0] + r, P[1]); g.lineTo(P[0] - r, P[1]); g.closePath(); g.fill();
    });
    return { name: "warn", bb: [p[0] - 0.1, p[1] - 0.1, p[0] + 0.1, p[1] + 0.1], z0: p[2] - 0.1, z1: p[2] + 0.2, zSort: p[2], malen: (g) => S.malen(g), glanz: (g) => { if (an) glanzPunkt(g, K, p, 1.2, "255,196,60", 0.9 * K.nacht); } };
  }

  /* =====================================================================
     WER WO ARBEITET (Platzierungsliste, Modellkoordinaten)
     ===================================================================== */
  function leutePlanen(K, pl, bau) {
    const W = pl.wand, Zn = pl.zaun, boden = [], geruest = {};
    if (!GS) return { boden: boden, geruest: geruest };
    const nachts = K.nacht > 0.8;
    const mitte = [(W.x0 + W.x1) / 2, (W.y0 + W.y1) / 2];
    const zu = (x, y) => Math.atan2(mitte[1] - y, mitte[0] - x);
    const gr = { x0: W.x0 - 0.35, x1: W.x1 + 0.35, y0: W.y0 - 0.35, y1: W.y1 + 0.35 };
    if (!pl.gross) return { boden: boden, geruest: geruest };
    if (bau < 0.12) {
      /* Aushub: Polier mit Plan, Vermesser mit Messlatte */
      const px = W.x0 - 1.1, py = W.y1 + 1.35;
      arbeiterPosten(K, pl, 0, px, py, 0, zu(px, py), "plan", {}, boden);
      if (!nachts) arbeiterPosten(K, pl, 1, gr.x1 + 0.5, lerp(W.y0, W.y1, 0.35), 0, Math.PI, "messen", {}, boden);
    } else if (bau < 0.22) {
      /* Betonieren: einer führt die Schurre, einer rüttelt, der Polier schaut zu */
      const MP = pl.mischer;
      if (MP && bau >= 0.13 && bau < 0.2) {
        const G = pl.bagger ? pl.bagger.grube : gr, im = pl.bagger && pl.bagger.graben;
        arbeiterPosten(K, pl, 2, G.x0 - 0.55, MP.y - 1.25, 0, 0.25, "schurre", {}, boden);
        arbeiterPosten(K, pl, 3, G.x0 - 0.5, MP.y + (im ? 0.75 : 2.4), 0, 0, "ruetteln", {}, boden);
      }
      const px = W.x0 - 1.1, py = W.y1 + 1.35;
      arbeiterPosten(K, pl, 0, px, py, 0, zu(px, py), "plan", {}, boden);
    } else {
      const GP = pl.geruest;
      /* auf dem Gerüst: je nach Phase hämmern, Fassade streichen, abbauen */
      if (GP) {
        const auf = (seite, jRel, nr, tun, o) => {
          const E = GP.einheiten.find((e) => e.art === "seite" && e.i === seite);
          if (!E) return;
          const j = klemm(Math.round(jRel * (E.nb - 1)), 0, E.nb - 1), fe = E.felder[j];
          let k = 0;
          for (let kk = 1; kk <= fe.lv; kk++) if (geruestQ(pl, GP, fe.idx, kk, bau) >= 0.45) k = kk;
          if (!k) return;
          const T = [E.T[0], E.T[1], 0], N = [E.N[0], E.N[1], 0];
          const u = (j + (fe.leiter ? 0.75 : 0.45)) * E.L / E.nb;
          const p = add(add([E.sd.A[0], E.sd.A[1], 0], mul(T, u)), mul(N, 0.4));
          const z = GP.zL[k] + 0.045;
          const it = arbeiterPosten(K, pl, nr, p[0], p[1], z, Math.atan2(-N[1], -N[0]), tun, Object.assign({ weit: 0.6 }, o || {}), null);
          if (!it) return;
          (geruest[seite] = geruest[seite] || []).push({ lage: k, malen: it.malen, ton: it.ton });
        };
        const giebelSeite = pl.firstX ? 1 : 2;
        if (bau < 0.9) {
          auf(2, 0.3, 4, "haemmern", { hoehe: 1.15, versatz: 0.3 });
          auf(bau >= 0.72 ? giebelSeite : 1, 0.55, 5, "haemmern", { hoehe: bau >= 0.72 ? 1.45 : 1.1, versatz: 0 });
          if (!nachts) auf(3, 0.6, 6, "haemmern", { hoehe: 0.95, versatz: 0.5 });
        } else if (bau < 0.95) {
          auf(2, 0.35, 4, "rollen", { farbe: [240, 234, 220] });
          auf(1, 0.6, 5, "rollen", { farbe: [240, 234, 220], versatz: 0.6 });
        } else {
          auf(2, 0.4, 4, "reichen", {});
        }
      }
      if (bau < 0.95) {
        /* Sägeplatz im Osten */
        const sx = Math.min(Zn.x1 - 0.9, W.x1 + 2.6), sy0 = lerp(W.y0, W.y1, 0.1);
        arbeiterPosten(K, pl, 7, sx - 0.52, sy0 + 2.95, 0, 0, "saegen", {}, boden);
        /* Schubkarre an der Südseite */
        if (!nachts) karrePosten(K, pl, 8, [W.x1 + 0.6, W.y1 + 1.95], [W.x0 + 0.8, W.y1 + 1.95], bau < 0.72 ? "sand" : "beton", boden);
        /* zwei tragen Balken vom Lager an der Ostseite entlang */
        if (!nachts && bau < 0.9) tragenPosten(K, pl, 9, [W.x1 + 1.75, W.y0 - 1.3], [W.x1 + 1.75, W.y1 - 0.4], boden, "balken");
        /* Anschläger am Kranlager */
        if (pl.kran && pl._kranZ) {
          const d = pl.kran.depot;
          arbeiterPosten(K, pl, 11, d[0] + 1.15, d[1] + 0.9, 0, Math.atan2(-0.9, -1.15), "einweisen", { aktiv: pl._kranZ.anschlagen }, boden);
        }
      } else {
        /* Abbau: Bohlen zum Laster tragen (bis der Zaun fällt, nachts nicht) */
        if (!nachts && bau < 0.985) tragenPosten(K, pl, 9, [W.x1 - 0.5, W.y1 + 1.9], [W.x0 - 0.2, W.y1 + 1.9], boden, "bohlen");
      }
    }
    return { boden: boden, geruest: geruest };
  }

  /* Lager und Ausstattung je Phase */
  function lagerTeile(K, pl, bau, teile, art) {
    const W = pl.wand, Zn = pl.zaun;
    if (!pl.gross) return;
    const bwX = Math.max(Zn.x0 + 1.3, W.x0 - G_ABST - G_BREITE - 0.35 - 1.15), bwY = Math.max(Zn.y0 + 2.8, W.y0 - 2.9);
    if (art === "lebend") {
      /* Rauch aus dem Ofenrohr des Bauwagens */
      if (bau < 0.992 && (K.winter || K.nacht > 0.3)) {
        const S = new Schicht(K), rohr = [bwX + 0.5, bwY - 1.6, 3.55];
        S.eigen((g) => rauchFahne(g, K, rohr, pl.saat));
        teile.push({ name: "rauch", lage: "vorne", bb: [rohr[0] - 0.3, rohr[1] - 0.3, rohr[0] + 0.3, rohr[1] + 0.3], z0: 3.5, z1: 7, zSort: 6, malen: (g) => S.malen(g) });
      }
      return;
    }
    const ab = bau >= 0.975;
    /* Bauwagen, Toilette, Stromkasten stehen von Anfang an */
    const nimm = teile;
    if (bau < 0.992) {
      nimm("bauwagen", "", () => bauwagen(K, pl, bwX, bwY, -Math.PI / 2));
      nimm("toilette", "", () => toilette(K, Math.max(Zn.x0 + 0.9, W.x0 - 2.9), Math.min(Zn.y1 - 0.9, W.y1 + 2.3), 0));
      nimm("strom", "", () => stromkasten(K, Math.max(Zn.x0 + 0.7, W.x0 - 2.0), W.y1 + 0.5, 0));
    }
    if (bau >= 0.22 && !ab) {
      /* Nordlager am Kran */
      const yL = W.y0 - G_ABST - G_BREITE - 0.6;
      const kx = pl.kran ? pl.kran.x + 2.4 : W.x0 + 1;
      nimm("holz-nord", "", () => holzstapel(K, pl, kx, yL - 0.85, Math.min(kx + 4.2, W.x1 - 0.2), yL, 3, "holz-nord"));
      if (pl.kran) {
        const d = pl.kran.depot;
        nimm("ziegel-1", "", () => ziegelPalette(K, d[0] + 2.0, d[1] - 0.2, "ziegel", "ziegel-1"));
        nimm("ziegel-2", bau < 0.72 ? "z" : "d", () => ziegelPalette(K, d[0] + 2.0, d[1] + 0.85, bau < 0.72 ? "ziegel" : "dach", "ziegel-2", 0.6));
      }
      /* Sägeplatz, Sand, Mörtel, Säcke */
      const sx = Math.min(Zn.x1 - 0.9, W.x1 + 2.6);
      nimm("saegeplatz", "", () => saegeplatz(K, pl, sx, lerp(W.y0, W.y1, 0.1), lerp(W.y0, W.y1, 0.1) + 3.2));
      nimm("sand", "", () => sandhaufen(K, pl, Math.min(Zn.x1 - 1.3, W.x1 + 2.5), Math.min(Zn.y1 - 1.0, W.y1 + 2.0), 1.05, 0.85, 0.95));
      nimm("kuebel", "", () => moertelkuebel(K, W.x0 + 0.2, W.y1 + 2.15));
      nimm("saecke", "", () => saeckePalette(K, W.x0 + 1.4, Math.min(Zn.y1 - 0.6, W.y1 + 2.45)));
    }
    /* Baustrahler an zwei Ecken */
    if (bau < 0.99) {
      nimm("strahler-so", "", () => strahler(K, Zn.x1 - 0.8, Zn.y1 - 0.8, (W.x0 + W.x1) / 2, (W.y0 + W.y1) / 2, "strahler-so"));
      nimm("strahler-nw", "", () => strahler(K, Zn.x0 + 0.8, Zn.y0 + 0.8, (W.x0 + W.x1) / 2, (W.y0 + W.y1) / 2, "strahler-nw"));
    }
  }

  /* =====================================================================
     KLEINE UND MITTLERE BAUSTELLEN
     mittel (Bude, Krippe, Brunnen, Pyramide …): Bauzaun, Freifallmischer
     mit Sandhaufen, Sägebock, Holzstapel, zwei bis drei Leute
     klein (Bank, Laterne, Zaun): rot-weiße Absperrschranken, ein Arbeiter,
     Werkzeugkiste, Warnleuchte
     ===================================================================== */
  /* Freifallmischer: orange Trommel schräg auf Gestell mit zwei Rädern */
  function freifallmischer(K, pl, x, y, h, laeuft) {
    const S = new Schicht(K), D = [Math.cos(h), Math.sin(h), 0], Wd = [-Math.sin(h), Math.cos(h), 0], U = [0, 0, 1];
    const Q = (l, w, z) => [x + D[0] * l + Wd[0] * w, y + D[1] * l + Wd[1] * w, z];
    const teile = [];
    const teil = (l, w, z) => { const S2 = new Schicht(K); const p = Q(l, w, z); teile.push({ S: S2, t: K.tiefe(p[0], p[1], p[2]) }); return S2; };
    for (const sd of [-1, 1]) { const Sr = teil(-0.2, sd * 0.55, 0.25); rad(Sr, Q(-0.2, sd * 0.5, 0.26), Q(-0.2, sd * 0.62, 0.26), 0.26, [200, 200, 204]); }
    const Sg = teil(0, 0, 0.5);
    balken(Sg, Q(-0.2, -0.5, 0.26), Q(-0.2, 0.5, 0.26), 0.05, 0.05, D, [60, 62, 66]);
    balken(Sg, Q(-0.2, 0, 0.3), Q(0.9, 0, 0.35), 0.06, 0.06, Wd, [228, 110, 30]);
    Sg.rohr(Q(0.9, 0, 0.35), Q(1.0, 0, 0.0), 0.03, [60, 62, 66]);
    for (const sd of [-1, 1]) balken(Sg, Q(-0.2, sd * 0.42, 0.3), Q(0.0, sd * 0.42, 1.0), 0.06, 0.06, D, [228, 110, 30]);
    quaderR(Sg, Q(0.35, -0.25, 0.55), D, Wd, U, 0.16, 0.12, 0.14, [70, 74, 80]);
    const St = teil(0.1, 0, 1.0);
    const dreh = K.t * (laeuft ? 2.4 : 0);
    walze(St, Q(-0.25, 0, 0.72), Q(0.45, 0, 1.4), [[0, 0.22], [0.25, 0.42], [0.65, 0.42], [1, 0.22]], [232, 112, 30], { streifen: { n: 2, windungen: 0.6, breite: 0.05, farbe: [60, 60, 60], phase: dreh }, deckel: [60, 60, 60] });
    teile.sort((a, b) => a.t - b.t);
    const P1 = Q(-0.7, -0.8, 0), P2 = Q(1.1, 0.8, 0);
    return { name: "freifall", bb: [Math.min(P1[0], P2[0]), Math.min(P1[1], P2[1]), Math.max(P1[0], P2[0]), Math.max(P1[1], P2[1])], z1: 1.7, malen: (g) => { for (const t of teile) t.S.malen(g); }, schatten: (sg) => { for (const t of teile) t.S.schattenMalen(sg); } };
  }
  /* Absperrschranke: rot-weiße Latte auf zwei Fußplatten */
  function schranke(K, A, B) {
    const S = new Schicht(K);
    const T = nrm(sub(B, A)), N = kreuz([0, 0, 1], T), L = len(sub(B, A));
    for (const P of [A, B]) {
      kiste(S, P[0] - 0.22, P[1] - 0.22, 0, P[0] + 0.22, P[1] + 0.22, 0.06, [40, 40, 42], { farben: K.winter ? { oben: [200, 204, 212] } : null });
      S.rohr([P[0], P[1], 0.06], [P[0], P[1], 1.05], 0.022, [230, 230, 226]);
    }
    for (const z of [1.0, 0.55]) {
      const o = add(A, [0, 0, z]), pts = [o, add(o, mul(T, L)), add(add(o, mul(T, L)), [0, 0, -0.15]), add(o, [0, 0, -0.15])];
      S.flaeche(pts, N, F.weiss, { beidseitig: true, muster: bordMuster(false), lok: { o: o, u: T, v: [0, 0, -1] } });
    }
    return { name: "schranke", bb: [Math.min(A[0], B[0]) - 0.25, Math.min(A[1], B[1]) - 0.25, Math.max(A[0], B[0]) + 0.25, Math.max(A[1], B[1]) + 0.25], z1: 1.1, malen: (g) => S.malen(g), schatten: (sg) => S.schattenMalen(sg) };
  }
  /* Werkzeugkiste */
  function werkzeugkiste(K, x, y, h) {
    const S = new Schicht(K), D = [Math.cos(h), Math.sin(h), 0], Wd = [-Math.sin(h), Math.cos(h), 0];
    quaderR(S, [x, y, 0.13], D, Wd, [0, 0, 1], 0.3, 0.15, 0.13, [196, 40, 34], { farben: K.winter ? { "C+": [214, 216, 222] } : null });
    S.rohr([x - D[0] * 0.15, y - D[1] * 0.15, 0.3], [x + D[0] * 0.15, y + D[1] * 0.15, 0.3], 0.015, [40, 40, 42]);
    return { name: "werkzeug", bb: [x - 0.32, y - 0.32, x + 0.32, y + 0.32], z1: 0.35, malen: (g) => S.malen(g), schatten: (sg) => S.schattenMalen(sg) };
  }
  function kleinTeile(K, pl, bau, teile, art) {
    if (pl.gross) return;
    const W = pl.wand, Zn = pl.zaun, mitte = [(W.x0 + W.x1) / 2, (W.y0 + W.y1) / 2];
    const zu = (x, y) => Math.atan2(mitte[1] - y, mitte[0] - x);
    if (pl.art === "klein") {
      const m = 0.8, x0 = W.x0 - m, x1 = W.x1 + m, y0 = W.y0 - m, y1 = W.y1 + m;
      if (art === "fest") {
        if (bau < 0.97) {
          teile("schranke-n", "", () => schranke(K, [x0, y0, 0], [x1, y0, 0]));
          teile("schranke-o", "", () => schranke(K, [x1, y0 + 0.4, 0], [x1, y1, 0]));
          teile("schranke-s", "", () => schranke(K, [x1 - 0.4, y1, 0], [x0 + 0.9, y1, 0]));
          teile("werkzeug", "", () => werkzeugkiste(K, x0 + 0.1, y1 + 0.5, 0.3));
        }
      } else {
        if (bau < 0.97) teile.push(warnleuchte(K, [x0, y0, 1.12], 0));
        if (bau < 0.95) arbeiterPosten(K, pl, 4, x0 + 0.1, (y0 + y1) / 2, 0, 0, "haemmern", { hoehe: 0.6, weit: 0.55, versatz: 0.2 }, teile);
      }
      return;
    }
    /* mittel */
    if (art === "fest") {
      const mx = Math.max(Zn.x0 + 0.9, W.x0 - 1.4);
      if (bau >= 0.05 && bau < 0.4) {
        teile("freifall", bau < 0.3 ? "l" : "s", () => freifallmischer(K, pl, mx, W.y1 - 0.4, Math.PI / 2 + 0.3, bau < 0.3));
        teile("sand", "", () => sandhaufen(K, pl, mx, W.y0 + 0.6, 0.85, 0.7, 0.75));
        teile("saecke", "", () => saeckePalette(K, Math.min(Zn.x1 - 0.7, W.x1 + 1.2), Zn.y0 + 0.6));
      }
      if (bau < 0.95) {
        teile("holz", "", () => holzstapel(K, pl, W.x0 + 0.2, Math.min(Zn.y1 - 0.3, W.y1 + 1.4), W.x0 + 2.6, Math.min(Zn.y1 - 0.3, W.y1 + 1.4) + 0.65, 2));
        teile("saegeplatz", "", () => saegeplatz(K, pl, Math.min(Zn.x1 - 0.7, W.x1 + 1.3), W.y0 + 0.1, W.y0 + 2.4));
      }
      if (bau < 0.99) teile("strahler-so", "", () => strahler(K, Zn.x1 - 0.6, Zn.y1 - 0.6, mitte[0], mitte[1], "strahler-so"));
    } else {
      if (!GS || bau >= 0.95) return;
      const mx = Math.max(Zn.x0 + 0.9, W.x0 - 1.4);
      if (bau >= 0.05 && bau < 0.3) arbeiterPosten(K, pl, 3, mx + 0.45, W.y0 + 1.5, 0, zu(mx, W.y0 + 1.5), "plan", {}, teile);
      arbeiterPosten(K, pl, 7, Math.min(Zn.x1 - 0.7, W.x1 + 1.3) - 0.52, W.y0 + 2.2, 0, 0, "saegen", {}, teile);
      arbeiterPosten(K, pl, 4, W.x1 + 0.6, W.y1 - 0.4, 0, Math.PI, "haemmern", { hoehe: Math.min(1.4, pl.H * 0.3), weit: 0.55 }, teile);
      if (K.nacht < 0.8) tragenPosten(K, pl, 9, [W.x0 + 0.3, W.y1 + 0.75], [W.x1 - 0.3, W.y1 + 0.75], teile, "bohlen");
    }
  }

  /* Boden der Baustelle: zertretener, schmutziger Schnee (Winter) oder
     Matsch und Kies (Frühling), Fahrspuren vom Tor her. Liegt unter allem. */
  function bodenFleck(K, pl) {
    const Zn = pl.zaun, S = new Schicht(K);
    const winter = K.winter;
    const farbe = winter ? "112,100,90" : "104,84,58";
    S.eigen((g) => {
      const ecken = (m) => [[Zn.x0 + m, Zn.y0 + m], [Zn.x1 - m, Zn.y0 + m], [Zn.x1 - m, Zn.y1 - m], [Zn.x0 + m, Zn.y1 - m]].map((p) => K.p(p[0], p[1], 0));
      /* weich auslaufender Rand: drei Ringe */
      for (const [m, a] of [[0.1, 0.07], [0.6, 0.07], [1.3, 0.08]]) {
        const E = ecken(m);
        g.fillStyle = "rgba(" + farbe + "," + a + ")";
        g.beginPath(); E.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.closePath(); g.fill();
      }
      /* Flecken und Pfützen */
      const r = ST.zufall(pl.saat + 900);
      const n = Math.round((Zn.x1 - Zn.x0) * (Zn.y1 - Zn.y0) / 6);
      for (let i = 0; i < n; i++) {
        const x = lerp(Zn.x0 + 1, Zn.x1 - 1, r()), y = lerp(Zn.y0 + 1, Zn.y1 - 1, r());
        const P = K.p(x, y, 0), rr = (0.6 + r() * 1.4) * K.s;
        g.fillStyle = winter ? "rgba(96,86,78," + (0.05 + r() * 0.07).toFixed(3) + ")" : (r() < 0.25 ? "rgba(90,110,130,0.16)" : "rgba(92,70,48,0.1)");
        g.beginPath(); g.ellipse(P[0], P[1], rr, rr * 0.5, 0, 0, TAU); g.fill();
      }
      /* Fahrspuren vom Tor zur Grube */
      if (pl.gross && pl.torY != null) {
        g.strokeStyle = "rgba(" + (winter ? "86,78,72" : "70,54,38") + ",0.22)";
        g.lineWidth = Math.max(1, 0.5 * K.s); g.lineCap = "round";
        for (const dy of [-0.95, 0.95]) {
          const A = K.p(Zn.x0 - 1.5, pl.torY + dy, 0), B = K.p(pl.wand.x0 - 0.6, pl.torY + dy * 0.9, 0);
          g.beginPath(); g.moveTo(A[0], A[1]); g.lineTo(B[0], B[1]); g.stroke();
        }
      }
    });
    return { name: "boden", boden: true, lage: "hinten", bb: [Zn.x0, Zn.y0, Zn.x1, Zn.y1], z1: 0.01, malen: (g) => S.malen(g) };
  }

  /* =====================================================================
     REIHENFOLGE: vor oder hinter dem Haus, und untereinander
     ===================================================================== */
  function bildGrenzen(K, it) {
    const [x0, y0, x1, y1] = it.bb, z1 = it.z1 || 1, z0 = it.z0 || 0;
    let a = Infinity, b = Infinity, c = -Infinity, d = -Infinity;
    for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) {
      const P = K.p(x, y, z);
      if (P[0] < a) a = P[0]; if (P[0] > c) c = P[0]; if (P[1] < b) b = P[1]; if (P[1] > d) d = P[1];
    }
    it.sb = [a, b, c, d];
  }
  /* liegt A (Grundriss) hinter B? +1 ja, -1 nein, 0 unbestimmt */
  function hinter(K, A, B) {
    const e = 0.001, ex = K.ex, ey = K.ey;
    if ((A.bb[2] <= B.bb[0] + e && ex > 0) || (A.bb[0] >= B.bb[2] - e && ex < 0) || (A.bb[3] <= B.bb[1] + e && ey > 0) || (A.bb[1] >= B.bb[3] - e && ey < 0)) return 1;
    if ((B.bb[2] <= A.bb[0] + e && ex > 0) || (B.bb[0] >= A.bb[2] - e && ex < 0) || (B.bb[3] <= A.bb[1] + e && ey > 0) || (B.bb[1] >= A.bb[3] - e && ey < 0)) return -1;
    return 0;
  }
  function sortieren(K, liste) {
    const n = liste.length;
    for (const it of liste) {
      it.nah = K.tiefe((it.bb[0] + it.bb[2]) / 2, (it.bb[1] + it.bb[3]) / 2, it.zSort != null ? it.zSort : 0) + (it.vorrang || 0);
      it.vor = []; it.grad = 0;
    }
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      const A = liste[i], B = liste[j];
      if (A.sb[2] < B.sb[0] || B.sb[2] < A.sb[0] || A.sb[3] < B.sb[1] || B.sb[3] < A.sb[1]) continue;
      let h = hinter(K, A, B);
      if (h === 0) h = A.nah < B.nah ? 1 : -1;
      if (h > 0) { A.vor.push(B); B.grad++; } else { B.vor.push(A); A.grad++; }
    }
    const bereit = liste.filter((e) => e.grad === 0).sort((a, b) => b.nah - a.nah);
    const aus = [];
    while (bereit.length) {
      const e = bereit.pop();
      aus.push(e);
      for (const v of e.vor) { v.grad--; if (v.grad === 0) { let k = bereit.length; while (k > 0 && bereit[k - 1].nah < v.nah) k--; bereit.splice(k, 0, v); } }
    }
    if (aus.length < n) aus.push(...liste.filter((e) => aus.indexOf(e) < 0).sort((a, b) => a.nah - b.nah));
    return aus;
  }
  /* Lage zum Haus: getrennt durch eine Hauswand, die zum Betrachter zeigt → vorn */
  function lageZumHaus(K, pl, it) {
    if (it.lage === "vorne" || it.lage === "hinten") return it.lage;
    const W = pl.wand, [x0, y0, x1, y1] = it.bb, e = 0.02;
    const vorn = (x0 >= W.x1 - e && K.ex > 0) || (x1 <= W.x0 + e && K.ex < 0) || (y0 >= W.y1 - e && K.ey > 0) || (y1 <= W.y0 + e && K.ey < 0);
    if (vorn) return "vorne";
    const hint = (x0 >= W.x1 - e) || (x1 <= W.x0 + e) || (y0 >= W.y1 - e) || (y1 <= W.y0 + e);
    return hint ? "hinten" : "vorne";
  }

  /* =====================================================================
     AUFBAU JE BILD
     ===================================================================== */
  /* Lampen der Baustelle (für das Licht auf Rohren, Maschinen, Leuten) */
  function lampenSetzen(K, pl, bau) {
    K.lampen = [];
    if (K.nacht < 0.05 || !pl.gross || bau >= 0.99) { K.lampenB = null; return; }
    const W = pl.wand, Zn = pl.zaun, m = [(W.x0 + W.x1) / 2, (W.y0 + W.y1) / 2];
    for (const [x, y] of [[Zn.x1 - 0.8, Zn.y1 - 0.8], [Zn.x0 + 0.8, Zn.y0 + 0.8]]) {
      const d = nrm([m[0] - x, m[1] - y, 0]);
      K.lampen.push({ p: [x + d[0] * 0.25, y + d[1] * 0.25, 3.4], r: 17, farbe: [1.0, 0.95, 0.86], k: 0.75 * K.nacht });
    }
    K.lampenB = K.lampen.map((L) => ({ p: K.nk(L.p), r: L.r, farbe: L.farbe, k: L.k }));
  }

  function szeneFuer(o, P, bau) {
    const jetzt = ST.jetzt || 0;
    if (o._bsKeine) return LEER;
    const O = P.proj(0, 0, 0);
    const c = o._bsSz;
    if (c && c.jetzt === jetzt && c.s === P.s && c.gier === P.gier && c.bau === bau) { c.ox = O[0]; c.oy = O[1]; return c; }
    const def = P.def || ST.MODELLE[o.typ];
    const pl = planFuer(o, def);
    if (pl.art === "keine") { o._bsKeine = true; return LEER; }
    const K = kamera(P, bau);
    lampenSetzen(K, pl, bau);
    /* Festes (Gerüst, Zaun, Lager, Kranmast) liegt im Speicher je Zoom,
       Drehung, Tages- und Jahreszeit; jedes Teil mit seinem Zustand. Beim
       Zoomen mit den Fingern wird das alte Bild gestreckt (wie die Häuser),
       neu gemalt erst, wenn der Zoom ruht. */
    if (o._bsLetzteS !== P.s) { o._bsLetzteS = P.s; o._bsSWechsel = jetzt; }
    const gk = (P.Z.name || "") + P.Z.nacht + "|" + P.gier + "|" + K.jahr;
    let C = o._bsCache, skal = 1;
    if (!C || C.gk !== gk || C.s !== P.s) {
      if (C && C.gk === gk && jetzt - o._bsSWechsel < 220 && !STILL && !(ST.szene && ST.szene.ohneBudget)) skal = P.s / C.s;
      else C = o._bsCache = { gk: gk, s: P.s, map: new Map(), px: 0 };
    }
    const KF = skal === 1 ? kamera(P, bau) : C.K;
    if (skal === 1) { lampenSetzen(KF, pl, bau); C.K = KF; }
    for (const e of C.map.values()) e.benutzt = false;
    const fest = [];
    const nimm = (name, zustand, bauen) => {
      const alt = C.map.get(name);
      if (alt && (alt.zustand === zustand || skal !== 1)) { alt.benutzt = true; fest.push(alt.it); return; }
      if (skal !== 1) return;
      const it = bauen();
      if (!it) return;
      it.fest = true; it.lageH = null;
      bildGrenzen(KF, it); it.sb0 = it.sb.slice();
      C.map.set(name, { zustand: zustand, it: it, benutzt: true });
      fest.push(it);
    };
    kranTeile(KF, pl, bau, nimm, "fest");
    if (pl.geruest && bau >= 0.22) {
      for (const E of pl.geruest.einheiten) nimm("g" + E.art + E.i, geruestZustand(pl, E, bau), () => E.art === "seite" ? geruestSeite(KF, pl, E, bau) : geruestEcke(KF, pl, E, bau));
    }
    baggerTeile(KF, pl, bau, nimm, "fest");
    lagerTeile(KF, pl, bau, nimm, "fest");
    zaunTeile(KF, pl, bau, nimm, "fest");
    kleinTeile(KF, pl, bau, nimm, "fest");
    if (pl.mit.zaun && bau < 0.99) nimm("boden", "", () => bodenFleck(KF, pl));
    /* nicht mehr Gebrauchtes (abgebaut) aus dem Speicher */
    for (const [k, e] of C.map) if (!e.benutzt) { C.map.delete(k); if (e.it._px) C.px -= e.it._px; }
    /* Lebendes: jedes Bild neu */
    const lebend = [];
    kranTeile(K, pl, bau, lebend, "lebend");
    const leute = leutePlanen(K, pl, bau);
    pl._geruestLeute = leute.geruest;
    baggerTeile(K, pl, bau, lebend, "lebend");
    mischerTeile(K, pl, bau, lebend);
    lagerTeile(K, pl, bau, lebend, "lebend");
    zaunTeile(K, pl, bau, lebend, "lebend");
    kleinTeile(K, pl, bau, lebend, "lebend");
    for (const it of leute.boden) lebend.push(it);
    const alle = fest.concat(lebend);
    const hinten = [], vorne = [];
    for (const it of alle) {
      bildGrenzen(K, it);
      if (!it.lageH || !it.fest) it.lageH = lageZumHaus(K, pl, it);
      (it.lageH === "vorne" ? vorne : hinten).push(it);
    }
    /* der Boden der Baustelle liegt unter allem */
    const hs = sortieren(K, hinten.filter((it) => !it.boden));
    const sz = { jetzt: jetzt, s: P.s, gier: P.gier, bau: bau, ox: O[0], oy: O[1], K: K, KF: KF, skal: skal, C: C, pl: pl, alle: alle, hinten: hinten.filter((it) => it.boden).concat(hs), vorne: sortieren(K, vorne) };
    o._bsSz = sz;
    return sz;
  }
  /* Bauzaun (fest) und Warnleuchten am Tor (blinken, also lebend) */
  function zaunTeile(K, pl, bau, teile, art) {
    const zaunAb = pl.mit.zaun ? zaunAnteil(bau) : 0;
    if (zaunAb <= 0) return;
    const felder = zaunFelder(pl);
    const n = felder.length;
    felder.forEach((fe, i) => {
      if ((i + 0.5) / n > zaunAb) return;
      if (art === "fest") teile("zaun" + i, "", () => zaunFeld(K, pl, fe));
      else if (fe.tor) for (const [P0, k] of [[fe.A, 0], [fe.B, 1]]) teile.push(warnleuchte(K, [P0[0], P0[1], 1.33], k * 0.6));
    });
    if (art === "fest" && zaunAb >= 1) teile("bauschild", "", () => bauschild(K, pl));
  }
  /* Zaun: steht ab dem ersten Moment, wird zuletzt abgebaut (0,985 … 1) */
  function zaunAnteil(bau) { return bau < 0.985 ? 1 : 1 - zw(bau, 0.985, 0.999); }

  function sichtbar(sz, it) {
    const W = ST.kamera.W, H = ST.kamera.H, b = it.sb, ox = sz.ox, oy = sz.oy;
    return !(b[2] + ox < -20 || b[0] + ox > W + 20 || b[3] + oy < -20 || b[1] + oy > H + 20);
  }
  /* Festes Teil als Bild im Speicher (höchstens ~3 Mio. Bildpunkte je
     Teil und 14 Mio. je Baustelle, sonst wird es direkt gemalt) */
  function bildVon(sz, it, key, fn) {
    it._bilder = it._bilder || {};
    let b = it._bilder[key];
    if (b !== undefined) return b;
    const K = sz.KF, sb = it.sb0 || it.sb, pad = Math.ceil(4 + K.s * 0.25);
    const x0 = Math.floor(sb[0]) - pad, y0 = Math.floor(sb[1]) - pad;
    const w = Math.ceil(sb[2]) + pad - x0, h = Math.ceil(sb[3]) + pad - y0;
    if (sz.skal !== 1 || w <= 0 || h <= 0 || w * h > 3e6 || sz.C.px + w * h > 14e6) return null;
    const c = document.createElement("canvas"); c.width = w; c.height = h;
    const cg = c.getContext("2d");
    cg.translate(-x0, -y0);
    try { fn(cg); } catch (err) { console.error("baustelle " + it.name, err); }
    b = { c: c, x: x0, y: y0 };
    it._bilder[key] = b;
    it._px = (it._px || 0) + w * h; sz.C.px += w * h;
    return b;
  }
  function festMalen(g, sz, it) {
    if (sz.skal !== 1) g.scale(sz.skal, sz.skal);
    const teil = (key, fn) => { const b = bildVon(sz, it, key, fn); if (b) g.drawImage(b.c, b.x, b.y); else fn(g); };
    if (it.malenA) {
      teil("A", it.malenA);
      if (sz.skal !== 1) { g.save(); g.scale(1 / sz.skal, 1 / sz.skal); geruestLeuteMalen(g, sz.pl, it.seite); g.restore(); }
      else geruestLeuteMalen(g, sz.pl, it.seite);
      teil("B", it.malenB);
    } else teil("_", it.malen);
  }
  function zeichneListe(g, sz, liste) {
    g.save();
    /* gleiche Rundung wie die Häuser-Bilder der Szene: nichts verrutscht */
    g.translate(Math.round(sz.ox), Math.round(sz.oy));
    for (const it of liste) {
      if (!sichtbar(sz, it)) continue;
      g.save();
      try { if (it.fest) festMalen(g, sz, it); else it.malen(g); } catch (err) { console.error("baustelle " + it.name, err); }
      g.restore();
      if (it.ton) tonFuer(it.ton, sz.pl.saat);
    }
    /* Arbeiter auf dem Gerüst werden mit dem Gerüst gemalt: ihr Hammer klingt,
       wenn ihre Gerüstseite im Bild ist */
    for (const it of liste) if (it.seite != null && sz.pl._geruestLeute && sichtbar(sz, it)) {
      for (const x of sz.pl._geruestLeute[it.seite] || []) if (x.ton) tonFuer(x.ton, sz.pl.saat);
    }
    g.restore();
  }

  /* Die Schatten alles Festen (Gerüst mit hunderten Rohren, Zaun, Lager,
     Kranmast) einmal in ein Bild; neu erst, wenn sich ein festes Teil
     ändert (Gerüstlage dazu, Stapel weg) */
  function festSchatten(sz) {
    const C = sz.C, K = sz.KF;
    let key = "";
    for (const [k, e] of C.map) key += k + "=" + e.zustand + ";";
    if (C.schatten && C.schatten.key === key) return C.schatten.bild;
    let a = Infinity, b = Infinity, c = -Infinity, d = -Infinity;
    const liste = sz.alle.filter((it) => it.fest && it.schatten);
    for (const it of liste) {
      const [x0, y0, x1, y1] = it.bb, z0 = it.z0 || 0, z1 = it.z1 || 1;
      for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) {
        const P = K.sp(x, y, z);
        if (P[0] < a) a = P[0]; if (P[0] > c) c = P[0]; if (P[1] < b) b = P[1]; if (P[1] > d) d = P[1];
      }
    }
    const pad = Math.ceil(4 + K.s * 0.6);
    const x0 = Math.floor(a) - pad, y0 = Math.floor(b) - pad, w = Math.ceil(c) + pad - x0, h = Math.ceil(d) + pad - y0;
    let bild = null;
    if (liste.length && w > 0 && h > 0 && w * h <= 4e6) {
      const cv = (C.schatten && C.schatten.bild && C.schatten.bild.c) || document.createElement("canvas");
      cv.width = w; cv.height = h;
      const cg = cv.getContext("2d");
      cg.translate(-x0, -y0);
      for (const it of liste) { cg.save(); try { it.schatten(cg); } catch (err) { console.error(err); } cg.restore(); }
      bild = { c: cv, x: x0, y: y0 };
    }
    C.schatten = { key: key, bild: bild };
    return bild;
  }

  /* Messen (nur zum Prüfen): Aufbau, Malen, Schatten je Teil */
  function messen(o, P, bau, g, sg) {
    const r = {}, jetzt = performance.now.bind(performance);
    o._bsSz = null; o._bsCache = null;
    let t0 = jetzt(); szeneFuer(o, P, bau); r.aufbauFest = jetzt() - t0;
    o._bsSz = null;
    t0 = jetzt(); const sz = szeneFuer(o, P, bau); r.aufbau = jetzt() - t0;
    t0 = jetzt(); zeichneListe(g, sz, sz.hinten); zeichneListe(g, sz, sz.vorne); r.malen = jetzt() - t0;
    t0 = jetzt(); sg.save(); sg.translate(sz.ox, sz.oy); for (const it of sz.alle) if (it.schatten) it.schatten(sg); sg.restore(); r.schatten = jetzt() - t0;
    r.teile = {};
    for (const it of sz.alle) { const t1 = jetzt(); g.save(); g.translate(sz.ox, sz.oy); if (it.fest) festMalen(g, sz, it); else it.malen(g); g.restore(); const k = it.name.replace(/[-0-9]+$/, ""); r.teile[k] = (r.teile[k] || 0) + jetzt() - t1; }
    return r;
  }

  /* Prüfbild in der Stadt: …&baustelle=fachwerkhaus:22:40:0:0.5 (Typ:x:y:Drehung:
     Fortschritt, mehrere mit ;) setzt nach dem Aufbau von Winterhausen eine
     Baustelle mit festem Fortschritt und räumt den Platz dafür frei */
  if (q.get("baustelle")) {
    document.addEventListener("DOMContentLoaded", function () {
      const alt = ST.stadtAnfang;
      if (!alt) return;
      ST.stadtAnfang = function (qq) {
        alt(qq);
        const SZ = ST.szene;
        for (const eintrag of q.get("baustelle").split(";")) {
          const [typ, x, y, gier, bau] = eintrag.split(":");
          const def = ST.MODELLE[typ];
          if (!def) continue;
          const r = Math.max(def.grund[0], def.grund[1]) / 2 + 7;
          SZ.objekte = SZ.objekte.filter((o) => o.rand || (ST.MODELLE[o.typ] && ST.MODELLE[o.typ].live) || Math.hypot(o.x - (+x), o.y - (+y)) > r);
          SZ.neu(typ, +x, +y, +(gier || 0), { saat: 7, bau: { fest: +(bau || 0.5) } });
        }
      };
    });
  }

  ST.baustelle = {
    _masse: modellMasse,
    _messen: messen,
    _szene: szeneFuer,
    hinten: function (g, P, o, bau) {
      if (bau >= 1) return;
      const sz = szeneFuer(o, P, bau);
      zeichneListe(g, sz, sz.hinten);
    },
    vorne: function (g, P, o, bau) {
      if (bau >= 1) return;
      const sz = szeneFuer(o, P, bau);
      zeichneListe(g, sz, sz.vorne);
      /* Lichtschein (Lampen, Befeuerung) über allem dieser Baustelle */
      if (sz.K.nacht > 0.02) {
        g.save(); g.translate(Math.round(sz.ox), Math.round(sz.oy)); g.globalCompositeOperation = "lighter";
        for (const it of sz.alle) if (it.glanz) { g.save(); if (it.fest && sz.skal !== 1) g.scale(sz.skal, sz.skal); try { it.glanz(g); } catch (err) { console.error(err); } g.restore(); }
        g.restore();
      }
    },
    schatten: function (sg, P, o, bau) {
      if (bau >= 1) return;
      const sz = szeneFuer(o, P, bau);
      sg.save(); sg.translate(Math.round(sz.ox), Math.round(sz.oy));
      const fb = sz.skal === 1 && sz.C ? festSchatten(sz) : null;
      if (fb) sg.drawImage(fb.c, fb.x, fb.y);
      for (const it of sz.alle) {
        if (!it.schatten || (fb && it.fest)) continue;
        if (!((it.z1 || 0) > 5 || sichtbar(sz, it))) continue;
        sg.save(); if (it.fest && sz.skal !== 1) sg.scale(sz.skal, sz.skal);
        try { it.schatten(sg); } catch (err) { console.error(err); }
        sg.restore();
      }
      sg.restore();
    }
  };
})();
