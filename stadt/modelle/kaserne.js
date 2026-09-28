/* =====================================================================
   KASERNE  („kaserne") – die kleine Stadtwache
   ---------------------------------------------------------------------
   XANDER: „richtig filigran. Richtig schön ausarbeiten mit schönen
   Texturen" · „keine Comic Grafik … viel mehr am Realismus" · „ohne
   Pixelkanten und komische Vektorrückstände" · „Man soll das Fundament
   sehen beim Aufbauen" · „Du bist dein schlimmster Kritiker".

   Vorbild: norddeutsche Hauptwachen und Torhäuser in Backstein
   (Lübeck, Stralsund, Tangermünde). Ein zweigeschossiger Wachbau mit
   Treppengiebeln an den Schmalseiten, weiß geputzten Blendnischen und
   Biberschwanzdach; davor – in der Mitte der Straßenseite – der
   Torturm mit rundbogigem Tor, eisenbeschlagenen Torflügeln, Inschrift
   „STADTWACHE", schmalen Fenstern, Rundbogenfries und Zinnenkranz.
   Auf dem Turm der Fahnenmast mit rot-weißer Stadtfahne, links vor dem
   Tor das rot-weiß gewinkelte Schilderhaus mit dem Posten, rechts
   dezent eine alte Bronzekanone auf ihrer Lafette.

   Maße (Meter): Wachbau 10,0 × 5,6, Traufe 6,5, First 10,1 (52°),
   Treppengiebel bis 11,0; Torturm 3,8 × 2,2, Mauer bis 10,4, Zinnen
   bis 11,8, Fahnenmast bis 14,4. Grund 12 × 10.
   Hausfront (Tor) bei Drehung 0 nach Süden (+y).

   REIHENFOLGE DER TEILE: Der Kern sortiert Teile nach ihrer „Mitte".
   Wachbau (Mauern) → Dach → Giebel und Turm; der Turm bekommt eine
   hohe Mitte, damit er von Süden gesehen vor dem Dach liegt und von
   Norden gesehen hinter dem Wachbau (dort ist die Südseite des Dachs
   ohnehin abgewandt).
   ===================================================================== */
(function () {
  "use strict";
  const ST = window.STADT, PI = ST.pinsel;
  const hex = PI.hex, rgb = PI.rgb, misch = PI.misch, hell = PI.hell;
  const RAD = Math.PI / 180;
  const klemm = (x, a, b) => Math.max(a, Math.min(b, x));
  const hash = (a, b, c) => ST.hash2(a, b, c);
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
  const nrm = (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const lerp = (a, b, t) => a + (b - a) * t;

  /* ---------------- Maße ---------------- */
  const HX0 = -5.0, HX1 = 5.0, HYN = -4.4, HYS = 1.2, WD = 0.45;   // Wachbau, Mauerstärke
  const Z_SO = 0.55, Z_GU = 3.35, Z_TR = 6.5;                       // Sockel, Gurtgesims (Oberkante), Traufe
  const NEIG = Math.tan(52 * RAD), HYM = (HYN + HYS) / 2, HALB = (HYS - HYN) / 2;
  const Z_FI = Z_TR + HALB * NEIG;                                   // First ≈ 10,08
  const UE = 0.35;                                                   // Traufüberstand
  const GX = HX1 - WD;                                               // Innenkante Giebel (4,55)
  const TX0 = -1.9, TX1 = 1.9, TYN = HYS, TYS = 3.4, Z_TT = 10.4;    // Torturm
  const PA = 0.15, PD = 0.36, Z_ZS = 11.1, Z_ZO = 11.8, Z_DECK = 10.7;  // Brüstung: Auskragung, Stärke, Scharte, Zinne, Wehrgang
  const TOR = { w: 2.4, zk: 2.25 };                                  // Torbogen: Breite, Kämpfer
  const G_N = 4, G_P = 0.45, G_UEB = 0.45;                           // Treppengiebel: Staffeln je Seite, halbe Pfeilerbreite, Überhöhung
  const WH = { x0: -3.62, x1: -2.72, y0: 3.3, y1: 4.2, z: 2.2, zs: 2.78 };   // Schilderhaus
  const KAN = { x: 3.05, y: 4.05, dreh: -18 };                       // Kanone
  const FAHNE = { x: 0.05, y: 1.75 };

  /* ---------------- Farben ---------------- */
  const ZIEGEL = [
    [[150, 62, 44], [162, 74, 50], [138, 56, 42], [170, 88, 60], [128, 50, 38], [154, 68, 52]],
    [[132, 58, 44], [146, 66, 50], [120, 50, 40], [156, 80, 58], [112, 46, 38], [140, 62, 50]]
  ];
  const BRAND = [[74, 42, 40], [90, 50, 44], [62, 40, 38]];
  const MOERTEL = [186, 178, 164];
  const SAND = [198, 180, 146];
  const PUTZ_W = [230, 226, 216];
  const EICHE = [92, 64, 42];
  const EISEN = [42, 40, 42];
  const SCHNEE = [242, 246, 252];
  const DACHF = ["#8e4430", "#7a3a2c", "#6e3a30"];
  const TORF = [[96, 66, 44], [104, 38, 32], [58, 70, 58]];

  /* Varianten über o.saat */
  const VAR = {};
  function variante(o) {
    const k = o.saat || 1;
    if (VAR[k]) return VAR[k];
    const r = ST.zufall(k * 4099 + 71);
    const v = { saat: k, ziegel: ZIEGEL[r() < 0.6 ? 0 : 1], dach: DACHF[Math.floor(r() * 3) % 3], tor: TORF[Math.floor(r() * 3) % 3], jahr: ["1712", "1698", "1734", "1756"][Math.floor(r() * 4) % 4] };
    VAR[k] = v;
    return v;
  }

  /* =====================================================================
     HILFEN: Blick und Licht im Modellraum
     ===================================================================== */
  /* Aus Fläche und Licht die Drehung des Modells zurückrechnen: so kennen
     wir die Blickrichtung im Modellraum – für Laibungen, Nischen und die
     Baugrube, in jedem Drehwinkel richtig. */
  function sicht(F) {
    if (F._si) return F._si;
    const f = F.flaeche, u = f.u, v = f.v, n = ST.kreuz(u, v);
    const Lm = [0, 1, 2].map((i) => F.lichtU * u[i] + F.lichtV * v[i] + F.lichtN * n[i]);
    const L = ST.LICHT, th = Math.atan2(L[1], L[0]) - Math.atan2(Lm[1], Lm[0]);
    const c = Math.cos(th), s = Math.sin(th), E = ST.ZUM_AUGE;
    const Em = [E[0] * c + E[1] * s, -E[0] * s + E[1] * c, E[2]];
    const en = dot(Em, n), enS = Math.sign(en || 1) * Math.max(0.14, Math.abs(en));
    const S = { c: c, s: s, E: Em, n: n, eu: dot(Em, u), ev: dot(Em, v), en: en };
    /* Versatz eines um d hinter der Fläche liegenden Punkts */
    S.tief = (d) => [S.eu * d / enS, S.ev * d / enS];
    S.rot = (p) => [p[0] * c - p[1] * s, p[0] * s + p[1] * c, p[2]];
    S.lf = ST.lichtFaktor(F.n, F.zeit, 0, F.jahr);
    /* Licht einer Teilfläche mit Modellnormale nm relativ zur Trägerfläche */
    S.rel = (nm) => { const l = ST.lichtFaktor(S.rot(nrm(nm)), F.zeit, 0, F.jahr); return [l[0] / Math.max(0.05, S.lf[0]), l[1] / Math.max(0.05, S.lf[1]), l[2] / Math.max(0.05, S.lf[2])]; };
    S.u = u; S.v = v;
    F._si = S;
    return S;
  }
  const mal = (c, k) => [Math.min(255, c[0] * k[0]), Math.min(255, c[1] * k[1]), Math.min(255, c[2] * k[2])];
  function vieleck(g, p) { g.beginPath(); g.moveTo(p[0][0], p[0][1]); for (let i = 1; i < p.length; i++) g.lineTo(p[i][0], p[i][1]); g.closePath(); }

  /* Rauschen über wenige Grundmuster (jedes neue Muster kostet Rechenzeit) */
  function rausch(g, x, y, w, h, meter, staerke, saat, okt) {
    const basis = [3, 17, 29][Math.abs(saat | 0) % 3];
    const dx = hash(saat, 1, 2) * meter * 3.1, dy = hash(saat, 2, 3) * meter * 2.7;
    g.save(); g.translate(dx, dy);
    PI.rauschen(g, x - dx, y - dy, w, h, meter, staerke, basis, okt && okt < 4 ? 3 : 4);
    g.restore();
  }

  /* Beliebiges ebenes Vieleck im Raum (Außenseite = n) */
  function polyFlaeche(M, pts, n, malen, extra) {
    n = nrm(n);
    let u = sub(pts[1], pts[0]);
    u = nrm(sub(u, mul(n, dot(u, n))));
    const v = ST.kreuz(n, u);
    const q = pts.map((P) => { const d = sub(P, pts[0]); return [dot(d, u), dot(d, v)]; });
    let a0 = 1e9, b0 = 1e9, a1 = -1e9, b1 = -1e9;
    for (const [a, b] of q) { a0 = Math.min(a0, a); b0 = Math.min(b0, b); a1 = Math.max(a1, a); b1 = Math.max(b1, b); }
    const o = add(pts[0], add(mul(u, a0), mul(v, b0)));
    return M.flaeche(Object.assign({ o: o, u: u, v: v, w: a1 - a0, h: b1 - b0, umriss: q.map(([a, b]) => [a - a0, b - b0]), malen: malen, keinAo: true }, extra || {}));
  }
  /* Senkrechte Wand von p0 nach p1 (von außen gesehen links → rechts) */
  function wandFlaeche(M, name, p0, p1, z0, z1, malen, opt) {
    const dx = p1[0] - p0[0], dy = p1[1] - p0[1], w = Math.hypot(dx, dy);
    if (z1 - z0 < 0.005 || w < 0.005) return null;
    return M.flaeche(Object.assign({ name: name, o: [p0[0], p0[1], z1], u: [dx / w, dy / w, 0], v: [0, 0, -1], w: w, h: z1 - z0, malen: malen, leuchten: malen && malen.leuchten, ao: z0 < 0.05 }, opt || {}));
  }
  /* Waagerechte Fläche (nach oben) über dem Rechteck */
  function deckel(M, name, x0, y0, x1, y1, z, malen, opt) {
    return M.flaeche(Object.assign({ name: name, o: [x0, y0, z], u: [1, 0, 0], v: [0, 1, 0], w: x1 - x0, h: y1 - y0, malen: malen }, opt || {}));
  }
  /* Vieleck an Halbebene b <= grenze abschneiden (Flächenkoordinaten) */
  function kappen(p, grenze) {
    const aus = [];
    for (let i = 0; i < p.length; i++) {
      const a = p[i], b = p[(i + 1) % p.length];
      const ia = a[1] >= grenze, ib = b[1] >= grenze;
      if (ia) aus.push(a);
      if (ia !== ib) { const t = (grenze - a[1]) / (b[1] - a[1]); aus.push([a[0] + (b[0] - a[0]) * t, grenze]); }
    }
    return aus;
  }

  /* =====================================================================
     BACKSTEIN – gotischer Verband im Klosterformat
     Läufer und Binder wechseln in jeder Schicht, die Binder sitzen mittig
     über den Läufern der Schicht darunter. Dazwischen einzelne dunkel
     gebrannte „Brandköpfe", wie sie an Lübecker Mauern das Bild beleben.
     RECHENZEIT: eine nahtlose Kachel (4,5 × 2,0 m) je Detailstufe, als
     Muster an Weltkoordinaten gelegt – beim Bauen wandert kein Stein.
     ===================================================================== */
  const BK = { W: 4.5, H: 2.0, L: 0.3, K: 0.15, S: 0.1 };
  const KACHELN = new Map();
  let kachelPixel = 0;
  function backsteinKachel(pt, pal, sd, grob, saat) {
    const schl = [pt, pal[0].join(","), sd[0], sd[1], grob ? 1 : 0, saat].join("|");
    let K = KACHELN.get(schl);
    if (K) return K;
    const cw = Math.max(4, Math.round(BK.W * pt)), ch = Math.max(4, Math.round(BK.H * pt));
    if (kachelPixel + cw * ch > 14e6) { KACHELN.clear(); kachelPixel = 0; }
    const cv = document.createElement("canvas"); cv.width = cw; cv.height = ch;
    /* Prozessor-Leinwand: tausend kleine Ziegel sind dort viel schneller gemalt */
    const g = cv.getContext("2d", { willReadFrequently: true });
    g.scale(cw / BK.W, ch / BK.H);
    g.fillStyle = rgb(MOERTEL); g.fillRect(0, 0, BK.W, BK.H);
    const j = Math.max(0.012, 0.85 / pt);
    const nS = Math.round(BK.H / BK.S), nE = Math.round(BK.W / (BK.L + BK.K));
    const eimer = [], alle = new Path2D(), kopf = new Path2D();
    for (let i = 0; i < pal.length * 3 + BRAND.length; i++) eimer.push(new Path2D());
    for (let r = 0; r < nS; r++) {
      const y = BK.H - (r + 1) * BK.S;
      const off = (r % 2) * (BK.L + BK.K) / 2 + ((saat * 7) % 3) * 0.05;
      for (let e = -1; e <= nE; e++) {
        const x0 = off + e * (BK.L + BK.K);
        const em = ((e % nE) + nE) % nE;
        for (let t = 0; t < 2; t++) {
          const xa = x0 + (t ? BK.L : 0), len = t ? BK.K : BK.L;
          if (xa > BK.W + 0.01 || xa + len < -0.01) continue;
          const hs = hash(em * 2 + t, r, saat + 5);
          let k;
          if (t === 1 && hs < 0.2) k = pal.length * 3 + ((hash(em, r, saat + 9) * BRAND.length) | 0);
          else if (t === 0 && hs < 0.03) k = pal.length * 3 + 2;
          else k = ((hash(em * 2 + t, r, saat + 1) * pal.length) | 0) * 3 + ((hash(em * 2 + t, r, saat + 2) * 3) | 0);
          const bx = xa + j / 2, by = y + j / 2, bw = len - j, bh = BK.S - j;
          if (grob) eimer[k].rect(bx, by, bw, bh);
          else {
            /* leicht unregelmäßige Kanten: handgestrichene Ziegel */
            const q = Math.min(0.008, bh * 0.1), J = (n) => (hash(em * 2 + t, r * 13 + n, saat) - 0.5) * q;
            const p = eimer[k];
            p.moveTo(bx + J(1), by + J(2)); p.lineTo(bx + bw + J(3), by + J(4)); p.lineTo(bx + bw + J(5), by + bh + J(6)); p.lineTo(bx + J(7), by + bh + J(8)); p.closePath();
            alle.rect(bx, by, bw, bh);
            kopf.rect(bx, by, bw, Math.max(0.006, bh * 0.16));
          }
        }
      }
    }
    if (!grob) {
      /* Fuge liegt zurück: Schattenkante unter und neben jedem Stein */
      g.save(); g.translate(sd[0], Math.max(j * 0.4, sd[1])); g.fillStyle = sd[2] ? "rgba(60,44,40,0.55)" : "rgba(60,44,40,0.35)"; g.fill(alle); g.restore();
    }
    for (let i = 0; i < pal.length; i++) for (let v = 0; v < 3; v++) { g.fillStyle = rgb(hell(pal[i], (v - 1) * 0.07)); g.fill(eimer[i * 3 + v]); }
    for (let i = 0; i < BRAND.length; i++) { g.fillStyle = rgb(BRAND[i]); g.fill(eimer[pal.length * 3 + i]); }
    if (!grob) {
      g.fillStyle = "rgba(255,230,210,0.10)"; g.fill(kopf);
      rausch(g, 0, 0, BK.W, BK.H, 0.5, 0.22, saat + 3, 3);
      rausch(g, 0, 0, BK.W, BK.H, 0.18, 0.12, saat + 4, 3);
    }
    K = { bild: cv, cw: cw, ch: ch };
    KACHELN.set(schl, K); kachelPixel += cw * ch;
    return K;
  }
  /* Rechteck (Flächenkoordinaten) mit Backstein füllen; A0 = Weltlage des
     linken Flächenrands entlang der Wand, top = Höhe der Flächenoberkante */
  function backstein(g, F, x0, y0, x1, y1, A0, top, V, saat) {
    const px = F.px, pal = V.ziegel;
    if (px < 9) {
      const m = pal.reduce((a, c) => [a[0] + c[0] / pal.length, a[1] + c[1] / pal.length, a[2] + c[2] / pal.length], [0, 0, 0]);
      g.fillStyle = rgb(misch(m, MOERTEL, 0.12)); g.fillRect(x0, y0, x1 - x0, y1 - y0);
      if (px > 4) {
        g.fillStyle = "rgba(210,200,186,0.18)";
        for (let z = Math.ceil((top - y1) / 0.2) * 0.2; z < top - y0; z += 0.2) g.fillRect(x0, top - z, x1 - x0, 0.03);
      }
      rausch(g, x0, y0, x1 - x0, y1 - y0, 3.2, 0.2, saat, 3);
      return;
    }
    const sv = F.schatten ? F.schatten(0.018) : null;
    const sd = sv ? [Math.round(sv[0] / 0.006) * 0.006, Math.round(sv[1] / 0.006) * 0.006, 1] : [0, 0.004, 0];
    const pt = Math.min(240, Math.pow(2, Math.ceil(Math.log2(Math.max(F.pxU || px, F.pxV || px) * 1.05) * 4) / 4));
    const K = backsteinKachel(pt, pal, sd, px < 16, (saat | 0) % 2);
    const mu = K.muster || (K.muster = g.createPattern(K.bild, "repeat"));
    mu.setTransform(new DOMMatrix([BK.W / K.cw, 0, 0, BK.H / K.ch, -A0, top - BK.H]));
    g.fillStyle = mu; g.fillRect(x0, y0, x1 - x0, y1 - y0);
    rausch(g, x0, y0, x1 - x0, y1 - y0, 3.4, 0.2, saat, 4);
  }

  /* Werkstein (Sandstein): Fläche mit Farbspiel, Kanten und Fugen */
  function werkstein(g, F, x, y, w, h, saat, opt) {
    opt = opt || {};
    const c = opt.farbe || SAND;
    const gr = g.createLinearGradient(0, y, 0, y + h);
    gr.addColorStop(0, rgb(hell(c, 0.1))); gr.addColorStop(0.2, rgb(c)); gr.addColorStop(1, rgb(hell(c, -0.1)));
    g.fillStyle = gr; g.fillRect(x, y, w, h);
    if (F.px > 10) rausch(g, x, y, w, h, 0.9, 0.24, saat, 3);
    if (F.px > 30) rausch(g, x, y, w, h, 0.25, 0.14, saat + 1, 3);
    if (opt.fugen && F.px > 8) {
      g.fillStyle = rgb(hell(c, -0.38), 0.8);
      const f = Math.max(0.01, 0.8 / F.px);
      for (const fx of opt.fugen) g.fillRect(fx - f / 2, y, f, h);
    }
  }
  /* Vorspringendes Band (Gesims, Sohlbank): Oberseite hell, Stirn, Schatten */
  function band(g, F, x0, x1, y, h, vor, c, saat) {
    const sv = F.schatten ? F.schatten(vor) : null;
    if (sv && sv[1] > 0) {
      g.fillStyle = "rgba(30,22,26,0.34)";
      g.beginPath(); g.moveTo(x0, y + h); g.lineTo(x1, y + h); g.lineTo(x1 + sv[0], y + h + sv[1]); g.lineTo(x0 + sv[0], y + h + sv[1]); g.closePath(); g.fill();
    } else {
      const gr = g.createLinearGradient(0, y + h, 0, y + h + 0.2); gr.addColorStop(0, "rgba(20,18,26,0.28)"); gr.addColorStop(1, "rgba(20,18,26,0)");
      g.fillStyle = gr; g.fillRect(x0, y + h, x1 - x0, 0.2);
    }
    g.fillStyle = rgb(hell(c, 0.18)); g.fillRect(x0, y, x1 - x0, h * 0.3);
    g.fillStyle = rgb(c); g.fillRect(x0, y + h * 0.3, x1 - x0, h * 0.52);
    g.fillStyle = rgb(hell(c, -0.3)); g.fillRect(x0, y + h * 0.82, x1 - x0, h * 0.18);
    if (F.px > 12) rausch(g, x0, y, x1 - x0, h, 0.8, 0.22, saat, 3);
    if (F.px * 1.1 > 7) {
      g.fillStyle = rgb(hell(c, -0.4), 0.5);
      for (let x = x0 + 0.9 + hash(saat, 3, 1) * 0.4; x < x1 - 0.1; x += 0.9 + hash(Math.round(x * 10), saat, 2) * 0.5) g.fillRect(x, y, Math.max(0.008, 0.7 / F.px), h);
    }
  }
  /* weiche Schneekante auf einem Sims (Oberkante bei y) */
  function schneeKante(g, x0, x1, y, dick, saat, F) {
    g.fillStyle = rgb(SCHNEE);
    g.beginPath(); g.moveTo(x0 - 0.01, y + 0.012);
    const st = 0.09;
    for (let x = x0; x <= x1 + st; x += st) g.lineTo(Math.min(x, x1 + 0.01), y - dick * (0.6 + 0.4 * hash(Math.round(x * 11), saat, 1)));
    g.lineTo(x1 + 0.01, y + 0.012); g.closePath(); g.fill();
    /* Schattenseite der Wulst */
    g.fillStyle = "rgba(150,170,205,0.35)"; g.fillRect(x0, y - dick * 0.25, x1 - x0, dick * 0.25 + 0.01);
    if (F && F.px > 40) { g.fillStyle = "rgba(255,255,255,0.8)"; g.fillRect(x0, y - dick * 0.95, x1 - x0, Math.max(0.004, 0.6 / F.px)); }
  }

  /* =====================================================================
     BAUPHASEN
     XANDER: „Man soll das Fundament sehen beim Aufbauen … wie das nach
     2 Minuten aussieht, nach 5 … 10 … 15 Minuten, bis es fertig ist."
       0,00–0,10  Baugrube (Schnurgerüst, Aushub, zwei Haufen)
       0,10–0,18  Fundamentmauern aus Feldstein wachsen in der Grube
       0,18–0,21  verfüllen, die Haufen schrumpfen
       0,20–0,27  Sandsteinsockel, Bodenplatte
       0,27–0,54  Backsteinmauern des Wachbaus Schicht für Schicht,
                  Torturm läuft mit und wächst bis 0,64 weiter
       0,54–0,56  Balkenlage (Dachboden)
       0,54–0,64  Treppengiebel Staffel für Staffel
       0,60–0,70  Dachstuhl: Sparrenpaare von West nach Ost
       0,64–0,70  Zinnenkranz des Turms
       0,70–0,74  Lattung; 0,74–0,86 Biberschwänze von der Traufe zum First
       0,72–0,84  Schornstein
       0,88–1,00  Fenster, Tor, Laternen, Schilderhaus, Kanone, Fahne;
                  Winter: Schnee wächst 0,88–0,98
     ===================================================================== */
  function zustand(bau) {
    const f = (a, b) => klemm((bau - a) / (b - a), 0, 1);
    const Z = { bau: bau, fertig: bau >= 0.999 };
    Z.grube = bau < 0.2;
    Z.tiefe = f(0.004, 0.06);
    Z.schnur = bau < 0.12;
    Z.fund = f(0.1, 0.18);
    Z.haufen = bau < 0.18 ? f(0.004, 0.07) : bau < 0.21 ? 1 - 0.75 * f(0.18, 0.21) : bau < 0.3 ? 0.25 * (1 - f(0.26, 0.3)) : 0;
    Z.sockel = f(0.2, 0.27);
    Z.platte = bau >= 0.25;
    Z.hausZ = Z_SO + (Z_TR - Z_SO) * f(0.27, 0.54);
    Z.turmZ = Z_SO + (Z_TT - Z_SO) * f(0.27, 0.64);
    Z.balken = bau >= 0.54;
    Z.giebel = f(0.54, 0.64);
    Z.zinnen = f(0.64, 0.7);
    Z.sparren = f(0.6, 0.7);
    Z.latten = f(0.7, 0.74);
    Z.ziegel = f(0.74, 0.86);
    Z.dachZu = bau >= 0.86;
    Z.kamin = f(0.72, 0.84);
    Z.fenster = bau >= 0.88;
    Z.tor = bau >= 0.9;
    Z.gitter = bau >= 0.91;
    Z.laterne = bau >= 0.93;
    Z.wachhaus = bau >= 0.94;
    Z.kanone = bau >= 0.96;
    Z.fahne = bau >= 0.985;
    Z.posten = Z.fertig;
    Z.schnee = Z.fertig ? 1 : f(0.88, 0.98);
    Z.licht = Z.fertig;
    return Z;
  }

  /* =====================================================================
     ÖFFNUNGEN
     op = { x (Mitte entlang der Wand), z0, z1, w, art, gitter, licht, bogen }
     K = Wandzustand { top, Z, V, schnee, winter, herbst }
     ===================================================================== */
  /* Laibung: sichtbare Seiten der Öffnung (Tiefe d) mit eigenem Licht */
  function laibung(g, F, x0, y0, x1, y1, d, c) {
    const S = sicht(F), [ox, oy] = S.tief(d);
    g.fillStyle = rgb(c); g.fillRect(x0, y0, x1 - x0, y1 - y0);
    if (oy < 0) { g.fillStyle = rgb(mal(c, S.rel([0, 0, 1]))); vieleck(g, [[x0, y1], [x1, y1], [x1 + ox, y1 + oy], [x0 + ox, y1 + oy]]); g.fill(); }
    else if (oy > 0) { g.fillStyle = rgb(mal(hell(c, -0.2), S.rel([0, 0, -1]))); vieleck(g, [[x0, y0], [x1, y0], [x1 + ox, y0 + oy], [x0 + ox, y0 + oy]]); g.fill(); }
    if (ox > 0) { g.fillStyle = rgb(mal(c, S.rel(S.u))); vieleck(g, [[x0, y0], [x0 + ox, y0 + oy], [x0 + ox, y1 + oy], [x0, y1]]); g.fill(); }
    else if (ox < 0) { g.fillStyle = rgb(mal(c, S.rel(mul(S.u, -1)))); vieleck(g, [[x1, y0], [x1 + ox, y0 + oy], [x1 + ox, y1 + oy], [x1, y1]]); g.fill(); }
    return [ox, oy];
  }
  /* Eisengitter vor einem Fenster (Stäbe in Tiefe d) */
  function gitter(g, F, x0, y0, x1, y1, d, nacht) {
    const S = sicht(F), [ox, oy] = S.tief(d), px = F.px;
    const sb = Math.max(0.018, 0.9 / px), ab = 0.13;
    const n = Math.max(2, Math.round((x1 - x0) / ab));
    const sv = F.schatten ? F.schatten(0.07) : null;
    const stab = (fn) => {
      for (let i = 1; i < n; i++) { const x = x0 + (x1 - x0) * i / n; fn(x - sb / 2, y0 - 0.02, sb, y1 - y0 + 0.04); }
      for (const t of [0.3, 0.72]) { const y = y0 + (y1 - y0) * t; fn(x0 - 0.01, y - sb * 0.7, x1 - x0 + 0.02, sb * 1.4); }
    };
    g.save(); g.beginPath(); g.rect(x0, y0, x1 - x0, y1 - y0); g.clip();
    if (sv && !nacht) { g.fillStyle = "rgba(10,10,20,0.35)"; stab((a, b, w, h) => g.fillRect(a + ox + sv[0] * 0.6, b + oy + sv[1] * 0.6, w, h)); }
    g.fillStyle = nacht ? "rgba(26,20,18,0.95)" : rgb(EISEN); stab((a, b, w, h) => g.fillRect(a + ox, b + oy, w, h));
    if (!nacht && px > 30) { g.fillStyle = "rgba(170,170,180,0.45)"; stab((a, b, w, h) => g.fillRect(a + ox, b + oy, Math.min(w, h) * 0.35 + (w > h ? w - Math.min(w, h) * 0.35 : 0), Math.min(w, h) * 0.35 + (h > w ? h - Math.min(w, h) * 0.35 : 0))); }
    g.restore();
  }
  /* Stichbogen aus hochkant gestellten Ziegeln (Rollschicht) über einer Öffnung */
  function stichbogen(g, F, cx, y, w, V, saat) {
    const sp = w + 0.14, st = 0.13, R = (sp * sp / 4 + st * st) / (2 * st), dick = 0.2;
    const my = y + R - st, a0 = Math.asin((sp / 2) / R);
    g.save();
    g.beginPath(); g.arc(cx, my, R + dick, -Math.PI / 2 - a0 - 0.02, -Math.PI / 2 + a0 + 0.02); g.arc(cx, my, R, -Math.PI / 2 + a0, -Math.PI / 2 - a0, true); g.closePath();
    g.fillStyle = rgb(misch(V.ziegel[0], MOERTEL, 0.1)); g.fill();
    if (F.px > 14) {
      const n = Math.round((R + dick / 2) * 2 * a0 / 0.1);
      for (let i = 0; i < n; i++) {
        const a = -Math.PI / 2 - a0 + 2 * a0 * (i + 0.5) / n, c = V.ziegel[(hash(i, saat, 4) * V.ziegel.length) | 0];
        g.strokeStyle = rgb(hell(c, (hash(i, saat, 6) - 0.5) * 0.2)); g.lineWidth = 0.075;
        g.beginPath(); g.moveTo(cx + Math.cos(a) * (R + 0.012), my + Math.sin(a) * (R + 0.012)); g.lineTo(cx + Math.cos(a) * (R + dick - 0.012), my + Math.sin(a) * (R + dick - 0.012)); g.stroke();
      }
    }
    g.restore();
  }
  /* Fenster: Sandsteingewände, Sohlbank, Stichbogen, Gitter */
  function fenster(g, F, K, op) {
    const top = K.top, x0 = op.x - op.w / 2, x1 = op.x + op.w / 2, y0 = top - op.z1, y1 = top - op.z0, h = y1 - y0;
    const gw = 0.1, saat = Math.round(op.x * 10 + op.z0 * 3);
    /* Gewände (Sandstein), oben durch den Bogen gerahmt */
    werkstein(g, F, x0 - gw, y0 - gw, op.w + 2 * gw, h + gw, saat, { fugen: [] });
    g.fillStyle = "rgba(60,40,30,0.25)"; g.fillRect(x0 - gw, y0 - gw, op.w + 2 * gw, Math.max(0.006, 0.8 / F.px));
    if (op.bogen !== false) stichbogen(g, F, op.x, y0 - gw, op.w + 2 * gw, K.V, saat);
    g.save(); g.beginPath(); g.rect(x0, y0, op.w, h); g.clip();
    const [ox, oy] = laibung(g, F, x0, y0, x1, y1, 0.3, hell(SAND, -0.08));
    if (!K.Z.fenster) {
      /* noch offen: dunkler Innenraum */
      g.fillStyle = "rgb(34,30,32)"; g.fillRect(x0 + ox, y0 + oy, op.w, h);
      g.fillStyle = "rgba(90,80,70,0.35)"; g.fillRect(x0 + ox, y1 + oy - 0.05, op.w, 0.05);
    } else {
      const [fx, fy] = sicht(F).tief(0.16);
      PI.fenster(g, x0 + fx, y0 + fy, op.w, h, F, { fluegel: op.w > 0.62 ? 2 : 1, sprossen: [1, op.w > 0.62 ? 3 : 4], bank: false, rahmen: "#e6e0d2", laibung: "#bfb09a", tiefe: 0.14, vorhang: op.vorhang !== false, rahmenBreite: 0.055 });
    }
    g.restore();
    if (op.gitter && K.Z.gitter) gitter(g, F, x0, y0, x1, y1, 0.08, false);
    /* Sohlbank */
    band(g, F, x0 - gw - 0.05, x1 + gw + 0.05, y1, 0.09, 0.07, hell(SAND, 0.02), saat + 3);
    if (K.schnee > 0) schneeKante(g, x0 - gw - 0.05, x1 + gw + 0.05, y1 + 0.005, 0.07 * K.schnee, saat, F);
    /* Regenspur unter der Sohlbank */
    const gr = g.createLinearGradient(0, y1 + 0.09, 0, y1 + 0.7);
    gr.addColorStop(0, "rgba(50,40,36,0.16)"); gr.addColorStop(1, "rgba(50,40,36,0)");
    g.fillStyle = gr; g.fillRect(x0, y1 + 0.09, op.w, 0.6);
  }
  function fensterNacht(g, F, K, op) {
    if (!op.licht || !K.Z.licht) return;
    const top = K.top, x0 = op.x - op.w / 2, y0 = top - op.z1, h = op.z1 - op.z0;
    const [fx, fy] = sicht(F).tief(0.16);
    g.save(); g.beginPath(); g.rect(x0, y0, op.w, h); g.clip();
    PI.fensterLicht(g, x0 + fx, y0 + fy, op.w, h, F, { an: op.licht, fluegel: op.w > 0.62 ? 2 : 1, sprossen: [1, op.w > 0.62 ? 3 : 4], rahmenBreite: 0.055, farbe: [255, 190, 112] });
    g.restore();
    if (op.gitter) gitter(g, F, x0, y0, x0 + op.w, y0 + h, 0.08, true);
  }
  /* Schießscharte (Schlitz mit Querschlitz, trichterförmig in Sandstein) */
  function scharte(g, F, K, op) {
    const top = K.top, cx = op.x, y0 = top - op.z1, y1 = top - op.z0, h = y1 - y0, saat = Math.round(cx * 10 + op.z0 * 7);
    werkstein(g, F, cx - 0.17, y0 - 0.08, 0.34, h + 0.16, saat, { fugen: [] });
    g.fillStyle = rgb(hell(SAND, -0.4), 0.7);
    const f = Math.max(0.008, 0.8 / F.px);
    g.fillRect(cx - 0.17, y0 + h * 0.3, 0.34, f); g.fillRect(cx - 0.17, y0 + h * 0.7, 0.34, f);
    /* Schlitz mit Laibung */
    const sw = 0.14;
    g.save(); vieleck(g, [[cx - sw / 2, y0], [cx + sw / 2, y0], [cx + sw / 2, y0 + h * 0.42], [cx + 0.17, y0 + h * 0.42], [cx + 0.17, y0 + h * 0.5], [cx + sw / 2, y0 + h * 0.5], [cx + sw / 2, y1], [cx - sw / 2, y1], [cx - sw / 2, y0 + h * 0.5], [cx - 0.17, y0 + h * 0.5], [cx - 0.17, y0 + h * 0.42], [cx - sw / 2, y0 + h * 0.42]]);
    g.fillStyle = rgb(hell(SAND, -0.25)); g.fill(); g.clip();
    const [ox, oy] = sicht(F).tief(0.4);
    g.fillStyle = "rgb(18,16,20)"; g.translate(ox * 0.5, oy * 0.5);
    vieleck(g, [[cx - sw / 2 + 0.015, y0], [cx + sw / 2 - 0.015, y0], [cx + sw / 2 - 0.015, y1], [cx - sw / 2 + 0.015, y1]]); g.fill();
    g.fillRect(cx - 0.15, y0 + h * 0.43, 0.3, h * 0.06);
    g.restore();
    if (K.schnee > 0) schneeKante(g, cx - 0.17, cx + 0.17, y1 + 0.08, 0.05 * K.schnee, saat, F);
  }
  /* Blendnische: spitzbogig, weiß geputzt, zurückliegend */
  function blende(g, F, cx, yU, w, hoehe, saat) {
    const S = sicht(F), r = w / 2, yK = yU - hoehe + w * 0.8;
    const pfad = (p, dx, dy) => {
      p.moveTo(cx - r + dx, yU + dy); p.lineTo(cx - r + dx, yK + dy);
      p.quadraticCurveTo(cx - r + dx, yK - w * 0.55 + dy, cx + dx, yK - w * 0.8 + dy);
      p.quadraticCurveTo(cx + r + dx, yK - w * 0.55 + dy, cx + r + dx, yK + dy);
      p.lineTo(cx + r + dx, yU + dy); p.closePath();
    };
    const [ox, oy] = S.tief(0.1);
    g.save();
    const a = new Path2D(); pfad(a, 0, 0);
    g.clip(a);
    /* Seitenwände der Nische: Backstein, im Schatten */
    g.fillStyle = rgb(hell(PUTZ_W, -0.38)); g.fill(a);
    const b = new Path2D(); pfad(b, ox, oy);
    const gr = g.createLinearGradient(0, yK - w, 0, yU);
    gr.addColorStop(0, rgb(hell(PUTZ_W, -0.06))); gr.addColorStop(1, rgb(PUTZ_W));
    g.fillStyle = gr; g.fill(b);
    if (F.px > 12) rausch(g, cx - r, yK - w, w, hoehe + w, 0.9, 0.22, saat, 3);
    /* Schatten des Nischenrands */
    const sv = F.schatten ? F.schatten(0.1) : null;
    if (sv) {
      g.fillStyle = "rgba(40,40,60,0.3)";
      const c = new Path2D(); c.rect(cx - r - 1, yK - w * 1.2, w + 2, hoehe + w * 2); pfad(c, sv[0], sv[1]);
      g.fill(c, "evenodd");
    }
    g.restore();
  }

  /* =====================================================================
     WANDMALER
     spec = { A0, top, oeff[], gurt, sockel, trauf, fries, extra(g,F,K), saat }
     ===================================================================== */
  function wandMaler(spec, K0) {
    const m = function (g, F) {
      const K = Object.assign({}, K0, { top: spec.top });
      const top = spec.top, w = F.w, h = F.h, saat = spec.saat || 1;
      backstein(g, F, -0.05, -0.05, w + 0.05, h + 0.05, spec.A0, top, K.V, saat);
      /* Rundbogenfries und Deutsches Band unter der Traufe */
      if (spec.fries && top >= spec.fries + 0.45) rundbogenfries(g, F, 0, w, top - spec.fries, K.V, saat);
      if (spec.trauf && top >= Z_TR - 0.01) traufband(g, F, 0, w, top - Z_TR, K.V, saat);
      if (spec.gurt && top > Z_GU + 0.02) {
        band(g, F, -0.02, w + 0.02, top - Z_GU, 0.2, 0.1, SAND, saat + 5);
        if (K.schnee > 0) schneeKante(g, -0.02, w + 0.02, top - Z_GU + 0.004, 0.08 * K.schnee, saat + 2, F);
      }
      for (const op of spec.oeff || []) {
        if (op.z0 > top) continue;
        if (op.art === "scharte") scharte(g, F, K, op);
        else if (op.art === "tor") tor(g, F, K, op);
        else if (op.art === "tuer") tuer(g, F, K, op);
        else fenster(g, F, K, op);
      }
      if (spec.extra) spec.extra(g, F, K);
      /* Sockel aus Sandstein mit Schräge */
      if (spec.sockel !== false) {
        const zs = Math.min(Z_SO, top);
        werkstein(g, F, -0.05, top - zs, w + 0.1, zs + 0.05, saat + 11, { fugen: sockelFugen(spec.A0, w) });
        if (top >= Z_SO) {
          g.fillStyle = rgb(hell(SAND, 0.22)); g.fillRect(-0.05, top - Z_SO, w + 0.1, 0.05);
          g.fillStyle = "rgba(40,30,30,0.35)"; g.fillRect(-0.05, top - Z_SO + 0.05, w + 0.1, 0.015);
        }
        /* Spritzwasser, im Herbst Laub am Fuß */
        const gr = g.createLinearGradient(0, h, 0, h - 0.8);
        gr.addColorStop(0, K.winter ? "rgba(70,70,80,0.28)" : "rgba(70,74,50,0.3)"); gr.addColorStop(1, "rgba(70,70,60,0)");
        g.fillStyle = gr; g.fillRect(-0.05, h - 0.8, w + 0.1, 0.8);
        if (K.schnee > 0 && top >= Z_SO) schneeKante(g, -0.05, w + 0.05, top - Z_SO + 0.004, 0.06 * K.schnee, saat + 7, F);
        if (K.herbst && top >= Z_SO) laubFuss(g, F, 0, w, h, saat);
        if (K.winter && K.Z.fertig) schneeWehe(g, F, 0, w, h, saat);
      }
      /* Kalkausblühungen, Regenspuren */
      if (F.px > 8) {
        PI.bleichen(g, 0, 0, w, h, 2.5, 0.07, saat);
      }
      /* Mauerkrone beim Bauen: frische Schicht heller, Mörtelreste */
      if (spec.bau && F.px > 6) {
        g.fillStyle = "rgba(235,228,214,0.35)"; g.fillRect(-0.05, 0, w + 0.1, 0.1);
      }
    };
    m.leuchten = wandLicht(spec, K0);
    return m;
  }
  /* Fensterlicht einer Wand (nur, wenn dort ein Fenster leuchtet) */
  function wandLicht(spec, K0) {
    if (!(spec.oeff || []).some((op) => op.licht) || !K0.Z.licht) return null;
    return function (g, F) {
      const K = Object.assign({}, K0, { top: spec.top });
      for (const op of spec.oeff) if (op.licht && op.z1 <= spec.top && op.art !== "tor" && op.art !== "scharte" && op.art !== "tuer") fensterNacht(g, F, K, op);
    };
  }
  function sockelFugen(A0, w) { const f = []; for (let x = Math.ceil(A0 / 0.95) * 0.95 - A0 + 0.3; x < w; x += 0.95) f.push(x); return f; }
  function laubFuss(g, F, x0, x1, h, saat) {
    const rng = ST.zufall(saat * 31 + 7), n = Math.round((x1 - x0) * 9);
    const farben = [[176, 92, 34], [198, 140, 48], [140, 60, 30], [120, 84, 40]];
    for (let i = 0; i < n; i++) {
      const x = x0 + rng() * (x1 - x0), y = h - rng() * rng() * 0.25, r = 0.03 + rng() * 0.03;
      g.fillStyle = rgb(farben[(rng() * 4) | 0]);
      g.beginPath(); g.ellipse(x, y, r, r * 0.55, rng() * 3, 0, Math.PI * 2); g.fill();
    }
  }
  function schneeWehe(g, F, x0, x1, h, saat) {
    g.fillStyle = rgb(SCHNEE);
    g.beginPath(); g.moveTo(x0 - 0.05, h + 0.05);
    for (let x = x0; x <= x1 + 0.2; x += 0.2) g.lineTo(Math.min(x, x1 + 0.05), h - 0.1 - 0.12 * hash(Math.round(x * 5), saat, 3));
    g.lineTo(x1 + 0.05, h + 0.05); g.closePath(); g.fill();
    const gr = g.createLinearGradient(0, h - 0.25, 0, h); gr.addColorStop(0, "rgba(160,180,215,0)"); gr.addColorStop(1, "rgba(160,180,215,0.35)");
    g.fillStyle = gr; g.fillRect(x0 - 0.05, h - 0.25, x1 - x0 + 0.1, 0.3);
  }
  /* Rundbogenfries: kleine Bögen auf Konsolsteinen, darüber eine Schicht vor */
  function rundbogenfries(g, F, x0, x1, y, V, saat) {
    if (F.px < 6) return;
    const ab = 0.42, r = 0.15, n = Math.floor((x1 - x0) / ab), off = x0 + ((x1 - x0) - n * ab) / 2;
    const sv = F.schatten ? F.schatten(0.06) : [0.02, 0.03];
    const hell0 = rgb(hell(V.ziegel[0], 0.08)), dunkel = "rgba(40,24,22,0.42)";
    /* Band über den Bögen */
    g.fillStyle = dunkel; g.fillRect(x0, y + 0.05 + (sv ? sv[1] : 0.02), x1 - x0, 0.03);
    g.fillStyle = hell0; g.fillRect(x0, y - 0.05, x1 - x0, 0.1);
    for (let i = 0; i <= n; i++) {
      const cx = off + i * ab;
      /* Konsolstein */
      g.fillStyle = rgb(hell(V.ziegel[1], -0.05)); g.fillRect(cx - 0.05, y + 0.05, 0.1, r + 0.16);
      g.fillStyle = dunkel; g.fillRect(cx - 0.05 + (sv ? sv[0] : 0), y + 0.05 + r + 0.16, 0.1, 0.03);
      if (i < n) {
        const mx = cx + ab / 2;
        g.fillStyle = "rgba(40,24,22,0.25)";
        g.beginPath(); g.arc(mx, y + 0.05 + r, r, Math.PI, 0); g.lineTo(mx + r, y + 0.05 + r + 0.1); g.lineTo(mx - r, y + 0.05 + r + 0.1); g.closePath(); g.fill();
        g.strokeStyle = hell0; g.lineWidth = 0.07;
        g.beginPath(); g.arc(mx, y + 0.05 + r, r + 0.035, Math.PI, 0); g.stroke();
      }
    }
  }
  /* Traufband: Deutsches Band (übereck gestellte Ziegel) und Gesims */
  function traufband(g, F, x0, x1, y, V, saat) {
    if (F.px < 5) return;
    const yb = y + 0.34, hb = 0.1;
    g.fillStyle = "rgba(40,24,20,0.45)"; g.fillRect(x0, yb, x1 - x0, hb);
    const c1 = hell(V.ziegel[0], 0.06), c2 = hell(V.ziegel[0], -0.28);
    for (let x = x0; x < x1; x += 0.15) {
      g.fillStyle = rgb(c1); vieleck(g, [[x, yb], [x + 0.15, yb], [x, yb + hb]]); g.fill();
      g.fillStyle = rgb(c2); vieleck(g, [[x + 0.15, yb], [x + 0.15, yb + hb], [x, yb + hb]]); g.fill();
    }
    /* Gesimsschichten */
    band(g, F, x0, x1, y + 0.02, 0.12, 0.06, hell(V.ziegel[2], 0.04), saat);
    band(g, F, x0, x1, y + 0.18, 0.1, 0.03, hell(V.ziegel[0], 0.02), saat + 1);
  }

  /* =====================================================================
     TOR: rundbogig, Sandsteingewände, eisenbeschlagene Eichenflügel
     ===================================================================== */
  function torPfad(p, x0, x1, yB, yK) {
    const r = (x1 - x0) / 2;
    p.moveTo(x0, yB); p.lineTo(x0, yK); p.arc(x0 + r, yK, r, Math.PI, 0); p.lineTo(x1, yB); p.closePath();
  }
  function tor(g, F, K, op) {
    const top = K.top, S = sicht(F), px = F.px;
    const x0 = op.x - op.w / 2, x1 = op.x + op.w / 2, yB = top, yK = top - op.zk, r = op.w / 2, cx = op.x;
    const saat = 91;
    /* Gewände: Quader an den Pfosten, Keilsteine im Bogen, Schlussstein */
    const ring = 0.36;
    const q = [];
    let z = 0, i = 0;
    while (z < op.zk - 0.02) { const hq = Math.min(op.zk - z, i % 2 ? 0.34 : 0.42); q.push([z, hq, i % 2 ? 0.3 : 0.44]); z += hq; i++; }
    const sv = F.schatten ? F.schatten(0.04) : null;
    const stein = (pfad, c) => {
      if (sv) { g.save(); g.translate(sv[0], sv[1]); g.fillStyle = "rgba(40,28,24,0.3)"; g.fill(pfad); g.restore(); }
      g.fillStyle = rgb(c); g.fill(pfad);
    };
    for (const [za, hq, bq] of q) for (const s of [-1, 1]) {
      const p = new Path2D(), xa = s < 0 ? x0 - bq : x1;
      p.rect(xa + 0.008, yB - za - hq + 0.008, bq - 0.016, hq - 0.016);
      stein(p, hell(SAND, (hash(za * 10, s, 3) - 0.5) * 0.12));
    }
    const nK = 13;
    for (let k = 0; k < nK; k++) {
      const a0 = Math.PI + Math.PI * k / nK, a1 = Math.PI + Math.PI * (k + 1) / nK, schl = k === (nK - 1) / 2;
      const ra = r + (schl ? ring + 0.1 : ring), p = new Path2D();
      p.arc(cx, yK, r + 0.006, a0 + 0.004, a1 - 0.004); p.arc(cx, yK, ra, a1 - 0.004, a0 + 0.004, true); p.closePath();
      stein(p, hell(SAND, schl ? 0.1 : (hash(k, 5, 3) - 0.5) * 0.12));
    }
    if (px > 10) rausch(g, x0 - 0.5, yK - r - 0.6, op.w + 1, op.zk + r + 0.7, 0.7, 0.2, saat, 3);
    /* Öffnung: Laibung, dahinter die Flügel */
    const ob = new Path2D(); torPfad(ob, x0, x1, yB, yK);
    g.save(); g.clip(ob);
    const d = 0.5, [ox, oy] = S.tief(d);
    g.fillStyle = rgb(mal(hell(SAND, -0.12), S.rel([0, 0, -1]))); g.fill(ob);
    /* Leibung der Pfosten: die sichtbare Seite */
    if (ox > 0) { g.fillStyle = rgb(mal(hell(SAND, -0.05), S.rel(S.u))); g.fillRect(x0, yK - r, ox, op.zk + r + 1); }
    else { g.fillStyle = rgb(mal(hell(SAND, -0.05), S.rel(mul(S.u, -1)))); g.fillRect(x1 + ox, yK - r, -ox, op.zk + r + 1); }
    g.save(); g.translate(ox, oy);
    const fl = new Path2D(); torPfad(fl, x0, x1, yB + 0.1, yK);
    g.clip(fl);
    if (K.Z.tor) torFluegel(g, F, K, x0, x1, yB, yK, r);
    else { g.fillStyle = "rgb(30,27,28)"; g.fill(fl); }
    g.restore();
    /* Schatten des Bogens in der Laibung */
    const sv2 = F.schatten ? F.schatten(d) : null;
    g.fillStyle = "rgba(16,14,24,0.45)";
    const sp = new Path2D(); sp.rect(x0 - 1, yK - r - 1, op.w + 2, op.zk + r + 2);
    if (sv2) { torPfad(sp, x0 + sv2[0], x1 + sv2[0], yB + sv2[1] + 1, yK + sv2[1]); g.fill(sp, "evenodd"); }
    else { g.fillStyle = "rgba(16,14,24,0.3)"; g.fill(ob); }
    g.restore();
    /* Schwelle und Prellsteine */
    werkstein(g, F, x0 - 0.1, yB - 0.1, op.w + 0.2, 0.12, saat + 2);
    for (const s of [-1, 1]) {
      const px0 = s < 0 ? x0 - 0.02 : x1 + 0.02;
      g.fillStyle = rgb(hell(SAND, -0.1));
      g.beginPath(); g.moveTo(px0, yB); g.quadraticCurveTo(px0 - s * 0.2, yB - 0.02, px0 - s * 0.02, yB - 0.55); g.lineTo(px0, yB - 0.55); g.closePath(); g.fill();
    }
    /* Schlussstein: Wappenschild */
    if (px > 18) {
      const wy = yK - r - ring - 0.02;
      g.fillStyle = rgb([176, 40, 36]);
      g.beginPath(); g.moveTo(cx - 0.09, wy - 0.02); g.lineTo(cx + 0.09, wy - 0.02); g.lineTo(cx + 0.09, wy + 0.1); g.quadraticCurveTo(cx, wy + 0.2, cx - 0.09, wy + 0.1); g.closePath(); g.fill();
      g.fillStyle = "#eee8dc"; g.fillRect(cx - 0.09, wy + 0.04, 0.18, 0.04);
    }
    if (K.schnee > 0) schneeKante(g, x0 - 0.1, x1 + 0.1, yB - 0.1, 0.05 * K.schnee, 17, F);
  }
  function torFluegel(g, F, K, x0, x1, yB, yK, r) {
    const px = F.px, c = K.V.tor, w = x1 - x0, cx = (x0 + x1) / 2;
    const nB = 12;
    for (let i = 0; i < nB; i++) {
      const bx = x0 + w * i / nB, cc = hell(c, (hash(i, 3, 9) - 0.5) * 0.16);
      const gr = g.createLinearGradient(bx, 0, bx + w / nB, 0);
      gr.addColorStop(0, rgb(hell(cc, 0.08))); gr.addColorStop(0.85, rgb(cc)); gr.addColorStop(1, rgb(hell(cc, -0.3)));
      g.fillStyle = gr; g.fillRect(bx, yK - r - 0.1, w / nB + 0.002, yB - yK + r + 0.3);
    }
    if (px > 12) rausch(g, x0, yK - r, w, yB - yK + r, 0.6, 0.3, 12, 3);
    /* Mittelfuge der Flügel */
    g.fillStyle = "rgba(10,8,8,0.8)"; g.fillRect(cx - 0.015, yK - r, 0.03, yB - yK + r);
    /* Schlupfpforte im rechten Flügel */
    const sx = cx + 0.22, sw = 0.66, sh = 1.72;
    g.strokeStyle = "rgba(14,10,8,0.85)"; g.lineWidth = Math.max(0.012, 0.9 / px);
    g.strokeRect(sx, yB - sh - 0.08, sw, sh);
    /* Eisenbänder mit Nagelköpfen */
    const baender = [yB - 0.45, yB - 1.35, yB - 2.1, yK - r * 0.35];
    for (const by of baender) {
      for (const s of [-1, 1]) {
        const xa = s < 0 ? x0 : cx + 0.03, xb = s < 0 ? cx - 0.03 : x1;
        g.fillStyle = "rgba(0,0,0,0.35)"; g.fillRect(xa, by + 0.035, xb - xa, 0.02);
        g.fillStyle = rgb(EISEN); g.fillRect(xa, by - 0.035, xb - xa, 0.07);
        /* Zierende: Lilienform zur Mitte */
        const ex = s < 0 ? xb - 0.02 : xa + 0.02;
        g.beginPath(); g.arc(ex, by, 0.07, 0, Math.PI * 2); g.fill();
        if (px > 24) {
          g.fillStyle = "rgba(160,160,170,0.5)"; g.fillRect(xa, by - 0.035, xb - xa, 0.012);
          g.fillStyle = "#1b1a1c";
          for (let x = xa + 0.1; x < xb - 0.05; x += 0.2) { g.beginPath(); g.arc(x, by, 0.014, 0, Math.PI * 2); g.fill(); }
        }
      }
    }
    /* Nagelraster auf den Flügeln */
    if (px > 40) {
      g.fillStyle = "rgba(20,18,18,0.8)";
      for (let y = yB - 0.2; y > yK - r * 0.7; y -= 0.3) for (let x = x0 + 0.1; x < x1; x += 0.2) { g.beginPath(); g.arc(x, y, 0.01, 0, Math.PI * 2); g.fill(); }
    }
    /* Zugringe */
    g.strokeStyle = rgb(EISEN); g.lineWidth = 0.028;
    for (const s of [-1, 1]) { g.beginPath(); g.arc(cx + s * 0.16, yB - 1.08, 0.09, 0, Math.PI * 2); g.stroke(); g.fillStyle = rgb(EISEN); g.beginPath(); g.arc(cx + s * 0.16, yB - 1.17, 0.035, 0, Math.PI * 2); g.fill(); }
    /* unten: Schmutz und Abrieb */
    const gr = g.createLinearGradient(0, yB, 0, yB - 0.6); gr.addColorStop(0, "rgba(30,26,20,0.45)"); gr.addColorStop(1, "rgba(30,26,20,0)");
    g.fillStyle = gr; g.fillRect(x0, yB - 0.6, w, 0.6);
  }
  /* Hintertür */
  function tuer(g, F, K, op) {
    const top = K.top, x0 = op.x - op.w / 2, y0 = top - op.z1, h = op.z1 - op.z0;
    if (!K.Z.tor) {
      werkstein(g, F, x0 - 0.12, y0 - 0.12, op.w + 0.24, h + 0.12, 33);
      g.save(); g.beginPath(); g.rect(x0, y0, op.w, h); g.clip();
      const [ox, oy] = laibung(g, F, x0, y0, x0 + op.w, y0 + h, 0.4, hell(SAND, -0.1));
      g.fillStyle = "rgb(30,27,28)"; g.fillRect(x0 + ox, y0 + oy, op.w, h);
      g.restore();
      return;
    }
    PI.tuer(g, x0, y0, op.w, h, F, { farbe: rgb(K.V.tor), gewaendeFarbe: rgb(SAND), bogen: false, stufe: true });
  }

  /* =====================================================================
     BAUGRUBE
     ===================================================================== */
  const GRUBE = [[-5.5, -4.9], [5.5, -4.9], [5.5, 1.7], [2.4, 1.7], [2.4, 3.9], [-2.4, 3.9], [-2.4, 1.7], [-5.5, 1.7]];
  const G_TIEF = 1.3;
  function lochClip(g, F) {
    const S = sicht(F), f = F.flaeche, n = S.n, E = S.E;
    const en = dot(E, n);
    if (Math.abs(en) < 1e-3) return false;
    g.beginPath();
    GRUBE.forEach(([x, y], i) => {
      const C = [x, y, 0], t = dot(sub(f.o, C), n) / en, P = add(C, mul(E, t)), d = sub(P, f.o);
      const a = dot(d, f.u), b = dot(d, f.v);
      if (i) g.lineTo(a, b); else g.moveTo(a, b);
    });
    g.closePath(); g.clip();
    return true;
  }
  /* Licht selbst auftragen (nur innerhalb der Grubenöffnung): sonst malt
     die Lichtschicht des Kerns außerhalb des Lochs eine helle Fläche */
  function lichtAuf(g, F, dunkel) {
    const lf = ST.lichtFaktor(F.n, F.zeit, 0, F.jahr), k = dunkel || 1;
    g.globalCompositeOperation = "multiply";
    g.fillStyle = "rgb(" + Math.round(lf[0] * 255 * k) + "," + Math.round(lf[1] * 255 * k) + "," + Math.round(lf[2] * 255 * k) + ")";
    g.fillRect(-1, -1, F.w + 2, F.h + 2);
    g.globalCompositeOperation = "source-over";
  }
  function erdeMaler(art, K) {
    return function (g, F) {
      g.save();
      if (!lochClip(g, F)) { g.restore(); return; }
      const w = F.w, h = F.h;
      if (art === "boden") {
        g.fillStyle = "rgb(104,84,64)"; g.fillRect(-0.2, -0.2, w + 0.4, h + 0.4);
        rausch(g, 0, 0, w, h, 1.6, 0.4, 5, 4);
        if (F.px > 10) rausch(g, 0, 0, w, h, 0.35, 0.25, 6, 3);
        /* Pfützen, Fußspuren */
        const rng = ST.zufall(77);
        for (let i = 0; i < 8; i++) { g.fillStyle = K.winter ? "rgba(210,220,236,0.5)" : "rgba(60,54,50,0.35)"; g.beginPath(); g.ellipse(rng() * w, rng() * h, 0.3 + rng() * 0.5, 0.15 + rng() * 0.2, rng() * 3, 0, Math.PI * 2); g.fill(); }
      } else {
        /* Erdschichten: Mutterboden, Lehm, Sand */
        const schichten = [[0, "rgb(70,54,40)"], [0.28, "rgb(128,96,62)"], [0.75, "rgb(150,122,82)"], [1.05, "rgb(120,100,76)"]];
        for (let i = 0; i < schichten.length; i++) {
          const ya = schichten[i][0], yb = i + 1 < schichten.length ? schichten[i + 1][0] : h + 0.2;
          g.fillStyle = schichten[i][1]; g.fillRect(-0.2, ya, w + 0.4, yb - ya + 0.02);
        }
        rausch(g, 0, 0, w, h, 1.1, 0.35, 8, 4);
        if (F.px > 12) {
          const rng = ST.zufall(Math.round(F.w * 100));
          for (let i = 0; i < w * 6; i++) { g.fillStyle = "rgba(180,170,150,0.5)"; g.beginPath(); g.ellipse(rng() * w, 0.3 + rng() * (h - 0.3), 0.03 + rng() * 0.05, 0.02 + rng() * 0.03, 0, 0, Math.PI * 2); g.fill(); }
        }
        if (K.winter) { g.fillStyle = rgb(SCHNEE); g.fillRect(-0.2, -0.05, w + 0.4, 0.09); }
        /* Tiefe: unten dunkler */
        const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "rgba(20,16,20,0)"); gr.addColorStop(1, "rgba(20,16,20,0.35)");
        g.fillStyle = gr; g.fillRect(-0.2, 0, w + 0.4, h + 0.2);
      }
      lichtAuf(g, F, art === "boden" ? 0.8 : 0.9);
      g.restore();
    };
  }
  function grubeBauen(M, Z, K) {
    const D = G_TIEF * Z.tiefe;
    if (D < 0.02) return;
    M.teil("grube", { mitte: [0, 0, -4], ebene: -5, schatten: false });
    const poly = GRUBE;
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], b = poly[(i + 1) % poly.length];
      wandFlaeche(M, "grube-" + i, a, b, -D, 0, erdeMaler("wand", K), { keinAo: true, ao: false, keinLicht: true });
    }
    polyFlaeche(M, poly.map(([x, y]) => [x, y, -D]), [0, 0, 1], erdeMaler("boden", K), { name: "grubenboden", keinLicht: true });
    /* Fundamentmauern (Feldstein) wachsen aus der Grube */
    if (Z.fund > 0) {
      const zt = -D + (D + 0.02) * Z.fund;
      const ring = [
        [HX0 - 0.1, HYN - 0.1, HX1 + 0.1, HYN + 0.5], [HX0 - 0.1, HYS - 0.5, HX1 + 0.1, HYS + 0.1],
        [HX0 - 0.1, HYN + 0.5, HX0 + 0.5, HYS - 0.5], [HX1 - 0.5, HYN + 0.5, HX1 + 0.1, HYS - 0.5],
        [TX0 - 0.1, TYS - 0.5, TX1 + 0.1, TYS + 0.1], [TX0 - 0.1, TYN + 0.1, TX0 + 0.5, TYS - 0.5], [TX1 - 0.5, TYN + 0.1, TX1 + 0.1, TYS - 0.5]
      ];
      M.teil("fundament", { mitte: [0, 0, -2], ebene: -4, schatten: false });
      const fm = (g, F) => { g.save(); if (lochClip(g, F)) { feldstein(g, F); lichtAuf(g, F, 0.85); } g.restore(); };
      for (const [x0, y0, x1, y1] of ring) M.quader({ x: x0, y: y0, z: -D, b: x1 - x0, t: y1 - y0, h: zt + D }, { sued: fm, nord: fm, ost: fm, west: fm, oben: fm }, { keinAo: true, keinLicht: true });
    }
  }
  function feldstein(g, F) {
    const w = F.w, h = F.h;
    g.fillStyle = "rgb(120,114,104)"; g.fillRect(-0.1, -0.1, w + 0.2, h + 0.2);
    if (F.px > 6) {
      const rng = ST.zufall(Math.round(w * 97 + h * 13));
      const n = Math.min(400, Math.round(w * h * 14));
      for (let i = 0; i < n; i++) {
        const x = rng() * w, y = rng() * h, r = 0.08 + rng() * 0.12, c = [[140, 132, 120], [116, 110, 104], [150, 138, 118], [104, 100, 96]][(rng() * 4) | 0];
        g.fillStyle = rgb(c); g.beginPath(); g.ellipse(x, y, r, r * (0.6 + rng() * 0.3), rng() * 3, 0, Math.PI * 2); g.fill();
      }
    }
    rausch(g, 0, 0, w, h, 1, 0.25, 9, 3);
  }
  /* Aushubhaufen */
  function haufen(M, x, y, r, hh, K, saat) {
    M.figur({
      x: x, y: y, z: 0, breite: r * 2.2, hoehe: hh,
      malen(g, s, F) {
        const rx = r * s, ry = r * s * 0.5, H = hh * ST.KZ * s;
        const rng = ST.zufall(saat);
        const umriss = () => {
          g.beginPath(); g.moveTo(-rx, 0);
          const n = 14;
          for (let i = 1; i < n; i++) { const t = i / n, a = Math.PI * (1 - t); const k = Math.pow(Math.sin(Math.PI * t), 0.8); g.lineTo(Math.cos(a) * rx * (0.95 + 0.08 * hash(i, saat, 1)), -H * k * (0.9 + 0.15 * hash(i, saat, 2)) + ry * 0.2 * (1 - k)); }
          g.lineTo(rx, 0); g.ellipse(0, 0, rx, ry, 0, 0, Math.PI); g.closePath();
        };
        if (F.schatten) { g.fillStyle = "#000"; umriss(); g.fill(); return; }
        const Zl = F.Z, L = ST.lichtFaktor([-0.5, 0.5, 0.7], Zl, 0, F.jahr), D = ST.lichtFaktor([0.6, 0.3, 0.5], Zl, 0, F.jahr);
        const erde = [124, 94, 64];
        const gr = g.createLinearGradient(-rx, -H, rx, ry);
        gr.addColorStop(0, rgb(mal(erde, L))); gr.addColorStop(1, rgb(mal(hell(erde, -0.25), D)));
        g.fillStyle = gr; umriss(); g.fill();
        g.save(); umriss(); g.clip();
        for (let i = 0; i < 40; i++) {
          const a = rng() * Math.PI, rr = rng();
          const x = Math.cos(a) * rx * rr * 0.9, yy = -H * (1 - rr) * rng() + ry * 0.3 * rng();
          g.fillStyle = rgb(mal(rng() < 0.5 ? [150, 140, 126] : [84, 64, 46], L), 0.8);
          g.beginPath(); g.ellipse(x, yy, s * 0.06 * (0.5 + rng()), s * 0.035 * (0.5 + rng()), 0, 0, Math.PI * 2); g.fill();
        }
        if (K.winter) {
          g.fillStyle = rgb(mal(SCHNEE, ST.lichtFaktor([0, 0, 1], Zl, 0, F.jahr)), 0.92);
          g.beginPath(); g.ellipse(0, -H * 0.72, rx * 0.72, H * 0.42, 0, 0, Math.PI * 2); g.fill();
        }
        g.restore();
      }
    });
  }

  /* =====================================================================
     DER WACHBAU
     ===================================================================== */
  /* Öffnungen je Wand (x entlang der Wand von links, von außen gesehen) */
  const OEFF = {
    sw: [{ x: 1.55, z0: 1.15, z1: 2.55, w: 0.7, gitter: true, licht: 1 }, { x: 1.55, z0: 3.95, z1: 5.3, w: 0.75, licht: 0 }],
    so: [{ x: 1.55, z0: 1.15, z1: 2.55, w: 0.7, gitter: true, licht: 0.9 }, { x: 1.55, z0: 3.95, z1: 5.3, w: 0.75, licht: 0.7 }],
    ost: [{ x: 1.5, z0: 1.15, z1: 2.55, w: 0.7, gitter: true }, { x: 4.1, z0: 1.15, z1: 2.55, w: 0.7, gitter: true }, { x: 1.5, z0: 3.95, z1: 5.3, w: 0.75 }, { x: 4.1, z0: 3.95, z1: 5.3, w: 0.75 }],
    west: [{ x: 1.5, z0: 1.15, z1: 2.55, w: 0.7, gitter: true }, { x: 4.1, z0: 1.15, z1: 2.55, w: 0.7, gitter: true }, { x: 1.5, z0: 3.95, z1: 5.3, w: 0.75 }, { x: 4.1, z0: 3.95, z1: 5.3, w: 0.75, licht: 0.5 }],
    nord: [{ x: 1.6, z0: 1.15, z1: 2.55, w: 0.7, gitter: true }, { x: 3.3, z0: 1.15, z1: 2.55, w: 0.7, gitter: true }, { x: 5.0, z0: Z_SO, z1: Z_SO + 2.15, w: 1.0, art: "tuer" }, { x: 6.7, z0: 1.15, z1: 2.55, w: 0.7, gitter: true }, { x: 8.4, z0: 1.15, z1: 2.55, w: 0.7, gitter: true },
      { x: 1.6, z0: 3.95, z1: 5.3, w: 0.75 }, { x: 3.3, z0: 3.95, z1: 5.3, w: 0.75 }, { x: 5.0, z0: 3.95, z1: 5.3, w: 0.75 }, { x: 6.7, z0: 3.95, z1: 5.3, w: 0.75, licht: 0.8 }, { x: 8.4, z0: 3.95, z1: 5.3, w: 0.75 }],
    tsued: [{ x: 1.9, z0: 0, zk: TOR.zk, w: TOR.w, art: "tor" }, { x: 1.62, z0: 5.1, z1: 6.45, w: 0.42, gitter: true, bogen: false, vorhang: false }, { x: 2.18, z0: 5.1, z1: 6.45, w: 0.42, gitter: true, bogen: false, vorhang: false }, { x: 1.9, z0: 7.7, z1: 8.9, w: 0.48, gitter: false, licht: 0 }],
    tost: [{ x: 1.1, z0: 4.3, z1: 5.3, art: "scharte" }, { x: 1.1, z0: 7.7, z1: 8.7, art: "scharte" }],
    twest: [{ x: 1.1, z0: 4.3, z1: 5.3, art: "scharte" }, { x: 1.1, z0: 7.7, z1: 8.7, art: "scharte" }],
    tnord: [{ x: 1.9, z0: 7.9, z1: 8.8, art: "scharte" }]
  };

  function wachbau(M, Z, K) {
    const top = Math.min(Z.hausZ, Z_TR);
    if (Z.sockel <= 0) return;
    const zOben = Z.sockel < 1 ? Z_SO * Z.sockel : top;
    const bau = zOben < Z_TR - 0.01;
    M.teil("wachbau", { mitte: [0, HYM, 3.2] });
    const spec = (A0, oeff, extra) => ({ A0: A0, top: zOben, oeff: oeff, gurt: true, trauf: true, fries: 6.0, bau: bau, saat: Math.round(A0 * 7 + 50), extra: extra });
    const opt = zOben >= Z_TR - 0.01 ? { traufe: UE, traufeY: 0 } : {};
    const optG = {};   // Giebelseiten: kein Traufschatten
    wandFlaeche(M, "wand-sw", [HX0, HYS], [TX0, HYS], 0, zOben, wandMaler(spec(HX0, OEFF.sw), K), opt);
    wandFlaeche(M, "wand-so", [TX1, HYS], [HX1, HYS], 0, zOben, wandMaler(spec(TX1, OEFF.so), K), opt);
    wandFlaeche(M, "wand-ost", [HX1, HYS], [HX1, HYN], 0, zOben, wandMaler(Object.assign(spec(10, OEFF.ost), { trauf: false, fries: 0 }), K), optG);
    wandFlaeche(M, "wand-nord", [HX1, HYN], [HX0, HYN], 0, zOben, wandMaler(spec(15.6, OEFF.nord), K), opt);
    wandFlaeche(M, "wand-west", [HX0, HYN], [HX0, HYS], 0, zOben, wandMaler(Object.assign(spec(25.6, OEFF.west), { trauf: false, fries: 0 }), K), optG);
    /* Innen, solange der Bau offen ist: Mauerkrone, Innenseiten, Boden */
    if (!Z.balken) {
      const xi0 = HX0 + WD, xi1 = HX1 - WD, yi0 = HYN + WD, yi1 = HYS - WD;
      const innen = (A0) => (g, F) => { backstein(g, F, -0.05, -0.05, F.w + 0.05, F.h + 0.05, A0, zOben, K.V, 3); g.fillStyle = "rgba(30,20,20,0.22)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); };
      const zu = Z_SO;
      if (zOben > zu + 0.02) {
        wandFlaeche(M, "innen-n", [xi0, yi0], [xi1, yi0], zu, zOben, innen(1));
        wandFlaeche(M, "innen-o", [xi1, yi0], [xi1, yi1], zu, zOben, innen(2));
        wandFlaeche(M, "innen-w", [xi0, yi1], [xi0, yi0], zu, zOben, innen(3));
        wandFlaeche(M, "innen-s", [xi1, yi1], [xi0, yi1], zu, zOben, innen(4));
      }
      const krone = (g, F) => { g.fillStyle = rgb(zOben > Z_SO + 0.01 ? hell(K.V.ziegel[0], 0.05) : SAND); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); if (F.px > 8) rausch(g, 0, 0, F.w, F.h, 0.5, 0.3, 4, 3); if (zOben > Z_SO + 0.01) { g.fillStyle = "rgba(236,230,216,0.5)"; g.fillRect(0, 0, F.w, F.h * 0.3); } };
      deckel(M, "krone-n", HX0, HYN, HX1, yi0, zOben, krone);
      deckel(M, "krone-s", HX0, yi1, HX1, HYS, zOben, krone);
      deckel(M, "krone-w", HX0, yi0, xi0, yi1, zOben, krone);
      deckel(M, "krone-o", xi1, yi0, HX1, yi1, zOben, krone);
      if (Z.platte && zOben > Z_SO + 0.01) deckel(M, "boden", xi0, yi0, xi1, yi1, Z_SO, (g, F) => { g.fillStyle = "rgb(168,160,150)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); rausch(g, 0, 0, F.w, F.h, 1.5, 0.3, 7, 3); if (K.winter) { g.fillStyle = "rgba(240,244,250,0.7)"; g.fillRect(0, 0, F.w, F.h); } });
    } else if (!Z.dachZu) {
      /* Dachboden aus Dielen, sichtbar durch den offenen Dachstuhl */
      deckel(M, "dachboden", HX0 + WD, HYN + WD, GX, HYS - WD, Z_TR - 0.02, (g, F) => dielen(g, F, K));
      const krone = (g, F) => { g.fillStyle = rgb(hell(K.V.ziegel[0], 0.05)); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); };
      deckel(M, "krone-n", HX0, HYN, HX1, HYN + WD, Z_TR, krone);
      deckel(M, "krone-s", HX0, HYS - WD, HX1, HYS, Z_TR, krone);
    }
  }
  function dielen(g, F, K) {
    const w = F.w, h = F.h;
    g.fillStyle = "rgb(176,138,96)"; g.fillRect(-0.1, -0.1, w + 0.2, h + 0.2);
    if (F.px > 8) {
      for (let x = 0; x < w; x += 0.22) { g.fillStyle = rgb(hell([176, 138, 96], (hash(Math.round(x * 10), 3, 1) - 0.5) * 0.2)); g.fillRect(x, 0, 0.21, h); g.fillStyle = "rgba(60,40,24,0.4)"; g.fillRect(x + 0.21, 0, 0.012, h); }
    }
    rausch(g, 0, 0, w, h, 1.2, 0.2, 11, 3);
    if (K.winter) { g.fillStyle = "rgba(242,246,252,0.55)"; g.fillRect(0, 0, w, h); }
  }

  /* =====================================================================
     TREPPENGIEBEL
     Staffeln so, dass jede Stufe gut 0,45 m über der Dachfläche endet;
     die Mitte krönt ein Pfeiler. Außen weiß geputzte Spitzbogenblenden.
     ===================================================================== */
  function giebelStufen() {
    const st = [];
    const b = (HALB - G_P) / G_N;
    for (let k = 0; k < G_N; k++) st.push({ a0: k * b, a1: (k + 1) * b, z: Z_TR + (k + 1) * b * NEIG + G_UEB });
    st.push({ a0: HALB - G_P, a1: HALB + G_P, z: Z_FI + G_UEB * 2 });
    for (let k = G_N - 1; k >= 0; k--) st.push({ a0: 2 * HALB - (k + 1) * b, a1: 2 * HALB - k * b, z: Z_TR + (k + 1) * b * NEIG + G_UEB });
    return st;
  }
  const STUFEN = giebelStufen();
  const Z_GT = Z_FI + G_UEB * 2;
  /* Umriss in (a = Abstand von der Südkante, z) */
  function giebelUmriss() {
    const p = [[0, Z_TR]];
    for (const s of STUFEN) { p.push([s.a0, s.z]); p.push([s.a1, s.z]); }
    p.push([2 * HALB, Z_TR]);
    /* gleiche Punkte zusammenfassen */
    return p.filter((q, i) => i === 0 || Math.abs(q[0] - p[i - 1][0]) > 1e-6 || Math.abs(q[1] - p[i - 1][1]) > 1e-6);
  }
  const G_UMRISS = giebelUmriss();
  function giebel(M, Z, K, ost) {
    const zNow = Z_TR + (Z_GT - Z_TR) * Z.giebel;
    if (Z.giebel <= 0) return;
    const xa = ost ? HX1 : HX0, xi = ost ? GX : -GX;
    M.teil(ost ? "giebel-ost" : "giebel-west", { mitte: [ost ? HX1 - 0.2 : HX0 + 0.2, HYM, 8.4] });
    /* Außenseite: Umriss in Flächenkoordinaten (a, zNow − z) */
    const um = (spiegel) => {
      let p = G_UMRISS.map(([a, z]) => [spiegel ? 2 * HALB - a : a, zNow - z]);
      p = kappen(p.map(([a, b]) => [a, b]), 0);
      return p;
    };
    const mA = giebelMaler(K, zNow, !ost, ost ? 10 : 25.6);
    /* Ost: u = −y (von Süd nach Nord), Flächen-a = HYS − y  → gleich wie Umriss.
       West: u = +y (von Nord nach Süd), a = y − HYN → gespiegelt */
    const oA = ost ? { o: [xa, HYS, zNow], u: [0, -1, 0] } : { o: [xa, HYN, zNow], u: [0, 1, 0] };
    const pa = um(!ost);
    if (pa.length >= 3) M.flaeche({ name: "giebel-aussen", o: oA.o, u: oA.u, v: [0, 0, -1], w: 2 * HALB, h: zNow - Z_TR, umriss: pa, malen: mA, leuchten: null });
    const oI = ost ? { o: [xi, HYN, zNow], u: [0, 1, 0] } : { o: [xi, HYS, zNow], u: [0, -1, 0] };
    const pi = um(ost);
    const mI = (g, F) => backstein(g, F, -0.05, -0.05, F.w + 0.05, F.h + 0.05, 3, zNow, K.V, 2);
    if (pi.length >= 3) M.flaeche({ name: "giebel-innen", o: oI.o, u: oI.u, v: [0, 0, -1], w: 2 * HALB, h: zNow - Z_TR, umriss: pi, malen: mI });
    /* Staffeln: Oberseiten (Abdeckung) und Stirnen */
    const x0 = Math.min(xa, xi), x1 = Math.max(xa, xi);
    const deck = (g, F) => {
      g.fillStyle = rgb(hell(SAND, 0.05)); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
      if (F.px > 10) rausch(g, 0, 0, F.w, F.h, 0.5, 0.25, 5, 3);
      if (K.schnee > 0) { g.fillStyle = rgb(SCHNEE, 0.4 + 0.58 * K.schnee); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); }
    };
    const stirn = (g, F) => { backstein(g, F, -0.05, -0.05, F.w + 0.05, F.h + 0.05, 7, F.flaeche.o[2], K.V, 1); g.fillStyle = rgb(SAND); g.fillRect(-0.1, -0.02, F.w + 0.2, 0.08); if (K.schnee > 0) schneeKante(g, -0.05, F.w + 0.05, 0, 0.08 * K.schnee, 3, F); };
    let zVor = Z_TR;
    for (let i = 0; i < STUFEN.length; i++) {
      const s = STUFEN[i];
      const yS = HYS - s.a0, yN = HYS - s.a1;       // Süd- und Nordkante der Staffel
      const zs = Math.min(s.z, zNow);
      if (zs > Z_TR) {
        if (s.z <= zNow + 1e-6) deckel(M, "staffel-" + i, x0, yN, x1, yS, s.z, deck, { ebene: 1 });
        /* Stirn nach Süden (steigt von der vorigen Staffel auf) bzw. nach Norden */
        const zNach = i + 1 < STUFEN.length ? STUFEN[i + 1].z : Z_TR;
        if (s.z > zVor) { const za = zVor, zb = Math.min(s.z, zNow); if (zb > za) wandFlaeche(M, "stirn-s" + i, [x0, yS], [x1, yS], za, zb, stirn, { ao: false }); }
        if (s.z > zNach) { const za = zNach, zb = Math.min(s.z, zNow); if (zb > za) wandFlaeche(M, "stirn-n" + i, [x1, yN], [x0, yN], za, zb, stirn, { ao: false }); }
      }
      zVor = s.z;
    }
  }
  function giebelMaler(K, zNow, spiegel, A0) {
    return function (g, F) {
      const w = F.w, h = F.h;
      backstein(g, F, -0.05, -0.05, w + 0.05, h + 0.05, A0, zNow, K.V, 4);
      /* Blenden: je Staffel eine schmale, in der Mitte drei */
      const yU = zNow - (Z_TR + 0.45);
      for (const s of STUFEN) {
        const breit = s.a1 - s.a0 > 0.8;
        const oben = s.z - 0.5, a = (s.a0 + s.a1) / 2;
        if (oben - (Z_TR + 0.45) < 0.8) continue;
        if (breit) {
          blende(g, F, a - 0.28, yU, 0.24, oben - Z_TR - 0.45 - 0.35, 3);
          blende(g, F, a + 0.28, yU, 0.24, oben - Z_TR - 0.45 - 0.35, 4);
        } else blende(g, F, a, yU, 0.28, oben - Z_TR - 0.45, 5);
      }
      /* Luke im Dachboden (mittig, unten) */
      const lx = HALB - 0.35, ly = zNow - 7.9;
      if (zNow > 7.9) {
        werkstein(g, F, lx - 0.08, ly - 0.08, 0.86, 0.96, 12);
        g.save(); g.beginPath(); g.rect(lx, ly, 0.7, 0.8); g.clip();
        if (K.Z.fenster) {
          const nB = 5;
          for (let i = 0; i < nB; i++) { g.fillStyle = rgb(hell(K.V.tor, (hash(i, 7, 7) - 0.5) * 0.2)); g.fillRect(lx + 0.7 * i / nB, ly, 0.7 / nB + 0.002, 0.8); }
          g.fillStyle = rgb(EISEN); g.fillRect(lx, ly + 0.15, 0.5, 0.04); g.fillRect(lx, ly + 0.6, 0.5, 0.04);
        } else { g.fillStyle = "rgb(30,27,28)"; g.fillRect(lx, ly, 0.7, 0.8); }
        g.restore();
        band(g, F, lx - 0.12, lx + 0.82, ly + 0.8, 0.07, 0.05, SAND, 13);
        /* Aufzugsbalken mit Haken darüber */
        g.fillStyle = rgb(hell(EICHE, -0.1)); g.fillRect(lx + 0.27, ly - 0.28, 0.16, 0.14);
      }
      /* Rollschicht entlang der Staffeln */
      if (F.px > 8) {
        g.fillStyle = rgb(hell(K.V.ziegel[1], 0.05));
        for (const s of STUFEN) {
          const a0 = spiegel ? 2 * HALB - s.a1 : s.a0, y = zNow - s.z;
          if (y < -0.01) continue;
          g.fillRect(a0, y, s.a1 - s.a0, 0.1);
          g.fillStyle = "rgba(40,20,18,0.35)"; g.fillRect(a0, y + 0.1, s.a1 - s.a0, 0.02);
          g.fillStyle = rgb(hell(K.V.ziegel[1], 0.05));
        }
      }
      if (F.px > 8) PI.bleichen(g, 0, 0, w, h, 2.5, 0.07, 4);
    };
  }

  /* =====================================================================
     DACH: Biberschwanz, Dachstuhl beim Bauen
     ===================================================================== */
  function dach(M, Z, K) {
    if (Z.sparren <= 0) return;
    const lauf = HALB + UE, fall = lauf * NEIG, L = Math.hypot(lauf, fall);
    const zE = Z_TR - UE * NEIG;
    M.teil("dach", { mitte: [0, HYM, 8.3], schatten: Z.ziegel > 0.2 });
    const vS = nrm([0, lauf, -fall]), vN = nrm([0, -lauf, -fall]);
    const mS = dachMaler(K, Z, true), mN = dachMaler(K, Z, false);
    M.flaeche({ name: "dach-sued", o: [-GX, HYM, Z_FI], u: [1, 0, 0], v: vS, w: 2 * GX, h: L, malen: mS, keinLicht: !Z.dachZu && Z.ziegel < 1, dach: true });
    M.flaeche({ name: "dach-nord", o: [GX, HYM, Z_FI], u: [-1, 0, 0], v: vN, w: 2 * GX, h: L, malen: mN, keinLicht: !Z.dachZu && Z.ziegel < 1, dach: true });
    if (Z.latten > 0) {
      /* Traufbrett mit Rinne */
      const rin = (g, F) => { g.fillStyle = "rgb(92,70,52)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); if (Z.ziegel >= 1) { g.fillStyle = "rgb(120,124,126)"; g.fillRect(-0.1, 0, F.w + 0.2, F.h * 0.55); g.fillStyle = "rgba(255,255,255,0.3)"; g.fillRect(-0.1, 0.01, F.w + 0.2, 0.02); } if (K.schnee > 0 && Z.ziegel >= 1) { g.fillStyle = rgb(SCHNEE); g.fillRect(-0.1, -0.02, F.w + 0.2, 0.05); PI.eiszapfen(g, 0.2, F.w - 0.2, F.h, F, { laenge: 0.35 * K.schnee, saat: 5 }); } };
      wandFlaeche(M, "traufe-s", [-GX, HYS + UE], [GX, HYS + UE], zE - 0.16, zE, rin, { ao: false, keinAo: true });
      wandFlaeche(M, "traufe-n", [GX, HYN - UE], [-GX, HYN - UE], zE - 0.16, zE, rin, { ao: false, keinAo: true });
    }
  }
  function dachMaler(K, Z, sued) {
    return function (g, F) {
      const w = F.w, h = F.h, px = F.px;
      const offen = !Z.dachZu && Z.ziegel < 1;
      if (offen) {
        /* Dachstuhl: Sparren (Kanthölzer), Pfetten; Licht selbst gerechnet */
        const S = sicht(F);
        const lf = S.lf, holz = [168, 128, 86];
        const n = Math.round(w / 0.9);
        const bereit = Z.sparren;
        const sb = 0.14;
        const [ox, oy] = S.tief(0.16);
        const zieg = Z.ziegel, yZ = h * (1 - zieg);
        g.save();
        g.beginPath(); g.rect(-0.1, -0.1, w + 0.2, h + 0.2); g.clip();
        /* Ziegel von der Traufe her */
        if (zieg > 0) {
          g.save(); g.beginPath(); g.rect(-0.1, yZ, w + 0.2, h - yZ + 0.1); g.clip();
          biber(g, F, w, h, K.V.dach, sued ? 3 : 4);
          g.globalCompositeOperation = "multiply"; g.fillStyle = rgb(lf.map((v) => v * 255)); g.fillRect(-0.1, yZ, w + 0.2, h - yZ + 0.1);
          g.restore();
        }
        g.save(); g.beginPath(); g.rect(-0.1, -0.1, w + 0.2, yZ + 0.1); g.clip();
        for (let i = 0; i <= n; i++) {
          const x = w * i / n;
          if (i / n > bereit + 1e-6) break;
          const seite = mal(hell(holz, -0.25), lf);
          g.fillStyle = rgb(seite); g.fillRect(x - sb / 2 + ox, oy, sb, h);
          g.fillStyle = rgb(mal(holz, lf)); g.fillRect(x - sb / 2, 0, sb, h);
          if (px > 20) { g.fillStyle = "rgba(90,60,40,0.4)"; g.fillRect(x - sb / 2, 0, Math.max(0.01, 0.8 / px), h); }
        }
        /* Latten */
        if (Z.latten > 0) {
          const nl = Math.floor(h / 0.3);
          for (let k = 0; k < nl; k++) {
            const y = h - k * 0.3 - 0.1;
            if ((k + 1) / nl > Z.latten * 1.0001 && y < h) continue;
            g.fillStyle = rgb(mal(hell(holz, 0.08), lf)); g.fillRect(-0.05, y, w + 0.1, 0.05);
            g.fillStyle = rgb(mal(hell(holz, -0.3), lf)); g.fillRect(-0.05, y + 0.05, w + 0.1, 0.015);
          }
        }
        /* Firstpfette */
        g.fillStyle = rgb(mal(hell(holz, -0.1), lf)); g.fillRect(-0.05, 0, w + 0.1, 0.16);
        g.restore();
        g.restore();
        return;
      }
      /* Detailstufe nach der unverkürzten Richtung (entlang der Traufe) */
      biber(g, F, w, h, K.V.dach, sued ? 3 : 4);
      /* Alterung: Flechten, Ruß unterhalb des Schornsteins */
      if (px > 8) rausch(g, 0, 0, w, h, 2.2, 0.14, 6, 3);
      /* Firstziegel */
      const fz = 0.14;
      g.fillStyle = rgb(hell(hex(K.V.dach), -0.15)); g.fillRect(-0.1, 0, w + 0.2, fz);
      if (px * 0.3 > 4) for (let x = 0; x < w; x += 0.34) { g.fillStyle = "rgba(40,18,12,0.5)"; g.fillRect(x, 0, 0.02, fz); g.fillStyle = "rgba(255,210,190,0.15)"; g.fillRect(x + 0.03, 0.01, 0.28, 0.03); }
      if (K.schnee > 0) {
        g.save(); g.globalAlpha = Math.min(1, K.schnee * 1.1);
        PI.schneeDach(g, 0, 0.02, w, h - 0.02, F, { deck: 0.95 * K.schnee, saat: sued ? 11 : 12 });
        g.restore();
        /* Schneefanggitter an der Traufe */
        g.fillStyle = "rgba(60,60,64,0.8)"; g.fillRect(0, h - 0.62, w, 0.025);
      } else if (K.herbst && px > 8) {
        const rng = ST.zufall(sued ? 5 : 6);
        for (let i = 0; i < w * 8; i++) { g.fillStyle = rgb([[176, 92, 34], [198, 140, 48], [140, 60, 30]][(rng() * 3) | 0], 0.85); g.beginPath(); g.ellipse(rng() * w, h * (0.4 + rng() * 0.6), 0.04, 0.025, rng() * 3, 0, Math.PI * 2); g.fill(); }
      }
      /* dunkle Kante an der Traufe (Schatten der Rinne) */
      const gr = g.createLinearGradient(0, h - 0.25, 0, h); gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(1, "rgba(20,10,10,0.3)");
      g.fillStyle = gr; g.fillRect(-0.1, h - 0.25, w + 0.2, 0.25);
    };
  }
  /* Biberschwanz-Doppeldeckung: von der Traufe zum First gelegt, jede
     Reihe liegt mit ihren runden Enden auf der Reihe darunter und wirft
     einen feinen Schatten. Ziegel in Farbeimern (schnell). */
  function biber(g, F, w, h, farbe, saat) {
    const base = hex(farbe), zb = 0.18, zr = 0.15;
    const pxE = Math.max(F.px, Math.sqrt((F.pxU || F.px) * (F.pxV || F.px)));
    g.fillStyle = rgb(hell(base, -0.5)); g.fillRect(-0.1, -0.1, w + 0.2, h + 0.2);
    if (pxE * zr < 2.5) {
      for (let y = h; y > -zr; y -= zr) { g.fillStyle = rgb(hell(base, (hash(Math.round(y * 50), saat, 1) - 0.5) * 0.12)); g.fillRect(-0.1, y - zr * 0.85, w + 0.2, zr * 0.85); }
      rausch(g, 0, 0, w, h, 3, 0.2, saat, 3);
      return;
    }
    const nF = 6, eimer = [], schatten = new Path2D(), kante = new Path2D();
    for (let i = 0; i < nF; i++) eimer.push(new Path2D());
    const b = zb * 0.92, r = b / 2, lang = zr * 2.1;
    const nR = Math.ceil(h / zr) + 1;
    const fein = pxE * zb > 10;
    /* gemalt wird von oben nach unten je Reihe getrennt: erst Schatten
       aller Reihen, dann die Ziegel von der obersten zur untersten Reihe,
       so liegt jedes runde Ende sichtbar über der Reihe darunter */
    const reihen = [];
    for (let k = 0; k < nR; k++) {
      const yu = h - k * zr;                     // Unterkante (Spitze) dieser Reihe
      const vers = (k % 2) * zb / 2;
      const liste = [];
      for (let x = -zb + vers; x < w + zb; x += zb) liste.push(x + (zb - b) / 2);
      reihen.push({ yu: yu, liste: liste, k: k });
    }
    for (const R of reihen) {
      for (const x0 of R.liste) {
        const i = Math.round(x0 * 20) + 1000;
        let c = (hash(i, R.k, saat) * nF) | 0;
        const p = eimer[c], yu = R.yu, yo = yu - lang;
        p.moveTo(x0, yo); p.lineTo(x0, yu - r); p.arc(x0 + r, yu - r, r, Math.PI, 0, true); p.lineTo(x0 + b, yo); p.closePath();
        schatten.moveTo(x0 + 0.01, yu - r + 0.02); schatten.arc(x0 + r + 0.01, yu - r + 0.025, r, Math.PI, 0, true); schatten.lineTo(x0 + b + 0.01, yu - r); schatten.closePath();
        if (fein) { kante.moveTo(x0, yu - r); kante.arc(x0 + r, yu - r, r, Math.PI, 0, true); }
      }
    }
    /* Reihe für Reihe von oben: so verdeckt die untere Reihe nichts Falsches */
    g.fillStyle = "rgba(30,10,6,0.45)"; g.fill(schatten);
    for (let i = 0; i < nF; i++) {
      const c = hell(base, (i - 2.5) * 0.045 + (i === 5 ? -0.08 : 0));
      g.fillStyle = rgb(i === 4 ? misch(c, [120, 104, 70], 0.18) : c); g.fill(eimer[i]);
    }
    /* Wölbung und Schatten der Reihe darüber: Verlauf je Reihe */
    const cv = document.createElement("canvas"); cv.width = 4; cv.height = 32;
    const cg = cv.getContext("2d"), gr = cg.createLinearGradient(0, 0, 0, 32);
    gr.addColorStop(0, "rgba(20,8,4,0.42)"); gr.addColorStop(0.35, "rgba(20,8,4,0.08)"); gr.addColorStop(0.85, "rgba(255,230,210,0.06)"); gr.addColorStop(1, "rgba(20,8,4,0.12)");
    cg.fillStyle = gr; cg.fillRect(0, 0, 4, 32);
    const mu = g.createPattern(cv, "repeat");
    mu.setTransform(new DOMMatrix([1, 0, 0, zr / 32, 0, (h % zr) - zr]));
    g.fillStyle = mu; g.fillRect(-0.1, -0.1, w + 0.2, h + 0.2);
    if (fein) { g.strokeStyle = "rgba(40,14,8,0.45)"; g.lineWidth = Math.max(0.006, 0.7 / pxE); g.stroke(kante); }
    rausch(g, 0, 0, w, h, 3.5, 0.16, saat + 1, 4);
  }

  /* Schornstein auf der Nordseite nahe dem First */
  const KAMIN = { x: 2.6, y: -2.35, b: 0.62, t: 0.62 };
  function kamin(M, Z, K) {
    if (Z.kamin <= 0) return;
    const zDach = (y) => Z_TR + (HALB - Math.abs(y - HYM)) * NEIG;
    const x0 = KAMIN.x - KAMIN.b / 2, x1 = KAMIN.x + KAMIN.b / 2, y0 = KAMIN.y - KAMIN.t / 2, y1 = KAMIN.y + KAMIN.t / 2;
    const zU = zDach(y0) - 0.05, zO = lerp(zU + 0.3, Z_FI + 1.05, Z.kamin);
    M.teil("kamin", { mitte: [KAMIN.x, KAMIN.y, zO] });
    const km = (g, F) => {
      backstein(g, F, -0.05, -0.05, F.w + 0.05, F.h + 0.05, 1, zO, K.V, 1);
      if (Z.kamin >= 1) { band(g, F, -0.05, F.w + 0.05, 0.02, 0.1, 0.05, SAND, 3); g.fillStyle = "rgba(30,26,26,0.35)"; g.fillRect(-0.05, 0.12, F.w + 0.1, 0.3); }
    };
    /* Seiten folgen der Dachneigung unten */
    const seite = (name, p0, p1, zA, zB) => {
      const dx = p1[0] - p0[0], dy = p1[1] - p0[1], w = Math.hypot(dx, dy);
      M.flaeche({ name: name, o: [p0[0], p0[1], zO], u: [dx / w, dy / w, 0], v: [0, 0, -1], w: w, h: zO - Math.min(zA, zB), umriss: [[0, 0], [w, 0], [w, zO - zB], [0, zO - zA]], malen: km });
    };
    seite("kamin-s", [x0, y1], [x1, y1], zDach(y1), zDach(y1));
    seite("kamin-n", [x1, y0], [x0, y0], zU, zU);
    seite("kamin-o", [x1, y1], [x1, y0], zDach(y1), zU);
    seite("kamin-w", [x0, y0], [x0, y1], zU, zDach(y1));
    deckel(M, "kamin-oben", x0 - 0.04, y0 - 0.04, x1 + 0.04, y1 + 0.04, zO, (g, F) => {
      g.fillStyle = rgb(hell(SAND, 0.05)); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
      g.fillStyle = "rgb(24,20,20)"; g.fillRect(0.14, 0.14, F.w - 0.28, F.h - 0.28);
      if (K.schnee > 0) { g.fillStyle = rgb(SCHNEE); g.fillRect(-0.1, -0.1, F.w + 0.2, 0.14); g.fillRect(-0.1, -0.1, 0.14, F.h + 0.2); g.fillRect(F.w - 0.14, -0.1, 0.24, F.h + 0.2); g.fillRect(-0.1, F.h - 0.14, F.w + 0.2, 0.24); }
    });
    if (Z.fertig) M.rauchAus(KAMIN.x, KAMIN.y, zO + 0.05, 0.8);
  }

  /* =====================================================================
     TORTURM mit Zinnenkranz
     ===================================================================== */
  function turm(M, Z, K) {
    if (Z.sockel <= 0) return;
    const zO = Z.sockel < 1 ? Z_SO * Z.sockel : Math.min(Z.turmZ, Z_TT);
    const bau = zO < Z_TT - 0.01;
    M.teil("turm", { mitte: [0, (TYN + TYS) / 2, 7.0] });
    const spec = (A0, oeff, extra) => ({ A0: A0, top: zO, oeff: oeff, gurt: true, trauf: false, fries: 9.85, bau: bau, saat: Math.round(A0 * 5 + 20), extra: extra });
    const opt = zO >= Z_TT - 0.01 && Z.zinnen > 0 ? { traufe: PA + 0.05, traufeY: 0 } : {};
    wandFlaeche(M, "turm-sued", [TX0, TYS], [TX1, TYS], 0, zO, wandMaler(spec(TX0, OEFF.tsued, turmSuedExtra), K), opt);
    wandFlaeche(M, "turm-ost", [TX1, TYS], [TX1, TYN], 0, zO, wandMaler(spec(40, OEFF.tost), K), opt);
    wandFlaeche(M, "turm-west", [TX0, TYN], [TX0, TYS], 0, zO, wandMaler(spec(43, OEFF.twest), K), opt);
    if (zO > Z_TR - 0.6) wandFlaeche(M, "turm-nord", [TX1, TYN], [TX0, TYN], Z_TR - 0.6, zO, wandMaler(Object.assign(spec(47, OEFF.tnord), { sockel: false, gurt: false }), K), opt);
    /* nachts fallen die Laternen auf die Wand */
    if (bau && zO > Z_SO + 0.02) {
      const xi0 = TX0 + WD, xi1 = TX1 - WD, yi0 = TYN + WD, yi1 = TYS - WD;
      const innen = (A0) => (g, F) => { backstein(g, F, -0.05, -0.05, F.w + 0.05, F.h + 0.05, A0, zO, K.V, 3); g.fillStyle = "rgba(30,20,20,0.25)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); };
      wandFlaeche(M, "tinnen-n", [xi0, yi0], [xi1, yi0], Z_SO, zO, innen(1));
      wandFlaeche(M, "tinnen-o", [xi1, yi0], [xi1, yi1], Z_SO, zO, innen(2));
      wandFlaeche(M, "tinnen-w", [xi0, yi1], [xi0, yi0], Z_SO, zO, innen(3));
      wandFlaeche(M, "tinnen-s", [xi1, yi1], [xi0, yi1], Z_SO, zO, innen(4));
      const krone = (g, F) => { g.fillStyle = rgb(hell(K.V.ziegel[0], 0.05)); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); g.fillStyle = "rgba(236,230,216,0.45)"; g.fillRect(0, 0, F.w, F.h * 0.3); };
      deckel(M, "tkrone-n", TX0, TYN, TX1, yi0, zO, krone);
      deckel(M, "tkrone-s", TX0, yi1, TX1, TYS, zO, krone);
      deckel(M, "tkrone-w", TX0, yi0, xi0, yi1, zO, krone);
      deckel(M, "tkrone-o", xi1, yi0, TX1, yi1, zO, krone);
      deckel(M, "tboden", xi0, yi0, xi1, yi1, Z_SO, (g, F) => { g.fillStyle = "rgb(150,142,132)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); });
    }
    /* Laternen links und rechts des Tors */
    if (Z.laterne) for (const s of [-1, 1]) wandLaterne(M, s * 1.58, TYS, 3.05, K, Z);
  }
  function turmSuedExtra(g, F, K) {
    const top = K.top;
    /* Inschrifttafel über dem Tor */
    const ty = top - 4.35, tx = 1.9;
    if (top < 4.4) return;
    const tw = 2.0, th = 0.5;
    const sv = F.schatten ? F.schatten(0.06) : null;
    if (sv) { g.fillStyle = "rgba(30,20,20,0.3)"; g.fillRect(tx - tw / 2 + sv[0], ty + sv[1], tw, th); }
    werkstein(g, F, tx - tw / 2, ty, tw, th, 71);
    g.strokeStyle = rgb(hell(SAND, -0.3), 0.8); g.lineWidth = Math.max(0.012, 0.8 / F.px);
    g.strokeRect(tx - tw / 2 + 0.05, ty + 0.05, tw - 0.1, th - 0.1);
    if (F.px > 22) {
      g.fillStyle = "rgba(70,52,36,0.9)"; g.textAlign = "center"; g.textBaseline = "middle";
      g.font = "bold 0.2px Georgia, serif";
      g.fillText("STADTWACHE", tx, ty + th * 0.43);
      g.font = "0.09px Georgia, serif";
      g.fillText("ANNO " + K.V.jahr, tx, ty + th * 0.8);
    } else if (F.px > 8) { g.fillStyle = "rgba(90,70,50,0.45)"; g.fillRect(tx - 0.7, ty + 0.18, 1.4, 0.08); }
    band(g, F, tx - tw / 2 - 0.06, tx + tw / 2 + 0.06, ty + th, 0.07, 0.06, SAND, 72);
    if (K.schnee > 0) schneeKante(g, tx - tw / 2 - 0.06, tx + tw / 2 + 0.06, ty + th + 0.003, 0.06 * K.schnee, 5, F);
    /* Uhr? Nein – eine Wache hat den Stundenschlag der Kirche. */
  }
  /* Zinnenkranz: je Seite Außen- und Innenfläche mit Zinnenumriss, Deckel,
     Scharten-Laibungen; kragt um PA über die Turmmauer vor */
  function zinnen(M, Z, K) {
    if (Z.zinnen <= 0) return;
    const zNow = Z_TT + (Z_ZO - Z_TT) * Z.zinnen;
    M.teil("zinnen", { mitte: [0, (TYN + TYS) / 2, 11.0] });
    const X0 = TX0 - PA, X1 = TX1 + PA, Y0 = TYN - PA, Y1 = TYS + PA;
    const seiten = [
      { p0: [X0, Y1], p1: [X1, Y1], n: 5, A0: 0 },     // Süd
      { p0: [X1, Y1], p1: [X1, Y0], n: 3, A0: 5 },     // Ost
      { p0: [X1, Y0], p1: [X0, Y0], n: 5, A0: 9 },     // Nord
      { p0: [X0, Y0], p1: [X0, Y1], n: 3, A0: 14 }     // West
    ];
    const deckM = (g, F) => {
      g.fillStyle = rgb(hell(SAND, 0.04)); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
      if (F.px > 10) rausch(g, 0, 0, F.w, F.h, 0.5, 0.25, 6, 3);
      if (K.schnee > 0) { g.fillStyle = rgb(SCHNEE, 0.35 + 0.62 * K.schnee); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); }
    };
    for (const sd of seiten) {
      const dx = sd.p1[0] - sd.p0[0], dy = sd.p1[1] - sd.p0[1], L = Math.hypot(dx, dy), u = [dx / L, dy / L], nA = [-u[1], u[0]];
      /* Zinnen: n Zähne, n−1 Scharten */
      const m = 0.62, sch = (L - sd.n * m) / (sd.n - 1);
      const zaehne = [];
      for (let i = 0; i < sd.n; i++) zaehne.push([i * (m + sch), i * (m + sch) + m]);
      const umriss = (spiegel, laenge, versatz) => {
        const p = [[0, zNow - Z_TT]];
        const zs = Math.min(Z_ZS, zNow), zo = zNow;
        const pts = [];
        for (let i = 0; i < zaehne.length; i++) {
          let [a, b] = zaehne[i];
          a = Math.max(0, a - versatz); b = Math.min(laenge, b - versatz);
          pts.push([a, zo], [b, zo]);
          if (i + 1 < zaehne.length) { const a2 = Math.max(0, zaehne[i + 1][0] - versatz); pts.push([b, zs], [a2, zs]); }
        }
        let q = pts.map(([a, z]) => [spiegel ? laenge - a : a, zNow - z]);
        if (spiegel) q.reverse();
        return p.concat(q).concat([[laenge, zNow - Z_TT]]);
      };
      const hA = zNow - Z_TT;
      const aussen = (g, F) => {
        backstein(g, F, -0.05, -0.05, F.w + 0.05, F.h + 0.05, sd.A0, zNow, K.V, 5);
        /* Werksteinband am Fuß der Brüstung und Kragkante */
        band(g, F, -0.05, F.w + 0.05, zNow - Z_TT - 0.14, 0.14, 0.02, SAND, 9);
        /* Abdeckplatten auf Zinnen und Scharten */
        if (F.px > 6) {
          g.fillStyle = rgb(hell(SAND, 0.06));
          for (const [a, b] of zaehne) if (zNow >= Z_ZO - 0.01) g.fillRect(a - 0.02, 0, b - a + 0.04, 0.08);
          if (zNow >= Z_ZS) for (let i = 0; i + 1 < zaehne.length; i++) g.fillRect(zaehne[i][1], zNow - Z_ZS, zaehne[i + 1][0] - zaehne[i][1], 0.07);
        }
        if (K.schnee > 0) {
          for (const [a, b] of zaehne) if (zNow >= Z_ZO - 0.01) schneeKante(g, a - 0.02, b + 0.02, 0.005, 0.1 * K.schnee, Math.round(a * 10), F);
          for (let i = 0; i + 1 < zaehne.length; i++) schneeKante(g, zaehne[i][1], zaehne[i + 1][0], zNow - Z_ZS + 0.005, 0.08 * K.schnee, i + 40, F);
        }
      };
      const o = [sd.p0[0], sd.p0[1], zNow];
      M.flaeche({ name: "zinnen-a", o: o, u: [u[0], u[1], 0], v: [0, 0, -1], w: L, h: hA, umriss: umriss(false, L, 0), malen: aussen });
      /* Innenfläche (Wehrgang-Seite): läuft von p1' nach p0' */
      const t = PD, Li = L - 2 * t;
      const pi1 = [sd.p1[0] - nA[0] * t - u[0] * t, sd.p1[1] - nA[1] * t - u[1] * t];
      const innen = (g, F) => { backstein(g, F, -0.05, -0.05, F.w + 0.05, F.h + 0.05, sd.A0 + 3, zNow, K.V, 6); g.fillStyle = "rgba(30,20,24,0.12)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); if (K.schnee > 0) { for (const [a, b] of zaehne) if (zNow >= Z_ZO - 0.01) schneeKante(g, Li - (b - t) - 0.02, Li - (a - t) + 0.02, 0.005, 0.1 * K.schnee, Math.round(a * 10) + 3, F); } };
      const zI = Z_DECK;
      if (zNow > zI) {
        const um = umriss(true, Li, t).map(([a, b]) => [a, b]);
        const kap = kappen(um.map(([a, b]) => [a, b - (Z_TT - zI) * 0]), -1);
        const um2 = kap.map(([a, b]) => [a, Math.min(b, zNow - zI)]);
        M.flaeche({ name: "zinnen-i", o: [pi1[0], pi1[1], zNow], u: [-u[0], -u[1], 0], v: [0, 0, -1], w: Li, h: zNow - zI, umriss: um2, malen: innen });
      }
      /* Deckel der Zinnen und Scharten, Scharten-Seiten */
      for (let i = 0; i < zaehne.length; i++) {
        const [a, b] = zaehne[i];
        const qa = [sd.p0[0] + u[0] * a, sd.p0[1] + u[1] * a], qb = [sd.p0[0] + u[0] * b, sd.p0[1] + u[1] * b];
        const qai = [qa[0] - nA[0] * t, qa[1] - nA[1] * t], qbi = [qb[0] - nA[0] * t, qb[1] - nA[1] * t];
        if (zNow >= Z_ZO - 0.01) polyFlaeche(M, [[qa[0], qa[1], Z_ZO], [qb[0], qb[1], Z_ZO], [qbi[0], qbi[1], Z_ZO], [qai[0], qai[1], Z_ZO]], [0, 0, 1], deckM, { name: "zinne-d" + i, ebene: 1 });
        if (i + 1 < zaehne.length && zNow > Z_ZS) {
          const c = zaehne[i + 1][0];
          const qc = [sd.p0[0] + u[0] * c, sd.p0[1] + u[1] * c], qci = [qc[0] - nA[0] * t, qc[1] - nA[1] * t];
          polyFlaeche(M, [[qb[0], qb[1], Z_ZS], [qc[0], qc[1], Z_ZS], [qci[0], qci[1], Z_ZS], [qbi[0], qbi[1], Z_ZS]], [0, 0, 1], deckM, { name: "scharte-d" + i });
          const zz = Math.min(zNow, Z_ZO);
          const seitM = (g, F) => { backstein(g, F, -0.05, -0.05, F.w + 0.05, F.h + 0.05, 2, zz, K.V, 7); };
          /* Seite am Ende des Zahns (zeigt entlang +u), am Anfang des nächsten (−u) */
          polyFlaeche(M, [[qb[0], qb[1], zz], [qbi[0], qbi[1], zz], [qbi[0], qbi[1], Z_ZS], [qb[0], qb[1], Z_ZS]], [u[0], u[1], 0], seitM, { name: "scharte-s" + i });
          polyFlaeche(M, [[qci[0], qci[1], zz], [qc[0], qc[1], zz], [qc[0], qc[1], Z_ZS], [qci[0], qci[1], Z_ZS]], [-u[0], -u[1], 0], seitM, { name: "scharte-t" + i });
        }
      }
    }
    /* Unterseite der Auskragung ist unsichtbar; Wehrgang mit Luke */
    deckel(M, "wehrgang", X0 + PD, Y0 + PD, X1 - PD, Y1 - PD, Z_DECK, (g, F) => {
      g.fillStyle = "rgb(128,122,118)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
      if (F.px > 8) { g.strokeStyle = "rgba(60,56,54,0.6)"; g.lineWidth = Math.max(0.01, 0.8 / F.px); for (let x = 0.5; x < F.w; x += 0.5) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, F.h); g.stroke(); } for (let y = 0.5; y < F.h; y += 0.5) { g.beginPath(); g.moveTo(0, y); g.lineTo(F.w, y); g.stroke(); } }
      rausch(g, 0, 0, F.w, F.h, 1, 0.3, 8, 3);
      g.fillStyle = "rgb(84,62,44)"; g.fillRect(F.w - 0.9, F.h - 0.8, 0.6, 0.6);
      g.strokeStyle = rgb(EISEN); g.lineWidth = 0.03; g.strokeRect(F.w - 0.9, F.h - 0.8, 0.6, 0.6);
      if (K.schnee > 0) { g.fillStyle = rgb(SCHNEE, 0.5 + 0.48 * K.schnee); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); }
    }, { ebene: -1 });
    if (Z.fahne) fahne(M, K);
  }

  /* =====================================================================
     KLEINE DINGE als Figuren mit eigener 3D-Abbildung
     Die Figur bekommt F.gier: wir drehen jeden Punkt selbst und bilden ihn
     wie der Kern ab – so steht die Kanone in jedem Winkel richtig.
     ===================================================================== */
  function abbild(F, s) {
    const a = (F.gier || 0) * RAD, c = Math.cos(a), sn = Math.sin(a);
    const KX = ST.KX, KY = ST.KY, KZ = ST.KZ;
    return {
      c: c, s: sn,
      p: (x, y, z) => { const X = x * c - y * sn, Y = x * sn + y * c; return [(X - Y) * KX * s, (X + Y) * KY * s - z * KZ * s]; },
      tiefe: (x, y, z) => { const X = x * c - y * sn, Y = x * sn + y * c; return (X + Y) * 0.61 + z * 0.5; },
      licht: (n) => { const N = [n[0] * c - n[1] * sn, n[0] * sn + n[1] * c, n[2]]; return ST.lichtFaktor(nrm(N), F.Z, 0, F.jahr); },
      sicht: (n) => { const N = [n[0] * c - n[1] * sn, n[0] * sn + n[1] * c, n[2]]; return dot(nrm(N), ST.ZUM_AUGE); }
    };
  }
  function flaecheZ(g, A, pts, farbe, n, F) {
    g.beginPath();
    pts.forEach((q, i) => { const P = A.p(q[0], q[1], q[2]); if (i) g.lineTo(P[0], P[1]); else g.moveTo(P[0], P[1]); });
    g.closePath();
    g.fillStyle = F.schatten ? "#000" : rgb(mal(farbe, A.licht(n)));
    g.fill();
  }
  /* Quader als Figur-Teil: sichtbare Seiten */
  function kastenZ(g, A, F, x0, y0, z0, x1, y1, z1, farbe, oben) {
    const S = [
      { n: [0, 1, 0], p: [[x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0]] },
      { n: [0, -1, 0], p: [[x1, y0, z1], [x0, y0, z1], [x0, y0, z0], [x1, y0, z0]] },
      { n: [1, 0, 0], p: [[x1, y1, z1], [x1, y0, z1], [x1, y0, z0], [x1, y1, z0]] },
      { n: [-1, 0, 0], p: [[x0, y0, z1], [x0, y1, z1], [x0, y1, z0], [x0, y0, z0]] },
      { n: [0, 0, 1], p: [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], c: oben }
    ];
    for (const f of S) if (A.sicht(f.n) > 0.001) flaecheZ(g, A, f.p, f.c || farbe, f.n, F);
  }

  /* Wandlaterne am Turm: Ausleger, sechseckige Laterne */
  function wandLaterne(M, x, y, z, K, Z) {
    M.figur({
      x: x, y: y + 0.42, z: z - 0.62, breite: 0.5, hoehe: 1.0, schatten: true,
      malen(g, s, F) {
        const A = abbild(F, s);
        const sch = F.schatten;
        const eisen = sch ? "#000" : rgb(mal(EISEN, A.licht([0, 0, 1])));
        /* Ausleger zur Wand (−y) mit Zierbogen */
        const pW = A.p(0, -0.42, 0.95), pA = A.p(0, 0, 0.95), pS = A.p(0, -0.42, 0.62);
        g.strokeStyle = eisen; g.lineWidth = Math.max(1, s * 0.03);
        g.beginPath(); g.moveTo(pW[0], pW[1]); g.lineTo(pA[0], pA[1]); g.stroke();
        g.beginPath(); g.moveTo(pS[0], pS[1]); g.quadraticCurveTo(A.p(0, -0.2, 0.7)[0], A.p(0, -0.2, 0.7)[1], A.p(0, -0.05, 0.93)[0], A.p(0, -0.05, 0.93)[1]); g.stroke();
        /* Laterne: Dach, Glas, Boden */
        const P = A.p(0, 0, 0);
        const b = 0.2 * s, hG = 0.36 * ST.KZ * s, yG = P[1] - 0.12 * ST.KZ * s;
        if (sch) { g.fillStyle = "#000"; g.fillRect(P[0] - b / 2, yG - hG, b, hG + 0.12 * s); return; }
        const an = F.nacht > 0.05 && Z.licht;
        const glas = g.createLinearGradient(P[0] - b / 2, 0, P[0] + b / 2, 0);
        if (an) { glas.addColorStop(0, "rgba(255,214,140,0.95)"); glas.addColorStop(0.5, "rgba(255,244,210,1)"); glas.addColorStop(1, "rgba(255,190,110,0.95)"); }
        else { glas.addColorStop(0, "rgba(180,196,210,0.9)"); glas.addColorStop(0.5, "rgba(120,136,150,0.9)"); glas.addColorStop(1, "rgba(70,80,92,0.9)"); }
        g.fillStyle = glas;
        g.beginPath(); g.moveTo(P[0] - b * 0.42, yG); g.lineTo(P[0] + b * 0.42, yG); g.lineTo(P[0] + b / 2, yG - hG); g.lineTo(P[0] - b / 2, yG - hG); g.closePath(); g.fill();
        g.strokeStyle = rgb(hell(EISEN, 0.1)); g.lineWidth = Math.max(0.6, s * 0.012);
        g.beginPath(); g.moveTo(P[0], yG); g.lineTo(P[0], yG - hG); g.stroke();
        g.beginPath(); g.moveTo(P[0] - b * 0.42, yG); g.lineTo(P[0] - b / 2, yG - hG); g.moveTo(P[0] + b * 0.42, yG); g.lineTo(P[0] + b / 2, yG - hG); g.stroke();
        /* Dach und Knauf */
        g.fillStyle = rgb(mal(hell(EISEN, 0.1), A.licht([0, 0, 1])));
        g.beginPath(); g.moveTo(P[0] - b * 0.62, yG - hG); g.lineTo(P[0] + b * 0.62, yG - hG); g.lineTo(P[0], yG - hG - 0.2 * s); g.closePath(); g.fill();
        g.beginPath(); g.arc(P[0], yG - hG - 0.21 * s, 0.025 * s, 0, Math.PI * 2); g.fill();
        if (K.schnee > 0) { g.fillStyle = rgb(mal(SCHNEE, A.licht([0, 0, 1]))); g.beginPath(); g.moveTo(P[0] - b * 0.5, yG - hG - 0.02 * s); g.quadraticCurveTo(P[0], yG - hG - 0.25 * s, P[0] + b * 0.5, yG - hG - 0.02 * s); g.closePath(); g.fill(); }
        /* Boden mit Tropfen */
        g.fillStyle = rgb(mal(EISEN, A.licht([0, 0, -1])));
        g.beginPath(); g.moveTo(P[0] - b * 0.45, yG); g.lineTo(P[0] + b * 0.45, yG); g.lineTo(P[0], yG + 0.1 * s); g.closePath(); g.fill();
        if (an) {
          g.fillStyle = "rgba(255,250,230,1)"; g.beginPath(); g.ellipse(P[0], yG - hG * 0.45, b * 0.12, hG * 0.2, 0, 0, Math.PI * 2); g.fill();
          /* Schein nur, wenn die Turmseite zum Betrachter zeigt – sonst
             leuchtete die Laterne durch den Turm hindurch */
          if (F.leuchtPunkt && A.sicht([0, 1, 0]) > -0.15) F.leuchtPunkt(P[0], yG - hG * 0.5, s * 2.4, "255,200,130", 0.8 * F.nacht);
        }
      }
    });
    if (Z.licht) M.bodenlicht(x, y + 1.3, 2.0, "255,200,130", 0.6);
  }

  /* Fahnenmast auf dem Turm: rot-weiße Stadtfahne */
  function fahne(M, K) {
    const hM = 3.7;
    M.figur({
      x: FAHNE.x, y: FAHNE.y, z: Z_DECK, breite: 1.8, hoehe: hM + 0.2, schatten: true,
      malen(g, s, F) {
        const A = abbild(F, s), KZ = ST.KZ;
        const sch = F.schatten;
        const top = -hM * KZ * s;
        /* Mast */
        const mb = Math.max(1, 0.07 * s);
        const gr = g.createLinearGradient(-mb, 0, mb, 0);
        if (sch) g.fillStyle = "#000";
        else { const L = A.licht([-0.7, 0.7, 0]); gr.addColorStop(0, rgb(mal([236, 232, 222], L))); gr.addColorStop(1, rgb(mal([150, 146, 140], L))); g.fillStyle = gr; }
        g.beginPath(); g.moveTo(-mb * 0.6, 0); g.lineTo(-mb * 0.35, top); g.lineTo(mb * 0.35, top); g.lineTo(mb * 0.6, 0); g.closePath(); g.fill();
        /* Knauf */
        g.fillStyle = sch ? "#000" : "rgb(222,180,80)"; g.beginPath(); g.arc(0, top - 0.06 * s, 0.07 * s, 0, Math.PI * 2); g.fill();
        /* Fahne: wellig, Tuch in zwei Bahnen (rot oben, weiß unten) */
        const fw = 1.45 * s, fh = 0.95 * KZ * s, y0 = top + 0.12 * s;
        const welle = (t) => Math.sin(t * 5.2 + 0.6) * 0.06 * s * t;
        const kante = (yy, k) => { const pts = []; for (let i = 0; i <= 12; i++) { const t = i / 12; pts.push([t * fw * (1 - 0.06 * t), yy + welle(t) + t * t * 0.09 * s * k]); } return pts; };
        const oben = kante(y0, 0), mitte = kante(y0 + fh / 2, 0.5), unten = kante(y0 + fh, 1);
        const bahn = (a, b, c) => {
          g.beginPath(); a.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); for (let i = b.length - 1; i >= 0; i--) g.lineTo(b[i][0], b[i][1]); g.closePath();
          if (sch) { g.fillStyle = "#000"; g.fill(); return; }
          const L = A.licht([0, 0.8, 0.2]);
          const gg = g.createLinearGradient(0, 0, fw, 0);
          for (let i = 0; i <= 6; i++) gg.addColorStop(i / 6, rgb(mal(hell(c, Math.sin(i / 6 * 5.2 + 0.6) * 0.12), L)));
          g.fillStyle = gg; g.fill();
        };
        bahn(oben, mitte, [196, 34, 38]);
        bahn(mitte, unten, [240, 236, 228]);
      }
    });
  }

  /* Schilderhaus: rot-weiß gewinkelt, offen nach Süden, Pyramidendach */
  function schilderhaus(M, Z, K) {
    const { x0, x1, y0, y1, z, zs } = WH, d = 0.05;
    M.teil("schilderhaus", { mitte: [(x0 + x1) / 2, (y0 + y1) / 2, 1.2] });
    const streifen = (A0) => (g, F) => {
      const w = F.w, h = F.h;
      g.fillStyle = "rgb(236,232,224)"; g.fillRect(-0.1, -0.1, w + 0.2, h + 0.2);
      g.save(); g.beginPath(); g.rect(-0.1, 0.12, w + 0.2, h - 0.34); g.clip();
      g.fillStyle = "rgb(178,34,36)";
      /* Winkel (Sparren) nach oben: je 0,16 m breit */
      for (let k = -8; k < 16; k += 2) {
        const yy = k * 0.16;
        g.beginPath(); g.moveTo(-0.1, yy + 0.5); g.lineTo(w / 2, yy); g.lineTo(w + 0.1, yy + 0.5); g.lineTo(w + 0.1, yy + 0.66); g.lineTo(w / 2, yy + 0.16); g.lineTo(-0.1, yy + 0.66); g.closePath(); g.fill();
      }
      g.restore();
      /* Brettfugen, Sockel, Gesims */
      g.fillStyle = "rgba(40,30,30,0.18)"; for (let x = 0.15; x < w; x += 0.15) g.fillRect(x, 0.1, 0.008, h);
      g.fillStyle = "rgb(60,56,54)"; g.fillRect(-0.1, h - 0.22, w + 0.2, 0.24);
      g.fillStyle = "rgb(236,232,224)"; g.fillRect(-0.1, 0, w + 0.2, 0.12);
      g.fillStyle = "rgba(20,20,30,0.3)"; g.fillRect(-0.1, 0.12, w + 0.2, 0.03);
      if (F.px > 8) rausch(g, 0, 0, w, h, 0.8, 0.2, 5, 3);
      if (K.winter && K.Z.fertig) schneeWehe(g, F, 0, w, h, 3);
    };
    /* Rückwand, Seiten außen */
    wandFlaeche(M, "wh-nord", [x1, y0], [x0, y0], 0, z, streifen(0));
    wandFlaeche(M, "wh-ost", [x1, y1], [x1, y0], 0, z, streifen(1));
    wandFlaeche(M, "wh-west", [x0, y0], [x0, y1], 0, z, streifen(2));
    /* Front mit Eingang (Umriss U-förmig) */
    const bw = x1 - x0, ea = 0.16, eb = bw - 0.16, eh = 1.9;
    M.flaeche({ name: "wh-sued", o: [x0, y1, z], u: [1, 0, 0], v: [0, 0, -1], w: bw, h: z, umriss: [[0, 0], [bw, 0], [bw, z], [eb, z], [eb, z - eh], [ea, z - eh], [ea, z], [0, z]], malen: streifen(3), ao: true });
    /* Innen: Rückwand und Seiten, dunkel */
    const innen = (g, F) => { g.fillStyle = "rgb(120,96,76)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); g.fillStyle = "rgba(20,14,12,0.45)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); if (F.px > 10) for (let x = 0.12; x < F.w; x += 0.12) { g.fillStyle = "rgba(0,0,0,0.25)"; g.fillRect(x, 0, 0.01, F.h); } };
    wandFlaeche(M, "wh-in-n", [x0 + d, y0 + d], [x1 - d, y0 + d], 0.05, z - 0.02, innen);
    wandFlaeche(M, "wh-in-w", [x0 + d, y1], [x0 + d, y0 + d], 0.05, z - 0.02, innen);
    wandFlaeche(M, "wh-in-o", [x1 - d, y0 + d], [x1 - d, y1], 0.05, z - 0.02, innen);
    deckel(M, "wh-boden", x0 + d, y0 + d, x1 - d, y1, 0.05, (g, F) => { g.fillStyle = "rgb(90,70,54)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); });
    /* Pyramidendach aus Blech (grau-grün), mit Knauf */
    const ue = 0.1, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, X0 = x0 - ue, X1 = x1 + ue, Y0 = y0 - ue, Y1 = y1 + ue, zt = z - 0.05;
    const blech = (g, F) => {
      g.fillStyle = "rgb(88,104,98)"; g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2);
      g.strokeStyle = "rgba(30,40,40,0.5)"; g.lineWidth = Math.max(0.01, 0.8 / F.px);
      for (let x = 0; x < F.w; x += 0.14) { g.beginPath(); g.moveTo(x, 0); g.lineTo(F.w / 2 + (x - F.w / 2) * 0.1, F.h); g.stroke(); }
      if (F.px > 8) rausch(g, 0, 0, F.w, F.h, 0.6, 0.3, 4, 3);
      if (K.schnee > 0) { g.fillStyle = rgb(SCHNEE, 0.5 + 0.48 * K.schnee); g.fillRect(-0.1, -0.1, F.w + 0.2, F.h + 0.2); }
    };
    const S = [cx, cy, zs];
    polyFlaeche(M, [[X0, Y1, zt], [X1, Y1, zt], S], [0, Y1 - cy, zs - zt], blech, { name: "wh-dach-s" });
    polyFlaeche(M, [[X1, Y1, zt], [X1, Y0, zt], S], [X1 - cx, 0, zs - zt], blech, { name: "wh-dach-o" });
    polyFlaeche(M, [[X1, Y0, zt], [X0, Y0, zt], S], [0, Y0 - cy, zs - zt], blech, { name: "wh-dach-n" });
    polyFlaeche(M, [[X0, Y0, zt], [X0, Y1, zt], S], [X0 - cx, 0, zs - zt], blech, { name: "wh-dach-w" });
    M.figur({ x: cx, y: cy, z: zs, breite: 0.12, hoehe: 0.2, schatten: false, malen(g, s, F) { g.fillStyle = F.schatten ? "#000" : "rgb(210,170,80)"; g.beginPath(); g.arc(0, -0.06 * s, 0.05 * s, 0, Math.PI * 2); g.fill(); g.fillRect(-0.01 * s, -0.02 * s, 0.02 * s, 0.03 * s); } });
  }

  /* Posten vor dem Schilderhaus: blauer Rock, Dreispitz, Muskete */
  function posten(M, K) {
    M.teil("posten", { mitte: [-2.25, 4.45, 0.9] });
    M.figur({
      x: -2.25, y: 4.45, z: 0, breite: 0.6, hoehe: 1.85,
      malen(g, s, F) {
        const k = s / 40, KZ = ST.KZ, h = (m) => -m * KZ * s;
        const sch = F.schatten;
        const L = ST.lichtFaktor([-0.4, 0.8, 0.45], F.Z, 0, F.jahr);
        const f = (c) => {
          if (sch) return "#000";
          /* Rundung: links Licht, rechts Schatten */
          const gr = g.createLinearGradient(-0.24 * s, 0, 0.24 * s, 0);
          gr.addColorStop(0, rgb(mal(hell(c, 0.12), L))); gr.addColorStop(0.45, rgb(mal(c, L))); gr.addColorStop(1, rgb(mal(hell(c, -0.35), L)));
          return gr;
        };
        const rock = [38, 56, 104], hose = [226, 220, 204], leder = [30, 26, 24], haut = [226, 186, 156];
        /* Beine, Gamaschen */
        g.fillStyle = f(hose); g.fillRect(-0.12 * s, h(0.85), 0.1 * s, -h(0.85) - 0.02 * s); g.fillRect(0.02 * s, h(0.85), 0.1 * s, -h(0.85) - 0.02 * s);
        g.fillStyle = f(leder); g.fillRect(-0.13 * s, h(0.28), 0.11 * s, -h(0.28)); g.fillRect(0.02 * s, h(0.28), 0.11 * s, -h(0.28));
        /* Rock mit Schößen */
        g.fillStyle = f(rock);
        g.beginPath(); g.moveTo(-0.19 * s, h(1.45)); g.lineTo(0.19 * s, h(1.45)); g.lineTo(0.22 * s, h(0.72)); g.lineTo(-0.22 * s, h(0.72)); g.closePath(); g.fill();
        g.fillStyle = f([188, 40, 38]); g.fillRect(-0.19 * s, h(1.45), 0.38 * s, 0.05 * s);
        g.fillStyle = f(hose); g.fillRect(-0.04 * s, h(1.42), 0.08 * s, -h(1.42) + h(0.95));
        /* Kreuzriemen */
        g.strokeStyle = f([236, 232, 222]); g.lineWidth = 0.028 * s;
        g.beginPath(); g.moveTo(-0.17 * s, h(1.42)); g.lineTo(0.17 * s, h(0.95)); g.moveTo(0.17 * s, h(1.42)); g.lineTo(-0.17 * s, h(0.95)); g.stroke();
        /* Arme */
        g.fillStyle = f(hell(rock, -0.1)); g.fillRect(-0.26 * s, h(1.42), 0.08 * s, 0.55 * KZ * s); g.fillRect(0.18 * s, h(1.42), 0.08 * s, 0.5 * KZ * s);
        /* Kopf und Dreispitz */
        g.fillStyle = f(haut); g.beginPath(); g.ellipse(0, h(1.58), 0.1 * s, 0.12 * s, 0, 0, Math.PI * 2); g.fill();
        g.fillStyle = f([24, 22, 24]);
        g.beginPath(); g.moveTo(-0.2 * s, h(1.68)); g.quadraticCurveTo(0, h(1.62), 0.2 * s, h(1.68)); g.lineTo(0.12 * s, h(1.86)); g.quadraticCurveTo(0, h(1.8), -0.12 * s, h(1.86)); g.closePath(); g.fill();
        g.fillStyle = f([236, 232, 222]); g.fillRect(-0.2 * s, h(1.69), 0.4 * s, 0.015 * s);
        /* Muskete geschultert (rechte Schulter), Bajonett */
        g.strokeStyle = f([92, 60, 38]); g.lineWidth = 0.045 * s;
        g.beginPath(); g.moveTo(0.23 * s, h(0.95)); g.lineTo(0.27 * s, h(2.05)); g.stroke();
        g.strokeStyle = f([150, 150, 156]); g.lineWidth = 0.02 * s;
        g.beginPath(); g.moveTo(0.27 * s, h(2.05)); g.lineTo(0.285 * s, h(2.35)); g.stroke();
        void k;
      }
    });
  }

  /* Kanone: Bronzerohr auf Wandlafette mit zwei Speichenrädern */
  function kanone(M, K) {
    M.teil("kanone", { mitte: [KAN.x, KAN.y, 0.5] });
    M.figur({
      x: KAN.x, y: KAN.y, z: 0, breite: 2.2, hoehe: 1.1, schatten: true,
      malen(g, s, F) {
        const A = abbild(F, s), sch = F.schatten;
        const d = KAN.dreh * RAD, cd = Math.cos(d), sd = Math.sin(d);
        /* lokales System: Rohr zeigt nach +y (Süden), um d gedreht */
        const T = (x, y, z) => [x * cd - y * sd, x * sd + y * cd, z];
        const P = (x, y, z) => { const q = T(x, y, z); return A.p(q[0], q[1], q[2]); };
        const TN = (n) => T(n[0], n[1], n[2]);
        const holz = [104, 76, 52], bronze = [150, 116, 62];
        const teile = [];
        /* Räder (Achse bei y = 0,15, z = 0,42) */
        const rad = (sx) => {
          const x = sx * 0.42, R = 0.42, pts = [];
          for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2; pts.push([x, 0.15 + Math.cos(a) * R, 0.42 + Math.sin(a) * R]); }
          const mitte = T(x, 0.15, 0.42);
          teile.push({ t: A.tiefe(mitte[0], mitte[1], mitte[2]) + sx * 0.001, f: () => {
            const n = TN([sx, 0, 0]), vis = A.sicht(n) > 0;
            g.beginPath(); pts.forEach((q, i) => { const p = P(q[0], q[1], q[2]); if (i) g.lineTo(p[0], p[1]); else g.moveTo(p[0], p[1]); }); g.closePath();
            g.lineWidth = Math.max(1, 0.08 * s); g.strokeStyle = sch ? "#000" : rgb(mal(hell(holz, -0.15), A.licht(n))); g.stroke();
            if (!sch) { g.lineWidth = Math.max(0.6, 0.02 * s); g.strokeStyle = rgb(mal(EISEN, A.licht([0, 0, 1]))); g.stroke(); }
            /* Speichen */
            g.lineWidth = Math.max(0.8, 0.035 * s); g.strokeStyle = sch ? "#000" : rgb(mal(holz, A.licht(n)));
            const m = P(x, 0.15, 0.42);
            for (let i = 0; i < 12; i += 1) { const a = i / 12 * Math.PI * 2, q = P(x, 0.15 + Math.cos(a) * R * 0.93, 0.42 + Math.sin(a) * R * 0.93); g.beginPath(); g.moveTo(m[0], m[1]); g.lineTo(q[0], q[1]); g.stroke(); }
            g.fillStyle = sch ? "#000" : rgb(mal(EISEN, A.licht(n))); g.beginPath(); g.arc(m[0], m[1], 0.07 * s, 0, Math.PI * 2); g.fill();
            void vis;
          } });
        };
        rad(-1); rad(1);
        /* Lafette: zwei Wangen und Schwanz */
        teilLafette(teile, A, P, T, TN, g, s, sch, holz);
        /* Rohr: konisch, Mündung nach +y */
        const rohr = () => {
          const b0 = [0, -0.62, 0.78], b1 = [0, 1.02, 0.86];
          const R0 = 0.16, R1 = 0.11, n = 18;
          const ringe = [0, 0.12, 0.35, 0.62, 0.93, 1];
          /* Mantel: viele schmale Streifen mit eigenem Licht */
          const pkt = (t, a) => { const r = R0 + (R1 - R0) * t, x = Math.cos(a) * r, z = Math.sin(a) * r; return [b0[0] + x, b0[1] + (b1[1] - b0[1]) * t, b0[2] + (b1[2] - b0[2]) * t + z]; };
          for (let i = 0; i < n; i++) {
            const a0 = i / n * Math.PI * 2, a1 = (i + 1) / n * Math.PI * 2, am = (a0 + a1) / 2;
            const nn = TN([Math.cos(am), 0, Math.sin(am)]);
            if (A.sicht(nn) <= 0) continue;
            const q = [pkt(0, a0), pkt(1, a0), pkt(1, a1), pkt(0, a1)].map((p) => P(p[0], p[1], p[2]));
            g.beginPath(); q.forEach((p, k) => (k ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.closePath();
            g.fillStyle = sch ? "#000" : rgb(mal(hell(bronze, Math.sin(am) * 0.08), A.licht(nn))); g.fill();
            if (!sch) { g.strokeStyle = g.fillStyle; g.lineWidth = 0.6; g.stroke(); }
          }
          if (!sch) {
            /* Verstärkungsringe */
            g.strokeStyle = rgb(mal(hell(bronze, -0.25), A.licht([0, 0, 1]))); g.lineWidth = Math.max(0.8, 0.03 * s);
            for (const t of ringe.slice(1, -1)) { g.beginPath(); for (let i = 0; i <= 12; i++) { const a = i / 12 * Math.PI; const p = pkt(t, a); const P2 = P(p[0], p[1], p[2]); if (i) g.lineTo(P2[0], P2[1]); else g.moveTo(P2[0], P2[1]); } g.stroke(); }
            /* Grünspan */
            g.globalAlpha = 0.25; g.fillStyle = "rgb(80,140,110)";
            const m = P(0, 0.2, 0.95); g.beginPath(); g.ellipse(m[0], m[1], 0.25 * s, 0.06 * s, 0, 0, Math.PI * 2); g.fill(); g.globalAlpha = 1;
          }
          /* Mündung */
          const mp = P(b1[0], b1[1], b1[2]);
          if (A.sicht(TN([0, 1, 0])) > 0) {
            g.fillStyle = sch ? "#000" : rgb(mal(hell(bronze, -0.1), A.licht(TN([0, 1, 0]))));
            const pts = []; for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; pts.push(P(Math.cos(a) * R1 * 1.1, b1[1], b1[2] + Math.sin(a) * R1 * 1.1)); }
            g.beginPath(); pts.forEach((p, k) => (k ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.closePath(); g.fill();
            if (!sch) { g.fillStyle = "rgb(18,16,16)"; const pi = []; for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; pi.push(P(Math.cos(a) * R1 * 0.55, b1[1], b1[2] + Math.sin(a) * R1 * 0.55)); } g.beginPath(); pi.forEach((p, k) => (k ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.closePath(); g.fill(); }
          }
          /* Traube hinten */
          const tp = P(0, b0[1] - 0.1, b0[2]);
          g.fillStyle = sch ? "#000" : rgb(mal(bronze, A.licht([0, 0, 1]))); g.beginPath(); g.arc(tp[0], tp[1], 0.06 * s, 0, Math.PI * 2); g.fill();
          if (K.schnee > 0 && !sch) {
            g.fillStyle = rgb(mal(SCHNEE, A.licht([0, 0, 1])));
            const a = P(0, -0.5, b0[2] + R0 + 0.02), b = P(0, 0.95, b1[2] + R1 + 0.02);
            g.lineCap = "round"; g.strokeStyle = g.fillStyle; g.lineWidth = 0.08 * s * K.schnee;
            g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); g.lineCap = "butt";
          }
        };
        const mR = T(0, 0.2, 0.82);
        teile.push({ t: A.tiefe(mR[0], mR[1], mR[2]) + 0.05, f: rohr });
        teile.sort((a, b) => a.t - b.t);
        for (const t of teile) t.f();
        /* Kugelpyramide neben der Kanone (ohne Drehung des Rohrs) */
        const kugel = (x, y, z) => { const p = A.p(x, y, z + 0.09); g.fillStyle = sch ? "#000" : rgb(mal([74, 72, 74], A.licht([-0.3, 0.3, 0.9]))); g.beginPath(); g.arc(p[0], p[1], 0.085 * s, 0, Math.PI * 2); g.fill(); if (!sch) { g.fillStyle = "rgba(200,200,210,0.35)"; g.beginPath(); g.arc(p[0] - 0.03 * s, p[1] - 0.03 * s, 0.03 * s, 0, Math.PI * 2); g.fill(); if (K.schnee > 0) { g.fillStyle = rgb(SCHNEE); g.beginPath(); g.ellipse(p[0], p[1] - 0.06 * s, 0.07 * s, 0.035 * s, 0, 0, Math.PI * 2); g.fill(); } } };
        const kx = -0.95, ky = 0.55;
        const lage = [];
        for (let i = 0; i < 3; i++) for (let j = 0; j < 3 - i; j++) lage.push([kx + j * 0.18 + i * 0.09, ky + i * 0.05, i * 0.15]);
        lage.sort((a, b) => A.tiefe(a[0], a[1], a[2]) - A.tiefe(b[0], b[1], b[2]));
        for (const q of lage) kugel(q[0], q[1], q[2]);
      }
    });
  }
  function teilLafette(teile, A, P, T, TN, g, s, sch, holz) {
    for (const sx of [-1, 1]) {
      const x0 = sx * 0.24 - 0.05, x1 = sx * 0.24 + 0.05;
      /* Wange: Profil in (y, z) */
      const prof = [[-1.25, 0.05], [-1.25, 0.2], [-0.35, 0.62], [0.05, 0.86], [0.45, 0.86], [0.45, 0.35], [-0.2, 0.22]];
      const mitte = T(sx * 0.24, -0.3, 0.45);
      teile.push({ t: A.tiefe(mitte[0], mitte[1], mitte[2]) + sx * 0.002, f: () => {
        const x = sx > 0 ? (A.sicht(TN([1, 0, 0])) > 0 ? x1 : x0) : (A.sicht(TN([-1, 0, 0])) > 0 ? x0 : x1);
        const n = TN([x === x1 ? 1 : -1, 0, 0]);
        /* Oberkanten (Dicke) */
        for (let i = 0; i < prof.length; i++) {
          const a = prof[i], b = prof[(i + 1) % prof.length];
          const nn = TN([0, -(b[1] - a[1]), b[0] - a[0]].map((v, k) => (k === 0 ? 0 : v)));
          if (A.sicht(nn) <= 0) continue;
          const q = [P(x0, a[0], a[1]), P(x1, a[0], a[1]), P(x1, b[0], b[1]), P(x0, b[0], b[1])];
          g.beginPath(); q.forEach((p, k) => (k ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.closePath();
          g.fillStyle = sch ? "#000" : rgb(mal(hell(holz, 0.05), A.licht(nrm(nn)))); g.fill();
        }
        g.beginPath(); prof.forEach((q, k) => { const p = P(x, q[0], q[1]); if (k) g.lineTo(p[0], p[1]); else g.moveTo(p[0], p[1]); }); g.closePath();
        g.fillStyle = sch ? "#000" : rgb(mal(holz, A.licht(n))); g.fill();
        if (!sch) {
          g.strokeStyle = rgb(mal(EISEN, A.licht(n))); g.lineWidth = Math.max(0.6, 0.025 * s);
          g.stroke();
          const b1 = P(x, -0.9, 0.34), b2 = P(x, -0.3, 0.6); g.beginPath(); g.moveTo(b1[0], b1[1]); g.lineTo(b2[0], b2[1]); g.stroke();
        }
      } });
    }
    /* Achse */
    const am = T(0, 0.15, 0.42);
    teile.push({ t: A.tiefe(am[0], am[1], am[2]) - 0.01, f: () => { const a = P(-0.46, 0.15, 0.42), b = P(0.46, 0.15, 0.42); g.strokeStyle = sch ? "#000" : rgb(mal(EISEN, A.licht([0, 0, 1]))); g.lineWidth = Math.max(1, 0.06 * s); g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); } });
  }

  /* =====================================================================
     MODELL
     ===================================================================== */
  ST.modell("kaserne", {
    name: "Kaserne", gruppe: "Häuser", grund: [12, 10], hoehe: 12, bauzeit: 16 * 60,
    bauen(M, o) {
      const bau = o.bau == null ? 1 : o.bau;
      const Z = zustand(bau);
      const V = variante(o);
      const winter = o.jahr === "winter";
      const K = { Z: Z, V: V, winter: winter, herbst: o.jahr === "herbst", schnee: winter ? Z.schnee : 0 };
      if (Z.grube) grubeBauen(M, Z, K);
      if (Z.haufen > 0.02) {
        M.teil("aushub", { mitte: [4.3, 3.9, 0.4] });
        haufen(M, 4.3, 3.9, 1.35 * Math.sqrt(Z.haufen), 1.1 * Z.haufen, K, 11);
        if (Z.grube) haufen(M, -4.4, 3.8, 1.1 * Math.sqrt(Z.haufen), 0.85 * Z.haufen, K, 12);
      }
      wachbau(M, Z, K);
      dach(M, Z, K);
      kamin(M, Z, K);
      giebel(M, Z, K, true);
      giebel(M, Z, K, false);
      turm(M, Z, K);
      zinnen(M, Z, K);
      if (Z.wachhaus) schilderhaus(M, Z, K);
      if (Z.kanone) kanone(M, K);
      if (Z.posten) posten(M, K);
    }
  });
})();
