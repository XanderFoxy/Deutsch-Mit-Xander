/* =====================================================================
   BAUKASTEN-STADT — DAS SCHWANEN-TRETBOOT (lebendes Modell, gebacken)
   ---------------------------------------------------------------------
   XANDER: „dass der See halt nach unten … noch größer ist und man dann
   sieht, wie man mit Wassertreter darauf fahren kann, die Leute das Spaß
   haben oder baden" – „vielleicht so ein kleines Bootshaus für den
   Verleih vom Wassertreter".

   Ein Tretboot wie im Stadtpark: weißer Schwan, 3 m lang, 1,5 m breit,
   langer S-Hals mit Kopf, gelb-orangem Schnabel und schwarzem Höcker,
   an den Seiten hochgezogene Flügel mit Federreihen, hinten der Schwanz.
   In der offenen Mulde eine blaue Sitzbank mit zwei Leuten (Kleidung,
   Haare, manchmal Sonnenhut; bei manchen Booten winkt einer). Die
   Lenkstange steht vorn in der Mitte, die Pedale liegen unsichtbar im
   Rumpf. Unter der Wasserlinie wird nichts gemalt.

   Das Boot ist ein lebendes Modell wie die Spaziergänger: die leichte
   Stadt bekommt es als gebackenes Blatt (werkzeug/stadt-backen.js,
   backplan.json „leute" mit eigener Zelle) – 8 Richtungen × 4 Bilder
   einer leichten Schaukel (Rollen, Stampfen, Heben, Kopfnicken).

   WIE ES GEMALT WIRD: Rumpf, Deck, Bank und Flügel sind kleine ebene
   Vierecke (Querschnitte entlang des Boots), Hals, Kopf und Leute sind
   Kugeln und Kapseln. Alles kommt in eine Liste, wird nach der Tiefe
   zum Auge sortiert (Maler-Verfahren) und mit dem Licht der Stadt
   (ST.lichtFaktor, Licht von links oben) schattiert.
   Modellkoordinaten: +y = vorn (Fahrtrichtung), x = rechts, z = oben.
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT;
  const AUGE = ST.ZUM_AUGE || [0.6124, 0.6124, 0.5];
  const PI2 = Math.PI * 2;
  const glatt = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  const rgb = (f, a) => a == null ? "rgb(" + (f[0] | 0) + "," + (f[1] | 0) + "," + (f[2] | 0) + ")" : "rgba(" + (f[0] | 0) + "," + (f[1] | 0) + "," + (f[2] | 0) + "," + a + ")";
  const mal = (f, k) => [Math.min(255, f[0] * k[0]), Math.min(255, f[1] * k[1]), Math.min(255, f[2] * k[2])];
  const norm = (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const kreuz = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const minus = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];

  /* ---------------- Farben ---------------- */
  const WEISS = [242, 241, 236], INNEN = [214, 216, 214], BODEN = [78, 88, 102], BANK = [44, 98, 168];
  const SCHNABEL = [244, 158, 34], HOECKER = [28, 26, 26];
  const HAUT = [[236, 192, 160], [214, 164, 124], [180, 126, 90], [242, 204, 178]];
  const HAAR = [[58, 40, 28], [196, 150, 84], [28, 24, 22], [120, 70, 40], [150, 146, 140]];
  const HEMD = [[214, 58, 52], [46, 120, 196], [250, 204, 62], [70, 160, 110], [236, 236, 230], [236, 118, 160], [40, 52, 84], [255, 150, 60]];
  const HOSE = [[60, 78, 120], [196, 180, 150], [52, 52, 58], [88, 120, 80]];

  /* ---------------- Rumpfform ---------------- */
  const HECK = -1.46, BUG = 1.42;
  /* halbe Breite des Schwanenkörpers an der Stelle y (Brust vorn voller) */
  function halb(y) {
    const t = (y + 0.02) / 1.44, e = Math.sqrt(Math.max(0, 1 - t * t));
    return Math.max(0.01, 0.75 * Math.pow(e, 0.55) * (y < -0.6 ? 0.8 + 0.2 * glatt(-1.46, -0.6, y) : 1));
  }
  /* Oberkante der Bordwand: hinten zu Flügeln hochgezogen, vorn die Brust */
  function oben(y) { return 0.52 + 0.24 * glatt(-0.55, -1.3, y) + 0.1 * glatt(0.5, 1.25, y); }
  const MULDE_V = 0.46, MULDE_H = -0.78;   // offene Mulde zwischen Brust- und Heckdeck

  /* ---------------- Maler-Liste ---------------- */
  function Liste(P, wiege) {
    this.P = P; this.w = wiege; this.teile = [];
    this.L = ST.LICHT;
  }
  /* Schaukeln: Rollen um y, Stampfen um x, Heben – dann gedreht und projiziert */
  Liste.prototype.welt = function (p) {
    const w = this.w;
    let x = p[0], y = p[1], z = p[2];
    const cr = Math.cos(w.roll), sr = Math.sin(w.roll);
    const x1 = x * cr - z * sr, z1 = x * sr + z * cr;
    const cp = Math.cos(w.stampf), sp = Math.sin(w.stampf);
    const y2 = y * cp - z1 * sp, z2 = y * sp + z1 * cp;
    return [x1, y2, Math.max(0, z2 + w.heb)];
  };
  Liste.prototype.drehN = function (n) {
    const w = this.w, P = this.P;
    const cr = Math.cos(w.roll), sr = Math.sin(w.roll);
    const x1 = n[0] * cr - n[2] * sr, z1 = n[0] * sr + n[2] * cr;
    const cp = Math.cos(w.stampf), sp = Math.sin(w.stampf);
    const y2 = n[1] * cp - z1 * sp, z2 = n[1] * sp + z1 * cp;
    return [x1 * P.c - y2 * P.sn, x1 * P.sn + y2 * P.c, z2];
  };
  Liste.prototype.tiefe = function (p) {
    const P = this.P, q = this.welt(p);
    const a = q[0] * P.c - q[1] * P.sn, b = q[0] * P.sn + q[1] * P.c;
    return (a + b) * AUGE[0] + q[2] * AUGE[2];
  };
  Liste.prototype.bild = function (p) { const q = this.welt(p); return this.P.proj(q[0], q[1], q[2]); };
  Liste.prototype.licht = function (n, farbe) { return mal(farbe, ST.lichtFaktor(n, this.P.Z, 0, this.P.jahr)); };
  /* ebenes Vieleck; innen = Farbe der Innenseite (zweiseitig) */
  Liste.prototype.flaeche = function (pts, farbe, innen, bias) {
    let n = norm(kreuz(minus(pts[1], pts[0]), minus(pts[pts.length - 1], pts[0])));
    let m = [0, 0, 0]; for (const p of pts) { m[0] += p[0] / pts.length; m[1] += p[1] / pts.length; m[2] += p[2] / pts.length; }
    let nr = this.drehN(n), f = farbe;
    const blick = nr[0] * AUGE[0] + nr[1] * AUGE[1] + nr[2] * AUGE[2];
    if (blick < 0) { if (!innen) return; nr = [-nr[0], -nr[1], -nr[2]]; f = innen; }
    this.teile.push({ d: this.tiefe(m) + (bias || 0), art: 0, pts: pts, farbe: rgb(this.licht(nr, f)) });
  };
  Liste.prototype.kugel = function (c, r, farbe, bias) {
    this.teile.push({ d: this.tiefe(c) + (bias || 0), art: 1, c: c, r: r, f: farbe });
  };
  Liste.prototype.kapsel = function (a, b, r, farbe, bias) {
    const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
    this.teile.push({ d: this.tiefe(m) + (bias || 0), art: 2, a: a, b: b, r: r, f: farbe });
  };
  Liste.prototype.strich = function (pts, breite, farbe, bias) {
    const m = pts[Math.floor(pts.length / 2)];
    this.teile.push({ d: this.tiefe(m) + (bias || 0), art: 3, pts: pts, b: breite, f: farbe });
  };
  Liste.prototype.malen = function (g) {
    const P = this.P, s = P.s, L = this.L;
    /* Lichtrichtung im Bild (für Kugeln und Kapseln) */
    const lx = (L[0] - L[1]) * ST.KX, ly = (L[0] + L[1]) * ST.KY - L[2] * ST.KZ, ll = Math.hypot(lx, ly);
    const hx = lx / ll, hy = ly / ll;
    const hell = (f) => rgb(this.licht(L, f)), dunkel = (f) => rgb(this.licht([-L[0] * 0.3, -L[1] * 0.3, 0.2], f));
    this.teile.sort((u, v) => u.d - v.d);
    g.lineJoin = "round"; g.lineCap = "round";
    for (const t of this.teile) {
      if (t.art === 0) {
        g.beginPath();
        t.pts.forEach((p, i) => { const q = this.bild(p); if (i) g.lineTo(q[0], q[1]); else g.moveTo(q[0], q[1]); });
        g.closePath(); g.fillStyle = t.farbe; g.fill();
        g.strokeStyle = t.farbe; g.lineWidth = 0.7; g.stroke();
      } else if (t.art === 1) {
        const q = this.bild(t.c), r = t.r * s;
        const gr = g.createRadialGradient(q[0] + hx * r * 0.45, q[1] + hy * r * 0.45, r * 0.08, q[0], q[1], r * 1.05);
        gr.addColorStop(0, hell(t.f)); gr.addColorStop(0.6, rgb(this.licht([L[0] * 0.6, L[1] * 0.6, 0.7], t.f))); gr.addColorStop(1, dunkel(t.f));
        g.fillStyle = gr; g.beginPath(); g.arc(q[0], q[1], Math.max(0.6, r), 0, PI2); g.fill();
      } else if (t.art === 2) {
        const a = this.bild(t.a), b = this.bild(t.b), r = t.r * s;
        /* quer zur Kapsel schattieren: helle Seite zum Licht */
        let nx = -(b[1] - a[1]), ny = b[0] - a[0]; const nl = Math.hypot(nx, ny) || 1; nx /= nl; ny /= nl;
        if (nx * hx + ny * hy < 0) { nx = -nx; ny = -ny; }
        const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
        const gr = g.createLinearGradient(mx + nx * r, my + ny * r, mx - nx * r, my - ny * r);
        gr.addColorStop(0, hell(t.f)); gr.addColorStop(0.45, rgb(this.licht([L[0] * 0.5, L[1] * 0.5, 0.75], t.f))); gr.addColorStop(1, dunkel(t.f));
        g.strokeStyle = gr; g.lineWidth = Math.max(1, 2 * r);
        g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
      } else {
        g.strokeStyle = t.f; g.lineWidth = Math.max(0.5, t.b * s);
        g.beginPath(); t.pts.forEach((p, i) => { const q = this.bild(p); if (i) g.lineTo(q[0], q[1]); else g.moveTo(q[0], q[1]); }); g.stroke();
      }
    }
  };

  /* ---------------- Das Boot ---------------- */
  const STAT = []; for (let i = 0; i <= 18; i++) STAT.push(HECK + (BUG - HECK) * i / 18);
  /* Querschnitt: unten bauchig, oben eine runde Wulst, die nach innen läuft */
  const QB = [0.9, 0.99, 1.0, 0.97, 0.9, 0.79], QH = [0, 0.26, 0.52, 0.74, 0.91, 1];
  const STUFEN = QB.length - 1;
  function wandPunkt(y, j, seite) {
    const w = halb(y), h = oben(y);
    return [seite * w * QB[j], y, h * QH[j]];
  }
  function ausstattung(saat) {
    const r = ST.zufall(saat * 7919 + 13);
    const w = (a) => a[Math.floor(r() * a.length)];
    const leute = [];
    for (let k = 0; k < 2; k++) leute.push({ haut: w(HAUT), haar: w(HAAR), hemd: w(HEMD), hose: w(HOSE), hut: r() < 0.3, kind: false, lang: r() < 0.45 });
    /* manchmal sitzt rechts ein Kind */
    if (r() < 0.35) leute[1].kind = true;
    return { leute: leute, winkt: r() < 0.55 ? Math.floor(r() * 2) : -1 };
  }

  function bauen(Li, o, ph) {
    /* Wasserlinie: dunkler Rand und heller Schaum, ganz unten */
    const wl = [], wr = [];
    for (const y of STAT) { const p = wandPunkt(y, 0, 1); wr.push([p[0] + 0.05, y, 0]); wl.push([-p[0] - 0.05, y, 0]); }
    Li.teile.push({ d: -99, art: 4, pts: wr.concat(wl.reverse()) });
    /* Bordwände außen (weiß) und innen (hellgrau) */
    for (let i = 0; i < STAT.length - 1; i++) for (let j = 0; j < STUFEN; j++) for (const s of [-1, 1]) {
      const y0 = STAT[i], y1 = STAT[i + 1];
      const a = wandPunkt(y0, j, s), b = wandPunkt(y1, j, s), c = wandPunkt(y1, j + 1, s), d = wandPunkt(y0, j + 1, s);
      Li.flaeche(s > 0 ? [a, b, c, d] : [a, d, c, b], WEISS, INNEN);
    }
    /* Muldenboden und Bank */
    const boden = [];
    for (const y of STAT) if (y > MULDE_H - 0.05 && y < MULDE_V + 0.05) boden.push([halb(y) * 0.86, y, 0.2]);
    const bl = boden.map((p) => [-p[0], p[1], p[2]]).reverse();
    Li.flaeche(boden.concat(bl), BODEN, null, -0.4);
    const bw = 0.62, zb = 0.42;
    Li.flaeche([[-bw, -0.58, zb], [bw, -0.58, zb], [bw, -0.22, zb], [-bw, -0.22, zb]].reverse(), BANK, BANK, -0.05);
    Li.flaeche([[-bw, -0.22, zb], [bw, -0.22, zb], [bw, -0.22, 0.2], [-bw, -0.22, 0.2]], BANK, BANK, -0.05);
    Li.flaeche([[-bw, -0.62, 0.82], [bw, -0.62, 0.82], [bw, -0.58, zb], [-bw, -0.58, zb]], BANK, BANK, -0.05);
    /* Lenkstange vorn in der Mitte */
    Li.kapsel([0, 0.36, 0.2], [0, 0.3, 0.62], 0.025, [60, 64, 70]);
    Li.kapsel([-0.14, 0.3, 0.62], [0.14, 0.3, 0.62], 0.022, [30, 30, 32], 0.02);
    /* Brustdeck vorn und Heckdeck hinten (gewölbt) */
    const deck = (von, bis, wolb, bias) => {
      const st = STAT.filter((y) => y >= von - 1e-6 && y <= bis + 1e-6);
      for (let i = 0; i < st.length - 1; i++) for (let k = 0; k < 6; k++) {
        const u0 = -1 + k / 3, u1 = -1 + (k + 1) / 3;
        const pt = (y, u) => { const p = wandPunkt(y, STUFEN, 1); return [u * p[0], y, oben(y) + wolb * (1 - u * u)]; };
        Li.flaeche([pt(st[i], u0), pt(st[i], u1), pt(st[i + 1], u1), pt(st[i + 1], u0)], WEISS, null, bias || 0);
      }
    };
    deck(MULDE_V, BUG, 0.16, 0.02);
    deck(HECK, MULDE_H, 0.14, 0.02);
    /* Schwanz: kleiner Fächer hinten, leicht hochgestellt */
    Li.flaeche([[-0.16, -1.2, oben(-1.2) + 0.1], [0.16, -1.2, oben(-1.2) + 0.1], [0.05, -1.52, 0.98], [0, -1.56, 1.0], [-0.05, -1.52, 0.98]], WEISS, INNEN, 0.08);
    /* Flügel: gewölbte Platten auf der Bordwulst, hinten hochgezogen, oben
       mit Federbögen; außen weiß, innen hellgrau */
    const FL = []; for (let i = 0; i <= 12; i++) FL.push(0.36 - 1.62 * i / 12);
    for (const s of [-1, 1]) {
      const fuss = (y) => { const p = wandPunkt(y, STUFEN - 1, s); return [p[0] * 0.99, y, oben(y) * QH[STUFEN - 1]]; };
      const kopf = (y, i) => { const b = fuss(y), h = 0.06 + 0.24 * glatt(0.36, -1.0, y) - 0.14 * glatt(-1.05, -1.26, y); const bogen = i % 2 ? 0.02 : 0; return [b[0] * 1.02 + s * 0.05 * glatt(0.2, -1, y), y, b[2] + h - bogen]; };
      for (let i = 0; i < FL.length - 1; i++) {
        const q = [fuss(FL[i]), fuss(FL[i + 1]), kopf(FL[i + 1], i + 1), kopf(FL[i], i)];
        Li.flaeche(s > 0 ? q.slice().reverse() : q, WEISS, INNEN, 0.03);
      }
      /* Federreihen: nur auf der Seite, die zum Auge schaut */
      const n = Li.drehN([s, 0, 0]);
      if (n[0] * AUGE[0] + n[1] * AUGE[1] > 0) for (const f of [0.4, 0.7]) {
        const pts = [];
        for (let i = 0; i < FL.length; i++) { const a = fuss(FL[i]), b = kopf(FL[i], 0); pts.push([a[0] + (b[0] - a[0]) * f + s * 0.012, FL[i], a[2] + (b[2] - a[2]) * f]); }
        for (let i = 1; i < pts.length - 2; i++) Li.strich([pts[i], pts[i + 1]], 0.012, "rgba(150,156,166,0.6)", 0.3);
      }
    }
    /* Hals (S-Bogen), Kopf, Schnabel, Augen */
    const nick = Math.sin(ph * PI2 + 0.8) * 0.02;
    const K = [[0, 0.95, 0.4], [0, 1.24, 0.66], [0, 1.24, 1.02], [0, 1.06, 1.34], [0, 1.1, 1.58], [0, 1.22, 1.68 + nick]];
    const hals = [];
    for (let i = 0; i < K.length - 1; i++) {
      const p0 = K[Math.max(0, i - 1)], p1 = K[i], p2 = K[i + 1], p3 = K[Math.min(K.length - 1, i + 2)];
      for (let k = 0; k < 6; k++) {
        const t = k / 6, t2 = t * t, t3 = t2 * t;
        hals.push([0, 1, 2].map((a) => 0.5 * (2 * p1[a] + (-p0[a] + p2[a]) * t + (2 * p0[a] - 5 * p1[a] + 4 * p2[a] - p3[a]) * t2 + (-p0[a] + 3 * p1[a] - 3 * p2[a] + p3[a]) * t3)));
      }
    }
    /* Hals als Kette von Kapseln: quer schattiert, dadurch eine glatte Röhre */
    const hr = (i) => 0.19 - 0.115 * Math.pow(i / (hals.length - 1), 0.7);
    for (let i = 0; i < hals.length - 1; i++) Li.kapsel(hals[i], hals[i + 1], (hr(i) + hr(i + 1)) / 2, WEISS, 0.04 + i * 0.002);
    Li.kugel(hals[0], 0.2, WEISS, 0.035);
    const kopf = [0, 1.28, 1.7 + nick];
    Li.kugel(kopf, 0.115, WEISS, 0.05);
    Li.kugel([0, 1.2, 1.72 + nick], 0.1, WEISS, 0.05);
    Li.kugel([0, 1.37, 1.69 + nick], 0.045, HOECKER, 0.06);
    Li.kapsel([0, 1.4, 1.67 + nick], [0, 1.62, 1.6 + nick], 0.038, SCHNABEL, 0.07);
    Li.kapsel([0, 1.58, 1.61 + nick], [0, 1.66, 1.585 + nick], 0.022, [214, 110, 20], 0.075);
    for (const s of [-1, 1]) Li.kugel([s * 0.085, 1.33, 1.72 + nick], 0.02, [20, 18, 18], 0.06);
    /* die zwei Leute auf der Bank */
    const A = ausstattung(o.saat || 7);
    A.leute.forEach((m, k) => {
      const x = k ? 0.3 : -0.3, gr = m.kind ? 0.78 : 1;
      const huefte = [x, -0.38, 0.5], schulter = [x, -0.46, 0.5 + 0.4 * gr];
      const schwing = Math.sin(ph * PI2 + k * 1.7) * 0.015;
      /* Oberschenkel und Knie (die Füße treten unten die Pedale) */
      const knie = [x * 0.9, 0.02, 0.58 + (k ? schwing : -schwing)];
      Li.kapsel(huefte, knie, 0.075 * gr, m.hose, -0.02);
      Li.kapsel(knie, [x * 0.85, 0.2, 0.26], 0.06 * gr, m.hose, -0.03);
      /* Oberkörper */
      Li.kapsel([x, -0.4, 0.56], [x, -0.45, 0.5 + 0.34 * gr], 0.16 * gr, m.hemd, 0.02);
      /* Arme: einer winkt, sonst Hände an Lenkstange oder Bordwand */
      const sl = [x - 0.15 * gr, -0.45, 0.46 + 0.36 * gr], sr = [x + 0.15 * gr, -0.45, 0.46 + 0.36 * gr];
      if (A.winkt === k) {
        const w = Math.sin(ph * PI2) * 0.05;
        const aussen = k ? sr : sl, sx = k ? 1 : -1;
        Li.kapsel(aussen, [aussen[0] + sx * 0.12, -0.42, aussen[2] + 0.22], 0.045 * gr, m.hemd, 0.08);
        Li.kapsel([aussen[0] + sx * 0.12, -0.42, aussen[2] + 0.22], [aussen[0] + sx * (0.16 + w), -0.38, aussen[2] + 0.46], 0.037 * gr, m.haut, 0.09);
        Li.kugel([aussen[0] + sx * (0.16 + w), -0.38, aussen[2] + 0.5], 0.045 * gr, m.haut, 0.1);
      } else {
        const aussen = k ? sr : sl, sx = k ? 1 : -1;
        Li.kapsel(aussen, [aussen[0] + sx * 0.08, -0.25, 0.64], 0.045 * gr, m.hemd, 0.03);
        Li.kapsel([aussen[0] + sx * 0.08, -0.25, 0.64], [aussen[0] + sx * 0.12, -0.05, 0.56], 0.036 * gr, m.haut, 0.03);
      }
      const innen = k ? sl : sr, ix = k ? -1 : 1;
      Li.kapsel(innen, [innen[0] + ix * 0.05, -0.2, 0.64], 0.045 * gr, m.hemd, 0.03);
      Li.kapsel([innen[0] + ix * 0.05, -0.2, 0.64], [ix * 0.02 + x * 0.3, 0.26, 0.63], 0.036 * gr, m.haut, 0.03);
      /* Hals und Kopf */
      const kz = 0.5 + 0.52 * gr;
      Li.kapsel([x, -0.45, 0.5 + 0.38 * gr], [x, -0.44, kz - 0.06], 0.045 * gr, m.haut, 0.04);
      Li.kugel([x, -0.47, kz + 0.02], 0.1 * gr, m.haar, 0.05);
      Li.kugel([x, -0.43, kz], 0.095 * gr, m.haut, 0.06);
      if (m.lang) Li.kapsel([x, -0.5, kz], [x, -0.53, kz - 0.16], 0.075 * gr, m.haar, 0.055);
      if (m.hut) {
        const rand = [];
        for (let i = 0; i < 14; i++) { const a = i / 14 * PI2; rand.push([x + Math.cos(a) * 0.19 * gr, -0.45 + Math.sin(a) * 0.19 * gr, kz + 0.07 * gr]); }
        Li.flaeche(rand, [232, 206, 140], [200, 176, 116], 0.07);
        Li.kugel([x, -0.45, kz + 0.1 * gr], 0.075 * gr, [226, 200, 132], 0.08);
      }
    });
  }

  function wiege(ph) {
    return { roll: Math.sin(ph * PI2) * 0.035, stampf: Math.cos(ph * PI2) * 0.02, heb: 0.012 + Math.sin(ph * PI2 + 1) * 0.012 };
  }
  function phase(P) { const o = P.objekt; return (o && o._m && o._m.ph) || 0; }

  ST.modell("tretboot", {
    name: "Schwanen-Tretboot", gruppe: "Deko", versteckt: true, live: true, grund: [1.5, 3], hoehe: 1.9,
    zeichnen: function (g, P) {
      const ph = phase(P), Li = new Liste(P, wiege(ph));
      bauen(Li, P.objekt || {}, ph);
      /* Wasserlinie (Teil art 4): dunkler Saum und Schaumkante */
      const wl = Li.teile.shift();
      g.save();
      g.beginPath(); wl.pts.forEach((p, i) => { const q = P.proj(p[0] * 1.08, p[1] * 1.04, 0); if (i) g.lineTo(q[0], q[1]); else g.moveTo(q[0], q[1]); }); g.closePath();
      g.fillStyle = "rgba(18,40,58,0.22)"; g.fill();
      g.strokeStyle = "rgba(236,244,248,0.4)"; g.lineWidth = Math.max(0.8, 0.035 * P.s); g.stroke();
      g.restore();
      g.save(); Li.malen(g); g.restore();
    },
    schatten: function (sg, P) {
      const ph = phase(P), w = wiege(ph);
      const Li = new Liste(P, w);
      sg.fillStyle = "#000";
      /* Rumpf: Umriss der Bordkante auf dem Wasser */
      const pts = [];
      for (const y of STAT) { const p = wandPunkt(y, STUFEN, 1); pts.push(Li.welt([p[0], y, oben(y) * 0.8])); }
      for (let i = STAT.length - 1; i >= 0; i--) { const y = STAT[i], p = wandPunkt(y, STUFEN, -1); pts.push(Li.welt([p[0], y, oben(y) * 0.8])); }
      sg.beginPath(); pts.forEach((p, i) => { const q = P.schattenAuf(p[0], p[1], p[2]); if (i) sg.lineTo(q[0], q[1]); else sg.moveTo(q[0], q[1]); }); sg.closePath(); sg.fill();
      /* Hals: auf dem Wasser verschwimmt der Schatten – nur ein kurzer, weicher Ansatz */
      for (let t = 0; t <= 1; t += 0.1) {
        const p = Li.welt([0, 0.95 + 0.3 * Math.sin(t * 2.4), (0.4 + 1.3 * t) * 0.45]), q = P.schattenAuf(p[0], p[1], p[2]);
        sg.globalAlpha = 0.8 - 0.5 * t; sg.beginPath(); sg.arc(q[0], q[1], (0.17 - 0.08 * t) * P.s, 0, PI2); sg.fill();
      }
      sg.globalAlpha = 1;
    }
  });
})();
